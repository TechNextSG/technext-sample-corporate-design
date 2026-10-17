/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: crm-dev (/odoo/crm-development) — "The Pipeline Relay": a CRM shaped around how the client sells, told as a relay in a
   bright daytime stadium. Every lead is a runner: it jogs in from one of four lead sources (web, email, WhatsApp, social: the
   START board lights its panel), is routed to a team (its SG / PH chip) and scored (its stars), then runs the track past the
   stage lines, New, Qualified, Proposition, to the WON finish; there it hands the baton to the Odoo Sales desk, whose screen
   fills the quotation with nothing re-typed. The jumbotron above the stand is the CRM pipeline and mirrors the track live.
   The cast: the TechNext consultant starts each lead with a flag (tap: a megaphone call), the lead router at the officials'
   table sips coffee between routings (tap: a judge's ★★★ scorecard), the commentator talks into his headset (tap: a chair spin
   and WhatsApp bubbles), the coach paces with a stopwatch and claps every win (tap: the whistle and a fist pump), the Sales
   desk stamps quotations (tap: the quotation held high, SENT). The crowd does the wave; the blimp, the birds and the flags drift.
   Tap anyone, a runner, the crowd, the START board, the jumbotron, the finish, the quotation or the last-lap bell. */
(function (K, CR, CO) {
  'use strict';
  if (!K || !CR || !CO) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed, limb = K.limb;
  var F = 470, MINT = '#21B799', MINT_D = '#127A64', PUR = '#714B67', GOLD = '#E9B949', INK = '#1B1F3B', NAVY = '#14304A', ORANGE = '#F08A24';
  var ROOF = -100, ST_T = -84, ROWS = 11, ST_B = 125, LED_T = 140, LED_B = 160, TR_T = 162, CURB = 238, GRASS = 246;
  var LANES = [162, 175, 190, 207, 226, 238], RUN_Y = [184, 201, 220], RUN_S = [0.118, 0.128, 0.138];
  var PB = { x: 334, y: -146, w: 428, h: 210 }, BRD = { x: 150, y: 4, w: 168 }, FIN = { x: 800, far: 793 }, CLK = { x: 752, y: 6, w: 96, h: 50 };
  var MONS = [421, 477], BELL = { x: 776, y: 110 }, BOOTH = { x: 846, y: 64, w: 154 }, QT = { x: 860, y: 104, w: 128, h: 100 }, DESK = { x: 318, y: 392, w: 300 };
  var X_START = 190, X_Q = 395, X_P = 590, X_WON = 800, X_SALE = 846;
  var STAGES = ['New', 'Qualified', 'Proposition', 'Won'];
  var SOURCES = [['Web', '#3167CA'], ['Email', '#E0456B'], ['WhatsApp', '#25D366'], ['Social', '#7B5CD6']];
  var DEALS = [
    { name: 'Scanners for 3 outlets', src: 0, stars: 3, rep: 'SG' }, { name: 'Support renewal', src: 2, stars: 2, rep: 'PH' }, { name: 'Warehouse roll-out', src: 1, stars: 3, rep: 'SG' },
    { name: 'Training for 12 users', src: 3, stars: 2, rep: 'PH' }, { name: 'POS for 2 cafés', src: 0, stars: 3, rep: 'SG' }, { name: 'Label printers', src: 2, stars: 1, rep: 'PH' }];
  var SEATS = ['#7FD3BC', '#6CCAB0', '#8FDAC5'], SHIRTS = ['#8FB2EA', '#F7B877', '#F29AAE', '#FFE07A', '#7FD3BC', '#B7A3E8', '#FFFFFF', '#A9DCF5', '#FFC2CF'];
  function setU(g, sx, sy, k) { g.translate(sx, sy); g.scale(k, k); }
  function extOf(W, H, k, sx, sy) { return { l: -(sx + 24) / k, r: (W - sx) / k, t: -(sy + 24) / k, b: (H - sy) / k }; }
  function colX(i) { return PB.x + 8 + i * 104; }
  function star(g, x, y, r, col) { g.fillStyle = col; g.beginPath(); for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, rad = i % 2 ? r * 0.45 : r; g.lineTo(x + Math.cos(a) * rad, y + Math.sin(a) * rad); } g.closePath(); g.fill(); }
  function smooth(u) { return u * u * (3 - 2 * u); }
  function tone(c) { return K.tone(c, 0.25); }

  /* ---------------- the relay: one deal per runner, a 21 s lap ---------------- */
  var CYC = 21, KF = [[0, 116, 0.6], [0.05, X_START, 0], [0.10, X_START, 1], [0.30, X_Q, 0.25], [0.36, X_Q + 4, 1], [0.55, X_P, 0.25], [0.61, X_P + 4, 1], [0.79, 826, 0.5], [0.86, X_SALE, 0], [1, X_SALE, 0]];
  var U_HAND = 0.88, U_IN = 0.05, U_WIN = (function () { var lo = 0.61, hi = 0.79; for (var q = 0; q < 30; q++) { var m = (lo + hi) / 2; if (lerp(X_P + 4, 826, smooth((m - 0.61) / 0.18)) < X_WON) lo = m; else hi = m; } return lo; })();
  function lap(i, t) {
    var tt = t + i * 7 + 3, n = Math.floor(tt / CYC), u = (tt - n * CYC) / CYC, x = KF[0][1], run = 0;
    for (var j = 0; j < KF.length - 1; j++) { var a = KF[j], b = KF[j + 1]; if (u >= a[0] && u < b[0]) { var f = (u - a[0]) / (b[0] - a[0]); x = lerp(a[1], b[1], a[2] > 0.9 ? smooth(f) : f); run = a[2]; break; } }
    var stage = x < X_Q ? 0 : x < X_P ? 1 : x < X_WON ? 2 : 3, al = u < 0.03 ? u / 0.03 : u > 0.93 ? Math.max(0, (1 - u) / 0.07) : 1;
    return { i: i, u: u, n: n, x: x, run: run, stage: stage, a: al, y: RUN_Y[i], deal: DEALS[(n * 3 + i) % DEALS.length], t0: t - u * CYC };
  }
  /* the latest moment (<= t) any runner passed lap fraction uf */
  function lastEvent(t, uf) { var best = -99; for (var i = 0; i < 3; i++) { var L = lap(i, t), te = L.t0 + uf * CYC; if (te > t) te -= CYC; if (te > best) best = te; } return best; }

  /* ---------------- the people ---------------- */
  var W = CR.who;
  var TN = W({ x: 282, y: 470, s: 0.46, ph: 0.4, skin: 1, hair: 0, style: 'short', outfit: 'polo', top: '#3167CA', hold: 'clipboard', hands: [[-70, -200], [70, -160]], look: 0.6 });
  var REP1 = W({ x: 372, y: 470, s: 0.46, ph: 0.9, skin: 0, hair: 1, style: 'bob', outfit: 'cardigan', top: MINT, top2: '#FFFFFF', sit: true, chairCol: '#2A3550', id: '#9AA6BC', hands: [[-60, -206], [60, -206]], look: 0.4 });
  var REP2 = W({ x: 572, y: 470, s: 0.46, ph: 1.8, skin: 2, hair: 0, style: 'short', outfit: 'shirt', top: ORANGE, headset: '#1B2350', sit: true, chairCol: '#2A3550', id: '#9AA6BC', hands: [[-60, -206], [60, -206]], look: -0.4 });
  var MGR = W({ x: 690, y: 470, s: 0.47, ph: 2.6, skin: 3, hair: 2, style: 'short', outfit: 'polo', top: '#1E3A6E', top2: GOLD, id: '#9AA6BC', glasses: true, hands: [[-70, -170], [70, -170]], look: -0.4 });
  var SAL = W({ x: 922, y: 470, s: 0.46, ph: 3.3, skin: 1, hair: 1, style: 'pony', outfit: 'shirt', top: PUR, id: '#9AA6BC', clip: '#E9B949', hands: [[-70, -210], [70, -230]], look: -0.5 });
  var ROOKIE = W({ x: -224, y: 470, s: 0.47, ph: 1.4, skin: 0, hair: 2, style: 'short', outfit: 'tee', top: '#FFD84A', id: '#9AA6BC', hands: [[-70, -170], [70, -170]], look: 0.4 });
  /* the runners: the client's sales people carrying each deal (grey passes); drawn small, far across the track */
  var RUN = [0, 1, 2].map(function (i) { var P = W({ s: 0.2, ph: i * 1.7, skin: [0, 2, 1][i], hair: i, style: ['pony', 'short', 'bob'][i], outfit: 'tee', top: ['#FFFFFF', '#FFD84A', '#5BC4A6'][i], id: '#9AA6BC' }); P.print = null; return P; });
  var CREW = [
    { x0: 160, x1: 830, y: 262, spd: 16, ph: 0.2, label: 'TechNext trainer', lines: ['Each stage has the fields it needs to **move forward**.', 'Your team learns the pipeline on **real data**.'], acts: ['wave', 'nod', 'id'],
      P: W({ s: 0.25, skin: 4, hair: 1, style: 'long', outfit: 'cardigan', top: '#FF8FA3', top2: '#FFFFFF', hold: 'tablet' }) },
    { x0: 1010, x1: 1290, y: 492, spd: 14, ph: 0.5, label: 'TechNext developer', lines: ['Fresh batons: routing rules send each lead to the **right rep**.', 'Scoring tuned to how **your** deals close.'], acts: ['cheer', 'id', 'wave'],
      P: W({ s: 0.52, skin: 0, hair: 0, style: 'short', outfit: 'shirt', top: '#3167CA', hold: 'box' }) },
    { front: true, x0: 1060, x1: 1300, y: 690, spd: 18, ph: 0.7, label: 'TechNext consultant', lines: ['Won on the track, quotation at the desk. **No re-typing**.', 'Walk us through your **last ten deals**.'], acts: ['nod', 'id', 'wave'],
      P: W({ s: 0.58, skin: 2, hair: 1, style: 'pony', outfit: 'polo', top: PUR, clip: '#FFD84A', hold: 'clipboard' }) },
    { x0: -900, x1: 120, y: 492, spd: 15, ph: 0.3, label: 'TechNext trainer', lines: ['Warm-up first: the team runs the pipeline in **training**.'], acts: ['wave', 'id'],
      P: W({ s: 0.52, skin: 1, hair: 1, style: 'bun', outfit: 'cardigan', top: '#14A38B', top2: '#FFFFFF', hold: 'mat' }) }
  ];
  CREW[0].P.fixS = true;

  /* the hand of a cast member in set units (the engine's own arm maths), so props can be drawn in it */
  function handAt(P, side) {
    var F3 = K.F3, d = side ? 1 : -1, h = P.hands[side], sxk = P.sx == null ? 1 : P.sx, bw = P.build || 1;
    var r = K.ik(d * F3.shx * bw, F3.shy, h[0], h[1], F3.a, F3.b, d).h, dy = -(P.hop || 0) + (P.sit ? (P.sitDrop != null ? P.sitDrop : 46) : 0);
    return [P.x + r[0] * P.s * sxk, P.y + (r[1] + dy) * P.s];
  }
  function mouthAt(P) { var dy = -(P.hop || 0) + (P.sit ? (P.sitDrop != null ? P.sitDrop : 46) : 0); return [P.x + P.look * 9 * P.s, P.y + (K.F3.hy + 46 + dy) * P.s]; }

  /* ---------------- the static layers ---------------- */
  function paintBg(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    var sg = g.createLinearGradient(0, e.t, 0, 240); sg.addColorStop(0, '#7CC4F2'); sg.addColorStop(0.55, '#B9E1FA'); sg.addColorStop(1, '#E6F5FD'); g.fillStyle = sg; g.fillRect(e.l, e.t, e.r - e.l, 300 - e.t);
    var gl = g.createRadialGradient(1050, -200, 10, 1050, -200, 420); gl.addColorStop(0, 'rgba(255,248,214,.9)'); gl.addColorStop(0.25, 'rgba(255,244,200,.35)'); gl.addColorStop(1, 'rgba(255,244,200,0)'); g.fillStyle = gl; g.fillRect(e.l, e.t, e.r - e.l, 400);
    fillE(g, 1050, -200, 26, 26, '#FFF6D0');
    g.restore();
  }
  function blocked(x, y) { /* stand cells hidden behind a structure (so the wave never paints over one) */
    if (x > PB.x - 16 && x < PB.x + PB.w + 16) return true;
    if (x > BRD.x - 8 && x < BRD.x + BRD.w + 8 && y > BRD.y - 20) return true;
    if (x > CLK.x - 8 && x < CLK.x + CLK.w + 8 && y > CLK.y - 20) return true;
    if (x > BOOTH.x - 10 && x < BOOTH.x + BOOTH.w + 10 && y > BOOTH.y - 24) return true;
    for (var i = 0; i < TOWERS.length; i++) if (Math.abs(x - TOWERS[i]) < 22) return true;
    return false;
  }
  var TOWERS = [-540, 1110], MASTS = [];
  function cellOf(c, r) { return { x: c * 14 + 7, yT: ST_T + r * 19 }; }
  function isAisle(c) { return ((c % 19) + 19) % 19 === 0; }
  function fan(g, x, yb, c, r, lift, arms) {
    var h = hash(c * 3.1 + r * 7.7), sk = CR.skin[Math.floor(hash(c + r * 13) * 5)], sh = SHIRTS[Math.floor(hash(c * 1.3 + r) * SHIRTS.length)];
    if (arms) { limb(g, [[x - 3.5, yb - 8 - lift], [x - 6, yb - 19 - lift]], 2.4, sk); limb(g, [[x + 3.5, yb - 8 - lift], [x + 6, yb - 19 - lift]], 2.4, sk); }
    fillRR(g, x - 4.5, yb - 10 - lift, 9, 10, 4, sh); fillE(g, x, yb - 14 - lift, 3.8, 3.8, sk); fillE(g, x, yb - 16 - lift, 3.9, 2.3, CR.hair[Math.floor(h * 4)]);
  }
  function seatCell(g, c, r, lift, arms) {
    var x = c * 14 + 7, yT = ST_T + r * 19, yb = yT + 13;
    g.fillStyle = r % 2 ? '#EDF2F6' : '#F4F7FA'; g.fillRect(x - 7, yT, 14, 19); g.fillStyle = '#DCE4EC'; g.fillRect(x - 7, yT + 17, 14, 2);
    fillRR(g, x - 5, yb - 5, 10, 8, 2, SEATS[((Math.floor(c / 19) % 3) + 3) % 3]);
    if (hash(c * 0.71 + r * 3.3) > 0.24) fan(g, x, yb, c, r, lift, arms);
  }
  function haze(g, x0, w, r) { g.fillStyle = 'rgba(244,250,253,' + (0.12 + 0.3 * (1 - r / ROWS)).toFixed(3) + ')'; g.fillRect(x0, ST_T + r * 19, w, 19); }
  function paintFrame(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    /* the roof masts, their cables and the cantilever roof */
    MASTS = []; for (var mx = Math.floor((e.l - 200) / 330) * 330 + 120; mx < e.r + 200; mx += 330) MASTS.push(mx);
    g.strokeStyle = 'rgba(120,140,170,.55)'; g.lineWidth = 1.4; g.beginPath(); MASTS.forEach(function (m) { [-160, -80, 80, 160].forEach(function (d) { g.moveTo(m, -196); g.lineTo(m + d, ROOF); }); }); g.stroke();
    MASTS.forEach(function (m) { fillRR(g, m - 3, -204, 6, 110, 3, '#C9D3E0'); fillE(g, m, -206, 5, 5, '#E0456B'); });
    fillRR(g, e.l, ROOF - 4, e.r - e.l, 14, 0, '#FFFFFF'); g.fillStyle = '#E2E8F0'; g.fillRect(e.l, ROOF + 10, e.r - e.l, 8);
    g.strokeStyle = '#D3DBE6'; g.lineWidth = 1.5; g.beginPath(); for (var tx = Math.floor(e.l / 24) * 24; tx < e.r; tx += 24) { g.moveTo(tx, ROOF + 10); g.lineTo(tx + 12, ROOF + 18); g.lineTo(tx + 24, ROOF + 10); } g.stroke();
    /* the seats and the crowd */
    var c0 = Math.floor(e.l / 14) - 1, c1 = Math.ceil(e.r / 14) + 1;
    for (var r = 0; r < ROWS; r++) for (var c = c0; c < c1; c++) {
      var x = c * 14 + 7, yT = ST_T + r * 19;
      if (isAisle(c)) { g.fillStyle = '#DDE5ED'; g.fillRect(x - 7, yT, 14, 19); g.fillStyle = '#C9D3DE'; g.fillRect(x - 7, yT + 9, 14, 2); g.fillRect(x - 7, yT + 17, 14, 2); continue; }
      seatCell(g, c, r, 0, false);
    }
    /* placards in the crowd */
    [[16, 3, '★★★'], [64, 7, 'WON!'], [-8, 5, 'GO!'], [71, 2, '★★★'], [-30, 8, 'WON!'], [86, 9, 'GO!'], [5, 9, 'WON!']].forEach(function (p) { var cl = cellOf(p[0], p[1]); if (blocked(cl.x, cl.yT)) return;
      fillRR(g, cl.x - 15, cl.yT - 14, 30, 15, 2, '#FFFFFF'); g.strokeStyle = '#1B1F3B'; g.lineWidth = 1; rr(g, cl.x - 15, cl.yT - 14, 30, 15, 2); g.stroke(); text(g, p[2], cl.x, cl.yT - 3.5, 8, 800, p[2] === 'WON!' ? MINT_D : p[2] === 'GO!' ? '#E0456B' : GOLD, 'center'); });
    for (var hr = 0; hr < ROWS; hr++) haze(g, e.l, e.r - e.l, hr);
    var shd = g.createLinearGradient(0, ST_T, 0, ST_T + 70); shd.addColorStop(0, 'rgba(30,60,100,.16)'); shd.addColorStop(1, 'rgba(30,60,100,0)'); g.fillStyle = shd; g.fillRect(e.l, ST_T, e.r - e.l, 70);
    /* the stand's front wall, its railing and section letters, the LED board */
    g.fillStyle = '#FFFFFF'; g.fillRect(e.l, ST_B, e.r - e.l, LED_T - ST_B); g.fillStyle = '#E3E9F0'; g.fillRect(e.l, LED_T - 4, e.r - e.l, 4);
    g.strokeStyle = '#AFC0D2'; g.lineWidth = 2; g.beginPath(); g.moveTo(e.l, ST_B - 4); g.lineTo(e.r, ST_B - 4); g.stroke(); g.lineWidth = 1.2; g.beginPath(); for (var px = Math.floor(e.l / 18) * 18; px < e.r; px += 18) { g.moveTo(px, ST_B - 4); g.lineTo(px, ST_B + 2); } g.stroke();
    for (var sc = Math.floor(e.l / 266) * 266; sc < e.r; sc += 266) { var lt = String.fromCharCode(65 + ((Math.round(sc / 266) % 8) + 8) % 8); fillRR(g, sc + 120, ST_B + 4, 20, 14, 3, MINT); text(g, lt, sc + 130, ST_B + 15, 9, 800, '#FFFFFF', 'center'); }
    fillRR(g, e.l, LED_T, e.r - e.l, LED_B - LED_T, 0, NAVY); g.fillStyle = 'rgba(255,255,255,.06)'; g.fillRect(e.l, LED_T + 2, e.r - e.l, 6);
    /* the track: five lanes, the start line, the stage lines and the checkered finish */
    var tg = g.createLinearGradient(0, TR_T, 0, CURB); tg.addColorStop(0, '#EE9478'); tg.addColorStop(1, '#E06A50'); g.fillStyle = tg; g.fillRect(e.l, TR_T, e.r - e.l, CURB - TR_T);
    g.fillStyle = 'rgba(255,255,255,.9)'; LANES.forEach(function (ly, i) { g.fillRect(e.l, ly - (i ? 1 : 0), e.r - e.l, 1.4 + i * 0.35); });
    [1, 2, 3, 4, 5].forEach(function (n, i) { var y = (LANES[i] + LANES[i + 1]) / 2 + 3; text(g, String(n), X_START - 24, y, 6 + i * 1.1, 800, 'rgba(255,255,255,.85)', 'center'); });
    function line(x, dash) { g.save(); g.strokeStyle = 'rgba(255,255,255,.95)'; g.lineWidth = 2.4; if (dash) g.setLineDash([6, 5]); g.beginPath(); g.moveTo(x - 4, TR_T); g.lineTo(x + 4, CURB); g.stroke(); g.restore(); }
    line(X_START, false); line(X_Q, true); line(X_P, true);
    text(g, 'START', X_START + 24, 172, 6.6, 800, 'rgba(255,255,255,.92)', 'center'); text(g, 'QUALIFIED', X_Q + 34, 172, 6.6, 800, 'rgba(255,255,255,.92)', 'center'); text(g, 'PROPOSITION', X_P + 40, 172, 6.6, 800, 'rgba(255,255,255,.92)', 'center');
    for (var fy = TR_T; fy < CURB; fy += 6) for (var fc = 0; fc < 2; fc++) { var xx = lerp(X_WON - 4, X_WON + 4, (fy - TR_T) / (CURB - TR_T)) + fc * 6 - 6; g.fillStyle = ((Math.round((fy - TR_T) / 6) + fc) % 2) ? '#1B1F3B' : '#FFFFFF'; g.fillRect(xx, fy, 6, 6); }
    /* the kerb and the infield grass, mown in stripes */
    g.fillStyle = '#FFFFFF'; g.fillRect(e.l, CURB, e.r - e.l, 5); g.fillStyle = '#C9D3DE'; g.fillRect(e.l, CURB + 5, e.r - e.l, 3);
    var gg = g.createLinearGradient(0, GRASS, 0, e.b); gg.addColorStop(0, '#B4E39C'); gg.addColorStop(0.4, '#A2DA8B'); gg.addColorStop(1, '#86CC72'); g.fillStyle = gg; g.fillRect(e.l, GRASS, e.r - e.l, e.b - GRASS);
    g.fillStyle = 'rgba(255,255,255,.14)'; for (var gs = Math.floor((e.l - 900) / 90) * 90; gs < e.r + 900; gs += 180) { g.beginPath(); g.moveTo(gs, GRASS); g.lineTo(gs + 90, GRASS); g.lineTo(gs + 90 + (gs + 90 - 560) * 1.6, e.b); g.lineTo(gs + (gs - 560) * 1.6, e.b); g.closePath(); g.fill(); }
    g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 2.5; g.beginPath(); g.ellipse(560, 330, 260, 46, 0, 0, Math.PI * 2); g.stroke(); g.beginPath(); g.moveTo(e.l, 300); g.lineTo(e.r, 300); g.stroke();
    var gsh = g.createLinearGradient(0, GRASS, 0, GRASS + 30); gsh.addColorStop(0, 'rgba(30,70,40,.14)'); gsh.addColorStop(1, 'rgba(30,70,40,0)'); g.fillStyle = gsh; g.fillRect(e.l, GRASS, e.r - e.l, 30);
    var fsh = g.createLinearGradient(0, F - 10, 0, F + 30); fsh.addColorStop(0, 'rgba(30,70,40,0)'); fsh.addColorStop(0.3, 'rgba(30,70,40,.07)'); fsh.addColorStop(1, 'rgba(30,70,40,0)'); g.fillStyle = fsh; g.fillRect(e.l, F - 10, e.r - e.l, 40);
    g.restore();
  }
  function tower(g, x) { /* a floodlight tower (daytime: lamps off) */
    g.fillStyle = '#C3CEDB'; g.fillRect(x - 5, -230, 10, ST_B + 230); g.strokeStyle = '#AFBCCB'; g.lineWidth = 1.5; g.beginPath(); for (var y = -220; y < ST_B; y += 24) { g.moveTo(x - 5, y); g.lineTo(x + 5, y + 12); g.lineTo(x - 5, y + 24); } g.stroke();
    fillRR(g, x - 40, -270, 80, 46, 5, '#9AAABC'); for (var i = 0; i < 4; i++) for (var j = 0; j < 2; j++) fillRR(g, x - 36 + i * 19, -266 + j * 21, 16, 17, 3, '#EEF3F8');
  }
  function paintBack(g, ext) {
    TOWERS.forEach(function (x) { if (x > ext.l - 60 && x < ext.r + 60) tower(g, x); });
    /* the jumbotron: the CRM pipeline, on two pylons, speakers either side */
    [PB.x + 90, PB.x + PB.w - 90].forEach(function (x) { fillRR(g, x - 8, PB.y + PB.h, 16, LED_T - PB.y - PB.h, 3, '#8A97A8'); g.fillStyle = 'rgba(255,255,255,.25)'; g.fillRect(x - 6, PB.y + PB.h, 3, LED_T - PB.y - PB.h); });
    g.strokeStyle = '#8A97A8'; g.lineWidth = 3; g.beginPath(); g.moveTo(PB.x + 90, PB.y + PB.h + 12); g.lineTo(PB.x + PB.w - 90, LED_T - 8); g.moveTo(PB.x + PB.w - 90, PB.y + PB.h + 12); g.lineTo(PB.x + 90, LED_T - 8); g.stroke();
    [PB.x - 30, PB.x + PB.w + 12].forEach(function (x) { fillRR(g, x, PB.y + 20, 18, 64, 4, '#2A3142'); for (var s = 0; s < 3; s++) { fillE(g, x + 9, PB.y + 32 + s * 20, 6, 6, '#4A5468'); fillE(g, x + 9, PB.y + 32 + s * 20, 2.5, 2.5, '#2A3142'); } });
    shadowed(g, 18, 6, 0.25, function () { fillRR(g, PB.x - 10, PB.y - 10, PB.w + 20, PB.h + 20, 14, '#2A3142'); });
    fillRR(g, PB.x, PB.y, PB.w, PB.h, 6, '#FFFFFF'); fillRR(g, PB.x, PB.y, PB.w, 26, 6, MINT); g.fillRect(PB.x, PB.y + 16, PB.w, 10);
    CO.plane(g, PB.x + 18, PB.y + 13, 0.7, 0, '#FFFFFF'); text(g, 'CRM · PIPELINE', PB.x + 30, PB.y + 17.5, 10, 800, '#FFFFFF');
    STAGES.forEach(function (c, i) { var x = colX(i); fillRR(g, x, PB.y + 32, 98, PB.h - 38, 7, i === 3 ? '#E9F8F2' : '#F5F7FA'); });
    /* the START board: four lead sources, hung on two posts in front of the stand */
    [BRD.x + 8, BRD.x + BRD.w - 8].forEach(function (x) { fillRR(g, x - 4, BRD.y, 8, LED_T - BRD.y, 3, '#9AA6BC'); g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(x - 3, BRD.y, 2, LED_T - BRD.y); });
    shadowed(g, 12, 4, 0.18, function () { fillRR(g, BRD.x - 4, BRD.y, BRD.w + 8, 132, 10, '#FFFFFF'); });
    fillRR(g, BRD.x - 4, BRD.y, BRD.w + 8, 22, 10, NAVY); g.fillRect(BRD.x - 4, BRD.y + 12, BRD.w + 8, 10); text(g, 'START · LEADS FROM', BRD.x + BRD.w / 2, BRD.y + 15, 8.4, 800, '#FFFFFF', 'center');
    /* the finish: the race clock on its post, the WON banner, the far post, the last-lap bell on a bracket */
    fillRR(g, FIN.far - 2, CLK.y + CLK.h, 4, TR_T + 4 - CLK.y - CLK.h, 2, '#C9D3DE'); soft(g, FIN.x, CURB + 4, 14, 3, 0.25); fillRR(g, FIN.x - 4, CLK.y + CLK.h, 8, CURB + 4 - CLK.y - CLK.h, 3, '#FFFFFF');
    g.fillStyle = '#1B1F3B'; for (var cy = CLK.y + CLK.h + 26; cy < CURB; cy += 14) g.fillRect(FIN.x - 4, cy, 8, 7);
    shadowed(g, 12, 4, 0.2, function () { fillRR(g, CLK.x, CLK.y, CLK.w, CLK.h, 8, '#2A3142'); }); fillRR(g, CLK.x + 6, CLK.y + 6, CLK.w - 12, 26, 4, '#0F1A2A');
    text(g, 'RACE CLOCK', CLK.x + CLK.w / 2, CLK.y + CLK.h - 7, 6.4, 800, '#9AA6BC', 'center');
    fillRR(g, CLK.x - 6, CLK.y + CLK.h - 2, CLK.w + 12, 22, 5, '#2BC48A'); for (var ck = 0; ck < 12; ck++) { g.fillStyle = ck % 2 ? '#FFFFFF' : '#1B1F3B'; g.fillRect(CLK.x - 2 + ck * 8.67, CLK.y + CLK.h + 15, 8.67, 4); }
    text(g, 'FINISH · WON', CLK.x + CLK.w / 2, CLK.y + CLK.h + 12, 8.6, 800, '#FFFFFF', 'center');
    g.strokeStyle = '#7A869C'; g.lineWidth = 3; g.beginPath(); g.moveTo(FIN.x - 4, BELL.y - 30); g.lineTo(BELL.x, BELL.y - 30); g.lineTo(BELL.x, BELL.y - 22); g.stroke();
    /* a rack of relay batons by the finish, one per lead source */
    soft(g, 752, F + 2, 30, 5, 0.25); fillRR(g, 724, F - 52, 56, 8, 3, '#C99A6B'); fillRR(g, 728, F - 46, 5, 46, 2, '#B5865A'); fillRR(g, 771, F - 46, 5, 46, 2, '#B5865A'); fillRR(g, 724, F - 18, 56, 6, 3, '#B5865A');
    SOURCES.forEach(function (sc, i) { fillRR(g, 733 + i * 11, F - 76, 7, 28, 3, sc[1]); fillRR(g, 733 + i * 11, F - 76, 7, 5, 2, '#FFFFFF'); });
    /* the Odoo Sales desk: a striped canopy, its back wall and the quotation screen */
    fillRR(g, BOOTH.x + 4, BOOTH.y + 30, BOOTH.w - 8, 300, 6, '#F6F0F4'); g.fillStyle = 'rgba(113,75,103,.07)'; for (var bs = 0; bs < 5; bs++) g.fillRect(BOOTH.x + 14 + bs * 28, BOOTH.y + 30, 14, 300);
    [BOOTH.x + 6, BOOTH.x + BOOTH.w - 6].forEach(function (x) { fillRR(g, x - 4, BOOTH.y + 24, 8, F - BOOTH.y - 24, 3, '#B9A3B4'); });
    for (var st = 0; st < 7; st++) fillRR(g, BOOTH.x + st * 22, BOOTH.y, 22, 30, st === 0 || st === 6 ? 6 : 0, st % 2 ? '#FFFFFF' : PUR);
    for (var sc2 = 0; sc2 < 7; sc2++) { g.fillStyle = sc2 % 2 ? '#FFFFFF' : PUR; g.beginPath(); g.arc(BOOTH.x + 11 + sc2 * 22, BOOTH.y + 30, 11, 0, Math.PI); g.fill(); }
    fillRR(g, BOOTH.x + 30, BOOTH.y - 22, BOOTH.w - 60, 22, 6, '#FFFFFF'); text(g, 'ODOO SALES', BOOTH.x + BOOTH.w / 2, BOOTH.y - 7, 10, 800, PUR, 'center');
    shadowed(g, 12, 4, 0.2, function () { fillRR(g, QT.x - 6, QT.y - 6, QT.w + 12, QT.h + 12, 7, '#2A3142'); }); fillRR(g, QT.x, QT.y, QT.w, QT.h, 3, '#FFFFFF');
    fillRR(g, QT.x, QT.y, QT.w, 18, 3, PUR); g.fillRect(QT.x, QT.y + 10, QT.w, 8); text(g, 'Sales · Quotation', QT.x + 9, QT.y + 13, 7.6, 800, '#FFFFFF');
    /* the medal podium and a high-jump mat (wide screens), the warm-up corner (phones) */
    if (ext.r > 1010) { var px = 1060; soft(g, px + 60, F + 3, 90, 7, 0.25); [[0, 50, '2', '#C9D3DE'], [40, 76, '1', GOLD], [80, 34, '3', '#E5A877']].forEach(function (p) { fillRR(g, px + p[0], F - p[1], 40, p[1], 4, '#FFFFFF'); fillRR(g, px + p[0], F - p[1], 40, 8, 4, p[3]); text(g, p[2], px + p[0] + 20, F - p[1] + 28, 14, 800, INK, 'center'); });
      g.fillStyle = GOLD; g.beginPath(); g.moveTo(px + 50, F - 112); g.lineTo(px + 70, F - 112); g.lineTo(px + 66, F - 92); g.lineTo(px + 54, F - 92); g.closePath(); g.fill(); fillRR(g, px + 56, F - 92, 8, 10, 2, '#C9962E'); fillRR(g, px + 50, F - 84, 20, 8, 2, '#C9962E');
      g.strokeStyle = GOLD; g.lineWidth = 3; g.beginPath(); g.arc(px + 50, F - 104, 6, Math.PI * 0.5, Math.PI * 1.5); g.stroke(); g.beginPath(); g.arc(px + 70, F - 104, 6, -Math.PI * 0.5, Math.PI * 0.5); g.stroke();
      fillRR(g, px + 4, F - 160, 112, 24, 6, MINT); text(g, 'WON DEALS', px + 60, F - 144, 9.5, 800, '#FFFFFF', 'center'); fillRR(g, px + 58, F - 136, 4, 22, 1, '#9AA6BC');
      soft(g, 1230, 330, 70, 6, 0.2); fillRR(g, 1170, 300, 120, 30, 8, '#3167CA'); fillRR(g, 1170, 300, 120, 8, 6, '#5B8DEF'); g.fillStyle = '#FFFFFF'; g.fillRect(1176, 250, 3, 54); g.fillRect(1282, 250, 3, 54);
      for (var hj = 0; hj < 9; hj++) { g.fillStyle = hj % 2 ? '#E0456B' : '#FFFFFF'; g.fillRect(1178 + hj * 11.8, 262, 11.8, 4); } }
    if (ext.l < -560) { /* the team tent on the far-left infield (wide screens) */ var tx = -800; soft(g, tx + 110, F + 2, 130, 8, 0.25); [tx + 6, tx + 214].forEach(function (x) { fillRR(g, x - 3, 330, 6, F - 330, 2, '#9AA6BC'); });
      g.fillStyle = '#FFFFFF'; g.beginPath(); g.moveTo(tx - 10, 334); g.lineTo(tx + 40, 290); g.lineTo(tx + 180, 290); g.lineTo(tx + 230, 334); g.closePath(); g.fill(); for (var tv = 0; tv < 5; tv++) { g.fillStyle = MINT; g.beginPath(); g.moveTo(tx - 10 + tv * 48, 334); g.lineTo(tx + 40 + tv * 28, 290); g.lineTo(tx + 54 + tv * 28, 290); g.lineTo(tx + 14 + tv * 48, 334); g.closePath(); g.fill(); }
      for (var tf = 0; tf < 10; tf++) { g.fillStyle = tf % 2 ? '#FFFFFF' : MINT; g.beginPath(); g.arc(tx - 10 + 12 + tf * 24, 334, 12, 0, Math.PI); g.fill(); } fillRR(g, tx + 70, 300, 80, 18, 5, '#FFFFFF'); text(g, 'TEAM AREA', tx + 110, 313, 9, 800, MINT_D, 'center');
      fillRR(g, tx + 30, F - 46, 160, 8, 3, '#C99A6B'); fillRR(g, tx + 36, F - 38, 5, 38, 2, '#9AA6BC'); fillRR(g, tx + 180, F - 38, 5, 38, 2, '#9AA6BC'); fillRR(g, tx + 60, F - 74, 34, 28, 5, '#3167CA'); fillRR(g, tx + 60, F - 74, 34, 6, 3, '#FFFFFF'); [110, 124, 138].forEach(function (bx) { fillRR(g, tx + bx, F - 70, 9, 24, 3, '#BDE9FB'); }); }
    infield(g);
    if (ext.l < 140) { [-220, -120].forEach(function (hx) { g.fillStyle = '#FFFFFF'; g.fillRect(hx - 14, 196, 3, 28); g.fillRect(hx + 12, 200, 3, 28); for (var hb = 0; hb < 5; hb++) { g.fillStyle = hb % 2 ? '#1B1F3B' : '#FFFFFF'; g.fillRect(hx - 14 + hb * 5.8, 192, 5.8, 5); } });
      fillRR(g, -20, F - 50, 150, 10, 4, '#C99A6B'); [0, 130].forEach(function (lx) { fillRR(g, lx - 14, F - 42, 6, 42, 2, '#9AA6BC'); }); fillRR(g, 0, F - 76, 56, 28, 10, '#3167CA'); fillRR(g, 66, F - 70, 46, 22, 9, '#E0456B');
      [76, 92, 104].forEach(function (bx, i) { fillRR(g, bx - 4, F - 96 - i * 2, 9, 26, 3, i === 1 ? '#7FD3F7' : '#BDE9FB'); }); fillRR(g, -40, 300, 120, 34, 8, '#FFFFFF'); text(g, 'WARM-UP ZONE', 20, 322, 10, 800, MINT_D, 'center'); fillRR(g, 16, 334, 8, F - 334, 3, '#9AA6BC'); }
  }
  /* the infield behind the title card ("View the scene" shows it): the team dugout with kit and bottles, a long-jump pit with
     its runway, a lead-source tally board on a stand, and the rookie rep's warm-up mat */
  var DUG = { x: -536, w: 196 }, PIT = { x: -300, y: 300 }, ROOK = { x: -224 };
  function infield(g) {
    /* the long-jump runway and sand pit (flat on the grass, mid-distance) with a rake leaning on a marker */
    g.fillStyle = '#E2725A'; g.beginPath(); g.moveTo(-540, 300); g.lineTo(PIT.x, 300); g.lineTo(PIT.x, 316); g.lineTo(-540, 318); g.closePath(); g.fill(); g.fillStyle = 'rgba(255,255,255,.7)'; g.fillRect(-540, 307, PIT.x + 540, 1.6);
    fillRR(g, PIT.x - 6, 299, 6, 18, 1, '#FFFFFF'); fillRR(g, PIT.x, 294, 150, 28, 12, '#C99A6B'); fillRR(g, PIT.x + 4, 297, 142, 22, 10, '#F0D9A8'); g.fillStyle = 'rgba(160,120,70,.35)'; for (var sd = 0; sd < 9; sd++) fillE(g, PIT.x + 20 + hash(sd) * 110, 304 + hash(sd + 3) * 10, 6, 1.6, 'rgba(160,120,70,.35)');
    g.strokeStyle = '#9AA6BC'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(PIT.x + 168, 324); g.lineTo(PIT.x + 150, 262); g.stroke(); fillRR(g, PIT.x + 140, 256, 22, 5, 2, '#7A869C');
    /* the team dugout: a clear canopy over a mint back wall and a bench with bags, bottles and towels */
    var d = DUG; soft(g, d.x + d.w / 2, F + 3, d.w * 0.6, 8, 0.25); fillRR(g, d.x, 340, d.w, F - 340, 8, '#E6F7F1'); fillRR(g, d.x, 340, d.w, 10, 6, MINT);
    g.fillStyle = 'rgba(190,225,245,.55)'; g.beginPath(); g.moveTo(d.x - 10, 330); g.quadraticCurveTo(d.x + d.w / 2, 296, d.x + d.w + 10, 330); g.lineTo(d.x + d.w + 10, 340); g.lineTo(d.x - 10, 340); g.closePath(); g.fill(); g.strokeStyle = '#FFFFFF'; g.lineWidth = 2; g.stroke();
    [d.x + 4, d.x + d.w - 8].forEach(function (x) { fillRR(g, x, 330, 4, F - 330, 2, '#9AA6BC'); });
    fillRR(g, d.x + 40, 352, d.w - 80, 20, 5, '#FFFFFF'); text(g, 'TEAM · SALES', d.x + d.w / 2, 366, 9, 800, MINT_D, 'center');
    fillRR(g, d.x + 12, F - 46, d.w - 24, 10, 4, '#C99A6B'); [d.x + 22, d.x + d.w - 28].forEach(function (x) { fillRR(g, x, F - 36, 6, 36, 2, '#9AA6BC'); });
    fillRR(g, d.x + 26, F - 70, 44, 24, 9, '#3167CA'); fillRR(g, d.x + 30, F - 66, 36, 4, 2, 'rgba(255,255,255,.7)'); fillRR(g, d.x + 80, F - 58, 30, 12, 4, '#FFFFFF'); fillRR(g, d.x + 80, F - 58, 30, 4, 2, '#E0456B');
    [d.x + 122, d.x + 136, d.x + 150].forEach(function (bx, i) { fillRR(g, bx - 4, F - 72 - i, 9, 26 + i, 3, ['#BDE9FB', '#7FD3F7', '#BDE9FB'][i]); fillRR(g, bx - 3, F - 76 - i, 7, 5, 2, MINT_D); });
    /* the lead-source tally board on its A-stand */
    var bx2 = -112; g.strokeStyle = '#9AA6BC'; g.lineWidth = 4; g.beginPath(); g.moveTo(bx2 - 40, F); g.lineTo(bx2 - 26, 334); g.moveTo(bx2 + 40, F); g.lineTo(bx2 + 26, 334); g.stroke();
    shadowed(g, 8, 3, 0.16, function () { fillRR(g, bx2 - 62, 268, 124, 92, 8, '#FFFFFF'); }); fillRR(g, bx2 - 62, 268, 124, 20, 8, NAVY); g.fillRect(bx2 - 62, 280, 124, 8); text(g, 'LEADS IN · BY SOURCE', bx2, 282, 7, 800, '#FFFFFF', 'center');
    SOURCES.forEach(function (sc, i) { var y = 298 + i * 15; fillE(g, bx2 - 50, y, 4, 4, sc[1]); text(g, sc[0], bx2 - 42, y + 3, 6.6, 800, '#3D4560'); fillRR(g, bx2 + 6, y - 4, 48, 8, 4, '#EEF2F7'); });
    /* nearer on the grass (still behind the card): a cart of spare hurdles and a row of starting blocks; the sprinkler's base */
    var hc = -470; soft(g, hc + 50, 598, 60, 6, 0.25); fillRR(g, hc, 572, 104, 8, 3, '#9AA6BC'); fillE(g, hc + 12, 590, 8, 8, '#2A3142'); fillE(g, hc + 92, 590, 8, 8, '#2A3142');
    for (var hh = 0; hh < 4; hh++) { var hy = 528 + hh * 10; g.fillStyle = '#FFFFFF'; g.fillRect(hc + 8 + hh * 3, hy, 4, 44 - hh * 10); g.fillRect(hc + 88 - hh * 3, hy, 4, 44 - hh * 10); for (var hb2 = 0; hb2 < 8; hb2++) { g.fillStyle = hb2 % 2 ? '#E0456B' : '#FFFFFF'; g.fillRect(hc + 8 + hh * 3 + hb2 * (84 - hh * 6) / 8, hy, (84 - hh * 6) / 8, 6); } }
    [-300, -250, -200].forEach(function (sx, i) { soft(g, sx + 14, 584, 18, 3, 0.2); g.fillStyle = '#7A869C'; g.fillRect(sx, 578, 30, 4); g.fillStyle = ['#3167CA', '#E0456B', MINT][i]; g.beginPath(); g.moveTo(sx + 2, 578); g.lineTo(sx + 12, 562); g.lineTo(sx + 14, 578); g.closePath(); g.fill(); g.beginPath(); g.moveTo(sx + 16, 578); g.lineTo(sx + 26, 566); g.lineTo(sx + 28, 578); g.closePath(); g.fill(); });
    fillE(g, -40, 590, 16, 5, '#2A3142'); fillRR(g, -43, 572, 6, 18, 2, '#7A869C');
    /* the rookie's warm-up mat */
    g.fillStyle = '#3167CA'; g.beginPath(); g.moveTo(ROOK.x - 54, F + 2); g.lineTo(ROOK.x + 50, F + 2); g.lineTo(ROOK.x + 58, F + 14); g.lineTo(ROOK.x - 62, F + 14); g.closePath(); g.fill(); g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(ROOK.x - 56, F + 6, 108, 2);
  }
  function paintFront(g, ext) {
    /* the officials' table, open so the seated reps show legs and chairs; one monitor BESIDE each of them */
    CO.desk(g, DESK.x, DESK.y, DESK.w, F, { open: true, legs: '#9AA6BC', top: '#F3F6FA' });
    fillRR(g, DESK.x + 6, DESK.y + 12, DESK.w - 12, 20, 4, NAVY); text(g, 'OFFICIALS · ROUTING & SCORING', DESK.x + DESK.w / 2, DESK.y + 26, 8.4, 800, '#7FF0CF', 'center');
    MONS.forEach(function (mx) { fillRR(g, mx - 3, DESK.y - 63, 54, 50, 5, '#2A3142'); fillRR(g, mx + 20, DESK.y - 13, 8, 13, 2, '#5C6B7A'); fillRR(g, mx + 10, DESK.y - 3, 28, 4, 2, '#5C6B7A'); });
    fillRR(g, 336, DESK.y - 14, 16, 14, 3, '#FFFFFF'); fillRR(g, 334, DESK.y - 16, 20, 4, 2, '#E3E8EF'); /* the commentator's water cup */
    /* the Sales desk counter */
    shadowed(g, 10, 3, 0.15, function () { fillRR(g, BOOTH.x, 384, BOOTH.w, F - 384, 6, PUR); }); fillRR(g, BOOTH.x - 4, 380, BOOTH.w + 8, 10, 4, '#FFFFFF');
    fillRR(g, BOOTH.x + 14, 402, BOOTH.w - 28, 30, 6, 'rgba(255,255,255,.14)'); text(g, 'QUOTATIONS', BOOTH.x + BOOTH.w / 2, 416, 10, 800, '#FFFFFF', 'center'); text(g, 'from the won deal · nothing re-typed', BOOTH.x + BOOTH.w / 2, 427, 6.6, 700, 'rgba(255,255,255,.8)', 'center');
    for (var p = 0; p < 4; p++) fillRR(g, BOOTH.x + 12 + p * 3, 372 - p * 3, 40, 6, 1, p % 2 ? '#FFFFFF' : '#F1ECF0'); /* a pile of quotations */
  }
  function paintFore(g, ext) {
    /* the near grass: cones and a hurdle, the water crate, the TV camera, a kit bag */
    [212, 252, 292, 332].forEach(function (cx, i) { soft(g, cx, 676, 14, 3, 0.25); g.fillStyle = ORANGE; g.beginPath(); g.moveTo(cx - 11, 674); g.lineTo(cx, 646 - i % 2 * 2); g.lineTo(cx + 11, 674); g.closePath(); g.fill(); fillRR(g, cx - 14, 672, 28, 5, 2, '#D9741A'); g.fillStyle = '#FFFFFF'; g.fillRect(cx - 6, 660, 12, 4); });
    var hx = 420; soft(g, hx + 40, 700, 56, 5, 0.25); g.fillStyle = '#FFFFFF'; g.fillRect(hx, 652, 5, 48); g.fillRect(hx + 76, 652, 5, 48); fillRR(g, hx - 6, 696, 18, 5, 2, '#9AA6BC'); fillRR(g, hx + 70, 696, 18, 5, 2, '#9AA6BC');
    for (var hb = 0; hb < 9; hb++) { g.fillStyle = hb % 2 ? '#E0456B' : '#FFFFFF'; g.fillRect(hx + hb * 9, 646, 9, 9); }
    var wx = 620; soft(g, wx + 40, 744, 60, 6, 0.25); fillRR(g, wx, 712, 84, 32, 5, '#3167CA'); fillRR(g, wx, 712, 84, 7, 3, '#1E4691'); for (var b = 0; b < 5; b++) { fillRR(g, wx + 8 + b * 15, 694, 10, 22, 3, '#BDE9FB'); fillRR(g, wx + 10 + b * 15, 690, 6, 5, 2, '#3167CA'); }
    fillRR(g, wx + 92, 728, 52, 14, 4, '#FFFFFF'); fillRR(g, wx + 92, 722, 48, 9, 4, '#F1F5F9'); g.fillStyle = MINT; g.fillRect(wx + 96, 724, 40, 2.5); g.fillRect(wx + 96, 736, 44, 2.5);
    if (ext.r > 940) { var cx2 = 1000; soft(g, cx2, 764, 54, 6, 0.28); g.strokeStyle = '#2A3142'; g.lineWidth = 5; g.beginPath(); g.moveTo(cx2, 680); g.lineTo(cx2 - 40, 762); g.moveTo(cx2, 680); g.lineTo(cx2 + 40, 762); g.moveTo(cx2, 680); g.lineTo(cx2, 764); g.stroke();
      fillRR(g, cx2 - 46, 636, 84, 44, 8, '#2A3142'); fillRR(g, cx2 - 70, 646, 30, 26, 6, '#3A4458'); fillE(g, cx2 - 70, 659, 10, 12, '#5C6B7A'); fillE(g, cx2 - 72, 659, 6, 8, '#9FC4FF'); fillRR(g, cx2 + 20, 624, 22, 14, 3, '#3A4458'); fillE(g, cx2 + 26, 646, 3, 3, '#E0456B'); text(g, 'TV', cx2 + 2, 664, 10, 800, '#FFFFFF', 'center'); }
    if (ext.r > 1150) { soft(g, 1200, 742, 60, 6, 0.25); fillRR(g, 1150, 706, 104, 36, 16, MINT_D); fillRR(g, 1160, 712, 84, 6, 3, '#FFFFFF'); g.strokeStyle = '#0E5A4C'; g.lineWidth = 4; g.beginPath(); g.arc(1202, 706, 18, Math.PI, 0); g.stroke(); }
    function bag(x, y, col) { soft(g, x + 50, y + 32, 60, 6, 0.25); g.strokeStyle = tone(col); g.lineWidth = 4; g.beginPath(); g.arc(x + 50, y + 2, 20, Math.PI, 0); g.stroke(); fillRR(g, x, y, 100, 32, 14, col); fillRR(g, x + 8, y + 6, 84, 4, 2, 'rgba(255,255,255,.75)'); fillE(g, x + 88, y + 8, 3, 3, '#FFFFFF'); fillRR(g, x + 30, y + 14, 40, 12, 4, 'rgba(0,0,0,.08)'); }
    /* the field paint under the title card: the CRM chevrons in white chalk and a chalked START line */
    g.save(); g.globalAlpha = 0.5; g.strokeStyle = '#FFFFFF'; g.lineWidth = 6; g.lineCap = 'round'; g.lineJoin = 'round'; for (var ch = 0; ch < 3; ch++) { var cx3 = -520 + ch * 40; g.beginPath(); g.moveTo(cx3, 702); g.lineTo(cx3 + 20, 720); g.lineTo(cx3, 738); g.stroke(); }
    g.lineWidth = 3; g.beginPath(); g.moveTo(-212, 700); g.lineTo(-212, 740); g.stroke(); g.restore(); text(g, 'WARM-UP LANE', -330, 727, 12, 800, 'rgba(255,255,255,.6)', 'center');
    if (ext.l < 120) bag(-150, 712, ORANGE);
    if (ext.l < -600) { bag(-860, 716, '#3167CA'); [-760, -720, -680].forEach(function (cx) { soft(g, cx, 676, 14, 3, 0.25); g.fillStyle = ORANGE; g.beginPath(); g.moveTo(cx - 11, 674); g.lineTo(cx, 646); g.lineTo(cx + 11, 674); g.closePath(); g.fill(); fillRR(g, cx - 14, 672, 28, 5, 2, '#D9741A'); }); }
  }

  /* the sprinkler on the infield turns, its arc of drops catching the sun (behind the card; seen in "View the scene") */
  function sprinkler(g, t) { var a0 = Math.sin(t * 0.8) * 0.9; for (var d = 0; d < 14; d++) { var u = ((t * 0.9 + d / 14) % 1), a = -Math.PI / 2 + a0 + (d % 3 - 1) * 0.12, v = 150, x = -40 + Math.cos(a) * v * u, y = 568 + Math.sin(a) * v * u + 260 * u * u;
    if (y > 592) continue; fillE(g, x, y, 2.2, 3, 'rgba(160,215,255,' + (0.85 - u * 0.5).toFixed(2) + ')'); } }
  /* ---------------- live: the sky, the crowd, the boards, the relay ---------------- */
  var BELLS = { t: -9, big: false }, WAVE = { t: 3, x0: null }, TAP = {};
  function paintWindow(g, t, par, S) {
    var e = S.ext;
    for (var c = 0; c < 4; c++) { var sp = 4 + c * 2, span = e.r - e.l + 400, x = e.l - 200 + ((hash(c + 2) * span + t * sp) % span), y = -180 + c * 18 - (c % 2) * 30; K.cloud(g, x, y, 0.22 + hash(c) * 0.12); }
    /* the blimp, slowly across the sky band */
    var span2 = e.r - e.l + 600, bx = e.l - 300 + ((t * 9 + 500) % span2), by = -134 + Math.sin(t * 0.5) * 4;
    g.save(); g.translate(bx, by); fillE(g, 0, 22, 36, 4, 'rgba(30,60,100,.08)'); g.fillStyle = '#E2E8F0'; g.beginPath(); g.moveTo(-58, 0); g.lineTo(-74, -14); g.lineTo(-66, 0); g.lineTo(-74, 14); g.closePath(); g.fill();
    fillE(g, 0, 0, 62, 17, '#F7F9FC'); fillE(g, -4, -4, 54, 9, '#FFFFFF'); g.fillStyle = MINT; g.fillRect(-50, 4, 100, 4); fillRR(g, -14, 15, 28, 8, 3, '#C9D3DE'); fillE(g, -6, 19, 2, 2, '#7FD3F7'); fillE(g, 4, 19, 2, 2, '#7FD3F7');
    CO.plane(g, -34, -3, 0.75, 0, '#3167CA'); text(g, 'TechNext', -24, 0, 10, 800, '#3167CA'); g.restore();
    /* birds */
    g.strokeStyle = 'rgba(40,60,90,.55)'; g.lineWidth = 1.6; g.lineCap = 'round';
    for (var b = 0; b < 4; b++) { var bsp = e.r - e.l + 300, bx2 = e.r + 100 - ((t * (16 + b * 3) + hash(b + 9) * bsp) % bsp), by2 = -170 + b * 12 + Math.sin(t * 0.8 + b) * 6, fl = Math.sin(t * 9 + b * 2) * 4;
      g.beginPath(); g.moveTo(bx2 - 6, by2 - fl); g.quadraticCurveTo(bx2 - 3, by2 - 3, bx2, by2); g.quadraticCurveTo(bx2 + 3, by2 - 3, bx2 + 6, by2 - fl); g.stroke(); }
  }
  var TICK = '   NEW LEAD · web form → Singapore team   ★   WhatsApp lead → Philippines team   ★   ★★★ scored: the deals most likely to close run first   ★   Qualified → Proposition   ★   WON → quotation in Odoo Sales, nothing re-typed   ★   Your stages, in your words   ★', TICKW = 0;
  function crowd(g, t, S) {
    var e = S.ext;
    /* the wave: a band of fans stands up and throws their arms high, rippling along the stand */
    var wu = (t - WAVE.t) / 7;
    if (wu >= 0 && wu < 1) { var x0 = WAVE.x0 != null ? WAVE.x0 : e.l, span = WAVE.x0 != null ? Math.max(e.r - x0, x0 - e.l) : e.r - e.l, dir = WAVE.x0 != null && x0 - e.l > e.r - x0 ? -1 : 1, wx = x0 + dir * wu * span;
      var c0 = Math.floor((wx - 30) / 14), c1 = Math.ceil((wx + 30) / 14);
      for (var c = c0; c <= c1; c++) { if (isAisle(c)) continue; var x = c * 14 + 7, lift = Math.max(0, 1 - Math.abs(x - wx) / 32) * 7; if (lift < 1) continue;
        for (var r = 0; r < ROWS; r++) { if (blocked(x, ST_T + r * 19)) continue; seatCell(g, c, r, lift, lift > 3.5); haze(g, x - 7, 14, r); } }
    } else if (wu >= 1 && t - WAVE.t > 16) { WAVE.t = t + 2; WAVE.x0 = null; }
    /* a few fans wave flags; camera flashes pop in the stand */
    for (var f = 0; f < 14; f++) { var c2 = Math.floor(e.l / 14) + 3 + Math.floor(hash(f * 5.3) * ((e.r - e.l) / 14 - 6)), r2 = 1 + Math.floor(hash(f * 2.9) * (ROWS - 2)), cl = cellOf(c2, r2); if (isAisle(c2) || blocked(cl.x, cl.yT) || hash(c2 * 0.71 + r2 * 3.3) <= 0.24) continue;
      var yb = cl.yT + 13, sk = CR.skin[Math.floor(hash(c2 + r2 * 13) * 5)], sw = Math.sin(t * 6 + f) * 0.5, hx = cl.x + 6 + Math.sin(t * 6 + f) * 2, hy = yb - 20;
      limb(g, [[cl.x + 3.5, yb - 8], [hx, hy]], 2.4, sk); g.strokeStyle = '#7A869C'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(hx, hy + 2); g.lineTo(hx + 1, hy - 14); g.stroke();
      g.fillStyle = [MINT, '#3167CA', ORANGE, '#E0456B'][f % 4]; g.beginPath(); g.moveTo(hx + 1, hy - 14); g.quadraticCurveTo(hx + 7, hy - 15 + sw * 4, hx + 13, hy - 12 + sw * 3); g.lineTo(hx + 12, hy - 6 + sw * 3); g.quadraticCurveTo(hx + 7, hy - 9 + sw * 4, hx + 1, hy - 7); g.closePath(); g.fill(); }
    var fk = Math.floor(t * 7); for (var q = 0; q < 2; q++) { var hv = hash(fk * 1.7 + q * 11); if (hv < 0.55) continue; var c3 = Math.floor(e.l / 14) + 2 + Math.floor(hash(fk + q * 3.3) * ((e.r - e.l) / 14 - 4)), r3 = Math.floor(hash(fk * 0.37 + q) * (ROWS - 1)), cl3 = cellOf(c3, r3); if (blocked(cl3.x, cl3.yT)) continue;
      g.fillStyle = 'rgba(255,255,255,.95)'; star(g, cl3.x + 4, cl3.yT - 2, 6, '#FFFFFF'); fillE(g, cl3.x + 4, cl3.yT - 2, 2.4, 2.4, '#FFF6C8'); }
  }
  function sourceIcon(g, i, cx, cy, fg, bg) {
    g.fillStyle = fg;
    if (i === 0) { g.beginPath(); g.arc(cx, cy, 9, 0, 7); g.fill(); g.fillStyle = bg; g.fillRect(cx - 9, cy - 1, 18, 2); g.fillRect(cx - 1, cy - 9, 2, 18); g.strokeStyle = bg; g.lineWidth = 1.5; g.beginPath(); g.ellipse(cx, cy, 4, 9, 0, 0, 7); g.stroke(); }
    else if (i === 1) { fillRR(g, cx - 10, cy - 7, 20, 14, 2, fg); g.strokeStyle = bg; g.lineWidth = 1.6; g.beginPath(); g.moveTo(cx - 9, cy - 6); g.lineTo(cx, cy + 1); g.lineTo(cx + 9, cy - 6); g.stroke(); }
    else if (i === 2) { g.beginPath(); g.arc(cx, cy, 9, 0, 7); g.fill(); g.beginPath(); g.moveTo(cx - 8, cy + 5); g.lineTo(cx - 10, cy + 10); g.lineTo(cx - 3, cy + 8); g.fill(); g.strokeStyle = bg; g.lineWidth = 1.6; g.beginPath(); g.arc(cx, cy, 4, 0.3, 2.4); g.stroke(); }
    else { [-6, 0, 6].forEach(function (dx, j) { g.beginPath(); g.arc(cx + dx, cy + (j === 1 ? -4 : 2), 4, 0, 7); g.fill(); }); }
  }
  /* a runner: own legs in a stride (the engine's legs stand still), then the body, the baton and the deal tag above */
  function runner(g, L, t, S) {
    var P = RUN[L.i], s = RUN_S[L.i], st = t * 12 + L.i * 2, ru = L.run, hop = Math.abs(Math.cos(st)) * 16 * ru;
    if (L.a <= 0.01) return;
    P.x = L.x; P.y = L.y; P.s = s; P.feet = false; P.hop = hop; P.look = L.u > 0.86 ? (L.u > 0.92 ? -0.6 : 0.8) : 0.9; P.mood = L.stage === 3 ? 'happy' : 'calm'; P.talk = false;
    var sw = Math.sin(st) * ru;
    P.hands = L.u > 0.86 && L.u < 0.92 ? [[-70, -150], [110, -330]] : L.u > 0.93 ? [[-110, -380 + Math.sin(t * 14) * 20], [70, -150]] : [[-60 - sw * 50, -190 + Math.abs(sw) * 30], [60 + sw * 50, -190 + Math.abs(sw) * 30]];
    g.save(); g.globalAlpha = L.a; g.translate(L.x, L.y); g.scale(s, s); soft(g, 0, 4, 110, 16, 0.22);
    [-1, 1].forEach(function (d) { var ph = st + (d > 0 ? Math.PI : 0), th = Math.sin(ph) * 0.75 * ru, bend = (0.25 + Math.max(0, -Math.cos(ph)) * 0.9) * ru, hip = [d * 26, -128 - hop];
      var kn = [hip[0] + Math.sin(th) * 62, hip[1] + Math.cos(th) * 62], ft = [kn[0] + Math.sin(th - bend) * 62, kn[1] + Math.cos(th - bend) * 62];
      limb(g, [hip, kn, ft], 40, P.c.low); fillRR(g, ft[0] - 22, ft[1] - 10, 52, 24, 11, '#FFFFFF'); fillRR(g, ft[0] - 22, ft[1] + 6, 52, 8, 4, ['#E0456B', '#3167CA', MINT][L.i]); });
    g.restore();
    g.save(); g.globalAlpha = L.a; K.person(g, P, t);
    var hd = handAt(P, 1), D = L.deal, col = SOURCES[D.src][1];
    if (L.u < U_HAND) { g.save(); g.translate(hd[0], hd[1]); g.rotate(-0.6 + sw * 0.4); fillRR(g, -3, -13, 6, 22, 3, col); fillRR(g, -3, -13, 6, 5, 2, '#FFFFFF'); g.restore(); }
    /* the deal tag rides above the runner: name, stars, the team it was routed to */
    var ty = L.y - 500 * s - 28 - hop * s, tw = 98, tx = L.x - tw / 2;
    shadowed(g, 6, 2, 0.16, function () { fillRR(g, tx, ty, tw, 22, 7, '#FFFFFF'); }); fillRR(g, tx, ty, 4, 22, 2, col);
    text(g, D.name.length > 18 ? D.name.slice(0, 17) + '…' : D.name, tx + 9, ty + 9.5, 6.6, 800, INK);
    var sc = S.hot === 'scoring', rt = S.hot === 'routing';
    for (var k2 = 0; k2 < 3; k2++) star(g, tx + 12 + k2 * 9, ty + 16.5, sc && ((t * 3 + k2) % 3) < 1 ? 4.6 : 3.6, k2 < D.stars ? '#F2B233' : '#E3E8EF');
    fillRR(g, tx + tw - 26, ty + 11, 21, 9, 4.5, rt && (t % 1) < 0.5 ? ORANGE : '#EEF2F7'); text(g, D.rep, tx + tw - 15.5, ty + 18, 6, 800, rt && (t % 1) < 0.5 ? '#FFFFFF' : '#5C6B7A', 'center');
    g.restore();
    /* the hand-off: the baton arcs to the Sales desk */
    if (L.u >= U_HAND && L.u < U_HAND + 0.04) { var f = (L.u - U_HAND) / 0.04, sx = hd[0], sy = hd[1], ex = handAt(SAL, 1)[0], ey = handAt(SAL, 1)[1];
      g.save(); g.translate(lerp(sx, ex, f), lerp(sy, ey, f) - Math.sin(f * Math.PI) * 50); g.rotate(f * 9); fillRR(g, -3, -11, 6, 22, 3, col); g.restore(); }
  }
  function paintLive(g, t, now, S) {
    var e = S.ext;
    crowd(g, t, S);
    /* pennants on the roof edge */
    for (var fx = Math.floor(e.l / 110) * 110 + 55; fx < e.r; fx += 110) { if (fx > PB.x - 20 && fx < PB.x + PB.w + 20) continue; var fl = Math.sin(t * 5 + fx * 0.05);
      g.fillStyle = '#9AA6BC'; g.fillRect(fx - 1, ROOF - 34, 2, 30); g.fillStyle = [MINT, '#3167CA', GOLD, '#E0456B'][((fx / 110 | 0) % 4 + 4) % 4];
      g.beginPath(); g.moveTo(fx + 1, ROOF - 34); g.quadraticCurveTo(fx + 12, ROOF - 32 + fl * 3, fx + 24, ROOF - 28 + fl * 4); g.quadraticCurveTo(fx + 12, ROOF - 25 + fl * 3, fx + 1, ROOF - 22); g.closePath(); g.fill(); }
    /* the LED board ticker */
    g.save(); rr(g, e.l, LED_T + 2, e.r - e.l, LED_B - LED_T - 4, 0); g.clip(); g.font = '800 11px ' + K.FONT; if (!TICKW) TICKW = g.measureText(TICK).width;
    var off = (t * 46) % TICKW; g.fillStyle = '#7FF0CF'; g.textBaseline = 'alphabetic'; for (var tx = e.l - off; tx < e.r; tx += TICKW) g.fillText(TICK, tx, LED_B - 9); g.restore();
    /* the relay */
    var L = [lap(0, t), lap(1, t), lap(2, t)], lastIn = lastEvent(t, U_IN), lastWin = lastEvent(t, U_WIN), lastHand = lastEvent(t, U_HAND);
    S.L = L; S.lastWin = lastWin; S.lastIn = lastIn; S.lastHand = lastHand;
    /* the START board: the panel of the newest lead lights; on its stop they light in turn */
    var newest = L.reduce(function (a, b) { return b.u < a.u ? b : a; }), litSrc = S.hot === 'sources' ? Math.floor(t * 2) % 4 : (t - lastIn < 2.2 ? newest.deal.src : -1);
    SOURCES.forEach(function (s, i) { var px = BRD.x + 2 + (i % 2) * 84, py = BRD.y + 28 + Math.floor(i / 2) * 52, on = i === litSrc; fillRR(g, px, py, 80, 48, 9, on ? s[1] : '#F4F6FA');
      if (on) { g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = 2; rr(g, px + 3, py + 3, 74, 42, 7); g.stroke(); }
      sourceIcon(g, i, px + 40, py + 19, on ? '#FFFFFF' : s[1], on ? s[1] : '#F4F6FA'); text(g, s[0], px + 40, py + 41, 8, 800, on ? '#FFFFFF' : '#5C6B7A', 'center'); });
    /* the routing path: from the lit source down to the router's screen */
    if (S.hot === 'routing' || t - lastIn < 1.6) { var a = S.hot === 'routing' ? 0.75 : 0.5 * (1 - (t - lastIn) / 1.6), p = (t * 0.8) % 1; g.save(); g.strokeStyle = 'rgba(240,138,36,' + a.toFixed(2) + ')'; g.lineWidth = 2.5; g.setLineDash([5, 5]); g.lineDashOffset = -t * 20;
      g.beginPath(); g.moveTo(BRD.x + BRD.w - 20, BRD.y + 132); g.quadraticCurveTo(470, 250, MONS[0] + 24, DESK.y - 63); g.stroke(); g.setLineDash([]); var u2 = 1 - p, qx = u2 * u2 * (BRD.x + BRD.w - 20) + 2 * u2 * p * 470 + p * p * (MONS[0] + 24), qy = u2 * u2 * (BRD.y + 132) + 2 * u2 * p * 250 + p * p * (DESK.y - 63);
      fillE(g, qx, qy, 4, 4, ORANGE); g.restore(); }
    /* the jumbotron: live clock, stage counts, the deal cards mirroring the runners */
    var d = new Date(); fillE(g, PB.x + PB.w - 74, PB.y + 13, 3.5, 3.5, (t % 1) < 0.6 ? '#FF6F6F' : '#FFB3B3'); text(g, 'LIVE', PB.x + PB.w - 66, PB.y + 17, 8, 800, '#FFFFFF');
    text(g, (d.getHours() % 12 || 12) + ':' + ('0' + d.getMinutes()).slice(-2), PB.x + PB.w - 12, PB.y + 17.5, 9, 800, '#FFFFFF', 'right');
    var cnt = [0, 0, 0, 0]; L.forEach(function (l) { if (l.a > 0.3) cnt[l.stage]++; });
    STAGES.forEach(function (c, i) { var x = colX(i), hot = S.hot === 'stages' && Math.floor(t * 1.5) % 4 === i;
      if (hot) fillRR(g, x, PB.y + 32, 98, 26, 7, i === 3 ? '#2BC48A' : MINT);
      text(g, c, x + 10, PB.y + 50, 9.4, 800, hot ? '#FFFFFF' : i === 3 ? '#1E9E6A' : '#3D4560'); fillRR(g, x + 72, PB.y + 40, 18, 13, 6.5, hot ? 'rgba(255,255,255,.3)' : '#E3E8EF'); text(g, String(cnt[i]), x + 81, PB.y + 49.5, 7.6, 800, hot ? '#FFFFFF' : '#5C6B7A', 'center');
      fillRR(g, x + 10, PB.y + 58, 78, 3, 1.5, i === 3 ? '#2BC48A' : '#D5DCE6'); });
    var xs = [X_START, X_Q, X_P, X_WON, X_SALE];
    L.forEach(function (l) { if (l.a <= 0.01) return; var seg = 0; while (seg < 3 && l.x > xs[seg + 1]) seg++; var f = clamp((l.x - xs[seg]) / (xs[seg + 1] - xs[seg]), 0, 1), cx = seg < 3 ? lerp(colX(seg), colX(seg + 1), smooth(f)) + 5 : colX(3) + 5, cy = PB.y + 66 + l.i * 46, D = l.deal;
      g.save(); g.globalAlpha = l.a; shadowed(g, 4, 2, 0.12, function () { fillRR(g, cx, cy, 88, 42, 7, '#FFFFFF'); }); fillRR(g, cx, cy, 4, 42, 2, SOURCES[D.src][1]);
      var words = D.name.split(' '), l1 = '', l2 = ''; words.forEach(function (w) { if ((l1 + w).length < 15 && !l2) l1 += w + ' '; else l2 += w + ' '; });
      text(g, l1, cx + 10, cy + 12, 7, 800, INK); text(g, l2, cx + 10, cy + 21, 7, 800, INK);
      var sc = S.hot === 'scoring'; for (var k = 0; k < 3; k++) star(g, cx + 14 + k * 11, cy + 32, sc && (t * 3 + k) % 3 < 1 ? 5.4 : 4.4, k < D.stars ? '#F2B233' : '#E3E8EF');
      fillRR(g, cx + 56, cy + 26, 26, 12, 6, '#EEF2F7'); text(g, D.rep, cx + 69, cy + 34.6, 6.4, 800, '#5C6B7A', 'center'); if (l.stage === 3) fillE(g, cx + 80, cy + 9, 5, 5, '#2BC48A'); g.restore(); });
    /* the race clock: time on the track of the leading runner */
    var lead = L.reduce(function (a, b) { return b.x > a.x && b.u < 0.8 ? b : a; }), rs = Math.max(0, (lead.u - 0.1) * CYC); if (lead.u >= 0.8) rs = (U_WIN - 0.1) * CYC;
    text(g, '0' + Math.floor(rs / 60) + ':' + ('0' + (rs % 60).toFixed(1)).slice(-4), CLK.x + CLK.w / 2, CLK.y + 25, 16, 800, t - lastWin < 1.2 && (t % 0.3) < 0.15 ? '#FFD84A' : '#7FF0CF', 'center');
    /* the far-side walker, then the runners (nearest lane last) */
    L.forEach(function (l) { runner(g, l, t, S); });
    CO.crew(CREW, g, t, S, false);
    /* the finish tape: snaps when a runner breaks it, re-tied a moment later */
    var since = t - lastWin; if (S.hot === 'won' && S.kT && t - S.kT < 1.5) since = Math.min(since, t - S.kT - 0.2);
    g.strokeStyle = '#E0456B'; g.lineWidth = 2.4; g.lineCap = 'round';
    if (since > 1.4 || since < 0) { g.beginPath(); g.moveTo(FIN.far + 1, 172); g.quadraticCurveTo(FIN.x - 2, 196 + Math.sin(t * 3) * 2, FIN.x - 3, 222); g.stroke(); }
    else { var fl2 = Math.sin(t * 16) * 4; g.beginPath(); g.moveTo(FIN.far + 1, 172); g.quadraticCurveTo(FIN.far + 9 + fl2, 182, FIN.far + 6 + fl2 * 0.5, 192 + since * 8); g.stroke(); g.beginPath(); g.moveTo(FIN.x - 3, 222); g.quadraticCurveTo(FIN.x + 6 - fl2, 214, FIN.x + 4, 204 + since * 6); g.stroke(); }
    if (since >= 0 && since < 0.15 && !TAP.conf) { TAP.conf = true; CR.burst('conf', X_WON, 150, t); BELLS.t = t; BELLS.big = false; } if (since > 0.3) TAP.conf = false;
    /* the last-lap bell: a small ring on every win, a big one when tapped */
    var bt = t - BELLS.t, amp = BELLS.big ? 0.6 : 0.3, sw = bt < 2 ? Math.sin(bt * 18) * amp * (2 - bt) / 2 : Math.sin(t * 0.8) * 0.03;
    g.save(); g.translate(BELL.x, BELL.y - 22); g.rotate(sw); g.fillStyle = GOLD; g.beginPath(); g.moveTo(-15, 30); g.quadraticCurveTo(-13, 2, 0, -2); g.quadraticCurveTo(13, 2, 15, 30); g.closePath(); g.fill();
    fillRR(g, -18, 28, 36, 5, 2.5, '#C9962E'); fillE(g, 0, -3, 3.5, 3.5, '#C9962E'); fillE(g, -5, 12, 3, 8, 'rgba(255,255,255,.35)'); fillE(g, 0, 36, 3.5, 3.5, '#8A6A1E'); g.restore();
    if (bt < 1.5) { g.strokeStyle = 'rgba(233,185,73,' + (1 - bt / 1.5).toFixed(2) + ')'; g.lineWidth = 2; for (var r2 = 0; r2 < (BELLS.big ? 3 : 2); r2++) { g.beginPath(); g.arc(BELL.x, BELL.y, 24 + bt * 30 + r2 * 10, -2.5, -0.6); g.stroke(); } }
    /* the quotation screen: fills after each hand-off (customer, products, pricelist carried over) */
    var last = L.reduce(function (a, b) { return (b.u >= U_HAND ? b.t0 : b.t0 - CYC) > (a.u >= U_HAND ? a.t0 : a.t0 - CYC) ? b : a; }), qd = last.u >= U_HAND ? last.deal : DEALS[((last.n - 1) * 3 + last.i + DEALS.length * 9) % DEALS.length];
    var qa = S.hot === 'quote' ? clamp((t - (S.kT || 0)) * 1.2, 0, 1.2) : clamp((t - lastHand) * 1.1, 0, 1.2);
    text(g, 'Quotation created', QT.x + 9, QT.y + 32, 9.4, 800, INK); text(g, qd.name, QT.x + 9, QT.y + 44, 7, 700, '#8A96A8');
    ['Customer', 'Products', 'Pricelist'].forEach(function (l, i) { var y = QT.y + 50 + i * 15; fillRR(g, QT.x + 9, y, QT.w - 18, 12, 3, '#F6F8FA'); text(g, l, QT.x + 15, y + 8.6, 6.6, 700, '#3D4560');
      if (qa > (i + 1) / 4) { fillE(g, QT.x + QT.w - 18, y + 6, 4, 4, '#2BC48A'); g.strokeStyle = '#FFFFFF'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(QT.x + QT.w - 20, y + 6); g.lineTo(QT.x + QT.w - 18.4, y + 7.6); g.lineTo(QT.x + QT.w - 15.6, y + 4.6); g.stroke(); }
      else text(g, 'carrying over…', QT.x + QT.w - 14, y + 8.6, 5.6, 700, '#B5BFCC', 'right'); });
    var sent = qa >= 1; fillRR(g, QT.x + 9, QT.y + QT.h - 12, 54, 10, 5, sent ? '#2BC48A' : PUR); text(g, sent ? 'Ready ✓' : 'Send', QT.x + 36, QT.y + QT.h - 4.6, 6.4, 800, '#FFFFFF', 'center');
    text(g, 'no re-typing', QT.x + QT.w - 9, QT.y + QT.h - 4.6, 6, 700, '#8A96A8', 'right');
  }

  /* ---------------- in front of the cast: screens, held props, effects ---------------- */
  var BUB = [];
  function paintFrontLive(g, t, S) {
    CO.crew(CREW, g, t, S, true);
    sprinkler(g, t);
    /* the router's screen: leads routed to a team */
    var mx = MONS[0], my = DESK.y - 60; fillRR(g, mx, my, 48, 44, 3, '#FFFFFF'); fillRR(g, mx, my, 48, 9, 3, MINT); text(g, 'Routing', mx + 3, my + 7, 5.4, 800, '#FFFFFF');
    var L = S.L || [];
    L.forEach(function (l, i) { var y = my + 13 + i * 10, D = l.deal, on = S.hot === 'routing' && Math.floor(t * 2) % 3 === i; fillRR(g, mx + 2, y, 44, 8.5, 2, on ? '#FFF1DE' : '#F6F8FA'); fillE(g, mx + 6, y + 4.2, 2.4, 2.4, SOURCES[D.src][1]);
      g.fillStyle = '#C9D3E3'; g.fillRect(mx + 10, y + 3.4, 14, 2); text(g, '→', mx + 28, y + 6.6, 5.6, 800, '#8A96A8', 'center'); fillRR(g, mx + 32, y + 1.4, 12, 6, 3, D.rep === 'SG' ? '#3167CA' : '#14A38B'); text(g, D.rep, mx + 38, y + 6.2, 4.2, 800, '#FFFFFF', 'center'); });
    /* the commentator's screen: the call he is on, a live waveform */
    var nx = MONS[1]; fillRR(g, nx, my, 48, 44, 3, '#FFFFFF'); fillRR(g, nx, my, 48, 9, 3, '#25D366'); text(g, 'On a call', nx + 3, my + 7, 5.4, 800, '#FFFFFF');
    g.strokeStyle = '#25D366'; g.lineWidth = 1.3; g.beginPath(); for (var w = 0; w < 40; w += 2) { var a = (REP2.talk ? 7 : 2) * Math.sin(w * 0.7 + t * 9) * Math.abs(Math.sin(w * 0.23 + t)); g.lineTo(nx + 4 + w, my + 23 + a); } g.stroke();
    fillRR(g, nx + 4, my + 33, 22, 6, 3, '#EEF2F7'); fillRR(g, nx + 30, my + 33, 14, 6, 3, '#E0456B');
    /* held props */
    props(g, t, S);
    /* WhatsApp bubbles from the commentator's spin */
    BUB = BUB.filter(function (b) { return t - b.t0 < 1.8; }); BUB.forEach(function (b) { var u = (t - b.t0) / 1.8; if (u < 0) return; var x = b.x + Math.sin(u * 6 + b.p) * 10, y = b.y - u * 120;
      g.save(); g.globalAlpha = 1 - u; fillRR(g, x - 11, y - 8, 22, 16, 7, '#25D366'); g.fillStyle = '#25D366'; g.beginPath(); g.moveTo(x - 8, y + 6); g.lineTo(x - 11, y + 12); g.lineTo(x - 2, y + 7); g.fill(); [-5, 0, 5].forEach(function (dx) { fillE(g, x + dx, y, 1.6, 1.6, '#FFFFFF'); }); g.restore(); });
  }
  function props(g, t, S) {
    /* the consultant: the start flag in his right hand (raised while a lead waits, dropped on GO), or the megaphone on a tap */
    var tp = TAP.tn, hd = handAt(TN, 1);
    if (tp && t - tp < 2.4) { g.save(); g.translate(hd[0], hd[1]); g.rotate(-0.5); g.fillStyle = '#FFFFFF'; g.beginPath(); g.moveTo(-4, -6); g.lineTo(26, -18); g.lineTo(26, 18); g.lineTo(-4, 6); g.closePath(); g.fill(); g.fillStyle = '#3167CA'; g.fillRect(24, -19, 6, 38); fillRR(g, -10, -4, 10, 14, 3, '#2A3142'); g.restore();
      var u = (t - tp) * 2; g.strokeStyle = 'rgba(49,103,202,.55)'; g.lineWidth = 2; for (var r = 0; r < 3; r++) { var rad = 12 + ((u + r * 0.33) % 1) * 30; g.beginPath(); g.arc(hd[0] + 22, hd[1] - 14, rad, -1.4, 0.2); g.stroke(); } }
    else { var fu = TN.flag || 0; g.save(); g.translate(hd[0], hd[1]); g.rotate(-0.2 - fu * 0.3); g.fillStyle = '#7A869C'; g.fillRect(-1.5, -50, 3, 56); var fw = Math.sin(t * 8) * 3 * fu;
      for (var ci = 0; ci < 4; ci++) for (var cj = 0; cj < 3; cj++) { g.fillStyle = (ci + cj) % 2 ? '#1B1F3B' : '#FFFFFF'; g.fillRect(1.5 + ci * 7, -50 + cj * 7 + fw * (ci / 4), 7, 7); } g.restore(); }
    /* the router: a coffee cup on her sip, or the judge's scorecard on a tap */
    if (REP1.cup) { var hc = handAt(REP1, 1); fillRR(g, hc[0] - 6, hc[1] - 14, 12, 14, 3, '#FFFFFF'); fillRR(g, hc[0] - 6, hc[1] - 14, 12, 4, 2, '#C98E55'); g.strokeStyle = '#FFFFFF'; g.lineWidth = 2; g.beginPath(); g.arc(hc[0] + 7, hc[1] - 8, 3.5, -1.4, 1.4); g.stroke();
      g.strokeStyle = 'rgba(160,170,190,.6)'; g.lineWidth = 1.4; for (var sv = 0; sv < 2; sv++) { g.beginPath(); var sy = hc[1] - 18 - ((t * 14 + sv * 8) % 16); g.moveTo(hc[0] - 2 + sv * 4, sy + 8); g.quadraticCurveTo(hc[0] + 2 + sv * 4, sy + 4, hc[0] - 2 + sv * 4, sy); g.stroke(); } }
    if (TAP.rep1 && t - TAP.rep1 < 2.2) { var hs = handAt(REP1, 1), fl = Math.cos(clamp((t - TAP.rep1) * 2.2, 0, 1) * Math.PI * 2); g.save(); g.translate(hs[0], hs[1] - 30); g.scale(Math.max(0.12, Math.abs(fl)), 1);
      shadowed(g, 6, 2, 0.2, function () { fillRR(g, -26, -22, 52, 36, 6, '#FFFFFF'); }); fillRR(g, -26, -22, 52, 9, 6, MINT); g.fillRect(-26, -16, 52, 3); for (var s3 = 0; s3 < 3; s3++) star(g, -14 + s3 * 14, 2, 6.5, '#F2B233'); fillRR(g, -2, 14, 4, 16, 2, '#C98E55'); g.restore(); }
    /* the coach: the stopwatch on a glance, the whistle on a tap */
    if (MGR.watch) { var hw = handAt(MGR, 0); fillE(g, hw[0], hw[1] - 8, 9, 9, '#C9D3DE'); fillE(g, hw[0], hw[1] - 8, 7, 7, '#FFFFFF'); fillRR(g, hw[0] - 2, hw[1] - 21, 4, 5, 1, '#9AA6BC'); g.strokeStyle = '#E0456B'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(hw[0], hw[1] - 8); var wa = t * 6; g.lineTo(hw[0] + Math.cos(wa) * 5.5, hw[1] - 8 + Math.sin(wa) * 5.5); g.stroke(); }
    if (TAP.mgr && t - TAP.mgr < 1.0) { var mo = mouthAt(MGR); fillRR(g, mo[0] - 2, mo[1] - 4, 16, 8, 4, '#C9D3DE'); fillE(g, mo[0] + 14, mo[1], 5, 5, '#9AA6BC'); g.strokeStyle = 'rgba(30,60,110,.5)'; g.lineWidth = 2;
      for (var wl = 0; wl < 3; wl++) { var wr = 10 + ((t * 3 + wl / 3) % 1) * 22; g.beginPath(); g.arc(mo[0] + 16, mo[1], wr, -0.6, 0.6); g.stroke(); } }
    /* the rookie's dash: speed lines and a "New lead!" pill */
    if (ROOKIE.dash) { g.strokeStyle = 'rgba(255,255,255,.9)'; g.lineWidth = 3; g.lineCap = 'round'; for (var sl = 0; sl < 4; sl++) { var ly = ROOKIE.y - 60 - sl * 40, lx = ROOKIE.x - 40 - ((t * 300 + sl * 40) % 60); g.beginPath(); g.moveTo(lx, ly); g.lineTo(lx - 40, ly); g.stroke(); } }
    if (TAP.rook && t - TAP.rook < 2.6) { var ru = t - TAP.rook; g.save(); g.globalAlpha = clamp((2.6 - ru) * 2, 0, 1); var ry = ROOKIE.y - 290 - ru * 12; fillRR(g, ROOKIE.x - 48, ry, 96, 20, 10, MINT); text(g, 'New lead! ★★★', ROOKIE.x, ry + 14, 8.4, 800, '#FFFFFF', 'center'); g.restore(); }
    /* the Sales desk: the stamp in her hand, or the quotation held high with SENT */
    var hs2 = handAt(SAL, 1);
    if (TAP.sal && t - TAP.sal < 2.2) { var hl = handAt(SAL, 0), mx2 = (hl[0] + hs2[0]) / 2, my2 = Math.min(hl[1], hs2[1]) - 6; shadowed(g, 6, 2, 0.2, function () { fillRR(g, mx2 - 26, my2 - 30, 52, 40, 3, '#FFFFFF'); });
      fillRR(g, mx2 - 26, my2 - 30, 52, 8, 3, PUR); g.fillStyle = '#C9D3E3'; for (var ln = 0; ln < 3; ln++) g.fillRect(mx2 - 20, my2 - 16 + ln * 7, 34 - ln * 6, 2.5);
      if (t - TAP.sal > 0.6) { g.save(); g.translate(mx2 + 8, my2 - 8); g.rotate(-0.25); g.strokeStyle = '#2BC48A'; g.lineWidth = 2; rr(g, -18, -8, 36, 15, 3); g.stroke(); text(g, 'SENT', 0, 3.4, 9, 800, '#2BC48A', 'center'); g.restore(); } }
    else { fillRR(g, hs2[0] - 7, hs2[1] - 4, 14, 8, 2, PUR); fillRR(g, hs2[0] - 3, hs2[1] - 16, 6, 13, 3, '#C9962E'); fillE(g, hs2[0], hs2[1] - 17, 5, 4, '#8A6A1E'); }
  }

  /* ---------------- the cast: an idle loop and a tap choreography each ---------------- */
  function tapped(id, st, t) { if (st.wave && st.wave !== st._my) { st._my = st.wave; TAP[id] = t; return true; } return false; }
  function lookAtNexi(P, st, t, S, base) { P.look = lerp(P.look, t < st.until ? clamp((S.nexi.x - P.x) / 160, -1, 1) : base, 0.08); }
  function nearestRunner(S, x) { var L = S.L || [], best = null; L.forEach(function (l) { if (l.a > 0.4 && (!best || Math.abs(l.x - x) < Math.abs(best.x - x))) best = l; }); return best; }
  var castTN = { id: 'tn', behind: true, keys: ['sources'], P: TN, act: function (P, t, S) {
    var st = S.cast.tn, busy = S.hot === 'sources'; if (tapped('tn', st, t)) CR.burst('spark', P.x + 30, P.y - 300, t);
    var L = S.L || [], wait = L.some(function (l) { return l.u > 0.02 && l.u < 0.1; }), go = L.some(function (l) { return l.u >= 0.1 && l.u < 0.13; });
    P.flag = lerp(P.flag || 0, wait ? 1 : 0, 0.1); P.talk = t < st.until || busy; P.mood = P.talk || go ? 'happy' : 'calm'; P.tilt = 0; P.hop = 0;
    var flip = Math.sin(t * 2.2 + 1) > 0.92 ? -10 : 0;
    P.hands = wait ? [[-70, -200 + flip], [118, -380 + Math.sin(t * 7) * 10]] : go ? [[-70, -200], [130, -160]] : [[-70, -200 + flip], [76, -170]];
    if (TAP.tn && t - TAP.tn < 2.4) { var u = (t - TAP.tn) / 2.4; P.talk = true; P.mood = 'happy'; P.hands = [[-70, -200], [60, -330]]; P.look = 0.9; P.hop = Math.max(0, Math.sin(u * Math.PI * 4)) * 6; P.tilt = -0.06; return; }
    var nr = nearestRunner(S, P.x); lookAtNexi(P, st, t, S, nr ? clamp((nr.x - P.x) / 200, -1, 1) : 0.5);
  } };
  var castR1 = { id: 'rep1', behind: true, keys: ['routing', 'scoring'], P: REP1, act: function (P, t, S) {
    var st = S.cast.rep1, busy = S.hot === 'routing' || S.hot === 'scoring'; if (tapped('rep1', st, t)) CR.burst('star', P.x, P.y - 300, t);
    P.talk = t < st.until || busy || ((t + 3) % 9) < 1.2; P.mood = P.talk ? 'happy' : 'calm'; P.tilt = 0; P.cup = false; P.hop = 0;
    if (TAP.rep1 && t - TAP.rep1 < 2.2) { var u = (t - TAP.rep1) / 2.2; P.mood = 'happy'; P.talk = true; P.hands = [[-60, -206], [70, -360 - Math.sin(u * Math.PI) * 20]]; P.hop = Math.sin(u * Math.PI) * 10; P.look = 0.3; return; }
    var sip = (t % 9) > 6.6 && !busy;
    if (sip) { var su = ((t % 9) - 6.6) / 2.4, up = Math.sin(su * Math.PI); P.cup = true; P.hands = [[-60, -206], [40 - up * 20, -210 - up * 120]]; P.tilt = -up * 0.08; }
    else { var k2 = Math.abs(Math.sin(t * (busy ? 11 : 4))) * 6; P.hands = [[-60, -206 - k2], [60, -206 - (6 - k2)]]; }
    var nr = nearestRunner(S, P.x); lookAtNexi(P, st, t, S, sip ? 0 : nr && Math.abs(nr.x - P.x) < 160 ? clamp((nr.x - P.x) / 120, -1, 1) : 0.5);
  } };
  var castR2 = { id: 'rep2', behind: true, keys: ['sources'], P: REP2, act: function (P, t, S) {
    var st = S.cast.rep2; if (tapped('rep2', st, t)) { for (var b = 0; b < 5; b++) BUB.push({ x: P.x + (b - 2) * 12, y: P.y - 300, t0: t + b * 0.15, p: b }); }
    P.sx = 1; P.hop = 0; P.tilt = Math.sin(t * 1.3) * 0.04;
    if (TAP.rep2 && t - TAP.rep2 < 2.0) { var u = (t - TAP.rep2) / 2.0; P.sx = u < 0.6 ? Math.cos(u / 0.6 * Math.PI * 2) : 1; P.hop = Math.sin(Math.min(1, u / 0.6) * Math.PI) * 18; P.talk = true; P.mood = 'happy';
      P.hands = u < 0.6 ? [[-60, -206], [60, -206]] : [[-110, -400 + Math.sin(t * 14) * 10], [110, -400 - Math.sin(t * 14) * 10]]; return; }
    var burst = ((t + 1.5) % 7) < 4.2; P.talk = t < st.until || burst || S.hot === 'sources'; P.mood = P.talk ? 'happy' : 'calm';
    var g2 = Math.sin(t * 5); P.hands = P.talk ? [[-60, -206 - Math.abs(Math.sin(t * 9)) * 4], [70 + g2 * 20, -280 + Math.abs(g2) * 30]] : [[-60, -206], [60, -206]];
    var nr = nearestRunner(S, P.x); lookAtNexi(P, st, t, S, nr ? clamp((nr.x - P.x) / 200, -1, 1) : -0.4);
  } };
  var castMGR = { id: 'mgr', behind: true, keys: ['stages', 'won'], P: MGR, act: function (P, t, S) {
    var st = S.cast.mgr, busy = S.hot === 'stages' || S.hot === 'won'; if (tapped('mgr', st, t)) {}
    P.watch = false; P.tilt = 0; P.hop = 0;
    if (TAP.mgr && t - TAP.mgr < 2.2) { var u = (t - TAP.mgr) / 2.2; P.talk = u > 0.45; P.mood = u < 0.45 ? 'wow' : 'happy';
      if (u < 0.45) { P.hands = [[-70, -170], [30, -350]]; P.tilt = -0.05; } else { if (!TAP.mgrC) { TAP.mgrC = true; CR.burst('conf', P.x, P.y - 330, t); } P.hands = [[-90, -400 + Math.sin(t * 16) * 14], [100, -420 - Math.sin(t * 16) * 14]]; P.hop = Math.abs(Math.sin(u * Math.PI * 3)) * 24; } return; }
    TAP.mgrC = false;
    P.x = 682 + Math.sin(t * 0.45) * 16; var mv = Math.cos(t * 0.45);
    var sinceWin = t - (S.lastWin || -9), clap = sinceWin >= 0 && sinceWin < 1.3;
    P.talk = t < st.until || busy || clap; P.mood = P.talk ? 'happy' : 'calm';
    if (clap) { var c = Math.abs(Math.sin(sinceWin * 14)); P.hands = [[-14 - c * 34, -250], [14 + c * 34, -250]]; P.hop = Math.abs(Math.sin(sinceWin * 7)) * 8; }
    else if (busy) P.hands = [[-70, -170], [-160, -320 + Math.sin(t * 3) * 8]];
    else if ((t % 6) > 4.2) { P.watch = true; P.hands = [[-40, -300], [70, -170]]; P.tilt = 0.06; }
    else P.hands = [[-70, -170 + Math.abs(mv) * 6], [70, -170 + Math.abs(mv) * 6]];
    lookAtNexi(P, st, t, S, P.watch ? -0.2 : clap ? 0.9 : mv > 0 ? 0.7 : -0.7);
  } };
  var castSAL = { id: 'sal', behind: true, keys: ['quote', 'won'], P: SAL, act: function (P, t, S) {
    var st = S.cast.sal, busy = S.hot === 'quote'; if (tapped('sal', st, t)) CR.burst('spark', P.x, P.y - 300, t);
    P.tilt = 0; P.hop = 0;
    if (TAP.sal && t - TAP.sal < 2.2) { var u = (t - TAP.sal) / 2.2; P.talk = true; P.mood = 'happy'; P.hands = [[-40, -380 - Math.sin(u * Math.PI) * 30], [40, -380 - Math.sin(u * Math.PI) * 30]]; P.hop = Math.sin(u * Math.PI) * 14;
      if (u > 0.3 && !TAP.salC) { TAP.salC = true; CR.burst('star', P.x, P.y - 380, t); } return; }
    TAP.salC = false;
    var sh = t - (S.lastHand || -9), catching = sh > -0.6 && sh < 0.9;
    P.talk = t < st.until || busy || catching; P.mood = P.talk ? 'happy' : 'calm';
    if (catching) { P.hands = [[-70, -210], [40, -380]]; P.look = lerp(P.look, -0.9, 0.2); return; }
    var sp = (t * 0.72) % 1, down = sp < 0.25 ? Math.sin(sp / 0.25 * Math.PI) : 0;
    P.hands = [[-60, -190], [60, -210 + down * 70]];
    if (down > 0.95 && !TAP.salT) { TAP.salT = true; CR.burst('spark', P.x + 30, 380, t); } if (down < 0.5) TAP.salT = false;
    lookAtNexi(P, st, t, S, busy ? -0.3 : -0.5);
  } };

  var castRK = { id: 'rook', behind: true, keys: [], P: ROOKIE, act: function (P, t, S) { /* the rookie rep: arm circles, lunges, toe touches, a jog on the spot; tapped: a sprint start and a dash, "New lead!" */
    var st = S.cast.rook; if (tapped('rook', st, t)) CR.burst('star', P.x, P.y - 260, t);
    P.tilt = 0; P.hop = 0; P.sx = 1; P.dash = false; P.talk = t < st.until; P.mood = P.talk ? 'happy' : 'calm';
    if (TAP.rook && t - TAP.rook < 2.4) { var u = (t - TAP.rook) / 2.4; P.mood = 'happy'; P.talk = true;
      if (u < 0.3) { P.hands = [[-40, -60], [50, -60]]; P.tilt = 0.32; P.look = 1; } else { P.dash = true; var pm = Math.sin(t * 22); P.hands = [[-70 + pm * 50, -230 - pm * 40], [70 - pm * 50, -230 + pm * 40]]; P.hop = Math.abs(Math.sin(t * 22)) * 16; P.tilt = 0.12; P.look = 1; } return; }
    var c = (t + 1) % 10;
    if (c < 2.5) { var a = t * 5; P.hands = [[Math.cos(a) * 110, -300 + Math.sin(a) * 110], [-Math.cos(a) * 110, -300 - Math.sin(a) * 110]]; lookAtNexi(P, st, t, S, 0.2); }
    else if (c < 5) { var l = Math.sin(t * 2.6); P.hands = [[-60, -200], [60, -200]]; P.tilt = l * 0.14; P.hop = -0; lookAtNexi(P, st, t, S, l > 0 ? 0.6 : -0.6); }
    else if (c < 7) { var d = Math.max(0, Math.sin(t * 2.4)); P.tilt = d * 0.3; P.hands = d > 0.5 ? [[-40, -80], [40, -80]] : [[-40, -420], [40, -420]]; lookAtNexi(P, st, t, S, 0.9); }
    else { var j = Math.sin(t * 10); P.hop = Math.abs(j) * 10; P.hands = [[-70 + j * 30, -220], [70 + j * 30, -220]]; lookAtNexi(P, st, t, S, Math.sin(t * 0.7) * 0.8); }
  } };
  window.IXW.worlds['crm-dev'] = {
    pan: [-300, 1260],
    paintBg: paintBg, windowBehind: true, paintFrame: paintFrame, paintBack: paintBack, paintFront: paintFront, paintFore: paintFore,
    paintWindow: paintWindow, paintLive: paintLive, paintFrontLive: paintFrontLive,
    paintForeLive: function (g, t, S) { K.zfore(g, t, S, [], function () { CO.crew(CREW, g, t, S, 'fore'); }); CR.draw(g, t); },
    motes: false,
    glow: {
      sources: function (g) { rr(g, BRD.x - 12, BRD.y - 8, BRD.w + 24, 166, 14); },
      routing: function (g) { rr(g, MONS[0] - 10, DESK.y - 72, 70, 70, 10); },
      stages: function (g) { rr(g, PB.x - 6, PB.y + 26, PB.w + 12, 40, 10); },
      scoring: function (g) { rr(g, PB.x + 2, PB.y + 62, PB.w - 4, 170, 12); },
      won: function (g) { rr(g, CLK.x - 12, CLK.y - 10, CLK.w + 24, CLK.h + 36, 12); },
      quote: function (g) { rr(g, QT.x - 12, QT.y - 12, QT.w + 24, QT.h + 24, 12); },
      bell: function (g) { rr(g, BELL.x - 24, BELL.y - 30, 48, 56, 22); }
    },
    backGlow: ['sources', 'stages', 'scoring', 'won', 'quote', 'bell'],
    calmView: [240, -20, 750, 600],
    cast: [castTN, castR1, castR2, castMGR, castSAL, castRK],
    toy: function (name, S, t) { if (name === 'bell') { BELLS.t = t; BELLS.big = true; CR.burst('conf', BELL.x, BELL.y - 20, t); WAVE.t = t; WAVE.x0 = BELL.x; } },
    hit: function (x, y, S, t, onBtn) {
      var w = CR.hitWalker(x, y, t); if (w) return w; if (onBtn) return null;
      var L = S.L || [];
      for (var i = 0; i < L.length; i++) { var l = L[i], s = RUN_S[l.i]; if (l.a > 0.5 && Math.abs(x - l.x) < 50 && y < l.y + 6 && y > l.y - 500 * s - 34) { var D = l.deal;
        return { say: '**' + D.name + '**: ' + D.stars + '★, from ' + SOURCES[D.src][0] + ', routed to the ' + (D.rep === 'SG' ? 'Singapore' : 'Philippines') + ' team. Stage: **' + STAGES[l.stage] + '**.', near: l.x < 560 ? [915, -22] : [250, -60], pose: l.x < 560 ? 'point-left' : 'point-right', who: 'A lead on the track' }; } }
      if (y > ST_T && y < ST_B && !blocked(x, y)) { WAVE.t = t; WAVE.x0 = x; return { say: 'The whole stand does the wave for every **won deal**.', near: [clamp(x, 240, 900), -20], pose: 'celebrate', who: 'The crowd' }; }
      if (y < ROOF - 10 && y > -170) return { say: 'Look up: the **TechNext** blimp keeps an eye on the whole pipeline.', near: [clamp(x, 240, 900), -40], pose: 'wow', who: 'The blimp' };
      return null;
    },
    onStop: function (key, S, t) { S.kT = t; if (key === 'won') { BELLS.t = t + 0.3; BELLS.big = false; } if (key === 'stages') { WAVE.t = t; WAVE.x0 = null; } }
  };
})(window.IXW && window.IXW.kit, window.CR, window.CO);
