/* ============================================================
   API client — wrapper único pro front (admin/pudim/box) consumir
   o backend Fastify em /api/*.

   Uso:
     await window.bkApi.get('/products')
     await window.bkApi.post('/leads', { name, phone, ... })
     await window.bkApi.post('/orders', body, { idempotent: true })
     await window.bkApi.adminLogin(email, password)
     await window.bkApi.adminLogout()

   Funcionalidades:
   - credentials: 'include' (cookie httpOnly do JWT)
   - Idempotency-Key auto-gerado (UUID v4) quando { idempotent: true }
   - Erros estruturados (ApiError com status/code/message)
   - Base URL configurável via window.BK_CONFIG.apiBase (default: '/api')
   - keepalive: true em fire-and-forget (POST /leads antes do redirect WA)
   ============================================================ */
(() => {
  'use strict';

  const STATIC_LOCAL =
    ['127.0.0.1', 'localhost'].includes(window.location.hostname) &&
    ['4173', ''].includes(window.location.port || '') &&
    !window.BK_CONFIG?.forceApiLocal;
  if (STATIC_LOCAL) {
    window.bkApi = null;
    return;
  }

  const BASE = (window.BK_CONFIG && window.BK_CONFIG.apiBase) || '/api';

  function uuid() {
    if (crypto?.randomUUID) return crypto.randomUUID();
    // Fallback (browsers antigos): RFC 4122 v4 manual
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const h = [...bytes].map((b) => b.toString(16).padStart(2, '0'));
    return `${h.slice(0, 4).join('')}-${h.slice(4, 6).join('')}-${h.slice(6, 8).join('')}-${h.slice(8, 10).join('')}-${h.slice(10).join('')}`;
  }

  class ApiError extends Error {
    constructor(status, code, message, body) {
      super(message || code || `HTTP ${status}`);
      this.name = 'ApiError';
      this.status = status;
      this.code = code;
      this.body = body;
    }
  }

  async function request(method, path, body, opts = {}) {
    const url = `${BASE}${path}`;
    const headers = { Accept: 'application/json' };
    let payload = null;

    if (body !== undefined && body !== null) {
      headers['Content-Type'] = 'application/json';
      payload = JSON.stringify(body);
    }

    if (opts.idempotent) {
      headers['Idempotency-Key'] = opts.idempotencyKey || uuid();
    }

    const init = {
      method,
      headers,
      body: payload,
      credentials: 'include',
    };
    if (opts.keepalive) init.keepalive = true;
    if (opts.signal) init.signal = opts.signal;

    let res;
    try {
      res = await fetch(url, init);
    } catch (err) {
      throw new ApiError(0, 'network_error', err.message);
    }

    // 204 No Content
    if (res.status === 204) return null;

    let data = null;
    const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      data = await res.json().catch(() => null);
    } else {
      data = await res.text().catch(() => null);
    }

    if (!res.ok) {
      const code = data?.error || `http_${res.status}`;
      const message = data?.message || data?.error || `HTTP ${res.status}`;
      throw new ApiError(res.status, code, message, data);
    }

    return data;
  }

  const api = {
    get: (path, opts) => request('GET', path, null, opts),
    post: (path, body, opts) => request('POST', path, body, opts),
    patch: (path, body, opts) => request('PATCH', path, body, opts),
    put: (path, body, opts) => request('PUT', path, body, opts),
    del: (path, opts) => request('DELETE', path, null, opts),

    // ---- Helpers públicos comuns ----
    listProducts: (category) =>
      request('GET', `/products${category ? `?category=${encodeURIComponent(category)}` : ''}`),

    createLead: (lead) =>
      request('POST', '/leads', lead, { keepalive: true }),

    createOrder: (order) =>
      request('POST', '/orders', order, { idempotent: true }),

    getAvailability: (date, category) =>
      request('GET', `/availability?date=${encodeURIComponent(date)}${category ? `&category=${encodeURIComponent(category)}` : ''}`),

    deliveryQuote: (zip) =>
      request('GET', `/delivery/quote?zip=${encodeURIComponent(zip)}`),

    // ---- Admin ----
    adminLogin: (email, password) =>
      request('POST', '/admin/login', { email, password }),

    adminLogout: () =>
      request('POST', '/admin/logout', {}),

    adminMe: () =>
      request('GET', '/admin/me'),

    adminListOrders: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return request('GET', `/admin/orders${qs ? `?${qs}` : ''}`);
    },

    adminTransitionOrder: (id, toStatus, reason) =>
      request('PATCH', `/admin/orders/${encodeURIComponent(id)}/status`, { toStatus, reason }),

    adminListProducts: () => request('GET', '/admin/products'),
    adminCreateProduct: (p) => request('POST', '/admin/products', p),
    adminUpdateProduct: (id, p) => request('PATCH', `/admin/products/${encodeURIComponent(id)}`, p),
    adminDeleteProduct: (id) => request('DELETE', `/admin/products/${encodeURIComponent(id)}`),

    adminListLeads: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return request('GET', `/admin/leads${qs ? `?${qs}` : ''}`);
    },

    adminCapacity: (from, to) =>
      request('GET', `/admin/capacity?from=${from}&to=${to}`),

    adminSetCapacity: (date, category, capacityMax) =>
      request('PUT', '/admin/capacity', { date, category, capacityMax }),

    adminProduction: (date) =>
      request('GET', `/admin/production?date=${encodeURIComponent(date)}`),

    adminKpis: () => request('GET', '/admin/kpis'),
    adminDeliverySettings: () => request('GET', '/admin/delivery-settings'),
    adminUpdateDeliverySettings: (settings) => request('PUT', '/admin/delivery-settings', settings),

    // Caixa (cash register)
    adminCashCurrent: () => request('GET', '/admin/cash/current'),
    adminCashOpen: (openingCents, notes) => request('POST', '/admin/cash/open', { openingCents, notes }),
    adminCashTransaction: (tx) => request('POST', '/admin/cash/transactions', tx),
    adminCashClose: (closingCents, notes) => request('POST', '/admin/cash/close', { closingCents, notes }),
    adminCashSessions: (limit = 10) => request('GET', `/admin/cash/sessions?limit=${encodeURIComponent(limit)}`),
  };

  window.bkApi = api;
  window.ApiError = ApiError;
})();
