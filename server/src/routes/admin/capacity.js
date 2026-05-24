import { z } from 'zod';
import { db } from '../../db.js';
import { requireAdmin } from '../../middleware/require-admin.js';

const QuerySchema = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

const SetSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  category: z.enum(['pudim', 'sweet', 'box', 'tray', 'gift']),
  capacityMax: z.number().int().min(0),
});

export default async function adminCapacityRoutes(app) {
  app.addHook('preHandler', requireAdmin);

  // GET /api/admin/capacity?from=2026-05-01&to=2026-05-31
  app.get('/capacity', async (req, reply) => {
    const parsed = QuerySchema.safeParse(req.query);
    if (!parsed.success) return reply.code(400).send({ error: 'invalid_query' });
    const { from, to } = parsed.data;
    const slots = await db.availabilitySlot.findMany({
      where: {
        date: { gte: new Date(`${from}T00:00:00.000Z`), lte: new Date(`${to}T23:59:59.999Z`) },
      },
      orderBy: [{ date: 'asc' }, { category: 'asc' }],
    });
    return { slots };
  });

  // PUT /api/admin/capacity (upsert por date+category)
  app.put('/capacity', async (req, reply) => {
    const parsed = SetSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'invalid_input' });
    const { date, category, capacityMax } = parsed.data;
    const day = new Date(`${date}T00:00:00.000Z`);
    const slot = await db.availabilitySlot.upsert({
      where: { date_category: { date: day, category } },
      update: { capacityMax },
      create: { date: day, category, capacityMax, reserved: 0 },
    });
    return { slot };
  });
}
