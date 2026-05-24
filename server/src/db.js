import { PrismaClient } from '@prisma/client';
import { config, isDev } from './config.js';

// Singleton — evita múltiplas conexões em dev/hot-reload
const globalForPrisma = globalThis;

export const db =
  globalForPrisma.__prisma ??
  new PrismaClient({
    log: isDev ? ['query', 'warn', 'error'] : ['warn', 'error'],
  });

if (isDev) globalForPrisma.__prisma = db;
