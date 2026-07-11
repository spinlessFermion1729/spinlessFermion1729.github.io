---
layout: about
title: Home
permalink: /
nav: false

subtitle: Ph.D. Student in Theoretical Physics

profile:
  align: right
  image: prof_pic.jpg
  image_circular: true
  more_info: >
    <div class="compact-office">
      <h5>Find me at</h5>

      <p>
        <strong>Theoretical Physics I</strong><br>
        Julius-Maximilians-Universität Würzburg<br>
        M1 Computer Science/Physics, Room 03.015<br>
        Am Hubland, 97074 Würzburg, Germany
      </p>

      <p class="office-contact">
        <a href="tel:+499313184377">
          +49 931 31-84377
        </a><br>

        <a href="mailto:sarbajit.mazumdar@uni-wuerzburg.de">
          sarbajit.mazumdar@uni-wuerzburg.de
        </a><br>

        <a
          href="https://www.physik.uni-wuerzburg.de/tp1/team/phd-studenten/msc-sarbajit-mazumdar/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Institutional webpage
        </a>
      </p>
    </div>

selected_papers: false
social: true

announcements:
  enabled: false

latest_posts:
  enabled: false
---

<style>
.compact-office {
  margin-top: 0.6rem;
  font-size: 0.82rem;
  line-height: 1.3;
}

.compact-office h5 {
  margin-bottom: 0.4rem;
  font-size: 1rem;
}

.compact-office p {
  margin-bottom: 0.55rem;
}

.office-contact {
  overflow-wrap: anywhere;
}

/* Animated Indian flag beside the name */
.india-flag-link {
  display: inline-block;
  margin-left: 0.45rem;
  vertical-align: 0.06em;
  text-decoration: none !important;
}

.india-flag {
  position: relative;
  display: inline-flex;
  width: 50px;
  height: 33.33px;
  overflow: hidden;
  vertical-align: middle;
  border-radius: 2px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25);
  transform-origin: left center;
  animation: india-flag-body 2s ease-in-out infinite;
}

.india-flag-strip {
  flex: 1 1 0;
  height: 100%;
  background:
    linear-gradient(
      to bottom,
      #ff9933 0%,
      #ff9933 33.333%,
      #ffffff 33.333%,
      #ffffff 66.666%,
      #138808 66.666%,
      #138808 100%
    );
  animation: india-flag-ripple 1.5s ease-in-out infinite;
  animation-delay: calc(var(--strip-index) * -0.07s);
}

.india-flag-chakra {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 10px;
  height: 10px;
  border: 1px solid #000080;
  border-radius: 50%;
  background:
    repeating-conic-gradient(
      from 0deg,
      #000080 0deg 1deg,
      transparent 1deg 15deg
    );
  transform: translate(-50%, -50%);
  z-index: 2;
}

.india-flag-chakra::after {
  position: absolute;
  inset: 40%;
  border-radius: 50%;
  background: #000080;
  content: "";
}

@keyframes india-flag-body {
  0%,
  100% {
    transform: perspective(180px) rotateY(-8deg) skewY(0deg);
  }

  50% {
    transform: perspective(180px) rotateY(8deg) skewY(-1deg);
  }
}

@keyframes india-flag-ripple {
  0%,
  100% {
    transform: translateY(0) scaleY(1);
  }

  25% {
    transform: translateY(-1.7px) scaleY(1.05);
  }

  50% {
    transform: translateY(1.3px) scaleY(0.96);
  }

  75% {
    transform: translateY(-0.8px) scaleY(1.02);
  }
}

.visitor-flags {
  clear: both;
  margin-top: 2.5rem;
  padding-top: 1rem;
  text-align: center;
  border-top: 1px solid var(--global-divider-color);
}

.visitor-flags h3 {
  margin-bottom: 0.8rem;
  font-size: 1rem;
}

.visitor-flags img {
  max-width: 100%;
  height: auto;
}

@media (max-width: 576px) {
  .india-flag {
    width: 43px;
    height: 28.67px;
  }

  .india-flag-chakra {
    width: 8px;
    height: 8px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .india-flag,
  .india-flag-strip {
    animation: none;
  }
}
</style>

I am **Sarbajit Mazumdar**, a Ph.D. student in
**Theoretical Physics I** at the
**Julius-Maximilians-Universität Würzburg**, working in the
Condensed Matter Theory group of
[Prof. Ronny Thomale](https://www.physik.uni-wuerzburg.de/tp1/team/professoren/prof-dr-ronny-thomale/).

My research focuses on theoretical condensed matter physics, particularly
**strongly correlated quantum systems**, **unconventional superconductivity**,
**altermagnetism**, **topological phases of matter**, and
**quantum transport**.

I am interested in understanding how interactions, symmetry, topology,
magnetism, and low dimensionality give rise to emergent quantum phenomena.

<div class="visitor-flags">
  <h3>Visitors around the world</h3>

  <img
    src="https://github-visitor-counter-tau.vercel.app/api?username=spinlessFermion1729&amp;theme=dark&amp;columns=4&amp;maxflags=12"
    alt="Country flags showing visitors to this website"
    loading="lazy"
  >
</div>
