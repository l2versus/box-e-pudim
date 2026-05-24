// Evolution API wrapper — só notificações outbound triggadas (sem chatbot).
// Cliente provisiona VPS com Evolution Docker e fornece URL + API key via .env.
//
// Risco de ban: baixíssimo nessa configuração (5-20 msg/dia, padrão de negócio normal).
//
// Templates ficam em strings i18n simples (sem aprovação Meta — vantagem do Evolution).

import { config } from '../config.js';

const ENABLED = !!(config.EVOLUTION_API_URL && config.EVOLUTION_API_KEY);

if (!ENABLED) {
  console.warn('[whatsapp] Evolution API não configurada (EVOLUTION_API_URL / EVOLUTION_API_KEY ausentes). Mensagens serão logadas mas não enviadas.');
}

// ============================================================
// Templates i18n (PT/EN)
// ============================================================
const TEMPLATES = {
  order_requested: {
    en: ({ orderNumber, customerName, productName, requestedFor }) =>
      `New order #${orderNumber}\nCustomer: ${customerName}\nProduct: ${productName}\nDate: ${requestedFor}`,
    pt: ({ orderNumber, customerName, productName, requestedFor }) =>
      `Novo pedido #${orderNumber}\nCliente: ${customerName}\nProduto: ${productName}\nData: ${requestedFor}`,
  },
  order_confirmed: {
    en: ({ orderNumber, requestedFor, totalUsd }) =>
      `Hi! Your order #${orderNumber} for ${requestedFor} is confirmed. Total: $${totalUsd}. We'll send payment instructions next.`,
    pt: ({ orderNumber, requestedFor, totalUsd }) =>
      `Olá! Seu pedido #${orderNumber} para ${requestedFor} está confirmado. Total: $${totalUsd}. Vamos enviar as instruções de pagamento em seguida.`,
  },
  payment_instructions: {
    en: ({ orderNumber, totalUsd, methods }) =>
      `Order #${orderNumber} — $${totalUsd}\nPay via:\n${methods}\nReply with the payment confirmation screenshot.`,
    pt: ({ orderNumber, totalUsd, methods }) =>
      `Pedido #${orderNumber} — $${totalUsd}\nPagamento via:\n${methods}\nResponda com o comprovante de pagamento.`,
  },
  payment_received: {
    en: ({ orderNumber }) =>
      `Payment received for order #${orderNumber}. Production starting soon, we'll keep you posted!`,
    pt: ({ orderNumber }) =>
      `Pagamento recebido do pedido #${orderNumber}. Produção começando em breve, te avisamos!`,
  },
  ready_for_pickup: {
    en: ({ orderNumber, pickupWindow, address }) =>
      `Your order #${orderNumber} is ready! Pickup: ${pickupWindow}\nAddress: ${address}`,
    pt: ({ orderNumber, pickupWindow, address }) =>
      `Seu pedido #${orderNumber} está pronto! Retirada: ${pickupWindow}\nEndereço: ${address}`,
  },
  out_for_delivery: {
    en: ({ orderNumber, address }) =>
      `Order #${orderNumber} out for delivery to ${address}.`,
    pt: ({ orderNumber, address }) =>
      `Pedido #${orderNumber} saiu para entrega em ${address}.`,
  },
  cancelled: {
    en: ({ orderNumber, reason }) =>
      `Order #${orderNumber} was cancelled.${reason ? ' Reason: ' + reason : ''}`,
    pt: ({ orderNumber, reason }) =>
      `Pedido #${orderNumber} foi cancelado.${reason ? ' Motivo: ' + reason : ''}`,
  },
};

export function renderTemplate(name, lang, vars) {
  const tpl = TEMPLATES[name];
  if (!tpl) throw new Error(`Unknown WA template: ${name}`);
  const fn = tpl[lang] || tpl.en;
  return fn(vars);
}

// ============================================================
// Envio
// ============================================================
export async function sendText(to, text) {
  if (!ENABLED) {
    console.log(`[whatsapp:dryrun] -> ${to}\n${text}`);
    return { dryRun: true };
  }

  const url = `${config.EVOLUTION_API_URL.replace(/\/$/, '')}/message/sendText/${encodeURIComponent(config.EVOLUTION_INSTANCE)}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: config.EVOLUTION_API_KEY,
    },
    body: JSON.stringify({ number: to, text }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Evolution sendText failed: ${res.status} ${body}`);
  }

  return res.json();
}

export async function sendTemplate(to, templateName, lang, vars) {
  const text = renderTemplate(templateName, lang, vars);
  return sendText(to, text);
}
