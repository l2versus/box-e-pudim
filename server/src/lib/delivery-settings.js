import { db } from '../db.js';

export const DEFAULT_DELIVERY_SETTINGS = {
  enabled: true,
  unit: 'mi',
  baseZip: '06810',
  maxRadiusMiles: 15,
  store: {
    name: 'Brazilian Pudding',
    city: 'Danbury',
    state: 'CT',
    zip: '06810',
    lat: 41.391768,
    lng: -73.454168,
  },
  fallbackMessage: 'Outside the automatic delivery radius. The owner can confirm by WhatsApp.',
  tiers: [
    { id: 'danbury-core', label: 'Danbury core', maxMiles: 5, feeCents: 257 },
    { id: 'nearby', label: 'Nearby towns', maxMiles: 10, feeCents: 650 },
    { id: 'outer-radius', label: 'Outer radius', maxMiles: 15, feeCents: 950 },
  ],
  zipCoordinates: {
    '06810': { city: 'Danbury', lat: 41.391768, lng: -73.454168 },
    '06811': { city: 'Danbury North', lat: 41.4301, lng: -73.4612 },
    '06801': { city: 'Bethel', lat: 41.3712, lng: -73.4140 },
    '06804': { city: 'Brookfield', lat: 41.4826, lng: -73.4096 },
    '06812': { city: 'New Fairfield', lat: 41.4668, lng: -73.4857 },
    '06877': { city: 'Ridgefield', lat: 41.2815, lng: -73.4982 },
    '06896': { city: 'Redding', lat: 41.3026, lng: -73.3926 },
    '06897': { city: 'Wilton', lat: 41.1954, lng: -73.4379 },
    '06776': { city: 'New Milford', lat: 41.5768, lng: -73.4085 },
    '06470': { city: 'Newtown', lat: 41.4141, lng: -73.3036 },
  },
};

const KEY = 'delivery_settings';
const MILES_PER_KM = 0.621371;

function cleanZip(zip) {
  return String(zip || '').replace(/\D/g, '').slice(0, 5);
}

function normalizeBaseZip(zip) {
  const clean = cleanZip(zip);
  return clean === '06110' ? '06810' : (clean || '06810');
}

function degToRad(value) {
  return (Number(value) * Math.PI) / 180;
}

function distanceMiles(a, b) {
  const radiusKm = 6371;
  const dLat = degToRad(b.lat - a.lat);
  const dLng = degToRad(b.lng - a.lng);
  const lat1 = degToRad(a.lat);
  const lat2 = degToRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * radiusKm * Math.asin(Math.sqrt(h)) * MILES_PER_KM;
}

export function normalizeDeliverySettings(settings = {}) {
  const merged = {
    ...DEFAULT_DELIVERY_SETTINGS,
    ...settings,
    store: { ...DEFAULT_DELIVERY_SETTINGS.store, ...(settings.store || {}) },
    zipCoordinates: {
      ...DEFAULT_DELIVERY_SETTINGS.zipCoordinates,
      ...(settings.zipCoordinates || {}),
    },
  };
  merged.baseZip = normalizeBaseZip(merged.baseZip || merged.store.zip);
  merged.store = {
    ...merged.store,
    city: merged.store.city === 'Hartford' ? 'Danbury' : (merged.store.city || 'Danbury'),
    state: merged.store.state || 'CT',
    zip: normalizeBaseZip(merged.store.zip || merged.baseZip),
    lat: Number(merged.store.lat || DEFAULT_DELIVERY_SETTINGS.store.lat),
    lng: Number(merged.store.lng || DEFAULT_DELIVERY_SETTINGS.store.lng),
  };
  merged.tiers = (Array.isArray(settings.tiers) && settings.tiers.length ? settings.tiers : DEFAULT_DELIVERY_SETTINGS.tiers)
    .map((tier) => ({
      id: String(tier.id || tier.maxMiles),
      label: String(tier.label || `Up to ${tier.maxMiles} mi`),
      maxMiles: Number(tier.maxMiles || 0),
      feeCents: Number(tier.feeCents || 0),
    }))
    .filter((tier) => tier.maxMiles > 0)
    .sort((a, b) => a.maxMiles - b.maxMiles);
  merged.maxRadiusMiles = Number(merged.maxRadiusMiles || merged.tiers.at(-1)?.maxMiles || 15);
  return merged;
}

export async function getDeliverySettings() {
  const rule = await db.businessRule.findUnique({ where: { key: KEY } }).catch(() => null);
  if (!rule?.contentEn) return DEFAULT_DELIVERY_SETTINGS;
  try {
    return normalizeDeliverySettings(JSON.parse(rule.contentEn));
  } catch {
    return DEFAULT_DELIVERY_SETTINGS;
  }
}

export async function saveDeliverySettings(settings) {
  const normalized = normalizeDeliverySettings(settings);
  await db.businessRule.upsert({
    where: { key: KEY },
    update: {
      category: 'delivery',
      contentEn: JSON.stringify(normalized),
      contentPt: 'Configuracao de entrega em JSON',
      active: true,
    },
    create: {
      key: KEY,
      category: 'delivery',
      contentEn: JSON.stringify(normalized),
      contentPt: 'Configuracao de entrega em JSON',
      active: true,
    },
  });
  return normalized;
}

export function quoteDeliveryByZip(zipValue, settings = DEFAULT_DELIVERY_SETTINGS) {
  const data = normalizeDeliverySettings(settings);
  const zip = cleanZip(zipValue);
  if (!zip || zip.length < 5) {
    return { ok: false, served: false, reason: 'zip_required', zip, message: 'Enter a 5-digit ZIP.' };
  }
  const destination = data.zipCoordinates[zip];
  if (!destination) {
    return {
      ok: true,
      served: false,
      reason: 'unknown_zip',
      zip,
      distanceMiles: null,
      feeCents: null,
      message: data.fallbackMessage,
    };
  }
  const distance = distanceMiles(data.store, destination);
  const tier = data.tiers.find((item) => distance <= item.maxMiles);
  if (!tier || distance > data.maxRadiusMiles) {
    return {
      ok: true,
      served: false,
      reason: 'outside_radius',
      zip,
      destination,
      distanceMiles: Number(distance.toFixed(1)),
      feeCents: null,
      message: data.fallbackMessage,
    };
  }
  return {
    ok: true,
    served: true,
    zip,
    destination,
    tier,
    distanceMiles: Number(distance.toFixed(1)),
    feeCents: tier.feeCents,
    message: `${tier.label}: $${(tier.feeCents / 100).toFixed(2)} delivery`,
  };
}
