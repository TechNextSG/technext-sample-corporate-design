/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: sol-web (/solutions/website) — "The Model Studio": the client's website built as an architect's scale model in a bright
   Singapore studio (sawtooth skylights, steel windows onto the skyline). Left to right along the back wall: the sitemap pinned
   as a blueprint with the brief's index cards (Brief); the materials board with swatches, type and a short-copy note (Design);
   the schedule rail Brief, Design, Build, Launch, its magnet following the tour; the CHECKS panel (fast, mobile-first,
   accessible, SEO basics, analytics) lighting in turn; a glass pneumatic tube from the model's Contact door to the INBOX/CRM
   receiver (forms that reach you); the domain sign over the GO LIVE console (Launch). On the tables: the drafting table, the
   foam wireframe turning on its turntable, and the working model itself, a desktop pavilion and a mobile tower showing the same
   page. The cast, each with an idle loop and a tap move of their own: the TechNext lead designer (slides the T-square, checks
   the sitemap; tap: unrolls a blueprint overhead), the TechNext UX designer (cuts foam with a hot-wire bow, sets blocks, spins
   the turntable; tap: a zip of shavings and the H1 block held high), the TechNext visual designer (airbrushes the pavilion,
   compares a swatch, blows on the paint; tap: the swatch card flips through the palette in a mist), the TechNext developer
   (tweezers, laptop, plugs in the lights; tap: the master switch, every window lights up), the client (reads the hand-over
   notes, tests the site on a phone; tap: pulls GO LIVE, the sign lights and confetti flies). Lamps sway, a paper-plane mobile
   turns, the 3D printer prints, the coffee steams, capsules whoosh; tap the Contact door to send a test enquiry. */
(function (K, CR, CO) {
  'use strict';
  if (!K || !CR || !CO) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed;
  var F = 470, CEIL = -168, WIN0 = -150, WIN1 = 118, INK = '#1B1F3B';
  var BP = '#2E6FBF', BP_D = '#1F56A3', WALL = '#F6F1E8', OAK = '#D9B48A', OAK_D = '#B98F62', STEEL = '#45526B', FOAM = '#FAFAF7';
  var TEAL = '#14A38B', CORAL = '#FF7A59', NAVY = '#1F2A55', MINT = '#2BC48A', BLUE = '#3167CA', GOLD = '#F2B233', PUR = '#714B67';
  var SMAP = { x: 140, y: -140, w: 192, h: 252 }, MAT = { x: 360, y: -120, w: 162, h: 206 }, RAIL = { x: 548, y: -150, w: 262 }, CHK = { x: 566, y: 124, w: 224, h: 72 };
  var RCV = { x: 878, y: -46, w: 102, h: 112 }, SIGN = { x: 852, y: 94, w: 146, h: 44 }, CON = { x: 862, y: 326, w: 80 };
  var T1 = { x: 150, w: 124, y: 400 }, T2 = { x: 352, w: 150, y: 404 }, T3 = { x: 578, w: 272, y: 404 };
  var PAV = { x: 592, y: 286, w: 114 }, TOW = { x: 722, y: 228, w: 44 }, DOOR = { x: 684, y: 372 }, TT = { x: 427, y: 400 };
  var TUBE = [[712, 392], [712, 64], [744, 40], [872, 40], [884, 30]];
  var STEPS = ['Brief', 'Design', 'Build', 'Launch'], CHECKS = ['Fast', 'Mobile', 'Access', 'SEO', 'Analytics'];
  function setU(g, sx, sy, k) { g.translate(sx, sy); g.scale(k, k); }
  function extOf(W, H, k, sx, sy) { return { l: -(sx + 24) / k, r: (W - sx) / k, t: -(sy + 24) / k, b: (H - sy) / k }; }
  function smooth(u) { u = clamp(u, 0, 1); return u * u * (3 - 2 * u); }
  function tri(g, a, b, c, col) { g.fillStyle = col; g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.lineTo(c[0], c[1]); g.closePath(); g.fill(); }
  function pin(g, x, y, col) { fillE(g, x, y + 1.5, 3.4, 2, 'rgba(30,40,70,.2)'); fillE(g, x, y, 3.4, 3.4, col || '#E0456B'); fillE(g, x - 1, y - 1, 1.1, 1.1, 'rgba(255,255,255,.7)'); }
  function check(g, x, y, s, col) { g.strokeStyle = col || '#FFFFFF'; g.lineWidth = 1.6 * s; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); g.moveTo(x - 3 * s, y); g.lineTo(x - 1 * s, y + 2.4 * s); g.lineTo(x + 3.4 * s, y - 2.6 * s); g.stroke(); }
  /* the tube as a polyline with rounded corners; point at distance u (0..1) */
  var TUBE_L = (function () { var L = 0; for (var i = 1; i < TUBE.length; i++) L += Math.hypot(TUBE[i][0] - TUBE[i - 1][0], TUBE[i][1] - TUBE[i - 1][1]); return L; })();
  function tubeAt(u) { var d = u * TUBE_L; for (var i = 1; i < TUBE.length; i++) { var a = TUBE[i - 1], b = TUBE[i], l = Math.hypot(b[0] - a[0], b[1] - a[1]); if (d <= l) return [lerp(a[0], b[0], d / l), lerp(a[1], b[1], d / l)]; d -= l; } return TUBE[TUBE.length - 1]; }

  /* ---------------- the people ---------------- */
  var W = CR.who;
  var ARC = W({ x: 212, y: 470, s: 0.46, ph: 0.2, skin: 1, hair: 1, style: 'short', outfit: 'shirt', top: '#3167CA', low: '#2A3550', glasses: true, hands: [[-60, -150], [60, -150]], look: 0.3 });
  var UX = W({ x: 312, y: 470, s: 0.46, ph: 1.0, skin: 0, hair: 0, style: 'long', outfit: 'cardigan', top: CORAL, top2: '#FFFFFF', low: '#3A4458', hands: [[-60, -200], [70, -200]], look: 0.5 });
  var VD = W({ x: 540, y: 470, s: 0.46, ph: 1.9, skin: 2, hair: 2, style: 'bun', outfit: 'polo', top: TEAL, top2: '#FFFFFF', clip: '#FFD84A', hands: [[-70, -200], [80, -260]], look: 0.6 });
  var DEV = W({ x: 806, y: 470, s: 0.46, ph: 2.6, skin: 3, hair: 0, style: 'short', outfit: 'polo', top: '#7B5CD6', top2: '#FFFFFF', hands: [[-80, -150], [60, -150]], look: -0.5 });
  var CLI = W({ x: 952, y: 470, s: 0.46, ph: 3.2, skin: 4, hair: 3, style: 'bob', outfit: 'cardigan', top: '#F2B233', top2: '#FFFFFF', low: '#465068', id: '#9AA6BC', hands: [[-70, -180], [60, -200]], look: -0.5 });
  /* the review nook (left, behind the title card): a client seated with the printed mock-ups, the TechNext project lead at the easel */
  var RV = W({ x: -86, y: 470, s: 0.45, ph: 0.7, skin: 2, hair: 0, style: 'short', outfit: 'shirt', top: '#5C8DD6', low: '#3A4458', id: '#9AA6BC', sit: true, chairCol: '#3A4458', hands: [[-50, -240], [50, -240]], look: 0.5 });
  var PM = W({ x: 24, y: 470, s: 0.46, ph: 2.2, skin: 1, hair: 1, style: 'bun', outfit: 'cardigan', top: '#14A38B', top2: '#FFFFFF', low: '#2A3550', hold: 'tablet', hands: [[-60, -200], [80, -300]], look: 0.6 });
  var EAS = { x: 100, y: 236, w: 78, h: 100 }, SIDE = { x: -26, y: 420 };
  var CREW = [
    { x0: 1010, x1: 1290, y: 492, spd: 15, ph: 0.3, label: 'TechNext intern', lines: ['More foam for the **wireframes**!', 'Cut, set, check on the **phone** size too.'], acts: ['cheer', 'wave', 'id'],
      P: W({ s: 0.52, skin: 1, hair: 2, style: 'pony', outfit: 'polo', top: '#3FA9E0', clip: '#FF7A59', hold: 'box' }) },
    { x0: -900, x1: 110, y: 492, spd: 14, ph: 0.6, label: 'TechNext copywriter', lines: ['**Short copy**, real information. Every word earns its place.', 'Titles and descriptions written for **search** too.'], acts: ['nod', 'id', 'wave'],
      P: W({ s: 0.52, skin: 2, hair: 0, style: 'short', outfit: 'cardigan', top: '#7FB685', top2: '#FFFFFF', hold: 'clipboard', glasses: true }) },
    { front: true, x0: 1010, x1: 1300, y: 690, spd: 17, ph: 0.2, label: 'TechNext tester', lines: ['Tested on **real devices**: phone, tablet and desktop.', 'Fast load, no heavy frameworks. **Checked**.'], acts: ['jump', 'id', 'wave'],
      P: W({ s: 0.58, skin: 0, hair: 1, style: 'bob', outfit: 'shirt', top: '#E0567A', hold: 'tablet' }) },
    { front: true, x0: -900, x1: -470, y: 690, spd: 15, ph: 0.9, label: 'A visitor', lines: ['We brought our **current site**. Tell us what to keep!', 'A blank page works too? **Good to know**.'], acts: ['wave', 'love', 'jump'],
      P: W({ s: 0.58, skin: 3, hair: 2, style: 'long', outfit: 'tee', top: '#B7A3E8', id: '#9AA6BC', hold: 'clipboard' }) }
  ];
  var MG = { ext: null, cardL: -9999, tabR: 9999 };
  function fitCrew(S) {
    if (MG.ext !== S.ext) { MG.ext = S.ext; MG.cardL = -9999; MG.tabR = 9999;
      var c = document.querySelector('.ixw-copy'), st = document.querySelector('[data-ixw-set]');
      if (c && st && window.innerWidth >= 768) { var cr = c.getBoundingClientRect(), sr = st.getBoundingClientRect(), k = sr.width / 1000; MG.cardL = (cr.left - sr.left) / k; MG.tabR = (window.innerWidth - 84 - sr.left) / k; } }
    CREW.forEach(function (w) { if (w.xMin == null) { w.xMin = w.x0; w.xMax = w.x1; }
      if (MG.cardL === -9999) { w.x0 = w.xMin; w.x1 = w.xMax; }
      else if (w.xMin >= 1000) { w.x0 = w.xMin; w.x1 = Math.min(w.xMax, MG.tabR - 60); }
      else if (w.xMax <= 200) { w.x0 = Math.max(w.xMin, S.ext.l + 90); w.x1 = Math.min(w.xMax, MG.cardL - 70); } });
  }
  function handAt(P, side) {
    var F3 = K.F3, d = side ? 1 : -1, h = P.hands[side], sxk = P.sx == null ? 1 : P.sx, bw = P.build || 1;
    var r = K.ik(d * F3.shx * bw, F3.shy, h[0], h[1], F3.a, F3.b, d).h, dy = -(P.hop || 0) + (P.sit ? (P.sitDrop != null ? P.sitDrop : 46) : 0);
    return [P.x + r[0] * P.s * sxk, P.y + (r[1] + dy) * P.s];
  }
  function mouthAt(P) { var dy = -(P.hop || 0); return [P.x + P.look * 9 * P.s, P.y + (K.F3.hy + 46 + dy) * P.s]; }

  /* ---------------- static: the sky and the Singapore skyline behind the glass ---------------- */
  function paintBg(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    CO.sky(g, e, e.t, WIN1, [[0, '#8CCBF5'], [0.6, '#CDEBFC'], [1, '#FFF4DF']]);
    var sun = g.createRadialGradient(980, -260, 10, 980, -260, 460); sun.addColorStop(0, 'rgba(255,244,205,.9)'); sun.addColorStop(1, 'rgba(255,244,205,0)'); g.fillStyle = sun; g.fillRect(e.l, e.t, e.r - e.l, 600);
    CO.skySG(g, e.l - 40, e.r + 40, 70, 112, { mbs: 340, wheel: 960, near: ['#B9CDEB', '#ACC3E6'], hazy: 'rgba(170,195,230,.55)' });
    g.restore();
  }
  /* ---------------- live, behind the studio: clouds over the skylights and windows, birds, a plane ---------------- */
  var PLANE = { x: 0, y: 0 };
  function paintWindow(g, t, par, S) {
    var e = S.ext;
    for (var c = 0; c < 7; c++) { var sp = 3 + c * 1.4, span = e.r - e.l + 500, x = e.l - 250 + ((hash(c + 3) * span + t * sp) % span), y = (c % 2 ? -330 : -40) + c * 14; K.cloud(g, x, y, 0.22 + hash(c) * 0.12); }
    g.strokeStyle = 'rgba(40,60,90,.5)'; g.lineWidth = 1.5; g.lineCap = 'round';
    for (var b = 0; b < 5; b++) { var bs = e.r - e.l + 300, bx = e.r + 100 - ((t * (14 + b * 3) + hash(b + 5) * bs) % bs), by = -110 + b * 16 + Math.sin(t * 0.8 + b) * 5, fl = Math.sin(t * 9 + b * 2) * 3.5;
      g.beginPath(); g.moveTo(bx - 6, by - fl); g.quadraticCurveTo(bx - 3, by - 3, bx, by); g.quadraticCurveTo(bx + 3, by - 3, bx + 6, by - fl); g.stroke(); }
    var ps = e.r - e.l + 600, px = e.l - 300 + ((t * 16 + 200) % ps), py = -60 + Math.sin(t * 0.4) * 4; PLANE.x = px; PLANE.y = py;
    g.save(); g.translate(px, py); fillE(g, 0, 0, 20, 4.5, '#FFFFFF'); tri(g, [-4, -1], [6, -1], [-8, -12], '#E3E8EF'); tri(g, [-4, 1], [6, 1], [-8, 12], '#D5DCE6'); tri(g, [-18, -1], [-12, -1], [-20, -8], '#E0456B'); g.fillStyle = 'rgba(255,255,255,.55)'; g.fillRect(-60, -0.8, 40, 1.6); g.restore();
  }

  /* ---------------- static: the roof, the window wall, the walls and the oak floor (hero px) ---------------- */
  function paintFrame(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    /* the sawtooth roof: white ceiling bays with glazed skylights (left open onto the sky), steel trusses */
    var bay = 230, x0 = Math.floor((e.l - bay) / bay) * bay;
    g.fillStyle = '#EEF1F5'; g.beginPath(); g.rect(e.l, e.t, e.r - e.l, CEIL - e.t);
    for (var bx = x0; bx < e.r + bay; bx += bay) { var gt = Math.max(e.t + 10, -520); if (CEIL - 54 - gt > 40) { g.moveTo(bx + 36, CEIL - 54); g.lineTo(bx + 196, CEIL - 54); g.lineTo(bx + 176, gt); g.lineTo(bx + 56, gt); g.closePath(); } }
    g.fill('evenodd');
    for (var gx2 = x0; gx2 < e.r + bay; gx2 += bay) { var gt3 = Math.max(e.t + 10, -520); if (CEIL - 54 - gt3 > 40) { g.strokeStyle = '#DCE2EA'; g.lineWidth = 4; g.beginPath(); for (var m = 1; m < 4; m++) { var u = m / 4; g.moveTo(gx2 + 36 + 160 * u, CEIL - 54); g.lineTo(gx2 + 56 + 120 * u, gt3); } g.stroke(); g.strokeStyle = '#D0D7E2'; g.lineWidth = 6; g.beginPath(); g.moveTo(gx2 + 36, CEIL - 54); g.lineTo(gx2 + 196, CEIL - 54); g.lineTo(gx2 + 176, gt3); g.lineTo(gx2 + 56, gt3); g.closePath(); g.stroke(); } }
    /* the truss along the ceiling line */
    g.fillStyle = '#FFFFFF'; g.fillRect(e.l, CEIL - 44, e.r - e.l, 6); g.fillRect(e.l, CEIL - 8, e.r - e.l, 8);
    g.strokeStyle = '#E3E8EF'; g.lineWidth = 3; g.beginPath(); for (var tx = Math.floor(e.l / 40) * 40; tx < e.r; tx += 40) { g.moveTo(tx, CEIL - 38); g.lineTo(tx + 20, CEIL - 8); g.lineTo(tx + 40, CEIL - 38); } g.stroke();
    /* the window wall: steel frames over the skyline, piers between the bays */
    g.fillStyle = WALL; g.fillRect(e.l, CEIL, e.r - e.l, WIN0 - CEIL);
    g.save(); g.beginPath(); g.rect(e.l, WIN0, e.r - e.l, WIN1 - WIN0); g.clip();
    g.fillStyle = 'rgba(255,255,255,.14)'; for (var gl = Math.floor(e.l / 120) * 120; gl < e.r; gl += 120) { g.beginPath(); g.moveTo(gl + 10, WIN1); g.lineTo(gl + 50, WIN0); g.lineTo(gl + 70, WIN0); g.lineTo(gl + 30, WIN1); g.closePath(); g.fill(); }
    g.fillStyle = STEEL; for (var mx = Math.floor(e.l / 60) * 60; mx < e.r; mx += 60) g.fillRect(mx - 1.5, WIN0, 3, WIN1 - WIN0); for (var my = WIN0 + 67; my < WIN1; my += 67) g.fillRect(e.l, my - 1.5, e.r - e.l, 3);
    g.restore();
    g.fillStyle = STEEL; g.fillRect(e.l, WIN0 - 5, e.r - e.l, 6);
    for (var pr = Math.floor((e.l - 60) / 360) * 360 + 104; pr < e.r + 60; pr += 360) { fillRR(g, pr - 16, WIN0 - 6, 32, WIN1 - WIN0 + 12, 2, '#EDE6DA'); g.fillStyle = 'rgba(120,90,60,.08)'; g.fillRect(pr + 8, WIN0, 8, WIN1 - WIN0); }
    /* the sill and the wall below, a dado rail, the skirting */
    fillRR(g, e.l, WIN1, e.r - e.l, 9, 0, '#FFFFFF'); g.fillStyle = WALL; g.fillRect(e.l, WIN1 + 9, e.r - e.l, F - WIN1 - 9);
    g.fillStyle = 'rgba(160,120,80,.06)'; for (var bk = WIN1 + 30; bk < F; bk += 22) for (var bx2 = Math.floor(e.l / 60) * 60 + ((bk / 22 | 0) % 2) * 30; bx2 < e.r; bx2 += 60) g.fillRect(bx2, bk, 56, 1.4);
    g.fillStyle = '#EADFCC'; g.fillRect(e.l, 300, e.r - e.l, 6); g.fillStyle = '#E6D9C3'; g.fillRect(e.l, F - 14, e.r - e.l, 14);
    /* the oak floor */
    var fl = g.createLinearGradient(0, F, 0, e.b); fl.addColorStop(0, '#E8CFA8'); fl.addColorStop(1, '#D8B88C'); g.fillStyle = fl; g.fillRect(e.l, F, e.r - e.l, e.b - F);
    g.strokeStyle = 'rgba(140,95,50,.16)'; g.lineWidth = 1.8; g.beginPath(); for (var d = 1; d < 10; d++) { var yy = F + Math.pow(d / 9, 1.5) * (e.b - F); g.moveTo(e.l, yy); g.lineTo(e.r, yy); }
    for (var row = 0; row < 9; row++) { var ya = F + Math.pow(row / 9, 1.5) * (e.b - F), yb = F + Math.pow((row + 1) / 9, 1.5) * (e.b - F), stp = 190 * (1 + row * 0.12); for (var px = ((row * 83) % 190) - stp + Math.floor(e.l / stp) * stp; px < e.r; px += stp) { g.moveTo(px, ya); g.lineTo(px + (px - 520) * 0.05, yb); } }
    g.stroke(); g.fillStyle = 'rgba(80,50,20,.10)'; g.fillRect(e.l, F, e.r - e.l, 6);
    /* a cutting-mat rug under the model table */
    g.fillStyle = 'rgba(43,196,138,.16)'; g.beginPath(); g.moveTo(560, F + 14); g.lineTo(880, F + 14); g.lineTo(940, F + 92); g.lineTo(510, F + 92); g.closePath(); g.fill();
    g.strokeStyle = 'rgba(43,196,138,.3)'; g.lineWidth = 1.2; g.beginPath(); for (var gi = 0; gi < 12; gi++) { var u = gi / 11; g.moveTo(lerp(560, 880, u), F + 14); g.lineTo(lerp(510, 940, u), F + 92); } for (var gj = 1; gj < 4; gj++) { var yj = F + 14 + gj * 19.5, sj = (yj - F - 14) / 78; g.moveTo(lerp(560, 510, sj), yj); g.lineTo(lerp(880, 940, sj), yj); } g.stroke();
    g.restore();
  }

  /* ---------------- static back props ---------------- */
  function board(g, x, y, w, h, col, frame) { shadowed(g, 12, 5, 0.18, function () { fillRR(g, x - 6, y - 6, w + 12, h + 12, 6, frame || '#FFFFFF'); }); fillRR(g, x, y, w, h, 3, col); }
  function shelfModel(g, x, y, i) {
    var cols = [TEAL, CORAL, '#3FA9E0', GOLD, '#B7A3E8', '#FFFFFF'], c = cols[i % cols.length], h = 22 + (i * 7) % 24, w = 18 + (i * 5) % 16;
    fillRR(g, x, y - h, w, h, 2, c === '#FFFFFF' ? FOAM : c); g.fillStyle = 'rgba(255,255,255,.55)'; for (var r = y - h + 5; r < y - 4; r += 7) for (var q = x + 3; q < x + w - 3; q += 6) g.fillRect(q, r, 3, 3);
    if (i % 3 === 0) tri(g, [x - 2, y - h], [x + w / 2, y - h - 10], [x + w + 2, y - h], '#C9624A');
  }
  /* the review nook: a woven rug with a scale bar, the easel's legs, a side table with prints and a cup, a pin-up strip of mock-ups */
  function nook(g) {
    g.fillStyle = '#F3E6D2'; g.beginPath(); g.moveTo(-440, F + 14); g.lineTo(110, F + 14); g.lineTo(150, F + 104); g.lineTo(-480, F + 104); g.closePath(); g.fill();
    g.save(); g.beginPath(); g.moveTo(-440, F + 14); g.lineTo(110, F + 14); g.lineTo(150, F + 104); g.lineTo(-480, F + 104); g.closePath(); g.clip();
    g.strokeStyle = 'rgba(46,111,191,.09)'; g.lineWidth = 1; g.beginPath(); for (var gx = -520; gx < 170; gx += 22) { g.moveTo(gx + 25, F + 14); g.lineTo(gx - 10 + (gx + 200) * 0.06, F + 104); } for (var gy = F + 26; gy < F + 104; gy += 13) { g.moveTo(-500, gy); g.lineTo(170, gy); } g.stroke();
    g.fillStyle = 'rgba(255,122,89,.10)'; g.fillRect(-500, F + 14, 700, 6); g.restore();
    g.strokeStyle = 'rgba(46,111,191,.35)'; g.lineWidth = 2; g.beginPath(); g.moveTo(-426, F + 22); g.lineTo(98, F + 22); g.lineTo(132, F + 96); g.lineTo(-462, F + 96); g.closePath(); g.stroke();
    for (var sb = 0; sb < 10; sb++) { g.fillStyle = sb % 2 ? 'rgba(31,42,85,.55)' : 'rgba(255,255,255,.9)'; g.beginPath(); var xa = -380 + sb * 26, xb = xa + 26; g.moveTo(xa, F + 74); g.lineTo(xb, F + 74); g.lineTo(xb - 1.5, F + 82); g.lineTo(xa - 1.5, F + 82); g.closePath(); g.fill(); }
    text(g, '0', -380, F + 92, 7, 800, 'rgba(31,42,85,.6)', 'center'); text(g, '1 : WEB', -100, F + 92, 7, 800, 'rgba(31,42,85,.6)', 'center');
    g.strokeStyle = 'rgba(255,122,89,.3)'; g.lineWidth = 1.4; g.beginPath(); g.arc(30, F + 54, 22, 0, 7); g.moveTo(8, F + 54); g.lineTo(52, F + 54); g.moveTo(30, F + 40); g.lineTo(30, F + 68); g.stroke();
    /* a pin-up strip of past mock-ups above the nook, under the window sill */
    fillRR(g, -104, 140, 214, 4, 2, STEEL); [[-96, CORAL], [-46, TEAL], [4, GOLD], [54, BLUE]].forEach(function (c, i) { g.save(); g.translate(c[0] + 22, 148); g.rotate((i % 2 ? 1 : -1) * 0.04);
      shadowed(g, 6, 2, 0.16, function () { fillRR(g, -21, 0, 42, 56, 2, '#FFFFFF'); }); fillRR(g, -18, 4, 36, 7, 1.5, c[1]); fillRR(g, -18, 14, 36, 16, 1.5, '#EEF2F8'); g.fillStyle = '#C9D3E3'; g.fillRect(-18, 34, 30, 2); g.fillRect(-18, 39, 24, 2); [0, 1, 2].forEach(function (k) { fillRR(g, -18 + k * 13, 44, 10, 8, 1, '#F1F4F9'); }); g.restore(); pin(g, c[0] + 22, 150, c[1]); });
    text(g, 'CLIENT REVIEW', 2, 226, 8.4, 800, '#9AA6BC', 'center'); fillRR(g, -42, 230, 88, 2, 1, '#E3E8EF');
    /* the easel: three oak legs, a ledge (the print is live) */
    var e = EAS; soft(g, e.x, F + 3, 44, 5, 0.22); g.strokeStyle = OAK_D; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.moveTo(e.x, e.y - 10); g.lineTo(e.x - 34, F); g.moveTo(e.x, e.y - 10); g.lineTo(e.x + 34, F); g.moveTo(e.x, e.y + 40); g.lineTo(e.x + 4, F - 6); g.stroke();
    fillRR(g, e.x - e.w / 2 - 6, e.y + e.h, e.w + 12, 7, 2, OAK);
    /* the side table with prints and a cup */
    var sd = SIDE; soft(g, sd.x, F + 3, 30, 5, 0.22); fillRR(g, sd.x - 2, sd.y, 4, F - sd.y, 2, STEEL); fillE(g, sd.x, F - 2, 16, 3.5, STEEL); fillE(g, sd.x, sd.y, 30, 6, '#FFFFFF'); g.strokeStyle = '#E3E8EF'; g.lineWidth = 1; g.beginPath(); g.ellipse(sd.x, sd.y, 30, 6, 0, 0, 7); g.stroke();
    g.save(); g.translate(sd.x - 8, sd.y - 4); g.rotate(-0.12); fillRR(g, -14, -4, 28, 6, 1, '#FFFFFF'); fillRR(g, -12, -3, 10, 2, 1, CORAL); g.restore(); g.save(); g.translate(sd.x - 4, sd.y - 7); g.rotate(0.08); fillRR(g, -14, -4, 28, 6, 1, '#FFFFFF'); fillRR(g, -12, -3, 10, 2, 1, TEAL); g.restore();
    fillRR(g, sd.x + 12, sd.y - 14, 10, 12, 2, '#FFFFFF'); fillRR(g, sd.x + 12, sd.y - 14, 10, 3, 1, CORAL);
  }
  function paintBack(g, ext) {
    /* left of the card (wide screens and above it): the studio sign, shelves of past models, a plan chest, a coffee point */
    fillRR(g, -470, -132, 260, 34, 6, INK); text(g, 'MODEL STUDIO', -340, -109, 15, 800, '#FFFFFF', 'center'); fillE(g, -452, -115, 6, 6, CORAL); fillE(g, -228, -115, 6, 6, TEAL);
    var sh = { x: -420, w: 300 }; fillRR(g, sh.x - 8, 130, 8, F - 130, 2, OAK_D); fillRR(g, sh.x + sh.w, 130, 8, F - 130, 2, OAK_D);
    for (var s = 0; s < 4; s++) { var sy = 200 + s * 70; fillRR(g, sh.x - 8, sy, sh.w + 16, 7, 2, OAK); for (var mm = 0; mm < 9; mm++) shelfModel(g, sh.x + 8 + mm * 32 + (s % 2) * 8, sy, mm + s * 9); }
    if (ext.l < -480) {
      var pc = -900; soft(g, pc + 110, F + 3, 120, 7, 0.22); fillRR(g, pc, 360, 220, F - 360, 6, '#EEF1F5'); for (var dr = 0; dr < 4; dr++) { fillRR(g, pc + 8, 368 + dr * 25, 204, 20, 3, '#FFFFFF'); fillRR(g, pc + 96, 376 + dr * 25, 28, 4, 2, '#9AA6BC'); }
      g.save(); g.globalAlpha = 0.9; fillRR(g, pc + 50, 270, 120, 90, 10, 'rgba(220,240,252,.55)'); g.restore(); shelfModel(g, pc + 70, 356, 4); shelfModel(g, pc + 96, 356, 8); shelfModel(g, pc + 126, 356, 2);
      g.strokeStyle = 'rgba(255,255,255,.9)'; g.lineWidth = 2; rr(g, pc + 50, 270, 120, 90, 10); g.stroke();
      var cf = -620; fillRR(g, cf, 350, 90, F - 350, 6, '#FFFFFF'); fillRR(g, cf - 6, 344, 102, 10, 4, OAK); fillRR(g, cf + 20, 284, 50, 60, 8, '#3A4458'); fillRR(g, cf + 28, 292, 34, 12, 3, '#5C6B7A'); fillRR(g, cf + 36, 324, 18, 8, 2, '#FFFFFF');
      text(g, 'COFFEE', cf + 45, 276, 8, 800, OAK_D, 'center'); K.plant(g, { x: -700, y: F }, '#FFFFFF', '#E3E9F3');
    }
    nook(g);
    /* the brief and the sitemap: a blueprint pinned to the wall, index cards at its corner */
    var m = SMAP; board(g, m.x, m.y, m.w, m.h, BP, '#FFFFFF');
    g.strokeStyle = 'rgba(255,255,255,.12)'; g.lineWidth = 1; g.beginPath(); for (var gx = m.x + 12; gx < m.x + m.w; gx += 12) { g.moveTo(gx, m.y); g.lineTo(gx, m.y + m.h); } for (var gy = m.y + 12; gy < m.y + m.h; gy += 12) { g.moveTo(m.x, gy); g.lineTo(m.x + m.w, gy); } g.stroke();
    text(g, 'SITEMAP', m.x + 10, m.y + 18, 10, 800, '#FFFFFF'); text(g, 'yourcompany.com', m.x + m.w - 10, m.y + 18, 7.4, 700, 'rgba(255,255,255,.75)', 'right');
    g.strokeStyle = 'rgba(255,255,255,.85)'; g.lineWidth = 1.6; g.beginPath(); var hx = m.x + m.w / 2; g.moveTo(hx, m.y + 52); g.lineTo(hx, m.y + 64); g.moveTo(m.x + 36, m.y + 64); g.lineTo(m.x + m.w - 36, m.y + 64);
    [m.x + 36, hx, m.x + m.w - 36].forEach(function (x) { g.moveTo(x, m.y + 64); g.lineTo(x, m.y + 74); }); g.moveTo(hx, m.y + 64); g.lineTo(hx, m.y + 74); g.moveTo(m.x + 36, m.y + 92); g.lineTo(m.x + 36, m.y + 122);
    g.moveTo(m.x + 16, m.y + 122); g.lineTo(m.x + 56, m.y + 122); g.moveTo(m.x + 16, m.y + 122); g.lineTo(m.x + 16, m.y + 130); g.moveTo(m.x + 56, m.y + 122); g.lineTo(m.x + 56, m.y + 130); g.stroke();
    g.setLineDash([4, 3]); g.beginPath(); g.moveTo(hx, m.y + 92); g.lineTo(hx, m.y + 150); g.moveTo(hx - 34, m.y + 150); g.lineTo(hx + 34, m.y + 150); g.moveTo(hx - 34, m.y + 150); g.lineTo(hx - 34, m.y + 160); g.moveTo(hx + 34, m.y + 150); g.lineTo(hx + 34, m.y + 160); g.stroke(); g.setLineDash([]);
    text(g, '1 page = 1 section', m.x + m.w - 8, m.y + m.h - 7, 6.4, 700, 'rgba(255,255,255,.75)', 'right');
    [[m.x - 14, m.y + 196, -0.12, 'Pages', CORAL], [m.x + 22, m.y + 206, 0.06, 'Audiences', TEAL], [m.x + 58, m.y + 198, -0.05, 'Enquiry → who?', GOLD]].forEach(function (c) {
      g.save(); g.translate(c[0] + 32, c[1] + 22); g.rotate(c[2]); shadowed(g, 6, 2, 0.18, function () { fillRR(g, -32, -22, 64, 44, 3, '#FFFFFF'); }); fillRR(g, -32, -22, 64, 8, 3, c[4]); g.fillStyle = '#C9D3E3'; g.fillRect(-26, 6, 40, 2.4); g.fillRect(-26, 12, 30, 2.4); text(g, c[3], -26, 0, 7.2, 800, INK); pin(g, 0, -18, '#E0456B'); g.restore(); });
    /* the materials board: swatches, type, a logo sketch, photos and a short-copy note */
    var b = MAT; board(g, b.x, b.y, b.w, b.h, '#E3C9A0', '#8E6440');
    g.fillStyle = 'rgba(140,95,50,.14)'; for (var dd = 0; dd < 90; dd++) g.fillRect(b.x + hash(dd) * b.w, b.y + hash(dd * 2.7) * b.h, 2, 2);
    text(g, 'MATERIALS', b.x + 8, b.y + 14, 8, 800, '#6B4A2A');
    [TEAL, CORAL, NAVY, GOLD, '#FFFFFF'].forEach(function (c, i) { g.save(); g.translate(b.x + 18 + i * 19, b.y + 40); g.rotate((i - 2) * 0.06); fillRR(g, -8, -14, 16, 30, 2, '#FFFFFF'); fillRR(g, -6, -12, 12, 18, 1.5, c); if (c === '#FFFFFF') { g.strokeStyle = '#E3E8EF'; g.lineWidth = 1; rr(g, -6, -12, 12, 18, 1.5); g.stroke(); } g.restore(); pin(g, b.x + 18 + i * 19, b.y + 26, '#3A4458'); });
    g.save(); g.translate(b.x + 40, b.y + 102); g.rotate(-0.05); shadowed(g, 6, 2, 0.16, function () { fillRR(g, -30, -30, 60, 56, 3, '#FFFFFF'); }); text(g, 'Aa', -22, 6, 28, 800, INK); text(g, 'Display · Text', -22, 20, 5.6, 700, '#8A96A8'); g.restore(); pin(g, b.x + 40, b.y + 74);
    g.save(); g.translate(b.x + 118, b.y + 100); g.rotate(0.07); shadowed(g, 6, 2, 0.16, function () { fillRR(g, -30, -28, 60, 52, 3, '#FFFFFF'); }); fillE(g, -10, -4, 11, 11, TEAL); tri(g, [-2, -14], [16, 10], [-12, 10], CORAL); text(g, 'logo v3', -24, 18, 5.6, 700, '#8A96A8'); g.restore(); pin(g, b.x + 118, b.y + 74, TEAL);
    g.save(); g.translate(b.x + 46, b.y + 168); g.rotate(0.04); fillRR(g, -34, -24, 68, 46, 2, '#FFFFFF'); fillRR(g, -30, -20, 60, 30, 1, '#BFE0F5'); tri(g, [-30, 10], [-10, -8], [8, 10], '#7FB685'); fillE(g, 18, -10, 5, 5, GOLD); g.restore(); pin(g, b.x + 46, b.y + 146, CORAL);
    g.save(); g.translate(b.x + 120, b.y + 166); g.rotate(-0.08); fillRR(g, -30, -26, 60, 52, 2, '#FFF3A6'); text(g, 'Short copy.', -24, -8, 8, 800, INK); text(g, 'Real info.', -24, 4, 8, 800, INK); text(g, 'Fast pages.', -24, 16, 8, 800, CORAL); g.restore(); pin(g, b.x + 120, b.y + 142, '#3167CA');
    /* the schedule rail: four slots; the magnet is live */
    var r = RAIL; fillRR(g, r.x, r.y, r.w, 32, 6, '#FFFFFF'); g.strokeStyle = '#DCE3EE'; g.lineWidth = 1.5; rr(g, r.x, r.y, r.w, 32, 6); g.stroke();
    STEPS.forEach(function (s2, i) { var x = r.x + 10 + i * 63; fillRR(g, x, r.y + 8, 56, 17, 4, '#F1F4F9'); text(g, (i + 1) + ' ' + s2, x + 28, r.y + 20, 8, 800, '#3D4560', 'center'); if (i < 3) text(g, '›', x + 59, r.y + 20, 10, 800, '#9AA6BC', 'center'); });
    /* the glass tube from the model's Contact door to the inbox receiver */
    g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = 'rgba(190,225,245,.85)'; g.lineWidth = 12; g.beginPath(); TUBE.forEach(function (p, i) { if (i) g.lineTo(p[0], p[1]); else g.moveTo(p[0], p[1]); }); g.stroke();
    g.strokeStyle = 'rgba(255,255,255,.75)'; g.lineWidth = 3; g.beginPath(); TUBE.forEach(function (p, i) { if (i) g.lineTo(p[0] - 3, p[1] - 3); else g.moveTo(p[0] - 3, p[1] - 3); }); g.stroke();
    [[712, 200], [712, 120], [800, 40]].forEach(function (c) { fillRR(g, c[0] - 9, c[1] - 4, 18, 8, 2, '#9AA6BC'); });
    /* the CHECKS panel: five lamps (lit live) */
    var ck = CHK; board(g, ck.x, ck.y, ck.w, ck.h, '#FFFFFF', '#E3E8EF'); fillRR(g, ck.x, ck.y, ck.w, 16, 3, INK); text(g, 'INCLUDED EVERY TIME', ck.x + ck.w / 2, ck.y + 11.4, 7.4, 800, '#FFFFFF', 'center');
    CHECKS.forEach(function (c2, i) { var cx = ck.x + 24 + i * 44; fillE(g, cx, ck.y + 36, 13, 13, '#EEF2F7'); text(g, c2, cx, ck.y + 63, 6.6, 800, '#3D4560', 'center'); });
    /* the inbox receiver: a brass cap over a glass canister, a tray, a label and a counter */
    var rc = RCV; board(g, rc.x, rc.y, rc.w, rc.h, '#FFFFFF', '#E3E8EF'); fillRR(g, rc.x, rc.y, rc.w, 18, 3, PUR); text(g, 'INBOX · CRM', rc.x + rc.w / 2, rc.y + 12.4, 8, 800, '#FFFFFF', 'center');
    fillRR(g, rc.x + 8, rc.y + 26, 36, 54, 8, 'rgba(190,225,245,.7)'); fillRR(g, rc.x + 4, rc.y + 22, 44, 8, 3, '#C9A44A'); fillRR(g, rc.x + 4, rc.y + 78, 44, 8, 3, '#C9A44A');
    text(g, 'Sales', rc.x + 54, rc.y + 40, 7.4, 800, INK); text(g, 'Support', rc.x + 54, rc.y + 58, 7.4, 800, INK); text(g, 'or the CRM you name', rc.x + rc.w / 2, rc.y + rc.h - 8, 5.8, 700, '#8A96A8', 'center');
    /* the domain sign on two wires, the GO LIVE console with its lever */
    var sg = SIGN; g.strokeStyle = '#9AA6BC'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(sg.x + 20, CEIL); g.lineTo(sg.x + 20, sg.y); g.moveTo(sg.x + sg.w - 20, CEIL); g.lineTo(sg.x + sg.w - 20, sg.y); g.stroke();
    shadowed(g, 10, 4, 0.18, function () { fillRR(g, sg.x, sg.y, sg.w, sg.h, 22, '#FFFFFF'); }); fillRR(g, sg.x + 6, sg.y + 6, sg.w - 12, sg.h - 12, 17, '#F1F4F9');
    fillRR(g, sg.x + 14, sg.y + 16, 8, 10, 2, MINT); g.strokeStyle = MINT; g.lineWidth = 1.6; g.beginPath(); g.arc(sg.x + 18, sg.y + 16, 3, Math.PI, 0); g.stroke(); text(g, 'yourcompany.com', sg.x + 28, sg.y + 26, 10.4, 800, INK);
    var c3 = CON; soft(g, c3.x + c3.w / 2, F + 3, 60, 6, 0.24); fillRR(g, c3.x, c3.y, c3.w, F - c3.y, 8, '#3A4458'); fillRR(g, c3.x - 6, c3.y - 6, c3.w + 12, 14, 5, '#2A3142'); fillRR(g, c3.x + 10, c3.y + 22, c3.w - 20, 30, 5, '#2A3142'); text(g, 'GO LIVE', c3.x + c3.w / 2, c3.y + 42, 10, 800, '#FFD84A', 'center');
    [0, 1, 2].forEach(function (i) { fillE(g, c3.x + 18 + i * 22, c3.y + 72, 6, 6, ['#2BC48A', '#FFD84A', '#9FC4FF'][i]); }); fillRR(g, c3.x + 12, c3.y + 92, c3.w - 24, 4, 2, '#5C6B7A'); fillRR(g, c3.x + 12, c3.y + 104, c3.w - 40, 4, 2, '#5C6B7A');
    fillRR(g, c3.x - 8, c3.y - 24, 14, 26, 4, '#5C6B7A');
    /* the wall clock (Singapore time) and a framed site map of past launches */
    K.clockFace(g, { x: 516, y: 180, r: 18 }, CORAL);
    shadowed(g, 8, 3, 0.16, function () { fillRR(g, 368, 128, 108, 70, 4, '#FFFFFF'); }); fillRR(g, 374, 134, 96, 50, 2, '#EEF6FB'); [0, 1, 2].forEach(function (i) { fillRR(g, 380 + i * 30, 140, 26, 38, 2, [TEAL, CORAL, '#3FA9E0'][i]); g.fillStyle = 'rgba(255,255,255,.6)'; g.fillRect(383 + i * 30, 146, 20, 3); g.fillRect(383 + i * 30, 152, 14, 3); }); text(g, 'LAUNCHED', 422, 194, 6.6, 800, '#8A96A8', 'center');
    /* the right margin (wide screens): the 3D printer, a materials rack, a plant */
    if (ext.r > 1000) {
      var pr = { x: 1030, y: 300 }; soft(g, pr.x + 60, F + 3, 70, 6, 0.22); fillRR(g, pr.x, pr.y + 110, 120, F - pr.y - 110, 4, '#EEF1F5'); fillRR(g, pr.x + 4, pr.y, 112, 112, 6, '#3A4458'); fillRR(g, pr.x + 12, pr.y + 10, 96, 94, 4, 'rgba(210,235,250,.55)');
      fillRR(g, pr.x + 12, pr.y + 92, 96, 6, 2, '#5C6B7A'); text(g, '3D PRINT', pr.x + 60, pr.y + 140, 8, 800, '#8A96A8', 'center');
      var rk = 1180; fillRR(g, rk, 150, 10, F - 150, 2, OAK_D); fillRR(g, rk + 110, 150, 10, F - 150, 2, OAK_D);
      for (var sr = 0; sr < 4; sr++) { fillRR(g, rk, 180 + sr * 70, 120, 6, 2, OAK); for (var sb = 0; sb < 5; sb++) fillRR(g, rk + 8 + sb * 22, 140 + sr * 70 + (sb % 2) * 8, 16, 40 - (sb % 2) * 8, 2, [FOAM, '#E8CFA8', '#BFE0F5', '#F6C9B8', '#C4E6D7'][(sb + sr) % 5]); }
      K.plant(g, { x: 1330, y: F }, '#FFFFFF', '#E3E9F3');
    }
  }

  /* ---------------- static front props: the drafting table, the foam table, the model table and the model ---------------- */
  function pavilion(g) {
    var p = PAV, x = p.x, y = p.y, w = p.w, base = T3.y;
    soft(g, x + w / 2, base, w * 0.6, 4, 0.25); fillRR(g, x - 6, base - 8, w + 12, 8, 2, '#EDE6DA');
    fillRR(g, x, y, w, base - y - 8, 3, '#FFFFFF'); fillRR(g, x - 4, y - 8, w + 8, 10, 3, NAVY);
    fillRR(g, x + 4, y + 4, w - 8, 12, 2, '#F1F4F9'); fillE(g, x + 12, y + 10, 4, 4, TEAL); [0, 1, 2].forEach(function (i) { fillRR(g, x + 24 + i * 16, y + 8.5, 12, 3, 1.5, '#9AA6BC'); }); fillRR(g, x + w - 30, y + 6, 24, 8, 4, CORAL);
    fillRR(g, x + 4, y + 20, w - 8, 44, 2, '#EAF6F3'); fillRR(g, x + 10, y + 28, 46, 6, 2, NAVY); fillRR(g, x + 10, y + 38, 34, 6, 2, NAVY); fillRR(g, x + 10, y + 50, 26, 8, 4, TEAL); fillRR(g, x + 64, y + 24, 40, 36, 3, '#BFE0F5'); tri(g, [x + 64, y + 60], [x + 80, y + 42], [x + 96, y + 60], '#7FB685');
    [0, 1, 2].forEach(function (i) { fillRR(g, x + 6 + i * 36, y + 70, 30, 26, 2, '#F4F7FC'); fillE(g, x + 13 + i * 36, y + 77, 3, 3, [TEAL, CORAL, GOLD][i]); });
    fillRR(g, DOOR.x - 2, DOOR.y - 2, 20, base - DOOR.y - 6, 2, CORAL); text(g, 'Contact', DOOR.x + 8, DOOR.y - 5, 5, 800, CORAL, 'center');
    /* tiny trees and people on the model's plinth */
    [[x - 2, 0], [x + 52, 1]].forEach(function (tr) { fillRR(g, tr[0] + 4, base - 22, 2, 14, 1, '#8E6440'); fillE(g, tr[0] + 5, base - 24, 7, 8, tr[1] ? '#7FB685' : '#6DAF7A'); });
    [[x + 30, '#E0456B'], [x + 40, '#3167CA']].forEach(function (pp) { fillRR(g, pp[0], base - 17, 4, 8, 2, pp[1]); fillE(g, pp[0] + 2, base - 19, 2, 2, '#F0CBA8'); });
  }
  function tower(g) {
    var p = TOW, x = p.x, y = p.y, w = p.w, base = T3.y;
    soft(g, x + w / 2, base, w * 0.7, 3, 0.25); fillRR(g, x - 4, base - 8, w + 8, 8, 2, '#EDE6DA');
    fillRR(g, x, y, w, base - y - 8, 9, '#2A3142'); fillRR(g, x + 3, y + 3, w - 6, base - y - 14, 7, '#FFFFFF'); fillRR(g, x + w / 2 - 6, y + 5, 12, 3, 1.5, '#2A3142');
    fillRR(g, x + 6, y + 12, w - 12, 6, 2, '#F1F4F9'); fillE(g, x + 10, y + 15, 2, 2, TEAL);
    fillRR(g, x + 6, y + 22, w - 12, 40, 2, '#EAF6F3'); fillRR(g, x + 9, y + 27, 24, 4, 1.5, NAVY); fillRR(g, x + 9, y + 34, 18, 4, 1.5, NAVY); fillRR(g, x + 9, y + 44, 26, 12, 2, '#BFE0F5');
    [0, 1, 2].forEach(function (i) { fillRR(g, x + 6, y + 68 + i * 24, w - 12, 20, 2, '#F4F7FC'); fillE(g, x + 11, y + 74 + i * 24, 2.6, 2.6, [TEAL, CORAL, GOLD][i]); });
    fillRR(g, x + 8, base - 30, w - 16, 9, 4.5, CORAL);
    text(g, 'MOBILE', x + w / 2, base + 12, 5.4, 800, '#8A96A8', 'center'); text(g, 'DESKTOP', PAV.x + PAV.w / 2, base + 12, 5.4, 800, '#8A96A8', 'center');
  }
  function paintFront(g, ext) {
    /* the drafting table (closed front: the lead designer stands behind it) */
    var a = T1; soft(g, a.x + a.w / 2, F + 4, a.w * 0.6, 7, 0.24); fillRR(g, a.x, a.y + 10, a.w, F - a.y - 10, 5, OAK); fillRR(g, a.x + 8, a.y + 22, a.w - 16, 26, 4, OAK_D); fillRR(g, a.x + a.w / 2 - 12, a.y + 32, 24, 5, 2, '#F6E3C2');
    fillRR(g, a.x - 6, a.y, a.w + 12, 12, 4, '#E8D2B0'); fillRR(g, a.x + 6, a.y - 3, 70, 5, 1, '#F7F9FC'); fillRR(g, a.x + 14, a.y - 5, 66, 4, 1, BP);
    fillRR(g, a.x + 92, a.y - 18, 18, 18, 4, '#3A4458'); [0, 1, 2].forEach(function (i) { fillRR(g, a.x + 94 + i * 5, a.y - 30 + i * 2, 3, 14, 1, [CORAL, BLUE, GOLD][i]); });
    g.strokeStyle = '#3A4458'; g.lineWidth = 3; g.lineCap = 'round'; g.beginPath(); g.moveTo(a.x + a.w - 6, a.y); g.lineTo(a.x + a.w - 2, a.y - 54); g.lineTo(a.x + a.w - 34, a.y - 74); g.stroke(); tri(g, [a.x + a.w - 50, a.y - 64], [a.x + a.w - 30, a.y - 84], [a.x + a.w - 22, a.y - 62], CORAL);
    /* the foam table (open: legs show) and the turntable's base */
    var b = T2; soft(g, b.x + b.w / 2, F + 4, b.w * 0.6, 7, 0.24); [b.x + 8, b.x + b.w - 16].forEach(function (lx) { fillRR(g, lx, b.y + 10, 8, F - b.y - 10, 3, '#9AA6BC'); }); g.fillStyle = 'rgba(30,60,110,.14)'; g.fillRect(b.x + 16, b.y + 40, b.w - 32, 5);
    fillRR(g, b.x - 6, b.y, b.w + 12, 12, 4, '#F3F6FA'); fillRR(g, b.x + 100, b.y - 14, 40, 14, 3, FOAM); fillRR(g, b.x + 106, b.y - 24, 28, 10, 2, FOAM); g.strokeStyle = '#E3E8EF'; g.lineWidth = 1; rr(g, b.x + 100, b.y - 14, 40, 14, 3); g.stroke(); rr(g, b.x + 106, b.y - 24, 28, 10, 2); g.stroke();
    fillE(g, TT.x, TT.y + 1, 42, 6, '#5C6B7A'); fillE(g, TT.x, TT.y - 2, 40, 5.5, '#7A869C');
    /* the model table (closed front: the developer stands behind it), the laptop beside him, the pavilion and the tower */
    var c = T3; soft(g, c.x + c.w / 2, F + 4, c.w * 0.55, 8, 0.24); fillRR(g, c.x, c.y + 10, c.w, F - c.y - 10, 6, '#FFFFFF'); g.fillStyle = 'rgba(30,60,110,.06)'; g.fillRect(c.x + c.w - 14, c.y + 10, 14, F - c.y - 10);
    fillRR(g, c.x + 16, c.y + 24, c.w - 32, 22, 5, '#F1F4F9'); text(g, 'THE MODEL · SCALE 1 : WEB', c.x + c.w / 2, c.y + 39, 8.4, 800, '#3D4560', 'center');
    fillRR(g, c.x - 6, c.y, c.w + 12, 12, 4, '#E3E8EF');
    pavilion(g); tower(g);
    fillRR(g, 830, c.y - 6, 40, 6, 2, '#AEB8C8'); g.save(); g.translate(838, c.y - 6); g.rotate(-0.08); fillRR(g, -6, -32, 40, 32, 3, '#3A4458'); g.restore();
  }
  function paintFore(g, ext) {
    function crate(x, y, lab) { soft(g, x + 30, y + 34, 36, 5, 0.25); fillRR(g, x, y, 60, 34, 4, '#C99A6B'); g.fillStyle = 'rgba(90,60,30,.25)'; g.fillRect(x, y + 16, 60, 2); if (lab) { fillRR(g, x + 8, y + 5, 44, 9, 2, '#FFFFFF'); text(g, lab, x + 30, y + 12, 6, 800, INK, 'center'); } }
    crate(196, 664, 'FOAM'); [[210, 652], [226, 648], [244, 654]].forEach(function (f) { fillRR(g, f[0], f[1], 14, 14, 2, FOAM); g.strokeStyle = '#E3E8EF'; g.lineWidth = 1; rr(g, f[0], f[1], 14, 14, 2); g.stroke(); });
    /* a tool cart */
    var tc = 860; soft(g, tc + 40, 712, 50, 5, 0.25); fillRR(g, tc, 650, 84, 8, 3, CORAL); fillRR(g, tc, 690, 84, 8, 3, CORAL); [tc + 4, tc + 76].forEach(function (lx) { fillRR(g, lx, 650, 4, 56, 2, '#9AA6BC'); fillE(g, lx + 2, 708, 5, 5, '#3A4458'); });
    [[tc + 8, 636, '#3167CA', 12, 14], [tc + 26, 630, GOLD, 10, 20], [tc + 42, 640, TEAL, 22, 10], [tc + 10, 678, '#5C6B7A', 30, 12], [tc + 46, 680, '#FFFFFF', 26, 10]].forEach(function (o) { fillRR(g, o[0], o[1], o[3], o[4], 2, o[2]); });
    /* an offcut bin: foam scraps sticking out of a coral tub */
    var ob = 640; soft(g, ob, 714, 30, 5, 0.25); [[-14, -8, 12, 22, -0.2], [-2, -12, 14, 26, 0.1], [10, -6, 10, 18, 0.35]].forEach(function (o) { g.save(); g.translate(ob + o[0], 680 + o[1]); g.rotate(o[4]); fillRR(g, -o[2] / 2, -o[3], o[2], o[3], 2, FOAM); g.strokeStyle = '#DCE3EE'; g.lineWidth = 1; rr(g, -o[2] / 2, -o[3], o[2], o[3], 2); g.stroke(); g.restore(); });
    g.fillStyle = CORAL; g.beginPath(); g.moveTo(ob - 24, 676); g.lineTo(ob + 24, 676); g.lineTo(ob + 19, 712); g.lineTo(ob - 19, 712); g.closePath(); g.fill(); fillRR(g, ob - 26, 672, 52, 7, 3, '#E5674A'); text(g, 'OFFCUTS', ob, 698, 6, 800, '#FFFFFF', 'center');
    soft(g, 410, 716, 28, 4, 0.25); fillE(g, 410, 668, 26, 7, OAK); g.strokeStyle = OAK_D; g.lineWidth = 4; g.beginPath(); g.moveTo(392, 672); g.lineTo(386, 714); g.moveTo(428, 672); g.lineTo(434, 714); g.moveTo(410, 674); g.lineTo(410, 714); g.stroke();
    /* under the title card only low things: plan rolls lying in a bundle, a level, a city block on a low plinth (seen in View the scene) */
    [[0, '#BFE0F5'], [1, '#FFFFFF'], [2, '#F6E3C2'], [3, BP]].forEach(function (r) { var ry = 704 - r[0] * 7 + (r[0] === 3 ? 14 : 0), rx = -440 + (r[0] === 3 ? 18 : 0); soft(g, rx + 44, ry + 6, 46, 3, 0.18); fillRR(g, rx, ry - 7, 88, 13, 6.5, r[1]); fillE(g, rx + 88, ry - 0.5, 4, 6.5, 'rgba(30,60,110,.18)'); });
    fillRR(g, -322, 696, 70, 10, 3, GOLD); fillRR(g, -296, 698, 18, 6, 3, '#BFF0D8'); fillE(g, -287, 701, 3, 2.4, MINT);
    g.save(); g.translate(0, -26); var pl = -150; soft(g, pl, 640, 80, 7, 0.22); fillRR(g, pl - 74, 610, 148, 30, 4, '#FFFFFF'); g.fillStyle = 'rgba(30,60,110,.07)'; g.fillRect(pl - 74, 630, 148, 10); fillRR(g, pl - 70, 606, 140, 6, 2, '#E3E8EF');
    [[-62, 34, 26, TEAL], [-30, 52, 22, FOAM], [-4, 28, 30, CORAL], [30, 44, 22, '#3FA9E0'], [52, 24, 18, FOAM]].forEach(function (b, i) { fillRR(g, pl + b[0], 606 - b[1], b[2], b[1], 2, b[3]); g.fillStyle = 'rgba(255,255,255,.55)'; for (var r2 = 606 - b[1] + 5; r2 < 602; r2 += 7) for (var q2 = pl + b[0] + 3; q2 < pl + b[0] + b[2] - 3; q2 += 6) g.fillRect(q2, r2, 3, 3); if (b[3] === FOAM) { g.strokeStyle = '#DCE3EE'; g.lineWidth = 1; rr(g, pl + b[0], 606 - b[1], b[2], b[1], 2); g.stroke(); } });
    [[-74, 606], [70, 604]].forEach(function (tr) { fillRR(g, pl + tr[0] + 2, tr[1] - 14, 2, 10, 1, '#8E6440'); fillE(g, pl + tr[0] + 3, tr[1] - 16, 6, 7, '#6DAF7A'); });
    text(g, 'BLOCK 02', pl, 627, 7, 800, '#9AA6BC', 'center'); g.restore();
    if (ext.r > 1100) { crate(1110, 664, 'MODELS'); K.plant(g, { x: 1200, y: 712 }, '#FFFFFF', '#E3E9F3'); }
  }

  /* ---------------- live ---------------- */
  var TAP = {}, CAPS = [], FX = [], LIVE = { t: -99 }, SWITCH = { t: -99 };
  function stepOf(S, t) { var h = S.hot; if (h === 'brief') return 0; if (h === 'wireframe' || h === 'design') return 1; if (h === 'build' || h === 'checks' || h === 'forms') return 2; if (h === 'launch') return 3; return Math.floor(t / 4) % 4; }
  function easelPrint(g, t) {
    var e = EAS, mob = PM.mobile || ((t + 3) % 16) > 11, x = e.x - e.w / 2, y = e.y; shadowed(g, 8, 3, 0.18, function () { fillRR(g, x - 3, y - 3, e.w + 6, e.h + 6, 3, '#FFFFFF'); });
    if (!mob) { fillRR(g, x + 4, y + 4, e.w - 8, 9, 1.5, NAVY); fillE(g, x + 9, y + 8.5, 2.4, 2.4, CORAL); g.fillStyle = 'rgba(255,255,255,.7)'; [0, 1, 2].forEach(function (k) { g.fillRect(x + 40 + k * 10, y + 7.5, 7, 2); });
      fillRR(g, x + 4, y + 16, e.w - 8, 30, 2, '#DCEBFA'); text(g, 'What we do', x + 10, y + 30, 7.6, 800, NAVY); fillRR(g, x + 10, y + 35, 30, 6, 3, CORAL);
      [0, 1, 2].forEach(function (k) { fillRR(g, x + 4 + k * 24, y + 50, 21, 24, 2, '#F4F7FC'); fillE(g, x + 9 + k * 24, y + 56, 2.6, 2.6, [TEAL, CORAL, GOLD][k]); }); g.fillStyle = '#C9D3E3'; g.fillRect(x + 4, y + 80, e.w - 20, 2); g.fillRect(x + 4, y + 85, e.w - 30, 2); fillRR(g, x + 4, y + 90, 26, 6, 2, TEAL); }
    else { fillRR(g, e.x - 18, y + 4, 36, e.h - 8, 6, NAVY); fillRR(g, e.x - 15, y + 10, 30, e.h - 20, 2, '#FFFFFF'); fillRR(g, e.x - 15, y + 10, 30, 7, 1.5, '#F1F4F9'); fillRR(g, e.x - 13, y + 20, 26, 18, 1.5, '#DCEBFA'); [0, 1, 2].forEach(function (k) { fillRR(g, e.x - 13, y + 42 + k * 12, 26, 9, 1.5, '#F4F7FC'); fillE(g, e.x - 9, y + 46.5 + k * 12, 2, 2, [TEAL, CORAL, GOLD][k]); }); fillRR(g, e.x - 10, y + 80, 20, 5, 2.5, TEAL);
      text(g, 'MOBILE', e.x + 30, y + 14, 6, 800, '#9AA6BC', 'center'); }
    if (PM.point) { g.strokeStyle = 'rgba(255,122,89,.85)'; g.lineWidth = 1.6; rr(g, x + 2 + PM.point[0], y + PM.point[1], PM.point[2], PM.point[3], 3); g.stroke(); }
    if (RV.ok) { g.save(); g.translate(e.x + 22, y + 22); g.rotate(-0.25); g.globalAlpha = Math.min(1, RV.ok * 3); g.strokeStyle = MINT; g.lineWidth = 2; rr(g, -22, -8, 44, 16, 3); g.stroke(); text(g, 'APPROVED', 0, 3.4, 7.4, 800, MINT, 'center'); g.restore(); }
  }
  function paintLive(g, t, now, S) {
    var e = S.ext; easelPrint(g, t);
    /* pendant lamps swaying, the paper-plane mobile turning */
    [[-560, 150], [-250, 130], [250, 120], [470, 108], [860, 100], [1150, 128]].forEach(function (L, i) { var x = L[0]; if (x < e.l - 40 || x > e.r + 40) return; var sw = Math.sin(t * 0.9 + i) * 0.035, len = L[1];
      g.save(); g.translate(x, CEIL - 8); g.rotate(sw); g.strokeStyle = '#7A869C'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, len); g.stroke();
      g.fillStyle = i % 2 ? CORAL : INK; g.beginPath(); g.moveTo(-16, len + 16); g.lineTo(-7, len); g.lineTo(7, len); g.lineTo(16, len + 16); g.closePath(); g.fill(); fillE(g, 0, len + 17, 10, 3, '#FFE9A8'); g.restore(); });
    var mx = 318, my = CEIL + 30; g.strokeStyle = '#9AA6BC'; g.lineWidth = 1; g.beginPath(); g.moveTo(mx, CEIL - 8); g.lineTo(mx, my); g.stroke();
    g.save(); g.translate(mx, my); g.rotate(Math.sin(t * 0.5) * 0.25); g.fillStyle = '#9AA6BC'; g.fillRect(-50, -1, 100, 2);
    [-46, 0, 46].forEach(function (dx, i) { var sp = Math.cos(t * 0.9 + i * 2); g.strokeStyle = '#9AA6BC'; g.beginPath(); g.moveTo(dx, 0); g.lineTo(dx, 14 + i * 4); g.stroke(); g.save(); g.translate(dx, 22 + i * 4); g.scale(sp < 0 ? -Math.max(0.15, -sp) : Math.max(0.15, sp), 1); CO.plane(g, 0, 0, 1.3, 0, i === 1 ? BLUE : '#FFFFFF', i === 1 ? '#FFFFFF' : '#C9D3E3'); g.restore(); });
    g.restore();
    /* the sitemap: pages light in turn; a new page draws itself in (dashed) */
    var m = SMAP, hx = m.x + m.w / 2, nodes = [[hx, m.y + 40, 'Home'], [m.x + 36, m.y + 80, 'Services'], [hx, m.y + 80, 'Industries'], [m.x + m.w - 36, m.y + 80, 'About'], [m.x + 16, m.y + 136, 'Svc 1'], [m.x + 56, m.y + 136, 'Svc 2'], [hx - 34, m.y + 166, 'Blog'], [hx + 34, m.y + 166, 'Contact']];
    var lit = S.hot === 'brief' ? Math.floor(t * 3) % nodes.length : Math.floor(t * 0.8) % nodes.length;
    nodes.forEach(function (n, i) { var w = i === 0 ? 50 : i > 3 && i < 6 ? 34 : 46, on = i === lit;
      fillRR(g, n[0] - w / 2, n[1] - 10, w, 20, 3, on ? '#FFFFFF' : 'rgba(255,255,255,.16)'); g.strokeStyle = 'rgba(255,255,255,.9)'; g.lineWidth = 1.2; rr(g, n[0] - w / 2, n[1] - 10, w, 20, 3); g.stroke(); text(g, n[2], n[0], n[1] + 3, 6.8, 800, on ? BP_D : '#FFFFFF', 'center'); });
    /* the schedule magnet */
    var st = stepOf(S, t); RAIL.mx = lerp(RAIL.mx == null ? RAIL.x + 38 : RAIL.mx, RAIL.x + 38 + st * 63, 0.08);
    fillRR(g, RAIL.mx - 30, RAIL.y + 5, 60, 23, 6, 'rgba(255,122,89,.2)'); g.strokeStyle = CORAL; g.lineWidth = 2; rr(g, RAIL.mx - 30, RAIL.y + 5, 60, 23, 6); g.stroke(); fillE(g, RAIL.mx, RAIL.y + 1, 6, 6, CORAL); fillE(g, RAIL.mx - 1.5, RAIL.y - 0.5, 2, 2, 'rgba(255,255,255,.7)');
    /* the CHECKS lamps: green in turn (all at once on their stop or after the master switch) */
    var allOn = S.hot === 'checks' || t - SWITCH.t < 2.4 || t - LIVE.t < 4, run = (t * 1.2) % 7;
    CHECKS.forEach(function (c, i) { var cx = CHK.x + 24 + i * 44, cy = CHK.y + 36, on = allOn || run > i + 0.5;
      if (on) { fillE(g, cx, cy, 11, 11, MINT); check(g, cx, cy, 1.6); } else fillE(g, cx, cy, 11, 11, '#DCE3EE'); });
    /* capsules through the tube; the receiver's counter and its lamp */
    var lastIn = -99; CAPS = CAPS.filter(function (c) { return t - c.t0 < 2.6; });
    CAPS.forEach(function (c) { var u = (t - c.t0) / 1.6; if (u < 0) return; if (u >= 1) { lastIn = Math.max(lastIn, c.t0 + 1.6); return; } var p = tubeAt(smooth(u)); fillRR(g, p[0] - 5, p[1] - 8, 10, 16, 5, c.col); fillRR(g, p[0] - 5, p[1] - 2, 10, 3, 1, '#FFFFFF'); });
    var auto = Math.floor((t + 3) / 9); if (auto !== TAP.autoN) { TAP.autoN = auto; CAPS.push({ t0: t, col: TEAL }); TAP.inAt = t + 1.6; TAP.inN = (TAP.inN || 0) + 1; }
    var rc = RCV, since = t - (TAP.inAt || -99), n = (TAP.inN || 0);
    fillE(g, rc.x + rc.w - 12, rc.y + 9, 3.4, 3.4, since >= 0 && since < 1 && (t % 0.3) < 0.15 ? '#FFD84A' : '#FFFFFF');
    if (since >= 0 && since < 1.6) { var bu = since / 1.6; fillRR(g, rc.x + 12, rc.y + 34 + bu * 20, 28, 14, 4, TEAL); }
    fillRR(g, rc.x + 54, rc.y + 64, 40, 14, 4, '#EEF2F7'); text(g, n + ' new', rc.x + 74, rc.y + 74, 7, 800, PUR, 'center');
    fillE(g, rc.x + 92, rc.y + 37, 3, 3, (since >= 0 && since < 2) ? MINT : '#DCE3EE');
    /* the domain sign: LIVE after the client pulls the lever (or on the launch stop) */
    var lv = t - LIVE.t < 6 || S.hot === 'launch', sg = SIGN;
    fillRR(g, sg.x + sg.w - 46, sg.y + 13, 34, 18, 9, lv ? MINT : '#DCE3EE'); text(g, 'LIVE', sg.x + sg.w - 29, sg.y + 26, 8, 800, lv ? '#FFFFFF' : '#9AA6BC', 'center');
    if (lv) { g.save(); g.globalAlpha = 0.25 + 0.15 * Math.sin(t * 4); fillRR(g, sg.x - 6, sg.y - 6, sg.w + 12, sg.h + 12, 26, 'rgba(43,196,138,.35)'); g.restore(); }
    /* the console lever (pulled down on GO LIVE) */
    var pull = TAP.cli && t - TAP.cli < 2.2 ? Math.sin(clamp((t - TAP.cli - 0.5) / 0.8, 0, 1) * Math.PI) : 0;
    g.save(); g.translate(CON.x - 1, CON.y - 14); g.rotate(-0.5 + pull * 1.0); fillRR(g, -2.5, -46, 5, 46, 2, '#9AA6BC'); fillE(g, 0, -48, 7, 7, '#E0456B'); g.restore();
    /* the clock and the coffee steam */
    var d = new Date(Date.now() + 8 * 3600e3); K.clockHands(g, { x: 516, y: 180, r: 18 }, d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds());
    if (e.l < -480) { g.strokeStyle = 'rgba(170,180,200,.6)'; g.lineWidth = 1.4; for (var sv = 0; sv < 3; sv++) { var syy = 330 - ((t * 14 + sv * 9) % 26); g.beginPath(); g.moveTo(-575 + sv * 5, syy + 8); g.quadraticCurveTo(-571 + sv * 5, syy + 4, -575 + sv * 5, syy); g.stroke(); } }
    /* the 3D printer's head (wide screens) */
    if (e.r > 1000) { var ph = Math.sin(t * 2.2) * 36, layers = Math.floor((t * 2) % 30); fillRR(g, 1030 + 60 - 44, 336, 88, 4, 2, '#5C6B7A'); fillRR(g, 1030 + 60 + ph - 7, 334, 14, 12, 2, CORAL);
      fillRR(g, 1030 + 40, 392 - layers, 40, layers, 2, TEAL); fillE(g, 1030 + 60 + ph, 348, 2, 2, '#FFD84A'); }
    CO.crew(CREW, g, t, S, false);
  }

  /* ---------------- in front: the turning wireframe, the model's lights, held props, effects ---------------- */
  function wireframe(g, t, S) {
    var spin = S.hot === 'wireframe' && S.kT ? clamp((t - S.kT) / 2.2, 0, 1) : 0, a = Math.sin(t * 0.8) * 0.75 + smooth(spin) * Math.PI * 2, c = Math.cos(a), sxk = Math.abs(c) < 0.06 ? 0.06 : c, front = c > 0, w = 78, h = 92, x = TT.x, y = TT.y - 4;
    g.save(); g.translate(x, y); g.scale(sxk, 1);
    fillRR(g, -w / 2, -h, w, h, 3, FOAM); g.strokeStyle = '#DCE3EE'; g.lineWidth = 1.2; rr(g, -w / 2, -h, w, h, 3); g.stroke();
    if (front) { fillRR(g, -w / 2 + 5, -h + 5, w - 10, 9, 2, '#E9EDF3'); fillRR(g, -w / 2 + 5, -h + 18, w - 10, 30, 2, '#E9EDF3'); fillRR(g, -w / 2 + 9, -h + 23, 30, 4, 1.5, '#C9D3DE'); fillRR(g, -w / 2 + 9, -h + 30, 22, 4, 1.5, '#C9D3DE'); fillRR(g, -w / 2 + 9, -h + 38, 16, 6, 3, '#C9D3DE');
      g.strokeStyle = '#C9D3DE'; g.lineWidth = 1; g.beginPath(); g.moveTo(8, -h + 20); g.lineTo(w / 2 - 7, -h + 46); g.moveTo(w / 2 - 7, -h + 20); g.lineTo(8, -h + 46); g.stroke();
      [0, 1, 2].forEach(function (i) { fillRR(g, -w / 2 + 5 + i * 23, -h + 54, 20, 22, 2, '#E9EDF3'); }); fillRR(g, -w / 2 + 5, -h + 80, w - 10, 6, 2, '#E9EDF3'); }
    else { g.fillStyle = 'rgba(200,210,225,.35)'; g.fillRect(-w / 2, -h, w, h); }
    g.restore();
    text(g, 'WIREFRAME', x, TT.y + 18, 6, 800, '#8A96A8', 'center');
  }
  function modelLights(g, t, S) {
    var on = t - SWITCH.t < 3 || S.hot === 'build', blink = Math.floor(t * 2);
    var cells = [[PAV.x + 6, PAV.y + 70, 30, 26], [PAV.x + 42, PAV.y + 70, 30, 26], [PAV.x + 78, PAV.y + 70, 30, 26], [TOW.x + 6, TOW.y + 68, TOW.w - 12, 20], [TOW.x + 6, TOW.y + 92, TOW.w - 12, 20], [TOW.x + 6, TOW.y + 116, TOW.w - 12, 20]];
    cells.forEach(function (c, i) { var lit = on || (hash(i + blink * 3.1) > 0.55); if (!lit) return; g.save(); g.globalAlpha = on ? 0.55 : 0.32; fillRR(g, c[0], c[1], c[2], c[3], 2, '#FFE9A8'); g.restore(); });
    if (on) { g.save(); g.globalAlpha = 0.18 + 0.1 * Math.sin(t * 5); fillRR(g, PAV.x - 8, PAV.y - 12, TOW.x + TOW.w - PAV.x + 16, T3.y - PAV.y + 12, 12, 'rgba(255,233,168,.6)'); g.restore(); }
    /* the Contact door pulses when an enquiry leaves */
    var dp = TAP.sendT && t - TAP.sendT < 0.8 ? 1 - (t - TAP.sendT) / 0.8 : 0; if (dp > 0) { g.strokeStyle = 'rgba(255,122,89,' + dp.toFixed(2) + ')'; g.lineWidth = 2; rr(g, DOOR.x - 6 - (1 - dp) * 6, DOOR.y - 6 - (1 - dp) * 6, 28 + (1 - dp) * 12, 38 + (1 - dp) * 12, 6); g.stroke(); }
    /* the developer's laptop screen */
    g.save(); g.translate(838, T3.y - 6); g.rotate(-0.08); fillRR(g, -3, -29, 34, 26, 2, '#1E2A3A'); for (var l = 0; l < 5; l++) { var ww = 6 + hash(l + Math.floor(t * 2)) * 20; fillRR(g, (l % 2) * 3, -26 + l * 5, ww, 2.2, 1, ['#7FE3C4', '#FFD84A', '#9FC4FF'][l % 3]); } g.restore();
  }
  function paintFrontLive(g, t, S) {
    fitCrew(S); wireframe(g, t, S); modelLights(g, t, S);
    CO.crew(CREW, g, t, S, true);
    props(g, t, S);
    FX = FX.filter(function (f) { return t - f.t0 < f.life; });
    FX.forEach(function (f) { var u = t - f.t0; if (u < 0) return; var a = 1 - u / f.life, x = f.x + f.vx * u, y = f.y + f.vy * u + (f.k === 'shav' ? 140 * u * u : 0);
      g.save(); g.globalAlpha = clamp(a * 1.4, 0, 1);
      if (f.k === 'shav') { g.translate(x, y); g.rotate(u * 6 + f.r); fillRR(g, -4, -1.5, 8, 3, 1.5, FOAM); g.strokeStyle = '#DCE3EE'; g.lineWidth = 0.8; rr(g, -4, -1.5, 8, 3, 1.5); g.stroke(); }
      else if (f.k === 'mist') fillE(g, x, y, f.r * (1 + u * 2), f.r * (1 + u * 2), f.c);
      g.restore(); });
  }
  function props(g, t, S) {
    /* the lead designer: a T-square on the table, or a blueprint unrolled overhead */
    var al = handAt(ARC, 0), ar = handAt(ARC, 1);
    if (TAP.arc && t - TAP.arc < 2.4) { var u = (t - TAP.arc) / 2.4, op = u < 0.7 ? smooth(u / 0.35) : 1 - smooth((u - 0.7) / 0.3), y0 = Math.min(al[1], ar[1]) - 4, wv = Math.sin(t * 8) * 2;
      g.save(); fillRR(g, al[0] - 4, y0 - 6, 8, 12, 4, BP_D); fillRR(g, ar[0] - 4, y0 - 6, 8, 12, 4, BP_D);
      var hgt = 70 * op; fillRR(g, al[0], y0 - 2, ar[0] - al[0], 6 + hgt, 2, BP); g.strokeStyle = 'rgba(255,255,255,.6)'; g.lineWidth = 1; g.beginPath(); for (var gy = y0 + 10; gy < y0 + hgt; gy += 9) { g.moveTo(al[0] + 3, gy + wv * 0.3); g.lineTo(ar[0] - 3, gy + wv * 0.3); } g.stroke();
      if (op > 0.7) { g.strokeStyle = '#FFFFFF'; g.lineWidth = 1.4; rr(g, (al[0] + ar[0]) / 2 - 10, y0 + 12, 20, 9, 2); g.stroke(); rr(g, al[0] + 6, y0 + 34, 16, 8, 2); g.stroke(); rr(g, ar[0] - 22, y0 + 34, 16, 8, 2); g.stroke(); }
      fillRR(g, al[0] - 3, y0 + hgt, ar[0] - al[0] + 6, 7, 3.5, BP_D); g.restore(); }
    else { var tx = ARC.tsq || 0; fillRR(g, T1.x + 12 + tx, T1.y - 8, 60, 4, 1, '#F2B233'); fillRR(g, T1.x + 10 + tx, T1.y - 12, 5, 12, 1, '#F2B233');
      g.save(); g.translate(ar[0], ar[1]); g.rotate(-0.9); fillRR(g, -1.5, -14, 3, 16, 1, '#FFD84A'); fillRR(g, -1.5, -16, 3, 3, 1, '#E0456B'); g.restore(); }
    /* the UX designer: the hot-wire bow and a foam block, or the H1 block held high */
    var bl = handAt(UX, 0), br = handAt(UX, 1);
    if (TAP.ux && t - TAP.ux < 2.4 && t - TAP.ux > 0.9) { var hb = br; fillRR(g, hb[0] - 18, hb[1] - 30, 36, 24, 3, FOAM); g.strokeStyle = '#DCE3EE'; g.lineWidth = 1; rr(g, hb[0] - 18, hb[1] - 30, 36, 24, 3); g.stroke(); text(g, 'H1', hb[0], hb[1] - 13, 12, 800, CORAL, 'center'); }
    else if (UX.bow) { g.strokeStyle = '#5C6B7A'; g.lineWidth = 2.4; g.beginPath(); g.moveTo(br[0], br[1]); g.lineTo(br[0] - 4, br[1] - 30); g.lineTo(br[0] - 34, br[1] - 30); g.lineTo(br[0] - 38, br[1]); g.stroke(); g.strokeStyle = UX.hot ? '#FF8A5C' : '#C9D3DE'; g.lineWidth = 1; g.beginPath(); g.moveTo(br[0] - 2, br[1] - 4); g.lineTo(br[0] - 36, br[1] - 4); g.stroke();
      fillRR(g, bl[0] - 2, bl[1] - 18 + (UX.cut || 0) * 6, 30, 20, 2, FOAM); g.strokeStyle = '#DCE3EE'; rr(g, bl[0] - 2, bl[1] - 18 + (UX.cut || 0) * 6, 30, 20, 2); g.stroke(); }
    else if (UX.block) { fillRR(g, br[0] - 12, br[1] - 14, 24, 14, 2, FOAM); g.strokeStyle = '#DCE3EE'; g.lineWidth = 1; rr(g, br[0] - 12, br[1] - 14, 24, 14, 2); g.stroke(); }
    /* the visual designer: the airbrush, or the swatch card flipping colours */
    var vr = handAt(VD, 1), vl = handAt(VD, 0);
    if (TAP.vd && t - TAP.vd < 2.4) { var u2 = (t - TAP.vd) / 2.4, ci = Math.floor(u2 * 8) % 4, fl = Math.abs(Math.cos(u2 * 8 * Math.PI)); g.save(); g.translate(vr[0], vr[1] - 22); g.scale(Math.max(0.1, fl), 1); fillRR(g, -14, -20, 28, 40, 3, '#FFFFFF'); fillRR(g, -11, -17, 22, 24, 2, [TEAL, CORAL, NAVY, GOLD][ci]); g.fillStyle = '#C9D3E3'; g.fillRect(-10, 11, 18, 2.4); g.restore(); }
    else { g.save(); g.translate(vr[0], vr[1]); g.rotate(-0.4); fillRR(g, -4, -6, 16, 8, 3, '#7A869C'); fillRR(g, 10, -4, 10, 4, 2, '#5C6B7A'); fillRR(g, -2, -20, 7, 14, 3, TEAL); g.restore();
      if (VD.swatch) { g.save(); g.translate(vl[0] + 6, vl[1] - 18); g.rotate(0.1); fillRR(g, -10, -14, 20, 30, 2, '#FFFFFF'); fillRR(g, -8, -12, 16, 16, 1.5, TEAL); g.restore(); } }
    /* the developer: tweezers at the tower */
    var dl = handAt(DEV, 0); if (DEV.tweeze) { g.strokeStyle = '#7A869C'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(dl[0], dl[1]); g.lineTo(dl[0] - 16, dl[1] + 6); g.moveTo(dl[0], dl[1] + 2); g.lineTo(dl[0] - 16, dl[1] + 7); g.stroke(); fillRR(g, dl[0] - 20, dl[1] + 4, 4, 4, 1, GOLD); }
    /* the client: the hand-over notes or the phone */
    var cl = handAt(CLI, 0), cr = handAt(CLI, 1);
    if (CLI.notes) { g.save(); g.translate((cl[0] + cr[0]) / 2, Math.min(cl[1], cr[1]) - 8); g.rotate(-0.06); fillRR(g, -20, -14, 40, 26, 2, '#FFFFFF'); g.fillStyle = BP; g.fillRect(-20, -14, 3, 26); g.fillStyle = '#C9D3E3'; for (var ln = 0; ln < 3; ln++) g.fillRect(-14, -8 + ln * 6, 26 - ln * 6, 2); text(g, 'Hand-over', 0, -16.5, 4.6, 800, BP_D, 'center'); g.restore(); }
    /* the review nook: the client's print, the coffee at his lips, the project lead's tablet and pen */
    var ra = handAt(RV, 0), rb = handAt(RV, 1);
    if (RV.print) { g.save(); g.translate((ra[0] + rb[0]) / 2, Math.min(ra[1], rb[1]) - 14 - (RV.raise || 0)); g.rotate(RV.tiltP || -0.05); fillRR(g, -22, -18, 44, 32, 2, '#FFFFFF'); fillRR(g, -20, -16, 40, 6, 1, NAVY); fillRR(g, -20, -8, 40, 10, 1, '#DCEBFA'); [0, 1, 2].forEach(function (k) { fillRR(g, -20 + k * 14, 5, 12, 7, 1, '#F1F4F9'); });
      if (RV.heart) { g.fillStyle = '#E0456B'; g.beginPath(); g.moveTo(14, 2); g.bezierCurveTo(4, -6, 10, -14, 14, -8); g.bezierCurveTo(18, -14, 24, -6, 14, 2); g.fill(); } g.restore(); }
    if (RV.cup) { fillRR(g, rb[0] - 5, rb[1] - 12, 10, 12, 2, '#FFFFFF'); fillRR(g, rb[0] - 5, rb[1] - 12, 10, 3, 1, CORAL); }
    var pa = handAt(PM, 1); if (PM.pen) { g.save(); g.translate(pa[0], pa[1]); g.rotate(PM.penR || -0.6); fillRR(g, -1.5, -18, 3, 20, 1.2, NAVY); fillRR(g, -1.5, -20, 3, 3, 1, CORAL); g.restore(); }
    if (CLI.phone) { g.save(); g.translate(cr[0], cr[1] - 8); fillRR(g, -6, -11, 12, 20, 3, '#2A3550'); fillRR(g, -4.6, -9, 9.2, 15, 2, '#FFFFFF'); fillRR(g, -3.6, -7 + ((t * 6) % 8), 7.2, 3, 1, TEAL); g.restore(); }
  }

  /* ---------------- the cast ---------------- */
  function tapped(id, st, t) { if (st.wave && st.wave !== st._my) { st._my = st.wave; TAP[id] = t; return true; } return false; }
  function lookAtNexi(P, st, t, S, base) { P.look = lerp(P.look, t < st.until ? clamp((S.nexi.x - P.x) / 160, -1, 1) : base, 0.08); }
  var castARC = { id: 'arc', behind: true, keys: ['brief'], P: ARC, act: function (P, t, S) {
    var st = S.cast.arc, busy = S.hot === 'brief'; if (tapped('arc', st, t)) CR.burst('star', P.x, P.y - 320, t);
    P.tilt = 0; P.hop = 0; P.mood = 'calm';
    if (TAP.arc && t - TAP.arc < 2.4) { var u = (t - TAP.arc) / 2.4; P.talk = true; P.mood = 'happy'; P.hands = [[-90, -400 - Math.sin(u * Math.PI) * 10], [90, -400 - Math.sin(u * Math.PI) * 10]]; P.look = 0; P.hop = u > 0.75 ? Math.sin((u - 0.75) * 4 * Math.PI) * 8 : 0; return; }
    var cyc = t % 10; P.talk = t < st.until || busy;
    if (busy) { P.hands = [[-60, -150], [-60, -380 + Math.sin(t * 3) * 8]]; P.look = -0.3; P.tilt = -0.04; return; }
    if (cyc < 5) { var sl = Math.sin(t * 1.4); P.tsq = (sl + 1) * 18; P.hands = [[-90 + sl * 30, -150], [40 + sl * 40, -156 - Math.abs(Math.sin(t * 6)) * 4]]; P.look = 0.2 + sl * 0.2; P.tilt = 0.05; return; }
    if (cyc < 7.5) { P.hands = [[-60, -150], [30, -330]]; P.tilt = -0.08; P.look = -0.2; P.mood = 'calm'; return; }
    P.hands = [[-60, -150], [10, -380]]; lookAtNexi(P, st, t, S, -0.5);
  } };
  var castUX = { id: 'ux', behind: true, keys: ['wireframe'], P: UX, act: function (P, t, S) {
    var st = S.cast.ux, busy = S.hot === 'wireframe';
    if (tapped('ux', st, t)) { for (var i = 0; i < 16; i++) FX.push({ k: 'shav', x: P.x + 40, y: P.y - 190, vx: -50 + Math.random() * 140, vy: -110 - Math.random() * 90, t0: t + i * 0.02, life: 1.1, r: Math.random() * 6 }); }
    P.bow = false; P.hot = false; P.block = false; P.cut = 0; P.tilt = 0; P.hop = 0; P.mood = 'calm';
    if (TAP.ux && t - TAP.ux < 2.4) { var u = (t - TAP.ux) / 2.4; P.talk = true; P.mood = 'happy';
      if (u < 0.37) { P.bow = true; P.hot = true; P.cut = Math.sin(u / 0.37 * Math.PI); P.hands = [[60, -250], [70 + Math.sin(t * 30) * 4, -260 + u / 0.37 * 80]]; P.look = 0.5; }
      else { P.hands = [[-70, -190], [40, -420]]; P.hop = Math.sin((u - 0.37) / 0.63 * Math.PI) * 18; P.look = 0.2; } return; }
    var cyc = t % 9; P.talk = t < st.until || busy;
    if (cyc < 3.5) { P.bow = true; var cu = (cyc % 1.75) / 1.75; P.hot = cu < 0.7; P.cut = cu; P.hands = [[50, -240], [60, -270 + cu * 70]]; P.look = 0.6; P.tilt = 0.05; return; }
    if (cyc < 5.5) { var pu = (cyc - 3.5) / 2; P.block = pu < 0.6; P.hands = [[-70, -190], [lerp(80, 140, smooth(pu / 0.6)), -230]]; P.look = 0.9; return; }
    if (cyc < 6.5) { P.hands = [[-70, -190], [130 + Math.sin(t * 8) * 20, -180]]; P.look = 0.8; P.mood = 'happy'; return; }
    P.hands = [[-50, -230], [70, -200]]; P.tilt = Math.sin(t * 2) * 0.04; lookAtNexi(P, st, t, S, 0.6);
  } };
  var castVD = { id: 'vd', behind: true, keys: ['design'], P: VD, act: function (P, t, S) {
    var st = S.cast.vd, busy = S.hot === 'design'; if (tapped('vd', st, t)) { for (var i = 0; i < 12; i++) FX.push({ k: 'mist', x: P.x + 30, y: P.y - 230, vx: (Math.random() - 0.3) * 80, vy: -40 - Math.random() * 50, t0: t + i * 0.08, life: 1.2, r: 4 + Math.random() * 3, c: ['rgba(20,163,139,.35)', 'rgba(255,122,89,.35)', 'rgba(31,42,85,.3)', 'rgba(242,178,51,.35)'][i % 4] }); }
    P.swatch = false; P.tilt = 0; P.hop = 0; P.mood = 'calm'; P.sx = 1;
    if (TAP.vd && t - TAP.vd < 2.4) { var u = (t - TAP.vd) / 2.4; P.talk = true; P.mood = 'happy'; P.hands = [[-70, -200], [70, -360]]; P.sx = u < 0.4 ? Math.cos(u / 0.4 * Math.PI * 2) : 1; P.hop = Math.sin(u * Math.PI) * 12; P.look = 0.3; return; }
    var cyc = t % 10; P.talk = t < st.until || busy;
    if (cyc < 5 || busy) { var sw = Math.sin(t * 2.6); P.hands = [[-70, -200], [96 + sw * 12, -250 + Math.cos(t * 2.6) * 30]]; P.look = 0.8; P.tilt = 0.04;
      if (Math.floor(t * 6) !== TAP.vdM) { TAP.vdM = Math.floor(t * 6); var hr = handAt(P, 1); FX.push({ k: 'mist', x: hr[0] + 18, y: hr[1] - 6, vx: 30, vy: -8, t0: t, life: 0.8, r: 2.5, c: 'rgba(20,163,139,.3)' }); } return; }
    if (cyc < 7.5) { P.swatch = true; P.hands = [[60, -300], [90, -240]]; P.look = 0.7; P.tilt = -0.1 + Math.sin(t * 2) * 0.04; return; }
    if (cyc < 8.6) { P.hands = [[-70, -200], [90, -250]]; P.look = 0.9; P.mood = 'calm'; return; }
    P.hands = [[-70, -200], [80, -260]]; lookAtNexi(P, st, t, S, 0.4);
  } };
  var castDEV = { id: 'dev', behind: true, keys: ['build', 'checks'], P: DEV, act: function (P, t, S) {
    var st = S.cast.dev, busy = S.hot === 'build' || S.hot === 'checks'; if (tapped('dev', st, t)) { SWITCH.t = t + 0.5; CR.burst('code', P.x - 60, P.y - 230, t + 0.5); }
    P.tweeze = false; P.tilt = 0; P.hop = 0; P.mood = 'calm';
    if (TAP.dev && t - TAP.dev < 2.4) { var u = (t - TAP.dev) / 2.4; P.talk = true; P.mood = u > 0.25 ? 'happy' : 'calm';
      if (u < 0.25) { P.hands = [[-80, -150], [70, -150 + u * 40]]; P.look = 0.6; } else { P.hands = [[-100, -400 + Math.sin(t * 16) * 12], [100, -400 - Math.sin(t * 16) * 12]]; P.hop = Math.abs(Math.sin(u * Math.PI * 3)) * 14; P.look = -0.4; } return; }
    var cyc = t % 8; P.talk = t < st.until || busy;
    if (cyc < 3.5) { P.tweeze = true; P.hands = [[-110, -200 + Math.sin(t * 3) * 10], [60, -150]]; P.look = -0.8; P.tilt = -0.06; return; }
    if (cyc < 6.5) { var k = Math.abs(Math.sin(t * 11)) * 6; P.hands = [[40, -150 - k], [96, -150 - (6 - k)]]; P.look = 0.7; return; }
    P.hands = [[-80, -150], [60, -150]]; lookAtNexi(P, st, t, S, -0.6);
  } };
  var castCLI = { id: 'cli', behind: true, keys: ['launch', 'forms'], P: CLI, act: function (P, t, S) {
    var st = S.cast.cli, busy = S.hot === 'launch'; if (tapped('cli', st, t)) { LIVE.t = t + 0.9; CR.burst('conf', SIGN.x + SIGN.w / 2, SIGN.y + 30, t + 0.9); }
    P.notes = false; P.phone = false; P.tilt = 0; P.hop = 0; P.mood = 'calm';
    if (TAP.cli && t - TAP.cli < 2.4) { var u = (t - TAP.cli) / 2.4; P.talk = true;
      if (u < 0.6) { var pull = Math.sin(clamp((t - TAP.cli - 0.5) / 0.8, 0, 1) * Math.PI); P.hands = [[-110, -300 + pull * 120], [60, -200]]; P.look = -0.6; P.mood = 'calm'; P.tilt = -0.05; }
      else { P.mood = 'happy'; P.hands = [[-100, -420 + Math.sin(t * 16) * 10], [100, -420 - Math.sin(t * 16) * 10]]; P.hop = Math.abs(Math.sin(u * Math.PI * 3)) * 22; P.look = 0; } return; }
    var cyc = t % 11; P.talk = t < st.until || busy;
    if (cyc < 4) { P.notes = true; P.hands = [[-40, -220], [40, -220]]; P.look = -0.1; P.tilt = Math.sin(t * 1.5) * 0.04; P.mood = (t % 2) < 1 ? 'calm' : 'happy'; return; }
    if (cyc < 7.5) { P.phone = true; P.hands = [[-70, -180], [20, -270]]; P.look = 0.2; P.tilt = 0.06; return; }
    if (cyc < 9) { P.hands = [[-70, -180], [60, -200]]; P.look = -0.5; P.mood = 'happy'; return; }
    P.hands = [[-70, -180], [60, -200]]; lookAtNexi(P, st, t, S, -0.4);
  } };

  var castRV = { id: 'rv', behind: true, keys: [], P: RV, act: function (P, t, S) {
    P.tilt = 0; P.hop = 0; P.print = false; P.cup = false; P.heart = false; P.ok = 0; P.raise = 0; P.tiltP = -0.05; P.talk = false;
    if (TAP.rv && t - TAP.rv < 3) { var u = (t - TAP.rv) / 3; P.print = true; P.heart = u > 0.25; P.ok = u > 0.4 ? u - 0.4 : 0; P.raise = Math.min(1, u * 4) * 40; P.mood = 'happy'; P.talk = true; P.hands = [[-40, -360], [40, -360]]; P.hop = u > 0.25 && u < 0.6 ? Math.abs(Math.sin(u * 20)) * 6 : 0; P.look = 0.4; return; }
    var c = (t + 1) % 13; P.mood = 'calm';
    if (c < 5) { P.print = true; P.hands = [[-46, -250], [46, -250]]; P.tiltP = Math.sin(t * 0.8) * 0.1; P.look = lerp(P.look, 0.1, 0.1); if (c > 3.6 && c < 4.4) P.tiltP = -0.05 + Math.sin((c - 3.6) / 0.8 * Math.PI) * 0.6; }
    else if (c < 8.5) { P.hands = [[-40, -210], [40, -230]]; P.look = lerp(P.look, 0.8, 0.08); P.tilt = Math.sin(t * 3) * 0.04; P.talk = (t % 2) < 1; P.mood = 'happy'; }
    else if (c < 10.5) { P.cup = true; var sip = c > 9 && c < 10; P.hands = [[-40, -210], sip ? [10, -330] : [56, -240]]; P.look = lerp(P.look, 0, 0.1); }
    else { P.hands = [[-50, -220], [70, -340 + Math.sin(t * 10) * 4]]; P.mood = 'happy'; P.look = lerp(P.look, 0.7, 0.1); }
  } };
  var castPM = { id: 'pm', behind: true, keys: ['brief'], P: PM, act: function (P, t, S) {
    P.tilt = 0; P.hop = 0; P.pen = true; P.point = null; P.mobile = false; P.penR = -0.6; P.sx = 1;
    if (TAP.pm && t - TAP.pm < 2.6) { var u = (t - TAP.pm) / 2.6; P.talk = true; P.mood = 'happy'; P.mobile = u > 0.3;
      if (u < 0.3) { P.hands = [[-60, -200], [130, -320]]; P.look = 0.8; } else { P.sx = Math.cos(Math.min(1, (u - 0.3) / 0.35) * Math.PI * 2); P.hands = [[-90, -300], [90, -380]]; P.penR = t * 12; P.hop = Math.sin(Math.min(1, (u - 0.3) / 0.35) * Math.PI) * 14; P.look = -0.4; } return; }
    var c = (t + 5) % 12, busy = S.hot === 'brief'; P.talk = busy; P.mood = busy ? 'happy' : 'calm';
    if (c < 5) { var k = Math.floor(c / 1.67), pts = [[0, 2, 74, 12], [0, 15, 74, 31], [0, 48, 74, 28]]; P.point = pts[k]; P.hands = [[-60, -200], [118, -360 + k * 50]]; P.look = 0.8; P.talk = true; P.mood = 'happy'; }
    else if (c < 8) { P.hands = [[-60, -200], [40, -240]]; P.look = lerp(P.look, -0.9, 0.08); P.talk = (t % 1.6) < 1; P.tilt = -0.03; }
    else if (c < 10.5) { P.pen = true; P.hands = [[-40, -230], [-6 + Math.sin(t * 9) * 5, -232 + Math.cos(t * 7) * 3]]; P.look = -0.3; P.tilt = 0.05; }
    else { P.hands = [[-60, -200], [80, -210]]; P.look = lerp(P.look, 0.3, 0.1); P.hop = Math.abs(Math.sin(t * 5)) * 2; }
  } };

  window.IXW.worlds['sol-web'] = {
    calmView: [140,-60,860,688], calmHide: ['cli'], /* CALM: the framed part of the set */
    pan: [-320, 1180],
    paintBg: paintBg, windowBehind: true, paintFrame: paintFrame, paintBack: paintBack, paintFront: paintFront, paintFore: paintFore,
    paintWindow: paintWindow, paintLive: paintLive, paintFrontLive: paintFrontLive,
    paintForeLive: function (g, t, S) { K.zfore(g, t, S, [], function () { CO.crew(CREW, g, t, S, 'fore'); }); CR.draw(g, t); },
    motes: false,
    glow: {
      brief: function (g) { rr(g, SMAP.x - 26, SMAP.y - 12, SMAP.w + 38, SMAP.h + 78, 14); },
      wireframe: function (g) { rr(g, TT.x - 52, TT.y - 106, 104, 128, 12); },
      design: function (g) { rr(g, MAT.x - 14, MAT.y - 14, MAT.w + 28, MAT.h + 28, 12); },
      build: function (g) { rr(g, PAV.x - 14, TOW.y - 14, TOW.x + TOW.w - PAV.x + 28, T3.y - TOW.y + 30, 14); },
      checks: function (g) { rr(g, CHK.x - 12, CHK.y - 12, CHK.w + 24, CHK.h + 24, 12); },
      forms: function (g) { rr(g, RCV.x - 12, RCV.y - 12, RCV.w + 24, RCV.h + 24, 12); },
      launch: function (g) { rr(g, SIGN.x - 12, SIGN.y - 12, SIGN.w + 24, SIGN.h + 24, 26); },
      send: function (g) { rr(g, DOOR.x - 8, DOOR.y - 10, 32, 42, 8); }
    },
    backGlow: ['brief', 'design', 'checks', 'forms', 'launch'],
    cast: [castRV, castPM, castARC, castUX, castVD, castDEV, castCLI],
    toy: function (name, S, t) { if (name === 'send') { TAP.sendT = t; CAPS.push({ t0: t + 0.2, col: CORAL }); TAP.inAt = t + 1.8; TAP.inN = (TAP.inN || 0) + 1; CR.burst('spark', DOOR.x + 8, DOOR.y - 6, t); } },
    hit: function (x, y, S, t, onBtn) {
      var w = CR.hitWalker(x, y, t); if (w) return w; if (onBtn) return null;
      if (Math.abs(x - PLANE.x) < 30 && Math.abs(y - PLANE.y) < 14) return { say: 'A plane over the skylights. Visitors come from **everywhere**: the site works on every screen.', near: [clamp(x, 240, 900), -40], pose: 'wow', who: 'Over the studio' };
      if (Math.abs(x - RV.x) < 56 && y > 320 && y < F + 6) { TAP.rv = t; CR.burst('heart', RV.x, 320, t); return { say: 'The client reviews the **design** before the build starts: you approve the pages first.', near: [140, 20], pose: 'love', who: 'Client at the review' }; }
      if (Math.abs(x - PM.x) < 34 && y > 230 && y < F + 6) { TAP.pm = t; CR.burst('star', PM.x, 240, t); return { say: 'Every page is designed for the **phone** as well as the desktop. Flip!', near: [200, 20], pose: 'wow', who: 'TechNext project lead' }; }
      if (x > 260 && x < 380 && y > CEIL - 10 && y < CEIL + 70) return { say: 'The TechNext **paper planes**: sent out the day a site goes live.', near: [430, 0], pose: 'love', who: 'The mobile' };
      return null;
    },
    onStop: function (key, S, t) { S.kT = t; if (key === 'forms') { CAPS.push({ t0: t + 0.3, col: TEAL }); TAP.inAt = t + 1.9; TAP.inN = (TAP.inN || 0) + 1; } if (key === 'launch') CR.burst('conf', SIGN.x + SIGN.w / 2, SIGN.y + 30, t); if (key === 'build') SWITCH.t = t; }
  };
})(window.IXW && window.IXW.kit, window.CR, window.CO);
