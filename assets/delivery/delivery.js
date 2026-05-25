/* ============================================================
   Delivery helpers - ZIP quote, radius map and shared formatting.
   ============================================================ */
(() => {
  'use strict';

  const MILES_PER_KM = 0.621371;
  const METERS_PER_MILE = 1609.344;
  let remoteSettings = null;

  function getSettings(overrides) {
    const config = window.BK_CONFIG || {};
    const delivery = { ...(config.delivery || {}), ...(remoteSettings || {}), ...(overrides || {}) };
    const store = delivery.store || config.storeLocation || {
      zip: '06810',
      lat: 41.391768,
      lng: -73.454168,
      city: 'Danbury',
      state: 'CT',
    };
    return {
      enabled: delivery.enabled !== false,
      unit: delivery.unit || 'mi',
      baseZip: delivery.baseZip || store.zip || '06810',
      maxRadiusMiles: Number(delivery.maxRadiusMiles || 15),
      fallbackMessage: delivery.fallbackMessage || 'Delivery quote needs owner confirmation.',
      tiers: Array.isArray(delivery.tiers) && delivery.tiers.length
        ? delivery.tiers.map((tier) => ({
            id: tier.id || String(tier.maxMiles),
            label: tier.label || `Up to ${tier.maxMiles} mi`,
            maxMiles: Number(tier.maxMiles || 0),
            feeCents: Number(tier.feeCents || 0),
          })).sort((a, b) => a.maxMiles - b.maxMiles)
        : [{ id: 'default', label: 'Danbury delivery', maxMiles: 15, feeCents: Number(config.deliveryFeeCents || 257) }],
      zipCoordinates: delivery.zipCoordinates || {},
      store,
    };
  }

  function sanitizeZip(value) {
    return String(value || '').replace(/\D/g, '').slice(0, 5);
  }

  function degToRad(value) {
    return (Number(value) * Math.PI) / 180;
  }

  function distanceMiles(a, b) {
    const radiusKm = 6371;
    const dLat = degToRad(b.lat - a.lat);
    const dLng = degToRad(b.lng - a.lng);
    const lat1 = degToRad(a.lat);
    const lat2 = degToRad(b.lat);
    const h =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
    const km = 2 * radiusKm * Math.asin(Math.sqrt(h));
    return km * MILES_PER_KM;
  }

  function moneyFromCents(cents) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Number(cents || 0) / 100);
  }

  function quoteByZip(zipValue, overrides) {
    const settings = getSettings(overrides);
    const zip = sanitizeZip(zipValue);
    if (!zip || zip.length < 5) {
      return { ok: false, served: false, reason: 'zip_required', zip, message: 'Enter a 5-digit ZIP.' };
    }

    const destination = settings.zipCoordinates[zip];
    if (!destination) {
      return {
        ok: true,
        served: false,
        reason: 'unknown_zip',
        zip,
        distanceMiles: null,
        feeCents: null,
        feeLabel: 'Confirm on WhatsApp',
        message: settings.fallbackMessage,
      };
    }

    const distance = distanceMiles(settings.store, destination);
    const tier = settings.tiers.find((item) => distance <= item.maxMiles);
    if (!tier || distance > settings.maxRadiusMiles) {
      return {
        ok: true,
        served: false,
        reason: 'outside_radius',
        zip,
        destination,
        distanceMiles: Number(distance.toFixed(1)),
        feeCents: null,
        feeLabel: 'Outside radius',
        message: settings.fallbackMessage,
      };
    }

    return {
      ok: true,
      served: true,
      zip,
      destination,
      tier,
      distanceMiles: Number(distance.toFixed(1)),
      feeCents: tier.feeCents,
      feeLabel: moneyFromCents(tier.feeCents),
      message: `${tier.label}: ${moneyFromCents(tier.feeCents)} delivery`,
    };
  }

  function renderFallbackMap(el, settings) {
    el.innerHTML = `
      <div class="bk-map-fallback">
        <strong>${settings.store.city || 'Danbury'}, ${settings.store.state || 'CT'}</strong>
        <span>${settings.baseZip} center</span>
        <em>${settings.maxRadiusMiles} mi delivery radius</em>
      </div>
    `;
  }

  function renderServiceMap(element, options = {}) {
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    if (!el) return null;
    const settings = getSettings(options.settings);
    el.classList.add('bk-service-map');

    if (!window.L) {
      renderFallbackMap(el, settings);
      return null;
    }

    if (el.__bkMap && options.reset) {
      el.__bkMap.remove();
      el.__bkMap = null;
      el.innerHTML = '';
    }

    if (el.__bkMap) {
      setTimeout(() => el.__bkMap.invalidateSize(), 60);
      return el.__bkMap;
    }

    const center = [settings.store.lat, settings.store.lng];
    const map = window.L.map(el, {
      zoomControl: true,
      scrollWheelZoom: false,
      dragging: true,
      tap: true,
    }).setView(center, 11);

    window.L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const palette = ['#d73e5e', '#e3a72f', '#0d6b58'];
    [...settings.tiers].reverse().forEach((tier, index) => {
      window.L.circle(center, {
        radius: tier.maxMiles * METERS_PER_MILE,
        color: palette[index % palette.length],
        weight: 2,
        opacity: 0.8,
        fillColor: palette[index % palette.length],
        fillOpacity: 0.08,
      }).addTo(map).bindPopup(`${tier.label}: ${moneyFromCents(tier.feeCents)}`);
    });

    window.L.marker(center)
      .addTo(map)
      .bindPopup(`${settings.store.name || 'Brazilian Pudding'}<br>${settings.store.city || 'Danbury'}, ${settings.store.state || 'CT'} ${settings.store.zip || ''}`);

    if (options.zip) {
      const quote = quoteByZip(options.zip, settings);
      if (quote.destination) {
        const destination = [quote.destination.lat, quote.destination.lng];
        window.L.circleMarker(destination, {
          radius: 7,
          color: quote.served ? '#0d6b58' : '#d73e5e',
          fillColor: quote.served ? '#0d6b58' : '#d73e5e',
          fillOpacity: 0.8,
        }).addTo(map).bindPopup(`${quote.zip} - ${quote.feeLabel}`);
        window.L.polyline([center, destination], {
          color: '#241812',
          weight: 2,
          opacity: 0.55,
          dashArray: '5 7',
        }).addTo(map);
      }
    }

    const outer = window.L.circle(center, {
      radius: settings.maxRadiusMiles * METERS_PER_MILE,
      opacity: 0,
      fillOpacity: 0,
      interactive: false,
    }).addTo(map);
    map.fitBounds(outer.getBounds(), { padding: [16, 16] });
    setTimeout(() => map.invalidateSize(), 80);
    el.__bkMap = map;
    return map;
  }

  async function loadPublicSettings() {
    if (!window.bkApi) return null;
    const isStaticLocal =
      ['127.0.0.1', 'localhost'].includes(window.location.hostname) &&
      ['4173', ''].includes(window.location.port || '');
    if (isStaticLocal) return null;
    try {
      remoteSettings = await window.bkApi.get('/delivery/settings/public');
      document.dispatchEvent(new CustomEvent('bk:delivery-settings-loaded', { detail: { settings: remoteSettings } }));
      return remoteSettings;
    } catch {
      return null;
    }
  }

  window.bkDelivery = {
    getSettings,
    sanitizeZip,
    quoteByZip,
    distanceMiles,
    moneyFromCents,
    renderServiceMap,
    loadPublicSettings,
  };

  loadPublicSettings();
})();
