#!/usr/bin/env python3
"""Schematic model visualizations for the website's research cards and figures.

These are illustrations computed from minimal textbook models. They are NOT
research data and are labelled "schematic model visualization" on the site.

Models (lattice constant a = 1, energies in units of t):

1. d-wave superconductor (square lattice)
     eps(k)   = -2t (cos kx + cos ky) - 4t' cos kx cos ky - mu,   t'/t = -0.3,
     Delta(k) = Delta0 (cos kx - cos ky).
   mu is fixed by bisection to the filling n = 0.85 (hole doping 0.15).
   The Fermi contour eps(k) = 0 is coloured by Delta(k)/Delta0.

2. d-wave (d_{x^2-y^2}-type) altermagnet, simplified
     E_s(k) = -2t (cos kx + cos ky) - mu + s * lam (cos kx - cos ky),  s = +1/-1,
   lam/t = 0.6, mu/t = -2.4. Spin degeneracy is protected on |kx| = |ky|.

3. Chern-insulator ribbon (Qi-Wu-Zhang model)
     H(k) = sin kx sx + sin ky sy + (m + cos kx + cos ky) sz,   m = 1,
   open in y (N = 40 sites), periodic in x. States are coloured by their
   localisation on the upper/lower edge.

Run:  python3 bin/research_figures.py   (writes assets/img/research/*.webp)
Requires numpy, matplotlib, pillow.
"""

from __future__ import annotations

import io
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
import numpy as np  # noqa: E402
from matplotlib.collections import LineCollection  # noqa: E402
from matplotlib.colors import LinearSegmentedColormap  # noqa: E402
from PIL import Image  # noqa: E402

OUT = Path(__file__).resolve().parent.parent / "assets" / "img" / "research"

NAVY = "#0b1220"
PANEL = "#111a2e"
INK = "#e2e8f0"
MUTED = "#94a3b8"
GRID = "#334155"
COBALT = "#3b82f6"
TEAL = "#14b8a6"
SLATE = "#64748b"

DIVERGING = LinearSegmentedColormap.from_list("cobalt_teal", ["#1d4ed8", "#60a5fa", "#1e293b", "#5eead4", "#0f766e"])

plt.rcParams.update(
    {
        "font.family": "DejaVu Sans",
        "mathtext.fontset": "dejavusans",
        "axes.edgecolor": GRID,
        "axes.labelcolor": INK,
        "xtick.color": MUTED,
        "ytick.color": MUTED,
        "text.color": INK,
        "font.size": 13,
    }
)

PI_TICKS = ([-np.pi, 0, np.pi], [r"$-\pi$", "0", r"$\pi$"])


def save(fig, name: str) -> None:
    """Render to PNG in memory, then store as WebP."""
    buf = io.BytesIO()
    fig.savefig(buf, format="png", facecolor=fig.get_facecolor(), dpi=200)
    plt.close(fig)
    buf.seek(0)
    path = OUT / f"{name}.webp"
    Image.open(buf).convert("RGB").save(path, "WEBP", quality=88, method=6)
    print(f"wrote {path.relative_to(OUT.parent.parent.parent)} ({path.stat().st_size // 1024} KiB)")


def kgrid(n: int = 801):
    k = np.linspace(-np.pi, np.pi, n)
    return np.meshgrid(k, k)


def coloured_contours(ax, kx, ky, field, colour_fn, cmap, lw):
    """Draw the zero contour of `field`, each segment coloured by colour_fn(kx, ky) in [-1, 1]."""
    cs = ax.contour(kx, ky, field, levels=[0.0], alpha=0)
    for seg in cs.allsegs[0]:
        if len(seg) < 2:
            continue
        pts = seg.reshape(-1, 1, 2)
        segments = np.concatenate([pts[:-1], pts[1:]], axis=1)
        mid = 0.5 * (seg[:-1] + seg[1:])
        lc = LineCollection(segments, cmap=cmap, norm=plt.Normalize(-1, 1), linewidths=lw, capstyle="round")
        lc.set_array(colour_fn(mid[:, 0], mid[:, 1]))
        ax.add_collection(lc)


def style_bz(ax, labels: bool) -> None:
    ax.set_xlim(-np.pi, np.pi)
    ax.set_ylim(-np.pi, np.pi)
    ax.set_aspect("equal")
    ax.set_facecolor(PANEL)
    for s in ax.spines.values():
        s.set_color(GRID)
    if labels:
        ax.set_xticks(*PI_TICKS)
        ax.set_yticks(*PI_TICKS)
        ax.set_xlabel(r"$k_x$")
        ax.set_ylabel(r"$k_y$", rotation=0, labelpad=12)
    else:
        ax.set_xticks([])
        ax.set_yticks([])


# ---------------------------------------------------------------------------
# 1. d-wave superconductor
# ---------------------------------------------------------------------------


def band_sc(kx, ky, mu, t=1.0, tp=-0.3):
    return -2 * t * (np.cos(kx) + np.cos(ky)) - 4 * tp * np.cos(kx) * np.cos(ky) - mu


def filling(mu, n=801):
    kx, ky = kgrid(n)
    return 2.0 * np.mean(band_sc(kx, ky, mu) < 0)  # both spins, T = 0


def solve_mu(target=0.85):
    lo, hi = -4.0, 4.0
    for _ in range(60):
        mid = 0.5 * (lo + hi)
        if filling(mid) < target:
            lo = mid
        else:
            hi = mid
    return 0.5 * (lo + hi)


def figure_dwave() -> None:
    mu = solve_mu(0.85)
    n = filling(mu)
    assert abs(n - 0.85) < 2e-3, n
    print(f"d-wave: mu/t = {mu:.4f}, n = {n:.4f}")

    gap = lambda x, y: 0.5 * (np.cos(x) - np.cos(y))  # Delta/Delta0 scaled to [-1, 1]
    # nodes: the form factor vanishes on the zone diagonals
    d = np.linspace(-np.pi, np.pi, 11)
    assert np.allclose(gap(d, d), 0) and np.allclose(gap(d, -d), 0)

    kx, ky = kgrid()
    eps = band_sc(kx, ky, mu)

    for variant in ("card", "figure"):
        labels = variant == "figure"
        if labels:
            fig, ax = plt.subplots(figsize=(6.4, 5.6))
            fig.subplots_adjust(left=0.12, right=0.86, bottom=0.12, top=0.95)
        else:
            fig, ax = plt.subplots(figsize=(8, 5))
            fig.subplots_adjust(0, 0, 1, 1)
        fig.patch.set_facecolor(NAVY)
        im = ax.imshow(
            gap(kx, ky), extent=(-np.pi, np.pi, -np.pi, np.pi), origin="lower", cmap=DIVERGING, vmin=-1, vmax=1, alpha=0.35
        )
        ax.plot([-np.pi, np.pi], [-np.pi, np.pi], ls=(0, (4, 4)), lw=1, color=MUTED, alpha=0.6)
        ax.plot([-np.pi, np.pi], [np.pi, -np.pi], ls=(0, (4, 4)), lw=1, color=MUTED, alpha=0.6)
        coloured_contours(ax, kx, ky, eps, gap, DIVERGING, lw=4.5 if labels else 6)
        style_bz(ax, labels)
        if labels:
            cb = fig.colorbar(im, ax=ax, fraction=0.046, pad=0.04, ticks=[-1, 0, 1])
            cb.set_label(r"$(\cos k_x-\cos k_y)/2$", color=INK)
            cb.solids.set_alpha(1)
            cb.outline.set_edgecolor(GRID)
            cb.ax.tick_params(colors=MUTED)
            # nodal point: Fermi contour on the diagonal kx = ky = k
            c = np.roots([-4 * -0.3, -4.0, -mu])  # -4c - 4t'c^2 - mu = 0 with c = cos k
            c = c[np.abs(c) <= 1][0].real
            kn = np.arccos(c)
            ax.annotate("node", xy=(kn, kn), xytext=(kn - 1.55, kn + 0.85), color=INK, fontsize=11,
                        arrowprops=dict(arrowstyle="-|>", color=INK, lw=1))
        else:
            ax.set_xlim(-np.pi, np.pi)
            ax.set_ylim(-np.pi * 5 / 8, np.pi * 5 / 8)  # 16:10 crop around the zone centre
            ax.set_aspect("auto")
        save(fig, f"schematic-dwave-{variant}")


# ---------------------------------------------------------------------------
# 2. d-wave altermagnet
# ---------------------------------------------------------------------------


def figure_altermagnet(lam=0.6, mu=-2.4, t=1.0) -> None:
    def band(kx, ky, s):
        return -2 * t * (np.cos(kx) + np.cos(ky)) - mu + s * lam * (np.cos(kx) - np.cos(ky))

    d = np.linspace(-np.pi, np.pi, 11)
    assert np.allclose(band(d, d, 1), band(d, d, -1)), "spin degeneracy on the diagonal"
    assert np.allclose(band(d, -d, 1), band(d, -d, -1))

    kx, ky = kgrid()
    split = (band(kx, ky, 1) - band(kx, ky, -1)) / (4 * lam)  # = (cos kx - cos ky)/2 in [-1, 1]

    for variant in ("card", "figure"):
        labels = variant == "figure"
        if labels:
            fig, ax = plt.subplots(figsize=(6.4, 5.6))
            fig.subplots_adjust(left=0.12, right=0.86, bottom=0.12, top=0.95)
        else:
            fig, ax = plt.subplots(figsize=(8, 5))
            fig.subplots_adjust(0, 0, 1, 1)
        fig.patch.set_facecolor(NAVY)
        im = ax.imshow(
            split, extent=(-np.pi, np.pi, -np.pi, np.pi), origin="lower", cmap=DIVERGING, vmin=-1, vmax=1, alpha=0.3
        )
        ax.plot([-np.pi, np.pi], [-np.pi, np.pi], ls=(0, (4, 4)), lw=1, color=MUTED, alpha=0.6)
        ax.plot([-np.pi, np.pi], [np.pi, -np.pi], ls=(0, (4, 4)), lw=1, color=MUTED, alpha=0.6)
        lw = 4.0 if labels else 5.5
        ax.contour(kx, ky, band(kx, ky, 1), levels=[0], colors=[COBALT], linewidths=lw)
        ax.contour(kx, ky, band(kx, ky, -1), levels=[0], colors=[TEAL], linewidths=lw)
        style_bz(ax, labels)
        if labels:
            cb = fig.colorbar(im, ax=ax, fraction=0.046, pad=0.04, ticks=[-1, 0, 1])
            cb.set_label(r"$(E_\uparrow-E_\downarrow)/4\lambda$", color=INK)
            cb.solids.set_alpha(1)
            cb.outline.set_edgecolor(GRID)
            cb.ax.tick_params(colors=MUTED)
            ax.plot([], [], color=COBALT, lw=4, label=r"spin $\uparrow$")
            ax.plot([], [], color=TEAL, lw=4, label=r"spin $\downarrow$")
            leg = ax.legend(loc="lower left", frameon=True, fontsize=11)
            leg.get_frame().set_facecolor(NAVY)
            leg.get_frame().set_edgecolor(GRID)
            for txt in leg.get_texts():
                txt.set_color(INK)
        else:
            ax.set_ylim(-np.pi * 5 / 8, np.pi * 5 / 8)
            ax.set_aspect("auto")
        save(fig, f"schematic-altermagnet-{variant}")


# ---------------------------------------------------------------------------
# 3. Chern-insulator ribbon (Qi-Wu-Zhang)
# ---------------------------------------------------------------------------

SX = np.array([[0, 1], [1, 0]], dtype=complex)
SY = np.array([[0, -1j], [1j, 0]], dtype=complex)
SZ = np.array([[1, 0], [0, -1]], dtype=complex)


def qwz_bulk(kx, ky, m):
    return np.sin(kx) * SX + np.sin(ky) * SY + (m + np.cos(kx) + np.cos(ky)) * SZ


def chern_number(m, n=60):
    """Fukui-Hatsugai-Suzuki lattice Chern number of the lower band."""
    ks = np.linspace(0, 2 * np.pi, n, endpoint=False)
    u = np.empty((n, n, 2), dtype=complex)
    for i, kx in enumerate(ks):
        for j, ky in enumerate(ks):
            _, v = np.linalg.eigh(qwz_bulk(kx, ky, m))
            u[i, j] = v[:, 0]
    link = lambda a, b: np.vdot(a, b) / abs(np.vdot(a, b))
    flux = 0.0
    for i in range(n):
        for j in range(n):
            a, b = u[i, j], u[(i + 1) % n, j]
            c, d = u[(i + 1) % n, (j + 1) % n], u[i, (j + 1) % n]
            flux += np.angle(link(a, b) * link(b, c) * link(c, d) * link(d, a))
    return flux / (2 * np.pi)


def qwz_ribbon(kx, m, N, periodic=False):
    h0 = np.sin(kx) * SX + (m + np.cos(kx)) * SZ
    T = 0.5 * (SZ + 1j * SY)  # T e^{-i ky} + h.c. = cos ky sz + sin ky sy
    H = np.zeros((2 * N, 2 * N), dtype=complex)
    for y in range(N):
        H[2 * y : 2 * y + 2, 2 * y : 2 * y + 2] = h0
        if y + 1 < N or periodic:
            yp = (y + 1) % N
            H[2 * yp : 2 * yp + 2, 2 * y : 2 * y + 2] += T
            H[2 * y : 2 * y + 2, 2 * yp : 2 * yp + 2] += T.conj().T
    return H


def figure_ribbon(m=1.0, N=40) -> None:
    C = chern_number(m)
    assert abs(abs(C) - 1) < 1e-6, C
    print(f"QWZ: m = {m}, Chern number of lower band = {C:+.3f}")

    # the periodic ribbon must reproduce the bulk bands at ky = 2 pi n / N
    kx0 = 0.37
    ribbon = np.sort(np.linalg.eigvalsh(qwz_ribbon(kx0, m, N, periodic=True)))
    bulk = np.sort(np.concatenate([np.linalg.eigvalsh(qwz_bulk(kx0, 2 * np.pi * j / N, m)) for j in range(N)]))
    assert np.allclose(ribbon, bulk), "ribbon construction inconsistent with bulk Hamiltonian"

    ks = np.linspace(0, 2 * np.pi, 361)  # edge modes cross at kx = pi for 0 < m < 2
    ys = (2 * (np.arange(N) / (N - 1)) - 1).repeat(2)  # position in [-1, 1] for each orbital
    E, P = [], []
    for kx in ks:
        w, v = np.linalg.eigh(qwz_ribbon(kx, m, N))
        E.append(w)
        P.append(ys @ (np.abs(v) ** 2))
    E, P = np.array(E), np.array(P)

    # for m = 1 the bulk gap is [-1, 1] (min |d(k)| = 1 at (pi, 0), (0, pi), (pi, pi))
    in_gap = np.abs(E) < 0.8
    assert np.all(np.abs(P[in_gap]) > 0.5), "in-gap states must be edge-localised"

    edge = LinearSegmentedColormap.from_list("edge", [TEAL, "#334155", "#475569", "#334155", COBALT])
    for variant in ("card", "figure"):
        labels = variant == "figure"
        if labels:
            fig, ax = plt.subplots(figsize=(8, 5))
            fig.subplots_adjust(left=0.1, right=0.97, bottom=0.14, top=0.95)
        else:
            fig, ax = plt.subplots(figsize=(8, 5))
            fig.subplots_adjust(0, 0, 1, 1)
        fig.patch.set_facecolor(NAVY)
        ax.set_facecolor(PANEL)
        order = np.argsort(np.abs(P).ravel())  # draw edge states on top
        kk = np.repeat(ks, E.shape[1])[order]
        ax.scatter(kk, E.ravel()[order], c=P.ravel()[order], cmap=edge, vmin=-1, vmax=1, s=4 if labels else 7, lw=0)
        ax.set_xlim(0, 2 * np.pi)
        ax.set_ylim(-3.3, 3.3)
        for s in ax.spines.values():
            s.set_color(GRID)
        if labels:
            ax.set_xticks([0, np.pi, 2 * np.pi], ["0", r"$\pi$", r"$2\pi$"])
            ax.set_xlabel(r"$k_x$")
            ax.set_ylabel(r"$E/t$")
            ax.axhspan(-1, 1, color=MUTED, alpha=0.06, lw=0)
            ax.text(0.15, 2.85, "bulk bands", color=MUTED, fontsize=11)
            ax.text(np.pi + 1.25, -0.5, "upper edge", color=COBALT, fontsize=11, va="center")
            ax.text(np.pi + 1.25, 0.5, "lower edge", color=TEAL, fontsize=11, va="center")
        else:
            ax.set_xticks([])
            ax.set_yticks([])
        save(fig, f"schematic-chern-ribbon-{variant}")


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    figure_dwave()
    figure_altermagnet()
    figure_ribbon()
