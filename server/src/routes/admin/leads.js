import { z } from 'zod';
import { db } from '../../db.js';
import { requireAdmin } from '../../middleware/require-admin.js';

const ListQuerySchema = z.object({
  status: z.enum(['new', 'contacted', 'converted', 'lost']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

const PatchSchema = z.object({
  status: z.enum(['new', 'contacted', 'converted', 'lost']).optional(),
});

export default async function adminLeadsRoutes(app) {
  app.addHook('preHandler', requireAdmin);

  app.get('/leads', async (req, reply) => {
    const parsed = ListQuerySchema.safeParse(req.query);
    if (!parsed.success) return reply.code(400).send({ error: 'invalid_query' });
    const { status, page, pageSize } = parsed.data;
    const where = { deletedAt: null, ...(status ? { status } : {}) };
    const [total, leads] = await Promise.all([
      db.lead.count({ where }),
      db.lead.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);
    return { total, page, pageSize, leads };
  });

  app.patch('/leads/:id', async (req, reply) => {
    const parsed = PatchSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'invalid_input' });
    const lead = await db.lead.update({ where: { id: req.params.id }, data: parsed.data });
    return { lead };
  });

  app.get('/leads.csv', async (req, reply) => {
    const leads = await db.lead.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
    const rows = [['created', 'name', 'phone', 'email', 'product', 'status', 'message']];
    for (const l of leads) {
      rows.push([
        l.createdAt.toISOString(),
        csvSafe(l.name),
        csvSafe(l.phone),
        csvSafe(l.email),
        csvSafe(l.productSlug),
        l.status,
        csvSafe(l.message),
      ]);
    }
    reply
      .header('Content-Type', 'text/csv; charset=utf-8')
      .header('Content-Disposition', `attachment; filename="leads-${Date.now()}.csv"`);
    return rows.map((r) => r.join(',')).join('\n');
  });
}

function csvSafe(s) {
  if (s == null) return '';
  const v = String(s);
  return /[,"\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}
