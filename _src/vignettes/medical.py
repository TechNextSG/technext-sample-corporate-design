# -*- coding: utf-8 -*-
"""Medical (Bayview Clinic, a sample clinic group): booking, rosters, FEFO stock, reordering, the counter, billing."""
from vignettes import svg

SCENES = [
    # 1 Book: the patient's phone books a slot, the doctor's calendar fills, a reminder goes out
    svg('''
<g class="v-shadow"><ellipse cx="139" cy="294" rx="84" ry="10"/></g>
<g class="v-in-up">
  <rect x="64" y="32" width="150" height="254" rx="22" class="f-ink"/><rect x="71" y="42" width="136" height="234" rx="15" class="f-white"/>
  <rect x="71" y="42" width="136" height="40" rx="15" class="f-blue"/><rect x="71" y="64" width="136" height="18" class="f-blue"/>
  <text x="84" y="67" class="t-w t-b">Book a visit</text><text x="84" y="101" class="t-ink t-b t-xs">Thu 9 Oct · Dr. Tan</text>
  <g class="v-slots t-xs t-b">
    <rect x="80" y="112" width="56" height="26" rx="13" class="f-chip"/><text x="108" y="129" text-anchor="middle" class="t-mut">09:30</text>
    <rect x="142" y="112" width="56" height="26" rx="13" class="f-chip"/><text x="170" y="129" text-anchor="middle" class="t-mut">10:00</text>
    <g class="v-pick"><rect x="80" y="144" width="56" height="26" rx="13" class="f-teal"/><text x="108" y="161" text-anchor="middle" class="t-w">10:30</text></g>
    <rect x="142" y="144" width="56" height="26" rx="13" class="f-chip"/><text x="170" y="161" text-anchor="middle" class="t-mut">11:00</text>
    <rect x="80" y="176" width="56" height="26" rx="13" class="f-chip"/><text x="108" y="193" text-anchor="middle" class="t-mut">14:00</text>
    <rect x="142" y="176" width="56" height="26" rx="13" class="f-chip"/><text x="170" y="193" text-anchor="middle" class="t-mut">15:30</text>
  </g>
  <g class="v-press"><rect x="80" y="224" width="118" height="32" rx="16" class="f-blue"/><text x="139" y="245" text-anchor="middle" class="t-w t-b t-s">Confirm</text></g>
</g>
<g class="v-toast v-d3"><rect x="220" y="108" width="132" height="44" rx="14" class="f-white v-card"/><circle cx="242" cy="130" r="11" class="f-green"/>
  <path d="M237 130l4 4 7-8" class="s-white"/><text x="260" y="127" class="t-ink t-b t-s">Booked</text><text x="260" y="142" class="t-mut t-xs">Thu 10:30</text></g>
<g class="v-cal v-in-r">
  <rect x="356" y="30" width="138" height="186" rx="16" class="f-white v-card"/><text x="370" y="56" class="t-ink t-b t-s">Dr. Tan · Thu</text>
  <g class="t-xs t-mut"><text x="370" y="86">09:00</text><text x="370" y="116">10:00</text><text x="370" y="146">11:00</text><text x="370" y="176">12:00</text></g>
  <path d="M404 82h76M404 112h76M404 142h76M404 172h76" class="s-line"/>
  <rect x="408" y="88" width="72" height="18" rx="6" class="f-blue-l"/>
  <g class="v-slot-in"><rect x="408" y="120" width="72" height="20" rx="6" class="f-teal"/><text x="414" y="134" class="t-w t-xs t-b">10:30 visit</text></g>
  <rect x="408" y="150" width="72" height="18" rx="6" class="f-pink-l"/>
</g>
<g class="v-bell v-d5"><g class="v-swing"><path d="M392 252a18 18 0 0 1 36 0v14l6 8h-48l6-8z" class="f-yellow"/><circle cx="410" cy="280" r="5" class="f-yellow"/></g>
  <rect x="440" y="244" width="66" height="30" rx="15" class="f-white v-card"/><text x="452" y="263" class="t-ink t-xs t-b">Reminder</text></g>
''', "Book"),
    # 2 Roster: shifts slide onto the week, bookable slots follow who is on duty
    svg('''
<g class="v-in-up">
  <rect x="34" y="26" width="452" height="196" rx="18" class="f-white v-card"/>
  <text x="54" y="56" class="t-ink t-b">Planning</text><text x="140" y="56" class="t-mut t-s">Branch A · week 41 · sample</text>
  <g class="t-xs t-mut t-b"><text x="168" y="84">MON</text><text x="232" y="84">TUE</text><text x="296" y="84">WED</text><text x="360" y="84">THU</text><text x="424" y="84">FRI</text></g>
  <path d="M154 94v114M218 94v114M282 94v114M346 94v114M410 94v114" class="s-line"/>
  <circle cx="64" cy="114" r="12" class="f-blue"/><text x="84" y="119" class="t-ink t-s t-b">Dr. Tan</text>
  <circle cx="64" cy="152" r="12" class="f-teal"/><text x="84" y="157" class="t-ink t-s t-b">Nurse Mei</text>
  <circle cx="64" cy="190" r="12" class="f-pink"/><text x="84" y="195" class="t-ink t-s t-b">Front desk</text>
  <g class="v-bars">
    <rect x="158" y="103" width="120" height="22" rx="8" class="f-blue v-bar" style="--i:0"/><rect x="350" y="103" width="120" height="22" rx="8" class="f-blue v-bar" style="--i:1"/>
    <rect x="222" y="141" width="184" height="22" rx="8" class="f-teal v-bar" style="--i:2"/>
    <rect x="158" y="179" width="56" height="22" rx="8" class="f-pink v-bar" style="--i:3"/><rect x="286" y="179" width="184" height="22" rx="8" class="f-pink v-bar" style="--i:4"/>
  </g>
</g>
<path d="M378 210v34" class="s-dash v-d5"/>
<g class="v-pop v-d5"><rect x="296" y="244" width="168" height="44" rx="22" class="f-white v-card"/><rect x="306" y="254" width="24" height="24" rx="7" class="f-teal"/>
  <path d="M312 262h12M312 268h8" class="s-white"/><text x="340" y="271" class="t-ink t-s t-b">12 bookable slots</text></g>
''', "Roster"),
    # 3 Stock: the lot with the earliest expiry is picked first (FEFO)
    svg('''
<g class="v-in-up">
  <rect x="30" y="34" width="300" height="190" rx="16" class="f-white v-card"/><rect x="42" y="46" width="276" height="166" rx="10" class="f-glass"/>
  <rect x="42" y="128" width="276" height="6" class="f-shelf"/><rect x="42" y="206" width="276" height="6" class="f-shelf"/>
  <g><rect x="56" y="64" width="70" height="64" rx="6" class="f-blue-m"/><rect x="62" y="80" width="58" height="22" rx="4" class="f-white"/><text x="66" y="95" class="t-ink t-xs t-b">Lot 09C</text><text x="62" y="120" class="t-w t-xs">11/2027</text></g>
  <g class="v-lot"><rect x="146" y="64" width="70" height="64" rx="6" class="f-amber"/><rect x="152" y="80" width="58" height="22" rx="4" class="f-white"/><text x="156" y="95" class="t-ink t-xs t-b">Lot 17A</text><text x="152" y="120" class="t-w t-xs t-b">in 30 days</text></g>
  <g><rect x="236" y="64" width="70" height="64" rx="6" class="f-teal"/><rect x="242" y="80" width="58" height="22" rx="4" class="f-white"/><text x="246" y="95" class="t-ink t-xs t-b">Lot 24B</text><text x="242" y="120" class="t-w t-xs">03/2027</text></g>
  <rect x="56" y="150" width="54" height="56" rx="6" class="f-pink-l"/><rect x="118" y="160" width="54" height="46" rx="6" class="f-blue-l"/><rect x="180" y="146" width="54" height="60" rx="6" class="f-teal-l"/><rect x="242" y="156" width="62" height="50" rx="6" class="f-yellow-l"/>
</g>
<g class="v-alert v-d1"><rect x="150" y="22" width="92" height="26" rx="13" class="f-amber-d"/><text x="160" y="40" class="t-w t-xs t-b">Alert · 30 days</text></g>
<g class="v-tray v-in-r"><rect x="356" y="164" width="140" height="60" rx="14" class="f-white v-card"/><text x="370" y="186" class="t-mut t-xs t-b">PICKING · FEFO</text><g class="v-fly"><rect x="370" y="194" width="34" height="24" rx="4" class="f-amber"/><text x="376" y="210" class="t-w t-xs t-b">17A</text></g><text x="412" y="211" class="t-ink t-xs t-b">× 2 · Branch A</text></g>
<g class="v-fefo v-d6"><rect x="340" y="250" width="164" height="40" rx="20" class="f-ink"/><text x="356" y="275" class="t-w t-s t-b">First expiry, first out</text></g>
''', "Stock"),
    # 4 Buy: stock dips under the minimum, the PO drafts itself, the delivery arrives with lot and expiry
    svg('''
<g class="v-in-up">
  <rect x="30" y="30" width="160" height="176" rx="16" class="f-white v-card"/><text x="46" y="56" class="t-ink t-b t-s">Saline 0.9%</text><text x="46" y="73" class="t-mut t-xs">Branch A stock</text>
  <rect x="62" y="86" width="44" height="104" rx="10" class="f-chip"/><rect x="62" y="86" width="44" height="104" rx="10" class="f-teal v-level"/>
  <path d="M54 150h70" class="s-red"/><text x="128" y="154" class="t-red t-xs t-b">min 60</text><text x="122" y="182" class="t-ink t-b v-count">40</text>
</g>
<g class="v-po v-d3"><rect x="214" y="40" width="150" height="150" rx="12" class="f-white v-card"/><rect x="214" y="40" width="150" height="34" rx="12" class="f-purple"/><rect x="214" y="60" width="150" height="14" class="f-purple"/>
  <text x="228" y="62" class="t-w t-b t-s">PO00042</text><text x="228" y="98" class="t-ink t-s t-b">Saline 0.9% × 200</text><text x="228" y="118" class="t-mut t-xs">Approved vendor</text><text x="228" y="136" class="t-mut t-xs">Reordering rule</text>
  <g class="v-stamp"><rect x="246" y="148" width="90" height="28" rx="6" class="s-green-f"/><text x="258" y="167" class="t-green t-s t-b">Confirmed</text></g></g>
<g class="v-van"><rect x="372" y="214" width="96" height="58" rx="10" class="f-blue"/><rect x="468" y="232" width="40" height="40" rx="8" class="f-blue-d"/><rect x="476" y="238" width="24" height="16" rx="4" class="f-glass"/>
  <circle cx="398" cy="276" r="11" class="f-ink"/><circle cx="486" cy="276" r="11" class="f-ink"/><circle cx="398" cy="276" r="4" class="f-white"/><circle cx="486" cy="276" r="4" class="f-white"/><text x="388" y="248" class="t-w t-s t-b">Delivery</text></g>
<g class="v-box v-d7"><rect x="300" y="236" width="56" height="48" rx="5" class="f-box"/><rect x="323" y="236" width="10" height="48" class="f-box-d"/><rect x="304" y="246" width="44" height="18" rx="3" class="f-white"/><text x="307" y="259" class="t-ink t-xs t-b">Lot 31D</text></g>
''', "Buy"),
    # 5 Counter: a sale at the counter, paid by card, the lot deducted
    svg('''
<g class="v-in-up">
  <rect x="30" y="28" width="282" height="196" rx="18" class="f-ink"/><rect x="40" y="38" width="262" height="176" rx="12" class="f-white"/>
  <rect x="40" y="38" width="262" height="32" rx="12" class="f-purple"/><rect x="40" y="58" width="262" height="12" class="f-purple"/><text x="54" y="60" class="t-w t-b t-s">Point of Sale · counter</text>
  <g class="v-line" style="--i:0"><text x="54" y="96" class="t-ink t-s">Hand sanitiser × 2</text><text x="236" y="96" class="t-ink t-s t-b">11.80</text></g>
  <g class="v-line" style="--i:1"><text x="54" y="122" class="t-ink t-s">Gauze pack × 1</text><text x="242" y="122" class="t-ink t-s t-b">6.60</text></g>
  <path d="M54 138h234" class="s-line"/>
  <g class="v-line" style="--i:2"><text x="54" y="166" class="t-ink t-b">Total</text><text x="210" y="166" class="t-blue t-b">S$ 18.40</text></g>
  <rect x="54" y="180" width="234" height="22" rx="11" class="f-chip"/><text x="66" y="195" class="t-mut t-xs">Lot 24B · sanitiser</text>
</g>
<g class="v-reader"><rect x="338" y="132" width="62" height="96" rx="12" class="f-ink-l"/><rect x="346" y="140" width="46" height="30" rx="5" class="f-glass"/>
  <path class="v-waves s-blue" d="M410 168a14 14 0 0 1 0 20M418 162a24 24 0 0 1 0 32"/></g>
<g class="v-card-tap"><rect x="420" y="150" width="76" height="48" rx="8" class="f-blue"/><rect x="430" y="162" width="16" height="12" rx="3" class="f-yellow"/><rect x="430" y="182" width="50" height="5" rx="2" class="f-white-t"/></g>
<g class="v-receipt v-d6"><path d="M334 244h150v44l-8 6-8-6-8 6-8-6-8 6-8-6-8 6-8-6-8 6-8-6-8 6-8-6-8 6-8-6-8 6-8-6-8 6-8-6z" class="f-white v-card"/>
  <circle cx="352" cy="262" r="8" class="f-green"/><path d="M348 262l3 3 5-6" class="s-white"/><text x="366" y="266" class="t-ink t-s t-b">Paid · lot deducted</text></g>
''', "Counter"),
    # 6 Bill: the invoice is paid, the bank line reconciles, each branch's P&L updates
    svg('''
<g class="v-in-up">
  <rect x="30" y="26" width="200" height="190" rx="16" class="f-white v-card"/><text x="46" y="54" class="t-mut t-xs t-b">INVOICE</text><text x="46" y="74" class="t-ink t-b t-s">INV/2026/0158</text>
  <text x="46" y="96" class="t-mut t-xs">Corporate client · sample</text><path d="M46 112h168M46 132h120M46 152h146" class="s-line"/>
  <text x="46" y="192" class="t-ink t-b">S$ 1,240.00</text>
  <g class="v-paid v-d4"><rect x="150" y="174" width="64" height="26" rx="13" class="f-green"/><text x="166" y="192" class="t-w t-s t-b">Paid</text></g>
</g>
<g class="v-bank v-in-r"><rect x="256" y="34" width="236" height="62" rx="14" class="f-white v-card"/><rect x="270" y="50" width="30" height="30" rx="9" class="f-blue-l"/>
  <path d="M276 72h18M278 58l7-4 7 4M279 60v10M285 60v10M291 60v10" class="s-blue"/><text x="312" y="62" class="t-ink t-s t-b">Bank feed</text><text x="312" y="80" class="t-green t-s t-b">+ 1,240.00</text></g>
<g class="v-match v-d3"><path d="M230 120c40 0 60-12 80-24" class="s-dash-g"/><circle cx="270" cy="114" r="14" class="f-green"/><path d="M264 114l4 4 8-9" class="s-white"/><text x="292" y="128" class="t-green t-s t-b">Reconciled</text></g>
<g class="v-pl"><text x="262" y="160" class="t-mut t-xs t-b">P&amp;L BY BRANCH</text>
  <rect x="270" y="172" width="44" height="58" rx="6" class="f-blue v-rise" style="--i:0"/><rect x="334" y="186" width="44" height="44" rx="6" class="f-teal v-rise" style="--i:1"/><rect x="398" y="160" width="44" height="70" rx="6" class="f-pink v-rise" style="--i:2"/>
  <g class="t-ink t-xs t-b"><text x="284" y="252">A</text><text x="348" y="252">B</text><text x="412" y="252">C</text></g></g>
''', "Bill"),
]

CHIPS = [
    ("appointment", "Dr. Tan · Thu 10:30 · booked online, reminder sent"),
    ("planning", "Branch A · Thu · 3 doctors and 4 nurses on duty"),
    ("stock", "Saline 0.9% · Lot 17A · expiry alert raised, picked first"),
    ("purchase", "PO00042 · Saline 0.9% × 200 · approved vendor"),
    ("point_of_sale", "Order 0412 · S$ 18.40 paid by card · Lot 24B"),
    ("accountant", "INV/2026/0158 · S$ 1,240.00 · reconciled"),
]

META = {
    "tag": "Bayview Clinic · sample",
    "note": "Bayview Clinic is a sample clinic group. Every name and figure here is sample data.",
    "m": {
        "intro": "Odoo runs the business side of a clinic: bookings, rosters, stock with expiry dates, purchasing and the books per branch.",
        "flow": "A clinic day in Odoo, step by step.",
    },
}
