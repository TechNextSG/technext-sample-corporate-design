/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: careers (/careers) — recruitment day: TechNext's booth at a bright, daylit career fair in Taguig City. The hall: a
   skylit space-frame roof, a band of clerestory windows onto the Taguig skyline (clouds drift, a plane crosses), bunting on
   the truss, pale booths far off. The TechNext booth: the brand-blue back wall with the six open roles pinned up (each one a
   stop on the tour), a NOW SERVING LED that scrolls, a small TV of the three offices, the counter with a recruiter and the ID
   printer, a greeter scanning visitor QR codes, an interview corner (HR interviewer + candidate at a small table), the "how
   to apply" standee, balloons. The margins: registration on the left, the #TechNextCareers photo wall and a coffee cart on
   the right. Foreground: queue posts with blue belts, a crate of tote bags, plants, the aisle tape.
   Everyone has their own idle loop and their own tap choreography (written below, per person). Team members wear the blue
   TechNext ID; visitors and candidates a grey pass. Seated people show chairs, legs and feet. */
(function (K, CR, CO) {
  'use strict';
  if (!K || !CR || !CO) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed;
  var F = 470, C = CO.C, NAVY = '#1B2350', BLUE = '#3167CA', Y = '#FFD84A', TEAL = '#14A38B', PASS = '#9AA6BC', RED = '#E2453C';
  var ROLES = [['Solutions Architect', 'ERP', '#3167CA'], ['Odoo Consultant', 'Finance', '#14A38B'], ['B2B Sales', 'Odoo / ERP', '#F08A24'],
    ['Marketing Officer', 'Web & AI', '#E0456B'], ['Senior Accountant', 'CPA · Tax', '#714B67'], ['HR Generalist', 'People', '#7B5BD6']];
  var T = { wall: { x: 150, y: 40, w: 760, h: 430 }, cards: { x: 190, y: 138, w: 104, h: 112, gap: 12 }, led: { x: 238, y: 442, w: 226, h: 22 },
    counter: { x: 226, y: 380, w: 250 }, printer: { x: 410, y: 346 }, tv: { x: 486, y: 288, w: 66, h: 50 }, table: { x: 630, y: 404, w: 120 },
    stand: { x: 862, y: 250 }, balloons: [[168, 40], [892, 40]], band: { t: -112, b: 24 }, photo: { x: 1086, y: 214, w: 150, h: 200 }, cart: { x: 1250, y: 372 },
    reg: { x: -860, y: 392, w: 220 } };
  var COL2 = window.COL;
  function setU(g, sx, sy, k) { g.translate(sx, sy); g.scale(k, k); }
  function extOf(W, H, k, sx, sy) { return { l: -(sx + 24) / k, r: (W - sx) / k, t: -(sy + 24) / k, b: (H - sy) / k }; }
  function cardX(i) { var c = T.cards; return c.x + i * (c.w + c.gap); }
  function ease(u) { u = clamp(u, 0, 1); return u * u * (3 - 2 * u); }
  /* where a person's hand really is (the engine clamps the arm reach the same way), in set units */
  function handW(P, i) {
    var h = P.hands[i], d = i ? 1 : -1, bw = P.build || 1, shx = d * 76 * bw, shy = -258, dx = h[0] - shx, dy = h[1] - shy, L = Math.hypot(dx, dy), m = clamp(L, 5, 155) / (L || 1);
    var sxk = P.sx == null ? 1 : P.sx, lx = shx + dx * m, ly = shy + dy * m;
    return [P.x + lx * P.s * sxk, P.y + (ly - (P.hop || 0) + (P.sit ? (P.sitDrop != null ? P.sitDrop : 46) : 0)) * P.s];
  }
  /* a tap on a cast member (the engine bumps st.wave): seconds since the last tap, and a running count */
  function tapAge(st, t) { if (st.wave && st.wave !== st._tw) { st._tw = st.wave; st.tT = t; st.tN = (st.tN || 0) + 1; } return st.tT == null ? 99 : t - st.tT; }
  function reset(P) { P.sx = 1; P.tilt = 0; P.hop = 0; P.idSwing = 0; }

  /* ------------------------------------------------------------ the hall (cached) */
  function paintBg(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy), b = T.band;
    /* the roof: a white space frame with skylights, daylight pouring in */
    var rg = g.createLinearGradient(0, e.t, 0, b.t); rg.addColorStop(0, '#EEF2FA'); rg.addColorStop(1, '#F8FAFE'); g.fillStyle = rg; g.fillRect(e.l, e.t, e.r - e.l, b.t - e.t);
    for (var sk = Math.floor(e.l / 180) * 180; sk < e.r; sk += 180) { var sg = g.createLinearGradient(0, e.t, 0, -150); sg.addColorStop(0, '#C4E0F7'); sg.addColorStop(1, '#E6F3FD'); g.fillStyle = sg;
      g.beginPath(); g.moveTo(sk + 30, -150); g.lineTo(sk + 60, e.t); g.lineTo(sk + 140, e.t); g.lineTo(sk + 150, -150); g.closePath(); g.fill();
      g.fillStyle = 'rgba(255,255,255,.45)'; g.beginPath(); g.moveTo(sk + 70, -150); g.lineTo(sk + 84, e.t); g.lineTo(sk + 96, e.t); g.lineTo(sk + 84, -150); g.closePath(); g.fill(); }
    g.strokeStyle = 'rgba(150,165,195,.16)'; g.lineWidth = 1.5; g.beginPath();
    for (var sf = Math.floor(e.l / 90) * 90; sf < e.r; sf += 90) { g.moveTo(sf, -150); g.lineTo(sf + 45, -196); g.lineTo(sf + 90, -150); } g.moveTo(e.l, -196); g.lineTo(e.r, -196); g.stroke();
    /* the clerestory band: sky and the Taguig skyline (clouds and a plane are live) */
    g.save(); g.beginPath(); g.rect(e.l, b.t, e.r - e.l, b.b - b.t); g.clip();
    CO.sky(g, { l: e.l, r: e.r, t: b.t }, b.t, b.b, [[0, '#8CC4F0'], [0.75, '#CDE7FA'], [1, '#EAF5FD']]);
    CO.skyPH(g, e.l - 40, e.r + 40, b.b + 40, b.b + 96, { tall: 1180 }); g.restore();
    /* the hall's back wall: light, with tall panels and pale far-off booths */
    var wg = g.createLinearGradient(0, b.b, 0, F); wg.addColorStop(0, '#F1F4FA'); wg.addColorStop(1, '#E3E8F2'); g.fillStyle = wg; g.fillRect(e.l, b.b, e.r - e.l, F - b.b);
    g.fillStyle = 'rgba(120,140,180,.07)'; for (var pn = Math.floor(e.l / 120) * 120; pn < e.r; pn += 120) g.fillRect(pn, b.b, 3, F - b.b);
    [[-1300, '#DCE7F7'], [1320, '#DDEFEA'], [1600, '#F3E6D8']].forEach(function (fb, i) { var x = fb[0]; if (x > e.r || x + 260 < e.l) return;
      fillRR(g, x, 150, 240, F - 150, 8, fb[1]); fillRR(g, x, 150, 240, 30, 8, 'rgba(60,80,130,.16)'); fillRR(g, x + 40, 210, 160, 80, 6, 'rgba(255,255,255,.55)'); fillRR(g, x + 30, 384, 180, F - 384, 4, 'rgba(255,255,255,.6)'); });
    /* the floor: a light exhibition carpet, the aisle tape, soft light pools */
    var fl = g.createLinearGradient(0, F, 0, e.b); fl.addColorStop(0, '#DCE3F0'); fl.addColorStop(1, '#C7D1E5'); g.fillStyle = fl; g.fillRect(e.l, F, e.r - e.l, e.b - F);
    g.fillStyle = 'rgba(40,70,120,.10)'; g.fillRect(e.l, F, e.r - e.l, 6);
    g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 1.5; g.beginPath(); for (var d = 1; d < 9; d++) { var yy = F + Math.pow(d / 8, 1.5) * (e.b - F); g.moveTo(e.l, yy); g.lineTo(e.r, yy); }
    for (var cx = -40; cx <= 40; cx++) { g.moveTo(560 + cx * 64, F); g.lineTo(560 + cx * 64 * 2.4, e.b); } g.stroke();
    g.fillStyle = 'rgba(255,216,74,.85)'; g.fillRect(e.l, 606, e.r - e.l, 7); g.fillRect(e.l, 718, e.r - e.l, 7);
    g.fillStyle = 'rgba(27,35,80,.85)'; for (var tp = Math.floor(e.l / 40) * 40; tp < e.r; tp += 40) { g.fillRect(tp, 606, 18, 7); g.fillRect(tp + 20, 718, 18, 7); }
    [[520, F + 70, 360], [-700, F + 60, 260], [1150, F + 60, 220]].forEach(function (p) { g.save(); g.globalAlpha = 0.5; fillE(g, p[0], p[1], p[2], 34, '#FFFFFF'); g.restore(); });
    /* the floor decal in front of the booth: the plane and "Career Day" */
    g.save(); g.translate(560, 676); g.scale(1, 0.3); fillE(g, 0, 0, 120, 120, 'rgba(49,103,202,.18)'); g.lineWidth = 6; g.strokeStyle = 'rgba(49,103,202,.4)'; g.beginPath(); g.arc(0, 0, 104, 0, 7); g.stroke(); g.restore();
    g.restore();
  }
  function paintFrame(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy), b = T.band;
    /* the window mullions and sill */
    g.fillStyle = '#FFFFFF'; for (var mx = Math.floor(e.l / 110) * 110; mx < e.r; mx += 110) g.fillRect(mx - 3, b.t, 6, b.b - b.t);
    g.fillRect(e.l, b.t - 4, e.r - e.l, 6); g.fillRect(e.l, b.b - 3, e.r - e.l, 9); g.fillStyle = 'rgba(30,60,110,.10)'; g.fillRect(e.l, b.b + 6, e.r - e.l, 4);
    g.fillStyle = 'rgba(255,255,255,.22)'; for (var gl = Math.floor(e.l / 110) * 110; gl < e.r; gl += 110) { g.beginPath(); g.moveTo(gl + 20, b.b); g.lineTo(gl + 50, b.t); g.lineTo(gl + 64, b.t); g.lineTo(gl + 34, b.b); g.closePath(); g.fill(); }
    /* the lighting truss and its spotlights */
    g.strokeStyle = '#B9C3D6'; g.lineWidth = 3; g.beginPath(); g.moveTo(e.l, -144); g.lineTo(e.r, -144); g.moveTo(e.l, -126); g.lineTo(e.r, -126);
    for (var x = Math.floor(e.l / 24) * 24; x < e.r; x += 24) { g.moveTo(x, -144); g.lineTo(x + 12, -126); g.lineTo(x + 24, -144); } g.stroke();
    for (var sp = Math.floor(e.l / 220) * 220; sp < e.r; sp += 220) { fillRR(g, sp + 98, -126, 24, 18, 5, '#3A4458'); fillE(g, sp + 110, -108, 9, 4, '#FFF2C8');
      var lg = g.createLinearGradient(0, -108, 0, 160); lg.addColorStop(0, 'rgba(255,244,210,.35)'); lg.addColorStop(1, 'rgba(255,244,210,0)'); g.fillStyle = lg;
      g.beginPath(); g.moveTo(sp + 102, -108); g.lineTo(sp + 118, -108); g.lineTo(sp + 170, 160); g.lineTo(sp + 50, 160); g.closePath(); g.fill(); }
    /* vertical fabric banners hanging from the truss, far left and far right */
    [[-330, BLUE, 'CAREER', 'DAY'], [1130, TEAL, 'JOIN', 'US'], [-610, '#F08A24', 'HIRING', 'NOW']].forEach(function (bn) { var bx = bn[0]; if (bx > e.r || bx + 70 < e.l) return;
      g.strokeStyle = '#9AA6BC'; g.lineWidth = 2; g.beginPath(); g.moveTo(bx + 10, -126); g.lineTo(bx + 10, -100); g.moveTo(bx + 60, -126); g.lineTo(bx + 60, -100); g.stroke();
      fillRR(g, bx, -100, 70, 150, 4, bn[1]); g.fillStyle = 'rgba(255,255,255,.16)'; g.fillRect(bx + 50, -100, 8, 150); g.fillStyle = bn[1]; g.beginPath(); g.moveTo(bx, 50); g.lineTo(bx + 35, 66); g.lineTo(bx + 70, 50); g.closePath(); g.fill();
      CO.plane(g, bx + 35, -70, 1.3, 0, '#FFFFFF', bn[1]); text(g, bn[2], bx + 35, -24, 11, 800, '#FFFFFF', 'center'); text(g, bn[3], bx + 35, -8, 11, 800, Y, 'center'); });
    /* the hall clock, on Manila time, hangs right of the booth */
    g.strokeStyle = '#9AA6BC'; g.lineWidth = 2; g.beginPath(); g.moveTo(968, -126); g.lineTo(968, 60); g.stroke();
    /* the booth's hanging sign on the truss */
    g.strokeStyle = '#9AA6BC'; g.lineWidth = 2; g.beginPath(); g.moveTo(420, -126); g.lineTo(420, -84); g.moveTo(640, -126); g.lineTo(640, -84); g.stroke();
    shadowed(g, 14, 6, 0.25, function () { fillRR(g, 380, -84, 300, 56, 12, '#FFFFFF'); }); fillRR(g, 380, -84, 12, 56, 6, Y);
    CO.plane(g, 420, -56, 1.6, 0, BLUE, '#FFFFFF'); text(g, 'TechNext', 444, -50, 20, 800, NAVY); text(g, 'BOOTH 12 · CAREER DAY', 444, -36, 8, 800, '#5C5C73');
    /* the TechNext booth's back wall: brand blue, the logo, the headline */
    var w = T.wall; shadowed(g, 30, 10, 0.3, function () { fillRR(g, w.x, w.y, w.w, w.h, 14, BLUE); });
    var bw = g.createLinearGradient(0, w.y, 0, w.y + w.h); bw.addColorStop(0, '#3A72D6'); bw.addColorStop(1, '#2756B0'); g.fillStyle = bw; rr(g, w.x, w.y, w.w, w.h, 14); g.fill();
    g.fillStyle = 'rgba(255,255,255,.05)'; for (var st = w.x + 10; st < w.x + w.w; st += 30) g.fillRect(st, w.y, 12, w.h);
    g.fillStyle = 'rgba(255,216,74,.9)'; g.fillRect(w.x, w.y + w.h - 10, w.w, 4);
    CO.plane(g, w.x + 46, w.y + 44, 2.4, 0, '#FFFFFF', '#2E63C4'); text(g, 'TechNext', w.x + 76, w.y + 55, 27, 800, '#FFFFFF');
    fillRR(g, w.x + w.w - 330, w.y + 18, 300, 52, 26, Y); text(g, "WE'RE HIRING", w.x + w.w - 180, w.y + 42, 17, 800, NAVY, 'center'); text(g, 'TAGUIG CITY, METRO MANILA', w.x + w.w - 180, w.y + 59, 8.5, 800, NAVY, 'center');
    text(g, 'SIX OPEN ROLES · TAP ONE', w.x + 40, w.y + 88, 10, 800, 'rgba(255,255,255,.8)');
    fillRR(g, 400, 60, 158, 30, 15, '#FFFFFF'); fillE(g, 418, 75, 9, 9, '#714B67'); text(g, 'o', 418, 79, 11, 800, '#FFFFFF', 'center'); text(g, 'Odoo Ready Partner', 432, 79, 10.5, 800, '#714B67');
    g.restore();
  }

  /* TechNext's try-it corner, left of the booth (behind the title card): a white wall with the Odoo demo screen (its cards
     move, live), a high demo table where a developer walks a visitor through Odoo, a waiting bench for interviews, a rug */
  var TRY = { x: -462, y: 140, w: 330 }, DEMO = { x: -436, y: 196, w: 210, h: 124 }, BENCH = { x: -96, y: 420, w: 150 };
  function tryBack(g, ext) {
    if (ext.l > 140) return;
    var w = TRY; soft(g, w.x + w.w / 2, F + 4, 190, 10, 0.25); fillRR(g, w.x, w.y, w.w, F - w.y, 8, '#FFFFFF'); fillRR(g, w.x, w.y, w.w, 34, 8, TEAL); g.fillRect(w.x, w.y + 20, w.w, 14);
    CO.plane(g, w.x + 22, w.y + 17, 1.1, 0, '#FFFFFF'); text(g, 'TRY THE ODOO DEMO', w.x + 38, w.y + 22, 12, 800, '#FFFFFF');
    g.fillStyle = '#F1F5FB'; for (var r = 0; r < 6; r++) g.fillRect(w.x, w.y + 34 + r * 50, w.w, 25);
    fillRR(g, w.x, F - 36, w.w, 36, 4, NAVY); text(g, 'TAGUIG CITY · MAIN DEVELOPMENT & CONSULTING HUB', w.x + w.w / 2, F - 14, 7.4, 800, Y, 'center');
    var d = DEMO; fillRR(g, d.x - 5, d.y - 5, d.w + 10, d.h + 10, 7, '#1B1F3B'); fillRR(g, d.x, d.y, d.w, 14, 3, C.odoo); text(g, 'odoo · SALES PIPELINE · DEMO', d.x + 8, d.y + 10, 6.2, 800, '#FFFFFF');
    /* the high demo table's pedestal; the waiting bench */
    soft(g, -300, F + 4, 70, 8, 0.25); fillRR(g, -304, 392, 8, F - 398, 3, '#7A869C'); fillRR(g, -336, F - 8, 72, 8, 4, '#5C6B7A');
    var b = BENCH; soft(g, b.x + b.w / 2, F + 4, 90, 8, 0.25); fillRR(g, b.x, b.y, b.w, 14, 7, '#C9A27A'); fillRR(g, b.x, b.y - 46, b.w, 10, 5, '#C9A27A'); g.fillStyle = '#7A869C'; g.fillRect(b.x + 10, b.y + 14, 6, F - b.y - 14); g.fillRect(b.x + b.w - 16, b.y + 14, 6, F - b.y - 14); g.fillRect(b.x + 12, b.y - 36, 4, 36); g.fillRect(b.x + b.w - 16, b.y - 36, 4, 36);
    g.strokeStyle = '#9AA6BC'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(b.x + 30, -126); g.lineTo(b.x + 30, 150); g.moveTo(b.x + b.w - 30, -126); g.lineTo(b.x + b.w - 30, 150); g.stroke();
    shadowed(g, 8, 3, 0.2, function () { fillRR(g, b.x + 6, 150, b.w - 12, 40, 8, NAVY); }); text(g, 'INTERVIEWS', b.x + b.w / 2, 168, 10, 800, Y, 'center'); text(g, 'please wait here', b.x + b.w / 2, 182, 7, 700, '#FFFFFF', 'center');
    /* the try-it rug */
    g.save(); g.translate(-262, 548); g.scale(1, 0.24); fillE(g, 0, 0, 170, 170, 'rgba(20,163,139,.16)'); g.lineWidth = 8; g.strokeStyle = 'rgba(20,163,139,.45)'; g.setLineDash([22, 16]); g.beginPath(); g.arc(0, 0, 152, 0, 7); g.stroke(); g.setLineDash([]); g.restore();
  }
  function tryFront(g, ext) { if (ext.l > 140 || !COL2) return; fillRR(g, -380, 384, 160, 10, 4, '#D9B48A'); fillRR(g, -380, 392, 160, 4, 2, '#B5865A'); COL2.laptop(g, -330, 384, 0.9, 1, '#F7F0F5'); fillRR(g, -262, 376, 22, 8, 2, Y); fillRR(g, -258, 370, 18, 6, 2, '#FFFFFF'); }
  function tryLive(g, t) {
    var d = DEMO, cols = ['New', 'Qualified', 'Won'], cw = (d.w - 16) / 3; fillRR(g, d.x, d.y + 14, d.w, d.h - 14, 0, '#FFFFFF');
    cols.forEach(function (c, i) { var x = d.x + 6 + i * (cw + 2); fillRR(g, x, d.y + 20, cw - 2, 10, 2, '#F1F4F9'); text(g, c, x + 4, d.y + 27.5, 5.4, 800, i === 2 ? '#0E7A50' : C.ink); });
    var q = (t * 0.35) % 3, step = Math.floor(q), f = COL2.ease((q - step) / 0.6);
    for (var k2 = 0; k2 < 5; k2++) { var col = k2 % 3, row = Math.floor(k2 / 3), x = d.x + 6 + col * (cw + 2), y = d.y + 36 + row * 26; if (k2 === 1) { var from = step % 3, to = (from + 1) % 3; x = lerp(d.x + 6 + from * (cw + 2), d.x + 6 + to * (cw + 2), to === 0 ? 1 : f); y = d.y + 62 + (to === 0 ? 0 : -Math.sin(f * Math.PI) * 8); }
      fillRR(g, x, y, cw - 2, 22, 3, k2 === 1 ? '#FFF8E1' : '#FFFFFF'); g.strokeStyle = '#E3E8EF'; g.lineWidth = 1; rr(g, x, y, cw - 2, 22, 3); g.stroke(); fillRR(g, x, y, 3, 22, 1.5, [BLUE, TEAL, '#714B67', Y, '#E0456B'][k2]);
      fillRR(g, x + 6, y + 6, cw - 22, 3, 1.5, '#C9D3E3'); fillRR(g, x + 6, y + 12, (cw - 22) * 0.6, 3, 1.5, '#E3E8EF'); }
  }
  function paintBack(g, ext) {
    tryBack(g, ext);
    /* the six role cards pinned to the booth wall (their lift and glow are live) */
    var c = T.cards;
    ROLES.forEach(function (r, i) { var x = cardX(i), y = c.y; shadowed(g, 10, 4, 0.25, function () { fillRR(g, x, y, c.w, c.h, 8, '#FFFFFF'); }); fillRR(g, x, y, c.w, 26, 8, r[2]); g.fillRect(x, y + 18, c.w, 8);
      fillE(g, x + c.w / 2, y - 2, 5, 5, RED); text(g, String(i + 1).padStart(2, '0'), x + 12, y + 18, 9, 800, '#FFFFFF');
      var words = r[0].split(' '); text(g, words[0], x + 10, y + 46, 10, 800, C.ink); if (words[1]) text(g, words.slice(1).join(' '), x + 10, y + 60, 10, 800, C.ink);
      fillRR(g, x + 10, y + 72, c.w - 20, 16, 8, '#F1F4F9'); text(g, r[1], x + c.w / 2, y + 83.5, 7, 800, r[2], 'center'); text(g, 'Taguig City', x + 10, y + 102, 7, 700, '#5C5C73'); });
    /* the wall TV's frame */
    var tv = T.tv; fillRR(g, tv.x - 4, tv.y - 4, tv.w + 8, tv.h + 8, 5, '#1B1F3B'); fillRR(g, tv.x + tv.w / 2 - 8, tv.y + tv.h + 4, 16, 4, 2, '#1B1F3B');
    /* the "how to apply" standee */
    var s = T.stand; soft(g, s.x + 34, F + 4, 50, 7, 0.3); g.fillStyle = '#7A869C'; g.fillRect(s.x + 32, s.y + 150, 5, F - s.y - 150); fillRR(g, s.x + 10, F - 6, 50, 6, 3, '#5C6B7A');
    shadowed(g, 10, 4, 0.3, function () { fillRR(g, s.x, s.y, 70, 150, 8, '#FFFFFF'); }); fillRR(g, s.x, s.y, 70, 24, 8, NAVY); g.fillRect(s.x, s.y + 16, 70, 8); text(g, 'HOW TO', s.x + 35, s.y + 15, 7.5, 800, '#FFFFFF', 'center');
    text(g, 'APPLY', s.x + 35, s.y + 40, 11, 800, BLUE, 'center'); for (var qy = 0; qy < 6; qy++) for (var qx = 0; qx < 6; qx++) if (hash(qx * 7 + qy * 13) > 0.45 || (qx < 2 && qy < 2) || (qx > 3 && qy < 2) || (qx < 2 && qy > 3)) { g.fillStyle = NAVY; g.fillRect(s.x + 14 + qx * 7, s.y + 52 + qy * 7, 7, 7); }
    text(g, 'JobStreet', s.x + 35, s.y + 118, 8, 800, C.ink, 'center'); text(g, 'or email us', s.x + 35, s.y + 132, 6.5, 700, '#5C5C73', 'center');
    /* the interview corner: a small round table (its top is in front) and a ticket dispenser on a pole by the counter */
    var tb = T.table; soft(g, tb.x + tb.w / 2, F + 4, 90, 9, 0.3); fillRR(g, tb.x + tb.w / 2 - 5, tb.y + 6, 10, F - tb.y - 10, 3, '#7A869C'); fillE(g, tb.x + tb.w / 2, F - 3, 30, 6, '#5C6B7A');
    /* plants by the booth */
    K.plant(g, { x: 128, y: F }, '#FFFFFF', '#E3E9F3');
    /* ---- right margin: the #TechNextCareers photo wall and the coffee cart ---- */
    var ph = T.photo; if (ext.r > ph.x - 40) {
      soft(g, ph.x + ph.w / 2, F + 4, 120, 9, 0.25); fillRR(g, ph.x - 30, ph.y - 20, ph.w + 60, F - ph.y + 20, 10, '#FFFFFF');
      g.fillStyle = '#EAF0FB'; for (var pd = 0; pd < 12; pd++) for (var pe = 0; pe < 16; pe++) if ((pd + pe) % 2) g.fillRect(ph.x - 22 + pd * 16, ph.y - 12 + pe * 16, 16, 16);
      for (var pp = 0; pp < 6; pp++) CO.plane(g, ph.x - 6 + (pp % 3) * 70, ph.y + 14 + Math.floor(pp / 3) * 170, 0.9, 0.2, 'rgba(49,103,202,.35)');
      g.lineWidth = 10; g.strokeStyle = Y; rr(g, ph.x + 6, ph.y + 24, ph.w - 12, ph.h - 40, 10); g.stroke();
      fillRR(g, ph.x + 20, ph.y + 6, ph.w - 40, 26, 13, NAVY); text(g, '#TechNextCareers', ph.x + ph.w / 2, ph.y + 23, 10, 800, Y, 'center');
      fillRR(g, ph.x + 30, ph.y + ph.h - 26, ph.w - 60, 20, 10, BLUE); text(g, 'I came to TechNext', ph.x + ph.w / 2, ph.y + ph.h - 12, 7.5, 800, '#FFFFFF', 'center'); }
    var ca = T.cart; if (ext.r > ca.x - 60) {
      soft(g, ca.x + 50, F + 4, 70, 8, 0.3); fillRR(g, ca.x, ca.y, 110, F - ca.y - 14, 8, '#C9A27A'); fillRR(g, ca.x - 6, ca.y - 8, 122, 12, 5, '#8E6A47');
      fillRR(g, ca.x + 8, ca.y + 14, 94, 34, 5, '#FFFFFF'); text(g, 'FREE COFFEE', ca.x + 55, ca.y + 35, 9, 800, '#8E6A47', 'center');
      [ca.x + 16, ca.x + 94].forEach(function (wx) { fillE(g, wx, F - 8, 9, 9, '#2A3550'); fillE(g, wx, F - 8, 4, 4, '#9AA6BC'); });
      fillRR(g, ca.x + 14, ca.y - 54, 36, 46, 6, '#2A3142'); fillRR(g, ca.x + 22, ca.y - 46, 20, 10, 3, '#5C6B7A'); fillRR(g, ca.x + 60, ca.y - 22, 12, 14, 3, '#FFFFFF'); fillRR(g, ca.x + 76, ca.y - 22, 12, 14, 3, '#FFFFFF'); fillRR(g, ca.x + 92, ca.y - 22, 12, 14, 3, '#FFFFFF');
      g.strokeStyle = '#8E6A47'; g.lineWidth = 3; g.beginPath(); g.moveTo(ca.x + 6, ca.y - 6); g.lineTo(ca.x + 6, ca.y - 80); g.moveTo(ca.x + 104, ca.y - 6); g.lineTo(ca.x + 104, ca.y - 80); g.stroke();
      g.fillStyle = '#E2453C'; g.beginPath(); g.moveTo(ca.x - 10, ca.y - 80); g.lineTo(ca.x + 120, ca.y - 80); g.lineTo(ca.x + 112, ca.y - 104); g.lineTo(ca.x - 2, ca.y - 104); g.closePath(); g.fill();
      g.fillStyle = '#FFFFFF'; for (var aw = 0; aw < 6; aw++) if (aw % 2) g.fillRect(ca.x - 6 + aw * 21, ca.y - 102, 21, 22); }
    /* ---- left margin: registration ---- */
    var rg = T.reg; if (ext.l < rg.x + rg.w + 60) {
      fillRR(g, rg.x - 40, 60, 80, 400, 6, '#FFFFFF'); fillRR(g, rg.x - 40, 60, 80, 80, 6, BLUE); CO.plane(g, rg.x, 96, 1.6, 0, '#FFFFFF', BLUE);
      text(g, 'CAREER', rg.x, 170, 11, 800, NAVY, 'center'); text(g, 'DAY', rg.x, 186, 11, 800, NAVY, 'center'); text(g, 'Taguig City', rg.x, 204, 7.5, 700, '#5C6B7A', 'center'); fillRR(g, rg.x - 34, F - 10, 68, 10, 4, '#7A869C');
      for (var tl = 0; tl < 4; tl++) fillRR(g, rg.x - 28, 230 + tl * 26, 56, 14, 7, ['#E8EFFC', '#FFF4C8', '#E2F5F0', '#FBE3E1'][tl]); }
  }
  function paintFront(g, ext) {
    tryFront(g, ext);
    /* the booth counter with its printed front */
    var ct = T.counter; soft(g, ct.x + ct.w / 2, F + 4, ct.w * 0.55, 10, 0.3);
    fillRR(g, ct.x, ct.y, ct.w, F - ct.y, 10, '#FFFFFF'); fillRR(g, ct.x - 8, ct.y - 8, ct.w + 16, 14, 6, '#DCE3EE'); fillRR(g, ct.x, ct.y + 22, ct.w, 34, 0, BLUE);
    CO.plane(g, ct.x + 34, ct.y + 39, 1.2, 0, '#FFFFFF', BLUE); text(g, 'Join TechNext', ct.x + 52, ct.y + 44, 13, 800, '#FFFFFF'); text(g, 'career@technext.asia', ct.x + ct.w - 12, ct.y + 43, 8, 800, Y, 'right');
    var L = T.led; fillRR(g, L.x - 3, L.y - 3, L.w + 6, L.h + 6, 5, '#1B1F3B');
    /* the printer on the counter, the flyer stack and goodie bags */
    var p = T.printer; fillRR(g, p.x - 26, p.y, 52, 26, 6, '#2A3550'); fillRR(g, p.x - 20, p.y - 6, 40, 8, 3, '#3A4458');
    fillRR(g, ct.x + 14, ct.y - 26, 26, 22, 3, Y); fillRR(g, ct.x + 44, ct.y - 22, 22, 18, 3, BLUE); g.strokeStyle = NAVY; g.lineWidth = 1.5; g.beginPath(); g.arc(ct.x + 27, ct.y - 26, 6, Math.PI, 0); g.stroke();
    for (var fs = 0; fs < 5; fs++) fillRR(g, ct.x + 120 + (fs % 2), ct.y - 8 - fs * 2.2, 40, 3, 1, fs % 2 ? '#F1F4F9' : '#FFFFFF');
    /* the interview table's top, a CV and a laptop on it */
    var tb = T.table; fillE(g, tb.x + tb.w / 2, tb.y + 4, tb.w / 2 + 4, 10, '#C9A27A'); fillE(g, tb.x + tb.w / 2, tb.y + 2, tb.w / 2, 8, '#D9B48A');
    fillRR(g, tb.x + 22, tb.y - 6, 26, 8, 2, '#FFFFFF'); fillRR(g, tb.x + 70, tb.y - 18, 32, 18, 3, '#2A3550'); fillRR(g, tb.x + 66, tb.y - 2, 40, 3, 1.5, '#9AA6BC');
    /* registration desk front (far left) */
    var rg = T.reg; if (ext.l < rg.x + rg.w + 60) { fillRR(g, rg.x + 60, rg.y, rg.w, F - rg.y, 8, '#FFFFFF'); fillRR(g, rg.x + 52, rg.y - 8, rg.w + 16, 12, 5, '#DCE3EE');
      fillRR(g, rg.x + 60, rg.y + 20, rg.w, 28, 0, TEAL); text(g, 'REGISTER HERE', rg.x + 60 + rg.w / 2, rg.y + 39, 12, 800, '#FFFFFF', 'center');
      fillRR(g, rg.x + 150, rg.y - 30, 40, 24, 3, '#2A3550'); fillRR(g, rg.x + 144, rg.y - 7, 52, 4, 2, '#9AA6BC'); for (var lp = 0; lp < 4; lp++) fillRR(g, rg.x + 80 + lp * 12, rg.y - 16, 8, 14, 2, PASS); }
  }
  /* the foreground, in front of the floor walkers: queue posts with blue belts, a crate of tote bags, plants */
  function paintFore(g, ext) {
    var posts = [100, 250, 400, 550];
    g.strokeStyle = BLUE; g.lineWidth = 7; g.lineCap = 'round'; g.beginPath(); for (var i = 0; i < posts.length - 1; i++) { g.moveTo(posts[i], 648); g.quadraticCurveTo((posts[i] + posts[i + 1]) / 2, 666, posts[i + 1], 648); } g.stroke();
    posts.forEach(function (x) { soft(g, x, 712, 30, 6, 0.3); fillE(g, x, 708, 22, 6, '#5C6B7A'); fillRR(g, x - 4, 642, 8, 66, 3, '#C9D2DE'); fillE(g, x, 642, 7, 5, '#E9EEF5'); });
    /* the tote-bag crate and a plant, right of the queue */
    soft(g, 960, 716, 70, 8, 0.3); fillRR(g, 900, 646, 116, 66, 6, '#C99A6B'); fillRR(g, 900, 646, 116, 12, 5, '#B5865A');
    [[912, Y], [944, BLUE], [976, TEAL]].forEach(function (b) { fillRR(g, b[0], 610, 30, 40, 4, b[1]); g.strokeStyle = 'rgba(27,35,80,.6)'; g.lineWidth = 2; g.beginPath(); g.arc(b[0] + 15, 610, 8, Math.PI, 0); g.stroke(); CO.plane(g, b[0] + 15, 628, 0.6, 0, '#FFFFFF'); });
    text(g, 'GOODIE BAGS', 958, 686, 9, 800, '#FFFFFF', 'center');
    K.plant(g, { x: 1068, y: 730 }, BLUE, '#4A80E2'); K.plant(g, { x: -40, y: 730 }, '#FFFFFF', '#E3E9F3');
    /* a floor sticker by the posts */
    g.save(); g.translate(720, 690); g.scale(1, 0.4); fillRR(g, -70, -40, 140, 80, 40, Y); g.restore(); text(g, 'QUEUE HERE ›', 720, 694, 10, 800, NAVY, 'center');
  }

  /* ------------------------------------------------------------ the cast */
  var W = CR.who;
  var GRE = W({ x: 182, y: 470, s: 0.5, ph: 0.9, skin: 0, hair: 1, style: 'pony', outfit: 'polo', top: Y, top2: NAVY, hold: 'tablet', hands: [[-90, -230], [60, -200]], look: -0.4 });
  var REC = W({ x: 306, y: 470, s: 0.54, ph: 0.4, skin: 1, hair: 0, style: 'long', outfit: 'polo', top: BLUE, top2: '#FFFFFF', hands: [[-80, -230], [70, -210]], look: 0.4 });
  var HR = W({ x: 610, y: 470, s: 0.52, ph: 1.3, skin: 2, hair: 1, style: 'bob', outfit: 'cardigan', top: '#E0456B', top2: '#FFFFFF', sit: true, chairCol: '#2A3550', hold: 'clipboard', hands: [[-80, -220], [40, -210]], look: 0.6 });
  var CNDT = W({ x: 774, y: 470, s: 0.52, ph: 2.2, skin: 3, hair: 0, style: 'short', outfit: 'shirt', top: '#DCE7FB', id: PASS, sit: true, chairCol: '#5C6B7A', hands: [[-80, -200], [60, -200]], look: -0.6 });
  /* the people in the margins (drawn and tapped by this file): the photographer and the visitor posing at the photo wall, the registration volunteer */
  var PHOT = W({ x: 1092, y: 470, s: 0.5, ph: 3.1, skin: 4, hair: 0, style: 'short', outfit: 'shirt', top: '#7B5BD6', glasses: true, hands: [[-60, -170], [110, -320]], look: 0.8 });
  var POSE = W({ x: 1196, y: 470, s: 0.5, ph: 0.2, skin: 1, hair: 2, style: 'bob', outfit: 'cardigan', top: '#F08A24', top2: '#FFFFFF', id: PASS, hands: [[-70, -150], [70, -150]], look: -0.3 });
  var VOL = W({ x: -760, y: 470, s: 0.5, ph: 1.7, skin: 2, hair: 0, style: 'short', outfit: 'polo', top: TEAL, hands: [[-60, -200], [60, -200]], look: 0.3 });
  var CREW = [
    { front: true, x0: -420, x1: 60, y: 664, spd: 14, ph: 0.2, label: 'A candidate', lines: ['Here for the **Odoo consultant** role!', 'CV printed, nerves steady.'], acts: ['wave', 'jump', 'cheer'],
      P: W({ s: 0.58, skin: 0, hair: 2, style: 'pony', outfit: 'shirt', top: TEAL, id: PASS, hold: 'clipboard', hands: [[-60, -212], [70, -150]] }) },
    { front: true, x0: 1040, x1: 1300, y: 700, spd: 16, ph: 0.6, label: 'A candidate', lines: ['Accountant here. **BIR filings** are my thing.', 'Is the HR role still open?'], acts: ['nod', 'jump', 'wave'],
      P: W({ s: 0.58, skin: 2, hair: 0, style: 'short', outfit: 'polo', top: '#2A3550', top2: Y, id: PASS, glasses: true, hold: 'clipboard', hands: [[-60, -212], [70, -150]] }) },
    { x0: -900, x1: -540, y: 500, spd: 18, ph: 0.5, label: 'TechNext developer', lines: ['Restocking the **goodie bags**!', 'I started at a fair like this one.'], acts: ['id', 'wave', 'dance'],
      P: W({ s: 0.5, skin: 4, hair: 1, style: 'short', outfit: 'polo', top: TEAL, glasses: true, hold: 'box', hands: [[-60, -212], [64, -216]] }) },
    { x0: -880, x1: -520, y: 556, spd: 15, ph: 0.8, label: 'A visitor', lines: ['Two goodie bags. **One CV.**', 'Registered! Off to Booth 12.'], acts: ['cheer', 'wave', 'jump'],
      P: W({ s: 0.52, skin: 1, hair: 3, style: 'long', outfit: 'cardigan', top: '#E0456B', id: PASS, hold: 'bags' }) }
  ];

  /* the try-it corner (behind the title card): a developer demoing Odoo, a visitor trying it, a candidate waiting for an interview */
  var XSC = [
    { P: W({ x: -238, y: 470, s: 0.52, ph: 0.7, skin: 1, hair: 1, style: 'short', outfit: 'polo', top: '#714B67', top2: '#FFFFFF', glasses: true }), hands: [[-96, -190], [60, -160]],
      box: [-238, 360, 90, 220], who: 'Odoo developer', role: 'Try-it corner \u00B7 illustration', near: [-100, 60], pose: 'present', dur: [1.8, 1.5], fx: ['conf', 'code'],
      lines: ['Drag a deal to **Won** and the quotation is ready. Try it!', 'I build these screens in our **Taguig City** hub.'],
      idle: function (P, t) { var c = (t + 2) % 8, k = Math.abs(Math.sin(t * 8)) * 5; if (c < 3) { P.hands = [[-96 - k, -190], [60, -160]]; P.look = -0.7; } else if (c < 5.5) { P.hands = [[-150, -330 + Math.sin(t * 3) * 10], [60, -160]]; P.look = -0.9; P.talk = true; } else { P.hands = [[-80, -180], [96, -250]]; P.look = -0.4; P.mood = 'happy'; } },
      moves: [function (P, u) { P.hands = [[-150, -370], [110, -370]]; P.hop = COL2.bell(u) * 14; }, function (P, u) { P.sx = Math.cos(COL2.ease(u) * Math.PI * 2); P.hands = [[-110, -260], [110, -260]]; }],
      after: function (g, P, t, S, X, u, k) { if (u >= 0 && k === 0) COL2.pop(g, P.x, P.y - 300, '\u2713 Deal won (demo)', u, '#0E7A50'); } },
    { P: W({ x: -404, y: 470, s: 0.5, ph: 1.9, skin: 3, hair: 0, style: 'long', outfit: 'cardigan', top: '#F2B233', top2: '#FFFFFF', id: PASS }), hands: [[-60, -150], [70, -186]],
      box: [-404, 360, 90, 220], who: 'A visitor', role: 'Grey visitor pass \u00B7 illustration', near: [-200, 60], pose: 'wow', dur: [1.6, 1.8], fx: ['star', 'heart'],
      lines: ['So this is **Odoo**. Sales to invoice, one screen!', 'Applying for the **Odoo consultant** role tonight.'],
      idle: function (P, t) { var c = (t + 5) % 7; P.look = 0.6; if (c < 3) { P.hands = [[-60, -150], [76, -190 + Math.abs(Math.sin(t * 6)) * -6]]; } else if (c < 5) { P.hands = [[-30, -320], [70, -186]]; P.tilt = 0.06; P.look = 0.8; } else { P.hands = [[-60, -150], [70, -150]]; P.mood = 'happy'; P.tilt = Math.sin(t * 9) * 0.04; } },
      moves: [function (P, u) { P.hands = [[-110, -400], [110, -400]]; P.hop = COL2.bell(u) * 16; P.look = 0; }, function (P, u) { P.hands = [[-60, -150], [96, -330]]; P.look = 0.3; }],
      after: function (g, P, t, S, X, u, k) { if (u >= 0 && k === 1) { var h = COL2.hand(P, 1); g.save(); g.translate(h[0], h[1] - 14); g.rotate(0.12); fillRR(g, -14, -18, 28, 36, 2, '#FFFFFF'); fillRR(g, -14, -18, 28, 8, 2, BLUE); text(g, 'CV', 0, 6, 9, 800, NAVY, 'center'); g.restore(); } } },
    { P: W({ x: -22, y: 470, s: 0.5, ph: 2.8, skin: 4, hair: 1, style: 'short', outfit: 'shirt', top: '#DCE7FB', low: '#2A3550', id: PASS, sit: true, chair: false }), hands: [[-50, -196], [50, -196]],
      box: [-22, 360, 100, 210], who: 'A candidate', role: 'Waiting for an interview \u00B7 illustration', near: [-120, 60], pose: 'clap', dur: [1.6, 1.8], fx: ['spark', 'star'],
      lines: ['Interview at two for **Solutions Architect**. I\u2019ve got this!', 'Practising my answer: why **Odoo**? One database for everything.'],
      idle: function (P, t, S, X) { var c = (t + 1) % 9; X.cv = c < 5; P.look = -0.1; if (c < 5) { P.hands = [[-46, -210], [46, -210]]; P.talk = Math.sin(t * 1.3) > 0.2; } else if (c < 6.4) { P.hands = [[-50, -196], [10, -240]]; P.look = 0.4; } else { P.hands = [[-110, -380], [110, -380]]; P.mood = 'happy'; } },
      moves: [function (P, u) { P.hands = [[-50, -196], [96, -360]]; P.hop = COL2.bell(u) * 8; }, function (P, u, t) { P.hands = [[-46, -210], [46, -210]]; P.tilt = Math.sin(t * 12) * 0.06 * COL2.bell(u); }],
      after: function (g, P, t, S, X, u, k) { var a = COL2.hand(P, 0), b = COL2.hand(P, 1); if (X.cv || (u >= 0 && k === 1)) { g.save(); g.translate((a[0] + b[0]) / 2, Math.min(a[1], b[1]) + 2); fillRR(g, -16, -24, 32, 26, 2, '#FFFFFF'); fillRR(g, -12, -20, 14, 3, 1, BLUE); g.fillStyle = '#C9D3E3'; g.fillRect(-12, -14, 24, 2); g.fillRect(-12, -9, 20, 2); g.fillRect(-12, -4, 22, 2); g.restore(); }
        if (u >= 0 && k === 0) COL2.pop(g, P.x, P.y - 280, 'I\u2019ve got this!', u, BLUE); } }
  ];
  var PRINT = { t: -9 }, POP = { t: -9 }, SERVE = { n: 12, t: 0 }, HS = { t: -9 }, STAMP = { t: -9 }, FLASH = { t: -9 }, SELF = { t: -9 }, POSEJ = { t: -9 }, VOLT = { t: -9 };
  /* ---- the greeter: idle, scans visitor QR codes with her tablet; tapped, twirls a visitor lanyard and tosses it */
  function actGre(P, t, S) {
    var st = S.cast.gre, u = tapAge(st, t); reset(P); P.hold = 'tablet';
    var cyc = (t + 1.3) % 6, scan = cyc > 3.6 && cyc < 5.2;
    P.talk = t < st.until; P.mood = scan || P.talk ? 'happy' : 'calm';
    P.hands = scan ? [[-130, -290], [40, -250]] : [[-90, -230], [60 + Math.sin(t * 2.2) * 6, -200]];
    P.look = scan ? -0.9 : lerp(P.look, Math.sin(t * 0.5) * 0.6, 0.05); P.tilt = Math.sin(t * 1.1) * 0.03;
    P._scan = scan && cyc > 4.4 ? 1 : 0;
    if (u < 2.4) { P.mood = 'happy'; P.talk = true; var spin = u < 1.4;
      P.hands = spin ? [[-90, -230], [70 + Math.cos(u * 14) * 22, -380 + Math.sin(u * 14) * 22]] : [[-90, -230], [110 - (u - 1.4) * 30, -330]];
      P.hop = u > 1.4 && u < 1.8 ? Math.sin((u - 1.4) / 0.4 * Math.PI) * 30 : 0; P.look = 0.2; }
    P._u = u;
  }
  /* ---- the recruiter: idle, hands flyers to the queue; tapped, stamps a ticket NEXT! and the NOW SERVING number moves on */
  function actRec(P, t, S) {
    var st = S.cast.rec, u = tapAge(st, t); reset(P);
    var cyc = (t + 0.4) % 6.5, ph = cyc < 1.4 ? 0 : cyc < 3.6 ? 1 : 2;
    P.talk = t < st.until || (ph === 1 && cyc < 3); P.mood = P.talk || S.hot ? 'happy' : 'calm';
    P.hands = ph === 0 ? [[-80, -230], [70 + Math.sin(cyc * 3) * 10, -190]] : ph === 1 ? [[-80, -230], [140, -290 - Math.sin(cyc * 2) * 10]] : [[-80, -230], [70, -210]];
    if (S.hot && /^r\d$/.test(S.hot)) P.hands = [[-80, -230], [120 + Math.sin(t * 3) * 10, -330]];
    P.look = lerp(P.look, ph === 1 ? 0.8 : clamp((S.nexi.x - P.x) / 160, -1, 1), 0.08); P._fly = ph === 1 && !(S.hot && /^r\d$/.test(S.hot));
    if (u < 2.2) { P.mood = 'happy'; P.talk = true; P._fly = false;
      if (u < 0.5) P.hands = [[-80, -230], [90, -330 - ease(u / 0.5) * 60]];
      else if (u < 0.7) P.hands = [[-80, -230], [90, -390 + ease((u - 0.5) / 0.2) * 190]];
      else P.hands = [[-80, -230], [120, -340]];
      if (u >= 0.62 && STAMP.t < st.tT) { STAMP.t = t; SERVE.n++; SERVE.t = t; CR.burst('spark', 360, 372, t); }
      P.hop = u > 0.7 && u < 1.1 ? Math.sin((u - 0.7) / 0.4 * Math.PI) * 14 : 0; }
    P._u = u;
  }
  /* ---- the interviewer: idle, writes notes and nods; tapped, flips her clipboard to SHORTLISTED and claps. A candidate's tap
     starts a handshake she joins. */
  function actHr(P, t, S) {
    var st = S.cast.hr, u = tapAge(st, t), hs = t - HS.t; reset(P); P.hold = 'clipboard';
    var cyc = (t + 2) % 7; P.talk = t < st.until || (t % 6) < 2.4; P.mood = 'happy';
    P.hands = [[-80, -220], [-10 + Math.sin(t * 9) * 6, -214 + Math.cos(t * 7) * 4]];
    if (cyc > 5) { P.tilt = Math.sin(t * 8) * 0.06; P.hands = [[-80, -250], [40, -210]]; }
    P.look = lerp(P.look, cyc > 5 ? 0.9 : 0.4, 0.06);
    if (S.hot === 'r5') { P.hands = [[-80, -220], [90 + Math.sin(t * 2) * 10, -260]]; P.look = lerp(P.look, -0.5, 0.08); }
    if (hs < 2.4) { P.hold = 'clipboard'; P.talk = true; var gr = ease(hs / 0.5) * (1 - ease((hs - 1.8) / 0.5)); P.hands = [[-80, -220], [lerp(40, 158, gr), lerp(-210, -257, gr) + (hs > 0.5 && hs < 1.6 ? Math.sin(hs * 22) * 6 : 0)]]; P.look = 0.9; }
    if (u < 2.4) { P.talk = true; P.hold = null; P.look = 0.1;
      if (u < 1.6) P.hands = [[-80 - ease(u / 0.4) * 40, -220 - ease(u / 0.4) * 90], [40, -230]];
      else { var cl = Math.abs(Math.sin((u - 1.6) * 12)); P.hands = [[-30 - cl * 20, -270], [30 + cl * 20, -270]]; P.hop = cl * 4; } }
    P._u = u;
  }
  /* ---- the candidate: idle, explains with open hands and straightens the collar; tapped, leans over for a handshake */
  function actCand(P, t, S) {
    var st = S.cast.cand, u = tapAge(st, t); reset(P);
    var cyc = (t + 3) % 8; P.talk = t < st.until || ((t + 3) % 6) < 2.5; P.mood = P.talk ? 'happy' : 'calm';
    var g1 = Math.sin(t * 2.4), g2 = Math.sin(t * 2.4 + 1.6);
    P.hands = P.talk ? [[-110 + g1 * 16, -250 + g2 * 14], [70 + g2 * 10, -230 + g1 * 10]] : [[-80, -200], [60, -200]];
    if (cyc > 6.4) { P.hands = [[-36, -282], [36, -282]]; P.tilt = 0.05; P.mood = 'calm'; }
    P.look = lerp(P.look, -0.7, 0.08);
    if (u < 2.4) { if (u < 0.05 && HS.t < st.tT) HS.t = st.tT; var gr = ease(u / 0.5) * (1 - ease((u - 1.8) / 0.5));
      P.hands = [[lerp(-80, -158, gr), lerp(-200, -257, gr) + (u > 0.5 && u < 1.6 ? Math.sin(u * 22) * 6 : 0)], [60, -200]]; P.tilt = -0.08 * gr; P.mood = 'happy'; P.talk = true; P.look = -0.9;
      if (u > 1.0 && u < 1.06 && !st._h) { st._h = 1; CR.burst('heart', 692, 330, t); } if (u > 1.2) st._h = 0; }
    P._u = u;
  }
  /* ---- margin people (scripted): the photographer, the visitor posing, the registration volunteer */
  function actPhot(P, t) {
    var u = t - SELF.t; reset(P); var cyc = t % 5.2; P.x = 1092 + Math.sin(t * 0.6) * 8; P.hop = 0;
    P.hands = cyc > 4 ? [[-60, -170], [130, -330]] : [[-40, -300], [110, -320]]; P.look = 0.8; P.mood = cyc > 4.2 ? 'happy' : 'calm';
    if (cyc > 4.2 && cyc < 4.26 && FLASH.t < t - 1) FLASH.t = t;
    if (u < 2.2) { P.sx = u < 0.4 ? Math.cos(ease(u / 0.4) * Math.PI) : -1; P.hands = [[-60, -170], [120, -390]]; P.mood = 'happy'; P.talk = true; P.look = -0.2;
      if (u > 0.6 && u < 0.66 && FLASH.t < t - 0.5) { FLASH.t = t; CR.burst('star', P.x - 40, P.y - 240, t); } }
  }
  function actPose(P, t) {
    var u = t - POSEJ.t, fl = t - FLASH.t; reset(P); var k2 = Math.floor(t / 2.6) % 3;
    P.hands = k2 === 0 ? [[-70, -150], [100, -380]] : k2 === 1 ? [[-110, -360], [110, -360]] : [[-40, -280], [70, -150]]; P.mood = fl < 0.8 ? 'wow' : 'happy'; P.look = -0.4;
    P.tilt = Math.sin(t * 1.3) * 0.05;
    if (u < 1.4) { P.hop = Math.abs(Math.sin(u / 1.4 * Math.PI * 2)) * 40; P.hands = [[-110, -380], [110, -380]]; P.talk = true; }
  }
  function actVol(P, t) {
    var u = t - VOLT.t; reset(P); var cyc = t % 5; P.hands = cyc < 3 ? [[-60, -200 - Math.abs(Math.sin(t * 12)) * 6], [60, -200 - Math.abs(Math.cos(t * 12)) * 6]] : [[-60, -200], [128 + Math.sin(t * 12) * 14, -390]];
    P.look = cyc < 3 ? 0.4 : -0.6; P.mood = cyc < 3 ? 'calm' : 'happy'; P.talk = cyc >= 3;
    if (u < 1.8) { P.hands = [[-60, -200], [100, -360]]; P.hop = Math.sin(u / 1.8 * Math.PI) * 20; P.mood = 'happy'; P.talk = true; }
  }
  function drawMargin(g, t, front) {
    if (!front) { actPhot(PHOT, t); K.person(g, PHOT, t); actPose(POSE, t); K.person(g, POSE, t); actVol(VOL, t); K.person(g, VOL, t);
      /* the photographer's phone and its flash */
      var hp = handW(PHOT, 1); g.save(); g.translate(hp[0], hp[1] - 6); fillRR(g, -9, -16, 18, 30, 4, '#1B1F3B'); fillRR(g, -7, -13, 14, 22, 2, '#9FC4FF'); g.restore();
      var fl = t - FLASH.t; if (fl < 0.5) { g.save(); g.globalAlpha = (1 - fl * 2) * 0.85; fillE(g, hp[0], hp[1] - 10, 36 + fl * 60, 36 + fl * 60, '#FFFFFF'); g.restore(); }
      /* the visitor's "I applied!" card */
      if (t - POSEJ.t < 1.4) { var pv = handW(POSE, 1); fillRR(g, pv[0] - 26, pv[1] - 34, 52, 26, 4, Y); text(g, 'I applied!', pv[0], pv[1] - 17, 8, 800, NAVY, 'center'); }
      /* the volunteer's visitor pass, held up */
      if (t - VOLT.t < 1.8) { var vv = handW(VOL, 1); fillRR(g, vv[0] - 10, vv[1] - 30, 20, 26, 3, '#FFFFFF'); fillRR(g, vv[0] - 10, vv[1] - 30, 20, 7, 3, PASS); g.strokeStyle = PASS; g.lineWidth = 2; g.beginPath(); g.moveTo(vv[0] - 6, vv[1] - 30); g.lineTo(vv[0], vv[1] - 46); g.lineTo(vv[0] + 6, vv[1] - 30); g.stroke(); }
    }
  }

  /* ------------------------------------------------------------ live layers */
  var CLOUDS = [[0, -96, 0.9], [380, -78, 0.7], [760, -100, 1], [1180, -84, 0.8], [-520, -90, 0.85]];
  function paintWindow(g, t, par, S) {
    var b = T.band, e = S.ext; g.save(); g.beginPath(); g.rect(e.l, b.t, e.r - e.l, b.b - b.t); g.clip();
    var span = e.r - e.l + 400;
    CLOUDS.forEach(function (c, i) { var x = e.l - 200 + (((c[0] - e.l + t * (6 + i * 1.5)) % span) + span) % span, y = c[1], s = c[2];
      g.fillStyle = 'rgba(255,255,255,.92)'; g.beginPath(); g.ellipse(x, y, 46 * s, 11 * s, 0, 0, 7); g.ellipse(x + 20 * s, y - 9 * s, 26 * s, 13 * s, 0, 0, 7); g.ellipse(x - 18 * s, y - 5 * s, 18 * s, 9 * s, 0, 0, 7); g.fill(); });
    /* a plane crosses the sky every 26 s */
    var pc = (t % 26) / 26, px = lerp(e.l - 60, e.r + 60, pc), py = -92 + pc * 18;
    g.save(); g.translate(px, py); g.rotate(-0.06); fillRR(g, -18, -3, 36, 6, 3, '#F4F7FC'); g.fillStyle = '#C9D3E3'; g.beginPath(); g.moveTo(-2, 0); g.lineTo(-10, 12); g.lineTo(-4, 12); g.lineTo(6, 0); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(-14, -2); g.lineTo(-20, -10); g.lineTo(-16, -10); g.lineTo(-10, -2); g.closePath(); g.fill(); g.restore();
    g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = 2; g.beginPath(); g.moveTo(px - 22, py + 1); g.lineTo(px - 130, py + 9); g.stroke();
    g.restore();
  }
  function bunting(g, t, x0, x1, y0, sag, cols) {
    var n = Math.round((x1 - x0) / 26), sw = Math.sin(t * 1.4) * 3;
    g.strokeStyle = 'rgba(27,35,80,.5)'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(x0, y0); g.quadraticCurveTo((x0 + x1) / 2, y0 + sag * 2 + sw, x1, y0); g.stroke();
    for (var i = 0; i < n; i++) { var u = (i + 0.5) / n, x = lerp(x0, x1, u), y = y0 + 4 * sag * u * (1 - u) + sw * 4 * u * (1 - u) * 2, f = Math.sin(t * 3 + i) * 2;
      g.fillStyle = cols[i % cols.length]; g.beginPath(); g.moveTo(x - 9, y); g.lineTo(x + 9, y); g.lineTo(x + f, y + 20); g.closePath(); g.fill(); }
  }
  var LED_TXT = '  ·  INTERVIEWS ALL DAY  ·  SIX OPEN ROLES  ·  TAGUIG CITY  ·  SINGAPORE HQ · HO CHI MINH CITY  ·  ';
  function paintLive(g, t, now, S) {
    /* bunting along the truss, over the booth */
    bunting(g, t, 160, 900, -116, 26, [BLUE, Y, TEAL, '#E0456B', '#F08A24']);
    if (S.ext.l < 100) bunting(g, t + 1, Math.max(S.ext.l, -900), 120, -118, 18, [Y, BLUE, '#FFFFFF']);
    if (S.ext.r > 920) bunting(g, t + 2, 920, Math.min(S.ext.r, 1400), -118, 18, [TEAL, Y, BLUE]);
    /* the hall clock (Manila time) */
    CO.clock(g, 968, 84, 20, 8, NAVY);
    /* the wall TV: three slides of the company, in turn */
    var tv = T.tv, sl = Math.floor(t / 3.2) % 3, sp2 = (t % 3.2) / 3.2; fillRR(g, tv.x, tv.y, tv.w, tv.h, 2, ['#EAF2FF', '#F6EEF4', '#E7F7F2'][sl]);
    if (sl === 0) { [['SG', 18, '#3167CA'], ['PH', 48, '#14A38B'], ['VN', 33, '#E07B12']].forEach(function (p, i) { var on = Math.floor(sp2 * 3) === i; fillE(g, tv.x + p[1], tv.y + 22 + (i === 2 ? -8 : 0), on ? 6 : 4, on ? 6 : 4, p[2]); text(g, p[0], tv.x + p[1], tv.y + 38 + (i === 2 ? -8 : 0), 6.5, 800, C.ink, 'center'); }); text(g, 'THREE OFFICES', tv.x + tv.w / 2, tv.y + 47, 5.6, 800, '#5C6B7A', 'center'); }
    else if (sl === 1) { text(g, '11+', tv.x + tv.w / 2, tv.y + 28, 18, 800, '#714B67', 'center'); text(g, 'enterprise', tv.x + tv.w / 2, tv.y + 38, 6.2, 800, C.ink, 'center'); text(g, 'clients', tv.x + tv.w / 2, tv.y + 46, 6.2, 800, C.ink, 'center'); }
    else { g.strokeStyle = TEAL; g.lineWidth = 2; g.beginPath(); g.arc(tv.x + 33, tv.y + 20, 11, 0, 7); g.moveTo(tv.x + 22, tv.y + 20); g.lineTo(tv.x + 44, tv.y + 20); g.stroke(); g.beginPath(); g.ellipse(tv.x + 33, tv.y + 20, 5, 11, 0, 0, 7); g.stroke(); text(g, '10+ countries', tv.x + tv.w / 2, tv.y + 43, 6.6, 800, C.ink, 'center'); }
    fillRR(g, tv.x + 4, tv.y + tv.h - 4, (tv.w - 8) * sp2, 2, 1, BLUE);
    /* balloons tied to the booth corners: bob; tapped, they bounce and a new one floats up */
    var pt = t - POP.t;
    T.balloons.forEach(function (b, bi) { [Y, BLUE, TEAL].forEach(function (col, j) { var bx = b[0] + (j - 1) * 18 + Math.sin(t * 0.9 + j * 2 + bi) * 3, by = b[1] - 40 - j * 10 + Math.sin(t * 1.6 + j + bi) * 5 - (pt < 1.2 ? Math.sin(pt * Math.PI / 1.2) * 30 : 0);
      g.strokeStyle = 'rgba(27,35,80,.35)'; g.lineWidth = 1; g.beginPath(); g.moveTo(b[0], b[1]); g.quadraticCurveTo(bx + 4, by + 30, bx, by + 18); g.stroke(); fillE(g, bx, by, 13, 16, col); fillE(g, bx - 4, by - 6, 3, 4, 'rgba(255,255,255,.5)'); }); });
    if (pt < 4) { var fy = 30 - pt * 60; fillE(g, 520 + Math.sin(pt * 3) * 10, fy, 13, 16, '#E0456B'); }
    /* the role cards: the active stop lifts and glows */
    var c = T.cards; ROLES.forEach(function (r, i) { if (S.hot !== 'r' + i) return; var x = cardX(i), u = clamp((t - (S.rT || 0)) * 3, 0, 1); g.save(); g.globalAlpha = 0.9 * u; fillRR(g, x - 4, c.y + c.h + 6, c.w + 8, 6, 3, Y); g.restore(); });
    /* the photo wall's ring light and the coffee steam (right margin) */
    if (S.ext.r > 1000) { var ph = T.photo; g.strokeStyle = 'rgba(255,255,255,.95)'; g.lineWidth = 6; g.beginPath(); g.arc(ph.x - 16, ph.y + 30, 22, 0, 7); g.stroke(); g.strokeStyle = '#7A869C'; g.lineWidth = 3; g.beginPath(); g.moveTo(ph.x - 16, ph.y + 52); g.lineTo(ph.x - 16, F); g.stroke();
      var ca = T.cart; for (var sm = 0; sm < 3; sm++) { var su = ((t * 0.5 + sm / 3) % 1); g.globalAlpha = 0.5 * (1 - su); g.strokeStyle = '#FFFFFF'; g.lineWidth = 3; g.beginPath(); g.moveTo(ca.x + 66 + sm * 16, ca.y - 24 - su * 30); g.quadraticCurveTo(ca.x + 72 + sm * 16 + Math.sin(t * 2 + sm) * 6, ca.y - 34 - su * 30, ca.x + 66 + sm * 16, ca.y - 44 - su * 30); g.stroke(); } g.globalAlpha = 1; }
    drawMargin(g, t, false);
    CO.crew(CREW, g, t, S, false);
    if (COL2 && S.ext.l < 140) { tryLive(g, t); COL2.draw(XSC, g, t, S); }
  }
  function paintFrontLive(g, t, S) {
    CO.crew(CREW, g, t, S, true);
    /* the NOW SERVING LED: the ticket number, then the scrolling line */
    var L = T.led; g.save(); g.beginPath(); g.rect(L.x, L.y, L.w, L.h); g.clip(); g.fillStyle = '#0E1226'; g.fillRect(L.x, L.y, L.w, L.h);
    var fresh = t - SERVE.t < 1.2 && Math.floor((t - SERVE.t) * 8) % 2 === 0;
    fillRR(g, L.x + 3, L.y + 3, 62, L.h - 6, 3, fresh ? Y : '#2A1F05'); text(g, 'A-' + String(SERVE.n).padStart(3, '0'), L.x + 35, L.y + 16, 11, 800, fresh ? NAVY : '#FFC93C', 'center');
    g.beginPath(); g.rect(L.x + 70, L.y, L.w - 70, L.h); g.clip(); g.font = '800 10px ' + K.FONT; g.textAlign = 'left';
    var msg = 'TICKET A-' + String(SERVE.n).padStart(3, '0') + LED_TXT, tw = g.measureText(msg).width, off = (t * 34) % tw; g.fillStyle = '#FFC93C'; g.fillText(msg + msg, L.x + 74 - off, L.y + 15.5);
    g.fillStyle = 'rgba(0,0,0,.25)'; for (var dl = L.y + 1; dl < L.y + L.h; dl += 3) g.fillRect(L.x, dl, L.w, 1); g.restore();
    if (t - SERVE.t > 9) { SERVE.n++; SERVE.t = t; }
    /* the printer's LED, and a fresh TechNext ID sliding out (tapped) */
    var p = T.printer, it = t - PRINT.t; fillE(g, p.x + 18, p.y + 10, 2.5, 2.5, Math.floor(t * 2) % 2 ? '#7FE3C4' : '#2E8A6C');
    if (it < 3.4) { var u = clamp(it / 0.8, 0, 1), up = clamp((it - 0.8) / 0.6, 0, 1); g.save(); g.translate(p.x, p.y - 4 - u * 22 - up * 46); g.rotate(-0.08 * up);
      fillRR(g, -20, -26, 40, 52, 5, '#1E2F5C'); fillRR(g, -18, -24, 36, 48, 4, '#FFFFFF'); fillRR(g, -18, -24, 36, 12, 4, BLUE); g.fillRect(-18, -16, 36, 4);
      fillRR(g, -12, -6, 12, 14, 2, '#C9D6EE'); text(g, 'YOU?', 8, 4, 6.5, 800, BLUE, 'center'); fillRR(g, -12, 14, 24, 3, 1.5, BLUE); g.restore(); }
    /* the greeter's scan beep, and the lanyard she twirls and tosses */
    var hg = handW(GRE, 0); if (GRE._scan) { g.save(); g.globalAlpha = 0.5 + 0.5 * Math.sin(t * 20); g.strokeStyle = '#2BC48A'; g.lineWidth = 2; g.beginPath(); g.moveTo(hg[0] + 10, hg[1] - 30); g.lineTo(hg[0] - 30, hg[1] - 50); g.lineTo(hg[0] - 30, hg[1] - 10); g.closePath(); g.stroke(); g.restore(); }
    if (GRE._u < 2.4) { var hr2 = handW(GRE, 1), lu = GRE._u, lx = hr2[0], ly = hr2[1];
      if (lu < 1.4) { var a = lu * 14; lx += Math.cos(a) * 18; ly += Math.sin(a) * 18; } else { var fu = (lu - 1.4) / 1.0; lx = lerp(hr2[0], 120, fu); ly = hr2[1] - Math.sin(fu * Math.PI) * 60 + fu * 40; }
      g.strokeStyle = PASS; g.lineWidth = 2; g.beginPath(); g.moveTo(hr2[0], hr2[1]); g.lineTo(lx, ly); g.stroke(); fillRR(g, lx - 7, ly - 2, 14, 18, 3, '#FFFFFF'); fillRR(g, lx - 7, ly - 2, 14, 5, 2, PASS);
      if (lu > 1.38 && lu < 1.44 && !GRE._b) { GRE._b = 1; CR.burst('conf', 150, 200, t); } if (lu > 1.6) GRE._b = 0; }
    /* the recruiter's flyer, and her stamp + ticket */
    if (REC._fly) { var hf = handW(REC, 1); g.save(); g.translate(hf[0] + 6, hf[1] - 12); g.rotate(0.15); fillRR(g, -14, -18, 28, 36, 2, '#FFFFFF'); fillRR(g, -14, -18, 28, 9, 2, BLUE); fillRR(g, -10, -4, 20, 3, 1, '#C9D3E3'); fillRR(g, -10, 2, 14, 3, 1, '#C9D3E3'); fillRR(g, -10, 8, 18, 3, 1, Y); g.restore(); }
    if (REC._u < 2.2) { var hs2 = handW(REC, 1); if (REC._u < 0.7) { fillRR(g, hs2[0] - 8, hs2[1] - 26, 16, 18, 4, '#8E6A47'); fillRR(g, hs2[0] - 12, hs2[1] - 8, 24, 8, 2, RED); }
      else { g.save(); g.translate(hs2[0], hs2[1] - 22); g.rotate(-0.1); fillRR(g, -22, -14, 44, 28, 3, Y); text(g, 'A-' + String(SERVE.n).padStart(3, '0'), 0, 4, 9, 800, NAVY, 'center'); g.restore(); } }
    var sa = t - STAMP.t; if (sa < 2.4) { g.save(); g.globalAlpha = clamp(2.4 - sa, 0, 1) * 0.9; g.translate(360, 376); g.rotate(-0.15); g.strokeStyle = RED; g.lineWidth = 2; rr(g, -24, -8, 48, 16, 3); g.stroke(); text(g, 'NEXT!', 0, 4, 9, 800, RED, 'center'); g.restore(); }
    /* the interviewer's clipboard, flipped to SHORTLISTED */
    if (HR._u < 2.4) { var hh = handW(HR, 0), fl = clamp((HR._u - 0.4) / 0.3, 0, 1), sxf = Math.abs(Math.cos(fl * Math.PI)) || 0.05; g.save(); g.translate(hh[0] - 14, hh[1] - 18); g.scale(sxf, 1);
      fillRR(g, -24, -30, 48, 62, 5, '#C98E55'); fillRR(g, -20, -25, 40, 53, 3, fl > 0.5 ? '#E6F6EE' : '#FFFFFF');
      if (fl > 0.5) { g.strokeStyle = '#1E9E6A'; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.moveTo(-10, -2); g.lineTo(-2, 8); g.lineTo(12, -12); g.stroke(); text(g, 'SHORTLISTED', 0, 22, 5.6, 800, '#1E9E6A', 'center'); }
      else { g.fillStyle = '#C9D3E3'; for (var ln = 0; ln < 4; ln++) g.fillRect(-14, -16 + ln * 9, 28, 3); } g.restore();
      if (HR._u > 0.6 && HR._u < 0.66 && !HR._b) { HR._b = 1; CR.burst('star', hh[0] - 14, hh[1] - 40, t); } if (HR._u > 1) HR._b = 0; }
    CR.draw(g, t);
  }

  window.IXW.worlds.careers = {
    pan: [-300, 1080],
    paintBg: paintBg, windowBehind: true, paintFrame: paintFrame, paintBack: paintBack, paintFront: paintFront, paintFore: paintFore,
    paintWindow: paintWindow, paintLive: paintLive, paintFrontLive: paintFrontLive,
    paintForeLive: function (g, t, S) { K.zfore(g, t, S, [], function () { CO.crew(CREW, g, t, S, 'fore'); }); CR.draw(g, t); },
    moteCol: 'rgba(255,216,74,.5)',
    glow: (function () { var o = {}; ROLES.forEach(function (r, i) { o['r' + i] = function (g) { rr(g, cardX(i) - 8, T.cards.y - 10, T.cards.w + 16, T.cards.h + 18, 12); }; });
      o.printer = function (g) { var p = T.printer; rr(g, p.x - 32, p.y - 14, 64, 44, 10); }; o.stand = function (g) { var s = T.stand; rr(g, s.x - 8, s.y - 8, 86, 166, 12); };
      o.balloons = function (g) { rr(g, 130, -70, 80, 110, 30); }; return o; })(),
    backGlow: ['r0', 'r1', 'r2', 'r3', 'r4', 'r5', 'stand', 'balloons'],
    calmView: [150, -60, 800, 640],
    cast: [
      { id: 'gre', behind: true, keys: [], P: GRE, act: actGre },
      { id: 'rec', behind: true, keys: ['r0', 'r1'], P: REC, act: actRec },
      { id: 'hr', behind: true, keys: ['r5'], P: HR, act: actHr },
      { id: 'cand', behind: true, keys: [], P: CNDT, act: actCand }
    ],
    toy: function (name, S, t) { if (name === 'printer') { PRINT.t = t; CR.burst('star', T.printer.x, T.printer.y - 60, t); } if (name === 'balloons') { POP.t = t; CR.burst('conf', 180, 0, t); } },
    hit: function (x, y, S, t) {
      var r = CR.hitWalker(x, y, t); if (r) return r;
      function on(P) { return Math.abs(x - P.x) < 60 && y < P.y + 6 && y > P.y - 260; }
      if (on(PHOT)) { SELF.t = t; return { say: 'Selfie with the booth! Tag it **#TechNextCareers**.', near: [900, 120], pose: 'love', who: 'TechNext photographer' }; }
      if (on(POSE)) { POSEJ.t = t; CR.burst('conf', POSE.x, POSE.y - 260, t); return { say: 'Just applied on **JobStreet**. Photo for the memories!', near: [900, 120], pose: 'celebrate', who: 'A visitor' }; }
      if (COL2) { var xr = COL2.hit(XSC, x, y, t); if (xr) return xr; }
      if (on(VOL)) { VOLT.t = t; CR.burst('spark', VOL.x, VOL.y - 260, t); return { say: 'Your **visitor pass**. The TechNext booth is number 12!', near: [-560, 120], pose: 'hello', who: 'Registration' }; }
      return null;
    },
    onStop: function (key, S, t) { S.rT = t; }
  };
})(window.IXW && window.IXW.kit, window.CR, window.CO);
