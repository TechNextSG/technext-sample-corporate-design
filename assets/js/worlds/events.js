/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: events (/events) — Hall A, a bright exhibition hall for TechNext's OWN events, the events TechNext will join and its
   milestones (never other organisers' events). A glass barrel-vault roof on white ribs, a lighting truss with banners, the
   purple milestone ribbon with a live "today" marker, three booths: TechNext events and Events we're joining (each poster
   shows the next item from assets/js/events-data.js, or a draped "announced soon" cover when there is none) and the
   Nexi Explains premieres; the past-events easel, the welcome desk with two visitors, a YouTube premiere monitor and the
   TechNext stage, whose screen counts down to the next real TechNext item or says "Stay tuned".
   Everyone has their own idle loop and tap choreography. Team members wear the blue TechNext ID; visitors a grey pass. */
(function (K, CR, CO, COL) {
  'use strict';
  if (!K || !CR || !CO || !COL) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed;
  var F = 470, NAVY = '#24193A', PUR = '#714B67', PUR2 = '#8E6286', BLUE = '#3167CA', CORAL = '#F2715A', MINT = '#2BB59A', SUN = '#FFC94A', PASS = '#9AA6BC', CREAM = '#FBF7F2';
  var EV = window.TN_EV, LIST = window.TN_EVENTS || [];
  var BOOTH = [{ key: 'own', name: 'TECHNEXT', sub: 'OUR OWN EVENTS', label: 'TechNext events', x: 150, col: BLUE, empty: ['NONE', 'ANNOUNCED YET'] },
    { key: 'joining', name: "WE'RE JOINING", sub: 'EVENTS WE JOIN', label: "Events we're joining", x: 285, col: CORAL, empty: ['ANNOUNCED', 'HERE SOON'] },
    { key: 'nexi', name: 'NEXI EXPLAINS', sub: 'YOUTUBE PREMIERES', label: 'Nexi Explains', x: 420, col: PUR, empty: ['NEW EPISODES', 'COMING SOON'] }];
  var BW = 120, T = { ribbon: { x0: 150, x1: 990, y: -6 }, easel: { x: 574 }, pod: { x: 648 }, mon: { x: 706, y: 116, w: 76, h: 54 }, stage: { x: 784, top: 432 }, led: { x: 806, y: 70, w: 176, h: 112 },
    photo: { x: 1040, w: 170 }, kiosk: { x: 1262 }, arch: { x: -720 } };
  function setU(g, sx, sy, k) { g.translate(sx, sy); g.scale(k, k); }
  function extOf(W, H, k, sx, sy) { return { l: -(sx + 24) / k, r: (W - sx) / k, t: -(sy + 24) / k, b: (H - sy) / k }; }
  var ease = COL.ease, bell = COL.bell;
  function fmt(e) { var d = EV ? EV.dayMon(e.date) : [0, '', 0]; return d[0] + ' ' + d[1].toUpperCase(); }
  function short(s, n) { return s.length > n ? s.slice(0, n - 1).replace(/[ ,:]+$/, '') + '…' : s; }
  /* what the scene shows, from the event list: refreshed every minute */
  var D = { at: -1e9 };
  function data() {
    var now = Date.now(); if (now - D.at < 60000) return D; D.at = now;
    var up = EV ? EV.upcoming(now) : [], past = EV ? EV.past(now) : [];
    D.next = up[0] || null; D.up = up; D.past = past;
    var own = up.filter(function (e) { return e.type === 'own'; });
    D.by = { own: own.filter(function (e) { return e.kind !== 'Video premiere'; }), joining: up.filter(function (e) { return e.type === 'joining'; }), nexi: own.filter(function (e) { return e.kind === 'Video premiere'; }) };
    D.web = D.by.nexi[0] || null;
    return D;
  }

  /* ------------------------------------------------------------ the hall (cached) */
  function paintBg(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    CO.sky(g, e, e.t, -40, [[0, '#7FBDEB'], [0.6, '#BFE0F7'], [1, '#E6F3FC']]);
    g.restore();
  }
  function paintFrame(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    /* the barrel vault: white ribs and purlins over the glass */
    g.strokeStyle = '#FFFFFF'; g.lineWidth = 7;
    for (var rx = Math.floor(e.l / 130) * 130; rx < e.r + 130; rx += 130) { g.beginPath(); g.moveTo(rx - 40, -40); g.quadraticCurveTo(rx + 25, e.t - 40, rx + 90, -40); g.stroke(); }
    g.lineWidth = 2.5; g.strokeStyle = 'rgba(255,255,255,.75)'; for (var py = -70; py > e.t; py -= 34) { g.beginPath(); g.moveTo(e.l, py); g.lineTo(e.r, py); g.stroke(); }
    g.fillStyle = 'rgba(255,255,255,.18)'; for (var gl = Math.floor(e.l / 130) * 130; gl < e.r; gl += 130) { g.beginPath(); g.moveTo(gl + 10, -40); g.lineTo(gl + 48, e.t); g.lineTo(gl + 66, e.t); g.lineTo(gl + 28, -40); g.closePath(); g.fill(); }
    /* the back wall: warm cream panels with slim pilasters */
    var wg = g.createLinearGradient(0, -40, 0, F); wg.addColorStop(0, '#FFFCF8'); wg.addColorStop(1, '#F1E9E4'); g.fillStyle = wg; g.fillRect(e.l, -40, e.r - e.l, F + 40);
    g.fillStyle = 'rgba(113,75,103,.06)'; for (var pl = Math.floor(e.l / 140) * 140; pl < e.r; pl += 140) g.fillRect(pl, -40, 10, F + 40);
    g.fillStyle = '#E8DCE4'; g.fillRect(e.l, -44, e.r - e.l, 8);
    /* the floor: polished pale terrazzo with a purple aisle carpet */
    var fl = g.createLinearGradient(0, F, 0, e.b); fl.addColorStop(0, '#E9E2E6'); fl.addColorStop(1, '#D9CFD6'); g.fillStyle = fl; g.fillRect(e.l, F, e.r - e.l, e.b - F);
    for (var ti = 0; ti < 260; ti++) { var tx = e.l + hash(ti) * (e.r - e.l), ty = F + 6 + hash(ti + 99) * (e.b - F); g.fillStyle = ['rgba(113,75,103,.10)', 'rgba(49,103,202,.08)', 'rgba(242,113,90,.10)'][ti % 3]; g.fillRect(tx, ty, 3, 2); }
    g.fillStyle = 'rgba(36,25,58,.10)'; g.fillRect(e.l, F, e.r - e.l, 5);
    g.save(); g.beginPath(); g.moveTo(e.l, 600); g.lineTo(e.r, 600); g.lineTo(e.r, 660); g.lineTo(e.l, 660); g.closePath(); g.fillStyle = 'rgba(113,75,103,.22)'; g.fill(); g.restore();
    g.fillStyle = 'rgba(255,255,255,.5)'; for (var ar = Math.floor(e.l / 160) * 160; ar < e.r; ar += 160) { g.beginPath(); g.moveTo(ar, 622); g.lineTo(ar + 30, 630); g.lineTo(ar, 638); g.closePath(); g.fill(); }
    [[500, F + 60, 380], [-300, F + 50, 220], [1150, F + 50, 240]].forEach(function (p) { g.save(); g.globalAlpha = 0.45; fillE(g, p[0], p[1], p[2], 30, '#FFFFFF'); g.restore(); });
    /* the lighting truss */
    g.strokeStyle = '#B9AFC4'; g.lineWidth = 3; g.beginPath(); g.moveTo(e.l, -128); g.lineTo(e.r, -128); g.moveTo(e.l, -112); g.lineTo(e.r, -112);
    for (var x = Math.floor(e.l / 20) * 20; x < e.r; x += 20) { g.moveTo(x, -128); g.lineTo(x + 10, -112); g.lineTo(x + 20, -128); } g.stroke();
    g.strokeStyle = '#C9C0D2'; g.lineWidth = 2; for (var hx = Math.floor(e.l / 320) * 320; hx < e.r; hx += 320) { g.beginPath(); g.moveTo(hx, e.t); g.lineTo(hx, -128); g.stroke(); }
    /* the hall sign on the truss */
    g.strokeStyle = '#B9AFC4'; g.lineWidth = 2; g.beginPath(); g.moveTo(330, -112); g.lineTo(330, -92); g.moveTo(560, -112); g.lineTo(560, -92); g.stroke();
    shadowed(g, 12, 5, 0.22, function () { fillRR(g, 300, -92, 290, 44, 22, '#FFFFFF'); }); fillE(g, 326, -70, 15, 15, PUR); CO.plane(g, 326, -70, 0.9, 0, '#FFFFFF', PUR);
    text(g, 'TechNext · Events', 348, -66, 16, 800, NAVY); text(g, 'HALL A · OWN · JOINING · MILESTONES', 348, -54, 7, 800, '#7A6A80');
    g.restore();
  }

  /* the milestone ribbon (static part), the booths, the easel, the podium's back, the stage's LED frame, the margins */
  var R0 = 2026 + 8 / 12, R1 = 2027 + 3 / 12, MONS = ['SEP', 'OCT', 'NOV', 'DEC', 'JAN', 'FEB', 'MAR'];
  function yrX(y) { var r = T.ribbon; return lerp(r.x0 + 110, r.x1 - 30, (y - R0) / (R1 - R0)); }
  function dateX(ms) { var d = new Date(ms); return yrX(d.getUTCFullYear() + (d.getUTCMonth() + d.getUTCDate() / 31) / 12); }
  function paintBack(g, ext) {
    var r = T.ribbon;
    shadowed(g, 10, 4, 0.2, function () { fillRR(g, r.x0, r.y - 20, r.x1 - r.x0, 40, 20, PUR); });
    g.fillStyle = PUR2; g.beginPath(); g.moveTo(r.x0 + 8, r.y + 18); g.lineTo(r.x0 - 12, r.y + 30); g.lineTo(r.x0 + 4, r.y + 30); g.closePath(); g.fill();
    fillRR(g, r.x0 + 6, r.y - 14, 74, 28, 14, '#FFFFFF'); text(g, 'MILESTONES', r.x0 + 43, r.y + 3.5, 8, 800, PUR, 'center');
    g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 2; g.setLineDash([4, 5]); g.beginPath(); g.moveTo(r.x0 + 90, r.y); g.lineTo(r.x1 - 16, r.y); g.stroke(); g.setLineDash([]);
    MONS.forEach(function (mo, i) { var x = yrX(R0 + i / 12); fillE(g, x, r.y, 4, 4, '#FFFFFF'); text(g, mo + (i === 0 ? ' 26' : i === 4 ? ' 27' : ''), x, r.y + 15, 7, 800, 'rgba(255,255,255,.85)', 'center'); });
    (EV ? EV.milestones() : []).forEach(function (m, i) { var p = m.date.split('-'), x = yrX(+p[0] + (+p[1] - 1 + (+p[2] - 1) / 31) / 12); if (x < r.x0 + 96) return;
      fillRR(g, x - 1.5, r.y - 14, 3, 10, 1.5, i % 2 ? SUN : '#FFFFFF'); });
    /* the three country booths */
    BOOTH.forEach(function (b, i) { var x = b.x;
      soft(g, x + BW / 2, F + 4, 80, 9, 0.25);
      g.strokeStyle = '#B9AFC4'; g.lineWidth = 2; g.beginPath(); g.moveTo(x + 20, -112); g.lineTo(x + 20, 40); g.moveTo(x + BW - 20, -112); g.lineTo(x + BW - 20, 40); g.stroke();
      /* the lightbox sign with the city skyline */
      shadowed(g, 10, 4, 0.2, function () { fillRR(g, x + 4, 40, BW - 8, 50, 6, '#FFFFFF'); });
      g.save(); g.beginPath(); rr(g, x + 8, 44, BW - 16, 42, 4); g.clip(); var sg = g.createLinearGradient(0, 44, 0, 86); sg.addColorStop(0, '#CFE6F8'); sg.addColorStop(1, '#F6FBFF'); g.fillStyle = sg; g.fillRect(x + 8, 44, BW - 16, 42);
      g.restore(); if (b.key === 'own') CO.plane(g, x + BW / 2, 65, 2.2, 0, BLUE, '#DCEEFB'); else if (b.key === 'joining') { text(g, '? ? ?', x + BW / 2, 72, 18, 800, CORAL, 'center'); } else { fillE(g, x + BW / 2, 65, 15, 15, PUR); g.fillStyle = '#FFFFFF'; g.beginPath(); g.moveTo(x + BW / 2 - 5, 57); g.lineTo(x + BW / 2 + 8, 65); g.lineTo(x + BW / 2 - 5, 73); g.closePath(); g.fill(); }
      shadowed(g, 14, 6, 0.2, function () { fillRR(g, x, 96, BW, F - 96, 6, '#FFFFFF'); });
      fillRR(g, x, 96, BW, 40, 6, b.col); g.fillRect(x, 122, BW, 14); fillRR(g, x, 132, BW, 4, 0, 'rgba(0,0,0,.12)');
      fillE(g, x + 16, 116, 7, 7, '#FFFFFF'); fillE(g, x + 16, 116, 3, 3, b.col);
      text(g, b.name, x + 28, 120, b.name.length > 10 ? 8.6 : 10.5, 800, '#FFFFFF'); text(g, b.sub, x + 28, 130, 5.6, 800, 'rgba(255,255,255,.85)');
      /* the poster frame (its date is live); a pinboard of flyers below it */
      fillRR(g, x + 8, 142, BW - 16, 68, 4, '#F7F3F6'); g.strokeStyle = 'rgba(113,75,103,.18)'; g.lineWidth = 1; rr(g, x + 8, 142, BW - 16, 68, 4); g.stroke();
      fillRR(g, x + 8, 218, BW - 16, 160, 4, '#F4EEF2'); for (var fy = 0; fy < 3; fy++) for (var fx = 0; fx < 3; fx++) { var col = [b.col, SUN, MINT, CORAL, BLUE][(fx + fy * 3 + i) % 5]; fillRR(g, x + 14 + fx * 34, 226 + fy * 50, 26, 38, 2, '#FFFFFF'); fillRR(g, x + 14 + fx * 34, 226 + fy * 50, 26, 9, 2, col); fillE(g, x + 27 + fx * 34, 225 + fy * 50, 2, 2, '#E2453C'); }
      text(g, ['Booth 01', 'Booth 02', 'Booth 03'][i], x + BW / 2, 388, 7.5, 800, '#5C5C73', 'center'); });
    /* the past-events easel (A-frame), the online monitor's pole */
    var ea = T.easel.x; g.strokeStyle = '#B5865A'; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.moveTo(ea - 26, F); g.lineTo(ea, 288); g.lineTo(ea + 26, F); g.moveTo(ea, 288); g.lineTo(ea + 8, F - 4); g.stroke();
    soft(g, ea, F + 3, 40, 6, 0.25);
    shadowed(g, 8, 4, 0.2, function () { fillRR(g, ea - 34, 300, 68, 110, 4, '#2F2A3A'); }); fillRR(g, ea - 30, 304, 60, 102, 3, '#3A3446');
    text(g, 'PAST', ea, 318, 9, 800, SUN, 'center'); text(g, 'EVENTS', ea, 328, 6.5, 800, '#FFFFFF', 'center'); fillRR(g, ea - 36, 408, 72, 6, 2, '#B5865A');
    var m = T.mon; g.strokeStyle = '#B9AFC4'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(m.x + m.w / 2, -112); g.lineTo(m.x + m.w / 2, m.y - 4); g.stroke();
    fillRR(g, m.x - 4, m.y - 4, m.w + 8, m.h + 8, 6, '#2A2438'); fillRR(g, m.x + m.w / 2 - 14, m.y + m.h + 4, 28, 10, 3, CORAL); text(g, 'YOUTUBE', m.x + m.w / 2, m.y + m.h + 11.5, 6, 800, '#FFFFFF', 'center');
    /* the stage: the LED wall's frame and its truss towers */
    var L = T.led, st = T.stage;
    [st.x + 4, 990].forEach(function (tx) { g.strokeStyle = '#C9C0D2'; g.lineWidth = 3; g.beginPath(); for (var ty = -112; ty < st.top; ty += 18) { g.moveTo(tx - 6, ty); g.lineTo(tx + 6, ty + 9); g.lineTo(tx - 6, ty + 18); } g.moveTo(tx - 6, -112); g.lineTo(tx - 6, st.top); g.moveTo(tx + 6, -112); g.lineTo(tx + 6, st.top); g.stroke(); });
    fillRR(g, st.x + 12, 24, 1000 - st.x - 22, 310, 6, '#EFE6EE'); fillRR(g, st.x + 12, 24, 1000 - st.x - 22, 30, 6, PUR); g.fillRect(st.x + 12, 42, 1000 - st.x - 22, 12);
    text(g, 'TECHNEXT STAGE', st.x + 26, 44, 11, 800, '#FFFFFF'); fillRR(g, 926, 30, 54, 18, 9, '#FFFFFF'); CO.plane(g, 938, 39, 0.6, 0, PUR); text(g, 'Hall A', 960, 42.5, 7, 800, PUR, 'center');
    fillRR(g, L.x - 6, L.y - 6 + 0, L.w + 12, L.h + 12, 6, '#1E1A2A');
    /* the stage's back curtain pleats under the screen */
    for (var cp = st.x + 14; cp < 988; cp += 14) { g.fillStyle = cp % 28 ? '#E4D7E2' : '#EADFE8'; g.fillRect(cp, 196, 14, st.top - 196); }
    /* ---- right margin: the step-and-repeat photo wall and the info kiosk ---- */
    var ph = T.photo; if (ext.r > ph.x - 20) {
      soft(g, ph.x + ph.w / 2, F + 4, 110, 9, 0.25); shadowed(g, 12, 5, 0.2, function () { fillRR(g, ph.x, 120, ph.w, F - 120, 6, '#FFFFFF'); });
      for (var pr = 0; pr < 9; pr++) for (var pc = 0; pc < 3; pc++) { var px = ph.x + 18 + pc * 52 + (pr % 2) * 26, py = 140 + pr * 34; if (px > ph.x + ph.w - 20) continue;
        if ((pr + pc) % 2) { CO.plane(g, px, py, 0.7, 0, BLUE); text(g, 'TechNext', px + 10, py + 3, 6.5, 800, NAVY); } else { fillE(g, px, py, 5, 5, PUR); text(g, 'odoo', px + 8, py + 3, 6.5, 800, PUR); } }
      fillRR(g, ph.x + 20, F - 60, ph.w - 40, 22, 11, NAVY); text(g, '#TechNextEvents', ph.x + ph.w / 2, F - 45, 8, 800, SUN, 'center');
      g.save(); g.translate(ph.x + ph.w / 2, F + 40); g.scale(1, 0.22); fillE(g, 0, 0, 110, 110, 'rgba(242,113,90,.25)'); g.restore(); }
    var kx = T.kiosk.x; if (ext.r > kx - 40) {
      soft(g, kx + 40, F + 4, 60, 8, 0.25); fillRR(g, kx, 300, 80, F - 300, 8, '#FFFFFF'); fillRR(g, kx, 300, 80, 26, 8, MINT); g.fillRect(kx, 316, 80, 10); text(g, 'INFO', kx + 40, 318, 11, 800, '#FFFFFF', 'center');
      fillE(g, kx + 40, 270, 22, 22, MINT); text(g, 'i', kx + 40, 277, 20, 800, '#FFFFFF', 'center'); g.fillStyle = '#B9AFC4'; g.fillRect(kx + 38, 292, 4, 10);
      for (var ml = 0; ml < 4; ml++) fillRR(g, kx + 12, 340 + ml * 22, 56, 14, 4, ['#FDECE8', '#E6F6F2', '#F1EAF0', '#FFF4D6'][ml]); }
    /* ---- left margin: the welcome arch and the cloakroom ---- */
    var ax = T.arch.x; if (ext.l < ax + 520) {
      g.strokeStyle = PUR; g.lineWidth = 16; g.beginPath(); g.arc(ax + 110, 180, 120, Math.PI, 0); g.stroke(); g.fillStyle = PUR; g.fillRect(ax - 18, 180, 16, F - 180); g.fillRect(ax + 222, 180, 16, F - 180);
      text(g, 'WELCOME', ax + 110, 90, 16, 800, PUR, 'center'); fillRR(g, ax + 20, 230, 180, 120, 8, '#FFFFFF'); fillRR(g, ax + 20, 230, 180, 26, 8, CORAL); text(g, 'FLOOR PLAN', ax + 110, 248, 10, 800, '#FFFFFF', 'center'); [[40, '#E2453C'], [86, '#2F5FD0'], [132, '#D8362B']].forEach(function (b) { fillRR(g, ax + b[0], 266, 40, 30, 3, b[1]); }); fillRR(g, ax + 40, 304, 132, 30, 3, '#3A3048'); text(g, 'STAGE', ax + 106, 323, 8, 800, SUN, 'center'); fillE(g, ax + 150, 280, 5, 5, SUN); fillRR(g, ax + 106, 350, 8, F - 350, 3, '#B9AFC4'); text(g, 'Hall A · Events', ax + 110, 106, 8, 800, '#7A6A80', 'center');
      fillRR(g, ax + 270, 200, 160, F - 200, 6, '#FFFFFF'); fillRR(g, ax + 270, 200, 160, 24, 6, NAVY); text(g, 'CLOAKROOM', ax + 350, 216, 9, 800, '#FFFFFF', 'center');
      g.strokeStyle = '#9AA6BC'; g.lineWidth = 3; g.beginPath(); g.moveTo(ax + 280, 250); g.lineTo(ax + 420, 250); g.stroke();
      [['#E2453C', -220], [MINT, -190], ['#2F5FD0', -160], [SUN, -128]].forEach(function (c) { g.strokeStyle = '#7A869C'; g.lineWidth = 1.5; g.beginPath(); g.arc(ax + 510 + c[1], 254, 4, Math.PI, 0); g.stroke(); fillRR(g, ax + 500 + c[1], 258, 20, 46, 6, c[0]); }); }
    K.plant(g, { x: 136, y: F }, '#FFFFFF', '#EADFE8'); K.plant(g, { x: 1012, y: F }, '#FFFFFF', '#EADFE8');
  }
  function paintFront(g, ext) {
    /* the booth counters */
    BOOTH.forEach(function (b) { var x = b.x; fillRR(g, x + 6, 396, BW - 12, F - 396, 5, '#FFFFFF'); fillRR(g, x + 2, 390, BW - 4, 10, 4, '#E8DCE4'); fillRR(g, x + 6, 408, BW - 12, 22, 0, b.col);
      text(g, b.label, x + BW / 2, 423, 8, 800, '#FFFFFF', 'center'); for (var f = 0; f < 4; f++) fillRR(g, x + 16 + f * 4, 382 - f * 1.5, 22, 4, 1, f % 2 ? '#F1EAF0' : '#FFFFFF');
      fillRR(g, x + BW - 40, 370, 22, 22, 3, '#2A3550'); fillRR(g, x + BW - 38, 372, 18, 14, 2, '#BFD4F6'); });
    /* the registration podium */
    var p = T.pod.x; soft(g, p, F + 4, 50, 7, 0.3); fillRR(g, p - 36, 384, 72, F - 384, 6, '#FFFFFF'); fillRR(g, p - 40, 376, 80, 12, 5, PUR); fillRR(g, p - 36, 400, 72, 26, 0, NAVY);
    text(g, 'WELCOME', p, 412, 9, 800, '#FFFFFF', 'center'); text(g, 'TechNext events', p, 421, 5.6, 800, SUN, 'center');
    fillRR(g, p + 10, 360, 18, 16, 3, '#2A3550'); fillRR(g, p + 12, 362, 14, 10, 2, '#9FE3C8');
    /* the queue posts and belt */
    var posts = [690, 734, 778]; g.strokeStyle = PUR; g.lineWidth = 4; g.beginPath(); for (var i = 0; i < posts.length - 1; i++) { g.moveTo(posts[i], 432); g.quadraticCurveTo((posts[i] + posts[i + 1]) / 2, 442, posts[i + 1], 432); } g.stroke();
    posts.forEach(function (x) { fillE(g, x, F - 2, 11, 3.5, '#7A6A80'); fillRR(g, x - 2.5, 428, 5, F - 430, 2, '#C9C0D2'); fillE(g, x, 428, 4, 3, '#E8DCE4'); });
    /* the stage platform and the lectern */
    var st = T.stage; fillRR(g, st.x, st.top, 1000 - st.x + 30, F - st.top, 4, '#3A3048'); fillRR(g, st.x, st.top - 4, 1000 - st.x + 30, 8, 3, '#5A4A68');
    g.fillStyle = 'rgba(255,255,255,.06)'; for (var sp = st.x; sp < 1030; sp += 22) g.fillRect(sp, st.top + 6, 2, F - st.top - 6);
    for (var sl = 0; sl < 3; sl++) { fillRR(g, st.x + 30 + sl * 70, F - 12, 34, 8, 3, '#2A2438'); }
    var lx = 958; fillRR(g, lx - 22, 362, 44, st.top - 362, 4, '#FFFFFF'); fillRR(g, lx - 26, 356, 52, 10, 3, PUR); CO.plane(g, lx, 392, 1.1, 0, PUR);
    g.strokeStyle = '#2A2438'; g.lineWidth = 2; g.beginPath(); g.moveTo(lx - 8, 356); g.quadraticCurveTo(lx - 16, 340, lx - 22, 334); g.stroke(); fillE(g, lx - 23, 332, 3.5, 4.5, '#2A2438');
    /* the photo wall's ring light stand (right margin) */
    if (ext.r > T.photo.x) { g.strokeStyle = '#7A869C'; g.lineWidth = 3; g.beginPath(); g.moveTo(T.photo.x - 14, 330); g.lineTo(T.photo.x - 14, F); g.stroke(); }
  }
  function paintFore(g, ext) {
    var posts = [80, 220, 360, 500];
    g.strokeStyle = PUR; g.lineWidth = 7; g.lineCap = 'round'; g.beginPath(); for (var i = 0; i < posts.length - 1; i++) { g.moveTo(posts[i], 652); g.quadraticCurveTo((posts[i] + posts[i + 1]) / 2, 670, posts[i + 1], 652); } g.stroke();
    posts.forEach(function (x) { soft(g, x, 716, 30, 6, 0.3); fillE(g, x, 712, 22, 6, '#7A6A80'); fillRR(g, x - 4, 646, 8, 66, 3, '#D9CFD6'); fillE(g, x, 646, 7, 5, SUN); });
    /* a crate of brochures, a plant, the "this way" floor sticker */
    soft(g, 900, 718, 70, 8, 0.3); fillRR(g, 846, 650, 112, 64, 6, '#C99A6B'); fillRR(g, 846, 650, 112, 12, 5, '#B5865A');
    [[858, CORAL], [888, BLUE], [918, MINT]].forEach(function (b, k) { g.save(); g.translate(b[0] + 14, 640); g.rotate((k - 1) * 0.1); fillRR(g, -13, -22, 26, 34, 2, '#FFFFFF'); fillRR(g, -13, -22, 26, 10, 2, b[1]); fillRR(g, -9, -6, 18, 2.5, 1, '#C9D3E3'); fillRR(g, -9, -1, 13, 2.5, 1, '#C9D3E3'); g.restore(); });
    text(g, 'PROGRAMMES', 902, 690, 9, 800, '#FFFFFF', 'center');
    K.plant(g, { x: 1060, y: 730 }, PUR, PUR2); K.plant(g, { x: -50, y: 730 }, '#FFFFFF', '#EADFE8');
    g.save(); g.translate(660, 694); g.scale(1, 0.38); fillRR(g, -80, -40, 160, 80, 40, SUN); g.restore(); text(g, 'STAGE THIS WAY ›', 660, 698, 9.5, 800, NAVY, 'center');
  }

  /* ------------------------------------------------------------ the cast */
  var W = CR.who;
  var HOST = W({ x: 648, y: 470, s: 0.5, ph: 0.6, skin: 1, hair: 0, style: 'bob', outfit: 'polo', top: PUR, top2: '#FFFFFF', hands: [[-70, -220], [70, -210]], look: 0.5 });
  var SPK = W({ x: 878, y: 432, s: 0.5, ph: 1.4, skin: 2, hair: 1, style: 'short', outfit: 'shirt', top: '#FFFFFF', top2: BLUE, glasses: true, headset: '#2A2438', hands: [[-70, -200], [70, -200]], look: -0.4 });
  var V1 = W({ x: 712, y: 470, s: 0.48, ph: 2.1, skin: 0, hair: 2, style: 'pony', outfit: 'cardigan', top: CORAL, top2: '#FFFFFF', id: PASS, hands: [[-60, -170], [60, -170]], look: -0.6 });
  var V2 = W({ x: 756, y: 470, s: 0.48, ph: 2.9, skin: 3, hair: 0, style: 'short', outfit: 'polo', top: MINT, top2: '#FFFFFF', id: PASS, hands: [[-50, -200], [50, -200]], look: -0.4 });
  var VNS = W({ x: 480, y: 470, s: 0.47, ph: 0.3, skin: 2, hair: 1, style: 'long', outfit: 'polo', top: '#D8362B', top2: SUN, hands: [[-70, -200], [70, -200]], look: 0.4 });
  var CREW = [
    { front: true, x0: -380, x1: 160, y: 668, spd: 15, ph: 0.3, label: 'TechNext events team', lines: ['Fresh posters for the **Nexi Explains** booth!', 'Every date on the posters comes from the **events list**.'], acts: ['wave', 'jump', 'id'],
      P: W({ s: 0.58, skin: 1, hair: 0, style: 'short', outfit: 'polo', top: BLUE, hold: 'box', hands: [[-60, -212], [64, -216]] }) },
    { front: true, x0: 960, x1: 1320, y: 700, spd: 13, ph: 0.7, label: 'A visitor', lines: ['Reminder set for the **Nexi Explains** premiere!', 'What is under the **covered booth**?'], acts: ['cheer', 'nod', 'wave'],
      P: W({ s: 0.58, skin: 3, hair: 2, style: 'long', outfit: 'cardigan', top: SUN, top2: '#FFFFFF', id: PASS, hold: 'bags' }) },
    { x0: -900, x1: -300, y: 500, spd: 17, ph: 0.4, label: 'TechNext events team', lines: ['Coffee for the **stage crew**.', 'Hall A, then the TechNext stage.'], acts: ['id', 'dance', 'wave'],
      P: W({ s: 0.5, skin: 4, hair: 1, style: 'pony', outfit: 'shirt', top: CORAL, hold: 'tray', hands: [[-60, -212], [64, -216]] }) }
  ];
  /* the booth staff at the Singapore and Philippine booths (drawn and tapped by this file) */
  var XSC = [
    { P: W({ x: 210, y: 470, s: 0.47, ph: 1.1, skin: 0, hair: 0, style: 'short', outfit: 'polo', top: '#E2453C', top2: '#FFFFFF', glasses: true }), hands: [[-60, -200], [40, -220]],
      box: [210, 340, 80, 180], who: 'TechNext booth', role: 'TechNext · illustration', near: [210, 60], pose: 'point-left', dur: [1.8, 1.6], fx: ['star', 'spark'],
      lines: ['Our own events: **none announced yet**. New dates go on this poster first.', 'Want to meet us sooner? Book a **discovery session**.'],
      idle: function (P, t) { var c = (t + 1) % 7; P.look = 0.2; if (c < 4) { P.hands = [[-50, -210 - Math.abs(Math.sin(t * 9)) * 6], [40, -220]]; P.tilt = Math.sin(t * 0.8) * 0.03; } else { P.hands = [[-70, -200], [118, -300 + Math.sin(t * 5) * 8]]; P.look = 0.8; P.mood = 'happy'; } },
      moves: [function (P, u) { P.hands = [[-70, -200], [140, -330]]; P.hop = bell(u) * 10; P.look = 1; }, function (P, u) { P.hands = [[-110, -380], [110, -380]]; P.hop = Math.abs(Math.sin(u * Math.PI * 2)) * 16; }],
      after: function (g, P, t, S, X, u, k) { if (u >= 0 && k === 0) { var h = COL.hand(P, 1); g.save(); g.translate(h[0] + 4, h[1] - 10); fillRR(g, -12, -14, 24, 26, 3, CORAL); g.strokeStyle = NAVY; g.lineWidth = 1.5; g.beginPath(); g.arc(0, -14, 6, Math.PI, 0); g.stroke(); CO.plane(g, 0, 0, 0.5, 0, '#FFFFFF'); g.restore(); COL.pop(g, P.x, P.y - 270, 'Tote bag!', u, BLUE); } } },
    { P: W({ x: 344, y: 470, s: 0.47, ph: 2.4, skin: 3, hair: 1, style: 'bob', outfit: 'cardigan', top: '#2F5FD0', top2: '#FFFFFF' }), hands: [[-70, -200], [70, -200]],
      box: [344, 340, 80, 180], who: "Joining booth", role: 'TechNext · illustration', near: [344, 60], pose: 'celebrate', dur: [2, 1.6], fx: ['note', 'conf'],
      lines: ['The cover comes off when we **confirm an event** we will join.', 'Only events TechNext **takes part in** go on this board.'],
      idle: function (P, t) { var c = (t + 3) % 6; if (c < 3) { P.hands = [[-70, -200], [96 + Math.sin(t * 4) * 18, -300]]; P.look = -0.5; P.mood = 'happy'; } else { P.hands = [[-40, -240], [40, -240]]; P.look = 0.3; P.tilt = Math.sin(t * 2) * 0.04; } },
      moves: [function (P, u, t) { var b = Math.sin(t * 9); P.tilt = b * 0.14; P.hop = Math.abs(b) * 14; P.hands = b > 0 ? [[-120, -400], [80, -170]] : [[-80, -170], [120, -400]]; }, function (P, u) { P.hands = [[-110, -400], [110, -400]]; P.hop = bell(u) * 30; }],
      after: function (g, P, t, S, X, u, k) { if (u >= 0) COL.pop(g, P.x, P.y - 270, k ? 'Stay tuned!' : 'Coming soon!', u, '#2F5FD0'); var h = COL.hand(P, 1); if (u < 0 && (t + 3) % 6 < 3) COL.sheet(g, h[0] + 4, h[1] - 10, 0.2, 16, 20, 4); } }
  ];
  var BELL = { t: -9 }, SEL = { t: -9 }, LIGHTS = { t: -9 }, BOOM = { t: -9 }, SLIDE = { n: 0, t: 0 }, BANNER = { t: -9 };
  /* ---- the host: idle, scans the next visitor's ticket and types them in; tapped, rings the bell three times and the queue shuffles up */
  function actHost(P, t, S) {
    var st = S.cast.host, tp = COL.tap(st, t), u = tp.e; COL.reset(P, [[-70, -220], [70, -210]]);
    var c = (t + 0.6) % 6.5; P.talk = t < st.until; P.mood = P.talk || S.hot === 'register' ? 'happy' : 'calm';
    if (c < 2.2) { P.hands = [[-70, -220], [150, -300]]; P.look = 0.9; P._scan = c > 1 ? 1 : 0; }
    else if (c < 4.6) { var kk = Math.abs(Math.sin(t * 20)) * 6; P.hands = [[-40, -214 - kk], [40, -214 - (6 - kk)]]; P.look = 0.1; P._scan = 0; }
    else { P.hands = [[-70, -220], [120, -380 + Math.sin(t * 12) * 12]]; P.look = 0.8; P.mood = 'happy'; P.talk = true; P._scan = 0; }
    if (u < 2.4) { P.mood = 'happy'; P.talk = true; P._scan = 0; var ring = u < 1.5 ? Math.abs(Math.sin(u * Math.PI * 2)) : 0;
      P.hands = [[-70, -220], [60, -300 + ring * 50]]; P.look = 0.2; if (u < 0.06 && BELL.t < t - 1) { BELL.t = t; CR.burst('conf', 680, 330, t); } P.hop = u > 1.5 ? bell((u - 1.5) / 0.9) * 12 : 0; }
    P._u = u;
  }
  /* ---- the speaker: idle, strolls the stage, gestures at the LED wall and clicks to the next slide; tapped, bows, then opens his arms */
  function actSpk(P, t, S) {
    var st = S.cast.spk, u = COL.tap(st, t).e; COL.reset(P, [[-70, -200], [70, -200]]);
    var c = (t + 1.4) % 9; P.talk = true; P.mood = 'happy';
    P.x = 878 + Math.sin(t * 0.35) * 26;
    if (c < 3) { P.hands = [[-150, -340 + Math.sin(t * 3) * 10], [60, -200]]; P.look = -0.9; }
    else if (c < 3.5) { P.hands = [[-70, -200], [96, -250]]; P.look = 0.3; if (SLIDE.t < t - 2.5) { SLIDE.n++; SLIDE.t = t; } }
    else if (c < 7) { var g1 = Math.sin(t * 2.6); P.hands = [[-90 + g1 * 20, -260], [90 - g1 * 20, -250]]; P.look = 0.6 * Math.sin(t * 0.7); }
    else { P.hands = [[-60, -190], [60, -190]]; P.talk = false; P.mood = 'calm'; P.look = 0.8; }
    if (S.hot === 'next') { P.hands = [[-160, -330], [60, -200]]; P.look = -1; }
    if (u < 2.6) { P.talk = u > 1.1; P.mood = 'happy';
      if (u < 1.1) { var b = bell(u / 1.1); P.tilt = b * 0.28; P.hands = [[-60, -190 + b * 40], [60, -190 + b * 40]]; P.look = 0; }
      else { P.hands = [[-150, -380], [150, -380]]; P.hop = bell((u - 1.1) / 1.5) * 18; if (LIGHTS.t < st._cT) { LIGHTS.t = t; } } }
    if (u < 0.05) st._cT = t;
  }
  /* ---- visitor 1: idle, checks her ticket on the phone and rises on her toes to see the stage; tapped, shows "Reminder set" for the premiere */
  function actV1(P, t, S) {
    var st = S.cast.v1, u = COL.tap(st, t).e, bl = t - BELL.t; COL.reset(P, [[-60, -170], [60, -170]]);
    var c = (t + 2) % 7; P.talk = t < st.until;
    if (c < 4) { P.hands = [[-60, -170], [40, -290]]; P.look = -0.1; P._ph = 1; } else { P.hands = [[-60, -170], [60, -170]]; P.look = 1; P.hop = bell((c - 4) / 3) * 14; P._ph = 0; }
    if (bl < 1.2) { P.x = 712 - bell(bl / 1.2) * 14; P.mood = 'happy'; } else P.x = 712;
    if (u < 2) { P.mood = 'happy'; P.talk = true; P.hands = [[-60, -170], [-150, -330]]; P.look = -0.8; P.hop = bell(u / 0.6) * 18; P._ph = 2; }
    P._u = u;
  }
  /* ---- visitor 2: idle, leafs through the programme and points at the stage; tapped, a selfie with the stage behind (flash) */
  function actV2(P, t, S) {
    var st = S.cast.v2, u = COL.tap(st, t).e, bl = t - BELL.t; COL.reset(P, [[-50, -200], [50, -200]]);
    var c = (t + 4) % 8; P.talk = t < st.until; P._bro = 1;
    if (c < 5) { P.hands = [[-44, -214], [44, -214]]; P.look = -0.2; P.tilt = Math.floor(c / 1.6) % 2 ? 0.03 : -0.02; }
    else { P.hands = [[-50, -200], [150, -330]]; P.look = 0.9; P._bro = 0; P.mood = 'happy'; }
    if (bl < 1.2) P.x = 756 - bell(Math.max(0, bl - 0.15) / 1.05) * 14; else P.x = 756;
    if (u < 2.2) { P._bro = 0; P.mood = 'happy'; P.talk = true; P.sx = u < 0.4 ? Math.cos(ease(u / 0.4) * Math.PI) : -1; P.hands = [[-60, -170], [130, -400]]; P.look = -0.3;
      if (u > 0.8 && SEL.t < t - 1.5) { SEL.t = t; CR.burst('star', P.x, P.y - 260, t); } }
    P._u = u;
  }
  /* ---- the Vietnam booth: idle, offers a programme to the aisle and swaps it; tapped, unrolls a banner with Vietnam's next date */
  function actVn(P, t, S) {
    var st = S.cast.vns, u = COL.tap(st, t).e; COL.reset(P, [[-70, -200], [70, -200]]);
    var c = (t + 0.3) % 5.6; P.talk = t < st.until;
    if (c < 3) { P.hands = [[-70, -200], [136, -260 + Math.sin(t * 2) * 6]]; P.look = 0.7; P.mood = 'happy'; P._fl = 1; } else { P.hands = [[-40, -230], [30, -230]]; P.look = -0.2; P._fl = 0; P.tilt = Math.sin(t * 3) * 0.03; }
    if (S.hot === 'booths') { P.hands = [[-70, -200], [120, -360]]; P.mood = 'happy'; P._fl = 0; }
    if (u < 2.6) { P._fl = 0; P.mood = 'happy'; P.talk = true; P.hands = [[-120, -390], [120, -390]]; P.hop = bell(Math.min(1, u / 0.6)) * 12; if (u < 0.05 && BANNER.t < t - 1) { BANNER.t = t; CR.burst('star', 480, 230, t); } }
    P._u = u;
  }

  /* ------------------------------------------------------------ live layers */
  var CLOUDS = [[0, -150, 0.9], [300, -186, 0.7], [640, -160, 1], [980, -196, 0.8], [-420, -170, 0.85], [1300, -150, 0.9]];
  function paintWindow(g, t, par, S) {
    var e = S.ext; g.save(); g.beginPath(); g.rect(e.l, e.t, e.r - e.l, -40 - e.t); g.clip(); var span = e.r - e.l + 400;
    CLOUDS.forEach(function (c, i) { var x = e.l - 200 + (((c[0] - e.l + t * (5 + i * 1.3)) % span) + span) % span, y = c[1], s = c[2];
      g.fillStyle = 'rgba(255,255,255,.9)'; g.beginPath(); g.ellipse(x, y, 50 * s, 12 * s, 0, 0, 7); g.ellipse(x + 22 * s, y - 10 * s, 28 * s, 14 * s, 0, 0, 7); g.ellipse(x - 20 * s, y - 5 * s, 20 * s, 10 * s, 0, 0, 7); g.fill(); });
    COL.birds(g, t, e.l, e.r, -210, 3, 'rgba(60,70,110,.45)');
    g.restore();
  }
  function banner(g, t, x, col, a, b, i) {
    var sw = Math.sin(t * 1.2 + i) * 4; g.strokeStyle = '#B9AFC4'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(x + 8, -112); g.lineTo(x + 8, -100); g.moveTo(x + 52, -112); g.lineTo(x + 52, -100); g.stroke();
    g.fillStyle = col; g.beginPath(); g.moveTo(x, -100); g.lineTo(x + 60, -100); g.lineTo(x + 60 + sw, 40); g.lineTo(x + 30 + sw, 54); g.lineTo(x + sw, 40); g.closePath(); g.fill();
    g.fillStyle = 'rgba(255,255,255,.14)'; g.fillRect(x + 44, -100, 7, 130);
    text(g, a, x + 30 + sw * 0.5, -40, 10, 800, '#FFFFFF', 'center'); text(g, b, x + 30 + sw * 0.6, -24, 10, 800, SUN, 'center');
  }
  function paintLive(g, t, now, S) {
    var d = data(), e = S.ext;
    /* fabric banners hanging from the truss */
    if (e.l < 120) banner(g, t, 40, CORAL, 'NEXI', 'S1', 0);
    if (e.r > 1020) banner(g, t, 1010, MINT, 'SG·PH', '·VN', 1);
    if (e.r > 1250) banner(g, t, 1220, BLUE, 'HALL', 'A', 2);
    if (e.l < -100) banner(g, t, -200, PUR, 'EVENTS', '2026', 3); if (e.l < -800) banner(g, t, -880, CORAL, 'STAY', 'TUNED', 4);
    /* the milestone ribbon's TODAY marker */
    var r = T.ribbon, tx = clamp(dateX(Date.now()), r.x0 + 100, r.x1 - 20), pu = 0.5 + 0.5 * Math.sin(t * 3);
    fillE(g, tx, r.y, 7 + pu * 3, 7 + pu * 3, 'rgba(255,201,74,.45)'); fillE(g, tx, r.y, 5.5, 5.5, SUN); fillRR(g, tx - 20, r.y - 33, 40, 13, 6.5, SUN); text(g, 'TODAY', tx, r.y - 23.5, 6.6, 800, NAVY, 'center');
    /* the booth posters: each booth's next item from the list, or a draped "announced soon" cover */
    BOOTH.forEach(function (b, i) { var x = b.x, list = d.by[b.key] || [], ev = list[0], lift = S.hot === 'booths' ? Math.sin(t * 4 + i) * 2 : 0;
      g.save(); g.translate(0, lift);
      if (ev) { fillRR(g, x + 16, 144, 44, 44, 4, b.col); var dm = EV.dayMon(ev.date); text(g, String(dm[0]), x + 38, 170, 17, 800, '#FFFFFF', 'center'); text(g, dm[1].toUpperCase(), x + 38, 182, 7, 800, 'rgba(255,255,255,.85)', 'center');
        text(g, 'NEXT UP', x + 66, 154, 6.5, 800, b.col); text(g, short(ev.title.replace(/^Nexi Explains /, ''), 11), x + 66, 166, 7.5, 800, NAVY);
        text(g, short(ev.kind, 15), x + 66, 177, 6.4, 700, '#5C5C73'); text(g, list.length + (list.length === 1 ? ' date' : ' dates') + ' ahead', x + 16, 203, 6.6, 800, '#7A6A80'); }
      else { var sw = Math.sin(t * 1.3 + i) * 1.5; g.fillStyle = b.col; g.beginPath(); g.moveTo(x + 10, 140); g.lineTo(x + BW - 10, 140); g.lineTo(x + BW - 12 + sw, 206); g.lineTo(x + BW - 30 + sw, 200); g.lineTo(x + 78 + sw, 208); g.lineTo(x + 58 + sw, 200); g.lineTo(x + 38 + sw, 208); g.lineTo(x + 12 + sw, 202); g.closePath(); g.fill();
        g.fillStyle = 'rgba(255,255,255,.14)'; for (var pl = 0; pl < 5; pl++) g.fillRect(x + 18 + pl * 20, 140, 6, 60);
        text(g, b.empty[0], x + BW / 2, 168, 8.6, 800, '#FFFFFF', 'center'); text(g, b.empty[1], x + BW / 2, 181, 7, 800, SUN, 'center'); }
      fillE(g, x + BW - 22, 204, 3, 3, Math.floor(t * 2 + i) % 2 ? '#2BC48A' : '#B8F0D8'); g.restore(); });
    /* the past-events easel: little cards stamped ENDED */
    var ea = T.easel.x, np = Math.min(4, d.past.length);
    for (var pc = 0; pc < np; pc++) { var cx = ea - 22 + (pc % 2) * 24, cy = 336 + Math.floor(pc / 2) * 30, rot = (hash(pc) - 0.5) * 0.2 + (S.hot === 'past' ? Math.sin(t * 5 + pc) * 0.05 : 0);
      g.save(); g.translate(cx + 10, cy + 12); g.rotate(rot); fillRR(g, -10, -12, 20, 24, 2, '#FFFFFF'); var dm2 = EV.dayMon(d.past[pc].date); text(g, String(dm2[0]), 0, -1, 8, 800, NAVY, 'center'); text(g, dm2[1].toUpperCase(), 0, 7, 5, 800, '#7A6A80', 'center');
      g.strokeStyle = 'rgba(226,69,60,.8)'; g.lineWidth = 1; g.strokeRect(-9, 1.5, 18, 7); g.restore(); fillE(g, cx + 10, cy, 1.8, 1.8, CORAL); }
    text(g, d.past.length + ' ended', ea, 400, 6.4, 800, 'rgba(255,255,255,.8)', 'center');
    /* the online monitor: the next Nexi Explains premiere, a pulsing play button */
    var m = T.mon; fillRR(g, m.x, m.y, m.w, m.h, 3, '#FFF6F3'); fillRR(g, m.x, m.y, m.w, 12, 3, CORAL); text(g, 'PREMIERE', m.x + m.w / 2, m.y + 8.6, 5.6, 800, '#FFFFFF', 'center');
    var pp = 0.85 + 0.15 * Math.sin(t * 4); g.save(); g.translate(m.x + 18, m.y + 32); g.scale(pp, pp); fillE(g, 0, 0, 10, 10, CORAL); g.fillStyle = '#FFFFFF'; g.beginPath(); g.moveTo(-3, -5); g.lineTo(5, 0); g.lineTo(-3, 5); g.closePath(); g.fill(); g.restore();
    if (d.web) { text(g, fmt(d.web), m.x + 32, m.y + 30, 8, 800, NAVY); text(g, '18:00 SGT', m.x + 32, m.y + 40, 5.6, 700, '#7A6A80'); } else text(g, 'SOON', m.x + 34, m.y + 34, 8, 800, NAVY);
    /* the stage LED wall: three slides that advance when the speaker clicks */
    var L = T.led, sl = SLIDE.n % 3, f = clamp((t - SLIDE.t) / 0.4, 0, 1); g.save(); g.beginPath(); g.rect(L.x, L.y, L.w, L.h); g.clip();
    var bgc = ['#2A1F3F', '#3167CA', '#714B67'][sl]; g.fillStyle = bgc; g.fillRect(L.x, L.y, L.w, L.h); g.globalAlpha = f; g.translate((1 - f) * 20, 0);
    if (sl === 0) { var nx = d.next;
      if (nx) { text(g, 'NEXT UP · TECHNEXT', L.x + 12, L.y + 20, 8, 800, SUN); var dm3 = EV.dayMon(nx.date); text(g, dm3[0] + ' ' + dm3[1], L.x + 12, L.y + 50, 26, 800, '#FFFFFF'); text(g, short(nx.title, 30), L.x + 12, L.y + 70, 8, 800, '#FFFFFF'); text(g, short(nx.kind + ' · ' + nx.where, 34), L.x + 12, L.y + 84, 7, 700, 'rgba(255,255,255,.75)');
        var days = Math.max(0, Math.ceil((EV.start(nx) - Date.now()) / 864e5)); fillRR(g, L.x + 12, L.y + 92, 76, 16, 8, SUN); text(g, days === 0 ? 'TODAY' : 'IN ' + days + (days === 1 ? ' DAY' : ' DAYS'), L.x + 50, L.y + 103, 7.4, 800, NAVY, 'center'); }
      else { text(g, 'STAY TUNED', L.x + L.w / 2, L.y + 58, 20, 800, '#FFFFFF', 'center'); text(g, 'New TechNext dates appear here first', L.x + L.w / 2, L.y + 76, 7, 700, 'rgba(255,255,255,.8)', 'center'); for (var sd = 0; sd < 3; sd++) fillE(g, L.x + L.w / 2 - 12 + sd * 12, L.y + 92, 3, 3, Math.floor(t * 3) % 3 === sd ? SUN : 'rgba(255,255,255,.35)'); } }
    else if (sl === 1) { fillE(g, L.x + 34, L.y + 50, 20, 20, '#FFFFFF'); g.fillStyle = BLUE; g.beginPath(); g.moveTo(L.x + 28, L.y + 40); g.lineTo(L.x + 44, L.y + 50); g.lineTo(L.x + 28, L.y + 60); g.closePath(); g.fill();
      text(g, 'Nexi Explains', L.x + 62, L.y + 48, 15, 800, '#FFFFFF'); text(g, 'Season 1 · on YouTube', L.x + 62, L.y + 62, 7, 700, 'rgba(255,255,255,.8)'); text(g, d.by.nexi.length + ' premieres ahead', L.x + 12, L.y + 98, 8, 800, SUN); }
    else { text(g, "EVENTS WE'RE JOINING", L.x + 12, L.y + 20, 8, 800, SUN); fillRR(g, L.x + 12, L.y + 32, L.w - 24, 44, 8, 'rgba(255,255,255,.14)'); text(g, d.by.joining.length ? d.by.joining.length + ' ahead' : 'Announced here soon', L.x + L.w / 2, L.y + 59, 12, 800, '#FFFFFF', 'center'); text(g, 'Only events TechNext will take part in', L.x + 12, L.y + 98, 6.6, 700, 'rgba(255,255,255,.8)'); }
    g.restore();
    g.fillStyle = 'rgba(0,0,0,.12)'; for (var sc = L.y; sc < L.y + L.h; sc += 3) g.fillRect(L.x, sc, L.w, 1);
    for (var dt = 0; dt < 3; dt++) fillE(g, L.x + L.w / 2 - 10 + dt * 10, L.y + L.h + 2, 2.2, 2.2, dt === sl ? SUN : 'rgba(255,255,255,.35)');
    /* spotlights on the truss: sweep softly; tapped (or the speaker's bow), they flash and sweep wide */
    var lt = t - LIGHTS.t, wide = lt < 2.4 ? bell(lt / 2.4) : 0;
    [[826, 0], [946, 1.7]].forEach(function (s, i) { var a = Math.sin(t * 0.6 + s[1]) * (0.18 + wide * 0.35), ex = s[0] + Math.sin(a) * 300, ey = st0;
      g.save(); g.globalAlpha = 0.16 + wide * 0.22; g.fillStyle = '#FFF2C8'; g.beginPath(); g.moveTo(s[0] - 6, -100); g.lineTo(s[0] + 6, -100); g.lineTo(ex + 50, ey); g.lineTo(ex - 50, ey); g.closePath(); g.fill(); g.restore();
      fillRR(g, s[0] - 10, -112, 20, 14, 4, '#3A3048'); fillE(g, s[0], -98, 7, 3, '#FFF2C8'); });
    /* the confetti cannon at the stage edge (tapped) */
    var bt = t - BOOM.t; fillRR(g, 986, 392, 14, 40, 4, '#5A4A68'); g.save(); g.translate(993, 392); g.rotate(-0.35 - (bt < 0.3 ? bell(bt / 0.3) * 0.2 : 0)); fillRR(g, -8, -30, 16, 32, 5, SUN); fillRR(g, -9, -32, 18, 6, 3, CORAL); g.restore();
    /* the hall clock (Singapore time), right of the stage */
    if (e.r > 1000) CO.clock(g, 1004, 30, 16, 8, PUR);
    /* the photo wall's ring light (live glow) */
    if (e.r > T.photo.x) { g.strokeStyle = 'rgba(255,255,255,.95)'; g.lineWidth = 6; g.beginPath(); g.arc(T.photo.x - 14, 310, 20, 0, 7); g.stroke(); }
    COL.draw(XSC, g, t, S);
    CO.crew(CREW, g, t, S, false);
    /* margin extras: a visitor posing at the photo wall, a kiosk helper */
    if (e.r > T.photo.x) { actPose(POSE, t); K.person(g, POSE, t); }
    if (e.r > T.kiosk.x - 40) { actKiosk(KIO, t); K.person(g, KIO, t); }
  }
  var st0 = 432;
  var POSE = W({ x: 1120, y: 470, s: 0.48, ph: 0.4, skin: 1, hair: 2, style: 'long', outfit: 'cardigan', top: '#7B5BD6', top2: '#FFFFFF', id: PASS, hands: [[-70, -150], [70, -150]], look: -0.3 }), POSEJ = { t: -9 };
  var KIO = W({ x: 1300, y: 470, s: 0.48, ph: 1.8, skin: 4, hair: 0, style: 'short', outfit: 'polo', top: MINT, hands: [[-60, -200], [60, -200]], look: -0.5 }), KIOJ = { t: -9 };
  function actPose(P, t) { var u = t - POSEJ.t, k2 = Math.floor(t / 2.8) % 3; P.sx = 1; P.hop = 0; P.mood = 'happy';
    P.hands = k2 === 0 ? [[-70, -150], [100, -380]] : k2 === 1 ? [[-110, -360], [110, -360]] : [[-40, -280], [70, -150]]; P.tilt = Math.sin(t * 1.3) * 0.05;
    if (u < 1.4) { P.hop = Math.abs(Math.sin(u / 1.4 * Math.PI * 2)) * 36; P.hands = [[-110, -380], [110, -380]]; P.talk = true; } else P.talk = false; }
  function actKiosk(P, t) { var u = t - KIOJ.t, c = t % 6; P.sx = 1; P.hop = 0; P.mood = c > 4 ? 'happy' : 'calm'; P.talk = c > 4;
    P.hands = c < 4 ? [[-130, -280 + Math.sin(t * 2) * 8], [60, -200]] : [[-60, -200], [128 + Math.sin(t * 12) * 14, -390]];
    if (u < 1.8) { P.hands = [[-60, -200], [110, -360]]; P.hop = bell(u / 1.8) * 20; P.mood = 'happy'; P.talk = true; } }
  function paintFrontLive(g, t, S) {
    CO.crew(CREW, g, t, S, true);
    /* the host's scanner beam and the bell */
    var p = T.pod.x, bl = t - BELL.t, sw = bl < 1.5 ? Math.sin(bl * 30) * 0.4 * (1 - bl / 1.5) : 0;
    g.save(); g.translate(p - 18, 374); g.rotate(sw); fillE(g, 0, -2, 9, 3, '#C9A227'); g.beginPath(); g.arc(0, -2, 8, Math.PI, 0); g.fillStyle = SUN; g.fill(); fillE(g, 0, -11, 2.5, 2.5, '#C9A227'); g.restore();
    if (bl < 1.6) COL.pop(g, p - 18, 340, 'DING! Welcome!', bl / 1.6, PUR);
    if (HOST._scan) { var h = COL.hand(HOST, 1); g.save(); g.globalAlpha = 0.5 + 0.5 * Math.sin(t * 20); g.strokeStyle = '#2BC48A'; g.lineWidth = 2; g.beginPath(); g.moveTo(h[0] + 4, h[1] - 4); g.lineTo(h[0] + 34, h[1] - 18); g.lineTo(h[0] + 34, h[1] + 12); g.closePath(); g.stroke(); g.restore(); fillRR(g, h[0] - 6, h[1] - 10, 12, 18, 3, '#2A3550'); }
    /* visitor 1's phone ticket */
    var h1 = COL.hand(V1, 1); if (V1._ph) { COL.phone(g, h1[0], h1[1] - 8, -0.1, true); } if (V1._u < 2) COL.pop(g, V1.x - 10, V1.y - 280, '✓ Reminder set', V1._u / 2, '#0E7A50');
    /* visitor 2's programme booklet, and the selfie phone + flash */
    if (V2._bro) { var a = COL.hand(V2, 0), b = COL.hand(V2, 1), mx = (a[0] + b[0]) / 2, my = Math.min(a[1], b[1]); g.save(); g.translate(mx, my - 4); fillRR(g, -16, -14, 15, 22, 2, '#FFFFFF'); fillRR(g, 1, -14, 15, 22, 2, '#F7F3F6'); fillRR(g, -16, -14, 15, 6, 2, PUR); fillRR(g, -13, -4, 9, 2, 1, '#C9D3E3'); fillRR(g, 4, -10, 9, 2, 1, '#C9D3E3'); fillRR(g, 4, -5, 7, 2, 1, '#C9D3E3'); g.restore(); }
    if (V2._u < 2.2) { var hp = COL.hand(V2, 1); COL.phone(g, hp[0], hp[1] - 6, 0.2, true); var fl = t - SEL.t; if (fl < 0.5) { g.save(); g.globalAlpha = (1 - fl * 2) * 0.85; fillE(g, hp[0], hp[1] - 8, 30 + fl * 60, 30 + fl * 60, '#FFFFFF'); g.restore(); } }
    /* the Vietnam booth's programme, and its unrolled banner with the next Vietnam date */
    if (VNS._fl) { var hv = COL.hand(VNS, 1); COL.sheet(g, hv[0] + 6, hv[1] - 10, 0.15, 16, 22, 5); }
    var bu = t - BANNER.t; if (bu < 2.6) { var un = ease(bu / 0.5) * (1 - ease((bu - 2.1) / 0.5)), vn = (data().by.nexi || [])[0];
      g.save(); g.translate(480, 186); fillRR(g, -46, -4, 92, 6, 3, '#B5865A'); fillRR(g, -42, 0, 84, 50 * un, 3, PUR); if (un > 0.6) { text(g, vn ? fmt(vn) : 'SOON', 0, 24, 13, 800, SUN, 'center'); text(g, vn ? 'PREMIERE · YOUTUBE' : 'NEW EPISODES', 0, 38, 6.4, 800, '#FFFFFF', 'center'); } g.restore(); }
    /* the speaker's mic pop when he bows */
    var su = COL.tap(SPKst || { wave: 0 }, t).e; if (su < 2.6 && su > 1.1) COL.pop(g, SPK.x, SPK.y - 290, 'Thank you!', (su - 1.1) / 1.5, PUR);
    CR.draw(g, t);
  }
  var SPKst = null;

  window.IXW.worlds.events = {
    pan: [-320, 1180],
    paintBg: paintBg, windowBehind: true, paintFrame: paintFrame, paintBack: paintBack, paintFront: paintFront, paintFore: paintFore,
    paintWindow: paintWindow, paintLive: function (g, t, now, S) { SPKst = S.cast.spk; paintLive(g, t, now, S); }, paintFrontLive: paintFrontLive,
    paintForeLive: function (g, t, S) { K.zfore(g, t, S, [], function () { CO.crew(CREW, g, t, S, 'fore'); }); CR.draw(g, t); },
    moteCol: 'rgba(255,201,74,.5)',
    glow: {
      next: function (g) { var L = T.led; rr(g, L.x - 12, L.y - 12, L.w + 24, L.h + 24, 10); },
      booths: function (g) { rr(g, 142, 34, 406, 370, 12); },
      timeline: function (g) { var r = T.ribbon; rr(g, r.x0 - 6, r.y - 26, r.x1 - r.x0 + 12, 52, 26); },
      past: function (g) { rr(g, T.easel.x - 40, 294, 80, 124, 8); },
      register: function (g) { rr(g, T.pod.x - 46, 352, 92, 80, 10); },
      online: function (g) { var m = T.mon; rr(g, m.x - 10, m.y - 10, m.w + 20, m.h + 30, 10); },
      lights: function (g) { rr(g, 806, -122, 160, 36, 12); }, cannon: function (g) { rr(g, 974, 352, 38, 84, 10); }
    },
    backGlow: ['next', 'booths', 'timeline', 'past', 'online'],
    calmView: [190, -60, 790, 632],
    cast: [
      { id: 'vns', behind: true, keys: ['booths'], P: VNS, act: actVn },
      { id: 'host', behind: true, keys: ['register'], P: HOST, act: actHost },
      { id: 'spk', behind: true, keys: ['next'], P: SPK, act: actSpk },
      { id: 'v1', behind: true, keys: [], P: V1, act: actV1 },
      { id: 'v2', behind: true, keys: [], P: V2, act: actV2 }
    ],
    toy: function (name, S, t) {
      if (name === 'lights') { LIGHTS.t = t; CR.burst('star', 886, -60, t); }
      if (name === 'cannon') { BOOM.t = t; CR.burst('conf', 960, 340, t); setTimeout(function () { CR.burst('conf', 900, 300, S.t); }, 160); }
    },
    hit: function (x, y, S, t) {
      var r = CR.hitWalker(x, y, t); if (r) return r;
      var xr = COL.hit(XSC, x, y, t); if (xr) return xr;
      function on(P) { return Math.abs(x - P.x) < 50 && y < P.y + 6 && y > P.y - 250; }
      if (S.ext.r > T.photo.x && on(POSE)) { POSEJ.t = t; CR.burst('conf', POSE.x, POSE.y - 250, t); return { say: 'A photo at the wall: **#TechNextEvents**!', near: [900, 60], pose: 'love', who: 'A visitor' }; }
      if (S.ext.r > T.kiosk.x && on(KIO)) { KIOJ.t = t; CR.burst('spark', KIO.x, KIO.y - 250, t); return { say: 'Every date on this page is a **TechNext** date: our own events, or ones we will join.', near: [900, 60], pose: 'hello', who: 'Info desk' }; }
      return null;
    }
  };
})(window.IXW && window.IXW.kit, window.CR, window.CO, window.COL);
