/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: team (/employee-hub) — the TechNext ID station on a bright morning, where every employee's blue TechNext ID is
   photographed, printed, laminated and handed out. The lanyard rack (one ID per person on this page, swinging; a tap on
   the rack's shuffle toy sets them all swaying), the photo booth corner (curtain, ring light, a stool, the photographer
   and a colleague posing), the ID printer and laminator on their counter (a card slides from one to the other, the
   laminator's slot glows), and the badge-reader gate (a colleague taps in, the reader turns green, the flaps open). Over
   the gate, the office map that every card back carries. Margins: an ID design board on the left, the lanyard
   spool and a colleague clipping on her ID on the right. Foreground: a card cutter cart, boxes of blank cards, plants.
   Everyone has their own idle loop and tap choreography; all of them wear the blue TechNext ID. */
(function (K, CR, CO, COL) {
  'use strict';
  if (!K || !CR || !CO || !COL) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed;
  var F = 470, NAVY = '#1B2350', RIM = '#1E2F5C', BLUE = '#3167CA', BLUE2 = '#4A80E2', Y = '#FFD84A', TEAL = '#14A38B', SLATE = '#2A3550', CORAL = '#F08A6C', GREEN = '#2BC48A';
  var bell = COL.bell, ease = COL.ease;
  var T = { rack: { x: 150, y: 14, w: 250, h: 262 }, booth: { x: 410, w: 130 }, counter: { x: 590, y: 380, w: 180 }, printer: { x: 604 }, lam: { x: 692 }, gate: { x: 800 }, map: { x: 800, y: 50, w: 190, h: 104 },
    board: { x: -760 }, spool: { x: 1050 } };
  function setU(g, sx, sy, k) { g.translate(sx, sy); g.scale(k, k); }
  function extOf(W, H, k, sx, sy) { return { l: -(sx + 24) / k, r: (W - sx) / k, t: -(sy + 24) / k, b: (H - sy) / k }; }
  /* the people on this page's ID cards (initials), read from the cards themselves */
  var PEOPLE = null;
  function people() { if (PEOPLE) return PEOPLE; var out = [];
    [].forEach.call(document.querySelectorAll('[data-bc-name]'), function (el) { var n = el.getAttribute('data-bc-name') || ''; out.push({ n: n, i: n.split(/\s+/).filter(Boolean).map(function (w) { return w[0]; }).join('').slice(0, 2).toUpperCase() }); });
    if (!out.length) return [{ n: 'TechNext', i: 'TN' }]; PEOPLE = out; return out; }
  function short(s, n) { s = s || ''; return s.length > n ? s.slice(0, n - 1) + '…' : s; }
  /* a TechNext ID card, in the cast's style: navy rim, white face, blue header with the plane, photo, lines, blue strip.
     Drawn with its top centre at 0,0, w wide (height 1.4 w) */
  function idCard(g, w, ini, name, col) { var h = w * 1.4, c = col || BLUE;
    fillRR(g, -w / 2 - 2, -2, w + 4, h + 4, w * 0.12, RIM); fillRR(g, -w / 2, 0, w, h, w * 0.1, '#FFFFFF'); fillRR(g, -w / 2, 0, w, h * 0.22, w * 0.1, c); g.fillStyle = c; g.fillRect(-w / 2, h * 0.12, w, h * 0.1);
    CO.plane(g, -w * 0.22, h * 0.11, w * 0.022, 0, '#FFFFFF', c); if (w > 30) text(g, 'TechNext', -w * 0.08, h * 0.14, w * 0.13, 800, '#FFFFFF');
    fillRR(g, -w * 0.24, h * 0.3, w * 0.48, w * 0.52, w * 0.06, '#C9D6EE'); if (ini && w > 22) text(g, ini, 0, h * 0.3 + w * 0.34, w * 0.2, 800, BLUE, 'center');
    if (name && w > 40) text(g, name, 0, h * 0.74, w * 0.1, 800, NAVY, 'center'); else fillRR(g, -w * 0.3, h * 0.7, w * 0.6, h * 0.04, 2, NAVY);
    fillRR(g, -w * 0.22, h * 0.78, w * 0.44, h * 0.03, 2, '#AAB7CC');
    g.fillStyle = NAVY; for (var b = 0; b < 14; b++) if (hash(b * 3.3) > 0.35) g.fillRect(-w * 0.32 + b * w * 0.046, h * 0.85, w * (hash(b) > 0.6 ? 0.03 : 0.015), h * 0.08);
  }
  function strap(g, x0, y0, x1, y1, col) { g.strokeStyle = col || BLUE; g.lineWidth = 3; g.lineCap = 'round'; g.beginPath(); g.moveTo(x0 - 5, y0); g.quadraticCurveTo(x1 - 5, (y0 + y1) / 2, x1 - 2, y1); g.moveTo(x0 + 5, y0); g.quadraticCurveTo(x1 + 5, (y0 + y1) / 2, x1 + 2, y1); g.stroke(); fillRR(g, x1 - 4, y1 - 2, 8, 6, 2, '#B9C3D1'); }

  /* ------------------------------------------------------------ the room (cached) */
  function paintBg(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    var wg = g.createLinearGradient(0, e.t, 0, F); wg.addColorStop(0, '#F6F8FD'); wg.addColorStop(1, '#E6ECF6'); g.fillStyle = wg; g.fillRect(e.l, e.t, e.r - e.l, F - e.t);
    g.fillStyle = '#FFFFFF'; g.fillRect(e.l, e.t, e.r - e.l, -110 - e.t);
    for (var sk = Math.floor(e.l / 200) * 200; sk < e.r; sk += 200) { var sg = g.createLinearGradient(0, -160, 0, -120); sg.addColorStop(0, '#BFE0F7'); sg.addColorStop(1, '#E8F4FD'); fillRR(g, sk + 30, -160, 140, 36, 4, sg); }
    g.fillStyle = 'rgba(30,60,110,.08)'; g.fillRect(e.l, -112, e.r - e.l, 4);
    /* wallpaper: a faint pattern of little ID cards */
    g.fillStyle = 'rgba(49,103,202,.06)'; for (var dy = -96; dy < 290; dy += 30) for (var dx = Math.floor(e.l / 26) * 26 + ((dy / 30) % 2 ? 13 : 0); dx < e.r; dx += 26) { g.fillRect(dx, dy, 8, 11); }
    g.fillStyle = '#DCE6F6'; g.fillRect(e.l, 300, e.r - e.l, F - 300); g.fillStyle = BLUE; g.fillRect(e.l, 296, e.r - e.l, 5); g.fillStyle = 'rgba(49,103,202,.12)'; for (var p = Math.floor(e.l / 60) * 60; p < e.r; p += 60) g.fillRect(p, 301, 2, F - 301);
    var fl = g.createLinearGradient(0, F, 0, e.b); fl.addColorStop(0, '#E4E8F0'); fl.addColorStop(1, '#CDD4E2'); g.fillStyle = fl; g.fillRect(e.l, F, e.r - e.l, e.b - F);
    g.fillStyle = 'rgba(27,35,80,.10)'; g.fillRect(e.l, F, e.r - e.l, 5);
    /* the queue lane to the gate: blue floor tape with arrows */
    g.fillStyle = 'rgba(49,103,202,.16)'; g.fillRect(e.l, 610, e.r - e.l, 58);
    g.fillStyle = 'rgba(255,255,255,.65)'; for (var st = Math.floor(e.l / 90) * 90; st < e.r; st += 90) { g.beginPath(); g.moveTo(st, 628); g.lineTo(st + 26, 639); g.lineTo(st, 650); g.closePath(); g.fill(); }
    [[640, F + 60, 320], [-300, F + 50, 220], [1150, F + 50, 220]].forEach(function (pp) { g.save(); g.globalAlpha = 0.45; fillE(g, pp[0], pp[1], pp[2], 28, '#FFFFFF'); g.restore(); });
    g.restore();
  }
  function paintBack(g, ext) {
    /* the lanyard rack: an oak board with a rail of hooks (the IDs are live) */
    var r = T.rack; shadowed(g, 14, 6, 0.2, function () { fillRR(g, r.x, r.y, r.w, r.h, 10, '#F3E2C6'); }); g.strokeStyle = '#D9B48A'; g.lineWidth = 6; rr(g, r.x, r.y, r.w, r.h, 10); g.stroke();
    fillRR(g, r.x + r.w / 2 - 80, r.y - 14, 160, 28, 14, NAVY); text(g, 'THE LANYARD RACK', r.x + r.w / 2, r.y + 4, 9.6, 800, Y, 'center');
    fillRR(g, r.x + 14, r.y + 30, r.w - 28, 9, 4, '#9AA6BC'); for (var hk = 0; hk < 4; hk++) fillE(g, r.x + 44 + hk * 54, r.y + 40, 3, 3, '#5C6B7A');
    text(g, 'One ID per person', r.x + r.w / 2, r.y + r.h - 12, 8, 800, '#8E6A47', 'center');
    /* the photo booth corner: a frame, a backdrop, a curtain, the ring light stand and a stool */
    var b = T.booth; soft(g, b.x + b.w / 2, F + 4, 90, 9, 0.25);
    fillRR(g, b.x, 70, b.w, F - 70, 6, '#E8EFFC'); g.fillStyle = 'rgba(49,103,202,.1)'; for (var bd = 0; bd < 8; bd++) g.fillRect(b.x + 8 + bd * 18, 90, 2, F - 100);
    fillRR(g, b.x - 6, 62, b.w + 12, 16, 5, NAVY); text(g, 'ID PHOTO BOOTH', b.x + b.w / 2, 73.5, 8, 800, Y, 'center');
    g.fillStyle = CORAL; g.beginPath(); g.moveTo(b.x, 78); g.lineTo(b.x + 34, 78); g.quadraticCurveTo(b.x + 22, 260, b.x + 30, F); g.lineTo(b.x, F); g.closePath(); g.fill();
    g.fillStyle = 'rgba(255,255,255,.18)'; for (var cf = 0; cf < 3; cf++) g.fillRect(b.x + 6 + cf * 9, 80, 3, F - 84);
    fillRR(g, b.x + 70, 404, 40, 8, 4, '#5C6B7A'); fillRR(g, b.x + 86, 412, 8, F - 414, 3, '#7A869C'); fillE(g, b.x + 90, F - 2, 18, 4, '#5C6B7A');
    g.strokeStyle = '#7A869C'; g.lineWidth = 3; g.beginPath(); g.moveTo(b.x + b.w - 14, 210); g.lineTo(b.x + b.w - 14, F); g.stroke();
    /* the badge-reader gate: two cabinets, a glass flap, a reader on a post */
    var gt = T.gate.x; soft(g, gt + 70, F + 4, 100, 9, 0.28);
    [gt, gt + 116].forEach(function (cx) { fillRR(g, cx, 380, 30, F - 380, 6, '#DCE3EE'); fillRR(g, cx, 380, 30, 8, 4, '#9AA6BC'); fillRR(g, cx + 6, 396, 18, 44, 3, '#C9D2DE'); });
    fillRR(g, gt + 40, 300, 10, 80, 3, '#7A869C'); fillRR(g, gt + 30, 286, 30, 22, 5, SLATE);
    fillRR(g, gt + 4, 300, 138, 18, 9, NAVY); text(g, 'TAP YOUR TECHNEXT ID', gt + 73, 312, 7, 800, Y, 'center');
    /* the office map over the gate */
    var m = T.map; shadowed(g, 10, 4, 0.18, function () { fillRR(g, m.x, m.y, m.w, m.h, 8, '#FFFFFF'); }); fillRR(g, m.x, m.y, m.w, 20, 8, NAVY); g.fillRect(m.x, m.y + 12, m.w, 8); text(g, 'ON EVERY ID CARD BACK', m.x + m.w / 2, m.y + 14, 7.2, 800, Y, 'center');
    g.fillStyle = '#E3ECF8'; g.beginPath(); g.ellipse(m.x + 60, m.y + 62, 44, 26, 0.3, 0, 7); g.fill(); g.beginPath(); g.ellipse(m.x + 134, m.y + 54, 38, 22, -0.2, 0, 7); g.fill();
    g.strokeStyle = 'rgba(49,103,202,.5)'; g.lineWidth = 1.5; g.setLineDash([3, 3]); g.beginPath(); g.moveTo(m.x + 62, m.y + 52); g.lineTo(m.x + 126, m.y + 48); g.lineTo(m.x + 100, m.y + 86); g.closePath(); g.stroke(); g.setLineDash([]);
    /* the room sign and a wall clock */
    shadowed(g, 12, 5, 0.2, function () { fillRR(g, 560, -82, 210, 50, 25, '#FFFFFF'); }); g.lineWidth = 3; g.strokeStyle = BLUE; rr(g, 566, -76, 198, 38, 19); g.stroke();
    CO.plane(g, 592, -57, 1.3, 0, BLUE); text(g, 'ID STATION', 612, -51, 17, 800, NAVY); g.strokeStyle = '#9AA6BC'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(590, -110); g.lineTo(590, -82); g.moveTo(740, -110); g.lineTo(740, -82); g.stroke();
    K.plant(g, { x: 136, y: F }, '#FFFFFF', '#E3E9F3'); K.plant(g, { x: 1012, y: F }, BLUE, BLUE2);
    /* ---- left margin: the ID design board ---- */
    var db = T.board.x; if (ext.l < db + 360) {
      shadowed(g, 12, 5, 0.18, function () { fillRR(g, db, 40, 320, 230, 8, '#FFFFFF'); }); fillRR(g, db, 40, 320, 26, 8, TEAL); g.fillRect(db, 56, 320, 10); text(g, 'ID DESIGN · FRONT AND BACK', db + 160, 58, 9, 800, '#FFFFFF', 'center');
      for (var mi = 0; mi < 5; mi++) { g.save(); g.translate(db + 40 + mi * 60, 84); g.rotate((hash(mi + 3) - 0.5) * 0.16); idCard(g, 40, '', '', mi % 2 ? TEAL : BLUE); g.restore(); fillE(g, db + 40 + mi * 60, 82, 3, 3, '#E2453C'); }
      soft(g, db + 160, F + 4, 120, 8, 0.25); fillRR(g, db + 40, 330, 240, 14, 5, '#D9B48A'); fillRR(g, db + 56, 344, 10, F - 344, 3, '#B98E62'); fillRR(g, db + 254, 344, 10, F - 344, 3, '#B98E62');
      for (var bx = 0; bx < 3; bx++) fillRR(g, db + 70 + bx * 62, 300, 54, 30, 4, ['#E8EFFC', '#FFF4C8', '#E2F5F0'][bx]); }
    /* ---- right margin: the lanyard spool ---- */
    var sp = T.spool.x; if (ext.r > sp - 30) {
      shadowed(g, 12, 5, 0.18, function () { fillRR(g, sp, 60, 200, 230, 10, '#FFFFFF'); }); fillRR(g, sp, 60, 200, 28, 10, BLUE); g.fillRect(sp, 76, 200, 12); text(g, 'LANYARDS', sp + 100, 79, 10, 800, '#FFFFFF', 'center');
      [[60, BLUE], [120, NAVY], [170, TEAL]].forEach(function (s2) { fillE(g, sp + s2[0], 160, 26, 26, s2[1]); fillE(g, sp + s2[0], 160, 9, 9, '#FFFFFF'); g.strokeStyle = s2[1]; g.lineWidth = 6; g.beginPath(); g.moveTo(sp + s2[0] + 20, 176); g.quadraticCurveTo(sp + s2[0] + 10, 230, sp + s2[0] - 6, 270); g.stroke(); });
      text(g, 'Everyone wears one', sp + 100, 280, 8, 800, '#5C6B7A', 'center'); }
  }
  function paintFront(g, ext) {
    /* the printer counter */
    var c = T.counter; soft(g, c.x + c.w / 2, F + 4, 110, 10, 0.3); fillRR(g, c.x - 6, c.y - 6, c.w + 12, 12, 4, '#FFFFFF'); fillRR(g, c.x, c.y + 4, c.w, F - c.y - 4, 4, SLATE);
    CO.plane(g, c.x + 24, c.y + 40, 1.2, 0, '#FFFFFF', SLATE); text(g, 'PRINT · LAMINATE · WEAR', c.x + 40, c.y + 45, 8.6, 800, '#FFFFFF'); fillRR(g, c.x, c.y + 70, c.w, 4, 0, Y);
    /* the ID printer and laminator, on the counter in front of the operator */
    var pr = T.printer.x; shadowed(g, 10, 4, 0.22, function () { fillRR(g, pr, 300, 78, 76, 10, '#FFFFFF'); }); fillRR(g, pr, 300, 78, 18, 10, BLUE); g.fillRect(pr, 310, 78, 8);
    CO.plane(g, pr + 12, 309, 0.6, 0, '#FFFFFF', BLUE); text(g, 'ID PRINTER', pr + 22, 312, 6.8, 800, '#FFFFFF'); fillRR(g, pr + 8, 326, 40, 26, 4, '#0F1426'); fillRR(g, pr + 10, 360, 58, 6, 3, '#2A3142');
    fillRR(g, pr + 56, 326, 14, 8, 4, '#C9D2DE');
    var lm = T.lam.x; shadowed(g, 10, 4, 0.22, function () { fillRR(g, lm, 330, 74, 46, 10, '#2A3550'); }); fillRR(g, lm + 6, 336, 62, 6, 3, '#3A4458'); fillRR(g, lm + 10, 356, 54, 5, 2.5, '#0F1426');
    text(g, 'LAMINATOR', lm + 37, 372, 6.4, 800, 'rgba(255,255,255,.75)', 'center');
    /* the gate's glass flaps (live) sit between the cabinets; the stool's seat */
    var b = T.booth; fillRR(g, b.x + 68, 400, 44, 8, 4, '#7A869C');
  }
  function paintFore(g, ext) {
    soft(g, 330, 724, 90, 9, 0.3); fillRR(g, 250, 640, 160, 70, 6, '#DCE3EE'); fillRR(g, 250, 640, 160, 10, 4, '#C9D2DE'); [262, 398].forEach(function (wx) { fillE(g, wx, 714, 9, 9, SLATE); fillE(g, wx, 714, 4, 4, '#9AA6BC'); });
    fillRR(g, 268, 610, 124, 32, 4, '#FFFFFF'); fillRR(g, 268, 610, 124, 6, 3, BLUE); g.save(); g.translate(392, 616); g.rotate(-0.5); fillRR(g, -110, -4, 110, 8, 3, '#9AA6BC'); fillRR(g, -124, -7, 18, 14, 4, '#E2453C'); g.restore();
    text(g, 'CARD CUTTER', 330, 684, 9, 800, NAVY, 'center');
    soft(g, 880, 722, 80, 8, 0.3); [[820, 640, 90, '#C99A6B'], [910, 660, 70, '#D9B07D'], [840, 600, 64, '#B5865A']].forEach(function (bx) { fillRR(g, bx[0], bx[1], bx[2], 712 - bx[1], 4, bx[3]); fillRR(g, bx[0] + bx[2] / 2 - 4, bx[1], 8, 712 - bx[1], 0, 'rgba(255,255,255,.25)'); });
    text(g, 'BLANK CARDS', 865, 690, 9, 800, '#FFFFFF', 'center');
    K.plant(g, { x: 1070, y: 730 }, BLUE, BLUE2); K.plant(g, { x: -40, y: 730 }, '#FFFFFF', '#E3E9F3'); K.plant(g, { x: 560, y: 730 }, Y, '#F2C93A');
  }

  /* ------------------------------------------------------------ the cast */
  var W = CR.who;
  var PHO = W({ x: 520, y: 470, s: 0.48, ph: 0.8, skin: 0, hair: 2, style: 'pony', outfit: 'cardigan', top: CORAL, top2: '#FFFFFF', hands: [[-110, -300], [-40, -300]], look: -0.8 });
  var SIT = W({ x: 450, y: 470, s: 0.46, ph: 1.9, skin: 3, hair: 0, style: 'short', outfit: 'shirt', top: '#FFFFFF', top2: TEAL, sit: true, chair: false, sitDrop: 70, hands: [[-60, -200], [60, -200]], look: 0.6 });
  var OP = W({ x: 690, y: 470, s: 0.5, ph: 1.2, skin: 2, hair: 1, style: 'short', outfit: 'polo', top: BLUE, top2: Y, glasses: true, hands: [[-90, -230], [70, -220]], look: -0.4 });
  var NEW = W({ x: 870, y: 470, s: 0.5, ph: 3.4, skin: 1, hair: 3, style: 'bob', outfit: 'cardigan', top: TEAL, top2: '#FFFFFF', hands: [[-60, -200], [60, -200]], look: -0.6 });
  var CREW = [
    { front: true, x0: -380, x1: 140, y: 668, spd: 14, ph: 0.2, label: 'TechNext team', lines: ['A box of **blank cards** for the ID printer!', 'Lanyard on, **ID** in front.'], acts: ['wave', 'jump', 'id'],
      P: W({ s: 0.58, skin: 4, hair: 1, style: 'pony', outfit: 'polo', top: Y, top2: NAVY, hold: 'box', hands: [[-60, -212], [64, -216]] }) },
    { x0: -900, x1: -420, y: 500, spd: 16, ph: 0.6, label: 'TechNext team', lines: ['Front and back: checking the **ID design**.', 'Blue band, white card, **TechNext** plane.'], acts: ['cheer', 'wave', 'dance'],
      P: W({ s: 0.5, skin: 2, hair: 0, style: 'short', outfit: 'cardigan', top: '#7B5BD6', top2: '#FFFFFF', hold: 'tablet', hands: [[-60, -212], [70, -170]] }) }
  ];
  var XSC = [
    { P: W({ x: 1130, y: 470, s: 0.5, ph: 0.4, skin: 3, hair: 2, style: 'long', outfit: 'polo', top: CORAL, top2: '#FFFFFF' }), hands: [[-70, -200], [70, -200]],
      box: [1130, 360, 90, 220], who: 'At the lanyard spool', role: 'TechNext · illustration', near: [880, 40], pose: 'love', dur: [1.8, 1.6], fx: ['spark', 'star'],
      lines: ['Every one of us wears a **TechNext ID**.', 'Lanyard on, ID facing out. Ready!'],
      idle: function (P, t) { var c = (t + 1) % 6; P.look = -0.6; P.hands = c < 3.5 ? [[-130, -330 + Math.sin(t * 3) * 8], [70, -200]] : [[-70, -200], [40, -250]]; if (c >= 3.5) { P.mood = 'happy'; P.idSwing = t * 4; } },
      moves: [function (P, u, t) { P.idSwing = t * 8; P.hands = [[-70, -200], [70, -260]]; P.hop = bell(u) * 12; }, function (P, u) { P.hands = [[-110, -380], [110, -380]]; P.hop = Math.abs(Math.sin(u * Math.PI * 2)) * 18; }],
      after: function (g, P, t, S, X, u, k) { if (u >= 0 && k === 0) COL.pop(g, P.x, P.y - 270, 'TechNext ID ✓', u, BLUE); } }
  ];
  var FLASH = { t: -9 }, POP = { t: -9, n: 0 }, GLOW = { t: -9 }, GATE = { t: -9 }, SWAY = { t: -9 }, PEACE = { t: -9 };
  /* ---- the photographer: idle, adjusts the ring light, counts 3-2-1 with her fingers and takes the photo; tapped, a big flash and "Smile!" */
  function actPho(P, t, S) {
    var st = S.cast.pho, u = COL.tap(st, t).e; COL.reset(P, [[-110, -300], [-40, -300]]);
    var c = (t + 0.8) % 7; P.talk = t < st.until || (c > 3 && c < 5);
    if (c < 2.5) { P.hands = [[-110, -300], [-40, -300]]; P.look = -0.8; }
    else if (c < 3) { P.hands = [[-110, -300], [-40, -300]]; if (FLASH.idle !== Math.floor(t / 7)) { FLASH.idle = Math.floor(t / 7); FLASH.auto = t; } }
    else if (c < 5) { P.hands = [[-80, -240], [110, -330 + Math.sin(t * 6) * 6]]; P.look = 0.6; P.mood = 'happy'; }
    else { P.hands = [[-120, -340 + Math.sin(t * 2) * 10], [60, -200]]; P.look = -1; }
    if (S.hot === 'booth') { P.hands = [[-110, -300], [-40, -300]]; P.look = -0.8; P.talk = true; }
    if (u < 2) { P.mood = 'happy'; P.talk = true; P.hands = [[-110, -300], [-40, -300]]; P.hop = u > 0.4 ? bell((u - 0.4) / 1.2) * 10 : 0; if (u > 0.3 && FLASH.t < st._s) { FLASH.t = t; CR.burst('star', 450, 260, t); } }
    if (u < 0.05) st._s = t;
    P._u = u;
  }
  /* ---- the colleague on the stool: idle, poses, fixes the hair, smiles on the flash; tapped, a peace sign */
  function actSit(P, t, S) {
    var st = S.cast.sit, u = COL.tap(st, t).e, fl = Math.min(t - FLASH.t, t - (FLASH.auto || -9)); COL.reset(P, [[-60, -200], [60, -200]]);
    var c = (t + 1.9) % 7; P.talk = t < st.until;
    if (c < 2) { P.hands = [[-60, -380 + Math.sin(t * 8) * 6], [60, -200]]; P.look = 0.2; } else { P.hands = [[-60, -200], [60, -200]]; P.look = 0.8; P.tilt = Math.sin(t * 1.5) * 0.04; }
    if (fl < 0.9) { P.mood = 'happy'; P.look = 0.9; }
    if (u < 2) { P.mood = 'happy'; P.talk = true; P.hands = [[-60, -200], [110, -380]]; P.tilt = 0.08; if (u < 0.05 && PEACE.t < t - 1) PEACE.t = t; }
    P._u = u;
  }
  /* ---- the ID operator: idle, feeds a card into the printer, then the laminator; tapped, the printer pops out a fresh ID */
  function actOp(P, t, S) {
    var st = S.cast.op, u = COL.tap(st, t).e; COL.reset(P, [[-90, -230], [70, -220]]);
    var c = (t + 1.2) % 8; P.talk = t < st.until; P._car = c < 4 ? 0 : c < 6 ? 1 : 2;
    var tx = c < 4 ? T.printer.x + 40 : c < 6 ? lerp(T.printer.x + 40, T.lam.x + 36, ease((c - 4) / 2)) : T.lam.x + 36;
    var hx = clamp((tx - P.x) / P.s, -150, 150); P.hands = [[hx - 20, -250 + Math.sin(t * 4) * 4], [hx + 20, -250 + Math.cos(t * 4) * 4]]; P.look = clamp(hx / 150, -1, 1);
    if (c > 6 && c < 6.1 && GLOW.idle !== Math.floor(t / 8)) { GLOW.idle = Math.floor(t / 8); GLOW.auto = t; }
    if (S.hot === 'printer') { P.hands = [[-150, -270], [70, -220]]; P.look = -1; P.talk = true; }
    if (u < 2.2) { P._car = -1; P.mood = 'happy'; P.talk = true; P.hands = [[-130, -300 + Math.sin(u * 20) * 8], [100, -380]]; P.hop = u > 0.8 ? bell((u - 0.8) / 1.2) * 12 : 0; if (u > 0.4 && POP.t < st._s) { POP.t = t; POP.n++; CR.burst('conf', T.printer.x + 40, 300, t); } }
    if (u < 0.05) st._s = t;
    P._u = u;
  }
  /* ---- the new joiner at the gate: idle, walks up, taps the ID on the reader, the gate goes green and she walks through; tapped, again with a cheer */
  function actNew(P, t, S) {
    var st = S.cast.new, u = COL.tap(st, t).e; COL.reset(P, [[-60, -200], [60, -200]]);
    var c = (t + 3.4) % 9, gt = T.gate.x; P.talk = t < st.until;
    if (c < 3) { P.x = lerp(gt - 40, gt + 20, ease(c / 3)); P.hands = [[-60, -200 + Math.sin(t * 6) * 6], [60, -200 - Math.sin(t * 6) * 6]]; P.look = 1; }
    else if (c < 4.2) { P.x = gt + 20; P.hands = [[-60, -200], [150, -330]]; P.look = 1; P.idSwing = t * 6; if (c > 3.5 && GATE.idle !== Math.floor(t / 9)) { GATE.idle = Math.floor(t / 9); GATE.auto = t; } }
    else if (c < 6.5) { P.x = lerp(gt + 20, gt + 100, ease((c - 4.2) / 2.3)); P.hands = [[-60, -200], [60, -200]]; P.mood = 'happy'; P.look = 0.4; }
    else { P.x = lerp(gt + 100, gt - 40, ease((c - 6.5) / 2.5)); P.look = -0.7; P.hands = [[-60, -200], [60, -200]]; }
    if (u < 2.2) { P.x = gt + 20; P.mood = 'happy'; P.talk = true; P.hands = u < 0.8 ? [[-60, -200], [150, -330]] : [[-110, -400], [110, -400]]; P.hop = u > 0.8 ? Math.abs(Math.sin((u - 0.8) * 7)) * 16 : 0; if (u > 0.4 && GATE.t < st._s) { GATE.t = t; CR.burst('spark', gt + 45, 280, t); } }
    if (u < 0.05) st._s = t;
    P._u = u;
  }

  /* ------------------------------------------------------------ live layers */
  function paintWindow(g, t, par, S) {
    var e = S.ext; for (var sk = Math.floor(e.l / 200) * 200; sk < e.r; sk += 200) { g.save(); g.beginPath(); g.rect(sk + 30, -160, 140, 36); g.clip(); var x = sk + 30 + ((t * 8 + hash(sk) * 140) % 200) - 30; g.fillStyle = 'rgba(255,255,255,.9)'; g.beginPath(); g.ellipse(x, -140, 26, 7, 0, 0, 7); g.ellipse(x + 12, -146, 14, 7, 0, 0, 7); g.fill(); g.restore(); }
  }
  function paintLive(g, t, now, S) {
    var P = people(), r = T.rack, sw = t - SWAY.t, swA = sw < 3 ? (1 - sw / 3) * 0.35 : 0;
    /* the lanyard rack: one ID per person on this page (the first ones carry the initials), swinging */
    var n = Math.max(5, P.length); for (var i = 0; i < 4; i++) { var hx = r.x + 44 + i * 54, mine = i < P.length, a = Math.sin(t * 1.3 + i * 1.1) * 0.06 + Math.sin(t * 5 + i) * swA + (S.hot === 'rack' ? Math.sin(t * 3 + i) * 0.05 : 0);
      g.save(); g.translate(hx, r.y + 40); g.rotate(a); strap(g, 0, 0, 0, 104, mine ? BLUE : [TEAL, NAVY, CORAL][i % 3]); g.translate(0, 108); idCard(g, 44, mine ? P[i].i : '', '', mine ? BLUE : '#9AA6BC'); g.restore(); }
    /* the photo booth: ring light, flash */
    var b = T.booth, fl = Math.min(t - FLASH.t, t - (FLASH.auto || -9)); g.strokeStyle = 'rgba(255,255,255,.95)'; g.lineWidth = 7; g.beginPath(); g.arc(b.x + b.w - 14, 196, 20, 0, 7); g.stroke();
    if (fl < 0.6) { g.save(); g.globalAlpha = (1 - fl / 0.6) * 0.8; fillE(g, b.x + b.w / 2, 280, 80 + fl * 120, 80 + fl * 120, '#FFFFFF'); g.restore(); }
    var cd = (t + 0.8) % 7; if (cd > 2.5 && cd < 3) text(g, '✓', b.x + 40, 150, 18, 800, BLUE, 'center'); else if (cd < 2.5 && cd > 1) text(g, String(3 - Math.floor((cd - 1) / 0.5)), b.x + 40, 150, 20, 800, BLUE, 'center');
    /* the gate: reader light, glass flaps (open on green) */
    var gt = T.gate.x, ga = Math.min(t - GATE.t, t - (GATE.auto || -9)), open = ga < 2 ? bell(Math.min(1, ga / 2)) : 0, green = ga < 2;
    fillRR(g, gt + 34, 290, 22, 12, 3, green ? GREEN : (S.hot === 'gate' ? Y : '#5C6B7A')); if (green) { g.save(); g.globalAlpha = 0.4 * (1 - ga / 2); fillE(g, gt + 45, 296, 26, 18, GREEN); g.restore(); }
    g.save(); g.globalAlpha = 0.7; g.fillStyle = '#BFE0F7'; g.fillRect(gt + 30, 392, 40 * (1 - open), 50); g.fillRect(gt + 116 - 40 * (1 - open), 392, 40 * (1 - open), 50); g.restore();
    if (green) COL.pop(g, gt + 45, 260, '✓ Welcome!', ga / 2, '#0E7A50');
    /* the map pins pulse */
    var m = T.map; [[62, 50, 'SG'], [126, 46, 'PH'], [100, 86, 'VN']].forEach(function (p2, i2) { var px = m.x + p2[0], py = m.y + p2[1], pu = 0.5 + 0.5 * Math.sin(t * 3 + i2 * 2);
      fillE(g, px, py, 6 + pu * 5, 6 + pu * 5, 'rgba(49,103,202,' + (0.2 * (1 - pu) + 0.05).toFixed(3) + ')'); fillE(g, px, py, 5, 5, ['#E2453C', BLUE, '#D8362B'][i2]); text(g, p2[2], px, py - 9, 7, 800, NAVY, 'center'); });
    text(g, 'Singapore HQ · Taguig City · Ho Chi Minh City', m.x + m.w / 2, m.y + m.h - 6, 6, 800, '#5C6B7A', 'center');
    CO.clock(g, 1000, -40, 18, 8, NAVY);
    COL.draw(XSC, g, t, S);
    CO.crew(CREW, g, t, S, false);
  }
  function paintFrontLive(g, t, S) {
    CO.crew(CREW, g, t, S, true);
    /* the photographer's camera */
    var a = COL.hand(PHO, 0), b = COL.hand(PHO, 1); g.save(); g.translate((a[0] + b[0]) / 2, (a[1] + b[1]) / 2); fillRR(g, -14, -9, 28, 18, 4, '#2A3142'); fillE(g, -6, 0, 6, 6, '#5C7A9E'); fillE(g, -7, -1, 2, 2, '#FFFFFF'); fillRR(g, 4, -12, 8, 4, 2, '#2A3142'); g.restore();
    if (PHO._u < 2) COL.pop(g, PHO.x, PHO.y - 280, 'Smile!', PHO._u / 2, CORAL);
    if (SIT._u < 2) COL.pop(g, SIT.x, SIT.y - 230, 'Peace!', SIT._u / 2, TEAL);
    /* the card the operator carries between the machines */
    if (OP._car >= 0) { var h = COL.hand(OP, 1); g.save(); g.translate(h[0] - 8, h[1] - 18); g.rotate(-0.2); idCard(g, 18, '', '', BLUE); g.restore(); }
    var P = people();
    /* the printer screen, the card sliding between the machines, the laminator glow */
    var pr = T.printer.x, pt = t - POP.t; fillRR(g, pr + 10, 328, 36, 22, 3, '#0F1426'); text(g, 'PRINT', pr + 14, 337, 5.6, 800, '#7FE3C4'); text(g, 'No. ' + String((Math.floor(t / 8) % P.length) + 1).padStart(3, '0'), pr + 14, 346, 6, 800, '#FFFFFF');
    fillE(g, pr + 63, 330, 2.4, 2.4, Math.floor(t * 3) % 2 ? GREEN : '#2E8A6C');
    var gl = Math.min(t - GLOW.t, t - (GLOW.auto || -9)), glA = gl < 1.6 ? bell(gl / 1.6) : 0.25 + 0.15 * Math.sin(t * 2); if (S.hot === 'laminator') glA = 0.6 + 0.3 * Math.sin(t * 6);
    g.save(); g.globalAlpha = glA; fillRR(g, T.lam.x + 10, 355, 54, 7, 3, '#FFB347'); fillE(g, T.lam.x + 37, 358, 34, 8, 'rgba(255,179,71,.35)'); g.restore();
    if (pt < 1.8) { var fu = clamp(pt / 0.9, 0, 1); g.save(); g.translate(lerp(pr + 40, pr + 20, fu), 300 - Math.sin(fu * Math.PI) * 90 + fu * 60); g.rotate(fu * Math.PI * 3); idCard(g, 26, P[POP.n % P.length].i, '', BLUE); g.restore(); }
    /* the card tray between the machines */
    for (var ts = 0; ts < 3; ts++) { g.save(); g.translate(T.lam.x - 14 + ts, 372 - ts * 2.4); fillRR(g, -10, 0, 20, 4, 1.5, '#FFFFFF'); fillRR(g, -10, 0, 20, 1.5, 1, BLUE); g.restore(); }
    if (OP._u < 2.2) COL.pop(g, OP.x, OP.y - 290, 'Fresh ID!', OP._u / 2.2, BLUE);
    /* the new joiner's ID, held to the reader */
    if (NEW._u < 2.2 || ((t + 3.4) % 9 > 3 && (t + 3.4) % 9 < 4.2)) { var hn = COL.hand(NEW, 1); g.save(); g.translate(hn[0], hn[1] - 16); idCard(g, 16, '', '', BLUE); g.restore(); }
    CR.draw(g, t);
  }

  window.IXW.worlds.team = {
    pan: [-320, 1160],
    paintBg: paintBg, paintBack: paintBack, paintFront: paintFront, paintFore: paintFore,
    paintWindow: paintWindow, paintLive: paintLive, paintFrontLive: paintFrontLive,
    paintForeLive: function (g, t, S) { K.zfore(g, t, S, [], function () { CO.crew(CREW, g, t, S, 'fore'); }); CR.draw(g, t); },
    moteCol: 'rgba(255,216,74,.45)',
    glow: {
      rack: function (g) { var r = T.rack; rr(g, r.x - 8, r.y - 20, r.w + 16, r.h + 28, 14); },
      booth: function (g) { var b = T.booth; rr(g, b.x - 10, 56, b.w + 20, F - 50, 12); },
      printer: function (g) { rr(g, T.printer.x - 8, 292, 94, 92, 12); },
      laminator: function (g) { rr(g, T.lam.x - 8, 322, 90, 62, 12); },
      gate: function (g) { rr(g, T.gate.x - 8, 276, 162, F - 270, 12); },
      offices: function (g) { var m = T.map; rr(g, m.x - 8, m.y - 8, m.w + 16, m.h + 16, 12); },
      sway: function (g) { var r = T.rack; rr(g, r.x - 8, r.y - 20, r.w + 16, r.h + 28, 14); }
    },
    backGlow: ['rack', 'booth', 'printer', 'laminator', 'gate', 'offices', 'sway'],
    calmView: [290, -40, 740, 592],
    cast: [
      { id: 'sit', behind: true, keys: ['booth'], P: SIT, act: actSit },
      { id: 'pho', behind: true, keys: ['booth'], P: PHO, act: actPho },
      { id: 'op', behind: true, keys: ['printer', 'laminator'], P: OP, act: actOp },
      { id: 'new', behind: false, keys: ['gate'], P: NEW, act: actNew }
    ],
    toy: function (name, S, t) { if (name === 'sway') { SWAY.t = t; CR.burst('spark', T.rack.x + T.rack.w / 2, 80, t); } if (name === 'flash') { FLASH.t = t; CR.burst('star', T.booth.x + 75, 200, t); } },
    hit: function (x, y, S, t) { var r = CR.hitWalker(x, y, t); if (r) return r; return COL.hit(XSC, x, y, t); }
  };
})(window.IXW && window.IXW.kit, window.CR, window.CO, window.COL);
