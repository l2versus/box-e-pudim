import { db } from '../db.js';

/**
 * Promocoes ajustaveis pela dona (Configuracoes do admin) e refletidas pro cliente:
 *  - freeDeliveryMinCents: pedido a partir desse valor ganha frete gratis
 *  - discountTiers: desconto progressivo por valor do pedido (subtotal)
 * Persistido em BusinessRule key = 'promotions', mesmo padrao do delivery_settings.
 */
export const DEFAULT_PROMOTIONS = {
  enabled: true,
  freeDeliveryMinCents: 6000, // $60
  discountTiers: [
    { minCents: 9000, percent: 10 }, // >= $90 -> 10% off
    { minCents: 15000, percent: 15 }, // >= $150 -> 15% off
  ],
};

const KEY = 'promotions';

export function normalizePromotions(settings = {}) {
  const enabled = settings.enabled !== false;
  const freeDeliveryMinCents = Math.max(
    0,
    Math.round(Number(settings.freeDeliveryMinCents ?? DEFAULT_PROMOTIONS.freeDeliveryMinCents) || 0),
  );
  const tiersInput = Array.isArray(settings.discountTiers) ? settings.discountTiers : DEFAULT_PROMOTIONS.discountTiers;
  const discountTiers = tiersInput
    .map((tier) => ({
      minCents: Math.max(0, Math.round(Number(tier.minCents) || 0)),
      percent: Math.min(90, Math.max(0, Number(tier.percent) || 0)),
    }))
    .filter((tier) => tier.minCents > 0 && tier.percent > 0)
    .sort((a, b) => a.minCents - b.minCents);
  return { enabled, freeDeliveryMinCents, discountTiers };
}

/** Maior desconto aplicavel para um subtotal (em cents). Retorna {percent, discountCents}. */
export function discountForSubtotal(subtotalCents, promotions = DEFAULT_PROMOTIONS) {
  const p = normalizePromotions(promotions);
  if (!p.enabled || !(subtotalCents > 0)) return { percent: 0, discountCents: 0 };
  let percent = 0;
  for (const tier of p.discountTiers) {
    if (subtotalCents >= tier.minCents) percent = tier.percent;
  }
  const discountCents = Math.round((subtotalCents * percent) / 100);
  return { percent, discountCents };
}

/** Frete gratis quando subtotal (ja com desconto) atinge o minimo configurado. */
export function isFreeDelivery(eligibleSubtotalCents, promotions = DEFAULT_PROMOTIONS) {
  const p = normalizePromotions(promotions);
  if (!p.enabled || !p.freeDeliveryMinCents) return false;
  return eligibleSubtotalCents >= p.freeDeliveryMinCents;
}

export async function getPromotions() {
  const rule = await db.businessRule.findUnique({ where: { key: KEY } }).catch(() => null);
  if (!rule?.contentEn) return DEFAULT_PROMOTIONS;
  try {
    return normalizePromotions(JSON.parse(rule.contentEn));
  } catch {
    return DEFAULT_PROMOTIONS;
  }
}

export async function savePromotions(settings) {
  const normalized = normalizePromotions(settings);
  await db.businessRule.upsert({
    where: { key: KEY },
    update: {
      category: 'promotions',
      contentEn: JSON.stringify(normalized),
      contentPt: 'Configuracao de promocoes em JSON',
      active: true,
    },
    create: {
      key: KEY,
      category: 'promotions',
      contentEn: JSON.stringify(normalized),
      contentPt: 'Configuracao de promocoes em JSON',
      active: true,
    },
  });
  return normalized;
}
