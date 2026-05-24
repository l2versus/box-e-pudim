import { z } from 'zod';
import { db } from '../../db.js';
import { requireAdmin } from '../../middleware/require-admin.js';

const ProductSchema = z.object({
  slug: z.string().trim().min(2).max(80).regex(/^[a-z0-9-]+$/, 'slug deve ser kebab-case'),
  category: z.enum(['pudim', 'sweet', 'box', 'tray', 'gift']),
  name: z.string().trim().min(2).max(200),
  nameI18n: z.record(z.string()).optional(),
  description: z.string().max(2000).optional(),
  descriptionI18n: z.record(z.string()).optional(),
  priceCents: z.number().int().min(0),
  imageUrl: z.string().max(500).optional(),
  active: z.boolean().default(true),
  paused: z.boolean().default(false),
  leadTimeHours: z.number().int().min(0).default(48),
  maxQtyPerDay: z.number().int().min(0).optional(),
  sortOrder: z.number().int().default(0),
});

export default async function adminProductsRoutes(app) {
  app.addHook('preHandler', requireAdmin);

  // GET /api/admin/products (lista todos, inclusive inativos)
  app.get('/products', async () => {
    const products = await db.product.findMany({
      where: { deletedAt: null },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
    return { products };
  });

  // POST /api/admin/products
  app.post('/products', async (req, reply) => {
    const parsed = ProductSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'invalid_input', issues: parsed.error.issues });
    try {
      const product = await db.product.create({ data: parsed.data });
      await audit(req, 'create', 'Product', product.id, { after: product });
      return reply.code(201).send({ product });
    } catch (err) {
      if (err.code === 'P2002') return reply.code(409).send({ error: 'slug_taken' });
      throw err;
    }
  });

  // PATCH /api/admin/products/:id
  app.patch('/products/:id', async (req, reply) => {
    const parsed = ProductSchema.partial().safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'invalid_input' });
    const before = await db.product.findUnique({ where: { id: req.params.id } });
    if (!before) return reply.code(404).send({ error: 'not_found' });
    const after = await db.product.update({ where: { id: req.params.id }, data: parsed.data });
    await audit(req, 'update', 'Product', after.id, { before, after });
    return { product: after };
  });

  // DELETE /api/admin/products/:id (soft)
  app.delete('/products/:id', async (req, reply) => {
    const before = await db.product.findUnique({ where: { id: req.params.id } });
    if (!before) return reply.code(404).send({ error: 'not_found' });
    const after = await db.product.update({
      where: { id: req.params.id },
      data: { deletedAt: new Date(), active: false },
    });
    await audit(req, 'delete', 'Product', after.id, { before });
    return reply.code(204).send();
  });
}

async function audit(req, action, entityType, entityId, diff) {
  await db.auditLog.create({
    data: {
      actorId: req.user.id,
      action,
      entityType,
      entityId,
      diff,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    },
  }).catch(() => {});
}
