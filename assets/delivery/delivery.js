/* ============================================================
   Delivery helpers - ZIP quote, radius map and shared formatting.
   ============================================================ */
(() => {
  'use strict';

  const MILES_PER_KM = 0.621371;
  const METERS_PER_MILE = 1609.344;
  const DEFAULT_ECONOMICS = {
    gasPricePerGallon: 4.70,
    mpg: 22,
    mileageRate: 0.725,
    grossMarginPct: 35,
    safetyBufferPct: 20,
    stopFee: 2,
    targetProfit: 35,
    sourceLabel: 'AAA CT regular average + IRS 2026 business mileage',
    updatedAt: '2026-05-25',
  };
  let remoteSettings = null;

  function normalizeBaseZip(zip) {
    const clean = sanitizeZip(zip);
    return clean === '06110' ? '06810' : (clean || '06810');
  }

  function normalizeEconomics(economics = {}) {
    return {
      gasPricePerGallon: Number(economics.gasPricePerGallon || DEFAULT_ECONOMICS.gasPricePerGallon),
      mpg: Number(economics.mpg || DEFAULT_ECONOMICS.mpg),
      mileageRate: Number(economics.mileageRate || DEFAULT_ECONOMICS.mileageRate),
      grossMarginPct: Number(economics.grossMarginPct || DEFAULT_ECONOMICS.grossMarginPct),
      safetyBufferPct: Number(economics.safetyBufferPct || DEFAULT_ECONOMICS.safetyBufferPct),
      stopFee: Number(economics.stopFee || DEFAULT_ECONOMICS.stopFee),
      targetProfit: Number(economics.targetProfit || DEFAULT_ECONOMICS.targetProfit),
      sourceLabel: economics.sourceLabel || DEFAULT_ECONOMICS.sourceLabel,
      updatedAt: economics.updatedAt || DEFAULT_ECONOMICS.updatedAt,
    };
  }

  function roundUpToFiveDollars(cents) {
    return Math.ceil(Number(cents || 0) / 500) * 500;
  }

  function suggestFreeMinCents(tier, economicsInput) {
    const economics = normalizeEconomics(economicsInput);
    const roundTripMiles = Math.max(0, Number(tier?.maxMiles || 0) * 2);
    const routeCost =
      ((roundTripMiles * economics.mileageRate) + economics.stopFee) *
      (1 + (economics.safetyBufferPct / 100));
    const margin = Math.max(1, economics.grossMarginPct) / 100;
    const neededSales = (routeCost + economics.targetProfit) / margin;
    return roundUpToFiveDollars(neededSales * 100);
  }

  function getSettings(overrides) {
    const config = window.BK_CONFIG || {};
    const delivery = { ...(config.delivery || {}), ...(remoteSettings || {}), ...(overrides || {}) };
    const storeRaw = delivery.store || config.storeLocation || {
      zip: '06810',
      lat: 41.391768,
      lng: -73.454168,
      city: 'Danbury',
      state: 'CT',
    };
    const baseZip = normalizeBaseZip(delivery.baseZip || storeRaw.zip);
    const store = {
      ...storeRaw,
      zip: normalizeBaseZip(storeRaw.zip || baseZip),
      city: storeRaw.city === 'Hartford' ? 'Danbury' : (storeRaw.city || 'Danbury'),
      state: storeRaw.state || 'CT',
      lat: Number(storeRaw.lat || 41.391768),
      lng: Number(storeRaw.lng || -73.454168),
    };
    return {
      enabled: delivery.enabled !== false,
      unit: delivery.unit || 'mi',
      baseZip,
      maxRadiusMiles: Number(delivery.maxRadiusMiles || 15),
      fallbackMessage: delivery.fallbackMessage || 'Delivery quote needs owner confirmation.',
      economics: normalizeEconomics(delivery.economics),
      tiers: Array.isArray(delivery.tiers) && delivery.tiers.length
        ? delivery.tiers.map((tier) => ({
            id: tier.id || String(tier.maxMiles),
            label: tier.label || `Up to ${tier.maxMiles} mi`,
            maxMiles: Number(tier.maxMiles || 0),
            feeCents: Number(tier.feeCents || 0),
            freeMinCents: Number(tier.freeMinCents || 0),
          })).sort((a, b) => a.maxMiles - b.maxMiles)
        : [{ id: 'default', label: 'Danbury delivery', maxMiles: 15, feeCents: Number(config.deliveryFeeCents || 257), freeMinCents: 0 }],
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

  function renderDestinationLayer(map, settings, center, zip) {
    if (!map || !window.L) return null;
    if (map.__bkDestinationLayer) {
      try { map.removeLayer(map.__bkDestinationLayer); } catch {}
      map.__bkDestinationLayer = null;
    }

    const group = window.L.layerGroup().addTo(map);
    if (zip) {
      const quote = quoteByZip(zip, settings);
      if (quote.destination) {
        const destination = [quote.destination.lat, quote.destination.lng];
        window.L.circleMarker(destination, {
          radius: 7,
          color: quote.served ? '#0d6b58' : '#d73e5e',
          fillColor: quote.served ? '#0d6b58' : '#d73e5e',
          fillOpacity: 0.8,
        }).addTo(group).bindPopup(`${quote.zip} - ${quote.feeLabel}`);
        window.L.polyline([center, destination], {
          color: '#241812',
          weight: 2,
          opacity: 0.55,
          dashArray: '5 7',
        }).addTo(group);
      }
    }

    map.__bkDestinationLayer = group;
    return group;
  }

  function fitServiceBounds(map, settings, center, padding = [18, 18]) {
    if (!map || !window.L) return;
    try {
      const bounds = window.L.circle(center, {
        radius: settings.maxRadiusMiles * METERS_PER_MILE,
      }).getBounds();
      map.fitBounds(bounds, { padding });
    } catch {
      /* Keep the existing view if Leaflet cannot fit while hidden. */
    }
  }

  function renderServiceMap(element, options = {}) {
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    if (!el) return null;
    const settings = getSettings(options.settings);
    const center = [settings.store.lat, settings.store.lng];
    el.classList.add('bk-service-map');

    if (!window.L) {
      renderFallbackMap(el, settings);
      return null;
    }

    if (el.__bkMap) {
      renderDestinationLayer(el.__bkMap, settings, center, options.zip);
      const refit = () => {
        el.__bkMap.invalidateSize();
        if (options.fitBounds !== false) fitServiceBounds(el.__bkMap, settings, center);
      };
      setTimeout(refit, 60);
      setTimeout(refit, 240);
      return el.__bkMap;
    }

    const map = window.L.map(el, {
      zoomControl: true,
      scrollWheelZoom: false,
      dragging: true,
      tap: true,
      zoomAnimation: false,
      fadeAnimation: false,
      markerZoomAnimation: false,
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

    renderDestinationLayer(map, settings, center, options.zip);

    fitServiceBounds(map, settings, center);
    setTimeout(() => {
      map.invalidateSize();
      if (options.fitBounds !== false) fitServiceBounds(map, settings, center);
    }, 80);
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
    normalizeEconomics,
    suggestFreeMinCents,
    sanitizeZip,
    quoteByZip,
    distanceMiles,
    moneyFromCents,
    renderServiceMap,
    loadPublicSettings,
  };

  loadPublicSettings();
})();
