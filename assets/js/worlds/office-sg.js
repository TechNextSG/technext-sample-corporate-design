/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: office-sg (/offices/singapore) — TechNext's Singapore HQ, 261 Waterloo Street #03-36, laid out left to right in the
   stage beside the title card (the card is the unit's door plate, on the right): the lift lobby (its doors open now and
   then and a colleague steps out of the lift; the floor indicator counts up to 03), the coffee point, the brand-blue feature
   wall with the TechNext logo, the Odoo Ready Partner plaque and the reception desk; the glass-walled Discovery Room (a
   consultant at the whiteboard, a client with a visitor pass at the table, the training screen, a sliding door); the lounge
   by the window (a visitor waiting on the sofa, the sales lead with the quotation), the skyline beyond (the bay, the three
   towers under their sky park, the observation wheel turning, planes on the approach). On wide screens: the building
   directory and an umbrella stand by the lift; a vertical garden and a hot desk past the card.
   Everyone has their own idle loop and tap choreography (co-life.js): the receptionist types, takes a call, stamps passes
   and waves, prints a visitor pass or rings the bell; the consultant moves notes on the board, draws the arrows or
   high-fives the client; the client takes notes and sips water, has a eureka or applauds; the visitor scrolls and checks the
   time, bounces or shows the booking; the sales lead paces with the tablet, stamps a quotation or spins the chart. */
(function (K, CR, CO, COL) {
  'use strict';
  if (!K || !CR || !CO || !COL) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed;
  var F = 470, CEIL = -150, WALL = 350, C = CO.C, INK = '#1B1F3B', WOOD = '#C9A27A', WOODD = '#A9825C';
  var T = { lift: { x: -96, y: 214, w: 124 }, coffee: { x: 44, y: 300, w: 58 }, desk: { x: 110, y: 372, w: 222 }, plaque: { x: 70, y: 168, w: 132, h: 70 },
    room: { x: 362, y: 130, w: 262 }, board: { x: 470, y: 196, w: 142, h: 104 }, tv: { x: 378, y: 198, w: 80, h: 54 }, table: { x: 392, y: 392, w: 214 },
    sofa: { x: 662, y: 340, w: 180 }, clock: { x: 318, y: -50 }, wheel: { x: 700, y: 196 } };
  var PB = { x: 920, y: 214, w: 112 }, STB = { x: 1262, y: 388 };
  function setU(g, sx, sy, k) { g.translate(sx, sy); g.scale(k, k); }
  function extOf(W, H, k, sx, sy) { return { l: -(sx + 24) / k, r: (W - sx) / k, t: -(sy + 24) / k, b: (H - sy) / k }; }

  /* ---------------- static: the sky and the skyline (behind the glass), then the frame ---------------- */
  function paintBg(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    CO.sky(g, e, CEIL, 270, [[0, '#9CC4F5'], [0.65, '#DCEBFF'], [1, '#FFF3DE']]);
    var sun = g.createRadialGradient(820, 10, 10, 820, 10, 380); sun.addColorStop(0, 'rgba(255,240,200,.75)'); sun.addColorStop(1, 'rgba(255,240,200,0)'); g.fillStyle = sun; g.fillRect(WALL, CEIL, e.r - WALL, F - CEIL);
    CO.skySG(g, WALL - 40, Math.max(e.r, 1900), 262, 300, { mbs: 772, wheel: -9999 });
    var lo = g.createLinearGradient(0, 320, 0, F); lo.addColorStop(0, 'rgba(220,232,248,.15)'); lo.addColorStop(1, 'rgba(232,238,248,.92)'); g.fillStyle = lo; g.fillRect(WALL, 320, e.r - WALL, F - 320);
    g.restore();
  }
  function paintFrame(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    CO.glass(g, { l: WALL, r: e.r }, CEIL, F, 110, '#EEF2F8', 30);
    /* the feature wall: brand blue with slats */
    var fw = g.createLinearGradient(0, CEIL, 0, F); fw.addColorStop(0, '#3A72D6'); fw.addColorStop(1, '#2756B0'); g.fillStyle = fw; g.fillRect(e.l, CEIL, WALL - e.l, F - CEIL);
    g.fillStyle = 'rgba(255,255,255,.06)'; for (var x = Math.floor(e.l / 28) * 28; x < WALL; x += 28) g.fillRect(x, CEIL, 12, F - CEIL);
    g.fillStyle = 'rgba(255,255,255,.9)'; g.fillRect(WALL - 6, CEIL, 6, F - CEIL);
    /* a skirting strip and a cove light along the top of the wall */
    g.fillStyle = '#1E4691'; g.fillRect(e.l, F - 10, WALL - e.l, 10); g.fillStyle = 'rgba(255,240,200,.35)'; g.fillRect(e.l, CEIL, WALL - e.l, 6);
    CO.ceiling(g, e, CEIL, '#E8EDF5', '#F8FAFD', '#FFFFFF');
    var fl = g.createLinearGradient(0, F, 0, e.b); fl.addColorStop(0, '#EADFCC'); fl.addColorStop(1, '#D8C6AA'); g.fillStyle = fl; g.fillRect(e.l, F, e.r - e.l, e.b - F);
    g.strokeStyle = 'rgba(120,80,40,.14)'; g.lineWidth = 2; g.beginPath(); for (var d = 1; d < 9; d++) { var yy = F + Math.pow(d / 8, 1.5) * (e.b - F); g.moveTo(e.l, yy); g.lineTo(e.r, yy); } g.stroke();
    g.strokeStyle = 'rgba(120,80,40,.07)'; g.beginPath(); for (var px = Math.floor(e.l / 90) * 90; px < e.r; px += 90) { g.moveTo(px, F); g.lineTo(px + (px - 400) * 0.6, e.b); } g.stroke();
    g.fillStyle = 'rgba(40,70,120,.12)'; g.fillRect(e.l, F, e.r - e.l, 6);
    /* the runner from the lift to reception, and the lounge rug */
    g.fillStyle = 'rgba(49,103,202,.16)'; g.beginPath(); g.moveTo(-110, F + 16); g.lineTo(360, F + 16); g.lineTo(400, F + 96); g.lineTo(-150, F + 96); g.closePath(); g.fill();
    g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(-122, F + 52, 500, 3);
    g.fillStyle = 'rgba(201,162,122,.28)'; g.beginPath(); g.ellipse(760, F + 40, 170, 32, 0, 0, Math.PI * 2); g.fill(); g.strokeStyle = 'rgba(201,162,122,.5)'; g.lineWidth = 3; g.beginPath(); g.ellipse(760, F + 40, 150, 25, 0, 0, Math.PI * 2); g.stroke();
    g.restore();
  }

  /* ---------------- static back props ---------------- */
  function pendant(g, x, len, shade) { g.strokeStyle = '#9AA6BC'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(x, CEIL); g.lineTo(x, CEIL + len); g.stroke(); g.fillStyle = shade || INK; g.beginPath(); g.moveTo(x - 18, CEIL + len + 16); g.lineTo(x - 7, CEIL + len); g.lineTo(x + 7, CEIL + len); g.lineTo(x + 18, CEIL + len + 16); g.closePath(); g.fill(); fillE(g, x, CEIL + len + 17, 11, 3.2, '#FFE9A8'); }
  function paintBack(g, ext) {
    /* the logo on the feature wall */
    CO.plane(g, 142, 46, 3.4, 0, '#FFFFFF', '#2E63C4'); text(g, 'TechNext', 258, 72, 37, 800, '#FFFFFF', 'center');
    text(g, 'SINGAPORE HQ  ·  #03-36', 258, 94, 10.5, 800, 'rgba(255,255,255,.75)', 'center');
    [150, 236, 322].forEach(function (x) { pendant(g, x, 112); });
    /* the Odoo Ready Partner plaque */
    var pq = T.plaque; CO.plaque(g, pq.x, pq.y, pq.w, pq.h, 'Ready Partner', 'TechNext Pte. Ltd.', C.odoo); text(g, 'ODOO', pq.x + pq.w / 2, pq.y + 13, 9, 800, '#FFFFFF', 'center');
    /* a framed print beside it: the three offices on one line */
    shadowed(g, 8, 3, 0.18, function () { fillRR(g, 214, 172, 108, 62, 4, '#FFFFFF'); }); fillRR(g, 220, 178, 96, 50, 2, '#EEF4FE');
    g.strokeStyle = C.blue; g.lineWidth = 3; g.lineCap = 'round'; g.beginPath(); g.moveTo(232, 206); g.lineTo(304, 206); g.stroke();
    [[234, C.sg, 'SG'], [268, C.ph, 'PH'], [302, '#F08A24', 'VN']].forEach(function (p) { fillE(g, p[0], 206, 6, 6, '#FFFFFF'); g.strokeStyle = p[1]; g.lineWidth = 2.4; g.beginPath(); g.arc(p[0], 206, 6, 0, 7); g.stroke(); text(g, p[2], p[0], 222, 6, 800, INK, 'center'); });
    text(g, 'ONE TEAM', 268, 192, 6.5, 800, C.blueD, 'center');
    /* the lift: steel frame, the cab inside (its doors are live), the floor indicator, the call button */
    var lf = T.lift; soft(g, lf.x + lf.w / 2, F + 4, 80, 8, 0.2); fillRR(g, lf.x - 10, lf.y - 10, lf.w + 20, F - lf.y + 10, 6, '#C9D1DD'); fillRR(g, lf.x - 4, lf.y - 4, lf.w + 8, F - lf.y + 4, 4, '#AEB8C8');
    var cab = g.createLinearGradient(0, lf.y, 0, F); cab.addColorStop(0, '#E9DCC6'); cab.addColorStop(1, '#CDB89A'); g.fillStyle = cab; g.fillRect(lf.x, lf.y, lf.w, F - lf.y);
    g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(lf.x + 10, lf.y + 16, lf.w - 20, 3); fillRR(g, lf.x + 12, lf.y + 120, lf.w - 24, 4, 2, '#B9A27E');
    fillRR(g, lf.x - 2, lf.y - 46, lf.w + 4, 30, 6, INK); text(g, 'TO CLIENT SITES', lf.x + lf.w - 4, lf.y - 27, 7, 800, '#FFFFFF', 'right');
    fillRR(g, lf.x + lf.w + 14, lf.y + 96, 14, 36, 7, INK); fillE(g, lf.x + lf.w + 21, lf.y + 108, 4, 4, '#C9D1DD'); fillE(g, lf.x + lf.w + 21, lf.y + 121, 4, 4, '#C9D1DD');
    /* the coffee point: a cabinet, the machine, kopi cups */
    var cf = T.coffee; soft(g, cf.x + cf.w / 2, F + 4, 46, 6, 0.2); fillRR(g, cf.x - 4, cf.y + 82, cf.w + 8, F - cf.y - 82, 5, '#F4F7FC'); fillRR(g, cf.x - 8, cf.y + 76, cf.w + 16, 9, 4, WOOD);
    g.fillStyle = 'rgba(30,60,110,.08)'; g.fillRect(cf.x + 2, cf.y + 100, cf.w - 4, 2); fillE(g, cf.x + cf.w / 2, cf.y + 120, 3, 3, '#9AA6BC');
    fillRR(g, cf.x + 4, cf.y, cf.w - 8, 76, 9, '#2A3550'); fillRR(g, cf.x + 10, cf.y + 8, cf.w - 20, 16, 4, '#3A4458'); fillRR(g, cf.x + 18, cf.y + 34, cf.w - 36, 5, 2, '#5C6B7A');
    [[cf.x - 4, '#FFFFFF'], [cf.x + cf.w - 6, C.blue]].forEach(function (c) { COL.mug(g, c[0] + 6, cf.y + 76, 0.75, c[1], c[1] === '#FFFFFF' ? C.blue : '#FFFFFF'); });
    text(g, 'KOPI', cf.x + cf.w / 2, cf.y - 8, 8, 800, '#FFFFFF', 'center');
    /* the Discovery Room's back wall: the whiteboard, the training screen, the room sign */
    var rm = T.room; g.fillStyle = 'rgba(244,247,252,.94)'; g.fillRect(rm.x, rm.y, rm.w, F - rm.y);
    g.fillStyle = 'rgba(49,103,202,.06)'; for (var sl = rm.x + 8; sl < rm.x + rm.w; sl += 22) g.fillRect(sl, rm.y + 10, 1.5, F - rm.y - 10);
    var b = T.board; shadowed(g, 8, 3, 0.14, function () { fillRR(g, b.x, b.y, b.w, b.h, 5, '#FFFFFF'); }); g.strokeStyle = '#C9D1DD'; g.lineWidth = 2; rr(g, b.x, b.y, b.w, b.h, 5); g.stroke();
    fillRR(g, b.x + 20, b.y + b.h - 2, b.w - 40, 5, 2, '#AAB4C4'); fillRR(g, b.x + 30, b.y + b.h - 5, 12, 4, 2, C.blue); fillRR(g, b.x + 48, b.y + b.h - 5, 12, 4, 2, '#E0456B');
    text(g, 'DISCOVERY · HOW AN ORDER MOVES', b.x + 8, b.y + 14, 6, 800, C.blueD);
    var tv = T.tv; fillRR(g, tv.x - 4, tv.y - 4, tv.w + 8, tv.h + 8, 5, INK); g.fillStyle = '#9AA6BC'; g.fillRect(tv.x + tv.w / 2 - 2, tv.y + tv.h + 4, 4, 12);
    fillRR(g, rm.x + rm.w / 2 - 66, rm.y + 14, 132, 18, 9, INK); text(g, 'DISCOVERY ROOM', rm.x + rm.w / 2, rm.y + 26, 7.6, 800, '#FFFFFF', 'center');
    /* the lounge by the window: a plant, the floor lamp, the sofa's back, a side table with a vase */
    K.plant(g, { x: 640, y: F }, '#FFFFFF', '#E3E9F3');
    g.strokeStyle = INK; g.lineWidth = 4; g.beginPath(); g.moveTo(878, F); g.lineTo(878, 236); g.quadraticCurveTo(878, 212, 852, 212); g.stroke(); fillE(g, 878, F, 20, 5, INK);
    g.fillStyle = '#FFE9A8'; g.beginPath(); g.moveTo(828, 234); g.lineTo(840, 208); g.lineTo(864, 208); g.lineTo(876, 234); g.closePath(); g.fill();
    var so = T.sofa; soft(g, so.x + so.w / 2, F + 6, 120, 10, 0.24); fillRR(g, so.x, so.y, so.w, 90, 22, '#4F6CA8'); fillRR(g, so.x + 10, so.y + 10, so.w - 20, 28, 14, 'rgba(255,255,255,.08)');
    fillRR(g, so.x + 22, so.y + 14, 40, 30, 10, '#FFD84A'); fillRR(g, so.x + so.w - 60, so.y + 14, 38, 30, 10, '#9FE3C1');
    pendant(g, 760, 200, '#C9A27A');
    /* the building directory and an umbrella stand (wide screens, by the lift) */
    if (ext.l < -110) {
      shadowed(g, 10, 4, 0.2, function () { fillRR(g, -330, 150, 150, 176, 8, '#1B1F3B'); }); text(g, 'LEVEL 03', -255, 172, 9, 800, '#FFD84A', 'center');
      [['#03-36', 'TechNext Pte. Ltd.', true], ['#03-35', '', false], ['#03-37', '', false], ['#03-38', '', false]].forEach(function (r, i) { var y = 190 + i * 30; fillRR(g, -320, y, 130, 24, 4, r[2] ? '#3167CA' : 'rgba(255,255,255,.08)'); text(g, r[0], -312, y + 15, 7.4, 800, r[2] ? '#FFFFFF' : 'rgba(255,255,255,.35)'); if (r[1]) text(g, r[1], -264, y + 15, 7, 800, '#FFFFFF'); else { g.fillStyle = 'rgba(255,255,255,.14)'; g.fillRect(-264, y + 10, 50, 4); } });
      fillRR(g, -180, 410, 34, 60, 6, '#5C6B7A'); fillRR(g, -184, 404, 42, 10, 4, '#7A869C'); [['#E0456B', -172], ['#FFD84A', -162], [C.blue, -152]].forEach(function (u) { g.strokeStyle = u[0]; g.lineWidth = 6; g.lineCap = 'round'; g.beginPath(); g.moveTo(u[1], 404); g.lineTo(u[1] + 2, 350); g.stroke(); g.strokeStyle = INK; g.lineWidth = 2; g.beginPath(); g.arc(u[1] + 6, 348, 4, Math.PI, 0); g.stroke(); });
      K.plant(g, { x: -390, y: F }, '#FFFFFF', '#E3E9F3');
    }
    /* past the card on wide screens: a vertical garden and a hot desk */
    if (ext.r > 1440) {
      fillRR(g, 1468, -110, 150, F + 110, 6, '#3E7D5A'); for (var gy = -100; gy < F - 10; gy += 16) for (var gx = 1474; gx < 1612; gx += 16) { var hh = hash(gx * 0.3 + gy); fillE(g, gx + 6 + hh * 4, gy + 6, 9 + hh * 4, 7 + hh * 3, hh > 0.6 ? '#4FB57D' : hh > 0.3 ? '#3A9C68' : '#2E8558'); if (hh > 0.85) fillE(g, gx + 8, gy + 4, 3, 3, '#FFD84A'); }
      fillRR(g, 1490, 180, 106, 30, 6, 'rgba(255,255,255,.92)'); text(g, 'CITY IN A GARDEN', 1543, 199, 7.5, 800, '#2E8558', 'center');
      pendant(g, 1720, 150);
    }
    /* behind the door plate (the card): a hanging banner of what runs from here, the phone booth, a fiddle-leaf fig,
       the stand-up table where the delivery lead and a consultant go over the plan */
    if (ext.r > 880) {
      g.strokeStyle = '#9AA6BC'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(1010, CEIL); g.lineTo(1010, -44); g.moveTo(1370, CEIL); g.lineTo(1370, -44); g.stroke();
      shadowed(g, 10, 4, 0.18, function () { fillRR(g, 990, -44, 400, 46, 8, '#FFFFFF'); }); fillRR(g, 990, -44, 12, 46, 6, C.blue); fillRR(g, 996, -44, 6, 46, 0, C.blue);
      [['SALES', C.blue], ['DISCOVERY', C.odoo], ['ON-SITE WORK', '#14A38B']].forEach(function (b, i) { var bx = [1022, 1112, 1240][i]; fillE(g, bx + 5, -21, 5, 5, b[1]); text(g, b[0], bx + 16, -16.5, 12, 800, INK); });
      /* the phone booth's back and roof */
      var pb = PB; soft(g, pb.x + pb.w / 2, F + 4, 70, 8, 0.24); fillRR(g, pb.x - 6, pb.y - 16, pb.w + 12, 22, 6, INK); fillRR(g, pb.x, pb.y, pb.w, F - pb.y, 0, '#E8EDF5');
      for (var fy = pb.y + 14; fy < F - 10; fy += 14) for (var fx = pb.x + 8; fx < pb.x + pb.w - 6; fx += 14) fillE(g, fx + ((fy / 14) % 2) * 7, fy, 3.4, 3.4, 'rgba(49,103,202,.12)');
      text(g, 'PHONE BOOTH', pb.x + pb.w / 2, pb.y - 2, 7.4, 800, '#FFFFFF', 'center'); fillRR(g, pb.x + pb.w / 2 - 22, pb.y + 26, 44, 4, 2, '#FFE9A8');
      /* the fig */
      soft(g, 1086, F + 4, 40, 7, 0.22); fillRR(g, 1066, 410, 40, 60, 8, '#F4EEE4'); fillRR(g, 1062, 404, 48, 10, 5, WOOD); g.strokeStyle = '#7A5A3C'; g.lineWidth = 4; g.beginPath(); g.moveTo(1086, 406); g.lineTo(1084, 250); g.stroke();
      [[1060, 380, -0.6], [1110, 360, 0.6], [1058, 330, -0.8], [1112, 312, 0.7], [1064, 286, -0.5], [1104, 268, 0.5], [1084, 240, 0], [1072, 352, -0.2], [1098, 300, 0.2]].forEach(function (l, i) { g.save(); g.translate(l[0], l[1]); g.rotate(l[2]); fillE(g, 0, 0, 22, 14, i % 2 ? '#3A9C68' : '#4FB57D'); g.strokeStyle = 'rgba(255,255,255,.3)'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(-16, 0); g.lineTo(16, 0); g.stroke(); g.restore(); });
      /* the stand-up table's pedestal (its top is in front) and a rug */
      var st = STB; g.fillStyle = 'rgba(201,162,122,.22)'; g.beginPath(); g.ellipse(st.x, F + 46, 190, 30, 0, 0, Math.PI * 2); g.fill(); g.strokeStyle = 'rgba(49,103,202,.25)'; g.lineWidth = 2.5; g.beginPath(); g.ellipse(st.x, F + 46, 172, 24, 0, 0, Math.PI * 2); g.stroke();
      soft(g, st.x, F + 4, 70, 8, 0.22); fillRR(g, st.x - 5, st.y, 10, F - st.y - 6, 3, '#7A869C'); fillRR(g, st.x - 34, F - 8, 68, 8, 4, '#5C6B7A');
    }
  }
  /* ---------------- static front props: the reception desk, the meeting table, the sofa's seat, the hot desk ---------------- */
  function paintFront(g, ext) {
    var d = T.desk; soft(g, d.x + d.w / 2, F + 4, d.w * 0.55, 10, 0.24);
    fillRR(g, d.x, d.y, d.w, F - d.y, 16, '#FFFFFF'); fillRR(g, d.x - 8, d.y - 8, d.w + 16, 14, 6, '#E3E9F3'); fillRR(g, d.x, d.y + 38, d.w, 10, 0, C.blue);
    g.fillStyle = 'rgba(49,103,202,.07)'; for (var sx2 = d.x + 14; sx2 < d.x + d.w - 8; sx2 += 18) g.fillRect(sx2, d.y + 54, 9, F - d.y - 60);
    text(g, 'RECEPTION', d.x + d.w / 2, d.y + 72, 11, 800, C.blueD, 'center'); CO.plane(g, d.x + d.w / 2 - 56, d.y + 68, 0.8, 0, C.blue);
    /* an orchid in a vase, the bell, the pass printer, the sign-in tablet's frame (its screen is live) */
    var ox = d.x + 22, oy = d.y - 8; fillRR(g, ox - 10, oy - 22, 20, 22, 4, '#FFFFFF'); g.strokeStyle = '#2E9E66'; g.lineWidth = 2; g.beginPath(); g.moveTo(ox, oy - 22); g.quadraticCurveTo(ox + 4, oy - 60, ox + 16, oy - 70); g.stroke();
    [[ox + 6, oy - 52], [ox + 12, oy - 62], [ox + 18, oy - 70], [ox - 2, oy - 44]].forEach(function (p) { fillE(g, p[0], p[1], 6, 5, '#B05FC9'); fillE(g, p[0], p[1], 2, 2, '#FFE07A'); });
    fillE(g, d.x + 62, d.y - 4, 9, 5, '#D9B14A'); fillE(g, d.x + 62, d.y - 8, 7, 5, '#E9C35A'); fillE(g, d.x + 62, d.y - 13, 2.4, 2.4, '#D9B14A');
    fillRR(g, d.x + 132, d.y - 20, 34, 20, 4, '#DCE3EE'); fillRR(g, d.x + 136, d.y - 24, 26, 6, 2, '#AEB8C8');
    fillRR(g, d.x + 176, d.y - 40, 46, 34, 4, '#2A3550');
    /* the Discovery Room's table: a laptop, water glasses, a pen pot */
    var tb = T.table; fillRR(g, tb.x, tb.y, tb.w, 10, 4, WOOD); g.fillStyle = WOODD; g.fillRect(tb.x + 16, tb.y + 10, 6, F - tb.y - 10); g.fillRect(tb.x + tb.w - 22, tb.y + 10, 6, F - tb.y - 10);
    COL.laptop(g, tb.x + 150, tb.y, 0.8, 1, '#E9F1FF'); fillRR(g, tb.x + 186, tb.y - 14, 10, 14, 2, 'rgba(255,255,255,.75)'); fillRR(g, tb.x + 186, tb.y - 8, 10, 8, 2, 'rgba(159,196,255,.6)');
    fillRR(g, tb.x + 106, tb.y - 10, 10, 10, 2, '#5C6B7A'); g.strokeStyle = C.blue; g.lineWidth = 2; g.beginPath(); g.moveTo(tb.x + 109, tb.y - 10); g.lineTo(tb.x + 107, tb.y - 22); g.moveTo(tb.x + 113, tb.y - 10); g.lineTo(tb.x + 116, tb.y - 20); g.stroke();
    /* the sofa's seat and arms, in front of whoever sits there; the coffee table */
    var so = T.sofa; fillRR(g, so.x - 8, so.y + 72, so.w + 16, 40, 16, '#5E7BB5'); fillRR(g, so.x - 18, so.y + 24, 34, 96, 14, '#4F6CA8'); fillRR(g, so.x + so.w - 16, so.y + 24, 34, 96, 14, '#4F6CA8');
    g.fillStyle = '#3E5A94'; g.fillRect(so.x + 4, so.y + 112, 8, 18); g.fillRect(so.x + so.w - 12, so.y + 112, 8, 18);
    fillRR(g, 700, 456, 116, 9, 4, WOOD); g.fillStyle = WOODD; g.fillRect(710, 465, 5, 24); g.fillRect(801, 465, 5, 24); fillRR(g, 716, 444, 30, 12, 2, '#FFFFFF'); fillRR(g, 720, 447, 22, 2, 1, C.blue); COL.mug(g, 786, 456, 0.8, '#FFFFFF', C.blue);
    if (ext.r > 1440) { var hx = 1650; fillRR(g, hx, 392, 170, 10, 4, WOOD); g.fillStyle = '#7A869C'; g.fillRect(hx + 10, 402, 6, F - 402); g.fillRect(hx + 154, 402, 6, F - 402);
      g.fillStyle = '#5C6B7A'; g.fillRect(hx + 34, 366, 4, 26); fillRR(g, hx + 10, 330, 52, 38, 4, '#2A3550'); fillRR(g, hx + 14, 334, 44, 30, 2, '#E9F1FF'); g.fillStyle = '#C9D3E3'; for (var l = 0; l < 4; l++) g.fillRect(hx + 18, 339 + l * 6, 20 + (l % 2) * 12, 2.4);
      COL.mug(g, hx + 140, 392, 0.85, '#FFFFFF', C.ph); }
    if (ext.r > 880) { var pb = PB; g.fillStyle = 'rgba(214,232,250,.28)'; g.fillRect(pb.x, pb.y, pb.w, F - pb.y); g.fillStyle = 'rgba(255,255,255,.38)'; g.beginPath(); g.moveTo(pb.x + 20, F); g.lineTo(pb.x + 52, pb.y); g.lineTo(pb.x + 66, pb.y); g.lineTo(pb.x + 34, F); g.closePath(); g.fill();
      g.fillStyle = INK; g.fillRect(pb.x - 6, pb.y, 7, F - pb.y); g.fillRect(pb.x + pb.w - 1, pb.y, 7, F - pb.y); fillRR(g, pb.x + pb.w - 16, 320, 5, 36, 2, '#C9D1DD');
      var st = STB; fillRR(g, st.x - 82, st.y - 10, 164, 12, 5, WOOD); g.fillStyle = 'rgba(255,255,255,.3)'; g.fillRect(st.x - 78, st.y - 8, 156, 2);
      fillRR(g, st.x + 30, st.y - 40, 40, 30, 3, '#FFFFFF'); fillRR(g, st.x + 30, st.y - 40, 40, 8, 3, C.blue); g.fillStyle = '#C9D3E3'; g.fillRect(st.x + 36, st.y - 26, 26, 2); g.fillRect(st.x + 36, st.y - 20, 18, 2); fillRR(g, st.x + 28, st.y - 10, 44, 3, 1.5, '#AEB8C8'); }
  }

  /* ---------------- the people: the TechNext team (and two clients with visitor passes) ---------------- */
  var W = CR.who, GREY = '#9AA6BC';
  var REC = W({ x: 222, y: 470, s: 0.54, ph: 0.3, skin: 1, hair: 0, style: 'bun', clip: '#FFD84A', outfit: 'shirt', top: '#DCE7FB', headset: '#3167CA', feet: false, hands: [[-60, -200], [64, -200]] });
  var CLI = W({ x: 446, y: 470, s: 0.5, ph: 2.2, skin: 0, hair: 2, style: 'bob', outfit: 'cardigan', top: '#E9D7C0', top2: '#E0456B', id: GREY, sit: true, chairCol: '#3A4458', hands: [[-60, -205], [60, -205]], look: 0.6 });
  var CON = W({ x: 568, y: 470, s: 0.5, ph: 1.1, skin: 2, hair: 1, style: 'short', outfit: 'polo', top: '#14A38B', glasses: true, hands: [[-120, -300], [62, -190]], look: -0.4 });
  var VIS = W({ x: 742, y: 470, s: 0.5, ph: 0.8, skin: 3, hair: 0, style: 'short', outfit: 'shirt', top: '#F2B233', id: GREY, sit: true, chair: false, sitDrop: 30, hold: 'tablet', hands: [[-50, -200], [60, -176]], look: -0.4 });
  var SAL = W({ x: 846, y: 470, s: 0.54, ph: 2.9, skin: 3, hair: 0, style: 'short', outfit: 'shirt', top: '#2A3550', top2: '#DCE7FB', glasses: true, hold: 'tablet', hands: [[-60, -215], [70, -150]], look: -0.6 });
  var CREW = [
    { x0: -390, x1: -130, y: 488, spd: 18, ph: 0.4, label: 'Consultant, off to a client site', lines: ['Off to a **client site** in town. On-site days are the best days.', 'Laptop, ID, umbrella. **Singapore weather!**'], acts: ['wave', 'id', 'jump'],
      P: W({ s: 0.5, skin: 4, hair: 1, style: 'short', outfit: 'polo', top: '#1E4691', hold: 'bags' }) },
    { front: true, x0: -260, x1: 90, y: 690, spd: 22, ph: 0.7, label: 'Project manager', lines: ['Discovery at ten, **training** at two.', 'One page, one plan, **one team**.'], acts: ['cheer', 'spin', 'id'],
      P: W({ s: 0.58, skin: 1, hair: 0, style: 'long', outfit: 'shirt', top: '#E0456B', hold: 'clipboard', hands: [[-60, -212], [70, -150]] }) },
    { front: true, x0: 960, x1: 1390, y: 606, spd: 20, ph: 0.2, label: 'Trainer', lines: ['Training kits for the **two o’clock** session.', 'Each team learns **its own screens**.'], acts: ['jump', 'id', 'wave'],
      P: W({ s: 0.58, skin: 2, hair: 2, style: 'pony', outfit: 'cardigan', top: '#3167CA', top2: '#FFFFFF', hold: 'box', hands: [[-60, -212], [64, -216]] }) }
  ];
  /* extras: the colleague who steps out of the lift, the hot-desker past the card */
  var LIFTP = W({ x: -34, y: 470, s: 0.5, ph: 1.7, skin: 2, hair: 0, style: 'short', outfit: 'polo', top: '#F2B233', top2: '#1B1F3B', glasses: true, hold: 'bags', hands: [[-70, -150], [70, -150]] });
  var XS = [
    { P: W({ x: 1745, y: 470, s: 0.52, ph: 0.4, skin: 0, hair: 1, style: 'bob', outfit: 'shirt', top: '#E0456B', sit: true, chairCol: '#2A3550' }), hands: [[-60, -200], [60, -200]],
      box: [1745, 360, 110, 200], who: 'Functional consultant', role: 'Hot desk · illustration', near: [1300, 120], pose: 'wow', dur: [1.5, 2.0], fx: ['spark', 'note'],
      lines: ['Hot desk today, **on-site** tomorrow.', 'Writing up the **scope** from this morning’s workshop.'],
      idle: function (P, t) { var c = (t + 2) % 9, k = Math.abs(Math.sin(t * 8)) * 6; if (c < 6) P.hands = [[-66, -196 - k], [56, -196 - (6 - k)]]; else { P.hands = [[-60, -200], [26, -330]]; P.look = -0.8; } },
      moves: [function (P, u) { P.sx = Math.cos(COL.ease(u) * Math.PI * 2); P.hop = COL.bell(u) * 12; P.hands = [[-110, -260], [110, -260]]; }, function (P, u, t) { var b = Math.sin(t * 9); P.tilt = b * 0.1; P.hands = b > 0 ? [[-120, -380], [60, -200]] : [[-60, -200], [120, -380]]; }],
      after: function (g, P, t, S, X, u) { if (!(u >= 0) && (t + 2) % 9 > 6) { var h = COL.hand(P, 1); COL.mug(g, h[0] - 3, h[1] + 4, 0.8, '#FFFFFF', C.ph); } } },
    /* the account manager on a client call in the phone booth: paces, talks with her hand, nods */
    { P: W({ x: 976, y: 470, s: 0.5, ph: 1.4, skin: 4, hair: 0, style: 'long', outfit: 'cardigan', top: '#714B67', top2: '#FFFFFF', low: '#2A3550' }), hands: [[-40, -380], [70, -160]],
      box: [976, 360, 100, 220], who: 'Account manager', role: 'Phone booth \u00B7 illustration', near: [1120, 60], pose: 'think', dur: [1.8, 1.6], fx: ['note', 'star'],
      lines: ['On a call with a client: a **discovery** workshop, on-site.', 'Quiet booth, loud **Singapore** weather outside!'],
      idle: function (P, t) { P.x = 976 + Math.sin(t * 0.5) * 14; P.look = Math.cos(t * 0.5) * 0.6; var c = (t + 1) % 7; P.talk = c < 4.5; if (c < 4.5) P.hands = [[-40, -380], [80 + Math.sin(t * 4) * 16, -230 + Math.cos(t * 3) * 20]]; else { P.hands = [[-40, -380], [50, -160]]; P.tilt = Math.sin(t * 5) * 0.04; } },
      moves: [function (P, u) { P.hands = [[-40, -380], [90, -330]]; P.hop = COL.bell(u) * 10; P.look = 0.2; }, function (P, u) { P.sx = Math.cos(COL.ease(u) * Math.PI * 2); P.hands = [[-40, -380], [110, -250]]; }],
      after: function (g, P, t, S, X, u, k) { var h = COL.hand(P, 0); COL.phone(g, h[0] + 6, h[1] + 4, 0.3, true); if (u >= 0 && k === 0) COL.pop(g, P.x, P.y - 290, 'Workshop booked!', u, C.odoo); } },
    /* the delivery lead at the stand-up table: types the go-live plan, turns to her colleague; a tap shows the plan or a fist pump */
    { P: W({ x: 1166, y: 470, s: 0.52, ph: 2.6, skin: 0, hair: 1, style: 'short', outfit: 'polo', top: '#2A3550', top2: '#FFD84A', glasses: true }), hands: [[-60, -170], [100, -176]],
      box: [1166, 360, 100, 220], who: 'Delivery lead', role: 'Stand-up table \u00B7 illustration', near: [1120, 80], pose: 'present', dur: [2, 1.5], fx: ['spark', 'conf'],
      lines: ['Go-live plan on one page: **training**, cut-over, first month-end.', 'Discovery done, **scope** agreed. Next stop: configuration!'],
      idle: function (P, t) { var c = (t + 3) % 8, k = Math.abs(Math.sin(t * 8)) * 6; if (c < 5) { P.hands = [[-60, -170], [104 + k, -170 - (6 - k)]]; P.look = 0.6; } else { P.hands = [[-60, -170], [60, -190]]; P.look = 0.9; P.mood = 'happy'; P.talk = true; } },
      moves: [function (P, u) { P.hands = [[-110, -330], [100, -176]]; P.look = -0.2; }, function (P, u) { var p = Math.abs(Math.sin(u * Math.PI * 3)); P.hands = [[-60, -170], [86, -380 - p * 30]]; P.hop = p * 10; }],
      after: function (g, P, t, S, X, u, k) { if (u >= 0 && k === 0) { var a = clamp(u * 5, 0, 1) * clamp((1 - u) * 5, 0, 1); g.save(); g.globalAlpha = a; g.translate(P.x - 40, P.y - 310); fillRR(g, -40, -36, 80, 56, 5, '#FFFFFF'); g.strokeStyle = '#DCE3EE'; g.lineWidth = 1; rr(g, -40, -36, 80, 56, 5); g.stroke();
          text(g, 'GO-LIVE PLAN', -32, -24, 6, 800, C.blueD); [['Train', C.blue], ['Cut-over', '#14A38B'], ['Month-end', C.odoo]].forEach(function (r, i) { fillE(g, -28, -12 + i * 11, 3, 3, r[1]); text(g, r[0], -20, -9.6 + i * 11, 5.8, 800, INK); }); text(g, 'sample', 30, 16, 5, 700, '#9AA6BC', 'right'); g.restore(); } } },
    /* the consultant with an iced kopi: sips, nods along, laughs; a tap is a toast or a little jump */
    { P: W({ x: 1356, y: 470, s: 0.52, ph: 0.9, skin: 2, hair: 0, style: 'pony', clip: '#14A38B', outfit: 'shirt', top: '#F2B233', low: '#2A3550' }), hands: [[-80, -190], [60, -150]],
      box: [1356, 360, 100, 220], who: 'Consultant', role: 'Stand-up table \u00B7 illustration', near: [1150, 80], pose: 'love', dur: [1.6, 1.4], fx: ['heart', 'star'],
      lines: ['Kopi peng, then the **training** plan for the sales team.', 'Each team learns **its own screens**. Works every time.'],
      idle: function (P, t) { var c = (t + 5) % 9; P.look = -0.7; if (c < 1.4) { P.hands = [[-30, -330], [60, -150]]; P.look = 0; } else if (c < 5) { P.hands = [[-80, -200], [60, -150]]; P.tilt = Math.sin(t * 2.4) * 0.03; } else if (c < 6.4) { P.hands = [[-80, -200], [70, -170]]; P.mood = 'happy'; P.tilt = Math.sin(t * 12) * 0.05; } else P.hands = [[-80, -200], [40, -200]]; },
      moves: [function (P, u) { P.hands = [[-120, -390], [60, -150]]; P.look = -0.6; }, function (P, u) { P.hop = COL.bell(u) * 22; P.hands = [[-90, -260], [100, -300]]; }],
      after: function (g, P, t, S, X, u) { var h = COL.hand(P, 0); COL.cup(g, h[0], h[1] + 10, 0.9, true); } }
  ];

  /* ---------------- live ---------------- */
  var LOGO = { t: -9 }, SG = { notes: [0, 1, 2, 3], hi5: -9, arrows: -9, pass: -9, bell: -9, quote: -9, chart: -9, eureka: -9, booking: -9 };
  function liftLive(g, t, S) {
    var lf = T.lift, cyc = t % 16, open = cyc > 11 ? clamp((cyc - 11) / 0.8, 0, 1) * clamp((15.4 - cyc) / 0.8, 0, 1) : 0, hot = S.hot === 'onsite';
    if (hot) open = Math.max(open, clamp((t - (S.oT || 0)) / 0.8, 0, 1));
    var fl = cyc < 11 ? Math.min(3, 1 + Math.floor(cyc / 3.4)) : 3;
    fillRR(g, lf.x + 4, lf.y - 41, 40, 20, 3, '#0E1230'); text(g, '0' + fl, lf.x + 32, lf.y - 26, 10, 800, '#FFB547', 'center');
    g.fillStyle = '#FFB547'; g.beginPath(); var up = fl < 3 && cyc < 11; if (up) { g.moveTo(lf.x + 9, lf.y - 27); g.lineTo(lf.x + 14, lf.y - 35); g.lineTo(lf.x + 19, lf.y - 27); } else { g.moveTo(lf.x + 9, lf.y - 33); g.lineTo(lf.x + 19, lf.y - 33); g.lineTo(lf.x + 14, lf.y - 25); } g.closePath(); g.fill();
    fillE(g, lf.x + lf.w + 21, lf.y + 108, 4, 4, open > 0 || hot ? '#FFB547' : '#C9D1DD');
    if (open > 0.02) { var P = LIFTP; COL.reset(P, [[-70, -150], [70, -150]]); var wv = open > 0.9; P.mood = wv ? 'happy' : 'calm'; if (wv) P.hands = [[-70, -150], [120 + Math.sin(t * 12) * 14, -400]]; P.look = 0.4; K.person(g, P, t); }
    g.save(); g.beginPath(); g.rect(lf.x, lf.y, lf.w, F - lf.y); g.clip(); var dw = lf.w / 2, sh = open * dw * 0.96;
    [[lf.x - sh, 1], [lf.x + dw + sh, -1]].forEach(function (dd) { var gr = g.createLinearGradient(dd[0], 0, dd[0] + dw, 0); gr.addColorStop(0, '#DCE2EA'); gr.addColorStop(0.5, '#F4F6FA'); gr.addColorStop(1, '#C9D1DD'); g.fillStyle = gr; g.fillRect(dd[0], lf.y, dw, F - lf.y);
      g.fillStyle = 'rgba(30,60,110,.12)'; g.fillRect(dd[1] > 0 ? dd[0] + dw - 2 : dd[0], lf.y, 2, F - lf.y); });
    g.restore(); CO.plane(g, lf.x + lf.w / 2 - sh * 0.0, lf.y + 70, 1.4, 0, open > 0.3 ? 'rgba(49,103,202,.2)' : 'rgba(49,103,202,.35)');
  }
  function boardLive(g, t, S) {
    var b = T.board, dk = S.hot === 'discovery', dp = dk ? clamp((t - (S.dT || 0)) / 1.6, 0, 1) : 1, cyc = (t + 1) % 10, mv = cyc > 5 && cyc < 7.5 ? COL.ease((cyc - 5) / 2.5) : cyc >= 7.5 ? 1 : 0;
    var N = [['Quote', '#FFE680', '#3167CA'], ['Order', '#FFC2D1', '#3167CA'], ['Deliver', '#B8EBD3', '#14A38B'], ['Bill', '#C4DAFB', '#714B67']];
    N.forEach(function (n, i) { var nx = b.x + 10 + i * 33, ny = b.y + 24 + (dk ? (1 - dp) * (i % 2 ? 14 : -6) : (i % 2) * 5);
      if (i === 2 && !dk) { nx += Math.sin(mv * Math.PI) * 6; ny += -Math.sin(mv * Math.PI) * 10; }
      COL.note(g, nx + 14, ny + 13, 27, (i - 1.5) * 0.04, n[1], n[0]); fillE(g, nx + 14, b.y + 70, 7, 7, (!dk || dp > i / 4) ? n[2] : '#E3E8EF'); });
    var ar = clamp((t - SG.arrows) / 0.9, 0, 1), al = t - SG.arrows < 4 ? 1 : 0;
    if (al) { g.strokeStyle = '#E0456B'; g.lineWidth = 1.8; g.lineCap = 'round'; for (var a = 0; a < 3; a++) { var x0 = b.x + 38 + a * 33, f = clamp(ar * 3 - a, 0, 1); if (f <= 0) continue; g.beginPath(); g.moveTo(x0, b.y + 36); g.lineTo(x0 + 6 * f, b.y + 36); g.stroke(); if (f > 0.9) { g.beginPath(); g.moveTo(x0 + 3, b.y + 33); g.lineTo(x0 + 6, b.y + 36); g.lineTo(x0 + 3, b.y + 39); g.stroke(); } } }
    text(g, '14 steps · 6 apps', b.x + 10, b.y + 92, 6.6, 800, INK); fillRR(g, b.x + 80, b.y + 87, 50, 4, 2, '#E3E8EF'); fillRR(g, b.x + 80, b.y + 87, 50 * (dk ? dp : 1), 4, 2, C.sg);
  }
  function tvLive(g, t, S) {
    var tv = T.tv, pg = S.hot === 'training' ? Math.floor((t - (S.tT || 0)) / 1.1) % 3 : Math.floor(t / 3) % 3; fillRR(g, tv.x, tv.y, tv.w, tv.h, 2, '#FFFFFF');
    text(g, 'TRAINING · SALES', tv.x + 5, tv.y + 10, 5.4, 800, C.blueD); ['#3167CA', '#14A38B', '#714B67'].forEach(function (c, i) { fillRR(g, tv.x + 6 + i * 24, tv.y + 15, 19, 19, 3, i <= pg ? c : '#E3E8EF'); });
    text(g, ['Quote', 'Deliver', 'Invoice'][pg], tv.x + 6, tv.y + 44, 5.6, 800, INK); fillRR(g, tv.x + 6, tv.y + 47, tv.w - 12, 3, 1.5, '#E3E8EF'); fillRR(g, tv.x + 6, tv.y + 47, (tv.w - 12) * (pg + 1) / 3, 3, 1.5, C.sg);
  }
  function paintLive(g, t, now, S) {
    CO.crew(CREW, g, t, S, false);
    liftLive(g, t, S);
    /* the wall clock on Singapore time; tapped, its hands spin once round */
    var ck = T.clock, ct = t - (S.toy.clock != null ? S.toy.clock : -9); g.save(); if (ct < 1.2) { g.translate(ck.x, ck.y); g.rotate(Math.sin(ct * 20) * 0.08 * (1.2 - ct)); g.translate(-ck.x, -ck.y); } CO.clock(g, ck.x, ck.y, 22, 8, C.blue); g.restore();
    text(g, 'SGT', ck.x, ck.y + 36, 8, 800, '#FFFFFF', 'center');
    /* the logo's plane: tapped, it takes off, loops the room and lands back on the wall */
    var lt = t - LOGO.t; if (lt < 3.4) { var u = lt / 3.4, a = u * Math.PI * 2, px = 142 + Math.sin(a) * 380, py = 46 - Math.sin(a * 0.5) * 120 - Math.sin(a) * 30; g.save(); g.globalAlpha = 0.95;
      CO.plane(g, px, py, 3.2, Math.cos(a) * 0.6, '#FFFFFF', '#2E63C4'); g.strokeStyle = 'rgba(255,255,255,.6)'; g.setLineDash([4, 6]); g.lineWidth = 2; g.beginPath(); g.moveTo(px - 30, py + 10); g.lineTo(px - 90, py + 30); g.stroke(); g.setLineDash([]); g.restore(); }
    boardLive(g, t, S); tvLive(g, t, S);
    /* the coffee machine: a steady steam; tapped, a cup pours */
    var cf = T.coffee, br = t - (S.toy.coffee != null ? S.toy.coffee : -9); fillRR(g, cf.x + cf.w / 2 - 8, cf.y + 50, 16, 18, 3, '#FFFFFF');
    if (br < 2.6) { g.fillStyle = '#6B4329'; g.fillRect(cf.x + cf.w / 2 - 1.5, cf.y + 39, 3, Math.min(12, br * 18)); fillRR(g, cf.x + cf.w / 2 - 6, cf.y + 66 - Math.min(12, br * 5), 12, Math.min(12, br * 5), 2, '#8A5A3B'); }
    fillE(g, cf.x + cf.w - 16, cf.y + 16, 3, 3, Math.floor(t * 1.5) % 2 ? '#7FE3C4' : '#3A4458');
    COL.steam(g, cf.x + cf.w / 2, cf.y + 46, t, br < 2.6 ? 0.85 : 0.4, 3);
    if (S.ext.r > 1440) COL.draw([XS[0]], g, t, S);
    if (S.ext.r > 880) COL.draw(XS.slice(1), g, t, S);
  }
  /* the props in the cast's hands, and the glass of the Discovery Room over everyone inside it */
  function handsLive(g, t, S) {
    var d = T.desk, si = t - (S.toy.signin != null ? S.toy.signin : -9), ps = t - SG.pass;
    fillRR(g, d.x + 179, d.y - 37, 40, 28, 2, si < 3 ? '#E6F6F2' : '#FFFFFF'); text(g, si < 3 ? 'WELCOME!' : 'SIGN IN', d.x + 199, d.y - 19, 6, 800, si < 3 ? '#0E7A50' : C.blueD, 'center');
    if (si < 3) { var py = Math.min(1, si * 1.6); g.save(); g.translate(d.x + 236, d.y - 10 - py * 40); g.rotate(-0.15); fillRR(g, -16, -20, 32, 42, 4, '#FFFFFF'); fillRR(g, -16, -20, 32, 10, 4, '#9AA6BC'); text(g, 'VISITOR', 0, -12, 5, 800, INK, 'center'); fillRR(g, -9, -4, 10, 12, 2, '#C9D6EE'); g.restore(); }
    /* the receptionist: the stamp, the visitor pass she prints, the bell */
    var rc = (t + 0.5) % 10; if (rc > 6.5 && rc < 8.5 && !(ps < 2) && !(t - SG.bell < 1.6)) { var hs = COL.hand(REC, 1); fillRR(g, hs[0] - 5, hs[1] - 14, 10, 12, 3, '#E0456B'); fillRR(g, hs[0] - 7, hs[1] - 3, 14, 5, 2, '#2A3550'); }
    if (ps < 2) { var hp = COL.hand(REC, 1), rise = COL.ease(ps / 0.5); g.save(); g.translate(hp[0] + 4, hp[1] - 18 * rise); g.rotate(0.08); fillRR(g, -14, -36, 28, 38, 3, '#FFFFFF'); fillRR(g, -14, -36, 28, 9, 3, '#9AA6BC'); text(g, 'VISITOR', 0, -29.5, 4.6, 800, INK, 'center'); fillRR(g, -8, -22, 9, 11, 2, '#C9D6EE'); g.fillStyle = '#AAB7CC'; g.fillRect(3, -20, 8, 2); g.fillRect(3, -15, 6, 2); g.restore(); }
    var bl = t - SG.bell; if (bl < 1.6) COL.bubble(g, d.x + 62, d.y - 22 - bl * 6, 'Ding!', COL.bell(bl / 1.6) * 2, C.blueD);
    /* the client's notepad and pen, and her water */
    var tb = T.table, hc = COL.hand(CLI, 1); fillRR(g, tb.x + 54, tb.y - 3, 34, 4, 1, '#FFFFFF'); g.fillStyle = '#C9D3E3'; g.fillRect(tb.x + 58, tb.y - 2, 22, 1.2);
    if (!(t - SG.eureka < 1.8) && !(t - SG.hi5 < 1.8)) COL.marker(g, hc[0], hc[1] - 6, 0.5, '#1B1F3B');
    var eu = t - SG.eureka; if (eu < 1.8) { var hd = COL.head(CLI); COL.bubble(g, hd[0], hd[1] - 46 * CLI.s - 8, eu < 0.7 ? '?' : '★ Aha!', 2 * COL.bell(eu / 1.8), eu < 0.7 ? C.blue : '#B8860B', '#FFFFFF', eu < 0.7 ? 22 : 40); }
    /* the consultant's marker */
    var hm = COL.hand(CON, 0); COL.marker(g, hm[0], hm[1] - 4, -0.6, C.blue);
    /* the glass: panes over whoever is inside, the frame, the sliding door, the booking light */
    var rm = T.room, dr = t - (S.toy.door != null ? S.toy.door : -9), open = dr < 3 ? Math.min(1, dr * 2.2) * (dr > 2.4 ? (3 - dr) / 0.6 : 1) : 0;
    g.fillStyle = 'rgba(214,232,250,.2)'; g.fillRect(rm.x + 66, rm.y + 10, rm.w - 66, F - rm.y - 10);
    g.fillStyle = 'rgba(255,255,255,.32)'; [0, 1].forEach(function (k2) { var gx = rm.x + 110 + k2 * 100; g.beginPath(); g.moveTo(gx, F); g.lineTo(gx + 30, rm.y + 10); g.lineTo(gx + 42, rm.y + 10); g.lineTo(gx + 12, F); g.closePath(); g.fill(); });
    g.fillStyle = '#C9D1DD'; g.fillRect(rm.x - 4, rm.y - 4, rm.w + 8, 12); g.fillRect(rm.x + rm.w - 6, rm.y, 9, F - rm.y); g.fillRect(rm.x - 4, rm.y, 9, F - rm.y); g.fillRect(rm.x + 66, rm.y, 5, F - rm.y);
    g.fillStyle = 'rgba(255,255,255,.5)'; g.fillRect(rm.x + 71, 404, rm.w - 78, 14); g.fillStyle = 'rgba(49,103,202,.3)'; for (var fd = rm.x + 78; fd < rm.x + rm.w - 10; fd += 13) g.fillRect(fd, 408, 7, 7);
    var dx = rm.x + 5 + open * 56; g.fillStyle = 'rgba(214,232,250,.36)'; g.fillRect(dx, rm.y + 8, 61, F - rm.y - 8); fillRR(g, dx + 50, 300, 5, 40, 2, '#9AA6BC');
    var busy = S.hot === 'discovery' || S.hot === 'training'; fillRR(g, rm.x + rm.w / 2 - 66, 262, 132, 17, 8.5, 'rgba(255,255,255,.92)'); fillE(g, rm.x + rm.w / 2 - 54, 270.5, 3.6, 3.6, busy || dr < 3 ? '#E2453C' : '#2BC48A');
    text(g, busy ? 'WORKSHOP IN PROGRESS' : 'DISCOVERY ROOM · FREE', rm.x + rm.w / 2 + 6, 273, 5.8, 800, INK, 'center');
    /* the visitor's booking, held up */
    var bk = t - SG.booking; if (bk < 2) { var hv = COL.hand(VIS, 0), up = COL.ease(bk / 0.4); g.save(); g.globalAlpha = clamp((2 - bk) * 3, 0, 1); g.translate(hv[0] + 14, hv[1] - 40 * up); fillRR(g, -34, -46, 68, 50, 7, '#2A3550'); fillRR(g, -30, -42, 60, 42, 4, '#FFFFFF');
      fillRR(g, -30, -42, 60, 10, 3, C.blue); text(g, 'BOOKED', 0, -34.5, 5.4, 800, '#FFFFFF', 'center'); text(g, 'Discovery', 0, -20, 7, 800, INK, 'center'); text(g, '✓ Singapore HQ', 0, -9, 5.4, 800, '#0E7A50', 'center'); g.restore(); }
  }
  function paintFrontLive(g, t, S) {
    CO.crew(CREW, g, t, S, true); handsLive(g, t, S); CR.draw(g, t);
  }
  /* the sales lead's quotation and chart (he stands in front of the sofa, so these are drawn just before him) */
  function salesLive(g, t) {
    var q = t - SG.quote; if (q < 2.2) { var h = COL.hand(SAL, 1), up = COL.ease(q / 0.5), a = clamp((2.2 - q) * 3, 0, 1); g.save(); g.globalAlpha = a; g.translate(SAL.x + 10, SAL.y - 300 - 30 * up); g.rotate(-0.08 + Math.sin(q * 3) * 0.03);
      fillRR(g, -38, -46, 76, 92, 4, '#FFFFFF'); g.strokeStyle = '#DCE3EE'; g.lineWidth = 1; g.strokeRect(-38, -46, 76, 92); text(g, 'QUOTATION', -30, -32, 7, 800, C.blueD); g.fillStyle = '#C9D3E3'; for (var l = 0; l < 5; l++) g.fillRect(-30, -24 + l * 8, l % 2 ? 40 : 56, 2.4);
      if (q > 0.6) { var st = COL.ease((q - 0.6) / 0.25), sc = 1.6 - 0.6 * st; g.save(); g.translate(8, 26); g.rotate(-0.25); g.scale(sc, sc); g.globalAlpha = a * st; g.strokeStyle = '#E0456B'; g.lineWidth = 2; rr(g, -26, -9, 52, 18, 4); g.stroke(); text(g, 'FOLLOWS SCOPE', 0, 3, 5.6, 800, '#E0456B', 'center'); g.restore(); } g.restore(); }
    var c = t - SG.chart; if (c < 2) { var a2 = clamp((2 - c) * 3, 0, 1); g.save(); g.globalAlpha = a2; g.translate(SAL.x - 6, SAL.y - 296 - 16 * COL.ease(c / 0.4)); fillRR(g, -34, -30, 68, 52, 6, '#FFFFFF'); g.strokeStyle = '#DCE3EE'; g.lineWidth = 1; rr(g, -34, -30, 68, 52, 6); g.stroke();
      [0.4, 0.65, 0.5, 0.85].forEach(function (v, i) { var bh = v * 30 * COL.ease(clamp((c - i * 0.1) / 0.5, 0, 1)); fillRR(g, -26 + i * 14, 16 - bh, 10, bh, 2, ['#3167CA', '#14A38B', '#F2B233', '#714B67'][i]); }); text(g, 'pipeline · sample', 0, -20, 5.4, 800, '#5C5C73', 'center'); g.restore(); }
  }
  function FORE() {
    return [
      [700, function (g, ext, t) { salesLive(g, t); }],
      [740, function (g, ext) { var x = 572, y = 700; soft(g, x + 90, y + 44, 110, 8, 0.22); fillRR(g, x, y, 180, 12, 6, WOOD); fillRR(g, x + 8, y + 12, 164, 34, 8, '#F4EEE4'); g.fillStyle = WOODD; g.fillRect(x + 14, y + 12, 4, 34); g.fillRect(x + 162, y + 12, 4, 34);
        fillRR(g, x + 22, y - 12, 40, 12, 2, '#FFFFFF'); fillRR(g, x + 22, y - 12, 40, 4, 2, C.odoo); fillRR(g, x + 68, y - 10, 36, 10, 2, '#3167CA'); fillRR(g, x + 72, y - 14, 30, 5, 2, '#FFD84A'); COL.mug(g, x + 140, y, 1, '#FFFFFF', C.blue); fillRR(g, x + 110, y - 14, 16, 14, 3, '#FFFFFF'); [[-6, -20, -0.5], [0, -24, 0], [6, -20, 0.5], [-3, -17, -1], [4, -17, 1]].forEach(function (l) { g.beginPath(); g.ellipse(x + 118 + l[0], y - 14 + l[1] * 0.6, 3, 7, l[2], 0, 7); g.fillStyle = '#35AE70'; g.fill(); }); }],
      [636, function (g, ext) { if (ext.r > 960) { var x = 1004, y = 636; soft(g, x, y + 2, 44, 6, 0.22); g.strokeStyle = '#7A869C'; g.lineWidth = 4; g.lineCap = 'round'; g.beginPath(); g.moveTo(x - 30, y); g.lineTo(x - 10, y - 110); g.lineTo(x + 10, y - 110); g.lineTo(x + 30, y); g.stroke();
        fillRR(g, x - 30, y - 104, 60, 80, 5, INK); fillRR(g, x - 25, y - 99, 50, 70, 3, '#FFFFFF'); text(g, 'TODAY', x, y - 86, 6.4, 800, C.blue, 'center'); text(g, 'Discovery', x, y - 70, 7, 800, INK, 'center'); text(g, 'workshop', x, y - 60, 7, 800, INK, 'center');
        g.strokeStyle = '#E0456B'; g.lineWidth = 2.4; g.beginPath(); g.moveTo(x - 12, y - 44); g.lineTo(x + 12, y - 44); g.moveTo(x + 6, y - 49); g.lineTo(x + 12, y - 44); g.lineTo(x + 6, y - 39); g.stroke(); } }],
      [690.5, function (g, ext, t) { if (ext.r > 1300) COL.swayPlant(g, 1504, 690, t, 0.75, '#FFFFFF', '#E3E9F3', 3); }],
      [800, function (g, ext, t) { COL.swayPlant(g, -26, 806, t, 1.1, '#FFFFFF', '#E3E9F3', 1); if (ext.r > 1440) COL.swayPlant(g, 1880, 806, t, 1.1, C.blue, '#4F7FD8', 2); }]
    ];
  }

  window.IXW.worlds['office-sg'] = {
    pan: [-140, 900],
    paintBg: paintBg, windowBehind: true, paintFrame: paintFrame, paintBack: paintBack, paintFront: paintFront,
    paintWindow: function (g, t, par, S) { var ext = S.ext, span = Math.max(1200, ext.r - WALL + 300);
      for (var c = 0; c < 5; c++) { var x = WALL - 150 + ((K.hash(c + 4) * span + t * (4 + c * 1.6)) % span) - par * (2 + c); K.cloud(g, x, -120 + c * 30, 0.24 + K.hash(c) * 0.1); }
      /* the observation wheel turns; planes come in on the approach; boats on the bay */
      var wh = T.wheel, R = 54, rot = t * 0.05; g.strokeStyle = '#A8BDE0'; g.lineWidth = 3; g.beginPath(); g.arc(wh.x, wh.y, R, 0, 7); g.stroke(); g.lineWidth = 1.2;
      for (var s = 0; s < 12; s++) { var a = rot + s * Math.PI / 6, cx = wh.x + Math.cos(a) * R, cy = wh.y + Math.sin(a) * R; g.beginPath(); g.moveTo(wh.x, wh.y); g.lineTo(cx, cy); g.stroke(); fillRR(g, cx - 3.5, cy - 2.5, 7, 6, 2, s % 3 ? '#C9D8EF' : '#FFFFFF'); }
      fillE(g, wh.x, wh.y, 5, 5, '#A8BDE0'); g.lineWidth = 4; g.beginPath(); g.moveTo(wh.x - 30, 300); g.lineTo(wh.x, wh.y); g.lineTo(wh.x + 30, 300); g.stroke();
      var pl = (t * 26) % 1700, px = WALL + 1500 - pl, py = -96 + pl * 0.05; CO.plane(g, px, py, 1, -0.05, 'rgba(255,255,255,.95)');
      COL.birds(g, t, WALL, ext.r, -60, 4);
      for (var b = 0; b < 2; b++) { var bx = WALL + ((t * (5 + b * 2) + b * 380) % 900); fillRR(g, bx, 300 + b * 8, 24, 5, 2, '#FFFFFF'); fillRR(g, bx + 7, 295 + b * 8, 10, 5, 2, b ? '#E0456B' : '#3167CA'); } },
    paintLive: paintLive, paintFrontLive: paintFrontLive,
    paintForeLive: function (g, t, S) { K.zfore(g, t, S, FORE(), function () { CO.crew(CREW, g, t, S, 'fore'); }); CR.draw(g, t); },
    motes: false,
    glow: {
      welcome: function (g) { var d = T.desk; rr(g, d.x - 14, d.y - 50, d.w + 28, F - d.y + 56, 18); },
      discovery: function (g) { var b = T.board; rr(g, b.x - 8, b.y - 8, b.w + 16, b.h + 16, 10); },
      training: function (g) { var v = T.tv; rr(g, v.x - 10, v.y - 10, v.w + 20, v.h + 20, 10); },
      quote: function (g) { rr(g, SAL.x - 50, 300, 100, 176, 30); },
      onsite: function (g) { var l = T.lift; rr(g, l.x - 16, l.y - 54, l.w + 52, F - l.y + 58, 12); },
      partner: function (g) { var p = T.plaque; rr(g, p.x - 8, p.y - 8, p.w + 16, p.h + 16, 14); },
      coffee: function (g) { var c = T.coffee; rr(g, c.x - 10, c.y - 18, c.w + 20, 104, 12); },
      clock: function (g) { var c = T.clock; rr(g, c.x - 30, c.y - 30, 60, 76, 20); },
      door: function (g) { var r = T.room; rr(g, r.x - 4, r.y - 4, 76, F - r.y + 8, 8); },
      signin: function (g) { var d = T.desk; rr(g, d.x + 170, d.y - 46, 60, 46, 8); },
      logo: function (g) { rr(g, 96, -6, 262, 112, 20); }
    },
    backGlow: ['discovery', 'training', 'onsite', 'partner', 'coffee', 'clock', 'logo'],
    calmView: [112, -70, 820, 656],
    cast: [
      /* the receptionist: types, takes a call, stamps passes, waves; a tap prints a visitor pass or rings the bell */
      { id: 'rec', behind: true, keys: ['welcome'], P: REC, act: function (P, t, S) { var st = S.cast.rec, tp = COL.tap(st, t), c = (t + 0.5) % 10, k2 = Math.abs(Math.sin(t * 8)) * 6;
        COL.reset(P); P.talk = t < st.until; P.mood = P.talk || S.hot === 'welcome' ? 'happy' : 'calm'; var hands = [[-60, -200 - k2], [64, -200 - (6 - k2)]], look = 0.1;
        if (S.hot === 'welcome') { hands = [[-60, -200], [118 + Math.sin(t * 10) * 12, -380]]; look = clamp((S.nexi.x - P.x) / 160, -1, 1); }
        else if (c > 4 && c < 6.5) { hands = [[-74, -392], [64, -200]]; P.talk = true; look = 0.35; P.tilt = 0.05; }
        else if (c > 6.5 && c < 8.5) { hands = [[-60, -200], [64, -206 - Math.abs(Math.sin(t * 6)) * 40]]; look = 0.2; }
        else if (c > 8.5) { hands = [[-60, -200], [110 + Math.sin(t * 11) * 12, -360]]; look = -0.8; P.mood = 'happy'; }
        if (tp.n && tp.e < 2) { var u = tp.e / 2; P.talk = true; P.mood = 'happy';
          if (tp.n % 2) { hands = [[-60, -200], [70, -330]]; look = 0.3; if (SG.pt !== tp.n) { SG.pt = tp.n; SG.pass = t; CR.burst('spark', P.x + 30, P.y - 220, t); } }
          else { hands = [[-120, -210 - COL.bell(clamp(u / 0.3, 0, 1)) * 40], [64, -200]]; P.hop = u < 0.4 ? COL.bell(u / 0.4) * 10 : 0; look = -0.4; if (SG.bt !== tp.n) { SG.bt = tp.n; SG.bell = t; CR.burst('note', T.desk.x + 62, T.desk.y - 20, t); } } }
        P.hands = hands; P.look = lerp(P.look, look, K.ease(0.1)); } },
      /* the client: takes notes, nods, sips water; a tap is a question that turns into an aha, or applause (and a high-five) */
      { id: 'cli', behind: true, keys: ['discovery'], P: CLI, act: function (P, t, S) { var st = S.cast.cli, tp = COL.tap(st, t), c = (t + 3) % 8;
        COL.reset(P); P.talk = t < st.until; var hands = [[-60, -205], [60 + Math.sin(t * 7) * 6, -205 + Math.abs(Math.sin(t * 5)) * -6]], look = 0.7;
        if (S.hot === 'discovery') { hands = [[-60, -205 - Math.abs(Math.sin(t * 3)) * 10], [60, -205]]; P.mood = 'happy'; }
        else if (c > 5 && c < 6.4) { P.tilt = Math.sin((c - 5) * 9) * 0.06; P.mood = 'happy'; }
        else if (c > 6.4) { hands = [[-60, -205], [30, -320]]; look = 0.3; }
        var hi = t - SG.hi5; if (hi < 1.8) { hands = [[-60, -205], [lerp(60, 132, COL.ease(clamp(hi / 0.4, 0, 1))), lerp(-205, -372, COL.ease(clamp(hi / 0.4, 0, 1)))]]; look = 0.9; P.mood = 'happy'; P.talk = true; }
        if (tp.n && tp.e < 1.8) { var u = tp.e / 1.8; P.talk = true; P.mood = u < 0.4 ? 'calm' : 'happy';
          if (tp.n % 2) { hands = u < 0.4 ? [[-60, -205], [30, -320]] : [[-60, -205], [100, -400]]; look = 0.2; P.hop = u > 0.4 ? COL.bell((u - 0.4) / 0.6) * 10 : 0; if (SG.et !== tp.n) { SG.et = tp.n; SG.eureka = t; } }
          else { var cl = Math.abs(Math.sin(u * Math.PI * 7)); hands = [[-24 - cl * 26, -290], [24 + cl * 26, -290]]; look = 0; if (SG.ct !== tp.n) { SG.ct = tp.n; CR.burst('conf', P.x, P.y - 220, t); } } }
        P.hands = hands; P.look = lerp(P.look, look, K.ease(0.1)); } },
      /* the consultant: moves notes on the board, points, turns to the client; a tap draws the arrows or high-fives the client */
      { id: 'con', behind: true, keys: ['discovery', 'training'], P: CON, act: function (P, t, S) { var st = S.cast.con, tp = COL.tap(st, t), c = (t + 1) % 10, busy = S.hot === 'discovery';
        COL.reset(P); P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm'; var hands, look;
        if (busy) { hands = [[-140 + Math.sin(t * 3) * 16, -330], [62, -190]]; look = -0.8; }
        else if (c < 5) { hands = [[-150 + Math.sin(t * 2) * 30, -360 + Math.sin(t * 3.3) * 20], [62, -190]]; look = -0.85; }
        else if (c < 7.5) { var m = COL.ease((c - 5) / 2.5); hands = [[lerp(-170, -110, m), -380 + Math.sin(m * Math.PI) * -20], [62, -190]]; look = -0.85; }
        else { hands = [[-80, -170], [-30, -300]]; look = -0.9; P.mood = 'happy'; P.talk = true; }
        if (tp.n && tp.e < 1.8) { var u = tp.e / 1.8; P.talk = true; P.mood = 'happy';
          if (tp.n % 2) { hands = [[-170 + u * 120, -330 - Math.sin(u * Math.PI * 3) * 14], [62, -190]]; look = -0.85; if (SG.at !== tp.n) { SG.at = tp.n; SG.arrows = t; } }
          else { var r = COL.ease(clamp(u / 0.35, 0, 1)); hands = [[lerp(-80, -150, r), lerp(-170, -380, r)], [62, -190]]; look = -1; P.hop = u > 0.3 && u < 0.6 ? COL.bell((u - 0.3) / 0.3) * 10 : 0;
            if (SG.ht !== tp.n) { SG.ht = tp.n; SG.hi5 = t; } if (u > 0.33 && SG.hb !== tp.n) { SG.hb = tp.n; CR.burst('star', (P.x + CLI.x) / 2, 300, t); } } }
        P.hands = hands; P.look = lerp(P.look, look, K.ease(0.1)); } },
      /* the visitor: scrolls the tablet, checks the time, looks round; a tap is a happy bounce or the booking held up */
      { id: 'vis', behind: true, keys: [], P: VIS, act: function (P, t, S) { var st = S.cast.vis, tp = COL.tap(st, t), c = (t + 4) % 9;
        COL.reset(P); P.talk = t < st.until; var hands = [[-50, -200], [60, -176 + Math.sin(t * 2.4) * 6]], look = -0.3;
        if (c > 5 && c < 6.6) { look = -0.9; P.mood = 'calm'; }
        else if (c > 6.6) { hands = [[-50, -200], [10, -214]]; look = 0.4; P.tilt = 0.06; }
        if (tp.n && tp.e < 2) { var u = tp.e / 2; P.talk = true; P.mood = 'happy';
          if (tp.n % 2) { P.hop = Math.abs(Math.sin(u * Math.PI * 4)) * 14 * (1 - u); hands = [[-50, -200], [118 + Math.sin(t * 12) * 14, -390]]; look = 0.2; }
          else { hands = [[-30, -330], [60, -200]]; look = 0; if (SG.vt !== tp.n) { SG.vt = tp.n; SG.booking = t; CR.burst('spark', P.x, P.y - 230, t); } } }
        P.hands = hands; P.look = lerp(P.look, look, K.ease(0.08)); } },
      /* the sales lead: paces by the window with the tablet; a tap stamps a quotation or spins the pipeline chart */
      { id: 'sal', behind: false, keys: ['quote'], P: SAL, act: function (P, t, S) { var st = S.cast.sal, tp = COL.tap(st, t), c = (t + 6) % 11, busy = S.hot === 'quote';
        COL.reset(P); P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm'; var hands = [[-60, -215], [70, -150]], look = -0.5;
        P.x = 846 + (busy ? 0 : Math.sin(t * 0.45) * 12);
        if (c > 6 && c < 8.5 && !busy) { hands = [[-60, -215], [44, -366]]; P.talk = true; look = 0.3; }
        else if (c > 8.5 && !busy) { hands = [[-60, -215], [96, -260]]; look = -0.2; P.mood = 'happy'; }
        if (busy) { hands = [[-60, -215], [110, -300]]; look = clamp((S.nexi.x - P.x) / 160, -1, 1); }
        if (tp.n && tp.e < 2) { var u = tp.e / 2; P.talk = true; P.mood = 'happy';
          if (tp.n % 2) { hands = [[-60, -215], [lerp(70, 40, u), -300 - COL.bell(clamp((u - 0.3) / 0.2, 0, 1)) * 60]]; look = 0.1; if (SG.qt !== tp.n) { SG.qt = tp.n; SG.quote = t; } if (u > 0.4 && SG.qb !== tp.n) { SG.qb = tp.n; CR.burst('star', P.x + 10, P.y - 320, t); } }
          else { P.sx = Math.cos(COL.ease(clamp(u / 0.5, 0, 1)) * Math.PI * 2); P.hop = COL.bell(clamp(u / 0.5, 0, 1)) * 20; hands = [[-60, -260], [100, -300]]; if (SG.ch !== tp.n) { SG.ch = tp.n; SG.chart = t; } } }
        P.hands = hands; P.look = lerp(P.look, look, K.ease(0.1)); } }
    ],
    toy: function (name, S, t, btn) {
      if (name === 'clock' && btn) btn.setAttribute('data-say', CO.timeLine(8, 'Singapore', 'the same time as our Taguig City hub. Ho Chi Minh City is an hour behind.'));
      if (name === 'logo') LOGO.t = t;
      if (name === 'coffee') CR.burst('heart', T.coffee.x + T.coffee.w / 2, T.coffee.y + 20, t);
    },
    hit: function (x, y, S, t) { var r = CR.hitWalker(x, y, t); if (r) return r; return COL.hit(XS, x, y, t); },
    onStop: function (key, S, t) { if (key === 'discovery') S.dT = t; if (key === 'training') S.tT = t; if (key === 'onsite') S.oT = t; }
  };
})(window.IXW && window.IXW.kit, window.CR, window.CO, window.COL);
