import { verifySession } from '../auth/jwt.js';
import { config } from '../config.js';
import { db } from '../db.js';

// Hook do Fastify pra rotas /admin/*
// Lê cookie httpOnly, valida JWT, anexa req.user.
export async function requireAdmin(req, reply) {
  const token = req.cookies?.[config.JWT_COOKIE_NAME];
  if (!token) {
    return reply.code(401).send({ error: 'unauthorized', message: 'Missing session' });
  }

  const payload = await verifySession(token);
  if (!payload?.uid) {
    return reply.code(401).send({ error: 'unauthorized', message: 'Invalid session' });
  }

  const user = await db.user.findUnique({
    where: { id: payload.uid },
    select: { id: true, email: true, name: true, role: true, active: true },
  });

  if (!user || !user.active) {
    return reply.code(401).send({ error: 'unauthorized', message: 'User inactive or not found' });
  }

  req.user = user;
}
