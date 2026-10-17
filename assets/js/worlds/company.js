/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: company (/company) — TechNext itself, drawn as ONE long office floor that runs across its three cities. Not a room
   with walls like the industry worlds: a glass curtain wall with three skylines behind it (Singapore, Taguig City in Metro
   Manila, Ho Chi Minh City), split into three bays by white columns, under a ceiling rail that carries the project capsule
   from office to office as the tour moves. Each bay hangs its city sign with a LIVE local clock (Singapore and Manila share
   UTC+8; Ho Chi Minh City is UTC+7, an hour behind) — tap one for the time there.
   In the frame: Singapore HQ (the discovery whiteboard, the pull-down training screen, a consultant), the Taguig City hub
   (the configuration display, the developer's desk with the integrations plugged in, the support screen on the column) and
   the Ho Chi Minh City hub (the AI hologram table and the server rack, an AI engineer). Beyond the frame: the reception with
   the TechNext logo wall on the left; the lounge, the coffee bar and the hiring board (open roles in Taguig City) on the
   right. A paper plane (the logo) loops the office; tap it, or the capsule. Everyone drawn is an illustration.
   The floor is busy: a map of the three offices hangs in Singapore (pins pulse, a dot rides the arcs), a parol and a
   trailing plant hang in Taguig City, silk lanterns and an agent screen in Ho Chi Minh City; the team wall, the coffee bar's
   menu and a developer on a beanbag in the lounge; a robot vacuum on its rounds. Every person has their own idle loop and
   their own tap choreography (assets/js/worlds/co-life.js): the consultant writes, thinks and explains, slaps a sticky note
   on the board or twirls her marker; the developer types, sips, stretches and swivels, spins his chair or pumps a merge;
   the AI engineer conducts the hologram, checks the rack and folds his arms, tosses a light orb or snaps the rings faster. */
(function (K, CR, COL) {
  'use strict';
  if (!K || !CR || !COL) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed;
  var F = 470, CEIL = -150, RAIL = -128;
  var C = { blue: '#3167CA', blueD: '#1E4691', blueL: '#DCE7FB', ink: '#1B1F3B', sg: '#3167CA', ph: '#14A38B', vn: '#F08A24', white: '#FFFFFF',
    col: '#F4F7FC', colS: '#DCE3EE', glass: 'rgba(255,255,255,.18)', mull: '#E8EEF7', odoo: '#714B67' };
  var COLS = [165, 470, 760, 1045]; /* the column centres */
  var BAY = { sg: { x: 318, city: 'SINGAPORE', role: 'HQ', off: 8, tz: 'Singapore' }, ph: { x: 615, city: 'TAGUIG CITY', role: 'Development hub', off: 8, tz: 'Taguig City' },
    vn: { x: 903, city: 'HO CHI MINH CITY', role: 'AI engineering hub', off: 7, tz: 'Ho Chi Minh City' } };
  var T = {
    board: { x: 190, y: 240, w: 140, h: 145 }, screen: { x: 350, y: -12, w: 100, h: 100 }, disp: { x: 495, y: 150, w: 150, h: 100 },
    desk: { x: 590, y: 386, w: 158 }, sup: { x: 726, y: 250, w: 92, h: 78 }, holo: { x: 815, y: 400, w: 86 }, rack: { x: 972, y: 232, w: 62 }
  };
  var STOP_BAY = { discovery: 'sg', train: 'sg', configure: 'ph', integrate: 'ph', ai: 'vn' };

  /* ---------------- helpers ---------------- */
  function setU(g, sx, sy, k) { g.translate(sx, sy); g.scale(k, k); }
  function extOf(W, H, k, sx, sy) { return { l: -(sx + 24) / k, r: (W - sx) / k, t: -(sy + 24) / k, b: (H - sy) / k }; }
  function plane(g, x, y, s, rot, col, fold) { /* the TechNext paper plane (the logo's shape) */
    g.save(); g.translate(x, y); g.rotate(rot || 0); g.scale(s, s);
    g.beginPath(); g.moveTo(-10.5, -2.2); g.lineTo(10.5, -10); g.lineTo(5.9, 10.4); g.lineTo(0.7, 3.3); g.lineTo(-3.4, 7.8); g.lineTo(-3, 1.5); g.closePath(); g.fillStyle = col; g.fill();
    if (fold) { g.strokeStyle = fold; g.lineWidth = 1.3; g.lineCap = 'round'; g.beginPath(); g.moveTo(-3, 1.5); g.lineTo(10.5, -10); g.moveTo(0.7, 3.3); g.lineTo(-3, 1.5); g.stroke(); }
    g.restore();
  }
  function wins(g, x, y, w, h, col, step, seed) { /* lit windows on a tower: a few dots per floor, fixed by the seed */
    g.fillStyle = col; for (var fy = y + 6; fy < y + h - 4; fy += step) for (var fx = x + 4; fx < x + w - 4; fx += 7) if (hash(fx * 0.37 + fy * 1.3 + seed) > 0.55) g.fillRect(fx, fy, 3, 3.4);
  }
  function tower(g, x, w, top, col, base, wc, seed) { g.fillStyle = col; g.fillRect(x, top, w, base - top); if (wc) wins(g, x, top, w, base - top, wc, 9, seed || 0); }

  /* ---------------- the three skylines (static, behind the glass) ---------------- */
  var HZ = 262, LAND = 300; /* the horizon; where the near city stands */
  function skySG(g, x0, x1) {
    /* far: hazy towers; the bay; the three hotel towers under their sky park; the observation wheel; the CBD; the garden's tree towers */
    for (var i = 0; i < 14; i++) { var fx = x0 + i * 40 + hash(i) * 20; if (fx > x1) break; tower(g, fx, 22 + hash(i + 9) * 18, HZ - 30 - hash(i * 3) * 70, 'rgba(160,185,225,.55)', LAND); }
    g.fillStyle = 'rgba(120,170,215,.55)'; g.fillRect(x0, LAND - 6, x1 - x0, 60);
    var mx = x0 + (x1 - x0) * 0.58;
    if (mx > x0 + 60 && mx < x1 - 60) {
      [0, 34, 68].forEach(function (d, i) { g.fillStyle = '#9DB6DC'; g.beginPath(); g.moveTo(mx + d, LAND); g.lineTo(mx + d + 4, 150 - i * 2); g.lineTo(mx + d + 22, 150 - i * 2); g.lineTo(mx + d + 24, LAND); g.closePath(); g.fill(); });
      fillRR(g, mx - 10, 138, 118, 12, 6, '#8AA7D4'); g.fillStyle = '#7F9ECF'; g.fillRect(mx + 98, 140, 16, 5);
    }
    var wx = x0 + (x1 - x0) * 0.2, wy = 196;
    if (wx < x1 - 40) { g.strokeStyle = '#A8BDE0'; g.lineWidth = 3; g.beginPath(); g.arc(wx, wy, 54, 0, 7); g.stroke(); g.lineWidth = 1.2; for (var s = 0; s < 12; s++) { var a = s * Math.PI / 6; g.beginPath(); g.moveTo(wx, wy); g.lineTo(wx + Math.cos(a) * 54, wy + Math.sin(a) * 54); g.stroke(); }
      g.lineWidth = 4; g.beginPath(); g.moveTo(wx - 30, LAND); g.lineTo(wx, wy); g.lineTo(wx + 30, LAND); g.stroke(); }
    for (var c = 0; c < 9; c++) { var cx = x0 + 30 + c * 52; if (cx > x1 - 20) break; var h = 120 + hash(c + 40) * 120; tower(g, cx, 30, LAND - h, c % 2 ? '#B3C7E6' : '#A6BDE2', LAND + 60, 'rgba(255,255,255,.55)', c); }
    for (var tr = 0; tr < 4; tr++) { var tx = x0 + 60 + tr * 30 + (x1 - x0) * 0.62; if (tx > x1 - 10) break; g.fillStyle = '#9C8FCB'; g.fillRect(tx - 2, LAND - 50, 4, 56); g.beginPath(); g.moveTo(tx - 16, LAND - 56); g.lineTo(tx + 16, LAND - 56); g.lineTo(tx + 3, LAND - 44); g.lineTo(tx - 3, LAND - 44); g.closePath(); g.fill(); }
  }
  function skyPH(g, x0, x1) {
    /* far: the hills; a dense business district of glass towers, one slender tall one; the low city below */
    g.fillStyle = 'rgba(150,190,200,.5)'; g.beginPath(); g.moveTo(x0, HZ); for (var hx = x0; hx <= x1; hx += 20) g.lineTo(hx, HZ - 16 - Math.sin(hx * 0.02) * 12); g.lineTo(x1, HZ); g.closePath(); g.fill();
    for (var i = 0; i < 12; i++) { var fx = x0 + i * 26 + hash(i + 70) * 10; if (fx > x1) break; tower(g, fx, 20, HZ - 20 - hash(i + 71) * 50, 'rgba(160,200,205,.55)', LAND); }
    for (var c = 0; c < 10; c++) { var cx = x0 + 6 + c * 30; if (cx > x1 - 10) break; var h = 90 + hash(c + 20) * 130, w = 24 + hash(c + 2) * 10;
      tower(g, cx, w, LAND - h, c % 3 === 0 ? '#9FD3CB' : c % 3 === 1 ? '#B4DDD6' : '#A7C9D9', LAND + 60, 'rgba(255,255,255,.6)', c + 9);
      g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(cx + 3, LAND - h, 3, h); }
    var tx = x0 + (x1 - x0) * 0.55; g.fillStyle = '#8CC7BE'; g.beginPath(); g.moveTo(tx, LAND); g.lineTo(tx + 4, 70); g.lineTo(tx + 16, 54); g.lineTo(tx + 28, 70); g.lineTo(tx + 32, LAND); g.closePath(); g.fill(); wins(g, tx + 4, 80, 26, LAND - 80, 'rgba(255,255,255,.6)', 9, 3);
    g.fillStyle = '#B9D9CF'; for (var lr = x0; lr < x1; lr += 18) g.fillRect(lr, LAND + 6 - hash(lr) * 14, 16, 60);
  }
  function skyVN(g, x0, x1) {
    /* far: the low city; the river with its bend; the tall stepped tower; the tulip tower with its helipad */
    for (var i = 0; i < 16; i++) { var fx = x0 + i * 24 + hash(i + 120) * 10; if (fx > x1) break; tower(g, fx, 18, HZ - 10 - hash(i + 121) * 30, 'rgba(235,190,150,.45)', LAND); }
    g.fillStyle = 'rgba(140,175,205,.75)'; g.beginPath(); g.moveTo(x0, LAND + 16); g.bezierCurveTo(x0 + 120, LAND - 4, x1 - 140, LAND + 30, x1, LAND + 4); g.lineTo(x1, LAND + 40); g.lineTo(x0, LAND + 40); g.closePath(); g.fill();
    var lx = x0 + (x1 - x0) * 0.66;
    if (lx < x1 - 30) { g.fillStyle = '#D5A87F'; g.fillRect(lx, LAND - 150, 40, 150); g.fillStyle = '#DDB38D'; g.fillRect(lx + 5, LAND - 196, 30, 50); g.fillStyle = '#E5BE9A'; g.fillRect(lx + 10, LAND - 230, 20, 36); g.fillStyle = '#ECC9A8'; g.fillRect(lx + 15, LAND - 252, 10, 24);
      g.fillStyle = '#C69A72'; g.fillRect(lx + 19, LAND - 270, 2, 20); wins(g, lx, LAND - 150, 40, 150, 'rgba(255,255,255,.55)', 9, 11); }
    var bx = x0 + (x1 - x0) * 0.28;
    if (bx < x1 - 20) { g.fillStyle = '#C9B3A0'; g.beginPath(); g.moveTo(bx, LAND); g.quadraticCurveTo(bx - 4, LAND - 110, bx + 8, LAND - 150); g.lineTo(bx + 22, LAND - 160); g.quadraticCurveTo(bx + 30, LAND - 100, bx + 28, LAND); g.closePath(); g.fill();
      fillE(g, bx + 20, LAND - 108, 16, 4, '#B89E8A'); wins(g, bx + 4, LAND - 140, 20, 138, 'rgba(255,255,255,.5)', 9, 7); }
    for (var c = 0; c < 8; c++) { var cx = x0 + 10 + c * 46; if (cx > x1 - 10) break; if (Math.abs(cx - lx) < 46 || Math.abs(cx - bx) < 36) continue; var h = 50 + hash(c + 33) * 70; tower(g, cx, 28, LAND - h, c % 2 ? '#E9C9AC' : '#DDBFA6', LAND + 60, 'rgba(255,255,255,.5)', c + 30); }
  }
  function paintBg(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    var sk = g.createLinearGradient(0, CEIL, 0, HZ); sk.addColorStop(0, '#A9CCF7'); sk.addColorStop(1, '#EAF3FF'); g.fillStyle = sk; g.fillRect(e.l, e.t, e.r - e.l, F - e.t);
    /* the sun's glow over Singapore, warmer light over Ho Chi Minh City */
    var sun = g.createRadialGradient(330, 40, 10, 330, 40, 360); sun.addColorStop(0, 'rgba(255,248,220,.75)'); sun.addColorStop(1, 'rgba(255,248,220,0)'); g.fillStyle = sun; g.fillRect(e.l, CEIL, e.r - e.l, F - CEIL);
    var warm = g.createLinearGradient(760, 0, 1300, 0); warm.addColorStop(0, 'rgba(255,214,170,0)'); warm.addColorStop(1, 'rgba(255,214,170,.35)'); g.fillStyle = warm; g.fillRect(760, CEIL, Math.max(0, e.r - 760), F - CEIL);
    skySG(g, Math.min(e.l, -300), COLS[1]); skyPH(g, COLS[1], COLS[2]); skyVN(g, COLS[2], Math.max(e.r, 1400));
    /* the glass: a pale band low down (we are high up), a soft reflection */
    var lo = g.createLinearGradient(0, LAND + 20, 0, F); lo.addColorStop(0, 'rgba(220,232,248,.2)'); lo.addColorStop(1, 'rgba(220,232,248,.85)'); g.fillStyle = lo; g.fillRect(e.l, LAND + 20, e.r - e.l, F - LAND - 20);
    g.restore();
  }

  /* ---------------- live: the view through the glass ---------------- */
  function paintWindow(g, t, par, S) {
    var ext = S.ext, span = ext.r - ext.l + 300;
    for (var c = 0; c < 5; c++) { var sp = 4 + c * 1.6, x = ext.l - 150 + ((hash(c + 4) * span + t * sp) % span) - par * (2 + c), y = -110 + c * 34 + hash(c + 2) * 30; K.cloud(g, x, y, 0.24 + hash(c) * 0.12); }
    /* a jet far off; boats on the Ho Chi Minh City river and the Singapore bay */
    var jx = ext.l + ((t * 22) % (span + 400)) - 200; plane(g, jx, -60 + Math.sin(t * 0.2) * 6, 0.7, -0.06, 'rgba(255,255,255,.9)');
    var bx = COLS[2] + 30 + ((t * 6) % 300); if (bx < COLS[3] + 300) { fillRR(g, bx, LAND + 14, 22, 5, 2, '#FFFFFF'); fillRR(g, bx + 6, LAND + 9, 9, 5, 2, '#F08A24'); }
    var sb = -260 + ((t * 5) % 380); fillRR(g, sb, LAND + 4, 26, 5, 2, '#FFFFFF'); fillRR(g, sb + 7, LAND - 1, 10, 5, 2, '#3167CA');
    COL.birds(g, t, ext.l, ext.r, -40, 4); COL.birds(g, t * 0.8 + 40, ext.l, ext.r, 130, 3, 'rgba(60,80,110,.35)');
    /* a second boat on the Taguig City side: the river ferry */
    var fb = COLS[1] + ((t * 4 + 120) % 300); if (fb < COLS[2] - 20) { fillRR(g, fb, LAND + 22, 20, 4, 2, '#FFFFFF'); fillRR(g, fb + 5, LAND + 18, 8, 4, 2, C.ph); }
  }

  /* ---------------- the frame: mullions, columns, ceiling, the rail, the floor (hero px, static) ---------------- */
  function paintFrame(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    /* mullions every 96 units and a transom; the glass catches the light */
    g.fillStyle = 'rgba(255,255,255,.16)'; for (var gx = Math.floor(e.l / 96) * 96; gx < e.r; gx += 96) { g.beginPath(); g.moveTo(gx + 20, F); g.lineTo(gx + 44, CEIL); g.lineTo(gx + 58, CEIL); g.lineTo(gx + 34, F); g.closePath(); g.fill(); }
    g.fillStyle = C.mull; for (var mx = Math.floor(e.l / 96) * 96; mx < e.r; mx += 96) g.fillRect(mx - 2.5, CEIL, 5, F - CEIL);
    g.fillRect(e.l, 40, e.r - e.l, 4); g.fillStyle = 'rgba(30,60,110,.06)'; g.fillRect(e.l, 44, e.r - e.l, 2);
    /* the left margin: a solid wall for the TechNext logo and the reception */
    var lw = -770, lw2 = -430;
    if (e.l < lw2) { g.fillStyle = C.blue; g.fillRect(Math.max(e.l, lw - 400), CEIL, lw2 - Math.max(e.l, lw - 400), F - CEIL);
      g.fillStyle = 'rgba(255,255,255,.06)'; for (var st = lw - 400; st < lw2; st += 26) g.fillRect(st, CEIL, 12, F - CEIL);
      plane(g, -600, 120, 7.2, 0, '#FFFFFF', C.blue); text(g, 'TechNext', -600, 250, 46, 800, '#FFFFFF', 'center'); text(g, 'ODOO ERP · ENTERPRISE AI', -600, 276, 11, 800, 'rgba(255,255,255,.75)', 'center'); }
    /* the columns, each with a shadow side */
    COLS.forEach(function (cx) { fillRR(g, cx - 14, CEIL, 28, F - CEIL, 0, C.col); g.fillStyle = C.colS; g.fillRect(cx + 6, CEIL, 8, F - CEIL); g.fillStyle = 'rgba(255,255,255,.8)'; g.fillRect(cx - 12, CEIL, 3, F - CEIL); });
    /* the ceiling: panels and light strips; the rail and its hangers */
    var cg = g.createLinearGradient(0, e.t, 0, CEIL); cg.addColorStop(0, '#E9EEF6'); cg.addColorStop(1, '#F8FAFD'); g.fillStyle = cg; g.fillRect(e.l, e.t, e.r - e.l, CEIL - e.t);
    g.fillStyle = 'rgba(30,60,110,.08)'; g.fillRect(e.l, CEIL - 3, e.r - e.l, 3);
    for (var lx = Math.floor(e.l / 160) * 160; lx < e.r; lx += 160) { fillRR(g, lx + 30, CEIL - 22, 100, 7, 3, '#FFFFFF'); g.save(); var lg = g.createLinearGradient(0, CEIL, 0, CEIL + 120); lg.addColorStop(0, 'rgba(255,255,250,.35)'); lg.addColorStop(1, 'rgba(255,255,250,0)'); g.fillStyle = lg;
      g.beginPath(); g.moveTo(lx + 30, CEIL); g.lineTo(lx + 130, CEIL); g.lineTo(lx + 160, CEIL + 120); g.lineTo(lx, CEIL + 120); g.closePath(); g.fill(); g.restore(); }
    g.fillStyle = '#C9D3E3'; for (var hx = Math.floor(e.l / 120) * 120; hx < e.r; hx += 120) g.fillRect(hx - 1.5, CEIL, 3, RAIL - CEIL);
    fillRR(g, e.l, RAIL - 5, e.r - e.l, 10, 5, C.blueD); g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(e.l, RAIL - 4, e.r - e.l, 2);
    /* the floor: polished, a soft reflection of the glass, the TechNext Line inlaid with the three office stops */
    var fg = g.createLinearGradient(0, F, 0, e.b); fg.addColorStop(0, '#E4EAF3'); fg.addColorStop(1, '#D3DCE9'); g.fillStyle = fg; g.fillRect(e.l, F, e.r - e.l, e.b - F);
    g.fillStyle = 'rgba(255,255,255,.35)'; for (var rx = Math.floor(e.l / 96) * 96; rx < e.r; rx += 96) g.fillRect(rx + 30, F + 4, 26, 40);
    g.fillStyle = 'rgba(40,70,120,.10)'; g.fillRect(e.l, F, e.r - e.l, 6);
    g.strokeStyle = 'rgba(30,60,110,.07)'; g.lineWidth = 1.5; g.beginPath(); for (var d = 1; d < 7; d++) { var yy = F + Math.pow(d / 6, 1.5) * (e.b - F); g.moveTo(e.l, yy); g.lineTo(e.r, yy); } g.stroke();
    var ly = 540; g.lineCap = 'round'; [[e.l, COLS[1], C.sg], [COLS[1], COLS[2], C.ph], [COLS[2], e.r, C.vn]].forEach(function (s) { g.strokeStyle = s[2]; g.globalAlpha = 0.55; g.lineWidth = 9; g.beginPath(); g.moveTo(s[0], ly); g.lineTo(s[1], ly); g.stroke(); }); g.globalAlpha = 1;
    [[BAY.sg.x, C.sg], [BAY.ph.x, C.ph], [BAY.vn.x, C.vn]].forEach(function (p) { fillE(g, p[0], ly, 13, 6, '#FFFFFF'); g.strokeStyle = p[1]; g.lineWidth = 3; ell(g, p[0], ly, 13, 6); g.stroke(); });
    g.restore();
  }
  function ell(g, x, y, rx, ry) { g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); }

  /* ---------------- static back props (set units) ---------------- */
  function sign(g, b, col) { /* a city sign hung from the rail: the clock's face (its hands are live), the city, the office */
    var x = b.x - 75, y = -78; g.strokeStyle = '#9AA6BC'; g.lineWidth = 2; g.beginPath(); g.moveTo(x + 24, RAIL); g.lineTo(x + 24, y); g.moveTo(x + 126, RAIL); g.lineTo(x + 126, y); g.stroke();
    shadowed(g, 10, 4, 0.16, function () { fillRR(g, x, y, 150, 46, 23, '#FFFFFF'); }); fillE(g, x + 23, y + 23, 19, 19, col); fillE(g, x + 23, y + 23, 15, 15, '#FFFFFF');
    g.fillStyle = '#9AA6BC'; for (var i = 0; i < 12; i++) { var a = i * Math.PI / 6; g.fillRect(x + 23 + Math.cos(a) * 12 - 0.8, y + 23 + Math.sin(a) * 12 - 0.8, 1.6, 1.6); }
    text(g, b.city, x + 50, y + 21, b.city.length > 12 ? 9 : 10.5, 800, C.ink); text(g, b.role, x + 50, y + 35, 8.5, 700, col);
  }
  function wideBack(g, ext) {
    /* the reception behind the copy: a curved desk, a sofa, plants, the partner plaque */
    if (ext.l < 140) {
      soft(g, -600, F + 4, 150, 10, 0.25); fillRR(g, -720, 384, 240, 86, 18, '#FFFFFF'); fillRR(g, -720, 384, 240, 12, 6, '#E3E9F3'); fillRR(g, -720, 430, 240, 8, 0, C.blue); text(g, 'RECEPTION', -600, 418, 10, 800, C.blueD, 'center');
      soft(g, -300, F + 4, 110, 9, 0.22); fillRR(g, -390, 400, 180, 48, 16, '#5E7BB5'); fillRR(g, -396, 386, 30, 70, 12, '#4F6CA8'); fillRR(g, -234, 386, 30, 70, 12, '#4F6CA8'); fillRR(g, -380, 446, 170, 18, 8, '#4F6CA8');
      fillRR(g, -360, 392, 46, 30, 10, '#FFD84A'); fillRR(g, -270, 392, 40, 30, 10, '#9FE3C1');
      fillRR(g, -170, 430, 80, 8, 3, '#C9A27A'); g.fillStyle = '#A9825C'; g.fillRect(-162, 438, 5, 32); g.fillRect(-103, 438, 5, 32); fillRR(g, -156, 418, 30, 12, 2, '#FFFFFF'); fillRR(g, -120, 422, 22, 8, 2, C.blue);
      K.plant(g, { x: -440, y: F }, '#FFFFFF', '#E3E9F3'); K.plant(g, { x: 110, y: F }, '#3167CA', '#4F7FD8');
      g.strokeStyle = '#A9825C'; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.moveTo(-160, 300); g.lineTo(-176, F); g.moveTo(-100, 300); g.lineTo(-84, F); g.moveTo(-130, 300); g.lineTo(-130, F - 4); g.stroke(); soft(g, -130, F + 2, 60, 6, 0.18);
      shadowed(g, 10, 4, 0.16, function () { fillRR(g, -200, 236, 140, 70, 10, '#FFFFFF'); }); fillRR(g, -200, 236, 140, 18, 10, '#714B67'); fillRR(g, -200, 246, 140, 8, 0, '#714B67');
      text(g, 'ODOO', -130, 249, 9, 800, '#FFFFFF', 'center'); text(g, 'Ready Partner', -130, 280, 13, 800, C.ink, 'center'); text(g, 'TechNext Pte. Ltd.', -130, 296, 8.5, 700, '#5C5C73', 'center');
    }
    /* the lounge on the right: the hiring board, the coffee bar, a bookshelf, bean bags */
    if (ext.r > 1060) {
      shadowed(g, 12, 5, 0.18, function () { fillRR(g, 1074, 120, 132, 168, 10, '#FFFFFF'); }); fillRR(g, 1074, 120, 132, 30, 10, C.ph); g.fillRect(1074, 140, 132, 10);
      text(g, "WE'RE HIRING", 1140, 140, 11, 800, '#FFFFFF', 'center');
      ['Odoo consultant', 'ERP consultant', 'Finance', 'Sales & marketing'].forEach(function (r, i) { fillRR(g, 1086, 160 + i * 28, 108, 22, 6, i % 2 ? '#E6F6F2' : '#F1F5FB'); text(g, r, 1094, 175 + i * 28, 8.5, 800, C.ink); });
      text(g, 'Taguig City · careers', 1140, 280, 8, 800, C.ph, 'center');
      soft(g, 1320, F + 4, 120, 9, 0.22); fillRR(g, 1230, 360, 190, 110, 10, '#2A3550'); fillRR(g, 1224, 352, 202, 14, 6, '#C9A27A'); fillRR(g, 1250, 306, 50, 46, 6, '#CFD6E2'); fillRR(g, 1258, 316, 34, 16, 3, '#2A3550'); fillE(g, 1275, 340, 5, 5, '#FF8A3D');
      fillRR(g, 1320, 330, 18, 22, 4, '#FFFFFF'); fillRR(g, 1346, 334, 16, 18, 4, C.blue); fillRR(g, 1370, 330, 18, 22, 4, '#FFD84A'); text(g, 'COFFEE BAR', 1325, 400, 10, 800, '#FFFFFF', 'center');
      fillRR(g, 1450, 220, 110, 250, 6, '#E3D3BF'); for (var s = 0; s < 4; s++) { fillRR(g, 1456, 270 + s * 50, 98, 6, 2, '#C9B39A'); for (var b = 0; b < 7; b++) fillRR(g, 1460 + b * 13, 238 + s * 50 + (hash(b + s * 9) * 8), 10, 32 - hash(b + s * 9) * 8, 2, ['#3167CA', '#14A38B', '#F08A24', '#E0456B', '#FFD84A'][(b + s) % 5]); }
      K.plant(g, { x: 1600, y: F }, '#14A38B', '#3AB9A2');
    }
  }
  /* the map of the three offices, hung from the rail in Singapore (its pins and the riding dot are live) */
  var MAP = { x: 126, y: 70, w: 208, h: 132 };
  function mp(px, py) { return [MAP.x + 10 + px * 0.95, MAP.y + 18 + py * 0.9]; }
  var PINS = { vn: [62, 70], ph: [137, 42], sg: [57, 96] };
  function mapBack(g) {
    var m = MAP; g.strokeStyle = '#9AA6BC'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(m.x + 30, RAIL); g.lineTo(m.x + 30, m.y); g.moveTo(m.x + m.w - 30, RAIL); g.lineTo(m.x + m.w - 30, m.y); g.stroke();
    shadowed(g, 10, 4, 0.16, function () { fillRR(g, m.x, m.y, m.w, m.h, 8, '#FFFFFF'); }); fillRR(g, m.x + 4, m.y + 16, m.w - 8, m.h - 20, 5, '#EAF3FF');
    fillRR(g, m.x, m.y, m.w, 15, 8, C.ink); g.fillRect(m.x, m.y + 8, m.w, 7); text(g, 'THREE OFFICES \u00B7 ONE TEAM', m.x + 10, m.y + 10.5, 6.6, 800, '#FFFFFF');
    [C.sg, C.ph, C.vn].forEach(function (c, i) { fillE(g, m.x + m.w - 30 + i * 9, m.y + 7.5, 3, 3, c); });
    g.save(); rr(g, m.x + 4, m.y + 16, m.w - 8, m.h - 20, 5); g.clip(); g.fillStyle = '#CFE0F7';
    function poly(pts) { g.beginPath(); pts.forEach(function (p, i) { var q = mp(p[0], p[1]); if (i) g.lineTo(q[0], q[1]); else g.moveTo(q[0], q[1]); }); g.closePath(); g.fill(); }
    poly([[30, 4], [86, 0], [92, 22], [80, 44], [70, 60], [60, 76], [52, 70], [56, 56], [46, 44], [36, 30], [24, 18]]);
    poly([[44, 60], [52, 70], [60, 90], [58, 98], [50, 90], [44, 74]]);
    [[34, 100, 26, 6, 0.75], [104, 92, 20, 15, 0], [92, 116, 24, 4, 0.08], [137, 40, 7, 15, 0.2], [148, 78, 10, 8, 0], [142, 60, 4, 3, 0], [152, 62, 4, 3, 0], [176, 92, 12, 10, 0.4]].forEach(function (e) { var q = mp(e[0], e[1]); g.beginPath(); g.ellipse(q[0], q[1], e[2] * 0.95, e[3] * 0.9, e[4], 0, Math.PI * 2); g.fill(); });
    g.strokeStyle = 'rgba(49,103,202,.08)'; g.lineWidth = 1; g.beginPath(); for (var gx = m.x + 20; gx < m.x + m.w; gx += 24) { g.moveTo(gx, m.y + 16); g.lineTo(gx, m.y + m.h); } for (var gy = m.y + 30; gy < m.y + m.h; gy += 24) { g.moveTo(m.x, gy); g.lineTo(m.x + m.w, gy); } g.stroke();
    g.restore();
    text(g, 'clients in 10+ countries', m.x + m.w - 10, m.y + m.h - 9, 6.2, 800, C.blueD, 'right');
  }
  /* the team wall over the hiring board: polaroids on a string, each a little scene from the three offices */
  function teamWall(g) {
    var x0 = 1078, y0 = -36; g.strokeStyle = '#9AA6BC'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(x0 - 6, y0); g.quadraticCurveTo(x0 + 66, y0 + 12, x0 + 140, y0); g.moveTo(x0 - 6, y0 + 62); g.quadraticCurveTo(x0 + 66, y0 + 74, x0 + 140, y0 + 62); g.stroke();
    text(g, 'TEAM WALL', x0 + 67, y0 - 8, 8, 800, C.ink, 'center');
    [[C.sg, 'sg'], [C.ph, 'ph'], [C.vn, 'vn'], ['#FFD84A', 'plane'], [C.odoo, 'odoo'], ['#E0456B', 'cake']].forEach(function (p, i) {
      var px = x0 + (i % 3) * 46, py = y0 + 4 + Math.floor(i / 3) * 62 + (i % 2) * 3, rot = (hash(i + 3) - 0.5) * 0.16;
      g.save(); g.translate(px + 17, py + 22); g.rotate(rot); shadowed(g, 5, 2, 0.16, function () { fillRR(g, -17, -20, 34, 42, 2, '#FFFFFF'); });
      fillRR(g, -14, -17, 28, 26, 1, p[1] === 'plane' ? '#DCEBFF' : '#EAF3FF'); g.fillStyle = p[0];
      if (p[1] === 'sg' || p[1] === 'ph' || p[1] === 'vn') { for (var b = 0; b < 4; b++) { var bh = 6 + hash(b + i * 7) * 14; g.fillRect(-12 + b * 7, 9 - bh, 5, bh); } }
      else if (p[1] === 'plane') plane(g, 0, -4, 0.9, -0.2, C.blue);
      else if (p[1] === 'odoo') { fillE(g, 0, -4, 8, 8, p[0]); fillE(g, 0, -4, 4, 4, '#FFFFFF'); }
      else { fillRR(g, -8, -4, 16, 11, 2, '#FFC2D1'); fillRR(g, -8, -6, 16, 4, 2, p[0]); g.fillRect(-0.8, -12, 1.6, 6); fillE(g, 0, -13, 1.6, 2.4, '#FFD84A'); }
      fillRR(g, -10, 12, 20, 2.4, 1, '#C9D3E3'); g.fillStyle = '#C9A27A'; g.fillRect(-3, -23, 6, 7); g.restore(); });
    /* the coffee bar's menu board and its two pendant lamps */
    shadowed(g, 8, 3, 0.18, function () { fillRR(g, 1244, 196, 172, 92, 8, '#2A3142'); }); fillRR(g, 1250, 202, 160, 80, 5, '#33405A');
    text(g, 'COFFEE BAR', 1330, 220, 9, 800, '#FFD84A', 'center');
    [['Kopi', 'Singapore', '#9FC4FF'], ['Kape', 'Taguig City', '#7FE3C4'], ['C\u00E0 ph\u00EA', 'Ho Chi Minh City', '#FFB877']].forEach(function (r, i) { var ry = 238 + i * 15; text(g, r[0], 1262, ry, 8, 800, '#FFFFFF'); g.fillStyle = 'rgba(255,255,255,.25)'; for (var d = 1304; d < 1340; d += 4) g.fillRect(d, ry - 2, 1.5, 1.5); text(g, r[1], 1398, ry, 6.4, 700, r[2], 'right'); });
    [1272, 1388].forEach(function (lx) { g.strokeStyle = '#9AA6BC'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(lx, CEIL); g.lineTo(lx, 120); g.stroke(); g.fillStyle = C.ink; g.beginPath(); g.moveTo(lx - 16, 136); g.lineTo(lx - 6, 120); g.lineTo(lx + 6, 120); g.lineTo(lx + 16, 136); g.closePath(); g.fill(); fillE(g, lx, 137, 10, 3, '#FFE9A8'); });
  }
  /* the agent screen in Ho Chi Minh City, hung from the rail (its steps are live) */
  var AG = { x: 842, y: 40, w: 112, h: 80 };
  function agentBack(g) { var a = AG; g.strokeStyle = '#9AA6BC'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(a.x + 18, RAIL); g.lineTo(a.x + 18, a.y); g.moveTo(a.x + a.w - 18, RAIL); g.lineTo(a.x + a.w - 18, a.y); g.stroke();
    shadowed(g, 10, 4, 0.2, function () { fillRR(g, a.x - 5, a.y - 5, a.w + 10, a.h + 10, 7, '#2A3142'); }); fillRR(g, a.x, a.y, a.w, a.h, 3, '#FFFFFF');
    fillRR(g, a.x, a.y, a.w, 13, 3, C.vn); g.fillRect(a.x, a.y + 8, a.w, 5); text(g, 'AGENT RUN \u00B7 SAMPLE', a.x + 7, a.y + 9.6, 6, 800, '#FFFFFF'); }
  /* the lobby behind the visitor pass (left of the board): frosted privacy film on the glass, three pendant lamps over the
     sofa, the welcome totem on the floor (its slides are live), a low credenza with the guest book and a bowl of oranges */
  var TOT = { x: -26, y: 250, w: 64, h: 214 };
  function lobbyBack(g, ext) {
    if (ext.l > 120) return;
    var x0 = Math.max(ext.l, -940), x1 = 150;
    g.fillStyle = 'rgba(255,255,255,.42)'; g.fillRect(x0, 318, x1 - x0, 30); g.fillStyle = 'rgba(49,103,202,.16)';
    for (var dx = Math.floor(x0 / 14) * 14; dx < x1; dx += 14) { fillE(g, dx, 326, 2, 2, 'rgba(49,103,202,.16)'); fillE(g, dx + 7, 340, 2, 2, 'rgba(49,103,202,.16)'); }
    for (var px = Math.floor(x0 / 220) * 220 + 60; px < x1 - 40; px += 220) plane(g, px, 333, 0.62, 0, 'rgba(49,103,202,.32)');
    /* the lamps (cords from the ceiling; brass domes; a warm pool on the glass) */
    [[-362, 168, '#F2B233'], [-300, 196, '#3167CA'], [-238, 176, '#14A38B']].forEach(function (l) { g.strokeStyle = '#9AA6BC'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(l[0], CEIL); g.lineTo(l[0], l[1] - 18); g.stroke();
      g.save(); var lg = g.createRadialGradient(l[0], l[1] + 6, 2, l[0], l[1] + 6, 60); lg.addColorStop(0, 'rgba(255,236,170,.55)'); lg.addColorStop(1, 'rgba(255,236,170,0)'); g.fillStyle = lg; g.fillRect(l[0] - 60, l[1] - 50, 120, 120); g.restore();
      g.fillStyle = l[2]; g.beginPath(); g.moveTo(l[0] - 18, l[1]); g.quadraticCurveTo(l[0] - 17, l[1] - 20, l[0], l[1] - 20); g.quadraticCurveTo(l[0] + 17, l[1] - 20, l[0] + 18, l[1]); g.closePath(); g.fill(); fillE(g, l[0], l[1] + 1, 11, 3.4, '#FFF4C8'); });
    /* the credenza under the frosted band, behind the sofa's left arm */
    if (ext.l < -440) { soft(g, -520, F + 4, 80, 8, 0.2); fillRR(g, -590, 404, 140, 66, 6, '#E3D3BF'); fillRR(g, -590, 404, 140, 8, 4, '#C9B39A'); g.fillStyle = '#C9B39A'; g.fillRect(-521, 416, 2, 46);
      fillE(g, -568, 444, 2.5, 2.5, '#9C8466'); fillE(g, -474, 444, 2.5, 2.5, '#9C8466');
      fillRR(g, -578, 392, 46, 12, 2, '#FFFFFF'); fillRR(g, -578, 392, 46, 4, 2, C.blue); text(g, 'GUEST BOOK', -555, 402, 4.6, 800, C.ink, 'center');
      fillE(g, -488, 398, 22, 7, '#FFFFFF'); [-500, -490, -480, -495, -484].forEach(function (ox, i) { fillE(g, ox, 391 - (i > 2 ? 6 : 0), 6, 6, '#F2A033'); }); }
    /* the welcome totem: a portrait screen on a slim base */
    var T0 = TOT; soft(g, T0.x + T0.w / 2, F + 4, 46, 7, 0.24); fillRR(g, T0.x + T0.w / 2 - 22, F - 8, 44, 8, 4, '#5C6B7A');
    shadowed(g, 12, 5, 0.2, function () { fillRR(g, T0.x, T0.y, T0.w, T0.h, 10, '#2A3550'); }); fillRR(g, T0.x + 5, T0.y + 6, T0.w - 10, T0.h - 34, 5, '#FFFFFF');
    plane(g, T0.x + T0.w / 2 - 12, T0.y + T0.h - 14, 0.55, 0, '#FFFFFF'); text(g, 'TechNext', T0.x + T0.w / 2 + 4, T0.y + T0.h - 11, 7, 800, '#FFFFFF', 'center');
  }
  function totemLive(g, t) { /* three slides: welcome, the partner badge, the three offices; a progress bar under each */
    var T0 = TOT, x = T0.x + 5, y = T0.y + 6, w = T0.w - 10, h = T0.h - 34, cx = x + w / 2, sl = Math.floor(t / 4) % 3, u = (t % 4) / 4;
    g.save(); rr(g, x, y, w, h, 5); g.clip();
    if (sl === 0) { fillRR(g, x, y, w, h, 0, '#EAF1FD'); plane(g, cx, y + 54 - Math.sin(t * 2) * 4, 1.6, 0, C.blue); text(g, 'Welcome', cx, y + 100, 9, 800, C.ink, 'center'); text(g, 'to TechNext', cx, y + 112, 7, 700, '#5C5C73', 'center');
      text(g, 'Singapore HQ', cx, y + 138, 6, 800, C.blue, 'center'); text(g, '#03-36', cx, y + 148, 6, 700, '#5C5C73', 'center'); }
    else if (sl === 1) { fillRR(g, x, y, w, h, 0, '#F7F0F5'); fillE(g, cx, y + 56, 22, 22, C.odoo); fillE(g, cx, y + 56, 11, 11, '#F7F0F5'); text(g, 'Odoo', cx, y + 100, 9, 800, C.odoo, 'center'); text(g, 'Ready Partner', cx, y + 112, 7, 800, C.ink, 'center');
      text(g, 'Odoo 20', cx, y + 140, 7, 800, '#5C5C73', 'center'); }
    else { fillRR(g, x, y, w, h, 0, '#FFFFFF'); [['Singapore', C.sg], ['Taguig City', C.ph], ['Ho Chi Minh', C.vn]].forEach(function (c, i) { var yy = y + 34 + i * 40, on = u * 3 > i;
        fillE(g, x + 12, yy, 6, 6, on ? c[1] : '#DCE3EE'); if (i < 2) { g.fillStyle = '#DCE3EE'; g.fillRect(x + 11, yy + 6, 2, 28); } text(g, c[0], x + 22, yy + 3, 6.2, 800, on ? C.ink : '#9AA6BC'); });
      text(g, 'one team', cx, y + 156, 7, 800, C.blue, 'center'); }
    fillRR(g, x + 6, y + h - 8, (w - 12) * u, 3, 1.5, [C.sg, C.odoo, C.ph][sl]); g.restore();
  }
  function paintBack(g, ext) {
    lobbyBack(g, ext);
    wideBack(g, ext); mapBack(g); agentBack(g); if (ext.r > 1060) teamWall(g);
    sign(g, BAY.sg, C.sg); sign(g, BAY.ph, C.ph); sign(g, BAY.vn, C.vn);
    /* SG: the rolling whiteboard; the pull-down training screen */
    var b = T.board; soft(g, b.x + b.w / 2, F + 4, b.w * 0.6, 9, 0.22); g.fillStyle = '#9AA6BC'; g.fillRect(b.x + 12, b.y + b.h, 5, F - b.y - b.h - 8); g.fillRect(b.x + b.w - 17, b.y + b.h, 5, F - b.y - b.h - 8);
    fillRR(g, b.x + 4, F - 12, 26, 6, 3, '#7A869C'); fillRR(g, b.x + b.w - 30, F - 12, 26, 6, 3, '#7A869C'); fillE(g, b.x + 10, F - 4, 4, 4, '#2A3550'); fillE(g, b.x + b.w - 10, F - 4, 4, 4, '#2A3550');
    shadowed(g, 12, 5, 0.18, function () { fillRR(g, b.x, b.y, b.w, b.h, 6, '#C9D1DD'); }); fillRR(g, b.x + 5, b.y + 5, b.w - 10, b.h - 10, 3, '#FFFFFF');
    fillRR(g, b.x + 20, b.y + b.h - 2, b.w - 40, 6, 3, '#AAB4C4'); fillRR(g, b.x + 30, b.y + b.h - 6, 14, 4, 2, C.blue); fillRR(g, b.x + 50, b.y + b.h - 6, 14, 4, 2, '#E0456B');
    text(g, 'HOW AN ORDER MOVES', b.x + 12, b.y + 20, 7.5, 800, C.blueD);
    var sc = T.screen; g.strokeStyle = '#9AA6BC'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(sc.x + 12, RAIL); g.lineTo(sc.x + 12, sc.y); g.moveTo(sc.x + sc.w - 12, RAIL); g.lineTo(sc.x + sc.w - 12, sc.y); g.stroke();
    fillRR(g, sc.x - 6, sc.y - 6, sc.w + 12, 9, 4, '#2A3550'); shadowed(g, 8, 3, 0.14, function () { fillRR(g, sc.x, sc.y, sc.w, sc.h, 2, '#FBFCFF'); }); fillRR(g, sc.x - 3, sc.y + sc.h - 2, sc.w + 6, 6, 3, '#2A3550');
    /* PH: the configuration display on its stand; the support screen on the column */
    var d = T.disp; soft(g, d.x + d.w / 2, F + 4, 60, 8, 0.22); g.fillStyle = '#7A869C'; g.fillRect(d.x + d.w / 2 - 4, d.y + d.h, 8, F - d.y - d.h - 6); fillRR(g, d.x + d.w / 2 - 34, F - 8, 68, 8, 4, '#5C6B7A');
    shadowed(g, 14, 6, 0.22, function () { fillRR(g, d.x - 6, d.y - 6, d.w + 12, d.h + 12, 8, '#2A3550'); }); fillRR(g, d.x, d.y, d.w, d.h, 3, '#FFFFFF');
    fillRR(g, d.x, d.y, d.w, 14, 3, C.odoo); g.fillRect(d.x, d.y + 8, d.w, 6); text(g, 'yourcompany · STAGING', d.x + 8, d.y + 10.5, 6.5, 800, '#FFFFFF');
    var sp = T.sup; shadowed(g, 10, 4, 0.2, function () { fillRR(g, sp.x - 5, sp.y - 5, sp.w + 10, sp.h + 10, 8, '#2A3550'); }); fillRR(g, sp.x, sp.y, sp.w, sp.h, 3, '#F7F9FC');
    fillRR(g, sp.x, sp.y, sp.w, 14, 3, C.ink); g.fillRect(sp.x, sp.y + 8, sp.w, 6); text(g, 'SUPPORT · ONE CHANNEL', sp.x + sp.w / 2, sp.y + 10.5, 6, 800, '#FFFFFF', 'center');
    /* VN: the hologram table's base; the server rack */
    var h = T.holo; soft(g, h.x + h.w / 2, F + 4, 60, 8, 0.24); fillRR(g, h.x + h.w / 2 - 12, h.y + 10, 24, F - h.y - 14, 4, '#3A4458'); fillRR(g, h.x + h.w / 2 - 30, F - 8, 60, 8, 4, '#2A3142');
    var r = T.rack; soft(g, r.x + r.w / 2, F + 4, 50, 8, 0.25); fillRR(g, r.x, r.y, r.w, F - r.y, 6, '#2A3142'); fillRR(g, r.x + 5, r.y + 6, r.w - 10, F - r.y - 14, 3, '#3A4458');
    for (var u = 0; u < 9; u++) { fillRR(g, r.x + 8, r.y + 12 + u * 24, r.w - 16, 18, 2, '#222A3A'); g.fillStyle = 'rgba(255,255,255,.08)'; g.fillRect(r.x + 10, r.y + 14 + u * 24, r.w - 20, 2); }
    text(g, 'AI LAB', r.x + r.w / 2, r.y - 6, 8, 800, C.vn, 'center');
  }

  /* ---------------- static front props: the developer's desk, the plugs, the hologram table top ---------------- */
  function paintFront(g, ext) {
    var d = T.desk, top = d.y; soft(g, d.x + d.w / 2, F + 4, d.w * 0.6, 9, 0.24);
    fillRR(g, d.x + 6, top + 8, 8, F - top - 8, 3, '#7A869C'); fillRR(g, d.x + d.w - 14, top + 8, 8, F - top - 8, 3, '#7A869C'); fillRR(g, d.x + 6, F - 6, 30, 6, 3, '#7A869C'); fillRR(g, d.x + d.w - 36, F - 6, 30, 6, 3, '#7A869C');
    fillRR(g, d.x - 6, top, d.w + 12, 12, 5, '#C9A27A'); g.fillStyle = 'rgba(255,255,255,.3)'; g.fillRect(d.x - 4, top + 2, d.w + 8, 2);
    /* two monitors on arms (their content is live), a keyboard, a mug */
    [[d.x + 8, 72], [d.x + 84, 60]].forEach(function (m) { g.fillStyle = '#5C6B7A'; g.fillRect(m[0] + m[1] / 2 - 2, top - 14, 4, 14); fillRR(g, m[0] + m[1] / 2 - 14, top - 4, 28, 5, 2, '#5C6B7A'); fillRR(g, m[0], top - 56, m[1], 42, 5, '#2A3550'); });
    fillRR(g, d.x + 30, top - 6, 60, 7, 3, '#DDE3EC'); fillRR(g, d.x + 108, top - 4, 16, 4, 2, '#2A3550'); fillE(g, d.x + 116, top - 5, 4, 2.4, '#5C6B7A');
    /* the integration hub on the desk front: three plugs (bank, card, store) into Odoo */
    var hx = d.x + 18, hy = top + 12; fillRR(g, hx, hy, d.w - 36, 26, 9, '#FFFFFF'); g.strokeStyle = '#DCE3EE'; g.lineWidth = 2; rr(g, hx, hy, d.w - 36, 26, 9); g.stroke();
    fillE(g, hx + (d.w - 36) / 2, hy + 13, 10, 10, C.odoo); text(g, 'odoo', hx + (d.w - 36) / 2, hy + 15.5, 5.6, 800, '#FFFFFF', 'center');
    [[hx + 18, C.ph, 'BANK'], [hx + 44, '#F2B233', 'PAY'], [hx + d.w - 36 - 44, C.sg, 'SHOP'], [hx + d.w - 36 - 18, C.vn, 'AI']].forEach(function (p) { fillE(g, p[0], hy + 13, 7, 7, p[1]); });
    /* the hologram table's top */
    var h = T.holo; fillE(g, h.x + h.w / 2, h.y + 8, h.w / 2 + 6, 10, '#2A3142'); fillE(g, h.x + h.w / 2, h.y + 4, h.w / 2, 9, '#3A4458'); fillE(g, h.x + h.w / 2, h.y + 4, h.w / 2 - 14, 5, '#7FE3FF');
  }

  /* ---------------- passers-by in the margins ---------------- */
  var W = CR.who;
  var CREW = [
    { x0: -760, x1: -530, y: 476, spd: 18, ph: 0.3, label: 'Reception, Singapore HQ', lines: ['Welcome to **TechNext**! Sign in, and grab a visitor pass.', 'Our IDs open every office door: **Singapore, Taguig City, Ho Chi Minh City**.'],
      P: W({ s: 0.5, skin: 1, hair: 0, style: 'bun', clip: '#FFD84A', outfit: 'shirt', top: '#DCE7FB', low: '#2A3550', headset: '#3167CA', hold: 'clipboard', hands: [[-70, -150], [70, -150]] }) },
    { x0: -400, x1: 30, y: 494, spd: 20, ph: 0.7, label: 'Project manager', lines: ['Your **project manager** keeps the plan on one page.', 'Status update: on track!'], acts: ['id', 'jump', 'wave', 'spin'],
      P: W({ s: 0.5, skin: 3, hair: 1, style: 'short', outfit: 'polo', top: '#F2B233', top2: '#1B1F3B', low: '#3A4458', shoe: '#FFFFFF', glasses: true, hold: 'tablet', hands: [[-60, -200], [70, -150]] }) },
    { x0: 1066, x1: 1230, y: 486, spd: 16, ph: 0.2, label: 'Odoo consultant', lines: ['Coffee first, then **month-end close**.', 'We\u2019re hiring in **Taguig City**. Check the board!'], acts: ['wave', 'dance', 'id'],
      P: W({ s: 0.5, skin: 2, hair: 0, style: 'short', outfit: 'cardigan', top: '#14A38B', top2: '#FFFFFF', low: '#2A3550', glasses: true, hold: 'tablet' }) },
    { front: true, x0: -900, x1: -530, y: 748, spd: 24, ph: 0.4, label: 'Functional consultant', lines: ['Workshop in ten minutes. **Discovery** room!', 'Every step of your process, matched to an **Odoo app**.'], acts: ['cheer', 'id', 'spin'],
      P: W({ s: 0.58, skin: 0, hair: 2, style: 'long', outfit: 'shirt', top: '#E0456B', low: '#2A3550', shoe: '#FFFFFF', hold: 'clipboard', hands: [[-60, -212], [70, -150]] }) },
    { front: true, x0: 1100, x1: 1220, y: 700, spd: 22, ph: 0.6, label: 'Solutions architect', lines: ['Standard first, **custom only where it pays**.', 'This box? New laptops for the **Taguig City** team.'], acts: ['jump', 'id', 'wave'],
      P: W({ s: 0.58, skin: 4, hair: 0, style: 'short', outfit: 'polo', top: '#2A3550', top2: '#DCE7FB', low: '#3A4458', glasses: true, build: 1.1, hold: 'box', hands: [[-60, -212], [64, -216]] }) },
    { x0: -940, x1: -530, y: 500, spd: 26, ph: 0.55, drag: '#3167CA', label: 'Consultant, off to a client site', lines: ['Off to a **client site**. Laptop, ID, the scope on one page.', 'Back on Friday for the **training** session!'], acts: ['wave', 'id', 'jump'],
      P: W({ s: 0.54, skin: 2, hair: 1, style: 'short', outfit: 'shirt', top: '#DCE7FB', low: '#2A3550', glasses: true }) }
  ];
  function crew(g, t, S, layer) { var ext = S.ext;
    CREW.forEach(function (w) { var L = (w.front || w.y >= 560) ? 'fore' : w.y > 470; if (L !== layer) return; var a = Math.max(w.x0, ext.l + 40), b = Math.min(w.x1, ext.r - 50); if (b - a < 60) return;
      var Wk = w._W || (w._W = { y: w.y, spd: w.spd, ph: w.ph, P: w.P, label: w.label, lines: w.lines, acts: w.acts, drag: w.drag }); Wk.x0 = a; Wk.x1 = b; CR.walk(g, Wk, t); }); }

  /* ---------------- live ---------------- */
  function cityTime(now, off) { var d = new Date(now.getTime() + off * 3600e3); return { h: d.getUTCHours(), m: d.getUTCMinutes(), s: d.getUTCSeconds() }; }
  function hands(g, x, y, tm) {
    var hr = (tm.h % 12 + tm.m / 60) * Math.PI / 6 - Math.PI / 2, mn = (tm.m + tm.s / 60) * Math.PI / 30 - Math.PI / 2, se = tm.s * Math.PI / 30 - Math.PI / 2;
    g.lineCap = 'round'; g.strokeStyle = C.ink; g.lineWidth = 2.6; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(hr) * 7, y + Math.sin(hr) * 7); g.stroke();
    g.lineWidth = 1.8; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(mn) * 10.5, y + Math.sin(mn) * 10.5); g.stroke();
    g.strokeStyle = '#E0456B'; g.lineWidth = 1; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(se) * 12, y + Math.sin(se) * 12); g.stroke(); fillE(g, x, y, 2, 2, C.ink);
  }
  var CAP = { x: BAY.sg.x, v: 0, wait: 0, run: -9, last: 0 };
  function capsule(g, t, S) {
    var dt = Math.min(0.1, Math.max(0, t - CAP.last)); CAP.last = t;
    var run = t - CAP.run, tx;
    if (run < 4.5) tx = run < 1.5 ? BAY.vn.x + 40 : run < 3 ? BAY.sg.x - 60 : BAY.ph.x; /* tapped: a quick run over all three offices */
    else if (S.hot && STOP_BAY[S.hot]) tx = BAY[STOP_BAY[S.hot]].x;
    else if (S.hot === 'support') tx = BAY.ph.x + Math.sin(t * 0.9) * 290;
    else { var seq = [BAY.sg.x, BAY.ph.x, BAY.vn.x, BAY.ph.x], i = Math.floor(t / 5) % 4; tx = seq[i]; }
    var acc = (tx - CAP.x) * 9 - CAP.v * 5.2; CAP.v += acc * dt; CAP.x += CAP.v * dt;
    var x = CAP.x, y = RAIL + 6, sw = clamp(-CAP.v / 260, -0.35, 0.35);
    S._cap = { x: x, y: y + 18 };
    fillRR(g, x - 16, RAIL - 7, 32, 12, 4, '#2A3550'); fillE(g, x - 9, RAIL + 4, 4, 4, '#9AA6BC'); fillE(g, x + 9, RAIL + 4, 4, 4, '#9AA6BC');
    g.save(); g.translate(x, y + 6); g.rotate(sw); g.strokeStyle = '#2A3550'; g.lineWidth = 3; g.beginPath(); g.moveTo(0, -4); g.lineTo(0, 6); g.stroke();
    shadowed(g, 8, 4, 0.2, function () { fillRR(g, -34, 6, 68, 24, 12, C.blue); }); fillRR(g, -30, 8, 60, 7, 4, 'rgba(255,255,255,.22)');
    plane(g, -15, 18, 0.7, 0, '#FFFFFF', C.blue); text(g, 'PROJECT', 5, 21.5, 7.5, 800, '#FFFFFF');
    var on = Math.floor(t * 2) % 2; fillE(g, 28, 18, 3, 3, on ? '#7FFFD4' : '#FFFFFF'); g.restore();
  }
  var PL = { loop: -9 };
  function paperPlane(g, t, S) {
    var u = t * 0.16, x = 560 + Math.sin(u) * 430, y = 10 + Math.sin(u * 2) * 46, dx = Math.cos(u) * 430 * 0.16, dy = Math.cos(u * 2) * 46 * 0.32, a = Math.atan2(dy, dx);
    var lp = t - PL.loop; if (lp < 1.4) { var q = lp / 1.4, ang = q * Math.PI * 2; x += Math.sin(ang) * 40 * (dx > 0 ? 1 : -1); y += -(1 - Math.cos(ang)) * 40; a += (dx > 0 ? -1 : 1) * ang; }
    S._pl = { x: x, y: y };
    g.save(); g.globalAlpha = 0.18; plane(g, x + 6, y + 30, 1.6, a + 0.68, '#1E4691'); g.restore();
    plane(g, x, y, 1.6, a + 0.68, '#FFFFFF', C.blue);
    g.strokeStyle = 'rgba(49,103,202,.25)'; g.lineWidth = 2; g.setLineDash([3, 5]); g.beginPath(); g.moveTo(x - Math.cos(a) * 14, y - Math.sin(a) * 14); g.lineTo(x - Math.cos(a) * 60, y - Math.sin(a) * 60); g.stroke(); g.setLineDash([]);
  }
  /* ---------------- the live extras of the floor ---------------- */
  var CONs = { notes: 0, noteT: -9, u: -1, k: 0, last: 0 }, DEVs = { sip: 0, merge: -1, b: 0 }, AIs = { boost: -9, orb: -1, b: 0 };
  function mapLive(g, t) {
    var a = mp(PINS.sg[0], PINS.sg[1]), b = mp(PINS.ph[0], PINS.ph[1]), c = mp(PINS.vn[0], PINS.vn[1]), legs = [[a, b], [b, c], [c, a]];
    g.save(); g.strokeStyle = 'rgba(30,70,145,.45)'; g.lineWidth = 1.4; g.setLineDash([3, 3]); g.lineDashOffset = -t * 8;
    legs.forEach(function (L) { var mx = (L[0][0] + L[1][0]) / 2, my = Math.min(L[0][1], L[1][1]) - 16; g.beginPath(); g.moveTo(L[0][0], L[0][1]); g.quadraticCurveTo(mx, my, L[1][0], L[1][1]); g.stroke(); });
    g.setLineDash([]); g.restore();
    var q = (t * 0.28) % 3, i = Math.floor(q), f = q - i, L = legs[i], mx = (L[0][0] + L[1][0]) / 2, my = Math.min(L[0][1], L[1][1]) - 16;
    var px = (1 - f) * (1 - f) * L[0][0] + 2 * (1 - f) * f * mx + f * f * L[1][0], py = (1 - f) * (1 - f) * L[0][1] + 2 * (1 - f) * f * my + f * f * L[1][1];
    plane(g, px, py, 0.55, Math.atan2(L[1][1] - L[0][1], L[1][0] - L[0][0]) + 0.68 - 0.6, C.blue);
    [[a, C.sg, 'SG'], [b, C.ph, 'PH'], [c, C.vn, 'VN']].forEach(function (p, k) { var r = (t * 0.8 + k * 0.33) % 1; g.globalAlpha = 1 - r; g.strokeStyle = p[1]; g.lineWidth = 1.5; g.beginPath(); g.arc(p[0][0], p[0][1], 3 + r * 9, 0, Math.PI * 2); g.stroke(); g.globalAlpha = 1;
      fillE(g, p[0][0], p[0][1], 4, 4, '#FFFFFF'); fillE(g, p[0][0], p[0][1], 2.8, 2.8, p[1]); text(g, p[2], p[0][0] + (k === 1 ? 7 : -7), p[0][1] - 5, 5.6, 800, C.ink, k === 1 ? 'left' : 'right'); });
  }
  function agentLive(g, t, S) {
    var a = AG, run = S.hot === 'ai' ? (t - (S.aT || 0)) * 1.4 : t * 0.45, ph = run % 4;
    [['Read the request', 'mail'], ['Look it up in Odoo', 'odoo'], ['Draft the reply', 'ok']].forEach(function (r, i) { var y = a.y + 22 + i * 18, on = ph > i + 0.4, busy = ph > i && !on;
      fillRR(g, a.x + 6, y - 6, a.w - 12, 14, 4, on ? '#FFF3E6' : '#F4F6FA'); fillE(g, a.x + 14, y + 1, 4, 4, on ? '#2BC48A' : busy ? C.vn : '#D5DCE6');
      if (on) { g.strokeStyle = '#FFFFFF'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(a.x + 12, y + 1); g.lineTo(a.x + 13.6, y + 2.6); g.lineTo(a.x + 16.4, y - 0.6); g.stroke(); }
      if (busy) { g.strokeStyle = C.vn; g.lineWidth = 1.2; g.beginPath(); g.arc(a.x + 14, y + 1, 5.5, t * 6, t * 6 + 3.6); g.stroke(); }
      text(g, r[0], a.x + 22, y + 3.4, 6, 800, on ? C.ink : '#8A96A8'); });
    fillRR(g, a.x + 6, a.y + a.h - 8, (a.w - 12) * clamp(ph / 3.4, 0, 1), 3, 1.5, C.vn);
  }
  function hangLive(g, t, S) {
    COL.hangPlant(g, 508, RAIL, 86, t, 1, 1); COL.parol(g, 724, RAIL, 34, t, '#F2B233', C.ph, 0.62, 2, Math.sin(t * 0.3) * 0.15);
    COL.lantern(g, 798, RAIL, 58, t, '#E2453C', 0.68, 0.5); COL.lantern(g, 1004, RAIL, 84, t, '#F2B233', 0.6, 2.2);
    if (S.ext.l < 100) COL.hangPlant(g, 98, RAIL, 120, t, 0.9, 3);
  }
  function boardLive(g, t, S) {
    /* the consultant's writing: a line grows under the steps while she writes, and wipes when she steps back */
    var bd = T.board, ph = (t + 2) % 9, w = clamp(ph / 4.5, 0, 1) * (bd.w - 30), y = bd.y + 101;
    if (S.hot !== 'discovery' && S.hot !== 'train' && ph < 6) { g.strokeStyle = C.blue; g.lineWidth = 1.4; g.lineCap = 'round'; g.beginPath(); g.moveTo(bd.x + 14, y); for (var x = 0; x <= w; x += 3) g.lineTo(bd.x + 14 + x, y + Math.sin(x * 0.7) * 1.6); g.stroke(); }
    /* the sticky notes she slaps on the board's top edge (one per tap, three at most) */
    for (var i = 0; i < CONs.notes; i++) { var land = i === CONs.notes - 1 ? clamp((t - CONs.noteT) / 0.25, 0, 1) : 1, sc = 0.6 + 0.4 * land;
      COL.note(g, bd.x + 26 + i * 40, bd.y - 2, 22 * sc, (i - 1) * 0.12, ['#FFE680', '#FFC2D1', '#B8EBD3'][i], ['Scope', 'Apps', 'Go-live'][i]); }
  }
  function paintLive(g, t, now, S) {
    crew(g, t, S, false); mapLive(g, t); agentLive(g, t, S); hangLive(g, t, S); boardLive(g, t, S); if (S.ext.r > 1330) COL.draw([XS[0]], g, t, S);
    if (S.ext.l < 60) totemLive(g, t);
    /* the three local clocks */
    ['sg', 'ph', 'vn'].forEach(function (key) { var b = BAY[key]; hands(g, b.x - 52, -55, cityTime(now, b.off)); });
    /* the whiteboard: the process map draws itself; on Discovery, the Odoo apps light up under each step */
    var bd = T.board, dk = S.hot === 'discovery', dp = dk ? clamp((t - (S.dT || 0)) / 1.6, 0, 1) : 1, notes = [['Quote', '#FFE680'], ['Order', '#FFC2D1'], ['Deliver', '#B8EBD3'], ['Bill', '#C4DAFB']];
    notes.forEach(function (n, i) { var nx = bd.x + 12 + i * 31, ny = bd.y + 34 + (i % 2) * 6; fillRR(g, nx, ny, 26, 24, 2, n[1]); text(g, n[0], nx + 13, ny + 15, 5.6, 800, C.ink, 'center');
      if (i < 3) { g.strokeStyle = C.ink; g.lineWidth = 1.2; g.beginPath(); g.moveTo(nx + 27, ny + 12); g.lineTo(nx + 30, ny + 12); g.stroke(); }
      var lit = dk ? dp > i / 4 : true; fillE(g, nx + 13, bd.y + 86, 8, 8, lit ? ['#3167CA', '#3167CA', '#14A38B', '#714B67'][i] : '#E3E8EF'); });
    g.strokeStyle = 'rgba(49,103,202,.6)'; g.lineWidth = 1.4; g.setLineDash([2, 3]); g.beginPath(); for (var j = 0; j < 4; j++) { g.moveTo(bd.x + 25 + j * 31, bd.y + 64); g.lineTo(bd.x + 25 + j * 31, bd.y + 76); } g.stroke(); g.setLineDash([]);
    text(g, '14 steps · 6 apps', bd.x + 12, bd.y + 114, 7, 800, C.ink); fillRR(g, bd.x + 12, bd.y + 120, (bd.w - 24) * dp, 4, 2, C.sg);
    /* the training screen: a slide that pages through the three exercises */
    var sc = T.screen, tr = S.hot === 'train', pg = tr ? Math.floor((t - (S.tT || 0)) / 1.2) % 3 : Math.floor(t / 3) % 3;
    text(g, 'TRAINING · SALES', sc.x + 8, sc.y + 14, 6.5, 800, C.blueD); [['Quote', '#3167CA'], ['Deliver', '#14A38B'], ['Invoice', '#714B67']].forEach(function (s, i) { fillRR(g, sc.x + 8 + i * 29, sc.y + 24, 26, 26, 4, i <= pg ? s[1] : '#E3E8EF'); text(g, s[0], sc.x + 21 + i * 29, sc.y + 62, 5.6, 800, i <= pg ? C.ink : '#9AA6BC', 'center'); });
    fillRR(g, sc.x + 8, sc.y + 72, sc.w - 16, 5, 2, '#E3E8EF'); fillRR(g, sc.x + 8, sc.y + 72, (sc.w - 16) * (pg + 1) / 3, 5, 2, C.sg); text(g, 'Exercise ' + (pg + 1) + ' of 3', sc.x + 8, sc.y + 90, 6.5, 700, '#5C5C73');
    /* the configuration display: the apps switch on, the import bar fills */
    var d = T.disp, ck = S.hot === 'configure', cp = ck ? clamp((t - (S.cT || 0)) / 2.2, 0, 1) : 0.5 + 0.5 * Math.sin(t * 0.4);
    [['Sales', '#3167CA'], ['Inventory', '#14A38B'], ['Accounting', '#714B67'], ['Purchase', '#F2B233']].forEach(function (a, i) { var ax = d.x + 10 + (i % 2) * 70, ay = d.y + 22 + Math.floor(i / 2) * 30, on = ck ? cp > i / 4 : i < 3;
      fillRR(g, ax, ay, 62, 24, 5, '#F1F4F9'); fillRR(g, ax + 4, ay + 4, 16, 16, 4, a[1]); text(g, a[0], ax + 24, ay + 11, 5.8, 800, C.ink);
      fillRR(g, ax + 24, ay + 14, 18, 7, 3.5, on ? C.ph : '#CBD3DE'); fillE(g, ax + (on ? 38.5 : 27.5), ay + 17.5, 2.6, 2.6, '#FFFFFF'); });
    fillRR(g, d.x + 10, d.y + 84, d.w - 20, 6, 3, '#E3E8EF'); fillRR(g, d.x + 10, d.y + 84, (d.w - 20) * (ck ? cp : 1), 6, 3, C.ph);
    /* the developer's monitors: code scrolls; on Integration, a payment and a bank line flow into Odoo */
    var dk2 = T.desk, top = dk2.y, ig = S.hot === 'integrate';
    /* the support screen: tickets arrive from the three offices into one queue */
    var sp = T.sup, su = S.hot === 'support', tk = su ? Math.floor((t - (S.sT || 0)) * 1.2) : Math.floor(t * 0.5);
    for (var q = 0; q < 3; q++) { var n = tk - q, col = [C.sg, C.ph, C.vn][((n % 3) + 3) % 3], yy = sp.y + 20 + q * 18; fillRR(g, sp.x + 6, yy, sp.w - 12, 14, 4, q === 0 && su ? '#E6F6F2' : '#FFFFFF'); fillE(g, sp.x + 14, yy + 7, 3.4, 3.4, col);
      text(g, '#00' + (40 + ((n % 50) + 50) % 50), sp.x + 22, yy + 9.6, 6, 800, C.ink); fillRR(g, sp.x + sp.w - 34, yy + 4, 26, 6, 3, q === 0 ? C.ph : '#CBD3DE'); }
    /* the server rack's LEDs */
    var r = T.rack; for (var u = 0; u < 9; u++) for (var lx = 0; lx < 3; lx++) { var on = hash(u * 3 + lx + Math.floor(t * 4 + u)) > 0.45; fillE(g, r.x + 14 + lx * 7, r.y + 21 + u * 24, 1.8, 1.8, on ? (lx === 2 ? C.vn : '#7FE3C4') : '#4A5468'); }
    /* the AI hologram: rings turn over the table; on AI, the assistant answers */
    var h = T.holo, hc = h.x + h.w / 2, ai = S.hot === 'ai', ap = ai ? clamp((t - (S.aT || 0)) / 1.4, 0, 1) : 0;
    g.save(); var beam = g.createLinearGradient(0, h.y, 0, h.y - 150); beam.addColorStop(0, 'rgba(127,227,255,.38)'); beam.addColorStop(1, 'rgba(127,227,255,0)'); g.fillStyle = beam;
    g.beginPath(); g.moveTo(hc - 28, h.y + 2); g.lineTo(hc + 28, h.y + 2); g.lineTo(hc + 46, h.y - 150); g.lineTo(hc - 46, h.y - 150); g.closePath(); g.fill();
    var bst = COL.bell(clamp((t - AIs.boost) / 2, 0, 1)); g.strokeStyle = bst > 0.05 ? 'rgba(240,138,36,.85)' : 'rgba(80,200,240,.75)'; g.lineWidth = 1.6 + bst; for (var ri = 0; ri < 3; ri++) { var ry = h.y - 40 - ri * 30, rx = 30 - ri * 4 + bst * 8, sp2 = t * (0.8 + ri * 0.3) + bst * (ri + 1) * 3 * Math.sin(t * 3); g.beginPath(); g.ellipse(hc, ry, rx, 6 + Math.sin(sp2) * 3, 0, 0, Math.PI * 2); g.stroke(); fillE(g, hc + Math.cos(sp2) * rx, ry + Math.sin(sp2) * 4, 2.6, 2.6, '#FFFFFF'); }
    fillE(g, hc, h.y - 100, 13, 13, 'rgba(127,227,255,.55)'); fillE(g, hc, h.y - 100, 7, 7, '#FFFFFF'); g.restore();
    if (ai || (t % 9) < 3.5) { var bx = hc - 64, by = h.y - 178, ba = ai ? ap : clamp(((t % 9)) * 2, 0, 1) * clamp((3.5 - (t % 9)) * 2, 0, 1);
      g.save(); g.globalAlpha = ba; fillRR(g, bx, by, 128, 30, 9, 'rgba(255,255,255,.95)'); g.beginPath(); g.moveTo(hc - 6, by + 30); g.lineTo(hc, by + 38); g.lineTo(hc + 6, by + 30); g.closePath(); g.fill();
      text(g, ai ? 'Answer from SOP-12 · Returns' : 'Ask me about stock levels', hc, by + 13, 6.4, 800, C.ink, 'center'); text(g, ai ? 'Log it on the delivery, 7 days' : 'Knowledge assistant · sample', hc, by + 24, 5.8, 700, '#5C5C73', 'center'); g.restore(); }
    capsule(g, t, S);
    paperPlane(g, t, S);
  }
  function handsLive(g, t, S) {
    /* the consultant's marker and sticky note */
    var P = CON, u = CONs.u;
    if (u >= 0 && CONs.k === 0) { var h = COL.hand(P, 1); COL.marker(g, h[0], h[1] - COL.bell(clamp((u - 0.1) / 0.8, 0, 1)) * 70, u * Math.PI * 5, '#E0456B'); }
    else if (u >= 0 && CONs.k === 1 && u > 0.3 && u < 0.62) { var hn = COL.hand(P, 0); COL.note(g, hn[0], hn[1] - 6, 16, -0.2, ['#FFE680', '#FFC2D1', '#B8EBD3'][CONs.notes % 3]); }
    else { var hl = COL.hand(P, 0); COL.marker(g, hl[0] - 2, hl[1] - 4, -0.7, C.blue); }
    /* the developer's mug: on the desk, or in his hand when he sips */
    var d = T.desk, top = d.y;
    if (DEVs.sip) { var hm = COL.hand(DEV, 1); COL.mug(g, hm[0] - 4, hm[1] + 4, 0.9, '#FFFFFF', C.blue); }
    else { COL.mug(g, d.x + 140, top, 0.9, '#FFFFFF', C.blue); COL.steam(g, d.x + 140, top - 20, t, 0.45, 2); }
    if (DEVs.merge >= 0) { var hd = COL.head(DEV); COL.pop(g, hd[0], hd[1] - 70, '\u2713 Merged to staging', DEVs.merge, '#0E7A50'); }
    /* the AI engineer's light orb: up out of the hologram, into his hand */
    if (AIs.orb >= 0) { var ho = T.holo, hc = ho.x + ho.w / 2, ha = COL.hand(AIE, 0), u2 = AIs.orb, ox = lerp(hc, ha[0], u2), oy = lerp(ho.y - 100, ha[1] - 8, u2) - Math.sin(u2 * Math.PI) * 120;
      fillE(g, ox, oy, 12, 12, 'rgba(127,227,255,.35)'); fillE(g, ox, oy, 6.5, 6.5, '#FFFFFF'); fillE(g, ox, oy, 4, 4, '#7FE3FF'); }
  }
  function paintFrontLive(g, t, S) {
    crew(g, t, S, true); handsLive(g, t, S);
    var dk2 = T.desk, top = dk2.y, ig = S.hot === 'integrate';
    [[dk2.x + 8, 72], [dk2.x + 84, 60]].forEach(function (m, mi) { fillRR(g, m[0] + 4, top - 52, m[1] - 8, 34, 2, mi ? '#1E2A3A' : '#FFFFFF');
      for (var l = 0; l < 4; l++) { var w = 10 + hash(l + mi * 7 + Math.floor(t * 1.5)) * (m[1] - 26); fillRR(g, m[0] + 8 + (l % 2) * 6, top - 47 + l * 7.5, w, 3.4, 1.5, mi ? ['#7FE3C4', '#FFD84A', '#9FC4FF'][l % 3] : ['#3167CA', '#C9D3E3', '#14A38B'][l % 3]); } });
    var hx = dk2.x + 18, hy = top + 12, cx = hx + (dk2.w - 36) / 2, flow = ig ? ((t - (S.iT || 0)) * 1.4) % 1 : (t * 0.35) % 1;
    [[hx + 18, C.ph], [hx + 44, '#F2B233'], [hx + dk2.w - 36 - 44, C.sg]].forEach(function (p, i) { var q = (flow + i * 0.33) % 1, px = lerp(p[0], cx, q); fillE(g, px, hy + 13 + Math.sin(q * Math.PI) * -6, 2.6, 2.6, p[1]); });
  }

  /* ---------------- the foreground (in depth order with the front-row passers-by) ---------------- */
  var VAC = { ph: 260 };
  var XS = [
    { P: W({ x: 1396, y: 476, s: 0.52, ph: 0.9, skin: 3, hair: 0, style: 'bun', outfit: 'cardigan', top: '#14A38B', top2: '#FFFFFF', low: '#2A3550' }), hands: [[-70, -150], [56, -250]],
      box: [1396, 360, 80, 240], who: 'Odoo consultant', role: 'Coffee bar \u00B7 illustration', near: [880, 120], pose: 'love', dur: [1.6, 1.8], fx: ['heart', 'note'],
      lines: ['Kopi, kape, c\u00E0 ph\u00EA: **three offices**, one coffee bar.', 'Refill, then back to the **month-end close**.'],
      idle: function (P, t) { var c = (t + 1.3) % 6; if (c < 1.3) { P.hands[1] = [26, -330]; P.look = 0; } else { P.look = Math.sin(t * 0.5) * 0.7; } P.mood = c > 4 ? 'happy' : 'calm'; },
      moves: [function (P, u) { P.hands = [[-90, -260], [110, -410]]; P.hop = COL.bell(u) * 16; }, function (P, u, t) { P.sx = Math.cos(COL.ease(u) * Math.PI * 2); P.hands = [[-70, -150], [70, -280]]; P.tilt = Math.sin(t * 9) * 0.06; }],
      after: function (g, P, t, S, X, u) { var h = COL.hand(P, 1); COL.mug(g, h[0], h[1] + 6, 1, '#FFFFFF', C.ph); if (u < 0 || X.k === 1) COL.steam(g, h[0], h[1] - 12, t, 0.5, 3); if (u >= 0 && X.k === 0) COL.bubble(g, h[0], h[1] - 18, 'Cheers!', COL.bell(u) * 2); } },
    { P: W({ x: 1212, y: 694, s: 0.58, ph: 2.1, skin: 1, hair: 2, style: 'short', outfit: 'polo', top: '#F08A24', top2: '#FFFFFF', low: '#3A4458', glasses: true, sit: true, chair: false }), hands: [[-56, -200], [56, -200]],
      box: [1212, 590, 110, 200], who: 'Developer', role: 'Lounge \u00B7 illustration', near: [900, 200], pose: 'wow', dur: [1.8, 2.2], fx: ['spark', 'star'],
      lines: ['Odoo 20 is out. Testing the **upgrade** on a staging copy.', 'Paper plane to **Taguig City**, special delivery!'],
      idle: function (P, t) { var c = (t + 3) % 8, k = Math.abs(Math.sin(t * 9)) * 5; if (c < 5.5) { P.hands = [[-56, -196 - k], [56, -196 - (5 - k)]]; P.look = -0.2; } else { P.hands = [[-56, -200], [70, -260]]; P.look = 0.6; P.mood = 'happy'; } },
      moves: [function (P, u) { P.hands = [[-80, -300], [80, -300]]; P.look = 0; }, function (P, u) { P.hands = u < 0.35 ? [[-56, -200], [40, -300]] : [[-56, -200], [130, -380]]; P.look = 0.6; P.hop = u > 0.35 ? COL.bell((u - 0.35) / 0.65) * 8 : 0; }],
      after: function (g, P, t, S, X, u) { var lid = 1, lx = P.x, ly = P.y - 112 * P.s;
        if (u >= 0 && X.k === 0) { ly = P.y - 220 * P.s - COL.bell(u) * 20; g.save(); g.translate(lx, ly); fillRR(g, -30, -40, 60, 40, 4, '#2A3550'); fillRR(g, -26, -36, 52, 32, 3, '#FFFFFF'); fillRR(g, -26, -36, 52, 7, 2, C.odoo); text(g, 'Odoo 20', 0, -16, 8, 800, C.ink, 'center'); text(g, '\u2713 upgrade test', 0, -8, 5.6, 800, '#0E7A50', 'center'); g.restore(); }
        else COL.laptop(g, lx, ly, 1.05, lid, '#E9F1FF');
        if (u >= 0 && X.k === 1 && u > 0.35) { var v = (u - 0.35) / 0.65, px = lerp(P.x + 50, P.x - 520, v), py = P.y - 230 - Math.sin(v * Math.PI) * 120 - v * 60; plane(g, px, py, 1.1, -0.5 + v * 0.3 + Math.PI, '#FFFFFF', C.blue); } } }
  ];
  /* the lobby lounge in front of the reception (behind the visitor pass): a visitor reading the brochure in an armchair, the
     host with a tray of three coffees; a rug, a second armchair, a round coffee table */
  function armchair(g, x, y, s, col, back) {
    g.save(); g.translate(x, y); g.scale(s, s); soft(g, 0, 4, 160, 18, 0.24);
    if (back !== false) { fillRR(g, -128, -330, 256, 250, 46, col); fillRR(g, -110, -312, 220, 40, 20, 'rgba(255,255,255,.14)'); }
    fillRR(g, -150, -150, 300, 96, 30, col); fillRR(g, -170, -230, 56, 196, 24, col); fillRR(g, 114, -230, 56, 196, 24, col);
    fillRR(g, -170, -230, 56, 22, 11, 'rgba(255,255,255,.18)'); fillRR(g, 114, -230, 56, 22, 11, 'rgba(255,255,255,.18)');
    g.fillStyle = '#7A5A3C'; g.fillRect(-150, -36, 14, 36); g.fillRect(136, -36, 14, 36); g.restore();
  }
  var LOUNGE = [-330, 652], HOSTP = [-62, 630];
  XS.push(
    { P: W({ x: LOUNGE[0], y: LOUNGE[1], s: 0.58, ph: 1.2, skin: 3, hair: 1, style: 'long', outfit: 'shirt', top: '#9CC3EC', low: '#3A4458', shoe: '#FFFFFF', sit: true, chair: false, sitDrop: 30, id: '#9AA6BC' }), hands: [[-46, -196], [46, -196]],
      box: [LOUNGE[0], LOUNGE[1] - 130, 120, 230], who: 'Visitor', role: 'Lobby · grey visitor pass · illustration', near: [220, 200], pose: 'love', dur: [1.8, 1.9], fx: ['star', 'heart'],
      lines: ['Reading up before our **discovery workshop**. Odoo Ready Partner, nice!', 'Three offices, **one team**: that’s what sold us.'],
      idle: function (P, t, S, X) { var c = (t + 2) % 10; X.flip = c > 3 && c < 3.6 ? (c - 3) / 0.6 : c > 6.5 && c < 7.1 ? (c - 6.5) / 0.6 : -1;
        if (c < 8.4) { P.look = -0.1 + Math.sin(t * 0.6) * 0.15; } else { P.look = 0.8; P.mood = 'happy'; P.hands = [[-46, -196], [60, -240]]; } },
      moves: [function (P, u) { P.hands = [[-50, -400], [50, -400]]; P.hop = COL.bell(u) * 10; P.look = 0; }, function (P, u, t) { P.hands = [[-60, -150], [60, -150]]; P.tilt = Math.sin(t * 14) * 0.06 * COL.bell(u); P.hop = Math.abs(Math.sin(u * 12)) * 5; }],
      after: function (g, P, t, S, X, u, k) { var a = COL.hand(P, 0), b = COL.hand(P, 1), cx = (a[0] + b[0]) / 2, cy = Math.min(a[1], b[1]) + 2, up = u >= 0 && k === 0;
        if (u >= 0 && k === 1) { COL.bubble(g, P.x, P.y - 300, 'Ha! Love it', COL.bell(u) * 2); return; }
        g.save(); g.translate(cx, cy); var w = up ? 46 : 38, h = up ? 30 : 26; fillRR(g, -w / 2, -h, w, h, 2, '#FFFFFF'); fillRR(g, -w / 2, -h, w / 2 - 1, h, 2, '#F1F5FB');
        if (up) { fillE(g, -w / 4, -h / 2, 6, 6, C.odoo); fillE(g, -w / 4, -h / 2, 3, 3, '#FFFFFF'); text(g, 'Ready', w / 4, -h / 2 - 1, 5.4, 800, C.odoo, 'center'); text(g, 'Partner', w / 4, -h / 2 + 6, 5, 800, C.ink, 'center'); }
        else { fillRR(g, 3, -h + 5, 14, 3, 1, C.blue); fillRR(g, 3, -h + 11, 12, 2, 1, '#C9D3E3'); fillRR(g, 3, -h + 15, 13, 2, 1, '#C9D3E3'); plane(g, -w / 4, -h / 2, 0.55, 0, C.blue); }
        if (X.flip >= 0) { var fx = Math.cos(X.flip * Math.PI) * (w / 2 - 1); g.fillStyle = '#E3E9F3'; g.fillRect(Math.min(0, fx), -h, Math.abs(fx), h); }
        g.restore(); } },
    { P: W({ x: HOSTP[0], y: HOSTP[1], s: 0.57, ph: 0.3, skin: 1, hair: 0, style: 'bun', clip: '#F08A24', outfit: 'cardigan', top: '#14A38B', top2: '#FFFFFF', low: '#2A3550' }), hands: [[-60, -220], [70, -150]],
      box: [HOSTP[0], HOSTP[1] - 140, 110, 260], who: 'Office host', role: 'Lobby · illustration', near: [240, 160], pose: 'clap', dur: [1.7, 1.8], fx: ['heart', 'conf'],
      lines: ['Kopi for you! Kape and cà phê are on the **coffee bar** too.', 'Balancing three coffees: one per **office**.'],
      idle: function (P, t) { var c = (t + 4) % 9; if (c < 4) { P.hands = [[-90, -236], [70, -150]]; P.look = -0.7; } else if (c < 5.4) { P.hands = [[-60, -220], [10, -250]]; P.look = 0.3; P.tilt = -0.04; } else if (c < 6.6) { P.hands = [[-60, -220], [96 + Math.sin(t * 9) * 10, -330]]; P.look = 0.8; P.mood = 'happy'; } else { P.look = Math.sin(t * 0.8) * 0.6; } },
      moves: [function (P, u) { P.hands = [[-130 + COL.bell(u) * -20, -250], [70, -170]]; P.look = -0.9; P.mood = 'happy'; }, function (P, u, t) { P.sx = Math.cos(COL.ease(u) * Math.PI * 2); P.hands = [[-90, -300], [100, -240]]; P.hop = COL.bell(u) * 10; }],
      after: function (g, P, t, S, X, u, k) { var h = COL.hand(P, 0); g.save(); g.translate(h[0], h[1] - 4); fillE(g, 0, 0, 30, 6, '#C9A27A'); fillE(g, 0, -1.4, 28, 4.6, '#E3C59A');
        var give = u >= 0 && k === 0 ? COL.bell(u) : 0; [-16, 0, 16].forEach(function (ox, i) { if (i === 0 && give > 0.3) return; COL.mug(g, ox, -2, 0.62, '#FFFFFF', [C.sg, C.ph, C.vn][i]); }); g.restore();
        if (give > 0.3) COL.mug(g, lerp(h[0] - 16, LOUNGE[0] + 60, give), h[1] - 6 - give * 10, 0.62, '#FFFFFF', C.sg);
        COL.steam(g, h[0], h[1] - 18, t, 0.4, 2); if (u >= 0 && k === 0) COL.pop(g, P.x, P.y - 300, 'Kopi for you!', u, C.ph); } }
  );
  function FORE() {
    return [
      [590, function (g, ext) { if (ext.l < 80) { g.save(); g.globalAlpha = 0.9; fillE(g, -250, 634, 260, 36, '#DCE7FB'); g.strokeStyle = 'rgba(49,103,202,.35)'; g.lineWidth = 3; g.setLineDash([10, 8]); g.beginPath(); g.ellipse(-250, 634, 238, 29, 0, 0, Math.PI * 2); g.stroke(); g.setLineDash([]);
        [-1, 0, 1].forEach(function (d) { plane(g, -250 + d * 120, 634, 0.9, 0, 'rgba(49,103,202,.22)'); }); g.restore(); } }],
      [640, function (g, ext, t) { if (ext.l < -300) COL.swayPlant(g, -420, 640, t, 0.55, '#FFFFFF', '#E3E9F3', 6); }],
      [652, function (g, ext, t) { if (ext.l < 20) { armchair(g, LOUNGE[0], LOUNGE[1], 0.52, '#F2B233'); COL.draw([XS[2]], g, t); } }],
      [630, function (g, ext, t) { if (ext.l < 60) COL.draw([XS[3]], g, t); }],
      [668, function (g, ext, t) { if (ext.l < 0) { var x = -196, y = 668; soft(g, x, y + 2, 60, 8, 0.24); g.fillStyle = '#7A5A3C'; g.fillRect(x - 3, y - 40, 6, 40); fillRR(g, x - 26, y - 4, 52, 6, 3, '#7A5A3C');
        fillE(g, x, y - 44, 52, 10, '#C9A27A'); fillE(g, x, y - 46, 50, 8, '#E3C59A'); COL.mug(g, x - 18, y - 46, 0.6, '#FFFFFF', C.vn); fillRR(g, x + 2, y - 54, 26, 8, 2, C.blue); fillRR(g, x + 4, y - 60, 22, 6, 2, '#FFFFFF'); COL.steam(g, x - 18, y - 60, t, 0.35, 2); } }],
      [700, function (g, ext) { if (ext.r > 360 && ext.l < 600) { var x = 372, y = 700; soft(g, x + 100, y + 2, 120, 8, 0.22); g.fillStyle = '#5C6B7A'; g.fillRect(x + 14, y - 30, 8, 30); g.fillRect(x + 178, y - 30, 8, 30);
        fillRR(g, x, y - 42, 200, 14, 7, '#FFFFFF'); fillRR(g, x, y - 42, 200, 5, 3, '#E3E9F3'); fillRR(g, x + 28, y - 70, 40, 30, 10, C.blue); fillRR(g, x + 36, y - 64, 24, 10, 4, '#4A80E2'); fillRR(g, x + 130, y - 56, 44, 14, 4, '#2A3550'); fillRR(g, x + 134, y - 62, 36, 8, 3, '#3A4458'); } }],
      [704, function (g, ext, t) { if (ext.r > 600 && ext.l < 680) COL.swayPlant(g, 608, 704, t, 0.5, C.ph, '#3AB9A2', 4); }],
      [693, function (g, ext, t) { COL.draw([XS[1]], g, t); }],
      [724, function (g, ext, t) { if (ext.r > 940 || ext.l < -480) COL.vac(g, VAC, t, Math.max(ext.l + 40, -900), Math.min(ext.r - 60, 1450), 724, C.blue); }],
      [790, function (g, ext, t) { COL.swayPlant(g, 980, 800, t, 1.05, '#FFFFFF', '#E3E9F3', 1); if (ext.l < -480) COL.swayPlant(g, -520, 804, t, 1, C.blue, '#4F7FD8', 2); }],
      [770, function (g, ext) { if (ext.r > 1080) { var x = 1090; soft(g, x + 110, 774, 130, 9, 0.22); fillRR(g, x, 716, 220, 56, 10, '#FFFFFF'); fillRR(g, x - 6, 708, 232, 12, 6, '#C9A27A'); fillRR(g, x + 14, 730, 92, 30, 6, '#EEF2F8'); fillRR(g, x + 114, 730, 92, 30, 6, '#EEF2F8');
        fillE(g, x + 60, 745, 4, 4, '#9AA6BC'); fillE(g, x + 160, 745, 4, 4, '#9AA6BC'); COL.laptop(g, x + 70, 708, 0.9, 1, '#DCEBFF'); COL.mug(g, x + 150, 708, 0.9, '#FFFFFF', C.vn); fillRR(g, x + 172, 696, 26, 12, 2, '#3167CA'); fillRR(g, x + 176, 690, 22, 7, 2, '#14A38B'); } }],
      [700, function (g, ext) { if (ext.l < -500) { var x = -840; soft(g, x + 40, 704, 60, 7, 0.22); fillRR(g, x, 660, 80, 40, 18, '#F2B233'); fillRR(g, x + 6, 650, 68, 20, 10, '#F7C65A'); } }],
      [690, function (g, ext) { if (ext.r > 1100) { var x = 1160; soft(g, x + 50, 694, 70, 7, 0.22); fillRR(g, x, 640, 100, 50, 22, '#14A38B'); fillRR(g, x + 8, 628, 84, 26, 13, '#3AB9A2'); } }]
    ];
  }

  /* ---------------- the people (illustrations, no names): the TechNext team, semi-casual, every one with a TechNext ID ---------------- */
  var CON = W({ x: 392, y: 470, s: 0.54, ph: 0.4, skin: 1, hair: 0, style: 'bob', outfit: 'cardigan', top: '#E9D7C0', top2: '#3167CA', low: '#3A4458', hands: [[-120, -300], [62, -190]], look: -0.4 });
  var DEV = W({ x: 668, y: 470, s: 0.54, ph: 1.6, skin: 2, hair: 1, style: 'short', outfit: 'polo', top: '#3167CA', top2: '#FFFFFF', glasses: true, headset: '#14A38B', sit: true, chairCol: '#2A3550', hands: [[-60, -196], [60, -196]] });
  var AIE = W({ x: 940, y: 470, s: 0.54, ph: 2.4, skin: 0, hair: 2, style: 'short', outfit: 'shirt', top: '#F08A24', low: '#2A3550', shoe: '#FFFFFF', glasses: true, hands: [[-80, -230], [70, -150]], look: -0.5 });

  window.IXW.worlds.company = {
    pan: [-300, 1180],
    paintBg: paintBg, windowBehind: true, paintFrame: paintFrame,
    paintBack: paintBack, paintFront: paintFront, paintWindow: paintWindow, paintLive: paintLive, paintFrontLive: paintFrontLive,
    paintForeLive: function (g, t, S) { K.zfore(g, t, S, FORE(), function () { crew(g, t, S, 'fore'); }); CR.draw(g, t); },
    motes: false,
    glow: {
      discovery: function (g) { var b = T.board; rr(g, b.x - 8, b.y - 8, b.w + 16, F - b.y + 10, 12); },
      train: function (g) { var s = T.screen; rr(g, s.x - 10, s.y - 10, s.w + 20, s.h + 18, 10); },
      configure: function (g) { var d = T.disp; rr(g, d.x - 12, d.y - 12, d.w + 24, d.h + 24, 12); },
      integrate: function (g) { var d = T.desk; rr(g, d.x - 10, d.y - 82, d.w + 20, F - d.y + 88, 14); },
      support: function (g) { var s = T.sup; rr(g, s.x - 10, s.y - 10, s.w + 20, s.h + 20, 12); },
      ai: function (g) { var h = T.holo; rr(g, h.x - 26, h.y - 190, h.w + 52, F - h.y + 196, 16); },
      'clock-sg': function (g) { rr(g, BAY.sg.x - 80, -83, 160, 56, 28); }, 'clock-ph': function (g) { rr(g, BAY.ph.x - 80, -83, 160, 56, 28); }, 'clock-vn': function (g) { rr(g, BAY.vn.x - 80, -83, 160, 56, 28); }
    },
    calmView: [238, -100, 775, 620],
    backGlow: ['discovery', 'configure', 'support', 'clock-sg', 'clock-ph', 'clock-vn', 'train'],
    cast: [
      /* the consultant: writes on the board, steps back to think, turns to explain; a tap slaps a sticky note on the board or twirls her marker */
      { id: 'sg', behind: true, keys: ['discovery', 'train'], P: CON, act: function (P, t, S) {
        var st = S.cast.sg, busy = S.hot === 'discovery' || S.hot === 'train', tp = COL.tap(st, t), ph = (t + 2) % 9, hands, look;
        COL.reset(P); P.talk = t < st.until;
        if (busy) { hands = [[-140 + Math.sin(t * 3) * 14, -330], [62, -190]]; look = -0.8; P.mood = 'happy'; }
        else if (ph < 4.5) { hands = [[-122 + Math.sin(t * 6.5) * 9, -300 + Math.sin(t * 2.6) * 16], [58, -186]]; look = -0.85; }
        else if (ph < 6) { hands = [[-50, -200], [30, -322]]; look = -0.55; P.tilt = -0.06; }
        else { hands = [[-80, -170], [112 + Math.sin(t * 2.2) * 12, -262 + Math.sin(t * 1.7) * 10]]; look = 0.35; P.mood = 'happy'; }
        CONs.u = -1;
        if (tp.n && tp.e < 1.6) { var u = tp.e / 1.6; CONs.u = u; CONs.k = tp.n % 2; P.talk = true; P.mood = 'happy';
          if (CONs.k === 1) { /* the sticky slap */
            var q = clamp((u - 0.3) / 0.32, 0, 1); hands = u < 0.3 ? [[-60, -170], [62, -190]] : u < 0.62 ? [[lerp(-60, -150, q), lerp(-170, -372, q)], [62, -190]] : [[-150, -372], [96, -300]]; look = -0.85;
            P.hop = u > 0.62 && u < 0.85 ? 10 * COL.bell((u - 0.62) / 0.23) : 0;
            if (u >= 0.62 && CONs.last !== tp.n) { CONs.last = tp.n; CONs.notes = CONs.notes % 3 + 1; CONs.noteT = t; CR.burst('star', T.board.x + 26 + (CONs.notes - 1) * 40, T.board.y, t); } }
          else { /* the marker twirl */ hands = [[-80, -170], [92, -330]]; look = 0.2; P.mood = u < 0.5 ? 'wow' : 'happy'; P.hop = u > 0.72 ? 14 * COL.bell((u - 0.72) / 0.28) : 0; } }
        P.hands = hands; P.look = lerp(P.look, t < st.until && !(tp.e < 1.6) ? clamp((S.nexi.x - P.x) / 160, -1, 1) : look, 0.1);
      } },
      /* the developer: types, sips from his mug, stretches, swivels; a tap spins his chair or pumps a merge */
      { id: 'ph', behind: true, keys: ['integrate', 'configure'], P: DEV, act: function (P, t, S) {
        var st = S.cast.ph, busy = S.hot === 'integrate', tp = COL.tap(st, t), ph = (t + 5) % 11, ty = Math.abs(Math.sin(t * (busy ? 14 : 7))) * 6;
        COL.reset(P); P.talk = t < st.until; P.mood = P.talk || busy ? 'happy' : 'calm';
        var hands = [[-70, -196 - ty], [60, -196 - (6 - ty)]], look = -0.6; DEVs.sip = 0; DEVs.merge = -1;
        if (!busy && !(tp.e < 1.8)) {
          if (ph > 6 && ph < 8) { var q = COL.ease(Math.min(1, COL.bell((ph - 6) / 2) * 1.8)); hands = [[-70, -196], [lerp(60, 30, q), lerp(-196, -330, q)]]; DEVs.sip = 1; look = 0.1; }
          else if (ph > 8 && ph < 9.2) { hands = [[-104, -438], [104, -438]]; P.mood = 'happy'; P.tilt = Math.sin((ph - 8) * 9) * 0.05; look = 0; }
          else if (ph > 9.2) { P.sx = 1 - 0.32 * COL.bell((ph - 9.2) / 1.8); look = 0.8; } }
        if (tp.n && tp.e < 1.8) { var u = tp.e / 1.8; P.talk = true; P.mood = 'happy';
          if (tp.n % 2) { var v = clamp(u / 0.75, 0, 1); P.sx = Math.cos(COL.ease(v) * Math.PI * 2); P.hop = COL.bell(v) * 14; hands = [[-110, -262], [110, -262]];
            if (DEVs.b !== tp.n) { DEVs.b = tp.n; CR.burst('code', P.x, P.y - 230, t); } }
          else { var pump = Math.abs(Math.sin(u * Math.PI * 4)); hands = [[-92, -380 - pump * 40], [92, -380 - pump * 40]]; P.hop = pump * 8; DEVs.merge = u;
            if (DEVs.b !== tp.n) { DEVs.b = tp.n; CR.burst('conf', P.x, P.y - 260, t); } } }
        P.hands = hands; P.look = lerp(P.look, t < st.until && !(tp.e < 1.8) ? clamp((S.nexi.x - P.x) / 160, -1, 1) : look, 0.1);
      } },
      /* the AI engineer: conducts the hologram, checks the rack, folds his arms; a tap tosses a light orb into his hand or snaps the rings faster */
      { id: 'vn', behind: true, keys: ['ai'], P: AIE, act: function (P, t, S) {
        var st = S.cast.vn, busy = S.hot === 'ai', tp = COL.tap(st, t), ph = (t + 1) % 10, hands, look, an = t * 1.6;
        COL.reset(P); P.talk = t < st.until; P.mood = P.talk || busy ? 'happy' : 'calm';
        if (busy) { hands = [[-150, -300 + Math.sin(t * 4) * 10], [70, -150]]; look = -0.8; }
        else if (ph < 5) { hands = [[-150 + Math.cos(an) * 26, -300 + Math.sin(an) * 26], [60 + Math.sin(an * 0.7) * 10, -200]]; look = -0.8; }
        else if (ph < 7) { hands = [[-80, -230], [104, -300]]; look = 0.9; }
        else { hands = [[36, -206], [-32, -218]]; look = 0.15; P.mood = 'happy'; }
        AIs.orb = -1;
        if (tp.n && tp.e < 1.8) { var u = tp.e / 1.8; P.talk = true; P.mood = u < 0.6 ? 'wow' : 'happy';
          if (tp.n % 2) { AIs.orb = clamp(u / 0.85, 0, 1); hands = [[-128, -350], [70, -170]]; look = -0.5; P.hop = u > 0.85 ? 10 * COL.bell((u - 0.85) / 0.15) : 0; }
          else { hands = [[-80, -230], [104, -412 + Math.abs(Math.sin(u * 20)) * 8]]; look = -0.6; if (AIs.b !== tp.n) { AIs.b = tp.n; AIs.boost = t; CR.burst('star', T.holo.x + T.holo.w / 2, T.holo.y - 110, t); } } }
        P.hands = hands; P.look = lerp(P.look, t < st.until && !(tp.e < 1.8) ? clamp((S.nexi.x - P.x) / 160, -1, 1) : look, 0.1);
      } }
    ],
    /* the clocks: the line Nexi says is the real local time there */
    toy: function (name, S, t, btn) {
      var key = name.slice(6), b = BAY[key]; if (!b || !btn) return;
      var tm = cityTime(new Date(), b.off), h12 = tm.h % 12 || 12, mm = (tm.m < 10 ? '0' : '') + tm.m, ap = tm.h < 12 ? 'am' : 'pm';
      var tail = key === 'vn' ? 'one hour behind Singapore and Manila. Our **AI engineers** work here.' : key === 'ph' ? 'the same time as Singapore. Our **main development and consulting hub** is here.' : 'the same time as Manila. Our **headquarters** is here.';
      btn.setAttribute('data-say', "It's **" + h12 + ':' + mm + ' ' + ap + '** in ' + b.tz + ', ' + tail);
    },
    hit: function (x, y, S, t) {
      var wr = CR.hitWalker(x, y, t); if (wr) return wr;
      if (S._pl && Math.hypot(x - S._pl.x, y - S._pl.y) < 30) { PL.loop = t; return { say: 'Wheee! That paper plane is the **TechNext** logo. It loops the whole office.', near: [clamp(S._pl.x, 200, 900), 120], pose: 'celebrate' }; }
      if (S._cap && Math.abs(x - S._cap.x) < 40 && Math.abs(y - S._cap.y) < 26) { CAP.run = t; return { say: 'Whoosh! A project rides the rail from **Singapore** to **Taguig City** to **Ho Chi Minh City**.', near: [clamp(S._cap.x, 240, 880), 60], pose: 'wow' }; }
      if (VAC.x != null && Math.abs(x - VAC.x) < 34 && Math.abs(y - VAC.y) < 24) { VAC.t = t; return { say: 'Beep boop! Even the **robot vacuum** wears the TechNext blue.', near: [clamp(VAC.x, 240, 880), 260], pose: 'celebrate' }; }
      var ex = COL.hit(XS, x, y, t); if (ex) return ex;
      return null;
    },
    onStop: function (key, S, t) { if (key === 'discovery') S.dT = t; if (key === 'train') S.tT = t; if (key === 'configure') S.cT = t; if (key === 'integrate') S.iT = t; if (key === 'support') S.sT = t; if (key === 'ai') S.aT = t; }
  };
})(window.IXW && window.IXW.kit, window.CR, window.COL);
