import { getPromotions } from '../../lib/promotions-settings.js';

export default async function promotionsPublicRoutes(app) {
  app.get('/promotions/public', async () => {
    const p = await getPromotions();
    return {
      enabled: p.enabled,
      freeDeliveryMinCents: p.freeDeliveryMinCents,
      discountTiers: p.discountTiers,
    };
  });
}
