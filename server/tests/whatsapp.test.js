import { describe, it, expect } from 'vitest';
import { renderTemplate } from '../src/lib/whatsapp.js';

describe('WhatsApp templates', () => {
  it('renders order_confirmed in EN', () => {
    const text = renderTemplate('order_confirmed', 'en', {
      orderNumber: 42,
      requestedFor: 'Sat May 15, 5:30 PM',
      totalUsd: '56.00',
    });
    expect(text).toContain('#42');
    expect(text).toContain('Sat May 15');
    expect(text).toContain('$56.00');
    expect(text).toMatch(/confirmed/i);
  });

  it('renders order_confirmed in PT', () => {
    const text = renderTemplate('order_confirmed', 'pt', {
      orderNumber: 42,
      requestedFor: 'Sáb 15 mai',
      totalUsd: '56.00',
    });
    expect(text).toContain('#42');
    expect(text).toMatch(/confirmado/i);
  });

  it('falls back to EN when lang unknown', () => {
    const text = renderTemplate('cancelled', 'fr', { orderNumber: 1, reason: '' });
    expect(text).toMatch(/cancelled/i);
  });

  it('throws on unknown template', () => {
    expect(() => renderTemplate('nope', 'en', {})).toThrow(/Unknown WA template/);
  });

  it('payment_instructions renders methods list', () => {
    const text = renderTemplate('payment_instructions', 'pt', {
      orderNumber: 1,
      totalUsd: '28.00',
      methods: 'Zelle: a@b.com\nVenmo: @x',
    });
    expect(text).toContain('Zelle');
    expect(text).toContain('Venmo');
    expect(text).toContain('$28.00');
  });
});
