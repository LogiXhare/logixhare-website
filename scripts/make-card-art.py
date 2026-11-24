#!/usr/bin/env python3
"""
Isometric card artwork for the industry and venture pages.

    python3 scripts/make-card-art.py        # writes public/art/{industries,ventures}/*.svg

Same visual language as public/services/*.svg: a dark navy plate, a faint
isometric floor grid, a sky-blue glow pool, three-tone navy solids (top /
left / right faces) and the logo's sky blue (#61c0e0) for light and data.

No dependencies. Every scene is built from a few primitives on one
projection: screen x = (x - y) * cos30, screen y = (x + y) * sin30 - z.
The eye looks along (1, 1, 1), so a face is visible when its outward normal
has a positive dot product with that vector. Objects are painted back to
front by the depth of their centre (x + y + z).

Edit a scene and re-run; never hand-edit the generated SVGs.
"""
from __future__ import annotations

import math
import os
from dataclasses import dataclass, field

W, H = 640, 400
OX, OY = 320, 250          # where world (0, 0, 0) lands
C30, S30 = math.cos(math.radians(30)), 0.5

SKY = '#61c0e0'
SKY_SOFT = '#8fb7cf'
SKY_PALE = '#a3dbf0'
RED = '#ff6b6b'
GREEN = '#4cd08a'
INDIGO = '#5870a8'


# Every projected point of the scene being built is recorded here, so the
# finished scene can be scaled and centred to fill the card (see render()).
TRACK: list[tuple[float, float]] | None = None


def P(x: float, y: float, z: float = 0) -> tuple[float, float]:
    pt = (OX + (x - y) * C30, OY + (x + y) * S30 - z)
    if TRACK is not None:
        TRACK.append(pt)
    return pt


def pts(points) -> str:
    return ' '.join(f'{a:.1f},{b:.1f}' for a, b in points)


@dataclass
class Item:
    depth: float
    svg: str


@dataclass
class Scene:
    label: str
    items: list[Item] = field(default_factory=list)
    overlay: list[str] = field(default_factory=list)   # drawn last, in world space
    screen: list[str] = field(default_factory=list)    # badges/bubbles at fixed card positions

    def __post_init__(self) -> None:
        global TRACK
        TRACK = []

    def add(self, depth: float, svg: str) -> None:
        self.items.append(Item(depth, svg))

    # ---------------------------------------------------------- primitives
    def box(self, x, y, z, w, d, h, tone='base', details: str = '', depth_bias: float = 0) -> None:
        top = [P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h)]
        left = [P(x, y + d, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x, y + d, z + h)]
        right = [P(x + w, y, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x + w, y, z + h)]
        fills = {
            'base': ('url(#fTop)', 'url(#fLeft)', 'url(#fRight)'),
            'light': ('url(#lTop)', 'url(#lLeft)', 'url(#lRight)'),
            'glow': ('url(#gTop)', 'url(#gLeft)', 'url(#gRight)'),
        }[tone]
        svg = (
            f'<polygon points="{pts(top)}" fill="{fills[0]}"/>'
            f'<polygon points="{pts(left)}" fill="{fills[1]}"/>'
            f'<polygon points="{pts(right)}" fill="{fills[2]}"/>'
            f'<polyline points="{pts([left[3], top[0], top[1]])}" fill="none" stroke="{SKY}" stroke-opacity=".22" stroke-width="1"/>'
            + details
        )
        self.add(x + w / 2 + y + d / 2 + z * 0.3 + depth_bias, svg)

    def shadow(self, x, y, w, d, depth=-999) -> None:
        cx, cy = P(x + w / 2, y + d / 2, 0)
        rx = (w + d) * C30 * 0.75
        self.add(depth, f'<ellipse cx="{cx:.1f}" cy="{cy:.1f}" rx="{rx:.1f}" ry="{rx * 0.55:.1f}" fill="url(#shadow)"/>')

    # Rectangles on a face, in face-local coordinates (u across, v up).
    @staticmethod
    def on_left(x, y, z, w, d, u0, v0, u1, v1, fill, op=1.0) -> str:
        yy = y + d
        q = [P(x + u0, yy, z + v0), P(x + u1, yy, z + v0), P(x + u1, yy, z + v1), P(x + u0, yy, z + v1)]
        return f'<polygon points="{pts(q)}" fill="{fill}" opacity="{op}"/>'

    @staticmethod
    def on_right(x, y, z, w, d, u0, v0, u1, v1, fill, op=1.0) -> str:
        xx = x + w
        q = [P(xx, y + u0, z + v0), P(xx, y + u1, z + v0), P(xx, y + u1, z + v1), P(xx, y + u0, z + v1)]
        return f'<polygon points="{pts(q)}" fill="{fill}" opacity="{op}"/>'

    @staticmethod
    def on_top(x, y, z, u0, v0, u1, v1, fill, op=1.0) -> str:
        q = [P(x + u0, y + v0, z), P(x + u1, y + v0, z), P(x + u1, y + v1, z), P(x + u0, y + v1, z)]
        return f'<polygon points="{pts(q)}" fill="{fill}" opacity="{op}"/>'

    def windows(self, x, y, z, w, d, h, rows, cols_l, cols_r, lit=(), margin=6, face='both') -> str:
        """A grid of windows on the visible faces; `lit` lists (face, r, c) that glow."""
        out = []
        gap = 5
        rh = (h - 2 * margin - (rows - 1) * gap) / rows
        for face_name, cols, span, fn in (('l', cols_l, w, self.on_left), ('r', cols_r, d, self.on_right)):
            if face not in ('both', face_name) or cols == 0:
                continue
            cw = (span - 2 * margin - (cols - 1) * gap) / cols
            for r in range(rows):
                for c in range(cols):
                    u0 = margin + c * (cw + gap)
                    v0 = margin + r * (rh + gap)
                    glow = (face_name, r, c) in lit
                    out.append(fn(x, y, z, w, d, u0, v0, u0 + cw, v0 + rh, SKY if glow else '#0c1f31', 0.85 if glow else 1))
        return ''.join(out)

    def cylinder(self, x, y, z, r, h, tone='base', bands: int = 0) -> None:
        cx, cy_bot = P(x, y, z)
        _, cy_top = P(x, y, z + h)
        rx, ry = r * 1.2247, r * 0.7071
        grad = 'url(#cyl)' if tone == 'base' else 'url(#cylG)'
        top = 'url(#fTop)' if tone == 'base' else 'url(#gTop)'
        svg = (
            f'<path d="M{cx - rx:.1f},{cy_top:.1f} L{cx - rx:.1f},{cy_bot:.1f} A{rx:.1f},{ry:.1f} 0 0 0 {cx + rx:.1f},{cy_bot:.1f} L{cx + rx:.1f},{cy_top:.1f} Z" fill="{grad}"/>'
        )
        for i in range(1, bands + 1):
            by = cy_bot - h * i / (bands + 1)
            svg += f'<path d="M{cx - rx:.1f},{by:.1f} A{rx:.1f},{ry:.1f} 0 0 0 {cx + rx:.1f},{by:.1f}" fill="none" stroke="{SKY}" stroke-opacity=".55" stroke-width="1.6"/>'
        svg += f'<ellipse cx="{cx:.1f}" cy="{cy_top:.1f}" rx="{rx:.1f}" ry="{ry:.1f}" fill="{top}"/>'
        svg += f'<ellipse cx="{cx:.1f}" cy="{cy_top:.1f}" rx="{rx:.1f}" ry="{ry:.1f}" fill="none" stroke="{SKY}" stroke-opacity=".3"/>'
        self.add(x + y + z * 0.3, svg)

    def gable(self, x, y, z, w, d, h, tone='base') -> None:
        """A pitched roof whose ridge runs along x."""
        ridge_a, ridge_b = P(x, y + d / 2, z + h), P(x + w, y + d / 2, z + h)
        front = [P(x, y + d, z), P(x + w, y + d, z), ridge_b, ridge_a]
        side = [P(x + w, y, z), P(x + w, y + d, z), ridge_b]
        top_fill = 'url(#roof)' if tone == 'base' else 'url(#gTop)'
        svg = (f'<polygon points="{pts(front)}" fill="{top_fill}"/>'
               f'<polygon points="{pts(side)}" fill="url(#fRight)"/>'
               f'<line x1="{ridge_a[0]:.1f}" y1="{ridge_a[1]:.1f}" x2="{ridge_b[0]:.1f}" y2="{ridge_b[1]:.1f}" stroke="{SKY}" stroke-opacity=".4"/>')
        self.add(x + w / 2 + y + d / 2 + z * 0.3 + 0.5, svg)

    def panel(self, x, y, z, w, h, content: str = 'bars', facing='left', depth_bias=0) -> None:
        """A thin standing screen. facing='left' shows its screen on the +y face."""
        if facing == 'left':
            self.box(x, y, z, w, 4, h, details='', depth_bias=depth_bias)
            scr = [P(x + 4, y + 4, z + 4), P(x + w - 4, y + 4, z + 4), P(x + w - 4, y + 4, z + h - 4), P(x + 4, y + 4, z + h - 4)]
            u = lambda a, b: P(x + 4 + (w - 8) * a, y + 4, z + 4 + (h - 8) * b)
        else:
            self.box(x, y, z, 4, w, h, details='', depth_bias=depth_bias)
            scr = [P(x + 4, y + 4, z + 4), P(x + 4, y + w - 4, z + 4), P(x + 4, y + w - 4, z + h - 4), P(x + 4, y + 4, z + h - 4)]
            u = lambda a, b: P(x + 4, y + 4 + (w - 8) * a, z + 4 + (h - 8) * b)
        svg = f'<polygon points="{pts(scr)}" fill="url(#screen)"/>'
        svg += self._screen_content(u, content)
        cx = x + w / 2 if facing == 'left' else x
        cy = y if facing == 'left' else y + w / 2
        self.add(cx + cy + 4 + z * 0.3 + depth_bias + 0.1, svg)

    def _screen_content(self, u, kind: str) -> str:
        s = ''
        if kind == 'bars':
            for i, v in enumerate((0.35, 0.6, 0.45, 0.8, 0.55)):
                a0, a1 = 0.1 + i * 0.17, 0.1 + i * 0.17 + 0.1
                s += f'<polygon points="{pts([u(a0, 0.1), u(a1, 0.1), u(a1, 0.1 + v * 0.75), u(a0, 0.1 + v * 0.75)])}" fill="{SKY}" opacity="{0.55 + i * 0.08:.2f}"/>'
        elif kind == 'line':
            line = [u(0.06 + i * 0.11, y) for i, y in enumerate((0.3, 0.42, 0.36, 0.6, 0.52, 0.75, 0.68, 0.86, 0.8))]
            s += f'<polyline points="{pts(line)}" fill="none" stroke="{SKY}" stroke-width="2.2" stroke-linejoin="round"/>'
        elif kind == 'pulse':
            line = [u(a, b) for a, b in ((0.05, 0.5), (0.3, 0.5), (0.38, 0.8), (0.46, 0.2), (0.54, 0.65), (0.6, 0.5), (0.95, 0.5))]
            s += f'<polyline points="{pts(line)}" fill="none" stroke="{GREEN}" stroke-width="2.4" stroke-linejoin="round"/>'
        elif kind == 'chat':
            for i, (a0, a1, b) in enumerate(((0.08, 0.6, 0.72), (0.4, 0.92, 0.48), (0.08, 0.7, 0.24))):
                col = SKY if i % 2 == 0 else INDIGO
                s += f'<polygon points="{pts([u(a0, b), u(a1, b), u(a1, b + 0.16), u(a0, b + 0.16)])}" fill="{col}" opacity=".85"/>'
        elif kind == 'rows':
            for i in range(5):
                b = 0.12 + i * 0.16
                s += f'<polygon points="{pts([u(0.08, b), u(0.92, b), u(0.92, b + 0.08), u(0.08, b + 0.08)])}" fill="{SKY}" opacity="{0.35 + (i % 2) * 0.35:.2f}"/>'
        elif kind == 'wave':
            for i in range(11):
                a = 0.08 + i * 0.077
                hgt = (0.15, 0.35, 0.6, 0.85, 0.5, 0.95, 0.65, 0.4, 0.75, 0.3, 0.15)[i]
                s += f'<polygon points="{pts([u(a, 0.5 - hgt * 0.4), u(a + 0.04, 0.5 - hgt * 0.4), u(a + 0.04, 0.5 + hgt * 0.4), u(a, 0.5 + hgt * 0.4)])}" fill="{SKY}"/>'
        elif kind == 'map':
            for a, b in ((0.25, 0.3), (0.6, 0.7), (0.75, 0.35), (0.4, 0.6)):
                s += f'<circle cx="{u(a, b)[0]:.1f}" cy="{u(a, b)[1]:.1f}" r="3.2" fill="{SKY}"/>'
            s += f'<polyline points="{pts([u(0.25, 0.3), u(0.4, 0.6), u(0.6, 0.7), u(0.75, 0.35)])}" fill="none" stroke="{SKY}" stroke-opacity=".6" stroke-width="1.5"/>'
        return s

    def phone(self, x, y, z, content='chat', depth_bias=0) -> None:
        self.panel(x, y, z, 34, 64, content, 'left', depth_bias)

    def person(self, x, y, z=0, tone='base') -> None:
        self.cylinder(x, y, z, 7, 22, tone)
        hx, hy = P(x, y, z + 31)
        self.add(x + y + z * 0.3 + 0.2, f'<circle cx="{hx:.1f}" cy="{hy:.1f}" r="7.5" fill="url(#head)"/><circle cx="{hx:.1f}" cy="{hy:.1f}" r="7.5" fill="none" stroke="{SKY}" stroke-opacity=".35"/>')

    def link(self, a, b, z=0, color=SKY, dash=False, op=0.55) -> None:
        (x1, y1), (x2, y2) = P(*a, z), P(*b, z)
        dash_attr = ' stroke-dasharray="5 6"' if dash else ''
        self.add(-500, f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{color}" stroke-opacity="{op}" stroke-width="2"{dash_attr}/>'
                       f'<circle cx="{x2:.1f}" cy="{y2:.1f}" r="3" fill="{color}"/>')

    def bubble(self, sx, sy, w=70, h=34, color=SKY, lines=2) -> None:
        """A floating chat bubble, drawn flat in screen space above the scene."""
        tail = f'M{sx + 14},{sy + h} l-2,12 l14,-12 Z'
        s = (f'<g filter="url(#soft)"><rect x="{sx}" y="{sy}" width="{w}" height="{h}" rx="10" fill="#10243a" stroke="{color}" stroke-opacity=".7"/>'
             f'<path d="{tail}" fill="#10243a" stroke="{color}" stroke-opacity=".7"/></g>')
        for i in range(lines):
            lw = (w - 24) * (1 if i == 0 else 0.62)
            s += f'<rect x="{sx + 12}" y="{sy + 10 + i * 9}" width="{lw:.0f}" height="4" rx="2" fill="{color}" opacity=".85"/>'
        self.screen.append(s)

    def badge(self, sx, sy, glyph: str, color=SKY, r=19, world=False) -> None:
        """A round floating badge with a simple glyph path drawn in a 24x24 box."""
        (self.overlay if world else self.screen).append(
            f'<g filter="url(#soft)"><circle cx="{sx}" cy="{sy}" r="{r}" fill="#10243a" stroke="{color}" stroke-opacity=".8" stroke-width="1.5"/></g>'
            f'<g transform="translate({sx - 12} {sy - 12})" fill="none" stroke="{color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">{glyph}</g>')

    def arcs(self, sx, sy, n=3, color=SKY, start=14, step=11, sweep=(-60, 60)) -> None:
        s = ''
        for i in range(n):
            r = start + i * step
            a0, a1 = math.radians(sweep[0] - 90), math.radians(sweep[1] - 90)
            x0, y0 = sx + r * math.cos(a0), sy + r * math.sin(a0)
            x1, y1 = sx + r * math.cos(a1), sy + r * math.sin(a1)
            if TRACK is not None:
                TRACK.extend([(x0, y0), (x1, y1), (sx, sy - r)])
            s += f'<path d="M{x0:.1f},{y0:.1f} A{r},{r} 0 0 1 {x1:.1f},{y1:.1f}" fill="none" stroke="{color}" stroke-opacity="{0.9 - i * 0.22:.2f}" stroke-width="2.2" stroke-linecap="round"/>'
        self.overlay.append(s)

    # ---------------------------------------------------------- output
    def render(self) -> str:
        global TRACK
        body = ''.join(i.svg for i in sorted(self.items, key=lambda i: i.depth))
        xs = [p[0] for p in TRACK]; ys = [p[1] for p in TRACK]
        TRACK = None
        bw, bh = max(xs) - min(xs), max(ys) - min(ys)
        k = min(400 / bw, 285 / bh, 1.75)
        cx, cy = (max(xs) + min(xs)) / 2, (max(ys) + min(ys)) / 2
        tx, ty = 320 - k * cx, 218 - k * cy
        fit = f'translate({tx:.1f} {ty:.1f}) scale({k:.3f})'
        return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" aria-label="{self.label}">
{DEFS}
<rect width="{W}" height="{H}" fill="url(#bg)"/>
<g transform="{fit}">
{FLOOR}
{body}
{''.join(self.overlay)}
</g>
{''.join(self.screen)}
</svg>
'''


DEFS = f'''<defs>
<linearGradient id="bg" x1="0" y1="0" x2="{W}" y2="{H}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#0d2136"/><stop offset=".55" stop-color="#0e2740"/><stop offset="1" stop-color="#071320"/></linearGradient>
<linearGradient id="fTop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2d5675"/><stop offset="1" stop-color="#22455f"/></linearGradient>
<linearGradient id="fLeft" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1d3f5a"/><stop offset="1" stop-color="#142e46"/></linearGradient>
<linearGradient id="fRight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#112436"/><stop offset="1" stop-color="#0a1a29"/></linearGradient>
<linearGradient id="lTop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3f6f93"/><stop offset="1" stop-color="#335d7d"/></linearGradient>
<linearGradient id="lLeft" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a5577"/><stop offset="1" stop-color="#1f4461"/></linearGradient>
<linearGradient id="lRight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#183650"/><stop offset="1" stop-color="#10263a"/></linearGradient>
<linearGradient id="gTop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fd3ee"/><stop offset="1" stop-color="#61c0e0"/></linearGradient>
<linearGradient id="gLeft" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3d8fc0"/><stop offset="1" stop-color="#2f6f99"/></linearGradient>
<linearGradient id="gRight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#26557a"/><stop offset="1" stop-color="#1b4060"/></linearGradient>
<linearGradient id="roof" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a5f9a"/><stop offset="1" stop-color="#2b4777"/></linearGradient>
<linearGradient id="cyl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1d3f5a"/><stop offset=".55" stop-color="#163650"/><stop offset="1" stop-color="#0a1a29"/></linearGradient>
<linearGradient id="cylG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3d8fc0"/><stop offset="1" stop-color="#1b4060"/></linearGradient>
<linearGradient id="screen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0f3550"/><stop offset="1" stop-color="#08192a"/></linearGradient>
<radialGradient id="head" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#3f6f93"/><stop offset="1" stop-color="#173550"/></radialGradient>
<radialGradient id="pool" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="{SKY}" stop-opacity=".22"/><stop offset="1" stop-color="{SKY}" stop-opacity="0"/></radialGradient>
<radialGradient id="shadow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#04101b" stop-opacity=".7"/><stop offset="1" stop-color="#04101b" stop-opacity="0"/></radialGradient>
<filter id="soft" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#000" flood-opacity=".45"/></filter>
</defs>'''


def _floor() -> str:
    a, b, c, d = P(-150, -150), P(150, -150), P(150, 150), P(-150, 150)
    lines = []
    for t in range(-150, 151, 50):
        lines.append(f'M{P(t, -150)[0]:.1f} {P(t, -150)[1]:.1f}L{P(t, 150)[0]:.1f} {P(t, 150)[1]:.1f}')
        lines.append(f'M{P(-150, t)[0]:.1f} {P(-150, t)[1]:.1f}L{P(150, t)[0]:.1f} {P(150, t)[1]:.1f}')
    cx, cy = P(0, 0)
    return (f'<polygon points="{pts([a, b, c, d])}" fill="#0a1b2b" opacity=".55"/>'
            f'<path d="{"".join(lines)}" stroke="{SKY}" stroke-opacity=".1" stroke-width="1"/>'
            f'<ellipse cx="{cx:.1f}" cy="{cy:.1f}" rx="250" ry="120" fill="url(#pool)"/>')


FLOOR = _floor()

# Glyphs for badges (24x24 boxes, stroke-only).
G = {
    'wifi': '<path d="M3 9a13 13 0 0 1 18 0"/><path d="M6.5 12.5a8 8 0 0 1 11 0"/><path d="M10 16a3 3 0 0 1 4 0"/><circle cx="12" cy="19" r="1"/>',
    'cart': '<path d="M3 4h3l2.5 11h10l2-8H7"/><circle cx="10" cy="19.5" r="1.5"/><circle cx="17" cy="19.5" r="1.5"/>',
    'cross': '<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z"/>',
    'cap': '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>',
    'taka': '<path d="M7 4c3 0 4 1.5 4 4v9c0 2 1 3 3 3s4-1.5 4-4"/><path d="M5 9h9"/>',
    'shield': '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
    'pin': '<path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>',
    'cup': '<path d="M4 9h13v5a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6z"/><path d="M17 11h2a2 2 0 0 1 0 4h-2"/><path d="M8 3v3M12 3v3"/>',
    'heart': '<path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z"/>',
    'brief': '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V4h6v3"/><path d="M3 12h18"/>',
    'gear': '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/>',
    'mic': '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
    'spark': '<path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/>',
    'bolt': '<path d="M13 2L5 14h6l-1 8 8-12h-6z"/>',
    'barcode': '<path d="M4 5v14M7 5v14M10 5v14M14 5v14M16 5v14M20 5v14"/>',
    'alert': '<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.5"/>',
    'phone': '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
    'flag': '<path d="M5 21V4M5 4h12l-2 4 2 4H5"/>',
}


# =================================================================== scenes
def isp_telecom() -> Scene:
    s = Scene('An isometric telecom mast beaming signal to a router cabinet and a row of connected homes')
    s.shadow(-60, -60, 30, 30)
    s.box(-58, -58, 0, 24, 24, 160, 'base', depth_bias=-20)
    s.box(-62, -62, 160, 32, 32, 10, 'light')
    s.box(10, -40, 0, 50, 40, 62, 'base', s.windows(10, -40, 0, 50, 40, 62, 3, 2, 0, lit={('l', 0, 0), ('l', 1, 1), ('l', 2, 0)}))
    for i, (x, y) in enumerate(((70, 40), (110, 10), (20, 70))):
        s.box(x, y, 0, 34, 30, 28, 'base', s.windows(x, y, 0, 34, 30, 28, 1, 2, 1, lit={('l', 0, i % 2)}))
        s.gable(x, y, 28, 34, 30, 16)
        s.link((35, -20), (x + 17, y + 15))
    s.link((-46, -46), (35, -20))
    sx, sy = P(-46, -46, 175)
    s.arcs(sx, sy, 3)
    s.badge(560, 70, G['wifi'])
    return s


def retail() -> Scene:
    s = Scene('An isometric shop with a striped awning, a point-of-sale counter and parcels ready for delivery')
    s.shadow(-80, -60, 120, 80)
    s.box(-80, -70, 0, 110, 70, 90, 'base', s.windows(-80, -70, 0, 110, 70, 90, 2, 3, 2, lit={('l', 0, 0), ('l', 0, 2), ('r', 1, 0)}))
    for i in range(6):
        col = SKY if i % 2 == 0 else '#1d3f5a'
        s.add(60, f'<polygon points="{pts([P(-80 + i * 18.3, 0, 72), P(-80 + (i + 1) * 18.3, 0, 72), P(-80 + (i + 1) * 18.3, 22, 60), P(-80 + i * 18.3, 22, 60)])}" fill="{col}" opacity=".9"/>')
    s.box(40, 30, 0, 60, 30, 34, 'light')
    s.panel(56, 34, 34, 34, 30, 'rows', 'left', depth_bias=2)
    for (x, y, h) in ((-40, 50, 22), (-14, 54, 30), (-30, 82, 18)):
        s.box(x, y, 0, 24, 24, h, 'glow' if h == 30 else 'base')
    s.badge(560, 70, G['cart'])
    s.bubble(515, 150, 80, 36)
    return s


def manufacturing() -> Scene:
    s = Scene('An isometric garment factory with a saw-tooth roof and chimney, and finished cartons on a conveyor')
    s.shadow(-110, -80, 150, 90)
    s.box(-110, -90, 0, 150, 80, 64, 'base', s.windows(-110, -90, 0, 150, 80, 64, 2, 5, 2, lit={('l', 0, 1), ('l', 1, 3), ('l', 0, 4)}))
    for i in range(4):
        x = -110 + i * 37.5
        s.add(i * 3 - 10, f'<polygon points="{pts([P(x, -90, 64), P(x, -10, 64), P(x, -10, 92), P(x, -90, 92)])}" fill="url(#fLeft)"/>'
                          f'<polygon points="{pts([P(x, -90, 92), P(x, -10, 92), P(x + 37.5, -10, 64), P(x + 37.5, -90, 64)])}" fill="url(#roof)"/>'
                          f'<polygon points="{pts([P(x + 2, -8, 66), P(x + 30, -8, 66), P(x + 2, -8, 88)])}" fill="{SKY}" opacity=".35"/>')
    s.cylinder(10, -70, 64, 9, 70, 'base', 2)
    s.box(-60, 20, 0, 170, 22, 14, 'light')
    for i, x in enumerate((-50, -10, 30, 70)):
        s.box(x, 22, 14, 24, 18, 20, 'glow' if i == 2 else 'base')
    s.badge(560, 70, G['gear'])
    return s


def healthcare() -> Scene:
    s = Scene('An isometric hospital with a glowing cross, an ambulance bay and a heart-rate monitor')
    s.shadow(-90, -80, 120, 90)
    det = s.windows(-90, -80, 0, 110, 80, 110, 4, 3, 3, lit={('l', 0, 1), ('l', 2, 2), ('r', 1, 1), ('r', 3, 0)})
    s.box(-90, -80, 0, 110, 80, 110, 'base', det)
    cx, cy = P(-35, 0, 122)
    s.box(-55, -40, 110, 40, 40, 8, 'light')
    s.overlay.append(f'<g transform="translate({cx - 16:.1f} {cy - 46:.1f})"><path d="M11 0h10v11h11v10H21v11H11V21H0V11h11z" fill="{RED}"/></g>')
    s.panel(50, 30, 0, 70, 52, 'pulse', 'left')
    s.box(40, -60, 0, 50, 34, 26, 'light')
    s.badge(560, 70, G['heart'], RED)
    s.bubble(512, 150, 84, 36)
    return s


def education() -> Scene:
    s = Scene('An isometric school building with a flag, a stack of books and a classroom screen')
    s.shadow(-100, -70, 150, 80)
    s.box(-100, -70, 0, 150, 70, 70, 'base', s.windows(-100, -70, 0, 150, 70, 70, 2, 5, 2, lit={('l', 0, 0), ('l', 1, 2), ('l', 0, 4), ('r', 1, 1)}))
    s.gable(-40, -70, 70, 40, 70, 30)
    s.box(-38, -60, 0, 4, 4, 150, 'light', depth_bias=-30)
    fx, fy = P(-36, -58, 150)
    s.overlay.append(f'<path d="M{fx:.1f},{fy:.1f} l34,-6 l-6,12 l8,10 l-36,4 z" fill="{SKY}" opacity=".9"/>')
    for i, (h, t) in enumerate(((10, 'glow'), (9, 'base'), (11, 'light'), (8, 'base'))):
        s.box(60 - i * 2, 40 + i * 2, i * 11, 46, 30, h, t, depth_bias=i)
    s.panel(-20, 40, 0, 64, 46, 'line', 'left')
    s.badge(560, 70, G['cap'])
    return s


def banking() -> Scene:
    s = Scene('An isometric bank with columns, a vault and stacks of coins behind a security shield')
    s.shadow(-100, -80, 140, 90)
    s.box(-100, -80, 0, 130, 80, 14, 'light')
    for i in range(5):
        s.box(-92 + i * 26, -6, 14, 10, 10, 66, 'base', depth_bias=2)
    s.box(-100, -80, 14, 130, 70, 66, 'base', s.windows(-100, -80, 14, 130, 70, 66, 2, 0, 2, lit={('r', 0, 1)}))
    s.box(-104, -84, 80, 138, 88, 12, 'light')
    s.gable(-104, -84, 92, 138, 88, 26)
    for i, (x, y, n) in enumerate(((60, 20, 4), (90, 40, 6), (60, 60, 3))):
        for k in range(n):
            s.cylinder(x, y, k * 6, 12, 6, 'glow' if k == n - 1 else 'base')
    s.badge(560, 70, G['shield'])
    s.badge(560, 125, G['taka'], SKY, 16)
    return s


def government() -> Scene:
    s = Scene('An isometric public building with a stepped plinth, a flag and an in-country server')
    s.shadow(-110, -90, 160, 110)
    s.box(-110, -90, 0, 170, 110, 12, 'light')
    s.box(-100, -80, 12, 150, 90, 10, 'light')
    s.box(-90, -70, 22, 130, 70, 80, 'base', s.windows(-90, -70, 22, 130, 70, 80, 3, 4, 2, lit={('l', 0, 1), ('l', 2, 3), ('r', 1, 0)}))
    s.box(-55, -50, 102, 60, 40, 22, 'light')
    s.cylinder(-25, -30, 124, 18, 14, 'glow')
    s.box(80, 30, 0, 36, 36, 70, 'base', s.windows(80, 30, 0, 36, 36, 70, 4, 1, 1, lit={('l', 0, 0), ('l', 2, 0), ('r', 1, 0)}))
    s.link((10, 20), (90, 45))
    s.badge(560, 70, G['flag'])
    return s


def real_estate() -> Scene:
    s = Scene('An isometric skyline of residential towers with a construction crane and a location pin')
    for (x, y, w, d, h, t) in ((-110, -80, 50, 50, 170, 'base'), (-40, -90, 44, 44, 120, 'base'), (20, -60, 52, 52, 90, 'base'), (-80, 0, 40, 40, 70, 'light'), (40, 20, 46, 40, 50, 'base')):
        s.shadow(x, y, w, d)
        s.box(x, y, 0, w, d, h, t, s.windows(x, y, 0, w, d, h, max(2, h // 26), 2, 2, lit={('l', 0, 0), ('l', 2, 1), ('r', 1, 0), ('r', 3, 1)}))
    s.box(90, -40, 0, 8, 8, 150, 'light', depth_bias=-40)
    a, b = P(94, -36, 150), P(-10, -36, 150)
    s.overlay.append(f'<line x1="{a[0]:.1f}" y1="{a[1]:.1f}" x2="{b[0] - 60:.1f}" y2="{b[1] - 60:.1f}" stroke="{SKY_SOFT}" stroke-width="4"/>'
                     f'<line x1="{b[0] - 30:.1f}" y1="{b[1] - 30:.1f}" x2="{b[0] - 30:.1f}" y2="{b[1] + 10:.1f}" stroke="{SKY}" stroke-width="1.5" stroke-dasharray="3 3"/>')
    s.badge(560, 70, G['pin'])
    return s


def restaurant() -> Scene:
    s = Scene('An isometric restaurant front with an awning, tables with plates and a booking chat')
    s.shadow(-110, -80, 130, 70)
    s.box(-110, -80, 0, 130, 70, 80, 'base', s.windows(-110, -80, 0, 130, 70, 80, 2, 4, 2, lit={('l', 0, 0), ('l', 0, 1), ('l', 0, 2), ('l', 0, 3)}))
    for i in range(7):
        col = SKY if i % 2 == 0 else '#1d3f5a'
        s.add(40, f'<polygon points="{pts([P(-110 + i * 18.57, -10, 64), P(-110 + (i + 1) * 18.57, -10, 64), P(-110 + (i + 1) * 18.57, 14, 52), P(-110 + i * 18.57, 14, 52)])}" fill="{col}" opacity=".9"/>')
    for (x, y) in ((40, 10), (70, 60), (0, 60)):
        s.cylinder(x + 15, y + 15, 0, 3, 20)
        s.box(x, y, 20, 30, 30, 4, 'light')
        s.cylinder(x + 15, y + 15, 24, 7, 2, 'glow')
    s.badge(560, 70, G['cup'])
    s.bubble(512, 150, 84, 36)
    return s


def ngo() -> Scene:
    s = Scene('An isometric village of small homes connected to a field officer with a phone')
    for i, (x, y) in enumerate(((-110, -60), (-60, -90), (-10, -60), (-90, 0), (40, -20))):
        s.shadow(x, y, 34, 30)
        s.box(x, y, 0, 34, 30, 26, 'base', s.windows(x, y, 0, 34, 30, 26, 1, 1, 1, lit={('l', 0, 0)} if i % 2 == 0 else set()))
        s.gable(x, y, 26, 34, 30, 18, 'base')
    for (x, y) in ((40, 60), (70, 50)):
        s.person(x, y)
    s.phone(90, 80, 0, 'wave')
    s.link((-40, 20), (40, 60), dash=True)
    s.link((60, 0), (60, 55), dash=True)
    s.badge(560, 70, G['heart'])
    return s


def corporate() -> Scene:
    s = Scene('An isometric glass office tower beside a desk with monitors and a team')
    s.shadow(-110, -90, 60, 60)
    s.box(-110, -90, 0, 60, 60, 180, 'base', s.windows(-110, -90, 0, 60, 60, 180, 7, 2, 2, lit={('l', 1, 0), ('l', 3, 1), ('l', 5, 0), ('r', 2, 1), ('r', 4, 0)}))
    s.box(-20, -20, 0, 120, 50, 28, 'light')
    s.panel(-10, -12, 28, 50, 36, 'bars', 'left', 1)
    s.panel(50, -12, 28, 44, 36, 'chat', 'left', 1)
    for (x, y) in ((0, 55), (40, 60), (80, 55)):
        s.person(x, y)
    s.badge(560, 70, G['brief'])
    return s


# ---------------------------------------------------------------- ventures
def v_isp_billing() -> Scene:
    s = Scene('An isometric billing server linked to a MikroTik router and homes, with a revenue dashboard')
    s.shadow(-100, -80, 50, 50)
    s.box(-100, -80, 0, 46, 46, 120, 'base', s.windows(-100, -80, 0, 46, 46, 120, 6, 1, 1, lit={('l', 0, 0), ('l', 2, 0), ('l', 4, 0), ('r', 1, 0), ('r', 3, 0)}))
    s.box(-20, -40, 0, 56, 30, 18, 'glow')
    s.panel(-30, 30, 0, 90, 60, 'bars', 'left')
    for (x, y) in ((70, -40), (100, 0), (90, 50)):
        s.box(x, y, 0, 28, 24, 22, 'base', s.windows(x, y, 0, 28, 24, 22, 1, 1, 1, lit={('l', 0, 0)}))
        s.gable(x, y, 22, 28, 24, 12)
        s.link((10, -25), (x + 14, y + 12))
    s.link((-54, -57), (-20, -25))
    s.badge(560, 70, G['taka'])
    return s


def v_tidegard() -> Scene:
    s = Scene('An isometric shield standing over network traffic, with attack packets stopped at the edge')
    s.shadow(-30, -30, 60, 60)
    s.box(-40, -40, 0, 60, 60, 24, 'light')
    s.box(-100, 40, 0, 40, 30, 16, 'base')
    s.box(60, -100, 0, 40, 30, 16, 'base')
    s.link((-80, 55), (-20, 0))
    s.link((80, -85), (0, -20))
    for i, (x, y) in enumerate(((120, 40), (110, 80), (140, 10))):
        s.box(x, y, 0, 10, 10, 10, 'base', s.on_left(x, y, 0, 10, 10, 0, 0, 10, 10, RED, 0.8), depth_bias=-5)
        s.link((x, y), (40, 20), color=RED, dash=True, op=0.5)
    cx, cy = P(-10, -10, 30)
    s.overlay.append(f'<g transform="translate({cx - 70:.1f} {cy - 160:.1f}) scale(5.8)" filter="url(#soft)"><path d="M12 2l9 3.4v6.6c0 5.6-3.9 9.2-9 10.6-5.1-1.4-9-5-9-10.6V5.4z" fill="url(#gLeft)" stroke="{SKY_PALE}" stroke-width=".4"/>'
                     f'<path d="M7.5 12l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></g>')
    TRACK.extend([(cx - 70, cy - 160), (cx + 70, cy - 30)])
    s.badge(560, 70, G['alert'], RED)
    return s


def v_amar_voice() -> Scene:
    s = Scene('An isometric phone on a stand showing a Bangla voice waveform, with sound waves and a call report')
    s.shadow(-40, -20, 60, 50)
    s.box(-50, -30, 0, 80, 60, 10, 'light')
    s.panel(-30, -6, 10, 48, 96, 'wave', 'left', 2)
    px, py = P(-6, -6, 70)
    s.arcs(px + 50, py - 20, 3, SKY, 18, 13, (20, 160))
    s.arcs(px - 50, py - 20, 3, SKY, 18, 13, (-160, -20))
    s.panel(60, 40, 0, 56, 70, 'rows', 'left')
    s.badge(560, 70, G['mic'])
    s.bubble(28, 150, 90, 36, SKY, 2)
    return s


def v_syncgpt() -> Scene:
    s = Scene('An isometric AI workspace: a large screen of chat replies, a team and a glowing spark')
    s.shadow(-80, -40, 140, 60)
    s.box(-90, -50, 0, 150, 50, 20, 'light')
    s.panel(-70, -30, 20, 120, 90, 'chat', 'left', 2)
    for (x, y) in ((-60, 50), (-20, 60), (20, 55)):
        s.person(x, y)
    s.box(80, 20, 0, 30, 30, 30, 'glow')
    s.badge(560, 70, G['spark'])
    s.bubble(512, 150, 96, 36, SKY, 2)
    s.bubble(30, 90, 80, 30, INDIGO, 1)
    return s


def v_pos() -> Scene:
    s = Scene('An isometric shop counter with a POS terminal, a receipt printer, a barcode scanner and stock boxes')
    s.shadow(-80, -40, 140, 60)
    s.box(-80, -40, 0, 140, 50, 46, 'base', s.windows(-80, -40, 0, 140, 50, 46, 1, 3, 1, lit=set(), margin=8))
    s.panel(-40, -30, 46, 60, 46, 'rows', 'left', 2)
    s.box(40, -30, 46, 20, 20, 14, 'light')
    rx, ry = P(50, -10, 62)
    s.overlay.append(f'<path d="M{rx - 8:.1f},{ry:.1f} l16,0 l0,-26 l-4,3 l-4,-3 l-4,3 l-4,-3 z" fill="#e8f4fa" opacity=".9"/>')
    for (x, y, h, t) in ((80, 40, 26, 'base'), (80, 70, 18, 'glow'), (110, 50, 34, 'base'), (-60, 50, 22, 'base')):
        s.box(x, y, 0, 26, 26, h, t)
    s.badge(560, 70, G['barcode'])
    s.badge(560, 125, G['taka'], SKY, 16)
    return s


def v_chatbots() -> Scene:
    s = Scene('An isometric chatbot cube with glowing eyes answering several floating chat bubbles')
    s.shadow(-40, -40, 70, 70)
    s.box(-40, -40, 0, 70, 70, 70, 'light',
          Scene.on_left(-40, -40, 0, 70, 70, 14, 36, 26, 50, SKY) + Scene.on_left(-40, -40, 0, 70, 70, 44, 36, 56, 50, SKY)
          + Scene.on_left(-40, -40, 0, 70, 70, 20, 16, 50, 22, SKY, 0.6))
    s.cylinder(-5, -5, 70, 3, 22, 'glow')
    hx, hy = P(-5, -5, 98)
    s.overlay.append(f'<circle cx="{hx:.1f}" cy="{hy:.1f}" r="7" fill="{SKY}"/>')
    s.phone(70, 40, 0, 'chat')
    s.box(-110, 30, 0, 50, 36, 30, 'base')
    s.panel(-110, 40, 30, 50, 34, 'chat', 'left', 1)
    s.bubble(28, 110, 92, 36, SKY, 2)
    s.bubble(518, 130, 92, 36, INDIGO, 2)
    s.bubble(530, 230, 80, 30, SKY, 1)
    s.badge(560, 60, G['bolt'])
    return s


def v_onekle() -> Scene:
    s = Scene('An isometric phone at the centre of orbiting app tiles for network, shopping, rides, food and payments')
    s.shadow(-20, -20, 50, 50)
    s.box(-30, -30, 0, 60, 60, 10, 'light')
    s.panel(-17, -5, 10, 40, 80, 'map', 'left', 2)
    cx, cy = P(0, 0, 50)
    s.overlay.append(f'<ellipse cx="{cx:.1f}" cy="{cy + 40:.1f}" rx="210" ry="90" fill="none" stroke="{SKY}" stroke-opacity=".3" stroke-dasharray="4 7"/>')
    for i, g in enumerate(('cart', 'pin', 'cup', 'taka', 'brief', 'wifi')):
        a = math.radians(200 + i * 30) if i < 3 else math.radians(-20 - (i - 3) * 30)
        bx, by = cx + 210 * math.cos(a), cy + 40 + 90 * math.sin(a)
        s.badge(round(bx), round(by), G[g], SKY if i % 2 == 0 else SKY_PALE, 20, world=True)
        TRACK.extend([(bx - 22, by - 22), (bx + 22, by + 22)])
    return s


SCENES = {
    'industries': {
        'isp-telecom': isp_telecom, 'retail-ecommerce': retail, 'manufacturing-rmg': manufacturing,
        'healthcare': healthcare, 'education': education, 'banking-finance': banking,
        'government': government, 'real-estate': real_estate, 'restaurants-hospitality': restaurant,
        'ngo-microfinance': ngo, 'corporate': corporate,
    },
    'ventures': {
        'isp-billing': v_isp_billing, 'tidegard': v_tidegard, 'amar-voice': v_amar_voice,
        'syncgpt': v_syncgpt, 'pos': v_pos, 'industry-chatbots': v_chatbots, 'onekle': v_onekle,
    },
}


def main() -> None:
    root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public', 'art')
    for group, scenes in SCENES.items():
        out = os.path.join(root, group)
        os.makedirs(out, exist_ok=True)
        for slug, fn in scenes.items():
            with open(os.path.join(out, f'{slug}.svg'), 'w') as f:
                f.write(fn().render())
            print(f'public/art/{group}/{slug}.svg')


if __name__ == '__main__':
    main()
