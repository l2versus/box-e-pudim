// State machine do Order — guards declarativos.
// Cada chave é o estado FROM, valor é o set de TO permitidos.
//
// Uso:
//   import { canTransition, assertTransition } from './state-machine.js';
//   if (!canTransition(order.status, 'confirmed')) throw ...
//
// Por que aqui (não no banco): garantir invariante no código antes de UPDATE.
// Postgres permitiria qualquer transição via SQL direto, mas a aplicação valida.

const TRANSITIONS = {
  draft:            new Set(['requested', 'cancelled']),
  requested:        new Set(['confirmed', 'cancelled']),
  confirmed:        new Set(['awaiting_payment', 'cancelled']),
  awaiting_payment: new Set(['paid', 'cancelled']),
  paid:             new Set(['in_production', 'refunded', 'cancelled']),
  in_production:    new Set(['ready', 'cancelled']),
  ready:            new Set(['out_for_delivery', 'delivered', 'cancelled']),
  out_for_delivery: new Set(['delivered', 'cancelled']),
  delivered:        new Set([]), // terminal
  cancelled:        new Set([]), // terminal
  refunded:         new Set([]), // terminal
};

export function canTransition(from, to) {
  if (!from || !to) return false;
  const allowed = TRANSITIONS[from];
  return allowed?.has(to) ?? false;
}

export function assertTransition(from, to) {
  if (!canTransition(from, to)) {
    throw new InvalidTransitionError(from, to);
  }
}

export function allowedTransitions(from) {
  return Array.from(TRANSITIONS[from] ?? []);
}

export class InvalidTransitionError extends Error {
  constructor(from, to) {
    super(`Invalid order status transition: ${from} -> ${to}`);
    this.name = 'InvalidTransitionError';
    this.code = 'INVALID_TRANSITION';
    this.from = from;
    this.to = to;
  }
}
