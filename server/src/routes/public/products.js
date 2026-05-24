import { db } from '../../db.js';

export default async function productsRoutes(app) {
  // GET /api/products?category=pudim
  app.get('/products', async (req) => {
    const { category } = req.query ?? {};
    const where = { active: true, paused: false, deletedAt: null };
    if (category) where.category = category;

    const products = await db.product.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      select: {
        id: true,
        slug: true,
        category: true,
        name: true,
        nameI18n: true,
        description: true,
        descriptionI18n: true,
        priceCents: true,
        imageUrl: true,
        leadTimeHours: true,
      },
    });

    return { products };
  });
}
