"""Per-page share cards (og:image, 1200x630) in the style of assets/img/og-image.png.

Each page gets its own card: a section label, its title and its address and, on Odoo app pages,
the app's icon (other pages carry the Odoo Ready Partner badge). Cards are cached in
assets/img/og/ and are only redrawn when a page's title, label or icon changes
(manifest: assets/img/og/cards.json). The home page keeps assets/img/og-image.png.
"""
import hashlib
import json
import re
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
IMG = ROOT / "assets" / "img"
OUT = IMG / "og"
MANIFEST = OUT / "cards.json"
VERSION = "2"                     # bump to redraw every card after a design change

W, H = 1200, 630
INK, BLUE, BODY, WASH = (31, 31, 61), (49, 103, 202), (76, 76, 99), (234, 240, 251)

SECTIONS = [                      # (out_rel prefix, label)
    ("odoo/apps/", "Odoo app"),
    ("industries/", "Odoo for your industry"),
    ("solutions/", "TechNext solution"),
    ("odoo/", "Odoo ERP"),
    ("blog/", "TechNext blog"),
    ("offices/", "TechNext offices"),
    ("", "TechNext"),
]

_manifest = None
_used = set()
_fonts = {}


def font(size, bold=False):
    key = (size, bold)
    if key not in _fonts:
        for name in (("segoeuib.ttf" if bold else "segoeui.ttf"), ("arialbd.ttf" if bold else "arial.ttf")):
            p = Path(r"C:\Windows\Fonts") / name
            if p.exists():
                _fonts[key] = ImageFont.truetype(str(p), size)
                break
        else:
            _fonts[key] = ImageFont.load_default()
    return _fonts[key]


def fit(im, w):
    return im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)


def svg_icon(path, size):
    import pymupdf                # renders the Odoo app SVGs
    doc = pymupdf.open(stream=Path(path).read_bytes(), filetype="svg")
    page = doc[0]
    z = size / page.rect.width
    pix = page.get_pixmap(matrix=pymupdf.Matrix(z, z), alpha=True)
    return Image.frombytes("RGBA", (pix.width, pix.height), pix.samples)


def clean_title(t):
    t = re.sub(r"\s*[|·—–-]\s*TechNext\s*$", "", t).strip()
    return t.replace("&amp;", "&").replace("&quot;", '"').replace("&#39;", "'")


def wrap(d, text, f, width):
    # a dash never starts a line: it stays glued to the word before it
    words = re.sub(r"\s+([—–])\s+", "\u00a0\\1 ", text).split(" ")
    lines, cur = [], ""
    for word in words:
        trial = (cur + " " + word).strip()
        if d.textlength(trial, font=f) <= width or not cur:
            cur = trial
        else:
            lines.append(cur)
            cur = word
    return lines + ([cur] if cur else [])


def title_block(d, text, width):
    """Largest size (64 down to 40) that fits the title in 3 lines; ellipsis as a last resort."""
    for size in range(64, 39, -4):
        f = font(size, True)
        lines = wrap(d, text, f, width)
        if len(lines) <= 3:
            return f, lines
    f = font(40, True)
    lines = wrap(d, text, f, width)[:3]
    while d.textlength(lines[-1] + "…", font=f) > width:
        lines[-1] = lines[-1].rsplit(" ", 1)[0]
    lines[-1] += "…"
    return f, lines


def draw(title, label, url, icon):
    im = Image.new("RGB", (W, H), (255, 255, 255))
    wash = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(wash).ellipse((760, 250, 1560, 1050), fill=WASH + (255,))
    im.paste(wash, (0, 0), wash)
    d = ImageDraw.Draw(im)
    logo = fit(Image.open(IMG / "logo-horizontal.png").convert("RGBA"), 300)
    im.paste(logo, (80, 72), logo)

    d.text((80, 186), label.upper(), font=font(24, True), fill=BLUE)
    f, lines = title_block(d, title, 700)
    lh = round(f.size * 1.18)
    y = 228
    for line in lines:
        d.text((80, y), line, font=f, fill=INK)
        y += lh
    d.text((80, y + 22), url, font=font(28), fill=BODY)

    if icon:
        ic = svg_icon(icon, 220)
        cx, cy = 1000, 400
        ImageDraw.Draw(im).rounded_rectangle((cx - 150, cy - 150, cx + 150, cy + 150), 48, fill=(255, 255, 255))
        im.paste(ic, (cx - ic.width // 2, cy - ic.height // 2), ic)
    else:
        bdg = fit(Image.open(IMG / "odoo-ready-partner.png").convert("RGBA"), 260)
        im.paste(bdg, (W - bdg.width - 80, H - bdg.height - 70), bdg)
    d.rectangle((0, H - 8, W, H), fill=BLUE)
    return im


def card(out_rel, title, icon=None):
    """Draws (or reuses) the card for one page; returns its path relative to the site root."""
    global _manifest
    if out_rel == "index.html":
        return "assets/img/og-image.png"
    if _manifest is None:
        OUT.mkdir(parents=True, exist_ok=True)
        _manifest = json.loads(MANIFEST.read_text(encoding="utf-8")) if MANIFEST.exists() else {}
    label = next(l for p, l in SECTIONS if out_rel.startswith(p))
    title = clean_title(title)
    slug = re.sub(r"\.html$", "", out_rel)
    url = "technext.asia/" + slug
    name = slug.replace("/", "-") + ".jpg"
    # the icon by file name only, so the key (and the ?v= on og:image) is the same in every checkout/worktree
    key = hashlib.sha1("|".join([VERSION, title, label, url, Path(icon).name if icon else ""]).encode()).hexdigest()[:12]
    if _manifest.get(name) != key or not (OUT / name).exists():
        draw(title, label, url, icon).save(OUT / name, "JPEG", quality=88, optimize=True, progressive=True)
        _manifest[name] = key
    _used.add(name)
    return f"assets/img/og/{name}?v={key[:8]}"


def save_manifest():
    """Writes the manifest and deletes cards of pages that no longer exist."""
    if _manifest is None:
        return
    for name in list(_manifest):
        if name not in _used:
            _manifest.pop(name)
            (OUT / name).unlink(missing_ok=True)
    MANIFEST.write_text(json.dumps(_manifest, indent=1, sort_keys=True) + "\n", encoding="utf-8", newline="\n")
