// Box e Pudim — shared <picture> helper.
// Exposed globally as window.bkPicture so app.js / box.js / admin.js (plain scripts) can call it.
//
// Usage:
//   const markup = bkPicture.html('assets/img/foo.png', 'class="card" alt="..."');
//   // splice markup into a template literal or container as you would any other HTML string.
//   bkPicture.swap(imgEl, 'assets/img/bar.png'); // for dynamic hero swaps
//
// The optimizer (scripts/optimize-images.mjs) emits siblings .avif/.webp/.png with the same
// base name, so we derive variant URLs from the PNG/JPG src.

(function () {
  function variants(src) {
    const base = src.replace(/\.(png|jpe?g)$/i, '');
    return {
      avif: `${base}.avif`,
      webp: `${base}.webp`,
      fallback: src,
    };
  }

  function html(src, attrs = '') {
    const v = variants(src);
    return (
      '<picture>' +
      `<source srcset="${v.avif}" type="image/avif" />` +
      `<source srcset="${v.webp}" type="image/webp" />` +
      `<img src="${v.fallback}" ${attrs} />` +
      '</picture>'
    );
  }

  function swap(imgEl, newSrc) {
    if (!imgEl) return;
    const v = variants(newSrc);
    const picture = imgEl.closest('picture');
    if (picture) {
      const avifSource = picture.querySelector('source[type="image/avif"]');
      const webpSource = picture.querySelector('source[type="image/webp"]');
      if (avifSource) avifSource.srcset = v.avif;
      if (webpSource) webpSource.srcset = v.webp;
    }
    imgEl.src = v.fallback;
  }

  window.bkPicture = { html, swap, variants };
})();
