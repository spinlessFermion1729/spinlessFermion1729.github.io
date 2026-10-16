#!/usr/bin/env python3
"""Checks for the closed-form physics used by the site's animations (assets/js/physics-*.js).

1. Fermi-surface hero (physics-fermi.js)
   eps(k) = -2t (cos kx + cos ky) - 4t' cos kx cos ky - mu.
   The saddle point (van Hove singularity) sits at (pi, 0) with energy 4t' - mu, so the Fermi
   surface changes topology (Lifshitz transition) at mu = 4t': for mu > 4t' it is closed around
   (pi, pi) (hole-like), for mu < 4t' around Gamma (electron-like).

2. Magnon animation (physics-magnon.js)
   Classical spins on a square lattice, Neel order (A up, B down),
     H = J1 sum_nn S_i.S_j + J2 sum_{A, d1 = (1,1)} S_i.S_j + J2 sum_{B, d2 = (1,-1)} S_i.S_j,
   with J1 > 0 and J2 < 0 (the site uses J2 = -0.6 J1): a minimal d-wave (d_xy) altermagnet. Linear spin waves:
     omega_pm(k) = sqrt(Abar^2 - B^2) pm delta,
     Abar  = S [4 J1 + J2 (cos k.d1 + cos k.d2 - 2)],
     B     = 2 S J1 (cos kx + cos ky),
     delta = S J2 (cos k.d1 - cos k.d2) = -2 S J2 sin kx sin ky.
   Checked against the eigenvalues of the numerically linearised Landau-Lifshitz equation
   dS_i/dt = -S_i x sum_j J_ij S_j on a periodic lattice.

3. Name wave packet (site.js)
   Free Gaussian packet (hbar = m = 1), width sigma0, momentum k0:
     psi(x,t) = (2 pi sigma0^2)^(-1/4) (1 + i t/(2 sigma0^2))^(-1/2)
                exp[-(x - k0 t)^2 / (4 sigma0^2 (1 + i t/(2 sigma0^2))) + i k0 (x - k0 t/2)].
   Checked against split-step (exact for a free particle) propagation.

Run: python3 bin/animation_physics_check.py
"""

import numpy as np


def check_fermi(t=1.0):
    eps = lambda kx, ky, tp, mu: -2 * t * (np.cos(kx) + np.cos(ky)) - 4 * tp * np.cos(kx) * np.cos(ky) - mu
    for tp in (-0.45, -0.3, -0.1):
        for mu in (-1.7, -0.9, -0.3):
            h = 1e-4
            gx = (eps(np.pi + h, 0, tp, mu) - eps(np.pi - h, 0, tp, mu)) / (2 * h)
            gy = (eps(np.pi, h, tp, mu) - eps(np.pi, -h, tp, mu)) / (2 * h)
            assert abs(gx) < 1e-6 and abs(gy) < 1e-6, "(pi, 0) is a stationary point"
            assert np.isclose(eps(np.pi, 0, tp, mu), 4 * tp - mu)
            # topology: (pi,0) occupied <=> contour encloses (pi,pi) (hole-like)
            occupied_X = eps(np.pi, 0, tp, mu) < 0
            assert occupied_X == (mu > 4 * tp)
            assert eps(np.pi, np.pi, tp, mu) > 0 and eps(0, 0, tp, mu) < 0, "band partially filled"
    print("fermi: van Hove point at (pi,0), Lifshitz transition at mu = 4t'  ok")


def magnon_analytic(kx, ky, J1=1.0, J2=-0.6, S=1.0):
    c1, c2 = np.cos(kx + ky), np.cos(kx - ky)
    Abar = S * (4 * J1 + J2 * (c1 + c2 - 2))
    B = 2 * S * J1 * (np.cos(kx) + np.cos(ky))
    delta = S * J2 * (c1 - c2)
    root = np.sqrt(Abar**2 - B**2)
    return root + delta, root - delta


def check_magnons(L=8, J1=1.0, J2=-0.6):
    N = L * L
    idx = lambda x, y: (x % L) + L * (y % L)
    J = np.zeros((N, N))
    for x in range(L):
        for y in range(L):
            i = idx(x, y)
            for dx, dy in ((1, 0), (0, 1)):
                j = idx(x + dx, y + dy)
                J[i, j] += J1
                J[j, i] += J1
            d = (1, 1) if (x + y) % 2 == 0 else (1, -1)  # A sites: (1,1); B sites: (1,-1)
            j = idx(x + d[0], y + d[1])
            J[i, j] += J2
            J[j, i] += J2
    S0 = np.zeros((N, 3))
    for x in range(L):
        for y in range(L):
            S0[idx(x, y), 2] = 1.0 if (x + y) % 2 == 0 else -1.0

    def f(S):
        h = J @ S
        return -np.cross(S, h)

    # Jacobian of the transverse (x, y) components; f is quadratic so central differences are exact
    M = np.zeros((2 * N, 2 * N))
    eps = 1e-6
    for a in range(2 * N):
        d = np.zeros((N, 3))
        d[a // 2, a % 2] = eps
        col = (f(S0 + d) - f(S0 - d)) / (2 * eps)
        M[:, a] = col[:, :2].reshape(-1)
    w = np.linalg.eigvals(M)
    # only the zero-frequency Goldstone modes (k = 0, (pi, pi)) form Jordan blocks; their numerical
    # real parts are ~sqrt(machine eps), all other modes are purely oscillatory
    assert np.max(np.abs(w.real)) < 1e-6, "linear modes must be undamped (stable ground state)"
    numeric = np.sort(np.abs(w.imag))

    # omega_pm(k) is periodic under k -> k + (pi, pi), so summing over all L^2 structural k-points
    # counts each magnetic-zone mode twice, matching the +-omega pairs of the linear problem
    analytic = []
    for nx in range(L):
        for ny in range(L):
            wp, wm = magnon_analytic(2 * np.pi * nx / L, 2 * np.pi * ny / L, J1, J2)
            analytic += [abs(wp), abs(wm)]
    analytic = np.sort(np.array(analytic))
    err = np.max(np.abs(numeric - analytic))
    assert err < 1e-6, f"analytic magnon frequencies disagree with the linearised spin dynamics ({err:.2e})"

    kk = np.linspace(-np.pi, np.pi, 301)
    KX, KY = np.meshgrid(kk, kk)
    wp, wm = magnon_analytic(KX, KY, J1, J2)
    assert np.min(wm) > -1e-9 and np.min(wp) > -1e-9, "Neel state stable"
    d = np.linspace(-np.pi, np.pi, 11)
    assert np.allclose(*magnon_analytic(d, 0 * d, J1, J2)), "degenerate along kx axis (d_xy nodes)"
    assert np.allclose(*magnon_analytic(0 * d, d, J1, J2)), "degenerate along ky axis"
    print(f"magnons: closed form matches linearised LL on {L}x{L} lattice; max splitting {np.max(wp - wm):.3f} J1  ok")


def packet_analytic(x, t, sigma0, k0):
    a = 1 + 1j * t / (2 * sigma0**2)
    return (2 * np.pi * sigma0**2) ** -0.25 * a**-0.5 * np.exp(-((x - k0 * t) ** 2) / (4 * sigma0**2 * a) + 1j * k0 * (x - k0 * t / 2))


def check_packet(sigma0=1.0, k0=4.0, t=2.5):
    x = np.linspace(-40, 60, 4096, endpoint=False)
    k = 2 * np.pi * np.fft.fftfreq(x.size, d=x[1] - x[0])
    psi0 = packet_analytic(x, 0.0, sigma0, k0)
    psit = np.fft.ifft(np.fft.fft(psi0) * np.exp(-0.5j * k**2 * t))
    assert np.allclose(psit, packet_analytic(x, t, sigma0, k0), atol=1e-8)
    norm = np.sum(np.abs(psit) ** 2) * (x[1] - x[0])
    assert abs(norm - 1) < 1e-8
    print("wave packet: analytic Gaussian matches exact free propagation  ok")


if __name__ == "__main__":
    check_fermi()
    check_magnons()
    check_packet()
