/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: life (/life) — Life at TechNext: the team's bright common area at mid-morning. Three tall windows, one per office
   (Singapore, Taguig City, Ho Chi Minh City) with their own skyline and a live clock each; the long communal table under
   them with two colleagues at work; the cork photo wall (polaroids per album, "coming soon" frames, a colleague pinning a
   new one), a film-strip garland, an instant camera on the fridge (tap: flash and a polaroid); a lanyard rack
   (the Employee Hub) over the blog shelf; the pantry with its coffee machine, upper cabinets and the fridge covered in
   event flyers (the next date comes from the events list); a "We're hiring" A-frame. Pendant lamps and hanging plants sway,
   a robot vacuum roams. Margins: a reading nook with a beanbag and "photos coming soon" frames on the left, a drinks
   corner on the right. Foreground: the sofa back, a side table, plants.
   Everyone has their own idle loop and tap choreography. All staff wear the blue TechNext ID; seated people show
   chair, legs and feet. */
(function (K, CR, CO, COL) {
  'use strict';
  if (!K || !CR || !CO || !COL) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed;
  var F = 470, INK = '#16302B', SAGE = '#3E8E7E', SAGE2 = '#5FB09D', BLUE = '#3167CA', OAK = '#D9B48A', OAK2 = '#B98E62', SUN = '#FFD25E', CORAL = '#F08A6C', PUR = '#714B67';
  var bell = COL.bell, ease = COL.ease;
  var WIN = [{ x: 146, cc: 'SG', name: 'SINGAPORE HQ', sky: 'skySG', off: 8, k: { mbs: 40, wheel: 10 } }, { x: 274, cc: 'PH', name: 'TAGUIG CITY', sky: 'skyPH', off: 8, k: { tall: 60 } }, { x: 402, cc: 'VN', name: 'HO CHI MINH CITY', sky: 'skyVN', off: 7, k: { landmark: 64, tulip: 20 } }];
  var WW = 118, WT = 34, WB = 236;
  var T = { table: { x: 170, y: 378, w: 340 }, board: { x: 536, y: 52, w: 160, h: 204 }, rack: { x: 712, y: 92 }, shelf: { x: 708, y: 210, w: 48 }, frame: { x: 662 },
    counter: { x: 772, y: 360 }, mach: { x: 800 }, fridge: { x: 930, w: 74 }, nook: { x: -780 }, drinks: { x: 1060 } };
  var ALB = [['Outings', '#3167CA'], ['Dinners', '#F08A6C'], ['Meetings', '#14A38B'], ['Office', '#714B67']];
  function setU(g, sx, sy, k) { g.translate(sx, sy); g.scale(k, k); }
  function extOf(W, H, k, sx, sy) { return { l: -(sx + 24) / k, r: (W - sx) / k, t: -(sy + 24) / k, b: (H - sy) / k }; }
  /* a polaroid: white frame, a "coming soon" face (no real photos yet), tape on top */
  function polaroid(g, x, y, rot, col, dev) { g.save(); g.translate(x, y); g.rotate(rot || 0); g.fillStyle = 'rgba(20,30,40,.14)'; g.fillRect(-12, -13, 26, 30);
    fillRR(g, -13, -15, 26, 30, 1.5, '#FFFFFF'); fillRR(g, -10, -12, 20, 18, 1, dev == null ? '#EEF4F2' : 'rgba(46,59,57,' + (0.85 - dev * 0.6).toFixed(2) + ')');
    g.strokeStyle = col; g.lineWidth = 1.2; g.beginPath(); g.arc(0, -3, 4, 0, 7); g.stroke(); fillRR(g, -3, -9.5, 6, 2.5, 1, col);
    fillRR(g, -7, 9, 14, 2, 1, '#C9D3D0'); g.fillStyle = 'rgba(255,230,128,.85)'; g.fillRect(-6, -18, 12, 6); g.restore(); }
  var EV = window.TN_EV; function nextEv() { try { return EV ? EV.upcoming(Date.now())[0] : null; } catch (e) { return null; } }
  var NX = { at: -1e9, e: null }; function nx() { var n = Date.now(); if (n - NX.at > 60000) { NX.at = n; NX.e = nextEv(); } return NX.e; }

  /* ------------------------------------------------------------ the room (cached) */
  function paintBg(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    /* the sky behind the three windows */
    CO.sky(g, e, e.t, WB, [[0, '#8CC8F0'], [0.7, '#CFE9FA'], [1, '#EEF8FD']]);
    g.restore();
  }
  function paintFrame(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    /* the skylines, painted into their windows here (static); the clouds drift live behind the glass */
    WIN.forEach(function (w) { g.save(); g.beginPath(); g.rect(w.x, WT, WW, WB - WT); g.clip(); CO[w.sky](g, w.x - 20, w.x + WW + 20, WB - 20, WB, w.k); g.restore(); });
    /* the wall: soft sage with a cut-out for each window */
    g.save(); g.beginPath(); g.rect(e.l, e.t, e.r - e.l, F - e.t); WIN.forEach(function (w) { g.rect(w.x + WW, WT, -WW, WB - WT); }); g.clip('evenodd');
    var wg = g.createLinearGradient(0, e.t, 0, F); wg.addColorStop(0, '#F4FAF6'); wg.addColorStop(1, '#E2EFE8'); g.fillStyle = wg; g.fillRect(e.l, e.t, e.r - e.l, F - e.t);
    /* a ceiling band with a wood-slat soffit */
    g.fillStyle = '#FFFFFF'; g.fillRect(e.l, e.t, e.r - e.l, -120 - e.t); g.fillStyle = OAK; for (var sl = Math.floor(e.l / 18) * 18; sl < e.r; sl += 18) g.fillRect(sl, -150, 10, 30); g.fillStyle = 'rgba(0,0,0,.06)'; g.fillRect(e.l, -120, e.r - e.l, 4);
    /* wainscot: oak boards to the dado rail */
    g.fillStyle = '#E9DCC8'; g.fillRect(e.l, 300, e.r - e.l, F - 300); g.fillStyle = 'rgba(150,110,70,.12)'; for (var wb = Math.floor(e.l / 26) * 26; wb < e.r; wb += 26) g.fillRect(wb, 300, 2, F - 300);
    g.fillStyle = OAK2; g.fillRect(e.l, 296, e.r - e.l, 6);
    /* a big painted TechNext plane and dotted flight path on the wall, right side */
    g.strokeStyle = 'rgba(62,142,126,.25)'; g.lineWidth = 3; g.setLineDash([2, 9]); g.lineCap = 'round'; g.beginPath(); g.moveTo(1010, 260); g.bezierCurveTo(1100, 120, 1200, 260, 1300, 90); g.stroke(); g.setLineDash([]);
    CO.plane(g, 1310, 84, 2.2, -0.4, 'rgba(49,103,202,.35)');
    g.restore();
    /* the window frames, sills and labels */
    WIN.forEach(function (w, i) { g.strokeStyle = '#FFFFFF'; g.lineWidth = 8; g.strokeRect(w.x - 2, WT - 2, WW + 4, WB - WT + 4); g.lineWidth = 4; g.beginPath(); g.moveTo(w.x + WW / 2, WT); g.lineTo(w.x + WW / 2, WB); g.moveTo(w.x, 140); g.lineTo(w.x + WW, 140); g.stroke();
      g.fillStyle = 'rgba(255,255,255,.2)'; g.beginPath(); g.moveTo(w.x + 10, WB); g.lineTo(w.x + 40, WT); g.lineTo(w.x + 54, WT); g.lineTo(w.x + 24, WB); g.closePath(); g.fill();
      fillRR(g, w.x - 8, WB + 2, WW + 16, 10, 3, '#FFFFFF'); fillRR(g, w.x + 10, WB + 16, WW - 20, 18, 9, INK); text(g, w.name, w.x + WW / 2, WB + 28.5, 7, 800, SUN, 'center');
      fillRR(g, w.x + WW / 2 - 23, WT - 46, 46, 46, 23, '#FFFFFF'); });
    /* the floor: light oak planks, a soft rug under the table */
    var fl = g.createLinearGradient(0, F, 0, e.b); fl.addColorStop(0, '#EAD9C0'); fl.addColorStop(1, '#D9C2A2'); g.fillStyle = fl; g.fillRect(e.l, F, e.r - e.l, e.b - F);
    g.strokeStyle = 'rgba(150,110,70,.16)'; g.lineWidth = 1.5; g.beginPath(); for (var d = 1; d < 9; d++) { var yy = F + Math.pow(d / 8, 1.4) * (e.b - F); g.moveTo(e.l, yy); g.lineTo(e.r, yy); }
    for (var pk = 0; pk < 140; pk++) { var px = e.l + hash(pk) * (e.r - e.l), row = Math.floor(hash(pk + 7) * 8) + 1, py = F + Math.pow(row / 8, 1.4) * (e.b - F), py0 = F + Math.pow((row - 1) / 8, 1.4) * (e.b - F); g.moveTo(px, py0); g.lineTo(px, py); } g.stroke();
    g.fillStyle = 'rgba(80,60,40,.10)'; g.fillRect(e.l, F, e.r - e.l, 5);
    g.save(); g.translate(340, 520); g.scale(1, 0.2); fillE(g, 0, 0, 260, 200, '#CFE6DC'); g.lineWidth = 10; g.strokeStyle = SAGE2; g.setLineDash([26, 14]); g.beginPath(); g.ellipse(0, 0, 236, 180, 0, 0, 7); g.stroke(); g.setLineDash([]); g.restore();
    [[860, F + 60, 220], [-300, F + 60, 220]].forEach(function (p) { g.save(); g.globalAlpha = 0.4; fillE(g, p[0], p[1], p[2], 26, '#FFFFFF'); g.restore(); });
    g.restore();
  }
  function paintBack(g, ext) {
    /* the top of the wall: painted lettering over the windows, a long oak shelf with plants, books and the partner plaque */
    text(g, 'ONE TEAM · THREE OFFICES', 336, -48, 17, 800, 'rgba(22,48,43,.85)', 'center'); fillRR(g, 236, -38, 200, 4, 2, SUN);
    fillRR(g, 540, -6, 470, 8, 3, OAK2); fillRR(g, 540, -10, 470, 6, 3, OAK);
    [[560, '#FFFFFF'], [990, SAGE]].forEach(function (pp) { fillRR(g, pp[0] - 12, -32, 24, 22, 4, pp[1]); for (var lf = 0; lf < 5; lf++) { g.save(); g.translate(pp[0], -32); g.rotate(-1.1 + lf * 0.55); fillE(g, 0, -14, 5, 14, lf % 2 ? '#3FBF7F' : '#35AE70'); g.restore(); } });
    for (var bk2 = 0; bk2 < 7; bk2++) fillRR(g, 590 + bk2 * 9, -40 + (bk2 % 3) * 2, 7, 30 - (bk2 % 3) * 2, 1.5, [BLUE, '#14A38B', CORAL, PUR, SUN, SAGE, '#2A3550'][bk2]);
    shadowed(g, 6, 2, 0.18, function () { fillRR(g, 680, -52, 110, 40, 5, '#FFFFFF'); }); fillE(g, 700, -32, 10, 10, PUR); fillE(g, 700, -32, 4, 4, '#FFFFFF'); text(g, 'Odoo Ready', 714, -34, 9, 800, PUR); text(g, 'Partner', 714, -23, 9, 800, PUR);
    fillRR(g, 812, -44, 40, 34, 3, OAK2); fillRR(g, 816, -40, 32, 26, 2, '#F7FBF9'); CO.plane(g, 832, -27, 0.9, 0, BLUE);
    fillRR(g, 870, -40, 28, 30, 3, '#FFFFFF'); COL.mug(g, 925, -10, 1.2, CORAL); fillRR(g, 946, -36, 24, 26, 12, '#2E3B39'); fillE(g, 958, -23, 7, 7, SUN);
    /* the cork photo wall: an oak frame, four album labels; the polaroids are live */
    var b = T.board; shadowed(g, 12, 5, 0.2, function () { fillRR(g, b.x - 4, b.y - 4, b.w + 8, b.h + 8, 6, OAK2); }); fillRR(g, b.x, b.y, b.w, b.h, 4, '#D9B48A');
    g.fillStyle = 'rgba(120,80,40,.18)'; for (var ck = 0; ck < 220; ck++) g.fillRect(b.x + hash(ck) * b.w, b.y + hash(ck + 50) * b.h, 2, 2);
    fillRR(g, b.x + 20, b.y - 16, b.w - 40, 22, 11, INK); text(g, 'OUR PHOTO WALL', b.x + b.w / 2, b.y - 1.5, 8.6, 800, SUN, 'center');
    var cw = (b.w - 10) / 4; ALB.forEach(function (s, i) { var x = b.x + 5 + i * cw; fillRR(g, x + 3, b.y + 10, cw - 6, 12, 6, s[1]); text(g, s[0].toUpperCase(), x + cw / 2, b.y + 18.6, 5, 800, '#FFFFFF', 'center'); });
    /* a tripod camera beside the wall */
    g.strokeStyle = '#3A4744'; g.lineWidth = 3; g.lineCap = 'round'; g.beginPath(); g.moveTo(b.x - 14, 262); g.lineTo(b.x - 30, 300); g.moveTo(b.x - 14, 262); g.lineTo(b.x + 2, 300); g.moveTo(b.x - 14, 262); g.lineTo(b.x - 14, 300); g.stroke(); fillRR(g, b.x - 32, 242, 36, 22, 4, '#2A3142'); fillE(g, b.x - 14, 253, 7, 7, '#5C7A9E'); fillE(g, b.x - 16, 251, 2, 2, '#FFFFFF'); fillRR(g, b.x - 28, 238, 9, 5, 2, '#2A3142');
    /* the lanyard rack (Employee Hub) and the blog shelf */
    var r = T.rack; fillRR(g, r.x - 4, r.y, 52, 10, 3, OAK2); text(g, 'TEAM', r.x + 22, r.y - 4, 6.5, 800, INK, 'center');
    for (var h = 0; h < 4; h++) { var hx = r.x + 4 + h * 12; fillE(g, hx, r.y + 12, 2, 2, '#7A869C'); g.strokeStyle = BLUE; g.lineWidth = 2; g.beginPath(); g.moveTo(hx - 3, r.y + 12); g.lineTo(hx - 1, r.y + 60 + (h % 2) * 8); g.moveTo(hx + 3, r.y + 12); g.lineTo(hx + 1, r.y + 60 + (h % 2) * 8); g.stroke();
      fillRR(g, hx - 6, r.y + 58 + (h % 2) * 8, 12, 16, 2, '#FFFFFF'); fillRR(g, hx - 6, r.y + 58 + (h % 2) * 8, 12, 4, 2, BLUE); fillE(g, hx, r.y + 67 + (h % 2) * 8, 2.5, 2.5, '#C9D6EE'); }
    var sh = T.shelf; soft(g, sh.x + sh.w / 2, F + 4, 40, 6, 0.25); fillRR(g, sh.x, sh.y, sh.w, F - sh.y, 4, '#FFFFFF'); g.strokeStyle = OAK2; g.lineWidth = 3; rr(g, sh.x, sh.y, sh.w, F - sh.y, 4); g.stroke();
    fillRR(g, sh.x, sh.y, sh.w, 16, 4, SAGE); text(g, 'BLOG', sh.x + sh.w / 2, sh.y + 11.5, 8, 800, '#FFFFFF', 'center');
    for (var s = 0; s < 4; s++) { var sy = sh.y + 56 + s * 58; fillRR(g, sh.x + 2, sy, sh.w - 4, 4, 1, OAK);
      for (var m = 0; m < 3; m++) { var mcol = [BLUE, '#14A38B', CORAL, PUR, SUN][(s + m) % 5]; g.save(); g.translate(sh.x + 9 + m * 14, sy); g.rotate(m === 2 ? 0.12 : 0); fillRR(g, -5, -34, 11, 34, 1.5, mcol); fillRR(g, -3, -28, 7, 2, 1, 'rgba(255,255,255,.7)'); g.restore(); } }
    /* a "coming soon" photo frame by the photo wall */
    var fr = T.frame; shadowed(g, 8, 3, 0.16, function () { fillRR(g, fr.x - 2, 272, 40, 30, 3, OAK2); }); fillRR(g, fr.x + 2, 276, 32, 22, 2, '#F7FBF9');
    g.strokeStyle = '#9AA6BC'; g.lineWidth = 1; g.setLineDash([2, 2]); g.strokeRect(fr.x + 5, 279, 26, 16); g.setLineDash([]); text(g, 'PHOTO', fr.x + 18, 286, 4.6, 800, '#7A869C', 'center'); text(g, 'SOON', fr.x + 18, 292, 4.6, 800, '#7A869C', 'center');
    /* the pantry: upper cabinets, the backsplash, the fridge */
    var c = T.counter; fillRR(g, c.x, 70, 150, 80, 4, '#FFFFFF'); g.strokeStyle = '#DCE6E2'; g.lineWidth = 2; for (var cb = 0; cb < 3; cb++) { rr(g, c.x + 4 + cb * 49, 74, 45, 72, 3); g.stroke(); fillRR(g, c.x + 22 + cb * 49, 134, 10, 3, 1.5, OAK2); }
    fillRR(g, c.x - 4, 66, 158, 6, 2, OAK);
    g.fillStyle = '#FFFFFF'; g.fillRect(c.x, 180, 158, c.y - 180); g.strokeStyle = 'rgba(62,142,126,.18)'; g.lineWidth = 1; g.beginPath(); for (var ty = 180; ty < c.y; ty += 14) { g.moveTo(c.x, ty); g.lineTo(c.x + 158, ty); } for (var tx = c.x; tx < c.x + 158; tx += 22) { g.moveTo(tx + ((Math.floor((tx - c.x) / 22)) % 2) * 0, 180); g.lineTo(tx, c.y); } g.stroke();
    /* a shelf with jars and a menu card on the backsplash */
    fillRR(g, c.x + 70, 220, 84, 5, 2, OAK2); [[c.x + 80, '#F2C66B'], [c.x + 98, '#9FD6C2'], [c.x + 116, '#E8B4A0'], [c.x + 134, '#C9D6EE']].forEach(function (j) { fillRR(g, j[0] - 6, 200, 12, 20, 3, 'rgba(255,255,255,.9)'); fillRR(g, j[0] - 5, 206, 10, 13, 2, j[1]); fillRR(g, j[0] - 6, 197, 12, 4, 2, OAK); });
    var fd = T.fridge; soft(g, fd.x + fd.w / 2, F + 4, 50, 7, 0.25); shadowed(g, 10, 4, 0.18, function () { fillRR(g, fd.x, 120, fd.w, F - 120, 8, '#F4F7F6'); });
    g.strokeStyle = '#D5DEDB'; g.lineWidth = 2; g.beginPath(); g.moveTo(fd.x + 2, 240); g.lineTo(fd.x + fd.w - 2, 240); g.stroke(); fillRR(g, fd.x + 6, 160, 4, 60, 2, '#B9C6C2'); fillRR(g, fd.x + 6, 260, 4, 80, 2, '#B9C6C2');
    text(g, 'EVENTS', fd.x + fd.w / 2 + 4, 132, 7, 800, PUR, 'center');
    /* the coffee machine (its lights and steam are live) */
    var mc = T.mach.x; fillRR(g, mc - 24, 288, 48, 64, 6, '#2E3B39'); fillRR(g, mc - 20, 294, 40, 16, 3, '#46605A'); fillRR(g, mc - 6, 314, 12, 10, 2, '#9AA6BC'); fillRR(g, mc - 18, 336, 36, 6, 2, '#5C6B68');
    /* plants and a floor lamp */
    K.plant(g, { x: 140, y: F }, '#FFFFFF', '#DCE6E2'); K.plant(g, { x: 1012, y: F }, SAGE, SAGE2);
    /* ---- left margin: the reading nook ---- */
    var n = T.nook.x; if (ext.l < n + 300) {
      fillRR(g, n - 40, 60, 300, 200, 8, '#FFFFFF'); fillRR(g, n - 40, 60, 300, 26, 8, SAGE); text(g, 'OUR MOMENTS · COMING SOON', n + 110, 78, 9, 800, '#FFFFFF', 'center');
      for (var pf = 0; pf < 4; pf++) { var fx = n - 24 + (pf % 2) * 140, fy = 98 + Math.floor(pf / 2) * 80, fw = 128, fh = 68; fillRR(g, fx, fy, fw, fh, 4, '#F4FAF6'); g.strokeStyle = '#9AA6BC'; g.lineWidth = 1.5; g.setLineDash([5, 4]); g.strokeRect(fx + 6, fy + 6, fw - 12, fh - 12); g.setLineDash([]);
        text(g, 'Team photo', fx + fw / 2, fy + fh / 2, 8, 800, '#7A869C', 'center'); text(g, 'coming soon', fx + fw / 2, fy + fh / 2 + 11, 6.5, 700, '#9AA6BC', 'center'); }
      soft(g, n + 110, F + 4, 140, 10, 0.25); fillRR(g, n - 20, 330, 120, F - 330, 8, '#FFFFFF'); g.strokeStyle = OAK2; g.lineWidth = 3; rr(g, n - 20, 330, 120, F - 330, 8); g.stroke();
      soft(g, -620, F + 4, 70, 8, 0.3); fillE(g, -620, 446, 64, 30, '#F08A6C'); fillE(g, -628, 432, 46, 22, '#F5A88F'); fillE(g, -600, 424, 18, 8, 'rgba(255,255,255,.25)');
      for (var bs = 0; bs < 2; bs++) for (var bk = 0; bk < 6; bk++) fillRR(g, n - 12 + bk * 18, 340 + bs * 64, 12, 52, 2, [BLUE, '#14A38B', CORAL, PUR, SUN, SAGE][(bk + bs * 2) % 6]); }
    /* ---- right margin: the drinks corner ---- */
    var dr = T.drinks.x; if (ext.r > dr - 40) {
      fillRR(g, dr, 300, 150, F - 300, 6, '#FFFFFF'); fillRR(g, dr - 4, 294, 158, 10, 3, OAK); fillRR(g, dr + 10, 160, 130, 120, 6, '#F4F7F6'); g.strokeStyle = '#DCE6E2'; g.lineWidth = 2; rr(g, dr + 10, 160, 130, 120, 6); g.stroke();
      for (var dy = 0; dy < 3; dy++) for (var dx = 0; dx < 5; dx++) fillRR(g, dr + 20 + dx * 24, 172 + dy * 36, 14, 28, 4, ['#9FD6C2', '#F2C66B', '#E8B4A0', '#C9D6EE', '#F7C3D0'][(dx + dy) % 5]);
      text(g, 'DRINKS', dr + 75, 152, 9, 800, INK, 'center'); }
  }
  function paintFront(g, ext) {
    /* the communal table: oak top, white legs; laptops and a fruit bowl live in paintFrontLive */
    var t = T.table; soft(g, t.x + t.w / 2, F + 4, t.w * 0.55, 10, 0.3); fillRR(g, t.x, t.y, t.w, 12, 4, OAK); fillRR(g, t.x, t.y + 10, t.w, 4, 2, OAK2);
    [t.x + 14, t.x + t.w - 22].forEach(function (lx) { fillRR(g, lx, t.y + 12, 8, F - t.y - 12, 3, '#FFFFFF'); });
    fillRR(g, t.x + t.w / 2 - 4, t.y + 12, 8, F - t.y - 12, 3, '#FFFFFF');
    /* the pantry counter */
    var c = T.counter; fillRR(g, c.x - 6, c.y - 6, 164, 12, 4, '#F4EEE4'); fillRR(g, c.x, c.y + 4, 152, F - c.y - 4, 4, SAGE); g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 2;
    for (var dd = 0; dd < 3; dd++) { rr(g, c.x + 6 + dd * 49, c.y + 14, 43, F - c.y - 22, 3); g.stroke(); fillRR(g, c.x + 22 + dd * 49, c.y + 22, 12, 3, 1.5, '#FFFFFF'); }
    /* the hiring A-frame */
    var ax = 678; g.strokeStyle = OAK2; g.lineWidth = 4; g.beginPath(); g.moveTo(ax - 22, F); g.lineTo(ax - 8, 380); g.moveTo(ax + 22, F); g.lineTo(ax + 8, 380); g.stroke();
    shadowed(g, 8, 3, 0.25, function () { fillRR(g, ax - 26, 382, 52, 66, 4, '#2F3A37'); }); fillRR(g, ax - 23, 385, 46, 60, 3, '#38463F');
    text(g, "WE'RE", ax, 400, 8, 800, SUN, 'center'); text(g, 'HIRING', ax, 411, 8, 800, SUN, 'center'); text(g, '6 roles', ax, 425, 6.5, 700, '#FFFFFF', 'center'); text(g, 'Taguig City', ax, 435, 5.6, 700, 'rgba(255,255,255,.75)', 'center');
    /* the fridge door handle shine and its magnets (the flyers are live) */
  }
  function paintFore(g, ext) {
    /* the sofa back and a side table in the foreground */
    soft(g, 880, 724, 170, 10, 0.3); fillRR(g, 730, 640, 300, 80, 26, '#7FB7A9'); fillRR(g, 740, 630, 280, 30, 14, '#93C6B9');
    [[770, CORAL], [990, SUN]].forEach(function (cu) { g.save(); g.translate(cu[0], 618); g.rotate(cu[0] > 900 ? 0.15 : -0.15); fillRR(g, -26, -22, 52, 44, 12, cu[1]); g.restore(); });
    soft(g, 600, 722, 50, 6, 0.3); fillE(g, 600, 668, 44, 9, OAK); fillRR(g, 596, 672, 8, 46, 3, '#FFFFFF'); fillE(g, 600, 716, 24, 5, '#E9DCC8'); COL.mug(g, 586, 664, 1.1, '#FFFFFF', BLUE);
    fillRR(g, 604, 650, 26, 16, 2, '#FFFFFF'); fillRR(g, 604, 650, 26, 5, 2, SAGE);
    K.plant(g, { x: 1090, y: 730 }, '#FFFFFF', '#DCE6E2'); K.plant(g, { x: -40, y: 730 }, SAGE, SAGE2); K.plant(g, { x: 470, y: 730 }, OAK, OAK2);
  }

  /* ------------------------------------------------------------ the cast */
  var W = CR.who;
  var BAR = W({ x: 858, y: 470, s: 0.5, ph: 0.5, skin: 1, hair: 0, style: 'bun', outfit: 'cardigan', top: SAGE2, top2: '#FFFFFF', hands: [[-80, -220], [60, -210]], look: -0.5 });
  var DEV = W({ x: 236, y: 470, s: 0.48, ph: 1.6, skin: 2, hair: 1, style: 'short', outfit: 'polo', top: BLUE, top2: '#FFFFFF', glasses: true, sit: true, chairCol: OAK2, hands: [[-40, -214], [60, -214]], look: 0.3 });
  var DES = W({ x: 438, y: 470, s: 0.48, ph: 2.7, skin: 0, hair: 2, style: 'long', outfit: 'shirt', top: '#F7C3D0', top2: '#FFFFFF', sit: true, chairCol: OAK2, hands: [[-60, -214], [40, -214]], look: -0.3 });
  var PM = W({ x: 596, y: 470, s: 0.5, ph: 3.3, skin: 3, hair: 0, style: 'short', outfit: 'shirt', top: '#FFFFFF', top2: SAGE, hands: [[-70, -200], [70, -200]], look: -0.6 });
  var CREW = [
    { front: true, x0: -360, x1: 120, y: 670, spd: 14, ph: 0.2, label: 'TechNext consultant', lines: ['Back from a **discovery** workshop!', 'Our main development and consulting hub is in **Taguig City**.'], acts: ['wave', 'cheer', 'id'],
      P: W({ s: 0.58, skin: 2, hair: 0, style: 'pony', outfit: 'cardigan', top: CORAL, top2: '#FFFFFF', hold: 'tablet', hands: [[-60, -212], [70, -170]] }) },
    { x0: -900, x1: -420, y: 500, spd: 16, ph: 0.6, label: 'TechNext team', lines: ['Snacks for the **pantry**!', 'Same people from **discovery** to **support**.'], acts: ['dance', 'wave', 'jump'],
      P: W({ s: 0.5, skin: 4, hair: 1, style: 'short', outfit: 'polo', top: '#14A38B', hold: 'box', hands: [[-60, -212], [64, -216]] }) }
  ];
  /* the extras (drawn and tapped here): the reader in the nook and a colleague at the drinks corner */
  var XSC = [
    { P: W({ x: -620, y: 470, s: 0.5, ph: 0.9, skin: 1, hair: 3, style: 'bob', outfit: 'cardigan', top: '#7B5BD6', top2: '#FFFFFF', sit: true, chair: false, sitDrop: 120 }), hands: [[-40, -210], [40, -210]],
      box: [-620, 380, 110, 200], who: 'Reading the blog', role: 'TechNext · illustration', near: [-480, 100], pose: 'love', dur: [1.8, 1.6], fx: ['heart', 'spark'],
      lines: ['Reading the new **Odoo 20** guide on the blog.', 'The **InvoiceNow** dates are all in one article now.'],
      idle: function (P, t) { var c = (t + 2) % 8; P.look = 0.2; P.hands = [[-40, -220], [40, -220]]; if (c > 6) { P.hands = [[-40, -220], [40, -250]]; P.mood = 'happy'; P.tilt = 0.06; } },
      moves: [function (P, u) { P.hands = [[-40, -220], [110, -360]]; P.hop = bell(u) * 10; }, function (P, u, t) { P.tilt = Math.sin(t * 10) * 0.08; P.hands = [[-110, -360], [110, -360]]; }],
      after: function (g, P, t, S, X, u, k) { var a = COL.hand(P, 0), b = COL.hand(P, 1); if (u < 0 || k === 1) { g.save(); g.translate((a[0] + b[0]) / 2, Math.min(a[1], b[1]) + 2); fillRR(g, -14, -20, 28, 20, 3, '#2A3550'); fillRR(g, -12, -18, 24, 16, 2, '#E8F2FF'); fillRR(g, -10, -15, 14, 2, 1, SAGE); fillRR(g, -10, -11, 18, 1.6, 1, '#C9D3E3'); fillRR(g, -10, -8, 16, 1.6, 1, '#C9D3E3'); g.restore(); }
        if (u >= 0 && k === 0) COL.pop(g, P.x, P.y - 260, 'New guide!', u, SAGE); } },
    { P: W({ x: 1120, y: 470, s: 0.5, ph: 2.2, skin: 3, hair: 1, style: 'short', outfit: 'polo', top: SUN, top2: INK, hands: [[-70, -200], [70, -200]] }), hands: [[-70, -200], [70, -200]],
      box: [1120, 360, 90, 220], who: 'At the drinks corner', role: 'TechNext · illustration', near: [900, 60], pose: 'celebrate', dur: [1.6, 1.8], fx: ['spark', 'conf'],
      lines: ['Cheers! Good morning from the **pantry**.', 'Calamansi juice or iced coffee? Both!'],
      idle: function (P, t) { var c = (t + 1) % 7; P.look = c < 4 ? 0.8 : -0.6; P.hands = c < 4 ? [[-70, -200], [120, -300 + Math.sin(t * 2) * 6]] : [[-70, -200], [40, -300]]; if (c >= 4) P.mood = 'happy'; },
      moves: [function (P, u) { P.hands = [[-70, -200], [100, -400]]; P.hop = bell(u) * 14; }, function (P, u, t) { P.hands = [[-110, -380], [110, -380]]; P.hop = Math.abs(Math.sin(u * Math.PI * 3)) * 20; }],
      after: function (g, P, t, S, X, u, k) { var h = COL.hand(P, 1); COL.cup(g, h[0] + 2, h[1] + 4, 1.1, true); if (u >= 0 && k === 0) COL.pop(g, P.x, P.y - 270, 'Cheers!', u, SAGE); } }
  ];
  var LATTE = { t: -9 }, SPIN = { t: -9 }, FIVE = { t: -9 }, CLAP = { t: -9 }, BREW = { t: -9 }, RADIO = { t: -9 }, VAC = { ph: 120 };
  /* ---- the pantry colleague: idle, tamps and pulls a shot, then steams the milk; tapped, pours latte art (a heart) and offers the cup */
  function actBar(P, t, S) {
    var st = S.cast.bar, u = COL.tap(st, t).e; COL.reset(P, [[-80, -220], [60, -210]]);
    var c = (t + 0.5) % 7; P.talk = t < st.until; P._cup = 0; P._jug = 0;
    if (c < 2.5) { var tamp = Math.abs(Math.sin(t * 6)); P.hands = [[-120, -230 + tamp * 16], [-40, -200]]; P.look = -0.9; }
    else if (c < 4.5) { P.hands = [[-120, -214], [60, -210]]; P.look = -0.8; BREW.idle = 1; }
    else { P.hands = [[-60, -240], [30, -250 + Math.sin(t * 9) * 6]]; P.look = 0.2; P._jug = 1; P.mood = 'happy'; }
    if (S.hot === 'coffee') { P.hands = [[-120, -214], [60, -210]]; P.look = -0.9; }
    if (u < 2.6) { P.mood = 'happy'; P.talk = true; P._jug = 0;
      if (u < 1.3) { P.hands = [[-30, -230], [40, -270 + Math.sin(u * 10) * 4]]; P.look = 0; P._cup = 1; P._jug = 1; }
      else { P.hands = [[-80, -220], [150, -280]]; P._cup = 2; P.look = 0.7; P.hop = bell((u - 1.3) / 1.3) * 10; }
      if (u < 0.05 && LATTE.t < t - 1) { LATTE.t = t; } if (u > 1.3 && !st._h) { st._h = 1; CR.burst('heart', P.x + 60, P.y - 270, t); } }
    else st._h = 0;
    P._u = u;
  }
  /* ---- the developer: idle, types, sips coffee, stretches; tapped, spins round on the stool (code bursts) */
  function actDev(P, t, S) {
    var st = S.cast.dev, u = COL.tap(st, t).e, f5 = t - FIVE.t; COL.reset(P, [[-40, -214], [60, -214]]);
    var c = (t + 1.6) % 9; P.talk = t < st.until; P._mug = 0;
    if (c < 5) { var kk = Math.abs(Math.sin(t * 20)) * 8; P.hands = [[20, -214 - kk], [90, -214 - (8 - kk)]]; P.look = 0.6; }
    else if (c < 7) { P.hands = [[-40, -214], [30, -330]]; P._mug = 1; P.look = 0.2; P.tilt = -0.05; }
    else { P.hands = [[-90, -440], [90, -440]]; P.mood = 'happy'; P.tilt = Math.sin(t * 2) * 0.05; }
    if (f5 < 1.4) { P.hands = [[-40, -214], [150, -330 + Math.sin(f5 * 4) * 6]]; P.look = 1; P.mood = 'happy'; P.talk = true; }
    if (u < 1.6) { P.mood = 'happy'; P.talk = true; P.sx = Math.cos(ease(u / 1.2) * Math.PI * 2); P.hands = [[-110, -300], [110, -300]]; if (u < 0.05 && SPIN.t < t - 1) { SPIN.t = t; CR.burst('code', P.x, P.y - 260, t); } }
  }
  /* ---- the designer: idle, sketches on her tablet and laughs at the developer's jokes; tapped, a high-five across the table */
  function actDes(P, t, S) {
    var st = S.cast.des, u = COL.tap(st, t).e; COL.reset(P, [[-60, -214], [40, -214]]);
    var c = (t + 2.7) % 8; P.talk = t < st.until; P._pad = 1;
    if (c < 5) { P.hands = [[-60, -214], [10 + Math.sin(t * 5) * 14, -222 + Math.cos(t * 7) * 6]]; P.look = 0.1; }
    else { P.hands = [[-50, -240], [40, -240]]; P.mood = 'happy'; P.talk = true; P.look = -0.9; P.tilt = Math.sin(t * 12) * 0.05; }
    if (u < 1.6) { P._pad = 0; P.mood = 'happy'; P.talk = true; P.look = -1; P.hands = [[-150, -330 + Math.sin(u * 4) * 6], [40, -214]]; if (u < 0.05 && FIVE.t < t - 1) { FIVE.t = t; } if (u > 0.5 && !st._h) { st._h = 1; CR.burst('star', 337, 270, t); } } else st._h = 0;
  }
  /* ---- the colleague at the photo wall: idle, carries a polaroid to each album and pins it; tapped, claps and the albums light up one by one */
  function actPm(P, t, S) {
    var st = S.cast.pm, u = COL.tap(st, t).e; COL.reset(P, [[-70, -200], [70, -200]]);
    var c = (t + 3.3) % 10, b = T.board, cw = (b.w - 10) / 4; P.talk = t < st.until; P._note = -1;
    var col = Math.floor(c / 2.5), f = (c % 2.5) / 2.5, tx = b.x + 5 + (col + 0.5) * cw;
    P.x = 596 + Math.sin(t * 0.4) * 10;
    if (f < 0.7) { P._note = col; P._nf = f; var hx = (tx - P.x) / P.s, hy = (b.y + 80 + col * 18 - P.y) / P.s; P.hands = [[-70, -200], [clamp(hx, -150, 150), clamp(hy, -420, -150)]]; P.look = clamp(hx / 150, -1, 1); }
    else { P.hands = [[-70, -200], [60, -230]]; P.look = 0.6; P.mood = 'happy'; }
    if (S.hot === 'gallery') { P.hands = [[-150, -360], [70, -200]]; P.look = -0.8; P.talk = true; P._note = -1; }
    if (u < 2.4) { P._note = -1; P.mood = 'happy'; P.talk = true; var cl = Math.abs(Math.sin(u * 12)); P.hands = [[-30 - cl * 20, -270], [30 + cl * 20, -270]]; P.hop = cl * 4; if (u < 0.05 && CLAP.t < t - 1) CLAP.t = t; }
  }

  /* ------------------------------------------------------------ live layers */
  var CLOUDS = [[0, 60, 0.5], [180, 90, 0.4], [320, 70, 0.55], [460, 100, 0.45]];
  function paintWindow(g, t, par, S) {
    WIN.forEach(function (w, i) { g.save(); g.beginPath(); g.rect(w.x, WT, WW, WB - WT); g.clip();
      CLOUDS.forEach(function (c, j) { var x = w.x - 60 + ((c[0] + t * (4 + j) + i * 70) % (WW + 120)), y = c[1] + i * 4, s = c[2]; g.fillStyle = 'rgba(255,255,255,.92)'; g.beginPath(); g.ellipse(x, y, 40 * s, 10 * s, 0, 0, 7); g.ellipse(x + 16 * s, y - 8 * s, 22 * s, 11 * s, 0, 0, 7); g.fill(); });
      COL.birds(g, t + i * 3, w.x, w.x + WW, 70 + i * 6, 2, 'rgba(60,80,110,.5)');
      g.restore(); });
  }
  function paintLive(g, t, now, S) {
    /* the three window clocks */
    WIN.forEach(function (w) { CO.clock(g, w.x + WW / 2, WT - 23, 19, w.off, INK); });
    /* a film-strip garland under the soffit, frames swaying */
    for (var fl2 = 0; fl2 < 2; fl2++) { var x0 = fl2 ? 540 : 140, x1 = fl2 ? 1000 : 520, sw2 = Math.sin(t * 1.1 + fl2) * 2; g.strokeStyle = 'rgba(22,48,43,.4)'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(x0, -112); g.quadraticCurveTo((x0 + x1) / 2, -70 + sw2, x1, -112); g.stroke();
      for (var bl = 0; bl < 9; bl++) { var u = (bl + 0.5) / 9, bx = lerp(x0, x1, u), by = -112 + 4 * (21 + sw2 / 2) * u * (1 - u); g.save(); g.translate(bx, by); g.rotate(Math.sin(t * 1.4 + bl + fl2 * 3) * 0.06);
        fillRR(g, -13, 0, 26, 22, 1.5, '#2A3142'); g.fillStyle = '#F4F7F6'; for (var hl = 0; hl < 4; hl++) { g.fillRect(-11 + hl * 6.4, 1.5, 3, 2); g.fillRect(-11 + hl * 6.4, 18.5, 3, 2); }
        fillRR(g, -10, 5, 20, 12, 1, ['#CFE6F8', '#FFE6C2', '#D7EFE6', '#EBDDF0'][(bl + fl2) % 4]); g.restore(); } }
    /* pendant lamps and hanging plants sway */
    [[240, 0], [340, 1.3], [440, 2.6]].forEach(function (l) { var sw = Math.sin(t * 0.9 + l[1]) * 0.03; g.save(); g.translate(l[0], -120); g.rotate(sw); g.strokeStyle = '#6B7A76'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 150); g.stroke();
      g.fillStyle = SAGE; g.beginPath(); g.moveTo(-22, 172); g.quadraticCurveTo(0, 138, 22, 172); g.closePath(); g.fill(); fillE(g, 0, 172, 22, 4, '#2E6E61'); fillE(g, 0, 175, 9, 4, '#FFF2C8'); g.restore(); });
    COL.hangPlant(g, 1040, -120, 70, t, 1, 0.4); COL.hangPlant(g, 110, -120, 50, t, 1.1, 1.8); if (S.ext.l < -100) COL.hangPlant(g, -200, -120, 60, t, 1, 2.7);
    /* the photo wall's polaroids: two per album, "coming soon" until real photos arrive; one carried by the colleague */
    var b = T.board, cw = (b.w - 10) / 4, ct = t - CLAP.t;
    ALB.forEach(function (s, i) { var x = b.x + 5 + i * cw, lit = ct < 2.4 && ct > i * 0.35 && ct < i * 0.35 + 1.2; if (lit || S.hot === 'gallery') { g.save(); g.globalAlpha = lit ? 0.4 : 0.14 + 0.08 * Math.sin(t * 4 + i); fillRR(g, x + 1, b.y + 26, cw - 2, b.h - 30, 3, s[1]); g.restore(); }
      for (var n = 0; n < 3; n++) { if (PM._note === i && n === 2) continue; polaroid(g, x + cw / 2 + (n % 2 ? 3 : -3), b.y + 58 + n * 52, (hash(i * 3 + n) - 0.5) * 0.24, s[1]); } });
    /* the fridge: flyers and a calendar magnet with the next event's date (from the events list) */
    var fd = T.fridge, ev = nx(); COL.note(g, fd.x + 24, 170, 30, -0.08, '#FFE680', 'Odoo', INK); COL.note(g, fd.x + 54, 196, 26, 0.12, '#D6E4FF');
    g.save(); g.translate(fd.x + 38, 290); g.rotate(S.hot === 'events' ? Math.sin(t * 5) * 0.05 : -0.04); fillRR(g, -26, -30, 52, 58, 4, '#FFFFFF'); fillRR(g, -26, -30, 52, 14, 4, PUR); text(g, 'NEXT EVENT', 0, -20, 5.6, 800, '#FFFFFF', 'center');
    if (ev) { var dm = EV.dayMon(ev.date); text(g, String(dm[0]), 0, 6, 18, 800, INK, 'center'); text(g, dm[1].toUpperCase() + ' · ' + String(ev.where || '').toUpperCase(), 0, 18, 5.6, 800, PUR, 'center'); } else text(g, 'SOON', 0, 6, 11, 800, INK, 'center');
    g.restore(); fillE(g, fd.x + 38, 262, 3, 3, '#E2453C');
    /* an instant camera on the fridge (tap it: flash, and a polaroid slides out) */
    var rt = t - RADIO.t; if (rt < 2.6) { var pu = Math.min(1, rt / 0.9); polaroid(g, fd.x + 36, 96 - 26 * pu, 0, CORAL, pu); }
    fillRR(g, fd.x + 12, 92, 48, 30, 8, '#F7C3D0'); fillRR(g, fd.x + 12, 112, 48, 10, 4, '#E8A3B4'); fillE(g, fd.x + 36, 106, 10, 10, '#2A3142'); fillE(g, fd.x + 36, 106, 6, 6, '#5C7A9E'); fillE(g, fd.x + 34, 104, 2, 2, '#FFFFFF');
    fillRR(g, fd.x + 16, 96, 8, 5, 2, '#FFFFFF'); fillE(g, fd.x + 54, 96, 3, 3, CORAL);
    if (rt < 0.35) { g.save(); g.globalAlpha = (1 - rt / 0.35) * 0.9; fillE(g, fd.x + 20, 98, 30 + rt * 80, 30 + rt * 80, '#FFFFFF'); g.restore(); }
    if (rt < 2.6) COL.pop(g, fd.x + 36, 64, 'Say cheese!', rt / 2.6, CORAL);
    /* the coffee machine: lights, a drip and the steam */
    var mc = T.mach.x, bt = t - BREW.t, brewing = bt < 3 || ((t + 0.5) % 7 > 2.5 && (t + 0.5) % 7 < 4.5);
    fillE(g, mc - 12, 302, 2.5, 2.5, brewing ? '#7FE3C4' : '#2E8A6C'); fillE(g, mc - 4, 302, 2.5, 2.5, Math.floor(t * 2) % 2 ? SUN : '#8A6B2A');
    fillRR(g, mc - 8, 326, 16, 10, 2, '#FFFFFF'); if (brewing) { fillRR(g, mc - 1, 318 + ((t * 40) % 8), 2, 3, 1, '#6B4B2E'); g.save(); COL.steam(g, mc, 322, t, 0.6, 3); g.restore(); }
    if (bt < 3) COL.pop(g, mc, 278, 'Brewing...', bt / 3, '#2E3B39');
    /* the table: laptops beside the seated pair, mugs, a fruit bowl */
    var tb = T.table; COL.laptop(g, 292, tb.y, 0.9, 1, '#E8F2FF'); COL.mug(g, 200, tb.y, 0.9, '#FFFFFF', SAGE);
    fillE(g, 340, tb.y - 6, 22, 8, '#FFFFFF'); [[328, '#F2C66B'], [340, '#E8604C'], [352, '#7DC07A'], [334, '#F2C66B']].forEach(function (f, i) { fillE(g, f[0], tb.y - 12 - (i === 3 ? 6 : 0), 6, 6, f[1]); });
    COL.laptop(g, 384, tb.y, 0.9, 1, '#FFF2E8'); COL.mug(g, 480, tb.y, 0.9, CORAL);
    COL.steam(g, 200, tb.y - 18, t, 0.5, 2);
    /* the robot vacuum */
    COL.vac(g, VAC, t, 120, 700, 494, SAGE);
    COL.draw(XSC, g, t, S);
    CO.crew(CREW, g, t, S, false);
  }
  function paintFrontLive(g, t, S) {
    CO.crew(CREW, g, t, S, true);
    /* the pantry colleague's cup / milk jug, latte heart */
    var hb = COL.hand(BAR, 1); if (BAR._jug) { g.save(); g.translate(hb[0], hb[1] - 4); fillRR(g, -7, -14, 14, 18, 3, '#DCE3EE'); fillRR(g, -7, -14, 14, 4, 2, '#C9D2DE'); g.restore(); }
    if (BAR._cup) { var hc = COL.hand(BAR, BAR._cup === 2 ? 1 : 0); g.save(); g.translate(hc[0] + (BAR._cup === 2 ? 6 : 0), hc[1] + 2); COL.mug(g, 0, 0, 1.2, '#FFFFFF', SAGE); fillE(g, 0, -20, 8, 2.5, '#C79A6B');
      g.fillStyle = '#FFFFFF'; g.beginPath(); g.moveTo(0, -18); g.bezierCurveTo(-4, -21, -2, -24, 0, -22); g.bezierCurveTo(2, -24, 4, -21, 0, -18); g.fill(); g.restore(); if (BAR._cup === 2) COL.pop(g, BAR.x + 40, BAR.y - 300, 'Latte art!', (BAR._u - 1.3) / 1.3, SAGE); }
    /* the developer's mug, the designer's tablet */
    if (DEV._mug) { var hm = COL.hand(DEV, 1); COL.mug(g, hm[0], hm[1] + 6, 0.9, '#FFFFFF', BLUE); }
    if (DES._pad) { var a = COL.hand(DES, 0), b = COL.hand(DES, 1); g.save(); g.translate((a[0] + b[0]) / 2, Math.min(a[1], b[1]) + 6); g.rotate(-0.2); fillRR(g, -14, -10, 28, 18, 3, '#2A3550'); fillRR(g, -12, -8, 24, 14, 2, '#FFF7F9'); g.strokeStyle = CORAL; g.lineWidth = 1.2; g.beginPath(); g.moveTo(-8, 2); g.quadraticCurveTo(-2, -6 + Math.sin(t * 3) * 2, 8, 0); g.stroke(); g.restore(); }
    var f5 = t - FIVE.t; if (f5 < 1.4 && f5 > 0.4) { g.save(); g.globalAlpha = 1 - (f5 - 0.4); text(g, 'High five!', 337, 236, 10, 800, CORAL, 'center'); g.restore(); }
    /* the sticky note the project lead carries */
    if (PM._note >= 0) { var hp = COL.hand(PM, 1); polaroid(g, hp[0], hp[1] - 14, Math.sin(t * 3) * 0.1, ALB[PM._note][1]); }
    var ct = t - CLAP.t; if (ct < 2.4) COL.pop(g, PM.x, PM.y - 300, 'Pinned!', ct / 2.4, INK);
    CR.draw(g, t);
  }

  window.IXW.worlds.life = {
    pan: [-320, 1140],
    paintBg: paintBg, windowBehind: true, paintFrame: paintFrame, paintBack: paintBack, paintFront: paintFront, paintFore: paintFore,
    paintWindow: paintWindow, paintLive: paintLive, paintFrontLive: paintFrontLive,
    paintForeLive: function (g, t, S) { K.zfore(g, t, S, [], function () { CO.crew(CREW, g, t, S, 'fore'); }); CR.draw(g, t); },
    moteCol: 'rgba(255,210,94,.45)',
    glow: {
      offices: function (g) { rr(g, WIN[0].x - 10, WT - 50, WIN[2].x + WW - WIN[0].x + 20, WB - WT + 92, 14); },
      gallery: function (g) { var b = T.board; rr(g, b.x - 10, b.y - 22, b.w + 20, b.h + 32, 10); },
      careers: function (g) { rr(g, 650, 374, 56, 100, 8); },
      blog: function (g) { var s = T.shelf; rr(g, s.x - 6, s.y - 6, s.w + 12, F - s.y + 10, 8); },
      events: function (g) { var f = T.fridge; rr(g, f.x - 6, 92, f.w + 12, F - 88, 10); },
      hub: function (g) { var r = T.rack; rr(g, r.x - 10, r.y - 14, 64, 104, 8); },
      coffee: function (g) { rr(g, T.mach.x - 32, 280, 64, 80, 8); }, radio: function (g) { var f = T.fridge; rr(g, f.x + 8, 80, 56, 46, 8); }
    },
    backGlow: ['offices', 'gallery', 'blog', 'events', 'hub', 'coffee', 'radio'],
    cast: [
      { id: 'dev', behind: true, keys: [], P: DEV, act: actDev },
      { id: 'des', behind: true, keys: [], P: DES, act: actDes },
      { id: 'pm', behind: true, keys: ['gallery'], P: PM, act: actPm },
      { id: 'bar', behind: true, keys: ['events'], P: BAR, act: actBar }
    ],
    toy: function (name, S, t) {
      if (name === 'coffee') { BREW.t = t; CR.burst('spark', T.mach.x, 280, t); }
      if (name === 'radio') { RADIO.t = t; CR.burst('star', T.fridge.x + 36, 80, t); }
    },
    hit: function (x, y, S, t) {
      var r = CR.hitWalker(x, y, t); if (r) return r;
      if (VAC.x != null && Math.abs(x - VAC.x) < 30 && Math.abs(y - VAC.y) < 20) { VAC.t = t; return { say: 'Beep boop! The office **robot vacuum** says hi.', near: [VAC.x, 260], pose: 'wow', who: 'Robot vacuum' }; }
      return COL.hit(XSC, x, y, t);
    }
  };
})(window.IXW && window.IXW.kit, window.CR, window.CO, window.COL);
