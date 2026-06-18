/* ============================================================
   Brazilian Kitchen — unified header behavior
   ============================================================ */
(() => {
  'use strict';

  /* ----------------------------------------
     Header i18n — dicionário próprio
     Site é US-based, default EN. PT vendedor BR.
  ---------------------------------------- */
  const I18N = {
    en: {
      bkAnnounceBatchClose: 'Saturday batch closes in',
      bkAnnouncePickupOrlando: 'Pickup or local delivery in Danbury',
      bkAnnounceFamilyBoxes: 'Family-size boxes prepared on demand',
      bkAnnounceSlotsLeft: 'Only 5 slots left for this weekend',
      bkAnnounceBoxSlots: 'Only 3 box slots for this weekend',
      bkAnnounceCode: 'Use code FRESH10 on your first batch',
      bkAnnounceSecondBox: 'Save $8 on your second box this month',
      bkAnnounceTwoDoors: 'Two doors, one kitchen',
      bkAnnounceUSOnly: 'Danbury pickup or local delivery',
      bkAnnouncePreorderUS: 'Brazilian sweets and boxes by preorder',
      bkSwitchPudim: 'Pudim',
      bkSwitchBox: 'Box',
      bkSwitchHome: 'Home',
      bkBrandPuddingTag: 'Small batch sweets',
      bkBrandBoxTag: 'Brazilian boxes',
      bkBrandKitchenTag: 'Preorder in the USA',
      // index.html (entry split-screen)
      entrySignature: 'Signature dessert',
      entryPuddingTitle: 'Brazilian Pudding',
      entryPuddingDesc: 'Silky pudim, berry specials and gift-ready sweets made fresh by appointment.',
      entryEnterPudding: 'Enter pudding shop',
      entry48h: '48h preorder',
      entryPickup: 'pickup or delivery',
      entryWAOrder: 'WhatsApp order',
      entryBrazilianBoxes: 'Brazilian boxes',
      entryBoxTitle: 'Box InHouse',
      entryBoxDesc: 'Dessert cups, savory trays and weekend boxes prepared by schedule.',
      entryEnterBox: 'Enter box kitchen',
      entryLimited: 'limited batches',
      entryFamily: 'family portions',
      entryWeekend: 'weekend drops',
      entryChooseTable: 'Choose your table',
      entryTwoDoors: 'Two doors, one kitchen, all made to order.',
      entryDessertRoute: 'Dessert route',
      entryPudimCakes: 'Pudim, cakes and gift moments.',
      entryPudimRouteDesc: 'For birthdays, Sunday cravings, dessert tables and premium sweets by preorder.',
      entryComfortRoute: 'Comfort route',
      entryLunchBoxes: 'Lunch boxes, trays and weekend drops.',
      entryLunchDesc: 'For family portions, savory trays, meal boxes and special boxes by schedule.',
      entryEvents: 'events',
      entryGiftReady: 'gift-ready',
      entryWeekly: 'weekly',
      entrySavory: 'savory',
      entryFamilyTag: 'family',
      bkSearchPlaceholder: 'Search...',
      bkOpenShop: 'Open shop',
      bkOrderWA: 'WhatsApp',
      bkOrderWAFull: 'Order on WhatsApp',
      bkDrawerOtherLine: 'Other line',
      bkDrawerChoose: 'Choose another section',
      bkNavMenu: 'Menu',
      bkNavOrder: 'Order',
      bkNavHow: 'How it works',
      bkNavPreorder: 'Preorder',
      // box.html
      boxKickerHero: 'Brazilian boxes by appointment',
      boxHeroTitle: 'Comfort food that arrives ready to share.',
      boxHeroDesc: 'Dessert cups, savory trays and weekend boxes prepared in limited batches for pickup or delivery.',
      boxReserveBox: 'Reserve a box',
      boxChooseLine: 'Choose another line',
      boxKickerDrop: 'Preorder menu',
      boxMenuTitle: 'Box InHouse menu, made by preorder.',
      boxFeatured: 'Featured',
      boxKickerOrder: 'Order cart',
      boxOrderTitle: 'One clean WhatsApp request.',
      boxOrderDesc: 'Every selected item stays in one cart with quantity, pickup or delivery, date, notes and estimated total.',
      boxOpenCart: 'Open cart',
      boxAddSelected: 'Add selected',
      boxCartKicker: 'Preorder cart',
      boxCartTitle: 'Build the box request.',
      boxFieldProduct: 'Add product',
      boxAddToCart: 'Add',
      boxFieldName: 'Name',
      boxNamePlaceholder: 'Your name',
      boxFieldWhatsapp: 'WhatsApp',
      boxFieldDate: 'For when?',
      boxFieldTime: 'Preferred time',
      boxTimePlaceholder: 'Saturday, 5-7 PM',
      boxFieldFulfillment: 'Fulfillment',
      boxPickup: 'Pickup',
      boxDelivery: 'Delivery request',
      boxDeliveryTitle: 'Delivery from Danbury',
      boxDeliveryText: 'Enter a ZIP to check the automatic radius and delivery fee.',
      boxFieldZip: 'Delivery ZIP',
      boxCheckDelivery: 'Check',
      boxFieldAddress: 'Delivery address',
      boxAddressPlaceholder: 'Street, city, CT',
      boxPickupFree: 'Pickup is free.',
      boxDeliveryHint: 'For delivery, enter the ZIP before sending.',
      boxFieldNotes: 'Notes',
      boxNotesPlaceholder: 'Delivery ZIP, allergies, number of guests, preferred flavor...',
      boxEstimatedTotal: 'Estimated total',
      boxWhatsappPreview: 'WhatsApp preview',
      boxSendWhatsapp: 'Send preorder to WhatsApp',
      boxCartFloating: 'Cart',
      boxStepOneTitle: 'Choose item',
      boxStepOneText: 'Dessert, savory, meal box or pudim add-on.',
      boxStepTwoTitle: 'Pick date',
      boxStepTwoText: 'Owner confirms available pickup or delivery windows.',
      boxStepThreeTitle: 'Pay and confirm',
      boxStepThreeText: 'Deposit or full payment according to the rule.',
      boxFooterText: 'Brazilian food boxes and sweets by preorder in Danbury, CT.',
      boxBackEntry: 'Back to entry',
      boxSweetBox: 'Sweet box',
      boxSweetDesc: 'Brigadeiro, pistachio, coconut',
      boxSavoryTray: 'Savory tray',
      boxSavoryDesc: 'Crispy shrimp, potato sticks, green onion',
    },
    pt: {
      bkAnnounceBatchClose: 'Lote de sábado fecha em',
      bkAnnouncePickupOrlando: 'Retirada local ou entrega em Danbury',
      bkAnnounceFamilyBoxes: 'Boxes tamanho família preparados sob encomenda',
      bkAnnounceSlotsLeft: 'Apenas 5 vagas para este fim de semana',
      bkAnnounceBoxSlots: 'Apenas 3 vagas de box este fim de semana',
      bkAnnounceCode: 'Use o código FRESH10 no primeiro lote',
      bkAnnounceSecondBox: 'Economize $8 no seu segundo box do mês',
      bkAnnounceTwoDoors: 'Duas portas, uma cozinha',
      bkAnnounceUSOnly: 'Retirada ou entrega local, somente EUA',
      bkAnnouncePreorderUS: 'Doces e boxes brasileiros sob encomenda',
      bkSwitchPudim: 'Pudim',
      bkSwitchBox: 'Box',
      bkSwitchHome: 'Inicio',
      bkBrandPuddingTag: 'Doces em pequenos lotes',
      bkBrandBoxTag: 'Boxes brasileiros',
      bkBrandKitchenTag: 'Pré-venda nos EUA',
      // index.html (entry split-screen)
      entrySignature: 'Sobremesa autoral',
      entryPuddingTitle: 'Brazilian Pudding',
      entryPuddingDesc: 'Pudim cremoso, especiais com frutas vermelhas e doces para presente, feitos na hora sob agendamento.',
      entryEnterPudding: 'Entrar na loja de pudim',
      entry48h: 'Pré-venda 48h',
      entryPickup: 'retirada ou entrega',
      entryWAOrder: 'pedido por WhatsApp',
      entryBrazilianBoxes: 'Boxes brasileiros',
      entryBoxTitle: 'Box InHouse',
      entryBoxDesc: 'Taças de sobremesa, bandejas salgadas e boxes de fim de semana preparados sob agenda.',
      entryEnterBox: 'Entrar na cozinha de boxes',
      entryLimited: 'lotes limitados',
      entryFamily: 'porções familiares',
      entryWeekend: 'drops de fim de semana',
      entryChooseTable: 'Escolha sua mesa',
      entryTwoDoors: 'Duas portas, uma cozinha, tudo feito sob encomenda.',
      entryDessertRoute: 'Rota das sobremesas',
      entryPudimCakes: 'Pudim, bolos e momentos especiais.',
      entryPudimRouteDesc: 'Para aniversários, sábados em família, mesas de sobremesa e doces premium sob encomenda.',
      entryComfortRoute: 'Rota da comida',
      entryLunchBoxes: 'Boxes de almoço, bandejas e drops de fim de semana.',
      entryLunchDesc: 'Para porções familiares, bandejas salgadas, boxes de refeição e boxes especiais sob agenda.',
      entryEvents: 'eventos',
      entryGiftReady: 'para presente',
      entryWeekly: 'semanal',
      entrySavory: 'salgado',
      entryFamilyTag: 'família',
      bkSearchPlaceholder: 'Buscar...',
      bkOpenShop: 'Abrir loja',
      bkOrderWA: 'WhatsApp',
      bkOrderWAFull: 'Pedir no WhatsApp',
      bkDrawerOtherLine: 'Outra linha',
      bkDrawerChoose: 'Escolher outra seção',
      bkNavMenu: 'Menu',
      bkNavOrder: 'Pedido',
      bkNavHow: 'Como funciona',
      bkNavPreorder: 'Reservar',
      // box.html
      boxKickerHero: 'Boxes brasileiros por agendamento',
      boxHeroTitle: 'Comida reconfortante pronta pra compartilhar.',
      boxHeroDesc: 'Taças de sobremesa, bandejas salgadas e boxes de fim de semana preparados em lotes limitados para retirada ou entrega.',
      boxReserveBox: 'Reservar box',
      boxChooseLine: 'Escolher outra linha',
      boxKickerDrop: 'Cardapio de encomendas',
      boxMenuTitle: 'Cardapio Box InHouse por encomenda.',
      boxFeatured: 'Em destaque',
      boxKickerOrder: 'Carrinho do pedido',
      boxOrderTitle: 'Pedido unico pelo WhatsApp.',
      boxOrderDesc: 'Cada item escolhido fica em um único carrinho com quantidade, retirada ou entrega, data, observações e total estimado.',
      boxOpenCart: 'Abrir carrinho',
      boxAddSelected: 'Adicionar',
      boxCartKicker: 'Carrinho da encomenda',
      boxCartTitle: 'Monte o pedido misto.',
      boxFieldProduct: 'Adicionar produto',
      boxAddToCart: 'Adicionar',
      boxFieldName: 'Nome',
      boxNamePlaceholder: 'Seu nome',
      boxFieldWhatsapp: 'WhatsApp',
      boxFieldDate: 'Para quando?',
      boxFieldTime: 'Horario desejado',
      boxTimePlaceholder: 'Sabado, 5-7 PM',
      boxFieldFulfillment: 'Forma',
      boxPickup: 'Retirada',
      boxDelivery: 'Solicitar entrega',
      boxDeliveryTitle: 'Entrega saindo de Danbury',
      boxDeliveryText: 'Digite o ZIP para conferir o raio automatico e a taxa.',
      boxFieldZip: 'ZIP da entrega',
      boxCheckDelivery: 'Conferir',
      boxFieldAddress: 'Endereco da entrega',
      boxAddressPlaceholder: 'Rua, cidade, CT',
      boxPickupFree: 'Retirada e gratis.',
      boxDeliveryHint: 'Para entrega, digite o ZIP antes de enviar.',
      boxFieldNotes: 'Observacoes',
      boxNotesPlaceholder: 'ZIP da entrega, alergias, pessoas, sabor preferido...',
      boxEstimatedTotal: 'Total estimado',
      boxWhatsappPreview: 'Previa no WhatsApp',
      boxSendWhatsapp: 'Enviar pedido pelo WhatsApp',
      boxCartFloating: 'Carrinho',
      boxStepOneTitle: 'Escolha o item',
      boxStepOneText: 'Sobremesa, salgado, refeicao ou pudim adicional.',
      boxStepTwoTitle: 'Escolha a data',
      boxStepTwoText: 'A dona confirma janelas de retirada ou entrega disponiveis.',
      boxStepThreeTitle: 'Pague e confirme',
      boxStepThreeText: 'Sinal ou pagamento total conforme a regra combinada.',
      boxFooterText: 'Boxes e doces brasileiros por encomenda em Danbury, CT.',
      boxBackEntry: 'Voltar para a entrada',
      boxSweetBox: 'Box doce',
      boxSweetDesc: 'Brigadeiro, pistache, coco',
      boxSavoryTray: 'Bandeja salgada',
      boxSavoryDesc: 'Camarao crocante, batata palha, cebolinha',
    },
    es: {
      bkAnnounceBatchClose: 'El lote del sábado cierra en',
      bkAnnouncePickupOrlando: 'Recoger en el local o entrega en Danbury',
      bkAnnounceFamilyBoxes: 'Boxes tamaño familiar preparados por encargo',
      bkAnnounceSlotsLeft: 'Solo quedan 5 lugares para este fin de semana',
      bkAnnounceBoxSlots: 'Solo 3 lugares de box este fin de semana',
      bkAnnounceCode: 'Usa el código FRESH10 en tu primer lote',
      bkAnnounceSecondBox: 'Ahorra $8 en tu segundo box del mes',
      bkAnnounceTwoDoors: 'Dos puertas, una cocina',
      bkAnnounceUSOnly: 'Recoger o entrega local, solo EE. UU.',
      bkAnnouncePreorderUS: 'Dulces y boxes brasileños por encargo',
      bkSwitchPudim: 'Pudim',
      bkSwitchBox: 'Box',
      bkSwitchHome: 'Inicio',
      bkBrandPuddingTag: 'Dulces en lotes pequeños',
      bkBrandBoxTag: 'Boxes brasileños',
      bkBrandKitchenTag: 'Preventa en EE. UU.',
      // index.html (entry split-screen)
      entrySignature: 'Postre de autor',
      entryPuddingTitle: 'Brazilian Pudding',
      entryPuddingDesc: 'Pudim cremoso, especiales con frutos rojos y dulces para regalar, hechos al momento con cita previa.',
      entryEnterPudding: 'Entrar a la tienda de pudim',
      entry48h: 'Preventa 48h',
      entryPickup: 'recoger o entrega',
      entryWAOrder: 'pedido por WhatsApp',
      entryBrazilianBoxes: 'Boxes brasileños',
      entryBoxTitle: 'Box InHouse',
      entryBoxDesc: 'Copas de postre, bandejas saladas y boxes de fin de semana preparados con agenda.',
      entryEnterBox: 'Entrar a la cocina de boxes',
      entryLimited: 'lotes limitados',
      entryFamily: 'porciones familiares',
      entryWeekend: 'drops de fin de semana',
      entryChooseTable: 'Elige tu mesa',
      entryTwoDoors: 'Dos puertas, una cocina, todo hecho por encargo.',
      entryDessertRoute: 'Ruta de los postres',
      entryPudimCakes: 'Pudim, pasteles y momentos especiales.',
      entryPudimRouteDesc: 'Para cumpleaños, sábados en familia, mesas de postres y dulces premium por encargo.',
      entryComfortRoute: 'Ruta de la comida',
      entryLunchBoxes: 'Boxes de almuerzo, bandejas y drops de fin de semana.',
      entryLunchDesc: 'Para porciones familiares, bandejas saladas, boxes de comida y boxes especiales con agenda.',
      entryEvents: 'eventos',
      entryGiftReady: 'para regalar',
      entryWeekly: 'semanal',
      entrySavory: 'salado',
      entryFamilyTag: 'familia',
      bkSearchPlaceholder: 'Buscar...',
      bkOpenShop: 'Abrir tienda',
      bkOrderWA: 'WhatsApp',
      bkOrderWAFull: 'Pedir por WhatsApp',
      bkDrawerOtherLine: 'Otra línea',
      bkDrawerChoose: 'Elegir otra sección',
      bkNavMenu: 'Menú',
      bkNavOrder: 'Pedido',
      bkNavHow: 'Cómo funciona',
      bkNavPreorder: 'Reservar',
      // box.html
      boxKickerHero: 'Boxes brasileños con cita previa',
      boxHeroTitle: 'Comida reconfortante lista para compartir.',
      boxHeroDesc: 'Copas de postre, bandejas saladas y boxes de fin de semana preparados en lotes limitados para recoger o entrega.',
      boxReserveBox: 'Reservar box',
      boxChooseLine: 'Elegir otra línea',
      boxKickerDrop: 'Menú de encargos',
      boxMenuTitle: 'Menú Box InHouse por encargo.',
      boxFeatured: 'Destacado',
      boxKickerOrder: 'Carrito del pedido',
      boxOrderTitle: 'Pedido único por WhatsApp.',
      boxOrderDesc: 'Cada artículo elegido queda en un solo carrito con cantidad, recoger o entrega, fecha, notas y total estimado.',
      boxOpenCart: 'Abrir carrito',
      boxAddSelected: 'Agregar',
      boxCartKicker: 'Carrito del encargo',
      boxCartTitle: 'Arma el pedido mixto.',
      boxFieldProduct: 'Agregar producto',
      boxAddToCart: 'Agregar',
      boxFieldName: 'Nombre',
      boxNamePlaceholder: 'Tu nombre',
      boxFieldWhatsapp: 'WhatsApp',
      boxFieldDate: '¿Para cuándo?',
      boxFieldTime: 'Horario deseado',
      boxTimePlaceholder: 'Sábado, 5-7 PM',
      boxFieldFulfillment: 'Forma',
      boxPickup: 'Recoger',
      boxDelivery: 'Solicitar entrega',
      boxDeliveryTitle: 'Entrega desde Danbury',
      boxDeliveryText: 'Escribe el ZIP para verificar el radio automático y la tarifa.',
      boxFieldZip: 'ZIP de entrega',
      boxCheckDelivery: 'Verificar',
      boxFieldAddress: 'Dirección de entrega',
      boxAddressPlaceholder: 'Calle, ciudad, CT',
      boxPickupFree: 'Recoger es gratis.',
      boxDeliveryHint: 'Para entrega, escribe el ZIP antes de enviar.',
      boxFieldNotes: 'Notas',
      boxNotesPlaceholder: 'ZIP de entrega, alergias, número de personas, sabor preferido...',
      boxEstimatedTotal: 'Total estimado',
      boxWhatsappPreview: 'Vista previa en WhatsApp',
      boxSendWhatsapp: 'Enviar pedido por WhatsApp',
      boxCartFloating: 'Carrito',
      boxStepOneTitle: 'Elige el artículo',
      boxStepOneText: 'Postre, salado, comida o pudim adicional.',
      boxStepTwoTitle: 'Elige la fecha',
      boxStepTwoText: 'La dueña confirma los horarios disponibles para recoger o entrega.',
      boxStepThreeTitle: 'Paga y confirma',
      boxStepThreeText: 'Señal o pago total según la regla acordada.',
      boxFooterText: 'Boxes y dulces brasileños por encargo en Danbury, CT.',
      boxBackEntry: 'Volver a la entrada',
      boxSweetBox: 'Box dulce',
      boxSweetDesc: 'Brigadeiro, pistacho, coco',
      boxSavoryTray: 'Bandeja salada',
      boxSavoryDesc: 'Camarón crocante, papas paja, cebollín',
    },
  };

  function applyHeaderI18n(langCode) {
    const dict = I18N[langCode] || I18N.en;
    document.querySelectorAll('[data-bk-i18n]').forEach((el) => {
      const key = el.dataset.bkI18n;
      const txt = dict[key];
      if (txt != null) el.textContent = txt;
    });
    document.querySelectorAll('[data-bk-i18n-placeholder]').forEach((el) => {
      const key = el.dataset.bkI18nPlaceholder;
      const txt = dict[key];
      if (txt != null) el.placeholder = txt;
    });
  }
  // expor pra debug
  window.bkApplyI18n = applyHeaderI18n;

  const root = document.querySelector('[data-bk-header]');
  if (!root) return;

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------------------
     Sticky shrink
  ---------------------------------------- */
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      root.classList.toggle('is-scrolled', window.scrollY > 8);
      ticking = false;
    });
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ----------------------------------------
     Announcement marquee — duplica conteúdo p/ loop sem corte
  ---------------------------------------- */
  const track = root.querySelector('[data-bk-marquee]');
  if (track) {
    track.innerHTML = track.innerHTML + track.innerHTML;

    // Live countdown: procura [data-bk-deadline="yyyy-mm-ddThh:mm"]
    const deadlines = track.querySelectorAll('[data-bk-deadline]');
    if (deadlines.length) {
      const fmt = (target) => {
        const diff = Math.max(0, target - Date.now());
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        return `${d}d ${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m`;
      };
      const tick = () => deadlines.forEach((el) => {
        const t = new Date(el.dataset.bkDeadline).getTime();
        if (!isNaN(t)) el.textContent = fmt(t);
      });
      tick();
      setInterval(tick, 30_000);
    }
  }

  /* ----------------------------------------
     Switcher Pudim ↔ Box
  ---------------------------------------- */
  const switcher = root.querySelector('[data-bk-switch]');
  if (switcher) {
    switcher.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', (e) => {
        const target = a.dataset.bkTarget;
        if (!target) return;
        switcher.dataset.active = target;

        // View Transitions API — fallback gracioso
        if (document.startViewTransition && !reduceMotion) {
          e.preventDefault();
          document.startViewTransition(() => {
            window.location.href = a.href;
          });
        }
      });
    });
  }

  /* ----------------------------------------
     Lang toggle global — sincroniza TODOS os [data-bk-lang]
     (header + drawer + qualquer outro lugar). Default EN.
  ---------------------------------------- */
  const langs = document.querySelectorAll('[data-bk-lang]');
  if (langs.length) {
    const LANGS = ['en', 'pt', 'es'];
    const readLang = () => {
      try {
        const saved = localStorage.getItem('bp-lang');
        return LANGS.includes(saved) ? saved : 'en';
      } catch { return 'en'; }
    };
    const writeLang = (v) => { try { localStorage.setItem('bp-lang', v); } catch { } };

    const setActive = (which) => {
      const next = LANGS.includes(which) ? which : 'en';
      langs.forEach((l) => { l.dataset.active = next; });
      document.documentElement.setAttribute('lang', next);
      writeLang(next);
      applyHeaderI18n(next);
    };

    // Init com valor persistido — aplica em todos
    setActive(readLang());

    // Quando o app.js legacy emite, sincroniza também
    document.addEventListener('bp:lang-change', (e) => {
      const next = LANGS.includes(e?.detail?.lang) ? e.detail.lang : 'en';
      langs.forEach((l) => { if (l.dataset.active !== next) l.dataset.active = next; });
      applyHeaderI18n(next);
    });

    // Cada toggle (header e drawer) bridges pro legacy uma vez só
    let bridging = false;
    const cycleLang = (cur) => LANGS[(LANGS.indexOf(cur) + 1) % LANGS.length];
    langs.forEach((lang) => {
      lang.addEventListener('click', (e) => {
        if (bridging) return;
        const span = e.target.closest('[data-lang]');
        const target = span ? span.dataset.lang : cycleLang(lang.dataset.active);
        if (target === lang.dataset.active) return;
        setActive(target);

        bridging = true;
        // Pudim (app.js) e Box (box.js) expoem setters diretos; o .click() legado
        // e binario PT<->EN e nao alcanca 'es', entao preferimos o setter quando existe.
        if (typeof window.bkSetLegacyLang === 'function') window.bkSetLegacyLang(target);
        else document.querySelector('[data-language-toggle]')?.click();
        bridging = false;

        document.dispatchEvent(new CustomEvent('bk:lang-change', { detail: { lang: target } }));
      });
    });
  }

  /* ----------------------------------------
     Bag badge — observa data-bk-cart-count e anima
  ---------------------------------------- */
  const badge = root.querySelector('[data-bk-bag-badge]');
  if (badge) {
    const update = () => {
      const n = parseInt(root.dataset.bkCartCount || '0', 10) || 0;
      badge.textContent = n;
      badge.style.display = n > 0 ? 'inline-flex' : 'none';
      if (!reduceMotion) {
        badge.classList.remove('is-bumping');
        // forçar reflow pra reanimar
        void badge.offsetWidth;
        badge.classList.add('is-bumping');
      }
    };
    update();
    new MutationObserver(update).observe(root, { attributes: true, attributeFilter: ['data-bk-cart-count'] });
  }

  /* ----------------------------------------
     Scroll-spy com pill morphing
  ---------------------------------------- */
  const nav = root.querySelector('[data-bk-nav]');
  if (nav) {
    const links = [...nav.querySelectorAll('.bk-nav-link[href^="#"]')];
    const pill = nav.querySelector('.bk-nav-pill');

    const moveTo = (el) => {
      if (!el || !pill) return;
      const navRect = nav.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      pill.style.width = `${r.width}px`;
      pill.style.transform = `translateX(${r.left - navRect.left - 6}px)`;
      nav.classList.add('is-armed');
    };
    const clearArm = () => {
      if (!nav.querySelector('.bk-nav-link.is-active')) nav.classList.remove('is-armed');
    };

    // hover preview
    links.forEach((a) => {
      a.addEventListener('mouseenter', () => moveTo(a));
    });
    nav.addEventListener('mouseleave', () => {
      const active = nav.querySelector('.bk-nav-link.is-active');
      if (active) moveTo(active);
      else clearArm();
    });

    // scroll-spy via IntersectionObserver
    const targets = links
      .map((a) => document.querySelector(a.getAttribute('href')))
      .filter(Boolean);

    if (targets.length) {
      const io = new IntersectionObserver((entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const id = '#' + visible.target.id;
        const link = links.find((l) => l.getAttribute('href') === id);
        if (!link) return;
        links.forEach((l) => l.classList.toggle('is-active', l === link));
        moveTo(link);
      }, { rootMargin: '-40% 0px -55% 0px', threshold: [0.01, 0.25, 0.5, 0.75] });
      targets.forEach((t) => io.observe(t));
    }

    // ajusta no resize
    let raf;
    window.addEventListener('resize', () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const active = nav.querySelector('.bk-nav-link.is-active');
        if (active) moveTo(active);
      });
    });
  }

  /* ----------------------------------------
     Mobile drawer
  ---------------------------------------- */
  const burger = root.querySelector('[data-bk-burger]');
  const drawer = document.querySelector('[data-bk-drawer]');
  const overlay = document.querySelector('[data-bk-drawer-overlay]');
  const closeBtn = drawer?.querySelector('[data-bk-drawer-close]');

  const openDrawer = () => {
    if (!drawer) return;
    drawer.classList.add('is-open');
    overlay?.classList.add('is-open');
    burger?.classList.add('is-open');
    burger?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };
  const closeDrawer = () => {
    drawer?.classList.remove('is-open');
    overlay?.classList.remove('is-open');
    burger?.classList.remove('is-open');
    burger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  burger?.addEventListener('click', () => {
    drawer?.classList.contains('is-open') ? closeDrawer() : openDrawer();
  });
  closeBtn?.addEventListener('click', closeDrawer);
  overlay?.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer(); });
  drawer?.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeDrawer));

  /* ----------------------------------------
     Swipe gestures (mobile)
     - Drawer: arrastar pra direita fecha
     - Switcher Pudim/Box: arrastar pra alternar entre lojas
  ---------------------------------------- */
  if (drawer) {
    let startX = 0, dx = 0, startY = 0, dragging = false, axisLocked = null;
    const W = () => drawer.getBoundingClientRect().width || 380;

    drawer.addEventListener('touchstart', (e) => {
      if (!drawer.classList.contains('is-open')) return;
      if (e.target.closest('input, textarea, select')) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      dx = 0;
      dragging = true;
      axisLocked = null;
    }, { passive: true });

    drawer.addEventListener('touchmove', (e) => {
      if (!dragging) return;
      const cx = e.touches[0].clientX - startX;
      const cy = e.touches[0].clientY - startY;
      if (axisLocked == null) {
        // Detecta eixo dominante após 8px de movimento
        if (Math.abs(cx) > 8 || Math.abs(cy) > 8) {
          axisLocked = Math.abs(cx) > Math.abs(cy) ? 'x' : 'y';
        }
      }
      if (axisLocked !== 'x') return;
      dx = cx < 0 ? 0 : cx;          // só pra direita
      drawer.classList.add('is-dragging');
      overlay?.classList.add('is-dragging');
      drawer.style.transform = `translateX(${dx}px)`;
      if (overlay) overlay.style.opacity = String(Math.max(0, 1 - dx / W()));
    }, { passive: true });

    drawer.addEventListener('touchend', () => {
      if (!dragging) return;
      dragging = false;
      drawer.classList.remove('is-dragging');
      overlay?.classList.remove('is-dragging');
      drawer.style.transform = '';
      if (overlay) overlay.style.opacity = '';
      if (axisLocked === 'x' && dx > W() * 0.30) closeDrawer();
      axisLocked = null;
    });
  }

  // Switcher Pudim/Box — swipe horizontal alterna entre lojas
  document.querySelectorAll('.bk-switch').forEach((sw) => {
    let sx = 0, sdx = 0, swiping = false;
    sw.addEventListener('touchstart', (e) => {
      sx = e.touches[0].clientX;
      sdx = 0;
      swiping = true;
    }, { passive: true });
    sw.addEventListener('touchmove', (e) => {
      if (!swiping) return;
      sdx = e.touches[0].clientX - sx;
    }, { passive: true });
    sw.addEventListener('touchend', () => {
      if (!swiping) return;
      swiping = false;
      if (Math.abs(sdx) < 32) return;
      const targetSide = sdx < 0 ? 'box' : 'pudim';
      const link = sw.querySelector(`a[data-bk-target="${targetSide}"]`);
      if (link && sw.dataset.active !== targetSide) {
        sw.dataset.active = targetSide;
        if (link.href && link.href !== window.location.href) {
          if (document.startViewTransition && !reduceMotion) {
            document.startViewTransition(() => { window.location.href = link.href; });
          } else {
            window.location.href = link.href;
          }
        }
      }
    });
  });

  /* ----------------------------------------
     API pública: window.bkHeader
  ---------------------------------------- */
  window.bkHeader = {
    setCartCount(n) { root.setAttribute('data-bk-cart-count', String(n)); },
    setLang(which) { document.querySelectorAll('[data-bk-lang]').forEach((l) => l.dataset.active = which); },
    open: openDrawer,
    close: closeDrawer,
  };
})();
