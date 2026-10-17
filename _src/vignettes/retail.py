# -*- coding: utf-8 -*-
"""Retail (Harbour Goods, a sample homeware store): one product from the supplier to the till to the books. The workflow has
a sample picker: a ceramic mug, a soy candle or a linen throw; every [data-v] text and [data-vbar] bar in the scenes and the
sample records follows the picked product. All figures are sample figures and add up: the purchase order is quantity x
cost, the shelf after receiving is on hand + received, the web stock is that less the transfer and the till sale, and the
day's takings split into card, cash and QR (with 9% GST included)."""
from vignettes import svg

SAMPLES = {
    "mug": {"name": "Ceramic mug", "names": "mugs", "vendor": "Apex Homeware", "po": "PO00087", "lead": "2 days", "cost": "S$ 7.20", "price": "S$ 18.00",
            "min": "20", "max": "60", "onhand": "14", "qty": "48", "po_total": "S$ 345.60", "after": "62", "move": "12", "sell": "2", "sell_total": "S$ 36.00",
            "web": "#1042", "web_stock": "48", "lvl": "0.23"},
    "candle": {"name": "Soy candle", "names": "candles", "vendor": "Wick & Co.", "po": "PO00088", "lead": "3 days", "cost": "S$ 9.50", "price": "S$ 24.00",
               "min": "15", "max": "45", "onhand": "9", "qty": "36", "po_total": "S$ 342.00", "after": "45", "move": "10", "sell": "2", "sell_total": "S$ 48.00",
               "web": "#1043", "web_stock": "33", "lvl": "0.2"},
    "throw": {"name": "Linen throw", "names": "throws", "vendor": "Loom Studio", "po": "PO00089", "lead": "5 days", "cost": "S$ 26.00", "price": "S$ 59.00",
              "min": "8", "max": "25", "onhand": "5", "qty": "20", "po_total": "S$ 520.00", "after": "25", "move": "6", "sell": "1", "sell_total": "S$ 59.00",
              "web": "#1044", "web_stock": "18", "lvl": "0.2"},
}
D = SAMPLES["mug"]


def v(field: str) -> str:
    """the default (mug) value of a field, wrapped so the picker can swap it"""
    return f'<tspan data-v="{field}">{D[field]}</tspan>'


def mug(x, y, cls="f-terra"):
    """a small mug glyph, its base at (x, y)"""
    return f'<rect x="{x}" y="{y - 18}" width="17" height="18" rx="3" class="{cls}"/><path d="M{x + 17} {y - 14}a5 5 0 0 1 0 10" class="s-terra"/>'


SCENES = [
    # 1 Buy: the shelf runs low, the reordering rule drafts the purchase order, the buyer approves it
    svg(f'''
<g class="v-in-up">
  <rect x="24" y="28" width="172" height="202" rx="10" class="f-oak-d"/><rect x="32" y="36" width="156" height="186" rx="6" class="f-cream"/>
  <rect x="28" y="96" width="164" height="7" rx="2" class="f-oak"/><rect x="28" y="158" width="164" height="7" rx="2" class="f-oak"/>
  {mug(46, 96)}<rect x="78" y="76" width="20" height="20" rx="4" class="s-dash"/><rect x="108" y="76" width="20" height="20" rx="4" class="s-dash"/><rect x="138" y="76" width="20" height="20" rx="4" class="s-dash"/>
  <rect x="44" y="132" width="20" height="26" rx="4" class="s-dash"/><rect x="74" y="132" width="20" height="26" rx="4" class="s-dash"/><rect x="104" y="132" width="20" height="26" rx="4" class="s-dash"/>
  <g class="v-d1"><rect x="112" y="106" width="72" height="18" rx="5" class="f-ink"/><text x="148" y="119" text-anchor="middle" class="t-w t-xs t-b">{v("onhand")} left</text></g>
  <text x="44" y="186" class="t-mut t-xs t-b">ON HAND</text><text x="176" y="186" text-anchor="end" class="t-mut t-xs t-b">MIN {v("min")}</text>
  <rect x="44" y="194" width="132" height="12" rx="6" class="f-chip"/><rect x="44" y="194" width="132" height="12" rx="6" class="f-terra v-hbar" data-vbar="lvl" style="--v:{D["lvl"]}"/>
  <path d="M88 190v20" class="s-ink s-thin"/>
</g>
<path d="M200 128h22" class="s-arrow v-d1"/>
<g class="v-in-r">
  <rect x="228" y="24" width="268" height="206" rx="14" class="f-white v-card"/>
  <rect x="228" y="24" width="268" height="42" rx="14" class="f-terra"/><rect x="228" y="50" width="268" height="16" class="f-terra"/>
  <text x="244" y="51" class="t-w t-b">Purchase order {v("po")}</text>
  <text x="244" y="90" class="t-ink t-s t-b">{v("vendor")}</text><text x="244" y="108" class="t-mut t-xs">Lead time {v("lead")} · from the reordering rule</text>
  <g class="v-line" style="--i:1"><circle cx="256" cy="138" r="13" class="f-peach"/>{mug(248, 146)}<text x="278" y="143" class="t-ink t-s">{v("qty")} × {v("name")}</text><text x="480" y="143" text-anchor="end" class="t-mut t-xs">{v("cost")}</text></g>
  <path d="M244 164h236" class="s-line"/>
  <g class="v-line" style="--i:2"><text x="244" y="196" class="t-ink t-b">Total</text><text x="480" y="196" text-anchor="end" class="t-terra t-b">{v("po_total")}</text></g>
  <rect x="244" y="206" width="132" height="16" rx="8" class="f-sage-l"/><text x="252" y="218" class="t-ink t-xs t-b">Min {v("min")} · max {v("max")}</text>
</g>
<g class="v-d4"><rect x="300" y="248" width="196" height="40" rx="20" class="f-sage"/><text x="398" y="273" text-anchor="middle" class="t-w t-s t-b">Approve &amp; send</text></g>
<g class="v-stamp"><rect x="24" y="250" width="200" height="38" rx="19" class="f-ink"/><path d="M44 269l5 5 9-10" class="s-white"/><text x="66" y="274" class="t-w t-s t-b">Sent to the vendor</text></g>
''', "Buy"),
    # 2 Receive: the cartons are scanned in, the shelf count rises, the bill matches the order and the receipt
    svg(f'''
<g class="v-in-up">
  <rect x="28" y="96" width="132" height="98" rx="6" class="f-box"/><rect x="28" y="96" width="132" height="16" rx="5" class="f-box-d"/><rect x="88" y="96" width="14" height="98" class="f-white-t"/>
  <rect x="44" y="138" width="60" height="40" rx="3" class="f-white"/><path d="M50 146v24M54 146v24M57 146v24M62 146v24M65 146v24M70 146v24M74 146v24M79 146v24M82 146v24M87 146v24M92 146v24M96 146v24" class="s-ink s-thin"/>
  <text x="112" y="152" class="t-ink t-xs t-b">{v("qty")}</text><text x="112" y="166" class="t-mut t-xs">{v("names")}</text>
</g>
<g class="v-in-r"><path d="M196 52l38 10-6 22-38-10z" class="f-ink"/><rect x="214" y="78" width="16" height="44" rx="6" class="f-ink" transform="rotate(14 222 100)"/><path d="M192 66l-6 -1" class="s-red"/></g>
<path class="v-waves" d="M186 68L104 140" stroke="#E0456B" stroke-width="3" stroke-linecap="round" opacity=".7"/>
<g class="v-in-r">
  <rect x="262" y="20" width="234" height="132" rx="14" class="f-white v-card"/>
  <text x="278" y="46" class="t-mut t-xs t-b">RECEIPT WH/IN/00112</text><text x="278" y="72" class="t-ink t-s t-b">{v("vendor")}</text>
  <text x="278" y="100" class="t-ink t-s">{v("name")}</text><text x="480" y="100" text-anchor="end" class="t-green t-s t-b">{v("qty")} / {v("qty")}</text>
  <rect x="278" y="110" width="202" height="10" rx="5" class="f-chip"/><rect x="278" y="110" width="202" height="10" rx="5" class="f-green v-hbar" style="--v:1"/>
  <text x="278" y="140" class="t-mut t-xs">Scanned with Barcode</text>
</g>
<g class="v-d5">
  <rect x="262" y="166" width="234" height="58" rx="14" class="f-white v-card"/>
  <text x="278" y="190" class="t-mut t-xs t-b">ON THE SHELF</text>
  <text x="278" y="214" class="t-ink t-b">{v("onhand")} → {v("after")}</text>
  <rect x="404" y="178" width="18" height="36" rx="3" class="f-chip"/><rect x="404" y="192" width="18" height="22" rx="3" class="f-terra v-rise" style="--i:0"/>
  <rect x="430" y="178" width="18" height="36" rx="3" class="f-chip"/><rect x="430" y="184" width="18" height="30" rx="3" class="f-terra v-rise" style="--i:1"/>
  <rect x="456" y="178" width="18" height="36" rx="3" class="f-chip"/><rect x="456" y="179" width="18" height="35" rx="3" class="f-sage v-rise" style="--i:2"/>
</g>
<g class="v-d6">
  <rect x="28" y="244" width="468" height="44" rx="22" class="f-white v-card"/>
  <rect x="44" y="254" width="98" height="24" rx="12" class="f-sage-l"/><text x="93" y="271" text-anchor="middle" class="t-ink t-xs t-b">Order {v("qty")}</text>
  <rect x="154" y="254" width="104" height="24" rx="12" class="f-sage-l"/><text x="206" y="271" text-anchor="middle" class="t-ink t-xs t-b">Received {v("qty")}</text>
  <rect x="270" y="254" width="92" height="24" rx="12" class="f-sage-l"/><text x="316" y="271" text-anchor="middle" class="t-ink t-xs t-b">Billed {v("qty")}</text>
  <circle cx="386" cy="266" r="12" class="f-green"/><path d="M380 266l4 4 7-8" class="s-white"/><text x="404" y="271" class="t-green t-xs t-b">Bill matched</text>
</g>
''', "Receive"),
    # 3 Move: a transfer from Store A to Orchard, visible in both stores until it is received
    svg(f'''
<g class="v-in-up">
  <rect x="22" y="118" width="128" height="108" rx="8" class="f-cream"/><path d="M18 122l10-30h112l10 30z" class="f-terra"/>
  <path d="M28 122v8a10 10 0 0 0 20 0v-8M48 122v8a10 10 0 0 0 20 0v-8M68 122v8a10 10 0 0 0 20 0v-8M88 122v8a10 10 0 0 0 20 0v-8M108 122v8a10 10 0 0 0 20 0v-8M128 122v8a10 10 0 0 0 20 0v-8" class="f-white"/>
  <rect x="44" y="160" width="34" height="66" rx="3" class="f-sage-d"/><rect x="92" y="156" width="44" height="34" rx="4" class="f-glass"/>
  <text x="86" y="112" text-anchor="middle" class="t-w t-xs t-b">STORE A</text>
</g>
<g class="v-in-r">
  <rect x="370" y="118" width="128" height="108" rx="8" class="f-cream"/><path d="M366 122l10-30h112l10 30z" class="f-sage"/>
  <path d="M376 122v8a10 10 0 0 0 20 0v-8M396 122v8a10 10 0 0 0 20 0v-8M416 122v8a10 10 0 0 0 20 0v-8M436 122v8a10 10 0 0 0 20 0v-8M456 122v8a10 10 0 0 0 20 0v-8M476 122v8a10 10 0 0 0 20 0v-8" class="f-white"/>
  <rect x="440" y="160" width="34" height="66" rx="3" class="f-terra-d"/><rect x="384" y="156" width="44" height="34" rx="4" class="f-glass"/>
  <text x="434" y="112" text-anchor="middle" class="t-w t-xs t-b">ORCHARD</text>
</g>
<path d="M150 214h220" class="s-dash"/>
<g class="v-van"><rect x="214" y="180" width="92" height="40" rx="8" class="f-white v-card"/><rect x="284" y="186" width="20" height="16" rx="3" class="f-glass"/>
  <rect x="226" y="190" width="44" height="22" rx="4" class="f-blue"/><rect x="232" y="196" width="32" height="10" rx="2" class="f-white"/>
  <circle cx="232" cy="222" r="7" class="f-ink"/><circle cx="288" cy="222" r="7" class="f-ink"/></g>
<g class="v-in-up">
  <rect x="140" y="20" width="240" height="78" rx="14" class="f-white v-card"/>
  <text x="156" y="44" class="t-mut t-xs t-b">TRANSFER · STORE A → ORCHARD</text>
  <text x="156" y="66" class="t-ink t-s t-b">{v("move")} × {v("name")}</text>
  <circle cx="166" cy="84" r="6" class="f-green"/><path d="M172 84h50" class="s-line"/><circle cx="228" cy="84" r="6" class="f-green"/><path d="M234 84h50" class="s-line"/>
  <circle cx="290" cy="84" r="6" class="f-chip v-d5"/><circle cx="290" cy="84" r="6" class="f-green v-d6"/>
</g>
<g class="v-d6"><rect x="150" y="246" width="220" height="42" rx="21" class="f-ink"/><path d="M172 267l4 4 8-9" class="s-white"/><text x="192" y="272" class="t-w t-s t-b">Received at Orchard</text></g>
''', "Move"),
    # 4 Sell: the till sells offline, syncs later; the card taps, the receipt prints, stock moves
    svg(f'''
<g class="v-in-up">
  <rect x="24" y="22" width="300" height="214" rx="16" class="f-ink"/><rect x="32" y="30" width="284" height="190" rx="10" class="f-white"/>
  <rect x="32" y="30" width="284" height="28" rx="10" class="f-terra"/><rect x="32" y="46" width="284" height="12" class="f-terra"/><text x="46" y="49" class="t-w t-xs t-b">Point of Sale · Store A</text>
  <rect x="44" y="70" width="58" height="50" rx="8" class="f-peach"/>{mug(62, 104)}<rect x="110" y="70" width="58" height="50" rx="8" class="f-sage-l"/><rect x="176" y="70" width="58" height="50" rx="8" class="f-cream"/>
  <rect x="44" y="128" width="58" height="50" rx="8" class="f-cream"/><rect x="110" y="128" width="58" height="50" rx="8" class="f-peach"/><rect x="176" y="128" width="58" height="50" rx="8" class="f-sage-l"/>
  <rect x="242" y="68" width="66" height="144" rx="8" class="f-chip"/>
  <text x="250" y="88" class="t-ink t-xs t-b">{v("sell")} ×</text><text x="250" y="102" class="t-mut t-xs">{v("names")}</text>
  <path d="M250 140h50" class="s-line"/><text x="250" y="160" class="t-mut t-xs t-b">TOTAL</text><text x="250" y="178" class="t-ink t-xs t-b">{v("sell_total")}</text>
  <rect x="250" y="188" width="50" height="18" rx="9" class="f-sage"/><text x="275" y="201" text-anchor="middle" class="t-w t-xs t-b">Pay</text>
</g>
<g class="v-d1"><rect x="40" y="248" width="150" height="34" rx="17" class="f-yellow-l"/><path d="M58 262a10 10 0 0 1 14 0M61 266a5 5 0 0 1 8 0" class="s-ink s-thin"/><path d="M56 258l18 14" class="s-red"/><text x="80" y="270" class="t-ink t-xs t-b">Offline: still selling</text></g>
<g class="v-d6"><rect x="40" y="248" width="150" height="34" rx="17" class="f-green"/><path d="M58 265l4 4 8-9" class="s-white"/><text x="80" y="270" class="t-w t-xs t-b">Synced</text></g>
<g class="v-card-tap"><rect x="352" y="70" width="52" height="34" rx="6" class="f-blue"/><rect x="352" y="80" width="52" height="7" class="f-yellow"/></g>
<g class="v-in-r"><rect x="410" y="60" width="62" height="96" rx="12" class="f-ink"/><rect x="418" y="70" width="46" height="28" rx="5" class="f-white"/><text x="441" y="89" text-anchor="middle" class="t-green t-xs t-b">OK</text></g>
<path class="v-waves" d="M386 52a22 22 0 0 1 22 -12M380 44a32 32 0 0 1 30 -16" stroke="#81B29A" stroke-width="3" fill="none" stroke-linecap="round"/>
<g class="v-receipt"><path d="M362 170h116v86l-10 6-10-6-10 6-10-6-10 6-10-6-10 6-10-6-10 6-10-6-6 4z" class="f-white v-card"/>
  <path d="M374 188h70M374 204h50M374 220h62" class="s-line"/><text x="374" y="244" class="t-ink t-xs t-b">{v("sell_total")}</text></g>
<g class="v-d6"><rect x="220" y="250" width="104" height="34" rx="17" class="f-terra"/><text x="272" y="272" text-anchor="middle" class="t-w t-xs t-b">Stock −{v("sell")}</text></g>
''', "Sell"),
    # 5 Online: the web shop sells the same stock; a pickup order waits in the cubby
    svg(f'''
<g class="v-in-up">
  <rect x="24" y="24" width="270" height="186" rx="12" class="f-ink"/><rect x="32" y="32" width="254" height="164" rx="6" class="f-white"/>
  <rect x="32" y="32" width="254" height="22" rx="6" class="f-chip"/><circle cx="44" cy="43" r="3.5" class="f-pink"/><circle cx="55" cy="43" r="3.5" class="f-yellow"/><circle cx="66" cy="43" r="3.5" class="f-teal"/>
  <text x="82" y="47" class="t-mut t-xs">harbourgoods.sg</text>
  <rect x="44" y="64" width="100" height="100" rx="10" class="f-peach"/>{mug(80, 128, "f-terra")}
  <text x="156" y="82" class="t-ink t-s t-b">{v("name")}</text><text x="156" y="102" class="t-terra t-s t-b">{v("price")}</text>
  <rect x="156" y="112" width="118" height="20" rx="10" class="f-sage-l"/><text x="164" y="126" class="t-ink t-xs t-b">{v("web_stock")} in stock</text>
  <g class="v-press"><rect x="156" y="140" width="118" height="26" rx="13" class="f-terra"/><text x="215" y="158" text-anchor="middle" class="t-w t-xs t-b">Pick up in store</text></g>
  <rect x="0" y="210" width="318" height="12" rx="6" class="f-ink-l"/>
</g>
<path d="M300 118c40 0 40 40 70 40" class="s-dash v-d3"/>
<g class="v-in-r">
  <rect x="352" y="60" width="144" height="164" rx="8" class="f-oak-d"/><rect x="352" y="60" width="144" height="26" rx="8" class="f-ink"/><text x="424" y="78" text-anchor="middle" class="t-w t-xs t-b">ONLINE ORDERS</text>
  <rect x="360" y="92" width="62" height="60" rx="4" class="f-cream"/><rect x="426" y="92" width="62" height="60" rx="4" class="f-cream"/><rect x="360" y="156" width="62" height="60" rx="4" class="f-cream"/><rect x="426" y="156" width="62" height="60" rx="4" class="f-cream"/>
  <rect x="368" y="108" width="44" height="40" rx="4" class="f-box"/><rect x="434" y="172" width="44" height="40" rx="4" class="f-sage"/>
  <g class="v-d5"><rect x="432" y="104" width="50" height="42" rx="4" class="f-box-d"/><path d="M447 104a10 10 0 0 1 20 0" class="s-ink s-thin"/><rect x="438" y="118" width="38" height="16" rx="3" class="f-white"/><text x="457" y="130" text-anchor="middle" class="t-ink t-xs t-b">{v("web")}</text></g>
</g>
<g class="v-stamp"><rect x="352" y="244" width="144" height="40" rx="20" class="f-green"/><path d="M370 264l4 4 8-9" class="s-white"/><text x="390" y="269" class="t-w t-s t-b">Ready</text></g>
<g class="v-d6"><rect x="40" y="244" width="250" height="44" rx="14" class="f-white v-card"/><circle cx="62" cy="266" r="11" class="f-terra"/><path d="M57 266l3 3 6-7" class="s-white"/><text x="82" y="262" class="t-ink t-xs t-b">Your order {v("web")} is ready</text><text x="82" y="278" class="t-mut t-xs">Pick it up at Store A today</text></g>
''', "Online"),
    # 6 Close: the session closes to the books; card settlements match from the bank feed
    svg(f'''
<g class="v-in-up"><path d="M28 22h154v252l-11 7-11-7-11 7-11-7-11 7-11-7-11 7-11-7-11 7-11-7-11 7-11-7-11 7-11-7z" class="f-white v-card"/>
  <text x="105" y="48" text-anchor="middle" class="t-ink t-xs t-b">HARBOUR GOODS</text><text x="105" y="64" text-anchor="middle" class="t-mut t-xs">Session closed · Store A</text>
  <path d="M42 76h126" class="s-dash"/>
  <g class="v-line" style="--i:0"><text x="42" y="100" class="t-ink t-xs">Card</text><text x="168" y="100" text-anchor="end" class="t-ink t-xs t-b">2,610.00</text></g>
  <g class="v-line" style="--i:1"><text x="42" y="122" class="t-ink t-xs">Cash</text><text x="168" y="122" text-anchor="end" class="t-ink t-xs t-b">640.00</text></g>
  <g class="v-line" style="--i:2"><text x="42" y="144" class="t-ink t-xs">QR</text><text x="168" y="144" text-anchor="end" class="t-ink t-xs t-b">230.00</text></g>
  <path d="M42 158h126" class="s-dash"/>
  <g class="v-line" style="--i:3"><text x="42" y="184" class="t-ink t-s t-b">Takings</text><text x="168" y="184" text-anchor="end" class="t-terra t-s t-b">S$ 3,480</text></g>
  <text x="42" y="210" class="t-mut t-xs">GST 9% incl. · 287.34</text>
</g>
<path d="M190 112h24" class="s-arrow v-d3"/>
<g class="v-in-r">
  <rect x="222" y="22" width="274" height="138" rx="14" class="f-white v-card"/>
  <text x="238" y="46" class="t-mut t-xs t-b">JOURNAL ENTRY · POS/2026/0412</text>
  <g class="v-line" style="--i:2"><text x="238" y="74" class="t-ink t-xs">Sales</text><text x="480" y="74" text-anchor="end" class="t-ink t-xs t-b">3,192.66</text></g>
  <g class="v-line" style="--i:3"><text x="238" y="96" class="t-ink t-xs">GST output tax</text><text x="480" y="96" text-anchor="end" class="t-ink t-xs t-b">287.34</text></g>
  <g class="v-line" style="--i:4"><text x="238" y="118" class="t-ink t-xs">Card · cash · QR</text><text x="480" y="118" text-anchor="end" class="t-ink t-xs t-b">3,480.00</text></g>
  <rect x="238" y="130" width="94" height="20" rx="10" class="f-blue-l"/><text x="285" y="144" text-anchor="middle" class="t-blue t-xs t-b">Posted</text>
</g>
<g class="v-d5">
  <rect x="222" y="176" width="274" height="58" rx="14" class="f-white v-card"/>
  <rect x="238" y="192" width="30" height="26" rx="5" class="f-ink"/><path d="M244 212v-8M253 212v-12M262 212v-6" class="s-white s-thin"/>
  <text x="280" y="202" class="t-ink t-xs t-b">Bank feed · card settlement</text><text x="280" y="220" class="t-mut t-xs">S$ 2,610.00</text>
</g>
<g class="v-match"><circle cx="470" cy="205" r="14" class="f-green"/><path d="M463 205l5 5 9-10" class="s-white"/></g>
<g class="v-d6"><rect x="222" y="250" width="274" height="38" rx="19" class="f-ink"/><text x="359" y="274" text-anchor="middle" class="t-w t-s t-b">Matched · no Z-report typing</text></g>
''', "Close"),
]

CHIPS = [
    ("purchase", '<span data-v="po">PO00087</span> · <span data-v="qty">48</span> × <span data-v="name">Ceramic mug</span> · <span data-v="po_total">S$ 345.60</span>'),
    ("stock", '<span data-v="qty">48</span> received · shelf <span data-v="onhand">14</span> → <span data-v="after">62</span>'),
    ("stock", 'Transfer · Store A → Orchard · <span data-v="move">12</span> <span data-v="names">mugs</span>'),
    ("point_of_sale", '<span data-v="sell">2</span> × <span data-v="name">Ceramic mug</span> · <span data-v="sell_total">S$ 36.00</span> · works offline'),
    ("website_sale", 'Web order <span data-v="web">#1042</span> · ready for pickup at Store A'),
    ("accountant", 'Session closed · S$ 3,480 takings posted · card settlement matched'),
]

META = {
    "tag": "Harbour Goods · sample",
    "note": "Harbour Goods is a sample homeware store. Every name and figure here is sample data.",
    "samples": SAMPLES,
    "pick": {"label": "Sample product", "options": [("mug", "Ceramic mug"), ("candle", "Soy candle"), ("throw", "Linen throw")]},
    "m": {
        "intro": "The till, stock in every store, purchasing, the web shop and the books, in one Odoo database.",
        "flow": "One product, supplier to the books. Pick a sample product.",
    },
}
