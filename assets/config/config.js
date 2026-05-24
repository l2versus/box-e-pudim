/* ============================================================
   Brazilian Kitchen — config central
   Edita aqui ANTES de subir pra produção. Tudo o que muda
   por ambiente passa por esse arquivo.
   ============================================================ */
(() => {
  'use strict';

  const config = {
    // Número WhatsApp da loja — formato internacional, só dígitos.
    // Exemplo Orlando: "14075551234"
    waPhone: localStorage.getItem('bp-admin-wa-number')?.replace(/\D/g, '') || '15551234567',

    // Lead time mínimo (horas) — bloqueia datas anteriores no cart
    leadTimeHours: 48,

    // Frete grátis a partir de (USD)
    freeShippingMin: 299,

    // Janela padrão de pickup
    pickupWindow: 'Saturday, 5–7 PM',

    // Email/contato fallback
    supportEmail: 'hello@brazilianpudding.com',

    // Origem geográfica
    storeRegion: 'Danbury, CT · USA',

    // Modo de admin: "demo" | "production"
    // production exige backend/API com login real.
    adminMode: 'production',

    // Versão (increment manual ao deployar)
    version: '1.0.1',
  };

  // Expor globalmente — leitura by app.js, box.js, admin.js, header.js, cart-drawer.js
  window.BK_CONFIG = config;

  // Warning visível se ainda estiver com o número fake — evita ir pra produção esquecido
  if (config.waPhone === '15551234567') {
    console.warn(
      '[BK_CONFIG] waPhone ainda é o placeholder "15551234567". ' +
      'Defina o número real em assets/config/config.js antes de subir pra produção.'
    );
  }

  // Helper: link wa.me sempre formatado
  window.bkWaLink = (msg) => `https://wa.me/${config.waPhone}?text=${encodeURIComponent(msg || '')}`;

  // Helper: validar data >= hoje + leadTimeHours
  window.bkIsValidPreorderDate = (dateStr) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return false;
    const min = new Date();
    min.setHours(min.getHours() + config.leadTimeHours);
    return d.getTime() >= min.getTime();
  };
})();
