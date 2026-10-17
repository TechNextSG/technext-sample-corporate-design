"""Vercel function: every form on technext.asia becomes a lead in the Odoo CRM (technext.odoo.com).

POST /api/lead with the form's fields as JSON (site.js tnPostForm; the only place a form goes).
The lead is tagged "Website" plus the form it came from, gets source "Website" ("Paid Ads" when the visit
came from an ad click) / medium "Website", department (sales team) "Marketing Dept", and stays UNASSIGNED
(ODOO_SALESPERSON empty) so everyone with Sales access sees it; Jeric picks it up by setting himself as
salesperson. Every lead @mentions jeric@technext.asia (ODOO_NOTIFY_EMAILS), and Jeric plus ODOO_COPY_EMAILS
(hello@technext.asia) get an email with the full details. The Odoo API key lives only in the Vercel env var
ODOO_API_KEY, never in this public repo.
"""
import html
import http.client
import json
import os
import re
import time
import urllib.error
import urllib.parse
import urllib.request
from http.server import BaseHTTPRequestHandler

ODOO = os.environ.get("ODOO_URL", "https://technext.odoo.com").rstrip("/")
KEY = os.environ.get("ODOO_API_KEY", "")
NOTIFY_EMAILS = [x.strip() for x in os.environ.get("ODOO_NOTIFY_EMAILS", "jeric@technext.asia").split(",") if x.strip()]
ORIGINS = ("https://technext.asia", "https://www.technext.asia")
# technext.odoo.com hosts a copy of the site and the discovery-call booking page; both post here (CORS)
CORS_ORIGINS = ("https://technext.odoo.com",)
COPY_EMAILS = [x.strip() for x in os.environ.get("ODOO_COPY_EMAILS", "hello@technext.asia").split(",") if x.strip()]
# login every lead is assigned to; empty = unassigned. Rico (the API user, Sales "Own Documents Only") cannot
# see a lead assigned to someone else, so leads stay unassigned until Rico gets "All Documents" access.
SALESPERSON = os.environ.get("ODOO_SALESPERSON", "")
DEPARTMENT = "Marketing Dept"          # website + social leads; direct / referral / messaging go to "Sales Dept"
MEDIUM_NAME = "Website"
# an ad click leaves one of these in the landing URL -> source "Paid Ads", otherwise "Website"
AD_CLICK = re.compile(r"[?&](gclid|gbraid|wbraid|utm_medium=(cpc|ppc|paid[a-z_]*|ads?))(=|&|$)", re.I)

# form "source" field -> short tag name
FORMS = [
    ("quotation", "Quotation builder"),
    ("get started", "Free website offer (/get-started)"),
    ("free website", "Free website offer (/free-website-with-odoo)"),
    ("contact", "Contact page"),
    ("let's talk", "Let's Talk panel"),
    ("discovery call", "Discovery call booking"),
]
LABELS = {"name": "Name", "company": "Company", "email": "Email", "phone": "Phone", "topic": "Interested in",
          "message": "Message", "team_size": "Team size", "country": "Country", "current_website": "Current website",
          "scope_summary": "Quotation scope", "apps": "Odoo apps", "users": "Users", "hosting": "Hosting",
          "services": "Services", "timeline": "Timeline", "source": "Form", "page": "Page",
          "referrer": "Came from", "landing": "First page of the visit", "slot": "Meeting time"}
QUOTE_FIELDS = ("apps", "users", "hosting", "services", "timeline")
SKIP = {"_subject", "_template", "_captcha", "_honey", "_next", "_cc", "_autoresponse"}


_CONN = None  # one HTTPS connection to Odoo, reused while the instance is warm (no new TLS handshake per call)
HOST = urllib.parse.urlsplit(ODOO).netloc


def rpc(model, method, **kw):
    global _CONN
    body = json.dumps(kw).encode()
    headers = {"Authorization": f"bearer {KEY}", "Content-Type": "application/json",
               "User-Agent": "technext-website-forms/1.0"}
    for wait in (1.5, 3, 0):                              # odoo.com answers bursts with 429: back off and retry
        for attempt in (1, 2):                            # Odoo may have closed the idle connection: reconnect once
            try:
                if _CONN is None:
                    _CONN = http.client.HTTPSConnection(HOST, timeout=15)
                _CONN.request("POST", f"/json/2/{model}/{method}", body, headers)
                r = _CONN.getresponse()
                data = r.read()
                break
            except (http.client.HTTPException, OSError):
                _CONN = None
                if attempt == 2:
                    raise
        if r.status == 429 and wait:
            time.sleep(wait)
            continue
        if r.status >= 400:
            raise urllib.error.HTTPError(f"{ODOO}/json/2/{model}/{method}", r.status,
                                         data[:300].decode(errors="replace"), r.headers, None)
        return json.loads(data or b"null")


_IDS = {}  # tag / utm ids, kept while the function instance stays warm


def find_or_create(model, name):
    if (model, name) not in _IDS:
        ids = rpc(model, "search", domain=[["name", "=", name]], limit=1)
        _IDS[model, name] = ids[0] if ids else rpc(model, "create", vals_list=[{"name": name}])[0]
    return _IDS[model, name]


def partners(emails):
    """Odoo partners for these emails, looked up once per warm instance."""
    key = ("partners",) + tuple(emails)
    if key not in _IDS:
        _IDS[key] = [p for e in emails for p in rpc(
            "res.partner", "search_read", domain=[["email", "=ilike", e]], fields=["name", "email"], limit=1)]
    return _IDS[key]


def lookup(model, domain):
    """First matching id or False; a miss is remembered for 5 minutes, so a team created later is picked up."""
    key = (model, json.dumps(domain))
    hit = _IDS.get(key)
    if hit is None or (hit is False and time.time() > _IDS.get(key + ("until",), 0)):
        ids = rpc(model, "search", domain=domain, limit=1)
        _IDS[key] = ids[0] if ids else False
        _IDS[key + ("until",)] = time.time() + 300
    return _IDS[key]


def clean(v, n=2000):
    return re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f]", "", str(v)).strip()[:n]


def form_tag(source):
    s = (source or "").lower()
    return next((tag for key, tag in FORMS if key in s), "Other form")


def keep_typed(lead, name, phone):
    """An email that matches an existing Odoo contact links that contact, and Odoo then overwrites the
    typed name and phone with the contact's. Put back what the visitor typed."""
    want = {k: v for k, v in (("contact_name", name), ("phone", phone)) if v}
    if not want:
        return
    got = rpc("crm.lead", "read", ids=[lead], fields=list(want))
    if got and any(got[0].get(k) != v for k, v in want.items()):
        rpc("crm.lead", "write", ids=[lead], vals=want)


def booking_lead(email, tries=8, wait=1.5):
    """The opportunity Odoo's appointment app creates for a discovery-call booking (it appears a moment
    after the booking form is sent). False when it never shows up or the API user cannot see it."""
    for i in range(tries):
        since = time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime(time.time() - 600))
        ids = rpc("crm.lead", "search", domain=[["email_from", "=ilike", email], ["create_date", ">=", since],
                                                ["name", "ilike", "Booking"]], order="id desc", limit=1)
        if ids:
            return ids[0]
        time.sleep(wait)
    return False


def make_lead(p):
    name, email, phone, company = (clean(p.get(k, ""), 200) for k in ("name", "email", "phone", "company"))
    form = form_tag(p.get("source"))
    what = clean(p.get("topic") or form, 80)
    skip = SKIP | ({"scope_summary"} if any(p.get(k) for k in QUOTE_FIELDS) else set())  # summary repeats them
    lines = [f"{LABELS.get(k, k.replace('_', ' ').capitalize())}: {clean(v)}"
             for k, v in p.items() if k not in skip and str(v).strip()]
    lines = [part for line in lines for part in line.split("\n") if part.strip()]
    # one at a time: parallel calls trip odoo.com's rate limit (429)
    tag_web, tag_form = find_or_create("crm.tag", "Website"), find_or_create("crm.tag", "Web form: " + form)
    paid = any(AD_CLICK.search(str(p.get(k, ""))) for k in ("landing", "page"))
    source = find_or_create("utm.source", "Paid Ads" if paid else "Website")
    medium = find_or_create("utm.medium", MEDIUM_NAME)
    team = lookup("crm.team", [["name", "=", DEPARTMENT]])
    vals = {
        "type": "lead",
        "user_id": False,                                  # a salesperson, if any, is set last (see below)
        "team_id": team,
        "name": f"Website: {what} - {company or name or email}"[:200],
        "contact_name": name, "partner_name": company, "email_from": email, "phone": phone,
        "description": "".join(f"<p>{html.escape(line)}</p>" for line in lines),  # html field: one line per field
        "tag_ids": [[6, 0, [tag_web, tag_form]]],
        "source_id": source,
        "medium_id": medium,
    }
    if form == "Discovery call booking" and email:
        # Odoo's appointment app files the booking itself: enrich that opportunity instead of adding a second lead
        def after():
            found = booking_lead(email)
            if found:
                upd = {k: v for k, v in vals.items() if k in ("partner_name", "tag_ids", "source_id", "medium_id") and v}
                if vals["team_id"]:
                    upd["team_id"] = vals["team_id"]
                rpc("crm.lead", "write", ids=[found], vals=upd)
                rpc("crm.lead", "message_post", ids=[found], body_is_html=True, message_type="comment",
                    subtype_xmlid="mail.mt_note",
                    body="<p>Booking form details:</p><ul>" + "".join(f"<li>{html.escape(l)}</li>" for l in lines) + "</ul>")
                lead = found
            else:                                          # not visible to the API user: file it as a lead of its own
                lead = rpc("crm.lead", "create", vals_list=[vals])[0]
            keep_typed(lead, name, phone)
            follow_up(lead, form, name, email, phone, company, lines)
        return None, after
    lead = rpc("crm.lead", "create", vals_list=[vals])[0]

    def after():
        keep_typed(lead, name, phone)
        follow_up(lead, form, name, email, phone, company, lines)
    return lead, after


def follow_up(lead, form, name, email, phone, company, lines):
    """The @Jeric note + emails (and a salesperson, if set). Runs after the visitor has their answer."""
    people, copies = partners(NOTIFY_EMAILS), partners(COPY_EMAILS)
    if people or copies:                                   # @mention Jeric; Jeric + copies get the details by email
        at = " ".join(f'<a href="/odoo/res.partner/{p["id"]}" class="o_mail_redirect" data-oe-id="{p["id"]}" '
                      f'data-oe-model="res.partner">@{html.escape(p["name"])}</a> ({html.escape(p["email"])})'
                      for p in people)
        who = html.escape(f"{company or name} ({email or phone})")
        details = "".join(f"<li>{html.escape(line)}</li>" for line in lines)
        rpc("crm.lead", "message_post", ids=[lead], partner_ids=list({p["id"] for p in people + copies}),
            message_type="comment", subtype_xmlid="mail.mt_comment", body_is_html=True,
            context={"mail_notify_author": True},          # the copy goes to Rico, who is also the API user
            body=f"<p>{at} New website lead from the {html.escape(form)}: {who}. Please follow up.</p><ul>{details}</ul>")
    # salesperson last: the API user may only see its own / unassigned leads, so it hands the lead over at the end
    if SALESPERSON:
        try:
            user = lookup("res.users", [["login", "=ilike", SALESPERSON]])
            if user:
                rpc("crm.lead", "write", ids=[lead], vals={"user_id": user})
        except Exception as e:                             # the lead is filed and Jeric notified either way
            print("salesperson not set:", repr(e)[:300])


class handler(BaseHTTPRequestHandler):
    def _cors(self):
        origin = self.headers.get("Origin", "")
        if origin in CORS_ORIGINS:
            self.send_header("Access-Control-Allow-Origin", origin)
            self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
            self.send_header("Access-Control-Allow-Headers", "Content-Type, Accept")
            self.send_header("Access-Control-Max-Age", "86400")
            self.send_header("Vary", "Origin")

    def do_OPTIONS(self):
        self.send_response(204 if self.headers.get("Origin", "") in CORS_ORIGINS else 403)
        self._cors()
        self.send_header("Content-Length", "0")
        self.end_headers()

    def _send(self, code, obj):
        body = json.dumps(obj).encode()
        self.send_response(code)
        self._cors()
        self.send_header("Content-Type", "application/json")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)
        self.wfile.flush()

    def do_POST(self):
        if self.headers.get("Origin", "") not in ORIGINS + CORS_ORIGINS:
            return self._send(403, {"ok": False, "error": "origin"})
        n = int(self.headers.get("Content-Length") or 0)
        if not 0 < n <= 20000:
            return self._send(413, {"ok": False, "error": "size"})
        try:
            p = json.loads(self.rfile.read(n))
            assert isinstance(p, dict)
        except Exception:
            return self._send(400, {"ok": False, "error": "json"})
        if p.get("_honey"):
            return self._send(200, {"ok": True})            # bots get the normal answer, nothing is filed
        if not re.match(r"[^@\s]+@[^@\s]+\.[^@\s]+$", str(p.get("email", ""))) and not str(p.get("phone", "")).strip():
            return self._send(400, {"ok": False, "error": "contact"})
        if not KEY:
            return self._send(503, {"ok": False, "error": "not configured"})
        try:
            lead, after = make_lead(p)
        except Exception as e:                             # the visitor is shown sales@technext.asia to email instead
            print("odoo lead failed:", repr(e)[:500])
            return self._send(502, {"ok": False, "error": "crm"})
        self._send(200, {"ok": True, "lead": lead})        # the lead is saved: thank the visitor now
        try:
            after()
        except Exception as e:                             # the lead exists; only the note / emails are missing
            print("odoo follow-up failed:", repr(e)[:500])

    def do_GET(self):
        self._send(405, {"ok": False})
