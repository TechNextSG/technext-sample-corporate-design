"""Pull public marketing content for each Odoo app from odoo.com/app/<slug> into _src/apps_content.json.

    python _src/fetch_odoo.py            # all apps in sitedata.APP_CATEGORIES
    python _src/fetch_odoo.py accounting # one slug

Captured per app: odoo.com URL, page title, meta description, hero headline + lead paragraph, section
headlines with their paragraphs, official screenshots (odoocdn .webp/.png), YouTube video ids and the
odoocdn .mp4 hero video. Everything is attributed to Odoo S.A. when rendered (build.py → module pages).
"""
import html
import json
import re
import sys
import time
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import sitedata as S  # noqa: E402

OUT = Path(__file__).resolve().parent / "apps_content.json"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128 Safari/537.36"

# module -> odoo.com/app slug
SLUGS = {
    "accountant": "accounting", "account": "invoicing", "hr_expense": "expenses", "spreadsheet_dashboard": "spreadsheet",
    "documents": "documents", "sign": "sign", "crm": "crm", "sale": "sales", "point_of_sale": "point-of-sale-shop",
    "pos_restaurant": "point-of-sale-restaurant", "sale_subscription": "subscriptions", "sale_renting": "rental",
    "website": "website", "website_sale": "ecommerce", "website_blog": "blog", "website_forum": "forum",
    "im_livechat": "live-chat", "website_slides": "elearning", "stock": "inventory", "mrp": "manufacturing",
    "mrp_plm": "plm", "purchase": "purchase", "maintenance": "maintenance", "quality_control": "quality",
    "hr": "employees", "hr_recruitment": "recruitment", "hr_holidays": "time-off", "hr_appraisal": "appraisals",
    "hr_referral": "referrals", "fleet": "fleet", "hr_payroll": "payroll", "social": "social-marketing",
    "mass_mailing": "email-marketing", "mass_mailing_sms": "sms-marketing", "event": "events",
    "marketing_automation": "marketing-automation", "survey": "surveys", "project": "project",
    "hr_timesheet": "timesheet", "industry_fsm": "field-service", "helpdesk": "helpdesk", "planning": "planning",
    "appointment": "appointments", "mail": "discuss", "approvals": "approvals", "iot": "iot", "voip": "voip",
    "knowledge": "knowledge", "whatsapp": "whatsapp", "ai_app": "artificial-intelligence",
}

TAG = re.compile(r"<[^>]+>")


def text(fragment: str) -> str:
    t = html.unescape(TAG.sub(" ", fragment))
    return re.sub(r"\s+", " ", t).strip()


def fetch(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "en"})
    with urllib.request.urlopen(req, timeout=40) as r:
        return r.read().decode("utf-8", "ignore")


def parse(slug: str, page: str) -> dict:
    d = {"url": f"https://www.odoo.com/app/{slug}"}
    m = re.search(r"<title>(.*?)</title>", page, re.S); d["title"] = text(m.group(1)) if m else ""
    m = re.search(r'<meta name="description" content="([^"]*)"', page); d["description"] = html.unescape(m.group(1)) if m else ""
    m = re.search(r"<h1[^>]*>(.*?)</h1>", page, re.S)
    d["headline"] = text(m.group(1)) if m else ""
    after = page[m.end():] if m else page
    paras = [text(p) for p in re.findall(r"<p[^>]*>(.*?)</p>", after, re.S)]
    paras = [p for p in paras if 60 <= len(p) <= 420 and "cookie" not in p.lower()]
    d["lead"] = paras[0] if paras else ""
    # sections: each <h2> with the block that follows it up to the next <h2> — its own paragraphs,
    # its own image and any feature sub-points, so a section can be reproduced faithfully
    IMG_RE = re.compile(r'(https://(?:download\.)?odoocdn\.com/openerp_website/static/src/img/apps/[^"\' )]+\.(?:webp|png|jpg|jpeg))')
    SKIP = ("all the features", "join", "unleash", "odoo experience", "one need", "frequently asked", "faq",
            "pricing", "try it", "start now", "get started", "customer", "testimonial", "our partners", "explore")
    parts = re.split(r"(<h2[^>]*>.*?</h2>)", page, flags=re.S)
    sections, seen = [], set()
    for i in range(1, len(parts) - 1, 2):
        head = text(parts[i])
        block = parts[i + 1]
        if not head or len(head) > 80 or head.lower().startswith(SKIP) or head in seen:
            continue
        ps = [text(p) for p in re.findall(r"<p[^>]*>(.*?)</p>", block, re.S)]
        ps = [p for p in ps if 40 <= len(p) <= 600 and "cookie" not in p.lower()]
        if not ps:
            continue
        copy = ps[0] if len(ps[0]) > 140 or len(ps) == 1 else (ps[0] + " " + ps[1])[:600]
        imgs = [u for u in IMG_RE.findall(block) if not re.search(r"separator|icon|logo|flag|badge", u, re.I)]
        feats = [text(f) for f in re.findall(r"<(?:h4|h5)[^>]*>(.*?)</(?:h4|h5)>", block, re.S)]
        feats = [f for f in feats if 3 <= len(f) <= 60][:6]
        seen.add(head)
        sections.append({"h": head, "p": copy, "img": imgs[0] if imgs else "", "feats": feats})
    d["sections"] = sections[:8]
    # official screenshots: odoocdn app images (skip separators / icons / tiny svgs)
    imgs = re.findall(r'(https://(?:download\.)?odoocdn\.com/openerp_website/static/src/img/apps/[^"\' )]+\.(?:webp|png|jpg|jpeg))', page)
    imgs += [("https://www.odoo.com" + i if i.startswith("/") else i) for i in
             re.findall(r'src="(/web/image/[^"]+)"', page) if "app" in i]
    uniq_imgs = []
    for i in imgs:
        if i not in uniq_imgs and not re.search(r"separator|icon|logo|flag|badge", i, re.I):
            uniq_imgs.append(i)
    d["images"] = uniq_imgs[:8]
    d["youtube"] = sorted(set(re.findall(r'data-video-id="([A-Za-z0-9_-]{11})"', page) +
                              re.findall(r"youtube(?:-nocookie)?\.com/embed/([A-Za-z0-9_-]{11})", page)))[:3]
    m = re.search(r'(https://download\.odoocdn\.com/videos/[^"\' ]+\.mp4)', page); d["mp4"] = m.group(1) if m else ""
    return d


def main():
    only = sys.argv[1:] or None
    data = json.loads(OUT.read_text(encoding="utf-8")) if OUT.exists() else {}
    mods = [a["mod"] for c in S.APP_CATEGORIES for a in c["apps"]]
    for mod in mods:
        slug = SLUGS.get(mod)
        if not slug or (only and slug not in only and mod not in only):
            continue
        try:
            page = fetch(f"https://www.odoo.com/app/{slug}")
            data[mod] = parse(slug, page)
            data[mod]["fetched"] = time.strftime("%Y-%m-%d")
            print(f"ok   {mod:22} {slug:26} imgs={len(data[mod]['images'])} yt={len(data[mod]['youtube'])} mp4={'y' if data[mod]['mp4'] else '-'} sections={len(data[mod]['sections'])}")
        except Exception as e:  # noqa: BLE001
            print(f"FAIL {mod:22} {slug:26} {e}")
        time.sleep(0.6)
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"saved {len(data)} apps -> {OUT}")


if __name__ == "__main__":
    main()
