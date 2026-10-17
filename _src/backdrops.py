# -*- coding: utf-8 -*-
"""Illustrated backdrops for the homepage industries slide: one SVG per industry, drawn here (no people, no screenshots),
in the world's palette. build.py calls write(); files land in assets/img/industries/<key>/backdrop.svg.

Craft rules every scene follows (1600 x 900, wall above FL, floor below):
  depth     three planes: a hazy far plane, the lit mid plane, a soft blurred foreground at the edges
  light     one direction per scene: shafts from a window or skylight, glowing lamps, ambient occlusion where wall
            meets floor, a contact shadow under every object
  stage     a soft pool of light on the floor where Nexi stands (NX, about x 1180), the props frame it
  calm      the left ~45% is a quiet gradient wall: the title card sits there
  finish    an edge vignette over everything (the film grain is a tiled grain.png in hero.css, far cheaper to paint)"""
import math
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
W, H, FL = 1600, 900, 600
NX, NY = 1180, 790          # where Nexi's feet land (the light pool sits here)


# ---------------------------------------------------------------- the canvas
class Scene:
    def __init__(self):
        self.defs, self.out, self.n = [], [], 0

    def _id(self, p):
        self.n += 1
        return f"{p}{self.n}"

    @staticmethod
    def _stops(stops):
        out = []
        for s in stops:
            o, col, a = (s + (1,))[:3] if len(s) == 2 else s
            out.append(f'<stop offset="{o}" stop-color="{col}" stop-opacity="{a}"/>')
        return "".join(out)

    def lin(self, stops, x1=0, y1=0, x2=0, y2=1):
        i = self._id("l")
        self.defs.append(f'<linearGradient id="{i}" x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}">{self._stops(stops)}</linearGradient>')
        return f"url(#{i})"

    def rad(self, stops, cx=.5, cy=.5, r=.5):
        i = self._id("r")
        self.defs.append(f'<radialGradient id="{i}" cx="{cx}" cy="{cy}" r="{r}">{self._stops(stops)}</radialGradient>')
        return f"url(#{i})"

    def blur(self, sd):
        i = self._id("b")
        self.defs.append(f'<filter id="{i}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="{sd}"/></filter>')
        return f"url(#{i})"

    def add(self, *parts):
        self.out.extend(parts)

    def svg(self, bg):
        # The film grain is not drawn here: an feTurbulence filter over the whole scene was the costliest part to paint
        # and, the first time a browser met it, held up the slide's opening for ~200 ms. hero.css lays grain.png (one
        # tile, written below) over every scene instead.
        vig = self.rad([(0, "#000", 0), (.62, "#000", 0), (1, "#0A1020", .2)], .5, .46, .78)
        return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" preserveAspectRatio="xMidYMax slice">'
                f'<defs>{"".join(self.defs)}</defs>{r(0, 0, W, H, bg)}{"".join(self.out)}'
                f'{r(0, 0, W, H, vig)}</svg>')


# ---------------------------------------------------------------- primitives
def r(x, y, w, h, f, rx=0, o=None, extra=""):
    op = f' opacity="{o}"' if o is not None else ""
    return f'<rect x="{x:.1f}" y="{y:.1f}" width="{max(w, 0):.1f}" height="{max(h, 0):.1f}" rx="{rx}" fill="{f}"{op}{extra}/>'


def c(x, y, rad, f, o=None):
    op = f' opacity="{o}"' if o is not None else ""
    return f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{rad:.1f}" fill="{f}"{op}/>'


def e(x, y, rx, ry, f, o=None, rot=0):
    op = f' opacity="{o}"' if o is not None else ""
    tr = f' transform="rotate({rot} {x:.1f} {y:.1f})"' if rot else ""
    return f'<ellipse cx="{x:.1f}" cy="{y:.1f}" rx="{rx:.1f}" ry="{ry:.1f}" fill="{f}"{op}{tr}/>'


def p(d, f="none", s=None, sw=0, o=None, extra=""):
    st = f' stroke="{s}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round"' if s else ""
    op = f' opacity="{o}"' if o is not None else ""
    return f'<path d="{d}" fill="{f}"{st}{op}{extra}/>'


def g(body, tr="", o=None, filt=None, blend=None):
    a = (f' transform="{tr}"' if tr else "") + (f' opacity="{o}"' if o is not None else "") + \
        (f' filter="{filt}"' if filt else "") + (f' style="mix-blend-mode:{blend}"' if blend else "")
    return f'<g{a}>{body}</g>'


# ---------------------------------------------------------------- shared scene parts
def room(S, wall, ceiling=None, ceil_h=0):
    """The back wall (vertical gradient) and an optional ceiling band with its shadow line."""
    S.add(r(0, 0, W, FL, S.lin([(0, wall[0]), (1, wall[1])])))
    if ceiling:
        S.add(r(0, 0, W, ceil_h, S.lin([(0, ceiling[0]), (1, ceiling[1])])), r(0, ceil_h, W, 14, S.lin([(0, "#0A1020", .12), (1, "#0A1020", 0)])))


def dado(S, y, cols, rail="#FFFFFF", panels=0):
    S.add(r(0, y, W, FL - y, S.lin([(0, cols[0]), (1, cols[1])])), r(0, y - 6, W, 8, rail), r(0, y + 2, W, 6, S.lin([(0, "#0A1020", .08), (1, "#0A1020", 0)])))
    if panels:
        for x in range(30, W, panels):
            S.add(r(x, y + 26, panels - 40, FL - y - 50, "#FFFFFF", 6, .12), r(x, y + 26, panels - 40, 3, "#FFFFFF", 2, .3))


def floor(S, cols, line, kind="tiles", gloss=0.0, vp=(NX - 120, 120)):
    """A floor in one-point perspective toward vp, with an optional glossy sheen."""
    S.add(r(0, FL, W, H - FL, S.lin([(0, cols[0]), (1, cols[1])])))
    vx, vy = vp
    if kind == "tiles":
        for i in range(1, 9):
            y = FL + (H - FL) * (i / 9) ** 1.7
            S.add(p(f"M0 {y:.1f} H{W}", s=line, sw=1.2))
        for k in range(-14, 15):
            xb = vx + k * 150
            xt = vx + (xb - vx) * (FL - vy) / (H - vy)
            S.add(p(f"M{xt:.1f} {FL} L{xb:.1f} {H}", s=line, sw=1.2))
    elif kind == "planks":
        for k in range(-20, 21):
            xb = vx + k * 92
            xt = vx + (xb - vx) * (FL - vy) / (H - vy)
            S.add(p(f"M{xt:.1f} {FL} L{xb:.1f} {H}", s=line, sw=1.4))
        for i in range(1, 7):
            y = FL + (H - FL) * (i / 7) ** 1.6
            S.add(p(f"M0 {y:.1f} H{W}", s=line, sw=.8, o=.6))
    if gloss:
        S.add(r(0, FL, W, 120, S.lin([(0, "#FFFFFF", gloss), (1, "#FFFFFF", 0)])))
    S.add(r(0, FL, W, 26, S.lin([(0, "#0A1020", .16), (1, "#0A1020", 0)])))     # ambient occlusion at the skirting


def stage(S, col="#FFFFFF", a=.55, wall_a=.35):
    """Nexi's spot: a light pool on the floor and a soft halo on the wall behind."""
    S.add(e(NX, NY + 4, 300, 70, S.rad([(0, col, a), (.6, col, a * .35), (1, col, 0)])),
          e(NX, 430, 340, 300, S.rad([(0, col, wall_a), (1, col, 0)])))


def shadow(S, x, y, w, a=.22):
    S.add(e(x, y, w, w * .14, S.rad([(0, "#0A1020", a), (1, "#0A1020", 0)])))


def shaft(S, pts, col="#FFFFFF", a=.35):
    """A light shaft: a polygon that fades from bright at its source to nothing."""
    d = "M" + " L".join(f"{x:.0f} {y:.0f}" for x, y in pts) + " Z"
    ys = [y for _, y in pts]
    S.add(p(d, S.lin([(0, col, a), (1, col, 0)], 0, 0, 0, 1), extra=' style="mix-blend-mode:screen"'))


def glow(S, x, y, rx, ry, col, a=.6):
    S.add(e(x, y, rx, ry, S.rad([(0, col, a), (1, col, 0)])))


def pendant(S, x, y, shade, top=0, light="#FFE9B8", cord="#3A3A3A", wide=40):
    S.add(e(x, y + 150, 210, 170, S.rad([(0, light, .42), (1, light, 0)])),
          p(f"M{x} {top} V{y - 38}", s=cord, sw=2),
          p(f"M{x - wide} {y} Q{x - wide + 4} {y - 42} {x} {y - 42} Q{x + wide - 4} {y - 42} {x + wide} {y} Z", S.lin([(0, shade[0]), (1, shade[1])])),
          e(x, y + 1, wide * .42, 7, light), e(x, y + 1, wide * .22, 4, "#FFFFFF"))


def leafy(S, x, y, s=1, pot=("#E7A385", "#C9805F"), leaf=("#6FB38A", "#3E8A5E"), blur=0, flip=1):
    """A potted plant: big gradient leaves with midribs, a shaded pot, a contact shadow."""
    lf = S.lin([(0, leaf[0]), (1, leaf[1])], 0, 0, 1, 1)
    body = ""
    for i, (a, L) in enumerate(((-66, 112), (66, 104), (-40, 134), (40, 128), (-16, 150), (16, 146), (0, 120))):
        body += (f'<g transform="rotate({a * flip} 0 -60)"><ellipse cx="0" cy="{-60 - L * .62:.0f}" rx="{20 + (i % 2) * 3}" ry="{L * .52:.0f}" fill="{lf}"/>'
                 f'<path d="M0 -62 V{-60 - L * 1.08:.0f}" stroke="#FFFFFF" stroke-opacity=".28" stroke-width="2.4" fill="none"/></g>')
    potg = S.lin([(0, pot[0]), (1, pot[1])], 0, 0, 1, 0)
    body += (p("M-44 -66 H44 L34 0 H-34 Z", potg) + r(-50, -76, 100, 16, pot[0], 7) + r(-50, -76, 100, 5, "#FFFFFF", 3, .3) +
             p("M-44 -60 L-34 0 H-20 L-28 -60 Z", "#FFFFFF", o=.14))
    sh = e(0, 4, 70, 11, S.rad([(0, "#0A1020", .25), (1, "#0A1020", 0)]))
    S.add(g(sh + body, f"translate({x},{y}) scale({s})", filt=S.blur(blur) if blur else None))


def cloud(x, y, s=1, f="#FFFFFF", o=.95):
    return g(c(0, 0, 30, f) + c(34, -14, 40, f) + c(76, 0, 32, f) + r(-30, 0, 138, 30, f, 15), f"translate({x},{y}) scale({s})", o)


def frame(S, x, y, w, h, art, border="#FFFFFF", mat="#F7F3EC"):
    shadow(S, x + w / 2, y + h + 6, w * .5, .12)
    S.add(r(x - 8, y - 8, w + 16, h + 16, border, 4), r(x, y, w, h, mat, 2), art, r(x - 8, y - 8, w + 16, 4, "#FFFFFF", 2, .5))


def jar(x, y, w, h, body, lid):
    return r(x, y - h, w, h, body, 6) + r(x + w * .18, y - h - 8, w * .64, 10, lid, 3) + r(x + 5, y - h + 7, 5, h - 16, "#FFFFFF", 2, .4)


def parcel(x, y, w, h, f="#C99A6B", d="#A87A4C", tape="#EAD3AE"):
    return (r(x, y - h, w, h, f, 3) + r(x + w * .72, y - h, w * .28, h, d, 0, .35) + r(x + w / 2 - 7, y - h, 14, h, tape, 0, .85) +
            r(x + 8, y - h * .55, w * .3, h * .22, "#FFFFFF", 2, .9) + r(x, y - h, w, 4, "#FFFFFF", 2, .25))


# ---------------------------------------------------------------- the eight scenes
def medical():
    S = Scene()
    teal, ink, mint, pink, blue = "#21B799", "#0F4C45", "#E3F6F1", "#FF8FA3", "#3FA9E0"
    room(S, ("#EEF9F5", "#D5EEE6"), ("#FFFFFF", "#E8F5F1"), 64)
    for x in range(200, W, 340):                                          # recessed ceiling lights
        S.add(r(x - 70, 22, 140, 18, "#FFFFFF", 9), r(x - 64, 26, 128, 10, "#FFFDF0", 5))
        glow(S, x, 120, 230, 150, "#FFFFFF", .55)
    shaft(S, [(-40, 0), (300, 0), (760, FL + 200), (300, FL + 200)], "#FFFFFF", .28)   # morning light from the left
    dado(S, 470, ("#BFE6DA", "#A9DCCD"), panels=180)
    # far plane: frosted glass partition with the clinic mark behind the desk
    S.add(r(780, 150, 700, 330, S.lin([(0, "#FFFFFF", .85), (1, "#DDF2EC", .7)]), 10),
          r(780, 150, 700, 8, "#FFFFFF"), *[r(780 + i * 140, 150, 4, 330, "#FFFFFF", 0, .9) for i in range(1, 5)])
    S.add(r(1030, 190, 210, 64, "#FFFFFF", 14), r(1046, 204, 36, 36, teal, 9), r(1059, 209, 10, 26, "#FFFFFF", 3), r(1051, 217, 26, 10, "#FFFFFF", 3),
          r(1094, 208, 120, 13, ink, 4), r(1094, 228, 80, 9, "#8FB7AE", 4))
    S.add(p("M800 330 h120 l16 -40 l20 74 l16 -38 h300", s=teal, sw=4, o=.35))          # heartbeat line on the glass
    frame(S, 1340, 196, 96, 120, r(1346, 202, 84, 108, S.lin([(0, "#CFF0E6"), (1, "#A7E0D2")]), 2) + c(1388, 246, 22, "#FFFFFF", .8) + r(1376, 280, 24, 18, teal, 4, .6))
    floor(S, ("#E7F0F5", "#D2E0EA"), "#FFFFFF", "tiles", gloss=.4)
    S.add(p("M640 600 Q900 620 1060 600 L1060 680 Q900 700 640 680 Z", "#FFFFFF", o=.18))   # the desk's reflection
    # mid plane: the curved reception desk to the left of Nexi, a medicine cabinet to the right
    shadow(S, 900, FL + 70, 260, .2)
    S.add(p("M640 500 Q900 470 1060 500 L1060 650 Q900 676 640 650 Z", S.lin([(0, "#FFFFFF"), (1, "#EAF5F2")])),
          p("M640 500 Q900 470 1060 500 L1060 520 Q900 490 640 520 Z", S.lin([(0, "#C79E74"), (1, "#A57B52")])),
          p("M664 560 Q900 536 1036 560 L1036 600 Q900 576 664 600 Z", teal, o=.85),
          r(760, 452, 86, 50, ink, 8), r(766, 458, 74, 38, S.lin([(0, "#BDEFE2"), (1, "#7FD9C2")]), 4), r(796, 500, 14, 10, "#9AA6BC"),
          c(960, 492, 12, "#FFFFFF"), c(960, 492, 8, pink))
    cx = 1420
    shadow(S, cx + 80, FL + 66, 120, .2)
    S.add(r(cx, 250, 170, 410, S.lin([(0, "#FFFFFF"), (1, "#E9F4F1")], 0, 0, 1, 0), 12), r(cx + 10, 262, 150, 386, "#F2FAF8", 8))
    for row, y in enumerate((360, 450, 540, 630)):
        S.add(r(cx + 10, y, 150, 7, "#C9E6DD"))
        for i in range(4):
            col = ("#FFFFFF", "#FFD9E0", "#CDE9FB", "#FFF1C2")[(i + row) % 4]
            S.add(jar(cx + 20 + i * 34, y, 26, 38 + ((i + row) % 3) * 8, col, teal if (i + row) % 2 else blue))
    S.add(r(cx, 250, 170, 6, "#FFFFFF", 3, .7))
    stage(S, "#FFFFFF", .7, .4)
    leafy(S, 1560, 900, 1.9, ("#F59A8B", "#D97A6C"), ("#6FC79B", "#2F9468"), blur=3)      # foreground, soft
    leafy(S, 80, 905, 1.5, ("#7CC8FF", "#4FA8E0"), ("#6FC79B", "#2F9468"), blur=2.5, flip=-1)
    return S.svg("#F6FCFA")


def travel():
    S = Scene()
    ink, sea, yel = "#17284A", "#3167CA", "#FFC94A"
    S.add(r(0, 0, W, FL, S.lin([(0, "#7FC1EF"), (.55, "#CDE9FA"), (1, "#FFF1DC")])))       # sunrise sky through the glass
    glow(S, 1250, 470, 520, 260, "#FFE2A8", .55)
    for (x, y, s, o) in ((120, 120, 1.3, .9), (520, 70, .9, .75), (900, 160, 1.1, .85), (1330, 90, .8, .7)):
        S.add(cloud(x, y, s, o=o))
    S.add(*[r(x, 450 - h, w, h + 40, S.lin([(0, "#AFC8DF"), (1, "#C9DBEA")]), 0, .9) for x, w, h in
            ((0, 90, 70), (96, 60, 120), (160, 120, 60), (290, 70, 150), (370, 140, 90), (520, 80, 60))])   # the far city, hazy
    S.add(r(640, 330, 22, 160, "#9CB2C9"), r(616, 304, 70, 34, "#9CB2C9", 10), r(626, 312, 50, 16, "#E8F4FB", 4))   # control tower
    S.add(r(0, 470, W, 28, S.lin([(0, "#9FB0C2"), (1, "#B8C7D6")])), *[r(x, 482, 50, 4, "#FFFFFF", 2, .8) for x in range(20, W, 110)])   # runway
    S.add(g(p("M0 0 L130 -12 L162 -46 L182 -46 L172 -10 L250 -16 L258 0 L172 12 L182 46 L162 46 L130 12 Z", "#FFFFFF") +
            r(30, -3, 160, 6, "#DDE7F2", 3) + c(36, 0, 5, sea), "translate(1010,220) rotate(-9) scale(.9)"))
    S.add(p("M1240 196 C1120 210 1010 232 860 270", s="#FFFFFF", sw=3, o=.6))
    # the glass curtain wall: mullions and transoms in front of the sky
    for x in range(0, W + 1, 230):
        S.add(r(x - 7, 0, 14, FL, S.lin([(0, "#FFFFFF"), (1, "#E6EEF7")], 0, 0, 1, 0)))
    S.add(r(0, 0, W, 40, "#FFFFFF"), r(0, 40, W, 10, "#0A1020", .06), r(0, 300, W, 8, "#FFFFFF", 0, .9))
    shaft(S, [(800, 50), (1400, 50), (1700, FL + 300), (1000, FL + 300)], "#FFF4D6", .35)
    S.add(r(0, 520, W, 80, S.lin([(0, "#EDF2F8"), (1, "#DCE4EE")])), r(0, 516, W, 6, "#FFFFFF"))   # the sill
    # departures board hanging over the gate
    S.add(p("M1290 50 V210 M1520 50 V210", s="#9AA6BC", sw=3))
    shadow(S, 1405, 400, 150, .12)
    S.add(r(1240, 208, 330, 176, S.lin([(0, "#1E3460"), (1, ink)]), 14), r(1254, 222, 302, 30, "#24447A", 6), r(1268, 232, 110, 10, yel, 5))
    for i in range(4):
        y = 266 + i * 27
        S.add(r(1268, y, 140, 13, "#2E4C82", 4), r(1420, y, 46, 13, "#2E4C82", 4), r(1478, y, 64, 13, ("#5FD39A", yel, "#5FD39A", "#FF8A65")[i], 4))
    floor(S, ("#F3F6FB", "#DCE4F0"), "#FFFFFF", "tiles", gloss=.55)
    S.add(*[r(x - 7, FL, 14, 120, S.lin([(0, "#FFFFFF", .35), (1, "#FFFFFF", 0)])) for x in range(0, W + 1, 230)])   # mullion reflections
    # mid plane: a row of gate seats left of Nexi, check-in kiosks right
    shadow(S, 820, FL + 70, 210, .2)
    for i in range(4):
        x = 650 + i * 92
        S.add(r(x, 552, 80, 70, S.lin([(0, "#4E7AD0"), (1, sea)]), 16), r(x - 2, 614, 84, 22, S.lin([(0, "#2E58A8"), (1, "#244A92")]), 9), r(x + 8, 560, 64, 8, "#FFFFFF", 4, .25))
    S.add(r(650, 636, 360, 8, "#5C6670", 4), r(670, 644, 8, 26, "#5C6670"), r(980, 644, 8, 26, "#5C6670"))
    for i, x in enumerate((1400, 1500)):
        shadow(S, x + 34, FL + 80, 60, .18)
        S.add(r(x, 470, 68, 210, S.lin([(0, "#FFFFFF"), (1, "#E3EAF5")], 0, 0, 1, 0), 10), r(x + 10, 486, 48, 64, ink, 5),
              r(x + 14, 490, 40, 56, S.lin([(0, "#5DA9F5"), (1, sea)]), 3), r(x + 18, 572, 32, 8, yel, 4))
    stage(S, "#FFF6E0", .6, .3)
    S.add(g(r(0, -150, 120, 150, S.lin([(0, "#FF9A72"), (1, "#E06E4A")]), 18) + r(30, -186, 60, 42, "none", 12, extra=f' stroke="{ink}" stroke-width="10"') +
            r(14, -130, 92, 8, "#FFFFFF", 4, .35), "translate(1490,905)", filt=S.blur(3)))   # foreground suitcase, soft
    leafy(S, 70, 905, 1.6, (yel, "#E0A92E"), ("#5DBF7E", "#2E8A55"), blur=2.5, flip=-1)
    return S.svg("#CDE9FA")


def retail():
    S = Scene()
    terra, sage, cream, ink, oak = "#D9785A", "#81B29A", "#FBF3E6", "#3D405B", "#D9B48A"
    room(S, ("#FCF5EA", "#F3E5D0"))
    S.add(*[r(x, 0, 3, FL, "#B79A78", 0, .1) for x in range(24, W, 40)])                  # panelled wall
    S.add(p("M0 70 " + " ".join(f"L{x} {70 + 20 * math.sin(x / 150):.1f}" for x in range(0, W + 40, 20)), s="#A68B6A", sw=2))
    S.add(*[p(f"M{x} {70 + 20 * math.sin(x / 150):.1f} l38 0 l-19 34 Z", (terra, sage, "#E9C46A", "#7FA8C9")[i % 4]) for i, x in enumerate(range(0, W, 44))])
    pendant(S, 760, 190, ("#9CC5AF", sage), 0, cord="#8A7F6E")
    pendant(S, 1300, 190, ("#E9967A", terra), 0, cord="#8A7F6E")
    dado(S, 500, ("#EAB59D", "#DFA488"), rail="#FFF8EE", panels=150)
    # far plane: the arched shop window onto a sunny street
    wx, wy, ww, wh = 760, 180, 330, 300
    arch = f"M{wx} {wy + wh} V{wy + ww / 2} A{ww / 2} {ww / 2} 0 0 1 {wx + ww} {wy + ww / 2} V{wy + wh} Z"
    S.defs.append(f'<clipPath id="rarch"><path d="{arch}"/></clipPath>')
    S.add(p(f"M{wx - 16} {wy + wh + 16} V{wy + ww / 2} A{ww / 2 + 16} {ww / 2 + 16} 0 0 1 {wx + ww + 16} {wy + ww / 2} V{wy + wh + 16} Z", "#FFFBF3"),
          '<g clip-path="url(#rarch)">' + r(wx, wy, ww, wh, S.lin([(0, "#BFE3F7"), (1, "#F0F8FC")])) + cloud(wx + 50, wy + 90, .6) +
          r(wx, wy + 190, ww, 110, "#E8DCCB") + r(wx + 30, wy + 120, 110, 80, "#E7B9A6") + r(wx + 180, wy + 100, 130, 100, "#C9DDE8") +
          r(wx + 210, wy + 120, 26, 26, "#FFFFFF", 3, .8) + r(wx + 250, wy + 120, 26, 26, "#FFFFFF", 3, .8) +
          r(wx + 128, wy + 150, 8, 90, "#8A6A4A") + c(wx + 132, wy + 140, 42, "#6FAF86") + c(wx + 110, wy + 160, 26, "#5E9E75") + '</g>',
          r(wx + ww / 2 - 4, wy + 40, 8, wh - 40, "#FFFBF3"), r(wx - 26, wy + wh + 10, ww + 52, 16, "#FFFBF3", 6))
    S.add(p(f"M{wx + 40} {wy + wh} L{wx - 120} {FL + 260} L{wx + ww + 140} {FL + 260} L{wx + ww - 40} {wy + wh} Z", S.lin([(0, "#FFF6DE", .45), (1, "#FFF6DE", 0)]), extra=' style="mix-blend-mode:screen"'))
    floor(S, ("#E9D3B6", "#D6B993"), "#C5A47C", "planks", gloss=.25)
    # mid plane: oak shelving right of Nexi, a display table left
    sx = 1350
    shadow(S, sx + 125, FL + 74, 170, .22)
    S.add(r(sx, 210, 250, 460, S.lin([(0, "#C49A6C"), (1, "#A9794C")], 0, 0, 1, 0), 10), r(sx + 12, 222, 226, 436, S.lin([(0, "#F7E8D2"), (1, "#EEDBBF")]), 6))
    for row, y in enumerate((320, 420, 520, 620)):
        S.add(r(sx + 12, y, 226, 10, "#B98E62"), r(sx + 12, y + 10, 226, 6, "#0A1020", 0, .06))
        for i in range(4):
            x = sx + 26 + i * 54
            if row == 0: S.add(r(x, y - 46, 38, 46, (terra, sage, "#E9C46A", "#7FA8C9")[i], 9), p(f"M{x + 38} {y - 36} q14 0 14 12 q0 12 -14 12", s=(terra, sage, "#E9C46A", "#7FA8C9")[i], sw=5))
            elif row == 1: S.add(r(x + 4, y - 64, 30, 64, ("#FFFFFF", "#F7D9C9", "#DDEBE2", "#E9E1F5")[i], 10), r(x + 10, y - 50, 18, 12, terra, 3, .6))
            elif row == 2: S.add(r(x - 4, y - 30, 46, 14, (terra, "#F7D9C9", sage, "#E9C46A")[i], 4), r(x - 2, y - 16, 44, 16, (sage, terra, "#E9C46A", "#7FA8C9")[i], 4))
            else: S.add(c(x + 19, y - 22, 20, ("#E9C46A", terra, sage, "#7FA8C9")[i]), c(x + 13, y - 28, 6, "#FFFFFF", .35))
    S.add(r(sx, 210, 250, 8, "#FFFFFF", 4, .3))
    tx = 640
    shadow(S, tx + 160, FL + 82, 200, .22)
    S.add(r(tx, 560, 320, 18, S.lin([(0, "#E3C29A"), (1, oak)]), 8), r(tx + 20, 578, 14, 100, "#B98E62"), r(tx + 286, 578, 14, 100, "#B98E62"),
          *[r(tx + 30 + (i % 2) * 6, 560 - (i + 1) * 15, 110, 14, ("#F7D9C9", terra, "#FFFFFF", sage)[i % 4], 4) for i in range(4)],
          r(tx + 190, 500, 40, 60, "#7FA8C9", 14), c(tx + 210, 488, 26, "#6FAF86"), c(tx + 196, 478, 14, "#5E9E75"),
          r(tx + 250, 530, 44, 30, "#FFFFFF", 6), r(tx + 256, 538, 32, 6, terra, 3))
    stage(S, "#FFF2D6", .6, .3)
    leafy(S, 1560, 905, 1.8, (terra, "#B95E43"), ("#7FB59A", "#3F7D60"), blur=3)
    S.add(g(r(-60, -90, 150, 90, S.lin([(0, "#E59478"), (1, terra)]), 14) + p("M-40 -90 Q15 -170 70 -90", s="#C26A4E", sw=8), "translate(110,905)", filt=S.blur(2.5)))
    return S.svg("#FCF5EA")


def ecommerce():
    S = Scene()
    vio, mint, kraft, ink = "#6D5BD0", "#3CCFAE", "#C99A6B", "#2B2350"
    room(S, ("#F3F0FB", "#E4DEF4"), ("#D8D1EE", "#CFC7EA"), 70)
    S.add(*[r(x + (row % 2) * 44, 80 + row * 38, 84, 32, "#D9D1F0", 3, .55) for row in range(14) for x in range(-44, W, 88)])   # painted brick
    for x in (250, 700, 1150):                                                                    # strip lights
        S.add(r(x - 110, 72, 220, 14, "#FFFFFF", 7), r(x - 104, 76, 208, 6, "#FFFDF2", 3))
        glow(S, x, 170, 260, 140, "#FFFFFF", .6)
    S.add(r(0, 520, W, 80, S.lin([(0, "#D2C9EE"), (1, "#C6BCE8")])), r(0, 514, W, 8, mint))
    # far plane: the open roller door onto the loading bay and sky
    dx = 760
    S.add(r(dx - 18, 200, 380, 400, "#8A82AA", 6), r(dx, 216, 344, 384, S.lin([(0, "#BFE3F7"), (1, "#F2F8FC")])), cloud(dx + 60, 280, .7),
          r(dx, 470, 344, 130, "#C9C3DA"), r(dx + 30, 420, 200, 120, "#FFFFFF", 10), r(dx + 30, 420, 200, 30, vio, 10), r(dx + 30, 440, 200, 10, vio),
          c(dx + 70, 548, 18, ink), c(dx + 190, 548, 18, ink), r(dx + 56, 470, 120, 40, "#ECE8FA", 6))
    S.add(*[r(dx, y, 344, 12, ("#C9C3DE", "#B9B2D3")[i % 2], 2) for i, y in enumerate(range(216, 330, 14))],
          r(dx - 4, 326, 352, 14, "#8A82AA", 3), r(dx + 150, 330, 44, 8, "#FFD84A", 3))
    shaft(S, [(dx, 470), (dx + 344, 470), (dx + 520, FL + 300), (dx - 160, FL + 300)], "#FFF6DE", .32)
    floor(S, ("#F1EEF8", "#DED7EF"), "#FFFFFF", "tiles", gloss=.45)
    S.add(p("M0 760 L1600 760", s="#FFD84A", sw=5, o=.75), p("M0 850 L1600 850", s="#FFD84A", sw=5, o=.75))
    # mid plane: racking receding to the right, a hanging zone sign
    for k, (rx, s) in enumerate(((1250, 1), (1440, 1.05))):
        shadow(S, rx + 90 * s, FL + 74, 120 * s, .2)
        S.add(r(rx, 210, 12, 460, "#7D74A6"), r(rx + 168 * s, 210, 12, 460, "#7D74A6"))
        for y in (310, 420, 530, 660):
            S.add(r(rx, y, 180 * s, 12, "#F29A4A"), r(rx, y + 12, 180 * s, 5, "#0A1020", 0, .08))
            if y < 640:
                S.add(parcel(rx + 16, y, 70, 58 + (y % 3) * 8), parcel(rx + 96, y, 74, 66))
    S.add(p("M1290 0 V120 M1430 0 V120", s="#9C95B8", sw=2), r(1270, 120, 180, 44, ink, 8), r(1270, 156, 180, 8, mint, 4), r(1290, 136, 90, 12, "#FFFFFF", 6, .9))
    # the conveyor, left of Nexi
    S.add(p("M560 640 L1020 640 L1040 664 L540 664 Z", S.lin([(0, "#6B6392"), (1, "#4E4778")])), r(540, 664, 500, 12, "#3A3460", 4),
          *[c(x, 682, 7, ink) for x in range(560, 1040, 40)], r(552, 676, 476, 26, "#463E6A", 6, .5))
    S.add(parcel(590, 640, 84, 62), parcel(700, 640, 70, 50, "#D4A879"), parcel(800, 640, 96, 74), parcel(920, 640, 64, 46, "#D4A879"))
    stage(S, "#FFFFFF", .65, .3)
    S.add(g(parcel(0, 0, 150, 120) + parcel(20, -120, 120, 96, "#D4A879"), "translate(1470,905)", filt=S.blur(3)))
    leafy(S, 80, 905, 1.5, (vio, "#5443B5"), ("#6FC79B", "#2F9468"), blur=2.5, flip=-1)
    return S.svg("#F3F0FB")


def construction():
    S = Scene()
    yel, navy, ink, orange = "#FFC93C", "#1F3F73", "#1E2A3A", "#FF7A1A"
    S.add(r(0, 0, W, 560, S.lin([(0, "#6FB4E8"), (.6, "#BFE0F6"), (1, "#FFE9C2")])))       # golden-hour sky
    glow(S, 1360, 360, 420, 300, "#FFE29A", .8)
    S.add(c(1360, 340, 64, "#FFF4D0", .95))
    for x, y, s, o in ((80, 110, 1.2, .9), (520, 70, .9, .8), (980, 130, 1, .8)):
        S.add(cloud(x, y, s, o=o))
    for depth, (col, base, hmax, a) in enumerate((("#C7D9EA", 470, 210, .9), ("#A9C2DA", 520, 160, 1))):   # two layers of skyline, hazy then nearer
        x = -20 + depth * 37
        while x < W:
            w = 60 + (x * 7 + depth * 13) % 70
            h = 60 + (x * 13 + depth * 31) % hmax
            S.add(r(x, base - h, w, h + 50, col, 0, a))
            for wy in range(base - h + 14, base, 22):
                S.add(r(x + 8, wy, w - 16, 5, "#FFFFFF", 0, .18))
            x += w + 6
    # the frame going up, right of Nexi
    fx = 1250
    for lv in range(5):
        y = 560 - lv * 80
        S.add(r(fx, y - 8, 330, 10, "#8E9CAD"), *[r(fx + i * 110, y - 80, 10, 80, "#B6C2D0") for i in range(4)])
    S.add(r(fx, 152, 330, 10, "#8E9CAD"), r(fx + 18, 330, 92, 70, "#7FB7E3", 3, .55), r(fx + 128, 410, 92, 70, "#7FB7E3", 3, .55), r(fx + 238, 250, 92, 70, "#7FB7E3", 3, .55))
    S.add(*[p(f"M{fx - 30 + i * 60} 560 L{fx + i * 60} 480", s="#D9A13A", sw=3) for i in range(7)])   # scaffold braces
    # tower crane, its jib over the scene
    cx = 1080
    S.add(*[p(f"M{cx - 12} {y} L{cx + 12} {y - 32} M{cx + 12} {y} L{cx - 12} {y - 32}", s=yel, sw=3) for y in range(560, 120, -32)],
          r(cx - 14, 100, 6, 460, yel), r(cx + 8, 100, 6, 460, yel), r(cx - 520, 92, 900, 14, S.lin([(0, "#FFD866"), (1, "#E5AE20")])),
          p(f"M{cx} 40 L{cx - 520} 88 M{cx} 40 L{cx + 380} 88", s="#C9930A", sw=3), r(cx - 16, 30, 32, 40, yel, 4), r(cx - 520, 106, 90, 44, "#8A97A8", 4),
          r(cx - 40, 108, 60, 40, "#E9EEF4", 4), r(cx - 34, 114, 48, 22, "#7FB7E3", 3))
    S.add(p(f"M{cx + 240} 106 V300", s="#4C5A69", sw=2), r(cx + 180, 300, 120, 16, "#E2553D", 3), r(cx + 180, 316, 120, 6, "#0A1020", 0, .15))
    # hoarding
    S.add(r(0, 520, W, 80, S.lin([(0, "#24497F"), (1, navy)])), r(0, 520, W, 8, yel), r(0, 534, W, 5, "#FFFFFF", 0, .8),
          *[r(x, 520, 3, 80, "#FFFFFF", 0, .1) for x in range(0, W, 140)], r(80, 552, 220, 26, "#FFFFFF", 4, .12))
    S.add(r(0, FL, W, H - FL, S.lin([(0, "#E9D4B4"), (1, "#CFAF86")])), r(0, FL, W, 26, S.lin([(0, "#0A1020", .2), (1, "#0A1020", 0)])))
    S.add(p("M0 720 Q620 650 1600 740", s="#BC9A6E", sw=10, o=.35), p("M0 820 Q700 760 1600 850", s="#BC9A6E", sw=10, o=.3))   # tyre tracks
    shadow(S, 760, 690, 150, .22)
    S.add(*[r(640 + i * 6, 690 - (i + 1) * 16, 220, 16, ("#C99A6B", "#B98552")[i % 2], 3) for i in range(4)])   # timber stack, left of Nexi
    S.add(*[p(f"M{x - 20} 700 L{x - 6} 640 H{x + 6} L{x + 20} 700 Z", orange) + r(x - 11, 666, 22, 8, "#FFFFFF") for x in (960, 1010)])
    stage(S, "#FFF2CC", .6, .25)
    S.add(g(p("M-60 0 L-30 -110 H30 L60 0 Z", orange) + r(-36, -70, 72, 14, "#FFFFFF") + r(-70, -6, 140, 12, ink, 4), "translate(1530,905)", filt=S.blur(3)))
    S.add(g(r(0, -60, 220, 60, S.lin([(0, "#FFFFFF"), (1, "#E8E2D4")]), 6) + "".join(r(14 + i * 40, -60, 20, 60, "#E2553D") for i in range(5)), "translate(-40,905)", filt=S.blur(2.5)))
    return S.svg("#BFE0F6")


def fnb():
    S = Scene()
    green, tomato, mustard, cream, wood, brass = "#1F4D3F", "#E2553D", "#E9B949", "#FFF6E5", "#A9744A", "#C9A44A"
    S.add(r(0, 0, W, 104, S.lin([(0, "#F5EBDC"), (1, "#EADCC6")])), *[r(x, 0, 12, 104, wood, 0, .2) for x in range(0, W, 120)], r(0, 98, W, 12, wood))
    S.add(r(0, 110, W, 400, S.lin([(0, "#1A4437"), (1, "#245A49")])))
    S.add(*[p(f"M0 {y} H{W}", s="#FFFFFF", sw=1.2, o=.07) for y in range(130, 510, 22)],
          *[p(f"M{x + (j % 2) * 34} {130 + j * 22} v22", s="#FFFFFF", sw=1.2, o=.07) for j in range(18) for x in range(0, W, 68)])
    S.add(p("M0 64 " + " ".join(f"L{x} {64 + 24 * abs(math.sin(x / 260 * math.pi)):.1f}" for x in range(0, W + 20, 20)), s="#5C4632", sw=2))
    for x in range(20, W, 44):
        y = 74 + 24 * abs(math.sin(x / 260 * math.pi))
        glow(S, x, y, 22, 22, "#FFD27A", .45)
        S.add(c(x, y, 5.5, "#FFE3A0"))
    S.add(r(0, 504, W, 96, S.lin([(0, "#B07C51"), (1, "#8F5F3A")])), r(0, 498, W, 10, brass), *[r(x, 518, 150, 66, "#000000", 8, .1) for x in range(20, W, 170)])
    # far plane: shelves of jars and a menu board, lanterns
    S.add(r(640, 230, 330, 10, wood), r(640, 320, 330, 10, wood))
    S.add(*[jar(656 + i * 52, 230, 32, 34 + (i % 3) * 9, ("#4A7A5E", "#FFF1D6", tomato, mustard, "#8E5A2E", "#FFF1D6")[i], brass) for i in range(6)])
    S.add(*[jar(662 + i * 62, 320, 36, 42, ("#FFF1D6", tomato, mustard, "#FFF1D6", "#4A7A5E")[i], "#2B3A33") for i in range(5)])
    for lx in (700, 1300):
        glow(S, lx, 300, 200, 180, "#FFB25A", .3)
        S.add(p(f"M{lx} 110 V170", s="#2B3A33", sw=2), r(lx - 18, 168, 36, 8, brass, 3), r(lx - 22, 176, 44, 56, S.rad([(0, "#FF8A55"), (1, tomato)]), 18),
              e(lx, 204, 10, 16, "#FFD27A"), r(lx - 18, 230, 36, 8, brass, 3))
    S.add(r(1370, 170, 210, 170, "#263238", 6), r(1362, 162, 226, 186, "none", 8, extra=f' stroke="{wood}" stroke-width="8"'),
          r(1396, 192, 90, 12, "#F3EBDD", 4), *[r(1396, 222 + i * 24, 110, 8, "#F3EBDD", 4, .55) + r(1530, 222 + i * 24, 24, 8, "#FFD27A", 4) for i in range(4)])
    # floor: chequered tiles in perspective, warm light pools
    S.add(r(0, FL, W, H - FL, S.lin([(0, "#EADBC4"), (1, "#D9C3A2")])))
    vx, vy = NX - 120, 140
    for i in range(10):
        y0 = FL + (H - FL) * (i / 10) ** 1.6
        y1 = FL + (H - FL) * ((i + 1) / 10) ** 1.6
        for k in range(-16, 16):
            if (k + i) % 2: continue
            def X(xb, y): return vx + (xb - vx) * (y - vy) / (H - vy)
            xa, xb2 = vx + k * 120, vx + (k + 1) * 120
            S.add(p(f"M{X(xa, y0) * 1:.1f} {y0:.1f} L{X(xb2, y0):.1f} {y0:.1f} L{X(xb2, y1):.1f} {y1:.1f} L{X(xa, y1):.1f} {y1:.1f} Z", "#C9A97F", o=.55))
    S.add(r(0, FL, W, 30, S.lin([(0, "#0A1020", .25), (1, "#0A1020", 0)])))
    glow(S, 700, 680, 260, 70, "#FFB25A", .35)
    # mid plane: the open kitchen pass behind Nexi's left, heat lamps glowing
    kx = 760
    for lx in (840, 940, 1040):
        S.add(p(f"M{lx} 110 V360", s="#8A949E", sw=2), p(f"M{lx - 22} 380 L{lx - 10} 360 H{lx + 10} L{lx + 22} 380 Z", "#5C6670"))
        glow(S, lx, 430, 70, 60, "#FF9A4A", .5)
    shadow(S, kx + 210, FL + 70, 250, .3)
    S.add(r(kx - 10, 440, 440, 16, S.lin([(0, "#E8EDF2"), (1, "#B9C3CD")]), 4), r(kx, 456, 420, 190, S.lin([(0, "#B57F52"), (1, "#8F5F3A")]), 8),
          r(kx + 140, 500, 150, 42, "#13332A", 8), r(kx + 148, 508, 134, 26, "none", 6, extra=f' stroke="{brass}" stroke-width="2"'),
          r(kx + 40, 380, 74, 60, S.lin([(0, "#C9D1DB"), (1, "#8A949E")], 0, 0, 1, 0), 8), r(kx + 34, 372, 86, 12, "#6E7883", 4))
    S.add(*[c(kx + 66 + i * 14, 344 - i * 22, 12 + i * 5, "#FFFFFF", .35 - i * .09) for i in range(3)])
    S.add(g(p("M-44 0 Q0 32 44 0 Z", "#2B2F33") + r(40, -4, 50, 7, "#2B2F33", 3), f"translate({kx + 260},436)"),
          p(f"M{kx + 236} 424 q22 -46 44 -12 q16 -40 34 4", S.lin([(0, "#FFD27A"), (1, "#FF7A2A")]), o=.9))
    stage(S, "#FFE0A8", .55, .22)
    leafy(S, 1560, 905, 1.9, ("#C96F4A", "#9E4E30"), ("#4F9E6C", "#245F3E"), blur=3)
    leafy(S, 70, 905, 1.6, ("#C96F4A", "#9E4E30"), ("#4F9E6C", "#245F3E"), blur=2.5, flip=-1)
    return S.svg("#1F4D3F")


def manufacturing():
    S = Scene()
    teal, orange, steel, ink, yel = "#2F6B7A", "#FF7A1A", "#8A97A6", "#1E2A33", "#FFC93C"
    room(S, ("#E6ECF1", "#D2DBE3"))
    S.add(*[r(x, 120, 7, 400, "#0A1020", 0, .045) for x in range(0, W, 22)])                  # ribbed cladding
    S.add(r(0, 0, W, 112, "#C3CDD6"), *[r(x, 18, 170, 72, S.lin([(0, "#BFE6F7"), (1, "#E8F6FC")]), 4) + r(x + 82, 18, 6, 72, steel) for x in range(20, W, 220)])
    for x in range(105, W, 440):                                                               # volumetric light from the clerestory
        shaft(S, [(x - 40, 90), (x + 130, 90), (x + 380, FL + 260), (x + 60, FL + 260)], "#FFFFFF", .3)
    S.add(r(0, 150, W, 18, ink), *[p(f"M{x} 150 l18 0 l-18 18 h-18 Z", yel) for x in range(0, W + 40, 40)])
    S.add(r(0, 214, W, 18, S.lin([(0, "#9AA6B2"), (1, "#7A8794")])), r(1180, 232, 34, 44, "#5C6B7A"), p("M1197 276 V380", s="#4C5A69", sw=3), r(1150, 380, 96, 16, "#A9B4C2", 3))   # gantry
    S.add(r(0, 520, W, 80, S.lin([(0, "#5C7080"), (1, "#4C5E6C")])), r(0, 512, W, 10, yel))
    # far plane: a planning board and pallet racks
    frame(S, 690, 250, 250, 150, r(690, 250, 250, 28, teal) + "".join(r(706 + (i * 41) % 90, 296 + i * 24, 100 + (i % 3) * 22, 12, ("#3A93C0", yel, "#21B799", orange)[i % 4], 4) for i in range(4)), "#FFFFFF", "#FFFFFF")
    floor(S, ("#C9D3D2", "#AEBBB9"), "#FFFFFF", "tiles", gloss=.3)
    S.add(p("M560 900 L960 600", s=yel, sw=7, o=.85), p("M1700 900 L1340 600", s=yel, sw=7, o=.85))   # walkway lines toward the back
    # mid plane: the robot cell right of Nexi, sparks glowing
    cx = 1330
    shadow(S, cx + 130, FL + 70, 190, .22)
    S.add(r(cx, 380, 270, 280, "none", 6, extra=f' stroke="{yel}" stroke-width="6"'), *[p(f"M{cx + i * 18} 380 V660", s=yel, sw=1.4, o=.45) for i in range(16)])
    S.add(r(cx + 70, 610, 80, 50, ink, 6), p(f"M{cx + 110} 610 L{cx + 92} 500 L{cx + 190} 438", s=S.lin([(0, "#FF9A4D"), (1, orange)]), sw=26),
          c(cx + 92, 500, 16, ink), c(cx + 190, 438, 14, ink), r(cx + 190, 428, 38, 14, steel, 3))
    glow(S, cx + 232, 440, 60, 60, "#FFE27A", .9)
    S.add(c(cx + 232, 440, 7, "#FFFBE0"), *[p(f"M{cx + 232} 440 l{dx} {dy}", s="#FFD050", sw=2) for dx, dy in ((22, -14), (26, 8), (14, 24), (-6, 26), (30, -2))])
    S.add(r(cx + 284, 420, 24, 76, "#3A4A55", 5), c(cx + 296, 434, 8, "#3FE08A"), c(cx + 296, 456, 8, "#FFC93C"), c(cx + 296, 478, 8, "#E2453C"))
    shadow(S, 760, FL + 80, 170, .2)
    S.add(*[r(650 + (i % 2) * 6, 680 - (i + 1) * 22, 230, 22, ("#A9B4C2", "#C3CDDA")[i % 2], 3) for i in range(5)], r(650, 680, 236, 12, "#6B5A4A", 3))   # steel sheet stack, left of Nexi
    stage(S, "#FFFFFF", .6, .28)
    S.add(g(e(0, -70, 90, 70, S.rad([(0, "#C3CDDA"), (1, "#8A97A6")])) + e(0, -70, 32, 26, "#5C6B7A"), "translate(1530,905)", filt=S.blur(3)))
    S.add(g(r(-60, -120, 160, 120, S.lin([(0, "#FF9A4D"), (1, "#E0650C")]), 10) + r(-60, -120, 160, 20, "#C9560A", 8) + "".join(r(-46 + i * 46, -84, 34, 46, "#FFFFFF", 4, .3) for i in range(3)), "translate(90,905)", filt=S.blur(2.5)))
    return S.svg("#E6ECF1")


def health():
    S = Scene()
    sage, sageD, lav, blush, sand, wood = "#8DB39A", "#5E8C6E", "#B9A6D8", "#F2B5A7", "#EAD9C2", "#C79E74"
    room(S, ("#FAF4EB", "#F0E6D7"), ("#EFE2CE", "#E6D6BE"), 60)
    S.add(*[r(x, 0, 14, 60, wood, 0, .28) for x in range(0, W, 32)])                              # slatted ceiling
    # the window's sunlight falling on the wall (a gobo of the frame)
    S.add(g(p("M120 140 L520 140 L620 520 L180 520 Z", "#FFF6DF", o=.55) + p("M314 140 L326 140 L408 520 L394 520 Z", "#F0E6D7") + p("M150 320 L560 320 L566 340 L156 340 Z", "#F0E6D7"),
            blend="multiply"), "")
    S.add(r(0, 470, W, 130, S.lin([(0, "#D3E3D6"), (1, "#C3D8C8")])), r(0, 464, W, 8, "#FFFFFF"))
    S.add(p("M0 104 " + " ".join(f"L{x} {104 + 26 * abs(math.sin(x / 320 * math.pi)):.1f}" for x in range(0, W + 20, 20)), s="#7FA88B", sw=2.4))
    S.add(*[e(x, 110 + 26 * abs(math.sin(x / 320 * math.pi)) + (8 if i % 2 else -6), 9, 6, ("#9CC0A6", "#86AE93")[i % 2]) for i, x in enumerate(range(6, W, 16))])
    # far plane: the arched garden window behind and right of Nexi
    wx, wy, ww, wh = 1290, 150, 280, 380
    arch = f"M{wx} {wy + wh} V{wy + ww / 2} A{ww / 2} {ww / 2} 0 0 1 {wx + ww} {wy + ww / 2} V{wy + wh} Z"
    S.defs.append(f'<clipPath id="harch"><path d="{arch}"/></clipPath>')
    S.add(p(f"M{wx - 16} {wy + wh + 16} V{wy + ww / 2} A{ww / 2 + 16} {ww / 2 + 16} 0 0 1 {wx + ww + 16} {wy + ww / 2} V{wy + wh + 16} Z", "#FFFFFF"),
          '<g clip-path="url(#harch)">' + r(wx, wy, ww, wh, S.lin([(0, "#CBEAF7"), (1, "#F2FAF6")])) + cloud(wx + 60, wy + 110, .55) +
          "".join(e(wx + 10 + i * 50, wy + wh - 60 - (i % 2) * 34, 56, 70, ("#9CC9A6", "#7FB78E")[i % 2]) for i in range(7)) + r(wx, wy + wh - 40, ww, 40, "#73A983") + '</g>',
          r(wx + ww / 2 - 4, wy, 8, wh, "#FFFFFF"), r(wx, wy + 220, ww, 8, "#FFFFFF"), r(wx - 26, wy + wh + 10, ww + 52, 16, "#FFFFFF", 6))
    shaft(S, [(wx, wy + 100), (wx + ww, wy + 100), (wx + ww - 60, FL + 300), (wx - 380, FL + 300)], "#FFF6DF", .4)
    for x, col in ((880, blush), (1010, sand)):                                                    # hanging planters
        S.add(p(f"M{x} 0 V176", s="#A57B52", sw=1.6), r(x - 28, 176, 56, 40, S.lin([(0, col), (1, "#D9A08F" if col == blush else "#CDB898")]), 16),
              *[e(x - 22 + i * 11, 232 + (i % 3) * 20, 7, 16, ("#7FAF8A", "#5E9670")[i % 2], rot=(i - 2) * 14) for i in range(5)])
    floor(S, ("#EDDCC4", "#DBC3A2"), "#CBAE89", "planks", gloss=.3)
    S.add(*[p(f"M{960 + i * 26} {720 + i * 30} L{1500 + i * 26} {700 + i * 30} L{1520 + i * 26} {722 + i * 30} L{980 + i * 26} {742 + i * 30} Z", (lav, sage, blush)[i], o=.75) for i in range(3)])   # mats on the floor
    # mid plane: a low shelf of oils and candles and a stack of mats left of Nexi
    sx = 650
    shadow(S, sx + 150, FL + 72, 190, .2)
    S.add(r(sx, 520, 300, 140, S.lin([(0, "#D7B38C"), (1, wood)]), 10), r(sx + 12, 532, 276, 116, "#F2E6D6", 6), r(sx + 12, 586, 276, 8, wood))
    S.add(*[jar(sx + 26 + i * 52, 584, 28, 34 + (i % 2) * 10, (lav, sage, blush, sand, lav)[i], "#A57B52") for i in range(5)])
    S.add(*[r(sx + 24 + i * 66, 610, 50, 36, "#FFFFFF", 10, .9) + r(sx + 30 + i * 66, 622, 38, 22, (blush, sand, lav, sage)[i], 6) for i in range(4)])
    S.add(*[r(sx + 30 + i * 14, 500 - i * 16, 220, 18, (lav, sage, blush)[i], 9) for i in range(3)])
    stage(S, "#FFF4DE", .6, .3)
    leafy(S, 1550, 905, 1.9, (blush, "#D98E7E"), ("#8DC29C", "#4E8A62"), blur=3)
    S.add(g(r(-50, -76, 130, 76, S.lin([(0, "#D7B38C"), (1, wood)]), 14) + "".join(r(-36 + i * 36, -150, 28, 90, (lav, sage, blush)[i], 14) for i in range(3)), "translate(100,905)", filt=S.blur(2.5)))
    return S.svg("#FAF4EB")


DRAW = {"medical": medical, "travel": travel, "retail": retail, "ecommerce": ecommerce, "construction": construction,
        "fnb": fnb, "manufacturing": manufacturing, "health-wellness": health}


def grain_png(size=128, seed=7):
    """A tile of film grain: mid grey at 0-5.5% opacity per pixel (what the old feTurbulence filter drew), as a PNG
    written with zlib alone. Seeded, so every build writes the same bytes."""
    import random, struct, zlib
    rnd = random.Random(seed)
    rows = b"".join(b"\x00" + bytes(v for _ in range(size) for v in (128, rnd.randint(0, 14))) for _ in range(size))
    def chunk(t, d): return struct.pack(">I", len(d)) + t + d + struct.pack(">I", zlib.crc32(t + d) & 0xFFFFFFFF)
    return (b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", size, size, 8, 4, 0, 0, 0))
            + chunk(b"IDAT", zlib.compress(rows, 9)) + chunk(b"IEND", b""))


def write():
    n = 0
    g = ROOT / "assets/img/industries/grain.png"
    png = grain_png()
    if not g.exists() or g.read_bytes() != png:
        g.write_bytes(png); n += 1
    for k, fn in DRAW.items():
        out = ROOT / "assets/img/industries" / k / "backdrop.svg"
        svg = fn()
        if not out.exists() or out.read_text(encoding="utf-8") != svg:
            out.write_text(svg, encoding="utf-8"); n += 1
    return n


if __name__ == "__main__":
    print(write(), "written")
