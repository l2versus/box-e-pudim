/* ============================================================
   Brazilian Kitchen - config central
   Dados reais da operacao em Danbury/CT.
   ============================================================ */
(() => {
  'use strict';

  const config = {
    waPhone: localStorage.getItem('bp-admin-wa-number')?.replace(/\D/g, '') || '12034822797',

    leadTimeHours: 48,
    deliveryFeeCents: 257,
    freeShippingMin: 0,

    // Retirada DESATIVADA por enquanto: a dona esta dentro de um condominio e ainda
    // nao tem ponto de retirada. Quando tiver, basta trocar pra true (volta o toggle).
    pickupEnabled: false,

    // Promocoes (fallback local). Em producao/local-com-API o valor real vem de
    // GET /api/promotions/public, ajustado pela dona em Configuracoes do admin.
    promotions: {
      enabled: true,
      freeDeliveryMinCents: 6000, // pedido >= $60 ganha frete gratis
      discountTiers: [
        { minCents: 9000, percent: 10 },  // >= $90  -> 10% off
        { minCents: 15000, percent: 15 }, // >= $150 -> 15% off
      ],
    },

    pickupWindow: 'Saturday, 5-7 PM',
    supportEmail: 'hello@brazilianpudding.com',
    storeRegion: 'Danbury, CT 06810',

    storeLocation: {
      name: 'Brazilian Pudding',
      city: 'Danbury',
      state: 'CT',
      zip: '06810',
      lat: 41.391768,
      lng: -73.454168,
    },

    delivery: {
      enabled: true,
      unit: 'mi',
      baseZip: '06810',
      maxRadiusMiles: 15,
      fallbackMessage: 'Outside the automatic delivery radius. The owner can confirm by WhatsApp.',
      economics: {
        gasPricePerGallon: 4.70,
        mpg: 22,
        mileageRate: 0.725,
        grossMarginPct: 35,
        safetyBufferPct: 20,
        stopFee: 2.00,
        targetProfit: 35,
        sourceLabel: 'AAA CT regular average + IRS 2026 business mileage',
        updatedAt: '2026-05-25',
      },
      tiers: [
        { id: 'danbury-core', label: 'Danbury core', maxMiles: 5, feeCents: 257, freeMinCents: 13500 },
        { id: 'nearby', label: 'Nearby towns', maxMiles: 10, feeCents: 650, freeMinCents: 16000 },
        { id: 'outer-radius', label: 'Outer radius', maxMiles: 15, feeCents: 950, freeMinCents: 18500 },
      ],
      zipCoordinates: {
        '06810': { city: 'Danbury', lat: 41.391768, lng: -73.454168 },
        '06811': { city: 'Danbury North', lat: 41.4301, lng: -73.4612 },
        '06801': { city: 'Bethel', lat: 41.3712, lng: -73.4140 },
        '06804': { city: 'Brookfield', lat: 41.4826, lng: -73.4096 },
        '06812': { city: 'New Fairfield', lat: 41.4668, lng: -73.4857 },
        '06877': { city: 'Ridgefield', lat: 41.2815, lng: -73.4982 },
        '06896': { city: 'Redding', lat: 41.3026, lng: -73.3926 },
        '06897': { city: 'Wilton', lat: 41.1954, lng: -73.4379 },
        '06880': { city: 'Westport', lat: 41.1415, lng: -73.3579 },
        '06883': { city: 'Weston', lat: 41.2009, lng: -73.3807 },
        '06890': { city: 'Southport', lat: 41.1365, lng: -73.2834 },
        '06824': { city: 'Fairfield', lat: 41.1412, lng: -73.2637 },
        '06825': { city: 'Fairfield North', lat: 41.1909, lng: -73.2637 },
        '06850': { city: 'Norwalk', lat: 41.1223, lng: -73.4387 },
        '06851': { city: 'Norwalk North', lat: 41.1368, lng: -73.4057 },
        '06854': { city: 'Norwalk South', lat: 41.0948, lng: -73.4283 },
        '06855': { city: 'East Norwalk', lat: 41.1045, lng: -73.3948 },
        '06776': { city: 'New Milford', lat: 41.5768, lng: -73.4085 },
        '06470': { city: 'Newtown', lat: 41.4141, lng: -73.3036 },
      },
    },

    adminMode: 'production',

    // Base da API. Dev local (porta 4173) fala direto com o backend Fastify em :3000;
    // produção usa o proxy /api (Cloudflare/Vercel). forceApiLocal destrava o client.js no localhost.
    apiBase:
      ['127.0.0.1', 'localhost'].includes(location.hostname) &&
      ['4173', ''].includes(location.port || '')
        ? 'http://127.0.0.1:3000/api'
        : '/api',
    forceApiLocal:
      ['127.0.0.1', 'localhost'].includes(location.hostname) &&
      ['4173', ''].includes(location.port || ''),

    version: '1.3.0',
  };

  window.BK_CONFIG = config;

  if (config.waPhone === '15551234567') {
    console.warn(
      '[BK_CONFIG] waPhone ainda e o placeholder "15551234567". ' +
      'Defina o numero real em assets/config/config.js antes de subir pra producao.'
    );
  }

  window.bkWaLink = (msg) => `https://wa.me/${config.waPhone}?text=${encodeURIComponent(msg || '')}`;

  window.bkIsValidPreorderDate = (dateStr) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return false;
    const min = new Date();
    min.setHours(min.getHours() + config.leadTimeHours);
    return d.getTime() >= min.getTime();
  };
})();
