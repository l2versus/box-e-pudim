// Outbox pattern com pg-boss (Postgres-based job queue, sem Redis).
// Status changes do Order gravam OutboxEvent, worker processa async com retry.
// Evita perder notificações WA/email quando o servidor cai entre status change e disparo.
//
// Topics esperados (extensível):
//   order.requested       — pra dona ("novo pedido de X")
//   order.confirmed       — pra cliente
//   order.payment_link    — pra cliente com instruções
//   order.paid            — pra cliente
//   order.ready           — pra cliente
//   order.cancelled       — pra cliente
//
// Cada handler é registrado via `registerHandler(topic, async (payload) => ...)`.

import PgBoss from 'pg-boss';
import { config } from '../config.js';

let boss = null;
const handlers = new Map();

export async function startOutbox() {
  if (boss) return boss;

  boss = new PgBoss({
    connectionString: config.DATABASE_URL,
    schema: 'pgboss',
    retryLimit: 5,
    retryDelay: 30, // segundos base; pg-boss aplica exponential backoff
    retryBackoff: true,
    expireInHours: 12, // pg-boss exige < 24
  });

  boss.on('error', (err) => {
    console.error('[outbox] pg-boss error', err);
  });

  await boss.start();

  // Registra workers pra cada topic conhecido
  for (const [topic, handler] of handlers) {
    await boss.work(topic, { teamSize: 2, teamConcurrency: 2 }, async (job) => {
      try {
        await handler(job.data);
      } catch (err) {
        console.error(`[outbox:${topic}] handler error`, err);
        throw err; // pg-boss retentará
      }
    });
  }

  console.log('[outbox] started');
  return boss;
}

export async function stopOutbox() {
  if (boss) {
    await boss.stop({ graceful: true, timeout: 5000 });
    boss = null;
  }
}

export function registerHandler(topic, handler) {
  if (typeof handler !== 'function') throw new Error('handler must be a function');
  handlers.set(topic, handler);
}

export async function publish(topic, payload) {
  if (!boss) throw new Error('outbox not started — call startOutbox() first');
  return boss.send(topic, payload);
}
