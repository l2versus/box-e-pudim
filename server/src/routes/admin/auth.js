import { z } from 'zod';
import { db } from '../../db.js';
import { config } from '../../config.js';
import { verifyPassword, hashPassword } from '../../auth/password.js';
import { signSession, COOKIE_OPTS } from '../../auth/jwt.js';
import { requireAdmin } from '../../middleware/require-admin.js';

const LoginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1).max(200),
});

const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1).max(200),
  newPassword: z.string().min(8).max(200),
});

export default async function adminAuthRoutes(app) {
  // POST /api/admin/login
  app.post(
    '/login',
    {
      config: { rateLimit: { max: 5, timeWindow: '1 minute' } },
    },
    async (req, reply) => {
      const parsed = LoginSchema.safeParse(req.body);
      if (!parsed.success) {
        return reply.code(400).send({ error: 'invalid_input' });
      }
      const { email, password } = parsed.data;

      const user = await db.user.findUnique({ where: { email } });
      // Tempo constante: sempre roda hash (mesmo se user não existe), evita user enumeration
      const ok = user && user.active
        ? await verifyPassword(user.passwordHash, password)
        : (await verifyPassword('$argon2id$v=19$m=65536,t=3,p=4$dummysaltdummysalt$dummyhashdummyhashdummyhashdummyhash', password), false);

      if (!user || !user.active || !ok) {
        await db.auditLog.create({
          data: {
            action: 'failed_login',
            entityType: 'User',
            ip: req.ip,
            userAgent: req.headers['user-agent'],
          },
        }).catch(() => {});
        return reply.code(401).send({ error: 'invalid_credentials' });
      }

      const token = await signSession({ uid: user.id, role: user.role });
      reply.setCookie(config.JWT_COOKIE_NAME, token, COOKIE_OPTS);

      await db.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
      await db.auditLog.create({
        data: {
          actorId: user.id,
          action: 'login',
          entityType: 'User',
          entityId: user.id,
          ip: req.ip,
          userAgent: req.headers['user-agent'],
        },
      }).catch(() => {});

      return reply.send({
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
      });
    }
  );

  // POST /api/admin/logout
  app.post('/logout', async (req, reply) => {
    reply.clearCookie(config.JWT_COOKIE_NAME, { path: '/' });
    return reply.send({ ok: true });
  });

  // GET /api/admin/me
  app.get('/me', { preHandler: requireAdmin }, async (req) => {
    return { user: req.user };
  });

  // POST /api/admin/change-password (logged in)
  app.post('/change-password', { preHandler: requireAdmin }, async (req, reply) => {
    const parsed = ChangePasswordSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'invalid_input' });
    const { currentPassword, newPassword } = parsed.data;

    const user = await db.user.findUnique({ where: { id: req.user.id } });
    const ok = await verifyPassword(user.passwordHash, currentPassword);
    if (!ok) return reply.code(401).send({ error: 'wrong_current_password' });

    const newHash = await hashPassword(newPassword);
    await db.user.update({ where: { id: user.id }, data: { passwordHash: newHash } });
    await db.auditLog.create({
      data: { actorId: user.id, action: 'update', entityType: 'User', entityId: user.id, diff: { field: 'password' } },
    }).catch(() => {});

    return reply.send({ ok: true });
  });
}
