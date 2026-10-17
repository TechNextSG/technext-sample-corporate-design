# -*- coding: utf-8 -*-
"""Health & Wellness (Willow & Stone, a sample yoga and spa studio with a small gym): one client from the first booking to
the month's recurring revenue. The workflow has a sample picker: a yoga member, a spa client or a gym member; every
[data-v] text and [data-vbar] bar follows the picked client. All figures are sample figures and add up: basket total =
item + item, loyalty points = 1 per S$ 1, the studio's recurring revenue = memberships + class packs."""
from vignettes import svg

SAMPLES = {
    "yoga": {"client": "Ana Tan", "first": "Ana", "ini": "AT", "svc": "Vinyasa flow", "day": "Tue", "time": "07:00", "staff": "Leo", "where": "Studio 1",
             "seats": "12 of 14 booked", "seat_v": "0.86", "plan": "Gold unlimited", "price": "S$ 189", "sub": "SUB/0186", "renew": "12 Nov",
             "tier": "Gold", "left": "Unlimited classes", "in": "07:52", "item": "Lavender oil", "ip": "S$ 32", "item2": "Mat towel", "ip2": "S$ 14",
             "tot": "S$ 46", "pts": "+46 pts", "pos": "POS/0932", "shift": "06:30–13:00", "load": "3 classes", "sh_x": "150", "sh_w": "170"},
    "spa": {"client": "Mei Wong", "first": "Mei", "ini": "MW", "svc": "Deep tissue massage", "day": "Thu", "time": "15:00", "staff": "Amira", "where": "Room 2",
            "seats": "Room 2 · 60 min", "seat_v": "1", "plan": "Spa club monthly", "price": "S$ 129", "sub": "SUB/0191", "renew": "3 Nov",
            "tier": "Spa club", "left": "1 massage this month", "in": "14:48", "item": "Massage oil", "ip": "S$ 38", "item2": "Gift card", "ip2": "S$ 50",
            "tot": "S$ 88", "pts": "+88 pts", "pos": "POS/0947", "shift": "12:00–20:00", "load": "5 treatments", "sh_x": "260", "sh_w": "200"},
    "gym": {"client": "Raj Kumar", "first": "Raj", "ini": "RK", "svc": "Strength circuit", "day": "Wed", "time": "18:30", "staff": "Jun", "where": "Gym floor",
            "seats": "18 of 30 booked", "seat_v": "0.6", "plan": "Gym 24/7", "price": "S$ 79", "sub": "SUB/0204", "renew": "21 Nov",
            "tier": "24/7", "left": "Unlimited gym", "in": "06:10", "item": "Protein bars × 2", "ip": "S$ 9", "item2": "Shaker", "ip2": "S$ 16",
            "tot": "S$ 25", "pts": "+25 pts", "pos": "POS/0951", "shift": "05:30–12:00", "load": "2 classes · 4 PT", "sh_x": "120", "sh_w": "160"},
}
D = SAMPLES["yoga"]


def v(field: str) -> str:
    return f'<tspan data-v="{field}">{D[field]}</tspan>'


TICK = '<path d="M-7 0l5 5 9-10" class="s-white"/>'

SCENES = [
    # 1 Book: the client picks a class (or a treatment) online, by staff member and room, within its capacity; a reminder is set
    svg(f'''
<g class="v-in-up">
  <rect x="22" y="20" width="262" height="204" rx="16" class="f-white v-card"/>
  <rect x="22" y="20" width="262" height="40" rx="16" class="f-hsage"/><rect x="22" y="44" width="262" height="16" class="f-hsage"/><text x="40" y="46" class="t-w t-s t-b">Book online · sample</text>
  <g class="t-mut t-xs t-b"><text x="40" y="82">MON</text><text x="88" y="82">TUE</text><text x="136" y="82">WED</text><text x="184" y="82">THU</text><text x="232" y="82">FRI</text></g>
  <rect x="38" y="92" width="230" height="58" rx="10" class="f-hsage-l v-pick"/>
  <text x="52" y="116" class="t-ink t-s t-b">{v("svc")}</text><text x="52" y="137" class="t-mut t-xs">{v("day")} {v("time")} · {v("staff")} · {v("where")}</text>
  <rect x="38" y="160" width="230" height="8" rx="4" class="f-chip"/><rect x="38" y="160" width="230" height="8" rx="4" class="f-hsage-d v-hbar" data-vbar="seat_v" style="--v:{D["seat_v"]}"/>
  <text x="38" y="186" class="t-mut t-xs t-b">{v("seats")}</text>
  <g class="v-press"><rect x="176" y="176" width="92" height="34" rx="17" class="f-hlav"/><text x="222" y="198" text-anchor="middle" class="t-w t-xs t-b">Book</text></g>
</g>
<path d="M290 120h22" class="s-arrow v-d3"/>
<g class="v-in-r">
  <rect x="318" y="34" width="180" height="120" rx="14" class="f-white v-card"/>
  <g transform="translate(346 66)"><circle r="14" class="f-hsage-d"/>{TICK}</g><text x="370" y="71" class="t-ink t-s t-b">Booked</text>
  <text x="334" y="104" class="t-ink t-xs t-b">{v("client")}</text><text x="334" y="124" class="t-mut t-xs">{v("day")} {v("time")} · {v("svc")}</text>
</g>
<g class="v-d5"><rect x="318" y="164" width="180" height="34" rx="17" class="f-hlav-l"/><text x="408" y="186" text-anchor="middle" class="t-lav t-xs t-b">Reminder · 24 h before</text></g>
<g class="v-d6"><rect x="22" y="246" width="476" height="44" rx="22" class="f-ink"/><text x="48" y="273" class="t-w t-s t-b">Online booking with capacity and reminders</text></g>
''', "Book"),
    # 2 Join: the membership is a subscription that bills and renews by itself
    svg(f'''
<g class="v-in-up">
  <rect x="26" y="30" width="230" height="146" rx="18" class="f-hsage-d v-card"/>
  <circle cx="226" cy="58" r="40" class="f-hsage" opacity=".55"/><circle cx="196" cy="150" r="30" class="f-hsage" opacity=".35"/>
  <text x="46" y="62" class="t-w t-xs t-b">WILLOW &amp; STONE</text><text x="46" y="98" class="t-w t-b">{v("plan")}</text>
  <text x="46" y="122" class="t-w t-s">{v("price")} / month</text><text x="46" y="158" class="t-w t-xs t-b">{v("client")}</text>
</g>
<path d="M262 104h22" class="s-arrow v-d3"/>
<g class="v-in-r">
  <rect x="290" y="22" width="208" height="176" rx="14" class="f-white v-card"/><text x="306" y="46" class="t-mut t-xs t-b">SUBSCRIPTION {v("sub")}</text>
  <g class="v-line" style="--i:1"><rect x="306" y="58" width="176" height="36" rx="8" class="f-chip"/><text x="318" y="81" class="t-ink t-xs t-b">Oct · {v("price")}</text>
    <rect x="420" y="66" width="52" height="20" rx="10" class="f-green"/><text x="446" y="80" text-anchor="middle" class="t-w t-xs t-b">Paid</text></g>
  <g class="v-line" style="--i:2"><rect x="306" y="102" width="176" height="36" rx="8" class="f-chip"/><text x="318" y="125" class="t-ink t-xs t-b">Nov · {v("price")}</text>
    <rect x="402" y="110" width="70" height="20" rx="10" class="f-hlav"/><text x="437" y="124" text-anchor="middle" class="t-w t-xs t-b">Auto-bill</text></g>
  <text x="306" y="166" class="t-mut t-xs">Renews {v("renew")} · card on file</text>
</g>
<g class="v-d6"><rect x="22" y="246" width="476" height="44" rx="22" class="f-ink"/><text x="48" y="273" class="t-w t-s t-b">Memberships bill and renew on their own</text></g>
''', "Join"),
    # 3 Check in: the member checks in at the front desk; Odoo 20 can limit check-in to members or to a tier
    svg(f'''
<g class="v-in-up">
  <rect x="40" y="14" width="210" height="208" rx="20" class="f-ink v-card"/><rect x="50" y="24" width="190" height="188" rx="12" class="f-white"/>
  <rect x="50" y="24" width="190" height="30" rx="12" class="f-hsage-d"/><rect x="50" y="42" width="190" height="12" class="f-hsage-d"/><text x="145" y="44" text-anchor="middle" class="t-w t-xs t-b">FRONT DESK · CHECK-IN</text>
  <g class="v-d1" transform="translate(145 100)"><circle r="26" class="f-hsage"/><path d="M-12 0l8 8 16-17" class="s-white"/></g>
  <text x="145" y="152" text-anchor="middle" class="t-ink t-s t-b">Welcome, {v("first")}</text>
  <text x="145" y="174" text-anchor="middle" class="t-mut t-xs">{v("left")}</text><text x="145" y="196" text-anchor="middle" class="t-mut t-xs">In at {v("in")}</text>
</g>
<g class="v-in-r">
  <rect x="290" y="34" width="208" height="150" rx="14" class="f-white v-card"/><text x="306" y="58" class="t-mut t-xs t-b">ENTRY RULE · ODOO 20</text>
  <g class="v-line" style="--i:1"><rect x="306" y="72" width="176" height="34" rx="8" class="f-hsage-l"/><text x="318" y="94" class="t-sage t-xs t-b">Members only</text></g>
  <g class="v-line" style="--i:2"><rect x="306" y="114" width="176" height="34" rx="8" class="f-hlav-l"/><text x="318" y="136" class="t-lav t-xs t-b">Tier: {v("tier")}</text></g>
  <text x="306" y="170" class="t-mut t-xs">{v("client")} · on one record</text>
</g>
<g class="v-d6"><rect x="22" y="246" width="476" height="44" rx="22" class="f-ink"/><text x="48" y="273" class="t-w t-s t-b">Check-in can be members-only, or by tier</text></g>
''', "Check in"),
    # 4 Sell: the front desk sells retail at the Point of Sale; stock moves and loyalty points land on the same client
    svg(f'''
<g class="v-in-up">
  <rect x="30" y="16" width="236" height="210" rx="14" class="f-white v-card"/><text x="48" y="42" class="t-mut t-xs t-b">POINT OF SALE · {v("pos")}</text>
  <g class="v-line" style="--i:1"><text x="48" y="76" class="t-ink t-xs t-b">{v("item")}</text><text x="248" y="76" text-anchor="end" class="t-ink t-xs t-b">{v("ip")}</text></g>
  <g class="v-line" style="--i:2"><text x="48" y="104" class="t-ink t-xs t-b">{v("item2")}</text><text x="248" y="104" text-anchor="end" class="t-ink t-xs t-b">{v("ip2")}</text></g>
  <path d="M48 120h200" class="s-line"/><text x="48" y="146" class="t-ink t-b">Total</text><text x="248" y="146" text-anchor="end" class="t-ink t-b">{v("tot")}</text>
  <g class="v-paid"><rect x="48" y="166" width="96" height="26" rx="13" class="f-green"/><text x="96" y="183" text-anchor="middle" class="t-w t-xs t-b">Paid · card</text></g>
  <text x="48" y="212" class="t-mut t-xs">{v("client")}</text>
</g>
<path d="M272 100h22" class="s-arrow v-d3"/>
<g class="v-in-r">
  <rect x="300" y="30" width="198" height="72" rx="14" class="f-white v-card"/><text x="316" y="54" class="t-mut t-xs t-b">LOYALTY</text>
  <rect x="316" y="64" width="90" height="26" rx="13" class="f-hlav"/><text x="361" y="81" text-anchor="middle" class="t-w t-xs t-b">{v("pts")}</text>
</g>
<g class="v-d5"><rect x="300" y="116" width="198" height="72" rx="14" class="f-white v-card"/><text x="316" y="140" class="t-mut t-xs t-b">STOCK</text>
  <text x="316" y="170" class="t-ink t-xs t-b">Shop shelf · 2 lines out</text></g>
<g class="v-d6"><rect x="22" y="246" width="476" height="44" rx="22" class="f-ink"/><text x="48" y="273" class="t-w t-s t-b">Retail, stock and loyalty on the same client</text></g>
''', "Sell"),
    # 5 Staff: shifts in Planning decide which slots clients can book
    svg(f'''
<g class="v-in-up">
  <rect x="22" y="16" width="476" height="160" rx="16" class="f-white v-card"/><text x="40" y="42" class="t-ink t-b">Planning · {v("day")}</text>
  <g class="t-mut t-xs t-b"><text x="120" y="64">06</text><text x="200" y="64">09</text><text x="280" y="64">12</text><text x="360" y="64">15</text><text x="440" y="64">18</text></g>
  <text x="40" y="92" class="t-ink t-xs t-b">Leo</text><text x="40" y="124" class="t-ink t-xs t-b">Amira</text><text x="40" y="156" class="t-ink t-xs t-b">Jun</text>
  <path d="M40 104h440M40 136h440" class="s-line"/>
  <rect x="130" y="78" width="170" height="20" rx="6" class="f-hsage-l"/><rect x="290" y="110" width="200" height="20" rx="6" class="f-hblush-l"/><rect x="104" y="142" width="160" height="20" rx="6" class="f-hlav-l"/>
</g>
<g class="v-in-r"><rect x="22" y="188" width="476" height="44" rx="14" class="f-white v-card"/>
  <text x="40" y="215" class="t-ink t-xs t-b">{v("staff")} · {v("shift")} · {v("load")}</text>
  <rect x="380" y="198" width="104" height="24" rx="12" class="f-hsage-d"/><text x="432" y="214" text-anchor="middle" class="t-w t-xs t-b">Bookable</text></g>
<g class="v-d6"><rect x="22" y="246" width="476" height="44" rx="22" class="f-ink"/><text x="48" y="273" class="t-w t-s t-b">Shifts decide which slots clients can book</text></g>
''', "Staff"),
    # 6 Close: memberships, packs and retail post to Accounting; subscription reports show recurring revenue and churn
    svg(f'''
<g class="v-in-up">
  <rect x="22" y="16" width="290" height="210" rx="16" class="f-white v-card"/><text x="40" y="42" class="t-ink t-b">Recurring revenue</text><text x="294" y="42" text-anchor="end" class="t-mut t-xs">sample</text>
  <path d="M40 196h254" class="s-line"/>
  <rect x="48" y="146" width="28" height="50" rx="5" class="f-hsage-l v-bar" style="--i:0"/><rect x="88" y="136" width="28" height="60" rx="5" class="f-hsage-l v-bar" style="--i:1"/>
  <rect x="128" y="124" width="28" height="72" rx="5" class="f-hsage-l v-bar" style="--i:2"/><rect x="168" y="116" width="28" height="80" rx="5" class="f-hsage-l v-bar" style="--i:3"/>
  <rect x="208" y="100" width="28" height="96" rx="5" class="f-hsage v-bar" style="--i:4"/><rect x="248" y="84" width="28" height="112" rx="5" class="f-hsage-d v-bar" style="--i:5"/>
  <g class="t-mut t-xs t-b"><text x="62" y="214" text-anchor="middle">May</text><text x="142" y="214" text-anchor="middle">Jul</text><text x="222" y="214" text-anchor="middle">Sep</text><text x="262" y="214" text-anchor="middle">Oct</text></g>
  <text x="40" y="70" class="t-sage t-b">S$ 48.2k</text><text x="118" y="70" class="t-mut t-xs">this month</text>
</g>
<g class="v-in-r">
  <rect x="326" y="16" width="172" height="100" rx="14" class="f-white v-card"/><text x="342" y="40" class="t-mut t-xs t-b">THIS MONTH</text>
  <text x="342" y="64" class="t-ink t-xs t-b">Memberships S$ 41.0k</text><text x="342" y="84" class="t-ink t-xs t-b">Class packs S$ 7.2k</text><text x="342" y="104" class="t-mut t-xs">Churn 1.6%</text>
</g>
<g class="v-d5"><rect x="326" y="128" width="172" height="98" rx="14" class="f-white v-card"/><text x="342" y="152" class="t-mut t-xs t-b">ON THE LEDGER</text>
  <text x="342" y="176" class="t-ink t-xs t-b">{v("first")} · {v("price")}</text><text x="342" y="196" class="t-mut t-xs">renews {v("renew")}</text><text x="342" y="216" class="t-mut t-xs">+ retail {v("tot")}</text></g>
<g class="v-d6"><rect x="22" y="246" width="476" height="44" rx="22" class="f-ink"/><text x="48" y="273" class="t-w t-s t-b">Recurring revenue and churn, without month-end sums</text></g>
''', "Close"),
]

CHIPS = [
    ("appointment", '<span data-v="svc">Vinyasa flow</span> · <span data-v="day">Tue</span> <span data-v="time">07:00</span> · <span data-v="seats">12 of 14 booked</span>'),
    ("sale_subscription", '<span data-v="sub">SUB/0186</span> · <span data-v="plan">Gold unlimited</span> · <span data-v="price">S$ 189</span> a month'),
    ("icon:usercheck", '<span data-v="client">Ana Tan</span> · <span data-v="tier">Gold</span> · in at <span data-v="in">07:52</span>'),
    ("point_of_sale", '<span data-v="pos">POS/0932</span> · <span data-v="tot">S$ 46</span> · <span data-v="pts">+46 pts</span>'),
    ("planning", '<span data-v="staff">Leo</span> · <span data-v="shift">06:30–13:00</span> · <span data-v="load">3 classes</span>'),
    ("accountant", 'Recurring revenue S$ 48.2k · churn 1.6%'),
]

META = {
    "tag": "Willow &amp; Stone · sample",
    "note": "Willow &amp; Stone is a sample studio. Every name and figure here is sample data.",
    "samples": SAMPLES,
    "pick": {"label": "Sample client", "options": [("yoga", "Yoga member"), ("spa", "Spa client"), ("gym", "Gym member")]},
    "m": {
        "intro": "Online booking, memberships that renew, front desk check-in, retail and recurring revenue, in one Odoo database.",
        "flow": "One client, first booking to renewal. Pick a sample client.",
    },
}
