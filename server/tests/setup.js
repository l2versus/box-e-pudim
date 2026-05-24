// Setup global do Vitest — define env vars dummy ANTES de qualquer import.
// Permite testar módulos que importam config.js sem precisar de .env real.

process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5433/test_db';
process.env.JWT_SECRET = 'test-jwt-secret-' + 'x'.repeat(48);
process.env.ARGON_SECRET = 'test-argon-secret-' + 'x'.repeat(16);
