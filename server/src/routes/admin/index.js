import authRoutes from './auth.js';
import productsRoutes from './products.js';
import ordersRoutes from './orders.js';
import leadsRoutes from './leads.js';
import capacityRoutes from './capacity.js';
import productionRoutes from './production.js';
import kpisRoutes from './kpis.js';
import deliverySettingsRoutes from './delivery-settings.js';
import promotionsAdminRoutes from './promotions.js';
import cashRoutes from './cash.js';

export default async function adminRoutes(app) {
  await app.register(authRoutes);
  await app.register(productsRoutes);
  await app.register(ordersRoutes);
  await app.register(leadsRoutes);
  await app.register(capacityRoutes);
  await app.register(productionRoutes);
  await app.register(kpisRoutes);
  await app.register(deliverySettingsRoutes);
  await app.register(promotionsAdminRoutes);
  await app.register(cashRoutes);
}
