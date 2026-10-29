# Site-wide data for the TechNext Website v2 build.
# Everything client-facing that is a *claim* (numbers, partner tier, legal details)
# comes from the Brand Hub approved-claims table. Don't add figures that aren't there.

SITE_URL = "https://technext.asia/"
SITE_NAME = "TechNext"
# Plain, factual description for structured data and AI answer engines (the same words everywhere).
ORG_DESC = ("TechNext is an Odoo Ready Partner headquartered in Singapore, with its main development and "
            "consulting hub in Taguig City and an AI engineering hub in Ho Chi Minh City. We implement Odoo ERP end to end, starting with Accounting, Sales "
            "and Inventory, build enterprise AI, websites and brands, and deliver IoT, app and network services "
            "as one team, so growing companies in 10+ countries don't need to hire their own.")
DEFAULT_DESC = ("TechNext is an Odoo Partner delivering all-in-one Odoo ERP software, world-class and "
                "holistic business consultation, and impressive website development for growing companies.")

# The four positioning pillars (used in structured data and the home "what we stand for" strip).
PILLARS = [
    ("layout", "Impressive Website Development", "Fast, modern sites that explain what you do and win the click."),
    ("target", "World-Class & Holistic Business Consultation", "We map the whole business first, then fix the right thing."),
    ("database", "All-in-One Enterprise Resource Planning", "One Odoo database for sales, stock, money and more."),
    ("odoo:ai_app", "Odoo Partner", "Odoo's methodology and partner resources, applied to your rollout."),
]

COMPANY = {
    "legal": "TechNext Pte. Ltd.",
    "short": "TechNext",
    "uen": "202699888G",
    "address": ["261 Waterloo Street #03-36", "Singapore 180261"],
    "sales_email": "sales@technext.asia",
    "whatsapp": "+65 8839 6998",
    "whatsapp_link": "https://wa.me/6588396998",
    # header "Contact Us" opens WhatsApp with a ready-to-send opener
    "whatsapp_msg_link": "https://wa.me/6588396998?text=Hello%20TechNext%2C%20I%27d%20like%20to%20ask%20about%20Odoo%20for%20my%20company.",
    "linkedin": "https://www.linkedin.com/company/technextasia",
    # official profiles (same handle everywhere, as in the email signature): schema.org sameAs
    "socials": ["https://www.youtube.com/@technextasia", "https://x.com/technextasia",
                "https://www.instagram.com/technextasia/", "https://www.facebook.com/technextasia",
                "https://www.tiktok.com/@technextasia"],
    "hubs": "Singapore HQ · Philippines · Vietnam",
    # Odoo's own partner directory (tier: Ready) — the independent proof of the partner claim
    "odoo_listing": "https://www.odoo.com/partners/technext-pte-ltd-28073844",
    "careers_email": "career@technext.asia",
    # Odoo Appointments: "Discovery Call with TechNext", 30 min online, hosted by Sky (the side tab links here)
    "meeting_link": "https://technext.odoo.com/book/c82cf8a9",
}

# Offices, as TechNext lists them (and on Google Maps). `key` matches the map entries in
# assets/js/stage.js; `maps` opens the office's Google Maps listing or address.
def _built(page: str, fallback: str) -> str:
    """A link to a page that may not be written yet (the office pages): the page once _src/pages has it, else the fallback."""
    import pathlib
    return page if (pathlib.Path(__file__).resolve().parent / "pages" / page).exists() else fallback


OFFICES = [
    {"key": "hq", "cc": "SG", "country": "Singapore", "name": "Singapore HQ",
     "role": "Headquarters. Sales, discovery and on-site work in Singapore.",
     "office": "offices/singapore.html",
     "lines": ["261 Waterloo Street #03-36", "Singapore 180261"],
     "street": "261 Waterloo Street #03-36", "locality": "Singapore", "region": "", "postal": "180261",
     "maps": "https://maps.google.com/?cid=3474088819422984887", "geo": (1.2989163, 103.8519697),
     "directions": "https://www.google.com/maps/dir/?api=1&destination=261+Waterloo+Street+%2303-36+Singapore+180261"},
    {"key": "ph", "cc": "PH", "country": "Philippines", "name": "Philippines development hub",
     "role": "Our main hub for Odoo development and consulting, with finance, sales and marketing. Our open roles are here.",
     "page": "odoo/philippines.html", "page_label": "Odoo in the Philippines", "office": "offices/philippines.html",
     "lines": ["Level 9, IP Center", "Taguig City, Metro Manila"],
     "street": "Level 9, IP Center (Intellectual Property Center)", "locality": "Taguig City", "region": "Metro Manila", "postal": "1634",
     "maps": "https://maps.google.com/?cid=12500824038992408388", "geo": (14.5350092, 121.0509849),
     "directions": "https://www.google.com/maps/dir/?api=1&destination=14.5349862%2C121.0513368"},
    {"key": "vn", "cc": "VN", "country": "Vietnam", "name": "Vietnam AI engineering hub",
     "role": "AI engineering. The enterprise AI behind our solutions.",
     "page": "odoo/vietnam.html", "page_label": "Odoo in Vietnam",
     "office": _built("offices/vietnam.html", ""),
     "lines": ["62 Nguyễn Thị Nhung, Phường Hiệp Bình", "Ho Chi Minh City"], "lang": "vi", "geo": (10.8440075, 106.7121703),
     "street": "62 Nguyễn Thị Nhung, Phường Hiệp Bình", "locality": "Ho Chi Minh City", "region": "", "postal": "",
     "maps": "https://www.google.com/maps/search/?api=1&query=62+Nguyen+Thi+Nhung+Hiep+Binh+Ho+Chi+Minh+City",
     "directions": "https://www.google.com/maps/dir/?api=1&destination=62+Nguyen+Thi+Nhung+Hiep+Binh+Ho+Chi+Minh+City"},
]

# ---------------------------------------------------------------- automated access
# Search engines and AI answer engines may read the site (so TechNext can be found and cited);
# crawlers that collect content to TRAIN AI models may not. robots.txt is generated from these
# lists, and vercel.json redirects the listed user agents to /denied at the edge for crawlers
# that ignore robots.txt. Robots-only tokens never appear in a user agent, so they are not in
# the edge list.
AI_ALLOW = ["Googlebot", "Bingbot", "Applebot", "DuckDuckBot", "OAI-SearchBot", "ChatGPT-User",
            "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User", "DuckAssistBot",
            "MistralAI-User", "meta-externalfetcher"]
AI_TRAINING = ["GPTBot", "ClaudeBot", "anthropic-ai", "Claude-Web", "CCBot", "Google-Extended",
               "Applebot-Extended", "Bytespider", "meta-externalagent", "FacebookBot", "Amazonbot",
               "cohere-ai", "cohere-training-data-crawler", "Diffbot", "Omgilibot", "omgili",
               "img2dataset", "AI2Bot", "PanguBot", "Timpibot", "ImagesiftBot", "Kangaroo Bot",
               "webzio-extended", "FirecrawlAgent"]
ROBOTS_ONLY = {"Google-Extended", "Applebot-Extended", "Claude-Web"}
# Website copiers, headless browsers and scripting libraries: they don't read robots.txt, so
# they are only handled at the edge. Social link previews (facebookexternalhit, LinkedInBot,
# Twitterbot, WhatsApp, Slackbot, TelegramBot, Discordbot) are deliberately NOT listed.
SCRAPERS = ["HTTrack", "SiteSucker", "WebCopier", "Offline Explorer", "Teleport Pro", "WebZIP",
            "WebReaper", "HeadlessChrome", "PhantomJS", "python-requests", "Python-urllib",
            "python-httpx", "aiohttp", "Go-http-client", "Scrapy", "node-fetch", "axios",
            "libwww-perl", "Wget/", "curl/"]

# Every form posts to /api/lead (api/lead.py), which files it as a lead in the Odoo CRM.
FORM_ENDPOINT = "/api/lead"

# ---------------------------------------------------------------- navigation
# `href` values are site-root relative; build.py prefixes {{ROOT}}.
# A link shows either a stroke `icon` or an official Odoo app icon via `odoo`.
NAV = [
    {
        "label": "Solution", "id": "solution",
        "columns": [
            {"title": "ERP", "href": "solutions/odoo-erp.html", "links": [
                {"label": "Odoo ERP Implementation", "href": "solutions/odoo-erp.html", "icon": "sol-erp",
                 "desc": "Implementation, configuration and custom modules."},
                {"label": "CRM Development", "href": "odoo/crm-development.html", "icon": "wk-crm",
                 "desc": "Pipelines built around how you sell."},
                {"label": "Enterprise Solution", "href": "solutions/enterprise.html", "icon": "sol-enterprise",
                 "desc": "Multi-company, multi-country Odoo at scale."},
            ]},
            {"title": "AI Solution", "href": "solutions/ai.html", "links": [
                {"label": "RAG Knowledge Assistants", "href": "solutions/ai-knowledge.html", "icon": "sol-rag",
                 "desc": "Answers grounded in your own documents."},
                {"label": "Odoo + AI integrations", "href": "odoo/ai-integration.html", "icon": "wk-ai",
                 "desc": "AI working inside your ERP records."},
                {"label": "Workflow Automation", "href": "solutions/ai-automation.html", "icon": "sol-auto",
                 "desc": "Agents that run multi-step tasks."},
                {"label": "AI Chatbots", "href": "solutions/ai-chatbots.html", "icon": "sol-chat",
                 "desc": "Web, WhatsApp and in-app assistants."},
            ]},
            {"title": "Marketing", "href": "solutions/marketing.html", "links": [
                {"label": "Web Design & Development", "href": "solutions/website.html", "icon": "sol-web",
                 "desc": "Fast, clear sites that explain what you do."},
                {"label": "Social Media Management", "href": "solutions/social-media.html", "icon": "sol-social",
                 "desc": "Steady posting with a plan behind it."},
                {"label": "Graphic & Brand Assets", "href": "solutions/brand-assets.html", "icon": "sol-brand",
                 "desc": "Logos, decks, collateral, templates."},
            ]},
            {"title": "Technology", "href": "solutions/technology.html", "links": [
                {"label": "IoT Solutions", "href": "solutions/iot.html", "icon": "sol-iot",
                 "desc": "Sensors, devices and live dashboards."},
                {"label": "App Development", "href": "solutions/app-development.html", "icon": "sol-app",
                 "desc": "Mobile and web apps for your workflow."},
                {"label": "Networks", "href": "solutions/networks.html", "icon": "sol-net",
                 "desc": "Office networks, Wi-Fi and IT infrastructure."},
            ]},
        ],
    },
    {
        "label": "Industries", "id": "industries",
        "columns": [
            {"title": "Industries", "wide": True, "links": [
                {"label": "Medical", "href": "industries/medical.html", "icon": "ind-medical",
                 "desc": "Clinics and healthcare groups."},
                {"label": "Travel", "href": "industries/travel.html", "icon": "ind-travel",
                 "desc": "Agencies, tours and hospitality."},
                {"label": "Retail", "href": "industries/retail.html", "icon": "ind-retail",
                 "desc": "Stores, POS and stock in one place."},
                {"label": "Ecommerce", "href": "industries/ecommerce.html", "icon": "ind-ecommerce",
                 "desc": "Online orders, fulfilment and books."},
                {"label": "Construction", "href": "industries/construction.html", "icon": "ind-construction",
                 "desc": "Projects, site costs and progress billing."},
                {"label": "F&B", "href": "industries/fnb.html", "icon": "ind-fnb",
                 "desc": "Restaurants, cafés and central kitchens."},
                {"label": "Manufacturing", "href": "industries/manufacturing.html", "icon": "ind-manufacturing",
                 "desc": "Bills of materials, work orders, costing."},
                {"label": "Health & Wellness", "href": "industries/health-wellness.html", "icon": "ind-health-wellness",
                 "desc": "Studios, spas, memberships and retail."},
            ]},
        ],
    },
    {
        "label": "Odoo", "id": "odoo",
        "columns": [
            {"title": "Walkthrough", "links": [
                {"label": "Odoo Discovery", "href": "odoo/discovery.html", "icon": "wk-discovery",
                 "desc": "Map your processes to Odoo apps."},
                {"label": "Odoo Training", "href": "odoo/training.html", "icon": "wk-training",
                 "desc": "Role-based sessions for your team."},
                {"label": "Odoo Integration", "href": "odoo/integration.html", "icon": "wk-integration",
                 "desc": "Connect banks, payments and tools."},
                {"label": "Odoo Support", "href": "odoo/support.html", "icon": "wk-support",
                 "desc": "Ongoing help after go-live."},
            ]},
            {"title": "Odoo Apps", "href": "odoo/apps.html", "links": [
                {"label": "All Odoo apps", "href": "odoo/apps.html", "icon": "grid",
                 "desc": "The full catalogue, by category."},
                {"label": "Accounting", "href": "odoo/apps/accountant.html", "odoo": "accountant",
                 "desc": "Our first focus area."},
                {"label": "Sales", "href": "odoo/apps/sale.html", "odoo": "sale",
                 "desc": "Quotes to orders to invoices."},
                {"label": "Inventory", "href": "odoo/apps/stock.html", "odoo": "stock",
                 "desc": "Stock, warehouses and deliveries."},
            ]},
            {"title": "Customization", "links": [
                {"label": "Odoo Customization", "href": "odoo/erp-system.html", "odoo": "web_studio",
                 "desc": "Tailored modules and workflows."},
                {"label": "AI Integration", "href": "odoo/ai-integration.html", "odoo": "ai_app",
                 "desc": "AI assistants inside Odoo."},
                {"label": "CRM Development", "href": "odoo/crm-development.html", "odoo": "crm",
                 "desc": "Pipelines built around your sales."},
            ]},
        ],
    },
    {
        "label": "Company", "id": "company",
        "columns": [
            {"title": "Company", "links": [
                {"label": "About TechNext", "href": "company.html", "icon": "co-about",
                 "desc": "Who we are, how we work, where to find us."},
                # the team, introduced to clients: noindex, nofollow, kept out of the sitemap (its meta sets "robots")
                {"label": "Employee Hub", "href": "employee-hub.html", "icon": "co-team", "nofollow": True,
                 "desc": "Employee sheets and the TechNext 201."},
            ]},
            {"title": "Life", "links": [
                {"label": "Careers", "href": "careers.html", "icon": "co-careers",
                 "desc": "Recruitment day: open roles in Taguig City."},
                {"label": "Blog", "href": "blog.html", "icon": "co-blog",
                 "desc": "Odoo 20 news and plain-language ERP guides."},
                {"label": "Events", "href": "events.html", "icon": "co-events",
                 "desc": "Upcoming events, visits and milestones."},
                {"label": "Life at TechNext", "href": "life.html", "icon": "co-life",
                 "desc": "The people and culture behind TechNext."},
            ]},
            {"title": "Offices", "links": [
                {"label": "Singapore HQ", "href": "offices/singapore.html", "icon": "co-sg",
                 "desc": "261 Waterloo Street #03-36."},
                {"label": "Philippines", "href": "offices/philippines.html", "icon": "co-ph",
                 "desc": "Main development and consulting hub · Taguig City."},
                {"label": "Vietnam", "href": _built("offices/vietnam.html", "company.html#office-vn"), "icon": "co-vn",
                 "desc": "AI engineering hub · Ho Chi Minh City."},
            ]},
        ],
    },
    # drawn as Nexi's speech bubble (build.py nav_html, site.css .nav-bubble)
    {"label": "Nexi Explains", "href": "nexi-explains.html", "id": "nexi-explains", "bubble": True},
]

# ---------------------------------------------------------------- Odoo apps
# Official Odoo app catalogue, grouped the way odoo.com groups it. `mod` is the
# module name used by Odoo's icon CDN; the SVGs live in assets/img/odoo/<mod>.svg.
# App pages live at the name Odoo gives the app (/odoo/apps/inventory), not the module's technical
# name (stock). Only apps whose name differs are listed; make_vercel.py 308-redirects the old
# module-name URLs, build.py rewrites every internal link, and assets/js/app-slugs.js (generated)
# gives the same map to the scripts that link to app pages.
APP_SLUG = {
    "account": "invoicing", "accountant": "accounting", "ai_app": "ai", "appointment": "appointments",
    "event": "events", "hr": "employees", "hr_appraisal": "appraisals", "hr_expense": "expenses",
    "hr_holidays": "time-off", "hr_payroll": "payroll", "hr_recruitment": "recruitment",
    "hr_referral": "referrals", "hr_timesheet": "timesheets", "im_livechat": "live-chat",
    "industry_fsm": "field-service", "mail": "discuss", "marketing_automation": "marketing-automation",
    "mass_mailing": "email-marketing", "mass_mailing_sms": "sms-marketing", "mrp": "manufacturing",
    "mrp_plm": "plm", "point_of_sale": "point-of-sale", "pos_restaurant": "restaurant-pos",
    "quality_control": "quality", "sale": "sales", "sale_renting": "rental",
    "sale_subscription": "subscriptions", "social": "social-marketing", "spreadsheet_dashboard": "spreadsheet",
    "stock": "inventory", "survey": "surveys", "website": "website-builder", "website_blog": "blog",
    "website_forum": "forum", "website_sale": "ecommerce", "website_slides": "elearning",
}
APP_MOD = {v: k for k, v in APP_SLUG.items()}


def app_slug(mod):
    return APP_SLUG.get(mod, mod)


def _a(name, desc, mod, focus=False):
    return {"name": name, "desc": desc, "mod": mod, "focus": focus}

APP_CATEGORIES = [
    {"id": "finance", "title": "Finance", "icon": "calculator", "focus": True,
     "apps": [
         _a("Accounting", "Journals, bank sync, tax reports and closing.", "accountant", True),
         _a("Invoicing", "Send invoices and collect payments online.", "account", True),
         _a("Expenses", "Capture receipts and approve claims.", "hr_expense"),
         _a("Spreadsheet (BI)", "Live pivots and dashboards on Odoo data.", "spreadsheet_dashboard"),
         _a("Documents", "File storage with workflows and OCR.", "documents"),
         _a("Sign", "Legally binding e-signatures.", "sign"),
     ]},
    {"id": "sales", "title": "Sales", "icon": "trend", "focus": True,
     "apps": [
         _a("CRM", "Leads, pipeline and activities.", "crm", True),
         _a("Sales", "Quotations, orders and upsells.", "sale", True),
         _a("Point of Sale — Shop", "Offline-ready retail checkout.", "point_of_sale"),
         _a("Point of Sale — Restaurant", "Tables, kitchen printing, bills.", "pos_restaurant"),
         _a("Subscriptions", "Recurring billing and renewals.", "sale_subscription"),
         _a("Rental", "Book, pick up and return assets.", "sale_renting"),
     ]},
    {"id": "websites", "title": "Websites", "icon": "globe",
     "apps": [
         _a("Website Builder", "Drag-and-drop pages with SEO tools.", "website"),
         _a("eCommerce", "Online store tied to stock and accounting.", "website_sale"),
         _a("Blog", "Articles with scheduling and SEO.", "website_blog"),
         _a("Forum", "Community Q&A.", "website_forum"),
         _a("Live Chat", "Chat with visitors from Discuss.", "im_livechat"),
         _a("eLearning", "Courses, quizzes and certifications.", "website_slides"),
     ]},
    {"id": "supply-chain", "title": "Supply Chain", "icon": "box", "focus": True,
     "apps": [
         _a("Inventory", "Multi-warehouse stock, barcodes, replenishment.", "stock", True),
         _a("Manufacturing", "Bills of materials and work orders.", "mrp"),
         _a("PLM", "Engineering changes and versions.", "mrp_plm"),
         _a("Purchase", "RFQs, vendor pricelists, receipts.", "purchase", True),
         _a("Maintenance", "Preventive and corrective requests.", "maintenance"),
         _a("Quality", "Control points and quality alerts.", "quality_control"),
     ]},
    {"id": "hr", "title": "Human Resources", "icon": "briefcase",
     "apps": [
         _a("Employees", "Directory, contracts and org chart.", "hr"),
         _a("Recruitment", "Job posts, applicants and interviews.", "hr_recruitment"),
         _a("Time Off", "Leave requests and allocations.", "hr_holidays"),
         _a("Appraisals", "Reviews and goals.", "hr_appraisal"),
         _a("Referrals", "Employee referral programme.", "hr_referral"),
         _a("Fleet", "Vehicles, contracts and costs.", "fleet"),
         _a("Payroll", "Salary rules and payslips.", "hr_payroll"),
     ]},
    {"id": "marketing", "title": "Marketing", "icon": "megaphone",
     "apps": [
         _a("Social Marketing", "Schedule and track posts.", "social"),
         _a("Email Marketing", "Campaigns, lists and A/B tests.", "mass_mailing"),
         _a("SMS Marketing", "Text campaigns with tracking.", "mass_mailing_sms"),
         _a("Events", "Registrations, tickets and badges.", "event"),
         _a("Marketing Automation", "Multi-step flows on triggers.", "marketing_automation"),
         _a("Surveys", "Forms, quizzes and feedback.", "survey"),
     ]},
    {"id": "services", "title": "Services", "icon": "wrench",
     "apps": [
         _a("Project", "Tasks, stages and milestones.", "project"),
         _a("Timesheets", "Time tracking billed to projects.", "hr_timesheet"),
         _a("Field Service", "On-site jobs, run in Planning from Odoo 20.", "industry_fsm"),
         _a("Helpdesk", "Tickets, SLAs and knowledge base.", "helpdesk"),
         _a("Planning", "Shifts, resources and field service.", "planning"),
         _a("Appointments", "Online booking calendars.", "appointment"),
     ]},
    {"id": "productivity", "title": "Productivity", "icon": "zap",
     "apps": [
         _a("Discuss", "Chat, channels and notifications.", "mail"),
         _a("Approvals", "Request and approve anything.", "approvals"),
         _a("IoT", "Connect scales, printers and devices.", "iot"),
         _a("Phone", "Calls over VoIP from inside Odoo.", "voip"),
         _a("Knowledge", "Wiki pages linked to records.", "knowledge"),
         _a("WhatsApp", "Templates and conversations.", "whatsapp"),
         _a("AI", "Assistants and agents inside Odoo.", "ai_app"),
     ]},
]

# Apps shown in the hero marquee strip (module names).
MARQUEE = ["accountant", "sale", "stock", "crm", "purchase", "account", "point_of_sale", "website_sale",
           "hr", "project", "helpdesk", "mass_mailing", "mrp", "documents", "sign", "hr_expense",
           "planning", "appointment", "knowledge", "ai_app"]

# ---------------------------------------------------------------- icons
# 24px stroke icons (Lucide-style). Used via {{icon:name}} in partials.
_S = ('<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" '
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">%s</svg>')
# Duotone: a soft 20% tint shape carries the body of the glyph (the way Odoo's flat app icons
# carry a solid colour field), and a 2px stroke draws the outline. Functional glyphs (arrow,
# check, x, menu, chevron, expand, play) stay plain strokes.
_T = ' fill="currentColor" fill-opacity=".2" stroke="none"'
ICONS = {
    'wk-discovery': '<svg class="ic ic-ind" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="#3167CA"/><rect x="5" y="6" width="22" height="16" rx="2" fill="#FFFFFF"/><rect x="7.4" y="8.6" width="4.2" height="2.8" rx="1" fill="#3167CA"/><rect x="13" y="8.6" width="4.2" height="2.8" rx="1" fill="#3167CA"/><rect x="7.4" y="13.4" width="4.2" height="2.8" rx="1" fill="#14A38B"/><rect x="13" y="13.4" width="4.2" height="2.8" rx="1" fill="#14A38B"/><rect x="20.6" y="8.4" width="4.4" height="4.4" rx=".6" fill="#FFB4AE"/><path d="M9 22v5M23 22v5" stroke="#BFD4F6" stroke-width="2" stroke-linecap="round"/><circle cx="20.5" cy="18.5" r="4.2" fill="#FFE27A" stroke="#1B1F3B" stroke-width="1.6"/><path d="m23.6 21.6 3 3" stroke="#1B1F3B" stroke-width="2.2" stroke-linecap="round"/></svg>',
    'wk-training': '<svg class="ic ic-ind" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="#714B67"/><rect x="5" y="6" width="22" height="14" rx="2" fill="#FFFFFF"/><rect x="7" y="8" width="18" height="2.6" rx="1" fill="#714B67"/><rect x="7.4" y="12.4" width="4" height="2.2" rx="1.1" fill="#2E9C7E"/><rect x="12.4" y="12.4" width="4" height="2.2" rx="1.1" fill="#E46E78"/><rect x="17.4" y="12.4" width="4" height="2.2" rx="1.1" fill="#F2A33A"/><rect x="7.4" y="16" width="10" height="1.6" rx=".8" fill="#C9B6D4"/><path d="M16 20v3" stroke="#E3DCEB" stroke-width="2"/><path d="M9 27.5c0-3 3.2-5 7-5s7 2 7 5" fill="#F2A33A"/><circle cx="16" cy="19.6" r="0" fill="none"/><path d="M11.6 25.6 16 23.4l4.4 2.2-4.4 2.2z" fill="#1B1F3B"/></svg>',
    'wk-integration': '<svg class="ic ic-ind" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="#14A38B"/><rect x="11" y="11" width="10" height="10" rx="3" fill="#714B67"/><path d="M11 13H6.5M11 19H6.5M21 13h4.5M21 19h4.5M13.5 11V6.5M18.5 21v4.5" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/><circle cx="6" cy="13" r="2" fill="#FFD84A"/><circle cx="6" cy="19" r="2" fill="#FFFFFF"/><circle cx="26" cy="13" r="2" fill="#FFFFFF"/><circle cx="26" cy="19" r="2" fill="#FFD84A"/><circle cx="13.5" cy="6" r="2" fill="#FFFFFF"/><circle cx="18.5" cy="26" r="2" fill="#FFFFFF"/><circle cx="16" cy="16" r="2" fill="#FFFFFF"/></svg>',
    'wk-support': '<svg class="ic ic-ind" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="#F08A24"/><circle cx="16" cy="16" r="9.4" fill="none" stroke="#FFFFFF" stroke-width="5"/><path d="M16 6.6a9.4 9.4 0 0 1 9.4 9.4M16 25.4A9.4 9.4 0 0 1 6.6 16" fill="none" stroke="#E2453C" stroke-width="5"/><circle cx="16" cy="16" r="4.3" fill="#F08A24"/><circle cx="24.6" cy="7.4" r="3.6" fill="#1B2350"/><path d="m22.9 7.4 1.2 1.2 2.2-2.3" fill="none" stroke="#FFFFFF" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    'wk-custom': '<svg class="ic ic-ind" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="#3167CA"/><path d="M4 9h24M4 15h24M4 21h24M10 4v24M16 4v24M22 4v24" stroke="#FFFFFF" stroke-opacity=".12" stroke-width="1"/><rect x="5.5" y="20.5" width="21" height="6" rx="1.6" fill="#2E9C7E"/><rect x="8" y="14" width="16" height="6" rx="1.6" fill="#FFFFFF"/><rect x="10.5" y="7.5" width="11" height="6" rx="1.6" fill="#E0456B"/><circle cx="13.5" cy="7" r="1.3" fill="#E0456B"/><circle cx="18.5" cy="7" r="1.3" fill="#E0456B"/><rect x="13" y="2.6" width="6" height="4" rx="1.2" fill="#FFD84A"/></svg>',
    'wk-ai': '<svg class="ic ic-ind" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="#7B5CD6"/><rect x="5" y="7" width="18" height="20" rx="2.4" fill="#FFFFFF"/><rect x="5" y="7" width="18" height="4.4" rx="2" fill="#714B67"/><rect x="8" y="14" width="5" height="2" rx="1" fill="#C9C2EA"/><rect x="14" y="14" width="6" height="2" rx="1" fill="#1B1F3B"/><rect x="8" y="18.4" width="5" height="2" rx="1" fill="#C9C2EA"/><rect x="14" y="18.4" width="6" height="2" rx="1" fill="#1B1F3B"/><rect x="8" y="22.8" width="8" height="2.4" rx="1.2" fill="#1E9E6A"/><path d="M24 4.5c.5 3 1.5 4 4.5 4.5-3 .5-4 1.5-4.5 4.5-.5-3-1.5-4-4.5-4.5 3-.5 4-1.5 4.5-4.5z" fill="#FFD84A"/></svg>',
    'wk-crm': '<svg class="ic ic-ind" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="#21B799"/><rect x="4.5" y="7" width="5.6" height="18" rx="1.6" fill="#FFFFFF" fill-opacity=".45"/><rect x="11.4" y="7" width="5.6" height="18" rx="1.6" fill="#FFFFFF" fill-opacity=".6"/><rect x="18.3" y="7" width="5.6" height="18" rx="1.6" fill="#FFFFFF" fill-opacity=".8"/><rect x="5.4" y="9" width="3.8" height="3.6" rx=".8" fill="#FFFFFF"/><rect x="12.3" y="9" width="3.8" height="3.6" rx=".8" fill="#FFFFFF"/><rect x="12.3" y="14" width="3.8" height="3.6" rx=".8" fill="#FFFFFF"/><rect x="19.2" y="9" width="3.8" height="3.6" rx=".8" fill="#2BC48A"/><path d="M25.4 21c0-2.4 1-3.6 2.6-4.2v8.4c-1.6-.6-2.6-1.8-2.6-4.2z" fill="#E9B949"/><path d="M22 24.8h6.4" stroke="#C9962E" stroke-width="1.6" stroke-linecap="round"/><circle cx="25.2" cy="26.6" r="1.2" fill="#C9962E"/></svg>',
    'wk-app-acc': '<svg class="ic ic-ind" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="#2E9C7E"/><rect x="6" y="5.5" width="20" height="21" rx="2.4" fill="#FFFFFF"/><path d="M6 11h20M6 15.5h20M6 20h20" stroke="#DCEFE7" stroke-width="1.2"/><path d="M10 5.5v21" stroke="#E2453C" stroke-width="1.2" stroke-opacity=".6"/><rect x="12" y="7.6" width="9" height="2" rx="1" fill="#2E9C7E"/><rect x="18" y="12.4" width="6" height="2" rx="1" fill="#1B1F3B"/><rect x="18" y="16.9" width="6" height="2" rx="1" fill="#1B1F3B"/><path d="M17 21.7h7.4" stroke="#1B1F3B" stroke-width="1.4"/><path d="M17 23.4h7.4" stroke="#1B1F3B" stroke-width="1.4"/><circle cx="24.5" cy="25.5" r="4" fill="#714B67"/><path d="m22.8 25.5 1.1 1.1 2.1-2.3" fill="none" stroke="#FFFFFF" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    'wk-app-sales': '<svg class="ic ic-ind" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="#E46E78"/><rect x="5.5" y="5" width="17" height="22" rx="2.4" fill="#FFFFFF"/><rect x="5.5" y="5" width="17" height="4.6" rx="2" fill="#714B67"/><rect x="8" y="12" width="8" height="1.8" rx=".9" fill="#1B1F3B"/><rect x="8" y="15.6" width="10" height="1.8" rx=".9" fill="#C9D2DE"/><rect x="8" y="19.2" width="7" height="1.8" rx=".9" fill="#C9D2DE"/><path d="M8 24c1.4-1.8 2.4 1 3.6-.6s2-1 3 .2" fill="none" stroke="#1E9E6A" stroke-width="1.4" stroke-linecap="round"/><path d="M19 15.5h7.2a1.6 1.6 0 0 1 1.6 1.6v5.4a1.6 1.6 0 0 1-1.6 1.6H19l-3.2-4.3z" fill="#FFD84A"/><circle cx="19.6" cy="19.8" r="1.1" fill="#E46E78"/></svg>',
    'wk-app-stock': '<svg class="ic ic-ind" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="#F2A33A"/><path d="M6 7v20M26 7v20" stroke="#3167CA" stroke-width="2.4" stroke-linecap="round"/><path d="M6 14h20M6 21h20" stroke="#1B1F3B" stroke-width="2"/><rect x="8.5" y="8.6" width="6" height="5" rx="1" fill="#C9A27A"/><rect x="16" y="9.6" width="5" height="4" rx="1" fill="#D9B88E"/><rect x="9" y="15.6" width="5" height="5" rx="1" fill="#D9B88E"/><rect x="15.4" y="15.6" width="7" height="5" rx="1" fill="#C9A27A"/><rect x="11" y="22.6" width="10" height="4" rx="1" fill="#FFFFFF"/><path d="M12.5 23.4v2.4M14 23.4v2.4M15 23.4v2.4M16.8 23.4v2.4M18 23.4v2.4M19.4 23.4v2.4" stroke="#1B1F3B" stroke-width=".8"/></svg>',
    'wk-app-all': '<svg class="ic ic-ind" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="#714B67"/><rect x="5.5" y="5.5" width="6" height="6" rx="1.8" fill="#0E9384"/><rect x="13" y="5.5" width="6" height="6" rx="1.8" fill="#3167CA"/><rect x="20.5" y="5.5" width="6" height="6" rx="1.8" fill="#F08A24"/><rect x="5.5" y="13" width="6" height="6" rx="1.8" fill="#7B5CD6"/><rect x="13" y="13" width="6" height="6" rx="1.8" fill="#E0456B"/><rect x="20.5" y="13" width="6" height="6" rx="1.8" fill="#D9922B"/><ellipse cx="16" cy="22.4" rx="7" ry="2" fill="#FFFFFF"/><path d="M9 22.4v3.4c0 1.1 3.1 2 7 2s7-.9 7-2v-3.4" fill="#FFFFFF" fill-opacity=".8"/><circle cx="25.5" cy="25.5" r="2.6" fill="#FFD84A"/></svg>',
    'co-about': '<svg class="ic ic-ind" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="#3167CA"/><path d="M11 3.5 16 11l5-7.5" fill="none" stroke="#BFD4F6" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><rect x="13.4" y="9.6" width="5.2" height="3.4" rx="1.2" fill="#FFD84A"/><rect x="7.5" y="12" width="17" height="16" rx="3" fill="#FFFFFF"/><rect x="7.5" y="12" width="17" height="4.4" rx="2" fill="#FFD84A"/><rect x="10" y="18.6" width="5" height="6" rx="1.2" fill="#BFD4F6"/><circle cx="12.5" cy="20.6" r="1.4" fill="#3167CA"/><rect x="16.6" y="19.2" width="5.6" height="1.6" rx=".8" fill="#1B1F3B"/><rect x="16.6" y="22.4" width="4.2" height="1.4" rx=".7" fill="#9AA6BC"/></svg>',
    'co-sg': '<svg class="ic ic-ind" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="#3167CA"/><circle cx="24.5" cy="8.5" r="3" fill="#FFD84A"/><path d="M8.6 25V12.6h3.6V25zM14.2 25V11.2h3.6V25zM19.8 25V9.8h3.6V25z" fill="#FFFFFF"/><path d="M6.6 9.6c6-1.6 12.6-1.6 18.8 0v1.8c-6.2-1.4-12.8-1.4-18.8 0z" fill="#BFD4F6"/><rect x="5" y="25" width="22" height="2.2" rx="1.1" fill="#8FB2EE"/></svg>',
    'co-ph': '<svg class="ic ic-ind" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="#14A38B"/><rect x="5.5" y="7" width="21" height="16" rx="2.4" fill="#FFFFFF"/><path d="M12.6 9.4v11.2M19.4 9.4v11.2" stroke="#D5DCE6" stroke-width="1"/><rect x="7.4" y="9.6" width="3.8" height="3.4" rx=".8" fill="#FFD84A"/><rect x="7.4" y="14.4" width="3.8" height="3.4" rx=".8" fill="#F08A24"/><rect x="14.2" y="9.6" width="3.8" height="3.4" rx=".8" fill="#9FC4FF"/><rect x="20.9" y="9.6" width="3.8" height="3.4" rx=".8" fill="#2BC48A"/><rect x="20.9" y="14.4" width="3.8" height="3.4" rx=".8" fill="#2BC48A"/><path d="M11 23v4M21 23v4" stroke="#0E7A68" stroke-width="2" stroke-linecap="round"/></svg>',
    'co-vn': '<svg class="ic ic-ind" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="#0EA5B7"/><rect x="5" y="7.5" width="22" height="17" rx="3" fill="#FFFFFF"/><path d="M5 11.2h22" stroke="#E3E9F0" stroke-width="1.2"/><circle cx="7.9" cy="9.4" r="1" fill="#FF6F61"/><circle cx="10.6" cy="9.4" r="1" fill="#FFC94A"/><circle cx="13.3" cy="9.4" r="1" fill="#2BC48A"/><path d="m9 15.2 2.6 2.2L9 19.6" fill="none" stroke="#0B7F8D" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><rect x="12.6" y="18.6" width="5" height="1.6" rx=".8" fill="#0B7F8D"/><path d="M22.2 13.4l.9 2.3 2.3.9-2.3.9-.9 2.3-.9-2.3-2.3-.9 2.3-.9z" fill="#F08A24"/></svg>',
    'co-careers': '<svg class="ic ic-ind" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="#FFD84A"/><rect x="8" y="6" width="16" height="21" rx="1.6" fill="#FFFFFF"/><rect x="8" y="6" width="16" height="4.6" rx="1.6" fill="#3167CA"/><circle cx="16" cy="6.2" r="1.8" fill="#E0456B"/><rect x="10.4" y="12.6" width="11.2" height="1.8" rx=".9" fill="#1B2350"/><rect x="10.4" y="15.8" width="8" height="1.4" rx=".7" fill="#9AA6BC"/><path d="M8 20.6h16" stroke="#1B2350" stroke-width="1" stroke-dasharray="1.6 1.2"/><path d="M11 21.6v4.4M14.3 21.6v4.4M17.7 21.6v4.4M21 21.6v4.4" stroke="#3167CA" stroke-width="1.6" stroke-linecap="round"/></svg>',
    'co-blog': '<svg class="ic ic-ind" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="#E2453C"/><rect x="6" y="7" width="20" height="19" rx="2" fill="#FFFDF8"/><rect x="8.4" y="9.4" width="15.2" height="2.4" rx=".6" fill="#141A3A"/><path d="M8.4 13.2h15.2" stroke="#141A3A" stroke-width=".8"/><rect x="8.4" y="14.8" width="7" height="6" rx="1" fill="#3167CA"/><rect x="16.8" y="15" width="6.8" height="1.3" rx=".65" fill="#9AA6BC"/><rect x="16.8" y="17.6" width="6.8" height="1.3" rx=".65" fill="#9AA6BC"/><rect x="16.8" y="20.2" width="5" height="1.3" rx=".65" fill="#9AA6BC"/><rect x="8.4" y="22.6" width="15.2" height="1.3" rx=".65" fill="#FFD84A"/><circle cx="25.4" cy="7.2" r="3" fill="#FFFFFF"/><circle cx="25.4" cy="7.2" r="1.7" fill="#E2453C"/></svg>',
    'co-events': '<svg class="ic ic-ind" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="#14A38B"/><path d="M7 11.4 16 6l9 5.4z" fill="#FFD84A"/><path d="M7 11.4h18" stroke="#1B2350" stroke-width="1.2" stroke-linecap="round"/><path d="M8.6 11.4v1.4a1.8 1.8 0 0 0 3.6 0 1.8 1.8 0 0 0 3.6 0 1.8 1.8 0 0 0 3.6 0 1.8 1.8 0 0 0 3.6 0v-1.4" fill="#E2453C"/><rect x="9.4" y="15" width="13.2" height="8.6" rx="1" fill="#FFFFFF"/><rect x="11" y="16.8" width="5.2" height="4.8" rx=".8" fill="#3167CA"/><rect x="17.2" y="17" width="4" height="1.2" rx=".6" fill="#1B2350"/><rect x="17.2" y="19.2" width="3.2" height="1.1" rx=".55" fill="#9AA6BC"/><path d="M11 23.6 9.2 27M21 23.6l1.8 3.4M16 23.6V27" stroke="#1B2350" stroke-width="1.5" stroke-linecap="round"/></svg>',
    'co-life': '<svg class="ic ic-ind" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="#FF8FA3"/><rect x="5.5" y="10" width="21" height="15" rx="3" fill="#1B2350"/><rect x="11" y="7.6" width="6.4" height="3.4" rx="1" fill="#1B2350"/><circle cx="16" cy="17.6" r="5.6" fill="#FFFFFF"/><path d="M16 21.2s-3.2-1.9-3.2-4a1.7 1.7 0 0 1 3.2-.9 1.7 1.7 0 0 1 3.2.9c0 2.1-3.2 4-3.2 4z" fill="#E2453C"/><circle cx="23.4" cy="12.6" r="1.2" fill="#FFD84A"/><circle cx="9.4" cy="12.6" r="1" fill="#3167CA"/></svg>',
    'co-team': '<svg class="ic ic-ind" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="#3167CA"/><path d="M5.5 10.4c0-1 .8-1.8 1.8-1.8h5.4l2 2.4h10c1 0 1.8.8 1.8 1.8v11.6c0 1-.8 1.8-1.8 1.8H7.3c-1 0-1.8-.8-1.8-1.8z" fill="#D9B06A"/><rect x="9" y="7" width="15" height="14" rx="1.4" fill="#FFFFFF"/><rect x="11" y="9.4" width="4" height="4.6" rx=".8" fill="#BFD4F6"/><rect x="16.4" y="9.8" width="5.6" height="1.4" rx=".7" fill="#1B1F3B"/><rect x="16.4" y="12.6" width="4.4" height="1.2" rx=".6" fill="#9AA6BC"/><path d="M5.5 14.6h21v9.4c0 1-.8 1.8-1.8 1.8H7.3c-1 0-1.8-.8-1.8-1.8z" fill="#EBC98B"/><circle cx="22.4" cy="21.2" r="3.2" fill="#1E9E6A"/><path d="m20.9 21.2 1 1 1.9-2" fill="none" stroke="#FFFFFF" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    'ind-medical': '<svg class="ic ic-ind" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="#21B799"/><rect x="8.5" y="7" width="15" height="19" rx="2.5" fill="#FFFFFF"/><rect x="12" y="5" width="8" height="4" rx="1.5" fill="#0F4C45"/><path d="M10.5 17h3l1.5-4 2.4 7 1.6-3h2.5" fill="none" stroke="#12806B" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    'ind-travel': '<svg class="ic ic-ind" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="#17284A"/><path d="M6 10.5a1.5 1.5 0 0 1 1.5-1.5h17a1.5 1.5 0 0 1 1.5 1.5v3a2.5 2.5 0 0 0 0 5v3a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 6 21.5v-3a2.5 2.5 0 0 0 0-5z" fill="#FFFFFF"/><path d="M20.5 9v14" stroke="#17284A" stroke-width="1" stroke-dasharray="1.6 1.4"/><path d="M9.5 16.6l3.3-.9 2.6-3.7 1.3.3-1.2 3 2.6-.7.9-1.2.9.2-.4 1.9-1.6 1-7.4 1.4z" fill="#FFC94A"/><rect x="22" y="13" width="2" height="6" rx="1" fill="#FFC94A"/></svg>',
    'ind-retail': '<svg class="ic ic-ind" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="#D9785A"/><rect x="8" y="14" width="16" height="11" rx="1.5" fill="#FBF3E6"/><rect x="10.5" y="17" width="5" height="8" rx="1" fill="#81B29A"/><rect x="17.5" y="17" width="4.5" height="4" rx="1" fill="#BFE3F3"/><path d="M7 9.5h18l1 4.5H6z" fill="#FFFFFF"/><path d="M10 9.5h3l-.5 4.5h-3.5zM16 9.5h3l.5 4.5h-3.5z" fill="#B95E43"/><path d="M6 14a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0" fill="none" stroke="#FFFFFF" stroke-width="1.4"/></svg>',
    'ind-ecommerce': '<svg class="ic ic-ind" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="#6D5BD0"/><path d="M6.5 12 16 7.5l9.5 4.5v10L16 26.5 6.5 22z" fill="#C99A6B"/><path d="M6.5 12 16 16.5l9.5-4.5" fill="none" stroke="#A87A4C" stroke-width="1.2"/><path d="M16 16.5v10" stroke="#A87A4C" stroke-width="1.2"/><path d="m10.8 10 9.5 4.5v3.4" fill="none" stroke="#F3E2C8" stroke-width="2"/><rect x="18" y="19" width="5.5" height="4" rx=".6" fill="#FFFFFF"/><path d="M19 19.8v2.4M20.2 19.8v2.4M21 19.8v2.4M22.4 19.8v2.4" stroke="#2B2350" stroke-width=".7"/></svg>',
    'ind-construction': '<svg class="ic ic-ind" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="#FFC93C"/><rect x="4" y="24.3" width="24" height="3.6" rx="1.2" fill="#1E2A3A"/><path d="M6 27.9l3-3.6h2.2l-3 3.6zM12 27.9l3-3.6h2.2l-3 3.6zM18 27.9l3-3.6h2.2l-3 3.6zM24 27.9l2.6-3.1v2.2l-.8.9z" fill="#FFC93C"/><path d="M8 20a8 8 0 0 1 16 0z" fill="#1F3F73"/><path d="M14.5 12.2h3V19h-3z" fill="#2E5BA3"/><rect x="6" y="19.5" width="20" height="3" rx="1.5" fill="#1F3F73"/></svg>',
    'ind-fnb': '<svg class="ic ic-ind" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="#1F4D3F"/><path d="M16 4v4" stroke="#C9A44A" stroke-width="1.4"/><rect x="12" y="7.5" width="8" height="3" rx="1" fill="#C9A44A"/><rect x="9.5" y="10" width="13" height="13" rx="6" fill="#E2553D"/><ellipse cx="16" cy="16.5" rx="3.2" ry="4.2" fill="#FFD27A"/><path d="M12.5 11.5c-1.6 3.2-1.6 6.8 0 10M19.5 11.5c1.6 3.2 1.6 6.8 0 10" fill="none" stroke="#B8432F" stroke-width="1"/><rect x="12" y="22.5" width="8" height="3" rx="1" fill="#C9A44A"/><path d="M16 25.5v3" stroke="#E2553D" stroke-width="1.6" stroke-linecap="round"/></svg>',
    'ind-manufacturing': '<svg class="ic ic-ind" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="#2F6B7A"/><polygon points="14.60,6.50 17.40,6.50 17.75,9.02 19.70,9.82 21.72,8.29 23.71,10.28 22.18,12.30 22.98,14.25 25.50,14.60 25.50,17.40 22.98,17.75 22.18,19.70 23.71,21.72 21.72,23.71 19.70,22.18 17.75,22.98 17.40,25.50 14.60,25.50 14.25,22.98 12.30,22.18 10.28,23.71 8.29,21.72 9.82,19.70 9.02,17.75 6.50,17.40 6.50,14.60 9.02,14.25 9.82,12.30 8.29,10.28 10.28,8.29 12.30,9.82 14.25,9.02" fill="#FF7A1A"/><circle cx="16" cy="16" r="4.6" fill="#E4E9EE"/><circle cx="16" cy="16" r="2" fill="#2F6B7A"/></svg>',
    'ind-health-wellness': '<svg class="ic ic-ind" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="#8DB39A"/><path d="M16 7.5c3 3 3.4 8.2 0 13.5-3.4-5.3-3-10.5 0-13.5z" fill="#FFFFFF"/><path d="M7 13c4.2.2 7.4 3.6 8.4 8.6C10.6 21 7.4 18 7 13zM25 13c-4.2.2-7.4 3.6-8.4 8.6 4.8-.6 8-3.6 8.4-8.6z" fill="#E9E2F5"/><path d="M8.5 23.5c2.6 1.2 4.9 1.6 7.5 1.6s4.9-.4 7.5-1.6" fill="none" stroke="#3F6B4F" stroke-width="1.6" stroke-linecap="round"/></svg>',
    "hardhat": _S % ('<path d="M2 18a10 10 0 0 1 20 0z"' + _T + '/><path d="M2 18a10 10 0 0 1 20 0"/><path d="M2 18h20"/><path d="M9 8V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/><path d="M12 4v6"/>'),
    "utensils": _S % ('<path d="M17 2c-2 3-2 8 0 9v11z"' + _T + '/><path d="M3 2v7a3 3 0 0 0 6 0V2"/><path d="M6 2v20"/><path d="M17 2c-2 3-2 8 0 9v11"/><path d="M21 2c-1 4-1 8-4 9"/>'),
    "gear": _S % ('<circle cx="12" cy="12" r="7"' + _T + '/><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
    "heart": _S % ('<path d="M12 21s-8-5.3-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.7-8 11-8 11z"' + _T + '/><path d="M12 21s-8-5.3-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.7-8 11-8 11z"/><path d="M8 12h2l1.5-2.5 1.5 4 1-1.5H16"/>'),
    "ruler": _S % ('<path d="m3 17 14-14 4 4L7 21z"' + _T + '/><path d="m3 17 14-14 4 4L7 21z"/><path d="m14 6 1.5 1.5M11 9l1.5 1.5M8 12l1.5 1.5"/>'),
    "layers": _S % ('<path d="M12 2 2 7l10 5 10-5z"' + _T + '/><path d="M12 2 2 7l10 5 10-5-10-5z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/>'),
    "globe": _S % ('<circle cx="12" cy="12" r="10"' + _T + '/><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>'),
    "megaphone": _S % ('<path d="m3 11 18-5v12L3 13z"' + _T + '/><path d="m3 11 18-5v12L3 13v-2z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>'),
    "pulse": _S % ('<rect x="2" y="8" width="20" height="8" rx="4"' + _T + '/><path d="M22 12h-4l-3 9L9 3l-3 9H2"/>'),
    "plane": _S % ('<path d="m22 2-7 20-4-9-9-4z"' + _T + '/><path d="M22 2 11 13"/><path d="m22 2-7 20-4-9-9-4 20-7z"/>'),
    "bag": _S % ('<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"' + _T + '/><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>'),
    "cart": _S % ('<path d="M6 6h17l-1.6 8.4a2 2 0 0 1-2 1.6H9.7a2 2 0 0 1-2-1.6z"' + _T + '/><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>'),
    "search": _S % ('<circle cx="11" cy="11" r="7"' + _T + '/><circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/>'),
    "graduation": _S % ('<path d="M22 10 12 5 2 10l10 5z"' + _T + '/><path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>'),
    "plug": _S % ('<path d="M18 8H6v4a6 6 0 0 0 12 0z"' + _T + '/><path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8H6v4a6 6 0 0 0 12 0V8z"/>'),
    "lifebuoy": _S % ('<path d="M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20zm0 6a4 4 0 1 1 0 8 4 4 0 1 1 0-8z" fill-rule="evenodd"' + _T + '/><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 14.83 4.24 4.24"/><path d="m14.83 9.17 4.24-4.24"/><path d="m4.93 19.07 4.24-4.24"/>'),
    "grid": _S % ('<rect x="3" y="3" width="7" height="7" rx="1.5"' + _T + '/><rect x="14" y="14" width="7" height="7" rx="1.5"' + _T + '/><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/>'),
    "calculator": _S % ('<rect x="4" y="2" width="16" height="20" rx="2"' + _T + '/><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8"/><path d="M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 19h.01M12 19h.01M16 19h.01"/>'),
    "trend": _S % ('<path d="m3 17 6-6 4 4 8-8v10H3z"' + _T + '/><path d="m3 17 6-6 4 4 8-8"/><path d="M14 7h7v7"/>'),
    "box": _S % ('<path d="M12 12v10l7-4a2 2 0 0 0 2-1.73V8z"' + _T + '/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>'),
    "cpu": _S % ('<rect x="9" y="9" width="6" height="6"' + _T + '/><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/>'),
    "usercheck": _S % ('<circle cx="9" cy="7" r="4"' + _T + '/><path d="M2 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2z"' + _T + '/><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m16 11 2 2 4-4"/>'),
    "users": _S % ('<circle cx="9" cy="7" r="4"' + _T + '/><path d="M1 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2z"' + _T + '/><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>'),
    "check": _S % '<path d="M20 6 9 17l-5-5"/>',
    "arrow": _S % '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    "mail": _S % ('<rect x="2" y="4" width="20" height="16" rx="2"' + _T + '/><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/>'),
    "chat": _S % ('<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z"' + _T + '/><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>'),
    "pin": _S % ('<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"' + _T + '/><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>'),
    "shield": _S % ('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"' + _T + '/><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>'),
    "file": _S % ('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"' + _T + '/><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/>'),
    "receipt": _S % ('<path d="M4 2v20l3-2 3 2 3-2 3 2 3-2 3 2V2l-3 2-3-2-3 2-3-2-3 2z"' + _T + '/><path d="M4 2v20l3-2 3 2 3-2 3 2 3-2 3 2V2l-3 2-3-2-3 2-3-2-3 2z"/><path d="M8 8h8M8 12h8M8 16h5"/>'),
    "truck": _S % ('<rect x="1" y="3" width="15" height="13" rx="1"' + _T + '/><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>'),
    "factory": _S % ('<path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4H2z"' + _T + '/><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4H2z"/>'),
    "briefcase": _S % ('<rect x="2" y="7" width="20" height="14" rx="2"' + _T + '/><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>'),
    "calendar": _S % ('<path d="M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4H3z"' + _T + '/><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>'),
    "wrench": _S % ('<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"' + _T + '/><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>'),
    "zap": _S % ('<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"' + _T + '/><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>'),
    "network": _S % ('<rect x="9" y="2" width="6" height="6" rx="1"' + _T + '/><rect x="9" y="2" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="16" y="16" width="6" height="6" rx="1"/><path d="M12 8v4M5 16v-4h14v4"/>'),
    "wifi": _S % ('<path d="M8.5 16.1a5 5 0 0 1 7 0L12 19.5z"' + _T + '/><path d="M2 8.8a15 15 0 0 1 20 0"/><path d="M5 12.5a10 10 0 0 1 14 0"/><path d="M8.5 16.1a5 5 0 0 1 7 0"/><path d="M12 19.5h.01"/>'),
    "bars": _S % ('<rect x="4" y="15" width="4" height="6" rx="1"' + _T + '/><rect x="10" y="9" width="4" height="12" rx="1"' + _T + '/><rect x="16" y="3" width="4" height="18" rx="1"' + _T + '/><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/>'),
    "clock": _S % ('<circle cx="12" cy="12" r="10"' + _T + '/><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>'),
    "x": _S % '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    "menu": _S % '<path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/>',
    "chevron": _S % '<path d="m6 9 6 6 6-6"/>',
    "bank": _S % ('<path d="m12 3 10 6H2z"' + _T + '/><path d="M3 10h18"/><path d="M5 10v9M9 10v9M15 10v9M19 10v9"/><path d="M2 21h20"/><path d="m12 3 10 6H2z"/>'),
    "refresh": _S % ('<circle cx="12" cy="12" r="9"' + _T + '/><path d="M21 12a9 9 0 1 1-2.64-6.36"/><path d="M21 3v6h-6"/>'),
    "target": _S % ('<path d="M12 6a6 6 0 1 0 0 12 6 6 0 1 0 0-12zm0 4a2 2 0 1 1 0 4 2 2 0 1 1 0-4z" fill-rule="evenodd"' + _T + '/><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>'),
    "database": _S % ('<path d="M3 5c0-1.66 4-3 9-3s9 1.34 9 3v14c0 1.66-4 3-9 3s-9-1.34-9-3z"' + _T + '/><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/>'),
    "sparkle": _S % ('<path d="M12 6l1.8 4.2L18 12l-4.2 1.8L12 18l-1.8-4.2L6 12l4.2-1.8z"' + _T + '/><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/>'),
    "quote": _S % ('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"' + _T + '/><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M9 15h6"/><path d="M9 11h2"/>'),
    "camera": _S % ('<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"' + _T + '/><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>'),
    "layout": _S % ('<path d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4H3z"' + _T + '/><rect x="3" y="9" width="6" height="12"' + _T + '/><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/>'),
    "lock": _S % ('<rect x="3" y="11" width="18" height="11" rx="2"' + _T + '/><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'),
    "star": _S % ('<path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"' + _T + '/><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>'),
    "smile": _S % ('<circle cx="12" cy="12" r="10"' + _T + '/><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><path d="M9 9h.01M15 9h.01"/>'),
    "code": _S % ('<rect x="2" y="4" width="20" height="16" rx="3"' + _T + '/><path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/>'),
    "chat-send": '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.6 3.6c-.5.4-1.4.1-1.4-.6z"/><path d="m8.5 9.6 7-2.6-2.6 7-1.3-3.1z"/></svg>',
    "send": _S % ('<path d="m22 2-7 20-4-9-9-4z"' + _T + '/><path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>'),
    "bot": _S % ('<rect x="3" y="8" width="18" height="12" rx="3"' + _T + '/><rect x="3" y="8" width="18" height="12" rx="3"/><path d="M12 8V4"/><circle cx="12" cy="3" r="1"/><path d="M8 14h.01M16 14h.01"/><path d="M9 17.5c1.5 1 4.5 1 6 0"/>'),
    "whatsapp": '<svg class="ic" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>',
    "expand": _S % '<path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="m21 3-7 7"/><path d="m3 21 7-7"/>',
    "volume": _S % ('<path d="M11 5 6 9H2v6h4l5 4z"' + _T + '/><path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.4 5.6a9 9 0 0 1 0 12.8"/>'),
    "mute": _S % ('<path d="M11 5 6 9H2v6h4l5 4z"' + _T + '/><path d="M11 5 6 9H2v6h4l5 4z"/><path d="m22 9-6 6"/><path d="m16 9 6 6"/>'),
    "monitor": _S % ('<rect x="2" y="3" width="20" height="14" rx="2"' + _T + '/><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>'),
    "tablet": _S % ('<rect x="4" y="3" width="16" height="18" rx="2.5"' + _T + '/><rect x="4" y="3" width="16" height="18" rx="2.5"/><path d="M11 17.5h2"/>'),
    "phone": _S % ('<rect x="6" y="2" width="12" height="20" rx="2.5"' + _T + '/><rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M11 18h2"/>'),
    "palette": _S % ('<path d="M12 22a10 10 0 1 1 10-10c0 2.8-2.2 4-4 4h-2a2 2 0 0 0-1.5 3.3A1.6 1.6 0 0 1 12 22z"' + _T + '/><path d="M12 22a10 10 0 1 1 10-10c0 2.8-2.2 4-4 4h-2a2 2 0 0 0-1.5 3.3A1.6 1.6 0 0 1 12 22z"/><circle cx="7.5" cy="10.5" r="1.2"/><circle cx="11" cy="6.5" r="1.2"/><circle cx="16" cy="8" r="1.2"/>'),
    "play": ('<svg class="ic" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>'),
    "pause": ('<svg class="ic" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>'),
}
# per-page badges as files (_src/badges/<name>.svg, one 32x32 "ic ic-ind" SVG each), so pages can add theirs without editing this list
for _b in sorted((__import__("pathlib").Path(__file__).resolve().parent / "badges").glob("*.svg")):
    ICONS.setdefault(_b.stem, _b.read_text(encoding="utf-8").strip())


# ---------------------------------------------------------------- tracking
# Restored 2026-09-26 exactly as the previous site ran them. Search Console verifies site
# ownership through the GA4 and Tag Manager snippets, so they must stay in the <head> of
# the homepage in their standard form. Both containers were checked on 2026-09-26: they
# hold no tags of their own (the site CSP relies on that - no Custom HTML tags).
TRACKING = {
    "gtm": ["GTM-PB9CDFGG"],            # every page
    "gtm_home": ["GTM-5BZBR57D"],       # homepage only, as before
    "ga4": "G-E7P849N9JY",
    "ads": "AW-18068724830",
    # Google Ads "lead" conversion - fired on an accepted form submission (site.js)
    "ads_lead": "AW-18068724830/dBpuCLul3bQcEN6466dD",
}
