// Seed de produção — cria APENAS o admin user inicial.
// NÃO popula com dados de exemplo (pra não poluir prod).
// Rodar UMA VEZ após deploy: npm run db:seed:prod
//
// Após primeiro login, dona deve trocar a senha imediatamente.

import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';
import { config } from '../src/config.js';

const prisma = new PrismaClient();

async function main() {
  console.log('[seed-prod] Iniciando…');

  if (config.NODE_ENV !== 'production') {
    console.warn('[seed-prod] AVISO: NODE_ENV != production. Você quis rodar `db:seed`?');
  }

  const passwordHash = await argon2.hash(config.ADMIN_INITIAL_PASS, {
    type: argon2.argon2id,
    secret: Buffer.from(config.ARGON_SECRET),
  });

  const admin = await prisma.user.upsert({
    where: { email: config.ADMIN_INITIAL_EMAIL },
    update: {},
    create: {
      email: config.ADMIN_INITIAL_EMAIL,
      passwordHash,
      name: 'Owner',
      role: 'owner',
    },
  });

  console.log(`[seed-prod] Admin criado/garantido: ${admin.email}`);
  console.log('[seed-prod] AÇÃO REQUERIDA: faça login e troque a senha imediatamente.');
}

main()
  .catch((e) => {
    console.error('[seed-prod] Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
