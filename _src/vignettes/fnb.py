# -*- coding: utf-8 -*-
"""F&B (Lantern Kitchen, a sample restaurant group): one dish from the supplier to the table to the books. The workflow has a
sample picker: laksa, a chilli crab bun or a kaya toast set; every [data-v] text and [data-vbar] bar follows the picked
dish. All figures are sample figures and add up: food cost % is the recipe cost over the menu price, the purchase order is
quantity x price, the night's takings split into card, cash and QR."""
from vignettes import svg

SAMPLES = {
    "laksa": {"dish": "Laksa", "i1": "Laksa paste · 80 g", "i2": "Rice noodles · 150 g", "i3": "Prawns · 4 pcs", "par_item": "Prawns", "onhand": "3 kg", "par": "12 kg",
              "po": "PO00156", "po_line": "10 kg prawns", "po_amt": "S$ 186.00", "batch": "Laksa paste", "batch_qty": "20 kg", "mo": "MO/0091", "move": "6 kg laksa paste",
              "price": "S$ 14.00", "cost": "S$ 4.20", "fc": "30%", "fc_v": "0.30", "table": "T7", "qty": "2", "ticket": "#42", "note": "less spicy", "use": "−160 g paste"},
    "crab": {"dish": "Chilli crab bun", "i1": "Chilli crab sauce · 60 g", "i2": "Mantou buns · 2 pcs", "i3": "Crab meat · 50 g", "par_item": "Crab meat", "onhand": "1 kg", "par": "4 kg",
             "po": "PO00157", "po_line": "3 kg crab meat", "po_amt": "S$ 162.00", "batch": "Chilli crab sauce", "batch_qty": "15 kg", "mo": "MO/0092", "move": "4 kg chilli crab sauce",
             "price": "S$ 12.00", "cost": "S$ 3.96", "fc": "33%", "fc_v": "0.33", "table": "T3", "qty": "3", "ticket": "#43", "note": "extra sauce", "use": "−180 g sauce"},
    "kaya": {"dish": "Kaya toast set", "i1": "Kaya · 30 g", "i2": "Bread · 2 slices", "i3": "Eggs · 2 pcs", "par_item": "Eggs", "onhand": "60 eggs", "par": "180 eggs",
             "po": "PO00158", "po_line": "360 eggs", "po_amt": "S$ 75.60", "batch": "Kaya", "batch_qty": "8 kg", "mo": "MO/0093", "move": "3 kg kaya",
             "price": "S$ 6.00", "cost": "S$ 1.50", "fc": "25%", "fc_v": "0.25", "table": "T12", "qty": "2", "ticket": "#44", "note": "soft-boiled", "use": "−60 g kaya"},
}
D = SAMPLES["laksa"]


def v(field: str) -> str:
    return f'<tspan data-v="{field}">{D[field]}</tspan>'


def bowl(x, y, cls="f-tomato"):
    return f'<path d="M{x - 26} {y}h52a26 22 0 0 1 -52 0z" class="f-white"/><ellipse cx="{x}" cy="{y}" rx="24" ry="5" class="{cls}"/>'


SCENES = [
    # 1 Buy: the walk-in runs below par; the reordering rule raises the purchase order with the supplier's delivery days
    svg(f'''
<g class="v-in-up">
  <rect x="22" y="24" width="200" height="196" rx="14" class="f-steel"/><rect x="30" y="32" width="184" height="180" rx="8" class="f-white"/>
  <text x="44" y="56" class="t-mut t-xs t-b">WALK-IN · {v("par_item")}</text>
  <rect x="44" y="70" width="38" height="120" rx="6" class="f-chip"/><rect x="44" y="160" width="38" height="30" rx="6" class="f-tomato v-level"/>
  <path d="M38 100h52" stroke="#1F4D3F" stroke-width="2.5" stroke-dasharray="5 4" fill="none"/>
  <text x="96" y="104" class="t-ink t-xs t-b">par {v("par")}</text><text x="96" y="182" class="t-ink t-xs t-b">{v("onhand")}</text><text x="96" y="198" class="t-mut t-xs">on hand</text>
</g>
<path d="M226 120h20" class="s-arrow v-d1"/>
<g class="v-in-r">
  <rect x="252" y="24" width="244" height="196" rx="14" class="f-white v-card"/>
  <rect x="252" y="24" width="244" height="40" rx="14" class="f-green-f"/><rect x="252" y="48" width="244" height="16" class="f-green-f"/><text x="268" y="50" class="t-w t-s t-b">Purchase order {v("po")}</text>
  <text x="268" y="88" class="t-ink t-xs t-b">Ocean Fresh Supplies</text><text x="268" y="106" class="t-mut t-xs">Delivers Tue · Fri</text>
  <g class="v-line" style="--i:1"><rect x="268" y="118" width="212" height="34" rx="8" class="f-chip"/><text x="280" y="140" class="t-ink t-xs t-b">{v("po_line")}</text></g>
  <path d="M268 166h212" class="s-line"/>
  <g class="v-line" style="--i:2"><text x="268" y="198" class="t-ink t-b">Total</text><text x="480" y="198" text-anchor="end" class="t-ink t-b">{v("po_amt")}</text></g>
</g>
<g class="v-stamp"><rect x="22" y="244" width="474" height="44" rx="22" class="f-ink"/><path d="M48 266l5 5 9-10" class="s-white"/><text x="72" y="271" class="t-w t-s t-b">Raised from the par level · sent for Friday</text></g>
''', "Buy"),
    # 2 Prep: the central kitchen cooks a batch from its recipe as a manufacturing order; ingredient use and cost recorded
    svg(f'''
<g class="v-in-up">
  <rect x="22" y="22" width="210" height="200" rx="14" class="f-white v-card"/>
  <text x="38" y="48" class="t-mut t-xs t-b">RECIPE · BILL OF MATERIALS</text><text x="38" y="72" class="t-ink t-s t-b">{v("batch")}</text>
  <g class="v-line" style="--i:0"><circle cx="46" cy="98" r="6" class="f-tomato"/><text x="58" y="102" class="t-ink t-xs">Chillies · 2.4 kg</text></g>
  <g class="v-line" style="--i:1"><circle cx="46" cy="124" r="6" class="f-mustard"/><text x="58" y="128" class="t-ink t-xs">Shallots · 3 kg</text></g>
  <g class="v-line" style="--i:2"><circle cx="46" cy="150" r="6" class="f-herb"/><text x="58" y="154" class="t-ink t-xs">Lemongrass · 1 kg</text></g>
  <g class="v-line" style="--i:3"><circle cx="46" cy="176" r="6" class="f-brown"/><text x="58" y="180" class="t-ink t-xs">Dried shrimp · 1.5 kg</text></g>
  <text x="38" y="208" class="t-mut t-xs">Yield {v("batch_qty")}</text>
</g>
<g class="v-in-up"><rect x="262" y="102" width="92" height="84" rx="10" class="f-steel"/><rect x="254" y="94" width="108" height="14" rx="6" class="f-steel-d"/><rect x="276" y="130" width="64" height="26" rx="5" class="f-white"/><text x="308" y="148" text-anchor="middle" class="t-ink t-xs t-b">BATCH</text></g>
<g class="v-waves"><path d="M286 88c-8-12 8-18 0-30M308 86c-8-12 8-18 0-30M330 88c-8-12 8-18 0-30" fill="none" stroke="#C9D1DB" stroke-width="4" stroke-linecap="round"/></g>
<g class="v-in-r">
  <rect x="378" y="44" width="118" height="140" rx="14" class="f-white v-card"/><text x="392" y="68" class="t-mut t-xs t-b">{v("mo")}</text>
  <text x="392" y="96" class="t-ink t-xs t-b">{v("batch_qty")}</text><text x="392" y="114" class="t-mut t-xs">produced</text>
  <g class="v-paid"><rect x="392" y="146" width="88" height="24" rx="12" class="f-green"/><text x="436" y="162" text-anchor="middle" class="t-w t-xs t-b">Done</text></g>
</g>
<g class="v-d6"><rect x="22" y="244" width="474" height="44" rx="22" class="f-ink"/><text x="48" y="271" class="t-w t-s t-b">Ingredients used and cost recorded on {v("mo")}</text></g>
''', "Prep"),
    # 3 Deliver: a transfer from the central kitchen to outlet 2; outlet stock updates on receipt
    svg(f'''
<g class="v-in-up"><rect x="22" y="110" width="132" height="110" rx="8" class="f-cream"/><path d="M16 114l12-30h108l12 30z" class="f-green-f"/><text x="88" y="106" text-anchor="middle" class="t-w t-xs t-b">CENTRAL KITCHEN</text>
  <rect x="40" y="140" width="40" height="80" rx="3" class="f-wood"/><rect x="94" y="136" width="44" height="34" rx="4" class="f-glass"/></g>
<g class="v-in-r"><rect x="366" y="110" width="132" height="110" rx="8" class="f-cream"/><path d="M360 114l12-30h108l12 30z" class="f-tomato"/><text x="432" y="106" text-anchor="middle" class="t-w t-xs t-b">OUTLET 2</text>
  <rect x="440" y="140" width="40" height="80" rx="3" class="f-wood"/><rect x="380" y="136" width="44" height="34" rx="4" class="f-glass"/></g>
<path d="M154 214h212" class="s-dash"/>
<g class="v-van"><rect x="206" y="174" width="96" height="42" rx="8" class="f-white v-card"/><rect x="282" y="180" width="18" height="16" rx="3" class="f-glass"/><rect x="216" y="184" width="54" height="22" rx="4" class="f-sky"/><text x="243" y="199" text-anchor="middle" class="t-w t-xs t-b">COLD</text>
  <circle cx="224" cy="218" r="7" class="f-ink"/><circle cx="284" cy="218" r="7" class="f-ink"/></g>
<g class="v-in-up"><rect x="150" y="20" width="220" height="80" rx="14" class="f-white v-card"/><text x="166" y="44" class="t-mut t-xs t-b">TRANSFER · KITCHEN → OUTLET 2</text><text x="166" y="68" class="t-ink t-s t-b">{v("move")}</text>
  <circle cx="176" cy="86" r="6" class="f-green"/><path d="M182 86h40" class="s-line"/><circle cx="228" cy="86" r="6" class="f-green"/><path d="M234 86h40" class="s-line"/><circle cx="280" cy="86" r="6" class="f-green v-d6"/></g>
<g class="v-d6"><rect x="150" y="246" width="220" height="42" rx="21" class="f-ink"/><path d="M172 267l4 4 8-9" class="s-white"/><text x="192" y="272" class="t-w t-s t-b">Received · stock updated</text></g>
''', "Deliver"),
    # 4 Serve: the guest orders from the QR code at the table; the floor plan, split bills and tips
    svg(f'''
<g class="v-in-up">
  <rect x="22" y="22" width="270" height="200" rx="14" class="f-white v-card"/><text x="38" y="48" class="t-ink t-b">Floor plan</text>
  <rect x="44" y="64" width="54" height="40" rx="8" class="f-chip"/><text x="71" y="89" text-anchor="middle" class="t-mut t-xs t-b">T1</text>
  <rect x="112" y="64" width="54" height="40" rx="8" class="f-chip"/><text x="139" y="89" text-anchor="middle" class="t-mut t-xs t-b">T2</text>
  <rect x="180" y="64" width="94" height="40" rx="8" class="f-mustard-l"/><text x="227" y="89" text-anchor="middle" class="t-ink t-xs t-b">{v("table")} · 4</text>
  <circle cx="71" cy="150" r="28" class="f-chip"/><text x="71" y="155" text-anchor="middle" class="t-mut t-xs t-b">T5</text>
  <circle cx="150" cy="150" r="28" class="f-chip"/><text x="150" y="155" text-anchor="middle" class="t-mut t-xs t-b">T6</text>
  <rect x="198" y="124" width="76" height="52" rx="8" class="f-chip"/><text x="236" y="155" text-anchor="middle" class="t-mut t-xs t-b">Bar</text>
  <g class="v-d5"><rect x="38" y="186" width="120" height="24" rx="12" class="f-green-l"/><text x="98" y="202" text-anchor="middle" class="t-green t-xs t-b">Split bill · 2 ways</text></g>
</g>
<g class="v-shadow"><ellipse cx="398" cy="296" rx="62" ry="8"/></g>
<g class="v-in-r">
  <rect x="340" y="22" width="116" height="262" rx="20" class="f-ink"/><rect x="347" y="32" width="102" height="242" rx="13" class="f-white"/>
  <text x="358" y="58" class="t-ink t-xs t-b">Lantern Kitchen</text><text x="358" y="74" class="t-mut t-xs">Table {v("table")}</text>
  <rect x="356" y="84" width="84" height="70" rx="8" class="f-cream"/>{bowl(398, 122)}
  <text x="358" y="174" class="t-ink t-xs t-b">{v("dish")}</text><text x="358" y="190" class="t-mut t-xs">{v("price")} × {v("qty")}</text>
  <g class="v-press v-d3"><rect x="358" y="204" width="80" height="28" rx="14" class="f-tomato"/><text x="398" y="223" text-anchor="middle" class="t-w t-xs t-b">Order</text></g>
  <g class="v-stamp"><rect x="358" y="240" width="80" height="24" rx="12" class="f-green"/><text x="398" y="257" text-anchor="middle" class="t-w t-xs t-b">Sent</text></g>
</g>
<g class="v-d6"><rect x="22" y="240" width="300" height="48" rx="24" class="f-ink"/><text x="44" y="269" class="t-w t-xs t-b">QR self-order · tips · takeaway, one POS</text></g>
''', "Serve"),
    # 5 Cook: the order shows on the kitchen display with its note; serving the dish deducts its ingredients
    svg(f'''
<g class="v-in-up">
  <rect x="22" y="22" width="300" height="200" rx="14" class="f-ink"/><rect x="30" y="30" width="284" height="184" rx="8" class="f-ink-l"/>
  <text x="44" y="54" class="t-w t-xs t-b">KITCHEN DISPLAY</text>
  <rect x="44" y="66" width="80" height="134" rx="8" class="f-green-f"/><text x="54" y="88" class="t-w t-xs t-b">#41</text><path d="M54 104h56M54 118h40" stroke="rgba(255,255,255,.5)" stroke-width="3" fill="none"/>
  <g class="v-pick"><rect x="132" y="66" width="96" height="134" rx="8" class="f-mustard"/><text x="142" y="88" class="t-ink t-xs t-b">{v("ticket")} · {v("table")}</text>
    <text x="142" y="110" class="t-ink t-xs t-b">{v("qty")} × {v("dish")}</text><rect x="142" y="122" width="76" height="22" rx="5" class="f-white"/><text x="148" y="137" class="t-tomato t-xs t-b">{v("note")}</text></g>
  <rect x="236" y="66" width="70" height="134" rx="8" class="f-green-f"/><text x="246" y="88" class="t-w t-xs t-b">#44</text>
</g>
<g class="v-d4"><rect x="140" y="160" width="80" height="30" rx="15" class="f-green"/><text x="180" y="180" text-anchor="middle" class="t-w t-xs t-b">Ready ✓</text></g>
<g class="v-in-r">
  <rect x="340" y="40" width="156" height="166" rx="14" class="f-white v-card"/><text x="354" y="64" class="t-mut t-xs t-b">STOCK, BY RECIPE</text>
  <g class="v-line" style="--i:2"><text x="354" y="92" class="t-ink t-xs">{v("i1")}</text></g>
  <g class="v-line" style="--i:3"><text x="354" y="116" class="t-ink t-xs">{v("i2")}</text></g>
  <g class="v-line" style="--i:4"><text x="354" y="140" class="t-ink t-xs">{v("i3")}</text></g>
  <rect x="354" y="160" width="128" height="30" rx="8" class="f-tomato-l"/><text x="362" y="180" class="t-tomato t-xs t-b">{v("use")}</text>
</g>
<g class="v-d6"><rect x="22" y="244" width="474" height="44" rx="22" class="f-ink"/><text x="48" y="271" class="t-w t-s t-b">Each dish sold deducts its ingredients</text></g>
''', "Cook"),
    # 6 Close: the session closes to the books per outlet; food cost from recipe usage against sales
    svg(f'''
<g class="v-in-up"><path d="M26 20h160v250l-11 7-11-7-11 7-11-7-11 7-11-7-11 7-11-7-11 7-11-7-11 7-11-7-11 7-11-7-11 7-11-7z" class="f-white v-card"/>
  <text x="106" y="46" text-anchor="middle" class="t-ink t-xs t-b">LANTERN KITCHEN · OUTLET 1</text><text x="106" y="62" text-anchor="middle" class="t-mut t-xs">Session closed</text>
  <path d="M40 74h132" class="s-dash"/>
  <g class="v-line" style="--i:0"><text x="40" y="98" class="t-ink t-xs">Card</text><text x="172" y="98" text-anchor="end" class="t-ink t-xs t-b">4,380.00</text></g>
  <g class="v-line" style="--i:1"><text x="40" y="120" class="t-ink t-xs">QR</text><text x="172" y="120" text-anchor="end" class="t-ink t-xs t-b">1,320.00</text></g>
  <g class="v-line" style="--i:2"><text x="40" y="142" class="t-ink t-xs">Cash</text><text x="172" y="142" text-anchor="end" class="t-ink t-xs t-b">540.00</text></g>
  <path d="M40 156h132" class="s-dash"/>
  <g class="v-line" style="--i:3"><text x="40" y="182" class="t-ink t-s t-b">Takings</text><text x="172" y="182" text-anchor="end" class="t-tomato t-s t-b">S$ 6,240</text></g>
  <g class="v-paid"><rect x="40" y="200" width="86" height="24" rx="12" class="f-green"/><text x="83" y="216" text-anchor="middle" class="t-w t-xs t-b">Posted</text></g>
</g>
<g class="v-in-r">
  <rect x="210" y="20" width="286" height="212" rx="16" class="f-white v-card"/><text x="228" y="46" class="t-ink t-b">Food cost · {v("dish")}</text>
  <circle cx="290" cy="138" r="50" class="s-ring-bg"/>
  <g transform="rotate(-90 290 138)"><circle cx="290" cy="138" r="50" class="v-ring" data-vbar="fc_v" style="--v:{D["fc_v"]};stroke:#E2553D"/></g>
  <text x="290" y="144" text-anchor="middle" class="t-ink t-b t-big">{v("fc")}</text>
  <text x="362" y="104" class="t-mut t-xs t-b">MENU PRICE</text><text x="362" y="124" class="t-ink t-s t-b">{v("price")}</text>
  <text x="362" y="156" class="t-mut t-xs t-b">RECIPE COST</text><text x="362" y="176" class="t-ink t-s t-b">{v("cost")}</text>
</g>
<g class="v-d6"><rect x="210" y="248" width="286" height="40" rx="20" class="f-ink"/><text x="353" y="273" text-anchor="middle" class="t-w t-xs t-b">Per outlet, the same night</text></g>
''', "Close"),
]

CHIPS = [
    ("purchase", '<span data-v="po">PO00156</span> · <span data-v="po_line">10 kg prawns</span> · from the par level'),
    ("mrp", '<span data-v="mo">MO/0091</span> · <span data-v="batch">Laksa paste</span> · <span data-v="batch_qty">20 kg</span>'),
    ("stock", 'Transfer to outlet 2 · <span data-v="move">6 kg laksa paste</span>'),
    ("pos_restaurant", 'Table <span data-v="table">T7</span> · <span data-v="qty">2</span> × <span data-v="dish">Laksa</span> · QR order'),
    ("pos_restaurant", '<span data-v="ticket">#42</span> on the display · <span data-v="note">less spicy</span>'),
    ("accountant", 'Outlet 1 · S$ 6,240 posted · food cost <span data-v="fc">30%</span>'),
]

META = {
    "tag": "Lantern Kitchen · sample",
    "note": "Lantern Kitchen is a sample restaurant group. Every name and figure here is sample data.",
    "samples": SAMPLES,
    "pick": {"label": "Sample dish", "options": [("laksa", "Laksa"), ("crab", "Chilli crab bun"), ("kaya", "Kaya toast set")]},
    "m": {
        "intro": "Tables, the kitchen display, recipes, purchasing and each outlet's takings, in one Odoo database.",
        "flow": "One dish, supplier to the books. Pick a sample dish.",
    },
}
