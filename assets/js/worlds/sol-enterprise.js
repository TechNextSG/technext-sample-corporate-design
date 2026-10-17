/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: sol-enterprise (/solutions/enterprise) — "The Group Tower": one Odoo for a group of companies, told as a bright
   daytime HQ tower cut away like a doll's house. Each company works on its own floor with its own books, currency, clock
   and sign (a sample group from the page's demo: the Singapore holding, the Philippines, Vietnam and Malaysia); a glass lift
   in the core carries inter-company documents (Vietnam's invoice arrives upstairs as the Philippines' matching bill) and
   the month's figures up to the sky deck, where the board reads one consolidated P&L in SGD. The lobby holds the FX board
   (the demo's sample rates), the floor directory, keycard gates (access per company) and the Odoo.sh server room (one
   database, production, staging and development). On the left, the next entity's annex goes up on the group template,
   lowered floor by floor by a crane: the phased rollout. The four country flags fly out front.
   A month-end runs on a loop: local books close floor by floor, the lift mirrors the inter-company invoice, figures
   ride up in SGD, eliminations post on the sky-deck screen, and the group P&L lights up.
   The cast: the TechNext consultant unrolls the rollout blueprint and points up at the crane (tap: the blueprint unfurls,
   PILOT → TEMPLATE → ROLL-OUT); the group CFO sips coffee and approves the P&L (tap: holds the report high, a spin);
   Singapore types and stamps CLOSED (tap: a chair spin and a stamp); the Philippines fetches the mirrored bill from the
   lift (tap: holds the bill high); Vietnam sends the invoice into the lift (tap: a paper-plane invoice); Malaysia works
   the calculator (tap: flips a coin MYR → SGD). Tap the cars, the plane, the fountain, the gates or the month-end button. */
(function (K, CR, CO) {
  'use strict';
  if (!K || !CR || !CO) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed;
  function tone(c, k) { return K.tone(c, k == null ? 0.2 : k); }
  var F = 470, INK = '#1B1F3B', BLUE = '#3167CA', NAVY = '#1E3A6E', PUR = '#714B67', GOLD = '#E2B23A', GOLD_D = '#B4892A', STEEL = '#9FB4CC', STEEL_D = '#6F86A3', GLASS = '#DCEBF7', GREY_ID = '#9AA6BC';
  var CO_ = { sg: { c: '#E5484D', code: 'SG', cur: 'SGD', name: 'Holding', off: 8 }, ph: { c: '#2F6FD6', code: 'PH', cur: 'PHP', name: 'Philippines', off: 8 },
    vn: { c: '#E99A12', code: 'VN', cur: 'VND', name: 'Vietnam', off: 7 }, my: { c: '#14A38B', code: 'MY', cur: 'MYR', name: 'Malaysia', off: 8 } };
  var TW = { l: 452, r: 948 }, LIFT = { l: 678, r: 722 }, DECK = -30, FL2 = { top: -22, floor: 126 }, FL1 = { top: 134, floor: 276 }, LOB = { top: 284 };
  var SCR = { x: 476, y: -144, w: 188, h: 100 }, FX = { x: 466, y: 296, w: 198, h: 58 }, DIR = { x: 736, y: 294, w: 110, h: 94 }, SRV = { x: 856, y: 300, w: 84, h: 170 };
  var GATE = { x: 736, w: 110 }, BTN = { x: 866, y: -62 }, ANX = { l: 182, r: 338 }, MAST = 158, HOOK = 262, FLAGS = [356, 382, 408, 434];
  function setU(g, sx, sy, k) { g.translate(sx, sy); g.scale(k, k); }
  function extOf(W, H, k, sx, sy) { return { l: -(sx + 24) / k, r: (W - sx) / k, t: -(sy + 24) / k, b: (H - sy) / k }; }
  function star5(g, x, y, r, col) { g.fillStyle = col; g.beginPath(); for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, d = i % 2 ? r * 0.45 : r; g.lineTo(x + Math.cos(a) * d, y + Math.sin(a) * d); } g.closePath(); g.fill(); }

  /* ---------------- the month-end loop (16 s): close, mirror, translate, eliminate, report ---------------- */
  var MCYC = 16, M0 = 0, CLOSE_T = -99;
  function month(t) {
    var c = ((t - M0) % MCYC + MCYC) % MCYC, fast = t - CLOSE_T < 6; if (fast) c = Math.min(MCYC - 0.01, (t - CLOSE_T) * 2.6);
    var ph = c < 3 ? 0 : c < 7 ? 1 : c < 10 ? 2 : c < 12.5 ? 3 : 4, y;
    if (c < 4) y = FL1.floor; else if (c < 5.2) y = lerp(FL1.floor, FL2.floor, ease((c - 4) / 1.2)); else if (c < 7) y = FL2.floor;
    else if (c < 8.5) y = lerp(FL2.floor, DECK, ease((c - 7) / 1.5)); else if (c < 12.5) y = DECK; else if (c < 15) y = lerp(DECK, FL1.floor, ease((c - 12.5) / 2.5)); else y = FL1.floor;
    return { c: c, ph: ph, lift: y };
  }
  function ease(u) { u = clamp(u, 0, 1); return u * u * (3 - 2 * u); }

  /* ---------------- the people ---------------- */
  var W = CR.who;
  var TN = W({ x: 266, y: F, s: 0.44, ph: 0.4, skin: 1, hair: 0, style: 'short', outfit: 'polo', top: BLUE, glasses: true, hands: [[-70, -220], [70, -220]], look: 0.6 });
  var CFO = W({ x: 748, y: DECK, s: 0.23, ph: 1.2, skin: 2, hair: 1, style: 'bob', outfit: 'cardigan', top: GOLD, top2: '#FFFFFF', id: GREY_ID, glasses: true, hands: [[-70, -200], [70, -200]], look: -0.6 });
  var SG = W({ x: 505, y: FL2.floor, s: 0.25, ph: 2.1, skin: 0, hair: 2, style: 'short', outfit: 'shirt', top: CO_.sg.c, sit: true, chairCol: '#2A3550', id: GREY_ID, hands: [[-60, -206], [60, -206]], look: 0.4 });
  var PH = W({ x: 762, y: FL2.floor, s: 0.25, ph: 2.9, skin: 3, hair: 1, style: 'long', outfit: 'polo', top: CO_.ph.c, id: GREY_ID, hands: [[-70, -180], [70, -180]], look: -0.5 });
  var VN = W({ x: 640, y: FL1.floor, s: 0.25, ph: 3.5, skin: 1, hair: 0, style: 'pony', outfit: 'shirt', top: CO_.vn.c, id: GREY_ID, clip: '#E0456B', hands: [[-70, -180], [70, -180]], look: 0.5 });
  var MY = W({ x: 792, y: FL1.floor, s: 0.25, ph: 4.2, skin: 4, hair: 1, style: 'short', outfit: 'cardigan', top: CO_.my.c, top2: '#FFFFFF', sit: true, chairCol: '#2A3550', id: GREY_ID, glasses: true, hands: [[-60, -206], [60, -206]], look: 0.4 });
  /* the rest of the staff: the board at the sky-deck table, a colleague on each floor, the receptionist */
  var EXT = [
    { P: W({ x: 830, y: DECK, s: 0.21, ph: 0.7, skin: 1, hair: 3, style: 'short', outfit: 'shirt', top: '#1E3A6E', sit: true, chairCol: '#3A3350', id: GREY_ID }), kind: 'board' },
    { P: W({ x: 912, y: DECK, s: 0.21, ph: 1.9, skin: 3, hair: 0, style: 'bun', outfit: 'cardigan', top: '#B9A6EE', top2: '#FFFFFF', sit: true, chairCol: '#3A3350', id: GREY_ID, glasses: true }), kind: 'board' },
    { P: W({ x: 902, y: FL2.floor, s: 0.24, ph: 2.6, skin: 2, hair: 1, style: 'pony', outfit: 'shirt', top: '#8FB2EA', sit: true, chairCol: '#2A3550', id: GREY_ID }), kind: 'type' },
    { P: W({ x: 500, y: FL1.floor, s: 0.24, ph: 3.3, skin: 4, hair: 2, style: 'short', outfit: 'polo', top: '#F7C66B', sit: true, chairCol: '#2A3550', id: GREY_ID }), kind: 'type' },
    { P: W({ x: 912, y: FL1.floor, s: 0.24, ph: 4.0, skin: 0, hair: 1, style: 'long', outfit: 'cardigan', top: '#7FD3BC', top2: '#FFFFFF', id: GREY_ID }), kind: 'print' },
    { P: W({ x: 506, y: F, s: 0.3, ph: 5.1, skin: 2, hair: 0, style: 'bob', outfit: 'shirt', top: '#E0456B', sit: true, chairCol: '#2A3550', id: GREY_ID, headset: '#1B2350' }), kind: 'desk' }
  ];
  var CREW = [
    { x0: 600, x1: 662, y: 462, spd: 9, ph: 0.4, label: 'TechNext trainer', lines: ['Each country\'s team is **trained locally**, on its own entity.', 'Same template, local rules: we train **country by country**.'], acts: ['wave', 'id', 'nod'],
      P: W({ s: 0.32, skin: 2, hair: 1, style: 'bun', outfit: 'cardigan', top: '#14A38B', top2: '#FFFFFF', hold: 'tablet' }) },
    { x0: -980, x1: -660, y: 490, spd: 15, ph: 0.2, label: 'Client visitor', lines: ['Visitors badge in at the gates: **access per company**.', 'Here for the board meeting on the **sky deck**.'], acts: ['wave', 'nod'],
      P: W({ skin: 3, hair: 0, style: 'long', outfit: 'shirt', top: '#F2B6C9', id: GREY_ID, hold: 'bags' }) },
    { x0: 1010, x1: 1370, y: 486, spd: 13, ph: 0.6, label: 'TechNext developer', lines: ['Custom modules go to **staging on Odoo.sh** first, then production.', 'One support plan **covering every entity**.'], acts: ['nod', 'id', 'wave'],
      P: W({ skin: 0, hair: 0, style: 'short', outfit: 'shirt', top: PUR, hold: 'box' }) },
    { front: true, x0: -920, x1: -640, y: 714, spd: 17, ph: 0.2, label: 'TechNext consultant', lines: ['Tell us how the group is structured: **entities, countries, currencies**.', 'One company first, then **country by country**.'], acts: ['wave', 'id'],
      P: W({ s: 0.5, skin: 1, hair: 1, style: 'pony', outfit: 'polo', top: '#3167CA', clip: '#FFD84A', hold: 'clipboard' }) }
  ];
  CREW[0].P.fixS = CREW[3].P.fixS = true;
  var W2 = { P: W({ s: 0.2, skin: 2, hair: 0, style: 'short', outfit: 'polo', top: '#F2B233', id: GREY_ID, hatKind: 'cap' }) };
  /* the left plaza (behind the title card, the scene when it is hidden): a distant group tower with a window cleaner, the
     training pavilion (a TechNext trainer and a local team at go-live training), the wayfinding pylon, the plaza fountain,
     a kopi cart with its barista, a client at a cafe table reading the group P&L, and two TechNext consultants on a coffee break */
  var PAV = { l: -430, r: -190, top: 330, scr: [-420, 346, 70, 44] }, TALL = { l: -610, r: -450, top: -170 }, FNT = { x: -220, y: 600 }, CART = { x: 56, y: 612 }, CAFE = { x: -366, y: 652 }, PYL = { x: -178, w: 58, top: 340 };
  var TRN = W({ x: -336, y: 466, s: 0.19, ph: 0.3, skin: 1, hair: 1, style: 'bob', outfit: 'polo', top: '#14A38B', hands: [[-60, -200], [60, -200]] });
  var TRS = [-296, -258, -220].map(function (x, i) { return W({ x: x, y: 466, s: 0.19, ph: 1 + i * 0.8, skin: [0, 3, 2][i], hair: [0, 1, 2][i], style: ['short', 'long', 'pony'][i], outfit: ['shirt', 'cardigan', 'polo'][i], top: ['#8FB2EA', '#F2B6C9', '#F7C66B'][i], top2: '#FFFFFF', sit: true, chairCol: '#2A3550', id: GREY_ID, hands: [[-60, -206], [60, -206]], look: -0.6 }); });
  var BAR = W({ x: 60, y: 600, s: 0.42, ph: 2.2, skin: 2, hair: 1, style: 'bun', outfit: 'shirt', top: '#FFFFFF', id: GREY_ID, hands: [[-60, -200], [60, -200]] }); BAR.apron = '#B4651A';
  var VIS = W({ x: -420, y: CAFE.y, s: 0.44, ph: 3.1, skin: 1, hair: 2, style: 'long', outfit: 'cardigan', top: '#7FC9B8', top2: '#FFFFFF', glasses: true, sit: true, chairCol: '#B4892A', id: GREY_ID, hold: 'tablet', hands: [[-40, -232], [40, -232]], look: 0.3 });
  var TA = W({ x: -122, y: 664, s: 0.47, ph: 0.6, skin: 0, hair: 0, style: 'short', outfit: 'polo', top: BLUE, hands: [[-70, -180], [60, -230]], look: 0.6 });
  var TB = W({ x: -30, y: 664, s: 0.47, ph: 1.7, skin: 3, hair: 1, style: 'pony', outfit: 'cardigan', top: '#E0456B', top2: '#FFFFFF', hands: [[-60, -230], [70, -180]], look: -0.6 });
  var W5 = W({ s: 0.056, skin: 2, hair: 1, style: 'bob', outfit: 'shirt', top: '#E99A12', id: GREY_ID });
  var W3 = { P: W({ s: 0.18, skin: 4, hair: 0, style: 'short', outfit: 'polo', top: '#14A38B', id: GREY_ID, hatKind: 'cap' }) };
  function handAt(P, side) {
    var F3 = K.F3, d = side ? 1 : -1, h = P.hands[side], sxk = P.sx == null ? 1 : P.sx, bw = P.build || 1;
    var r = K.ik(d * F3.shx * bw, F3.shy, h[0], h[1], F3.a, F3.b, d).h, dy = -(P.hop || 0) + (P.sit ? (P.sitDrop != null ? P.sitDrop : 46) : 0);
    return [P.x + r[0] * P.s * sxk, P.y + (r[1] + dy) * P.s];
  }

  /* ---------------- flags: drawn once to small canvases, waved in strips ---------------- */
  var FLAGC = {};
  function flagCanvas(kind) {
    if (FLAGC[kind]) return FLAGC[kind];
    var c = document.createElement('canvas'); c.width = 120; c.height = 80; var g = c.getContext('2d'); g.scale(2, 2);
    if (kind === 'sg') { g.fillStyle = '#EF3340'; g.fillRect(0, 0, 60, 20); g.fillStyle = '#FFFFFF'; g.fillRect(0, 20, 60, 20); fillE(g, 12, 10, 7, 7, '#FFFFFF'); fillE(g, 14.5, 10, 6.4, 6.4, '#EF3340'); for (var i = 0; i < 5; i++) { var a = -Math.PI / 2 + i * Math.PI * 2 / 5; star5(g, 20 + Math.cos(a) * 3.6, 10 + Math.sin(a) * 3.6, 1.5, '#FFFFFF'); } }
    else if (kind === 'ph') { g.fillStyle = '#0038A8'; g.fillRect(0, 0, 60, 20); g.fillStyle = '#CE1126'; g.fillRect(0, 20, 60, 20); g.fillStyle = '#FFFFFF'; g.beginPath(); g.moveTo(0, 0); g.lineTo(30, 20); g.lineTo(0, 40); g.closePath(); g.fill(); fillE(g, 10, 20, 4, 4, '#FCD116'); [[3, 5], [3, 35], [24, 20]].forEach(function (p) { star5(g, p[0], p[1], 1.6, '#FCD116'); }); }
    else if (kind === 'vn') { g.fillStyle = '#DA251D'; g.fillRect(0, 0, 60, 40); star5(g, 30, 21, 11, '#FFFF00'); }
    else { for (var s = 0; s < 14; s++) { g.fillStyle = s % 2 ? '#FFFFFF' : '#CC0001'; g.fillRect(0, s * 40 / 14, 60, 40 / 14 + 0.2); } g.fillStyle = '#010066'; g.fillRect(0, 0, 30, 22.9); fillE(g, 11, 11.4, 7, 7, '#FFCC00'); fillE(g, 13.4, 11.4, 6, 6, '#010066'); star5(g, 21, 11.4, 4, '#FFCC00'); }
    FLAGC[kind] = c; return c;
  }
  function flag(g, x, y, w, h, kind, t, ph) {
    var c = flagCanvas(kind), n = 8, sw = w / n;
    for (var i = 0; i < n; i++) { var u = i / n, dy = Math.sin(t * 4 + u * 5 + ph) * 2.2 * (u + 0.15), sh = 1 - 0.06 * Math.cos(t * 4 + u * 5 + ph) * u; g.drawImage(c, i * 15, 0, 15, 80, x + i * sw, y + dy + h * (1 - sh) / 2, sw + 0.4, h * sh); }
  }

  /* ---------------- the static layers ---------------- */
  function paintBg(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    var sg = g.createLinearGradient(0, -280, 0, 400); sg.addColorStop(0, '#73BDF0'); sg.addColorStop(0.6, '#BEE4FA'); sg.addColorStop(1, '#EAF7FD'); g.fillStyle = sg; g.fillRect(e.l, e.t, e.r - e.l, 480 - e.t);
    var gl = g.createRadialGradient(1080, -170, 10, 1080, -170, 360); gl.addColorStop(0, 'rgba(255,248,214,.95)'); gl.addColorStop(0.3, 'rgba(255,244,200,.35)'); gl.addColorStop(1, 'rgba(255,244,200,0)'); g.fillStyle = gl; g.fillRect(e.l, e.t, e.r - e.l, 500); fillE(g, 1080, -170, 22, 22, '#FFF6D0');
    CO.skySG(g, e.l, e.r, 330, 400, { mbs: -620, wheel: 1180, hazy: 'rgba(150,180,220,.45)', near: ['#B8CBE8', '#AFC4E4'] });
    /* the boulevard behind the plaza: a line of rain trees, the kerb, the road */
    g.fillStyle = '#C9DCEA'; g.fillRect(e.l, 400, e.r - e.l, 30); g.fillStyle = '#9AAABE'; g.fillRect(e.l, 430, e.r - e.l, 34); g.fillStyle = '#FFFFFF'; for (var dx = Math.floor(e.l / 60) * 60; dx < e.r; dx += 60) g.fillRect(dx, 446, 30, 3);
    g.fillStyle = '#E8EDF3'; g.fillRect(e.l, 462, e.r - e.l, 8);
    /* the zebra crossing to the plaza, with its two signal poles (the lights blink live) */
    g.fillStyle = '#9AAABE'; g.fillRect(-104, 444, 96, 6); g.fillStyle = 'rgba(255,255,255,.94)'; for (var zy = 432; zy < 461; zy += 5.6) g.fillRect(-100, zy, 88, 3);
    [[-106, 462], [0, 430]].forEach(function (p) { fillRR(g, p[0] - 1.6, p[1] - 58, 3.2, 58, 1.6, '#5C6B7A'); fillRR(g, p[0] - 5, p[1] - 72, 10, 18, 2.5, '#2A3142'); });
    for (var tx = Math.floor(e.l / 90) * 90 + 30; tx < e.r; tx += 90) { var h = hash(tx * 0.13); g.fillStyle = '#8C6A4E'; g.fillRect(tx - 2, 392 - h * 6, 4, 34); fillE(g, tx, 380 - h * 8, 26 + h * 8, 15, '#7DBF8C'); fillE(g, tx - 12, 374 - h * 8, 14, 10, '#93CD9C'); fillE(g, tx + 12, 372 - h * 8, 13, 9, '#A6D8AB'); }
    g.restore();
  }
  var CARS = ['#E5484D', '#FFFFFF', '#2F6FD6', '#F2B233', '#14A38B'];
  function paintWindow(g, t, par, S) {
    var e = S.ext;
    for (var c = 0; c < 6; c++) { var sp = 4 + c * 1.8, span = e.r - e.l + 400, x = e.l - 200 + ((hash(c + 3) * span + t * sp) % span), y = -210 + (c % 3) * 46 + (c > 2 ? 18 : 0); K.cloud(g, x, y, 0.22 + hash(c + 1) * 0.12); }
    var psp = e.r - e.l + 400, px = e.l - 200 + ((t * 26) % psp), py = -150 + Math.sin(t * 0.3) * 6; g.save(); g.translate(px, py); fillE(g, 0, 0, 22, 4, '#FFFFFF'); g.fillStyle = '#FFFFFF'; g.beginPath(); g.moveTo(-4, 0); g.lineTo(-14, -12); g.lineTo(-8, -12); g.lineTo(6, 0); g.closePath(); g.fill(); g.beginPath(); g.moveTo(-16, -1); g.lineTo(-22, -8); g.lineTo(-18, -8); g.lineTo(-12, -1); g.closePath(); g.fill(); fillE(g, 16, -1, 4, 2, '#BFD3EC'); g.restore();
    g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(px - 30, py); g.lineTo(px - 140, py + 2); g.stroke();
    for (var i = 0; i < 7; i++) { var dir = i % 2 ? -1 : 1, span2 = e.r - e.l + 300, cx = dir > 0 ? e.l - 150 + ((t * (40 + i * 7) + hash(i) * span2) % span2) : e.r + 150 - ((t * (36 + i * 6) + hash(i + 7) * span2) % span2), cy = dir > 0 ? 452 : 440, col = CARS[i % 5];
      g.save(); g.translate(cx, cy); g.scale(dir, 1); fillRR(g, -20, -10, 40, 10, 4, col); fillRR(g, -12, -17, 22, 9, 4, col); fillRR(g, -9, -15, 8, 6, 2, '#CFE6F7'); fillRR(g, 1, -15, 7, 6, 2, '#CFE6F7'); fillE(g, -12, 0, 4, 4, '#2A2E3E'); fillE(g, 12, 0, 4, 4, '#2A2E3E'); fillE(g, 19, -6, 1.6, 1.6, '#FFF3B0'); g.restore(); }
    var walk = (t % 10) < 5; [[-106, 462], [0, 430]].forEach(function (p) { fillE(g, p[0], p[1] - 67, 2.6, 2.6, walk ? '#3A4458' : '#E5484D'); fillE(g, p[0], p[1] - 59, 2.6, 2.6, walk ? '#2BC48A' : '#3A4458'); });
    g.strokeStyle = 'rgba(40,60,90,.5)'; g.lineWidth = 1.5; g.lineCap = 'round';
    for (var b = 0; b < 4; b++) { var bsp = e.r - e.l + 300, bx = e.r + 100 - ((t * (15 + b * 3) + hash(b + 9) * bsp) % bsp), by = -90 + b * 14 + Math.sin(t * 0.8 + b) * 6, fl = Math.sin(t * 9 + b * 2) * 4;
      g.beginPath(); g.moveTo(bx - 6, by - fl); g.quadraticCurveTo(bx - 3, by - 3, bx, by); g.quadraticCurveTo(bx + 3, by - 3, bx + 6, by - fl); g.stroke(); }
  }
  function paintFrame(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    /* the plaza: pale granite pavers in perspective */
    var pg = g.createLinearGradient(0, F, 0, e.b); pg.addColorStop(0, '#EEF1F5'); pg.addColorStop(1, '#DDE3EB'); g.fillStyle = pg; g.fillRect(e.l, F, e.r - e.l, e.b - F);
    /* chequered granite: alternate pavers a shade darker, in the same perspective as the joints */
    var yb = e.b + 40, rows = [F]; for (var d = 1; d < 9; d++) rows.push(F + Math.pow(d / 8, 1.5) * (e.b - F));
    function jx(i, y) { var x0 = 700 + i * 56, x1 = 700 + i * 56 * 2.3; return x0 + (x1 - x0) * (y - F) / (yb - F); }
    g.fillStyle = 'rgba(120,140,170,.07)'; g.beginPath();
    for (var r = 0; r < rows.length - 1; r++) for (var i = -40; i < 40; i++) if ((r + i) & 1) { var y0 = rows[r], y1 = rows[r + 1]; g.moveTo(jx(i, y0), y0); g.lineTo(jx(i + 1, y0), y0); g.lineTo(jx(i + 1, y1), y1); g.lineTo(jx(i, y1), y1); g.closePath(); }
    g.fill();
    g.strokeStyle = 'rgba(120,140,170,.16)'; g.lineWidth = 1.2; g.beginPath(); for (var d2 = 1; d2 < rows.length; d2++) { g.moveTo(e.l, rows[d2]); g.lineTo(e.r, rows[d2]); }
    for (var i2 = -40; i2 <= 40; i2++) { g.moveTo(700 + i2 * 56, F); g.lineTo(700 + i2 * 56 * 2.3, yb); } g.stroke();
    /* the kerb, and yellow tactile paving where the crossing lands */
    g.fillStyle = '#D3DCE7'; g.fillRect(e.l, F, e.r - e.l, 6); g.fillStyle = 'rgba(255,255,255,.75)'; g.fillRect(e.l, F + 0.5, e.r - e.l, 1.2); g.fillStyle = 'rgba(30,58,110,.08)'; g.fillRect(e.l, F + 6, e.r - e.l, 5);
    fillRR(g, -102, F + 1, 92, 9, 2, '#F2C94C'); for (var tx = -97; tx < -12; tx += 6) { fillE(g, tx, F + 3.6, 1.2, 0.9, 'rgba(160,110,10,.35)'); fillE(g, tx + 3, F + 7, 1.2, 0.9, 'rgba(160,110,10,.35)'); }
    /* the promenade to the lobby: warm granite with navy joints and brass inlays */
    g.fillStyle = '#F5F0E6'; g.fillRect(e.l, 484, e.r - e.l, 38); g.fillStyle = 'rgba(30,58,110,.2)'; g.fillRect(e.l, 484, e.r - e.l, 2); g.fillRect(e.l, 520, e.r - e.l, 2);
    for (var px = Math.floor(e.l / 64) * 64; px < e.r; px += 64) { g.fillStyle = 'rgba(30,58,110,.07)'; g.fillRect(px + 32, 486, 1.4, 34); g.fillStyle = 'rgba(180,137,42,.55)'; g.beginPath(); g.moveTo(px, 497); g.lineTo(px + 6, 503); g.lineTo(px, 509); g.lineTo(px - 6, 503); g.closePath(); g.fill(); }
    /* the fountain's paving rosette */
    var fx = FNT.x, fy = FNT.y + 6; fillE(g, fx, fy, 178, 40, '#DFE6EF'); fillE(g, fx, fy, 166, 36, '#F3F6FA');
    g.strokeStyle = 'rgba(30,58,110,.1)'; g.lineWidth = 1.2; g.beginPath(); for (var k2 = 0; k2 < 28; k2++) { var a = k2 / 28 * Math.PI * 2; g.moveTo(fx + Math.cos(a) * 128, fy + Math.sin(a) * 28); g.lineTo(fx + Math.cos(a) * 166, fy + Math.sin(a) * 36); } g.stroke();
    g.strokeStyle = 'rgba(180,137,42,.5)'; g.lineWidth = 2; g.beginPath(); g.ellipse(fx, fy, 128, 28, 0, 0, Math.PI * 2); g.stroke();
    g.restore();
  }
  function officeHalf(g, x0, x1, top, floor, key) {
    var C = CO_[key], w = x1 - x0;
    var wg = g.createLinearGradient(0, top, 0, floor); wg.addColorStop(0, '#FBFCFE'); wg.addColorStop(1, '#F1F5FA'); g.fillStyle = wg; g.fillRect(x0, top, w, floor - top);
    g.fillStyle = C.c; g.globalAlpha = 0.07; g.fillRect(x0, top, w, floor - top); g.globalAlpha = 1;
    /* a ribbon window on the back wall: the sky and the city beyond */
    var wy = top + 22, wh = 40; fillRR(g, x0 + 10, wy, w - 20, wh, 3, '#D6EAF8'); g.fillStyle = 'rgba(160,190,225,.6)'; for (var bx = x0 + 16; bx < x1 - 14; bx += 22) { var bh = 8 + hash(bx * 0.7 + top) * 22; g.fillRect(bx, wy + wh - bh, 14, bh); }
    g.fillStyle = 'rgba(255,255,255,.4)'; g.beginPath(); g.moveTo(x0 + 30, wy + wh); g.lineTo(x0 + 50, wy); g.lineTo(x0 + 62, wy); g.lineTo(x0 + 42, wy + wh); g.closePath(); g.fill();
    g.fillStyle = '#FFFFFF'; for (var mx = x0 + 10 + (w - 20) / 4; mx < x1 - 12; mx += (w - 20) / 4) g.fillRect(mx - 1.5, wy, 3, wh); fillRR(g, x0 + 6, wy + wh, w - 12, 4, 2, '#E3E9F1');
    /* the company sign: its code, its name and its own currency */
    fillRR(g, x0 + 10, top + 4, 92, 15, 4, C.c); text(g, C.code + ' · ' + C.name, x0 + 16, top + 14.6, 7.4, 800, '#FFFFFF'); fillRR(g, x0 + 106, top + 4, 30, 15, 4, '#FFFFFF'); text(g, C.cur, x0 + 121, top + 14.6, 7, 800, C.c, 'center');
    K.clockFace(g, { x: x1 - 20, y: top + 12, r: 8 }, C.c);
    fillRR(g, x0, floor - 6, w, 6, 0, '#D9E1EC'); g.fillStyle = 'rgba(255,255,255,.6)'; g.fillRect(x0, floor - 6, w, 1.5);
  }
  function plantPot(g, x, y, s) { g.save(); g.translate(x, y); g.scale(s, s); K.plant(g, { x: 0, y: 0 }, '#E7EDF5', '#F3F6FA'); g.restore(); }
  function cabinet(g, x, y, w, h, col) { fillRR(g, x, y - h, w, h, 3, col || '#C9D3DE'); for (var d = 0; d < 3; d++) { fillRR(g, x + 3, y - h + 4 + d * (h - 6) / 3, w - 6, (h - 6) / 3 - 3, 2, '#E3E9F1'); fillRR(g, x + w / 2 - 5, y - h + 8 + d * (h - 6) / 3, 10, 2.5, 1, '#9AA6BC'); } }
  function boxes(g, x, y, col) { [[0, 0, 26, 20], [26, 0, 22, 20], [6, 20, 26, 18], [32, 20, 18, 14]].forEach(function (b, i) { fillRR(g, x + b[0], y - b[1] - b[3], b[2] - 2, b[3], 2, i % 2 ? '#D9AE7E' : '#C99A6B'); fillRR(g, x + b[0] + 4, y - b[1] - b[3] + 4, 10, 6, 1, '#FFFFFF'); }); fillRR(g, x + 4, y - 40, 26, 3, 1, col); }
  function paintBack(g, ext) {
    lzBack(g, ext);
    /* the far-left plaza (wide screens): the group's monument sign, benches, lamps */
    if (ext.l < -440) {
      var mx = -900; soft(g, mx + 60, F + 2, 90, 7, 0.24); fillRR(g, mx, F - 70, 120, 70, 6, '#E3E9F1'); fillRR(g, mx, F - 70, 120, 16, 6, NAVY); text(g, 'GROUP HQ', mx + 60, F - 58, 9, 800, '#FFFFFF', 'center');
      [['sg', 0], ['ph', 1], ['vn', 2], ['my', 3]].forEach(function (p) { fillRR(g, mx + 10 + p[1] * 26, F - 44, 22, 22, 5, CO_[p[0]].c); text(g, CO_[p[0]].code, mx + 21 + p[1] * 26, F - 29.6, 7.4, 800, '#FFFFFF', 'center'); }); text(g, 'one Odoo for the group', mx + 60, F - 10, 6.4, 800, NAVY, 'center');
      [-1080, -740].forEach(function (bx) { soft(g, bx + 40, F + 2, 50, 5, 0.2); fillRR(g, bx, F - 26, 80, 8, 3, '#C99A6B'); fillRR(g, bx, F - 44, 80, 6, 3, '#C99A6B'); fillRR(g, bx + 6, F - 18, 5, 18, 2, '#5C6B7A'); fillRR(g, bx + 69, F - 18, 5, 18, 2, '#5C6B7A'); });
      [-1000, -636].forEach(function (lx) { fillRR(g, lx - 2, F - 150, 4, 150, 2, '#5C6B7A'); fillRR(g, lx - 10, F - 158, 20, 10, 4, '#3A4458'); fillE(g, lx, F - 146, 6, 3, '#FFF3B0'); fillRR(g, lx + 2, F - 140, 16, 26, 2, CO_.sg.c); fillRR(g, lx + 2, F - 110, 16, 26, 2, BLUE); });
    }
    /* the far-right street (wide screens): the neighbour block, a café kiosk */
    if (ext.r > 1020) {
      fillRR(g, 1070, 40, 220, 430, 4, '#E6ECF3'); for (var wy = 56, fl = 0; wy < 360; wy += 40, fl++) { fillRR(g, 1074, wy + 30, 212, 6, 2, '#FFFFFF'); for (var wx = 1084, n = 0; wx < 1276; wx += 32, n++) { var hv = hash(wx * 0.3 + wy);
          fillRR(g, wx, wy, 22, 28, 2, hv > 0.75 ? '#FFE9B8' : '#C6DCF0'); g.fillStyle = 'rgba(255,255,255,.5)'; g.fillRect(wx + 3, wy + 2, 3, 24);
          if (hv < 0.22) { g.fillStyle = '#6FB97F'; g.beginPath(); g.ellipse(wx + 11, wy + 26, 10, 7, 0, Math.PI, 0); g.fill(); fillRR(g, wx + 4, wy + 25, 14, 6, 2, '#C99A6B'); } } }
      fillRR(g, 1066, 30, 228, 14, 4, '#C9D3DE'); fillRR(g, 1090, 6, 40, 24, 4, '#B8C4D3'); fillE(g, 1250, 18, 16, 8, '#E3E9F1'); g.strokeStyle = '#9AA6BC'; g.lineWidth = 2; g.beginPath(); g.moveTo(1250, 18); g.lineTo(1262, 2); g.stroke();
      [1150, 1176, 1202, 1228].forEach(function (px, i) { fillE(g, px, 20, 11, 9, ['#7DC48D', '#6FB97F', '#93CD9C', '#7DC48D'][i]); }); fillRR(g, 1140, 22, 100, 8, 3, '#C99A6B');
      fillRR(g, 1130, 380, 100, 90, 4, '#FFFFFF'); for (var aw = 0; aw < 6; aw++) { g.fillStyle = aw % 2 ? '#FFFFFF' : '#E99A12'; g.beginPath(); g.moveTo(1126 + aw * 18, 370); g.lineTo(1144 + aw * 18, 370); g.lineTo(1144 + aw * 18, 386); g.arc(1135 + aw * 18, 386, 9, 0, Math.PI); g.closePath(); g.fill(); }
      text(g, 'KOPI', 1180, 410, 12, 800, '#B4651A', 'center'); fillRR(g, 1140, 420, 80, 30, 3, '#F3E7D6'); fillRR(g, 1146, 426, 14, 18, 3, '#FFFFFF'); fillRR(g, 1166, 426, 14, 18, 3, '#FFFFFF');
    }
    /* the annex going up on the group template, and its tower crane */
    annex(g);
    /* the four country flags out front */
    FLAGS.forEach(function (x) { soft(g, x, F + 2, 10, 2.5, 0.24); fillRR(g, x - 1.8, 150, 3.6, F - 150, 1.8, '#C9D3DE'); g.fillStyle = 'rgba(255,255,255,.7)'; g.fillRect(x - 1, 152, 1, F - 154); fillE(g, x, 149, 3.4, 3.4, GOLD); fillRR(g, x - 7, F - 7, 14, 7, 2, '#9AA6BC'); });
    /* the tower */
    tower(g);
    /* the right-hand plaza: a tree in a planter and a lamp */
    soft(g, 976, F + 3, 30, 5, 0.24); fillRR(g, 960, F - 30, 32, 30, 4, '#C9D3DE'); g.fillStyle = '#8C6A4E'; g.fillRect(974, F - 120, 5, 92); fillE(g, 976, F - 128, 26, 22, '#7DBF8C'); fillE(g, 966, F - 136, 14, 12, '#93CD9C'); fillE(g, 986, F - 140, 12, 10, '#A6D8AB');
  }
  /* ---------------- the left plaza: static layers ---------------- */
  function lzBack(g, ext) {
    /* a distant group tower (a gondola davit on its roof, the four company colours in its crown) */
    var T = TALL, w = T.r - T.l - 30;
    soft(g, T.l + 80, F + 3, 100, 6, 0.18);
    fillRR(g, T.l, T.top, w, F - T.top, 3, '#DCE6F1'); g.fillStyle = '#C9D7E7'; g.fillRect(T.l + w, T.top + 8, 30, F - T.top - 8);
    for (var wy = T.top + 34; wy < F - 34; wy += 24) { for (var wx = T.l + 10; wx < T.l + w - 12; wx += 20) { var hv = hash(wx * 0.37 + wy * 0.11); fillRR(g, wx, wy, 13, 15, 1.5, hv > 0.86 ? '#FFF1C9' : hv < 0.14 ? '#C3D5E8' : '#EEF4FA'); }
      g.fillStyle = 'rgba(255,255,255,.4)'; g.fillRect(T.l + w + 5, wy, 20, 14); }
    fillRR(g, T.l - 6, T.top - 10, w + 12, 16, 3, '#C3D2E4'); fillRR(g, T.l + 22, T.top - 30, w - 44, 22, 3, '#CFDBEA'); g.fillStyle = '#9AA6BC'; g.fillRect(T.l + w / 2 - 2, T.top - 84, 4, 56); fillE(g, T.l + w / 2, T.top - 86, 3, 3, '#E5484D');
    [CO_.sg.c, CO_.ph.c, CO_.vn.c, CO_.my.c].forEach(function (c, i) { fillRR(g, T.l + 6 + i * (w - 12) / 4, T.top + 12, (w - 12) / 4 - 3, 6, 2, c); });
    fillRR(g, T.l + 2, T.top - 18, 84, 5, 2, '#7A869C'); fillRR(g, T.l + 6, T.top - 24, 5, 10, 1, '#7A869C'); fillRR(g, T.l + 76, T.top - 24, 5, 10, 1, '#7A869C');
    fillRR(g, T.l, F - 54, w, 54, 2, '#EAF1F8'); for (var dx = T.l + 8; dx < T.l + w - 8; dx += 30) fillRR(g, dx, F - 48, 24, 48, 2, '#CFE3F5');
    /* a mid-rise behind the pavilion, a roof garden on top */
    var ml = -376, mr = -212; fillRR(g, ml, 40, mr - ml, F - 40, 3, '#E4ECF5'); g.fillStyle = 'rgba(30,58,110,.05)'; g.fillRect(mr - 22, 40, 22, F - 40);
    /* the sky bridge between the two towers (a colleague crosses it, live) */
    fillRR(g, TALL.r - 2, 66, ml - TALL.r + 4, 26, 4, 'rgba(205,228,247,.95)'); g.strokeStyle = '#FFFFFF'; g.lineWidth = 2; g.beginPath(); for (var bx2 = TALL.r + 10; bx2 < ml; bx2 += 18) { g.moveTo(bx2, 66); g.lineTo(bx2, 92); } g.stroke(); fillRR(g, TALL.r - 4, 90, ml - TALL.r + 8, 5, 2, '#C9D3DE'); fillRR(g, TALL.r - 4, 62, ml - TALL.r + 8, 5, 2, '#E8EEF5');
    for (var y2 = 60; y2 < 316; y2 += 26) { fillRR(g, ml + 6, y2, mr - ml - 12, 16, 2, '#CFE0F1'); g.fillStyle = '#FFFFFF'; for (var mx2 = ml + 26; mx2 < mr - 8; mx2 += 26) g.fillRect(mx2, y2, 2, 16); }
    fillRR(g, ml - 4, 32, mr - ml + 8, 10, 3, '#C9D3DE'); [16, 44, 74, 104, 136].forEach(function (px, i) { fillE(g, ml + px, 26, 14, 10, ['#7DC48D', '#93CD9C', '#6FB97F', '#A6D8AB', '#7DC48D'][i]); });
    g.strokeStyle = '#C99A6B'; g.lineWidth = 2; g.beginPath(); g.moveTo(ml + 52, 32); g.lineTo(ml + 52, 2); g.lineTo(ml + 118, 2); g.lineTo(ml + 118, 32); g.stroke();
    /* the training pavilion: a glass box with a go-live class inside */
    var P = PAV, pw = P.r - P.l; soft(g, (P.l + P.r) / 2, F + 3, pw * 0.6, 7, 0.24);
    var ig = g.createLinearGradient(0, P.top, 0, F); ig.addColorStop(0, '#FFFFFF'); ig.addColorStop(1, '#EDF3F9'); g.fillStyle = ig; g.fillRect(P.l, P.top, pw, F - P.top);
    g.fillStyle = 'rgba(20,163,139,.06)'; g.fillRect(P.l, P.top, pw, F - P.top); fillRR(g, P.l, F - 6, pw, 6, 0, '#D9E1EC');
    var s = P.scr; shadowed(g, 6, 2, 0.18, function () { fillRR(g, s[0] - 3, s[1] - 3, s[2] + 6, s[3] + 6, 4, '#2A3142'); });
    fillRR(g, P.l + 8, F - 36, 62, 30, 3, '#E3E9F1'); fillRR(g, P.l + 12, F - 30, 26, 10, 2, '#FFFFFF'); fillRR(g, P.l + 42, F - 30, 24, 10, 2, '#FFFFFF'); plantPot(g, P.l + 58, F - 36, 0.24);
    shadowed(g, 6, 2, 0.12, function () { fillRR(g, -262, 350, 46, 40, 3, '#FFFFFF'); }); text(g, 'ROLLOUT', -239, 359, 5, 800, NAVY, 'center');
    [[BLUE, 10], [GOLD, 17], ['#14A38B', 24]].forEach(function (b, i) { fillRR(g, -256 + i * 13, 384 - b[1], 9, b[1], 1.5, b[0]); });
    K.clockFace(g, { x: P.r - 18, y: P.top + 22, r: 8 }, '#14A38B');
    [P.l - 6, P.r - 2].forEach(function (x) { fillRR(g, x, P.top, 8, F - P.top, 2, '#E8EEF5'); });
    fillRR(g, P.l - 12, P.top - 12, pw + 24, 14, 3, '#FFFFFF'); g.fillStyle = '#C9D3DE'; g.fillRect(P.l - 12, P.top, pw + 24, 2);
    fillRR(g, -372, P.top - 38, 124, 24, 6, NAVY); g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(-368, P.top - 35, 116, 3); text(g, 'TRAINING ROOM', -310, P.top - 22.4, 8.6, 800, '#FFD84A', 'center');
    fillRR(g, -360, P.top - 14, 4, 4, 1, '#5C6B7A'); fillRR(g, -264, P.top - 14, 4, 4, 1, '#5C6B7A');
    /* the wayfinding pylon */
    var px = PYL.x, pyw = PYL.w; soft(g, px + pyw / 2, F + 2, 34, 4, 0.22); shadowed(g, 8, 3, 0.16, function () { fillRR(g, px, PYL.top, pyw, F - PYL.top, 6, NAVY); });
    fillRR(g, px, PYL.top, pyw, 10, 5, GOLD); g.fillStyle = 'rgba(255,255,255,.1)'; g.fillRect(px + 4, PYL.top + 12, 4, F - PYL.top - 16);
    text(g, 'GROUP HQ', px + pyw / 2, PYL.top + 25, 7.4, 800, '#FFFFFF', 'center');
    [['SKY DECK', '▲', GOLD], ['TOWER', '▶', CO_.ph.c], ['TRAINING', '◀', '#14A38B'], ['ODOO.SH', '▶', PUR]].forEach(function (r2, i) { var y = PYL.top + 34 + i * 20; fillRR(g, px + 5, y, pyw - 10, 15, 3, '#FFFFFF'); fillRR(g, px + 5, y, 12, 15, 3, r2[2]); text(g, r2[1], px + 11, y + 10.4, 6, 800, '#FFFFFF', 'center'); text(g, r2[0], px + 33, y + 10.2, 5.6, 800, INK, 'center'); });
    /* a rain tree in a planter by the crossing */
    soft(g, 66, F + 3, 34, 5, 0.24); g.fillStyle = '#8C6A4E'; g.fillRect(63, 292, 6, F - 310); g.strokeStyle = '#8C6A4E'; g.lineWidth = 4; g.lineCap = 'round'; g.beginPath(); g.moveTo(66, 340); g.lineTo(40, 304); g.moveTo(66, 326); g.lineTo(96, 298); g.stroke();
    fillE(g, 66, 290, 66, 38, '#7DBF8C'); fillE(g, 26, 292, 34, 24, '#93CD9C'); fillE(g, 108, 286, 32, 22, '#A6D8AB'); fillE(g, 62, 266, 42, 24, '#93CD9C'); fillE(g, 86, 300, 26, 14, '#6FB97F');
    fillRR(g, 46, F - 24, 40, 24, 4, '#C9D3DE'); fillRR(g, 43, F - 28, 46, 7, 3, '#E3E9F1');
  }
  function lzFront(g) {
    /* the trainees' open desk with laptops between them, then the pavilion's glass front over the class */
    openDesk(g, -314, 436, 116, 466); [-277, -239].forEach(function (x) { fillRR(g, x - 7, 427, 14, 9, 1.5, '#2A3142'); fillRR(g, x - 6, 428, 12, 7, 1, '#BFE0F7'); fillRR(g, x - 9, 435, 18, 2, 1, '#9AA6BC'); });
    var P = PAV; g.fillStyle = 'rgba(214,234,248,.2)'; g.fillRect(P.l, P.top, P.r - P.l, F - P.top);
    g.fillStyle = 'rgba(255,255,255,.3)'; [[P.l + 24, 22], [P.l + 140, 12]].forEach(function (sl) { g.beginPath(); g.moveTo(sl[0], F - 6); g.lineTo(sl[0] + 36, P.top + 18); g.lineTo(sl[0] + 36 + sl[1], P.top + 18); g.lineTo(sl[0] + sl[1], F - 6); g.closePath(); g.fill(); });
    fillRR(g, P.l, P.top + 2, P.r - P.l, 16, 0, 'rgba(255,255,255,.55)'); fillRR(g, P.l, P.top + 17, P.r - P.l, 2.4, 0, '#FFFFFF'); fillRR(g, -362, P.top + 18, 3, F - P.top - 24, 1, '#FFFFFF');
    text(g, 'go-live training · local team', -310, P.top + 13, 6.2, 800, '#0E7A68', 'center');
  }
  function lzFore(g) {
    /* two bollards at the plaza's far edge */
    [-604, -562].forEach(function (bx) { soft(g, bx, 643, 10, 3, 0.25); fillRR(g, bx - 6, 600, 12, 42, 6, '#9AA6BC'); fillRR(g, bx - 6, 608, 12, 4, 2, GOLD); });
    /* the fountain: a round basin edged in the four company colours, an upper bowl, a gold globe on top */
    var fx = FNT.x, fy = FNT.y; soft(g, fx, fy + 14, 128, 14, 0.22);
    fillE(g, fx, fy + 4, 112, 22, '#B9C9DB'); g.fillStyle = '#B9C9DB'; g.fillRect(fx - 112, fy - 12, 224, 16); fillE(g, fx, fy - 12, 112, 22, '#E3EAF3'); fillE(g, fx, fy - 12, 101, 17, '#7FC0EC'); fillE(g, fx - 24, fy - 16, 58, 7, 'rgba(255,255,255,.3)');
    [CO_.sg.c, CO_.ph.c, CO_.vn.c, CO_.my.c].forEach(function (c, i) { fillRR(g, fx - 70 + i * 36, fy + 8, 28, 7, 2, c); });
    fillRR(g, fx - 9, fy - 72, 18, 60, 5, '#D3DDE9'); g.fillStyle = 'rgba(255,255,255,.55)'; g.fillRect(fx - 6, fy - 70, 3, 56);
    fillE(g, fx, fy - 72, 42, 9, '#C9D6E6'); fillE(g, fx, fy - 74, 36, 6.5, '#8FCBF0'); fillRR(g, fx - 4, fy - 100, 8, 28, 3, '#D3DDE9');
    fillE(g, fx, fy - 104, 9, 9, GOLD); fillE(g, fx - 3, fy - 107, 3, 3, '#FFF3B0'); g.strokeStyle = 'rgba(180,137,42,.8)'; g.lineWidth = 1; g.beginPath(); g.ellipse(fx, fy - 104, 9, 3.4, 0, 0, Math.PI * 2); g.stroke();
    /* the kopi cart: umbrella, counter, espresso machine, cups, an A-frame menu */
    var cx = CART.x, cy = CART.y; soft(g, cx, cy + 6, 76, 8, 0.24);
    var po = cx + 40; g.fillStyle = '#5C6B7A'; g.fillRect(po - 1.5, cy - 240, 3, 168);
    for (var k = 0; k < 5; k++) { var a0 = po - 60 + k * 24; g.fillStyle = k % 2 ? '#FFFFFF' : NAVY; g.beginPath(); g.moveTo(po, cy - 258); g.lineTo(a0, cy - 230); g.quadraticCurveTo(a0 + 12, cy - 222, a0 + 24, cy - 230); g.closePath(); g.fill(); }
    fillE(g, po, cy - 259, 3, 3, GOLD);
    fillRR(g, cx - 56, cy - 70, 112, 60, 6, '#FFFFFF'); g.fillStyle = 'rgba(226,178,58,.22)'; for (var st = cx - 50; st < cx + 52; st += 16) g.fillRect(st, cy - 54, 8, 40);
    fillRR(g, cx - 56, cy - 70, 112, 15, 6, NAVY); g.fillRect(cx - 56, cy - 62, 112, 7); text(g, 'KOPI · TEH', cx, cy - 59, 8, 800, '#FFD84A', 'center');
    fillRR(g, cx - 62, cy - 78, 124, 9, 3, '#C99A6B'); g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(cx - 60, cy - 77, 120, 1.5);
    fillRR(g, cx - 48, cy - 106, 34, 28, 4, '#C9D3DE'); fillRR(g, cx - 44, cy - 102, 26, 8, 2, '#3A4458'); fillRR(g, cx - 35, cy - 92, 8, 7, 1, '#5C6B7A'); fillE(g, cx - 21, cy - 99, 2, 2, '#2BC48A');
    [0, 1, 2].forEach(function (i) { fillRR(g, cx + 14 + i * 11, cy - 90, 9, 12, 1.5, '#FFFFFF'); fillRR(g, cx + 14 + i * 11, cy - 90, 9, 3, 1, '#C98E55'); });
    [-34, 34].forEach(function (d) { fillE(g, cx + d, cy - 6, 11, 11, '#3A4458'); fillE(g, cx + d, cy - 6, 4, 4, '#9AA6BC'); });
    var ax = cx + 66; soft(g, ax + 13, cy + 2, 18, 3, 0.2); g.fillStyle = '#8C6A4E'; g.beginPath(); g.moveTo(ax, cy); g.lineTo(ax + 8, cy - 52); g.lineTo(ax + 18, cy - 52); g.lineTo(ax + 26, cy); g.closePath(); g.fill();
    fillRR(g, ax + 4, cy - 48, 18, 40, 2, '#2A3142'); text(g, 'KOPI', ax + 13, cy - 38, 5.4, 800, '#FFD84A', 'center'); g.fillStyle = 'rgba(255,255,255,.6)'; for (var ln = 0; ln < 4; ln++) g.fillRect(ax + 7, cy - 32 + ln * 6, 12 - (ln % 2) * 4, 1.4);
    /* the cafe table beside the client's chair, and an empty chair opposite */
    var tx = CAFE.x + 4, ty = CAFE.y; soft(g, tx, ty + 2, 30, 4, 0.22); fillRR(g, tx - 2, ty - 70, 4, 70, 2, '#5C6B7A'); fillE(g, tx, ty - 1, 15, 3.6, '#5C6B7A');
    fillE(g, tx, ty - 70, 30, 7, '#D9E1EC'); fillE(g, tx, ty - 72, 30, 6.4, '#FFFFFF'); fillE(g, tx + 10, ty - 73, 8, 2.4, '#E3E9F1'); fillRR(g, tx + 6, ty - 82, 8, 9, 1.5, '#FFFFFF'); fillRR(g, tx + 6, ty - 82, 8, 2.6, 1, '#C98E55');
    fillRR(g, tx - 16, ty - 84, 5, 12, 2, '#BFE0F7'); fillE(g, tx - 13.5, ty - 87, 4, 4, '#FF8FA3');
    var chx = tx + 52; soft(g, chx, ty + 2, 22, 3, 0.2); g.strokeStyle = GOLD_D; g.lineWidth = 3; g.lineCap = 'round'; g.beginPath(); g.moveTo(chx - 14, ty); g.lineTo(chx - 12, ty - 40); g.moveTo(chx + 14, ty); g.lineTo(chx + 12, ty - 40); g.moveTo(chx + 12, ty - 40); g.lineTo(chx + 14, ty - 84); g.stroke();
    fillRR(g, chx - 18, ty - 44, 36, 7, 3, GOLD); fillRR(g, chx + 6, ty - 88, 12, 40, 4, GOLD);
  }
  function annex(g) {
    var l = ANX.l, r = ANX.r, w = r - l;
    soft(g, (l + r) / 2, F + 3, w * 0.6, 7, 0.24);
    [[380, 'PILOT', '#3167CA'], [290, 'TEMPLATE', GOLD_D]].forEach(function (f) { var y = f[0];
      fillRR(g, l, y, w, F - y >= 90 ? 90 : F - y, 0, '#F4F7FB'); fillRR(g, l, y, w, 6, 0, '#D9E1EC'); g.fillStyle = '#CFE3F5'; for (var wx = l + 10; wx < r - 10; wx += 26) g.fillRect(wx, y + 18, 18, 46); g.fillStyle = 'rgba(255,255,255,.5)'; g.fillRect(l + 12, y + 18, 3, 46);
      fillRR(g, r - 84, y + 70, 76, 14, 4, f[2]); text(g, f[1] + ' ✓', r - 46, y + 80, 7, 800, '#FFFFFF', 'center'); });
    /* the waiting slot: steel columns, a slab edge */
    g.strokeStyle = '#9AA6BC'; g.lineWidth = 4; g.beginPath(); g.moveTo(l + 3, 290); g.lineTo(l + 3, 200); g.moveTo(r - 3, 290); g.lineTo(r - 3, 200); g.stroke(); g.setLineDash([6, 5]); g.lineWidth = 1.6; g.strokeStyle = 'rgba(30,58,110,.4)'; rr(g, l + 8, 204, w - 16, 82, 4); g.stroke(); g.setLineDash([]);
    text(g, 'next entity', (l + r) / 2, 250, 8, 800, 'rgba(30,58,110,.55)', 'center');
    fillRR(g, l - 6, F - 8, w + 12, 8, 2, '#C9D3DE'); fillRR(g, l + w / 2 - 16, F - 50, 32, 42, 3, '#BFD3EC'); g.fillStyle = '#FFFFFF'; g.fillRect(l + w / 2 - 1, F - 50, 2, 42);
    /* the crane: a lattice mast, the jib, the counter-jib with its weights, the cab */
    var top = -112; g.fillStyle = GOLD; g.fillRect(MAST - 7, top, 14, F - top); g.strokeStyle = '#B4892A'; g.lineWidth = 1.4; g.beginPath(); for (var y = top; y < F; y += 16) { g.moveTo(MAST - 7, y); g.lineTo(MAST + 7, y + 16); g.moveTo(MAST + 7, y); g.lineTo(MAST - 7, y + 16); } g.stroke();
    g.fillStyle = GOLD; g.fillRect(40, top - 12, 330, 10); g.beginPath(); g.moveTo(MAST, top - 52); g.lineTo(MAST - 6, top - 12); g.lineTo(MAST + 6, top - 12); g.closePath(); g.fill();
    g.strokeStyle = '#B4892A'; g.lineWidth = 1.2; g.beginPath(); for (var jx = 40; jx < 370; jx += 12) { g.moveTo(jx, top - 12); g.lineTo(jx + 6, top - 2); g.lineTo(jx + 12, top - 12); } g.moveTo(MAST, top - 52); g.lineTo(366, top - 12); g.moveTo(MAST, top - 52); g.lineTo(50, top - 12); g.stroke();
    fillRR(g, 50, top - 2, 40, 20, 3, '#5C6B7A'); fillRR(g, MAST + 8, top - 2, 30, 24, 4, '#FFFFFF'); fillRR(g, MAST + 11, top + 1, 24, 12, 3, '#BFE0F7'); fillRR(g, 366, top - 14, 6, 14, 2, '#E0456B');
    text(g, 'ROLLOUT', 250, top - 4, 6.6, 800, '#7A5A12', 'center');
  }
  function tower(g) {
    var l = TW.l, r = TW.r;
    soft(g, (l + r) / 2, F + 4, (r - l) * 0.6, 9, 0.26);
    /* the sky deck: a glass dome with ribs, the spire */
    g.fillStyle = 'rgba(214,234,248,.55)'; g.beginPath(); g.moveTo(l, DECK); g.lineTo(l, -120); g.quadraticCurveTo(l, -214, (l + r) / 2, -214); g.quadraticCurveTo(r, -214, r, -120); g.lineTo(r, DECK); g.closePath(); g.fill();
    g.fillStyle = '#FDF8EA'; g.fillRect(l + 4, -112, r - l - 8, DECK + 112); g.fillStyle = 'rgba(226,178,58,.08)'; g.fillRect(l + 4, -112, r - l - 8, DECK + 112);
    g.strokeStyle = '#FFFFFF'; g.lineWidth = 4; g.beginPath(); g.moveTo(l, DECK); g.lineTo(l, -120); g.quadraticCurveTo(l, -214, (l + r) / 2, -214); g.quadraticCurveTo(r, -214, r, -120); g.lineTo(r, DECK); g.stroke();
    g.lineWidth = 2; g.strokeStyle = 'rgba(255,255,255,.85)'; g.beginPath(); for (var rb = 1; rb < 6; rb++) { var rx = l + (r - l) * rb / 6; g.moveTo(rx, -112); g.quadraticCurveTo(rx, -200 + Math.abs(rb - 3) * 8, (l + r) / 2 + (rx - (l + r) / 2) * 0.3, -212); } g.moveTo(l, -112); g.lineTo(r, -112); g.stroke();
    fillRR(g, (l + r) / 2 - 3, -270, 6, 58, 3, '#C9D3DE'); fillE(g, (l + r) / 2, -272, 4, 4, '#E0456B');
    fillRR(g, l + 8, -108, 120, 16, 4, GOLD); text(g, 'SKY DECK · GROUP BOARD', l + 68, -97, 6.8, 800, '#3A2A0A', 'center');
    /* the consolidated screen */
    shadowed(g, 12, 4, 0.22, function () { fillRR(g, SCR.x - 6, SCR.y - 6, SCR.w + 12, SCR.h + 12, 8, '#2A3142'); }); fillRR(g, SCR.x, SCR.y, SCR.w, SCR.h, 4, '#FFFFFF');
    fillRR(g, SCR.x, SCR.y, SCR.w, 17, 4, PUR); g.fillRect(SCR.x, SCR.y + 10, SCR.w, 7); text(g, 'GROUP P&L · consolidated in SGD', SCR.x + 8, SCR.y + 11.8, 7.2, 800, '#FFFFFF');
    fillRR(g, SCR.x + SCR.w / 2 - 6, SCR.y + SCR.h + 6, 12, DECK - SCR.y - SCR.h - 6, 3, '#5C6B7A');
    /* floor slabs and the outer columns */
    [[DECK, 8], [FL2.floor, 8], [FL1.floor, 8]].forEach(function (s) { fillRR(g, l - 8, s[0], r - l + 16, s[1], 2, '#FFFFFF'); g.fillStyle = '#C9D3DE'; g.fillRect(l - 8, s[0] + s[1] - 2, r - l + 16, 2); });
    officeHalf(g, l, LIFT.l, FL2.top, FL2.floor, 'sg'); officeHalf(g, LIFT.r, r, FL2.top, FL2.floor, 'ph'); officeHalf(g, l, LIFT.l, FL1.top, FL1.floor, 'vn'); officeHalf(g, LIFT.r, r, FL1.top, FL1.floor, 'my');
    /* the lobby */
    var lg = g.createLinearGradient(0, LOB.top, 0, F); lg.addColorStop(0, '#FFFFFF'); lg.addColorStop(1, '#EEF2F7'); g.fillStyle = lg; g.fillRect(l, LOB.top, r - l, F - LOB.top);
    g.fillStyle = 'rgba(30,58,110,.05)'; for (var px = l + 20; px < r; px += 40) g.fillRect(px, LOB.top, 2, F - LOB.top); fillRR(g, l, F - 8, r - l, 8, 0, '#D9E1EC');
    /* the FX board */
    shadowed(g, 8, 3, 0.18, function () { fillRR(g, FX.x, FX.y, FX.w, FX.h, 6, NAVY); }); text(g, 'FX · group currency SGD', FX.x + 8, FX.y + 12, 7, 800, '#9FC4FF');
    [['PHP', '43.50', CO_.ph.c], ['VND', '20,200', CO_.vn.c], ['MYR', '3.30', CO_.my.c]].forEach(function (r2, i) { var x = FX.x + 8 + i * 64; fillRR(g, x, FX.y + 18, 58, 32, 4, '#14294F'); fillRR(g, x, FX.y + 18, 4, 32, 2, r2[2]); text(g, '1 SGD =', x + 9, FX.y + 28, 5.6, 700, '#9FB4D8'); text(g, r2[0], x + 9, FX.y + 46, 7, 800, '#FFFFFF'); });
    /* the directory, the server room */
    shadowed(g, 8, 3, 0.16, function () { fillRR(g, DIR.x, DIR.y, DIR.w, DIR.h, 6, '#FFFFFF'); }); fillRR(g, DIR.x, DIR.y, DIR.w, 15, 6, NAVY); g.fillRect(DIR.x, DIR.y + 8, DIR.w, 7); text(g, 'DIRECTORY', DIR.x + DIR.w / 2, DIR.y + 11, 7, 800, '#FFFFFF', 'center');
    [['SKY', 'Group board', GOLD], ['2', 'SG Holding · PH', CO_.sg.c], ['1', 'VN · MY', CO_.vn.c], ['G', 'Lobby · Odoo.sh', BLUE]].forEach(function (d, i) { var y = DIR.y + 22 + i * 17; fillRR(g, DIR.x + 6, y, 20, 13, 3, d[2]); text(g, d[0], DIR.x + 16, y + 9.6, 6.4, 800, '#FFFFFF', 'center'); text(g, d[1], DIR.x + 30, y + 9.6, 6.4, 800, INK); });
    fillRR(g, SRV.x, SRV.y, SRV.w, F - SRV.y, 4, '#E6EEF8'); g.strokeStyle = '#B8C8DC'; g.lineWidth = 2; rr(g, SRV.x, SRV.y, SRV.w, F - SRV.y, 4); g.stroke();
    fillRR(g, SRV.x + 4, SRV.y + 4, SRV.w - 8, 14, 3, PUR); text(g, 'Odoo.sh', SRV.x + SRV.w / 2, SRV.y + 14, 7.4, 800, '#FFFFFF', 'center');
    ['PROD', 'STAGING', 'DEV'].forEach(function (n, i) { var x = SRV.x + 6 + i * 26; fillRR(g, x, SRV.y + 26, 22, F - SRV.y - 34, 3, '#2A3142'); text(g, n, x + 11, SRV.y + 36, 4.4, 800, '#9FC4FF', 'center'); for (var u = 0; u < 7; u++) fillRR(g, x + 3, SRV.y + 42 + u * 16, 16, 10, 2, '#3A4458'); });
    g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.moveTo(SRV.x + 10, F); g.lineTo(SRV.x + 40, SRV.y); g.lineTo(SRV.x + 52, SRV.y); g.lineTo(SRV.x + 22, F); g.closePath(); g.fill();
    /* the lift: a glass shaft through the core, door frames on every floor */
    g.fillStyle = 'rgba(190,220,245,.55)'; g.fillRect(LIFT.l, DECK - 60, LIFT.r - LIFT.l, F - DECK + 60); g.fillStyle = '#9FB4CC'; g.fillRect(LIFT.l, DECK - 60, 3, F - DECK + 60); g.fillRect(LIFT.r - 3, DECK - 60, 3, F - DECK + 60);
    g.fillStyle = 'rgba(255,255,255,.5)'; for (var gy = DECK - 60; gy < F; gy += 30) g.fillRect(LIFT.l + 3, gy, LIFT.r - LIFT.l - 6, 1.4);
    /* the outer columns */
    [l - 10, r].forEach(function (x) { fillRR(g, x, -120, 10, F + 120, 2, '#E8EEF5'); g.fillStyle = '#C9D3DE'; g.fillRect(x + 7, -120, 3, F + 120); });
    /* office furniture that stands behind the people: plants, cabinets, goods, a printer, the water cooler */
    plantPot(g, l + 14, FL2.floor - 6, 0.36); cabinet(g, LIFT.l - 34, FL2.floor - 6, 26, 40); plantPot(g, r - 12, FL2.floor - 6, 0.34);
    boxes(g, 592, FL1.floor - 6, CO_.vn.c); plantPot(g, l + 12, FL1.floor - 6, 0.34);
    fillRR(g, 930, FL1.floor - 50, 16, 44, 3, '#C9D3DE'); fillRR(g, 927, FL1.floor - 54, 22, 10, 3, '#E3E9F1'); fillRR(g, 933, FL1.floor - 46, 10, 3, 1, '#5C6B7A');
    fillRR(g, LIFT.r + 6, FL1.floor - 46, 14, 40, 3, '#E3E9F1'); fillRR(g, LIFT.r + 7, FL1.floor - 64, 12, 20, 5, '#BFE0F7');
    plantPot(g, l + 10, F - 8, 0.42); plantPot(g, LIFT.l - 14, F - 8, 0.4);
  }
  function openDesk(g, x, y, w, floor, top) {
    soft(g, x + w / 2, floor + 1, w * 0.55, 3, 0.2);
    fillRR(g, x + 3, y + 4, 4, floor - y - 4, 2, '#9AA6BC'); fillRR(g, x + w - 7, y + 4, 4, floor - y - 4, 2, '#9AA6BC'); g.fillStyle = 'rgba(30,60,110,.16)'; g.fillRect(x + 7, y + 10, w - 14, 3);
    fillRR(g, x - 3, y, w + 6, 6, 3, top || '#F3F6FA'); g.fillStyle = 'rgba(255,255,255,.5)'; g.fillRect(x - 1, y + 1, w + 2, 1.5);
  }
  function monitor(g, x, y, w, h) { fillRR(g, x + w / 2 - 2, y + h, 4, 9, 1, '#5C6B7A'); fillRR(g, x + w / 2 - 8, y + h + 7, 16, 3, 1.5, '#5C6B7A'); fillRR(g, x, y, w, h, 3, '#2A3142'); }
  var MON = { sg: [548, FL2.floor - 74, 46, 32], ph: [836, FL2.floor - 74, 46, 32], vn: [534, FL1.floor - 74, 46, 32], my: [830, FL1.floor - 74, 46, 32] };
  function paintFront(g, ext) {
    lzFront(g);
    /* the sky-deck board table, open so the board's chairs and legs show; the month-end button on it */
    openDesk(g, 790, DECK - 34, 150, DECK); fillRR(g, BTN.x - 12, BTN.y + 18, 24, 10, 3, '#5C6B7A'); fillE(g, BTN.x, BTN.y + 18, 12, 4, '#3A4458');
    /* desks on each floor, the monitor beside the person */
    openDesk(g, 470, FL2.floor - 36, 150, FL2.floor); monitor(g, MON.sg[0], MON.sg[1], MON.sg[2], MON.sg[3]);
    openDesk(g, 820, FL2.floor - 36, 124, FL2.floor); monitor(g, MON.ph[0], MON.ph[1], MON.ph[2], MON.ph[3]);
    openDesk(g, 466, FL1.floor - 36, 120, FL1.floor); monitor(g, MON.vn[0], MON.vn[1], MON.vn[2], MON.vn[3]);
    openDesk(g, 758, FL1.floor - 36, 140, FL1.floor); monitor(g, MON.my[0], MON.my[1], MON.my[2], MON.my[3]); fillRR(g, 776, FL1.floor - 42, 16, 7, 2, '#3A4458');
    /* the reception desk and the keycard gates in the lobby */
    openDesk(g, 470, F - 50, 140, F, '#E3E9F1'); fillRR(g, 470, F - 50, 140, 14, 3, NAVY); text(g, 'RECEPTION', 540, F - 40, 7.4, 800, '#FFFFFF', 'center'); monitor(g, 548, F - 92, 40, 28);
    for (var i = 0; i < 3; i++) { var gx = GATE.x + 6 + i * 36; soft(g, gx + 10, F + 1, 16, 3, 0.2); fillRR(g, gx, F - 44, 20, 44, 4, '#C9D3DE'); fillRR(g, gx, F - 44, 20, 8, 3, '#E3E9F1'); fillRR(g, gx + 4, F - 34, 12, 8, 2, '#2A3142'); }
    /* the lift doors on every floor (the car runs in the shaft, live) */
    [DECK, FL2.floor, FL1.floor, F].forEach(function (y) { g.strokeStyle = '#C9D3DE'; g.lineWidth = 3; rr(g, LIFT.l + 1, y - 62, LIFT.r - LIFT.l - 2, 62, 3); g.stroke(); });
  }
  function paintFore(g, ext) {
    lzFore(g);
    /* the plaza edge: planters with clipped shrubs, bollards, benches; the row ends above the glance strip (y 702) and clear of
       the title card (x >= 230) and of the floating side tabs */
    function planter(x, w) { soft(g, x + w / 2, 711, w * 0.55, 5, 0.24); fillRR(g, x, 674, w, 36, 6, '#C9D3DE'); fillRR(g, x - 4, 670, w + 8, 9, 4, '#E3E9F1'); g.fillStyle = 'rgba(30,58,110,.08)'; g.fillRect(x + 4, 700, w - 8, 3);
      for (var b = 0; b < w / 20; b++) { fillE(g, x + 11 + b * 20, 666 - (b % 2) * 3, 14, 11, b % 2 ? '#6FB97F' : '#7DC48D'); if (b % 3 === 1) fillE(g, x + 15 + b * 20, 660, 2.6, 2.6, '#FF8FA3'); } }
    planter(272, 150); planter(712, 150); if (ext.r > 1000) planter(1010, 150); if (ext.l < -640) planter(-900, 150);
    [[466, 670], [890, 670], [-724, 670]].forEach(function (b) { var bx = b[0], by = b[1]; soft(g, bx + 40, by + 36, 50, 5, 0.22); fillRR(g, bx, by + 10, 80, 8, 3, '#C99A6B'); fillRR(g, bx, by - 4, 80, 6, 3, '#C99A6B'); fillRR(g, bx + 6, by + 18, 5, 18, 2, '#5C6B7A'); fillRR(g, bx + 69, by + 18, 5, 18, 2, '#5C6B7A');
      fillRR(g, bx + 50, by + 2, 9, 9, 2, '#FFFFFF'); fillRR(g, bx + 50, by + 2, 9, 3, 1, '#C98E55'); fillRR(g, bx + 14, by + 4, 24, 7, 1, '#F3E7D6'); });
    [236, 448, 680, 960].forEach(function (bx) { if (bx < ext.l || bx > ext.r) return; soft(g, bx, 707, 10, 3, 0.25); fillRR(g, bx - 6, 674, 12, 33, 6, '#9AA6BC'); fillRR(g, bx - 6, 681, 12, 4, 2, GOLD); });
  }

  /* ---------------- live: the month-end loop, the lift, the screens ---------------- */
  var TAP = {}, PLANES = [], COINS = [], STAMPS = [];
  function screenLive(g, t, S, M) {
    var hot = S.hot === 'deck', steps = ['Close', 'Mirror', 'SGD', 'Elim.', 'P&L'];
    steps.forEach(function (s, i) { var x = SCR.x + 8 + i * 35.5, on = i <= M.ph; fillRR(g, x, SCR.y + 22, 33, 11, 5.5, on ? (i === M.ph ? GOLD : '#E7F4EC') : '#F2F4F8'); text(g, s, x + 16.5, SCR.y + 30, 5.6, 800, on ? (i === M.ph ? '#3A2A0A' : '#1E9E6A') : '#9AA6BC', 'center'); });
    var grow = M.ph >= 2 ? ease((M.c - 7) / 3) : 0.12, rows = [['Revenue', 0.9, '#2BC48A'], ['Costs', 0.6, '#E5484D'], ['Margin', 0.3, BLUE]];
    rows.forEach(function (r, i) { var y = SCR.y + 42 + i * 14; text(g, r[0], SCR.x + 8, y + 7, 6.4, 700, '#3D4560'); fillRR(g, SCR.x + 52, y, 100, 8, 3, '#F2F4F8'); fillRR(g, SCR.x + 52, y, Math.max(4, 100 * r[1] * grow), 8, 3, r[2]); });
    var ey = SCR.y + 84; text(g, 'Intercompany', SCR.x + 8, ey + 7, 6.2, 700, '#3D4560');
    if (M.ph >= 3) { fillRR(g, SCR.x + 66, ey, 52, 9, 4.5, '#FDECEC'); text(g, 'eliminated', SCR.x + 92, ey + 7, 5.6, 800, '#C2373C', 'center'); g.strokeStyle = '#C2373C'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(SCR.x + 6, ey + 4.5); g.lineTo(SCR.x + 60, ey + 4.5); g.stroke(); }
    else { fillRR(g, SCR.x + 66, ey, 52, 9, 4.5, '#F2F4F8'); text(g, 'pending', SCR.x + 92, ey + 7, 5.6, 800, '#9AA6BC', 'center'); }
    if (M.ph === 4 || hot) { var a = hot ? 1 : clamp((M.c - 12.5) * 2, 0, 1); g.save(); g.globalAlpha = a; fillRR(g, SCR.x + 124, SCR.y + 70, 58, 24, 5, '#E7F4EC'); text(g, 'one set of', SCR.x + 153, SCR.y + 80, 5.8, 800, '#1E9E6A', 'center'); text(g, 'numbers ✓', SCR.x + 153, SCR.y + 89, 5.8, 800, '#1E9E6A', 'center'); g.restore(); }
    fillE(g, SCR.x + SCR.w - 10, SCR.y + 8.5, 2.6, 2.6, (t % 1) < 0.6 ? '#7FF0CF' : '#3FAF8F');
  }
  function monitorsLive(g, t, S, M) {
    ['sg', 'ph', 'vn', 'my'].forEach(function (k2, i) { var m = MON[k2], C = CO_[k2], x = m[0] + 2, y = m[1] + 2, w = m[2] - 4, h = m[3] - 4;
      fillRR(g, x, y, w, h, 2, '#FFFFFF'); fillRR(g, x, y, w, 6, 2, C.c); text(g, C.cur + ' ledger', x + 2, y + 5, 3.8, 800, '#FFFFFF');
      var closed = M.ph >= 1 || (M.ph === 0 && M.c > 0.5 + i * 0.6);
      for (var l = 0; l < 4; l++) { var ww = 10 + hash(l + i * 7 + Math.floor(t * (closed ? 0.3 : 2))) * (w - 16); fillRR(g, x + 2, y + 9 + l * 4.4, ww, 2.4, 1, ['#C9D3E3', '#3167CA', '#C9D3E3', C.c][l]); }
      if (closed) { g.save(); g.translate(x + w - 13, y + h - 7); g.rotate(-0.18); g.strokeStyle = '#1E9E6A'; g.lineWidth = 1; rr(g, -11, -4, 22, 8, 2); g.stroke(); text(g, 'CLOSED', 0, 2.2, 4.6, 800, '#1E9E6A', 'center'); g.restore(); } });
    /* the reception screen: visitors badged in */
    fillRR(g, 550, F - 90, 36, 24, 2, '#FFFFFF'); fillRR(g, 550, F - 90, 36, 5, 2, NAVY); for (var v = 0; v < 3; v++) { fillE(g, 555, F - 80 + v * 6, 1.6, 1.6, v === Math.floor(t) % 3 ? '#2BC48A' : '#C9D3E3'); fillRR(g, 559, F - 81 + v * 6, 22, 2, 1, '#C9D3E3'); }
  }
  function liftLive(g, t, S, M) {
    var y = M.lift, x = LIFT.l + 4, w = LIFT.r - LIFT.l - 8, hot = S.hot === 'lift';
    g.strokeStyle = 'rgba(90,110,140,.5)'; g.lineWidth = 1; g.beginPath(); g.moveTo(LIFT.l + 12, DECK - 60); g.lineTo(LIFT.l + 12, y - 58); g.moveTo(LIFT.r - 12, DECK - 60); g.lineTo(LIFT.r - 12, y - 58); g.stroke();
    fillRR(g, x, y - 58, w, 56, 4, 'rgba(255,255,255,.85)'); g.strokeStyle = hot ? GOLD : '#9FB4CC'; g.lineWidth = 2; rr(g, x, y - 58, w, 56, 4); g.stroke(); fillRR(g, x, y - 6, w, 4, 2, '#C9D3DE');
    /* what rides in the car */
    var cx = x + w / 2, cy = y - 28;
    if (M.ph === 1) { var mir = M.c > 5.2; fillRR(g, cx - 12, cy - 9, 24, 16, 2, mir ? '#E6EEFB' : '#FFF4DE'); g.strokeStyle = mir ? CO_.ph.c : CO_.vn.c; g.lineWidth = 1.2; g.beginPath(); g.moveTo(cx - 12, cy - 9); g.lineTo(cx, cy); g.lineTo(cx + 12, cy - 9); g.stroke(); text(g, mir ? 'BILL' : 'INV', cx, cy + 5, 5, 800, mir ? CO_.ph.c : CO_.vn.c, 'center'); }
    else if (M.ph === 2) { ['PHP', 'VND', 'MYR'].forEach(function (c, i) { var bob = Math.sin(t * 6 + i) * 1.5; fillE(g, cx - 10 + i * 10, cy + 4 - i * 6 + bob, 6, 6, GOLD); fillE(g, cx - 10 + i * 10, cy + 4 - i * 6 + bob, 4.4, 4.4, '#F6DA8C'); }); text(g, '→ SGD', cx, cy - 14, 5.4, 800, GOLD_D, 'center'); }
    /* the floor indicators above each door */
    [[DECK, 'S'], [FL2.floor, '2'], [FL1.floor, '1'], [F, 'G']].forEach(function (d) { var at = Math.abs(M.lift - d[0]) < 4; fillRR(g, LIFT.l + 12, d[0] - 74, 20, 10, 3, at ? GOLD : '#2A3142'); text(g, d[1], LIFT.l + 22, d[0] - 66.6, 6.4, 800, at ? '#3A2A0A' : '#9FC4FF', 'center'); });
    /* the inter-company arrow: from Vietnam's floor to the Philippines' while it rides */
    if (M.ph === 1 || hot) { var p = hot ? (t * 0.5) % 1 : clamp((M.c - 3) / 4, 0, 1); g.save(); g.strokeStyle = 'rgba(233,154,18,.7)'; g.lineWidth = 2; g.setLineDash([4, 4]); g.lineDashOffset = -t * 18;
      g.beginPath(); g.moveTo(VN.x + 16, FL1.floor - 60); g.quadraticCurveTo(LIFT.l + 22, 160, PH.x - 16, FL2.floor - 64); g.stroke(); g.restore(); var u = 1 - p, qx = u * u * (VN.x + 16) + 2 * u * p * (LIFT.l + 22) + p * p * (PH.x - 16), qy = u * u * (FL1.floor - 60) + 2 * u * p * 160 + p * p * (FL2.floor - 64); fillE(g, qx, qy, 3.4, 3.4, '#E99A12'); }
  }
  function fxLive(g, t, S) {
    var rates = ['43.50', '20,200', '3.30'], hot = S.hot === 'fx';
    rates.forEach(function (r, i) { var x = FX.x + 8 + i * 64, flip = (t * 0.6 + i * 0.33) % 1, sq = flip > 0.92 ? Math.abs(Math.cos((flip - 0.92) / 0.08 * Math.PI)) : 1;
      g.save(); g.translate(x + 40, FX.y + 42); g.scale(1, Math.max(0.1, sq)); fillRR(g, -15, -8, 30, 12, 2, hot && Math.floor(t * 2) % 3 === i ? '#2F6FD6' : '#0E1F3D'); text(g, r, 0, 2, 6.6, 800, '#FFD84A', 'center'); g.restore(); });
  }
  function serversLive(g, t, S) {
    for (var i = 0; i < 3; i++) { var x = SRV.x + 6 + i * 26; for (var u = 0; u < 7; u++) { var on = hash(u * 3 + i * 11 + Math.floor(t * (S.hot === 'base' ? 8 : 3 + i))) > 0.4; fillE(g, x + 6, SRV.y + 47 + u * 16, 1.6, 1.6, on ? ['#2BC48A', '#FFD84A', '#7FD3F7'][i] : '#4A5468'); fillE(g, x + 11, SRV.y + 47 + u * 16, 1.6, 1.6, on ? '#2BC48A' : '#4A5468'); } }
    text(g, 'one database', SRV.x + SRV.w / 2, F - 4, 5.6, 800, PUR, 'center');
  }
  function gatesLive(g, t, S) {
    var gt = t - (TAP.gate || -9);
    for (var i = 0; i < 3; i++) { var gx = GATE.x + 6 + i * 36, ok = gt < 2.4 ? (i === 1) : ((Math.floor(t * 0.7) + i) % 3 === 0); fillE(g, gx + 10, F - 30, 2.4, 2.4, ok ? '#2BC48A' : '#E5484D');
      var open = ok && (gt < 2.4 || (t * 0.7) % 1 < 0.5); g.fillStyle = 'rgba(160,200,235,.8)'; if (open) { g.fillRect(gx + 20, F - 34, 4, 22); } else { g.fillRect(gx + 20, F - 30, 16, 4); } }
    if (gt < 2.4) { fillRR(g, GATE.x + 26, F - 74, 58, 16, 8, '#2BC48A'); text(g, 'access ✓', GATE.x + 55, F - 63, 7, 800, '#FFFFFF', 'center'); }
  }
  function annexLive(g, t, S) {
    var cyc = (t * (S.hot === 'rollout' ? 1.6 : 1)) % 12, u = cyc < 7 ? ease(cyc / 7) : 1, y = lerp(94, 204, u), sw = Math.sin(t * 1.3) * (1 - u) * 6, a = cyc > 11 ? (12 - cyc) : 1;
    g.save(); g.globalAlpha = clamp(a, 0, 1);
    g.strokeStyle = '#5C6B7A'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(HOOK, -112); g.lineTo(HOOK + sw, y - 22); g.stroke(); fillRR(g, HOOK - 10, -114, 20, 8, 2, '#5C6B7A');
    g.beginPath(); g.moveTo(HOOK + sw, y - 22); g.lineTo(ANX.l + 18 + sw, y); g.moveTo(HOOK + sw, y - 22); g.lineTo(ANX.r - 18 + sw, y); g.stroke();
    var l = ANX.l + 8 + sw, w = ANX.r - ANX.l - 16; fillRR(g, l, y, w, 82, 3, '#FBFCFE'); fillRR(g, l, y, w, 6, 2, '#D9E1EC'); g.fillStyle = '#E3EEF9'; for (var wx = l + 8; wx < l + w - 12; wx += 24) g.fillRect(wx, y + 16, 16, 36);
    fillRR(g, l + w - 92, y + 60, 86, 14, 4, GOLD); text(g, 'ON THE TEMPLATE', l + w - 49, y + 70, 6, 800, '#3A2A0A', 'center');
    g.restore();
    if (cyc > 7 && cyc < 8.2) { var b = (cyc - 7) / 1.2; g.strokeStyle = 'rgba(226,178,58,' + (1 - b).toFixed(2) + ')'; g.lineWidth = 2; g.beginPath(); g.ellipse((ANX.l + ANX.r) / 2, 290, 60 + b * 40, 6 + b * 6, 0, 0, Math.PI * 2); g.stroke(); }
  }
  function clocksLive(g) {
    var now = Date.now();
    [['sg', TW.l, LIFT.l, FL2.top], ['ph', LIFT.r, TW.r, FL2.top], ['vn', TW.l, LIFT.l, FL1.top], ['my', LIFT.r, TW.r, FL1.top]].forEach(function (c) { var d = new Date(now + CO_[c[0]].off * 3600e3); K.clockHands(g, { x: c[2] - 20, y: c[3] + 12, r: 8 }, d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds()); });
  }
  function extraLive(g, E, t, M) {
    var P = E.P; P.talk = false; P.mood = 'calm'; P.tilt = 0;
    if (E.kind === 'board') { P.hands = [[-60, -206], [60, -206 + (M.ph === 4 ? -Math.abs(Math.sin(t * 8)) * 30 : 0)]]; P.look = lerp(P.look || 0, M.ph >= 3 ? -0.9 : Math.sin(t * 0.4 + P.ph) * 0.6, 0.06); P.mood = M.ph === 4 ? 'happy' : 'calm'; P.tilt = M.ph === 4 ? Math.sin(t * 6) * 0.05 : 0; }
    else if (E.kind === 'type') { var k2 = Math.abs(Math.sin(t * 11 + P.ph)) * 6; P.hands = [[-60, -206 - k2], [60, -206 - (6 - k2)]]; P.look = lerp(P.look || 0, P.x < 700 ? 0.6 : -0.6, 0.05); }
    else if (E.kind === 'print') { var pr = (t + P.ph) % 7 < 2.5; P.hands = pr ? [[-60, -190], [90, -200]] : [[-70, -180], [70, -180]]; P.look = pr ? 0.8 : -0.4; if (pr) { var pu = ((t + P.ph) % 7) / 2.5; fillRR(g, 932, FL1.floor - 58 - pu * 4, 10, 6 + pu * 6, 1, '#FFFFFF'); } }
    else { var ph2 = (t % 9) < 3; P.hands = ph2 ? [[-60, -206], [30, -360]] : [[-60, -206 - Math.abs(Math.sin(t * 10)) * 5], [60, -206]]; P.talk = ph2; P.look = 0.4; }
    K.person(g, P, t);
  }
  function paintLive(g, t, now, S) {
    var M = month(t); S.M = M;
    var e = S.ext;
    /* keep the passers-by clear of the floating side tabs (about 90 set units at the right edge) */
    CREW.forEach(function (w) { if (w.x1o == null) w.x1o = w.x1; w.x1 = Math.min(w.x1o, e.r - 130); });
    lzLive(g, t, S);
    FLAGS.forEach(function (x, i) { flag(g, x + 1.8, 153, 21, 14, ['sg', 'ph', 'vn', 'my'][i], t, i * 0.9); });
    if (e.r > 1040) { var gy = 120 + (Math.sin(t * 0.25) * 0.5 + 0.5) * 210; g.strokeStyle = '#7A869C'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(1120, 30); g.lineTo(1120, gy); g.moveTo(1190, 30); g.lineTo(1190, gy); g.stroke();
      fillRR(g, 1112, gy, 86, 16, 3, '#F2B233'); fillRR(g, 1112, gy + 12, 86, 4, 2, '#B4892A'); var wp = W2.P; wp.x = 1150 + Math.sin(t * 1.2) * 18; wp.y = gy + 10; wp.hands = [[-60, -260], [70 + Math.sin(t * 6) * 30, -330 + Math.cos(t * 6) * 26]]; wp.look = 0.3; K.person(g, wp, t);
      fillRR(g, 1112, gy - 2, 86, 10, 2, 'rgba(242,178,51,.9)'); var sq = handAt(wp, 1); fillRR(g, sq[0] - 2, sq[1] - 10, 4, 12, 1, '#5C6B7A'); fillRR(g, sq[0] - 8, sq[1] - 12, 16, 3, 1, '#2A3550'); }
    annexLive(g, t, S); screenLive(g, t, S, M); fxLive(g, t, S); serversLive(g, t, S); clocksLive(g);
    liftLive(g, t, S, M);
    EXT.forEach(function (E) { extraLive(g, E, t, M); });
    CO.crew(CREW, g, t, S, false);
  }
  function paintFrontLive(g, t, S) {
    var M = S.M || month(t);
    monitorsLive(g, t, S, M); gatesLive(g, t, S); lzBarista(g, t);
    /* the month-end button on the board table */
    var bt = t - CLOSE_T, pressed = bt >= 0 && bt < 0.3; fillE(g, BTN.x, BTN.y + 15 + (pressed ? 2 : 0), 9, 4, pressed ? '#2BC48A' : '#E5484D'); fillE(g, BTN.x - 3, BTN.y + 13 + (pressed ? 2 : 0), 3, 1.4, 'rgba(255,255,255,.6)');
    props(g, t, S, M);
    CO.crew(CREW, g, t, S, true);
  }
  function props(g, t, S, M) {
    /* the consultant's blueprint: rolled, unrolled between the hands, or unfurled big on a tap */
    var a = handAt(TN, 0), b = handAt(TN, 1);
    if (TAP.tn && t - TAP.tn < 2.8 && t - TAP.tn > 0.3) { var u = Math.min(1, (t - TAP.tn - 0.3) * 3), cx = (a[0] + b[0]) / 2, top = Math.min(a[1], b[1]) - 4, w = 120 * u;
      fillRR(g, cx - w / 2, top, w, 74, 2, '#2F6FD6'); g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 0.6; g.beginPath(); for (var gx = cx - w / 2 + 8; gx < cx + w / 2; gx += 8) { g.moveTo(gx, top); g.lineTo(gx, top + 74); } for (var gy = top + 8; gy < top + 74; gy += 8) { g.moveTo(cx - w / 2, gy); g.lineTo(cx + w / 2, gy); } g.stroke();
      if (u > 0.9) { ['PILOT', 'TEMPLATE', 'ROLL-OUT'].forEach(function (s, i) { var bx = cx - 52 + i * 36, h = 18 + i * 14; g.strokeStyle = '#FFFFFF'; g.lineWidth = 1.4; g.strokeRect(bx, top + 62 - h, 26, h); text(g, s, bx + 13, top + 70, 4.8, 800, '#FFFFFF', 'center'); }); }
      fillE(g, cx - w / 2, top + 37, 4, 37, '#5C8DE0'); fillE(g, cx + w / 2, top + 37, 4, 37, '#5C8DE0'); }
    else if (TN.unroll > 0.05) { var cx2 = (a[0] + b[0]) / 2, w2 = Math.abs(b[0] - a[0]) - 6, t2 = Math.min(a[1], b[1]) - 30; fillRR(g, cx2 - w2 / 2, t2, w2, 34 * TN.unroll + 4, 2, '#2F6FD6'); g.strokeStyle = 'rgba(255,255,255,.6)'; g.lineWidth = 0.8; g.strokeRect(cx2 - w2 / 2 + 6, t2 + 5, w2 * 0.3, 20 * TN.unroll); g.strokeRect(cx2 - 4, t2 + 10, w2 * 0.35, 16 * TN.unroll); fillE(g, cx2 - w2 / 2, t2 + 17 * TN.unroll + 2, 4, 17 * TN.unroll + 2, '#5C8DE0'); fillE(g, cx2 + w2 / 2, t2 + 17 * TN.unroll + 2, 4, 17 * TN.unroll + 2, '#5C8DE0'); }
    else { g.save(); g.translate(a[0], a[1]); g.rotate(-0.9); fillRR(g, -5, -34, 10, 60, 5, '#2F6FD6'); fillE(g, 0, -34, 5, 3, '#5C8DE0'); g.restore(); }
    /* the CFO's coffee or the report held high */
    var hc = handAt(CFO, 1);
    if (TAP.cfo && t - TAP.cfo < 2.6) { var hl = handAt(CFO, 0), mx = (hl[0] + hc[0]) / 2, my = Math.min(hl[1], hc[1]) - 4; fillRR(g, mx - 14, my - 18, 28, 20, 2, '#FFFFFF'); fillRR(g, mx - 14, my - 18, 28, 5, 2, PUR); [0, 1, 2].forEach(function (i) { fillRR(g, mx - 10 + i * 8, my - 2 - (i + 1) * 3.6, 5, (i + 1) * 3.6, 1, ['#2BC48A', '#E5484D', BLUE][i]); }); }
    else if (CFO.cup) { fillRR(g, hc[0] - 3, hc[1] - 7, 6, 7, 1.5, '#FFFFFF'); fillRR(g, hc[0] - 3, hc[1] - 7, 6, 2, 1, '#C98E55'); }
    /* Singapore's stamp */
    if (SG.stamp) { var hs = handAt(SG, 1); fillRR(g, hs[0] - 3, hs[1] - 8, 6, 8, 2, '#C9962E'); fillRR(g, hs[0] - 4.5, hs[1] - 1, 9, 3, 1, CO_.sg.c); }
    /* the Philippines' mirrored bill */
    if (PH.bill) { var hp = handAt(PH, 1); fillRR(g, hp[0] - 7, hp[1] - 12, 14, 12, 1.5, '#E6EEFB'); g.fillStyle = CO_.ph.c; g.fillRect(hp[0] - 7, hp[1] - 12, 14, 3); text(g, 'BILL', hp[0], hp[1] - 3, 3.8, 800, CO_.ph.c, 'center'); }
    /* Vietnam's invoice */
    if (VN.inv) { var hv = handAt(VN, 1); fillRR(g, hv[0] - 7, hv[1] - 10, 14, 10, 1.5, '#FFF4DE'); g.strokeStyle = CO_.vn.c; g.lineWidth = 0.8; g.beginPath(); g.moveTo(hv[0] - 7, hv[1] - 10); g.lineTo(hv[0], hv[1] - 5); g.lineTo(hv[0] + 7, hv[1] - 10); g.stroke(); }
    /* Malaysia's calculator */
    var hm = handAt(MY, 0); fillRR(g, hm[0] - 5, hm[1] - 4, 11, 8, 1.5, '#3A4458'); fillRR(g, hm[0] - 3.5, hm[1] - 3, 8, 2.2, 0.8, '#BFE7C9');
    /* paper planes, coins, stamps */
    PLANES = PLANES.filter(function (p) { return t - p.t0 < 1.6; }); PLANES.forEach(function (p) { var u2 = (t - p.t0) / 1.6, x = lerp(p.x, LIFT.l + 22, u2), y = lerp(p.y, FL2.floor - 40, u2) - Math.sin(u2 * Math.PI) * 50; CO.plane(g, x, y, 0.7, -0.4 + u2 * 0.4, '#FFFFFF', CO_.vn.c); });
    COINS = COINS.filter(function (c) { return t - c.t0 < 1.2; }); COINS.forEach(function (c) { var u3 = (t - c.t0) / 1.2, y = c.y - Math.sin(u3 * Math.PI) * 60, sq = Math.abs(Math.cos(u3 * 14)); g.save(); g.translate(c.x, y); g.scale(Math.max(0.15, sq), 1); fillE(g, 0, 0, 6, 6, GOLD); fillE(g, 0, 0, 4.4, 4.4, '#F6DA8C'); g.restore(); if (u3 > 0.7) text(g, 'MYR → SGD', c.x, c.y - 70, 6.4, 800, GOLD_D, 'center'); });
    STAMPS = STAMPS.filter(function (s) { return t - s.t0 < 1.4; }); STAMPS.forEach(function (s) { var u4 = (t - s.t0) / 1.4; g.save(); g.globalAlpha = 1 - u4; g.translate(s.x, s.y - u4 * 20); g.rotate(-0.2); g.strokeStyle = s.c; g.lineWidth = 1.6; rr(g, -26, -8, 52, 16, 3); g.stroke(); text(g, s.txt, 0, 3.2, 7.4, 800, s.c, 'center'); g.restore(); });
  }

  /* ---------------- the left plaza: live (each person has an idle loop and a tap reaction, reached through hit()) ---------------- */
  function cup(g, x, y, rot) { g.save(); g.translate(x, y); g.rotate(rot || 0); fillRR(g, -4, -10, 8, 10, 1.5, '#FFFFFF'); fillRR(g, -4, -10, 8, 3, 1, '#C98E55'); fillRR(g, -4.5, -6.5, 9, 3, 1, NAVY); g.restore(); }
  function lzLive(g, t, S) {
    /* the class screen cycles three slides: the rollout, a checklist, the group on one database */
    var s = PAV.scr, sl = Math.floor(t / 4) % 3, tt = t - (TAP.trn || -99), tap = tt < 3;
    fillRR(g, s[0], s[1], s[2], s[3], 2, '#FFFFFF'); fillRR(g, s[0], s[1], s[2], 8, 2, '#14A38B'); g.fillRect(s[0], s[1] + 5, s[2], 3); text(g, 'Go-live training', s[0] + 3, s[1] + 6.2, 4.6, 800, '#FFFFFF');
    if (sl === 0) ['PILOT', 'TEMPLATE', 'ROLL-OUT'].forEach(function (n, i) { var bx = s[0] + 6 + i * 21, h = 8 + i * 8; fillRR(g, bx, s[1] + 37 - h, 15, h, 1.5, [BLUE, GOLD, '#14A38B'][i]); text(g, n, bx + 7.5, s[1] + 42, 3.2, 800, INK, 'center'); });
    else if (sl === 1) for (var l = 0; l < 4; l++) { var ok = l <= Math.floor(t * 1.2) % 5; fillE(g, s[0] + 7, s[1] + 15 + l * 7, 1.8, 1.8, ok ? '#2BC48A' : '#C9D3E3'); fillRR(g, s[0] + 11, s[1] + 14 + l * 7, 28 + hash(l) * 24, 2.4, 1, ok ? '#9FD8BE' : '#C9D3E3'); }
    else { ['sg', 'ph', 'vn', 'my'].forEach(function (k2, i) { fillRR(g, s[0] + 5 + i * 15.5, s[1] + 13, 13, 13, 2, CO_[k2].c); text(g, CO_[k2].code, s[0] + 11.5 + i * 15.5, s[1] + 21.6, 4.4, 800, '#FFFFFF', 'center'); }); fillRR(g, s[0] + 5, s[1] + 31, 59, 8, 4, '#E7F4EC'); text(g, 'one database ✓', s[0] + 34.5, s[1] + 36.8, 4.2, 800, '#1E9E6A', 'center'); }
    var d = new Date(Date.now() + 8 * 3600e3); K.clockHands(g, { x: PAV.r - 18, y: PAV.top + 22, r: 8 }, d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds());
    /* the trainer: points at the slide, turns to the class, steps across; tap: a thumbs-up and a hop as every hand goes up */
    var P = TRN, c = (t + 1) % 8; P.tilt = 0; P.hop = 0; P.talk = true; P.mood = 'calm';
    if (tap) { P.hands = [[-70, -200], [70, -430]]; P.mood = 'happy'; P.look = 0.8; P.hop = tt < 0.5 ? Math.sin(tt / 0.5 * Math.PI) * 12 : 0; }
    else if (c < 3.5) { P.hands = [[-160, -330 + Math.sin(t * 3) * 10], [60, -200]]; P.look = -0.9; }
    else if (c < 6) { P.hands = [[-110, -240], [110, -240 + Math.sin(t * 4) * 14]]; P.look = 0.7; P.mood = 'happy'; }
    else { P.hands = [[-70, -200], [60, -250]]; P.look = 0.5; P.talk = false; }
    P.x = -336 + (c > 6 && !tap ? Math.sin((c - 6) / 2 * Math.PI) * 7 : 0); K.person(g, P, t);
    if (c < 3.5 && !tap) fillE(g, s[0] + 26 + Math.sin(t * 1.3) * 22, s[1] + 25 + Math.cos(t * 1.7) * 8, 1.8, 1.8, '#E5484D');
    /* the class: typing on their laptops, a question now and then; tap: hands up one after another */
    TRS.forEach(function (Q, i) { var up = tap ? tt > 0.3 + i * 0.25 && tt < 2.7 : i !== 1 && ((t + i * 3.1) % 11) < 1.6; Q.mood = up ? 'happy' : 'calm'; Q.talk = false; Q.tilt = 0; Q.hop = 0;
      if (up) Q.hands = [[-60, -206], [40, -440]]; else { var k2 = Math.abs(Math.sin(t * 9 + i * 2)) * 5; Q.hands = [[-60, -206 - k2], [60, -206 - (5 - k2)]]; }
      Q.look = lerp(Q.look || 0, up ? -0.4 : ((t * 0.3 + i) % 4 < 2 ? -0.9 : 0.4), 0.06); K.person(g, Q, t); });
    /* a colleague crossing the sky bridge */
    var bu = (t * 0.07) % 2, bxp = bu < 1 ? lerp(TALL.r + 8, -384, bu) : lerp(-384, TALL.r + 8, bu - 1); W5.x = bxp; W5.y = 90; W5.sx = bu < 1 ? 1 : -1; W5.look = 0.8; W5.hop = Math.abs(Math.sin(t * 8)) * 6; W5.hands = [[-70 + Math.sin(t * 8) * 30, -150], [70 - Math.sin(t * 8) * 30, -150]]; K.person(g, W5, t);
    /* the window cleaner's gondola on the far tower; tap: it bounces and he waves both hands */
    var wt = t - (TAP.wc || -99), gy = 30 + (Math.sin(t * 0.21 + 1.3) * 0.5 + 0.5) * 300 - (wt < 1.5 ? Math.abs(Math.sin(wt * 6)) * 10 * (1.5 - wt) : 0), gl = TALL.l + 6, gw = 76;
    g.strokeStyle = '#7A869C'; g.lineWidth = 1.1; g.beginPath(); g.moveTo(gl + 8, TALL.top - 14); g.lineTo(gl + 8, gy); g.moveTo(gl + gw - 6, TALL.top - 14); g.lineTo(gl + gw - 6, gy); g.stroke();
    fillRR(g, gl, gy, gw, 15, 3, '#14A38B'); fillRR(g, gl, gy + 11, gw, 4, 2, '#0E7A68');
    var wp = W3.P; wp.x = gl + gw / 2 + Math.sin(t * 1.1) * 14; wp.y = gy + 10; wp.look = -0.3; wp.mood = wt < 1.5 ? 'happy' : 'calm';
    wp.hands = wt < 1.5 ? [[-110, -420 + Math.sin(t * 14) * 20], [110, -420 - Math.sin(t * 14) * 20]] : [[-60, -260], [-80 + Math.sin(t * 6) * 30, -340 + Math.cos(t * 6) * 26]]; K.person(g, wp, t);
    fillRR(g, gl, gy - 2, gw, 10, 2, 'rgba(20,163,139,.92)'); if (wt >= 1.5) { var sq = handAt(wp, 0); fillRR(g, sq[0] - 2, sq[1] - 10, 4, 12, 1, '#5C6B7A'); fillRR(g, sq[0] - 8, sq[1] - 12, 16, 3, 1, '#2A3550'); }
  }
  function lzBarista(g, t) {
    /* pulls a shot, hands a cup over the counter, wipes down; tap: tosses a cup and catches it */
    var P = BAR, bt = t - (TAP.bar || -99), c = t % 7, mx = CART.x - 31, my = CART.y - 106; P.tilt = 0; P.hop = 0; P.talk = false; P.mood = 'calm';
    if (bt < 2.2) { P.hands = [[-60, -250], [70, -320]]; P.mood = 'happy'; P.look = 0.2; P.talk = bt > 1.4; }
    else if (c < 3) { P.hands = [[-150, -250], [-70, -230]]; P.look = -0.8; }
    else if (c < 5) { P.hands = [[-60, -210], [100, -300]]; P.look = 0.6; P.mood = 'happy'; P.talk = true; }
    else { P.hands = [[-60, -212], [30 + Math.sin(t * 6) * 40, -214]]; P.look = 0.3; }
    K.person(g, P, t);
    for (var i = 0; i < 3; i++) { var u = (t * 0.6 + i / 3) % 1; g.globalAlpha = 0.55 * (1 - u); fillE(g, mx + Math.sin(t * 2 + i) * 4, my - u * 40, 4 + u * 6, 4 + u * 6, '#FFFFFF'); } g.globalAlpha = 1;
    if (bt < 2.2) { var u3 = bt / 2.2, h = handAt(P, 1); cup(g, h[0], h[1] - Math.sin(u3 * Math.PI) * 70, u3 * Math.PI * 2); }
    else if (c >= 3 && c < 5) { var h2 = handAt(P, 1); cup(g, h2[0], h2[1], 0); }
  }
  function lzFountain(g, t) {
    var fx = FNT.x, fy = FNT.y, ft = t - (TAP.fnt || -99), boost = ft < 2.4 ? 1 + 0.8 * Math.sin(Math.min(1, ft / 2.4) * Math.PI) : 1;
    g.lineCap = 'round'; g.strokeStyle = 'rgba(165,212,245,.95)'; g.lineWidth = 2;
    for (var j = 0; j < 6; j++) { var a = (j / 5 - 0.5) * 2, h = (24 + Math.sin(t * 3 + j) * 3) * boost; g.beginPath(); g.moveTo(fx, fy - 112); g.quadraticCurveTo(fx + a * 16, fy - 112 - h, fx + a * 34, fy - 76); g.stroke(); }
    g.strokeStyle = 'rgba(190,226,248,.8)'; g.lineWidth = 1.6; for (var k = -3; k <= 3; k++) { if (!k) continue; var x0 = fx + k * 11, x1 = fx + k * 21 + Math.sin(t * 4 + k) * 1.5; g.beginPath(); g.moveTo(x0, fy - 74); g.quadraticCurveTo(x0 + k * 5, fy - 62, x1, fy - 16); g.stroke(); }
    for (var r = 0; r < 3; r++) { var u = (t * 0.5 + r / 3) % 1; g.strokeStyle = 'rgba(255,255,255,' + (0.65 * (1 - u)).toFixed(2) + ')'; g.lineWidth = 1.2; g.beginPath(); g.ellipse(fx, fy - 12, 30 + u * 64, 5 + u * 10, 0, 0, Math.PI * 2); g.stroke(); }
    fillE(g, fx, fy - 115, 3.6, 3.6 + Math.sin(t * 8) * 1.2, '#DFF2FD');
    if (ft < 2.4) for (var dd = 0; dd < 8; dd++) { var a2 = dd / 8 * Math.PI * 2, rr2 = ft * 60; g.globalAlpha = Math.max(0, 1 - ft / 2.4); fillE(g, fx + Math.cos(a2) * rr2, fy - 112 - Math.sin(ft * 2.6) * 50 + Math.sin(a2) * rr2 * 0.3 + ft * ft * 30, 2.4, 2.4, '#BFE3F9'); } g.globalAlpha = 1;
  }
  function lzVisitor(g, t) {
    /* reads the group P&L on her tablet, looks up at the tower now and then; tap: holds the tablet up to show it */
    var P = VIS, vt = t - (TAP.vis || -99); P.tilt = 0; P.hop = 0; P.talk = false;
    if (vt < 2.4) { P.hands = [[-50, -400], [50, -400]]; P.mood = vt < 0.6 ? 'wow' : 'happy'; P.look = 0; P.talk = vt > 0.6; }
    else if (t % 10 < 7) { P.hands = [[-40, -232], [40, -232 + Math.sin(t * 2) * 3]]; P.look = lerp(P.look || 0, 0.15, 0.05); P.mood = 'calm'; }
    else { P.hands = [[-40, -236], [40, -236]]; P.look = lerp(P.look || 0, 0.9, 0.06); P.mood = 'happy'; }
    K.person(g, P, t);
  }
  function lzPair(g, t) {
    /* two TechNext consultants on a coffee break: one talks with her hands while the other laughs and sips, then they swap;
       tap: a high-five and confetti */
    var pt = t - (TAP.pair || -99), A = TA, B = TB; [A, B].forEach(function (P) { P.tilt = 0; P.hop = 0; P.talk = false; P.mood = 'calm'; });
    if (pt < 2.4) { var u = pt / 2.4, up = u > 0.15 && u < 0.7; A.hands = up ? [[-70, -180], [130, -440]] : [[-70, -180], [60, -230]]; B.hands = up ? [[-130, -440], [70, -180]] : [[-60, -230], [70, -180]];
      A.mood = B.mood = 'happy'; A.hop = B.hop = up ? Math.abs(Math.sin(u * Math.PI * 2)) * 12 : 0; A.look = 0.9; B.look = -0.9; A.talk = B.talk = !up;
      if (!TAP.pairB && u > 0.3) { TAP.pairB = 1; CR.burst('conf', (A.x + B.x) / 2, A.y - 230, t); } }
    else { TAP.pairB = 0; var turn = Math.floor(t / 4) % 2, c = t % 4, sipA = !turn && c > 3.1, sipB = turn && c > 3.1, gA = Math.abs(Math.sin(t * 3)), gB = Math.abs(Math.sin(t * 2.6));
      A.talk = turn === 0 && !sipA; B.talk = turn === 1 && !sipB; A.look = 0.8; B.look = -0.8;
      A.hands = [[-70 - (A.talk ? gA * 50 : 0), -180 - (A.talk ? gA * 90 : 0)], sipA ? [16, -350] : [60, -230]];
      B.hands = [sipB ? [-16, -350] : [-60, -230], [70 + (B.talk ? gB * 40 : 0), -180 - (B.talk ? gB * 100 : 0)]];
      if (turn === 1) { A.mood = 'happy'; A.tilt = Math.sin(t * 7) * 0.03; } else { B.mood = 'happy'; B.tilt = Math.sin(t * 7) * 0.03; } }
    K.person(g, A, t); K.person(g, B, t);
    if (pt >= 2.4) { var ha = handAt(A, 1), hb = handAt(B, 0); cup(g, ha[0], ha[1], 0); cup(g, hb[0], hb[1], 0); }
  }
  function lzHit(x, y, t) {
    var g3 = 30 + (Math.sin(t * 0.21 + 1.3) * 0.5 + 0.5) * 300;
    if (x > -170 && x < 0 && y > 400 && y < 672) { TAP.pair = t; return { say: 'Coffee break, then the next country: **pilot one entity, template the rest**.', near: [-80, 300], pose: 'clap', who: 'TechNext consultants' }; }
    if (x > -580 && x < -420 && y > 420 && y < 660) { TAP.vis = t; return { say: 'The **group P&L on my tablet**, consolidated in SGD. No spreadsheet to wait for.', near: [-420, 330], pose: 'love', who: 'Client visitor' }; }
    if (x > 18 && x < 132 && y > 380 && y < 614) { TAP.bar = t; return { say: 'Two kopi for the Vietnam team, one for the board. **Every entity**, one counter.', near: [40, 300], pose: 'wow', who: 'The kopi cart' }; }
    if (x > FNT.x - 120 && x < FNT.x + 120 && y > 480 && y < 630) { TAP.fnt = t; return { say: 'The plaza fountain: one source, and **every company** draws from it. That\'s one database.', near: [-300, 320], pose: 'love', who: 'The fountain' }; }
    if (x > PAV.l && x < PAV.r && y > PAV.top - 40 && y < F) { TAP.trn = t; return { say: 'Go-live training: each country\'s team is **trained locally**, on its own company.', near: [-300, 200], pose: 'point-left', who: 'TechNext trainer' }; }
    if (x > TALL.l && x < TALL.r && y > g3 - 50 && y < g3 + 20) { TAP.wc = t; return { say: 'Clear glass on every floor: the board sees **each company** at a glance.', near: [-430, g3 - 40], pose: 'wow', who: 'Window cleaner' }; }
    if (x > PYL.x && x < PYL.x + PYL.w && y > PYL.top && y < F) { CR.burst('star', PYL.x + PYL.w / 2, PYL.top - 10, t); return { say: 'Signposts to every floor: **each company keeps its own** books, users and rules.', near: [-150, 260], pose: 'point-left', who: 'Group HQ sign' }; }
    return null;
  }

  /* ---------------- the cast: an idle loop and a tap choreography each ---------------- */
  function tapped(id, st, t) { if (st.wave && st.wave !== st._my) { st._my = st.wave; TAP[id] = t; return true; } return false; }
  function lookAt(P, st, t, S, base) { P.look = lerp(P.look, t < st.until ? clamp((S.nexi.x - P.x) / 160, -1, 1) : base, 0.08); }
  var castTN = { id: 'tn', behind: true, keys: ['rollout'], P: TN, act: function (P, t, S) {
    var st = S.cast.tn; if (tapped('tn', st, t)) CR.burst('star', P.x, P.y - 260, t);
    P.tilt = 0; P.hop = 0; P.unroll = 0;
    if (TAP.tn && t - TAP.tn < 2.8) { var u = (t - TAP.tn) / 2.8; P.mood = 'happy'; P.talk = true; P.hands = [[-150, -330], [150, -330]]; P.hop = u < 0.25 ? Math.sin(u / 0.25 * Math.PI) * 16 : 0; P.look = 0.2; return; }
    var c = (t + 2) % 12, busy = S.hot === 'rollout';
    if (c < 5 || busy) { var o = c < 1 ? c : c > 4 ? 5 - c : 1; P.unroll = busy ? 1 : clamp(o, 0, 1); P.hands = [[-70 - P.unroll * 50, -230], [70 + P.unroll * 50, -230]]; P.mood = 'calm'; lookAt(P, st, t, S, 0.1); P.tilt = 0.06; }
    else if (c < 8) { P.hands = [[-70, -220], [60, -440]]; P.mood = 'happy'; lookAt(P, st, t, S, -0.6); P.tilt = -0.08; }
    else { P.hands = [[-70, -220], [70, -200]]; P.mood = 'calm'; lookAt(P, st, t, S, 0.8); }
    P.talk = t < st.until || busy;
  } };
  var castCFO = { id: 'cfo', behind: true, keys: ['deck'], P: CFO, act: function (P, t, S) {
    var st = S.cast.cfo, M = S.M || month(t); if (tapped('cfo', st, t)) CR.burst('conf', P.x, P.y - 130, t);
    P.tilt = 0; P.hop = 0; P.cup = false; P.sx = 1;
    if (TAP.cfo && t - TAP.cfo < 2.6) { var u = (t - TAP.cfo) / 2.6; P.mood = 'happy'; P.talk = true; P.hands = [[-50, -400], [50, -400]]; P.sx = u < 0.4 ? Math.cos(u / 0.4 * Math.PI * 2) : 1; P.hop = Math.sin(Math.min(1, u * 2) * Math.PI) * 14; return; }
    if (M.ph === 4) { P.hands = [[-70, -200], [-150, -330]]; P.mood = 'happy'; P.look = -0.9; P.tilt = Math.sin(t * 5) * 0.04; }
    else if ((t % 8) > 5.6) { P.cup = true; var su = Math.sin(((t % 8) - 5.6) / 2.4 * Math.PI); P.hands = [[-70, -200], [40 - su * 20, -210 - su * 120]]; P.tilt = -su * 0.08; P.mood = 'calm'; }
    else { P.hands = [[-70, -200], [70, -190]]; P.mood = 'calm'; }
    P.talk = t < st.until || S.hot === 'deck'; if (P.talk) P.mood = 'happy';
    if (M.ph !== 4) lookAt(P, st, t, S, -0.7);
  } };
  var castSG = { id: 'sg', behind: true, keys: ['books'], P: SG, act: function (P, t, S) {
    var st = S.cast.sg, M = S.M || month(t); if (tapped('sg', st, t)) STAMPS.push({ x: P.x, y: P.y - 120, t0: t + 0.9, txt: 'SGD ✓', c: CO_.sg.c });
    P.tilt = 0; P.hop = 0; P.sx = 1; P.stamp = false;
    if (TAP.sg && t - TAP.sg < 2.2) { var u = (t - TAP.sg) / 2.2; P.mood = 'happy'; P.talk = true; P.sx = u < 0.5 ? Math.cos(u / 0.5 * Math.PI * 2) : 1; P.stamp = u > 0.5; P.hands = u > 0.5 ? [[-60, -206], [70, -260 + Math.max(0, Math.sin((u - 0.5) * 18)) * 50]] : [[-60, -206], [60, -206]]; return; }
    var sc = M.ph === 0 && M.c > 0.2 && M.c < 1.2;
    if (sc) { P.stamp = true; var d = Math.sin((M.c - 0.2) / 1 * Math.PI); P.hands = [[-60, -206], [80, -206 - d * 70]]; P.mood = 'happy'; if (d > 0.98 && !TAP.sgS) { TAP.sgS = true; STAMPS.push({ x: MON.sg[0] + 23, y: MON.sg[1] - 8, t0: t, txt: 'CLOSED', c: '#1E9E6A' }); } }
    else { TAP.sgS = false; var k2 = Math.abs(Math.sin(t * 10)) * 6; P.hands = [[-60, -206 - k2], [60, -206 - (6 - k2)]]; P.mood = 'calm'; }
    P.talk = t < st.until || S.hot === 'books'; if (P.talk) P.mood = 'happy';
    lookAt(P, st, t, S, 0.5);
  } };
  var castPH = { id: 'ph', behind: true, keys: ['lift'], P: PH, act: function (P, t, S) {
    var st = S.cast.ph, M = S.M || month(t); if (tapped('ph', st, t)) CR.burst('star', P.x, P.y - 130, t);
    P.tilt = 0; P.hop = 0; P.bill = false;
    if (TAP.ph && t - TAP.ph < 2.4) { var u = (t - TAP.ph) / 2.4; P.mood = 'happy'; P.talk = true; P.bill = true; P.hands = [[-90, -380], [60, -440]]; P.hop = Math.abs(Math.sin(u * Math.PI * 3)) * 14; P.x = 762; return; }
    var recv = M.ph === 1 && M.c > 5 && M.c < 7, after = M.ph >= 2 && M.c < 9;
    var tx = recv ? 742 : after ? 800 : 762; P.x = lerp(P.x, tx, K.ease(0.04)); var walking = Math.abs(P.x - tx) > 1.5; P.hop = walking ? Math.abs(Math.sin(t * 9)) * 4 : 0;
    if (recv) { P.hands = [[-150, -240], [-120, -260]]; P.look = -0.9; P.bill = M.c > 5.6; P.mood = 'happy'; }
    else if (after) { P.bill = true; P.hands = [[-70, -180], [60, -230]]; P.look = 0.7; P.mood = 'calm'; }
    else { P.hands = [[-70, -180], [70, -180 + Math.sin(t * 2) * 4]]; lookAt(P, st, t, S, -0.3); P.mood = 'calm'; }
    P.talk = t < st.until || S.hot === 'lift'; if (P.talk) P.mood = 'happy';
  } };
  var castVN = { id: 'vn', behind: true, keys: ['lift'], P: VN, act: function (P, t, S) {
    var st = S.cast.vn, M = S.M || month(t); if (tapped('vn', st, t)) PLANES.push({ x: P.x + 10, y: P.y - 110, t0: t + 0.4 });
    P.tilt = 0; P.hop = 0; P.inv = false;
    if (TAP.vn && t - TAP.vn < 1.8) { var u = (t - TAP.vn) / 1.8; P.mood = 'happy'; P.talk = true; P.hands = u < 0.25 ? [[-70, -180], [-20, -330]] : [[-70, -180], [140, -420]]; P.hop = u > 0.25 && u < 0.6 ? 8 : 0; P.look = 0.8; return; }
    var send = M.ph === 1 && M.c < 4.2;
    if (send) { P.inv = M.c < 3.9; P.hands = [[-70, -180], [140, -250]]; P.look = 0.9; P.mood = 'happy'; P.x = lerp(P.x, 650, 0.05); }
    else { P.x = lerp(P.x, 630, 0.03); var chk = (t % 10) < 5; P.hands = chk ? [[-60, -200], [-30, -240 + Math.sin(t * 6) * 6]] : [[-70, -180], [70, -180]]; P.look = chk ? -0.8 : 0.3; P.mood = 'calm'; if (!chk) lookAt(P, st, t, S, 0.3); }
    P.talk = t < st.until || S.hot === 'lift'; if (P.talk) P.mood = 'happy';
  } };
  var castMY = { id: 'my', behind: true, keys: ['fx'], P: MY, act: function (P, t, S) {
    var st = S.cast.my, M = S.M || month(t); if (tapped('my', st, t)) COINS.push({ x: P.x + 30, y: P.y - 90, t0: t + 0.3 });
    P.tilt = 0; P.hop = 0;
    if (TAP.my && t - TAP.my < 2) { var u = (t - TAP.my) / 2; P.mood = u < 0.5 ? 'wow' : 'happy'; P.talk = true; P.hands = [[-60, -206], [80, -300 - Math.sin(Math.min(1, u * 3) * Math.PI) * 60]]; P.look = 0.6; return; }
    var stretch = (t % 14) > 12.4;
    if (stretch) { P.hands = [[-90, -420], [90, -420]]; P.mood = 'happy'; P.tilt = Math.sin(t * 3) * 0.06; }
    else { var k2 = Math.abs(Math.sin(t * 9)) * 5; P.hands = [[-60, -206], [30, -214 - k2]]; P.mood = M.ph === 2 ? 'happy' : 'calm'; }
    P.talk = t < st.until || S.hot === 'fx'; if (P.talk) P.mood = 'happy';
    lookAt(P, st, t, S, stretch ? 0 : -0.4);
  } };

  window.IXW.worlds['sol-enterprise'] = {
    calmView: [170,-130,800,640], /* CALM: the framed part of the set */
    pan: [-280, 1240],
    paintBg: paintBg, windowBehind: true, paintFrame: paintFrame, paintBack: paintBack, paintFront: paintFront, paintFore: paintFore,
    paintWindow: paintWindow, paintLive: paintLive, paintFrontLive: paintFrontLive,
    paintForeLive: function (g, t, S) {
      var lz = true; lzFountain(g, t);
      [[300, 712], [592, 716], [628, 708], [862, 712], [-180, 646], [-146, 652], [-812, 712]].forEach(function (p, i) { if (p[0] < S.ext.l) return; var pk = Math.max(0, Math.sin(t * 5 + i * 1.7)) > 0.7, hop = Math.abs(Math.sin(t * 0.9 + i)) > 0.97 ? 3 : 0, x = p[0] + Math.sin(t * 0.3 + i) * 10, d = Math.cos(t * 0.3 + i) > 0 ? 1 : -1;
        soft(g, x, p[1] + 1, 9, 2, 0.2); fillE(g, x, p[1] - 6 - hop, 9, 6, '#9AA6BC'); fillE(g, x - 2 * d, p[1] - 8 - hop, 6, 3.4, '#B8C4D3'); fillE(g, x + 8 * d, p[1] - (pk ? 6 : 12) - hop, 4, 4, '#7A869C'); fillE(g, x + 9.4 * d, p[1] - (pk ? 6.6 : 12.6) - hop, 0.9, 0.9, INK); g.fillStyle = '#E9A86A'; g.fillRect(x + (d > 0 ? 11 : -13), p[1] - (pk ? 6 : 12) - hop, 2, 1.4); });
      K.zfore(g, t, S, lz ? [[CAFE.y, function () { lzVisitor(g, t); }], [664, function () { lzPair(g, t); }]] : [], function () { CO.crew(CREW, g, t, S, 'fore'); }); CR.draw(g, t); },
    moteCol: 'rgba(255,255,255,.75)',
    glow: {
      deck: function (g) { rr(g, SCR.x - 14, SCR.y - 14, SCR.w + 28, SCR.h + 28, 12); },
      books: function (g) { g.beginPath(); [[TW.l, FL2.top, LIFT.l - TW.l, FL2.floor - FL2.top], [LIFT.r, FL2.top, TW.r - LIFT.r, FL2.floor - FL2.top], [TW.l, FL1.top, LIFT.l - TW.l, FL1.floor - FL1.top], [LIFT.r, FL1.top, TW.r - LIFT.r, FL1.floor - FL1.top], [DIR.x - 4, DIR.y - 4, DIR.w + 8, DIR.h + 8]].forEach(function (b) { if (g.roundRect) g.roundRect(b[0] + 3, b[1] + 3, b[2] - 6, b[3] - 6, 8); else g.rect(b[0], b[1], b[2], b[3]); }); },
      lift: function (g) { rr(g, LIFT.l - 6, DECK - 66, LIFT.r - LIFT.l + 12, F - DECK + 66, 10); },
      fx: function (g) { rr(g, FX.x - 10, FX.y - 10, FX.w + 20, FX.h + 20, 10); },
      local: function (g) { rr(g, FLAGS[0] - 14, 138, FLAGS[3] - FLAGS[0] + 50, 44, 10); },
      rollout: function (g) { rr(g, ANX.l - 14, 80, ANX.r - ANX.l + 28, 220, 12); },
      base: function (g) { rr(g, SRV.x - 8, SRV.y - 8, SRV.w + 16, F - SRV.y + 12, 10); },
      close: function (g) { g.beginPath(); g.arc(BTN.x, BTN.y + 15, 16, 0, Math.PI * 2); },
      gate: function (g) { rr(g, GATE.x - 4, F - 52, GATE.w + 8, 56, 8); }
    },
    backGlow: ['deck', 'books', 'lift', 'fx', 'local', 'rollout', 'base'],
    cast: [castTN, castCFO, castSG, castPH, castVN, castMY],
    toy: function (name, S, t) {
      if (name === 'close') { CLOSE_T = t; CR.burst('conf', SCR.x + SCR.w / 2, SCR.y + 20, t + 2.4); }
      if (name === 'gate') { TAP.gate = t; CR.burst('spark', GATE.x + GATE.w / 2, F - 60, t); }
    },
    hit: function (x, y, S, t, onBtn) {
      var w = CR.hitWalker(x, y, t); if (w) return w; if (onBtn) return null;
      var lzh = lzHit(x, y, t); if (lzh) return lzh;
      if (y > 418 && y < 466 && (x < ANX.l - 20 || x > TW.r + 60 || (x > ANX.r + 120 && x < TW.l - 20))) return { say: 'Couriers in and out: when one company sells to another, Odoo posts the **matching bill** on the other side.', near: [clamp(x, 260, 860), 300], pose: 'wow', who: 'The boulevard' };
      if (y < -120 && y > -260 && (x < TW.l - 20 || x > TW.r + 20)) return { say: 'Flying in from another country? Each entity keeps its **own localisation**, and the group still sees one set of numbers.', near: [clamp(x, 260, 860), -40], pose: 'wow', who: 'The sky' };
      return null;
    },
    onStop: function (key, S, t) { if (key === 'deck') M0 = t - 12.5; if (key === 'lift') M0 = t - 3; if (key === 'books') M0 = t; if (key === 'fx') M0 = t - 7; if (key === 'rollout') CR.burst('star', (ANX.l + ANX.r) / 2, 200, t + 0.5); }
  };
})(window.IXW && window.IXW.kit, window.CR, window.CO);
