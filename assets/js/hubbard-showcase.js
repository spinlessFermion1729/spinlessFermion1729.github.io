(() => {
  "use strict";

  function initHubbardShowcase() {
    const root = document.getElementById("hubbard-showcase");
    if (!root || root.dataset.ready === "true") return;
    root.dataset.ready = "true";

    const canvas = root.querySelector("#hubbard-canvas");
    const uSlider = root.querySelector("#hubbard-u");
    const fillingSlider = root.querySelector("#hubbard-filling");
    const uValue = root.querySelector("#hubbard-u-value");
    const fillingValue = root.querySelector("#hubbard-filling-value");
    const regimeValue = root.querySelector("#hubbard-regime-value");
    const occupancyValue = root.querySelector("#hubbard-occupancy-value");
    const exchangeValue = root.querySelector("#hubbard-exchange-value");
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx || !uSlider || !fillingSlider) return;

    const cols = 8;
    const rows = 4;
    const siteCount = cols * rows;
    const sites = [];
    const edges = [];
    const state = Array.from({ length: siteCount }, () => ({
      up: false,
      down: false
    }));
    const pulses = [];
    let running = true;
    let lastTime = performance.now();
    let geometry = null;

    function index(row, col) {
      return row * cols + col;
    }

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        sites.push({ row, col, x: 0, y: 0 });
        if (col < cols - 1) edges.push([index(row, col), index(row, col + 1)]);
        if (row < rows - 1) edges.push([index(row, col), index(row + 1, col)]);
      }
    }

    function shuffle(values) {
      for (let i = values.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [values[i], values[j]] = [values[j], values[i]];
      }
      return values;
    }

    function parameters() {
      return {
        u: Number(uSlider.value),
        filling: Number(fillingSlider.value)
      };
    }

    function buildOccupancy() {
      const { u, filling } = parameters();
      state.forEach(site => {
        site.up = false;
        site.down = false;
      });

      const electronCount = Math.round(filling * siteCount);
      const uncorrelatedDoubleOccupancy = (filling * filling) / 4;
      const suppression = 1 / (1 + 0.18 * u * u);
      let doublons = Math.round(siteCount * uncorrelatedDoubleOccupancy * suppression);
      doublons = Math.min(
        doublons,
        Math.floor(electronCount / 2)
      );
      doublons = Math.max(0, doublons);

      const singles = Math.max(0, electronCount - 2 * doublons);
      const order = shuffle(Array.from({ length: siteCount }, (_, i) => i));

      for (let i = 0; i < doublons; i += 1) {
        state[order[i]].up = true;
        state[order[i]].down = true;
      }

      const staggeredWeight =
        Math.max(0, Math.min(1, ((u - 2) / 8) * (filling / 1.0)));

      for (let i = doublons; i < doublons + singles; i += 1) {
        const siteId = order[i];
        const site = sites[siteId];
        const staggeredUp = (site.row + site.col) % 2 === 0;
        const useStaggered = Math.random() < staggeredWeight;
        const spinUp = useStaggered ? staggeredUp : Math.random() > 0.5;
        state[siteId][spinUp ? "up" : "down"] = true;
      }

      pulses.length = 0;
    }

    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssWidth = Math.max(320, rect.width);
      const cssHeight = Math.max(220, cssWidth * 0.42);

      canvas.style.height = `${cssHeight}px`;
      canvas.width = Math.round(cssWidth * dpr);
      canvas.height = Math.round(cssHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      geometry = {
        width: cssWidth,
        height: cssHeight,
        padX: Math.max(34, cssWidth * 0.08),
        padY: Math.max(34, cssHeight * 0.18)
      };

      sites.forEach(site => {
        site.x =
          geometry.padX +
          site.col * ((geometry.width - 2 * geometry.padX) / (cols - 1));
        site.y =
          geometry.padY +
          site.row * ((geometry.height - 2 * geometry.padY) / (rows - 1));
      });
    }

    function regime(u, filling) {
      if (u < 3) return "weak-coupling itinerant regime";
      if (u < 7) return "intermediate-coupling regime";
      return filling > 0.95
        ? "strong-coupling local-moment regime"
        : "strongly correlated doped regime";
    }

    function updateReadouts() {
      const { u, filling } = parameters();
      uValue.textContent = u.toFixed(1);
      fillingValue.textContent = filling.toFixed(2);
      regimeValue.textContent = regime(u, filling);
      occupancyValue.textContent =
        filling > 0.97
          ? "near half filling"
          : `hole doping δ = ${(1 - filling).toFixed(2)}`;

      exchangeValue.textContent =
        u >= 4
          ? `J/t ≈ ${(4 / u).toFixed(2)}`
          : "J = 4t²/U not yet controlled";

      root.querySelectorAll("[data-tendency]").forEach(item => {
        const tendency = item.dataset.tendency;
        let active = false;

        if (tendency === "metal") active = u < 4 || filling < 0.88;
        if (tendency === "af") active = filling > 0.9 && u >= 2.5;
        if (tendency === "mott") active = filling > 0.97 && u >= 7;
        if (tendency === "pairing") {
          active = filling < 0.97 && filling > 0.75 && u >= 3 && u <= 9;
        }
        if (tendency === "exchange") active = u >= 5;

        item.classList.toggle("is-active", active);
      });

      root.style.setProperty("--u-level", Math.min(u / 12, 1).toFixed(3));
    }

    function themeColours() {
      const styles = getComputedStyle(document.documentElement);
      return {
        text: styles.getPropertyValue("--global-text-color").trim() || "#6b7280",
        background:
          styles.getPropertyValue("--global-bg-color").trim() || "#ffffff",
        theme:
          styles.getPropertyValue("--global-theme-color").trim() || "#2563eb",
        divider:
          styles.getPropertyValue("--global-divider-color").trim() || "#d1d5db"
      };
    }

    function spawnPulse() {
      if (pulses.length >= 10) return;
      const { u } = parameters();
      const edge = edges[Math.floor(Math.random() * edges.length)];
      const startId = Math.random() > 0.5 ? edge[0] : edge[1];
      const endId = startId === edge[0] ? edge[1] : edge[0];
      const startState = state[startId];
      const availableSpins = [];
      if (startState.up && !state[endId].up) availableSpins.push("up");
      if (startState.down && !state[endId].down) availableSpins.push("down");
      if (!availableSpins.length) return;

      const spin = availableSpins[Math.floor(Math.random() * availableSpins.length)];
      const targetOccupied = state[endId].up || state[endId].down;
      const virtual = targetOccupied && Math.random() < Math.min(0.88, u / 11);

      pulses.push({
        startId,
        endId,
        spin,
        progress: 0,
        duration: 0.65 + 0.07 * u + Math.random() * 0.35,
        virtual
      });
    }

    function updatePulses(dt) {
      const { u } = parameters();
      const spawnRate = 0.9 / (1 + 0.16 * u);
      if (Math.random() < spawnRate * dt) spawnPulse();

      for (let i = pulses.length - 1; i >= 0; i -= 1) {
        const pulse = pulses[i];
        pulse.progress += dt / pulse.duration;
        if (pulse.progress >= 1) pulses.splice(i, 1);
      }
    }

    function drawBondNetwork(colours) {
      ctx.save();
      ctx.strokeStyle = colours.text;
      ctx.globalAlpha = 0.18;
      ctx.lineWidth = 1.5;

      edges.forEach(([a, b]) => {
        ctx.beginPath();
        ctx.moveTo(sites[a].x, sites[a].y);
        ctx.lineTo(sites[b].x, sites[b].y);
        ctx.stroke();
      });
      ctx.restore();
    }

    function drawExchange(colours, time) {
      const { u, filling } = parameters();
      if (u < 5 || filling < 0.9) return;

      ctx.save();
      ctx.strokeStyle = colours.theme;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.12 + 0.08 * Math.sin(time * 0.003);

      edges.forEach(([a, b], edgeIndex) => {
        if (edgeIndex % 2 !== 0) return;
        const sa = sites[a];
        const sb = sites[b];
        ctx.setLineDash([4, 7]);
        ctx.lineDashOffset = -time * 0.02;
        ctx.beginPath();
        ctx.moveTo(sa.x, sa.y);
        ctx.lineTo(sb.x, sb.y);
        ctx.stroke();
      });
      ctx.restore();
    }

    function drawSite(site, occupation, colours) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(site.x, site.y, 14, 0, Math.PI * 2);
      ctx.fillStyle = colours.background;
      ctx.fill();
      ctx.strokeStyle = colours.divider;
      ctx.lineWidth = 1.4;
      ctx.stroke();

      if (occupation.up && occupation.down) {
        const halo = ctx.createRadialGradient(
          site.x, site.y, 3, site.x, site.y, 24
        );
        halo.addColorStop(0, "rgba(147, 51, 234, 0.28)");
        halo.addColorStop(1, "rgba(147, 51, 234, 0)");
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(site.x, site.y, 24, 0, Math.PI * 2);
        ctx.fill();
      }

      function electron(dx, colour, arrow) {
        ctx.beginPath();
        ctx.arc(site.x + dx, site.y, 7, 0, Math.PI * 2);
        ctx.fillStyle = colour;
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.font = "700 10px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(arrow, site.x + dx, site.y + 0.5);
      }

      if (occupation.up && occupation.down) {
        electron(-5, "#dc4964", "↑");
        electron(5, "#3b7ddd", "↓");
      } else if (occupation.up) {
        electron(0, "#dc4964", "↑");
      } else if (occupation.down) {
        electron(0, "#3b7ddd", "↓");
      } else {
        ctx.fillStyle = colours.text;
        ctx.globalAlpha = 0.35;
        ctx.font = "600 12px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("○", site.x, site.y);
      }

      ctx.restore();
    }

    function drawPulses(time) {
      pulses.forEach(pulse => {
        const a = sites[pulse.startId];
        const b = sites[pulse.endId];
        const p = pulse.virtual
          ? 0.5 - 0.5 * Math.cos(2 * Math.PI * pulse.progress)
          : pulse.progress;
        const x = a.x + (b.x - a.x) * p;
        const baseY = a.y + (b.y - a.y) * p;
        const y = pulse.virtual
          ? baseY - Math.sin(Math.PI * pulse.progress) * 18
          : baseY;

        ctx.save();
        ctx.shadowBlur = 13;
        ctx.shadowColor =
          pulse.virtual
            ? "rgba(147, 51, 234, 0.85)"
            : pulse.spin === "up"
              ? "rgba(220, 73, 100, 0.8)"
              : "rgba(59, 125, 221, 0.8)";
        ctx.fillStyle =
          pulse.virtual
            ? "#9333ea"
            : pulse.spin === "up"
              ? "#dc4964"
              : "#3b7ddd";
        ctx.beginPath();
        ctx.arc(x, y, pulse.virtual ? 5.5 : 6.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    }

    function draw(time) {
      const colours = themeColours();
      ctx.clearRect(0, 0, geometry.width, geometry.height);
      drawBondNetwork(colours);
      drawExchange(colours, time);
      sites.forEach((site, i) => drawSite(site, state[i], colours));
      drawPulses(time);
    }

    function frame(time) {
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      if (running) {
        updatePulses(dt);
        draw(time);
      }
      requestAnimationFrame(frame);
    }

    function refreshModel() {
      updateReadouts();
      buildOccupancy();
      draw(performance.now());
    }

    uSlider.addEventListener("input", refreshModel);
    fillingSlider.addEventListener("input", refreshModel);

    const resize = () => {
      resizeCanvas();
      draw(performance.now());
    };

    if ("ResizeObserver" in window) {
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(canvas.parentElement);
    } else {
      window.addEventListener("resize", resize);
    }

    resizeCanvas();
    refreshModel();

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
      running = false;
      root.classList.add("is-visible");
      draw(performance.now());
    } else {
      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            running = entry.isIntersecting;
            if (entry.isIntersecting) root.classList.add("is-visible");
          });
        },
        { threshold: 0.12 }
      );
      observer.observe(root);
      requestAnimationFrame(frame);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHubbardShowcase);
  } else {
    initHubbardShowcase();
  }
})();
