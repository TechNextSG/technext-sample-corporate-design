/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: manufacturing (/industries/manufacturing) — Keystone Works, a sample maker of steel shelving, drawn as its FACTORY
   FLOOR. Corrugated walls under clerestory windows, a safety-yellow rail, an epoxy floor with walkway tape, and a gantry
   crane that carries steel along the whole hall. In the frame: the glass sales office with the order on screen (Sales),
   the planning board of the work centres (Manufacturing, MPS), the robot welding cell with its andon tower (tap the robot
   to weld, tap the tower to cycle it), the operator console with the work order tablet (Manufacturing, shop floor), the
   quality table with its pass lamp (Quality), the cost screen (Accounting) and the component racks with a delivery
   (Purchase). Beyond the frame: the press brake, steel sheet stacks, a 5S board, a tool cabinet, wrapped finished goods
   and the loading door. Staff: Dev, operator (sample); Lin, quality inspector (sample). */
(function (K) {
  'use strict';
  if (!K) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed;
  var F = 470;
  var T = {
    office: { x: 186, y: 236, w: 150, h: 234 }, plan: { x: 372, y: 44, w: 200, h: 110 }, cost: { x: 614, y: 50, w: 150, h: 96 },
    cell: { x: 384, y: 236, w: 214 }, console: { x: 604, y: 352, w: 92 }, qc: { x: 716, y: 360, w: 150 }, racks: { x: 882, y: 210, w: 112 }
  };
  var C = { teal: '#2F6B7A', tealD: '#21505C', steel: '#8A97A6', steelD: '#5C6B7A', yellow: '#FFC93C', orange: '#FF7A1A', ink: '#1E2A33', green: '#1FA463', red: '#E2453C', cream: '#F4F1EA' };
  function ribs(g, W, ry, k, sx) { g.fillStyle = 'rgba(40,60,80,.08)'; var step = 22 * k; for (var x = (sx % step) - step; x < W; x += step) g.fillRect(x, 0, 6 * k, ry); }
  var ROOM = { wall: ['#DFE6EC', '#D0D9E2'], wains: ['#5C7080', '#51636F'], rail: '#FFC93C', base: '#3E4C57', floor: ['#BCC7C5', '#A6B3B1'], floorKind: 'tiles', floorLine: 'rgba(255,255,255,.22)',
    panelLine: 'rgba(0,0,0,0)', wainsH: 110, pattern: ribs };

  /* ---------------- beyond the frame (ext = the whole hero in set units) ---------------- */
  var GY = 10; /* the gantry beam's height */
  function sheetStack(g, x, n) { for (var i = 0; i < n; i++) fillRR(g, x + (i % 2) * 4, F - 10 - i * 7, 150, 7, 1, i % 2 ? '#A9B4C2' : '#C3CDDA'); fillRR(g, x - 4, F - 6, 160, 6, 2, '#6B5A4A'); }
  function wideBack(g, ext) {
    /* clerestory windows and their daylight, the gantry runway beam */
    var top = Math.max(ext.t + 16, -120);
    for (var wx = Math.floor(ext.l / 180) * 180; wx < ext.r; wx += 180) { fillRR(g, wx + 10, top, 150, Math.min(60, -10 - top), 4, '#BFE3F3'); g.fillStyle = '#8A97A6'; g.fillRect(wx + 83, top, 4, Math.min(60, -10 - top));
      g.save(); var gl = g.createLinearGradient(0, top, 0, 360); gl.addColorStop(0, 'rgba(255,250,225,.30)'); gl.addColorStop(1, 'rgba(255,250,225,0)'); g.fillStyle = gl; g.beginPath(); g.moveTo(wx + 10, top + 50); g.lineTo(wx + 160, top + 50); g.lineTo(wx + 230, 360); g.lineTo(wx + 80, 360); g.closePath(); g.fill(); g.restore(); }
    fillRR(g, ext.l, GY - 8, ext.r - ext.l, 16, 2, C.yellow); g.fillStyle = 'rgba(0,0,0,.15)'; g.fillRect(ext.l, GY + 4, ext.r - ext.l, 4);
    g.fillStyle = C.ink; for (var hz = Math.floor(ext.l / 40) * 40; hz < ext.r; hz += 40) { g.beginPath(); g.moveTo(hz, GY - 8); g.lineTo(hz + 12, GY - 8); g.lineTo(hz + 4, GY + 8); g.lineTo(hz - 8, GY + 8); g.closePath(); g.fill(); }
    /* walkway tape on the floor */
    g.fillStyle = 'rgba(255,201,60,.85)'; g.fillRect(ext.l, 520, ext.r - ext.l, 5); g.fillRect(ext.l, 600, ext.r - ext.l, 5);
    if (ext.l < -460) { /* the press brake, steel sheet stacks, the 5S board */
      var px = -720; soft(g, px + 110, F + 4, 140, 10, 0.25); fillRR(g, px, F - 200, 220, 200, 8, C.teal); fillRR(g, px + 10, F - 190, 200, 40, 4, C.tealD); fillRR(g, px + 20, F - 120, 180, 14, 3, C.steel); fillRR(g, px + 30, F - 92, 160, 10, 3, '#C3CDDA');
      fillRR(g, px + 14, F - 60, 192, 40, 4, C.tealD); fillRR(g, px + 160, F - 178, 36, 26, 4, '#2A3550'); fillRR(g, px + 164, F - 174, 28, 12, 2, '#7FE9C4'); text(g, 'PRESS BRAKE · PB-2', px + 110, F - 165, 9, 800, '#FFFFFF', 'center');
      g.fillStyle = C.yellow; for (var s1 = 0; s1 < 220; s1 += 18) { g.fillRect(px + s1, F - 6, 9, 6); }
      sheetStack(g, -940, 9);
      shadowed(g, 10, 4, 0.18, function () { fillRR(g, -460, 96, 120, 100, 6, '#FFFFFF'); }); fillRR(g, -460, 96, 120, 22, 6, C.teal); text(g, '5S BOARD', -400, 111, 9, 800, '#FFFFFF', 'center');
      ['#FFD84A', '#FF8FA3', '#9FE3C1', '#7FB7E3', '#FFD84A', '#9FE3C1'].forEach(function (c, i) { fillRR(g, -452 + (i % 3) * 38, 126 + Math.floor(i / 3) * 32, 30, 26, 2, c); });
    }
    if (ext.l < 100) { /* behind the copy: the tool cabinet, a drinking station, parts bins on the wall */
      fillRR(g, -320, 330, 110, 140, 6, C.red); for (var d = 0; d < 5; d++) { fillRR(g, -314, 340 + d * 26, 98, 22, 3, '#C9372F'); fillRR(g, -282, 348 + d * 26, 34, 5, 2, '#E8EDF2'); } text(g, 'TOOLS', -265, 324, 9, 800, C.ink, 'center');
      for (var r = 0; r < 3; r++) for (var c2 = 0; c2 < 5; c2++) fillRR(g, -160 + c2 * 34, 150 + r * 34, 30, 26, 4, ['#3A93C0', '#FFC93C', '#21B799'][(r + c2) % 3]);
      fillRR(g, -170, 140, 186, 6, 3, C.steelD); fillRR(g, -170, 248, 186, 6, 3, C.steelD);
    }
    if (ext.r > 1010) { /* wrapped finished goods and the loading door */
      [[1030, 0], [1100, 1], [1060, 2]].forEach(function (p, i) { var y0 = F - (i === 2 ? 130 : 0); fillRR(g, p[0], y0 - 12, 64, 12, 2, '#B98E62'); fillRR(g, p[0] + 2, y0 - 72, 60, 60, 4, 'rgba(210,225,235,.9)');
        g.fillStyle = 'rgba(255,255,255,.45)'; g.fillRect(p[0] + 8, y0 - 70, 6, 56); fillRR(g, p[0] + 16, y0 - 50, 30, 18, 2, '#FFFFFF'); text(g, 'FG', p[0] + 31, y0 - 37, 8, 800, C.teal, 'center'); });
      fillRR(g, 1180, 150, 200, 320, 4, '#3E4C57'); var sk = g.createLinearGradient(0, 160, 0, 460); sk.addColorStop(0, '#CFEAF7'); sk.addColorStop(1, '#F2F8FB'); g.fillStyle = sk; g.fillRect(1192, 230, 176, 236);
      for (var sl = 160; sl < 230; sl += 10) fillRR(g, 1192, sl, 176, 10, 2, sl % 20 ? '#B9C4CC' : '#C9D3DA'); text(g, 'DISPATCH', 1280, 146, 9, 800, C.ink, 'center');
    }
  }
  var CREW = [{ x0: -940, x1: -500, y: 490, spd: 22, ph: 0.2, P: { s: 0.44, ph: 0.5, c: { skin: '#C68B5E', hair: '#1F1A1A', top: '#2F4F6F', low: '#2F4F6F', shoe: '#2A3550', hat: '#FF7A1A' }, outfit: 'tee', hat: 'cap', glasses: true, vest: '#FFC93C', hairStyle: 'short', beard: '#1F1A1A', short: true, mood: 'calm', look: 0, hands: [[-70, -150], [70, -150]] } },
    { x0: -300, x1: 80, y: 490, spd: 18, ph: 0.6, P: { s: 0.44, ph: 1.3, c: { skin: '#F3CDA8', hair: '#3A2620', top: '#2F6B7A', low: '#2F4F6F', shoe: '#2A3550' }, outfit: 'tee', glasses: true, hairStyle: 'pony', hijab: '#21505C', clipCol: '#FFC93C', hold: 'clipboard', mood: 'happy', look: 0, hands: [[-60, -200], [70, -150]] } },
    { front: true, x0: -930, x1: -400, y: 650, spd: 26, ph: 0.4, P: { s: 0.5, ph: 2.1, c: { skin: '#6B4329', hair: '#1F1A1A', top: '#2F4F6F', low: '#2F4F6F', shoe: '#2A3550', hat: '#21B799' }, outfit: 'tee', hat: 'cap', vest: '#FF7A1A', glasses: true, hairStyle: 'curly', short: true, hold: 'box', mood: 'calm', look: 0, hands: [[-60, -212], [64, -216]] } },
    { x0: 1010, x1: 1180, y: 490, spd: 16, ph: 0.15, P: { s: 0.44, ph: 0.9, c: { skin: '#E8B48F', hair: '#BDBDBD', top: '#5C6B7A', low: '#2F4F6F', shoe: '#2A3550', hat: '#3A93C0' }, outfit: 'tee', hat: 'cap', vest: '#D7F04B', hairStyle: 'bald', build: 1.15, short: true, mood: 'calm', look: 0, hands: [[-70, -150], [70, -150]] } }];
  function crew(g, t, S, front) { var ext = S.ext;
    CREW.slice().sort(function (a, b) { return a.y - b.y; }).forEach(function (w) { var L = (w.front || w.y >= 560) ? 'fore' : w.y > 470; if (L !== front) return; var a = Math.max(w.x0, ext.l + 40), b = Math.min(w.x1, ext.r - 50); if (b - a < 60) return; K.walker(g, { x0: a, x1: b, y: w.y, spd: w.spd, ph: w.ph, P: w.P }, t); }); }
  function wideFront(g, ext) {
  }

  /* ---------------- static back props (set units) ---------------- */
  /* ---------------- more of the hall: ducts and a safety banner; a forklift, coils of steel, bollards ---------------- */
  function moreBack(g, ext) {
    var dy = Math.max(ext.t + 70, -140); g.fillStyle = '#B7C2CB'; g.fillRect(ext.l, dy, ext.r - ext.l, 26); g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(ext.l, dy + 4, ext.r - ext.l, 5);
    g.fillStyle = '#9AA6B2'; for (var x = Math.floor(ext.l / 90) * 90; x < ext.r; x += 90) g.fillRect(x, dy - 2, 6, 30);
    if (ext.l < -320) { fillRR(g, -520, dy + 50, 240, 54, 6, C.yellow); fillRR(g, -514, dy + 56, 228, 42, 4, C.ink); text(g, 'SAFETY FIRST', -400, dy + 76, 13, 800, C.yellow, 'center'); text(g, '214 days without a lost-time injury · sample', -400, dy + 92, 7, 700, '#DDE3E8', 'center'); }
    if (ext.r > 1060) { fillRR(g, 1080, dy + 50, 150, 60, 30, '#FFFFFF'); g.strokeStyle = C.ink; g.lineWidth = 3; g.beginPath(); g.arc(1155, dy + 80, 24, 0, 7); g.stroke(); text(g, 'SHIFT B', 1110, dy + 84, 8, 800, C.teal, 'center'); }
  }
  function moreFront(g, ext) {
  }
  function paintBack(g, ext) {
    wideBack(g, ext);
    /* the glass sales office */
    var of = T.office; soft(g, of.x + of.w / 2, F + 4, of.w * 0.6, 9, 0.22); fillRR(g, of.x, of.y, of.w, of.h, 4, C.steelD); fillRR(g, of.x + 6, of.y + 6, of.w - 12, of.h - 12, 2, 'rgba(200,230,245,.85)');
    g.fillStyle = C.steelD; g.fillRect(of.x + of.w / 2 - 2, of.y, 4, of.h); g.fillRect(of.x, of.y + 100, of.w, 4);
    fillRR(g, of.x + 20, of.y + 154, 110, 10, 3, '#B98E62'); g.fillStyle = '#8A6A4A'; g.fillRect(of.x + 28, of.y + 164, 5, 64); g.fillRect(of.x + 118, of.y + 164, 5, 64);
    fillRR(g, of.x + 32, of.y + 112, 62, 42, 5, '#2A3550'); fillRR(g, of.x + 36, of.y + 116, 54, 34, 2, '#FFFFFF'); fillRR(g, of.x + 100, of.y + 136, 26, 18, 3, '#D7DEE8');
    fillRR(g, of.x + 20, of.y - 18, 110, 20, 4, C.ink); text(g, 'SALES · PLANNING', of.x + 75, of.y - 4, 8, 800, '#FFFFFF', 'center');
    /* the planning board on the wall (the today line is live) */
    var pl = T.plan; shadowed(g, 12, 5, 0.18, function () { fillRR(g, pl.x, pl.y, pl.w, pl.h, 6, '#FFFFFF'); }); fillRR(g, pl.x, pl.y, pl.w, 20, 6, C.teal); text(g, 'PRODUCTION PLAN · WEEK 42', pl.x + 10, pl.y + 14, 7.5, 800, '#FFFFFF');
    ['CUT', 'WELD', 'PAINT'].forEach(function (wc, i) { var ry = pl.y + 34 + i * 24; text(g, wc, pl.x + 10, ry + 9, 7, 800, C.ink); fillRR(g, pl.x + 44, ry, 148, 13, 3, '#EEF2F6');
      [[0, 46, '#3A93C0'], [52, 40, '#FFC93C'], [98, 44, '#21B799']].forEach(function (b, j) { fillRR(g, pl.x + 46 + ((b[0] + i * 18) % 120), ry + 2, b[1] - i * 4, 9, 2, b[2]); }); });
    /* the cost screen (its bars are live) */
    var cs = T.cost; shadowed(g, 12, 5, 0.22, function () { fillRR(g, cs.x, cs.y, cs.w, cs.h, 6, '#1E2A33'); }); fillRR(g, cs.x + 5, cs.y + 5, cs.w - 10, cs.h - 10, 3, '#25343F'); text(g, 'COST · MO/0412', cs.x + 12, cs.y + 20, 7.5, 800, '#9FE3C1');
    /* the robot cell: a yellow mesh fence, the fixture, the arm's base (the arm is live), the andon tower */
    var ce = T.cell; soft(g, ce.x + ce.w / 2, F + 4, ce.w * 0.6, 10, 0.25);
    g.strokeStyle = 'rgba(255,201,60,.9)'; g.lineWidth = 1.4; g.beginPath(); for (var mx = ce.x; mx <= ce.x + ce.w; mx += 12) { g.moveTo(mx, ce.y + 40); g.lineTo(mx, F); } for (var my = ce.y + 40; my <= F; my += 12) { g.moveTo(ce.x, my); g.lineTo(ce.x + ce.w, my); } g.stroke();
    g.fillStyle = C.yellow; g.fillRect(ce.x, ce.y + 36, ce.w, 6); g.fillRect(ce.x, ce.y + 36, 6, F - ce.y - 36); g.fillRect(ce.x + ce.w - 6, ce.y + 36, 6, F - ce.y - 36);
    fillRR(g, ce.x + 120, F - 70, 80, 70, 6, C.steelD); fillRR(g, ce.x + 112, F - 76, 96, 10, 3, C.steel); fillRR(g, ce.x + 134, F - 98, 52, 22, 3, '#C3CDDA');
    fillRR(g, ce.x + 40, F - 30, 56, 30, 6, C.ink); g.fillStyle = '#3E4C57'; g.fillRect(ce.x + 20, ce.y - 4, 6, 44);
    /* the component racks with bins, a delivery pallet with its purchase order */
    var rk = T.racks; soft(g, rk.x + rk.w / 2, F + 4, rk.w * 0.6, 9, 0.22); g.fillStyle = C.orange; g.fillRect(rk.x, rk.y, 6, F - rk.y); g.fillRect(rk.x + rk.w - 6, rk.y, 6, F - rk.y);
    ['M8 BOLTS', 'BRACKETS', 'PANELS'].forEach(function (lb, i) { var ly = rk.y + 50 + i * 74; fillRR(g, rk.x, ly, rk.w, 7, 2, '#3167CA');
      for (var b = 0; b < 2; b++) { fillRR(g, rk.x + 10 + b * 50, ly - 40, 44, 40, 4, b === 1 && i === 0 ? '#E6ECF4' : ['#3A93C0', '#21B799', '#FFC93C'][(i + b) % 3]); fillRR(g, rk.x + 14 + b * 50, ly - 28, 36, 10, 2, '#FFFFFF'); }
      text(g, lb, rk.x + rk.w / 2, ly + 18, 6.5, 800, C.ink, 'center'); });
  }

  /* ---------------- static front props: the operator console and the QC table (over the staff) ---------------- */
  function paintFront(g, ext) {
    var co = T.console; fillRR(g, co.x, co.y, co.w, F - co.y, 8, '#C3CDDA'); fillRR(g, co.x + 6, co.y + 8, co.w - 12, 40, 4, '#2A3550');
    [[16, '#1FA463'], [34, '#FFC93C'], [52, '#3167CA']].forEach(function (b) { fillE(g, co.x + b[0], co.y + 28, 6, 6, b[1]); }); fillE(g, co.x + 74, co.y + 28, 9, 9, C.red); fillE(g, co.x + 74, co.y + 28, 5, 5, '#B5302A');
    text(g, 'CELL 2', co.x + co.w / 2, co.y + 72, 9, 800, C.ink, 'center'); g.fillStyle = C.yellow; for (var s = 0; s < co.w; s += 16) g.fillRect(co.x + s, F - 10, 8, 10);
    g.strokeStyle = C.steelD; g.lineWidth = 5; g.beginPath(); g.moveTo(co.x + 20, co.y); g.lineTo(co.x + 26, co.y - 12); g.stroke(); fillRR(g, co.x - 14, co.y - 64, 80, 56, 6, '#2A3550'); fillRR(g, co.x - 10, co.y - 60, 72, 48, 3, '#FFFFFF');
    var qc = T.qc; fillRR(g, qc.x, qc.y, qc.w, 12, 3, '#C9D1DB'); g.fillStyle = C.steelD; g.fillRect(qc.x + 8, qc.y + 12, 7, F - qc.y - 12); g.fillRect(qc.x + qc.w - 15, qc.y + 12, 7, F - qc.y - 12); fillRR(g, qc.x + 8, F - 40, qc.w - 16, 6, 2, C.steel);
    fillRR(g, qc.x + 20, qc.y - 14, 60, 14, 3, C.steel); fillRR(g, qc.x + 24, qc.y - 30, 12, 18, 2, C.steel); fillRR(g, qc.x + 96, qc.y - 6, 40, 6, 2, '#5C6670'); fillRR(g, qc.x + 128, qc.y - 18, 4, 14, 1, '#5C6670');
    fillRR(g, qc.x + 30, qc.y + 22, 90, 26, 5, '#FFFFFF'); text(g, 'QUALITY CHECK', qc.x + 75, qc.y + 39, 8, 800, C.teal, 'center');
    var dl = T.racks; fillRR(g, dl.x - 30, F - 12, 90, 12, 2, '#B98E62'); fillRR(g, dl.x - 26, F - 56, 40, 44, 3, '#C99A6B'); fillRR(g, dl.x + 18, F - 46, 38, 34, 3, '#D2A673'); fillRR(g, dl.x - 20, F - 46, 26, 18, 2, '#FFFFFF'); text(g, 'PO', dl.x - 7, F - 34, 7, 800, C.teal, 'center');
  }

  /* ---------------- live: the gantry trolley, the robot arm, the andon, the screens ---------------- */
  function paintLive(g, t, now, S) {
    crew(g, t, S, false);
    var ext = S.ext, span = ext.r - ext.l - 200, gx = ext.l + 100 + (Math.sin(t * 0.12) * 0.5 + 0.5) * span, drop = 120 + Math.sin(t * 0.5) * 20;
    fillRR(g, gx - 30, GY + 8, 60, 22, 4, '#3E4C57'); g.strokeStyle = '#2A3550'; g.lineWidth = 2; g.beginPath(); g.moveTo(gx - 10, GY + 30); g.lineTo(gx - 10, GY + drop); g.moveTo(gx + 10, GY + 30); g.lineTo(gx + 10, GY + drop); g.stroke();
    fillRR(g, gx - 16, GY + drop, 32, 12, 3, C.yellow); for (var sh = 0; sh < 4; sh++) fillRR(g, gx - 70 + (sh % 2) * 3, GY + drop + 14 + sh * 6, 140, 6, 1, sh % 2 ? '#A9B4C2' : '#C3CDDA');
    /* the robot arm: picks from the fixture and welds; tapped, it welds with a shower of sparks */
    var ce = T.cell, bx = ce.x + 68, by = F - 30, tr = S.toy.robot != null ? t - S.toy.robot : 99, ph = t * 0.9, a1 = -1.9 + Math.sin(ph) * 0.35, a2 = 1.2 + Math.cos(ph * 1.3) * 0.4;
    var ex = bx + Math.cos(a1) * 90, ey = by + Math.sin(a1) * 90, hx = ex + Math.cos(a1 + a2) * 70, hy = ey + Math.sin(a1 + a2) * 70;
    g.strokeStyle = C.orange; g.lineCap = 'round'; g.lineWidth = 18; g.beginPath(); g.moveTo(bx, by); g.lineTo(ex, ey); g.stroke(); g.lineWidth = 13; g.beginPath(); g.moveTo(ex, ey); g.lineTo(hx, hy); g.stroke();
    fillE(g, bx, by, 14, 14, '#E0650C'); fillE(g, ex, ey, 11, 11, '#E0650C'); fillRR(g, hx - 7, hy - 7, 14, 22, 4, C.ink);
    var weld = tr < 1.6 || S.hot === 'make' || (t % 4) < 0.9;
    if (weld) { fillE(g, hx, hy + 18, 5 + Math.sin(t * 40) * 1.5, 5, 'rgba(255,245,200,.95)'); for (var i = 0; i < (tr < 1.6 ? 16 : 8); i++) { var a = -Math.PI / 2 + (hash(i + Math.floor(t * 8)) - 0.5) * 3, d = 6 + hash(i * 3 + Math.floor(t * 8)) * (tr < 1.6 ? 46 : 24);
      g.fillStyle = i % 2 ? C.yellow : C.orange; g.fillRect(hx + Math.cos(a) * d, hy + 18 + Math.sin(a) * d + d * 0.5, 2.6, 2.6); } }
    /* the andon tower: green while running, amber now and then; tapped, it cycles */
    var ta = S.toy.andon != null ? t - S.toy.andon : 99, lit = ta < 2.4 ? Math.floor(ta / 0.8) : ((t % 9) < 1.2 ? 1 : 2), cols = [C.red, '#FFC93C', '#1FA463'];
    for (var l = 0; l < 3; l++) { var on = l === lit; fillRR(g, ce.x + 14, ce.y - 64 + l * 20, 18, 18, 3, on ? cols[l] : 'rgba(80,90,100,.55)'); if (on) { g.globalAlpha = 0.3; fillE(g, ce.x + 23, ce.y - 55 + l * 20, 22, 16, cols[l]); g.globalAlpha = 1; } }
    /* the planning board's today line, the cost screen's bars and total */
    var pl = T.plan, td = pl.x + 46 + ((t * 6) % 146); g.fillStyle = C.red; g.fillRect(td, pl.y + 28, 2, 74);
    var cs = T.cost, hi = S.hot === 'cost', vals = [0.58, 0.27, 0.15], cl = ['#3A93C0', '#FFC93C', '#21B799'], acc = 0;
    vals.forEach(function (v, i) { var w = (cs.w - 24) * v * (hi ? clamp((t - (S.csT || 0)) * 1.4, 0, 1) : 1); fillRR(g, cs.x + 12 + acc, cs.y + 34, Math.max(2, w), 16, 2, cl[i]); acc += (cs.w - 24) * v; });
    text(g, 'per unit', cs.x + 12, cs.y + 68, 7, 700, '#9FB0BC'); text(g, 'S$ 186.40', cs.x + cs.w - 12, cs.y + 80, 13, 800, '#FFFFFF', 'right');
    /* the order on the office monitor */
    var of = T.office; fillRR(g, of.x + 36, of.y + 116, 54, 8, 2, '#3167CA'); text(g, 'SO 0418', of.x + 40, of.y + 122.5, 5.5, 800, '#FFFFFF'); text(g, '40 × shelf', of.x + 40, of.y + 134, 5.5, 700, C.ink);
    fillRR(g, of.x + 40, of.y + 138, 46, 7, 3, S.hot === 'order' ? C.green : '#D7DEE8');
  }
  function paintFrontLive(g, t, S) {
    crew(g, t, S, true);
    var co = T.console, mk = S.hot === 'make', p = mk ? clamp((t - (S.mkT || 0)) / 3, 0, 1) : ((t % 8) / 8);
    fillRR(g, co.x - 10, co.y - 60, 72, 10, 2, C.teal); text(g, 'WO/0412 · WELD', co.x - 6, co.y - 52.5, 5.5, 800, '#FFFFFF');
    text(g, Math.round(p * 40) + ' / 40', co.x + 26, co.y - 32, 8, 800, C.ink, 'center'); fillRR(g, co.x - 4, co.y - 24, 60, 6, 3, '#E3E8EF'); fillRR(g, co.x - 4, co.y - 24, 60 * p, 6, 3, C.green);
    var qc = T.qc, ck = S.hot === 'check', pass = ck ? (t - (S.ckT || 0)) > 1 : (t % 5) < 2.5; fillE(g, qc.x + qc.w - 16, qc.y - 26, 8, 8, pass ? C.green : '#C3CDDA'); g.fillStyle = C.steelD; g.fillRect(qc.x + qc.w - 18, qc.y - 18, 4, 18);
    if (ck && pass) { fillRR(g, qc.x + 40, qc.y - 46, 48, 18, 9, C.green); text(g, 'PASS', qc.x + 64, qc.y - 33.5, 8, 800, '#FFFFFF', 'center'); }
  }

  var DEV = { x: 648, y: 452, s: 0.56, ph: 0.4, c: { skin: '#C68B5E', hair: '#1F1A1A', top: '#2F4F6F', top2: '#FF7A1A', hat: '#FF7A1A' }, outfit: 'scrubs', hat: 'cap', glasses: true, hairStyle: 'short', feet: false, mood: 'calm', look: 0, talk: false, hands: [[-62, -186], [62, -186]] };
  var LIN = { x: 798, y: 456, s: 0.56, ph: 1.6, c: { skin: '#F3CDA8', hair: '#2B1D16', top: '#FBFCFF', top2: '#2F6B7A' }, outfit: 'coat', glasses: true, hairStyle: 'bun', clipCol: '#21B799', hold: 'clipboard', feet: false, mood: 'calm', look: 0, talk: false, hands: [[-60, -210], [62, -186]] };

  /* the foreground, nearest last: each prop stands at a y, sorted with the front-row passers-by (K.zfore) */
  function FORE() {
    return [
      [690, function (g, ext) {
    if (ext.l < -540) { var cx = -860; soft(g, cx + 60, 690, 80, 8, 0.25); fillRR(g, cx, 620, 130, 10, 3, C.steelD); fillRR(g, cx, 660, 130, 10, 3, C.steelD); g.fillStyle = C.steelD; g.fillRect(cx + 4, 600, 6, 80); g.fillRect(cx + 120, 600, 6, 80);
      for (var b = 0; b < 3; b++) { fillRR(g, cx + 10 + b * 40, 590, 36, 30, 4, ['#3A93C0', '#FFC93C', '#21B799'][b]); fillRR(g, cx + 10 + b * 40, 630, 36, 28, 4, ['#21B799', '#3A93C0', '#FF7A1A'][b]); } fillE(g, cx + 14, 684, 6, 6, C.ink); fillE(g, cx + 116, 684, 6, 6, C.ink); }
      }],
      [652, function (g, ext) {
    if (ext.r > 1040) { var jx = 1080; fillRR(g, jx, 640, 130, 12, 3, '#B98E62'); for (var p = 0; p < 2; p++) fillRR(g, jx + 4 + p * 64, 580, 58, 60, 4, 'rgba(210,225,235,.9)'); g.strokeStyle = C.orange; g.lineWidth = 6; g.beginPath(); g.moveTo(jx + 130, 646); g.lineTo(jx + 168, 570); g.stroke(); soft(g, jx + 65, 656, 80, 7, 0.25); }
      }]
    ];
  }
  window.IXW.worlds.manufacturing = {
    calmView: [180,-45,820,656], /* calm layer: the framed hero shows the core of the scene */
    pan: [-340, 1170], /* phones: how far the scene drags each way (set units), ending on whole objects */
    room: ROOM, paintBack: paintBack, paintFront: paintFront, paintWindow: function () {}, paintLive: paintLive, paintFrontLive: paintFrontLive, paintForeLive: function (g, t, S) { K.zfore(g, t, S, FORE(), function () { crew(g, t, S, 'fore'); }); },
    motes: false,
    glow: {
      order: function (g) { var of = T.office; rr(g, of.x - 8, of.y - 26, of.w + 16, of.h + 30, 12); },
      plan: function (g) { var pl = T.plan; rr(g, pl.x - 8, pl.y - 8, pl.w + 16, pl.h + 16, 12); },
      source: function (g) { var rk = T.racks; rr(g, rk.x - 38, rk.y - 8, rk.w + 46, F - rk.y + 12, 12); },
      make: function (g) { var ce = T.cell; rr(g, ce.x - 8, ce.y - 72, ce.w + 16, F - ce.y + 78, 14); },
      check: function (g) { var qc = T.qc; rr(g, qc.x - 8, qc.y - 50, qc.w + 16, 70, 12); },
      cost: function (g) { var cs = T.cost; rr(g, cs.x - 8, cs.y - 8, cs.w + 16, cs.h + 16, 12); },
      robot: function (g) { var ce = T.cell; rr(g, ce.x + 20, ce.y + 40, 150, F - ce.y - 40, 12); },
      andon: function (g) { var ce = T.cell; rr(g, ce.x + 6, ce.y - 72, 34, 76, 8); }
    },
    backGlow: ['order', 'plan', 'source', 'make', 'cost', 'robot', 'andon'],
    cast: [
      { id: 'dev', behind: true, keys: ['make'], P: DEV, act: function (P, t, S) {
        var st = S.cast.dev, busy = S.hot === 'make';
        P.talk = t < st.until; P.mood = P.talk || busy ? 'happy' : 'calm';
        P.hands = t < st.wave ? [[-62, -186], [128 + Math.sin(t * 12) * 16, -404]] : [[-70, -250 + (busy ? Math.abs(Math.sin(t * 6)) * 16 : 0)], [62, -190]];
        P.look = lerp(P.look, clamp((S.nexi.x - P.x) / 160, -1, 1), 0.08);
      } },
      { id: 'lin', behind: true, keys: ['check'], P: LIN, act: function (P, t, S) {
        var st = S.cast.lin, busy = S.hot === 'check';
        P.talk = t < st.until; P.mood = P.talk || busy ? 'happy' : 'calm';
        P.hands = t < st.wave ? [[-60, -210], [128 + Math.sin(t * 12) * 16, -404]] : [[-60, -210], [70 + (busy ? Math.sin(t * 5) * 14 : 0), -200]];
        P.look = lerp(P.look, clamp((S.nexi.x - P.x) / 160, -1, 1), 0.08);
      } }
    ],
    onStop: function (key, S, t) { if (key === 'make') S.mkT = t; if (key === 'check') S.ckT = t; if (key === 'cost') S.csT = t; }
  };
  /* ---------------- audit round: a working aisle. Painted direction arrows and a hatched keep-clear box on the floor, a
     forklift shuttling a pallet of finished goods along the aisle (tap it: it stops, toots and lifts its forks), and a
     wrapped pallet of finished goods waiting right of the caption ---------------- */
  var FL = { x0: -560, x1: 930, y: 580, toot: -9, paid: 0 };
  function flT(t) { var d = t - FL.toot; return d < 2.6 ? FL.toot - FL.paid : t - FL.paid - 2.6; }
  function flX(tt) { var span = FL.x1 - FL.x0, u = (tt * 44) % (span * 2); return { x: FL.x0 + (u < span ? u : span * 2 - u), dir: u < span ? 1 : -1 }; }
  function exFloor(g, ext) {
    for (var x = Math.floor(ext.l / 220) * 220 + 40; x < ext.r; x += 220) { g.fillStyle = 'rgba(255,255,255,.55)'; g.beginPath(); g.moveTo(x, 555); g.lineTo(x + 34, 555); g.lineTo(x + 34, 548); g.lineTo(x + 52, 559); g.lineTo(x + 34, 570); g.lineTo(x + 34, 563); g.lineTo(x, 563); g.closePath(); g.fill(); }
    if (ext.l < -200) { var kx = -370, ky = 612, kw = 200, kh = 44; g.save(); rr(g, kx, ky, kw, kh, 2); g.clip(); fillRR(g, kx, ky, kw, kh, 0, 'rgba(255,201,60,.55)');
      g.strokeStyle = 'rgba(30,42,51,.45)'; g.lineWidth = 8; for (var hx = kx - kh; hx < kx + kw; hx += 22) { g.beginPath(); g.moveTo(hx, ky + kh); g.lineTo(hx + kh, ky); g.stroke(); } g.restore();
      fillRR(g, kx + 50, ky + 12, 100, 20, 4, '#F4F1EA'); text(g, 'KEEP CLEAR', kx + 100, ky + 26, 10, 800, '#1E2A33', 'center'); }
  }
  function forklift(g, x, y, dir, lift) {
    g.save(); g.translate(x, y); g.scale(dir * 1.45, 1.45); soft(g, 0, 3, 70, 7, 0.25);
    fillRR(g, -46, -44, 72, 34, 8, '#FF7A1A'); fillRR(g, -40, -40, 26, 10, 3, '#FFB070'); fillRR(g, -60, -40, 18, 30, 4, '#5C6B7A');
    g.strokeStyle = '#1E2A33'; g.lineWidth = 4; g.beginPath(); g.moveTo(-34, -44); g.lineTo(-30, -96); g.lineTo(10, -96); g.lineTo(16, -44); g.stroke(); fillRR(g, -36, -100, 52, 6, 3, '#1E2A33');
    fillE(g, -12, -62, 9, 9, '#F1C6A0'); fillRR(g, -22, -54, 20, 14, 5, '#1FA463'); fillE(g, -12, -70, 10, 5, '#FFC93C');
    fillRR(g, 28, -110, 6, 104, 2, '#5C6B7A'); var fy = -14 - lift * 26; fillRR(g, 30, fy, 46, 5, 2, '#5C6B7A');
    fillRR(g, 32, fy - 8, 42, 8, 2, '#B98E62'); for (var i = 0; i < 2; i++) fillRR(g, 34 + i * 20, fy - 34, 18, 26, 3, i ? '#3A93C0' : '#FFC93C');
    fillE(g, -32, -6, 11, 11, '#1E2A33'); fillE(g, 12, -6, 9, 9, '#1E2A33'); fillE(g, -32, -6, 4, 4, '#8A97A6'); fillE(g, 12, -6, 3.5, 3.5, '#8A97A6');
    g.restore();
  }
  function exFore(g, t, S) {
    var ext = S.ext, tt = flT(t), p = flX(tt), d = t - FL.toot, on = d >= 0 && d < 2.6;
    if (p.x > ext.l - 90 && p.x < ext.r + 90) { forklift(g, p.x, FL.y, p.dir, on ? Math.sin(Math.min(1, d / 1.3) * Math.PI) : 0);
      fillE(g, p.x - p.dir * 49, FL.y - 151, 3.5, 3.5, Math.floor(t * 3) % 2 ? '#FF7A1A' : '#FFD08A');
      if (on) { fillRR(g, p.x - 30, FL.y - 196, 60, 20, 8, '#FFFFFF'); text(g, 'toot toot', p.x, FL.y - 182, 8.5, 800, '#FF7A1A', 'center'); } }
    if (ext.r > 970) { var px = 950, py = 648; soft(g, px, py + 3, 52, 6, 0.24); fillRR(g, px - 46, py - 12, 92, 12, 2, '#B98E62'); g.fillStyle = '#8E6A44'; for (var i = 0; i < 3; i++) g.fillRect(px - 42 + i * 38, py - 12, 8, 12);
      fillRR(g, px - 42, py - 92, 84, 80, 4, 'rgba(210,225,235,.92)'); g.strokeStyle = 'rgba(255,255,255,.8)'; g.lineWidth = 2; for (var w = 0; w < 4; w++) { g.beginPath(); g.moveTo(px - 42, py - 80 + w * 18); g.lineTo(px + 42, py - 72 + w * 18); g.stroke(); }
      fillRR(g, px - 18, py - 64, 36, 22, 3, '#FFFFFF'); text(g, 'FG', px, py - 49, 10, 800, '#2F6B7A', 'center'); }
  }
  function exHit(x, y, S, t) { if (t - FL.toot < 2.6) return false; var tt = flT(t), p = flX(tt); if (Math.abs(x - p.x) < 100 && y > FL.y - 170 && y < FL.y + 10) { FL.paid = t - tt; FL.toot = t; return true; } return false; }
  (function (W) { var pb = W.paintBack, pf = W.paintForeLive, h0 = W.hit;
    W.paintBack = function (g, ext) { exFloor(g, ext); pb(g, ext); };
    W.paintForeLive = function (g, t, S) { exFore(g, t, S); pf(g, t, S); };
    W.hit = function (x, y, S, t, onBtn) { if (!onBtn && exHit(x, y, S, t)) return null; return h0 ? h0(x, y, S, t, onBtn) : null; };
  })(window.IXW.worlds.manufacturing);
})(window.IXW && window.IXW.kit);
