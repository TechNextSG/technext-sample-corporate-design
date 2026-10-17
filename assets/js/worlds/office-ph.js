/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: office-ph (/offices/philippines) — the Taguig City hub, Level 9, IP Center: TechNext's main development and
   consulting hub. The title card hangs over the floor like a sprint-board banner, so the floor runs low and wide beneath it
   and fills the wall beside it. Left to right: the pantry ("kape muna", merienda at three, a "Mabuhay" sign, a colleague at
   the counter); the consulting bench (a consultant on a client call); the printer; the open bench where two developers
   configure Odoo and write a custom module (monitors beside them, a rubber duck for debugging); the integration board (bank,
   payments, store, AI into Odoo); then the war wall: the deploy pipeline screen hung from the ceiling, the sprint board on
   wheels with the solutions architect, the hiring board with the six open roles. Parols (the Filipino star lanterns of the
   "ber" months) hang from the exposed ceiling; the business district's towers stand outside, jeepneys run on the road
   below. Wide screens add the phone booth and a teammate with a kape by the window, a water station and the kudos board.
   Everyone wears a TechNext ID, in semi-casual clothes; whoever sits shows their chair, legs and feet. Each person has their
   own idle loop and tap choreography (co-life.js); tap the deploy button, a sprint card, the coffee machine or the clock. */
(function (K, CR, CO, COL) {
  'use strict';
  if (!K || !CR || !CO || !COL) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed;
  var F = 470, CEIL = -150, C = CO.C, TEAL = '#14A38B', TEALD = '#0E7A68', INK = '#15302B', Y = '#F2B233';
  var T = { benchA: { x: 96, y: 402, w: 370 }, benchB: { x: -236, y: 402, w: 190 }, integ: { x: 488, y: 268, w: 92, h: 150 }, board: { x: 600, y: 196, w: 170, h: 214 },
    hire: { x: 862, y: 150, w: 132, h: 196 }, pipe: { x: 600, y: -96, w: 204, h: 92 }, pantry: { x: -400, y: 352, w: 138 }, printer: { x: -14, y: 352 }, clock: { x: 836, y: 64 } };
  var MON = { cfg: [196, 72, 42], code: [278, 68, 42], call: [-150, 92, 54] };
  function setU(g, sx, sy, k) { g.translate(sx, sy); g.scale(k, k); }
  function extOf(W, H, k, sx, sy) { return { l: -(sx + 24) / k, r: (W - sx) / k, t: -(sy + 24) / k, b: (H - sy) / k }; }

  function paintBg(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    CO.sky(g, e, CEIL, 250, [[0, '#8EC9E8'], [0.6, '#D9F0EE'], [1, '#F2FAF6']]);
    var sun = g.createRadialGradient(980, -60, 10, 980, -60, 420); sun.addColorStop(0, 'rgba(255,246,214,.8)'); sun.addColorStop(1, 'rgba(255,246,214,0)'); g.fillStyle = sun; g.fillRect(e.l, CEIL, e.r - e.l, F - CEIL);
    CO.skyPH(g, Math.min(e.l, -700), Math.max(e.r, 1500), 250, 300, { tall: 930 });
    /* the road below the towers, for the jeepneys (they are live) */
    g.fillStyle = '#B7C6C9'; g.fillRect(e.l, 318, e.r - e.l, 16); g.fillStyle = 'rgba(255,255,255,.7)'; for (var x = Math.floor(e.l / 40) * 40; x < e.r; x += 40) g.fillRect(x, 325, 18, 2);
    var lo = g.createLinearGradient(0, 300, 0, F); lo.addColorStop(0, 'rgba(226,245,240,.12)'); lo.addColorStop(1, 'rgba(236,246,242,.95)'); g.fillStyle = lo; g.fillRect(e.l, 336, e.r - e.l, F - 336);
    g.restore();
  }
  function paintFrame(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    CO.glass(g, e, CEIL, F, 120, '#E6F1EE', 60);
    for (var cx = Math.floor(e.l / 480) * 480 + 440; cx < e.r; cx += 480) { if (Math.abs(cx - 534) < 60 || Math.abs(cx - 920) < 80) continue; fillRR(g, cx - 14, CEIL, 28, F - CEIL, 0, '#F2F7F6'); g.fillStyle = '#D5E6E2'; g.fillRect(cx + 6, CEIL, 8, F - CEIL); g.fillStyle = TEAL; g.fillRect(cx - 14, 200, 28, 10); }
    /* the exposed ceiling: a slab, a round duct on hangers, a cable tray with its cables, track lights */
    var cg = g.createLinearGradient(0, e.t, 0, CEIL); cg.addColorStop(0, '#DDE6E6'); cg.addColorStop(1, '#EEF4F3'); g.fillStyle = cg; g.fillRect(e.l, e.t, e.r - e.l, CEIL - e.t);
    g.fillStyle = 'rgba(21,48,43,.08)'; g.fillRect(e.l, CEIL - 3, e.r - e.l, 3);
    g.fillStyle = '#C9D3D6'; for (var hx = Math.floor(e.l / 140) * 140; hx < e.r; hx += 140) { g.fillRect(hx, e.t, 2, 60); g.fillRect(hx + 70, e.t, 2, 40); }
    var dy = Math.max(e.t + 20, -236); fillRR(g, e.l, dy, e.r - e.l, 22, 11, '#E3EAEC'); g.fillStyle = 'rgba(255,255,255,.7)'; g.fillRect(e.l, dy + 4, e.r - e.l, 3); g.fillStyle = 'rgba(21,48,43,.08)'; for (var jx = Math.floor(e.l / 160) * 160; jx < e.r; jx += 160) g.fillRect(jx, dy, 4, 22);
    fillRR(g, e.l, -192, e.r - e.l, 8, 2, '#AEBCC0'); [[TEAL, 0], [Y, 3], [C.blue, 5]].forEach(function (c) { g.strokeStyle = c[0]; g.lineWidth = 2; g.beginPath(); for (var x = Math.floor(e.l / 60) * 60; x < e.r; x += 60) { g.moveTo(x, -186 + c[1] * 0.4); g.quadraticCurveTo(x + 30, -180 + c[1], x + 60, -186 + c[1] * 0.4); } g.stroke(); });
    for (var lx = Math.floor(e.l / 160) * 160; lx < e.r; lx += 160) { fillRR(g, lx + 30, CEIL - 10, 100, 6, 3, '#FFFFFF'); g.save(); var lg = g.createLinearGradient(0, CEIL, 0, CEIL + 110); lg.addColorStop(0, 'rgba(255,255,250,.3)'); lg.addColorStop(1, 'rgba(255,255,250,0)'); g.fillStyle = lg; g.beginPath(); g.moveTo(lx + 30, CEIL); g.lineTo(lx + 130, CEIL); g.lineTo(lx + 160, CEIL + 110); g.lineTo(lx, CEIL + 110); g.closePath(); g.fill(); g.restore(); }
    /* the floor: grey tiles in a checker, the teal walkway */
    var fl = g.createLinearGradient(0, F, 0, e.b); fl.addColorStop(0, '#DDE4E8'); fl.addColorStop(1, '#C9D2D8'); g.fillStyle = fl; g.fillRect(e.l, F, e.r - e.l, e.b - F);
    for (var tx = Math.floor(e.l / 60) * 60; tx < e.r; tx += 60) for (var ty = 0; ty < 6; ty++) if ((tx / 60 + ty) % 2 === 0) { g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(tx, F + 8 + ty * 34, 60, 34); }
    g.fillStyle = 'rgba(20,163,139,.22)'; g.fillRect(e.l, F + 52, e.r - e.l, 10); g.fillStyle = 'rgba(242,178,51,.5)'; for (var ax = Math.floor(e.l / 120) * 120; ax < e.r; ax += 120) { g.beginPath(); g.moveTo(ax + 40, F + 54); g.lineTo(ax + 52, F + 57); g.lineTo(ax + 40, F + 60); g.closePath(); g.fill(); }
    g.fillStyle = 'rgba(40,70,120,.10)'; g.fillRect(e.l, F, e.r - e.l, 6);
    g.restore();
  }

  /* ---------------- static back props ---------------- */
  /* the wall behind the sprint-board banner (the card): banderitas strung under the duct, the hanging Level 9 sign and the
     sprint burndown screen (its line is live); parols and trailing plants hang between them (live) */
  var BD = { x: 40, y: -66, w: 190, h: 104 }, L9 = { x: 300, y: -104, w: 232, h: 50 };
  function bandBack(g, ext) {
    var x0 = Math.max(ext.l - 20, -760), x1 = Math.min(ext.r + 20, 1300), cols = ['#E2453C', '#F2B233', '#3167CA', '#14A38B', '#FFFFFF'];
    for (var sx0 = Math.floor(x0 / 150) * 150; sx0 < x1; sx0 += 150) { g.strokeStyle = '#9AA6BC'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(sx0, -142); g.quadraticCurveTo(sx0 + 75, -118, sx0 + 150, -142); g.stroke();
      for (var f = 0; f < 6; f++) { var u = (f + 0.5) / 6, fx = sx0 + u * 150, fy = -142 + 2 * u * (1 - u) * 24 * 2 * 0.5 + (1 - Math.abs(u - 0.5) * 2) * 0; fy = -142 + 4 * u * (1 - u) * 12;
        g.fillStyle = cols[(Math.floor(sx0 / 150) * 6 + f + 600) % 5]; g.beginPath(); g.moveTo(fx - 9, fy); g.lineTo(fx + 9, fy); g.lineTo(fx, fy + 16); g.closePath(); g.fill(); } }
    /* the Level 9 sign */
    var l = L9; g.strokeStyle = '#9AA6BC'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(l.x + 30, CEIL); g.lineTo(l.x + 30, l.y); g.moveTo(l.x + l.w - 30, CEIL); g.lineTo(l.x + l.w - 30, l.y); g.stroke();
    shadowed(g, 10, 4, 0.2, function () { fillRR(g, l.x, l.y, l.w, l.h, 25, TEAL); }); fillRR(g, l.x + 5, l.y + 5, l.w - 10, l.h - 10, 20, 'rgba(255,255,255,.12)');
    CO.plane(g, l.x + 30, l.y + l.h / 2, 1.3, 0, '#FFFFFF'); text(g, 'LEVEL 9 · IP CENTER', l.x + 52, l.y + 23, 12.5, 800, '#FFFFFF'); text(g, 'Taguig City · development & consulting hub', l.x + 52, l.y + 37, 7, 700, '#D6F3EC');
    /* the burndown screen */
    var b = BD; g.strokeStyle = '#9AA6BC'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(b.x + 24, CEIL); g.lineTo(b.x + 24, b.y); g.moveTo(b.x + b.w - 24, CEIL); g.lineTo(b.x + b.w - 24, b.y); g.stroke();
    shadowed(g, 12, 5, 0.22, function () { fillRR(g, b.x - 6, b.y - 6, b.w + 12, b.h + 12, 8, '#22302C'); }); fillRR(g, b.x, b.y, b.w, b.h, 3, '#FFFFFF');
    fillRR(g, b.x, b.y, b.w, 16, 3, INK); g.fillRect(b.x, b.y + 8, b.w, 8); text(g, 'BURNDOWN · SPRINT 7 · SAMPLE', b.x + 8, b.y + 11.5, 6.4, 800, '#FFFFFF');
    g.strokeStyle = '#E3E8EF'; g.lineWidth = 1; g.beginPath(); for (var gy = 0; gy < 4; gy++) { g.moveTo(b.x + 18, b.y + 30 + gy * 16); g.lineTo(b.x + b.w - 10, b.y + 30 + gy * 16); } g.stroke();
    g.setLineDash([3, 3]); g.strokeStyle = '#9AA6BC'; g.beginPath(); g.moveTo(b.x + 18, b.y + 30); g.lineTo(b.x + b.w - 10, b.y + 78); g.stroke(); g.setLineDash([]);
    ['M', 'T', 'W', 'T', 'F'].forEach(function (d, i) { text(g, d, b.x + 22 + i * ((b.w - 36) / 4), b.y + b.h - 8, 6, 800, '#8A96A8', 'center'); });
  }
  function bandLive(g, t) {
    var b = BD, n = 9, q = (t * 0.25) % 1.3, pts = [], vals = [1, 0.92, 0.86, 0.7, 0.62, 0.5, 0.36, 0.22, 0.08];
    for (var i = 0; i < n; i++) pts.push([b.x + 18 + i * (b.w - 28) / (n - 1), b.y + 30 + (1 - vals[i]) * 48]);
    var m = Math.min(n - 1, q * (n - 1) / 1); g.strokeStyle = TEAL; g.lineWidth = 2.2; g.lineJoin = 'round'; g.beginPath(); g.moveTo(pts[0][0], pts[0][1]);
    for (var j = 1; j <= Math.floor(m); j++) g.lineTo(pts[j][0], pts[j][1]); var fi = Math.floor(m), fr = m - fi; if (fi < n - 1) g.lineTo(lerp(pts[fi][0], pts[fi + 1][0], fr), lerp(pts[fi][1], pts[fi + 1][1], fr)); g.stroke();
    var hx = fi < n - 1 ? lerp(pts[fi][0], pts[fi + 1][0], fr) : pts[n - 1][0], hy = fi < n - 1 ? lerp(pts[fi][1], pts[fi + 1][1], fr) : pts[n - 1][1]; fillE(g, hx, hy, 3.4, 3.4, TEALD); fillE(g, hx, hy, 1.6, 1.6, '#FFFFFF');
    if (m >= n - 1) { fillRR(g, b.x + b.w - 64, b.y + 22, 54, 13, 6.5, '#E6F6F2'); text(g, '✓ on track', b.x + b.w - 37, b.y + 31, 6, 800, TEALD, 'center'); }
    COL.parol(g, -150, CEIL, 46, t, '#E0456B', Y, 0.58, 5.1, Math.sin(t * 0.22) * 0.2); COL.parol(g, 264, CEIL, 96, t, C.blue, Y, 0.5, 6.3, Math.cos(t * 0.27) * 0.2);
    COL.parol(g, 566, CEIL, 40, t, Y, '#E0456B', 0.52, 7.2, Math.sin(t * 0.31) * 0.2);
    COL.hangPlant(g, -40, CEIL, 120, t, 0.9, 2);
  }
  function paintBack(g, ext) {
    bandBack(g, ext);
    /* the pantry: a "Mabuhay" sign, the merienda board, the counter, the coffee machine, the rice cooker, the kettle */
    var pn = T.pantry;
    fillRR(g, pn.x - 8, -10, pn.w + 16, 74, 10, INK); text(g, 'MABUHAY!', pn.x + pn.w / 2, 18, 15, 800, '#FFE680', 'center'); text(g, 'TAGUIG CITY · LEVEL 9', pn.x + pn.w / 2, 36, 7.4, 800, '#BFE3DA', 'center');
    [[TEAL, 0], [Y, 1], [C.blue, 2], ['#E0456B', 3]].forEach(function (c) { fillRR(g, pn.x + 22 + c[1] * 26, 48, 20, 5, 2.5, c[0]); });
    shadowed(g, 8, 3, 0.18, function () { fillRR(g, pn.x + 6, 160, pn.w - 12, 92, 6, '#2F3B36'); }); fillRR(g, pn.x + 10, 164, pn.w - 20, 84, 4, '#3A4A44');
    text(g, 'PANTRY', pn.x + pn.w / 2, 182, 8.5, 800, '#FFE680', 'center'); [['Kape', 'all day'], ['Merienda', '3 pm'], ['Stand-up', 'daily']].forEach(function (r, i) { var y = 202 + i * 15; text(g, r[0], pn.x + 18, y, 7.4, 800, '#FFFFFF'); text(g, r[1], pn.x + pn.w - 18, y, 6.6, 700, '#9FE3D1', 'right'); });
    /* wide screens: the water station and the kudos board by the pantry */
    if (ext.l < -420) { fillRR(g, -520, 260, 46, F - 260, 6, '#E9EEF6'); fillRR(g, -514, 196, 34, 66, 10, 'rgba(159,214,240,.75)'); fillRR(g, -510, 210, 26, 4, 2, 'rgba(255,255,255,.7)'); fillE(g, -506, 300, 3, 3, '#3167CA'); fillE(g, -490, 300, 3, 3, '#E2453C');
      shadowed(g, 8, 3, 0.16, function () { fillRR(g, -600, 40, 120, 140, 6, '#C9A27A'); }); fillRR(g, -594, 46, 108, 128, 4, '#D9B48A'); text(g, 'KUDOS', -540, 62, 8, 800, INK, 'center');
      [['#FFE680', -584, 72, -0.06], ['#B8EBD3', -540, 76, 0.05], ['#FFC2D1', -582, 118, 0.04], ['#C4DAFB', -538, 120, -0.05]].forEach(function (n) { COL.note(g, n[1] + 18, n[2] + 18, 34, n[3], n[0]); g.fillStyle = '#C9D3E3'; g.fillRect(n[1] + 6, n[2] + 14, 22, 2); g.fillRect(n[1] + 6, n[2] + 20, 16, 2); fillE(g, n[1] + 18, n[2] + 2, 2.6, 2.6, '#E2453C'); });
      K.plant(g, { x: -440, y: F }, TEAL, '#3AB9A2'); }
    /* the printer between the benches (its pages are live) */
    var pr = T.printer; soft(g, pr.x + 34, F + 4, 50, 6, 0.2); fillRR(g, pr.x, pr.y + 40, 68, F - pr.y - 40, 6, '#E9EEF6'); fillRR(g, pr.x + 4, pr.y, 60, 42, 6, '#F4F7FC'); fillRR(g, pr.x + 4, pr.y, 60, 10, 5, '#DCE3EE');
    fillRR(g, pr.x + 12, pr.y + 22, 44, 5, 2, '#5C6B7A'); fillE(g, pr.x + 54, pr.y + 15, 2.4, 2.4, '#2BC48A'); fillRR(g, pr.x + 10, pr.y + 62, 48, 6, 2, '#C9D3E3');
    /* the integration board on its stand */
    var ig = T.integ; soft(g, ig.x + ig.w / 2, F + 4, 60, 7, 0.2); g.fillStyle = '#7A869C'; g.fillRect(ig.x + ig.w / 2 - 3, ig.y + ig.h, 6, F - ig.y - ig.h - 6); fillRR(g, ig.x + ig.w / 2 - 26, F - 8, 52, 8, 4, '#5C6B7A');
    shadowed(g, 12, 5, 0.18, function () { fillRR(g, ig.x, ig.y, ig.w, ig.h, 8, '#FFFFFF'); }); g.strokeStyle = '#C9D6D2'; g.lineWidth = 2; rr(g, ig.x, ig.y, ig.w, ig.h, 8); g.stroke();
    fillRR(g, ig.x, ig.y, ig.w, 20, 8, TEAL); g.fillRect(ig.x, ig.y + 12, ig.w, 8); text(g, 'INTEGRATIONS', ig.x + ig.w / 2, ig.y + 14, 6.6, 800, '#FFFFFF', 'center');
    [['BANK', TEAL], ['PAY', Y], ['SHOP', C.sg], ['AI', C.vn]].forEach(function (p, i) { var py = ig.y + 34 + i * 20; fillE(g, ig.x + 16, py, 7, 7, p[1]); text(g, p[0], ig.x + 28, py + 3, 6.4, 800, INK); });
    fillE(g, ig.x + ig.w - 20, ig.y + 122, 14, 14, C.odoo); text(g, 'odoo', ig.x + ig.w - 20, ig.y + 125, 6.4, 800, '#FFFFFF', 'center');
    /* the deploy pipeline, hung from the ceiling (its stages are live) */
    var pp = T.pipe; g.strokeStyle = '#9AA6BC'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(pp.x + 24, CEIL); g.lineTo(pp.x + 24, pp.y); g.moveTo(pp.x + pp.w - 24, CEIL); g.lineTo(pp.x + pp.w - 24, pp.y); g.stroke();
    shadowed(g, 12, 5, 0.22, function () { fillRR(g, pp.x - 6, pp.y - 6, pp.w + 12, pp.h + 12, 8, '#22302C'); }); fillRR(g, pp.x, pp.y, pp.w, pp.h, 3, '#FFFFFF');
    fillRR(g, pp.x, pp.y, pp.w, 16, 3, INK); g.fillRect(pp.x, pp.y + 8, pp.w, 8); text(g, 'PIPELINE · SPRINT 7 · SAMPLE', pp.x + 8, pp.y + 11.5, 6.6, 800, '#FFFFFF');
    /* the sprint board on wheels */
    var b = T.board; soft(g, b.x + b.w / 2, F + 4, 90, 8, 0.2); g.fillStyle = '#9AA6BC'; g.fillRect(b.x + 14, b.y + b.h, 5, F - b.y - b.h - 8); g.fillRect(b.x + b.w - 19, b.y + b.h, 5, F - b.y - b.h - 8); fillE(g, b.x + 16, F - 4, 4, 4, '#2A3550'); fillE(g, b.x + b.w - 16, F - 4, 4, 4, '#2A3550');
    shadowed(g, 12, 5, 0.18, function () { fillRR(g, b.x, b.y, b.w, b.h, 6, '#FFFFFF'); }); g.strokeStyle = '#C9D1DD'; g.lineWidth = 2; rr(g, b.x, b.y, b.w, b.h, 6); g.stroke();
    text(g, 'SPRINT 7 · ODOO', b.x + 10, b.y + 16, 7, 800, TEALD); fillRR(g, b.x + b.w - 46, b.y + 7, 36, 12, 6, '#FFE680'); text(g, '6 items', b.x + b.w - 28, b.y + 15.5, 5.6, 800, INK, 'center');
    ['TO DO', 'DOING', 'DONE'].forEach(function (l, i) { var lw = (b.w - 16) / 3, lx = b.x + 8 + i * lw; fillRR(g, lx, b.y + 24, lw - 4, 14, 3, ['#E3E8EF', '#FFF2C8', '#D7F2EA'][i]); text(g, l, lx + (lw - 4) / 2, b.y + 34, 6, 800, INK, 'center'); if (i) { g.fillStyle = '#EEF2F6'; g.fillRect(lx - 3, b.y + 42, 1.5, b.h - 50); } });
    fillRR(g, b.x + 20, b.y + b.h - 4, b.w - 40, 6, 3, '#AAB4C4'); fillRR(g, b.x + 30, b.y + b.h - 7, 12, 4, 2, TEAL); fillRR(g, b.x + 46, b.y + b.h - 7, 12, 4, 2, '#E0456B');
    /* the hiring board, its six open roles */
    var hb = T.hire; soft(g, hb.x + hb.w / 2, F + 4, 70, 7, 0.2); g.fillStyle = '#7A869C'; g.fillRect(hb.x + 18, hb.y + hb.h, 5, F - hb.y - hb.h); g.fillRect(hb.x + hb.w - 23, hb.y + hb.h, 5, F - hb.y - hb.h); fillRR(g, hb.x + 6, F - 6, 30, 6, 3, '#5C6B7A'); fillRR(g, hb.x + hb.w - 36, F - 6, 30, 6, 3, '#5C6B7A');
    shadowed(g, 12, 5, 0.18, function () { fillRR(g, hb.x, hb.y, hb.w, hb.h, 10, '#FFFFFF'); }); fillRR(g, hb.x, hb.y, hb.w, 30, 10, TEAL); g.fillRect(hb.x, hb.y + 20, hb.w, 10);
    text(g, "WE'RE HIRING", hb.x + hb.w / 2, hb.y + 20, 10.5, 800, '#FFFFFF', 'center');
    ['Solutions architect', 'Odoo consultant', 'B2B sales', 'Marketing officer', 'Senior accountant', 'HR generalist'].forEach(function (r, i) { var ry = hb.y + 38 + i * 24; fillRR(g, hb.x + 9, ry, hb.w - 18, 19, 5, i % 2 ? '#E6F6F2' : '#F1F5FB'); fillRR(g, hb.x + 9, ry, 4, 19, 2, i < 2 ? TEAL : i < 4 ? C.blue : C.vn); text(g, r, hb.x + 18, ry + 12.6, 7.2, 800, INK); });
    text(g, 'Taguig City · careers', hb.x + hb.w / 2, hb.y + hb.h - 6, 6.6, 800, TEALD, 'center');
    /* wide screens: the phone booth by the window and a plant */
    if (ext.r > 1010) { var pbx = 1022; soft(g, pbx + 52, F + 4, 70, 8, 0.24); fillRR(g, pbx, 150, 104, F - 150, 12, '#2F5D55'); fillRR(g, pbx + 8, 176, 88, F - 186, 8, 'rgba(214,240,234,.55)');
      fillRR(g, pbx - 4, 140, 112, 18, 9, INK); text(g, 'PHONE BOOTH', pbx + 52, 152, 7, 800, '#FFE680', 'center'); K.plant(g, { x: 1230, y: F }, TEAL, '#3AB9A2'); }
  }
  function paintFront(g, ext) {
    var a = T.benchA, b = T.benchB, pn = T.pantry;
    /* the pantry counter, in front of whoever stands behind it */
    soft(g, pn.x + pn.w / 2, F + 4, 80, 8, 0.2); fillRR(g, pn.x, pn.y + 40, pn.w, F - pn.y - 40, 6, '#F4F7FC'); fillRR(g, pn.x - 4, pn.y + 32, pn.w + 8, 10, 4, '#C9A27A');
    g.fillStyle = 'rgba(21,48,43,.07)'; g.fillRect(pn.x + pn.w / 2 - 1, pn.y + 48, 2, F - pn.y - 56); fillE(g, pn.x + pn.w / 2 - 8, pn.y + 80, 2.4, 2.4, '#9AA6BC'); fillE(g, pn.x + pn.w / 2 + 8, pn.y + 80, 2.4, 2.4, '#9AA6BC');
    var mx = pn.x + 14; fillRR(g, mx, pn.y - 40, 50, 72, 9, '#2A3550'); fillRR(g, mx + 7, pn.y - 32, 36, 15, 4, '#3A4458'); fillRR(g, mx + 14, pn.y - 4, 22, 5, 2, '#5C6B7A');
    var rc = pn.x + 80; fillRR(g, rc, pn.y + 4, 36, 28, 10, '#FFFFFF'); fillRR(g, rc + 4, pn.y - 2, 28, 9, 4, '#E9EEF6'); fillRR(g, rc + 14, pn.y - 6, 8, 5, 2, '#9AA6BC'); fillE(g, rc + 30, pn.y + 14, 2.2, 2.2, '#2BC48A');
    text(g, 'RICE', rc + 18, pn.y + 23, 5.6, 800, TEALD, 'center');

    CO.desk(g, a.x, a.y, a.w, F, { open: true, mons: [MON.cfg, MON.code] });
    fillRR(g, a.x + 40, a.y - 7, 54, 7, 3, '#DDE3EC'); fillRR(g, a.x + 300, a.y - 7, 54, 7, 3, '#DDE3EC');
    fillRR(g, a.x + 154, a.y - 18, 13, 18, 5, '#3AB9A2'); fillRR(g, a.x + 154, a.y - 18, 13, 4, 2, '#0E7A68');
    /* a cable tray under the bench, a laptop sticker, a small cactus */
    g.strokeStyle = '#5C6B7A'; g.lineWidth = 2; g.beginPath(); g.moveTo(a.x + 130, a.y + 12); g.quadraticCurveTo(a.x + 200, a.y + 40, a.x + 270, a.y + 12); g.stroke();
    fillRR(g, a.x + 102, a.y - 12, 12, 12, 3, '#E0456B'); fillRR(g, a.x + 105, a.y - 22, 6, 12, 3, '#35AE70');
    CO.desk(g, b.x, b.y, b.w, F, { open: true, mons: [MON.call] });
    fillRR(g, b.x + 14, b.y - 7, 54, 7, 3, '#DDE3EC'); COL.mug(g, b.x + 172, b.y, 0.85, '#FFFFFF', TEAL);
    /* the deploy button on the dev bench, between the code monitor and the custom-module developer */
    fillRR(g, a.x + 244, a.y - 18, 30, 18, 5, '#2A3550');
  }

  var W = CR.who, GREY = '#9AA6BC';
  var DEV1 = W({ x: 150, y: 470, s: 0.54, ph: 0.3, skin: 2, hair: 0, style: 'short', outfit: 'polo', top: '#14A38B', glasses: true, headset: '#2A3550', sit: true, chairCol: '#2A3550', hands: [[-60, -196], [70, -196]], look: 0.4 });
  var DEV2 = W({ x: 410, y: 470, s: 0.54, ph: 1.2, skin: 1, hair: 1, style: 'pony', outfit: 'cardigan', top: '#DCE7FB', top2: '#3167CA', sit: true, chairCol: '#2A3550', hands: [[-70, -196], [60, -196]], look: -0.4 });
  var CON = W({ x: -190, y: 470, s: 0.54, ph: 2.0, skin: 3, hair: 0, style: 'bob', outfit: 'shirt', top: '#F2B233', headset: '#14A38B', sit: true, chairCol: '#2A3550', hands: [[-60, -196], [70, -196]], look: 0.5 });
  var ARC = W({ x: 812, y: 470, s: 0.54, ph: 2.7, skin: 4, hair: 1, style: 'short', outfit: 'polo', top: '#1E4691', glasses: true, hands: [[-130, -300], [70, -150]], look: -0.6 });
  var CREW = [
    { x0: -640, x1: -430, y: 486, spd: 18, ph: 0.2, label: 'HR, Taguig City', lines: ['New starter on Monday! Laptop, ID and a **welcome kit**.', 'We’re hiring here in **Taguig City**. Check the board!'], acts: ['wave', 'id', 'cheer'],
      P: W({ s: 0.5, skin: 0, hair: 2, style: 'bob', outfit: 'shirt', top: '#E0456B', hold: 'box' }) },
    { x0: 1010, x1: 1260, y: 488, spd: 16, ph: 0.6, label: 'Finance, Taguig City', lines: ['Month-end close, **done in Odoo**.', 'Finance sits right here with the developers.'], acts: ['nod', 'id', 'jump'],
      P: W({ s: 0.5, skin: 2, hair: 0, style: 'short', outfit: 'cardigan', top: '#2A3550', top2: '#DCE7FB', glasses: true, hold: 'tablet' }) },
    { front: true, x0: -620, x1: 240, y: 598, spd: 22, ph: 0.35, label: 'Marketing officer', lines: ['Merienda’s here! **Pandesal** at three.', 'The website you’re reading? Made **right here**.'], acts: ['cheer', 'id', 'spin'],
      P: W({ s: 0.58, skin: 1, hair: 2, style: 'long', outfit: 'polo', top: '#F2B233', top2: '#15302B', hold: 'tray', hands: [[-60, -212], [70, -150]] }) }
  ];
  /* extras: the colleague at the pantry counter, the consultant in the phone booth, a teammate with a kape by the window */
  var XS = [
    { P: W({ x: -298, y: 470, s: 0.52, ph: 1.4, skin: 3, hair: 0, style: 'short', outfit: 'polo', top: '#3167CA', top2: '#FFFFFF' }), hands: [[-70, -150], [60, -240]],
      box: [-298, 320, 70, 150], who: 'Odoo consultant', role: 'Pantry · illustration', near: [-60, 130], pose: 'love', dur: [1.8, 1.8], fx: ['heart', 'conf'],
      lines: ['Kape muna! Coffee first, then **stand-up**.', 'Pandesal for the sprint team. **Merienda** at three!'],
      idle: function (P, t) { var c = (t + 2) % 8; if (c < 1.4) { P.hands[1] = [26, -330]; P.look = 0; } else if (c < 4.5) { P.hands = [[-110, -230], [60, -240]]; P.look = -0.7; } else { P.look = 0.6; P.mood = 'happy'; } },
      moves: [function (P, u) { P.hands = [[-70, -150], [114, -410]]; P.hop = COL.bell(u) * 14; P.look = 0.3; }, function (P, u, t) { P.hands = [[-118, -300 - Math.abs(Math.sin(t * 8)) * 20], [60, -240]]; P.look = 0.2; P.tilt = Math.sin(t * 7) * 0.05; }],
      after: function (g, P, t, S, X, u) { var h = COL.hand(P, 1); COL.mug(g, h[0], h[1] + 6, 1, '#FFFFFF', TEAL); if (!(u >= 0)) COL.steam(g, h[0], h[1] - 12, t, 0.45, 2);
        if (u >= 0 && X.k === 1) { var hl = COL.hand(P, 0); fillRR(g, hl[0] - 12, hl[1] - 26, 24, 24, 4, '#E8C394'); fillRR(g, hl[0] - 12, hl[1] - 26, 24, 5, 2, '#DDAF78'); fillE(g, hl[0] - 4, hl[1] - 28, 6, 4, '#E9B872'); fillE(g, hl[0] + 4, hl[1] - 29, 6, 4, '#E2A85C'); COL.bubble(g, hl[0], hl[1] - 34, 'Pandesal!', COL.bell(u) * 2, TEALD); } } },
    { P: W({ x: 1074, y: 470, s: 0.5, ph: 0.8, skin: 2, hair: 2, style: 'pony', outfit: 'shirt', top: '#14A38B', headset: '#F2B233' }), hands: [[-60, -170], [96, -270]],
      box: [1074, 320, 96, 280], who: 'Functional consultant', role: 'Phone booth · illustration', near: [880, 80], pose: 'wow', dur: [1.6, 1.8], fx: ['spark', 'star'],
      lines: ['On a call with a client in **another country**. 10+ of them!', 'Walkthrough done. **Next step: training**.'],
      idle: function (P, t) { var c = t % 7; P.talk = c < 4.5; P.hands = [[-60, -170], [96 + Math.sin(t * 2.4) * 18, -270 + Math.sin(t * 3.1) * 16]]; P.look = Math.sin(t * 0.6) * 0.5; if (!P.talk) { P.hands[1] = [40, -330]; P.tilt = 0.05; } },
      moves: [function (P, u, t) { P.hands = [[-60, -170], [118 + Math.sin(t * 13) * 14, -400]]; P.look = 0.4; }, function (P, u) { P.hands = [[-90, -360], [90, -360]]; P.hop = COL.bell(u) * 12; }],
      after: function (g, P, t, S, X, u) { if (u >= 0 && X.k === 1) { var hd = COL.head(P); COL.pop(g, hd[0], hd[1] - 70, '✓ Next: training', u, TEALD); } } },
    { P: W({ x: 1186, y: 470, s: 0.52, ph: 2.6, skin: 0, hair: 1, style: 'short', outfit: 'cardigan', top: '#E0456B', top2: '#FFFFFF', glasses: true }), hands: [[-70, -150], [56, -250]],
      box: [1186, 360, 80, 230], who: 'Odoo developer', role: 'By the window · illustration', near: [900, 100], pose: 'clap', dur: [1.6, 1.6], fx: ['note', 'code'],
      lines: ['Watching the **jeepneys** while the tests run.', 'Tests passed. **Kape** to celebrate!'],
      idle: function (P, t) { var c = (t + 4) % 7; P.sx = c < 3.5 ? -1 : 1; P.look = c < 3.5 ? 0.6 : -0.3; if (c > 5.5) P.hands[1] = [26, -330]; },
      moves: [function (P, u, t) { var b = Math.sin(t * 9); P.tilt = b * 0.12; P.hop = Math.abs(b) * 10; P.hands = b > 0 ? [[-120, -390], [56, -250]] : [[-70, -170], [110, -390]]; }, function (P, u) { P.hands = [[-110, -260], [56, -250]]; P.sx = Math.cos(u * Math.PI * 2); }],
      after: function (g, P, t) { var h = COL.hand(P, 1); COL.mug(g, h[0], h[1] + 6, 0.95, '#FFFFFF', Y); } }
  ];

  var PH = { card: -9, cardN: 0, duck: -9, ball: -9, toggles: -9, wave: -9, note: -9, newCard: -9, newN: 0, ship: -9, page: -9 };
  function pipeLive(g, t, S) {
    var pp = T.pipe, dt = t - (S.toy.deploy != null ? S.toy.deploy : -9), run = dt < 4 ? dt * 1.2 : (t * 0.35) % 5;
    [['Configure', TEAL], ['Build', C.blue], ['Test', Y], ['Staging', C.odoo]].forEach(function (st2, i) { var x = pp.x + 10 + i * 48, y = pp.y + 26, on = run > i + 0.8, busy = run > i && !on;
      fillRR(g, x, y, 42, 44, 6, on ? '#E6F6F2' : '#F4F6FA'); fillE(g, x + 21, y + 15, 9, 9, on ? '#2BC48A' : busy ? st2[1] : '#D5DCE6');
      if (on) { g.strokeStyle = '#FFFFFF'; g.lineWidth = 2; g.beginPath(); g.moveTo(x + 16.5, y + 15); g.lineTo(x + 20, y + 18.5); g.lineTo(x + 25.5, y + 12); g.stroke(); }
      if (busy) { g.strokeStyle = '#FFFFFF'; g.lineWidth = 2; g.beginPath(); g.arc(x + 21, y + 15, 5, t * 7, t * 7 + 4); g.stroke(); }
      text(g, st2[0], x + 21, y + 36, 5.8, 800, on ? INK : '#8A96A8', 'center'); if (i < 3) { g.strokeStyle = on ? '#2BC48A' : '#D5DCE6'; g.lineWidth = 2; g.beginPath(); g.moveTo(x + 42, y + 15); g.lineTo(x + 48, y + 15); g.stroke(); } });
    fillRR(g, pp.x + 10, pp.y + pp.h - 12, pp.w - 20, 4, 2, '#E3E8EF'); fillRR(g, pp.x + 10, pp.y + pp.h - 12, (pp.w - 20) * clamp(run / 4, 0, 1), 4, 2, TEAL);
  }
  function boardLive(g, t, S) {
    var b = T.board, lw = (b.w - 16) / 3, mv = t - PH.card, md = S.hot === 'modules' ? clamp((t - (S.mT || 0)) / 1.4, 0, 1) : (mv < 1.6 ? clamp(mv / 1.2, 0, 1) : 0), sh = t - PH.ship;
    var cards = [[0, 0, 'Sales', '#3167CA'], [0, 1, 'Purchase', Y], [1, 0, 'Inventory', TEAL], [1, 1, 'Custom', C.vn], [2, 0, 'Accounting', C.odoo], [2, 1, 'Bank feed', '#3FA9E0']];
    var arcCyc = (t + 3) % 12, drift = arcCyc > 2 && arcCyc < 4 ? COL.ease((arcCyc - 2) / 2) : arcCyc >= 4 && arcCyc < 9 ? 1 : arcCyc >= 9 && arcCyc < 10 ? 1 - COL.ease(arcCyc - 9) : 0;
    cards.forEach(function (c, i) { var x = b.x + 8 + c[0] * lw, y = b.y + 44 + c[1] * 52;
      if (i === 3 && (md > 0 || sh < 2)) { var m = Math.max(md, sh < 2 ? clamp(sh / 0.8, 0, 1) : 0); x = lerp(x, b.x + 8 + 2 * lw, m); y = lerp(y, b.y + 44 + 2 * 52, m); }
      if (i === 1 && !(md > 0)) { x = lerp(x, b.x + 8 + lw, drift); y = lerp(y, b.y + 44 + 2 * 52, drift); }
      shadowed(g, 4, 2, 0.12, function () { fillRR(g, x, y, lw - 4, 44, 4, '#FFFFFF'); }); fillRR(g, x, y, 4, 44, 2, c[3]); text(g, c[2], x + 8, y + 14, 6, 800, INK); fillRR(g, x + 8, y + 21, lw - 22, 3.4, 1.7, '#E3E8EF'); fillRR(g, x + 8, y + 28, (lw - 22) * 0.6, 3.4, 1.7, '#E3E8EF');
      fillE(g, x + lw - 13, y + 36, 4.5, 4.5, ['#F0CBA8', '#DDAE86', '#E8BC95', '#F6D9BF', '#D29E74', '#F0CBA8'][i]); });
    var nc = t - PH.newCard; if (nc < 6) { var land = COL.ease(clamp(nc / 0.35, 0, 1)), x2 = b.x + 8, y2 = b.y + 44 + 2 * 52 + (1 - land) * -40; g.save(); g.globalAlpha = clamp((6 - nc) * 2, 0, 1); shadowed(g, 4, 2, 0.14, function () { fillRR(g, x2, y2, lw - 4, 44, 4, '#FFFBEA'); }); fillRR(g, x2, y2, 4, 44, 2, '#E0456B'); text(g, 'New idea', x2 + 8, y2 + 14, 6, 800, INK); fillRR(g, x2 + 8, y2 + 21, lw - 22, 3.4, 1.7, '#F2E2B8'); g.restore(); }
  }
  function paintLive(g, t, now, S) {
    CO.crew(CREW, g, t, S, false);
    pipeLive(g, t, S); boardLive(g, t, S); bandLive(g, t);
    /* parols from the ceiling */
    COL.parol(g, 846, CEIL, 18, t, Y, TEAL, 0.62, 0.4, Math.sin(t * 0.25) * 0.2); COL.parol(g, 940, CEIL, 70, t, TEAL, Y, 0.55, 1.9, Math.cos(t * 0.2) * 0.2);
    if (S.ext.r > 1010) COL.parol(g, 1110, CEIL, 30, t, '#E0456B', Y, 0.6, 3.1, Math.sin(t * 0.3) * 0.2); if (S.ext.l < -420) COL.parol(g, -540, CEIL, 60, t, C.blue, Y, 0.55, 4.2, 0);
    var ck = T.clock, ct = t - (S.toy.clock != null ? S.toy.clock : -9); g.strokeStyle = '#9AA6BC'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(ck.x, CEIL); g.lineTo(ck.x, ck.y - 26); g.stroke();
    g.save(); if (ct < 1.2) { g.translate(ck.x, ck.y); g.rotate(Math.sin(ct * 20) * 0.08 * (1.2 - ct)); g.translate(-ck.x, -ck.y); } CO.clock(g, ck.x, ck.y, 20, 8, TEAL); g.restore(); text(g, 'PHT', ck.x, ck.y + 34, 7, 800, TEALD, 'center');
    /* the integration board: tokens flow down into Odoo */
    var ig = T.integ, fl = S.hot === 'integrate' ? ((t - (S.iT || 0)) * 1.2) % 1 : (t * 0.3) % 1, ox = ig.x + ig.w - 20, oy = ig.y + 122;
    [TEAL, Y, C.sg, C.vn].forEach(function (c, i) { var q = (fl + i * 0.25) % 1, sx = ig.x + 16, sy = ig.y + 34 + i * 20; fillE(g, lerp(sx, ox, q), lerp(sy, oy, q), 2.6, 2.6, c); });
    /* the printer prints a page now and then */
    var pr = T.printer, pc = (t + 1) % 9; if (pc < 2.4) { var out = COL.ease(pc / 1.6); COL.sheet(g, pr.x + 34, pr.y + 24 - out * 14, 0, 30, 24 * out + 2, 3); fillE(g, pr.x + 54, pr.y + 15, 2.4, 2.4, '#FFB547'); }
    COL.draw([XS[0]], g, t, S); if (S.ext.r > 1010) { COL.draw([XS[1]], g, t, S); }
  }
  function paintFrontLive(g, t, S) {
    CO.crew(CREW, g, t, S, true);
    /* the pantry: steam; tapped, a cup pours */
    var pn = T.pantry, mx = pn.x + 14, br = t - (S.toy.coffee != null ? S.toy.coffee : -9); fillRR(g, mx + 17, pn.y + 8, 16, 22, 4, '#FFFFFF');
    if (br < 2.6) { g.fillStyle = '#6B4329'; g.fillRect(mx + 23.5, pn.y + 2, 3, Math.min(12, br * 18)); fillRR(g, mx + 19, pn.y + 28 - Math.min(10, br * 5), 12, Math.min(10, br * 5), 2, '#8A5A3B'); }
    fillE(g, mx + 40, pn.y - 24, 3, 3, Math.floor(t * 1.5) % 2 ? '#7FE3C4' : '#3A4458'); COL.steam(g, mx + 25, pn.y + 4, t, br < 2.6 ? 0.85 : 0.35, 3); COL.steam(g, pn.x + 98, pn.y - 8, t * 0.8 + 0.4, 0.35, 2);
    /* the phone booth's glass over the consultant inside it; the teammate by the window */
    if (S.ext.r > 1010) { g.fillStyle = 'rgba(214,240,234,.28)'; g.fillRect(1030, 176, 88, F - 186); g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.moveTo(1040, F - 10); g.lineTo(1070, 176); g.lineTo(1082, 176); g.lineTo(1052, F - 10); g.closePath(); g.fill(); fillRR(g, 1110, 290, 4, 40, 2, '#9AA6BC'); COL.draw([XS[2]], g, t, S); }
    /* the screens (in front of their frames): Odoo apps, code, the client call */
    var a = T.benchA, cf = S.hot === 'configure', y0 = a.y - 26, tg = t - PH.toggles;
    CO.screen(g, MON.cfg[0] + 4, y0 - MON.cfg[2] + 4, MON.cfg[1] - 8, MON.cfg[2] - 8, t, 'odoo'); if (cf) fillRR(g, MON.cfg[0] + 4, y0 - 6, (MON.cfg[1] - 8) * clamp((t - (S.cT || 0)) / 1.5, 0, 1), 3, 1.5, TEAL);
    if (tg < 2.2) { g.save(); g.globalAlpha = clamp((2.2 - tg) * 3, 0, 1); for (var k2 = 0; k2 < 3; k2++) { var tx = MON.cfg[0] + 8, ty = y0 - MON.cfg[2] + 8 + k2 * 10, on = tg > 0.2 + k2 * 0.25; fillRR(g, tx, ty, MON.cfg[1] - 16, 8, 2, '#FFFFFF'); fillRR(g, tx + MON.cfg[1] - 32, ty + 1.5, 12, 5, 2.5, on ? TEAL : '#CBD3DE'); fillE(g, tx + MON.cfg[1] - (on ? 23 : 29), ty + 4, 2, 2, '#FFFFFF'); fillRR(g, tx + 3, ty + 2.5, 20, 3, 1.5, '#C9D3E3'); } g.restore(); }
    CO.screen(g, MON.code[0] + 4, y0 - MON.code[2] + 4, MON.code[1] - 8, MON.code[2] - 8, t, 'code', S.hot === 'code');
    var vx = MON.call[0] + 4, vy = y0 - MON.call[2] + 4, vw = MON.call[1] - 8, wv = t - PH.wave; fillRR(g, vx, vy, vw, 46, 2, '#1E2A3A'); fillRR(g, vx + 3, vy + 3, vw / 2 - 5, 34, 3, '#3A4458'); fillRR(g, vx + vw / 2 + 2, vy + 3, vw / 2 - 5, 34, 3, '#2F5D7A');
    fillE(g, vx + vw / 4, vy + 17, 7, 7, '#E8BC95'); fillRR(g, vx + vw / 4 - 9, vy + 24, 18, 12, 6, '#5E7BB5'); fillE(g, vx + vw * 3 / 4, vy + 17, 7, 7, '#DDAE86'); fillRR(g, vx + vw * 3 / 4 - 9, vy + 24, 18, 12, 6, TEAL);
    if (wv < 1.8) { var wa = Math.sin(t * 12) * 3; fillE(g, vx + vw / 4 + 9 + wa, vy + 12, 2.6, 2.6, '#E8BC95'); fillE(g, vx + vw * 3 / 4 - 9 - wa, vy + 12, 2.6, 2.6, '#DDAE86'); }
    var talk = S.hot === 'consult' ? Math.abs(Math.sin(t * 9)) : 0.2; fillRR(g, vx + 3, vy + 39, (vw - 6) * (0.3 + 0.5 * talk), 3, 1.5, '#7FE3C4');
    var nt = t - PH.note; if (nt < 2) { var hd = COL.head(CON); COL.pop(g, hd[0] + 10, hd[1] - 64, 'Noted: step 4 → Inventory', nt / 2, TEALD); }
    /* the rubber duck on the dev bench; the paper ball */
    var dk = t - PH.duck, dh = dk < 1.2 ? COL.bell(dk / 1.2) * 18 : 0, dxk = a.x + 354; fillE(g, dxk, a.y - 5 - dh, 7, 5.5, '#FFD84A'); fillE(g, dxk + 4, a.y - 12 - dh, 4.4, 4.4, '#FFD84A'); fillE(g, dxk + 8, a.y - 11 - dh, 2.4, 1.4, '#F08A24'); fillE(g, dxk + 5, a.y - 13 - dh, 0.9, 0.9, INK);
    if (dk < 1.4) COL.bubble(g, dxk + 4, a.y - 26 - dh, 'Quack!', COL.bell(dk / 1.4) * 2, '#B8860B');
    var bl = t - PH.ball; if (bl < 1.1) { var hb2 = COL.hand(DEV2, 1), u = bl / 1.1, bx2 = lerp(hb2[0], 486, u), by2 = lerp(hb2[1], 452, u) - Math.sin(u * Math.PI) * 70; fillE(g, bx2, by2, 5, 5, '#FFFFFF'); g.strokeStyle = '#C9D3E3'; g.lineWidth = 0.8; g.beginPath(); g.arc(bx2, by2, 5, 0, 7); g.stroke(); }
    fillRR(g, 478, 444, 20, 26, 3, '#5C6B7A'); fillRR(g, 476, 442, 24, 5, 2, '#7A869C'); if (bl > 1 && bl < 1.8) COL.pop(g, 488, 430, 'Swish!', (bl - 1) / 0.8, TEALD);
    /* the developer's tumbler */
    var c1 = (t + 1) % 10; if (c1 > 6.5 && c1 < 8 && !(t - (PH.d1 || -9) < 1.8)) { var hd1 = COL.hand(DEV1, 1); fillRR(g, hd1[0] - 6, hd1[1] - 12, 12, 18, 4, '#3AB9A2'); fillRR(g, hd1[0] - 6, hd1[1] - 12, 12, 4, 2, '#0E7A68'); }
    /* the deploy button: tapped, it glows green and the staging banner rises */
    var dpx = a.x + 259, dpy = a.y - 14, dt = t - (S.toy.deploy != null ? S.toy.deploy : -9), on = dt < 3;
    fillE(g, dpx, dpy, 10, 6, on ? '#2BC48A' : '#E2453C'); fillE(g, dpx, dpy - 2, 8, 4, on ? '#7FFFD4' : '#FF8A80');
    if (on) { var uu = Math.min(1, dt * 2), al = dt > 2.4 ? (3 - dt) / 0.6 : 1; g.save(); g.globalAlpha = al; fillRR(g, dpx - 80, a.y - 150 - uu * 20, 150, 30, 15, '#0E7A50'); text(g, '✓ Deployed to staging', dpx - 5, a.y - 131 - uu * 20, 9, 800, '#FFFFFF', 'center'); g.restore(); }
    var sh = t - PH.ship; if (sh < 1.8) { var ha = COL.head(ARC); COL.pop(g, ha[0], ha[1] - 70, 'Ship it! → DONE', sh / 1.8, TEALD); }
    CR.draw(g, t);
  }
  function FORE() {
    return [
      [600, function (g, ext, t) { COL.swayPlant(g, -300, 602, t, 0.62, '#FFFFFF', '#E3E9F3', 1); if (ext.r > 940) COL.swayPlant(g, 976, 600, t, 0.6, TEAL, '#3AB9A2', 2); }],
      [596, function (g, ext) { if (ext.r > 1010) { var x = 1030, y = 536; soft(g, x + 100, y + 62, 120, 8, 0.22); fillRR(g, x, y, 200, 60, 8, '#E9EEF6'); for (var i = 0; i < 4; i++) { fillRR(g, x + 6 + i * 48, y + 6, 44, 48, 4, ['#14A38B', '#3167CA', '#F2B233', '#E0456B'][i]); fillRR(g, x + 22 + i * 48, y + 18, 12, 3, 1.5, 'rgba(255,255,255,.7)'); } text(g, 'LOCKERS', x + 100, y - 6, 7, 800, INK, 'center'); } }]
    ];
  }

  window.IXW.worlds['office-ph'] = {
    pan: [-420, 1060],
    paintBg: paintBg, windowBehind: true, paintFrame: paintFrame, paintBack: paintBack, paintFront: paintFront,
    paintWindow: function (g, t, par, S) { var ext = S.ext, span = ext.r - ext.l + 300;
      for (var c = 0; c < 5; c++) { var x = ext.l - 150 + ((hash(c + 7) * span + t * (4 + c * 1.5)) % span) - par * (2 + c); K.cloud(g, x, -120 + c * 30, 0.24 + hash(c + 1) * 0.1); }
      var jx = ext.l + ((t * 20) % (span + 400)) - 200; CO.plane(g, jx, -70, 0.8, -0.05, 'rgba(255,255,255,.9)');
      COL.birds(g, t, ext.l, ext.r, -30, 4);
      /* jeepneys and cars on the road below the towers */
      for (var j = 0; j < 4; j++) { var dir = j % 2 ? -1 : 1, span2 = ext.r - ext.l + 200, p = (t * (16 + j * 3) + j * 260) % span2, x2 = dir > 0 ? ext.l - 100 + p : ext.r + 100 - p, y2 = j % 2 ? 326 : 320, col = ['#E0456B', '#F2B233', '#3167CA', '#14A38B'][j];
        if (j < 2) { fillRR(g, x2 - 16, y2 - 9, 32, 8, 2, col); fillRR(g, x2 - 12, y2 - 13, 22, 5, 2, '#FFFFFF'); g.fillStyle = 'rgba(30,60,90,.5)'; for (var w2 = 0; w2 < 4; w2++) g.fillRect(x2 - 11 + w2 * 5, y2 - 8, 3, 3); fillRR(g, x2 + dir * 14, y2 - 12, 4, 4, 1, '#C9D3E3'); }
        else { fillRR(g, x2 - 9, y2 - 7, 18, 6, 2, col); fillRR(g, x2 - 5, y2 - 10, 10, 4, 2, 'rgba(255,255,255,.8)'); }
        fillE(g, x2 - 8, y2, 2.2, 2.2, '#2A3550'); fillE(g, x2 + 8, y2, 2.2, 2.2, '#2A3550'); } },
    paintLive: paintLive, paintFrontLive: paintFrontLive,
    paintForeLive: function (g, t, S) { K.zfore(g, t, S, FORE(), function () { CO.crew(CREW, g, t, S, 'fore'); }); CR.draw(g, t); },
    motes: false,
    glow: {
      configure: function (g) { var m = MON.cfg, y = T.benchA.y - 26 - m[2]; rr(g, m[0] - 8, y - 8, m[1] + 16, m[2] + 16, 10); },
      code: function (g) { var m = MON.code, y = T.benchA.y - 26 - m[2]; rr(g, m[0] - 8, y - 8, m[1] + 16, m[2] + 16, 10); },
      integrate: function (g) { var i = T.integ; rr(g, i.x - 8, i.y - 8, i.w + 16, i.h + 16, 12); },
      consult: function (g) { var m = MON.call, y = T.benchB.y - 26 - m[2]; rr(g, m[0] - 8, y - 8, m[1] + 16, m[2] + 16, 10); },
      modules: function (g) { var b = T.board; rr(g, b.x - 8, b.y - 8, b.w + 16, b.h + 16, 10); },
      hiring: function (g) { var h = T.hire; rr(g, h.x - 8, h.y - 8, h.w + 16, h.h + 16, 14); },
      deploy: function (g) { var a = T.benchA; rr(g, a.x + 236, a.y - 28, 46, 32, 8); },
      coffee: function (g) { var p = T.pantry; rr(g, p.x + 4, p.y - 48, 70, 84, 12); },
      clock: function (g) { var c = T.clock; rr(g, c.x - 28, c.y - 28, 56, 56, 28); },
      card: function (g) { var b = T.board, lw = (b.w - 16) / 3; rr(g, b.x + 4 + lw, b.y + 92, lw + 4, 52, 6); }
    },
    backGlow: ['integrate', 'modules', 'hiring', 'coffee', 'clock', 'card'],
    calmView: [85, -50, 780, 624],
    cast: [
      /* configures Odoo: types, clicks through the settings, drinks from his tumbler, nods to the music; a tap spins his chair or switches the apps on */
      { id: 'dev1', behind: true, keys: ['configure'], P: DEV1, act: function (P, t, S) { var st = S.cast.dev1, tp = COL.tap(st, t), busy = S.hot === 'configure', c = (t + 1) % 10, k2 = Math.abs(Math.sin(t * (busy ? 14 : 6))) * 6;
        COL.reset(P); P.talk = t < st.until; P.mood = P.talk || busy ? 'happy' : 'calm'; var hands = [[-60, -196 - k2], [70, -196 - (6 - k2)]], look = 0.5;
        if (!busy) { if (c > 5 && c < 6.5) { hands = [[-60, -196], [104 + Math.sin(t * 10) * 2, -200]]; look = 0.7; } else if (c > 6.5 && c < 8) { hands = [[-60, -196], [30, -330]]; look = 0.1; } else if (c > 8) { P.tilt = Math.sin(t * 6) * 0.06; P.mood = 'happy'; } }
        if (tp.n && tp.e < 1.8) { var u = tp.e / 1.8; P.talk = true; P.mood = 'happy'; PH.d1 = tp.n ? t - tp.e : -9;
          if (tp.n % 2) { var v = clamp(u / 0.7, 0, 1); P.sx = Math.cos(COL.ease(v) * Math.PI * 2); P.hop = COL.bell(v) * 14; hands = [[-110, -262], [110, -262]]; if (PH.s1 !== tp.n) { PH.s1 = tp.n; CR.burst('code', P.x, P.y - 230, t); } }
          else { hands = [[-60, -196], [104, -206 - Math.abs(Math.sin(u * 30)) * 8]]; look = 0.8; if (PH.t1 !== tp.n) { PH.t1 = tp.n; PH.toggles = t; } } }
        P.hands = hands; P.look = lerp(P.look, t < st.until && !(tp.e < 1.8) ? clamp((S.nexi.x - P.x) / 160, -1, 1) : look, 0.1); } },
      /* writes the custom module: typing bursts, a think, a squeeze of the rubber duck; a tap squeaks the duck or throws a paper ball at the bin */
      { id: 'dev2', behind: true, keys: ['code', 'modules'], P: DEV2, act: function (P, t, S) { var st = S.cast.dev2, tp = COL.tap(st, t), busy = S.hot === 'code', c = (t + 4) % 9, burst = (Math.sin(t * 0.9) > -0.2), k2 = Math.abs(Math.sin(t * (busy ? 16 : burst ? 12 : 3) + 1)) * 6;
        COL.reset(P); P.talk = t < st.until; P.mood = P.talk || busy ? 'happy' : 'calm'; var hands = [[-70, -196 - k2], [60, -196 - (6 - k2)]], look = -0.5;
        if (!busy) { if (c > 5 && c < 6.8) { hands = [[-30, -322], [60, -196]]; look = -0.2; P.tilt = -0.06; } else if (c > 6.8 && c < 7.8) { hands = [[-70, -196], [96, -204]]; look = 0.6; } }
        if (tp.n && tp.e < 1.6) { var u = tp.e / 1.6; P.talk = true; P.mood = 'happy';
          if (tp.n % 2) { hands = [[-70, -196], [100, -210]]; look = 0.7; P.hop = COL.bell(u) * 8; if (PH.dk !== tp.n) { PH.dk = tp.n; PH.duck = t; CR.burst('note', T.benchA.x + 358, T.benchA.y - 30, t); } }
          else { var thr = clamp(u / 0.3, 0, 1); hands = u < 0.3 ? [[-70, -196], [lerp(60, 20, thr), lerp(-196, -320, thr)]] : [[-70, -196], [120, -300]]; look = 0.9; if (u > 0.3 && PH.bb !== tp.n) { PH.bb = tp.n; PH.ball = t; } } }
        P.hands = hands; P.look = lerp(P.look, t < st.until && !(tp.e < 1.6) ? clamp((S.nexi.x - P.x) / 160, -1, 1) : look, 0.1); } },
      /* the consultant on a client call: talks with her hands, listens and nods, writes a note; a tap waves at the call or notes the next step */
      { id: 'con', behind: true, keys: ['consult'], P: CON, act: function (P, t, S) { var st = S.cast.con, tp = COL.tap(st, t), busy = S.hot === 'consult', c = (t + 2) % 9;
        COL.reset(P); P.talk = t < st.until || busy || c < 3.5; P.mood = P.talk ? 'happy' : 'calm'; var hands, look = 0.6;
        if (busy || c < 3.5) hands = [[-60, -196], [100 + Math.sin(t * 4) * 14, -262 + Math.sin(t * 3) * 14]];
        else if (c < 6) { hands = [[-60, -196], [70, -196]]; P.tilt = Math.sin(t * 5) * 0.05; }
        else { hands = [[-60, -196], [40 + Math.sin(t * 7) * 6, -200]]; look = 0.1; }
        if (tp.n && tp.e < 1.8) { var u = tp.e / 1.8; P.talk = true; P.mood = 'happy';
          if (tp.n % 2) { hands = [[-60, -196], [118 + Math.sin(t * 13) * 14, -400]]; look = 0.7; if (PH.w !== tp.n) { PH.w = tp.n; PH.wave = t; } }
          else { hands = [[-60, -196], [40, -206]]; look = 0; P.hop = COL.bell(u) * 6; if (PH.nn !== tp.n) { PH.nn = tp.n; PH.note = t; CR.burst('spark', P.x, P.y - 230, t); } } }
        P.hands = hands; P.look = lerp(P.look, t < st.until && !(tp.e < 1.8) ? clamp((S.nexi.x - P.x) / 160, -1, 1) : look, 0.1); } },
      /* the solutions architect: moves a card on the board, steps back with arms folded, points up at the pipeline; a tap pins a new card or ships one to DONE */
      { id: 'arc', behind: true, keys: ['modules'], P: ARC, act: function (P, t, S) { var st = S.cast.arc, tp = COL.tap(st, t), busy = S.hot === 'modules', c = (t + 3) % 12, hands, look;
        COL.reset(P); P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm';
        if (busy) { hands = [[-150 + Math.sin(t * 3) * 14, -330], [70, -150]]; look = -0.7; }
        else if (c > 1.6 && c < 4.2) { var m = COL.ease((c - 2) / 2); hands = [[lerp(-170, -150, m), lerp(-320, -280, m)], [70, -150]]; look = -0.8; }
        else if (c > 6 && c < 8.5) { hands = [[-80, -170], [80, -420]]; look = -0.4; P.talk = true; }
        else if (c > 8.5) { hands = [[36, -206], [-32, -218]]; look = 0.2; P.mood = 'happy'; }
        else { hands = [[-120, -290], [70, -150]]; look = -0.6; }
        if (tp.n && tp.e < 1.8) { var u = tp.e / 1.8; P.talk = true; P.mood = 'happy';
          if (tp.n % 2) { var r = COL.ease(clamp(u / 0.4, 0, 1)); hands = [[lerp(-80, -170, r), lerp(-170, -280, r)], [70, -150]]; look = -0.9; if (PH.nc !== tp.n && u > 0.35) { PH.nc = tp.n; PH.newCard = t; CR.burst('star', T.board.x + 30, T.board.y + 150, t); } }
          else { var pump = Math.abs(Math.sin(u * Math.PI * 3)); hands = [[-80, -170], [96, -380 - pump * 40]]; P.hop = pump * 10; look = 0.2; if (PH.sp !== tp.n) { PH.sp = tp.n; PH.ship = t; CR.burst('conf', P.x, P.y - 260, t); } } }
        P.hands = hands; P.look = lerp(P.look, look, K.ease(0.1)); } }
    ],
    toy: function (name, S, t, btn) {
      if (name === 'clock' && btn) btn.setAttribute('data-say', CO.timeLine(8, 'Taguig City', 'the same time as Singapore. Ho Chi Minh City is an hour behind.'));
      if (name === 'card') PH.card = t;
      if (name === 'deploy') CR.burst('conf', T.benchA.x + 259, T.benchA.y - 30, t);
    },
    hit: function (x, y, S, t) { var r = CR.hitWalker(x, y, t); if (r) return r; return COL.hit(XS, x, y, t); },
    onStop: function (key, S, t) { if (key === 'configure') S.cT = t; if (key === 'modules') S.mT = t; if (key === 'integrate') S.iT = t; }
  };
})(window.IXW && window.IXW.kit, window.CR, window.CO, window.COL);
