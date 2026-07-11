---
layout: page
title: Research
permalink: /research/
nav: true
nav_order: 3
description: Research interests and current work.
math: true
---

<style>
.correlation-physics {
  position: relative;
  margin: 0.5rem 0 3rem;
  padding: 2.7rem 1.5rem;
  overflow: hidden;
  text-align: center;
  border: 1px solid var(--global-divider-color);
  border-radius: 1rem;
  background:
    radial-gradient(
      circle at 50% 15%,
      rgba(80, 130, 205, 0.16),
      transparent 48%
    ),
    var(--global-card-bg-color);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.11);
}

.correlation-physics::before {
  position: absolute;
  inset: -40%;
  pointer-events: none;
  background:
    repeating-radial-gradient(
      circle at center,
      transparent 0,
      transparent 28px,
      rgba(90, 145, 210, 0.045) 29px,
      transparent 31px
    );
  content: "";
  animation: correlation-background 18s linear infinite;
}

.correlation-content {
  position: relative;
  z-index: 1;
}

.correlation-title {
  margin-bottom: 0.4rem;
  font-size: clamp(1.35rem, 3vw, 1.95rem);
  font-weight: 650;
}

.correlation-subtitle {
  max-width: 680px;
  margin: 0 auto 1.8rem;
  color: var(--global-text-color-light);
  font-size: 0.95rem;
  line-height: 1.6;
}

.correlation-equation {
  margin: 1.3rem 0 2.2rem;
  opacity: 0;
  font-size: clamp(2rem, 6vw, 3.7rem);
  filter: blur(8px);
  transform: translateY(28px) scale(0.94);
}

.correlation-flow {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.correlation-source {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 210px;
  padding: 0.75rem 1.35rem;
  opacity: 0;
  font-size: clamp(1.05rem, 2.8vw, 1.35rem);
  font-weight: 700;
  border: 1px solid var(--global-theme-color);
  border-radius: 999px;
  background: var(--global-bg-color);
  box-shadow:
    0 0 0 0 rgba(80, 130, 205, 0.25),
    0 7px 20px rgba(0, 0, 0, 0.10);
  transform: translateY(22px) scale(0.92);
}

.correlation-source::after {
  position: absolute;
  top: 100%;
  left: 50%;
  width: 2px;
  height: 48px;
  opacity: 0;
  background:
    linear-gradient(
      to bottom,
      var(--global-theme-color),
      transparent
    );
  content: "";
  transform: translateX(-50%) scaleY(0);
  transform-origin: top;
}

.correlation-arrow {
  margin: 2.7rem 0 1.2rem;
  opacity: 0;
  color: var(--global-theme-color);
  font-size: 2rem;
  line-height: 1;
  transform: translateY(-10px);
}

.phase-heading {
  margin: 0 0 1.1rem;
  opacity: 0;
  color: var(--global-text-color-light);
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transform: translateY(12px);
}

.phase-cloud {
  display: flex;
  max-width: 860px;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
}

.emergent-phase {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.6rem;
  padding: 0.55rem 0.95rem;
  opacity: 0;
  border: 1px solid var(--global-divider-color);
  border-radius: 999px;
  background: var(--global-bg-color);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform:
    translateY(24px)
    scale(0.88);
}

.emergent-phase::before {
  width: 0.45rem;
  height: 0.45rem;
  margin-right: 0.5rem;
  border-radius: 50%;
  background: var(--global-theme-color);
  content: "";
  box-shadow:
    0 0 0 4px
    color-mix(
      in srgb,
      var(--global-theme-color) 14%,
      transparent
    );
}

.correlation-physics.is-visible .correlation-equation {
  animation:
    reveal-equation
    1.05s
    cubic-bezier(0.2, 0.75, 0.25, 1)
    forwards;
}

.correlation-physics.is-visible .correlation-source {
  animation:
    reveal-source
    0.75s
    ease
    0.85s
    forwards,
    source-pulse
    2.5s
    ease-in-out
    2.1s
    infinite;
}

.correlation-physics.is-visible .correlation-source::after {
  animation:
    grow-connector
    0.7s
    ease
    1.45s
    forwards;
}

.correlation-physics.is-visible .correlation-arrow {
  animation:
    reveal-arrow
    0.55s
    ease
    1.75s
    forwards,
    arrow-flow
    1.8s
    ease-in-out
    2.35s
    infinite;
}

.correlation-physics.is-visible .phase-heading {
  animation:
    reveal-phase
    0.55s
    ease
    2.05s
    forwards;
}

.correlation-physics.is-visible .emergent-phase {
  animation:
    reveal-phase
    0.65s
    cubic-bezier(0.2, 0.75, 0.25, 1)
    calc(2.25s + var(--phase-delay))
    forwards,
    phase-float
    4s
    ease-in-out
    calc(3.6s + var(--phase-delay))
    infinite;
}

@keyframes reveal-equation {
  from {
    opacity: 0;
    filter: blur(8px);
    transform: translateY(28px) scale(0.94);
  }

  to {
    opacity: 1;
    filter: blur(0);
    transform: translateY(0) scale(1);
  }
}

@keyframes reveal-source {
  from {
    opacity: 0;
    transform: translateY(22px) scale(0.92);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes grow-connector {
  from {
    opacity: 0;
    transform: translateX(-50%) scaleY(0);
  }

  to {
    opacity: 1;
    transform: translateX(-50%) scaleY(1);
  }
}

@keyframes reveal-arrow {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes reveal-phase {
  from {
    opacity: 0;
    transform: translateY(24px) scale(0.88);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes source-pulse {
  0%,
  100% {
    box-shadow:
      0 0 0 0 rgba(80, 130, 205, 0.20),
      0 7px 20px rgba(0, 0, 0, 0.10);
  }

  50% {
    box-shadow:
      0 0 0 10px rgba(80, 130, 205, 0),
      0 8px 24px rgba(0, 0, 0, 0.13);
  }
}

@keyframes arrow-flow {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(7px);
  }
}

@keyframes phase-float {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-4px);
  }
}

@keyframes correlation-background {
  from {
    transform: translate(-3%, -2%) rotate(0deg);
  }

  to {
    transform: translate(4%, 3%) rotate(12deg);
  }
}

@media (max-width: 600px) {
  .correlation-physics {
    padding: 2.2rem 0.8rem;
  }

  .phase-cloud {
    gap: 0.55rem;
  }

  .emergent-phase {
    padding: 0.48rem 0.72rem;
    font-size: 0.88rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .correlation-physics::before,
  .correlation-equation,
  .correlation-source,
  .correlation-source::after,
  .correlation-arrow,
  .phase-heading,
  .emergent-phase {
    opacity: 1 !important;
    filter: none !important;
    transform: none !important;
    animation: none !important;
  }
}
</style>

<section
  id="correlation-physics"
  class="correlation-physics"
  aria-labelledby="correlation-physics-title"
>
  <div class="correlation-content">
    <h2
      id="correlation-physics-title"
      class="correlation-title"
    >
      From Strong Correlations to Emergent Quantum Phases
    </h2>

    <p class="correlation-subtitle">
      Interactions among microscopic degrees of freedom can reorganize
      electronic matter into a wide variety of collective states.
    </p>

    <div
      class="correlation-equation"
      aria-label="H equals H zero plus H interaction"
    >
      \[
        H = H_{0} + H_{\mathrm{int}}
      \]
    </div>

    <div class="correlation-flow">
      <div class="correlation-source">
        Strong electronic correlations
      </div>

      <div
        class="correlation-arrow"
        aria-hidden="true"
      >
        ↓
      </div>

      <div class="phase-heading">
        Emergent phases and phenomena
      </div>

      <div class="phase-cloud">
        <span
          class="emergent-phase"
          style="--phase-delay: 0.00s"
        >
          Magnetism
        </span>

        <span
          class="emergent-phase"
          style="--phase-delay: 0.16s"
        >
          Altermagnetism
        </span>

        <span
          class="emergent-phase"
          style="--phase-delay: 0.32s"
        >
          Superconductivity
        </span>

        <span
          class="emergent-phase"
          style="--phase-delay: 0.48s"
        >
          Topological phases
        </span>

        <span
          class="emergent-phase"
          style="--phase-delay: 0.64s"
        >
          Mott insulating states
        </span>

        <span
          class="emergent-phase"
          style="--phase-delay: 0.80s"
        >
          Charge order
        </span>

        <span
          class="emergent-phase"
          style="--phase-delay: 0.96s"
        >
          Spin order
        </span>

        <span
          class="emergent-phase"
          style="--phase-delay: 1.12s"
        >
          Nematic phases
        </span>

        <span
          class="emergent-phase"
          style="--phase-delay: 1.28s"
        >
          Quantum criticality
        </span>

        <span
          class="emergent-phase"
          style="--phase-delay: 1.44s"
        >
          Fractionalized states
        </span>

        <span
          class="emergent-phase"
          style="--phase-delay: 1.60s"
        >
          Collective excitations
        </span>

        <span
          class="emergent-phase"
          style="--phase-delay: 1.76s"
        >
          Non-Fermi liquids
        </span>
      </div>
    </div>
  </div>
</section>

<script>
(function () {
  function initialiseCorrelationAnimation() {
    const section = document.getElementById(
      "correlation-physics"
    );

    if (!section) {
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (
      reducedMotion ||
      !("IntersectionObserver" in window)
    ) {
      section.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          } else {
            entry.target.classList.remove("is-visible");
          }
        });
      },
      {
        threshold: 0.22,
      }
    );

    observer.observe(section);
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initialiseCorrelationAnimation
    );
  } else {
    initialiseCorrelationAnimation();
  }
})();
</script>

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
