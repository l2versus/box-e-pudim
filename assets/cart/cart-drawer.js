/* ============================================================
   Cart drawer universal — DOM transfer pattern
   - Detecta o form embedded de cada loja (pudim ou box)
   - Move pra dentro de um aside lateral quando aberto
   - Devolve ao DOM original quando fecha
   - Zero alteração no app.js / box.js
   ============================================================ */
(() => {
  'use strict';

  const FREE_SHIPPING_MIN = 299;

  // Detectar qual loja: pudim ou box
  const cartForm = document.querySelector('[data-cart-modal]') || document.querySelector('[data-box-cart-modal]');
  if (!cartForm) return;

  const isBox = !!document.querySelector('[data-box-cart-modal]');
  const placeholder = document.createComment('bk-cart-anchor');
  cartForm.parentNode.insertBefore(placeholder, cartForm);

  // i18n local (espelha header.js)
  const getLang = () => {
    try { return localStorage.getItem('bp-lang') === 'pt' ? 'pt' : 'en'; }
    catch { return 'en'; }
  };
  const T = {
    en: {
      title: 'Bag',
      itemsZero: 'No items yet',
      items_one: '1 item',
      items_other: '{n} items',
      shippingRemaining: 'Add {amount} more for free local delivery',
      shippingDone: 'You unlocked free local delivery',
      progress: '{n}%',
      emptyTitle: 'Your bag is empty',
      emptyDesc: 'Browse the menu and add some sweets, boxes or party trays.',
      emptyCta: 'See menu',
      close: 'Close cart',
    },
    pt: {
      title: 'Sacola',
      itemsZero: 'Nenhum item ainda',
      items_one: '1 item',
      items_other: '{n} itens',
      shippingRemaining: 'Faltam {amount} pra entrega local grátis',
      shippingDone: 'Você desbloqueou entrega local grátis',
      progress: '{n}%',
      emptyTitle: 'Sua sacola está vazia',
      emptyDesc: 'Veja o cardápio e adicione doces, boxes ou bandejas.',
      emptyCta: 'Ver cardápio',
      close: 'Fechar sacola',
    },
  };
  const t = (key, vars = {}) => {
    const lang = getLang();
    let s = T[lang][key] || T.en[key] || key;
    Object.entries(vars).forEach(([k, v]) => { s = s.replace(`{${k}}`, v); });
    return s;
  };
  const fmtCurrency = (n) => {
    const v = Number(n) || 0;
    return getLang() === 'pt' ? `R$ ${v.toFixed(2).replace('.', ',')}` : `$${v.toFixed(2)}`;
  };
  // o site usa USD; mantemos USD em ambos os idiomas pra evitar confusão
  const fmtUSD = (n) => `$${(Number(n) || 0).toFixed(2)}`;

  /* ------- Estrutura do drawer ------- */
  const overlay = document.createElement('div');
  overlay.className = 'bk-cart-overlay';
  overlay.setAttribute('aria-hidden', 'true');

  const drawer = document.createElement('aside');
  drawer.className = 'bk-cart-drawer';
  drawer.setAttribute('role', 'dialog');
  drawer.setAttribute('aria-modal', 'true');
  drawer.setAttribute('aria-label', 'Bag');
  drawer.innerHTML = `
    <header class="bk-cart-head">
      <div class="bk-cart-head-info">
        <small data-bk-cart-eyebrow>USA · Preorder</small>
        <strong>
          <span data-bk-cart-title>Bag</span> ·
          <b data-bk-cart-count>0 items</b>
        </strong>
      </div>
      <div class="bk-cart-head-actions">
        <button type="button" class="bk-cart-continue" data-bk-cart-continue>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="m15 18-6-6 6-6"/></svg>
          <span data-bk-cart-continue-text>Add more</span>
        </button>
        <button type="button" class="bk-cart-close" data-bk-cart-close aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>
        </button>
      </div>
    </header>

    <div class="bk-cart-shipping" data-bk-cart-shipping hidden>
      <div class="bk-cart-shipping-row">
        <span data-bk-cart-shipping-label></span>
        <em data-bk-cart-shipping-pct>0%</em>
      </div>
      <div class="bk-cart-bar"><div class="bk-cart-bar-fill" data-bk-cart-bar style="width:0%"></div></div>
    </div>

    <div class="bk-cart-body" data-bk-cart-body></div>
  `;
  document.body.appendChild(overlay);
  document.body.appendChild(drawer);

  const body = drawer.querySelector('[data-bk-cart-body]');
  const titleEl = drawer.querySelector('[data-bk-cart-title]');
  const countEl = drawer.querySelector('[data-bk-cart-count]');
  const eyebrowEl = drawer.querySelector('[data-bk-cart-eyebrow]');
  const shippingBox = drawer.querySelector('[data-bk-cart-shipping]');
  const shippingLabel = drawer.querySelector('[data-bk-cart-shipping-label]');
  const shippingPct = drawer.querySelector('[data-bk-cart-shipping-pct]');
  const shippingBar = drawer.querySelector('[data-bk-cart-bar]');

  /* ------- Empty state ------- */
  const emptyState = document.createElement('div');
  emptyState.className = 'bk-cart-empty';
  emptyState.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
      <path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8z"/>
      <path d="M9 8V6a3 3 0 0 1 6 0v2"/>
    </svg>
    <h3 data-bk-empty-title></h3>
    <p data-bk-empty-desc></p>
    <button type="button" data-bk-empty-cta></button>
  `;
  emptyState.querySelector('[data-bk-empty-cta]').addEventListener('click', () => {
    closeCart();
    document.querySelector('#menu')?.scrollIntoView({ behavior: 'smooth' });
  });

  /* ------- Funções ------- */
  function refreshTexts() {
    titleEl.textContent = t('title');
    drawer.setAttribute('aria-label', t('title'));
    drawer.querySelector('[data-bk-cart-close]').setAttribute('aria-label', t('close'));
    emptyState.querySelector('[data-bk-empty-title]').textContent = t('emptyTitle');
    emptyState.querySelector('[data-bk-empty-desc]').textContent = t('emptyDesc');
    emptyState.querySelector('[data-bk-empty-cta]').textContent = t('emptyCta');
    eyebrowEl.textContent = getLang() === 'pt' ? 'EUA · Pré-venda' : 'USA · Preorder';
    const cont = drawer.querySelector('[data-bk-cart-continue-text]');
    if (cont) cont.textContent = getLang() === 'pt' ? 'Adicionar mais' : 'Add more';
  }

  function readCartTotals() {
    // Tenta ler do cart-total ou box-cart-total presentes no form embedded
    const totalEl = cartForm.querySelector('[data-cart-total], [data-box-cart-total]');
    const totalText = totalEl?.textContent?.trim() || '$0';
    const m = totalText.match(/[\d.,]+/);
    const total = m ? Number(m[0].replace(/\./g, '').replace(',', '.')) : 0;
    const lines = cartForm.querySelectorAll('[data-cart-lines] .cart-line, [data-box-cart-lines] .box-cart-line');
    const itemCount = [...lines].reduce((sum, line) => {
      const qty = Number(line.querySelector('[data-qty], input[type="number"]')?.value || 1);
      return sum + (Number.isFinite(qty) ? qty : 1);
    }, 0);
    return { total, itemCount };
  }

  function refreshSummary() {
    const { total, itemCount } = readCartTotals();
    // Item count
    if (itemCount === 0) {
      countEl.textContent = t('itemsZero');
    } else if (itemCount === 1) {
      countEl.textContent = t('items_one');
    } else {
      countEl.textContent = t('items_other', { n: itemCount });
    }
    // Free shipping bar
    if (total > 0) {
      shippingBox.hidden = false;
      const remaining = Math.max(0, FREE_SHIPPING_MIN - total);
      const pct = Math.min(100, Math.round((total / FREE_SHIPPING_MIN) * 100));
      shippingBar.style.width = `${pct}%`;
      shippingPct.textContent = `${pct}%`;
      if (remaining > 0) {
        shippingLabel.innerHTML = t('shippingRemaining', { amount: `<strong>${fmtUSD(remaining)}</strong>` });
        shippingLabel.className = '';
      } else {
        shippingLabel.textContent = t('shippingDone');
        shippingLabel.className = 'is-success';
      }
    } else {
      shippingBox.hidden = true;
    }
    // Empty state
    if (itemCount === 0) {
      if (!body.contains(emptyState)) {
        body.appendChild(emptyState);
      }
    } else {
      if (body.contains(emptyState)) emptyState.remove();
    }
    // Sacola badge global do bk-header
    document.querySelectorAll('[data-bk-header]').forEach((h) => {
      h.setAttribute('data-bk-cart-count', String(itemCount));
    });
  }

  /* ------- Open/close ------- */
  function openCart() {
    // Move o form embedded pra dentro do drawer
    if (!body.contains(cartForm)) {
      body.appendChild(cartForm);
    }
    cartForm.removeAttribute('aria-hidden');
    cartForm.setAttribute('aria-modal', 'true');
    drawer.classList.add('is-open');
    overlay.classList.add('is-open');
    document.body.classList.add('has-bk-cart');
    refreshTexts();
    refreshSummary();
  }
  function closeCart() {
    drawer.classList.remove('is-open');
    overlay.classList.remove('is-open');
    document.body.classList.remove('has-bk-cart');
    // Devolve o form ao DOM original
    setTimeout(() => {
      if (placeholder.parentNode && !placeholder.parentNode.contains(cartForm)) {
        placeholder.parentNode.insertBefore(cartForm, placeholder);
        cartForm.setAttribute('aria-hidden', 'true');
        cartForm.removeAttribute('aria-modal');
      }
    }, 360);
  }

  /* ------- Hook: intercepta abertura do cart embedded legacy (app.js) ------- */
  // O app.js / box.js abre o cart embedded adicionando classes no body
  // (cart-modal-open / box-cart-open). Quando isso acontece, abrimos o drawer e
  // removemos a classe pra não conflitar com o cart-modal antigo.
  const bodyClassObs = new MutationObserver(() => {
    const cls = document.body.classList;
    if (cls.contains('cart-modal-open') || cls.contains('box-cart-open')) {
      cls.remove('cart-modal-open');
      cls.remove('box-cart-open');
      // Reseta aria-hidden do form (o app.js setou false; vamos gerenciar)
      cartForm.setAttribute('aria-hidden', 'false');
      if (!drawer.classList.contains('is-open')) openCart();
    }
  });
  bodyClassObs.observe(document.body, { attributes: true, attributeFilter: ['class'] });

  /* ------- Event delegation: TODOS os data-open-cart abrem o drawer ------- */
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-open-cart], [data-box-open-cart]');
    if (trigger) {
      e.preventDefault();
      openCart();
      return;
    }
    if (e.target.closest('[data-bk-cart-close]')) {
      e.preventDefault();
      closeCart();
      return;
    }
    if (e.target.closest('[data-bk-cart-continue]')) {
      e.preventDefault();
      closeCart();
      // Scroll suave pro cardápio
      setTimeout(() => {
        const menu = document.querySelector('#menu, .menu-section, .box-menu');
        if (menu) menu.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 380);
      return;
    }
  });
  overlay.addEventListener('click', closeCart);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) closeCart();
  });

  // Swipe right pra fechar (mobile)
  let startX = 0, dx = 0, dragging = false, axis = null;
  drawer.addEventListener('touchstart', (e) => {
    if (e.target.closest('input, textarea, select, button')) return;
    startX = e.touches[0].clientX;
    dragging = true;
    dx = 0;
    axis = null;
  }, { passive: true });
  drawer.addEventListener('touchmove', (e) => {
    if (!dragging) return;
    const cx = e.touches[0].clientX - startX;
    if (axis == null && Math.abs(cx) > 8) axis = 'x';
    if (axis !== 'x') return;
    dx = Math.max(0, cx);
    drawer.classList.add('is-dragging');
    drawer.style.transform = `translateX(${dx}px)`;
    overlay.style.opacity = String(Math.max(0, 1 - dx / drawer.offsetWidth));
  }, { passive: true });
  drawer.addEventListener('touchend', () => {
    if (!dragging) return;
    dragging = false;
    drawer.classList.remove('is-dragging');
    drawer.style.transform = '';
    overlay.style.opacity = '';
    if (axis === 'x' && dx > drawer.offsetWidth * 0.32) closeCart();
    axis = null;
  });

  /* ------- Observa mudanças no form pra refresh do summary ------- */
  const obs = new MutationObserver(() => {
    if (drawer.classList.contains('is-open')) refreshSummary();
  });
  obs.observe(cartForm, { childList: true, subtree: true, characterData: true, attributes: true });

  // Sincroniza com mudança de idioma
  document.addEventListener('bp:lang-change', () => {
    refreshTexts();
    refreshSummary();
  });

  /* ------- Validação antes de enviar ao WhatsApp ------- */
  document.addEventListener('click', (e) => {
    const wa = e.target.closest('[data-whatsapp-order], [data-box-order]');
    if (!wa) return;
    const { itemCount } = readCartTotals();
    const dateInput = cartForm.querySelector('[data-date-input], input[type="date"]');
    const dateVal = dateInput?.value;

    // 1. Sem itens
    if (itemCount === 0) {
      e.preventDefault();
      e.stopImmediatePropagation();
      const lang = getLang();
      alert(lang === 'pt'
        ? 'Adicione pelo menos 1 item antes de enviar.'
        : 'Add at least 1 item before sending.');
      return;
    }

    // 2. Data inválida (anterior ao lead time)
    if (dateVal && window.bkIsValidPreorderDate && !window.bkIsValidPreorderDate(dateVal)) {
      e.preventDefault();
      e.stopImmediatePropagation();
      const lang = getLang();
      const lead = window.BK_CONFIG?.leadTimeHours || 48;
      alert(lang === 'pt'
        ? `A data precisa ser pelo menos ${lead}h a partir de agora.`
        : `Date must be at least ${lead}h from now.`);
      dateInput?.focus();
      return;
    }
  }, true);  // capture: pega ANTES do listener legacy disparar

  // API pública
  window.bkCart = { open: openCart, close: closeCart, refresh: refreshSummary };

  // Init
  refreshTexts();
  refreshSummary();
})();
