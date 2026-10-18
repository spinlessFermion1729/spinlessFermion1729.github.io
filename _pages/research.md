---
layout: page
title: Research
permalink: /research/
nav: true
nav_order: 3
description: Superconducting pairing, altermagnetic order, collective spin excitations, and quantum transport in correlated systems.
math: true
---

<p class="sx-page-lead">
My research examines how electronic correlations, lattice symmetry, and band
topology shape electronic order, collective excitations, and transport.
A central part of this work uses slave-boson approaches to Hubbard models to
treat strong local correlations and calculate momentum- and frequency-resolved
response functions.
</p>

<nav class="sx-toc" aria-label="Research directions">
  <a href="#superconductivity"><span>01</span> Unconventional Superconductivity</a>
  <a href="#altermagnetism"><span>02</span> Altermagnetism and Collective Spin Excitations</a>
  <a href="#transport"><span>03</span> Quantum Transport, Band Geometry, and Topology</a>
  <a href="#hubbard"><span>04</span> Interactive Physics: The Hubbard Model</a>
</nav>

<section class="sx-rs sx-reveal" id="superconductivity" aria-labelledby="rs-sc-title">
<p class="sx-kicker">01 · Research direction</p>
<h2 id="rs-sc-title">Unconventional Superconductivity</h2>
<p class="sx-rs-lead">Superconducting pairing mediated by electronic fluctuations in the presence of strong local correlations.</p>

<div class="sx-rs-grid">
<div class="sx-rs-text" markdown="1">

<dl class="sx-rs-meta">
  <dt>Models</dt>
  <dd>One-band Hubbard model on the square lattice; kagome lattice at 2/3 filling with onsite and nearest-neighbour repulsion</dd>
  <dt>Methods</dt>
  <dd>Spin-rotation-invariant Kotliar–Ruckenstein slave bosons, fluctuation-derived pairing vertex, frequency-dependent gap equation; functional renormalization group (kagome study)</dd>
</dl>

To investigate pairing beyond weak-coupling approaches, we developed a
spin-rotation-invariant Kotliar–Ruckenstein slave-boson framework in
which an effective pairing vertex is obtained from fluctuations around the
mean-field saddle point. Solving the resulting frequency-dependent gap equation
for the square-lattice Hubbard model allows us to examine pairing instabilities
as a function of doping, interaction strength, and temperature, and to resolve
the gap structure on the real-frequency axis.

<div class="sx-papers" markdown="1">

- S. Mazumdar _et al._, [Phys. Rev. B **114**, 194511 (2026)](https://doi.org/10.1103/4742-x3lk) · [arXiv:2605.26233](https://arxiv.org/abs/2605.26233)
- C. A. Baum _et al._, [arXiv:2607.18389](https://arxiv.org/abs/2607.18389), electronic order in a kagome quadratic band-touching semimetal from intermediate to strong coupling

</div>
</div>
<div class="sx-rs-media">
{% include research-figure.liquid id="dwave" %}
{% include research-figure.liquid id="bscco-arpes" %}
</div>
</div>
</section>

<section class="sx-rs sx-reveal" id="altermagnetism" aria-labelledby="rs-am-title">
<p class="sx-kicker">02 · Research direction</p>
<h2 id="rs-am-title">Altermagnetism and Collective Spin Excitations</h2>
<p class="sx-rs-lead">Microscopic selection of altermagnetic order and the evolution of collective spin excitations across the metal–insulator transition.</p>

<div class="sx-rs-grid">
<div class="sx-rs-text" markdown="1">

<dl class="sx-rs-meta">
  <dt>Models</dt>
  <dd>Hubbard models on the square-kagome and checkerboard lattices</dd>
  <dt>Methods</dt>
  <dd>Kotliar–Ruckenstein slave-boson theory, sublattice-resolved magnetic instabilities, dynamical spin susceptibilities, magnon dispersions and lifetimes</dd>
</dl>

Altermagnets combine compensated magnetic order with momentum-dependent spin
splitting constrained by crystal symmetry. I investigate the microscopic
selection of these phases and the influence of electronic correlations on
their collective spin excitations. On the square-kagome lattice, we examine
sublattice-resolved magnetic instabilities associated with $d_{xy}$- and
$d_{x^2-y^2}$-type altermagnetic phases. On the checkerboard lattice, we track
chiral magnon branches across the metal–insulator transition, from strongly
damped modes in the metal to coherent branches with modified dispersion in
the Mott insulator.

<div class="sx-papers" markdown="1">

- J. Issing _et al._, [Phys. Rev. B **114**, 115128 (2026)](https://doi.org/10.1103/yr4y-bw4n) · [arXiv:2603.12022](https://arxiv.org/abs/2603.12022)
- J. Issing _et al._, [arXiv:2605.11669](https://arxiv.org/abs/2605.11669), altermagnons at the metal–insulator transition

</div>
</div>
<div class="sx-rs-media">
{% include research-figure.liquid id="altermagnet" %}
{% include research-figure.liquid id="altermagnet-real-space" %}
</div>
</div>

<figure class="sx-magnon" data-magnon>
  <div class="sx-magnon-stage">
    <canvas class="sx-magnon-canvas" aria-label="Interactive lattice of spins: click to launch a spin wave"></canvas>
    <div class="sx-magnon-inset">
      <canvas class="sx-magnon-inset" aria-hidden="true"></canvas>
      <span><i class="is-a"></i>ω<sub>+</sub> <i class="is-b"></i>ω<sub>−</sub></span>
    </div>
    <span class="sx-chip">Click to launch a magnon</span>
  </div>
  <figcaption>
    Illustrative spin dynamics of a minimal d-wave altermagnet: Néel order on a square lattice with ferromagnetic
    second-neighbour exchange J<sub>2</sub> = −0.6 J<sub>1</sub> along (1, 1) on sublattice A and along (1, −1) on
    sublattice B. A local spin tilt launches magnons whose two chiralities are split,
    ω<sub>±</sub>(k) = √(Ā² − B²) ± 2S|J<sub>2</sub>| sin k<sub>x</sub> sin k<sub>y</sub> (inset, along the zone diagonal).
    Colour shows which sublattice carries more of the spin-wave intensity (blue: A, teal: B); the isotropic part
    cancels and the d-wave, four-lobed pattern of the splitting remains. Classical Landau–Lifshitz simulation with
    periodic boundaries, not research data.
  </figcaption>
</figure>
</section>

<section class="sx-rs sx-reveal" id="transport" aria-labelledby="rs-tr-title">
<p class="sx-kicker">03 · Research direction</p>
<h2 id="rs-tr-title">Quantum Transport, Band Geometry, and Topology</h2>
<p class="sx-rs-lead">Signatures of flat bands, band geometry, and topology in superconducting transport, nonlinear Hall response, and charge pumping.</p>

<div class="sx-rs-grid">
<div class="sx-rs-text" markdown="1">

<dl class="sx-rs-meta">
  <dt>Models</dt>
  <dd>Proximitized junctions on the extended α-T<sub>3</sub> lattice; C<sub>3</sub>-symmetric metal–organic frameworks downfolded to star- and honeycomb-lattice models; non-Hermitian Rice–Mele model</dd>
  <dt>Methods</dt>
  <dd>Scattering theory, wave-packet dynamics, Josephson-junction transport, Berry-curvature and symmetry analysis, non-Bloch topological invariants</dd>
</dl>

I investigate how band structure and geometry influence transport in several
complementary settings. In proximity-coupled junctions on the extended
$\alpha$-$T_3$ lattice, we study enhanced Andreev reflection associated with
quasi-flat bands, direction-dependent Goos–Hänchen-like shifts, and a Hall-like
response in Josephson junctions. In metal–organic frameworks, we examine how
spin–orbit coupling and broken inversion symmetry generate Berry curvature
near gapped Dirac points and enable a nonlinear Hall response. Earlier work
on the non-Hermitian Rice–Mele model investigated the roles of the skin effect
and exceptional points in anomalous charge pumping, including regimes with
no Hermitian counterpart.

<div class="sx-papers" markdown="1">

- S. Mazumdar _et al._, [Phys. Rev. B **113**, 134517 (2026)](https://doi.org/10.1103/qr7p-c56y) · [arXiv:2507.06327](https://arxiv.org/abs/2507.06327)
- S. Mazumdar _et al._, [arXiv:2603.09612](https://arxiv.org/abs/2603.09612), nonlinear Hall effect in metal–organic frameworks
- A. Kumar _et al._, [J. Phys.: Condens. Matter **37**, 135601 (2025)](https://doi.org/10.1088/1361-648X/ada982) · [arXiv:2110.06797](https://arxiv.org/abs/2110.06797)

</div>
</div>
<div class="sx-rs-media">
{% include research-figure.liquid id="chern-ribbon" %}
</div>
</div>
</section>

<section class="sx-rs sx-rs-interactive" id="hubbard" aria-labelledby="rs-hub-title">
<p class="sx-kicker">04 · Interactive</p>
<h2 id="rs-hub-title">Interactive Physics: The Hubbard Model</h2>
<p class="sx-rs-lead">An interactive illustration of the competition between kinetic energy and local repulsion in the Hubbard model. The visualization is qualitative and does not represent a numerical solution.</p>

<!-- HUBBARD_SHOWCASE_START -->

{% include hubbard-observatory.html %}

<!-- HUBBARD_SHOWCASE_END -->
</section>

<script src="{{ '/assets/js/physics-magnon.js' | relative_url | bust_file_cache }}" defer></script>
