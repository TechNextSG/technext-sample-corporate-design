/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: sol-iot (/solutions/iot) — "The Smart Greenhouse": IoT solutions told as a bright glasshouse nursery where everything
   reports its own status. Sensor stakes in the beds and an air sensor hanging in the vines ping their readings to a gateway
   on the post, the gateway feeds the live dashboard on its stand, and the cold room at the end (door contact, temperature,
   energy meter, a beacon) runs the demo's story on a loop: the packer weighs a crate on the Odoo IoT scale (the label
   prints), carries it into the cold room and, every other trip, leaves the door open. The temperature drifts over its
   limit, the beacon turns, the supervisor's phone buzzes, she calls the packer back, the door closes, the room recovers and
   the dashboard shows the quality check Odoo opened. Outside the glass the van carries a location tracker.
   The cast: the TechNext IoT engineer plants a new sensor stake (tap: holds it up and pairs it), the grower waters the beds
   so the soil reading climbs (tap: a spray with a rainbow), the TechNext support engineer on the ladder looks after the
   gateway (tap: the firmware bar fills, a jig on the ladder), the supervisor sips her tea and watches the dashboard (tap:
   acknowledges the alert), the packer runs the cold room (tap: a long label prints, a cheer). Mist puffs from the line, the
   baskets sway, the roof vents open as it warms. */
(function (K, CR, CO) {
  'use strict';
  if (!K || !CR || !CO) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed, limb = K.limb;
  var F = 470, EAVE = -40, KNEE = 300, BT = 414, TR = 376;
  var INK = '#14302A', LEAF = '#3FAE6A', LEAF2 = '#2E9A58', LEAF3 = '#5CC27F', SOIL = '#7A5A3E', TEAL = '#14A3A3', FROST = '#7FC8F0', AMB = '#F5A524', RED = '#E0456B', PUR = '#714B67', BLUE = '#3167CA', OK = '#2BB673', STEEL = '#5C6B7A';
  var BEN = { x: 165, w: 340 }, GW = { x: 601, y: 168, w: 38, h: 40 }, POST = 620, DASH = { x: 654, y: 108, w: 156, h: 134 }, CR0 = { x: 850, y: 172, r: 1090 }, DOOR = { x: 872, w: 76 };
  var DISP = { x: 878, y: 182, w: 64, h: 28 }, BEAC = { x: 910, y: 152 }, METER = { x: 960, y: 222 }, TAB = { x: 755, w: 96 }, AIR = { x: 340, y: 70 }, VALVE = { x: 590, y: -18 };
  var STAKES = [200, 330, 470];
  function setU(g, sx, sy, k) { g.translate(sx, sy); g.scale(k, k); }
  function extOf(W, H, k, sx, sy) { return { l: -(sx + 24) / k, r: (W - sx) / k, t: -(sy + 24) / k, b: (H - sy) / k }; }
  function smooth(u) { return u * u * (3 - 2 * u); }
  function seg(u, a, b) { return clamp((u - a) / (b - a), 0, 1); }
  function tone(c, k) { return K.tone(c, k == null ? 0.25 : k); }
  function quad(a, c, b, f) { var u = 1 - f; return [u * u * a[0] + 2 * u * f * c[0] + f * f * b[0], u * u * a[1] + 2 * u * f * c[1] + f * f * b[1]]; }

  /* ---------------- the cold-room story: a 16 s loop; every other loop the door is left open ---------------- */
  var CYC = 16, TB = -1.5;
  function cyc(t) { var tt = t - TB, n = Math.floor(tt / CYC), u = (tt - n * CYC) / CYC, open = n % 2 === 1; return { n: n, u: u, open: open }; }
  /* the room temperature, the door angle and the packer's x at any moment */
  function room(C) {
    var u = C.u, door = 0, temp = 3.4 + Math.sin(u * 6.28) * 0.08, px = 805, carry = true, act = 'weigh';
    if (u < 0.12) { act = 'weigh'; }
    else if (u < 0.24) { act = 'walk'; px = lerp(805, 908, smooth(seg(u, 0.12, 0.24))); }
    else if (u < 0.32) { act = 'stow'; px = 908; door = smooth(seg(u, 0.24, 0.27)); }
    else if (u < 0.44) { act = 'back'; carry = false; px = lerp(908, 805, smooth(seg(u, 0.32, 0.44))); door = C.open ? 1 : 1 - smooth(seg(u, 0.33, 0.4)); }
    else { act = 'idle'; carry = false; door = C.open ? 1 : 0; }
    if (!C.open) { temp += u > 0.25 && u < 0.6 ? Math.sin(seg(u, 0.25, 0.6) * Math.PI) * 0.5 : 0; }
    else {
      var rise = seg(u, 0.3, 0.6), fix = seg(u, 0.74, 0.95); temp = 3.4 + 2.2 * smooth(rise) * (1 - smooth(fix));
      if (u >= 0.62 && u < 0.72) { act = 'fetch'; carry = false; px = lerp(805, 908, smooth(seg(u, 0.62, 0.72))); door = 1; }
      else if (u >= 0.72 && u < 0.78) { act = 'close'; carry = false; px = 908; door = 1 - smooth(seg(u, 0.72, 0.77)); }
      else if (u >= 0.78 && u < 0.9) { act = 'back'; carry = false; px = lerp(908, 805, smooth(seg(u, 0.78, 0.9))); door = 0; }
      else if (u >= 0.9) { door = 0; px = 805; act = 'idle'; }
    }
    var alert = C.open && u > 0.5 && u < 0.86, odoo = C.open && u > 0.62;
    return { door: door, temp: temp, px: px, carry: carry && act !== 'idle', act: act, alert: alert, odoo: odoo, rec: C.open && u > 0.88 };
  }

  /* ---------------- the people ---------------- */
  var W = CR.who;
  var ENG = W({ x: 250, y: 470, s: 0.46, ph: 0.5, skin: 1, hair: 0, style: 'bob', outfit: 'polo', top: BLUE, hold: 'tablet', hands: [[-60, -230], [70, -250]], look: 0.3 });
  var GROW = W({ x: 412, y: 470, s: 0.46, ph: 1.4, skin: 3, hair: 2, style: 'short', outfit: 'shirt', top: '#8CC63F', id: '#9AA6BC', hatKind: 'sunhat', hat: '#F2D59B', hands: [[-70, -220], [70, -300]], look: -0.2 });
  var TECH = W({ x: 545, y: 362, s: 0.44, ph: 2.2, skin: 0, hair: 1, style: 'short', outfit: 'shirt', top: '#2E8FD0', glasses: true, hands: [[-60, -200], [200, -380]], look: 0.6 });
  var SUP = W({ x: 712, y: 470, s: 0.46, ph: 3.0, skin: 2, hair: 1, style: 'long', outfit: 'cardigan', top: '#7B5CD6', top2: '#FFFFFF', id: '#9AA6BC', hands: [[-60, -200], [56, -204]], look: -0.3 });
  var PACK = W({ x: 805, y: 470, s: 0.46, ph: 3.8, skin: 4, hair: 0, style: 'pony', outfit: 'polo', top: '#F08A24', id: '#9AA6BC', clip: '#FFFFFF', hands: [[-60, -210], [60, -210]], look: 0.4 });
  var CREW = [
    { x0: -900, x1: 1300, y: 330, spd: 13, ph: 0.4, label: 'TechNext field engineer', lines: ['Site survey first: **what to measure**, where the devices go, how they connect.', 'A few sensors in **one room** first, then roll it out.'], acts: ['wave', 'nod', 'id'],
      P: W({ s: 0.3, skin: 2, hair: 3, style: 'pony', outfit: 'polo', top: BLUE, hold: 'box' }) },
    { front: true, x0: 1030, x1: 1240, y: 656, spd: 16, ph: 0.6, label: 'TechNext IoT engineer', lines: ['A **device list** with locations and owners, so nothing goes missing.', 'Batteries and firmware **checked**, every change recorded.'], acts: ['nod', 'id', 'wave'],
      P: W({ s: 0.58, skin: 0, hair: 0, style: 'short', outfit: 'polo', top: TEAL, hold: 'clipboard' }) },
    { front: true, x0: -900, x1: 80, y: 664, spd: 14, ph: 0.2, label: 'Grower', lines: ['Harvest in, **straight to cold room 1**.', 'The beds tell us when they need water now.'], acts: ['wave', 'cheer', 'nod'],
      P: W({ s: 0.58, skin: 3, hair: 1, style: 'bun', outfit: 'shirt', top: '#8CC63F', id: '#9AA6BC', hold: 'box' }) }];
  CREW[0].P.fixS = true;
  var OUT_CREW = [CREW[0]], FORE_CREW = [CREW[1], CREW[2]];

  function handAt(P, side) {
    var F3 = K.F3, d = side ? 1 : -1, h = P.hands[side], sxk = P.sx == null ? 1 : P.sx, bw = P.build || 1;
    var r = K.ik(d * F3.shx * bw, F3.shy, h[0], h[1], F3.a, F3.b, d).h, dy = -(P.hop || 0) + (P.sit ? (P.sitDrop != null ? P.sitDrop : 46) : 0);
    return [P.x + r[0] * P.s * sxk, P.y + (r[1] + dy) * P.s];
  }
  function mouthAt(P) { var dy = -(P.hop || 0); return [P.x + P.look * 9 * P.s, P.y + (K.F3.hy + 46 + dy) * P.s]; }
  function topAt(P) { var dy = -(P.hop || 0); return [P.x, P.y + (K.F3.hy - 110 + dy) * P.s]; }

  /* ---------------- outside the glass: the sky, hills, fields, the farm road, the van ---------------- */
  function paintBg(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    CO.sky(g, e, e.t, 300, [[0, '#6FC0F2'], [0.6, '#B3E1FA'], [1, '#E6F7FD']]);
    var gl = g.createRadialGradient(240, -190, 8, 240, -190, 380); gl.addColorStop(0, 'rgba(255,248,214,.95)'); gl.addColorStop(0.3, 'rgba(255,244,200,.32)'); gl.addColorStop(1, 'rgba(255,244,200,0)'); g.fillStyle = gl; g.fillRect(e.l, e.t, e.r - e.l, 460);
    fillE(g, 240, -190, 24, 24, '#FFF6D0');
    /* far hills, near hills, a tree line, striped fields, the farm road */
    function hills(y, amp, f, col, ph) { g.fillStyle = col; g.beginPath(); g.moveTo(e.l, 330); for (var x = e.l; x <= e.r + 20; x += 20) g.lineTo(x, y - Math.sin(x * f + ph) * amp - Math.sin(x * f * 2.3 + ph) * amp * 0.4); g.lineTo(e.r + 20, 330); g.closePath(); g.fill(); }
    hills(150, 26, 0.006, '#BFE3D2', 1); hills(196, 22, 0.009, '#9FD6B1', 3);
    for (var tr = Math.floor(e.l / 46) * 46; tr < e.r; tr += 46) { var th = hash(tr * 0.11); fillE(g, tr + 20, 214 - th * 10, 22 + th * 6, 18 + th * 6, th > 0.5 ? '#6FBF7E' : '#5DB06E'); }
    g.fillStyle = '#B9E2A0'; g.fillRect(e.l, 226, e.r - e.l, 74);
    g.fillStyle = 'rgba(80,140,60,.16)'; for (var fr = 0; fr < 8; fr++) g.fillRect(e.l, 232 + fr * 9, e.r - e.l, 3);
    g.fillStyle = '#E8DCC2'; g.fillRect(e.l, 284, e.r - e.l, 16);
    /* a farm shed with solar panels and a windsock pole (the sock flies, live) */
    fillRR(g, -160, 168, 120, 60, 3, '#E9EEF4'); g.fillStyle = '#C9D3DE'; g.beginPath(); g.moveTo(-170, 170); g.lineTo(-100, 140); g.lineTo(-30, 170); g.closePath(); g.fill();
    for (var sp = 0; sp < 4; sp++) { g.fillStyle = '#3A5A8C'; g.beginPath(); g.moveTo(-160 + sp * 16, 166); g.lineTo(-146 + sp * 16, 150); g.lineTo(-132 + sp * 16, 150); g.lineTo(-146 + sp * 16, 166); g.closePath(); g.fill(); }
    fillRR(g, 1196, 120, 3, 100, 1, '#9AA6BC');
    g.restore();
  }

  /* ---------------- the glasshouse: roof glazing, the glass walls, the knee wall, the floor ---------------- */
  function paintFrame(g, Wd, Hd, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(Wd, Hd, k, sx, sy);
    /* glass tint over the outside view, stronger on the roof */
    g.fillStyle = 'rgba(220,245,240,.16)'; g.fillRect(e.l, EAVE, e.r - e.l, KNEE - EAVE); g.fillStyle = 'rgba(210,240,236,.24)'; g.fillRect(e.l, e.t, e.r - e.l, EAVE - e.t);
    /* roof rafters fanning to the ridge, purlins across */
    g.strokeStyle = '#FFFFFF'; g.lineWidth = 4; g.beginPath(); for (var rx = Math.floor((e.l - 400) / 90) * 90; rx < e.r + 400; rx += 90) { g.moveTo(rx, EAVE); g.lineTo(560 + (rx - 560) * 0.55, e.t - 40); } g.stroke();
    g.lineWidth = 3; g.beginPath(); [-110, -190, -270].forEach(function (y) { g.moveTo(e.l, y); g.lineTo(e.r, y); }); g.stroke();
    g.fillStyle = 'rgba(255,255,255,.18)'; for (var gl = Math.floor(e.l / 180) * 180; gl < e.r; gl += 180) { g.beginPath(); g.moveTo(gl + 30, EAVE); g.lineTo(gl + 80, e.t); g.lineTo(gl + 104, e.t); g.lineTo(gl + 54, EAVE); g.closePath(); g.fill(); }
    /* shade cloth, half drawn, on the roof */
    g.fillStyle = 'rgba(46,154,88,.16)'; g.fillRect(e.l, -190, e.r - e.l, 34); g.strokeStyle = 'rgba(46,154,88,.25)'; g.lineWidth = 1; g.beginPath(); for (var sc = Math.floor(e.l / 8) * 8; sc < e.r; sc += 8) { g.moveTo(sc, -190); g.lineTo(sc, -156); } g.stroke();
    /* the eave gutter and truss */
    fillRR(g, e.l, EAVE - 8, e.r - e.l, 12, 2, '#FFFFFF'); g.fillStyle = 'rgba(30,60,50,.12)'; g.fillRect(e.l, EAVE + 4, e.r - e.l, 3);
    g.strokeStyle = '#F2F6F5'; g.lineWidth = 2; g.beginPath(); for (var tx = Math.floor(e.l / 40) * 40; tx < e.r; tx += 40) { g.moveTo(tx, EAVE - 8); g.lineTo(tx + 20, EAVE - 34); g.lineTo(tx + 40, EAVE - 8); } g.moveTo(e.l, EAVE - 34); g.lineTo(e.r, EAVE - 34); g.stroke();
    /* the glass walls: mullions, transoms, glints */
    g.fillStyle = 'rgba(255,255,255,.2)'; for (var gx = Math.floor(e.l / 160) * 160; gx < e.r; gx += 160) { g.beginPath(); g.moveTo(gx + 16, KNEE); g.lineTo(gx + 60, EAVE); g.lineTo(gx + 84, EAVE); g.lineTo(gx + 40, KNEE); g.closePath(); g.fill(); }
    g.fillStyle = '#FFFFFF'; for (var mx = Math.floor(e.l / 80) * 80; mx < e.r; mx += 80) g.fillRect(mx - 2, EAVE, 4, KNEE - EAVE); g.fillRect(e.l, 60, e.r - e.l, 4); g.fillRect(e.l, 180, e.r - e.l, 4);
    for (var px = Math.floor(e.l / 240) * 240 + 140; px < e.r; px += 240) { fillRR(g, px - 6, EAVE - 6, 12, F - EAVE + 6, 2, '#F4F7F6'); g.fillStyle = 'rgba(30,60,50,.1)'; g.fillRect(px + 3, EAVE, 3, F - EAVE); }
    /* the knee wall: pale blocks, a sill */
    g.fillStyle = '#E9E4DA'; g.fillRect(e.l, KNEE, e.r - e.l, F - KNEE); g.strokeStyle = 'rgba(150,135,110,.25)'; g.lineWidth = 1.2; g.beginPath();
    for (var row = 0, y = KNEE + 8; y < F; row++, y += 18) { g.moveTo(e.l, y); g.lineTo(e.r, y); for (var bx = Math.floor(e.l / 48) * 48 + (row % 2) * 24; bx < e.r; bx += 48) { g.moveTo(bx, y); g.lineTo(bx, y + 18); } } g.stroke();
    fillRR(g, e.l, KNEE - 4, e.r - e.l, 12, 2, '#FFFFFF'); g.fillStyle = 'rgba(30,60,50,.1)'; g.fillRect(e.l, KNEE + 8, e.r - e.l, 3);
    /* the floor: concrete, a gravel strip, a drainage channel, wet patches */
    var fg = g.createLinearGradient(0, F, 0, e.b); fg.addColorStop(0, '#D9DED8'); fg.addColorStop(1, '#C5CCC4'); g.fillStyle = fg; g.fillRect(e.l, F, e.r - e.l, e.b - F);
    g.fillStyle = 'rgba(30,60,50,.12)'; g.fillRect(e.l, F, e.r - e.l, 5);
    fillRR(g, e.l, 496, e.r - e.l, 10, 0, '#B9C2B8'); g.fillStyle = '#8E998D'; for (var dg = Math.floor(e.l / 12) * 12; dg < e.r; dg += 12) g.fillRect(dg, 498, 6, 6);
    g.fillStyle = '#D1C6B0'; g.fillRect(e.l, 600, e.r - e.l, 60); g.fillStyle = 'rgba(120,100,70,.25)'; for (var gr = 0; gr < 400; gr++) { var gx2 = e.l + hash(gr * 1.7) * (e.r - e.l), gy2 = 602 + hash(gr * 3.1) * 56; g.fillRect(gx2, gy2, 2.5, 2); }
    g.fillStyle = 'rgba(127,200,240,.16)'; [[300, 540, 90], [700, 560, 70], [-300, 545, 80], [1100, 556, 80]].forEach(function (p) { fillE(g, p[0], p[1], p[2], 9, 'rgba(127,200,240,.18)'); });
    g.restore();
  }
  function vine(g, x, ph) {
    g.strokeStyle = 'rgba(120,130,120,.7)'; g.lineWidth = 1; g.beginPath(); g.moveTo(x, 40); g.lineTo(x, TR); g.stroke();
    g.strokeStyle = LEAF2; g.lineWidth = 3; g.beginPath(); g.moveTo(x, TR); for (var y = TR; y > 46; y -= 12) g.lineTo(x + Math.sin(y * 0.08 + ph) * 3, y); g.stroke();
    for (var l = 0; l < 13; l++) { var y2 = TR - 14 - l * 20, d = l % 2 ? 1 : -1; g.save(); g.translate(x + d * 3, y2); g.rotate(d * 0.7); fillE(g, d * 9, 0, 10, 5.5, l % 3 ? LEAF : LEAF3); g.restore(); }
    [[90, 2], [170, 3], [240, 2]].forEach(function (c, i) { if (hash(x + i) < 0.25) return; for (var f = 0; f < c[1]; f++) fillE(g, x + 6 + f * 5 - (f > 1 ? 7 : 0), c[0] + (f > 1 ? 6 : 0) + i * 4, 4.6, 4.6, hash(x * 3 + i + f) > 0.4 ? '#E9483B' : '#F59B3A'); });
  }
  function paintBack(g, ext) {
    /* the misting line under the eave, its nozzles; the red valve */
    g.strokeStyle = '#9AA6BC'; g.lineWidth = 4; g.beginPath(); g.moveTo(ext.l, -18); g.lineTo(ext.r, -18); g.stroke();
    for (var nz = Math.floor(ext.l / 60) * 60 + 30; nz < ext.r; nz += 60) { fillRR(g, nz - 3, -18, 6, 8, 2, '#7A869C'); }
    for (var hg = Math.floor(ext.l / 160) * 160 + 70; hg < ext.r; hg += 160) { g.fillStyle = '#C9D3DE'; g.fillRect(hg, EAVE, 2, 22); }
    g.strokeStyle = '#7A869C'; g.lineWidth = 3; g.beginPath(); g.moveTo(VALVE.x, -18); g.lineTo(VALVE.x, -8); g.stroke();
    /* the vine wire and the tomato vines behind the bed */
    g.strokeStyle = '#9AA6BC'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(BEN.x - 4, 40); g.lineTo(BEN.x + BEN.w + 4, 40); g.stroke();
    for (var v = 0; v < 11; v++) vine(g, BEN.x + 16 + v * 31, v * 1.3);
    /* the air sensor hanging in the vines: a white radiation shield */
    g.strokeStyle = '#7A869C'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(AIR.x, 40); g.lineTo(AIR.x, AIR.y); g.stroke();
    for (var pl = 0; pl < 5; pl++) fillE(g, AIR.x, AIR.y + 8 + pl * 7, 16 - pl * 0.6, 4, pl % 2 ? '#F4F7F6' : '#FFFFFF');
    fillRR(g, AIR.x - 9, AIR.y + 40, 18, 12, 3, '#FFFFFF'); g.strokeStyle = '#C9D3DE'; g.lineWidth = 1; rr(g, AIR.x - 9, AIR.y + 40, 18, 12, 3); g.stroke();
    /* the gateway on the post, its antennas; the post's cable down to the dashboard */
    g.strokeStyle = '#3A4458'; g.lineWidth = 2; g.beginPath(); g.moveTo(GW.x + GW.w, GW.y + 30); g.quadraticCurveTo(POST - 4, 220, DASH.x + 10, DASH.y + DASH.h); g.stroke();
    shadowed(g, 6, 2, 0.18, function () { fillRR(g, GW.x, GW.y, GW.w, GW.h, 6, '#FFFFFF'); }); fillRR(g, GW.x, GW.y + GW.h - 10, GW.w, 10, 4, '#E3E8EF');
    [[GW.x + 8, -1], [GW.x + GW.w - 8, 1]].forEach(function (a) { g.save(); g.translate(a[0], GW.y); g.rotate(a[1] * 0.18); fillRR(g, -2, -26, 4, 26, 2, '#3A4458'); fillE(g, 0, -27, 3, 3, '#3A4458'); g.restore(); });
    text(g, 'GATEWAY', GW.x + GW.w / 2, GW.y + 37.5, 5.4, 800, '#5C6B7A', 'center');
    /* the step ladder (the support engineer stands on its top step) */
    var lx = TECH.x; g.strokeStyle = '#C9A44A'; g.lineWidth = 6; g.lineCap = 'round'; g.beginPath(); g.moveTo(lx - 30, F); g.lineTo(lx - 12, TECH.y - 4); g.moveTo(lx + 30, F); g.lineTo(lx + 12, TECH.y - 4); g.stroke();
    g.lineWidth = 4; g.strokeStyle = '#B38F35'; g.beginPath(); for (var rg = 0; rg < 3; rg++) { var ry = TECH.y + 30 + rg * 28, w = 14 + (ry - TECH.y) * 0.17; g.moveTo(lx - w, ry); g.lineTo(lx + w, ry); } g.stroke(); fillRR(g, lx - 20, TECH.y - 6, 40, 8, 3, '#E3C36A');
    /* the dashboard on its rolling stand */
    fillRR(g, DASH.x + DASH.w / 2 - 4, DASH.y + DASH.h, 8, F - DASH.y - DASH.h - 6, 3, '#7A869C'); fillRR(g, DASH.x + DASH.w / 2 - 36, F - 8, 72, 6, 3, '#5C6B7A'); fillE(g, DASH.x + DASH.w / 2 - 32, F - 2, 4, 4, '#2A3142'); fillE(g, DASH.x + DASH.w / 2 + 32, F - 2, 4, 4, '#2A3142');
    shadowed(g, 14, 5, 0.24, function () { fillRR(g, DASH.x - 7, DASH.y - 7, DASH.w + 14, DASH.h + 14, 8, '#2A3142'); });
    /* the cold room: insulated panels, the door opening (the door is live), the display, the beacon base, the compressor, the energy meter */
    var cw = CR0.r - CR0.x; soft(g, CR0.x + cw / 2, F + 3, cw * 0.55, 8, 0.24);
    fillRR(g, CR0.x, CR0.y, cw, F - CR0.y, 4, '#F2F6FA'); g.fillStyle = 'rgba(30,60,90,.06)'; for (var pn = CR0.x + 40; pn < CR0.r; pn += 40) g.fillRect(pn, CR0.y, 2, F - CR0.y);
    fillRR(g, CR0.x - 4, CR0.y - 8, cw + 8, 12, 3, '#DDE6EE'); g.fillStyle = 'rgba(30,60,90,.12)'; g.fillRect(CR0.x, CR0.y + 4, cw, 3);
    fillRR(g, DOOR.x - 6, 222, DOOR.w + 12, F - 222, 4, '#C9D3DE'); fillRR(g, DOOR.x, 228, DOOR.w, F - 228, 2, '#1E3A55');
    fillRR(g, DISP.x - 3, DISP.y - 3, DISP.w + 6, DISP.h + 6, 5, '#2A3142');
    fillRR(g, BEAC.x - 10, BEAC.y + 14, 20, 6, 2, '#7A869C');
    fillRR(g, 984, 138, 92, 34, 5, '#C9D3DE'); fillRR(g, 988, 142, 40, 26, 4, '#AEB8C6'); g.strokeStyle = '#8A96A8'; g.lineWidth = 1.2; for (var gr = 0; gr < 5; gr++) { g.beginPath(); g.moveTo(1034, 144 + gr * 5); g.lineTo(1070, 144 + gr * 5); g.stroke(); }
    fillRR(g, METER.x, METER.y, 40, 54, 5, '#FFFFFF'); g.strokeStyle = '#C9D3DE'; g.lineWidth = 1.2; rr(g, METER.x, METER.y, 40, 54, 5); g.stroke(); fillRR(g, METER.x + 6, METER.y + 6, 28, 10, 2, '#1E2A3A'); text(g, 'kWh', METER.x + 20, METER.y + 50, 6, 800, '#8A96A8', 'center');
    fillE(g, 984, 318, 15, 15, '#C9D3DE'); fillE(g, 984, 318, 11, 11, '#BFE4F7'); g.strokeStyle = 'rgba(255,255,255,.8)'; g.lineWidth = 1.2; g.beginPath(); for (var fz = 0; fz < 6; fz++) { var fa = fz * Math.PI / 3; g.moveTo(984, 318); g.lineTo(984 + Math.cos(fa) * 8, 318 + Math.sin(fa) * 8); } g.stroke();
    g.strokeStyle = '#AEB8C6'; g.lineWidth = 4; g.beginPath(); g.moveTo(1010, CR0.y - 6); g.lineTo(1010, 250); g.lineTo(1040, 250); g.stroke();
    fillRR(g, DOOR.x + DOOR.w + 6, 360, 18, 10, 3, '#8A96A8');
    /* the right margin (wide screens): a pallet of produce crates, a hose reel; outside, the van with its tracker */
    if (ext.r > CR0.r) { var pxl = 1112; fillRR(g, pxl, F - 10, 120, 10, 2, '#C99A6B'); for (var cr = 0; cr < 3; cr++) for (var cc = 0; cc < 2; cc++) { var cx = pxl + 4 + cc * 58, cy = F - 40 - cr * 30; fillRR(g, cx, cy, 54, 30, 4, cr % 2 ? '#2E9A58' : '#3FAE6A'); for (var hd = 0; hd < 4; hd++) fillE(g, cx + 9 + hd * 12, cy + 4, 6, 5, hd % 2 ? '#8CD47E' : '#E9483B'); fillRR(g, cx + 6, cy + 12, 42, 4, 2, 'rgba(255,255,255,.4)'); } }
    if (ext.r > 1240) { fillE(g, 1262, 380, 22, 22, '#3FAE6A'); fillE(g, 1262, 380, 9, 9, '#C9D3DE'); fillRR(g, 1256, 400, 12, 70, 3, '#9AA6BC'); }
    propWall(g, ext);
    /* left margin (wide screens): a second bed, a seedling rack, potting bench with soil sacks */
    if (ext.l < -560) { var sl = -740; fillRR(g, sl, 230, 150, 6, 2, '#9AA6BC'); fillRR(g, sl, 300, 150, 6, 2, '#9AA6BC'); fillRR(g, sl, 370, 150, 6, 2, '#9AA6BC'); fillRR(g, sl, 440, 150, 6, 2, '#9AA6BC'); fillRR(g, sl, 220, 5, F - 220, 2, '#7A869C'); fillRR(g, sl + 145, 220, 5, F - 220, 2, '#7A869C');
      [230, 300, 370, 440].forEach(function (y, r) { for (var s = 0; s < 6; s++) { var x = sl + 10 + s * 23; fillRR(g, x, y - 12, 20, 12, 2, '#2A3142'); for (var lf = 0; lf < 2; lf++) fillE(g, x + 6 + lf * 8, y - 14 - r * 2, 4 + r, 3 + r * 0.6, lf ? LEAF : LEAF3); } }); }
    if (ext.l < -380) { var lt = -540; fillRR(g, lt - 26, F - 50, 52, 50, 8, '#D9784E'); fillRR(g, lt - 30, F - 56, 60, 10, 4, '#E58A60'); fillRR(g, lt - 4, 300, 8, F - 350, 3, '#8C6A4A');
      [[0, 270, 52], [-34, 300, 36], [34, 296, 38], [-12, 236, 34], [20, 244, 30]].forEach(function (c, i) { fillE(g, lt + c[0], c[1], c[2], c[2] * 0.85, i % 2 ? LEAF : LEAF2); });
      [[-20, 280], [18, 262], [30, 304], [-36, 306], [0, 240], [8, 296]].forEach(function (c) { fillE(g, lt + c[0], c[1], 6, 6, '#FFD84A'); }); }
    if (ext.l < -500) { var bx2 = -900; fillRR(g, bx2, 380, 240, 14, 3, '#C98E55'); fillRR(g, bx2 + 8, 394, 10, F - 394, 3, '#9A7556'); fillRR(g, bx2 + 222, 394, 10, F - 394, 3, '#9A7556'); fillRR(g, bx2 + 4, 336, 232, 44, 4, '#8C6A4A'); for (var p2 = 0; p2 < 9; p2++) { fillE(g, bx2 + 20 + p2 * 26, 332, 12, 10, p2 % 2 ? LEAF : LEAF2); fillE(g, bx2 + 20 + p2 * 26, 324, 7, 6, LEAF3); }
      [[-620, '#C9A27A'], [-578, '#B5865A']].forEach(function (s) { fillRR(g, s[0], 410, 38, 60, 8, s[1]); text(g, 'SOIL', s[0] + 19, 444, 7, 800, '#FFFFFF', 'center'); }); }
  }
  function paintFront(g, ext) {
    if (ext.l < -100) propBench(g);
    /* the planting bed: legs, the galvanised trough, soil, lettuces and herbs, the sensor stakes' posts */
    var x = BEN.x, w = BEN.w; soft(g, x + w / 2, F + 3, w * 0.55, 8, 0.24);
    [x + 10, x + w - 20, x + w / 2 - 5].forEach(function (lx) { fillRR(g, lx, BT + 10, 10, F - BT - 10, 3, STEEL); }); fillRR(g, x + 10, F - 16, w - 20, 5, 2, '#9AA6BC');
    [[x + 40, '#D9784E'], [x + 110, '#E58A60'], [x + 236, '#D9784E'], [x + 296, '#E58A60']].forEach(function (p2) { fillRR(g, p2[0] - 10, F - 32, 20, 18, 3, p2[1]); fillE(g, p2[0], F - 34, 10, 6, LEAF2); fillE(g, p2[0] - 3, F - 38, 5, 4, LEAF3); });
    fillRR(g, x - 6, TR - 4, w + 12, 12, 3, SOIL); for (var sp = 0; sp < 60; sp++) { g.fillStyle = 'rgba(40,25,10,.35)'; g.fillRect(x + hash(sp) * w, TR - 3 + hash(sp * 3) * 8, 2, 2); }
    var tg = g.createLinearGradient(0, TR + 6, 0, BT); tg.addColorStop(0, '#DDE4EA'); tg.addColorStop(1, '#BAC5CF'); g.fillStyle = tg; rr(g, x - 6, TR + 6, w + 12, BT - TR - 6, 4); g.fill();
    g.fillStyle = 'rgba(255,255,255,.4)'; g.fillRect(x - 4, TR + 9, w + 8, 3); g.strokeStyle = 'rgba(90,100,110,.22)'; g.lineWidth = 1; g.beginPath(); for (var rb = x + 30; rb < x + w; rb += 40) { g.moveTo(rb, TR + 8); g.lineTo(rb, BT - 2); } g.stroke();
    fillRR(g, x - 8, BT, w + 16, 12, 3, '#C98E55'); g.fillStyle = 'rgba(255,255,255,.3)'; g.fillRect(x - 6, BT + 2, w + 12, 2);
    for (var p = 0; p < 14; p++) { var px = x + 8 + p * 24, kind = p % 3; if (STAKES.some(function (s) { return Math.abs(s - px) < 10; })) continue;
      if (kind === 0) { for (var lf = 0; lf < 6; lf++) { var a = lf / 6 * Math.PI * 2; fillE(g, px + Math.cos(a) * 7, TR - 6 + Math.sin(a) * 3, 9, 7, lf % 2 ? LEAF3 : '#8CD47E'); } fillE(g, px, TR - 9, 6, 5, '#B5E8A2'); }
      else if (kind === 1) { for (var hb = 0; hb < 5; hb++) { g.strokeStyle = LEAF2; g.lineWidth = 1.6; g.beginPath(); g.moveTo(px + (hb - 2) * 3, TR); g.lineTo(px + (hb - 2) * 5, TR - 20 - (hb % 2) * 6); g.stroke(); fillE(g, px + (hb - 2) * 5, TR - 20 - (hb % 2) * 6, 3.5, 2.5, LEAF); } }
      else { fillE(g, px, TR - 8, 11, 9, '#2E9A58'); fillE(g, px - 4, TR - 12, 6, 5, LEAF3); fillE(g, px + 5, TR - 7, 5, 4, '#9FDB8C'); } }
    STAKES.forEach(function (sx) { fillRR(g, sx - 2, TR - 40, 4, 46, 1.5, '#E3E8EF'); fillRR(g, sx - 9, TR - 58, 18, 22, 4, '#FFFFFF'); g.strokeStyle = '#C9D3DE'; g.lineWidth = 1; rr(g, sx - 9, TR - 58, 18, 22, 4); g.stroke(); g.strokeStyle = '#7A869C'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(sx + 5, TR - 58); g.lineTo(sx + 7, TR - 72); g.stroke(); });
    /* the packing table: scale, the Odoo IoT box, the label printer */
    var tx = TAB.x; soft(g, tx + TAB.w / 2, F + 3, TAB.w * 0.6, 6, 0.24); fillRR(g, tx + 6, 398, 7, F - 398, 2, STEEL); fillRR(g, tx + TAB.w - 13, 398, 7, F - 398, 2, STEEL); fillRR(g, tx + 6, F - 26, TAB.w - 12, 5, 2, '#9AA6BC');
    fillRR(g, tx + 12, F - 46, 30, 20, 3, '#3FAE6A'); fillRR(g, tx + 46, F - 46, 30, 20, 3, '#F2D59B');
    fillRR(g, tx - 4, 388, TAB.w + 8, 10, 3, '#E3E8EF'); fillRR(g, tx - 4, 388, TAB.w + 8, 3, 2, '#FFFFFF');
    fillRR(g, tx + 4, 380, 38, 8, 2, '#C9D3DE'); fillRR(g, tx + 10, 372, 26, 8, 2, '#E3E8EF'); fillRR(g, tx + 14, 381, 18, 5, 1, '#1E2A3A');
    fillRR(g, tx + 46, 370, 20, 18, 3, PUR); fillE(g, tx + 56, 377, 4, 4, '#FFFFFF'); fillE(g, tx + 56, 377, 2, 2, PUR);
    fillRR(g, tx + 70, 366, 24, 22, 4, '#2A3142'); fillRR(g, tx + 73, 368, 18, 3, 1, '#111827');
    g.strokeStyle = '#5C6B7A'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(tx + 42, 384); g.lineTo(tx + 46, 384); g.moveTo(tx + 66, 382); g.lineTo(tx + 70, 382); g.stroke();
  }
  function pot(g, x, y, r, kind) { soft(g, x, y + 2, r * 1.3, 4, 0.24); g.fillStyle = '#D9784E'; g.beginPath(); g.moveTo(x - r, y - r * 1.6); g.lineTo(x + r, y - r * 1.6); g.lineTo(x + r * 0.75, y); g.lineTo(x - r * 0.75, y); g.closePath(); g.fill(); fillRR(g, x - r - 3, y - r * 1.6 - 6, r * 2 + 6, 8, 3, '#E58A60');
      if (kind) { for (var l = 0; l < 7; l++) { var a = -Math.PI / 2 + (l - 3) * 0.4; g.save(); g.translate(x, y - r * 1.6 - 4); g.rotate(a + Math.PI / 2); fillE(g, 0, -r * 1.1, r * 0.35, r * 1.1, l % 2 ? LEAF : LEAF2); g.restore(); } }
      else { fillE(g, x, y - r * 2.2, r * 1.1, r * 0.8, LEAF2); fillE(g, x - r * 0.5, y - r * 2.5, r * 0.6, r * 0.5, LEAF3); fillE(g, x + r * 0.4, y - r * 2.6, r * 0.25, r * 0.25, '#FF8FA3'); fillE(g, x - r * 0.3, y - r * 2.0, r * 0.22, r * 0.22, '#FFD84A'); } }
  function paintFore(g, ext) {
    g.save(); g.translate(0, -26); /* the front row sits a little higher, clear of the glance strip on wide screens */
    /* terracotta pots with plants, seedling trays, a coiled hose, a watering can, a wheelbarrow, crates of greens */
    pot(g, 196, 712, 26, 1); pot(g, 256, 720, 18, 0); pot(g, 318, 722, 14, 1);
    var tx = 380; soft(g, tx + 70, 740, 90, 5, 0.22); for (var t = 0; t < 2; t++) { fillRR(g, tx + t * 74, 714, 70, 22, 3, '#2A3142'); for (var c = 0; c < 6; c++) { fillRR(g, tx + 4 + t * 74 + c * 11, 718, 9, 9, 1, '#1B2433'); fillE(g, tx + 8.5 + t * 74 + c * 11, 714, 4, 3, c % 2 ? LEAF3 : '#9FDB8C'); } }
    var hx = 560; soft(g, hx, 744, 46, 6, 0.24); g.strokeStyle = '#2E9A58'; g.lineWidth = 6; for (var h = 0; h < 4; h++) { g.beginPath(); g.ellipse(hx, 728 - h * 4, 34 - h * 3, 12 - h, 0, 0, Math.PI * 2); g.stroke(); } fillRR(g, hx + 30, 716, 14, 8, 3, '#F5A524');
    var wx = 660; soft(g, wx, 744, 30, 5, 0.24); fillRR(g, wx - 20, 704, 40, 38, 8, '#3FA9E0'); g.strokeStyle = '#3FA9E0'; g.lineWidth = 5; g.beginPath(); g.moveTo(wx + 18, 714); g.lineTo(wx + 46, 694); g.stroke(); fillRR(g, wx + 42, 688, 12, 8, 3, '#2E8FD0'); g.beginPath(); g.arc(wx, 704, 14, Math.PI, 0); g.stroke();
    var bx = 780; soft(g, bx + 40, 748, 66, 6, 0.24); g.fillStyle = '#3167CA'; g.beginPath(); g.moveTo(bx, 690); g.lineTo(bx + 96, 690); g.lineTo(bx + 80, 730); g.lineTo(bx + 14, 730); g.closePath(); g.fill(); fillE(g, bx + 48, 690, 48, 7, '#6E5238');
    fillE(g, bx + 88, 736, 12, 12, '#2A3142'); fillE(g, bx + 88, 736, 5, 5, '#9AA6BC'); g.strokeStyle = '#5C6B7A'; g.lineWidth = 4; g.beginPath(); g.moveTo(bx + 4, 700); g.lineTo(bx - 34, 716); g.moveTo(bx + 20, 730); g.lineTo(bx + 16, 748); g.stroke();
    g.restore();
  }

  /* ---------------- live ---------------- */
  var TAP = {}, MIST = [], DROPS = [], PINGS = [], FW = { t: -9 }, MISTK = { t: -9 };
  function paintWindow(g, t, par, S) {
    var e = S.ext;
    for (var c = 0; c < 6; c++) { var sp = 3 + c * 1.4, span = e.r - e.l + 500, x = e.l - 250 + ((hash(c + 5) * span + t * sp) % span), y = -260 + (c % 3) * 60 + (c > 2 ? 130 : 0); K.cloud(g, x, y, 0.18 + hash(c) * 0.12); }
    g.strokeStyle = 'rgba(40,60,90,.5)'; g.lineWidth = 1.5; g.lineCap = 'round';
    for (var b = 0; b < 4; b++) { var bsp = e.r - e.l + 300, bx = e.l - 100 + ((t * (12 + b * 3) + hash(b + 4) * bsp) % bsp), by = -80 + b * 22 + Math.sin(t * 0.9 + b) * 6, fl = Math.sin(t * 8 + b * 2) * 4;
      g.beginPath(); g.moveTo(bx - 6, by - fl); g.quadraticCurveTo(bx - 3, by - 3, bx, by); g.quadraticCurveTo(bx + 3, by - 3, bx + 6, by - fl); g.stroke(); }
    /* the windsock and the van with its location tracker (wide screens) */
    var ws = Math.sin(t * 1.3) * 0.15; g.save(); g.translate(1198, 122); g.rotate(ws); for (var s = 0; s < 4; s++) { g.fillStyle = s % 2 ? '#FFFFFF' : '#F08A24'; g.fillRect(s * 9, -5 + s * 0.6, 9, 10 - s * 1.2); } g.restore();
    if (e.r > 1120) { var vx = 1130 + Math.sin(t * 0.2) * 0; fillRR(g, vx, 236, 120, 46, 9, '#FFFFFF'); fillRR(g, vx + 88, 242, 26, 16, 3, '#9FC9E8'); fillRR(g, vx, 262, 122, 6, 2, '#3FAE6A'); CO.plane(g, vx + 18, 250, 0.8, 0, BLUE); text(g, 'TechNext', vx + 26, 254, 9, 800, BLUE); fillE(g, vx + 24, 284, 10, 10, '#2A3142'); fillE(g, vx + 98, 284, 10, 10, '#2A3142');
      var py = 206 + Math.sin(t * 2.4) * 4; g.fillStyle = RED; g.beginPath(); g.arc(vx + 60, py, 9, Math.PI, 0); g.lineTo(vx + 60, py + 16); g.closePath(); g.fill(); fillE(g, vx + 60, py, 3.5, 3.5, '#FFFFFF');
      var rp = (t * 0.8) % 1; g.strokeStyle = 'rgba(224,69,107,' + (0.6 * (1 - rp)).toFixed(2) + ')'; g.lineWidth = 1.6; g.beginPath(); g.ellipse(vx + 60, py + 18, 6 + rp * 20, 2 + rp * 6, 0, 0, Math.PI * 2); g.stroke(); }
    CO.crew(OUT_CREW, g, t, S, false);
  }
  function stakeVal(i, t, S) { var base = [41, 38, 44][i], wat = S.wat || 0; return base + Math.sin(t * 0.3 + i) * 0.6 + (i === 1 || i === 2 ? wat * 6 : wat * 2); }
  function paintLive(g, t, now, S) {
    var e = S.ext, C = cyc(t), R = room(C); S.C = C; S.R = R;
    /* roof vents: open as the air warms (and on the dashboard's air tile) */
    var air = 24.2 + Math.sin(t * 0.15) * 0.8, vo = clamp((air - 23.8) / 1.2, 0, 1);
    for (var vx = Math.floor(e.l / 240) * 240 + 40; vx < e.r; vx += 240) { g.save(); g.translate(vx, -110); g.fillStyle = 'rgba(200,236,230,.7)'; g.beginPath(); g.moveTo(0, 0); g.lineTo(90, 0); g.lineTo(90 - vo * 6, -26 - vo * 10); g.lineTo(-vo * 6, -26 - vo * 10); g.closePath(); g.fill(); g.strokeStyle = '#FFFFFF'; g.lineWidth = 2.5; g.stroke(); g.restore(); }
    /* hanging baskets sway */
    [[545, 0], [845, 1.6], [1150, 0.8], [-600, 2.2], [-860, 1.1]].forEach(function (b) { var bx = b[0]; if (bx < e.l - 60 || bx > e.r + 60) return; var a = Math.sin(t * 1.1 + b[1]) * 0.06; g.save(); g.translate(bx, EAVE); g.rotate(a);
      g.strokeStyle = '#7A869C'; g.lineWidth = 1; g.beginPath(); g.moveTo(0, 0); g.lineTo(-14, 40); g.moveTo(0, 0); g.lineTo(14, 40); g.stroke();
      fillE(g, 0, 42, 18, 8, '#8C6A4A'); fillE(g, 0, 44, 16, 9, '#7A5A3E'); for (var l = 0; l < 7; l++) { var lx = -14 + l * 4.6; g.strokeStyle = l % 2 ? LEAF : LEAF2; g.lineWidth = 2.2; g.beginPath(); g.moveTo(lx, 44); g.quadraticCurveTo(lx + Math.sin(t + l) * 3, 64, lx - 2, 74 + (l % 3) * 8); g.stroke(); }
      for (var f = 0; f < 4; f++) fillE(g, -10 + f * 7, 38, 3, 3, ['#FF8FA3', '#FFD84A', '#FFFFFF', '#FF8FA3'][f]); g.restore(); });
    /* circulation fans hanging under the eave, turning */
    [770, 1210, -520, -900].forEach(function (fx, i) { if (fx < e.l - 40 || fx > e.r + 40) return; g.fillStyle = '#9AA6BC'; g.fillRect(fx - 1, EAVE, 2, 18); fillE(g, fx, EAVE + 34, 19, 19, '#E3E8EF'); fillE(g, fx, EAVE + 34, 16, 16, '#F6F8FB');
      g.save(); g.translate(fx, EAVE + 34); g.rotate(t * 7 + i); g.fillStyle = '#9FB0C2'; for (var bl = 0; bl < 4; bl++) { g.rotate(Math.PI / 2); g.beginPath(); g.ellipse(0, -8, 4, 8, 0.3, 0, Math.PI * 2); g.fill(); } g.restore();
      g.strokeStyle = 'rgba(150,165,185,.6)'; g.lineWidth = 1; g.beginPath(); g.arc(fx, EAVE + 34, 12, 0, Math.PI * 2); g.moveTo(fx - 16, EAVE + 34); g.lineTo(fx + 16, EAVE + 34); g.stroke(); fillE(g, fx, EAVE + 34, 3, 3, '#7A869C'); });
    /* mist from the line: a puff every few seconds, a cloud on the valve */
    var mk = t - MISTK.t < 2.4; if (Math.floor(t * (mk ? 10 : 1.2)) !== S.mf) { S.mf = Math.floor(t * (mk ? 10 : 1.2)); var nz = Math.floor(e.l / 60) * 60 + 30 + Math.floor(hash(S.mf) * ((e.r - e.l) / 60)) * 60; MIST.push({ x: nz, t0: t }); if (mk) MIST.push({ x: nz + 120, t0: t }); }
    MIST = MIST.filter(function (m) { return t - m.t0 < 2.2; }); if (MIST.length > 40) MIST.splice(0, MIST.length - 40);
    MIST.forEach(function (m) { var q = (t - m.t0) / 2.2; for (var p = 0; p < 3; p++) fillE(g, m.x + (p - 1) * 8 * (1 + q), -8 + q * 34 + p * 3, 5 + q * 12, 3 + q * 7, 'rgba(255,255,255,' + (0.55 * (1 - q)).toFixed(2) + ')'); });
    var vr = t * (mk ? 6 : 0); g.save(); g.translate(VALVE.x, -6); g.rotate(vr); g.strokeStyle = RED; g.lineWidth = 2.6; g.beginPath(); g.arc(0, 0, 7, 0, Math.PI * 2); g.stroke(); g.beginPath(); g.moveTo(-7, 0); g.lineTo(7, 0); g.moveTo(0, -7); g.lineTo(0, 7); g.stroke(); g.restore();
    /* sensor pings: each stake and the air sensor report in turn; a dot flies to the gateway */
    var period = 1.6, idx = Math.floor(t / period), srcs = [[STAKES[0], TR - 48], [STAKES[1], TR - 48], [STAKES[2], TR - 48], [AIR.x, AIR.y + 46], [DOOR.x + DOOR.w - 2, 236], [DISP.x + DISP.w / 2, DISP.y]];
    if (idx !== S.pi) { S.pi = idx; PINGS.push({ s: idx % srcs.length, t0: t }); if (S.hot === 'sensors') PINGS.push({ s: (idx + 2) % 4, t0: t }); }
    PINGS = PINGS.filter(function (p) { return t - p.t0 < 1.4; }); S.pk = null;
    PINGS.forEach(function (p) { var q = (t - p.t0) / 1.4, s = srcs[p.s], dest = [GW.x + GW.w / 2, GW.y + 12], mid = [(s[0] + dest[0]) / 2, Math.min(s[1], dest[1]) - 60];
      if (q < 0.25) { var rq = q / 0.25; g.strokeStyle = 'rgba(20,163,163,' + (0.8 * (1 - rq)).toFixed(2) + ')'; g.lineWidth = 2; g.beginPath(); g.arc(s[0], s[1], 6 + rq * 18, -2.6, -0.5); g.stroke(); }
      var f = smooth(clamp((q - 0.1) / 0.8, 0, 1)), pt = quad(s, mid, dest, f); if (q > 0.1 && q < 0.92) { fillE(g, pt[0], pt[1], 6, 6, 'rgba(20,163,163,.25)'); fillE(g, pt[0], pt[1], 3.2, 3.2, p.s >= 4 ? FROST : TEAL); S.pk = pt; } });
    /* the gateway: LEDs, a firmware bar on a tap */
    var gwOn = PINGS.some(function (p) { return t - p.t0 > 1.1; });
    for (var l = 0; l < 3; l++) fillE(g, GW.x + 9 + l * 10, GW.y + 12, 2.6, 2.6, l === 0 ? OK : l === 1 ? (gwOn ? '#FFD84A' : '#5C6B7A') : ((t % 1.2) < 0.6 ? TEAL : '#B7E8E8'));
    if (S.hot === 'gateway' || gwOn) { var rq2 = (t * 1.3) % 1; g.strokeStyle = 'rgba(20,163,163,' + (0.6 * (1 - rq2)).toFixed(2) + ')'; g.lineWidth = 1.8; for (var a2 = 0; a2 < 2; a2++) { g.beginPath(); g.arc(GW.x + GW.w / 2, GW.y - 24, 8 + rq2 * 22 + a2 * 9, -2.4, -0.7); g.stroke(); } }
    var fw = t - FW.t; if (fw < 3) { var fq = clamp(fw / 2, 0, 1); fillRR(g, GW.x - 18, GW.y - 46, 74, 16, 5, '#FFFFFF'); fillRR(g, GW.x - 14, GW.y - 40, 50, 5, 2.5, '#E3E8EF'); fillRR(g, GW.x - 14, GW.y - 40, 50 * fq, 5, 2.5, fq >= 1 ? OK : TEAL); text(g, fq >= 1 ? '✓' : Math.round(fq * 100) + '%', GW.x + 48, GW.y - 34, 7, 800, fq >= 1 ? OK : INK, 'center'); }
    /* the dashboard */
    var d = DASH, alert = R.alert, hot = S.hot === 'dash';
    fillRR(g, d.x, d.y, d.w, d.h, 3, '#FFFFFF'); fillRR(g, d.x, d.y, d.w, 16, 3, alert ? '#E07B12' : '#1E7A55'); g.fillRect(d.x, d.y + 10, d.w, 6);
    fillE(g, d.x + 9, d.y + 8, 2.8, 2.8, (t % 1) < 0.6 ? '#FFFFFF' : 'rgba(255,255,255,.4)'); text(g, 'GREENHOUSE · LIVE', d.x + 16, d.y + 11.4, 7, 800, '#FFFFFF');
    var dt = new Date(); text(g, ('0' + dt.getHours()).slice(-2) + ':' + ('0' + dt.getMinutes()).slice(-2), d.x + d.w - 6, d.y + 11.4, 7, 800, '#FFFFFF', 'right');
    var hum = 68 + (t - MISTK.t < 6 ? 6 * Math.max(0, 1 - (t - MISTK.t) / 6) : 0) + Math.sin(t * 0.4) * 0.6, soil = (stakeVal(0, t, S) + stakeVal(1, t, S) + stakeVal(2, t, S)) / 3;
    var tiles = [['Air', air.toFixed(1) + '°', LEAF2], ['Humidity', Math.round(hum) + '%', '#2E8FD0'], ['Soil', Math.round(soil) + '%', '#8C6A4A']];
    tiles.forEach(function (tl, i) { var x = d.x + 5 + i * 51, y = d.y + 20, on = hot && Math.floor(t * 1.5) % 5 === i; fillRR(g, x, y, 48, 30, 4, on ? '#EAF7EF' : '#F4F7F6'); text(g, tl[0], x + 4, y + 9, 5.4, 800, '#6B7A74'); text(g, tl[1], x + 4, y + 24, 11, 800, tl[2]); });
    var cy = d.y + 54, cold = R.temp > 5, on2 = hot && Math.floor(t * 1.5) % 5 === 3; fillRR(g, d.x + 5, cy, 99, 46, 4, cold ? '#FFF1DE' : (on2 ? '#EAF4FB' : '#F4F7F6')); text(g, 'Cold room 1', d.x + 9, cy + 9, 5.6, 800, '#6B7A74'); text(g, R.temp.toFixed(1) + ' °C', d.x + 9, cy + 25, 12, 800, cold ? '#C2410C' : '#2E8FD0');
    g.strokeStyle = cold ? '#E07B12' : '#3FA9E0'; g.lineWidth = 1.3; g.beginPath(); for (var sp = 0; sp < 24; sp++) { var tt = t - (23 - sp) * 0.5, cc = cyc(tt), rr2 = room(cc), yv = cy + 42 - clamp((rr2.temp - 2.8) / 3.2, 0, 1) * 14; if (sp) g.lineTo(d.x + 9 + sp * 3.9, yv); else g.moveTo(d.x + 9, yv); } g.stroke();
    g.strokeStyle = 'rgba(224,69,107,.6)'; g.setLineDash([2, 2]); g.lineWidth = 0.8; var ly = cy + 42 - clamp((5 - 2.8) / 3.2, 0, 1) * 14; g.beginPath(); g.moveTo(d.x + 9, ly); g.lineTo(d.x + 100, ly); g.stroke(); g.setLineDash([]); text(g, 'door ' + (R.door > 0.05 ? 'open' : 'closed'), d.x + 100, cy + 9, 5.4, 800, R.door > 0.05 ? '#C2410C' : '#6B7A74', 'right');
    var kw = 2.1 + (R.door > 0.5 ? 0.6 : 0) + Math.sin(t * 0.6) * 0.05, on3 = hot && Math.floor(t * 1.5) % 5 === 4; fillRR(g, d.x + 107, cy, 48, 46, 4, on3 ? '#FFF6DC' : '#F4F7F6'); text(g, 'Energy', d.x + 111, cy + 9, 5.4, 800, '#6B7A74'); text(g, kw.toFixed(1), d.x + 111, cy + 26, 12, 800, '#B9720F'); text(g, 'kW', d.x + 111, cy + 36, 6, 800, '#B9720F');
    var by = d.y + d.h - 30, msg, mc, mf;
    if (R.rec) { msg = 'Recovered · back in range ✓'; mc = '#E6F6EC'; mf = '#1E7A55'; } else if (R.odoo) { msg = 'Odoo · quality check opened'; mc = '#F3E9F0'; mf = PUR; } else if (alert) { msg = 'Cold room 1 above 5 °C · door open'; mc = '#FFE8C7'; mf = '#9A4A07'; } else { msg = 'All readings in range ✓'; mc = '#E6F6EC'; mf = '#1E7A55'; }
    fillRR(g, d.x + 5, by, d.w - 10, 24, 4, mc); if (R.odoo && !R.rec) { fillE(g, d.x + 15, by + 12, 5, 5, PUR); fillE(g, d.x + 15, by + 12, 2.2, 2.2, '#FFFFFF'); } else fillE(g, d.x + 15, by + 12, 4, 4, mf);
    text(g, msg, d.x + 24, by + 15, 6.8, 800, mf);
    /* the cold room: the display, the beacon, the door contact, the compressor fan, the meter's digits */
    var hotC = R.temp > 5; fillRR(g, DISP.x, DISP.y, DISP.w, DISP.h, 3, '#0F1A2A'); text(g, R.temp.toFixed(1) + '°C', DISP.x + DISP.w / 2, DISP.y + 20, 14, 800, hotC ? ((t % 0.6) < 0.3 ? '#FFB547' : '#FF7A45') : '#7FE3F5', 'center');
    var spin = alert ? t * 8 : 0; g.save(); g.translate(BEAC.x, BEAC.y + 8); fillRR(g, -8, -6, 16, 16, 6, alert ? '#FFB547' : '#F6D9A8'); g.fillStyle = 'rgba(255,255,255,.6)'; g.fillRect(-6, -3, 3, 10); if (alert) { g.globalAlpha = 0.5; g.fillStyle = 'rgba(255,181,71,.6)'; g.beginPath(); g.moveTo(0, 2); g.lineTo(Math.cos(spin) * 50, 2 + Math.sin(spin) * 10 - 6); g.lineTo(Math.cos(spin + 0.4) * 50, 2 + Math.sin(spin + 0.4) * 10 - 6); g.closePath(); g.fill(); } g.restore();
    fillRR(g, DOOR.x + DOOR.w - 6, 230, 10, 8, 2, '#FFFFFF'); fillE(g, DOOR.x + DOOR.w - 1, 234, 1.8, 1.8, R.door > 0.05 ? ((t % 0.5) < 0.25 ? RED : '#FFB3B3') : OK);
    g.save(); g.translate(1008, 155); g.rotate(t * (R.door > 0.5 ? 14 : 6)); g.fillStyle = '#8A96A8'; for (var bl = 0; bl < 4; bl++) { g.rotate(Math.PI / 2); g.beginPath(); g.ellipse(0, -6, 3, 6, 0, 0, Math.PI * 2); g.fill(); } g.restore();
    text(g, (1284.6 + t * 0.002 * (R.door > 0.5 ? 1.3 : 1)).toFixed(1), METER.x + 20, METER.y + 14.5, 7, 800, '#7FF0CF', 'center'); g.save(); g.translate(METER.x + 20, METER.y + 32); fillE(g, 0, 0, 11, 11, '#E3E8EF'); g.rotate(t * (R.door > 0.5 ? 6 : 3)); fillRR(g, -1.2, -10, 2.4, 10, 1, RED); g.restore();
    /* the door and what is inside: shelves of crates, cold mist spilling out */
    var dop = R.door; if (dop > 0.02) { fillRR(g, DOOR.x, 228, DOOR.w, F - 228, 2, '#24476A'); for (var sh = 0; sh < 3; sh++) { var sy = 270 + sh * 60; fillRR(g, DOOR.x + 6, sy, DOOR.w - 12, 4, 1, '#9AB8D0'); for (var cr = 0; cr < 3; cr++) fillRR(g, DOOR.x + 10 + cr * 20, sy - 18, 17, 18, 2, cr % 2 ? '#3FAE6A' : '#2E9A58'); }
      for (var mp = 0; mp < 5; mp++) { var mq = ((t * 0.5 + mp / 5) % 1); fillE(g, DOOR.x + 10 + mp * 14 - mq * 30, F - 10 + mq * 8, 12 + mq * 18, 5 + mq * 4, 'rgba(225,244,255,' + (0.55 * (1 - mq) * dop).toFixed(2) + ')'); } }
    var dw = DOOR.w * Math.cos(dop * 1.35); g.fillStyle = '#F7FAFC'; g.beginPath(); g.moveTo(DOOR.x, 228); g.lineTo(DOOR.x - (DOOR.w - dw) * 0.9 + dw - (dop > 0.02 ? DOOR.w * 0.0 : 0), 228 - dop * 14); g.lineTo(DOOR.x - (DOOR.w - dw) * 0.9 + dw, F + dop * 10); g.lineTo(DOOR.x, F); g.closePath(); g.fill();
    if (dop < 0.3) { var hx = DOOR.x - (DOOR.w - dw) * 0.9 + dw - 12; fillRR(g, hx, 320, 6, 42, 3, '#8A96A8'); fillRR(g, DOOR.x + 8, 240, Math.max(0, dw - 20), 20, 3, 'rgba(127,200,240,.35)');
      if (dop < 0.08) { fillRR(g, DOOR.x + 8, 270, DOOR.w - 16, 30, 4, '#1E3A55'); text(g, 'COLD ROOM 1', DOOR.x + DOOR.w / 2, 284, 7.4, 800, '#FFFFFF', 'center'); text(g, 'limit 5 °C', DOOR.x + DOOR.w / 2, 294, 6, 700, FROST, 'center'); } }
    g.strokeStyle = '#C9D3DE'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(DOOR.x, 228); g.lineTo(DOOR.x - (DOOR.w - dw) * 0.9 + dw, 228 - dop * 14); g.lineTo(DOOR.x - (DOOR.w - dw) * 0.9 + dw, F + dop * 10); g.stroke();
  }

  /* ---------------- in front of the cast: the bed's stake LEDs, held props, the phone alert ---------------- */
  var RAIN = { t: -9 };
  function paintFrontLive(g, t, S) {
    if (S.ext.l < 140) { propLive(g, t, S); trolley(g, t); bagsLive(g, t); danish(g, t); }
    var R = S.R || room(cyc(t));
    STAKES.forEach(function (sx, i) { var v = stakeVal(i, t, S); fillRR(g, sx - 6, TR - 54, 12, 8, 1.5, '#1E2A3A'); text(g, Math.round(v) + '', sx, TR - 47.6, 6.2, 800, '#7FF0CF', 'center'); fillE(g, sx, TR - 41, 1.8, 1.8, (t + i * 0.5) % 1.6 < 0.2 ? '#FFFFFF' : OK); });
    fillE(g, AIR.x + 5, AIR.y + 46, 1.8, 1.8, (t % 1.6) < 0.2 ? '#FFFFFF' : OK);
    /* the scale's readout and the label printer's paper */
    var C = S.C || cyc(t), u = C.u, kg = u < 0.12 ? 12.4 * smooth(seg(u, 0.01, 0.06)) : 0, tp = TAP.pack && t - TAP.pack < 2.6; if (tp) kg = 18.2;
    text(g, kg ? kg.toFixed(1) : '0.0', TAB.x + 23, 385, 5, 800, '#7FF0CF', 'center');
    var lab = tp ? clamp((t - TAP.pack) / 1.6, 0, 1) * 40 : (u > 0.05 && u < 0.14 ? seg(u, 0.05, 0.1) * 14 : 0);
    if (lab > 0.5) { g.save(); g.translate(TAB.x + 82, 371); fillRR(g, -8, -lab, 16, lab, 1, '#FFFFFF'); g.strokeStyle = '#C9D3DE'; g.lineWidth = 0.6; rr(g, -8, -lab, 16, lab, 1); g.stroke(); g.fillStyle = '#1B2433'; for (var bc = 0; bc < 5; bc++) g.fillRect(-6 + bc * 2.6, -lab + 3, bc % 2 ? 1 : 1.8, 5); if (lab > 20) { g.fillStyle = PUR; g.fillRect(-6, -lab + 11, 12, 2.5); } g.restore(); }
    props(g, t, S, R);
    /* the supervisor's phone alert, big enough to read */
    var al = R.alert ? Math.min(1, seg(u, 0.5, 0.53)) * (1 - seg(u, 0.83, 0.86)) : 0, ack = TAP.sup && t - TAP.sup < 2.8;
    if (al > 0.01 || ack) { var bx = 666, by = 186; g.save(); g.globalAlpha = ack ? 1 : al; fillRR(g, bx + 2, by + 4, 104, 50, 9, 'rgba(30,60,50,.16)'); fillRR(g, bx, by, 104, 50, 9, '#FFFFFF'); g.fillStyle = '#FFFFFF'; g.beginPath(); g.moveTo(bx + 60, by + 50); g.lineTo(bx + 70, by + 60); g.lineTo(bx + 74, by + 50); g.fill();
      fillRR(g, bx, by, 104, 14, 9, '#25D366'); g.fillRect(bx, by + 8, 104, 6); text(g, 'WhatsApp · IoT alert', bx + 8, by + 10.4, 6.6, 800, '#FFFFFF');
      if (ack) { text(g, 'Acknowledged ✓', bx + 8, by + 28, 8.4, 800, '#1E7A55'); text(g, 'door closed, room recovering', bx + 8, by + 40, 6, 700, '#8A96A8'); }
      else { text(g, 'Cold room 1: ' + R.temp.toFixed(1) + ' °C', bx + 8, by + 27, 7.8, 800, INK); text(g, 'door open · limit 5 °C', bx + 8, by + 36, 6, 700, '#8A96A8'); fillRR(g, bx + 8, by + 39, 46, 8, 4, BLUE); text(g, 'Acknowledge', bx + 31, by + 45, 5.4, 800, '#FFFFFF', 'center'); }
      g.restore(); }
    /* the grower's rainbow spray */
    var rq = t - RAIN.t; if (rq < 2.2) { var hg = handAt(GROW, 1), a0 = Math.min(1, rq / 0.5) * (1 - seg(rq, 1.6, 2.2)); g.save(); g.globalAlpha = a0 * 0.75; ['#FF6F6F', '#FFB547', '#FFE36B', '#7BD389', '#6FB7F5', '#9B8CF2'].forEach(function (c, i) { g.strokeStyle = c; g.lineWidth = 3; g.beginPath(); g.arc(hg[0] - 70, hg[1] + 40, 76 - i * 3.2, Math.PI * 1.05, Math.PI * 1.95); g.stroke(); }); g.restore(); }
    DROPS = DROPS.filter(function (d2) { return t - d2.t0 < 0.9; }); DROPS.forEach(function (d2) { var q = (t - d2.t0) / 0.9; fillE(g, d2.x + d2.vx * q, d2.y + q * q * 60, 1.6, 2.6, 'rgba(63,169,224,' + (0.8 * (1 - q)).toFixed(2) + ')'); });
  }
  function props(g, t, S, R) {
    /* the engineer: a new stake in her right hand; on a tap, held high and pairing */
    var he = handAt(ENG, 1); g.save(); g.translate(he[0], he[1]); g.rotate(ENG.hiStake ? 0 : 0.15); fillRR(g, -2, -4, 4, 26, 1.5, '#E3E8EF'); fillRR(g, -7, -18, 14, 16, 3, '#FFFFFF'); fillE(g, 3, -12, 1.8, 1.8, ENG.hiStake ? ((t % 0.4) < 0.2 ? OK : '#FFFFFF') : '#C9D3DE'); g.restore();
    if (ENG.hiStake) { for (var r = 0; r < 3; r++) { var q = ((t - TAP.eng) * 1.3 + r / 3) % 1; g.strokeStyle = 'rgba(20,163,163,' + (0.8 * (1 - q)).toFixed(2) + ')'; g.lineWidth = 2; g.beginPath(); g.arc(he[0], he[1] - 18, 8 + q * 30, -2.4, -0.7); g.stroke(); }
      if (t - TAP.eng > 1) { fillRR(g, he[0] - 26, he[1] - 66, 54, 16, 8, '#FFFFFF'); text(g, 'Paired ✓', he[0] + 1, he[1] - 55, 8, 800, '#1E7A55', 'center'); } }
    /* the grower's watering can */
    var hg = handAt(GROW, 1), tilt = GROW.pour || 0; g.save(); g.translate(hg[0], hg[1]); g.rotate(-tilt * 0.7); fillRR(g, -14, -6, 26, 22, 6, '#3FA9E0'); g.strokeStyle = '#3FA9E0'; g.lineWidth = 4; g.beginPath(); g.moveTo(-12, 2); g.lineTo(-32, -10); g.stroke(); fillRR(g, -38, -15, 9, 7, 2, '#2E8FD0'); g.lineWidth = 3; g.beginPath(); g.arc(0, -6, 9, Math.PI, 0); g.stroke(); g.restore();
    if (tilt > 0.6 && Math.random() < 0.6) { var sx = hg[0] - 34 * Math.cos(tilt * 0.7) + 10, sy = hg[1] - 6; DROPS.push({ x: sx, y: sy, vx: (Math.random() - 0.5) * 16, t0: t }); }
    if (DROPS.length > 50) DROPS.splice(0, DROPS.length - 50);
    /* the support engineer: a battery or a handheld */
    var ht = handAt(TECH, 0); fillRR(g, ht[0] - 6, ht[1] - 18, 12, 18, 3, '#2A3142'); fillRR(g, ht[0] - 4, ht[1] - 15, 8, 7, 1, TECH.fwOn ? '#7FF0CF' : '#9FC4FF');
    /* the supervisor: tea mug in her left hand on a sip, her phone in her right */
    var hs = handAt(SUP, 1); fillRR(g, hs[0] - 5, hs[1] - 18, 10, 18, 2.5, '#1B2433'); fillRR(g, hs[0] - 3.6, hs[1] - 16, 7.2, 13, 1, R.alert ? ((t % 0.3) < 0.15 ? '#FFE9C7' : '#C7F0E0') : '#C7F0E0');
    if (R.alert && S.C && S.C.u < 0.56) { g.strokeStyle = 'rgba(30,60,50,.45)'; g.lineWidth = 1.4; [-1, 1].forEach(function (dd) { g.beginPath(); g.moveTo(hs[0] + dd * 9, hs[1] - 14); g.lineTo(hs[0] + dd * 12, hs[1] - 10); g.moveTo(hs[0] + dd * 9, hs[1] - 8); g.lineTo(hs[0] + dd * 12, hs[1] - 4); g.stroke(); }); }
    if (SUP.cup) { var hc = handAt(SUP, 0); fillRR(g, hc[0] - 6, hc[1] - 14, 12, 14, 3, '#FFFFFF'); fillRR(g, hc[0] - 6, hc[1] - 14, 12, 3, 1.5, LEAF); g.strokeStyle = 'rgba(160,170,190,.6)'; g.lineWidth = 1.4; for (var sv = 0; sv < 2; sv++) { var sy2 = hc[1] - 18 - ((t * 14 + sv * 8) % 16); g.beginPath(); g.moveTo(hc[0] - 2 + sv * 4, sy2 + 8); g.quadraticCurveTo(hc[0] + 2 + sv * 4, sy2 + 4, hc[0] - 2 + sv * 4, sy2); g.stroke(); } }
    /* the packer: a crate of greens while she carries it */
    if (PACK.crate) { var h1 = handAt(PACK, 0), h2 = handAt(PACK, 1), cx = (h1[0] + h2[0]) / 2, cy = Math.min(h1[1], h2[1]); fillRR(g, cx - 22, cy - 6, 44, 24, 3, '#3FAE6A'); for (var hd = 0; hd < 4; hd++) fillE(g, cx - 15 + hd * 10, cy - 7, 6, 5, hd % 2 ? '#E9483B' : '#8CD47E'); fillRR(g, cx - 18, cy + 4, 36, 4, 2, 'rgba(255,255,255,.4)'); fillRR(g, cx + 8, cy + 9, 12, 7, 1, '#FFFFFF'); }
  }

  /* ---------------- the cast ---------------- */
  /* ---------------- the propagation corner (behind the title card): a hanging sign, a grow-light bar over the propagation
     bench with sensor-tagged seedling trays under a clear dome, the irrigation manifold on the knee wall (three zone valves
     that click on in turn), grow bags with moisture stakes, and a scouting trolley that rides the heating-pipe rail ---------------- */
  var PB = { x: -450, r: -190, top: 404 }, MAN = { x: -132, y: 336 }, BAGS = [-440, -110];
  var PROP = W({ x: -320, y: 470, s: 0.46, ph: 4.6, skin: 2, hair: 1, style: 'bob', outfit: 'cardigan', top: '#14A3A3', top2: '#FFFFFF', hands: [[-60, -290], [60, -290]], look: 0.2 });
  var PRS = { dome: 0 };
  function propWall(g, ext) {
    if (ext.l > 60) return;
    /* the hanging sign */
    g.strokeStyle = '#9AA6BC'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(-390, EAVE + 4); g.lineTo(-380, 70); g.moveTo(-230, EAVE + 4); g.lineTo(-240, 70); g.stroke();
    shadowed(g, 8, 3, 0.16, function () { fillRR(g, -412, 70, 204, 46, 10, '#FFFFFF'); }); fillRR(g, -412, 70, 46, 46, 10, LEAF2); g.fillRect(-372, 70, 6, 46);
    g.strokeStyle = '#FFFFFF'; g.lineWidth = 2.4; g.beginPath(); g.moveTo(-389, 104); g.lineTo(-389, 86); g.stroke(); fillE(g, -395, 88, 7, 4, '#FFFFFF'); fillE(g, -383, 84, 7, 4, '#FFFFFF');
    text(g, 'PROPAGATION', -356, 92, 13, 800, INK); text(g, 'every tray reports in', -356, 106, 8, 700, '#6B7A74');
    /* the grow-light bar on its chains */
    g.strokeStyle = '#9AA6BC'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(-420, EAVE + 4); g.lineTo(-420, 196); g.moveTo(-220, EAVE + 4); g.lineTo(-220, 196); g.stroke();
    fillRR(g, -440, 196, 240, 12, 4, '#3A4458'); for (var l = 0; l < 10; l++) fillRR(g, -432 + l * 23, 206, 16, 4, 2, l % 3 === 1 ? '#FF9EC7' : '#FFF1C9');
    /* the irrigation manifold and its controller on the knee wall */
    shadowed(g, 6, 2, 0.16, function () { fillRR(g, MAN.x, MAN.y - 26, 64, 54, 6, '#FFFFFF'); }); fillRR(g, MAN.x, MAN.y - 26, 64, 12, 6, TEAL); g.fillRect(MAN.x, MAN.y - 20, 64, 6);
    text(g, 'IRRIGATION', MAN.x + 32, MAN.y - 17, 6.2, 800, '#FFFFFF', 'center'); fillRR(g, MAN.x + 6, MAN.y - 8, 52, 16, 3, '#1E2A3A');
    g.strokeStyle = '#7A869C'; g.lineWidth = 7; g.lineCap = 'round'; g.beginPath(); g.moveTo(MAN.x - 30, MAN.y + 60); g.lineTo(MAN.x + 150, MAN.y + 60); g.moveTo(MAN.x - 30, MAN.y + 60); g.lineTo(MAN.x - 30, F - 4); g.stroke();
    g.strokeStyle = '#9AA6BC'; g.lineWidth = 2.4; g.beginPath(); g.moveTo(MAN.x - 30, MAN.y + 57); g.lineTo(MAN.x + 150, MAN.y + 57); g.stroke();
    for (var v = 0; v < 3; v++) { var vx = MAN.x + 10 + v * 44; g.strokeStyle = '#7A869C'; g.lineWidth = 5; g.beginPath(); g.moveTo(vx, MAN.y + 60); g.lineTo(vx, MAN.y + 104); g.stroke(); fillRR(g, vx - 9, MAN.y + 66, 18, 16, 3, '#2A3142'); fillRR(g, vx - 6, MAN.y + 62, 12, 6, 2, '#3A4458'); text(g, 'Z' + (v + 1), vx, MAN.y + 100, 6, 800, '#6B7A74', 'center'); }
    g.strokeStyle = '#3A4458'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(MAN.x + 32, MAN.y + 28); g.quadraticCurveTo(MAN.x + 40, MAN.y + 50, MAN.x + 54, MAN.y + 64); g.stroke();
    fillE(g, MAN.x + 118, MAN.y + 72, 13, 13, '#FFFFFF'); g.strokeStyle = '#7A869C'; g.lineWidth = 2; g.beginPath(); g.arc(MAN.x + 118, MAN.y + 72, 13, 0, Math.PI * 2); g.stroke(); text(g, 'L/min', MAN.x + 118, MAN.y + 94, 5.6, 800, '#6B7A74', 'center');
    /* the heating-pipe rail along the bay, with its end stops */
    g.strokeStyle = '#B5BFCC'; g.lineWidth = 5; g.beginPath(); g.moveTo(-660, 512); g.lineTo(130, 512); g.moveTo(-660, 524); g.lineTo(130, 524); g.stroke();
    g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(-660, 510); g.lineTo(130, 510); g.moveTo(-660, 522); g.lineTo(130, 522); g.stroke();
    for (var sp = -640; sp < 130; sp += 90) fillRR(g, sp, 508, 6, 22, 2, '#9AA6BC'); [-664, 128].forEach(function (x) { fillRR(g, x - 4, 500, 10, 30, 3, AMB); });
  }
  function propBench(g) {
    soft(g, (PB.x + PB.r) / 2, F + 2, 140, 7, 0.22);
    [PB.x + 10, PB.r - 18].forEach(function (lx) { fillRR(g, lx, PB.top + 10, 8, F - PB.top - 10, 2, STEEL); }); fillRR(g, PB.x + 14, F - 26, PB.r - PB.x - 28, 4, 2, '#9AA6BC');
    [[PB.x + 26, '#C9A27A'], [PB.x + 70, '#B5865A']].forEach(function (s) { fillRR(g, s[0], F - 44, 36, 40, 7, s[1]); text(g, 'MIX', s[0] + 18, F - 20, 6.4, 800, '#FFFFFF', 'center'); });
    /* seedling trays with sensor tags (the tags' readings are live), the clear dome over the middle tray */
    for (var tr = 0; tr < 3; tr++) { var x = PB.x + 14 + tr * 82; fillRR(g, x, PB.top - 14, 74, 14, 3, '#2A3142'); for (var c = 0; c < 6; c++) { fillRR(g, x + 4 + c * 11.6, PB.top - 11, 9, 8, 1, '#1B2433'); fillE(g, x + 8.5 + c * 11.6, PB.top - 16, 4, 3.2, c % 2 ? LEAF3 : '#9FDB8C'); fillE(g, x + 6.5 + c * 11.6, PB.top - 19, 2.4, 1.8, LEAF); }
      fillRR(g, x + 58, PB.top - 44, 3, 32, 1.5, '#E3E8EF'); fillRR(g, x + 48, PB.top - 58, 22, 16, 4, '#FFFFFF'); g.strokeStyle = '#C9D3DE'; g.lineWidth = 1; rr(g, x + 48, PB.top - 58, 22, 16, 4); g.stroke(); }
    /* the bench top */
    shadowed(g, 6, 3, 0.12, function () { fillRR(g, PB.x, PB.top, PB.r - PB.x, 12, 3, '#E3E8EF'); }); fillRR(g, PB.x, PB.top, PB.r - PB.x, 4, 2, '#FFFFFF');
    fillRR(g, PB.x + 70, PB.top + 14, 120, 22, 4, '#FFFFFF'); text(g, 'SEEDLINGS · TAGGED + LOGGED', PB.x + 130, PB.top + 28.5, 6.2, 800, LEAF2, 'center');
  }
  function propLive(g, t, S) {
    /* tray tags: soil moisture, ticking; the middle one is the humidity under the dome */
    for (var tr = 0; tr < 3; tr++) { var x = PB.x + 14 + tr * 82, v = tr === 1 ? Math.round(92 - PRS.dome * 22) + '%' : Math.round(46 + tr * 4 + Math.sin(t * 0.4 + tr) * 1.4) + '%';
      fillRR(g, x + 50, PB.top - 56, 18, 9, 1.5, '#1E2A3A'); text(g, v, x + 59, PB.top - 49.6, 5.4, 800, '#7FF0CF', 'center'); fillE(g, x + 59, PB.top - 44.5, 1.6, 1.6, (t + tr * 0.7) % 2 < 0.2 ? '#FFFFFF' : OK); }
    /* the clear dome over the middle tray: lifted on a tap */
    var dx = PB.x + 96, lift = PRS.dome; g.save(); if (lift > 0) { var hp = handAt(PROP, 1), hl = handAt(PROP, 0); g.translate(lerp(dx + 37, (hp[0] + hl[0]) / 2, lift) - (dx + 37), lerp(0, Math.min(hp[1], hl[1]) - (PB.top - 46), lift)); }
    g.fillStyle = 'rgba(220,245,250,.42)'; g.beginPath(); g.moveTo(dx, PB.top - 14); g.lineTo(dx + 4, PB.top - 40); g.quadraticCurveTo(dx + 37, PB.top - 52, dx + 70, PB.top - 40); g.lineTo(dx + 74, PB.top - 14); g.closePath(); g.fill();
    g.strokeStyle = 'rgba(255,255,255,.85)'; g.lineWidth = 1.6; g.stroke(); fillRR(g, dx + 30, PB.top - 52, 14, 5, 2.5, '#FFFFFF'); g.restore();
    PUFF = PUFF.filter(function (p) { return t - p.t0 < 1.8; }); PUFF.forEach(function (p) { var q = (t - p.t0) / 1.8; fillE(g, p.x + Math.sin(q * 5 + p.p) * 10, p.y - q * 50, 5 + q * 12, 4 + q * 8, 'rgba(255,255,255,' + (0.6 * (1 - q)).toFixed(2) + ')'); });
    /* the irrigation controller: zone valves click on in turn, the flow meter's needle */
    var z = Math.floor(t / 3.2) % 4; fillRR(g, MAN.x + 6, MAN.y - 8, 52, 16, 3, '#1E2A3A'); text(g, z < 3 ? 'ZONE ' + (z + 1) + ' ON' : 'ALL OFF', MAN.x + 32, MAN.y + 2.6, 6.4, 800, z < 3 ? '#7FF0CF' : '#9FB0C8', 'center');
    for (var v = 0; v < 3; v++) { var vx = MAN.x + 10 + v * 44; fillE(g, vx, MAN.y + 74, 2.6, 2.6, v === z ? OK : '#3A4458'); if (v === z) { var dq = (t * 2.4) % 1; fillE(g, vx, MAN.y + 106 + dq * 10, 1.8, 2.6, 'rgba(63,169,224,' + (0.8 * (1 - dq)).toFixed(2) + ')'); } }
    var ang = -2.4 + (z < 3 ? 1.4 + Math.sin(t * 3) * 0.06 : 0); g.strokeStyle = RED; g.lineWidth = 1.6; g.beginPath(); g.moveTo(MAN.x + 118, MAN.y + 72); g.lineTo(MAN.x + 118 + Math.cos(ang) * 10, MAN.y + 72 + Math.sin(ang) * 10); g.stroke();
  }
  function bagsLive(g, t) {
    /* grow bags with moisture stakes on the floor */
    BAGS.forEach(function (bx, i) { var y = 584; soft(g, bx, y + 3, 40, 5, 0.22); fillRR(g, bx - 30, y - 34, 60, 34, 9, '#2A3142'); fillRR(g, bx - 30, y - 34, 60, 8, 4, '#3A4458'); fillE(g, bx, y - 34, 26, 5, SOIL);
      for (var lf = 0; lf < 5; lf++) { var a = -Math.PI / 2 + (lf - 2) * 0.42 + Math.sin(t * 1.1 + lf + i) * 0.04; g.save(); g.translate(bx, y - 36); g.rotate(a + Math.PI / 2); fillE(g, 0, -22, 7, 22, lf % 2 ? LEAF : LEAF2); g.restore(); }
      fillRR(g, bx + 14, y - 64, 3, 32, 1.5, '#E3E8EF'); fillRR(g, bx + 6, y - 76, 20, 14, 3, '#FFFFFF'); fillE(g, bx + 16, y - 69, 2.4, 2.4, (t + i) % 1.8 < 0.25 ? '#FFFFFF' : OK);
      if ((t + i * 1.6) % 4.6 < 0.9) { var pq = ((t + i * 1.6) % 4.6) / 0.9; g.strokeStyle = 'rgba(20,163,163,' + (0.7 * (1 - pq)).toFixed(2) + ')'; g.lineWidth = 1.6; g.beginPath(); g.arc(bx + 16, y - 76, 6 + pq * 20, -2.5, -0.6); g.stroke(); } });
  }
  /* the scouting trolley on the pipe rail: a camera mast and a climate sensor, it stops at each post to take a reading */
  function trolley(g, t) {
    var P0 = 26, q = (t % P0) / P0, f = q < 0.5 ? q / 0.5 : 1 - (q - 0.5) / 0.5, st = Math.floor(f * 8), fr = f * 8 - st, ease = fr < 0.6 ? smooth(fr / 0.6) : 1, x = lerp(-630, 96, (st + ease) / 8), y = 510, stop = fr >= 0.6;
    fillRR(g, x - 30, y - 8, 60, 10, 3, '#5C6B7A'); [-20, 20].forEach(function (wx) { fillE(g, x + wx, y + 4, 6, 6, '#2A3142'); fillE(g, x + wx, y + 16, 6, 6, '#2A3142'); });
    fillRR(g, x - 24, y - 30, 48, 22, 5, '#FFFFFF'); fillRR(g, x - 24, y - 30, 48, 7, 4, LEAF2); fillRR(g, x - 2, y - 76, 4, 48, 2, '#9AA6BC');
    fillRR(g, x - 9, y - 90, 18, 14, 4, '#2A3142'); fillE(g, x, y - 83, 4, 4, '#3FA9E0'); fillE(g, x, y - 83, 1.6, 1.6, '#FFFFFF');
    for (var pl = 0; pl < 3; pl++) fillE(g, x + 16, y - 56 + pl * 5, 7 - pl * 0.4, 2.4, '#F4F7F6'); fillE(g, x - 16, y - 20, 2.4, 2.4, stop ? OK : ((t % 0.5) < 0.25 ? AMB : '#FFE3A6'));
    if (stop) { var sq = (fr - 0.6) / 0.4; g.strokeStyle = 'rgba(63,169,224,' + (0.7 * (1 - sq)).toFixed(2) + ')'; g.lineWidth = 1.6; g.beginPath(); g.arc(x, y - 90, 8 + sq * 22, -2.6, -0.5); g.stroke(); }
  }
  /* a Danish trolley of potted seedlings, parked on the floor, one sensor tag riding along */
  function danish(g, t) {
    var x = -330, y = 616; soft(g, x + 70, y + 2, 84, 6, 0.24);
    [x + 4, x + 132].forEach(function (px) { fillRR(g, px, y - 132, 5, 126, 2, '#9AA6BC'); }); g.strokeStyle = '#9AA6BC'; g.lineWidth = 4; g.beginPath(); g.moveTo(x + 6, y - 132); g.lineTo(x + 134, y - 132); g.stroke();
    [y - 92, y - 46, y - 8].forEach(function (sy, r) { fillRR(g, x, sy, 142, 7, 2, '#7A869C');
      for (var p = 0; p < 5; p++) { var px = x + 16 + p * 27, sw = Math.sin(t * 1.2 + p + r) * 0.05; g.fillStyle = '#D9784E'; g.beginPath(); g.moveTo(px - 10, sy - 16); g.lineTo(px + 10, sy - 16); g.lineTo(px + 7, sy); g.lineTo(px - 7, sy); g.closePath(); g.fill();
        g.save(); g.translate(px, sy - 16); g.rotate(sw); fillE(g, 0, -9, 11, 8, (p + r) % 2 ? LEAF : LEAF2); fillE(g, -4, -13, 6, 5, LEAF3); if ((p + r) % 3 === 0) fillE(g, 4, -14, 3, 3, (p + r) % 2 ? '#FF8FA3' : '#FFD84A'); g.restore(); } });
    [x + 12, x + 130].forEach(function (wx) { fillE(g, wx, y + 1, 6, 6, '#2A3142'); fillE(g, wx, y + 1, 2.4, 2.4, '#9AA6BC'); });
    fillRR(g, x + 106, y - 128, 26, 16, 3, '#FFFFFF'); fillRR(g, x + 109, y - 125, 20, 8, 1.5, '#1E2A3A'); text(g, Math.round(48 + Math.sin(t * 0.5) * 2) + '%', x + 119, y - 119, 5.6, 800, '#7FF0CF', 'center'); fillE(g, x + 119, y - 114, 1.4, 1.4, (t % 1.6) < 0.2 ? '#FFFFFF' : OK);
  }
  var PUFF = [];
  var castProp = { id: 'prop', behind: true, keys: [], P: PROP, act: function (P, t, S) {
    var st = S.cast.prop; tapped('prop', st, t);
    P.tilt = 0; P.hop = 0; PRS.dome = 0; P.x = -320; P.hold = null;
    var tk = TAP.prop != null ? t - TAP.prop : 99;
    if (tk < 3) { var q = tk / 3, up = q < 0.25 ? smooth(q / 0.25) : q < 0.75 ? 1 : 1 - smooth((q - 0.75) / 0.25); PRS.dome = up; P.talk = true; P.mood = q < 0.4 ? 'wow' : 'happy'; P.look = 0;
      P.hands = [[-34, -300 - up * 120], [34, -300 - up * 120]]; if (q > 0.25 && q < 0.75) { P.hands = [[-34 + Math.sin(t * 14) * 10, -420], [34 + Math.sin(t * 14) * 10, -420]]; P.tilt = Math.sin(t * 7) * 0.05; }
      if (q > 0.22 && !TAP.propP) { TAP.propP = true; for (var i = 0; i < 6; i++) PUFF.push({ x: PB.x + 110 + i * 9, y: PB.top - 50, t0: t + i * 0.05, p: i }); CR.burst('note', P.x, P.y - 250, t); }
      if (q > 0.8) P.hop = Math.sin((q - 0.8) / 0.2 * Math.PI) * 10; return; }
    TAP.propP = false;
    var cy = (t + 3) % 11; P.talk = t < st.until; P.mood = P.talk ? 'happy' : 'calm';
    if (cy < 5) { var pk = (cy % 1.25) / 1.25, dip = Math.sin(pk * Math.PI); P.hands = [[-110 + pk * 40, -296 + dip * 18], [60, -300]]; P.tilt = 0.06; lookAtNexi(P, st, t, S, -0.3); return; }
    if (cy < 8) { P.hands = [[-50, -330], [10, -338 + Math.abs(Math.sin(t * 6)) * 3]]; P.hold = 'tablet'; lookAtNexi(P, st, t, S, 0.1); return; }
    P.hold = null; P.hands = [[-60, -296], [190, -380 + Math.sin(t * 3) * 6]]; P.tilt = -0.03; lookAtNexi(P, st, t, S, 0.9);
  } };
  function zCrates(g) { var cx = 920; soft(g, cx + 50, 748, 66, 6, 0.24); for (var k = 0; k < 2; k++) { fillRR(g, cx + k * 56, 704, 52, 40, 4, k ? '#3FAE6A' : '#2E9A58'); for (var hd = 0; hd < 4; hd++) fillE(g, cx + 8 + k * 56 + hd * 12, 702, 7, 6, k ? '#E9483B' : '#8CD47E'); } }
  function zBarrow(g) { var wb = -820; soft(g, wb + 50, 744, 80, 6, 0.24); g.fillStyle = '#E3C36A'; g.beginPath(); g.moveTo(wb, 690); g.lineTo(wb + 110, 690); g.lineTo(wb + 90, 730); g.lineTo(wb + 20, 730); g.closePath(); g.fill(); fillE(g, wb + 56, 690, 54, 8, '#6E5238'); fillE(g, wb + 100, 738, 12, 12, '#2A3142'); }
  function up(f) { return function (g) { g.save(); g.translate(0, -26); f(g); g.restore(); }; }
  var FORE_Z = [[748, zCrates], [726, function (g) { pot(g, 1120, 726, 30, 0); }], [722, function (g) { pot(g, -585, 722, 26, 0); }], [716, function (g) { pot(g, -646, 716, 18, 1); }], [744, zBarrow]];

  function tapped(id, st, t) { if (st.wave && st.wave !== st._my) { st._my = st.wave; TAP[id] = t; return true; } return false; }
  function lookAtNexi(P, st, t, S, base) { P.look = lerp(P.look, t < st.until ? clamp((S.nexi.x - P.x) / 160, -1, 1) : base, 0.08); }
  var castEng = { id: 'eng', behind: true, keys: ['sensors'], P: ENG, act: function (P, t, S) {
    var st = S.cast.eng, busy = S.hot === 'sensors'; if (tapped('eng', st, t)) CR.burst('spark', P.x, P.y - 250, t);
    P.tilt = 0; P.hop = 0; P.hiStake = false;
    if (TAP.eng && t - TAP.eng < 2.6) { var q = (t - TAP.eng) / 2.6; P.hiStake = true; P.talk = true; P.mood = 'happy'; P.hands = [[-60, -230], [60, -400 - Math.sin(q * Math.PI) * 16]]; P.look = 0.5; if (q > 0.7) P.hop = Math.sin((q - 0.7) / 0.3 * Math.PI) * 12; return; }
    var cy = (t + 1) % 8; P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm';
    if (cy < 2.6) { var push = Math.max(0, Math.sin(cy / 2.6 * Math.PI * 2)); P.hands = [[-60, -230], [72, -250 + push * 36]]; P.tilt = 0.05 * push; lookAtNexi(P, st, t, S, 0.5); }
    else if (cy < 5) { var tp = Math.abs(Math.sin(t * 8)) * 4; P.hands = [[-40, -270], [10, -278 + tp]]; lookAtNexi(P, st, t, S, -0.4); }
    else { P.hands = [[-60, -230], [70, -250]]; lookAtNexi(P, st, t, S, 0.9); }
  } };
  var castGrow = { id: 'grow', behind: true, keys: ['sensors'], P: GROW, act: function (P, t, S) {
    var st = S.cast.grow; if (tapped('grow', st, t)) { RAIN.t = t; S.wat = 1; CR.burst('heart', P.x - 50, P.y - 230, t); }
    P.tilt = 0; P.hop = 0; P.pour = 0;
    if (TAP.grow && t - TAP.grow < 2.2) { var q = (t - TAP.grow) / 2.2; P.talk = true; P.mood = 'happy'; P.pour = 1; P.hands = [[-90, -360], [60, -380]]; P.x = 412; P.hop = Math.abs(Math.sin(q * Math.PI * 2)) * 8; S.wat = Math.min(1, (S.wat || 0) + 0.02); return; }
    var cy = (t + 2) % 10; P.talk = t < st.until; P.mood = P.talk ? 'happy' : 'calm';
    if (cy < 6) { var pour = cy > 0.8 && cy < 5.4; P.pour = pour ? 1 : 0; P.x = 412 - Math.sin(cy / 6 * Math.PI) * 30; P.hands = [[-70, -240], [56, pour ? -330 : -300]]; P.tilt = pour ? -0.05 : 0; S.wat = Math.min(1, (S.wat || 0) + (pour ? 0.006 : 0)); lookAtNexi(P, st, t, S, -0.6); }
    else { P.x = lerp(P.x, 412, 0.1); P.hands = [[-70, -220], [60, -290]]; S.wat = Math.max(0, (S.wat || 0) - 0.004); P.hop = cy > 8.6 ? Math.abs(Math.sin(t * 6)) * 3 : 0; lookAtNexi(P, st, t, S, 0.3); }
  } };
  var castTech = { id: 'tech', behind: true, keys: ['gateway'], P: TECH, act: function (P, t, S) {
    var st = S.cast.tech, busy = S.hot === 'gateway'; if (tapped('tech', st, t)) { FW.t = t; }
    P.tilt = 0; P.hop = 0; P.fwOn = false; P.sx = 1;
    if (TAP.tech && t - TAP.tech < 3) { var q = (t - TAP.tech) / 3; P.talk = true; P.fwOn = true; P.mood = q < 0.66 ? 'calm' : 'happy'; P.hands = q < 0.66 ? [[-30, -300], [200, -380]] : [[-110, -400 + Math.sin(t * 14) * 10], [110, -400 - Math.sin(t * 14) * 10]]; P.look = 0.6;
      if (q > 0.66) { P.tilt = Math.sin(t * 10) * 0.08; P.hop = Math.abs(Math.sin(t * 10)) * 6; if (!TAP.techS) { TAP.techS = true; CR.burst('star', P.x + 40, P.y - 230, t); } } return; }
    TAP.techS = false;
    var cy = (t + 3) % 9; P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm';
    if (cy < 4.5) { P.hands = [[-40, -300], [200, -380 + Math.sin(t * 4) * 8]]; P.fwOn = cy > 2; lookAtNexi(P, st, t, S, 0.8); }
    else if (cy < 7.5) { P.hands = [[-30, -300], [60, -230]]; P.fwOn = true; lookAtNexi(P, st, t, S, -0.3); }
    else { var wipe = Math.sin((cy - 7.5) / 1.5 * Math.PI); P.hands = [[-60, -200], [64 + wipe * 10, -476]]; lookAtNexi(P, st, t, S, 0); }
  } };
  var castSup = { id: 'sup', behind: true, keys: ['dash', 'alert'], P: SUP, act: function (P, t, S) {
    var st = S.cast.sup, busy = S.hot === 'dash' || S.hot === 'alert', R = S.R || room(cyc(t)), u = (S.C || cyc(t)).u; if (tapped('sup', st, t)) CR.burst('conf', P.x, P.y - 260, t);
    P.tilt = 0; P.hop = 0; P.cup = false;
    if (TAP.sup && t - TAP.sup < 2.8) { var q = (t - TAP.sup) / 2.8; P.talk = true; P.mood = 'happy'; P.hands = [[-60, -200], [30, -330 - Math.sin(q * Math.PI) * 20]]; P.hop = q > 0.5 ? Math.abs(Math.sin(q * Math.PI * 3)) * 8 : 0; P.look = 0.2; return; }
    if (R.alert) { if (u < 0.56) { P.hands = [[-60, -200], [30, -320]]; P.mood = 'wow'; P.talk = false; P.look = lerp(P.look, 0.1, 0.1); }
      else if (u < 0.7) { P.hands = [[-60, -200], [150, -330]]; P.mood = 'calm'; P.talk = true; P.look = lerp(P.look, 0.9, 0.1); }
      else { P.hands = [[-60, -200], [30, -310]]; P.mood = 'happy'; P.talk = false; P.look = lerp(P.look, 0.6, 0.1); } return; }
    var cy = (t + 6) % 9; P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm';
    if (cy > 6.6) { var su = (cy - 6.6) / 2.4, up = Math.sin(su * Math.PI); P.cup = true; P.hands = [[-40 + up * 20, -200 - up * 120], [56, -204]]; P.tilt = -up * 0.06; lookAtNexi(P, st, t, S, 0); return; }
    if (cy > 3.4) { P.hands = [[-60, -200], [40, -270]]; lookAtNexi(P, st, t, S, 0.2); return; }
    P.hands = [[-60, -200], [56, -204]]; P.tilt = -0.04; lookAtNexi(P, st, t, S, -0.5);
  } };
  var castPack = { id: 'pack', behind: true, keys: ['odoo', 'cold'], P: PACK, act: function (P, t, S) {
    var st = S.cast.pack, R = S.R || room(cyc(t)), u = (S.C || cyc(t)).u; if (tapped('pack', st, t)) {}
    P.tilt = 0; P.hop = 0; P.crate = false; P.x = R.px;
    if (TAP.pack && t - TAP.pack < 2.6) { var q = (t - TAP.pack) / 2.6; P.talk = true; P.mood = 'happy'; P.hands = q < 0.6 ? [[-50, -230], [50, -230]] : [[-100, -400 + Math.sin(t * 16) * 10], [100, -400 - Math.sin(t * 16) * 10]]; P.crate = q < 0.6; P.hop = q > 0.6 ? Math.abs(Math.sin(q * Math.PI * 4)) * 14 : 0; P.look = -0.2;
      if (q > 0.6 && !TAP.packC) { TAP.packC = true; CR.burst('conf', P.x, P.y - 240, t); } return; }
    TAP.packC = false;
    var moving = R.act === 'walk' || R.act === 'back' || R.act === 'fetch'; P.talk = t < st.until || (R.alert && u > 0.56 && u < 0.64); P.mood = P.talk ? 'happy' : 'calm';
    if (moving) { var step = t * 9; P.hop = Math.abs(Math.sin(step)) * 5; P.look = R.act === 'back' ? -0.8 : 0.8; }
    if (R.carry) { P.crate = true; P.hands = [[-50, -236], [50, -236]]; }
    else if (R.act === 'close') { P.hands = [[-60, -210], [120, -300]]; P.look = 0.8; }
    else if (R.act === 'stow') { P.hands = [[-40, -260], [130, -260]]; P.look = 0.9; }
    else if (moving) { var sw = Math.sin(t * 9) * 30; P.hands = [[-70 - sw * 0.4, -150], [70 + sw * 0.4, -150]]; }
    else { P.hands = [[-50, -214], [40, -214 + Math.abs(Math.sin(t * 2)) * 6]]; lookAtNexi(P, st, t, S, -0.3); }
  } };

  window.IXW.worlds['sol-iot'] = {
    calmView: [150,-60,850,680], /* CALM: the framed part of the set */
    pan: [-320, 1280],
    paintBg: paintBg, windowBehind: true, paintFrame: paintFrame, paintBack: paintBack, paintFront: paintFront, paintFore: paintFore,
    paintWindow: paintWindow, paintLive: paintLive, paintFrontLive: paintFrontLive,
    paintForeLive: function (g, t, S) { K.zfore(g, t, S, FORE_Z.map(function (z) { return [z[0] - 26, up(z[1])]; }), function () { CO.crew(FORE_CREW, g, t, S, 'fore'); }); CR.draw(g, t); },
    motes: true, moteCol: 'rgba(255,255,240,.6)',
    glow: {
      sensors: function (g) { rr(g, AIR.x - 22, AIR.y - 4, 44, 64, 14); STAKES.forEach(function (sx) { rr(g, sx - 14, TR - 76, 28, 44, 10); }); },
      gateway: function (g) { rr(g, GW.x - 10, GW.y - 34, GW.w + 20, GW.h + 44, 12); },
      dash: function (g) { rr(g, DASH.x - 12, DASH.y - 12, DASH.w + 24, DASH.h + 24, 14); },
      alert: function (g) { rr(g, DISP.x - 12, BEAC.y - 8, DISP.w + 24, DISP.y + DISP.h - BEAC.y + 18, 12); },
      cold: function (g) { rr(g, DOOR.x - 12, 216, DOOR.w + 24, F - 210, 12); },
      odoo: function (g) { rr(g, TAB.x - 8, 360, TAB.w + 16, 40, 10); },
      mist: function (g) { rr(g, VALVE.x - 16, -30, 32, 34, 12); }
    },
    backGlow: ['sensors', 'gateway', 'dash', 'alert', 'cold'],
    cast: [castProp, castEng, castGrow, castTech, castSup, castPack],
    toy: function (name, S, t) { if (name === 'mist') { MISTK.t = t; CR.burst('spark', VALVE.x, -20, t); } },
    hit: function (x, y, S, t, onBtn) {
      var w = CR.hitWalker(x, y, t); if (w) return w;
      var R = S.R; if (R && Math.abs(R.px - 805) > 20 && Math.abs(x - R.px) < 40 && y > 250 && y < F) { var st = S.cast.pack; st.wave = t + 1.6; st.until = t + 2.2; return { say: 'Every crate weighed on the **Odoo IoT** scale, labelled and logged before it goes in.', near: [860, 60], pose: 'clap', who: 'Packer', role: 'Client team · illustration' }; }
      if (onBtn) return null;
      if (S.pk && Math.hypot(x - S.pk[0], y - S.pk[1]) < 22) return { say: 'That dot is a **reading** on its way to the gateway, then the dashboard.', near: [clamp(S.pk[0], 200, 880), 40], pose: 'wow', who: 'A sensor reading' };
      if (x > 1110 && x < 1260 && y > 190 && y < 300) return { say: 'Even the van reports in: **location** on the same dashboard.', near: [930, 20], pose: 'present', who: 'The delivery van' };
      if (x > MAN.x - 40 && x < MAN.x + 160 && y > MAN.y - 30 && y < F) return { say: 'The **irrigation valves** run zone by zone, and the flow meter reports every litre.', near: [-60, 120], pose: 'point-left', who: 'The irrigation manifold' };
      if (x > -680 && x < 140 && y > 410 && y < 540 && !(x > PB.x && x < PB.r && y < F)) return { say: 'The scouting trolley rides the pipe rail and **takes a reading** at every post.', near: [-120, 300], pose: 'wow', who: 'The scouting trolley' };
      if (x > PB.x && x < PB.r && y > 60 && y < F) return { say: 'Every seedling tray carries a **sensor tag**: moisture and humidity, logged as it grows.', near: [-120, 120], pose: 'point-left', who: 'The propagation bench' };
      if (y < EAVE - 20 && y > -300) return { say: 'The roof vents open as the air warms, and the **air sensor** sees it first.', near: [clamp(x, 240, 880), -40], pose: 'wow', who: 'The roof vents' };
      return null;
    },
    onStop: function (key, S, t) { S.kT = t; if (key === 'gateway') FW.t = t - 0.5; if (key === 'sensors') S.wat = Math.max(S.wat || 0, 0.5); }
  };
})(window.IXW && window.IXW.kit, window.CR, window.CO);
