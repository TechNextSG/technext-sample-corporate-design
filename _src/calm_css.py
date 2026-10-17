# -*- coding: utf-8 -*-
"""Calm layer, part 1 (generated): assets/css/calm-gen.css.

The owner's boss found the site overwhelming ("cartoons and comic-y style ... I forget I am looking at an IT company").
Rather than rewriting ~1.2 MB of per-world CSS, this script reads every world / shared stylesheet and emits, for the
SAME selectors (so specificity matches and the later stylesheet wins), the calm version of the decorative declarations:

  - hand / marker / mono / serif fonts           -> the brand fonts (Plus Jakarta Sans display, Inter body)
  - hard offset "lip" shadows and thick rings    -> dropped (soft blur shadows stay)
  - small decorative tilts (rotate / skew < 20°) -> removed (functional turns such as chevrons stay)
  - looping animations (bob, sway, pulse...)     -> none
  - sticker text in ::before / ::after           -> none
  - dashed / dotted "ticket" edges, thick ink outlines -> 1px brand line
  - clip-path / mask shapes (tickets, scallops)  -> none
  - textured backgrounds (stripes, svg patterns) -> none
  - (MAP_COLOURS only) every world colour        -> the nearest brand tone by lightness; off by default (CALM_BALANCE)
The hand-written part (hero layout, section kit, header, floating UI) is assets/css/calm.css.
Turn the whole layer off with CALM = False in build.py. Needs tinycss2; without it the committed file is kept."""
import re, colorsys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
CSS = ROOT / "assets" / "css"
SOURCES = (["industry-world.css", "stage.css", "company.css", "odoo-walk.css", "industry.css", "employee-hub.css", "demo-kit.css"]
           + sorted("worlds/" + p.name for p in (CSS / "worlds").glob("*.css")))
# demo widgets keep their own internal colours (charts, statuses); only their chrome is calmed by calm.css
KEEP_COLOUR = {"demo-kit.css"}
# CALM_BALANCE.md (owner, 9 Oct): 50% TechNext base, 50% the page's own theme, so world colours are KEPT as the page
# accent by default. True maps every world colour to the nearest brand blue tone (the strict first pass).
MAP_COLOURS = False

BRAND_FONT_D, BRAND_FONT_B = "var(--font-display)", "var(--font-body)"
ODDS = re.compile(r"Caveat|Bangers|hand|marker|mono|Consolas|serif|Georgia|cursive|Courier|Permanent", re.I)


# ---------------------------------------------------------------- colours
def parse_col(s):
    s = s.strip()
    m = re.fullmatch(r"#([0-9a-fA-F]{3,8})", s)
    if m:
        h = m.group(1)
        if len(h) in (3, 4): h = "".join(c * 2 for c in h)
        return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4)), (int(h[6:8], 16) / 255 if len(h) == 8 else None)
    m = re.fullmatch(r"rgba?\(\s*([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)", s)
    if m:
        a = m.group(4)
        if a is not None: a = float(a[:-1]) / 100 if a.endswith("%") else float(a)
        return tuple(int(float(m.group(i))) for i in (1, 2, 3)), a
    return None, None


BLUE_TONES = [(0.22, (0x1E, 0x46, 0x91)), (0.62, (0x31, 0x67, 0xCA)), (0.80, (0xDD, 0xE7, 0xF8)), (2, (0xEA, 0xF0, 0xFB))]


def brand_col(rgb):
    r, g, b = [c / 255 for c in rgb]
    h, l, s = colorsys.rgb_to_hls(r, g, b)
    chroma = (max(rgb) - min(rgb))
    hue = h * 360
    if chroma < 14:                       # neutral: keep
        return None
    if l > 0.9:                           # creams, pastel washes -> brand alt / blue wash
        return (0xFA, 0xF9, 0xFB) if chroma < 40 else (0xF3, 0xF6, 0xFD)
    if 195 <= hue <= 250:                 # already a blue: keep
        return None
    if 300 <= hue <= 335 and 0.25 < l < 0.5 and chroma < 110:   # Odoo purple family: keep
        return None
    if l < 0.16:                          # near-black inks -> brand ink
        return (0x1F, 0x1F, 0x3D)
    for lim, col in BLUE_TONES:
        if l <= lim:
            return col
    return None


def hexs(rgb, a=None):
    if a is not None and a < 1:
        return "rgba(%d,%d,%d,%s)" % (rgb + (("%.3f" % a).rstrip("0").rstrip("."),))
    return "#%02X%02X%02X" % rgb


COL_TOKEN = re.compile(r"#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)")


def map_colours(val):
    if not MAP_COLOURS:
        return val
    def rep(m):
        rgb, a = parse_col(m.group(0))
        if rgb is None: return m.group(0)
        n = brand_col(rgb)
        return m.group(0) if n is None else hexs(n, a)
    return COL_TOKEN.sub(rep, val)


# ---------------------------------------------------------------- declarations
def split_top(s, sep=","):
    out, depth, cur = [], 0, ""
    for ch in s:
        if ch == "(": depth += 1
        elif ch == ")": depth -= 1
        if ch == sep and depth == 0: out.append(cur); cur = ""
        else: cur += ch
    out.append(cur)
    return [x.strip() for x in out]


def px(tok):
    m = re.fullmatch(r"(-?[\d.]+)(px)?", tok)
    return float(m.group(1)) if m else None


def calm_shadow(val):
    if "var(" in val and not re.search(r"\d", val):
        return None
    keep = []
    for layer in split_top(val):
        if layer in ("none", ""): continue
        toks = [t for t in re.findall(r"rgba?\([^)]*\)|var\([^)]*\)|\S+", layer)]
        nums = [px(t) for t in toks if px(t) is not None]
        inset = "inset" in toks
        if len(nums) < 2: keep.append(layer); continue
        x, y = nums[0], nums[1]; blur = nums[2] if len(nums) > 2 else 0; spread = nums[3] if len(nums) > 3 else 0
        if blur == 0 and (abs(x) >= 1.5 or abs(y) >= 1.5) and not inset:
            continue                                           # the hard "lip"
        if blur == 0 and x == 0 and y == 0 and spread > 2.5:
            continue                                           # thick decorative rings / frames
        if inset and blur == 0 and (abs(x) >= 3 or abs(y) >= 3):
            continue
        keep.append(layer)
    new = ", ".join(keep) if keep else "none"
    return None if new.replace(" ", "") == val.replace(" ", "") else new


ROT = re.compile(r"\s*(rotate[Z]?|skew[XY]?)\(\s*(-?[\d.]+)(deg|turn|rad)?\s*(?:,\s*(-?[\d.]+)(deg)?\s*)?\)")


def calm_transform(val):
    changed = False
    def rep(m):
        nonlocal changed
        a = float(m.group(2)); u = m.group(3) or "deg"
        deg = a * 360 if u == "turn" else (a * 57.3 if u == "rad" else a)
        b = float(m.group(4)) if m.group(4) else 0
        if abs(deg) < 20 and abs(b) < 20 and (abs(deg) > 0 or abs(b) > 0):
            changed = True; return ""
        return m.group(0)
    new = ROT.sub(rep, val).strip()
    if not changed: return None
    return new or "none"


def calm_border(val):
    v = val
    w = re.search(r"(?<![\w.])([\d.]+)px", v)
    style = re.search(r"\b(dashed|dotted|double|groove|ridge)\b", v)
    cols = COL_TOKEN.findall(v) + re.findall(r"var\(--[\w-]*ink[\w-]*\)", v)
    dark = False
    for c in cols:
        if c.startswith("var("): dark = True; continue
        rgb, a = parse_col(c)
        if rgb and colorsys.rgb_to_hls(*[x / 255 for x in rgb])[1] < 0.32 and (a is None or a > .5): dark = True
    width = float(w.group(1)) if w else None
    if style or (dark and width and 1.4 <= width <= 5):
        if width and width >= 6: return None          # css triangles
        return "1px solid var(--line)"
    return None


def calm_content(val, sel):
    if "::" not in sel and ":before" not in sel and ":after" not in sel: return None
    s = val.strip()
    if not (s.startswith('"') or s.startswith("'")): return None
    txt = re.sub(r"\\[0-9A-Fa-f]{1,6}\s?", "#", s[1:-1])
    letters = re.sub(r"[^A-Za-z]", "", txt)
    if len(letters) >= 3: return "none"
    return None


def font_family_of(val):
    """the family part of a font shorthand (after the size[/line-height])"""
    m = re.search(r"(?:[\d.]+(?:px|rem|em|%|vw)|\))(?:\s*/\s*[\w.%()+*\s,-]+?)?\s+((?:var\(|[\"'A-Za-z]).*)$", val)
    return m.group(1) if m else val


ANIM_KEEP = re.compile(r"spin|busy|load|caret|skeleton|marquee|crawl|ticker", re.I)


def calm_decl(prop, val, sel, fname):
    """-> list of (prop, value) overrides"""
    out = []
    p = prop.lower()
    imp = val.endswith("!important")
    v = val[:-10].strip() if imp else val
    if p.startswith("--"):
        if fname in KEEP_COLOUR: return out
        if ODDS.search(v) and not COL_TOKEN.search(v) and ("," in v or "var(" in v):
            out.append((prop, BRAND_FONT_D if re.search(r"hand|Caveat|Bangers|marker|Permanent|cursive", v, re.I) else BRAND_FONT_B))
        elif COL_TOKEN.search(v):
            n = map_colours(v)
            if n != v: out.append((prop, n))
        return out
    if p in ("font", "font-family"):
        fam = font_family_of(v) if p == "font" else v
        if ODDS.search(fam):
            hand = re.search(r"hand|Caveat|Bangers|marker|Permanent|cursive", fam, re.I)
            out.append(("font-family", BRAND_FONT_D if hand or "serif" in fam.lower() and "sans" not in fam.lower() else BRAND_FONT_B))
            if hand: out += [("font-style", "normal"), ("letter-spacing", "0")]
        return out
    if p == "box-shadow":
        n = calm_shadow(v)
        if n is not None: out.append((p, n))
        return out
    if p == "transform":
        n = calm_transform(v)
        if n is not None: out.append((p, n))
        return out
    if p == "rotate":
        m = re.fullmatch(r"(-?[\d.]+)deg", v.strip())
        if m and abs(float(m.group(1))) < 20 and float(m.group(1)) != 0: out.append((p, "none"))
        return out
    if p in ("animation", "animation-name", "animation-iteration-count"):
        if "infinite" in v and not ANIM_KEEP.search(v + sel):
            out.append(("animation", "none"))
        return out
    if p == "content":
        n = calm_content(v, sel)
        if n: out.append((p, n))
        return out
    if p in ("clip-path", "mask", "-webkit-mask", "mask-image", "-webkit-mask-image"):
        if v != "none" and "::" not in sel and "inset(" not in v: out.append((p, "none"))
        return out
    if p.startswith("border") and not p.endswith("radius") and p not in ("border-collapse", "border-spacing", "border-image"):
        if p.endswith("-color"):
            if fname not in KEEP_COLOUR:
                n = map_colours(v)
                if n != v: out.append((p, n))
            return out
        if p.endswith("-style"):
            if v in ("dashed", "dotted", "double"): out.append((p, "solid"))
            return out
        if p.endswith("-width"): return out
        n = calm_border(v)
        if n: out.append((p, n))
        elif fname not in KEEP_COLOUR:
            n2 = map_colours(v)
            if n2 != v: out.append((p, n2))
        return out
    if p in ("outline",) and re.search(r"dashed|dotted", v):
        out.append((p, re.sub(r"dashed|dotted", "solid", v))); return out
    if p in ("background", "background-image"):
        if re.search(r"repeating-|url\(\"?'?data:image/svg|radial-gradient\([^)]*\)\s*\d", v):
            out.append(("background-image", "none"))
            if p == "background" and fname not in KEEP_COLOUR:
                cols = [c for c in COL_TOKEN.findall(v)]
                base = re.search(r"(?:^|,|\s)(#[0-9a-fA-F]{3,8}|rgba?\([^)]*\))\s*$", v)
                if base: out.append(("background-color", map_colours(base.group(1))))
            return out
        if fname not in KEEP_COLOUR:
            n = map_colours(v)
            if n != v: out.append((p, n))
        return out
    if p in ("background-color", "color", "fill", "stroke", "outline-color", "text-decoration-color", "caret-color", "accent-color", "text-shadow", "column-rule", "column-rule-color"):
        if p == "text-shadow":
            if v != "none": out.append((p, "none"))
            return out
        if fname in KEEP_COLOUR: return out
        n = map_colours(v)
        if n != v: out.append((p, n))
        return out
    if p == "letter-spacing" and re.search(r"Bangers", sel):
        return out
    return out


# ---------------------------------------------------------------- walk the stylesheets
def walk(rules, fname, src):
    import tinycss2
    out = []
    for r in rules:
        if r.type == "qualified-rule":
            sel = tinycss2.serialize(r.prelude).strip()
            # body.ixw--<world> selectors are the calm round's own deliberate themed touches (CALM_BALANCE: a soft
            # doorway frame, one ticket edge...); no pre-calm sheet uses them, so they are left exactly as written.
            if all(s.startswith("body.ixw--") for s in split_top(sel)):
                continue
            decls = tinycss2.parse_declaration_list(r.content, skip_comments=True, skip_whitespace=True)
            new = []
            for d in decls:
                if d.type != "declaration": continue
                val = tinycss2.serialize(d.value).strip() + ("!important" if d.important else "")
                for p, v in calm_decl(d.name, val, sel, fname):
                    new.append("%s:%s%s" % (p, v, "!important" if d.important else ""))
            if new:
                out.append("%s{%s}" % (sel, ";".join(dict.fromkeys(new))))
        elif r.type == "at-rule" and r.lower_at_keyword in ("media", "supports", "container", "layer") and r.content:
            inner = walk(tinycss2.parse_rule_list(r.content, skip_comments=True, skip_whitespace=True), fname, src)
            if inner:
                out.append("@%s %s{\n%s\n}" % (r.at_keyword, tinycss2.serialize(r.prelude).strip(), "\n".join(inner)))
        # @keyframes, @font-face, @import: left alone
    return out


def build():
    try:
        import tinycss2
    except ImportError:
        print("calm_css: tinycss2 missing, keeping the committed calm-gen.css"); return
    parts = ["/* GENERATED by _src/calm_css.py — do not edit. The calm layer's mechanical half (see that file). */"]
    n = 0
    for f in SOURCES:
        p = CSS / f
        if not p.exists(): continue
        rules = tinycss2.parse_stylesheet(p.read_text(encoding="utf-8"), skip_comments=True, skip_whitespace=True)
        body = walk(rules, f, p)
        if body:
            parts.append("/* ---- %s ---- */" % f); parts += body; n += len(body)
    (CSS / "calm-gen.css").write_text("\n".join(parts) + "\n", encoding="utf-8")
    print("calm_css: %d override rules -> assets/css/calm-gen.css" % n)


if __name__ == "__main__":
    build()
