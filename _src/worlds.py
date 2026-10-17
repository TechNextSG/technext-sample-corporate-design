# -*- coding: utf-8 -*-
"""Industry "worlds": industry pages dressed as Nexi Explains episodes (build.py renders a page as a world when its industry
key has a module in _src/vignettes/). Every world is self-contained, so worlds can be built side by side:

  _src/vignettes/<key>.py              SCENES (six animated SVG vignettes, in industries.IND[key]["flow"] order),
                                       CHIPS (six (odoo_icon, sample record) pairs; HTML allowed, e.g. <span data-v> fields)
                                       and META: tag (the sample business, shown on the scenes), samples + pick (an optional
                                       sample picker for the workflow) and m (short phone copy: intro, flow)
  assets/js/worlds/<key>.js            the hero room, props and cast (registers IXW.worlds[<key>] with the engine's kit)
  assets/css/worlds/<key>.css          the world's palette and its own section designs
  assets/img/industries/<key>/         Nexi's nine poses in the world's costume + poses.json (qa/ind-medical/export_web.py)
  _src/pages/industries/<key>.html     the hero markup (hotspots, cast, toys, caption copy) and the page's own sections

The engine (assets/js/industry-world.js + assets/css/industry-world.css) is shared by every world.
"""
import html
import importlib
import json
import pathlib

_ROOT = pathlib.Path(__file__).resolve().parent.parent
_POSES = {}


def img_dir(world: str) -> str:
    """Nexi's poses for a world: its own costume (assets/img/industries/<world>/), or, for the Company pages, Nexi wearing
    her TechNext ID (assets/img/nexi-id/)."""
    return f"industries/{world}" if (_ROOT / "assets/img/industries" / world / "poses.json").exists() else "nexi-id"


def poses(world: str) -> dict:
    """Pose anchors at the exported size (w, h and the body anchor ax, ay), so every pose pins to the same point."""
    if world not in _POSES:
        _POSES[world] = json.loads((_ROOT / "assets/img" / img_dir(world) / "poses.json").read_text(encoding="utf-8"))
    return _POSES[world]


def pose_img(world: str, pose: str, on: bool = False, prio: str = "low") -> str:
    p = poses(world)[pose]
    return (f'<img class="ixw-pose{" is-on" if on else ""}" data-pose="{pose}" src="{{{{ROOT}}}}assets/img/{img_dir(world)}/nexi-{pose}.webp" '
            f'alt="" width="{p["w"]}" height="{p["h"]}" decoding="async" fetchpriority="{prio}" style="--w:{p["w"]};--h:{p["h"]};--ax:{p["ax"]};--ay:{p["ay"]}">')


def nexi_stack(world: str, first: str = "hello") -> str:
    """Every pose stacked on one anchor; the script shows one at a time."""
    return "".join(pose_img(world, k, k == first, "high" if k == first else "low") for k in poses(world))


def avatar(world: str) -> str:
    p = poses(world)["hello"]
    return (f'<img src="{{{{ROOT}}}}assets/img/{img_dir(world)}/nexi-hello.webp" alt="" width="{p["w"]}" height="{p["h"]}" decoding="async" '
            'fetchpriority="low">')


def module(key: str):
    return importlib.import_module("vignettes." + key.replace("-", "_"))


def scenes(key: str):
    m = module(key)
    return m.SCENES, m.CHIPS


def _discover() -> dict:
    out = {}
    for f in sorted((_ROOT / "_src/vignettes").glob("*.py")):
        if f.stem.startswith("_"):
            continue
        key = f.stem.replace("_", "-")
        meta = getattr(module(key), "META", {})
        out[key] = {"img": key, "tag": meta.get("tag", "Sample"), "note": meta.get("note"), "samples": meta.get("samples"), "pick": meta.get("pick"),
                    "m": meta.get("m", {})}
    return out


WORLDS = _discover()


# ---------------------------------------------------------------- the entry intro
# A short (3 s) intro in the world's own colours, in the spirit of the home page's: the industry badge pops, Nexi
# in costume peeks out from behind it, the title lands, three workflow steps burst out, then an iris opens onto the hero.
# The head gate shows it on entry (fresh load, link, refresh), never on back/forward, for bots or with reduced motion;
# ?intro=1 forces it, ?nointro=1 skips it. industry-world.js runs the timeline.
INTRO_HEAD = ("<style>#ixw-intro{display:none}html.ixw-intro #ixw-intro,#ixw-intro.is-out{display:grid}</style>\n"
              "<script>(function(){try{var q=location.search,force=/[?&]intro=1(&|$)/.test(q);"
              "var nav=(performance.getEntriesByType&&performance.getEntriesByType('navigation')[0])||{};"
              "var bot=/bot\\/|bot;|crawler|spider|lighthouse|pagespeed|headlesschrome|google-inspectiontool|googleother|bingbot|googlebot/i.test(navigator.userAgent||'');"
              "if(force||(nav.type!=='back_forward'&&!bot&&!/[?&]nointro=1/.test(q)&&!matchMedia('(prefers-reduced-motion: reduce)').matches)){document.documentElement.classList.add('ixw-intro');}}catch(e){}})();</script>\n")


def intro_html(world: str) -> str:
    """The entry intro in the page's own style: the world's own colour and pattern behind (--ii-bg, --ii-pattern), its own title card (the same .ixw-copy skin
    as the hero) with the Nexi Explains tag, the hand label, the industry and three workflow steps in the page's button
    style; the badge pops above the card with Nexi peeking out, and the iris opens from it onto the hero."""
    import re as _re
    from industries import IND
    meta = module(world).META
    ind = IND.get(world) or getattr(module(world), "FLOW", {"name": meta.get("tag", ""), "flow": []})   # Company pages are not industries
    src = _ROOT / "_src/pages" / (meta.get("page") or f"industries/{world}.html")
    # a generated page (the Odoo app pages) has no source file: its intro takes the ep label and hand from META
    page = src.read_text(encoding="utf-8") if src.exists() else (f'<p class="ixw-ep"><a></a><span>{meta.get("tag", "")}</span></p>'
                                                                  f'<span class="hand h1-hand">{meta.get("hand", "")}</span>')
    m_ep = _re.search(r'<p class="ixw-ep">.*?</a><span>(.*?)</span></p>', page, _re.S)
    m_hd = _re.search(r'<span class="hand h1-hand">(.*?)</span>', page)
    title = meta.get("intro_title") or f'Odoo for <b>{ind["name"]}</b>'
    badge = meta.get("badge") or f"ind-{world}"
    if meta.get("intro_pills"):
        pills = "".join(f'<span class="ixwi-pill" style="--i:{i};--side:{i - 1}">{{{{icon:{ic}}}}}{t}</span>' for i, (ic, t) in enumerate(meta["intro_pills"]))
    else:
        steps = [f for f in ind["flow"] if f.get("app")][:3]
        pills = "".join(f'<span class="ixwi-pill" style="--i:{i};--side:{i - 1}">{{{{odoo:{f["app"]}:18}}}}{f["t"]}</span>' for i, f in enumerate(steps))
    sparks = "".join(f'<i class="ixwi-spark" style="--a:{a}deg;--d:{d}"></i>' for a, d in ((10, 1.2), (62, 1.6), (118, 1.3), (170, 1.7), (222, 1.25), (276, 1.55), (322, 1.35)))
    nexi = poses(world)["hello"]
    return (f'<div class="ixwi" id="ixw-intro" aria-hidden="true">\n'
            f'  <div class="ixwi-bg"></div>\n'
            f'  <span class="ixwi-rays"></span>\n'
            f'  <span class="ixwi-ring"></span>\n'
            f'  <div class="ixwi-lock">\n'
            f'    <div class="ixw-copy ixwi-card">\n'
            f'      <span class="ixwi-mark"><span class="ixwi-ripple"></span><span class="ixwi-ripple"></span>{sparks}'
            f'<img class="ixwi-nexi" src="{{{{ROOT}}}}assets/img/{img_dir(world)}/nexi-hello.webp" alt="" width="{nexi["w"]}" height="{nexi["h"]}" decoding="sync" fetchpriority="high">'
            f'<span class="ixwi-badge">{{{{icon:{badge}}}}}</span></span>\n'
            f'      <p class="ixw-ep ixwi-ep"><span class="ixw-ep-tag">{{{{icon:play}}}}Nexi Explains</span><span>{m_ep.group(1) if m_ep else ""}</span></p>\n'
            f'      <span class="hand h1-hand ixwi-hand">{m_hd.group(1) if m_hd else ""}</span>\n'
            f'      <span class="ixwi-title">{title}</span>\n'
            f'      <span class="ixwi-sub">{meta.get("intro_sub") or meta["tag"]}</span>\n'
            f'      <span class="ixwi-pills">{pills}</span>\n'
            f'    </div>\n'
            f'  </div>\n'
            f'  <span class="ixwi-bar"></span>\n'
            f'  <button class="ixwi-skip" type="button" tabindex="-1">Skip</button>\n'
            f'</div>\n')


# ---------------------------------------------------------------- the homepage showcase (slide 3 of the hero)
# The slide becomes each world's hero in turn: its illustrated backdrop (no people; _src/backdrops.py), its title card and
# buttons (hero-skins.css, from _src/hero_skins.py), Nexi in costume at natural proportions with the workflow steps.
# assets/js/hero-industries.js runs it; assets/css/hero.css styles the frame (.hxs-*).
SHOW_ORDER = ["medical", "travel", "retail", "ecommerce", "construction", "fnb", "manufacturing", "health-wellness"]
SHOW_SKIN = {  # accent, ink, light
    "medical": ("#21B799", "#0F4C45", "#E3F6F1"), "travel": ("#FFC94A", "#17284A", "#FFF6DC"), "retail": ("#D9785A", "#3D405B", "#FBEBE3"),
    "ecommerce": ("#6D5BD0", "#2B2350", "#ECE8FA"), "construction": ("#FFC93C", "#1E2A3A", "#FFF4D4"), "fnb": ("#E2553D", "#13332A", "#FCE6E1"),
    "manufacturing": ("#FF7A1A", "#1E2A33", "#FFEBDD"), "health-wellness": ("#8C76B8", "#3B3651", "#EFEAF7"),
}


def _reacts(world: str) -> list:
    """Nexi's reactions from the industry page's own hero (data-reacts="pose::line|..."), lines keep their **bold**."""
    import re as _re
    s = (_ROOT / "_src/pages/industries" / f"{world}.html").read_text(encoding="utf-8")
    m = _re.search(r'data-reacts="([^"]*)"', s)
    raw = html.unescape(m.group(1)) if m else ""
    return [tuple(x.split("::", 1)) for x in raw.split("|") if "::" in x]


def _hero_bits(world: str) -> dict:
    """The industry page's own hero copy: the episode line, the hand label, the headline and the lead (both lengths)."""
    import re as _re
    s = (_ROOT / "_src/pages/industries" / f"{world}.html").read_text(encoding="utf-8")
    g = lambda pat: (_re.search(pat, s, _re.S).group(1).strip() if _re.search(pat, s, _re.S) else "")
    return {"ep": g(r'<p class="ixw-ep">.*?</a><span>(.*?)</span></p>'), "hand": g(r'<span class="hand h1-hand">(.*?)</span>'),
            "h1": g(r'<h1 id="ixw-h1">.*?</span>(.*?)</h1>'), "lead": g(r'<p class="lead"><span class="m-full">(.*?)</span>'),
            "lead_m": g(r'<p class="lead"><span class="m-full">.*?</span><span class="m-short">(.*?)</span>')}


def showcase_html() -> str:
    """Slide 3 of the homepage hero: the whole slide becomes each industry's hero in turn. Behind, the world's real scene
    (assets/img/industries/<key>/backdrop.svg); in front, the page's own title card (its .ixw-copy skin, Nexi Explains tag,
    hand label, headline, lead and buttons, from hero-skins.css), Nexi in costume with three workflow steps, and a strip of
    the eight badges. hero-industries.js runs it."""
    from industries import IND
    bgs, panels, casts, chans = [], [], [], []
    for i, k in enumerate(SHOW_ORDER):
        ind, meta, b = IND[k], module(k).META, _hero_bits(k)
        on = " is-on" if i == 0 else ""
        hid = "false" if i == 0 else "true"
        steps = [f for f in ind["flow"] if f.get("app")][:3]
        pills = "".join(f'<span class="hxs-pill" style="--j:{j}">{{{{odoo:{f["app"]}:18}}}}{f["t"]}</span>' for j, f in enumerate(steps))
        p = poses(k)["present"]
        bgs.append(f'<div class="hxs-bg{on}" data-k="{k}"><img class="hxs-bgi" alt="" decoding="async" data-src="{{{{ROOT}}}}assets/img/industries/{k}/backdrop.svg"></div>')
        panels.append(
            f'<div class="hxs-panel hxs--{k}{on}" data-k="{k}" aria-hidden="{hid}"><div class="ixw-copy hxs-card">'
            f'<p class="ixw-ep"><span class="ixw-ep-tag">{{{{icon:play}}}}Nexi Explains</span><span>{b["ep"]}</span></p>'
            f'<span class="hand h1-hand">{b["hand"]}</span>'
            f'<p class="hxs-h">{b["h1"]}</p>'
            f'<p class="lead"><span class="m-full">{b["lead"]}</span><span class="m-short">{b["lead_m"]}</span></p>'
            f'<div class="actions"><a class="btn btn-primary" href="{{{{ROOT}}}}industries/{k}.html" tabindex="{0 if i == 0 else -1}">Explore {ind["name"]} {{{{icon:arrow}}}}</a>'
            f'<a class="btn btn-ghost" href="#talk" tabindex="{0 if i == 0 else -1}">{{{{icon:chat}}}}Talk to us</a></div>'
            f'<p class="ixw-hint">{{{{icon:sparkle}}}}<span>{meta["tag"]} · pick another industry</span></p>'
            f'</div></div>')
        # Nexi as the model: every reaction pose stacked on one body anchor, the page's own reaction lines, a bubble above
        P = poses(k); reacts = _reacts(k); stack = ["present"] + [ps for ps, _ in reacts if ps in P and ps != "present"]
        imgs = "".join(f'<img class="hxs-pose{" is-on" if ps == "present" else ""}" data-pose="{ps}" alt="" width="{P[ps]["w"]}" height="{P[ps]["h"]}" '
                       f'style="--w:{P[ps]["w"]};--ax:{P[ps]["ax"]};--ay:{P[ps]["ay"]}" decoding="async" data-src="{{{{ROOT}}}}assets/img/industries/{k}/nexi-{ps}.webp">' for ps in stack)
        rx = html.escape("|".join(f"{ps}::{t}" for ps, t in reacts), quote=True)
        casts.append(f'<div class="hxs-cast hxs--{k}{on}" data-k="{k}" style="--hy:{P["present"]["ay"]}">'
                     f'<button class="hxs-nexi-b" type="button" data-reacts="{rx}" aria-label="Nexi in the {ind["name"]} costume: tap for a reaction" tabindex="{0 if i == 0 else -1}">{imgs}</button>'
                     f'<span class="hxs-say" role="status" aria-live="polite"></span><span class="hxs-tap" aria-hidden="true">Tap me!</span>'
                     f'<span class="hxs-pills" aria-hidden="true">{pills}</span></div>')
        chans.append(f'<button class="hxs-ch hxs--{k}{on}" type="button" role="tab" data-k="{k}" aria-selected="{"true" if i == 0 else "false"}" '
                     f'tabindex="{0 if i == 0 else -1}" aria-label="{ind["name"]}">{{{{icon:ind-{k}}}}}<i></i></button>')
    return ('<div class="hxs" data-inds>\n'
            '  <div class="hxs-sky" aria-hidden="true">' + "".join(bgs) + '<span class="hxs-veil"></span></div>\n'
            '  <div class="container slide-inner hxs-inner">\n'
            '    <div class="hxs-left">\n'
            '      <h2 class="sr-only">Odoo for your industry</h2>\n'
            '      <div class="hxs-cards">' + "".join(panels) + '</div>\n'
            '      <div class="hxs-strip"><span class="hxs-strip-l">Eight industries</span><div class="hxs-chs" role="tablist" aria-label="Industries">' + "".join(chans) + '</div></div>\n'
            '    </div>\n'
            '    <div class="hxs-stage">' + "".join(casts) + '</div>\n'
            '  </div>\n'
            '</div>')
