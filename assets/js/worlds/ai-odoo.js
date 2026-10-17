/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: ai-odoo (/odoo/ai-integration) — AI inside Odoo as a professional kitchen. The AI sous-chef (a kitchen robot, not a
   person) preps everything: paper bills go through the scanner, it reads them into the Odoo vendor bill on the order screen
   field by field and matches the purchase order from the pantry of the client's own records; the prepared bill goes to the
   pass under the heat lamps, where the head chef (a person: the client's finance lead) approves each plate before it leaves;
   every step is clipped to the ticket rail (logged on the record); the expediter (the client's support agent) edits and sends
   the reply the AI drafted; the chalkboard answers a question from the pantry, with the source. TechNext's AI engineer tastes
   the sauce (measures accuracy on the client's data). Clients wear grey passes, TechNext the blue ID. Every person has an idle
   loop and a tap choreography of their own; the robot, the scanner and the service bell are tappable too. */
(function (K, CR, CO) {
  'use strict';
  if (!K || !CR || !CO) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed;
  var F = 470, CEIL = -232;
  var PUR = '#714B67', VIO = '#7B5CD6', VIO_L = '#EFEAFB', OK = '#1E9E6A', INK = '#1B1F3B', STEEL = '#C9D1DC', STEEL_L = '#E8EDF3', STEEL_D = '#97A3B4', COP = '#C8794A', HERB = '#3FA66B', TOM = '#E2553D', AMB = '#FFB347', PINK = '#E0456B', BLUE = '#3167CA', CHALK = '#2F3D38';
  var CHB = { x: 176, y: -140, w: 168, h: 116 }, PAN = { x: 176, y: -6, w: 168 }, RAIL = { x: 360, y: -136, w: 636, h: 62 };
  var BILL = { x: 360, y: -58, w: 272, h: 194 }, PREP = { x: 344, y: 360, w: 292 }, PASS = { x: 642, y: 380, w: 362 }, RPL = { x: 884, y: 236, w: 114, h: 134 };
  var BOT = { x: 520 }, SCAN = { x: 354, y: 326 }, BELL = { x: 858, y: 380 }, LAMPS = [690, 760, 830];
  var WINS = [{ x: -760, y: -110, w: 150, h: 250 }];
  var FIELDS = [['Vendor', 'Harbourline Supplies'], ['Bill date', '12 Sep 2026'], ['Total', 'S$ 1,284.00'], ['PO match', 'PO00123']];
  var JARS = [['Purchase orders', '#C8794A', 'match'], ['Vendor bills', '#E9A23B', 'capture'], ['Sales orders', '#3FA66B', 'ask'], ['Helpdesk', '#E0456B', 'draft'], ['Products', '#7B5CD6', '']];
  function setU(g, sx, sy, k) { g.translate(sx, sy); g.scale(k, k); }
  function extOf(W, H, k, sx, sy) { return { l: -(sx + 24) / k, r: (W - sx) / k, t: -(sy + 24) / k, b: (H - sy) / k }; }
  function ease(u) { u = clamp(u, 0, 1); return u * u * (3 - 2 * u); }
  function hw(P, i) { var h = P.hands[i], sxk = P.sx == null ? 1 : P.sx; return [P.x + h[0] * P.s * sxk, P.y + (h[1] - (P.hop || 0)) * P.s]; }
  function tapU(st, t, dur) { if (!st || !st.wave) return -1; var u = (t - (st.wave - 1.6)) / dur; return u >= 0 && u < 1 ? u : -1; }
  function looks(P, st, t, S, rest) { P.look = lerp(P.look, t < st.until ? clamp((S.nexi.x - P.x) / 160, -1, 1) : rest, 0.08); }
  function spark(g, x, y, r, col) { g.fillStyle = col; g.beginPath(); g.moveTo(x, y - r); g.quadraticCurveTo(x, y, x + r, y); g.quadraticCurveTo(x, y, x, y + r); g.quadraticCurveTo(x, y, x - r, y); g.quadraticCurveTo(x, y, x, y - r); g.fill(); }
  function tick(g, x, y, r) { fillE(g, x, y, r, r, OK); g.strokeStyle = '#FFFFFF'; g.lineWidth = r * 0.28; g.lineCap = 'round'; g.beginPath(); g.moveTo(x - r * 0.45, y); g.lineTo(x - r * 0.1, y + r * 0.38); g.lineTo(x + r * 0.5, y - r * 0.38); g.stroke(); }
  function wrap(g, s, x, y, max, lh, size, weight, col, n) { var line = '', ln = 0; s.split(' ').forEach(function (w) { if ((line + w).length > max) { text(g, line, x, y + ln * lh, size, weight, col); line = ''; ln++; } line += w + ' '; }); text(g, line, x, y + ln * lh, size, weight, col); }
  function steam(g, x, y, t, n, h) { for (var i = 0; i < n; i++) { var u = ((t * 0.5 + i / n) % 1); g.globalAlpha = (1 - u) * 0.55; fillE(g, x + Math.sin(t * 2 + i * 2.3) * 7 * u, y - u * (h || 70), 6 + u * 12, 6 + u * 12, '#FFFFFF'); } g.globalAlpha = 1; }
  function plate(g, x, y, r, food) { fillE(g, x, y + 2, r + 2, r * 0.32 + 2, 'rgba(30,40,70,.18)'); fillE(g, x, y, r + 1.5, r * 0.32 + 1.5, '#AEB8C6'); fillE(g, x, y, r, r * 0.32, '#FFFFFF'); fillE(g, x, y - 1, r * 0.7, r * 0.2, '#F1F4F8'); if (food) food(g, x, y); }
  function pot(g, x, y, w, h, col) { fillRR(g, x - w / 2, y - h, w, h, 6, col); fillRR(g, x - w / 2 - 4, y - h - 4, w + 8, 7, 3, K.tone(col, 0.15)); fillRR(g, x - w / 2 - 12, y - h + 8, 12, 5, 2, '#2A3550'); fillRR(g, x + w / 2, y - h + 8, 12, 5, 2, '#2A3550'); g.fillStyle = 'rgba(255,255,255,.25)'; g.fillRect(x - w / 2 + 6, y - h + 6, 4, h - 12); }

  /* ------------------------------ the static layers ------------------------------ */
  function paintBg(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    CO.sky(g, e, CEIL, 200, [[0, '#86C5F2'], [1, '#E6F4FC']]); CO.skyPH(g, e.l, e.r, 120, 160, { tall: -650 });
    g.fillStyle = '#DDEFD9'; g.fillRect(e.l, 150, e.r - e.l, 60); g.restore();
  }
  function paintWindow(g, t) { WINS.forEach(function (w) { for (var c = 0; c < 2; c++) K.cloud(g, w.x - 50 + ((hash(c + 5) * 200 + t * (5 + c * 2)) % (w.w + 100)), w.y + 40 + c * 50, 0.24 + c * 0.04); }); }
  function paintBack(g, e) {
    CREW.forEach(function (w) { if (w.x0 < 0) return; if (w.x1b == null) w.x1b = w.x1; w.x1 = Math.min(w.x1b, e.r - 150); });
    /* white subway tiles, a stainless band behind the counters, the window cut out */
    g.beginPath(); g.rect(e.l - 10, CEIL, e.r - e.l + 20, F - CEIL); WINS.forEach(function (w) { g.rect(w.x, w.y, w.w, w.h); }); g.fillStyle = '#FBFCFD'; g.fill('evenodd');
    g.save(); g.beginPath(); g.rect(e.l - 10, CEIL, e.r - e.l + 20, 300 - CEIL); WINS.forEach(function (w) { g.rect(w.x, w.y, w.w, w.h); }); g.clip('evenodd');
    g.strokeStyle = '#E1E6EE'; g.lineWidth = 1.4; g.beginPath(); for (var ty = CEIL; ty < 300; ty += 14) { g.moveTo(e.l - 10, ty); g.lineTo(e.r + 10, ty); var off = ((ty - CEIL) / 14) % 2 ? 14 : 0; for (var tx = Math.floor(e.l / 28) * 28 + off; tx < e.r + 28; tx += 28) { g.moveTo(tx, ty); g.lineTo(tx, ty + 14); } } g.stroke();
    g.fillStyle = 'rgba(123,92,214,.035)'; g.fillRect(e.l - 10, CEIL, e.r - e.l + 20, 300 - CEIL);
    g.restore();
    var sb = g.createLinearGradient(0, 300, 0, F); sb.addColorStop(0, '#E9EEF4'); sb.addColorStop(1, '#D3DAE4'); g.fillStyle = sb; g.fillRect(e.l - 10, 300, e.r - e.l + 20, F - 300);
    g.fillStyle = 'rgba(255,255,255,.5)'; for (var bx = Math.floor(e.l / 60) * 60; bx < e.r; bx += 60) g.fillRect(bx, 300, 1.5, F - 300); g.fillStyle = STEEL_D; g.fillRect(e.l - 10, 298, e.r - e.l + 20, 4);
    g.fillStyle = '#AEB8C6'; g.fillRect(e.l - 10, F - 12, e.r - e.l + 20, 12);
    /* the quarry-tile floor */
    var fg = g.createLinearGradient(0, F, 0, e.b); fg.addColorStop(0, '#DDE2E8'); fg.addColorStop(1, '#C9D0DA'); g.fillStyle = fg; g.fillRect(e.l - 10, F, e.r - e.l + 20, e.b - F + 10);
    g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = 1.6; g.beginPath(); for (var fy = F + 24; fy < e.b + 30; fy += 34) { g.moveTo(e.l - 10, fy); g.lineTo(e.r + 10, fy); } for (var fx = Math.floor(e.l / 54) * 54; fx < e.r + 54; fx += 54) { g.moveTo(fx, F); g.lineTo(fx + (fx - 560) * 0.35, e.b + 30); } g.stroke();
    g.fillStyle = 'rgba(30,50,80,.08)'; g.fillRect(e.l - 10, F, e.r - e.l + 20, 6);
    /* the ceiling and the long extraction hood */
    var cg = g.createLinearGradient(0, e.t, 0, CEIL); cg.addColorStop(0, '#E6EAF0'); cg.addColorStop(1, '#F4F6F9'); g.fillStyle = cg; g.fillRect(e.l - 10, e.t - 10, e.r - e.l + 20, CEIL - e.t + 10);
    fillRR(g, e.l - 10, CEIL - 4, e.r - e.l + 20, 8, 2, '#FFFFFF');
    var hg = g.createLinearGradient(0, CEIL, 0, -168); hg.addColorStop(0, '#DCE2EA'); hg.addColorStop(1, '#BAC4D1'); g.fillStyle = hg; g.beginPath(); g.moveTo(330, CEIL); g.lineTo(1010, CEIL); g.lineTo(1030, -168); g.lineTo(310, -168); g.closePath(); g.fill();
    g.fillStyle = 'rgba(255,255,255,.4)'; g.fillRect(310, -172, 720, 4); for (var mf = 0; mf < 8; mf++) { fillRR(g, 350 + mf * 82, -214, 70, 36, 4, '#C4CDD8'); g.strokeStyle = 'rgba(80,95,120,.25)'; g.lineWidth = 1; g.beginPath(); for (var ml = 0; ml < 7; ml++) { g.moveTo(354 + mf * 82 + ml * 10, -210); g.lineTo(354 + mf * 82 + ml * 10, -182); } g.stroke(); }
    /* ---- the left margin: the walk-in private pantry, the window with herbs, the range with the stock pot ---- */
    shadowed(g, 12, 5, 0.16, function () { fillRR(g, -940, -120, 170, F + 120, 8, STEEL); });
    fillRR(g, -928, -108, 146, F + 98, 6, STEEL_L); fillRR(g, -900, -80, 90, 70, 8, '#CFE6F6'); g.fillStyle = 'rgba(255,255,255,.6)'; g.fillRect(-890, -74, 18, 58);
    fillRR(g, -800, 120, 10, 70, 4, STEEL_D); fillRR(g, -918, 20, 126, 46, 8, VIO); text(g, 'PRIVATE PANTRY', -855, 40, 9, 800, '#FFFFFF', 'center'); text(g, 'data stays in your environment', -855, 54, 6.4, 700, '#E6DEFB', 'center');
    g.strokeStyle = STEEL_D; g.lineWidth = 3; g.beginPath(); g.arc(-855, 98, 8, Math.PI, 0); g.stroke(); fillRR(g, -866, 98, 22, 18, 4, '#5C6B7A');
    WINS.forEach(function (w) { g.lineWidth = 8; g.strokeStyle = '#FFFFFF'; g.strokeRect(w.x, w.y, w.w, w.h); g.lineWidth = 4; g.strokeStyle = STEEL_D; g.beginPath(); g.moveTo(w.x + w.w / 2, w.y); g.lineTo(w.x + w.w / 2, w.y + w.h); g.stroke();
      K.windowGlass(g, w); fillRR(g, w.x - 12, w.y + w.h, w.w + 24, 12, 4, STEEL_L);
      [w.x + 20, w.x + 62, w.x + 104].forEach(function (hx, i) { fillRR(g, hx, w.y + w.h - 22, 26, 22, 4, ['#C8794A', '#E9A23B', '#C8794A'][i]); for (var lf = 0; lf < 5; lf++) fillE(g, hx + 5 + lf * 4, w.y + w.h - 28 - (lf % 2) * 8, 5, 9, lf % 2 ? '#3FA66B' : '#57BF7F'); }); });
    /* the range and its hood */
    g.fillStyle = '#C4CDD8'; g.beginPath(); g.moveTo(-610, -40); g.lineTo(-470, -40); g.lineTo(-450, 30); g.lineTo(-630, 30); g.closePath(); g.fill(); fillRR(g, -632, 26, 184, 8, 3, STEEL_D);
    fillRR(g, -626, 330, 172, F - 330, 6, '#5C6B7A'); fillRR(g, -632, 322, 184, 14, 5, STEEL); [-590, -540, -490].forEach(function (kx) { fillE(g, kx, 360, 7, 7, '#E9EEF4'); }); fillRR(g, -612, 380, 144, 70, 6, '#3A4458'); fillRR(g, -600, 392, 120, 6, 3, STEEL_D);
    pot(g, -575, 322, 70, 66, STEEL_D); pot(g, -500, 322, 44, 34, COP);
    /* hanging copper pans */
    fillRR(g, -640, 80, 200, 6, 3, STEEL_D); [-620, -580, -536, -494].forEach(function (px, i) { var r = 16 + (i % 2) * 5; g.strokeStyle = STEEL_D; g.lineWidth = 2; g.beginPath(); g.moveTo(px, 86); g.lineTo(px, 98); g.stroke(); fillRR(g, px - 3, 98, 6, 22, 2, '#7A5236'); fillE(g, px, 120 + r, r, r, COP); fillE(g, px - r * 0.3, 116 + r, r * 0.3, r * 0.5, 'rgba(255,255,255,.25)'); });
    /* ---- the right margin: the swing doors to the dining room, a tray stand, a plant ---- */
    fillRR(g, 1040, 70, 180, F - 70, 6, STEEL_D); [1046, 1132].forEach(function (dx) { fillRR(g, dx, 78, 82, F - 84, 4, STEEL_L); fillE(g, dx + 41, 150, 22, 22, STEEL_D); fillE(g, dx + 41, 150, 18, 18, '#FFF3D6'); fillRR(g, dx + 8, 300, 66, 16, 4, STEEL); });
    fillRR(g, 1060, 36, 140, 26, 13, INK); text(g, 'SERVICE', 1130, 54, 11, 800, AMB, 'center');
    g.strokeStyle = '#7A5236'; g.lineWidth = 4; g.beginPath(); g.moveTo(1250, F); g.lineTo(1290, 400); g.moveTo(1330, F); g.lineTo(1290, 400); g.stroke(); fillE(g, 1290, 398, 46, 8, '#9A6B45');
    K.plant(g, { x: 1370, y: F }, '#FFFFFF', STEEL_L);

    pantryWall(g);
    /* ---- the chalkboard: ask your records ---- */
    shadowed(g, 12, 5, 0.18, function () { fillRR(g, CHB.x - 6, CHB.y - 6, CHB.w + 12, CHB.h + 12, 8, '#9A6B45'); }); fillRR(g, CHB.x, CHB.y, CHB.w, CHB.h, 4, CHALK);
    g.fillStyle = 'rgba(255,255,255,.04)'; g.fillRect(CHB.x + 10, CHB.y + 20, 60, 30); text(g, 'ASK YOUR RECORDS', CHB.x + 10, CHB.y + 16, 8, 800, '#FFFFFF'); text(g, 'sample', CHB.x + CHB.w - 10, CHB.y + 16, 6.4, 700, 'rgba(255,255,255,.55)', 'right');
    fillRR(g, CHB.x + 10, CHB.y + CHB.h + 6, 40, 5, 2, '#FFFFFF'); fillRR(g, CHB.x + 56, CHB.y + CHB.h + 6, 18, 5, 2, '#F7C2CF');
    /* ---- the pantry: the client's own records, scoped ---- */
    var sh0 = PAN.y; g.strokeStyle = STEEL_D; g.lineWidth = 5; g.beginPath(); g.moveTo(PAN.x + 4, sh0); g.lineTo(PAN.x + 4, F); g.moveTo(PAN.x + PAN.w - 4, sh0); g.lineTo(PAN.x + PAN.w - 4, F); g.stroke();
    fillRR(g, PAN.x + 18, sh0 + 6, PAN.w - 36, 22, 11, INK); text(g, 'YOUR DATA · pantry', PAN.x + PAN.w / 2, sh0 + 21, 8, 800, '#FFFFFF', 'center');
    for (var s = 0; s < 5; s++) { var y0 = sh0 + 116 + s * 74; fillRR(g, PAN.x - 2, y0, PAN.w + 4, 7, 2, STEEL);
      for (var j = 0; j < 3; j++) { var jx = PAN.x + 14 + j * 52, jc = JARS[s][1]; fillRR(g, jx, y0 - 50, 40, 50, 8, 'rgba(220,235,245,.75)'); fillRR(g, jx + 3, y0 - 34 + j * 4, 34, 32 - j * 4, 6, jc); fillRR(g, jx + 2, y0 - 56, 36, 9, 3, j === 1 ? STEEL_D : '#9A6B45'); g.fillStyle = 'rgba(255,255,255,.45)'; g.fillRect(jx + 5, y0 - 46, 4, 40); }
      fillRR(g, PAN.x + 20, y0 + 9, PAN.w - 40, 14, 3, '#FFFFFF'); text(g, JARS[s][0], PAN.x + PAN.w / 2, y0 + 19.5, 7.4, 800, INK, 'center'); }
    fillRR(g, PAN.x + PAN.w - 40, sh0 + 34, 32, 26, 5, '#F3EFFD'); g.strokeStyle = VIO; g.lineWidth = 2.4; g.beginPath(); g.arc(PAN.x + PAN.w - 24, sh0 + 44, 5, Math.PI, 0); g.stroke(); fillRR(g, PAN.x + PAN.w - 31, sh0 + 43, 14, 11, 2, VIO);
    text(g, 'scoped access', PAN.x + 16, sh0 + 52, 7, 800, VIO);
    /* ---- the ticket rail: every step clipped on the record ---- */
    fillRR(g, RAIL.x, RAIL.y + 4, RAIL.w, 12, 6, STEEL_D); fillRR(g, RAIL.x, RAIL.y + 4, RAIL.w, 5, 3, '#E6EBF1');
    text(g, 'LOGGED ON THE RECORD', RAIL.x + 8, RAIL.y - 2, 7, 800, '#5C6B7A');
    /* ---- the order screen (the Odoo vendor bill) ---- */
    shadowed(g, 16, 6, 0.2, function () { fillRR(g, BILL.x - 8, BILL.y - 8, BILL.w + 16, BILL.h + 16, 10, '#2A3142'); });
    fillRR(g, BILL.x, BILL.y, BILL.w, BILL.h, 4, '#FFFFFF'); fillRR(g, BILL.x, BILL.y, BILL.w, 24, 4, PUR); g.fillRect(BILL.x, BILL.y + 16, BILL.w, 8);
    text(g, 'Accounting · Vendor bill · Draft', BILL.x + 12, BILL.y + 16, 8.6, 800, '#FFFFFF'); spark(g, BILL.x + BILL.w - 16, BILL.y + 12, 6, '#FFFFFF');
    FIELDS.forEach(function (f, i) { text(g, f[0], BILL.x + 12, BILL.y + 52 + i * 32, 8.4, 700, '#8A96A8'); });
    /* ---- heat lamps over the pass: chains, shades, the warm light on the wall behind ---- */
    LAMPS.forEach(function (lx) { g.strokeStyle = STEEL_D; g.lineWidth = 1.6; g.beginPath(); g.moveTo(lx, RAIL.y + 16); g.lineTo(lx, 6); g.stroke();
      var lg = g.createRadialGradient(lx, 40, 4, lx, 60, 120); lg.addColorStop(0, 'rgba(255,190,100,.28)'); lg.addColorStop(1, 'rgba(255,190,100,0)'); g.fillStyle = lg; g.fillRect(lx - 120, 10, 240, 240);
      g.fillStyle = '#E2553D'; g.beginPath(); g.moveTo(lx - 22, 34); g.quadraticCurveTo(lx, -2, lx + 22, 34); g.closePath(); g.fill(); fillE(g, lx, 34, 22, 4, '#B8402C'); });
    /* the wall clock and the house rule over the expediter */
    shadowed(g, 8, 3, 0.14, function () { fillRR(g, 886, 120, 108, 52, 8, INK); }); text(g, 'HOUSE RULE', 940, 138, 7, 800, AMB, 'center'); text(g, 'the AI preps,', 940, 152, 8.2, 800, '#FFFFFF', 'center'); text(g, 'a person approves', 940, 164, 8.2, 800, '#FFFFFF', 'center');
    /* the reply screen's stand */
    fillRR(g, RPL.x + RPL.w / 2 - 4, RPL.y + RPL.h, 8, PASS.y - RPL.y - RPL.h, 2, STEEL_D);
  }
  /* ---- the back wall behind the title card: today's prep board, the knife rail, the labelled shelves, the labelling counter ---- */
  var WB = { x: -432, y: -96, w: 236, h: 150 }, PREPS = [['Vendor bills', 'read & matched'], ['Customer replies', 'drafted'], ['Questions', 'answered from your records']], LBC = { x: -446, y: 392, w: 500 };
  var SHELF = [{ y: 70, items: [['jar', TOM], ['jar', HERB], ['jar', AMB], ['plates'], ['jar', VIO], ['book', PUR, 'Accounting'], ['book', BLUE, 'Sales'], ['book', HERB, 'Inventory']] },
    { y: 150, items: [['bowls'], ['jar', '#E0456B'], ['jar', COP], ['jar', HERB], ['plates'], ['jar', AMB], ['jar', VIO], ['bowls']] }];
  function pantryWall(g) {
    /* today's prep: a whiteboard of what the AI preps, each waiting for a person's approval */
    var b = WB; shadowed(g, 12, 5, 0.16, function () { fillRR(g, b.x - 6, b.y - 6, b.w + 12, b.h + 12, 8, STEEL_D); }); fillRR(g, b.x, b.y, b.w, b.h, 4, '#FFFFFF');
    text(g, "TODAY'S PREP", b.x + 14, b.y + 22, 10, 800, INK); text(g, 'prepped by AI · approved by a person', b.x + 14, b.y + 34, 6.6, 700, VIO);
    PREPS.forEach(function (r, i) { var y = b.y + 56 + i * 30; fillRR(g, b.x + 14, y - 10, 14, 14, 4, VIO_L); text(g, r[0], b.x + 36, y, 8.6, 800, INK); text(g, r[1], b.x + 36, y + 10, 6.6, 700, '#8A96A8'); });
    fillRR(g, b.x + 10, b.y + b.h + 2, 60, 6, 3, STEEL_D); fillRR(g, b.x + 16, b.y + b.h - 2, 20, 5, 2, VIO); fillRR(g, b.x + 40, b.y + b.h - 2, 20, 5, 2, '#E0456B');
    /* the knife rail */
    fillRR(g, -170, -112, 150, 9, 4, '#4A5468'); [[-158, 52], [-134, 44], [-110, 60], [-86, 40], [-62, 50], [-38, 46]].forEach(function (k2, i) { fillRR(g, k2[0] - 3, -104, 6, 18, 2, i % 2 ? '#2A3142' : '#7A5236'); g.fillStyle = '#DCE3EC'; g.beginPath(); g.moveTo(k2[0] - 4, -86); g.lineTo(k2[0] + 4, -86); g.lineTo(k2[0] + (i % 3 === 0 ? 6 : 2), -86 + k2[1]); g.lineTo(k2[0] - 4, -86 + k2[1] - 6); g.closePath(); g.fill(); g.fillStyle = 'rgba(255,255,255,.6)'; g.fillRect(k2[0] - 2, -84, 1.4, k2[1] - 10); });
    /* a round wall clock and a fire blanket box */
    K.clockFace(g, { x: 20, y: -80, r: 24 }, STEEL_D); fillRR(g, 64, -60, 54, 64, 6, '#E2453C'); fillRR(g, 70, -54, 42, 20, 3, '#FFFFFF'); text(g, 'FIRE', 91, -46, 6.4, 800, '#E2453C', 'center'); text(g, 'BLANKET', 91, -38, 5.6, 800, '#E2453C', 'center'); fillRR(g, 84, -10, 14, 8, 3, '#FFFFFF');
    /* two open shelves: jars, plates, bowls, the Odoo cookbooks */
    SHELF.forEach(function (sh) { fillRR(g, -440, sh.y, 560, 8, 3, STEEL); g.fillStyle = STEEL_D; [-420, -140, 100].forEach(function (bx) { g.fillRect(bx, sh.y + 8, 5, 14); });
      var x = -428; sh.items.forEach(function (it) {
        if (it[0] === 'jar') { fillRR(g, x, sh.y - 38, 30, 38, 8, 'rgba(220,235,245,.85)'); fillRR(g, x + 3, sh.y - 26, 24, 24, 6, it[1]); fillRR(g, x - 1, sh.y - 44, 32, 8, 3, '#7A869C'); x += 40; }
        else if (it[0] === 'plates') { for (var p = 0; p < 5; p++) fillE(g, x + 26, sh.y - 4 - p * 5, 26, 4, p % 2 ? '#F1F4F8' : '#FFFFFF'); x += 62; }
        else if (it[0] === 'bowls') { for (var q = 0; q < 3; q++) { g.fillStyle = q % 2 ? '#F1F4F8' : '#FFFFFF'; g.beginPath(); g.ellipse(x + 22, sh.y - 6 - q * 9, 20, 12, 0, 0, Math.PI); g.fill(); } x += 50; }
        else { fillRR(g, x, sh.y - 48, 18, 48, 2, it[1]); g.save(); g.translate(x + 9, sh.y - 24); g.rotate(-Math.PI / 2); text(g, it[2], 0, 2.4, 6, 800, '#FFFFFF', 'center'); g.restore(); x += 22; }
      }); });
  }
  function labelCounter(g) { /* the labelling counter: stainless, a sink, a label printer, a tray of jars waiting for labels */
    var c = LBC; soft(g, c.x + c.w / 2, F + 4, c.w * 0.55, 9, 0.22);
    var cg = g.createLinearGradient(0, c.y, 0, F); cg.addColorStop(0, '#E6EBF1'); cg.addColorStop(1, '#C9D1DC'); fillRR(g, c.x, c.y + 8, c.w, F - c.y - 8, 4, cg);
    g.strokeStyle = 'rgba(80,95,120,.18)'; g.lineWidth = 1.4; [c.x + c.w / 3, c.x + c.w * 2 / 3].forEach(function (dx) { g.beginPath(); g.moveTo(dx, c.y + 20); g.lineTo(dx, F - 6); g.stroke(); fillRR(g, dx - 30, c.y + 30, 24, 4, 2, STEEL_D); });
    fillRR(g, c.x - 4, c.y, c.w + 8, 10, 3, STEEL); g.fillStyle = 'rgba(255,255,255,.6)'; g.fillRect(c.x, c.y + 1, c.w, 2);
    fillRR(g, c.x + 30, c.y + 1, 80, 6, 3, '#9AA6BC'); g.strokeStyle = STEEL_D; g.lineWidth = 4; g.beginPath(); g.moveTo(c.x + 70, c.y); g.lineTo(c.x + 70, c.y - 34); g.quadraticCurveTo(c.x + 70, c.y - 46, c.x + 84, c.y - 44); g.stroke();
    fillRR(g, -146, c.y - 26, 44, 26, 5, '#5C6B7A'); fillRR(g, -140, c.y - 22, 24, 10, 2, '#2A3142'); fillE(g, -110, c.y - 16, 2.4, 2.4, VIO);
    [[-62, TOM], [-38, HERB], [-14, AMB]].forEach(function (j) { fillRR(g, j[0] - 9, c.y - 22, 18, 22, 5, 'rgba(220,235,245,.85)'); fillRR(g, j[0] - 7, c.y - 14, 14, 12, 4, j[1]); fillRR(g, j[0] - 10, c.y - 26, 20, 5, 2, '#7A869C'); });
  }
  function paintFront(g, e) {
    labelCounter(g);
    /* the prep counter: stainless, a cutting board, the scanner at its left end, a pot on the burner */
    var p = PREP; soft(g, p.x + p.w / 2, F + 4, p.w * 0.6, 9, 0.22);
    var cg = g.createLinearGradient(0, p.y, 0, F); cg.addColorStop(0, '#E6EBF1'); cg.addColorStop(1, '#C9D1DC'); fillRR(g, p.x, p.y + 8, p.w, F - p.y - 8, 4, cg);
    g.strokeStyle = 'rgba(80,95,120,.18)'; g.lineWidth = 1.4; [p.x + p.w / 3, p.x + p.w * 2 / 3].forEach(function (dx) { g.beginPath(); g.moveTo(dx, p.y + 20); g.lineTo(dx, F - 6); g.stroke(); fillRR(g, dx - 30, p.y + 30, 24, 5, 2, STEEL_D); fillRR(g, dx + 6, p.y + 30, 24, 5, 2, STEEL_D); });
    fillRR(g, p.x - 6, p.y, p.w + 12, 12, 3, '#F1F4F8'); g.fillStyle = 'rgba(255,255,255,.7)'; g.fillRect(p.x - 4, p.y + 2, p.w + 8, 2);
    fillRR(g, 458, p.y - 6, 96, 7, 2, '#C98E55'); [[478, TOM], [492, HERB], [504, '#F2C94C'], [520, HERB], [534, TOM]].forEach(function (v, i) { fillE(g, v[0], p.y - 9 - (i % 2), 5, 3.4, v[1]); });
    fillRR(g, 572, p.y - 4, 50, 5, 2, '#3A4458'); pot(g, 597, p.y - 4, 40, 30, COP);
    /* the scanner: a bill goes in at the top, the tray of paper bills beside it */
    var s = SCAN; fillRR(g, s.x, s.y, 84, 34, 7, '#5C6B7A'); fillRR(g, s.x + 6, s.y - 8, 72, 10, 3, '#7A869C'); fillRR(g, s.x + 10, s.y + 10, 64, 4, 2, '#2A3142'); fillE(g, s.x + 70, s.y + 24, 3, 3, VIO);
    fillRR(g, s.x + 12, s.y - 22, 58, 16, 2, '#FFFFFF'); g.fillStyle = '#C9D3E3'; g.fillRect(s.x + 18, s.y - 18, 34, 2); g.fillRect(s.x + 18, s.y - 13, 26, 2);
    /* the pass: a long stainless shelf, warm under the lamps */
    var q = PASS; soft(g, q.x + q.w / 2, F + 4, q.w * 0.6, 9, 0.22);
    var pg = g.createLinearGradient(0, q.y, 0, F); pg.addColorStop(0, '#E6EBF1'); pg.addColorStop(1, '#C3CCD8'); fillRR(g, q.x, q.y + 8, q.w, F - q.y - 8, 4, pg);
    g.fillStyle = 'rgba(80,95,120,.14)'; for (var dv = 0; dv < 3; dv++) g.fillRect(q.x + 30 + dv * 116, q.y + 22, 90, 3);
    fillRR(g, q.x - 6, q.y, q.w + 12, 12, 3, '#F4F6F9'); LAMPS.forEach(function (lx) { var wg = g.createRadialGradient(lx, q.y + 4, 2, lx, q.y + 4, 44); wg.addColorStop(0, 'rgba(255,180,90,.45)'); wg.addColorStop(1, 'rgba(255,180,90,0)'); g.fillStyle = wg; g.fillRect(lx - 44, q.y - 6, 88, 22); });
    fillRR(g, q.x + 14, q.y + 30, 120, 22, 11, INK); text(g, 'THE PASS', q.x + 74, q.y + 45, 9, 800, AMB, 'center');
    fillRR(g, q.x + 150, q.y + 30, 150, 22, 11, '#FFFFFF'); text(g, 'a person approves each plate', q.x + 225, q.y + 45, 7.4, 800, INK, 'center');
    /* the reply screen's bezel (its content is live) */
    shadowed(g, 10, 4, 0.18, function () { fillRR(g, RPL.x - 5, RPL.y - 5, RPL.w + 10, RPL.h + 10, 8, '#2A3142'); });
    fillRR(g, RPL.x - 12, PASS.y - 6, RPL.w + 24, 6, 3, STEEL_D);
  }
  function paintFore(g, e) { /* the static foreground: crates of produce, a sack of rice, the rubber floor mats */
    function crate(x, y, col) { soft(g, x, y + 4, 56, 8, 0.24); fillRR(g, x - 44, y - 40, 88, 40, 5, '#C99A6B'); g.fillStyle = 'rgba(110,70,40,.25)'; g.fillRect(x - 44, y - 26, 88, 3); g.fillRect(x - 44, y - 12, 88, 3);
      for (var i = 0; i < 6; i++) fillE(g, x - 34 + i * 13.6, y - 44 - (i % 2) * 4, 8, 8, col); }
    crate(170, 712, TOM); crate(250, 724, HERB); crate(1000, 700, '#F2C94C');
    soft(g, 1110, 664, 40, 8, 0.24); fillRR(g, 1080, 610, 60, 54, 18, '#E9DCC4'); fillRR(g, 1092, 600, 36, 16, 6, '#D9C7A6'); text(g, 'RICE', 1110, 644, 9, 800, '#9A6B45', 'center');
    /* anti-fatigue rubber mats: one in front of the range, a long one along the front of the line */
    function mat(x, y, w, h) { fillRR(g, x, y, w, h, 10, '#3A4458'); fillRR(g, x + 4, y + 3, w - 8, h - 6, 8, '#465165'); g.fillStyle = '#323B4D';
      for (var my = y + 10; my < y + h - 6; my += 12) for (var mx = x + 12 + ((my - y) % 24 ? 6 : 0); mx < x + w - 8; mx += 14) fillE(g, mx, my, 3.4, 2.4, '#323B4D'); g.fillStyle = 'rgba(255,255,255,.08)'; g.fillRect(x + 6, y + 3, w - 12, 2); }
    mat(-660, 476, 230, 40); mat(-476, 684, 640, 78); mat(600, 492, 400, 40);
  }
  /* the live foreground of the lower-left floor (depth-sorted with the passers-by): the mise-en-place trolley, the mop bucket,
     the box of paper bills being unpacked by the accounts-payable clerk, the herb planter, the bus tub of plates, the crate stack */
  var POR = { x: -560, y: 742, tapT: -9, pile: 0 }, PORP = W0who({ x: -560, y: 742, s: 0.59, ph: 1.1, skin: 1, hair: 3, style: 'bob', outfit: 'cardigan', top: '#5A6B8C', top2: '#FFFFFF', id: '#9AA6BC', hands: [[-60, -150], [60, -150]] });
  function W0who(o) { return CR.who(o); }
  function porPhase(t) { var c = (t + 3) % 8; return c < 1.3 ? 'reach' : c < 2.2 ? 'lift' : c < 4.6 ? 'read' : c < 5.8 ? 'file' : 'rest'; }
  function porter(g, t) { /* the clerk: pulls a bill from the box, reads it, files it in the TO SCAN tray; tap: tosses it up and catches it */
    var P = PORP, ph = porPhase(t), u = (t - POR.tapT) / 2.0, c = (t + 3) % 8, paper = null;
    P.talk = u >= 0 && u < 1.1; P.mood = 'calm'; P.tilt = 0; P.hop = 0; P.sx = 1; P.feet = true;
    if (ph === 'reach') { var k = Math.sin(Math.min(1, c / 1.3) * Math.PI); P.hands = [[lerp(-60, -118, k), lerp(-150, -112, k)], [60, -160]]; P.tilt = -0.14 * k; P.look = -0.8; }
    else if (ph === 'lift') { var k2 = ease((c - 1.3) / 0.9); P.hands = [[lerp(-118, -36, k2), lerp(-112, -282, k2)], [lerp(60, 36, k2), lerp(-160, -282, k2)]]; P.look = -0.3; paper = 1; }
    else if (ph === 'read') { P.hands = [[-34, -292 + Math.sin(t * 2) * 3], [34, -292 - Math.sin(t * 2) * 3]]; P.look = 0.05; P.tilt = Math.sin(t * 1.4) * 0.04; paper = 1; if (c > 3.8) P.mood = 'happy'; }
    else if (ph === 'file') { var k3 = ease((c - 4.6) / 1.2); P.hands = [[-60, -160], [lerp(34, 118, k3), lerp(-292, -150, k3)]]; P.look = 0.8; paper = k3 < 0.92 ? 2 : 0; if (k3 >= 0.92) POR.filed = Math.floor((t + 3) / 8); }
    else { P.hands = [[-60, -150], [60, -150]]; P.look = Math.sin(t * 0.9) * 0.7; P.tilt = Math.sin(t * 2.2) * 0.03; }
    var toss = -1;
    if (u >= 0 && u < 1) { paper = 0; P.talk = true; P.mood = u < 0.6 ? 'wow' : 'happy'; P.look = 0;
      if (u < 0.15) P.hands = [[-34, -282], [34, -282]]; else if (u < 0.65) { P.hands = [[-60, -380], [60, -380]]; toss = (u - 0.15) / 0.5; } else { P.hands = [[-50, -330], [50, -330]]; P.hop = Math.sin((u - 0.65) / 0.35 * Math.PI) * 14; paper = 1; }
      if (!POR.burst) { POR.burst = 1; CR.burst('spark', P.x, P.y - 330, t); } } else POR.burst = 0;
    K.person(g, P, t);
    var h0 = hw(P, 0), h1 = hw(P, 1);
    if (paper === 1) { var mx = (h0[0] + h1[0]) / 2, my = (h0[1] + h1[1]) / 2; g.save(); g.translate(mx, my - 12); g.rotate(-0.06); fillRR(g, -18, -22, 36, 44, 2, '#FFFFFF'); fillRR(g, -14, -18, 20, 4, 2, PUR); g.fillStyle = '#C9D3E3'; g.fillRect(-14, -10, 26, 2.4); g.fillRect(-14, -4, 20, 2.4); g.fillRect(-14, 2, 24, 2.4); fillRR(g, 2, 10, 12, 6, 2, '#F2C94C'); g.restore(); }
    else if (paper === 2) { g.save(); g.translate(h1[0] + 6, h1[1] - 10); g.rotate(0.3); fillRR(g, -14, -18, 28, 36, 2, '#FFFFFF'); fillRR(g, -10, -14, 16, 3.4, 1.5, PUR); g.restore(); }
    if (toss >= 0) { var tx = P.x, ty = P.y - 380 * P.s - Math.sin(toss * Math.PI) * 110; g.save(); g.translate(tx, ty); g.rotate(toss * Math.PI * 4); g.scale(Math.cos(toss * Math.PI * 6) * 0.3 + 0.7, 1); fillRR(g, -16, -20, 32, 40, 2, '#FFFFFF'); fillRR(g, -12, -16, 18, 3.4, 1.5, PUR); g.restore(); }
  }
  function billsBox(g, t) { var x = -652, y = 750; soft(g, x, y + 4, 60, 9, 0.26);
    g.fillStyle = '#B5865A'; g.beginPath(); g.moveTo(x - 44, y - 48); g.lineTo(x - 66, y - 70); g.lineTo(x - 50, y - 74); g.lineTo(x - 30, y - 50); g.closePath(); g.fill(); g.beginPath(); g.moveTo(x + 44, y - 48); g.lineTo(x + 64, y - 66); g.lineTo(x + 48, y - 72); g.lineTo(x + 30, y - 50); g.closePath(); g.fill();
    for (var i = 0; i < 5; i++) { var fl = i === 2 ? Math.sin(t * 3) * 4 : 0; g.save(); g.translate(x - 26 + i * 13, y - 56 - (i % 2) * 6 - Math.max(0, fl)); g.rotate((i - 2) * 0.08); fillRR(g, -10, -14, 22, 30, 2, '#FFFFFF'); fillRR(g, -7, -10, 12, 3, 1.5, PUR); g.fillStyle = '#C9D3E3'; g.fillRect(-7, -4, 15, 2); g.restore(); }
    fillRR(g, x - 46, y - 52, 92, 52, 4, '#C99A6B'); g.fillStyle = 'rgba(255,240,210,.45)'; g.fillRect(x - 8, y - 52, 16, 52); fillRR(g, x - 34, y - 34, 40, 20, 3, '#FFFFFF'); text(g, 'BILLS', x - 14, y - 20, 8.4, 800, PUR, 'center');
    /* the TO SCAN tray on its stool, the pile grows with each bill filed */
    var sx = -496, sy = 746; soft(g, sx, sy + 4, 40, 7, 0.22); g.strokeStyle = '#7A5236'; g.lineWidth = 4; g.beginPath(); g.moveTo(sx - 22, sy); g.lineTo(sx - 16, sy - 44); g.moveTo(sx + 22, sy); g.lineTo(sx + 16, sy - 44); g.stroke(); fillE(g, sx, sy - 46, 28, 6, '#9A6B45');
    var n = 1 + ((POR.filed || 0) % 4); for (var p = 0; p < n; p++) { g.save(); g.translate(sx + (p % 2 ? 2 : -2), sy - 52 - p * 3); g.rotate((p % 2 ? 0.05 : -0.06)); fillRR(g, -16, -4, 32, 8, 1.5, '#FFFFFF'); g.restore(); }
    g.strokeStyle = STEEL_D; g.lineWidth = 2; rr(g, sx - 22, sy - 66 - n * 3, 44, 18 + n * 3, 4); g.stroke(); fillRR(g, sx - 18, sy - 82 - n * 3, 36, 12, 3, VIO); text(g, 'TO SCAN', sx, sy - 73 - n * 3, 6.4, 800, '#FFFFFF', 'center');
  }
  function trolley(g, t) { var x = -846, y = 612; soft(g, x, y + 6, 76, 9, 0.24);
    g.strokeStyle = STEEL_D; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.moveTo(x - 62, y - 4); g.lineTo(x - 62, y - 92); g.moveTo(x + 62, y - 4); g.lineTo(x + 62, y - 92); g.moveTo(x + 62, y - 92); g.lineTo(x + 76, y - 104); g.stroke();
    fillRR(g, x - 70, y - 96, 140, 9, 3, STEEL); fillRR(g, x - 70, y - 44, 140, 9, 3, STEEL); [x - 58, x + 58].forEach(function (wx) { fillE(g, wx, y, 7, 7, '#2A3142'); fillE(g, wx, y, 3, 3, '#8A94A8'); });
    [[x - 46, TOM], [x - 18, HERB], [x + 10, '#F2C94C'], [x + 38, VIO]].forEach(function (b) { fillE(g, b[0], y - 99, 13, 4, '#E6EBF1'); g.fillStyle = '#FFFFFF'; g.beginPath(); g.ellipse(b[0], y - 99, 13, 10, 0, 0, Math.PI); g.fill(); for (var i = 0; i < 4; i++) fillE(g, b[0] - 7 + i * 4.6, y - 101 - (i % 2), 3.2, 2.4, b[1]); });
    pot(g, x - 30, y - 44, 40, 26, COP); fillRR(g, x + 6, y - 66, 48, 22, 4, '#C98E55'); for (var v = 0; v < 5; v++) fillE(g, x + 14 + v * 8, y - 70, 4, 3, v % 2 ? HERB : TOM);
    steam(g, x - 30, y - 74, t, 3, 46);
  }
  function mopBucket(g) { var x = -742, y = 756; soft(g, x, y + 4, 44, 8, 0.24); fillRR(g, x - 34, y - 48, 68, 48, 8, '#F2C94C'); fillRR(g, x - 30, y - 54, 60, 10, 4, '#E0B43A'); g.strokeStyle = '#8A94A8'; g.lineWidth = 3; g.beginPath(); g.moveTo(x + 16, y - 48); g.lineTo(x + 60, y - 184); g.stroke(); fillRR(g, x + 44, y - 204, 46, 26, 8, '#3FA6D6'); }
  function planter(g, t) { var x = -350, y = 742; soft(g, x, y + 4, 96, 8, 0.24);
    for (var i = 0; i < 9; i++) { var lx = x - 72 + i * 18, sw = Math.sin(t * 1.6 + i * 0.9) * 3, h = 26 + (i % 3) * 8; g.strokeStyle = '#2E8A55'; g.lineWidth = 2; g.beginPath(); g.moveTo(lx, y - 30); g.quadraticCurveTo(lx + sw * 0.5, y - 30 - h * 0.5, lx + sw, y - 30 - h); g.stroke();
      fillE(g, lx + sw, y - 32 - h, 7, 9, i % 2 ? '#3FA66B' : '#57BF7F'); fillE(g, lx + sw * 0.6 - 6, y - 34 - h * 0.55, 6, 4, '#4CB374'); fillE(g, lx + sw * 0.6 + 6, y - 32 - h * 0.45, 6, 4, '#3FA66B'); }
    fillRR(g, x - 88, y - 34, 176, 34, 6, '#C8794A'); fillRR(g, x - 92, y - 38, 184, 8, 4, '#D9915F'); g.fillStyle = 'rgba(110,50,20,.18)'; g.fillRect(x - 88, y - 18, 176, 3);
    fillRR(g, x - 30, y - 26, 60, 14, 3, '#FFF7E6'); text(g, 'HERBS', x, y - 16, 7.4, 800, '#7A4E2A', 'center');
  }
  function busTub(g, t) { var x = -150, y = 744; soft(g, x, y + 4, 54, 8, 0.24);
    for (var p = 0; p < 4; p++) fillE(g, x - 8 + p * 4, y - 40 - p * 4, 26, 6, p % 2 ? '#F1F4F8' : '#FFFFFF');
    fillRR(g, x - 48, y - 40, 96, 40, 6, '#5C6B7A'); fillRR(g, x - 50, y - 44, 100, 8, 4, '#7A869C'); g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(x - 40, y - 30, 80, 3);
    for (var b = 0; b < 5; b++) { var u = (t * 0.45 + b / 5) % 1; g.globalAlpha = (1 - u) * 0.85; g.strokeStyle = '#BFE3F5'; g.lineWidth = 1.4; g.beginPath(); g.arc(x - 24 + b * 12 + Math.sin(t * 2 + b) * 4, y - 48 - u * 44, 3 + b % 3, 0, 7); g.stroke(); } g.globalAlpha = 1;
    steam(g, x + 16, y - 50, t + 0.7, 2, 40);
  }
  function crateStack(g) { var x = 20, y = 746; soft(g, x, y + 4, 60, 8, 0.24);
    [[0, 0, '#F2C94C'], [6, -36, '#E2553D']].forEach(function (c) { fillRR(g, x - 44 + c[0], y - 36 + c[1], 88, 36, 5, '#C99A6B'); g.fillStyle = 'rgba(110,70,40,.25)'; g.fillRect(x - 44 + c[0], y - 24 + c[1], 88, 3); for (var i = 0; i < 6; i++) fillE(g, x - 34 + c[0] + i * 13.6, y - 40 + c[1] - (i % 2) * 3, 7, 7, c[2]); });
  }
  function speedRack(g) { var x = 930, y = 652; soft(g, x, y + 4, 50, 7, 0.22); g.strokeStyle = STEEL_D; g.lineWidth = 4; g.beginPath(); g.moveTo(x - 36, y - 4); g.lineTo(x - 36, y - 150); g.moveTo(x + 36, y - 4); g.lineTo(x + 36, y - 150); g.stroke();
    for (var r = 0; r < 6; r++) { var ry = y - 140 + r * 22; fillRR(g, x - 38, ry, 76, 4, 2, STEEL); if (r % 2 === 0 || r === 3) { fillRR(g, x - 32, ry - 8, 64, 8, 2, '#E6EBF1'); for (var b = 0; b < 4; b++) fillE(g, x - 22 + b * 15, ry - 9, 5, 3, [TOM, HERB, AMB, '#F2C94C'][(r + b) % 4]); } }
    [x - 32, x + 32].forEach(function (wx) { fillE(g, wx, y, 5, 5, '#2A3142'); }); }
  function wetSign(g, t) { var x = 540, y = 640; soft(g, x, y + 3, 26, 5, 0.2); g.fillStyle = '#F2C94C'; g.beginPath(); g.moveTo(x - 22, y); g.lineTo(x - 8, y - 70); g.lineTo(x + 8, y - 70); g.lineTo(x + 22, y); g.closePath(); g.fill(); g.fillStyle = '#E0B43A'; g.fillRect(x - 20, y - 6, 40, 4);
    fillE(g, x, y - 46, 9, 9, '#1B1F3B'); text(g, '!', x, y - 42, 11, 800, '#F2C94C', 'center'); text(g, 'WET', x, y - 22, 7, 800, '#1B1F3B', 'center'); text(g, 'FLOOR', x, y - 14, 6, 800, '#1B1F3B', 'center'); }
  function FORE() { return [[652, speedRack], [640, wetSign], [612, trolley], [756, mopBucket], [750, billsBox], [742, function (g2, e, t) { porter(g2, t); }], [742, planter], [744, busTub], [746, crateStack]]; }

  /* ------------------------------ the cast ------------------------------ */
  var W = CR.who;
  var FIN = W({ x: 724, y: 470, s: 0.54, ph: 0.8, skin: 0, hair: 0, style: 'short', outfit: 'coat', top: '#FFFFFF', top2: '#E3E8EF', id: '#9AA6BC', hatKind: 'toque', hands: [[-40, -196], [40, -196]] });
  var AGT = W({ x: 830, y: 470, s: 0.52, ph: 1.8, skin: 2, hair: 1, style: 'pony', outfit: 'polo', top: PINK, headset: '#1B2350', id: '#9AA6BC', hands: [[-60, -196], [60, -196]] });
  AGT.apron = '#2A3550';
  var ENG = W({ x: 626, y: 470, s: 0.56, ph: 2.5, skin: 1, hair: 0, style: 'short', outfit: 'shirt', top: VIO, glasses: true, hold: 'tablet', hands: [[-70, -200], [70, -170]], look: -0.4 });
  var LB = W({ x: -220, y: 470, s: 0.54, ph: 3.6, skin: 3, hair: 0, style: 'bun', outfit: 'cardigan', top: '#1E9BB0', top2: '#FFFFFF', hands: [[-60, -200], [60, -200]], look: -0.3 });
  var LBL = { t: -99, k: 0 };
  var CREW = [
    { x0: 1010, x1: 1300, y: 488, spd: 14, ph: 0.3, label: 'TechNext AI engineer', lines: ['The AI **prepares**. A person approves.', 'Answers come from **your own records**, with the source.', 'Every step is clipped to the **record**.'], acts: ['nod', 'id', 'wave'],
      P: W({ s: 0.5, skin: 3, hair: 1, style: 'long', outfit: 'polo', top: BLUE, hold: 'clipboard' }) },
    { front: true, x0: -930, x1: -260, y: 700, spd: 18, ph: 0.6, label: 'Supplier courier', lines: ['Another box of **paper bills** for the scanner.', 'Delivery for accounts payable!'], acts: ['cheer', 'wave', 'jump'],
      P: W({ s: 0.58, skin: 2, hair: 0, style: 'short', outfit: 'polo', top: '#E9A23B', id: '#9AA6BC', hold: 'box', hands: [[-60, -212], [70, -150]] }) },
    { front: true, x0: -920, x1: 110, y: 588, spd: 30, ph: 0.15, label: 'Runner', lines: ['Two plates up, **approved at the pass**.', 'Nothing leaves the pass without a **person\'s** OK.', 'Hot plates, and every one is **logged** on the way out.'], acts: ['aiTray'],
      P: W({ s: 0.56, skin: 3, hair: 1, style: 'pony', outfit: 'polo', top: '#1E9BB0', id: '#9AA6BC', hold: 'tray', hands: [[-60, -240], [70, -150]] }) }
  ];
  /* the runner's own tap move: the tray goes up overhead on one hand, a twirl underneath it, a little bow */
  CR.ACT.aiTray = { dur: 1.8, fx: 'star', pose: function (P, u, t) { P.mood = 'happy'; var k = Math.min(1, u / 0.2); P.hands = [[-60, lerp(-240, -450, k)], [lerp(70, 110, k), lerp(-150, -300, k)]];
    P.sx = u > 0.2 && u < 0.75 ? Math.cos((u - 0.2) / 0.55 * Math.PI * 2) : 1; P.hop = u < 0.75 ? Math.abs(Math.sin(u * Math.PI * 3)) * 10 : 0; P.tilt = u > 0.8 ? 0.12 : 0; } };
  /* the bill's cycle (7 s): read field by field (0-4), matched (4.2), plated to the pass (4.4-5), approved (5.6), posted (6+) */
  function cyc(S, t) { var keys = ['capture', 'match', 'approve', 'log']; return keys.indexOf(S.hot) >= 0 ? ((t - (S.kT || 0)) * 0.9 + (S.hot === 'approve' ? 4.4 : 0)) % 7 : (t * 0.42) % 7; }
  var FX = { scan: -9, bell: -9, bot: -9 };

  function actFin(P, t, S) { /* the head chef (finance): inspects the plate, wipes the rim, approves with a green flag; tap: rings the bell, thumbs up */
    var st = S.cast.fin, busy = S.hot === 'approve' || S.hot === 'match', u = tapU(st, t, 2.0), c = cyc(S, t);
    P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm'; P.tilt = 0; P.sx = 1; P.hop = 0;
    if (c > 5 && c < 6.2) { var k2 = ease((c - 5) / 0.3); P.hands = [[-50, -196], [lerp(40, 60, k2), lerp(-196, -400, k2)]]; P.mood = 'happy'; P.look = lerp(P.look, -0.2, 0.1); }
    else if (c > 4.4 && c <= 5) { P.hands = [[-60, -190], [-20, -190]]; P.tilt = -0.08; P.look = lerp(P.look, -0.6, 0.1); }
    else if ((t % 9) < 3) { var w = t * 6; P.hands = [[-50, -190], [20 + Math.cos(w) * 22, -192 + Math.sin(w) * 8]]; looks(P, st, t, S, -0.3); }
    else { P.hands = [[-40, -196], [40, -196]]; looks(P, st, t, S, Math.sin(t * 0.6) * 0.6); }
    if (u >= 0) { P.talk = true; P.mood = u < 0.3 ? 'wow' : 'happy'; var dn = u < 0.25 ? ease(u / 0.25) : 1;
      P.hands = u < 0.45 ? [[-40, -196], [lerp(40, 236, dn), lerp(-196, -170 + (u < 0.3 ? 0 : -30), dn)]] : [[-40, -196], [70, -430 + Math.sin(t * 10) * 6]]; P.hop = u > 0.45 ? Math.sin((u - 0.45) / 0.55 * Math.PI) * 14 : 0;
      if (u > 0.2 && !st._b) { st._b = 1; FX.bell = t; CR.burst('star', BELL.x, BELL.y - 30, t); } } else st._b = 0;
  }
  function actAgt(P, t, S) { /* the expediter (support): reads the drafted reply, taps send, hands plates out; tap: a little dance and the reply flies out */
    var st = S.cast.agt, busy = S.hot === 'draft', u = tapU(st, t, 2.2), c = (t + 1) % 8;
    P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm'; P.tilt = 0; P.sx = 1; P.hop = 0;
    if (busy || c < 4) { P.hands = [[-50, -196], [118, -250 + (Math.sin(t * 7) > 0.6 ? -10 : 0)]]; looks(P, st, t, S, 0.7); }
    else if (c < 6) { var r = ease((c - 4) / 0.6); P.hands = [[-60, -196], [lerp(60, 100, r), -200]]; P.look = lerp(P.look, 0.9, 0.1); }
    else { P.hands = [[-60, -196], [60, -196]]; looks(P, st, t, S, -0.3); P.tilt = Math.sin(t * 2) * 0.03; }
    if (u >= 0) { P.talk = true; P.mood = 'happy'; var b = Math.sin(t * 10); P.tilt = b * 0.12; P.hop = Math.abs(b) * 14; P.hands = b > 0 ? [[-110, -380], [80, -200]] : [[-80, -200], [110, -380]];
      if (!st._b) { st._b = 1; st.planeT = t; CR.burst('note', P.x, P.y - 280, t); } } else st._b = 0;
  }
  function actLb(P, t, S) { /* the pantry clerk: prints a label, reaches up to stick it on a jar, checks her list; tap: stamps a SCOPED tag on the shelf and gives a thumbs up */
    var st = S.cast.lb, u = tapU(st, t, 2.2); P.talk = t < st.until; P.mood = P.talk ? 'happy' : 'calm'; P.tilt = 0; P.hop = 0; P.sx = 1; LBL.k = 0;
    if (u >= 0) { P.talk = true; P.mood = 'happy'; if (!st._b) { st._b = 1; LBL.t = t + 0.4; CR.burst('star', -300, 30, t); }
      if (u < 0.45) { var a = ease(u / 0.45); P.hands = [[-60, -200], [lerp(60, -150, a), lerp(-200, -420, a)]]; P.look = -0.7; P.tilt = -0.08 * a; } else { P.hands = [[-60, -200], [70, -360]]; P.look = 0; P.hop = Math.abs(Math.sin((u - 0.45) * 10)) * 6; }
      return; } st._b = 0;
    var c = (t + 2) % 10;
    if (c < 2.5) { var k2 = Math.abs(Math.sin(t * 9)) * 4; P.hands = [[60, -206 - k2], [130, -206]]; P.look = lerp(P.look, 0.7, 0.1); LBL.k = c > 1.8 ? 1 : 0; }
    else if (c < 5.5) { var r = clamp(Math.min((c - 2.5) / 0.6, (5.5 - c) / 0.6), 0, 1); LBL.k = r < 0.9; P.hands = [[-60, -200], [lerp(100, -110, r), lerp(-210, -460, r)]]; P.look = lerp(P.look, -0.6, 0.08); P.tilt = -0.08 * r; }
    else if (c < 8) { P.hands = [[-34, -262], [30, -250]]; P.look = lerp(P.look, 0.05, 0.1); P.tilt = 0.05; }
    else { P.hands = [[-60, -200], [60, -200]]; looks(P, st, t, S, Math.sin(t * 0.8) * 0.6); }
  }
  function actEng(P, t, S) { /* TechNext's AI engineer: tastes the sauce, checks the tablet, nods; tap: a chef's kiss */
    var st = S.cast.eng, busy = S.hot === 'ask' || S.hot === 'log', u = tapU(st, t, 1.8), c = (t + 2) % 9;
    P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm'; P.tilt = 0; P.sx = 1; P.hop = 0;
    if (c < 2.4) { var k2 = c < 0.5 ? ease(c / 0.5) : c > 1.9 ? 1 - ease((c - 1.9) / 0.5) : 1; P.hands = [[-70, -200], [lerp(70, 20, k2), lerp(-170, -350, k2)]]; P.look = lerp(P.look, 0, 0.1); if (c > 0.8 && c < 1.9) P.mood = 'happy'; }
    else if (c < 5) { P.hands = [[-50, -230], [-10, -232 + Math.sin(t * 8) * 4]]; P.look = lerp(P.look, -0.5, 0.1); P.tilt = 0.04; }
    else if (c < 6) { P.hands = [[-70, -200], [70, -170]]; P.tilt = Math.sin((c - 5) * Math.PI * 4) * 0.06; P.mood = 'happy'; }
    else { P.hands = [[-70, -200], [70, -170]]; looks(P, st, t, S, -0.5); }
    if (busy) P.hands = [[-70, -200], [-140, -330 + Math.sin(t * 3) * 8]];
    if (u >= 0) { P.talk = true; P.mood = 'happy'; P.hands = u < 0.4 ? [[-70, -200], [24, -356]] : [[-70, -200], [150, -380]]; P.hop = u > 0.4 ? Math.sin((u - 0.4) / 0.6 * Math.PI) * 10 : 0;
      if (u > 0.38 && !st._b) { st._b = 1; CR.burst('heart', P.x + 50, P.y - 260, t); } } else st._b = 0;
  }

  /* ------------------------------ the live layers ------------------------------ */
  function drawBot(g, t, S) { /* the AI sous-chef: a kitchen robot behind the prep counter; chops, scans the bill, plates it; tap: juggles three plates */
    var x = BOT.x, c = cyc(S, t), scanning = S.hot === 'capture' || S.hot === 'match' || (c < 4), ju = (t - FX.bot) / 2.2, jug = ju >= 0 && ju < 1;
    var by = Math.sin(t * 2.4) * 2, hy = 214 + by, tilt = scanning ? -0.12 : Math.sin(t * 0.8) * 0.05;
    fillRR(g, x - 48, 260 + by, 96, 114, 28, '#AEB8C6'); fillRR(g, x - 46, 262 + by, 92, 110, 26, '#F4F6F9'); fillRR(g, x - 46, 262 + by, 92, 110, 26, 'rgba(123,92,214,.05)'); fillRR(g, x - 18, 290 + by, 36, 24, 8, VIO_L); spark(g, x, 302 + by, 7 + Math.sin(t * 4) * 1.5, VIO);
    fillRR(g, x - 52, 270 + by, 12, 40, 6, STEEL); fillRR(g, x + 40, 270 + by, 12, 40, 6, STEEL);
    fillRR(g, x - 10, 248 + by, 20, 18, 4, STEEL_D);
    g.save(); g.translate(x, hy); g.rotate(tilt);
    fillRR(g, -46, -34, 92, 66, 22, '#AEB8C6'); fillRR(g, -44, -32, 88, 62, 20, '#F4F6F9'); fillRR(g, -36, -24, 72, 46, 14, '#1E2140');
    var bl = ((t + 0.4) % 4.2) < 0.12; [-1, 1].forEach(function (d) { if (bl) fillRR(g, d * 15 - 7, -3, 14, 3, 1.5, '#B9A6F2'); else { fillE(g, d * 15, -2, 6, 7.5, '#B9A6F2'); fillE(g, d * 15 - 2, -4, 2, 2, '#FFFFFF'); } });
    g.strokeStyle = '#B9A6F2'; g.lineWidth = 2.4; g.lineCap = 'round'; g.beginPath(); g.arc(0, 8, 6, 0.2, Math.PI - 0.2); g.stroke();
    fillE(g, -14, -46, 18, 15, '#FFFFFF'); fillE(g, 14, -46, 18, 15, '#FFFFFF'); fillE(g, 0, -54, 20, 17, '#FFFFFF'); fillRR(g, -28, -46, 56, 18, 6, '#FFFFFF'); fillRR(g, -30, -34, 60, 7, 3, '#E6EBF1');
    fillE(g, 46, -4, 5, 9, STEEL); fillE(g, -46, -4, 5, 9, STEEL);
    g.restore();
    if (scanning && !jug) { g.save(); g.globalAlpha = 0.18 + 0.1 * Math.sin(t * 8); g.fillStyle = VIO; g.beginPath(); g.moveTo(x - 20, hy - 6); g.lineTo(x + 20, hy - 6); g.lineTo(BILL.x + BILL.w - 20, BILL.y + BILL.h); g.lineTo(BILL.x + 20, BILL.y + BILL.h); g.closePath(); g.fill(); g.restore(); }
    /* the arms: steel tubes from the shoulders to the grippers */
    var chop = Math.abs(Math.sin(t * 9)) * 10, L = [x - 50, 300 + by], R = [x + 50, 300 + by], lh, rh;
    if (jug) { lh = [x - 40, 250]; rh = [x + 40, 250]; }
    else if (c > 4.3 && c < 5.1) { var m = ease((c - 4.3) / 0.8); lh = [lerp(x - 30, 640, m), 352]; rh = [lerp(x + 20, 680, m), 352]; }
    else { lh = [x - 40, 352]; rh = [x + 14, 340 - chop]; }
    [[L, lh], [R, rh]].forEach(function (a) { var s0 = a[0], h = a[1], mx = (s0[0] + h[0]) / 2 + (h[0] < s0[0] ? -8 : 8), my = Math.max(s0[1], h[1]) + 14;
      g.strokeStyle = STEEL_D; g.lineWidth = 9; g.lineCap = 'round'; g.beginPath(); g.moveTo(s0[0], s0[1]); g.lineTo(mx, my); g.lineTo(h[0], h[1]); g.stroke(); fillE(g, mx, my, 6, 6, VIO); fillE(g, h[0], h[1], 8, 7, '#5C6B7A'); });
    if (!jug && !(c > 4.3 && c < 5.1)) { g.save(); g.translate(rh[0], rh[1]); g.rotate(0.3); fillRR(g, -2, -4, 22, 6, 2, '#E6EBF1'); fillRR(g, -10, -3, 10, 5, 2, '#2A3142'); g.restore(); }
    if (jug) { for (var i = 0; i < 3; i++) { var ph = (ju * 3 + i / 3) % 1, jx = lerp(x - 40, x + 40, ph), jy = 240 - Math.sin(ph * Math.PI) * 90; if (ju > 0.85) { jx = x; jy = 236 - i * 5; } plate(g, jx, jy, 15, function (g2, px, py) { fillE(g2, px, py - 3, 7, 3.4, [TOM, HERB, VIO][i]); }); } }
  }
  function paintLive(g, t, now, S) {
    CO.crew(CREW, g, t, S, false);
    var c = cyc(S, t), nf = Math.min(4, Math.floor(c)), approved = c > 5.6;
    /* the order screen: the AI fills the fields one by one, matches the PO, then waits for a person */
    FIELDS.forEach(function (f, i) { var y = BILL.y + 36 + i * 32, on = i < nf, hi = i === nf - 1 && c - nf < 0.6;
      fillRR(g, BILL.x + 82, y, 178, 24, 6, hi ? VIO_L : '#F6F8FB');
      if (on) { text(g, f[1], BILL.x + 92, y + 16, 9.4, 800, INK); spark(g, BILL.x + 248, y + 12, 5.5, VIO); if (i === 3) tick(g, BILL.x + 232, y + 12, 6.5); }
      else if (i === nf) { var cw = (t * 40) % 60; fillRR(g, BILL.x + 92, y + 9, cw, 6, 3, '#E3DDF7'); } });
    var by = BILL.y + 168; fillRR(g, BILL.x + 12, by, 160, 22, 11, VIO_L); spark(g, BILL.x + 26, by + 11, 6, VIO); text(g, 'Prepared by AI · a person approves', BILL.x + 36, by + 14.5, 6.6, 800, '#4B3A8A');
    var press = c > 5 && c < 5.6; fillRR(g, BILL.x + 180, by, 80, 22, 8, approved ? OK : (press ? '#5A3A52' : PUR)); text(g, approved ? 'Posted' : 'Approve', BILL.x + 220, by + 15, 8.6, 800, '#FFFFFF', 'center');
    /* the pantry: the jar the AI reaches into glows (match: purchase orders, capture: vendor bills, ask: sales orders) */
    var jarOn = S.hot === 'match' || (c > 3 && c < 4.3) ? 0 : S.hot === 'capture' || c < 3 ? 1 : S.hot === 'ask' ? 2 : S.hot === 'draft' ? 3 : -1;
    if (jarOn >= 0) { var jy = PAN.y + 116 + jarOn * 74; g.strokeStyle = 'rgba(123,92,214,' + (0.55 + 0.3 * Math.sin(t * 6)).toFixed(2) + ')'; g.lineWidth = 2.5; rr(g, PAN.x + 8, jy - 60, PAN.w - 16, 86, 10); g.stroke(); }
    /* the chalkboard: a question, then the answer typed in chalk, with its source */
    var ak = S.hot === 'ask' ? ((t - (S.kT || 0)) * 1.1) % 7 : (t * 0.36) % 7, qn = Math.floor(clamp(ak * 30, 0, 40)), an = Math.floor(clamp((ak - 1.6) * 24, 0, 40));
    wrap(g, 'Units of SKU-204 sold last month?'.slice(0, qn), CHB.x + 10, CHB.y + 35, 21, 12, 9.4, 700, '#FFFFFF');
    if (an > 0) { spark(g, CHB.x + 15, CHB.y + 67, 5.5, '#C9B8FF'); wrap(g, '142 units across 9 orders.'.slice(0, an), CHB.x + 26, CHB.y + 71, 20, 12, 9.8, 800, '#FFE7A3'); }
    if (ak > 3.4) text(g, 'Source: Sales report, Aug 2026', CHB.x + 10, CHB.y + 106, 7.4, 700, 'rgba(255,255,255,.75)');
    if (S.hot === 'ask' || (ak > 1.6 && ak < 3.4)) { g.strokeStyle = 'rgba(255,255,255,.7)'; g.setLineDash([3, 4]); g.lineWidth = 1.4; g.beginPath(); g.moveTo(PAN.x + PAN.w - 14, PAN.y + 116 + 2 * 74 - 30); g.quadraticCurveTo(PAN.x + PAN.w + 30, PAN.y + 80, CHB.x + CHB.w - 20, CHB.y + CHB.h + 2); g.stroke(); g.setLineDash([]); }
    /* the ticket rail: each step clips on as it happens and slides along */
    var tk = [['01', 'AI read the bill', 'four fields filled', 4, VIO], ['02', 'Matched to', 'purchase order PO00123', 4.2, VIO], ['03', 'Approved and posted', 'by Finance', 5.6, OK], ['04', 'Reply drafted', 'agent edited and sent', 6.2, PINK]];
    tk.forEach(function (k2, i) { var x = RAIL.x + 14 + i * 152, on = c >= k2[3] || S.hot === 'log', dropIn = on ? ease(Math.min(1, (c - k2[3]) * 3 + (S.hot === 'log' ? 1 : 0))) : 0, sw = Math.sin(t * 1.6 + i) * 0.02;
      g.save(); g.translate(x + 66, RAIL.y + 10); g.rotate(sw); g.globalAlpha = on ? 1 : 0.6;
      fillRR(g, -66, 2 - (1 - dropIn) * 10, 132, 44, 3, on ? '#FFFFFF' : '#EEF1F5'); g.fillStyle = on ? '#FFFFFF' : '#EEF1F5'; g.beginPath(); for (var z = 0; z <= 22; z++) g.lineTo(-66 + z * 6, 46 - (1 - dropIn) * 10 + (z % 2 ? 4 : 0)); g.lineTo(66, 40); g.lineTo(-66, 40); g.fill();
      fillRR(g, -6, -4, 12, 10, 2, STEEL_D); fillE(g, -60 + 8, 14 - (1 - dropIn) * 10, 7, 7, on ? k2[4] : '#C9D1DC'); text(g, k2[0], -52, 17 - (1 - dropIn) * 10, 6, 800, '#FFFFFF', 'center');
      text(g, k2[1], -40, 18 - (1 - dropIn) * 10, 8.4, 800, on ? INK : '#8A96A8'); text(g, k2[2], -40, 31 - (1 - dropIn) * 10, 7, 700, on ? '#5C6B7A' : '#A3ADBD'); g.restore(); });
    /* heat-lamp bulbs flicker warm */
    LAMPS.forEach(function (lx, i) { g.globalAlpha = 0.75 + 0.25 * Math.sin(t * 7 + i * 2); fillE(g, lx, 36, 9, 4, AMB); g.globalAlpha = 1; });
    /* the AI sous-chef, then the steam of the stock pot in the margin */
    drawBot(g, t, S);
    steam(g, -575, 250, t, 5, 90); steam(g, -500, 284, t + 1, 3, 50);
    /* the clock over the doors (Manila/Singapore time) */
    CO.clock(g, 1130, 4, 18, 8, STEEL_D);
  }
  function lbLive(g, t) { /* the label the clerk sticks on (or the SCOPED tag after a tap), the prep board's ticks */
    var h = hw(LB, 1); if (LBL.k) { g.save(); g.translate(h[0], h[1]); g.rotate(-0.2); fillRR(g, -10, -6, 24, 12, 3, '#FFFFFF'); fillRR(g, -10, -6, 5, 12, 2, VIO); g.fillStyle = '#C9D3E3'; g.fillRect(-2, -2, 12, 1.6); g.fillRect(-2, 2, 9, 1.6); g.restore(); }
    var lu = t - LBL.t; if (lu >= 0 && lu < 2.6) { var sy = 70 - 26 - Math.min(1, lu / 0.25) * 4; g.save(); g.globalAlpha = lu > 2.1 ? (2.6 - lu) / 0.5 : 1; fillRR(g, -334, sy - 8, 64, 18, 5, VIO); fillRR(g, -326, sy - 4, 9, 9, 2, '#FFFFFF'); g.fillStyle = VIO; g.fillRect(-324, sy - 1, 5, 4); g.strokeStyle = VIO; g.lineWidth = 1.4; g.beginPath(); g.arc(-321.5, sy - 2, 2.4, Math.PI, 0); g.stroke(); text(g, 'SCOPED', -294, sy + 4.4, 7, 800, '#FFFFFF', 'center'); g.restore(); }
    PREPS.forEach(function (r, i) { var y = WB.y + 56 + i * 30, on = ((t * 0.4 + i * 0.33) % 1.5) > 0.5; if (on) tick(g, WB.x + 21, y - 3, 6); else fillE(g, WB.x + 21, y - 3, 3, 3, (t % 1) < 0.5 ? VIO : VIO_L);
      text(g, on ? 'approved' : 'waiting', WB.x + WB.w - 12, y, 6.6, 800, on ? OK : '#B7791F', 'right'); });
  }
  function paintFrontLive(g, t, S) {
    CO.crew(CREW, g, t, S, true); lbLive(g, t);
    var c = cyc(S, t);
    /* the pot on the prep burner steams */
    steam(g, 597, 318, t, 3, 50);
    /* the scanner: a paper bill feeds in (tapped, on the capture stop, or at the start of each cycle) */
    var sc = SCAN, st = S.hot === 'capture' ? (t % 2) : Math.min(t - FX.scan, c < 1.6 ? c : 9);
    if (st < 1.6) { var f = clamp(st / 1.4, 0, 1); g.save(); g.beginPath(); g.rect(sc.x, sc.y - 80, 84, 74); g.clip(); fillRR(g, sc.x + 22, sc.y - 70 + f * 64, 40, 52, 3, '#FFFFFF'); fillRR(g, sc.x + 26, sc.y - 64 + f * 64, 24, 3, 1.5, PUR); g.fillStyle = '#C9D3E3'; g.fillRect(sc.x + 26, sc.y - 56 + f * 64, 30, 2); g.fillRect(sc.x + 26, sc.y - 50 + f * 64, 22, 2); g.restore();
      g.strokeStyle = 'rgba(123,92,214,.7)'; g.lineWidth = 2; g.beginPath(); g.moveTo(sc.x + 10, sc.y + 12); g.lineTo(sc.x + 74, sc.y + 12); g.stroke(); }
    /* the plates on the pass: the bill plate arrives, is approved (green flag), then leaves; the answer and reply plates wait */
    var bx = c < 4.4 ? -1 : c < 5 ? lerp(640, 704, ease((c - 4.4) / 0.6)) : c < 6.2 ? 704 : lerp(704, 640, ease((c - 6.2) / 0.8));
    if (bx > 0) { var fade = c > 6.2 ? 1 - (c - 6.2) / 0.8 : 1; g.globalAlpha = clamp(fade, 0, 1); plate(g, bx, PASS.y - 3, 24, function (g2, x, y) { g2.save(); g2.translate(x, y - 8); g2.rotate(-0.08); fillRR(g2, -12, -12, 24, 18, 2, '#FFFFFF'); fillRR(g2, -10, -10, 14, 3, 1.5, PUR); g2.fillStyle = '#C9D3E3'; g2.fillRect(-10, -4, 18, 2); g2.fillRect(-10, 0, 12, 2); g2.restore(); });
      if (c > 5.6) { g.strokeStyle = '#8A94A8'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(bx + 14, PASS.y - 10); g.lineTo(bx + 14, PASS.y - 36); g.stroke(); fillRR(g, bx + 14, PASS.y - 36, 20, 12, 2, OK); tick(g, bx + 24, PASS.y - 30, 4); }
      g.globalAlpha = 1; }
    plate(g, 790, PASS.y - 3, 20, function (g2, x, y) { fillE(g2, x - 6, y - 4, 6, 3.4, TOM); fillE(g2, x + 5, y - 4, 7, 3.6, HERB); });
    /* the service bell: rings when tapped or when the chef approves */
    var rb = Math.min(t - FX.bell, c > 5.5 && c < 5.9 ? 0 : 9), ring = rb < 0.8 ? Math.sin(rb * 40) * (1 - rb / 0.8) * 0.3 : 0;
    g.save(); g.translate(BELL.x, BELL.y - 2); fillE(g, 0, 0, 16, 4, '#5C6B7A'); g.rotate(ring); g.fillStyle = '#E2B13C'; g.beginPath(); g.arc(0, -2, 12, Math.PI, 0); g.closePath(); g.fill(); fillE(g, 0, -15, 3, 3, '#C9952A'); fillE(g, -4, -8, 3, 2, 'rgba(255,255,255,.5)'); g.restore();
    if (rb < 0.9) { g.globalAlpha = 1 - rb / 0.9; fillRR(g, BELL.x - 18, BELL.y - 54 - rb * 14, 36, 16, 8, '#FFFFFF'); text(g, 'Ding!', BELL.x, BELL.y - 43 - rb * 14, 8, 800, '#C9952A', 'center'); g.globalAlpha = 1; }
    /* the reply screen: drafted by the AI, the agent edits and sends */
    var dr = S.hot === 'draft' ? ((t - (S.kT || 0)) * 1.2) % 6 : ((t + 1) * 0.5) % 6, dn = Math.floor(clamp(dr * 22, 0, 90)), R = RPL;
    fillRR(g, R.x, R.y, R.w, R.h, 4, '#FFFFFF'); fillRR(g, R.x, R.y, R.w, 18, 4, PINK); g.fillRect(R.x, R.y + 10, R.w, 8); text(g, 'Helpdesk · reply', R.x + 8, R.y + 13, 7, 800, '#FFFFFF');
    fillRR(g, R.x + 6, R.y + 24, 92, 18, 7, '#F4F6FA'); text(g, 'Where is my order SO0412?', R.x + 11, R.y + 36, 5.8, 700, '#3D4560');
    fillRR(g, R.x + 14, R.y + 48, 94, 54, 7, '#FDECF1'); spark(g, R.x + 22, R.y + 57, 4.5, PINK);
    var reply = 'Hi Mei, your order shipped today. Tracking: SG4482. Thanks for waiting!'; wrap(g, reply.slice(0, dn), R.x + 30, R.y + 60, 20, 9, 6.2, 700, '#5A2236');
    var sent = dr > 4.5; fillRR(g, R.x + 46, R.y + 110, 62, 18, 6, sent ? OK : PINK); text(g, sent ? 'Sent' : 'Edit & send', R.x + 77, R.y + 122.5, 7, 800, '#FFFFFF', 'center');
    /* the expediter's tap: the reply flies out to the dining room as a paper plane */
    var pu = (t - (S.cast.agt.planeT || -9)) / 1.6; if (pu >= 0 && pu < 1) { var px = lerp(R.x + R.w / 2, 1180, pu), py = R.y + 40 - Math.sin(pu * Math.PI) * 120; CO.plane(g, px, py, 1.6, -0.3 + pu * 0.5, PINK, '#FFFFFF'); }
    /* the engineer's spoon and the head chef's flag */
    var e0 = hw(ENG, 1), ec = (t + 2) % 9; if (ec < 2.4) { g.save(); g.translate(e0[0], e0[1]); g.rotate(-0.8); fillRR(g, -2, -2, 26, 4, 2, '#C9D1DC'); fillE(g, 26, 0, 6, 4, '#E6EBF1'); g.restore(); }
    var f1 = hw(FIN, 1); if (c > 5.1 && c < 6.2 && tapU(S.cast.fin, t, 2) < 0) { g.strokeStyle = '#8A94A8'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(f1[0], f1[1]); g.lineTo(f1[0], f1[1] - 30); g.stroke(); fillRR(g, f1[0], f1[1] - 30, 22, 13, 2, OK); tick(g, f1[0] + 11, f1[1] - 23.5, 4.5); }
    if (tapU(S.cast.fin, t, 2) < 0 && (t % 9) < 3 && !(c > 4.4 && c < 6.2)) { fillRR(g, f1[0] - 8, f1[1] - 4, 16, 12, 3, '#FFFFFF'); }
    CR.draw(g, t);
  }

  window.IXW.worlds['ai-odoo'] = {
    pan: [-700, 1300],
    paintBg: paintBg, windowBehind: true, paintFrame: function () {}, paintBack: paintBack, paintFront: paintFront, paintFore: paintFore,
    paintWindow: paintWindow, paintLive: paintLive, paintFrontLive: paintFrontLive,
    paintForeLive: function (g, t, S) { K.zfore(g, t, S, FORE(), function () { CO.crew(CREW, g, t, S, 'fore'); }); CR.draw(g, t); },
    moteCol: 'rgba(255,255,255,.75)',
    glow: {
      capture: function (g) { rr(g, BILL.x + 4, BILL.y + 28, BILL.w - 8, 98, 10); },
      match: function (g) { rr(g, BILL.x + 4, BILL.y + 126, BILL.w - 8, 36, 10); },
      approve: function (g) { rr(g, 664, 330, 150, 60, 14); },
      log: function (g) { rr(g, RAIL.x - 8, RAIL.y - 14, RAIL.w + 16, RAIL.h + 18, 12); },
      draft: function (g) { rr(g, RPL.x - 10, RPL.y - 10, RPL.w + 20, RPL.h + 20, 12); },
      ask: function (g) { rr(g, CHB.x - 12, CHB.y - 12, CHB.w + 24, 330, 14); },
      scanner: function (g) { rr(g, SCAN.x - 8, SCAN.y - 30, 100, 72, 10); },
      bell: function (g) { rr(g, BELL.x - 22, BELL.y - 24, 44, 30, 10); },
      bot: function (g) { rr(g, BOT.x - 60, 150, 120, 210, 24); }
    },
    backGlow: ['capture', 'match', 'log', 'ask', 'bot'],
    calmView: [300, -60, 750, 600],
    cast: [
      { id: 'fin', behind: true, keys: ['approve', 'match'], P: FIN, act: actFin },
      { id: 'agt', behind: true, keys: ['draft'], P: AGT, act: actAgt },
      { id: 'eng', behind: false, keys: ['ask', 'log'], P: ENG, act: actEng },
      { id: 'lb', behind: true, keys: [], P: LB, act: actLb }
    ],
    toy: function (name, S, t) { if (name === 'scanner') { FX.scan = t; CR.burst('spark', SCAN.x + 42, SCAN.y - 30, t); } else if (name === 'bell') { FX.bell = t; CR.burst('star', BELL.x, BELL.y - 30, t); } else if (name === 'bot') { FX.bot = t; CR.burst('spark', BOT.x, 170, t); } },
    hit: function (x, y, S, t) {
      var P = PORP; if (Math.abs(x - P.x) < 70 && y < P.y + 10 && y > P.y - 300) { POR.tapT = t; POR.li = (POR.li || 0) + 1;
        return { say: ['A whole box of **paper bills**. Into the scanner they go.', 'Paper in, **fields out**: the AI reads every one, a person approves.'][POR.li % 2], who: 'Accounts payable', role: 'Client team · unpacking paper bills · illustration', near: [760, 70], pose: 'clap' }; }
      return CR.hitWalker(x, y, t); },
    onStop: function (key, S, t) { S.kT = t; }
  };
})(window.IXW && window.IXW.kit, window.CR, window.CO);
