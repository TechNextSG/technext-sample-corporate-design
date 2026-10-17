/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: sol-erp (/solutions/odoo-erp) — "The ERP Orchestra": an Odoo ERP implementation told as a bright daytime rehearsal
   hall. One score = one database: every Odoo app is a section reading the same full score (CRM, Sales, Inventory, Purchase,
   Accounting) and a playhead carries one record from quote to cash across the staves (S00128 → WH/OUT/0042 → INV/2026/0107).
   TechNext conducts from the podium. The ERP family hangs round the hall: CRM Development is the brass fanfare on the balcony,
   Enterprise Solution the tour poster (several companies on one Odoo), data migration the music library, the delivery
   phases the rehearsal-plan chalkboard, go-live the opening-night marquee.
   The cast: the TechNext conductor beats 4/4 and cues each section as its staff plays (tap: throws the baton, catches it,
   bows); the Sales violinist bows faster on her bar and turns pages (tap: a half-standing solo, S00128 confirmed); the
   Inventory cellist plays long bows and plucks (tap: spins the cello on its endpin, WH/OUT ticked); the Accounting
   timpanist counts rests, tunes and rolls Dr and Cr (tap: the double hit, the heads flash Dr = Cr); the CRM trumpeter
   polishes her bell and plays the fanfare (tap: a won-deal pennant unfurls); the TechNext librarian shelves crates and ticks
   them off (tap: fans the sheet music, stamps RECONCILED). Strike the gong for a tutti; tap the front row for applause. */
(function (K, CR, CO) {
  'use strict';
  if (!K || !CR || !CO) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed, limb = K.limb;
  function tone(c, k) { return K.tone(c, k == null ? 0.2 : k); }
  var F = 470, INK = '#1B1F3B', BLUE = '#3167CA', PLUM = '#714B67', PLUM_D = '#55354D', PLUM_L = '#A27A96', GOLD = '#E2B23A', GOLD_D = '#B4892A', GOLD_L = '#F6DA8C',
    WOOD = '#D9A066', WOOD_D = '#B47A43', WOOD_L = '#EDC690', IVORY = '#FFFCF3', CHALK = '#2F5A4B', GREY_ID = '#9AA6BC';
  var APPS = [['CRM', '#E0456B'], ['Sales', '#F08A24'], ['Inventory', '#2E9BD6'], ['Purchase', '#7B5CD6'], ['Accounting', '#1FA463']];
  var SC = { x: 335, y: -150, w: 430, h: 136 }, MX0 = SC.x + 98, MX1 = SC.x + SC.w - 12, BAR = (MX1 - MX0) / 5;
  var PL = { x: 800, y: -100, w: 186, h: 104 }, TOUR = { x: 160, y: -150, w: 150, h: 120 }, LIB = { x: 158, y: 14, w: 154 };
  var BAL = { x: 828, w: 166, top: 16, rail: 122, floor: 172 }, MQ = { x: 904, y: 200, w: 92, h: 88 }, GONG = { x: 772, y: 252, r: 26 };
  var T2 = 175, T1 = 292, WALL_B = 160, WINS = [-1160, -920, -690, -440, 1125, 1365];
  var POD = { x: 520, w: 96, top: 436 }, ST_S = 434, ST_I = 622, DRUMS = [812, 898], DRUM_Y = 396, DRUM_R = 42;
  function setU(g, sx, sy, k) { g.translate(sx, sy); g.scale(k, k); }
  function extOf(W, H, k, sx, sy) { return { l: -(sx + 24) / k, r: (W - sx) / k, t: -(sy + 24) / k, b: (H - sy) / k }; }
  function arch(g, x, y, w, h) { var r = w / 2; g.moveTo(x, y + h); g.lineTo(x, y + r); g.arc(x + r, y + r, r, Math.PI, 0); g.lineTo(x + w, y + h); g.closePath(); }
  function staffY(i) { return SC.y + 28 + i * 21.2; }
  function noteGlyph(g, x, y, sz, col, two) { /* a quaver (or two beamed) */
    g.fillStyle = col; K.ell(g, x, y, sz * 0.62, sz * 0.46, -0.35); g.fill(); g.fillRect(x + sz * 0.48, y - sz * 2.1, sz * 0.18, sz * 2.1);
    if (two) { K.ell(g, x + sz * 1.3, y - sz * 0.25, sz * 0.62, sz * 0.46, -0.35); g.fill(); g.fillRect(x + sz * 1.78, y - sz * 2.35, sz * 0.18, sz * 2.1); g.beginPath(); g.moveTo(x + sz * 0.48, y - sz * 2.1); g.lineTo(x + sz * 1.96, y - sz * 2.35); g.lineTo(x + sz * 1.96, y - sz * 1.95); g.lineTo(x + sz * 0.48, y - sz * 1.7); g.closePath(); g.fill(); }
    else { g.beginPath(); g.moveTo(x + sz * 0.66, y - sz * 2.1); g.quadraticCurveTo(x + sz * 1.5, y - sz * 1.5, x + sz * 1.2, y - sz * 0.8); g.quadraticCurveTo(x + sz * 1.2, y - sz * 1.4, x + sz * 0.66, y - sz * 1.5); g.closePath(); g.fill(); }
  }

  /* ---------------- the score: one record from quote to cash, played bar by bar ---------------- */
  var CHIPS = [[0, 0.1, 54, 'Lead → Won'], [1, 1.06, 44, 'S00128'], [2, 2.0, 62, 'WH/OUT/0042'], [3, 2.62, 48, 'RFQ → PO'], [4, 3.1, 64, 'INV/2026/0107'], [4, 4.3, 36, 'Paid ✓']];
  var NOTESC = (function () { var a = []; for (var s = 0; s < 5; s++) for (var b = 0; b < 5; b++) for (var q = 0; q < 4; q++) { var u = b + 0.14 + q * 0.22;
    var busy = CHIPS.some(function (c) { return c[0] === s && u > c[1] - 0.16 && u < c[1] + c[2] / BAR + 0.08; }); if (!busy && hash(s * 31 + b * 7 + q * 1.7) > 0.32) a.push([s, u, Math.floor(hash(s * 13 + b * 5 + q * 3.1) * 8)]); } return a; })();
  var CYC = 11, RUN = 9.4, TUTTI = { t: -99 }, PLAY0 = 0;
  function play(t) {
    var tu = t - TUTTI.t, u;
    if (tu >= 0 && tu < 3.2) u = clamp(tu / 2.2, 0, 1); else u = clamp((((t - PLAY0) % CYC) + CYC) % CYC / RUN, 0, 1);
    var bar = Math.min(4, Math.floor(u * 5)), cue = ['crm', 'sale', 'stock', 'acc', 'acc'][bar];
    if (u > 0.5 && u < 0.6) cue = 'purchase'; if (u >= 1) cue = ''; if (tu >= 0 && tu < 3.2) cue = 'tutti';
    return { u: u, x: lerp(MX0, MX1, u), bar: bar, cue: cue };
  }

  /* ---------------- the people ---------------- */
  var W = CR.who;
  var TN = W({ x: POD.x, y: POD.top, s: 0.46, ph: 0.3, skin: 1, hair: 0, style: 'short', outfit: 'shirt', top: BLUE, glasses: true, hands: [[-80, -250], [96, -300]], look: 0.2 });
  var SAL = W({ x: 345, y: F, s: 0.44, ph: 1.1, skin: 2, hair: 1, style: 'long', outfit: 'shirt', top: '#F08A24', sit: true, chairCol: '#3D3550', id: GREY_ID, hands: [[-150, -300], [80, -280]], look: 0.4 });
  var INV = W({ x: 718, y: F, s: 0.44, ph: 2.2, skin: 3, hair: 0, style: 'short', outfit: 'polo', top: '#2E9BD6', sit: true, chairCol: '#3D3550', id: GREY_ID, hands: [[-27, -341], [60, -178]], look: -0.4 });
  var ACC = W({ x: 855, y: F, s: 0.44, ph: 2.9, skin: 1, hair: 2, style: 'bob', outfit: 'cardigan', top: '#1FA463', top2: '#FFFFFF', glasses: true, id: GREY_ID, hands: [[-80, -215], [80, -215]], look: -0.3 });
  var TRP = W({ x: 914, y: BAL.floor, s: 0.30, ph: 3.6, skin: 4, hair: 1, style: 'pony', outfit: 'polo', top: '#E0456B', id: GREY_ID, clip: '#FFD84A', hands: [[-50, -200], [50, -200]], look: -0.5 });
  var LIBR = W({ x: 252, y: F, s: 0.44, ph: 4.4, skin: 0, hair: 1, style: 'bun', outfit: 'cardigan', top: '#14A38B', top2: '#FFFFFF', glasses: true, hands: [[-70, -200], [70, -200]], look: -0.5 });
  /* the client's orchestra: woodwinds (Purchase) and a horn (CRM) on the top riser, strings (Sales, Inventory) below */
  var EXT = [];
  [[372, 'fl', '#7B5CD6'], [440, 'cl', '#A58BE8'], [508, 'bs', '#7B5CD6'], [578, 'cl', '#B9A6EE'], [646, 'fl', '#7B5CD6'], [712, 'hn', '#E0456B']].forEach(function (a, i) {
    EXT.push({ tier: 2, kind: a[1], P: W({ x: a[0], y: T2, s: 0.2, ph: i * 1.3 + 0.5, skin: i % 5, hair: i % 4, style: ['short', 'bob', 'pony', 'short', 'long', 'bun'][i], outfit: ['polo', 'shirt', 'cardigan', 'polo', 'shirt', 'cardigan'][i], top: a[2], sit: true, chairCol: '#4A4560', id: GREY_ID }) }); });
  [[364, 'vn', '#F08A24'], [430, 'vn', '#F7B26B'], [494, 'va', '#2E9BD6'], [560, 'va', '#6FBDE8'], [626, 'vn', '#F08A24'], [694, 'vn', '#2E9BD6']].forEach(function (a, i) {
    EXT.push({ tier: 1, kind: a[1], P: W({ x: a[0], y: T1, s: 0.24, ph: i * 1.7 + 0.2, skin: (i + 2) % 5, hair: (i + 1) % 4, style: ['bob', 'short', 'long', 'pony', 'short', 'bun'][i], outfit: ['shirt', 'polo', 'cardigan', 'shirt', 'polo', 'cardigan'][i], top: a[2], top2: '#FFFFFF', sit: true, chairCol: '#4A4560', id: GREY_ID }) }); });
  var HARP = W({ x: -520, y: 455, s: 0.4, ph: 5.1, skin: 2, hair: 0, style: 'long', outfit: 'cardigan', top: '#F2B6C9', top2: '#FFFFFF', sit: true, chairCol: '#4A4560', id: GREY_ID, look: -0.7 });
  var CREW = [
    { x0: -1040, x1: -640, y: 455, spd: 15, ph: 0.3, label: 'TechNext stagehand', lines: ['Customers, vendors and products, **checked before cut-over**.', 'Opening balances go in and are reconciled **against your current books**.'], acts: ['wave', 'id', 'nod'],
      P: W({ s: 0.46, skin: 2, hair: 0, style: 'short', outfit: 'polo', top: '#F2B233', hold: 'box' }) },
    { front: true, x0: -1000, x1: -520, y: 714, spd: 13, ph: 0.6, label: 'TechNext support engineer', lines: ['After opening night we stay on: **fixes, small changes and upgrades**.', 'One **point of contact** at TechNext, backed by Singapore, the Philippines and Vietnam.'], acts: ['nod', 'id', 'wave'],
      P: W({ s: 0.46, skin: 1, hair: 1, style: 'pony', outfit: 'shirt', top: PLUM, hold: 'tablet', clip: '#E2B23A' }) },
    { front: true, x0: -1080, x1: -600, y: 740, spd: 17, ph: 0.2, label: 'Client finance lead', lines: ['Front row for the **first month-end**, closed together.', 'P&L, GST and cash, all read from **one ledger**.'], acts: ['wave', 'nod'],
      P: W({ s: 0.52, skin: 3, hair: 0, style: 'bob', outfit: 'cardigan', top: '#3FA9E0', top2: '#FFFFFF', id: GREY_ID, hold: 'clipboard' }) }
  ];
  CREW[0].P.fixS = CREW[1].P.fixS = CREW[2].P.fixS = true;
  function handAt(P, side) {
    var F3 = K.F3, d = side ? 1 : -1, h = P.hands[side], sxk = P.sx == null ? 1 : P.sx, bw = P.build || 1;
    var r = K.ik(d * F3.shx * bw, F3.shy, h[0], h[1], F3.a, F3.b, d).h, dy = -(P.hop || 0) + (P.sit ? (P.sitDrop != null ? P.sitDrop : 46) : 0);
    return [P.x + r[0] * P.s * sxk, P.y + (r[1] + dy) * P.s];
  }
  function bodyY(P, ly) { var dy = -(P.hop || 0) + (P.sit ? (P.sitDrop != null ? P.sitDrop : 46) : 0); return P.y + (ly + dy) * P.s; }

  /* ---------------- the static layers ---------------- */
  function paintBg(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    var sg = g.createLinearGradient(0, -260, 0, 160); sg.addColorStop(0, '#7DC2EE'); sg.addColorStop(0.55, '#BEE3F8'); sg.addColorStop(1, '#EAF7FC'); g.fillStyle = sg; g.fillRect(e.l, e.t, e.r - e.l, 220 - e.t);
    var gl = g.createRadialGradient(1250, -110, 10, 1250, -110, 320); gl.addColorStop(0, 'rgba(255,247,210,.95)'); gl.addColorStop(0.3, 'rgba(255,243,200,.35)'); gl.addColorStop(1, 'rgba(255,243,200,0)'); g.fillStyle = gl; g.fillRect(e.l, e.t, e.r - e.l, 420);
    fillE(g, 1250, -110, 18, 18, '#FFF5CC');
    /* the park outside: a hill line, a row of rain trees, a fountain's spray */
    g.fillStyle = '#C6E6C4'; g.beginPath(); g.moveTo(e.l, 160); for (var x = e.l; x <= e.r + 40; x += 40) g.lineTo(x, 98 + Math.sin(x * 0.011) * 9 + Math.sin(x * 0.031) * 4); g.lineTo(e.r + 40, 220); g.lineTo(e.l, 220); g.closePath(); g.fill();
    for (var tx = Math.floor(e.l / 64) * 64; tx < e.r + 64; tx += 64) { var h = hash(tx * 0.17); g.fillStyle = '#8C6A4E'; g.fillRect(tx - 2, 86 - h * 10, 4, 40);
      fillE(g, tx, 74 - h * 12, 30 + h * 8, 16 + h * 4, '#7DBF8C'); fillE(g, tx - 14, 70 - h * 12, 16, 11, '#92CD9C'); fillE(g, tx + 12, 66 - h * 12, 14, 10, '#A3D6AA'); }
    g.restore();
  }
  function paintWindow(g, t, par, S) {
    var e = S.ext;
    for (var c = 0; c < 6; c++) { var sp = 3 + c * 1.6, span = e.r - e.l + 400, x = e.l - 200 + ((hash(c + 5) * span + t * sp) % span), y = -150 + (c % 3) * 34 + (c > 2 ? 14 : 0); K.cloud(g, x, y, 0.2 + hash(c + 1) * 0.1); }
    g.strokeStyle = 'rgba(40,60,90,.5)'; g.lineWidth = 1.5; g.lineCap = 'round';
    for (var b = 0; b < 5; b++) { var bsp = e.r - e.l + 300, bx = e.r + 100 - ((t * (14 + b * 3) + hash(b + 9) * bsp) % bsp), by = -110 + b * 16 + Math.sin(t * 0.8 + b) * 6, fl = Math.sin(t * 9 + b * 2) * 4;
      g.beginPath(); g.moveTo(bx - 6, by - fl); g.quadraticCurveTo(bx - 3, by - 3, bx, by); g.quadraticCurveTo(bx + 3, by - 3, bx + 6, by - fl); g.stroke(); }
  }
  function curtain(g, x0, x1, tieX, tieY, side) { /* a tied-back velvet drape: full at the top, gathered at the rope, flared to the floor */
    var inner = side > 0 ? x0 : x1, outer = side > 0 ? x1 : x0;
    g.save(); g.beginPath(); g.moveTo(inner, -190); g.lineTo(outer, -190); g.lineTo(outer, F); g.lineTo(lerp(outer, inner, 0.55), F);
    g.quadraticCurveTo(tieX, F - 120, tieX, tieY); g.quadraticCurveTo(inner, 80, inner, -190); g.closePath();
    var cg = g.createLinearGradient(x0, 0, x1, 0); cg.addColorStop(0, PLUM_D); cg.addColorStop(0.5, PLUM); cg.addColorStop(1, PLUM_D); g.fillStyle = cg; g.fill(); g.clip();
    g.fillStyle = 'rgba(255,255,255,.09)'; for (var fx = x0 + 6; fx < x1; fx += 18) g.fillRect(fx, -190, 6, 670);
    g.fillStyle = 'rgba(0,0,0,.08)'; for (var fx2 = x0 + 14; fx2 < x1; fx2 += 18) g.fillRect(fx2, -190, 3, 670);
    g.restore();
    g.strokeStyle = GOLD; g.lineWidth = 4; g.beginPath(); g.moveTo(tieX - 14 * side, tieY - 6); g.quadraticCurveTo(tieX, tieY + 8, tieX + 14 * side, tieY - 4); g.stroke();
    fillE(g, tieX, tieY + 4, 6, 6, GOLD_D); fillRR(g, tieX - 4, tieY + 8, 8, 18, 3, GOLD); for (var q = 0; q < 4; q++) fillRR(g, tieX - 4 + q * 2.4, tieY + 24, 1.4, 8, 0.7, GOLD_D);
  }
  function paintFrame(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    /* the hall wall with its tall windows cut out */
    var wg = g.createLinearGradient(0, -260, 0, WALL_B); wg.addColorStop(0, '#F2E3D0'); wg.addColorStop(1, '#FBF3E7');
    g.fillStyle = wg; g.beginPath(); g.rect(e.l, e.t, e.r - e.l, WALL_B - e.t); WINS.forEach(function (c) { arch(g, c - 74, -176, 148, 296); }); g.fill('evenodd');
    WINS.forEach(function (c) { if (c < e.l - 100 || c > e.r + 100) return;
      g.save(); g.beginPath(); arch(g, c - 74, -176, 148, 296); g.clip(); g.fillStyle = 'rgba(255,255,255,.22)'; g.beginPath(); g.moveTo(c - 50, 120); g.lineTo(c + 10, -176); g.lineTo(c + 40, -176); g.lineTo(c - 20, 120); g.closePath(); g.fill(); g.restore();
      g.strokeStyle = '#FFFFFF'; g.lineWidth = 10; g.beginPath(); arch(g, c - 74, -176, 148, 296); g.stroke();
      g.strokeStyle = '#E7D6C0'; g.lineWidth = 2; g.beginPath(); arch(g, c - 80, -182, 160, 302); g.stroke();
      g.fillStyle = '#FFFFFF'; g.fillRect(c - 3, -176, 6, 296); g.fillRect(c - 74, -30, 148, 5); g.fillRect(c - 74, 46, 148, 5);
      fillRR(g, c - 88, 116, 176, 10, 4, WOOD_L); g.fillStyle = 'rgba(120,80,40,.15)'; g.fillRect(c - 84, 125, 168, 3);
      fillE(g, c, -184, 12, 8, GOLD); });
    /* pilasters between the windows, gilt capitals */
    for (var px = Math.floor(e.l / 240) * 240 + 0; px < e.r; px += 240) { if (px > 120 && px < 1000) continue; if (WINS.some(function (c) { return Math.abs(c - px) < 100; })) continue;
      fillRR(g, px - 14, -190, 28, WALL_B + 190, 3, '#EAD6BC'); g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(px - 9, -180, 4, WALL_B + 170); fillRR(g, px - 19, -196, 38, 12, 3, GOLD); fillRR(g, px - 17, WALL_B - 14, 34, 14, 2, '#DCC3A2'); }
    /* the ceiling: coffers, the cornice, acoustic clouds */
    g.fillStyle = '#F7EEDF'; g.fillRect(e.l, e.t, e.r - e.l, -196 - e.t); g.strokeStyle = 'rgba(180,137,42,.35)'; g.lineWidth = 2;
    g.beginPath(); for (var cx = Math.floor(e.l / 110) * 110; cx < e.r; cx += 110) { g.rect(cx + 8, e.t - 40, 94, -206 - e.t + 40); } g.stroke();
    fillRR(g, e.l, -204, e.r - e.l, 10, 0, GOLD_L); g.fillStyle = 'rgba(180,137,42,.5)'; g.fillRect(e.l, -196, e.r - e.l, 3);
    /* the acoustic slat wall behind the orchestra */
    for (var sl = 312; sl < 808; sl += 9) { g.fillStyle = ((sl - 312) / 9) % 2 ? '#E6B57A' : '#EDC48E'; g.fillRect(sl, -16, 9, WALL_B + 16); }
    g.fillStyle = 'rgba(120,70,30,.12)'; g.fillRect(312, -16, 496, 4); fillRR(g, 306, -22, 508, 8, 3, WOOD_D);
    /* wainscot along the wall's foot */
    g.fillStyle = '#E8D3B7'; g.fillRect(e.l, 126, 312 - e.l, WALL_B - 126); g.fillRect(808, 126, e.r - 808, WALL_B - 126); g.fillStyle = 'rgba(255,255,255,.5)'; g.fillRect(e.l, 126, e.r - e.l, 2);
    /* the stage floor: honey planks running to the back */
    var fg = g.createLinearGradient(0, WALL_B, 0, F); fg.addColorStop(0, '#E2B47C'); fg.addColorStop(1, '#D79F62'); g.fillStyle = fg; g.fillRect(e.l, WALL_B, e.r - e.l, F - WALL_B);
    g.strokeStyle = 'rgba(140,80,30,.16)'; g.lineWidth = 1.4; g.beginPath();
    for (var d = 1; d < 9; d++) { var yy = WALL_B + Math.pow(d / 8, 1.4) * (F - WALL_B); g.moveTo(e.l, yy); g.lineTo(e.r, yy); }
    for (var i = -40; i <= 40; i++) { g.moveTo(560 + i * 46, WALL_B); g.lineTo(560 + i * 46 * 1.9, F); } g.stroke();
    g.fillStyle = 'rgba(120,70,30,.10)'; g.fillRect(e.l, WALL_B, e.r - e.l, 6);
    /* daylight from the windows, laid across the boards */
    WINS.forEach(function (c) { if (c < e.l - 300 || c > e.r + 100) return; g.fillStyle = 'rgba(255,248,222,.30)'; g.beginPath(); g.moveTo(c - 60, WALL_B); g.lineTo(c + 60, WALL_B); g.lineTo(c + 260, F); g.lineTo(c + 40, F); g.closePath(); g.fill(); });
    /* the hall in front of the stage: a warm carpet */
    var hg = g.createLinearGradient(0, F, 0, e.b); hg.addColorStop(0, '#E7D2C6'); hg.addColorStop(1, '#DCC0B2'); g.fillStyle = hg; g.fillRect(e.l, F, e.r - e.l, e.b - F);
    g.fillStyle = 'rgba(113,75,103,.07)'; for (var dy = F + 30; dy < e.b; dy += 34) for (var dx = Math.floor(e.l / 40) * 40 + ((dy / 34) % 2) * 20; dx < e.r; dx += 40) { g.beginPath(); g.moveTo(dx, dy - 6); g.lineTo(dx + 7, dy); g.lineTo(dx, dy + 6); g.lineTo(dx - 7, dy); g.closePath(); g.fill(); }
    curtain(g, 30, 150, 112, 262, -1); curtain(g, 996, 1076, 1040, 262, 1);
    /* the valance: velvet swags with a gold fringe across the proscenium */
    for (var vx = Math.floor(e.l / 130) * 130; vx < e.r; vx += 130) {
      g.fillStyle = PLUM; g.beginPath(); g.moveTo(vx, -196); g.lineTo(vx + 130, -196); g.lineTo(vx + 130, -186); g.quadraticCurveTo(vx + 65, -138, vx, -186); g.closePath(); g.fill();
      g.strokeStyle = 'rgba(255,255,255,.14)'; g.lineWidth = 3; g.beginPath(); g.moveTo(vx + 8, -184); g.quadraticCurveTo(vx + 65, -150, vx + 122, -184); g.stroke();
      g.strokeStyle = GOLD; g.lineWidth = 2.5; g.beginPath(); g.moveTo(vx, -186); g.quadraticCurveTo(vx + 65, -138, vx + 130, -186); g.stroke();
      fillE(g, vx, -186, 6, 6, GOLD); fillRR(g, vx - 3, -182, 6, 16, 3, GOLD_D); }
    g.restore();
  }
  function scoreBoard(g) {
    g.strokeStyle = '#B9A58C'; g.lineWidth = 1.6; g.beginPath(); [SC.x + 70, SC.x + SC.w - 70].forEach(function (x) { g.moveTo(x, -260); g.lineTo(x, SC.y - 6); }); g.stroke();
    shadowed(g, 16, 6, 0.22, function () { fillRR(g, SC.x - 9, SC.y - 9, SC.w + 18, SC.h + 18, 10, GOLD); });
    fillRR(g, SC.x - 5, SC.y - 5, SC.w + 10, SC.h + 10, 8, GOLD_L); fillRR(g, SC.x, SC.y, SC.w, SC.h, 5, IVORY);
    fillRR(g, SC.x, SC.y, SC.w, 19, 5, PLUM); g.fillRect(SC.x, SC.y + 10, SC.w, 9);
    text(g, 'FULL SCORE · ONE DATABASE', SC.x + 10, SC.y + 13, 8.6, 800, '#FFFFFF'); text(g, 'Odoo 20 · conducted by TechNext', SC.x + SC.w - 10, SC.y + 13, 6.8, 700, '#F3DDEB', 'right');
    for (var i = 0; i < 5; i++) { var y0 = staffY(i), a = APPS[i];
      fillRR(g, SC.x + 8, y0 - 0.5, 13, 13, 3.5, a[1]); fillRR(g, SC.x + 11, y0 + 2.5, 7, 7, 2, 'rgba(255,255,255,.55)'); text(g, a[0], SC.x + 26, y0 + 9.2, 7.6, 800, INK);
      g.strokeStyle = 'rgba(27,31,59,.38)'; g.lineWidth = 0.8; g.beginPath(); for (var j = 0; j < 5; j++) { g.moveTo(MX0 - 22, y0 + j * 3.2); g.lineTo(MX1, y0 + j * 3.2); } g.stroke();
      g.strokeStyle = INK; g.lineWidth = 1.3; g.beginPath(); g.moveTo(MX0 - 14, y0 + 15); g.lineTo(MX0 - 14, y0 - 3); g.quadraticCurveTo(MX0 - 8, y0 + 1, MX0 - 15, y0 + 7); g.quadraticCurveTo(MX0 - 20, y0 + 11, MX0 - 14, y0 + 13); g.quadraticCurveTo(MX0 - 9, y0 + 12, MX0 - 11, y0 + 8); g.stroke();
      text(g, '4', MX0 - 6, y0 + 6.2, 6.4, 800, INK, 'center'); text(g, '4', MX0 - 6, y0 + 12.6, 6.4, 800, INK, 'center'); }
    g.strokeStyle = 'rgba(27,31,59,.5)'; g.lineWidth = 1; g.beginPath(); for (var b = 1; b <= 5; b++) { var bx = MX0 + b * BAR; g.moveTo(bx, staffY(0)); g.lineTo(bx, staffY(4) + 12.8); } g.stroke();
    fillRR(g, MX0 - 26, staffY(0) - 2, 3, staffY(4) - staffY(0) + 17, 1.5, INK); g.lineWidth = 2; g.beginPath(); g.moveTo(MX1 - 3, staffY(0)); g.lineTo(MX1 - 3, staffY(4) + 12.8); g.stroke();
    for (var bn = 0; bn < 5; bn++) text(g, String(bn + 1), MX0 + bn * BAR + 3, staffY(0) - 3.5, 5.4, 700, '#9AA0B5');
  }
  function planBoard(g) {
    shadowed(g, 12, 5, 0.22, function () { fillRR(g, PL.x - 7, PL.y - 7, PL.w + 14, PL.h + 14, 7, WOOD_D); });
    fillRR(g, PL.x - 4, PL.y - 4, PL.w + 8, PL.h + 8, 5, WOOD); fillRR(g, PL.x, PL.y, PL.w, PL.h, 3, CHALK);
    g.fillStyle = 'rgba(255,255,255,.05)'; [[30, 60, 40], [120, 30, 34], [150, 80, 28]].forEach(function (s) { fillE(g, PL.x + s[0], PL.y + s[1], s[2], s[2] * 0.4, 'rgba(255,255,255,.05)'); });
    text(g, 'REHEARSAL PLAN', PL.x + 10, PL.y + 16, 9.4, 800, '#F4F1E4'); g.strokeStyle = 'rgba(244,241,228,.6)'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(PL.x + 10, PL.y + 20); g.lineTo(PL.x + 100, PL.y + 21); g.stroke();
    ['Discovery', 'Build & migrate', 'Train & test', 'Go live & support'].forEach(function (r, i) { var y = PL.y + 37 + i * 17.5; text(g, (i + 1) + '.', PL.x + 12, y, 8.6, 800, '#F7E58F'); text(g, r, PL.x + 25, y, 8.6, 700, '#F4F1E4'); });
    g.strokeStyle = 'rgba(244,241,228,.55)'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(PL.x + 150, PL.y + 14); g.lineTo(PL.x + 150, PL.y + 4); g.quadraticCurveTo(PL.x + 156, PL.y + 7, PL.x + 149, PL.y + 10); g.stroke();
    noteGlyph(g, PL.x + 160, PL.y + 14, 3.4, 'rgba(244,241,228,.6)', true);
    fillRR(g, PL.x - 8, PL.y + PL.h + 3, PL.w + 16, 6, 2, WOOD_D); fillRR(g, PL.x + 30, PL.y + PL.h, 14, 4, 2, '#FFFFFF'); fillRR(g, PL.x + 50, PL.y + PL.h, 10, 4, 2, '#FFE58A'); fillRR(g, PL.x + 140, PL.y + PL.h - 3, 26, 7, 2, '#5C6B7A'); fillRR(g, PL.x + 140, PL.y + PL.h - 3, 26, 3, 1.5, '#E9E4D4');
  }
  function tourPoster(g) {
    var x = TOUR.x, y = TOUR.y, w = TOUR.w, h = TOUR.h;
    shadowed(g, 12, 5, 0.2, function () { fillRR(g, x, y, w, h, 4, IVORY); });
    fillRR(g, x, y, w, 26, 4, PLUM); g.fillRect(x, y + 14, w, 12); text(g, 'ON TOUR', x + w / 2, y + 17.5, 11, 800, '#FFFFFF', 'center');
    [[x + 18, y + 13], [x + w - 18, y + 13]].forEach(function (p) { star5(g, p[0], p[1], 4.4, GOLD); });
    text(g, 'Enterprise Solution', x + w / 2, y + 40, 10.6, 800, INK, 'center'); text(g, 'several companies · one Odoo', x + w / 2, y + 50, 6.8, 700, '#6B6F88', 'center');
    fillRR(g, x + 8, y + 56, w - 16, 50, 5, '#E3F1FA');
    g.fillStyle = '#CBE6C6'; g.beginPath(); g.ellipse(x + 38, y + 72, 22, 11, -0.3, 0, 7); g.fill(); g.beginPath(); g.ellipse(x + 104, y + 90, 26, 9, 0.2, 0, 7); g.fill(); g.beginPath(); g.ellipse(x + 124, y + 74, 12, 7, 0, 0, 7); g.fill();
    [['EUR', x + 40, y + 70], ['MYR', x + 98, y + 86], ['SGD', x + 112, y + 98]].forEach(function (p) { fillE(g, p[1], p[2], 3.4, 3.4, '#E0456B'); fillE(g, p[1], p[2], 1.4, 1.4, '#FFFFFF'); fillRR(g, p[1] - 30 + (p[0] === 'EUR' ? 36 : 0), p[2] - 6, 24, 11, 3, '#FFFFFF'); text(g, p[0], p[1] - 18 + (p[0] === 'EUR' ? 36 : 0), p[2] + 2, 6.4, 800, PLUM, 'center'); });
    fillRR(g, x, y + h - 14, w, 14, 4, '#F3E7F0'); g.fillRect(x, y + h - 14, w, 6); text(g, 'one group · one set of numbers', x + w / 2, y + h - 4.6, 6.4, 800, PLUM, 'center');
    [[x + 6, y + 6], [x + w - 6, y + 6], [x + 6, y + h - 6], [x + w - 6, y + h - 6]].forEach(function (p) { fillE(g, p[0], p[1], 3, 3, GOLD_D); fillE(g, p[0] - 1, p[1] - 1, 1.2, 1.2, '#FFF5CC'); });
  }
  function star5(g, x, y, r, col) { g.fillStyle = col; g.beginPath(); for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, d = i % 2 ? r * 0.45 : r; g.lineTo(x + Math.cos(a) * d, y + Math.sin(a) * d); } g.closePath(); g.fill(); }
  var LIBROWS = ['Customers', 'Vendors', 'Products', 'Opening balances'];
  function library(g) {
    var x = LIB.x, w = LIB.w, y = LIB.y;
    soft(g, x + w / 2, F + 2, w * 0.6, 8, 0.22);
    fillRR(g, x + 14, y - 34, w - 28, 20, 5, PLUM); text(g, 'MUSIC LIBRARY', x + w / 2, y - 20, 8.4, 800, GOLD_L, 'center'); fillRR(g, x + 30, y - 14, 4, 8, 1, GOLD_D); fillRR(g, x + w - 34, y - 14, 4, 8, 1, GOLD_D);
    fillRR(g, x - 7, y - 8, w + 14, 12, 4, WOOD_D); fillRR(g, x, y, w, F - y, 4, WOOD); g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(x + 4, y + 4, 4, F - y - 8);
    LIBROWS.forEach(function (lab, i) { var sy = y + 12 + i * 50;
      fillRR(g, x + 8, sy, w - 16, 42, 3, '#8A5A33'); fillRR(g, x + 6, sy + 42, w - 12, 5, 2, WOOD_L);
      fillRR(g, x + 13, sy + 6, 92, 36, 3, IVORY); fillRR(g, x + 13, sy + 6, 92, 7, 3, APPS[[1, 3, 2, 4][i]][1]); text(g, lab, x + 18, sy + 24, 7.4, 800, INK); text(g, 'sheet set · migrated', x + 18, sy + 34, 5.4, 700, '#8A8FA6');
      for (var f = 0; f < 4; f++) { fillRR(g, x + 112 + f * 7, sy + 10 + (f % 2) * 3, 6, 32 - (f % 2) * 3, 1, ['#C9D6EE', '#F3E2C8', '#D7E9D0', '#EBD3E2'][f]); } });
    var dy0 = y + 214; fillRR(g, x + 8, dy0, w - 16, 18, 3, '#F3E7F0'); text(g, 'ARCHIVE · old system, kept for history', x + w / 2, dy0 + 12, 5.6, 800, PLUM, 'center');
    for (var dr = 0; dr < 4; dr++) { var yy = dy0 + 26 + dr * 54; fillRR(g, x + 8, yy, w - 16, 48, 3, '#C88F55'); fillRR(g, x + w / 2 - 14, yy + 20, 28, 7, 3, GOLD_D); fillRR(g, x + w / 2 - 12, yy + 21, 24, 3, 1.5, GOLD_L); }
    fillRR(g, x - 4, F - 8, w + 8, 8, 2, WOOD_D);
  }
  function balconyBack(g) {
    var x = BAL.x, w = BAL.w;
    fillRR(g, x - 6, BAL.top - 12, w + 12, 14, 6, GOLD); g.fillStyle = PLUM_D; g.beginPath(); arch(g, x, BAL.top - 6, w, BAL.floor - BAL.top + 6); g.fill();
    g.save(); g.beginPath(); arch(g, x, BAL.top - 6, w, BAL.floor - BAL.top + 6); g.clip(); g.fillStyle = 'rgba(255,255,255,.08)'; for (var fx = x + 4; fx < x + w; fx += 16) g.fillRect(fx, BAL.top - 6, 6, 200); g.restore();
    g.strokeStyle = GOLD; g.lineWidth = 3; g.beginPath(); arch(g, x, BAL.top - 6, w, BAL.floor - BAL.top + 6); g.stroke();
    fillRR(g, x - 4, BAL.floor - 2, w + 8, 8, 2, WOOD_D);
    [x + 20, x + w - 20].forEach(function (cx) { g.fillStyle = WOOD_D; g.beginPath(); g.moveTo(cx - 12, BAL.floor + 6); g.lineTo(cx + 12, BAL.floor + 6); g.quadraticCurveTo(cx + 10, BAL.floor + 22, cx, BAL.floor + 28); g.quadraticCurveTo(cx - 10, BAL.floor + 22, cx - 12, BAL.floor + 6); g.closePath(); g.fill(); fillE(g, cx, BAL.floor + 14, 3, 3, GOLD); });
  }
  function marqueeFrame(g) {
    shadowed(g, 10, 4, 0.2, function () { fillRR(g, MQ.x, MQ.y, MQ.w, MQ.h, 8, GOLD); }); fillRR(g, MQ.x + 6, MQ.y + 6, MQ.w - 12, MQ.h - 12, 4, '#FFF3D6');
    text(g, 'OPENING', MQ.x + MQ.w / 2, MQ.y + 27, 11, 800, PLUM, 'center'); text(g, 'NIGHT', MQ.x + MQ.w / 2, MQ.y + 41, 11, 800, PLUM, 'center');
    fillRR(g, MQ.x + 16, MQ.y + 48, MQ.w - 32, 12, 6, PLUM); text(g, 'go-live', MQ.x + MQ.w / 2, MQ.y + 57, 7, 800, '#FFFFFF', 'center');
    text(g, 'first month-end,', MQ.x + MQ.w / 2, MQ.y + 70, 5.8, 700, '#6B5A64', 'center'); text(g, 'together', MQ.x + MQ.w / 2, MQ.y + 78, 5.8, 700, '#6B5A64', 'center');
  }
  function gongFrame(g) {
    var x = GONG.x, y = GONG.y;
    [x - 36, x + 36].forEach(function (px) { fillRR(g, px - 4, y - 46, 8, T1 - y + 46, 3, WOOD_D); fillE(g, px, y - 48, 6, 6, GOLD); });
    fillRR(g, x - 42, y - 48, 84, 8, 4, WOOD_D); fillRR(g, x - 42, y - 48, 84, 3, 2, WOOD);
    g.strokeStyle = '#7A5A3A'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(x - 14, y - 40); g.lineTo(x - 8, y - GONG.r + 2); g.moveTo(x + 14, y - 40); g.lineTo(x + 8, y - GONG.r + 2); g.stroke();
    fillRR(g, x + 30, y - 8, 4, 44, 2, WOOD_L); fillE(g, x + 32, y - 10, 6, 6, '#E9E2D2');
  }
  function riser(g, x0, x1, top, face, col) {
    soft(g, (x0 + x1) / 2, top + face + 4, (x1 - x0) * 0.5, 6, 0.18);
    fillRR(g, x0, top - 12, x1 - x0, 14, 2, col); g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(x0 + 4, top - 10, x1 - x0 - 8, 3);
    fillRR(g, x0, top, x1 - x0, face, 2, WOOD_D); g.fillStyle = GOLD; g.fillRect(x0, top, x1 - x0, 2.5);
    g.fillStyle = 'rgba(0,0,0,.08)'; for (var px = x0 + 40; px < x1; px += 80) g.fillRect(px, top + 4, 2, face - 6);
  }
  function harp(g, x, y) {
    soft(g, x, y + 2, 40, 6, 0.24);
    g.strokeStyle = GOLD_D; g.lineWidth = 7; g.lineCap = 'round'; g.beginPath(); g.moveTo(x - 6, y - 4); g.lineTo(x - 22, y - 190); g.stroke();
    g.lineWidth = 6; g.beginPath(); g.moveTo(x - 22, y - 190); g.quadraticCurveTo(x + 10, y - 210, x + 30, y - 168); g.quadraticCurveTo(x + 44, y - 130, x + 46, y - 100); g.stroke();
    g.lineWidth = 9; g.strokeStyle = GOLD; g.beginPath(); g.moveTo(x - 4, y - 6); g.lineTo(x + 46, y - 100); g.stroke();
    fillE(g, x - 22, y - 194, 7, 7, GOLD_L); fillRR(g, x - 18, y - 6, 26, 8, 3, GOLD_D);
    g.strokeStyle = 'rgba(255,255,255,.75)'; g.lineWidth = 0.8; g.beginPath(); for (var s = 0; s < 9; s++) { var u = s / 8, sx0 = lerp(x - 2, x + 42, u), sy0 = lerp(y - 12, y - 94, u), sx1 = lerp(x - 18, x + 34, u), sy1 = lerp(y - 184, y - 168, u); g.moveTo(sx0, sy0); g.lineTo(sx1, sy1); } g.stroke();
  }
  function piano(g, x, y) {
    soft(g, x + 110, y + 3, 130, 9, 0.26);
    g.fillStyle = '#2A2E3E'; g.beginPath(); g.moveTo(x, y - 92); g.lineTo(x + 210, y - 92); g.quadraticCurveTo(x + 236, y - 92, x + 230, y - 70); g.lineTo(x + 210, y - 56); g.lineTo(x, y - 56); g.closePath(); g.fill();
    g.fillStyle = '#3A3F55'; g.beginPath(); g.moveTo(x + 14, y - 94); g.lineTo(x + 150, y - 196); g.lineTo(x + 160, y - 190); g.lineTo(x + 40, y - 94); g.closePath(); g.fill();
    g.strokeStyle = '#6A6F85'; g.lineWidth = 2; g.beginPath(); g.moveTo(x + 120, y - 94); g.lineTo(x + 132, y - 168); g.stroke();
    fillRR(g, x - 2, y - 60, 98, 14, 2, '#FFFFFF'); g.fillStyle = '#1B1F3B'; for (var kx = 0; kx < 14; kx++) if (kx % 7 !== 2 && kx % 7 !== 6) g.fillRect(x + 4 + kx * 6.6, y - 60, 3.4, 8);
    g.fillStyle = '#C9D3E3'; for (var kk = 1; kk < 15; kk++) g.fillRect(x - 2 + kk * 6.6, y - 52, 0.6, 6);
    [[x + 14, y - 56], [x + 196, y - 60]].forEach(function (l) { fillRR(g, l[0] - 5, l[1], 10, y - l[1], 3, '#2A2E3E'); fillRR(g, l[0] - 7, y - 4, 14, 5, 2, GOLD_D); });
    fillRR(g, x + 30, y - 34, 50, 8, 3, '#2A2E3E'); [x + 34, x + 72].forEach(function (lx) { fillRR(g, lx, y - 26, 4, 26, 2, '#2A2E3E'); });
    fillRR(g, x + 24, y - 92 - 34, 40, 30, 2, IVORY); g.strokeStyle = 'rgba(27,31,59,.35)'; g.lineWidth = 0.6; g.beginPath(); for (var sl = 0; sl < 4; sl++) { g.moveTo(x + 28, y - 118 + sl * 6); g.lineTo(x + 60, y - 118 + sl * 6); } g.stroke();
  }
  function wallClockFace(g, x, y) { K.clockFace(g, { x: x, y: y, r: 17 }, GOLD); }
  function cases(g, x, y) {
    soft(g, x + 60, y + 2, 80, 6, 0.22);
    g.fillStyle = '#3A3F55'; g.beginPath(); g.ellipse(x + 30, y - 40, 22, 40, -0.18, 0, 7); g.fill(); g.beginPath(); g.ellipse(x + 26, y - 92, 12, 18, -0.18, 0, 7); g.fill(); fillRR(g, x + 22, y - 44, 10, 3, 1.5, GOLD);
    fillRR(g, x + 56, y - 26, 70, 26, 8, '#5C4A6A'); fillRR(g, x + 56, y - 26, 70, 6, 4, '#73608A'); fillRR(g, x + 84, y - 30, 14, 5, 2, '#2A2E3E');
    fillRR(g, x + 66, y - 50, 50, 22, 8, '#B5652A'); fillRR(g, x + 86, y - 54, 10, 5, 2, '#2A2E3E');
  }
  function chairStack(g, x, y) { /* spare orchestra chairs stacked by the wall, a folded stand leaning on them */
    soft(g, x + 30, y + 2, 50, 6, 0.22);
    for (var c = 0; c < 4; c++) { var yy = y - 60 - c * 14; fillRR(g, x, yy, 60, 10, 4, '#4A4560'); fillRR(g, x + 4, yy - 44, 52, 40, 8, c === 3 ? '#5C5672' : '#4A4560'); }
    [x + 6, x + 54].forEach(function (lx) { fillRR(g, lx - 2, y - 52, 4, 52, 2, '#7A869C'); });
    g.strokeStyle = '#3A3F55'; g.lineWidth = 2.4; g.beginPath(); g.moveTo(x + 76, y); g.lineTo(x + 70, y - 120); g.stroke(); fillRR(g, x + 58, y - 140, 30, 22, 2, '#2E3248');
  }
  function bass(g, x, y) { /* a double bass resting on its side against the wing flat */
    soft(g, x, y + 2, 46, 6, 0.24); g.save(); g.translate(x, y - 34); g.rotate(-0.4);
    fillE(g, 0, 10, 34, 30, '#A0561F'); fillE(g, 0, -40, 26, 24, '#A0561F'); fillE(g, 0, -14, 20, 14, '#A0561F'); fillE(g, -8, -4, 8, 18, 'rgba(255,255,255,.14)');
    fillRR(g, -3, -150, 6, 130, 2, '#2A2E3E'); fillE(g, 0, -156, 6, 8, '#7A4A26'); g.fillStyle = '#2A2E3E'; g.fillRect(-9, 0, 2, 16); g.fillRect(7, 0, 2, 16); g.restore();
  }
  function paintBack(g, ext) {
    /* the lighting bar and the hanging acoustic clouds (above the score) */
    g.strokeStyle = '#B9A58C'; g.lineWidth = 1.2; g.beginPath(); [220, 420, 640, 860].forEach(function (x) { g.moveTo(x, -300); g.lineTo(x, -236); }); g.stroke();
    [[190, 70], [380, 90], [600, 84], [820, 76]].forEach(function (c) { g.fillStyle = '#FFFFFF'; g.beginPath(); g.moveTo(c[0], -232); g.quadraticCurveTo(c[0] + c[1] / 2, -246, c[0] + c[1], -232); g.lineTo(c[0] + c[1] - 6, -220); g.quadraticCurveTo(c[0] + c[1] / 2, -232, c[0] + 6, -220); g.closePath(); g.fill(); });
    fillRR(g, 140, -238, 800, 5, 2.5, '#D9CDBD'); [200, 320, 440, 560, 680, 800].forEach(function (x) { fillRR(g, x - 7, -234, 14, 12, 4, '#CFC4B4'); fillE(g, x, -221, 6, 3, '#FFF4C9'); });
    scoreBoard(g); planBoard(g); tourPoster(g); library(g); balconyBack(g); marqueeFrame(g);
    /* the risers: the woodwinds above, the strings below */
    riser(g, 340, 790, T2, 18, '#9C6B8E'); riser(g, 318, 812, T1, 18, '#9C6B8E');
    gongFrame(g);
    /* the wings: a harp and a clock on the left, the grand piano and the stage door on the right */
    if (ext.l < -420) { harp(g, -575, 455); cases(g, -930, 455); wallClockFace(g, -540, -112);
      fillRR(g, -1006, -56, 92, 202, 4, '#E6D2B6'); fillRR(g, -998, -48, 76, 194, 3, '#C88F55'); fillE(g, -936, 50, 4, 4, GOLD_D); fillRR(g, -994, -84, 68, 22, 5, '#2A2E3E'); text(g, 'REHEARSAL', -960, -69, 8, 800, '#FFB3B3', 'center');
      chairStack(g, -790, 455); K.plant(g, { x: -640, y: 455 }, '#C88F55', '#D9A066'); K.plant(g, { x: -1060, y: 455 }, '#C88F55', '#D9A066'); bass(g, -470, 455);
      fillRR(g, -820, 20, 74, 96, 3, IVORY); fillRR(g, -820, 20, 74, 18, 3, PLUM); text(g, 'TONIGHT', -783, 33, 8, 800, '#FFFFFF', 'center'); text(g, 'Full rehearsal', -783, 54, 6.6, 800, INK, 'center'); text(g, 'all sections', -783, 66, 6, 700, '#6B6F88', 'center'); noteGlyph(g, -796, 96, 5, PLUM, true); }
    if (ext.l < 0) wingBack(g);
    if (ext.r > 1040) { piano(g, 1078, 455); fillRR(g, 1290, -40, 96, 190, 4, '#E6D2B6'); fillRR(g, 1298, -32, 80, 182, 3, '#C88F55'); fillRR(g, 1300, -66, 76, 22, 5, '#2A2E3E'); text(g, 'STAGE DOOR', 1338, -51, 7.6, 800, '#FFE58A', 'center'); fillE(g, 1306, 60, 4, 4, GOLD_D);
      fillRR(g, 1312, 0, 52, 70, 2, IVORY); fillRR(g, 1312, 0, 52, 14, 2, GOLD); text(g, 'GO-LIVE', 1338, 10.5, 6.4, 800, PLUM, 'center'); star5(g, 1338, 40, 12, '#F3D27A'); text(g, 'opening night', 1338, 62, 5.4, 800, PLUM, 'center'); }
  }
  function stand(g, x, col, title, rec) {
    soft(g, x, F + 2, 28, 4, 0.24);
    g.strokeStyle = '#3A3F55'; g.lineWidth = 3; g.lineCap = 'round'; g.beginPath(); g.moveTo(x - 20, F); g.lineTo(x, F - 24); g.lineTo(x + 20, F); g.moveTo(x, F - 24); g.lineTo(x, F - 118); g.stroke();
    fillRR(g, x - 35, F - 168, 70, 50, 4, '#2E3248'); fillRR(g, x - 32, F - 165, 64, 42, 2, IVORY); fillRR(g, x - 32, F - 165, 64, 10, 2, col); text(g, title, x - 28, F - 157.5, 6.6, 800, '#FFFFFF');
    g.strokeStyle = 'rgba(27,31,59,.35)'; g.lineWidth = 0.6; g.beginPath(); for (var l = 0; l < 5; l++) { g.moveTo(x - 28, F - 150 + l * 2.6); g.lineTo(x + 28, F - 150 + l * 2.6); } g.stroke();
    fillRR(g, x - 29, F - 134, 58, 10, 3, '#F4F6FA'); text(g, rec, x, F - 126.6, 5.4, 800, INK, 'center');
    fillRR(g, x - 37, F - 122, 74, 5, 2, '#2E3248');
  }
  function timpani(g) {
    DRUMS.forEach(function (x, i) {
      soft(g, x, F + 3, DRUM_R + 6, 6, 0.26);
      g.strokeStyle = '#6A6F85'; g.lineWidth = 3; g.beginPath(); g.moveTo(x - 26, DRUM_Y + 40); g.lineTo(x - 32, F); g.moveTo(x + 26, DRUM_Y + 40); g.lineTo(x + 32, F); g.moveTo(x, DRUM_Y + 50); g.lineTo(x, F); g.stroke();
      var cg = g.createLinearGradient(x - DRUM_R, 0, x + DRUM_R, 0); cg.addColorStop(0, '#B8743E'); cg.addColorStop(0.4, '#E9A86A'); cg.addColorStop(1, '#A4612F');
      g.fillStyle = cg; g.beginPath(); g.moveTo(x - DRUM_R, DRUM_Y); g.bezierCurveTo(x - DRUM_R, DRUM_Y + 52, x + DRUM_R, DRUM_Y + 52, x + DRUM_R, DRUM_Y); g.closePath(); g.fill();
      fillE(g, x, DRUM_Y, DRUM_R + 3, 11, '#8A97A8'); fillE(g, x, DRUM_Y - 1, DRUM_R, 9.5, '#FBF7EE');
      for (var lg = 0; lg < 6; lg++) { var a = Math.PI * (0.1 + lg * 0.16), lx = x - Math.cos(a) * (DRUM_R + 1); fillRR(g, lx - 1.5, DRUM_Y + 2, 3, 9, 1, '#5C6B7A'); }
      text(g, i ? 'Cr' : 'Dr', x, DRUM_Y + 4.6, 13, 800, INK, 'center');
    });
  }
  function paintFront(g, ext) {
    /* the librarian's book trolley */
    var tx = 150; soft(g, tx + 32, F + 2, 40, 5, 0.22); fillRR(g, tx, F - 64, 66, 8, 3, WOOD_D); fillRR(g, tx, F - 24, 66, 6, 3, WOOD_D); fillRR(g, tx + 2, F - 64, 5, 58, 2, '#7A869C'); fillRR(g, tx + 59, F - 64, 5, 58, 2, '#7A869C');
    [[tx + 6, F - 92, '#F08A24'], [tx + 34, F - 88, '#2E9BD6']].forEach(function (c) { fillRR(g, c[0], c[1], 26, 28, 3, '#C99A6B'); fillRR(g, c[0], c[1], 26, 6, 2, c[2]); fillRR(g, c[0] + 4, c[1] - 6, 18, 8, 1, IVORY); });
    fillRR(g, tx + 8, F - 50, 50, 26, 3, '#C99A6B'); fillRR(g, tx + 8, F - 50, 50, 6, 2, '#1FA463'); fillE(g, tx + 8, F, 5, 5, '#2A2E3E'); fillE(g, tx + 58, F, 5, 5, '#2A2E3E');
    stand(g, ST_S, '#F08A24', 'Sales', 'S00128 · confirmed'); stand(g, ST_I, '#2E9BD6', 'Inventory', 'WH/OUT/0042 · done');
    /* the conductor's podium */
    soft(g, POD.x, F + 3, POD.w * 0.62, 6, 0.26); fillRR(g, POD.x - POD.w / 2, POD.top, POD.w, F - POD.top, 4, WOOD_D); fillRR(g, POD.x - POD.w / 2 - 3, POD.top - 2, POD.w + 6, 7, 3, GOLD);
    fillRR(g, POD.x - 26, POD.top + 12, 52, 16, 4, PLUM); CO.plane(g, POD.x - 15, POD.top + 20, 0.6, 0, '#FFFFFF'); text(g, 'TechNext', POD.x + 4, POD.top + 23.6, 7, 800, '#FFFFFF', 'center');
    timpani(g);
    /* the CRM balcony's front: velvet, a gilt rail and its banner */
    var bx = BAL.x, bw = BAL.w; fillRR(g, bx - 4, BAL.rail, bw + 8, BAL.floor - BAL.rail + 10, 6, PLUM); g.fillStyle = 'rgba(255,255,255,.08)'; for (var fx = bx; fx < bx + bw; fx += 14) g.fillRect(fx, BAL.rail + 6, 5, BAL.floor - BAL.rail);
    fillRR(g, bx - 8, BAL.rail - 6, bw + 16, 9, 4, GOLD); fillRR(g, bx - 8, BAL.rail - 6, bw + 16, 3, 2, GOLD_L);
    fillRR(g, bx + 18, BAL.rail + 10, bw - 36, 34, 6, IVORY); text(g, 'CRM', bx + 40, BAL.rail + 25, 11, 800, '#E0456B', 'center');
    ['New', 'Won', 'Quote'].forEach(function (s, i) { var cx = bx + 62 + i * 30; g.fillStyle = i === 2 ? '#F08A24' : i === 1 ? '#1FA463' : '#E0456B'; g.beginPath(); g.moveTo(cx, BAL.rail + 17); g.lineTo(cx + 24, BAL.rail + 17); g.lineTo(cx + 30, BAL.rail + 24); g.lineTo(cx + 24, BAL.rail + 31); g.lineTo(cx, BAL.rail + 31); g.lineTo(cx + 6, BAL.rail + 24); g.closePath(); g.fill(); text(g, s, cx + 15, BAL.rail + 26.4, 5.6, 800, '#FFFFFF', 'center'); });
    text(g, 'the opening fanfare', bx + bw / 2, BAL.rail + 40, 5.8, 700, '#8A6A80', 'center');
    /* the stage lip and its footlights */
    var lg = g.createLinearGradient(0, F + 2, 0, F + 38); lg.addColorStop(0, '#B47A43'); lg.addColorStop(1, '#8E5A2E'); g.fillStyle = lg; g.fillRect(ext.l, F + 2, ext.r - ext.l, 36);
    g.fillStyle = GOLD; g.fillRect(ext.l, F + 1, ext.r - ext.l, 3); g.fillStyle = 'rgba(0,0,0,.14)'; g.fillRect(ext.l, F + 36, ext.r - ext.l, 3);
    for (var fl = Math.floor(ext.l / 64) * 64 + 32; fl < ext.r; fl += 64) { g.fillStyle = '#5C4030'; g.beginPath(); g.ellipse(fl, F + 9, 11, 6, 0, Math.PI, 0); g.fill(); fillE(g, fl, F + 9, 7, 2.5, '#FFF0C2'); }
    if (ext.l < 100) stallsDesk(g);
  }
  function paintFore(g, ext) {
    /* the stalls: the first row's velvet seat backs (the second row is drawn live, over its people) */
    for (var x = Math.floor((ext.l - 40) / 72) * 72 + 36; x < 980; x += 72) {
      fillRR(g, x - 31, 648, 62, 74, 14, PLUM); fillRR(g, x - 25, 654, 50, 10, 5, PLUM_L); g.strokeStyle = GOLD; g.lineWidth = 1.6; rr(g, x - 31, 648, 62, 74, 14); g.stroke();
      fillRR(g, x - 8, 676, 16, 9, 2, GOLD); text(g, 'A' + (((Math.round(x / 72) % 20) + 20) % 20 + 1), x, 683, 5.6, 800, PLUM_D, 'center');
      if (hash(x * 0.37) > 0.6) { fillRR(g, x - 12, 692, 24, 16, 2, IVORY); g.fillStyle = PLUM; g.fillRect(x - 12, 692, 24, 4); } }
    /* the side aisle on the right: brass posts and a velvet rope */
    if (ext.r > 990) { [1000, 1130, 1260, 1390].forEach(function (px) { soft(g, px, 742, 16, 3, 0.25); fillRR(g, px - 3, 680, 6, 62, 3, GOLD_D); fillE(g, px, 678, 7, 7, GOLD); fillRR(g, px - 10, 738, 20, 6, 3, GOLD_D); });
      g.strokeStyle = PLUM; g.lineWidth = 5; g.beginPath(); for (var rp = 0; rp < 3; rp++) { var a = [1000, 1130, 1260, 1390][rp], b = a + 130; g.moveTo(a, 686); g.quadraticCurveTo((a + b) / 2, 712, b, 686); } g.stroke(); }
    if (ext.l < 100) { var bq = 60; soft(g, bq, 724, 34, 5, 0.24); fillRR(g, bq - 26, 700, 52, 22, 6, '#F3E7F0'); [[-14, '#FF8FA3'], [0, '#FFD84A'], [14, '#E0456B'], [-6, '#FFFFFF'], [8, '#F7B26B']].forEach(function (f, i) { fillE(g, bq + f[0], 690 - (i % 2) * 8, 8, 8, f[1]); }); }
  }

  /* ---------------- live: the score, the boards, the orchestra ---------------- */
  var TAP = {}, NOTES = [], PAGES = [], HITS = [-9, -9], GONGT = -99, APPL = { t: -99 }, FANF = -99, lastEmit = 0;
  function emitNotes(t, pl) {
    if (t - lastEmit < 0.42) return; lastEmit = t; var src = [];
    if (pl.cue === 'sale' || pl.cue === 'tutti') src.push([SAL.x - 30, 300, '#F08A24']); if (pl.cue === 'stock' || pl.cue === 'tutti') src.push([INV.x - 20, 300, '#2E9BD6']);
    if (pl.cue === 'acc' || pl.cue === 'tutti') src.push([ACC.x, 330, '#1FA463']); if (pl.cue === 'crm' || pl.cue === 'tutti' || t - FANF < 2) src.push([TRP.x + 40, 50, '#E0456B']); if (pl.cue === 'purchase' || pl.cue === 'tutti') src.push([480 + Math.random() * 200, 120, '#7B5CD6']);
    src.forEach(function (s) { NOTES.push({ x: s[0] + (Math.random() - 0.5) * 30, y: s[1], t0: t, c: s[2], two: Math.random() > 0.5, dx: (Math.random() - 0.5) * 40 }); });
  }
  function scoreLive(g, t, S, pl) {
    var px = pl.x, hot = S.hot === 'score';
    g.fillStyle = hot ? 'rgba(226,178,58,.22)' : 'rgba(226,178,58,.13)'; g.fillRect(MX0, staffY(0) - 6, px - MX0, staffY(4) - staffY(0) + 22);
    NOTESC.forEach(function (n) { var x = MX0 + n[1] * BAR, y = staffY(n[0]) + 12.8 - n[2] * 1.6, on = x <= px; g.fillStyle = on ? APPS[n[0]][1] : '#4A5068'; K.ell(g, x, y, 2.4, 1.75, -0.35); g.fill(); g.fillRect(x + 1.8, y - 9, 0.8, 9); });
    var prev = null;
    CHIPS.forEach(function (c) { var x = MX0 + c[1] * BAR, y = staffY(c[0]) - 1.5, on = x <= px + 1, just = on && px - x < 22 && px - x >= 0, col = APPS[c[0]][1], s = just ? 1 + 0.16 * Math.sin((px - x) / 22 * Math.PI) : 1;
      if (prev && on && prev.on) { g.save(); g.strokeStyle = 'rgba(113,75,103,.55)'; g.lineWidth = 1; g.setLineDash([2.5, 2]); g.beginPath(); g.moveTo(prev.x + prev.w, prev.y + 7.5); g.lineTo(x, y + 7.5); g.stroke(); g.restore(); }
      g.save(); g.translate(x + c[2] / 2, y + 7.5); g.scale(s, s); fillRR(g, -c[2] / 2, -7.5, c[2], 15, 4, on ? col : '#FFFFFF');
      if (!on) { g.strokeStyle = 'rgba(27,31,59,.22)'; g.lineWidth = 0.8; rr(g, -c[2] / 2, -7.5, c[2], 15, 4); g.stroke(); }
      text(g, c[3], 0, 2.6, 6.4, 800, on ? '#FFFFFF' : '#5C6378', 'center'); g.restore(); prev = { x: x, y: y, w: c[2], on: on }; });
    g.fillStyle = GOLD_D; g.fillRect(px - 1, staffY(0) - 7, 2, staffY(4) - staffY(0) + 24); g.beginPath(); g.moveTo(px - 5, staffY(0) - 10); g.lineTo(px + 5, staffY(0) - 10); g.lineTo(px, staffY(0) - 4); g.closePath(); g.fill();
    text(g, pl.u >= 1 ? 'one record · quote to cash ✓' : 'bar ' + (pl.bar + 1) + ' of 5', SC.x + SC.w - 12, SC.y + SC.h - 4, 6, 800, pl.u >= 1 ? '#1FA463' : '#8A8FA6', 'right');
  }
  function planLive(g, t, S) {
    var cur = S.hot === 'plan' ? Math.floor(t * 0.9) % 4 : Math.floor(t / 3.4) % 4;
    for (var i = 0; i < 4; i++) { var y = PL.y + 37 + i * 17.5;
      if (i < cur) { g.strokeStyle = '#B8F0C8'; g.lineWidth = 2; g.lineCap = 'round'; g.beginPath(); g.moveTo(PL.x + PL.w - 30, y - 4); g.lineTo(PL.x + PL.w - 26, y); g.lineTo(PL.x + PL.w - 18, y - 9); g.stroke(); }
      if (i === cur) { var p = (t * 1.6) % 1; g.strokeStyle = 'rgba(247,229,143,.95)'; g.lineWidth = 1.4; g.beginPath(); g.ellipse(PL.x + 15, y - 3, 8, 7, 0, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.min(1, p * 1.4)); g.stroke();
        g.fillStyle = 'rgba(247,229,143,.9)'; g.beginPath(); g.moveTo(PL.x + PL.w - 30, y - 7); g.lineTo(PL.x + PL.w - 22, y - 3.5); g.lineTo(PL.x + PL.w - 30, y); g.closePath(); g.fill(); } }
  }
  function tourLive(g, t, S) {
    var x = TOUR.x, y = TOUR.y, pts = [[x + 40, y + 70], [x + 98, y + 86], [x + 112, y + 98]], hot = S.hot === 'enterprise';
    g.save(); g.strokeStyle = hot ? '#E0456B' : 'rgba(224,69,107,.7)'; g.lineWidth = 1.3; g.setLineDash([3, 3]); g.lineDashOffset = -t * 12; g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); g.quadraticCurveTo(x + 80, y + 60, pts[1][0], pts[1][1]); g.lineTo(pts[2][0], pts[2][1]); g.stroke(); g.restore();
    var u = (t * 0.25) % 1, q = u < 0.75 ? u / 0.75 : 1, a = 1 - q, px = a * a * pts[0][0] + 2 * a * q * (x + 80) + q * q * pts[1][0], py = a * a * pts[0][1] + 2 * a * q * (y + 60) + q * q * pts[1][1];
    if (u >= 0.75) { var f = (u - 0.75) / 0.25; px = lerp(pts[1][0], pts[2][0], f); py = lerp(pts[1][1], pts[2][1], f); }
    CO.plane(g, px, py - 3, 0.5, 0.3, PLUM);
  }
  function libraryLive(g, t, S) {
    var sp = S.hot === 'migrate' ? 2.4 : 1, cyc = (t * sp) % 8, done = Math.floor(cyc / 1.6);
    LIBROWS.forEach(function (lab, i) { var sy = LIB.y + 12 + i * 50, cx = LIB.x + LIB.w - 20, cy = sy + 12;
      if (i < done) { fillE(g, cx, cy, 6, 6, '#1FA463'); g.strokeStyle = '#FFFFFF'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(cx - 3, cy); g.lineTo(cx - 1, cy + 2.5); g.lineTo(cx + 3.2, cy - 2.6); g.stroke(); }
      else if (i === done) { g.strokeStyle = '#1FA463'; g.lineWidth = 1.5; g.beginPath(); g.arc(cx, cy, 5.5, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * ((cyc % 1.6) / 1.6)); g.stroke(); var sl = Math.min(1, (cyc % 1.6) / 0.8); fillRR(g, LIB.x + 112 + 28 - (1 - sl) * 30, sy + 14, 6, 28, 1, '#FFFCF3'); } });
  }
  function marqueeLive(g, t, S) {
    var n = 0, hot = S.hot === 'golive', per = 2 * (MQ.w + MQ.h) - 16, step = 9.4;
    for (var d = 0; d < per; d += step) { var x, y, q = d;
      if (q < MQ.w - 8) { x = MQ.x + 4 + q; y = MQ.y + 3; } else if ((q -= MQ.w - 8) < MQ.h - 8) { x = MQ.x + MQ.w - 3; y = MQ.y + 4 + q; } else if ((q -= MQ.h - 8) < MQ.w - 8) { x = MQ.x + MQ.w - 4 - q; y = MQ.y + MQ.h - 3; } else { q -= MQ.w - 8; x = MQ.x + 3; y = MQ.y + MQ.h - 4 - q; }
      var on = hot ? (Math.floor(t * 8) % 2 === n % 2) : ((n + Math.floor(t * 6)) % 3 === 0); fillE(g, x, y, 2.4, 2.4, on ? '#FFF6C2' : '#C99A3A'); if (on) fillE(g, x, y, 1.2, 1.2, '#FFFFFF'); n++; }
  }
  function gongLive(g, t) {
    var bt = t - GONGT, sw = bt < 3 ? Math.sin(bt * 9) * 0.12 * (3 - bt) / 3 : Math.sin(t * 0.9) * 0.015;
    g.save(); g.translate(GONG.x, GONG.y - GONG.r); g.rotate(sw); g.translate(0, GONG.r);
    fillE(g, 0, 0, GONG.r, GONG.r, '#C98A2E'); fillE(g, 0, 0, GONG.r - 3, GONG.r - 3, '#E3A84A'); g.strokeStyle = 'rgba(120,70,20,.35)'; g.lineWidth = 0.8; for (var r = 6; r < GONG.r - 4; r += 5) { g.beginPath(); g.arc(0, 0, r, 0, 7); g.stroke(); }
    fillE(g, 0, 0, 7, 7, '#C98A2E'); fillE(g, -8, -9, 6, 3, 'rgba(255,255,255,.35)'); g.restore();
    if (bt < 2.2) { g.strokeStyle = 'rgba(226,178,58,' + (1 - bt / 2.2).toFixed(2) + ')'; g.lineWidth = 2; for (var q = 0; q < 3; q++) { g.beginPath(); g.arc(GONG.x, GONG.y, GONG.r + 6 + bt * 40 + q * 10, 0, 7); g.stroke(); } }
  }
  /* an orchestra player: the engine's person plus the instrument, a stand, and the bow arm on the beat */
  function instrument(g, P, kind, t) {
    var s = P.s, q = s / 0.44;
    if (kind === 'vn' || kind === 'va') { violin(g, P, kind === 'va' ? 1.15 : 1); return; }
    var mx = P.x + P.look * 9 * s, my = bodyY(P, -346);
    if (kind === 'fl') { g.save(); g.translate(mx + 4 * q, my + 2 * q); g.rotate(-0.06); fillRR(g, 0, -1.6 * q, 70 * q, 3.4 * q, 1.5, '#D5DCE6'); g.fillStyle = '#8A97A8'; for (var k = 1; k < 6; k++) g.fillRect(14 * q + k * 9 * q, -1.6 * q, 2 * q, 3.4 * q); g.restore(); return; }
    if (kind === 'cl') { g.save(); g.translate(mx, my + 4 * q); g.rotate(0.12); fillRR(g, -2.2 * q, 0, 4.4 * q, 64 * q, 1.5, '#2A2E3E'); g.fillStyle = '#C9D3DE'; for (var k2 = 1; k2 < 6; k2++) g.fillRect(-2.6 * q, k2 * 9 * q, 5.2 * q, 1.4 * q); fillE(g, 0, 66 * q, 6 * q, 3.4 * q, '#2A2E3E'); g.restore(); return; }
    if (kind === 'bs') { var hb = handAt(P, 0); g.save(); g.translate(hb[0] + 6 * q, hb[1] + 40 * q); g.rotate(-0.22); fillRR(g, -5 * q, -170 * q, 10 * q, 180 * q, 4 * q, '#8A4F2A'); fillRR(g, -5 * q, -170 * q, 10 * q, 12 * q, 3 * q, '#C9D3DE'); g.restore(); g.strokeStyle = '#C9D3DE'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(mx, my); g.quadraticCurveTo(mx + 8 * q, my + 14 * q, hb[0] + 2 * q, hb[1] - 50 * q); g.stroke(); return; }
    if (kind === 'hn') { var hh = handAt(P, 1); g.strokeStyle = '#D9A93A'; g.lineWidth = 3 * q; g.beginPath(); g.arc(hh[0] - 10 * q, hh[1] - 6 * q, 14 * q, 0, 7); g.stroke(); fillE(g, hh[0] + 6 * q, hh[1] - 2 * q, 9 * q, 9 * q, '#E9BE52'); fillE(g, hh[0] + 6 * q, hh[1] - 2 * q, 5 * q, 5 * q, '#B4892A'); }
  }
  function violin(g, P, big) {
    var s = P.s, q = s / 0.44 * (big || 1), cx = P.x - 24 * s, cy = bodyY(P, -300), L = handAt(P, 0), a = Math.atan2(L[1] - cy, L[0] - cx), d = Math.hypot(L[0] - cx, L[1] - cy);
    g.save(); g.translate(cx, cy); g.rotate(a);
    fillRR(g, 18 * q, -1.8 * q, d - 16 * q, 3.6 * q, 1.2, '#2A2E3E'); fillE(g, d + 2 * q, 0, 3.6 * q, 3 * q, '#8A4F2A');
    fillE(g, 9 * q, 0, 11 * q, 9.5 * q, '#B5652A'); fillE(g, 26 * q, 0, 8.5 * q, 7.5 * q, '#B5652A'); fillE(g, 17 * q, 0, 6 * q, 6 * q, '#B5652A'); fillE(g, 12 * q, -3 * q, 6 * q, 3 * q, 'rgba(255,255,255,.18)');
    fillRR(g, 6 * q, -1.4 * q, 26 * q, 2.8 * q, 1, '#2A2E3E'); fillRR(g, 12 * q, -4 * q, 1.4 * q, 8 * q, 0.6, '#F3E2C8');
    g.restore();
    var R = handAt(P, 1), bx = cx + Math.cos(a) * 12 * q, by = cy + Math.sin(a) * 12 * q, vx = bx - R[0], vy = by - R[1], vl = Math.hypot(vx, vy) || 1; vx /= vl; vy /= vl;
    g.strokeStyle = '#7A4A26'; g.lineWidth = 1.6 * q; g.beginPath(); g.moveTo(R[0] - vx * 4 * q, R[1] - vy * 4 * q); g.lineTo(R[0] + vx * 96 * q, R[1] + vy * 96 * q); g.stroke();
    g.strokeStyle = 'rgba(255,255,255,.85)'; g.lineWidth = 0.8 * q; g.beginPath(); g.moveTo(R[0] + vx * 2 * q + vy * 2 * q, R[1] + vy * 2 * q - vx * 2 * q); g.lineTo(R[0] + vx * 92 * q + vy * 2 * q, R[1] + vy * 92 * q - vx * 2 * q); g.stroke();
  }
  function miniStand(g, x, floor, s) {
    var q = s / 0.44; g.strokeStyle = '#3A3F55'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(x, floor); g.lineTo(x, floor - 100 * q); g.moveTo(x - 9 * q, floor); g.lineTo(x + 9 * q, floor); g.stroke();
    fillRR(g, x - 16 * q, floor - 128 * q, 32 * q, 26 * q, 2, '#2E3248'); fillRR(g, x - 14 * q, floor - 126 * q, 28 * q, 20 * q, 1, IVORY);
  }
  function extra(g, E, t, pl) {
    var P = E.P, k = E.kind, on = pl.cue === 'tutti' || (E.tier === 2 ? (pl.cue === 'purchase' || (k === 'hn' && pl.cue === 'crm')) : (pl.cue === 'sale' || pl.cue === 'stock')), sp = on ? 2.4 : 1, b = Math.sin(t * sp * Math.PI + P.ph);
    P.look = clamp((520 - P.x) / 260, -0.7, 0.7) * 0.6 + Math.sin(t * 0.4 + P.ph) * 0.15; P.mood = on ? 'happy' : 'calm'; P.tilt = Math.sin(t * sp * 0.5 + P.ph) * 0.05; P.talk = false;
    if (k === 'vn' || k === 'va') P.hands = [[-150, -300], [80 + b * 46, -282 + b * 18]];
    else if (k === 'fl') P.hands = [[50, -350], [130, -346 + Math.sin(t * 8 + P.ph) * (on ? 4 : 1)]];
    else if (k === 'cl') P.hands = [[-10, -290 + Math.sin(t * 7 + P.ph) * (on ? 5 : 1)], [14, -210]];
    else if (k === 'bs') P.hands = [[-50, -300], [-30, -220 + Math.sin(t * 6 + P.ph) * 3]];
    else P.hands = [[-40, -300], [60, -280]];
    K.person(g, P, t); instrument(g, P, k, t);
    miniStand(g, P.x + 46 * P.s / 0.44 * 0.9 * (E.tier === 1 && P.x < 520 ? 1 : 1), E.tier === 2 ? T2 : T1, P.s);
  }
  function paintLive(g, t, now, S) {
    var pl = play(t); S.play = pl; emitNotes(t, pl);
    scoreLive(g, t, S, pl); planLive(g, t, S); tourLive(g, t, S); libraryLive(g, t, S); marqueeLive(g, t, S);
    var e = S.ext;
    if (e.l < -420) { var d = new Date(Date.now() + 8 * 3600e3); K.clockHands(g, { x: -540, y: -112, r: 17 }, d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds()); text(g, 'Singapore', -540, -86, 6, 800, '#8A6A50', 'center');
      fillE(g, -960, -92, 4, 4, (t % 1.4) < 0.9 ? '#FF5A5A' : '#B94040'); }
    EXT.forEach(function (E) { if (E.tier === 2) extra(g, E, t, pl); });
    gongLive(g, t);
    EXT.forEach(function (E) { if (E.tier === 1) extra(g, E, t, pl); });
    if (e.l < -420) { var hp = HARP; hp.hands = [[-150, -300 + Math.sin(t * 5) * 8], [-120, -230 + Math.sin(t * 6 + 1) * 8]]; hp.mood = 'calm'; hp.look = -0.7 + Math.sin(t * 0.5) * 0.1; K.person(g, hp, t); }
    if (e.l < 0) wingLive(g, t, S);
    CO.crew(CREW, g, t, S, false);
  }

  /* ---------------- in front of the cast: instruments, held props, notes, the stalls ---------------- */
  function paintFrontLive(g, t, S) {
    var pl = S.play || play(t);
    /* the part on each stand lights when its section has the bar; the violinist turns her page */
    [[ST_S, 'sale', '#F08A24'], [ST_I, 'stock', '#2E9BD6']].forEach(function (s) { if (pl.cue === s[1] || pl.cue === 'tutti' || S.hot === 'focus') { g.strokeStyle = s[2]; g.lineWidth = 2; rr(g, s[0] - 33, F - 166, 66, 46, 3); g.stroke(); fillE(g, s[0] + 26, F - 160, 2.4, 2.4, (t % 0.5) < 0.3 ? '#FFFFFF' : s[2]); } });
    if (SAL.turn) { var tu = (t % 11) - 9.6, f = clamp(tu / 1.2, 0, 1); g.save(); g.translate(ST_S, F - 144); g.scale(Math.cos(f * Math.PI), 1); fillRR(g, 0, -20, 30, 40, 1, '#FFFFFF'); g.strokeStyle = 'rgba(27,31,59,.3)'; g.lineWidth = 0.5; g.beginPath(); for (var l = 0; l < 4; l++) { g.moveTo(3, -12 + l * 6); g.lineTo(26, -12 + l * 6); } g.stroke(); g.restore(); }
    /* the instruments in front of their players */
    violin(g, SAL);
    cello(g, INV, t);
    mallets(g, t);
    trumpet(g, t, S);
    baton(g, t);
    librarianProps(g, t);
    /* drum heads ripple where a mallet lands */
    DRUMS.forEach(function (x, i) { var u = t - HITS[i]; if (u < 0 || u > 0.6) return; g.strokeStyle = 'rgba(31,164,99,' + (0.8 * (1 - u / 0.6)).toFixed(2) + ')'; g.lineWidth = 1.6; g.beginPath(); g.ellipse(x, DRUM_Y, 8 + u * 50, 2 + u * 12, 0, 0, 7); g.stroke(); });
    if (TAP.acc && t - TAP.acc < 2.6 && t - TAP.acc > 0.7) { var a = Math.min(1, (t - TAP.acc - 0.7) * 3); g.save(); g.globalAlpha = a; fillRR(g, ACC.x - 44, DRUM_Y - 84, 88, 22, 11, '#1FA463'); text(g, 'Dr = Cr  ✓', ACC.x, DRUM_Y - 69, 10, 800, '#FFFFFF', 'center'); g.restore();
      DRUMS.forEach(function (x) { fillE(g, x, DRUM_Y - 1, DRUM_R - 4, 7.5, 'rgba(31,164,99,' + (0.35 * a).toFixed(2) + ')'); }); }
    /* floating notes from whoever has the bar */
    NOTES = NOTES.filter(function (n) { return t - n.t0 < 1.8; });
    NOTES.forEach(function (n) { var u = (t - n.t0) / 1.8; g.save(); g.globalAlpha = Math.min(1, (1 - u) * 1.6); noteGlyph(g, n.x + n.dx * u + Math.sin(u * 8 + n.x) * 6, n.y - u * 90, 4.4, n.c, n.two); g.restore(); });
    /* the stalls, first row: the backs of the client's managers' heads (the seat backs are cached in front of them) */
    if (S.ext.l < 100) deskLive(g, t, S);
    audience(g, t, S, 1);
    CO.crew(CREW, g, t, S, true);
  }
  var SEAT1 = [-756, -612, -468, -324, 252, 324, 396, 612, 684, 828, 900], SEAT2 = [212, 292, 452, 692, 852, 932];
  function audience(g, t, S, row) {
    var xs = row === 1 ? SEAT1 : SEAT2, yb = row === 1 ? 652 : 738, r = row === 1 ? 21 : 24, ap = t - APPL.t, clap = ap >= 0 && ap < 2.4;
    xs.forEach(function (x, i) { var sk = CR.skin[(i * 3 + row) % 5], hc = CR.hair[(i + row) % 4], bob = Math.sin(t * 1.3 + i * 1.7) * 1.5 + (clap ? Math.abs(Math.sin(ap * 9 + i)) * 4 : 0), turn = Math.sin(t * 0.35 + i * 2.1) > 0.86 ? 1 : 0, y = yb - r * 0.6 - bob;
      fillRR(g, x - r * 0.9, y + r * 0.5, r * 1.8, r * 1.4, r * 0.6, ['#3FA9E0', '#F2B233', '#14A38B', '#E0456B', '#7B5CD6', '#FFFFFF', '#F7B26B'][(i + row) % 7]);
      fillE(g, x - r * 0.96, y + 2, r * 0.16, r * 0.24, sk); fillE(g, x + r * 0.96, y + 2, r * 0.16, r * 0.24, sk);
      fillE(g, x, y, r, r * 0.96, sk); fillE(g, x + turn * r * 0.4, y - r * 0.08, r * 1.02, r * 0.98, hc);
      if (turn) { fillE(g, x - r * 0.62, y + r * 0.2, r * 0.36, r * 0.5, sk); fillE(g, x - r * 0.66, y + r * 0.1, 1.6, 1.6, INK); }
      if ((i + row) % 3 === 0) fillE(g, x, y - r * 0.9, r * 0.36, r * 0.3, hc);
      if (clap) { var c = Math.abs(Math.sin(ap * 14 + i)); fillE(g, x - 8 - c * 6, y - r - 6, 5, 5, sk); fillE(g, x + 8 + c * 6, y - r - 6, 5, 5, sk); } });
  }
  function seats2(g, ext) {
    for (var x = Math.floor((ext.l - 40) / 80) * 80 + 12; x < 980; x += 80) { fillRR(g, x - 35, 740, 70, 80, 15, PLUM); fillRR(g, x - 28, 746, 56, 11, 5, PLUM_L); g.strokeStyle = GOLD; g.lineWidth = 1.6; rr(g, x - 35, 740, 70, 80, 15); g.stroke(); }
  }
  function cello(g, P, t) {
    var sp = TAP.inv && t - TAP.inv < 1.1 ? (t - TAP.inv) / 1.1 : -1, ex = P.x - 2, ey = F - 2;
    g.save(); if (sp >= 0) { g.translate(ex, ey); g.scale(Math.cos(sp * Math.PI * 2), 1); g.translate(-ex, -ey); }
    g.save(); g.translate(ex, ey); g.rotate(-0.12);
    g.strokeStyle = '#9AA6BC'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, -14); g.stroke();
    var by = -58; fillE(g, 0, by + 18, 25, 23, '#A85A22'); fillE(g, 0, by - 22, 20, 19, '#A85A22'); fillE(g, 0, by - 2, 15, 12, '#A85A22'); fillE(g, -7, by + 8, 7, 14, 'rgba(255,255,255,.14)');
    g.fillStyle = '#2A2E3E'; g.fillRect(-6, by + 2, 1.6, 12); g.fillRect(4.4, by + 2, 1.6, 12); fillRR(g, -3, by - 96, 6, 88, 2, '#2A2E3E'); fillRR(g, -7, by + 12, 14, 2, 1, '#F3E2C8');
    g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 0.5; g.beginPath(); [-1.8, -0.6, 0.6, 1.8].forEach(function (dx) { g.moveTo(dx, by - 92); g.lineTo(dx * 2, by + 26); }); g.stroke();
    fillE(g, 0, by - 100, 5, 6, '#7A4A26'); fillE(g, 3, by - 104, 3, 3, '#7A4A26'); g.restore(); g.restore();
    if (sp >= 0) return;
    var R = handAt(P, 1); g.strokeStyle = '#7A4A26'; g.lineWidth = 1.8; g.beginPath(); g.moveTo(R[0] + 2, R[1]); g.lineTo(R[0] - 76, R[1] + 6); g.stroke(); g.strokeStyle = 'rgba(255,255,255,.85)'; g.lineWidth = 0.8; g.beginPath(); g.moveTo(R[0], R[1] + 2); g.lineTo(R[0] - 74, R[1] + 8); g.stroke();
  }
  function mallets(g, t) {
    [0, 1].forEach(function (i) { var h = handAt(ACC, i), d = i ? 1 : -1; g.strokeStyle = '#E9D9B8'; g.lineWidth = 2; g.lineCap = 'round'; g.beginPath(); g.moveTo(h[0], h[1]); g.lineTo(h[0] + d * 8, h[1] + 26); g.stroke(); fillE(g, h[0] + d * 9, h[1] + 29, 5, 5, '#FFFFFF'); fillE(g, h[0] + d * 8, h[1] + 28, 2, 2, '#E9E2D2'); });
  }
  function trumpet(g, t, S) {
    var P = TRP, s = P.s, q = s / 0.44, mx = P.x + P.look * 9 * s, my = bodyY(P, -346);
    if (P.play) { g.save(); g.translate(mx + 4, my); g.rotate(-0.12 - P.play * 0.1); fillRR(g, 0, -2, 50 * q, 4, 2, '#E3B341'); fillRR(g, 14 * q, -9, 26 * q, 6, 2, '#E3B341'); fillRR(g, 18 * q, -12, 3, 8, 1, '#B4892A'); fillRR(g, 26 * q, -12, 3, 8, 1, '#B4892A');
      g.fillStyle = '#E9BE52'; g.beginPath(); g.moveTo(48 * q, -3); g.lineTo(62 * q, -12); g.lineTo(62 * q, 12); g.lineTo(48 * q, 3); g.closePath(); g.fill(); fillE(g, 62 * q, 0, 2.4, 12, '#B4892A');
      if (TAP.crm && t - TAP.crm < 2.6) { var u = Math.min(1, (t - TAP.crm) * 2), fl = Math.sin(t * 10) * 2; g.fillStyle = '#FFFFFF'; g.beginPath(); g.moveTo(30 * q, 2); g.lineTo(30 * q + 70 * u, 4 + fl); g.lineTo(30 * q + 70 * u, 24 + fl); g.lineTo(30 * q, 22); g.closePath(); g.fill();
        g.strokeStyle = '#E0456B'; g.lineWidth = 1.2; g.stroke(); if (u > 0.8) text(g, 'Won → Quote', 30 * q + 35, 16 + fl * 0.5, 7, 800, '#E0456B', 'center'); }
      g.restore(); return; }
    var h = handAt(P, 1); g.save(); g.translate(h[0], h[1]); g.rotate(1.2); fillRR(g, -4, -2, 40 * q, 3.6, 1.5, '#E3B341'); g.fillStyle = '#E9BE52'; g.beginPath(); g.moveTo(36 * q, -2); g.lineTo(46 * q, -8); g.lineTo(46 * q, 10); g.lineTo(36 * q, 2); g.closePath(); g.fill(); g.restore();
    if (P.polish) { var hl = handAt(P, 0); fillRR(g, hl[0] - 5, hl[1] - 4, 10, 8, 2, '#FFFFFF'); }
  }
  function baton(g, t) {
    var h = handAt(TN, 1), sh = [TN.x + 76 * TN.s, bodyY(TN, -258)], a = Math.atan2(h[1] - sh[1], h[0] - sh[0]);
    if (TAP.tn && t - TAP.tn < 1.4) { var u = (t - TAP.tn) / 1.4, x = lerp(h[0] + 10, h[0], u), y = h[1] - Math.sin(u * Math.PI) * 110; g.save(); g.translate(x, y); g.rotate(t * 16); fillRR(g, -16, -1, 32, 2, 1, '#FFFFFF'); fillE(g, -16, 0, 3, 2.4, '#C9A27A'); g.restore(); return; }
    g.save(); g.translate(h[0], h[1]); g.rotate(a - 0.35); g.lineCap = 'round'; g.strokeStyle = '#3A2434'; g.lineWidth = 3.4; g.beginPath(); g.moveTo(0, 0); g.lineTo(42, 0); g.stroke(); g.strokeStyle = '#FFFFFF'; g.lineWidth = 2; g.beginPath(); g.moveTo(0, 0); g.lineTo(41, 0); g.stroke(); fillE(g, 1, 0, 4, 3, '#C9A27A'); g.restore();
  }
  function librarianProps(g, t) {
    var P = LIBR;
    if (P.crate) { var a = handAt(P, 0), b = handAt(P, 1), cx = (a[0] + b[0]) / 2, cy = Math.min(a[1], b[1]) - 8; fillRR(g, cx - 22, cy - 16, 44, 26, 3, '#C99A6B'); fillRR(g, cx - 22, cy - 16, 44, 6, 2, P.crate); fillRR(g, cx - 14, cy - 22, 28, 8, 1, IVORY); }
    if (P.tick) { var r = handAt(P, 1); g.strokeStyle = '#1B1F3B'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(r[0], r[1]); g.lineTo(r[0] + 6, r[1] - 14); g.stroke(); }
    if (TAP.lib && t - TAP.lib < 2.6 && t - TAP.lib > 1.2) { var u = Math.min(1, (t - TAP.lib - 1.2) * 4); g.save(); g.translate(P.x + 36, P.y - 250); g.rotate(-0.2); g.scale(2 - u, 2 - u); g.globalAlpha = u; g.strokeStyle = '#1FA463'; g.lineWidth = 2; rr(g, -38, -10, 76, 20, 4); g.stroke(); text(g, 'RECONCILED', 0, 4, 9, 800, '#1FA463', 'center'); g.restore(); }
  }

  /* ---------------- the cast: an idle loop and a tap choreography each ---------------- */
  function tapped(id, st, t) { if (st.wave && st.wave !== st._my) { st._my = st.wave; TAP[id] = t; return true; } return false; }
  function lookAt(P, st, t, S, base) { P.look = lerp(P.look, t < st.until ? clamp((S.nexi.x - P.x) / 160, -1, 1) : base, 0.08); }
  var castTN = { id: 'tn', behind: true, keys: ['score', 'plan'], P: TN, act: function (P, t, S) {
    var st = S.cast.tn; if (tapped('tn', st, t)) CR.burst('note', P.x, P.y - 250, t);
    var pl = S.play || play(t); P.tilt = 0; P.hop = 0;
    if (TAP.tn && t - TAP.tn < 2.8) { var u = (t - TAP.tn) / 2.8; P.talk = u > 0.5;
      if (u < 0.5) { P.mood = 'wow'; P.hands = [[-90, -300], [70, -440]]; P.look = 0.2; P.tilt = -0.06; }
      else if (u < 0.62) { P.mood = 'happy'; P.hands = [[-90, -300], [60, -420]]; if (!TAP.tnC) { TAP.tnC = true; CR.burst('star', P.x + 30, P.y - 280, t); } }
      else { var b = Math.sin((u - 0.62) / 0.38 * Math.PI); P.mood = 'happy'; P.hands = [[-50 - b * 30, -210 + b * 40], [50 + b * 30, -210 + b * 40]]; P.hop = -b * 16; P.tilt = b * 0.1; }
      return; }
    TAP.tnC = false;
    var tutti = pl.cue === 'tutti', bp = t * (tutti ? 2.4 : 1.7), bt = Math.floor(bp) % 4, f = bp % 1, e = 1 - Math.pow(1 - f, 2.4);
    var PTS = [[96, -366], [104, -246], [28, -282], [176, -284]], A = PTS[bt], B = PTS[(bt + 1) % 4];
    var rh = [lerp(A[0], B[0], e), lerp(A[1], B[1], e) - Math.sin(f * Math.PI) * (bt === 0 ? 0 : 12)];
    var cue = pl.cue, lh = cue === 'sale' ? [-176, -330] : cue === 'crm' ? [-40, -446] : tutti ? [-150, -420] : cue === 'purchase' ? [-96, -404] : [-86, -246 + Math.sin(t * 2) * 10];
    if (tutti) rh = [rh[0] + 30, rh[1] - 70];
    var shh = (t % 19) > 17.4 && !tutti; if (shh) lh = [-16, -374];
    P.hands = [lh, rh]; P.hop = bt === 0 ? (1 - f) * 5 : 0;
    P.talk = t < st.until || S.hot === 'score' || S.hot === 'plan'; P.mood = shh ? 'calm' : (P.talk || tutti ? 'happy' : 'calm');
    lookAt(P, st, t, S, cue === 'sale' ? -0.9 : cue === 'stock' ? 0.7 : cue === 'acc' ? 0.95 : cue === 'crm' ? 0.85 : 0.1);
  } };
  var castSAL = { id: 'sal', behind: true, keys: ['focus'], P: SAL, act: function (P, t, S) {
    var st = S.cast.sal; if (tapped('sal', st, t)) CR.burst('note', P.x - 20, P.y - 240, t);
    var pl = S.play || play(t), on = pl.cue === 'sale' || pl.cue === 'tutti'; P.tilt = 0; P.hop = 0; P.sitDrop = 46; P.turn = false;
    if (TAP.sal && t - TAP.sal < 2.6) { var u = (t - TAP.sal) / 2.6; P.mood = 'happy'; P.talk = true; P.sitDrop = 46 - Math.sin(Math.min(1, u * 1.6) * Math.PI / 2) * 30 * (u < 0.85 ? 1 : (1 - u) / 0.15);
      var z = Math.sin(t * 26); P.hands = [[-150, -300], [80 + z * 50, -282 + z * 20]]; P.tilt = Math.sin(t * 6) * 0.1;
      if (u > 0.45 && !TAP.salC) { TAP.salC = true; CR.burst('star', ST_S, F - 170, t); } return; }
    TAP.salC = false;
    var turn = (t % 11) > 9.6 && !on, sp = on ? 2.6 : 1.1, b = Math.sin(t * sp * Math.PI); P.turn = turn;
    P.hands = turn ? [[-150, -300], [150, -250]] : [[-150, -300 + Math.sin(t * 9) * (on ? 6 : 2)], [80 + b * 46, -282 + b * 18]];
    P.tilt = turn ? 0.05 : -0.05 + Math.sin(t * sp * 0.5) * 0.06;
    P.talk = t < st.until || S.hot === 'focus'; P.mood = on || P.talk ? 'happy' : 'calm';
    lookAt(P, st, t, S, turn ? 0.8 : on ? 0.5 : 0.7);
  } };
  var castINV = { id: 'inv', behind: true, keys: ['focus'], P: INV, act: function (P, t, S) {
    var st = S.cast.inv; if (tapped('inv', st, t)) {}
    var pl = S.play || play(t), on = pl.cue === 'stock' || pl.cue === 'tutti'; P.tilt = 0; P.hop = 0;
    if (TAP.inv && t - TAP.inv < 2.6) { var u = (t - TAP.inv) / 2.6; P.mood = u < 0.42 ? 'wow' : 'happy'; P.talk = u > 0.42; P.hands = u < 0.42 ? [[-60, -300], [70, -300]] : [[-27, -341], [90 + Math.sin(t * 18) * 30, -190]];
      if (u > 0.45 && !TAP.invC) { TAP.invC = true; CR.burst('star', P.x, P.y - 230, t); } return; }
    TAP.invC = false;
    var pizz = (t % 13) > 10.6 && !on, sp = on ? 1.4 : 0.55, b = Math.sin(t * sp * Math.PI);
    P.hands = pizz ? [[-27, -341], [10 + Math.abs(Math.sin(t * 7)) * 14, -200]] : [[-27, -341 + Math.sin(t * 5) * (on ? 8 : 3)], [70 + b * 56, -178]];
    P.tilt = -0.08 + Math.sin(t * sp * 0.7) * 0.05;
    P.talk = t < st.until || S.hot === 'focus'; P.mood = on || P.talk ? 'happy' : 'calm';
    lookAt(P, st, t, S, on ? -0.7 : -0.3);
  } };
  var castACC = { id: 'acc', behind: true, keys: ['focus'], P: ACC, act: function (P, t, S) {
    var st = S.cast.acc; tapped('acc', st, t);
    var pl = S.play || play(t), on = pl.cue === 'acc' || pl.cue === 'tutti'; P.tilt = 0; P.hop = 0;
    if (TAP.acc && t - TAP.acc < 2.6) { var u = (t - TAP.acc) / 2.6; P.talk = u > 0.3;
      if (u < 0.26) { P.mood = 'wow'; P.hands = [[-110, -400], [110, -400]]; P.hop = u * 20; }
      else { P.mood = 'happy'; P.hands = [[-100, -205], [100, -205]]; if (!TAP.accC) { TAP.accC = true; HITS[0] = HITS[1] = t; CR.burst('conf', P.x, DRUM_Y - 40, t); } P.hop = Math.max(0, Math.sin((u - 0.26) * 12)) * 6; }
      return; }
    TAP.accC = false;
    var tune = (t % 15) > 13 && !on;
    if (on) { var l = Math.max(0, Math.sin(t * 24)), r2 = Math.max(0, Math.sin(t * 24 + Math.PI)); P.hands = [[-100, -232 + l * 28], [100, -232 + r2 * 28]]; if (l > 0.98) HITS[0] = t; if (r2 > 0.98) HITS[1] = t; P.mood = 'happy'; }
    else if (tune) { P.hands = [[-96, -214 + Math.abs(Math.sin(t * 6)) * 6], [70, -230]]; P.tilt = 0.2; P.hop = -8; P.mood = 'calm'; }
    else { var bt = (t * 1.7) % 1; P.hands = [[-80, -226], [80, -226]]; P.tilt = bt < 0.2 ? 0.04 : 0; P.mood = 'calm'; }
    P.talk = t < st.until || S.hot === 'focus'; if (P.talk) P.mood = 'happy';
    lookAt(P, st, t, S, tune ? -0.9 : on ? -0.2 : -0.6);
  } };
  var castCRM = { id: 'crm', behind: true, keys: ['crm'], P: TRP, act: function (P, t, S) {
    var st = S.cast.crm; if (tapped('crm', st, t)) { FANF = t; CR.burst('conf', P.x + 30, P.y - 160, t); }
    var pl = S.play || play(t); P.tilt = 0; P.hop = 0; P.polish = false;
    var tapOn = TAP.crm && t - TAP.crm < 2.6, fan = tapOn || pl.cue === 'crm' || pl.cue === 'tutti' || t - FANF < 2 || S.hot === 'crm' || (t % 9) < 1.6;
    P.play = fan ? 1 : 0;
    if (fan) { P.hands = [[60, -360], [90, -366]]; P.mood = 'happy'; P.talk = false; P.tilt = -0.06 + Math.sin(t * 4) * 0.03; P.hop = tapOn ? Math.abs(Math.sin(t * 8)) * 8 : 0; P.look = 0.6; return; }
    if ((t % 9) > 5.5) { P.polish = true; var c = t * 6; P.hands = [[-20, -240], [40 + Math.cos(c) * 16, -240 + Math.sin(c) * 14]]; }
    else P.hands = [[-50, -200], [50, -200]];
    P.talk = t < st.until; P.mood = P.talk ? 'happy' : 'calm';
    lookAt(P, st, t, S, -0.5);
  } };
  var castLIB = { id: 'lib', behind: true, keys: ['migrate'], P: LIBR, act: function (P, t, S) {
    var st = S.cast.lib; if (tapped('lib', st, t)) { for (var i = 0; i < 9; i++) PAGES.push({ x: P.x, y: P.y - 230, t0: t + i * 0.05, vx: (Math.random() - 0.5) * 160, vy: -90 - Math.random() * 90, r: Math.random() * 6 }); }
    P.tilt = 0; P.hop = 0; P.crate = null; P.tick = false; P.hold = null;
    if (TAP.lib && t - TAP.lib < 2.6) { var u = (t - TAP.lib) / 2.6; P.mood = 'happy'; P.talk = true;
      if (u < 0.45) { P.hands = [[-130, -340], [130, -340]]; P.hop = Math.sin(u / 0.45 * Math.PI) * 10; } else { P.hold = 'clipboard'; P.hands = [[-70, -220], [60, -300 + Math.max(0, Math.sin((u - 0.45) * 20)) * 30]]; } return; }
    var c = (t + 3) % 12, busy = S.hot === 'migrate';
    if (c < 4) { P.crate = ['#F08A24', '#7B5CD6', '#2E9BD6', '#1FA463'][Math.floor((t + 3) / 12) % 4]; P.hands = [[-60, -230], [60, -230]]; P.x = 252 + Math.sin(c / 4 * Math.PI) * 8; P.look = lerp(P.look, -0.7, 0.06); }
    else if (c < 5.6) { var up = Math.sin((c - 4) / 1.6 * Math.PI); P.crate = c < 5 ? ['#F08A24', '#7B5CD6', '#2E9BD6', '#1FA463'][Math.floor((t + 3) / 12) % 4] : null; P.hands = [[-50, -230 - up * 190], [50, -230 - up * 190]]; P.look = -0.4; P.tilt = -0.06 * up; }
    else if (c < 10) { P.hold = 'clipboard'; P.tick = true; P.hands = [[-70, -214], [24 + Math.sin(t * 7) * 8, -236 + Math.abs(Math.sin(t * 3.5)) * 6]]; }
    else { P.hands = [[-70, -200], [22, -380]]; P.x = 252; }
    P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm';
    if (c >= 5.6) lookAt(P, st, t, S, c < 10 ? 0.3 : 0.6);
  } };

  /* ---------------- the left wing: a sectional rehearsal (training per team) and the production desk in the stalls ----------------
     Behind the title card (seen in full with "View the scene"): a TechNext trainer coaches one Sales user at a flip-chart,
     the sections' training sheets are pinned on the wall, a metronome ticks on a side table, and in the stalls a TechNext
     project lead runs the cut-over checklist from the production desk, headset on. Each has an idle loop and a tap move. */
  var TRN = W({ x: -292, y: 452, s: 0.44, ph: 6.2, skin: 3, hair: 0, style: 'short', outfit: 'polo', top: '#14A38B', hands: [[-150, -320], [70, -200]], look: -0.4 });
  var STU = W({ x: -176, y: 456, s: 0.42, ph: 6.9, skin: 1, hair: 1, style: 'pony', outfit: 'shirt', top: '#F08A24', sit: true, chairCol: '#4A4560', id: GREY_ID, hold: 'tablet', clip: '#FFD84A', hands: [[-40, -220], [60, -230]], look: -0.4 });
  var PM = W({ x: 46, y: 640, s: 0.42, ph: 7.7, skin: 0, hair: 2, style: 'long', outfit: 'shirt', top: '#5B7FD6', sit: true, chairCol: '#2A2E3E', headset: '#2A2E3E', hands: [[-150, -250], [-110, -240]], look: -0.6 });
  var EASEL = { x: -384, top: 300 }, MET = { x: -86, y: 455 }, DESK = { x0: -196, x1: -26, top: 598, F: 640 }, WTAP = {}, SHEETS = [['Quotation', '#F08A24'], ['Sales order', '#F08A24'], ['Delivery', '#2E9BD6'], ['Invoice', '#1FA463']];
  function sconce(g, x, y) { fillRR(g, x - 3, y - 4, 6, 18, 3, GOLD_D); g.strokeStyle = GOLD; g.lineWidth = 2.4; g.beginPath(); g.moveTo(x, y + 10); g.quadraticCurveTo(x + 16, y + 10, x + 16, y - 6); g.stroke();
    g.fillStyle = '#FFF7E0'; g.beginPath(); g.moveTo(x + 8, y - 6); g.lineTo(x + 24, y - 6); g.lineTo(x + 21, y - 22); g.lineTo(x + 11, y - 22); g.closePath(); g.fill(); fillRR(g, x + 7, y - 7, 18, 3, 1.5, GOLD); }
  function wingBack(g) {
    /* the sections' training sheets on a cork board, between the window and the wing curtain */
    var bx = -338, by = -92, bw = 196, bh = 130;
    shadowed(g, 10, 4, 0.2, function () { fillRR(g, bx - 6, by - 6, bw + 12, bh + 12, 6, WOOD_D); }); fillRR(g, bx - 3, by - 3, bw + 6, bh + 6, 4, WOOD); fillRR(g, bx, by, bw, bh, 3, '#D9B48A');
    for (var i = 0; i < 40; i++) fillE(g, bx + 6 + hash(i * 3.1) * (bw - 12), by + 6 + hash(i * 5.7) * (bh - 12), 1.4, 1.4, 'rgba(120,70,30,.16)');
    fillRR(g, bx + bw / 2 - 62, by - 15, 124, 20, 5, PLUM); text(g, 'SECTIONALS', bx + bw / 2, by - 1.5, 9, 800, GOLD_L, 'center');
    [['Sales', '#F08A24', -0.05], ['Inventory', '#2E9BD6', 0.04], ['Finance', '#1FA463', -0.03]].forEach(function (a, i) {
      var x = bx + 12 + i * 62, y = by + 14; g.save(); g.translate(x + 25, y + 40); g.rotate(a[2]); g.translate(-25, -40);
      shadowed(g, 4, 2, 0.18, function () { fillRR(g, 0, 0, 52, 80, 2, IVORY); }); fillRR(g, 0, 0, 52, 13, 2, a[1]); text(g, a[0], 26, 9.6, 7, 800, '#FFFFFF', 'center');
      text(g, 'team session', 26, 23, 5.2, 800, '#8A8FA6', 'center');
      for (var r = 0; r < 4; r++) { var ry = 32 + r * 11, done = r < 3 - i % 2; g.strokeStyle = 'rgba(27,31,59,.22)'; g.lineWidth = 1; g.beginPath(); g.moveTo(15, ry); g.lineTo(46, ry); g.stroke(); fillRR(g, 5, ry - 6, 7, 7, 1.5, done ? a[1] : '#E8E2D6');
        if (done) { g.strokeStyle = '#FFFFFF'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(6.5, ry - 2.5); g.lineTo(8.3, ry - 0.8); g.lineTo(11, ry - 5); g.stroke(); } }
      fillE(g, 26, 2, 3.4, 3.4, ['#E0456B', '#3167CA', '#FFD84A'][i]); g.restore(); });
    fillRR(g, bx + 8, by + bh - 18, bw - 16, 13, 6, '#FFFFFF'); text(g, 'we train each team on its own part', bx + bw / 2, by + bh - 8.8, 6.4, 800, PLUM, 'center');
    sconce(g, -110, -36); sconce(g, -578, -6);
    /* the flip-chart easel (its sheet is drawn live) */
    var ex = EASEL.x, et = EASEL.top; soft(g, ex, F - 14, 46, 6, 0.22);
    g.strokeStyle = WOOD_D; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.moveTo(ex - 34, F - 14); g.lineTo(ex - 8, et); g.moveTo(ex + 34, F - 14); g.lineTo(ex + 8, et); g.moveTo(ex, et + 10); g.lineTo(ex + 4, F - 10); g.stroke();
    fillRR(g, ex - 44, et + 10, 88, 6, 2, WOOD_D); fillRR(g, ex - 42, et + 86, 84, 6, 2, WOOD_D); fillRR(g, ex - 22, et + 88, 10, 4, 2, '#3167CA'); fillRR(g, ex - 8, et + 88, 10, 4, 2, '#E0456B');
    /* the metronome's side table */
    var mx = MET.x, my = MET.y; soft(g, mx, my + 2, 34, 5, 0.22); fillRR(g, mx - 30, my - 66, 60, 8, 3, WOOD_D); fillRR(g, mx - 26, my - 60, 4, 60, 2, WOOD_D); fillRR(g, mx + 22, my - 60, 4, 60, 2, WOOD_D); fillRR(g, mx - 24, my - 24, 48, 4, 2, WOOD);
    fillRR(g, mx - 24, my - 34, 22, 10, 2, '#E6D9F0'); fillRR(g, mx - 22, my - 40, 18, 6, 2, '#B9A6EE');
    g.fillStyle = '#5C3B2A'; g.beginPath(); g.moveTo(mx - 2, my - 66); g.lineTo(mx + 26, my - 66); g.lineTo(mx + 18, my - 116); g.lineTo(mx + 6, my - 116); g.closePath(); g.fill(); fillRR(g, mx + 6, my - 90, 12, 20, 2, IVORY);
  }
  function wingLive(g, t, S) {
    var u = (t + 1.5) % 8, pg = Math.floor((t + 1.5) / 8) % SHEETS.length, ex = EASEL.x, et = EASEL.top;
    /* the flip-chart: the current step of a quotation's journey, turned over every eight seconds */
    var flip = u > 3 && u < 3.8 ? (u - 3) / 0.8 : 0, ci = flip > 0.5 ? (pg + 1) % SHEETS.length : pg, cur = SHEETS[ci], nx = SHEETS[(ci + 1) % SHEETS.length];
    g.save(); g.translate(ex, et + 16); if (flip) g.scale(1, Math.max(0.05, Math.abs(Math.cos(flip * Math.PI))));
    fillRR(g, -40, 0, 80, 70, 2, '#FFFFFF'); g.strokeStyle = 'rgba(27,31,59,.12)'; g.lineWidth = 1; rr(g, -40, 0, 80, 70, 2); g.stroke();
    text(g, 'SALES · STEP ' + (ci + 1), 0, 12, 5.6, 800, '#8A8FA6', 'center'); fillRR(g, -30, 18, 60, 16, 4, cur[1]); text(g, cur[0], 0, 29, 7.6, 800, '#FFFFFF', 'center');
    g.strokeStyle = cur[1]; g.lineWidth = 2; g.beginPath(); g.moveTo(0, 38); g.lineTo(0, 48); g.moveTo(-4, 44); g.lineTo(0, 48); g.lineTo(4, 44); g.stroke();
    fillRR(g, -28, 52, 56, 12, 4, '#F3F4F8'); text(g, 'next: ' + nx[0], 0, 60.6, 5.4, 800, '#6B6F88', 'center'); g.restore();
    /* the metronome's pendulum */
    var mx = MET.x + 12, my = MET.y - 70, a = Math.sin(t * Math.PI * 1.6) * 0.42; g.strokeStyle = '#2A2E3E'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(mx, my); g.lineTo(mx + Math.sin(a) * 40, my - Math.cos(a) * 40); g.stroke(); fillRR(g, mx + Math.sin(a) * 26 - 3, my - Math.cos(a) * 26 - 3, 6, 6, 1, GOLD);
    /* the trainer: points at the step, turns the page, then explains it to the student; tap = a count-in, then a thumbs-up */
    var P = TRN, tu = WTAP.trn != null ? t - WTAP.trn : 99; P.hop = 0; P.tilt = 0;
    if (tu < 2.4) { P.mood = 'happy'; P.talk = true;
      if (tu < 1.6) { var bt = Math.abs(Math.sin(tu * Math.PI / 0.4)); P.hands = [[-90, -260], [96, -330 + bt * 80]]; P.hop = bt * 10; P.look = 0.5; }
      else { P.hands = [[-80, -200], [110, -380]]; P.look = 0.7; if (!WTAP.trnB) { WTAP.trnB = true; CR.burst('star', P.x + 50, P.y - 200, t); CR.burst('note', STU.x, STU.y - 200, t); WTAP.stu = t - 0.3; } } }
    else { WTAP.trnB = false;
      if (u < 3) { P.hands = [[-170, -300 + Math.sin(t * 3) * 10], [70, -200]]; P.look = -0.7; P.talk = u > 0.6; P.mood = 'calm'; }
      else if (u < 3.8) { P.hands = [[-150, -380 + (u - 3) * 120], [70, -200]]; P.look = -0.8; P.talk = false; P.tilt = -0.05; }
      else { var w = Math.sin(t * 4); P.hands = [[-70, -210], [120 + w * 20, -290 + Math.cos(t * 3) * 18]]; P.look = 0.6; P.talk = true; P.mood = (u > 6.6) ? 'happy' : 'calm'; P.tilt = 0.04; } }
    K.person(g, P, t);
    /* the student: scrolls the tablet, nods, asks one question per round; tap = lifts the tablet, the order is confirmed */
    var Q = STU, su = WTAP.stu != null ? t - WTAP.stu : 99; Q.hop = 0; Q.tilt = 0; Q.talk = false;
    if (su < 2.2) { Q.mood = su < 0.4 ? 'wow' : 'happy'; Q.hands = [[-60, -420], [60, -420]]; Q.talk = su > 0.6; Q.hop = Math.max(0, Math.sin(su * 6)) * 6;
      if (!WTAP.stuB && su > 0.3) { WTAP.stuB = true; CR.burst('conf', Q.x, Q.y - 230, t); } }
    else { WTAP.stuB = false;
      if (u > 5.2 && u < 6.4) { Q.hands = [[-40, -220], [70, -430]]; Q.mood = 'wow'; Q.look = -0.6; WTAP.askOn = Math.min(1, (u - 5.2) * 5) * Math.min(1, (6.4 - u) * 5); }
      else { Q.hands = [[-40, -220 + Math.sin(t * 1.1) * 4], [40 + Math.sin(t * 2.4) * 10, -228]]; Q.mood = 'calm'; Q.look = u < 3.8 ? -0.7 : -0.5; Q.tilt = Math.sin(t * 2) > 0.92 ? 0.06 : 0; } }
    K.person(g, Q, t);
    if (WTAP.askOn > 0 && su >= 2.2) { var qa = WTAP.askOn, qx = Q.x + 44, qy = Q.y - 262 - qa * 4; g.save(); g.globalAlpha = qa; fillRR(g, qx - 13, qy - 13, 26, 22, 9, '#FFFFFF'); g.fillStyle = '#FFFFFF'; g.beginPath(); g.moveTo(qx - 6, qy + 8); g.lineTo(qx - 12, qy + 15); g.lineTo(qx + 1, qy + 8); g.closePath(); g.fill(); text(g, '?', qx, qy + 4, 14, 800, PLUM, 'center'); g.restore(); }
    WTAP.askOn = 0;
    if (su > 0.5 && su < 2.6) { var al = Math.min(1, (su - 0.5) * 4) * Math.min(1, (2.6 - su) * 3), yy = Q.y - 296 - (su - 0.5) * 10; g.save(); g.globalAlpha = al; fillRR(g, Q.x - 48, yy, 96, 18, 9, '#1FA463'); text(g, 'Quotation → Order ✓', Q.x, yy + 12, 7.4, 800, '#FFFFFF', 'center'); g.restore(); }
  }
  function stallsDesk(g) {
    /* the production desk laid across the front of the stalls: a laptop beside the project lead, a lamp, the running order */
    var d = DESK; soft(g, (d.x0 + d.x1) / 2, d.F + 2, (d.x1 - d.x0) * 0.62, 7, 0.24);
    [d.x0 + 10, d.x1 - 10].forEach(function (lx) { fillRR(g, lx - 3, d.top + 6, 6, d.F - d.top - 6, 2, '#2A2E3E'); fillRR(g, lx - 8, d.F - 3, 16, 4, 2, '#2A2E3E'); });
    fillRR(g, d.x0, d.top, d.x1 - d.x0, 10, 3, '#3A3F55'); fillRR(g, d.x0 + 4, d.top + 10, d.x1 - d.x0 - 8, 20, 2, PLUM); text(g, 'PRODUCTION DESK · TechNext', (d.x0 + d.x1) / 2, d.top + 23.4, 6.4, 800, GOLD_L, 'center');
    g.strokeStyle = '#2A2E3E'; g.lineWidth = 2.4; g.beginPath(); g.moveTo(d.x0 + 26, d.top); g.lineTo(d.x0 + 30, d.top - 34); g.lineTo(d.x0 + 52, d.top - 46); g.stroke(); fillRR(g, d.x0 + 18, d.top - 3, 18, 4, 2, '#2A2E3E');
    g.fillStyle = '#2E9B6F'; g.beginPath(); g.moveTo(d.x0 + 44, d.top - 52); g.lineTo(d.x0 + 64, d.top - 42); g.lineTo(d.x0 + 58, d.top - 34); g.lineTo(d.x0 + 40, d.top - 44); g.closePath(); g.fill();
    g.save(); g.translate(d.x0 + 70, d.top - 2); g.rotate(-0.06); fillRR(g, 0, -6, 34, 7, 1, IVORY); g.restore(); fillRR(g, d.x0 + 108, d.top - 12, 10, 12, 2, '#FFFFFF'); fillRR(g, d.x0 + 108, d.top - 12, 10, 3, 1, '#B5652A');
    fillRR(g, d.x1 - 58, d.top - 4, 50, 5, 2, '#C9D3E3'); fillRR(g, d.x1 - 54, d.top - 40, 42, 36, 3, '#2A2E3E');
  }
  function deskLive(g, t, S) {
    var d = DESK, sx = d.x1 - 51, sy = d.top - 37, n = Math.floor(t / 1.6) % 6;
    fillRR(g, sx, sy, 36, 30, 1.5, '#FFFFFF'); fillRR(g, sx, sy, 36, 6, 1.5, PLUM); text(g, 'Cut-over', sx + 2, sy + 4.8, 3.8, 800, '#FFFFFF');
    for (var r = 0; r < 4; r++) { var ok = r < Math.min(4, n); fillRR(g, sx + 2, sy + 9 + r * 5, 3.4, 3.4, 0.8, ok ? '#1FA463' : '#D6DAE6'); fillRR(g, sx + 7, sy + 10 + r * 5, 18 + (r % 2) * 7, 1.6, 0.8, '#B8BFD2'); }
    /* the project lead: types, presses the talkback, sips her coffee; tap = stamps the checklist and pumps a fist */
    var P = PM, pu = WTAP.pm != null ? t - WTAP.pm : 99, c = (t + 2) % 10; P.hop = 0; P.tilt = 0;
    if (pu < 2.2) { P.mood = 'happy'; P.talk = pu > 0.8; P.look = 0.1;
      if (pu < 0.7) P.hands = [[-170, -360 + Math.abs(Math.sin(pu * 9)) * 60], [-110, -240]];
      else { P.hands = [[-150, -250], [96, -380 - Math.abs(Math.sin(pu * 10)) * 26]]; P.hop = Math.abs(Math.sin(pu * 8)) * 5; if (!WTAP.pmB) { WTAP.pmB = true; CR.burst('star', P.x, P.y - 220, t); } } }
    else { WTAP.pmB = false;
      if (c < 5.5) { var k1 = Math.abs(Math.sin(t * 13)), k2 = Math.abs(Math.sin(t * 13 + 1.4)); P.hands = [[-170, -236 + k1 * 8], [-118, -230 + k2 * 8]]; P.look = -0.7; P.talk = false; P.mood = 'calm'; }
      else if (c < 7.5) { P.hands = [[-150, -240], [70, -400]]; P.look = 0.3; P.talk = true; P.mood = 'happy'; }
      else { P.hands = [[-150, -240], [10, -340 + Math.sin((c - 7.5) * 2.5) * 10]]; P.look = 0.1; P.talk = false; P.mood = 'calm'; P.tilt = -0.05; } }
    K.person(g, P, t);
    if (pu < 2.2 && pu > 0.6) { var al = Math.min(1, (pu - 0.6) * 4); g.save(); g.globalAlpha = al; fillRR(g, d.x1 - 60, d.top - 64, 56, 16, 8, '#1FA463'); text(g, 'Checked ✓', d.x1 - 32, d.top - 53, 7, 800, '#FFFFFF', 'center'); g.restore(); }
    if (pu >= 2.2 && c >= 7.5) { var h = handAt(P, 1); fillRR(g, h[0] - 4, h[1] - 6, 9, 11, 2, '#FFFFFF'); fillRR(g, h[0] - 4, h[1] - 6, 9, 3, 1, '#B5652A'); }
  }

  window.IXW.worlds['sol-erp'] = {
    calmView: [180,-160,820,656], /* CALM: the framed part of the set */
    pan: [-280, 1240],
    paintBg: paintBg, windowBehind: true, paintFrame: paintFrame, paintBack: paintBack, paintFront: paintFront, paintFore: paintFore,
    paintWindow: paintWindow, paintLive: paintLive, paintFrontLive: paintFrontLive,
    paintForeLive: function (g, t, S) {
      audience(g, t, S, 2); seats2(g, S.ext);
      K.zfore(g, t, S, [], function () { CO.crew(CREW, g, t, S, 'fore'); });
      PAGES = PAGES.filter(function (p) { return t - p.t0 < 1.6; }); PAGES.forEach(function (p) { var u = t - p.t0; if (u < 0) return; g.save(); g.globalAlpha = Math.max(0, 1 - u / 1.6); g.translate(p.x + p.vx * u, p.y + p.vy * u + 120 * u * u); g.rotate(u * 5 + p.r); fillRR(g, -7, -9, 14, 18, 1, '#FFFFFF'); g.fillStyle = 'rgba(27,31,59,.3)'; g.fillRect(-5, -5, 10, 1); g.fillRect(-5, -1, 10, 1); g.fillRect(-5, 3, 7, 1); g.restore(); });
      CR.draw(g, t);
    },
    moteCol: 'rgba(255,236,190,.8)',
    glow: {
      score: function (g) { rr(g, SC.x - 14, SC.y - 14, SC.w + 28, SC.h + 28, 14); },
      plan: function (g) { rr(g, PL.x - 13, PL.y - 13, PL.w + 26, PL.h + 30, 12); },
      enterprise: function (g) { rr(g, TOUR.x - 10, TOUR.y - 10, TOUR.w + 20, TOUR.h + 20, 10); },
      migrate: function (g) { rr(g, LIB.x - 12, LIB.y - 42, LIB.w + 24, 258, 12); },
      crm: function (g) { rr(g, BAL.x - 12, BAL.top - 20, BAL.w + 24, BAL.floor - BAL.top + 36, 14); },
      golive: function (g) { rr(g, MQ.x - 10, MQ.y - 10, MQ.w + 20, MQ.h + 20, 12); },
      focus: function (g) { g.beginPath(); [ST_S, ST_I].forEach(function (x) { if (g.roundRect) g.roundRect(x - 42, F - 176, 84, 64, 10); else g.rect(x - 42, F - 176, 84, 64); }); g.moveTo(DRUMS[1] + DRUM_R + 14, DRUM_Y + 4); g.ellipse((DRUMS[0] + DRUMS[1]) / 2, DRUM_Y + 4, (DRUMS[1] - DRUMS[0]) / 2 + DRUM_R + 14, 24, 0, 0, Math.PI * 2); },
      gong: function (g) { g.beginPath(); g.arc(GONG.x, GONG.y, GONG.r + 12, 0, Math.PI * 2); }
    },
    backGlow: ['score', 'plan', 'enterprise', 'migrate', 'crm', 'golive', 'gong'],
    cast: [castLIB, castSAL, castINV, castACC, castCRM, castTN],
    toy: function (name, S, t) { if (name === 'gong') { GONGT = t; TUTTI.t = t; CR.burst('conf', GONG.x, GONG.y - 30, t); CR.burst('note', SAL.x, 300, t); CR.burst('note', INV.x, 300, t); CR.burst('note', TRP.x, 60, t); } },
    hit: function (x, y, S, t, onBtn) {
      var w = CR.hitWalker(x, y, t); if (w) return w; if (onBtn) return null;
      if (Math.abs(x - TRN.x) < 46 && y > 230 && y < 470) { WTAP.trn = t; return { say: 'A **sectional**: we train each team on its own part of Odoo before go-live.', near: [300, 60], pose: 'clap', who: 'TechNext trainer' }; }
      if (Math.abs(x - STU.x) < 46 && y > 280 && y < 470) { WTAP.stu = t; return { say: 'Quotation, order, delivery, invoice: the Sales team learns **its own steps** first.', near: [300, 60], pose: 'celebrate', who: 'Sales team member' }; }
      if (Math.abs(x - EASEL.x) < 46 && y > 290 && y < 470) return { say: 'One step per page: **the same flow** the team will run on day one.', near: [300, 60], pose: 'point-left', who: 'The flip-chart' };
      if (x > -340 && x < -140 && y > -110 && y < 50) return { say: 'Every team gets **its own sessions**: Sales, Inventory and Finance each rehearse their part.', near: [300, 40], pose: 'point-left', who: 'The sectionals board' };
      if ((Math.abs(x - PM.x) < 44 && y > 440 && y < 645) || (x > DESK.x0 && x < DESK.x1 && y > DESK.top - 50 && y < DESK.F)) { WTAP.pm = t; return { say: 'The **cut-over checklist**, run from the production desk: every item ticked before go-live.', near: [320, 80], pose: 'clap', who: 'TechNext project lead' }; }
      if (y > 600 && y < 760 && x > -800 && x < 975) { APPL.t = t; return { say: 'The client\'s managers, front row at rehearsal. At go-live they read **one set of reports**, straight from the ledger.', near: [clamp(x, 320, 860), 110], pose: 'clap', who: 'The front row' }; }
      if (y > T2 - 100 && y < T1 && x > 340 && x < 740) return { say: 'Every user in a section reads **the same score**: one database, no copies to reconcile.', near: [clamp(x + 150, 420, 860), 10], pose: 'love', who: 'The orchestra' };
      if (x > 1060 && x < 1320 && y > 280 && y < 470) return { say: 'The grand piano is tuned **after** opening night too: that\'s the support plan.', near: [860, 40], pose: 'wow', who: 'The piano' };
      if (x < -420 && y > 240 && y < 470) return { say: 'The harp keeps time with the **same score** as everyone else.', near: [300, 60], pose: 'love', who: 'The harpist' };
      return null;
    },
    onStop: function (key, S, t) { if (key === 'score') PLAY0 = t - 0.2; if (key === 'focus') PLAY0 = t - RUN * 0.2; if (key === 'crm') FANF = t + 0.4; if (key === 'golive') CR.burst('star', MQ.x + MQ.w / 2, MQ.y, t + 0.5); }
  };
})(window.IXW && window.IXW.kit, window.CR, window.CO);
