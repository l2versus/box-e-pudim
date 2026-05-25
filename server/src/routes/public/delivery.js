import { z } from 'zod';
import { getDeliverySettings, quoteDeliveryByZip } from '../../lib/delivery-settings.js';

const QuoteQuerySchema = z.object({
  zip: z.string().min(1).max(20),
});

export default async function deliveryRoutes(app) {
  app.get('/delivery/quote', async (req, reply) => {
    const parsed = QuoteQuerySchema.safeParse(req.query);
    if (!parsed.success) return reply.code(400).send({ error: 'invalid_query' });
    const settings = await getDeliverySettings();
    return quoteDeliveryByZip(parsed.data.zip, settings);
  });

  app.get('/delivery/settings/public', async () => {
    const settings = await getDeliverySettings();
    return {
      enabled: settings.enabled,
      unit: settings.unit,
      baseZip: settings.baseZip,
      maxRadiusMiles: settings.maxRadiusMiles,
      store: settings.store,
      tiers: settings.tiers,
      zipCoordinates: settings.zipCoordinates,
    };
  });
}
