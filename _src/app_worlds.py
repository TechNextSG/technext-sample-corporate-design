# -*- coding: utf-8 -*-
"""World heroes for the three Odoo apps in the menu (Accounting, Sales, Inventory). build.app_page() swaps the generated
stage hero for hero(mod) when the app is listed here; every other section of the app page stays generated.
Each world is its own scene (assets/js/worlds/<world>.js, assets/css/worlds/<world>.css, _src/vignettes/<world>.py).
Hotspot coordinates are set units (1000 x 600, floor 470): --x/--y are the centre."""

WORLD = {"accountant": "app-acc", "sale": "app-sales", "stock": "app-stock"}
# The calm layer (9 Oct 2026): the "who implements it" facts band repeats the hero facts strip, and the CTA's themed
# illustration crowds the one end card, so both stay out while CALM is on. False brings them back as they were.
CALM = True
STEP_NO = {"accountant": lambda n: f"JE {n:02d}", "sale": lambda n: f"{n:02d}", "stock": lambda n: f"G{n}"}


def _btn(kind, d):
    cls = "ixw-cast" if kind == "cast" else ("ixw-toy" if kind == "toy" else "ixw-hot")
    if d.get("below"):
        cls += " ixw-hot--below"
    style = f'--x:{d["x"]};--y:{d["y"]};--w:{d["w"]};--h:{d["h"]}'
    if kind == "cast":
        return (f'<button class="{cls}" type="button" data-cast="{d["id"]}" data-near="{d["near"]}" data-who="{d["who"]}" data-role="{d["role"]}" '
                f'data-say="{d["say"]}" style="{style}" aria-label="Say hi to {d["aria"]} (illustration)"><span class="ixw-hot-lab" aria-hidden="true">{{{{icon:smile}}}}<b>{d["lab"]}</b>'
                + (f'<i>{d["sub"]}</i>' if d.get("sub") else "") + '</span></button>')
    if kind == "toy":
        return (f'<button class="{cls}" type="button" data-toy="{d["id"]}" data-near="{d["near"]}" data-pose="{d.get("pose", "wow")}" data-say="{d["say"]}" style="{style}" '
                f'aria-label="{d["aria"]}"><span class="ixw-hot-lab" aria-hidden="true">{{{{icon:sparkle}}}}<b>{d["lab"]}</b></span></button>')
    return (f'<button class="{cls}" type="button" data-hot="{d["id"]}" data-nx="{d["near"]}" data-pose="{d.get("pose", "point-left")}" data-rec="{d["rec"]}" '
            f'data-say="{d["say"]}" style="{style}" aria-pressed="false"><span class="ixw-hot-lab">{d["icon"]}<b>{d["lab"]}</b></span></button>')


def _strip(md):
    return md.replace("**", "")


def hero(mod: str, h1: str, headline: str, lead: str) -> str:
    sp = SPEC[mod]
    w, home = WORLD[mod], sp["home"]
    nx, ny = home.split(",")
    casts = "\n      ".join(_btn("cast", c) for c in sp["cast"])
    hots = "\n      ".join(_btn("hot", h) for h in sp["hots"])
    toys = "\n      ".join(_btn("toy", t) for t in sp["toys"])
    av = "".join(f'<b data-for="{c["id"]}" style="--c:{c["col"]}">{c["lab"][0]}</b>' for c in sp["cast"])
    dots = "".join(f'<button type="button" data-ixw-dot aria-label="Stop {k + 1}: {lab}"></button>'
                   for k, lab in enumerate(["welcome"] + [h["dot"] for h in sp["hots"]] + ["summary"]))
    intro = sp["intro"]
    intro_html = intro.replace("**", "<b>", 1)
    while "**" in intro_html:
        intro_html = intro_html.replace("**", "</b>", 1).replace("**", "<b>", 1)
    glance = "".join(f'<div><dt>{{{{icon:{g[0]}}}}}{g[1]}</dt><dd>{g[2]}</dd></div>' for g in sp["glance"])
    return f'''<section class="ixw-hero" data-ixw-hero data-world="{w}" data-home="{home}" aria-labelledby="ixw-h1">
  <canvas class="ixw-cv" data-ixw-cv aria-hidden="true"></canvas>
  <div class="container ixw-hero-in">
    <div class="ixw-copy">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="{{{{ROOT}}}}index.html">Home</a><span>Odoo</span><span><a href="{{{{ROOT}}}}odoo/apps.html">Apps</a></span><span>{sp["crumb"]}</span></nav>
      <p class="ixw-ep"><a class="ixw-ep-tag" href="{{{{ROOT}}}}nexi-explains.html">{{{{icon:play}}}}Nexi Explains</a><span class="app-ep">{{{{odoo:{mod}:18}}}}Odoo {sp["crumb"]}</span></p>
      <h1 id="ixw-h1"><span class="hand h1-hand">{sp["hand"]}</span>Odoo {h1} in Singapore &amp; the Philippines</h1>
      <p class="app-sub">{headline}</p>
      <p class="lead"><span class="m-full">{lead}</span><span class="m-short">{sp["short"]}</span></p>
      <div class="actions"><a class="btn btn-primary btn-lg" href="{{{{ROOT}}}}quotation.html">Get a quotation {{{{icon:arrow}}}}</a><a class="btn btn-ghost btn-lg" href="#talk">{{{{icon:chat}}}}Talk to us</a></div>
      <p class="ixw-hint">{{{{icon:sparkle}}}}<span>{sp["hint"]}</span></p>
    </div>
  </div>
  <div class="ixw-set" data-ixw-set>
    <div class="ixw-front" data-ixw-front>
      {casts}

      {hots}

      {toys}

      <div class="ixw-nexi" data-ixw-nexi style="--nx:{nx};--ny:{ny}" data-reacts="{sp["reacts"]}">
        <div class="ixw-nexi-y"><button class="ixw-nexi-b" type="button" aria-label="Say hi to Nexi"><span class="ixw-nexi-bob"><span class="ixw-aura" aria-hidden="true"></span>{{{{IXW_NEXI:{w}}}}}</span></button></div>
      </div>
    </div>
    <div class="ixw-cap" data-ixw-cap data-intro="{intro}" data-outro="{sp["outro"]}">
      <span class="ixw-cap-av" data-ixw-av data-av="nexi" aria-hidden="true">{{{{IXW_AV:{w}}}}}{av}</span>
      <div class="ixw-cap-body">
        <p class="ixw-cap-who"><b data-ixw-who>Nexi</b><small data-ixw-role data-default="assistant · Odoo {sp["crumb"]}">assistant · Odoo {sp["crumb"]}</small></p>
        <p class="ixw-cap-txt" aria-hidden="true"><span data-ixw-type>{intro_html}</span><i class="ixw-caret"></i></p>
        <p class="sr-only" aria-live="polite" data-ixw-live></p>
        <p class="ixw-cap-rec" data-ixw-rec aria-hidden="true"></p>
      </div>
      <div class="ixw-cap-side">
        <div class="ixw-cap-ctl">
          <button class="ixw-ibtn ixw-ibtn--prev" type="button" data-ixw-prev aria-label="Previous stop">{{{{icon:chevron}}}}</button>
          <button class="ixw-ibtn ixw-ibtn--play is-on" type="button" data-ixw-play aria-pressed="true" aria-label="Pause the tour">{{{{icon:pause}}}}{{{{icon:play}}}}</button>
          <button class="ixw-ibtn ixw-ibtn--next" type="button" data-ixw-next aria-label="Next stop">{{{{icon:chevron}}}}</button>
        </div>
        <div class="ixw-dots">{dots}</div>
      </div>
    </div>
  </div>
</section>

<div class="container ixw-credits-wrap">
  <h2 class="sr-only">At a glance</h2>
  <dl class="glance glance--ind ixw-credits ow-strip">{glance}</dl>
</div>'''


C_ROLE = "Client team · illustration"
SPEC = {
    "accountant": {
        "crumb": "Accounting", "hand": "odoo accounting · the counting house", "home": "662,-6",
        "short": "Invoices, bills, bank reconciliation, GST and month-end in one Odoo database.",
        "hint": "Tap the finance team, a screen, the vault, the scale or the PAID stamp.",
        "intro": "Hi! I'm **Nexi**. Welcome to the **counting house**: month-end in Odoo Accounting, where every coin is matched. Tap around!",
        "outro": "Invoices, bills, the bank and the close, in **one ledger**. That's Odoo Accounting.",
        "reacts": "wow::Bank lines, **matched**!|love::A tidy month-end. **Love it**.|celebrate::Books closed. **Yay!**|think::Hmm… how long does **your** month-end take?",
        "cast": [
            {"id": "acc", "lab": "Accountant", "sub": "reconciling", "col": "#2E9C7E", "who": "Accountant", "role": C_ROLE, "aria": "the accountant", "near": "662,-6",
             "say": "Suggested matches on the bank lines. I check, then **validate**.", "x": 452, "y": 322, "w": 80, "h": 76},
            {"id": "ap", "lab": "Payables", "sub": "paying bills", "col": "#E0456B", "who": "Accounts payable", "role": C_ROLE, "aria": "accounts payable", "near": "662,-6",
             "say": "Bills come in, get matched to the PO, then **paid** in a batch.", "x": 792, "y": 322, "w": 80, "h": 76},
            {"id": "cfo", "lab": "Finance lead", "sub": "closing", "col": "#1E3A6E", "who": "Finance lead", "role": C_ROLE, "aria": "the finance lead", "near": "662,-6",
             "say": "Close checklist done, reports **ready**. Same day.", "x": 940, "y": 358, "w": 90, "h": 230},
            {"id": "bk", "lab": "Bookkeeper", "sub": "expenses", "col": "#B8863B", "who": "Bookkeeper", "role": C_ROLE, "aria": "the bookkeeper", "near": "662,-6",
             "say": "A photo of the receipt from my phone, and the expense is **ready to post**.", "x": 318, "y": 358, "w": 90, "h": 230},
            {"id": "tr", "lab": "Treasury", "sub": "cash and bank", "col": "#3A7CA5", "who": "Treasury", "role": C_ROLE, "aria": "treasury", "near": "662,-6",
             "say": "Cash counted, banked, and the bank line **matched** the next morning.", "x": -66, "y": 362, "w": 90, "h": 220}],
        "hots": [
            {"id": "bank", "dot": "bank", "lab": "Bank reconciliation", "icon": "{{icon:bank}}", "near": "660,-4", "x": 444, "y": -6, "w": 292, "h": 210, "pose": "point-left",
             "rec": "Bank reconciliation · suggested matches", "say": "**Bank reconciliation**: statement lines matched to invoices and bills, ready to validate."},
            {"id": "invoices", "dot": "invoices", "lab": "Invoices", "icon": "{{icon:receipt}}", "near": "648,-24", "x": 802, "y": -38, "w": 122, "h": 86, "pose": "point-right",
             "rec": "Customer invoices · sent, paid, overdue", "say": "**Customer invoices** sent from Odoo, with payment status on each one."},
            {"id": "bills", "dot": "bills", "lab": "Vendor bills", "icon": "{{icon:file}}", "near": "648,28", "x": 802, "y": 56, "w": 122, "h": 86, "below": True, "pose": "point-right",
             "rec": "Vendor bills · matched to purchase orders", "say": "**Vendor bills** matched to purchase orders and receipts, then paid in batches."},
            {"id": "tax", "dot": "GST", "lab": "GST return", "icon": "{{icon:layers}}", "near": "676,-34", "x": 928, "y": -38, "w": 122, "h": 86, "pose": "point-right",
             "rec": "GST · the F5 return from your entries", "say": "**GST**: the tax report built from the entries you already posted."},
            {"id": "close", "dot": "month-end", "lab": "Month-end", "icon": "{{icon:calendar}}", "near": "676,22", "x": 928, "y": 56, "w": 122, "h": 86, "below": True, "pose": "point-right",
             "rec": "Month-end · the close checklist", "say": "**Month-end** as a checklist: accruals, reconciliations, lock date."},
            {"id": "reports", "dot": "reports", "lab": "Reports", "icon": "{{icon:bars}}", "near": "664,62", "x": 444, "y": 133, "w": 292, "h": 56, "below": True, "pose": "point-left",
             "rec": "Reports · P&amp;L, balance sheet, cash", "say": "**Reports** straight from the ledger: profit and loss, balance sheet, cash."}],
        "toys": [{"id": "stamp", "lab": "Stamp it paid", "near": "662,-6", "pose": "celebrate", "say": "Stamp! **Paid**, and matched.", "aria": "Stamp a bill paid", "x": 224, "y": 352, "w": 96, "h": 56}],
        "glance": [("layers", "App", "Odoo Accounting"), ("bank", "Bank", "Feeds and reconciliation"), ("receipt", "Covers", "Invoices · bills · GST · month-end"),
                   ("check", "Set up", "On a staging copy first"), ("users", "Team", "Singapore HQ · Philippines · Vietnam")],
    },
    "sale": {
        "crumb": "Sales", "hand": "odoo sales · the showroom counter", "home": "694,-6",
        "short": "Quotations, e-signatures, orders and invoices, all in Odoo Sales.",
        "hint": "Tap the sales team, the quotation, the price tags, the bell or the gift box.",
        "intro": "Hi! I'm **Nexi**. Welcome to the **showroom counter**: quote, sign, pay, deliver, in Odoo Sales. Tap around!",
        "outro": "Quote, sign, deliver, invoice, **no re-typing**. That's Odoo Sales.",
        "reacts": "wow::Signed **online**!|love::Quote to cash in one app. **Love it**.|celebrate::Order confirmed. **Yay!**|think::Hmm… how long does a **quote** take you today?",
        "cast": [
            {"id": "rep", "lab": "Sales rep", "sub": "quoting", "col": "#E46E78", "who": "Sales rep", "role": C_ROLE, "aria": "the sales rep", "near": "694,-6",
             "say": "Products, prices and optional extras, in a quote in **minutes**.", "x": 470, "y": 290, "w": 84, "h": 150},
            {"id": "ops", "lab": "Sales ops", "sub": "confirming", "col": "#F2A33A", "who": "Sales operations", "role": C_ROLE, "aria": "sales operations", "near": "694,-6",
             "say": "Confirmed orders go straight to the **warehouse** and to invoicing.", "x": 730, "y": 290, "w": 84, "h": 150},
            {"id": "cust", "lab": "Customer", "sub": "signing", "col": "#3167CA", "who": "Customer", "role": C_ROLE, "aria": "the customer", "near": "694,-6",
             "say": "I signed and paid **online**, from my tablet.", "x": 948, "y": 358, "w": 90, "h": 230},
            {"id": "mgr", "lab": "Sales manager", "sub": "pricelists", "col": "#714B67", "who": "Sales manager", "role": C_ROLE, "aria": "the sales manager", "near": "694,-6",
             "say": "One price for retail, one for resellers, one for **10+ units**. Odoo picks the right one.", "x": 326, "y": 358, "w": 90, "h": 230},
            {"id": "sa", "lab": "Shop assistant", "sub": "demo corner", "col": "#2E9C7E", "who": "Shop assistant", "role": C_ROLE, "aria": "the shop assistant", "near": "694,-6",
             "say": "Customers try the scanner here. The **carry case** goes on the quote as an optional extra.", "x": -104, "y": 362, "w": 90, "h": 220}],
        "hots": [
            {"id": "quote", "dot": "quotation", "lab": "Quotation", "icon": "{{odoo:sale:18}}", "near": "694,-6", "x": 472, "y": -2, "w": 296, "h": 212, "pose": "point-left",
             "rec": "Quotation · products, prices, optional extras", "say": "A **quotation** with your products, prices and optional extras, built in minutes."},
            {"id": "price", "dot": "pricelists", "lab": "Pricelists", "icon": "{{icon:layers}}", "near": "243,-26", "x": 244, "y": 176, "w": 140, "h": 180, "below": True, "pose": "present",
             "rec": "Pricelists · per customer, per quantity", "say": "**Pricelists** per customer group, currency and quantity, applied automatically."},
            {"id": "sign", "dot": "sign and pay", "lab": "Sign &amp; pay", "icon": "{{icon:check}}", "near": "690,30", "x": 883, "y": 91, "w": 218, "h": 90, "below": True, "pose": "point-right",
             "rec": "Online · e-signature and payment", "say": "The customer **signs and pays online**, and the quote becomes an order."},
            {"id": "order", "dot": "order", "lab": "Sales order", "icon": "{{icon:receipt}}", "near": "690,-30", "x": 828, "y": -16, "w": 104, "h": 108, "pose": "point-right",
             "rec": "Sales order · confirmed from the quote", "say": "Confirmed, it's a **sales order**: nothing re-typed."},
            {"id": "deliver", "dot": "delivery and invoice", "lab": "Deliver &amp; invoice", "icon": "{{icon:truck}}", "near": "700,-20", "x": 938, "y": -16, "w": 104, "h": 108, "pose": "point-right",
             "rec": "Delivery and invoice · from the order", "say": "The order creates the **delivery** and the **invoice**, from the same lines."},
            {"id": "report", "dot": "dashboard", "lab": "Dashboard", "icon": "{{icon:bars}}", "near": "694,64", "x": 472, "y": 141, "w": 272, "h": 76, "below": True, "pose": "point-left",
             "rec": "Sales dashboard · by rep, product, month", "say": "The **sales dashboard**: by rep, by product, by month, live."}],
        "toys": [{"id": "gift", "lab": "Open the extra", "near": "694,-6", "pose": "love", "say": "An **optional product**, added with one click.", "aria": "Open the optional product box", "x": 404, "y": 336, "w": 60, "h": 56}],
        "glance": [("layers", "App", "Odoo Sales"), ("receipt", "Covers", "Quotes · orders · invoices"), ("check", "Online", "E-signature and payment"),
                   ("truck", "Hands off to", "Inventory and Accounting"), ("users", "Team", "Singapore HQ · Philippines · Vietnam")],
    },
    "stock": {
        "crumb": "Inventory", "hand": "odoo inventory · the port-side hub", "home": "482,-10",
        "short": "Receipts, picking, packing, replenishment and counts in Odoo Inventory.",
        "hint": "Tap the warehouse team, the racks, the cart, the board, the forklift or the dock.",
        "intro": "Hi! I'm **Nexi**. Welcome to the **logistics hub**: every crate has a gate and every move is tracked, in Odoo Inventory. Tap around!",
        "outro": "Received, put away, picked, packed, counted. **That's** Odoo Inventory.",
        "reacts": "wow::Beep! **Scanned**.|love::Every bin has an address. **Love it**.|celebrate::Shipped on time. **Yay!**|think::Hmm… do you know your stock **right now**?",
        "cast": [
            {"id": "lead", "lab": "Warehouse lead", "sub": "counting", "col": "#2E9C7E", "who": "Warehouse lead", "role": C_ROLE, "aria": "the warehouse lead", "near": "482,-10",
             "say": "Reorder rules raise the purchase **before** we run out.", "x": 236, "y": 358, "w": 90, "h": 230},
            {"id": "pick", "lab": "Picker", "sub": "scanning", "col": "#F2A33A", "who": "Picker", "role": C_ROLE, "aria": "the picker", "near": "482,-10",
             "say": "Scan the bin, scan the product. The picking list knows the **route**.", "x": 455, "y": 358, "w": 90, "h": 230},
            {"id": "pack", "lab": "Packer", "sub": "labelling", "col": "#3167CA", "who": "Packer", "role": C_ROLE, "aria": "the packer", "near": "482,-10",
             "say": "Packed, labelled, and the carrier is **booked**.", "x": 690, "y": 322, "w": 80, "h": 76},
            {"id": "rcv", "lab": "Receiver", "sub": "at the dock", "col": "#714B67", "who": "Receiver", "role": C_ROLE, "aria": "the receiver", "near": "482,-10",
             "say": "The pallet comes off the truck and is checked against the **purchase order**.", "x": 936, "y": 358, "w": 90, "h": 230},
            {"id": "clk", "lab": "Stock clerk", "sub": "zone A picks", "col": "#3FA9E0", "who": "Stock clerk", "role": C_ROLE, "aria": "the stock clerk", "near": "482,-10",
             "say": "Bin A5-03, into the tote, then one scan and the **picking** is validated.", "x": -6, "y": 362, "w": 90, "h": 220}],
        "hots": [
            {"id": "receive", "dot": "receipts", "lab": "Receipts", "icon": "{{icon:truck}}", "near": "790,236", "x": 921, "y": 186, "w": 160, "h": 64, "pose": "point-right",
             "rec": "Receipt · WH/IN · checked against the PO", "say": "**Receipts** checked against the purchase order at the dock."},
            {"id": "putaway", "dot": "locations", "lab": "Locations", "icon": "{{icon:pin}}", "near": "482,-10", "x": 284, "y": 104, "w": 232, "h": 280, "pose": "point-left",
             "rec": "Locations · every bin has an address", "say": "**Locations**: every shelf and bin has an address, so stock is never lost."},
            {"id": "picking", "dot": "picking", "lab": "Picking", "icon": "{{icon:check}}", "near": "575,215", "x": 540, "y": 392, "w": 80, "h": 100, "pose": "present",
             "rec": "Picking · barcode, route by location", "say": "**Picking** with a barcode scanner, in route order."},
            {"id": "packing", "dot": "pack and ship", "lab": "Pack &amp; ship", "icon": "{{icon:bag}}", "near": "790,236", "x": 664, "y": 378, "w": 140, "h": 48, "below": True, "pose": "point-left",
             "rec": "Pack and ship · labels and carriers", "say": "**Pack and ship**: shipping labels and carrier tracking from Odoo."},
            {"id": "reorder", "dot": "replenishment", "lab": "Replenishment", "icon": "{{icon:refresh}}", "near": "482,-14", "x": 663, "y": -36, "w": 198, "h": 108, "pose": "point-right",
             "rec": "Replenishment · reorder rules, min and max", "say": "**Replenishment**: reorder rules raise purchases before stock runs out."},
            {"id": "count", "dot": "counts", "lab": "Counts", "icon": "{{icon:bars}}", "near": "482,30", "x": 663, "y": 74, "w": 198, "h": 108, "below": True, "pose": "point-right",
             "rec": "Counts · cycle counts, adjustments logged", "say": "**Cycle counts** by location, with every adjustment logged."}],
        "toys": [{"id": "honk", "lab": "Honk the truck", "near": "482,-10", "pose": "wow", "say": "Beep beep! A **delivery** at dock 1.", "aria": "Honk the truck", "x": 921, "y": 122, "w": 150, "h": 40}],
        "glance": [("layers", "App", "Odoo Inventory"), ("pin", "Tracks", "Locations · lots · serials"), ("truck", "Covers", "Receipts · picking · shipping · counts"),
                   ("refresh", "Replenishment", "Reorder rules and routes"), ("users", "Team", "Singapore HQ · Philippines · Vietnam")],
    },
}


# ---------------------------------------------------------------- the sections below the hero
# build.app_page() passes the generated page body through dress(mod, content): every generated section gets a data-aw tag so
# the world's stylesheet can theme it, each section head gets a themed badge, the implementation list becomes numbered steps,
# the end card gets a small themed illustration, and two bands are added from facts already on the page: the six hero
# stations (their own captions) and the TechNext facts strip (approved company facts). Markup the demo and zoom scripts use is
# never renamed.
THEME = {
    "accountant": {"badges": {"step by step": "refresh", "follow a record": "refresh", "watch": "play", "what it does": "receipt", "screens": "expand", "how technext implements it": "check",
                              "works with": "layers", "the month-end ledger": "bank", "who implements it": "users", "next step": "arrow"},
                   "band_hand": "the month-end ledger", "band_h2": "Six stations, one set of books.",
                   "band_lead": "What the counting house shows, posted line by line. Sample records in the scene; your own accounts, taxes and journals in yours.",
                   "facts_h2": "The firm behind the books.",
                   "cta_art": '<span class="aw-stamp">PAID<small>matched · posted</small></span><span class="aw-coin"></span><span class="aw-coin"></span><span class="aw-coin"></span>'},
    "sale": {"badges": {"step by step": "refresh", "follow a record": "refresh", "watch": "play", "what it does": "receipt", "screens": "expand", "how technext implements it": "check",
                        "works with": "layers", "the quote-to-cash rail": "receipt", "who implements it": "users", "next step": "arrow"},
             "band_hand": "the quote-to-cash rail", "band_h2": "Six tickets, one order.",
             "band_lead": "What the showroom counter shows, one ticket at a time: from the quotation to the dashboard, nothing re-typed.",
             "facts_h2": "Who sets up your counter.",
             "cta_art": '<span class="aw-receipt"><b>S00042</b><i></i><i></i><i></i><em>Signed &amp; paid ✓</em></span>'},
    "stock": {"badges": {"step by step": "refresh", "follow a record": "refresh", "watch": "play", "what it does": "receipt", "screens": "expand", "how technext implements it": "check",
                         "works with": "layers", "the departures board": "truck", "who implements it": "users", "next step": "arrow"},
              "band_hand": "the departures board", "band_h2": "Six gates, every move tracked.",
              "band_lead": "What the logistics hub shows, gate by gate: from the receipt at the dock to the cycle count.",
              "facts_h2": "Who runs your go-live.",
              "cta_art": '<span class="aw-label"><b>SHIP TO</b><i>Your warehouse</i><span class="aw-bars"></span><em>WH/OUT · ready</em></span>'},
}
FACTS = [("Odoo Ready", "Partner"), ("11+", "enterprise clients"), ("10+", "countries"), ("Singapore", "HQ · 261 Waterloo Street #03-36"),
         ("Taguig City", "main development and consulting hub"), ("Ho Chi Minh City", "AI engineering hub")]
STATUS = ["ARRIVED", "STORED", "PICKING", "BOARDING", "ON TIME", "COUNTED"]


def _bold(md):
    out, on = "", False
    for part in md.split("**"):
        out += (f"<b>{part}</b>" if on else part)
        on = not on
    return out


def _band(mod):
    sp, th = SPEC[mod], THEME[mod]
    rows = []
    for k, h in enumerate(sp["hots"]):
        n = f"{k + 1:02d}"
        if mod == "accountant":
            rows.append(f'<li class="aw-row reveal" style="--i:{k}"><span class="aw-no">{n}</span><span class="aw-st">{h["icon"]}<b>{h["lab"]}</b></span>'
                        f'<span class="aw-say">{_bold(h["say"])}</span><span class="aw-ok">{{{{icon:check}}}}Posted</span></li>')
        elif mod == "sale":
            rows.append(f'<li class="aw-tk reveal" style="--i:{k}"><span class="aw-pin" aria-hidden="true"></span><span class="aw-no">No. {n}</span>'
                        f'<span class="aw-st">{h["icon"]}<b>{h["lab"]}</b></span><span class="aw-say">{_bold(h["say"])}</span><span class="aw-rec">{h["rec"]}</span></li>')
        else:
            rows.append(f'<li class="aw-gate reveal" style="--i:{k}"><span class="aw-no">G{k + 1}</span><span class="aw-st">{h["icon"]}<b>{h["lab"]}</b></span>'
                        f'<span class="aw-say">{_bold(h["say"])}</span><span class="aw-stat">{STATUS[k % 6]}</span></li>')
    rows = "".join(rows)
    if mod == "accountant":
        body = (f'<div class="aw-ledger reveal"><div class="aw-ledger-head" aria-hidden="true"><span>No.</span><span>Station</span><span>What Odoo Accounting does</span><span>Status</span></div>'
                f'<ol class="aw-rows">{rows}</ol><p class="aw-total"><span>Balanced</span><span>{_bold(sp["outro"])}</span></p></div>')
    elif mod == "sale":
        body = f'<div class="aw-rail"><ol class="aw-tks">{rows}</ol><p class="aw-total reveal">{_bold(sp["outro"])}</p></div>'
    else:
        body = (f'<div class="aw-board reveal"><div class="aw-board-head" aria-hidden="true"><span>Gate</span><span>Station</span><span>What Odoo Inventory does</span><span>Status</span></div>'
                f'<ol class="aw-gates">{rows}</ol><p class="aw-total">{_bold(sp["outro"])}</p></div>')
    return (f'<section class="section aw-sec aw-band" data-aw="band"><div class="container">'
            f'<div class="sec-head reveal"><span class="hand">{th["band_hand"]}</span><h2>{th["band_h2"]}</h2><p class="lead">{th["band_lead"]}</p></div>'
            f'{body}</div></section>')


def _facts(mod):
    th = THEME[mod]
    items = "".join(f'<li class="aw-fact reveal" style="--i:{k}"><b>{a}</b><span>{b}</span></li>' for k, (a, b) in enumerate(FACTS))
    return (f'<section class="section section--tight aw-sec aw-facts-sec" data-aw="facts"><div class="container">'
            f'<div class="sec-head reveal"><span class="hand">who implements it</span><h2>{th["facts_h2"]}</h2>'
            f'<p class="lead">TechNext, an Odoo Ready Partner: set up on a staging copy first, supported after go-live.</p></div>'
            f'<ul class="aw-facts">{items}</ul></div></section>')


def dress(mod: str, content: str) -> str:
    th = THEME[mod]
    marks = [("answer-sec", "answer"), ('id="lifecycle"', "life"), ('id="watch"', "watch"), ('<span class="hand">what it does</span>', "what"),
             ('<span class="hand">screens</span>', "screens"), ('<span class="hand">how technext implements it</span>', "impl"),
             ('<span class="hand">works with</span>', "works"), ('<span class="hand">next step</span>', "cta")]
    parts = content.split("<section ")
    out = [parts[0]]
    for chunk in parts[1:]:
        own = chunk.split("</section>")[0]
        tag = next((t for m, t in marks if m in own), "") if 'class="section' in chunk[:80] else ""
        if tag:
            chunk = chunk.replace('class="section', f'data-aw="{tag}" class="aw-sec section', 1)
            if tag == "impl":
                chunk = chunk.replace('<ul class="checks" style="margin:0">', '<ul class="checks aw-steps">', 1)
                if not CALM:
                    chunk = chunk.replace("</section>", "</section>\n\n" + _facts(mod), 1)
                else:   # the step numbers as real markup (calm-gen.css drops generated ::before text)
                    i0 = chunk.index('<ul class="checks aw-steps">'); i1 = chunk.index("</ul>", i0)
                    lis = chunk[i0:i1].split("<li>")
                    lis = lis[:1] + [f'<span class="aw-n">{STEP_NO[mod](k + 1)}</span>{li}' for k, li in enumerate(lis[1:])]
                    chunk = chunk[:i0] + "<li>".join(lis) + chunk[i1:]
            elif tag == "answer":
                chunk = chunk.replace("</section>", "</section>\n\n" + _band(mod), 1)
            elif tag == "cta" and not CALM:
                chunk = chunk.replace('<div class="cta reveal">', f'<div class="cta reveal"><div class="aw-cta-art" aria-hidden="true">{th["cta_art"]}</div>', 1)
        out.append(chunk)
    content = "<section ".join(out)
    for hand, icon in th["badges"].items():
        content = content.replace(f'<span class="hand">{hand}</span>', f'<span class="aw-badge" aria-hidden="true">{{{{icon:{icon}}}}}</span><span class="hand">{hand}</span>')
    return content
