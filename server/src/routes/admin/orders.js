import { z } from 'zod';
import { db } from '../../db.js';
import { requireAdmin } from '../../middleware/require-admin.js';
import { assertTransition, allowedTransitions, InvalidTransitionError } from '../../lib/state-machine.js';
import { publish } from '../../lib/outbox.js';

const ListQuerySchema = z.object({
  status: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

const TransitionSchema = z.object({
  toStatus: z.enum([
    'requested', 'confirmed', 'awaiting_payment', 'paid',
    'in_production', 'ready', 'out_for_delivery', 'delivered',
    'cancelled', 'refunded',
  ]),
  reason: z.string().max(500).optional(),
});

// Mapa estado → topic do outbox (notificações WhatsApp/email)
const STATE_TO_TOPIC = {
  confirmed: 'order.confirmed',
  awaiting_payment: 'order.payment_link',
  paid: 'order.paid',
  ready: 'order.ready',
  out_for_delivery: 'order.out_for_delivery',
  cancelled: 'order.cancelled',
  refunded: 'order.cancelled',
};

export default async function adminOrdersRoutes(app) {
  app.addHook('preHandler', requireAdmin);

  // GET /api/admin/orders?status=requested&page=1&pageSize=20
  app.get('/orders', async (req, reply) => {
    const parsed = ListQuerySchema.safeParse(req.query);
    if (!parsed.success) return reply.code(400).send({ error: 'invalid_query' });
    const { status, page, pageSize } = parsed.data;

    const where = status ? { status } : {};
    const [total, orders] = await Promise.all([
      db.order.count({ where }),
      db.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          customer: { select: { id: true, name: true, phone: true, email: true, preferredLang: true } },
          items: { include: { product: { select: { slug: true, name: true } } } },
          payments: { select: { method: true, status: true, amountCents: true, receivedAt: true } },
        },
      }),
    ]);

    return { total, page, pageSize, orders };
  });

  // GET /api/admin/orders/:id
  app.get('/orders/:id', async (req, reply) => {
    const order = await db.order.findUnique({
      where: { id: req.params.id },
      include: {
        customer: true,
        items: { include: { product: true } },
        payments: true,
        transitions: { orderBy: { createdAt: 'asc' }, include: { actor: { select: { name: true, email: true } } } },
      },
    });
    if (!order) return reply.code(404).send({ error: 'not_found' });
    return { order, allowedTransitions: allowedTransitions(order.status) };
  });

  // PATCH /api/admin/orders/:id/status
  app.patch('/orders/:id/status', async (req, reply) => {
    const parsed = TransitionSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'invalid_input', issues: parsed.error.issues });
    const { toStatus, reason } = parsed.data;

    try {
      const updated = await db.$transaction(async (tx) => {
        const order = await tx.order.findUnique({ where: { id: req.params.id } });
        if (!order) throw new HttpError(404, 'not_found');

        assertTransition(order.status, toStatus);

        // Side-effect: cancelled libera capacity
        if (toStatus === 'cancelled' && order.status !== 'cancelled') {
          // Decrementa reserved nas categorias dos itens
          const items = await tx.orderItem.findMany({
            where: { orderId: order.id },
            include: { product: { select: { category: true } } },
          });
          const categories = [...new Set(items.map((i) => i.product.category))];
          const dayUtc = new Date(Date.UTC(
            order.requestedFor.getUTCFullYear(),
            order.requestedFor.getUTCMonth(),
            order.requestedFor.getUTCDate(),
          ));
          for (const category of categories) {
            await tx.availabilitySlot.updateMany({
              where: { date: dayUtc, category, reserved: { gt: 0 } },
              data: { reserved: { decrement: 1 } },
            });
          }
        }

        const result = await tx.order.update({
          where: { id: order.id },
          data: {
            status: toStatus,
            cancelledAt: toStatus === 'cancelled' ? new Date() : order.cancelledAt,
            cancelReason: toStatus === 'cancelled' ? reason : order.cancelReason,
            transitions: {
              create: { fromStatus: order.status, toStatus, actorType: 'admin', actorId: req.user.id, reason },
            },
          },
        });

        return result;
      });

      // Outbox notif (fire-and-forget)
      const topic = STATE_TO_TOPIC[toStatus];
      if (topic) {
        await publish(topic, { orderId: updated.id, reason }).catch((e) =>
          req.log.warn({ err: e }, 'outbox publish failed')
        );
      }

      return { order: updated };
    } catch (err) {
      if (err instanceof InvalidTransitionError) {
        return reply.code(409).send({ error: 'invalid_transition', from: err.from, to: err.to });
      }
      if (err instanceof HttpError) return reply.code(err.status).send({ error: err.code });
      req.log.error(err, 'status transition failed');
      return reply.code(500).send({ error: 'internal_error' });
    }
  });

  // GET /api/admin/orders.csv
  app.get('/orders.csv', async (req, reply) => {
    const orders = await db.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: { customer: true, items: { include: { product: true } } },
    });
    const rows = [
      ['number', 'status', 'created', 'requested_for', 'fulfillment', 'customer', 'phone', 'total_usd', 'items'],
    ];
    for (const o of orders) {
      rows.push([
        o.number,
        o.status,
        o.createdAt.toISOString(),
        o.requestedFor.toISOString(),
        o.fulfillment,
        csvSafe(o.customer.name),
        csvSafe(o.customer.phone),
        (o.totalCents / 100).toFixed(2),
        csvSafe(o.items.map((i) => `${i.qty}x ${i.product.name}`).join('; ')),
      ]);
    }
    const csv = rows.map((r) => r.join(',')).join('\n');
    reply
      .header('Content-Type', 'text/csv; charset=utf-8')
      .header('Content-Disposition', `attachment; filename="orders-${Date.now()}.csv"`);
    return csv;
  });
}

function csvSafe(s) {
  if (s == null) return '';
  const v = String(s);
  return /[,"\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

class HttpError extends Error {
  constructor(status, code) { super(code); this.status = status; this.code = code; }
}
