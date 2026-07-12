---
layout: page
title: Spotlight
permalink: /spotlight/
nav: true
nav_order: 5
description: A playful collection of academic statistics and research-life visualizations.
---

<style>
.academic-phase-section {
  --phase-accent: var(--global-theme-color);

  margin: 0.5rem 0 3rem;
}

.spotlight-introduction {
  max-width: 760px;
  margin-bottom: 2rem;
  color: var(--global-text-color-light);
  line-height: 1.65;
}

.phase-diagram-card {
  padding: clamp(1rem, 3vw, 2rem);
  overflow: hidden;
  border: 1px solid var(--global-divider-color);
  border-radius: 1rem;
  background:
    radial-gradient(
      circle at 50% 10%,
      color-mix(
        in srgb,
        var(--phase-accent) 13%,
        transparent
      ),
      transparent 48%
    ),
    var(--global-card-bg-color);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.10);
}

.phase-diagram-header {
  margin-bottom: 1.5rem;
  text-align: center;
}

.phase-diagram-header h2 {
  margin-bottom: 0.45rem;
  font-size: clamp(1.45rem, 3vw, 2rem);
}

.phase-diagram-header p {
  max-width: 680px;
  margin: auto;
  color: var(--global-text-color-light);
  line-height: 1.55;
}

.phase-fiction-note {
  display: inline-block;
  margin-top: 0.8rem;
  padding: 0.3rem 0.65rem;
  border: 1px solid var(--global-divider-color);
  border-radius: 999px;
  font-size: 0.75rem;
}

.phase-diagram-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(240px, 0.7fr);
  gap: 1.6rem;
  align-items: center;
}

.academic-phase-plane {
  position: relative;
  width: 100%;
  aspect-ratio: 1.35 / 1;
  min-height: 390px;
  overflow: visible;
  border: 1px solid var(--global-divider-color);
  border-radius: 0.8rem;
  background:
    linear-gradient(
      to right,
      transparent 49.8%,
      var(--global-divider-color) 49.8%,
      var(--global-divider-color) 50.2%,
      transparent 50.2%
    ),
    linear-gradient(
      to bottom,
      transparent 49.8%,
      var(--global-divider-color) 49.8%,
      var(--global-divider-color) 50.2%,
      transparent 50.2%
    ),
    linear-gradient(
      135deg,
      color-mix(
        in srgb,
        var(--phase-accent) 7%,
        transparent
      ),
      transparent
    ),
    var(--global-bg-color);
}

.phase-quadrant {
  position: absolute;
  width: 44%;
  padding: 0.55rem;
  color: var(--global-text-color-light);
  font-size: clamp(0.78rem, 1.8vw, 0.95rem);
  line-height: 1.35;
}

.phase-quadrant strong {
  display: block;
  margin-bottom: 0.2rem;
  color: var(--global-text-color);
  font-size: 1.02em;
}

.phase-productive {
  top: 8%;
  left: 5%;
  text-align: left;
}

.phase-debugging {
  top: 8%;
  right: 5%;
  text-align: right;
}

.phase-reading {
  bottom: 8%;
  left: 5%;
  text-align: left;
}

.phase-critical {
  right: 5%;
  bottom: 8%;
  text-align: right;
}

.phase-axis-label {
  position: absolute;
  z-index: 3;
  padding: 0.18rem 0.42rem;
  color: var(--global-text-color-light);
  background: var(--global-card-bg-color);
  font-size: clamp(0.68rem, 1.6vw, 0.78rem);
  font-weight: 600;
  letter-spacing: 0.02em;
  white-space: nowrap;
}

.phase-axis-high-caffeine {
  top: -0.9rem;
  left: 50%;
  transform: translateX(-50%);
}

.phase-axis-low-caffeine {
  bottom: -0.9rem;
  left: 50%;
  transform: translateX(-50%);
}

.phase-axis-low-deadline {
  top: 50%;
  left: -0.75rem;
  transform: translate(-50%, -50%) rotate(-90deg);
}

.phase-axis-high-deadline {
  top: 50%;
  right: -0.75rem;
  transform: translate(50%, -50%) rotate(90deg);
}

.phase-axis-arrow-up,
.phase-axis-arrow-right {
  position: absolute;
  z-index: 2;
  color: var(--phase-accent);
  font-size: 1.3rem;
  line-height: 1;
}

.phase-axis-arrow-up {
  top: -0.1rem;
  left: calc(50% - 0.37rem);
}

.phase-axis-arrow-right {
  top: calc(50% - 0.65rem);
  right: 0.2rem;
}

.phase-cross-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 26%;
  aspect-ratio: 1;
  pointer-events: none;
  border-radius: 50%;
  background:
    radial-gradient(
      circle,
      color-mix(
        in srgb,
        var(--phase-accent) 18%,
        transparent
      ),
      transparent 70%
    );
  transform: translate(-50%, -50%);
  animation: critical-glow 3s ease-in-out infinite;
}

.academic-state-marker {
  position: absolute;
  z-index: 10;
  left: 36%;
  bottom: 68%;
  width: 1.15rem;
  height: 1.15rem;
  cursor: grab;
  border: 3px solid var(--global-bg-color);
  border-radius: 50%;
  background: var(--phase-accent);
  box-shadow:
    0 0 0 3px
      color-mix(
        in srgb,
        var(--phase-accent) 25%,
        transparent
      ),
    0 5px 14px rgba(0, 0, 0, 0.24);
  transform: translate(-50%, 50%);
  transition:
    left 260ms ease,
    bottom 260ms ease,
    box-shadow 200ms ease;
}

.academic-state-marker:hover {
  box-shadow:
    0 0 0 7px
      color-mix(
        in srgb,
        var(--phase-accent) 18%,
        transparent
      ),
    0 7px 17px rgba(0, 0, 0, 0.28);
}

.academic-state-marker.is-dragging {
  cursor: grabbing;
  transition: none;
}

.marker-label {
  position: absolute;
  left: 50%;
  bottom: 1.7rem;
  width: max-content;
  max-width: 170px;
  padding: 0.35rem 0.55rem;
  color: var(--global-text-color);
  border: 1px solid var(--global-divider-color);
  border-radius: 0.4rem;
  background: var(--global-card-bg-color);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.13);
  font-size: 0.72rem;
  font-weight: 650;
  text-align: center;
  transform: translateX(-50%);
}

.phase-controls {
  padding: 1.1rem;
  border: 1px solid var(--global-divider-color);
  border-radius: 0.8rem;
  background: var(--global-bg-color);
}

.phase-status {
  margin-bottom: 1.3rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--global-divider-color);
}

.phase-status-label {
  margin-bottom: 0.25rem;
  color: var(--global-text-color-light);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.phase-status-value {
  color: var(--phase-accent);
  font-size: 1.1rem;
  font-weight: 700;
}

.phase-status-description {
  margin: 0.45rem 0 0;
  color: var(--global-text-color-light);
  font-size: 0.82rem;
  line-height: 1.45;
}

.phase-control-group {
  margin-bottom: 1.2rem;
}

.phase-control-heading {
  display: flex;
  justify-content: space-between;
  gap: 0.7rem;
  margin-bottom: 0.45rem;
  font-size: 0.82rem;
  font-weight: 650;
}

.phase-control-value {
  color: var(--phase-accent);
  font-family: monospace;
}

.phase-slider {
  width: 100%;
  accent-color: var(--phase-accent);
  cursor: pointer;
}

.phase-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.phase-button {
  flex: 1 1 110px;
  padding: 0.55rem 0.7rem;
  color: var(--global-text-color);
  cursor: pointer;
  border: 1px solid var(--global-divider-color);
  border-radius: 0.55rem;
  background: var(--global-card-bg-color);
  font-size: 0.78rem;
  font-weight: 600;
  transition:
    border-color 180ms ease,
    transform 180ms ease,
    box-shadow 180ms ease;
}

.phase-button:hover {
  border-color: var(--phase-accent);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.09);
  transform: translateY(-1px);
}

.phase-button.is-active {
  color: var(--phase-accent);
  border-color: var(--phase-accent);
}

.phase-caption {
  margin: 1.25rem auto 0;
  color: var(--global-text-color-light);
  font-size: 0.74rem;
  line-height: 1.45;
  text-align: center;
}

@keyframes critical-glow {
  0%,
  100% {
    opacity: 0.45;
    transform: translate(-50%, -50%) scale(0.88);
  }

  50% {
    opacity: 0.9;
    transform: translate(-50%, -50%) scale(1.16);
  }
}

@media (max-width: 800px) {
  .phase-diagram-layout {
    grid-template-columns: 1fr;
  }

  .academic-phase-plane {
    min-height: 340px;
  }
}

@media (max-width: 520px) {
  .academic-phase-plane {
    min-height: 310px;
  }

  .phase-quadrant {
    width: 46%;
    font-size: 0.7rem;
  }

  .phase-axis-low-deadline,
  .phase-axis-high-deadline {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .phase-cross-glow {
    animation: none;
  }

  .academic-state-marker,
  .phase-button {
    transition: none;
  }
}
</style>

<section
  class="academic-phase-section"
  aria-labelledby="academic-phase-title"
>
  <p class="spotlight-introduction">
    This page collects playful visualizations and unusual statistics inspired
    by academic life, theoretical physics, and the occasionally nonlinear
    dynamics of research.
  </p>

  <div class="phase-diagram-card">
    <header class="phase-diagram-header">
      <h2 id="academic-phase-title">
        Academic Phase Diagram
      </h2>

      <p>
        A fictional map of my working state, controlled by two important
        parameters: caffeine and deadline pressure.
      </p>

      <span class="phase-fiction-note">
        Humorous visualization — not a peer-reviewed phase diagram
      </span>
    </header>

    <div class="phase-diagram-layout">
      <div
        id="academic-phase-plane"
        class="academic-phase-plane"
        aria-label="Academic phase diagram with caffeine and deadline pressure axes"
      >
        <span class="phase-axis-label phase-axis-high-caffeine">
          High caffeine
        </span>

        <span class="phase-axis-label phase-axis-low-caffeine">
          Low caffeine
        </span>

        <span class="phase-axis-label phase-axis-low-deadline">
          Low deadline pressure
        </span>

        <span class="phase-axis-label phase-axis-high-deadline">
          High deadline pressure
        </span>

        <span
          class="phase-axis-arrow-up"
          aria-hidden="true"
        >
          ↑
        </span>

        <span
          class="phase-axis-arrow-right"
          aria-hidden="true"
        >
          →
        </span>

        <div class="phase-cross-glow"></div>

        <div class="phase-quadrant phase-productive">
          <strong>Productive phase</strong>
          Calculations converge and notation remains consistent.
        </div>

        <div class="phase-quadrant phase-debugging">
          <strong>Debugging at 2 a.m.</strong>
          High urgency, high caffeine, uncertain boundary conditions.
        </div>

        <div class="phase-quadrant phase-reading">
          <strong>Reading papers</strong>
          Low-energy exploration of the literature.
        </div>

        <div class="phase-quadrant phase-critical">
          <strong>Quantum critical regime</strong>
          Deadline-driven fluctuations dominate all observables.
        </div>

        <button
          id="academic-state-marker"
          class="academic-state-marker"
          type="button"
          aria-label="Current academic state"
        >
          <span
            id="marker-label"
            class="marker-label"
          >
            Productive phase
          </span>
        </button>
      </div>

      <aside class="phase-controls">
        <div class="phase-status">
          <div class="phase-status-label">
            Current working state
          </div>

          <div
            id="phase-status-value"
            class="phase-status-value"
          >
            Productive phase
          </div>

          <p
            id="phase-status-description"
            class="phase-status-description"
          >
            A stable region where calculations, writing, and coffee coexist.
          </p>
        </div>

        <div class="phase-control-group">
          <div class="phase-control-heading">
            <label for="caffeine-slider">
              Caffeine level
            </label>

            <span
              id="caffeine-value"
              class="phase-control-value"
            >
              68%
            </span>
          </div>

          <input
            id="caffeine-slider"
            class="phase-slider"
            type="range"
            min="0"
            max="100"
            value="68"
            aria-label="Caffeine level"
          >
        </div>

        <div class="phase-control-group">
          <div class="phase-control-heading">
            <label for="deadline-slider">
              Deadline pressure
            </label>

            <span
              id="deadline-value"
              class="phase-control-value"
            >
              36%
            </span>
          </div>

          <input
            id="deadline-slider"
            class="phase-slider"
            type="range"
            min="0"
            max="100"
            value="36"
            aria-label="Deadline pressure"
          >
        </div>

        <div class="phase-buttons">
          <button
            id="phase-evolve-button"
            class="phase-button"
            type="button"
          >
            Let the system evolve
          </button>

          <button
            id="phase-reset-button"
            class="phase-button"
            type="button"
          >
            Reset state
          </button>
        </div>
      </aside>
    </div>

    <p class="phase-caption">
      The phase boundaries fluctuate with sleep, referee reports, compiler
      errors, and proximity to conference deadlines.
    </p>
  </div>
</section>

<script>
(function () {
  function initialiseAcademicPhaseDiagram() {
    const plane = document.getElementById("academic-phase-plane");
    const marker = document.getElementById("academic-state-marker");
    const markerLabel = document.getElementById("marker-label");

    const caffeineSlider =
      document.getElementById("caffeine-slider");

    const deadlineSlider =
      document.getElementById("deadline-slider");

    const caffeineValue =
      document.getElementById("caffeine-value");

    const deadlineValue =
      document.getElementById("deadline-value");

    const statusValue =
      document.getElementById("phase-status-value");

    const statusDescription =
      document.getElementById("phase-status-description");

    const evolveButton =
      document.getElementById("phase-evolve-button");

    const resetButton =
      document.getElementById("phase-reset-button");

    if (
      !plane ||
      !marker ||
      !caffeineSlider ||
      !deadlineSlider
    ) {
      return;
    }

    let evolutionTimer = null;
    let evolutionTime = 0;
    let dragging = false;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    function classifyState(caffeine, deadline) {
      const nearCentre =
        Math.abs(caffeine - 50) < 8 &&
        Math.abs(deadline - 50) < 8;

      if (nearCentre) {
        return {
          name: "Critical crossover",
          description:
            "Small changes in coffee or deadlines produce very large responses."
        };
      }

      if (caffeine >= 50 && deadline < 50) {
        return {
          name: "Productive phase",
          description:
            "A stable region where calculations, writing, and coffee coexist."
        };
      }

      if (caffeine >= 50 && deadline >= 50) {
        return {
          name: "Debugging at 2 a.m.",
          description:
            "High urgency and high caffeine generate strongly nonlinear behaviour."
        };
      }

      if (caffeine < 50 && deadline < 50) {
        return {
          name: "Reading papers",
          description:
            "A low-energy exploratory state dominated by literature and note-taking."
        };
      }

      return {
        name: "Quantum critical regime",
        description:
          "Deadline-driven fluctuations dominate while the correlation length diverges."
      };
    }

    function updateState() {
      const caffeine = Number(caffeineSlider.value);
      const deadline = Number(deadlineSlider.value);
      const state = classifyState(caffeine, deadline);

      marker.style.left = `${deadline}%`;
      marker.style.bottom = `${caffeine}%`;

      caffeineValue.textContent = `${caffeine}%`;
      deadlineValue.textContent = `${deadline}%`;

      markerLabel.textContent = state.name;
      statusValue.textContent = state.name;
      statusDescription.textContent = state.description;
    }

    function stopEvolution() {
      if (evolutionTimer !== null) {
        window.clearInterval(evolutionTimer);
        evolutionTimer = null;
      }

      evolveButton.classList.remove("is-active");
      evolveButton.textContent = "Let the system evolve";
    }

    function startEvolution() {
      if (reducedMotion) {
        return;
      }

      stopEvolution();

      evolveButton.classList.add("is-active");
      evolveButton.textContent = "Pause evolution";

      evolutionTimer = window.setInterval(function () {
        evolutionTime += 0.13;

        const caffeine =
          54
          + 31 * Math.sin(evolutionTime * 0.72)
          + 10 * Math.sin(evolutionTime * 1.91);

        const deadline =
          50
          + 38 * Math.sin(evolutionTime * 0.39 + 1.3);

        caffeineSlider.value = Math.round(
          Math.max(2, Math.min(98, caffeine))
        );

        deadlineSlider.value = Math.round(
          Math.max(2, Math.min(98, deadline))
        );

        updateState();
      }, 90);
    }

    function resetState() {
      stopEvolution();

      caffeineSlider.value = 68;
      deadlineSlider.value = 36;
      evolutionTime = 0;

      updateState();
    }

    function updateFromPointer(event) {
      const bounds = plane.getBoundingClientRect();

      const deadline =
        ((event.clientX - bounds.left) / bounds.width) * 100;

      const caffeine =
        100
        - ((event.clientY - bounds.top) / bounds.height) * 100;

      deadlineSlider.value = Math.round(
        Math.max(0, Math.min(100, deadline))
      );

      caffeineSlider.value = Math.round(
        Math.max(0, Math.min(100, caffeine))
      );

      updateState();
    }

    marker.addEventListener("pointerdown", function (event) {
      stopEvolution();
      dragging = true;

      marker.classList.add("is-dragging");
      marker.setPointerCapture(event.pointerId);

      updateFromPointer(event);
    });

    marker.addEventListener("pointermove", function (event) {
      if (dragging) {
        updateFromPointer(event);
      }
    });

    marker.addEventListener("pointerup", function (event) {
      dragging = false;
      marker.classList.remove("is-dragging");
      marker.releasePointerCapture(event.pointerId);
    });

    plane.addEventListener("click", function (event) {
      if (event.target === marker) {
        return;
      }

      stopEvolution();
      updateFromPointer(event);
    });

    caffeineSlider.addEventListener("input", function () {
      stopEvolution();
      updateState();
    });

    deadlineSlider.addEventListener("input", function () {
      stopEvolution();
      updateState();
    });

    evolveButton.addEventListener("click", function () {
      if (evolutionTimer === null) {
        startEvolution();
      } else {
        stopEvolution();
      }
    });

    resetButton.addEventListener("click", resetState);

    updateState();
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initialiseAcademicPhaseDiagram
    );
  } else {
    initialiseAcademicPhaseDiagram();
  }
})();
</script>
