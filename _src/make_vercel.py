"""Generate vercel.json: clean URLs, redirects for every retired URL, and the security
headers. Run automatically at the end of `python _src/build.py`.

The Content-Security-Policy allows inline scripts by SHA-256 hash instead of
'unsafe-inline'. The hashes are computed here from the built pages, so any change to an
inline snippet (the intro gate, the consent defaults, the Google tag loaders) is picked
up on the next build. Never hand-edit the hashes in vercel.json.
"""
import base64
import sys
import hashlib
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(Path(__file__).resolve().parent))
import sitedata as S  # noqa: E402
# Case-insensitive and tolerant of whitespace/attributes in the closing tag: a missed
# inline script would not get a hash and the CSP would silently block it.
INLINE_SCRIPT = re.compile(r"<script\b(?![^>]*\bsrc\s*=)([^>]*)>(.*?)</script\b[^>]*>", re.S | re.I)

# Google's regional domains used by Ads for visitors in our markets (CSP cannot wildcard a TLD).
GOOGLE_REGIONAL = ["https://www.google.com.sg", "https://www.google.com.vn",
                   "https://www.google.com.ph", "https://www.google.de"]

REDIRECTS = [
    # --- app pages moved to the names Odoo uses on 2026-09-27 (/odoo/apps/stock -> /odoo/apps/inventory) ---
    *[(f"/odoo/apps/{m}{ext}", f"/odoo/apps/{s}") for m, s in sorted(S.APP_SLUG.items()) for ext in ("", ".html")],
    # --- retired on 2026-09-26 when the site became pure v2 -----------------------
    # The old blog (20 articles, English + Vietnamese), careers and gallery were removed.
    # Each old article URL - in both its /ai-article/ and /blog/ forms - goes to the
    # closest v2 page so its search history carries over instead of turning into 404s.
    ("/blog/rag-systems-enterprise-guide", "/solutions/ai-knowledge"),
    ("/blog/rag-systems-enterprise-guide.html", "/solutions/ai-knowledge"),
    ("/ai-article/rag-systems-enterprise-guide", "/solutions/ai-knowledge"),
    ("/ai-article/rag-systems-enterprise-guide.html", "/solutions/ai-knowledge"),
    ("/blog/ai-agents-enterprise-automation", "/solutions/ai-automation"),
    ("/blog/ai-agents-enterprise-automation.html", "/solutions/ai-automation"),
    ("/ai-article/ai-agents-enterprise-automation", "/solutions/ai-automation"),
    ("/ai-article/ai-agents-enterprise-automation.html", "/solutions/ai-automation"),
    ("/blog/ai-agent-governance-2025", "/solutions/ai-automation"),
    ("/blog/ai-agent-governance-2025.html", "/solutions/ai-automation"),
    ("/ai-article/ai-agent-governance-2025", "/solutions/ai-automation"),
    ("/ai-article/ai-agent-governance-2025.html", "/solutions/ai-automation"),
    ("/blog/odoo-ai-integration-guide", "/odoo/ai-integration"),
    ("/blog/odoo-ai-integration-guide.html", "/odoo/ai-integration"),
    ("/ai-article/odoo-ai-integration-guide", "/odoo/ai-integration"),
    ("/ai-article/odoo-ai-integration-guide.html", "/odoo/ai-integration"),
    ("/blog/odoo-18-features-upgrade-guide", "/blog/odoo-20-whats-new"),
    ("/blog/odoo-18-features-upgrade-guide.html", "/blog/odoo-20-whats-new"),
    ("/ai-article/odoo-18-features-upgrade-guide", "/solutions/odoo-erp"),
    ("/ai-article/odoo-18-features-upgrade-guide.html", "/solutions/odoo-erp"),
    ("/blog/odoo-erp-sme-southeast-asia", "/solutions/odoo-erp"),
    ("/blog/odoo-erp-sme-southeast-asia.html", "/solutions/odoo-erp"),
    ("/ai-article/odoo-erp-sme-southeast-asia", "/solutions/odoo-erp"),
    ("/ai-article/odoo-erp-sme-southeast-asia.html", "/solutions/odoo-erp"),
    ("/blog/odoo-vs-sap-enterprise-comparison", "/solutions/enterprise"),
    ("/blog/odoo-vs-sap-enterprise-comparison.html", "/solutions/enterprise"),
    ("/ai-article/odoo-vs-sap-enterprise-comparison", "/solutions/enterprise"),
    ("/ai-article/odoo-vs-sap-enterprise-comparison.html", "/solutions/enterprise"),
    ("/blog/big-tech-ai-infrastructure-2026", "/solutions/ai"),
    ("/blog/big-tech-ai-infrastructure-2026.html", "/solutions/ai"),
    ("/ai-article/big-tech-ai-infrastructure-2026", "/solutions/ai"),
    ("/ai-article/big-tech-ai-infrastructure-2026.html", "/solutions/ai"),
    ("/blog/context-engineering-new-discipline", "/solutions/ai"),
    ("/blog/context-engineering-new-discipline.html", "/solutions/ai"),
    ("/ai-article/context-engineering-new-discipline", "/solutions/ai"),
    ("/ai-article/context-engineering-new-discipline.html", "/solutions/ai"),
    ("/blog/github-copilot-per-token-pricing", "/solutions/ai"),
    ("/blog/github-copilot-per-token-pricing.html", "/solutions/ai"),
    ("/ai-article/github-copilot-per-token-pricing", "/solutions/ai"),
    ("/ai-article/github-copilot-per-token-pricing.html", "/solutions/ai"),
    ("/blog/gpt5-openai-agentic-ai-2025", "/solutions/ai"),
    ("/blog/gpt5-openai-agentic-ai-2025.html", "/solutions/ai"),
    ("/ai-article/gpt5-openai-agentic-ai-2025", "/solutions/ai"),
    ("/ai-article/gpt5-openai-agentic-ai-2025.html", "/solutions/ai"),
    ("/blog/lg-nvidia-physical-ai-era", "/solutions/ai"),
    ("/blog/lg-nvidia-physical-ai-era.html", "/solutions/ai"),
    ("/ai-article/lg-nvidia-physical-ai-era", "/solutions/ai"),
    ("/ai-article/lg-nvidia-physical-ai-era.html", "/solutions/ai"),
    ("/blog/local-llm-on-premise-enterprise", "/solutions/ai"),
    ("/blog/local-llm-on-premise-enterprise.html", "/solutions/ai"),
    ("/ai-article/local-llm-on-premise-enterprise", "/solutions/ai"),
    ("/ai-article/local-llm-on-premise-enterprise.html", "/solutions/ai"),
    ("/blog/philippines-bpo-ai-revolution", "/solutions/ai"),
    ("/blog/philippines-bpo-ai-revolution.html", "/solutions/ai"),
    ("/ai-article/philippines-bpo-ai-revolution", "/solutions/ai"),
    ("/ai-article/philippines-bpo-ai-revolution.html", "/solutions/ai"),
    ("/blog/singapore-national-ai-strategy-2026", "/solutions/ai"),
    ("/blog/singapore-national-ai-strategy-2026.html", "/solutions/ai"),
    ("/ai-article/singapore-national-ai-strategy-2026", "/solutions/ai"),
    ("/ai-article/singapore-national-ai-strategy-2026.html", "/solutions/ai"),
    ("/blog/singapore-smart-nation-enterprise-ai", "/solutions/ai"),
    ("/blog/singapore-smart-nation-enterprise-ai.html", "/solutions/ai"),
    ("/ai-article/singapore-smart-nation-enterprise-ai", "/solutions/ai"),
    ("/ai-article/singapore-smart-nation-enterprise-ai.html", "/solutions/ai"),
    ("/blog/philippines-digital-transformation-2026", "/blog/odoo-20-singapore-philippines-vietnam"),
    ("/blog/philippines-digital-transformation-2026.html", "/blog/odoo-20-singapore-philippines-vietnam"),
    ("/ai-article/philippines-digital-transformation-2026", "/"),
    ("/ai-article/philippines-digital-transformation-2026.html", "/"),
    ("/blog/vietnam-digital-economy-ai-2026", "/blog/odoo-20-singapore-philippines-vietnam"),
    ("/blog/vietnam-digital-economy-ai-2026.html", "/blog/odoo-20-singapore-philippines-vietnam"),
    ("/ai-article/vietnam-digital-economy-ai-2026", "/"),
    ("/ai-article/vietnam-digital-economy-ai-2026.html", "/"),
    ("/blog/vietnam-software-exports-2026", "/company"),
    ("/blog/vietnam-software-exports-2026.html", "/company"),
    ("/ai-article/vietnam-software-exports-2026", "/company"),
    ("/ai-article/vietnam-software-exports-2026.html", "/company"),
    ("/blog/vietnam-tech-talent-dev-hub", "/company"),
    ("/blog/vietnam-tech-talent-dev-hub.html", "/company"),
    ("/ai-article/vietnam-tech-talent-dev-hub", "/company"),
    ("/ai-article/vietnam-tech-talent-dev-hub.html", "/company"),
    # Old articles Search Console still reported as 404 or "crawled - not indexed" on
    # 2026-09-28, in both forms. Listed before the /ai-article catch-all: the first match wins.
    *[(f"/{d}/{slug}", to) for slug, to in (
        ("agentic-ai-workflows-and-enterprise-operations", "/solutions/ai-automation"),
        ("agentic-workflows-patterns-and-best-practices-for-enterprise-teams", "/solutions/ai-automation"),
        ("ai-agents-workflow-automation-enterprise-apac-playbook", "/solutions/ai-automation"),
        ("ai-workflow-automation-case-study", "/solutions/ai-automation"),
        ("the-ultimate-guide-to-enterprise-agentic-ai", "/solutions/ai-automation"),
        ("strategic-ai-in-2026-unlocking-enterprise-value-in-southeast-asia", "/solutions/ai"),
        ("will-the-corporate-investment-in-ai-pay-off", "/solutions/ai"),
        ("data-sovereignty-laws-southeast-asia-compliance-guide-2026", "/blog/odoo-online-vs-odoo-sh-vs-on-premise"),
        ("software-development-guide-2026-process-architecture-best-practices", "/odoo/erp-system"),
        ("enterprise-software-requirements-the-2026-evaluation-checklist", "/odoo/discovery"),
        ("eurocham-interview-eric-lou-on-simplifying-digital-systems-for-cambodian-businesses", "/company"),
    ) for d in ("blog", "ai-article")],
    ("/ai-article", "/blog"), ("/ai-article/", "/blog"), ("/ai-article/:path*", "/blog"),
    # --- the blog and careers came back on 2026-09-27 as /blog and /careers ------------
    # Old article URLs keep their redirects above; any other old /blog/ URL simply 404s
    # now, because a catch-all here would also swallow the new articles.
    ("/blog/", "/blog"), ("/careers/", "/careers"), ("/careers/:path+", "/careers"),
    ("/gallery", "/company"), ("/gallery/", "/company"), ("/gallery.html", "/company"),
    # --- section roots named in breadcrumbs --------------------------------------------
    ("/odoo", "/odoo/apps"), ("/solutions", "/#solutions"), ("/industries", "/#industries"),
    # --- the old site served these as directories; v2 serves files -----------------
    ("/privacy/", "/privacy"),
    ("/terms/", "/terms"),
    # --- old pages with a v2 equivalent ----------------------------------------------
    ("/contact", "/company"), ("/contact/", "/company"),
    ("/odoo-erp-singapore", "/solutions/odoo-erp"), ("/odoo-erp-singapore/", "/solutions/odoo-erp"),
    ("/ai-automation-vietnam", "/solutions/ai-automation"), ("/ai-automation-vietnam/", "/solutions/ai-automation"),
    ("/about", "/company"), ("/about/", "/company"),
    ("/services", "/#solutions"), ("/services/", "/#solutions"),
    # --- more retired URLs Google still crawled (Search Console crawl stats, 2026-09-28): a
    # broken inbound link made of a sentence, and the old logo files. The old articles it
    # found are listed above the /ai-article catch-all.
    (r"/:line(What\+if\+your\+hotel.*)", "/solutions/ai-chatbots"),
    ("/technext-logo.jpg", "/assets/img/logo-horizontal.png"),
    ("/images/logo/technext-logo.png", "/assets/img/logo-horizontal.png"),
    ("/images/logo/technext-logo.webp", "/assets/img/logo-horizontal.png"),
    # --- the internal landing page and its predecessor, removed 2026-09-26 ----------
    # (":path*" does not match a bare trailing slash on Vercel, so each form is listed)
    ("/lp", "/"), ("/lp/", "/"), ("/lp/:path*", "/"),
    ("/landing_page", "/"), ("/landing_page/", "/"), ("/landing_page/:path*", "/"),
]


def inline_script_hashes():
    """sha256 of every distinct executable inline <script> across the built site."""
    hashes = set()
    for page in ROOT.rglob("*.html"):
        if any(part.startswith((".", "_")) for part in page.relative_to(ROOT).parts):
            continue
        html = page.read_text(encoding="utf-8")
        for attrs, body in INLINE_SCRIPT.findall(html):
            if "application/ld+json" in attrs.lower() or "application/json" in attrs.lower():
                continue            # data, never executed
            digest = hashlib.sha256(body.encode("utf-8")).digest()
            hashes.add("'sha256-" + base64.b64encode(digest).decode() + "'")
    return sorted(hashes)


def csp(hashes):
    # GA4 sends hits to the BARE analytics.google.com (a *.analytics.google.com wildcard
    # does not match the apex) and to stats.g.doubleclick.net - both caught blocked in a
    # browser test on 2026-09-26, so they are listed explicitly.
    google_img = ["https://*.google-analytics.com", "https://analytics.google.com",
                  "https://*.analytics.google.com", "https://*.googletagmanager.com",
                  "https://*.g.doubleclick.net", "https://www.google.com",
                  "https://pagead2.googlesyndication.com"] + GOOGLE_REGIONAL
    return "; ".join([
        "default-src 'self'",
        # Google tag (GA4 + Ads) and the two Tag Manager containers. Both containers were
        # checked on 2026-09-26: they hold no Custom HTML tags, so no 'unsafe-inline'.
        "script-src 'self' " + " ".join(hashes) + " https://*.googletagmanager.com "
        "https://www.googleadservices.com https://googleads.g.doubleclick.net "
        "https://www.google.com https://pagead2.googlesyndication.com",
        # JS-built markup carries style="--i:n" stagger attributes, and the consent banner
        # is styled inline, so inline styles stay allowed
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        # odoocdn: official app screenshots on the Odoo pages;
        # i.ytimg: YouTube facade thumbnails; the rest: Google Analytics / Ads pixels
        "img-src 'self' data: https://odoocdn.com https://i.ytimg.com "
        + " ".join(google_img),
        "connect-src 'self' https://*.google-analytics.com "
        "https://analytics.google.com https://*.analytics.google.com https://*.googletagmanager.com "
        "https://google.com https://www.google.com https://*.g.doubleclick.net https://ad.doubleclick.net "
        "https://pagead2.googlesyndication.com https://www.googleadservices.com "
        + " ".join(GOOGLE_REGIONAL),
        # 'self': /nexi shows the Nexi companion (nexi-app.html) in a same-origin frame
        "frame-src 'self' https://www.youtube-nocookie.com https://www.google.com https://www.googletagmanager.com https://td.doubleclick.net",
        "media-src 'self' https://download.odoocdn.com",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'self'",
        "upgrade-insecure-requests",
    ])


def bot_block():
    """Edge redirect for AI-training crawlers that ignore robots.txt, website copiers and scraping
    libraries. robots.txt, /.well-known and /denied stay reachable so the policy can be read."""
    agents = [a for a in S.AI_TRAINING if a not in S.ROBOTS_ONLY] + S.SCRAPERS
    pattern = ".*(" + "|".join(re.escape(a).replace("\\ ", " ").replace("\\-", "-").replace("\\/", "/") for a in agents) + ").*"
    rule = {"source": "/((?!denied|robots\\.txt|\\.well-known).*)", "destination": "/denied", "permanent": False}
    return [
        {**rule, "has": [{"type": "header", "key": "user-agent", "value": pattern}]},
        # every browser, search engine and link-preview fetcher sends a user agent; only scripts omit or blank it
        {**rule, "missing": [{"type": "header", "key": "user-agent"}]},
        {**rule, "has": [{"type": "header", "key": "user-agent", "value": "^\\s*$"}]},
    ]


def write_vercel():
    hashes = inline_script_hashes()
    common = [
        {"key": "Content-Security-Policy", "value": csp(hashes)},
        # No includeSubDomains yet: smartweb / smartpos / designs live on other servers
        # whose HTTPS is not ours to guarantee. Add it (and preload) once every subdomain
        # is verified HTTPS.
        {"key": "Strict-Transport-Security", "value": "max-age=31536000"},
        {"key": "X-Content-Type-Options", "value": "nosniff"},
        {"key": "X-Frame-Options", "value": "SAMEORIGIN"},
        {"key": "Referrer-Policy", "value": "strict-origin-when-cross-origin"},
        {"key": "Permissions-Policy",
         "value": "camera=(), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=(), serial=(), hid=(), "
                  "midi=(), display-capture=(), idle-detection=(), browsing-topics=(), xr-spatial-tracking=()"},
        # the page gets its own browsing context group: no other window can script it
        {"key": "Cross-Origin-Opener-Policy", "value": "same-origin"},
        {"key": "X-Permitted-Cross-Domain-Policies", "value": "none"},
        # TDMRep: text and data mining rights reserved (see /.well-known/tdmrep.json)
        {"key": "tdm-reservation", "value": "1"},
    ]
    config = {
        "cleanUrls": True,
        # /company/ and /company are one page: the slash form redirects
        "trailingSlash": False,
        # functions (api/lead.py) run in Singapore, next to technext.odoo.com (AWS ap-southeast-1);
        # from the default US region every Odoo call crossed the Pacific and a form took 7-8 s
        "regions": ["sin1"],
        "redirects": bot_block() + [{"source": s, "destination": d, "permanent": True} for s, d in REDIRECTS],
        "headers": [
            {"source": "/(.*)", "headers": common},
            # css/js/img are versioned by ?v=<content hash> (the vendor Three.js file never changes),
            # so they can be cached forever
            {"source": "/assets/(css|js|img)/(.*)",
             "headers": [{"key": "Cache-Control", "value": "public, max-age=31536000, immutable"}]},
            # other sites may not embed or hotlink the stylesheets, scripts and images (browsers enforce it;
            # social previews and search engines fetch server-side and are unaffected)
            {"source": "/assets/(.*)",
             "headers": [{"key": "Cross-Origin-Resource-Policy", "value": "same-site"}]},
            {"source": "/denied",
             "headers": [{"key": "X-Robots-Tag", "value": "noindex, nofollow"}]},
            # staff-only page (Company menu): never indexed, also when reached as /employee-hub.html
            {"source": "/employee-hub(\\.html)?",
             "headers": [{"key": "X-Robots-Tag", "value": "noindex, nofollow"}]},
            {"source": "/.well-known/tdmrep.json",
             "headers": [{"key": "Content-Type", "value": "application/json; charset=utf-8"}]},
        ],
    }
    (ROOT / "vercel.json").write_text(json.dumps(config, indent=2) + "\n", encoding="utf-8")
    return len(hashes)


if __name__ == "__main__":
    print("vercel.json written,", write_vercel(), "inline script hashes")
