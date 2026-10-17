/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: blog (/blog) — the TechNext newsroom, on air with Odoo 20. A bright daytime studio: the video wall runs the Odoo 20
   headlines (from the blog's own "Odoo 20 new features" article) with a ticker of the latest articles under it; the anchor
   at a glass news desk; a floor manager with cue cards; a camera operator panning camera one; a writer drafting the next
   guide (with a paper bin she never misses). The left column: ON AIR, the three office clocks, the markets screen and the
   events calendar; the right: the ERP essentials shelf, then (wider screens) the story board where a producer moves stories
   from DRAFT to PUBLISHED. Far left, the press rolls out the Odoo 20 edition. Foreground: the dolly track, cables, a floor
   monitor, the director's chair and bundles of papers. Everyone has their own idle loop and tap choreography (below). */
(function (K, CR, CO) {
  'use strict';
  if (!K || !CR || !CO) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed;
  var F = 470, C = CO.C, RED = '#E2453C', PUR = '#714B67', INK = '#141A3A', BLUE = '#3167CA', Y = '#FFD84A', TEAL = '#14A38B';
  var NEWS = [['AI agents', 'that do the work'], ['MCP', 'connect your own AI tools'], ['Offline mode', 'and a better phone app'], ['Field Service', 'moves into Planning'], ['Accounting', 'pay bills from Odoo'], ['Payroll · Inventory', 'manufacturing updates']];
  var TICK = 'ODOO 20: NEW FEATURES IN PLAIN LANGUAGE  ·  ODOO 20 IN SINGAPORE, THE PHILIPPINES AND VIETNAM  ·  ODOO EXPERIENCE 2026: FIVE TAKEAWAYS  ·  ODOO EVENTS OCT–NOV 2026  ·  INVOICENOW IN SINGAPORE: ALL DATES TO 2031  ·  ';
  var CUES = ['ODOO 20', 'AI AGENTS', 'MCP', 'SMILE!'];
  var STORIES = [['Odoo 20', BLUE], ['InvoiceNow', TEAL], ['OE 2026', PUR], ['Events', RED], ['What is ERP', '#F08A24'], ['Hosting', BLUE]];
  var T = { wall: { x: 362, y: -70, w: 518, h: 300 }, desk: { x: 404, y: 386, w: 236 }, write: { x: 140, y: 402, w: 170 }, map: { x: 154, y: 24, w: 150, h: 96 }, cal: { x: 172, y: 136, w: 114, h: 96 },
    clocks: { x: 182, y: -30 }, shelf: { x: 870, y: 196, w: 122 }, cam: { x: 690, y: 300 }, onair: { x: 168, y: -112 }, bin: { x: 324 }, board: { x: 1016, y: 40, w: 168, h: 250 }, press: { x: -900, y: 250, w: 300 } };
  function setU(g, sx, sy, k) { g.translate(sx, sy); g.scale(k, k); }
  function extOf(W, H, k, sx, sy) { return { l: -(sx + 24) / k, r: (W - sx) / k, t: -(sy + 24) / k, b: (H - sy) / k }; }
  function ease(u) { u = clamp(u, 0, 1); return u * u * (3 - 2 * u); }
  function handW(P, i) {
    var h = P.hands[i], d = i ? 1 : -1, bw = P.build || 1, shx = d * 76 * bw, shy = -258, dx = h[0] - shx, dy = h[1] - shy, L = Math.hypot(dx, dy), m = clamp(L, 5, 155) / (L || 1);
    var sxk = P.sx == null ? 1 : P.sx;
    return [P.x + (shx + dx * m) * P.s * sxk, P.y + (shy + dy * m - (P.hop || 0) + (P.sit ? (P.sitDrop != null ? P.sitDrop : 46) : 0)) * P.s];
  }
  function tapAge(st, t) { if (st.wave && st.wave !== st._tw) { st._tw = st.wave; st.tT = t; st.tN = (st.tN || 0) + 1; } return st.tT == null ? 99 : t - st.tT; }
  function reset(P) { P.sx = 1; P.tilt = 0; P.hop = 0; P.idSwing = 0; }

  /* ------------------------------------------------------------ the studio (cached) */
  function paintBg(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    /* the ceiling: white acoustic panels above the lighting grid */
    var cg = g.createLinearGradient(0, e.t, 0, -136); cg.addColorStop(0, '#E9EEF7'); cg.addColorStop(1, '#F6F8FC'); g.fillStyle = cg; g.fillRect(e.l, e.t, e.r - e.l, -136 - e.t);
    g.strokeStyle = 'rgba(120,140,180,.14)'; g.lineWidth = 1.5; g.beginPath(); for (var cx = Math.floor(e.l / 80) * 80; cx < e.r; cx += 80) { g.moveTo(cx, e.t); g.lineTo(cx, -136); } for (var cy = -176; cy > e.t; cy -= 40) { g.moveTo(e.l, cy); g.lineTo(e.r, cy); } g.stroke();
    /* the studio walls: pale, a soft grid, colour pools of the brand */
    var hg = g.createLinearGradient(0, -136, 0, F); hg.addColorStop(0, '#F4F7FC'); hg.addColorStop(1, '#E2E9F4'); g.fillStyle = hg; g.fillRect(e.l, -136, e.r - e.l, F + 136);
    g.strokeStyle = 'rgba(49,103,202,.07)'; g.lineWidth = 1.5; g.beginPath(); for (var x = Math.floor(e.l / 60) * 60; x < e.r; x += 60) { g.moveTo(x, -136); g.lineTo(x, F); } for (var y = -130; y < F; y += 60) { g.moveTo(e.l, y); g.lineTo(e.r, y); } g.stroke();
    [[600, 120, 'rgba(49,103,202,.16)'], [170, 240, 'rgba(226,69,60,.08)'], [1100, 200, 'rgba(255,216,74,.16)'], [-700, 200, 'rgba(20,163,139,.10)']].forEach(function (p) { var rg = g.createRadialGradient(p[0], p[1], 10, p[0], p[1], 420); rg.addColorStop(0, p[2]); rg.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = rg; g.fillRect(e.l, -136, e.r - e.l, F + 136); });
    /* a wainscot of acoustic foam panels */
    g.fillStyle = '#D9E1EE'; g.fillRect(e.l, 360, e.r - e.l, F - 360); g.fillStyle = 'rgba(255,255,255,.5)'; g.fillRect(e.l, 360, e.r - e.l, 3);
    for (var fx = Math.floor(e.l / 36) * 36; fx < e.r; fx += 36) { g.fillStyle = (fx / 36) % 2 ? 'rgba(160,175,205,.18)' : 'rgba(255,255,255,.18)'; g.fillRect(fx + 3, 368, 30, F - 374); }
    /* the floor: a glossy light studio floor, the blue light strip, a reflection pool */
    var fl = g.createLinearGradient(0, F, 0, e.b); fl.addColorStop(0, '#E9EEF6'); fl.addColorStop(1, '#D3DBE8'); g.fillStyle = fl; g.fillRect(e.l, F, e.r - e.l, e.b - F);
    g.fillStyle = 'rgba(49,103,202,.55)'; g.fillRect(e.l, F + 4, e.r - e.l, 3);
    g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 1.5; g.beginPath(); for (var d = 1; d < 8; d++) { var yy = F + Math.pow(d / 7, 1.6) * (e.b - F); g.moveTo(e.l, yy); g.lineTo(e.r, yy); } g.stroke();
    g.fillStyle = 'rgba(255,255,255,.5)'; g.beginPath(); g.ellipse(520, F + 50, 360, 34, 0, 0, Math.PI * 2); g.fill();
    g.restore();
  }
  function paintFrame(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    /* the lighting grid, its fresnels and their soft cones */
    g.fillStyle = '#9AA6BC'; g.fillRect(e.l, -142, e.r - e.l, 6); g.fillRect(e.l, -156, e.r - e.l, 3);
    for (var lx = Math.floor(e.l / 180) * 180; lx < e.r; lx += 180) { g.fillStyle = '#9AA6BC'; g.fillRect(lx + 84, -154, 2, 14); fillRR(g, lx + 70, -136, 30, 26, 6, '#2A3142'); fillE(g, lx + 85, -110, 11, 5, '#FFF2C8'); fillRR(g, lx + 64, -134, 6, 20, 2, '#3A4458'); fillRR(g, lx + 100, -134, 6, 20, 2, '#3A4458');
      var lg = g.createLinearGradient(0, -110, 0, 300); lg.addColorStop(0, 'rgba(255,236,180,.28)'); lg.addColorStop(1, 'rgba(255,240,200,0)'); g.fillStyle = lg; g.beginPath(); g.moveTo(lx + 78, -110); g.lineTo(lx + 92, -110); g.lineTo(lx + 150, 300); g.lineTo(lx + 20, 300); g.closePath(); g.fill(); }
    /* a slim banner over the video wall */
    g.strokeStyle = '#9AA6BC'; g.lineWidth = 2; g.beginPath(); g.moveTo(500, -136); g.lineTo(500, -128); g.moveTo(700, -136); g.lineTo(700, -128); g.stroke();
    fillRR(g, 470, -128, 260, 30, 6, '#FFFFFF'); fillRR(g, 470, -128, 8, 30, 4, RED); text(g, 'ODOO 20 · LIVE COVERAGE', 604, -108, 11, 800, INK, 'center');
    /* the video wall's frame */
    var w = T.wall; shadowed(g, 30, 10, 0.25, function () { fillRR(g, w.x - 10, w.y - 10, w.w + 20, w.h + 20, 10, '#2A3142'); });
    g.restore();
  }
  function paintBack(g, ext) {
    /* ON AIR box and the three office clock faces (hands are live) */
    fillRR(g, T.onair.x - 4, T.onair.y - 4, 128, 42, 10, '#2A3142');
    var ck = T.clocks; fillRR(g, ck.x - 24, ck.y - 26, 148, 60, 10, '#FFFFFF'); g.fillStyle = 'rgba(30,60,110,.08)'; g.fillRect(ck.x - 22, ck.y + 34, 144, 3);
    [['SG', BLUE], ['TAGUIG', TEAL], ['HCMC', '#E07B12']].forEach(function (c, i) { var x = ck.x + i * 50; K.clockFace(g, { x: x, y: ck.y - 2, r: 15 }, c[1]); text(g, c[0], x, ck.y + 27, 6.6, 800, C.ink, 'center'); });
    /* the markets screen */
    var m = T.map; fillRR(g, m.x - 5, m.y - 5, m.w + 10, m.h + 10, 7, '#2A3142'); fillRR(g, m.x, m.y, m.w, m.h, 3, '#16224A');
    g.fillStyle = '#2B3D7A'; [[26, 42, 28, 18], [66, 30, 44, 38], [42, 66, 28, 20], [106, 54, 24, 28]].forEach(function (b) { g.beginPath(); g.ellipse(m.x + b[0], m.y + b[1], b[2] / 2, b[3] / 2, 0.3, 0, Math.PI * 2); g.fill(); });
    text(g, 'WE WRITE FOR', m.x + 8, m.y + 14, 6.4, 800, '#9FC4FF');
    /* the events calendar */
    var c = T.cal; shadowed(g, 8, 3, 0.3, function () { fillRR(g, c.x, c.y, c.w, c.h, 6, '#FFFFFF'); }); fillRR(g, c.x, c.y, c.w, 22, 6, RED); g.fillRect(c.x, c.y + 14, c.w, 8);
    text(g, 'OCT–NOV 2026', c.x + c.w / 2, c.y + 15, 8, 800, '#FFFFFF', 'center');
    for (var d = 0; d < 20; d++) { var dx = c.x + 8 + (d % 5) * 20.5, dy = c.y + 28 + Math.floor(d / 5) * 15; fillRR(g, dx, dy, 16, 11, 2, [3, 8, 14, 17].indexOf(d) >= 0 ? '#FFE0DE' : '#F1F4F9'); if ([3, 8, 14, 17].indexOf(d) >= 0) fillE(g, dx + 8, dy + 5.5, 2.6, 2.6, RED); }
    text(g, 'Odoo events · SG PH VN', c.x + c.w / 2, c.y + c.h - 5, 6.4, 800, C.ink, 'center');
    /* the ERP essentials shelf */
    var s = T.shelf; soft(g, s.x + s.w / 2, F + 4, 80, 8, 0.3); fillRR(g, s.x, s.y, s.w, F - s.y, 6, '#3A2F4F'); fillRR(g, s.x + 6, s.y + 6, s.w - 12, F - s.y - 12, 3, '#4A3D62');
    for (var r = 0; r < 4; r++) { var ry = s.y + 60 + r * 66; fillRR(g, s.x + 6, ry, s.w - 12, 6, 2, '#2A2240');
      for (var b = 0; b < 6; b++) { var bh = 34 + hash(b + r * 9) * 18; fillRR(g, s.x + 12 + b * 17, ry - bh, 14, bh, 2, ['#3167CA', '#14A38B', '#F08A24', PUR, '#FFD84A', '#E0456B'][(b + r) % 6]); } }
    fillRR(g, s.x + 4, s.y - 26, s.w - 8, 22, 6, Y); text(g, 'ERP ESSENTIALS', s.x + s.w / 2, s.y - 11, 8, 800, C.ink, 'center');
    /* camera one's tripod (the camera head pans, live) */
    var cm = T.cam; soft(g, cm.x + 46, F + 4, 70, 8, 0.35); g.strokeStyle = '#5C6B7A'; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.moveTo(cm.x + 46, cm.y + 62); g.lineTo(cm.x + 10, F); g.moveTo(cm.x + 46, cm.y + 62); g.lineTo(cm.x + 82, F); g.moveTo(cm.x + 46, cm.y + 62); g.lineTo(cm.x + 46, F); g.stroke();
    fillE(g, cm.x + 10, F, 6, 3, '#2A3142'); fillE(g, cm.x + 82, F, 6, 3, '#2A3142'); fillE(g, cm.x + 46, F, 6, 3, '#2A3142');
    /* ---- right: the story board on its stand ---- */
    var bd = T.board; if (ext.r > bd.x - 20) { soft(g, bd.x + bd.w / 2, F + 4, 100, 8, 0.25); g.fillStyle = '#9AA6BC'; g.fillRect(bd.x + 14, bd.y + bd.h, 5, F - bd.y - bd.h); g.fillRect(bd.x + bd.w - 19, bd.y + bd.h, 5, F - bd.y - bd.h);
      fillRR(g, bd.x + 4, F - 6, 30, 6, 3, '#7A869C'); fillRR(g, bd.x + bd.w - 34, F - 6, 30, 6, 3, '#7A869C');
      shadowed(g, 12, 4, 0.18, function () { fillRR(g, bd.x, bd.y, bd.w, bd.h, 8, '#FFFFFF'); }); fillRR(g, bd.x, bd.y, bd.w, 26, 8, INK); g.fillRect(bd.x, bd.y + 18, bd.w, 8); text(g, 'STORY BOARD', bd.x + bd.w / 2, bd.y + 17, 9, 800, '#FFFFFF', 'center');
      ['DRAFT', 'EDIT', 'LIVE'].forEach(function (h, i) { var cx2 = bd.x + 6 + i * 52; text(g, h, cx2 + 26, bd.y + 40, 7, 800, ['#9AA6BC', '#F08A24', TEAL][i], 'center'); if (i) { g.fillStyle = '#E3E8EF'; g.fillRect(cx2 - 2, bd.y + 32, 2, bd.h - 40); } }); }
    if (ext.r > 1240) K.plant(g, { x: 1270, y: F }, '#FFFFFF', '#E3E8EF');
    /* ---- far left: the press ---- */
    var pr = T.press; if (ext.l < pr.x + pr.w + 40) { soft(g, pr.x + pr.w / 2, F + 4, 180, 10, 0.3);
      fillRR(g, pr.x, pr.y, pr.w, F - pr.y, 12, '#5C6B8A'); fillRR(g, pr.x + 10, pr.y + 10, pr.w - 20, 70, 8, '#46546F'); fillRR(g, pr.x, pr.y - 30, pr.w, 34, 8, RED);
      text(g, 'THE TECHNEXT PRESS', pr.x + pr.w / 2, pr.y - 8, 13, 800, '#FFFFFF', 'center');
      for (var pl = 0; pl < 3; pl++) { fillE(g, pr.x + 60 + pl * 90, pr.y + 120, 30, 30, '#3A4458'); fillE(g, pr.x + 60 + pl * 90, pr.y + 120, 24, 24, '#8A96B0'); }
      fillRR(g, pr.x + 20, pr.y + 170, pr.w - 40, 14, 4, '#3A4458'); fillRR(g, pr.x + 30, F - 40, 60, 40, 6, '#46546F'); fillRR(g, pr.x + pr.w - 90, F - 40, 60, 40, 6, '#46546F');
      /* two fabric banners hang from the grid over the press */
      [[pr.x + 20, RED, 'EXTRA!', 'Odoo 20 edition'], [pr.x + 170, BLUE, 'PRINTED', 'in plain language']].forEach(function (b) { g.fillStyle = '#9AA6BC'; g.fillRect(b[0] + 8, -136, 2, 16); g.fillRect(b[0] + 100, -136, 2, 16);
        fillRR(g, b[0], -122, 110, 8, 3, '#5C6B7A'); g.fillStyle = b[1]; g.beginPath(); g.moveTo(b[0] + 4, -114); g.lineTo(b[0] + 106, -114); g.lineTo(b[0] + 106, 160); g.lineTo(b[0] + 55, 136); g.lineTo(b[0] + 4, 160); g.closePath(); g.fill();
        g.fillStyle = 'rgba(255,255,255,.14)'; g.fillRect(b[0] + 4, -114, 10, 270); CO.plane(g, b[0] + 55, -60, 2.2, 0, '#FFFFFF'); text(g, b[2], b[0] + 55, 10, 15, 800, '#FFFFFF', 'center'); text(g, b[3], b[0] + 55, 30, 8, 700, 'rgba(255,255,255,.85)', 'center'); }); }
    newsroom(g);
  }
  /* behind the title card: the newsroom corner. Framed front pages, the monitor wall (live), the newsroom light box, the
     rundown board (live), a softbox on its stand, the water cooler, the fact-checker's research desk, the interview corner
     on its rug, and tape marks on the studio floor. */
  var FRONTS = [['ODOO 20', 'is here', BLUE], ['INVOICENOW', 'all dates to 2031', TEAL], ['OE 2026', 'five takeaways', PUR]];
  var RUN = [['Odoo 20: new features', BLUE], ['InvoiceNow in Singapore', TEAL], ['Odoo Experience 2026', PUR], ['Odoo events, Oct–Nov', RED]];
  var NR = { fronts: { x: -476, y: -104 }, mons: { x: -110, y: -98, w: 104, h: 64 }, sign: { x: -476, y: 44, w: 336 }, run: { x: -476, y: 94, w: 336, h: 122 },
    soft: { x: -86 }, cool: { x: 66 }, rdesk: { x: -470, y: 404, w: 214 }, corner: { x: -170, y: 604 } };
  function newsroom(g) {
    /* framed front pages of past editions */
    FRONTS.forEach(function (f, i) { var x = NR.fronts.x + i * 118, y = NR.fronts.y + (i % 2) * 8;
      shadowed(g, 10, 4, 0.18, function () { fillRR(g, x, y, 104, 132, 4, '#2A3142'); }); fillRR(g, x + 6, y + 6, 92, 120, 2, '#FFFDF8');
      fillRR(g, x + 12, y + 12, 80, 2, 1, INK); text(g, 'THE TECHNEXT NEWS', x + 52, y + 24, 6, 800, INK, 'center'); fillRR(g, x + 12, y + 28, 80, 1, 0, INK);
      text(g, f[0], x + 52, y + 46, f[0].length > 8 ? 10.5 : 13, 800, f[2], 'center'); text(g, f[1], x + 52, y + 58, 7, 700, '#5C6378', 'center');
      fillRR(g, x + 12, y + 66, 38, 30, 2, f[2]); g.globalAlpha = 0.25; fillRR(g, x + 16, y + 70, 30, 22, 2, '#FFFFFF'); g.globalAlpha = 1;
      for (var l = 0; l < 6; l++) fillRR(g, x + 56, y + 68 + l * 5, l % 3 === 2 ? 22 : 34, 2, 1, '#C9D3E3');
      for (var l2 = 0; l2 < 3; l2++) fillRR(g, x + 12, y + 102 + l2 * 6, 80 - (l2 === 2 ? 30 : 0), 2, 1, '#C9D3E3'); });
    /* the monitor wall's frame (the feeds are live) */
    var m = NR.mons; shadowed(g, 12, 4, 0.2, function () { fillRR(g, m.x - 8, m.y - 8, m.w * 2 + 22, m.h * 2 + 22, 8, '#2A3142'); });
    g.fillStyle = '#9AA6BC'; g.fillRect(m.x + m.w, m.y + m.h * 2 + 14, 6, 24); fillRR(g, m.x + m.w - 20, m.y + m.h * 2 + 36, 46, 6, 3, '#9AA6BC');
    /* the newsroom light box */
    var s = NR.sign; shadowed(g, 10, 4, 0.16, function () { fillRR(g, s.x, s.y, s.w, 40, 6, '#FFFFFF'); }); fillRR(g, s.x, s.y, 10, 40, 4, RED);
    CO.plane(g, s.x + 32, s.y + 20, 1.1, 0, BLUE); text(g, 'THE TECHNEXT NEWSROOM', s.x + 52, s.y + 25, 13, 800, INK); text(g, 'SG · PH · VN', s.x + s.w - 14, s.y + 25, 9, 800, RED, 'right');
    /* the rundown board (its NOW marker is live) */
    var r = NR.run; shadowed(g, 10, 4, 0.16, function () { fillRR(g, r.x, r.y, r.w, r.h, 6, '#FFFFFF'); }); fillRR(g, r.x, r.y, r.w, 24, 6, INK); g.fillRect(r.x, r.y + 16, r.w, 8);
    text(g, "TODAY'S RUNDOWN", r.x + 14, r.y + 16, 8.5, 800, '#FFFFFF'); text(g, 'ON THE DESK', r.x + r.w - 14, r.y + 16, 7, 800, Y, 'right');
    RUN.forEach(function (it, i) { var y = r.y + 30 + i * 22; fillRR(g, r.x + 10, y, r.w - 20, 18, 3, '#F4F7FC'); fillRR(g, r.x + 10, y, 5, 18, 2, it[1]);
      text(g, String(i + 1), r.x + 26, y + 13, 9, 800, it[1], 'center'); text(g, it[0], r.x + 40, y + 13, 9, 700, INK); });
    /* the softbox on its stand, aimed at the desk */
    var sx = NR.soft.x; soft(g, sx, F + 4, 40, 6, 0.28); g.strokeStyle = '#5C6B7A'; g.lineWidth = 4; g.lineCap = 'round'; g.beginPath(); g.moveTo(sx, F - 30); g.lineTo(sx, 150);
    g.moveTo(sx, F - 30); g.lineTo(sx - 28, F); g.moveTo(sx, F - 30); g.lineTo(sx + 28, F); g.moveTo(sx, F - 30); g.lineTo(sx, F); g.stroke();
    g.save(); g.translate(sx, 140); g.rotate(0.28); fillRR(g, -40, -34, 80, 64, 6, '#3A4458'); fillRR(g, -34, -28, 68, 52, 4, '#FFF8E6'); g.fillStyle = 'rgba(255,236,180,.5)'; g.fillRect(-34, -28, 68, 8); g.restore();
    /* the water cooler */
    var cx = NR.cool.x; soft(g, cx, F + 3, 34, 6, 0.26); fillRR(g, cx - 24, 384, 48, F - 384, 6, '#F4F7FB'); fillRR(g, cx - 24, 384, 48, 8, 4, '#DCE3EE');
    fillRR(g, cx - 12, 404, 9, 8, 2, BLUE); fillRR(g, cx + 3, 404, 9, 8, 2, RED); fillRR(g, cx - 14, 420, 28, 3, 1, '#C9D3E3');
    fillRR(g, cx - 20, 306, 40, 80, 16, 'rgba(160,205,240,.78)'); fillRR(g, cx - 16, 314, 12, 60, 6, 'rgba(255,255,255,.45)'); fillRR(g, cx - 8, 300, 16, 10, 3, '#9CC3E6');
    /* the interview corner: a round rug, two armchairs, a low table with a desk mic */
    var co = NR.corner; g.save(); g.globalAlpha = 0.9; fillE(g, co.x, co.y + 8, 150, 26, '#D9E3F4'); g.restore(); g.strokeStyle = 'rgba(226,69,60,.45)'; g.lineWidth = 2; g.beginPath(); g.ellipse(co.x, co.y + 8, 138, 21, 0, 0, 7); g.stroke();
    [[-1, BLUE], [1, RED]].forEach(function (a) { var x = co.x + a[0] * 96; soft(g, x, co.y + 8, 44, 7, 0.26); fillRR(g, x - 38, co.y - 70, 76, 56, 16, a[1]); fillRR(g, x - 42, co.y - 34, 84, 30, 10, a[1]);
      fillRR(g, x - 34, co.y - 30, 68, 14, 6, 'rgba(255,255,255,.22)'); fillRR(g, x - 46, co.y - 44, 14, 38, 7, a[1]); fillRR(g, x + 32, co.y - 44, 14, 38, 7, a[1]);
      fillRR(g, x - 36, co.y - 6, 6, 12, 2, '#3A4458'); fillRR(g, x + 30, co.y - 6, 6, 12, 2, '#3A4458'); });
    soft(g, co.x, co.y + 8, 40, 6, 0.26); fillRR(g, co.x - 34, co.y - 34, 68, 8, 4, '#FFFFFF'); fillRR(g, co.x - 3, co.y - 26, 6, 32, 2, '#9AA6BC'); fillRR(g, co.x - 18, co.y + 4, 36, 5, 2, '#9AA6BC');
    g.strokeStyle = '#2A3142'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(co.x + 18, co.y - 34); g.lineTo(co.x + 26, co.y - 58); g.stroke(); fillRR(g, co.x + 20, co.y - 70, 12, 14, 6, '#2A3142'); fillRR(g, co.x + 18, co.y - 62, 16, 4, 2, RED);
    fillRR(g, co.x - 26, co.y - 44, 11, 10, 3, '#FFFFFF'); fillRR(g, co.x - 26, co.y - 44, 11, 3, 1, BLUE);
    /* tape marks on the studio floor */
    g.strokeStyle = 'rgba(255,216,74,.9)'; g.lineWidth = 4; g.lineCap = 'butt'; [[-420, 520], [-60, 528], [110, 640]].forEach(function (p) { g.beginPath(); g.moveTo(p[0] - 10, p[1] - 4); g.lineTo(p[0] + 10, p[1] + 4); g.moveTo(p[0] + 10, p[1] - 4); g.lineTo(p[0] - 10, p[1] + 4); g.stroke(); });
    g.strokeStyle = 'rgba(226,69,60,.7)'; g.beginPath(); g.moveTo(-300, 652); g.lineTo(-260, 652); g.moveTo(-280, 652); g.lineTo(-280, 666); g.stroke();
    K.plant(g, { x: -14, y: F }, '#FFFFFF', '#E3E8EF');
  }
  function newsroomFront(g) {
    /* the fact-checker's research desk: open (her legs show), the monitor BESIDE her, a lamp, the out-tray */
    var d = NR.rdesk; CO.desk(g, d.x, d.y, d.w, F, { open: true, legs: '#7A869C', top: '#E9EEF8' }); fillRR(g, d.x - 6, d.y + 9, d.w + 12, 3, 1, RED);
    g.fillStyle = '#5C6B7A'; g.fillRect(d.x + 150, d.y - 24, 4, 24); fillRR(g, d.x + 138, d.y - 4, 28, 5, 2, '#5C6B7A'); fillRR(g, d.x + 116, d.y - 76, 74, 54, 5, '#2A3550');
    g.strokeStyle = '#5C6B7A'; g.lineWidth = 3; g.lineCap = 'round'; g.beginPath(); g.moveTo(d.x + 204, d.y); g.lineTo(d.x + 196, d.y - 44); g.lineTo(d.x + 178, d.y - 60); g.stroke();
    g.fillStyle = Y; g.beginPath(); g.moveTo(d.x + 166, d.y - 54); g.lineTo(d.x + 188, d.y - 70); g.lineTo(d.x + 196, d.y - 58); g.lineTo(d.x + 176, d.y - 44); g.closePath(); g.fill();
    fillRR(g, d.x + 4, d.y - 12, 44, 12, 2, '#9AA6BC'); for (var p = 0; p < 3; p++) fillRR(g, d.x + 8 + p, d.y - 14 - p * 3, 36, 3, 1, p % 2 ? '#F1F4F9' : '#FFFFFF'); text(g, 'CHECKED', d.x + 26, d.y - 2.5, 5.4, 800, '#FFFFFF', 'center');
  }
  function paintFront(g, ext) {
    newsroomFront(g);
    /* the writer's open desk with a laptop, a mug, and her paper bin */
    var wd = T.write; CO.desk(g, wd.x, wd.y, wd.w, F, { open: true, legs: '#7A869C', top: '#C9A27A' });
    fillRR(g, wd.x + 50, wd.y - 36, 60, 36, 4, '#2A3550'); fillRR(g, wd.x + 42, wd.y - 4, 76, 6, 3, '#9AA6BC');
    fillRR(g, wd.x + 132, wd.y - 18, 16, 18, 4, '#FFFFFF'); fillRR(g, wd.x + 132, wd.y - 18, 16, 5, 2, BLUE); g.strokeStyle = '#FFFFFF'; g.lineWidth = 3; g.beginPath(); g.arc(wd.x + 150, wd.y - 10, 5, -1.2, 1.2); g.stroke();
    for (var pp = 0; pp < 4; pp++) fillRR(g, wd.x + 6 + pp, wd.y - 4 - pp * 2.5, 30, 2.5, 1, pp % 2 ? '#F1F4F9' : '#FFFFFF');
    var bx = T.bin.x; soft(g, bx, F + 3, 24, 5, 0.3); g.fillStyle = '#9AA6BC'; g.beginPath(); g.moveTo(bx - 17, F - 36); g.lineTo(bx + 17, F - 36); g.lineTo(bx + 13, F); g.lineTo(bx - 13, F); g.closePath(); g.fill(); fillE(g, bx, F - 36, 17, 4, '#7A869C');
    g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 1.5; g.beginPath(); for (var bl = -10; bl <= 10; bl += 5) { g.moveTo(bx + bl, F - 32); g.lineTo(bx + bl * 0.8, F - 3); } g.stroke();
    /* the glass news desk: a light top, a tinted glass front (legs show through), the TechNext logo */
    var d = T.desk; soft(g, d.x + d.w / 2, F + 4, d.w * 0.6, 10, 0.4);
    g.fillStyle = 'rgba(160,200,255,.2)'; g.beginPath(); g.moveTo(d.x - 10, d.y + 10); g.lineTo(d.x + d.w + 10, d.y + 10); g.lineTo(d.x + d.w - 20, F); g.lineTo(d.x + 20, F); g.closePath(); g.fill();
    g.strokeStyle = 'rgba(160,200,255,.6)'; g.lineWidth = 2; g.stroke();
    fillRR(g, d.x - 16, d.y, d.w + 32, 14, 7, '#E9EEF8'); fillRR(g, d.x - 16, d.y + 10, d.w + 32, 4, 2, BLUE);
    fillRR(g, d.x + d.w / 2 - 60, d.y + 30, 120, 26, 6, 'rgba(49,103,202,.85)'); CO.plane(g, d.x + d.w / 2 - 40, d.y + 43, 0.9, 0, '#FFFFFF', BLUE); text(g, 'TechNext News', d.x + d.w / 2 + 6, d.y + 47, 9.5, 800, '#FFFFFF', 'center');
    fillRR(g, d.x + d.w - 66, d.y - 14, 13, 14, 4, '#FFFFFF'); fillRR(g, d.x + d.w - 40, d.y - 22, 26, 22, 3, '#2A3550');
  }
  /* the foreground: the dolly track, cables, a floor monitor, the director's chair, bundles of the Odoo 20 edition */
  function paintFore(g, ext) {
    g.fillStyle = 'rgba(120,130,150,.5)'; for (var sl = Math.floor(ext.l / 30) * 30; sl < ext.r; sl += 30) fillRR(g, sl, 642, 12, 24, 2, '#B9A27E');
    g.fillStyle = '#7A869C'; g.fillRect(ext.l, 646, ext.r - ext.l, 4); g.fillRect(ext.l, 660, ext.r - ext.l, 4); g.fillStyle = 'rgba(255,255,255,.6)'; g.fillRect(ext.l, 646, ext.r - ext.l, 1.5); g.fillRect(ext.l, 660, ext.r - ext.l, 1.5);
    g.strokeStyle = '#2A3142'; g.lineWidth = 3; g.lineCap = 'round'; g.beginPath(); g.moveTo(736, F); g.bezierCurveTo(700, 560, 560, 700, 380, 690); g.bezierCurveTo(240, 684, 160, 700, -100, 694); g.stroke();
    g.strokeStyle = '#E2453C'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(560, F); g.bezierCurveTo(600, 600, 760, 700, 980, 688); g.lineTo(1300, 700); g.stroke();
    /* the floor monitor wedge */
    soft(g, 236, 712, 44, 6, 0.3); g.fillStyle = '#2A3142'; g.beginPath(); g.moveTo(190, 708); g.lineTo(282, 708); g.lineTo(272, 668); g.lineTo(202, 668); g.closePath(); g.fill();
    /* the director's chair */
    soft(g, 960, 714, 50, 6, 0.3); g.strokeStyle = '#8E6A47'; g.lineWidth = 6; g.beginPath(); g.moveTo(924, 712); g.lineTo(996, 640); g.moveTo(996, 712); g.lineTo(924, 640); g.moveTo(920, 640); g.lineTo(920, 598); g.moveTo(1000, 640); g.lineTo(1000, 598); g.stroke();
    fillRR(g, 914, 632, 92, 12, 4, RED); fillRR(g, 914, 590, 92, 30, 4, INK); text(g, 'TECHNEXT NEWS', 960, 610, 9, 800, Y, 'center');
    /* bundles of papers */
    [[1060, 0], [1100, 1], [-150, 0]].forEach(function (b) { var x = b[0]; soft(g, x + 30, 714, 40, 5, 0.25); for (var i = 0; i < 4; i++) fillRR(g, x + (i % 2) * 2, 704 - i * 12, 60, 12, 2, i % 2 ? '#F1EEE6' : '#FFFDF8');
      g.strokeStyle = '#B5865A'; g.lineWidth = 2; g.beginPath(); g.moveTo(x + 20, 656); g.lineTo(x + 20, 716); g.moveTo(x + 40, 656); g.lineTo(x + 40, 716); g.stroke(); fillRR(g, x + 6, 666, 48, 10, 2, RED); text(g, 'ODOO 20', x + 30, 674, 7, 800, '#FFFFFF', 'center'); });
    if (ext.r > 1180) K.plant(g, { x: 1210, y: 730 }, RED, '#F05A50');
  }

  /* ------------------------------------------------------------ the cast */
  var W = CR.who;
  var ANC = W({ x: 522, y: 470, s: 0.54, ph: 0.6, skin: 1, hair: 0, style: 'bob', outfit: 'cardigan', top: '#1E3A6E', top2: '#DCE7FB', sit: true, chairCol: '#0B0F24', hands: [[-80, -190], [80, -190]] });
  var WRT = W({ x: 226, y: 470, s: 0.5, ph: 1.4, skin: 2, hair: 1, style: 'short', outfit: 'polo', top: TEAL, glasses: true, sit: true, chairCol: '#2A3550', hands: [[-60, -200], [60, -200]], look: 0.3 });
  var CAMOP = W({ x: 820, y: 470, s: 0.52, ph: 2.1, skin: 3, hair: 0, style: 'short', outfit: 'shirt', top: '#F08A24', headset: BLUE, hands: [[-120, -250], [-60, -200]], look: -0.7 });
  var FM = W({ x: 346, y: 470, s: 0.5, ph: 0.3, skin: 0, hair: 2, style: 'pony', outfit: 'polo', top: PUR, top2: '#FFFFFF', headset: RED, hands: [[-70, -160], [100, -330]], look: 0.3 });
  var PROD = W({ x: 1214, y: 470, s: 0.5, ph: 2.7, skin: 4, hair: 1, style: 'short', outfit: 'cardigan', top: '#2A3550', top2: '#DCE7FB', glasses: true, hands: [[-120, -330], [60, -160]], look: -0.8 });
  var FC = W({ x: -404, y: 470, s: 0.5, ph: 1.7, skin: 1, hair: 1, style: 'bun', outfit: 'cardigan', top: '#F08A24', top2: '#FFFFFF', glasses: true, sit: true, chairCol: RED, hands: [[-60, -200], [60, -200]], look: 0.5 });
  var OPR = W({ x: -560, y: 470, s: 0.5, ph: 1.1, skin: 1, hair: 0, style: 'short', outfit: 'shirt', top: '#5C6B8A', hands: [[-110, -250], [60, -160]], look: -0.6 });
  var CREW = [
    { x0: -900, x1: -610, y: 520, spd: 14, ph: 0.4, label: 'Editor', lines: ['Plain language first. **No jargon** gets past me.', 'Next up: what Odoo 20 means for **month-end**.'], acts: ['nod', 'id', 'think'],
      P: W({ s: 0.5, skin: 0, hair: 2, style: 'long', outfit: 'shirt', top: '#E0456B', hold: 'clipboard' }) },
    { front: true, x0: -440, x1: 90, y: 624, spd: 18, ph: 0.6, label: 'Reporter', lines: ['Live from **Odoo Experience 2026**, five takeaways!', 'Reporting for Singapore, the Philippines and Vietnam.'], acts: ['cheer', 'wave', 'id'],
      P: W({ s: 0.58, skin: 4, hair: 1, style: 'short', outfit: 'polo', top: BLUE, hold: 'tablet', hands: [[-60, -212], [70, -150]] }) },
    { front: true, x0: 1060, x1: 1300, y: 700, spd: 15, ph: 0.2, label: 'Studio runner', lines: ['Coffee for the **newsroom**!', 'Two flat whites for the desk, one for camera one.'], acts: ['jump', 'wave', 'dance'],
      P: W({ s: 0.58, skin: 2, hair: 0, style: 'bob', outfit: 'shirt', top: Y, hold: 'tray', hands: [[-60, -212], [70, -150]] }) }
  ];

  var FCT = { t: -9 }, AIR = { t: -9 }, SHOT = { t: -9 }, CUE = { t: -9 }, BALL = { t: -9, x: 0, y: 0 }, PRODT = { t: -9 }, OPRT = { t: -9 }, SIGN = { t: -9 };
  /* ---- the anchor: idle, squares her script on the desk and talks to camera; tapped, holds up BREAKING and swivels her chair */
  function actAnc(P, t, S) {
    var st = S.cast.anc, u = tapAge(st, t), busy = S.hot === 'o20' || S.hot === 'news', cue = t - CUE.t; reset(P);
    var cyc = (t + 1) % 6; P.talk = t < st.until || busy || (cyc > 2 && cyc < 4.6) || (cue > 1.6 && cue < 3.6); P.mood = P.talk ? 'happy' : 'calm';
    if (cyc < 1.2) { var tp = Math.abs(Math.sin(cyc * 8)) * 12; P.hands = [[-50, -200 + tp], [50, -200 + tp]]; P._paper = 1; P.look = 0; }
    else { P._paper = 0; P.hands = P.talk ? [[-80, -190], [90 + Math.sin(t * 3) * 14, -230 + Math.cos(t * 2.4) * 10]] : [[-80, -190], [80, -190]]; P.look = lerp(P.look, cyc > 4.6 ? 0.6 : 0, 0.06); }
    if (busy) { P.hands = [[-80, -190], [120 + Math.sin(t * 3) * 10, -260]]; P.look = lerp(P.look, 0.5, 0.08); }
    if (u < 2.6) { P.talk = true; P.mood = u < 0.4 ? 'wow' : 'happy'; P._paper = 0;
      if (u < 1.6) P.hands = [[60, -250], [150, -340 + Math.sin(u * 9) * 4]]; else { var sp = ease((u - 1.6) / 0.8); P.sx = Math.cos(sp * Math.PI * 2); P.hands = [[-90, -200], [90, -200]]; } }
    P._u = u;
  }
  /* ---- the writer: idle, types in bursts, stretches, sips coffee; tapped, crumples a draft and lands it in the bin */
  function actWrt(P, t, S) {
    var st = S.cast.wrt, u = tapAge(st, t), busy = S.hot === 'guides'; reset(P);
    var cyc = (t + 2.5) % 9; P.talk = t < st.until; P.mood = P.talk || busy ? 'happy' : 'calm'; P._mug = 0;
    if (busy || cyc < 5) { var k2 = Math.abs(Math.sin(t * (busy ? 14 : 9))) * 6; P.hands = [[-60, -200 - k2], [60, -200 - (6 - k2)]]; P.look = lerp(P.look, 0.3, 0.06); }
    else if (cyc < 6.6) { P.hands = [[-90, -400], [90, -400]]; P.mood = 'happy'; P.tilt = Math.sin((cyc - 5) * 3) * 0.06; P.look = 0; }
    else { P.hands = [[-60, -200], [30, -330]]; P._mug = 1; P.look = lerp(P.look, -0.2, 0.06); }
    if (u < 2.4) { P.talk = true; P._mug = 0;
      if (u < 0.5) P.hands = [[-20, -230], [20, -230]];
      else if (u < 0.8) P.hands = [[-60, -200], [-10 - ease((u - 0.5) / 0.3) * 80, -300 - ease((u - 0.5) / 0.3) * 60]];
      else { P.hands = [[-60, -200], [120, -330]]; if (BALL.t < st.tT) { BALL.t = t; var hb = handW(P, 1); BALL.x = hb[0]; BALL.y = hb[1]; } }
      P.mood = u > 1.6 ? 'happy' : 'calm'; P.look = u > 0.8 ? 0.9 : 0; }
    P._u = u;
  }
  /* ---- the camera operator: idle, pans camera one and peeks into the viewfinder; tapped, counts 3-2-1 and cues the anchor */
  function actCam(P, t, S) {
    var st = S.cast.cam, u = tapAge(st, t); reset(P);
    var cyc = (t + 4) % 8; P.talk = t < st.until; P.mood = P.talk ? 'happy' : 'calm'; P._thumb = 0;
    P.hands = [[-124 + Math.sin(t * 0.7) * 6, -250 + Math.sin(t * 0.7) * 3], [-64, -200]]; P.look = -0.7;
    if (cyc > 5 && cyc < 6.4) { P.tilt = -0.1; P.look = -1; }
    if (cyc > 6.8) { P.hands = [[-124, -250], [80, -330]]; P._thumb = 1; P.mood = 'happy'; P.look = 0.2; }
    if (u < 3.4) { P.talk = true; P.mood = 'happy'; P._thumb = 0;
      if (u < 2.4) { P.hands = [[-124, -250], [96, -360 + Math.abs(Math.sin(u * Math.PI)) * 10]]; P.look = 0.1; }
      else { P.hands = [[-124, -250], [-150, -300]]; P.look = -1; if (CUE.t < st.tT) { CUE.t = st.tT; CR.burst('spark', 522, 270, t); } } }
    P._u = u;
  }
  /* ---- the floor manager: idle, flips cue cards for the anchor; tapped, snaps the clapperboard: TAKE 20 */
  function actFm(P, t, S) {
    var st = S.cast.fm, u = tapAge(st, t); reset(P);
    var ci = Math.floor(t / 3) % CUES.length, fl = (t % 3); P.talk = t < st.until; P.mood = P.talk ? 'happy' : 'calm';
    P.hands = [[-70, -170], [130, -320 + Math.sin(t * 1.5) * 6]]; P.look = lerp(P.look, 0.6, 0.06); P.tilt = Math.sin(t * 0.9) * 0.03;
    P._cue = CUES[ci]; P._flip = fl < 0.25 ? Math.cos(fl / 0.25 * Math.PI) : 1;
    if (u < 2.2) { P._cue = ''; P.talk = true; P.mood = u > 0.6 ? 'happy' : 'calm'; P.hands = [[60, -250], [150, -330]]; P.hop = u > 0.62 && u < 1.0 ? Math.sin((u - 0.62) / 0.38 * Math.PI) * 22 : 0;
      if (u > 0.6 && !st._snap) { st._snap = 1; CR.burst('spark', P.x, P.y - 250, t); } if (u < 0.1) st._snap = 0; }
    P._u = u;
  }
  /* ---- the fact-checker (behind the title card): idle, highlights a printout line by line, holds it up to read, taps her pen
     on her chin, types a note; tapped, she holds the page up, it gets a big green CHECKED, and she spins her chair */
  function actFc(P, t) {
    var u = t - FCT.t, cyc = (t + 1) % 8; reset(P); P.talk = false; P.mood = 'calm'; P._sheet = 0; P._pen = 0;
    if (cyc < 3.5) { P.hands = [[-50, -204], [10 + ((cyc * 0.8) % 1) * 70, -210]]; P._sheet = 1; P._pen = 1; P.look = 0.2; P.tilt = 0.03; }
    else if (cyc < 5.5) { P.hands = [[-50, -320], [50, -320]]; P._sheet = 2; P.look = 0; P.mood = cyc > 4.6 ? 'happy' : 'calm'; }
    else if (cyc < 6.6) { P.hands = [[-60, -200], [30, -350]]; P._pen = 2; P.look = -0.3; P.tilt = -0.05; }
    else { var k2 = Math.abs(Math.sin(t * 10)) * 6; P.hands = [[20, -206 - k2], [90, -206 - (6 - k2)]]; P.look = 0.7; }
    if (u < 2.4) { P.talk = true; P.mood = 'happy'; P._pen = 0;
      if (u < 1.4) { P.hands = [[-40, -360], [60, -360]]; P._sheet = 3; P.hop = u > 0.4 && u < 0.8 ? Math.sin((u - 0.4) / 0.4 * Math.PI) * 10 : 0; }
      else { P._sheet = 0; P.sx = Math.cos(ease((u - 1.4) / 1) * Math.PI * 2); P.hands = [[-110, -300], [110, -300]]; } }
    P._u = u;
  }
  /* ---- the producer (right) and the press operator (far left), drawn and tapped by this file */
  function actProd(P, t) {
    var u = t - PRODT.t; reset(P); var cyc = t % 4; P.hands = cyc < 2 ? [[-130, -300 + Math.sin(cyc * Math.PI) * -40], [60, -160]] : [[-70, -180], [60, -160]];
    P.look = -0.8; P.mood = cyc < 2 ? 'happy' : 'calm'; P.talk = cyc > 2.4 && cyc < 3.4; P.x = 1214 + Math.sin(t * 0.5) * 6;
    if (u < 1.8) { P.hands = [[-120, -330], [120, -380]]; P.mood = 'happy'; P.talk = true; P.hop = Math.abs(Math.sin(u / 1.8 * Math.PI * 2)) * 20; }
  }
  function actOpr(P, t) {
    var u = t - OPRT.t; reset(P); P.hands = [[-110, -250 + Math.sin(t * 4) * 8], [60, -160]]; P.look = -0.6; P.mood = 'calm';
    if (u < 1.8) { P.hands = [[-90, -380], [100, -380]]; P.mood = 'happy'; P.talk = true; P.hop = Math.sin(u / 1.8 * Math.PI) * 16; }
  }

  /* ------------------------------------------------------------ live layers */
  function paintLive(g, t, now, S) {
    var w = T.wall, on = S.hot === 'o20';
    /* the video wall: ODOO 20 headline, six feature tiles that light in turn, BREAKING */
    var vg = g.createLinearGradient(w.x, w.y, w.x + w.w, w.y + w.h); vg.addColorStop(0, '#1D2A6B'); vg.addColorStop(1, '#4A2E6E'); g.fillStyle = vg; g.fillRect(w.x, w.y, w.w, w.h);
    for (var gx = 1; gx < 4; gx++) { g.fillStyle = 'rgba(255,255,255,.04)'; g.fillRect(w.x + gx * w.w / 4, w.y, 1, w.h); }
    fillRR(g, w.x + 16, w.y + 14, 118, 26, 4, RED); text(g, 'BREAKING', w.x + 75, w.y + 32, 12, 800, '#FFFFFF', 'center');
    var pulse = 0.5 + 0.5 * Math.sin(t * 4); fillE(g, w.x + 148, w.y + 27, 5, 5, 'rgba(255,90,80,' + (0.4 + pulse * 0.6).toFixed(2) + ')'); text(g, 'LIVE', w.x + 158, w.y + 31, 9, 800, '#FFB4AE');
    text(g, 'Odoo 20', w.x + 16, w.y + 84, 40, 800, '#FFFFFF'); g.font = '800 40px ' + K.FONT; text(g, 'is here, explained plainly', w.x + 30 + g.measureText('Odoo 20').width, w.y + 80, 12, 700, '#C9D6EE');
    var lit = Math.floor(t * (on ? 1.6 : 0.6)) % 6, tw0 = (w.w - 32 - 16) / 3;
    NEWS.forEach(function (n, i) { var tx = w.x + 16 + (i % 3) * (tw0 + 8), ty = w.y + 104 + Math.floor(i / 3) * 62, hi = i === lit;
      fillRR(g, tx, ty, tw0, 52, 8, hi ? '#FFFFFF' : 'rgba(255,255,255,.1)'); fillRR(g, tx, ty, 6, 52, 3, ['#3167CA', '#14A38B', '#F08A24', PUR, '#FFD84A', '#E0456B'][i]);
      text(g, n[0], tx + 16, ty + 22, 12, 800, hi ? C.ink : '#FFFFFF'); text(g, n[1], tx + 16, ty + 39, 8.5, 700, hi ? '#5C5C73' : '#C9D6EE'); });
    /* the ticker under the wall */
    var tk = S.hot === 'news' ? 90 : 46, ty2 = w.y + w.h - 30; g.save(); g.beginPath(); g.rect(w.x, ty2, w.w, 30); g.clip(); g.fillStyle = Y; g.fillRect(w.x, ty2, w.w, 30);
    g.font = '800 11px ' + K.FONT; g.textAlign = 'left'; var tw = g.measureText(TICK).width, off = (t * tk) % tw; g.fillStyle = C.ink; g.fillText(TICK + TICK, w.x + 106 - off, ty2 + 19);
    fillRR(g, w.x, ty2, 96, 30, 0, RED); text(g, 'LATEST', w.x + 48, ty2 + 20, 11, 800, '#FFFFFF', 'center'); g.restore();
    /* the three office clocks */
    var ck = T.clocks, dt = new Date(); [8, 8, 7].forEach(function (o, i) { var d = new Date(dt.getTime() + o * 3600e3); K.clockHands(g, { x: ck.x + i * 50, y: ck.y - 2, r: 15 }, d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds()); });
    /* the markets screen: three markets light in turn, a scan line */
    var m = T.map, mk = Math.floor(t * (S.hot === 'markets' ? 2 : 0.7)) % 3;
    [['SG', 60, 78, BLUE], ['PH', 112, 50, TEAL], ['VN', 68, 44, '#F08A24']].forEach(function (p, i) { var hi = i === mk, x = m.x + p[1], y = m.y + p[2];
      if (hi) { g.globalAlpha = 0.35; fillE(g, x, y, 16, 16, p[3]); g.globalAlpha = 1; } fillE(g, x, y, 6, 6, p[3]); text(g, p[0], x + 10, y + 4, 8, 800, '#FFFFFF'); });
    g.fillStyle = 'rgba(159,196,255,.18)'; g.fillRect(m.x, m.y + ((t * 30) % m.h), m.w, 3);
    /* the calendar: the next event date blinks */
    var c = T.cal, ev = [3, 8, 14, 17][Math.floor(t / 1.5) % 4], ex = c.x + 8 + (ev % 5) * 20.5, ey = c.y + 28 + Math.floor(ev / 5) * 15; g.strokeStyle = RED; g.lineWidth = 1.5; rr(g, ex - 2, ey - 2, 20, 15, 3); g.stroke();
    /* ON AIR: lit; tapped, it flashes */
    var oa = T.onair, at = t - AIR.t, lit2 = at < 1.6 ? (Math.floor(at * 8) % 2 === 0) : true; fillRR(g, oa.x, oa.y, 120, 34, 7, lit2 ? RED : '#5A1E1B'); text(g, 'ON AIR', oa.x + 60, oa.y + 23, 15, 800, lit2 ? '#FFFFFF' : '#C98A85', 'center');
    if (lit2) { g.save(); g.globalAlpha = 0.12; fillE(g, oa.x + 60, oa.y + 17, 74, 26, RED); g.restore(); }
    /* camera one: the head pans; tally light; tapped, a flash */
    var cm = T.cam, pan = Math.sin(t * 0.7) * 0.05 + (t - CUE.t < 3 ? -0.04 : 0), sh = t - SHOT.t;
    g.save(); g.translate(cm.x + 46, cm.y + 56); g.rotate(pan); g.translate(-(cm.x + 46), -(cm.y + 56));
    fillRR(g, cm.x, cm.y, 92, 54, 8, '#2A3142'); fillRR(g, cm.x - 26, cm.y + 12, 26, 30, 6, '#1B1F3B'); fillE(g, cm.x - 28, cm.y + 27, 12, 14, '#0B0F24'); fillE(g, cm.x - 28, cm.y + 27, 7, 8, '#3A5A9A'); fillE(g, cm.x - 30, cm.y + 24, 2.5, 3, 'rgba(255,255,255,.6)');
    fillRR(g, cm.x + 44, cm.y + 8, 40, 26, 3, '#1D2A6B'); fillRR(g, cm.x + 48, cm.y + 12, 32 * ((t * 0.3) % 1), 3, 1.5, '#9FC4FF'); fillRR(g, cm.x + 50, cm.y + 20, 20, 10, 2, '#4A2E6E');
    text(g, 'TN-CAM 1', cm.x + 26, cm.y + 48, 6.4, 800, '#AFC0DD', 'center'); fillRR(g, cm.x + 86, cm.y + 30, 34, 6, 3, '#5C6B7A');
    var tally = t - CUE.t < 3 || Math.floor(t * 2) % 2; fillE(g, cm.x + 14, cm.y + 8, 4, 4, tally ? RED : '#7A2C27'); g.restore();
    if (sh < 0.5) { g.save(); g.globalAlpha = 1 - sh * 2; fillE(g, cm.x - 28, cm.y + 27, 60, 60, 'rgba(255,255,255,.8)'); g.restore(); }
    /* the story board: stories travel DRAFT → EDIT → LIVE */
    var bd = T.board; if (S.ext.r > bd.x) { STORIES.forEach(function (s, i) { var ph = (t / 3.2 + i * 0.5), col = Math.floor(ph) % 3, f = ph % 1, mv = f > 0.8 ? ease((f - 0.8) / 0.2) : 0, row = i % 4;
        var x = bd.x + 10 + (col + (col < 2 ? mv : 0)) * 52, y = bd.y + 50 + row * 46 + (i > 3 ? 23 : 0); if (col === 2 && mv > 0) return;
        fillRR(g, x, y, 42, 34, 3, col === 2 ? '#E6F6EE' : '#FFF7D6'); fillRR(g, x, y, 42, 6, 3, s[1]); text(g, s[0], x + 21, y + 21, 5.8, 800, C.ink, 'center'); fillRR(g, x + 6, y + 26, 30, 2, 1, '#C9D3E3'); }); }
    /* the press: rollers turn, the paper web runs, papers stack */
    var pr = T.press; if (S.ext.l < pr.x + pr.w + 40) { for (var pl = 0; pl < 3; pl++) { var rx = pr.x + 60 + pl * 90, ry = pr.y + 120, a = t * 3 + pl; g.strokeStyle = '#2A3142'; g.lineWidth = 3; g.beginPath(); g.moveTo(rx + Math.cos(a) * 20, ry + Math.sin(a) * 20); g.lineTo(rx - Math.cos(a) * 20, ry - Math.sin(a) * 20); g.moveTo(rx + Math.cos(a + 1.57) * 20, ry + Math.sin(a + 1.57) * 20); g.lineTo(rx - Math.cos(a + 1.57) * 20, ry - Math.sin(a + 1.57) * 20); g.stroke(); }
      g.fillStyle = '#FFFDF8'; g.fillRect(pr.x + 30, pr.y + 92, pr.w - 60, 6); g.fillStyle = 'rgba(20,26,58,.35)'; for (var wb = 0; wb < 8; wb++) g.fillRect(pr.x + 30 + ((wb * 40 + t * 60) % (pr.w - 60)), pr.y + 93, 14, 4);
      var sheet = (t * 0.8) % 1, sx2 = pr.x + pr.w - 10 + sheet * 60; g.save(); g.translate(sx2, pr.y + 176 + sheet * 60); g.rotate(sheet * 0.4); fillRR(g, -20, -12, 40, 24, 2, '#FFFDF8'); fillRR(g, -16, -8, 32, 4, 1, INK); fillRR(g, -16, 0, 22, 2, 1, '#C9D3E3'); g.restore();
      for (var stk = 0; stk < 6; stk++) fillRR(g, pr.x + pr.w + 50 + (stk % 2), F - 8 - stk * 6, 52, 6, 1, stk % 2 ? '#F1EEE6' : '#FFFDF8'); }
    newsroomLive(g, t, S); actFc(FC, t); K.person(g, FC, t);
    actProd(PROD, t); K.person(g, PROD, t); actOpr(OPR, t); K.person(g, OPR, t);
    if (t - PRODT.t < 1.8) { var hp = handW(PROD, 1); fillRR(g, hp[0] - 22, hp[1] - 30, 44, 22, 4, TEAL); text(g, 'PUBLISHED', hp[0], hp[1] - 15, 6.6, 800, '#FFFFFF', 'center'); }
    if (t - OPRT.t < 1.8) { var ho = handW(OPR, 1); fillRR(g, ho[0] - 26, ho[1] - 40, 52, 36, 2, '#FFFDF8'); fillRR(g, ho[0] - 22, ho[1] - 36, 44, 6, 1, INK); text(g, 'ODOO 20', ho[0], ho[1] - 14, 7, 800, RED, 'center'); }
    CO.crew(CREW, g, t, S, false);
  }
  /* the newsroom corner, live: the four feeds on the monitor wall, the rundown's NOW marker, bubbles in the cooler */
  function newsroomLive(g, t, S) {
    var m = NR.mons, rec = Math.floor(t * 1.6) % 2;
    for (var i = 0; i < 4; i++) { var x = m.x + (i % 2) * (m.w + 6), y = m.y + Math.floor(i / 2) * (m.h + 6); g.save(); g.beginPath(); g.rect(x, y, m.w, m.h); g.clip();
      if (i === 0) { fillRR(g, x, y, m.w, m.h, 0, '#DCE6F7'); fillE(g, x + 52, y + 30, 13, 13, '#F0CBA8'); fillE(g, x + 52, y + 24, 14, 9, '#1A1414'); fillRR(g, x + 30, y + 42, 44, 24, 10, '#1E3A6E');
        fillRR(g, x + 4, y + 46, 70, 12, 1, '#FFFFFF'); fillRR(g, x + 4, y + 46, 5, 12, 1, RED); fillRR(g, x + 12, y + 50, 36 + Math.sin(t * 2) * 8, 3, 1, INK); text(g, 'CAM 1', x + m.w - 4, y + 10, 6, 800, RED, 'right'); }
      else if (i === 1) { ['#FFFFFF', '#FFD84A', '#14C8C8', '#2BC48A', '#E0456B', '#E2453C', '#3167CA'].forEach(function (c, j) { g.fillStyle = c; g.fillRect(x + j * m.w / 7, y, m.w / 7 + 1, m.h * 0.7); }); g.fillStyle = '#1D2A6B'; g.fillRect(x, y + m.h * 0.7, m.w, m.h * 0.3);
        fillE(g, x + 12, y + m.h - 9, 3.5, 3.5, rec ? RED : '#6A2A26'); text(g, 'REC', x + 20, y + m.h - 6, 7, 800, '#FFFFFF'); text(g, '00:' + (10 + Math.floor(t) % 50), x + m.w - 6, y + m.h - 6, 7, 800, '#9FC4FF', 'right'); }
      else if (i === 2) { fillRR(g, x, y, m.w, m.h, 0, '#2B2A6E'); g.fillStyle = 'rgba(113,75,103,.45)'; g.fillRect(x + m.w / 2, y, m.w / 2, m.h);
        text(g, 'Odoo 20', x + 10, y + 34, 18, 800, '#FFFFFF'); text(g, 'explained plainly', x + 10, y + 48, 7.5, 700, '#C9D6EE'); var sh = ((t * 0.5) % 1.6) * m.w * 1.4 - 30; g.fillStyle = 'rgba(255,255,255,.18)'; g.beginPath(); g.moveTo(x + sh, y); g.lineTo(x + sh + 18, y); g.lineTo(x + sh - 6, y + m.h); g.lineTo(x + sh - 24, y + m.h); g.closePath(); g.fill(); }
      else { fillRR(g, x, y, m.w, m.h, 0, '#16224A'); [['SG', 70, 46, BLUE], ['PH', 84, 22, TEAL], ['VN', 54, 18, '#F08A24']].forEach(function (p, j) { var pu = ((t * 0.8 + j * 0.33) % 1); g.globalAlpha = 1 - pu; fillE(g, x + p[1], y + p[2], 4 + pu * 12, 4 + pu * 12, p[3]); g.globalAlpha = 1; fillE(g, x + p[1], y + p[2], 3.5, 3.5, p[3]); text(g, p[0], x + p[1] - 8, y + p[2] + 3, 6.5, 800, '#FFFFFF', 'right'); });
        text(g, 'WE WRITE FOR', x + 6, y + m.h - 6, 6, 800, '#9FC4FF'); }
      g.restore(); }
    var r = NR.run, now = Math.floor(t / 3) % RUN.length, ny = r.y + 30 + now * 22; g.strokeStyle = RUN[now][1]; g.lineWidth = 2; rr(g, r.x + 10, ny, r.w - 20, 18, 3); g.stroke();
    fillRR(g, r.x + r.w - 54, ny + 3, 38, 12, 6, RED); text(g, 'NOW', r.x + r.w - 35, ny + 12, 7, 800, '#FFFFFF', 'center');
    var cx = NR.cool.x; for (var b = 0; b < 3; b++) { var bu = (t * 0.45 + b * 0.37) % 1; fillE(g, cx - 4 + b * 5 + Math.sin(t * 3 + b) * 2, 376 - bu * 64, 2.2 + b * 0.6, 2.2 + b * 0.6, 'rgba(255,255,255,.75)'); }
  }
  function paintFrontLive(g, t, S) {
    CO.crew(CREW, g, t, S, true);
    /* the fact-checker's monitor, her printout, her pen, and the CHECKED stamp */
    var d = NR.rdesk; CO.screen(g, d.x + 120, d.y - 72, 66, 46, t, 'text'); fillRR(g, d.x + 120, d.y - 72, 66, 7, 2, RED); text(g, 'FACT CHECK', d.x + 124, d.y - 66.5, 4.6, 800, '#FFFFFF');
    if (FC._sheet) { var h0 = handW(FC, 0), h1 = handW(FC, 1), up = FC._sheet >= 2, px = up ? (h0[0] + h1[0]) / 2 : h0[0] + 26, py = up ? h0[1] - 22 : d.y - 3;
      if (up) { g.save(); g.translate(px, py); fillRR(g, -22, -16, 44, 32, 2, '#FFFFFF'); g.strokeStyle = '#C9D3E3'; g.lineWidth = 1; rr(g, -22, -16, 44, 32, 2); g.stroke(); fillRR(g, -17, -11, 26, 3, 1, INK); for (var l = 0; l < 4; l++) fillRR(g, -17, -4 + l * 5, l % 2 ? 24 : 34, 2, 1, '#C9D3E3');
        if (FC._sheet === 3) { var su = FC._u, sc = su < 0.5 ? ease((su - 0.25) / 0.25) : 1; if (su > 0.25) { g.rotate(-0.18); g.scale(sc, sc); g.strokeStyle = '#1E9E6A'; g.lineWidth = 2; rr(g, -24, -9, 48, 18, 3); g.stroke(); text(g, '\u2713 CHECKED', 0, 4, 8, 800, '#1E9E6A', 'center'); }
          if (su > 0.45 && !FCT.b) { FCT.b = 1; CR.burst('star', px, py - 10, t); } }
        g.restore(); }
      else { fillRR(g, px - 26, py - 3, 50, 4, 1, '#FFFFFF'); if (FC._pen === 1) fillRR(g, h1[0] - 10, py - 3.5, 18, 3, 1.5, 'rgba(255,216,74,.85)'); } }
    if (FCT.b && t - FCT.t > 2.4) FCT.b = 0;
    if (FC._pen) { var hp = handW(FC, 1); g.save(); g.translate(hp[0], hp[1] - 4); g.rotate(FC._pen === 2 ? -0.6 : 0.5); fillRR(g, -2, -14, 4, 16, 2, FC._pen === 1 ? Y : BLUE); g.restore(); }
    /* the writer's laptop: the article grows */
    var wd = T.write, n = Math.floor((t * (S.hot === 'guides' ? 3 : 1)) % 6); fillRR(g, wd.x + 54, wd.y - 32, 52, 28, 2, '#FFFFFF');
    for (var l = 0; l <= n && l < 5; l++) fillRR(g, wd.x + 58, wd.y - 28 + l * 5, l === n ? 20 : 40, 2.6, 1.3, l === 0 ? BLUE : '#C9D3E3');
    /* the writer's mug and her paper ball's flight into the bin */
    if (WRT._mug) { var hm = handW(WRT, 1); fillRR(g, hm[0] - 6, hm[1] - 14, 12, 14, 3, '#FFFFFF'); fillRR(g, hm[0] - 6, hm[1] - 14, 12, 4, 2, BLUE); }
    if (WRT._u < 0.8) { var hw = handW(WRT, 1); fillE(g, hw[0], hw[1] - 8, 7, 7, '#FFFDF8'); }
    var bu = t - BALL.t; if (bu < 0.9) { var f = bu / 0.9, bx = lerp(BALL.x, T.bin.x, f), by = lerp(BALL.y, F - 40, f) - Math.sin(f * Math.PI) * 80; fillE(g, bx, by, 7, 7, '#FFFDF8'); g.strokeStyle = '#C9D3E3'; g.lineWidth = 1; g.beginPath(); g.arc(bx, by, 4, 0, 4); g.stroke(); }
    if (bu > 0.88 && bu < 0.95 && !BALL.b) { BALL.b = 1; CR.burst('star', T.bin.x, F - 50, t); } if (bu > 1.2) BALL.b = 0;
    /* the anchor's script stack, and her BREAKING sheet */
    if (ANC._paper) { var ha = handW(ANC, 0), hb = handW(ANC, 1); fillRR(g, ha[0], (ha[1] + hb[1]) / 2 - 18, hb[0] - ha[0], 20, 2, '#FFFFFF'); }
    if (ANC._u < 1.6) { var h2 = handW(ANC, 1), cx = h2[0] + 40, cy = h2[1] - 16; g.save(); g.translate(cx, cy); g.rotate(0.06 + Math.sin(t * 6) * 0.03);
      fillRR(g, -46, -24, 92, 40, 3, '#FFFFFF'); fillRR(g, -46, -24, 92, 14, 3, RED); text(g, 'BREAKING', 0, -13, 8, 800, '#FFFFFF', 'center'); text(g, 'ODOO 20', 0, 9, 14, 800, INK, 'center'); g.restore(); }
    /* the camera operator's thumbs-up and her 3-2-1 count */
    if (CAMOP._thumb) { var ht = handW(CAMOP, 1); fillRR(g, ht[0] - 4, ht[1] - 22, 8, 14, 4, CR.skin[3]); }
    if (CAMOP._u < 2.4) { var hc = handW(CAMOP, 1), num = 3 - Math.floor(CAMOP._u / 0.8); fillE(g, hc[0], hc[1] - 40, 15, 15, '#FFFFFF'); g.strokeStyle = INK; g.lineWidth = 2; g.beginPath(); g.arc(hc[0], hc[1] - 40, 15, 0, 7); g.stroke(); text(g, String(num), hc[0], hc[1] - 34, 16, 800, RED, 'center');
      for (var fg = 0; fg < num; fg++) fillRR(g, hc[0] - 9 + fg * 7, hc[1] - 22, 5, 14, 2.5, CR.skin[3]); }
    /* the floor manager's cue card, or her clapperboard */
    if (FM._cue) { var hf = handW(FM, 1); g.save(); g.translate(hf[0] + 4, hf[1] - 24); g.scale(Math.max(0.05, Math.abs(FM._flip)), 1); fillRR(g, -30, -20, 60, 40, 3, '#FFFFFF'); g.strokeStyle = '#C9D3E3'; g.lineWidth = 1.5; rr(g, -30, -20, 60, 40, 3); g.stroke(); text(g, FM._cue, 0, 4, 9, 800, FM._cue === 'SMILE!' ? RED : INK, 'center'); g.restore(); }
    if (FM._u < 2.2) { var h4 = handW(FM, 1), mx = h4[0] + 30, my = h4[1] - 26, op = FM._u < 0.6 ? ease(FM._u / 0.3) * 0.6 : 0;
      g.save(); g.translate(mx, my); fillRR(g, -34, -6, 68, 40, 3, '#1B1F3B'); text(g, 'TAKE 20', 0, 12, 9, 800, '#FFFFFF', 'center'); text(g, 'TECHNEXT NEWS', 0, 26, 6, 800, Y, 'center');
      g.save(); g.translate(-34, -6); g.rotate(-op); fillRR(g, 0, -10, 68, 10, 2, '#FFFFFF'); g.fillStyle = '#1B1F3B'; for (var cs = 0; cs < 5; cs++) { g.beginPath(); g.moveTo(4 + cs * 14, -10); g.lineTo(12 + cs * 14, -10); g.lineTo(8 + cs * 14, 0); g.lineTo(0 + cs * 14, 0); g.closePath(); g.fill(); } g.restore(); g.restore(); }
    CR.draw(g, t);
  }
  /* the floor monitor shows camera one's feed; the jib arm swings over the right of the floor (front layer) */
  function paintForeLive(g, t, S) {
    K.zfore(g, t, S, [[712, function () { fillRR(g, 206, 672, 62, 32, 2, '#1D2A6B'); fillRR(g, 212, 678, 50, 8, 1, RED); fillRR(g, 212, 690, 32 + Math.sin(t * 2) * 6, 3, 1.5, '#FFFFFF'); fillE(g, 250, 696, 4, 4, Math.floor(t * 2) % 2 ? RED : '#7A2C27'); }],
      S.ext.r > 1120 ? [740, function () { var bx = 1250, a = -0.5 + Math.sin(t * 0.4) * 0.22; soft(g, bx, 742, 60, 8, 0.3); fillRR(g, bx - 30, 726, 60, 14, 5, '#2A3142'); fillRR(g, bx - 6, 600, 12, 128, 4, '#5C6B7A');
        g.save(); g.translate(bx, 604); g.rotate(a); fillRR(g, -60, -6, 300, 12, 6, '#7A869C'); fillRR(g, -90, -14, 40, 28, 5, '#2A3142'); fillRR(g, 226, -22, 50, 34, 6, '#2A3142'); fillE(g, 280, -5, 9, 11, '#0B0F24'); fillE(g, 230, -18, 3, 3, RED); g.restore(); }] : null],
      function () { CO.crew(CREW, g, t, S, 'fore'); });
    CR.draw(g, t);
  }

  window.IXW.worlds.blog = {
    pan: [-300, 1080],
    paintBg: paintBg, windowBehind: true, paintFrame: paintFrame, paintBack: paintBack, paintFront: paintFront, paintFore: paintFore,
    paintWindow: function () {}, paintLive: paintLive, paintFrontLive: paintFrontLive, paintForeLive: paintForeLive,
    moteCol: 'rgba(49,103,202,.25)',
    glow: {
      o20: function (g) { var w = T.wall; rr(g, w.x - 14, w.y - 14, w.w + 28, w.h - 16, 12); },
      news: function (g) { var w = T.wall; rr(g, w.x - 8, w.y + w.h - 38, w.w + 16, 46, 10); },
      guides: function (g) { var d = T.write; rr(g, d.x + 36, d.y - 48, 88, 58, 10); },
      erp: function (g) { var s = T.shelf; rr(g, s.x - 8, s.y - 34, s.w + 16, F - s.y + 38, 12); },
      markets: function (g) { var m = T.map; rr(g, m.x - 12, m.y - 12, m.w + 24, m.h + 24, 10); },
      events: function (g) { var c = T.cal; rr(g, c.x - 8, c.y - 8, c.w + 16, c.h + 16, 10); },
      onair: function (g) { var o = T.onair; rr(g, o.x - 8, o.y - 8, 136, 50, 12); },
      camera: function (g) { var c = T.cam; rr(g, c.x - 40, c.y - 10, 140, 74, 12); }
    },
    backGlow: ['o20', 'news', 'erp', 'markets', 'events', 'onair', 'camera'],
    calmView: [140, -110, 800, 640],
    cast: [
      { id: 'fm', behind: true, keys: [], P: FM, act: actFm },
      { id: 'anc', behind: true, keys: ['o20', 'news'], P: ANC, act: actAnc },
      { id: 'wrt', behind: true, keys: ['guides'], P: WRT, act: actWrt },
      { id: 'cam', behind: true, keys: [], P: CAMOP, act: actCam }
    ],
    toy: function (name, S, t) { if (name === 'onair') AIR.t = t; if (name === 'camera') { SHOT.t = t; CR.burst('star', T.cam.x - 28, T.cam.y, t); } },
    hit: function (x, y, S, t) {
      var r = CR.hitWalker(x, y, t); if (r) return r;
      function on(P) { return Math.abs(x - P.x) < 60 && y < P.y + 6 && y > P.y - 260; }
      if (on(FC)) { FCT.t = t; FCT.b = 0; return { say: 'Every fact in every article gets **checked** before it goes live.', near: [-250, 90], pose: 'think', who: 'Fact-checker' }; }
      if (on(PROD)) { PRODT.t = t; CR.burst('conf', PROD.x, PROD.y - 260, t); return { say: 'Story moved to **LIVE**. Published, in plain language.', near: [940, 70], pose: 'celebrate', who: 'Producer' }; }
      if (on(OPR)) { OPRT.t = t; CR.burst('spark', OPR.x, OPR.y - 260, t); return { say: 'Hot off the press: the **Odoo 20** edition!', near: [-420, 100], pose: 'wow', who: 'Press operator' }; }
      return null;
    },
    onStop: function () {}
  };
})(window.IXW && window.IXW.kit, window.CR, window.CO);
