/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: sol-tech (/solutions/technology) — "The TechNext Workshop": the Technology practice told as a bright, daytime maker
   garage with three benches wired together. The IoT bench (a sensor test board: a freezer probe, a machine runtime counter,
   a dock scale), the Apps bench (a wall of mobile, web and portal screens) and the Networks bench (a switch on the bench, the
   rack beside it, a Wi-Fi access point on the ceiling) share one cable tray. Every few seconds one situation from the demo
   travels it: a sensor notices, the packet runs the tray to the rack, the access point carries it to the client's phone (the
   app), she assigns it and Odoo opens the record on the board above the benches. The job board shows the one plan.
   The cast: the project lead ticks the job board (tap: unrolls the one-plan blueprint), the IoT engineer solders on her stool
   (tap: holds up a fresh sensor that pings its reading), the app developer swipes his tablet (tap: tosses it and catches it,
   app bubbles pop), the network engineer patches the switch (tap: swings a cable like a lasso, the Wi-Fi bursts), the client's
   ops manager in the doorway sips coffee and gets the alert (tap: shows the record done in Odoo). The fan turns, the clouds
   drift past the windows and the open door, a car passes, the TechNext van waits outside. */
(function (K, CR, CO) {
  'use strict';
  if (!K || !CR || !CO) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed, limb = K.limb;
  var F = 470, CEIL = -118, TRAY = -100, SHELF = 98, BT = 386;
  var INK = '#1B2433', BLUE = '#3167CA', PUR = '#714B67', AMBER = '#F2A93B', ORANGE = '#F07C2A', TEAL = '#14A38B', YEL = '#FFC93C', OK = '#2BB673', RED = '#E0456B', STEEL = '#5C6B7A';
  var JOB = { x: 150, y: -80, w: 182, h: 128 }, ODB = { x: 378, y: -98, w: 244, h: 140 }, WINS = [{ x: 650, y: -84, w: 122, h: 106 }, { x: 788, y: -84, w: 122, h: 106 }];
  var DOOR = { x: 945, y: 92, r: 1305 }, B1 = { x: 262, w: 178 }, B2 = { x: 462, w: 178 }, B3 = { x: 662, w: 160 };
  var DEV = { x: 268, y: 154, w: 166, h: 106 }, APW = { x: 470, y: 152, w: 162, h: 92 }, RACK = { x: 832, y: 176, w: 80 }, AP = { x: 800, y: -84 };
  var MON1 = { x: 386, y: 318, w: 50, h: 40 }, MON2 = { x: 586, y: 316, w: 50, h: 42 }, LAP = { x: 664, y: 352 }, SW = { x: 760, y: 370, w: 56 }, BTN = { x: 284, y: 376 };
  var FAN = { x: 560, y: -168 };
  function setU(g, sx, sy, k) { g.translate(sx, sy); g.scale(k, k); }
  function extOf(W, H, k, sx, sy) { return { l: -(sx + 24) / k, r: (W - sx) / k, t: -(sy + 24) / k, b: (H - sy) / k }; }
  function smooth(u) { return u * u * (3 - 2 * u); }
  function seg(u, a, b) { return clamp((u - a) / (b - a), 0, 1); }
  function tone(c, k) { return K.tone(c, k == null ? 0.25 : k); }
  function plen(p) { var L = 0; for (var i = 1; i < p.length; i++) L += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); return L; }
  function along(p, f) { var L = plen(p) * clamp(f, 0, 1); for (var i = 1; i < p.length; i++) { var d = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); if (L <= d || i === p.length - 1) { var q = d ? Math.min(1, L / d) : 0; return [lerp(p[i - 1][0], p[i][0], q), lerp(p[i - 1][1], p[i][1], q)]; } L -= d; } return p[0]; }
  function quad(a, c, b, f) { var u = 1 - f; return [u * u * a[0] + 2 * u * f * c[0] + f * f * b[0], u * u * a[1] + 2 * u * f * c[1] + f * f * b[1]]; }

  /* ---------------- the situation that travels the benches: an 11 s loop, three scenarios in turn ---------------- */
  var SC = [
    { dev: 0, name: 'Freezer warming', phone: ['Freezer 2 at 5.6 °C', 'above its 5 °C limit'], rec: 'Quality check · Freezer 2 stock', short: 'Quality check', col: '#3FA9E0' },
    { dev: 1, name: 'Machine stopped', phone: ['Line 1 stopped', 'runtime flat for 3 min'], rec: 'Maintenance request · Line 1', short: 'Maintenance', col: ORANGE },
    { dev: 2, name: 'Delivery arrived', phone: ['Dock scale: 412 kg in', 'pallets weighed at the bay'], rec: 'Receipt validated · stock updated', short: 'Receipt', col: TEAL }];
  var CYC = 11, TB = -2.6, SCB = 0;
  function cyc(t) { var tt = t - TB, n = Math.floor(tt / CYC), u = (tt - n * CYC) / CYC; return { n: n, u: u, sc: (((n + SCB) % 3) + 3) % 3 }; }
  var RA = [[352, DEV.y + 20], [352, DEV.y], [354, TRAY + 4], [872, TRAY + 4], [872, RACK.y]], RC = [[872, RACK.y], [872, TRAY + 4], [AP.x, TRAY + 4], [AP.x, AP.y + 10]];

  /* ---------------- the people ---------------- */
  var W = CR.who;
  var LEAD = W({ x: 200, y: 470, s: 0.46, ph: 0.3, skin: 2, hair: 0, style: 'short', outfit: 'shirt', top: BLUE, glasses: true, hold: 'clipboard', hands: [[-70, -200], [10, -205]], look: 0.3 });
  var IOT = W({ x: 334, y: 470, s: 0.46, ph: 1.1, skin: 0, hair: 1, style: 'pony', outfit: 'cardigan', top: AMBER, top2: '#FFFFFF', clip: BLUE, sit: true, chair: false, hands: [[-40, -214], [56, -214]], look: 0.2 });
  var APP = W({ x: 548, y: 470, s: 0.46, ph: 2.0, skin: 1, hair: 0, style: 'short', outfit: 'polo', top: TEAL, hold: 'tablet', hands: [[-60, -212], [20, -214]], look: 0.4 });
  var NET = W({ x: 738, y: 470, s: 0.47, ph: 2.7, skin: 3, hair: 2, style: 'short', outfit: 'shirt', top: ORANGE, hatKind: 'cap', hat: BLUE, hands: [[-60, -200], [70, -196]], look: 0.4 });
  var OPS = W({ x: 966, y: 470, s: 0.46, ph: 3.4, skin: 4, hair: 1, style: 'long', outfit: 'cardigan', top: RED, top2: '#FFFFFF', id: '#9AA6BC', hands: [[-60, -196], [56, -200]], look: -0.4 });
  var CREW = [
    { x0: 992, x1: 1262, y: 416, spd: 13, ph: 0.4, label: 'TechNext field engineer', lines: ['Back from the site survey: **what to measure** and where the devices go.', 'Ask us about **on-site work** at your location.'], acts: ['wave', 'nod', 'id'],
      P: W({ s: 0.34, skin: 1, hair: 3, style: 'bob', outfit: 'polo', top: '#5B8DEF', hold: 'tablet' }) },
    { front: true, x0: 1030, x1: 1240, y: 652, spd: 17, ph: 0.6, label: 'TechNext technician', lines: ['Patch cables and a spare switch for **the network bench**.', 'Built, installed and **tested**, then connected to Odoo.'], acts: ['nod', 'id', 'wave'],
      P: W({ s: 0.58, skin: 2, hair: 1, style: 'short', outfit: 'shirt', top: '#2E8FD0', hold: 'box' }) },
    { front: true, x0: -900, x1: 70, y: 664, spd: 15, ph: 0.2, label: 'TechNext consultant', lines: ['Lunch for the benches. **One team**, one table.', 'One team to call when something **needs to change**.'], acts: ['wave', 'cheer', 'id'],
      P: W({ s: 0.58, skin: 0, hair: 0, style: 'bun', outfit: 'cardigan', top: '#21B799', top2: '#FFFFFF', hold: 'tray' }) }];
  CREW[0].P.fixS = true;
  var IN_CREW = [CREW[0]], FORE_CREW = [CREW[1], CREW[2]];

  function handAt(P, side) {
    var F3 = K.F3, d = side ? 1 : -1, h = P.hands[side], sxk = P.sx == null ? 1 : P.sx, bw = P.build || 1;
    var r = K.ik(d * F3.shx * bw, F3.shy, h[0], h[1], F3.a, F3.b, d).h, dy = -(P.hop || 0) + (P.sit ? (P.sitDrop != null ? P.sitDrop : 46) : 0);
    return [P.x + r[0] * P.s * sxk, P.y + (r[1] + dy) * P.s];
  }
  function mouthAt(P) { var dy = -(P.hop || 0) + (P.sit ? (P.sitDrop != null ? P.sitDrop : 46) : 0); return [P.x + P.look * 9 * P.s, P.y + (K.F3.hy + 46 + dy) * P.s]; }
  function topAt(P) { var dy = -(P.hop || 0) + (P.sit ? (P.sitDrop != null ? P.sitDrop : 46) : 0); return [P.x, P.y + (K.F3.hy - 96 + dy) * P.s]; }

  /* ---------------- the outside, behind the open door and the windows ---------------- */
  function paintBg(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    CO.sky(g, e, e.t, 360, [[0, '#7EC6F5'], [0.55, '#B9E2FB'], [1, '#E8F6FE']]);
    var gl = g.createRadialGradient(1120, -160, 8, 1120, -160, 360); gl.addColorStop(0, 'rgba(255,248,214,.9)'); gl.addColorStop(0.3, 'rgba(255,244,200,.3)'); gl.addColorStop(1, 'rgba(255,244,200,0)'); g.fillStyle = gl; g.fillRect(e.l, e.t, e.r - e.l, 420);
    fillE(g, 1120, -160, 22, 22, '#FFF6D0');
    /* across the street: a row of shophouses in pastel, shutters, awnings */
    var cols = ['#CFEBDD', '#FBE1C8', '#FFF0B8', '#D6E6FA', '#F6D6DE'];
    for (var i = 0, x = DOOR.x - 40; x < Math.max(e.r, DOOR.r) + 40; i++, x += 92) {
      var top = 150 + hash(i + 3) * 26, c = cols[i % cols.length]; fillRR(g, x, top, 90, 330 - top, 2, c); fillRR(g, x - 2, top - 8, 94, 10, 2, tone(c, 0.12));
      for (var r = 0; r < 2; r++) for (var w = 0; w < 3; w++) { var wx = x + 10 + w * 27, wy = top + 18 + r * 44; fillRR(g, wx, wy, 18, 28, 2, '#FFFFFF'); fillRR(g, wx + 2, wy + 2, 6, 24, 1, '#9FC9E8'); fillRR(g, wx + 10, wy + 2, 6, 24, 1, '#B5D7EF'); }
      for (var s = 0; s < 7; s++) fillRR(g, x + 4 + s * 12, 268, 12, 12, 0, s % 2 ? '#FFFFFF' : ['#E0456B', '#21B799', '#3167CA', '#F2A93B', '#7B5CD6'][i % 5]);
      fillRR(g, x + 8, 282, 74, 48, 2, '#F4F6F9'); fillRR(g, x + 12, 288, 30, 38, 2, '#C9DDF0'); fillRR(g, x + 48, 288, 30, 38, 2, '#C9DDF0');
    }
    g.fillStyle = '#C9CED6'; g.fillRect(e.l, 330, e.r - e.l, 10); g.fillStyle = '#9AA3AE'; g.fillRect(e.l, 340, e.r - e.l, 44);
    g.fillStyle = '#FFFFFF'; for (var d = Math.floor(e.l / 60) * 60; d < e.r; d += 60) g.fillRect(d, 360, 30, 3);
    g.fillStyle = '#B5BCC6'; g.fillRect(e.l, 384, e.r - e.l, 6); g.fillStyle = '#E6E1D6'; g.fillRect(e.l, 390, e.r - e.l, 36);
    g.strokeStyle = 'rgba(150,140,120,.3)'; g.lineWidth = 1; g.beginPath(); for (var pv = Math.floor(e.l / 26) * 26; pv < e.r; pv += 26) { g.moveTo(pv, 390); g.lineTo(pv - 6, 426); } g.stroke();
    g.fillStyle = '#E9ECF0'; g.fillRect(e.l, 426, e.r - e.l, F - 426);
    /* the tree trunk (the canopy sways, live) */
    fillRR(g, 1236, 200, 12, 192, 5, '#9A7556'); fillE(g, 1242, 392, 22, 5, 'rgba(60,50,40,.18)');
    g.restore();
  }

  /* ---------------- the garage: ceiling, brick wall, windows, the door, the floor (one cache with the back props) ---------------- */
  function holes(e) {
    var h = [];
    for (var x = Math.floor((e.l - 200) / 290) * 290 + 70; x < e.r + 100; x += 290) h.push({ x: x, y: -250, w: 160, h: 74 });
    WINS.forEach(function (w) { h.push(w); }); h.push({ x: DOOR.x, y: DOOR.y, w: DOOR.r - DOOR.x, h: F - DOOR.y });
    return h;
  }
  function inner(g, e, H) { g.beginPath(); g.rect(e.l - 10, e.t - 10, e.r - e.l + 20, F - e.t + 10); H.forEach(function (h) { g.rect(h.x, h.y, h.w, h.h); }); }
  function paintFrame(g, Wd, Hd, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(Wd, Hd, k, sx, sy), H = holes(e);
    /* ceiling and wall in one shape, the skylights, windows and the door cut out */
    var wg = g.createLinearGradient(0, CEIL, 0, F); wg.addColorStop(0, '#F8F3EC'); wg.addColorStop(1, '#F1E9DE');
    inner(g, e, H); g.fillStyle = wg; g.fill('evenodd');
    g.save(); inner(g, e, H); g.clip('evenodd');
    var cg = g.createLinearGradient(0, e.t, 0, CEIL); cg.addColorStop(0, '#DDE3EB'); cg.addColorStop(1, '#EEF1F5'); g.fillStyle = cg; g.fillRect(e.l - 10, e.t - 10, e.r - e.l + 20, CEIL - e.t + 10);
    /* corrugated roof underside, purlins, the main beam */
    g.fillStyle = 'rgba(120,135,160,.10)'; for (var cx = Math.floor(e.l / 10) * 10; cx < e.r; cx += 10) g.fillRect(cx, e.t, 3, CEIL - e.t);
    [[-262, 6], [-168, 8]].forEach(function (b) { g.fillStyle = '#FFFFFF'; g.fillRect(e.l, b[0], e.r - e.l, b[1]); g.fillStyle = 'rgba(30,50,80,.10)'; g.fillRect(e.l, b[0] + b[1], e.r - e.l, 3); });
    g.fillStyle = '#F7F9FB'; g.fillRect(e.l, CEIL - 20, e.r - e.l, 20); g.fillStyle = '#DDE3EA'; g.fillRect(e.l, CEIL - 6, e.r - e.l, 6); g.fillStyle = 'rgba(30,50,80,.12)'; g.fillRect(e.l, CEIL, e.r - e.l, 4);
    g.strokeStyle = '#E6EAF0'; g.lineWidth = 2; g.beginPath(); for (var tx = Math.floor(e.l / 40) * 40; tx < e.r; tx += 40) { g.moveTo(tx, CEIL - 20); g.lineTo(tx + 20, -164); g.lineTo(tx + 40, CEIL - 20); } g.stroke();
    /* whitewashed brick */
    for (var row = 0, y = CEIL + 4; y < F; row++, y += 13) { var off = row % 2 ? 17 : 0;
      for (var bx = Math.floor((e.l - 40) / 34) * 34 + off; bx < e.r; bx += 34) { var hv = hash(bx * 0.13 + row * 7.1); g.fillStyle = hv > 0.82 ? '#EFE4D6' : hv < 0.12 ? '#FBF7F1' : '#F5EEE4'; g.fillRect(bx + 1, y + 1, 32, 11); } }
    g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(e.l, CEIL + 4, e.r - e.l, 30);
    /* the skirting and a yellow safety stripe */
    g.fillStyle = '#C9CFD8'; g.fillRect(e.l, F - 14, e.r - e.l, 14); for (var hz = Math.floor(e.l / 24) * 24; hz < e.r; hz += 24) { g.fillStyle = YEL; g.beginPath(); g.moveTo(hz, F); g.lineTo(hz + 12, F - 14); g.lineTo(hz + 22, F - 14); g.lineTo(hz + 10, F); g.closePath(); g.fill(); }
    g.restore();
    /* skylight frames and the windows' frames */
    H.forEach(function (h, i) { if (h === H[H.length - 1]) return; var win = h.y > -200; g.strokeStyle = '#FFFFFF'; g.lineWidth = win ? 7 : 6; rr(g, h.x, h.y, h.w, h.h, 3); g.stroke();
      g.fillStyle = 'rgba(255,255,255,.22)'; g.beginPath(); g.moveTo(h.x + h.w * 0.15, h.y + h.h); g.lineTo(h.x + h.w * 0.45, h.y); g.lineTo(h.x + h.w * 0.6, h.y); g.lineTo(h.x + h.w * 0.3, h.y + h.h); g.closePath(); g.fill();
      g.fillStyle = '#FFFFFF'; if (win) { g.fillRect(h.x + h.w / 2 - 3, h.y, 6, h.h); g.fillRect(h.x, h.y + h.h * 0.5 - 3, h.w, 6); fillRR(g, h.x - 10, h.y + h.h, h.w + 20, 9, 3, '#FFFFFF'); g.fillStyle = 'rgba(30,50,80,.1)'; g.fillRect(h.x - 8, h.y + h.h + 9, h.w + 16, 3); }
      else { for (var m = 1; m < 4; m++) g.fillRect(h.x + m * h.w / 4 - 2, h.y, 4, h.h); } });
    /* the door opening: steel jambs, the header, the rolled door, the threshold */
    fillRR(g, DOOR.x - 12, DOOR.y - 34, DOOR.r - DOOR.x + 24, 34, 6, '#AEB8C6'); g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(DOOR.x - 10, DOOR.y - 30, DOOR.r - DOOR.x + 20, 6);
    for (var sl = 0; sl < 4; sl++) { g.fillStyle = sl % 2 ? '#C9D1DC' : '#D6DCE5'; g.fillRect(DOOR.x, DOOR.y + sl * 6, DOOR.r - DOOR.x, 6); }
    g.fillStyle = 'rgba(30,50,80,.18)'; g.fillRect(DOOR.x, DOOR.y + 24, DOOR.r - DOOR.x, 3);
    [DOOR.x - 12, DOOR.r].forEach(function (x) { fillRR(g, x, DOOR.y - 4, 12, F - DOOR.y + 4, 2, '#9AA6BC'); g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(x + 2, DOOR.y, 3, F - DOOR.y); });
    for (var hs = DOOR.x - 12; hs < DOOR.r + 12; hs += 20) { g.fillStyle = (Math.round((hs - DOOR.x) / 20) % 2) ? '#1B2433' : YEL; g.fillRect(hs, DOOR.y - 44, 20, 8); }
    /* the floor: polished concrete, a sheen, joints, the safety line in front of the benches */
    var fg = g.createLinearGradient(0, F, 0, e.b); fg.addColorStop(0, '#D8DEE6'); fg.addColorStop(1, '#C3CBD5'); g.fillStyle = fg; g.fillRect(e.l, F, e.r - e.l, e.b - F);
    g.fillStyle = 'rgba(30,50,80,.12)'; g.fillRect(e.l, F, e.r - e.l, 5);
    g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 1.5; g.beginPath(); [530, 610, 720].forEach(function (y) { g.moveTo(e.l, y); g.lineTo(e.r, y); }); for (var j = Math.floor(e.l / 200) * 200; j < e.r + 200; j += 200) { g.moveTo(j, F); g.lineTo(j + (j - 560) * 0.9, e.b); } g.stroke();
    g.fillStyle = 'rgba(255,255,255,.18)'; for (var sh = Math.floor(e.l / 300) * 300; sh < e.r; sh += 300) { g.beginPath(); g.moveTo(sh + 40, F + 8); g.lineTo(sh + 120, F + 8); g.lineTo(sh + 60, e.b); g.lineTo(sh - 30, e.b); g.closePath(); g.fill(); }
    g.fillStyle = YEL; g.fillRect(Math.max(e.l, 140), 492, Math.min(e.r, 930) - Math.max(e.l, 140), 5);
    g.fillStyle = 'rgba(255,201,60,.55)'; for (var dz = DOOR.x; dz < DOOR.r; dz += 26) { g.beginPath(); g.moveTo(dz, F + 6); g.lineTo(dz + 14, F + 6); g.lineTo(dz + 4, F + 30); g.lineTo(dz - 10, F + 30); g.closePath(); g.fill(); }
    fillRR(g, DOOR.x - 6, F - 2, DOOR.r - DOOR.x + 12, 6, 2, '#8A96A8');
    g.restore();
  }
  function pegboard(g, x, y, w, h) {
    shadowed(g, 8, 3, 0.14, function () { fillRR(g, x, y, w, h, 4, '#E6C89C'); });
    g.fillStyle = 'rgba(120,80,40,.28)'; for (var py = y + 8; py < y + h - 4; py += 10) for (var px = x + 8; px < x + w - 4; px += 10) g.fillRect(px, py, 2, 2);
    g.strokeStyle = '#D4B080'; g.lineWidth = 3; rr(g, x + 1.5, y + 1.5, w - 3, h - 3, 4); g.stroke();
  }
  function wrench(g, x, y, l, a, c) { g.save(); g.translate(x, y); g.rotate(a); fillRR(g, -2.5, 0, 5, l, 2, c); g.beginPath(); g.arc(0, 0, 6, 0, Math.PI * 2); g.fillStyle = c; g.fill(); fillRR(g, -2, -7, 4, 6, 1, '#E6C89C'); g.restore(); }
  function screwdriver(g, x, y, c) { fillRR(g, x - 3.5, y, 7, 18, 3, c); fillRR(g, x - 1, y + 18, 2, 16, 1, '#9AA6BC'); }
  function coil(g, x, y, r, c) { g.strokeStyle = c; g.lineWidth = 2.6; for (var i = 0; i < 3; i++) { g.beginPath(); g.ellipse(x, y + i * 2, r - i, r * 0.8 - i, 0, 0, Math.PI * 2); g.stroke(); } fillRR(g, x - 2, y - r * 0.8 - 6, 4, 8, 2, '#9AA6BC'); }
  function sign(g, x, y, w, label, col, icon) {
    g.strokeStyle = '#8A96A8'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(x + 14, SHELF + 8); g.lineTo(x + 14, y); g.moveTo(x + w - 14, SHELF + 8); g.lineTo(x + w - 14, y); g.stroke();
    shadowed(g, 6, 2, 0.16, function () { fillRR(g, x, y, w, 26, 6, '#FFFFFF'); }); fillRR(g, x, y, 26, 26, 6, col); g.fillRect(x + 20, y, 6, 26);
    icon(g, x + 13, y + 13); text(g, label, x + 34, y + 17.5, 10.5, 800, INK);
  }
  function icCpu(g, x, y) { fillRR(g, x - 6, y - 6, 12, 12, 2, '#FFFFFF'); fillRR(g, x - 3, y - 3, 6, 6, 1, AMBER); g.fillStyle = '#FFFFFF'; for (var i = -1; i <= 1; i++) { g.fillRect(x + i * 4 - 0.8, y - 9, 1.6, 3); g.fillRect(x + i * 4 - 0.8, y + 6, 1.6, 3); g.fillRect(x - 9, y + i * 4 - 0.8, 3, 1.6); g.fillRect(x + 6, y + i * 4 - 0.8, 3, 1.6); } }
  function icPhone(g, x, y) { fillRR(g, x - 5, y - 8, 10, 16, 2.5, '#FFFFFF'); fillRR(g, x - 3.4, y - 5.5, 6.8, 10, 1, TEAL); fillE(g, x, y + 6, 1, 1, TEAL); }
  function icNet(g, x, y) { g.strokeStyle = '#FFFFFF'; g.lineWidth = 1.8; g.beginPath(); g.moveTo(x, y - 6); g.lineTo(x, y); g.moveTo(x - 7, y + 6); g.lineTo(x - 7, y + 2); g.lineTo(x + 7, y + 2); g.lineTo(x + 7, y + 6); g.stroke(); fillRR(g, x - 3, y - 9, 6, 5, 1, '#FFFFFF'); fillRR(g, x - 10, y + 5, 6, 5, 1, '#FFFFFF'); fillRR(g, x + 4, y + 5, 6, 5, 1, '#FFFFFF'); }
  function paintBack(g, ext) {
    /* the cable tray, hung from the beam, cables in it */
    for (var hx = Math.floor(ext.l / 140) * 140 + 30; hx < ext.r; hx += 140) { g.fillStyle = '#AEB8C6'; g.fillRect(hx - 1, CEIL, 2, TRAY - CEIL); }
    fillRR(g, ext.l, TRAY - 6, ext.r - ext.l, 4, 1, '#B5BFCC'); fillRR(g, ext.l, TRAY + 6, ext.r - ext.l, 4, 1, '#9AA6BC');
    g.fillStyle = '#C9D1DC'; for (var rx = Math.floor(ext.l / 16) * 16; rx < ext.r; rx += 16) g.fillRect(rx, TRAY - 2, 3, 8);
    [[BLUE, -3], [YEL, 0], [ORANGE, 3]].forEach(function (c) { g.strokeStyle = c[0]; g.lineWidth = 2.2; g.beginPath(); g.moveTo(ext.l, TRAY + c[1] + 1); g.lineTo(ext.r, TRAY + c[1] + 1); g.stroke(); });
    /* risers: the sensor board up to the tray, the rack up to the tray, the access point drop */
    g.lineCap = 'round'; g.strokeStyle = YEL; g.lineWidth = 3; g.beginPath(); g.moveTo(352, DEV.y + 2); g.lineTo(354, TRAY + 6); g.stroke();
    g.strokeStyle = BLUE; g.beginPath(); g.moveTo(866, RACK.y); g.lineTo(866, TRAY + 6); g.stroke(); g.strokeStyle = ORANGE; g.beginPath(); g.moveTo(878, RACK.y); g.lineTo(878, TRAY + 6); g.stroke();
    [[352, 20], [352, 70], [866, 20], [866, 110]].forEach(function (c) { fillRR(g, c[0] - 6, c[1], 18, 5, 2, '#9AA6BC'); });
    g.strokeStyle = '#9AA6BC'; g.lineWidth = 2; g.beginPath(); g.moveTo(AP.x, TRAY + 6); g.lineTo(AP.x, AP.y); g.stroke();
    /* the access point: a white puck under the tray */
    fillE(g, AP.x, AP.y + 6, 22, 7, '#E3E8EF'); fillE(g, AP.x, AP.y + 3, 22, 7, '#FFFFFF'); fillRR(g, AP.x - 6, AP.y + 6, 12, 3, 1.5, '#C9D1DC');
    /* the job board: four columns, one plan */
    shadowed(g, 12, 4, 0.18, function () { fillRR(g, JOB.x - 5, JOB.y - 5, JOB.w + 10, JOB.h + 10, 6, '#B5BFCC'); }); fillRR(g, JOB.x, JOB.y, JOB.w, JOB.h, 3, '#FFFFFF');
    fillRR(g, JOB.x, JOB.y, JOB.w, 18, 3, INK); g.fillRect(JOB.x, JOB.y + 10, JOB.w, 8); text(g, 'JOB BOARD · ONE PLAN', JOB.x + 8, JOB.y + 12.5, 8, 800, YEL);
    ['Review', 'Plan', 'Deliver', 'Support'].forEach(function (c, i) { var x = JOB.x + 4 + i * 44.5; fillRR(g, x, JOB.y + 22, 41, 12, 3, ['#EEF2F7', '#FFF4DC', '#E3F5EF', '#E8EEFB'][i]); text(g, c, x + 20.5, JOB.y + 31, 7, 800, '#3D4560', 'center');
      if (i) { g.strokeStyle = '#E3E8EF'; g.lineWidth = 1; g.beginPath(); g.moveTo(x - 2, JOB.y + 38); g.lineTo(x - 2, JOB.y + JOB.h - 14); g.stroke(); } });
    fillRR(g, JOB.x + 10, JOB.y + JOB.h - 2, JOB.w - 20, 6, 3, '#C9D1DC'); [0, 1, 2].forEach(function (i) { fillRR(g, JOB.x + 18 + i * 10, JOB.y + JOB.h - 4, 7, 4, 1.5, [RED, BLUE, OK][i]); });
    /* the Odoo board: a wall screen where every alert lands */
    shadowed(g, 14, 5, 0.22, function () { fillRR(g, ODB.x - 7, ODB.y - 7, ODB.w + 14, ODB.h + 14, 8, '#2A3142'); }); fillRR(g, ODB.x, ODB.y, ODB.w, ODB.h, 3, '#FFFFFF');
    fillRR(g, ODB.x, ODB.y, ODB.w, 22, 3, PUR); g.fillRect(ODB.x, ODB.y + 12, ODB.w, 10); text(g, 'Odoo · where it all lands', ODB.x + 30, ODB.y + 15, 9.4, 800, '#FFFFFF');
    fillE(g, ODB.x + 16, ODB.y + 11, 7, 7, '#FFFFFF'); fillE(g, ODB.x + 16, ODB.y + 11, 3.5, 3.5, PUR);
    g.strokeStyle = '#8A96A8'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(ODB.x + 40, ODB.y - 7); g.lineTo(ODB.x + 60, CEIL); g.moveTo(ODB.x + ODB.w - 40, ODB.y - 7); g.lineTo(ODB.x + ODB.w - 60, CEIL); g.stroke();
    /* the timber shelf above the pegboards and what sits on it */
    var s0 = Math.max(ext.l, 140), s1 = Math.min(ext.r, 932);
    fillRR(g, s0, SHELF, s1 - s0, 8, 2, '#C98E55'); g.fillStyle = 'rgba(80,50,20,.18)'; g.fillRect(s0, SHELF + 8, s1 - s0, 3);
    for (var br = s0 + 30; br < s1; br += 160) { g.fillStyle = '#7A869C'; g.beginPath(); g.moveTo(br, SHELF + 8); g.lineTo(br + 12, SHELF + 8); g.lineTo(br, SHELF + 20); g.closePath(); g.fill(); }
    var bins = [[154, BLUE], [176, YEL], [198, BLUE], [586, TEAL], [608, '#7B5CD6'], [630, TEAL], [880, ORANGE], [902, ORANGE]];
    bins.forEach(function (b, i) { if (b[0] < s0 || b[0] > s1 - 20) return; fillRR(g, b[0], SHELF - 18, 20, 18, 3, b[1]); fillRR(g, b[0] + 4, SHELF - 13, 12, 5, 1, '#FFFFFF'); });
    coil(g, 238, SHELF - 12, 11, BLUE); coil(g, 262, SHELF - 12, 11, ORANGE); fillRR(g, 286, SHELF - 30, 26, 30, 3, '#FFFFFF'); fillRR(g, 290, SHELF - 26, 18, 10, 2, '#E3E8EF'); text(g, 'IoT', 299, SHELF - 6, 7, 800, AMBER, 'center');
    fillRR(g, 416, SHELF - 22, 46, 22, 3, '#C99A6B'); fillRR(g, 416, SHELF - 22, 46, 5, 2, '#B5865A'); fillRR(g, 430, SHELF - 16, 18, 10, 1, '#FFFFFF'); fillRR(g, 470, SHELF - 16, 34, 16, 3, '#2A3142'); fillE(g, 478, SHELF - 8, 3, 3, OK);
    g.save(); g.translate(540, SHELF); g.scale(0.3, 0.3); K.plant(g, { x: 0, y: 0 }, '#FFFFFF', '#E3E8EF'); g.restore();
    fillRR(g, 660, SHELF - 26, 30, 26, 4, '#FFFFFF'); g.strokeStyle = BLUE; g.lineWidth = 1.6; for (var wa = 0; wa < 3; wa++) { g.beginPath(); g.arc(675, SHELF - 6, 4 + wa * 4, -2.4, -0.7); g.stroke(); }
    fillRR(g, 700, SHELF - 14, 40, 14, 2, '#2A3142'); for (var pt = 0; pt < 6; pt++) fillRR(g, 704 + pt * 6, SHELF - 10, 4, 4, 1, '#5C6B7A');
    coil(g, 762, SHELF - 12, 11, TEAL); fillRR(g, 784, SHELF - 34, 30, 34, 3, '#E3E8EF'); fillRR(g, 788, SHELF - 30, 22, 14, 2, '#9FC4FF'); text(g, 'FW', 799, SHELF - 6, 7, 800, INK, 'center');
    coil(g, 836, SHELF - 12, 11, YEL);
    /* the bench signs */
    sign(g, 300, 112, 104, 'IoT bench', AMBER, icCpu); sign(g, 500, 112, 112, 'Apps bench', TEAL, icPhone); sign(g, 686, 112, 124, 'Network bench', ORANGE, icNet);
    /* pegboards behind the benches, tools on them */
    pegboard(g, B1.x - 4, 148, B1.w + 8, BT - 148); pegboard(g, B2.x - 4, 148, B2.w + 8, BT - 148); pegboard(g, B3.x - 4, 148, B3.w + 8, BT - 148);
    wrench(g, 276, 272, 30, 0.1, '#9AA6BC'); wrench(g, 292, 268, 36, -0.05, '#9AA6BC'); screwdriver(g, 312, 268, RED); screwdriver(g, 324, 268, BLUE); coil(g, 418, 286, 13, RED);
    screwdriver(g, 476, 262, YEL); wrench(g, 492, 262, 28, 0.08, '#9AA6BC'); coil(g, 520, 280, 12, BLUE); fillRR(g, 610, 258, 20, 30, 3, '#2A3142'); fillRR(g, 613, 262, 14, 20, 1, '#9FC4FF');
    coil(g, 684, 190, 14, ORANGE); coil(g, 712, 194, 12, BLUE); coil(g, 738, 190, 14, YEL); wrench(g, 772, 182, 34, 0.12, '#9AA6BC'); screwdriver(g, 792, 180, ORANGE); screwdriver(g, 804, 180, TEAL);
    /* the sensor test board on the IoT pegboard (readouts are live) */
    shadowed(g, 8, 3, 0.18, function () { fillRR(g, DEV.x, DEV.y, DEV.w, DEV.h, 6, '#FFFFFF'); }); fillRR(g, DEV.x, DEV.y, DEV.w, 16, 6, AMBER); g.fillRect(DEV.x, DEV.y + 10, DEV.w, 6); text(g, 'SENSOR TEST BOARD', DEV.x + 8, DEV.y + 11.5, 7.4, 800, '#FFFFFF');
    ['FREEZER 2', 'LINE 1', 'DOCK SCALE'].forEach(function (l, i) { var x = DEV.x + 6 + i * 53; fillRR(g, x, DEV.y + 22, 49, 78, 5, '#F6F8FB'); text(g, l, x + 24.5, DEV.y + 33, 6.2, 800, '#5C6B7A', 'center'); fillRR(g, x + 6, DEV.y + 40, 37, 22, 3, '#1E2A3A'); });
    /* the app wall: mobile, web, portal */
    shadowed(g, 8, 3, 0.18, function () { fillRR(g, APW.x, APW.y, APW.w, APW.h, 6, '#2A3142'); });
    fillRR(g, APW.x + 8, APW.y + 8, 34, 64, 6, '#111827'); fillRR(g, APW.x + 50, APW.y + 8, 62, 50, 3, '#111827'); fillRR(g, APW.x + 120, APW.y + 8, 36, 50, 3, '#111827');
    text(g, 'MOBILE', APW.x + 25, APW.y + 84, 6.4, 800, '#9FB0C8', 'center'); text(g, 'WEB APP', APW.x + 81, APW.y + 70, 6.4, 800, '#9FB0C8', 'center'); text(g, 'PORTAL', APW.x + 138, APW.y + 70, 6.4, 800, '#9FB0C8', 'center');
    fillRR(g, APW.x + 50, APW.y + 74, 106, 10, 3, '#3A4458'); text(g, 'Built around one workflow', APW.x + 103, APW.y + 81.5, 6, 700, '#C9D3E3', 'center');
    /* the rack: glass door, a patch panel, two switches, the firewall, a UPS */
    soft(g, RACK.x + RACK.w / 2, F + 3, 52, 6, 0.25); shadowed(g, 10, 4, 0.2, function () { fillRR(g, RACK.x, RACK.y, RACK.w, F - RACK.y, 6, '#2A3142'); });
    fillRR(g, RACK.x + 6, RACK.y + 8, RACK.w - 12, F - RACK.y - 24, 3, '#1B2433'); text(g, 'RACK 01', RACK.x + RACK.w / 2, RACK.y + 6.5, 5.6, 800, '#9FB0C8', 'center');
    var units = [['patch', '#3A4458'], ['sw', '#2E3A50'], ['sw', '#2E3A50'], ['fw', '#4A2E46'], ['blank', '#2A3142'], ['srv', '#33405A'], ['srv', '#33405A'], ['blank', '#2A3142'], ['ups', '#3A4458']];
    units.forEach(function (u, i) { var y = RACK.y + 14 + i * 30; fillRR(g, RACK.x + 9, y, RACK.w - 18, 24, 2, u[1]); fillE(g, RACK.x + 13, y + 12, 1.6, 1.6, '#8A96A8'); fillE(g, RACK.x + RACK.w - 13, y + 12, 1.6, 1.6, '#8A96A8');
      if (u[0] === 'patch' || u[0] === 'sw') for (var p = 0; p < 8; p++) fillRR(g, RACK.x + 18 + p * 6.4, y + 6, 4.6, 5, 1, '#111827');
      if (u[0] === 'fw') text(g, 'FIREWALL', RACK.x + RACK.w / 2, y + 15, 6, 800, '#E7B9D8', 'center');
      if (u[0] === 'ups') text(g, 'UPS', RACK.x + RACK.w / 2, y + 15, 6.4, 800, '#9FB0C8', 'center'); });
    for (var pc = 0; pc < 6; pc++) { g.strokeStyle = [BLUE, YEL, ORANGE, TEAL, BLUE, RED][pc]; g.lineWidth = 1.6; g.beginPath(); g.moveTo(RACK.x + 20 + pc * 6.4, RACK.y + 25); g.quadraticCurveTo(RACK.x + 22 + pc * 6.4, RACK.y + 42, RACK.x + 20 + pc * 6.4, RACK.y + 50); g.stroke(); }
    g.fillStyle = 'rgba(255,255,255,.08)'; g.beginPath(); g.moveTo(RACK.x + 10, F - 20); g.lineTo(RACK.x + 40, RACK.y + 10); g.lineTo(RACK.x + 56, RACK.y + 10); g.lineTo(RACK.x + 26, F - 20); g.closePath(); g.fill();
    fillRR(g, RACK.x + 4, F - 12, 10, 12, 2, '#1B2433'); fillRR(g, RACK.x + RACK.w - 14, F - 12, 10, 12, 2, '#1B2433');
    /* the IoT engineer's shop stool (she sits on it, so no office chair) */
    var stx = IOT.x; [[-30, 1], [30, 1]].forEach(function (l) { g.strokeStyle = '#7A869C'; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.moveTo(stx + l[0] * 0.3, 444); g.lineTo(stx + l[0], F - 2); g.stroke(); });
    g.strokeStyle = '#9AA6BC'; g.lineWidth = 3; g.beginPath(); g.ellipse(stx, 456, 22, 4, 0, 0, Math.PI * 2); g.stroke(); fillRR(g, stx - 4, 436, 8, 26, 3, '#7A869C'); fillE(g, stx, 437, 44, 8, '#3A4458'); fillE(g, stx, 434, 42, 6, '#4A5468');
    /* a whiteboard of ideas between the job board and the window: the wall clock */
    K.clockFace(g, { x: 634, y: 64, r: 14 }, AMBER);
    /* the brick wall right of the door (wide screens): a painted sign, a bike rack, a fire extinguisher */
    if (ext.r > DOOR.r) { fillRR(g, DOOR.r + 30, 140, 22, 46, 6, RED); fillRR(g, DOOR.r + 34, 132, 14, 10, 3, '#2A3142'); text(g, 'FIRE', DOOR.r + 41, 168, 6, 800, '#FFFFFF', 'center');
      g.strokeStyle = '#8A96A8'; g.lineWidth = 3; g.beginPath(); for (var bk = 0; bk < 3; bk++) { g.moveTo(DOOR.r + 70 + bk * 20, F); g.lineTo(DOOR.r + 70 + bk * 20, F - 34); g.arc(DOOR.r + 78 + bk * 20, F - 34, 8, Math.PI, 0); g.lineTo(DOOR.r + 86 + bk * 20, F); } g.stroke(); }
    if (ext.r > 960) { [[1000, BLUE], [1052, YEL], [1104, ORANGE]].forEach(function (c, i) { fillE(g, c[0], 30, 20, 20, INK); fillE(g, c[0], 30, 16, 16, c[1]); if (i === 0) CO.plane(g, c[0], 30, 1.1, 0, '#FFFFFF'); else if (i === 1) { g.strokeStyle = INK; g.lineWidth = 3; g.beginPath(); g.moveTo(c[0] - 7, 37); g.lineTo(c[0] + 7, 23); g.stroke(); fillE(g, c[0] + 7, 23, 4, 4, INK); } else { g.strokeStyle = '#FFFFFF'; g.lineWidth = 2; for (var wa2 = 0; wa2 < 3; wa2++) { g.beginPath(); g.arc(c[0], 38, 4 + wa2 * 4, -2.4, -0.7); g.stroke(); } } }); }
    /* the van parked outside (inside the door opening, in front of the passing cars) */
    van(g, 1018, 372);
    /* left margin (wide screens): shelving with bins, a 3D printer on its cart, the painted logo */
    if (ext.l < -300) { [-950, -600].forEach(function (lx, u) { for (var sh = 0; sh < 4; sh++) { var y = 150 + sh * 80; fillRR(g, lx, y, 200, 8, 2, '#9AA6BC'); for (var b = 0; b < 6; b++) { var c = [BLUE, YEL, TEAL, ORANGE, RED, '#7B5CD6'][(b + sh + u * 3) % 6]; fillRR(g, lx + 6 + b * 32, y - 30, 28, 30, 3, c); fillRR(g, lx + 12 + b * 32, y - 24, 16, 7, 1, '#FFFFFF'); } }
      fillRR(g, lx - 4, 100, 8, F - 100, 2, '#7A869C'); fillRR(g, lx + 196, 100, 8, F - 100, 2, '#7A869C'); fillRR(g, lx + 20, 40, 160, 34, 6, INK); text(g, 'PARTS', lx + 100, 62, 11, 800, YEL, 'center'); });
      fillRR(g, -735, 330, 120, 10, 3, '#9AA6BC'); fillRR(g, -731, 340, 6, 120, 2, '#7A869C'); fillRR(g, -625, 340, 6, 120, 2, '#7A869C'); fillE(g, -728, F - 4, 6, 6, '#2A3142'); fillE(g, -622, F - 4, 6, 6, '#2A3142');
      fillRR(g, -725, 226, 100, 104, 6, '#2A3142'); fillRR(g, -717, 236, 84, 86, 3, '#3A4458'); text(g, '3D PRINT', -675, 336, 7, 800, '#FFFFFF', 'center'); }
    if (ext.l < 100) { fillRR(g, 30, 250, 90, 220, 6, '#E3E8EF'); for (var lk = 0; lk < 2; lk++) { fillRR(g, 34 + lk * 43, 254, 40, 212, 3, '#D3DBE6'); for (var vs = 0; vs < 4; vs++) fillRR(g, 44 + lk * 43, 266 + vs * 6, 20, 2, 1, '#B5BFCC'); fillRR(g, 66 + lk * 43, 340, 3, 16, 1, '#8A96A8'); } }
    leftWall(g, ext);
    /* warm task-light pools on the pegboards */
    [B1, B2, B3].forEach(function (b) { var lg = g.createRadialGradient(b.x + b.w / 2, 300, 10, b.x + b.w / 2, 300, 120); lg.addColorStop(0, 'rgba(255,240,200,.28)'); lg.addColorStop(1, 'rgba(255,240,200,0)'); g.fillStyle = lg; g.fillRect(b.x - 20, 150, b.w + 40, 240); });
  }
  function van(g, x, y) {
    soft(g, x + 76, y + 2, 80, 6, 0.3);
    fillRR(g, x, y - 66, 152, 58, 12, '#FFFFFF'); g.fillStyle = '#FFFFFF'; g.beginPath(); g.moveTo(x + 112, y - 66); g.lineTo(x + 138, y - 66); g.quadraticCurveTo(x + 152, y - 62, x + 154, y - 40); g.lineTo(x + 154, y - 10); g.lineTo(x + 112, y - 10); g.closePath(); g.fill();
    fillRR(g, x + 118, y - 60, 28, 20, 4, '#9FC9E8'); fillRR(g, x, y - 30, 154, 8, 2, BLUE); fillRR(g, x, y - 12, 156, 10, 4, '#C9D1DC');
    CO.plane(g, x + 22, y - 46, 1, 0, BLUE); text(g, 'TechNext', x + 32, y - 42, 11, 800, BLUE); text(g, 'IoT · Apps · Networks', x + 10, y - 34, 6, 700, '#5C6B7A');
    g.strokeStyle = '#9AA6BC'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(x + 8, y - 70); g.lineTo(x + 104, y - 70); g.stroke(); for (var r = 0; r < 7; r++) { g.beginPath(); g.moveTo(x + 12 + r * 14, y - 74); g.lineTo(x + 12 + r * 14, y - 67); g.stroke(); }
    [x + 30, x + 124].forEach(function (wx) { fillE(g, wx, y - 2, 13, 13, '#2A3142'); fillE(g, wx, y - 2, 6, 6, '#9AA6BC'); });
    fillRR(g, x + 148, y - 22, 6, 6, 2, '#FFD84A');
  }
  function bench(g, b, open) {
    var x = b.x, w = b.w; soft(g, x + w / 2, F + 3, w * 0.56, 7, 0.24);
    fillRR(g, x + 6, BT + 10, 9, F - BT - 10, 3, STEEL); fillRR(g, x + w - 15, BT + 10, 9, F - BT - 10, 3, STEEL);
    fillRR(g, x + 1, F - 6, 19, 6, 2, '#3A4458'); fillRR(g, x + w - 20, F - 6, 19, 6, 2, '#3A4458');
    if (!open) {
      fillRR(g, x + 6, BT + 10, w - 12, 30, 4, '#E8ECF2'); g.fillStyle = 'rgba(30,50,80,.08)'; g.fillRect(x + 6, BT + 36, w - 12, 4);
      for (var d = 0; d < 3; d++) { var dx = x + 10 + d * (w - 20) / 3; fillRR(g, dx, BT + 14, (w - 20) / 3 - 4, 22, 3, '#F6F8FB'); fillRR(g, dx + (w - 20) / 6 - 12, BT + 22, 20, 4, 2, '#9AA6BC'); }
      fillRR(g, x + 10, F - 30, w - 20, 6, 2, '#9AA6BC');
      for (var bn = 0; bn < 4; bn++) { var bx = x + 16 + bn * (w - 32) / 4; fillRR(g, bx, F - 52, (w - 32) / 4 - 6, 22, 3, [BLUE, YEL, TEAL, ORANGE][(bn + (x > 600 ? 2 : 0)) % 4]); fillRR(g, bx + 5, F - 46, 14, 5, 1, '#FFFFFF'); }
    } else { g.strokeStyle = STEEL; g.lineWidth = 4; g.beginPath(); g.moveTo(x + 10, BT + 40); g.lineTo(x + 40, BT + 18); g.moveTo(x + w - 10, BT + 40); g.lineTo(x + w - 40, BT + 18); g.stroke(); }
    fillRR(g, x - 6, BT, w + 12, 13, 4, '#D9A86C'); g.fillStyle = 'rgba(255,255,255,.3)'; g.fillRect(x - 4, BT + 2, w + 8, 2);
    g.fillStyle = 'rgba(120,70,30,.14)'; for (var st = x + 6; st < x + w; st += 22) g.fillRect(st, BT + 4, 1.5, 9);
  }
  function monitor(g, m, armX) { g.fillStyle = STEEL; g.fillRect(armX - 2, m.y + m.h, 4, BT - m.y - m.h); fillRR(g, armX - 12, BT - 4, 24, 5, 2, STEEL); shadowed(g, 6, 2, 0.18, function () { fillRR(g, m.x - 4, m.y - 4, m.w + 8, m.h + 8, 5, '#2A3142'); }); }
  function paintFront(g, ext) {
    if (ext.l < -100) kitTable(g);
    bench(g, B1, true); bench(g, B2, false); bench(g, B3, false);
    /* IoT bench: the soldering station, a parts tray, the multimeter, the red test button, her monitor beside her */
    fillRR(g, B1.x + 8, BT - 14, 34, 14, 3, '#2A3142'); fillRR(g, B1.x + 12, BT - 11, 14, 7, 2, '#7FF0CF'); fillE(g, B1.x + 34, BT - 7, 4, 4, '#E0456B');
    g.strokeStyle = '#7A869C'; g.lineWidth = 2; g.beginPath(); g.moveTo(B1.x + 40, BT - 12); g.quadraticCurveTo(B1.x + 60, BT - 30, B1.x + 72, BT - 10); g.stroke();
    fillRR(g, BTN.x - 14, BTN.y - 2, 28, 12, 3, '#FFC93C'); for (var hz = 0; hz < 4; hz++) { g.fillStyle = '#1B2433'; g.fillRect(BTN.x - 12 + hz * 7, BTN.y + 6, 3.5, 3); }
    fillRR(g, 340, BT - 6, 40, 6, 2, '#21875A'); for (var cp = 0; cp < 5; cp++) fillRR(g, 344 + cp * 7, BT - 10, 4, 4, 1, ['#1B2433', '#C9962E', '#1B2433', '#E0456B', '#1B2433'][cp]);
    fillRR(g, 404, BT - 20, 22, 20, 3, YEL); fillRR(g, 407, BT - 17, 16, 7, 1, '#1E2A3A'); fillE(g, 415, BT - 5, 3, 3, '#2A3142');
    monitor(g, MON1, MON1.x + MON1.w / 2);
    /* Apps bench: the phone dock with three test phones, a mug, his monitor */
    fillRR(g, B2.x + 6, BT - 6, 48, 6, 2, '#2A3142'); for (var ph = 0; ph < 3; ph++) { fillRR(g, B2.x + 9 + ph * 15, BT - 30, 12, 24, 3, '#1B2433'); fillRR(g, B2.x + 10.5 + ph * 15, BT - 27.5, 9, 18, 1.5, ['#BDE9FB', '#C7F0E0', '#FFE6B3'][ph]); }
    fillRR(g, 618, BT - 16, 12, 16, 3, '#FFFFFF'); g.strokeStyle = '#FFFFFF'; g.lineWidth = 2; g.beginPath(); g.arc(631, BT - 9, 4, -1.4, 1.4); g.stroke(); fillRR(g, 618, BT - 16, 12, 4, 2, TEAL);
    monitor(g, MON2, MON2.x + MON2.w / 2);
    /* Network bench: the laptop beside him, the switch, a cable tester, coiled patch leads */
    fillRR(g, LAP.x - 2, BT - 3, 44, 4, 2, '#9AA6BC'); g.fillStyle = '#2A3142'; g.beginPath(); g.moveTo(LAP.x + 2, BT - 3); g.lineTo(LAP.x + 6, LAP.y); g.lineTo(LAP.x + 38, LAP.y); g.lineTo(LAP.x + 40, BT - 3); g.closePath(); g.fill();
    fillRR(g, SW.x, SW.y, SW.w, BT - SW.y, 3, '#2A3142'); for (var pr = 0; pr < 8; pr++) fillRR(g, SW.x + 4 + pr * 6.2, SW.y + 4, 4.4, 5, 1, '#111827'); text(g, 'SWITCH', SW.x + SW.w / 2, SW.y + 14.5, 4.6, 800, '#9FB0C8', 'center');
    coil(g, 712, BT - 6, 8, BLUE); fillRR(g, 724, BT - 12, 14, 12, 3, ORANGE); fillRR(g, 727, BT - 10, 8, 4, 1, '#1E2A3A');
    for (var pl = 0; pl < 4; pl++) { g.strokeStyle = [BLUE, YEL, ORANGE, TEAL][pl]; g.lineWidth = 1.6; g.beginPath(); g.moveTo(SW.x + 6 + pl * 6.2, SW.y + 9); g.quadraticCurveTo(SW.x + 4 + pl * 10, BT + 20, SW.x - 10 - pl * 6, BT + 2); g.stroke(); }
  }
  function paintFore(g, ext) {
    g.save(); g.translate(0, -24); /* the front row sits a little higher, clear of the glance strip on wide screens */
    /* a red tool chest on castors, a cable reel, a crate of sensors, a plant by the door */
    var tx = 268; soft(g, tx + 50, 706, 70, 7, 0.28); fillRR(g, tx, 600, 100, 100, 8, '#D8434F'); for (var dr = 0; dr < 4; dr++) { fillRR(g, tx + 6, 608 + dr * 22, 88, 18, 3, '#E85D68'); fillRR(g, tx + 34, 615 + dr * 22, 32, 4, 2, '#F5F7FA'); }
    fillRR(g, tx - 4, 594, 108, 10, 4, '#B8323E'); [tx + 10, tx + 90].forEach(function (cx) { fillE(g, cx, 704, 7, 7, '#2A3142'); }); text(g, 'TOOLS', tx + 50, 597.5 + 4, 6, 800, '#FFFFFF', 'center');
    var rx = 520; soft(g, rx, 742, 46, 6, 0.26); fillE(g, rx, 708, 34, 34, '#C99A6B'); fillE(g, rx, 708, 26, 26, BLUE); fillE(g, rx, 708, 20, 20, '#2A57B0'); fillE(g, rx, 708, 9, 9, '#C99A6B'); fillRR(g, rx - 38, 736, 76, 6, 3, '#9A7556');
    /* a hand truck with boxes, a floor fan, a coiled extension lead, a step stool, a laptop bag */
    var hx = 640; soft(g, hx + 30, 744, 44, 5, 0.26); g.strokeStyle = '#5C6B7A'; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.moveTo(hx + 4, 610); g.lineTo(hx + 8, 736); g.lineTo(hx + 62, 736); g.stroke();
    fillRR(g, hx + 12, 690, 50, 44, 4, '#C99A6B'); fillRR(g, hx + 16, 650, 42, 40, 4, '#D9AE7E'); fillRR(g, hx + 20, 620, 34, 30, 4, '#C99A6B'); g.fillStyle = 'rgba(255,240,210,.5)'; g.fillRect(hx + 33, 690, 8, 44); g.fillRect(hx + 33, 650, 8, 40);
    fillRR(g, hx + 26, 700, 22, 12, 2, '#FFFFFF'); text(g, 'APs', hx + 37, 709.5, 6.4, 800, BLUE, 'center'); fillE(g, hx + 10, 738, 9, 9, '#2A3142'); fillE(g, hx + 10, 738, 4, 4, '#9AA6BC');
    var fx = 778; soft(g, fx, 748, 34, 5, 0.26); fillRR(g, fx - 3, 690, 6, 56, 3, '#9AA6BC'); fillRR(g, fx - 22, 742, 44, 6, 3, '#7A869C'); fillE(g, fx, 676, 30, 30, '#FFFFFF'); fillE(g, fx, 676, 27, 27, '#E3E8EF');
    g.strokeStyle = '#C9D1DC'; g.lineWidth = 1.5; for (var gr = 0; gr < 4; gr++) { g.beginPath(); g.arc(fx, 676, 8 + gr * 6, 0, Math.PI * 2); g.stroke(); } fillE(g, fx, 676, 6, 6, BLUE);
    var ex = 410; soft(g, ex, 750, 40, 5, 0.24); fillE(g, ex, 736, 30, 12, ORANGE); fillE(g, ex, 734, 22, 8, '#D9661A'); fillE(g, ex, 733, 12, 4, ORANGE); fillRR(g, ex + 24, 726, 18, 12, 3, '#FFFFFF'); fillRR(g, ex + 28, 729, 3, 5, 1, '#5C6B7A'); fillRR(g, ex + 34, 729, 3, 5, 1, '#5C6B7A');
    g.strokeStyle = ORANGE; g.lineWidth = 3; g.beginPath(); g.moveTo(ex - 28, 738); g.quadraticCurveTo(ex - 70, 760, ex - 140, 742); g.stroke();
    if (ext.r > 1180) { soft(g, 1220, 730, 50, 6, 0.26); g.fillStyle = YEL; g.beginPath(); g.moveTo(1190, 728); g.lineTo(1206, 650); g.lineTo(1216, 650); g.lineTo(1232, 728); g.closePath(); g.fill(); g.fillStyle = '#1B2433'; g.fillRect(1196, 700, 30, 6); g.fillRect(1200, 676, 22, 5); }
    g.restore();
  }

  /* ---------------- live: the sky and street, the boards, the packet ---------------- */
  var TAP = {}, NETF = -9, FANK = { t: -9 };
  function paintWindow(g, t, par, S) {
    var e = S.ext;
    for (var c = 0; c < 5; c++) { var sp = 3 + c * 1.6, span = e.r - e.l + 500, x = e.l - 250 + ((hash(c + 2) * span + t * sp) % span), y = -230 + (c % 3) * 70 + (c > 2 ? 160 : 0); K.cloud(g, x, y, 0.2 + hash(c) * 0.12); }
    g.strokeStyle = 'rgba(40,60,90,.5)'; g.lineWidth = 1.6; g.lineCap = 'round';
    for (var b = 0; b < 3; b++) { var bsp = e.r - e.l + 300, bx = e.r + 100 - ((t * (14 + b * 4) + hash(b + 9) * bsp) % bsp), by = -40 + b * 18 + Math.sin(t * 0.8 + b) * 5, fl = Math.sin(t * 9 + b * 2) * 4;
      g.beginPath(); g.moveTo(bx - 6, by - fl); g.quadraticCurveTo(bx - 3, by - 3, bx, by); g.quadraticCurveTo(bx + 3, by - 3, bx + 6, by - fl); g.stroke(); }
    if (e.r > DOOR.x) {
      /* a car along the street, every 9 s */
      var cu = (t % 9) / 9, carx = lerp(DOOR.r + 140, DOOR.x - 180, cu), cy = 352; if (carx < e.r + 100) { var cc = ['#E0456B', '#3FA9E0', '#F2A93B'][Math.floor(t / 9) % 3];
        fillRR(g, carx, cy - 26, 96, 22, 8, cc); fillRR(g, carx + 18, cy - 42, 56, 20, 9, cc); fillRR(g, carx + 24, cy - 38, 20, 13, 3, '#DDF0FB'); fillRR(g, carx + 48, cy - 38, 20, 13, 3, '#DDF0FB'); fillE(g, carx + 22, cy - 4, 9, 9, '#2A3142'); fillE(g, carx + 74, cy - 4, 9, 9, '#2A3142'); fillRR(g, carx - 2, cy - 18, 6, 5, 2, '#FFD84A'); }
      /* the tree's canopy, swaying */
      var sw = Math.sin(t * 0.9) * 3; [[0, 0, 44], [-34, 18, 32], [34, 16, 34], [-10, 34, 30], [18, -24, 30]].forEach(function (l, i) { fillE(g, 1242 + l[0] + sw * (1 + i * 0.2), 186 + l[1], l[2], l[2] * 0.9, i % 2 ? '#7FCB7A' : '#6BBF6A'); });
      fillE(g, 1228 + sw, 170, 16, 12, 'rgba(255,255,255,.18)');
    }
  }
  /* the job board's three tickets: each moves a column every few seconds */
  function ticket(i, t) { var p = t / 7 + i * 1.33, n = Math.floor(p), f = p - n, a = n % 4, b = (n + 1) % 4, m = f > 0.84 ? smooth((f - 0.84) / 0.16) : 0; if (b === 0) m = 0; return { col: lerp(a, b, m), moving: f > 0.84 && b !== 0 }; }
  var TK = [['IoT', AMBER, 'pilot room'], ['Apps', TEAL, 'field app'], ['Network', ORANGE, 'Wi-Fi map']];
  function paintLive(g, t, now, S) {
    var e = S.ext, C = cyc(t), u = C.u, sc = SC[C.sc]; S.C = C;
    /* the outside walker, in the doorway */
    CO.crew(IN_CREW, g, t, S, false);
    /* the ceiling fan */
    var fsp = t - FANK.t < 3 ? 9 : 2.2, fa = t * fsp; g.save(); g.translate(FAN.x, FAN.y); g.fillStyle = '#9AA6BC'; g.fillRect(-1.5, -60, 3, 52);
    for (var bl = 0; bl < 3; bl++) { g.save(); g.rotate(fa + bl * 2.094); g.scale(1, 0.26); fillRR(g, 6, -9, 86, 18, 9, '#DDE3EA'); g.restore(); } fillE(g, 0, 0, 13, 7, '#7A869C'); fillE(g, 0, -2, 9, 4, '#9AA6BC'); g.restore();
    /* bunting under the beam, stirred by the fan */
    var fz = t - FANK.t < 3 ? 2.5 : 1, bs = Math.floor(e.l / 300) * 300;
    for (var sp0 = bs; sp0 < e.r; sp0 += 300) { g.strokeStyle = '#9AA6BC'; g.lineWidth = 1; g.beginPath(); g.moveTo(sp0, -150); g.quadraticCurveTo(sp0 + 150, -128, sp0 + 300, -150); g.stroke();
      for (var fl = 1; fl < 11; fl++) { var fu = fl / 11, fx2 = sp0 + fu * 300, fy2 = -150 + 22 * 2 * fu * (1 - fu), a3 = Math.sin(t * 2.4 * fz + fx2 * 0.05) * 0.18 * fz; g.save(); g.translate(fx2, fy2); g.rotate(a3); g.fillStyle = [YEL, BLUE, TEAL, ORANGE, RED][((fl + Math.round(sp0 / 300)) % 5 + 5) % 5]; g.beginPath(); g.moveTo(-6, 0); g.lineTo(6, 0); g.lineTo(0, 13); g.closePath(); g.fill(); g.restore(); } }
    if (e.l < 140) rover(g, t);
    if (e.l < -420) CO.clock(g, -500, -40, 26, 8, INK);
    /* the 3D printer at work (wide screens) */
    if (e.l < -640) { var ph = (t * 0.45) % 1, hx3 = -705 + Math.abs(ph * 2 - 1) * 60, layers = Math.floor((t % 30) / 30 * 14); g.fillStyle = '#9AA6BC'; g.fillRect(-715, 252, 80, 3); fillRR(g, hx3 - 6, 246, 14, 12, 2, YEL); g.fillStyle = '#FF8A3D'; g.fillRect(hx3, 258, 2, 3);
      for (var ly = 0; ly < layers; ly++) fillRR(g, -690 + (ly > 9 ? 6 : 0), 318 - ly * 3, ly > 9 ? 18 : 30, 3, 1, ly % 2 ? '#3FA9E0' : BLUE); }
    /* job board tickets */
    var hotP = S.hot === 'plan';
    TK.forEach(function (tk, i) { var q = ticket(i, t), x = JOB.x + 5 + q.col * 44.5, y = JOB.y + 40 + i * 27; fillRR(g, x + 1, y + 1.5, 38, 24, 2, 'rgba(30,50,80,.12)'); fillRR(g, x, y, 38, 24, 2, '#FFFFFF'); fillRR(g, x, y, 38, 5, 2, tk[1]);
      text(g, tk[0], x + 4, y + 13.5, 7, 800, INK); text(g, tk[2], x + 4, y + 21, 5, 700, '#8A96A8'); if (q.col > 2.9) { fillE(g, x + 32, y + 12, 3.8, 3.8, OK); }
      if (hotP && Math.floor(t * 2) % 3 === i) { g.strokeStyle = tk[1]; g.lineWidth = 1.6; rr(g, x - 1.5, y - 1.5, 41, 27, 3); g.stroke(); } });
    /* wall clock (Singapore time) */
    var sgt = new Date(Date.now() + 8 * 3600e3); K.clockHands(g, { x: 634, y: 64, r: 14 }, sgt.getUTCHours(), sgt.getUTCMinutes(), sgt.getUTCSeconds());
    /* sensor test board: three live readouts; the scenario's device trips */
    var trip = u < 0.86 ? seg(u, 0.0, 0.1) : 1 - seg(u, 0.86, 0.98), DX = function (i) { return DEV.x + 6 + i * 53; };
    [0, 1, 2].forEach(function (i) { var x = DX(i), on = sc.dev === i && trip > 0.02, hot = on && trip > 0.6, val, col = '#7FF0CF';
      if (i === 0) { var v = 3.4 + (on ? 2.2 * trip : Math.sin(t * 0.7) * 0.1); val = v.toFixed(1) + '°'; col = v > 5 ? '#FFB547' : '#7FF0CF'; }
      else if (i === 1) { var stopped = on && trip > 0.5, secs = stopped ? 8076 : 8076 + Math.floor(t) % 600; val = stopped ? 'STOP' : Math.floor(secs / 3600) + ':' + ('0' + Math.floor(secs / 60) % 60).slice(-2) + ':' + ('0' + secs % 60).slice(-2); col = stopped ? '#FFB547' : '#7FF0CF'; }
      else { var kg = on ? Math.round(412 * smooth(trip)) : 0; val = kg + ' kg'; col = on ? '#9FD8FF' : '#7FF0CF'; }
      text(g, val, x + 24.5, DEV.y + 55.5, i === 1 && val !== 'STOP' ? 7.4 : 9.6, 800, col, 'center');
      /* the device glyph and its LED */
      var gx = x + 24.5, gy = DEV.y + 80;
      if (i === 0) { fillRR(g, gx - 3, gy - 12, 6, 18, 3, '#E3E8EF'); fillE(g, gx, gy + 7, 6, 6, '#E3E8EF'); fillRR(g, gx - 1.4, gy - 6 + (1 - (on ? trip : 0)) * 6, 2.8, 12 - (1 - (on ? trip : 0)) * 6, 1, hot ? RED : '#3FA9E0'); fillE(g, gx, gy + 7, 4, 4, hot ? RED : '#3FA9E0'); }
      else if (i === 1) { g.save(); g.translate(gx, gy); g.rotate(on && trip > 0.5 ? 0 : t * 3); g.fillStyle = '#9AA6BC'; for (var tt = 0; tt < 8; tt++) { g.rotate(Math.PI / 4); g.fillRect(-2, -10, 4, 5); } fillE(g, 0, 0, 7, 7, '#9AA6BC'); fillE(g, 0, 0, 3, 3, '#F6F8FB'); g.restore(); }
      else { fillRR(g, gx - 14, gy + 2, 28, 5, 2, '#9AA6BC'); fillRR(g, gx - 2, gy - 6, 4, 9, 1, '#9AA6BC'); if (on) { fillRR(g, gx - 10, gy - 6 - trip * 6, 20, 8, 1, '#C99A6B'); } }
      fillE(g, x + 42, DEV.y + 28, 2.4, 2.4, hot ? ((t % 0.4) < 0.2 ? RED : '#FFB3B3') : ((t + i) % 2 < 0.15 ? '#FFFFFF' : OK));
      if (hot || (S.hot === 'iot' && Math.floor(t * 1.2) % 3 === i)) { var rp = (t * 1.5) % 1; g.strokeStyle = 'rgba(242,169,59,' + (1 - rp).toFixed(2) + ')'; g.lineWidth = 2; g.beginPath(); g.arc(x + 24.5, DEV.y + 51, 18 + rp * 18, -2.6, -0.5); g.stroke(); } });
    /* the app wall: the phone lists alerts, the web app charts, the portal tracks an order */
    var ax = APW.x + 8, ay = APW.y + 8, alertOn = u > 0.54 && u < 0.86;
    fillRR(g, ax + 3, ay + 6, 28, 52, 3, '#F6F8FB'); fillRR(g, ax + 3, ay + 6, 28, 8, 3, TEAL); text(g, 'Alerts', ax + 6, ay + 12.5, 5, 800, '#FFFFFF');
    for (var ar = 0; ar < 4; ar++) { var ry = ay + 17 + ar * 10 - (alertOn ? 0 : 0), hl = ar === 0 && alertOn; fillRR(g, ax + 5, ry, 24, 8, 2, hl ? '#FFE9C7' : '#FFFFFF'); fillE(g, ax + 9, ry + 4, 2, 2, hl ? '#F2A93B' : ['#3FA9E0', ORANGE, TEAL, '#3FA9E0'][(ar + C.n) % 4]); g.fillStyle = '#C9D3E3'; g.fillRect(ax + 13, ry + 3.2, 13, 1.6); }
    var wx = APW.x + 50, wy = APW.y + 8; fillRR(g, wx + 2, wy + 2, 58, 46, 2, '#F6F8FB'); fillRR(g, wx + 2, wy + 2, 58, 7, 2, '#E3E8EF'); for (var cb = 0; cb < 6; cb++) { var bh = (0.3 + 0.6 * Math.abs(Math.sin(cb * 1.3 + t * 0.8))) * 28; fillRR(g, wx + 6 + cb * 9, wy + 44 - bh, 6, bh, 1.5, cb % 2 ? BLUE : TEAL); }
    var px = APW.x + 120, py = APW.y + 8; fillRR(g, px + 2, py + 2, 32, 46, 2, '#F6F8FB'); fillRR(g, px + 2, py + 2, 32, 7, 2, PUR); text(g, 'Orders', px + 5, py + 7.8, 4.6, 800, '#FFFFFF');
    var prog = ((t / 8) % 1); fillRR(g, px + 6, py + 14, 24, 4, 2, '#E3E8EF'); fillRR(g, px + 6, py + 14, 24 * prog, 4, 2, OK); for (var po = 0; po < 3; po++) { fillRR(g, px + 6, py + 24 + po * 7, 24, 5, 1.5, '#FFFFFF'); fillE(g, px + 9, py + 26.5 + po * 7, 1.5, 1.5, po === 0 ? OK : '#C9D3E3'); }
    if (S.hot === 'apps') { var hs = Math.floor(t * 1.2) % 3, hb = [[APW.x + 8, APW.y + 8, 34, 64], [APW.x + 50, APW.y + 8, 62, 50], [APW.x + 120, APW.y + 8, 36, 50]][hs]; g.strokeStyle = TEAL; g.lineWidth = 2.4; rr(g, hb[0] - 2, hb[1] - 2, hb[2] + 4, hb[3] + 4, 6); g.stroke(); }
    /* the rack: link lights, busy as the packet arrives */
    var rk = u > 0.28 && u < 0.4 || t - NETF < 2.5, uy = function (i) { return RACK.y + 14 + i * 30; };
    for (var ui = 0; ui < 9; ui++) { if ([0, 1, 2, 5, 6].indexOf(ui) < 0) continue; for (var l = 0; l < 8; l++) { var on2 = hash(Math.floor(t * (rk ? 14 : 3)) * 0.7 + l * 3.1 + ui * 9.7) > (rk ? 0.25 : 0.55); fillRR(g, RACK.x + 18.5 + l * 6.4, uy(ui) + 14, 3.4, 2.6, 1, on2 ? (ui === 0 ? YEL : OK) : '#26324A'); } }
    fillE(g, RACK.x + RACK.w - 18, uy(3) + 12, 2.4, 2.4, (t % 1.2) < 0.6 ? '#FF6F91' : '#6A2E4C'); fillE(g, RACK.x + RACK.w - 18, uy(8) + 12, 2.4, 2.4, OK);
    /* the access point: its LED and the Wi-Fi rings (strong when the packet leaves it, or tapped) */
    fillE(g, AP.x, AP.y + 9.5, 2.4, 2.4, (t % 1.6) < 1.2 ? '#3FA9E0' : '#BDE9FB');
    var apOn = (u > 0.44 && u < 0.58) || t - NETF < 2.2 || S.hot === 'net' || S.hot === 'flow';
    for (var wr = 0; wr < 3; wr++) { var rp2 = ((t * (apOn ? 1.4 : 0.5)) + wr / 3) % 1; g.strokeStyle = 'rgba(63,169,224,' + ((apOn ? 0.75 : 0.28) * (1 - rp2)).toFixed(2) + ')'; g.lineWidth = 2; g.beginPath(); g.arc(AP.x, AP.y + 10, 14 + rp2 * (apOn ? 70 : 34), 0.25, Math.PI - 0.25); g.stroke(); }
    /* the Odoo board: the last three records, the newest highlighted */
    var arrived = u > 0.8, rows = [], hotO = S.hot === 'odoo';
    for (var r = 0; r < 3; r++) rows.push(SC[(((C.n + SCB - r - (arrived ? 0 : 1)) % 3) + 3) % 3]);
    rows.forEach(function (rw, i) { var y = ODB.y + 30 + i * 33, fresh = i === 0 && (arrived ? u < 0.98 : false), slide = i === 0 && arrived ? smooth(seg(u, 0.8, 0.86)) : 1;
      g.save(); g.globalAlpha = slide; fillRR(g, ODB.x + 8 + (1 - slide) * 30, y, ODB.w - 16, 28, 4, fresh ? '#F7EFF5' : '#F6F8FB'); fillRR(g, ODB.x + 8 + (1 - slide) * 30, y, 4, 28, 2, rw.col);
      text(g, rw.rec, ODB.x + 18 + (1 - slide) * 30, y + 12, 8, 800, INK); text(g, 'opened from: ' + rw.name.toLowerCase(), ODB.x + 18 + (1 - slide) * 30, y + 22, 6.4, 700, '#8A96A8');
      fillRR(g, ODB.x + ODB.w - 50, y + 8, 36, 12, 6, fresh ? PUR : (hotO && Math.floor(t * 2) % 3 === i ? '#E7D7E3' : '#EEF2F7')); text(g, fresh ? 'NEW' : 'Done ✓', ODB.x + ODB.w - 32, y + 16.6, 6.2, 800, fresh ? '#FFFFFF' : '#5C6B7A', 'center'); g.restore(); });
    var d = new Date(); text(g, (d.getHours() % 12 || 12) + ':' + ('0' + d.getMinutes()).slice(-2), ODB.x + ODB.w - 10, ODB.y + 15, 8.4, 800, '#FFFFFF', 'right');
    /* the packet: along the tray to the rack, up to the access point, through the air to the phone, then to Odoo */
    var pk = null, trail = [], flowHot = S.hot === 'flow';
    if (u > 0.1 && u < 0.3) { var f1 = smooth(seg(u, 0.1, 0.3)); pk = along(RA, f1); for (var tr = 1; tr < 6; tr++) trail.push(along(RA, Math.max(0, f1 - tr * 0.025))); }
    else if (u > 0.36 && u < 0.46) { var f2 = smooth(seg(u, 0.36, 0.46)); pk = along(RC, f2); for (var tr2 = 1; tr2 < 6; tr2++) trail.push(along(RC, Math.max(0, f2 - tr2 * 0.05))); }
    else if (u > 0.46 && u < 0.56) { var hd = handAt(OPS, 1), f3 = smooth(seg(u, 0.46, 0.56)); pk = quad([AP.x, AP.y + 12], [930, 40], [hd[0], hd[1] - 16], f3);
      g.save(); g.setLineDash([4, 5]); g.lineDashOffset = -t * 24; g.strokeStyle = 'rgba(63,169,224,.7)'; g.lineWidth = 2; g.beginPath(); g.moveTo(AP.x, AP.y + 12); g.quadraticCurveTo(930, 40, hd[0], hd[1] - 16); g.stroke(); g.restore(); }
    else if (u > 0.7 && u < 0.8) { var hd2 = handAt(OPS, 1), f4 = smooth(seg(u, 0.7, 0.8)); pk = quad([hd2[0], hd2[1] - 16], [760, -40], [ODB.x + ODB.w - 30, ODB.y + 40], f4);
      g.save(); g.setLineDash([4, 5]); g.lineDashOffset = -t * 24; g.strokeStyle = 'rgba(113,75,103,.55)'; g.lineWidth = 2; g.beginPath(); g.moveTo(hd2[0], hd2[1] - 16); g.quadraticCurveTo(760, -40, ODB.x + ODB.w - 30, ODB.y + 40); g.stroke(); g.restore(); }
    if (flowHot) { g.save(); g.strokeStyle = 'rgba(255,201,60,.9)'; g.lineWidth = 3; g.setLineDash([8, 8]); g.lineDashOffset = -t * 30; g.beginPath(); g.moveTo(RA[0][0], RA[0][1]); for (var q = 1; q < RA.length; q++) g.lineTo(RA[q][0], RA[q][1]); g.stroke(); g.restore(); }
    trail.forEach(function (p, i) { fillE(g, p[0], p[1], 4 - i * 0.6, 4 - i * 0.6, 'rgba(255,201,60,' + (0.5 - i * 0.08).toFixed(2) + ')'); });
    if (pk) { fillE(g, pk[0], pk[1], 9, 9, 'rgba(255,214,90,.35)'); fillE(g, pk[0], pk[1], 5, 5, sc.col); fillE(g, pk[0] - 1.5, pk[1] - 1.5, 1.8, 1.8, '#FFFFFF'); }
    S.pk = pk;
  }

  /* ---------------- in front of the benches: the screens, held props, the alert on the phone ---------------- */
  var BUB = [], SMOKE = [];
  function paintFrontLive(g, t, S) {
    var C = S.C || cyc(t), u = C.u, sc = SC[C.sc];
    /* her monitor: the live reading as a line chart */
    var m = MON1; fillRR(g, m.x, m.y, m.w, m.h, 2, '#FFFFFF'); fillRR(g, m.x, m.y, m.w, 7, 2, AMBER); text(g, 'Live', m.x + 3, m.y + 5.6, 4.6, 800, '#FFFFFF');
    g.strokeStyle = '#F2A93B'; g.lineWidth = 1.3; g.beginPath(); for (var i = 0; i < 22; i++) { var tt = t - (21 - i) * 0.25, cc = cyc(tt), tr = cc.u < 0.86 ? seg(cc.u, 0, 0.1) : 1 - seg(cc.u, 0.86, 0.98), yv = m.y + 30 - tr * 16 + Math.sin(tt * 2) * 1.2; if (i) g.lineTo(m.x + 3 + i * 2.1, yv); else g.moveTo(m.x + 3, yv); } g.stroke();
    g.strokeStyle = 'rgba(224,69,107,.6)'; g.setLineDash([2, 2]); g.lineWidth = 0.8; g.beginPath(); g.moveTo(m.x + 3, m.y + 20); g.lineTo(m.x + m.w - 3, m.y + 20); g.stroke(); g.setLineDash([]);
    /* his monitor: the app being built, a screen at a time */
    var m2 = MON2, sp = Math.floor(t / 3) % 3; fillRR(g, m2.x, m2.y, m2.w, m2.h, 2, '#FFFFFF'); fillRR(g, m2.x, m2.y, m2.w, 7, 2, TEAL); text(g, ['Alerts', 'Assign', 'Done'][sp], m2.x + 3, m2.y + 5.6, 4.6, 800, '#FFFFFF');
    fillRR(g, m2.x + 16, m2.y + 10, 18, 29, 3, '#1B2433'); fillRR(g, m2.x + 17.5, m2.y + 12, 15, 25, 1.5, ['#FFF4DC', '#E8EEFB', '#E3F5EF'][sp]); fillRR(g, m2.x + 19, m2.y + 30, 12, 4, 2, [AMBER, BLUE, OK][sp]);
    g.fillStyle = '#C9D3E3'; g.fillRect(m2.x + 4, m2.y + 14, 9, 2); g.fillRect(m2.x + 4, m2.y + 20, 7, 2); g.fillRect(m2.x + 37, m2.y + 14, 9, 2); g.fillRect(m2.x + 37, m2.y + 20, 7, 2);
    /* the laptop: a ping to the access point */
    fillRR(g, LAP.x + 8, LAP.y + 3, 28, 25, 1.5, '#1E2A3A'); for (var ln = 0; ln < 4; ln++) { var w = 6 + hash(ln + Math.floor(t * 2)) * 16; fillRR(g, LAP.x + 10, LAP.y + 6 + ln * 5.5, w, 2.2, 1, ln === 3 ? '#7FF0CF' : '#9FC4FF'); }
    /* the switch on the bench: port lights, one flashes as he plugs */
    for (var pl = 0; pl < 8; pl++) { var on = hash(Math.floor(t * 4) * 1.3 + pl * 2.7) > 0.35 || (NET.plug && pl === 6); fillRR(g, SW.x + 4.6 + pl * 6.2, SW.y + 9.6, 3.2, 1.8, 0.8, on ? (NET.plug && pl === 6 ? YEL : OK) : '#26324A'); }
    /* the red test button: pressed by the toy, glows on its stop */
    var pr = t - (S.toy.test || -9) < 0.35; fillE(g, BTN.x, BTN.y - 3 + (pr ? 2 : 0), 9, 4, '#B8323E'); fillE(g, BTN.x, BTN.y - 6 + (pr ? 3 : 0), 9, 6, pr ? '#FF6F7A' : '#E0456B'); fillE(g, BTN.x - 3, BTN.y - 8 + (pr ? 3 : 0), 3, 1.6, 'rgba(255,255,255,.5)');
    props(g, t, S, u, sc);
    kitLive(g, t);
    /* the alert on the ops manager's phone, big enough to read */
    var al = u > 0.55 && u < 0.78 ? Math.min(1, seg(u, 0.55, 0.58)) * (1 - seg(u, 0.75, 0.78)) : 0, tapO = TAP.ops && t - TAP.ops < 2.6;
    if (al > 0.01 || tapO) { var bx = 902, by = 160; g.save(); g.globalAlpha = tapO ? 1 : al; g.translate(bx + 50, by + 60); g.scale(tapO ? 1 : 0.85 + 0.15 * al, tapO ? 1 : 0.85 + 0.15 * al); g.translate(-bx - 50, -by - 60);
      fillRR(g, bx + 2, by + 4, 104, 56, 9, 'rgba(30,50,80,.16)'); fillRR(g, bx, by, 104, 56, 9, '#FFFFFF'); g.fillStyle = '#FFFFFF'; g.beginPath(); g.moveTo(bx + 62, by + 56); g.lineTo(bx + 72, by + 66); g.lineTo(bx + 76, by + 56); g.fill();
      fillRR(g, bx, by, 104, 14, 9, tapO ? PUR : TEAL); g.fillRect(bx, by + 8, 104, 6); text(g, tapO ? 'Odoo · record' : 'TechNext app · alert', bx + 8, by + 10.4, 6.6, 800, '#FFFFFF');
      if (tapO) { text(g, sc.short + ' done', bx + 8, by + 28, 9, 800, INK); text(g, 'logged in Odoo', bx + 8, by + 39, 6.6, 700, '#8A96A8'); fillRR(g, bx + 8, by + 43, 44, 9, 4.5, OK); text(g, 'Done ✓', bx + 30, by + 49.6, 6, 800, '#FFFFFF', 'center'); }
      else { fillE(g, bx + 12, by + 26, 5, 5, sc.col); text(g, '!', bx + 12, by + 28.6, 7, 800, '#FFFFFF', 'center'); text(g, sc.phone[0], bx + 21, by + 28, 7.6, 800, INK); text(g, sc.phone[1], bx + 21, by + 37, 6, 700, '#8A96A8');
        var asg = u > 0.66; fillRR(g, bx + 8, by + 42, 46, 10, 5, asg ? OK : BLUE); text(g, asg ? 'Assigned ✓' : 'Assign', bx + 31, by + 49, 6, 800, '#FFFFFF', 'center'); fillRR(g, bx + 58, by + 42, 38, 10, 5, '#EEF2F7'); text(g, 'Details', bx + 77, by + 49, 6, 800, '#5C6B7A', 'center'); }
      g.restore(); }
    /* bubbles (app icons from the developer's toss) */
    BUB = BUB.filter(function (b) { return t - b.t0 < 1.9; }); BUB.forEach(function (b) { var q = (t - b.t0) / 1.9; if (q < 0) return; var x = b.x + Math.sin(q * 5 + b.p) * 12, y = b.y - q * 130;
      g.save(); g.globalAlpha = 1 - q; fillRR(g, x - 9, y - 9, 18, 18, 5, b.c); g.fillStyle = '#FFFFFF'; if (b.k === 0) { fillRR(g, x - 5, y - 4, 10, 7, 2, '#FFFFFF'); } else if (b.k === 1) { g.beginPath(); g.arc(x, y + 1, 4.5, Math.PI, 0); g.fill(); g.fillRect(x - 4.5, y + 1, 9, 2); } else { g.strokeStyle = '#FFFFFF'; g.lineWidth = 2; g.beginPath(); g.moveTo(x - 4, y); g.lineTo(x - 1, y + 3); g.lineTo(x + 4, y - 3); g.stroke(); } g.restore(); });
  }
  function props(g, t, S, u, sc) {
    /* the lead: a pen while he writes; the blueprint on a tap */
    var hr = handAt(LEAD, 1);
    if (LEAD.blue > 0) { var q = LEAD.blue, hl = handAt(LEAD, 0), x0 = Math.min(hl[0], hr[0]) - 6, x1 = Math.max(hl[0], hr[0]) + 6, y0 = Math.min(hl[1], hr[1]) - 4, drop = (q < 0.2 ? smooth(q / 0.2) : q > 0.85 ? 1 - smooth((q - 0.85) / 0.15) : 1) * 120;
      g.save(); fillRR(g, x0 - 4, y0 - 4, x1 - x0 + 8, 8, 4, '#2A57B0'); g.fillStyle = '#2E64C8'; g.fillRect(x0, y0, x1 - x0, drop); g.strokeStyle = 'rgba(255,255,255,.25)'; g.lineWidth = 0.8; g.beginPath(); for (var gx = x0 + 6; gx < x1; gx += 8) { g.moveTo(gx, y0); g.lineTo(gx, y0 + drop); } for (var gy = y0 + 8; gy < y0 + drop; gy += 8) { g.moveTo(x0, gy); g.lineTo(x1, gy); } g.stroke();
      if (drop > 60) { text(g, 'ONE PLAN', (x0 + x1) / 2, y0 + 20, 9, 800, '#FFFFFF', 'center'); ['IoT', 'Apps', 'Network'].forEach(function (l, i) { fillRR(g, x0 + 6, y0 + 30 + i * 18, x1 - x0 - 12, 13, 3, 'rgba(255,255,255,.16)'); text(g, l, (x0 + x1) / 2, y0 + 39.5 + i * 18, 7.2, 800, '#FFFFFF', 'center'); }); }
      fillRR(g, x0 - 4, y0 + drop - 4, x1 - x0 + 8, 8, 4, '#2A57B0'); g.restore(); }
    else if (LEAD.pen) { g.save(); g.translate(hr[0], hr[1]); g.rotate(-0.7); fillRR(g, -1.5, -14, 3, 16, 1.5, RED); g.restore(); }
    /* the IoT engineer: the soldering iron and its smoke; a fresh sensor held up on a tap */
    var hi = handAt(IOT, 1);
    if (IOT.show) { var ss = hi; fillRR(g, ss[0] - 11, ss[1] - 22, 22, 16, 3, '#21875A'); fillRR(g, ss[0] - 6, ss[1] - 19, 8, 6, 1, '#1B2433'); fillE(g, ss[0] + 6, ss[1] - 16, 2.6, 2.6, (t % 0.5) < 0.25 ? OK : '#C7F0E0');
      g.strokeStyle = '#9AA6BC'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(ss[0] + 8, ss[1] - 22); g.lineTo(ss[0] + 8, ss[1] - 32); g.stroke();
      for (var rp = 0; rp < 3; rp++) { var f = ((t - TAP.iot) * 1.2 + rp / 3) % 1; g.strokeStyle = 'rgba(242,169,59,' + (0.8 * (1 - f)).toFixed(2) + ')'; g.lineWidth = 2; g.beginPath(); g.arc(ss[0] + 8, ss[1] - 32, 6 + f * 28, -2.4, -0.7); g.stroke(); }
      if (t - TAP.iot > 0.9) { fillRR(g, ss[0] - 22, ss[1] - 64, 52, 16, 8, '#FFFFFF'); text(g, '3.4 °C ✓', ss[0] + 4, ss[1] - 53, 8, 800, '#1E9E6A', 'center'); } }
    else { g.save(); g.translate(hi[0], hi[1]); g.rotate(0.9); fillRR(g, -2.5, -4, 5, 12, 2, '#2A3142'); fillRR(g, -1, -16, 2, 13, 1, '#C9D3DE'); g.restore();
      if (IOT.dab) SMOKE.push({ x: hi[0] - 10, y: hi[1] + 6, t0: t }); }
    SMOKE = SMOKE.filter(function (s) { return t - s.t0 < 1.6; }); if (SMOKE.length > 24) SMOKE.splice(0, SMOKE.length - 24);
    SMOKE.forEach(function (s) { var q = (t - s.t0) / 1.6; fillE(g, s.x + Math.sin(q * 6 + s.t0) * 5, s.y - q * 40, 2 + q * 4, 2 + q * 4, 'rgba(200,208,220,' + (0.45 * (1 - q)).toFixed(2) + ')'); });
    /* the app developer: his tablet flies on a tap */
    if (APP.toss != null) { var q2 = APP.toss, ha = handAt(APP, 0), hb = handAt(APP, 1), mx = (ha[0] + hb[0]) / 2, my = Math.min(ha[1], hb[1]) - 10 - Math.sin(q2 * Math.PI) * 90;
      g.save(); g.translate(mx, my); g.rotate(q2 * Math.PI * 4); fillRR(g, -14, -18, 28, 36, 4, '#2A3550'); fillRR(g, -11, -15, 22, 30, 2, '#FFFFFF'); fillRR(g, -11, -15, 22, 6, 2, TEAL); g.restore(); }
    else { var hp = handAt(APP, 1); if (APP.swipe) { fillE(g, hp[0] - 2, hp[1] - 4, 3, 3, 'rgba(20,163,139,.5)'); } }
    /* the network engineer: the Wi-Fi tester; the lasso on a tap */
    var hn = handAt(NET, 0), hn2 = handAt(NET, 1);
    if (NET.lasso != null) { var lq = NET.lasso, top = topAt(NET); g.save(); g.strokeStyle = BLUE; g.lineWidth = 2.6; g.beginPath(); g.ellipse(top[0] + 4, top[1] - 16, 34 * Math.min(1, lq * 3), 9 * Math.min(1, lq * 3), Math.sin(t * 9) * 0.2, 0, Math.PI * 2); g.stroke();
      g.beginPath(); g.moveTo(hn2[0], hn2[1]); g.quadraticCurveTo(hn2[0] + 10, hn2[1] - 20, top[0] + 34 * Math.cos(t * 12), top[1] - 16 + 9 * Math.sin(t * 12)); g.stroke(); g.restore(); }
    if (NET.tester) { fillRR(g, hn[0] - 8, hn[1] - 26, 16, 26, 4, ORANGE); fillRR(g, hn[0] - 5, hn[1] - 22, 10, 9, 2, '#1E2A3A'); for (var tb = 0; tb < 4; tb++) fillRR(g, hn[0] - 4 + tb * 2.4, hn[1] - 15 - tb * 1.6, 1.6, 2 + tb * 1.6, 0.5, tb < 3 + (t % 1 < 0.5 ? 1 : 0) ? '#7FF0CF' : '#3A4458'); }
    if (NET.plugC) { g.strokeStyle = BLUE; g.lineWidth = 2; g.beginPath(); g.moveTo(hn2[0], hn2[1]); g.quadraticCurveTo(hn2[0] - 6, hn2[1] + 26, hn2[0] - 30, BT + 2); g.stroke(); fillRR(g, hn2[0] - 3, hn2[1] - 5, 6, 8, 1.5, '#3FA9E0'); }
    /* the ops manager: her phone (always), a coffee cup on her sip */
    var ho = handAt(OPS, 1); fillRR(g, ho[0] - 5, ho[1] - 18, 10, 18, 2.5, '#1B2433'); fillRR(g, ho[0] - 3.6, ho[1] - 16, 7.2, 13, 1, (u > 0.55 && u < 0.78) ? ((t % 0.3) < 0.15 ? '#FFE9C7' : '#BDE9FB') : '#BDE9FB');
    if (u > 0.55 && u < 0.62) { g.strokeStyle = 'rgba(30,60,110,.45)'; g.lineWidth = 1.4; [-1, 1].forEach(function (dd) { g.beginPath(); g.moveTo(ho[0] + dd * 9, ho[1] - 14); g.lineTo(ho[0] + dd * 12, ho[1] - 10); g.moveTo(ho[0] + dd * 9, ho[1] - 8); g.lineTo(ho[0] + dd * 12, ho[1] - 4); g.stroke(); }); }
    if (OPS.cup) { var hc = handAt(OPS, 0); fillRR(g, hc[0] - 6, hc[1] - 14, 12, 14, 3, '#FFFFFF'); fillRR(g, hc[0] - 6, hc[1] - 14, 12, 4, 2, '#C98E55'); g.strokeStyle = '#FFFFFF'; g.lineWidth = 2; g.beginPath(); g.arc(hc[0] - 7, hc[1] - 8, 3.5, 1.7, 4.6); g.stroke();
      g.strokeStyle = 'rgba(160,170,190,.6)'; g.lineWidth = 1.4; for (var sv = 0; sv < 2; sv++) { var sy = hc[1] - 18 - ((t * 14 + sv * 8) % 16); g.beginPath(); g.moveTo(hc[0] - 2 + sv * 4, sy + 8); g.quadraticCurveTo(hc[0] + 2 + sv * 4, sy + 4, hc[0] - 2 + sv * 4, sy); g.stroke(); } }
  }

  /* ---------------- the kitting corner (behind the title card): the wall sign, the tool wall, the site-survey board, the
     kitting table where the site kits are packed, a line-following test rover on the floor, a pallet of kit boxes ---------------- */
  var KT = { x: -380, r: -120, top: 392 }, WB = { x: -214, y: 22, w: 170, h: 146 }, KBOX = { x: -306, w: 80, h: 50 };
  var KIT = W({ x: -260, y: 470, s: 0.46, ph: 4.4, skin: 1, hair: 2, style: 'short', outfit: 'polo', top: '#7B5CD6', hands: [[-40, -300], [40, -300]], look: 0.2 });
  function leftWall(g, ext) {
    if (ext.l > 60) return;
    /* the painted wall sign */
    shadowed(g, 8, 3, 0.14, function () { fillRR(g, -384, -78, 262, 54, 8, '#FFFFFF'); });
    fillRR(g, -384, -78, 54, 54, 8, BLUE); g.fillRect(-338, -78, 8, 54); CO.plane(g, -357, -51, 1.5, 0, '#FFFFFF');
    text(g, 'TECHNEXT WORKSHOP', -318, -50, 15, 800, INK); text(g, 'IoT · Apps · Networks · one team', -318, -34, 8.6, 700, '#8A96A8');
    g.strokeStyle = '#B5BFCC'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(-360, CEIL); g.lineTo(-360, -78); g.moveTo(-146, CEIL); g.lineTo(-146, -78); g.stroke();
    /* the tool wall: a pegboard with painted outlines, every tool in its place */
    pegboard(g, -382, 30, 148, 168);
    text(g, 'TOOL WALL', -308, 46, 8, 800, '#8C5A1E', 'center');
    g.strokeStyle = 'rgba(27,36,51,.35)'; g.lineWidth = 1.4; g.setLineDash([3, 3]); rr(g, -366, 60, 20, 66, 6); g.stroke(); rr(g, -258, 120, 14, 62, 5); g.stroke(); g.setLineDash([]);
    wrench(g, -356, 66, 52, 0, '#5C6B7A'); wrench(g, -330, 66, 44, 0.06, '#7A869C'); wrench(g, -306, 66, 36, 0.1, '#9AA6BC');
    screwdriver(g, -282, 62, RED); screwdriver(g, -268, 62, BLUE); screwdriver(g, -254, 62, YEL);
    g.save(); g.translate(-342, 150); g.rotate(-0.4); fillRR(g, -4, -2, 8, 40, 3, ORANGE); fillRR(g, -14, -10, 28, 12, 3, '#5C6B7A'); g.restore();
    coil(g, -302, 150, 14, TEAL); coil(g, -272, 166, 10, ORANGE);
    fillRR(g, -372, 176, 60, 14, 3, '#2A3142'); fillRR(g, -368, 179, 22, 8, 2, '#7FF0CF'); text(g, 'METER', -330, 186, 5.6, 800, '#9FB0C8');
    /* the site-survey board: a floor plan with where each sensor and access point goes (sample) */
    shadowed(g, 10, 4, 0.16, function () { fillRR(g, WB.x - 5, WB.y - 5, WB.w + 10, WB.h + 10, 6, '#B5BFCC'); }); fillRR(g, WB.x, WB.y, WB.w, WB.h, 3, '#FFFFFF');
    text(g, 'SITE SURVEY · SAMPLE', WB.x + 8, WB.y + 13, 7.4, 800, INK); fillRR(g, WB.x + WB.w - 30, WB.y + 6, 22, 9, 4.5, '#E8EEFB'); text(g, 'v2', WB.x + WB.w - 19, WB.y + 12.6, 6, 800, BLUE, 'center');
    var fx0 = WB.x + 10, fy0 = WB.y + 22; g.strokeStyle = '#3D4560'; g.lineWidth = 2; rr(g, fx0, fy0, 150, 96, 2); g.stroke();
    g.lineWidth = 1.4; g.beginPath(); g.moveTo(fx0 + 62, fy0); g.lineTo(fx0 + 62, fy0 + 40); g.moveTo(fx0 + 62, fy0 + 58); g.lineTo(fx0 + 62, fy0 + 96); g.moveTo(fx0, fy0 + 52); g.lineTo(fx0 + 40, fy0 + 52); g.moveTo(fx0 + 104, fy0); g.lineTo(fx0 + 104, fy0 + 30); g.moveTo(fx0 + 104, fy0 + 48); g.lineTo(fx0 + 150, fy0 + 48); g.stroke();
    text(g, 'Cold room', fx0 + 6, fy0 + 12, 6, 700, '#8A96A8'); text(g, 'Office', fx0 + 70, fy0 + 12, 6, 700, '#8A96A8'); text(g, 'Dock', fx0 + 6, fy0 + 88, 6, 700, '#8A96A8'); text(g, 'Floor', fx0 + 110, fy0 + 88, 6, 700, '#8A96A8');
    [[fx0 + 22, fy0 + 30], [fx0 + 30, fy0 + 74], [fx0 + 128, fy0 + 72]].forEach(function (p) { fillE(g, p[0], p[1], 4.2, 4.2, AMBER); fillE(g, p[0], p[1], 1.6, 1.6, '#FFFFFF'); });
    fillRR(g, fx0 + 120, fy0 + 16, 14, 14, 3, TEAL); icPhone(g, fx0 + 127, fy0 + 23);
    fillRR(g, WB.x + 16, WB.y + WB.h - 6, WB.w - 32, 6, 3, '#C9D1DC'); [RED, BLUE, OK].forEach(function (c, i) { fillRR(g, WB.x + 26 + i * 12, WB.y + WB.h - 8, 9, 4, 1.5, c); });
    /* the partner plaque and the fire point by the lockers */
    shadowed(g, 6, 2, 0.14, function () { fillRR(g, 34, 118, 82, 100, 5, '#FFFFFF'); }); fillRR(g, 40, 124, 70, 88, 3, '#F6EFF4'); fillRR(g, 40, 124, 70, 20, 3, PUR); g.fillRect(40, 138, 70, 6);
    text(g, 'odoo', 75, 138, 11, 800, '#FFFFFF', 'center'); text(g, 'Ready', 75, 168, 10, 800, PUR, 'center'); text(g, 'Partner', 75, 182, 10, 800, PUR, 'center'); fillE(g, 75, 199, 6, 6, YEL); fillE(g, 75, 199, 3, 3, '#FFFFFF');
    fillRR(g, -26, 332, 44, 20, 3, RED); text(g, 'FIRE POINT', -4, 345.5, 6.2, 800, '#FFFFFF', 'center');
    fillRR(g, -14, 382, 20, 66, 9, '#D8434F'); fillRR(g, -11, 374, 14, 10, 3, '#2A3142'); fillRR(g, -9, 400, 16, 22, 2, '#FFFFFF'); fillRR(g, -26, 440, 44, 6, 2, '#9AA6BC');
    g.strokeStyle = '#2A3142'; g.lineWidth = 3; g.beginPath(); g.moveTo(1, 378); g.quadraticCurveTo(16, 392, 10, 420); g.stroke();
    /* the floor: the kitting bay taped out, and the rover's dashed line */
    g.strokeStyle = YEL; g.lineWidth = 5; g.beginPath(); g.moveTo(-400, 482); g.lineTo(-96, 482); g.lineTo(-84, 548); g.lineTo(-414, 548); g.closePath(); g.stroke();
    g.save(); g.globalAlpha = 0.5; text(g, 'KITTING BAY', -250, 538, 13, 800, '#C9962E', 'center'); g.restore();
    g.strokeStyle = 'rgba(27,36,51,.35)'; g.lineWidth = 3; g.setLineDash([14, 10]); g.beginPath(); g.moveTo(-620, 598); g.lineTo(120, 598); g.stroke(); g.setLineDash([]);
    [-620, 120].forEach(function (x) { fillE(g, x, 598, 9, 4, '#2BB673'); });
  }
  function kitTable(g) {
    soft(g, (KT.x + KT.r) / 2, F + 2, 140, 7, 0.24);
    [KT.x + 10, KT.r - 18].forEach(function (lx) { fillRR(g, lx, KT.top + 10, 8, F - KT.top - 10, 2, STEEL); }); fillRR(g, KT.x + 14, F - 30, KT.r - KT.x - 28, 5, 2, '#9AA6BC');
    fillRR(g, KT.x + 18, F - 52, 70, 22, 3, '#C99A6B'); fillRR(g, KT.x + 96, F - 46, 54, 16, 3, '#D9AE7E');
    /* the stack of sealed site kits */
    [[KT.x + 4, 0, 58], [KT.x + 8, 1, 52], [KT.x + 12, 2, 44]].forEach(function (b) { var y = KT.top - 34 - b[1] * 32; fillRR(g, b[0], y, b[2], 32, 3, b[1] === 1 ? '#D9AE7E' : '#C99A6B'); g.fillStyle = 'rgba(255,240,210,.5)'; g.fillRect(b[0] + b[2] / 2 - 4, y, 8, 32); fillRR(g, b[0] + 5, y + 8, 22, 12, 2, '#FFFFFF'); text(g, 'KIT', b[0] + 16, y + 17, 5.6, 800, BLUE, 'center'); });
    /* the box he is packing (its tape and stamp are live) */
    fillRR(g, KBOX.x, KT.top - KBOX.h, KBOX.w, KBOX.h, 3, '#D9AE7E'); fillRR(g, KBOX.x - 4, KT.top - KBOX.h - 8, 24, 10, 2, '#C99A6B'); fillRR(g, KBOX.x + KBOX.w - 20, KT.top - KBOX.h - 8, 24, 10, 2, '#C99A6B');
    fillRR(g, KBOX.x + 8, KT.top - KBOX.h - 14, 14, 12, 2, '#FFFFFF'); fillE(g, KBOX.x + 15, KT.top - KBOX.h - 8, 2.2, 2.2, OK); fillRR(g, KBOX.x + 26, KT.top - KBOX.h - 12, 10, 10, 2, '#2A3142');
    /* the label printer and a parts tray */
    fillRR(g, -212, KT.top - 24, 40, 24, 4, '#2A3142'); fillRR(g, -208, KT.top - 20, 18, 8, 2, '#3A4458'); fillRR(g, -184, KT.top - 20, 8, 8, 2, YEL); fillRR(g, -206, KT.top - 30, 28, 8, 2, '#FFFFFF');
    fillRR(g, -164, KT.top - 8, 30, 8, 2, '#3167CA'); for (var pp = 0; pp < 4; pp++) fillE(g, -159 + pp * 7, KT.top - 9, 2.4, 2.4, [AMBER, OK, '#FFFFFF', RED][pp]);
    /* the table top, in front of all of it */
    shadowed(g, 6, 3, 0.14, function () { fillRR(g, KT.x, KT.top, KT.r - KT.x, 12, 3, '#C99A6B'); }); fillRR(g, KT.x, KT.top, KT.r - KT.x, 4, 2, '#D9AE7E');
    fillRR(g, KT.x + 30, KT.top + 14, 120, 26, 4, '#FFFFFF'); text(g, 'SITE KITS · PACKED + LABELLED', KT.x + 90, KT.top + 30.5, 6.4, 800, INK, 'center');
  }
  /* foreground props that stand in the walkers' lane: drawn in depth order with the passers-by */
  function zGate(g) { soft(g, -150, 660, 60, 6, 0.26); fillRR(g, -190, 614, 80, 46, 6, '#3167CA'); fillRR(g, -190, 614, 80, 10, 5, '#1E4691'); text(g, 'GATEWAYS', -150, 644, 7.6, 800, '#FFFFFF', 'center'); for (var i = 0; i < 3; i++) fillRR(g, -182 + i * 22, 604, 16, 12, 3, '#FFFFFF'); }
  function zComp(g) { soft(g, -800, 736, 70, 6, 0.26); fillRR(g, -860, 660, 120, 76, 8, '#2A3142'); fillRR(g, -852, 668, 104, 22, 4, '#3A4458'); fillE(g, -840, 738, 7, 7, '#1B2433'); fillE(g, -760, 738, 7, 7, '#1B2433'); text(g, 'COMPRESSOR', -800, 712, 8, 800, '#9FB0C8', 'center'); }
  function zPallet(g) { var x = -700; soft(g, x + 60, 726, 76, 6, 0.26); fillRR(g, x, 712, 124, 12, 2, '#B5865A'); for (var s = 0; s < 3; s++) fillRR(g, x + 6 + s * 52, 724, 16, 6, 1, '#9A7556');
    [[x + 6, 664, 54, 48], [x + 62, 664, 56, 48], [x + 14, 620, 46, 44], [x + 64, 628, 46, 36]].forEach(function (b, i) { fillRR(g, b[0], b[1], b[2], b[3], 3, i % 2 ? '#D9AE7E' : '#C99A6B'); g.fillStyle = 'rgba(255,240,210,.5)'; g.fillRect(b[0] + b[2] / 2 - 4, b[1], 8, b[3]); });
    g.fillStyle = 'rgba(220,235,250,.32)'; g.fillRect(x + 4, 618, 116, 94); g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(x + 10, 630); g.lineTo(x + 30, 700); g.moveTo(x + 90, 626); g.lineTo(x + 112, 690); g.stroke();
    fillRR(g, x + 70, 676, 42, 22, 3, '#FFFFFF'); text(g, 'SITE 04', x + 91, 686, 6, 800, INK, 'center'); text(g, 'APs · sensors', x + 91, 694, 4.8, 700, '#8A96A8', 'center'); }
  function zCrate(g) { var cx2 = 862; soft(g, cx2 + 50, 726, 66, 6, 0.26); fillRR(g, cx2, 676, 100, 50, 5, '#C99A6B'); fillRR(g, cx2, 676, 100, 9, 4, '#B5865A'); fillRR(g, cx2 + 22, 692, 56, 22, 3, '#FFFFFF'); text(g, 'SENSORS', cx2 + 50, 707, 8.4, 800, AMBER, 'center');
    for (var sn = 0; sn < 4; sn++) { fillRR(g, cx2 + 12 + sn * 22, 664, 16, 14, 3, '#FFFFFF'); fillE(g, cx2 + 20 + sn * 22, 671, 2.4, 2.4, OK); } }
  function zTrolley(g) { var x = 10; soft(g, x + 34, 664, 46, 5, 0.26); fillRR(g, x, 600, 70, 8, 3, '#5C6B7A'); fillRR(g, x, 632, 70, 8, 3, '#5C6B7A'); fillRR(g, x + 2, 600, 5, 60, 2, '#7A869C'); fillRR(g, x + 63, 600, 5, 60, 2, '#7A869C'); g.strokeStyle = '#7A869C'; g.lineWidth = 4; g.beginPath(); g.moveTo(x + 66, 600); g.lineTo(x + 78, 572); g.stroke();
    [[x + 6, 584, 18, BLUE], [x + 26, 588, 14, TEAL], [x + 42, 580, 22, ORANGE]].forEach(function (b) { fillRR(g, b[0], b[1], b[2], 600 - b[1], 3, b[3]); fillRR(g, b[0] + 3, b[1] + 4, b[2] - 6, 4, 1, '#FFFFFF'); }); coil(g, x + 22, 622, 9, YEL); fillRR(g, x + 40, 616, 22, 16, 3, '#2A3142'); fillE(g, x + 8, 662, 5, 5, '#2A3142'); fillE(g, x + 62, 662, 5, 5, '#2A3142'); }
  var FORE_Z = [[660, zGate], [664, zTrolley], [738, zComp], [724, zPallet], [726, zCrate]];
  /* the rover: follows its taped line across the bay, LED blinking, a kit box on board every other run */
  function rover(g, t) {
    var P0 = 17, q = (t % P0) / P0, run = Math.floor(t / P0), dir = q < 0.5 ? 1 : -1, f = q < 0.5 ? smooth(q / 0.5) : 1 - smooth((q - 0.5) / 0.5), x = lerp(-600, 96, f), y = 598, mv = Math.abs(Math.sin(q * Math.PI * 2)) > 0.05;
    soft(g, x, y + 8, 30, 4, 0.26); fillRR(g, x - 26, y - 20, 52, 20, 6, '#FFFFFF'); fillRR(g, x - 26, y - 8, 52, 8, 4, BLUE); fillRR(g, x - 6, y - 16, 12, 6, 2, '#1E2A3A');
    fillE(g, x + dir * 22, y - 14, 3, 3, (t % 0.6) < 0.3 ? YEL : '#FFF4C2'); g.strokeStyle = '#5C6B7A'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(x - dir * 18, y - 20); g.lineTo(x - dir * 20, y - 34); g.stroke(); fillE(g, x - dir * 20, y - 35, 2.4, 2.4, (t % 1) < 0.5 ? OK : '#C7F0E0');
    [-15, 15].forEach(function (wx) { fillE(g, x + wx, y + 1, 6, 6, '#2A3142'); g.strokeStyle = '#9AA6BC'; g.lineWidth = 1.2; g.beginPath(); var a = t * 8 * dir; g.moveTo(x + wx + Math.cos(a) * 4, y + 1 + Math.sin(a) * 4); g.lineTo(x + wx - Math.cos(a) * 4, y + 1 - Math.sin(a) * 4); g.stroke(); });
    if (run % 2 === 0) { fillRR(g, x - 16, y - 44, 32, 24, 3, '#D9AE7E'); g.fillStyle = 'rgba(255,240,210,.55)'; g.fillRect(x - 3, y - 44, 6, 24); fillRR(g, x - 13, y - 37, 10, 8, 1.5, '#FFFFFF'); }
    if (!mv) { g.strokeStyle = 'rgba(43,182,115,.6)'; g.lineWidth = 1.4; g.beginPath(); g.arc(x, y - 22, 30, -2.6, -0.5); g.stroke(); }
  }
  var KITS = { tape: 0, stamp: 0 };
  function kitLive(g, t) {
    if (t - (TAP.kit || -9) < 7) { var sq = Math.min(1, (t - TAP.kit) / 0.3); g.save(); g.globalAlpha = sq * (1 - seg(t - TAP.kit, 6, 7)); g.translate(KBOX.x + 50, KT.top - 26); g.rotate(-0.12);
      g.strokeStyle = BLUE; g.lineWidth = 2; rr(g, -22, -9, 44, 18, 3); g.stroke(); text(g, 'READY', 0, 4, 9.6, 800, BLUE, 'center'); g.restore(); }
    var tp = KITS.tape; if (tp > 0) { g.fillStyle = 'rgba(200,170,120,.85)'; g.fillRect(KBOX.x + 4, KT.top - KBOX.h - 2, (KBOX.w - 8) * tp, 4); }
    if (KIT.gun) { var h = handAt(KIT, 1); fillRR(g, h[0] - 9, h[1] - 6, 18, 8, 2, RED); fillE(g, h[0] - 6, h[1] - 6, 6, 6, '#C9A27A'); fillE(g, h[0] - 6, h[1] - 6, 2.4, 2.4, '#8C6A4A'); fillRR(g, h[0] - 2, h[1], 4, 10, 2, '#B8323E'); }
    if (KIT.lab) { var h2 = handAt(KIT, 1); fillRR(g, h2[0] - 8, h2[1] - 10, 16, 10, 1.5, '#FFFFFF'); g.fillStyle = '#2A3550'; for (var bk = 0; bk < 5; bk++) g.fillRect(h2[0] - 6 + bk * 2.6, h2[1] - 8, bk % 2 ? 1 : 1.8, 6); }
    if (KIT.stamp != null) { var h3 = handAt(KIT, 1), h4 = handAt(KIT, 0), mx = (h3[0] + h4[0]) / 2, my = Math.min(h3[1], h4[1]); fillRR(g, mx - 4, my - 18, 8, 16, 3, '#8C6A4A'); fillE(g, mx, my - 20, 7, 5, '#8C6A4A'); fillRR(g, mx - 12, my - 2, 24, 8, 2, BLUE); }
  }
  var castKit = { id: 'kit', behind: true, keys: [], P: KIT, act: function (P, t, S) {
    var st = S.cast.kit; if (tapped('kit', st, t)) {}
    P.tilt = 0; P.hop = 0; P.gun = false; P.lab = false; P.stamp = null; P.x = -260;
    var tk = TAP.kit != null ? t - TAP.kit : 99;
    if (tk < 2.4) { var q = tk / 2.4, up = q < 0.45 ? smooth(q / 0.45) : q < 0.55 ? 1 - smooth((q - 0.45) / 0.1) : 0; P.stamp = q; P.talk = true; P.mood = q < 0.5 ? 'wow' : 'happy'; P.look = 0.1;
      P.hands = [[-16, -300 - up * 120], [24, -300 - up * 120]]; if (q > 0.55) { P.hands = [[-50, -330], [60, -360]]; P.hop = Math.sin((q - 0.55) / 0.45 * Math.PI) * 12; }
      if (q > 0.5 && !TAP.kitB) { TAP.kitB = true; CR.burst('star', KBOX.x + 40, KT.top - 70, t); } KITS.tape = 1; return; }
    TAP.kitB = false;
    var cy = (t + 2) % 12; P.talk = t < st.until; P.mood = P.talk ? 'happy' : 'calm';
    if (cy < 5.5) { var sw = (cy % 1.8) / 1.8; KITS.tape = cy < 1.8 ? sw : 1; P.gun = true; P.hands = [[-90, -280], [-90 + sw * 150, -322 + Math.sin(sw * Math.PI) * 4]]; P.tilt = 0.05; lookAtNexi(P, st, t, S, 0.15); return; }
    if (cy < 8.5) { var lu = (cy - 5.5) / 3, lp = lu < 0.5 ? smooth(lu / 0.5) : 1; KITS.tape = 1; P.lab = lu > 0.12; P.hands = [[-60, -290], [lerp(120, -10, lp), lerp(-290, -322, lp)]]; lookAtNexi(P, st, t, S, lu < 0.4 ? 0.8 : 0.1); return; }
    KITS.tape = cy > 11.6 ? 0 : 1; P.hands = [[-50, -300], [104, -440 + Math.sin(t * 3) * 6]]; P.tilt = -0.03; lookAtNexi(P, st, t, S, 0.7);
  } };
  function zStool(g) { var sx2 = 990; soft(g, sx2 + 30, 752, 40, 5, 0.24); fillRR(g, sx2, 712, 60, 10, 3, BLUE); fillRR(g, sx2 + 8, 682, 44, 10, 3, BLUE); g.strokeStyle = '#1E4691'; g.lineWidth = 4; g.beginPath(); g.moveTo(sx2 + 4, 750); g.lineTo(sx2 + 14, 686); g.moveTo(sx2 + 56, 750); g.lineTo(sx2 + 46, 686); g.stroke(); }
  function zPlant(g) { K.plant(g, { x: 1090, y: 712 }, YEL, '#FFD86A'); }
  function up(f) { return function (g) { g.save(); g.translate(0, -24); f(g); g.restore(); }; }
  FORE_Z.push([728, up(zStool)], [688, up(zPlant)]);
  FORE_Z[4] = [702, up(zCrate)];

  /* ---------------- the cast: an idle loop and a tap choreography each ---------------- */
  function tapped(id, st, t) { if (st.wave && st.wave !== st._my) { st._my = st.wave; TAP[id] = t; return true; } return false; }
  function lookAtNexi(P, st, t, S, base) { P.look = lerp(P.look, t < st.until ? clamp((S.nexi.x - P.x) / 160, -1, 1) : base, 0.08); }
  var castLead = { id: 'lead', behind: true, keys: ['plan'], P: LEAD, act: function (P, t, S) {
    var st = S.cast.lead, busy = S.hot === 'plan'; if (tapped('lead', st, t)) CR.burst('spark', P.x, P.y - 250, t);
    P.tilt = 0; P.hop = 0; P.blue = 0; P.pen = false;
    if (TAP.lead && t - TAP.lead < 3.4) { var q = (t - TAP.lead) / 3.4; P.blue = q; P.talk = true; P.mood = 'happy'; P.hands = [[-56, -330], [56, -330]]; P.look = 0; P.x = 200; if (q > 0.8) P.hop = Math.sin((q - 0.8) / 0.2 * Math.PI) * 14; return; }
    var cy = (t + 1) % 9, point = busy || (cy > 4 && cy < 6.4) || ticket(0, t).moving || ticket(1, t).moving || ticket(2, t).moving;
    P.talk = t < st.until || busy; P.mood = P.talk || point ? 'happy' : 'calm';
    if (point) { P.hands = [[-70, -200], [96, -404 + Math.sin(t * 3) * 6]]; P.tilt = 0.04; lookAtNexi(P, st, t, S, 0.4); }
    else { var w = Math.sin(t * 9) * 4; P.pen = true; P.hands = [[-70, -200], [8 + w, -206 + Math.abs(w)]]; P.tilt = Math.sin(t * 0.8) * 0.03; lookAtNexi(P, st, t, S, -0.15); }
    P.x = 200 + (cy > 6.4 ? Math.sin((cy - 6.4) / 2.6 * Math.PI) * 10 : 0);
  } };
  var castIot = { id: 'iot', behind: true, keys: ['iot'], P: IOT, act: function (P, t, S) {
    var st = S.cast.iot, busy = S.hot === 'iot', C = S.C || cyc(t); if (tapped('iot', st, t)) CR.burst('star', P.x, P.y - 240, t);
    P.tilt = 0; P.hop = 0; P.show = false; P.dab = false;
    if (TAP.iot && t - TAP.iot < 2.8) { var q = (t - TAP.iot) / 2.8; P.show = true; P.talk = true; P.mood = 'happy'; P.hands = [[-50, -214], [40, -380 - Math.sin(q * Math.PI) * 14]]; P.look = 0.2; if (q > 0.75) { P.hands[0] = [-60, -360]; P.hop = Math.sin((q - 0.75) / 0.25 * Math.PI) * 10; } return; }
    var trip = C.u < 0.12, look = (t + 2) % 8 > 6;
    P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : trip ? 'wow' : 'calm';
    if (trip) { P.hands = [[-40, -214], [56, -214]]; P.tilt = -0.06; lookAtNexi(P, st, t, S, 0.1); return; }
    if (look) { P.hands = [[-40, -214], [70, -232]]; lookAtNexi(P, st, t, S, 0.9); return; }
    var dab = Math.max(0, Math.sin(t * 5)); P.hands = [[-36 + Math.sin(t * 1.3) * 3, -214], [52 + Math.sin(t * 2.1) * 4, -222 + dab * 10]]; P.dab = dab > 0.95 && Math.floor(t * 5) % 2 === 0; P.tilt = 0.04;
    lookAtNexi(P, st, t, S, 0.25);
  } };
  var castApp = { id: 'app', behind: true, keys: ['apps'], P: APP, act: function (P, t, S) {
    var st = S.cast.app, busy = S.hot === 'apps'; if (tapped('app', st, t)) { for (var b = 0; b < 6; b++) BUB.push({ x: P.x + (b - 2.5) * 14, y: P.y - 250, t0: t + 0.7 + b * 0.08, p: b, k: b % 3, c: [TEAL, BLUE, AMBER][b % 3] }); }
    P.tilt = 0; P.hop = 0; P.toss = null; P.swipe = false; P.hold = 'tablet';
    if (TAP.app && t - TAP.app < 2.2) { var q = (t - TAP.app) / 2.2; P.talk = true; P.mood = q < 0.6 ? 'wow' : 'happy'; P.hold = null; P.toss = q < 0.8 ? q / 0.8 : null; P.look = 0;
      P.hands = q < 0.8 ? [[-60, -330 - Math.sin(q / 0.8 * Math.PI) * 20], [60, -330 - Math.sin(q / 0.8 * Math.PI) * 20]] : [[-60, -212], [40, -260]]; if (q >= 0.8) { P.hold = 'tablet'; P.hop = Math.sin((q - 0.8) / 0.2 * Math.PI) * 12; } return; }
    var cy = (t + 3) % 10; P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm';
    if (cy > 7.6 || busy) { P.hands = [[-124, -296], [70, -230]]; lookAtNexi(P, st, t, S, -0.6); return; }
    if (cy > 5.4) { P.hands = [[-60, -212], [60, -214]]; lookAtNexi(P, st, t, S, 0.9); return; }
    var sw = (t * 0.9) % 1; P.swipe = true; P.hands = [[-60, -212], [-14 + sw * 36, -214 - Math.sin(sw * Math.PI) * 6]]; lookAtNexi(P, st, t, S, -0.35);
  } };
  var castNet = { id: 'net', behind: true, keys: ['net', 'flow'], P: NET, act: function (P, t, S) {
    var st = S.cast.net, busy = S.hot === 'net' || S.hot === 'flow'; if (tapped('net', st, t)) {}
    P.tilt = 0; P.hop = 0; P.lasso = null; P.tester = false; P.plug = false; P.plugC = false;
    if (TAP.net && t - TAP.net < 2.6) { var q = (t - TAP.net) / 2.6; P.talk = true; P.mood = 'happy'; P.lasso = q; P.hands = [[-60, -210], [60 + Math.cos(t * 12) * 50, -420 + Math.sin(t * 12) * 20]]; P.look = 0;
      if (q > 0.7 && !TAP.netF) { TAP.netF = true; NETF = t; CR.burst('spark', AP.x, AP.y + 40, t); } return; }
    TAP.netF = false;
    var cy = (t + 5) % 9; P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm';
    if (cy > 6.6) { P.tester = true; P.hands = [[-20, -300], [60, -200]]; lookAtNexi(P, st, t, S, -0.3); return; }
    var pu = (t * 0.5) % 1, reach = pu < 0.5 ? Math.sin(pu / 0.5 * Math.PI) : 0; P.plugC = reach > 0.1; P.plug = reach > 0.9;
    P.hands = [[-60, -204], [70 + reach * 46, -196 + reach * 26]]; P.tilt = reach * 0.05; lookAtNexi(P, st, t, S, busy ? -0.3 : 0.6);
  } };
  var castOps = { id: 'ops', behind: true, keys: [], P: OPS, act: function (P, t, S) {
    var st = S.cast.ops, C = S.C || cyc(t), u = C.u; if (tapped('ops', st, t)) {}
    P.tilt = 0; P.hop = 0; P.cup = false;
    if (TAP.ops && t - TAP.ops < 2.6) { var q = (t - TAP.ops) / 2.6; P.talk = true; P.mood = 'happy'; P.hands = [[-90, -380 + Math.sin(t * 14) * 10], [40, -330]]; P.hop = Math.abs(Math.sin(q * Math.PI * 2)) * 10; P.look = -0.2;
      if (q > 0.3 && !TAP.opsH) { TAP.opsH = true; CR.burst('heart', P.x - 20, P.y - 260, t); } return; }
    TAP.opsH = false;
    if (u > 0.55 && u < 0.78) { var r = seg(u, 0.55, 0.6); P.hands = [[-60, -196], [40 - r * 10, -200 - r * 110]]; P.mood = u < 0.66 ? 'wow' : 'happy'; P.talk = u > 0.66 && u < 0.72; P.look = lerp(P.look, -0.1, 0.1); if (u > 0.655 && u < 0.67) P.hop = 4; return; }
    var cy = (t + 4) % 9; P.talk = t < st.until; P.mood = P.talk ? 'happy' : 'calm';
    if (cy > 6.8) { var su = (cy - 6.8) / 2.2, up = Math.sin(su * Math.PI); P.cup = true; P.hands = [[-40 + up * 20, -200 - up * 120], [56, -200]]; P.tilt = -up * 0.06; lookAtNexi(P, st, t, S, 0); return; }
    P.hands = [[-60, -196], [56, -200]]; lookAtNexi(P, st, t, S, cy < 3 ? 0.8 : -0.5);
  } };

  window.IXW.worlds['sol-tech'] = {
    calmView: [100,-60,900,720], calmHide: ['ops'], /* CALM: the framed part of the set */
    pan: [-320, 1280],
    paintBg: paintBg, windowBehind: true, paintFrame: paintFrame, paintBack: paintBack, paintFront: paintFront, paintFore: paintFore,
    paintWindow: paintWindow, paintLive: paintLive, paintFrontLive: paintFrontLive,
    paintForeLive: function (g, t, S) { K.zfore(g, t, S, FORE_Z.map(function (z) { return [z[0], z[1]]; }), function () { CO.crew(FORE_CREW, g, t, S, 'fore'); }); CR.draw(g, t); },
    motes: true, moteCol: 'rgba(255,248,225,.55)',
    glow: {
      iot: function (g) { rr(g, DEV.x - 8, DEV.y - 8, DEV.w + 16, DEV.h + 16, 12); },
      apps: function (g) { rr(g, APW.x - 8, APW.y - 8, APW.w + 16, APW.h + 16, 12); },
      net: function (g) { rr(g, RACK.x - 8, RACK.y - 10, RACK.w + 16, F - RACK.y + 14, 12); },
      flow: function (g) { rr(g, 336, TRAY - 14, 556, 28, 12); },
      odoo: function (g) { rr(g, ODB.x - 12, ODB.y - 12, ODB.w + 24, ODB.h + 24, 14); },
      plan: function (g) { rr(g, JOB.x - 10, JOB.y - 10, JOB.w + 20, JOB.h + 20, 14); },
      test: function (g) { rr(g, BTN.x - 18, BTN.y - 18, 36, 32, 12); }
    },
    backGlow: ['iot', 'apps', 'net', 'flow', 'odoo', 'plan'],
    cast: [castKit, castLead, castIot, castApp, castNet, castOps],
    toy: function (name, S, t) { if (name === 'test') { SCB = (cyc(t).sc + 1) % 3; TB = t - 0.001; CR.burst('spark', BTN.x, BTN.y - 20, t); } },
    hit: function (x, y, S, t, onBtn) {
      var w = CR.hitWalker(x, y, t); if (w) return w; if (onBtn) return null;
      var C = S.C || cyc(t), sc = SC[C.sc];
      if (S.pk && Math.hypot(x - S.pk[0], y - S.pk[1]) < 22) return { say: 'That dot is the **' + sc.name.toLowerCase() + '** alert, on its way from the sensor to the Odoo record.', near: [clamp(S.pk[0], 200, 880), clamp(S.pk[1] + 120, 60, 200)], pose: 'wow', who: 'One alert, end to end' };
      if (Math.abs(x - FAN.x) < 100 && Math.abs(y - FAN.y) < 30) { FANK.t = t; return { say: 'Full speed! Even the fan works **with the rest of the workshop**.', near: [700, -20], pose: 'celebrate', who: 'The ceiling fan' }; }
      if (x > DOOR.x && x < DOOR.r && y > DOOR.y && y < F) return { say: 'The door is always open: ask us about **on-site work** at your location.', near: [900, 0], pose: 'present', who: 'The workshop door' };
      if (x > WB.x && x < WB.x + WB.w && y > WB.y && y < WB.y + WB.h) return { say: 'The **site survey** comes first: what to measure, where each device goes and where the Wi-Fi has to reach.', near: [-120, -40], pose: 'point-left', who: 'The site-survey board' };
      if (x > -384 && x < -122 && y > -80 && y < 200) return { say: 'Every tool back in its outline. **Tidy installs** start with a tidy workshop.', near: [-120, -40], pose: 'point-left', who: 'The tool wall' };
      if (y > 540 && y < 640 && x > -640 && x < 130) return { say: 'Our test rover follows the line and **reports its position** the whole way.', near: [-140, 360], pose: 'wow', who: 'The test rover' };
      if (y < CEIL - 30 && y > -280) return { say: 'Bright day in the workshop. Sunlight in, **readings out**.', near: [clamp(x, 240, 880), -40], pose: 'wow', who: 'The skylights' };
      return null;
    },
    onStop: function (key, S, t) { S.kT = t; if (key === 'net' || key === 'flow') NETF = t; }
  };
})(window.IXW && window.IXW.kit, window.CR, window.CO);
