import { z } from 'zod';
import { db } from '../../db.js';
import { idempotency } from '../../middleware/idempotency.js';
import { publish } from '../../lib/outbox.js';
import { getDeliverySettings, quoteDeliveryByZip } from '../../lib/delivery-settings.js';

const ItemSchema = z.object({
  productSlug: z.string().trim().min(1).max(80),
  qty: z.number().int().min(1).max(50),
  notes: z.string().max(500).optional(),
});

const OrderSchema = z.object({
  customer: z.object({
    name: z.string().trim().min(2).max(120),
    phone: z.string().trim().min(7).max(40),
    email: z.string().email().max(200).optional(),
    preferredLang: z.enum(['en', 'pt']).default('en'),
  }),
  fulfillment: z.enum(['pickup', 'delivery']),
  requestedFor: z.string().datetime({ offset: true }), // ISO 8601 com offset (+HH:MM ou Z)
  requestedTz: z.string().default('America/New_York'),
  deliveryAddress: z.string().max(500).optional(),
  deliveryZip: z.string().max(20).optional(),
  notes: z.string().max(2000).optional(),
  items: z.array(ItemSchema).min(1).max(20),
  consent: z.literal(true),
  // Honeypot
  website: z.string().max(0).optional().or(z.literal('')),
});

export default async function ordersRoutes(app) {
  app.post(
    '/orders',
    {
      preHandler: idempotency,
      config: { rateLimit: { max: 5, timeWindow: '1 minute' } },
    },
    async (req, reply) => {
      const parsed = OrderSchema.safeParse(req.body);
      if (!parsed.success) {
        return reply.code(400).send({ error: 'invalid_input', issues: parsed.error.issues });
      }
      const data = parsed.data;
      delete data.website;

      // Validar delivery → endereço + ZIP obrigatórios
      if (data.fulfillment === 'delivery' && (!data.deliveryAddress || !data.deliveryZip)) {
        return reply.code(400).send({ error: 'delivery_address_required' });
      }

      // Carregar produtos pra calcular total e descobrir categorias (pra capacity)
      const slugs = data.items.map((i) => i.productSlug);
      const products = await db.product.findMany({
        where: { slug: { in: slugs }, active: true, paused: false, deletedAt: null },
      });
      if (products.length !== slugs.length) {
        return reply.code(400).send({ error: 'product_unavailable', message: 'One or more products are unavailable' });
      }
      const bySlug = new Map(products.map((p) => [p.slug, p]));

      // Reserva capacity pela quantidade real de itens em cada categoria.
      const categoryQty = new Map();
      for (const item of data.items) {
        const product = bySlug.get(item.productSlug);
        if (!product) continue;
        categoryQty.set(product.category, (categoryQty.get(product.category) || 0) + item.qty);
      }

      // Data alvo (00:00 UTC do dia).
      // Mantemos dayUtc como Date pro Prisma client, e dayStr (YYYY-MM-DD)
      // pra usar no $queryRaw — evita ambiguidade de TZ na coerção de timestamp
      // sem TZ que o Prisma faz com Date objects.
      const requestedFor = new Date(data.requestedFor);
      const yyyy = requestedFor.getUTCFullYear();
      const mm = String(requestedFor.getUTCMonth() + 1).padStart(2, '0');
      const dd = String(requestedFor.getUTCDate()).padStart(2, '0');
      const dayStr = `${yyyy}-${mm}-${dd}`;
      const dayUtc = new Date(`${dayStr}T00:00:00.000Z`);

      // Delivery fee by ZIP/radius settings.
      let deliveryFeeCents = 0;
      if (data.fulfillment === 'delivery' && data.deliveryZip) {
        const quote = quoteDeliveryByZip(data.deliveryZip, await getDeliverySettings());
        if (!quote.served) return reply.code(400).send({ error: 'zip_not_served', message: quote.message });
        deliveryFeeCents = quote.feeCents;
      }

      // Subtotal
      const subtotalCents = data.items.reduce((sum, it) => {
        const p = bySlug.get(it.productSlug);
        return sum + (p?.priceCents || 0) * it.qty;
      }, 0);
      const totalCents = subtotalCents + deliveryFeeCents;

      // ============================================================
      // Transação atômica: customer + capacity check + order
      // Race condition guard: SELECT ... FOR UPDATE nos slots
      // ============================================================
      try {
        // timeout 15s — default 5s é agressivo demais pra cold start + lock + insert + items
        const order = await db.$transaction(async (tx) => {
          // Customer upsert por phone
          let customer = await tx.customer.findFirst({ where: { phone: data.customer.phone, deletedAt: null } });
          if (!customer) {
            customer = await tx.customer.create({
              data: {
                name: data.customer.name,
                phone: data.customer.phone,
                email: data.customer.email,
                preferredLang: data.customer.preferredLang,
              },
            });
          }

          // Lock + check capacity de cada categoria envolvida.
          // Cast explícito ::"ProductCategory" porque Postgres não auto-converte string→enum.
          for (const [category, qtyNeeded] of categoryQty.entries()) {
            const rows = await tx.$queryRaw`
              SELECT id, "capacityMax", reserved
              FROM "AvailabilitySlot"
              WHERE date = (${dayStr}::date)::timestamp
                AND category = ${category}::"ProductCategory"
              FOR UPDATE
            `;
            const slot = rows[0];
            if (!slot) {
              throw new HttpError(400, 'no_capacity_slot', `No capacity slot for ${category} on ${data.requestedFor}`);
            }
            if (slot.reserved + qtyNeeded > slot.capacityMax) {
              throw new HttpError(409, 'capacity_full', `${category} fully booked on ${data.requestedFor}`);
            }
            await tx.availabilitySlot.update({
              where: { id: slot.id },
              data: { reserved: { increment: qtyNeeded } },
            });
          }

          // Cria order com items
          const created = await tx.order.create({
            data: {
              customerId: customer.id,
              status: 'requested',
              fulfillment: data.fulfillment,
              requestedFor,
              requestedTz: data.requestedTz,
              deliveryAddress: data.deliveryAddress,
              deliveryZip: data.deliveryZip,
              deliveryFeeCents,
              notes: data.notes,
              subtotalCents,
              totalCents,
              source: 'site',
              items: {
                create: data.items.map((it) => {
                  const p = bySlug.get(it.productSlug);
                  return {
                    productId: p.id,
                    qty: it.qty,
                    priceCents: p.priceCents,
                    notes: it.notes,
                  };
                }),
              },
              transitions: {
                create: { fromStatus: 'draft', toStatus: 'requested', actorType: 'customer' },
              },
            },
            include: { items: true },
          });

          return created;
        }, { timeout: 15000, maxWait: 5000 });

        // Outbox: notifica dona via WhatsApp (fire-and-forget pelo worker)
        await publish('order.requested', { orderId: order.id });

        const responseBody = {
          id: order.id,
          number: order.number,
          status: order.status,
          totalCents: order.totalCents,
          currency: order.currency,
          ok: true,
        };
        await req.saveIdempotency?.(201, responseBody);
        return reply.code(201).send(responseBody);
      } catch (err) {
        if (err instanceof HttpError) {
          return reply.code(err.status).send({ error: err.code, message: err.message });
        }
        req.log.error(err, 'order create failed');
        return reply.code(500).send({ error: 'internal_error' });
      }
    }
  );
}

class HttpError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}
