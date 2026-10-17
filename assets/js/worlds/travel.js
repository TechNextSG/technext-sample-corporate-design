/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: travel (/industries/travel) — Bluewave Journeys, a sample travel agency, drawn as an AIRPORT TERMINAL.
   A glass curtain wall runs the full width of the hero: sky, the control tower, parked tails at the far gates and the
   runway, where a jet takes off now and then (tap the runway to send it early) and a small plane taxis; the view passes
   BEHIND the props (windowBehind). Inside: a hanging split-flap departures board whose remarks flip to each trip's margin
   on the Margins stop (Dashboards), two hanging world clocks on the visitor's real time, a wayfinding sign, the information
   totem with a live chat (CRM enquiries), the check-in counter with the itinerary display (Sales) and the card terminal
   (deposits), the baggage belt carrying suitcases tagged AIR / HOTEL / RAIL (Purchase: one purchase per supplier service;
   they hop on the Suppliers stop), the bag-drop scale, the currency-exchange booth whose rates flip (Accounting, multi-
   currency), a luggage trolley, a swaying potted palm, and the TechNext paper plane, which glides under the board and
   loops when you tap it. Staff: Lina at check-in (sample); Sam, a traveller, at the exchange booth (sample). Painted with
   the kit in industry-world.js. */
(function (K) {
  'use strict';
  if (!K) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed;
  var F = 470, HZ = 372;                    /* the floor line; the runway's horizon behind the glass */
  var T = {
    gates: { x: 104, y: 14, w: 176, h: 34 },
    board: { x: 468, y: 16, w: 300, h: 120 },
    clocks: [{ x: 836, y: 74, r: 19, tz: 8, lab: 'SIN', rim: '#21B799' }, { x: 900, y: 74, r: 19, tz: 9, lab: 'TYO', rim: '#FF8FA3' }],
    booth: { x: 318, y: 236, w: 118, h: 234 },
    totem: { x: 452, y: 268, w: 50, h: 202 },
    desk: { x: 528, y: 334, w: 268 },
    screen: { x: 560, y: 286 }, term: { x: 708, y: 300 }, scale: { x: 806 },
    belt: { x0: 892, x1: 1030, y: 426 },
    trolley: { x: 92, y: 492 }, palm: { x: 1004, y: 506 }
  };
  var base = ((document.currentScript && document.currentScript.src) || '').replace(/assets\/js\/worlds\/.*$/, '');
  var LOGO = new Image(); LOGO.decoding = 'async'; LOGO.src = base + 'assets/img/logo-plane.png';
  function planeIcon(g, x, y, s, col) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = col; g.beginPath(); g.moveTo(9, -7); g.lineTo(-9, 0); g.lineTo(-3, 2); g.lineTo(-1, 8); g.lineTo(2, 3); g.lineTo(9, -7); g.closePath(); g.fill(); g.restore(); }
  function jet(g, x, y, s, tilt, tail) { /* a side-on jet, nose to the left */
    g.save(); g.translate(x, y); g.rotate(tilt || 0); g.scale(s, s);
    fillRR(g, -46, -7, 92, 14, 7, '#FFFFFF'); g.fillStyle = '#FFFFFF'; g.beginPath(); g.moveTo(-46, 0); g.quadraticCurveTo(-56, 0, -50, -5); g.lineTo(-44, -7); g.closePath(); g.fill();
    g.fillStyle = tail || '#3167CA'; g.beginPath(); g.moveTo(30, -6); g.lineTo(44, -26); g.lineTo(50, -26); g.lineTo(46, -6); g.closePath(); g.fill();
    g.fillStyle = '#D5DEEC'; g.beginPath(); g.moveTo(-6, 2); g.lineTo(16, 18); g.lineTo(24, 18); g.lineTo(12, 2); g.closePath(); g.fill();
    g.fillStyle = '#9DB7DC'; for (var i = 0; i < 7; i++) g.fillRect(-34 + i * 9, -3, 4, 3);
    g.fillStyle = tail || '#3167CA'; g.fillRect(-46, 3, 92, 2.5); g.restore();
  }

  /* ---------------- the view through the glass: sky, city, tower, parked tails, apron (hero px, painted once) ---------------- */
  function paintBg(g, W, Hh, k, sx, sy) {
    var fy = sy + F * k, hz = sy + HZ * k, top = sy - 40 * k;
    var sk = g.createLinearGradient(0, 0, 0, hz); sk.addColorStop(0, '#7FC6F5'); sk.addColorStop(0.7, '#CFEAFB'); sk.addColorStop(1, '#F1F9FF'); g.fillStyle = sk; g.fillRect(0, 0, W, hz);
    g.fillStyle = '#C2DDF0'; for (var i = 0, x = -40; x < W; i++) { var bw = (30 + hash(i * 3.1) * 50) * k, bh = (16 + hash(i * 1.7) * 46) * k; g.fillRect(x, hz - bh, bw, bh); x += bw + 6 * k; }
    var tx = sx + 120 * k; g.fillStyle = '#B4CFE6'; g.fillRect(tx - 6 * k, hz - 120 * k, 12 * k, 120 * k); fillRR(g, tx - 22 * k, hz - 146 * k, 44 * k, 26 * k, 6 * k, '#A9C6E0'); g.fillStyle = '#E7F4FF'; g.fillRect(tx - 18 * k, hz - 141 * k, 36 * k, 10 * k);
    for (var p = 0; p < 6; p++) { var px = sx + (560 + p * 120) * k, ph = hz - 4 * k; g.fillStyle = p % 2 ? '#FFFFFF' : '#F3F7FC'; g.fillRect(px - 40 * k, ph - 10 * k, 80 * k, 10 * k);
      g.fillStyle = ['#3167CA', '#21B799', '#FF8A65', '#7B5BD6', '#3FA9E0', '#FFC94A'][p]; g.beginPath(); g.moveTo(px + 24 * k, ph - 10 * k); g.lineTo(px + 36 * k, ph - 32 * k); g.lineTo(px + 42 * k, ph - 32 * k); g.lineTo(px + 38 * k, ph - 10 * k); g.closePath(); g.fill(); }
    var ap = g.createLinearGradient(0, hz, 0, fy); ap.addColorStop(0, '#B9C7D6'); ap.addColorStop(1, '#9FB0C3'); g.fillStyle = ap; g.fillRect(0, hz, W, fy - hz);
    g.fillStyle = 'rgba(255,255,255,.85)'; for (var d = -2; d < W / (60 * k) + 2; d++) g.fillRect(d * 60 * k + (sx % (60 * k)), hz + (fy - hz) * 0.46, 30 * k, 3 * k);
    g.fillStyle = '#F2C14E'; g.fillRect(0, hz + (fy - hz) * 0.18, W, 2 * k);
  }
  /* ---------------- the terminal in front of the view: reflections, mullions, ceiling, floor (hero px, painted once) ---------------- */
  function paintFrame(g, W, Hh, k, sx, sy) {
    var fy = sy + F * k, top = sy - 40 * k;
    g.fillStyle = 'rgba(255,255,255,.18)'; for (var s2 = 0; s2 < W; s2 += 420 * k) { g.beginPath(); g.moveTo(s2, top + 40 * k); g.lineTo(s2 + 120 * k, top + 40 * k); g.lineTo(s2 + 40 * k, fy); g.lineTo(s2 - 80 * k, fy); g.closePath(); g.fill(); }
    g.fillStyle = '#E9EFF6'; for (var m = (sx % (140 * k)) - 140 * k; m < W; m += 140 * k) g.fillRect(m, 0, 7 * k, fy);
    g.fillRect(0, sy + 150 * k, W, 5 * k); g.fillRect(0, sy + 300 * k, W, 5 * k);
    var ceil = Math.max(top + 46 * k, 0), cg = g.createLinearGradient(0, 0, 0, Math.max(ceil, 1)); cg.addColorStop(0, '#F7F9FC'); cg.addColorStop(1, '#E3EAF2'); g.fillStyle = cg; g.fillRect(0, 0, W, ceil);
    for (var l = (sx % (180 * k)) - 180 * k; l < W; l += 180 * k) fillRR(g, l + 40 * k, Math.max(top + 30 * k, 4), 90 * k, 6 * k, 3 * k, 'rgba(255,255,255,.95)');
    g.fillStyle = '#D5DEE9'; g.fillRect(0, ceil, W, 4 * k);
    var fl = g.createLinearGradient(0, fy, 0, Hh); fl.addColorStop(0, '#EEF2F7'); fl.addColorStop(1, '#D9E2EC'); g.fillStyle = fl; g.fillRect(0, fy, W, Hh - fy);
    g.fillStyle = '#C9D4E1'; g.fillRect(0, fy, W, 6 * k);
    g.strokeStyle = 'rgba(255,255,255,.8)'; g.lineWidth = 2 * k; g.beginPath(); var cx = sx + 600 * k;
    for (var r = 1; r < 9; r++) { var yy = fy + Math.pow(r / 8, 1.6) * (Hh - fy); g.moveTo(0, yy); g.lineTo(W, yy); }
    for (var c2 = -30; c2 <= 30; c2++) { g.moveTo(cx + c2 * 90 * k, fy); g.lineTo(cx + c2 * 90 * k * 2.8, Hh + 40); } g.stroke();
    g.fillStyle = 'rgba(127,198,245,.10)'; for (var rf = (sx % (140 * k)) - 140 * k; rf < W; rf += 140 * k) g.fillRect(rf + 20 * k, fy + 8 * k, 70 * k, (Hh - fy) * 0.5);
  }


  /* ---------------- beyond the frame: the rest of the terminal (ext = the whole hero in set units) ----------------
     Far left: self check-in kiosks and the A1-A3 counters with a queue lane. Behind the copy: the duty-free shop under the
     arrivals screen. Right: the gates sign over a moving walkway and a bench. Travellers walk with their cases. */
  function wideBack(g, ext) {
    if (ext.l < -480) {
      [-920, -858].forEach(function (kx) { soft(g, kx + 22, F + 4, 26, 6, 0.2); fillRR(g, kx, 300, 44, 170, 10, '#FFFFFF'); fillRR(g, kx + 6, 314, 32, 46, 4, '#2A3550'); fillRR(g, kx + 9, 317, 26, 40, 2, '#DDF0FB');
        fillRR(g, kx + 12, 324, 20, 6, 2, '#3167CA'); fillRR(g, kx + 12, 336, 14, 4, 2, '#9DB7DC'); fillRR(g, kx + 8, 372, 28, 6, 3, '#9AA6BC'); fillRR(g, kx - 2, 292, 48, 12, 6, '#3167CA'); text(g, 'SELF', kx + 22, 301, 7, 800, '#FFFFFF', 'center'); });
      var cx = -780; fillRR(g, cx, 334, 250, 14, 6, '#E6ECF4'); fillRR(g, cx + 6, 346, 238, F - 346, 10, '#FFFFFF'); g.fillStyle = '#3167CA'; g.fillRect(cx + 6, 372, 238, 26);
      text(g, 'CHECK-IN  A1 – A3', cx + 125, 390, 11, 800, '#FFFFFF', 'center'); [cx + 30, cx + 110, cx + 190].forEach(function (sx) { fillRR(g, sx, 292, 50, 40, 6, '#2A3550'); fillRR(g, sx + 4, 296, 42, 30, 3, '#FFFFFF'); fillRR(g, sx + 4, 296, 42, 7, 2, '#3FA9E0'); });
      for (var st = 0; st < 5; st++) { var px = cx + 10 + st * 58; g.fillStyle = '#9AA6BC'; g.fillRect(px, 500, 4, 70); fillE(g, px + 2, 572, 10, 3, '#9AA6BC'); fillE(g, px + 2, 498, 4, 4, '#C3CDDA'); if (st < 4) { g.fillStyle = '#3167CA'; g.fillRect(px + 4, 506, 54, 5); } }
    }
    if (ext.l < 80) { /* the arrivals screen and the duty-free shop */
      fillRR(g, -380, 40, 220, 92, 8, '#17284A'); g.fillStyle = '#9AA6BC'; g.fillRect(-330, 0, 3, 40); g.fillRect(-210, 0, 3, 40); fillRR(g, -374, 46, 208, 18, 5, '#21375F'); text(g, 'ARRIVALS', -364, 59, 9.5, 800, '#7FE9C4');
      [['SINGAPORE', 'LANDED'], ['KUALA LUMPUR', 'ON TIME'], ['BANGKOK', 'DELAYED']].forEach(function (r, i) { text(g, r[0], -364, 82 + i * 16, 8, 800, '#F3E7C9'); text(g, r[1], -176, 82 + i * 16, 8, 800, r[1] === 'DELAYED' ? '#FF8FA3' : '#7FE9C4', 'right'); });
      var dx = -440; fillRR(g, dx, 186, 330, 284, 8, '#1E2A4A'); fillRR(g, dx + 10, 222, 310, 248, 4, '#F6F1E7'); fillRR(g, dx + 20, 194, 290, 22, 6, '#FFC94A'); text(g, 'DUTY FREE', dx + 165, 210, 12, 800, '#1E2A4A', 'center');
      for (var sh = 0; sh < 3; sh++) { var sy = 270 + sh * 60; fillRR(g, dx + 20, sy, 290, 6, 2, '#C9B79C'); for (var it = 0; it < 8; it++) { var ix = dx + 30 + it * 35, cols = ['#FF8FA3', '#7B5BD6', '#3FA9E0', '#FFC94A', '#21B799'];
        if ((it + sh) % 3 === 0) fillRR(g, ix, sy - 30, 18, 30, 4, cols[(it + sh) % 5]); else { fillRR(g, ix, sy - 22, 22, 22, 4, cols[(it * 2 + sh) % 5]); fillRR(g, ix + 7, sy - 26, 8, 5, 2, '#C9B79C'); } } }
      g.fillStyle = 'rgba(255,255,255,.25)'; g.beginPath(); g.moveTo(dx + 40, 470); g.lineTo(dx + 160, 222); g.lineTo(dx + 200, 222); g.lineTo(dx + 80, 470); g.closePath(); g.fill();
    }
    if (ext.r > 1000) { /* the gates sign, the moving walkway, a bench */
      g.fillStyle = '#9AA6BC'; g.fillRect(1060, 0, 3, 40); g.fillRect(1240, 0, 3, 40); shadowed(g, 10, 4, 0.2, function () { fillRR(g, 1040, 40, 220, 36, 6, '#1E2A4A'); });
      fillRR(g, 1048, 46, 24, 24, 4, '#FFC94A'); planeIcon(g, 1060, 58, 0.9, '#1E2A4A'); text(g, 'Gates B10–B20', 1082, 64, 13, 800, '#FFC94A'); text(g, '→', 1244, 65, 15, 800, '#FFFFFF', 'center');
      fillRR(g, 1010, 476, 420, 20, 6, '#8191AA'); fillRR(g, 1010, 470, 420, 8, 4, '#55657F');
      var bx = 1280; fillRR(g, bx, 420, 120, 14, 5, '#3FA9E0'); fillRR(g, bx, 398, 120, 24, 6, '#2B8CC4'); g.fillStyle = '#9AA6BC'; g.fillRect(bx + 10, 434, 6, 36); g.fillRect(bx + 104, 434, 6, 36);
    }
  }
  function wideLive(g, t, S) {
    var ext = S.ext;
    if (ext.r > 1000) { g.save(); rr(g, 1010, 476, 420, 20, 6); g.clip(); g.fillStyle = 'rgba(255,255,255,.55)'; for (var a = 1000 + ((t * 30) % 40); a < 1440; a += 40) { g.beginPath(); g.moveTo(a, 480); g.lineTo(a + 10, 486); g.lineTo(a, 492); g.closePath(); g.fill(); } g.restore(); }
    trav(g, t, S, false);
  }
  var TRAV = [{ x0: -940, x1: -520, y: 488, spd: 24, ph: 0.1, drag: '#FF8A65', P: { s: 0.44, ph: 0.4, c: { skin: '#F3CDA8', hair: '#4A2E22', top: '#3167CA', low: '#2A3550', shoe: '#F7F8FB' }, outfit: 'tee', hairStyle: 'long', hijab: '#1E4691', mood: 'happy', look: 0, hands: [[-70, -150], [70, -150]] } },
    { x0: -430, x1: 60, y: 490, spd: 18, ph: 0.6, drag: '#21B799', P: { s: 0.44, ph: 1.3, c: { skin: '#6B4329', hair: '#1F1A1A', top: '#FFC94A', low: '#2A3550', shoe: '#F7F8FB', hat: '#F2D59B', hatBand: '#FF8A65' }, outfit: 'tee', hat: 'sunhat', hairStyle: 'buzz', short: true, mood: 'calm', look: 0, hands: [[-70, -150], [70, -150]] } },
    { front: true, x0: -930, x1: -380, y: 650, spd: 28, ph: 0.35, drag: '#7B5BD6', P: { s: 0.5, ph: 2.2, c: { skin: '#E8B48F', hair: '#2B1D16', top: '#FF8FA3', low: '#2A3550', shoe: '#F7F8FB' }, outfit: 'tee', backpack: '#3FA9E0', hairStyle: 'pony', clipCol: '#FFC94A', mood: 'happy', look: 0, hands: [[-70, -150], [70, -150]] } }];
  function trav(g, t, S, front) { var ext = S.ext;
    TRAV.slice().sort(function (a, b) { return a.y - b.y; }).forEach(function (w) { var L = (w.front || w.y >= 560) ? 'fore' : w.y > 470; if (L !== front) return; var a = Math.max(w.x0, ext.l + 40), b = Math.min(w.x1, ext.r - 50); if (b - a < 60) return; K.walker(g, { x0: a, x1: b, y: w.y, spd: w.spd, ph: w.ph, drag: w.drag, P: w.P }, t); }); }

  /* ---------------- static back props (set units) ---------------- */
  /* ---------------- more of the terminal: roof trusses and a welcome banner; seats, a trolley, a palm ---------------- */
  function moreBack(g, ext) {
    var ty = Math.max(ext.t + 30, -150); g.strokeStyle = 'rgba(150,165,190,.55)'; g.lineWidth = 3; g.beginPath(); g.moveTo(ext.l, ty); g.lineTo(ext.r, ty); g.moveTo(ext.l, ty + 34); g.lineTo(ext.r, ty + 34);
    for (var x = Math.floor(ext.l / 40) * 40; x < ext.r; x += 40) { g.moveTo(x, ty + 34); g.lineTo(x + 20, ty); g.lineTo(x + 40, ty + 34); } g.stroke();
    for (var b = Math.floor(ext.l / 360) * 360 + 180; b < ext.r; b += 360) { if (b > 120 && b < 1000) continue; fillRR(g, b - 90, ty + 50, 180, 40, 6, '#1E4691'); text(g, 'WELCOME · SELAMAT DATANG', b, ty + 75, 9, 800, '#FFC94A', 'center'); g.fillStyle = '#9AA6BC'; g.fillRect(b - 70, ty + 34, 2, 16); g.fillRect(b + 68, ty + 34, 2, 16); }
  }
  function seatRow(g, x, y, n, col) { for (var i = 0; i < n; i++) { fillRR(g, x + i * 58, y - 70, 50, 44, 12, col); fillRR(g, x + i * 58 - 2, y - 32, 54, 14, 6, col); g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(x + i * 58 + 4, y - 22, 46, 4); }
    g.fillStyle = '#5C6670'; g.fillRect(x, y - 18, n * 58 - 6, 6); g.fillRect(x + 10, y - 14, 6, 14); g.fillRect(x + n * 58 - 24, y - 14, 6, 14); K.soft(g, x + n * 29, y + 4, n * 34, 7, 0.2); }
  function moreFront(g, ext) {
  }
  function paintBack(g, ext) {
    wideBack(g, ext);
    var gs = T.gates; g.fillStyle = '#9AA6BC'; g.fillRect(gs.x + 20, gs.y - 30, 3, 30); g.fillRect(gs.x + gs.w - 23, gs.y - 30, 3, 30);
    shadowed(g, 10, 4, 0.2, function () { fillRR(g, gs.x, gs.y, gs.w, gs.h, 6, '#1E2A4A'); });
    fillRR(g, gs.x + 6, gs.y + 6, 22, 22, 4, '#FFC94A'); planeIcon(g, gs.x + 17, gs.y + 17, 0.8, '#1E2A4A');
    text(g, 'Gates A1–A12', gs.x + 36, gs.y + 22, 13, 800, '#FFC94A'); text(g, '→', gs.x + gs.w - 18, gs.y + 23, 15, 800, '#FFFFFF', 'center');
    var b = T.board; g.fillStyle = '#9AA6BC'; g.fillRect(b.x + 30, 0, 3, b.y); g.fillRect(b.x + b.w - 33, 0, 3, b.y);
    shadowed(g, 18, 8, 0.25, function () { fillRR(g, b.x, b.y, b.w, b.h, 10, '#17284A'); });
    fillRR(g, b.x + 6, b.y + 6, b.w - 12, 22, 6, '#21375F'); text(g, 'DEPARTURES', b.x + 16, b.y + 22, 11.5, 800, '#FFC94A');
    text(g, 'TRIP', b.x + 16, b.y + 42, 8.5, 800, '#8FB6E8'); text(g, 'GATE', b.x + 150, b.y + 42, 8.5, 800, '#8FB6E8'); text(g, 'REMARK', b.x + 196, b.y + 42, 8.5, 800, '#8FB6E8');
    g.fillStyle = '#9AA6BC'; g.fillRect(810, 0, 3, 52); g.fillRect(924, 0, 3, 52); fillRR(g, 804, 48, 128, 6, 3, '#C3CDDA');
    T.clocks.forEach(function (c) { K.clockFace(g, c, c.rim); fillRR(g, c.x - 16, c.y + c.r + 7, 32, 15, 7, '#FFFFFF'); text(g, c.lab, c.x, c.y + c.r + 18, 9.5, 800, '#1F1F3D', 'center'); });
    var bo = T.booth; soft(g, bo.x + bo.w / 2, F + 4, bo.w * 0.7, 12, 0.22);
    shadowed(g, 16, 6, 0.18, function () { fillRR(g, bo.x, bo.y + 34, bo.w, bo.h - 34, 10, '#FFFFFF'); });
    fillRR(g, bo.x - 8, bo.y, bo.w + 16, 40, 10, '#21B799'); text(g, 'FX', bo.x + 26, bo.y + 28, 22, 800, '#FFFFFF', 'center');
    text(g, 'CURRENCY', bo.x + 80, bo.y + 18, 8.5, 800, '#E9FFF8', 'center'); text(g, 'EXCHANGE', bo.x + 80, bo.y + 31, 8.5, 800, '#E9FFF8', 'center');
    fillRR(g, bo.x + 10, bo.y + 46, bo.w - 20, 86, 8, '#17284A'); fillRR(g, bo.x + 14, bo.y + 50, bo.w - 28, 78, 6, '#132544');
    text(g, '1 SGD =', bo.x + 22, bo.y + 66, 9.5, 800, '#8FB6E8');
    fillRR(g, bo.x + 6, bo.y + 148, bo.w - 12, 12, 4, '#E6ECF4'); fillRR(g, bo.x + 18, bo.y + 168, bo.w - 36, 54, 8, '#EAF6F4');
    g.fillStyle = 'rgba(33,183,153,.35)'; g.fillRect(bo.x + 18, bo.y + 192, bo.w - 36, 3);
    fillRR(g, bo.x + 6, bo.y + bo.h - 18, bo.w - 12, 18, 4, '#DCE6F0');
    var tt = T.totem; soft(g, tt.x + tt.w / 2, F + 4, 40, 9, 0.2);
    shadowed(g, 14, 6, 0.18, function () { fillRR(g, tt.x, tt.y, tt.w, tt.h, 14, '#FFFFFF'); });
    fillE(g, tt.x + tt.w / 2, tt.y + 20, 12, 12, '#3167CA'); text(g, 'i', tt.x + tt.w / 2, tt.y + 25, 14, 800, '#FFFFFF', 'center');
    fillRR(g, tt.x + 6, tt.y + 40, tt.w - 12, 82, 6, '#EAF0FB');
    fillRR(g, tt.x + 10, tt.y + tt.h - 16, tt.w - 20, 8, 4, '#DCE6F0');
    var be = T.belt; soft(g, (be.x0 + be.x1) / 2, F + 4, (be.x1 - be.x0) * 0.5, 10, 0.18);
    soft(g, T.desk.x + T.desk.w / 2, F + 6, T.desk.w * 0.62, 18, 0.2);
  }

  /* ---------------- static front props (over Lina) ---------------- */
  function paintFront(g, ext) {
    var d = T.desk, top = d.y;
    fillRR(g, d.x + 6, top + 12, d.w - 12, F - top - 12, 12, '#FFFFFF');
    g.save(); rr(g, d.x + 6, top + 12, d.w - 12, F - top - 12, 12); g.clip();
    g.fillStyle = 'rgba(25,40,80,.06)'; g.fillRect(d.x + d.w * 0.7, top, d.w, 200);
    g.fillStyle = '#3167CA'; g.fillRect(d.x, top + 38, d.w, 30); g.fillStyle = '#FFC94A'; g.fillRect(d.x, top + 68, d.w, 5);
    g.fillStyle = '#E8EEF5'; g.fillRect(d.x, F - 12, d.w, 12); g.restore();
    planeIcon(g, d.x + 26, top + 53, 0.9, '#FFFFFF'); text(g, 'CHECK-IN', d.x + 44, top + 58, 12, 800, '#FFFFFF');
    text(g, 'A4', d.x + d.w - 26, top + 58, 14, 800, '#FFC94A', 'center');
    fillRR(g, d.x - 4, top, d.w + 8, 14, 7, '#E6ECF4'); g.fillStyle = '#C9D3E0'; g.fillRect(d.x + 4, top + 10, d.w - 8, 4);
    var s = T.screen; fillRR(g, s.x + 26, s.y + 40, 10, 10, 2, '#AAB4C4'); fillRR(g, s.x + 14, s.y + 46, 34, 5, 2, '#C3CDDA');
    fillRR(g, s.x, s.y, 62, 44, 6, '#2A3550'); fillRR(g, s.x + 4, s.y + 4, 54, 36, 3, '#FFFFFF'); fillRR(g, s.x + 4, s.y + 4, 54, 8, 2, '#7B5BD6');
    [['#3FA9E0', 30], ['#FF8FA3', 24], ['#21B799', 32]].forEach(function (q, i) { fillE(g, s.x + 11, s.y + 18 + i * 7, 2.4, 2.4, q[0]); g.fillStyle = '#C9D3E3'; g.fillRect(s.x + 16, s.y + 16.5 + i * 7, q[1], 3); });
    var tm = T.term; g.save(); g.translate(tm.x + 18, tm.y + 14); g.rotate(-0.1); fillRR(g, -15, -18, 30, 46, 7, '#2A3550'); fillRR(g, -11, -14, 22, 14, 3, '#EAF0FB');
    for (var kk = 0; kk < 6; kk++) fillRR(g, -10 + (kk % 3) * 7.5, 4 + Math.floor(kk / 3) * 7, 5, 4.5, 1.2, kk === 5 ? '#21B799' : '#5D6E93'); g.restore();
    /* the bag-drop scale beside the desk: a low platform, a suitcase lying on it (handle and tag up), the readout on a post */
    var sc = T.scale, bx = sc.x + 6, by = F - 52;
    soft(g, sc.x + 34, F + 3, 44, 7, 0.22);
    fillRR(g, sc.x, F - 16, 66, 14, 4, '#9AA6BC'); fillRR(g, sc.x + 3, F - 19, 60, 5, 2, '#C3CDDA');
    fillRR(g, sc.x + 62, F - 84, 6, 70, 3, '#AAB4C4'); fillRR(g, sc.x + 45, F - 108, 40, 25, 6, '#2A3550'); text(g, '18.2 kg', sc.x + 65, F - 92, 8, 800, '#7FE9C4', 'center');
    g.strokeStyle = '#5B3FB6'; g.lineWidth = 4; rr(g, bx + 15, by - 10, 18, 14, 5); g.stroke();
    fillRR(g, bx, by, 48, 34, 7, '#7B5BD6'); fillRR(g, bx, by + 26, 48, 8, 4, '#6A4BC9');
    g.fillStyle = 'rgba(255,255,255,.22)'; g.fillRect(bx + 13, by + 5, 4, 22); g.fillRect(bx + 31, by + 5, 4, 22);
    g.save(); g.translate(bx + 31, by - 6); g.rotate(0.5); fillRR(g, 0, -4, 20, 10, 2, '#FFFFFF'); fillRR(g, 0, -4, 5, 10, 2, '#FFC94A'); g.restore();
    var tr = T.trolley; soft(g, tr.x + 30, tr.y + 6, 50, 8, 0.2);
    g.strokeStyle = '#9AA6BC'; g.lineWidth = 4; g.lineCap = 'round'; g.beginPath(); g.moveTo(tr.x, tr.y - 92); g.lineTo(tr.x + 6, tr.y - 6); g.lineTo(tr.x + 64, tr.y - 6); g.stroke();
    fillRR(g, tr.x + 8, tr.y - 52, 52, 44, 8, '#FF8A65'); fillRR(g, tr.x + 12, tr.y - 86, 42, 34, 7, '#FFC94A'); fillRR(g, tr.x + 26, tr.y - 92, 14, 7, 3, '#C98E2E');
    fillE(g, tr.x + 12, tr.y, 6, 6, '#2A3550'); fillE(g, tr.x + 58, tr.y, 6, 6, '#2A3550');
  }

  /* ---------------- the window: jets on the runway ---------------- */
  var JET = { next: 2, t0: -99 };
  function jetPos(t) { /* a take-off: rolls left along the runway, rotates, climbs out over the far city */
    var u = (t - JET.t0) / 7; if (u < 0 || u > 1) return null;
    var x = 1080 - u * 1500, roll = clamp((u - 0.35) / 0.25, 0, 1), y = HZ + 58 - roll * roll * 260 - Math.max(0, u - 0.6) * 220;
    return { x: x, y: y, tilt: roll * 0.22, s: 0.95 - u * 0.25 };
  }
  function paintWindow(g, t, par) {
    for (var c = 0; c < 4; c++) K.cloud(g, -500 + ((hash(c + 9) * 1900 + t * (4 + c * 1.8)) % 2000) - par * (3 + c), 30 + c * 40, 0.28 + c * 0.04);
    if (t > JET.t0 + 7 && t >= JET.next) { JET.t0 = t; JET.next = t + 12; }
    var j = jetPos(t); if (j) {
      if (j.tilt > 0.05) { g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = 3; g.setLineDash([6, 6]); g.beginPath(); g.moveTo(j.x + 60, j.y + 14); g.lineTo(j.x + 220, j.y + 70); g.stroke(); g.setLineDash([]); }
      jet(g, j.x, j.y, j.s, j.tilt, '#3167CA');
    }
    var tx = -200 + ((t * 14) % 1500); jet(g, tx, HZ + 18, 0.42, 0, '#FF8A65');
  }

  /* ---------------- live back props: clocks, the flipping board, the booth's rates, the totem chat, the belt ---------------- */
  var TRIPS = [['TOKYO', 'A4', 'ON TIME', '18%'], ['BALI', 'B2', 'BOARDING', '21%'], ['SEOUL', 'A7', 'CHECK-IN', '16%'], ['SYDNEY', 'C1', 'ON TIME', '14%']];
  var RATES = [['JPY', 113.64, 2], ['EUR', 0.685, 3], ['IDR', 12060, 0], ['KRW', 1032, 0]];
  var BAGS = [{ w: 44, h: 32, col: '#3FA9E0', dark: '#1E7FBF', tag: 'AIR' }, { w: 40, h: 36, col: '#FF8A65', dark: '#D9643F', tag: 'HOTEL' }, { w: 46, h: 30, col: '#21B799', dark: '#168F76', tag: 'RAIL' }];
  function fmt(v, d) { var s = v.toFixed(d); return d === 0 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : s; }
  function flap(g, x, y, w, h, s, col, sq) { g.save(); g.translate(x + w / 2, y + h / 2); g.scale(1, Math.max(0.08, sq)); fillRR(g, -w / 2, -h / 2, w, h, 3, '#24395E'); text(g, s, -w / 2 + 5, h / 2 - 4, 10, 800, col); g.restore(); g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(x, y + h / 2 - 0.5, w, 1); }
  function paintLive(g, t, now, S) {
    wideLive(g, t, S);
    var utc = now.getUTCHours() + now.getUTCMinutes() / 60;
    T.clocks.forEach(function (c) { var h = (utc + c.tz) % 24; K.clockHands(g, c, Math.floor(h), Math.floor((h % 1) * 60), now.getUTCSeconds()); });
    var b = T.board, margins = S.hot === 'review' || (S.toy.board != null && t - S.toy.board < 6), slot = Math.floor(t / 2.2), ph = (t % 2.2) / 2.2;
    var tapFlip = S.toy.board != null && t - S.toy.board < 0.9;
    for (var r = 0; r < 4; r++) {
      var row = TRIPS[r], y = b.y + 48 + r * 17, flipping = tapFlip || ((slot % 4) === r && ph < 0.15), sq = flipping ? Math.abs(Math.cos((tapFlip ? (t - S.toy.board) / 0.3 : ph / 0.15) * Math.PI)) : 1;
      flap(g, b.x + 12, y, 128, 14, row[0], '#F3E7C9', sq);
      flap(g, b.x + 146, y, 40, 14, row[1], '#F3E7C9', sq);
      flap(g, b.x + 192, y, 96, 14, margins ? 'MARGIN ' + row[3] : row[2], margins ? '#3FE0A8' : row[2] === 'BOARDING' ? '#FFC94A' : '#7FE9C4', sq);
    }
    var bo = T.booth, rslot = Math.floor(t / 2.6), rph = (t % 2.6) / 2.6;
    for (var q = 0; q < 3; q++) {
      var idx = (q + Math.floor(rslot / 3)) % RATES.length, R = RATES[idx], wob = 1 + (hash(rslot * 7 + idx) - 0.5) * 0.004, yy = bo.y + 74 + q * 18;
      text(g, R[0], bo.x + 22, yy + 10, 10, 800, '#F3E7C9');
      var fl2 = (rslot % 3) === q && rph < 0.14, s2 = fl2 ? Math.abs(Math.cos(rph / 0.14 * Math.PI)) : 1;
      g.save(); g.translate(bo.x + 78, yy + 6); g.scale(1, Math.max(0.08, s2)); fillRR(g, -24, -7, 52, 14, 3, '#24395E'); text(g, fmt(R[1] * wob, R[2]), 24, 4, 10, 800, '#FFC94A', 'right'); g.restore();
    }
    var tt = T.totem, cyc = t % 6;
    fillRR(g, tt.x + 10, tt.y + 50, 26, 12, 5, '#FFFFFF');
    if (cyc < 3) { for (var i = 0; i < 3; i++) fillE(g, tt.x + 17 + i * 6, tt.y + 56, 1.8, 1.8 + (Math.floor(t * 4) % 3 === i ? 0.8 : 0), '#7B8DB0'); }
    else { fillRR(g, tt.x + 14, tt.y + 68, 26, 12, 5, '#3167CA'); fillRR(g, tt.x + 10, tt.y + 86, 22, 12, 5, '#FFFFFF'); }
    var be = T.belt, span = be.x1 - be.x0 + 80, off = (t * 26) % span, hotB = S.hot === 'book';
    fillRR(g, be.x0, be.y, be.x1 - be.x0, 14, 7, '#55657F'); fillRR(g, be.x0 + 4, be.y + 14, be.x1 - be.x0 - 8, 34, 6, '#8191AA');
    g.fillStyle = '#6B7B95'; for (var lg = be.x0 + 20; lg < be.x1; lg += 60) g.fillRect(lg, be.y + 48, 8, F - be.y - 48);
    g.save(); rr(g, be.x0, be.y - 60, be.x1 - be.x0, 76, 6); g.clip();
    g.fillStyle = '#6B7B95'; for (var sl = be.x0 - 20 + (t * 26) % 20; sl < be.x1; sl += 20) g.fillRect(sl, be.y + 2, 2, 10);
    BAGS.forEach(function (bg, j) {
      var x = be.x0 - 40 + ((j * span / BAGS.length + off) % span), hop = bg.hop != null ? Math.max(0, Math.sin(Math.min(1, (t - bg.hop) / 0.6) * Math.PI)) * 26 : 0;
      bg.x = x; var y = be.y - bg.h - hop;
      fillRR(g, x, y, bg.w, bg.h, 6, bg.col); fillRR(g, x + bg.w / 2 - 7, y - 6, 14, 7, 3, bg.dark);
      g.save(); g.translate(x + bg.w - 6, y + 10); g.rotate(0.3 + (hotB ? Math.sin(t * 6 + j) * 0.15 : 0)); fillRR(g, -2, -4, 30, 13, 3, '#FFFFFF'); text(g, bg.tag, 13, 5, 7.5, 800, '#1F1F3D', 'center'); g.restore();
    });
    g.restore();
    paperPlane(g, t);
  }

  /* ---------------- the palm (on the floor in front of the belt's far end) and the paper plane (in front of the back props, behind the people) ---------------- */
  var PL = { start: 4, loop: -9, cyc: 15, dur: 5.2 };
  function bez(u) { var p = [[-60, 230], [300, 110], [640, 290], [1060, 150]], /* a glide under the board, over the booth and the desk */ a = Math.pow(1 - u, 3), b = 3 * u * (1 - u) * (1 - u), c = 3 * u * u * (1 - u), d = u * u * u;
    return [a * p[0][0] + b * p[1][0] + c * p[2][0] + d * p[3][0], a * p[0][1] + b * p[1][1] + c * p[2][1] + d * p[3][1]]; }
  function planeAt(t) {
    var local = t - PL.start; if (local < 0) return null; var cyc = local % PL.cyc; if (cyc > PL.dur) return null;
    var u = cyc / PL.dur, p = bez(u), q = bez(Math.min(1, u + 0.01)), ang = Math.atan2(q[1] - p[1], q[0] - p[0]), lt = t - PL.loop;
    if (lt >= 0 && lt < 1.3) { var la = lt / 1.3 * Math.PI * 2; p = [p[0] + Math.sin(la) * 46, p[1] - (1 - Math.cos(la)) * 46]; ang += la; }
    return { x: p[0], y: p[1], a: ang, u: u };
  }
  function palm(g, t) {
    var pl = T.palm, sw = Math.sin(t * 0.9) * 0.05;
    soft(g, pl.x, pl.y + 2, 42, 8, 0.24);
    g.strokeStyle = '#B98A55'; g.lineWidth = 9; g.beginPath(); g.moveTo(pl.x, pl.y - 50); g.quadraticCurveTo(pl.x - 6, pl.y - 120, pl.x + 4 + sw * 40, pl.y - 190); g.stroke();
    for (var fr = 0; fr < 7; fr++) {
      var a3 = -Math.PI / 2 + (fr - 3) * 0.52 + sw * (fr % 2 ? 1.4 : -1), len = 66 + (fr % 3) * 12;
      g.save(); g.translate(pl.x + 4 + sw * 40, pl.y - 190); g.rotate(a3); g.fillStyle = fr % 2 ? '#3FBF7F' : '#33A86C';
      g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(len * 0.5, -18, len, 8); g.quadraticCurveTo(len * 0.5, 9, 0, 0); g.fill(); g.restore();
    }
    fillRR(g, pl.x - 26, pl.y - 52, 52, 52, 10, '#F2C14E'); fillRR(g, pl.x - 30, pl.y - 56, 60, 12, 6, '#F6D27A');
  }
  function paperPlane(g, t) {
    var pp = planeAt(t);
    if (pp) {
      g.strokeStyle = 'rgba(49,103,202,.35)'; g.lineWidth = 2; g.setLineDash([4, 6]); g.beginPath();
      for (var trl = 0; trl <= 12; trl++) { var bp = bez(Math.max(0, pp.u - 0.15 + trl * 0.0125)); if (trl === 0) g.moveTo(bp[0], bp[1]); else g.lineTo(bp[0], bp[1]); } g.stroke(); g.setLineDash([]);
      g.save(); g.translate(pp.x, pp.y); g.rotate(pp.a * 0.35);
      if (LOGO.complete && LOGO.naturalWidth) g.drawImage(LOGO, -24, -20, 48, 41); else planeIcon(g, 0, 0, 2, '#3167CA');
      g.restore();
    }
  }
  function paintFrontLive(g, t, S) {
    trav(g, t, S, true);
    var tm = T.term, wv = (t % 1.6) / 1.6, act = S.hot === 'deposit' || S.peek === 'deposit' ? 1 : 0.5;
    g.strokeStyle = 'rgba(49,103,202,' + ((1 - wv) * act).toFixed(2) + ')'; g.lineWidth = 2; g.lineCap = 'round';
    for (var r2 = 0; r2 < 2; r2++) { g.beginPath(); g.arc(tm.x + 18, tm.y - 10, 6 + r2 * 6 + wv * 6, -2.4, -0.74); g.stroke(); }
    palm(g, t);
  }

  var LINA = { x: 652, y: 456, s: 0.56, ph: 0.4, c: { skin: '#F3CDA8', hair: '#3A2620', top: '#2A4D8F', shirt: '#FFFFFF', pocket: '#FFD84A' }, outfit: 'blazer', scarf: '#FFC94A', hairStyle: 'bun', clipCol: '#3FA9E0', feet: false, mood: 'calm', look: 0, talk: false, hands: [[-62, -186], [62, -186]] };
  var SAM = { x: 232, y: 484, s: 0.56, ph: 1.2, c: { skin: '#C68B5E', hair: '#1F1A1A', top: '#FF8A65', print: '#FFFFFF', low: '#4A6FA5', shoe: '#F7F8FB', hat: '#F2D59B', hatBand: '#3FA9E0' }, outfit: 'tee', hat: 'sunhat', backpack: '#21B799', hold: 'passport', hairStyle: 'short', short: true, feet: true, mood: 'calm', look: 0.6, talk: false, hands: [[-64, -206], [96, -150]] };

  /* the foreground, nearest last: each prop stands at a y, sorted with the front-row passers-by (K.zfore) */
  function FORE() {
    return [
      [704, function (g, ext) {
    if (ext.l < -500) seatRow(g, -700, 704, 4, '#3167CA');
      }],
      [700, function (g, ext) {
    if (ext.r > 1160) { K.plant(g, { x: 1220, y: 700 }, '#E9B949', '#F2CC6B'); }
      }]
    ];
  }
  window.IXW.worlds.travel = {
    calmView: [145,-30,780,624], /* calm layer: the framed hero shows the core of the scene */
    pan: [-400, 1280], /* phones: how far the scene drags each way (set units), ending on whole objects */
    paintBg: paintBg, paintFrame: paintFrame, windowBehind: true, paintBack: paintBack, paintFront: paintFront, paintWindow: paintWindow, paintLive: paintLive, paintFrontLive: paintFrontLive, paintForeLive: function (g, t, S) { K.zfore(g, t, S, FORE(), function () { trav(g, t, S, 'fore'); }); },
    motes: false, /* dust motes read as specks on the dark board and screens: the terminal's air is clear */
    glow: {
      enquire: function (g) { var tt = T.totem; rr(g, tt.x - 8, tt.y - 8, tt.w + 16, tt.h + 12, 18); },
      quote: function (g) { rr(g, T.screen.x - 8, T.screen.y - 8, 78, 70, 12); },
      deposit: function (g) { rr(g, T.term.x - 10, T.term.y - 22, 56, 74, 12); },
      book: function (g) { var be = T.belt; rr(g, be.x0 - 6, be.y - 52, be.x1 - be.x0 + 12, 72, 14); },
      pay: function (g) { var bo = T.booth; rr(g, bo.x - 14, bo.y - 8, bo.w + 28, bo.h + 12, 16); },
      review: function (g) { var b = T.board; rr(g, b.x - 8, b.y - 8, b.w + 16, b.h + 16, 16); }
    },
    backGlow: ['enquire', 'book', 'pay', 'review'],
    cast: [
      { id: 'lina', behind: true, keys: ['enquire', 'quote', 'deposit'], P: LINA, act: function (P, t, S) {
        var st = S.cast.lina, busy = S.hot === 'quote' || S.hot === 'deposit' || S.hot === 'enquire';
        P.talk = t < st.until; P.mood = P.talk || busy ? 'happy' : 'calm';
        var tap = busy ? Math.abs(Math.sin(t * 9)) * 7 : 0;
        P.hands = t < st.wave ? [[-62, -186], [128 + Math.sin(t * 12) * 16, -404]] : [[-62, -186 + tap], [62, -186 + (busy ? Math.abs(Math.cos(t * 9)) * 7 : 0)]];
        P.look = lerp(P.look, clamp((S.nexi.x - P.x) / 160, -1, 1), 0.08);
      } },
      { id: 'sam', keys: ['pay', 'book'], P: SAM, act: function (P, t, S) {
        var st = S.cast.sam, on = S.hot === 'pay', waving = t < st.wave;
        P.talk = t < st.until; P.mood = P.talk || on ? 'happy' : S.toy.plane != null && t - S.toy.plane < 1.6 ? 'wow' : 'calm';
        P.hop = waving ? Math.abs(Math.sin(t * 7)) * 14 : 0;
        P.hands = waving ? [[-64, -206], [118 + Math.sin(t * 12) * 16, -420]] : on ? [[-64, -206], [150, -250]] : [[-64, -206], [96, -150]];
        P.look = lerp(P.look, on ? 1 : clamp((S.nexi.x - P.x) / 160, -1, 1), 0.08);
      } }
    ],
    onStop: function (key, S, t) {
      if (key === 'review') S.toy.board = t;
      if (key === 'book') BAGS.forEach(function (bg, j) { bg.hop = t + j * 0.14; });
    },
    /* onBtn: the click landed on a button (a person, a hotspot); only the moving paper plane wins over it */
    hit: function (x, y, S, t, onBtn) {
      var pp = planeAt(t);
      if (pp && Math.hypot(x - pp.x, y - pp.y) < (onBtn ? 34 : 46)) { PL.loop = t; S.toy.plane = t; return { say: 'Whoosh! That paper plane is the **TechNext** logo. Loop-the-loop!', near: [Math.round(clamp(pp.x, 300, 760)), Math.round(clamp(pp.y + 120, 160, 330))], pose: 'celebrate' }; }
      if (onBtn) return null;
      var be = T.belt;
      for (var i = 0; i < BAGS.length; i++) { var bg = BAGS[i]; if (bg.x != null && x > bg.x - 6 && x < bg.x + bg.w + 30 && y > be.y - bg.h - 14 && y < be.y + 8) { bg.hop = t; return { say: 'Each suitcase is a supplier: **' + (bg.tag === 'AIR' ? 'the flights' : bg.tag === 'HOTEL' ? 'the hotel' : 'the rail passes') + '**, one purchase on the same booking.', near: [760, 220], pose: 'point-right' }; } }
      if (y > HZ - 40 && y < F) { if (t > JET.t0 + 7) { JET.t0 = t; JET.next = t + 12; } return { say: 'Cleared for take-off! The trip is **booked, paid and costed** before the wheels leave the ground.', near: [380, 170], pose: 'wow' }; }
      return null;
    }
  };
  /* ---------------- audit round: the floor and the space behind the title card ----------------
     A moving walkway runs the length of the terminal (its chevrons crawl), gate arrows are painted on the floor, a phone
     charging pillar stands behind the card with Ade, a traveller topping up her phone (idle: scrolls and glances at the
     departures; tapped: a selfie, flash and all), and a stack of trolleys waits by the right-hand column. */
  var ADE = { x: -24, y: 520, s: 0.47, ph: 3.3, c: { skin: '#8D5A3B', hair: '#1F1A1A', top: '#21B799', print: '#FFFFFF', low: '#2A3550', shoe: '#F7F8FB' }, outfit: 'hoodie', hairStyle: 'pony', backpack: '#FF8A65', feet: true, mood: 'calm', look: 0, hands: [[-60, -200], [64, -206]] }, ADT = { tap: -9 };
  function exFloor(g, ext) {
    /* the walkway: a steel frame, a dark belt, glass rails on both sides */
    var y0 = 548, y1 = 584; fillRR(g, ext.l, y0 - 10, ext.r - ext.l, y1 - y0 + 20, 6, '#C9D3E2'); fillRR(g, ext.l, y0, ext.r - ext.l, y1 - y0, 4, '#4A5670');
    g.fillStyle = 'rgba(255,255,255,.55)'; g.fillRect(ext.l, y0 - 10, ext.r - ext.l, 3); g.fillStyle = 'rgba(42,53,80,.18)'; g.fillRect(ext.l, y1 + 8, ext.r - ext.l, 2);
    /* painted gate arrows on the floor below it */
    for (var x = Math.floor(ext.l / 300) * 300 + 60; x < ext.r; x += 300) { g.fillStyle = 'rgba(242,181,68,.55)'; g.beginPath(); g.moveTo(x, 606); g.lineTo(x + 46, 606); g.lineTo(x + 46, 598); g.lineTo(x + 66, 612); g.lineTo(x + 46, 626); g.lineTo(x + 46, 618); g.lineTo(x, 618); g.closePath(); g.fill();
      text(g, 'GATES A1\u2013A12', x + 112, 617, 9, 800, 'rgba(42,53,80,.38)', 'center'); }
  }
  function exBack(g, ext) {
    if (ext.l > 120) return;
    /* the charging pillar: a slim white totem with sockets and a cable */
    var px = 54; soft(g, px, F + 4, 30, 6, 0.2); shadowed(g, 10, 4, 0.16, function () { fillRR(g, px - 18, 300, 36, 170, 10, '#FFFFFF'); });
    fillRR(g, px - 18, 300, 36, 26, 10, '#3167CA'); text(g, '\u26A1', px, 318, 13, 800, '#FFD84A', 'center'); text(g, 'CHARGE', px, 342, 6.5, 800, '#3167CA', 'center');
    for (var i = 0; i < 4; i++) { fillRR(g, px - 10, 352 + i * 22, 20, 14, 4, '#EAF0FB'); fillE(g, px - 3, 359 + i * 22, 1.6, 1.6, '#2A3550'); fillE(g, px + 3, 359 + i * 22, 1.6, 1.6, '#2A3550'); }
  }
  function exLive(g, t, S) {
    var ext = S.ext, y0 = 548, y1 = 584, off = (t * 26) % 40; g.fillStyle = 'rgba(255,255,255,.22)';
    for (var x = Math.floor(ext.l / 40) * 40 - 40 + off; x < ext.r; x += 40) { g.beginPath(); g.moveTo(x, y0 + 8); g.lineTo(x + 10, (y0 + y1) / 2); g.lineTo(x, y1 - 8); g.lineTo(x + 5, y1 - 8); g.lineTo(x + 15, (y0 + y1) / 2); g.lineTo(x + 5, y0 + 8); g.closePath(); g.fill(); }
    if (ext.l > 120) return;
    var P = ADE, d = t - ADT.tap, tapped = d >= 0 && d < 2.4;
    P.mood = tapped ? 'happy' : 'calm'; P.talk = false;
    P.look = tapped ? 0.2 : (t % 8) < 2.5 ? 0.9 : -0.3;
    P.hands = tapped ? [[-60, -200], [70, -470]] : [[-60, -200], [64, -228 + Math.sin(t * 1.3) * 4]];
    P.tilt = tapped ? 0.06 * Math.sin(d * 6) : 0;
    /* the charging cable from her phone to the pillar */
    g.strokeStyle = '#2A3550'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(P.x + 64 * P.s, P.y - 220 * P.s); g.quadraticCurveTo(P.x + 50, P.y - 40, 44, 370); g.stroke();
    K.person(g, P, t);
    var hx = P.x + P.hands[1][0] * P.s, hy = P.y + P.hands[1][1] * P.s; fillRR(g, hx - 6, hy - 14, 12, 20, 3, '#2A3550'); fillRR(g, hx - 4.5, hy - 12, 9, 15, 2, (t % 3) < 1.5 ? '#9FC4FF' : '#C9F0E2');
    if (tapped && d > 0.6 && d < 0.9) { g.globalAlpha = 1 - (d - 0.6) / 0.3; fillE(g, hx, hy - 4, 40, 40, 'rgba(255,255,240,.9)'); g.globalAlpha = 1; }
  }
  function exFore(g, t, S) {
    var ext = S.ext; if (ext.r < 980) return;
    /* nested trolleys by the column, right of the caption */
    var x = 944, y = 640; soft(g, x + 10, y + 4, 60, 7, 0.22);
    for (var i = 0; i < 3; i++) { var ox = x - 24 + i * 12; g.strokeStyle = '#8A94A8'; g.lineWidth = 3.5; g.beginPath(); g.moveTo(ox, y - 62); g.lineTo(ox + 8, y - 10); g.lineTo(ox + 56, y - 10); g.stroke();
      fillRR(g, ox + 6, y - 46, 46, 30, 3, i === 2 ? '#3167CA' : '#5B7FC4'); fillE(g, ox + 12, y - 4, 5, 5, '#2A3550'); fillE(g, ox + 50, y - 4, 5, 5, '#2A3550'); }
    text(g, 'TROLLEYS', x + 16, y - 52, 6.5, 800, '#FFFFFF', 'center');
  }
  function exHit(x, y, S, t) { if (Math.abs(x - ADE.x) < 55 && y > ADE.y - 260 && y < ADE.y + 10) { ADT.tap = t; return true; } return false; }
  (function (W) { var pb = W.paintBack, pl = W.paintLive, pf = W.paintForeLive, h0 = W.hit;
    W.paintBack = function (g, ext) { exFloor(g, ext); pb(g, ext); exBack(g, ext); };
    W.paintLive = function (g, t, now, S) { pl(g, t, now, S); exLive(g, t, S); };
    W.paintForeLive = function (g, t, S) { exFore(g, t, S); pf(g, t, S); };
    W.hit = function (x, y, S, t, onBtn) { if (!onBtn && exHit(x, y, S, t)) return null; return h0 ? h0(x, y, S, t, onBtn) : null; };
  })(window.IXW.worlds.travel);
})(window.IXW && window.IXW.kit);
