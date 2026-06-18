/* ============================================================
   Box InHouse — i18n PT dos produtos do catálogo
   Ouve mudança de idioma e troca title/description/label/tag
   ============================================================ */
(() => {
  'use strict';

  const PT = {
    cups: {
      title: 'Torre de taças de sobremesa',
      description: 'Doces brasileiros em camadas, embalados individualmente para festas, escritório e fim de semana em família.',
      label: 'Taças de Sobremesa',
      tag: 'Doces',
    },
    classicPudim: {
      title: 'Pudim brasileiro classico',
      description: 'Pudim de caramelo brilhante como sobremesa junto do pedido Box InHouse.',
      label: 'Pudim Classico',
      tag: 'Sobremesa',
    },
    berryPudim: {
      title: 'Pudim de frutas vermelhas',
      description: 'Pudim cremoso com calda de frutas vermelhas para complementar o pedido.',
      label: 'Pudim Frutas Vermelhas',
      tag: 'Sobremesa',
    },
    giftPudim: {
      title: 'Pudim para presente',
      description: 'Apresentacao caprichada de pudim para enviar junto de boxes e presentes.',
      label: 'Pudim Presente',
      tag: 'Sobremesa',
    },
    shrimp: {
      title: 'Bandeja de camarão crocante',
      description: 'Camarão dourado sobre batata palha crocante, preparado para retirada ou entrega sob agendamento.',
      label: 'Camarão Crocante',
      tag: 'Salgado',
    },
    weekend: {
      title: 'Box de fim de semana em família',
      description: 'Box rotativa de comida brasileira de conforto para pequenos encontros e fins de semana sem stress.',
      label: 'Box Fim de Semana',
      tag: 'Família',
    },
    beefRice: {
      title: 'Box de carne com arroz',
      description: 'Carne ao estilo brasileiro com arroz, legumes e embalagem pronta para retirada.',
      label: 'Box Arroz com Carne',
      tag: 'Almoço',
    },
    fitGroundBeef: {
      title: 'Box fit de carne moída',
      description: 'Carne moída, arroz e legumes para encomendas semanais equilibradas.',
      label: 'Box Fit Carne Moída',
      tag: 'Fit',
    },
    grilledChicken: {
      title: 'Box de frango grelhado',
      description: 'Frango temperado sobre arroz, preparado em lotes para a semana.',
      label: 'Box Frango Grelhado',
      tag: 'Almoço',
    },
    meatballPasta: {
      title: 'Box de macarrão com almôndegas',
      description: 'Massa reconfortante com almôndegas, molho e embalagem pronta para compartilhar.',
      label: 'Macarrão com Almôndegas',
      tag: 'Conforto',
    },
    salmonMash: {
      title: 'Box de salmão com purê',
      description: 'Salmão, purê cremoso e legumes verdes para uma refeição premium agendada.',
      label: 'Box Salmão e Purê',
      tag: 'Premium',
    },
    groundBeefRice: {
      title: 'Box de arroz com carne moída',
      description: 'Arroz, carne moída, cenoura e batata em uma box prática de conforto.',
      label: 'Arroz com Carne Moída',
      tag: 'Almoço',
    },
    pizzaWaffle: {
      title: 'Pizza waffle salgado',
      description: 'Salgado de mão em formato waffle para compor boxes e pequenos presentes.',
      label: 'Pizza Waffle',
      tag: 'Lanche',
    },
    savoryPie: {
      title: 'Torta salgada de batata palha',
      description: 'Torta brasileira salgada com cobertura crocante de batata palha para encontros.',
      label: 'Torta Salgada',
      tag: 'Festa',
    },
    shrimpPlatter: {
      title: 'Travessa de camarão para festa',
      description: 'Travessa de camarão crocante com molho, feita para eventos e mesas compartilhadas.',
      label: 'Travessa de Camarão',
      tag: 'Festa',
    },
    cookieDuo: {
      title: 'Box dupla de cookies',
      description: 'Cookies gourmet para complementar boxes, presentes e mesas de doces.',
      label: 'Cookie Duo',
      tag: 'Doces',
    },
    charcuterie: {
      title: 'Tábua de frios',
      description: 'Queijos premium, frutas, biscoitos e frios para eventos.',
      label: 'Tábua de Frios',
      tag: 'Eventos',
    },
    luxuryHamper: {
      title: 'Cesta gift de luxo',
      description: 'Cesta personalizada com doces, bebida, flores e acabamento premium.',
      label: 'Cesta Premium',
      tag: 'Presente',
    },
    birthdayTray: {
      title: 'Bandeja de aniversário',
      description: 'Bandeja de aniversário personalizada com doces, bebidas e fitas.',
      label: 'Bandeja Aniversário',
      tag: 'Presente',
    },
  };

  const ES = {
    cups: { title: 'Torre de copas de postre', description: 'Dulces brasileños en capas, empacados individualmente para fiestas, la oficina y los fines de semana en familia.', label: 'Copas de Postre', tag: 'Dulces' },
    classicPudim: { title: 'Pudim brasileño clásico', description: 'Pudim de caramelo brillante como postre junto a tu pedido Box InHouse.', label: 'Pudim Clásico', tag: 'Postre' },
    berryPudim: { title: 'Pudim de frutos rojos', description: 'Pudim cremoso con salsa de frutos rojos para complementar tu pedido.', label: 'Pudim Frutos Rojos', tag: 'Postre' },
    giftPudim: { title: 'Pudim para regalo', description: 'Presentación cuidada de pudim para enviar junto a boxes y regalos.', label: 'Pudim Regalo', tag: 'Postre' },
    shrimp: { title: 'Bandeja de camarón crocante', description: 'Camarón dorado sobre papas paja crocantes, listo para recoger o entregar bajo cita.', label: 'Camarón Crocante', tag: 'Salado' },
    weekend: { title: 'Box de fin de semana en familia', description: 'Box rotativo de comida brasileña reconfortante para pequeñas reuniones y fines de semana sin estrés.', label: 'Box Fin de Semana', tag: 'Familia' },
    beefRice: { title: 'Box de carne con arroz', description: 'Carne al estilo brasileño con arroz, vegetales y empaque listo para recoger.', label: 'Box Arroz con Carne', tag: 'Almuerzo' },
    fitGroundBeef: { title: 'Box fit de carne molida', description: 'Carne molida, arroz y vegetales para pedidos semanales equilibrados.', label: 'Box Fit Carne Molida', tag: 'Fit' },
    grilledChicken: { title: 'Box de pollo a la parrilla', description: 'Pollo sazonado sobre arroz, preparado en lotes para toda la semana.', label: 'Box Pollo a la Parrilla', tag: 'Almuerzo' },
    meatballPasta: { title: 'Box de pasta con albóndigas', description: 'Pasta reconfortante con albóndigas, salsa y empaque listo para compartir.', label: 'Pasta con Albóndigas', tag: 'Reconfortante' },
    salmonMash: { title: 'Box de salmón con puré', description: 'Salmón, puré cremoso y vegetales verdes para una comida premium bajo cita.', label: 'Box Salmón y Puré', tag: 'Premium' },
    groundBeefRice: { title: 'Box de arroz con carne molida', description: 'Arroz, carne molida, zanahoria y papa en un box práctico y reconfortante.', label: 'Arroz con Carne Molida', tag: 'Almuerzo' },
    pizzaWaffle: { title: 'Waffle salado de pizza', description: 'Bocado salado en forma de waffle para armar boxes y pequeños regalos.', label: 'Pizza Waffle', tag: 'Snack' },
    savoryPie: { title: 'Pastel salado de papa paja', description: 'Pastel salado brasileño con cobertura crocante de papa paja para reuniones.', label: 'Pastel Salado', tag: 'Fiesta' },
    shrimpPlatter: { title: 'Fuente de camarón para fiesta', description: 'Fuente de camarón crocante con salsa, hecha para eventos y mesas para compartir.', label: 'Fuente de Camarón', tag: 'Fiesta' },
    cookieDuo: { title: 'Box dúo de galletas', description: 'Galletas gourmet para complementar boxes, regalos y mesas de dulces.', label: 'Cookie Duo', tag: 'Dulces' },
    charcuterie: { title: 'Tabla de fiambres', description: 'Quesos premium, frutas, galletas y fiambres para eventos.', label: 'Tabla de Fiambres', tag: 'Eventos' },
    luxuryHamper: { title: 'Canasta de regalo de lujo', description: 'Canasta personalizada con dulces, bebida, flores y acabado premium.', label: 'Canasta Premium', tag: 'Regalo' },
    birthdayTray: { title: 'Bandeja de cumpleaños', description: 'Bandeja de cumpleaños personalizada con dulces, bebidas y cintas.', label: 'Bandeja Cumpleaños', tag: 'Regalo' },
  };

  const DICT = { pt: PT, es: ES };

  const getLang = () => {
    try {
      const v = localStorage.getItem('bp-lang');
      return v === 'pt' || v === 'es' ? v : 'en';
    } catch { return 'en'; }
  };

  function applyLang() {
    const lang = getLang();
    if (!window.boxProducts) return;

    Object.keys(window.boxProducts).forEach((key) => {
      const p = window.boxProducts[key];
      if (!p) return;
      // Salvar versão EN original na primeira passada
      if (!p._titleEn) {
        p._titleEn = p.title;
        p._descEn = p.description;
        p._labelEn = p.label;
        p._tagEn = p.tag;
      }
      const vals = DICT[lang] && DICT[lang][key];
      if (vals) {
        p.title = vals.title;
        p.description = vals.description;
        p.label = vals.label;
        p.tag = vals.tag;
      } else {
        p.title = p._titleEn;
        p.description = p._descEn;
        p.label = p._labelEn;
        p.tag = p._tagEn;
      }
    });

    // Forçar re-render do catalog, featured e cart no box.js
    window.dispatchEvent(new CustomEvent('box-rerender'));
  }

  // Aguarda box.js terminar de carregar
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(applyLang, 50));
  } else {
    setTimeout(applyLang, 50);
  }

  // Reaplica quando o usuário troca o idioma
  document.addEventListener('bp:lang-change', applyLang);
  // Também escuta o evento custom do header.js
  document.addEventListener('bk:lang-change', applyLang);
})();
