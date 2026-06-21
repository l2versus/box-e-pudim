import { z } from 'zod';
import { requireAdmin } from '../../middleware/require-admin.js';
import { getPromotions, savePromotions } from '../../lib/promotions-settings.js';

const TierSchema = z.object({
  minCents: z.coerce.number().int().min(0).max(1000000),
  percent: z.coerce.number().min(0).max(90),
});

const PromotionsSchema = z.object({
  enabled: z.boolean().default(true),
  freeDeliveryMinCents: z.coerce.number().int().min(0).max(1000000),
  discountTiers: z.array(TierSchema).max(8).default([]),
});

export default async function promotionsAdminRoutes(app) {
  app.addHook('preHandler', requireAdmin);

  app.get('/promotions', async () => {
    return { promotions: await getPromotions() };
  });

  app.put('/promotions', async (req, reply) => {
    const parsed = PromotionsSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'invalid_input', issues: parsed.error.issues });
    return { promotions: await savePromotions(parsed.data) };
  });
}
