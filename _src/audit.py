"""Static audit of the built site: links, tokens, SEO tags, headings, alt text, labels,
accessible names, disallowed brand claims, asset weights.

    python _src/audit.py
"""
import collections
import pathlib
import re
import urllib.parse
from html.parser import HTMLParser

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGES = sorted(p for p in ROOT.rglob("*.html") if "_src" not in p.parts and "_screens" not in p.parts
               and not p.name.startswith("google") and p.name not in ("denied.html", "nexi-app.html"))  # nexi-app: the noindex frame inside /nexi
DISALLOWED = ["Certified Odoo Partner", "ISO 27001 certified", "ISO 27001 compliant", "Odoo Gold", "Odoo Silver"]


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = collections.Counter(); self.h = []; self.h1 = 0
        self.imgs_noalt = 0; self.btn_noname = 0; self.ext_norel = 0; self.empty_href = 0
        self.cur_btn = None; self.in_title = False; self.title = ""; self.desc = ""
        self.labels = set(); self.inputs = []; self.lang = False; self.canon = False; self.og = 0

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "html": self.lang = bool(a.get("lang"))
        if "id" in a: self.ids[a["id"]] += 1
        if tag in ("h1", "h2", "h3", "h4", "h5", "h6"):
            self.h.append(int(tag[1])); self.h1 += tag == "h1"
        if tag == "img" and "alt" not in a: self.imgs_noalt += 1
        if tag == "button": self.cur_btn = {"name": a.get("aria-label", ""), "text": ""}
        if tag == "a":
            href = a.get("href", "")
            if href in ("", "#"): self.empty_href += 1
            if href.startswith("http") and a.get("target") == "_blank" and "noopener" not in a.get("rel", ""): self.ext_norel += 1
        if tag == "meta" and a.get("name") == "description": self.desc = a.get("content", "")
        if tag == "meta" and (a.get("property") or "").startswith("og:"): self.og += 1
        if tag == "link" and a.get("rel") == "canonical": self.canon = True
        if tag == "label" and a.get("for"): self.labels.add(a["for"])
        if tag in ("input", "select", "textarea") and a.get("type") not in ("hidden", "submit") and "aria-hidden" not in a:
            self.inputs.append((a.get("id"), a.get("aria-label"), a.get("type")))
        if tag == "title": self.in_title = True

    def handle_data(self, d):
        if self.in_title: self.title += d
        if self.cur_btn is not None: self.cur_btn["text"] += d

    def handle_endtag(self, tag):
        if tag == "title": self.in_title = False
        if tag == "button" and self.cur_btn is not None:
            if not self.cur_btn["name"] and not self.cur_btn["text"].strip(): self.btn_noname += 1
            self.cur_btn = None


def main():
    issues = collections.defaultdict(list)
    total_refs = 0
    for p in PAGES:
        html = p.read_text(encoding="utf-8")
        key = p.relative_to(ROOT).as_posix()
        for m in re.finditer(r'(?:href|src)="([^"#]+)(#[^"]*)?"', html):
            url = m.group(1)
            if url.startswith(("http", "mailto:", "data:", "tel:")): continue
            total_refs += 1
            # The site is served with Vercel `cleanUrls`, so internal links are
            # extensionless: /company resolves to company.html and /odoo/ to
            # odoo/index.html. Accept either spelling before calling a ref broken.
            _t = (p.parent / urllib.parse.unquote(url.split("?")[0].split("#")[0])).resolve()
            if not (_t.exists() or _t.with_suffix(".html").exists()
                    or (_t / "index.html").exists()):
                issues[key].append(f"broken ref {url}")
        for tok in re.findall(r"\{\{[A-Za-z_:0-9]+\}\}", html): issues[key].append(f"leftover token {tok}")
        q = Page(); q.feed(html)
        if not (30 <= len(q.title) <= 75): issues[key].append(f"title length {len(q.title)}: {q.title!r}")
        if not (50 <= len(q.desc) <= 170): issues[key].append(f"meta description length {len(q.desc)}")
        if q.h1 != 1: issues[key].append(f"{q.h1} h1 elements")
        prev = 0
        for lvl in q.h:
            if prev and lvl > prev + 1: issues[key].append(f"heading skip h{prev}->h{lvl}"); break
            prev = lvl
        dup = [i for i, c in q.ids.items() if c > 1]
        if dup: issues[key].append("duplicate ids: " + ", ".join(dup[:6]))
        if q.imgs_noalt: issues[key].append(f"{q.imgs_noalt} img without alt")
        if q.btn_noname: issues[key].append(f"{q.btn_noname} button(s) without accessible name")
        if q.ext_norel: issues[key].append(f"{q.ext_norel} external _blank link(s) without noopener")
        if q.empty_href: issues[key].append(f"{q.empty_href} empty/# href(s)")
        unl = [i for i in q.inputs if not (i[0] in q.labels or i[1])]
        if unl: issues[key].append(f"{len(unl)} input(s) without label: {unl[:3]}")
        if not q.lang: issues[key].append("missing lang")
        if not q.canon: issues[key].append("missing canonical")
        if q.og < 4: issues[key].append("fewer than 4 og: tags")
        for bad in DISALLOWED:
            if bad in html: issues[key].append(f"DISALLOWED claim wording: {bad!r}")
    print(f"{len(PAGES)} pages · {total_refs} local refs checked")
    for k, v in sorted(issues.items()):
        print(k)
        for x in v: print("   -", x)
    if not issues: print("no structural / SEO / accessibility issues found")
    print("--- asset weights ---")
    for f in ["assets/css/site.css", "assets/js/site.js", "assets/js/hero.js", "assets/js/quote.js", "index.html", "odoo/apps.html", "quotation.html"]:
        print(f"{f:26} {(ROOT / f).stat().st_size // 1024:4d} KB")
    svgs = list((ROOT / "assets/img/odoo").glob("*.svg"))
    print(f"{'assets/img/odoo (' + str(len(svgs)) + ' svg)':26} {sum(f.stat().st_size for f in svgs) // 1024:4d} KB")
    pngs = list((ROOT / "assets/img").glob("*.png"))
    print(f"{'assets/img (' + str(len(pngs)) + ' png)':26} {sum(f.stat().st_size for f in pngs) // 1024:4d} KB")
    return 1 if issues else 0


if __name__ == "__main__":
    raise SystemExit(main())
