/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: sol-app (/solutions/app-development) — "The Ride Workshop": a mobile or web app built the way a theme park builds a
   new ride, in a bright daytime workshop yard at the edge of the park. The STORYBOARD (who rides, what for, which devices)
   comes first; the PROTOTYPE sits on the bench as a clickable phone beside a 3D-printed model of the ride; the TEST RIDE is a
   suspended track whose car is a phone with a bench seat, carrying two of the client's own people station by station through
   the app's workflow (check in, checklist, photos, sign, done); each station writes to the job in Odoo, shown on the screen
   in RIDE CONTROL; three GATES board the ride on iOS, Android or the web (each run uses the next one); the LAUNCH board over
   the yard goes live with fireworks. The park behind: a coaster, a drop tower, balloons, the big top and a carousel.
   The cast: the UX designer pins users' notes on the storyboard (tap: a flurry of sticky notes and a twirl), the developer
   types beside the bench and taps the prototype (tap: a chair spin, then the phone held high, BUILD OK), the project lead ticks
   off every station (tap: the release notes unroll to the floor), the field technician tries the app on his own phone and signs
   when the car reaches SIGN (tap: his phone held out with a fresh signature), the office admin pulls the dispatch lever and
   watches Odoo fill (tap: the job report prints and she waves it). Tap a rider, a walker, the coaster or the balloon cart. */
(function (K, CR, CO) {
  'use strict';
  if (!K || !CR || !CO) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed, limb = K.limb;
  var F = 470, CORAL = '#FF6B57', CORAL_D = '#D9483A', SUN = '#FFC93C', SUN_D = '#E0A419', TEAL = '#14B1C4', TEAL_D = '#0B7F8E', INK = '#1C2340', PUR = '#714B67', BLUE = '#3167CA', CREAM = '#FFF7EA', MINT = '#35C08E', LILAC = '#9B87E8', GREY = '#9AA6BC';
  var VAL_T = -176, VAL_B = -112, HZ = 232;
  var LB = { x: 518, y: -86, w: 244, h: 76 }, SB = { x: 214, y: 62, w: 178, h: 250 }, RAIL = { y: 74, x0: 404, x1: 880 };
  var STN = [470, 550, 630, 710, 790], STN_N = ['Check in', 'Checklist', 'Photos', 'Sign', 'Done'], X_LOAD = 432, X_EXIT = 872;
  var BENCH = { x: 340, y: 392, w: 272 }, LAP = { x: 352, y: 354, w: 46, h: 32 }, PROTO = { x: 488, y: 304, w: 40, h: 76 }, MODEL = { x: 572, y: 372 };
  var GATES = [712, 766, 820], GATE_N = ['iOS', 'Android', 'Web'], GATE_C = [CORAL, TEAL, SUN_D];
  var SWING = { x: 300, y: -52 }, BOOTH = { x: 884, y: 6, w: 122 }, SCR = { x: 896, y: 58, w: 100, h: 116 }, LEVER = { x: 998, y: F }, CART = { x: 976, y: 652 };
  var FIELDS = [['Status', -1], ['Checked in', 0], ['Checklist', 1], ['Photos', 2], ['Signature', 3], ['Invoice', 4]];
  var VALS = ['In progress', '09:02', '4 of 4', '3 photos', 'Signed', 'Draft ready'];
  function setU(g, sx, sy, k) { g.translate(sx, sy); g.scale(k, k); }
  function extOf(W, H, k, sx, sy) { return { l: -(sx + 24) / k, r: (W - sx) / k, t: -(sy + 24) / k, b: (H - sy) / k }; }
  function ease(u) { return u * u * (3 - 2 * u); }
  function tone(c, k) { return K.tone(c, k == null ? 0.22 : k); }
  function trackY(x) { return 64 + 42 * Math.sin(x * 0.0096 + 0.5) + 22 * Math.sin(x * 0.023 + 2.2); }
  function star(g, x, y, r, col) { g.fillStyle = col; g.beginPath(); for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, rad = i % 2 ? r * 0.45 : r; g.lineTo(x + Math.cos(a) * rad, y + Math.sin(a) * rad); } g.closePath(); g.fill(); }

  /* ---------------- the test ride: a 17 s run, station by station ---------------- */
  var CYC = 17, LOAD = 1.4, MOVE = 1.1, DWELL = 1.5, EXITT = 1.4;
  function ride(t) {
    var n = Math.floor(t / CYC), s = t - n * CYC, x = X_LOAD, st = -1, at = -1, mv = 0, a = 1, dir = 1;
    if (s < LOAD) a = clamp(s / 0.4, 0, 1);
    else {
      var q = s - LOAD, i;
      for (i = 0; i < 5; i++) { var x0 = i ? STN[i - 1] : X_LOAD;
        if (q < MOVE) { x = lerp(x0, STN[i], ease(q / MOVE)); mv = Math.sin(q / MOVE * Math.PI); st = i - 1; break; } q -= MOVE;
        if (q < DWELL) { x = STN[i]; st = i; at = i; break; } q -= DWELL; }
      if (i === 5) { st = 4; if (q < EXITT) { var k = q / EXITT; x = lerp(STN[4], X_EXIT, k * k); mv = k; a = 1 - clamp((k - 0.4) / 0.6, 0, 1); } else { x = X_EXIT; a = 0; } }
    }
    return { x: x, st: st, at: at, mv: mv, a: a, s: s, n: n, pf: ((n % 3) + 3) % 3, dir: dir };
  }
  function arrive(t, i) { var n = Math.floor(t / CYC), te = n * CYC + LOAD + i * (MOVE + DWELL) + MOVE; if (te > t) te -= CYC; return te; }
  function departT(t) { var n = Math.floor(t / CYC), te = n * CYC + LOAD; if (te > t) te -= CYC; return te; }

  /* ---------------- the people ---------------- */
  var W = CR.who;
  var UX = W({ x: 205, y: F, s: 0.46, ph: 0.3, skin: 0, hair: 1, style: 'bob', outfit: 'cardigan', top: TEAL, top2: '#FFFFFF', hands: [[-70, -170], [70, -170]], look: 0.6 });
  var DEV = W({ x: 440, y: F, s: 0.46, ph: 1.1, skin: 2, hair: 0, style: 'short', outfit: 'shirt', top: BLUE, glasses: true, sit: true, chairCol: INK, hands: [[-120, -206], [-40, -206]], look: -0.6 });
  var LEAD = W({ x: 650, y: F, s: 0.46, ph: 2.0, skin: 3, hair: 2, style: 'pony', outfit: 'polo', top: SUN, top2: '#FFFFFF', clip: CORAL, hold: 'clipboard', hands: [[-70, -200], [70, -170]], look: -0.4 });
  var TECH = W({ x: 872, y: F, s: 0.46, ph: 2.7, skin: 1, hair: 0, style: 'short', outfit: 'polo', top: MINT, top2: '#FFFFFF', id: GREY, hatKind: 'cap', hat: TEAL_D, hands: [[-30, -240], [40, -250]], look: -0.5 });
  TECH.c.hat = TEAL_D; TECH.c.hatBand = '#FFFFFF';
  var OPS = W({ x: 958, y: F, s: 0.46, ph: 3.4, skin: 1, hair: 1, style: 'long', outfit: 'shirt', top: PUR, id: GREY, headset: CORAL, hands: [[-70, -170], [70, -170]], look: -0.5 });
  /* the two test riders in the car: the client's own people (grey passes), seated with their feet on the footboard */
  var RID = [0, 1].map(function (i) { var P = W({ s: 0.2, ph: i * 1.9 + 0.4, skin: [0, 3][i], hair: i + 1, style: ['pony', 'short'][i], outfit: 'tee', top: ['#FFFFFF', SUN][i], id: GREY, sit: true, chair: false }); P.c.print = null; return P; });
  /* passers-by: two park guests on the far path (customer-app users), the crew on the yard */
  var FAR = [
    { x0: -900, x1: 1500, y: 224, spd: 9, ph: 0.15, label: 'A park guest', lines: ['Booked my ride on the **customer app**. Two taps, done.', 'The queue time is on my phone: no guessing.'], acts: ['wave', 'jump'],
      P: W({ s: 0.15, skin: 2, hair: 1, style: 'long', outfit: 'tee', top: '#FF8FA3', id: GREY }), balloon: CORAL },
    { x0: -900, x1: 1500, y: 226, spd: 7, ph: 0.62, label: 'A park guest', lines: ['My ticket lives in the app, **ordering and bookings** too.', 'Paid on the phone, picked up at the kiosk.'], acts: ['wave', 'spin'],
      P: W({ s: 0.15, skin: 4, hair: 0, style: 'short', outfit: 'tee', top: '#7FD3F7', id: GREY }), balloon: TEAL }
  ];
  FAR.forEach(function (w) { w.P.fixS = true; w.P.c.print = null; });
  var CREW = [
    { x0: -980, x1: 150, y: 492, spd: 15, ph: 0.3, label: 'TechNext technical writer', lines: ['**Documentation for your team**, written while the app is built.', 'The admin screens come with written steps.'], acts: ['wave', 'nod', 'id'],
      P: W({ s: 0.52, skin: 1, hair: 1, style: 'long', outfit: 'cardigan', top: LILAC, top2: '#FFFFFF', hold: 'clipboard' }) },
    { x0: 1090, x1: 1300, y: 492, spd: 14, ph: 0.6, label: 'TechNext QA tester', lines: ['A crate of **real devices**: every release is tried on them.', 'iPhone, Android, a browser: one ride, three ways in.'], acts: ['cheer', 'id', 'wave'],
      P: W({ s: 0.52, skin: 2, hair: 0, style: 'short', outfit: 'polo', top: TEAL, hold: 'box' }) },
    { front: true, x0: 1100, x1: 1300, y: 690, spd: 18, ph: 0.2, label: 'TechNext developer', lines: ['Working releases you can **test along the way**.', 'Payments, maps and notifications, **where they are needed**.'], acts: ['nod', 'id', 'wave'],
      P: W({ s: 0.58, skin: 0, hair: 1, style: 'bun', outfit: 'shirt', top: BLUE, hold: 'tablet' }) },
    { front: true, x0: -980, x1: -470, y: 700, spd: 16, ph: 0.8, label: 'TechNext support engineer', lines: ['After launch: **fixes and updates**, planned with you.', 'App Store and Google Play submission? We handle it.'], acts: ['wave', 'id', 'jump'],
      P: W({ s: 0.58, skin: 3, hair: 0, style: 'short', outfit: 'polo', top: CORAL }), tool: true }
  ];

  function handAt(P, side) {
    var F3 = K.F3, d = side ? 1 : -1, h = P.hands[side], sxk = P.sx == null ? 1 : P.sx, bw = P.build || 1;
    var r = K.ik(d * F3.shx * bw, F3.shy, h[0], h[1], F3.a, F3.b, d).h, dy = -(P.hop || 0) + (P.sit ? (P.sitDrop != null ? P.sitDrop : 46) : 0);
    return [P.x + r[0] * P.s * sxk, P.y + (r[1] + dy) * P.s];
  }
  function rel(P, x, y) { var dy = P.sit ? (P.sitDrop != null ? P.sitDrop : 46) : 0; return [(x - P.x) / P.s, (y - P.y) / P.s - dy]; }

  /* ---------------- the static layers ---------------- */
  function tent(g, x, w, top, base, c1, c2) { /* the big top: a striped roof, its scalloped skirt, the flag */
    g.fillStyle = '#FFFFFF'; g.fillRect(x + 8, top + 60, w - 16, base - top - 60);
    for (var i = 0; i < 8; i++) { g.fillStyle = i % 2 ? c2 : c1; g.beginPath(); g.moveTo(x + w / 2, top); g.lineTo(x + i * w / 8, top + 64); g.lineTo(x + (i + 1) * w / 8, top + 64); g.closePath(); g.fill(); }
    for (var s = 0; s < 8; s++) { g.fillStyle = s % 2 ? c2 : c1; g.beginPath(); g.arc(x + (s + 0.5) * w / 8, top + 64, w / 16, 0, Math.PI); g.fill(); }
    g.fillStyle = tone(c1, 0.1); g.fillRect(x + w / 2 - 14, base - 50, 28, 50); fillRR(g, x + w / 2 - 1, top - 26, 2, 26, 1, '#9AA6BC');
    g.fillStyle = c1; g.beginPath(); g.moveTo(x + w / 2 + 1, top - 26); g.lineTo(x + w / 2 + 18, top - 20); g.lineTo(x + w / 2 + 1, top - 14); g.closePath(); g.fill();
  }
  function paintBg(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    var sg = g.createLinearGradient(0, e.t, 0, HZ); sg.addColorStop(0, '#6EC3F1'); sg.addColorStop(0.55, '#B7E3FA'); sg.addColorStop(1, '#EAF8FE'); g.fillStyle = sg; g.fillRect(e.l, e.t, e.r - e.l, HZ + 20 - e.t);
    var gl = g.createRadialGradient(1150, -250, 10, 1150, -250, 460); gl.addColorStop(0, 'rgba(255,247,210,.95)'); gl.addColorStop(0.25, 'rgba(255,240,190,.35)'); gl.addColorStop(1, 'rgba(255,240,190,0)'); g.fillStyle = gl; g.fillRect(e.l, e.t, e.r - e.l, 600);
    fillE(g, 1150, -250, 28, 28, '#FFF4C9');
    /* far hills */
    g.fillStyle = '#CFEBDD'; g.beginPath(); g.moveTo(e.l, HZ); for (var hx = e.l; hx <= e.r + 20; hx += 20) g.lineTo(hx, 150 - 18 * Math.sin(hx * 0.006) - 10 * Math.sin(hx * 0.017 + 1)); g.lineTo(e.r + 20, HZ); g.closePath(); g.fill();
    /* the big top (right) and the carousel (left) */
    if (e.r > 1000) tent(g, 1090, 190, 40, HZ, '#F59A8B', '#FFFFFF');
    if (e.l < -500) { var cx = -640; fillRR(g, cx - 100, 120, 200, 18, 6, '#FFD27A'); for (var p = 0; p < 9; p++) { fillRR(g, cx - 92 + p * 23, 138, 3, HZ - 138, 1, '#E5C07A'); }
      for (var c = 0; c < 10; c++) { g.fillStyle = c % 2 ? '#FFFFFF' : '#9BD8E8'; g.beginPath(); g.moveTo(cx, 50); g.lineTo(cx - 110 + c * 22, 122); g.lineTo(cx - 88 + c * 22, 122); g.closePath(); g.fill(); g.beginPath(); g.arc(cx - 99 + c * 22, 122, 11, 0, Math.PI); g.fill(); }
      fillE(g, cx, 48, 8, 8, SUN); fillRR(g, cx - 104, HZ - 14, 208, 14, 4, '#E8D6F4'); }
    /* the coaster: lattice, braces, the rails */
    var x0 = Math.floor(e.l / 24) * 24, x1 = e.r + 24, x;
    g.strokeStyle = 'rgba(232,140,165,.55)'; g.lineWidth = 2.4; g.beginPath(); for (x = x0; x < x1; x += 24) { g.moveTo(x, trackY(x) + 4); g.lineTo(x, HZ); } g.stroke();
    g.strokeStyle = 'rgba(232,140,165,.32)'; g.lineWidth = 1.2; g.beginPath();
    for (x = x0; x < x1; x += 24) { var top = Math.max(trackY(x), trackY(x + 24)) + 8; for (var yy = top; yy < HZ - 22; yy += 30) { g.moveTo(x, yy); g.lineTo(x + 24, yy + 30); g.moveTo(x + 24, yy); g.lineTo(x, yy + 30); } }
    g.stroke();
    g.strokeStyle = '#E8667F'; g.lineWidth = 3.8; g.beginPath(); for (x = x0; x < x1; x += 6) { var ty = trackY(x); if (x === x0) g.moveTo(x, ty); else g.lineTo(x, ty); } g.stroke();
    g.strokeStyle = 'rgba(255,255,255,.75)'; g.lineWidth = 1.1; g.beginPath(); for (x = x0; x < x1; x += 6) { var ty2 = trackY(x) - 1.5; if (x === x0) g.moveTo(x, ty2); else g.lineTo(x, ty2); } g.stroke();
    /* the drop tower */
    /* the swing ride: its pole and striped canopy (the chairs fly round live) */
    var wx = SWING.x; fillRR(g, wx - 6, SWING.y, 12, HZ - SWING.y, 3, '#FFFFFF'); for (var ws = 0; ws < 9; ws++) fillRR(g, wx - 6, SWING.y + 20 + ws * 24, 12, 10, 1, TEAL);
    for (var wc = 0; wc < 10; wc++) { g.fillStyle = wc % 2 ? '#FFFFFF' : TEAL; g.beginPath(); g.moveTo(wx, SWING.y - 34); g.lineTo(wx - 64 + wc * 12.8, SWING.y); g.lineTo(wx - 51.2 + wc * 12.8, SWING.y); g.closePath(); g.fill(); g.beginPath(); g.arc(wx - 57.6 + wc * 12.8, SWING.y, 6.4, 0, Math.PI); g.fill(); }
    fillE(g, wx, SWING.y - 38, 5, 5, SUN); fillRR(g, wx - 30, HZ - 16, 60, 16, 5, '#E3F4F7');
    var dx = 470; g.fillStyle = '#FFFFFF'; g.fillRect(dx - 8, -122, 16, HZ + 122); for (var dsx = 0; dsx < 12; dsx++) { g.fillStyle = dsx % 2 ? '#FFD9D2' : '#FFFFFF'; g.fillRect(dx - 8, -110 + dsx * 28, 16, 14); } g.strokeStyle = 'rgba(160,175,200,.6)'; g.lineWidth = 1.2; g.beginPath(); for (var dy = -116; dy < HZ; dy += 14) { g.moveTo(dx - 8, dy); g.lineTo(dx + 8, dy + 7); g.lineTo(dx - 8, dy + 14); } g.stroke();
    fillRR(g, dx - 18, -140, 36, 20, 8, CORAL); fillRR(g, dx - 14, -136, 28, 5, 2, 'rgba(255,255,255,.5)'); fillE(g, dx, -146, 4, 4, '#FF4D4D');
    /* trees along the park, a lawn and the park path */
    for (var tx = Math.floor((e.l - 40) / 46) * 46; tx < e.r + 40; tx += 46) { var hs = hash(tx * 0.13), rr2 = 20 + hs * 10, yb = 196 - hs * 8;
      g.fillStyle = '#B49C82'; g.fillRect(tx - 2, yb, 4, 30); fillE(g, tx, yb - rr2 * 0.6, rr2, rr2, hs > 0.5 ? '#9ED6A6' : '#8CCB98'); fillE(g, tx - rr2 * 0.3, yb - rr2 * 0.9, rr2 * 0.45, rr2 * 0.4, 'rgba(255,255,255,.22)'); }
    g.fillStyle = '#BFE3BE'; g.fillRect(e.l, 206, e.r - e.l, HZ - 206); g.fillStyle = '#F3E6D2'; g.fillRect(e.l, 216, e.r - e.l, 12); g.fillStyle = 'rgba(180,140,100,.18)'; g.fillRect(e.l, 227, e.r - e.l, 2);
    /* distant kiosks along the path */
    [[-300, '#9BD8E8'], [140, SUN], [990, '#F59A8B'], [1360, '#B7A6F0']].forEach(function (q) { var kx = q[0]; if (kx < e.l - 60 || kx > e.r + 60) return; fillRR(g, kx - 26, 176, 52, 40, 4, '#FFFFFF');
      for (var a = 0; a < 6; a++) { g.fillStyle = a % 2 ? '#FFFFFF' : q[1]; g.fillRect(kx - 30 + a * 10, 168, 10, 12); g.beginPath(); g.arc(kx - 25 + a * 10, 180, 5, 0, Math.PI); g.fill(); } fillRR(g, kx - 18, 188, 36, 14, 3, 'rgba(30,50,90,.12)'); });
    g.restore();
  }
  function paintFrame(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    /* the yard fence: white pickets with coral caps */
    g.fillStyle = '#FFFFFF'; g.fillRect(e.l, HZ - 12, e.r - e.l, 5);
    for (var px = Math.floor(e.l / 14) * 14; px < e.r; px += 14) { fillRR(g, px, HZ - 22, 8, 26, 2, '#FFFFFF'); fillRR(g, px, HZ - 25, 8, 6, 3, ((px / 14) | 0) % 6 === 0 ? SUN : '#F7B4A8'); }
    /* the yard: warm paving in perspective, a painted coral path, the hazard line before the gates */
    var fg = g.createLinearGradient(0, HZ, 0, e.b); fg.addColorStop(0, '#F3E5D2'); fg.addColorStop(0.5, '#F7EBDB'); fg.addColorStop(1, '#F1DFC8'); g.fillStyle = fg; g.fillRect(e.l, HZ + 4, e.r - e.l, e.b - HZ);
    g.fillStyle = 'rgba(120,80,50,.10)'; g.fillRect(e.l, HZ + 4, e.r - e.l, 5);
    g.strokeStyle = 'rgba(176,128,92,.16)'; g.lineWidth = 1.5; g.beginPath();
    for (var d = 1; d < 14; d++) { var yy = HZ + Math.pow(d / 13, 1.5) * (e.b - HZ); g.moveTo(e.l, yy); g.lineTo(e.r, yy); }
    for (var r = 0; r < 13; r++) { var y0 = HZ + Math.pow(r / 13, 1.5) * (e.b - HZ), y1 = HZ + Math.pow((r + 1) / 13, 1.5) * (e.b - HZ), stp = 30 + r * 7; for (var bx = Math.floor(e.l / stp) * stp + (r % 2) * stp / 2; bx < e.r; bx += stp) { g.moveTo(bx, y0); g.lineTo(bx + (bx - 560) * 0.04, y1); } }
    g.stroke();
    g.fillStyle = 'rgba(255,107,87,.12)'; g.beginPath(); g.moveTo(560, HZ + 6); g.lineTo(680, HZ + 6); g.lineTo(940, e.b); g.lineTo(360, e.b); g.closePath(); g.fill();
    g.save(); g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = 3; g.setLineDash([16, 14]); g.beginPath(); g.moveTo(620, HZ + 8); g.lineTo(650, e.b); g.stroke(); g.restore();
    for (var hz = 690; hz < 850; hz += 16) { g.fillStyle = ((hz / 16) | 0) % 2 ? INK : SUN; g.beginPath(); g.moveTo(hz, 478); g.lineTo(hz + 10, 478); g.lineTo(hz + 16, 486); g.lineTo(hz + 6, 486); g.closePath(); g.fill(); }
    var fsh = g.createLinearGradient(0, F - 12, 0, F + 26); fsh.addColorStop(0, 'rgba(120,80,50,0)'); fsh.addColorStop(0.35, 'rgba(120,80,50,.06)'); fsh.addColorStop(1, 'rgba(120,80,50,0)'); g.fillStyle = fsh; g.fillRect(e.l, F - 12, e.r - e.l, 38);
    g.restore();
  }
  function sketch(g, x, y, w, h, kind) { /* a storyboard frame: a phone screen sketched in pencil */
    fillRR(g, x, y, w, h, 4, '#FFFFFF'); g.strokeStyle = '#3B4462'; g.lineWidth = 1.4; rr(g, x + w / 2 - 15, y + 6, 30, h - 12, 5); g.stroke();
    var cx = x + w / 2, top = y + 12; g.strokeStyle = '#7A86A8'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(cx - 10, top + 2); g.lineTo(cx + 10, top + 2); g.stroke();
    g.fillStyle = '#C9D3E3';
    if (kind === 0) { g.beginPath(); g.arc(cx, top + 16, 6, 0, 7); g.stroke(); g.fillRect(cx - 10, top + 28, 20, 4); g.fillRect(cx - 10, top + 35, 20, 4); fillRR(g, cx - 10, top + 43, 20, 6, 3, CORAL); }
    else if (kind === 1) { for (var i = 0; i < 4; i++) { fillRR(g, cx - 11, top + 8 + i * 10, 22, 7, 2, i === 0 ? '#FFE3DE' : '#EEF2F7'); fillE(g, cx - 7, top + 11.5 + i * 10, 2, 2, i === 0 ? CORAL : GREY); } }
    else if (kind === 2) { g.fillStyle = '#E3F3E6'; g.fillRect(cx - 11, top + 8, 22, 34); g.strokeStyle = '#B9D9C0'; g.beginPath(); g.moveTo(cx - 11, top + 24); g.lineTo(cx + 11, top + 18); g.moveTo(cx - 2, top + 8); g.lineTo(cx + 3, top + 42); g.stroke();
      g.fillStyle = CORAL; g.beginPath(); g.arc(cx + 2, top + 20, 4.5, Math.PI, 0); g.lineTo(cx + 2, top + 30); g.closePath(); g.fill(); }
    else if (kind === 3) { for (var j = 0; j < 4; j++) { g.strokeStyle = '#7A86A8'; rr(g, cx - 10, top + 8 + j * 9, 6, 6, 1.5); g.stroke(); g.fillStyle = '#C9D3E3'; g.fillRect(cx - 2, top + 10 + j * 9, 12, 2.5);
        g.strokeStyle = MINT; g.lineWidth = 1.6; g.beginPath(); g.moveTo(cx - 9, top + 11 + j * 9); g.lineTo(cx - 7, top + 13 + j * 9); g.lineTo(cx - 4, top + 9 + j * 9); g.stroke(); g.lineWidth = 1.2; } }
    else if (kind === 4) { g.strokeStyle = '#7A86A8'; rr(g, cx - 10, top + 10, 20, 16, 3); g.stroke(); g.beginPath(); g.arc(cx, top + 18, 4.5, 0, 7); g.stroke(); fillE(g, cx, top + 38, 5, 5, CORAL); fillE(g, cx, top + 38, 2.5, 2.5, '#FFFFFF'); }
    else { g.strokeStyle = BLUE; g.lineWidth = 1.4; g.beginPath(); g.moveTo(cx - 10, top + 24); g.bezierCurveTo(cx - 6, top + 10, cx - 2, top + 30, cx + 2, top + 18); g.bezierCurveTo(cx + 5, top + 12, cx + 7, top + 26, cx + 11, top + 20); g.stroke();
      g.strokeStyle = '#C9D3E3'; g.beginPath(); g.moveTo(cx - 11, top + 30); g.lineTo(cx + 11, top + 30); g.stroke(); fillRR(g, cx - 10, top + 36, 20, 6, 3, MINT); }
  }
  function arrowH(g, x0, y0, x1, y1) { g.strokeStyle = CORAL; g.lineWidth = 1.8; g.lineCap = 'round'; g.beginPath(); g.moveTo(x0, y0); g.quadraticCurveTo((x0 + x1) / 2, y0 - 8, x1, y1); g.stroke(); g.beginPath(); g.moveTo(x1 - 4, y1 - 4); g.lineTo(x1, y1); g.lineTo(x1 - 5, y1 + 2); g.stroke(); }
  function signPlate(g, x, y, w, n, title, col) { /* a numbered station sign: a coloured plate, a number disc, white letters */
    shadowed(g, 6, 2, 0.18, function () { fillRR(g, x, y, w, 20, 6, col); }); fillE(g, x + 11, y + 10, 7, 7, '#FFFFFF'); text(g, String(n), x + 11, y + 13.6, 9, 800, col, 'center'); text(g, title, x + 22, y + 13.8, 8.4, 800, '#FFFFFF');
  }
  function paintBack(g, ext) {
    /* the left margin: the workshop's entrance arch and a ride car in the paint stand (wide screens) */
    if (ext.l < -260) {
      var ax = -470; [ax, ax + 230].forEach(function (x) { fillRR(g, x - 7, -6, 14, F + 6, 4, '#FFFFFF'); for (var s = 0; s < 12; s++) fillRR(g, x - 7, -6 + s * 40, 14, 18, 2, s % 2 ? CORAL : '#FFFFFF'); soft(g, x, F + 2, 20, 4, 0.25); });
      shadowed(g, 10, 4, 0.18, function () { fillRR(g, ax - 22, -54, 274, 52, 12, INK); }); CO.plane(g, ax + 6, -28, 1.1, 0, '#FFFFFF'); text(g, 'TechNext ride workshop', ax + 24, -22, 17, 800, '#FFFFFF');
      for (var b = 0; b < 14; b++) fillE(g, ax - 10 + b * 19, -48, 2.6, 2.6, SUN);
      var px = -780; soft(g, px + 60, F + 2, 90, 7, 0.25); fillRR(g, px, F - 20, 120, 14, 4, '#9AA6BC'); [px + 12, px + 108].forEach(function (x) { fillE(g, x, F - 4, 6, 6, '#2A3142'); });
      fillRR(g, px + 22, F - 150, 76, 128, 12, '#2A3142'); fillRR(g, px + 28, F - 144, 64, 96, 8, '#FFFFFF'); fillRR(g, px + 28, F - 144, 64, 96 * 0.5, 8, '#FFE3DE'); text(g, 'v0.3', px + 60, F - 92, 11, 800, CORAL_D, 'center');
      fillRR(g, px + 14, F - 42, 92, 12, 5, CORAL); g.strokeStyle = GREY; g.lineWidth = 4; g.beginPath(); g.moveTo(px + 30, F - 150); g.lineTo(px + 30, F - 180); g.lineTo(px + 90, F - 180); g.lineTo(px + 90, F - 150); g.stroke();
      fillRR(g, px - 120, F - 70, 70, 70, 6, '#C99A6B'); fillRR(g, px - 120, F - 70, 70, 10, 4, '#B5865A'); fillRR(g, px - 110, F - 104, 50, 34, 5, '#C99A6B'); text(g, 'SEATS', px - 85, F - 32, 9, 800, '#7A4E2A', 'center');
    }
    tentBack(g, ext);
    /* the right margin: the GRAND OPENING arch with its ribbon and a popcorn cart (wide screens) */
    if (ext.r > 1010) {
      var gx = 1080; [gx, gx + 190].forEach(function (x) { fillRR(g, x - 9, 60, 18, F - 60, 5, '#FFFFFF'); for (var s2 = 0; s2 < 10; s2++) fillRR(g, x - 9, 60 + s2 * 42, 18, 20, 3, s2 % 2 ? TEAL : '#FFFFFF'); soft(g, x, F + 2, 22, 4, 0.25); });
      shadowed(g, 12, 4, 0.18, function () { g.fillStyle = CORAL; g.beginPath(); g.moveTo(gx - 26, 70); g.quadraticCurveTo(gx + 95, -10, gx + 216, 70); g.lineTo(gx + 216, 100); g.quadraticCurveTo(gx + 95, 26, gx - 26, 100); g.closePath(); g.fill(); });
      text(g, 'GRAND OPENING', gx + 95, 62, 15, 800, '#FFFFFF', 'center'); text(g, 'iOS · Android · Web', gx + 95, 78, 8.5, 800, '#FFE7A8', 'center');
      for (var bb = 0; bb < 11; bb++) { var bt = bb / 10, bxx = lerp(gx - 20, gx + 210, bt), byy = 72 - Math.sin(bt * Math.PI) * 44; fillE(g, bxx, byy, 2.6, 2.6, SUN); }
    }
    if (ext.l < -480) { /* a popcorn cart by the carousel */
      var pcx = -560; soft(g, pcx, F + 2, 50, 6, 0.25); fillRR(g, pcx - 40, F - 110, 80, 90, 8, CORAL); fillRR(g, pcx - 34, F - 104, 68, 50, 5, '#FFF6E0'); for (var pk = 0; pk < 14; pk++) fillE(g, pcx - 26 + (pk % 7) * 9, F - 70 - Math.floor(pk / 7) * 8, 5, 4.5, '#FFF0B8');
      fillE(g, pcx - 28, F - 12, 12, 12, '#2A3142'); fillE(g, pcx + 28, F - 12, 12, 12, '#2A3142'); fillRR(g, pcx - 46, F - 132, 92, 24, 10, '#FFFFFF'); text(g, 'POPCORN', pcx, F - 115, 11, 800, CORAL_D, 'center');
      for (var st2 = 0; st2 < 5; st2++) { g.fillStyle = st2 % 2 ? '#FFFFFF' : CORAL; g.fillRect(pcx - 46 + st2 * 18.4, F - 140, 18.4, 10); }
    }
    /* the queue maze behind the gates */
    g.strokeStyle = 'rgba(255,107,87,.55)'; g.lineWidth = 2.4; g.beginPath(); [262, 286, 310].forEach(function (y, i) { g.moveTo(682 + (i % 2) * 20, y); g.lineTo(856 - ((i + 1) % 2) * 20, y); }); g.stroke();
    for (var qx = 682; qx <= 856; qx += 29) [262, 286, 310].forEach(function (y) { fillRR(g, qx - 2, y - 4, 4, 24, 2, '#C9D3DE'); fillE(g, qx, y - 4, 3.4, 3.4, SUN_D); });
    /* the storyboard: legs, the board, six screens, arrows, the users' notes lane */
    [SB.x + 12, SB.x + SB.w - 12].forEach(function (x) { fillRR(g, x - 4, SB.y + SB.h - 6, 8, F - SB.y - SB.h + 6, 3, '#B5865A'); fillRR(g, x - 12, F - 5, 24, 5, 2, '#9A7048'); });
    shadowed(g, 14, 5, 0.2, function () { fillRR(g, SB.x - 6, SB.y - 6, SB.w + 12, SB.h + 12, 10, '#C99A6B'); }); fillRR(g, SB.x, SB.y, SB.w, SB.h, 6, '#E9C79E');
    g.fillStyle = 'rgba(150,100,60,.12)'; for (var dd = 0; dd < 70; dd++) fillE(g, SB.x + 6 + hash(dd * 3.1) * (SB.w - 12), SB.y + 6 + hash(dd * 7.7) * (SB.h - 12), 1.2, 1.2, 'rgba(150,100,60,.25)');
    fillRR(g, SB.x + 8, SB.y + 6, SB.w - 16, 20, 6, CORAL); fillE(g, SB.x + 19, SB.y + 16, 7, 7, '#FFFFFF'); text(g, '1', SB.x + 19, SB.y + 19.6, 9, 800, CORAL, 'center'); text(g, 'STORYBOARD · who rides, what for', SB.x + 30, SB.y + 19.6, 8, 800, '#FFFFFF');
    for (var f = 0; f < 6; f++) { var col = f % 3, row = Math.floor(f / 3), fx = SB.x + 10 + col * 56, fy = SB.y + 34 + row * 84; g.save(); g.translate(fx + 24, fy + 38); g.rotate((hash(f * 5.1) - 0.5) * 0.06); sketch(g, -24, -38, 48, 74, f); g.restore(); fillE(g, fx + 24, fy, 3, 3, f % 2 ? CORAL : TEAL); }
    arrowH(g, SB.x + 58, SB.y + 70, SB.x + 66, SB.y + 70); arrowH(g, SB.x + 114, SB.y + 70, SB.x + 122, SB.y + 70); g.save(); g.strokeStyle = CORAL; g.lineWidth = 1.8; g.beginPath(); g.moveTo(SB.x + 150, SB.y + 112); g.quadraticCurveTo(SB.x + 170, SB.y + 120, SB.x + 34, SB.y + 120); g.lineTo(SB.x + 34, SB.y + 124); g.stroke(); g.restore();
    arrowH(g, SB.x + 58, SB.y + 154, SB.x + 66, SB.y + 154); arrowH(g, SB.x + 114, SB.y + 154, SB.x + 122, SB.y + 154);
    fillRR(g, SB.x + 6, SB.y + 204, SB.w - 12, 40, 5, 'rgba(255,255,255,.4)'); text(g, 'NOTES FROM YOUR TEAM', SB.x + 12, SB.y + 214, 6.4, 800, '#8A5A30');
    [[SB.x + 92, '#FFE38A', -0.08], [SB.x + 118, '#FFC2CF', 0.06], [SB.x + 144, '#BFEAF2', -0.04]].forEach(function (n) { g.save(); g.translate(n[0], SB.y + 230); g.rotate(n[2]); fillRR(g, -10, -10, 20, 20, 2, n[1]); g.fillStyle = 'rgba(40,40,70,.35)'; g.fillRect(-6, -4, 12, 1.6); g.fillRect(-6, 0, 9, 1.6); g.restore(); });
    /* the rail gantry: two portals and a mid post, the beam, the station signs above it */
    [RAIL.x0 + 6, 640, RAIL.x1 - 6].forEach(function (x) { fillRR(g, x - 5, RAIL.y, 10, F - RAIL.y, 3, '#D5DCE6'); g.fillStyle = 'rgba(255,255,255,.55)'; g.fillRect(x - 4, RAIL.y, 3, F - RAIL.y); fillRR(g, x - 14, F - 7, 28, 7, 3, '#B9C3D1'); soft(g, x, F + 2, 18, 3, 0.2); });
    shadowed(g, 8, 3, 0.18, function () { fillRR(g, RAIL.x0 - 10, RAIL.y - 4, RAIL.x1 - RAIL.x0 + 20, 12, 5, '#5C6B8A'); }); g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(RAIL.x0 - 8, RAIL.y - 2, RAIL.x1 - RAIL.x0 + 16, 3);
    g.fillStyle = SUN; for (var rx = RAIL.x0; rx < RAIL.x1; rx += 24) g.fillRect(rx, RAIL.y + 4, 12, 3);
    signPlate(g, RAIL.x0 - 88, RAIL.y - 34, 84, 3, 'TEST RIDE', TEAL); g.strokeStyle = '#7A869C'; g.lineWidth = 2; g.beginPath(); g.moveTo(RAIL.x0 - 46, RAIL.y - 14); g.lineTo(RAIL.x0 - 46, RAIL.y - 4); g.lineTo(RAIL.x0 - 10, RAIL.y - 4); g.stroke();
    STN.forEach(function (x, i) { fillRR(g, x - 1.5, RAIL.y - 18, 3, 14, 1, '#7A869C'); shadowed(g, 4, 2, 0.14, function () { fillRR(g, x - 30, RAIL.y - 33, 60, 17, 5, '#FFFFFF'); }); fillE(g, x - 21, RAIL.y - 24.5, 4.6, 4.6, '#E3E8EF'); text(g, STN_N[i], x - 13.5, RAIL.y - 21, 7.6, 800, INK); });
    /* the on-ride camera at PHOTOS */
    fillRR(g, STN[2] + 30, RAIL.y + 10, 3, 34, 1, '#7A869C'); fillRR(g, STN[2] + 22, RAIL.y + 40, 20, 14, 4, INK); fillE(g, STN[2] + 26, RAIL.y + 47, 4, 4, '#5C6B8A'); fillE(g, STN[2] + 26, RAIL.y + 47, 2, 2, '#9FC4FF');
    /* the three gates: arches, sign plates, turnstiles */
    GATES.forEach(function (x, i) { var c = GATE_C[i], top = 296;
      soft(g, x, F + 2, 30, 4, 0.22); fillRR(g, x - 25, top + 20, 7, F - top - 20, 3, '#FFFFFF'); fillRR(g, x + 18, top + 20, 7, F - top - 20, 3, '#FFFFFF');
      g.fillStyle = c; g.beginPath(); g.moveTo(x - 27, top + 24); g.quadraticCurveTo(x, top - 12, x + 27, top + 24); g.lineTo(x + 27, top + 32); g.quadraticCurveTo(x, top - 2, x - 27, top + 32); g.closePath(); g.fill();
      shadowed(g, 5, 2, 0.16, function () { fillRR(g, x - 22, top + 30, 44, 18, 5, '#FFFFFF'); }); text(g, GATE_N[i], x, top + 43, 8.6, 800, c === SUN_D ? '#9A6A00' : c, 'center');
      g.fillStyle = c; for (var sp = 0; sp < 6; sp++) g.fillRect(x - 25, top + 56 + sp * 24, 7, 10);
      fillRR(g, x - 4, F - 52, 8, 52, 3, '#AEB8C8'); fillE(g, x, F - 52, 7, 4, '#8A96A8'); g.strokeStyle = '#8A96A8'; g.lineWidth = 3; g.lineCap = 'round'; g.beginPath(); g.moveTo(x, F - 46); g.lineTo(x - 18, F - 40); g.moveTo(x, F - 46); g.lineTo(x + 16, F - 54); g.stroke();
      fillE(g, x, top + 12, 3.4, 3.4, '#E3E8EF'); });
    signPlate(g, 724, 236, 84, 4, 'BOARDING', SUN_D);
    /* ride control: the booth, its striped roof, the window round the Odoo screen, the job printer */
    var B = BOOTH; soft(g, B.x + B.w / 2, F + 3, 76, 7, 0.24);
    fillRR(g, B.x, B.y + 34, B.w, F - B.y - 34, 6, '#F6F1F5'); g.fillStyle = 'rgba(113,75,103,.06)'; for (var bs = 0; bs < 6; bs++) g.fillRect(B.x + 8 + bs * 20, B.y + 34, 10, F - B.y - 34);
    for (var rs = 0; rs < 6; rs++) { fillRR(g, B.x - 6 + rs * 22.3, B.y, 22.3, 32, rs === 0 || rs === 5 ? 6 : 0, rs % 2 ? '#FFFFFF' : PUR); g.fillStyle = rs % 2 ? '#FFFFFF' : PUR; g.beginPath(); g.arc(B.x - 6 + 11.15 + rs * 22.3, B.y + 32, 11.15, 0, Math.PI); g.fill(); }
    fillRR(g, B.x + 6, B.y - 22, B.w - 12, 22, 6, '#FFFFFF'); text(g, 'RIDE CONTROL', B.x + B.w / 2, B.y - 9, 9.6, 800, PUR, 'center'); text(g, 'odoo', B.x + B.w / 2, B.y - 1.6, 6.6, 800, '#9A7A90', 'center');
    shadowed(g, 12, 4, 0.2, function () { fillRR(g, SCR.x - 6, SCR.y - 6, SCR.w + 12, SCR.h + 12, 7, '#2A3142'); }); fillRR(g, SCR.x, SCR.y, SCR.w, SCR.h, 3, '#FFFFFF');
    fillRR(g, B.x + 8, 214, 44, 26, 4, '#E3E8EF'); fillRR(g, B.x + 12, 210, 36, 6, 2, '#C9D3DE'); fillRR(g, B.x + 14, 230, 32, 3, 1.5, '#2A3142'); text(g, 'JOB PRINTER', B.x + 30, 250, 5.4, 800, '#8A96A8', 'center');
    fillRR(g, B.x + 66, 206, 46, 54, 5, '#FFFFFF'); fillRR(g, B.x + 66, 206, 46, 12, 5, PUR); text(g, 'TODAY', B.x + 89, 215, 6.2, 800, '#FFFFFF', 'center'); [0, 1, 2].forEach(function (j) { g.fillStyle = '#C9D3E3'; g.fillRect(B.x + 72, 226 + j * 10, 22, 3); fillE(g, B.x + 103, 227.5 + j * 10, 2.6, 2.6, MINT); });
    /* the valance over the yard: striped scallops on a truss, the string of bulbs, the launch board on two ropes */
    var e = ext; g.fillStyle = '#E9EEF6'; g.fillRect(e.l, VAL_T - 14, e.r - e.l, 14); g.strokeStyle = '#C9D3E0'; g.lineWidth = 1.4; g.beginPath(); for (var tx = Math.floor(e.l / 20) * 20; tx < e.r; tx += 20) { g.moveTo(tx, VAL_T - 14); g.lineTo(tx + 10, VAL_T); g.lineTo(tx + 20, VAL_T - 14); } g.stroke();
    for (var vx = Math.floor(e.l / 36) * 36, vi = Math.floor(e.l / 36); vx < e.r; vx += 36, vi++) { var vc = vi % 2 ? '#FFFFFF' : CORAL; g.fillStyle = vc; g.fillRect(vx, VAL_T, 36, VAL_B - VAL_T); g.beginPath(); g.arc(vx + 18, VAL_B, 18, 0, Math.PI); g.fill(); }
    g.fillStyle = 'rgba(120,30,20,.08)'; g.fillRect(e.l, VAL_T, e.r - e.l, 6); g.fillStyle = SUN; g.fillRect(e.l, VAL_B - 12, e.r - e.l, 5);
    [LB.x + 30, LB.x + LB.w - 30].forEach(function (x) { g.strokeStyle = '#B5865A'; g.lineWidth = 2; g.beginPath(); g.moveTo(x, VAL_B + 12); g.lineTo(x, LB.y); g.stroke(); });
    shadowed(g, 14, 5, 0.22, function () { fillRR(g, LB.x, LB.y, LB.w, LB.h, 12, CORAL); }); fillRR(g, LB.x + 8, LB.y + 8, LB.w - 16, LB.h - 16, 7, '#FFFFFF');
    fillE(g, LB.x + 24, LB.y + 26, 9, 9, CORAL); text(g, '5', LB.x + 24, LB.y + 30, 11, 800, '#FFFFFF', 'center'); text(g, 'LAUNCH DAY', LB.x + 40, LB.y + 31, 13, 800, INK);
    [['App Store', BLUE], ['Google Play', MINT], ['Web', SUN_D]].forEach(function (q, i) { var bx2 = LB.x + 18 + i * 72; fillRR(g, bx2, LB.y + 48, 64, 15, 7.5, '#F3F6FA'); fillE(g, bx2 + 8, LB.y + 55.5, 3.4, 3.4, q[1]); text(g, q[0], bx2 + 14, LB.y + 58.6, 7, 800, '#3D4560'); });
  }
  function paintFront(g, ext) {
    if (ext.l < 60) tentFront(g);
    /* the prototype bench: open, so the developer's chair and legs show; the laptop BESIDE him on the left */
    CO.desk(g, BENCH.x, BENCH.y, BENCH.w, F, { open: true, legs: '#9AA6BC', top: '#F6D7B0' });
    fillRR(g, BENCH.x + 8, BENCH.y + 12, BENCH.w - 16, 20, 5, INK); fillE(g, BENCH.x + 22, BENCH.y + 22, 7, 7, '#FFFFFF'); text(g, '2', BENCH.x + 22, BENCH.y + 25.6, 9, 800, INK, 'center');
    text(g, 'PROTOTYPE BENCH · click it before code', BENCH.x + 34, BENCH.y + 25.6, 8, 800, '#FFE7A8');
    fillRR(g, LAP.x - 4, LAP.y - 4, LAP.w + 8, LAP.h + 6, 4, '#2A3142'); fillRR(g, LAP.x - 10, BENCH.y - 5, LAP.w + 20, 5, 2, '#AEB8C8'); g.fillStyle = 'rgba(255,255,255,.4)'; g.fillRect(LAP.x - 6, BENCH.y - 4, LAP.w + 12, 1.4);
    /* the prototype phone on its stand */
    fillRR(g, PROTO.x + PROTO.w / 2 - 3, PROTO.y + PROTO.h, 6, BENCH.y - PROTO.y - PROTO.h, 2, '#7A869C'); fillRR(g, PROTO.x + 2, BENCH.y - 4, PROTO.w - 4, 4, 2, '#7A869C');
    shadowed(g, 8, 3, 0.2, function () { fillRR(g, PROTO.x - 3, PROTO.y - 3, PROTO.w + 6, PROTO.h + 6, 9, '#1F2236'); });
    /* the 3D-printed ride model, sketch paper, a pencil cup */
    soft(g, MODEL.x, BENCH.y - 1, 30, 3, 0.25); fillRR(g, MODEL.x - 28, BENCH.y - 6, 56, 6, 2, '#FFFFFF'); g.strokeStyle = '#7FD3E0'; g.lineWidth = 3; g.beginPath(); g.moveTo(MODEL.x - 24, BENCH.y - 8); g.quadraticCurveTo(MODEL.x - 12, BENCH.y - 40, MODEL.x, BENCH.y - 24); g.arc(MODEL.x + 6, BENCH.y - 30, 10, Math.PI * 0.9, Math.PI * 2.75); g.quadraticCurveTo(MODEL.x + 22, BENCH.y - 20, MODEL.x + 26, BENCH.y - 8); g.stroke();
    [MODEL.x - 18, MODEL.x + 20].forEach(function (x) { g.fillStyle = '#B9C3D1'; g.fillRect(x - 1, BENCH.y - 22, 2, 16); });
    g.save(); g.translate(BENCH.x + 236, BENCH.y - 1); g.rotate(-0.06); fillRR(g, -16, -3, 32, 3, 1, '#FFFFFF'); fillRR(g, -14, -6, 30, 3, 1, '#FFF3D6'); g.restore();
    fillRR(g, BENCH.x + 254, BENCH.y - 16, 12, 16, 3, CORAL); [0, 1, 2].forEach(function (j) { fillRR(g, BENCH.x + 255 + j * 3.4, BENCH.y - 26 + j * 2, 2.2, 12, 1, [SUN, TEAL, BLUE][j]); });
    /* the dispatch lever's floor box */
    soft(g, LEVER.x, F + 2, 18, 3, 0.25); fillRR(g, LEVER.x - 12, F - 20, 24, 20, 4, '#5C6B8A'); fillRR(g, LEVER.x - 9, F - 22, 18, 4, 2, '#3A4458'); text(g, 'GO', LEVER.x, F - 7, 7, 800, '#FFE7A8', 'center');
  }
  function cone(g, x, y) { soft(g, x, y + 2, 14, 3, 0.25); g.fillStyle = '#FF8A3D'; g.beginPath(); g.moveTo(x - 11, y); g.lineTo(x, y - 30); g.lineTo(x + 11, y); g.closePath(); g.fill(); fillRR(g, x - 14, y - 3, 28, 5, 2, '#D9741A'); g.fillStyle = '#FFFFFF'; g.fillRect(x - 6, y - 16, 12, 4); }
  function zBogie(g) { var wb = -900; soft(g, wb + 40, 744, 50, 5, 0.25); fillE(g, wb + 20, 724, 18, 18, '#2A3142'); fillE(g, wb + 20, 724, 7, 7, '#AEB8C8'); fillE(g, wb + 62, 724, 18, 18, '#2A3142'); fillE(g, wb + 62, 724, 7, 7, '#AEB8C8'); fillRR(g, wb + 14, 712, 54, 8, 3, '#5C6B8A'); }
  var FORE_Z = [[700, function (g) { cone(g, -700, 700); }], [704, function (g) { cone(g, -660, 704); }], [744, zBogie], [690, function (g) { cone(g, -596, 690); }], [696, function (g) { cone(g, -560, 696); }]];
  function paintFore(g, ext) {
    /* the near yard: a toolbox, cones and test-zone tape, a spare seat on a pallet, a crate of test phones, a wheel bogie */
    function cone(x, y) { soft(g, x, y + 2, 14, 3, 0.25); g.fillStyle = '#FF8A3D'; g.beginPath(); g.moveTo(x - 11, y); g.lineTo(x, y - 30); g.lineTo(x + 11, y); g.closePath(); g.fill(); fillRR(g, x - 14, y - 3, 28, 5, 2, '#D9741A'); g.fillStyle = '#FFFFFF'; g.fillRect(x - 6, y - 16, 12, 4); }
    var tb = 200; soft(g, tb + 40, 712, 54, 6, 0.25); fillRR(g, tb, 680, 82, 32, 5, CORAL_D); fillRR(g, tb, 680, 82, 9, 4, CORAL); g.strokeStyle = '#7A2A20'; g.lineWidth = 4; g.beginPath(); g.arc(tb + 41, 680, 13, Math.PI, 0); g.stroke(); fillRR(g, tb + 34, 690, 14, 6, 2, '#FFE7A8');
    cone(330, 690); cone(560, 690);
    g.save(); g.strokeStyle = SUN; g.lineWidth = 6; g.beginPath(); g.moveTo(336, 670); g.quadraticCurveTo(445, 684, 554, 670); g.stroke(); g.setLineDash([8, 8]); g.strokeStyle = INK; g.lineWidth = 6; g.beginPath(); g.moveTo(336, 670); g.quadraticCurveTo(445, 684, 554, 670); g.stroke(); g.restore();
    var sx2 = 650; soft(g, sx2 + 44, 734, 60, 6, 0.25); fillRR(g, sx2, 716, 90, 16, 3, '#C99A6B'); g.fillStyle = '#B5865A'; [4, 40, 76].forEach(function (d) { g.fillRect(sx2 + d, 728, 10, 6); });
    fillRR(g, sx2 + 12, 660, 64, 58, 8, '#2A3142'); fillRR(g, sx2 + 16, 664, 56, 34, 5, '#FFFFFF'); fillRR(g, sx2 + 10, 700, 68, 12, 5, CORAL); text(g, 'SPARE SEAT', sx2 + 44, 685, 7, 800, CORAL_D, 'center');
    var cx = 800; soft(g, cx + 40, 740, 54, 6, 0.25); fillRR(g, cx, 704, 80, 36, 5, '#C99A6B'); fillRR(g, cx, 704, 80, 8, 4, '#B5865A'); for (var p = 0; p < 5; p++) { fillRR(g, cx + 6 + p * 14.5, 690 - (p % 2) * 4, 11, 20, 2.5, '#2A3142'); fillRR(g, cx + 7.5 + p * 14.5, 692 - (p % 2) * 4, 8, 13, 1.5, ['#BFEAF2', '#FFE3DE', '#E3F3E6', '#FFF0B8', '#E8E1FB'][p]); }
    text(g, 'TEST DEVICES', cx + 40, 728, 7.4, 800, '#7A4E2A', 'center');
    if (ext.r > 1250) { var ts = 1150; soft(g, ts + 30, 742, 44, 5, 0.25); fillRR(g, ts, 704, 60, 38, 6, TEAL); fillRR(g, ts, 704, 60, 9, 5, TEAL_D); text(g, 'TICKETS', ts + 30, 728, 8, 800, '#FFFFFF', 'center'); }
    /* the balloon cart's base (its balloons are drawn live) */
    var C = CART; soft(g, C.x, C.y + 3, 34, 5, 0.25); fillRR(g, C.x - 26, C.y - 34, 52, 30, 6, '#FFFFFF'); fillRR(g, C.x - 26, C.y - 34, 52, 8, 4, CORAL); text(g, 'BALLOONS', C.x, C.y - 14, 6.6, 800, CORAL_D, 'center');
    fillE(g, C.x - 16, C.y - 2, 7, 7, '#2A3142'); fillE(g, C.x + 16, C.y - 2, 7, 7, '#2A3142'); fillRR(g, C.x + 22, C.y - 70, 4, 40, 2, GREY);
  }

  /* ---------------- live: the sky and the park (behind the yard) ---------------- */
  var BAL = [], FW = { t: -99, big: false }, PRINT = { t: -99 }, NOTE_FLY = [], SCROLL = { t: -99 }, CAMF = { t: -99 };
  function balloon(g, x, y, col, s, sway) {
    g.strokeStyle = 'rgba(80,90,120,.5)'; g.lineWidth = 1; g.beginPath(); g.moveTo(x, y + 14 * s); g.quadraticCurveTo(x + sway * 6, y + 30 * s, x - sway * 3, y + 44 * s); g.stroke();
    fillE(g, x, y, 10 * s, 13 * s, col); fillE(g, x - 3.5 * s, y - 5 * s, 2.6 * s, 4 * s, 'rgba(255,255,255,.55)'); g.fillStyle = col; g.beginPath(); g.moveTo(x - 2.5 * s, y + 14 * s); g.lineTo(x + 2.5 * s, y + 14 * s); g.lineTo(x, y + 11 * s); g.closePath(); g.fill();
  }
  function paintWindow(g, t, par, S) {
    var e = S.ext;
    for (var c = 0; c < 4; c++) { var sp = 4 + c * 2, span = e.r - e.l + 400, x = e.l - 200 + ((hash(c + 2) * span + t * sp) % span), y = -270 + c * 30 - (c % 2) * 24; K.cloud(g, x, y, 0.24 + hash(c) * 0.12); }
    g.strokeStyle = 'rgba(40,60,90,.55)'; g.lineWidth = 1.5; g.lineCap = 'round';
    for (var b = 0; b < 4; b++) { var bsp = e.r - e.l + 300, bx = e.r + 100 - ((t * (15 + b * 3) + hash(b + 9) * bsp) % bsp), by = -230 + b * 14 + Math.sin(t * 0.8 + b) * 6, fl = Math.sin(t * 9 + b * 2) * 4;
      g.beginPath(); g.moveTo(bx - 6, by - fl); g.quadraticCurveTo(bx - 3, by - 3, bx, by); g.quadraticCurveTo(bx + 3, by - 3, bx + 6, by - fl); g.stroke(); }
    /* stray balloons drifting up from the park */
    for (var i = 0; i < 6; i++) { var span2 = 820, bu = ((t * (10 + hash(i) * 6) + hash(i * 3.3) * span2) % span2), bxx = e.l + 60 + hash(i * 7.1) * (e.r - e.l - 120) + Math.sin(t * 0.7 + i) * 14, byy = 200 - bu;
      if (byy > -330) balloon(g, bxx, byy, [CORAL, TEAL, SUN, LILAC, '#FF8FA3', MINT][i], 0.9, Math.sin(t + i)); }
    /* the swing ride's chairs, flying out on their chains */
    var spin = t * 1.3, fly = 0.8 + 0.2 * Math.sin(t * 0.25);
    for (var sc = 0; sc < 8; sc++) { var th = spin + sc * Math.PI / 4, sn = Math.sin(th), rx = SWING.x + Math.cos(th) * 84 * fly, ry = SWING.y + 50 + sn * 12, ax = SWING.x + Math.cos(th) * 52, ay = SWING.y + sn * 6;
      g.globalAlpha = sn < 0 ? 0.6 : 1; g.strokeStyle = '#8A96A8'; g.lineWidth = 1; g.beginPath(); g.moveTo(ax, ay); g.lineTo(rx - 3, ry - 4); g.moveTo(ax, ay); g.lineTo(rx + 3, ry - 4); g.stroke();
      fillRR(g, rx - 5, ry - 4, 10, 7, 2, [CORAL, SUN, TEAL, LILAC][sc % 4]); fillE(g, rx, ry - 7, 2.6, 2.6, CR.skin[sc % 5]); fillE(g, rx, ry - 8.4, 2.7, 1.5, CR.hair[sc % 4]); g.globalAlpha = 1; }
    /* the drop tower car: up slowly, a pause, then the drop */
    var du = (t % 9) / 9, dy = du < 0.6 ? lerp(200, -100, ease(du / 0.6)) : du < 0.72 ? -100 + Math.sin(t * 20) * 1 : lerp(-100, 200, Math.pow((du - 0.72) / 0.28, 2));
    fillRR(g, 470 - 22, dy - 8, 44, 16, 6, SUN); fillRR(g, 470 - 22, dy - 8, 44, 5, 3, '#FFE7A8'); for (var q = 0; q < 4; q++) { fillE(g, 470 - 15 + q * 10, dy + 12, 2.6, 2.6, CR.skin[q % 5]); if (du > 0.72) { g.strokeStyle = CR.skin[q % 5]; g.lineWidth = 1.4; g.beginPath(); g.moveTo(470 - 15 + q * 10, dy + 9); g.lineTo(470 - 17 + q * 10, dy - 4); g.stroke(); } }
    /* the coaster train */
    var span3 = e.r - e.l + 400, hx = e.l - 200 + ((t * 120) % span3);
    for (var cr = 0; cr < 4; cr++) { var x2 = hx - cr * 20, y2 = trackY(x2), a2 = Math.atan2(trackY(x2 + 2) - trackY(x2 - 2), 4); g.save(); g.translate(x2, y2); g.rotate(a2);
      fillRR(g, -9, -11, 18, 9, 3, cr === 0 ? CORAL : cr % 2 ? SUN : TEAL); fillE(g, -3, -14, 2.6, 2.6, CR.skin[(cr * 2) % 5]); fillE(g, 4, -14, 2.6, 2.6, CR.skin[(cr * 3 + 1) % 5]);
      if (a2 > 0.25) { g.strokeStyle = CR.skin[cr % 5]; g.lineWidth = 1.2; g.beginPath(); g.moveTo(-3, -15); g.lineTo(-5, -22); g.moveTo(4, -15); g.lineTo(6, -22); g.stroke(); } g.restore(); }
    S.coasterX = hx;
    /* the far path: two park guests with balloons */
    CO.crew(FAR, g, t, S, false);
    FAR.forEach(function (w) { var P = w.P; if (!P._w) return; var hd = handAt(P, 1); balloon(g, hd[0] + 2, hd[1] - 46 * 0.6, w.balloon, 0.6, Math.sin(t * 2 + w.ph * 9)); });
  }

  /* ---------------- live: the yard (behind the cast) ---------------- */
  function bulbs(g, t, x0, x1, y, n, sag) { for (var i = 0; i <= n; i++) { var u = i / n, x = lerp(x0, x1, u), yy = y + Math.sin(u * Math.PI) * sag, on = ((Math.floor(t * 3) + i) % 3) !== 0; fillE(g, x, yy, on ? 3 : 2.4, on ? 3 : 2.4, on ? '#FFE27A' : '#F2D9A0'); if (on) fillE(g, x - 0.8, yy - 0.8, 1, 1, '#FFFFFF'); } }
  function rider(g, P, x, y, i, t, R, cheer) {
    P.x = x + (i ? 15 : -15); P.y = y; P.look = cheer ? (i ? 0.5 : -0.5) : Math.sin(t * 0.9 + i * 2) * 0.6; P.mood = cheer || R.at === 2 ? 'happy' : R.mv > 0.5 ? 'wow' : 'calm';
    P.talk = cheer && Math.sin(t * 3 + i) > 0; P.hands = cheer || (R.at === 2 && t - CAMF.t < 0.8) ? [[-96, -380 - Math.sin(t * 12 + i) * 16], [96, -380 + Math.sin(t * 12 + i) * 16]] : [[-62, -206], [62, -206]];
    K.person(g, P, t);
  }
  function car(g, t, R, S) {
    if (R.a <= 0.01) return;
    var x = R.x, sway = R.mv * 0.06 + Math.sin(t * 3) * 0.012, cheer = R.at === 4 || (R.st === 4 && R.at < 0);
    g.save(); g.globalAlpha = R.a;
    /* the trolley on the rail and the hanger */
    fillRR(g, x - 16, RAIL.y - 9, 32, 9, 3, '#3A4458'); fillE(g, x - 9, RAIL.y - 9, 4, 4, '#7A869C'); fillE(g, x + 9, RAIL.y - 9, 4, 4, '#7A869C');
    g.translate(x, RAIL.y + 6); g.rotate(sway); g.translate(-x, -(RAIL.y + 6));
    g.strokeStyle = '#5C6B8A'; g.lineWidth = 3; g.beginPath(); g.moveTo(x - 12, RAIL.y + 2); g.lineTo(x - 30, 98); g.moveTo(x + 12, RAIL.y + 2); g.lineTo(x + 30, 98); g.stroke();
    /* the phone seat-back: its screen shows the step (and the platform of this run) */
    shadowed(g, 6, 2, 0.2, function () { fillRR(g, x - 38, 94, 76, 110, 12, INK); }); fillRR(g, x - 33, 99, 66, 100, 8, '#FFFFFF');
    var pf = R.pf; if (pf === 0) fillRR(g, x - 10, 99, 20, 5, 2.5, INK); else if (pf === 1) fillE(g, x, 103, 2.2, 2.2, INK); else { fillRR(g, x - 33, 99, 66, 9, 3, '#EEF1F7'); fillRR(g, x - 22, 101, 44, 5, 2.5, '#FFFFFF'); }
    var stp = R.at >= 0 ? R.at : R.st, ic = clamp(stp, -1, 4), cy = 128;
    fillRR(g, x - 26, 110, 52, 8, 3, ic < 0 ? '#EEF2F7' : [CORAL, TEAL, SUN_D, BLUE, MINT][ic]); text(g, ic < 0 ? 'Jobs' : STN_N[ic], x, 116.6, 5.8, 800, ic < 0 ? '#5C6B7A' : '#FFFFFF', 'center');
    if (ic === 0) { g.fillStyle = CORAL; g.beginPath(); g.arc(x, cy - 2, 6, Math.PI, 0); g.lineTo(x, cy + 10); g.closePath(); g.fill(); fillE(g, x, cy - 2, 2.4, 2.4, '#FFFFFF'); }
    else if (ic === 1) { for (var j = 0; j < 3; j++) { fillRR(g, x - 12, cy - 6 + j * 7, 5, 5, 1, MINT); fillRR(g, x - 4, cy - 5 + j * 7, 16, 3, 1.5, '#C9D3E3'); } }
    else if (ic === 2) { fillRR(g, x - 10, cy - 6, 20, 14, 3, '#5C6B8A'); fillE(g, x, cy + 1, 4.5, 4.5, '#BFEAF2'); }
    else if (ic === 3) { g.strokeStyle = BLUE; g.lineWidth = 1.6; g.beginPath(); g.moveTo(x - 12, cy + 4); g.bezierCurveTo(x - 6, cy - 10, x - 2, cy + 10, x + 2, cy - 2); g.bezierCurveTo(x + 5, cy - 8, x + 8, cy + 6, x + 12, cy); g.stroke(); }
    else if (ic === 4) { fillE(g, x, cy, 8, 8, MINT); g.strokeStyle = '#FFFFFF'; g.lineWidth = 2; g.beginPath(); g.moveTo(x - 4, cy); g.lineTo(x - 1, cy + 3); g.lineTo(x + 4, cy - 3); g.stroke(); }
    else { for (var l = 0; l < 3; l++) fillRR(g, x - 12, cy - 6 + l * 7, 24, 5, 2, '#EEF2F7'); }
    /* the bench seat and the footboard, the riders, the lap bar */
    fillRR(g, x - 40, 188, 80, 8, 4, CORAL); fillRR(g, x - 40, 188, 80, 3, 2, '#FF9C8C'); fillRR(g, x - 36, 212, 72, 5, 2.5, '#5C6B8A'); g.strokeStyle = '#5C6B8A'; g.lineWidth = 2.4; g.beginPath(); g.moveTo(x - 34, 196); g.lineTo(x - 34, 212); g.moveTo(x + 34, 196); g.lineTo(x + 34, 212); g.stroke();
    rider(g, RID[0], x, 212, 0, t, R, cheer); rider(g, RID[1], x, 212, 1, t, R, cheer);
    fillRR(g, x - 38, 186, 76, 4, 2, SUN); g.fillStyle = 'rgba(255,255,255,.6)'; g.fillRect(x - 36, 186.5, 72, 1.2);
    g.restore();
  }
  function paintLive(g, t, now, S) {
    var e = S.ext, R = ride(t); S.R = R;
    /* the string of bulbs under the valance and on the launch board */
    var sx0 = Math.floor(e.l / 120) * 120; for (var bx = sx0; bx < e.r; bx += 120) bulbs(g, t + bx * 0.01, bx, bx + 120, VAL_B + 6, 6, 14);
    for (var lb = 0; lb < 16; lb++) { var on = ((Math.floor(t * 4) + lb) % 2) === 0; fillE(g, LB.x + 8 + lb * (LB.w - 16) / 15, LB.y + 4, 2.2, 2.2, on ? '#FFF2A8' : '#FFB3A6'); fillE(g, LB.x + 8 + lb * (LB.w - 16) / 15, LB.y + LB.h - 4, 2.2, 2.2, on ? '#FFB3A6' : '#FFF2A8'); }
    /* the launch board: testing, passed, or LIVE with fireworks */
    var since = t - FW.t, live = S.hot === 'launch' || since < 5, passed = t - arrive(t, 4) < 2.4 && R.st === 4;
    fillRR(g, LB.x + LB.w - 86, LB.y + 15, 72, 22, 11, live ? MINT : passed ? SUN : '#F3F6FA');
    text(g, live ? 'LIVE ✓' : passed ? 'PASSED ✓' : 'IN TESTING', LB.x + LB.w - 50, LB.y + 29.6, 8.4, 800, live || passed ? '#FFFFFF' : '#5C6B7A', 'center');
    for (var pp = 0; pp < 5; pp++) fillE(g, LB.x + 46 + pp * 11, LB.y + 41, 3.2, 3.2, live || pp <= R.st ? [CORAL, TEAL, SUN_D, BLUE, MINT][pp] : '#E3E8EF');
    if (live && !(S.hot === 'launch' && since > 5 && (t % 4) > 2.6)) { for (var f = 0; f < 3; f++) { var fu = ((t - (FW.t > -9 ? FW.t : 0)) * 0.7 + f * 0.33) % 1, fx = LB.x + 30 + f * 90 + hash(f + Math.floor((t * 0.7 + f * 0.33))) * 40, fy = LB.y - 40 - f % 2 * 30 - fu * 20;
      g.strokeStyle = [SUN, CORAL, TEAL][f]; g.globalAlpha = 1 - fu; g.lineWidth = 2; for (var ra = 0; ra < 10; ra++) { var an = ra * Math.PI / 5, r0 = 6 + fu * 18, r1 = 10 + fu * 30; g.beginPath(); g.moveTo(fx + Math.cos(an) * r0, fy + Math.sin(an) * r0); g.lineTo(fx + Math.cos(an) * r1, fy + Math.sin(an) * r1); g.stroke(); } g.globalAlpha = 1; } }
    /* station lamps: lit once the car has reached them this run */
    STN.forEach(function (x, i) { var lit = R.st >= i && R.a > 0.1, here = R.at === i; fillE(g, x - 21, RAIL.y - 24.5, 4.6, 4.6, here ? ((t % 0.5) < 0.25 ? '#FFE27A' : MINT) : lit ? MINT : '#E3E8EF'); if (S.hot === 'track' && Math.floor(t * 2) % 5 === i) { g.strokeStyle = TEAL; g.lineWidth = 2; rr(g, x - 32, RAIL.y - 35, 64, 21, 6); g.stroke(); } });
    /* the on-ride photo: the flash when the car is at PHOTOS */
    if (R.at === 2) { var cu = t - arrive(t, 2); if (cu > 0.4 && CAMF.t < arrive(t, 2)) CAMF.t = t; }
    var cf = t - CAMF.t; if (cf < 0.35) { g.fillStyle = 'rgba(255,255,255,' + (0.9 * (1 - cf / 0.35)).toFixed(2) + ')'; g.beginPath(); g.arc(STN[2] + 26, RAIL.y + 47, 10 + cf * 120, 0, 7); g.fill(); }
    /* data packets: each station sends its step along the rail to ride control */
    for (var si = 0; si < 5; si++) { var pu = (t - arrive(t, si)) / 1.2; if (pu < 0 || pu > 1 || R.st < si) continue; var px = lerp(STN[si], SCR.x + 6, pu), py = RAIL.y - 6 - Math.sin(pu * Math.PI) * 18; fillE(g, px, py, 4, 4, PUR); fillE(g, px - 1, py - 1, 1.5, 1.5, '#E6D3E0'); }
    /* the gates: this run's platform is lit green */
    GATES.forEach(function (x, i) { var on = R.pf === i, hot = S.hot === 'gates' && Math.floor(t * 1.5) % 3 === i; fillE(g, x, 308, 3.4, 3.4, on ? ((t % 0.8) < 0.5 ? MINT : '#A6F0CF') : '#E3E8EF'); if (hot) { g.strokeStyle = GATE_C[i]; g.lineWidth = 2.4; rr(g, x - 26, 322, 52, 30, 7); g.stroke(); } });
    /* the storyboard: the note lane fills with users' notes as the designer pins them */
    var nn = UX.notes || 0; for (var n = 0; n < nn; n++) { var nx = SB.x + 16 + n * 22, ny = SB.y + 232; g.save(); g.translate(nx, ny); g.rotate((hash(n * 3.7) - 0.5) * 0.2); fillRR(g, -9, -9, 18, 18, 2, ['#FFE38A', '#BFEAF2', '#FFC2CF', '#D9F3E3'][n % 4]); g.fillStyle = 'rgba(40,40,70,.35)'; g.fillRect(-5, -3, 10, 1.6); g.fillRect(-5, 1, 7, 1.6); g.restore(); }
    if (S.hot === 'story') { var fi = Math.floor(t * 1.6) % 6, fx2 = SB.x + 10 + (fi % 3) * 56, fy2 = SB.y + 34 + Math.floor(fi / 3) * 84; g.strokeStyle = CORAL; g.lineWidth = 2.4; rr(g, fx2 - 2, fy2 - 2, 52, 78, 6); g.stroke(); }
    /* ride control: the Odoo job record, filling station by station */
    var X = SCR.x, Y = SCR.y; fillRR(g, X, Y, SCR.w, 16, 3, PUR); g.fillRect(X, Y + 8, SCR.w, 8); text(g, 'Field Service', X + 6, Y + 11.4, 6.8, 800, '#FFFFFF'); text(g, 'FS/2026/0418', X + SCR.w - 5, Y + 11.4, 5.2, 700, '#E6D3E0', 'right');
    FIELDS.forEach(function (fd, i) { var y = Y + 22 + i * 13, filled = fd[1] < 0 ? R.st >= 0 : R.st >= fd[1], fresh = filled && fd[1] >= 0 && t - arrive(t, fd[1]) < 1.6, v = fd[1] < 0 ? (R.st >= 4 ? 'Done' : R.st >= 0 ? VALS[0] : 'Scheduled') : filled ? VALS[i] : '–';
      fillRR(g, X + 4, y, SCR.w - 8, 11, 2.5, fresh ? '#E8F8F0' : '#F6F8FA'); text(g, fd[0], X + 8, y + 7.8, 5.6, 700, '#5C6B7A'); text(g, v, X + SCR.w - 8, y + 7.8, 5.8, 800, filled ? (fd[1] < 0 && R.st >= 4 ? '#1E9E6A' : INK) : '#B5BFCC', 'right'); });
    var sent = R.st >= 4; fillRR(g, X + 4, Y + SCR.h - 15, 58, 11, 5.5, sent ? MINT : '#EEF2F7'); text(g, sent ? 'Invoice ready ✓' : 'Live from the app', X + 33, Y + SCR.h - 7.4, 5.4, 800, sent ? '#FFFFFF' : '#5C6B7A', 'center');
    text(g, 'via ' + GATE_N[R.pf], X + SCR.w - 6, Y + SCR.h - 7.4, 5.4, 700, '#8A96A8', 'right');
    /* the job printer: a report curls out on the admin's tap */
    var pu2 = t - PRINT.t; if (pu2 < 2.6) { var len = Math.min(1, pu2 / 0.9) * 26; fillRR(g, BOOTH.x + 16, 234, 28, len, 1, '#FFFFFF'); g.fillStyle = '#C9D3E3'; for (var pl = 0; pl < len / 6; pl++) g.fillRect(BOOTH.x + 19, 238 + pl * 6, 18, 1.6); }
    /* the ride car itself */
    car(g, t, R, S);
    /* little pennants on the gantry */
    [RAIL.x0 + 6, 640, RAIL.x1 - 6].forEach(function (x, i) { var fl = Math.sin(t * 5 + i * 2); g.fillStyle = [CORAL, TEAL, SUN][i]; g.beginPath(); g.moveTo(x + 4, RAIL.y + 12); g.quadraticCurveTo(x + 14, RAIL.y + 13 + fl * 2, x + 24, RAIL.y + 16 + fl * 3); g.quadraticCurveTo(x + 14, RAIL.y + 19 + fl * 2, x + 4, RAIL.y + 24); g.closePath(); g.fill(); });
    if (S.ext.l < 120) blimp(g, t);
    CO.crew(CREW, g, t, S, false);
  }

  /* ---------------- in front of the cast: screens, props, effects ---------------- */
  function paintFrontLive(g, t, S) {
    var R = S.R || ride(t);
    if (S.ext.l < 100) tentLive(g, t, S);
    CO.crew(CREW, g, t, S, true);
    if (S.ext.l < -200) turntable(g, t);
    /* the laptop beside the developer: code that builds, or BUILD OK after his tap */
    var bt = t - (TAP.dev || -99); fillRR(g, LAP.x, LAP.y, LAP.w, LAP.h, 2, '#1E2A3A');
    if (bt < 2.6 && bt > 0.9) { fillRR(g, LAP.x + 6, LAP.y + 9, LAP.w - 12, 14, 4, MINT); text(g, 'BUILD 0.4 ✓', LAP.x + LAP.w / 2, LAP.y + 18.4, 6, 800, '#FFFFFF', 'center'); }
    else { for (var l = 0; l < 5; l++) { var ww = 6 + hash(l + Math.floor(t * (DEV.typing ? 6 : 1.2))) * (LAP.w - 14); fillRR(g, LAP.x + 4 + (l % 2) * 4, LAP.y + 4 + l * 5.6, ww, 2.6, 1.3, ['#7FE3C4', '#FFD84A', '#9FC4FF'][l % 3]); } }
    /* the prototype's screen: the step the test ride is on, a tap ripple when it is tapped */
    var P = PROTO, stp = clamp(R.at >= 0 ? R.at : R.st, -1, 4); fillRR(g, P.x, P.y, P.w, P.h, 6, '#FFFFFF'); fillRR(g, P.x + P.w / 2 - 7, P.y + 2, 14, 3.4, 1.7, '#1F2236');
    fillRR(g, P.x + 4, P.y + 9, P.w - 8, 9, 3, stp < 0 ? '#EEF2F7' : [CORAL, TEAL, SUN_D, BLUE, MINT][stp]); text(g, stp < 0 ? 'Jobs' : STN_N[stp], P.x + P.w / 2, P.y + 15.6, 5.2, 800, stp < 0 ? '#5C6B7A' : '#FFFFFF', 'center');
    for (var r2 = 0; r2 < 4; r2++) { fillRR(g, P.x + 5, P.y + 24 + r2 * 10, P.w - 10, 7, 2, '#F3F6FA'); fillE(g, P.x + 9, P.y + 27.5 + r2 * 10, 2, 2, r2 <= stp ? MINT : '#D5DCE6'); }
    fillRR(g, P.x + 6, P.y + P.h - 14, P.w - 12, 9, 4.5, CORAL); text(g, 'Next', P.x + P.w / 2, P.y + P.h - 7.6, 5.2, 800, '#FFFFFF', 'center');
    if (DEV.tapU != null) { var tu = DEV.tapU; g.strokeStyle = 'rgba(20,177,196,' + (1 - tu).toFixed(2) + ')'; g.lineWidth = 2; g.beginPath(); g.arc(P.x + P.w / 2, P.y + P.h - 10, 3 + tu * 14, 0, 7); g.stroke(); }
    /* the ride model on the bench: a tiny car loops it */
    var mu = (t * 0.5) % 1, ma = mu * Math.PI * 2; fillE(g, MODEL.x + 6 + Math.cos(ma - Math.PI / 2) * 10, BENCH.y - 30 + Math.sin(ma - Math.PI / 2) * 10, 3, 3, CORAL);
    props(g, t, S, R);
    /* the dispatch lever */
    var lv = OPS.lever || 0, la = 0.22 - lv * 0.6; g.save(); g.translate(LEVER.x, F - 20); g.rotate(la); fillRR(g, -3, -78, 6, 78, 3, '#AEB8C8'); fillE(g, 0, -80, 8, 8, CORAL_D); fillE(g, -2, -82, 2.6, 2.6, 'rgba(255,255,255,.6)'); g.restore();
    /* the balloon cart's bunch (tap: they fly off, and a new bunch grows back) */
    var C = CART, tb = t - (TOYB || -99), gone = tb < 6 ? clamp((tb - 0.1) * 4, 0, 1) : 0, back = tb < 6 ? clamp((tb - 4.2) / 1.6, 0, 1) : 1;
    var hold = tb < 6 ? back : 1; for (var bi = 0; bi < 6; bi++) { var ang = -1.1 + bi * 0.44, bx = C.x + 24 + Math.cos(ang) * 22 * hold, by = C.y - 104 + Math.sin(ang) * 14 - (bi % 2) * 10 + Math.sin(t * 1.6 + bi) * 2;
      if (hold > 0.05) { g.strokeStyle = 'rgba(80,90,120,.45)'; g.lineWidth = 1; g.beginPath(); g.moveTo(C.x + 24, C.y - 70); g.lineTo(bx, by + 12 * hold); g.stroke(); g.save(); g.translate(bx, by); g.scale(hold, hold); balloon(g, 0, 0, [CORAL, TEAL, SUN, LILAC, MINT, '#FF8FA3'][bi], 1, 0); g.restore(); } }
    if (tb < 6) for (var fb = 0; fb < 6; fb++) { var fu2 = tb * (0.5 + hash(fb) * 0.3), fx = C.x + 24 + (fb - 2.5) * 14 + Math.sin(tb * 2 + fb) * 10 - fu2 * 40, fy = C.y - 104 - fu2 * 220; if (gone > 0 && fy > S.ext.t - 60) balloon(g, fx, fy, [CORAL, TEAL, SUN, LILAC, MINT, '#FF8FA3'][fb], 1, Math.sin(tb * 3 + fb)); }
    /* flying sticky notes from the designer's tap */
    NOTE_FLY = NOTE_FLY.filter(function (n) { return t - n.t0 < 2.4; }); NOTE_FLY.forEach(function (n) { var u = (t - n.t0); if (u < 0) return; var x = n.x + n.vx * u + Math.sin(u * 5 + n.p) * 10, y = n.y + n.vy * u + 90 * u * u;
      g.save(); g.globalAlpha = clamp(2.4 - u, 0, 1); g.translate(x, y); g.rotate(Math.sin(u * 4 + n.p) * 0.5); g.scale(Math.max(0.35, Math.abs(Math.cos(u * 4 + n.p))), 1); fillRR(g, -9, -9, 18, 18, 2, n.c); g.fillStyle = 'rgba(40,40,70,.3)'; g.fillRect(-5, -3, 10, 1.6); g.fillRect(-5, 1, 7, 1.6); g.restore(); });
  }
  var TOYB = -99;
  function props(g, t, S, R) {
    /* the designer: the sticky note she is about to pin, her marker */
    var hu = handAt(UX, 1); if (UX.holdNote) { g.save(); g.translate(hu[0], hu[1] - 6); g.rotate(-0.15); fillRR(g, -8, -8, 16, 16, 1.5, ['#FFE38A', '#BFEAF2', '#FFC2CF', '#D9F3E3'][(UX.notes || 0) % 4]); g.restore(); }
    else { g.save(); g.translate(hu[0], hu[1]); g.rotate(-0.7); fillRR(g, -2.5, -16, 5, 18, 2, CORAL); fillRR(g, -2.5, -18, 5, 4, 1.5, INK); g.restore(); }
    /* the developer: his mug on a sip, or the prototype phone held high on a tap */
    if (DEV.cup) { var hc = handAt(DEV, 0); fillRR(g, hc[0] - 6, hc[1] - 13, 12, 13, 3, SUN); g.strokeStyle = SUN; g.lineWidth = 2; g.beginPath(); g.arc(hc[0] - 7, hc[1] - 7, 3.4, Math.PI * 0.5, Math.PI * 1.5); g.stroke();
      g.strokeStyle = 'rgba(160,170,190,.6)'; g.lineWidth = 1.3; for (var sv = 0; sv < 2; sv++) { var sy = hc[1] - 18 - ((t * 14 + sv * 8) % 16); g.beginPath(); g.moveTo(hc[0] - 2 + sv * 4, sy + 8); g.quadraticCurveTo(hc[0] + 2 + sv * 4, sy + 4, hc[0] - 2 + sv * 4, sy); g.stroke(); } }
    else { fillRR(g, BENCH.x + 6, BENCH.y - 13, 11, 13, 3, SUN); }
    if (DEV.showPhone) { var hl = handAt(DEV, 0), hr = handAt(DEV, 1), mx = (hl[0] + hr[0]) / 2, my = Math.min(hl[1], hr[1]) - 4;
      shadowed(g, 6, 2, 0.2, function () { fillRR(g, mx - 13, my - 40, 26, 46, 5, '#1F2236'); }); fillRR(g, mx - 10, my - 37, 20, 40, 3, '#FFFFFF'); fillRR(g, mx - 8, my - 30, 16, 10, 2, MINT); text(g, '✓', mx, my - 22.6, 7, 800, '#FFFFFF', 'center'); text(g, '0.4', mx, my - 9, 6, 800, INK, 'center'); }
    /* the project lead: the release notes unrolling on his tap, else the pen he ticks with */
    var su = t - SCROLL.t; if (su < 2.6) { var hl2 = handAt(LEAD, 0), hr2 = handAt(LEAD, 1), len = clamp(su / 0.8, 0, 1) * Math.max(10, F - 6 - hr2[1]); fillRR(g, hl2[0] - 4, hl2[1] - 6, hr2[0] - hl2[0] + 8, 8, 4, '#F3E6CF');
      fillRR(g, hl2[0] + 2, hl2[1], hr2[0] - hl2[0] - 4, len, 1, '#FFFDF6'); g.fillStyle = '#C9D3E3'; for (var ln = 0; ln < len / 9 - 1; ln++) { g.fillRect(hl2[0] + 7, hl2[1] + 8 + ln * 9, (hr2[0] - hl2[0] - 16) * (ln % 3 === 2 ? 0.6 : 1), 2); fillE(g, hr2[0] - 9, hl2[1] + 9 + ln * 9, 1.8, 1.8, MINT); }
      if (len > 20) text(g, 'RELEASE 0.4', (hl2[0] + hr2[0]) / 2, hl2[1] + 8, 5.6, 800, CORAL_D, 'center'); fillRR(g, hl2[0] - 2, hl2[1] + len - 4, hr2[0] - hl2[0] + 4, 7, 3.5, '#F3E6CF'); }
    else { var hp = handAt(LEAD, 1); g.save(); g.translate(hp[0], hp[1]); g.rotate(-0.4 - (LEAD.tick || 0) * 0.5); fillRR(g, -1.6, -14, 3.2, 16, 1.4, BLUE); g.restore(); }
    /* the technician: his own phone, and the signature he draws on it */
    var th = handAt(TECH, 1), tl = handAt(TECH, 0), ph = TECH.showPhone ? th : [(th[0] + tl[0]) / 2, (th[1] + tl[1]) / 2 - 2];
    g.save(); g.translate(ph[0], ph[1]); g.rotate(TECH.showPhone ? -0.1 : 0.15); var sc = TECH.showPhone ? 1.6 : 1; g.scale(sc, sc);
    fillRR(g, -7, -24, 14, 26, 3, '#1F2236'); fillRR(g, -5.5, -22, 11, 22, 2, TECH.signing || TECH.showPhone ? '#FFFFFF' : '#DDF3EA');
    if (TECH.signing || TECH.showPhone) { var sgk = TECH.showPhone ? clamp(TECH.showU * 1.6, 0, 1) : TECH.signU; g.strokeStyle = BLUE; g.lineWidth = 0.9; g.beginPath(); for (var si = 0; si <= 20 * sgk; si++) { var u3 = si / 20, xx = -4 + u3 * 8, yy = -10 + Math.sin(u3 * 14) * 2.4 - u3 * 2; if (si === 0) g.moveTo(xx, yy); else g.lineTo(xx, yy); } g.stroke(); if (TECH.showPhone && sgk >= 1) fillRR(g, -4, -5, 8, 3, 1.5, MINT); }
    else { fillRR(g, -4, -20, 8, 3, 1.5, MINT); for (var rw = 0; rw < 3; rw++) fillRR(g, -4, -15 + rw * 4.5 + ((t * 6) % 4.5) * 0.3, 8, 2.4, 1.2, '#FFFFFF'); }
    g.restore();
    /* the admin: the printed job report waved on her tap */
    if (OPS.wave2) { var ho = handAt(OPS, 1); g.save(); g.translate(ho[0], ho[1]); g.rotate(-0.3 + Math.sin(t * 14) * 0.25); fillRR(g, -1, -34, 16, 34, 1, '#FFFFFF'); g.fillStyle = '#C9D3E3'; for (var j = 0; j < 4; j++) g.fillRect(2, -30 + j * 6, 10, 1.6); fillRR(g, 2, -8, 10, 4, 2, MINT); g.restore(); }
  }

  /* ---------------- the cast: an idle loop and a tap choreography each ---------------- */
  var TAP = {};
  function tapped(id, st, t) { if (st.wave && st.wave !== st._my) { st._my = st.wave; TAP[id] = t; return true; } return false; }
  function lookAtNexi(P, st, t, S, base) { P.look = lerp(P.look, t < st.until ? clamp((S.nexi.x - P.x) / 160, -1, 1) : base, 0.08); }
  /* ---------------- the user-testing tent (behind the title card): a striped canopy where a client's own staff member tries
     the prototype on a tablet while the session runs, a BETA blimp tethered to the tent pole, a painted arrow on the yard to the
     test ride, and a 3D-printed ride car turning on its turntable inside a little queue of stanchions ---------------- */
  var UT = { x: -200, r: 70, top: 168 }, UTAB = { x: 16, y: 300, w: 44, h: 60 }, TT = { x: -380, y: 604 };
  var TESTER = W({ x: -70, y: F, s: 0.46, ph: 4.2, skin: 0, hair: 2, style: 'long', outfit: 'shirt', top: '#FF8FA3', id: GREY, hands: [[-60, -210], [80, -250]], look: 0.5 });
  var UTS = { stars: -99 };
  function tentBack(g, ext) {
    if (ext.l > 80) return;
    /* the painted arrow on the yard: this way to the test ride */
    g.save(); g.fillStyle = 'rgba(255,201,60,.55)'; g.beginPath(); g.moveTo(-600, 528); g.lineTo(60, 528); g.lineTo(60, 512); g.lineTo(112, 540); g.lineTo(60, 568); g.lineTo(60, 552); g.lineTo(-600, 552); g.closePath(); g.fill();
    g.globalAlpha = 0.75; text(g, 'THIS WAY TO THE TEST RIDE', -250, 545, 11, 800, '#B07A00', 'center'); g.restore();
    /* the tent's back cloth, its pin board of notes from the session */
    fillRR(g, UT.x + 6, UT.top + 40, UT.r - UT.x - 12, F - UT.top - 40, 4, '#FFF3E2'); g.fillStyle = 'rgba(255,107,87,.08)'; for (var sx = UT.x + 6; sx < UT.r - 6; sx += 26) g.fillRect(sx, UT.top + 40, 13, F - UT.top - 40);
    shadowed(g, 6, 2, 0.14, function () { fillRR(g, UT.x + 20, UT.top + 58, 120, 86, 5, '#E9C79E'); }); fillRR(g, UT.x + 24, UT.top + 62, 112, 78, 3, '#F3DCBC');
    text(g, 'SESSION NOTES', UT.x + 80, UT.top + 74, 6.8, 800, '#7A4E2A', 'center');
    [['#FFE38A', 'tap target', -0.06], ['#BFEAF2', 'clear!', 0.05], ['#FFC2CF', 'where is sign?', -0.03], ['#D9F3E3', 'fast', 0.07]].forEach(function (n, i) { g.save(); g.translate(UT.x + 46 + (i % 2) * 56, UT.top + 96 + Math.floor(i / 2) * 30); g.rotate(n[2]); fillRR(g, -22, -11, 44, 22, 2, n[0]); text(g, n[1], 0, 3, 5.6, 700, INK, 'center'); g.restore(); });
    fillRR(g, UT.x + 150, UT.top + 60, 92, 40, 6, '#FFFFFF'); text(g, 'TASK 2 OF 4', UT.x + 196, UT.top + 75, 7.4, 800, CORAL_D, 'center'); text(g, 'complete a checklist', UT.x + 196, UT.top + 88, 6, 700, '#8A93A6', 'center');
    /* the poles and the scalloped, striped canopy */
    [UT.x, UT.r].forEach(function (x) { fillRR(g, x - 5, UT.top, 10, F - UT.top + 2, 3, '#FFFFFF'); for (var s = 0; s < 6; s++) fillRR(g, x - 5, UT.top + 24 + s * 36, 10, 16, 2, s % 2 ? TEAL : '#FFFFFF'); soft(g, x, F + 2, 14, 3, 0.25); });
    shadowed(g, 10, 4, 0.16, function () { g.fillStyle = TEAL; g.beginPath(); g.moveTo(UT.x - 18, UT.top + 30); g.lineTo((UT.x + UT.r) / 2, UT.top - 34); g.lineTo(UT.r + 18, UT.top + 30); g.closePath(); g.fill(); });
    for (var st = 0; st < 6; st++) { var a = st / 6, b = (st + 0.5) / 6; g.fillStyle = '#FFFFFF'; g.beginPath(); g.moveTo((UT.x + UT.r) / 2, UT.top - 34); g.lineTo(lerp(UT.x - 18, UT.r + 18, a), UT.top + 30); g.lineTo(lerp(UT.x - 18, UT.r + 18, b), UT.top + 30); g.closePath(); g.fill(); }
    var sw = (UT.r - UT.x + 36) / 9; for (var sc = 0; sc < 9; sc++) { g.fillStyle = sc % 2 ? '#FFFFFF' : TEAL; g.beginPath(); g.moveTo(UT.x - 18 + sc * sw, UT.top + 28); g.lineTo(UT.x - 18 + (sc + 1) * sw, UT.top + 28); g.arc(UT.x - 18 + (sc + 0.5) * sw, UT.top + 28, sw / 2, 0, Math.PI); g.closePath(); g.fill(); }
    fillRR(g, (UT.x + UT.r) / 2 - 66, UT.top + 4, 132, 22, 11, INK); text(g, 'USER TESTING', (UT.x + UT.r) / 2, UT.top + 19, 9.6, 800, '#FFFFFF', 'center');
    fillRR(g, (UT.x + UT.r) / 2 - 1.5, UT.top - 60, 3, 28, 1, '#9AA6BC'); g.fillStyle = CORAL; g.beginPath(); g.moveTo((UT.x + UT.r) / 2 + 1.5, UT.top - 60); g.lineTo((UT.x + UT.r) / 2 + 22, UT.top - 53); g.lineTo((UT.x + UT.r) / 2 + 1.5, UT.top - 46); g.fill();
  }
  function tentFront(g) {
    /* the high table, the tablet on its stand BESIDE the tester, a cup of pens, the consent clipboard */
    soft(g, -30, F + 2, 70, 5, 0.22); [-90, 22].forEach(function (x) { fillRR(g, x, 384, 6, F - 384, 2, '#9AA6BC'); }); fillRR(g, -86, F - 6, 104, 5, 2, '#9AA6BC');
    shadowed(g, 6, 3, 0.14, function () { fillRR(g, -106, 378, 140, 10, 3, '#F6D7B0'); }); fillRR(g, -106, 378, 140, 3, 2, '#FFE9C8');
    fillRR(g, UTAB.x + UTAB.w / 2 - 3, UTAB.y + UTAB.h, 6, 378 - UTAB.y - UTAB.h, 2, '#7A869C'); fillRR(g, UTAB.x + 6, 374, UTAB.w - 12, 4, 2, '#7A869C');
    shadowed(g, 8, 3, 0.2, function () { fillRR(g, UTAB.x - 4, UTAB.y - 4, UTAB.w + 8, UTAB.h + 8, 7, '#1F2236'); });
    fillRR(g, -30, 364, 12, 14, 3, SUN); [0, 1, 2].forEach(function (j) { fillRR(g, -29 + j * 3.4, 356 + j * 2, 2.2, 12, 1, [CORAL, TEAL, BLUE][j]); });
    g.save(); g.translate(-66, 376); g.rotate(-0.08); fillRR(g, -16, -4, 32, 4, 1, '#C98E55'); fillRR(g, -13, -7, 26, 3, 1, '#FFFFFF'); g.restore();
  }
  function tentLive(g, t, S) {
    /* the tablet: the prototype screen, a tap ripple where she presses, a progress bar through the four tasks */
    var x = UTAB.x, y = UTAB.y, step = Math.floor(t / 4) % 4; fillRR(g, x, y, UTAB.w, UTAB.h, 4, '#FFFFFF'); fillRR(g, x, y, UTAB.w, 9, 4, CORAL); text(g, 'Field app', x + 4, y + 7, 5, 800, '#FFFFFF');
    for (var r = 0; r < 4; r++) { var done = r < step || (t - UTS.stars < 3); fillRR(g, x + 4, y + 13 + r * 9, UTAB.w - 8, 7, 2, done ? '#E3F3E6' : '#F3F6FA'); fillE(g, x + 8, y + 16.5 + r * 9, 2, 2, done ? MINT : '#C9D3E3'); fillRR(g, x + 12, y + 15.5 + r * 9, 18, 2, 1, '#C9D3E3'); }
    fillRR(g, x + 4, y + UTAB.h - 8, UTAB.w - 8, 4, 2, '#EEF2F7'); fillRR(g, x + 4, y + UTAB.h - 8, (UTAB.w - 8) * ((step + ((t % 4) / 4)) / 4), 4, 2, TEAL);
    if (TESTER.tapAt != null) { var q = TESTER.tapAt; g.strokeStyle = 'rgba(255,107,87,' + (0.8 * (1 - q)).toFixed(2) + ')'; g.lineWidth = 1.6; g.beginPath(); g.arc(x + 24, y + 17 + step * 9, 3 + q * 10, 0, Math.PI * 2); g.stroke(); }
    var su = t - UTS.stars; if (su < 2.6) { var a = Math.min(1, su / 0.3) * (1 - clamp((su - 2.1) / 0.5, 0, 1)); g.save(); g.globalAlpha = a; var bx = x - 30, by = y - 40 - su * 8;
      shadowed(g, 6, 2, 0.18, function () { fillRR(g, bx, by, 96, 26, 13, '#FFFFFF'); }); for (var s = 0; s < 5; s++) star(g, bx + 14 + s * 17, by + 13, 6.4, s < Math.min(5, Math.ceil(su * 4)) ? SUN : '#E3E8EF'); g.restore(); }
  }
  /* the turntable with the 3D-printed ride car, and the little queue of stanchions round it */
  function turntable(g, t) {
    var x = TT.x, y = TT.y, a = t * 0.6; soft(g, x, y + 6, 74, 8, 0.25); fillE(g, x, y + 4, 66, 15, '#C9D3DE'); fillE(g, x, y, 66, 15, '#FFFFFF'); fillE(g, x, y, 54, 11, '#F3F6FA');
    for (var m = 0; m < 12; m++) { var ma = a + m * Math.PI / 6; fillE(g, x + Math.cos(ma) * 60, y + Math.sin(ma) * 13, 1.8, 1.4, m % 2 ? CORAL : TEAL); }
    var c = Math.cos(a), s = Math.sin(a), w = 26 + Math.abs(c) * 22, dep = s * 4;
    fillRR(g, x - w / 2, y - 30 - dep, w, 24, 8, s > 0 ? CORAL : CORAL_D); fillRR(g, x - w / 2 + 4, y - 26 - dep, w - 8, 8, 4, '#FFE3DE'); fillRR(g, x - w / 2 - 2, y - 10 - dep, w + 4, 6, 3, INK);
    fillRR(g, x - 2, y - 44 - dep, 4, 16, 2, GREY); fillE(g, x, y - 46 - dep, 4, 4, SUN);
    [[-1, 1], [1, 1]].forEach(function (k) { fillE(g, x + k[0] * w * 0.36 * Math.abs(c), y - 4 - dep, 4.4, 4.4, '#2A3142'); });
    fillRR(g, x - 34, y + 20, 68, 14, 5, INK); text(g, 'RIDE MODEL · v0.3', x, y + 30, 6.4, 800, '#FFE7A8', 'center');
    [-470, -440, -320, -290].forEach(function (px, i) { soft(g, px, y + 34, 9, 2.5, 0.25); fillRR(g, px - 2.5, y - 8, 5, 40, 2, '#B9C3D1'); fillE(g, px, y - 9, 4.5, 4.5, SUN_D); fillE(g, px, y + 33, 8, 3, '#9AA6BC'); });
    g.strokeStyle = CORAL; g.lineWidth = 3; g.beginPath(); g.moveTo(-470, y - 4); g.quadraticCurveTo(-455, y + 6, -440, y - 4); g.moveTo(-320, y - 4); g.quadraticCurveTo(-305, y + 6, -290, y - 4); g.stroke();
  }
  /* the BETA blimp, tethered to the tent pole, bobbing in the breeze */
  function blimp(g, t) {
    var x = -150 + Math.sin(t * 0.35) * 26, y = 40 + Math.sin(t * 0.8) * 6, tilt = Math.sin(t * 0.5) * 0.06;
    g.strokeStyle = 'rgba(28,35,64,.45)'; g.lineWidth = 1.2; g.beginPath(); g.moveTo((UT.x + UT.r) / 2, UT.top - 60); g.quadraticCurveTo((UT.x + UT.r) / 2 + 30, (UT.top - 60 + y) / 2 + 20, x - 10, y + 22); g.stroke();
    g.save(); g.translate(x, y); g.rotate(tilt); fillE(g, 0, 0, 58, 22, '#FFFFFF'); fillE(g, 0, 4, 54, 16, '#F3F6FA'); g.fillStyle = TEAL; g.beginPath(); g.moveTo(-52, -4); g.lineTo(-74, -20); g.lineTo(-70, 0); g.lineTo(-74, 20); g.lineTo(-52, 6); g.closePath(); g.fill();
    fillRR(g, -26, -9, 52, 18, 9, CORAL); text(g, 'BETA', 0, 4.6, 10.6, 800, '#FFFFFF', 'center'); fillRR(g, -12, 20, 24, 8, 3, INK); fillE(g, 54, -2, 3, 3, (t % 1) < 0.5 ? SUN : '#FFF4C2'); g.restore();
  }
  var castTester = { id: 'tester', behind: true, keys: [], P: TESTER, act: function (P, t, S) {
    var st = S.cast.tester; if (tapped('tester', st, t)) { UTS.stars = t + 0.4; }
    P.tilt = 0; P.hop = 0; P.tapAt = null; P.x = -70;
    var tk = TAP.tester != null ? t - TAP.tester : 99;
    if (tk < 2.8) { var q = tk / 2.8; P.talk = true; P.mood = 'happy'; P.look = 0.3; P.hands = [[-90, -400 - Math.sin(q * Math.PI * 3) * 14], [90, -400 - Math.cos(q * Math.PI * 3) * 14]];
      P.hop = Math.abs(Math.sin(q * Math.PI * 2)) * 12; if (q > 0.35 && !TAP.testerB) { TAP.testerB = true; CR.burst('star', UTAB.x + 22, UTAB.y - 20, t); } return; }
    TAP.testerB = false;
    var cy = (t + 1) % 10; P.talk = t < st.until; P.mood = P.talk ? 'happy' : 'calm';
    if (cy < 4.5) { var tp = (t * 1.6) % 1, press = tp < 0.18; P.tapAt = tp < 0.6 ? tp / 0.6 : null; P.hands = [[-60, -210], [112, -262 + (press ? 6 : 0)]]; P.tilt = 0.04; lookAtNexi(P, st, t, S, 0.85); return; }
    if (cy < 7) { P.mood = 'calm'; P.hands = [[-50, -210], [18, -322 + Math.sin(t * 2) * 3]]; P.tilt = -0.04; lookAtNexi(P, st, t, S, 0.5); return; }
    var nod = Math.sin((cy - 7) * 6) * 0.04; P.mood = 'happy'; P.tilt = nod; P.hands = [[-60, -210], [96, -300]]; lookAtNexi(P, st, t, S, -0.4);
  } };
  var castUX = { id: 'ux', behind: true, keys: ['story'], P: UX, act: function (P, t, S) {
    var st = S.cast.ux; if (tapped('ux', st, t)) { for (var n = 0; n < 8; n++) NOTE_FLY.push({ x: P.x + 30, y: P.y - 250, vx: (n - 3.5) * 30, vy: -150 - hash(n + t) * 60, t0: t + n * 0.05, p: n * 1.3, c: ['#FFE38A', '#BFEAF2', '#FFC2CF', '#D9F3E3'][n % 4] }); CR.burst('spark', P.x, P.y - 300, t); }
    P.sx = 1; P.tilt = 0; P.hop = 0; P.holdNote = false;
    if (TAP.ux && t - TAP.ux < 1.8) { var u = (t - TAP.ux) / 1.8; P.mood = 'happy'; P.talk = true; P.sx = u < 0.55 ? Math.cos(u / 0.55 * Math.PI * 2) : 1; P.hop = Math.sin(Math.min(1, u / 0.55) * Math.PI) * 14; P.hands = [[-110, -360], [120, -400 + Math.sin(t * 14) * 12]]; return; }
    /* idle: a 7 s loop: pin a note in the lane, step back to look, then draw an arrow between two screens */
    var cyc = Math.floor(t / 7), c = (t % 7); P.notes = cyc % 5; P.talk = t < st.until || S.hot === 'story'; P.mood = P.talk ? 'happy' : 'calm';
    if (c < 2.4) { var slot = P.notes, tx = SB.x + 16 + slot * 22, reach = Math.sin(clamp(c / 2.4, 0, 1) * Math.PI); P.x = lerp(205, clamp(tx - 20, 196, 236), 0.6); P.holdNote = c < 1.5; var r = rel(P, lerp(P.x + 50, tx, reach), lerp(F - 150, SB.y + 232, reach)); P.hands = [[-70, -170], r]; P.look = 0.8; if (c > 1.5) P.notes = slot + 1; }
    else if (c < 4.2) { P.notes = P.notes + 1; P.x = lerp(P.x, 192, 0.05); P.hands = [[-40, -300], [70, -170]]; P.tilt = 0.08; P.look = 0.7; }
    else { P.notes = P.notes + 1; var du = (c - 4.2) / 2.8, ax = lerp(SB.x + 40, SB.x + 120, du), ay = SB.y + 120 + Math.sin(du * Math.PI) * -8; P.x = lerp(P.x, 210, 0.05); var r2 = rel(P, ax, Math.max(ay, F - 210)); P.hands = [[-70, -170], r2]; P.look = 0.9; }
    if (P.notes > 4) P.notes = 4; lookAtNexi(P, st, t, S, P.look);
  } };
  var castDEV = { id: 'dev', behind: true, keys: ['proto'], P: DEV, act: function (P, t, S) {
    var st = S.cast.dev; if (tapped('dev', st, t)) {}
    P.sx = 1; P.hop = 0; P.tilt = 0; P.cup = false; P.showPhone = false; P.tapU = null; P.typing = false;
    if (TAP.dev && t - TAP.dev < 2.6) { var u = (t - TAP.dev) / 2.6; P.talk = true; P.mood = 'happy';
      if (u < 0.32) { P.sx = Math.cos(u / 0.32 * Math.PI * 2); P.hands = [[-110, -260], [110, -260]]; P.hop = Math.sin(u / 0.32 * Math.PI) * 10; }
      else { if (!TAP.devB) { TAP.devB = true; CR.burst('code', P.x, P.y - 330, t); } P.showPhone = true; var up = Math.sin(Math.min(1, (u - 0.32) / 0.3) * Math.PI / 2); P.hands = [[-34, -230 - up * 170], [34, -230 - up * 170]]; P.look = 0; }
      return; }
    TAP.devB = false;
    var c = t % 10, busy = S.hot === 'proto'; P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm';
    if (busy || (c > 6.6 && c < 8.2)) { /* reach over and tap the prototype's NEXT button */ var tu = busy ? (t * 0.8) % 1 : (c - 6.6) / 1.6, r = rel(P, PROTO.x + PROTO.w / 2, PROTO.y + PROTO.h - 12 + Math.max(0, Math.sin(tu * Math.PI * 2)) * 3); P.hands = [[-90, -206], r]; P.look = 0.8; P.tilt = 0.06; P.tapU = (tu * 2) % 1; }
    else if (c > 8.6) { var su = (c - 8.6) / 1.4, upk = Math.sin(su * Math.PI); P.cup = true; P.hands = [[-50 + upk * 20, -210 - upk * 120], [-40, -206]]; P.tilt = -upk * 0.06; P.look = 0; }
    else { P.typing = true; var k2 = Math.abs(Math.sin(t * 13)) * 7; P.hands = [[-128, -208 - k2], [-58, -208 - (7 - k2)]]; P.look = -0.75; P.sx = 1 - Math.max(0, Math.sin(t * 0.7)) * 0.04; }
    lookAtNexi(P, st, t, S, P.look);
  } };
  var castLEAD = { id: 'lead', behind: true, keys: ['track', 'gates'], P: LEAD, act: function (P, t, S) {
    var st = S.cast.lead; if (tapped('lead', st, t)) { SCROLL.t = t + 0.1; CR.burst('star', P.x, P.y - 320, t); }
    P.hop = 0; P.tilt = 0; P.tick = 0; P.hold = 'clipboard';
    if (t - SCROLL.t < 2.6 && t >= SCROLL.t - 0.1) { var u = (t - SCROLL.t) / 2.6; P.hold = null; P.talk = true; P.mood = 'happy'; P.hands = [[-60, -360], [60, -360]]; P.hop = Math.sin(clamp(u * 3, 0, 1) * Math.PI) * 10; P.look = 0; return; }
    var R = S.R || ride(t), last = -1, la = -99; for (var i = 0; i < 5; i++) { var a = arrive(t, i); if (a > la && R.st >= i) { la = a; last = i; } }
    var tk = t - la, dep = t - departT(t); P.talk = t < st.until || S.hot === 'track' || S.hot === 'gates' || tk < 0.8; P.mood = P.talk ? 'happy' : 'calm';
    if (dep >= 0 && dep < 1.2) { P.hands = [[-70, -200], [120, -380 + Math.sin(t * 10) * 10]]; P.look = -0.7; }
    else if (tk >= 0 && tk < 0.7) { P.tick = Math.sin(tk / 0.7 * Math.PI); P.hands = [[-70, -200], [-20 + P.tick * 10, -210 - P.tick * 12]]; P.look = 0.1; }
    else { P.hands = [[-70, -200], [40, -175]]; P.look = clamp((R.x - P.x) / 180, -1, 1); P.tilt = Math.sin(t * 0.9) * 0.03; }
    P.x = 650 + Math.sin(t * 0.4) * 6; lookAtNexi(P, st, t, S, P.look);
  } };
  var castTECH = { id: 'tech', behind: true, keys: ['gates'], P: TECH, act: function (P, t, S) {
    var st = S.cast.tech; if (tapped('tech', st, t)) {}
    P.hop = 0; P.tilt = 0; P.showPhone = false; P.signing = false; P.signU = 0;
    if (TAP.tech && t - TAP.tech < 2.4) { var u = (t - TAP.tech) / 2.4; P.showPhone = true; P.showU = u; P.talk = true; P.mood = 'happy'; P.hands = [[-70, -200], [70, -300]]; P.look = 0;
      if (u > 0.62 && !TAP.techH) { TAP.techH = true; CR.burst('heart', P.x, P.y - 320, t); } if (u > 0.62) P.hop = Math.sin((u - 0.62) / 0.38 * Math.PI) * 14; return; }
    TAP.techH = false;
    var R = S.R || ride(t), sign = R.at === 3, done = t - arrive(t, 4) < 1.2 && R.st === 4;
    P.talk = t < st.until || S.hot === 'gates'; P.mood = P.talk || done ? 'happy' : 'calm';
    if (sign) { P.signing = true; P.signU = clamp((t - arrive(t, 3)) / 1.2, 0, 1); P.hands = [[-34, -236], [20 + Math.sin(t * 16) * 6, -250 + Math.cos(t * 16) * 4]]; P.look = -0.2; }
    else if (done) { P.hands = [[-34, -236], [96, -380 + Math.sin(t * 16) * 8]]; P.hop = Math.abs(Math.sin(t * 8)) * 8; }
    else { var th = Math.sin(t * 7) * 3; P.hands = [[-30, -238], [36, -246 + th]]; P.look = R.a > 0.3 ? clamp((R.x - P.x) / 200, -1, 0.2) : -0.15; P.x = 872 + Math.sin(t * 0.6) * 4; P.tilt = Math.sin(t * 0.6) * 0.03; }
    lookAtNexi(P, st, t, S, P.look);
  } };
  var castOPS = { id: 'ops', behind: true, keys: ['odoo'], P: OPS, act: function (P, t, S) {
    var st = S.cast.ops; if (tapped('ops', st, t)) { PRINT.t = t; }
    P.hop = 0; P.tilt = 0; P.wave2 = false; P.lever = 0;
    var R = S.R || ride(t);
    if (TAP.ops && t - TAP.ops < 2.8) { var u = (t - TAP.ops) / 2.8; P.talk = true; P.mood = 'happy';
      if (u < 0.35) { P.hands = [[-70, -170], rel(P, BOOTH.x + 30, 236)]; P.look = -0.9; P.tilt = -0.05; }
      else { if (!TAP.opsB) { TAP.opsB = true; CR.burst('spark', P.x, P.y - 330, t); } P.wave2 = true; P.hands = [[-70, -170], [90, -400]]; P.hop = Math.abs(Math.sin(u * Math.PI * 4)) * 10; P.look = 0.2; }
      return; }
    TAP.opsB = false;
    var dep = t - departT(t), pull = dep > -0.5 && dep < 0.6 ? Math.sin(clamp((dep + 0.5) / 1.1, 0, 1) * Math.PI) : 0;
    P.lever = pull; var nod = 0; for (var i = 0; i < 5; i++) { var d = t - arrive(t, i); if (d > 0 && d < 0.9 && R.st >= i) nod = Math.sin(d / 0.9 * Math.PI * 2) * 0.06; }
    P.talk = t < st.until || S.hot === 'odoo' || ((t + 2) % 8) < 1.4; P.mood = P.talk || nod ? 'happy' : 'calm';
    if (pull > 0.01) { var lx = LEVER.x + Math.sin(0.22 - pull * 0.6) * 78, ly = F - 20 - Math.cos(0.22 - pull * 0.6) * 78; P.hands = [[-70, -170], rel(P, lx, ly)]; P.look = 0.6; }
    else { P.hands = [[-70, -170], ((t + 2) % 8) < 1.4 ? [40, -330] : [70, -170]]; P.look = -0.6; P.tilt = nod; }
    lookAtNexi(P, st, t, S, P.look);
  } };

  window.IXW.worlds['sol-app'] = {
    calmView: [100,-60,900,720], calmHide: ['ops'], /* CALM: the framed part of the set */
    pan: [-280, 1240],
    paintBg: paintBg, windowBehind: true, paintFrame: paintFrame, paintBack: paintBack, paintFront: paintFront, paintFore: paintFore,
    paintWindow: paintWindow, paintLive: paintLive, paintFrontLive: paintFrontLive,
    paintForeLive: function (g, t, S) { K.zfore(g, t, S, FORE_Z, function () { CO.crew(CREW, g, t, S, 'fore'); });
      var sp = CREW[3]; if (sp.P._w && sp.P.x > S.ext.l - 60) { var h = handAt(sp.P, 0); fillRR(g, h[0] - 16, h[1] + 2, 32, 18, 3, CORAL_D); fillRR(g, h[0] - 16, h[1] + 2, 32, 5, 2, CORAL); g.strokeStyle = '#7A2A20'; g.lineWidth = 2.4; g.beginPath(); g.arc(h[0], h[1] + 2, 6, Math.PI, 0); g.stroke(); }
      CR.draw(g, t); },
    motes: false,
    glow: {
      story: function (g) { rr(g, SB.x - 12, SB.y - 12, SB.w + 24, SB.h + 24, 14); },
      proto: function (g) { rr(g, PROTO.x - 12, PROTO.y - 12, PROTO.w + 24, PROTO.h + 24, 12); },
      track: function (g) { rr(g, RAIL.x0 - 14, RAIL.y - 40, RAIL.x1 - RAIL.x0 + 28, 186, 16); },
      gates: function (g) { rr(g, GATES[0] - 36, 280, GATES[2] - GATES[0] + 72, F - 280 + 6, 14); },
      odoo: function (g) { rr(g, SCR.x - 12, SCR.y - 12, SCR.w + 24, SCR.h + 24, 12); },
      launch: function (g) { rr(g, LB.x - 10, LB.y - 10, LB.w + 20, LB.h + 20, 16); },
      balloons: function (g) { rr(g, CART.x - 34, CART.y - 136, 90, 144, 18); }
    },
    backGlow: ['story', 'track', 'gates', 'odoo', 'launch'],
    cast: [castTester, castUX, castDEV, castLEAD, castTECH, castOPS],
    toy: function (name, S, t) { if (name === 'balloons') { TOYB = t; CR.burst('conf', CART.x + 20, CART.y - 110, t); } },
    hit: function (x, y, S, t, onBtn) {
      var w = CR.hitWalker(x, y, t); if (w) return w;
      var R = S.R; if (R && R.a > 0.4 && Math.abs(x - R.x) < 42 && y > 90 && y < 220) { CAMF.t = t;
        var lines = ['Wheee! Checked in with **one tap**.', 'Four ticks and the checklist is done. **Next station!**', 'Say cheese: the photos land **on the job in Odoo**.', 'The customer signs **right on the phone**.', 'Done! The office already has **the whole job**.'];
        return { say: R.at >= 0 ? lines[R.at] : R.st < 0 ? 'Boarding the test ride: **Jobs** first, then check in.' : 'On to the next station: every step writes **to Odoo**.', near: R.x < 640 ? [866, -46] : [300, -52], pose: R.x < 640 ? 'point-left' : 'point-right', who: 'Test riders · client team' }; }
      if (onBtn) return null;
      if (x > UT.x - 20 && x < UT.r + 20 && y > UT.top - 40 && y < UT.top + 34) return { say: 'In the **user-testing tent** your own people try each screen before it is built for real.', near: [-60, 60], pose: 'point-left', who: 'The user-testing tent' };
      if (Math.abs(x - TT.x) < 80 && y > TT.y - 60 && y < TT.y + 36) return { say: 'The ride model turns on its stand: every angle checked, like **every screen size** of your app.', near: [-200, 340], pose: 'wow', who: 'The ride model' };
      if (Math.abs(x + 150) < 90 && y > 0 && y < 80) return { say: 'Up goes the **BETA** blimp: a working release your team can try along the way.', near: [-60, 200], pose: 'wow', who: 'The BETA blimp' };
      if (y < HZ && y > -60 && S.coasterX != null && Math.abs(x - S.coasterX + 30) < 60) return { say: 'The coaster out back is just for fun. **Your app** is the ride in front.', near: [clamp(x, 260, 880), -50], pose: 'wow', who: 'The park coaster' };
      if (y < -112 || (y > -112 && y < -60 && (x < LB.x || x > LB.x + LB.w))) return { say: 'Up there: balloons for every release that **passes its test ride**.', near: [clamp(x, 260, 880), -40], pose: 'wow', who: 'The park' };
      return null;
    },
    onStop: function (key, S, t) { S.kT = t; if (key === 'launch') { FW.t = t; CR.burst('conf', LB.x + LB.w / 2, LB.y + 10, t); } }
  };
})(window.IXW && window.IXW.kit, window.CR, window.CO);
