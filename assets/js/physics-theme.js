// Theme toggle as a moving magnetic domain wall.
// The new colour scheme is revealed by a circle growing from the toggle (View Transitions API);
// along its edge a ring of spins rotates by pi across a wall of finite width, i.e. the old domain
// (spins "up") is converted into the new one ("down"). Falls back to the plain toggle when the
// API is unavailable or reduced motion is requested. Wraps al_folio_core's toggleThemeSetting().
(function () {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const DURATION = 750;
  const WALL = 70; // wall width in px
  const SPACING = 30;
  let active = false;

  function nextComputedTheme() {
    const setting = typeof determineThemeSetting === "function" ? determineThemeSetting() : "system";
    const next = setting === "system" ? "light" : setting === "light" ? "dark" : "system";
    if (next === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return next;
  }

  function drawWall(canvas, cx, cy, radius, colour) {
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (canvas.width !== Math.round(w * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = colour;
    ctx.fillStyle = colour;
    ctx.lineWidth = 1.6;
    ctx.lineCap = "round";
    const x0 = ((cx % SPACING) + SPACING) % SPACING;
    const y0 = ((cy % SPACING) + SPACING) % SPACING;
    for (let y = y0; y < h + SPACING; y += SPACING) {
      for (let x = x0; x < w + SPACING; x += SPACING) {
        const d = Math.hypot(x - cx, y - cy);
        const u = (radius - d) / WALL; // 0 at the wall front, 1 at its back
        if (u < 0 || u > 1) continue;
        // rotation from "up" (old domain) to "down" (new domain) across the wall, about the radial axis
        const phi = Math.PI * u;
        const len = 9;
        const dx = Math.sin(phi) * len * ((x - cx) / (d || 1));
        const dy = -Math.cos(phi) * len;
        ctx.globalAlpha = 0.85 * Math.sin(Math.PI * u) + 0.15;
        ctx.beginPath();
        ctx.moveTo(x - dx * 0.5, y - dy * 0.5);
        ctx.lineTo(x + dx * 0.5, y + dy * 0.5);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x + dx * 0.5, y + dy * 0.5, 1.9, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  }

  document.addEventListener(
    "click",
    function (event) {
      const button = event.target.closest && event.target.closest("#light-toggle");
      if (!button || typeof toggleThemeSetting !== "function") {
        return;
      }
      if (active) {
        event.stopPropagation();
        event.preventDefault();
        return; // ignore clicks while a transition is running
      }
      const current = document.documentElement.getAttribute("data-theme");
      if (reduced || !document.startViewTransition || nextComputedTheme() === current) {
        return; // let al_folio_core's own handler run
      }
      event.stopPropagation();
      event.preventDefault();
      active = true;

      const rect = button.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const end = Math.hypot(Math.max(cx, window.innerWidth - cx), Math.max(cy, window.innerHeight - cy)) + WALL;

      const canvas = document.createElement("canvas");
      canvas.className = "sx-domain-wall";
      canvas.setAttribute("aria-hidden", "true");
      // own view-transition layer, drawn live above the revealed page
      canvas.style.viewTransitionName = "sx-domain-wall";

      const transition = document.startViewTransition(function () {
        toggleThemeSetting();
        document.body.appendChild(canvas);
      });

      const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

      transition.ready
        .then(function () {
          // sample the same easing for the reveal so the spin ring stays on the circle's edge
          const frames = [];
          for (let s = 0; s <= 24; s++) {
            frames.push({ clipPath: "circle(" + ease(s / 24) * end + "px at " + cx + "px " + cy + "px)" });
          }
          const reveal = document.documentElement.animate(frames, {
            duration: DURATION,
            easing: "linear",
            pseudoElement: "::view-transition-new(root)",
          });
          const colour = getComputedStyle(document.documentElement).getPropertyValue("--sx-accent").trim() || "#2563eb";
          // drive the spin ring from the reveal animation's own clock so both stay in step
          (function tick() {
            const t = Math.min(1, Math.max(0, (reveal.currentTime || 0) / DURATION));
            drawWall(canvas, cx, cy, ease(t) * end, colour);
            if (t < 1 && reveal.playState !== "finished") requestAnimationFrame(tick);
          })();
        })
        .catch(function () {});

      transition.finished.finally(function () {
        canvas.remove();
        active = false;
      });
    },
    true
  );
})();
