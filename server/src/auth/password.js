import argon2 from 'argon2';
import { config } from '../config.js';

const ARGON_OPTS = {
  type: argon2.argon2id,
  secret: Buffer.from(config.ARGON_SECRET),
};

export async function hashPassword(plain) {
  return argon2.hash(plain, ARGON_OPTS);
}

export async function verifyPassword(hash, plain) {
  try {
    return await argon2.verify(hash, plain, ARGON_OPTS);
  } catch {
    return false;
  }
}
