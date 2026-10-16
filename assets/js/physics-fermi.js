// Home hero: a live Fermi surface of the square-lattice band
//   eps(k) = -2t (cos kx + cos ky) - 4t' cos kx cos ky - mu      (t = 1)
// drawn over a periodic tiling of Brillouin zones and coloured by the d-wave form factor
// (cos kx - cos ky). The cursor tunes mu (x) and t' (y); without a cursor the parameters drift.
// The van Hove point (pi, 0) has energy 4t' - mu, so the surface changes topology (Lifshitz
// transition) at mu = 4t'. Formulas are checked in bin/animation_physics_check.py.
(function () {
  const hero = document.querySelector(".sx-hero");
  if (!hero) {
    return;
  }

  const canvas = document.createElement("canvas");
  canvas.className = "sx-fermi-canvas";
  canvas.setAttribute("aria-hidden", "true");
  hero.prepend(canvas);

  const readout = document.createElement("p");
  readout.className = "sx-fermi-readout";
  hero.append(readout);

  const ctx = canvas.getContext("2d");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const N = 56; // grid points per zone edge for marching squares
  const MU_RANGE = [-1.75, -0.35];
  const TP_RANGE = [-0.42, -0.12];

  let width = 0;
  let height = 0;
  let zone = 240;
  let mu = -1.0;
  let tp = -0.3;
  let target = { mu: mu, tp: tp };
  let lastPointer = -Infinity;
  let visible = true;
  let segments = [];
  let cache = { mu: NaN, tp: NaN };
  let topology = "";

  function colours() {
    const css = getComputedStyle(document.documentElement);
    return {
      a: css.getPropertyValue("--sx-accent").trim() || "#2563eb",
      b: css.getPropertyValue("--sx-accent-2").trim() || "#0d9488",
      grid: css.getPropertyValue("--sx-border-strong").trim() || "#cbd5e1",
    };
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    zone = Math.max(170, Math.min(280, width / 4.6));
  }

  // Marching squares for eps = 0 on one Brillouin zone [-pi, pi]^2, in units of the zone (0..1).
  function contour() {
    const e = new Float32Array((N + 1) * (N + 1));
    for (let j = 0; j <= N; j++) {
      const ky = -Math.PI + (2 * Math.PI * j) / N;
      const cy = Math.cos(ky);
      for (let i = 0; i <= N; i++) {
        const cx = Math.cos(-Math.PI + (2 * Math.PI * i) / N);
        e[j * (N + 1) + i] = -2 * (cx + cy) - 4 * tp * cx * cy - mu;
      }
    }
    const out = [];
    const lerp = (a, b) => a / (a - b);
    for (let j = 0; j < N; j++) {
      for (let i = 0; i < N; i++) {
        const v0 = e[j * (N + 1) + i];
        const v1 = e[j * (N + 1) + i + 1];
        const v2 = e[(j + 1) * (N + 1) + i + 1];
        const v3 = e[(j + 1) * (N + 1) + i];
        const pts = [];
        if (v0 * v1 < 0) pts.push([i + lerp(v0, v1), j]);
        if (v1 * v2 < 0) pts.push([i + 1, j + lerp(v1, v2)]);
        if (v2 * v3 < 0) pts.push([i + 1 - lerp(v2, v3), j + 1]);
        if (v3 * v0 < 0) pts.push([i, j + 1 - lerp(v3, v0)]);
        for (let p = 0; p + 1 < pts.length; p += 2) {
          const x0 = pts[p][0] / N;
          const y0 = pts[p][1] / N;
          const x1 = pts[p + 1][0] / N;
          const y1 = pts[p + 1][1] / N;
          const kx = -Math.PI + Math.PI * (x0 + x1);
          const ky = -Math.PI + Math.PI * (y0 + y1);
          out.push([x0, y0, x1, y1, 0.5 * (Math.cos(kx) - Math.cos(ky))]);
        }
      }
    }
    return out;
  }

  function updateReadout() {
    const next = mu > 4 * tp ? "hole-like, around (π, π)" : "electron-like, around Γ";
    const hint = finePointer && !reduced ? " · move the cursor to tune" : "";
    readout.textContent = "Fermi surface · μ/t = " + mu.toFixed(2) + " · t′/t = " + tp.toFixed(2) + " · " + next + hint;
    if (topology && topology !== next) {
      readout.classList.remove("is-lifshitz");
      void readout.offsetWidth;
      readout.classList.add("is-lifshitz");
    }
    topology = next;
  }

  function draw() {
    if (!(Math.abs(cache.mu - mu) < 1e-4 && Math.abs(cache.tp - tp) < 1e-4)) {
      segments = contour();
      cache = { mu: mu, tp: tp };
      updateReadout();
    }
    const c = colours();
    ctx.clearRect(0, 0, width, height);
    const ox = width * 0.72 - zone / 2;
    const oy = height * 0.5 - zone / 2;
    const i0 = Math.floor(-ox / zone) - 1;
    const i1 = Math.ceil((width - ox) / zone);
    const j0 = Math.floor(-oy / zone) - 1;
    const j1 = Math.ceil((height - oy) / zone);

    // zone boundaries and reciprocal-lattice points
    ctx.strokeStyle = c.grid;
    ctx.globalAlpha = 0.55;
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    for (let i = i0; i <= i1 + 1; i++) {
      ctx.moveTo(ox + i * zone, 0);
      ctx.lineTo(ox + i * zone, height);
    }
    for (let j = j0; j <= j1 + 1; j++) {
      ctx.moveTo(0, oy + j * zone);
      ctx.lineTo(width, oy + j * zone);
    }
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = c.grid;
    for (let i = i0; i <= i1; i++) {
      for (let j = j0; j <= j1; j++) {
        ctx.beginPath();
        ctx.arc(ox + (i + 0.5) * zone, oy + (j + 0.5) * zone, 2, 0, 2 * Math.PI);
        ctx.fill();
      }
    }

    // Fermi contour coloured by the d-wave form factor; it fades at the nodes
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    for (const s of segments) {
      ctx.strokeStyle = s[4] < 0 ? c.a : c.b;
      ctx.globalAlpha = 0.25 + 0.75 * Math.min(1, Math.abs(s[4]) * 1.4);
      ctx.beginPath();
      for (let i = i0; i <= i1; i++) {
        for (let j = j0; j <= j1; j++) {
          const bx = ox + i * zone;
          const by = oy + j * zone;
          ctx.moveTo(bx + s[0] * zone, by + (1 - s[1]) * zone);
          ctx.lineTo(bx + s[2] * zone, by + (1 - s[3]) * zone);
        }
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  function frame(now) {
    if (visible && !document.hidden) {
      const t = now / 1000;
      if (now - lastPointer > 4000) {
        target.mu = -1.05 + 0.6 * Math.sin(0.23 * t);
        target.tp = -0.27 + 0.1 * Math.sin(0.15 * t + 1.0);
      }
      mu += (target.mu - mu) * 0.06;
      tp += (target.tp - tp) * 0.06;
      draw();
    }
    requestAnimationFrame(frame);
  }

  hero.addEventListener("pointermove", function (event) {
    if (event.pointerType !== "mouse" || reduced) {
      return;
    }
    const rect = hero.getBoundingClientRect();
    const fx = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    const fy = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
    target.mu = MU_RANGE[0] + fx * (MU_RANGE[1] - MU_RANGE[0]);
    target.tp = TP_RANGE[0] + fy * (TP_RANGE[1] - TP_RANGE[0]);
    lastPointer = performance.now();
  });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
    }).observe(hero);
  }

  window.addEventListener("resize", function () {
    resize();
    draw();
  });
  new MutationObserver(draw).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  resize();
  draw();
  if (!reduced) {
    requestAnimationFrame(frame);
  }
})();
