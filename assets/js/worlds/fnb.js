/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: fnb (/industries/fnb) — Lantern Kitchen, a sample restaurant group, drawn as its DINING ROOM AND OPEN KITCHEN on a
   busy evening. Deep green tiled walls, a warm wood dado, a tiled floor. Left to right: the lantern sign; produce crates in
   from the supplier with their par-level sticker (Purchase); insulated boxes of prepared sauces bound for outlet 2
   (Inventory transfers); the open kitchen pass with heat lamps, the ticket rail and the kitchen display above it
   (POS kitchen display), Marco at the stove behind it with the central kitchen's stockpot steaming (Manufacturing,
   recipes) and a wok that flares when tapped; the pass bell (tap it); a dining table with its QR self-order stand under
   the chalkboard menu (Restaurant POS); the host stand with the till where the night's takings close (Accounting).
   Staff: Marco, head chef (sample); Aisha, server, with a tray (sample). */
(function (K) {
  'use strict';
  if (!K) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed;
  var F = 470;
  var T = {
    sign: { x: 186, y: 44, w: 176, h: 62 }, crates: { x: 190, y: 470 }, boxes: { x: 272, y: 470 },
    pass: { x: 340, y: 300, w: 300 }, rail: { x: 352, y: 150, w: 150 }, kds: { x: 470, y: 52, w: 110, h: 74 }, pot: { x: 360, y: 300 }, wok: { x: 520, y: 300 }, bell: { x: 600, y: 300 },
    board: { x: 716, y: 64, w: 150, h: 112 }, table: { x: 744, y: 380, w: 130 }, qr: { x: 788, y: 380 }, host: { x: 900, y: 300, w: 92 }, lamps: [770, 850]
  };
  var C = { green: '#1F4D3F', greenL: '#2F6B57', wood: '#A9744A', woodD: '#7E5233', tomato: '#E2553D', mustard: '#E9B949', herb: '#7CB342', cream: '#FFF6E5', brass: '#C9A44A', steel: '#C9D1DB', chalk: '#263238', ink: '#1E2B26' };
  function tiles(g, W, ry, k, sx, sy) { g.strokeStyle = 'rgba(255,255,255,.10)'; g.lineWidth = 1.4 * k; var th = 16 * k, tw = 34 * k, r = 0;
    for (var y = (sy % th) - th; y < ry; y += th, r++) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); for (var x = (sx % tw) + (r % 2 ? tw / 2 : 0) - tw; x < W; x += tw) { g.moveTo(x, y); g.lineTo(x, y + th); } g.stroke(); } }
  var ROOM = { wall: ['#1F4D3F', '#245A49'], wains: ['#A9744A', '#93633E'], rail: '#C9A44A', base: '#6F4A2E', floor: ['#EADBC4', '#D7C0A0'], floorKind: 'tiles', floorLine: 'rgba(120,80,40,.16)',
    panelLine: 'rgba(60,30,10,.18)', pattern: tiles, wainsH: 120 };


  /* ---------------- beyond the frame: the rest of the restaurant (ext = the whole hero in set units) ----------------
     Far left: the bar with its espresso machine, the barista and bar stools, shelves of jars and bottles under lanterns.
     Behind the copy: two more tables with diners. Right: the entrance and a guest waiting. Foreground: a delivery rider at
     the takeaway shelf, a second server walking. */
  var BAR = -760, TABS = [-470, -200];
  function lantern(g, x, y) { g.fillStyle = '#2B3A33'; g.fillRect(x - 1, 0, 2, y - 14); fillRR(g, x - 12, y - 16, 24, 32, 8, C.tomato); fillRR(g, x - 8, y - 20, 16, 6, 3, C.brass); fillRR(g, x - 8, y + 14, 16, 5, 2, C.brass); fillE(g, x, y, 5, 8, '#FFD27A'); }
  /* a bentwood chair in profile: side -1 = its back on the left */
  function chair(g, x, side, s) { s = s || 1; g.save(); g.translate(x, F); g.scale(side * s, s);
    g.strokeStyle = C.woodD; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.moveTo(-14, -52); g.lineTo(-18, 0); g.moveTo(14, -52); g.lineTo(18, 0); g.moveTo(-14, -52); g.quadraticCurveTo(-24, -100, -16, -128); g.stroke();
    g.lineWidth = 3.5; g.beginPath(); g.moveTo(-15, -26); g.lineTo(15, -26); g.moveTo(-18, -86); g.quadraticCurveTo(-8, -84, -6, -60); g.stroke();
    fillRR(g, -20, -58, 42, 9, 4, C.wood); g.restore(); }
  function banquette(g, x0, x1) { fillRR(g, x0, 318, x1 - x0, 96, 18, '#B8432F'); g.fillStyle = 'rgba(0,0,0,.10)';
    for (var bx = x0 + 34; bx < x1 - 20; bx += 44) { g.fillRect(bx, 330, 3, 76); fillE(g, bx + 1.5, 352, 3, 3, 'rgba(0,0,0,.18)'); fillE(g, bx + 1.5, 384, 3, 3, 'rgba(0,0,0,.18)'); }
    fillRR(g, x0 - 6, 404, x1 - x0 + 12, 22, 8, '#C9503A'); fillRR(g, x0 - 6, 424, x1 - x0 + 12, F - 424, 4, '#6F2E22'); }
  function frame(g, x, y, w, h, kind) { fillRR(g, x - 5, y - 5, w + 10, h + 10, 3, C.brass); fillRR(g, x, y, w, h, 2, kind ? '#F3E3C4' : '#E9D3B0');
    if (kind) { fillE(g, x + w / 2, y + h * 0.62, w * 0.34, h * 0.16, '#FFFFFF'); fillE(g, x + w / 2, y + h * 0.56, w * 0.24, h * 0.13, C.mustard); fillE(g, x + w / 2 - 6, y + h * 0.5, 4, 3, C.herb); fillE(g, x + w / 2 + 6, y + h * 0.53, 4, 3, C.tomato); }
    else { fillE(g, x + w / 2, y + h * 0.55, w * 0.28, h * 0.3, C.tomato); g.fillStyle = C.brass; g.fillRect(x + w / 2 - w * 0.1, y + h * 0.2, w * 0.2, h * 0.08); fillE(g, x + w / 2, y + h * 0.55, w * 0.12, h * 0.16, '#FFD27A'); } }
  function wideBack(g, ext) {
    if (ext.t < -26) { /* a cream ceiling with a wood cornice: the site header stays readable over the dark tiles */
      g.fillStyle = '#F4EBDD'; g.fillRect(ext.l, ext.t, ext.r - ext.l, -26 - ext.t); fillRR(g, ext.l, -30, ext.r - ext.l, 10, 0, C.wood); g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(ext.l, -20, ext.r - ext.l, 4);
      g.fillStyle = 'rgba(169,116,74,.18)'; for (var bm = Math.floor(ext.l / 120) * 120; bm < ext.r; bm += 120) g.fillRect(bm, ext.t, 10, -30 - ext.t);
      var fy = Math.max(ext.t + 40, -150); g.strokeStyle = '#5C4632'; g.lineWidth = 1.4; g.beginPath();
      for (var fx = ext.l; fx <= ext.r; fx += 10) { var sg = Math.abs(Math.sin(((fx - ext.l) / 260) * Math.PI)) * 34; if (fx === ext.l) g.moveTo(fx, fy + sg); else g.lineTo(fx, fy + sg); } g.stroke();
      for (var bx2 = ext.l + 20, n = 0; bx2 < ext.r; bx2 += 40, n++) { var sg2 = Math.abs(Math.sin(((bx2 - ext.l) / 260) * Math.PI)) * 34; g.fillStyle = 'rgba(255,214,140,.25)'; g.beginPath(); g.arc(bx2, fy + sg2 + 8, 11, 0, 7); g.fill(); fillE(g, bx2, fy + sg2 + 8, 4.5, 6, '#FFD27A'); }
      for (var cf = Math.floor(ext.l / 420) * 420 + 210; cf < ext.r; cf += 420) { if (cf > 160 && cf < 1000) continue; g.fillStyle = '#5C4632'; g.fillRect(cf - 2, Math.max(ext.t, -260), 4, -60 - Math.max(ext.t, -260)); fillRR(g, cf - 14, -64, 28, 14, 6, C.wood); fillE(g, cf - 46, -56, 40, 5, C.woodD); fillE(g, cf + 46, -56, 40, 5, C.woodD); } }
    if (ext.l < BAR + 300) { /* shelves of jars and bottles, lanterns, the bar back */
      for (var sh = 0; sh < 2; sh++) { var sy = 150 + sh * 70; fillRR(g, BAR - 110, sy, 320, 8, 3, C.wood);
        for (var j = 0; j < 9; j++) { var jx = BAR - 100 + j * 34, tall = (j + sh) % 3; if (tall === 0) { fillRR(g, jx, sy - 34, 12, 34, 4, '#4A7A5E'); fillRR(g, jx + 3, sy - 42, 6, 9, 2, '#2B3A33'); }
          else if (tall === 1) { fillRR(g, jx, sy - 24, 22, 24, 6, 'rgba(255,240,210,.9)'); fillRR(g, jx + 3, sy - 16, 16, 14, 4, j % 2 ? C.tomato : C.mustard); } else { fillRR(g, jx, sy - 28, 14, 28, 5, '#8E5A2E'); fillRR(g, jx + 4, sy - 36, 6, 9, 2, C.brass); } } }
      lantern(g, BAR - 60, 96); lantern(g, BAR + 110, 96);
    }
    if (ext.l < TABS[1] + 160) { banquette(g, TABS[0] - 40, TABS[1] + 160); [[TABS[0] + 30, 1], [TABS[0] + 165, 0], [TABS[1] + 30, 1]].forEach(function (f, i) { frame(g, f[0], 150 + (i % 2) * 14, 60, 74, f[1]); }); }
    TABS.forEach(function (tx, i) { if (tx + 140 < ext.l) return; /* more tables under their lamps (diners are live) */
      g.save(); var gl = g.createRadialGradient(tx + 60, 260, 4, tx + 60, 320, 110); gl.addColorStop(0, 'rgba(255,214,140,.3)'); gl.addColorStop(1, 'rgba(255,214,140,0)'); g.fillStyle = gl; g.fillRect(tx - 60, 220, 240, 200); g.restore();
      g.fillStyle = '#2B3A33'; g.fillRect(tx + 59, 0, 2, 220); g.fillStyle = C.brass; g.beginPath(); g.moveTo(tx + 40, 242); g.quadraticCurveTo(tx + 42, 218, tx + 60, 218); g.quadraticCurveTo(tx + 78, 218, tx + 80, 242); g.closePath(); g.fill(); fillE(g, tx + 60, 244, 9, 5, '#FFE7B0');
      soft(g, tx + 60, F + 4, 90, 8, 0.3); });
    if (ext.r > 1000) { /* the entrance: a glass door onto the street, a menu easel */
      var dx = 1016; fillRR(g, dx - 8, 150, 180, 320, 6, C.woodD); fillRR(g, dx, 160, 164, 306, 4, '#203A4A');
      var sk = g.createLinearGradient(0, 160, 0, 466); sk.addColorStop(0, '#2E4A6B'); sk.addColorStop(1, '#1C2E40'); g.fillStyle = sk; g.fillRect(dx + 6, 166, 74, 294); g.fillRect(dx + 84, 166, 74, 294);
      for (var l = 0; l < 6; l++) { fillE(g, dx + 18 + l * 26, 200 + (l % 2) * 14, 5, 7, '#FFD27A'); g.fillStyle = 'rgba(255,210,122,.18)'; g.beginPath(); g.arc(dx + 18 + l * 26, 200 + (l % 2) * 14, 16, 0, 7); g.fill(); }
      fillRR(g, dx + 54, 260, 56, 24, 5, C.tomato); text(g, 'OPEN', dx + 82, 277, 11, 800, '#FFFFFF', 'center'); fillRR(g, dx + 68, 330, 6, 40, 3, C.brass); fillRR(g, dx + 90, 330, 6, 40, 3, C.brass);
      g.fillStyle = 'rgba(255,255,255,.1)'; g.beginPath(); g.moveTo(dx + 10, 460); g.lineTo(dx + 70, 166); g.lineTo(dx + 96, 166); g.lineTo(dx + 36, 460); g.closePath(); g.fill();
      var ex = 1216; g.strokeStyle = C.woodD; g.lineWidth = 4; g.beginPath(); g.moveTo(ex - 20, F); g.lineTo(ex, 360); g.lineTo(ex + 20, F); g.stroke(); fillRR(g, ex - 30, 366, 60, 70, 4, C.chalk);
      text(g, 'TODAY', ex, 384, 7.5, 800, '#F3EBDD', 'center'); text(g, 'Laksa', ex, 402, 7, 700, '#FFD27A', 'center'); text(g, 'Kaya toast', ex, 418, 7, 700, '#FFD27A', 'center');
    }
  }
  function diner(x, y, ph, col, hair, hs) { return { x: x, y: y, s: 0.44, ph: ph, c: { skin: ['#F3CDA8', '#8D5A3B', '#E8B48F', '#B9845F', '#6B4329', '#C68B5E'][Math.round(ph * 3) % 6], hair: hair, top: col }, outfit: 'tee', hairStyle: hs, short: true, feet: false, mood: 'happy', look: 0, talk: false, hands: [[-70, -180], [70, -180]] }; }
  var DINERS = [diner(-458, 446, 0.2, '#7FA8C9', '#2B1D16', 'long'), diner(-362, 446, 1.3, C.mustard, '#A9A9A9', 'bald'), diner(-140, 446, 0.8, '#C9A7E0', '#2B1D16', 'pony')];
  DINERS[1].glasses = true; DINERS[1].build = 1.15; DINERS[2].hijab = '#2F6B57';
  /* seated on the banquette: legs and feet show under the tablecloth (the floor is F; the body keeps its height) */
  DINERS.forEach(function (P) { P.sit = true; P.chair = false; P.sitDrop = -(F - P.y) / P.s; P.y = F; P.c.low = P.c.low || '#3D405B'; P.c.shoe = P.c.shoe || '#2B1D16'; });
  /* the front row: two more tables nearer the camera, two guests each (drawn live: guest, then the table in front) */
  var FTABS = [-660, 1020], FY = 650;
  var FRONT = [diner(-636, FY - 22, 1.9, C.tomato, '#1F1A1A', 'short'), diner(-526, FY - 22, 2.7, '#F2EFE8', '#4A2E22', 'curly'), diner(1044, FY - 22, 0.5, '#7FA8C9', '#1F1A1A', 'buzz'), diner(1154, FY - 22, 1.6, C.mustard, '#2B1D16', 'long')];
  FRONT.forEach(function (P) { P.s = 0.56; P.sit = true; P.chair = false; P.sitDrop = -22 / 0.56; P.y = FY; P.c.low = '#3D405B'; P.c.shoe = '#2B1D16'; }); FRONT[0].beard = '#1F1A1A'; FRONT[2].glasses = true;
  function frontRow(g, t, S) { var ext = S.ext;
    FRONT.forEach(function (P, i) { if (P.x < ext.l - 60 || P.x > ext.r + 60) return; g.strokeStyle = C.woodD; g.lineCap = 'round'; g.lineWidth = 7; g.beginPath(); g.moveTo(P.x - 58, FY); g.lineTo(P.x - 58, P.y - 22 - 236); g.quadraticCurveTo(P.x, P.y - 22 - 262, P.x + 58, P.y - 22 - 236); g.lineTo(P.x + 58, FY); g.stroke();
      g.lineWidth = 5; g.beginPath(); g.moveTo(P.x - 56, P.y - 22 - 196); g.quadraticCurveTo(P.x, P.y - 22 - 214, P.x + 56, P.y - 22 - 196); g.stroke(); fillRR(g, P.x - 66, P.y - 22 - 66, 132, 14, 6, C.wood); fillRR(g, P.x - 62, P.y - 22 - 76, 124, 12, 6, '#B8432F');
      P.talk = ((t + i * 2.1) % 6) < 1.8; P.look = Math.sin(t * 0.6 + i * 1.7) * 0.7; P.hands = [[-70, -190 + Math.abs(Math.sin(t * 1.8 + i)) * 12], [70, -190]]; K.person(g, P, t); });
    FTABS.forEach(function (tx, i) { if (tx + 170 < ext.l || tx > ext.r) return; var w = 150, ty = FY - 92; soft(g, tx + w / 2, FY + 6, 100, 10, 0.3);
      g.fillStyle = C.woodD; g.fillRect(tx + w / 2 - 6, ty + 56, 12, FY - ty - 58); fillRR(g, tx + w / 2 - 40, FY - 10, 80, 10, 4, C.woodD);
      fillRR(g, tx - 6, ty, w + 12, 12, 5, '#FFFDF6'); g.fillStyle = '#FFFDF6'; g.beginPath(); g.moveTo(tx - 6, ty + 6); g.lineTo(tx + w + 6, ty + 6); g.lineTo(tx + w + 10, ty + 58); for (var sc = tx + w + 10; sc > tx - 10; sc -= 18) g.quadraticCurveTo(sc - 9, ty + 66, sc - 18, ty + 58); g.closePath(); g.fill();
      g.strokeStyle = 'rgba(226,85,61,.35)'; g.lineWidth = 2.4; g.beginPath(); g.moveTo(tx, ty + 48); g.lineTo(tx + w, ty + 48); g.stroke();
      fillE(g, tx + 36, ty - 2, 20, 5, '#FFFFFF'); fillE(g, tx + 36, ty - 5, 13, 4.5, [C.tomato, C.herb][i]); fillE(g, tx + 114, ty - 2, 20, 5, '#FFFFFF'); fillE(g, tx + 114, ty - 5, 13, 4.5, [C.mustard, C.tomato][i]);
      fillRR(g, tx + 70, ty - 24, 10, 22, 3, 'rgba(190,225,240,.85)'); fillE(g, tx + 90, ty - 6, 6, 6, '#FFD27A'); }); }
  var BARISTA = { x: BAR + 40, y: 452, s: 0.5, ph: 0.4, c: { skin: '#E8B48F', hair: '#2B1D16', top: '#2B3A33' }, outfit: 'tee', apron: '#8E5A2E', hairStyle: 'pony', clipCol: C.mustard, feet: false, mood: 'happy', look: 0.3, talk: false, hands: [[-62, -186], [62, -186]] };
  var WALK = [{ x0: -900, x1: -300, y: 490, spd: 26, ph: 0.3, P: { s: 0.48, ph: 0.9, c: { skin: '#C68B5E', hair: '#1F1A1A', top: '#2B3A33', low: '#2B3A33', shoe: '#F7F8FB' }, outfit: 'tee', apron: C.mustard, hairStyle: 'short', beard: '#1F1A1A', short: true, hold: 'tray', mood: 'happy', look: 0, hands: [[-84, -330], [70, -160]] } },
    { front: true, x0: -900, x1: -280, y: 740, spd: 12, ph: 0.55, P: { s: 0.5, ph: 1.7, c: { skin: '#B9845F', hair: '#1F1A1A', top: '#22A88A', low: '#2B3A33', shoe: '#2B3A33', hat: '#22A88A', hatBand: '#FFFFFF' }, outfit: 'tee', hat: 'cap', backpack: '#E9B949', hairStyle: 'short', short: true, hold: 'bags', mood: 'calm', look: 0, hands: [[-74, -150], [70, -150]] } },
    { x0: 1010, x1: 1320, y: 490, spd: 20, ph: 0.15, P: { s: 0.48, ph: 2.4, c: { skin: '#6B4329', hair: '#4A2E22', top: '#7B5BD6', low: '#2B3A33', shoe: '#F7F8FB' }, outfit: 'tee', hairStyle: 'curly', hold: 'bags', mood: 'happy', look: 0, hands: [[-74, -150], [70, -150]] } }];
  function wideLive(g, t, S) {
    var ext = S.ext;
    DINERS.forEach(function (P, i) { if (P.x < ext.l - 40) return; P.talk = ((t + i * 1.7) % 5) < 1.6; P.look = Math.sin(t * 0.7 + i) * 0.6; P.hands = [[-70, -186 + Math.abs(Math.sin(t * 2 + i)) * 10], [70, -186]]; K.person(g, P, t); });
    if (ext.l < BAR + 300) { BARISTA.hands = [[-62, -200 + Math.abs(Math.sin(t * 3)) * 18], [70 + Math.sin(t * 2) * 10, -200]]; K.person(g, BARISTA, t);
      var ph = (t % 2.2) / 2.2; for (var s2 = 0; s2 < 3; s2++) { var q = (ph + s2 / 3) % 1; g.fillStyle = 'rgba(255,255,255,' + (0.4 * (1 - q)).toFixed(2) + ')'; g.beginPath(); g.arc(BAR + 140 + Math.sin(t * 2 + s2) * 4, 300 - q * 60, 5 + q * 7, 0, 7); g.fill(); } }
    crew(g, t, S, false);
  }
  function crew(g, t, S, front) { var ext = S.ext;
    WALK.slice().sort(function (a, b) { return a.y - b.y; }).forEach(function (w) { var L = (w.front || w.y >= 560) ? 'fore' : w.y > 470; if (L !== front) return; var a = Math.max(w.x0, ext.l + 30), b = Math.min(w.x1, ext.r - 40); if (b - a < 60) return; K.walker(g, { x0: a, x1: b, y: w.y, spd: w.spd, ph: w.ph, P: w.P }, t); }); }
  function bigPlant(g, x, y, s) { g.save(); g.translate(x, y); g.scale(s, s); soft(g, 0, 4, 60, 9, 0.3);
    for (var l = 0; l < 9; l++) { var a = -Math.PI / 2 + (l - 4) * 0.2; g.save(); g.translate(0, -54); g.rotate(a + Math.PI / 2); g.fillStyle = l % 2 ? '#3F8F5E' : '#2F7A4E'; g.beginPath(); g.ellipse(0, -66, 16, 62, 0, 0, Math.PI * 2); g.fill(); g.restore(); }
    fillRR(g, -34, -62, 68, 62, 10, '#C96F4A'); fillRR(g, -38, -66, 76, 12, 6, '#D98560'); g.restore(); }
  function wideFront(g, ext) {
    if (ext.l < BAR + 300) { /* the bar counter, the espresso machine, stools */
      fillRR(g, BAR - 110, 330, 320, 12, 4, C.wood); fillRR(g, BAR - 104, 342, 308, F - 342, 6, '#13332A'); g.strokeStyle = C.brass; g.lineWidth = 2; g.beginPath(); g.moveTo(BAR - 104, 440); g.lineTo(BAR + 204, 440); g.stroke();
      text(g, 'COFFEE & TEA', BAR + 50, 390, 11, 800, '#FFE7B0', 'center');
      fillRR(g, BAR + 110, 282, 70, 50, 6, '#C9D1DB'); fillRR(g, BAR + 116, 288, 58, 14, 3, '#8A949E'); fillRR(g, BAR + 132, 304, 10, 14, 2, '#5C6670'); fillRR(g, BAR + 150, 304, 10, 14, 2, '#5C6670'); fillRR(g, BAR + 130, 322, 14, 8, 2, '#FFFFFF');
      for (var c = 0; c < 3; c++) { fillRR(g, BAR - 80 + c * 22, 316, 14, 14, 3, '#FFFFFF'); }
      [BAR - 70, BAR + 10, BAR + 90].forEach(function (sx) { fillRR(g, sx - 16, 420, 32, 10, 5, C.tomato); g.fillStyle = '#2B3A33'; g.fillRect(sx - 2, 430, 4, F - 432); fillRR(g, sx - 12, F - 4, 24, 4, 2, '#2B3A33'); });
    }
    TABS.forEach(function (tx, i) { if (tx + 140 < ext.l) return;
      chair(g, tx - 22, -1, 0.9); chair(g, tx + 142, 1, 0.9);
      g.fillStyle = C.woodD; g.fillRect(tx + 55, 430, 10, F - 432); fillRR(g, tx + 26, F - 8, 68, 8, 3, C.woodD);
      fillRR(g, tx - 4, 380, 128, 10, 4, '#FFFDF6'); g.fillStyle = '#FFFDF6'; g.beginPath(); g.moveTo(tx - 4, 386); g.lineTo(tx + 124, 386); g.lineTo(tx + 128, 432); for (var sc = tx + 128; sc > tx - 8; sc -= 16) g.quadraticCurveTo(sc - 8, 438, sc - 16, 432); g.closePath(); g.fill();
      g.fillStyle = 'rgba(160,120,80,.12)'; g.fillRect(tx - 4, 386, 132, 4); g.strokeStyle = 'rgba(226,85,61,.35)'; g.lineWidth = 2; g.beginPath(); g.moveTo(tx, 422); g.lineTo(tx + 120, 422); g.stroke();
      fillE(g, tx + 30, 378, 16, 4, '#FFFFFF'); fillE(g, tx + 30, 376, 10, 3.5, [C.mustard, C.tomato, C.herb][i % 3]); fillE(g, tx + 88, 378, 16, 4, '#FFFFFF'); fillE(g, tx + 88, 376, 10, 3.5, [C.herb, C.mustard, C.tomato][i % 3]);
      fillRR(g, tx + 56, 362, 8, 16, 2, 'rgba(190,225,240,.85)'); fillRR(g, tx + 70, 368, 6, 10, 2, C.tomato); });
  }

  function crate(g, x, y, w, h) { fillRR(g, x, y, w, h, 3, '#C99A6B'); g.fillStyle = '#A87A4C'; g.fillRect(x, y + h * 0.35, w, 3); g.fillRect(x, y + h * 0.7, w, 3); g.fillRect(x + 4, y, 4, h); g.fillRect(x + w - 8, y, 4, h); }

  /* ---------------- static back props (set units) ---------------- */
  function paintBack(g, ext) {
    wideBack(g, ext);
    /* the lantern sign: Lantern Kitchen, a sample restaurant group */
    var sg = T.sign; shadowed(g, 16, 5, 0.3, function () { fillRR(g, sg.x, sg.y, sg.w, sg.h, 12, '#13332A'); }); g.strokeStyle = C.brass; g.lineWidth = 2; rr(g, sg.x + 4, sg.y + 4, sg.w - 8, sg.h - 8, 9); g.stroke();
    fillRR(g, sg.x + 16, sg.y + 16, 22, 30, 8, C.tomato); fillRR(g, sg.x + 20, sg.y + 12, 14, 6, 3, C.brass); fillRR(g, sg.x + 20, sg.y + 44, 14, 5, 2, C.brass); fillE(g, sg.x + 27, sg.y + 31, 6, 8, '#FFD27A');
    text(g, 'Lantern Kitchen', sg.x + 46, sg.y + 31, 12, 800, '#FFF1D6'); text(g, 'SAMPLE RESTAURANT', sg.x + 46, sg.y + 46, 7.5, 700, '#C9A44A');
    /* produce crates from the supplier, the par-level sticker */
    var cr = T.crates; soft(g, cr.x + 36, F + 4, 44, 7, 0.3);
    crate(g, cr.x, F - 40, 72, 40); crate(g, cr.x + 4, F - 76, 64, 36);
    for (var i = 0; i < 5; i++) fillE(g, cr.x + 12 + i * 12, F - 44, 6.5, 6, C.tomato); for (var j = 0; j < 4; j++) fillE(g, cr.x + 14 + j * 14, F - 80, 8, 6, C.herb);
    fillRR(g, cr.x + 40, F - 30, 26, 14, 3, '#FFFFFF'); text(g, 'PAR 40', cr.x + 53, F - 20, 6, 800, C.green, 'center');
    /* insulated boxes of prepared sauces for outlet 2, on a dolly */
    var bx = T.boxes; soft(g, bx.x + 30, F + 4, 36, 7, 0.3); fillRR(g, bx.x, F - 10, 60, 8, 3, '#7E8A96'); fillE(g, bx.x + 8, F - 2, 4, 4, C.ink); fillE(g, bx.x + 52, F - 2, 4, 4, C.ink);
    fillRR(g, bx.x + 4, F - 50, 52, 40, 5, '#2F7FA8'); fillRR(g, bx.x + 6, F - 86, 48, 36, 5, '#3A93C0'); fillRR(g, bx.x + 4, F - 54, 52, 6, 2, '#256A8E'); fillRR(g, bx.x + 6, F - 90, 48, 6, 2, '#2F7FA8');
    fillRR(g, bx.x + 12, F - 40, 36, 16, 3, '#FFFFFF'); text(g, '→ OUTLET 2', bx.x + 30, F - 29, 5.8, 800, C.ink, 'center');
    /* the chalkboard menu */
    var bd = T.board; shadowed(g, 14, 5, 0.3, function () { fillRR(g, bd.x - 6, bd.y - 6, bd.w + 12, bd.h + 12, 6, C.wood); }); fillRR(g, bd.x, bd.y, bd.w, bd.h, 3, C.chalk);
    text(g, 'TONIGHT', bd.x + bd.w / 2, bd.y + 18, 10, 800, '#F3EBDD', 'center'); g.strokeStyle = 'rgba(243,235,221,.4)'; g.lineWidth = 1; g.setLineDash([2, 3]); g.beginPath(); g.moveTo(bd.x + 14, bd.y + 25); g.lineTo(bd.x + bd.w - 14, bd.y + 25); g.stroke(); g.setLineDash([]);
    [['Laksa', '14'], ['Chilli crab bun', '12'], ['Kaya toast', '6'], ['Iced kopi', '4']].forEach(function (m, n) { text(g, m[0], bd.x + 14, bd.y + 44 + n * 17, 8.5, 700, '#F3EBDD'); text(g, m[1], bd.x + bd.w - 14, bd.y + 44 + n * 17, 8.5, 800, '#FFD27A', 'right'); });
    /* the kitchen display on the wall (its tickets are live) */
    var kd = T.kds; shadowed(g, 16, 6, 0.35, function () { fillRR(g, kd.x, kd.y, kd.w, kd.h, 6, '#0F1C17'); }); fillRR(g, kd.x + 4, kd.y + 4, kd.w - 8, kd.h - 8, 3, '#18302A');
    text(g, 'KITCHEN', kd.x + 8, kd.y + 14, 6.5, 800, '#9FD9B8');
    /* the ticket rail above the pass */
    var rl = T.rail; fillRR(g, rl.x - 4, rl.y, rl.w + 8, 7, 3, C.steel); fillRR(g, rl.x - 4, rl.y, rl.w + 8, 2.5, 1, '#E8EDF2');
    /* heat lamps over the pass */
    [400, 480, 560].forEach(function (lx) { g.fillStyle = '#8A949E'; g.fillRect(lx - 1, 0, 2, 196); g.fillStyle = '#5C6670'; g.beginPath(); g.moveTo(lx - 16, 212); g.lineTo(lx - 8, 196); g.lineTo(lx + 8, 196); g.lineTo(lx + 16, 212); g.closePath(); g.fill(); });
    /* the stove behind the pass (the pot's steam and the wok's flame are live) */
    var ps = T.pass; fillRR(g, ps.x + 6, ps.y - 30, ps.w - 12, 32, 4, '#3A4650');
    /* the host stand (the till is on it) */
    var hs = T.host; soft(g, hs.x + hs.w / 2, F + 4, hs.w * 0.6, 8, 0.3);
    /* the dining table under its pendant lamps */
    T.lamps.forEach(function (lx) { g.save(); var gl = g.createRadialGradient(lx, 230, 4, lx, 300, 120); gl.addColorStop(0, 'rgba(255,214,140,.35)'); gl.addColorStop(1, 'rgba(255,214,140,0)'); g.fillStyle = gl; g.fillRect(lx - 130, 200, 260, 200); g.restore();
      g.fillStyle = '#2B3A33'; g.fillRect(lx - 1, 0, 2, 214); g.fillStyle = C.brass; g.beginPath(); g.moveTo(lx - 20, 236); g.quadraticCurveTo(lx - 18, 212, lx, 212); g.quadraticCurveTo(lx + 18, 212, lx + 20, 236); g.closePath(); g.fill(); fillE(g, lx, 238, 9, 5, '#FFE7B0'); });
    var tb = T.table; soft(g, tb.x + tb.w / 2, F + 4, tb.w * 0.6, 9, 0.3);
    g.fillStyle = C.woodD; g.fillRect(tb.x + tb.w / 2 - 5, tb.y + 10, 10, F - tb.y - 12); fillRR(g, tb.x + tb.w / 2 - 34, F - 8, 68, 8, 3, C.woodD);
    chair(g, tb.x - 18, -1, 0.9); chair(g, tb.x + tb.w + 18, 1, 0.9);
    fillRR(g, tb.x, tb.y, tb.w, 12, 5, C.wood); g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(tb.x + 6, tb.y + 2, tb.w - 12, 2);
    fillE(g, tb.x + 34, tb.y - 2, 20, 5, '#FFFFFF'); fillE(g, tb.x + 34, tb.y - 5, 12, 5, '#E9B949'); fillRR(g, tb.x + 96, tb.y - 20, 12, 20, 3, 'rgba(190,225,240,.85)');
    var q = T.qr; fillRR(g, q.x + 24, q.y - 34, 26, 34, 3, '#FFFFFF'); g.fillStyle = C.ink; for (var qi = 0; qi < 16; qi++) if (hash(qi * 3.3) > 0.45) g.fillRect(q.x + 27 + (qi % 4) * 5, q.y - 31 + Math.floor(qi / 4) * 5, 4.4, 4.4);
    fillRR(g, q.x + 26, q.y - 8, 22, 6, 2, C.tomato);
  }

  /* ---------------- static front props: the pass and the host stand (over the chef) ---------------- */
  function paintFront(g, ext) {
    wideFront(g, ext);
    var ps = T.pass; fillRR(g, ps.x, ps.y, ps.w, 12, 4, C.steel); g.fillStyle = '#E8EDF2'; g.fillRect(ps.x + 4, ps.y + 2, ps.w - 8, 2.5);
    fillRR(g, ps.x + 6, ps.y + 12, ps.w - 12, F - ps.y - 12, 6, C.wood); g.save(); rr(g, ps.x + 6, ps.y + 12, ps.w - 12, F - ps.y - 12, 6); g.clip();
    g.fillStyle = 'rgba(0,0,0,.10)'; for (var pl = ps.x + 26; pl < ps.x + ps.w; pl += 36) g.fillRect(pl, ps.y + 12, 4, F - ps.y); g.fillStyle = C.woodD; g.fillRect(ps.x, F - 14, ps.w, 14); g.restore();
    fillRR(g, ps.x + 90, ps.y + 44, 120, 30, 6, '#13332A'); g.strokeStyle = C.brass; g.lineWidth = 1.6; rr(g, ps.x + 93, ps.y + 47, 114, 24, 4); g.stroke(); text(g, 'OPEN KITCHEN', ps.x + 150, ps.y + 63, 9.5, 800, '#FFE7B0', 'center');
    fillRR(g, ps.x + 120, ps.y - 6, 32, 7, 3, '#FFFFFF'); fillE(g, ps.x + 136, ps.y - 9, 13, 4, '#FFFFFF'); fillE(g, ps.x + 136, ps.y - 11, 8, 3.5, C.tomato);
    /* the pass bell */
    var bl = T.bell; fillRR(g, bl.x - 12, bl.y - 4, 24, 5, 2, '#5C6670');
    /* the host stand with the till */
    var hs = T.host; fillRR(g, hs.x, hs.y, hs.w, 12, 4, C.wood); fillRR(g, hs.x + 6, hs.y + 12, hs.w - 12, F - hs.y - 12, 6, '#13332A'); g.strokeStyle = C.brass; g.lineWidth = 1.6; rr(g, hs.x + 14, hs.y + 30, hs.w - 28, 70, 5); g.stroke();
    text(g, 'PLEASE', hs.x + hs.w / 2, hs.y + 58, 8, 800, '#FFE7B0', 'center'); text(g, 'WAIT TO BE', hs.x + hs.w / 2, hs.y + 70, 8, 800, '#FFE7B0', 'center'); text(g, 'SEATED', hs.x + hs.w / 2, hs.y + 82, 8, 800, '#FFE7B0', 'center');
    fillRR(g, hs.x + 30, hs.y - 8, 12, 9, 2, '#9AA6BC'); fillRR(g, hs.x + 14, hs.y - 54, 52, 48, 6, '#2A3550'); fillRR(g, hs.x + 18, hs.y - 50, 44, 38, 3, '#FFFFFF');
  }

  /* ---------------- live: the tickets, the kitchen display, steam and flame, the bell, the QR ---------------- */
  function paintLive(g, t, now, S) {
    wideLive(g, t, S);
    /* tickets on the rail; on the Cook stop a new one clips on */
    var rl = T.rail, ck = S.hot === 'cook', drop = ck ? clamp((t - (S.ckT || 0)) / 0.6, 0, 1) : 1;
    for (var i = 0; i < 4; i++) { if (i === 3 && !ck) continue; var x = rl.x + 4 + i * 37, dy = i === 3 ? (1 - drop) * -40 : 0, sw = Math.sin(t * 1.7 + i) * 0.04;
      g.save(); g.translate(x + 16, rl.y + 6 + dy); g.rotate(sw); fillRR(g, -4, -3, 8, 6, 1.5, '#8A949E'); fillRR(g, -16, 2, 32, 46, 2, '#FFFDF5');
      text(g, 'T' + [7, 3, 12, 9][i], 0, 13, 7, 800, C.tomato, 'center'); g.fillStyle = '#C9C2B4'; g.fillRect(-11, 19, 22, 2); g.fillRect(-11, 25, 16, 2); g.fillRect(-11, 31, 20, 2); g.fillRect(-11, 37, 12, 2); g.restore(); }
    /* the kitchen display: order tiles, one turning green */
    var kd = T.kds, slot = Math.floor(t / 2.4) % 3;
    for (var k2 = 0; k2 < 3; k2++) { var done = k2 === slot, ox = kd.x + 8 + k2 * 33; fillRR(g, ox, kd.y + 20, 29, 46, 3, done ? '#1FA463' : (k2 === 2 ? '#E9B949' : '#2F6B57'));
      text(g, '#' + (41 + k2), ox + 14.5, kd.y + 31, 6.5, 800, '#FFFFFF', 'center'); g.fillStyle = 'rgba(255,255,255,.55)'; g.fillRect(ox + 4, kd.y + 36, 21, 2); g.fillRect(ox + 4, kd.y + 42, 15, 2); g.fillRect(ox + 4, kd.y + 48, 19, 2);
      if (done) text(g, '✓', ox + 14.5, kd.y + 62, 8, 800, '#FFFFFF', 'center'); }
    /* the stockpot: a central kitchen batch, steaming (more on the Prep stop) */
    var pt = T.pot, pr = S.hot === 'prep'; fillRR(g, pt.x, pt.y - 58, 52, 50, 6, '#AAB4C0'); fillRR(g, pt.x - 4, pt.y - 62, 60, 8, 3, '#8A949E'); fillRR(g, pt.x + 4, pt.y - 48, 44, 8, 3, '#C9D1DB');
    fillRR(g, pt.x + 10, pt.y - 40, 32, 14, 3, '#FFFFFF'); text(g, 'BATCH', pt.x + 26, pt.y - 30.5, 6, 800, C.green, 'center');
    for (var s = 0; s < (pr ? 5 : 3); s++) { var ph = ((t * 0.5 + s / 4) % 1), sx = pt.x + 14 + s * 7 + Math.sin(t * 2 + s) * 5, sy = pt.y - 64 - ph * 70;
      g.fillStyle = 'rgba(255,255,255,' + (0.45 * (1 - ph)).toFixed(2) + ')'; g.beginPath(); g.arc(sx, sy, 6 + ph * 8, 0, 7); g.fill(); }
    /* the wok: a flame, a big toss when tapped */
    var wk = T.wok, tw = S.toy.wok != null ? t - S.toy.wok : 99, fl = tw < 1.4 ? 1 - tw / 1.4 : 0, fh = 10 + Math.sin(t * 18) * 3 + fl * 50;
    g.fillStyle = 'rgba(255,140,40,.85)'; g.beginPath(); g.moveTo(wk.x - 6, wk.y - 34); g.quadraticCurveTo(wk.x + 4, wk.y - 34 - fh * 1.2, wk.x + 22, wk.y - 34 - fh); g.quadraticCurveTo(wk.x + 30, wk.y - 34 - fh * 0.6, wk.x + 46, wk.y - 34); g.closePath(); g.fill();
    g.fillStyle = 'rgba(255,220,90,.9)'; g.beginPath(); g.moveTo(wk.x + 6, wk.y - 34); g.quadraticCurveTo(wk.x + 14, wk.y - 34 - fh * 0.8, wk.x + 22, wk.y - 34 - fh * 0.6); g.quadraticCurveTo(wk.x + 28, wk.y - 34 - fh * 0.4, wk.x + 36, wk.y - 34); g.closePath(); g.fill();
    var lift = tw < 1.4 ? Math.sin(tw / 1.4 * Math.PI) * 14 : 0; g.save(); g.translate(wk.x + 20, wk.y - 34 - lift); g.rotate(tw < 1.4 ? Math.sin(tw * 9) * 0.2 : 0);
    g.fillStyle = '#2B2F33'; g.beginPath(); g.ellipse(0, 0, 28, 10, 0, 0, Math.PI); g.closePath(); g.fill(); g.fillRect(24, -3, 30, 4);
    if (tw < 1.4) for (var n = 0; n < 6; n++) { fillE(g, -14 + n * 6, -8 - Math.sin(tw * 6 + n) * 16 * fl, 3, 3, n % 2 ? C.herb : C.tomato); } g.restore();
    /* the QR stand glows on the Serve stop */
    if (S.hot === 'serve') { var q = T.qr, pulse = 0.5 + 0.5 * Math.sin(t * 5); g.strokeStyle = 'rgba(233,185,73,' + pulse.toFixed(2) + ')'; g.lineWidth = 2.4; rr(g, q.x + 21, q.y - 37, 32, 40, 4); g.stroke(); }
  }

  /* ---------------- live front: the bell, the till ---------------- */
  function paintFrontLive(g, t, S) {
    crew(g, t, S, true);
    var bl = T.bell, tb = S.toy.bell != null ? t - S.toy.bell : 99, sq = tb < 0.25 ? 1 - Math.sin(tb / 0.25 * Math.PI) * 0.25 : 1;
    g.save(); g.translate(bl.x, bl.y - 4); g.scale(1, sq); g.fillStyle = '#C9D1DB'; g.beginPath(); g.arc(0, 0, 11, Math.PI, 0); g.closePath(); g.fill(); fillE(g, 0, -12, 2.5, 2.5, '#8A949E'); g.restore();
    if (tb < 1) { g.strokeStyle = 'rgba(255,231,176,' + (1 - tb).toFixed(2) + ')'; g.lineWidth = 2; g.lineCap = 'round'; for (var w = 0; w < 2; w++) { var r = 16 + w * 8 + tb * 16; g.beginPath(); g.arc(bl.x, bl.y - 10, r, -2.6, -2.0); g.stroke(); g.beginPath(); g.arc(bl.x, bl.y - 10, r, -1.1, -0.5); g.stroke(); }
      text(g, 'ding!', bl.x, bl.y - 30 - tb * 16, 10, 800, 'rgba(255,231,176,' + (1 - tb).toFixed(2) + ')', 'center'); }
    var hs = T.host, cl = S.hot === 'close', cyc = (t % 6) / 6;
    fillRR(g, hs.x + 18, hs.y - 50, 44, 8, 2, C.green); text(g, 'TILL', hs.x + 22, hs.y - 44, 5.5, 800, '#FFFFFF');
    text(g, cl ? 'CLOSED' : 'Table 7', hs.x + 40, hs.y - 31, 6.5, 800, C.ink, 'center'); text(g, cl ? 'S$ 6,240' : 'S$ ' + (48 + Math.floor(cyc * 4) * 6) + '.00', hs.x + 40, hs.y - 20, 6.5, 800, cl ? '#1FA463' : C.tomato, 'center');
  }

  var MARCO = { x: 470, y: 444, s: 0.56, ph: 0.8, c: { skin: '#E8B48F', hair: '#2B1D16', top: '#FFFFFF', top2: '#E2553D', hat: '#FFFFFF' }, outfit: 'coat', hat: 'toque', hairStyle: 'short', feet: false,
    mood: 'calm', look: 0, talk: false, hands: [[-62, -186], [62, -186]] };
  var AISHA = { x: 716, y: 488, s: 0.56, ph: 1.6, c: { skin: '#C68B5E', hair: '#1F1A1A', top: '#2B3A33', low: '#2B3A33', shoe: '#F7F8FB' }, outfit: 'tee', apron: C.mustard, hairStyle: 'bun', hijab: '#E2553D', clipCol: C.tomato,
    hold: 'tray', feet: true, mood: 'calm', look: 0.4, talk: false, hands: [[-84, -330], [70, -160]] };

  /* the foreground, nearest last: each prop stands at a y, sorted with the front-row passers-by (K.zfore) */
  function FORE() {
    return [
      [620, function (g, ext) {
    if (ext.l < -480) { /* the takeaway shelf by the rider's spot */ var tx2 = -930; fillRR(g, tx2, 540, 150, 10, 3, C.wood); for (var b = 0; b < 4; b++) { fillRR(g, tx2 + 8 + b * 36, 508, 28, 32, 4, '#E8C394'); fillRR(g, tx2 + 14 + b * 36, 518, 16, 8, 2, '#FFFFFF'); }
      g.fillStyle = C.woodD; g.fillRect(tx2 + 10, 550, 6, 70); g.fillRect(tx2 + 134, 550, 6, 70); fillRR(g, tx2 + 20, 486, 110, 18, 4, C.green); text(g, 'TAKEAWAY · DELIVERY', tx2 + 75, 499, 7, 800, '#FFE7B0', 'center'); }
      }],
      [690, function (g, ext) {
    if (ext.r > 1220) bigPlant(g, 1270, 690, 0.9);
      }],
      [700, function (g, ext) {
    if (ext.l < -700) bigPlant(g, -900, 700, 1.1);
      }],
      [712, function (g, ext) {
    if (ext.l < -200) { var ax = -150, ay = 712; g.strokeStyle = C.woodD; g.lineWidth = 5; g.beginPath(); g.moveTo(ax - 34, ay); g.lineTo(ax - 10, ay - 120); g.moveTo(ax + 34, ay); g.lineTo(ax + 10, ay - 120); g.stroke();
      fillRR(g, ax - 40, ay - 120, 80, 96, 5, C.chalk); g.strokeStyle = C.wood; g.lineWidth = 4; g.strokeRect(ax - 40, ay - 120, 80, 96); text(g, 'TRY OUR', ax, ay - 92, 9, 800, '#F3EBDD', 'center'); text(g, 'LAKSA', ax, ay - 72, 14, 800, '#FFD27A', 'center'); text(g, 'S$ 14', ax, ay - 50, 9, 800, '#F3EBDD', 'center'); soft(g, ax, ay + 4, 50, 6, 0.3); }
      }]
    ];
  }
  window.IXW.worlds.fnb = {
    calmView: [180,-45,820,656], /* calm layer: the framed hero shows the core of the scene */
    pan: [-700, 1230], /* phones: how far the scene drags each way (set units), ending on whole objects */
    room: ROOM, paintBack: paintBack, paintFront: paintFront, paintWindow: function () {}, paintLive: paintLive, paintFrontLive: paintFrontLive, paintForeLive: function (g, t, S) { K.zfore(g, t, S, FORE().concat([[FY, function () { frontRow(g, t, S); }]]), function () { crew(g, t, S, 'fore'); }); },
    moteCol: 'rgba(255,231,176,.55)',
    glow: {
      buy: function (g) { var cr = T.crates; rr(g, cr.x - 8, F - 88, 88, 94, 12); },
      prep: function (g) { var pt = T.pot; rr(g, pt.x - 10, pt.y - 72, 72, 74, 12); },
      deliver: function (g) { var bx = T.boxes; rr(g, bx.x - 8, F - 98, 76, 104, 12); },
      serve: function (g) { var tb = T.table; rr(g, tb.x - 24, tb.y - 44, tb.w + 50, F - tb.y + 48, 14); },
      cook: function (g) { var kd = T.kds; rr(g, kd.x - 8, kd.y - 8, kd.w + 16, kd.h + 16, 12); },
      close: function (g) { var hs = T.host; rr(g, hs.x + 6, hs.y - 62, hs.w - 12, 70, 12); },
      wok: function (g) { var wk = T.wok; rr(g, wk.x - 12, wk.y - 70, 80, 72, 12); },
      bell: function (g) { var bl = T.bell; rr(g, bl.x - 20, bl.y - 30, 40, 32, 10); }
    },
    backGlow: ['buy', 'prep', 'deliver', 'serve', 'cook', 'wok'],
    cast: [
      { id: 'marco', behind: true, keys: ['prep', 'cook'], P: MARCO, act: function (P, t, S) {
        var st = S.cast.marco, busy = S.hot === 'prep' || S.hot === 'cook' || (S.toy.wok != null && t - S.toy.wok < 1.4);
        P.talk = t < st.until; P.mood = P.talk || busy ? 'happy' : 'calm';
        P.hands = t < st.wave ? [[-62, -186], [128 + Math.sin(t * 12) * 16, -404]] : busy ? [[-110 + Math.sin(t * 6) * 10, -200], [118, -196 + Math.sin(t * 9) * 10]] : [[-90, -196], [96, -192 + Math.sin(t * 2) * 4]];
        P.look = lerp(P.look, clamp((S.nexi.x - P.x) / 160, -1, 1), 0.08);
      } },
      { id: 'aisha', keys: ['serve', 'close'], P: AISHA, act: function (P, t, S) {
        var st = S.cast.aisha, on = S.hot === 'serve', waving = t < st.wave;
        P.talk = t < st.until; P.mood = P.talk || on ? 'happy' : 'calm';
        P.hop = waving ? Math.abs(Math.sin(t * 7)) * 10 : 0;
        P.hands = waving ? [[-84, -330], [118 + Math.sin(t * 12) * 16, -420]] : [[-84, -330 + Math.sin(t * 2.2) * 6], [70, -160]];
        P.look = lerp(P.look, on ? 1 : clamp((S.nexi.x - P.x) / 160, -1, 1), 0.08);
      } }
    ],
    onStop: function (key, S, t) { if (key === 'cook') S.ckT = t; }
  };
  /* ---------------- audit round: a mosaic runner set into the floor, and Joy, a server crossing the dining room with
     plates (idle: weaves between tables; tapped: a little twirl, the plates stay put, a "table 7!" call) ---------------- */
  var JOY = { x0: -160, x1: 900, y: 604, spd: 34, ph: 0.4, P: { s: 0.55, ph: 2.8, c: { skin: '#E8B48F', hair: '#2B1D16', top: '#FFFFFF', low: '#2B3A33', shoe: '#2B3A33' }, outfit: 'tee', apron: '#E2553D', hairStyle: 'pony', hold: 'tray', mood: 'happy', look: 0, hands: [[-84, -330], [70, -160]] } }, JT = { tap: -9 };
  function exFloor(g, ext) {
    var y0 = 540, y1 = 590; fillRR(g, ext.l, y0, ext.r - ext.l, y1 - y0, 0, '#C9A44A'); fillRR(g, ext.l, y0 + 4, ext.r - ext.l, y1 - y0 - 8, 0, '#FFF6E5');
    for (var x = Math.floor(ext.l / 50) * 50, i = 0; x < ext.r; x += 50, i++) { var c = i % 2 ? '#1F4D3F' : '#E2553D', cx = x + 25, cy = (y0 + y1) / 2;
      g.fillStyle = c; g.beginPath(); g.moveTo(cx, y0 + 9); g.lineTo(cx + 16, cy); g.lineTo(cx, y1 - 9); g.lineTo(cx - 16, cy); g.closePath(); g.fill(); fillE(g, cx, cy, 4, 4, '#E9B949'); }
  }
  function exFore(g, t, S) {
    var ext = S.ext, a = Math.max(JOY.x0, ext.l + 60), b = Math.min(JOY.x1, ext.r - 60); if (b - a < 80) return;
    var d = t - JT.tap, tw = d >= 0 && d < 1.6; JOY.P.tilt = tw ? Math.sin(d * 12) * 0.08 : 0;
    K.walker(g, { x0: a, x1: b, y: JOY.y, spd: JOY.spd, ph: JOY.ph, P: JOY.P }, t);
    if (tw) { var P = JOY.P; fillRR(g, P.x + 16, P.y - 300, 64, 22, 10, '#FFFFFF'); text(g, 'table 7!', P.x + 48, P.y - 285, 10, 800, '#E2553D', 'center'); }
  }
  function exHit(x, y, S, t) { var P = JOY.P; if (P.x != null && Math.abs(x - P.x) < 50 && y > P.y - 290 && y < P.y + 10) { JT.tap = t; return true; } return false; }
  (function (W) { var pb = W.paintBack, pf = W.paintForeLive, h0 = W.hit;
    W.paintBack = function (g, ext) { exFloor(g, ext); pb(g, ext); };
    W.paintForeLive = function (g, t, S) { exFore(g, t, S); pf(g, t, S); };
    W.hit = function (x, y, S, t, onBtn) { if (!onBtn && exHit(x, y, S, t)) return null; return h0 ? h0(x, y, S, t, onBtn) : null; };
  })(window.IXW.worlds.fnb);
})(window.IXW && window.IXW.kit);
