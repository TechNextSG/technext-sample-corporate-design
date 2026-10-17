# -*- coding: utf-8 -*-
"""Company (/company): TechNext itself, drawn as its own world. Not an industry: the workflow is how an ENGAGEMENT runs
between the three offices (Singapore HQ, the Taguig City development and consulting hub, the Ho Chi Minh City AI
engineering hub), so the module carries its own FLOW (what industries.IND holds for an industry page) next to SCENES,
CHIPS and META. Office roles follow sitedata.OFFICES (Taguig = main development and consulting hub; Ho Chi Minh City =
AI engineering). Every record on the scenes is sample data; the team on each project is set per project."""
from vignettes import svg

# the office each station runs from (the route paints its stops in these colours): sg, ph, vn, or all
OFFICE = ["sg", "ph", "ph", "vn", "sg", "all"]

FLOW = {
    "name": "TechNext",
    "hand": "follow the work",
    "flow_title": "One engagement, three offices, one team.",
    "flow_lead": ("Ride the TechNext Line from the first workshop to the hundredth support ticket. Discovery happens with you "
                  "in Singapore, configuration, custom modules and integration run from our Taguig City hub, AI engineers in "
                  "Ho Chi Minh City join when AI is in scope, and the people who set Odoo up train your team and support it."),
    "lab_in": "Who and where", "lab_was": "Instead of", "route_label": "An engagement with TechNext, step by step",
    "flow": [
        {"t": "Discovery", "icon": "search", "h": "We map the process before we propose an app.",
         "p": ("On-site in Singapore or online, we map how orders, stock and money move today, match each step to an Odoo app "
               "and write the scope down. The quotation follows the scope."),
         "odoo": 'Singapore HQ · with consultants from Taguig City · <a href="{{ROOT}}odoo/discovery.html">Discovery</a>',
         "was": "A demo of every app and a guess at the price"},
        {"t": "Configuration", "icon": "layers", "h": "Standard Odoo first, on a staging copy.",
         "p": ("Consultants and developers at our main hub configure standard Odoo on a staging copy of your database and "
               "migrate your products, customers and opening balances into it."),
         "odoo": 'Taguig City · main development and consulting hub · <a href="{{ROOT}}solutions/odoo-erp.html">Odoo ERP</a>',
         "was": "A bespoke system nobody else can maintain"},
        {"t": "Integration", "icon": "plug", "h": "Your bank, gateway and store, connected.",
         "p": ("Banks, payment gateways, online stores and the tools you keep are connected, and custom modules are built only "
               "where your process genuinely differs, so nobody re-types between systems."),
         "odoo": 'Taguig City developers · <a href="{{ROOT}}odoo/integration.html">Integration</a>',
         "was": "Copying orders and payments between systems by hand"},
        {"t": "AI", "app": "ai_app", "h": "AI engineering, when AI is in scope.",
         "p": ("Our AI engineers build agents and workflow automation, knowledge assistants that answer from your own documents, "
               "and chatbots, often connected to Odoo."),
         "odoo": 'Ho Chi Minh City · AI engineering hub · <a href="{{ROOT}}odoo/ai-integration.html">AI Integration</a>',
         "was": "Staff searching shared drives for the right answer"},
        {"t": "Training", "icon": "graduation", "h": "Each team learns its own screens.",
         "p": ("Training runs on a copy of your data, team by team, with a quick-reference guide for every task, in person in "
               "Singapore or online."),
         "odoo": 'The consultants who configured it · <a href="{{ROOT}}odoo/training.html">Training</a>',
         "was": "One long demo for everyone, then a thick manual"},
        {"t": "Support", "icon": "lifebuoy", "h": "The same team after go-live.",
         "p": ("Fixes, month-end help, upgrades and small changes are handled by the team that configured your system, from "
               "all three offices on one support channel."),
         "odoo": 'All three offices, one channel · <a href="{{ROOT}}odoo/support.html">Support</a>',
         "was": "A ticket queue that has never seen your setup"},
    ],
}

CHIPS = [
    ("icon:search", "Scope v1 · 14 steps mapped to 6 apps"),
    ("icon:layers", "Staging copy · 1,240 products imported"),
    ("icon:plug", "Bank feed · payment gateway · online store"),
    ("ai_app", "Knowledge assistant · answers from 38 SOPs"),
    ("icon:graduation", "Sales team · 9 people · quick-reference guide"),
    ("icon:lifebuoy", "Ticket #0042 · month-end bank reconciliation"),
]

META = {
    "page": "company.html",
    "tag": "TechNext · one team across three offices",
    "note": "Illustration · sample records · the team is set per project",
    "badge": "co-about",
    "intro_title": "Inside <b>TechNext</b>",
    "intro_sub": "Singapore · Taguig City · Ho Chi Minh City",
    "intro_pills": [("pin", "Singapore HQ"), ("pin", "Taguig City"), ("pin", "Ho Chi Minh City")],
    "m": {
        "intro": ("Odoo Ready Partner headquartered in Singapore, with our main development and consulting hub in Taguig City "
                  "and an AI engineering hub in Ho Chi Minh City."),
        "flow": "Discovery in Singapore, build in Taguig City, AI in Ho Chi Minh City, one team for support.",
    },
}


def pin(x, y, office, label):
    """An office tag on a scene: a coloured dot and the office name."""
    w = 18 + len(label) * 6.6
    return (f'<g class="v-d1"><rect x="{x}" y="{y}" width="{w:.0f}" height="24" rx="12" class="f-white v-card"/>'
            f'<circle cx="{x + 13}" cy="{y + 12}" r="5" class="f-{office}"/><text x="{x + 24}" y="{y + 16}" class="t-ink t-xs t-b">{label}</text></g>')


SCENES = [
    # 1 Discovery: the whiteboard process map; each step matched to an Odoo app; the scope is agreed
    svg(f'''
<g class="v-in-up">
  <rect x="22" y="20" width="330" height="200" rx="12" class="f-white v-card"/><rect x="22" y="20" width="330" height="6" rx="3" class="f-sg"/>
  <text x="40" y="50" class="t-ink t-s t-b">How an order moves today</text>
  <g class="v-line" style="--i:1"><rect x="40" y="70" width="70" height="56" rx="4" class="f-note-y"/><text x="75" y="96" text-anchor="middle" class="t-ink t-xs t-b">Quote</text><text x="75" y="113" text-anchor="middle" class="t-mut t-xs">Excel</text></g>
  <g class="v-line" style="--i:2"><rect x="120" y="70" width="70" height="56" rx="4" class="f-note-p"/><text x="155" y="96" text-anchor="middle" class="t-ink t-xs t-b">Order</text><text x="155" y="113" text-anchor="middle" class="t-mut t-xs">email</text></g>
  <g class="v-line" style="--i:3"><rect x="200" y="70" width="70" height="56" rx="4" class="f-note-g"/><text x="235" y="96" text-anchor="middle" class="t-ink t-xs t-b">Deliver</text><text x="235" y="113" text-anchor="middle" class="t-mut t-xs">stock app</text></g>
  <g class="v-line" style="--i:4"><rect x="280" y="70" width="58" height="56" rx="4" class="f-note-b"/><text x="309" y="96" text-anchor="middle" class="t-ink t-xs t-b">Bill</text><text x="309" y="113" text-anchor="middle" class="t-mut t-xs">re-keyed</text></g>
  <path d="M110 98h10M190 98h10M270 98h10" class="s-ink"/>
  <g class="v-d4"><circle cx="75" cy="160" r="15" class="f-sale"/><circle cx="155" cy="160" r="15" class="f-sale"/><circle cx="235" cy="160" r="15" class="f-stock"/><circle cx="309" cy="160" r="15" class="f-acc"/>
  <text x="75" y="198" text-anchor="middle" class="t-mut t-xs t-b">Sales</text><text x="155" y="198" text-anchor="middle" class="t-mut t-xs t-b">Sales</text><text x="235" y="198" text-anchor="middle" class="t-mut t-xs t-b">Inventory</text><text x="309" y="198" text-anchor="middle" class="t-mut t-xs t-b">Accounting</text>
  <path d="M75 128v16M155 128v16M235 128v16M309 128v16" class="s-dash"/></g>
</g>
<g class="v-in-r">
  <rect x="368" y="40" width="130" height="164" rx="12" class="f-white v-card"/><text x="384" y="66" class="t-mut t-xs t-b">SCOPE · V1</text>
  <g class="v-line" style="--i:1"><rect x="384" y="80" width="98" height="8" rx="4" class="f-chip"/></g><g class="v-line" style="--i:2"><rect x="384" y="96" width="80" height="8" rx="4" class="f-chip"/></g><g class="v-line" style="--i:3"><rect x="384" y="112" width="92" height="8" rx="4" class="f-chip"/></g>
  <text x="384" y="144" class="t-ink t-xs t-b">14 steps · 6 apps</text>
  <g class="v-stamp"><rect x="390" y="158" width="86" height="30" rx="6" class="f-none s-green-f"/><text x="433" y="178" text-anchor="middle" class="t-green t-xs t-b">AGREED</text></g>
</g>
{pin(368, 214, "sg", "Singapore HQ")}
<g class="v-d6"><rect x="22" y="246" width="476" height="44" rx="22" class="f-ink"/><text x="46" y="273" class="t-w t-s t-b">The quotation follows the scope</text></g>
''', "Discovery"),
    # 2 Configuration: a staging database; the apps switch on one by one; the import runs
    svg(f'''
<g class="v-in-up">
  <rect x="22" y="18" width="476" height="210" rx="14" class="f-white v-card"/>
  <rect x="22" y="18" width="476" height="30" rx="14" class="f-chip"/><rect x="22" y="34" width="476" height="14" class="f-chip"/>
  <circle cx="42" cy="33" r="4" class="f-coral"/><circle cx="56" cy="33" r="4" class="f-amber"/><circle cx="70" cy="33" r="4" class="f-green"/>
  <rect x="90" y="25" width="250" height="16" rx="8" class="f-white"/><text x="102" y="37" class="t-mut t-xs">staging.yourcompany.odoo.com</text>
  <rect x="404" y="24" width="80" height="18" rx="9" class="f-amber"/><text x="444" y="37" text-anchor="middle" class="t-ink t-xs t-b">STAGING</text>
  <g class="v-line" style="--i:1"><rect x="44" y="64" width="104" height="70" rx="10" class="f-chip"/><circle cx="72" cy="92" r="14" class="f-sale"/><text x="96" y="97" class="t-ink t-xs t-b">Sales</text><g class="v-knob"><rect x="62" y="114" width="34" height="12" rx="6" class="f-ph"/><circle cx="90" cy="120" r="5" class="f-white"/></g></g>
  <g class="v-line" style="--i:2"><rect x="160" y="64" width="104" height="70" rx="10" class="f-chip"/><circle cx="188" cy="92" r="14" class="f-stock"/><text x="208" y="97" class="t-ink t-xs t-b">Inventory</text><g class="v-knob"><rect x="178" y="114" width="34" height="12" rx="6" class="f-ph"/><circle cx="206" cy="120" r="5" class="f-white"/></g></g>
  <g class="v-line" style="--i:3"><rect x="276" y="64" width="104" height="70" rx="10" class="f-chip"/><circle cx="304" cy="92" r="14" class="f-acc"/><text x="322" y="97" class="t-ink t-xs t-b">Accounting</text><g class="v-knob"><rect x="294" y="114" width="34" height="12" rx="6" class="f-ph"/><circle cx="322" cy="120" r="5" class="f-white"/></g></g>
  <g class="v-line" style="--i:4"><rect x="392" y="64" width="90" height="70" rx="10" class="f-chip"/><circle cx="418" cy="92" r="14" class="f-buy"/><text x="436" y="97" class="t-ink t-xs t-b">Purchase</text><rect x="410" y="114" width="34" height="12" rx="6" class="f-line"/><circle cx="416" cy="120" r="5" class="f-white"/></g>
  <text x="44" y="166" class="t-mut t-xs t-b">IMPORT · PRODUCTS</text><text x="476" y="166" text-anchor="end" class="t-ink t-xs t-b">1,240 / 1,240</text>
  <rect x="44" y="176" width="432" height="12" rx="6" class="f-chip"/><rect x="44" y="176" width="432" height="12" rx="6" class="f-ph v-hbar" style="--v:1"/>
  <text x="44" y="212" class="t-mut t-xs">Customers 318 · Vendors 74 · Opening balances</text>
</g>
{pin(22, 240, "ph", "Taguig City hub")}
<g class="v-d6"><rect x="196" y="240" width="302" height="50" rx="25" class="f-ink"/><text x="347" y="270" text-anchor="middle" class="t-w t-s t-b">Configuration before code</text></g>
''', "Configuration"),
    # 3 Integration: Odoo in the middle; the bank, the payment gateway, the online store and a custom module plug in
    svg(f'''
<g class="v-in-up">
  <circle cx="260" cy="124" r="52" class="f-white v-card"/><circle cx="260" cy="124" r="40" class="f-odoo"/><text x="260" y="130" text-anchor="middle" class="t-w t-s t-b">Odoo</text>
</g>
<path d="M112 70 L214 104M408 70 L306 104M112 186 L214 146M408 186 L306 146" class="s-dash v-d3"/>
<g class="v-in-l"><rect x="22" y="40" width="112" height="56" rx="12" class="f-white v-card"/><circle cx="46" cy="68" r="12" class="f-ph"/><text x="64" y="66" class="t-ink t-xs t-b">Bank feed</text><text x="64" y="82" class="t-mut t-xs">statements</text></g>
<g class="v-in-r"><rect x="386" y="40" width="112" height="56" rx="12" class="f-white v-card"/><circle cx="410" cy="68" r="12" class="f-amber"/><text x="428" y="66" class="t-ink t-xs t-b">Gateway</text><text x="428" y="82" class="t-mut t-xs">card payments</text></g>
<g class="v-in-l v-d1"><rect x="22" y="158" width="112" height="56" rx="12" class="f-white v-card"/><circle cx="46" cy="186" r="12" class="f-sale"/><text x="64" y="184" class="t-ink t-xs t-b">Online store</text><text x="64" y="200" class="t-mut t-xs">orders in</text></g>
<g class="v-in-r v-d1"><rect x="386" y="158" width="112" height="56" rx="12" class="f-white v-card"/><circle cx="410" cy="186" r="12" class="f-vn"/><text x="428" y="184" class="t-ink t-xs t-b">Custom</text><text x="428" y="200" class="t-mut t-xs">module</text></g>
<g class="v-glide"><circle cx="160" cy="88" r="6" class="f-ph"/></g>
{pin(22, 240, "ph", "Taguig City hub")}
<g class="v-d6"><rect x="196" y="240" width="302" height="50" rx="25" class="f-ink"/><text x="347" y="270" text-anchor="middle" class="t-w t-s t-b">Nobody re-types an order</text></g>
''', "Integration"),
    # 4 AI: a knowledge assistant answers from the company's own documents and Odoo records
    svg(f'''
<g class="v-in-up">
  <rect x="22" y="18" width="330" height="210" rx="14" class="f-white v-card"/><rect x="22" y="18" width="330" height="36" rx="14" class="f-vn"/><rect x="22" y="40" width="330" height="14" class="f-vn"/>
  <text x="40" y="42" class="t-w t-s t-b">Knowledge assistant</text>
  <g class="v-line" style="--i:1"><rect x="150" y="68" width="186" height="44" rx="12" class="f-chip"/><text x="162" y="87" class="t-ink t-xs t-b">How do we return a</text><text x="162" y="103" class="t-ink t-xs t-b">damaged delivery?</text></g>
  <g class="v-line" style="--i:3"><rect x="38" y="122" width="232" height="62" rx="12" class="f-vn-l"/><text x="50" y="142" class="t-ink t-xs t-b">Log a return on the delivery,</text><text x="50" y="158" class="t-ink t-xs t-b">photo attached, within 7 days.</text>
  <text x="50" y="176" class="t-mut t-xs">From: SOP-12 Returns · sample</text></g>
  <g class="v-d5"><circle cx="50" cy="206" r="5" class="f-vn"/><circle cx="66" cy="206" r="5" class="f-vn"/><circle cx="82" cy="206" r="5" class="f-vn"/></g>
</g>
<g class="v-in-r">
  <rect x="368" y="40" width="130" height="164" rx="12" class="f-white v-card"/><text x="384" y="64" class="t-mut t-xs t-b">ANSWERS FROM</text>
  <g class="v-line" style="--i:1"><rect x="384" y="76" width="98" height="28" rx="6" class="f-chip"/><text x="394" y="95" class="t-ink t-xs t-b">38 SOPs</text></g>
  <g class="v-line" style="--i:2"><rect x="384" y="112" width="98" height="28" rx="6" class="f-chip"/><text x="394" y="131" class="t-ink t-xs t-b">Odoo records</text></g>
  <g class="v-line" style="--i:3"><rect x="384" y="148" width="98" height="28" rx="6" class="f-chip"/><text x="394" y="167" class="t-ink t-xs t-b">Price lists</text></g>
</g>
{pin(22, 240, "vn", "Ho Chi Minh City hub")}
<g class="v-d6"><rect x="236" y="240" width="262" height="50" rx="25" class="f-ink"/><text x="367" y="270" text-anchor="middle" class="t-w t-s t-b">Answers from your own data</text></g>
''', "AI"),
    # 5 Training: the sales team on its own screens, on a copy of its own data, with a quick-reference guide
    svg(f'''
<g class="v-in-up">
  <rect x="22" y="18" width="300" height="174" rx="12" class="f-ink"/><rect x="32" y="28" width="280" height="154" rx="6" class="f-white"/>
  <text x="46" y="52" class="t-ink t-s t-b">Sales · quote to invoice</text><text x="46" y="70" class="t-mut t-xs">Training copy of your data</text>
  <g class="v-line" style="--i:1"><rect x="46" y="84" width="74" height="40" rx="8" class="f-sale"/><text x="83" y="109" text-anchor="middle" class="t-w t-xs t-b">Quote</text></g>
  <g class="v-line" style="--i:2"><rect x="132" y="84" width="74" height="40" rx="8" class="f-stock"/><text x="169" y="109" text-anchor="middle" class="t-w t-xs t-b">Deliver</text></g>
  <g class="v-line" style="--i:3"><rect x="218" y="84" width="80" height="40" rx="8" class="f-acc"/><text x="258" y="109" text-anchor="middle" class="t-w t-xs t-b">Invoice</text></g>
  <rect x="46" y="140" width="252" height="10" rx="5" class="f-chip"/><rect x="46" y="140" width="252" height="10" rx="5" class="f-sg v-hbar" style="--v:.66"/><text x="46" y="170" class="t-mut t-xs">Exercise 2 of 3</text>
  <path d="M160 192v18M120 210h80" class="s-ink"/>
</g>
<g class="v-in-r">
  <rect x="342" y="26" width="156" height="184" rx="10" class="f-white v-card"/><rect x="342" y="26" width="156" height="30" rx="10" class="f-amber"/><rect x="342" y="44" width="156" height="12" class="f-amber"/>
  <text x="356" y="46" class="t-ink t-xs t-b">QUICK GUIDE</text>
  <g class="v-line" style="--i:1"><circle cx="362" cy="78" r="7" class="f-green"/><text x="376" y="82" class="t-ink t-xs t-b">New quotation</text></g>
  <g class="v-line" style="--i:2"><circle cx="362" cy="106" r="7" class="f-green"/><text x="376" y="110" class="t-ink t-xs t-b">Confirm order</text></g>
  <g class="v-line" style="--i:3"><circle cx="362" cy="134" r="7" class="f-green"/><text x="376" y="138" class="t-ink t-xs t-b">Check stock</text></g>
  <g class="v-line" style="--i:4"><circle cx="362" cy="162" r="7" class="f-line"/><text x="376" y="166" class="t-ink t-xs t-b">Create invoice</text></g>
</g>
{pin(22, 240, "sg", "Singapore · or online")}
<g class="v-d6"><rect x="236" y="240" width="262" height="50" rx="25" class="f-ink"/><text x="367" y="270" text-anchor="middle" class="t-w t-s t-b">9 people · their own screens</text></g>
''', "Training"),
    # 6 Support: one ticket, one channel, the three offices behind it
    svg(f'''
<g class="v-in-up">
  <rect x="22" y="20" width="300" height="180" rx="12" class="f-white v-card"/><text x="40" y="46" class="t-mut t-xs t-b">TICKET #0042 · SAMPLE</text>
  <text x="40" y="72" class="t-ink t-s t-b">Month-end: bank</text><text x="40" y="92" class="t-ink t-s t-b">reconciliation help</text>
  <g class="v-line" style="--i:1"><rect x="40" y="110" width="64" height="24" rx="12" class="f-chip"/><text x="72" y="126" text-anchor="middle" class="t-mut t-xs t-b">New</text></g>
  <g class="v-line" style="--i:2"><rect x="112" y="110" width="84" height="24" rx="12" class="f-chip"/><text x="154" y="126" text-anchor="middle" class="t-mut t-xs t-b">In progress</text></g>
  <g class="v-paid"><rect x="204" y="110" width="102" height="24" rx="12" class="f-green"/><text x="255" y="126" text-anchor="middle" class="t-w t-xs t-b">Solved</text></g>
  <text x="40" y="164" class="t-mut t-xs">Answered by the consultant who</text><text x="40" y="180" class="t-mut t-xs">configured your Accounting</text>
</g>
<g class="v-in-r">
  <rect x="342" y="20" width="156" height="180" rx="12" class="f-white v-card"/><text x="358" y="44" class="t-mut t-xs t-b">ONE CHANNEL</text>
  <g class="v-line" style="--i:1"><circle cx="366" cy="72" r="10" class="f-sg"/><text x="384" y="77" class="t-ink t-xs t-b">Singapore</text></g>
  <g class="v-line" style="--i:2"><circle cx="366" cy="108" r="10" class="f-ph"/><text x="384" y="113" class="t-ink t-xs t-b">Taguig City</text></g>
  <g class="v-line" style="--i:3"><circle cx="366" cy="144" r="10" class="f-vn"/><text x="384" y="149" class="t-ink t-xs t-b">Ho Chi Minh</text></g>
  <path d="M366 82v16M366 118v16" class="s-dash"/><text x="358" y="182" class="t-mut t-xs">Same team, every ticket</text>
</g>
<g class="v-d6"><rect x="22" y="236" width="476" height="54" rx="27" class="f-ink"/><text x="260" y="268" text-anchor="middle" class="t-w t-s t-b">Fixes · month-end · upgrades · small changes</text></g>
''', "Support"),
]
