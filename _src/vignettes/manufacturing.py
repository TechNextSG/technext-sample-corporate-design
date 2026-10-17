# -*- coding: utf-8 -*-
"""Manufacturing (Keystone Works, a sample maker of steel shelving and workshop furniture): one order from the sales order
to the real cost. The workflow has a sample picker: a shelf unit, a workbench or a tool trolley; every [data-v] text and
[data-vbar] bar follows the picked product. All figures are sample figures and add up: unit cost = components + work
centres + extras, margin = (price - cost) / price."""
from vignettes import svg

SAMPLES = {
    "shelf": {"product": "Shelf unit", "qty": "40", "so": "SO 0418", "mo": "MO/0412", "c1": "Steel panels × 5", "c2": "Brackets × 8", "c3": "M8 bolts × 32",
              "po": "PO00377", "po_line": "160 brackets", "lead": "5 days", "done": "26", "comp": "S$ 108.10", "wcost": "S$ 50.30", "extra": "S$ 28.00",
              "total": "S$ 186.40", "comp_v": "0.58", "wc_v": "0.27", "ex_v": "0.15", "price": "S$ 249.00", "margin": "25%", "margin_v": "0.25"},
    "bench": {"product": "Workbench", "qty": "12", "so": "SO 0421", "mo": "MO/0415", "c1": "Steel top × 1", "c2": "Legs × 4", "c3": "M10 bolts × 16",
              "po": "PO00381", "po_line": "48 legs", "lead": "4 days", "done": "7", "comp": "S$ 212.00", "wcost": "S$ 86.50", "extra": "S$ 41.50",
              "total": "S$ 340.00", "comp_v": "0.62", "wc_v": "0.25", "ex_v": "0.12", "price": "S$ 459.00", "margin": "26%", "margin_v": "0.26"},
    "trolley": {"product": "Tool trolley", "qty": "25", "so": "SO 0426", "mo": "MO/0419", "c1": "Drawers × 4", "c2": "Castors × 4", "c3": "Handles × 2",
                "po": "PO00384", "po_line": "100 castors", "lead": "7 days", "done": "18", "comp": "S$ 96.40", "wcost": "S$ 38.60", "extra": "S$ 17.00",
                "total": "S$ 152.00", "comp_v": "0.63", "wc_v": "0.25", "ex_v": "0.11", "price": "S$ 209.00", "margin": "27%", "margin_v": "0.27"},
}
D = SAMPLES["shelf"]


def v(field: str) -> str:
    return f'<tspan data-v="{field}">{D[field]}</tspan>'


SCENES = [
    # 1 Order: the sales order is confirmed; its route makes to order, so a manufacturing order is created
    svg(f'''
<g class="v-in-up">
  <rect x="22" y="24" width="236" height="196" rx="14" class="f-white v-card"/>
  <rect x="22" y="24" width="236" height="40" rx="14" class="f-mteal"/><rect x="22" y="48" width="236" height="16" class="f-mteal"/><text x="38" y="50" class="t-w t-s t-b">Sales order {v("so")}</text>
  <text x="38" y="88" class="t-ink t-xs t-b">Northwind Offices · sample</text>
  <g class="v-line" style="--i:1"><rect x="38" y="100" width="204" height="40" rx="8" class="f-chip"/><text x="50" y="125" class="t-ink t-s t-b">{v("qty")} × {v("product")}</text></g>
  <g class="v-line" style="--i:2"><rect x="38" y="150" width="128" height="26" rx="13" class="f-morange-l"/><text x="102" y="168" text-anchor="middle" class="t-ink t-xs t-b">Make to order</text></g>
  <g class="v-paid"><rect x="38" y="186" width="96" height="24" rx="12" class="f-green"/><text x="86" y="202" text-anchor="middle" class="t-w t-xs t-b">Confirmed</text></g>
</g>
<path d="M262 120h22" class="s-arrow v-d3"/>
<g class="v-in-r">
  <rect x="290" y="56" width="206" height="128" rx="14" class="f-white v-card"/><text x="306" y="82" class="t-mut t-xs t-b">MANUFACTURING ORDER</text>
  <text x="306" y="110" class="t-ink t-s t-b">{v("mo")}</text><text x="306" y="132" class="t-mut t-xs">{v("qty")} × {v("product")}</text>
  <rect x="306" y="146" width="86" height="22" rx="11" class="f-mteal-l"/><text x="349" y="161" text-anchor="middle" class="t-teal t-xs t-b">Created</text>
</g>
<g class="v-d6"><rect x="22" y="244" width="474" height="44" rx="22" class="f-ink"/><text x="48" y="271" class="t-w t-s t-b">The order triggers production by its route</text></g>
''', "Order"),
    # 2 Plan: work orders scheduled on work centre capacity; the MPS plans ahead from the forecast
    svg(f'''
<g class="v-in-up">
  <rect x="22" y="20" width="474" height="200" rx="16" class="f-white v-card"/><text x="40" y="46" class="t-ink t-b">Work centres · week 42</text><text x="478" y="46" text-anchor="end" class="t-mut t-xs">{v("mo")}</text>
  <text x="150" y="70" class="t-mut t-xs t-b">MON</text><text x="220" y="70" class="t-mut t-xs t-b">TUE</text><text x="290" y="70" class="t-mut t-xs t-b">WED</text><text x="360" y="70" class="t-mut t-xs t-b">THU</text><text x="430" y="70" class="t-mut t-xs t-b">FRI</text>
  <text x="40" y="100" class="t-ink t-xs t-b">Laser cut</text><text x="40" y="140" class="t-ink t-xs t-b">Weld cell 2</text><text x="40" y="180" class="t-ink t-xs t-b">Paint line</text>
  <path d="M40 114h440M40 154h440" class="s-line"/>
  <rect x="140" y="84" width="130" height="22" rx="6" class="f-msky v-bar" style="--i:0"/><rect x="250" y="124" width="150" height="22" rx="6" class="f-morange v-bar" style="--i:1"/><rect x="380" y="164" width="100" height="22" rx="6" class="f-green v-bar" style="--i:2"/>
  <text x="258" y="140" class="t-w t-xs t-b">{v("mo")}</text>
  <rect x="140" y="192" width="340" height="8" rx="4" class="f-chip"/><rect x="140" y="192" width="340" height="8" rx="4" class="f-mteal v-hbar" style="--v:.82"/><text x="40" y="200" class="t-mut t-xs">Load 82%</text>
</g>
<g class="v-d5"><rect x="22" y="236" width="474" height="54" rx="14" class="f-white v-card"/><text x="40" y="260" class="t-mut t-xs t-b">MPS · FORECAST</text>
  <text x="150" y="268" class="t-ink t-xs t-b">W43 · 60</text><text x="240" y="268" class="t-ink t-xs t-b">W44 · 55</text><text x="330" y="268" class="t-ink t-xs t-b">W45 · 70</text><text x="420" y="268" class="t-ink t-xs t-b">W46 · 65</text></g>
''', "Plan"),
    # 3 Source: the bill of materials shows what is missing; a purchase order goes out with the vendor's lead time
    svg(f'''
<g class="v-in-up">
  <rect x="22" y="22" width="230" height="200" rx="14" class="f-white v-card"/><text x="38" y="48" class="t-mut t-xs t-b">BILL OF MATERIALS</text><text x="38" y="70" class="t-ink t-s t-b">{v("product")}</text>
  <g class="v-line" style="--i:0"><rect x="38" y="84" width="198" height="34" rx="8" class="f-chip"/><text x="50" y="106" class="t-ink t-xs">{v("c1")}</text><circle cx="220" cy="101" r="8" class="f-green"/></g>
  <g class="v-line" style="--i:1"><rect x="38" y="126" width="198" height="34" rx="8" class="f-morange-l"/><text x="50" y="148" class="t-ink t-xs t-b">{v("c2")}</text><circle cx="220" cy="143" r="8" class="f-morange"/><text x="220" y="147" text-anchor="middle" class="t-w t-xs t-b">!</text></g>
  <g class="v-line" style="--i:2"><rect x="38" y="168" width="198" height="34" rx="8" class="f-chip"/><text x="50" y="190" class="t-ink t-xs">{v("c3")}</text><circle cx="220" cy="185" r="8" class="f-green"/></g>
</g>
<path d="M256 143h24" class="s-arrow v-d3"/>
<g class="v-in-r">
  <rect x="286" y="40" width="210" height="166" rx="14" class="f-white v-card"/><rect x="286" y="40" width="210" height="36" rx="14" class="f-morange"/><rect x="286" y="62" width="210" height="14" class="f-morange"/>
  <text x="302" y="64" class="t-w t-s t-b">{v("po")}</text><text x="302" y="102" class="t-ink t-xs t-b">Apex Fasteners · sample</text><text x="302" y="124" class="t-ink t-s t-b">{v("po_line")}</text>
  <text x="302" y="148" class="t-mut t-xs">Lead time {v("lead")}</text><rect x="302" y="160" width="120" height="22" rx="11" class="f-chip"/><text x="362" y="175" text-anchor="middle" class="t-ink t-xs t-b">Reordering rule</text>
</g>
<g class="v-stamp"><rect x="96" y="244" width="328" height="44" rx="22" class="f-ink"/><path d="M122 266l5 5 9-10" class="s-white"/><text x="146" y="271" class="t-w t-s t-b">Arrives before the weld starts</text></g>
''', "Source"),
    # 4 Make: the operator follows the work order on a tablet, scans quantities and logs time; the next step starts as parts flow
    svg(f'''
<g class="v-in-up">
  <rect x="40" y="20" width="250" height="196" rx="18" class="f-ink"/><rect x="50" y="30" width="230" height="176" rx="10" class="f-white"/>
  <rect x="50" y="30" width="230" height="30" rx="10" class="f-mteal"/><rect x="50" y="48" width="230" height="12" class="f-mteal"/><text x="64" y="51" class="t-w t-xs t-b">WORK ORDER · WELD CELL 2</text>
  <text x="64" y="86" class="t-ink t-s t-b">{v("product")}</text><text x="64" y="104" class="t-mut t-xs">{v("mo")}</text>
  <text x="64" y="146" class="t-ink t-b t-big">{v("done")}</text><text x="118" y="146" class="t-mut t-s t-b">/ {v("qty")}</text>
  <g class="v-press v-d3"><rect x="186" y="118" width="80" height="32" rx="16" class="f-green"/><text x="226" y="139" text-anchor="middle" class="t-w t-xs t-b">+ Scan</text></g>
  <rect x="64" y="166" width="202" height="10" rx="5" class="f-chip"/><rect x="64" y="166" width="202" height="10" rx="5" class="f-green v-hbar" style="--v:.65"/>
  <text x="64" y="196" class="t-mut t-xs">Timer · 00:42:18</text>
</g>
<g class="v-in-r"><rect x="318" y="40" width="178" height="120" rx="14" class="f-white v-card"/><text x="332" y="64" class="t-mut t-xs t-b">BARCODE</text>
  <g>{''.join(f'<rect x="{336 + i * 5.4:.1f}" y="76" width="{3 if i % 3 else 1.6}" height="40" class="f-ink"/>' for i in range(26))}</g><text x="332" y="140" class="t-ink t-xs t-b">Quantity recorded</text></g>
<g class="v-d6"><rect x="318" y="178" width="178" height="40" rx="20" class="f-morange-l"/><text x="407" y="203" text-anchor="middle" class="t-ink t-xs t-b">Paint starts as parts flow</text></g>
<g class="v-d6"><rect x="22" y="244" width="474" height="44" rx="22" class="f-ink"/><text x="48" y="271" class="t-w t-s t-b">Odoo 20 · continuous production between steps</text></g>
''', "Make"),
    # 5 Check: quality control points in the flow; a failure would raise an alert
    svg(f'''
<g class="v-in-up">
  <rect x="22" y="22" width="300" height="200" rx="14" class="f-white v-card"/><text x="38" y="48" class="t-ink t-b">Quality checks · {v("mo")}</text>
  <g class="v-line" style="--i:0"><rect x="38" y="62" width="268" height="40" rx="8" class="f-chip"/><text x="50" y="87" class="t-ink t-xs t-b">Bracket spacing · 400 mm ± 1</text><circle cx="288" cy="82" r="10" class="f-green"/><path d="M283 82l4 4 7-8" class="s-white s-thin"/></g>
  <g class="v-line" style="--i:1"><rect x="38" y="110" width="268" height="40" rx="8" class="f-chip"/><text x="50" y="135" class="t-ink t-xs t-b">Weld visual · photo</text><circle cx="288" cy="130" r="10" class="f-green"/><path d="M283 130l4 4 7-8" class="s-white s-thin"/></g>
  <g class="v-line" style="--i:2"><rect x="38" y="158" width="268" height="40" rx="8" class="f-chip"/><text x="50" y="183" class="t-ink t-xs t-b">Paint finish · pass / fail</text><circle cx="288" cy="178" r="10" class="f-green"/><path d="M283 178l4 4 7-8" class="s-white s-thin"/></g>
</g>
<g class="v-in-r"><rect x="344" y="40" width="152" height="120" rx="14" class="f-white v-card"/>
  <path d="M368 120h88v-14h-16v-40h-12v40h-60z" class="f-msteel"/><rect x="380" y="70" width="10" height="36" class="f-msteel"/><text x="420" y="146" text-anchor="middle" class="t-mut t-xs">calliper</text></g>
<g class="v-stamp"><rect x="344" y="176" width="152" height="40" rx="20" class="f-green"/><text x="420" y="201" text-anchor="middle" class="t-w t-s t-b">All passed</text></g>
<g class="v-d6"><rect x="22" y="244" width="474" height="44" rx="22" class="f-ink"/><text x="48" y="271" class="t-w t-s t-b">A failed check would raise a quality alert</text></g>
''', "Check"),
    # 6 Cost: component, work centre and extra costs roll up to the order; valuation posts to Accounting
    svg(f'''
<g class="v-in-up">
  <rect x="22" y="20" width="474" height="212" rx="16" class="f-white v-card"/><text x="40" y="46" class="t-ink t-b">Cost per unit · {v("product")}</text><text x="478" y="46" text-anchor="end" class="t-mut t-xs">{v("mo")}</text>
  <text x="40" y="80" class="t-mut t-xs t-b">COMPONENTS</text><text x="300" y="80" text-anchor="end" class="t-ink t-xs t-b">{v("comp")}</text>
  <rect x="40" y="88" width="260" height="14" rx="7" class="f-chip"/><rect x="40" y="88" width="260" height="14" rx="7" class="f-msky v-hbar" data-vbar="comp_v" style="--v:{D["comp_v"]}"/>
  <text x="40" y="126" class="t-mut t-xs t-b">WORK CENTRES</text><text x="300" y="126" text-anchor="end" class="t-ink t-xs t-b">{v("wcost")}</text>
  <rect x="40" y="134" width="260" height="14" rx="7" class="f-chip"/><rect x="40" y="134" width="260" height="14" rx="7" class="f-morange v-hbar" data-vbar="wc_v" style="--v:{D["wc_v"]}"/>
  <text x="40" y="172" class="t-mut t-xs t-b">EXTRAS</text><text x="300" y="172" text-anchor="end" class="t-ink t-xs t-b">{v("extra")}</text>
  <rect x="40" y="180" width="260" height="14" rx="7" class="f-chip"/><rect x="40" y="180" width="260" height="14" rx="7" class="f-green v-hbar" data-vbar="ex_v" style="--v:{D["ex_v"]}"/>
  <rect x="324" y="70" width="156" height="140" rx="12" class="f-mteal-l"/><text x="340" y="96" class="t-mut t-xs t-b">REAL COST</text><text x="340" y="124" class="t-ink t-b t-mid">{v("total")}</text>
  <text x="340" y="158" class="t-mut t-xs">Sells at {v("price")}</text><text x="340" y="190" class="t-teal t-s t-b">Margin {v("margin")}</text>
</g>
<g class="v-d6"><rect x="22" y="250" width="474" height="40" rx="20" class="f-ink"/><text x="259" y="275" text-anchor="middle" class="t-w t-xs t-b">Stock valuation posts to Accounting automatically</text></g>
''', "Cost"),
]

CHIPS = [
    ("sale", '<span data-v="so">SO 0418</span> · <span data-v="qty">40</span> × <span data-v="product">Shelf unit</span> · make to order'),
    ("mrp", '<span data-v="mo">MO/0412</span> · cut, weld, paint · week 42'),
    ("purchase", '<span data-v="po">PO00377</span> · <span data-v="po_line">160 brackets</span> · <span data-v="lead">5 days</span>'),
    ("mrp", 'Weld cell 2 · <span data-v="done">26</span> of <span data-v="qty">40</span> done'),
    ("quality_control", '3 of 3 checks passed · <span data-v="mo">MO/0412</span>'),
    ("accountant", '<span data-v="total">S$ 186.40</span> per unit · margin <span data-v="margin">25%</span>'),
]

META = {
    "tag": "Keystone Works · sample",
    "note": "Keystone Works is a sample manufacturer. Every name and figure here is sample data.",
    "samples": SAMPLES,
    "pick": {"label": "Sample product", "options": [("shelf", "Shelf unit"), ("bench", "Workbench"), ("trolley", "Tool trolley")]},
    "m": {
        "intro": "Bills of materials, work orders, quality checks, purchasing and the real cost of every order, in one Odoo database.",
        "flow": "One order, sales order to real cost. Pick a sample product.",
    },
}
