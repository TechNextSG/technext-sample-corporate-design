# -*- coding: utf-8 -*-
"""Construction (Northline Builders, a sample contractor): one job from tender to final claim. The workflow has a sample
picker: a residential block, an office fit-out or a depot extension; every [data-v] text and [data-vbar] bar follows the
picked job. All figures are sample figures and add up: cost to date is the budget x progress, the projected margin is
(contract - budget) / contract, the purchase order is quantity x unit price."""
from vignettes import svg

SAMPLES = {
    "block": {"job": "Riverside Block B", "kind": "Residential · 6 storeys", "code": "B-14", "contract": "S$ 2.4M", "budget": "S$ 2.1M", "po": "PO00412", "item": "12,000 bricks",
              "unit": "S$ 0.82 each", "po_amt": "S$ 9,840", "crew": "Crane + 4 crew", "task": "Level 3 pour", "hours": "186 h", "pct": "62%", "pct_v": "0.62",
              "cost": "S$ 1.31M", "claim": "#4", "claim_amt": "S$ 380,000", "margin": "12.5%", "margin_v": "0.125"},
    "fitout": {"job": "Harbour Office Fit-out", "kind": "Fit-out · 3 floors", "code": "F-07", "contract": "S$ 860k", "budget": "S$ 740k", "po": "PO00418", "item": "180 ceiling panels",
               "unit": "S$ 34 each", "po_amt": "S$ 6,120", "crew": "6 crew", "task": "Ceiling grid L2", "hours": "142 h", "pct": "48%", "pct_v": "0.48",
               "cost": "S$ 355k", "claim": "#2", "claim_amt": "S$ 128,000", "margin": "14%", "margin_v": "0.14"},
    "depot": {"job": "Depot Extension", "kind": "Industrial · steel frame", "code": "D-03", "contract": "S$ 1.5M", "budget": "S$ 1.28M", "po": "PO00431", "item": "42 steel beams",
              "unit": "S$ 920 each", "po_amt": "S$ 38,640", "crew": "Crane + 5 crew", "task": "Roof steel", "hours": "224 h", "pct": "75%", "pct_v": "0.75",
              "cost": "S$ 960k", "claim": "#5", "claim_amt": "S$ 210,000", "margin": "14.7%", "margin_v": "0.147"},
}
D = SAMPLES["block"]


def v(field: str) -> str:
    return f'<tspan data-v="{field}">{D[field]}</tspan>'


def helmet(x, y, cls="f-hhat"):
    return f'<path d="M{x - 14} {y}a14 13 0 0 1 28 0z" class="{cls}"/><rect x="{x - 18}" y="{y - 2}" width="36" height="5" rx="2.5" class="{cls}"/>'


SCENES = [
    # 1 Win: the tender moves to Won in CRM; the accepted quotation becomes the contract with billing milestones
    svg(f'''
<g class="v-in-up">
  <rect x="22" y="22" width="220" height="196" rx="14" class="f-white v-card"/>
  <text x="38" y="48" class="t-ink t-b">CRM · Tenders</text>
  <rect x="38" y="60" width="188" height="40" rx="8" class="f-chip"/><text x="50" y="85" class="t-mut t-xs">Car park deck · S$ 640k</text>
  <g class="v-pick"><rect x="38" y="108" width="188" height="56" rx="10" class="f-hhat-l"/><text x="50" y="130" class="t-ink t-s t-b">{v("job")}</text><text x="50" y="150" class="t-mut t-xs">{v("contract")} · {v("kind")}</text></g>
  <rect x="38" y="172" width="188" height="36" rx="8" class="f-chip"/><text x="50" y="195" class="t-mut t-xs">School hall · S$ 1.1M</text>
</g>
<g class="v-stamp"><rect x="150" y="96" width="84" height="30" rx="6" class="f-green" transform="rotate(-8 192 111)"/><text x="192" y="117" text-anchor="middle" class="t-w t-s t-b" transform="rotate(-8 192 111)">WON</text></g>
<path d="M246 120h20" class="s-arrow v-d3"/>
<g class="v-in-r">
  <rect x="272" y="22" width="224" height="196" rx="14" class="f-white v-card"/>
  <rect x="272" y="22" width="224" height="38" rx="14" class="f-navy"/><rect x="272" y="44" width="224" height="16" class="f-navy"/><text x="288" y="47" class="t-w t-s t-b">Contract {v("contract")}</text>
  <text x="288" y="82" class="t-mut t-xs t-b">BILLING MILESTONES</text>
  <g class="v-line" style="--i:0"><circle cx="294" cy="102" r="5" class="f-hhat"/><text x="306" y="106" class="t-ink t-xs">Foundations</text><text x="480" y="106" text-anchor="end" class="t-ink t-xs t-b">20%</text></g>
  <g class="v-line" style="--i:1"><circle cx="294" cy="128" r="5" class="f-hhat"/><text x="306" y="132" class="t-ink t-xs">Structure</text><text x="480" y="132" text-anchor="end" class="t-ink t-xs t-b">40%</text></g>
  <g class="v-line" style="--i:2"><circle cx="294" cy="154" r="5" class="f-hhat"/><text x="306" y="158" class="t-ink t-xs">Fit-out</text><text x="480" y="158" text-anchor="end" class="t-ink t-xs t-b">30%</text></g>
  <g class="v-line" style="--i:3"><circle cx="294" cy="180" r="5" class="f-hhat"/><text x="306" y="184" class="t-ink t-xs">Handover</text><text x="480" y="184" text-anchor="end" class="t-ink t-xs t-b">10%</text></g>
</g>
<g class="v-d6"><rect x="22" y="240" width="474" height="48" rx="24" class="f-ink"/>{helmet(54, 270, "f-hhat")}<text x="82" y="270" class="t-w t-s t-b">Quotation accepted · contract {v("contract")}</text></g>
''', "Win"),
    # 2 Set up: the job becomes a project with stages, tasks and an analytic budget
    svg(f'''
<g class="v-in-up">
  <rect x="22" y="20" width="474" height="200" rx="16" class="f-white v-card"/>
  <text x="40" y="46" class="t-ink t-b">Project · {v("job")}</text><text x="478" y="46" text-anchor="end" class="t-mut t-xs">Job {v("code")}</text>
  <rect x="38" y="58" width="102" height="148" rx="10" class="f-chip"/><text x="48" y="76" class="t-mut t-xs t-b">FOUNDATIONS</text>
  <rect x="150" y="58" width="102" height="148" rx="10" class="f-chip"/><text x="160" y="76" class="t-mut t-xs t-b">STRUCTURE</text>
  <rect x="262" y="58" width="102" height="148" rx="10" class="f-chip"/><text x="272" y="76" class="t-mut t-xs t-b">MEP</text>
  <rect x="374" y="58" width="106" height="148" rx="10" class="f-chip"/><text x="384" y="76" class="t-mut t-xs t-b">FINISHES</text>
  <g class="v-line" style="--i:0"><rect x="46" y="86" width="86" height="34" rx="6" class="f-white"/><rect x="46" y="86" width="5" height="34" rx="2" class="f-green"/><text x="56" y="107" class="t-ink t-xs">Piling</text></g>
  <g class="v-line" style="--i:1"><rect x="46" y="126" width="86" height="34" rx="6" class="f-white"/><rect x="46" y="126" width="5" height="34" rx="2" class="f-green"/><text x="56" y="147" class="t-ink t-xs">Pile caps</text></g>
  <g class="v-line" style="--i:2"><rect x="158" y="86" width="86" height="34" rx="6" class="f-white"/><rect x="158" y="86" width="5" height="34" rx="2" class="f-hhat"/><text x="168" y="107" class="t-ink t-xs">{v("task")}</text></g>
  <g class="v-line" style="--i:3"><rect x="270" y="86" width="86" height="34" rx="6" class="f-white"/><rect x="270" y="86" width="5" height="34" rx="2" class="f-line"/><text x="280" y="107" class="t-ink t-xs">Conduits</text></g>
  <g class="v-line" style="--i:4"><rect x="382" y="86" width="90" height="34" rx="6" class="f-white"/><rect x="382" y="86" width="5" height="34" rx="2" class="f-line"/><text x="392" y="107" class="t-ink t-xs">Tiling</text></g>
</g>
<g class="v-d5">
  <rect x="22" y="236" width="474" height="54" rx="14" class="f-white v-card"/>
  <text x="40" y="258" class="t-mut t-xs t-b">ANALYTIC BUDGET</text><text x="478" y="258" text-anchor="end" class="t-ink t-xs t-b">{v("budget")}</text>
  <rect x="40" y="268" width="438" height="10" rx="5" class="f-chip"/><rect x="40" y="268" width="438" height="10" rx="5" class="f-hhat v-hbar" data-vbar="pct_v" style="--v:{D["pct_v"]}"/>
</g>
''', "Set up"),
    # 3 Buy: materials and subcontractors as purchase orders coded to the job; the bill matches the delivery
    svg(f'''
<g class="v-in-up">
  <rect x="22" y="22" width="250" height="200" rx="14" class="f-white v-card"/>
  <rect x="22" y="22" width="250" height="40" rx="14" class="f-hhat"/><rect x="22" y="46" width="250" height="16" class="f-hhat"/><text x="38" y="48" class="t-ink t-s t-b">Purchase order {v("po")}</text>
  <text x="38" y="86" class="t-ink t-xs t-b">Granite Supply Co.</text><text x="38" y="104" class="t-mut t-xs">Delivered to site · job {v("code")}</text>
  <g class="v-line" style="--i:1"><rect x="38" y="116" width="218" height="40" rx="8" class="f-chip"/><text x="48" y="134" class="t-ink t-xs t-b">{v("item")}</text><text x="48" y="149" class="t-mut t-xs">{v("unit")}</text></g>
  <path d="M38 170h218" class="s-line"/>
  <g class="v-line" style="--i:2"><text x="38" y="200" class="t-ink t-b">Total</text><text x="256" y="200" text-anchor="end" class="t-ink t-b">{v("po_amt")}</text></g>
</g>
<g class="v-van"><rect x="300" y="128" width="120" height="58" rx="6" class="f-white v-card"/><rect x="420" y="146" width="44" height="40" rx="6" class="f-hhat"/><rect x="430" y="152" width="24" height="14" rx="2" class="f-glass"/>
  <rect x="310" y="138" width="34" height="20" rx="2" class="f-brick"/><rect x="348" y="138" width="34" height="20" rx="2" class="f-brick"/><rect x="329" y="160" width="34" height="20" rx="2" class="f-brick"/>
  <circle cx="330" cy="190" r="10" class="f-ink"/><circle cx="440" cy="190" r="10" class="f-ink"/></g>
<g class="v-d6">
  <rect x="300" y="22" width="196" height="88" rx="14" class="f-white v-card"/><text x="316" y="46" class="t-mut t-xs t-b">VENDOR BILL</text>
  <text x="316" y="70" class="t-ink t-xs t-b">{v("po_amt")}</text><circle cx="470" cy="66" r="12" class="f-green"/><path d="M464 66l4 4 7-8" class="s-white"/><text x="316" y="94" class="t-green t-xs t-b">Matched to the delivery</text>
</g>
<g class="v-d5"><rect x="22" y="244" width="474" height="44" rx="22" class="f-ink"/><text x="48" y="271" class="t-w t-s t-b">Cost lands on job {v("code")} · {v("job")}</text></g>
''', "Buy"),
    # 4 Site: crews and the crane scheduled in Planning; field work on a map, offline-ready
    svg(f'''
<g class="v-in-up">
  <rect x="22" y="22" width="474" height="190" rx="16" class="f-white v-card"/>
  <text x="40" y="48" class="t-ink t-b">Planning · this week</text>
  <text x="170" y="74" class="t-mut t-xs t-b">MON</text><text x="236" y="74" class="t-mut t-xs t-b">TUE</text><text x="302" y="74" class="t-mut t-xs t-b">WED</text><text x="368" y="74" class="t-mut t-xs t-b">THU</text><text x="434" y="74" class="t-mut t-xs t-b">FRI</text>
  <text x="40" y="104" class="t-ink t-xs t-b">Tower crane</text><text x="40" y="140" class="t-ink t-xs t-b">Crew A</text><text x="40" y="176" class="t-ink t-xs t-b">Crew B</text>
  <path d="M40 116h440M40 152h440" class="s-line"/>
  <rect x="160" y="88" width="190" height="22" rx="6" class="f-hhat v-bar" style="--i:0"/><rect x="360" y="88" width="120" height="22" rx="6" class="f-navy v-bar" style="--i:1"/>
  <rect x="160" y="124" width="250" height="22" rx="6" class="f-sky v-bar" style="--i:2"/>
  <rect x="226" y="160" width="250" height="22" rx="6" class="f-orange-c v-bar" style="--i:3"/>
  <text x="366" y="104" class="t-w t-xs t-b">{v("task")}</text>
</g>
<g class="v-d5"><rect x="22" y="230" width="250" height="58" rx="14" class="f-white v-card"/><path d="M50 248a12 12 0 0 1 24 0c0 10-12 22-12 22s-12-12-12-22z" class="f-pink"/><circle cx="62" cy="248" r="4" class="f-white"/>
  <text x="84" y="254" class="t-ink t-xs t-b">{v("crew")}</text><text x="84" y="272" class="t-mut t-xs">On the map · {v("job")}</text></g>
<g class="v-stamp"><rect x="292" y="238" width="204" height="44" rx="22" class="f-ink"/><path d="M314 262a12 12 0 0 1 18 0M318 266a6 6 0 0 1 10 0" class="s-white s-thin"/><text x="344" y="266" class="t-w t-xs t-b">Works offline on site</text></g>
''', "Site"),
    # 5 Track: site timesheets against tasks, with progress photos
    svg(f'''
<g class="v-shadow"><ellipse cx="128" cy="300" rx="78" ry="9"/></g>
<g class="v-in-up">
  <rect x="58" y="20" width="140" height="272" rx="22" class="f-ink"/><rect x="65" y="30" width="126" height="252" rx="15" class="f-white"/>
  <text x="78" y="58" class="t-ink t-s t-b">Timesheet</text><text x="78" y="76" class="t-mut t-xs">{v("task")}</text>
  <rect x="76" y="86" width="104" height="70" rx="8" class="f-sky-l"/><rect x="88" y="112" width="20" height="44" class="f-concrete"/><rect x="112" y="98" width="20" height="58" class="f-concrete"/><rect x="136" y="122" width="20" height="34" class="f-concrete"/>
  <rect x="84" y="108" width="80" height="4" class="f-concrete"/><text x="128" y="150" text-anchor="middle" class="t-ink t-xs t-b">photo</text>
  <g class="v-press v-d3"><rect x="76" y="170" width="104" height="30" rx="15" class="f-hhat"/><text x="128" y="190" text-anchor="middle" class="t-ink t-xs t-b">Log 8 h</text></g>
  <text x="78" y="226" class="t-mut t-xs">This week</text><text x="180" y="226" text-anchor="end" class="t-ink t-xs t-b">{v("hours")}</text>
</g>
<path d="M206 150h22" class="s-arrow v-d3"/>
<g class="v-in-r">
  <rect x="236" y="40" width="260" height="168" rx="14" class="f-white v-card"/>
  <text x="252" y="66" class="t-mut t-xs t-b">PROGRESS · {v("job")}</text>
  <circle cx="310" cy="136" r="44" class="s-ring-bg"/>
  <g transform="rotate(-90 310 136)"><circle cx="310" cy="136" r="44" class="v-ring" data-vbar="pct_v" style="--v:{D["pct_v"]};stroke:#E0A800"/></g>
  <text x="310" y="142" text-anchor="middle" class="t-ink t-b t-big2">{v("pct")}</text>
  <text x="372" y="118" class="t-ink t-xs t-b">Notes and photos</text><text x="372" y="136" class="t-mut t-xs">on the task, for</text><text x="372" y="152" class="t-mut t-xs">the office to see</text>
</g>
<g class="v-d6"><rect x="236" y="228" width="260" height="56" rx="14" class="f-ink"/><text x="256" y="252" class="t-w t-xs t-b">Labour on the job</text><text x="256" y="272" class="t-sun t-xs t-b">{v("hours")} · {v("task")}</text></g>
''', "Track"),
    # 6 Bill: the progress claim is invoiced; the project shows budget, cost to date and margin
    svg(f'''
<g class="v-in-up">
  <rect x="22" y="22" width="210" height="226" rx="14" class="f-white v-card"/>
  <rect x="22" y="22" width="210" height="40" rx="14" class="f-navy"/><rect x="22" y="46" width="210" height="16" class="f-navy"/><text x="38" y="48" class="t-w t-s t-b">Progress claim {v("claim")}</text>
  <text x="38" y="88" class="t-ink t-xs t-b">{v("job")}</text><text x="38" y="106" class="t-mut t-xs">Milestone reached · {v("pct")}</text>
  <path d="M38 120h178" class="s-line"/><text x="38" y="150" class="t-mut t-xs t-b">AMOUNT</text><text x="38" y="178" class="t-ink t-b t-mid">{v("claim_amt")}</text>
  <g class="v-paid"><rect x="38" y="196" width="80" height="26" rx="13" class="f-green"/><text x="78" y="214" text-anchor="middle" class="t-w t-xs t-b">Invoiced</text></g>
</g>
<g class="v-in-r">
  <rect x="250" y="22" width="246" height="226" rx="14" class="f-white v-card"/>
  <text x="266" y="48" class="t-ink t-s t-b">Job overview</text>
  <text x="266" y="78" class="t-mut t-xs t-b">CONTRACT</text><text x="480" y="78" text-anchor="end" class="t-ink t-xs t-b">{v("contract")}</text>
  <text x="266" y="102" class="t-mut t-xs t-b">BUDGET</text><text x="480" y="102" text-anchor="end" class="t-ink t-xs t-b">{v("budget")}</text>
  <rect x="266" y="110" width="214" height="12" rx="6" class="f-chip"/><rect x="266" y="110" width="214" height="12" rx="6" class="f-navy v-hbar" style="--v:1"/>
  <text x="266" y="144" class="t-mut t-xs t-b">COST TO DATE</text><text x="480" y="144" text-anchor="end" class="t-ink t-xs t-b">{v("cost")}</text>
  <rect x="266" y="152" width="214" height="12" rx="6" class="f-chip"/><rect x="266" y="152" width="214" height="12" rx="6" class="f-hhat v-hbar" data-vbar="pct_v" style="--v:{D["pct_v"]}"/>
  <rect x="266" y="184" width="214" height="48" rx="10" class="f-hhat-l"/><text x="280" y="205" class="t-mut t-xs t-b">PROJECTED MARGIN</text><text x="280" y="224" class="t-ink t-s t-b">{v("margin")}</text>
</g>
<g class="v-d6"><rect x="22" y="262" width="474" height="34" rx="17" class="f-ink"/><text x="259" y="284" text-anchor="middle" class="t-w t-xs t-b">The margin is visible before hand-over, not after the final account</text></g>
''', "Bill"),
]

CHIPS = [
    ("crm", '<span data-v="job">Riverside Block B</span> · <span data-v="contract">S$ 2.4M</span> · won'),
    ("project", 'Job <span data-v="code">B-14</span> · 4 stages · budget <span data-v="budget">S$ 2.1M</span>'),
    ("purchase", '<span data-v="po">PO00412</span> · <span data-v="item">12,000 bricks</span> · <span data-v="po_amt">S$ 9,840</span>'),
    ("planning", '<span data-v="crew">Crane + 4 crew</span> · <span data-v="task">Level 3 pour</span>'),
    ("hr_timesheet", '<span data-v="hours">186 h</span> this week · progress <span data-v="pct">62%</span>'),
    ("accountant", 'Claim <span data-v="claim">#4</span> · <span data-v="claim_amt">S$ 380,000</span> · margin <span data-v="margin">12.5%</span>'),
]

META = {
    "tag": "Northline Builders · sample",
    "note": "Northline Builders is a sample contractor. Every name and figure here is sample data.",
    "samples": SAMPLES,
    "pick": {"label": "Sample job", "options": [("block", "Residential block"), ("fitout", "Office fit-out"), ("depot", "Depot extension")]},
    "m": {
        "intro": "Each job as a project with its budget, purchases, timesheets and progress claims, in one Odoo database.",
        "flow": "One job, tender to final claim. Pick a sample job.",
    },
}
