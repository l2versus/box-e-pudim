// Registra handlers do outbox: cada topic carrega o Order e dispara WhatsApp.
// Worker do pg-boss invoca esses handlers async com retry exponencial.
//
// Erros propagados → pg-boss tenta novamente (até 5x), depois DLQ.

import { db } from '../db.js';
import { registerHandler } from './outbox.js';
import { sendTemplate } from './whatsapp.js';

function fmtDate(date, tz) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: tz || 'America/New_York',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

async function loadOrder(orderId) {
  return db.order.findUnique({
    where: { id: orderId },
    include: { customer: true, items: { include: { product: true } } },
  });
}

export function registerOutboxHandlers() {
  registerHandler('order.requested', async ({ orderId }) => {
    const order = await loadOrder(orderId);
    if (!order) return;
    // Notifica DONA — número fica em ENV ou config; por enquanto só log
    console.log(`[outbox] order.requested #${order.number} from ${order.customer.name}`);
  });

  registerHandler('order.confirmed', async ({ orderId }) => {
    const order = await loadOrder(orderId);
    if (!order) return;
    await sendTemplate(order.customer.phone, 'order_confirmed', order.customer.preferredLang, {
      orderNumber: order.number,
      requestedFor: fmtDate(order.requestedFor, order.requestedTz),
      totalUsd: (order.totalCents / 100).toFixed(2),
    });
  });

  registerHandler('order.payment_link', async ({ orderId, methods }) => {
    const order = await loadOrder(orderId);
    if (!order) return;
    await sendTemplate(order.customer.phone, 'payment_instructions', order.customer.preferredLang, {
      orderNumber: order.number,
      totalUsd: (order.totalCents / 100).toFixed(2),
      methods: methods || 'Zelle: hello@brazilianpudding.com\nVenmo: @brazilianpudding\nCash App: $brazilianpudding',
    });
  });

  registerHandler('order.paid', async ({ orderId }) => {
    const order = await loadOrder(orderId);
    if (!order) return;
    await sendTemplate(order.customer.phone, 'payment_received', order.customer.preferredLang, {
      orderNumber: order.number,
    });
  });

  registerHandler('order.ready', async ({ orderId }) => {
    const order = await loadOrder(orderId);
    if (!order) return;
    await sendTemplate(order.customer.phone, 'ready_for_pickup', order.customer.preferredLang, {
      orderNumber: order.number,
      pickupWindow: order.pickupWindow || 'Saturday, 5–7 PM',
      address: 'Danbury, CT — exact address sent on confirmation',
    });
  });

  registerHandler('order.out_for_delivery', async ({ orderId }) => {
    const order = await loadOrder(orderId);
    if (!order) return;
    await sendTemplate(order.customer.phone, 'out_for_delivery', order.customer.preferredLang, {
      orderNumber: order.number,
      address: order.deliveryAddress || '',
    });
  });

  registerHandler('order.cancelled', async ({ orderId, reason }) => {
    const order = await loadOrder(orderId);
    if (!order) return;
    await sendTemplate(order.customer.phone, 'cancelled', order.customer.preferredLang, {
      orderNumber: order.number,
      reason,
    });
  });
}
