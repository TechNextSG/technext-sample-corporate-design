# -*- coding: utf-8 -*-
"""Ecommerce (Parcel Lane, a sample online shop): one order from checkout to payout. The workflow has a sample picker: an
order from the web store, from Marketplace A or from Marketplace B; every [data-v] text and [data-vbar] bar in the scenes
and the sample records follows the picked order. All figures are sample figures and add up: the total is quantity x the
S$ 24.90 mug, the payout is the total less the channel's fee (3% card fee on the web store, 10% and 8% marketplace
commission), the restock order tops the stock up to the suggested maximum."""
from vignettes import svg

SAMPLES = {
    "web": {"ch": "Web store", "no": "#1042", "qty": "2", "total": "S$ 49.80", "pay": "Card", "fee": "S$ 1.49", "fee_l": "Card fee 3%", "payout": "S$ 48.31",
            "track": "PL1042SG", "wh": "WH/OUT/1042", "stock": "86 → 84", "rep_sales": "S$ 18,400", "rep_margin": "41%", "rep_v": "0.41"},
    "mka": {"ch": "Marketplace A", "no": "#A-5531", "qty": "1", "total": "S$ 24.90", "pay": "Marketplace", "fee": "S$ 2.49", "fee_l": "Commission 10%", "payout": "S$ 22.41",
            "track": "PL5531SG", "wh": "WH/OUT/1043", "stock": "84 → 83", "rep_sales": "S$ 12,600", "rep_margin": "29%", "rep_v": "0.29"},
    "mkb": {"ch": "Marketplace B", "no": "#B-2208", "qty": "3", "total": "S$ 74.70", "pay": "Marketplace", "fee": "S$ 5.98", "fee_l": "Commission 8%", "payout": "S$ 68.72",
            "track": "PL2208SG", "wh": "WH/OUT/1044", "stock": "83 → 80", "rep_sales": "S$ 8,300", "rep_margin": "24%", "rep_v": "0.24"},
}
D = SAMPLES["web"]


def v(field: str) -> str:
    """the default (web store) value of a field, wrapped so the picker can swap it"""
    return f'<tspan data-v="{field}">{D[field]}</tspan>'


def box(x, y, w, h, cls="f-kraft"):
    """a parcel: kraft card, a darker flap and a strip of tape"""
    return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="4" class="{cls}"/><rect x="{x}" y="{y}" width="{w}" height="{h * .2:.0f}" rx="3" class="f-kraft-d"/>'
            f'<rect x="{x + w / 2 - 5:.0f}" y="{y}" width="10" height="{h}" class="f-tape"/>')


def bars(x, y, n=14, h=26):
    """a barcode"""
    return "".join(f'<rect x="{x + i * 4.2:.1f}" y="{y}" width="{2.6 if i % 3 else 1.4}" height="{h}" class="f-ink"/>' for i in range(n))


SCENES = [
    # 1 Order: orders from the web store and two marketplaces land in one list, each reserving stock
    svg(f'''
<g class="v-in-l">
  <rect x="22" y="26" width="150" height="54" rx="12" class="f-white v-card"/><circle cx="46" cy="53" r="13" class="f-violet"/><path d="M40 48h12l-2 9h-8zM43 60a1.6 1.6 0 1 0 0 .1M49 60a1.6 1.6 0 1 0 0 .1" class="s-white s-thin"/><text x="66" y="50" class="t-ink t-s t-b">Web store</text><text x="66" y="67" class="t-mut t-xs">#1042</text>
  <rect x="22" y="92" width="150" height="54" rx="12" class="f-white v-card"/><circle cx="46" cy="119" r="13" class="f-orange"/><path d="M40 113h12v12h-12zM43 113v-3h6v3" class="s-white s-thin"/><text x="66" y="116" class="t-ink t-s t-b">Marketplace A</text><text x="66" y="133" class="t-mut t-xs">#A-5531</text>
  <rect x="22" y="158" width="150" height="54" rx="12" class="f-white v-card"/><circle cx="46" cy="185" r="13" class="f-mint-d"/><path d="M40 179h12v12h-12zM43 179v-3h6v3" class="s-white s-thin"/><text x="66" y="182" class="t-ink t-s t-b">Marketplace B</text><text x="66" y="199" class="t-mut t-xs">#B-2208</text>
</g>
<path d="M174 53c26 0 26 66 46 66M174 119h46M174 185c26 0 26-66 46-66" class="s-dash v-d1"/>
<g class="v-in-r">
  <rect x="222" y="22" width="274" height="196" rx="14" class="f-white v-card"/>
  <rect x="222" y="22" width="274" height="40" rx="14" class="f-violet"/><rect x="222" y="46" width="274" height="16" class="f-violet"/><text x="238" y="48" class="t-w t-b">Sales orders · one list</text>
  <g class="v-line" style="--i:0"><rect x="236" y="74" width="246" height="38" rx="8" class="f-lilac"/><circle cx="252" cy="93" r="6" class="f-violet"/><text x="266" y="98" class="t-ink t-xs t-b">#1042</text><text x="326" y="98" class="t-mut t-xs">Web store</text><text x="470" y="98" text-anchor="end" class="t-green t-xs t-b">Reserved</text></g>
  <g class="v-line" style="--i:1"><rect x="236" y="120" width="246" height="38" rx="8" class="f-lilac"/><circle cx="252" cy="139" r="6" class="f-orange"/><text x="266" y="144" class="t-ink t-xs t-b">#A-5531</text><text x="326" y="144" class="t-mut t-xs">Marketplace A</text><text x="470" y="144" text-anchor="end" class="t-green t-xs t-b">Reserved</text></g>
  <g class="v-line" style="--i:2"><rect x="236" y="166" width="246" height="38" rx="8" class="f-lilac"/><circle cx="252" cy="185" r="6" class="f-mint-d"/><text x="266" y="190" class="t-ink t-xs t-b">#B-2208</text><text x="326" y="190" class="t-mut t-xs">Marketplace B</text><text x="470" y="190" text-anchor="end" class="t-green t-xs t-b">Reserved</text></g>
</g>
<g class="v-d6"><rect x="22" y="238" width="474" height="50" rx="25" class="f-ink"/><text x="48" y="268" class="t-w t-s t-b">{v("no")} · {v("ch")} · {v("qty")} × Ceramic mug</text>
  <rect x="380" y="249" width="104" height="28" rx="14" class="f-mint"/><text x="432" y="268" text-anchor="middle" class="t-ink t-xs t-b">Stock {v("stock")}</text></g>
''', "Order"),
    # 2 Pay: the payment is captured at checkout, the payout arrives less the fee and is reconciled
    svg(f'''
<g class="v-shadow"><ellipse cx="118" cy="298" rx="76" ry="9"/></g>
<g class="v-in-up">
  <rect x="50" y="22" width="136" height="268" rx="22" class="f-ink"/><rect x="57" y="32" width="122" height="248" rx="15" class="f-white"/>
  <text x="70" y="62" class="t-ink t-s t-b">Checkout</text><text x="70" y="80" class="t-mut t-xs">{v("no")} · {v("ch")}</text>
  <rect x="68" y="92" width="100" height="56" rx="10" class="f-lilac"/>{box(80, 102, 36, 34)}<text x="124" y="118" class="t-ink t-xs t-b">× {v("qty")}</text><text x="124" y="134" class="t-mut t-xs">mug</text>
  <path d="M68 166h100" class="s-line"/><text x="68" y="188" class="t-mut t-xs t-b">TOTAL</text><text x="168" y="188" text-anchor="end" class="t-ink t-xs t-b">{v("total")}</text>
  <g class="v-press v-d3"><rect x="68" y="204" width="100" height="32" rx="16" class="f-violet"/><text x="118" y="225" text-anchor="middle" class="t-w t-xs t-b">Pay now</text></g>
  <g class="v-stamp"><rect x="68" y="244" width="100" height="26" rx="13" class="f-green"/><text x="118" y="261" text-anchor="middle" class="t-w t-xs t-b">Captured</text></g>
</g>
<path d="M196 150h26" class="s-arrow v-d3"/>
<g class="v-in-r">
  <rect x="230" y="34" width="266" height="174" rx="14" class="f-white v-card"/>
  <text x="246" y="60" class="t-mut t-xs t-b">PAYOUT · {v("pay")}</text>
  <g class="v-line" style="--i:1"><text x="246" y="90" class="t-ink t-xs">Order {v("no")}</text><text x="480" y="90" text-anchor="end" class="t-ink t-xs t-b">{v("total")}</text></g>
  <g class="v-line" style="--i:2"><text x="246" y="114" class="t-ink t-xs">{v("fee_l")}</text><text x="480" y="114" text-anchor="end" class="t-red t-xs t-b">− {v("fee")}</text></g>
  <path d="M246 128h234" class="s-line"/>
  <g class="v-line" style="--i:3"><text x="246" y="156" class="t-ink t-s t-b">Payout</text><text x="480" y="156" text-anchor="end" class="t-violet t-s t-b">{v("payout")}</text></g>
  <rect x="246" y="172" width="120" height="22" rx="11" class="f-violet-l"/><text x="306" y="187" text-anchor="middle" class="t-violet t-xs t-b">Fee booked</text>
</g>
<g class="v-match"><rect x="230" y="226" width="266" height="54" rx="27" class="f-white v-card"/><circle cx="258" cy="253" r="14" class="f-green"/><path d="M251 253l5 5 9-10" class="s-white"/><text x="282" y="258" class="t-ink t-s t-b">Reconciled in Accounting</text></g>
''', "Pay"),
    # 3 Ship: pick by barcode, pack, the courier label prints from the delivery order, tracking goes out
    svg(f'''
<g class="v-in-up">
  <rect x="22" y="24" width="168" height="186" rx="14" class="f-white v-card"/>
  <text x="38" y="50" class="t-mut t-xs t-b">PICK · {v("wh")}</text>
  <rect x="38" y="62" width="136" height="42" rx="8" class="f-lilac"/><rect x="48" y="72" width="22" height="22" rx="4" class="f-violet"/><text x="80" y="82" class="t-ink t-xs t-b">Ceramic mug</text><text x="80" y="97" class="t-mut t-xs">Bin A-04 · × {v("qty")}</text>
  <g class="v-d3"><circle cx="160" cy="83" r="10" class="f-green"/><path d="M155 83l3 3 6-7" class="s-white"/></g>
  <rect x="38" y="116" width="136" height="80" rx="8" class="f-chip"/>{bars(52, 128, 24, 40)}<text x="106" y="186" text-anchor="middle" class="t-mut t-xs">scan to pick</text>
</g>
<path class="v-waves" d="M190 150h40" stroke="#E0456B" stroke-width="3" stroke-linecap="round"/>
<g class="v-in-up">{box(238, 108, 116, 96)}</g>
<g class="v-receipt"><rect x="262" y="52" width="230" height="122" rx="8" class="f-white v-card"/>
  <rect x="262" y="52" width="230" height="22" rx="8" class="f-ink"/><rect x="262" y="64" width="230" height="10" class="f-ink"/><text x="276" y="68" class="t-w t-xs t-b">COURIER LABEL</text>
  <text x="276" y="96" class="t-ink t-xs t-b">Ship to: A. Tan, Singapore</text><text x="276" y="114" class="t-mut t-xs">From: Parcel Lane · sample</text>
  {bars(276, 124, 26, 30)}<text x="400" y="146" class="t-ink t-xs t-b">{v("track")}</text>
</g>
<g class="v-d6"><rect x="22" y="236" width="474" height="50" rx="25" class="f-violet"/><path d="M48 260l16-9v18zM64 260h12" class="s-white"/><text x="88" y="266" class="t-w t-s t-b">Tracking {v("track")} sent to the customer</text></g>
''', "Ship"),
    # 4 Restock: Odoo 20 suggests the min and max from demand, the reordering rule raises the purchase order in time
    svg(f'''
<g class="v-in-up">
  <rect x="22" y="22" width="292" height="196" rx="14" class="f-white v-card"/>
  <text x="38" y="48" class="t-ink t-s t-b">Ceramic mug · forecast</text><text x="298" y="48" text-anchor="end" class="t-mut t-xs">units</text>
  <path d="M40 186h258" class="s-line"/><path d="M40 156h258" stroke="#F08A5D" stroke-width="2" stroke-dasharray="6 5" fill="none"/><text x="298" y="150" text-anchor="end" class="t-orange t-xs t-b">min 40</text>
  <path d="M40 76h258" stroke="#6D5BD0" stroke-width="2" stroke-dasharray="6 5" fill="none"/><text x="298" y="70" text-anchor="end" class="t-violet t-xs t-b">max 120</text>
  <path class="v-sign" d="M44 92l36 12 30 18 32 10 30 16 28 10" stroke="#2B2350" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <g class="v-d5"><path d="M200 158l28 -82 40 0" stroke="#22A88A" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="5 5"/><circle cx="200" cy="158" r="6" class="f-orange"/></g>
  <rect x="38" y="196" width="168" height="16" rx="8" class="f-violet-l"/><text x="46" y="208" class="t-violet t-xs t-b">Odoo 20 · suggested levels</text>
</g>
<path d="M318 120h18" class="s-arrow v-d3"/>
<g class="v-in-r">
  <rect x="340" y="40" width="156" height="166" rx="14" class="f-white v-card"/>
  <rect x="340" y="40" width="156" height="36" rx="14" class="f-mint-d"/><rect x="340" y="62" width="156" height="14" class="f-mint-d"/><text x="356" y="64" class="t-w t-s t-b">PO00231</text>
  <text x="356" y="100" class="t-ink t-xs t-b">Kiln &amp; Co.</text><text x="356" y="118" class="t-mut t-xs">Lead time 4 days</text>
  {box(356, 132, 40, 32)}<text x="404" y="148" class="t-ink t-xs t-b">80 × mug</text><text x="404" y="164" class="t-mut t-xs">to max 120</text>
  <rect x="356" y="176" width="124" height="20" rx="10" class="f-chip"/><text x="418" y="190" text-anchor="middle" class="t-ink t-xs t-b">Reordering rule</text>
</g>
<g class="v-stamp"><rect x="96" y="244" width="328" height="44" rx="22" class="f-ink"/><path d="M122 266l5 5 9-10" class="s-white"/><text x="146" y="271" class="t-w t-s t-b">Ordered before it runs out</text></g>
''', "Restock"),
    # 5 Support: an email becomes a ticket; the return starts from the delivery; the refund posts
    svg(f'''
<g class="v-in-l">
  <rect x="22" y="28" width="196" height="82" rx="16" class="f-white v-card"/><path d="M48 110l-8 14 22-14z" class="f-white"/>
  <circle cx="44" cy="52" r="11" class="f-orange"/><path d="M38 48h12v8h-12zM38 48l6 5 6-5" class="s-white s-thin"/><text x="62" y="56" class="t-ink t-xs t-b">A. Tan · email</text>
  <text x="38" y="80" class="t-ink t-xs">"My mug arrived chipped.</text><text x="38" y="96" class="t-ink t-xs">Can I return it?"</text>
</g>
<path d="M222 70h18" class="s-arrow v-d1"/>
<g class="v-in-r">
  <rect x="246" y="22" width="250" height="122" rx="14" class="f-white v-card"/>
  <rect x="246" y="22" width="250" height="34" rx="14" class="f-mint-d"/><rect x="246" y="42" width="250" height="14" class="f-mint-d"/><text x="262" y="45" class="t-w t-s t-b">Helpdesk · ticket #318</text>
  <text x="262" y="78" class="t-ink t-xs t-b">Return · order {v("no")}</text>
  <rect x="262" y="88" width="80" height="20" rx="10" class="f-violet-l"/><text x="302" y="102" text-anchor="middle" class="t-violet t-xs t-b">In progress</text>
  <circle cx="474" cy="98" r="10" class="f-lilac"/><text x="474" y="102" text-anchor="middle" class="t-ink t-xs t-b">N</text>
  <text x="262" y="132" class="t-mut t-xs">Assigned to Nora · sample</text>
</g>
<g class="v-d3">
  <rect x="22" y="152" width="230" height="74" rx="14" class="f-white v-card"/>
  <text x="38" y="176" class="t-mut t-xs t-b">RETURN FROM {v("wh")}</text>
  {box(38, 186, 34, 30)}<text x="82" y="200" class="t-ink t-xs t-b">1 × Ceramic mug</text><text x="82" y="216" class="t-mut t-xs">Back to stock: no · damaged</text>
</g>
<path d="M258 190h18" class="s-arrow v-d5"/>
<g class="v-d5"><rect x="282" y="160" width="214" height="62" rx="14" class="f-white v-card"/><text x="298" y="184" class="t-mut t-xs t-b">CREDIT NOTE · REFUND</text><text x="298" y="208" class="t-violet t-s t-b">S$ 24.90</text></g>
<g class="v-paid"><rect x="404" y="194" width="78" height="22" rx="11" class="f-green"/><text x="443" y="209" text-anchor="middle" class="t-w t-xs t-b">Posted</text></g>
<g class="v-d6"><rect x="96" y="244" width="328" height="44" rx="22" class="f-ink"/><path d="M122 266l5 5 9-10" class="s-white"/><text x="146" y="271" class="t-w t-s t-b">Solved · customer notified</text></g>
''', "Support"),
    # 6 Report: sales and margin by channel, so you see which channel makes money
    svg(f'''
<g class="v-in-up">
  <rect x="22" y="20" width="474" height="212" rx="16" class="f-white v-card"/>
  <text x="40" y="46" class="t-ink t-b">Sales and margin by channel</text><text x="474" y="46" text-anchor="end" class="t-mut t-xs">Dashboards · sample month</text>
  <path d="M44 196h262" class="s-line"/>
  <rect x="62" y="74" width="48" height="122" rx="6" class="f-violet v-rise" style="--i:0"/><text x="86" y="214" text-anchor="middle" class="t-mut t-xs t-b">Web</text><text x="86" y="68" text-anchor="middle" class="t-ink t-xs t-b">18.4k</text>
  <rect x="146" y="112" width="48" height="84" rx="6" class="f-orange v-rise" style="--i:1"/><text x="170" y="214" text-anchor="middle" class="t-mut t-xs t-b">Mkt A</text><text x="170" y="106" text-anchor="middle" class="t-ink t-xs t-b">12.6k</text>
  <rect x="230" y="141" width="48" height="55" rx="6" class="f-mint-d v-rise" style="--i:2"/><text x="254" y="214" text-anchor="middle" class="t-mut t-xs t-b">Mkt B</text><text x="254" y="135" text-anchor="middle" class="t-ink t-xs t-b">8.3k</text>
  <circle cx="406" cy="124" r="48" class="s-ring-bg"/>
  <g transform="rotate(-90 406 124)"><circle cx="406" cy="124" r="48" class="v-ring" data-vbar="rep_v" style="--v:{D["rep_v"]};stroke:#6D5BD0"/></g>
  <text x="406" y="130" text-anchor="middle" class="t-ink t-b t-big">{v("rep_margin")}</text><text x="406" y="150" text-anchor="middle" class="t-mut t-xs">margin</text>
  <text x="406" y="196" text-anchor="middle" class="t-ink t-xs t-b">{v("ch")}</text>
</g>
<g class="v-d6"><rect x="22" y="246" width="474" height="44" rx="22" class="f-ink"/><text x="48" y="273" class="t-w t-s t-b">{v("ch")} · {v("rep_sales")} sales · {v("rep_margin")} margin</text></g>
''', "Report"),
]

CHIPS = [
    ("website_sale", '<span data-v="no">#1042</span> · <span data-v="ch">Web store</span> · <span data-v="qty">2</span> × Ceramic mug · stock reserved'),
    ("account", '<span data-v="total">S$ 49.80</span> captured · payout <span data-v="payout">S$ 48.31</span> reconciled'),
    ("stock", '<span data-v="wh">WH/OUT/1042</span> · label <span data-v="track">PL1042SG</span> · tracking sent'),
    ("purchase", 'Suggested min 40 · max 120 · PO00231 for 80 mugs'),
    ("helpdesk", 'Ticket #318 · return from <span data-v="wh">WH/OUT/1042</span> · refund S$ 24.90'),
    ("spreadsheet_dashboard", '<span data-v="ch">Web store</span> · <span data-v="rep_sales">S$ 18,400</span> · margin <span data-v="rep_margin">41%</span>'),
]

META = {
    "tag": "Parcel Lane · sample",
    "note": "Parcel Lane is a sample online shop; Marketplace A and B stand for any marketplace. Every name and figure here is sample data.",
    "samples": SAMPLES,
    "pick": {"label": "Sample order", "options": [("web", "Web store"), ("mka", "Marketplace A"), ("mkb", "Marketplace B")]},
    "m": {
        "intro": "Web and marketplace orders, one stock, shipping labels, returns and payouts, in one Odoo database.",
        "flow": "One order, checkout to payout. Pick a sample channel.",
    },
}
