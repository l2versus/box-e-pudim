import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Desabilita postcss/CSS pipeline — não usamos CSS no backend.
  // Sem isso, Vite tenta carregar postcss.config do home do user (cross-contam).
  css: { postcss: { plugins: [] } },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.js'],
    setupFiles: ['./tests/setup.js'],
    css: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.js'],
      exclude: ['src/server.js'],
    },
  },
});
