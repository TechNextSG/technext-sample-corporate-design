/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: app-stock (/odoo/apps/inventory) — Odoo Inventory as a bright PORT-SIDE LOGISTICS HUB, run like an airport baggage
   hall: an outbound departures board with flip letters, an overhead crane that carries crates to their bin, an overhead
   conveyor of parcels, addressed racks (every bin has an address), the pick cart, the packing bench with its label printer,
   dock 1 with a beacon, a roller door and a truck, a forklift working the yard, and through the big window the port with a
   container ship and cranes. Wall screens for replenishment (reorder rules) and cycle counts. Cast (client team, grey
   passes): the warehouse lead, the picker with a scanner, the packer seated at the bench (chair, legs, feet) and the receiver
   at the dock who marshals the trucks in like ground crew. TechNext consultants (blue IDs) walk the floor with clipboards
   and scanners. Every person has an idle loop and a tap routine of their own. Sample figures only. */
(function (K, CR, CO) {
  'use strict';
  if (!K || !CR || !CO) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed;
  var F = 470, CEIL = -150, AMB = '#F2A33A', YEL = '#FFC93C', OK = '#1E9E6A', BLUE = '#3167CA', PUR = '#714B67', INK = '#1B1F3B', RED = '#E2453C', STEEL = '#5C6B7A';
  var RK = { x: 168, y: -92, w: 232 }, LEVELS = [-14, 86, 186, 286], RO = { x: 568, y: -86, w: 190, h: 100 }, CT = { x: 568, y: 24, w: 190, h: 100 }, BD = { x: 772, y: -72, w: 220, h: 112 },
    DK = { x: 842, y: 150, w: 158 }, CONV = { x0: 404, x1: 836, y: 168 }, BENCH = { x: 598, y: 402, w: 182 }, CART = { x: 504, y: 400 }, RAIL = -136,
    PORT = { x: -916, y: -100, w: 420, h: 330 }, YARD = { x: 1034, y: -100, w: 320, h: 330 };
  var OUT = [['WH/OUT/0042', 'DOCK 1', 'LOADING', OK], ['WH/OUT/0043', 'DOCK 2', 'PACKING', AMB], ['WH/OUT/0044', 'DOCK 1', 'PICKING', BLUE], ['WH/IN/0017', 'DOCK 1', 'ARRIVED', PUR]];
  function setU(g, sx, sy, k) { g.translate(sx, sy); g.scale(k, k); }
  function extOf(W, H, k, sx, sy) { return { l: -(sx + 24) / k, r: (W - sx) / k, t: -(sy + 24) / k, b: (H - sy) / k }; }
  function tick(g, x, y, r) { fillE(g, x, y, r, r, OK); g.strokeStyle = '#FFFFFF'; g.lineWidth = r * 0.3; g.beginPath(); g.moveTo(x - r * 0.45, y); g.lineTo(x - r * 0.1, y + r * 0.35); g.lineTo(x + r * 0.5, y - r * 0.35); g.stroke(); }
  function box(g, x, y, w, h, col) { fillRR(g, x, y, w, h, 2, col || '#C9A27A'); g.fillStyle = 'rgba(0,0,0,.08)'; g.fillRect(x + w / 2 - 2, y, 4, h); fillRR(g, x + 3, y + 3, w * 0.4, 4, 1, 'rgba(255,255,255,.6)'); }
  function container(g, x, y, w, h, col) { fillRR(g, x, y, w, h, 1.5, col); g.fillStyle = 'rgba(0,0,0,.12)'; for (var r = x + 4; r < x + w - 2; r += 5) g.fillRect(r, y + 2, 1.4, h - 4); g.fillStyle = 'rgba(255,255,255,.2)'; g.fillRect(x, y, w, 2); }
  function hazard(g, x, y, w, h) { g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); g.fillStyle = YEL; g.fillRect(x, y, w, h); g.fillStyle = INK; for (var s = x - h; s < x + w; s += 16) { g.beginPath(); g.moveTo(s, y + h); g.lineTo(s + 8, y + h); g.lineTo(s + 8 + h, y); g.lineTo(s + h, y); g.closePath(); g.fill(); } g.restore(); }
  function bin(i, j) { return { x: RK.x + 8 + j * 55, y: LEVELS[i] }; }
  function port(g, w, t) { /* the port: sky, sea, a container ship, the cranes and the stacks */
    var sg = g.createLinearGradient(0, w.y, 0, w.y + w.h); sg.addColorStop(0, '#79B8EE'); sg.addColorStop(0.62, '#DDF0FC'); sg.addColorStop(0.62, '#4E9BD0'); sg.addColorStop(1, '#8CC3E8'); g.fillStyle = sg; g.fillRect(w.x, w.y, w.w, w.h);
    var sea = w.y + w.h * 0.62, bob = Math.sin(t * 0.9) * 1.5, shx = w.x + 40 + ((t * 4) % 60);
    g.fillStyle = '#2A3550'; g.beginPath(); g.moveTo(shx, sea - 10 + bob); g.lineTo(shx + 250, sea - 10 + bob); g.lineTo(shx + 236, sea + 12 + bob); g.lineTo(shx + 12, sea + 12 + bob); g.closePath(); g.fill(); fillRR(g, shx + 6, sea - 16 + bob, 244, 6, 1, RED);
    for (var c = 0; c < 12; c++) container(g, shx + 18 + (c % 6) * 34, sea - 34 - Math.floor(c / 6) * 16 + bob, 32, 15, ['#E2453C', BLUE, AMB, OK, PUR, '#3FA9E0'][(c * 5) % 6]); fillRR(g, shx + 222, sea - 52 + bob, 22, 42, 2, '#FFFFFF'); fillRR(g, shx + 224, sea - 46 + bob, 18, 4, 1, '#9FD0F2');
    for (var q = 0; q < 3; q++) { var cx = w.x + 60 + q * 140; g.strokeStyle = q === 1 ? RED : '#3D7DD8'; g.lineWidth = 4; g.beginPath(); g.moveTo(cx, sea + 30); g.lineTo(cx, sea - 120); g.moveTo(cx + 40, sea + 30); g.lineTo(cx + 40, sea - 120); g.moveTo(cx - 30, sea - 110); g.lineTo(cx + 120, sea - 110); g.stroke();
      g.lineWidth = 1.5; g.beginPath(); g.moveTo(cx + 20, sea - 110); g.lineTo(cx + 20, sea - 150); g.lineTo(cx + 120, sea - 110); g.stroke(); var tx = cx + 50 + Math.sin(t * 0.4 + q) * 30; fillRR(g, tx - 8, sea - 114, 16, 8, 2, YEL); g.strokeStyle = '#2A3550'; g.lineWidth = 1; g.beginPath(); g.moveTo(tx, sea - 106); g.lineTo(tx, sea - 70 + Math.sin(t * 0.6 + q) * 14); g.stroke(); }
    g.fillStyle = '#C9D0DB'; g.fillRect(w.x, sea + 22, w.w, w.h); for (var s = 0; s < 14; s++) container(g, w.x + 6 + (s % 7) * 58, sea + 30 + Math.floor(s / 7) * 20, 54, 18, ['#E2453C', BLUE, AMB, OK, PUR, '#3FA9E0', '#9AA6BC'][(s * 3) % 7]);
  }

  function paintBg(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    var wg = g.createLinearGradient(0, CEIL, 0, F); wg.addColorStop(0, '#F2F5F9'); wg.addColorStop(1, '#E4E9F0'); g.fillStyle = wg; g.fillRect(e.l, CEIL, e.r - e.l, F - CEIL);
    g.fillStyle = 'rgba(40,60,90,.05)'; for (var x = Math.floor(e.l / 14) * 14; x < e.r; x += 14) g.fillRect(x, CEIL, 5, F - CEIL);
    port(g, PORT, 0); port(g, YARD, 3);
    fillRR(g, e.l, 300, e.r - e.l, F - 300, 0, '#D5DCE6'); hazard(g, e.l, 296, e.r - e.l, 8);
    /* the roof: steel trusses */
    var cg = g.createLinearGradient(0, e.t, 0, CEIL); cg.addColorStop(0, '#E1E6EE'); cg.addColorStop(1, '#EEF1F6'); g.fillStyle = cg; g.fillRect(e.l, e.t, e.r - e.l, CEIL - e.t);
    g.strokeStyle = 'rgba(92,107,122,.35)'; g.lineWidth = 2; g.beginPath(); for (var tx = Math.floor(e.l / 60) * 60; tx < e.r; tx += 60) { g.moveTo(tx, CEIL); g.lineTo(tx + 30, e.t); g.lineTo(tx + 60, CEIL); } g.moveTo(e.l, CEIL - 2); g.lineTo(e.r, CEIL - 2); g.stroke();
    /* the floor: polished concrete, a yellow walkway and lane arrows */
    var fl = g.createLinearGradient(0, F, 0, e.b); fl.addColorStop(0, '#DFE4EB'); fl.addColorStop(1, '#C8D0DB'); g.fillStyle = fl; g.fillRect(e.l, F, e.r - e.l, e.b - F);
    g.fillStyle = 'rgba(255,255,255,.35)'; for (var p = 0; p < 40; p++) { var px = e.l + hash(p) * (e.r - e.l), py = F + 20 + hash(p + 7) * (e.b - F - 30); K.ell(g, px, py, 30 + hash(p + 3) * 50, 3, 0); g.fill(); }
    g.fillStyle = YEL; g.fillRect(e.l, F + 26, e.r - e.l, 5); g.fillRect(e.l, F + 96, e.r - e.l, 5);
    g.fillStyle = 'rgba(255,201,60,.8)'; for (var a = Math.floor(e.l / 200) * 200; a < e.r; a += 200) { g.beginPath(); g.moveTo(a, F + 58); g.lineTo(a + 40, F + 58); g.lineTo(a + 40, F + 50); g.lineTo(a + 60, F + 64); g.lineTo(a + 40, F + 78); g.lineTo(a + 40, F + 70); g.lineTo(a, F + 70); g.closePath(); g.fill(); }
    g.fillStyle = 'rgba(40,60,90,.10)'; g.fillRect(e.l, F, e.r - e.l, 6);
    g.restore();
  }
  function paintWindow(g, t) { [PORT, YARD].forEach(function (w, i) { g.save(); g.beginPath(); g.rect(w.x, w.y, w.w, w.h); g.clip(); port(g, w, t + i * 7); g.restore(); }); }
  function paintBack(g, ext) {
    /* window frames (a grid of glazing bars) */
    [PORT, YARD].forEach(function (w) { g.strokeStyle = '#E9EDF3'; g.lineWidth = 10; g.strokeRect(w.x, w.y, w.w, w.h); g.fillStyle = '#E9EDF3'; for (var m = w.x + 84; m < w.x + w.w - 10; m += 84) g.fillRect(m - 3, w.y, 6, w.h); g.fillRect(w.x, w.y + 110, w.w, 5); g.fillRect(w.x, w.y + 220, w.w, 5);
      g.fillStyle = 'rgba(255,255,255,.22)'; g.beginPath(); g.moveTo(w.x + 20, w.y + w.h); g.lineTo(w.x + 90, w.y); g.lineTo(w.x + 120, w.y); g.lineTo(w.x + 50, w.y + w.h); g.closePath(); g.fill(); });
    /* the crane rail */
    fillRR(g, ext.l, RAIL - 6, ext.r - ext.l, 14, 2, YEL); g.fillStyle = 'rgba(27,31,59,.25)'; g.fillRect(ext.l, RAIL + 6, ext.r - ext.l, 2); for (var b = Math.floor(ext.l / 120) * 120; b < ext.r; b += 120) { fillRR(g, b, RAIL - 14, 10, 8, 1, STEEL); }
    /* the racks: four levels, four bins each, every bin with its address */
    soft(g, RK.x + RK.w / 2, F + 4, 150, 10, 0.3); [RK.x, RK.x + RK.w - 10].forEach(function (x) { fillRR(g, x, RK.y, 10, F - RK.y, 3, BLUE); for (var h = RK.y + 10; h < F; h += 18) fillE(g, x + 5, h, 1.6, 1.6, 'rgba(255,255,255,.6)'); });
    LEVELS.forEach(function (ly, i) { fillRR(g, RK.x, ly, RK.w, 8, 2, AMB); for (var j = 0; j < 4; j++) { var bn = bin(i, j); if (!(i === 1 && j === 2)) { var bh = 44 + (hash(i * 4 + j) * 20) | 0; box(g, bn.x + 4, ly - bh, 44, bh, ['#C9A27A', '#D9B88E', '#B8916A'][(i + j) % 3]); if (hash(i + j * 3) > 0.5) fillRR(g, bn.x + 20, ly - bh + 8, 16, 10, 1, '#FFFFFF'); }
      fillRR(g, bn.x + 4, ly + 10, 46, 12, 2, '#FFFFFF'); text(g, 'WH/A-' + (i + 1) + '0' + (j + 1), bn.x + 27, ly + 18.8, 5.6, 800, INK, 'center'); } });
    /* the wall screens: replenishment and counts */
    [RO, CT].forEach(function (s, k) { shadowed(g, 12, 4, 0.2, function () { fillRR(g, s.x - 5, s.y - 5, s.w + 10, s.h + 10, 7, '#2A3142'); }); fillRR(g, s.x, s.y, s.w, s.h, 3, '#FFFFFF');
      fillRR(g, s.x, s.y, s.w, 16, 3, k ? BLUE : PUR); g.fillRect(s.x, s.y + 9, s.w, 7); text(g, k ? 'Cycle count · sample' : 'Replenishment · reorder rules', s.x + 8, s.y + 11.5, 6.6, 800, '#FFFFFF'); });
    /* the departures board */
    shadowed(g, 12, 4, 0.2, function () { fillRR(g, BD.x - 5, BD.y - 5, BD.w + 10, BD.h + 10, 7, '#2A3142'); }); fillRR(g, BD.x, BD.y, BD.w, BD.h, 3, '#1B2236'); fillRR(g, BD.x, BD.y, BD.w, 18, 3, YEL);
    text(g, '✈  OUTBOUND · DEPARTURES', BD.x + 8, BD.y + 12.6, 7.4, 800, INK); text(g, 'ORDER', BD.x + 8, BD.y + 28, 5.6, 800, '#8A96A8'); text(g, 'GATE', BD.x + 98, BD.y + 28, 5.6, 800, '#8A96A8'); text(g, 'STATUS', BD.x + 150, BD.y + 28, 5.6, 800, '#8A96A8');
    /* the overhead conveyor and its legs */
    [430, 620, 812].forEach(function (x) { fillRR(g, x - 3, CONV.y + 14, 6, F - CONV.y - 14, 2, '#9AA6BC'); fillRR(g, x - 12, F - 6, 24, 6, 2, STEEL); });
    fillRR(g, CONV.x0, CONV.y, CONV.x1 - CONV.x0, 16, 6, STEEL); fillRR(g, CONV.x0, CONV.y + 2, CONV.x1 - CONV.x0, 5, 3, '#2A3142'); fillRR(g, CONV.x0 - 4, CONV.y + 12, CONV.x1 - CONV.x0 + 8, 4, 2, YEL);
    g.fillStyle = '#9AA6BC'; g.beginPath(); g.moveTo(CONV.x1 - 6, CONV.y + 14); g.lineTo(CONV.x1 + 8, CONV.y + 14); g.lineTo(BENCH.x + 150, BENCH.y - 70); g.lineTo(BENCH.x + 132, BENCH.y - 70); g.closePath(); g.fill();
    /* dock 1: sign, beacon, the roller door and the truck's back */
    var d = DK; fillRR(g, d.x - 8, d.y - 10, d.w + 16, F - d.y + 10, 4, STEEL); fillRR(g, d.x, d.y, d.w, F - d.y, 2, '#2A3142');
    fillRR(g, d.x + 10, d.y + 66, d.w - 20, F - d.y - 66, 2, '#3D4560'); for (var bx2 = 0; bx2 < 3; bx2++) box(g, d.x + 20 + bx2 * 42, d.y + 110 - (bx2 % 2) * 30, 38, 46 + (bx2 % 2) * 30);
    fillRR(g, d.x, d.y, d.w, 64, 2, '#C9D2DE'); for (var r = 0; r < 6; r++) { g.fillStyle = 'rgba(40,60,90,.16)'; g.fillRect(d.x, d.y + 6 + r * 10, d.w, 2); } hazard(g, d.x, d.y + 58, d.w, 8);
    fillRR(g, d.x + 20, 104, d.w - 40, 30, 5, YEL); text(g, 'DOCK 1 · RECEIVING', d.x + d.w / 2, 123, 8.4, 800, INK, 'center');
    fillRR(g, d.x - 22, 170, 14, 40, 4, INK); hazard(g, d.x - 8, F - 60, 8, 60); hazard(g, d.x + d.w, F - 60, 8, 60);
    /* the packing bench */
    var bn2 = BENCH; CO.desk(g, bn2.x, bn2.y, bn2.w, F, { open: true, legs: '#9AA6BC', top: '#C9A27A' });
    /* pallets and a fire point on the left wall */
    fillRR(g, -470, 250, 30, 40, 4, RED); fillRR(g, -464, 240, 18, 12, 3, INK);
    for (var pl = 0; pl < 5; pl++) fillRR(g, -440, F - 10 - pl * 12, 90, 9, 2, '#B8916A');
    leftWall(g);
  }
  /* the wall behind the title card ("View the scene" shows it): dock 2 for dispatch with its roller door, the PPE board, a
     wall clock, and a pick-to-light bin wall where the stock clerk picks */
  var D2 = { x: -344, y: 46, w: 190 }, PTL = { x: -112, y: 70, c: 6, r: 5, w: 33, h: 44 };
  function ptlBin(i) { return { x: PTL.x + (i % PTL.c) * PTL.w, y: PTL.y + Math.floor(i / PTL.c) * PTL.h }; }
  function leftWall(g) {
    var d = D2; fillRR(g, d.x - 10, d.y - 12, d.w + 20, F - d.y + 12, 4, STEEL); fillRR(g, d.x, d.y, d.w, F - d.y, 2, '#2A3142');
    fillRR(g, d.x + 10, d.y + 120, d.w - 20, F - d.y - 120, 2, '#3D4560'); box(g, d.x + 22, F - 70, 44, 70); box(g, d.x + 70, F - 52, 40, 52, '#D9B88E'); box(g, d.x + 116, F - 84, 50, 84, '#B8916A');
    fillRR(g, d.x + 28, d.y - 46, d.w - 56, 28, 5, YEL); text(g, 'DOCK 2 · DISPATCH', d.x + d.w / 2, d.y - 27.5, 8.6, 800, INK, 'center');
    hazard(g, d.x - 10, F - 64, 10, 64); hazard(g, d.x + d.w, F - 64, 10, 64); fillRR(g, d.x + d.w + 16, 210, 26, 40, 4, '#C9D2DE'); fillE(g, d.x + d.w + 29, 222, 5, 5, OK); fillE(g, d.x + d.w + 29, 238, 5, 5, RED);
    /* the PPE board and a clock over the pallets */
    fillRR(g, -470, -60, 104, 104, 8, '#FFFFFF'); fillRR(g, -470, -60, 104, 22, 8, BLUE); g.fillRect(-470, -46, 104, 8); text(g, 'PPE ZONE', -418, -44, 8.6, 800, '#FFFFFF', 'center');
    [['hat', -448], ['vest', -418], ['boot', -388]].forEach(function (q) { var cx = q[1], cy = -8; fillE(g, cx, cy, 13, 13, BLUE); g.fillStyle = '#FFFFFF';
      if (q[0] === 'hat') { g.beginPath(); g.arc(cx, cy + 3, 8, Math.PI, 0); g.fill(); g.fillRect(cx - 10, cy + 2, 20, 3); }
      else if (q[0] === 'vest') { g.beginPath(); g.moveTo(cx - 7, cy - 7); g.lineTo(cx - 2, cy - 7); g.lineTo(cx, cy - 2); g.lineTo(cx + 2, cy - 7); g.lineTo(cx + 7, cy - 7); g.lineTo(cx + 7, cy + 8); g.lineTo(cx - 7, cy + 8); g.closePath(); g.fill(); }
      else { g.fillRect(cx - 5, cy - 8, 6, 12); fillRR(g, cx - 5, cy + 2, 13, 6, 2, '#FFFFFF'); } });
    text(g, 'hard hat · vest · boots', -418, 26, 6, 700, '#3D4560', 'center');
    K.clockFace(g, { x: -418, y: 110, r: 24 }, STEEL); text(g, 'SINGAPORE', -418, 146, 6, 800, '#3D4560', 'center');
    /* the pick-to-light wall: bins with addresses, a light module under each */
    var p = PTL; fillRR(g, p.x - 10, p.y - 34, p.c * p.w + 20, p.r * p.h + 44, 6, BLUE); fillRR(g, p.x - 4, p.y - 4, p.c * p.w + 8, p.r * p.h + 8, 4, '#E9EEF5');
    text(g, 'PICK FACE · ZONE A', p.x + p.c * p.w / 2, p.y - 15, 8, 800, '#FFFFFF', 'center');
    for (var i = 0; i < p.c * p.r; i++) { var b = ptlBin(i), col = ['#3FA9E0', YEL, RED, OK][(i + Math.floor(i / p.c)) % 4];
      fillRR(g, b.x + 3, b.y + 6, p.w - 6, 22, 3, col); fillRR(g, b.x + 3, b.y + 6, p.w - 6, 6, 2, 'rgba(255,255,255,.35)'); fillRR(g, b.x + 8, b.y + 14, p.w - 16, 8, 1.5, '#FFFFFF');
      text(g, 'A' + (Math.floor(i / p.c) + 1) + '-0' + (i % p.c + 1), b.x + p.w / 2, b.y + 20.4, 4.6, 800, INK, 'center'); fillRR(g, b.x + 6, b.y + 31, p.w - 12, 8, 2, '#2A3142'); }
    /* the clerk's tote trolley */
    var tx = 66; soft(g, tx + 30, F + 3, 40, 6, 0.3); g.strokeStyle = STEEL; g.lineWidth = 3; g.beginPath(); g.moveTo(tx + 60, F - 92); g.lineTo(tx + 60, F - 10); g.stroke(); fillRR(g, tx, F - 52, 64, 6, 2, STEEL); fillRR(g, tx, F - 14, 64, 6, 2, STEEL);
    fillRR(g, tx + 4, F - 46, 52, 32, 3, BLUE); fillRR(g, tx + 4, F - 84, 52, 32, 3, YEL); fillE(g, tx + 8, F - 4, 5, 5, INK); fillE(g, tx + 56, F - 4, 5, 5, INK);
  }
  function paintFront(g, ext) {
    /* the pick cart */
    var c = CART; soft(g, c.x + 34, F + 4, 44, 6, 0.3); g.strokeStyle = STEEL; g.lineWidth = 4; g.beginPath(); g.moveTo(c.x, c.y - 36); g.lineTo(c.x, F - 10); g.lineTo(c.x + 70, F - 10); g.stroke();
    fillRR(g, c.x, F - 14, 72, 6, 3, STEEL); fillE(g, c.x + 8, F - 4, 5, 5, INK); fillE(g, c.x + 64, F - 4, 5, 5, INK); fillRR(g, c.x, c.y + 18, 72, 5, 2, STEEL); fillRR(g, c.x - 6, c.y - 40, 14, 6, 3, BLUE);
    /* the label printer and the tape on the bench */
    var bn = BENCH; fillRR(g, bn.x + 120, bn.y - 26, 44, 26, 4, '#2A3142'); fillRR(g, bn.x + 124, bn.y - 22, 20, 6, 1.5, '#9FE3C8'); fillE(g, bn.x + 18, bn.y - 6, 9, 6, '#B8916A'); fillE(g, bn.x + 18, bn.y - 6, 4, 3, '#EEF2F7');
  }
  function paintFore(g, ext) {
    /* the foreground: bollards, wrapped pallets, a pallet jack, cones */
    [[-372, 540], [-126, 540], [1110, 674], [1220, 674]].forEach(function (q) { var x = q[0], by = q[1]; soft(g, x, by + 2, 22, 4, 0.3); fillRR(g, x - 9, by - 64, 18, 64, 6, YEL); g.fillStyle = INK; g.fillRect(x - 9, by - 48, 18, 6); g.fillRect(x - 9, by - 28, 18, 6); });
    /* the floor band below the card: a hatched keep-clear lane with stencilled zone marks */
    g.save(); g.beginPath(); g.rect(ext.l - 20, 646, ext.r - ext.l + 40, 50); g.clip(); g.fillStyle = 'rgba(255,201,60,.22)'; g.fillRect(ext.l - 20, 646, ext.r - ext.l + 40, 50); g.fillStyle = 'rgba(255,201,60,.55)';
    for (var hz = Math.floor(ext.l / 28) * 28 - 60; hz < ext.r + 40; hz += 28) { g.beginPath(); g.moveTo(hz, 696); g.lineTo(hz + 12, 696); g.lineTo(hz + 62, 646); g.lineTo(hz + 50, 646); g.closePath(); g.fill(); } g.restore();
    g.fillStyle = YEL; g.fillRect(ext.l - 20, 644, ext.r - ext.l + 40, 4); g.fillRect(ext.l - 20, 694, ext.r - ext.l + 40, 4);
    [[380, 'ZONE A · PICK FACE'], [800, 'KEEP CLEAR']].forEach(function (z) { fillRR(g, z[0] - 84, 656, 168, 30, 4, 'rgba(228,233,240,.92)'); text(g, z[1], z[0], 676, 11, 800, '#2A3550', 'center'); });
    [[-660, 548], [1090, 690]].forEach(function (p) { soft(g, p[0] + 50, p[1] + 4, 66, 7, 0.3); fillRR(g, p[0], p[1] - 10, 100, 10, 2, '#A07A52'); for (var b = 0; b < 6; b++) box(g, p[0] + 2 + (b % 3) * 33, p[1] - 44 - Math.floor(b / 3) * 34, 31, 33, ['#C9A27A', '#D9B88E', '#B8916A'][b % 3]);
      g.fillStyle = 'rgba(220,235,250,.35)'; g.fillRect(p[0], p[1] - 80, 100, 70); g.strokeStyle = 'rgba(255,255,255,.6)'; g.lineWidth = 1; for (var s = 0; s < 6; s++) { g.beginPath(); g.moveTo(p[0], p[1] - 76 + s * 12); g.lineTo(p[0] + 100, p[1] - 70 + s * 12); g.stroke(); } });
    [[184, 712], [-560, 700]].forEach(function (c) { soft(g, c[0], c[1] + 2, 20, 4, 0.3); g.fillStyle = AMB; g.beginPath(); g.moveTo(c[0] - 14, c[1]); g.lineTo(c[0] - 4, c[1] - 40); g.lineTo(c[0] + 4, c[1] - 40); g.lineTo(c[0] + 14, c[1]); g.closePath(); g.fill(); fillRR(g, c[0] - 18, c[1] - 4, 36, 6, 2, AMB); g.fillStyle = '#FFFFFF'; g.fillRect(c[0] - 8, c[1] - 26, 16, 6); });
  }

  var W = CR.who;
  var LEAD = W({ x: 236, y: 470, s: 0.54, ph: 2.6, skin: 1, hair: 0, style: 'short', outfit: 'shirt', top: OK, id: '#9AA6BC', hold: 'clipboard', hands: [[-60, -212], [70, -170]], look: 0.6 });
  var PICK = W({ x: 455, y: 470, s: 0.54, ph: 0.6, skin: 2, hair: 0, style: 'short', outfit: 'polo', top: AMB, id: '#9AA6BC', hold: 'tablet', hands: [[-60, -212], [70, -230]], look: -0.6 });
  var PACK = W({ x: 690, y: 470, s: 0.5, ph: 1.8, skin: 0, hair: 1, style: 'pony', outfit: 'shirt', top: BLUE, sit: true, chairCol: '#2A3550', id: '#9AA6BC', hands: [[-60, -206], [60, -206]], look: -0.3 });
  var RCV = W({ x: 936, y: 470, s: 0.54, ph: 3.6, skin: 3, hair: 1, style: 'short', outfit: 'polo', top: PUR, id: '#9AA6BC', hold: 'tablet', hands: [[-60, -212], [70, -170]], look: -0.4 });
  RCV.vest = YEL;
  var CLK = W({ x: -6, y: 470, s: 0.54, ph: 2.1, skin: 2, hair: 0, style: 'bob', outfit: 'polo', top: '#3FA9E0', id: '#9AA6BC', hands: [[-60, -212], [70, -212]], look: -0.4 });
  CLK.vest = YEL;
  var CREW = [
    { x0: -900, x1: -480, y: 488, spd: 14, ph: 0.3, label: 'TechNext consultant', lines: ['Locations, routes and reorder rules set up **first**.', 'Opening stock counted and **loaded** before go-live.'], acts: ['nod', 'id', 'wave'],
      P: W({ s: 0.5, skin: 3, hair: 1, style: 'long', outfit: 'polo', top: '#3167CA', hold: 'clipboard' }) },
    { front: true, x0: -440, x1: 120, y: 690, spd: 18, ph: 0.6, label: 'TechNext consultant', lines: ['Barcode scanners configured for **your** labels.', 'The warehouse trained on **receipts and picking**.'], acts: ['cheer', 'id', 'wave'],
      P: W({ s: 0.58, skin: 0, hair: 0, style: 'short', outfit: 'shirt', top: PUR, hold: 'tablet', hands: [[-60, -212], [70, -150]] }) }
  ];
  /* the forklift in the yard: its driver sits on a seat drawn here (no office chair) */
  var DRV = W({ x: 0, y: 0, s: 0.46, ph: 1.1, skin: 1, hair: 0, style: 'short', outfit: 'polo', top: '#2E9C7E', sit: true, chair: false, id: '#9AA6BC', hands: [[-40, -230], [60, -230]] });
  DRV.hat = 'hardhat';

  CREW[1].peek = true; /* the near walker strolls in front of the title card only while the scene is in view */
  var HERO = null; function peekOn() { if (!HERO) HERO = document.querySelector('.ixw-hero'); return !!(HERO && HERO.classList.contains('is-peek')); }
  function crewVis() { var pk = peekOn(); return CREW.filter(function (w) { return !w.peek || pk; }); }
  var FX = { ptl: -9, honk: -9, scan: -9, label: -9, whistle: -9, marshal: -9, crane: -9, cart: 1, fork: -9 };
  function tapU(st, t, dur) { if (st.wave && st.wave !== st._tw) { st._tw = st.wave; st.tapT = t; } var u = (t - (st.tapT == null ? -99 : st.tapT)) / dur; return u >= 0 && u < 1 ? u : -1; }
  function look(P, st, t, S, rest) { P.look = lerp(P.look, t < st.until ? clamp((S.nexi.x - P.x) / 160, -1, 1) : rest, 0.08); }
  function handAt(P, i) { var h = P.hands[i], sxk = P.sx == null ? 1 : P.sx; return [P.x + h[0] * P.s * sxk, P.y + (h[1] - (P.hop || 0) + (P.sit ? 46 : 0)) * P.s]; }
  function reset(P) { P.sx = 1; P.hop = 0; P.tilt = 0; }
  function pill(g, x, y, w, s, bg, fg, a) { g.save(); g.globalAlpha = a; fillRR(g, x - w / 2, y, w, 18, 9, bg); text(g, s, x, y + 12.5, 7.6, 800, fg, 'center'); g.restore(); }
  function forkX(t) { var u = (t * 0.045) % 2, k = u < 1 ? u : 2 - u; return lerp(1060, 1300, (1 - Math.cos(k * Math.PI)) / 2); }

  function paintLive(g, t, now, S) {
    CO.crew(CREW, g, t, S, false);
    /* the overhead crane: its trolley shuttles a crate between the dock and the racks (on the lead's whistle, straight to the empty bin) */
    var wu = t - FX.crane, cyc = (t * 0.07) % 1, tx, drop = 0, carry = true;
    if (wu < 4) { var q = wu / 4, target = bin(1, 2); tx = q < 0.4 ? lerp(1060, target.x + 27, q / 0.4) : target.x + 27; drop = q < 0.4 ? 0 : Math.sin((q - 0.4) / 0.6 * Math.PI) * 2.7; carry = q < 0.7; }
    else { var kq = cyc < 0.5 ? cyc * 2 : 2 - cyc * 2, ease = (1 - Math.cos(kq * Math.PI)) / 2; tx = lerp(RK.x + 120, 1060, ease); carry = cyc < 0.5; drop = (ease < 0.03 || ease > 0.97) ? 0.4 : 0; }
    fillRR(g, tx - 20, RAIL - 10, 40, 16, 3, STEEL); fillE(g, tx - 12, RAIL + 6, 4, 4, INK); fillE(g, tx + 12, RAIL + 6, 4, 4, INK); var hy = RAIL + 10 + drop * 60;
    g.strokeStyle = '#2A3142'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(tx - 3, RAIL + 6); g.lineTo(tx - 3, hy); g.moveTo(tx + 3, RAIL + 6); g.lineTo(tx + 3, hy); g.stroke(); fillRR(g, tx - 10, hy, 20, 7, 2, YEL);
    if (carry) { box(g, tx - 20, hy + 7, 40, 30, '#D9B88E'); fillRR(g, tx - 8, hy + 14, 16, 9, 1, '#FFFFFF'); }
    if (wu < 4.8 && wu > 2.8) { var tb = bin(1, 2); box(g, tb.x + 4, LEVELS[1] - 44, 44, 44, '#D9B88E'); }
    /* pick-to-light: the lit bin glows green (it goes off when confirmed); a tap lights them all in a wave; the dock 2 door rolls up and down */
    var lb = litBin(t), lc = (t + 1) % 9, wv = t - FX.ptl; for (var pi = 0; pi < PTL.c * PTL.r; pi++) { var pb = ptlBin(pi), on = wv < 2.4 ? Math.sin(wv * 8 - (pi % PTL.c) * 0.9 - Math.floor(pi / PTL.c) * 0.5) > 0.2 : (pi === lb && lc < 4.05);
      fillRR(g, pb.x + 8, pb.y + 32.5, PTL.w - 16, 5, 1.5, on ? '#3BE38F' : (pi === lb && lc < 5.2 ? '#9AA6BC' : '#4A5468')); if (on) fillE(g, pb.x + PTL.w / 2, pb.y + 35, 10, 5, 'rgba(59,227,143,.25)'); }
    var dr = (t * 0.07) % 1, dopen = dr < 0.15 ? dr / 0.15 : dr < 0.5 ? 1 : dr < 0.65 ? 1 - (dr - 0.5) / 0.15 : 0, dh = (F - D2.y - 2) * (1 - dopen * 0.62);
    fillRR(g, D2.x, D2.y, D2.w, dh, 2, '#C9D2DE'); g.fillStyle = 'rgba(40,60,90,.16)'; for (var sl = D2.y + 8; sl < D2.y + dh - 2; sl += 10) g.fillRect(D2.x, sl, D2.w, 2); hazard(g, D2.x, D2.y + dh - 8, D2.w, 8);
    fillRR(g, D2.x + D2.w / 2 - 12, D2.y + dh - 18, 24, 6, 2, STEEL);
    var kd = new Date(Date.now() + 8 * 3600e3); K.clockHands(g, { x: -418, y: 110, r: 24 }, kd.getUTCHours(), kd.getUTCMinutes(), kd.getUTCSeconds());
    /* the departures board: rows flip in turn */
    var fl = Math.floor(t * 0.7) % OUT.length; OUT.forEach(function (r, i) { var y = BD.y + 36 + i * 19, fp = i === fl ? ((t * 0.7) % 1) : 1, sc = fp < 0.25 ? Math.abs(Math.cos(fp * 4 * Math.PI)) : 1;
      g.save(); g.translate(0, y + 6); g.scale(1, sc); text(g, r[0], BD.x + 8, 3, 7, 800, '#FFFFFF'); text(g, r[1], BD.x + 98, 3, 7, 800, YEL); fillRR(g, BD.x + 148, -6, 64, 12, 3, r[3]); text(g, r[2], BD.x + 180, 3, 6.4, 800, '#FFFFFF', 'center'); g.restore(); });
    /* parcels ride the overhead conveyor towards the packing chute */
    for (var p = 0; p < 6; p++) { var px = CONV.x0 + ((t * 26 + p * 76) % (CONV.x1 - CONV.x0)); box(g, px - 13, CONV.y - 22, 26, 22, ['#C9A27A', '#D9B88E', '#B8916A'][p % 3]); if (p % 2) fillRR(g, px - 6, CONV.y - 16, 12, 7, 1, '#FFFFFF'); }
    for (var rl = CONV.x0 + 8; rl < CONV.x1; rl += 16) fillE(g, rl + ((t * 26) % 16), CONV.y + 4.5, 2.4, 2.4, '#9AA6BC');
    /* the bins: on Locations each address lights in turn; on Picking the route's bins light in order */
    var pk = S.hot === 'picking', lo = S.hot === 'putaway', route = [[3, 0], [2, 1], [2, 3], [1, 0]], ri = Math.floor((t - (S.kT || 0)) * 1.2) % 4;
    if (lo) { var li = Math.floor(t * 3) % 16, b = bin(Math.floor(li / 4), li % 4); g.strokeStyle = AMB; g.lineWidth = 2.5; rr(g, b.x + 2, b.y + 8, 50, 16, 4); g.stroke(); }
    if (pk) route.forEach(function (r, k) { var b = bin(r[0], r[1]); g.strokeStyle = k <= ri ? OK : 'rgba(30,158,106,.35)'; g.lineWidth = 2.5; rr(g, b.x + 2, b.y - 66, 52, 66, 5); g.stroke(); fillE(g, b.x + 46, b.y - 60, 7, 7, k <= ri ? OK : '#C9D2DE'); text(g, String(k + 1), b.x + 46, b.y - 57, 7.4, 800, '#FFFFFF', 'center'); });
    /* the scanner's beam */
    if (PICK._beam) { var hp = handAt(PICK, 1), tg = PICK._beam; g.strokeStyle = 'rgba(226,69,60,' + (0.45 + 0.4 * Math.sin(t * 24)).toFixed(2) + ')'; g.lineWidth = 2; g.beginPath(); g.moveTo(hp[0] + 6, hp[1] - 8); g.lineTo(tg[0], tg[1]); g.stroke(); fillE(g, tg[0], tg[1], 3, 3, 'rgba(226,69,60,.6)'); }
    /* replenishment: min/max bars, a purchase raised when one dips */
    var rp = S.hot === 'reorder'; [['Scanner', 0.25], ['Labels', 0.7], ['Cases', 0.45]].forEach(function (r, i) { var y = RO.y + 26 + i * 24, lvl = rp ? clamp(r[1] - (i === 0 ? ((t - (S.kT || 0)) * 0.1) % 0.3 : 0), 0.05, 1) : clamp(r[1] + Math.sin(t * 0.4 + i) * 0.08, 0.05, 1);
      text(g, r[0], RO.x + 8, y + 7, 6.6, 700, '#3D4560'); fillRR(g, RO.x + 54, y, 96, 9, 4, '#EEF2F7'); fillRR(g, RO.x + 54, y, 96 * lvl, 9, 4, lvl < 0.3 ? RED : OK); g.fillStyle = INK; g.fillRect(RO.x + 54 + 96 * 0.3, y - 2, 1.5, 13);
      if (lvl < 0.3) { fillRR(g, RO.x + 156, y - 2, 26, 13, 4, PUR); text(g, 'PO', RO.x + 169, y + 7.4, 6.4, 800, '#FFFFFF', 'center'); } });
    /* cycle count: counted vs on hand, the difference logged */
    var cc = S.hot === 'count' ? Math.floor((t - (S.kT || 0)) * 1.3) : 3; [['WH/A-101', '24', '24'], ['WH/A-203', '11', '12'], ['WH/A-304', '40', '40']].forEach(function (r, i) { var y = CT.y + 24 + i * 24, on = i < cc;
      text(g, r[0], CT.x + 8, y + 8, 6.6, 800, '#3D4560'); text(g, 'on hand ' + r[1], CT.x + 70, y + 8, 6.2, 700, '#8A96A8'); if (on) { var diff = r[1] !== r[2]; text(g, 'counted ' + r[2], CT.x + 124, y + 8, 6.2, 800, diff ? '#B7791F' : OK); if (!diff) tick(g, CT.x + CT.w - 10, y + 5, 4); } });
    /* the dock: the beacon turns, a pallet rolls in and is checked against the PO */
    var bx = DK.x - 15, by = 166, ba = t * 5; fillRR(g, bx - 6, by - 2, 12, 8, 2, INK); fillE(g, bx, by - 6, 7, 7, '#FFB020'); g.fillStyle = 'rgba(255,176,32,.35)'; g.beginPath(); g.moveTo(bx, by - 6); g.lineTo(bx + Math.cos(ba) * 40, by - 6 + Math.sin(ba) * 12 - 8); g.lineTo(bx + Math.cos(ba + 0.4) * 40, by - 6 + Math.sin(ba + 0.4) * 12 + 8); g.closePath(); g.fill();
    var rc = S.hot === 'receive' ? ((t - (S.kT || 0)) * 0.5) % 1.4 : ((t * 0.12) % 1.4), ppx = lerp(DK.x + 80, DK.x - 6, clamp(rc, 0, 1));
    fillRR(g, ppx - 30, F - 10, 64, 8, 2, '#A07A52'); box(g, ppx - 26, F - 52, 28, 42); box(g, ppx + 4, F - 52, 28, 42, '#D9B88E'); box(g, ppx - 12, F - 80, 32, 28, '#B8916A');
    if (rc > 1) { fillRR(g, ppx - 42, F - 112, 88, 22, 7, OK); text(g, 'PO00123 ✓', ppx + 2, F - 97, 8, 800, '#FFFFFF', 'center'); }
    var ht = t - FX.honk; if (ht < 1.6) { g.save(); g.globalAlpha = clamp((1.6 - ht) * 2, 0, 1); fillRR(g, DK.x + 24, DK.y + 4 - ht * 10, 110, 24, 8, AMB); text(g, 'Beep beep!', DK.x + 79, DK.y + 20 - ht * 10, 9, 800, INK, 'center'); g.restore(); }
    /* the forklift in the yard, its forks lifting a pallet */
    var fx = forkX(t), fu = t - FX.fork, lift = fu < 2 ? Math.sin(fu / 2 * Math.PI) * 40 : 10 + Math.sin(t * 0.6) * 6, dir = Math.sin(t * 0.045 * Math.PI) > 0 ? 1 : -1;
    g.save(); g.translate(fx, F); soft(g, 0, 4, 90, 9, 0.3);
    fillRR(g, -70, -200, 8, 200, 2, '#3D4560'); fillRR(g, -60, -200, 8, 200, 2, '#3D4560'); fillRR(g, -98, -26 - lift, 40, 6, 1, '#3D4560'); fillRR(g, -104, -40 - lift, 52, 8, 1, '#A07A52'); box(g, -102, -82 - lift, 48, 42, '#D9B88E'); fillRR(g, -92, -72 - lift, 20, 12, 1, '#FFFFFF');
    g.strokeStyle = '#2A3142'; g.lineWidth = 4; g.beginPath(); g.moveTo(-34, -70); g.lineTo(-34, -208); g.lineTo(58, -208); g.lineTo(58, -70); g.stroke(); fillRR(g, -40, -214, 104, 8, 3, YEL);
    DRV.x = fx + 12; DRV.y = F - 56; DRV.s = 0.3; DRV.look = -0.6; DRV.sitDrop = 40; var dw = fu < 2; DRV.hands = dw ? [[-60, -230], [120, -400 + Math.sin(t * 14) * 16]] : [[-70, -220], [40, -226]]; DRV.mood = dw ? 'happy' : 'calm'; DRV.talk = dw;
    g.restore(); K.person(g, DRV, t); g.save(); g.translate(fx, F);
    fillRR(g, -46, -76, 116, 62, 10, YEL); fillRR(g, 44, -96, 30, 82, 8, '#E0A82C'); fillRR(g, -46, -24, 116, 12, 4, INK); fillE(g, -22, -8, 15, 15, INK); fillE(g, 50, -8, 15, 15, INK); fillE(g, -22, -8, 5, 5, '#9AA6BC'); fillE(g, 50, -8, 5, 5, '#9AA6BC');
    text(g, 'FL-02', 12, -40, 9, 800, INK, 'center'); fillE(g, 64, -218, 5, 5, fu < 2 ? RED : '#FFB020');
    g.restore();
  }
  function paintFrontLive(g, t, S) {
    CO.crew(CREW, g, t, S, true);
    /* the cart fills as the picker scans */
    var c = CART, nb = S.hot === 'picking' ? Math.floor((t - (S.kT || 0)) * 1.2) % 4 + 1 : FX.cart; for (var q = 0; q < nb; q++) box(g, c.x + 6 + (q % 2) * 32, c.y - 6 - Math.floor(q / 2) * 26, 28, 24, ['#C9A27A', '#D9B88E'][q % 2]);
    /* the packing bench: a box is taped and labelled; the label printer feeds */
    var bn = BENCH, pp = PACK._pp || 0; box(g, bn.x + 34, bn.y - 44, 56, 44); if (pp > 1) { fillRR(g, bn.x + 38, bn.y - 34, 28, 17, 2, '#FFFFFF'); g.fillStyle = INK; for (var l = 0; l < 7; l++) g.fillRect(bn.x + 41 + l * 3.4, bn.y - 30, l % 2 ? 1.2 : 2, 9); }
    if (pp > 0.3) { g.fillStyle = 'rgba(160,190,220,.7)'; g.fillRect(bn.x + 34, bn.y - 46, 56 * Math.min(1, pp - 0.3), 5); } if (pp > 2.2) { fillRR(g, bn.x + 72, bn.y - 40, 16, 10, 2, RED); }
    fillRR(g, bn.x + 128, bn.y - 30 - ((t * 0.8) % 1) * 10, 26, 8, 1.5, '#FFFFFF');
    var lu = t - FX.label; if (lu < 1.6) { var lx = lerp(bn.x + 140, bn.x + 100, lu / 1.6), ly = bn.y - 40 - Math.sin(lu / 1.6 * Math.PI) * 110; g.save(); g.translate(lx, ly); g.rotate(lu * 6); fillRR(g, -14, -9, 28, 18, 2, '#FFFFFF'); g.fillStyle = INK; for (var l2 = 0; l2 < 7; l2++) g.fillRect(-10 + l2 * 3, -5, l2 % 2 ? 1 : 2, 10); g.restore(); }
    if (lu < 2.4) pill(g, PACK.x, PACK.y - 290 - lu * 10, 86, 'Label printed ✓', BLUE, '#FFFFFF', clamp((2.4 - lu) * 2, 0, 1));
    var su = t - FX.scan; if (su < 1.8) pill(g, PICK.x, PICK.y - 330 - su * 12, 54, 'Beep!', RED, '#FFFFFF', clamp((1.8 - su) * 2, 0, 1));
    var mu = t - FX.marshal; if (mu < 2.6) pill(g, RCV.x - 10, RCV.y - 340 - mu * 10, 92, 'Received · PO ✓', OK, '#FFFFFF', clamp((2.6 - mu) * 2, 0, 1));
    var wu = t - FX.whistle; if (wu < 2.2) pill(g, LEAD.x + 10, LEAD.y - 340 - wu * 10, 96, 'Crate to WH/A-203', AMB, INK, clamp((2.2 - wu) * 2, 0, 1));
    if (CLK._item) { var ih = handAt(CLK, 1); box(g, ih[0] - 9, ih[1] - 16, 18, 15, '#3FA9E0'); }
    var tu = t - FX.ptl; if (tu < 2.6) pill(g, CLK.x, CLK.y - 330 - tu * 10, 104, 'Picked ✓ · WH/OUT/0044', OK, '#FFFFFF', clamp((2.6 - tu) * 2, 0, 1));
    CR.draw(g, t);
  }

  /* ---------- the cast: an idle loop and a tap routine each ---------- */
  function actLead(P, t, S) { /* the warehouse lead: counts the rack level by level, writes, checks the reorder screen, taps his foot; tapped: whistles the crane over to the empty bin */
    var st = S.cast.lead, busy = ['reorder', 'count', 'putaway'].indexOf(S.hot) >= 0, u = tapU(st, t, 2.0), c = (t + 1) % 8; reset(P); P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm';
    if (u >= 0) { P.mood = 'happy'; P.talk = true; if (FX.whistle < st.tapT) { FX.whistle = t; FX.crane = t; CR.burst('note', P.x, P.y - 300, t); }
      if (u < 0.45) { P.hands = [[-60, -212], [10, -330]]; P.tilt = -0.05; } else { P.hands = [[-60, -212], [150, -420 + Math.sin(t * 10) * 12]]; P.look = 1; P.hop = Math.abs(Math.sin((u - 0.45) * Math.PI * 2)) * 14; } return; }
    if (busy || c < 3) { var lv = Math.floor((t * 1.2) % 4); P.hands = [[-60, -212], [-120, -200 - lv * 60]]; look(P, st, t, S, -0.7); }
    else if (c < 5) { P.hands = [[-60, -212], [-20 + Math.sin(t * 12) * 8, -200]]; P.tilt = 0.07; look(P, st, t, S, -0.1); }
    else if (c < 6.4) { P.hands = [[-60, -212], [70, -170]]; look(P, st, t, S, 1); P.tilt = Math.sin(t * 4) * 0.04; }
    else { P.hands = [[-60, -212], [70, -170]]; P.hop = Math.max(0, Math.sin(t * 8)) * 4; look(P, st, t, S, 0.4); }
  }
  function actPick(P, t, S) { /* the picker: scans a bin, turns, drops the item in the cart, scans the next; tapped: scans Nexi, "Beep!", and hops */
    var st = S.cast.pick, busy = S.hot === 'picking', u = tapU(st, t, 1.8), c = (t * (busy ? 1.4 : 1)) % 4; reset(P); P._beam = null; P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm';
    if (u >= 0) { P.mood = 'wow'; P.talk = true; if (FX.scan < st.tapT) { FX.scan = t; CR.burst('star', P.x, P.y - 300, t); }
      if (u < 0.5) { P.hands = [[-60, -212], [140, -330]]; P._beam = [S.nexi.x, S.nexi.y]; P.look = clamp((S.nexi.x - P.x) / 160, -1, 1); } else { P.mood = 'happy'; P.hands = [[-110, -380], [110, -380]]; P.hop = Math.sin((u - 0.5) * 2 * Math.PI) * 50; } return; }
    var lv = Math.floor(t / 4) % 4, tgt = bin(3 - lv, lv % 2);
    if (c < 1.4) { P.hands = [[-60, -212], [-130, -300 + lv * 30]]; P._beam = [tgt.x + 27, tgt.y - 20]; P.look = -0.9; }
    else if (c < 2.6) { P.hands = [[-60, -230], [40, -250]]; P.look = 0; P.tilt = Math.sin(t * 3) * 0.05; }
    else { P.hands = [[-60, -212], [130, -200]]; P.look = 0.8; if (c > 3.4 && !P._dd) { P._dd = 1; FX.cart = FX.cart >= 4 ? 1 : FX.cart + 1; } }
    if (c < 3.4) P._dd = 0; if (t < st.until) look(P, st, t, S, P.look);
  }
  function actPack(P, t, S) { /* the packer: tapes the box, prints the label, sticks it on, slides it along; tapped: spins her chair and the printed label flies */
    var st = S.cast.pack, busy = S.hot === 'packing', u = tapU(st, t, 2.0), c = (t * (busy ? 1.4 : 0.9)) % 3.4; reset(P); P._pp = c; P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm';
    if (u >= 0) { P.mood = 'happy'; P.talk = true; if (FX.label < st.tapT) { FX.label = t + 0.3; CR.burst('spark', BENCH.x + 140, BENCH.y - 40, t); }
      P.sx = Math.cos(u * Math.PI * 2); P.hands = u < 0.6 ? [[-110, -260], [110, -260]] : [[-110, -400], [110, -400]]; P.hop = Math.abs(Math.sin(u * Math.PI * 2)) * 10; return; }
    if (c < 1.2) { var sw = (c / 1.2); P.hands = [[lerp(-160, -60, sw), -230], [-40, -206]]; P.look = -0.7; }
    else if (c < 2) { P.hands = [[-60, -206], [lerp(90, 120, (c - 1.2) / 0.8), -226]]; P.look = 0.7; }
    else if (c < 2.8) { P.hands = [[-120, -236], [-90, -236]]; P.look = -0.5; P.tilt = -0.04; }
    else { P.hands = [[-60, -206], [60, -206]]; P.look = 0; }
    if (t < st.until) look(P, st, t, S, P.look);
  }
  function actRcv(P, t, S) { /* the receiver: waves the pallet in like ground crew, checks it against the PO on her scanner, gives a thumbs up; tapped: full marshalling signals and the receipt is confirmed */
    var st = S.cast.rcv, busy = S.hot === 'receive', u = tapU(st, t, 2.4), c = (t + 0.5) % 7; reset(P); P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm';
    if (u >= 0) { P.mood = 'happy'; P.talk = true; if (FX.marshal < st.tapT) { FX.marshal = t; FX.honk = t + 1.2; CR.burst('star', P.x, P.y - 300, t); }
      var s2 = Math.sin(t * 9); P.hands = [[-140 + s2 * 40, -400 + s2 * 30], [140 - s2 * 40, -400 + s2 * 30]]; P.hop = Math.abs(Math.sin(u * Math.PI * 4)) * 10; return; }
    if (busy || c < 2.6) { var w2 = Math.sin(t * 7); P.hands = [[-60, -212], [120 + w2 * 20, -330 + w2 * 30]]; look(P, st, t, S, 0.8); }
    else if (c < 4.6) { P.hands = [[-40, -300], [30, -280]]; P.tilt = 0.06; look(P, st, t, S, -0.1); }
    else { P.hands = [[-60, -212], [-60, -330]]; P.mood = 'happy'; look(P, st, t, S, -0.5); }
  }
  /* the lit bin on the pick-to-light wall (a lower row, within the clerk's reach) */
  function litBin(t) { var n = Math.floor((t + 1) / 9); return 18 + Math.floor(hash(n * 2.3) * 12); }
  function actClk(P, t, S) { /* the stock clerk: reaches into the lit bin, drops the item in the tote, presses the light to confirm, scans the tote; tapped: every bin lights in a wave and she spins */
    var st = S.cast.clk, u = tapU(st, t, 2.4), c = (t + 1) % 9; reset(P); P._item = false; P.hold = null; P.talk = t < st.until; P.mood = P.talk ? 'happy' : 'calm';
    if (u >= 0) { P.mood = 'happy'; P.talk = true; if (FX.ptl < st.tapT) { FX.ptl = t; CR.burst('star', P.x, P.y - 290, t); }
      P.sx = Math.cos(u * Math.PI * 2); P.hands = [[-110, -400 + Math.sin(t * 12) * 10], [110, -400 - Math.sin(t * 12) * 10]]; P.hop = Math.abs(Math.sin(u * Math.PI * 2)) * 14; return; }
    var b = ptlBin(litBin(t)), bx = (b.x + PTL.w / 2 - P.x) / P.s, byy = (b.y + 20 - P.y) / P.s;
    if (c < 2.4) { P.hands = [[-60, -212], [clamp(bx, -150, 150), clamp(byy, -460, -200)]]; P.look = clamp(bx / 150, -1, 1); P.tilt = -0.03; }
    else if (c < 4) { P._item = true; P.hands = [[-60, -212], [lerp(clamp(bx, -150, 150), 140, (c - 2.4) / 1.6), lerp(clamp(byy, -460, -200), -170, (c - 2.4) / 1.6)]]; P.look = 0.7; }
    else if (c < 5.2) { P.hands = [[-60, -212], [clamp(bx, -150, 150), clamp(byy + 26, -440, -180)]]; P.look = clamp(bx / 150, -1, 1); if (c - 4 < 0.04) CR.burst('spark', b.x + PTL.w / 2, b.y + 34, t); }
    else if (c < 7) { P.hold = 'tablet'; P.hands = [[-60, -220], [60, -232]]; P.tilt = 0.05; P.look = 0.5; }
    else { P.hands = [[-60, -212], [70, -212]]; P.tilt = Math.sin(t * 2) * 0.04; P.look = Math.sin(t * 0.8) * 0.8; }
    if (t < st.until) look(P, st, t, S, P.look);
  }
  window.IXW.worlds['app-stock'] = {
    pan: [-300, 1200],
    calmView: [194, -112, 812, 650], calmCast: ['lead', 'pick', 'pack', 'rcv'],
    paintBg: paintBg, windowBehind: true, paintFrame: function () {}, paintBack: paintBack, paintFront: paintFront, paintFore: paintFore,
    paintWindow: paintWindow, paintLive: paintLive, paintFrontLive: paintFrontLive,
    paintForeLive: function (g, t, S) { K.zfore(g, t, S, [], function () { CO.crew(crewVis(), g, t, S, 'fore'); }); CR.draw(g, t); },
    moteCol: 'rgba(242,163,58,.22)',
    glow: {
      receive: function (g) { rr(g, DK.x - 10, DK.y - 52, DK.w + 20, 130, 12); },
      putaway: function (g) { rr(g, RK.x - 8, RK.y - 8, RK.w + 16, F - RK.y + 12, 12); },
      picking: function (g) { var c = CART; rr(g, c.x - 12, c.y - 70, 96, 140, 12); },
      packing: function (g) { var b = BENCH; rr(g, b.x - 6, b.y - 54, b.w + 12, 64, 10); },
      reorder: function (g) { rr(g, RO.x - 10, RO.y - 10, RO.w + 20, RO.h + 20, 12); },
      count: function (g) { rr(g, CT.x - 10, CT.y - 10, CT.w + 20, CT.h + 20, 12); },
      honk: function (g) { rr(g, DK.x + 20, 100, DK.w - 40, 44, 10); }
    },
    backGlow: ['receive', 'putaway', 'reorder', 'count', 'honk'],
    cast: [
      { id: 'lead', behind: false, keys: ['reorder', 'count', 'putaway'], P: LEAD, act: actLead },
      { id: 'pick', behind: false, keys: ['picking'], P: PICK, act: actPick },
      { id: 'pack', behind: true, keys: ['packing'], P: PACK, act: actPack },
      { id: 'rcv', behind: false, keys: ['receive'], P: RCV, act: actRcv },
      { id: 'clk', behind: true, keys: [], P: CLK, act: actClk }
    ],
    toy: function (name, S, t) { if (name === 'honk') { FX.honk = t; CR.burst('note', DK.x + 79, DK.y - 10, t); } },
    hit: function (x, y, S, t) {
      var r = CR.hitWalker(x, y, t); if (r) return r;
      var fx = forkX(t); if (x > fx - 100 && x < fx + 80 && y > F - 170 && y < F + 10) { FX.fork = t; CR.burst('star', fx, F - 170, t); return { say: 'The forklift moves a pallet, Odoo moves the **stock record** with it.', who: 'Forklift driver', near: [482, -10], pose: 'wow' }; }
      if (x > BD.x && x < BD.x + BD.w && y > BD.y && y < BD.y + BD.h) { CR.burst('spark', BD.x + BD.w / 2, BD.y + 20, t); return { say: 'The outbound board: every delivery order, its dock and its **status**.', near: [482, -10], pose: 'point-right' }; }
      return null;
    },
    onStop: function (key, S, t) { S.kT = t; if (key === 'putaway') FX.crane = t; if (key === 'receive') FX.marshal = t; }
  };
})(window.IXW && window.IXW.kit, window.CR, window.CO);
