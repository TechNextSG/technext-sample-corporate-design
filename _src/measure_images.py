# -*- coding: utf-8 -*-
"""Record the pixel size of every odoo.com screenshot used on the app pages.

build.py frames each screenshot by its own aspect ratio (so nothing is cropped by accident)
and drops toolbar strips that make no sense on their own. It reads the sizes from
_src/odoo_image_dims.json, which this script keeps up to date:

    python -B _src/measure_images.py          # measure images that are not in the file yet
    python -B _src/measure_images.py --all    # re-measure everything

Only the first few KB of each file are fetched: PNG, GIF, JPEG and WebP all carry their
size in the header.
"""
import json, re, struct, sys, urllib.request
from pathlib import Path

SRC = Path(__file__).resolve().parent
CONTENT = SRC / "apps_content.json"
OUT = SRC / "odoo_image_dims.json"
MEDIA = SRC / "odoo_media.json"          # odoocdn URL -> self-hosted copy (see build.py local_media)
UA = "Mozilla/5.0 (TechNext site build; +https://technext.asia/)"


ODOOCDN = re.compile(r"https://odoocdn\.com/[^\s\"'<>)|]+?\.(?:webp|png|jpe?g|gif)(?:\?[^\s\"'<>)|]*)?")


def image_urls() -> list:
    """Every odoo.com screenshot the site uses: the app pages' content plus any odoocdn image
    referenced from the industry data or a page source (blog media, covers)."""
    data = json.loads(CONTENT.read_text(encoding="utf-8"))
    urls = set()
    for app in data.values():
        urls.update(u for u in app.get("images", []) if not u.endswith(".svg"))
        urls.update(s["img"] for s in app.get("sections", []) if s.get("img") and not s["img"].endswith(".svg"))
    for f in [SRC / "industries.py", *sorted((SRC / "pages").rglob("*.html"))]:
        if f.exists():
            urls.update(ODOOCDN.findall(f.read_text(encoding="utf-8")))
    return sorted(urls)


def size_from_bytes(b: bytes):
    if b[:8] == b"\x89PNG\r\n\x1a\n":
        return struct.unpack(">II", b[16:24])
    if b[:6] in (b"GIF87a", b"GIF89a"):
        return struct.unpack("<HH", b[6:10])
    if b[:4] == b"RIFF" and b[8:12] == b"WEBP":
        kind = b[12:16]
        if kind == b"VP8 ":
            w, h = struct.unpack("<HH", b[26:30])
            return w & 0x3FFF, h & 0x3FFF
        if kind == b"VP8L":
            b0, b1, b2, b3 = b[21:25]
            return 1 + (((b1 & 0x3F) << 8) | b0), 1 + (((b3 & 0x0F) << 10) | (b2 << 2) | ((b1 & 0xC0) >> 6))
        if kind == b"VP8X":
            return 1 + int.from_bytes(b[24:27], "little"), 1 + int.from_bytes(b[27:30], "little")
    if b[:2] == b"\xff\xd8":
        i = 2
        while i + 9 < len(b):
            if b[i] != 0xFF:
                i += 1
                continue
            marker = b[i + 1]
            if marker in (0xD8, 0x01) or 0xD0 <= marker <= 0xD7:
                i += 2
                continue
            seg = struct.unpack(">H", b[i + 2:i + 4])[0]
            if 0xC0 <= marker <= 0xCF and marker not in (0xC4, 0xC8, 0xCC):
                h, w = struct.unpack(">HH", b[i + 5:i + 9])
                return w, h
            i += 2 + seg
    return None


def measure(url: str):
    for want in (65536, None):                 # a header range first, the whole file if that fails
        headers = {"User-Agent": UA}
        if want:
            headers["Range"] = f"bytes=0-{want - 1}"
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=headers), timeout=30) as r:
                size = size_from_bytes(r.read())
        except Exception as e:                  # noqa: BLE001 - report and move on
            print(f"  !! {url}: {e}")
            return None
        if size:
            return list(size)
    print(f"  !! {url}: unknown image format")
    return None


def measure_local(path: Path):
    """Size of a self-hosted copy (assets/img/odoo-media/...), read from its header."""
    with open(path, "rb") as f:
        return list(size_from_bytes(f.read(65536)) or []) or None


def main():
    dims = {} if "--all" in sys.argv or not OUT.exists() else json.loads(OUT.read_text(encoding="utf-8"))
    urls = image_urls()
    # self-hosted copies (_src/odoo_media.json): measured from disk and recorded under their local path
    # too. A downscaled copy keeps the original's shape, so framing still uses the odoo.com size.
    media = json.loads(MEDIA.read_text(encoding="utf-8")) if MEDIA.exists() else {}
    local = sorted({m["path"] for u, m in media.items() if u in set(urls) and (SRC.parent / m["path"]).exists()})
    for p in local:
        size = measure_local(SRC.parent / p)
        if size:
            dims[p] = size
    urls = sorted(set(urls) | set(local))
    todo = [u for u in urls if u not in dims]
    for k, u in enumerate(todo, 1):
        size = measure(u)
        if size:
            dims[u] = size
            print(f"  {k}/{len(todo)}  {size[0]}x{size[1]}  {u.rsplit('/', 1)[-1]}")
    dims = {u: dims[u] for u in sorted(dims) if u in set(urls)}
    OUT.write_text(json.dumps(dims, indent=0, sort_keys=True) + "\n", encoding="utf-8", newline="\n")
    missing = [u for u in urls if u not in dims]
    print(f"{len(dims)} images measured, {len(todo)} new, {len(missing)} missing -> {OUT.name}")
    return 1 if missing else 0


if __name__ == "__main__":
    sys.exit(main())
