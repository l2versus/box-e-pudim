import { z } from 'zod';

// Carrega .env automaticamente em dev (Node 20.6+: --env-file=.env via script,
// mas pra dev local mantemos compat usando dotenv ad-hoc)
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '..', '.env');

if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf-8');
  for (const line of envContent.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, '');
    if (!process.env[key]) process.env[key] = value;
  }
}

const ConfigSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  HOST: z.string().default('127.0.0.1'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),

  DATABASE_URL: z.string().url().startsWith('postgresql://'),

  JWT_SECRET: z.string().min(32, 'JWT_SECRET precisa de ao menos 32 chars (use 64 bytes hex)'),
  JWT_COOKIE_NAME: z.string().default('bep_session'),
  JWT_TTL_HOURS: z.coerce.number().int().positive().default(24),

  ARGON_SECRET: z.string().min(16, 'ARGON_SECRET precisa de ao menos 16 chars'),

  ADMIN_INITIAL_EMAIL: z.string().email().default('admin@brazilianpudding.com'),
  ADMIN_INITIAL_PASS: z.string().min(8).default('ChangeMeOnFirstLogin2026!'),

  CORS_ORIGINS: z
    .string()
    .default('http://127.0.0.1:4173,http://localhost:4173')
    .transform((s) => s.split(',').map((x) => x.trim()).filter(Boolean)),

  TURNSTILE_SECRET: z.string().optional(),

  EVOLUTION_API_URL: z.string().url().optional().or(z.literal('')),
  EVOLUTION_API_KEY: z.string().optional(),
  EVOLUTION_INSTANCE: z.string().default('brazilianpudding'),

  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM: z.string().email().optional(),

  SENTRY_DSN: z.string().url().optional().or(z.literal('')),

  STRIPE_SECRET: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
});

const parsed = ConfigSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('[config] Erro de validação do .env:');
  for (const issue of parsed.error.issues) {
    console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
  }
  console.error('\nCopie server/.env.example para server/.env e preencha os valores.');
  process.exit(1);
}

export const config = parsed.data;
export const isProd = config.NODE_ENV === 'production';
export const isDev = config.NODE_ENV === 'development';
export const isTest = config.NODE_ENV === 'test';
