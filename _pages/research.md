---
layout: page
title: Research
permalink: /research/
nav: true
nav_order: 3
description: Research interests and current work.
math: true
---


<!-- HUBBARD_SHOWCASE_START -->

<style>
.hubbard-showcase {
  --interaction-level: 0.54;

  position: relative;
  margin: 0.5rem 0 3rem;
  padding: 2.5rem 1.35rem;
  overflow: hidden;
  border: 1px solid var(--global-divider-color);
  border-radius: 1rem;
  background:
    radial-gradient(
      circle at 50% 8%,
      rgba(75, 125, 210, 0.18),
      transparent 45%
    ),
    var(--global-card-bg-color);
  box-shadow: 0 10px 32px rgba(0, 0, 0, 0.11);
}

.hubbard-showcase::before {
  position: absolute;
  inset: -45%;
  pointer-events: none;
  background:
    repeating-radial-gradient(
      circle,
      transparent 0,
      transparent 31px,
      rgba(90, 145, 215, 0.045) 32px,
      transparent 34px
    );
  content: "";
  animation: hubbard-background-drift 24s linear infinite;
}

.hubbard-showcase-content {
  position: relative;
  z-index: 1;
}

.hubbard-heading {
  margin-bottom: 0.45rem;
  text-align: center;
  font-size: clamp(1.4rem, 3.2vw, 2.05rem);
  font-weight: 680;
}

.hubbard-subtitle {
  max-width: 760px;
  margin: 0 auto 1.6rem;
  color: var(--global-text-color-light);
  text-align: center;
  font-size: 0.96rem;
  line-height: 1.6;
}

.hubbard-equation {
  margin: 1.2rem auto 1.7rem;
  padding: 0.8rem 0.4rem;
  overflow-x: auto;
  opacity: 0;
  text-align: center;
  font-size: clamp(0.92rem, 2.2vw, 1.28rem);
  filter: blur(7px);
  transform: translateY(22px) scale(0.96);
}

.hubbard-parameters {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.65rem;
  margin-bottom: 1.4rem;
}

.parameter-chip {
  padding: 0.38rem 0.72rem;
  border: 1px solid var(--global-divider-color);
  border-radius: 999px;
  background: var(--global-bg-color);
  font-size: 0.84rem;
}

.hubbard-control {
  max-width: 580px;
  margin: 0 auto 1.5rem;
  padding: 0.9rem 1rem;
  border: 1px solid var(--global-divider-color);
  border-radius: 0.75rem;
  background: var(--global-bg-color);
}

.hubbard-control-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.55rem;
}

.hubbard-control label {
  margin: 0;
  font-weight: 650;
}

.hubbard-ratio {
  color: var(--global-theme-color);
  font-family: monospace;
  font-weight: 700;
}

.hubbard-slider {
  width: 100%;
  accent-color: var(--global-theme-color);
  cursor: pointer;
}

.hubbard-regime {
  margin-top: 0.45rem;
  color: var(--global-text-color-light);
  text-align: center;
  font-size: 0.82rem;
}

.hubbard-canvas-frame {
  position: relative;
  max-width: 860px;
  margin: 0 auto 2rem;
  padding: 0.6rem;
  overflow: hidden;
  border: 1px solid var(--global-divider-color);
  border-radius: 0.85rem;
  background:
    linear-gradient(
      135deg,
      rgba(60, 100, 180, 0.08),
      rgba(130, 75, 175, 0.06)
    ),
    var(--global-bg-color);
}

#hubbard-canvas {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 0.5rem;
}

.hubbard-canvas-caption {
  margin: 0.65rem 0 0.15rem;
  color: var(--global-text-color-light);
  text-align: center;
  font-size: 0.78rem;
  line-height: 1.45;
}

.emergence-flow {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0.3rem 0 1.3rem;
  opacity: 0;
  transform: translateY(-10px);
}

.emergence-line {
  width: 2px;
  height: 42px;
  background:
    linear-gradient(
      to bottom,
      var(--global-theme-color),
      transparent
    );
}

.emergence-arrow {
  color: var(--global-theme-color);
  font-size: 1.9rem;
  line-height: 1;
  animation: emergence-arrow-motion 1.7s ease-in-out infinite;
}

.phase-heading {
  margin-bottom: 0.5rem;
  opacity: 0;
  text-align: center;
  font-size: clamp(1.15rem, 2.5vw, 1.45rem);
  transform: translateY(14px);
}

.phase-description {
  max-width: 770px;
  margin: 0 auto 1.2rem;
  opacity: 0;
  color: var(--global-text-color-light);
  text-align: center;
  font-size: 0.85rem;
  line-height: 1.55;
  transform: translateY(14px);
}

.phase-cloud {
  display: flex;
  max-width: 930px;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.7rem;
  margin: auto;
}

.phase-pill {
  display: inline-flex;
  align-items: center;
  min-height: 2.55rem;
  padding: 0.52rem 0.9rem;
  opacity: 0;
  border: 1px solid var(--global-divider-color);
  border-radius: 999px;
  background: var(--global-bg-color);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.07);
  font-size: 0.87rem;
  transform: translateY(20px) scale(0.91);
  transition:
    border-color 230ms ease,
    box-shadow 230ms ease,
    opacity 230ms ease,
    transform 230ms ease;
}

.phase-pill::before {
  width: 0.43rem;
  height: 0.43rem;
  margin-right: 0.48rem;
  border-radius: 50%;
  background: var(--global-theme-color);
  content: "";
}

.phase-pill.is-highlighted {
  opacity: 1 !important;
  border-color: var(--global-theme-color);
  box-shadow:
    0 0 0 3px rgba(80, 130, 205, 0.13),
    0 7px 18px rgba(0, 0, 0, 0.11);
  transform: translateY(-2px) scale(1.02) !important;
}

.hubbard-showcase.is-visible .hubbard-equation {
  animation: reveal-hubbard-equation 1s ease forwards;
}

.hubbard-showcase.is-visible .emergence-flow {
  animation: reveal-hubbard-item 0.65s ease 0.85s forwards;
}

.hubbard-showcase.is-visible .phase-heading {
  animation: reveal-hubbard-item 0.65s ease 1.1s forwards;
}

.hubbard-showcase.is-visible .phase-description {
  animation: reveal-hubbard-item 0.65s ease 1.28s forwards;
}

.hubbard-showcase.is-visible .phase-pill {
  animation:
    reveal-phase-pill
    0.6s
    cubic-bezier(0.2, 0.75, 0.25, 1)
    calc(1.45s + var(--phase-delay))
    forwards;
}

@keyframes reveal-hubbard-equation {
  from {
    opacity: 0;
    filter: blur(7px);
    transform: translateY(22px) scale(0.96);
  }

  to {
    opacity: 1;
    filter: blur(0);
    transform: translateY(0) scale(1);
  }
}

@keyframes reveal-hubbard-item {
  from {
    opacity: 0;
    transform: translateY(14px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes reveal-phase-pill {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.91);
  }

  to {
    opacity: 0.76;
    transform: translateY(0) scale(1);
  }
}

@keyframes emergence-arrow-motion {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(7px);
  }
}

@keyframes hubbard-background-drift {
  from {
    transform: translate(-4%, -3%) rotate(0deg);
  }

  to {
    transform: translate(5%, 4%) rotate(15deg);
  }
}

@media (max-width: 620px) {
  .hubbard-showcase {
    padding: 2rem 0.7rem;
  }

  .hubbard-equation {
    font-size: 0.86rem;
  }

  .phase-cloud {
    gap: 0.5rem;
  }

  .phase-pill {
    padding: 0.45rem 0.65rem;
    font-size: 0.79rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hubbard-showcase::before,
  .emergence-arrow {
    animation: none;
  }

  .hubbard-equation,
  .emergence-flow,
  .phase-heading,
  .phase-description,
  .phase-pill {
    opacity: 1 !important;
    filter: none !important;
    transform: none !important;
    animation: none !important;
  }
}
</style>

<section
  id="hubbard-showcase"
  class="hubbard-showcase"
  aria-labelledby="hubbard-heading"
>
  <div class="hubbard-showcase-content">
    <h2
      id="hubbard-heading"
      class="hubbard-heading"
    >
      The Hubbard Model: From Electron Hopping to Emergent Quantum Matter
    </h2>

    <p class="hubbard-subtitle">
      The competition between electron delocalization and local Coulomb
      repulsion can transform a deceptively simple lattice model into a rich
      landscape of correlated quantum phases.
    </p>

    <div
      class="hubbard-equation"
      aria-label="The Hubbard model Hamiltonian"
    >
      \[
      H_{\mathrm{Hub}}
      =
      \underbrace{
      -t\sum_{\langle i,j\rangle,\sigma}
      \left(
      c^{\dagger}_{i\sigma}c_{j\sigma}
      + \mathrm{h.c.}
      \right)
      }_{\text{electron hopping}}
      +
      \underbrace{
      U\sum_i n_{i\uparrow}n_{i\downarrow}
      }_{\text{on-site repulsion}} .
      \]
    </div>

    <div class="hubbard-parameters">
      <span class="parameter-chip">
        \(t\): hopping amplitude
      </span>

      <span class="parameter-chip">
        \(U\): on-site interaction
      </span>

      <span class="parameter-chip">
        \(U/t\): correlation strength
      </span>
    </div>

    <div class="hubbard-control">
      <div class="hubbard-control-header">
        <label for="hubbard-slider">
          Tune the interaction ratio
        </label>

        <span
          id="hubbard-ratio"
          class="hubbard-ratio"
        >
          U/t = 6.5
        </span>
      </div>

      <input
        id="hubbard-slider"
        class="hubbard-slider"
        type="range"
        min="0"
        max="12"
        step="0.5"
        value="6.5"
        aria-label="Interaction strength U divided by t"
      >

      <div
        id="hubbard-regime"
        class="hubbard-regime"
      >
        Intermediate-coupling regime
      </div>
    </div>

    <div class="hubbard-canvas-frame">
      <canvas
        id="hubbard-canvas"
        width="900"
        height="360"
        aria-label="Animated electrons hopping through a square lattice"
      ></canvas>

      <p class="hubbard-canvas-caption">
        Red and blue particles represent opposite spin projections.
        Increasing \(U/t\) slows charge motion and strengthens local
        interaction effects.
      </p>
    </div>

    <div
      class="emergence-flow"
      aria-hidden="true"
    >
      <div class="emergence-line"></div>
      <div class="emergence-arrow">↓</div>
    </div>

    <h3 class="phase-heading">
      Emergent phases and collective phenomena
    </h3>

    <p class="phase-description">
      The realized state depends on interaction strength, filling, lattice
      geometry, dimensionality, symmetry, and additional microscopic terms.
      The possibilities below represent outcomes of Hubbard-type and extended
      correlated-electron models.
    </p>

    <div class="phase-cloud">
      <span
        class="phase-pill"
        data-regime="weak"
        style="--phase-delay: 0.00s"
      >
        Correlated metals
      </span>

      <span
        class="phase-pill"
        data-regime="strong"
        style="--phase-delay: 0.10s"
      >
        Antiferromagnetism
      </span>

      <span
        class="phase-pill"
        data-regime="strong"
        style="--phase-delay: 0.20s"
      >
        Altermagnetism
      </span>

      <span
        class="phase-pill"
        data-regime="intermediate"
        style="--phase-delay: 0.30s"
      >
        Unconventional superconductivity
      </span>

      <span
        class="phase-pill"
        data-regime="strong"
        style="--phase-delay: 0.40s"
      >
        Mott insulating states
      </span>

      <span
        class="phase-pill"
        data-regime="strong"
        style="--phase-delay: 0.50s"
      >
        Charge order
      </span>

      <span
        class="phase-pill"
        data-regime="strong"
        style="--phase-delay: 0.60s"
      >
        Spin order
      </span>

      <span
        class="phase-pill"
        data-regime="intermediate"
        style="--phase-delay: 0.70s"
      >
        Nematic phases
      </span>

      <span
        class="phase-pill"
        data-regime="intermediate"
        style="--phase-delay: 0.80s"
      >
        Quantum criticality
      </span>

      <span
        class="phase-pill"
        data-regime="intermediate"
        style="--phase-delay: 0.90s"
      >
        Non-Fermi liquids
      </span>

      <span
        class="phase-pill"
        data-regime="intermediate"
        style="--phase-delay: 1.00s"
      >
        Topological phases
      </span>

      <span
        class="phase-pill"
        data-regime="strong"
        style="--phase-delay: 1.10s"
      >
        Fractionalized states
      </span>

      <span
        class="phase-pill"
        data-regime="weak"
        style="--phase-delay: 1.20s"
      >
        Collective excitations
      </span>
    </div>
  </div>
</section>

<script>
(function () {
  function initialiseHubbardAnimation() {
    const section = document.getElementById("hubbard-showcase");
    const canvas = document.getElementById("hubbard-canvas");
    const slider = document.getElementById("hubbard-slider");
    const ratioLabel = document.getElementById("hubbard-ratio");
    const regimeLabel = document.getElementById("hubbard-regime");

    if (
      !section ||
      !canvas ||
      !slider ||
      !ratioLabel ||
      !regimeLabel
    ) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    const phases = Array.from(
      section.querySelectorAll(".phase-pill")
    );

    const columns = 7;
    const rows = 3;
    const paddingX = 90;
    const paddingY = 70;

    let running = true;
    let lastTime = 0;
    let interactionRatio = Number(slider.value);

    const sites = [];
    const edges = [];

    function siteIndex(row, column) {
      return row * columns + column;
    }

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const x =
          paddingX
          + column
          * ((canvas.width - 2 * paddingX) / (columns - 1));

        const y =
          paddingY
          + row
          * ((canvas.height - 2 * paddingY) / (rows - 1));

        sites.push({ x, y });

        if (column < columns - 1) {
          edges.push([
            siteIndex(row, column),
            siteIndex(row, column + 1)
          ]);
        }

        if (row < rows - 1) {
          edges.push([
            siteIndex(row, column),
            siteIndex(row + 1, column)
          ]);
        }
      }
    }

    function randomEdge() {
      return edges[Math.floor(Math.random() * edges.length)];
    }

    function makeElectron(spin, offset) {
      const edge = randomEdge();

      return {
        spin,
        edge,
        progress: offset,
        direction: Math.random() > 0.5 ? 1 : -1,
        radius: spin === "up" ? 8 : 7
      };
    }

    const electrons = [
      makeElectron("up", 0.10),
      makeElectron("down", 0.38),
      makeElectron("up", 0.66),
      makeElectron("down", 0.84),
      makeElectron("up", 0.51),
      makeElectron("down", 0.23)
    ];

    function getThemeColours() {
      const styles = getComputedStyle(document.documentElement);

      return {
        text:
          styles.getPropertyValue("--global-text-color").trim()
          || "#777777",
        background:
          styles.getPropertyValue("--global-bg-color").trim()
          || "#ffffff",
        theme:
          styles.getPropertyValue("--global-theme-color").trim()
          || "#3879d9"
      };
    }

    function classifyRegime(value) {
      if (value < 4) {
        return {
          name: "weak",
          label: "Itinerant and weak-coupling regime"
        };
      }

      if (value < 8) {
        return {
          name: "intermediate",
          label: "Intermediate-coupling regime"
        };
      }

      return {
        name: "strong",
        label: "Strong-coupling and localization regime"
      };
    }

    function updateControls() {
      interactionRatio = Number(slider.value);

      const regime = classifyRegime(interactionRatio);

      ratioLabel.textContent =
        `U/t = ${interactionRatio.toFixed(1)}`;

      regimeLabel.textContent = regime.label;

      section.style.setProperty(
        "--interaction-level",
        Math.min(interactionRatio / 12, 1).toFixed(3)
      );

      phases.forEach(function (phase) {
        phase.classList.toggle(
          "is-highlighted",
          phase.dataset.regime === regime.name
        );
      });
    }

    function chooseNewEdge(electron) {
      electron.edge = randomEdge();
      electron.progress =
        electron.direction > 0 ? 0 : 1;
    }

    function updateElectrons(deltaSeconds) {
      const speed =
        0.58 / (1 + interactionRatio * 0.085);

      electrons.forEach(function (electron, index) {
        electron.progress +=
          electron.direction
          * speed
          * deltaSeconds
          * (0.86 + index * 0.045);

        if (electron.progress >= 1) {
          electron.direction =
            Math.random() > 0.35 ? 1 : -1;

          chooseNewEdge(electron);
        }

        if (electron.progress <= 0) {
          electron.direction =
            Math.random() > 0.35 ? 1 : -1;

          chooseNewEdge(electron);
        }
      });
    }

    function drawLattice(colours) {
      context.lineWidth = 2;
      context.strokeStyle = colours.text;
      context.globalAlpha = 0.17;

      edges.forEach(function (edge) {
        const start = sites[edge[0]];
        const end = sites[edge[1]];

        context.beginPath();
        context.moveTo(start.x, start.y);
        context.lineTo(end.x, end.y);
        context.stroke();
      });

      context.globalAlpha = 1;

      sites.forEach(function (site) {
        context.beginPath();
        context.arc(site.x, site.y, 15, 0, Math.PI * 2);
        context.strokeStyle = colours.theme;
        context.globalAlpha = 0.22;
        context.lineWidth = 1;
        context.stroke();

        context.beginPath();
        context.arc(site.x, site.y, 6.5, 0, Math.PI * 2);
        context.fillStyle = colours.background;
        context.globalAlpha = 1;
        context.fill();

        context.strokeStyle = colours.theme;
        context.lineWidth = 2;
        context.stroke();
      });
    }

    function drawInteractionHalo(time, colours) {
      const centre = sites[siteIndex(1, 3)];
      const level = interactionRatio / 12;
      const pulse =
        1 + 0.16 * Math.sin(time * 0.004);

      const radius =
        (23 + level * 25) * pulse;

      const gradient = context.createRadialGradient(
        centre.x,
        centre.y,
        4,
        centre.x,
        centre.y,
        radius
      );

      gradient.addColorStop(
        0,
        `rgba(166, 107, 221, ${0.24 + level * 0.28})`
      );

      gradient.addColorStop(
        1,
        "rgba(166, 107, 221, 0)"
      );

      context.beginPath();
      context.arc(
        centre.x,
        centre.y,
        radius,
        0,
        Math.PI * 2
      );

      context.fillStyle = gradient;
      context.fill();

      context.beginPath();
      context.arc(
        centre.x,
        centre.y,
        21 + level * 9,
        0,
        Math.PI * 2
      );

      context.strokeStyle = colours.theme;
      context.globalAlpha = 0.25 + level * 0.55;
      context.lineWidth = 2.5;
      context.stroke();
      context.globalAlpha = 1;
    }

    function drawElectrons() {
      electrons.forEach(function (electron) {
        const start = sites[electron.edge[0]];
        const end = sites[electron.edge[1]];

        const progress = Math.max(
          0,
          Math.min(1, electron.progress)
        );

        const x =
          start.x + (end.x - start.x) * progress;

        const y =
          start.y + (end.y - start.y) * progress;

        context.save();

        context.shadowBlur = 12;
        context.shadowColor =
          electron.spin === "up"
            ? "rgba(217, 72, 95, 0.8)"
            : "rgba(56, 121, 217, 0.8)";

        context.beginPath();
        context.arc(
          x,
          y,
          electron.radius,
          0,
          Math.PI * 2
        );

        context.fillStyle =
          electron.spin === "up"
            ? "#d9485f"
            : "#3879d9";

        context.fill();

        context.lineWidth = 1.2;
        context.strokeStyle = "#ffffff";
        context.stroke();

        context.restore();

        context.fillStyle = "#ffffff";
        context.font = "bold 10px sans-serif";
        context.textAlign = "center";
        context.textBaseline = "middle";

        context.fillText(
          electron.spin === "up" ? "↑" : "↓",
          x,
          y + 0.5
        );
      });
    }

    function draw(time) {
      const colours = getThemeColours();

      context.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      drawLattice(colours);
      drawInteractionHalo(time, colours);
      drawElectrons();
    }

    function animate(time) {
      if (!running) {
        lastTime = time;
        requestAnimationFrame(animate);
        return;
      }

      const deltaSeconds =
        lastTime === 0
          ? 0
          : Math.min((time - lastTime) / 1000, 0.05);

      lastTime = time;

      updateElectrons(deltaSeconds);
      draw(time);

      requestAnimationFrame(animate);
    }

    slider.addEventListener("input", updateControls);

    updateControls();
    requestAnimationFrame(animate);

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (
      reducedMotion ||
      !("IntersectionObserver" in window)
    ) {
      section.classList.add("is-visible");

      if (reducedMotion) {
        running = false;
        draw(0);
      }

      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          running = entry.isIntersecting;

          if (entry.isIntersecting) {
            section.classList.add("is-visible");
          }
        });
      },
      {
        threshold: 0.15
      }
    );

    observer.observe(section);
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initialiseHubbardAnimation
    );
  } else {
    initialiseHubbardAnimation();
  }
})();
</script>

<!-- HUBBARD_SHOWCASE_END -->

## Research interests

My research focuses on **strongly correlated quantum systems**, where
interactions between electrons produce collective phenomena that cannot be
captured by a simple single-particle description. I am particularly
interested in interaction-driven quantum phases, unconventional
superconductivity, and the relationship between electronic correlations and
superconducting pairing symmetries.

Another major direction of my work concerns **altermagnetic systems** and
topological quantum matter. I investigate how lattice symmetry, sublattice
structure, electronic interactions, and magnetic order generate unusual
momentum-dependent spin structures and collective excitations. I am also
interested in topological phenomena in Hermitian, non-Hermitian,
superconducting, and periodically driven systems.

My work on **quantum transport** explores electronic and superconducting
transport in low-dimensional systems using scattering theory, tight-binding
models, and numerical simulations. My current research combines slave-boson
descriptions of correlated fermions with studies of unconventional
superconductivity, collective excitations in correlated altermagnetic
systems, and transport phenomena in quantum materials.
