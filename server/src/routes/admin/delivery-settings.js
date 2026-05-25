import { z } from 'zod';
import { requireAdmin } from '../../middleware/require-admin.js';
import { getDeliverySettings, saveDeliverySettings } from '../../lib/delivery-settings.js';

const TierSchema = z.object({
  id: z.string().max(80).optional(),
  label: z.string().trim().min(2).max(120),
  maxMiles: z.coerce.number().positive().max(200),
  feeCents: z.coerce.number().int().min(0).max(100000),
});

const StoreSchema = z.object({
  name: z.string().max(120).optional(),
  city: z.string().max(120).optional(),
  state: z.string().max(20).optional(),
  zip: z.string().max(20).optional(),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
});

const SettingsSchema = z.object({
  enabled: z.boolean().default(true),
  unit: z.enum(['mi', 'km']).default('mi'),
  baseZip: z.string().trim().min(5).max(20),
  maxRadiusMiles: z.coerce.number().positive().max(200),
  store: StoreSchema,
  fallbackMessage: z.string().max(500).optional(),
  tiers: z.array(TierSchema).min(1).max(8),
  zipCoordinates: z.record(z.object({
    city: z.string().max(120).optional(),
    lat: z.coerce.number().min(-90).max(90),
    lng: z.coerce.number().min(-180).max(180),
  })).optional(),
});

export default async function deliverySettingsRoutes(app) {
  app.addHook('preHandler', requireAdmin);

  app.get('/delivery-settings', async () => {
    return { settings: await getDeliverySettings() };
  });

  app.put('/delivery-settings', async (req, reply) => {
    const parsed = SettingsSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'invalid_input', issues: parsed.error.issues });
    return { settings: await saveDeliverySettings(parsed.data) };
  });
}
