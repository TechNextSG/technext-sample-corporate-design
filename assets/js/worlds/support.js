/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: support (/odoo/support) — step 4 of 4: the same team, after go-live, drawn as the ODOO CONTROL TOWER, a bright
   daytime air-traffic control cab that keeps a live business flying. Through the slanted windows: the airfield, the runway with
   the GO-LIVE jet waiting at the threshold, a jet cruising overhead, the upgrade hangar (Odoo 20), the terminal, a windsock.
   In the cab: the flight-strip board moves real kinds of request across Triage, Fix and Done (a bank feed sync fix, the
   month-end close, a version upgrade, a PO approval change); the upgrade display runs Odoo 19 to Odoo 20 on a copy first; the
   one-frequency display shows the single tracked channel with its response target from the plan; the month-end calendar
   hangs by the window. The crew (headsets, chairs, legs and feet for those seated): the consultant talks on the frequency and
   hands strips across, the developer types and spins his chair when a fix deploys, the support lead paces with binoculars and
   marshals the jet out with orange wands, the month-end consultant ticks her checklist and tears off the month. Everyone wears
   a TechNext ID. Tap anyone, a strip kind, the displays or the jet. */
(function (K, CR, CO) {
  'use strict';
  if (!K || !CR || !CO) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed;
  var F = 470, CEIL = -150, SILL = 262, HZ = 168, OR = '#F08A24', ORD = '#C96A12', ORL = '#FFF4E5', NAVY = '#1B2350', PUR = '#714B67', RED = '#E2453C', GO = '#2BC48A', BLUE = '#3167CA';
  var BD = { x: 300, y: -100, w: 410, h: 250 }, T = { up: { x: 730, y: -96, w: 190, h: 100 }, ch: { x: 730, y: 24, w: 190, h: 100 }, cal: { x: 160, y: -96, w: 124, h: 120 },
    desk: { x: 400, y: 392, w: 370 }, rwy: { y0: 190, y1: 232, th: 380 } };
  var TK = [{ key: 'fix', id: 'T-1041', name: 'Bank feed sync', kind: 'Fix', col: RED }, { key: 'monthend', id: 'T-1042', name: 'Month-end close', kind: 'Month-end', col: BLUE },
    { key: 'upgrade', id: 'T-1043', name: 'Version upgrade', kind: 'Upgrade', col: PUR }, { key: 'change', id: 'T-1044', name: 'PO approval step', kind: 'Change', col: '#14A38B' }];

  /* ---------------- helpers ---------------- */
  function setU(g, sx, sy, k) { g.translate(sx, sy); g.scale(k, k); }
  function extOf(W, H, k, sx, sy) { return { l: -(sx + 24) / k, r: (W - sx) / k, t: -(sy + 24) / k, b: (H - sy) / k }; }
  function ease(u) { return u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2; }
  function handAt(P, i) { var h = P.hands[i], s = P.s, kx = P.sx == null ? 1 : P.sx, drop = P.sit ? (P.sitDrop != null ? P.sitDrop : 46) : 0; return [P.x + h[0] * s * kx, P.y + (h[1] + drop - (P.hop || 0)) * s]; }
  var GT = null; /* the glance strip's top in set units (measured on resize): the near console sits fully above it */
  function measureGT() { var set = document.querySelector('.ixw--support [data-ixw-set]'), st = document.querySelector('.ixw--support .ixw-credits');
    if (!set || !st) return null; var r = set.getBoundingClientRect(), c = st.getBoundingClientRect(), k = r.width / 1000; if (!k || c.top <= r.top) return null; return (c.top - r.top) / k; }
  function fore(e) { var top = clamp(Math.min(GT != null ? GT - 118 : 999, e.b - 96), 618, 700); return { top: top, b: Math.max(e.b, top + 80) }; }
  /* a jet seen side on, nose to the right: navy fin with the TechNext paper plane, white body, an orange cheat line */
  function jet(g, x, y, s, a, gear, label) {
    g.save(); g.translate(x, y); g.rotate(a || 0); g.scale(s, s);
    g.fillStyle = NAVY; g.beginPath(); g.moveTo(-46, -6); g.lineTo(-62, -34); g.lineTo(-49, -34); g.lineTo(-28, -7); g.closePath(); g.fill();
    CO.plane(g, -50, -22, 0.5, 0.1, '#FFFFFF');
    g.fillStyle = '#C9D2DE'; g.beginPath(); g.moveTo(-52, -2); g.lineTo(-66, -4); g.lineTo(-60, 2); g.closePath(); g.fill();
    fillRR(g, -62, -9, 112, 18, 9, '#FFFFFF'); g.fillStyle = '#FFFFFF'; g.beginPath(); g.moveTo(40, -9); g.quadraticCurveTo(64, -7, 66, 2); g.quadraticCurveTo(62, 9, 40, 9); g.closePath(); g.fill();
    g.fillStyle = OR; g.fillRect(-58, 2, 102, 3); g.fillStyle = 'rgba(27,35,80,.06)'; g.fillRect(-58, 5, 100, 4);
    for (var w = 0; w < 9; w++) fillE(g, -40 + w * 9, -3, 1.8, 2.2, '#5B6B8C'); fillRR(g, 50, -5, 9, 4, 2, '#22324F');
    if (label) text(g, label, -14, -12, 6, 800, NAVY, 'center');
    g.fillStyle = '#DCE3EC'; g.beginPath(); g.moveTo(-4, 3); g.lineTo(-30, 20); g.lineTo(-18, 20); g.lineTo(12, 3); g.closePath(); g.fill();
    fillRR(g, -12, 8, 20, 8, 4, '#B9C4D2'); fillE(g, 8, 12, 2, 3.5, '#5C6B7A');
    if (gear) { g.fillStyle = '#5C6B7A'; g.fillRect(-21, 9, 2, 8); g.fillRect(33, 9, 2, 8); fillE(g, -20, 18, 3.5, 3.5, '#22324F'); fillE(g, 34, 18, 3.5, 3.5, '#22324F'); }
    g.restore();
  }

  /* ---------------- static layers ---------------- */
  function paintBg(g, W, H, k, sx, sy) { /* the airfield outside the tower */
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy), x;
    CO.sky(g, e, e.t, SILL + 20, [[0, '#7FC6F4'], [0.62, '#C4E6FB'], [1, '#EEF8FF']]);
    var sg = g.createRadialGradient(140, -80, 10, 140, -80, 280); sg.addColorStop(0, 'rgba(255,246,205,.9)'); sg.addColorStop(1, 'rgba(255,246,205,0)'); g.fillStyle = sg; g.fillRect(-160, -380, 600, 600);
    CO.skySG(g, e.l, e.r, HZ - 14, HZ, { hazy: 'rgba(175,200,230,.5)', near: ['#C3D6EE', '#B6CCE8'], lit: 'rgba(255,255,255,.55)', icon: '#ABC2E2', water: 'rgba(150,195,225,.4)', mbs: -560, wheel: 1180, trees: false, park: '#9DB4DA' });
    /* the field: far grass, the taxiway, the runway, near grass */
    g.fillStyle = '#D3EAC4'; g.fillRect(e.l, HZ, e.r - e.l, SILL + 20 - HZ);
    g.fillStyle = '#C8CFD8'; g.fillRect(e.l, HZ + 6, e.r - e.l, 9); g.fillStyle = '#F2C230'; g.fillRect(e.l, HZ + 10, e.r - e.l, 1.5);
    var R = T.rwy; g.fillStyle = '#AEB6C2'; g.fillRect(e.l, R.y0, e.r - e.l, R.y1 - R.y0); g.fillStyle = '#FFFFFF'; g.fillRect(e.l, R.y0 + 2, e.r - e.l, 1.5); g.fillRect(e.l, R.y1 - 3.5, e.r - e.l, 1.5);
    for (x = R.th + 50; x < e.r; x += 46) g.fillRect(x, (R.y0 + R.y1) / 2 - 1, 24, 2.4);
    for (var pk = 0; pk < 6; pk++) g.fillRect(R.th - 90 + pk * 9, R.y0 + 6, 5, R.y1 - R.y0 - 12);
    text(g, '09', R.th - 34, (R.y0 + R.y1) / 2 + 4, 12, 800, '#FFFFFF', 'center');
    g.fillStyle = '#E3F0D8'; g.fillRect(e.l, R.y1, e.r - e.l, 3);
    for (x = Math.floor(e.l / 40) * 40; x < e.r; x += 40) { fillE(g, x, R.y0 - 1, 1.6, 1.6, '#FFFFFF'); fillE(g, x + 20, R.y1 + 1, 1.6, 1.6, '#F7D774'); }
    /* the terminal and a parked jet on the left; the upgrade hangar on the right */
    fillRR(g, -840, HZ - 40, 420, 40, 4, '#E6ECF4'); g.fillStyle = '#A9C9E8'; g.fillRect(-830, HZ - 32, 400, 16); g.fillStyle = '#FFFFFF'; for (x = -830; x < -430; x += 22) g.fillRect(x, HZ - 32, 2, 16);
    fillRR(g, -840, HZ - 48, 420, 10, 4, '#C9D3E2'); text(g, 'TERMINAL', -630, HZ - 4, 8, 800, '#8A96A8', 'center');
    g.fillStyle = '#C9D2DE'; g.fillRect(-520, HZ - 22, 70, 8); jet(g, -410, HZ - 4, 0.75, 0, true);
    var hx = 960; g.fillStyle = '#DCE3EC'; g.beginPath(); g.moveTo(hx, HZ); g.lineTo(hx, HZ - 70); g.quadraticCurveTo(hx + 150, HZ - 128, hx + 300, HZ - 70); g.lineTo(hx + 300, HZ); g.closePath(); g.fill();
    g.fillStyle = '#C3CDDA'; for (x = hx + 10; x < hx + 300; x += 24) g.fillRect(x, HZ - 76 - Math.sin((x - hx) / 300 * Math.PI) * 40, 2, 70);
    fillRR(g, hx + 60, HZ - 58, 180, 58, 3, '#5D6B85'); jet(g, hx + 160, HZ - 12, 0.85, 0, true);
    fillRR(g, hx + 68, HZ - 104, 140, 26, 6, PUR); text(g, 'UPGRADE HANGAR · ODOO 20', hx + 138, HZ - 87, 7.6, 800, '#FFFFFF', 'center');
    g.fillStyle = '#9AA6BC'; g.fillRect(hx + 330, HZ - 120, 5, 120); fillRR(g, hx + 318, HZ - 128, 30, 12, 3, '#C9D2DE');
    g.restore();
  }
  function paintFrame(g, W, H, k, sx, sy) { /* the tower cab: slanted mullions, roller shades, the sill console, the cab wall and floor */
    GT = measureGT(); g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy), x;
    g.fillStyle = 'rgba(255,255,255,.12)'; for (x = Math.floor(e.l / 210) * 210; x < e.r; x += 210) { g.beginPath(); g.moveTo(x + 30, SILL); g.lineTo(x + 90, CEIL); g.lineTo(x + 116, CEIL); g.lineTo(x + 56, SILL); g.closePath(); g.fill(); }
    var cg = g.createLinearGradient(0, e.t, 0, CEIL); cg.addColorStop(0, '#E9EDF4'); cg.addColorStop(1, '#F7F9FC'); g.fillStyle = cg; g.fillRect(e.l, e.t, e.r - e.l, CEIL - e.t);
    g.strokeStyle = 'rgba(30,40,80,.06)'; g.lineWidth = 2; g.beginPath(); for (x = Math.floor(e.l / 90) * 90; x < e.r; x += 90) { g.moveTo(x, e.t); g.lineTo(x, CEIL - 14); } g.stroke();
    for (x = Math.floor(e.l / 180) * 180 + 60; x < e.r; x += 180) { fillE(g, x, CEIL - 22, 16, 4, '#FFFFFF'); fillE(g, x, CEIL - 22, 10, 2.4, '#FFF6D8'); }
    g.fillStyle = '#FFFFFF'; g.fillRect(e.l, CEIL - 10, e.r - e.l, 22); g.fillStyle = 'rgba(240,138,36,.13)'; g.fillRect(e.l, CEIL + 12, e.r - e.l, 22); g.fillStyle = 'rgba(240,138,36,.28)'; g.fillRect(e.l, CEIL + 32, e.r - e.l, 2.5);
    for (x = Math.floor(e.l / 170) * 170; x < e.r; x += 170) { g.fillStyle = '#FFFFFF'; g.beginPath(); g.moveTo(x - 7, CEIL); g.lineTo(x + 7, CEIL); g.lineTo(x - 3, SILL); g.lineTo(x - 17, SILL); g.closePath(); g.fill(); g.fillStyle = 'rgba(30,40,80,.08)'; g.fillRect(x - 3, CEIL + 34, 3, SILL - CEIL - 34); }
    /* the sill console round the cab */
    fillRR(g, e.l, SILL - 4, e.r - e.l, 18, 0, '#FFFFFF'); g.fillStyle = NAVY; g.fillRect(e.l, SILL + 14, e.r - e.l, 6);
    g.fillStyle = '#EAEFF6'; g.fillRect(e.l, SILL + 20, e.r - e.l, F - SILL - 20);
    g.strokeStyle = 'rgba(27,35,80,.07)'; g.lineWidth = 2; g.beginPath(); for (x = Math.floor(e.l / 120) * 120; x < e.r; x += 120) { g.moveTo(x, SILL + 20); g.lineTo(x, F); } g.moveTo(e.l, 360); g.lineTo(e.r, 360); g.stroke();
    for (x = Math.floor(e.l / 120) * 120 + 18; x < e.r; x += 120) { fillRR(g, x, 296, 50, 10, 3, '#DCE3EE'); g.fillStyle = 'rgba(27,35,80,.12)'; for (var v = 0; v < 6; v++) g.fillRect(x + 6 + v * 7, 298, 3, 6); }
    g.fillStyle = 'rgba(27,35,80,.08)'; g.fillRect(e.l, F - 16, e.r - e.l, 16);
    CO.floor(g, e, F, '#E4E9F1', '#D0D7E2', 'rgba(40,60,100,.07)');
    /* the cab floor: an orange guide line along the windows, and a compass rose inlaid in front of the side console */
    g.fillStyle = 'rgba(240,138,36,.35)'; g.fillRect(e.l, F + 18, e.r - e.l, 3); g.fillStyle = 'rgba(27,35,80,.12)'; for (x = Math.floor(e.l / 60) * 60; x < e.r; x += 60) g.fillRect(x, F + 26, 30, 2.5);
    var rx = -250, ry = 586; g.save(); g.translate(rx, ry); g.scale(1, 0.24);
    g.fillStyle = 'rgba(255,255,255,.55)'; g.beginPath(); g.arc(0, 0, 170, 0, 7); g.fill(); g.strokeStyle = 'rgba(27,35,80,.18)'; g.lineWidth = 5; g.beginPath(); g.arc(0, 0, 170, 0, 7); g.stroke(); g.lineWidth = 3; g.beginPath(); g.arc(0, 0, 120, 0, 7); g.stroke();
    for (var cp = 0; cp < 8; cp++) { var ca = cp * Math.PI / 4, L = cp % 2 ? 90 : 150; g.fillStyle = cp % 2 ? 'rgba(27,35,80,.22)' : (cp === 6 ? 'rgba(240,138,36,.75)' : 'rgba(27,35,80,.35)'); g.beginPath(); g.moveTo(Math.cos(ca) * L, Math.sin(ca) * L); g.lineTo(Math.cos(ca + 0.32) * 26, Math.sin(ca + 0.32) * 26); g.lineTo(0, 0); g.lineTo(Math.cos(ca - 0.32) * 26, Math.sin(ca - 0.32) * 26); g.closePath(); g.fill(); }
    g.restore(); text(g, 'N', rx, ry - 42, 9, 800, ORD, 'center');
    g.restore();
  }
  function display(g, s, head, col) { /* a hung display: two rods to the ceiling, a navy bezel, a coloured title bar */
    g.fillStyle = '#B9C4D2'; g.fillRect(s.x + 22, CEIL + 10, 3, s.y - CEIL - 10); g.fillRect(s.x + s.w - 25, CEIL + 10, 3, s.y - CEIL - 10);
    shadowed(g, 14, 5, 0.2, function () { fillRR(g, s.x - 6, s.y - 6, s.w + 12, s.h + 12, 9, '#2A3142'); }); fillRR(g, s.x, s.y, s.w, s.h, 4, '#FFFFFF');
    fillRR(g, s.x, s.y, s.w, 17, 4, col); g.fillRect(s.x, s.y + 10, s.w, 7); text(g, head, s.x + 8, s.y + 12, 6.8, 800, '#FFFFFF');
  }
  function paintBack(g, ext) {
    CREW.forEach(function (w) { if (w.x0 < 0) return; if (w.x1b == null) w.x1b = w.x1; w.x1 = Math.min(w.x1b, ext.r - 150); });
    /* the flight-strip board */
    display(g, BD, 'FLIGHT STRIPS · EVERY TICKET TRACKED', NAVY); text(g, 'sample', BD.x + BD.w - 8, BD.y + 12, 6, 700, '#9FB0D8', 'right');
    ['Triage', 'Fix', 'Done'].forEach(function (c, i) { var cx = BD.x + 10 + i * 133; fillRR(g, cx, BD.y + 24, 125, BD.h - 30, 7, '#F5F2EA'); for (var sl = 0; sl < 5; sl++) fillRR(g, cx + 4, BD.y + 56 + sl * 44, 117, 3, 1.5, '#E4DDCD');
      fillE(g, cx + 12, BD.y + 37, 4, 4, ['#E9A23B', RED, GO][i]); text(g, c, cx + 20, BD.y + 40, 8.6, 800, ['#B7791F', RED, '#1E9E6A'][i]); });
    display(g, T.up, 'UPGRADE HANGAR · sample', PUR);
    display(g, T.ch, 'ONE FREQUENCY · TRACKED CHANNEL', NAVY);
    var c = T.cal; display(g, c, 'MONTH-END', OR);
    ['M', 'T', 'W', 'T', 'F'].forEach(function (d, i) { text(g, d, c.x + 18 + i * 22, c.y + 30, 6, 800, '#9AA6BC', 'center'); });
    /* the sill: a radio, a phone, a signal light gun, a plant */
    fillRR(g, 300, SILL - 18, 58, 16, 4, '#2A3142'); [0, 1, 2].forEach(function (i) { fillE(g, 312 + i * 14, SILL - 10, 4, 4, '#9AA6BC'); });
    fillRR(g, 610, SILL - 14, 34, 12, 4, '#DCE3EC'); fillRR(g, 612, SILL - 22, 30, 8, 4, NAVY);
    g.save(); g.translate(840, SILL - 14); g.rotate(-0.25); fillRR(g, -26, -9, 44, 18, 6, '#4A5468'); fillE(g, 22, 0, 9, 9, '#5C6B7A'); fillE(g, 22, 0, 6, 6, '#B8F5DE'); g.fillStyle = '#4A5468'; g.fillRect(-8, 8, 8, 12); g.restore();
    K.plant(g, { x: 110, y: SILL - 2 }, '#FFFFFF', '#E3E8EF');
    /* left: the tower's name, the team's three clocks */
    var nx = -560;
    g.fillStyle = '#B9C4D2'; g.fillRect(nx - 50, CEIL + 12, 3, 60); g.fillRect(nx + 48, CEIL + 12, 3, 60);
    shadowed(g, 12, 5, 0.2, function () { fillRR(g, nx - 76, -80, 152, 50, 25, NAVY); }); fillE(g, nx - 50, -55, 17, 17, OR);
    g.strokeStyle = '#FFFFFF'; g.lineWidth = 3; g.beginPath(); g.arc(nx - 50, -55, 9, 0, 7); g.stroke(); g.lineWidth = 4; for (var q = 0; q < 4; q++) { g.beginPath(); g.arc(nx - 50, -55, 9, q * Math.PI / 2 + 0.2, q * Math.PI / 2 + 0.6); g.stroke(); }
    text(g, 'ODOO', nx - 26, -58, 13, 800, '#FFFFFF'); text(g, 'CONTROL TOWER', nx - 26, -43, 8.4, 800, '#FFB566');
    [['SINGAPORE', 'HQ'], ['TAGUIG CITY', 'dev & consulting'], ['HO CHI MINH', 'AI engineering']].forEach(function (cc, i) { var cx = nx - 52 + i * 52; text(g, cc[0], cx, 64, 5.4, 800, NAVY, 'center'); text(g, cc[1], cx, 72, 4.8, 700, '#8A96A8', 'center'); K.clockFace(g, { x: cx, y: 32, r: 19 }, i === 2 ? '#14A38B' : OR); });
    /* the flight plan of a support plan, hung over the side console: four waypoints, a little jet flies the route */
    var fp = FP; g.fillStyle = '#B9C4D2'; g.fillRect(fp.x + 40, CEIL + 10, 3, fp.y - CEIL - 10); g.fillRect(fp.x + fp.w - 43, CEIL + 10, 3, fp.y - CEIL - 10);
    shadowed(g, 14, 5, 0.2, function () { fillRR(g, fp.x - 6, fp.y - 6, fp.w + 12, fp.h + 12, 12, '#2A3142'); }); fillRR(g, fp.x, fp.y, fp.w, fp.h, 8, '#F5F9FE');
    fillRR(g, fp.x, fp.y, fp.w, 20, 8, NAVY); g.fillRect(fp.x, fp.y + 12, fp.w, 8); text(g, 'FLIGHT PLAN · HOW A SUPPORT PLAN WORKS', fp.x + 10, fp.y + 14, 7, 800, '#FFFFFF');
    g.strokeStyle = 'rgba(49,103,202,.08)'; g.lineWidth = 1; g.beginPath(); for (var gx2 = fp.x + 20; gx2 < fp.x + fp.w; gx2 += 20) { g.moveTo(gx2, fp.y + 20); g.lineTo(gx2, fp.y + fp.h); } for (var gy2 = fp.y + 40; gy2 < fp.y + fp.h; gy2 += 20) { g.moveTo(fp.x, gy2); g.lineTo(fp.x + fp.w, gy2); } g.stroke();
    g.fillStyle = 'rgba(160,210,170,.35)'; g.beginPath(); g.ellipse(fp.x + 90, fp.y + 110, 70, 26, -0.2, 0, 7); g.fill(); g.beginPath(); g.ellipse(fp.x + 270, fp.y + 64, 60, 20, 0.3, 0, 7); g.fill();
    g.setLineDash([6, 5]); g.strokeStyle = OR; g.lineWidth = 2.4; g.beginPath(); FPW.forEach(function (w, i) { if (i) g.lineTo(fp.x + w[0], fp.y + w[1]); else g.moveTo(fp.x + w[0], fp.y + w[1]); }); g.stroke(); g.setLineDash([]);
    FPW.forEach(function (w, i) { var x = fp.x + w[0], y = fp.y + w[1]; g.save(); g.translate(x, y); g.rotate(Math.PI / 4); fillRR(g, -8, -8, 16, 16, 3, i === 3 ? GO : '#FFFFFF'); g.strokeStyle = NAVY; g.lineWidth = 2; rr(g, -8, -8, 16, 16, 3); g.stroke(); g.restore();
      text(g, String(i + 1), x, y + 3.5, 8, 800, i === 3 ? '#FFFFFF' : NAVY, 'center'); text(g, w[2], x, y + (w[3] ? -16 : 26), 8, 800, NAVY, 'center'); });
    text(g, 'Same team · one channel · reviewed', fp.x + 10, fp.y + fp.h - 9, 6.6, 700, '#8A96A8');
    /* right: a weather board over the coffee counter */
    shadowed(g, 10, 4, 0.18, function () { fillRR(g, 1060, 196, 150, 50, 8, '#FFFFFF'); }); fillRR(g, 1060, 196, 150, 15, 8, '#3FA9E0'); g.fillRect(1060, 204, 150, 7); text(g, 'FIELD WEATHER', 1068, 207, 6.6, 800, '#FFFFFF');
    fillE(g, 1080, 228, 9, 9, '#FFC94A'); text(g, 'Clear · light wind', 1096, 232, 8, 800, NAVY);
  }
  var FP = { x: -446, y: -112, w: 360, h: 156 }, FPW = [[34, 112, 'Setup review', 0], [128, 62, 'Single channel', 1], [226, 108, 'Triage & fix', 0], [318, 58, 'Review & plan', 1]];
  var SC = { x: -430, y: 392, w: 300, mon: { x: -416, y: 318, w: 82, h: 58 } };
  function paintFront(g, ext) {
    /* the side console by the windows: open desk, the monitor BESIDE the ground controller, a strip printer, a lamp */
    CO.desk(g, SC.x, SC.y, SC.w, F, { open: true, legs: '#9AA6BC', top: '#DCE3EE' }); fillRR(g, SC.x - 6, SC.y, SC.w + 12, 5, 3, NAVY);
    var m = SC.mon; fillRR(g, m.x - 4, m.y - 4, m.w + 8, m.h + 8, 5, '#2A3142'); fillRR(g, m.x + m.w / 2 - 5, m.y + m.h + 4, 10, SC.y - m.y - m.h - 4, 2, '#5C6B7A'); fillRR(g, m.x + m.w / 2 - 17, SC.y - 3, 34, 4, 2, '#5C6B7A');
    fillRR(g, -300, SC.y - 6, 54, 6, 2, '#C9D2DE');
    fillRR(g, -192, SC.y - 26, 50, 26, 5, '#F4F7FC'); fillRR(g, -192, SC.y - 26, 50, 7, 4, OR); fillRR(g, -186, SC.y - 30, 38, 5, 2, '#2A3142'); fillE(g, -150, SC.y - 12, 2.4, 2.4, GO);
    g.strokeStyle = '#4A5468'; g.lineWidth = 3; g.beginPath(); g.moveTo(-122, SC.y); g.lineTo(-114, SC.y - 46); g.lineTo(-96, SC.y - 58); g.stroke(); fillRR(g, -104, SC.y - 66, 22, 10, 5, OR);
    fillRR(g, SC.x + 30, SC.y + 14, 120, 18, 4, NAVY); text(g, 'Ground control', SC.x + 90, SC.y + 26, 7.4, 800, '#FFFFFF', 'center');
    /* the main console: two monitors, each BESIDE its controller, keyboards, desk mics, name plates */
    var d = T.desk; CO.desk(g, d.x, d.y, d.w, F, { open: true, legs: '#9AA6BC', top: '#DCE3EE' }); fillRR(g, d.x - 6, d.y, d.w + 12, 5, 3, NAVY);
    [[520, 'Your consultant'], [690, 'Your developer']].forEach(function (p) { var mx = p[0] - 100 + 30;
      fillRR(g, mx - 4, d.y - 74, 78, 58, 5, '#2A3142'); fillRR(g, mx + 30, d.y - 16, 10, 16, 2, '#5C6B7A'); fillRR(g, mx + 18, d.y - 3, 34, 4, 2, '#5C6B7A');
      fillRR(g, p[0] - 30, d.y - 6, 54, 6, 2, '#C9D2DE');
      g.strokeStyle = '#4A5468'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(p[0] + 46, d.y); g.quadraticCurveTo(p[0] + 50, d.y - 30, p[0] + 36, d.y - 40); g.stroke(); fillE(g, p[0] + 34, d.y - 41, 4, 3, '#2A3142');
      fillRR(g, p[0] - 55, d.y + 14, 110, 18, 4, NAVY); text(g, p[1], p[0], d.y + 26, 7.4, 800, '#FFFFFF', 'center'); });
    fillRR(g, 742, d.y - 18, 20, 18, 3, '#FFFFFF'); fillRR(g, 744, d.y - 22, 16, 5, 2, OR);
    /* right: the coffee counter, a water cooler, a plant */
    var cx = 1050; soft(g, cx + 90, F + 3, 120, 8, 0.24); fillRR(g, cx, 402, 180, F - 402, 6, '#F4F7FC'); fillRR(g, cx - 6, 394, 192, 10, 4, '#C9A27A'); g.fillStyle = 'rgba(30,60,110,.06)'; g.fillRect(cx + 150, 404, 30, F - 404);
    fillRR(g, cx + 20, 344, 46, 50, 6, '#2A3142'); fillRR(g, cx + 26, 352, 34, 12, 3, '#3A4458'); fillE(g, cx + 43, 384, 6, 4, '#5C6B7A');
    [[cx + 90, OR], [cx + 112, BLUE], [cx + 134, '#FFFFFF']].forEach(function (m) { fillRR(g, m[0], 380, 14, 14, 3, m[1]); });
    var wc = 1270; fillRR(g, wc, 360, 44, F - 360, 6, '#DCE3EC'); fillRR(g, wc + 4, 300, 36, 64, 14, 'rgba(143,201,240,.75)'); fillRR(g, wc + 16, 386, 12, 8, 2, '#3FA9E0');
    K.plant(g, { x: 1380, y: F }, '#FFFFFF', '#E3E8EF');
    /* left: a lounge chair and a plant by the tower sign */
    fillRR(g, -660, 418, 110, 34, 12, OR); fillRR(g, -660, 380, 24, 60, 10, ORD); fillRR(g, -574, 380, 24, 60, 10, ORD); fillRR(g, -648, 370, 86, 50, 14, '#F7A75A');
    g.fillStyle = '#7A869C'; g.fillRect(-650, 452, 5, 18); g.fillRect(-565, 452, 5, 18);
    K.plant(g, { x: -490, y: F }, '#FFFFFF', '#E3E8EF');
  }
  function paintFore(g, ext) { /* the near console: its lip, the front panel with a strip bay, gauges and a radar scope */
    var f = fore(ext), y = f.top, x;
    fillRR(g, ext.l, y + 10, ext.r - ext.l, f.b - y, 0, '#EEF1F7'); g.fillStyle = 'rgba(27,35,80,.08)'; for (x = Math.floor(ext.l / 160) * 160; x < ext.r; x += 160) g.fillRect(x, y + 16, 2, f.b - y);
    fillRR(g, ext.l, y, ext.r - ext.l, 14, 0, NAVY); g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(ext.l, y + 2, ext.r - ext.l, 2);
    /* the strip bay: holders with paper strips */
    fillRR(g, 180, y + 22, 250, 50, 6, '#DCE3EE');
    [[RED, 'T-1041 · FIX'], [BLUE, 'T-1042 · MONTH-END'], [PUR, 'T-1043 · UPGRADE'], ['#14A38B', 'T-1044 · CHANGE']].forEach(function (s, i) { var sx = 188 + i * 60; fillRR(g, sx, y + 28, 54, 38, 3, '#FFF9EC'); fillRR(g, sx, y + 28, 8, 38, 2, s[0]);
      g.save(); g.translate(sx + 34, y + 47); g.rotate(-Math.PI / 2); text(g, s[1].split(' · ')[1], 0, 2, 5.4, 800, NAVY, 'center'); g.restore(); text(g, s[1].split(' · ')[0], sx + 13, y + 62, 5, 800, '#8A96A8'); });
    /* the keyboard, a mic, a mug, a model of the GO-LIVE jet */
    fillRR(g, 470, y - 8, 120, 10, 3, '#C9D2DE'); g.fillStyle = '#AAB4C4'; for (x = 476; x < 584; x += 9) g.fillRect(x, y - 6, 6, 2.5);
    g.strokeStyle = '#4A5468'; g.lineWidth = 3; g.beginPath(); g.moveTo(640, y); g.quadraticCurveTo(646, y - 40, 628, y - 52); g.stroke(); fillE(g, 626, y - 53, 6, 4, '#2A3142');
    fillRR(g, 690, y - 18, 18, 18, 4, '#FFFFFF'); fillRR(g, 690, y - 13, 18, 4, 2, OR);
    g.fillStyle = '#9AA6BC'; g.fillRect(-528, y - 20, 4, 20); jet(g, -526, y - 30, 0.55, -0.12, false);
    /* gauges and the radar scope's bezel */
    [[480, 'OPEN'], [540, 'FIX'], [600, 'DONE']].forEach(function (gg, i) { fillRR(g, gg[0], y + 26, 50, 40, 6, '#FFFFFF'); text(g, gg[1], gg[0] + 25, y + 60, 6, 800, '#8A96A8', 'center'); });
    shadowed(g, 8, 3, 0.18, function () { fillE(g, 860, y + 48, 44, 44, NAVY); }); fillE(g, 860, y + 48, 38, 38, '#E7F2FB');
    g.strokeStyle = 'rgba(49,103,202,.3)'; g.lineWidth = 1.2; [12, 24, 36].forEach(function (r) { g.beginPath(); g.arc(860, y + 48, r, 0, 7); g.stroke(); }); g.beginPath(); g.moveTo(822, y + 48); g.lineTo(898, y + 48); g.moveTo(860, y + 10); g.lineTo(860, y + 86); g.stroke();
    text(g, 'TICKET RADAR · sample', 860, y + 102, 6, 800, '#8A96A8', 'center');
    fillRR(g, 940, y + 26, 120, 40, 6, '#22324F'); text(g, 'FREQ · ONE CHANNEL', 948, y + 38, 5.6, 800, '#9FB6D8');
    fillRR(g, -900, y + 22, 300, 50, 6, '#DCE3EE'); text(g, 'GO-LIVE CHECKLIST', -888, y + 38, 7, 800, NAVY);
    ['Setup reviewed', 'Channel open', 'Targets agreed'].forEach(function (c, i) { var cx = -888 + i * 96; fillRR(g, cx, y + 48, 12, 12, 3, GO); text(g, c, cx + 16, y + 57, 6.2, 700, '#3D4560'); });
  }

  /* ---------------- the cast ---------------- */
  var W = CR.who;
  var AG1 = W({ x: 520, y: 470, s: 0.5, ph: 0.6, skin: 0, hair: 0, style: 'bob', outfit: 'cardigan', top: OR, top2: '#FFFFFF', headset: '#1B2350', sit: true, chairCol: '#2A3550', hands: [[-60, -206], [60, -206]], look: -0.5 });
  var AG2 = W({ x: 690, y: 470, s: 0.5, ph: 1.7, skin: 2, hair: 1, style: 'short', outfit: 'polo', top: BLUE, glasses: true, headset: '#1B2350', sit: true, chairCol: '#2A3550', hands: [[-60, -206], [60, -206]], look: -0.5 });
  var LEAD = W({ x: 945, y: 470, s: 0.54, ph: 2.4, skin: 1, hair: 0, style: 'short', outfit: 'shirt', top: NAVY, hold: 'tablet', hands: [[-70, -210], [70, -170]], look: -0.6 });
  var ME = W({ x: 225, y: 470, s: 0.53, ph: 3.1, skin: 3, hair: 1, style: 'long', outfit: 'polo', top: PUR, hold: 'clipboard', hands: [[-66, -200], [20, -206]], look: 0.3 });
  var CREW = [
    { x0: 1000, x1: 1360, y: 494, spd: 14, ph: 0.3, label: 'TechNext consultant', lines: ['Month-end tomorrow. I will be **online early**.', 'Same people who set it up. No call centre.'], acts: ['nod', 'id', 'wave'],
      P: W({ s: 0.5, skin: 3, hair: 1, style: 'bun', outfit: 'cardigan', top: '#14A38B', hold: 'tray' }) },
    { x0: -900, x1: 110, y: 612, spd: 18, ph: 0.6, label: 'TechNext developer', lines: ['Upgrade tested on a **copy** first. Then go.', 'Small changes, like a new **approval step**, in days.'], acts: ['cheer', 'id', 'wave'],
      P: W({ s: 0.57, skin: 2, hair: 0, style: 'short', outfit: 'shirt', top: PUR, hold: 'tablet' }) }
  ];
  /* by the windows on the left: the ground controller at the side console, a client dropping by with a coffee */
  var GC = W({ x: -250, y: 470, s: 0.5, ph: 4.4, skin: 1, hair: 0, style: 'short', outfit: 'polo', top: '#14A38B', headset: '#1B2350', sit: true, chairCol: '#2A3550', hands: [[-66, -206], [50, -206]], look: -0.4 });
  var VS = W({ x: 30, y: 590, s: 0.56, ph: 5.2, skin: 0, hair: 1, style: 'bun', outfit: 'shirt', top: '#E0456B', low: '#3A4458', id: '#9AA6BC', hands: [[-60, -230], [70, -200]], look: -0.4 });

  /* ---------------- live state ---------------- */
  var TO = { t: -16 }, STRIP = { t: -99 }, DEP = { t: -99 }, CALP = { t: -99 }, PROP = { binos: false, wands: false, strip: false, pen: false };
  function jetPos(t) { /* the GO-LIVE jet: waits at the threshold, rolls, rotates, climbs out to the right, then the next one taxis in */
    var R = T.rwy, u = t - TO.t, gy = R.y0 + 6;
    if (u < 0 || u > 13) return { x: R.th, y: gy, a: 0, gear: true, roll: false };
    if (u < 1.2) return { x: R.th, y: gy, a: 0, gear: true, roll: true };
    if (u < 4.6) { var v = (u - 1.2) / 3.4; return { x: R.th + 330 * v * v, y: gy, a: 0, gear: true, roll: true }; }
    if (u < 9) { var w = (u - 4.6) / 4.4; return { x: R.th + 330 + 700 * w + 200 * w * w, y: gy - 380 * w * w - 40 * w, a: -0.08 - 0.22 * Math.min(1, w * 3), gear: w < 0.25, roll: true }; }
    if (u < 10.5) return null;
    var z = (u - 10.5) / 2.5; return { x: lerp(R.th - 260, R.th, ease(z)), y: gy, a: 0, gear: true, roll: false };
  }
  function paintWindow(g, t, par, S) {
    var e = S.ext, w = e.r - e.l + 500, c;
    for (c = 0; c < 5; c++) { var x = e.l - 250 + ((hash(c + 7) * w + t * (4 + c * 1.4)) % w) - par * (2 + c); K.cloud(g, x, -120 + (c % 3) * 60 + hash(c) * 20, 0.3 + (c % 2) * 0.1); }
    /* a jet cruising high over the field, its contrail behind */
    var cx = e.l - 100 + ((t * 38) % (e.r - e.l + 260)); g.fillStyle = 'rgba(255,255,255,.7)'; for (var q = 0; q < 4; q++) { g.globalAlpha = 0.7 - q * 0.16; g.fillRect(cx - 40 - q * 60, -129, 60, 2.6); } g.globalAlpha = 1; jet(g, cx, -128, 0.3, 0, false);
    /* a small jet on the taxiway, the windsock, the hangar beacon */
    var tx = e.r + 60 - ((t * 14) % (e.r - e.l + 160)); g.save(); g.translate(tx, HZ + 6); g.scale(-1, 1); jet(g, 0, 0, 0.34, 0, true); g.restore();
    var ws = 932, wsy = HZ + 2; g.fillStyle = '#9AA6BC'; g.fillRect(ws, wsy - 34, 2, 34); g.save(); g.translate(ws + 2, wsy - 32); g.rotate(Math.sin(t * 1.3) * 0.12 + 0.1);
    [OR, '#FFFFFF', OR].forEach(function (cc, i) { g.fillStyle = cc; g.beginPath(); g.moveTo(i * 8, -4 + i * 0.6); g.lineTo(i * 8 + 8, -3.4 + i * 0.6); g.lineTo(i * 8 + 8, 3.4 - i * 0.6); g.lineTo(i * 8, 4 - i * 0.6); g.closePath(); g.fill(); }); g.restore();
    if ((t % 1.4) < 0.4) fillE(g, 1293, HZ - 130, 4, 4, '#FFE27A');
    /* the GO-LIVE jet */
    var j = jetPos(t); if (j) { if (j.roll && j.a === 0 && (t % 0.2) < 0.1) fillE(g, j.x - 64, j.y + 5, 10, 3.5, 'rgba(255,255,255,.6)'); jet(g, j.x, j.y, 0.78, j.a, j.gear, 'GO-LIVE'); }
  }
  function paintLive(g, t, now, S) {
    /* strips move Triage → Fix → Done; the stop's strip runs faster and glows */
    TK.forEach(function (k, i) { var on = S.hot === k.key, cyc = on ? ((t - (S.kT || 0)) * 0.8) % 3.4 : ((t * 0.18 + i * 0.85) % 3.4), col = Math.min(2, Math.floor(cyc)), f = clamp((cyc - col) * 3 - 1.4, 0, 1);
      var x0 = BD.x + 16 + col * 133, x1 = BD.x + 16 + Math.min(2, col + 1) * 133, x = col < 2 ? lerp(x0, x1, ease(f)) : x0, y = BD.y + 62 + i * 44;
      fillRR(g, x + 2, y + 3, 113, 38, 4, 'rgba(60,40,10,.10)'); fillRR(g, x, y, 113, 38, 4, '#FFF9EC'); fillRR(g, x, y, 13, 38, 3, k.col);
      g.save(); g.translate(x + 7, y + 19); g.rotate(-Math.PI / 2); text(g, k.id, 0, 2.4, 5.4, 800, '#FFFFFF', 'center'); g.restore();
      text(g, k.name, x + 19, y + 15, 8, 800, '#1B1F3B'); fillRR(g, x + 19, y + 21, 52, 11, 5.5, k.col); text(g, k.kind, x + 45, y + 29, 6.2, 800, '#FFFFFF', 'center');
      g.strokeStyle = '#E4DDCD'; g.lineWidth = 1; g.beginPath(); g.moveTo(x + 78, y + 4); g.lineTo(x + 78, y + 34); g.stroke();
      if (col === 2) { fillE(g, x + 97, y + 19, 7.5, 7.5, GO); g.strokeStyle = '#FFFFFF'; g.lineWidth = 1.8; g.beginPath(); g.moveTo(x + 93.5, y + 19); g.lineTo(x + 96, y + 21.5); g.lineTo(x + 100.5, y + 16.5); g.stroke(); }
      else text(g, col ? 'fixing' : 'new', x + 97, y + 22, 6, 800, col ? RED : '#B7791F', 'center');
      if (on) { g.strokeStyle = k.col; g.lineWidth = 2.5; rr(g, x - 3, y - 3, 119, 44, 7); g.stroke(); } });
    /* the upgrade display: Odoo 19 → Odoo 20, tested on a copy first; a little jet rides the progress bar */
    var u = T.up, up = S.hot === 'upgrade', pr = up ? clamp(((t - (S.kT || 0)) * 0.35) % 1.2, 0, 1) : (t * 0.06) % 1;
    text(g, 'Odoo 19', u.x + 16, u.y + 44, 13, 800, '#9AA6BC'); text(g, '→', u.x + 95, u.y + 44, 14, 800, PUR, 'center'); text(g, 'Odoo 20', u.x + 116, u.y + 44, 13, 800, PUR);
    fillRR(g, u.x + 14, u.y + 58, u.w - 28, 10, 5, '#EEF2F7'); fillRR(g, u.x + 14, u.y + 58, Math.max(10, (u.w - 28) * pr), 10, 5, PUR); jet(g, u.x + 14 + (u.w - 28) * pr, u.y + 60, 0.16, -0.1, false);
    text(g, pr < 0.5 ? 'Testing on a copy of your data' : (pr < 1 ? 'Checking your customisations' : 'Upgraded ✓'), u.x + 14, u.y + 86, 7.4, 700, pr >= 1 ? '#1E9E6A' : '#5C6B7A');
    /* the frequency display: one tracked channel, a response target from the plan */
    var c = T.ch, chn = S.hot === 'channel', n = 1040 + Math.floor(t / 4) % 9;
    for (var b = 0; b < 16; b++) { var hb = 2 + Math.abs(Math.sin(t * (chn ? 9 : 4) + b * 0.9)) * (chn ? 12 : 6); fillRR(g, c.x + 130 + b * 3.4, c.y + 34 - hb / 2, 2, hb, 1, OR); }
    text(g, 'Ticket #' + n + ' received', c.x + 12, c.y + 38, 9.4, 800, '#1B1F3B'); fillRR(g, c.x + 12, c.y + 50, 124, 16, 8, chn && (t % 1) < 0.5 ? '#FFE3C2' : ORL);
    CO.clock(g, c.x + 22, c.y + 58, 6, 8, OR); text(g, 'Response target: your plan', c.x + 32, c.y + 61, 6.6, 800, '#B7791F');
    text(g, 'Assigned to: your consultant', c.x + 12, c.y + 86, 7.4, 700, '#5C6B7A');
    /* the month-end calendar: the last days circled; tapped, this month's page tears off */
    var ca = T.cal, me = S.hot === 'monthend', pu = t - CALP.t;
    for (var d = 0; d < 20; d++) { var dx = ca.x + 10 + (d % 5) * 22, dy = ca.y + 36 + Math.floor(d / 5) * 19, end = d >= 17; fillRR(g, dx, dy, 17, 15, 3, end ? (me && (t % 1) < 0.6 ? OR : '#FFE3C2') : '#F4F6FA');
      if (end) text(g, String(27 + d - 17), dx + 8.5, dy + 10.5, 6, 800, me && (t % 1) < 0.6 ? '#FFFFFF' : ORD, 'center'); }
    if (pu < 0 || pu > 1.6) { g.strokeStyle = OR; g.lineWidth = 1.5; g.beginPath(); g.arc(ca.x + 10 + 4 * 22 + 8.5, ca.y + 36 + 3 * 19 + 7.5, 11, 0, 7); g.stroke(); }
    /* the team's clocks: Singapore and Taguig City (UTC+8), Ho Chi Minh City (UTC+7) */
    [8, 8, 7].forEach(function (off, i) { var d2 = new Date(Date.now() + off * 3600e3); K.clockHands(g, { x: -612 + i * 52, y: 32, r: 19 }, d2.getUTCHours(), d2.getUTCMinutes(), d2.getUTCSeconds()); });
    if (t - TO.t > 24) TO.t = t;
    /* the flight plan's jet flies the four waypoints, then loops */
    var fu = (t * 0.09) % 1, seg = Math.min(2, Math.floor(fu * 3)), sf = fu * 3 - seg, a0 = FPW[seg], a1 = FPW[seg + 1], jx = FP.x + lerp(a0[0], a1[0], ease(sf)), jy = FP.y + lerp(a0[1], a1[1], ease(sf));
    jet(g, jx, jy - 2, 0.2, Math.atan2(a1[1] - a0[1], a1[0] - a0[0]), false);
    /* LEDs along the cab wall */
    for (var l = 0; l < 14; l++) { var lx = -900 + l * 170; fillE(g, lx + 60, 316, 2.6, 2.6, ((t * 0.8 + hash(l) * 3) % 3) < 1.6 ? GO : '#BFE7D5'); fillE(g, lx + 70, 316, 2.6, 2.6, ((t * 1.1 + hash(l + 9) * 3) % 3) < 0.6 ? OR : '#F3D7B8'); }
  }
  function paintFrontLive(g, t, S) {
    CO.crew(CREW, g, t, S, true); sideLive(g, t, S);
    /* the two monitors at the console: tickets and code */
    [[520, 0], [690, 1]].forEach(function (p) { var mx = p[0] - 100 + 30, y = T.desk.y - 70; fillRR(g, mx, y, 70, 50, 2, '#FFFFFF');
      if (p[1] === 0) { fillRR(g, mx, y, 70, 9, 2, OR); for (var r = 0; r < 4; r++) { var tk = TK[(r + Math.floor(t / 2)) % 4]; fillRR(g, mx + 4, y + 13 + r * 9, 4, 6, 1, tk.col); fillRR(g, mx + 11, y + 14 + r * 9, 30 + hash(r + Math.floor(t / 2)) * 22, 3.4, 1.5, '#D5DCE6'); } }
      else CO.screen(g, mx, y, 70, 50, t, 'code', !!S.hot);
      var dpu = t - DEP.t; if (p[1] === 1 && dpu >= 0 && dpu < 1.8) { var sc = dpu < 0.15 ? dpu / 0.15 : 1; g.save(); g.translate(mx + 35, y - 14); g.scale(sc, sc); fillRR(g, -32, -9, 64, 18, 9, GO); text(g, 'DEPLOYED ✓', 0, 3.5, 7.4, 800, '#FFFFFF', 'center'); g.restore(); } });
    /* the strip the consultant hands across, the pen, the lead's binoculars and marshalling wands */
    var su = t - STRIP.t; if (su >= 0 && su < 0.9) { var a = handAt(AG1, 1), b = [AG2.x - 40, T.desk.y - 10], k = ease(su / 0.9), sx = lerp(a[0], b[0], k), sy = lerp(a[1], b[1], k) - Math.sin(k * Math.PI) * 50;
      g.save(); g.translate(sx, sy); g.rotate(k * Math.PI * 2); fillRR(g, -16, -5, 32, 10, 2, '#FFF9EC'); fillRR(g, -16, -5, 6, 10, 2, RED); g.restore(); }
    if (PROP.strip) { var hs = handAt(AG1, 1); g.save(); g.translate(hs[0], hs[1] - 6); g.rotate(-0.3); fillRR(g, -16, -5, 32, 10, 2, '#FFF9EC'); fillRR(g, -16, -5, 6, 10, 2, BLUE); g.restore(); }
    if (PROP.pen) { var hp = handAt(ME, 1); g.save(); g.translate(hp[0], hp[1]); g.rotate(0.6); fillRR(g, -1.6, -14, 3.2, 16, 1.5, NAVY); g.restore(); }
    if (PROP.binos) { var l = handAt(LEAD, 0), r = handAt(LEAD, 1), mx2 = (l[0] + r[0]) / 2, my = (l[1] + r[1]) / 2; fillRR(g, mx2 - 15, my - 9, 13, 16, 4, '#2A3142'); fillRR(g, mx2 + 2, my - 9, 13, 16, 4, '#2A3142'); fillE(g, mx2 - 8.5, my - 9, 5, 2.5, '#9FD3F5'); fillE(g, mx2 + 8.5, my - 9, 5, 2.5, '#9FD3F5'); }
    if (PROP.wands) [0, 1].forEach(function (i) { var h = handAt(LEAD, i), ang = i ? 0.35 : -0.35; g.save(); g.translate(h[0], h[1]); g.rotate(ang + Math.sin(t * 10 + i * 3) * 0.25); fillRR(g, -3, -34, 6, 30, 3, OR); fillRR(g, -3, -34, 6, 9, 3, '#FFE27A'); g.restore(); });
    /* this month's page, torn off the calendar, flutters down */
    var pu = t - CALP.t; if (pu >= 0 && pu < 1.8) { var ca = T.cal, px = ca.x + ca.w / 2 + pu * 70 + Math.sin(pu * 7) * 18, py = ca.y + 60 + pu * pu * 140; g.save(); g.translate(px, py); g.rotate(Math.sin(pu * 6) * 0.7 + pu); g.globalAlpha = pu > 1.4 ? (1.8 - pu) / 0.4 : 1;
      fillRR(g, -26, -20, 52, 40, 4, '#FFFFFF'); fillRR(g, -26, -20, 52, 10, 4, OR); text(g, 'CLOSED ✓', 0, 8, 7.4, 800, '#1E9E6A', 'center'); g.restore(); }
  }
  var PING = { t: -99 }, PRINT = { t: -99 }, MUG2 = { lift: 0 };
  function sideLive(g, t, S) {
    var m = SC.mon, pu = t - PRINT.t; fillRR(g, m.x, m.y, m.w, m.h, 2, '#FFFFFF'); fillRR(g, m.x, m.y, m.w, 10, 2, NAVY); text(g, 'GROUND · sample', m.x + 4, m.y + 7.4, 5, 800, '#FFFFFF');
    for (var r = 0; r < 4; r++) { var k2 = TK[(r + Math.floor(t / 2.5)) % 4], yy = m.y + 15 + r * 10; fillRR(g, m.x + 4, yy, 5, 7, 1, k2.col); fillRR(g, m.x + 12, yy + 1.5, 26 + hash(r + Math.floor(t / 2.5)) * 30, 3.4, 1.5, '#D5DCE6'); fillE(g, m.x + m.w - 8, yy + 3.5, 2.2, 2.2, r === 0 && (t % 1) < 0.5 ? OR : GO); }
    /* the strip printer: one prints now and then, more when the controller clears a request */
    var pc = pu >= 0 && pu < 1.6 ? pu / 1.6 : ((t + 2) % 7) / 1.4; if (pc < 1) { var ln = 6 + 22 * Math.min(1, pc * 1.4); fillRR(g, -184, SC.y - 30 - ln, 34, ln, 1.5, '#FFF9EC'); fillRR(g, -184, SC.y - 30 - ln, 5, ln, 1.5, pu < 1.6 ? GO : TK[Math.floor(t / 7) % 4].col); }
    /* the lamp at the end of the console glows when a request is cleared */
    if (pu >= 0 && pu < 1.6) { g.save(); g.globalAlpha = 0.5 * (1 - pu / 1.6); fillE(g, -93, SC.y - 50, 26, 18, '#FFE27A'); g.restore(); }
    /* the visitor's coffee and phone */
    var hm = handAt(VS, 1); fillRR(g, hm[0] - 6, hm[1] - 12, 12, 13, 3, '#FFFFFF'); fillRR(g, hm[0] - 6, hm[1] - 8, 12, 3, 1, OR); g.strokeStyle = '#FFFFFF'; g.lineWidth = 2.2; g.beginPath(); g.arc(hm[0] + 7, hm[1] - 6, 3.4, -1.4, 1.4); g.stroke();
    if (MUG2.lift < 0.5) { g.strokeStyle = 'rgba(160,170,190,.5)'; g.lineWidth = 1.3; for (var sw = 0; sw < 2; sw++) { var sy = hm[1] - 16 - ((t * 10 + sw * 7) % 14); g.beginPath(); g.moveTo(hm[0] - 2 + sw * 4, sy); g.quadraticCurveTo(hm[0] + 2 + sw * 4, sy - 4, hm[0] - 1 + sw * 4, sy - 8); g.stroke(); } }
    var hp = handAt(VS, 0); g.save(); g.translate(hp[0], hp[1] - 4); g.rotate(0.15); fillRR(g, -5, -9, 10, 17, 2.5, '#22324F'); fillRR(g, -3.8, -7.6, 7.6, 13, 1.5, t - PING.t < 2.2 ? '#FFE3C2' : '#9FD3F5'); g.restore();
    var qu = t - PING.t; if (qu >= 0 && qu < 2.4) { var by = hp[1] - 44 - Math.min(1, qu / 0.25) * 10; g.save(); g.globalAlpha = qu > 2 ? (2.4 - qu) / 0.4 : 1;
      shadowed(g, 6, 2, 0.16, function () { fillRR(g, hp[0] - 58, by - 12, 116, 22, 11, '#FFFFFF'); }); fillE(g, hp[0] - 46, by - 1, 7, 7, OR); text(g, '✓', hp[0] - 46, by + 2.5, 8, 800, '#FFFFFF', 'center');
      text(g, 'Request #1045 logged', hp[0] - 36, by + 2.6, 7.6, 800, NAVY); g.restore(); }
  }
  function paintForeLive(g, t, S) {
    var f = fore(S.ext), y = f.top;
    CO.crew(CREW, g, t, S, 'fore');
    /* the radar sweep and its blips (the tickets) */
    var a = t * 1.6, cx = 860, cy = y + 48; g.save(); g.beginPath(); g.arc(cx, cy, 37, 0, 7); g.clip(); g.fillStyle = 'rgba(43,196,138,.22)'; g.beginPath(); g.moveTo(cx, cy); g.arc(cx, cy, 37, a - 0.7, a); g.closePath(); g.fill(); g.restore();
    g.strokeStyle = 'rgba(30,158,106,.8)'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(a) * 37, cy + Math.sin(a) * 37); g.stroke();
    TK.forEach(function (k, i) { var ba = i * 1.7 + 0.6, br = 14 + (i * 7) % 20, bx = cx + Math.cos(ba) * br, by = cy + Math.sin(ba) * br, lit = ((a - ba) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2); fillE(g, bx, by, 3, 3, k.col); if (lit < 1) { g.globalAlpha = 1 - lit; fillE(g, bx, by, 6, 6, 'rgba(255,255,255,.7)'); g.globalAlpha = 1; } });
    /* the gauges' needles, the frequency LEDs */
    [[480, 0.9], [540, 1.4], [600, 0.6]].forEach(function (gg, i) { var na = -Math.PI + 0.4 + (0.5 + 0.4 * Math.sin(t * gg[1] + i)) * (Math.PI - 0.8), gx = gg[0] + 25, gy = y + 52;
      g.strokeStyle = '#DCE3EE'; g.lineWidth = 3; g.beginPath(); g.arc(gx, gy, 16, -Math.PI + 0.3, -0.3); g.stroke(); g.strokeStyle = [OR, RED, GO][i]; g.lineWidth = 2; g.beginPath(); g.moveTo(gx, gy); g.lineTo(gx + Math.cos(na) * 15, gy + Math.sin(na) * 15); g.stroke(); fillE(g, gx, gy, 2.5, 2.5, NAVY); });
    for (var b = 0; b < 12; b++) fillRR(g, 948 + b * 9, y + 46, 6, 12, 2, (b + Math.floor(t * 6)) % 12 < 3 ? OR : '#3A4A6B');
    CR.draw(g, t);
  }

  /* ---------------- each person's own loop and tap ---------------- */
  function tapped(st, t) { if (st.wave && st.wave !== st._seen) { st._seen = st.wave; st.c = t; return true; } return false; }
  function lookAt(P, S, st, t, def) { P.look = lerp(P.look, t < st.until ? clamp((S.nexi.x - P.x) / 160, -1, 1) : def, 0.08); }
  function reset(P, st, t) { P.sx = 1; P.tilt = 0; P.hop = 0; P.talk = t < st.until; P.mood = P.talk ? 'happy' : 'calm'; }
  function ag1(P, t, S) { /* talks on the frequency, a hand on her headset, writes strips; reads one up. Tap: hands a strip across to the developer, thumbs up */
    var st = S.cast.ag1; tapped(st, t); reset(P, st, t); PROP.strip = false; lookAt(P, S, st, t, -0.3); var u = (t - (st.c == null ? -99 : st.c)) / 2;
    if (u >= 0 && u < 1) { P.talk = true; P.mood = 'happy';
      if (u < 0.25) { PROP.strip = true; P.hands = [[-60, -206], [lerp(60, 30, u / 0.25), lerp(-206, -270, u / 0.25)]]; st.sent = false; }
      else if (u < 0.6) { var v = (u - 0.25) / 0.35; P.hands = [[-60, -206], [lerp(30, 150, ease(v)), lerp(-270, -236, v)]]; P.look = 0.8; if (!st.sent) { st.sent = true; STRIP.t = t; } }
      else { P.hands = [[-60, -206], [86, -340]]; P.look = 0.6; if (!st.thumb) { st.thumb = true; CR.burst('spark', P.x + 30, P.y - 210, t); } }
      return; }
    st.thumb = false;
    var c = (t + 1) % 9, busy = ['fix', 'monthend', 'team'].indexOf(S.hot) >= 0;
    if (c < 4.5 || busy) { P.talk = true; P.mood = 'happy'; P.hands = [[-100, -372], [36 + Math.sin(t * 9) * 7, -204 - Math.abs(Math.sin(t * 9)) * 4]]; P.tilt = Math.sin(t * 1.5) * 0.04; }
    else if (c < 7) { var k2 = Math.abs(Math.sin(t * 11)) * 6; P.hands = [[-56, -206 - k2], [56, -206 - (6 - k2)]]; }
    else { PROP.strip = true; P.hands = [[-60, -206], [56, -300]]; P.look = lerp(P.look, 0.25, 0.1); P.tilt = 0.05; }
  }
  function ag2(P, t, S) { /* types in bursts, stretches, swivels to watch the runway. Tap: a fix deploys, he spins his chair */
    var st = S.cast.ag2; if (tapped(st, t)) { DEP.t = t + 0.2; CR.burst('code', P.x - 120, T.desk.y - 120, t); } reset(P, st, t); lookAt(P, S, st, t, -0.5); var u = (t - (st.c == null ? -99 : st.c)) / 1.8;
    if (t - STRIP.t < 1.1 && t - STRIP.t > 0.5) { P.hands = [[-130, -236], [-40, -240]]; P.look = -0.8; P.mood = 'wow'; return; }
    if (u >= 0 && u < 1) { P.talk = true; P.mood = 'happy'; P.sx = Math.cos(ease(u) * Math.PI * 2); P.hop = Math.sin(u * Math.PI) * 10; P.hands = [[-90, -300], [90, -300]]; return; }
    var c = (t + 5) % 11, busy = ['change', 'team'].indexOf(S.hot) >= 0;
    if (c < 6 || busy) { var k2 = Math.abs(Math.sin(t * (busy ? 16 : 13))) * 7, burst = (t % 2) < 1.4 ? 1 : 0.2; P.hands = [[-58, -206 - k2 * burst], [58, -206 - (7 - k2) * burst]]; P.look = lerp(P.look, -0.6, 0.1); }
    else if (c < 8) { var r = clamp(Math.min((c - 6) / 0.4, (8 - c) / 0.4), 0, 1); P.hands = [[lerp(-58, -50, r), lerp(-206, -398, r)], [lerp(58, 50, r), lerp(-206, -398, r)]]; P.tilt = -0.06 * r; P.mood = r > 0.5 ? 'happy' : 'calm'; }
    else { var s2 = clamp(Math.min((c - 8) / 0.5, (11 - c) / 0.5), 0, 1); P.sx = lerp(1, 0.55, s2); P.look = lerp(P.look, 0.9, 0.1); P.hands = [[-60, -206], [60, -206]]; }
  }
  function lead(P, t, S) { /* paces with the tablet, scans the field with binoculars, points at the runway. Tap: marshals the GO-LIVE jet out with orange wands */
    var st = S.cast.lead; if (tapped(st, t)) st.go = false; reset(P, st, t); P.hold = 'tablet'; PROP.binos = false; PROP.wands = false; lookAt(P, S, st, t, -0.5); P.x = 945;
    var u = (t - (st.c == null ? -99 : st.c)) / 2.6;
    if (u >= 0 && u < 1) { P.hold = null; PROP.wands = true; P.talk = true; P.mood = 'happy'; var w = Math.sin(t * 9); P.hands = [[-64 + w * 50, -392], [64 - w * 50, -392]]; P.hop = Math.abs(w) * 6; P.look = -0.4;
      if (u > 0.2 && !st.go) { st.go = true; if (t - TO.t > 10.5 || t - TO.t < 0) TO.t = t; CR.burst('star', 420, 190, t); }
      return; }
    var c = t % 12, busy = ['upgrade', 'channel'].indexOf(S.hot) >= 0;
    if (c < 5 || busy) { var mv = Math.cos(t * 0.55); P.x = 945 + Math.sin(t * 0.55) * 14; P.hop = Math.abs(mv) > 0.25 ? Math.abs(Math.sin(t * 4)) * 4 : 0; P.tilt = 0.06; P.hands = [[-70, -212], [-4 + Math.sin(t * 2.6) * 9, -228]]; if (!busy) P.look = lerp(P.look, mv > 0 ? 0.4 : -0.6, 0.06); }
    else if (c < 9) { var r = clamp(Math.min((c - 5) / 0.4, (9 - c) / 0.4), 0, 1); P.hold = r > 0.4 ? null : 'tablet'; PROP.binos = r > 0.6; P.hands = [[lerp(-70, -34, r), lerp(-212, -366, r)], [lerp(70, 34, r), lerp(-170, -366, r)]]; P.look = lerp(P.look, -0.9, 0.08); }
    else { P.hands = [[-70, -212], [-128, -372]]; P.look = lerp(P.look, -0.9, 0.1); P.talk = true; P.mood = 'happy'; }
  }
  function me(P, t, S) { /* ticks her month-end checklist, glances up at the calendar, bounces on her toes. Tap: tears off the month, CLOSED, and cheers */
    var st = S.cast.me; if (tapped(st, t)) { CALP.t = t + 0.25; } reset(P, st, t); P.hold = 'clipboard'; PROP.pen = false; lookAt(P, S, st, t, 0.3); var u = (t - (st.c == null ? -99 : st.c)) / 2.2;
    if (u >= 0 && u < 1) { P.talk = true; P.mood = 'happy';
      if (u < 0.25) { P.hands = [[-66, -200], [lerp(20, 40, u / 0.25), lerp(-206, -400, u / 0.25)]]; P.look = -0.2; P.tilt = -0.1; }
      else { P.hold = null; if (!st.cheer) { st.cheer = true; CR.burst('conf', P.x, P.y - 280, t); } var b = (u - 0.25) / 0.75; P.hop = Math.abs(Math.sin(b * Math.PI * 3)) * 26; P.hands = [[-96, -386 - Math.sin(t * 15) * 8], [96, -386 + Math.sin(t * 15) * 8]]; }
      return; }
    st.cheer = false;
    var c = (t + 3) % 10, busy = S.hot === 'monthend';
    if (c < 6 && !busy) { PROP.pen = true; P.tilt = 0.08; var tick = (t * 1.6) % 1; P.hands = [[-66, -200], [-44 + tick * 18 - (tick > 0.7 ? (tick - 0.7) * 40 : 0), -214 + Math.abs(Math.sin(tick * Math.PI * 2)) * 6 + Math.floor(t * 1.6 % 4) * 4]]; P.look = lerp(P.look, -0.1, 0.1); }
    else if (c < 8 || busy) { P.hands = [[-66, -200], [50, -402]]; P.look = lerp(P.look, -0.25, 0.1); P.tilt = -0.12; P.talk = busy || P.talk; P.mood = 'happy'; }
    else { P.hop = Math.abs(Math.sin(t * 7)) * 5; P.hands = [[-66, -200], [62, -166]]; P.look = lerp(P.look, 0.5, 0.1); }
  }

  function gc(P, t, S) { /* types, swivels between the monitor and the runway, sips from the tower mug. Tap: clears a request: a strip prints, the lamp glows, two thumbs up */
    var st = S.cast.gc; if (tapped(st, t)) { PRINT.t = t + 0.3; CR.burst('star', -170, SC.y - 70, t); } reset(P, st, t); lookAt(P, S, st, t, -0.4); var u = (t - (st.c == null ? -99 : st.c)) / 2;
    if (u >= 0 && u < 1) { P.talk = u > 0.3; P.mood = 'happy';
      if (u < 0.3) { var a = u / 0.3; P.hands = [[-66, -206], [lerp(50, 150, a), lerp(-206, -226, a)]]; P.look = 0.6; }
      else { P.hands = [[-90, -340], [90, -340]]; P.hop = Math.abs(Math.sin((u - 0.3) * 12)) * 6; P.look = 0.2; }
      return; }
    var c = (t + 2) % 12;
    if (c < 6) { var k2 = Math.abs(Math.sin(t * 12)) * 6; P.hands = [[-110, -210 - k2], [-30, -210 - (6 - k2)]]; P.look = lerp(P.look, -0.7, 0.1); }
    else if (c < 9) { var s2 = clamp(Math.min((c - 6) / 0.5, (9 - c) / 0.5), 0, 1); P.sx = lerp(1, 0.6, s2); P.look = lerp(P.look, 0.6, 0.1); P.hands = [[-60, -206], [56, -230]]; P.tilt = -0.04 * s2; }
    else { var r = clamp(Math.min((c - 9) / 0.4, (12 - c) / 0.4), 0, 1); P.hands = [[-66, -206], [lerp(50, 10, r), lerp(-206, -318, r)]]; P.look = lerp(P.look, 0, 0.1); P.tilt = -0.05 * r; }
  }
  function vs(P, t, S) { /* sips her coffee, watches the jets, glances at her phone. Tap: her request is logged on the phone, she waves with it */
    var st = S.cast.vs; if (tapped(st, t)) { PING.t = t; CR.burst('note', P.x, P.y - 250, t); } reset(P, st, t); MUG2.lift = 0; lookAt(P, S, st, t, -0.4); var u = (t - (st.c == null ? -99 : st.c)) / 2.4;
    if (u >= 0 && u < 1) { P.talk = u > 0.25; P.mood = u < 0.2 ? 'wow' : 'happy'; var a = clamp(u / 0.2, 0, 1); P.hands = [[lerp(-60, -70, a), lerp(-230, -380, a) + (u > 0.3 ? Math.sin(t * 14) * 10 : 0)], [70, -200]]; P.look = -0.2; P.hop = u > 0.3 ? Math.abs(Math.sin(t * 8)) * 5 : 0; return; }
    var c = (t + 4) % 11;
    if (c < 3) { var r = clamp(Math.min(c / 0.5, (3 - c) / 0.5), 0, 1); MUG2.lift = r; P.hands = [[-60, -230], [lerp(70, 18, r), lerp(-200, -312, r)]]; P.look = lerp(P.look, 0, 0.1); P.tilt = -0.05 * r; }
    else if (c < 7) { P.hands = [[-60, -230], [70, -200]]; P.look = lerp(P.look, -0.9, 0.06); P.tilt = 0.03; P.mood = 'happy'; }
    else { P.hands = [[-30, -262], [70, -200]]; P.look = lerp(P.look, -0.15, 0.1); P.tilt = 0.07; }
  }

  window.IXW.worlds.support = {
    pan: [-300, 1200],
    paintBg: paintBg, windowBehind: true, paintFrame: paintFrame, paintBack: paintBack, paintFront: paintFront, paintFore: paintFore,
    paintWindow: paintWindow, paintLive: paintLive, paintFrontLive: paintFrontLive, paintForeLive: paintForeLive,
    moteCol: 'rgba(240,138,36,.18)',
    glow: {
      fix: function (g) { rr(g, BD.x + 6, BD.y + 56, BD.w - 12, 50, 10); }, change: function (g) { rr(g, BD.x + 6, BD.y + 188, BD.w - 12, 50, 10); },
      monthend: function (g) { var c = T.cal; rr(g, c.x - 12, c.y - 12, c.w + 24, c.h + 24, 12); },
      upgrade: function (g) { var u = T.up; rr(g, u.x - 12, u.y - 12, u.w + 24, u.h + 24, 12); },
      channel: function (g) { var c = T.ch; rr(g, c.x - 12, c.y - 12, c.w + 24, c.h + 24, 12); },
      team: function (g) { var d = T.desk; rr(g, d.x + 50, d.y + 8, 290, 30, 10); },
      takeoff: function (g) { rr(g, T.rwy.th - 52, T.rwy.y0 - 32, 108, 60, 14); }
    },
    backGlow: ['fix', 'change', 'monthend', 'upgrade', 'channel', 'takeoff'],
    calmView: [140, -130, 900, 720],
    cast: [
      { id: 'ag1', behind: true, keys: ['fix', 'monthend', 'team'], P: AG1, act: ag1 },
      { id: 'ag2', behind: true, keys: ['change', 'team'], P: AG2, act: ag2 },
      { id: 'lead', behind: true, keys: ['upgrade', 'channel'], P: LEAD, act: lead },
      { id: 'me', behind: true, keys: ['monthend'], P: ME, act: me },
      { id: 'gc', behind: true, keys: [], P: GC, act: gc },
      { id: 'vs', behind: true, keys: [], P: VS, act: vs }
    ],
    toy: function (name, S, t) { if (name === 'takeoff') { if (t - TO.t > 10.5 || t - TO.t < 0) TO.t = t; else TO.t = Math.min(TO.t, t - 1.2); CR.burst('star', T.rwy.th, T.rwy.y0 - 20, t); } },
    hit: function (x, y, S, t, onBtn) { var r = CR.hitWalker(x, y, t); if (r) return r;
      if (!onBtn && y > -150 && y < -110) return { say: 'High over the field, a business on **cruise**: fixes, month-end and upgrades handled from the tower.', near: [805, 236], pose: 'wow' };
      return null; },
    onStop: function (key, S, t) { S.kT = t; if (!key && t - TO.t > 16) TO.t = t; }
  };
})(window.IXW && window.IXW.kit, window.CR, window.CO);
