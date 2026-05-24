import { z } from 'zod';
import { db } from '../../db.js';

const QuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
  category: z.enum(['pudim', 'sweet', 'box', 'tray', 'gift']).optional(),
});

export default async function availabilityRoutes(app) {
  // GET /api/availability?date=2026-05-15&category=pudim
  app.get('/availability', async (req, reply) => {
    const parsed = QuerySchema.safeParse(req.query);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_query', issues: parsed.error.issues });
    }
    const { date, category } = parsed.data;
    const day = new Date(`${date}T00:00:00.000Z`);

    const where = { date: day };
    if (category) where.category = category;

    const slots = await db.availabilitySlot.findMany({
      where,
      select: { category: true, capacityMax: true, reserved: true },
    });

    const result = slots.map((s) => ({
      category: s.category,
      capacityMax: s.capacityMax,
      reserved: s.reserved,
      available: Math.max(0, s.capacityMax - s.reserved),
    }));

    return { date, slots: result };
  });
}
