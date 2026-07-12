(() => {
  "use strict";

  function init() {
    const root = document.getElementById("hubbard-observatory");
    if (!root || root.dataset.ready === "true") return;
    root.dataset.ready = "true";

    const canvas = root.querySelector("#ho-lattice");
    const ctx = canvas?.getContext("2d");
    const u = root.querySelector("#ho-u");
    const d = root.querySelector("#ho-doping");
    const temp = root.querySelector("#ho-temperature");
    const play = root.querySelector("#ho-play");
    const marker = root.querySelector("#ho-marker");
    if (!canvas || !ctx || !u || !d || !temp || !play || !marker) return;

    const labels = {
      u: root.querySelector("#ho-u-value"),
      d: root.querySelector("#ho-doping-value"),
      t: root.querySelector("#ho-temperature-value"),
      regime: root.querySelector("#ho-regime")
    };

    const values = {
      double: root.querySelector("#ho-double-value"),
      moment: root.querySelector("#ho-moment-value"),
      coherence: root.querySelector("#ho-coherence-value"),
      exchange: root.querySelector("#ho-exchange-value")
    };

    const meters = {
      double: root.querySelector("#ho-double-meter"),
      moment: root.querySelector("#ho-moment-meter"),
      coherence: root.querySelector("#ho-coherence-meter"),
      exchange: root.querySelector("#ho-exchange-meter")
    };

    const cols = 9;
    const rows = 5;
    const sites = [];
    const edges = [];
    const occ = [];
    const hops = [];
    const traces = [];
    let geom = null;
    let running = true;
    let visible = true;
    let last = performance.now();
    let spawnClock = 0;

    const idx = (r, c) => r * cols + c;

    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        sites.push({ r, c, x: 0, y: 0 });
        if (c < cols - 1) edges.push([idx(r, c), idx(r, c + 1)]);
        if (r < rows - 1) edges.push([idx(r, c), idx(r + 1, c)]);
      }
    }

    const params = () => ({
      U: Number(u.value),
      delta: Number(d.value),
      T: Number(temp.value)
    });

    function random(seed) {
      return function () {
        let x = seed += 0x6D2B79F5;
        x = Math.imul(x ^ x >>> 15, x | 1);
        x ^= x + Math.imul(x ^ x >>> 7, x | 61);
        return ((x ^ x >>> 14) >>> 0) / 4294967296;
      };
    }

    function shuffle(a, rnd) {
      for (let i = a.length - 1; i > 0; i -= 1) {
        const j = Math.floor(rnd() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }

    function indicators() {
      const { U, delta, T } = params();
      const filling = 1 - delta;
      const doublon = Math.max(0.02, Math.min(1,
        (1 / (1 + Math.pow(U / 3.8, 1.65))) * (0.92 - 0.42 * delta) + 0.1 * T / 0.8
      ));
      const moment = Math.max(0, Math.min(1,
        (1 - doublon) * Math.pow(filling, 0.72) * Math.exp(-0.65 * T)
      ));
      const coherence = Math.max(0.03, Math.min(1,
        (0.92 - 0.045 * U) * (0.62 + 0.95 * delta) * Math.exp(-1.2 * T)
      ));
      const exchange = U >= 4 ? Math.max(0, Math.min(1, 4 / U)) : 0;
      return { doublon, moment, coherence, exchange };
    }

    function regime() {
      const { U, delta, T } = params();
      if (T > 0.48) return "Thermally incoherent crossover";
      if (U < 2.8) return delta < 0.08 ? "Weak-coupling itinerant regime" : "Doped itinerant metal";
      if (delta < 0.055 && U > 6.2) return "Local-moment / Mott regime";
      if (delta >= 0.055 && delta <= 0.24 && U >= 3.2 && U <= 9.5) return "Doped correlated regime";
      if (U > 8) return "Strongly correlated doped regime";
      return "Intermediate-coupling crossover";
    }

    function buildState() {
      const { U, delta, T } = params();
      const seed = (
        Math.round(U * 1000) * 73856093 ^
        Math.round(delta * 10000) * 19349663 ^
        Math.round(T * 10000) * 83492791
      ) >>> 0;
      const rnd = random(seed);
      const nSites = sites.length;
      const electrons = Math.round((1 - delta) * nSites);
      const q = indicators();

      occ.length = 0;
      for (let i = 0; i < nSites; i += 1) occ.push({ up: false, down: false });

      const doublons = Math.min(
        Math.floor(electrons / 2),
        Math.round(nSites * Math.pow(1 - delta, 2) * 0.24 * q.doublon)
      );
      const singles = Math.max(0, electrons - 2 * doublons);
      const order = shuffle(Array.from({ length: nSites }, (_, i) => i), rnd);

      for (let i = 0; i < doublons; i += 1) {
        occ[order[i]].up = true;
        occ[order[i]].down = true;
      }

      const staggered = Math.max(0, Math.min(0.96,
        ((U - 2.2) / 7.5) * (1 - 1.8 * delta) * Math.exp(-1.8 * T)
      ));

      for (let i = doublons; i < doublons + singles && i < order.length; i += 1) {
        const id = order[i];
        const preferred = (sites[id].r + sites[id].c) % 2 === 0;
        const spinUp = rnd() < staggered ? preferred : rnd() > 0.5;
        occ[id][spinUp ? "up" : "down"] = true;
      }

      hops.length = 0;
      traces.length = 0;
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(320, rect.width);
      const h = Math.max(280, w * 0.52);
      canvas.style.height = `${h}px`;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      geom = { w, h, px: Math.max(34, w * 0.075), py: Math.max(40, h * 0.14) };
      sites.forEach(s => {
        s.x = geom.px + s.c * ((geom.w - 2 * geom.px) / (cols - 1));
        s.y = geom.py + s.r * ((geom.h - 2 * geom.py) / (rows - 1));
      });
    }

    function theme() {
      const s = getComputedStyle(document.documentElement);
      return {
        text: s.getPropertyValue("--global-text-color").trim() || "#6b7280",
        muted: s.getPropertyValue("--global-text-color-light").trim() || "#9ca3af",
        bg: s.getPropertyValue("--global-bg-color").trim() || "#ffffff",
        border: s.getPropertyValue("--global-divider-color").trim() || "#d1d5db",
        accent: s.getPropertyValue("--global-theme-color").trim() || "#2563eb"
      };
    }

    const occupied = id => occ[id].up || occ[id].down;

    function candidates() {
      const { U, T } = params();
      const out = [];
      edges.forEach(([a, b]) => {
        [[a, b], [b, a]].forEach(([from, to]) => {
          ["up", "down"].forEach(spin => {
            if (!occ[from][spin] || occ[to][spin]) return;
            const targetOccupied = occupied(to);
            const virtual = targetOccupied && U >= 3.2 && Math.random() < Math.min(0.95, 0.34 + U / 15);
            const allowed = !targetOccupied || Math.random() < Math.max(0.02, Math.exp(-U / Math.max(0.55, 4.5 * T)));
            if (virtual || allowed) out.push({ from, to, spin, virtual });
          });
        });
      });
      return out;
    }

    function spawn() {
      if (hops.length >= 12) return;
      const list = candidates();
      if (!list.length) return;
      const p = list[Math.floor(Math.random() * list.length)];
      const { U, T } = params();
      hops.push({ ...p, age: 0, duration: p.virtual ? 0.68 + 0.035 * U : 0.48 + 0.055 * U + 0.15 * T });
    }

    function update(dt) {
      const { U, delta, T } = params();
      const real = Math.max(0.04, Math.min(1,
        (0.92 - 0.055 * U) * (0.52 + 1.35 * delta) * Math.exp(-0.35 * T)
      ));
      const virtual = Math.max(0, Math.min(1,
        ((U - 3) / 7) * (1 - 1.7 * delta) * Math.exp(-1.5 * T)
      ));
      const rate = 0.6 + 2.5 * real + 1.4 * virtual;
      spawnClock += dt;
      while (spawnClock > 1 / rate) {
        spawnClock -= 1 / rate;
        spawn();
      }

      for (let i = hops.length - 1; i >= 0; i -= 1) {
        const h = hops[i];
        h.age += dt;
        if (h.age >= h.duration) {
          if (!h.virtual && !occupied(h.to)) {
            occ[h.from][h.spin] = false;
            occ[h.to][h.spin] = true;
          }
          traces.push({ from: h.from, to: h.to, virtual: h.virtual, life: 0.55 });
          hops.splice(i, 1);
        }
      }

      for (let i = traces.length - 1; i >= 0; i -= 1) {
        traces[i].life -= dt;
        if (traces[i].life <= 0) traces.splice(i, 1);
      }
    }

    function draw(time) {
      if (!geom) return;
      const c = theme();
      ctx.clearRect(0, 0, geom.w, geom.h);

      const glow = ctx.createRadialGradient(geom.w / 2, geom.h / 2, 10, geom.w / 2, geom.h / 2, geom.w * 0.58);
      glow.addColorStop(0, "rgba(76,114,180,.075)");
      glow.addColorStop(1, "rgba(76,114,180,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, geom.w, geom.h);

      const { U, delta, T } = params();
      ctx.save();
      ctx.fillStyle = c.muted;
      ctx.globalAlpha = 0.42;
      ctx.font = "600 11px system-ui,sans-serif";
      ctx.fillText(`U/t = ${U.toFixed(2)}   δ = ${delta.toFixed(2)}   T/t = ${T.toFixed(2)}`, 14, 19);
      ctx.restore();

      ctx.save();
      ctx.strokeStyle = c.text;
      ctx.globalAlpha = 0.17;
      ctx.lineWidth = 1.25;
      edges.forEach(([a, b]) => {
        ctx.beginPath();
        ctx.moveTo(sites[a].x, sites[a].y);
        ctx.lineTo(sites[b].x, sites[b].y);
        ctx.stroke();
      });
      ctx.restore();

      const q = indicators();
      if (q.moment > 0.35) {
        ctx.save();
        ctx.setLineDash([3, 7]);
        ctx.lineDashOffset = -time * 0.018;
        ctx.strokeStyle = c.accent;
        ctx.globalAlpha = 0.05 + 0.11 * q.moment;
        edges.forEach(([a, b], i) => {
          if (i % 2) return;
          ctx.beginPath();
          ctx.moveTo(sites[a].x, sites[a].y);
          ctx.lineTo(sites[b].x, sites[b].y);
          ctx.stroke();
        });
        ctx.restore();
      }

      traces.forEach(t => {
        const a = sites[t.from], b = sites[t.to];
        ctx.save();
        ctx.globalAlpha = Math.max(0, t.life / 0.55);
        ctx.strokeStyle = t.virtual ? "#a855f7" : "#14b8a6";
        ctx.lineWidth = t.virtual ? 2.4 : 2;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        if (t.virtual) ctx.quadraticCurveTo((a.x + b.x) / 2, (a.y + b.y) / 2 - 18, b.x, b.y);
        else ctx.lineTo(b.x, b.y);
        ctx.stroke();
        ctx.restore();
      });

      sites.forEach((s, id) => {
        const st = occ[id];
        const pulse = 1 + 0.035 * Math.sin(time * 0.0024 + s.r * 0.8 + s.c * 0.55);
        ctx.save();
        if (st.up && st.down) {
          const halo = ctx.createRadialGradient(s.x, s.y, 2, s.x, s.y, 25);
          halo.addColorStop(0, "rgba(168,85,247,.28)");
          halo.addColorStop(1, "rgba(168,85,247,0)");
          ctx.fillStyle = halo;
          ctx.beginPath(); ctx.arc(s.x, s.y, 25 * pulse, 0, Math.PI * 2); ctx.fill();
        }
        ctx.beginPath(); ctx.arc(s.x, s.y, 13.5 * pulse, 0, Math.PI * 2);
        ctx.fillStyle = c.bg; ctx.fill(); ctx.strokeStyle = c.border; ctx.lineWidth = 1.25; ctx.stroke();

        const electron = (dx, colour, symbol) => {
          ctx.save(); ctx.shadowBlur = 10; ctx.shadowColor = colour;
          ctx.beginPath(); ctx.arc(s.x + dx, s.y, 6.7, 0, Math.PI * 2); ctx.fillStyle = colour; ctx.fill(); ctx.restore();
          ctx.fillStyle = "#fff"; ctx.font = "700 9px system-ui,sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
          ctx.fillText(symbol, s.x + dx, s.y + 0.2);
        };

        if (st.up && st.down) { electron(-5, "#e24b68", "↑"); electron(5, "#3b82f6", "↓"); }
        else if (st.up) electron(0, "#e24b68", "↑");
        else if (st.down) electron(0, "#3b82f6", "↓");
        else { ctx.beginPath(); ctx.arc(s.x, s.y, 4.1, 0, Math.PI * 2); ctx.strokeStyle = c.muted; ctx.globalAlpha = 0.56; ctx.stroke(); }
        ctx.restore();
      });

      hops.forEach(h => {
        const a = sites[h.from], b = sites[h.to];
        const raw = Math.min(1, h.age / h.duration);
        const p = h.virtual ? 0.5 - 0.5 * Math.cos(2 * Math.PI * raw) : raw;
        const x = a.x + (b.x - a.x) * p;
        const baseY = a.y + (b.y - a.y) * p;
        const y = h.virtual ? baseY - 20 * Math.sin(Math.PI * raw) : baseY;
        const colour = h.virtual ? "#a855f7" : h.spin === "up" ? "#e24b68" : "#3b82f6";
        ctx.save(); ctx.shadowBlur = 14; ctx.shadowColor = colour; ctx.fillStyle = colour;
        ctx.beginPath(); ctx.arc(x, y, h.virtual ? 5.2 : 6.2, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      });
    }

    function setMeter(name, value) {
      const v = Math.max(0, Math.min(1, value));
      values[name].textContent = v.toFixed(2);
      meters[name].style.width = `${(100 * v).toFixed(1)}%`;
      meters[name].parentElement.setAttribute("aria-valuenow", v.toFixed(2));
    }

    function updateUI() {
      const { U, delta, T } = params();
      const q = indicators();
      labels.u.textContent = U.toFixed(2);
      labels.d.textContent = delta.toFixed(2);
      labels.t.textContent = T.toFixed(2);
      labels.regime.textContent = regime();
      setMeter("double", q.doublon);
      setMeter("moment", q.moment);
      setMeter("coherence", q.coherence);
      setMeter("exchange", U >= 4 ? q.exchange : 0);
      if (U < 4) values.exchange.textContent = "n/a";

      const x = 52 + (delta / 0.35) * 330;
      const y = 272 - (U / 12) * 244;
      marker.setAttribute("transform", `translate(${x.toFixed(2)} ${y.toFixed(2)})`);
      const halo = marker.querySelector(".marker-halo");
      if (halo) {
        halo.setAttribute("r", (13 + 13 * T / 0.8).toFixed(2));
        halo.setAttribute("opacity", (0.95 - 0.35 * T / 0.8).toFixed(2));
      }

      const tendencies = {
        itinerant: U < 4.2 || delta > 0.22,
        moments: U > 4.5 && delta < 0.16 && T < 0.45,
        exchange: U > 5 && delta < 0.20 && T < 0.35,
        pairing: U >= 3.2 && U <= 9.5 && delta >= 0.055 && delta <= 0.24 && T < 0.30,
        thermal: T > 0.38
      };
      root.querySelectorAll("[data-tendency]").forEach(el => {
        el.classList.toggle("is-active", Boolean(tendencies[el.dataset.tendency]));
      });
    }

    function refresh() {
      updateUI();
      buildState();
      draw(performance.now());
    }

    const presets = {
      metal: [2, 0.22, 0.10],
      mott: [9, 0.01, 0.08],
      doped: [6, 0.12, 0.12],
      thermal: [6, 0.12, 0.58]
    };

    root.querySelectorAll("[data-preset]").forEach(button => {
      button.addEventListener("click", () => {
        const p = presets[button.dataset.preset];
        if (!p) return;
        [u.value, d.value, temp.value] = p;
        root.querySelectorAll("[data-preset]").forEach(b => b.classList.toggle("is-active", b === button));
        refresh();
      });
    });

    [u, d, temp].forEach(input => input.addEventListener("input", refresh));

    play.addEventListener("click", () => {
      running = !running;
      play.textContent = running ? "Ⅱ" : "▶";
      play.setAttribute("aria-label", running ? "Pause animation" : "Play animation");
      play.setAttribute("title", running ? "Pause animation" : "Play animation");
      if (!running) draw(performance.now());
    });

    const onResize = () => { resize(); draw(performance.now()); };
    if ("ResizeObserver" in window) new ResizeObserver(onResize).observe(canvas.parentElement);
    else window.addEventListener("resize", onResize);

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(entries => entries.forEach(e => { visible = e.isIntersecting; }), { threshold: 0.08 }).observe(root);
    }

    resize();
    root.querySelector('[data-preset="doped"]').classList.add("is-active");
    refresh();

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      running = false;
      play.textContent = "▶";
      play.setAttribute("aria-label", "Play animation");
      play.setAttribute("title", "Play animation");
    }

    function frame(now) {
      const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
      last = now;
      if (running && visible) { update(dt); draw(now); }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
