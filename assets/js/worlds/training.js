/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: training (/odoo/training) — step 2 of 4, drawn as a bright FLIGHT SCHOOL: nobody flies a real plane before the
   simulator, and nobody runs the real Odoo before practising on a copy of their own data. The big simulator screen under its
   glare shield runs each team's Odoo 20 screen on the training database (finance: bank reconciliation; sales: quotation
   S00042; warehouse: receipt WH/IN/00017) with the tip bubble and the button to press; three trainees sit in motion-simulator
   pods that rock on their pistons, each with their own screen beside them; TechNext's instructor walks the aisle with a
   tablet and a headset; the week's sessions hang as flight strips on the strip board; the quick-reference guides wait in
   the rack and the certificate (wings) on the wall. Through the hangar window a trainer plane taxis and takes off: go-live.
   Clients wear grey visitor passes; TechNext staff the blue ID. Every person has their own idle loop and their own tap move
   (CR.ACT entries prefixed tr_, written here). */
(function (K, CR, CO) {
  'use strict';
  if (!K || !CR || !CO) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed;
  var F = 470, CEIL = -150, PUR = '#714B67', BLUE = '#3167CA', AMB = '#F2A33A', INK = '#1B1F3B', PASS = '#9AA6BC', YEL = '#FFC93C';
  var SC = { x: 346, y: -100, w: 468, h: 250 }, WIN = { x: 910, y: -126, w: 460, h: 356 };
  var T = { strip: { x: 176, y: -74, w: 154, h: 224 }, cert: { x: 826, y: -64, w: 74, h: 84 }, rack: { x: 826, y: 52, w: 74, h: 118 }, ios: { x: 960, y: 362, w: 140 }, poster: { x: -440, y: -70, w: 400, h: 170 } };
  var ROLES = [
    { key: 'finance', tab: 'Finance', col: '#2E9C7E', h: 'Bank reconciliation', btn: 'Validate', tip: 'Check the suggested match, then validate.',
      rows: [['Harbourline Supplies', 'Matched', 'S$ 4,280.00', 1], ['Card settlement', 'Matched', 'S$ 1,962.40', 1], ['Transfer, no reference', 'To review', 'S$ 350.00', 0]] },
    { key: 'sales', tab: 'Sales', col: '#E46E78', h: 'Quotation S00042', btn: 'Confirm', tip: 'Confirm it, and the quotation becomes a sales order.',
      rows: [['Barcode scanner', '× 6', 'S$ 1,080.00', 2], ['Label printer', '× 2', 'S$ 460.00', 2], ['Set-up service', '× 1', 'S$ 300.00', 2]] },
    { key: 'warehouse', tab: 'Warehouse', col: AMB, h: 'Receipt WH/IN/00017', btn: 'Validate', tip: 'Scan each product in, then validate the receipt.',
      rows: [['Barcode scanner', 'Scanned', '6 / 6', 1], ['Label printer', 'Scanned', '2 / 2', 1], ['Thermal labels', 'Waiting', '0 / 40', 0]] }];
  /* the three simulator pods: x, the monitor's side, the role */
  var PODS = [{ x: 300, side: -1, r: 0, kick: -9, lift: -9 }, { x: 470, side: 1, r: 1, kick: -9, lift: -9 }, { x: 815, side: 1, r: 2, kick: -9, lift: -9 }];
  var PLAT = 446; /* the pods' platform top */
  function setU(g, sx, sy, k) { g.translate(sx, sy); g.scale(k, k); }
  function extOf(W, H, k, sx, sy) { return { l: -(sx + 24) / k, r: (W - sx) / k, t: -(sy + 24) / k, b: (H - sy) / k }; }
  function handW(P, i) { var h = P.hands[i], sx = P.sx == null ? 1 : P.sx; return [P.x + h[0] * P.s * sx, P.y + (h[1] - (P.hop || 0) + (P.sit ? (P.sitDrop != null ? P.sitDrop : 46) : 0)) * P.s]; }
  function podY(i, t) { var p = PODS[i], lu = (t - p.lift) / 1.8, ku = (t - p.kick) / 0.5;
    return Math.sin(t * 0.9 + i * 2.1) * 2.5 + (lu >= 0 && lu < 1 ? Math.sin(lu * Math.PI) * 30 : 0) + (ku >= 0 && ku < 1 ? Math.sin(ku * Math.PI * 4) * (1 - ku) * 5 : 0); }

  /* ============================== static layers ============================== */
  function airfield(g, x0, x1, top, bot) { /* the view: sky, hills, the apron, the runway, the control tower, a hangar */
    CO.sky(g, { l: x0, r: x1, t: top }, top, bot, [[0, '#6FB2EE'], [0.65, '#BFE0F8'], [1, '#EAF6FD']]);
    var hz = top + (bot - top) * 0.62;
    g.fillStyle = 'rgba(150,190,170,.6)'; g.beginPath(); g.moveTo(x0, hz); for (var hx = x0; hx <= x1; hx += 20) g.lineTo(hx, hz - 14 - Math.sin(hx * 0.018) * 10 - Math.sin(hx * 0.05) * 4); g.lineTo(x1, hz); g.closePath(); g.fill();
    g.fillStyle = '#BFD9A8'; g.fillRect(x0, hz, x1 - x0, bot - hz); g.fillStyle = '#A9CC90'; g.fillRect(x0, hz, x1 - x0, 4);
    /* the runway with its centreline and threshold bars */
    g.fillStyle = '#8E96A8'; g.fillRect(x0, hz + 22, x1 - x0, 26); g.fillStyle = '#FFFFFF'; for (var dx = x0; dx < x1; dx += 34) g.fillRect(dx, hz + 34, 18, 2.4);
    for (var tb = 0; tb < 6; tb++) g.fillRect(x1 - 60, hz + 24 + tb * 4, 30, 2);
    g.fillStyle = '#C9CFDA'; g.fillRect(x0, hz + 8, x1 - x0, 12); /* the taxiway */
    /* the control tower and a hangar */
    var tx = x0 + (x1 - x0) * 0.62; g.fillStyle = '#D9DEE8'; g.fillRect(tx, hz - 92, 16, 94); fillRR(g, tx - 12, hz - 116, 40, 26, 4, '#C5CCD8'); g.fillStyle = '#8FC6EE'; g.fillRect(tx - 9, hz - 111, 34, 12); g.fillStyle = '#E2453C'; g.fillRect(tx + 7, hz - 128, 2, 12);
    var hg = x0 + (x1 - x0) * 0.08; g.fillStyle = '#E8ECF2'; g.beginPath(); g.moveTo(hg, hz + 2); g.lineTo(hg, hz - 34); g.quadraticCurveTo(hg + 60, hz - 62, hg + 120, hz - 34); g.lineTo(hg + 120, hz + 2); g.closePath(); g.fill();
    g.fillStyle = '#C9D0DB'; g.fillRect(hg + 22, hz - 26, 76, 28); g.strokeStyle = '#B5BDCA'; g.lineWidth = 1; for (var hl = 1; hl < 6; hl++) { g.beginPath(); g.moveTo(hg + 22 + hl * 12.6, hz - 26); g.lineTo(hg + 22 + hl * 12.6, hz + 2); g.stroke(); }
    return hz;
  }
  function paintBg(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    var wg = g.createLinearGradient(0, CEIL, 0, F); wg.addColorStop(0, '#F7F5FA'); wg.addColorStop(1, '#ECE8F2'); g.fillStyle = wg; g.fillRect(e.l, CEIL, e.r - e.l, F - CEIL);
    /* the lower wall: hangar panels with a purple stripe */
    g.fillStyle = '#E7E2EE'; g.fillRect(e.l, 240, e.r - e.l, F - 240); g.fillStyle = PUR; g.fillRect(e.l, 236, e.r - e.l, 5); g.fillStyle = AMB; g.fillRect(e.l, 244, e.r - e.l, 2.5);
    g.strokeStyle = 'rgba(80,50,90,.08)'; g.lineWidth = 2; for (var px = Math.floor(e.l / 90) * 90; px < e.r; px += 90) { g.beginPath(); g.moveTo(px, 250); g.lineTo(px, F); g.stroke(); fillE(g, px + 8, 262, 2, 2, 'rgba(80,50,90,.12)'); fillE(g, px + 8, F - 14, 2, 2, 'rgba(80,50,90,.12)'); }
    /* the hangar window onto the airfield */
    g.save(); g.beginPath(); g.rect(WIN.x, WIN.y, WIN.w, WIN.h); g.clip(); airfield(g, WIN.x, WIN.x + WIN.w, WIN.y, WIN.y + WIN.h); g.restore();
    CO.ceiling(g, e, CEIL, '#EFEBF4', '#FAF9FC', '#FFFFFF');
    /* the hangar floor: light epoxy, a big stencil, the bay lines */
    var fg = g.createLinearGradient(0, F, 0, e.b); fg.addColorStop(0, '#EEEBF3'); fg.addColorStop(1, '#DCD6E4'); g.fillStyle = fg; g.fillRect(e.l, F, e.r - e.l, e.b - F);
    g.fillStyle = 'rgba(60,40,80,.10)'; g.fillRect(e.l, F, e.r - e.l, 5);
    g.strokeStyle = 'rgba(90,70,110,.08)'; g.lineWidth = 1.6; g.beginPath(); for (var d = 1; d < 7; d++) { var yy = F + Math.pow(d / 6, 1.5) * (e.b - F); g.moveTo(e.l, yy); g.lineTo(e.r, yy); } g.stroke();
    /* the taxi line that leads to the pods: yellow with a dark edge */
    g.lineCap = 'round'; g.strokeStyle = 'rgba(60,40,10,.18)'; g.lineWidth = 12; taxiPath(g); g.stroke(); g.strokeStyle = YEL; g.lineWidth = 7; taxiPath(g); g.stroke();
    g.save(); g.translate(586, 732); g.scale(1, 0.42); g.font = '800 46px ' + K.FONT; g.textAlign = 'center'; g.fillStyle = 'rgba(113,75,103,.10)'; g.fillText('TRAINING BAY', 0, 0); g.restore();
    /* hold-short bars in front of each pod */
    PODS.forEach(function (p) { g.fillStyle = 'rgba(255,201,60,.8)'; g.fillRect(p.x - 60, 610, 120, 5); g.fillRect(p.x - 60, 620, 120, 5); g.setLineDash([10, 8]); g.strokeStyle = 'rgba(255,201,60,.8)'; g.lineWidth = 4; g.beginPath(); g.moveTo(p.x - 60, 632); g.lineTo(p.x + 60, 632); g.stroke(); g.setLineDash([]); });
    g.restore();
  }
  function taxiPath(g) { g.beginPath(); g.moveTo(-940, 760); g.bezierCurveTo(-300, 760, 100, 690, 600, 680); g.bezierCurveTo(1000, 672, 1200, 700, 1400, 740); }
  function taxiPt(u) { /* a point on the taxi line (two cubic pieces) */
    var P0, P1, P2, P3, v; if (u < 0.5) { v = u * 2; P0 = [-940, 760]; P1 = [-300, 760]; P2 = [100, 690]; P3 = [600, 680]; } else { v = (u - 0.5) * 2; P0 = [600, 680]; P1 = [1000, 672]; P2 = [1200, 700]; P3 = [1400, 740]; }
    var a = Math.pow(1 - v, 3), b = 3 * Math.pow(1 - v, 2) * v, c = 3 * (1 - v) * v * v, dd = v * v * v; return [a * P0[0] + b * P1[0] + c * P2[0] + dd * P3[0], a * P0[1] + b * P1[1] + c * P2[1] + dd * P3[1]]; }
  function paintFrame(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k);
    /* the hangar window frame: steel mullions and a transom */
    g.strokeStyle = '#FFFFFF'; g.lineWidth = 12; g.strokeRect(WIN.x, WIN.y, WIN.w, WIN.h); g.fillStyle = '#FFFFFF'; for (var i = 1; i < 4; i++) g.fillRect(WIN.x + i * WIN.w / 4 - 3, WIN.y, 6, WIN.h); g.fillRect(WIN.x, WIN.y + 92, WIN.w, 6);
    g.fillStyle = 'rgba(255,255,255,.22)'; for (var gx = WIN.x; gx < WIN.x + WIN.w; gx += WIN.w / 4) { g.beginPath(); g.moveTo(gx + 20, WIN.y + WIN.h); g.lineTo(gx + 60, WIN.y); g.lineTo(gx + 80, WIN.y); g.lineTo(gx + 40, WIN.y + WIN.h); g.closePath(); g.fill(); }
    fillRR(g, WIN.x - 14, WIN.y + WIN.h, WIN.w + 28, 12, 4, '#FFFFFF');
    g.restore();
  }
  function wings(g, x, y, s, col) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = col;
    [-1, 1].forEach(function (d) { g.beginPath(); g.moveTo(d * 8, -4); g.quadraticCurveTo(d * 30, -14, d * 52, -10); g.lineTo(d * 44, -4); g.lineTo(d * 50, -2); g.lineTo(d * 38, 3); g.lineTo(d * 42, 6); g.lineTo(d * 26, 8); g.quadraticCurveTo(d * 14, 8, d * 8, 6); g.closePath(); g.fill(); });
    fillE(g, 0, 0, 11, 11, col); fillE(g, 0, 0, 7, 7, '#FFFFFF'); CO.plane(g, 0, 0, 0.5, 0, PUR); g.restore(); }
  function locker(g, x, y, w, h, n, open) { fillRR(g, x, y, w, h, 3, '#C9C2D8'); fillRR(g, x + 3, y + 3, w - 6, h - 6, 2, open ? '#8E86A3' : '#D9D3E6');
    if (open) { fillRR(g, x + 8, y + 30, w - 16, 70, 10, BLUE); fillRR(g, x + 10, y + 12, w - 20, 10, 3, '#5C6B7A'); }
    else { g.fillStyle = 'rgba(80,60,110,.18)'; for (var v = 0; v < 4; v++) g.fillRect(x + 10, y + 14 + v * 6, w - 20, 2); fillRR(g, x + w - 12, y + h / 2 - 10, 4, 20, 2, '#8E86A3'); fillRR(g, x + 10, y + h - 40, w - 20, 12, 2, '#FFFFFF'); g.fillStyle = PASS; g.fillRect(x + 14, y + h - 36, w - 28, 3); } }
  function paintBack(g, ext) {
    /* the left wall: three world clocks, the lockers, the pre-flight checklist poster */
    shadowed(g, 8, 3, 0.16, function () { fillRR(g, -624, -126, 148, 100, 8, '#3A4458'); }); text(g, 'OUR TEAMS · LOCAL TIME', -550, -110, 6.6, 800, '#FFFFFF', 'center');
    [[-598, 'SINGAPORE'], [-550, 'TAGUIG'], [-502, 'HCMC']].forEach(function (c) { K.clockFace(g, { x: c[0], y: -72, r: 17 }, AMB); text(g, c[1], c[0], -38, 6, 800, '#FFE7B8', 'center'); });
    soft(g, -810, F + 4, 120, 8, 0.24); for (var lk = 0; lk < 5; lk++) locker(g, -920 + lk * 44, 200, 42, F - 200, lk, lk === 3);
    shadowed(g, 8, 3, 0.16, function () { fillRR(g, -620, 0, 140, 186, 6, '#FFFFFF'); }); fillRR(g, -620, 0, 140, 24, 6, PUR); g.fillRect(-620, 14, 140, 10); text(g, 'PRE-FLIGHT CHECK', -550, 17, 8.4, 800, '#FFFFFF', 'center');
    ['Copy of your data', 'Your own screens', 'One task at a time', 'Guide in hand', 'Sign-off check'].forEach(function (s, i) { fillRR(g, -608, 36 + i * 29, 12, 12, 3, '#DDF5EA'); g.strokeStyle = '#1E9E6A'; g.lineWidth = 2; g.beginPath(); g.moveTo(-605, 42 + i * 29); g.lineTo(-602, 45 + i * 29); g.lineTo(-597, 38 + i * 29); g.stroke(); text(g, s, -590, 46 + i * 29, 8, 700, '#3D4560'); });
    [[-880, 'SINGAPORE'], [-770, 'TAGUIG CITY']].forEach(function (c, i) { shadowed(g, 6, 3, 0.14, function () { fillRR(g, c[0] - 50, -40, 100, 150, 6, '#FFFFFF'); }); fillRR(g, c[0] - 50, -40, 100, 60, 6, i ? '#14A38B' : BLUE); CO.plane(g, c[0], -14, 1.6, 0, '#FFFFFF'); text(g, c[1], c[0], 40, 8.4, 800, INK, 'center'); text(g, i ? 'development and' : 'HQ', c[0], 56, 7, 700, '#8A93A6', 'center'); if (i) text(g, 'consulting hub', c[0], 68, 7, 700, '#8A93A6', 'center'); fillRR(g, c[0] - 30, 86, 60, 4, 2, i ? '#14A38B' : BLUE); });
    /* behind the title card: the training path poster, the bench with flight bags, the coffee machine */
    var po = T.poster; shadowed(g, 12, 4, 0.16, function () { fillRR(g, po.x, po.y, po.w, po.h, 8, '#FFFFFF'); }); fillRR(g, po.x, po.y, po.w, 30, 8, PUR); g.fillRect(po.x, po.y + 20, po.w, 10);
    text(g, 'THE TRAINING PATH', po.x + 18, po.y + 20, 11, 800, '#FFFFFF');
    ['Key users', 'End users', 'Train-the-trainer', 'UAT', 'Go-live'].forEach(function (s, i) { var x = po.x + 40 + i * 80, y = po.y + 100 - (i % 2) * 36; if (i) { g.strokeStyle = PUR; g.setLineDash([5, 5]); g.lineWidth = 2; g.beginPath(); g.moveTo(po.x + 40 + (i - 1) * 80, po.y + 100 - ((i - 1) % 2) * 36); g.lineTo(x, y); g.stroke(); g.setLineDash([]); }
      fillE(g, x, y, 13, 13, i === 4 ? AMB : '#F4F0F8'); g.strokeStyle = PUR; g.lineWidth = 2.5; g.beginPath(); g.arc(x, y, 13, 0, 7); g.stroke(); text(g, String(i + 1), x, y + 4.5, 11, 800, i === 4 ? '#FFFFFF' : PUR, 'center'); text(g, s, x, y + 30, 8.5, 800, INK, 'center'); });
    CO.plane(g, po.x + po.w - 40, po.y + 62, 2.2, -0.4, AMB);
    /* the flight-school sign under the poster */
    shadowed(g, 10, 4, 0.16, function () { fillRR(g, po.x, 114, po.w, 54, 10, INK); }); fillRR(g, po.x + 6, 120, po.w - 12, 42, 7, '#2A2F55'); wings(g, po.x + 48, 141, 0.62, YEL);
    text(g, 'TECHNEXT FLIGHT SCHOOL', po.x + 92, 139, 13, 800, '#FFFFFF'); text(g, 'Odoo 20 training bay · practise first, then fly', po.x + 92, 154, 7.5, 700, '#C9C2E0');
    for (var lt = 0; lt < 3; lt++) fillE(g, po.x + po.w - 22 - lt * 14, 141, 3.5, 3.5, ['#2BC48A', AMB, '#E2453C'][lt]);
    fillRR(g, -420, 400, 300, 14, 5, '#C9A27A'); [-400, -150].forEach(function (lx) { fillRR(g, lx, 414, 10, F - 414, 3, '#9AA6BC'); });
    [[-390, '#3167CA'], [-320, PUR], [-250, '#2E9C7E']].forEach(function (b) { fillRR(g, b[0], 366, 56, 36, 8, b[1]); fillRR(g, b[0] + 16, 358, 24, 10, 4, b[1]); fillRR(g, b[0] + 6, 378, 44, 4, 2, 'rgba(255,255,255,.4)'); });
    fillRR(g, 40, 300, 92, F - 300, 8, '#3A4458'); fillRR(g, 48, 312, 76, 40, 4, '#1E2A3A'); text(g, 'COFFEE', 86, 336, 9, 800, AMB, 'center'); fillRR(g, 70, 372, 32, 30, 3, '#2A3142'); fillRR(g, 78, 384, 16, 16, 2, '#FFFFFF');
    /* the flight-strip board (the schedule) */
    var b = T.strip; shadowed(g, 10, 4, 0.18, function () { fillRR(g, b.x, b.y, b.w, b.h, 8, '#3A4458'); }); fillRR(g, b.x + 6, b.y + 26, b.w - 12, b.h - 34, 4, '#2A3142');
    text(g, 'FLIGHT STRIPS', b.x + b.w / 2, b.y + 18, 9, 800, '#FFFFFF', 'center');
    for (var rl = 0; rl < 5; rl++) { g.fillStyle = '#4A5468'; g.fillRect(b.x + 8, b.y + 32 + rl * 38 + 30, b.w - 16, 3); }
    /* the simulator screen: hung from the ceiling, a glare shield with gauges on top */
    g.strokeStyle = '#9AA6BC'; g.lineWidth = 2; g.beginPath(); g.moveTo(SC.x + 60, CEIL); g.lineTo(SC.x + 60, SC.y - 34); g.moveTo(SC.x + SC.w - 60, CEIL); g.lineTo(SC.x + SC.w - 60, SC.y - 34); g.stroke();
    shadowed(g, 16, 6, 0.2, function () { fillRR(g, SC.x - 10, SC.y - 10, SC.w + 20, SC.h + 20, 12, '#2A3142'); });
    g.fillStyle = '#3A3550'; g.beginPath(); g.moveTo(SC.x - 22, SC.y - 4); g.lineTo(SC.x + 30, SC.y - 38); g.lineTo(SC.x + SC.w - 30, SC.y - 38); g.lineTo(SC.x + SC.w + 22, SC.y - 4); g.closePath(); g.fill();
    fillRR(g, SC.x + 30, SC.y - 38, SC.w - 60, 4, 2, '#4E4868');
    fillRR(g, SC.x, SC.y, SC.w, SC.h, 4, '#FFFFFF');
    /* the certificate (wings) and the quick-reference guide rack */
    var c = T.cert; shadowed(g, 8, 3, 0.18, function () { fillRR(g, c.x, c.y, c.w, c.h, 4, '#C9A27A'); }); fillRR(g, c.x + 5, c.y + 5, c.w - 10, c.h - 10, 2, '#FFFDF6');
    wings(g, c.x + c.w / 2, c.y + 30, 0.62, '#C99A2E'); text(g, 'CERTIFIED', c.x + c.w / 2, c.y + 56, 6.6, 800, PUR, 'center'); fillRR(g, c.x + 16, c.y + 62, c.w - 32, 2.4, 1, '#C9D3E3'); fillRR(g, c.x + 22, c.y + 68, c.w - 44, 2.4, 1, '#C9D3E3');
    var r = T.rack; shadowed(g, 8, 3, 0.16, function () { fillRR(g, r.x, r.y, r.w, r.h, 6, '#FFFFFF'); }); fillRR(g, r.x, r.y, r.w, 18, 6, AMB); g.fillRect(r.x, r.y + 10, r.w, 8); text(g, 'GUIDES', r.x + r.w / 2, r.y + 13, 8, 800, '#FFFFFF', 'center');
    for (var sl = 0; sl < 3; sl++) { fillRR(g, r.x + 6, r.y + 46 + sl * 32, r.w - 12, 6, 2, '#E3DCEB'); }
    /* the instructor station: a tall console, two screens, a beacon */
    var io = T.ios; soft(g, io.x + io.w / 2, F + 4, 90, 8, 0.26); fillRR(g, io.x, io.y, io.w, F - io.y, 6, '#4A5468'); fillRR(g, io.x + 8, io.y + 16, io.w - 16, 38, 4, '#5C6680'); fillRR(g, io.x - 6, io.y - 6, io.w + 12, 12, 5, '#3A4458');
    [0, 1, 2, 3, 4].forEach(function (s) { fillE(g, io.x + 22 + s * 24, io.y + 70, 5, 5, ['#2BC48A', AMB, '#E2453C', BLUE, '#2BC48A'][s]); });
    [[io.x + 6, 62], [io.x + 74, 62]].forEach(function (m) { g.fillStyle = '#5C6B7A'; g.fillRect(m[0] + 29, io.y - 22, 4, 18); fillRR(g, m[0], io.y - 22 - 52, m[1], 52, 4, '#2A3142'); });
    g.strokeStyle = '#9AA6BC'; g.lineWidth = 4; g.beginPath(); g.moveTo(io.x + io.w - 10, io.y - 6); g.lineTo(io.x + io.w - 10, io.y - 104); g.stroke(); fillRR(g, io.x + io.w - 22, io.y - 112, 24, 8, 3, '#5C6B7A');
    K.plant(g, { x: 1310, y: F }, '#FFFFFF', '#E3DCEB');
  }
  function paintFront(g, ext) { /* nothing static in front of the pods: they move */ }
  function cone(g, x, y, s) { g.save(); g.translate(x, y); g.scale(s, s); soft(g, 0, 2, 30, 6, 0.24); fillRR(g, -26, -8, 52, 8, 3, '#E0661F'); g.fillStyle = '#F2852E'; g.beginPath(); g.moveTo(-18, -8); g.lineTo(-5, -62); g.lineTo(5, -62); g.lineTo(18, -8); g.closePath(); g.fill();
    g.fillStyle = '#FFFFFF'; g.beginPath(); g.moveTo(-13, -26); g.lineTo(-9, -42); g.lineTo(9, -42); g.lineTo(13, -26); g.closePath(); g.fill(); g.restore(); }
  function paintFore(g, ext) {
    cone(g, 196, 700, 1); cone(g, 236, 712, 0.86); cone(g, 990, 690, 1);
    /* a flight bag with a headset on it */
    g.save(); g.translate(250, 0); soft(g, 560, 744, 50, 7, 0.26); fillRR(g, 516, 690, 90, 54, 10, '#3A4458'); fillRR(g, 516, 690, 90, 12, 6, '#4A5468'); fillRR(g, 540, 676, 42, 16, 6, '#2A3142'); fillRR(g, 530, 712, 62, 18, 4, '#4A5468');
    g.strokeStyle = '#2A3550'; g.lineWidth = 6; g.beginPath(); g.arc(612, 712, 22, Math.PI * 1.05, Math.PI * 1.95); g.stroke(); fillRR(g, 586, 704, 14, 22, 6, '#2A3550'); fillRR(g, 624, 704, 14, 22, 6, '#2A3550'); fillRR(g, 628, 700, 6, 6, 2, AMB); g.restore();
    gate(g);
    /* boxes of guides, ready to hand out */
    [[1010, 760, 100, 66], [1024, 694, 76, 54]].forEach(function (bx) { soft(g, bx[0] + bx[2] / 2, bx[1] + 3, bx[2] * 0.6, 7, 0.26); fillRR(g, bx[0], bx[1] - bx[3], bx[2], bx[3], 4, '#C99A6B'); fillRR(g, bx[0] - 3, bx[1] - bx[3], bx[2] + 6, 12, 3, '#B5865A');
      fillRR(g, bx[0] + 12, bx[1] - bx[3] + 22, bx[2] - 24, 18, 2, '#FFFFFF'); text(g, 'GUIDES', bx[0] + bx[2] / 2, bx[1] - bx[3] + 35, 8, 800, PUR, 'center'); });
    /* the model plane's stand (the plane and its spinning propeller are live) */
    soft(g, 360, 770, 40, 7, 0.26); fillRR(g, 330, 756, 60, 14, 4, '#5C6B7A'); fillRR(g, 356, 692, 8, 66, 3, '#9AA6BC');
    K.plant(g, { x: -560, y: 770 }, '#FFFFFF', '#E3DCEB'); cone(g, -700, 760, 1);
  }

  /* behind the title card, on the floor: the boarding stairs up to the briefing deck, a taxiway sign, wheel chocks */
  function gate(g) {
    /* the airport taxiway sign: black and yellow, on two legs */
    var sx = -330, sy = 600; soft(g, sx, sy + 4, 70, 7, 0.26); g.fillStyle = '#5C6B7A'; g.fillRect(sx - 52, sy - 40, 6, 40); g.fillRect(sx + 46, sy - 40, 6, 40);
    fillRR(g, sx - 70, sy - 84, 140, 46, 4, '#1B1B1B'); fillRR(g, sx - 66, sy - 80, 64, 38, 2, YEL); text(g, '← SIM 1–3', sx - 34, sy - 56, 9.5, 800, '#1B1B1B', 'center');
    text(g, 'BRIEF', sx + 34, sy - 63, 9.5, 800, YEL, 'center'); text(g, 'ROOM →', sx + 34, sy - 50, 9.5, 800, YEL, 'center');
    /* the boarding stairs (mobile airstair) on castors */
    var bx = -120, by = 640; soft(g, bx + 70, by + 4, 100, 9, 0.28); fillRR(g, bx - 10, by - 26, 170, 16, 5, '#5C6680'); [bx, bx + 140].forEach(function (x) { fillE(g, x, by - 6, 8, 8, '#2A3142'); fillE(g, x, by - 6, 3, 3, '#9AA6BC'); });
    g.fillStyle = '#B9B0CC'; g.beginPath(); g.moveTo(bx, by - 26); g.lineTo(bx + 110, by - 196); g.lineTo(bx + 160, by - 196); g.lineTo(bx + 160, by - 26); g.closePath(); g.fill(); g.strokeStyle = PUR; g.lineWidth = 3; g.stroke(); fillRR(g, bx + 132, by - 190, 22, 160, 4, '#A49AC0');
    for (var st = 0; st < 8; st++) { var u = st / 8, x = bx + 8 + u * 104, y = by - 34 - u * 160; fillRR(g, x, y, 34, 7, 2, '#F4F1F8'); fillRR(g, x, y + 5, 34, 2, 1, '#8E86A3'); }
    fillRR(g, bx + 108, by - 204, 56, 10, 3, PUR); g.strokeStyle = '#5C6680'; g.lineWidth = 4; g.lineCap = 'round'; g.beginPath(); g.moveTo(bx + 4, by - 70); g.lineTo(bx + 112, by - 240); g.lineTo(bx + 162, by - 240); g.moveTo(bx + 162, by - 240); g.lineTo(bx + 162, by - 200); g.stroke();
    g.strokeStyle = '#7A84A0'; g.lineWidth = 2; for (var p = 0; p < 6; p++) { var q = p / 5; g.beginPath(); g.moveTo(bx + 4 + q * 108, by - 70 - q * 170); g.lineTo(bx + 10 + q * 108, by - 34 - q * 160); g.stroke(); }
    fillRR(g, bx + 118, by - 120, 36, 22, 3, '#FFFFFF'); text(g, 'SIM', bx + 136, by - 105, 8, 800, PUR, 'center');
    /* wheel chocks */
    [[-460, 660], [-420, 660]].forEach(function (c) { soft(g, c[0], c[1] + 2, 16, 3, 0.24); g.fillStyle = YEL; g.beginPath(); g.moveTo(c[0] - 14, c[1]); g.lineTo(c[0] + 14, c[1]); g.lineTo(c[0] + 6, c[1] - 14); g.lineTo(c[0] - 6, c[1] - 14); g.closePath(); g.fill(); fillRR(g, c[0] - 10, c[1] - 9, 20, 3, 1, '#1B1B1B'); });
  }
  /* ============================== the cast ============================== */
  var W = CR.who;
  var TR = W({ x: 650, y: 470, s: 0.54, ph: 0.3, skin: 2, hair: 1, style: 'pony', outfit: 'polo', top: PUR, hold: 'tablet', headset: AMB, hands: [[-60, -212], [70, -170]], look: -0.4 });
  var FIN = W({ x: 300, y: PLAT, s: 0.5, ph: 1.1, skin: 0, hair: 0, style: 'bob', outfit: 'cardigan', top: '#2E9C7E', top2: '#FFFFFF', glasses: true, sit: true, chair: false, id: PASS, headset: '#2E9C7E', hands: [[-60, -206], [60, -206]] });
  var SAL = W({ x: 470, y: PLAT, s: 0.5, ph: 2.0, skin: 2, hair: 0, style: 'short', outfit: 'shirt', top: '#E46E78', sit: true, chair: false, id: PASS, headset: '#E46E78', hands: [[-60, -206], [60, -206]] });
  var WH = W({ x: 815, y: PLAT, s: 0.5, ph: 2.7, skin: 3, hair: 0, style: 'short', outfit: 'polo', top: AMB, sit: true, chair: false, id: PASS, hatKind: 'cap', hat: '#5C6B7A', hands: [[-60, -206], [60, -206]] });
  [FIN, SAL, WH].forEach(function (P, i) { P.pod = i; });
  var BEN = W({ x: -160, y: 470, s: 0.5, ph: 0.4, skin: 1, hair: 2, style: 'pony', outfit: 'cardigan', top: '#E46E78', top2: '#FFFFFF', sit: true, chair: false, sitDrop: 50, id: PASS, hands: [[-40, -230], [40, -230]], look: 0.3 });
  var CREW = [
    { x0: 1080, x1: 1400, y: 492, spd: 15, ph: 0.3, label: 'TechNext consultant', lines: ['More **quick-reference guides** for the rack.', 'Administrators next: users, access rights and **settings**.'], acts: ['nod', 'tr_plane'],
      P: W({ s: 0.5, skin: 1, hair: 0, style: 'short', outfit: 'shirt', top: BLUE, hold: 'box' }) },
    { x0: -930, x1: -640, y: 494, spd: 14, ph: 0.6, label: 'Trainee, administrator', lines: ['Admin session at **two**: users and access rights.', 'Practising on a **copy** of our data. Nothing breaks!'], acts: ['cheer', 'tr_salute'],
      P: W({ s: 0.5, skin: 0, hair: 1, style: 'long', outfit: 'cardigan', top: '#3A72D6', top2: '#FFFFFF', id: PASS, hold: 'tablet' }) },
    { front: true, x0: -540, x1: 120, y: 672, spd: 18, ph: 0.2, label: 'TechNext consultant', lines: ['Key users first, then everyone else. **They** train the rest.', 'A refresher after the **first month-end**, too.'], acts: ['wave', 'tr_wings'],
      P: W({ s: 0.58, skin: 3, hair: 0, style: 'bun', outfit: 'polo', top: '#2E9C7E', hold: 'clipboard' }) }
  ];

  /* the tap moves: every person has their own */
  var A = CR.ACT;
  A.tr_marshal = { dur: 2.0, fx: '', pose: function (P, u, t) { var w = Math.sin(t * 9); P.mood = 'happy'; P.hands = [[-120, -400 + w * 60], [120, -400 - w * 60]]; P.hop = Math.abs(Math.sin(u * Math.PI * 4)) * 10; } };
  A.tr_thumbs = { dur: 1.5, fx: 'star', pose: function (P, u) { P.mood = 'happy'; P.hands = [[-60, -212], [100, -330]]; P.hop = Math.sin(u * Math.PI) * 16; P.tilt = 0.08; } };
  A.tr_validate = { dur: 1.4, fx: '', pose: function (P, u) { P.mood = u > 0.3 ? 'happy' : 'calm'; var d = u < 0.25 ? u / 0.25 : u < 0.35 ? 1 : 0; P.hands = [[-60, -206], [60, -330 + d * 160]]; } };
  A.tr_fist = { dur: 1.5, fx: 'conf', pose: function (P, u, t) { P.mood = 'happy'; P.hands = [[-60, -206], [80, -400 + Math.abs(Math.sin(t * 12)) * 60]]; } };
  A.tr_lift = { dur: 1.8, fx: '', pose: function (P, u) { P.mood = u < 0.5 ? 'wow' : 'happy'; P.hands = [[-110, -420], [110, -420]]; P.tilt = Math.sin(u * Math.PI * 3) * 0.12; } };
  A.tr_confirm = { dur: 1.4, fx: 'spark', pose: function (P, u, t) { P.mood = 'happy'; P.hands = [[-60, -206], [70, -300 + (Math.sin(t * 20) > 0 ? 0 : 10)]]; } };
  A.tr_scan = { dur: 1.6, fx: '', pose: function (P, u) { P.mood = 'happy'; P.hands = [[-60, -206], [130, -360 + Math.sin(u * Math.PI * 2) * 50]]; } };
  A.tr_count = { dur: 1.8, fx: '', pose: function (P, u, t) { P.mood = 'calm'; P.tilt = Math.sin(t * 6) * 0.05; P.hands = [[-40, -330], [40 + Math.floor(u * 3) * 14, -340]]; } };
  A.tr_plane = { dur: 1.3, fx: '', pose: function (P, u) { P.mood = 'happy'; P.hands = u < 0.4 ? [[-60, -200], [60, -420]] : [[-60, -200], [-120, -300]]; } };
  A.tr_salute = { dur: 1.6, fx: 'star', pose: function (P, u) { P.mood = 'happy'; P.hands = [[-60, -200], [50, -430]]; P.tilt = -0.06; } };
  A.tr_wings = { dur: 2.0, fx: 'spark', pose: function (P, u, t) { var w = Math.sin(t * 4); P.mood = 'happy'; P.hands = [[-170, -280 + w * 40], [170, -280 - w * 40]]; P.tilt = w * 0.14; } };

  var FX = [], GD = { t: -9 }, CT = { t: -9 }, BNT = { t: -9 };
  /* the trainee on the bench (behind the title card, a client: grey pass): idle, reads her quick-reference guide, turns a page,
     sips her coffee, looks up at the flight strips; tapped, she pulls on her headset and gives a thumbs up: ready for take-off */
  function actBen(P, t) {
    var u = t - BNT.t, cyc = (t + 1) % 9; P.sx = 1; P.tilt = 0; P.hop = 0; P.talk = false; P.mood = 'calm'; P._guide = 1; P._cup = 0; P.headset = null;
    if (cyc < 4) { P.hands = [[-36, -250], [36, -250]]; P.look = 0.1; P.tilt = 0.03; if (cyc > 3.4) P.hands = [[-36, -250], [-6, -262]]; }
    else if (cyc < 6) { P.hands = [[-36, -250], [70, -330]]; P._cup = 1; P.look = lerp(P.look, 0.7, 0.06); }
    else { P.hands = [[-40, -220], [40, -220]]; P._guide = 0; P.look = lerp(P.look, 0.9, 0.05); P.mood = 'happy'; P.tilt = Math.sin(t * 1.5) * 0.04; }
    if (u < 2.2) { P.talk = true; P.mood = 'happy'; P._guide = 0; P._cup = 0; P.look = 0.3;
      if (u < 0.8) P.hands = [[-90, -400], [90, -400]]; else { P.headset = '#E46E78'; P.hands = [[-40, -220], [90, -330]]; P.hop = u < 1.2 ? Math.sin((u - 0.8) / 0.4 * Math.PI) * 12 : 0; }
      if (u > 0.9 && !BNT.b) { BNT.b = 1; fx('badge', P.x, P.y - 270, t, { txt: 'Ready for take-off', life: 1.6, bg: '#F4F0F8', fg: PUR }); } } else BNT.b = 0;
  }
  function fx(kind, x, y, t, o) { FX.push({ k: kind, x: x, y: y, t0: t, o: o || {} }); }
  function acting(st, name, t) { return st && st.rx === name ? (t - st.rxT) / A[name].dur : -1; }
  function role(S, t) { var i = ['finance', 'sales', 'warehouse'].indexOf(S.hot); return i >= 0 ? i : Math.floor(t / 5) % 3; }

  /* ============================== live drawing ============================== */
  function miniScreen(g, x, y, w, h, R, t, i) { /* each pod's own monitor: the role's screen, small */
    fillRR(g, x - 3, y - 3, w + 6, h + 6, 4, '#2A3142'); fillRR(g, x, y, w, h, 2, '#FFFFFF'); fillRR(g, x, y, w, 7, 2, R.col);
    text(g, R.tab.toUpperCase(), x + 4, y + 5.6, 4.4, 800, '#FFFFFF');
    var hi = Math.floor((t * 0.8 + i) % 3); for (var r = 0; r < 3; r++) { fillRR(g, x + 3, y + 11 + r * 9, w - 6, 7, 1.5, r === hi ? '#F4F0F8' : '#F6F7FA'); fillRR(g, x + 5, y + 13 + r * 9, 14 + hash(r + i * 3) * 10, 2.6, 1, '#9AA6BC'); fillE(g, x + w - 8, y + 14.5 + r * 9, 2.2, 2.2, R.rows[r][3] === 0 ? AMB : '#2BC48A'); }
    fillRR(g, x + 3, y + h - 9, 16, 6, 2, PUR);
  }
  function pod(g, p, t, P) { /* the motion platform, the pistons, the shell, the screen on its arm */
    var x = p.x, y = PLAT - podY(p.r, t), s = 0.5;
    soft(g, x, F + 3, 86, 8, 0.28); fillE(g, x, F - 2, 70, 9, '#C9C2D8');
    g.strokeStyle = '#9AA6BC'; g.lineWidth = 6; g.lineCap = 'round'; [-42, 0, 42].forEach(function (d) { g.beginPath(); g.moveTo(x + d * 1.2, F - 4); g.lineTo(x + d, y + 8); g.stroke(); });
    g.strokeStyle = '#D8DEE8'; g.lineWidth = 3; [-42, 0, 42].forEach(function (d) { g.beginPath(); g.moveTo(x + d * 1.1, F - 10); g.lineTo(x + d * 1.04, y + 16); g.stroke(); });
    fillRR(g, x - 74, y, 148, 12, 6, '#5C6680'); fillRR(g, x - 74, y, 148, 4, 3, '#7A84A0');
    /* the shell behind the trainee, and the seat */
    g.beginPath(); g.moveTo(x - 66, y); g.lineTo(x - 70, y - 150); g.quadraticCurveTo(x - 70, y - 238, x, y - 242); g.quadraticCurveTo(x + 70, y - 238, x + 70, y - 150); g.lineTo(x + 66, y); g.closePath(); g.fillStyle = '#FFFFFF'; g.fill(); g.strokeStyle = PUR; g.lineWidth = 3; g.stroke();
    fillRR(g, x - 14, y - 252, 28, 12, 5, '#5C6680'); fillE(g, x, y - 252, 6, 5, Math.floor(t * 1.5 + p.r) % 3 ? '#2BC48A' : AMB);
    g.fillStyle = '#D9D2E6'; g.beginPath(); g.moveTo(x - 54, y); g.lineTo(x - 56, y - 150); g.quadraticCurveTo(x - 56, y - 222, x, y - 226); g.quadraticCurveTo(x + 56, y - 222, x + 56, y - 150); g.lineTo(x + 54, y); g.closePath(); g.fill();
    fillRR(g, x - 70, y - 126, 6, 70, 3, ROLES[p.r].col); fillRR(g, x + 64, y - 126, 6, 70, 3, ROLES[p.r].col);
    fillRR(g, x - 44, y - 172, 88, 120, 30, '#3A3550'); fillRR(g, x - 56, y - 48, 112, 16, 8, '#4A4466');
    /* the monitor arm and the screen beside the trainee */
    var mx = p.side < 0 ? x - 128 : x + 66, my = y - 176; g.strokeStyle = '#7A84A0'; g.lineWidth = 5; g.beginPath(); g.moveTo(x + p.side * 66, y - 110); g.lineTo(mx + 31, my + 50); g.stroke();
    miniScreen(g, mx, my, 62, 44, ROLES[p.r], t, p.r);
    text(g, 'SIM ' + (p.r + 1), x, y + 10, 7.5, 800, '#FFFFFF', 'center');
  }
  function paintLive(g, t, now, S) {
    CO.crew(CREW, g, t, S, false);
    var ri = role(S, t), R = ROLES[ri], x = SC.x, y = SC.y, db = S.hot === 'database';
    /* the glare shield's gauges: attitude, speed, altitude, heading (needles alive) */
    [SC.x + 110, SC.x + 180, SC.x + SC.w - 180, SC.x + SC.w - 110].forEach(function (gx, i) { var gy = SC.y - 20; fillE(g, gx, gy, 11, 11, '#1E2A3A'); g.strokeStyle = '#7A84A0'; g.lineWidth = 1.4; g.beginPath(); g.arc(gx, gy, 11, 0, 7); g.stroke();
      if (i === 0) { g.save(); g.beginPath(); g.arc(gx, gy, 10, 0, 7); g.clip(); g.translate(gx, gy); g.rotate(Math.sin(t * 0.8) * 0.2); g.fillStyle = '#6FB2EE'; g.fillRect(-12, -12, 24, 12); g.fillStyle = '#B08A5A'; g.fillRect(-12, 0, 24, 12); g.restore(); fillRR(g, gx - 6, gy - 1, 12, 2, 1, YEL); }
      else { var an = t * (0.4 + i * 0.3) + i; g.strokeStyle = i === 3 ? AMB : '#FFFFFF'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(gx, gy); g.lineTo(gx + Math.cos(an) * 8, gy + Math.sin(an) * 8); g.stroke(); } });
    fillE(g, SC.x + SC.w / 2, SC.y - 20, 3, 3, Math.floor(t * 2) % 2 ? '#2BC48A' : '#1E6B4A');
    /* the simulator screen: the role's Odoo screen, on a copy of the client's data */
    fillRR(g, x, y, SC.w, 26, 3, PUR); text(g, 'SIMULATOR · TRAINING DATABASE · a copy of your own data', x + 12, y + 17, 8.6, 800, '#FFFFFF');
    fillE(g, x + SC.w - 16, y + 13, 3.6, 3.6, Math.floor(t * 1.5) % 2 ? '#FF6B5E' : '#FFD4CF'); text(g, 'SIM', x + SC.w - 24, y + 16.5, 7, 800, '#FFD4CF', 'right');
    if (db) { var pz = 0.5 + 0.5 * Math.sin(t * 5); g.strokeStyle = 'rgba(255,216,74,' + (0.5 + pz * 0.5).toFixed(2) + ')'; g.lineWidth = 3; rr(g, x + 1, y + 1, SC.w - 2, 24, 3); g.stroke(); }
    ROLES.forEach(function (Q, i) { var tx = x + 12 + i * 110; fillRR(g, tx, y + 34, 102, 24, 6, i === ri ? Q.col : '#F1F4F9'); text(g, Q.tab, tx + 51, y + 50, 9.5, 800, i === ri ? '#FFFFFF' : '#5C6B7A', 'center'); });
    text(g, R.h, x + 14, y + 84, 14, 800, INK);
    var st = (t * (S.hot === R.key ? 1.2 : 0.6)) % 5;
    R.rows.forEach(function (r, i) { var ry = y + 96 + i * 32, hi = Math.floor(st) === i; fillRR(g, x + 12, ry, SC.w - 24, 26, 5, hi ? '#F4F0F8' : '#FAFBFC');
      text(g, r[0], x + 22, ry + 17, 9.5, 700, INK); var ok = r[3] === 1, tag = r[3] === 2 ? '#EEF2F7' : (ok ? '#DDF5EA' : '#FFF1D6');
      fillRR(g, x + 230, ry + 5, 76, 16, 8, tag); text(g, r[1], x + 268, ry + 16.5, 8, 800, r[3] === 2 ? '#5C6B7A' : (ok ? '#1E9E6A' : '#B7791F'), 'center'); text(g, r[2], x + SC.w - 22, ry + 17, 9.5, 800, INK, 'right'); });
    var bp = st > 3.2 && st < 3.6; fillRR(g, x + 12, y + 200, 86, 28, 6, bp ? '#5A3A52' : PUR); text(g, R.btn, x + 55, y + 218, 10, 800, '#FFFFFF', 'center');
    var ta = clamp((st - 0.6) * 3, 0, 1); g.save(); g.globalAlpha = ta; fillRR(g, x + 112, y + 198, 300, 32, 8, INK); g.fillStyle = INK; g.beginPath(); g.moveTo(x + 112, y + 210); g.lineTo(x + 102, y + 214); g.lineTo(x + 112, y + 218); g.fill();
    text(g, R.tip, x + 124, y + 218, 9, 700, '#FFFFFF'); g.restore();
    /* the strip board: one strip per session; today's slides out and its lamp glows */
    var b = T.strip, today = S.hot === 'schedule' ? Math.floor(t * 1.4) % 4 : ri;
    [['MON', 'Finance', '#2E9C7E'], ['TUE', 'Sales', '#E46E78'], ['WED', 'Warehouse', AMB], ['THU', 'Administrators', BLUE]].forEach(function (d, i) { var on = i === today, sl = on ? 10 + Math.sin(t * 3) * 1.5 : 0, yy = b.y + 34 + i * 38;
      fillRR(g, b.x + 10 + sl, yy, b.w - 20, 28, 3, on ? '#FFFFFF' : '#EEF0F5'); fillRR(g, b.x + 10 + sl, yy, 7, 28, 2, d[2]);
      text(g, d[0], b.x + 24 + sl, yy + 12, 7, 800, '#8A93A6'); text(g, d[1], b.x + 24 + sl, yy + 23, 8.6, 800, INK); fillE(g, b.x + b.w - 22 + sl, yy + 14, 4, 4, on ? (Math.floor(t * 3) % 2 ? '#2BC48A' : '#BFEAD4') : '#C9D0DB'); });
    fillRR(g, b.x + 10, b.y + 186, b.w - 20, 26, 3, '#3A4458'); text(g, 'Key users first', b.x + b.w / 2, b.y + 203, 7.6, 800, YEL, 'center');
    /* the guide rack: three role guides; one hops forward in turn */
    var r = T.rack, gs = S.hot === 'guides'; ROLES.forEach(function (Q, i) { var up = (gs ? Math.floor(t * 2) % 3 === i : Math.floor(t / 2) % 3 === i) ? 6 : 0;
      fillRR(g, r.x + 12 + i * 18, r.y + 24 - up + (i % 2) * 2, 16, 26, 2, Q.col); fillRR(g, r.x + 14 + i * 18, r.y + 28 - up + (i % 2) * 2, 12, 3, 1, 'rgba(255,255,255,.6)'); });
    for (var sl2 = 0; sl2 < 2; sl2++) for (var bk = 0; bk < 4; bk++) fillRR(g, r.x + 9 + bk * 14, r.y + 56 + sl2 * 32 - 14, 11, 16, 1.5, ['#FFFFFF', '#F4F0F8'][(bk + sl2) % 2]);
    if (t - CT.t < 2) { var c = T.cert; for (var s2 = 0; s2 < 6; s2++) { var a = s2 * 1.05 + t * 2, r2 = 50 + Math.sin(t * 6 + s2) * 6; fillE(g, c.x + c.w / 2 + Math.cos(a) * r2, c.y + c.h / 2 + Math.sin(a) * r2 * 0.6, 2.5, 2.5, YEL); } }
    /* the instructor station's screens and beacon */
    var io = T.ios; [0, 1, 2, 3].forEach(function (k2) { var lift = GD.t > t - 1.2 && k2 === 3 ? -40 : 0; if (!lift) fillRR(g, io.x + 48 + k2 * 0.6, io.y - 4 - k2 * 5, 44, 5, 1.5, k2 % 2 ? '#FFFFFF' : ROLES[k2 % 3].col); });
    CO.screen(g, io.x + 9, io.y - 71, 56, 46, t, 'chart'); fillRR(g, io.x + 77, io.y - 71, 56, 46, 2, '#FFFFFF');
    PODS.forEach(function (p, i) { var yy = io.y - 66 + i * 14; fillE(g, io.x + 85, yy + 4, 3.4, 3.4, ROLES[i].col); text(g, 'SIM ' + (i + 1), io.x + 92, yy + 6.6, 6.4, 800, INK); fillRR(g, io.x + 112, yy + 1, 16, 6, 3, '#EEF2F7'); fillRR(g, io.x + 112, yy + 1, 16 * ((t * 0.1 + i * 0.3) % 1), 6, 3, '#2BC48A'); });
    var bx = io.x + io.w - 10, by = io.y - 120; fillRR(g, bx - 9, by - 6, 18, 14, 6, '#FFE7B8'); var bang = t * 4; fillRR(g, bx - 9, by - 6, 18, 14, 6, 'rgba(242,163,58,' + (0.5 + 0.5 * Math.abs(Math.cos(bang))).toFixed(2) + ')');
    g.globalAlpha = 0.18 * Math.max(0, Math.cos(bang)); g.fillStyle = AMB; g.beginPath(); g.moveTo(bx, by); g.lineTo(bx + Math.sin(bang) * 70 - 14, by - 30); g.lineTo(bx + Math.sin(bang) * 70 + 14, by - 30); g.closePath(); g.fill(); g.globalAlpha = 1;
    /* the world clocks, the coffee machine's steam */
    var nowMs = Date.now(); [[-598, 8], [-550, 8], [-502, 7]].forEach(function (c) { var d = new Date(nowMs + c[1] * 3600e3); K.clockHands(g, { x: c[0], y: -72, r: 17 }, d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds()); });
    g.strokeStyle = 'rgba(160,170,190,.55)'; g.lineWidth = 2; g.lineCap = 'round'; for (var sm = 0; sm < 2; sm++) { var ph = (t * 0.5 + sm * 0.5) % 1; g.globalAlpha = 1 - ph; g.beginPath(); g.moveTo(84 + sm * 6, 380 - ph * 10); g.quadraticCurveTo(84 + sm * 6 + Math.sin(t * 3 + sm) * 5, 368 - ph * 14, 84 + sm * 6, 356 - ph * 18); g.stroke(); } g.globalAlpha = 1;
    /* the trainee on the bench, her guide and her coffee */
    actBen(BEN, t); K.person(g, BEN, t);
    if (BEN._guide) { var b0 = handW(BEN, 0), b1 = handW(BEN, 1); g.save(); g.translate((b0[0] + b1[0]) / 2, Math.min(b0[1], b1[1]) - 10); g.rotate(-0.06); fillRR(g, -18, -12, 36, 24, 2, '#FFFFFF'); fillRR(g, -18, -12, 36, 6, 2, PUR); fillRR(g, -1, -12, 2, 24, 1, '#E3DCEB'); g.fillStyle = '#C9D3E3'; for (var gl = 0; gl < 3; gl++) { g.fillRect(-14, -2 + gl * 4, 11, 1.4); g.fillRect(3, -2 + gl * 4, 11, 1.4); } g.restore(); }
    if (BEN._cup) { var bc = handW(BEN, 1); fillRR(g, bc[0] - 6, bc[1] - 13, 12, 13, 3, '#FFFFFF'); fillRR(g, bc[0] - 6, bc[1] - 13, 12, 4, 2, AMB); }
    /* the pods, behind their trainees */
    PODS.forEach(function (p, i) { pod(g, p, t, [FIN, SAL, WH][i]); });
    /* the warehouse trainee's scanner (behind his hand) */
    var hW = handW(WH, 1); g.save(); g.translate(hW[0] + 4, hW[1] - 2); g.rotate(-0.5); fillRR(g, -6, -8, 26, 12, 4, AMB); fillRR(g, -4, 2, 9, 14, 3, '#3A4458'); fillRR(g, 16, -6, 5, 8, 1, '#E2453C'); g.restore();
  }
  function paintFrontLive(g, t, S) {
    CO.crew(CREW, g, t, S, true);
    /* the consoles in front of each trainee: a keyboard tray, a side-stick, blinking switches */
    PODS.forEach(function (p, i) { var x = p.x, y = PLAT - podY(i, t); fillRR(g, x - 52, y - 84, 104, 9, 4, '#4A4466'); fillRR(g, x - 40, y - 88, 70, 5, 2, '#D9D3E6');
      g.strokeStyle = '#3A3550'; g.lineWidth = 4; g.beginPath(); g.moveTo(x + 42, y - 80); g.lineTo(x + 44 + Math.sin(t * 2 + i) * 3, y - 100); g.stroke(); fillE(g, x + 44 + Math.sin(t * 2 + i) * 3, y - 102, 4, 4, '#2A3142');
      for (var sw = 0; sw < 4; sw++) fillE(g, x - 44 + sw * 8, y - 79, 1.6, 1.6, (Math.floor(t * 2 + sw + i) % 4) ? '#2BC48A' : AMB); });
    /* the warehouse scanner's red line */
    if ((t + 0.4) % 1.7 < 0.18 || acting(S.cast.wh, 'tr_scan', t) >= 0) { var hW = handW(WH, 1), y0 = PLAT - podY(2, t); g.strokeStyle = 'rgba(226,69,60,.75)'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(hW[0] + 22, hW[1] - 6); g.lineTo(x0(), y0 - 86); g.stroke(); }
    function x0() { return PODS[2].x - 20; }
    /* the taxi line's centre lights, chasing toward the pods */
    for (var L = 0; L < 26; L++) { var u = L / 25, pt = taxiPt(u), on = Math.floor(t * 8) % 26 === L || Math.floor(t * 8 - 1) % 26 === L; fillE(g, pt[0], pt[1], on ? 4 : 2.6, on ? 2.6 : 1.8, on ? '#4BE38F' : 'rgba(43,196,138,.45)'); }
    drawFX(g, t, S);
    CR.draw(g, t);
  }
  function drawFX(g, t, S) {
    FX = FX.filter(function (f) { return t - f.t0 < (f.o.life || 1.6); });
    FX.forEach(function (f) { var u = (t - f.t0) / (f.o.life || 1.6), a = clamp((1 - u) * 3, 0, 1); if (u < 0) return; g.save(); g.globalAlpha = a;
      if (f.k === 'badge') { var y = f.y - u * 34, s = Math.min(1, u * 6); g.translate(f.x, y); g.scale(s, s); fillRR(g, -44, -14, 88, 26, 13, f.o.bg || '#DDF5EA'); g.strokeStyle = f.o.fg || '#1E9E6A'; g.lineWidth = 2; rr(g, -44, -14, 88, 26, 13); g.stroke(); text(g, f.o.txt, 0, 3.6, 9, 800, f.o.fg || '#1E9E6A', 'center'); }
      else if (f.k === 'beep') { g.strokeStyle = '#E2453C'; g.lineWidth = 2; for (var b = 0; b < 3; b++) { g.globalAlpha = a * (1 - b * 0.25); g.beginPath(); g.arc(f.x, f.y, 8 + u * 30 + b * 8, -0.7, 0.7); g.stroke(); } }
      else if (f.k === 'count') { var n = Math.min(3, 1 + Math.floor(u * 3.2)); text(g, String(n), f.x + (n - 2) * 24, f.y - u * 20, 18, 800, AMB, 'center'); }
      else if (f.k === 'plane') { var q = u, px = lerp(f.x, f.x - 760, q), py = f.y - 120 * Math.sin(q * Math.PI) - 40 * q + Math.sin(q * 14) * 8; CO.plane(g, px, py, 2.2, -0.35 + Math.cos(q * 14) * 0.2 + Math.PI, '#FFFFFF', '#9AA6BC'); }
      else if (f.k === 'guide') { var gx = lerp(f.x, f.o.tx, u), gy = lerp(f.y, f.o.ty, u) - Math.sin(u * Math.PI) * 90; g.translate(gx, gy); g.rotate(u * 6); fillRR(g, -16, -20, 32, 40, 3, '#FFFFFF'); fillRR(g, -16, -20, 32, 10, 3, PUR); text(g, 'GUIDE', 0, -12.5, 5.6, 800, '#FFFFFF', 'center'); for (var l = 0; l < 3; l++) fillRR(g, -11, -4 + l * 7, l % 2 ? 16 : 22, 2.4, 1.2, '#C9D3E3'); }
      g.restore(); });
  }
  function paintForeLive(g, t, S) {
    K.zfore(g, t, S, [], function () { CO.crew(CREW, g, t, S, 'fore'); });
    /* the model plane on its stand: the propeller spins */
    g.save(); g.translate(360, 682); g.rotate(-0.06); fillRR(g, -46, -8, 92, 16, 8, '#FFFFFF'); fillRR(g, -46, -3, 92, 3, 1, PUR); g.fillStyle = BLUE; g.beginPath(); g.moveTo(-6, -4); g.lineTo(-24, -40); g.lineTo(-12, -40); g.lineTo(14, -4); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(-6, 4); g.lineTo(-24, 34); g.lineTo(-12, 34); g.lineTo(14, 4); g.closePath(); g.fill(); g.fillStyle = AMB; g.beginPath(); g.moveTo(-40, -4); g.lineTo(-50, -22); g.lineTo(-42, -22); g.lineTo(-30, -4); g.closePath(); g.fill();
    fillE(g, 48, 0, 4, 4, '#3A4458'); var pa = t * 30; g.fillStyle = 'rgba(60,70,90,.55)'; fillE(g, 51, Math.sin(pa) * 16, 2.4, Math.abs(Math.cos(pa)) * 14 + 2, 'rgba(60,70,90,.55)'); g.restore();
    /* the instructor's wands (tap move) */
    var mu = acting(S.cast.tr, 'tr_marshal', t); if (mu >= 0) { [0, 1].forEach(function (i) { var h = handW(TR, i); g.save(); g.translate(h[0], h[1]); g.rotate(i ? 0.3 : -0.3); fillRR(g, -4, -46, 8, 44, 4, '#FF7A1A'); fillRR(g, -4, -46, 8, 10, 4, '#FFE0C2'); g.restore(); }); }
    CR.draw(g, t);
  }

  function look(P, st, t, S, rest) { P.look = lerp(P.look, t < st.until ? clamp((S.nexi.x - P.x) / 160, -1, 1) : rest, 0.08); }
  function trainee(id, key, P, acts, idle) { return { id: id, behind: true, keys: [key], P: P, act: function (P, t, S) { var st = S.cast[id], busy = S.hot === key;
    P.y = PLAT - podY(P.pod, t); P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm';
    var lean = idle(P, t, busy); look(P, st, t, S, busy ? 0 : lean);
    if (!CR.cast(P, st, t, acts)) P.tilt = P._tilt || 0;
    var u = acting(st, acts[1], t); if (u >= 0 && st._fx !== st.rxT) { st._fx = st.rxT; P.onTap(t); }
    if (st.rx === acts[0] && st._fx !== st.rxT) { st._fx = st.rxT; P.onTap2(t); } } }; }
  /* idle loops: finance types and leans to her screen, pushing her glasses; sales bobs along to the headset, leans back
     with his hands behind his head; the warehouse trainee scans and counts */
  FIN.onTap = function (t) { PODS[0].kick = t + 0.3; fx('badge', FIN.x, FIN.y - 262, t + 0.3, { txt: '✓ Matched', life: 1.6 }); };
  FIN.onTap2 = function (t) { fx('badge', FIN.x, FIN.y - 262, t, { txt: 'Month-end: done!', life: 1.6, bg: '#F4F0F8', fg: PUR }); };
  SAL.onTap = function (t) { PODS[1].lift = t; CR.burst('star', SAL.x, SAL.y - 280, t + 0.6); };
  SAL.onTap2 = function (t) { fx('badge', SAL.x, SAL.y - 262, t + 0.2, { txt: 'S00042 confirmed', life: 1.6, bg: '#FDEEF0', fg: '#C24456' }); };
  WH.onTap = function (t) { fx('beep', WH.x + 70, WH.y - 190, t, { life: 1.2 }); fx('badge', WH.x, WH.y - 262, t + 0.5, { txt: '6 / 6 scanned', life: 1.4, bg: '#FFF1D6', fg: '#B7791F' }); };
  WH.onTap2 = function (t) { fx('count', WH.x, WH.y - 250, t, { life: 1.8 }); };
  window.IXW.worlds.training = {
    pan: [-300, 1180],
    paintBg: paintBg, windowBehind: true, paintFrame: paintFrame, paintBack: paintBack, paintFront: paintFront, paintFore: paintFore,
    paintWindow: function (g, t) { var w = WIN; g.save(); g.beginPath(); g.rect(w.x, w.y, w.w, w.h); g.clip();
      var hz = w.y + w.h * 0.62;
      for (var i = 0; i < 3; i++) { var cx = w.x - 80 + ((t * (4 + i * 2) + i * 170) % (w.w + 160)), cy = w.y + 30 + i * 30; g.fillStyle = 'rgba(255,255,255,.9)'; g.beginPath(); g.ellipse(cx, cy, 38, 10, 0, 0, Math.PI * 2); g.ellipse(cx + 16, cy - 7, 22, 11, 0, 0, Math.PI * 2); g.fill(); }
      /* the windsock on its pole */
      var wx = w.x + w.w * 0.84, wy = hz - 44; g.strokeStyle = '#9AA6BC'; g.lineWidth = 2; g.beginPath(); g.moveTo(wx, hz + 4); g.lineTo(wx, wy); g.stroke();
      for (var sgm = 0; sgm < 4; sgm++) { var fl = Math.sin(t * 6 + sgm) * (1.5 + sgm); fillRR(g, wx + 2 + sgm * 8, wy - 4 + fl * 0.4 + sgm, 8, 8 - sgm, 1, sgm % 2 ? '#FFFFFF' : '#F2852E'); }
      /* a trainer plane: taxis in, rolls, lifts off, climbs out (go-live) */
      var cyc = t % 16, px, py, rot = 0;
      if (cyc < 5) { px = lerp(w.x + w.w + 40, w.x + w.w - 120, cyc / 5); py = hz + 12; }
      else if (cyc < 9) { var q = (cyc - 5) / 4; px = lerp(w.x + w.w - 120, w.x + 120, q * q); py = hz + 32 - (q > 0.55 ? (q - 0.55) * 60 : 0); rot = q > 0.55 ? -0.12 : 0; }
      else { var q2 = (cyc - 9) / 7; px = lerp(w.x + 120, w.x - 300, q2); py = hz + 5 - q2 * 200; rot = -0.22; }
      g.save(); g.translate(px, py); g.rotate(-rot); g.scale(-1, 1); fillRR(g, -26, -5, 52, 10, 5, '#FFFFFF'); fillRR(g, -26, -1, 52, 2, 1, PUR); g.fillStyle = '#E9EEF6'; g.beginPath(); g.moveTo(-4, -2); g.lineTo(-14, -14); g.lineTo(-6, -14); g.lineTo(8, -2); g.closePath(); g.fill();
      g.fillStyle = PUR; g.beginPath(); g.moveTo(-22, -3); g.lineTo(-30, -15); g.lineTo(-24, -15); g.lineTo(-16, -3); g.closePath(); g.fill(); fillE(g, 18, -2, 5, 3, '#8FC6EE'); if (cyc < 9) { fillE(g, -6, 7, 2.4, 2.4, '#2A3142'); fillE(g, 16, 7, 2.4, 2.4, '#2A3142'); } fillRR(g, 26, -8 + Math.sin(t * 40) * 6, 2, 10, 1, 'rgba(60,70,90,.6)'); g.restore();
      /* the airport tug crossing the apron */
      var tg = w.x + ((t * 14) % (w.w + 120)) - 60; fillRR(g, tg, hz + 2, 22, 9, 2, YEL); fillRR(g, tg + 14, hz - 4, 8, 7, 1, '#8FC6EE'); fillE(g, tg + 4, hz + 11, 2.4, 2.4, '#2A3142'); fillE(g, tg + 18, hz + 11, 2.4, 2.4, '#2A3142');
      g.restore(); },
    paintLive: paintLive, paintFrontLive: paintFrontLive, paintForeLive: paintForeLive,
    moteCol: 'rgba(113,75,103,.2)',
    glow: {
      finance: function (g) { rr(g, PODS[0].x - 50, 380, 100, 50, 12); }, sales: function (g) { rr(g, PODS[1].x - 50, 380, 100, 50, 12); }, warehouse: function (g) { rr(g, PODS[2].x - 50, 380, 100, 50, 12); },
      database: function (g) { rr(g, SC.x - 8, SC.y - 8, SC.w + 16, 42, 10); },
      guides: function (g) { var r = T.rack; rr(g, r.x - 8, r.y - 8, r.w + 16, r.h + 16, 10); },
      schedule: function (g) { var b = T.strip; rr(g, b.x - 10, b.y - 10, b.w + 20, b.h + 20, 12); },
      cert: function (g) { var c = T.cert; rr(g, c.x - 8, c.y - 8, c.w + 16, c.h + 16, 10); },
      guide: function (g) { var io = T.ios; rr(g, io.x + 40, io.y - 28, 60, 30, 8); }
    },
    backGlow: ['database', 'guides', 'schedule', 'cert', 'guide'],
    calmView: [190, -110, 750, 600],
    cast: [
      { id: 'tr', behind: false, keys: ['database'], P: TR, act: function (P, t, S) { var st = S.cast.tr, on = ['finance', 'sales', 'warehouse', 'database'].indexOf(S.hot), cyc = (t + 1) % 10;
        /* idle: walks the aisle, checks the tablet, points at the simulator screen */
        var walk = on < 0 && cyc > 6; P.x = 650 + (walk ? Math.sin((cyc - 6) / 4 * Math.PI * 2) * 26 : 0); P.hop = walk ? Math.abs(Math.sin(t * 7)) * 4 : 0;
        P.talk = t < st.until || on >= 0; P.mood = P.talk ? 'happy' : 'calm';
        var tgt = on >= 0 && on < 3 ? PODS[on].x : null;
        P.hands = on === 3 ? [[-60, -212], [80, -420]] : tgt != null ? [[-60, -212], [clamp((tgt - P.x) * 2, -200, 200), -300]] : cyc < 3 ? [[-60, -230], [40, -250]] : [[-60, -212], [110, -380 + Math.sin(t * 2) * 10]];
        look(P, st, t, S, tgt != null ? clamp((tgt - P.x) / 160, -1, 1) : walk ? (Math.cos((cyc - 6) / 4 * Math.PI * 2) > 0 ? 0.7 : -0.7) : cyc < 3 ? -0.3 : 0.2);
        if (!CR.cast(P, st, t, ['tr_thumbs', 'tr_marshal'])) P.tilt = cyc < 3 ? 0.08 : 0;
        if (st.rx === 'tr_thumbs' && st._fx !== st.rxT) { st._fx = st.rxT; fx('badge', P.x, P.y - 300, t, { txt: 'Cleared!', life: 1.4, bg: '#F4F0F8', fg: PUR }); } } },
      trainee('fin', 'finance', FIN, ['tr_fist', 'tr_validate'], function (P, t, busy) { var cyc = (t + 2) % 7;
        P.hands = busy ? [[-60, -206], [70, -330 + Math.sin(t * 4) * 10]] : cyc > 6 ? [[-60, -206], [44, -368]] : [[-60 + Math.abs(Math.sin(t * 10)) * 6, -206], [60, -206 - Math.abs(Math.sin(t * 9 + 1)) * 6]]; P._tilt = cyc > 3 && cyc < 6 ? -0.08 : 0; return cyc > 3 && cyc < 6 ? -0.9 : 0.2; }),
      trainee('sal', 'sales', SAL, ['tr_confirm', 'tr_lift'], function (P, t, busy) { var cyc = (t + 4) % 9;
        P.hands = busy ? [[-60, -206], [70, -330 + Math.sin(t * 4) * 10]] : cyc > 6.5 ? [[-150, -470], [150, -470]] : [[-60, -206 - Math.abs(Math.sin(t * 8)) * 5], [60, -206 - Math.abs(Math.sin(t * 8 + 1.5)) * 5]]; P._tilt = cyc > 6.5 ? -0.1 : Math.sin(t * 4.2) * 0.05; return cyc > 6.5 ? 0 : 0.9; }),
      trainee('wh', 'warehouse', WH, ['tr_count', 'tr_scan'], function (P, t, busy) { var cyc = (t + 1) % 6.5;
        P.hands = busy ? [[-60, -206], [70, -330 + Math.sin(t * 4) * 10]] : cyc > 5 ? [[-40, -280], [40 + Math.sin(t * 8) * 10, -290]] : [[-70, -214], [-10, -236 + Math.sin(t * 3) * 6]]; P._tilt = 0; return cyc > 5 ? 0 : -0.5; })
    ],
    toy: function (name, S, t) {
      if (name === 'guide') { GD.t = t; fx('guide', T.ios.x + 70, T.ios.y - 12, t, { tx: PODS[2].x + 10, ty: PLAT - 150, life: 1.2 }); CR.burst('spark', T.ios.x + 70, T.ios.y - 20, t); }
      if (name === 'cert') { CT.t = t; CR.burst('star', T.cert.x + T.cert.w / 2, T.cert.y, t); }
    },
    hit: function (x, y, S, t) { if (Math.abs(x - BEN.x) < 56 && y < BEN.y + 6 && y > BEN.y - 230) { BNT.t = t; CR.burst('star', BEN.x, BEN.y - 240, t); return { say: 'Practising on a **copy** of our own data first. I came early to read the **guide**.', near: [-250, 60], pose: 'love', who: 'Trainee (client)' }; }
      var r = CR.hitWalker(x, y, t); if (r) { CREW.forEach(function (w) { var Wk = w._W; if (Wk && Wk.st && Wk.st.rx === 'tr_plane' && Wk.st._fx !== Wk.st.rxT) { Wk.st._fx = Wk.st.rxT; fx('plane', Wk.P.x, Wk.P.y - 230, t + 0.5, { life: 2.6 }); } }); } return r; },
    onStop: function () {}
  };
})(window.IXW && window.IXW.kit, window.CR, window.CO);
