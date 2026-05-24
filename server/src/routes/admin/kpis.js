import { db } from '../../db.js';
import { requireAdmin } from '../../middleware/require-admin.js';

export default async function adminKpisRoutes(app) {
  app.addHook('preHandler', requireAdmin);

  // GET /api/admin/kpis
  // Retorna métricas pra dashboard do admin (vendas hoje/semana/mês, abertos, top produtos)
  app.get('/kpis', async () => {
    const now = new Date();
    const startToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const start7d = new Date(startToday); start7d.setUTCDate(start7d.getUTCDate() - 7);
    const start30d = new Date(startToday); start30d.setUTCDate(start30d.getUTCDate() - 30);

    const [
      openOrders,
      paidToday,
      paid7d,
      paid30d,
      newLeads24h,
      topProducts,
    ] = await Promise.all([
      db.order.count({
        where: { status: { in: ['requested', 'confirmed', 'awaiting_payment', 'paid', 'in_production', 'ready', 'out_for_delivery'] } },
      }),
      db.order.aggregate({
        _sum: { totalCents: true },
        _count: true,
        where: { status: { notIn: ['cancelled', 'refunded'] }, createdAt: { gte: startToday } },
      }),
      db.order.aggregate({
        _sum: { totalCents: true },
        _count: true,
        where: { status: { notIn: ['cancelled', 'refunded'] }, createdAt: { gte: start7d } },
      }),
      db.order.aggregate({
        _sum: { totalCents: true },
        _count: true,
        where: { status: { notIn: ['cancelled', 'refunded'] }, createdAt: { gte: start30d } },
      }),
      db.lead.count({ where: { createdAt: { gte: new Date(Date.now() - 86400000) }, deletedAt: null } }),
      db.orderItem.groupBy({
        by: ['productId'],
        _sum: { qty: true },
        orderBy: { _sum: { qty: 'desc' } },
        take: 5,
      }),
    ]);

    const productIds = topProducts.map((t) => t.productId);
    const products = productIds.length
      ? await db.product.findMany({ where: { id: { in: productIds } }, select: { id: true, name: true, slug: true } })
      : [];
    const productMap = new Map(products.map((p) => [p.id, p]));
    const top = topProducts.map((t) => ({
      product: productMap.get(t.productId),
      qty: t._sum.qty || 0,
    }));

    return {
      openOrders,
      revenue: {
        today: { cents: paidToday._sum.totalCents || 0, count: paidToday._count },
        last7d: { cents: paid7d._sum.totalCents || 0, count: paid7d._count },
        last30d: { cents: paid30d._sum.totalCents || 0, count: paid30d._count },
      },
      newLeads24h,
      topProducts: top,
    };
  });
}
