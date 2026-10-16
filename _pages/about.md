---
layout: page
title: About
permalink: /about/
nav: true
nav_order: 2
description: Academic background, research interests, and contact information.
---

{% assign p = site.data.profile %}

<div class="sx-about-intro">
  <img class="sx-about-portrait" src="{{ p.portrait | relative_url }}" alt="Portrait of {{ p.name }}" width="395" height="395" loading="lazy">
  <div>
    <p class="sx-kicker">Current position</p>
    <p class="sx-about-role"><strong>{{ p.role }}</strong><br>{{ p.chair }}, <a href="{{ p.university_url }}">{{ p.university }}</a>, Germany<br>Condensed Matter Theory group of <a href="{{ p.group_lead_url }}">{{ p.group_lead }}</a></p>
  </div>
</div>

My doctoral work concerns strongly correlated electron systems, in particular
superconducting pairing at strong coupling, altermagnetism, and the collective
excitations of correlated magnets.

## Education

**Integrated Master of Science (B.Sc.–M.Sc.) in Physics**<br>
[National Institute of Science Education and Research (NISER)](https://www.niser.ac.in/), Bhubaneswar, India<br>
CGPA 9.37/10

## Methods and tools

- **Many-body theory:** Kotliar–Ruckenstein slave-boson mean-field theory and
  fluctuations, random-phase approximation, frequency-dependent gap equations
- **Band structure and topology:** tight-binding modelling, symmetry analysis,
  topological band theory, non-Hermitian systems
- **Quantum transport:** scattering theory, wave-packet dynamics, Josephson junctions
- **Computation:** Python, C++, Mathematica

## Contact

{% include contact-card.liquid %}

## Beyond research

Outside physics I care a great deal about music, literature, cinema, chess, and astronomy.
A few words about these are on the [Beyond Research]({{ '/about-me/' | relative_url }}) page.

<aside class="sx-visitors" aria-label="Visitor statistics">
  <p>Visitors around the world</p>
  <img src="{{ p.visitor_counter }}" alt="Country flags showing visitors to this website" loading="lazy" decoding="async" referrerpolicy="no-referrer">
</aside>
