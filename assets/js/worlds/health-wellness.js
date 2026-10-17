/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: health-wellness (/industries/health-wellness) — Willow & Stone, a sample yoga and spa studio, drawn as its BRIGHT
   STUDIO on a calm morning. Warm plaster walls with drifting leaf shadows, a sage dado and a pale wood floor. In the frame:
   today's class schedule (Appointments), the retail shelf of oils, candles and mats (Point of Sale), the staff rota
   (Planning), the reception desk where members check in on the tablet (Frontdesk) and the takings screen shows recurring
   revenue (Accounting, Subscriptions), a singing bowl and an oil diffuser to tap, the membership stand (Subscriptions) and
   the arched garden window over the studio, where Leo holds tree pose. Beyond the frame: the tea lounge, the treatment
   room, a plant wall, a class on their mats and a pilates reformer. Staff: Maya, front desk (sample); Leo, instructor
   (sample). */
(function (K) {
  'use strict';
  if (!K) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed;
  var F = 470;
  var T = {
    sched: { x: 192, y: 60, w: 150, h: 138 }, shelf: { x: 196, y: 250, w: 140 }, rota: { x: 390, y: 56, w: 164, h: 96 },
    desk: { x: 372, y: 340, w: 258 }, tab: { x: 388, y: 290 }, screen: { x: 556, y: 282 }, bowl: { x: 470, y: 336 },
    stand: { x: 652, y: 296 }, win: { x: 762, y: 56, w: 180, h: 250 }, mat: { x: 790, y: 476 }
  };
  var C = { sage: '#8DB39A', sageD: '#5E8C6E', sand: '#EAD9C2', lav: '#B9A6D8', lavD: '#8C76B8', blush: '#F2B5A7', cream: '#FBF7F0', ink: '#3B3651', wood: '#C79E74', woodD: '#A57B52' };
  function plaster(g, W, ry, k, sx, sy) { /* soft morning light falling across the plaster */
    for (var i = 0; i < 5; i++) { var x0 = sx + (1080 - i * 260) * k, w = (70 + (i % 2) * 50) * k, gr = g.createLinearGradient(0, 0, 0, ry); gr.addColorStop(0, 'rgba(255,252,240,0)'); gr.addColorStop(0.5, 'rgba(255,252,240,.38)'); gr.addColorStop(1, 'rgba(255,252,240,0)');
      g.fillStyle = gr; g.beginPath(); g.moveTo(x0, 0); g.lineTo(x0 + w, 0); g.lineTo(x0 + w - 300 * k, ry); g.lineTo(x0 - 300 * k, ry); g.closePath(); g.fill(); } }
  var ROOM = { wall: ['#F8F2E9', '#EFE6D8'], wains: ['#CFE0D1', '#C1D7C4'], rail: '#FFFFFF', base: '#A7C2AC', floor: ['#EEDDC6', '#DCC6A8'], floorKind: 'planks', floorLine: 'rgba(150,110,60,.14)',
    panelLine: 'rgba(80,120,90,.10)', wainsH: 120, pattern: plaster };

  function leafPot(g, x, y, s, pot) { g.save(); g.translate(x, y); g.scale(s, s); soft(g, 0, 4, 46, 7, 0.2);
    for (var l = 0; l < 7; l++) { var a = -Math.PI / 2 + (l - 3) * 0.26; g.save(); g.translate(0, -40); g.rotate(a + Math.PI / 2); g.fillStyle = l % 2 ? '#7FAF8A' : '#6A9C77'; g.beginPath(); g.ellipse(0, -44, 12, 44, 0, 0, Math.PI * 2); g.fill(); g.restore(); }
    fillRR(g, -26, -46, 52, 46, 12, pot || '#E9CDB8'); fillRR(g, -29, -50, 58, 10, 5, '#F2DCCB'); g.restore(); }
  function jar(g, x, y, col, h) { fillRR(g, x, y - h, 16, h, 5, col); fillRR(g, x + 4, y - h - 6, 8, 7, 2, C.woodD); }

  /* ---------------- beyond the frame (ext = the whole hero in set units) ---------------- */
  function rattan(g, x, y, top) { g.strokeStyle = '#8A7055'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(x, top); g.lineTo(x, y - 30); g.stroke();
    g.fillStyle = '#D9B98C'; g.beginPath(); g.moveTo(x - 34, y); g.quadraticCurveTo(x - 30, y - 34, x, y - 34); g.quadraticCurveTo(x + 30, y - 34, x + 34, y); g.closePath(); g.fill();
    g.strokeStyle = 'rgba(138,112,85,.45)'; g.lineWidth = 1; for (var r = -24; r <= 24; r += 8) { g.beginPath(); g.moveTo(x + r, y); g.lineTo(x + r * 0.4, y - 32); g.stroke(); }
    var gl = g.createRadialGradient(x, y + 4, 2, x, y + 4, 60); gl.addColorStop(0, 'rgba(255,236,190,.55)'); gl.addColorStop(1, 'rgba(255,236,190,0)'); g.fillStyle = gl; g.beginPath(); g.arc(x, y + 4, 60, 0, 7); g.fill(); fillE(g, x, y + 2, 10, 5, '#FFF4D6'); }
  function print(g, x, y, w, h, kind) { shadowed(g, 8, 3, 0.14, function () { fillRR(g, x, y, w, h, 3, C.wood); }); fillRR(g, x + 5, y + 5, w - 10, h - 10, 2, '#FFFDF7');
    var cx = x + w / 2, cy = y + h / 2; g.strokeStyle = C.sageD; g.lineWidth = 1.6; g.beginPath(); g.moveTo(cx, y + h - 12); g.lineTo(cx, y + 14); g.stroke();
    for (var l = 0; l < 4; l++) { g.fillStyle = kind ? (l % 2 ? C.sage : '#A6CBB1') : (l % 2 ? C.blush : '#F6CFC4'); g.save(); g.translate(cx, y + h - 22 - l * (h - 34) / 4); g.rotate((l % 2 ? 1 : -1) * 0.7); g.beginPath(); g.ellipse(0, -8, 4.5, 10, 0, 0, Math.PI * 2); g.fill(); g.restore(); } }
  function upper(g, ext) {
    var top = Math.max(ext.t, -420), cl = Math.max(top, -250);
    /* the slat ceiling */
    if (cl > top) { g.fillStyle = '#EFDFC8'; g.fillRect(ext.l, top, ext.r - ext.l, cl - top); g.fillStyle = 'rgba(165,123,82,.18)'; for (var sx2 = Math.floor(ext.l / 26) * 26; sx2 < ext.r; sx2 += 26) g.fillRect(sx2, top, 8, cl - top);
      g.fillStyle = '#D9C2A3'; g.fillRect(ext.l, cl - 6, ext.r - ext.l, 6); }
    /* rattan pendants all the way across */
    for (var px = Math.floor(ext.l / 300) * 300 + 140; px < ext.r; px += 300) rattan(g, px, -120 + (Math.abs(px) % 600 === 140 ? 0 : 30), cl);
    /* a eucalyptus garland swinging along the wall */
    var gy = -40; g.strokeStyle = '#7FA88B'; g.lineWidth = 2; g.beginPath();
    for (var x = ext.l; x <= ext.r; x += 20) { var sag = Math.sin(((x - ext.l) / 320) * Math.PI) * 18; if (x === ext.l) g.moveTo(x, gy + Math.abs(sag)); else g.lineTo(x, gy + Math.abs(sag)); } g.stroke();
    for (var x2 = ext.l + 6, i = 0; x2 < ext.r; x2 += 14, i++) { var s2 = Math.abs(Math.sin(((x2 - ext.l) / 320) * Math.PI) * 18); fillE(g, x2, gy + s2 + (i % 2 ? 6 : -4), 6, 4.5, i % 3 ? '#9CC0A6' : '#86AE93'); }
    /* botanical prints and the script sign over the desk */
    [[-860, -170, 70, 96, 1], [-760, -150, 56, 74, 0], [-60, -180, 74, 100, 0], [40, -160, 56, 76, 1], [1040, -180, 74, 100, 1], [1140, -150, 56, 74, 0], [1250, -170, 70, 96, 0]].forEach(function (f) { if (f[0] > ext.l && f[0] + f[2] < ext.r) print(g, f[0], f[1], f[2], f[3], f[4]); });
    [[230, -150, 60, 84, 1], [310, -130, 48, 64, 0], [800, -150, 60, 84, 0], [878, -130, 48, 64, 1]].forEach(function (f) { print(g, f[0], f[1], f[2], f[3], f[4]); });
    g.save(); g.font = 'italic 700 44px "Iowan Old Style","Palatino Linotype",Georgia,serif'; g.textAlign = 'center'; g.fillStyle = 'rgba(94,140,110,.85)'; g.fillText('breathe', 592, -96); g.restore();
    g.strokeStyle = 'rgba(94,140,110,.5)'; g.lineWidth = 2; g.beginPath(); g.moveTo(524, -80); g.quadraticCurveTo(558, -70, 592, -80); g.quadraticCurveTo(626, -90, 660, -80); g.stroke();
  }
  function wideBack(g, ext) {
    upper(g, ext);
    /* hanging plants along the ceiling, all the way across */
    for (var hx = Math.floor(ext.l / 210) * 210 + 100; hx < ext.r; hx += 210) { if (hx > 170 && hx < 980) continue; g.strokeStyle = C.woodD; g.lineWidth = 1.4; g.beginPath(); g.moveTo(hx, Math.max(ext.t, -250)); g.lineTo(hx, 40); g.stroke();
      fillRR(g, hx - 18, 40, 36, 26, 10, C.blush); for (var v = 0; v < 5; v++) { g.fillStyle = v % 2 ? '#7FAF8A' : '#6A9C77'; g.beginPath(); g.ellipse(hx - 16 + v * 8, 70 + (v % 3) * 16, 5, 11, 0.2 * (v - 2), 0, Math.PI * 2); g.fill(); } }
    if (ext.l < -460) { /* the tea lounge: a sofa, a tea table, towels */
      var lx = -900; fillRR(g, lx + 20, 300, 160, 14, 6, C.wood); g.fillStyle = C.woodD; g.fillRect(lx + 30, 314, 6, F - 314); g.fillRect(lx + 164, 314, 6, F - 314);
      for (var t2 = 0; t2 < 4; t2++) fillRR(g, lx + 30 + t2 * 36, 270, 30, 30, 8, ['#FFFFFF', '#E9DFF5', '#FFFFFF', '#DCEBDF'][t2]);
      text(g, 'TOWELS', lx + 100, 262, 8, 800, C.ink, 'center');
      fillRR(g, lx + 220, 360, 200, 70, 22, C.lav); fillRR(g, lx + 220, 410, 200, 30, 12, C.lavD); fillRR(g, lx + 214, 380, 20, 60, 10, C.lavD); fillRR(g, lx + 406, 380, 20, 60, 10, C.lavD); g.fillStyle = C.woodD; g.fillRect(lx + 236, 440, 6, 30); g.fillRect(lx + 400, 440, 6, 30);
      fillE(g, lx + 320, F - 30, 46, 8, C.wood); g.fillStyle = C.woodD; g.fillRect(lx + 316, F - 30, 8, 30); fillRR(g, lx + 300, F - 52, 26, 22, 8, '#FFFFFF'); fillRR(g, lx + 322, F - 48, 10, 6, 3, '#FFFFFF'); fillRR(g, lx + 336, F - 44, 14, 14, 4, '#DCEBDF');
      shadowed(g, 10, 4, 0.16, function () { fillRR(g, lx + 230, 150, 150, 70, 8, '#FFFFFF'); }); text(g, 'TEA LOUNGE', lx + 305, 178, 10, 800, C.sageD, 'center'); text(g, 'ginger · lemongrass · mint', lx + 305, 198, 7.5, 700, '#8A8098', 'center');
    }
    if (ext.l < 100) { /* the treatment room door and a plant wall behind the copy */
      var dx = -440; fillRR(g, dx, 150, 172, 320, 6, C.woodD); fillRR(g, dx + 10, 160, 152, 310, 4, '#E6D2B8'); fillRR(g, dx + 26, 190, 120, 120, 6, '#D9C2A3'); fillRR(g, dx + 26, 330, 120, 110, 6, '#DCC6A8'); fillRR(g, dx + 136, 318, 16, 6, 3, C.ink);
      fillRR(g, dx + 36, 112, 100, 30, 6, C.sageD); text(g, 'TREATMENT', dx + 86, 126, 8, 800, '#FFFFFF', 'center'); text(g, 'ROOM 2', dx + 86, 137, 7, 800, '#DDEBDF', 'center');
      fillRR(g, dx + 46, 240, 80, 24, 12, '#FFFFFF'); text(g, 'Quiet please', dx + 86, 256, 7.5, 800, C.lavD, 'center');
      for (var pw = 0; pw < 3; pw++) for (var pc = 0; pc < 3; pc++) { var px = -230 + pc * 60, py = 140 + pw * 70; fillRR(g, px, py, 40, 26, 8, ['#E9CDB8', '#E9DFF5', '#DCEBDF'][(pw + pc) % 3]); for (var lv = 0; lv < 4; lv++) { g.fillStyle = lv % 2 ? '#7FAF8A' : '#6A9C77'; g.beginPath(); g.ellipse(px + 6 + lv * 9, py - 6, 6, 12, 0.3 * (lv - 1.5), 0, Math.PI * 2); g.fill(); } }
    }
    if (ext.r > 1000) { /* the class on their mats; a pilates reformer */
      [1020, 1150, 1280].forEach(function (mx, i) { if (mx > ext.r) return; fillRR(g, mx - 10, F - 4, 110, 10, 5, [C.lav, C.sage, C.blush][i]); });
      var rx = 1060; if (rx < ext.r) { fillRR(g, rx, 300, 220, 12, 5, C.wood); g.fillStyle = C.woodD; g.fillRect(rx + 10, 312, 8, 40); g.fillRect(rx + 200, 312, 8, 40); fillRR(g, rx + 30, 288, 70, 14, 6, '#FFFFFF'); g.strokeStyle = '#9C95B8'; g.lineWidth = 2; g.beginPath(); g.moveTo(rx + 210, 300); g.lineTo(rx + 230, 240); g.stroke(); fillRR(g, rx + 224, 232, 20, 10, 4, C.lavD); }
    }
  }
  function poser(x, ph, col, hs, pose) { return { P: { x: x, y: F + 2, s: 0.46, ph: ph, c: { skin: ['#F3CDA8', '#6B4329', '#E8B48F', '#8D5A3B'][Math.round(ph) % 4], hair: '#2B1D16', top: col, low: '#3B3651', shoe: '#F3CDA8' }, outfit: 'tee', hairStyle: hs, feet: true, mood: 'calm', look: 0, talk: false, hands: [[-60, -400], [60, -400]] }, pose: pose }; }
  var CLASS = [poser(1065, 0.3, C.sage, 'curly', 'tree'), poser(1195, 1.4, C.blush, 'pony', 'warrior'), poser(1325, 2.2, C.lav, 'long', 'tree')];
  var WALK = [{ x0: -940, x1: -520, y: 490, spd: 16, ph: 0.25, P: { s: 0.44, ph: 0.6, c: { skin: '#E8B48F', hair: '#4A2E22', top: C.lav, low: '#3B3651', shoe: '#FFFFFF' }, outfit: 'tee', hairStyle: 'long', hijab: '#8C76B8', hold: 'mat', mood: 'happy', look: 0, hands: [[-60, -200], [70, -150]] } },
    { front: true, x0: -930, x1: -420, y: 650, spd: 20, ph: 0.6, P: { s: 0.5, ph: 1.8, c: { skin: '#6B4329', hair: '#1F1A1A', top: C.sage, low: '#3B3651', shoe: '#FFFFFF' }, outfit: 'tee', hairStyle: 'buzz', short: true, hold: 'mat', mood: 'calm', look: 0, hands: [[-60, -200], [70, -150]] } },
    { x0: -280, x1: 80, y: 490, spd: 14, ph: 0.1, P: { s: 0.44, ph: 2.6, c: { skin: '#F3CDA8', hair: '#B9B9B9', top: '#FFFFFF', low: C.sageD, shoe: '#FFFFFF' }, outfit: 'tee', hairStyle: 'bun', clipCol: null, mood: 'happy', look: 0, hands: [[-70, -150], [70, -150]] } }];
  function walk(g, t, S, front) { var ext = S.ext;
    WALK.slice().sort(function (a, b) { return a.y - b.y; }).forEach(function (w) { var L = (w.front || w.y >= 560) ? 'fore' : w.y > 470; if (L !== front) return; var a = Math.max(w.x0, ext.l + 40), b = Math.min(w.x1, ext.r - 50); if (b - a < 60) return; K.walker(g, { x0: a, x1: b, y: w.y, spd: w.spd, ph: w.ph, P: w.P }, t); }); }
  function wideFront(g, ext) {
  }

  /* ---------------- static back props (set units) ---------------- */
  function paintBack(g, ext) {
    wideBack(g, ext);
    /* the arched garden window over the studio */
    var w = T.win; shadowed(g, 14, 5, 0.16, function () { g.fillStyle = '#FFFFFF'; g.beginPath(); g.moveTo(w.x - 12, w.y + w.h + 12); g.lineTo(w.x - 12, w.y + w.w / 2); g.arc(w.x + w.w / 2, w.y + w.w / 2, w.w / 2 + 12, Math.PI, 0); g.lineTo(w.x + w.w + 12, w.y + w.h + 12); g.closePath(); g.fill(); });
    g.save(); g.beginPath(); g.moveTo(w.x, w.y + w.h); g.lineTo(w.x, w.y + w.w / 2); g.arc(w.x + w.w / 2, w.y + w.w / 2, w.w / 2, Math.PI, 0); g.lineTo(w.x + w.w, w.y + w.h); g.closePath(); g.clip();
    var sk = g.createLinearGradient(0, w.y, 0, w.y + w.h); sk.addColorStop(0, '#CFEBF7'); sk.addColorStop(1, '#F4FAF6'); g.fillStyle = sk; g.fillRect(w.x, w.y, w.w, w.h);
    for (var tr = 0; tr < 6; tr++) fillE(g, w.x + 10 + tr * 34, w.y + w.h - 30 - (tr % 2) * 30, 40, 46, tr % 2 ? '#9CC9A6' : '#86BB93'); g.fillStyle = '#7FAF8A'; g.fillRect(w.x, w.y + w.h - 26, w.w, 26);
    g.restore(); g.fillStyle = '#FFFFFF'; g.fillRect(w.x + w.w / 2 - 3, w.y, 6, w.h); g.fillRect(w.x, w.y + 130, w.w, 6); fillRR(g, w.x - 18, w.y + w.h + 6, w.w + 36, 12, 5, '#FFFFFF');
    leafPot(g, w.x + 30, w.y + w.h + 6, 0.5, C.blush); leafPot(g, w.x + w.w - 30, w.y + w.h + 6, 0.5, C.sand);
    /* today's classes */
    var sc = T.sched; shadowed(g, 12, 5, 0.16, function () { fillRR(g, sc.x, sc.y, sc.w, sc.h, 10, '#FFFFFF'); }); fillRR(g, sc.x, sc.y, sc.w, 26, 10, C.sageD); g.fillStyle = C.sageD; g.fillRect(sc.x, sc.y + 16, sc.w, 10);
    text(g, "TODAY'S CLASSES", sc.x + sc.w / 2, sc.y + 17, 8.5, 800, '#FFFFFF', 'center');
    /* the retail shelf: oils, candles, rolled mats */
    var sh = T.shelf; soft(g, sh.x + sh.w / 2, F + 4, sh.w * 0.6, 9, 0.2); fillRR(g, sh.x, sh.y, sh.w, F - sh.y, 8, C.wood); fillRR(g, sh.x + 7, sh.y + 7, sh.w - 14, F - sh.y - 14, 4, '#F6EBDD');
    [sh.y + 70, sh.y + 140].forEach(function (ly) { fillRR(g, sh.x + 2, ly, sh.w - 4, 8, 2, C.woodD); });
    for (var j = 0; j < 6; j++) jar(g, sh.x + 14 + j * 20, sh.y + 70, ['#B9A6D8', '#8DB39A', '#F2B5A7'][j % 3], 26 + (j % 2) * 8);
    for (var c = 0; c < 4; c++) { fillRR(g, sh.x + 14 + c * 30, sh.y + 112, 24, 28, 6, 'rgba(255,255,255,.85)'); fillRR(g, sh.x + 17 + c * 30, sh.y + 124, 18, 14, 4, ['#F2B5A7', '#EAD9C2', '#B9A6D8', '#8DB39A'][c]); }
    [[C.lav, 0], [C.sage, 1], [C.blush, 2]].forEach(function (m) { fillRR(g, sh.x + 16 + m[1] * 38, F - 50, 30, 30, 15, m[0]); fillE(g, sh.x + 31 + m[1] * 38, F - 35, 6, 6, 'rgba(255,255,255,.5)'); });
    fillRR(g, sh.x + 30, sh.y - 22, 80, 18, 6, C.ink); text(g, 'STUDIO SHOP', sh.x + 70, sh.y - 9, 7.5, 800, '#FFFFFF', 'center');
    /* the staff rota (its bars are live) */
    var ro = T.rota; shadowed(g, 12, 5, 0.16, function () { fillRR(g, ro.x, ro.y, ro.w, ro.h, 10, '#FFFFFF'); }); fillRR(g, ro.x, ro.y, ro.w, 22, 10, C.lavD); g.fillStyle = C.lavD; g.fillRect(ro.x, ro.y + 12, ro.w, 10);
    text(g, 'STAFF ROTA · THIS WEEK', ro.x + 10, ro.y + 15, 7.5, 800, '#FFFFFF');
    ['LEO', 'AMIRA', 'JUN'].forEach(function (n, i) { text(g, n, ro.x + 10, ro.y + 42 + i * 18, 7, 800, C.ink); });
    /* the membership stand */
    var st = T.stand; soft(g, st.x + 26, F + 3, 30, 6, 0.2); g.fillStyle = C.woodD; g.fillRect(st.x + 22, st.y + 120, 8, F - st.y - 120); fillRR(g, st.x + 6, F - 8, 40, 8, 3, C.woodD);
    fillRR(g, st.x - 6, st.y, 64, 124, 8, C.cream); g.strokeStyle = C.sage; g.lineWidth = 2; rr(g, st.x - 2, st.y + 4, 56, 116, 6); g.stroke();
    text(g, 'JOIN', st.x + 26, st.y + 26, 11, 800, C.sageD, 'center'); text(g, 'MEMBERSHIP', st.x + 26, st.y + 40, 6.5, 800, C.ink, 'center');
    [0, 1, 2].forEach(function (i) { fillRR(g, st.x + 4 + i * 4, st.y + 54 + i * 18, 44, 26, 4, [C.lav, C.sage, C.blush][i]); });
    /* Leo's mat */
    var mt = T.mat; fillRR(g, mt.x, mt.y - 6, 130, 12, 6, C.lav); g.fillStyle = 'rgba(255,255,255,.3)'; g.fillRect(mt.x + 6, mt.y - 3, 118, 2);
  }

  /* ---------------- static front props: the reception desk (over Maya) ---------------- */
  function paintFront(g, ext) {
    var d = T.desk; fillRR(g, d.x - 6, d.y, d.w + 12, 14, 6, '#F6EBDD'); fillRR(g, d.x, d.y + 12, d.w, F - d.y - 12, 18, C.sage);
    g.save(); rr(g, d.x, d.y + 12, d.w, F - d.y - 12, 18); g.clip(); g.fillStyle = 'rgba(255,255,255,.12)'; for (var r = d.x + 14; r < d.x + d.w; r += 22) g.fillRect(r, d.y + 12, 10, F); g.restore();
    fillRR(g, d.x + 70, d.y + 46, 118, 40, 20, C.cream); text(g, 'Willow & Stone', d.x + 129, d.y + 66, 10.5, 800, C.sageD, 'center'); text(g, 'SAMPLE STUDIO', d.x + 129, d.y + 79, 6.5, 800, '#8A8098', 'center');
    var tb = T.tab; fillRR(g, tb.x + 16, tb.y + 40, 8, 12, 2, '#B9AFC8'); fillRR(g, tb.x, tb.y, 44, 44, 7, C.ink); fillRR(g, tb.x + 3, tb.y + 3, 38, 38, 4, '#FFFFFF');
    var sc = T.screen; fillRR(g, sc.x + 26, sc.y + 48, 10, 12, 2, '#B9AFC8'); fillRR(g, sc.x, sc.y, 64, 52, 7, C.ink); fillRR(g, sc.x + 4, sc.y + 4, 56, 44, 4, '#FFFFFF');
    var bw = T.bowl; fillE(g, bw.x, bw.y + 2, 24, 5, 'rgba(60,40,20,.15)'); g.fillStyle = '#C9A44A'; g.beginPath(); g.moveTo(bw.x - 22, bw.y - 16); g.quadraticCurveTo(bw.x, bw.y + 10, bw.x + 22, bw.y - 16); g.closePath(); g.fill(); fillE(g, bw.x, bw.y - 16, 22, 5, '#E3C36A');
    g.strokeStyle = C.woodD; g.lineWidth = 3; g.beginPath(); g.moveTo(bw.x + 26, bw.y - 2); g.lineTo(bw.x + 44, bw.y - 10); g.stroke();
  }

  /* ---------------- live ---------------- */
  var CLASSES = [['07:00', 'Vinyasa', 12], ['09:30', 'Pilates', 8], ['12:15', 'Stretch', 10], ['18:00', 'Yin', 14]];
  function paintWindow(g, t, par, S) {
    /* leaf shadows drifting across the plaster */
    g.fillStyle = 'rgba(94,140,110,.07)'; for (var i = 0; i < 6; i++) { var x = 120 + i * 160 + Math.sin(t * 0.4 + i) * 12, y = 40 + (i % 3) * 60; g.save(); g.translate(x, y); g.rotate(Math.sin(t * 0.5 + i) * 0.2);
      for (var l = 0; l < 5; l++) { g.beginPath(); g.ellipse(l * 14 - 28, Math.sin(l) * 10, 9, 22, 0.6, 0, Math.PI * 2); g.fill(); } g.restore(); }
  }
  function paintLive(g, t, now, S) {
    walk(g, t, S, false);
    CLASS.forEach(function (c, i) { if (c.P.x > S.ext.r - 30) return; var sw = Math.sin(t * 0.8 + i) * 4; c.P.hands = c.pose === 'tree' ? [[-12, -214 + sw], [12, -214 + sw]] : [[-226, -262 + sw], [226, -262 - sw]]; K.person(g, c.P, t); });
    var sc = T.sched, row = Math.floor(t / 3) % 4, bk = S.hot === 'book';
    CLASSES.forEach(function (c, i) { var y = sc.y + 36 + i * 24, on = i === row; fillRR(g, sc.x + 8, y, sc.w - 16, 20, 6, on ? (bk ? '#DCEBDF' : '#F3EEF8') : '#FFFFFF');
      text(g, c[0], sc.x + 14, y + 13.5, 7, 800, C.ink); text(g, c[1], sc.x + 48, y + 13.5, 7.5, 700, C.ink);
      for (var d = 0; d < 4; d++) fillE(g, sc.x + 104 + d * 9, y + 10, 3, 3, d < Math.round(c[2] / 4) - (on && bk ? 0 : 1) ? C.sageD : '#E3DCEB'); });
    var ro = T.rota, cols = [C.sage, C.lav, C.blush];
    for (var r2 = 0; r2 < 3; r2++) { var y2 = ro.y + 34 + r2 * 18; fillRR(g, ro.x + 48, y2, ro.w - 58, 10, 4, '#F3EEF8'); var st = (r2 * 0.22 + (S.hot === 'staff' ? Math.sin(t * 1.4 + r2) * 0.08 : 0)); fillRR(g, ro.x + 48 + (ro.w - 58) * st, y2, (ro.w - 58) * 0.42, 10, 4, cols[r2]); }
    var pt = T.shelf; if (S.hot === 'sell' && Math.floor(t * 3) % 2 === 0) { g.strokeStyle = '#C9A44A'; g.lineWidth = 2.4; rr(g, pt.x + 10, pt.y + 104, 122, 40, 6); g.stroke(); }
    var std = T.stand, tj = S.hot === 'join'; if (tj) { var k = (t % 1.5) / 1.5; fillRR(g, std.x + 4, std.y + 54 - k * 12, 44, 26, 4, C.lavD); text(g, 'NEW', std.x + 26, std.y + 71 - k * 12, 7, 800, '#FFFFFF', 'center'); }
  }
  function paintFrontLive(g, t, S) {
    walk(g, t, S, true);
    var tb = T.tab, ck = S.hot === 'checkin', ok = ck ? (t - (S.ckT || 0)) > 0.8 : (t % 6) > 3;
    fillRR(g, tb.x + 3, tb.y + 3, 38, 9, 3, C.sageD); text(g, 'CHECK-IN', tb.x + 22, tb.y + 10, 5.5, 800, '#FFFFFF', 'center');
    fillE(g, tb.x + 22, tb.y + 24, 7, 7, ok ? C.sage : '#E3DCEB'); if (ok) { g.strokeStyle = '#FFFFFF'; g.lineWidth = 2; g.beginPath(); g.moveTo(tb.x + 18, tb.y + 24); g.lineTo(tb.x + 21, tb.y + 27); g.lineTo(tb.x + 26, tb.y + 21); g.stroke(); }
    text(g, ok ? 'Welcome, Ana' : 'Scan card', tb.x + 22, tb.y + 38, 5, 700, C.ink, 'center');
    var sc = T.screen, cl = S.hot === 'close'; fillRR(g, sc.x + 4, sc.y + 4, 56, 9, 3, C.lavD); text(g, 'MRR', sc.x + 8, sc.y + 11, 5.5, 800, '#FFFFFF');
    g.strokeStyle = C.sageD; g.lineWidth = 2; g.beginPath(); for (var p = 0; p < 7; p++) { var x = sc.x + 8 + p * 8, y = sc.y + 38 - p * 2.6 - hash(p + 3) * 4 - (cl ? Math.min(1, (t - (S.clT || 0))) * 4 : 0); if (p) g.lineTo(x, y); else g.moveTo(x, y); } g.stroke();
    text(g, 'S$ 48.2k', sc.x + 56, sc.y + 24, 6.5, 800, C.ink, 'right');
    /* the singing bowl rings; the diffuser on the shelf breathes out mist (both tappable) */
    var bw = T.bowl, tb2 = S.toy.bowl != null ? t - S.toy.bowl : 99;
    if (tb2 < 2.4) for (var rg = 0; rg < 3; rg++) { var rr2 = ((tb2 * 30 + rg * 18) % 60), al = (1 - rr2 / 60) * (1 - tb2 / 2.4); g.strokeStyle = 'rgba(201,164,74,' + al.toFixed(2) + ')'; g.lineWidth = 2; g.beginPath(); g.ellipse(bw.x, bw.y - 16, 22 + rr2, 5 + rr2 * 0.3, 0, 0, Math.PI * 2); g.stroke(); }
    var sh = T.shelf, dx = sh.x + sh.w - 30, dy = sh.y - 24, td = S.toy.diff != null ? t - S.toy.diff : 99, big = td < 2.5;
    fillRR(g, dx - 10, dy - 22, 20, 22, 8, '#FFFFFF'); fillRR(g, dx - 12, dy - 2, 24, 6, 3, C.woodD);
    for (var m = 0; m < (big ? 6 : 3); m++) { var q = ((t * 0.4 + m / (big ? 6 : 3)) % 1); g.fillStyle = 'rgba(255,255,255,' + (0.65 * (1 - q)).toFixed(2) + ')'; g.beginPath(); g.arc(dx + Math.sin(t + m) * 6 * q, dy - 26 - q * (big ? 90 : 50), 4 + q * (big ? 14 : 8), 0, 7); g.fill(); }
  }

  var MAYA = { x: 502, y: 452, s: 0.56, ph: 0.4, c: { skin: '#E8B48F', hair: '#3A2620', top: C.lav, shirt: '#FFFFFF', pocket: '#F2B5A7' }, outfit: 'tee', hairStyle: 'long', feet: false, mood: 'calm', look: 0, talk: false, hands: [[-62, -186], [62, -186]] };
  var LEO = { x: 852, y: 474, s: 0.56, ph: 1.2, c: { skin: '#C68B5E', hair: '#1F1A1A', top: C.sage, low: '#3B3651', shoe: '#C68B5E', hat: '#F2B5A7' }, outfit: 'tee', hairStyle: 'short', beard: '#1F1A1A', short: true, feet: true, mood: 'calm', look: 0, talk: false, hands: [[-12, -214], [12, -214]] };

  /* the foreground, nearest last: each prop stands at a y, sorted with the front-row passers-by (K.zfore) */
  function FORE() {
    return [
      [694, function (g, ext) {
    if (ext.l < -560) leafPot(g, -860, 690, 1.3, C.blush);
      }],
      [690, function (g, ext) {
    if (ext.l < -220) { var bx = -330; fillRR(g, bx, 620, 120, 70, 14, C.wood); g.strokeStyle = C.woodD; g.lineWidth = 3; for (var w = 0; w < 4; w++) { g.beginPath(); g.moveTo(bx + 10 + w * 30, 624); g.lineTo(bx + 20 + w * 30, 686); g.stroke(); }
      [[C.lav, -18], [C.sage, 6], [C.blush, 28]].forEach(function (m) { fillRR(g, bx + 18 + m[1] + 30, 560, 22, 70, 11, m[0]); }); fillRR(g, bx + 128, 652, 34, 22, 4, C.lav); fillRR(g, bx + 134, 630, 34, 22, 4, C.sage); soft(g, bx + 70, 694, 80, 7, 0.2); }
      }],
      [664, function (g, ext) {
    if (ext.r > 1060) leafPot(g, 1120, 660, 1.1, C.sand);
      }]
    ];
  }
  window.IXW.worlds['health-wellness'] = {
    calmView: [180,-45,820,656], /* calm layer: the framed hero shows the core of the scene */
    pan: [-460, 1240], /* phones: how far the scene drags each way (set units), ending on whole objects */
    room: ROOM, paintBack: paintBack, paintFront: paintFront, paintWindow: paintWindow, paintLive: paintLive, paintFrontLive: paintFrontLive, paintForeLive: function (g, t, S) { K.zfore(g, t, S, FORE(), function () { walk(g, t, S, 'fore'); }); },
    moteCol: 'rgba(255,250,235,.8)',
    glow: {
      book: function (g) { var s = T.sched; rr(g, s.x - 8, s.y - 8, s.w + 16, s.h + 16, 14); },
      join: function (g) { var s = T.stand; rr(g, s.x - 14, s.y - 8, 80, F - s.y + 12, 12); },
      checkin: function (g) { var s = T.tab; rr(g, s.x - 8, s.y - 8, 60, 70, 12); },
      sell: function (g) { var s = T.shelf; rr(g, s.x - 8, s.y - 30, s.w + 16, F - s.y + 34, 14); },
      staff: function (g) { var s = T.rota; rr(g, s.x - 8, s.y - 8, s.w + 16, s.h + 16, 14); },
      close: function (g) { var s = T.screen; rr(g, s.x - 8, s.y - 8, 80, 76, 12); },
      bowl: function (g) { var s = T.bowl; rr(g, s.x - 30, s.y - 30, 80, 40, 12); },
      diff: function (g) { var s = T.shelf; rr(g, s.x + s.w - 46, s.y - 56, 32, 40, 10); }
    },
    backGlow: ['book', 'join', 'sell', 'staff', 'diff'],
    cast: [
      { id: 'maya', behind: true, keys: ['checkin', 'close', 'join'], P: MAYA, act: function (P, t, S) {
        var st = S.cast.maya, busy = S.hot === 'checkin' || S.hot === 'close';
        P.talk = t < st.until; P.mood = P.talk || busy ? 'happy' : 'calm';
        P.hands = t < st.wave ? [[-62, -186], [128 + Math.sin(t * 12) * 16, -404]] : [[-62, -186 + (busy ? Math.abs(Math.sin(t * 8)) * 6 : 0)], [62, -186]];
        P.look = lerp(P.look, clamp((S.nexi.x - P.x) / 160, -1, 1), 0.08);
      } },
      { id: 'leo', keys: ['staff', 'book'], P: LEO, act: function (P, t, S) {
        var st = S.cast.leo, waving = t < st.wave, flow = (Math.sin(t * 0.45) + 1) / 2, sw = Math.sin(t * 0.8) * 4;
        P.talk = t < st.until; P.mood = P.talk ? 'happy' : 'calm'; P.tilt = Math.sin(t * 0.6) * 0.03;
        /* a slow flow: namaste at the chest, opening out to warrior arms and back */
        P.hands = waving ? [[-12, -214], [128 + Math.sin(t * 12) * 16, -404]] : [[lerp(-12, -226, flow), lerp(-214, -262, flow) + sw], [lerp(12, 226, flow), lerp(-214, -262, flow) - sw]];
        P.look = lerp(P.look, clamp((S.nexi.x - P.x) / 160, -1, 1), 0.04);
      } }
    ],
    onStop: function (key, S, t) { if (key === 'checkin') S.ckT = t; if (key === 'close') S.clT = t; }
  };
  /* ---------------- audit round: behind the card, a water station with candles flickering on the shelf above it; on the
     floor, mats rolled out for the next class and Mira warming up on one (idle: a slow side stretch; tapped: a tree pose
     with a little hop and floating leaves); right of the caption, an aroma diffuser puffing ---------------- */
  var MIRA = { x: 122, y: 588, s: 0.5, ph: 3.1, c: { skin: '#C68B5E', hair: '#2B1D16', top: '#B9A6D8', low: '#3B3651', shoe: '#C68B5E' }, outfit: 'tee', hairStyle: 'bun', feet: true, mood: 'calm', look: 0, hands: [[-70, -150], [70, -150]] }, MT = { tap: -9 };
  function mat(g, x, y, w, col) { soft(g, x + w / 2, y + 5, w * 0.55, 6, 0.12); fillRR(g, x, y - 10, w, 20, 6, col); g.fillStyle = 'rgba(255,255,255,.25)'; g.fillRect(x + 6, y - 7, w - 12, 3); }
  function exFloor(g, ext) {
    [[-560, 556, 'rgba(141,179,154,.95)'], [-330, 572, 'rgba(185,166,216,.95)'], [20, 592, 'rgba(242,181,167,.95)']].forEach(function (m) { if (m[0] + 220 > ext.l) mat(g, m[0], m[1], 210, m[2]); });
    if (ext.l < -500) { g.save(); g.translate(-600, 556); fillE(g, 0, -4, 16, 14, '#8DB39A'); fillE(g, 0, -4, 8, 7, '#5E8C6E'); g.restore(); }
  }
  function exBack(g, ext) {
    if (ext.l > 180) return; g.save(); g.translate(-50, 0);
    /* the water station: a low console, a glass dispenser, cups */
    soft(g, 60, F + 4, 90, 7, 0.18); fillRR(g, -10, 410, 150, 14, 5, C.wood); fillRR(g, -2, 424, 134, 46, 4, '#E6D2B8'); g.fillStyle = C.woodD; g.fillRect(4, 424, 4, 46); g.fillRect(122, 424, 4, 46);
    fillRR(g, 20, 330, 50, 80, 12, 'rgba(210,235,240,.75)'); fillRR(g, 20, 360, 50, 50, 10, 'rgba(160,210,190,.55)'); fillRR(g, 28, 322, 34, 10, 4, C.woodD); fillRR(g, 40, 398, 10, 10, 2, C.woodD);
    for (var c = 0; c < 3; c++) fillRR(g, 86 + c * 14, 392 - (c % 2) * 6, 11, 18, 3, '#FFFFFF');
    text(g, 'INFUSED WATER', 60, 446, 7, 800, C.sageD, 'center'); text(g, 'help yourself', 60, 458, 6.5, 700, C.woodD, 'center');
    /* the candle shelf */
    fillRR(g, -20, 270, 170, 10, 4, C.wood); for (var k = 0; k < 4; k++) fillRR(g, -6 + k * 40, 246 - (k % 2) * 8, 18, 24 + (k % 2) * 8, 4, ['#FBF7F0', '#E9DFF5', '#FBF7F0', '#DCEBDF'][k]);
    g.restore();
  }
  function exLive(g, t, S) {
    if (S.ext.l > 180) return; g.save(); g.translate(-50, 0);
    for (var k = 0; k < 4; k++) { var fx = 3 + k * 40, fy = 240 - (k % 2) * 8, f = 1 + 0.18 * Math.sin(t * 9 + k * 2); fillE(g, fx, fy - 4 * f, 3.2, 6 * f, '#FFC94A'); fillE(g, fx, fy - 2.5 * f, 1.6, 3 * f, '#FFF2C4'); }
    for (var l = 0; l < 3; l++) { var ly = 370 + ((t * 8 + l * 13) % 36); fillE(g, 34 + l * 11, ly, 4, 4, l === 1 ? 'rgba(255,214,90,.9)' : 'rgba(140,200,120,.85)'); }
    g.restore();
  }
  function exFore(g, t, S) {
    var ext = S.ext;
    if (ext.l < 160) { var P = MIRA, d = t - MT.tap, tree = d >= 0 && d < 2.6;
      P.mood = tree || Math.sin(t * 0.6) > 0.3 ? 'happy' : 'calm';
      if (tree) { P.tilt = 0; P.hop = Math.abs(Math.sin(d * 5)) * 10 * (1 - d / 2.6); P.hands = [[-118, -404], [118, -404]]; }
      else { var sb = Math.sin(t * 0.8); P.tilt = sb * 0.14; P.hop = 0; P.hands = sb > 0 ? [[-70, -160], [96, -412]] : [[-96, -412], [70, -160]]; }
      P.look = -P.tilt * 4; K.person(g, P, t);
      if (tree) for (var i = 0; i < 4; i++) { var u = (d * 0.5 + i * 0.25) % 1; g.globalAlpha = 1 - u; g.fillStyle = i % 2 ? '#7FAF8A' : '#B9A6D8'; g.beginPath(); g.ellipse(P.x - 40 + i * 26, P.y - 260 - u * 80, 5, 9, u * 3, 0, 7); g.fill(); g.globalAlpha = 1; } }
    if (ext.r > 970) { var x = 952, y = 640; soft(g, x, y + 3, 30, 5, 0.2); fillRR(g, x - 18, y - 40, 36, 40, 14, '#FBF7F0'); fillRR(g, x - 18, y - 22, 36, 6, 3, C.wood); fillE(g, x, y - 42, 8, 4, '#E6D2B8');
      for (var p = 0; p < 4; p++) { var u2 = (t * 0.35 + p * 0.25) % 1; g.globalAlpha = (1 - u2) * 0.55; fillE(g, x + Math.sin(u2 * 6 + p) * 8, y - 50 - u2 * 70, 7 + u2 * 10, 5 + u2 * 8, '#FFFFFF'); g.globalAlpha = 1; } }
  }
  function exHit(x, y, S, t) { if (Math.abs(x - MIRA.x) < 55 && y > MIRA.y - 260 && y < MIRA.y + 10) { MT.tap = t; return true; } return false; }
  (function (W) { var pb = W.paintBack, pl = W.paintLive, pf = W.paintForeLive, h0 = W.hit;
    W.paintBack = function (g, ext) { exFloor(g, ext); pb(g, ext); exBack(g, ext); };
    W.paintLive = function (g, t, now, S) { pl(g, t, now, S); exLive(g, t, S); };
    W.paintForeLive = function (g, t, S) { exFore(g, t, S); pf(g, t, S); };
    W.hit = function (x, y, S, t, onBtn) { if (!onBtn && exHit(x, y, S, t)) return null; return h0 ? h0(x, y, S, t, onBtn) : null; };
  })(window.IXW.worlds['health-wellness']);
})(window.IXW && window.IXW.kit);
