# -*- coding: utf-8 -*-
"""Corporate pass (SAMPLE, Oct 2026): assets/css/corp/<source>.css, the generated half of the inner-page corporate layer.

The homepage was rebuilt as a clean advisory-firm page (corp-home.css, pro.css): white and #F5F7FA fields, ink #0F1A2A,
ONE accent (TechNext blue #3167CA), hairlines, square corners, no drop shadows. The inner pages (industries, solutions,
company, careers, blog) are still dressed by ~1 MB of per-world CSS: warm washes, a colour per world, rounded pills and
soft card shadows. Like calm_css.py, this script reads those stylesheets and emits, for the SAME selectors (so the later
file wins at equal specificity), only the corporate version of the decorative declarations:

  - every chromatic colour  -> the nearest corporate tone by role and lightness (washes -> #F5F7FA / #EEF3FC,
                               hairlines -> #E3E7ED, mid tones -> blue #3167CA, darks -> navy / ink); neutrals stay
  - colour-stop gradients   -> one flat colour
  - border-radius           -> 2px (circles drawn with 50% stay circles)
  - drop shadows            -> none (inset hairlines stay, recoloured; filter drop-shadows too)
  - font-weight 700-900     -> 600
One file per source, so a page loads only the corporate pass for the stylesheets it already loads (build.py corp_head).
The hand-written half (hero media, section kit, cards, FAQ, close band) is assets/css/corp-inner.css."""
import colorsys
import pathlib
import re

import calm_css as C   # parsing helpers (split_top, parse_col, COL_TOKEN)

ROOT = pathlib.Path(__file__).resolve().parent.parent
CSS = ROOT / "assets" / "css"
OUT = CSS / "corp"
WORLDS = ["construction", "ecommerce", "fnb", "health-wellness", "manufacturing", "medical", "retail", "travel",
          "sol-ai", "sol-app", "sol-auto", "sol-brand", "sol-chat", "sol-enterprise", "sol-erp", "sol-iot", "sol-mkt",
          "sol-net", "sol-rag", "sol-social", "sol-tech", "sol-web", "company", "careers", "blog"]
SOURCES = (["industry-world.css", "industry.css", "industries-calm.css", "company.css", "odoo-walk.css", "calm.css", "demo-kit.css"]
           + ["worlds/%s.css" % w for w in WORLDS])
KEEP_COLOUR = {"demo-kit.css"}   # the demo widgets keep their own product-UI colours (statuses, charts)

INK, NAVY, BLUE, BLUE_D, TINT, ALT, LINE, BLUE_L, ON_DARK = (
    (0x0F, 0x1A, 0x2A), (0x0B, 0x1F, 0x3F), (0x31, 0x67, 0xCA), (0x23, 0x4F, 0xA0), (0xEE, 0xF3, 0xFC),
    (0xF5, 0xF7, 0xFA), (0xE3, 0xE7, 0xED), (0xC9, 0xD7, 0xF2), (0xC8, 0xD2, 0xE4))
CORP = {INK, NAVY, BLUE, BLUE_D, TINT, ALT, LINE, BLUE_L, ON_DARK}


def cool_grey(l):
    """a neutral of the same lightness, nudged cool like the corporate greys (#F5F7FA, #E3E7ED, #667085)"""
    v = round(l * 255)
    return tuple(max(0, min(255, v + d)) for d in (-4, -2, 1))


def corp_col(rgb, role):
    """role: bg | border | text | any"""
    if tuple(rgb) in CORP:
        return None
    h, l, s = colorsys.rgb_to_hls(*[c / 255 for c in rgb])
    if max(rgb) - min(rgb) < (4 if l > .85 else 14):   # greys, white, black: keep (pale tints show their hue sooner)
        return None
    earthy = 15 <= h * 360 <= 70                    # wood, sand, tan, olive: decor, never an accent
    if s < .45 and not earthy and s >= .16 and .22 <= l < .72 and role in ("bg", "any"):
        s = .5                                      # a muted plum / teal / sage accent still reads as THE accent: blue
    if role != "text" and l >= .985:
        return (0xFF, 0xFF, 0xFF)
    if role in ("bg", "any") and l >= .95:
        return ALT
    if l < .3 and s >= .2:                          # deep greens, browns, plums: the navy / ink family
        return INK if role == "border" or l < .1 else BLUE_D if role == "text" and l >= .18 else NAVY
    if s < .45 or (l >= .78 and role != "text"):   # muted tones (wood, sand, sage) and pastel washes lose their hue
        return LINE if role == "border" and l >= .8 else cool_grey(l)
    if role == "border":
        return LINE if l >= .72 else BLUE if l >= .3 else INK
    if role == "text":
        return ALT if l >= .9 else ON_DARK if l >= .62 else BLUE if l >= .3 else BLUE_D if l >= .18 else INK
    if l >= .72:
        return BLUE_L if role == "any" else TINT
    if l >= .3:
        return BLUE
    if l >= .1:
        return NAVY
    return INK


def map_cols(val, role):
    def rep(m):
        rgb, a = C.parse_col(m.group(0))
        if rgb is None:
            return m.group(0)
        n = corp_col(rgb, role)
        return m.group(0) if n is None else C.hexs(n, a)
    return C.COL_TOKEN.sub(rep, val)


GRAD = re.compile(r"(?:repeating-)?(?:linear|radial|conic)-gradient\(")


def flatten(val, role):
    """a background made only of opaque colour-stop gradients (and colours) -> its first stop, mapped"""
    if not GRAD.search(val) or "url(" in val or "var(" in val or "transparent" in val:
        return None
    cols = C.COL_TOKEN.findall(val)
    if not cols:
        return None
    for c in cols:
        rgb, a = C.parse_col(c)
        if rgb is None or (a is not None and a < 1):
            return None
    rgb, _ = C.parse_col(cols[0])
    return C.hexs(corp_col(rgb, role) or rgb)


def var_role(name):
    n = name.lower()
    if re.search(r"line|border|rule|edge|stroke", n):
        return "border"
    if re.search(r"ink|text|txt|fg|label", n):
        return "text"
    if re.search(r"wash|bg|alt|cream|paper|wall|floor|base|card|tint|soft|pale|light|fill", n):
        return "bg"
    return "any"


def radius(val):
    parts = []
    changed = False
    for tok in re.split(r"(\s+|/)", val):
        m = re.fullmatch(r"([\d.]+)(px|rem|em)", tok)
        if m:
            px = float(m.group(1)) * (16 if m.group(2) != "px" else 1)
            if px > 2.5:
                tok, changed = "2px", True
        parts.append(tok)
    return "".join(parts) if changed else None


def shadow(val):
    if val.strip() in ("none", "") or ("var(" in val and not re.search(r"\d", val)):
        return None
    keep = []
    for layer in C.split_top(val):
        toks = re.findall(r"rgba?\([^)]*\)|var\([^)]*\)|\S+", layer)
        nums = [C.px(t) for t in toks if C.px(t) is not None]
        if "inset" in toks and not (len(nums) > 3 and nums[3] >= 3):   # thick inset rings (passe-partout frames) go
            keep.append(map_cols(layer, "border"))
    new = ", ".join(keep) if keep else "none"
    return None if new.replace(" ", "") == val.replace(" ", "") else new


def weight(val):
    return "600" if val.strip() in ("700", "800", "900", "bold", "bolder") else None


def font(val):
    m = re.match(r"\s*(?:(italic|normal)\s+)?(700|800|900|bold)\b", val)
    return (val[:m.start(2)] + "600" + val[m.end(2):]) if m else None


def corp_decl(prop, val, fname):
    p = prop.lower()
    keep_col = fname in KEEP_COLOUR
    out = []
    if p.startswith("--"):
        if keep_col or not C.COL_TOKEN.search(val):
            return out
        role = var_role(p)
        n = flatten(val, role if role != "any" else "bg") if GRAD.search(val) else None
        n = n or map_cols(val, role)
        if n != val:
            out.append((prop, n))
        return out
    if p == "border-radius" or (p.startswith("border-") and p.endswith("-radius")):
        n = radius(val)
        if n:
            out.append((p, n))
        return out
    if p == "box-shadow":
        n = shadow(val)
        if n is not None:
            out.append((p, n))
        return out
    if p in ("filter", "-webkit-filter") and "drop-shadow" in val:
        rest = re.sub(r"drop-shadow\((?:[^()]|\([^()]*\))*\)", "", val).strip()
        out.append((p, rest or "none"))
        return out
    if p == "text-shadow":
        if val.strip() != "none":
            out.append((p, "none"))
        return out
    if p == "font-weight":
        n = weight(val)
        if n:
            out.append((p, n))
        return out
    if p == "font":
        n = font(val)
        if n:
            out.append((p, n))
        return out
    if keep_col:
        return out
    if p in ("background", "background-image", "background-color"):
        n = flatten(val, "bg")
        if n:
            out.append(("background" if p != "background-color" else p, n))
            return out
        n = map_cols(val, "bg")
        if n != val:
            out.append((p, n))
        return out
    if p.startswith("border") or p in ("outline", "outline-color", "column-rule", "column-rule-color"):
        n = map_cols(val, "border")
        if n != val:
            out.append((p, n))
        return out
    if p in ("color", "text-decoration-color", "caret-color", "accent-color", "-webkit-text-fill-color"):
        n = map_cols(val, "text")
        if n != val:
            out.append((p, n))
        return out
    if p in ("fill", "stroke", "stop-color"):
        n = map_cols(val, "any")
        if n != val:
            out.append((p, n))
        return out
    return out


def walk(rules, fname):
    import tinycss2
    out = []
    for r in rules:
        if r.type == "qualified-rule":
            sel = tinycss2.serialize(r.prelude).strip()
            decls = tinycss2.parse_declaration_list(r.content, skip_comments=True, skip_whitespace=True)
            new = []
            for d in decls:
                if d.type != "declaration":
                    continue
                val = tinycss2.serialize(d.value).strip()
                for p, v in corp_decl(d.name, val, fname):
                    new.append("%s:%s%s" % (p, v, "!important" if d.important else ""))
            if new:
                out.append("%s{%s}" % (sel, ";".join(dict.fromkeys(new))))
        elif r.type == "at-rule" and r.lower_at_keyword in ("media", "supports", "container", "layer") and r.content:
            inner = walk(tinycss2.parse_rule_list(r.content, skip_comments=True, skip_whitespace=True), fname)
            if inner:
                out.append("@%s %s{\n%s\n}" % (r.at_keyword, tinycss2.serialize(r.prelude).strip(), "\n".join(inner)))
    return out


def build():
    try:
        import tinycss2
    except ImportError:
        print("corp_css: tinycss2 missing, keeping the committed assets/css/corp/"); return
    n = 0
    for f in SOURCES:
        src = CSS / f
        if not src.exists():
            continue
        rules = tinycss2.parse_stylesheet(src.read_text(encoding="utf-8"), skip_comments=True, skip_whitespace=True)
        body = walk(rules, f)
        dst = OUT / f
        dst.parent.mkdir(parents=True, exist_ok=True)
        txt = ("/* GENERATED by _src/corp_css.py from %s, do not edit. The corporate pass for the inner pages (SAMPLE). */\n" % f
               + "\n".join(body) + "\n")
        if not dst.exists() or dst.read_text(encoding="utf-8") != txt:
            dst.write_text(txt, encoding="utf-8", newline="\n")
        n += len(body)
    print("corp_css: %d override rules -> assets/css/corp/" % n)


if __name__ == "__main__":
    build()
