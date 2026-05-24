/* ============================================================
   Fluid Particles — efeito decorativo Canvas 2D para hero
   Adaptado do componente React (FluidParticles) para vanilla JS,
   com paleta brand (amber/green) e correções de bugs do original.

   Uso:
     <div data-fluid-particles data-palette="amber"></div>
     <div data-fluid-particles data-palette="green"></div>

   Bugs corrigidos do original React:
   - removeEventListener("mousemove", () => {}) nunca limpava (anônimo)
   - sem prefers-reduced-motion guard
   - listeners no window vazavam entre instâncias
   - density invertido era confuso ("lower divisor = more")
   - blast intensity calculation distorcia cores ruins

   Performance: ouve mousemove no document mas filtra por bbox do host,
   pausa animação em document.hidden, throttle natural do RAF.
   ============================================================ */

const PALETTES = {
  amber: {
    rest: 'rgba(180, 83, 9, 0.55)', // amber-700 — sutil
    active: 'rgba(251, 191, 36, 0.95)', // amber-400 — vivo no hover
    blast: (intensity) => `rgba(251, ${Math.max(140, 191 - intensity * 0.2)}, 36, 0.92)`, // pulso amber
  },
  green: {
    rest: 'rgba(13, 110, 84, 0.55)', // verde escuro do box
    active: 'rgba(254, 243, 199, 0.95)', // creme — vivo
    blast: (intensity) => `rgba(${Math.min(255, 200 + intensity * 0.2)}, 243, ${Math.max(150, 199 - intensity * 0.2)}, 0.92)`,
  },
};

class FluidParticles {
  constructor(host, options = {}) {
    this.host = host;
    this.palette = PALETTES[options.palette] || PALETTES.amber;
    this.density = options.density || 140; // lower = mais partículas
    this.particleSize = options.particleSize ?? 1.5;
    this.maxBlastRadius = options.maxBlastRadius || 260;
    this.hoverDelay = options.hoverDelay || 200; // 200ms evita disparos acidentais
    this.interactionDistance = options.interactionDistance || 90;

    this.particles = [];
    this.mouse = { x: -9999, y: -9999, prevX: 0, prevY: 0, inside: false };
    this.blast = { active: false, x: 0, y: 0, radius: 0 };
    this.handlers = {};
    this.hoverTimer = null;
    this.afId = null;
    this.hostRect = null;

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      host.classList.add('fluid-particles--static');
      return;
    }

    this.init();
  }

  init() {
    while (this.host.firstChild) this.host.removeChild(this.host.firstChild);

    const canvas = document.createElement('canvas');
    canvas.style.cssText =
      'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;display:block;';
    this.host.appendChild(canvas);
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: true });

    // Listeners no document (host pode ter pointer-events:none pra deixar conteúdo da frente clicável)
    this.handlers.resize = () => this.resize();
    this.handlers.mousemove = (e) => this.onPointerMove(e.clientX, e.clientY);
    this.handlers.touchmove = (e) => {
      const t = e.touches[0];
      if (t) this.onPointerMove(t.clientX, t.clientY);
    };
    this.handlers.touchstart = (e) => {
      const t = e.touches[0];
      if (!t) return;
      this.hostRect = this.host.getBoundingClientRect();
      if (this.isInsideHost(t.clientX, t.clientY)) {
        this.hoverTimer = setTimeout(() => this.triggerBlast(t.clientX, t.clientY), this.hoverDelay);
      }
    };
    this.handlers.touchend = () => {
      if (this.hoverTimer) {
        clearTimeout(this.hoverTimer);
        this.hoverTimer = null;
      }
    };
    this.handlers.click = (e) => {
      this.hostRect = this.host.getBoundingClientRect();
      if (this.isInsideHost(e.clientX, e.clientY)) {
        this.triggerBlast(e.clientX, e.clientY);
      }
    };
    this.handlers.visibility = () => {
      if (document.hidden) {
        if (this.afId) cancelAnimationFrame(this.afId);
        this.afId = null;
      } else if (!this.afId) {
        this.loop();
      }
    };

    window.addEventListener('resize', this.handlers.resize);
    document.addEventListener('mousemove', this.handlers.mousemove, { passive: true });
    document.addEventListener('touchmove', this.handlers.touchmove, { passive: true });
    document.addEventListener('touchstart', this.handlers.touchstart, { passive: true });
    document.addEventListener('touchend', this.handlers.touchend);
    document.addEventListener('click', this.handlers.click);
    document.addEventListener('visibilitychange', this.handlers.visibility);

    this.resize();
    this.loop();
  }

  isInsideHost(clientX, clientY) {
    if (!this.hostRect) return false;
    return (
      clientX >= this.hostRect.left &&
      clientX <= this.hostRect.right &&
      clientY >= this.hostRect.top &&
      clientY <= this.hostRect.bottom
    );
  }

  resize() {
    const rect = this.host.getBoundingClientRect();
    const w = Math.max(1, Math.floor(rect.width));
    const h = Math.max(1, Math.floor(rect.height));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = w * dpr;
    this.canvas.height = h * dpr;
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.w = w;
    this.h = h;
    this.hostRect = rect;
    this.initParticles();
  }

  initParticles() {
    this.particles = [];
    const count = Math.floor((this.w * this.h) / this.density);
    for (let i = 0; i < count; i++) {
      this.particles.push(this.makeParticle(Math.random() * this.w, Math.random() * this.h));
    }
  }

  makeParticle(x, y) {
    const density = Math.random() * 3 + 1;
    return {
      x,
      y,
      baseX: x,
      baseY: y,
      size: Math.random() * this.particleSize + 0.5,
      density,
      vx: 0,
      vy: 0,
      friction: 0.9 - 0.01 * density,
    };
  }

  onPointerMove(clientX, clientY) {
    this.hostRect = this.host.getBoundingClientRect();
    const inside = this.isInsideHost(clientX, clientY);
    this.mouse.inside = inside;
    if (!inside) {
      this.mouse.x = -9999;
      this.mouse.y = -9999;
      if (this.hoverTimer) {
        clearTimeout(this.hoverTimer);
        this.hoverTimer = null;
      }
      return;
    }

    this.mouse.prevX = this.mouse.x;
    this.mouse.prevY = this.mouse.y;
    this.mouse.x = clientX - this.hostRect.left;
    this.mouse.y = clientY - this.hostRect.top;

    const dx = this.mouse.x - this.mouse.prevX;
    const dy = this.mouse.y - this.mouse.prevY;
    const dist = Math.hypot(dx, dy);

    if (dist < 4) {
      if (this.hoverTimer === null) {
        const cx = clientX;
        const cy = clientY;
        this.hoverTimer = setTimeout(() => this.triggerBlast(cx, cy), this.hoverDelay);
      }
    } else if (this.hoverTimer) {
      clearTimeout(this.hoverTimer);
      this.hoverTimer = null;
    }
  }

  triggerBlast(clientX, clientY) {
    if (!this.hostRect) this.hostRect = this.host.getBoundingClientRect();
    const x = clientX - this.hostRect.left;
    const y = clientY - this.hostRect.top;
    this.blast = { active: true, x, y, radius: 0 };

    const start = performance.now();
    const duration = 320;
    const easeOut = (t) => t * (2 - t);

    const expand = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      this.blast.radius = easeOut(progress) * this.maxBlastRadius;
      if (progress < 1) {
        requestAnimationFrame(expand);
      } else {
        setTimeout(() => {
          this.blast.active = false;
        }, 100);
      }
    };
    requestAnimationFrame(expand);

    if (this.hoverTimer) {
      clearTimeout(this.hoverTimer);
      this.hoverTimer = null;
    }
  }

  loop() {
    this.afId = requestAnimationFrame(() => this.loop());
    const ctx = this.ctx;
    if (!ctx) return;
    ctx.clearRect(0, 0, this.w, this.h);
    for (const p of this.particles) {
      this.updateParticle(p);
    }
  }

  updateParticle(p) {
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= p.friction;
    p.vy *= p.friction;

    let color = this.palette.rest;

    if (this.mouse.inside) {
      const dx = this.mouse.x - p.x;
      const dy = this.mouse.y - p.y;
      const distance = Math.hypot(dx, dy) || 0.001;

      if (distance < this.interactionDistance) {
        const fx = dx / distance;
        const fy = dy / distance;
        const force = (this.interactionDistance - distance) / this.interactionDistance;
        p.x -= fx * force * p.density * 0.6;
        p.y -= fy * force * p.density * 0.6;
        color = this.palette.active;
      } else {
        if (p.x !== p.baseX) p.x -= (p.x - p.baseX) / 20;
        if (p.y !== p.baseY) p.y -= (p.y - p.baseY) / 20;
      }
    } else {
      // mouse fora: relaxa para a posição base
      if (p.x !== p.baseX) p.x -= (p.x - p.baseX) / 20;
      if (p.y !== p.baseY) p.y -= (p.y - p.baseY) / 20;
    }

    if (this.blast.active) {
      const bx = p.x - this.blast.x;
      const by = p.y - this.blast.y;
      const bd = Math.hypot(bx, by) || 0.001;
      if (bd < this.blast.radius) {
        const fx = bx / bd;
        const fy = by / bd;
        const force = (this.blast.radius - bd) / this.blast.radius;
        p.vx += fx * force * 12;
        p.vy += fy * force * 12;
        const intensity = Math.min(255, 255 - bd);
        color = this.palette.blast(intensity);
      }
    }

    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    this.ctx.closePath();
    this.ctx.fill();
  }

  destroy() {
    window.removeEventListener('resize', this.handlers.resize);
    document.removeEventListener('mousemove', this.handlers.mousemove);
    document.removeEventListener('touchmove', this.handlers.touchmove);
    document.removeEventListener('touchstart', this.handlers.touchstart);
    document.removeEventListener('touchend', this.handlers.touchend);
    document.removeEventListener('click', this.handlers.click);
    document.removeEventListener('visibilitychange', this.handlers.visibility);
    if (this.hoverTimer) clearTimeout(this.hoverTimer);
    if (this.afId) cancelAnimationFrame(this.afId);
    if (this.canvas?.parentNode) this.canvas.parentNode.removeChild(this.canvas);
    this.particles = [];
  }
}

function initAll() {
  document.querySelectorAll('[data-fluid-particles]').forEach((el) => {
    if (!el.__fluidParticles) {
      el.__fluidParticles = new FluidParticles(el, {
        palette: el.dataset.palette,
        density: parseInt(el.dataset.density, 10) || undefined,
        particleSize: parseFloat(el.dataset.size) || undefined,
        maxBlastRadius: parseInt(el.dataset.blastRadius, 10) || undefined,
        hoverDelay: parseInt(el.dataset.hoverDelay, 10) || undefined,
        interactionDistance: parseInt(el.dataset.interactionDistance, 10) || undefined,
      });
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}

window.FluidParticles = FluidParticles;
