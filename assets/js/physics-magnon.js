// Research page: click-to-launch magnons in a minimal d-wave altermagnet.
// Classical spins (|S| = 1) on a square lattice with Neel order, A = (x+y) even (up), B (down):
//   H = J1 sum_nn S_i.S_j + J2 sum_{A, d=(1,1)} S_i.S_j + J2 sum_{B, d=(1,-1)} S_i.S_j,
// J1 = 1, J2 = -0.6, periodic boundaries. Landau-Lifshitz dynamics dS/dt = -S x h + alpha S x (S x h),
// h_i = dH/dS_i = sum_j J_ij S_j; the damping term turns S towards -h (lower energy), so old waves fade.
// Linear magnons:
//   omega_pm(k) = sqrt(Abar^2 - B^2) pm delta,  delta = -2 S J2 sin kx sin ky  (d_xy splitting),
// checked against the linearised dynamics in bin/animation_physics_check.py.
// Display: colour = sublattice imbalance (A - B)/(A + B) of the locally averaged transverse
// intensity, weighted by the total. The isotropic part cancels and the d-wave (quadrupolar)
// pattern of the chiral splitting remains: excess on A along (1,1), on B along (1,-1).
(function () {
  const host = document.querySelector("[data-magnon]");
  if (!host) {
    return;
  }

  const canvas = host.querySelector("canvas.sx-magnon-canvas");
  const inset = host.querySelector("canvas.sx-magnon-inset");
  const ctx = canvas.getContext("2d");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const J1 = 1.0;
  const J2 = -0.6;
  const DT = 0.035;
  const STEPS = 1; // ~2 time units (1/J1) per second at 60 fps
  const ALPHA = 0.025;
  const REF = 0.05; // reference intensity for the display (3x3 sum of |S_perp|^2)

  let W = 0;
  let H = 0;
  let a = 16;
  let Lx = 0;
  let Ly = 0;
  let n = 0;
  let sx, sy, sz, nbr, nbrJ, k1, k2, tx, ty, tz, wA, wB;
  let visible = true;
  let lastLaunch = -Infinity;

  function colours() {
    const css = getComputedStyle(document.documentElement);
    return {
      a: css.getPropertyValue("--sx-accent").trim() || "#2563eb",
      b: css.getPropertyValue("--sx-accent-2").trim() || "#0d9488",
      grid: css.getPropertyValue("--sx-border-strong").trim() || "#cbd5e1",
      ink: css.getPropertyValue("--sx-muted").trim() || "#64748b",
    };
  }

  function build() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = rect.width;
    H = rect.height;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    a = W < 560 ? 10 : 12;
    Lx = 2 * Math.floor(W / a / 2);
    Ly = 2 * Math.floor(H / a / 2);
    n = Lx * Ly;
    sx = new Float32Array(n);
    sy = new Float32Array(n);
    sz = new Float32Array(n);
    wA = new Float32Array(n);
    wB = new Float32Array(n);
    k1 = new Float32Array(3 * n);
    k2 = new Float32Array(3 * n);
    tx = new Float32Array(n);
    ty = new Float32Array(n);
    tz = new Float32Array(n);
    nbr = [];
    nbrJ = [];
    const id = (x, y) => ((x + Lx) % Lx) + Lx * ((y + Ly) % Ly);
    for (let y = 0; y < Ly; y++) {
      for (let x = 0; x < Lx; x++) {
        const isA = (x + y) % 2 === 0;
        sz[id(x, y)] = isA ? 1 : -1;
        const list = [id(x + 1, y), id(x - 1, y), id(x, y + 1), id(x, y - 1)];
        const js = [J1, J1, J1, J1];
        const d = isA ? [1, 1] : [1, -1];
        list.push(id(x + d[0], y + d[1]), id(x - d[0], y - d[1]));
        js.push(J2, J2);
        nbr.push(Int32Array.from(list));
        nbrJ.push(Float32Array.from(js));
      }
    }
  }

  // dS/dt for state (px, py, pz) into out
  function deriv(px, py, pz, out) {
    for (let i = 0; i < n; i++) {
      let hx = 0;
      let hy = 0;
      let hz = 0;
      const L = nbr[i];
      const Jv = nbrJ[i];
      for (let m = 0; m < L.length; m++) {
        const j = L[m];
        hx += Jv[m] * px[j];
        hy += Jv[m] * py[j];
        hz += Jv[m] * pz[j];
      }
      const X = px[i];
      const Y = py[i];
      const Z = pz[i];
      // -S x h
      let dx = -(Y * hz - Z * hy);
      let dy = -(Z * hx - X * hz);
      let dz = -(X * hy - Y * hx);
      // +alpha S x (S x h) = alpha (S (S.h) - h): relaxes S towards -h, i.e. lowers E = S.h
      const sh = X * hx + Y * hy + Z * hz;
      dx += ALPHA * (X * sh - hx);
      dy += ALPHA * (Y * sh - hy);
      dz += ALPHA * (Z * sh - hz);
      out[3 * i] = dx;
      out[3 * i + 1] = dy;
      out[3 * i + 2] = dz;
    }
  }

  // Heun (RK2) step with renormalisation
  function step() {
    deriv(sx, sy, sz, k1);
    for (let i = 0; i < n; i++) {
      tx[i] = sx[i] + DT * k1[3 * i];
      ty[i] = sy[i] + DT * k1[3 * i + 1];
      tz[i] = sz[i] + DT * k1[3 * i + 2];
    }
    deriv(tx, ty, tz, k2);
    for (let i = 0; i < n; i++) {
      let X = sx[i] + 0.5 * DT * (k1[3 * i] + k2[3 * i]);
      let Y = sy[i] + 0.5 * DT * (k1[3 * i + 1] + k2[3 * i + 1]);
      let Z = sz[i] + 0.5 * DT * (k1[3 * i + 2] + k2[3 * i + 2]);
      const r = 1 / Math.hypot(X, Y, Z);
      sx[i] = X * r;
      sy[i] = Y * r;
      sz[i] = Z * r;
    }
  }

  function launch(cx, cy) {
    const theta0 = 0.55;
    for (let yy = cy - 4; yy <= cy + 4; yy++) {
      for (let xx = cx - 4; xx <= cx + 4; xx++) {
        const x = (xx + Lx) % Lx;
        const y = (yy + Ly) % Ly;
        const i = x + Lx * y;
        const r2 = (xx - cx) ** 2 + (yy - cy) ** 2;
        const th = theta0 * Math.exp(-r2 / 2.2);
        const up = (x + y) % 2 === 0 ? 1 : -1;
        // tilt about the y axis, keeping |S| = 1
        const X = sx[i] * Math.cos(th) + sz[i] * Math.sin(th);
        const Z = -sx[i] * Math.sin(th) + sz[i] * Math.cos(th);
        sx[i] = X;
        sz[i] = Z;
        if (Math.sign(sz[i]) !== up) {
          sz[i] = up * Math.abs(sz[i]);
        }
      }
    }
    lastLaunch = performance.now();
  }

  function draw() {
    const c = colours();
    ctx.clearRect(0, 0, W, H);
    const offX = (W - (Lx - 1) * a) / 2;
    const offY = (H - (Ly - 1) * a) / 2; // lattice y axis points up on screen

    // second-neighbour bonds: A along (1,1), B along (1,-1)
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.16;
    for (const [isA, col] of [
      [true, c.a],
      [false, c.b],
    ]) {
      ctx.strokeStyle = col;
      ctx.beginPath();
      for (let y = 0; y < Ly - 1; y++) {
        for (let x = 0; x < Lx; x++) {
          if (((x + y) % 2 === 0) !== isA) continue;
          const d = isA ? 1 : -1;
          const x2 = x + d;
          if (x2 < 0 || x2 >= Lx) continue;
          ctx.moveTo(offX + x * a, offY + (Ly - 1 - y) * a);
          ctx.lineTo(offX + x2 * a, offY + (Ly - 2 - y) * a);
        }
      }
      ctx.stroke();
    }

    // sublattice-resolved transverse intensity, averaged over 3x3 cells
    for (let i = 0; i < n; i++) {
      const w = sx[i] * sx[i] + sy[i] * sy[i];
      const x = i % Lx;
      const y = (i - x) / Lx;
      if ((x + y) % 2 === 0) {
        wA[i] = w;
        wB[i] = 0;
      } else {
        wA[i] = 0;
        wB[i] = w;
      }
    }
    let totMax = REF;
    const imb = new Float32Array(n);
    const tot = new Float32Array(n);
    for (let y = 0; y < Ly; y++) {
      for (let x = 0; x < Lx; x++) {
        let A = 0;
        let B = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const j = ((x + dx + Lx) % Lx) + Lx * ((y + dy + Ly) % Ly);
            A += wA[j];
            B += wB[j];
          }
        }
        const i = x + Lx * y;
        tot[i] = A + B;
        imb[i] = (A - B) / (A + B + 1e-12);
        if (tot[i] > totMax) totMax = tot[i];
      }
    }

    // cells coloured by the sublattice imbalance, weighted by intensity
    for (let y = 0; y < Ly; y++) {
      for (let x = 0; x < Lx; x++) {
        const i = x + Lx * y;
        const m = Math.sqrt(tot[i] / totMax);
        if (m < 0.05) continue;
        ctx.fillStyle = imb[i] > 0 ? c.a : c.b;
        ctx.globalAlpha = m * (0.12 + 0.7 * Math.min(1, Math.abs(imb[i]) * 1.6));
        ctx.fillRect(offX + (x - 0.5) * a, offY + (Ly - 1 - y - 0.5) * a, a + 0.5, a + 0.5);
      }
    }

    // spins: one dot per site, brighter where the spins precess
    for (let y = 0; y < Ly; y++) {
      for (let x = 0; x < Lx; x++) {
        const i = x + Lx * y;
        const m = Math.sqrt(tot[i] / totMax);
        ctx.fillStyle = (x + y) % 2 === 0 ? c.a : c.b;
        ctx.globalAlpha = 0.3 + 0.6 * m;
        ctx.beginPath();
        ctx.arc(offX + x * a, offY + (Ly - 1 - y) * a, 1.3 + 1.2 * m, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }

  // Inset: omega_pm along the zone diagonal k = (q, q), where the d_xy splitting is largest.
  function drawInset() {
    if (!inset) return;
    const ic = inset.getContext("2d");
    const r = inset.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    inset.width = Math.round(r.width * dpr);
    inset.height = Math.round(r.height * dpr);
    ic.setTransform(dpr, 0, 0, dpr, 0, 0);
    const c = colours();
    const w = r.width;
    const h = r.height;
    const pad = { l: 26, r: 8, t: 10, b: 20 };
    const omega = (q, sgn) => {
      const c1 = Math.cos(2 * q);
      const Abar = 4 * J1 + J2 * (c1 + 1 - 2);
      const B = 2 * J1 * (2 * Math.cos(q));
      const delta = J2 * (c1 - 1);
      return Math.sqrt(Math.max(0, Abar * Abar - B * B)) + sgn * delta;
    };
    const wmax = 6.6;
    const X = (q) => pad.l + (q / Math.PI) * (w - pad.l - pad.r);
    const Y = (v) => h - pad.b - (v / wmax) * (h - pad.t - pad.b);
    ic.clearRect(0, 0, w, h);
    ic.strokeStyle = c.grid;
    ic.lineWidth = 1;
    ic.beginPath();
    ic.moveTo(pad.l, pad.t);
    ic.lineTo(pad.l, h - pad.b);
    ic.lineTo(w - pad.r, h - pad.b);
    ic.stroke();
    for (const [sgn, col] of [
      [1, c.a],
      [-1, c.b],
    ]) {
      ic.strokeStyle = col;
      ic.lineWidth = 2;
      ic.beginPath();
      for (let s = 0; s <= 80; s++) {
        const q = (Math.PI * s) / 80;
        const v = omega(q, sgn);
        if (s === 0) ic.moveTo(X(q), Y(v));
        else ic.lineTo(X(q), Y(v));
      }
      ic.stroke();
    }
    ic.fillStyle = c.ink;
    ic.font = "10px Inter, sans-serif";
    ic.textAlign = "center";
    ic.fillText("Γ", X(0), h - 6);
    ic.fillText("(π/2, π/2)", X(Math.PI / 2), h - 6);
    ic.fillText("M", X(Math.PI), h - 6);
    ic.save();
    ic.translate(9, (h - pad.b + pad.t) / 2);
    ic.rotate(-Math.PI / 2);
    ic.fillText("ω / J₁", 0, 0);
    ic.restore();
  }

  function frame(now) {
    if (visible && !document.hidden) {
      if (now - lastLaunch > 6500) {
        launch(Math.floor(Lx * (0.3 + 0.4 * Math.random())), Math.floor(Ly * (0.3 + 0.4 * Math.random())));
      }
      for (let s = 0; s < STEPS; s++) step();
      draw();
    }
    requestAnimationFrame(frame);
  }

  canvas.addEventListener("click", function (event) {
    const rect = canvas.getBoundingClientRect();
    const offX = (W - (Lx - 1) * a) / 2;
    const offY = (H - (Ly - 1) * a) / 2;
    const x = Math.round((event.clientX - rect.left - offX) / a);
    const y = Ly - 1 - Math.round((event.clientY - rect.top - offY) / a); // lattice y points up
    if (x >= 0 && x < Lx && y >= 0 && y < Ly) {
      launch(x, y);
      if (reduced) {
        for (let s = 0; s < 120; s++) step();
        draw();
      }
    }
  });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
    }).observe(host);
  }

  let resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      // rebuild only when the canvas width changes (not on mobile address-bar resizes)
      if (Math.abs(canvas.getBoundingClientRect().width - W) > 1) {
        build();
        launch(Math.floor(Lx / 2), Math.floor(Ly / 2));
      }
      drawInset();
      draw();
    }, 150);
  });
  new MutationObserver(function () {
    drawInset();
    draw();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  build();
  drawInset();
  launch(Math.floor(Lx / 2), Math.floor(Ly / 2));
  if (reduced) {
    for (let s = 0; s < 120; s++) step();
    draw();
  } else {
    requestAnimationFrame(frame);
  }
})();
