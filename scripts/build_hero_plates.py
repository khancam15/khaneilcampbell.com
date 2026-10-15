#!/usr/bin/env python3
"""Draw the hero plates for the Work, About and Contact pages.

Each plate is a static SVG in the homepage's "Mist and glass" vocabulary:
morning sky, a misted horizon, still water with ripples, and white slab
architecture with lit glass. The homepage scene is drawn live by site.js;
these are its quieter companions, so they use the same palette and the same
slab construction but no text and no filters (Safari rasterises SVG filters
inside <img> at low resolution, so glows are radial gradients instead).

Run from the repository root:  python3 scripts/build_hero_plates.py
"""
from pathlib import Path

W, H, HZ = 1200, 800, 500          # canvas and horizon
SK, D, T = 34, 22, 13              # receding skew, top depth, slab thickness
OUT = Path("images/scenes")


def defs():
    return """<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfd8e0"/><stop offset=".55" stop-color="#e3e8ec"/><stop offset="1" stop-color="#f1f3f4"/></linearGradient>
<linearGradient id="water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dfe5e9"/><stop offset=".4" stop-color="#c9d3da"/><stop offset="1" stop-color="#b4c1ca"/></linearGradient>
<linearGradient id="glass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe0ee" stop-opacity=".9"/><stop offset="1" stop-color="#9fc0db" stop-opacity=".75"/></linearGradient>
<linearGradient id="hot" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9ebfb" stop-opacity=".95"/><stop offset="1" stop-color="#6fa8d6" stop-opacity=".9"/></linearGradient>
<linearGradient id="face" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e9ecee"/></linearGradient>
<linearGradient id="mist" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".7"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="refl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<radialGradient id="sun"><stop offset="0" stop-color="#fff" stop-opacity=".8"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
<linearGradient id="beam" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6fa8d6" stop-opacity=".35"/><stop offset="1" stop-color="#6fa8d6" stop-opacity="0"/></linearGradient>
<radialGradient id="glow"><stop offset="0" stop-color="#6fa8d6" stop-opacity=".45"/><stop offset="1" stop-color="#6fa8d6" stop-opacity="0"/></radialGradient>
<mask id="rm"><rect x="0" y="%d" width="%d" height="%d" fill="url(#refl)"/></mask>
</defs>""" % (HZ, W, H - HZ)


def ground(sun_x, seed=7):
    out = [f'<rect width="{W}" height="{HZ + 2}" fill="url(#sky)"/>',
           f'<circle cx="{sun_x}" cy="150" r="240" fill="url(#sun)"/>',
           f'<path d="M0 {HZ} L0 {HZ-16} C150 {HZ-26} 280 {HZ-10} 440 {HZ-19} S700 {HZ-7} 820 {HZ-12} L820 {HZ}Z" fill="#c3ccd3" opacity=".5"/>',
           f'<path d="M1000 {HZ} C1060 {HZ-14} 1130 {HZ-9} {W} {HZ-17} L{W} {HZ}Z" fill="#c3ccd3" opacity=".42"/>',
           f'<rect y="{HZ}" width="{W}" height="{H-HZ}" fill="url(#water)"/>']
    s = seed
    lines = []
    for _ in range(40):
        s = (s * 9301 + 49297) % 233280; a = s / 233280
        s = (s * 9301 + 49297) % 233280; b = s / 233280
        s = (s * 9301 + 49297) % 233280; c = s / 233280
        y = HZ + 8 + a ** 1.6 * (H - HZ - 8)
        x = b * W
        ln = 26 + c * 140 * (y - HZ) / (H - HZ) + 16
        lines.append(f'<line x1="{x:.0f}" y1="{y:.0f}" x2="{x+ln:.0f}" y2="{y:.0f}" stroke="#fff" stroke-width="{.6+(y-HZ)/240:.2f}" opacity="{.35+c*.35:.2f}"/>')
    out.append('<g opacity=".5">' + "".join(lines) + "</g>")
    return out


def slab(x0, x1, y):
    """A white floor slab whose front face spans x0..x1 with its top at y."""
    return [f'<polygon points="{x0},{y+T} {x1},{y+T} {x1},{y} {x0},{y}" fill="url(#face)" stroke="rgba(18,21,26,.08)"/>',
            f'<polygon points="{x1},{y+T} {x1+SK},{y+T-D} {x1+SK},{y-D} {x1},{y}" fill="#d7dbdf"/>',
            f'<polygon points="{x0},{y} {x1},{y} {x1+SK},{y-D} {x0+SK},{y-D}" fill="#fbfbfc"/>']


def pavilion(cx, floor, widths, heights, hot=None):
    """Stacked glass storeys under slabs, like the homepage pavilion."""
    out = []
    for i, (w, gh) in enumerate(zip(widths, heights)):
        x0 = cx - w / 2 + i * 5
        x1 = x0 + w
        top = floor - gh
        gi = w * .1
        lit = hot is not None and i == hot
        if lit:
            out.append(f'<ellipse cx="{(x0+x1)/2:.0f}" cy="{(top+floor)/2:.0f}" rx="{w*.75:.0f}" ry="{gh*1.4:.0f}" fill="url(#glow)"/>')
        out.append(f'<rect x="{x0+gi:.1f}" y="{top:.1f}" width="{w-2*gi:.1f}" height="{gh}" fill="url(#{"hot" if lit else "glass"})"/>')
        mx = x0 + gi + 18
        while mx < x1 - gi - 4:
            out.append(f'<line x1="{mx:.1f}" y1="{top:.1f}" x2="{mx:.1f}" y2="{floor:.1f}" stroke="#fff" stroke-width="1" opacity=".7"/>')
            mx += 22
        for cxx in (x0 + 11, x1 - 11):
            out.append(f'<rect x="{cxx-2:.1f}" y="{top:.1f}" width="4" height="{gh}" fill="#f4f5f6"/>')
        y = top - T
        out += slab(round(x0, 1), round(x1, 1), round(y, 1))
        out.append(f'<rect x="{x0+gi:.1f}" y="{top:.1f}" width="{w-2*gi:.1f}" height="4" fill="rgba(18,21,26,.12)"/>')
        floor = y - D / 2
    return out


def frame(cx, floor, widths, heights):
    """Storeys still being built: columns and dashed slab outlines, no glass."""
    out = []
    for i, (w, gh) in enumerate(zip(widths, heights)):
        x0 = cx - w / 2 + i * 5
        x1 = x0 + w
        top = floor - gh
        for cxx in (x0 + 11, x0 + w / 2, x1 - 11):
            out.append(f'<rect x="{cxx-1.5:.1f}" y="{top:.1f}" width="3" height="{gh}" fill="#c4ccd3"/>')
        out.append(f'<rect x="{x0+w*.1:.1f}" y="{top:.1f}" width="{w*.8:.1f}" height="{gh}" fill="rgba(255,255,255,.25)" stroke="#2a64a8" stroke-opacity=".35" stroke-dasharray="4 5"/>')
        y = top - T
        out.append(f'<polygon points="{x0:.1f},{y+T:.1f} {x1:.1f},{y+T:.1f} {x1+SK:.1f},{y+T-D:.1f} {x1+SK:.1f},{y-D:.1f} {x0+SK:.1f},{y-D:.1f} {x0:.1f},{y:.1f}" fill="rgba(255,255,255,.35)" stroke="#2a64a8" stroke-opacity=".55" stroke-dasharray="6 5"/>')
        floor = y - D / 2
    return out


def beam(x, y, x2, y2, spread):
    """A soft cone of light from a lit storey out across the water."""
    return [f'<polygon points="{x},{y} {x2},{y2-spread} {x2},{y2+spread}" fill="url(#beam)"/>']


def plinth(x0, x1, base):
    return [f'<polygon points="{x0},{base} {x1},{base} {x1+SK},{base-D} {x0+SK},{base-D}" fill="#f6f7f8"/>',
            f'<rect x="{x0}" y="{base}" width="{x1-x0}" height="8" fill="#d9dde0"/>',
            f'<polygon points="{x1},{base} {x1+SK},{base-D} {x1+SK},{base-D+8} {x1},{base+8}" fill="#c9ced2"/>']


def person(x, base, s=1.0):
    return [f'<rect x="{x-2*s:.1f}" y="{base-20*s:.1f}" width="{4*s:.1f}" height="{14*s:.1f}" rx="{2*s:.1f}" fill="#2b3037"/>',
            f'<circle cx="{x:.1f}" cy="{base-23*s:.1f}" r="{2.4*s:.1f}" fill="#2b3037"/>']


def compose(name, sun_x, building, base, span, near=()):
    """Ground, the building with a soft reflection, horizon mist, then the
    near items (walkways, people on them), which sit below the horizon and
    so are never mirrored. The view crops the empty upper sky to 2:1."""
    body = "".join(building)
    x0, x1 = span
    shadow = f'<ellipse cx="{(x0+x1)/2:.0f}" cy="{base+12}" rx="{(x1-x0)/2:.0f}" ry="12" fill="rgba(18,21,26,.07)"/>'
    svg = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 200 {W} {H-200}" width="{W}" height="{H-200}">', defs()]
    svg += ground(sun_x)
    svg.append(f'<g mask="url(#rm)" opacity=".5"><g transform="translate(0 {2*(base+8)}) scale(1 -1)">{body}</g></g>')
    svg.append(shadow + body)
    svg.append(f'<rect y="{HZ-60}" width="{W}" height="120" fill="url(#mist)" opacity=".8"/>')
    svg.append("".join(near))
    svg.append("</svg>")
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / f"{name}.svg").write_text("\n".join(svg) + "\n")


def work():
    # Three builds on one plinth: three pavilions, the middle one lit.
    base = 560
    b = plinth(150, 1030, base)
    b += pavilion(300, base - D / 2, [200, 150], [60, 54])
    b += pavilion(600, base - D / 2, [250, 200, 140], [62, 58, 54], hot=2)
    b += pavilion(895, base - D / 2, [190, 140], [58, 52])
    b += person(205, base - 4) + person(216, base - 4)
    compose("work", 820, b, base, (150, 1064))


def about():
    # A long walkway over the water leading to one low pavilion.
    base = 548
    n = []
    # walkway from the lower left toward the plinth, drawn as receding slabs
    for i in range(7):
        x0 = 40 + i * 62
        y = 690 - i * 20
        n.append(f'<polygon points="{x0},{y} {x0+70},{y} {x0+70+SK*.6:.0f},{y-14} {x0+SK*.6:.0f},{y-14}" fill="#f6f7f8" stroke="rgba(18,21,26,.06)"/>')
        n.append(f'<rect x="{x0}" y="{y}" width="70" height="6" fill="#d9dde0"/>')
    b = plinth(470, 1080, base)
    b += pavilion(760, base - D / 2, [470, 320], [70, 62], hot=1)
    n += person(300, 618, .95)
    compose("about", 980, b, base, (470, 1114), n)


def contact():
    # A jetty running out toward the horizon, ending at a small lit pavilion.
    base = 536
    n = []
    # the jetty: a long slab narrowing as it recedes to the right
    n.append(f'<polygon points="60,700 520,{base+6} 560,{base-6} 150,700" fill="#f6f7f8" stroke="rgba(18,21,26,.06)"/>')
    n.append(f'<polygon points="60,700 150,700 150,708 60,708" fill="#d9dde0"/>')
    for i in range(1, 9):
        t = i / 9
        x = 60 + t * 460
        y = 700 - t * (700 - base - 6)
        n.append(f'<rect x="{x:.0f}" y="{y:.0f}" width="{3-t*1.5:.1f}" height="{30-t*20:.0f}" fill="#c9ced2"/>')
    b = plinth(520, 900, base)
    b += pavilion(710, base - D / 2, [260, 170], [62, 56], hot=0)
    n += person(250, 640, .9)
    compose("contact", 760, b, base, (520, 934), n)


def benjaire():
    # Two business pillars on one plinth, joined by a glass bridge: Digital
    # Solutions is lit and built; Consumer Brands has its upper storey still
    # in outline, because no brand is public yet.
    base = 556
    b = plinth(130, 1060, base)
    b += pavilion(360, base - D / 2, [300, 220], [66, 60], hot=1)
    b += pavilion(820, base - D / 2, [300], [66])
    b += frame(825, base - D / 2 - 66 - T - D / 2, [220], [60])
    by = base - D / 2 - 66 - T - D / 2 - 30
    b.append(f'<rect x="500" y="{by:.0f}" width="190" height="20" fill="url(#glass)" stroke="#fff"/>')
    b.append(f'<rect x="500" y="{by-6:.0f}" width="190" height="6" fill="#fbfbfc"/>')
    b += person(200, base - 4) + person(212, base - 4)
    compose("benjaire", 900, b, base, (130, 1094))


def soc():
    # A watchtower over the water: the lit top storey watches, and a cone of
    # light sweeps the surface, the way a detection watches a log stream.
    base = 570
    b = plinth(420, 760, base)
    b += pavilion(560, base - D / 2, [180, 150, 130, 115], [52, 46, 46, 46], hot=3)
    b += pavilion(700, base - D / 2, [120], [44])
    top_y = base - D / 2 - (52 + 46 + 46) - 3 * (T + D / 2) - 23
    near = beam(625, top_y, 1200, 480, 110)
    compose("soc", 300, b, base, (420, 794), near)


def labs():
    # Three test pods on their own piers: one finished and lit, two framed
    # out, matching one published lab and two in progress.
    base = 560
    b = []
    for x0, x1 in ((140, 420), (470, 750), (800, 1080)):
        b += plinth(x0, x1, base)
    b += pavilion(280, base - D / 2, [210], [62], hot=0)
    b += frame(610, base - D / 2, [210], [62])
    b += frame(940, base - D / 2, [210], [62])
    b += person(180, base - 4)
    compose("labs", 700, b, base, (140, 1114))


def lab_details():
    # A long, low archive: one bay per case file, the published one lit.
    base = 556
    b = plinth(100, 1100, base)
    floor = base - D / 2
    x0, x1, gh = 160, 1040, 74
    top = floor - gh
    b.append(f'<rect x="{x0}" y="{top}" width="{x1-x0}" height="{gh}" fill="url(#glass)"/>')
    b.append(f'<rect x="{x0}" y="{top}" width="{(x1-x0)/3:.0f}" height="{gh}" fill="url(#hot)"/>')
    for k, fx in enumerate(range(x0, x1 + 1, 22)):
        wgt = 3 if (fx - x0) % 110 == 0 else 1
        b.append(f'<rect x="{fx-wgt/2:.1f}" y="{top}" width="{wgt}" height="{gh}" fill="#f4f5f6" opacity=".9"/>')
    b += slab(x0 - 20, x1 + 20, top - T)
    b.append(f'<rect x="{x0}" y="{top}" width="{x1-x0}" height="4" fill="rgba(18,21,26,.12)"/>')
    b += person(1065, base - 4)
    compose("lab-details", 420, b, base, (100, 1134))


def security_plus():
    # Defence in depth: a pavilion standing within three stepped perimeters.
    base = 580
    b = plinth(140, 1060, base)
    b += plinth(240, 960, base - D - 2)
    b += plinth(340, 860, base - 2 * D - 4)
    b += pavilion(600, base - 2 * D - 4 - D / 2, [330, 220], [66, 58], hot=1)
    b += person(190, base - 4)
    compose("security-plus", 820, b, base, (140, 1094))


def itil4():
    # The service value chain as a loop: a boardwalk ring around the pavilion.
    base = 556
    n = []
    cx, cy = 600, 690
    n.append(f'<ellipse cx="{cx}" cy="{cy}" rx="520" ry="78" fill="#f6f7f8" stroke="rgba(18,21,26,.06)"/>')
    n.append(f'<ellipse cx="{cx}" cy="{cy+4}" rx="472" ry="60" fill="url(#water)"/>')
    for k in range(18):
        import math
        a = math.pi * 2 * k / 18
        x = cx + 495 * math.cos(a)
        y = cy + 69 * math.sin(a)
        if math.sin(a) > -.2:
            n.append(f'<rect x="{x-1:.0f}" y="{y+6:.0f}" width="2.5" height="18" fill="#c9ced2"/>')
    b = plinth(400, 800, base)
    b += pavilion(600, base - D / 2, [300, 210], [64, 58], hot=1)
    n += person(150, 690, .9)
    compose("itil4", 300, b, base, (400, 834), n)


def lost():
    # Error page: the plinth is here, the building is not yet.
    base = 556
    b = plinth(360, 840, base)
    b += frame(600, base - D / 2, [320, 230], [66, 60])
    b += person(560, base - 4, .95)
    compose("lost", 760, b, base, (360, 874))


if __name__ == "__main__":
    work(); about(); contact()
    benjaire(); soc(); labs(); lab_details(); security_plus(); itil4(); lost()
    print("wrote", ", ".join(str(p) for p in sorted(OUT.glob("*.svg"))))
