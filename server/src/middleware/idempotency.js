import { db } from '../db.js';

// Idempotência via header `Idempotency-Key` (UUID v4 do client).
// Armazena response por 24h. Mesmo key = mesmo response, sem reprocessar.
//
// Uso: registrar como preHandler nas rotas POST que precisam idempotência.

const TTL_HOURS = 24;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function idempotency(req, reply) {
  const key = req.headers['idempotency-key'];
  if (!key) {
    return reply.code(400).send({
      error: 'idempotency_key_required',
      message: 'Header Idempotency-Key (UUID v4) é obrigatório nesta rota',
    });
  }
  if (!UUID_RE.test(key)) {
    return reply.code(400).send({
      error: 'invalid_idempotency_key',
      message: 'Idempotency-Key deve ser UUID v4',
    });
  }

  const existing = await db.idempotencyKey.findUnique({ where: { key } });
  if (existing && existing.expiresAt > new Date()) {
    // Replay — devolve resposta original
    reply.code(existing.responseStatus).header('x-idempotent-replay', 'true');
    return reply.send(existing.responseBody);
  }

  // Anexa pra route handler chamar `req.saveIdempotency(status, body)` no final
  req.idempotencyKey = key;
  req.saveIdempotency = async (status, body) => {
    const expiresAt = new Date(Date.now() + TTL_HOURS * 60 * 60 * 1000);
    await db.idempotencyKey.upsert({
      where: { key },
      update: { resource: req.routeOptions?.url || req.url, responseStatus: status, responseBody: body, expiresAt },
      create: {
        key,
        resource: req.routeOptions?.url || req.url,
        responseStatus: status,
        responseBody: body,
        expiresAt,
      },
    }).catch(() => {}); // se outro processo gravou primeiro, ok
  };
}
