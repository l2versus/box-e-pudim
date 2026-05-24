import Fastify from 'fastify';
import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';

import { config, isDev, isProd } from './config.js';
import { db } from './db.js';
import { startOutbox, stopOutbox } from './lib/outbox.js';
import { registerOutboxHandlers } from './lib/outbox-handlers.js';
import publicRoutes from './routes/public/index.js';
import adminRoutes from './routes/admin/index.js';

const app = Fastify({
  logger: isDev
    ? {
        level: config.LOG_LEVEL,
        transport: { target: 'pino-pretty', options: { colorize: true, translateTime: 'HH:MM:ss' } },
      }
    : { level: config.LOG_LEVEL },
  trustProxy: isProd, // necessário atrás do Cloudflare/Nginx
  bodyLimit: 1024 * 1024, // 1 MB
});

// ============================================================
// Plugins
// ============================================================
await app.register(cookie, { secret: config.JWT_SECRET });

await app.register(cors, {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // mobile apps, curl, mesma origin
    if (config.CORS_ORIGINS.includes(origin)) return cb(null, true);
    cb(new Error('CORS: origin not allowed'), false);
  },
  credentials: true,
});

await app.register(helmet, {
  contentSecurityPolicy: false, // CSP é gerada nos HTMLs do front (nonce strategy — Fase 3)
  crossOriginEmbedderPolicy: false,
});

await app.register(rateLimit, {
  global: false, // ativado per-route (login mais agressivo, leads mais agressivo)
  max: 100,
  timeWindow: '1 minute',
});

// ============================================================
// Healthcheck
// ============================================================
app.get('/api/health', async () => {
  const checks = { ok: true, db: 'unknown', uptime: process.uptime() };
  try {
    await db.$queryRaw`SELECT 1`;
    checks.db = 'ok';
  } catch (err) {
    checks.ok = false;
    checks.db = 'error';
    checks.dbError = String(err?.message || err);
  }
  return checks;
});

// ============================================================
// Routes
// ============================================================
await app.register(publicRoutes, { prefix: '/api' });
await app.register(adminRoutes, { prefix: '/api/admin' });

// ============================================================
// Boot
// ============================================================
async function start() {
  try {
    registerOutboxHandlers();
    // Outbox tolerante: se Postgres offline no boot, loga e segue.
    // Status changes ficam sem notificação WA até o Postgres voltar (a API do
    // Fastify continua respondendo). Próxima rodada: retry job com backoff.
    try {
      await startOutbox();
    } catch (err) {
      app.log.warn({ err: err.message }, 'outbox offline — Fastify segue, notificações desabilitadas');
    }
    await app.listen({ port: config.PORT, host: config.HOST });
    app.log.info(`box-e-pudim api on ${config.HOST}:${config.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

// ============================================================
// Graceful shutdown
// ============================================================
let shuttingDown = false;
async function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  app.log.info(`${signal} received — graceful shutdown`);
  try {
    await app.close();
    await stopOutbox();
    await db.$disconnect();
    process.exit(0);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('unhandledRejection', (reason) => {
  app.log.error({ reason }, 'unhandledRejection');
});

await start();
