import productsRoutes from './products.js';
import leadsRoutes from './leads.js';
import availabilityRoutes from './availability.js';
import ordersRoutes from './orders.js';
import deliveryRoutes from './delivery.js';

export default async function publicRoutes(app) {
  await app.register(productsRoutes);
  await app.register(leadsRoutes);
  await app.register(availabilityRoutes);
  await app.register(ordersRoutes);
  await app.register(deliveryRoutes);
}
