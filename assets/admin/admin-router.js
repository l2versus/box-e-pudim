/* ============================================================
   Admin router — view system, persistência, search, modal,
   sales range, CSV export, badges, sync com admin.js legacy
   ============================================================ */
(() => {
  'use strict';

  const root = document.querySelector('[data-admin-views]');
  const navLinks = [...document.querySelectorAll('[data-view-link]')];
  const views = [...document.querySelectorAll('.admin-view')];
  const titleEl = document.querySelector('[data-view-title]');
  const kickerEl = document.querySelector('[data-view-kicker]');

  const VIEW_META = {
    start:    { title: 'Início',    kicker: 'Operação de hoje' },
    orders:   { title: 'Pedidos',   kicker: 'Operação de hoje' },
    capacity: { title: 'Agenda',    kicker: 'Operação de hoje' },
    products: { title: 'Produtos',  kicker: 'Operação de hoje' },
    leads:    { title: 'Leads',     kicker: 'Operação de hoje' },
    rules:    { title: 'Regras',    kicker: 'Operação de hoje' },
    whatsapp: { title: 'WhatsApp',  kicker: 'Operação de hoje' },
  };

  /* ---------------- Router ---------------- */
  function showView(name) {
    if (!VIEW_META[name]) name = 'start';
    views.forEach((v) => v.classList.toggle('is-active', v.dataset.view === name));
    navLinks.forEach((a) => a.classList.toggle('is-active', a.dataset.viewLink === name));
    if (titleEl) titleEl.textContent = VIEW_META[name].title;
    if (kickerEl) kickerEl.textContent = VIEW_META[name].kicker;
    // scroll do main pra topo
    document.querySelector('.admin-main')?.scrollTo?.({ top: 0, behavior: 'smooth' });
    window.scrollTo?.({ top: 0, behavior: 'smooth' });
  }

  function viewFromHash() {
    const h = (location.hash || '').replace('#','').toLowerCase();
    return VIEW_META[h] ? h : 'start';
  }

  navLinks.forEach((a) => {
    a.addEventListener('click', (e) => {
      const target = a.dataset.viewLink;
      if (!target) return;
      // permite que clicks em quick-card também funcionem
      e.preventDefault();
      history.replaceState(null, '', '#' + target);
      showView(target);
    });
  });

  // mudança de hash externa
  window.addEventListener('hashchange', () => showView(viewFromHash()));

  // ao desbloquear, ir pro start
  const adminApp = document.querySelector('[data-admin-app]');
  if (adminApp) {
    new MutationObserver(() => {
      if (adminApp.getAttribute('aria-hidden') === 'false') {
        showView(viewFromHash());
      }
    }).observe(adminApp, { attributes: true, attributeFilter: ['aria-hidden'] });
  }

  // estado inicial
  showView(viewFromHash());

  /* ---------------- Persistência: orders ---------------- */
  const ORDERS_KEY = 'bp-admin-orders-state';
  const orderList = document.querySelector('[data-order-list]');
  let latestApiOrders = [];

  function snapshotOrders() {
    if (!orderList) return [];
    return [...orderList.querySelectorAll('.order-card')].map((c, i) => ({
      i,
      status: c.dataset.status,
      title: c.querySelector('h3')?.textContent || '',
      detail: c.querySelector('p')?.textContent || '',
      manual: c.dataset.manual === 'true',
      manualHTML: c.dataset.manual === 'true' ? c.outerHTML : null,
    }));
  }

  function saveOrders() {
    try { localStorage.setItem(ORDERS_KEY, JSON.stringify(snapshotOrders())); } catch {}
  }

  function restoreOrders() {
    if (!orderList) return;
    let saved = [];
    try { saved = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]'); } catch {}
    if (!saved.length) return;

    orderList.querySelector('.lead-empty')?.remove();
    saved.forEach((s) => {
      if (s.manual && s.manualHTML) {
        // pedido criado manualmente: re-injeta no DOM
        const tmp = document.createElement('div');
        tmp.innerHTML = s.manualHTML;
        const card = tmp.firstElementChild;
        if (card) orderList.appendChild(card);
      } else {
        const card = orderList.querySelectorAll('.order-card')[s.i];
        if (card && s.status) {
          updateCardStatus(card, s.status);
        }
      }
    });
    updateBadges();
    renderSalesBars();
  }

  const STATUS_FLOW = [
    { key: 'requested', label: 'Solicitado', action: 'Avancar' },
    { key: 'paid',      label: 'Pago',       action: 'Avancar' },
    { key: 'production',label: 'Producao',   action: 'Avancar' },
    { key: 'ready',     label: 'Pronto',     action: 'Finalizar' },
    { key: 'delivered', label: 'Entregue',   action: 'Reabrir' },
  ];

  function updateCardStatus(card, statusKey) {
    const def = STATUS_FLOW.find((s) => s.key === statusKey) || STATUS_FLOW[0];
    card.dataset.status = def.key;
    const pill = card.querySelector('.status-pill');
    if (pill) { pill.className = `status-pill ${def.key}`; pill.textContent = def.label; }
    const btn = card.querySelector('[data-next-status]');
    if (btn) btn.textContent = def.action;
  }

  // ============================================================
  // Backend integration — orders via API (com fallback localStorage)
  // Render usa DOM API pura (sem innerHTML) pra evitar XSS de campos do servidor.
  // ============================================================
  const BACKEND_TO_FRONT = {
    requested: 'requested',
    confirmed: 'requested',
    awaiting_payment: 'requested',
    paid: 'paid',
    in_production: 'production',
    ready: 'ready',
    out_for_delivery: 'ready',
    delivered: 'delivered',
    cancelled: 'delivered',
    refunded: 'delivered',
  };
  const NEXT_BACKEND_STATUS = {
    requested: 'confirmed',
    confirmed: 'awaiting_payment',
    awaiting_payment: 'paid',
    paid: 'in_production',
    in_production: 'ready',
    ready: 'delivered',
    out_for_delivery: 'delivered',
  };

  function fmtMoney(cents, currency = 'USD') {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format((cents || 0) / 100);
  }

  // Cria card de Order da API usando DOM pura — sem innerHTML, immune a XSS
  function renderApiOrderCard(order) {
    const front = BACKEND_TO_FRONT[order.status] || 'requested';
    const def = STATUS_FLOW.find((s) => s.key === front) || STATUS_FLOW[0];
    const itemsLine = (order.items || [])
      .map((it) => `${it.qty}x ${it.product?.name || it.productId}`)
      .join(', ');
    const customerName = order.customer?.name || 'Cliente';
    const requestedFor = order.requestedFor
      ? new Date(order.requestedFor).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
      : '—';

    const card = document.createElement('article');
    card.className = 'order-card';
    card.dataset.status = front;
    card.dataset.orderId = order.id;
    card.dataset.backendStatus = order.status;
    card.dataset.totalCents = String(order.totalCents || 0);
    card.dataset.requestedFor = order.requestedFor || order.createdAt || '';

    const header = document.createElement('header');
    const pill = document.createElement('span');
    pill.className = `status-pill ${front}`;
    pill.textContent = def.label;
    const headStrong = document.createElement('strong');
    headStrong.textContent = `#${order.number} · ${customerName}`;
    header.append(pill, headStrong);

    const h3 = document.createElement('h3');
    h3.textContent = itemsLine || 'Sem itens';

    const p = document.createElement('p');
    p.textContent = `${requestedFor} · ${order.fulfillment} · ${fmtMoney(order.totalCents, order.currency)}`;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.dataset.nextStatus = '';
    btn.textContent = def.action;

    card.append(header, h3, p, btn);
    return card;
  }

  async function loadOrdersFromApi() {
    if (!orderList || !window.bkApi || window.BK_CONFIG?.adminMode === 'demo') return false;
    try {
      const res = await window.bkApi.adminListOrders({ pageSize: 50 });
      const orders = res?.orders || [];
      const visibleOrders = orders.filter((o) => !['delivered', 'cancelled', 'refunded'].includes(o.status));
      latestApiOrders = orders;

      // Limpa cards demo e renderiza reais (apenas ativos)
      while (orderList.firstChild) orderList.removeChild(orderList.firstChild);
      if (!visibleOrders.length) {
        const empty = document.createElement('div');
        empty.className = 'lead-empty';
        empty.textContent = 'Nenhum pedido ativo ainda. Quando o cliente enviar o checkout, aparece aqui.';
        orderList.appendChild(empty);
        updateBadges();
        renderSalesBars(orders);
        return true;
      }
      for (const o of visibleOrders) {
        orderList.appendChild(renderApiOrderCard(o));
      }
      updateBadges();
      renderSalesBars(orders);
      return true;
    } catch {
      latestApiOrders = [];
      renderSalesBars([]);
      return false;
    }
  }

  // Hook click — roteia pra API se card é real, senão comportamento legacy
  orderList?.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-next-status]');
    if (!btn) return;
    const card = btn.closest('.order-card');
    const orderId = card?.dataset?.orderId;
    const backendStatus = card?.dataset?.backendStatus;

    if (orderId && backendStatus && window.bkApi) {
      const next = NEXT_BACKEND_STATUS[backendStatus];
      if (!next) return;
      btn.disabled = true;
      const orig = btn.textContent;
      btn.textContent = '...';
      try {
        const res = await window.bkApi.adminTransitionOrder(orderId, next);
        if (res?.order) {
          // Refetch list pra refletir mudanças (mais seguro que parchear o card)
          await loadOrdersFromApi();
        }
      } catch (err) {
        const msg = err?.code === 'invalid_transition' ? 'Transição inválida' : 'Erro ao avançar.';
        const t = document.querySelector('[data-toast]');
        if (t) { t.textContent = msg; t.classList.add('is-visible'); setTimeout(() => t.classList.remove('is-visible'), 2300); }
        btn.disabled = false;
        btn.textContent = orig;
      }
    } else {
      // Card legacy/demo
      setTimeout(() => { saveOrders(); updateBadges(); renderSalesBars(); }, 0);
    }
  });

  // Boot: tenta API; se nada, fallback localStorage
  setTimeout(async () => {
    const apiOk = await loadOrdersFromApi();
    if (!apiOk) restoreOrders();
  }, 100);

  // Re-render quando user logar (admin.js adiciona body.is-unlocked)
  new MutationObserver(() => {
    if (document.body.classList.contains('is-unlocked')) {
      loadOrdersFromApi();
    }
  }).observe(document.body, { attributes: true, attributeFilter: ['class'] });

  /* ---------------- Persistência: capacity + accepting ---------------- */
  const CAP_KEY = 'bp-admin-capacity';
  const ACC_KEY = 'bp-admin-accepting';

  document.querySelectorAll('[data-capacity-slider]').forEach((slider) => {
    const k = slider.dataset.capacitySlider;
    const saved = JSON.parse(localStorage.getItem(CAP_KEY) || '{}');
    if (saved[k] != null) {
      slider.value = saved[k];
      const out = document.querySelector(`[data-capacity-output="${k}"]`);
      if (out) out.textContent = saved[k];
    }
    slider.addEventListener('input', () => {
      const cur = JSON.parse(localStorage.getItem(CAP_KEY) || '{}');
      cur[k] = slider.value;
      localStorage.setItem(CAP_KEY, JSON.stringify(cur));
    });
  });

  // accepting state: persistir
  const acceptingBtn = document.querySelector('[data-accepting-toggle]');
  if (acceptingBtn) {
    const savedAcc = localStorage.getItem(ACC_KEY);
    if (savedAcc === '0') {
      // simular click pra alinhar legacy
      setTimeout(() => acceptingBtn.click(), 50);
    }
    acceptingBtn.addEventListener('click', () => {
      const isAccepting = acceptingBtn.classList.contains('admin-button-soft');
      localStorage.setItem(ACC_KEY, isAccepting ? '1' : '0');
    });
  }

  /* ---------------- Agenda real: capacidade + produção do dia via API ---------------- */
  (function setupAgenda() {
    const dateInput = document.querySelector('[data-capacity-date]');
    if (!dateInput) return;
    const saveBtn = document.querySelector('[data-capacity-save]');
    const prodList = document.querySelector('[data-production-list]');
    const prodTotal = document.querySelector('[data-production-total]');
    const apiOn = () => window.bkApi && window.BK_CONFIG?.adminMode !== 'demo';

    // Slider "puddings" controla a categoria pudim; "boxes" controla box.
    // sweet/tray/gift seguem a capacidade padrão (auto-criada no pedido).
    const SLIDER_CAT = { puddings: 'pudim', boxes: 'box' };
    const CAT_LABEL = { pudim: 'Pudins', sweet: 'Sobremesas', box: 'Boxes', tray: 'Bandejas', gift: 'Gifts' };

    function nextSaturdayISO() {
      const d = new Date();
      const add = (6 - d.getDay() + 7) % 7 || 7; // próximo sábado (nunca hoje)
      d.setDate(d.getDate() + add);
      return d.toISOString().slice(0, 10);
    }
    if (!dateInput.value) dateInput.value = nextSaturdayISO();

    function toast(msg) {
      const t = document.querySelector('[data-toast]');
      if (!t) return;
      t.textContent = msg;
      t.classList.add('is-visible');
      setTimeout(() => t.classList.remove('is-visible'), 2200);
    }

    async function loadCapacity(date) {
      if (!apiOn()) return;
      try {
        const res = await window.bkApi.adminCapacity(date, date);
        const byCat = {};
        (res?.slots || []).forEach((s) => { byCat[s.category] = s; });
        document.querySelectorAll('[data-capacity-slider]').forEach((sl) => {
          const cat = SLIDER_CAT[sl.dataset.capacitySlider];
          const slot = byCat[cat];
          if (!slot) return;
          sl.value = slot.capacityMax;
          const out = document.querySelector(`[data-capacity-output="${sl.dataset.capacitySlider}"]`);
          if (out) out.textContent = slot.capacityMax;
          const rsv = document.querySelector(`[data-capacity-reserved="${cat}"]`);
          if (rsv) rsv.textContent = `${slot.reserved} reservados`;
        });
      } catch { /* mantém valores atuais */ }
    }

    async function loadProduction(date) {
      if (!apiOn() || !prodList) return;
      try {
        const res = await window.bkApi.adminProduction(date);
        const items = res?.products || [];
        if (prodTotal) prodTotal.textContent = `${res?.totalUnits || 0} un.`;
        while (prodList.firstChild) prodList.removeChild(prodList.firstChild);
        if (!items.length) {
          const e = document.createElement('div');
          e.className = 'lead-empty';
          e.textContent = 'Nenhum pedido pra produzir nesse dia ainda.';
          prodList.appendChild(e);
          return;
        }
        for (const p of items) {
          const row = document.createElement('div');
          row.className = 'production-row';
          const left = document.createElement('div');
          const name = document.createElement('span');
          name.className = 'production-row__name';
          name.textContent = p.name || p.slug;
          const cat = document.createElement('small');
          cat.className = 'production-row__cat';
          cat.textContent = CAT_LABEL[p.category] || p.category;
          left.append(name, cat);
          const qty = document.createElement('strong');
          qty.className = 'production-row__qty';
          // confirmados firmes; pendentes (ainda não confirmados pela dona) como "+N?"
          qty.textContent = p.pending > 0 ? `${p.confirmed}+${p.pending}?` : `${p.confirmed}`;
          row.append(left, qty);
          prodList.appendChild(row);
        }
      } catch {
        while (prodList.firstChild) prodList.removeChild(prodList.firstChild);
        const e = document.createElement('div');
        e.className = 'lead-empty';
        e.textContent = 'Não consegui carregar a produção (API offline?).';
        prodList.appendChild(e);
      }
    }

    function refresh() {
      loadCapacity(dateInput.value);
      loadProduction(dateInput.value);
    }

    dateInput.addEventListener('change', refresh);

    saveBtn?.addEventListener('click', async () => {
      if (!apiOn()) { toast('Modo demo: limite salvo só localmente.'); return; }
      const date = dateInput.value;
      const orig = saveBtn.textContent;
      saveBtn.disabled = true;
      saveBtn.textContent = 'Salvando...';
      try {
        for (const sl of document.querySelectorAll('[data-capacity-slider]')) {
          const cat = SLIDER_CAT[sl.dataset.capacitySlider];
          if (!cat) continue;
          await window.bkApi.adminSetCapacity(date, cat, Number(sl.value));
        }
        toast('Capacidade salva.');
        await loadCapacity(date);
      } catch {
        toast('Erro ao salvar capacidade.');
      } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = orig;
      }
    });

    // Carrega ao desbloquear o painel.
    const boot = () => { if (document.body.classList.contains('is-unlocked')) refresh(); };
    new MutationObserver(boot).observe(document.body, { attributes: true, attributeFilter: ['class'] });
    setTimeout(boot, 320);
  })();

  /* ---------------- Search + filter de produtos ---------------- */
  const productList = document.querySelector('[data-product-list]');
  const searchInput = document.querySelector('[data-product-search]');
  const filterSelect = document.querySelector('[data-product-filter]');

  function applyProductFilter() {
    if (!productList) return;
    const q = (searchInput?.value || '').toLowerCase().trim();
    const f = filterSelect?.value || 'all';

    [...productList.querySelectorAll('.product-control')].forEach((card) => {
      const text = card.textContent.toLowerCase();
      const isPaused = card.classList.contains('is-paused');
      const matchesText = !q || text.includes(q);
      let matchesFilter = true;
      if (f === 'paused') matchesFilter = isPaused;
      else if (f !== 'all') {
        matchesFilter = text.includes(f.toLowerCase()) || (f === 'Ambos' && text.includes('ambos'));
      }
      card.style.display = (matchesText && matchesFilter) ? '' : 'none';
    });
  }
  searchInput?.addEventListener('input', applyProductFilter);
  filterSelect?.addEventListener('change', applyProductFilter);

  // re-aplica filtro quando admin.js re-renderiza a lista
  if (productList) {
    new MutationObserver(applyProductFilter).observe(productList, { childList: true });
  }

  /* ---------------- KPIs reais (calcula de orders + leads + capacity) ---------------- */
  function fmtUSD(v) {
    const n = Number(v) || 0;
    return n >= 1000 ? `$${(n/1000).toFixed(1).replace(/\.0$/, '')}k` : `$${n.toFixed(2).replace(/\.00$/, '')}`;
  }

  function readOrderTotal(card) {
    // Lê o último valor "$XX" em qualquer texto da card
    const txt = card.textContent;
    const matches = txt.match(/\$\d[\d,.]*/g);
    if (!matches) return 0;
    const last = matches[matches.length - 1].replace(/[$,]/g, '');
    return Number(last) || 0;
  }

  // Atualiza KPIs — tenta API primeiro (números reais do banco),
  // fallback nos cards do DOM (modo demo / API offline).
  let kpisFromApi = false;
  async function updateKPIs() {
    const set = (sel, val) => { const el = document.querySelector(sel); if (el) el.textContent = val; };

    // Tenta API
    if (window.bkApi && window.BK_CONFIG?.adminMode !== 'demo') {
      try {
        const k = await window.bkApi.adminKpis();
        kpisFromApi = true;
        const today = k.revenue?.today?.cents || 0;
        const last7d = k.revenue?.last7d?.cents || 0;
        const tickets7d = k.revenue?.last7d?.count || 0;
        const ticket = tickets7d > 0 ? last7d / tickets7d : 0;

        set('[data-kpi-revenue]', fmtUSD(today / 100));
        set('[data-kpi-revenue-sub]', `7d: ${fmtUSD(last7d / 100)} (${tickets7d} pedidos)`);
        set('[data-kpi-orders]', String(k.openOrders || 0));
        set('[data-kpi-orders-sub]', `${k.newLeads24h || 0} leads novos em 24h`);
        set('[data-kpi-ticket]', fmtUSD(ticket / 100));
        set('[data-kpi-ticket-sub]', `média 7d (${tickets7d} pedidos)`);
        // Capacity continua dos sliders por enquanto (Fase 2.3 migra também)
        const sliders = document.querySelectorAll('[data-capacity-slider]');
        const cap = [...sliders].reduce((sum, s) => sum + Number(s.value || 0), 0);
        set('[data-kpi-capacity]', String(Math.max(0, cap - (k.openOrders || 0))));
        return;
      } catch {
        kpisFromApi = false;
        /* fallback abaixo */
      }
    }

    // Fallback: calcula a partir dos cards do DOM (legacy demo mode)
    if (!orderList) return;
    const cards = [...orderList.querySelectorAll('.order-card')];
    const active = cards.filter((c) => c.dataset.status !== 'delivered');
    const requested = cards.filter((c) => c.dataset.status === 'requested');
    const paid = cards.filter((c) => c.dataset.status === 'paid');
    const totalRevenue = active.reduce((sum, c) => sum + readOrderTotal(c), 0);
    const ticket = active.length > 0 ? totalRevenue / active.length : 0;

    const sliders = document.querySelectorAll('[data-capacity-slider]');
    const cap = [...sliders].reduce((sum, s) => sum + Number(s.value || 0), 0);
    const free = Math.max(0, cap - active.length);

    set('[data-kpi-revenue]', fmtUSD(totalRevenue));
    set('[data-kpi-revenue-sub]', active.length === 0 ? 'nenhum pedido ativo' :
      requested.length > 0 ? `${requested.length} aguardando pagamento` : 'em produção/entrega');

    set('[data-kpi-orders]', String(active.length));
    set('[data-kpi-orders-sub]',
      requested.length > 0 ? `${requested.length} aguardando pagamento` :
      paid.length > 0 ? `${paid.length} pagos · em produção` : '—');

    set('[data-kpi-capacity]', String(free));
    set('[data-kpi-ticket]', fmtUSD(ticket));
    set('[data-kpi-ticket-sub]', `baseado em ${active.length} pedido${active.length === 1 ? '' : 's'} ativo${active.length === 1 ? '' : 's'}`);
  }

  // Atualiza KPIs sempre que orderList muda
  if (orderList) new MutationObserver(updateKPIs).observe(orderList, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-status'] });
  document.querySelectorAll('[data-capacity-slider]').forEach((s) => s.addEventListener('input', updateKPIs));
  setTimeout(updateKPIs, 250);

  /* ---------------- Quick-action counts ---------------- */
  const quickOrders = document.querySelector('[data-quick-orders]');
  const quickProducts = document.querySelector('[data-quick-products]');
  const quickLeads = document.querySelector('[data-quick-leads]');

  function updateQuickCounts() {
    if (quickOrders) {
      const n = orderList?.querySelectorAll('.order-card:not([data-status="delivered"])').length || 0;
      quickOrders.textContent = n;
    }
    if (quickProducts) {
      const n = productList?.querySelectorAll('.product-control:not(.is-paused)').length || 0;
      quickProducts.textContent = n;
    }
    if (quickLeads) {
      const n = document.querySelectorAll('[data-lead-list] > article').length || 0;
      quickLeads.textContent = n;
    }
  }

  /* ---------------- Nav badges (orders + leads) ---------------- */
  function updateBadges() {
    const ordersBadge = document.querySelector('[data-nav-badge="orders"]');
    const leadsBadge = document.querySelector('[data-nav-badge="leads"]');
    if (ordersBadge) {
      const n = orderList?.querySelectorAll('.order-card[data-status="requested"]').length || 0;
      ordersBadge.textContent = n > 0 ? n : '';
    }
    if (leadsBadge) {
      const n = document.querySelectorAll('[data-lead-list] > article').length || 0;
      leadsBadge.textContent = n > 0 ? n : '';
    }
    updateQuickCounts();
  }

  // observa o DOM pra reagir a mudanças
  if (orderList) new MutationObserver(updateBadges).observe(orderList, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-status'] });
  const leadList = document.querySelector('[data-lead-list]');
  if (leadList) new MutationObserver(updateBadges).observe(leadList, { childList: true });
  if (productList) new MutationObserver(updateBadges).observe(productList, { childList: true, attributes: true });

  setTimeout(updateBadges, 200);

  /* ---------------- Sales range toggle ---------------- */
  const salesBars = document.querySelector('[data-sales-bars]');
  const salesTitle = document.querySelector('.sales-panel .panel-heading h2');
  let currentSalesRange = 'week';

  function collectDomSalesOrders() {
    if (!orderList) return [];
    return [...orderList.querySelectorAll('.order-card')].map((card) => ({
      status: card.dataset.backendStatus || card.dataset.status,
      requestedFor: card.dataset.requestedFor || new Date().toISOString(),
      totalCents: Number(card.dataset.totalCents || Math.round(readOrderTotal(card) * 100)),
    }));
  }

  function renderSalesBars(orders = latestApiOrders, range = currentSalesRange) {
    if (!salesBars) return;
    const source = (orders && orders.length ? orders : collectDomSalesOrders())
      .filter((order) => !['cancelled', 'refunded'].includes(order.status));
    const labels = range === 'month' ? ['W1', 'W2', 'W3', 'W4'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const totals = labels.map(() => 0);
    const now = new Date();

    source.forEach((order) => {
      const d = new Date(order.requestedFor || order.createdAt || now);
      if (Number.isNaN(d.getTime())) return;
      const cents = Number(order.totalCents || 0);
      if (range === 'month') {
        if (d.getMonth() !== now.getMonth() || d.getFullYear() !== now.getFullYear()) return;
        const weekIndex = Math.min(3, Math.floor((d.getDate() - 1) / 7));
        totals[weekIndex] += cents;
      } else {
        const start = new Date(now);
        start.setHours(0, 0, 0, 0);
        start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
        if (d < start || d > end) return;
        const dayIndex = (d.getDay() + 6) % 7;
        if (dayIndex < labels.length) totals[dayIndex] += cents;
      }
    });

    const max = Math.max(...totals, 1);
    salesBars.classList.toggle('is-empty', totals.every((v) => v === 0));
    salesBars.innerHTML = labels.map((label, i) => {
      const value = Math.round((totals[i] / max) * 100);
      return `<span style="--value: ${value}%"><b>${label}</b><i>${fmtUSD(totals[i] / 100)}</i></span>`;
    }).join('');
  }

  document.querySelectorAll('[data-sales-range] button').forEach((b) => {
    b.addEventListener('click', () => {
      document.querySelectorAll('[data-sales-range] button').forEach((x) => x.classList.toggle('is-active', x === b));
      currentSalesRange = b.dataset.range === 'month' ? 'month' : 'week';
      if (salesTitle) salesTitle.textContent = currentSalesRange === 'month' ? 'Mês' : 'Semana';
      renderSalesBars();
    });
  });
  renderSalesBars();

  /* ---------------- Modal: novo pedido manual ---------------- */
  const modal = document.querySelector('[data-order-modal]');
  const modalForm = document.querySelector('[data-order-form]');

  function openOrderModal() {
    if (!modal) return;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    setTimeout(() => modal.querySelector('input')?.focus(), 100);
  }
  function closeOrderModal() {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = '';
    modalForm?.reset();
  }

  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-order-new]')) { e.preventDefault(); openOrderModal(); }
    if (e.target.closest('[data-order-modal-close]')) { e.preventDefault(); closeOrderModal(); }
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal?.hidden) closeOrderModal(); });

  modalForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const f = new FormData(modalForm);
    const customer = String(f.get('customer') || '').trim();
    const title = String(f.get('title') || '').trim();
    const total = Number(f.get('total') || 0);
    const date = String(f.get('date') || '').trim();
    const fulfillment = String(f.get('fulfillment') || 'Pickup');
    const status = String(f.get('status') || 'requested');

    if (!customer || !title) return;

    const card = document.createElement('article');
    card.className = 'order-card';
    card.dataset.status = status;
    card.dataset.manual = 'true';
    const def = STATUS_FLOW.find((s) => s.key === status) || STATUS_FLOW[0];
    card.innerHTML = `
      <div>
        <span class="status-pill ${def.key}">${def.label}</span>
        <h3>${title}</h3>
        <p>${customer} · ${fulfillment} · ${date || 'sem data'} · $${total}</p>
      </div>
      <button type="button" data-next-status>${def.action}</button>
    `;
    orderList?.prepend(card);
    saveOrders();
    updateBadges();
    closeOrderModal();
    document.querySelector('[data-toast]')?.dispatchEvent?.(new Event('click'));
    // toast manual
    const t = document.querySelector('[data-toast]');
    if (t) {
      t.textContent = 'Pedido criado.';
      t.classList.add('is-visible');
      setTimeout(() => t.classList.remove('is-visible'), 2300);
    }
    // navegar pra orders
    location.hash = 'orders';
  });

  /* ---------------- Export CSV de leads ---------------- */
  document.querySelector('[data-leads-export]')?.addEventListener('click', () => {
    const items = [...document.querySelectorAll('[data-lead-list] > article')];
    if (!items.length) return;
    const rows = [['Status','Origem','Itens','Forma','Data','Horario','Total','Mensagem']];
    items.forEach((a) => {
      const text = a.textContent.trim().replace(/\s+/g, ' ');
      const cols = a.querySelectorAll('span,strong,p,pre');
      const get = (i) => (cols[i]?.textContent || '').trim().replace(/\s+/g, ' ');
      rows.push([get(0), '', get(1), get(2), '', '', '', get(3)]);
    });
    const csv = rows.map((r) => r.map((c) => `"${(c||'').replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `leads-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  });

  /* ============================================================
     WhatsApp view — número + templates + caixa de entrada
     ============================================================ */
  const WA_NUMBER_KEY = 'bp-admin-wa-number';
  const WA_TEMPLATES_KEY = 'bp-admin-wa-templates';

  const DEFAULT_TEMPLATES = [
    { id: 't1', title: 'Confirmação de pedido', body: 'Oi {nome}! Recebi seu pedido de {item} pra {data}. Posso confirmar e mandar o link de pagamento?' },
    { id: 't2', title: 'Pedir endereço / ZIP', body: 'Pra fechar a entrega, me manda por favor: endereço completo, ZIP, melhor janela de horário e telefone de contato.' },
    { id: 't3', title: 'Solicitar pagamento', body: 'Pode pagar via Zelle ou Venmo no numero +1 (203) 482-2797. O valor e {valor}. Quando fizer, me manda o screenshot pra eu colocar em producao.' },
    { id: 't4', title: 'Prazo de produção', body: 'Combinado! Vou começar a produção {data}. Te aviso quando estiver pronto pra retirar.' },
    { id: 't5', title: 'Lembrete véspera', body: 'Oi {nome}, passando pra confirmar a retirada de amanhã do {item}. Janela: 5:00 - 7:30 PM. Tudo certo do seu lado?' },
    { id: 't6', title: 'Pickup pronto', body: 'Tá pronto! Pode passar a hora que combinamos. Endereço de retirada e instruções já estão no Maps: <link>.' },
    { id: 't7', title: 'Atraso / replanejamento', body: 'Oi {nome}, tive um imprevisto na produção do {item} e preciso remarcar. Posso entregar {data} ou ajustamos pra outra data que funcione melhor pra você?' },
    { id: 't8', title: 'Pós-entrega', body: 'Espero que tenha curtido o {item}! Se puder me mandar uma foto ou um feedback rápido, ajuda demais a próxima encomenda. Obrigada!' },
  ];

  // Detecta {nome|item|data|valor} no body. Só esses 4 placeholders documentados.
  const PLACEHOLDER_RE = /\{(nome|item|data|valor)\}/g;
  function detectPlaceholders(body) {
    if (!body) return [];
    const found = new Set();
    let m;
    PLACEHOLDER_RE.lastIndex = 0;
    while ((m = PLACEHOLDER_RE.exec(body)) !== null) found.add(m[1]);
    return [...found];
  }

  // Substitui placeholders pelos valores fornecidos.
  // Se o valor estiver vazio, mantém o {placeholder} literal pra dona perceber.
  function fillWithVars(body, vars) {
    if (!body) return '';
    return body
      .split('{nome}').join(vars.nome || '{nome}')
      .split('{item}').join(vars.item || '{item}')
      .split('{data}').join(vars.data || '{data}')
      .split('{valor}').join(vars.valor || '{valor}');
  }

  // Copy helper — apenas Clipboard API moderna (já é suportada em todo browser desde 2020+).
  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }

  // Mini-modal pra preencher variáveis e copiar.
  // DOM puro (sem innerHTML) pra evitar XSS de valores digitados pela dona.
  function openFillModal(template, placeholders, onCopy) {
    const LABELS = { nome: 'Nome do cliente', item: 'Item / produto', data: 'Data', valor: 'Valor' };
    const HINTS  = { nome: 'Maria Silva', item: 'pudim clássico', data: 'sábado 15/05', valor: '$28' };

    const backdrop = document.createElement('div');
    backdrop.className = 'wa-fill-backdrop';

    const modal = document.createElement('div');
    modal.className = 'wa-fill-modal';
    backdrop.appendChild(modal);

    const h = document.createElement('h3');
    h.className = 'wa-fill-title';
    h.textContent = `Preencher "${template.title}"`;
    modal.appendChild(h);

    const sub = document.createElement('p');
    sub.className = 'wa-fill-sub';
    sub.textContent = 'Preencha os campos. Texto vai pro clipboard pronto pra colar no WhatsApp.';
    modal.appendChild(sub);

    // Preview live
    const preview = document.createElement('pre');
    preview.className = 'wa-fill-preview';
    preview.textContent = template.body;
    modal.appendChild(preview);

    const form = document.createElement('div');
    form.className = 'wa-fill-form';
    modal.appendChild(form);

    const inputs = {};
    const updatePreview = () => {
      const vars = Object.fromEntries(Object.keys(inputs).map((k) => [k, inputs[k].value.trim()]));
      preview.textContent = fillWithVars(template.body, vars);
    };

    for (const key of placeholders) {
      const row = document.createElement('label');
      row.className = 'wa-fill-row';
      const lbl = document.createElement('span');
      lbl.textContent = LABELS[key] || key;
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = HINTS[key] || '';
      input.addEventListener('input', updatePreview);
      inputs[key] = input;
      row.append(lbl, input);
      form.appendChild(row);
    }

    const actions = document.createElement('div');
    actions.className = 'wa-fill-actions';
    modal.appendChild(actions);

    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.className = 'wa-fill-cancel';
    cancelBtn.textContent = 'Cancelar';

    const copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.className = 'wa-fill-copy';
    copyBtn.textContent = 'Copiar e fechar';

    actions.append(cancelBtn, copyBtn);

    function close() {
      backdrop.remove();
      document.removeEventListener('keydown', onKey);
    }
    function onKey(e) {
      if (e.key === 'Escape') close();
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) copyBtn.click();
    }

    cancelBtn.addEventListener('click', close);
    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });
    document.addEventListener('keydown', onKey);
    copyBtn.addEventListener('click', async () => {
      const vars = Object.fromEntries(Object.keys(inputs).map((k) => [k, inputs[k].value.trim()]));
      const filled = fillWithVars(template.body, vars);
      const ok = await copyToClipboard(filled);
      onCopy?.(filled, ok);
      close();
    });

    document.body.appendChild(backdrop);
    setTimeout(() => inputs[placeholders[0]]?.focus(), 50);
  }

  function loadTemplates() {
    try {
      const saved = JSON.parse(localStorage.getItem(WA_TEMPLATES_KEY) || 'null');
      if (Array.isArray(saved) && saved.length) return saved;
    } catch {}
    return DEFAULT_TEMPLATES;
  }
  function saveTemplates(list) {
    localStorage.setItem(WA_TEMPLATES_KEY, JSON.stringify(list));
  }

  function getWaNumber() {
    return localStorage.getItem(WA_NUMBER_KEY) || (window.BK_CONFIG?.waPhone ? `+${window.BK_CONFIG.waPhone}` : '+1 (203) 482-2797');
  }
  function setWaNumber(v) {
    localStorage.setItem(WA_NUMBER_KEY, v);
  }
  function digitsOnly(s) { return (s || '').replace(/\D/g, ''); }
  function formatNumber(n) {
    const d = digitsOnly(n);
    if (d.length === 11 && d.startsWith('1')) {
      return `+1 (${d.slice(1,4)}) ${d.slice(4,7)}-${d.slice(7)}`;
    }
    if (d.length === 10) {
      return `+1 (${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}`;
    }
    return n.startsWith('+') ? n : '+' + d;
  }

  // Render número
  const numDisplay = document.querySelector('[data-wa-number-display]');
  const numInput = document.querySelector('[data-wa-number-input]');
  const editZone = document.querySelector('[data-wa-edit-zone]');
  const dispZone = document.querySelector('[data-wa-display-zone]');

  function renderNumber() {
    if (numDisplay) numDisplay.textContent = formatNumber(getWaNumber());
  }
  renderNumber();

  document.querySelector('[data-wa-edit-number]')?.addEventListener('click', () => {
    if (numInput) numInput.value = getWaNumber();
    editZone?.removeAttribute('hidden');
    if (dispZone) dispZone.style.display = 'none';
    setTimeout(() => numInput?.focus(), 60);
  });
  document.querySelector('[data-wa-number-cancel]')?.addEventListener('click', () => {
    editZone?.setAttribute('hidden', '');
    if (dispZone) dispZone.style.display = '';
  });
  document.querySelector('[data-wa-number-save]')?.addEventListener('click', () => {
    if (!numInput) return;
    const v = numInput.value.trim();
    if (!v) return;
    setWaNumber(v);
    renderNumber();
    editZone?.setAttribute('hidden', '');
    if (dispZone) dispZone.style.display = '';
    toast(`Número atualizado para ${formatNumber(v)}`);
  });

  document.querySelector('[data-wa-test]')?.addEventListener('click', () => {
    const num = digitsOnly(getWaNumber());
    const msg = encodeURIComponent('Teste do painel: tudo conectado.');
    window.open(`https://wa.me/${num}?text=${msg}`, '_blank', 'noopener');
  });

  // Render templates
  const tmplList = document.querySelector('[data-wa-templates]');
  let templates = loadTemplates();

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  }

  function renderTemplates() {
    if (!tmplList) return;
    if (!templates.length) {
      tmplList.innerHTML = '<li class="wa-empty">Nenhum template ainda. Toque "Novo template" pra criar o primeiro.</li>';
      return;
    }
    tmplList.innerHTML = templates.map((t) => `
      <li class="wa-template" data-id="${t.id}">
        <div class="wa-template-title">
          <span>${escapeHtml(t.title)}</span>
          <em>${t.body.length} caracteres</em>
        </div>
        <p class="wa-template-body">${escapeHtml(t.body)}</p>
        <div class="wa-template-actions">
          <button type="button" data-act="copy">Copiar</button>
          <button type="button" data-act="edit">Editar</button>
          <button type="button" data-act="delete" class="is-danger">Apagar</button>
        </div>
        <div class="wa-template-edit-form">
          <input type="text" data-edit="title" value="${escapeHtml(t.title)}" />
          <textarea data-edit="body" rows="3">${escapeHtml(t.body)}</textarea>
          <div class="wa-template-edit-actions">
            <button type="button" class="admin-button admin-button-primary" data-act="save">Salvar</button>
            <button type="button" class="admin-button admin-button-ghost" data-act="cancel">Cancelar</button>
          </div>
        </div>
      </li>
    `).join('');
  }
  renderTemplates();

  tmplList?.addEventListener('click', async (e) => {
    const li = e.target.closest('.wa-template');
    if (!li) return;
    const id = li.dataset.id;
    const idx = templates.findIndex((t) => t.id === id);
    if (idx < 0) return;
    const actBtn = e.target.closest('[data-act]');
    const act = actBtn?.dataset.act;

    if (act === 'copy' || (!act && !li.hasAttribute('data-editing'))) {
      const t = templates[idx];
      const placeholders = detectPlaceholders(t.body);

      // Auto-detect: tem {variáveis}? abre modal pra preencher. Senão copia direto.
      if (placeholders.length > 0) {
        openFillModal(t, placeholders, (filled, ok) => {
          if (ok) {
            li.classList.add('is-copied');
            setTimeout(() => li.classList.remove('is-copied'), 1400);
            toast(`"${t.title}" copiado preenchido.`);
          } else {
            toast('Falha ao copiar. Selecione manual o texto.');
          }
        });
        return;
      }

      const ok = await copyToClipboard(t.body);
      if (ok) {
        li.classList.add('is-copied');
        setTimeout(() => li.classList.remove('is-copied'), 1400);
      } else {
        toast('Falha ao copiar. Selecione manual o texto.');
      }
      return;
    }

    if (act === 'edit') {
      li.setAttribute('data-editing', 'true');
      return;
    }
    if (act === 'cancel') {
      li.removeAttribute('data-editing');
      return;
    }
    if (act === 'save') {
      const title = li.querySelector('[data-edit="title"]')?.value.trim();
      const body = li.querySelector('[data-edit="body"]')?.value.trim();
      if (!title || !body) return;
      templates[idx] = { ...templates[idx], title, body };
      saveTemplates(templates);
      renderTemplates();
      toast('Template salvo.');
      return;
    }
    if (act === 'delete') {
      if (!confirm(`Apagar template "${templates[idx].title}"?`)) return;
      templates.splice(idx, 1);
      saveTemplates(templates);
      renderTemplates();
      toast('Template removido.');
      return;
    }
  });

  document.querySelector('[data-wa-template-add]')?.addEventListener('click', () => {
    templates.unshift({
      id: 't' + Date.now(),
      title: 'Novo template',
      body: 'Escreva aqui a mensagem padrão. Use {nome}, {item}, {data}, {valor}.',
    });
    saveTemplates(templates);
    renderTemplates();
    const first = tmplList?.querySelector('.wa-template');
    first?.setAttribute('data-editing', 'true');
    first?.querySelector('[data-edit="title"]')?.focus();
  });

  // Render conversas (a partir de leads)
  const convList = document.querySelector('[data-wa-conversations]');

  // Cache de leads carregados (pra resolver clicks em "aplicar template")
  let currentLeads = [];

  // Substitui {nome}, {item}, {data}, {valor} pelos dados do lead.
  // Se o campo não existe no lead, mantém o {placeholder} literal pra dona perceber.
  function fillTemplate(body, lead) {
    if (!body || !lead) return body || '';
    const items = Array.isArray(lead.items) ? lead.items.join(', ') : (lead.items || '');
    const data = lead.date ? String(lead.date) : '';
    const valor = lead.total ? String(lead.total) : '';
    const nome = lead.name || '';
    return body
      .split('{nome}').join(nome || '{nome}')
      .split('{item}').join(items || '{item}')
      .split('{data}').join(data || '{data}')
      .split('{valor}').join(valor || '{valor}');
  }

  // Tenta API primeiro (autenticado via cookie httpOnly).
  // Se falhar (sem login, API offline, demo mode), volta pro localStorage.
  async function loadLeadsForView() {
    if (window.bkApi && window.BK_CONFIG?.adminMode !== 'demo') {
      try {
        const res = await window.bkApi.adminListLeads({ pageSize: 50 });
        if (Array.isArray(res?.leads)) {
          // Normaliza shape pro render existente (que espera campos do localStorage)
          return res.leads.map((l) => ({
            id: l.id,
            source: 'API · ' + (l.source || 'site'),
            status: l.status === 'new' ? 'Novo lead' : l.status,
            createdAt: l.createdAt,
            fulfillment: '',
            total: '',
            items: l.productSlug ? [l.productSlug] : [],
            message: l.message || '',
            note: '',
            phone: l.phone,
            email: l.email,
          }));
        }
      } catch {
        /* sem cookie / API offline → fallback */
      }
    }
    try {
      const saved = JSON.parse(localStorage.getItem('bp-leads') || 'null');
      if (Array.isArray(saved)) return saved;
    } catch {}
    return [];
  }

  async function renderConversations() {
    if (!convList) return;
    const leads = await loadLeadsForView();
    currentLeads = leads;
    if (!leads.length) {
      convList.innerHTML = '<li class="wa-empty">Nenhuma mensagem ainda. Quando um cliente enviar o carrinho pelo site, aparece aqui.</li>';
      return;
    }
    const num = digitsOnly(getWaNumber());
    const tmpls = templates;
    convList.innerHTML = leads.map((lead) => {
      const created = lead.createdAt ? new Date(lead.createdAt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : '';
      const items = Array.isArray(lead.items) ? lead.items.join(', ') : (lead.items || '');
      const status = lead.status || 'Novo lead';
      const isNew = /novo/i.test(status);
      const msg = lead.message || lead.note || '';
      const reply = encodeURIComponent(`Oi! Recebi sua mensagem de ${items}. Posso confirmar?`);
      const tmplChips = tmpls.map((t) => `
        <button type="button" class="wa-tmpl-chip" data-wa-tmpl-apply data-lead-id="${escapeHtml(lead.id || '')}" data-tmpl-id="${escapeHtml(t.id)}" title="${escapeHtml(t.body)}">${escapeHtml(t.title)}</button>
      `).join('');
      return `
        <li class="wa-conv">
          <div class="wa-conv-top">
            <div class="wa-conv-meta">
              <strong>${escapeHtml(items || 'Sem itens')}</strong>
              <small>${escapeHtml(lead.source || 'Site')} · ${escapeHtml(created)} · ${escapeHtml(lead.fulfillment || 'sem forma')}${lead.total ? ' · ' + escapeHtml(lead.total) : ''}</small>
            </div>
            <span class="wa-conv-status ${isNew ? 'is-new' : ''}">${escapeHtml(status)}</span>
          </div>
          <p class="wa-conv-msg">${escapeHtml(msg).replace(/\n/g, ' ')}</p>
          <details class="wa-conv-templates">
            <summary>Aplicar template (preenchido com dados desta conversa)</summary>
            <div class="wa-conv-templates-list">${tmplChips}</div>
          </details>
          <div class="wa-conv-actions">
            <a class="is-primary" href="https://wa.me/${num}?text=${reply}" target="_blank" rel="noreferrer">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.5A10 10 0 1 0 12 2z"/></svg>
              Continuar no WA
            </a>
            <button type="button" data-wa-copy-msg data-msg="${escapeHtml(msg)}">Copiar mensagem</button>
            <a href="#leads" data-view-link="leads">Ver no Leads</a>
          </div>
        </li>
      `;
    }).join('');
  }
  renderConversations();

  convList?.addEventListener('click', async (e) => {
    // 1) Aplicar template a esta conversa (substitui {nome}/{item}/{data}/{valor})
    const tmplBtn = e.target.closest('[data-wa-tmpl-apply]');
    if (tmplBtn) {
      e.preventDefault();
      const leadId = tmplBtn.dataset.leadId;
      const tmplId = tmplBtn.dataset.tmplId;
      const lead = currentLeads.find((l) => l.id === leadId);
      const tmpl = templates.find((t) => t.id === tmplId);
      if (!lead || !tmpl) return;
      const filled = fillTemplate(tmpl.body, lead);
      try {
        await navigator.clipboard.writeText(filled);
      } catch {
        // fallback execCommand
        const ta = document.createElement('textarea');
        ta.value = filled;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch {}
        ta.remove();
      }
      // Feedback visual + toast informa se ainda tem placeholders pendentes
      tmplBtn.classList.add('is-copied');
      setTimeout(() => tmplBtn.classList.remove('is-copied'), 1400);
      const pending = (filled.match(/\{(nome|item|data|valor)\}/g) || []);
      if (pending.length) {
        toast(`"${tmpl.title}" copiado. Preencha manual: ${[...new Set(pending)].join(', ')}`);
      } else {
        toast(`"${tmpl.title}" copiado preenchido.`);
      }
      return;
    }

    // 2) Copiar mensagem original do cliente
    const btn = e.target.closest('[data-wa-copy-msg]');
    if (!btn) return;
    try {
      await navigator.clipboard.writeText(btn.dataset.msg || '');
      toast('Mensagem copiada.');
    } catch {}
  });

  // helper: toast (reusa do legacy se existir, senão simples)
  function toast(msg) {
    const t = document.querySelector('[data-toast]');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('is-visible');
    setTimeout(() => t.classList.remove('is-visible'), 2300);
  }

  // re-render conversations quando o número muda
  document.querySelector('[data-wa-number-save]')?.addEventListener('click', () => {
    setTimeout(renderConversations, 100);
  });

  /* ---------------- Delivery settings ---------------- */
  const deliveryForm = document.querySelector('[data-delivery-settings-form]');
  const adminMap = document.querySelector('[data-admin-service-map]');
  const adminZipInput = document.querySelector('[data-admin-delivery-zip]');
  const adminZipCheck = document.querySelector('[data-admin-delivery-check]');
  const adminQuote = document.querySelector('[data-admin-delivery-quote]');
  let deliverySettings = window.bkDelivery?.getSettings();

  function centsToInput(cents) {
    return (Number(cents || 0) / 100).toFixed(2);
  }

  function inputToCents(value) {
    return Math.max(0, Math.round(Number(value || 0) * 100));
  }

  function normalizeAdminSettings(settings) {
    const base = window.bkDelivery?.getSettings(settings) || settings;
    return {
      enabled: base.enabled !== false,
      unit: base.unit || 'mi',
      baseZip: base.baseZip || '06810',
      maxRadiusMiles: Number(base.maxRadiusMiles || 15),
      store: base.store || {
        name: 'Brazilian Pudding',
        city: 'Danbury',
        state: 'CT',
        zip: '06810',
        lat: 41.391768,
        lng: -73.454168,
      },
      fallbackMessage: base.fallbackMessage || 'Outside the automatic delivery radius. The owner can confirm by WhatsApp.',
      tiers: (base.tiers || []).slice(0, 3),
      zipCoordinates: base.zipCoordinates || {},
    };
  }

  function fillDeliveryForm(settings) {
    if (!deliveryForm) return;
    deliverySettings = normalizeAdminSettings(settings);
    const zip = deliveryForm.querySelector('[data-delivery-base-zip]');
    const radius = deliveryForm.querySelector('[data-delivery-max-radius]');
    if (zip) zip.value = deliverySettings.baseZip;
    if (radius) radius.value = deliverySettings.maxRadiusMiles;
    deliveryForm.querySelectorAll('[data-delivery-tier-fee]').forEach((input) => {
      const tier = deliverySettings.tiers[Number(input.dataset.deliveryTierFee)];
      if (tier) input.value = centsToInput(tier.feeCents);
    });
    renderAdminDelivery();
  }

  function collectDeliverySettings() {
    const form = new FormData(deliveryForm);
    const current = normalizeAdminSettings(deliverySettings);
    const maxRadiusMiles = Number(form.get('maxRadiusMiles') || current.maxRadiusMiles || 15);
    const tiers = current.tiers.map((tier, index) => ({
      ...tier,
      maxMiles: index === current.tiers.length - 1 ? maxRadiusMiles : tier.maxMiles,
      feeCents: inputToCents(form.get(`tier${index + 1}Fee`)),
    }));
    const baseZip = String(form.get('baseZip') || current.baseZip || '06810').replace(/\D/g, '').slice(0, 5);
    return normalizeAdminSettings({
      ...current,
      baseZip,
      maxRadiusMiles,
      store: { ...current.store, zip: baseZip },
      tiers,
    });
  }

  function renderAdminDelivery() {
    const rawZip = adminZipInput?.value || '';
    const zip = window.bkDelivery?.sanitizeZip ? window.bkDelivery.sanitizeZip(rawZip) : String(rawZip).replace(/\D/g, '').slice(0, 5);
    if (adminZipInput && adminZipInput.value !== zip) adminZipInput.value = zip;

    if (adminMap && window.bkDelivery && deliverySettings) {
      window.bkDelivery.renderServiceMap(adminMap, {
        settings: deliverySettings,
        zip: zip.length === 5 ? zip : '',
        fitBounds: true,
      });
    }

    if (!adminQuote || !window.bkDelivery) return;
    adminQuote.classList.remove('is-served', 'is-outside', 'is-pending');

    if (!zip) {
      adminQuote.classList.add('is-pending');
      adminQuote.innerHTML = `
        <em>Aguardando ZIP</em>
        <strong>Digite um ZIP para testar.</strong>
        <span>O mapa mostra Danbury e os aneis de atendimento configurados.</span>
      `;
      return;
    }

    if (zip.length < 5) {
      adminQuote.classList.add('is-pending');
      adminQuote.innerHTML = `
        <em>ZIP incompleto</em>
        <strong>Digite 5 numeros.</strong>
        <span>${zip} ainda nao tem digitos suficientes para calcular raio e taxa.</span>
      `;
      return;
    }

    const quote = window.bkDelivery.quoteByZip(zip, deliverySettings);
    if (quote.served) {
      adminQuote.classList.add('is-served');
      adminQuote.innerHTML = `
        <em>Dentro do raio</em>
        <strong>${quote.feeLabel} de entrega</strong>
        <span>${quote.zip} fica a ${quote.distanceMiles} mi de Danbury. Faixa aplicada: ${quote.tier.label}.</span>
      `;
      return;
    }

    adminQuote.classList.add('is-outside');
    const detail = quote.reason === 'unknown_zip'
      ? 'ZIP sem coordenada cadastrada. Confirme manualmente no WhatsApp.'
      : 'Fora do raio automatico. A dona confirma rota e taxa pelo WhatsApp.';
    adminQuote.innerHTML = `
      <em>Confirmar no WhatsApp</em>
      <strong>${quote.zip || 'ZIP'} nao tem frete automatico.</strong>
      <span>${quote.distanceMiles ? `${quote.distanceMiles} mi de Danbury. ` : ''}${detail}</span>
    `;
  }

  async function loadDeliverySettings() {
    if (!deliveryForm || !window.bkDelivery) return;
    if (window.bkApi && window.BK_CONFIG?.adminMode !== 'demo') {
      try {
        const res = await window.bkApi.adminDeliverySettings();
        fillDeliveryForm(res?.settings || res);
        return;
      } catch {
        /* sem login ainda: usa config local ate desbloquear */
      }
    }
    fillDeliveryForm(window.BK_CONFIG?.delivery || {});
  }

  deliveryForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const settings = collectDeliverySettings();
    deliverySettings = settings;
    renderAdminDelivery();
    if (window.bkApi && window.BK_CONFIG?.adminMode !== 'demo') {
      const btn = deliveryForm.querySelector('[data-delivery-save]');
      const old = btn?.textContent;
      if (btn) { btn.disabled = true; btn.textContent = 'Salvando...'; }
      try {
        const res = await window.bkApi.adminUpdateDeliverySettings(settings);
        fillDeliveryForm(res?.settings || settings);
        toast('Frete atualizado.');
      } catch {
        toast('Erro ao salvar frete na API.');
      } finally {
        if (btn) { btn.disabled = false; btn.textContent = old || 'Salvar frete'; }
      }
    } else {
      toast('Frete atualizado nesta sessao.');
    }
  });

  adminZipCheck?.addEventListener('click', renderAdminDelivery);
  adminZipInput?.addEventListener('blur', renderAdminDelivery);
  adminZipInput?.addEventListener('input', () => {
    const zip = window.bkDelivery?.sanitizeZip ? window.bkDelivery.sanitizeZip(adminZipInput.value) : adminZipInput.value.replace(/\D/g, '').slice(0, 5);
    adminZipInput.value = zip;
    if (zip.length < 5) renderAdminDelivery();
  });
  deliveryForm?.querySelectorAll('input').forEach((input) => {
    input.addEventListener('change', () => {
      deliverySettings = collectDeliverySettings();
      renderAdminDelivery();
    });
  });

  new MutationObserver(() => {
    if (document.body.classList.contains('is-unlocked')) loadDeliverySettings();
  }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  setTimeout(loadDeliverySettings, 300);

  /* ---------------- API pública ---------------- */
  window.bkAdmin = {
    showView,
    saveOrders,
    updateBadges,
    openOrderModal,
  };
})();
