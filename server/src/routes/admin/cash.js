import { z } from 'zod';
import { db } from '../../db.js';
import { requireAdmin } from '../../middleware/require-admin.js';

// Caixa (cash register) — turno operacional.
// Modelo: 1 sessão aberta por vez. Abertura cria um fundo de troco; durante o
// turno entram vendas/reforços e saem sangrias; no fechamento calcula o esperado
// e (se a dona contou) a diferença pro contado.

const OpenSchema = z.object({
  openingCents: z.coerce.number().int().min(0).max(100000000).default(0),
  notes: z.string().max(500).optional(),
});

// Tipos que a dona registra manualmente no turno (opening é interno; adjustment fica pro futuro).
const TxSchema = z.object({
  type: z.enum(['sale', 'reforco', 'sangria']),
  amountCents: z.coerce.number().int().min(1).max(100000000),
  reason: z.string().max(500).optional(),
  orderNumber: z.coerce.number().int().positive().optional(),
});

const CloseSchema = z.object({
  closingCents: z.coerce.number().int().min(0).max(100000000).optional(),
  notes: z.string().max(500).optional(),
});

// Soma as movimentações da sessão. `opening` não entra na soma (já é a base).
function summarize(session) {
  let sales = 0;
  let reforco = 0;
  let sangria = 0;
  for (const tx of session.transactions || []) {
    if (tx.type === 'sale') sales += tx.amountCents;
    else if (tx.type === 'reforco') reforco += tx.amountCents;
    else if (tx.type === 'sangria') sangria += tx.amountCents;
  }
  const openingCents = session.openingCents || 0;
  const expectedCents = openingCents + sales + reforco - sangria;
  return { openingCents, salesCents: sales, reforcoCents: reforco, sangriaCents: sangria, expectedCents };
}

// Sessão aberta + movimentações ordenadas (mais recente primeiro) + resumo.
async function loadOpenSession() {
  const session = await db.cashSession.findFirst({
    where: { status: 'open' },
    include: { transactions: { orderBy: { createdAt: 'desc' } } },
  });
  if (!session) return null;
  return { ...session, summary: summarize(session) };
}

export default async function adminCashRoutes(app) {
  app.addHook('preHandler', requireAdmin);

  // GET /api/admin/cash/current — sessão aberta (ou { session: null }).
  app.get('/cash/current', async () => {
    return { session: await loadOpenSession() };
  });

  // POST /api/admin/cash/open — abre o caixa (409 se já houver um aberto).
  app.post('/cash/open', async (req, reply) => {
    const parsed = OpenSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'invalid_input', issues: parsed.error.issues });

    const existing = await db.cashSession.findFirst({ where: { status: 'open' } });
    if (existing) return reply.code(409).send({ error: 'already_open', message: 'Já existe um caixa aberto.' });

    const { openingCents, notes } = parsed.data;
    await db.cashSession.create({
      data: {
        openingCents,
        notes,
        openedById: req.user.id,
        openedByName: req.user.name || req.user.email,
        // movimento de abertura aparece na lista (não conta no resumo)
        transactions: openingCents > 0
          ? { create: { type: 'opening', amountCents: openingCents, reason: 'Abertura de caixa', createdById: req.user.id } }
          : undefined,
      },
    });
    return { session: await loadOpenSession() };
  });

  // POST /api/admin/cash/transactions — registra venda/reforço/sangria (409 se não houver caixa aberto).
  app.post('/cash/transactions', async (req, reply) => {
    const parsed = TxSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'invalid_input', issues: parsed.error.issues });

    const session = await db.cashSession.findFirst({ where: { status: 'open' } });
    if (!session) return reply.code(409).send({ error: 'no_open_session', message: 'Abra o caixa antes de registrar movimentações.' });

    const { type, amountCents, reason, orderNumber } = parsed.data;
    let orderId;
    if (orderNumber) {
      const order = await db.order.findUnique({ where: { number: orderNumber }, select: { id: true } });
      orderId = order?.id;
    }

    await db.cashTransaction.create({
      data: { sessionId: session.id, type, amountCents, reason, orderNumber, orderId, createdById: req.user.id },
    });
    return { session: await loadOpenSession() };
  });

  // POST /api/admin/cash/close — fecha o caixa, grava esperado + diferença.
  app.post('/cash/close', async (req, reply) => {
    const parsed = CloseSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'invalid_input', issues: parsed.error.issues });

    const open = await loadOpenSession();
    if (!open) return reply.code(409).send({ error: 'no_open_session', message: 'Nenhum caixa aberto.' });

    const { closingCents, notes } = parsed.data;
    const expectedCents = open.summary.expectedCents;
    const differenceCents = closingCents != null ? closingCents - expectedCents : null;

    const closed = await db.cashSession.update({
      where: { id: open.id },
      data: {
        status: 'closed',
        closingCents: closingCents ?? null,
        expectedCents,
        differenceCents,
        closedById: req.user.id,
        closedByName: req.user.name || req.user.email,
        closedAt: new Date(),
        notes: notes ?? open.notes,
      },
      include: { transactions: { orderBy: { createdAt: 'desc' } } },
    });
    return { session: { ...closed, summary: summarize(closed) } };
  });

  // GET /api/admin/cash/sessions?limit=N — histórico de turnos fechados (relatórios).
  app.get('/cash/sessions', async (req) => {
    const limit = Math.min(50, Math.max(1, Number(req.query?.limit) || 10));
    const sessions = await db.cashSession.findMany({
      where: { status: 'closed' },
      orderBy: { closedAt: 'desc' },
      take: limit,
      select: {
        id: true, openingCents: true, closingCents: true, expectedCents: true,
        differenceCents: true, openedByName: true, closedByName: true,
        openedAt: true, closedAt: true,
      },
    });
    return { sessions };
  });
}
