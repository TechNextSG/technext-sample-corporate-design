# -*- coding: utf-8 -*-
"""Turn a folder of company photos (JPG/PNG) into the /life gallery's files, and print the entries to paste.

    python _src/life_photos.py <folder> [--category outings] [--place "Taguig City"] [--date 2026-11-14] [--prefix team-dinner]

For each image it writes assets/img/life/<name>.webp (long side about 1600 px) and <name>-thumb.webp (long side about
600 px), auto-rotated from EXIF and with the metadata (GPS, camera) dropped, then prints one LIFE_PHOTOS entry per photo for
assets/js/life-gallery.js. Fill in caption and alt by hand: say only what the photo really shows.
category: outings | dinners | meetings | office | events | milestones.
"""
import argparse
import json
import pathlib
import re
import sys

from PIL import Image, ImageOps

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "assets/img/life"
CATS = ("outings", "dinners", "meetings", "office", "events", "milestones")


def slug(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-") or "photo"


def save(im: Image.Image, long_side: int, path: pathlib.Path, quality: int) -> tuple:
    im = im.copy()
    im.thumbnail((long_side, long_side), Image.LANCZOS)
    im.save(path, "WEBP", quality=quality, method=6)
    return im.size


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("folder")
    ap.add_argument("--category", default="office", choices=CATS)
    ap.add_argument("--place", default="")
    ap.add_argument("--date", default="", help="YYYY-MM-DD (or YYYY-MM)")
    ap.add_argument("--prefix", default="", help="file-name prefix, e.g. team-dinner (default: the original file name)")
    a = ap.parse_args()
    src = pathlib.Path(a.folder)
    files = sorted(p for p in src.iterdir() if p.suffix.lower() in (".jpg", ".jpeg", ".png"))
    if not files:
        sys.exit(f"No JPG or PNG files in {src}")
    OUT.mkdir(parents=True, exist_ok=True)
    entries = []
    for n, f in enumerate(files, 1):
        name = f"{slug(a.prefix)}-{n:02d}" if a.prefix else slug(f.stem)
        with Image.open(f) as im:
            im = ImageOps.exif_transpose(im).convert("RGB")
            w, h = save(im, 1600, OUT / f"{name}.webp", 82)
            save(im, 600, OUT / f"{name}-thumb.webp", 78)
        entries.append({"src": f"assets/img/life/{name}.webp", "thumb": f"assets/img/life/{name}-thumb.webp", "w": w, "h": h,
                        "category": a.category, "caption": "", "date": a.date, "place": a.place, "alt": ""})
        print(f"  wrote {name}.webp ({w}x{h}) + thumb", file=sys.stderr)
    print("\n// paste into LIFE_PHOTOS in assets/js/life-gallery.js, then fill in caption and alt")
    for e in entries:
        print("    " + json.dumps(e, ensure_ascii=False) + ",")


if __name__ == "__main__":
    main()
