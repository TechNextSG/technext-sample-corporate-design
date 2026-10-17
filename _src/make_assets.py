"""Generate favicons, a lighter Odoo badge, and the OG image from the brand PNGs.

    python _src/make_assets.py
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
IMG = ROOT / "assets" / "img"
BLUE = (49, 103, 202)
INK = (31, 31, 61)
BODY = (76, 76, 99)


def fit(im: Image.Image, w: int) -> Image.Image:
    r = w / im.width
    return im.resize((w, round(im.height * r)), Image.LANCZOS)


def trim(im: Image.Image) -> Image.Image:
    bbox = im.getchannel("A").getbbox()
    return im.crop(bbox) if bbox else im


def favicons():
    # the plane cut from the horizontal logo (see split_logo) is the favicon source
    icon = trim(Image.open(IMG / "logo-plane.png").convert("RGBA"))
    side = max(icon.size)
    pad = int(side * 0.08)
    canvas = Image.new("RGBA", (side + 2 * pad, side + 2 * pad), (0, 0, 0, 0))
    canvas.paste(icon, ((canvas.width - icon.width) // 2, (canvas.height - icon.height) // 2), icon)
    for name, size in (("favicon-32.png", 32), ("favicon-192.png", 192), ("apple-touch-icon.png", 180)):
        out = canvas.resize((size, size), Image.LANCZOS)
        if name == "apple-touch-icon.png":  # iOS wants an opaque square
            bg = Image.new("RGBA", out.size, (255, 255, 255, 255))
            bg.paste(out, (0, 0), out)
            out = bg
        out.save(IMG / name, optimize=True)


def badge():
    b = Image.open(IMG / "odoo-ready-partner.png").convert("RGBA")
    b = trim(b)
    if b.width > 900:
        fit(b, 900).save(IMG / "odoo-ready-partner.png", optimize=True)


def split_logo():
    """Cut the horizontal logo into plane + wordmark for the one-time intro animation."""
    src = Image.open(IMG / "logo-horizontal.png").convert("RGBA")
    a = src.getchannel("A")
    w = src.width
    # first fully transparent column after the plane starts the gap
    cols = [max(a.getpixel((x, y)) for y in range(src.height)) for x in range(w)]
    start = next(x for x in range(w) if cols[x] > 8)
    gap = next(x for x in range(start + 40, w) if cols[x] <= 8)
    text_start = next(x for x in range(gap, w) if cols[x] > 8)
    plane = trim(src.crop((0, 0, gap, src.height)))
    text = trim(src.crop((text_start, 0, w, src.height)))
    plane.save(IMG / "logo-plane.png", optimize=True)
    text.save(IMG / "logo-text.png", optimize=True)
    return plane.size, text.size


def split_letters():
    """Cut the wordmark into its letters for the letter-by-letter intro. A letter is a connected region
    of the alpha channel, so a kerned pair whose boxes overlap ("Te") still splits; two glyphs that touch
    ("xt") are cut at the thinnest column of the joint, and faint anti-aliasing pixels go to the nearest
    letter. Each image keeps the wordmark's full height (vertical alignment is trivial) and holds
    only its own letter's pixels, so the letters recompose the wordmark exactly.
    Writes assets/img/letters/l<i>.png and _src/letters.json with each letter's x / width as fractions."""
    import json
    from collections import deque
    im = Image.open(IMG / "logo-text.png").convert("RGBA")
    W, H = im.size
    px = im.getchannel("A").load()
    lab = [[0] * W for _ in range(H)]
    near = [(dx, dy) for dx in (-1, 0, 1) for dy in (-1, 0, 1) if dx or dy]

    def region(x, y, ok):
        """the 8-connected pixels around (x, y) that pass ok()"""
        seen, q = {(x, y)}, deque([(x, y)])
        while q:
            cx, cy = q.popleft()
            for dx, dy in near:
                p = (cx + dx, cy + dy)
                if 0 <= p[0] < W and 0 <= p[1] < H and p not in seen and ok(*p):
                    seen.add(p)
                    q.append(p)
        return seen

    # 1. solid glyph bodies (alpha >= 16); specks are left for step 3
    glyphs, done = [], set()
    for y in range(H):
        for x in range(W):
            if px[x, y] >= 16 and (x, y) not in done:
                g = region(x, y, lambda a, b: px[a, b] >= 16)
                done |= g
                if len(g) >= 40:
                    glyphs.append(g)
    # 2. a body much wider than the typical letter is two touching glyphs: cut it at its thinnest
    #    column, then hand any piece left stranded on the wrong side back to the other half
    widths = sorted(max(p[0] for p in g) - min(p[0] for p in g) for g in glyphs)
    typical = widths[len(widths) // 2]
    for g in list(glyphs):
        x0, x1 = min(p[0] for p in g), max(p[0] for p in g)
        if x1 - x0 < typical * 1.6:
            continue
        count = {}
        for p in g:
            count[p[0]] = count.get(p[0], 0) + 1
        cut = min(range(x0 + (x1 - x0) * 3 // 10, x1 - (x1 - x0) * 3 // 10), key=lambda c: count.get(c, 0))
        halves = [{p for p in g if p[0] <= cut}, {p for p in g if p[0] > cut}]
        for i in (0, 1):
            h = halves[i]
            pieces = []
            while h:
                s = next(iter(h))
                piece = region(s[0], s[1], lambda a, b: (a, b) in h) | {s}
                pieces.append(piece)
                h = h - piece
            pieces.sort(key=len)
            halves[i] = pieces.pop()
            for piece in pieces:
                halves[1 - i] |= piece
        glyphs.remove(g)
        glyphs += halves
    glyphs.sort(key=lambda g: min(p[0] for p in g))
    for n, g in enumerate(glyphs, 1):
        for x, y in g:
            lab[y][x] = n
    # 3. every other pixel joins the nearest letter (breadth-first from the bodies), so no faint
    #    anti-aliasing pixel is lost
    q = deque((x, y) for y in range(H) for x in range(W) if lab[y][x])
    while q:
        x, y = q.popleft()
        for dx, dy in near:
            nx, ny = x + dx, y + dy
            if 0 <= nx < W and 0 <= ny < H and not lab[ny][nx]:
                lab[ny][nx] = lab[y][x]
                q.append((nx, ny))
    out = IMG / "letters"
    out.mkdir(exist_ok=True)
    for old in out.glob("*.png"):
        old.unlink()
    meta = {"w": W, "h": H, "letters": []}
    src = im.load()
    for n in range(1, len(glyphs) + 1):
        cols = [x for x in range(W) if any(lab[y][x] == n and px[x, y] for y in range(H))]
        s, e = cols[0], cols[-1] + 1
        letter = Image.new("RGBA", (e - s, H), (0, 0, 0, 0))
        dst = letter.load()
        for y in range(H):
            for x in range(s, e):
                if lab[y][x] == n and px[x, y]:
                    dst[x - s, y] = src[x, y]
        letter.save(out / f"l{n - 1}.png", optimize=True)
        meta["letters"].append({"x": round(s / W, 4), "w": round((e - s) / W, 4)})
    (Path(__file__).resolve().parent / "letters.json").write_text(json.dumps(meta), encoding="utf-8")
    return len(glyphs), [round(m["w"] * W) for m in meta["letters"]]


def font(size: int, bold=False):
    for name in (("segoeuib.ttf" if bold else "segoeui.ttf"), ("arialbd.ttf" if bold else "arial.ttf")):
        p = Path(r"C:\Windows\Fonts") / name
        if p.exists():
            return ImageFont.truetype(str(p), size)
    return ImageFont.load_default()


def og():
    W, H = 1200, 630
    im = Image.new("RGB", (W, H), (255, 255, 255))
    d = ImageDraw.Draw(im)
    # soft blue wash, bottom-right
    wash = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    wd = ImageDraw.Draw(wash)
    wd.ellipse((700, 250, 1500, 1000), fill=(234, 240, 251, 255))
    im.paste(wash, (0, 0), wash)
    d = ImageDraw.Draw(im)
    logo = fit(Image.open(IMG / "logo-horizontal.png").convert("RGBA"), 360)
    im.paste(logo, (80, 80), logo)
    d.text((80, 220), "Odoo ERP for growing companies.", font=font(58, True), fill=INK)
    d.text((80, 300), "Accounting · Sales · Inventory", font=font(40), fill=BLUE)
    d.text((80, 380), "Implemented by an Odoo Partner in Singapore.", font=font(30), fill=BODY)
    bdg = fit(Image.open(IMG / "odoo-ready-partner.png").convert("RGBA"), 300)
    im.paste(bdg, (W - bdg.width - 80, H - bdg.height - 70), bdg)
    d.rectangle((0, H - 8, W, H), fill=BLUE)
    im.save(IMG / "og-image.png", optimize=True)


if __name__ == "__main__":
    import sys
    if "--intro-only" in sys.argv:
        print("plane, text =", split_logo())
        print("letters =", split_letters())
        sys.exit()
    print("plane, text =", split_logo())
    print("letters =", split_letters())
    favicons()
    badge()
    og()
    for p in sorted(IMG.glob("*.png")):
        print(f"{p.name:28} {p.stat().st_size // 1024:5d} KB")
