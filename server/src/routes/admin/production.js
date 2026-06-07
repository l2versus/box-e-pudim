import { z } from 'zod';
import { db } from '../../db.js';
import { requireAdmin } from '../../middleware/require-admin.js';

// Status que já contam como "vai pra produção" (dona confirmou).
const TO_PRODUCE = ['confirmed', 'awaiting_payment', 'paid', 'in_production'];
// Ainda não confirmado pela dona — mostrado como provável ("+N?").
const PENDING = ['requested'];

const QuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export default async function adminProductionRoutes(app) {
  app.addHook('preHandler', requireAdmin);

  // GET /api/admin/production?date=YYYY-MM-DD
  // Soma quantidade a produzir por produto e por categoria num dia.
  // O pedido grava requestedFor às 17:00 -04:00, que cai sempre no mesmo dia
  // em UTC — então comparamos pela janela UTC do dia (igual à lógica do slot).
  app.get('/production', async (req, reply) => {
    const parsed = QuerySchema.safeParse(req.query);
    if (!parsed.success) return reply.code(400).send({ error: 'invalid_query' });
    const { date } = parsed.data;

    const dayStart = new Date(`${date}T00:00:00.000Z`);
    const dayEnd = new Date(`${date}T23:59:59.999Z`);

    const orders = await db.order.findMany({
      where: {
        requestedFor: { gte: dayStart, lte: dayEnd },
        status: { in: [...TO_PRODUCE, ...PENDING] },
      },
      select: {
        status: true,
        fulfillment: true,
        items: {
          select: {
            qty: true,
            product: { select: { slug: true, name: true, category: true } },
          },
        },
      },
    });

    const byProduct = new Map();
    const byCategory = new Map();
    let totalUnits = 0;
    let pickups = 0;
    let deliveries = 0;

    for (const o of orders) {
      const bucket = TO_PRODUCE.includes(o.status) ? 'confirmed' : 'pending';
      if (o.fulfillment === 'delivery') deliveries += 1; else pickups += 1;
      for (const it of o.items) {
        const slug = it.product.slug;
        const prod = byProduct.get(slug) || {
          slug, name: it.product.name, category: it.product.category, confirmed: 0, pending: 0,
        };
        prod[bucket] += it.qty;
        byProduct.set(slug, prod);

        const cat = byCategory.get(it.product.category) || {
          category: it.product.category, confirmed: 0, pending: 0,
        };
        cat[bucket] += it.qty;
        byCategory.set(it.product.category, cat);

        if (bucket === 'confirmed') totalUnits += it.qty;
      }
    }

    const products = [...byProduct.values()].sort(
      (a, b) => (b.confirmed + b.pending) - (a.confirmed + a.pending)
    );

    return {
      date,
      orderCount: orders.length,
      pickups,
      deliveries,
      totalUnits, // só confirmados
      products,
      categories: [...byCategory.values()],
    };
  });
}
