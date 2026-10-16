// Site-wide behaviour: name pronunciation (with a wave-packet animation) and lightweight section reveal.
(function () {
  // Free Gaussian wave packet (hbar = m = 1) drawn along the native name while the recording plays:
  //   psi(x,t) = (2 pi s0^2)^(-1/4) (1 + i tau)^(-1/2) exp[-(x - k0 t)^2 / (4 s0^2 (1 + i tau)) + i k0 (x - k0 t/2)],
  //   tau = t / (2 s0^2). Checked against exact propagation in bin/animation_physics_check.py.
  function createPacket(name) {
    const canvas = name && name.querySelector(".sx-packet");
    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return null;
    }
    const ctx = canvas.getContext("2d");
    const S0 = 1.2;
    const K0 = 3.0;
    const X0 = -4;
    const X1 = 34;
    const T_END = 10;
    let raf = 0;

    function psi(x, t) {
      const tau = t / (2 * S0 * S0);
      const d = x - K0 * t;
      const den = 4 * S0 * S0 * (1 + tau * tau);
      const amp = Math.pow(2 * Math.PI * S0 * S0, -0.25) * Math.pow(1 + tau * tau, -0.25) * Math.exp((-d * d) / den);
      const phase = (d * d * tau) / den + K0 * (x - (K0 * t) / 2) - 0.5 * Math.atan(tau);
      return [amp * Math.cos(phase), amp];
    }

    function draw(t) {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas.width !== Math.round(r.width * dpr)) {
        canvas.width = Math.round(r.width * dpr);
        canvas.height = Math.round(r.height * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const w = r.width;
      const h = r.height;
      const base = h - 7;
      const scale = 7 / Math.pow(2 * Math.PI * S0 * S0, -0.25);
      const accent = getComputedStyle(document.documentElement).getPropertyValue("--sx-accent").trim() || "#2563eb";
      const teal = getComputedStyle(document.documentElement).getPropertyValue("--sx-accent-2").trim() || "#0d9488";
      ctx.clearRect(0, 0, w, h);
      // |psi| envelope (filled) and Re psi (line)
      ctx.globalAlpha = 0.18;
      ctx.fillStyle = teal;
      ctx.beginPath();
      ctx.moveTo(0, base);
      for (let px = 0; px <= w; px += 1) {
        const v = psi(X0 + ((X1 - X0) * px) / w, t);
        ctx.lineTo(px, base - v[1] * scale);
      }
      for (let px = w; px >= 0; px -= 1) {
        const v = psi(X0 + ((X1 - X0) * px) / w, t);
        ctx.lineTo(px, base + v[1] * scale);
      }
      ctx.fill();
      ctx.globalAlpha = 0.9;
      ctx.strokeStyle = accent;
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      for (let px = 0; px <= w; px += 0.5) {
        const v = psi(X0 + ((X1 - X0) * px) / w, t);
        if (px === 0) ctx.moveTo(px, base - v[0] * scale);
        else ctx.lineTo(px, base - v[0] * scale);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
      // text highlight follows the probability peak
      const centre = (K0 * t - X0) / (X1 - X0);
      const width = (S0 * Math.sqrt(1 + Math.pow(t / (2 * S0 * S0), 2)) * 2.2) / (X1 - X0);
      name.style.setProperty("--packet-x", (centre * 100).toFixed(2) + "%");
      name.style.setProperty("--packet-w", (width * 100).toFixed(2) + "%");
    }

    return {
      start: function (audio) {
        cancelAnimationFrame(raf);
        name.classList.add("is-playing");
        const loop = function () {
          const dur = isFinite(audio.duration) && audio.duration > 0 ? audio.duration : 2.6;
          draw(Math.min(T_END, (T_END * audio.currentTime) / dur));
          if (!audio.paused && !audio.ended) {
            raf = requestAnimationFrame(loop);
          }
        };
        raf = requestAnimationFrame(loop);
      },
      stop: function () {
        cancelAnimationFrame(raf);
        name.classList.remove("is-playing");
        const r = canvas.getBoundingClientRect();
        ctx.clearRect(0, 0, r.width, r.height);
      },
    };
  }

  function initPronunciation() {
    const button = document.querySelector(".sx-pronounce");

    if (!button) {
      return;
    }

    const audio = new Audio(button.dataset.audio);
    audio.preload = "none";
    const packet = createPacket(document.querySelector(".sx-native-name"));

    function setStopped() {
      button.classList.remove("is-speaking");
      button.setAttribute("aria-pressed", "false");
      if (packet) packet.stop();
    }

    button.addEventListener("click", async function () {
      try {
        if (!audio.paused) {
          audio.pause();
          audio.currentTime = 0;
          setStopped();
          return;
        }

        audio.currentTime = 0;
        button.classList.add("is-speaking");
        button.setAttribute("aria-pressed", "true");
        await audio.play();
        if (packet) packet.start(audio);
      } catch (error) {
        setStopped();
        console.error("Could not play the recorded pronunciation:", error);
      }
    });

    audio.addEventListener("ended", setStopped);
    audio.addEventListener("error", setStopped);
  }

  // Elements marked .sx-reveal fade in once when scrolled into view. Content is visible by
  // default; the hidden state only applies once this script has run (html.sx-reveal-ready).
  function initReveal() {
    const items = document.querySelectorAll(".sx-reveal");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!items.length || reduced || !("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );

    items.forEach(function (item) {
      const rect = item.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        item.classList.add("is-visible");
      } else {
        observer.observe(item);
      }
    });

    document.documentElement.classList.add("sx-reveal-ready");
  }

  function init() {
    initPronunciation();
    initReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
