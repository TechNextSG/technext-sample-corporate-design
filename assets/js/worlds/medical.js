/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: medical (/industries/medical) — Bayview Clinic, a sample clinic group. A pastel clinic: window with a skyline,
   the clinic's plaque, a clock, a heart monitor, the roster board (Planning), the medicine cabinet (Inventory, the
   expiring box blinks amber), the reception desk with the booking tablet, invoices and the POS, a supplier delivery and a
   plant. Staff: Mei at the front desk (sample) and Dr. Tan (sample). Painted with the kit in industry-world.js. */
(function (K) {
  'use strict';
  if (!K) return;
  var rr = K.rr, ell = K.ell, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, FONT = K.FONT, clamp = K.clamp, lerp = K.lerp;
  var SET_W = 1000, SET_H = 600, FLOOR = 470;
  var MED = {
    wall: ['#EEF8F6', '#E2F2EF'], wains: ['#D3ECE7', '#C8E6E0'], rail: '#FFFFFF', floor: ['#F4F7FB', '#DCE5EF'],
    win: { x: 175, y: 48, w: 220, h: 242 },
    sign: { x: 430, y: 36, w: 200, h: 50 },
    ecg: { x: 646, y: 122, w: 92, h: 70 },
    clock: { x: 692, y: 62, r: 22 },
    board: { x: 770, y: 28, w: 160, h: 132 },
    cab: { x: 876, y: 182, w: 112, h: 288 },
    desk: { x: 330, y: 326, w: 400 },
    tablet: { x: 394, y: 264 }, papers: { x: 454, y: 312 }, pos: { x: 640, y: 282 },
    crate: { x: 234, y: 360 }, plant: { x: 176, y: 470 }
  };
  /* the HOT index of the object under each hotspot (for the canvas glow) */
  var GLOW = {
    book: function (g) { rr(g, MED.tablet.x - 6, MED.tablet.y - 6, 56, 72, 12); },
    bill: function (g) { rr(g, MED.papers.x - 8, MED.papers.y - 14, 80, 30, 10); },
    counter: function (g) { rr(g, MED.pos.x - 8, MED.pos.y - 8, 82, 56, 12); },
    roster: function (g) { var b = MED.board; rr(g, b.x - 8, b.y - 8, b.w + 16, b.h + 16, 16); },
    stock: function (g) { var c = MED.cab; rr(g, c.x - 8, c.y - 8, c.w + 16, c.h + 12, 16); },
    buy: function (g) { var c = MED.crate; rr(g, c.x - 8, c.y - 8, 100, 120, 14); }
  };


  /* ---------------- beyond the frame: the rest of the clinic (ext = the whole hero in set units) ----------------
     Far left: the waiting area with chairs, the "now serving" screen, a water dispenser, a kids' corner. Behind the copy:
     the pharmacy counter with its pharmacist. Right: the consult room door with its "in session" light, a sanitiser
     stand. Patients and a nurse walk the margins. */
  var text = K.text, shadowed = K.shadowed, F = FLOOR;
  function chair(g, x) { fillRR(g, x, 404, 54, 40, 10, '#21B799'); fillRR(g, x, 438, 54, 14, 6, '#168F76'); g.fillStyle = '#9AA6BC'; g.fillRect(x + 6, 452, 4, 18); g.fillRect(x + 44, 452, 4, 18); }
  function wideBack(g, ext) {
    /* ceiling light panels all along, wall posters on the left */
    ceiling(g, ext);
    if (ext.l < -440) {
      shadowed(g, 10, 4, 0.16, function () { fillRR(g, -640, 110, 110, 140, 6, '#FFFFFF'); }); fillRR(g, -632, 118, 94, 26, 4, '#21B799'); text(g, 'WASH', -585, 136, 11, 800, '#FFFFFF', 'center');
      for (var h = 0; h < 3; h++) { fillE(g, -610 + h * 25, 176, 10, 12, '#FFD9E0'); g.fillStyle = 'rgba(63,169,224,.6)'; g.beginPath(); g.arc(-610 + h * 25, 200, 4, 0, 7); g.fill(); } text(g, '20 seconds, every time', -585, 236, 7, 700, '#5C6B7E', 'center');
      shadowed(g, 10, 4, 0.16, function () { fillRR(g, -500, 120, 70, 110, 4, '#FFFFFF'); }); ['E', 'F P', 'T O Z', 'L P E D'].forEach(function (r2, i) { text(g, r2, -465, 150 + i * 22, 18 - i * 3.5, 800, '#2A3550', 'center'); });
    }
    if (ext.l < -480) {
      shadowed(g, 12, 4, 0.18, function () { fillRR(g, -760, 110, 100, 96, 8, '#2A3550'); }); fillRR(g, -754, 116, 88, 84, 4, '#17284A');
      text(g, 'NOW SERVING', -710, 136, 8, 800, '#9FE3C1', 'center'); fillRR(g, -746, 146, 72, 6, 3, '#21375F');
      for (var c = -760; c < -580; c += 60) chair(g, c); soft(g, -670, F + 4, 100, 8, 0.2);
      var wx = -900; fillRR(g, wx, 330, 44, 140, 8, '#FFFFFF'); fillRR(g, wx + 6, 280, 32, 52, 10, 'rgba(160,210,240,.85)'); fillRR(g, wx + 10, 368, 24, 8, 3, '#3FA9E0'); fillRR(g, wx + 10, 382, 24, 6, 3, '#FF8FA3'); soft(g, wx + 22, F + 4, 26, 5, 0.2);
      fillRR(g, -590, 452, 110, 18, 6, '#FFEDB0'); [['#FF8FA3', 0], ['#3FA9E0', 1], ['#21B799', 2], ['#FFD84A', 3]].forEach(function (b) { fillRR(g, -580 + b[1] * 24, 430 - (b[1] % 2) * 12, 20, 20 + (b[1] % 2) * 12, 3, b[0]); });
    }
    if (ext.l < 120) { /* the pharmacy: shelves of boxes behind the counter (the pharmacist is live; the counter front is in front of her) */
      var px = -420; fillRR(g, px, 160, 300, 170, 6, '#FFFFFF'); fillRR(g, px + 30, 130, 240, 26, 6, '#21B799'); text(g, 'PHARMACY', px + 150, 148, 12, 800, '#FFFFFF', 'center');
      for (var r = 0; r < 3; r++) { fillRR(g, px + 10, 200 + r * 44, 280, 5, 2, '#D6EDE8'); for (var b2 = 0; b2 < 9; b2++) fillRR(g, px + 16 + b2 * 30, 176 + r * 44, 24, 24, 3, ['#DDF4EE', '#FFD9E0', '#DDE7F8', '#FFEDB0'][(b2 + r) % 4]); }
    }
    if (ext.r > 1000) { /* the consult room door, the sanitiser stand */
      var dx = 1016; fillRR(g, dx, 160, 168, 310, 6, '#FFFFFF'); fillRR(g, dx + 10, 170, 148, 300, 4, '#C8E6E0'); fillRR(g, dx + 24, 190, 120, 110, 4, '#D9F0EA'); fillE(g, dx + 140, 330, 5, 5, '#9AA6BC'); fillRR(g, dx + 132, 326, 18, 6, 3, '#9AA6BC');
      fillRR(g, dx + 30, 120, 108, 26, 6, '#2A3550'); text(g, 'CONSULT 2', dx + 84, 137, 9, 800, '#FFFFFF', 'center');
      g.fillStyle = '#9AA6BC'; g.fillRect(dx + 222, 340, 6, 130); fillRR(g, dx + 210, 300, 30, 44, 8, '#FFFFFF'); fillRR(g, dx + 216, 314, 18, 10, 3, '#21B799'); fillRR(g, dx + 206, F - 6, 38, 6, 3, '#9AA6BC');
    }
  }
  var PHARM = { x: -270, y: 452, s: 0.48, ph: 0.9, c: { skin: '#E8B48F', hair: '#2B1D16', top: '#FBFCFF', top2: '#21B799' }, outfit: 'coat', hairStyle: 'bun', clipCol: '#21B799', feet: false, mood: 'happy', look: 0.3, talk: false, hands: [[-62, -186], [62, -186]] };
  var WALK = [{ x0: -940, x1: -520, y: 488, spd: 18, ph: 0.3, P: { s: 0.44, ph: 0.4, c: { skin: '#C68B5E', hair: '#C9C9C9', top: '#7FA8C9', low: '#2A3550', shoe: '#F7F8FB' }, outfit: 'tee', hairStyle: 'bald', glasses: true, build: 1.12, short: true, glasses: true, mood: 'calm', look: 0, hands: [[-70, -150], [70, -150]] } },
    { front: true, x0: -920, x1: -420, y: 650, spd: 24, ph: 0.65, P: { s: 0.5, ph: 1.5, c: { skin: '#F3CDA8', hair: '#4A2E22', top: '#FF8FA3', low: '#2A3550', shoe: '#F7F8FB' }, outfit: 'tee', hairStyle: 'long', hijab: '#3FA9E0', mood: 'happy', look: 0, hold: 'clipboard', hands: [[-60, -200], [70, -150]] } },
    { x0: 1010, x1: 1330, y: 490, spd: 26, ph: 0.15, P: { s: 0.44, ph: 2.3, c: { skin: '#6B4329', hair: '#1F1A1A', top: '#5B8DEF', top2: '#3167CA' }, outfit: 'scrubs', hairStyle: 'curly', clipCol: '#FFD84A', mood: 'happy', look: 0, hands: [[-70, -150], [70, -150]] } }];
  function walk(g, t, S, front) { var ext = S.ext;
    WALK.slice().sort(function (a, b) { return a.y - b.y; }).forEach(function (w) { var L = (w.front || w.y >= 560) ? 'fore' : w.y > 470; if (L !== front) return; var a = Math.max(w.x0, ext.l + 40), b = Math.min(w.x1, ext.r - 50); if (b - a < 60) return; K.walker(g, { x0: a, x1: b, y: w.y, spd: w.spd, ph: w.ph, P: w.P }, t); }); }
  function wideLive(g, t, S) {
    var ext = S.ext;
    if (ext.l < -480) { var n = 100 + Math.floor(t / 5) % 30; text(g, 'A' + n, -710, 186, 22, 800, '#FFFFFF', 'center'); }
    if (ext.r > 1000 && Math.floor(t * 1.2) % 2 === 0) { fillRR(g, 1046, 98, 68, 16, 8, '#FF8FA3'); text(g, 'IN SESSION', 1080, 110, 7.5, 800, '#FFFFFF', 'center'); } else if (ext.r > 1000) { fillRR(g, 1046, 98, 68, 16, 8, '#E8D5DA'); text(g, 'IN SESSION', 1080, 110, 7.5, 800, '#FFFFFF', 'center'); }
    if (ext.l < 120) { PHARM.hands = [[-62, -200 + Math.abs(Math.sin(t * 2.4)) * 14], [70, -196]]; PHARM.talk = (t % 6) < 1.5; K.person(g, PHARM, t); }
    walk(g, t, S, false);
  }
  function wideFront(g, ext) {
    if (ext.l < 120) { var px = -420; fillRR(g, px - 6, 340, 312, 14, 6, '#FFFFFF'); fillRR(g, px, 352, 300, F - 352, 8, '#D6EDE8'); fillRR(g, px + 90, 380, 120, 30, 6, '#FFFFFF'); text(g, 'Please queue here', px + 150, 400, 9, 800, '#168F76', 'center'); }
  }

  /* static back props, in set units */
  /* ---------------- more of the clinic: direction signs and a health-tips screen; a play corner, a water cooler ---------------- */
  function ceiling(g, ext) { var cb = -96, top = Math.max(ext.t, -420); if (top >= cb) return;
    g.fillStyle = '#F6FBFA'; g.fillRect(ext.l, top, ext.r - ext.l, cb - top); g.strokeStyle = 'rgba(42,53,80,.07)'; g.lineWidth = 1.5; g.beginPath();
    for (var x = Math.floor(ext.l / 80) * 80; x < ext.r; x += 80) { g.moveTo(x, top); g.lineTo(x, cb); } for (var y = cb - 60; y > top; y -= 60) { g.moveTo(ext.l, y); g.lineTo(ext.r, y); } g.stroke();
    fillRR(g, ext.l, cb - 4, ext.r - ext.l, 10, 0, '#DCEFEA'); g.fillStyle = 'rgba(33,183,153,.35)'; g.fillRect(ext.l, cb + 6, ext.r - ext.l, 3);
    for (var lx = Math.floor(ext.l / 240) * 240 + 40; lx < ext.r; lx += 240) { fillRR(g, lx - 56, cb - 52, 112, 26, 3, '#FFFFFF'); g.fillStyle = 'rgba(42,53,80,.10)'; g.fillRect(lx - 56, cb - 30, 112, 4);
      g.fillStyle = 'rgba(255,253,235,.9)'; g.fillRect(lx - 50, cb - 48, 100, 18);
      if (lx < 130 || lx > 950) { g.save(); var gl = g.createLinearGradient(0, cb, 0, 170); gl.addColorStop(0, 'rgba(255,255,240,.32)'); gl.addColorStop(1, 'rgba(255,255,240,0)'); g.fillStyle = gl; g.beginPath(); g.moveTo(lx - 50, cb + 6); g.lineTo(lx + 50, cb + 6); g.lineTo(lx + 110, 170); g.lineTo(lx - 110, 170); g.closePath(); g.fill(); g.restore(); }
      var vx = lx + 120; fillRR(g, vx - 22, cb - 50, 44, 22, 3, '#E6EEF0'); g.fillStyle = 'rgba(42,53,80,.25)'; for (var v = 0; v < 4; v++) g.fillRect(vx - 18, cb - 46 + v * 5, 36, 2);
      fillE(g, lx + 60, cb - 14, 5, 3, '#C9D3DD'); fillE(g, lx - 60, cb - 14, 5, 3, '#C9D3DD'); if ((lx / 240 | 0) % 2) { fillE(g, vx, cb - 12, 9, 4, '#FFFFFF'); fillE(g, vx + 4, cb - 13, 1.6, 1.6, '#21B799'); } }
  }
  function hanging(g, x0, w, y, label, col) { g.fillStyle = '#9AA6BC'; g.fillRect(x0 + 16, -90, 2, y + 90); g.fillRect(x0 + w - 18, -90, 2, y + 90); shadowed(g, 8, 3, 0.14, function () { fillRR(g, x0, y, w, 32, 6, col); }); text(g, label, x0 + w / 2, y + 21, 10, 800, '#FFFFFF', 'center'); }
  function moreBack(g, ext) {
    if (ext.l < -200) hanging(g, -440, 190, -50, '\u2190 Pharmacy · X-ray \u2192', '#2A3550');
    if (ext.r > 1000) hanging(g, 1000, 176, -50, 'Consult rooms 1–4 \u2192', '#21B799');
  }
  function moreFront(g, ext) {
  }
  /* ---------------- behind the title card: the waiting corner (a health-tips TV, a bench with a patient reading the
     paper, a sanitiser), and a designed floor: painted wayfinding lanes, a kids' play mat, a wet-floor sign ---------------- */
  var READER = { x: -36, y: 472, s: 0.44, ph: 2.9, c: { skin: '#E3A877', hair: '#CFCFCF', top: '#F2B544', top2: '#D99A2B', low: '#4A5578', shoe: '#2A2F45' }, outfit: 'tee', hairStyle: 'short', glasses: true, sit: true, chairCol: '#21B799', mood: 'calm', look: 0.2, hands: [[-46, -228], [46, -228]] };
  var RD = { tap: -9 };
  function floorLanes(g, ext) {
    [['#21B799', 548, 'PHARMACY', -1], ['#3FA9E0', 568, 'X-RAY', 1], ['#FF8FA3', 588, 'CONSULT 1–4', 1]].forEach(function (L, i) {
      g.globalAlpha = 0.42; fillRR(g, ext.l, L[1], ext.r - ext.l, 6, 3, L[0]); g.globalAlpha = 1;
      for (var x = Math.floor(ext.l / 560) * 560 + 40 + i * 150; x < ext.r; x += 560) {
        fillRR(g, x - 40, L[1] - 6, 80, 19, 9.5, L[0]); text(g, (L[3] < 0 ? '← ' : '') + L[2] + (L[3] > 0 ? ' →' : ''), x, L[1] + 7.5, 8.5, 800, '#FFFFFF', 'center');
      }
    });
  }
  function waitBack(g, ext) {
    if (ext.l > 60) return;
    /* the health-tips TV on its wall arm */
    fillRR(g, -40, 82, 14, 18, 3, '#C9D6E2');
    shadowed(g, 14, 6, 0.2, function () { fillRR(g, -100, 96, 132, 88, 10, '#2A3550'); }); fillRR(g, -94, 102, 120, 76, 6, '#F4FBF9');
    fillRR(g, -94, 102, 120, 18, 6, '#21B799'); text(g, 'HEALTH TIPS', -34, 115, 8, 800, '#FFFFFF', 'center');
    /* the sanitiser on the wall and its drip tray */
    fillRR(g, 56, 250, 30, 48, 8, '#FFFFFF'); fillRR(g, 62, 262, 18, 12, 3, '#21B799'); fillRR(g, 64, 300, 14, 6, 3, '#9AA6BC'); text(g, 'CLEAN HANDS', 71, 244, 6.5, 800, '#168F76', 'center');
    /* a magazine rack beside the bench */
    fillRR(g, -130, 396, 34, 74, 5, '#9AB8B2'); fillRR(g, -126, 400, 26, 66, 3, '#C8E6E0'); [['#FF8FA3', 0], ['#3FA9E0', 1], ['#FFD84A', 2]].forEach(function (m) { fillRR(g, -124, 404 + m[1] * 20, 22, 16, 2, m[0]); });
    soft(g, -36, F + 4, 70, 8, 0.18);
  }
  function waitLive(g, t, S) {
    if (S.ext.l > 60) return;
    var tips = [['Drink water', 'little and often'], ['Wash hands', '20 seconds'], ['Sleep well', '7 to 9 hours'], ['Move daily', 'a short walk']], k = Math.floor(t / 4) % 4, u = (t % 4) / 4;
    text(g, tips[k][0], -34, 146, 13, 800, '#1F1F3D', 'center'); text(g, tips[k][1], -34, 162, 8.5, 700, '#5C6B7E', 'center');
    fillRR(g, -86, 170, 104, 3, 1.5, '#DDEDEA'); fillRR(g, -86, 170, 104 * u, 3, 1.5, '#21B799');
    /* the reader: turns a page every few seconds, glances at Nexi; tapped, he lowers the paper and waves */
    var P = READER, d = t - RD.tap, tapped = d >= 0 && d < 2.2, flip = (t % 6) < 0.5;
    P.look = tapped ? 0.6 : lerp(P.look, clamp((S.nexi.x - P.x) / 300, -1, 1) * ((t % 9) < 3 ? 1 : 0.2), 0.05);
    P.mood = tapped ? 'happy' : 'calm'; P.hop = tapped ? Math.abs(Math.sin(d * 8)) * 8 * (1 - d / 2.2) : 0;
    P.hands = tapped ? [[-46, -170], [100 + Math.sin(d * 12) * 14, -400]] : [[-46, -232 + (flip ? -6 : 0)], [46, -232]];
    K.person(g, P, t);
    g.save(); g.translate(P.x, P.y - (P.hop || 0) * P.s); g.scale(P.s, P.s); g.translate(0, 46);
    if (tapped) { g.save(); g.translate(-46, -190); g.rotate(-0.5); fillRR(g, -30, -40, 60, 80, 4, '#FFFFFF'); g.fillStyle = '#C3CDDA'; for (var l = 0; l < 6; l++) g.fillRect(-22, -30 + l * 11, 44, 3); g.restore(); }
    else { var fw = flip ? 60 * Math.cos((t % 6) / 0.5 * Math.PI) : 60; fillRR(g, -66, -300, 132, 92, 4, '#FFFFFF'); g.fillStyle = '#C3CDDA'; for (var l2 = 0; l2 < 7; l2++) { g.fillRect(-58, -288 + l2 * 11, 54, 3); g.fillRect(6, -288 + l2 * 11, 52, 3); }
      fillRR(g, -58, -296, 54, 9, 2, '#21B799'); g.fillStyle = 'rgba(42,53,80,.12)'; g.fillRect(-1, -300, 2, 92); if (flip) fillRR(g, 0, -300, fw, 92, 3, '#F4F7FB'); }
    g.restore();
    if (tapped) for (var h = 0; h < 3; h++) { var hu = (d * 0.6 + h * 0.33) % 1; g.globalAlpha = 1 - hu; fillE(g, P.x + 40 + h * 12, P.y - 230 - hu * 70, 5, 5, '#FF8FA3'); g.globalAlpha = 1; }
  }
  function playMat(g, ext) {
    if (ext.l > -150) return;
    var x = -330, y = 606; soft(g, x, y + 4, 140, 14, 0.12); fillE(g, x, y, 128, 26, '#FFEDB0'); fillE(g, x, y, 112, 20, '#FFF6D6');
    [['#FF8FA3', -70], ['#3FA9E0', -30], ['#21B799', 10], ['#FFD84A', 50]].forEach(function (c, i) { fillRR(g, x + c[1], y - 8 - (i % 2) * 4, 22, 12, 3, c[0]); });
    fillRR(g, x - 6, y - 32, 20, 20, 3, '#3FA9E0'); fillRR(g, x - 2, y - 50, 20, 20, 3, '#FF8FA3'); fillRR(g, x + 2, y - 68, 16, 16, 3, '#FFD84A');
    text(g, 'A', x + 4, y - 37, 11, 800, '#FFFFFF', 'center'); text(g, 'B', x + 8, y - 55, 11, 800, '#FFFFFF', 'center');
  }
  function wetSign(g, ext, t) {
    if (ext.r < 1000) return;
    var x = 972, y = 628; soft(g, x, y + 2, 34, 6, 0.2);
    g.fillStyle = '#F2B544'; g.beginPath(); g.moveTo(x - 24, y); g.lineTo(x - 8, y - 70); g.lineTo(x + 8, y - 70); g.lineTo(x + 24, y); g.closePath(); g.fill();
    fillRR(g, x - 12, y - 78, 24, 10, 4, '#E09A22'); g.fillStyle = '#1F1F3D'; g.beginPath(); g.moveTo(x, y - 52); g.lineTo(x - 9, y - 36); g.lineTo(x + 9, y - 36); g.closePath(); g.fill();
    text(g, '!', x, y - 39, 10, 900, '#F2B544', 'center'); text(g, 'WET FLOOR', x, y - 20, 6.5, 800, '#1F1F3D', 'center');
  }
  function paintBack(g, ext) {
    if (!K.calm) floorLanes(g, ext); waitBack(g, ext);   /* calm: no painted wayfinding lanes */
    moreBack(g, ext);
    wideBack(g, ext);
    K.windowFrame(g, MED.win);
    /* sign: Bayview Clinic, a sample clinic group */
    var s = MED.sign;
    g.save(); g.shadowColor = 'rgba(30,60,90,.16)'; g.shadowBlur = 14; g.shadowOffsetY = 5; fillRR(g, s.x, s.y, s.w, s.h, 14, '#FFFFFF'); g.restore();
    fillE(g, s.x + 27, s.y + 25, 17, 17, '#21B799'); fillRR(g, s.x + 19, s.y + 22, 16, 6, 3, '#FFFFFF'); fillRR(g, s.x + 24, s.y + 17, 6, 16, 3, '#FFFFFF');
    g.fillStyle = '#1F1F3D'; g.font = '800 17px ' + FONT; g.textBaseline = 'alphabetic'; g.fillText('Bayview Clinic', s.x + 52, s.y + 25);
    g.fillStyle = '#5C5C73'; g.font = '600 10.5px ' + FONT; g.fillText('SAMPLE CLINIC GROUP', s.x + 52, s.y + 40);
    /* clock face (hands are live) */
    var c = MED.clock; g.save(); g.shadowColor = 'rgba(30,60,90,.16)'; g.shadowBlur = 10; g.shadowOffsetY = 4; fillE(g, c.x, c.y, c.r + 5, c.r + 5, '#21B799'); g.restore();
    fillE(g, c.x, c.y, c.r, c.r, '#FFFFFF'); g.fillStyle = '#9AA6BC';
    for (var i = 0; i < 12; i++) { var a = i * Math.PI / 6; g.beginPath(); g.arc(c.x + Math.cos(a) * (c.r - 5), c.y + Math.sin(a) * (c.r - 5), i % 3 ? 1.3 : 2.2, 0, 7); g.fill(); }
    /* heart monitor on a wall arm */
    var e = MED.ecg; fillRR(g, e.x + e.w / 2 - 5, e.y - 18, 10, 22, 4, '#C9D6E2');
    g.save(); g.shadowColor = 'rgba(20,40,70,.22)'; g.shadowBlur = 14; g.shadowOffsetY = 6; fillRR(g, e.x, e.y, e.w, e.h, 12, '#22365C'); g.restore();
    fillRR(g, e.x + 6, e.y + 6, e.w - 12, e.h - 18, 7, '#11233F'); fillE(g, e.x + e.w - 12, e.y + e.h - 6, 2.4, 2.4, '#3FE0A8');
    /* roster board: Planning */
    var b = MED.board;
    g.save(); g.shadowColor = 'rgba(30,60,90,.16)'; g.shadowBlur = 16; g.shadowOffsetY = 6; fillRR(g, b.x, b.y, b.w, b.h, 12, '#DCE4EE'); g.restore();
    fillRR(g, b.x + 6, b.y + 6, b.w - 12, b.h - 12, 8, '#FFFFFF');
    g.fillStyle = '#1F1F3D'; g.font = '800 12px ' + FONT; g.fillText('Roster', b.x + 16, b.y + 26);
    fillRR(g, b.x + b.w - 52, b.y + 14, 38, 16, 8, '#EAF0FB'); g.fillStyle = '#1E4691'; g.font = '700 9.5px ' + FONT; g.fillText('THU', b.x + b.w - 44, b.y + 26);
    var av = ['#2BB3A3', '#3167CA', '#FF8FA3'];
    for (var r = 0; r < 3; r++) { var yy = b.y + 46 + r * 26; fillE(g, b.x + 24, yy, 8, 8, av[r]); fillRR(g, b.x + 40, yy - 5, b.w - 58, 10, 5, '#EEF2F7'); }
    fillRR(g, b.x + 30, b.y + b.h - 2, b.w - 60, 7, 3, '#C9D3E0'); fillRR(g, b.x + 44, b.y + b.h - 6, 24, 5, 2, '#3167CA'); fillRR(g, b.x + 74, b.y + b.h - 6, 24, 5, 2, '#21B799');
    /* medicine cabinet: Inventory */
    var m = MED.cab; soft(g, m.x + m.w / 2, FLOOR + 4, m.w * 0.75, 14, 0.2);
    g.save(); g.shadowColor = 'rgba(30,60,90,.16)'; g.shadowBlur = 18; g.shadowOffsetY = 6; fillRR(g, m.x, m.y, m.w, m.h, 10, '#FFFFFF'); g.restore();
    fillRR(g, m.x - 6, m.y - 10, m.w + 12, 16, 6, '#EAF0F6'); fillRR(g, m.x + 8, m.y + 14, m.w - 16, m.h - 74, 6, '#E9F4FA');
    var cols = [['#FF8FA3', '#6FA0F5', '#FFD27A', '#7CD6C4'], ['#6FA0F5', '#FFD27A', '#7CD6C4', '#FF8FA3'], ['#7CD6C4', '#FF8FA3', '#6FA0F5', '#FFD27A']];
    for (var sh2 = 0; sh2 < 3; sh2++) {
      var shy = m.y + 74 + sh2 * 64; fillRR(g, m.x + 8, shy, m.w - 16, 5, 2, '#C9DCE8');
      for (var bx = 0; bx < 4; bx++) { var bw = 18 + hash(sh2 * 7 + bx) * 6, bh = 26 + hash(sh2 * 3 + bx * 5) * 18, x0 = m.x + 14 + bx * 23;
        fillRR(g, x0, shy - bh, bw, bh, 3, cols[sh2][bx]); fillRR(g, x0 + 3, shy - bh + 7, bw - 6, 7, 2, 'rgba(255,255,255,.8)'); }
    }
    g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.moveTo(m.x + 20, m.y + m.h - 60); g.lineTo(m.x + 52, m.y + 14); g.lineTo(m.x + 70, m.y + 14); g.lineTo(m.x + 38, m.y + m.h - 60); g.closePath(); g.fill();
    g.fillStyle = 'rgba(30,60,90,.12)'; g.fillRect(m.x + m.w / 2 - 1, m.y + 14, 2, m.h - 74);
    fillRR(g, m.x + m.w / 2 - 10, m.y + 120, 5, 26, 3, '#AAB4C4'); fillRR(g, m.x + m.w / 2 + 5, m.y + 120, 5, 26, 3, '#AAB4C4');
    fillRR(g, m.x + 8, m.y + m.h - 54, m.w - 16, 22, 5, '#F1F5FA'); fillRR(g, m.x + 8, m.y + m.h - 28, m.w - 16, 22, 5, '#F1F5FA');
    fillRR(g, m.x + m.w / 2 - 12, m.y + m.h - 46, 24, 5, 3, '#C3CDDA'); fillRR(g, m.x + m.w / 2 - 12, m.y + m.h - 20, 24, 5, 3, '#C3CDDA');
    /* contact shadows of the front props (desk, crate, plant) and the doctor */
    soft(g, MED.desk.x + MED.desk.w / 2, FLOOR + 6, MED.desk.w * 0.62, 20, 0.2);
    soft(g, MED.crate.x + 42, FLOOR + 4, 70, 12, 0.22); soft(g, MED.plant.x, FLOOR + 4, 46, 10, 0.2);
  }
  /* static front props (drawn over the nurse) */
  function paintFront(g, ext) {
    wideFront(g, ext);
    var d = MED.desk, top = d.y;
    /* reception desk */
    fillRR(g, d.x + 8, top + 12, d.w - 16, FLOOR - top - 12, 14, '#FFFFFF');
    g.save(); rr(g, d.x + 8, top + 12, d.w - 16, FLOOR - top - 12, 14); g.clip();
    g.fillStyle = 'rgba(25,40,80,.06)'; g.fillRect(d.x + d.w * 0.7, top, d.w, 200);
    g.fillStyle = '#2BB3A3'; g.fillRect(d.x, top + 46, d.w, 34); g.fillStyle = 'rgba(255,255,255,.22)'; g.fillRect(d.x, top + 46, d.w, 5);
    g.fillStyle = '#21958A'; g.fillRect(d.x, top + 80, d.w, 4);
    g.fillStyle = '#DCE6F0'; g.fillRect(d.x, FLOOR - 14, d.w, 14);
    g.restore();
    fillE(g, d.x + d.w / 2, top + 63, 22, 22, '#FFFFFF'); fillRR(g, d.x + d.w / 2 - 11, top + 59, 22, 8, 4, '#21B799'); fillRR(g, d.x + d.w / 2 - 4, top + 52, 8, 22, 4, '#21B799');
    fillRR(g, d.x - 4, top, d.w + 8, 16, 8, '#F2DFC4'); g.fillStyle = '#DCC19C'; g.fillRect(d.x + 4, top + 12, d.w - 8, 4);
    /* tablet on a stand: Appointments */
    var tb = MED.tablet; fillRR(g, tb.x + 16, tb.y + 54, 12, 10, 3, '#AAB4C4'); fillRR(g, tb.x + 6, tb.y + 60, 32, 6, 3, '#C3CDDA');
    g.save(); g.translate(tb.x + 22, tb.y + 28); g.rotate(-0.06); fillRR(g, -22, -30, 44, 58, 8, '#2A3550'); fillRR(g, -18, -26, 36, 50, 5, '#FFFFFF');
    fillRR(g, -15, -22, 30, 8, 3, '#7B5BD6'); g.fillStyle = '#E6ECF5'; for (var q = 0; q < 9; q++) g.fillRect(-14 + (q % 3) * 10, -10 + Math.floor(q / 3) * 9, 8, 7);
    g.fillStyle = '#21B799'; g.fillRect(-4, -1, 8, 7); fillRR(g, -14, 18, 28, 4, 2, '#3167CA'); g.restore();
    /* papers in a tray: invoices */
    var p = MED.papers; fillRR(g, p.x, p.y + 2, 64, 12, 4, '#CBD5E3');
    g.save(); g.translate(p.x + 30, p.y - 2); g.rotate(-0.05); fillRR(g, -26, -8, 52, 12, 2, '#FFFFFF'); g.restore();
    g.save(); g.translate(p.x + 34, p.y - 6); g.rotate(0.06); fillRR(g, -26, -8, 52, 12, 2, '#F7FAFF'); fillRR(g, -20, -5, 18, 3, 1, '#9FB9EA'); g.restore();
    /* POS terminal: Point of Sale */
    var o = MED.pos; fillRR(g, o.x + 4, o.y + 36, 58, 10, 4, '#9AA6BC');
    g.save(); g.translate(o.x + 32, o.y + 18); g.rotate(-0.08); fillRR(g, -30, -22, 60, 42, 8, '#2A3550'); fillRR(g, -25, -17, 50, 30, 4, '#EAF0FB');
    fillRR(g, -21, -13, 30, 4, 2, '#7B5BD6'); g.fillStyle = '#C3CDDA'; g.fillRect(-21, -5, 24, 3); g.fillRect(-21, 1, 18, 3); fillRR(g, 6, 2, 15, 7, 2, '#21B799'); g.restore();
    fillRR(g, o.x + 66, o.y + 14, 14, 30, 4, '#3B4664'); fillRR(g, o.x + 68, o.y + 18, 10, 6, 2, '#6FA0F5');
    /* a succulent and a bell on the counter */
    fillRR(g, 588, top - 14, 22, 16, 5, '#F59A8B'); g.fillStyle = '#3FBF7F'; [[-6, -10, 5, 9, -0.5], [0, -14, 5, 10, 0], [6, -10, 5, 9, 0.5]].forEach(function (L) { ell(g, 599 + L[0], top - 14 + L[1], L[2], L[3], L[4]); g.fill(); });
    /* supplier delivery: Purchase */
    var cr = MED.crate;
    fillRR(g, cr.x, cr.y + 38, 84, 72, 6, '#E8B983'); g.fillStyle = 'rgba(120,70,20,.12)'; g.fillRect(cr.x + 56, cr.y + 38, 28, 72);
    g.fillStyle = '#D29A5E'; g.fillRect(cr.x + 36, cr.y + 38, 12, 72); fillRR(g, cr.x + 10, cr.y + 62, 22, 18, 3, '#FFFFFF'); g.fillStyle = '#9AA6BC'; g.fillRect(cr.x + 13, cr.y + 67, 15, 2); g.fillRect(cr.x + 13, cr.y + 72, 10, 2);
    fillRR(g, cr.x + 14, cr.y, 56, 40, 5, '#F0C793'); g.fillStyle = '#D9A86B'; g.fillRect(cr.x + 36, cr.y, 12, 40);
    fillRR(g, cr.x + 52, cr.y + 12, 14, 14, 3, '#FFFFFF'); fillRR(g, cr.x + 56, cr.y + 15, 6, 8, 1, '#21B799');
    g.fillStyle = '#3167CA'; g.font = '800 10px ' + FONT; g.fillText('PO', cr.x + 18, cr.y + 26);
    /* a tall plant */
    var pl = MED.plant;
    var lv = [[-30, -150, 20, 46, -0.6], [26, -160, 20, 48, 0.55], [-8, -190, 18, 50, -0.1], [-38, -100, 18, 36, -1], [36, -110, 18, 38, 1], [10, -128, 16, 40, 0.3], [-20, -130, 16, 40, -0.4]];
    g.strokeStyle = '#2E9E66'; g.lineWidth = 4; g.lineCap = 'round';
    lv.forEach(function (L) { g.beginPath(); g.moveTo(pl.x, pl.y - 48); g.quadraticCurveTo(pl.x + L[0] * 0.3, pl.y + L[1] * 0.6, pl.x + L[0], pl.y + L[1] + 20); g.stroke(); });
    lv.forEach(function (L, i) { ell(g, pl.x + L[0], pl.y + L[1], L[2], L[3], L[4]); g.fillStyle = i % 2 ? '#3FBF7F' : '#35AE70'; g.fill(); ell(g, pl.x + L[0] - 3, pl.y + L[1] - 6, L[2] * 0.35, L[3] * 0.6, L[4]); g.fillStyle = 'rgba(255,255,255,.18)'; g.fill(); });
    fillRR(g, pl.x - 26, pl.y - 52, 52, 52, 10, '#F59A8B'); fillRR(g, pl.x - 30, pl.y - 56, 60, 12, 6, '#F7AE9F'); g.fillStyle = 'rgba(120,30,20,.08)'; g.fillRect(pl.x + 8, pl.y - 44, 18, 42);
  }
  /* skyline through the window (cached path, set units) */
  var SKY = null;
  function skyline() {
    var far = new Path2D(), near = new Path2D(), lit = new Path2D(), x = 120, i = 0, base = MED.win.y + MED.win.h;
    while (x < 470) { var w = 26 + hash(i + 3) * 30, h = 50 + hash(i * 3 + 1) * 90; far.rect(x, base - h - 30, w, h + 40); x += w + 4; i++; }
    x = 110; i = 0;
    while (x < 470) { var w2 = 30 + hash(i + 11) * 34, h2 = 36 + hash(i * 5 + 7) * 80; near.rect(x, base - h2, w2, h2 + 10);
      for (var wy = base - h2 + 8; wy < base - 8; wy += 11) for (var wx = x + 5; wx < x + w2 - 6; wx += 9) if (hash(wx * 0.37 + wy * 0.71) > 0.5) lit.rect(wx, wy, 4, 5);
      x += w2 + 5; i++; }
    return { far: far, near: near, lit: lit };
  }
  function paintWindow(g, t, par, S) {
    var w = MED.win; if (!SKY) SKY = skyline();
    g.save(); rr(g, w.x, w.y, w.w, w.h, 10); g.clip();
    var sg = g.createLinearGradient(0, w.y, 0, w.y + w.h); sg.addColorStop(0, '#8FD3FF'); sg.addColorStop(1, '#E3F5FF'); g.fillStyle = sg; g.fillRect(w.x, w.y, w.w, w.h);
    var sx = w.x + w.w * 0.78 - par * 4, sy = w.y + 48, gl = g.createRadialGradient(sx, sy, 6, sx, sy, 90); gl.addColorStop(0, 'rgba(255,244,200,.9)'); gl.addColorStop(0.3, 'rgba(255,236,170,.35)'); gl.addColorStop(1, 'rgba(255,236,170,0)');
    g.fillStyle = gl; g.fillRect(w.x, w.y, w.w, w.h); fillE(g, sx, sy, 15, 15, '#FFF4C9');
    for (var c = 0; c < 3; c++) { var sp = 5 + c * 2.2, x = w.x - 60 + ((hash(c + 4) * 400 + t * sp) % (w.w + 140)) - par * (2 + c), y = w.y + 40 + c * 34;
      g.save(); g.translate(x, y); g.scale(0.26 + c * 0.04, 0.26 + c * 0.04);
      [[0, 0, 62], [58, -22, 74], [128, -4, 58], [70, 18, 62], [-46, 14, 44]].forEach(function (p) { fillE(g, p[0] + 6, p[1] + 10, p[2], p[2], 'rgba(205,222,245,.9)'); });
      [[0, 0, 62], [58, -22, 74], [128, -4, 58], [70, 18, 62], [-46, 14, 44]].forEach(function (p) { fillE(g, p[0], p[1], p[2], p[2], '#FFFFFF'); }); g.restore(); }
    g.save(); g.translate(-par * 6, 0); g.fillStyle = '#BFDAF1'; g.fill(SKY.far); g.restore();
    g.save(); g.translate(-par * 10, 0); g.fillStyle = '#9DC4E8'; g.fill(SKY.near); g.fillStyle = 'rgba(255,255,255,.6)'; g.fill(SKY.lit); g.restore();
    g.fillStyle = 'rgba(255,255,255,.32)'; g.beginPath(); g.moveTo(w.x + w.w * 0.12, w.y + w.h); g.lineTo(w.x + w.w * 0.44, w.y); g.lineTo(w.x + w.w * 0.6, w.y); g.lineTo(w.x + w.w * 0.28, w.y + w.h); g.closePath(); g.fill();
    g.restore();
    g.fillStyle = '#FFFFFF'; g.fillRect(w.x + w.w / 2 - 5, w.y, 10, w.h); g.fillRect(w.x, w.y + w.h * 0.46 - 5, w.w, 10);
  }
  function paintLive(g, t, now, S) {
    wideLive(g, t, S); waitLive(g, t, S);
    /* clock hands: the visitor's own time */
    var c = MED.clock, hr = (now.getHours() % 12 + now.getMinutes() / 60) * Math.PI / 6 - Math.PI / 2, mn = (now.getMinutes() + now.getSeconds() / 60) * Math.PI / 30 - Math.PI / 2, se = now.getSeconds() * Math.PI / 30 - Math.PI / 2;
    g.lineCap = 'round'; g.strokeStyle = '#1F1F3D'; g.lineWidth = 3.4; g.beginPath(); g.moveTo(c.x, c.y); g.lineTo(c.x + Math.cos(hr) * 10, c.y + Math.sin(hr) * 10); g.stroke();
    g.lineWidth = 2.4; g.beginPath(); g.moveTo(c.x, c.y); g.lineTo(c.x + Math.cos(mn) * 15, c.y + Math.sin(mn) * 15); g.stroke();
    g.strokeStyle = '#E0456B'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(c.x, c.y); g.lineTo(c.x + Math.cos(se) * 17, c.y + Math.sin(se) * 17); g.stroke(); fillE(g, c.x, c.y, 2.6, 2.6, '#1F1F3D');
    /* heart monitor: a scrolling trace + the beat */
    var e = MED.ecg, x0 = e.x + 9, x1 = e.x + e.w - 9, mid = e.y + 30, span = x1 - x0, ph = (t * 0.9) % 1;
    g.save(); rr(g, e.x + 6, e.y + 6, e.w - 12, e.h - 18, 7); g.clip();
    g.lineWidth = 2; g.lineJoin = 'round'; g.beginPath();
    for (var i = 0; i <= 60; i++) { var u = i / 60, k2 = ((u - ph) % 1 + 1) % 1, v = 0;
      if (k2 > 0.4 && k2 < 0.44) v = -4; else if (k2 >= 0.44 && k2 < 0.47) v = 14; else if (k2 >= 0.47 && k2 < 0.5) v = -18; else if (k2 >= 0.5 && k2 < 0.53) v = 6; else if (k2 > 0.62 && k2 < 0.7) v = -3 * Math.sin((k2 - 0.62) / 0.08 * Math.PI);
      var xx = x0 + u * span; if (i) g.lineTo(xx, mid + v); else g.moveTo(xx, mid + v); }
    g.strokeStyle = '#3FE0A8'; g.stroke();
    var hx = x0 + ph * span; fillE(g, hx, mid, 3, 3, '#BFFFE6');
    g.fillStyle = '#7FE9C4'; g.font = '700 9px ' + FONT; g.fillText('HR 72', e.x + 11, e.y + 50);
    var beat = Math.max(0, 1 - ((t * 0.9 + 0.55) % 1) * 5); g.fillStyle = 'rgba(255,120,150,' + (0.55 + beat * 0.45) + ')';
    g.save(); g.translate(e.x + e.w - 20, e.y + 46); g.scale(0.5 + beat * 0.12, 0.5 + beat * 0.12); g.beginPath(); g.moveTo(0, 6); g.bezierCurveTo(-12, -2, -6, -12, 0, -5); g.bezierCurveTo(6, -12, 12, -2, 0, 6); g.fill(); g.restore();
    g.restore();
    /* roster: shifts slide in, one row after another, every few seconds */
    var b = MED.board, cyc = (t % 9) / 9, lens = [0.62, 0.84, 0.48], offs = [0, 0.18, 0.3], cols = ['#2BB3A3', '#3167CA', '#FF8FA3'];
    for (var r = 0; r < 3; r++) { var p = clamp((cyc - r * 0.08) / 0.18, 0, 1), ez = 1 - Math.pow(1 - p, 3), out = clamp((cyc - 0.9) / 0.1, 0, 1);
      var tw = (b.w - 58), w2 = tw * lens[r] * ez * (1 - out); if (w2 > 1) fillRR(g, b.x + 40 + tw * offs[r] * 0.5, b.y + 41 + r * 26, w2, 10, 5, cols[r]); }
    /* the expiring box on the middle shelf blinks amber */
    var m = MED.cab, bl = 0.5 + 0.5 * Math.sin(t * 4); fillRR(g, m.x + 60, m.y + 126 - 30, 30, 12, 6, 'rgba(245,165,36,' + (0.65 + bl * 0.35) + ')');
    g.fillStyle = '#FFFFFF'; g.font = '800 8px ' + FONT; g.fillText('30d', m.x + 66, m.y + 105);
  }

  var NURSE = { x: 548, y: 440, s: 0.56, ph: 0.3, c: { skin: '#F1C6A0', hair: '#2E2230', top: '#2BB3A3', top2: '#1F8F82', low: '#2C3E66', shoe: '#9A3350' }, outfit: 'scrubs', hairStyle: 'bun', short: true, feet: false, mood: 'calm', look: 0, talk: false, hands: [[-62, -186], [62, -186]] };
  var DOC = { x: 812, y: 480, s: 0.56, ph: 1.7, c: { skin: '#DDA97F', hair: '#3B3E4E', top: '#5B8DEF', top2: '#5B8DEF', low: '#3A4766', shoe: '#2A2F45' }, outfit: 'coat', hairStyle: 'short', glasses: true, feet: true, hold: 'clipboard', mood: 'calm', look: 0, talk: false, hands: [[-64, -206], [96, -150]] };
  /* the foreground, nearest last: each prop stands at a y, sorted with the front-row passers-by (K.zfore) */
  function FORE() {
    return [
      [680, function (g, ext) {
    if (ext.l < -600) K.plant(g, { x: -860, y: 680 }, '#F59A8B', '#F7AE9F');
      }],
      [660, function (g, ext) {
    if (ext.r > 1060) K.plant(g, { x: 1120, y: 660 }, '#3FA9E0', '#7CC8FF');
      }],
      [606, playMat], [628, wetSign]
    ];
  }
  window.IXW.worlds.medical = {
    calmView: [160,-54,840,672], /* calm layer: the framed hero shows the core of the scene */
    pan: [-460, 1260], /* phones: how far the scene drags each way (set units), ending on whole objects */
    paintFrontLive: function (g, t, S) { walk(g, t, S, true); }, paintForeLive: function (g, t, S) { K.zfore(g, t, S, FORE(), function () { walk(g, t, S, 'fore'); }); },
    room: { wall: MED.wall, wains: MED.wains, rail: MED.rail, base: '#BFDDD7', floor: MED.floor, floorKind: 'tiles', pattern: K.plusPattern('rgba(255,255,255,.55)') },
    paintBack: paintBack, paintFront: paintFront, paintWindow: paintWindow, paintLive: paintLive,
    glow: GLOW, backGlow: ['roster', 'stock'],
    /* the patient reading the paper behind the title card waves back when tapped */
    hit: function (x, y, S, t, onBtn) { if (!onBtn && Math.abs(x - READER.x) < 60 && y > READER.y - 250 && y < READER.y + 10) RD.tap = t; return null; },
    cast: [
      { id: 'nurse', behind: true, keys: ['book', 'bill', 'counter'], P: NURSE, act: function (P, t, S) {
        var st = S.cast.nurse, nb = S.hot === 'book' || S.hot === 'bill' || S.hot === 'counter';
        P.talk = t < st.until; P.mood = P.talk || nb ? 'happy' : 'calm';
        var tap = nb ? Math.abs(Math.sin(t * 9)) * 7 : 0;
        P.hands = t < st.wave ? [[-62, -186], [128 + Math.sin(t * 12) * 16, -404]] : [[-62, -186 + tap], [62, -186 + (nb ? Math.abs(Math.cos(t * 9)) * 7 : 0)]];
        P.look = lerp(P.look, clamp((S.nexi.x - P.x) / 160, -1, 1), 0.08);
      } },
      { id: 'doc', keys: ['roster', 'stock'], P: DOC, act: function (P, t, S) {
        var st = S.cast.doc, dr = S.hot === 'roster' || S.hot === 'stock';
        P.talk = t < st.until; P.mood = P.talk || dr ? 'happy' : 'calm';
        P.hands = t < st.wave ? [[-64, -206], [118 + Math.sin(t * 12) * 16, -420]] : S.hot === 'stock' ? [[-64, -206], [170, -300]] : [[-64, -206], [96, -150]];
        P.look = lerp(P.look, clamp((S.nexi.x - P.x) / 160, -1, 1), 0.08); P.tilt = dr ? -0.04 : 0;
      } }
    ]
  };
})(window.IXW && window.IXW.kit);
