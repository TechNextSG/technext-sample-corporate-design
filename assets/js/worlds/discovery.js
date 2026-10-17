/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: discovery (/odoo/discovery) — step 1 of 4, drawn as a bright daytime CASE ROOM: discovery is an investigation into
   how the business really works. The cork case board pins the evidence for each process (order-to-cash, procure-to-pay,
   record-to-report) as index cards joined by red string, with a laser dot and a magnifier sweeping the lane being walked;
   the gaps are the clues, circled on red notes; the wall screen is the "app line-up", where each step is matched to an Odoo
   20 app; the written scope waits on the credenza as the case file. Finance, sales and the warehouse are the witnesses at
   the interview table (each with their own habit: the calculator, the phone, the barcode scanner); TechNext's consultant
   leads the case with a laser pointer and a magnifier, an analyst keeps the interview schedule on a rolling board, a
   project manager carries in the evidence boxes. Clients wear grey visitor passes; TechNext staff the blue ID.
   Every person has their own idle loop and their own tap move (CR.ACT entries prefixed dc_, written here). */
(function (K, CR, CO) {
  'use strict';
  if (!K || !CR || !CO) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed;
  var F = 470, CEIL = -150, BLUE = '#3167CA', RED = '#E2453C', Y = '#FFD84A', INK = '#1B1F3B', PUR = '#714B67', CORK = '#D8AC74', PASS = '#9AA6BC';
  var CB = { x: 262, y: -114, w: 606, h: 292 };
  var LANES = [
    { key: 'o2c', name: 'Order-to-cash', col: BLUE, nodes: ['Quote', 'Order', 'Deliver', 'Invoice', 'Paid'] },
    { key: 'p2p', name: 'Procure-to-pay', col: '#14A38B', nodes: ['Request', 'PO', 'Receive', 'Bill', 'Pay'] },
    { key: 'r2r', name: 'Record-to-report', col: PUR, nodes: ['Journal', 'Reconcile', 'Close', 'Report'] }];
  var GAPS = [['Re-typed', 'in Excel'], ['No stock', 'reserve'], ['Manual', 'reconcile']];
  var APPS = [['Sales', '#E46E78', 'Quote'], ['Inventory', '#F2A33A', 'Deliver'], ['Purchase', '#4FA7C4', 'PO'], ['Invoicing', '#7A5AAE', 'Invoice'], ['Accounting', '#2E9C7E', 'Reconcile'], ['Dashboards', BLUE, 'Report']];
  var T = { tv: { x: 886, y: -102, w: 188, h: 164 }, table: { x: 380, y: 380, w: 400 }, cred: { x: -270, y: 380, w: 606 }, scope: { x: 190, y: 380 },
    win: { x: -280, y: -70, w: 510, h: 320 }, winL: { x: -910, y: -80, w: 220, h: 320 }, prn: { x: 948, y: 392, w: 98 }, mob: { x: 1150, y: 158, w: 150, h: 172 }, clock: { x: 1180, y: -72, r: 22 } };
  function laneY(i) { return -38 + i * 74; }
  function nodeX(j) { return 390 + j * 74; }
  function setU(g, sx, sy, k) { g.translate(sx, sy); g.scale(k, k); }
  function extOf(W, H, k, sx, sy) { return { l: -(sx + 24) / k, r: (W - sx) / k, t: -(sy + 24) / k, b: (H - sy) / k }; }
  function pin(g, x, y, col) { fillE(g, x + 1.2, y + 2.2, 4.6, 4.6, 'rgba(60,30,10,.22)'); fillE(g, x, y, 4.6, 4.6, col); fillE(g, x - 1.5, y - 1.5, 1.6, 1.6, 'rgba(255,255,255,.75)'); }
  function qpt(x0, y0, x1, y1, sag, u) { var cx = (x0 + x1) / 2, cy = (y0 + y1) / 2 + sag, a = (1 - u) * (1 - u), b = 2 * (1 - u) * u, c = u * u; return [a * x0 + b * cx + c * x1, a * y0 + b * cy + c * y1]; }
  function string(g, x0, y0, x1, y1, sag) { g.beginPath(); g.moveTo(x0, y0); g.quadraticCurveTo((x0 + x1) / 2, (y0 + y1) / 2 + sag, x1, y1); g.stroke(); }
  /* where a hand is in set units (the target the arm reaches for; good enough to hang a prop on) */
  function handW(P, i) { var h = P.hands[i], sx = P.sx == null ? 1 : P.sx; return [P.x + h[0] * P.s * sx, P.y + (h[1] - (P.hop || 0) + (P.sit ? (P.sitDrop != null ? P.sitDrop : 46) : 0)) * P.s]; }
  function headW(P) { return [P.x, P.y + (-392 - (P.hop || 0) + (P.sit ? 46 : 0)) * P.s]; }

  /* ============================== static layers ============================== */
  function paintBg(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    var wg = g.createLinearGradient(0, CEIL, 0, F); wg.addColorStop(0, '#FBF8F1'); wg.addColorStop(1, '#F1EADC'); g.fillStyle = wg; g.fillRect(e.l, CEIL, e.r - e.l, F - CEIL);
    /* the lower wall: warm panelling under a chair rail */
    g.fillStyle = '#EDE3D0'; g.fillRect(e.l, 300, e.r - e.l, F - 300); g.fillStyle = '#FFFFFF'; g.fillRect(e.l, 294, e.r - e.l, 7); g.fillStyle = 'rgba(120,90,40,.08)'; g.fillRect(e.l, 301, e.r - e.l, 3);
    g.strokeStyle = 'rgba(120,90,40,.09)'; g.lineWidth = 2; for (var px = Math.floor(e.l / 120) * 120; px < e.r; px += 120) { rr(g, px + 12, 318, 96, 132, 6); g.stroke(); }
    /* a faint pinstripe wallpaper above */
    g.fillStyle = 'rgba(160,130,80,.05)'; for (var sxp = Math.floor(e.l / 26) * 26; sxp < e.r; sxp += 26) g.fillRect(sxp, CEIL, 2, 294 - CEIL);
    /* two windows onto the city, morning light */
    [T.win, T.winL].forEach(function (w, i) { g.save(); g.beginPath(); g.rect(w.x, w.y, w.w, w.h); g.clip();
      CO.sky(g, { l: w.x, r: w.x + w.w, t: w.y }, w.y, w.y + w.h, [[0, '#7FB8EE'], [0.7, '#C6E2F7'], [1, '#EEF7FC']]);
      CO.skySG(g, w.x - 40, w.x + w.w + 40, w.y + 250, w.y + 296, { mbs: i ? w.x + 120 : w.x + 300, wheel: i ? -9999 : w.x + 110 }); g.restore(); });
    CO.ceiling(g, e, CEIL, '#F2EEE6', '#FBF9F4', '#FFFFFF');
    /* a warm wooden floor */
    var fg = g.createLinearGradient(0, F, 0, e.b); fg.addColorStop(0, '#EAD7B6'); fg.addColorStop(1, '#D8BE93'); g.fillStyle = fg; g.fillRect(e.l, F, e.r - e.l, e.b - F);
    g.fillStyle = 'rgba(90,60,20,.12)'; g.fillRect(e.l, F, e.r - e.l, 5);
    g.strokeStyle = 'rgba(120,80,30,.13)'; g.lineWidth = 1.6; g.beginPath();
    for (var d = 1; d < 9; d++) { var yy = F + Math.pow(d / 8, 1.5) * (e.b - F); g.moveTo(e.l, yy); g.lineTo(e.r, yy); }
    for (d = 0; d < 8; d++) { var y0 = F + Math.pow(d / 8, 1.5) * (e.b - F), y1 = F + Math.pow((d + 1) / 8, 1.5) * (e.b - F); for (var px2 = Math.floor(e.l / 150) * 150 + (d * 53) % 150; px2 < e.r; px2 += 150) { g.moveTo(px2, y0); g.lineTo(px2 + (px2 - 560) * 0.04, y1); } }
    g.stroke();
    /* daylight through the blinds: soft stripes across the floor */
    g.fillStyle = 'rgba(255,246,214,.38)';
    [[-260, 0], [-900, 1]].forEach(function (s) { for (var b = 0; b < 5; b++) { var x0 = s[0] + b * 46; g.beginPath(); g.moveTo(x0 + 120, F + 6); g.lineTo(x0 + 150, F + 6); g.lineTo(x0 + 330, e.b); g.lineTo(x0 + 280, e.b); g.closePath(); g.fill(); } });
    /* the rug under the interview table */
    g.fillStyle = '#C9D7EE'; g.beginPath(); g.moveTo(330, F + 8); g.lineTo(830, F + 8); g.lineTo(900, 600); g.lineTo(260, 600); g.closePath(); g.fill();
    g.strokeStyle = '#FFFFFF'; g.lineWidth = 3; g.beginPath(); g.moveTo(352, F + 18); g.lineTo(808, F + 18); g.lineTo(866, 586); g.lineTo(294, 586); g.closePath(); g.stroke();
    g.strokeStyle = 'rgba(49,103,202,.25)'; g.lineWidth = 2; for (var r2 = 0; r2 < 6; r2++) { g.beginPath(); g.moveTo(380 + r2 * 80, F + 30); g.lineTo(340 + r2 * 104, 576); g.stroke(); }
    g.restore();
  }
  function blinds(g, w, open) { /* venetian blinds pulled part-way down */
    var bot = w.y + w.h * open; fillRR(g, w.x - 6, w.y - 10, w.w + 12, 12, 4, '#FFFFFF');
    for (var y = w.y + 4; y < bot; y += 11) { fillRR(g, w.x, y, w.w, 7, 2, '#F6F1E7'); g.fillStyle = 'rgba(120,90,40,.12)'; g.fillRect(w.x, y + 6, w.w, 1.5); }
    fillRR(g, w.x, bot, w.w, 9, 3, '#E9E0CE'); g.strokeStyle = '#D9CDB4'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(w.x + w.w - 18, w.y); g.lineTo(w.x + w.w - 18, bot + 60); g.stroke(); fillE(g, w.x + w.w - 18, bot + 64, 4, 6, '#D9CDB4');
  }
  function paintFrame(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k);
    [[T.win, 0.34, 4], [T.winL, 0.28, 2]].forEach(function (a) { var w = a[0];
      g.strokeStyle = '#FFFFFF'; g.lineWidth = 12; g.strokeRect(w.x, w.y, w.w, w.h); g.lineWidth = 6; g.beginPath(); for (var i = 1; i < a[2]; i++) { g.moveTo(w.x + i * w.w / a[2], w.y); g.lineTo(w.x + i * w.w / a[2], w.y + w.h); } g.stroke();
      blinds(g, w, a[1]); fillRR(g, w.x - 14, w.y + w.h + 2, w.w + 28, 12, 4, '#FFFFFF'); g.fillStyle = 'rgba(90,60,20,.08)'; g.fillRect(w.x - 10, w.y + w.h + 14, w.w + 20, 3); });
    g.restore();
  }
  function corkBoard(g) {
    var x = CB.x, y = CB.y, w = CB.w, h = CB.h;
    shadowed(g, 18, 6, 0.2, function () { fillRR(g, x, y, w, h, 10, '#B88752'); });
    fillRR(g, x + 4, y + 4, w - 8, h - 8, 8, '#C99560'); fillRR(g, x + 10, y + 10, w - 20, h - 20, 4, CORK);
    for (var i = 0; i < 520; i++) { var px = x + 12 + hash(i * 1.7) * (w - 24), py = y + 12 + hash(i * 3.1 + 2) * (h - 24); g.fillStyle = i % 3 ? 'rgba(150,100,50,.28)' : 'rgba(255,235,200,.45)'; g.fillRect(px, py, 1.6 + hash(i) * 1.6, 1.6); }
    /* the case banner */
    g.save(); g.translate(x + 30, y + 16); g.rotate(-0.012); shadowed(g, 4, 2, 0.18, function () { fillRR(g, 0, 0, 300, 26, 2, '#FFFDF6'); });
    fillRR(g, 0, 0, 8, 26, 1, RED); text(g, 'CASE FILE 01', 16, 17.5, 9.5, 800, RED); text(g, 'How work moves today', 98, 17.5, 11, 800, INK); g.restore(); pin(g, x + 40, y + 22, RED); pin(g, x + 318, y + 20, BLUE);
    /* a pinned photo pair top right: the sample warehouse and the sample shop counter */
    [[x + 352, y + 10, -0.06, 0], [x + 402, y + 12, 0.08, 1]].forEach(function (p) { g.save(); g.translate(p[0], p[1]); g.scale(0.86, 0.86); g.rotate(p[2]); shadowed(g, 4, 2, 0.2, function () { fillRR(g, 0, 0, 44, 46, 2, '#FFFFFF'); });
      fillRR(g, 4, 4, 36, 30, 1, p[3] ? '#CFE3F5' : '#E8DCC6');
      if (p[3]) { fillRR(g, 8, 20, 28, 14, 1, '#9B7A55'); fillRR(g, 12, 12, 8, 8, 1, '#E46E78'); fillRR(g, 22, 10, 10, 10, 1, '#4FA7C4'); }
      else { g.fillStyle = '#A88762'; g.fillRect(8, 10, 28, 2.4); g.fillRect(8, 20, 28, 2.4); [0, 1, 2].forEach(function (b) { fillRR(g, 9 + b * 9, 13, 7, 7, 1, '#C9965C'); fillRR(g, 10 + b * 9, 23, 7, 9, 1, '#D8A86C'); }); }
      text(g, p[3] ? 'shop' : 'stock', 22, 43, 6.4, 700, '#5C5C73', 'center'); g.restore(); pin(g, p[0] + 18 + p[3] * 4, p[1] + 2, Y); });
    /* the lanes: a kraft tag, index cards, red string */
    LANES.forEach(function (L, i) { var ly = laneY(i);
      g.save(); g.translate(x + 20, ly - 17); shadowed(g, 3, 2, 0.16, function () { fillRR(g, 0, 0, 92, 34, 3, '#E4C79A'); }); fillRR(g, 0, 0, 92, 7, 2, L.col); fillE(g, 82, 20, 4, 4, CORK);
      text(g, L.name, 44, 24, 8, 800, '#4A3418', 'center'); g.restore();
      g.strokeStyle = RED; g.lineWidth = 1.6; string(g, x + 112, ly - 6, nodeX(0) + 30, ly - 17, 6);
      L.nodes.forEach(function (nm, j) { var cx = nodeX(j); if (j) string(g, nodeX(j - 1) + 30, ly - 17, cx + 30, ly - 17, 9); });
      L.nodes.forEach(function (nm, j) { var cx = nodeX(j), rot = (hash(i * 7 + j) - 0.5) * 0.08; g.save(); g.translate(cx + 30, ly); g.rotate(rot);
        shadowed(g, 3, 2, 0.18, function () { fillRR(g, -30, -19, 60, 38, 2, '#FFFFFF'); }); fillRR(g, -30, -19, 60, 6, 1, L.col);
        g.fillStyle = 'rgba(49,103,202,.16)'; g.fillRect(-26, 5, 52, 1); g.fillRect(-26, 11, 52, 1); text(g, nm, 0, 3, 8, 800, INK, 'center'); text(g, String(j + 1), -24, 15, 6, 800, '#9AA6BC'); g.restore();
        pin(g, cx + 30, ly - 17, j % 2 ? BLUE : RED); });
    });
    /* the gap clues column header */
    text(g, 'CLUES', x + w - 58, y + 32, 8, 800, '#7A1F1A', 'center');
    /* the evidence tray under the board: a pin box, a spool of red string, a marker */
    fillRR(g, x + 30, y + h - 2, w - 60, 10, 3, '#A7774A'); fillRR(g, x + 30, y + h - 2, w - 60, 3, 2, '#C9965C');
    fillRR(g, x + 150, y + h - 14, 30, 12, 2, '#FFFFFF'); [0, 1, 2, 3].forEach(function (c) { fillE(g, x + 156 + c * 6, y + h - 9, 2.2, 2.2, [RED, BLUE, Y, '#14A38B'][c]); });
    fillE(g, x + 210, y + h - 10, 10, 9, '#F3D9D7'); fillE(g, x + 210, y + h - 10, 7, 6, RED); fillRR(g, x + 240, y + h - 8, 40, 6, 3, BLUE); fillRR(g, x + 274, y + h - 8, 10, 6, 2, '#1E4691');
  }
  function bookcase(g) {
    var x = -622, w = 148, top = 50; soft(g, x + w / 2, F + 4, 90, 8, 0.26);
    fillRR(g, x, top, w, F - top, 4, '#C99A6B'); fillRR(g, x + 6, top + 6, w - 12, F - top - 12, 2, '#E9D6B8');
    var cols = ['#3167CA', '#E46E78', '#14A38B', '#F2A33A', PUR, '#4FA7C4', '#9AA6BC'];
    for (var s = 0; s < 5; s++) { var sy = top + 8 + s * 82; fillRR(g, x + 4, sy + 72, w - 8, 6, 2, '#B5865A');
      if (s === 2) { [0, 1].forEach(function (b) { fillRR(g, x + 12 + b * 64, sy + 30, 58, 42, 3, '#D9B98E'); fillRR(g, x + 30 + b * 64, sy + 40, 22, 10, 2, '#FFFFFF'); text(g, 'ARCHIVE', x + 41 + b * 64, sy + 66, 6.4, 800, '#7A5A30', 'center'); }); continue; }
      for (var b = 0; b < 9; b++) { var bh = 50 + hash(s * 11 + b) * 18, bw = 11 + hash(b * 3 + s) * 3; fillRR(g, x + 10 + b * 14.4, sy + 72 - bh, bw, bh, 2, cols[(s * 3 + b) % 7]); g.fillStyle = 'rgba(255,255,255,.55)'; g.fillRect(x + 12 + b * 14.4, sy + 72 - bh + 8, bw - 4, 4); } }
  }
  function coatRack(g) { /* a coat stand with a trench coat and a hat: the investigator's touch */
    var x = -680; soft(g, x, F + 3, 44, 6, 0.24); g.strokeStyle = '#7A5230'; g.lineCap = 'round'; g.lineWidth = 7; g.beginPath(); g.moveTo(x, F - 4); g.lineTo(x, 214); g.stroke();
    g.lineWidth = 5; g.beginPath(); g.moveTo(x - 30, F); g.lineTo(x, F - 30); g.lineTo(x + 30, F); g.moveTo(x - 22, 236); g.lineTo(x, 226); g.lineTo(x + 22, 236); g.stroke();
    g.fillStyle = '#C9A06A'; g.beginPath(); g.moveTo(x - 10, 236); g.lineTo(x - 36, 270); g.lineTo(x - 42, 400); g.lineTo(x + 8, 404); g.lineTo(x + 14, 270); g.closePath(); g.fill();
    g.fillStyle = '#B88A52'; g.beginPath(); g.moveTo(x - 10, 236); g.lineTo(x - 24, 300); g.lineTo(x - 8, 300); g.closePath(); g.fill(); fillRR(g, x - 40, 318, 50, 8, 3, '#8E6538');
    fillE(g, x + 4, 214, 34, 7, '#5C4A3A'); g.beginPath(); g.ellipse(x + 4, 212, 20, 16, 0, Math.PI, 0); g.closePath(); g.fillStyle = '#6E5A48'; g.fill(); g.fillStyle = '#3E2F25'; g.fillRect(x - 16, 206, 40, 5);
  }
  function waterCooler(g, x) { soft(g, x, F + 3, 40, 6, 0.24); fillRR(g, x - 26, 380, 52, F - 380, 6, '#F4F7FB'); fillRR(g, x - 26, 380, 52, 8, 4, '#DCE3EE'); fillRR(g, x - 12, 404, 10, 8, 2, '#3167CA'); fillRR(g, x + 2, 404, 10, 8, 2, RED);
    fillRR(g, x - 22, 300, 44, 82, 18, 'rgba(160,205,240,.75)'); fillRR(g, x - 18, 310, 14, 60, 7, 'rgba(255,255,255,.4)'); fillRR(g, x - 8, 294, 16, 10, 3, '#9CC3E6'); }
  function plantTall(g, x, y, s) { g.save(); g.translate(x, y); g.scale(s, s);
    [[-40, -170, -0.5], [30, -190, 0.45], [-6, -220, -0.05], [-60, -120, -0.9], [56, -130, 0.85], [12, -150, 0.2]].forEach(function (L, i) { g.strokeStyle = '#2E8E5E'; g.lineWidth = 4; g.beginPath(); g.moveTo(0, -60); g.quadraticCurveTo(L[0] * 0.3, L[1] * 0.6, L[0], L[1] + 26); g.stroke(); g.save(); g.translate(L[0], L[1]); g.rotate(L[2]); fillE(g, 0, 0, 22, 54, i % 2 ? '#3FBF7F' : '#2FA56A'); g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(-1, -48, 2, 96); g.restore(); });
    fillRR(g, -36, -64, 72, 64, 12, '#F4EFE6'); fillRR(g, -40, -70, 80, 14, 7, '#FFFFFF'); g.fillStyle = 'rgba(120,90,40,.1)'; g.fillRect(12, -56, 20, 54); g.restore(); }
  function paintBack(g, ext) {
    /* ceiling spotlights aimed at the case board */
    [380, 565, 750].forEach(function (x) { fillRR(g, x - 12, CEIL, 24, 14, 4, '#E6E1D6'); fillE(g, x, CEIL + 16, 10, 5, '#FFF6D8');
      g.save(); var lg = g.createLinearGradient(0, CEIL + 16, 0, CB.y + 120); lg.addColorStop(0, 'rgba(255,246,210,.45)'); lg.addColorStop(1, 'rgba(255,246,210,0)'); g.fillStyle = lg;
      g.beginPath(); g.moveTo(x - 9, CEIL + 16); g.lineTo(x + 9, CEIL + 16); g.lineTo(x + 80, CB.y + 120); g.lineTo(x - 80, CB.y + 120); g.closePath(); g.fill(); g.restore(); });
    corkBoard(g);
    /* the app line-up screen */
    var tv = T.tv; shadowed(g, 14, 5, 0.22, function () { fillRR(g, tv.x - 6, tv.y - 6, tv.w + 12, tv.h + 12, 8, '#2A3142'); }); fillRR(g, tv.x, tv.y, tv.w, tv.h, 3, '#FFFFFF');
    fillRR(g, tv.x, tv.y, tv.w, 18, 3, PUR); g.fillRect(tv.x, tv.y + 10, tv.w, 8); text(g, 'APP LINE-UP · MATCHED TO ODOO 20', tv.x + 8, tv.y + 12.5, 6.6, 800, '#FFFFFF');
    g.fillStyle = '#EEF1F6'; for (var hl = 0; hl < 6; hl++) g.fillRect(tv.x + 6, tv.y + 30 + hl * 22, tv.w - 12, 1.4);
    [0, 1, 2, 3, 4, 5].forEach(function (hl) { text(g, String(6 - hl), tv.x + tv.w - 8, tv.y + 34 + hl * 22, 5.5, 700, '#B5BECC', 'right'); });
    fillRR(g, tv.x + tv.w / 2 - 22, tv.y + tv.h + 6, 44, 6, 3, '#5C6B7A');
    /* the wall clock and the air-conditioner vent */
    K.clockFace(g, T.clock, INK); fillRR(g, 1196, CEIL, 110, 14, 4, '#F2EEE6'); g.fillStyle = 'rgba(120,90,40,.16)'; for (var v = 0; v < 6; v++) g.fillRect(1202 + v * 17, CEIL + 4, 12, 2);
    /* the long credenza under the window: archive boxes, the case file (scope) and the quotation */
    var cr = T.cred; soft(g, cr.x + cr.w / 2, F + 4, 320, 9, 0.28); fillRR(g, cr.x, cr.y, cr.w, F - cr.y, 6, '#D9C3A0');
    for (var dn = 0; dn < 5; dn++) { fillRR(g, cr.x + 8 + dn * 120, cr.y + 14, 112, F - cr.y - 24, 4, '#E8D6B8'); fillE(g, cr.x + 64 + dn * 120, cr.y + 30, 12, 3, '#A98C62'); }
    [[-250, '2024'], [-180, '2025'], [-110, 'ORDERS'], [-30, 'BILLS']].forEach(function (b, i) { fillRR(g, b[0], cr.y - 46 + (i % 2) * 6, 64, 46 - (i % 2) * 6, 3, '#D9B98E'); fillRR(g, b[0] + 12, cr.y - 36 + (i % 2) * 6, 40, 12, 2, '#FFFFFF'); text(g, b[1], b[0] + 32, cr.y - 27 + (i % 2) * 6, 6.6, 800, '#7A5A30', 'center'); });
    /* the printer cabinet and the rolling interview board (their moving parts are live) */
    var p = T.prn; soft(g, p.x + p.w / 2, F + 4, 60, 7, 0.26); fillRR(g, p.x, p.y, p.w, F - p.y, 5, '#DDE3EC'); fillRR(g, p.x + 6, p.y + 12, p.w - 12, 28, 3, '#EEF2F7'); fillRR(g, p.x + 6, p.y + 46, p.w - 12, 20, 3, '#EEF2F7'); fillRR(g, p.x + p.w / 2 - 12, p.y + 24, 24, 4, 2, '#AAB4C4');
    fillRR(g, p.x + 8, p.y - 36, p.w - 16, 36, 6, '#F4F6FA'); fillRR(g, p.x + 8, p.y - 36, p.w - 16, 8, 4, '#C9D2DE'); fillRR(g, p.x + 18, p.y - 18, p.w - 36, 6, 2, '#2A3142'); fillRR(g, p.x + p.w - 30, p.y - 28, 12, 6, 2, '#2A3142');
    var m = T.mob; soft(g, m.x + m.w / 2, F + 4, 90, 7, 0.24); g.strokeStyle = '#9AA6BC'; g.lineWidth = 5; g.beginPath(); g.moveTo(m.x + 14, m.y + m.h); g.lineTo(m.x + 14, F - 8); g.moveTo(m.x + m.w - 14, m.y + m.h); g.lineTo(m.x + m.w - 14, F - 8); g.moveTo(m.x, F - 8); g.lineTo(m.x + 28, F - 8); g.moveTo(m.x + m.w - 28, F - 8); g.lineTo(m.x + m.w, F - 8); g.stroke();
    [m.x + 4, m.x + 26, m.x + m.w - 26, m.x + m.w - 4].forEach(function (wx) { fillE(g, wx, F - 3, 5, 5, '#2A3142'); });
    shadowed(g, 10, 4, 0.18, function () { fillRR(g, m.x - 5, m.y - 5, m.w + 10, m.h + 10, 6, '#C9D2DE'); }); fillRR(g, m.x, m.y, m.w, m.h, 3, '#FFFFFF');
    text(g, 'INTERVIEWS', m.x + 12, m.y + 20, 9, 800, INK); text(g, 'who walks us through it', m.x + 12, m.y + 32, 6.4, 700, '#8A93A6');
    fillRR(g, m.x + 30, m.y + m.h, 60, 6, 2, '#AEB8C8');
    /* the left wall: bookcase, coat stand, water cooler */
    bookcase(g); coatRack(g); waterCooler(g, -800);
    plantTall(g, 1330, F, 0.9);
    notesCorner(g);
  }
  /* behind the title card: the notes corner. The WHO DOES WHAT whiteboard (the marker lines draw in, live), the Odoo Ready
     Partner certificate, a reading lamp, a rug, the note-taker's chair and side table, and on the floor the evidence trolley,
     two more numbered markers and the paperwork they found. */
  var NC = { wb: { x: -470, y: -46, w: 172, h: 150 }, cert: { x: -452, y: 136, w: 76, h: 88 }, lamp: { x: -308 }, side: { x: -330 }, trolley: { x: -150, y: 596 } };
  var WHO = [['Finance', '#E0456B'], ['Sales', '#F08A24'], ['Warehouse', '#14A38B']];
  function notesCorner(g) {
    var w = NC.wb; shadowed(g, 12, 4, 0.18, function () { fillRR(g, w.x - 6, w.y - 6, w.w + 12, w.h + 12, 8, '#C9D2DE'); }); fillRR(g, w.x, w.y, w.w, w.h, 4, '#FFFFFF');
    g.fillStyle = 'rgba(160,180,210,.12)'; g.fillRect(w.x + 8, w.y + 8, w.w - 16, 6); fillRR(g, w.x + 20, w.y + w.h + 6, w.w - 40, 7, 3, '#AEB8C8');
    fillRR(g, w.x + 30, w.y + w.h + 1, 22, 6, 3, BLUE); fillRR(g, w.x + 58, w.y + w.h + 1, 22, 6, 3, RED); fillRR(g, w.x + w.w - 50, w.y + w.h, 26, 8, 3, '#E9E0CE');
    text(g, 'WHO DOES WHAT', w.x + 12, w.y + 24, 9, 800, INK); text(g, 'today, before Odoo', w.x + 12, w.y + 36, 6.6, 700, '#8A93A6');
    var c = NC.cert; shadowed(g, 8, 3, 0.18, function () { fillRR(g, c.x, c.y, c.w, c.h, 4, '#C99A6B'); }); fillRR(g, c.x + 5, c.y + 5, c.w - 10, c.h - 10, 2, '#FFFDF6');
    fillE(g, c.x + c.w / 2, c.y + 30, 13, 13, PUR); text(g, 'o', c.x + c.w / 2, c.y + 35, 14, 800, '#FFFFFF', 'center'); text(g, 'Odoo Ready', c.x + c.w / 2, c.y + 58, 7.6, 800, INK, 'center'); text(g, 'Partner', c.x + c.w / 2, c.y + 69, 6.8, 800, PUR, 'center'); fillE(g, c.x + c.w - 14, c.y + c.h - 13, 6, 6, '#E9C46A');
    /* the rug of the notes corner */
    g.save(); g.globalAlpha = 0.85; fillE(g, -380, F + 34, 150, 24, '#F3E3C4'); g.restore(); g.strokeStyle = 'rgba(184,135,82,.55)'; g.lineWidth = 2; g.setLineDash([6, 5]); g.beginPath(); g.ellipse(-380, F + 34, 138, 19, 0, 0, 7); g.stroke(); g.setLineDash([]);
    /* the reading lamp */
    var lx = NC.lamp.x; soft(g, lx, F + 3, 22, 5, 0.24); fillE(g, lx, F - 2, 18, 5, '#7A5230'); g.strokeStyle = '#7A5230'; g.lineWidth = 4; g.beginPath(); g.moveTo(lx, F - 4); g.lineTo(lx, 236); g.quadraticCurveTo(lx, 216, lx - 18, 214); g.stroke();
    g.fillStyle = '#F2C46B'; g.beginPath(); g.moveTo(lx - 40, 236); g.lineTo(lx - 8, 236); g.lineTo(lx - 14, 208); g.lineTo(lx - 34, 208); g.closePath(); g.fill(); g.fillStyle = 'rgba(255,240,190,.35)'; g.beginPath(); g.moveTo(lx - 38, 236); g.lineTo(lx - 10, 236); g.lineTo(lx + 10, 330); g.lineTo(lx - 60, 330); g.closePath(); g.fill();
    /* the side table: a teapot, a cup, the notebook */
    var sd = NC.side.x; soft(g, sd, F + 3, 26, 5, 0.24); fillRR(g, sd - 26, 400, 52, 8, 4, '#B88752'); fillRR(g, sd - 4, 408, 8, F - 410, 2, '#8E6538'); fillRR(g, sd - 16, F - 5, 32, 5, 2, '#8E6538');
    fillRR(g, sd - 22, 384, 22, 16, 7, '#FFFFFF'); fillRR(g, sd - 14, 380, 6, 5, 2, '#FFFFFF'); g.strokeStyle = '#FFFFFF'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(sd - 22, 392); g.lineTo(sd - 28, 386); g.stroke();
    fillRR(g, sd + 4, 390, 12, 10, 3, '#E0456B'); fillRR(g, sd - 6, 396, 30, 4, 1, '#3167CA');
  }
  function evTentFore(g) { /* the notes corner's floor: the evidence trolley, markers 4 and 5 */
    var tr = NC.trolley; soft(g, tr.x + 56, tr.y + 4, 70, 8, 0.28); fillRR(g, tr.x, tr.y - 84, 112, 8, 3, '#9AA6BC'); fillRR(g, tr.x, tr.y - 34, 112, 8, 3, '#9AA6BC');
    g.fillStyle = '#7A869C'; g.fillRect(tr.x + 4, tr.y - 84, 5, 84); g.fillRect(tr.x + 103, tr.y - 84, 5, 84); g.fillRect(tr.x + 103, tr.y - 118, 5, 36); fillRR(g, tr.x + 96, tr.y - 122, 22, 7, 3, '#5C6B7A');
    [[6, -84, 44, 30, 'ORDERS'], [54, -84, 44, 24, 'Q3'], [8, -34, 92, 26, 'DELIVERY ORDERS']].forEach(function (b) { fillRR(g, tr.x + b[0], tr.y + b[1] - b[3], b[2], b[3], 3, '#C99A6B'); fillRR(g, tr.x + b[0] - 1, tr.y + b[1] - b[3], b[2] + 2, 6, 2, '#B5865A');
      fillRR(g, tr.x + b[0] + 6, tr.y + b[1] - b[3] + 10, b[2] - 12, 10, 2, '#FFFFFF'); text(g, b[4], tr.x + b[0] + b[2] / 2, tr.y + b[1] - b[3] + 17.5, 5.4, 800, '#7A5A30', 'center'); });
    [tr.x + 14, tr.x + 98].forEach(function (x) { fillE(g, x, tr.y, 6, 6, '#2A3142'); fillE(g, x, tr.y, 2.4, 2.4, '#9AA6BC'); });
    floorDoc(g, -300, 680, 0.16, 'Invoice.pdf', PUR); evTent(g, -350, 692, 4);
    floorDoc(g, -20, 700, -0.12, 'Orders.xlsx', '#14A38B'); evTent(g, 30, 712, 5);
    /* the flip-chart easel: the AS-IS flow sketched in marker */
    var ex = 96, ey = 452; soft(g, ex, 652, 56, 7, 0.26); g.strokeStyle = '#8E6538'; g.lineWidth = 6; g.lineCap = 'round'; g.beginPath(); g.moveTo(ex - 40, 650); g.lineTo(ex - 22, ey); g.moveTo(ex + 40, 650); g.lineTo(ex + 22, ey); g.moveTo(ex, 640); g.lineTo(ex, ey + 30); g.stroke();
    fillRR(g, ex - 58, ey + 108, 116, 8, 3, '#B5865A'); shadowed(g, 8, 3, 0.18, function () { fillRR(g, ex - 54, ey - 10, 108, 122, 3, '#FFFFFF'); }); fillRR(g, ex - 58, ey - 16, 116, 10, 4, '#5C4A3A');
    text(g, 'AS-IS FLOW', ex - 44, ey + 8, 8, 800, RED); g.strokeStyle = INK; g.lineWidth = 1.6;
    [['Quote', ex - 30, ey + 30], ['Excel', ex + 22, ey + 30], ['Re-type', ex - 4, ey + 62], ['Invoice', ex - 4, ey + 92]].forEach(function (b, i) { rr(g, b[1] - 20, b[2] - 9, 40, 16, 3); g.stroke(); text(g, b[0], b[1], b[2] + 3, 6.4, 800, i === 2 ? RED : INK, 'center'); });
    g.beginPath(); g.moveTo(ex - 10, ey + 30); g.lineTo(ex + 2, ey + 30); g.moveTo(ex + 20, ey + 39); g.lineTo(ex + 6, ey + 53); g.moveTo(ex - 4, ey + 71); g.lineTo(ex - 4, ey + 83); g.stroke();
    g.strokeStyle = RED; g.lineWidth = 1.8; g.beginPath(); g.ellipse(ex - 4, ey + 62, 28, 13, -0.1, 0, 7); g.stroke();
  }
  function paintFront(g, ext) {
    /* the interview table: open, so everyone's legs show; on it the notepads, mugs, a voice recorder, a cardboard box and the calculator */
    var t = T.table; CO.desk(g, t.x, t.y, t.w, F, { open: true, legs: '#9AA6BC', top: '#F1EBE0' });
    fillRR(g, t.x + 34, t.y - 4, 44, 5, 2, '#FFFFFF'); fillRR(g, t.x + 38, t.y - 6, 36, 3, 1, '#FFE27A');
    fillRR(g, 472, t.y - 12, 22, 12, 2, '#2A3142'); fillRR(g, 475, t.y - 10, 16, 6, 1, '#B8E0C8'); [0, 1, 2].forEach(function (c) { fillRR(g, 475 + c * 6, t.y - 3, 4, 2, 1, '#9AA6BC'); });
    fillRR(g, 516, t.y - 14, 13, 14, 3, '#FFFFFF'); g.strokeStyle = '#FFFFFF'; g.lineWidth = 2.5; g.beginPath(); g.arc(530, t.y - 7, 4, -1.2, 1.2); g.stroke(); fillRR(g, 516, t.y - 14, 13, 3, 1, '#C98E55');
    fillRR(g, 548, t.y - 5, 46, 5, 2, '#FFFFFF'); fillRR(g, 552, t.y - 7, 18, 3, 1, BLUE);
    fillRR(g, 612, t.y - 9, 30, 9, 3, '#3A4458'); fillRR(g, 616, t.y - 7, 10, 5, 1, '#1B1F3B');
    fillRR(g, 648, t.y - 26, 34, 26, 2, '#C99A6B'); fillRR(g, 648, t.y - 26, 34, 5, 1, '#B5865A'); g.fillStyle = 'rgba(255,240,210,.55)'; g.fillRect(662, t.y - 26, 6, 26);
    fillRR(g, 716, t.y - 14, 13, 14, 3, '#E46E78'); g.strokeStyle = '#E46E78'; g.lineWidth = 2.5; g.beginPath(); g.arc(730, t.y - 7, 4, -1.2, 1.2); g.stroke();
    fillRR(g, 742, t.y - 4, 30, 4, 2, '#FFFFFF');
  }
  function evTent(g, x, y, n) { /* a yellow numbered evidence marker */
    soft(g, x, y + 2, 22, 4, 0.25); g.fillStyle = '#E8B400'; g.beginPath(); g.moveTo(x - 16, y); g.lineTo(x - 6, y - 30); g.lineTo(x + 6, y - 30); g.lineTo(x + 16, y); g.closePath(); g.fill();
    g.fillStyle = Y; g.beginPath(); g.moveTo(x - 13, y - 2); g.lineTo(x - 4, y - 28); g.lineTo(x + 4, y - 28); g.lineTo(x + 13, y - 2); g.closePath(); g.fill(); text(g, String(n), x, y - 8, 13, 800, INK, 'center'); }
  function floorDoc(g, x, y, rot, title, col) { g.save(); g.translate(x, y); g.rotate(rot); g.scale(1, 0.55); soft(g, 0, 4, 40, 10, 0.18); fillRR(g, -26, -34, 52, 68, 2, '#FFFFFF'); fillRR(g, -26, -34, 52, 10, 1, col);
    g.fillStyle = '#C9D3E3'; for (var l = 0; l < 4; l++) g.fillRect(-20, -14 + l * 10, l % 2 ? 26 : 38, 3); g.restore(); text(g, title, x, y + 26, 8.5, 800, '#6B5A40', 'center'); }
  function paintFore(g, ext) {
    /* the foreground floor: evidence markers beside the paperwork they found, the waste bin, evidence boxes, a plant */
    floorDoc(g, 300, 676, -0.2, 'Quote.docx', BLUE); evTent(g, 252, 690, 1);
    floorDoc(g, 520, 716, 0.12, 'Stock.xlsx', '#14A38B'); evTent(g, 474, 730, 2);
    floorDoc(g, 880, 690, -0.1, 'Paper DO', '#E46E78'); evTent(g, 930, 700, 3);
    /* the waste bin (Sales' target) */
    soft(g, 724, 664, 30, 6, 0.26); g.fillStyle = '#B9C4D4'; g.beginPath(); g.moveTo(700, 610); g.lineTo(748, 610); g.lineTo(742, 662); g.lineTo(706, 662); g.closePath(); g.fill();
    fillE(g, 724, 610, 24, 6, '#8E9AAE'); fillE(g, 724, 610, 20, 4.5, '#6E7A8E'); g.strokeStyle = 'rgba(255,255,255,.45)'; g.lineWidth = 2; for (var b = 0; b < 4; b++) { g.beginPath(); g.moveTo(708 + b * 11, 616); g.lineTo(711 + b * 10, 656); g.stroke(); }
    fillE(g, 716, 607, 6, 5, '#FFFFFF'); fillE(g, 730, 606, 5, 4, '#F4F0E6');
    /* evidence boxes, stacked */
    [[1010, 750, 96, 70, 'EVIDENCE'], [1022, 680, 80, 60, 'SPREADSHEETS'], [-660, 760, 110, 78, 'EVIDENCE']].forEach(function (b) { soft(g, b[0] + b[2] / 2, b[1] + 3, b[2] * 0.6, 7, 0.28); fillRR(g, b[0], b[1] - b[3], b[2], b[3], 4, '#C99A6B'); fillRR(g, b[0] - 3, b[1] - b[3], b[2] + 6, 12, 3, '#B5865A');
      fillRR(g, b[0] + 12, b[1] - b[3] + 22, b[2] - 24, 18, 2, '#FFFFFF'); text(g, b[4], b[0] + b[2] / 2, b[1] - b[3] + 35, b[4].length > 9 ? 6.6 : 8, 800, '#7A5A30', 'center'); });
    plantTall(g, 250, 770, 1.0); plantTall(g, -560, 770, 1.05); evTentFore(g);
    /* the investigator's footprints, from the door to the board */
    g.fillStyle = 'rgba(120,80,30,.10)'; for (var fp = 0; fp < 9; fp++) { var q = fp / 8, fx0 = lerp(380, 1000, q), fy0 = lerp(780, 610, q) + (fp % 2 ? 9 : -9); g.save(); g.translate(fx0, fy0); g.rotate(-0.28); g.beginPath(); g.ellipse(0, 0, 9, 4.4, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(-12, 0, 4.6, 3.6, 0, 0, 7); g.fill(); g.restore(); }
  }

  /* ============================== the cast ============================== */
  var W = CR.who;
  var CON = W({ x: 880, y: 470, s: 0.54, ph: 0.3, skin: 1, hair: 0, style: 'short', outfit: 'shirt', top: BLUE, hands: [[-150, -320], [70, -200]], look: -0.8 });
  var FIN = W({ x: 448, y: 470, s: 0.5, ph: 1.1, skin: 0, hair: 0, style: 'bob', outfit: 'cardigan', top: '#E0456B', top2: '#FFFFFF', glasses: true, sit: true, chairCol: '#2A3550', id: PASS, hands: [[-60, -206], [60, -206]], look: 0.4 });
  var SAL = W({ x: 572, y: 470, s: 0.5, ph: 2.0, skin: 2, hair: 1, style: 'short', outfit: 'polo', top: '#F08A24', sit: true, chairCol: '#2A3550', id: PASS, hands: [[-60, -206], [60, -206]], look: 0.6 });
  var WH = W({ x: 696, y: 470, s: 0.5, ph: 2.7, skin: 3, hair: 0, style: 'short', outfit: 'shirt', top: '#14A38B', sit: true, chairCol: '#2A3550', id: PASS, hands: [[-60, -206], [60, -206]], look: 0.8 });
  var NT = W({ x: -400, y: 470, s: 0.5, ph: 1.5, skin: 2, hair: 0, style: 'bob', outfit: 'polo', top: '#7B5BD6', sit: true, chairCol: '#B88752', hands: [[-40, -210], [40, -210]], look: 0.5 });
  var ANA = W({ x: 1108, y: 470, s: 0.52, ph: 0.9, skin: 0, hair: 2, style: 'pony', outfit: 'cardigan', top: '#5B8DEF', top2: '#FFFFFF', hands: [[-70, -170], [110, -330]], look: 0.7 });
  var CREW = [
    { x0: 1060, x1: 1400, y: 492, spd: 16, ph: 0.3, label: 'TechNext project manager', lines: ['More evidence for the board: **every spreadsheet** the team uses.', 'Nothing gets built until it is **written down**.'], acts: ['nod', 'dc_boxup'],
      P: W({ s: 0.5, skin: 2, hair: 0, style: 'long', outfit: 'polo', top: '#1E3A6E', hold: 'box', hands: [[-60, -200], [70, -200]] }) },
    { x0: -930, x1: -650, y: 494, spd: 15, ph: 0.6, label: 'Office manager (client)', lines: ['Coffee for the **interview** room!', 'Ask me where the **paper delivery orders** go. I know everything.'], acts: ['spin', 'dc_cheers'],
      P: W({ s: 0.5, skin: 3, hair: 1, style: 'bun', outfit: 'cardigan', top: '#F2A33A', top2: '#FFFFFF', id: PASS, hold: 'tray', hands: [[-60, -230], [70, -150]] }) },
    { front: true, x0: -560, x1: 130, y: 706, spd: 18, ph: 0.2, label: 'TechNext consultant', lines: ['Next: the **warehouse** walk-through.', 'Same question for every department: how does it move **today**?'], acts: ['wave', 'dc_tablet'],
      P: W({ s: 0.58, skin: 0, hair: 1, style: 'short', outfit: 'polo', top: BLUE, hold: 'tablet', hands: [[-60, -212], [70, -150]] }) }
  ];

  /* the tap moves: every person has their own (CR.cast plays them; the props they use are drawn below) */
  var A = CR.ACT;
  A.dc_eureka = { dur: 2.0, fx: '', pose: function (P, u, t) { var a = u < 0.45; P.mood = a ? 'wow' : 'happy'; P.hands = a ? [[-80, -190], [40, -380]] : [[-130, -400], [120, -410]]; P.hop = a ? 0 : Math.sin((u - 0.45) / 0.55 * Math.PI) * 46; P.tilt = a ? -0.12 : Math.sin(t * 12) * 0.05; } };
  A.dc_point = { dur: 1.8, fx: 'spark', pose: function (P, u) { P.mood = 'happy'; P.sx = u < 0.4 ? Math.cos(u / 0.4 * Math.PI * 2) : 1; P.hands = [[-190, -380], [80, -180]]; P.hop = u < 0.4 ? Math.sin(u / 0.4 * Math.PI) * 20 : 0; } };
  A.dc_stamp = { dur: 1.5, fx: '', pose: function (P, u) { P.mood = u > 0.45 ? 'happy' : 'calm'; var up = u < 0.4 ? u / 0.4 : u < 0.48 ? 1 - (u - 0.4) / 0.08 : 0; P.hands = [[-60, -206], [70, -206 - up * 220]]; P.hop = u > 0.4 && u < 0.6 ? 6 : 0; } };
  A.dc_glasses = { dur: 1.6, fx: 'ask', pose: function (P, u, t) { P.mood = 'calm'; P.hands = [[-50, -330 + Math.sin(t * 9) * 6], [20, -380]]; P.tilt = -0.1; } };
  A.dc_toss = { dur: 1.7, fx: '', pose: function (P, u) { P.mood = u < 0.5 ? 'wow' : 'happy'; P.sx = u < 0.5 ? Math.cos(u / 0.5 * Math.PI * 2) : 1; var th = u > 0.5 && u < 0.7; P.hands = th ? [[-60, -206], [150, -360]] : u >= 0.7 ? [[-110, -380], [110, -380]] : [[-60, -206], [60, -260]]; } };
  A.dc_phone = { dur: 1.6, fx: 'note', pose: function (P, u, t) { P.mood = 'wow'; P.hop = Math.abs(Math.sin(u * Math.PI * 4)) * 8; P.hands = [[-90, -420 + Math.sin(t * 30) * 4], [80, -230]]; } };
  A.dc_empty = { dur: 1.8, fx: '', pose: function (P, u, t) { var sh = u > 0.3 && u < 0.75; P.mood = sh ? 'wow' : 'calm'; P.hands = [[-50 + (sh ? Math.sin(t * 30) * 12 : 0), -420], [50 + (sh ? Math.sin(t * 30) * 12 : 0), -420]]; } };
  A.dc_scan = { dur: 1.4, fx: '', pose: function (P, u) { P.mood = 'happy'; P.hands = [[-60, -206], [120, -300 + Math.sin(u * Math.PI * 3) * 30]]; P.tilt = 0.06; } };
  A.dc_pin = { dur: 1.6, fx: 'star', pose: function (P, u) { P.mood = 'happy'; P.hop = Math.sin(u * Math.PI) * 40; P.hands = [[-90, -300], [130, -430]]; } };
  A.dc_check = { dur: 1.4, fx: '', pose: function (P, u) { P.mood = 'happy'; P.hands = [[-70, -170], [110 + Math.sin(u * Math.PI) * 40, -330 - (u < 0.5 ? u : 1 - u) * 120]]; } };
  A.dc_boxup = { dur: 1.5, fx: 'spark', pose: function (P, u) { P.mood = 'happy'; P.hop = Math.sin(u * Math.PI) * 30; P.hands = [[-40, -400], [60, -400]]; } };
  A.dc_cheers = { dur: 1.5, fx: 'heart', pose: function (P, u) { P.mood = 'happy'; P.hands = [[-40, -430], [110, -380]]; P.hop = Math.abs(Math.sin(u * Math.PI * 2)) * 14; } };
  A.dc_tablet = { dur: 1.6, fx: 'star', pose: function (P, u, t) { P.mood = 'happy'; P.hands = [[-30, -380], [70, -330]]; P.tilt = Math.sin(t * 8) * 0.06; } };

  var FX = []; /* the props of the tap moves: a light bulb, a stamp, a paper ball, a "0", a pinned card... */
  function fx(kind, x, y, t, o) { FX.push({ k: kind, x: x, y: y, t0: t, o: o || {} }); }
  var NTT = { t: -9 }, STK = { t: -9 }, SCO = { t: -9 }, LENS = { t: -9 }, PRN = { t: -9, last: 0 }, PINS = { n: 0 }, STAMPS = [];
  function acting(st, name, t) { return st && st.rx === name ? (t - st.rxT) / A[name].dur : -1; }

  /* the note-taker (behind the title card, TechNext): idle, writes on her tablet, looks up at the whiteboard, sips her tea,
     nods along; tapped, she holds the tablet up to show the process map she drew and a "Mapped!" badge pops */
  function actNt(P, t) {
    var u = t - NTT.t, cyc = (t + 2) % 10; P.sx = 1; P.tilt = 0; P.hop = 0; P.talk = false; P.mood = 'calm'; P._tab = 1; P._cup = 0;
    if (cyc < 4.5) { P.hands = [[-30, -230], [30 + Math.sin(t * 7) * 10, -236 + Math.cos(t * 9) * 4]]; P.look = lerp(P.look, 0.2, 0.06); P.tilt = 0.04; }
    else if (cyc < 6.5) { P.hands = [[-30, -230], [40, -230]]; P.look = lerp(P.look, -0.9, 0.06); P.tilt = -0.06; P.mood = cyc > 5.6 ? 'happy' : 'calm'; }
    else if (cyc < 8.2) { P.hands = [[-30, -230], [64, -330]]; P._cup = 1; P.look = lerp(P.look, 0.6, 0.06); }
    else { P.hands = [[-30, -230], [40, -230]]; P.tilt = Math.sin(t * 6) * 0.06; P.look = 0.8; P.mood = 'happy'; }
    if (u < 2.2) { P.talk = true; P.mood = 'happy'; P._cup = 0; P.hands = [[-50, -360], [50, -360]]; P._tab = 2; P.hop = u < 0.6 ? Math.sin(u / 0.6 * Math.PI) * 12 : 0; P.look = 0.3;
      if (u > 0.3 && !NTT.b) { NTT.b = 1; fx('badge', P.x, P.y - 300, t, { life: 1.6 }); CR.burst('star', P.x, P.y - 260, t); } } else NTT.b = 0;
    P._u = u;
  }
  /* ============================== live drawing ============================== */
  function lens(g, x, y, r, rot) { g.save(); g.translate(x, y); g.rotate(rot || 0); g.strokeStyle = '#5C4630'; g.lineWidth = 7; g.lineCap = 'round'; g.beginPath(); g.moveTo(r * 0.7, r * 0.7); g.lineTo(r * 1.9, r * 1.9); g.stroke();
    fillE(g, 0, 0, r, r, 'rgba(210,235,255,.42)'); g.strokeStyle = '#B88A52'; g.lineWidth = 4; g.beginPath(); g.arc(0, 0, r, 0, 7); g.stroke(); g.strokeStyle = 'rgba(255,255,255,.8)'; g.lineWidth = 2.5; g.beginPath(); g.arc(0, 0, r * 0.7, 3.6, 4.4); g.stroke(); g.restore(); }
  function paintLive(g, t, now, S) {
    CO.crew(CREW, g, t, S, false);
    /* the WHO DOES WHAT whiteboard: an owner box, three team boxes, and the marker arrows drawing in, then wiped */
    var w = NC.wb, cyc = (t % 12) / 12, dr = clamp(cyc * 1.6, 0, 1), wipe = cyc > 0.92 ? 1 - (cyc - 0.92) / 0.08 : 1; g.save(); g.globalAlpha = wipe;
    g.strokeStyle = INK; g.lineWidth = 1.8; rr(g, w.x + 58, w.y + 46, 56, 20, 4); g.stroke(); text(g, 'Owner', w.x + 86, w.y + 60, 7.6, 800, INK, 'center');
    WHO.forEach(function (o, i) { var f = clamp(dr * 3 - i, 0, 1); if (f <= 0) return; var bx = w.x + 10 + i * 54, by = w.y + 104;
      g.strokeStyle = o[1]; g.lineWidth = 1.8; g.beginPath(); g.moveTo(w.x + 86, w.y + 66); g.lineTo(lerp(w.x + 86, bx + 24, f), lerp(w.y + 66, by, f)); g.stroke();
      if (f >= 1) { rr(g, bx, by, 48, 20, 4); g.stroke(); text(g, o[0], bx + 24, by + 13.5, 6.6, 800, o[1], 'center'); fillRR(g, bx + 6, by + 26, 36 * clamp(dr * 3 - i - 0.5, 0, 1), 2, 1, o[1]); } });
    g.restore();
    var mk = t % 12 < 7.5; if (mk) { var mx = w.x + 20 + ((t * 0.8) % 1) * (w.w - 40), my = w.y + 104 + Math.sin(t * 5) * 10; fillRR(g, mx - 3, my - 18, 6, 16, 2, BLUE); }
    /* the reading lamp's warm bulb flickers softly */
    fillE(g, NC.lamp.x - 24, 236, 8, 3, 'rgba(255,236,170,' + (0.75 + Math.sin(t * 3) * 0.1).toFixed(2) + ')');
    /* steam off the teapot; the note-taker */
    g.strokeStyle = 'rgba(160,170,190,.5)'; g.lineWidth = 1.8; g.lineCap = 'round'; for (var sm = 0; sm < 2; sm++) { var ph = (t * 0.5 + sm * 0.5) % 1; g.globalAlpha = 1 - ph; g.beginPath(); g.moveTo(NC.side.x - 11 + sm * 4, 378 - ph * 8); g.quadraticCurveTo(NC.side.x - 11 + sm * 4 + Math.sin(t * 3 + sm) * 4, 368 - ph * 12, NC.side.x - 11 + sm * 4, 358 - ph * 16); g.stroke(); } g.globalAlpha = 1;
    actNt(NT, t); K.person(g, NT, t);
    var h0 = handW(NT, 0), h1 = handW(NT, 1); if (NT._tab) { var up = NT._tab === 2, tx = (h0[0] + h1[0]) / 2, ty = Math.min(h0[1], h1[1]) - (up ? 16 : 6); g.save(); g.translate(tx, ty); g.rotate(up ? 0 : -0.2);
      fillRR(g, -22, -15, 44, 30, 4, '#2A3142'); fillRR(g, -19, -12, 38, 24, 2, '#FFFFFF'); if (up) { ['#E0456B', '#F08A24', '#14A38B'].forEach(function (c, i) { fillRR(g, -16 + i * 12, -6, 9, 7, 1.5, c); }); g.strokeStyle = RED; g.lineWidth = 1; g.beginPath(); g.moveTo(-7, -2.5); g.lineTo(-4, -2.5); g.moveTo(5, -2.5); g.lineTo(8, -2.5); g.stroke(); fillRR(g, -16, 5, 30, 2, 1, '#C9D3E3'); }
      else { g.fillStyle = '#C9D3E3'; for (var l = 0; l < 4; l++) g.fillRect(-15, -8 + l * 5, l === 3 ? 14 : 28, 1.6); } g.restore(); }
    if (NT._cup) { fillRR(g, h1[0] - 6, h1[1] - 12, 12, 11, 3, '#E0456B'); }
    /* the lanes: a red bead runs each string; on the lane being walked the cards light one by one, the laser dot and the lens follow */
    LANES.forEach(function (L, i) { var ly = laneY(i), n = L.nodes.length, on = S.hot === L.key, sp = on ? 0.8 : 0.22, ph = ((t * sp + i * 0.37) % 1) * (n - 1), j0 = Math.floor(ph), u = ph - j0;
      var bp = qpt(nodeX(j0) + 30, ly - 17, nodeX(j0 + 1) + 30, ly - 17, 9, u); fillE(g, bp[0], bp[1], 3.2, 3.2, RED); fillE(g, bp[0] - 1, bp[1] - 1, 1, 1, '#FFFFFF');
      if (on) { var lit = Math.floor(clamp((t - (S.lT || 0)) * 2.2, 0, n + 1));
        for (var j = 0; j < Math.min(lit, n); j++) { var cx = nodeX(j) + 30; g.globalAlpha = 0.22; fillRR(g, cx - 30, ly - 13, 60, 32, 2, L.col); g.globalAlpha = 1; fillE(g, cx + 22, ly + 12, 5, 5, '#2BC48A'); g.strokeStyle = '#FFFFFF'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(cx + 19.5, ly + 12); g.lineTo(cx + 21.5, ly + 14); g.lineTo(cx + 25, ly + 10); g.stroke(); }
        var lx = nodeX(0) + 30 + ((Math.sin(t * 1.4) + 1) / 2) * (nodeX(n - 1) - nodeX(0)); lens(g, lx, ly + 2, 22, 0.1); } });
    /* the clues: red notes, circled in marker; on the Gaps stop they wobble and the circles redraw */
    var gs = S.hot === 'gaps', st2 = t - STK.t;
    GAPS.forEach(function (s, i) { var x = CB.x + CB.w - 92, y = CB.y + 42 + i * 78, wob = gs ? Math.sin(t * 5 + i) * 0.07 : Math.sin(t * 0.8 + i * 2) * 0.012;
      g.save(); g.translate(x + 34, y + 24); g.rotate(-0.05 + i * 0.05 + wob); fillRR(g, -32, -22, 66, 48, 2, 'rgba(90,30,20,.15)'); fillRR(g, -34, -24, 66, 48, 2, '#FFB4AE');
      text(g, s[0], -1, -4, 7.6, 800, '#7A1F1A', 'center'); text(g, s[1], -1, 9, 7.6, 700, '#7A1F1A', 'center');
      var cu = gs ? clamp(((t * 0.8 + i * 0.3) % 1.6), 0, 1) : 1; g.strokeStyle = RED; g.lineWidth = 2; g.beginPath(); g.ellipse(-1, 2, 38, 22, -0.08, -1.2, -1.2 + cu * Math.PI * 2.1); g.stroke(); g.restore(); pin(g, x + 32, y + 2, RED); });
    if (st2 < 3) { var a = clamp(st2 * 3, 0, 1); g.save(); g.globalAlpha = a; g.translate(720, 118 + (1 - a) * -30); g.rotate(-0.08); fillRR(g, -30, -19, 60, 38, 2, Y); text(g, 'Gap noted', 0, 3, 7.6, 800, '#5A4600', 'center'); g.restore(); pin(g, 720, 101, BLUE); }
    /* the magnifier: on the tray, or (tapped) sweeping every lane of the board */
    var lu = (t - LENS.t) / 3.2; if (lu >= 0 && lu < 1) { var ln = Math.min(2, Math.floor(lu * 3)), lf = lu * 3 - ln, lxx = ln % 2 ? lerp(760, 400, lf) : lerp(400, 760, lf); lens(g, lxx, laneY(ln) + 2, 26, 0.2); }
    else lens(g, CB.x + 318, CB.y + CB.h - 12, 11, -1.25);
    /* the app line-up: a scan bar walks down, each app steps forward, gets its process step and a MATCH stamp */
    var tv = T.tv, ap = S.hot === 'apps', na = Math.floor(t * (ap ? 2.0 : 0.6)) % (APPS.length + 3);
    APPS.forEach(function (Ap, i) { var x = tv.x + 8 + (i % 3) * 59, y = tv.y + 28 + Math.floor(i / 3) * 66, on = i < na, fwd = on ? 3 : 0;
      fillRR(g, x, y + fwd, 54, 58, 5, on ? '#F6F7FB' : '#FBFBFD'); fillRR(g, x + 15, y + 6 + fwd, 24, 24, 6, on ? Ap[1] : '#D5DCE6'); fillRR(g, x + 21, y + 12 + fwd, 12, 12, 3, 'rgba(255,255,255,.55)');
      text(g, Ap[0], x + 27, y + 41 + fwd, 6.8, 800, on ? INK : '#9AA6BC', 'center'); text(g, on ? '← ' + Ap[2] : '…', x + 27, y + 51 + fwd, 5.8, 700, on ? '#5C6B7A' : '#C5CCD8', 'center');
      if (on) { g.save(); g.translate(x + 44, y + 9 + fwd); g.rotate(-0.25); g.strokeStyle = '#1E9E6A'; g.lineWidth = 1.4; rr(g, -13, -5, 26, 10, 2); g.stroke(); text(g, 'MATCH', 0, 2.6, 5.4, 800, '#1E9E6A', 'center'); g.restore(); } });
    var sb = tv.y + 22 + ((t * (ap ? 70 : 26)) % (tv.h - 26)); g.fillStyle = 'rgba(113,75,103,.14)'; g.fillRect(tv.x + 2, sb, tv.w - 4, 4);
    /* the case file (scope) and the quotation; tapped or on the Scope stop it opens */
    var sc = T.scope, so = S.hot === 'scope' ? 1 : clamp((2.4 - (t - SCO.t)) * 2, 0, 1);
    fillRR(g, sc.x, sc.y - 48, 64, 48, 3, '#E2C28E'); fillRR(g, sc.x + 4, sc.y - 54, 26, 8, 2, '#E2C28E'); fillRR(g, sc.x + 8, sc.y - 38, 48, 14, 2, '#FFFFFF'); text(g, 'SCOPE', sc.x + 32, sc.y - 28, 7.6, 800, BLUE, 'center');
    g.save(); g.translate(sc.x + 32, sc.y - 12); g.rotate(-0.15); g.strokeStyle = RED; g.lineWidth = 1.4; rr(g, -22, -6, 44, 11, 2); g.stroke(); text(g, 'CASE 01', 0, 2.6, 6, 800, RED, 'center'); g.restore();
    fillRR(g, sc.x + 72, sc.y - 10, 64, 10, 2, '#FFFFFF'); fillRR(g, sc.x + 76, sc.y - 7, 30, 3, 1.5, '#9AA6BC'); text(g, 'QUOTATION', sc.x + 104, sc.y - 13, 5.8, 800, '#5C6B7A', 'center');
    if (so > 0) { var px = 178, py = 188; g.save(); g.globalAlpha = so; fillRR(g, px + 3, py + 4, 164, 86, 6, 'rgba(60,40,10,.18)'); fillRR(g, px, py, 164, 86, 6, '#FFFDF6'); fillRR(g, px, py, 6, 86, 3, BLUE);
      text(g, 'Written scope', px + 14, py + 18, 9.5, 800, INK); ['Process map', 'App map', 'Gaps and fixes', 'Quotation'].forEach(function (s, i) { var ok = so >= 1 ? (t * 3 % 6) > i : true; fillRR(g, px + 14, py + 28 + i * 13, 9, 9, 2, ok ? '#2BC48A' : '#D5DCE6'); text(g, s, px + 29, py + 36 + i * 13, 7.6, 700, '#3D4560'); });
      g.save(); g.translate(px + 128, py + 66); g.rotate(-0.2); g.strokeStyle = RED; g.lineWidth = 2; rr(g, -26, -9, 52, 18, 3); g.stroke(); text(g, 'SIGNED', 0, 3.6, 8, 800, RED, 'center'); g.restore(); g.restore(); }
    /* the wall clock, the vent ribbon, steam from the window-side kettle... */
    var d = new Date(Date.now() + 8 * 3600e3); K.clockHands(g, T.clock, d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds());
    g.strokeStyle = '#7FB8EE'; g.lineWidth = 2.4; g.beginPath(); for (var rb = 0; rb < 3; rb++) { var rx0 = 1214 + rb * 34; g.moveTo(rx0, CEIL + 14); g.quadraticCurveTo(rx0 + 6 + Math.sin(t * 7 + rb) * 5, CEIL + 26, rx0 + 3 + Math.sin(t * 9 + rb * 2) * 7, CEIL + 40); } g.stroke();
    /* the printer: a page slides out every few seconds (or when tapped) */
    var p = T.prn, pc = (t - PRN.t) < 2.4 ? (t - PRN.t) / 2.4 : ((t + 3) % 9) / 2.4;
    if (pc < 1) { var out = clamp(pc * 1.6, 0, 1) * 30; fillRR(g, p.x + 24, p.y - 22 + out * 0.2, p.w - 48, 6 + out, 1, '#FFFFFF'); g.fillStyle = '#C9D3E3'; for (var pl = 0; pl < 3; pl++) if (out > 8 + pl * 7) g.fillRect(p.x + 30, p.y - 10 + pl * 7, 20 + pl * 6, 2); }
    fillE(g, p.x + p.w - 24, p.y - 25, 2.4, 2.4, Math.floor(t * 2) % 2 ? '#2BC48A' : '#BFEAD4');
    /* the interview schedule on the rolling board: the cards tick off one by one */
    var m = T.mob; [['Finance', '#E0456B', '09:30'], ['Sales', '#F08A24', '11:00'], ['Warehouse', '#14A38B', '14:00'], ['Sign-off', BLUE, '16:30']].forEach(function (r, i) { var y = m.y + 44 + i * 30, done = ((t * 0.35) % 5) > i + 0.6;
      fillRR(g, m.x + 10, y, m.w - 20, 24, 4, done ? '#F1F6FD' : '#FAFBFD'); fillRR(g, m.x + 10, y, 5, 24, 2, r[1]); text(g, r[0], m.x + 22, y + 15.5, 7.6, 800, INK); text(g, r[2], m.x + m.w - 36, y + 15.5, 6.6, 700, '#8A93A6', 'right');
      if (done) { g.strokeStyle = '#1E9E6A'; g.lineWidth = 2.4; g.lineCap = 'round'; g.beginPath(); g.moveTo(m.x + m.w - 30, y + 12); g.lineTo(m.x + m.w - 25, y + 17); g.lineTo(m.x + m.w - 16, y + 7); g.stroke(); } });
    for (var pn = 0; pn < PINS.n; pn++) { var cxp = m.x + 16 + (pn % 4) * 32, cyp = m.y + m.h - 10 - Math.floor(pn / 4) * 4; fillRR(g, cxp, cyp - 8, 26, 8, 1, [Y, '#FFB4AE', '#BFE3D6', '#CFE0F7'][pn % 4]); }
    /* the analyst's marker and the witnesses' table props (behind the sitters) */
    var hA = handW(ANA, 1); fillRR(g, hA[0] - 3, hA[1] - 18, 6, 18, 2, BLUE); fillRR(g, hA[0] - 3, hA[1] - 22, 6, 5, 1, '#1E4691');
    var hS = handW(SAL, 0), ph2 = acting(S.cast.sal, 'dc_phone', t); if (SAL.phone || ph2 >= 0) { g.save(); g.translate(hS[0] - 2, hS[1] + 2); g.rotate(-0.4); fillRR(g, -5, -14, 10, 26, 3, '#2A3142'); fillRR(g, -3.5, -11, 7, 18, 1.5, '#9FC4FF'); g.restore(); }
    var hW = handW(WH, 1); g.save(); g.translate(hW[0] + 4, hW[1] - 2); g.rotate(-0.5); fillRR(g, -6, -8, 26, 12, 4, '#F2A33A'); fillRR(g, -4, 2, 9, 14, 3, '#3A4458'); fillRR(g, 16, -6, 5, 8, 1, RED); g.restore();
  }
  function paintFrontLive(g, t, S) {
    CO.crew(CREW, g, t, S, true);
    var tb = T.table.y;
    /* the voice recorder's red light, the steam off both mugs */
    fillE(g, 489, tb - 9, 1.8, 1.8, Math.floor(t * 1.6) % 2 ? RED : '#F3B5B0');
    g.strokeStyle = 'rgba(160,170,190,.5)'; g.lineWidth = 1.8; g.lineCap = 'round';
    [522, 722].forEach(function (mx, i) { for (var s = 0; s < 2; s++) { var ph = (t * 0.6 + s * 0.5 + i * 0.3) % 1; g.globalAlpha = 1 - ph; g.beginPath(); g.moveTo(mx + s * 4, tb - 16 - ph * 6); g.quadraticCurveTo(mx + s * 4 + Math.sin(t * 3 + s) * 4, tb - 24 - ph * 10, mx + s * 4, tb - 32 - ph * 14); g.stroke(); } }); g.globalAlpha = 1;
    /* the warehouse scanner's red beep on the box */
    var sc = (t + 0.4) % 1.7 < 0.18 || acting(S.cast.wh, 'dc_scan', t) >= 0; if (sc) { var hW = handW(WH, 1); g.strokeStyle = 'rgba(226,69,60,.7)'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(hW[0] + 22, hW[1] - 6); g.lineTo(664, tb - 14); g.stroke(); fillRR(g, 650, tb - 16, 28, 2, 1, 'rgba(226,69,60,.8)'); }
    /* finance's calculator keys light under her finger; stamps she has left on the notepad */
    var hF = handW(FIN, 1); if (hF[1] > tb - 30) fillE(g, clamp(hF[0], 476, 490), tb - 4, 2.2, 1.4, 'rgba(255,255,255,.9)');
    STAMPS.forEach(function (s) { g.save(); g.translate(s[0], s[1]); g.rotate(s[2]); g.globalAlpha = 0.85; g.strokeStyle = RED; g.lineWidth = 1.3; rr(g, -11, -3.5, 22, 7, 1); g.stroke(); g.globalAlpha = 1; g.restore(); });
    drawFX(g, t, S);
    CR.draw(g, t);
  }
  function drawFX(g, t, S) {
    FX = FX.filter(function (f) { return t - f.t0 < (f.o.life || 1.6); });
    FX.forEach(function (f) { var u = (t - f.t0) / (f.o.life || 1.6), a = clamp((1 - u) * 3, 0, 1); if (u < 0) return; g.save(); g.globalAlpha = a;
      if (f.k === 'bulb') { var y = f.y - u * 30, s = Math.min(1, u * 5); g.translate(f.x, y); g.scale(s, s); fillE(g, 0, 0, 26, 26, 'rgba(255,216,74,.35)');
        fillE(g, 0, 0, 15, 15, '#FFE27A'); fillRR(g, -7, 12, 14, 9, 2, '#9AA6BC'); g.strokeStyle = '#F2A33A'; g.lineWidth = 2.5; g.lineCap = 'round'; for (var r = 0; r < 7; r++) { var an = -Math.PI + r * Math.PI / 6; g.beginPath(); g.moveTo(Math.cos(an) * 20, Math.sin(an) * 20); g.lineTo(Math.cos(an) * 28, Math.sin(an) * 28); g.stroke(); } }
      else if (f.k === 'ball') { var q = clamp(u * 1.25, 0, 1), x = lerp(f.x, 724, q), y2 = lerp(f.y, 612, q) - Math.sin(q * Math.PI) * 160; g.translate(x, y2); g.rotate(u * 12); fillE(g, 0, 0, 8, 7, '#FFFFFF'); g.strokeStyle = '#C9D3E3'; g.lineWidth = 1; g.beginPath(); g.moveTo(-5, -2); g.lineTo(3, 3); g.moveTo(-2, 4); g.lineTo(4, -4); g.stroke(); }
      else if (f.k === 'badge') { var yb = f.y - u * 30, sb = Math.min(1, u * 6); g.translate(f.x, yb); g.scale(sb, sb); fillRR(g, -36, -13, 72, 24, 12, '#E6F6EE'); g.strokeStyle = '#1E9E6A'; g.lineWidth = 2; rr(g, -36, -13, 72, 24, 12); g.stroke(); text(g, 'Mapped!', 0, 3.6, 9, 800, '#1E9E6A', 'center'); }
      else if (f.k === 'swish') { text(g, 'swish!', f.x, f.y - u * 20, 12, 800, BLUE, 'center'); }
      else if (f.k === 'zero') { var y3 = f.y - u * 40; fillRR(g, f.x - 22, y3 - 18, 44, 30, 10, '#FFFFFF'); g.strokeStyle = '#F2A33A'; g.lineWidth = 2; rr(g, f.x - 22, y3 - 18, 44, 30, 10); g.stroke(); text(g, '0 left', f.x, y3 + 2, 9, 800, '#B7791F', 'center'); }
      else if (f.k === 'beep') { g.strokeStyle = RED; g.lineWidth = 2; for (var b = 0; b < 3; b++) { g.globalAlpha = a * (1 - b * 0.25); g.beginPath(); g.arc(f.x, f.y, 8 + u * 30 + b * 8, -0.7, 0.7); g.stroke(); } g.globalAlpha = a; text(g, 'beep', f.x + 30, f.y - 14, 9, 800, RED, 'center'); }
      else if (f.k === 'ring') { g.strokeStyle = '#F08A24'; g.lineWidth = 2.4; g.lineCap = 'round'; [-1, 1].forEach(function (d) { for (var r2 = 0; r2 < 2; r2++) { g.beginPath(); g.arc(f.x, f.y, 14 + r2 * 9 + Math.sin(t * 30) * 2, d < 0 ? Math.PI - 0.6 : -0.6, d < 0 ? Math.PI + 0.6 : 0.6); g.stroke(); } }); text(g, 'ring!', f.x, f.y - 30, 10, 800, '#F08A24', 'center'); }
      else if (f.k === 'pages') { for (var pg = 0; pg < 4; pg++) { var px = f.x + (pg - 1.5) * 24 * u + Math.sin(t * 6 + pg) * 4, py = f.y - u * 50 - pg * 4; g.save(); g.translate(px, py); g.rotate(Math.sin(t * 5 + pg) * 0.6); fillRR(g, -7, -9, 14, 18, 1, '#FFFFFF'); g.fillStyle = '#C9D3E3'; g.fillRect(-4, -4, 8, 1.5); g.fillRect(-4, 0, 6, 1.5); g.restore(); } }
      else if (f.k === 'laser') { var p0 = f.o.from(), p1 = f.o.to; g.strokeStyle = 'rgba(226,69,60,.55)'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(p0[0], p0[1]); g.lineTo(p1[0], p1[1]); g.stroke(); fillE(g, p1[0], p1[1], 5, 5, 'rgba(226,69,60,.9)'); fillE(g, p1[0], p1[1], 10, 10, 'rgba(226,69,60,.2)'); }
      else if (f.k === 'connect') { var q2 = clamp(u * 2, 0, 1), a0 = [CB.x + CB.w - 58, CB.y + 66], a1 = [T.tv.x + 8, T.tv.y + 70], pm = qpt(a0[0], a0[1], a1[0], a1[1], 30, q2); g.strokeStyle = RED; g.lineWidth = 2; g.beginPath(); g.moveTo(a0[0], a0[1]); for (var cq = 1; cq <= 12; cq++) { var pp = qpt(a0[0], a0[1], a1[0], a1[1], 30, q2 * cq / 12); g.lineTo(pp[0], pp[1]); } g.stroke(); fillE(g, pm[0], pm[1], 4, 4, RED); }
      g.restore(); });
  }
  function paintForeLive(g, t, S) {
    K.zfore(g, t, S, [], function () { CO.crew(CREW, g, t, S, 'fore'); });
    /* the consultant's magnifier and laser pointer (his hands are drawn over the handles) */
    var hL = handW(CON, 0), hR = handW(CON, 1), lane = ['o2c', 'p2p', 'r2r', 'gaps'].indexOf(S.hot), rx = S.cast.con.rx;
    fillRR(g, hL[0] - 12, hL[1] - 4, 18, 6, 3, '#3A4458'); fillE(g, hL[0] - 13, hL[1] - 1, 2, 2, RED);
    if (lane >= 0 && !rx) { var ty = lane < 3 ? laneY(lane) + Math.sin(t * 2) * 6 : CB.y + 120 + Math.sin(t * 2) * 60, tx = lane < 3 ? nodeX(0) + 30 + ((t * 0.6) % 1) * (nodeX(LANES[lane].nodes.length - 1) - nodeX(0)) : CB.x + CB.w - 58;
      g.strokeStyle = 'rgba(226,69,60,.35)'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(hL[0] - 14, hL[1] - 1); g.lineTo(tx, ty); g.stroke(); fillE(g, tx, ty, 9, 9, 'rgba(226,69,60,.22)'); fillE(g, tx, ty, 4, 4, RED); }
    var eu = acting(S.cast.con, 'dc_eureka', t), lr = eu >= 0 && eu < 0.45 ? [headW(CON)[0] + 40, headW(CON)[1] + 4] : [hR[0] + 6, hR[1] - 18]; lens(g, lr[0], lr[1], eu >= 0 && eu < 0.45 ? 26 : 15, eu >= 0 && eu < 0.45 ? 0.6 : -0.3);
    /* the analyst's index card in hand; finance's ledger */
    var hA0 = handW(ANA, 0); fillRR(g, hA0[0] - 4, hA0[1] - 22, 22, 16, 1.5, Y);
    CR.draw(g, t);
  }

  /* ============================== the cast's idle loops ============================== */
  function look(P, st, t, S, rest) { P.look = lerp(P.look, t < st.until ? clamp((S.nexi.x - P.x) / 160, -1, 1) : rest, 0.08); }
  window.IXW.worlds.discovery = {
    pan: [-300, 1140],
    paintBg: paintBg, windowBehind: true, paintFrame: paintFrame, paintBack: paintBack, paintFront: paintFront, paintFore: paintFore,
    paintWindow: function (g, t) {
      [T.win, T.winL].forEach(function (w, wi) { g.save(); g.beginPath(); g.rect(w.x, w.y, w.w, w.h); g.clip();
        for (var i = 0; i < 3; i++) { var cx = w.x - 80 + ((t * (5 + i * 2) + i * 200 + wi * 90) % (w.w + 160)), cy = w.y + 120 + i * 26; g.fillStyle = 'rgba(255,255,255,.88)'; g.beginPath(); g.ellipse(cx, cy, 36, 10, 0, 0, Math.PI * 2); g.ellipse(cx + 16, cy - 7, 20, 11, 0, 0, Math.PI * 2); g.fill(); }
        var bx = w.x + ((t * 22 + wi * 300) % (w.w + 200)) - 100, by = w.y + 150 + Math.sin(t * 0.7 + wi) * 14; g.strokeStyle = '#4A5A78'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(bx - 6, by - 2 + Math.sin(t * 9) * 2); g.lineTo(bx, by); g.lineTo(bx + 6, by - 2 + Math.sin(t * 9) * 2); g.stroke(); g.restore(); });
    },
    paintLive: paintLive, paintFrontLive: paintFrontLive, paintForeLive: paintForeLive,
    calmView: [230, -120, 750, 600],
    moteCol: 'rgba(216,172,116,.35)',
    glow: {
      o2c: function (g) { rr(g, CB.x + 12, laneY(0) - 26, 480, 52, 10); },
      p2p: function (g) { rr(g, CB.x + 12, laneY(1) - 26, 480, 52, 10); },
      r2r: function (g) { rr(g, CB.x + 12, laneY(2) - 26, 480, 52, 10); },
      gaps: function (g) { rr(g, CB.x + CB.w - 104, CB.y + 26, 96, 248, 10); },
      apps: function (g) { var tv = T.tv; rr(g, tv.x - 12, tv.y - 12, tv.w + 24, tv.h + 24, 10); },
      scope: function (g) { var c = T.scope; rr(g, c.x - 8, c.y - 62, 150, 70, 10); },
      sticky: function (g) { rr(g, 684, 94, 72, 48, 8); },
      lens: function (g) { rr(g, CB.x + 290, CB.y + CB.h - 34, 66, 40, 8); },
      printer: function (g) { var p = T.prn; rr(g, p.x - 4, p.y - 44, p.w + 8, 52, 8); }
    },
    backGlow: ['o2c', 'p2p', 'r2r', 'gaps', 'apps', 'scope', 'sticky', 'lens', 'printer'],
    cast: [
      { id: 'con', behind: false, keys: [], P: CON, act: function (P, t, S) { var st = S.cast.con, lane = ['o2c', 'p2p', 'r2r', 'gaps'].indexOf(S.hot), cyc = (t + 2) % 9;
        /* idle: paces in front of the board, lifts the magnifier to an eye now and then, aims the laser on a lane */
        var walk = lane < 0 && cyc > 5; P.x = 880 + (walk ? Math.sin((cyc - 5) / 4 * Math.PI * 2) * 18 : 0); P.hop = walk ? Math.abs(Math.sin(t * 7)) * 3 : 0;
        P.talk = t < st.until || lane >= 0; P.mood = P.talk ? 'happy' : 'calm';
        P.hands = lane >= 0 ? [[-190, -360 + (lane < 3 ? lane * 18 : 40)], [70, -200]] : cyc < 2.4 ? [[-80, -180], [40, -370]] : [[-90, -190 + Math.sin(t * 1.3) * 6], [80, -210]];
        look(P, st, t, S, walk ? (Math.cos((cyc - 5) / 4 * Math.PI * 2) > 0 ? 0.6 : -0.6) : -0.8);
        if (!CR.cast(P, st, t, ['dc_point', 'dc_eureka'])) P.tilt = cyc < 2.4 && lane < 0 ? 0.08 : 0;
        if (st.rx === 'dc_eureka' && st._fx !== st.rxT) { st._fx = st.rxT; fx('bulb', P.x + 20, P.y - 300, st.rxT + 0.9, { life: 1.4 }); }
        if (st.rx === 'dc_point' && st._fx !== st.rxT) { st._fx = st.rxT; fx('connect', 0, 0, t, { life: 2.2 }); } } },
      { id: 'fin', behind: true, keys: ['r2r'], P: FIN, act: function (P, t, S) { var st = S.cast.fin, busy = S.hot === 'r2r', cyc = (t + P.ph * 3) % 7;
        /* idle: taps the calculator, pushes her glasses up every few seconds */
        P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm';
        P.hands = busy ? [[-60, -206], [90, -320 + Math.sin(t * 4) * 10]] : cyc > 6.2 ? [[-60, -206], [44, -368]] : [[-60, -206], [70 + Math.sin(t * 2) * 8, -212 + Math.abs(Math.sin(t * 9)) * -8]];
        look(P, st, t, S, cyc > 6.2 ? 0 : 0.5);
        if (!CR.cast(P, st, t, ['dc_glasses', 'dc_stamp'])) P.tilt = cyc > 6.2 ? -0.05 : 0;
        var su = acting(st, 'dc_stamp', t); if (su >= 0.42 && st._fx !== st.rxT) { st._fx = st.rxT; STAMPS.push([466 + hash(t) * 8, T.table.y - 3, (hash(t * 3) - 0.5) * 0.4]); if (STAMPS.length > 4) STAMPS.shift(); fx('pages', P.x + 30, P.y - 110, t, { life: 1.2 }); CR.burst('spark', P.x + 30, P.y - 110, t); }
        if (st.rx === 'dc_glasses' && st._fx !== st.rxT) { st._fx = st.rxT; fx('pages', P.x - 20, P.y - 140, t, { life: 1.4 }); } } },
      { id: 'sal', behind: true, keys: ['o2c'], P: SAL, act: function (P, t, S) { var st = S.cast.sal, busy = S.hot === 'o2c', cyc = (t + 1) % 8, call = cyc < 4.5;
        /* idle: on the phone to a customer (talks, listens), then back to the notepad */
        SAL.phone = call && !busy; P.talk = t < st.until || busy || (call && (t % 2) < 1.2); P.mood = P.talk ? 'happy' : 'calm';
        P.hands = busy ? [[-60, -206], [90, -320 + Math.sin(t * 4) * 10]] : call ? [[-96, -380], [60 + Math.sin(t * 2.4) * 22, -240 + Math.sin(t * 3) * 14]] : [[-60, -206], [60, -210 + Math.abs(Math.sin(t * 5)) * -6]];
        look(P, st, t, S, call ? -0.5 : 0.3);
        if (!CR.cast(P, st, t, ['dc_phone', 'dc_toss'])) P.tilt = call ? -0.08 : 0;
        var tu = acting(st, 'dc_toss', t); if (tu >= 0.55 && st._fx !== st.rxT) { st._fx = st.rxT; var h = handW(P, 1); fx('ball', h[0], h[1], t, { life: 1.0 }); fx('swish', 724, 590, t + 0.85, { life: 1.0 }); }
        if (st.rx === 'dc_phone' && st._fx !== st.rxT) { st._fx = st.rxT; fx('ring', P.x - 50, P.y - 200, t, { life: 1.4 }); } } },
      { id: 'wh', behind: true, keys: ['p2p'], P: WH, act: function (P, t, S) { var st = S.cast.wh, busy = S.hot === 'p2p', cyc = (t + 3) % 6.5;
        /* idle: scans the box on the table, counts on his fingers */
        P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm';
        P.hands = busy ? [[-60, -206], [90, -320 + Math.sin(t * 4) * 10]] : cyc > 5 ? [[-40, -280], [40 + Math.sin(t * 8) * 10, -290]] : [[-80, -214], [-10, -232 + Math.sin(t * 3) * 6]];
        look(P, st, t, S, cyc > 5 ? 0 : -0.5);
        if (!CR.cast(P, st, t, ['dc_scan', 'dc_empty'])) P.tilt = 0;
        var eu = acting(st, 'dc_empty', t); if (eu >= 0.35 && st._fx !== st.rxT) { st._fx = st.rxT; fx('zero', P.x, P.y - 290, t, { life: 1.4 }); }
        if (st.rx === 'dc_scan' && st._fx !== st.rxT) { st._fx = st.rxT; fx('beep', 664, T.table.y - 30, t, { life: 1.1 }); } } },
      { id: 'ana', behind: true, keys: ['apps'], P: ANA, act: function (P, t, S) { var st = S.cast.ana, busy = S.hot === 'apps', cyc = (t + 4) % 6;
        /* idle: writes on the interview board, steps back to read it, writes again */
        var back = cyc > 4; P.x = 1108 - (back ? Math.sin((cyc - 4) / 2 * Math.PI) * 16 : 0);
        P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm';
        P.hands = busy ? [[-150, -330 + Math.sin(t * 3) * 8], [60, -200]] : back ? [[-60, -200], [60, -220]] : [[-70, -170], [104 + Math.sin(t * 6) * 10, -320 + Math.sin(t * 11) * 5]];
        look(P, st, t, S, busy ? -0.8 : 0.8);
        CR.cast(P, st, t, ['dc_check', 'dc_pin']);
        if (st.rx === 'dc_pin' && st._fx !== st.rxT) { st._fx = st.rxT; PINS.n = (PINS.n % 8) + 1; } } }
    ],
    toy: function (name, S, t) {
      if (name === 'sticky') { STK.t = t; CR.burst('spark', CB.x + 70, CB.y + CB.h - 40, t); }
      if (name === 'scope') SCO.t = t;
      if (name === 'lens') { LENS.t = t; S.lT = t; }
      if (name === 'printer') { PRN.t = t; CR.burst('spark', T.prn.x + 50, T.prn.y - 30, t); }
    },
    hit: function (x, y, S, t) { var r = CR.hitWalker(x, y, t); if (r) return r;
      if (Math.abs(x - NT.x) < 60 && y < NT.y + 6 && y > NT.y - 240) { NTT.t = t; return { say: 'Every answer goes into the **process map**, in your own words.', near: [-250, 80], pose: 'love', who: 'TechNext note-taker' }; }
      return null; },
    onStop: function (key, S, t) { if (['o2c', 'p2p', 'r2r'].indexOf(key) >= 0) S.lT = t; }
  };
})(window.IXW && window.IXW.kit, window.CR, window.CO);
