import { z } from 'zod';
import { db } from '../../db.js';

const LeadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(7).max(40).optional(),
  email: z.string().email().max(200).optional(),
  productSlug: z.string().trim().max(80).optional(),
  message: z.string().max(2000).optional(),
  preferredLang: z.enum(['en', 'pt', 'es']).optional(),
  consent: z.literal(true, { errorMap: () => ({ message: 'consent must be true (CTDPA)' }) }),
  utmSource: z.string().max(80).optional(),
  utmMedium: z.string().max(80).optional(),
  utmCampaign: z.string().max(80).optional(),
  // Honeypot — bots tendem a preencher; usuário real deixa vazio
  website: z.string().max(0, 'spam detected').optional().or(z.literal('')),
});

export default async function leadsRoutes(app) {
  app.post(
    '/leads',
    {
      config: {
        rateLimit: { max: 3, timeWindow: '1 minute' },
      },
    },
    async (req, reply) => {
      const parsed = LeadSchema.safeParse(req.body);
      if (!parsed.success) {
        return reply.code(400).send({ error: 'invalid_input', issues: parsed.error.issues });
      }
      const data = parsed.data;
      // Drop honeypot field — não persiste
      delete data.website;

      // Linka customer existente por phone/email se houver
      let customerId = null;
      if (data.phone || data.email) {
        const existing = await db.customer.findFirst({
          where: {
            OR: [
              data.phone ? { phone: data.phone } : undefined,
              data.email ? { email: data.email } : undefined,
            ].filter(Boolean),
            deletedAt: null,
          },
        });
        if (existing) {
          customerId = existing.id;
        } else {
          const created = await db.customer.create({
            data: {
              name: data.name,
              phone: data.phone || '',
              email: data.email,
              preferredLang: data.preferredLang || 'en',
            },
          });
          customerId = created.id;
        }
      }

      const lead = await db.lead.create({
        data: {
          customerId,
          name: data.name,
          phone: data.phone,
          email: data.email,
          productSlug: data.productSlug,
          message: data.message,
          source: 'site',
          status: 'new',
          consent: true,
          consentedAt: new Date(),
          utmSource: data.utmSource,
          utmMedium: data.utmMedium,
          utmCampaign: data.utmCampaign,
        },
      });

      return reply.code(201).send({ id: lead.id, ok: true });
    }
  );
}
