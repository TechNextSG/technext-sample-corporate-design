# -*- coding: utf-8 -*-
"""Travel (Bluewave Journeys, a sample travel agency): a trip from enquiry to margin. The workflow has a sample picker:
Tokyo (family of 4), Bali (couple) and Seoul (group of 6); every [data-v] text and [data-vbar] bar in the scenes and the
sample records follows the picked trip. All figures are sample figures and add up: the quotation lines sum to the total,
the deposit is 30% of it, the cost is total x (1 - margin), the foreign bills convert at the shown rate."""
from vignettes import svg

SAMPLES = {
    "tokyo": {"dest": "Tokyo", "code": "HND", "who": "Family of 4", "nights": "6 nights", "qno": "S0158",
              "l1": "Flights SIN ↔ HND", "a1": "3,480", "l2": "Hotel · 6 nights", "a2": "3,980", "l3": "JR Pass × 4", "a3": "1,320",
              "l4": "Day tours × 2", "a4": "1,060", "extra": "Theme park day", "extra_a": "+ S$ 520", "total": "S$ 9,840", "deposit": "S$ 2,952",
              "s1": "4 seats", "s2": "6 nights", "s3": "4 rail passes", "vendor": "Hotel", "cur": "JPY", "fx_amt": "¥ 412,000", "rate": "113.64",
              "sgd_amt": "S$ 3,625.48", "fxd": "S$ 16.20", "cost": "S$ 8,069", "margin": "18%", "margin_v": "0.18", "cost_w": "0.82"},
    "bali": {"dest": "Bali", "code": "DPS", "who": "Couple", "nights": "5 nights", "qno": "S0163",
             "l1": "Flights SIN ↔ DPS", "a1": "1,120", "l2": "Villa · 5 nights", "a2": "2,350", "l3": "Airport transfers", "a3": "210",
             "l4": "Day tours × 2", "a4": "480", "extra": "Sunset cruise", "extra_a": "+ S$ 180", "total": "S$ 4,160", "deposit": "S$ 1,248",
             "s1": "2 seats", "s2": "5 nights", "s3": "2 transfers", "vendor": "Villa", "cur": "IDR", "fx_amt": "Rp 24,600,000", "rate": "12,060",
             "sgd_amt": "S$ 2,039.80", "fxd": "S$ 9.40", "cost": "S$ 3,286", "margin": "21%", "margin_v": "0.21", "cost_w": "0.79"},
    "seoul": {"dest": "Seoul", "code": "ICN", "who": "Group of 6", "nights": "4 nights", "qno": "S0171",
              "l1": "Flights SIN ↔ ICN", "a1": "4,260", "l2": "Hotel · 4 nights", "a2": "3,180", "l3": "Coach + guide", "a3": "1,440",
              "l4": "Show tickets × 6", "a4": "540", "extra": "Ski day trip", "extra_a": "+ S$ 690", "total": "S$ 9,420", "deposit": "S$ 2,826",
              "s1": "6 seats", "s2": "4 nights", "s3": "Coach + guide", "vendor": "Hotel", "cur": "KRW", "fx_amt": "₩ 2,640,000", "rate": "1,032",
              "sgd_amt": "S$ 2,558.14", "fxd": "S$ 12.10", "cost": "S$ 7,913", "margin": "16%", "margin_v": "0.16", "cost_w": "0.84"},
}
D = SAMPLES["tokyo"]


def v(field: str) -> str:
    """the default (Tokyo) value of a field, wrapped so the picker can swap it"""
    return f'<tspan data-v="{field}">{D[field]}</tspan>'


def ticket(x, y, w, h, cls):
    """a voucher: rounded corners and a half-moon notch in each side"""
    n, r = 9, 10
    return (f'<path class="{cls}" d="M{x + r} {y}h{w - 2 * r}a{r} {r} 0 0 1 {r} {r}v{h / 2 - r - n}a{n} {n} 0 0 0 0 {2 * n}v{h / 2 - r - n}'
            f'a{r} {r} 0 0 1 -{r} {r}h-{w - 2 * r}a{r} {r} 0 0 1 -{r} -{r}v-{h / 2 - r - n}a{n} {n} 0 0 0 0 -{2 * n}v-{h / 2 - r - n}a{r} {r} 0 0 1 {r} -{r}z"/>')


def plane(x, y, cls="f-white"):
    return f'<path class="{cls}" d="M{x + 9} {y - 7}L{x - 9} {y}l6 2 2 6 3 -5z"/>'


SCENES = [
    # 1 Enquire: an enquiry from email, a web form or a chat lands in the CRM pipeline with a follow-up activity
    svg(f'''
<g class="v-in-up">
  <rect x="22" y="40" width="122" height="34" rx="17" class="f-white v-card"/><circle cx="42" cy="57" r="11" class="f-sky"/><path d="M36 53h12v8h-12zM36 53l6 5 6-5" class="s-white s-thin"/><text x="60" y="62" class="t-ink t-s t-b">Email</text>
  <rect x="22" y="84" width="122" height="34" rx="17" class="f-white v-card"/><circle cx="42" cy="101" r="11" class="f-coral"/><path d="M37 97h10M37 101h10M37 105h6" class="s-white s-thin"/><text x="60" y="106" class="t-ink t-s t-b">Web form</text>
  <rect x="22" y="128" width="122" height="34" rx="17" class="f-white v-card"/><circle cx="42" cy="145" r="11" class="f-teal"/><path d="M36 140h12v7h-7l-3 3v-3h-2z" class="s-white s-thin"/><text x="60" y="150" class="t-ink t-s t-b">Chat</text>
</g>
<path d="M146 57c14 0 14 54 30 54M146 101h30M146 145c14 0 14-34 30-34" class="s-dash v-d1"/>
<g class="v-in-r">
  <rect x="176" y="22" width="320" height="204" rx="16" class="f-white v-card"/>
  <text x="192" y="46" class="t-ink t-b">CRM · Pipeline</text>
  <rect x="190" y="56" width="94" height="160" rx="10" class="f-chip"/><text x="200" y="74" class="t-mut t-xs t-b">NEW</text>
  <rect x="292" y="56" width="94" height="160" rx="10" class="f-chip"/><text x="302" y="74" class="t-mut t-xs t-b">QUALIFIED</text>
  <rect x="394" y="56" width="94" height="160" rx="10" class="f-chip"/><text x="404" y="74" class="t-mut t-xs t-b">PROPOSAL</text>
  <rect x="300" y="84" width="78" height="40" rx="8" class="f-white"/><path d="M308 98h44M308 110h30" class="s-line"/>
  <rect x="300" y="130" width="78" height="40" rx="8" class="f-white"/><path d="M308 144h50M308 156h26" class="s-line"/>
  <rect x="402" y="84" width="78" height="40" rx="8" class="f-white"/><path d="M410 98h40M410 110h34" class="s-line"/>
</g>
<g class="v-enq">
  <rect x="196" y="84" width="82" height="82" rx="9" class="f-white v-card"/><rect x="196" y="84" width="82" height="6" rx="3" class="f-sky"/>
  <text x="204" y="108" class="t-ink t-s t-b">{v("dest")}</text><text x="204" y="126" class="t-mut t-xs">{v("who")}</text><text x="204" y="142" class="t-mut t-xs">{v("nights")}</text>
  <circle cx="208" cy="155" r="3.5" class="f-yellow"/><circle cx="218" cy="155" r="3.5" class="f-yellow"/><circle cx="228" cy="155" r="3.5" class="f-yellow"/>
</g>
<g class="v-d5"><rect x="196" y="174" width="82" height="30" rx="15" class="f-yellow-l"/><path d="M209 194h10M210 194v-5a4 4 0 0 1 8 0v5" class="s-ink s-thin"/><text x="224" y="194" class="t-ink t-xs t-b">Call 3pm</text></g>
<g class="v-d6"><rect x="298" y="246" width="198" height="42" rx="21" class="f-ink"/><text x="397" y="272" text-anchor="middle" class="t-w t-s t-b">Expected {v("total")}</text></g>
''', "Enquire"),
    # 2 Quote: the itinerary as a quotation, with an optional extra, sent by email
    svg(f'''
<g class="v-in-up">
  <rect x="28" y="18" width="300" height="276" rx="16" class="f-white v-card"/>
  <rect x="28" y="18" width="300" height="46" rx="16" class="f-purple"/><rect x="28" y="48" width="300" height="16" class="f-purple"/>
  <text x="46" y="47" class="t-w t-b">Quotation {v("qno")}</text>
  <text x="46" y="88" class="t-ink t-s t-b">{v("dest")} · {v("who")} · {v("nights")}</text>
  <g class="v-line" style="--i:0"><circle cx="56" cy="114" r="11" class="f-sky"/>{plane(56, 116)}<text x="74" y="119" class="t-ink t-s">{v("l1")}</text><text x="310" y="119" text-anchor="end" class="t-ink t-s t-b">{v("a1")}</text></g>
  <g class="v-line" style="--i:1"><circle cx="56" cy="144" r="11" class="f-coral"/><path d="M50 148v-8M50 145h12v3M53 143h6" class="s-white s-thin"/><text x="74" y="149" class="t-ink t-s">{v("l2")}</text><text x="310" y="149" text-anchor="end" class="t-ink t-s t-b">{v("a2")}</text></g>
  <g class="v-line" style="--i:2"><circle cx="56" cy="174" r="11" class="f-teal"/><path d="M50 177h12M52 169h8a2 2 0 0 1 2 2v6h-12v-6a2 2 0 0 1 2-2z" class="s-white s-thin"/><text x="74" y="179" class="t-ink t-s">{v("l3")}</text><text x="310" y="179" text-anchor="end" class="t-ink t-s t-b">{v("a3")}</text></g>
  <g class="v-line" style="--i:3"><circle cx="56" cy="204" r="11" class="f-yellow"/><path d="M50 200h12v8h-12zM54 200v8" class="s-ink s-thin"/><text x="74" y="209" class="t-ink t-s">{v("l4")}</text><text x="310" y="209" text-anchor="end" class="t-ink t-s t-b">{v("a4")}</text></g>
  <path d="M46 228h264" class="s-line"/>
  <g class="v-line" style="--i:4"><text x="46" y="262" class="t-ink t-b">Total</text><text x="310" y="262" text-anchor="end" class="t-blue t-b">{v("total")}</text></g>
</g>
<g class="v-in-r">
  <rect x="344" y="34" width="152" height="140" rx="14" class="f-white v-card"/>
  <text x="358" y="58" class="t-mut t-xs t-b">OPTIONAL EXTRAS</text>
  <rect x="356" y="70" width="128" height="44" rx="10" class="f-chip"/>
  <text x="366" y="88" class="t-ink t-xs t-b">{v("extra")}</text><text x="366" y="104" class="t-blue t-xs t-b">{v("extra_a")}</text>
  <rect x="452" y="84" width="26" height="16" rx="8" class="f-teal"/><circle cx="470" cy="92" r="6" class="f-white v-knob"/>
  <rect x="356" y="122" width="128" height="40" rx="10" class="f-chip"/><text x="366" y="146" class="t-mut t-xs t-b">Travel insurance</text>
  <rect x="452" y="134" width="26" height="16" rx="8" class="f-line"/><circle cx="460" cy="142" r="6" class="f-white"/>
</g>
<g class="v-press v-d4"><rect x="350" y="188" width="140" height="36" rx="18" class="f-blue"/><text x="420" y="211" text-anchor="middle" class="t-w t-s t-b">Send by email</text></g>
<g class="v-stamp"><rect x="366" y="246" width="108" height="36" rx="18" class="f-green"/><path d="M384 264l4 4 8-9" class="s-white"/><text x="402" y="269" class="t-w t-s t-b">Sent</text></g>
''', "Quote"),
    # 3 Deposit: the customer signs online and pays the deposit by link; the down payment invoice is paid
    svg(f'''
<g class="v-shadow"><ellipse cx="145" cy="298" rx="84" ry="10"/></g>
<g class="v-in-up">
  <rect x="70" y="24" width="150" height="266" rx="22" class="f-ink"/><rect x="77" y="34" width="136" height="246" rx="15" class="f-white"/>
  <rect x="77" y="34" width="136" height="40" rx="15" class="f-blue"/><rect x="77" y="56" width="136" height="18" class="f-blue"/>
  <text x="90" y="59" class="t-w t-b">Sign &amp; pay</text>
  <text x="90" y="94" class="t-ink t-s t-b">{v("qno")} · {v("dest")}</text>
  <text x="90" y="112" class="t-mut t-xs">Total {v("total")}</text>
  <rect x="88" y="122" width="114" height="62" rx="10" class="f-chip"/>
  <path class="v-sign s-ink" d="M98 166c8-20 16-26 20-12s4 18 12 4 10-22 16-10 6 14 13 4 9-10 15-5"/>
  <path d="M96 174h98" class="s-line"/>
  <g class="v-press v-d3"><rect x="88" y="196" width="114" height="34" rx="17" class="f-teal"/><text x="145" y="218" text-anchor="middle" class="t-w t-s t-b">Pay {v("deposit")}</text></g>
  <text x="145" y="252" text-anchor="middle" class="t-mut t-xs">30% deposit</text>
</g>
<g class="v-in-r">
  <rect x="248" y="38" width="248" height="152" rx="14" class="f-white v-card"/>
  <text x="264" y="64" class="t-mut t-xs t-b">INVOICE · DOWN PAYMENT 30%</text>
  <text x="264" y="94" class="t-ink t-b">{v("deposit")}</text>
  <text x="264" y="114" class="t-mut t-xs">For {v("qno")} · {v("who")}</text>
  <path d="M264 132h214M264 150h150" class="s-line"/>
  <g class="v-paid v-d4"><rect x="404" y="152" width="78" height="28" rx="14" class="f-green"/><text x="443" y="171" text-anchor="middle" class="t-w t-s t-b">Paid</text></g>
</g>
<g class="v-d6"><rect x="248" y="236" width="248" height="44" rx="22" class="f-white v-card"/><rect x="262" y="249" width="26" height="18" rx="4" class="f-blue"/><rect x="262" y="254" width="26" height="4" class="f-yellow"/><text x="298" y="263" class="t-ink t-s t-b">Card · + {v("deposit")}</text></g>
''', "Deposit"),
    # 4 Book: each supplier service is a purchase on the same booking
    svg(f'''
<path d="M180 92c30 0 40 30 54 40M340 92c-30 0-40 30-54 40M260 222v-20" class="s-dash v-d3"/>
<g class="v-in-l">{ticket(24, 34, 158, 86, "f-white v-card")}
  <circle cx="52" cy="60" r="13" class="f-sky"/>{plane(52, 62)}<text x="74" y="62" class="t-ink t-s t-b">Airline</text><text x="74" y="80" class="t-mut t-xs">PO00311</text>
  <text x="44" y="104" class="t-ink t-xs t-b">{v("s1")}</text></g>
<g class="v-in-r">{ticket(338, 34, 158, 86, "f-white v-card")}
  <circle cx="366" cy="60" r="13" class="f-coral"/><path d="M360 65v-9M360 61h13v4M363 58h7" class="s-white s-thin"/><text x="388" y="62" class="t-ink t-s t-b">{v("vendor")}</text><text x="388" y="80" class="t-mut t-xs">PO00312</text>
  <text x="358" y="104" class="t-ink t-xs t-b">{v("s2")}</text></g>
<g class="v-in-up"><rect x="186" y="128" width="148" height="74" rx="16" class="f-ink"/>
  <text x="260" y="157" text-anchor="middle" class="t-w t-s t-b">Booking {v("qno")}</text><text x="260" y="179" text-anchor="middle" class="t-w t-xs">{v("dest")} · {v("who")}</text></g>
<g class="v-d3">{ticket(180, 222, 160, 72, "f-white v-card")}
  <circle cx="208" cy="246" r="13" class="f-teal"/><path d="M202 249h12M204 241h8a2 2 0 0 1 2 2v6h-12v-6a2 2 0 0 1 2-2z" class="s-white s-thin"/><text x="230" y="250" class="t-ink t-s t-b">Ground</text>
  <text x="200" y="278" class="t-ink t-xs t-b">{v("s3")}</text><text x="318" y="278" text-anchor="end" class="t-mut t-xs">PO00313</text></g>
<g class="v-d5"><circle cx="166" cy="40" r="12" class="f-green"/><path d="M160 40l4 4 7-8" class="s-white"/></g>
<g class="v-d5"><circle cx="480" cy="40" r="12" class="f-green"/><path d="M474 40l4 4 7-8" class="s-white"/></g>
<g class="v-d6"><circle cx="326" cy="228" r="12" class="f-green"/><path d="M320 228l4 4 7-8" class="s-white"/></g>
''', "Book"),
    # 5 Pay: a supplier bill in the supplier's currency, converted at the rate, the exchange difference booked
    svg(f'''
<g class="v-in-up">
  <rect x="26" y="32" width="196" height="188" rx="14" class="f-white v-card"/>
  <text x="42" y="58" class="t-mut t-xs t-b">VENDOR BILL</text><text x="42" y="80" class="t-ink t-s t-b">{v("vendor")} · {v("dest")}</text>
  <text x="42" y="120" class="t-ink t-b t-big2">{v("fx_amt")}</text>
  <rect x="42" y="134" width="56" height="22" rx="11" class="f-sky"/><text x="70" y="149" text-anchor="middle" class="t-w t-xs t-b">{v("cur")}</text>
  <path d="M42 178h160M42 198h110" class="s-line"/>
</g>
<path d="M226 126h14M352 126h14" class="s-arrow v-d3"/>
<g class="v-d3"><rect x="240" y="88" width="112" height="76" rx="14" class="f-ink"/>
  <text x="296" y="114" text-anchor="middle" class="t-w t-xs t-b">1 SGD =</text><text x="296" y="142" text-anchor="middle" class="t-sun t-b">{v("rate")} {v("cur")}</text></g>
<g class="v-in-r">
  <rect x="368" y="46" width="128" height="134" rx="14" class="f-white v-card"/>
  <text x="382" y="72" class="t-mut t-xs t-b">IN SGD</text><text x="382" y="108" class="t-ink t-b t-mid">{v("sgd_amt")}</text>
  <text x="382" y="132" class="t-mut t-xs">At the bill's rate</text>
  <rect x="382" y="146" width="100" height="20" rx="10" class="f-blue-l"/><text x="432" y="160" text-anchor="middle" class="t-blue t-xs t-b">Posted</text>
</g>
<g class="v-d6"><rect x="134" y="242" width="262" height="44" rx="22" class="f-white v-card"/><circle cx="160" cy="264" r="13" class="f-yellow"/><text x="160" y="269" text-anchor="middle" class="t-ink t-s t-b">±</text>
  <text x="182" y="269" class="t-ink t-s t-b">FX difference · {v("fxd")}</text></g>
''', "Pay"),
    # 6 Review: the margin per trip, before the customer flies
    svg(f'''
<g class="v-in-up">
  <rect x="26" y="20" width="470" height="210" rx="16" class="f-white v-card"/>
  <text x="44" y="46" class="t-ink t-b">Margin per trip</text><text x="176" y="46" class="t-mut t-xs">Dashboards · sample</text>
  <circle cx="108" cy="136" r="52" class="s-ring-bg"/>
  <g transform="rotate(-90 108 136)"><circle cx="108" cy="136" r="52" class="v-ring" data-vbar="margin_v" style="--v:{D["margin_v"]}"/></g>
  <text x="108" y="142" text-anchor="middle" class="t-ink t-b t-big">{v("margin")}</text><text x="108" y="162" text-anchor="middle" class="t-mut t-xs">margin</text>
  <text x="194" y="92" class="t-mut t-xs t-b">PRICE</text><text x="476" y="92" text-anchor="end" class="t-ink t-xs t-b">{v("total")}</text>
  <rect x="194" y="100" width="282" height="16" rx="8" class="f-chip"/><rect x="194" y="100" width="282" height="16" rx="8" class="f-blue v-hbar" style="--v:1"/>
  <text x="194" y="142" class="t-mut t-xs t-b">COST</text><text x="476" y="142" text-anchor="end" class="t-ink t-xs t-b">{v("cost")}</text>
  <rect x="194" y="150" width="282" height="16" rx="8" class="f-chip"/><rect x="194" y="150" width="282" height="16" rx="8" class="f-pink v-hbar" data-vbar="cost_w" style="--v:{D["cost_w"]}"/>
  <rect x="194" y="182" width="190" height="30" rx="15" class="f-sky-l"/><text x="208" y="202" class="t-ink t-xs t-b">{v("dest")} · {v("who")} · {v("nights")}</text>
</g>
<g class="v-d5"><circle cx="150" cy="270" r="7" class="f-blue"/><text x="150" y="298" text-anchor="middle" class="t-ink t-xs t-b">SIN</text>
  <path d="M162 266Q280 220 398 266" class="s-dash"/><circle cx="410" cy="270" r="7" class="f-pink"/><text x="410" y="298" text-anchor="middle" class="t-ink t-xs t-b">{v("code")}</text></g>
<g class="v-glide">{plane(280, 238, "f-blue")}</g>
''', "Review"),
]

CHIPS = [
    ("crm", '<span data-v="who">Family of 4</span> · <span data-v="dest">Tokyo</span> · <span data-v="nights">6 nights</span>'),
    ("sale", '<span data-v="qno">S0158</span> · <span data-v="total">S$ 9,840</span> · one optional extra'),
    ("account", '30% deposit · <span data-v="deposit">S$ 2,952</span> paid by link'),
    ("purchase", '<span data-v="s1">4 seats</span>, <span data-v="s2">6 nights</span>, <span data-v="s3">4 rail passes</span> booked'),
    ("accountant", '<span data-v="fx_amt">¥ 412,000</span> = <span data-v="sgd_amt">S$ 3,625.48</span> · FX difference booked'),
    ("spreadsheet_dashboard", '<span data-v="dest">Tokyo</span> trip · margin <span data-v="margin">18%</span>'),
]

META = {
    "tag": "Bluewave Journeys · sample",
    "note": "Bluewave Journeys is a sample travel agency. Every name and figure here is sample data.",
    "samples": SAMPLES,
    "pick": {"label": "Sample trip", "options": [("tokyo", "Tokyo · family of 4"), ("bali", "Bali · couple"), ("seoul", "Seoul · group of 6")]},
    "m": {
        "intro": "Enquiries, itineraries, supplier costs, deposits and the margin per trip, in one Odoo database.",
        "flow": "One trip, enquiry to margin. Pick a sample trip.",
    },
}
