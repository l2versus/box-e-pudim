import { describe, it, expect } from 'vitest';
import {
  canTransition,
  assertTransition,
  allowedTransitions,
  InvalidTransitionError,
} from '../src/lib/state-machine.js';

describe('Order state machine', () => {
  describe('canTransition', () => {
    it('allows happy path: draft → requested → confirmed → awaiting_payment → paid → in_production → ready → delivered', () => {
      expect(canTransition('draft', 'requested')).toBe(true);
      expect(canTransition('requested', 'confirmed')).toBe(true);
      expect(canTransition('confirmed', 'awaiting_payment')).toBe(true);
      expect(canTransition('awaiting_payment', 'paid')).toBe(true);
      expect(canTransition('paid', 'in_production')).toBe(true);
      expect(canTransition('in_production', 'ready')).toBe(true);
      expect(canTransition('ready', 'delivered')).toBe(true);
    });

    it('allows out_for_delivery branch from ready', () => {
      expect(canTransition('ready', 'out_for_delivery')).toBe(true);
      expect(canTransition('out_for_delivery', 'delivered')).toBe(true);
    });

    it('allows cancellation from any non-terminal state', () => {
      const sources = [
        'draft', 'requested', 'confirmed', 'awaiting_payment',
        'paid', 'in_production', 'ready', 'out_for_delivery',
      ];
      for (const from of sources) {
        expect(canTransition(from, 'cancelled')).toBe(true);
      }
    });

    it('allows refund only from paid', () => {
      expect(canTransition('paid', 'refunded')).toBe(true);
      expect(canTransition('confirmed', 'refunded')).toBe(false);
      expect(canTransition('delivered', 'refunded')).toBe(false);
    });

    it('blocks invalid jumps (skip steps)', () => {
      expect(canTransition('draft', 'paid')).toBe(false);
      expect(canTransition('requested', 'delivered')).toBe(false);
      expect(canTransition('confirmed', 'in_production')).toBe(false);
      expect(canTransition('awaiting_payment', 'ready')).toBe(false);
    });

    it('blocks transitions from terminal states', () => {
      for (const to of ['requested', 'paid', 'cancelled']) {
        expect(canTransition('delivered', to)).toBe(false);
        expect(canTransition('cancelled', to)).toBe(false);
        expect(canTransition('refunded', to)).toBe(false);
      }
    });

    it('blocks self-transitions', () => {
      expect(canTransition('paid', 'paid')).toBe(false);
    });

    it('handles invalid input gracefully', () => {
      expect(canTransition(null, 'paid')).toBe(false);
      expect(canTransition('paid', null)).toBe(false);
      expect(canTransition('not-a-state', 'paid')).toBe(false);
    });
  });

  describe('assertTransition', () => {
    it('throws InvalidTransitionError on invalid', () => {
      expect(() => assertTransition('draft', 'paid')).toThrow(InvalidTransitionError);
    });
    it('returns void on valid', () => {
      expect(() => assertTransition('draft', 'requested')).not.toThrow();
    });
    it('error carries from/to', () => {
      try {
        assertTransition('draft', 'paid');
      } catch (err) {
        expect(err.from).toBe('draft');
        expect(err.to).toBe('paid');
        expect(err.code).toBe('INVALID_TRANSITION');
      }
    });
  });

  describe('allowedTransitions', () => {
    it('returns array of valid next states', () => {
      expect(allowedTransitions('draft')).toEqual(expect.arrayContaining(['requested', 'cancelled']));
      expect(allowedTransitions('paid')).toEqual(expect.arrayContaining(['in_production', 'refunded', 'cancelled']));
    });
    it('returns empty for terminal', () => {
      expect(allowedTransitions('delivered')).toEqual([]);
      expect(allowedTransitions('cancelled')).toEqual([]);
      expect(allowedTransitions('refunded')).toEqual([]);
    });
  });
});
