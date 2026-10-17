/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: sol-social (/solutions/social-media) — "The Post Bakery": social media management told as a corner bakery that
   bakes fresh posts on a schedule, seen as a dollhouse cut-away on a bright morning. Inside (left): the bake plan on the
   big chalk menu board (the month's content calendar, chalked in post by post, content pillars on the side), the decorating
   bench where each post is iced and filmed (graphics, short video, copy, in the client's own colours), the client on a
   high stool tasting and stamping APPROVED (or asking for a change), and the deck ovens whose timers are the schedule.
   Outside (right): the shopfront with one display window per channel (LinkedIn, Facebook, Instagram); the runner carries
   each tray out and sets the fresh post in its window; passers-by stop, like and comment; the community manager answers on
   her tablet and drops every lead into the SALES CONTACT postbox; the chalk A-board on the pavement is the one-page
   monthly report, its bars growing as the month's posts go out.
   The cast: the planner on the library ladder chalks the plan (tap: the chalk flip and a gold star), the designer pipes
   and films (tap: a sprinkle shower), the client tastes and stamps (tap: the big APPROVED), the community manager replies
   and posts leads (tap: an emoji party on her tablet); the runner (tap: a tray pirouette), the passers-by, the follower on
   the bench and the pigeons are tappable in the canvas. Chimney steam, the croissant weather vane, bunting, a cargo bike. */
(function (K, CR, CO) {
  'use strict';
  if (!K || !CR || !CO) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed, limb = K.limb;
  var F = 470, ROOF = -196, CUT0 = 618, CUT1 = 644, FAC1 = 1092;
  var CREAM = '#FFF6EA', TILE = '#FFFBF4', MINT = '#BFE6D3', MINT_D = '#5FB38E', STRAW = '#F0627E', STRAW_D = '#C9405E', BUTTER = '#FFD36E', BUTTER_D = '#E0A93A';
  var COCOA = '#7A4B33', COCOA_D = '#55331F', WOOD = '#C98E5A', WOOD_L = '#E2B07E', INK = '#1B1F3B', CHALK = '#2F3B36', BLUE = '#3167CA';
  var CH = { li: { n: 'LinkedIn', c: '#0A66C2', l: 'in' }, fb: { n: 'Facebook', c: '#1877F2', l: 'f' }, ig: { n: 'Instagram', c: '#DD2A7B', l: 'IG' } };
  var PIL = [['Expertise', '#7FD6FF'], ['Behind the scenes', '#FFD36E'], ['Projects', '#9BE7B4'], ['Offers & events', '#FF9DB4']];
  /* the bake plan: [week, day, channel, pillar] — a sample month */
  var PLAN = [[0, 1, 'li', 0], [0, 3, 'ig', 1], [1, 0, 'fb', 3], [1, 2, 'li', 2], [1, 3, 'ig', 1], [2, 1, 'li', 0], [2, 3, 'fb', 3], [2, 4, 'ig', 2], [3, 0, 'li', 0], [3, 2, 'ig', 1], [3, 4, 'fb', 2]];
  var BD = { x: 192, y: -150, w: 270, h: 208 }, BENCH = { x: 196, y: 372, w: 176 }, OV = { x: 478, y: 118, w: 134 };
  var DECK = [{ y: 168, slot: 'LinkedIn · Tue 9:00', ch: 'li' }, { y: 290, slot: 'Instagram · Thu 12:00', ch: 'ig' }];
  var WIN = [{ x: 658, ch: 'li' }, { x: 772, ch: 'fb' }, { x: 886, ch: 'ig' }], WW = 102, WY0 = -22, WY1 = 288;
  var BOX = { x: 930, y: 330 }, AB = { x: 740, y: 352 }, TIMER = { x: 598, y: 104 };
  function cell(r, c) { return { x: BD.x + 12 + c * 43, y: BD.y + 50 + r * 38 }; }
  function smooth(u) { u = clamp(u, 0, 1); return u * u * (3 - 2 * u); }
  function heart(g, x, y, r, col) { g.fillStyle = col; g.beginPath(); g.moveTo(x, y + r * 0.9); g.bezierCurveTo(x - r * 1.5, y - r * 0.2, x - r * 0.8, y - r * 1.3, x, y - r * 0.5); g.bezierCurveTo(x + r * 0.8, y - r * 1.3, x + r * 1.5, y - r * 0.2, x, y + r * 0.9); g.fill(); }
  function star(g, x, y, r, col) { g.fillStyle = col; g.beginPath(); for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, d = i % 2 ? r * 0.45 : r; g.lineTo(x + Math.cos(a) * d, y + Math.sin(a) * d); } g.closePath(); g.fill(); }
  function chIcon(g, ch, x, y, s) { /* a tiny channel mark in a rounded square */
    var C = CH[ch]; if (ch === 'ig') { var gr = g.createLinearGradient(x - s, y + s, x + s, y - s); gr.addColorStop(0, '#F58529'); gr.addColorStop(0.5, '#DD2A7B'); gr.addColorStop(1, '#8134AF'); rr(g, x - s, y - s, s * 2, s * 2, s * 0.5); g.fillStyle = gr; g.fill();
      g.strokeStyle = '#FFFFFF'; g.lineWidth = s * 0.22; rr(g, x - s * 0.55, y - s * 0.55, s * 1.1, s * 1.1, s * 0.3); g.stroke(); g.beginPath(); g.arc(x, y, s * 0.28, 0, 7); g.stroke(); return; }
    fillRR(g, x - s, y - s, s * 2, s * 2, s * 0.45, C.c); text(g, C.l, x, y + s * 0.45, s * (ch === 'li' ? 1.05 : 1.35), 800, '#FFFFFF', 'center');
  }
  /* a post card: the picture, two caption lines, the channel mark (the posts in the windows, on trays, on the bench) */
  function postCard(g, x, y, w, h, ch, seed, tilt) {
    g.save(); g.translate(x, y); if (tilt) g.rotate(tilt);
    fillRR(g, -w / 2 - 1, -h - 1, w + 2, h + 2, 3, 'rgba(60,40,20,.14)'); fillRR(g, -w / 2, -h, w, h, 3, '#FFFFFF');
    var ph = h * 0.56, cols = [['#BFE3FF', '#FFE2A8'], ['#FFD3DE', '#BFE6D3'], ['#E4DBFF', '#FFE2A8'], ['#C9F0E4', '#FFD3DE']][Math.floor(hash(seed) * 4)];
    fillRR(g, -w / 2 + 2.5, -h + 2.5, w - 5, ph, 2, cols[0]); g.fillStyle = cols[1]; g.beginPath(); g.moveTo(-w / 2 + 2.5, -h + 2.5 + ph); g.lineTo(-w * 0.1, -h + ph * 0.45); g.lineTo(w * 0.18, -h + ph * 0.8); g.lineTo(w / 2 - 2.5, -h + ph * 0.55); g.lineTo(w / 2 - 2.5, -h + 2.5 + ph); g.closePath(); g.fill();
    fillE(g, w * 0.22, -h + ph * 0.32, w * 0.08, w * 0.08, '#FFFFFF');
    g.fillStyle = '#D5DCE6'; g.fillRect(-w / 2 + 3, -h + ph + 6, w * 0.62, 2); g.fillRect(-w / 2 + 3, -h + ph + 10.5, w * 0.42, 2);
    chIcon(g, ch, w / 2 - 5.5, -4.8, 3.2); g.restore();
  }
  function handAt(P, side) {
    var F3 = K.F3, d = side ? 1 : -1, h = P.hands[side], sxk = P.sx == null ? 1 : P.sx, bw = P.build || 1;
    var r = K.ik(d * F3.shx * bw, F3.shy, h[0], h[1], F3.a, F3.b, d).h, dy = -(P.hop || 0) + (P.sit ? (P.sitDrop != null ? P.sitDrop : 46) : 0);
    return [P.x + r[0] * P.s * sxk, P.y + (r[1] + dy) * P.s];
  }
  function mouthAt(P) { var dy = -(P.hop || 0) + (P.sit ? (P.sitDrop != null ? P.sitDrop : 46) : 0); return [P.x + P.look * 9 * P.s, P.y + (K.F3.hy + 46 + dy) * P.s]; }

  /* ---------------- the people ---------------- */
  var W = CR.who;
  var PLN = W({ x: 186, y: 214, s: 0.46, ph: 0.4, skin: 0, hair: 1, style: 'pony', outfit: 'cardigan', top: '#5FB38E', top2: '#FFFFFF', clip: STRAW, hands: [[-70, -170], [90, -330]], look: 0.6 });
  var DES = W({ x: 286, y: 470, s: 0.47, ph: 1.2, skin: 2, hair: 0, style: 'bun', outfit: 'polo', top: STRAW, top2: '#FFFFFF', hands: [[-50, -214], [40, -230]], look: 0.2 });
  DES.apron = BUTTER;
  var CLI = W({ x: 404, y: 470, s: 0.47, ph: 2.1, skin: 3, hair: 2, style: 'short', outfit: 'shirt', top: '#2F4B7C', glasses: true, sit: true, chair: false, id: '#9AA6BC', hands: [[-50, -200], [50, -200]], look: -0.3 });
  CLI.sitDrop = 4;
  var CMG = W({ x: 880, y: 478, s: 0.47, ph: 3.0, skin: 1, hair: 0, style: 'long', outfit: 'shirt', top: '#14A38B', hold: 'tablet', hands: [[-40, -210], [60, -190]], look: -0.4 });
  var RUN = W({ x: 630, y: 494, s: 0.49, ph: 0.7, skin: 4, hair: 3, style: 'short', outfit: 'polo', top: BLUE, top2: '#FFFFFF', hatKind: 'cap', hat: BUTTER, hands: [[-70, -150], [70, -150]] });
  RUN.apron = '#FFFFFF';
  var SIT = W({ x: 1236, y: 470, s: 0.47, ph: 1.7, skin: 0, hair: 1, style: 'bob', outfit: 'cardigan', top: '#B7A3E8', top2: '#FFFFFF', sit: true, chair: false, id: '#9AA6BC', hands: [[-30, -230], [30, -236]], look: -0.2 });
  SIT.sitDrop = 30;
  var CREW = [
    { x0: 1030, x1: 1360, y: 512, spd: 20, ph: 0.15, label: 'A passer-by', lines: ['Saw this on **Instagram** this morning. Had to come and look.', 'That post again? I **liked** it twice.'], acts: ['love', 'wave', 'nod'],
      P: W({ s: 0.5, skin: 2, hair: 2, style: 'long', outfit: 'cardigan', top: '#FF9DB4', top2: '#FFFFFF', hold: 'bags', id: '#9AA6BC' }) },
    { x0: 960, x1: 1350, y: 524, spd: 17, ph: 0.62, label: 'A follower', lines: ['Commented on the **LinkedIn** one. Somebody replied the same day.', 'I sent a message about a quote. They **passed it to sales**.'], acts: ['nod', 'think', 'wave'],
      P: W({ s: 0.51, skin: 3, hair: 0, style: 'short', outfit: 'shirt', top: '#F2B233', glasses: true, id: '#9AA6BC' }) },
    { x0: -920, x1: -470, y: 496, spd: 15, ph: 0.4, label: 'TechNext copywriter', lines: ['Copy written **for each channel**: a LinkedIn caption is not an Instagram one.', 'Fresh topics in the sack: **ideas** for next month.'], acts: ['id', 'wave', 'nod'],
      P: W({ s: 0.5, skin: 1, hair: 1, style: 'bun', outfit: 'cardigan', top: '#E0A93A', top2: '#FFFFFF', hold: 'box' }) },
    { front: true, x0: 1040, x1: 1380, y: 690, spd: 16, ph: 0.3, label: 'TechNext strategist', lines: ['Who we are talking to, on which channels, and the **handful of things** each month should do.', 'We recommend the mix. **You decide.**'], acts: ['id', 'nod', 'wave'],
      P: W({ s: 0.58, skin: 0, hair: 0, style: 'short', outfit: 'polo', top: '#714B67', top2: '#FFFFFF', hold: 'clipboard' }) }
  ];
  CREW[0].P.fixS = true; CREW[1].P.fixS = true; CREW[2].P.fixS = true;
  /* walkers keep clear of the floating side tabs (right) and the title card (left) */
  var MG = { ext: null, cardL: -9999, tabR: 9999 };
  function fitCrew(S) {
    if (MG.ext !== S.ext) { MG.ext = S.ext; MG.cardL = -9999; MG.tabR = 9999;
      var c = document.querySelector('.ixw-copy'), st = document.querySelector('[data-ixw-set]');
      if (c && st && window.innerWidth >= 768) { var cr = c.getBoundingClientRect(), sr = st.getBoundingClientRect(), k = sr.width / 1000; MG.cardL = (cr.left - sr.left) / k; MG.tabR = (window.innerWidth - 84 - sr.left) / k; } }
    CREW.forEach(function (w) { if (w.xMin == null) { w.xMin = w.x0; w.xMax = w.x1; }
      if (MG.cardL === -9999) { w.x0 = w.xMin; w.x1 = w.xMax; }
      else if (w.xMin >= 900) { w.x0 = w.xMin; w.x1 = Math.min(w.xMax, MG.tabR - 50); }
      else if (w.xMax <= 200) { w.x0 = Math.max(w.xMin, S.ext.l + 90); w.x1 = Math.min(w.xMax, MG.cardL - 70); } });
  }
  /* the dough counter (left, behind the title card): the TechNext copywriter kneads drafts; the proofing rack of drafts */
  var KN = W({ x: -338, y: 488, s: 0.47, ph: 2.6, skin: 2, hair: 0, style: 'short', outfit: 'polo', top: '#5FB38E', top2: '#FFFFFF', hands: [[-50, -230], [50, -230]], look: 0.2 });
  KN.apron = '#FFFFFF';
  var DC = { x: -420, y: 418, w: 170 }, PRF = { x: -110, y: 600 };

  /* ---------------- the static layers ---------------- */
  function setU(g, sx, sy, k) { g.translate(sx, sy); g.scale(k, k); }
  function extOf(W, H, k, sx, sy) { return { l: -(sx + 24) / k, r: (W - sx) / k, t: -(sy + 24) / k, b: (H - sy) / k }; }
  function paintBg(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    var sg = g.createLinearGradient(0, e.t, 0, ROOF); sg.addColorStop(0, '#86CDF5'); sg.addColorStop(0.6, '#BFE6FB'); sg.addColorStop(1, '#EAF7FD'); g.fillStyle = sg; g.fillRect(e.l, e.t, e.r - e.l, ROOF + 40 - e.t);
    var gl = g.createRadialGradient(1180, -330, 10, 1180, -330, 380); gl.addColorStop(0, 'rgba(255,247,210,.95)'); gl.addColorStop(0.3, 'rgba(255,240,190,.35)'); gl.addColorStop(1, 'rgba(255,240,190,0)'); g.fillStyle = gl; g.fillRect(e.l, e.t, e.r - e.l, 400);
    /* the rooftops of the street behind */
    for (var i = 0; i < 40; i++) { var bx = Math.floor(e.l / 70) * 70 + i * 70; if (bx > e.r) break; var bh = 30 + hash(i * 3.7 + 2) * 40; fillRR(g, bx, ROOF - 24 - bh, 64, bh + 30, 3, i % 2 ? '#CFE3EE' : '#D9EAF2'); g.fillStyle = 'rgba(255,255,255,.6)'; for (var w = 0; w < 3; w++) g.fillRect(bx + 10 + w * 18, ROOF - 14 - bh, 8, 8); }
    g.restore();
  }
  function tiles(g, x0, x1, y0, y1) { /* cream subway tiles */
    g.fillStyle = TILE; g.fillRect(x0, y0, x1 - x0, y1 - y0); g.strokeStyle = 'rgba(190,150,110,.2)'; g.lineWidth = 1.2; g.beginPath();
    for (var y = y0; y < y1; y += 16) { g.moveTo(x0, y); g.lineTo(x1, y); var off = (Math.round((y - y0) / 16) % 2) * 17; for (var x = Math.floor(x0 / 34) * 34 + off; x < x1; x += 34) { g.moveTo(x, y); g.lineTo(x, Math.min(y + 16, y1)); } }
    g.stroke();
  }
  function paintFrame(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    /* the interior: tiles, the mint wainscot, the beams */
    tiles(g, e.l, CUT0, ROOF, 360);
    var wa = g.createLinearGradient(0, 360, 0, F); wa.addColorStop(0, '#CDEDDD'); wa.addColorStop(1, '#B4E1CB'); g.fillStyle = wa; g.fillRect(e.l, 360, CUT0 - e.l, F - 360);
    g.fillStyle = '#FFFFFF'; g.fillRect(e.l, 356, CUT0 - e.l, 7); g.strokeStyle = 'rgba(40,110,80,.12)'; g.lineWidth = 2; for (var px = Math.floor(e.l / 60) * 60; px < CUT0; px += 60) { g.beginPath(); g.moveTo(px, 368); g.lineTo(px, F - 14); g.stroke(); }
    fillRR(g, e.l, F - 14, CUT0 - e.l, 14, 0, '#9FD3BB');
    /* the roof slab and its beam, joists, a tiled roof edge above */
    fillRR(g, e.l, ROOF - 30, FAC1 + 40 - e.l, 30, 0, '#F6EBDD'); g.fillStyle = '#EBDCC8'; g.fillRect(e.l, ROOF - 30, FAC1 + 40 - e.l, 4);
    fillRR(g, e.l, ROOF, CUT0 - e.l, 14, 0, '#E7CBA6'); g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(e.l, ROOF + 2, CUT0 - e.l, 3);
    for (var jx = Math.floor(e.l / 120) * 120 + 40; jx < CUT0 - 20; jx += 120) { fillRR(g, jx, ROOF + 12, 18, 10, 2, '#D9B48A'); }
    g.fillStyle = '#F1C4AE'; for (var tx = Math.floor(e.l / 22) * 22; tx < FAC1 + 40; tx += 22) { g.beginPath(); g.arc(tx + 11, ROOF - 30, 11, Math.PI, 0); g.fill(); }
    g.fillStyle = '#E8AE94'; g.fillRect(e.l, ROOF - 32, FAC1 + 40 - e.l, 3);
    /* the floor inside: warm checker tiles; outside: the pavement, the kerb, the road */
    var fl = g.createLinearGradient(0, F, 0, e.b); fl.addColorStop(0, '#F6E3CC'); fl.addColorStop(1, '#EBCFAF'); g.fillStyle = fl; g.fillRect(e.l, F, CUT1 - e.l, e.b - F);
    for (var ry = 0; ry < 12; ry++) { var y0 = F + Math.pow(ry / 12, 1.35) * (e.b - F + 20), y1 = F + Math.pow((ry + 1) / 12, 1.35) * (e.b - F + 20), sw = 40 + ry * 6;
      for (var cx = Math.floor(e.l / sw) * sw; cx < CUT1; cx += sw) if ((Math.round(cx / sw) + ry) % 2) { g.fillStyle = 'rgba(160,110,70,.10)'; g.fillRect(cx, y0, Math.min(sw, CUT1 - cx), y1 - y0); } }
    var pv = g.createLinearGradient(0, F, 0, e.b); pv.addColorStop(0, '#E4E8EC'); pv.addColorStop(1, '#D3D9DF'); g.fillStyle = pv; g.fillRect(CUT1, F, e.r - CUT1 + 40, 740 - F);
    g.strokeStyle = 'rgba(120,135,150,.28)'; g.lineWidth = 1.5; g.beginPath(); for (var d = 1; d < 7; d++) { var yy = F + Math.pow(d / 7, 1.4) * (740 - F); g.moveTo(CUT1, yy); g.lineTo(e.r + 40, yy); }
    for (var sx2 = CUT1 + 60; sx2 < e.r + 40; sx2 += 90) { g.moveTo(sx2, F); g.lineTo(sx2 + (sx2 - 820) * 0.25, 740); } g.stroke();
    fillRR(g, CUT1, 736, e.r - CUT1 + 40, 10, 0, '#C2CAD2'); g.fillStyle = '#9AA4AE'; g.fillRect(CUT1, 746, e.r - CUT1 + 40, e.b - 746); g.fillStyle = '#FFFFFF'; for (var lx = CUT1 + 20; lx < e.r + 40; lx += 120) g.fillRect(lx, 790, 60, 5);
    var sh = g.createLinearGradient(0, F, 0, F + 34); sh.addColorStop(0, 'rgba(60,40,30,.14)'); sh.addColorStop(1, 'rgba(60,40,30,0)'); g.fillStyle = sh; g.fillRect(e.l, F, e.r - e.l + 40, 34);
    g.restore();
  }
  function lamp(g, x, y) { g.strokeStyle = '#7A6A5A'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(x, ROOF + 18); g.lineTo(x, y - 14); g.stroke();
    g.fillStyle = MINT_D; g.beginPath(); g.moveTo(x - 7, y - 16); g.lineTo(x + 7, y - 16); g.lineTo(x + 22, y + 4); g.lineTo(x - 22, y + 4); g.closePath(); g.fill(); fillE(g, x, y + 5, 9, 5, '#FFF3C8'); }
  function jar(g, x, y, w, h, col, lid) { fillRR(g, x, y, w, h, 5, 'rgba(255,255,255,.75)'); fillRR(g, x + 3, y + h * 0.35, w - 6, h * 0.62, 4, col); fillRR(g, x - 1, y - 5, w + 2, 7, 3, lid || COCOA);
    g.fillStyle = 'rgba(255,255,255,.55)'; g.fillRect(x + 4, y + 4, 3, h - 10); }
  function sack(g, x, y, lab, col) { soft(g, x + 26, y + 2, 34, 5, 0.25); g.fillStyle = '#E8D3B0'; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x - 4, y - 50, x + 8, y - 64); g.lineTo(x + 44, y - 64); g.quadraticCurveTo(x + 56, y - 50, x + 52, y); g.closePath(); g.fill();
    g.strokeStyle = '#C9AE84'; g.lineWidth = 3; g.beginPath(); g.moveTo(x + 8, y - 60); g.lineTo(x + 44, y - 60); g.stroke(); fillRR(g, x + 8, y - 40, 36, 18, 3, col); text(g, lab, x + 26, y - 27.5, 7.4, 800, '#FFFFFF', 'center'); }
  function paintBack(g, ext) {
    /* ---- the far kitchen (wide screens): the back door under three team clocks, aprons, the cooling rack, sacks, the mixer, the pantry ---- */
    if (ext.l < -560) {
      var dx = -880; fillRR(g, dx - 8, 214, 100, F - 214, 6, COCOA_D); fillRR(g, dx, 222, 84, F - 222, 4, '#9ED3C0'); fillRR(g, dx + 12, 236, 60, 70, 4, '#DDF3FA'); g.fillStyle = 'rgba(255,255,255,.6)'; g.fillRect(dx + 40, 236, 4, 70);
      fillE(g, dx + 72, 360, 5, 5, BUTTER_D); text(g, 'BACK DOOR · DELIVERIES', dx + 42, 330, 6.6, 800, '#3E6B5A', 'center');
      [['SG', 8], ['PH', 8], ['VN', 7]].forEach(function (c, i) { var cx = dx - 22 + i * 64; fillRR(g, cx - 22, 104, 44, 14, 4, '#FFFFFF'); text(g, c[0] === 'SG' ? 'Singapore' : c[0] === 'PH' ? 'Philippines' : 'Vietnam', cx, 114, 6.6, 800, COCOA, 'center'); });
      [-760, -730, -700].forEach(function (hx, i) { fillE(g, hx, 230, 4, 4, '#9A8A7A'); g.fillStyle = [STRAW, BUTTER, '#FFFFFF'][i]; g.beginPath(); g.moveTo(hx - 12, 236); g.lineTo(hx + 12, 236); g.lineTo(hx + 16, 312); g.lineTo(hx - 16, 312); g.closePath(); g.fill(); });
      /* the cooling rack: trays of posts */
      var rx = -650; g.fillStyle = '#B9C2CC'; g.fillRect(rx, 150, 5, F - 150); g.fillRect(rx + 125, 150, 5, F - 150);
      for (var s = 0; s < 6; s++) { var ty = 172 + s * 48; fillRR(g, rx - 2, ty, 134, 5, 2, '#C9D1DA'); for (var p = 0; p < 4; p++) postCard(g, rx + 18 + p * 31, ty, 22, 24, ['li', 'ig', 'fb', 'ig', 'li'][(s + p) % 5], s * 7 + p, 0); }
      text(g, 'COOLING · NEXT WEEK', rx + 64, 160, 7, 800, COCOA, 'center');
      /* a shelf of cake tins over the rack, and the gallery of best posts by the door */
      fillRR(g, rx - 10, 116, 150, 7, 3, WOOD); ['#F0627E', '#5FB38E', '#FFD36E', '#7FD6FF'].forEach(function (c, i) { fillRR(g, rx + i * 36, 90, 30, 26, 5, c); fillRR(g, rx + i * 36 - 2, 86, 34, 7, 3, K.tone(c, 0.2)); g.fillStyle = 'rgba(255,255,255,.4)'; g.fillRect(rx + i * 36 + 4, 96, 4, 16); });
      text(g, 'OUR BEST POSTS', -820, -86, 8, 800, COCOA, 'center');
      [[-930, -70, 'ig', -0.04], [-860, -74, 'li', 0.03], [-790, -68, 'fb', -0.02], [-720, -72, 'ig', 0.04]].forEach(function (f, i) { g.save(); g.translate(f[0] + 28, f[1] + 36); g.rotate(f[3]);
        shadowed(g, 6, 3, 0.18, function () { fillRR(g, -30, -36, 60, 72, 4, i % 2 ? WOOD : COCOA); }); fillRR(g, -25, -31, 50, 62, 2, '#FFFFFF'); postCard(g, 0, 26, 40, 50, f[2], 90 + i, 0); g.restore(); });
    }
    if (ext.l < -200) {
      sack(g, -560, F, 'IDEAS', STRAW); sack(g, -500, F, 'TOPICS', MINT_D); sack(g, -530, F - 52, 'TRENDS', BUTTER_D);
      /* the pantry: jars of sprinkles, one per content pillar */
      [0, 1].forEach(function (r) { var y = 60 + r * 96; fillRR(g, -430, y + 70, 300, 9, 3, WOOD); g.fillStyle = WOOD_L; g.fillRect(-430, y + 70, 300, 3); });
      PIL.forEach(function (p, i) { var x = -420 + i * 74; jar(g, x, 82, 44, 46, p[1]); fillRR(g, x - 6, 134, 58, 12, 3, '#FFFFFF'); text(g, p[0].length > 12 ? p[0].replace('Behind the scenes', 'Behind scenes') : p[0], x + 22, 143, 6, 800, COCOA, 'center'); });
      ['#FFE2A8', '#C9F0E4', '#FFD3DE', '#E4DBFF', '#BFE3FF'].forEach(function (c, i) { jar(g, -416 + i * 58, 184, 34, 40, c, i % 2 ? STRAW : COCOA); });
      text(g, 'CONTENT PILLARS', -280, 68, 8, 800, COCOA, 'center');
      /* the floor mixer (its hook turns live) */
      var mx = -190; soft(g, mx, F + 2, 50, 6, 0.25); fillRR(g, mx - 40, F - 30, 80, 30, 8, '#E4E8EE'); fillRR(g, mx - 14, F - 200, 28, 170, 10, '#F2F4F8'); fillRR(g, mx - 46, F - 222, 92, 34, 14, STRAW);
      g.fillStyle = '#C9D1DA'; g.beginPath(); g.moveTo(mx - 38, F - 150); g.lineTo(mx + 38, F - 150); g.lineTo(mx + 30, F - 92); g.lineTo(mx - 30, F - 92); g.closePath(); g.fill(); text(g, 'COPY', mx, F - 120, 9, 800, '#7A869C', 'center');
    }
    /* ---- the back window with basil, the strategy recipe book ---- */
    if (ext.l < 100) {
      fillRR(g, -116, -78, 132, 186, 8, '#FFFFFF'); var wg = g.createLinearGradient(0, -70, 0, 100); wg.addColorStop(0, '#9FDBFA'); wg.addColorStop(1, '#E7F7FD'); fillRR(g, -106, -68, 112, 166, 4, wg);
      g.fillStyle = '#9ED39B'; g.beginPath(); g.moveTo(-106, 98); g.quadraticCurveTo(-60, 40, 6, 70); g.lineTo(6, 98); g.closePath(); g.fill(); g.fillStyle = '#7CC37A'; g.beginPath(); g.moveTo(-106, 98); g.quadraticCurveTo(-30, 64, 6, 98); g.closePath(); g.fill();
      g.fillStyle = '#FFFFFF'; g.fillRect(-52, -68, 6, 166); g.fillRect(-106, 10, 112, 6); fillRR(g, -124, 104, 148, 10, 4, '#FFFFFF');
      K.plant(g, { x: -76, y: 104 }, '#F59A8B', '#F7AE9F');
      /* a lectern with the strategy recipe book */
      var bx = 40; fillRR(g, bx + 26, 300, 12, F - 300, 3, COCOA_D); fillRR(g, bx + 10, F - 8, 44, 8, 3, COCOA_D);
      g.fillStyle = COCOA; g.beginPath(); g.moveTo(bx - 4, 300); g.lineTo(bx + 68, 300); g.lineTo(bx + 60, 270); g.lineTo(bx + 4, 270); g.closePath(); g.fill();
      g.fillStyle = '#FFFFFF'; g.beginPath(); g.moveTo(bx + 4, 268); g.lineTo(bx + 32, 272); g.lineTo(bx + 32, 240); g.lineTo(bx + 6, 236); g.closePath(); g.fill(); g.beginPath(); g.moveTo(bx + 60, 268); g.lineTo(bx + 32, 272); g.lineTo(bx + 32, 240); g.lineTo(bx + 58, 236); g.closePath(); g.fill();
      g.fillStyle = '#C9D3E3'; for (var bl = 0; bl < 3; bl++) { g.fillRect(bx + 10, 246 + bl * 7, 16, 2); g.fillRect(bx + 37, 246 + bl * 7, 16, 2); }
      fillRR(g, bx - 6, 216, 76, 16, 5, STRAW); text(g, 'STRATEGY', bx + 32, 227.5, 7.6, 800, '#FFFFFF', 'center');
    }
    /* ---- the bake plan: the big chalk menu board on two chains ---- */
    g.strokeStyle = '#8A7A6A'; g.lineWidth = 2; g.beginPath(); g.moveTo(BD.x + 30, ROOF + 18); g.lineTo(BD.x + 30, BD.y); g.moveTo(BD.x + BD.w - 30, ROOF + 18); g.lineTo(BD.x + BD.w - 30, BD.y); g.stroke();
    shadowed(g, 14, 6, 0.22, function () { fillRR(g, BD.x - 8, BD.y - 8, BD.w + 16, BD.h + 16, 10, WOOD); });
    fillRR(g, BD.x, BD.y, BD.w, BD.h, 5, CHALK); g.fillStyle = 'rgba(255,255,255,.04)'; g.fillRect(BD.x, BD.y, BD.w, BD.h * 0.4);
    text(g, 'THE BAKE PLAN', BD.x + 96, BD.y + 19, 11, 800, '#FFFFFF'); text(g, '· this month', BD.x + 188, BD.y + 19, 8, 700, 'rgba(255,255,255,.7)');
    ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].forEach(function (d, i) { text(g, d, BD.x + 32 + i * 43, BD.y + 40, 7.4, 800, 'rgba(255,255,255,.75)', 'center'); });
    g.strokeStyle = 'rgba(255,255,255,.18)'; g.lineWidth = 1; g.setLineDash([3, 3]);
    for (var r = 0; r < 4; r++) for (var c = 0; c < 5; c++) { var ce = cell(r, c); rr(g, ce.x, ce.y, 40, 34, 4); g.stroke(); }
    g.setLineDash([]);
    for (var wk = 0; wk < 4; wk++) text(g, 'W' + (wk + 1), BD.x + 5, BD.y + 70 + wk * 38, 5.6, 800, 'rgba(255,255,255,.45)');
    g.strokeStyle = 'rgba(255,255,255,.25)'; g.beginPath(); g.moveTo(BD.x + 232 - 18, BD.y + 30); g.lineTo(BD.x + 232 - 18, BD.y + BD.h - 10); g.stroke();
    text(g, 'PILLARS', BD.x + 222, BD.y + 40, 6.6, 800, 'rgba(255,255,255,.75)');
    PIL.forEach(function (p, i) { var y = BD.y + 58 + i * 34; fillE(g, BD.x + 226, y, 4, 4, p[1]); var ws = p[0].split(' '), l1 = ws.slice(0, 2).join(' '), l2 = ws.slice(2).join(' ');
      text(g, l1, BD.x + 233, y + 2.4, 6, 700, 'rgba(255,255,255,.85)'); if (l2) text(g, l2, BD.x + 233, y + 10, 6, 700, 'rgba(255,255,255,.85)'); });
    fillRR(g, BD.x + 10, BD.y + BD.h - 4, 90, 6, 3, WOOD_L); fillRR(g, BD.x + 22, BD.y + BD.h - 7, 14, 4, 2, '#FFFFFF'); fillRR(g, BD.x + 42, BD.y + BD.h - 7, 12, 4, 2, '#FFD36E'); fillRR(g, BD.x + 64, BD.y + BD.h - 10, 26, 8, 3, '#8A6A4A');
    /* the library ladder's rail (the ladder itself rolls, drawn live) and the pendant lamps */
    g.strokeStyle = '#8A6A4A'; g.lineWidth = 4; g.beginPath(); g.moveTo(BD.x - 70, BD.y - 14); g.lineTo(BD.x + BD.w + 12, BD.y - 14); g.stroke();
    lamp(g, 100, -60); if (ext.l < -200) { lamp(g, -320, -40); lamp(g, -660, -50); }
    /* the wall shelf over the bench: sprinkles, the brand kit tin, the piping tips */
    fillRR(g, BENCH.x, 196, BENCH.w - 20, 8, 3, WOOD); g.fillStyle = WOOD_L; g.fillRect(BENCH.x, 196, BENCH.w - 20, 3);
    jar(g, BENCH.x + 6, 160, 26, 36, '#FFD3DE', STRAW); jar(g, BENCH.x + 38, 166, 22, 30, '#BFE3FF'); jar(g, BENCH.x + 64, 162, 24, 34, '#FFE2A8', MINT_D);
    fillRR(g, BENCH.x + 96, 164, 56, 32, 5, BLUE); fillRR(g, BENCH.x + 96, 164, 56, 9, 4, '#1E4691'); text(g, 'BRAND KIT', BENCH.x + 124, 186, 7, 800, '#FFFFFF', 'center');
    ['#3167CA', '#F0627E', '#FFD36E', '#14A38B'].forEach(function (c, i) { fillE(g, BENCH.x + 106 + i * 12, 191.5, 3.4, 3.4, c); });
    /* the utensil rail over the client's stool */
    g.strokeStyle = '#B9C2CC'; g.lineWidth = 3; g.beginPath(); g.moveTo(380, 104); g.lineTo(462, 104); g.stroke();
    [[392, 'whisk'], [412, 'pin'], [434, 'spat'], [452, 'ladle']].forEach(function (u) { var x = u[0]; g.strokeStyle = '#9AA6BC'; g.lineWidth = 2; g.beginPath(); g.moveTo(x, 104); g.lineTo(x, 112); g.stroke();
      if (u[1] === 'whisk') { g.strokeStyle = '#B9C2CC'; g.lineWidth = 1.4; for (var q = -1; q <= 1; q++) { g.beginPath(); g.ellipse(x, 140, 6 - Math.abs(q) * 2, 26, 0, 0, 7); g.stroke(); } fillRR(g, x - 2.5, 108, 5, 16, 2, COCOA); }
      else if (u[1] === 'pin') { fillRR(g, x - 4, 112, 8, 60, 4, WOOD_L); fillRR(g, x - 2.5, 106, 5, 8, 2, WOOD); fillRR(g, x - 2.5, 170, 5, 8, 2, WOOD); }
      else if (u[1] === 'spat') { fillRR(g, x - 2, 112, 4, 30, 2, COCOA); fillRR(g, x - 7, 140, 14, 22, 5, STRAW); }
      else { fillRR(g, x - 1.5, 112, 3, 34, 1.5, '#B9C2CC'); fillE(g, x, 150, 8, 6, '#B9C2CC'); } });
    /* ---- the deck ovens: brick surround, the copper hood and flue, two doors, two timers, two slot plates ---- */
    g.fillStyle = '#C8A383'; g.beginPath(); g.moveTo(OV.x + 26, 120); g.lineTo(OV.x + OV.w - 26, 120); g.lineTo(OV.x + OV.w / 2 + 14, 58); g.lineTo(OV.x + OV.w / 2 - 14, 58); g.closePath(); g.fill();
    fillRR(g, OV.x + OV.w / 2 - 14, ROOF + 18, 28, 58 - ROOF - 18, 2, '#C98A5E'); g.fillStyle = 'rgba(255,255,255,.22)'; g.fillRect(OV.x + OV.w / 2 - 10, ROOF + 18, 4, 58 - ROOF - 18);
    fillRR(g, OV.x + 20, 112, OV.w - 40, 10, 4, '#B0866A');
    shadowed(g, 12, 4, 0.2, function () { fillRR(g, OV.x, OV.y + 10, OV.w, F - OV.y - 10, 10, '#D9785A'); });
    g.strokeStyle = 'rgba(255,255,255,.22)'; g.lineWidth = 1.4; g.beginPath(); for (var by = OV.y + 26; by < F; by += 14) { g.moveTo(OV.x, by); g.lineTo(OV.x + OV.w, by); var o2 = (Math.round(by / 14) % 2) * 14; for (var bx2 = OV.x + o2; bx2 < OV.x + OV.w; bx2 += 28) { g.moveTo(bx2, by); g.lineTo(bx2, by - 14); } } g.stroke();
    fillRR(g, OV.x - 4, OV.y + 6, OV.w + 8, 12, 5, '#B85E43');
    DECK.forEach(function (d) { shadowed(g, 8, 3, 0.2, function () { fillRR(g, OV.x + 26, d.y, 96, 100, 8, '#3A3F4F'); }); fillRR(g, OV.x + 32, d.y + 6, 84, 62, 6, '#1E2230');
      fillRR(g, OV.x + 40, d.y + 74, 68, 7, 3.5, '#C9D1DA'); fillRR(g, OV.x + 30, d.y + 86, 88, 10, 3, '#E2C27A'); text(g, d.slot, OV.x + 74, d.y + 93.6, 5.6, 800, COCOA_D, 'center');
      fillE(g, OV.x + 14, d.y + 30, 12, 12, '#FFFFFF'); g.strokeStyle = '#3A3F4F'; g.lineWidth = 2; g.beginPath(); g.arc(OV.x + 14, d.y + 30, 12, 0, 7); g.stroke(); });
    fillRR(g, OV.x + 26, 404, 96, 58, 6, '#7A3E2A'); for (var lg = 0; lg < 5; lg++) { fillE(g, OV.x + 40 + lg * 17, 448 - (lg % 2) * 14, 8, 8, '#B8875A'); fillE(g, OV.x + 40 + lg * 17, 448 - (lg % 2) * 14, 4, 4, '#E2B07E'); }
    fillRR(g, OV.x + 4, 226, 20, 38, 4, '#3A3F4F'); text(g, 'Odoo', OV.x + 14, 248, 5.2, 800, '#FFFFFF', 'center');
    /* ---- the cut wall: the building's front wall in section ---- */
    fillRR(g, CUT0, ROOF - 30, CUT1 - CUT0, F - ROOF + 30, 0, '#F3E6D2'); g.fillStyle = '#E2CFB4'; for (var cy2 = ROOF - 20; cy2 < F; cy2 += 26) g.fillRect(CUT0, cy2, CUT1 - CUT0, 2);
    g.fillStyle = 'rgba(80,50,30,.10)'; g.fillRect(CUT0, ROOF - 30, 4, F - ROOF + 30);
    /* ---- the shopfront: butter-cream facade, the signboard, three awnings, three display windows, the door, the bulkhead ---- */
    var fg = g.createLinearGradient(0, ROOF - 30, 0, F); fg.addColorStop(0, '#FCEBC8'); fg.addColorStop(1, '#F7DDB0'); g.fillStyle = fg; g.fillRect(CUT1, ROOF - 30, FAC1 - CUT1, F - ROOF + 30);
    fillRR(g, CUT1 - 4, ROOF - 40, FAC1 - CUT1 + 8, 14, 3, '#FFFFFF'); fillRR(g, CUT1, ROOF - 28, FAC1 - CUT1, 6, 0, '#EED4A4');
    for (var pf = 0; pf < 8; pf++) { var px2 = CUT1 + 30 + pf * 56; if (px2 > FAC1 - 30) break; g.save(); g.translate(px2 + 15, ROOF - 40); g.scale(0.32, 0.32); K.plant(g, { x: 0, y: 0 }, pf % 2 ? '#E58C6B' : '#F2C94C', pf % 2 ? '#F2A486' : '#F7DA7A'); g.restore(); }
    /* upper floor: two shuttered windows with flower boxes */
    [CUT1 + 60, CUT1 + 250].forEach(function (ux) { fillRR(g, ux, -214, 56, 62, 4, '#FFFFFF'); fillRR(g, ux + 5, -209, 46, 52, 2, '#BFE3F5'); g.fillStyle = 'rgba(255,255,255,.6)'; g.fillRect(ux + 26, -209, 4, 52);
      [-1, 1].forEach(function (d) { fillRR(g, d < 0 ? ux - 22 : ux + 58, -214, 20, 62, 3, '#5FB38E'); g.fillStyle = 'rgba(255,255,255,.3)'; for (var sl = 0; sl < 6; sl++) g.fillRect(d < 0 ? ux - 19 : ux + 61, -208 + sl * 9, 14, 2); });
      fillRR(g, ux - 6, -152, 68, 10, 3, '#C98E5A'); for (var fl2 = 0; fl2 < 6; fl2++) fillE(g, ux + 2 + fl2 * 11, -155, 5, 5, [STRAW, BUTTER, '#FFFFFF', '#FF9DB4', BUTTER, STRAW][fl2]); });
    shadowed(g, 10, 4, 0.18, function () { fillRR(g, CUT1 + 14, -136, 352, 40, 8, COCOA); });
    fillRR(g, CUT1 + 19, -131, 342, 30, 6, '#8E5A3E'); CO.plane(g, CUT1 + 40, -116, 1.05, 0, BUTTER, COCOA);
    text(g, 'TechNext Post Bakery', CUT1 + 56, -110, 14, 800, BUTTER); text(g, 'fresh posts · baked on schedule', CUT1 + 222, -110.5, 7.4, 700, '#FCEBC8');
    WIN.forEach(function (w, i) {
      var C = CH[w.ch], x = w.x;
      /* the window: frame, the display inside, gold-leaf name */
      fillRR(g, x - 8, WY0 - 8, WW + 16, WY1 - WY0 + 16, 8, COCOA); var ig = g.createLinearGradient(0, WY0, 0, WY1); ig.addColorStop(0, '#FFF9EE'); ig.addColorStop(1, '#F6E6CE'); fillRR(g, x, WY0, WW, WY1 - WY0, 4, ig);
      g.fillStyle = 'rgba(122,75,51,.06)'; for (var st = 0; st < 5; st++) g.fillRect(x + st * 22, WY0, 11, WY1 - WY0);
      /* the tiered stand and the posts on it (the newest slot is drawn live) */
      var cx = x + WW / 2; fillRR(g, cx - 3, 120, 6, 150, 2, '#C9A44A');
      [[86, 126], [64, 190], [42, 252]].forEach(function (t, k) { fillE(g, cx, t[1], t[0] / 2 + 6, 5, '#FFFFFF'); fillE(g, cx, t[1] - 1.5, t[0] / 2 + 4, 3.5, '#F2EDE4'); });
      postCard(g, cx - 24, 120, 26, 30, w.ch, i * 5 + 1, -0.06); postCard(g, cx + 24, 120, 26, 30, w.ch, i * 5 + 2, 0.06);
      postCard(g, cx - 32, 184, 26, 30, w.ch, i * 5 + 3, -0.05); postCard(g, cx + 32, 184, 26, 30, w.ch, i * 5 + 4, 0.05);
      postCard(g, cx - 34, 246, 26, 30, w.ch, i * 5 + 6, -0.04); postCard(g, cx + 34, 246, 26, 30, w.ch, i * 5 + 7, 0.04);
      fillRR(g, x, 262, WW, 26, 0, '#F1DCC0'); g.fillStyle = 'rgba(255,255,255,.4)'; g.fillRect(x, 262, WW, 2);
      g.fillStyle = 'rgba(255,255,255,.34)'; g.beginPath(); g.moveTo(x + 10, WY1); g.lineTo(x + 44, WY0); g.lineTo(x + 60, WY0); g.lineTo(x + 26, WY1); g.closePath(); g.fill();
      text(g, C.n, cx, 12, 10.5, 800, '#C9962E', 'center'); text(g, C.n, cx - 0.6, 11.4, 10.5, 800, '#F4CB5E', 'center');
      chIcon(g, w.ch, cx, -4, 5.4);
      /* the awning: scalloped stripes in the channel's colours */
      var ac = w.ch === 'ig' ? ['#F58529', '#DD2A7B'] : w.ch === 'fb' ? [C.c, '#FFFFFF'] : [C.c, '#FFFFFF'];
      g.fillStyle = '#6E4630'; g.fillRect(x - 12, -92, WW + 24, 5);
      for (var a = 0; a < 6; a++) { var ax = x - 12 + a * (WW + 24) / 6, aw = (WW + 24) / 6; g.fillStyle = a % 2 ? ac[1] : ac[0]; g.beginPath(); g.moveTo(ax, -87); g.lineTo(ax + aw, -87); g.lineTo(ax + aw + 2, -46); g.lineTo(ax - 2, -46); g.closePath(); g.fill();
        g.beginPath(); g.arc(ax + aw / 2, -46, aw / 2 + 2, 0, Math.PI); g.fill(); }
      g.fillStyle = 'rgba(0,0,0,.06)'; g.fillRect(x - 12, -87, WW + 24, 6);
      /* the bulkhead under the window */
      fillRR(g, x - 8, WY1 + 10, WW + 16, F - WY1 - 10, 4, '#B4E1CB'); g.strokeStyle = 'rgba(40,110,80,.18)'; g.lineWidth = 1.5; rr(g, x + 2, WY1 + 22, WW - 4, F - WY1 - 40, 5); g.stroke();
    });
    /* the door, its OPEN sign and the posting-times plaque */
    var dx2 = 1004; fillRR(g, dx2 - 8, -40, 82, F + 40, 6, COCOA); fillRR(g, dx2, -32, 66, F + 32, 4, '#E8F3EE'); fillRR(g, dx2 + 8, -24, 50, 220, 3, '#D7EEF8'); g.fillStyle = 'rgba(255,255,255,.5)'; g.beginPath(); g.moveTo(dx2 + 12, 196); g.lineTo(dx2 + 34, -24); g.lineTo(dx2 + 46, -24); g.lineTo(dx2 + 24, 196); g.closePath(); g.fill();
    fillRR(g, dx2 + 12, 40, 42, 20, 4, '#FFFFFF'); g.strokeStyle = STRAW; g.lineWidth = 1.5; rr(g, dx2 + 14, 42, 38, 16, 3); g.stroke(); text(g, 'OPEN', dx2 + 33, 54, 8.6, 800, STRAW_D, 'center');
    g.strokeStyle = '#9AA6BC'; g.lineWidth = 1; g.beginPath(); g.moveTo(dx2 + 22, 30); g.lineTo(dx2 + 33, 18); g.lineTo(dx2 + 44, 30); g.stroke();
    fillRR(g, dx2 + 50, 230, 6, 40, 3, BUTTER_D); fillRR(g, dx2 + 4, 300, 58, 54, 5, '#FFFFFF'); text(g, 'POSTING', dx2 + 33, 316, 6.8, 800, COCOA, 'center'); text(g, 'TIMES', dx2 + 33, 326, 6.8, 800, COCOA, 'center');
    text(g, 'chosen to suit', dx2 + 33, 338, 5.4, 700, '#8A7A6A', 'center'); text(g, 'each platform', dx2 + 33, 346, 5.4, 700, '#8A7A6A', 'center');
    fillRR(g, dx2 - 2, -96, 86, 44, 6, '#FFFFFF'); text(g, 'Replies', dx2 + 41, -78, 9, 800, COCOA, 'center'); text(g, 'on working days', dx2 + 41, -66, 6.6, 700, '#8A7A6A', 'center');
    /* the SALES CONTACT postbox on the bulkhead */
    shadowed(g, 6, 3, 0.2, function () { fillRR(g, BOX.x, BOX.y, 44, 52, 7, '#D2463D'); }); fillRR(g, BOX.x + 6, BOX.y + 10, 32, 5, 2.5, '#5A1E1A'); fillRR(g, BOX.x + 4, BOX.y + 22, 36, 22, 3, '#FFFFFF');
    text(g, 'SALES', BOX.x + 22, BOX.y + 31, 6.4, 800, '#D2463D', 'center'); text(g, 'CONTACT', BOX.x + 22, BOX.y + 40, 6.4, 800, '#D2463D', 'center');
    /* ---- next door (wide screens): a flower shop, a lamppost with a hanging basket, a bench ---- */
    if (ext.r > FAC1) {
      fillRR(g, FAC1, ROOF - 70, 420, F - ROOF + 70, 0, '#DCEBF6'); g.fillStyle = '#C9DDEC'; g.fillRect(FAC1, ROOF - 70, 6, F - ROOF + 70);
      for (var nw = 0; nw < 3; nw++) { fillRR(g, FAC1 + 40 + nw * 110, ROOF - 40, 60, 80, 4, '#FFFFFF'); fillRR(g, FAC1 + 46 + nw * 110, ROOF - 34, 48, 68, 2, '#AFD8F2'); fillRR(g, FAC1 + 36 + nw * 110, ROOF + 42, 68, 10, 3, '#9ED39B'); for (var fl = 0; fl < 5; fl++) fillE(g, FAC1 + 42 + nw * 110 + fl * 14, ROOF + 40, 5, 5, [STRAW, BUTTER, '#B7A3E8', '#FF9DB4', '#FFFFFF'][fl]); }
      fillRR(g, FAC1 + 30, 20, 340, 40, 6, '#5FB38E'); text(g, 'NEXT DOOR · FLOWERS', FAC1 + 200, 46, 12, 800, '#FFFFFF', 'center');
      fillRR(g, FAC1 + 40, 90, 300, 200, 6, '#FFFFFF'); fillRR(g, FAC1 + 48, 98, 284, 184, 3, '#EAF6EF');
      for (var bk = 0; bk < 6; bk++) { var bx3 = FAC1 + 70 + bk * 46; fillRR(g, bx3 - 14, 250, 28, 30, 5, '#C98E5A'); for (var fb2 = 0; fb2 < 4; fb2++) fillE(g, bx3 - 9 + fb2 * 6, 240 - (fb2 % 2) * 6, 6, 6, [STRAW, BUTTER, '#B7A3E8', '#FF9DB4'][(fb2 + bk) % 4]); g.fillStyle = '#5FB38E'; g.fillRect(bx3 - 1, 244, 2, 8); }
      fillRR(g, FAC1 + 30, 290, 360, F - 290, 4, '#CFE4DA');
      /* the bench */
      var bx4 = 1190; soft(g, bx4 + 48, F + 2, 70, 6, 0.25); fillRR(g, bx4, 380, 96, 10, 4, WOOD); fillRR(g, bx4, 350, 96, 8, 4, WOOD); fillRR(g, bx4 + 6, 390, 6, F - 390, 2, '#4A4F5E'); fillRR(g, bx4 + 84, 390, 6, F - 390, 2, '#4A4F5E');
    }
    /* the lamppost between the shop and next door */
    var lx = 1120; fillRR(g, lx - 4, -60, 8, F + 60, 3, '#3E4A59'); fillRR(g, lx - 12, F - 14, 24, 14, 4, '#3E4A59'); g.strokeStyle = '#3E4A59'; g.lineWidth = 4; g.beginPath(); g.moveTo(lx, -40); g.quadraticCurveTo(lx + 30, -60, lx + 44, -40); g.stroke();
    fillRR(g, lx + 34, -40, 20, 26, 6, '#3E4A59'); fillRR(g, lx + 37, -34, 14, 16, 4, '#FFF4C9');
  }
  function doughCounter(g) {
    var c = DC; soft(g, c.x + c.w / 2, 524, c.w * 0.6, 7, 0.25);
    fillRR(g, c.x, c.y + 10, c.w, 520 - c.y - 10, 6, WOOD); g.fillStyle = 'rgba(85,51,31,.18)'; g.fillRect(c.x + c.w - 14, c.y + 10, 14, 520 - c.y - 10);
    [0, 1].forEach(function (k) { fillRR(g, c.x + 12 + k * 80, c.y + 28, 66, 30, 4, '#B57C4B'); fillRR(g, c.x + 37 + k * 80, c.y + 40, 16, 5, 2.5, '#F6E3C2'); fillRR(g, c.x + 12 + k * 80, c.y + 66, 66, 30, 4, '#B57C4B'); fillRR(g, c.x + 37 + k * 80, c.y + 78, 16, 5, 2.5, '#F6E3C2'); });
    fillRR(g, c.x - 8, c.y, c.w + 16, 14, 5, '#F4EEE6'); g.strokeStyle = 'rgba(160,140,120,.25)'; g.lineWidth = 1; g.beginPath(); g.moveTo(c.x, c.y + 5); g.bezierCurveTo(c.x + 50, c.y + 2, c.x + 90, c.y + 9, c.x + c.w, c.y + 5); g.stroke();
    fillRR(g, c.x + 10, c.y - 14, 34, 14, 3, '#FFFFFF'); text(g, 'DRAFTS', c.x + 27, c.y - 4.6, 6, 800, STRAW_D, 'center');
    [[c.x + 132, 8], [c.x + 150, 6]].forEach(function (d) { fillE(g, d[0], c.y - d[1] + 2, d[1] + 4, d[1], '#F7E2C4'); fillE(g, d[0] - 2, c.y - d[1] - 1, 3, 2, 'rgba(255,255,255,.7)'); });
    g.fillStyle = 'rgba(255,255,255,.75)'; for (var fd = 0; fd < 14; fd++) fillE(g, c.x + 50 + hash(fd) * 70, c.y + 2 + hash(fd + 3) * 4, 1.4, 0.8, 'rgba(255,255,255,.85)');
    text(g, 'COPY DESK', c.x + c.w / 2, c.y + 112, 8, 800, '#FFF6EA', 'center');
  }
  function paintFront(g, ext) {
    doughCounter(g);
    /* the decorating bench: a marble top on cocoa legs, open below so the stool and legs show */
    var b = BENCH; soft(g, b.x + b.w / 2, F + 3, b.w * 0.6, 8, 0.25);
    fillRR(g, b.x + 8, b.y + 10, 8, F - b.y - 10, 3, COCOA_D); fillRR(g, b.x + b.w - 16, b.y + 10, 8, F - b.y - 10, 3, COCOA_D); fillRR(g, b.x + 8, 430, b.w - 16, 6, 3, COCOA);
    fillRR(g, b.x + 20, 438, 40, 30, 4, '#FFFFFF'); fillRR(g, b.x + 20, 438, 40, 6, 3, BUTTER); fillRR(g, b.x + 70, 444, 34, 24, 4, '#E4E8EE');
    fillRR(g, b.x - 6, b.y, b.w + 12, 14, 5, '#F7F3EE'); g.fillStyle = 'rgba(160,150,140,.18)'; g.fillRect(b.x + 30, b.y + 3, 40, 1.5); g.fillRect(b.x + 100, b.y + 7, 50, 1.5); fillRR(g, b.x - 6, b.y + 11, b.w + 12, 4, 2, '#E3DCD2');
    fillRR(g, b.x + 6, b.y + 18, b.w - 12, 18, 4, STRAW); text(g, 'DECORATING · graphics · video · copy', b.x + b.w / 2, b.y + 30.5, 6.8, 800, '#FFFFFF', 'center');
    /* the ring light and the phone on the bench's left end */
    fillRR(g, b.x + 22, b.y - 74, 4, 74, 2, '#5C6B7A'); fillRR(g, b.x + 12, b.y - 4, 24, 5, 2, '#5C6B7A');
    g.strokeStyle = '#FFFFFF'; g.lineWidth = 6; g.beginPath(); g.arc(b.x + 24, b.y - 92, 18, 0, 7); g.stroke(); g.strokeStyle = '#E3E8EF'; g.lineWidth = 1.5; g.beginPath(); g.arc(b.x + 24, b.y - 92, 21, 0, 7); g.stroke();
    fillRR(g, b.x + 17, b.y - 104, 14, 24, 3, '#2A3142');
    /* the turntable and the stamp pad, a stack of approved cards at the right end */
    fillRR(g, b.x + 74, b.y - 6, 52, 7, 3, '#C9D1DA'); fillRR(g, b.x + 96, b.y - 12, 8, 7, 2, '#B9C2CC');
    fillRR(g, b.x + 146, b.y - 6, 22, 6, 2, '#3A3F4F'); fillRR(g, b.x + 148, b.y - 5, 18, 3, 1, STRAW_D);
    for (var p = 0; p < 4; p++) fillRR(g, b.x + 162 + p * 1.5, b.y - 4 - p * 3, 30, 3.4, 1, p % 2 ? '#FFFFFF' : '#F4EFE8');
    /* the client's high stool */
    var sx = CLI.x; fillRR(g, sx - 30, 412, 60, 10, 5, COCOA); g.strokeStyle = COCOA_D; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.moveTo(sx - 22, 420); g.lineTo(sx - 30, F); g.moveTo(sx + 22, 420); g.lineTo(sx + 30, F); g.moveTo(sx - 26, 448); g.lineTo(sx + 26, 448); g.stroke();
    /* the chalk A-board on the pavement: the one-page monthly report */
    var a = AB; soft(g, a.x, F + 3, 50, 6, 0.25); g.strokeStyle = WOOD; g.lineWidth = 6; g.beginPath(); g.moveTo(a.x - 36, F); g.lineTo(a.x - 24, a.y); g.moveTo(a.x + 36, F); g.lineTo(a.x + 24, a.y); g.stroke();
    shadowed(g, 8, 3, 0.2, function () { fillRR(g, a.x - 40, a.y - 4, 80, 100, 6, WOOD); }); fillRR(g, a.x - 35, a.y + 1, 70, 90, 4, CHALK);
    text(g, 'THIS MONTH', a.x, a.y + 14, 8, 800, '#FFFFFF', 'center'); text(g, 'one-page report', a.x, a.y + 23, 5.6, 700, 'rgba(255,255,255,.7)', 'center');
    ['Reach', 'Engagement', 'Inquiries'].forEach(function (l, i) { text(g, l, a.x - 30, a.y + 37 + i * 15, 5.8, 700, 'rgba(255,255,255,.8)'); g.strokeStyle = 'rgba(255,255,255,.18)'; g.lineWidth = 1; rr(g, a.x - 30, a.y + 40 + i * 15, 60, 5, 2.5); g.stroke(); });
    /* the follower's coffee on the bench, the café table outside the door */
    if (ext.r > 1180) { fillRR(g, 1272, 372, 10, 10, 2, '#FFFFFF'); fillRR(g, 1272, 372, 10, 3, 1.5, COCOA); }
  }
  function bike(g, x, y, s) { /* a bicycle with a basket of baguettes */
    g.save(); g.translate(x, y); g.scale(s, s); soft(g, 0, 2, 70, 6, 0.25); g.strokeStyle = '#2A3142'; g.lineWidth = 4; [-42, 42].forEach(function (wx) { g.beginPath(); g.arc(wx, -26, 26, 0, 7); g.stroke(); });
    g.strokeStyle = STRAW; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.moveTo(-42, -26); g.lineTo(-8, -26); g.lineTo(18, -60); g.lineTo(-20, -60); g.lineTo(-42, -26); g.moveTo(-8, -26); g.lineTo(-20, -66); g.moveTo(18, -60); g.lineTo(42, -26); g.moveTo(18, -60); g.lineTo(24, -76); g.stroke();
    fillRR(g, -30, -72, 22, 6, 3, '#2A3142'); g.strokeStyle = '#2A3142'; g.lineWidth = 4; g.beginPath(); g.moveTo(14, -78); g.lineTo(34, -78); g.stroke();
    fillRR(g, 30, -92, 38, 22, 4, '#C98E5A'); g.strokeStyle = '#A8724A'; g.lineWidth = 1.5; for (var i = 0; i < 4; i++) { g.beginPath(); g.moveTo(32 + i * 10, -92); g.lineTo(32 + i * 10, -70); g.stroke(); }
    [[36, -0.5], [46, -0.3], [56, -0.15]].forEach(function (bg) { g.save(); g.translate(bg[0], -96); g.rotate(bg[1]); fillRR(g, -5, -26, 10, 34, 5, '#E2B07E'); g.strokeStyle = '#C98E5A'; g.lineWidth = 1.2; for (var c = 0; c < 3; c++) { g.beginPath(); g.moveTo(-3, -18 + c * 9); g.lineTo(3, -14 + c * 9); g.stroke(); } g.restore(); });
    g.restore();
  }
  function planter(g, x, y, w) { soft(g, x + w / 2, y + 2, w * 0.6, 6, 0.25); fillRR(g, x, y - 34, w, 34, 6, '#C98E5A'); fillRR(g, x - 3, y - 38, w + 6, 8, 4, '#A8724A');
    for (var i = 0; i < w / 12; i++) { g.fillStyle = '#5FB38E'; g.beginPath(); g.ellipse(x + 8 + i * 12, y - 44, 7, 12, (i % 2 ? 0.3 : -0.3), 0, 7); g.fill(); fillE(g, x + 8 + i * 12, y - 56 - (i % 3) * 4, 5, 5, [STRAW, BUTTER, '#FF9DB4', '#FFFFFF'][i % 4]); } }
  function paintFore(g, ext) {
    /* the near floor inside: a crate of eggs, a flour sack, a step stool */
    if (ext.l < 160) { var cx = 136; soft(g, cx + 40, 708, 52, 6, 0.25); fillRR(g, cx, 664, 84, 44, 5, '#C98E5A'); fillRR(g, cx, 664, 84, 8, 4, '#A8724A'); for (var e = 0; e < 5; e++) fillE(g, cx + 12 + e * 15, 660, 7, 9, e % 2 ? '#FFF6E6' : '#F7E2C4'); text(g, 'FRESH', cx + 42, 694, 9, 800, '#FFF6E6', 'center'); }
    sack(g, 470, 706, 'HOOKS', BLUE); sack(g, 528, 710, 'HASHTAGS', MINT_D);
    /* a round woven mat and the proofing rack of drafts (behind the title card; seen in View the scene) */
    g.save(); g.translate(-200, 606); g.scale(1, 0.24); fillE(g, 0, 0, 150, 150, '#F7D9C4'); g.strokeStyle = 'rgba(240,98,126,.45)'; g.lineWidth = 9; for (var mr = 40; mr <= 140; mr += 34) { g.beginPath(); g.arc(0, 0, mr, 0, 7); g.stroke(); } g.restore();
    var pr = PRF; soft(g, pr.x + 50, pr.y + 4, 66, 6, 0.25); g.fillStyle = '#B9C2CC'; g.fillRect(pr.x, pr.y - 190, 5, 186); g.fillRect(pr.x + 100, pr.y - 190, 5, 186); fillRR(g, pr.x - 4, pr.y - 196, 113, 8, 3, '#C9D1DA');
    for (var tr2 = 0; tr2 < 5; tr2++) { var ty2 = pr.y - 164 + tr2 * 34; fillRR(g, pr.x - 2, ty2, 109, 4, 2, '#C9D1DA'); for (var pd = 0; pd < 3; pd++) { var dx2 = pr.x + 18 + pd * 34; fillE(g, dx2, ty2 - 7, 13, 8, '#F7E2C4'); fillE(g, dx2 - 3, ty2 - 10, 4, 2, 'rgba(255,255,255,.7)'); } }
    [pr.x + 2, pr.x + 102].forEach(function (wx) { fillE(g, wx, pr.y, 5, 5, '#3A3A3A'); }); fillRR(g, pr.x + 14, pr.y - 216, 78, 16, 4, '#FFFFFF'); text(g, 'PROOFING', pr.x + 53, pr.y - 205, 7, 800, STRAW_D, 'center');
    if (ext.l < -500) {
      /* a rolling trolley of trays, crates of strawberries, the mop bucket */
      var tx = -900; soft(g, tx + 60, 744, 80, 7, 0.25); fillRR(g, tx, 600, 6, 140, 3, '#9AA6BC'); fillRR(g, tx + 116, 600, 6, 140, 3, '#9AA6BC');
      for (var tr = 0; tr < 4; tr++) { fillRR(g, tx - 4, 612 + tr * 30, 130, 5, 2, '#C9D1DA'); for (var pc = 0; pc < 3; pc++) postCard(g, tx + 24 + pc * 38, 612 + tr * 30, 26, 22, ['ig', 'li', 'fb'][(tr + pc) % 3], tr * 3 + pc + 50, 0); }
      fillE(g, tx + 6, 744, 7, 7, '#3A3A3A'); fillE(g, tx + 118, 744, 7, 7, '#3A3A3A');
      [[-800, 704], [-720, 712]].forEach(function (c, i) { soft(g, c[0] + 34, c[1] + 2, 44, 5, 0.25); fillRR(g, c[0], c[1] - 40, 68, 40, 5, '#C98E5A'); fillRR(g, c[0], c[1] - 40, 68, 7, 4, '#A8724A');
        for (var sb = 0; sb < 6; sb++) { fillE(g, c[0] + 8 + sb * 10.5, c[1] - 44 - (sb % 2) * 3, 6, 5.5, STRAW); fillE(g, c[0] + 8 + sb * 10.5, c[1] - 49 - (sb % 2) * 3, 2.5, 1.6, '#5FB38E'); } text(g, i ? 'STORIES' : 'SHORT VIDEO', c[0] + 34, c[1] - 14, 7, 800, '#FFF6EA', 'center'); });
      g.save(); g.translate(-82, -26); soft(g, -530, 742, 40, 5, 0.25); fillRR(g, -560, 690, 60, 50, 8, '#B4E1CB'); fillRR(g, -564, 686, 68, 8, 4, '#9FD3BB'); g.strokeStyle = '#8A6A4A'; g.lineWidth = 4; g.beginPath(); g.moveTo(-536, 690); g.lineTo(-500, 560); g.stroke(); fillRR(g, -520, 548, 44, 18, 6, '#FFD36E'); g.restore(); }
    /* the near pavement: a planter, bollards, the bike */
    planter(g, 940, 710, 96);
    [1060, 1140].forEach(function (bx) { if (bx > ext.r + 20) return; soft(g, bx, 712, 14, 3, 0.25); fillRR(g, bx - 8, 660, 16, 52, 6, '#3E4A59'); fillRR(g, bx - 10, 656, 20, 8, 4, BUTTER_D); });
    if (ext.r > 1180) bike(g, 1270, 730, 0.92);
  }

  /* ---------------- live ---------------- */
  var TAP = {}, BUB = [], FLY = [], SPR = [], HEARTS = [], PIG = [{ x: 712, ph: 0 }, { x: 744, ph: 2.1 }, { x: 808, ph: 4.4 }, { x: 1170, ph: 1.2 }], PIGFLY = -9, TIMERD = -9;
  function paintWindow(g, t, par, S) {
    var e = S.ext;
    for (var c = 0; c < 4; c++) { var sp = 4 + c * 1.6, span = e.r - e.l + 400, x = e.l - 200 + ((hash(c + 7) * span + t * sp) % span), y = -300 + c * 16 - (c % 2) * 24; K.cloud(g, x, y, 0.2 + hash(c + 1) * 0.1); }
    g.strokeStyle = 'rgba(40,60,90,.5)'; g.lineWidth = 1.5; g.lineCap = 'round';
    for (var b = 0; b < 3; b++) { var bsp = e.r - e.l + 300, bx = e.l - 100 + ((t * (14 + b * 4) + hash(b + 3) * bsp) % bsp), by = -270 + b * 14 + Math.sin(t * 0.9 + b) * 6, fl = Math.sin(t * 9 + b * 2) * 4;
      g.beginPath(); g.moveTo(bx - 6, by - fl); g.quadraticCurveTo(bx - 3, by - 3, bx, by); g.quadraticCurveTo(bx + 3, by - 3, bx + 6, by - fl); g.stroke(); }
  }
  /* the month: the planner chalks one post every 1.25 s, the board stays full, then the eraser sweeps it */
  function month(t) { var cyc = PLAN.length * 1.25 + 9, u = (t + 9) % cyc; return { n: Math.min(PLAN.length, Math.floor(u / 1.25) + 1), wipe: u > cyc - 1.6 ? (u - (cyc - 1.6)) / 1.6 : 0, u: u, cyc: cyc, chalkT: u % 1.25, writing: u < PLAN.length * 1.25 }; }
  /* the runner's lap: the timer rings, he takes the tray, carries it to a window, sets the post, comes back */
  var RCYC = 17;
  function runLap(t) {
    var tt = t + 6, n = Math.floor(tt / RCYC), u = (tt - n * RCYC) / RCYC, wi = n % 3, tx = WIN[wi].x + WW / 2 - 6, x, phase;
    var home = 640;
    if (u < 0.1) { x = home; phase = 'oven'; } else if (u < 0.16) { x = home; phase = 'take'; }
    else if (u < 0.44) { x = lerp(home, tx, smooth((u - 0.16) / 0.28)); phase = 'go'; } else if (u < 0.56) { x = tx; phase = 'set'; }
    else if (u < 0.86) { x = lerp(tx, home, smooth((u - 0.56) / 0.3)); phase = 'back'; } else { x = home; phase = 'wait'; }
    return { u: u, n: n, wi: wi, x: x, phase: phase, deck: n % 2, t0: tt - u * RCYC - 6 };
  }
  function paintLive(g, t, now, S) {
    var e = S.ext, M = month(t), R = runLap(t); S.M = M; S.R = R;
    /* chimney steam and the croissant weather vane on the roof */
    var cx = OV.x + OV.w / 2; fillRR(g, cx - 16, ROOF - 86, 32, 60, 3, '#C66B4E'); fillRR(g, cx - 20, ROOF - 92, 40, 10, 3, '#B35A3E');
    for (var p = 0; p < 6; p++) { var u = ((t * 0.28 + p / 6) % 1), x = cx + Math.sin(u * 5 + p) * 10 + u * 40, y = ROOF - 96 - u * 150, r = 9 + u * 20; fillE(g, x, y, r, r * 0.85, 'rgba(255,255,255,' + (0.7 * (1 - u)).toFixed(2) + ')'); }
    var vx = CUT1 + 380, va = Math.sin(t * 0.6) * 0.9; g.strokeStyle = '#3E4A59'; g.lineWidth = 2; g.beginPath(); g.moveTo(vx, ROOF - 40); g.lineTo(vx, ROOF - 92); g.stroke();
    g.save(); g.translate(vx, ROOF - 92); g.scale(Math.cos(va), 1); g.fillStyle = BUTTER_D; g.beginPath(); g.moveTo(-18, 2); g.quadraticCurveTo(0, -16, 18, 2); g.quadraticCurveTo(0, -6, -18, 2); g.fill(); g.strokeStyle = '#B8862A'; g.lineWidth = 1.2; for (var cr = -1; cr <= 1; cr++) { g.beginPath(); g.moveTo(cr * 7, -8); g.lineTo(cr * 6 + 2, -1); g.stroke(); } g.restore();
    /* bunting under the beam */
    for (var bx = Math.floor(e.l / 26) * 26; bx < CUT0 - 10; bx += 26) { var sw = Math.sin(t * 2.2 + bx * 0.05) * 2, col = ['#0A66C2', STRAW, '#1877F2', BUTTER, '#DD2A7B', '#FFFFFF'][((bx / 26 | 0) % 6 + 6) % 6];
      g.fillStyle = col; g.beginPath(); g.moveTo(bx, ROOF + 22); g.lineTo(bx + 18, ROOF + 22); g.lineTo(bx + 9 + sw, ROOF + 40); g.closePath(); g.fill(); }
    g.strokeStyle = 'rgba(122,75,51,.6)'; g.lineWidth = 1; g.beginPath(); g.moveTo(e.l, ROOF + 22); g.lineTo(CUT0, ROOF + 22); g.stroke();
    /* the rolling library ladder, wherever the planner has pushed it */
    var lx0 = PLN.x; g.strokeStyle = WOOD; g.lineWidth = 7; g.lineCap = 'round'; g.beginPath(); g.moveTo(lx0 - 24, BD.y - 10); g.lineTo(lx0 - 46, F - 6); g.moveTo(lx0 + 24, BD.y - 10); g.lineTo(lx0 + 46, F - 6); g.stroke();
    g.strokeStyle = '#B07A4A'; g.lineWidth = 5; g.beginPath(); for (var rg = 0; rg < 13; rg++) { var yy = F - 26 - rg * 46; if (yy < BD.y) break; var f = (yy - BD.y) / (F - BD.y), hw = 24 + f * 22; g.moveTo(lx0 - hw, yy); g.lineTo(lx0 + hw, yy); } g.stroke();
    fillE(g, lx0 - 46, F - 3, 6, 6, '#3A3A3A'); fillE(g, lx0 + 46, F - 3, 6, 6, '#3A3A3A'); fillRR(g, lx0 - 30, BD.y - 18, 60, 8, 3, '#8A6A4A');
    /* the far kitchen: clocks on the team's three cities, the mixer's hook */
    if (e.l < -560) { CO.clock(g, -902, 80, 16, 8, STRAW); CO.clock(g, -838, 80, 16, 8, MINT_D); CO.clock(g, -774, 80, 16, 7, BUTTER_D); }
    if (e.l < -200) { var mx = -190, ma = t * 4; g.strokeStyle = '#9AA6BC'; g.lineWidth = 3; g.beginPath(); g.moveTo(mx, F - 188); g.lineTo(mx + Math.sin(ma) * 10, F - 150); g.stroke(); fillE(g, mx + Math.sin(ma) * 6, F - 148, 22, 8, '#F7E2C4'); }
    /* the bake plan: chalked chips, the chalk dust, the eraser sweep */
    var wipeX = M.wipe > 0 ? BD.x + M.wipe * (BD.w + 30) : -1e4;
    for (var i = 0; i < M.n; i++) { var P2 = PLAN[i], ce = cell(P2[0], P2[1]); if (ce.x + 40 < wipeX) continue;
      var a = i === M.n - 1 && M.writing ? clamp(M.chalkT / 0.6, 0, 1) : 1, C = CH[P2[2]];
      g.save(); g.globalAlpha = a; fillRR(g, ce.x + 3, ce.y + 3, 34, 28, 4, C.c); g.strokeStyle = 'rgba(255,255,255,.85)'; g.lineWidth = 1.2; rr(g, ce.x + 3, ce.y + 3, 34, 28, 4); g.stroke();
      text(g, C.l, ce.x + 13, ce.y + 16, 7.4, 800, '#FFFFFF', 'center'); fillE(g, ce.x + 31, ce.y + 9, 3, 3, PIL[P2[3]][1]); g.fillStyle = 'rgba(255,255,255,.6)'; g.fillRect(ce.x + 7, ce.y + 21, 22, 1.6); g.fillRect(ce.x + 7, ce.y + 25, 15, 1.6); g.restore(); }
    if (S.hot === 'plan') { var hi = Math.floor(t * 1.4) % 4; PLAN.forEach(function (P3) { if (P3[3] !== hi) return; var c2 = cell(P3[0], P3[1]); g.strokeStyle = PIL[hi][1]; g.lineWidth = 2; rr(g, c2.x + 1, c2.y + 1, 38, 32, 5); g.stroke(); }); }
    if (TAP.pln && t - TAP.pln < 3) { var su = (t - TAP.pln - 0.9) / 2; if (su > 0) { g.save(); g.globalAlpha = clamp(1.2 - su * 0.6, 0, 1); star(g, BD.x + 150, BD.y + 18, 9 + Math.sin(su * 6) * 1.5, '#FFD36E'); g.restore(); } }
    if (M.wipe > 0) { var ex = wipeX - 20; fillRR(g, ex - 14, BD.y + 60 + Math.sin(M.wipe * 12) * 40, 28, 14, 3, '#8A6A4A'); fillRR(g, ex - 14, BD.y + 70 + Math.sin(M.wipe * 12) * 40, 28, 4, 2, '#E9E4DA');
      g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(BD.x, BD.y + 26, Math.max(0, ex - BD.x), BD.h - 32); }
    /* the ovens: a glowing window, the tray rising inside, the timer's hand */
    DECK.forEach(function (d, k) {
      var mine = R.deck === k, prog = mine ? (R.phase === 'oven' ? 0.96 + R.u * 0.3 : R.phase === 'wait' ? (R.u - 0.86) / 0.14 * 0.4 : R.u < 0.16 ? 1 : 0.4 + (R.u - 0.16) * 0.6) : 0.25 + ((t * 0.04 + k * 0.4) % 0.7);
      var glow = 0.55 + 0.15 * Math.sin(t * 3 + k), gx = OV.x + 32, gy = d.y + 6;
      var og = g.createLinearGradient(0, gy, 0, gy + 62); og.addColorStop(0, 'rgba(255,170,80,' + (glow * 0.6).toFixed(2) + ')'); og.addColorStop(1, 'rgba(255,120,60,' + glow.toFixed(2) + ')'); fillRR(g, gx, gy, 84, 62, 6, og);
      var empty = mine && (R.phase === 'take' || R.phase === 'go' || R.phase === 'set' || R.phase === 'back');
      fillRR(g, gx + 8, gy + 46, 68, 4, 2, '#5C4A3A');
      if (!empty) for (var q = 0; q < 3; q++) { var rise = clamp(prog, 0, 1) * 8; g.save(); g.globalAlpha = 0.9; postCard(g, gx + 20 + q * 22, gy + 46 - rise * 0.2, 16, 14 + rise, d.ch, q + k * 3, 0); g.restore(); }
      g.fillStyle = 'rgba(255,255,255,.18)'; g.beginPath(); g.moveTo(gx + 8, gy + 62); g.lineTo(gx + 30, gy); g.lineTo(gx + 40, gy); g.lineTo(gx + 18, gy + 62); g.closePath(); g.fill();
      var tc = [OV.x + 14, d.y + 30], ta = -Math.PI / 2 + clamp(prog, 0, 1) * Math.PI * 2; g.fillStyle = 'rgba(240,98,126,.25)'; g.beginPath(); g.moveTo(tc[0], tc[1]); g.arc(tc[0], tc[1], 10, -Math.PI / 2, ta); g.closePath(); g.fill();
      g.strokeStyle = STRAW_D; g.lineWidth = 2; g.beginPath(); g.moveTo(tc[0], tc[1]); g.lineTo(tc[0] + Math.cos(ta) * 9, tc[1] + Math.sin(ta) * 9); g.stroke(); fillE(g, tc[0], tc[1], 2, 2, INK);
      var ding = mine && R.u > 0.08 && R.u < 0.16; if (ding || (S.hot === 'schedule' && (t % 2) < 1 && k === Math.floor(t / 2) % 2)) { g.strokeStyle = 'rgba(240,98,126,.7)'; g.lineWidth = 1.6; for (var rg = 0; rg < 2; rg++) { g.beginPath(); g.arc(tc[0], tc[1], 15 + rg * 6 + (t * 20 % 6), -1.2, 1.2); g.stroke(); } }
      if (S.hot === 'schedule') { fillRR(g, OV.x + 30, d.y + 86, 88, 10, 3, (t * 1.5 + k) % 2 < 1 ? BUTTER : '#E2C27A'); text(g, d.slot, OV.x + 74, d.y + 93.6, 5.6, 800, COCOA_D, 'center'); }
    });
    /* the cupcake timer (the toy) on the oven shelf */
    var tb = t - TIMERD, shk = tb < 1.6 ? Math.sin(tb * 40) * 0.15 * (1.6 - tb) : 0;
    g.save(); g.translate(TIMER.x, TIMER.y); g.rotate(shk); fillRR(g, -12, -2, 24, 14, 4, STRAW); g.fillStyle = '#FFF6EA'; g.beginPath(); g.arc(0, -2, 13, Math.PI, 0); g.fill(); fillE(g, 0, -15, 3.5, 3.5, STRAW_D);
    g.strokeStyle = STRAW_D; g.lineWidth = 1.4; var ha = t * 0.7; g.beginPath(); g.moveTo(0, -4); g.lineTo(Math.cos(ha) * 7, -4 + Math.sin(ha) * 4); g.stroke(); g.restore();
    if (tb < 1.6) { g.strokeStyle = 'rgba(240,98,126,' + (1 - tb / 1.6).toFixed(2) + ')'; g.lineWidth = 2; for (var r2 = 0; r2 < 3; r2++) { g.beginPath(); g.arc(TIMER.x, TIMER.y - 4, 18 + tb * 26 + r2 * 8, -2.6, -0.5); g.stroke(); } }
    /* the windows: the newest post in each (NEW when the runner sets it), likes and hearts */
    WIN.forEach(function (w, i) { var cx2 = w.x + WW / 2, nn = R.n - (((R.n - i) % 3) + 3) % 3; if (nn === R.n && R.u < 0.52) nn -= 3; var since = nn === R.n ? (R.u - 0.52) * RCYC : 99;
      fillE(g, cx2, 69, 26, 4, 'rgba(255,255,255,.9)');
      var pop = since < 0.6 ? 1 + Math.sin(since / 0.6 * Math.PI) * 0.18 : 1; g.save(); g.translate(cx2, 66); g.scale(pop, pop); postCard(g, 0, 0, 34, 40, w.ch, nn * 3 + i + 30, 0); g.restore();
      if (since < 4) { g.save(); g.translate(cx2 + 18, 30); g.rotate(0.3); fillRR(g, -13, -6, 26, 11, 3, STRAW); text(g, 'NEW', 0, 2.6, 6.4, 800, '#FFFFFF', 'center'); g.restore(); if (since < 0.25 && !w.fx) { w.fx = true; CR.burst('spark', cx2, 40, t); } } else w.fx = false;
      if (S.hot === 'windows') { var on = Math.floor(t * 1.2) % 3 === i; if (on) { g.strokeStyle = 'rgba(255,211,110,.95)'; g.lineWidth = 3; rr(g, w.x - 3, WY0 - 3, WW + 6, WY1 - WY0 + 6, 6); g.stroke(); } }
    });
    /* the monthly report on the A-board: three bars grow as the month's posts go out */
    var k2 = M.n / PLAN.length, aw = [0.9, 0.62, 0.34];
    aw.forEach(function (v, i) { var bw = 58 * v * clamp(k2 * (1 + i * 0.1), 0.04, 1); if (S.hot === 'report') bw = 58 * v * clamp(((t * 0.4) % 1.2), 0.04, 1); fillRR(g, AB.x - 29, AB.y + 41 + i * 15, Math.max(3, bw), 3, 1.5, ['#7FD6FF', '#FFD36E', '#9BE7B4'][i]); });
    text(g, 'next month →', AB.x, AB.y + 86, 5.6, 700, M.n >= PLAN.length ? '#FFD36E' : 'rgba(255,255,255,.45)', 'center');
    /* the SALES CONTACT postbox flag */
    var lt = t - (S.leadT || -9), fa = lt < 3 ? -1.4 : 0; g.save(); g.translate(BOX.x + 44, BOX.y + 16); g.rotate(fa * clamp(lt < 3 ? Math.min(1, lt * 4) : 1, 0, 1)); fillRR(g, -1.5, -18, 3, 20, 1.5, '#3E4A59'); fillRR(g, 1, -18, 12, 8, 2, BUTTER); g.restore();
    /* the far-side passers-by and the follower on the bench */
    fitCrew(S); CO.crew(CREW, g, t, S, false);
    if (e.r > 1180) { var sp = SIT; sp.hands = [[-30, -230 + Math.sin(t * 2) * 2], [30, -236]]; sp.look = -0.25 + Math.sin(t * 0.4) * 0.1; sp.mood = (t % 5) < 0.8 ? 'happy' : 'calm'; if (TAP.sit && t - TAP.sit < 1.6) { sp.mood = 'happy'; sp.hands = [[-90, -380], [30, -236]]; }
      K.person(g, sp, t); var hp = handAt(sp, 1); fillRR(g, hp[0] - 8, hp[1] - 14, 16, 24, 3, '#2A3142'); fillRR(g, hp[0] - 6, hp[1] - 12, 12, 18, 2, (t % 5) < 0.8 ? '#FFD3DE' : '#DCEBFA'); if ((t % 5) < 0.8) heart(g, hp[0], hp[1] - 4, 3.4, STRAW); }
  }
  function paintFrontLive(g, t, S) {
    var R = S.R || runLap(t), M = S.M || month(t);
    /* the cake on the turntable: a post being iced (dots appear as she pipes) */
    var bx = BENCH.x + 100, by = BENCH.y - 7, sw = 1 + Math.sin(t * 1.4) * 0.04;
    g.save(); g.translate(bx, by); g.scale(sw, 1); fillRR(g, -26, -38, 52, 38, 5, '#FFF6EA'); fillRR(g, -26, -38, 52, 8, 4, '#FFD3DE');
    fillRR(g, -22, -28, 30, 18, 3, '#BFE3FF'); g.fillStyle = '#9BE7B4'; g.beginPath(); g.moveTo(-22, -10); g.lineTo(-12, -20); g.lineTo(-4, -14); g.lineTo(8, -22); g.lineTo(8, -10); g.closePath(); g.fill(); fillE(g, 2, -24, 3, 3, '#FFFFFF');
    g.fillStyle = '#F0627E'; g.fillRect(12, -26, 10, 2.4); g.fillRect(12, -21, 8, 2.4); g.fillRect(12, -16, 10, 2.4);
    var nd = Math.floor((t * 3) % 9); for (var d = 0; d < nd; d++) fillE(g, -22 + d * 5.5, -40, 2.2, 2.2, ['#F0627E', '#FFD36E', '#5FB38E'][d % 3]);
    if (TAP.des && t - TAP.des < 3 && t - TAP.des > 1.2) { g.strokeStyle = '#5FB38E'; g.lineWidth = 3; g.beginPath(); g.moveTo(-8, -54); g.lineTo(-2, -48); g.lineTo(10, -62); g.stroke(); }
    g.restore();
    /* the phone in the ring light: REC while she films */
    var rec = DES.film; fillRR(g, BENCH.x + 19, BENCH.y - 102, 10, 20, 2, rec ? '#3A4A6A' : '#4A5468'); if (rec && (t % 0.8) < 0.5) fillE(g, BENCH.x + 24, BENCH.y - 97, 2.2, 2.2, '#FF5A5A');
    if (rec) { g.strokeStyle = 'rgba(255,250,220,.6)'; g.lineWidth = 3; g.beginPath(); g.arc(BENCH.x + 24, BENCH.y - 92, 18, 0, 7); g.stroke(); }
    /* held props */
    props(g, t, S, R, M);
    /* the runner: in front of the shop, carrying the tray; then the passers-by, nearer still */
    runner(g, t, S, R);
    CO.crew(CREW, g, t, S, true);
    /* the copy desk: the dough under the copywriter's hands, flour puffs, the tossed draft on a tap */
    var ka = handAt(KN, 0), kb = handAt(KN, 1);
    if (KN.toss != null) { var tu = KN.toss, tx3 = (ka[0] + kb[0]) / 2, ty3 = Math.min(ka[1], kb[1]) - 12 - Math.sin(Math.min(1, tu) * Math.PI) * 90; g.save(); g.translate(tx3, ty3); g.rotate(tu * 9); g.scale(1, 0.55 + 0.45 * Math.abs(Math.cos(tu * 9)));
      if (tu < 0.8) fillE(g, 0, 0, 22, 9, '#F7E2C4'); else postCard(g, 0, 14, 30, 30, 'ig', 7, 0); g.restore(); }
    else { var dw = KN.knead || 0; fillE(g, (ka[0] + kb[0]) / 2, DC.y - 4, 22 + dw * 6, 7 - dw * 2, '#F7E2C4'); fillE(g, (ka[0] + kb[0]) / 2 - 6, DC.y - 7, 6, 2, 'rgba(255,255,255,.7)'); }
    if (KN.flour) { for (var fp = 0; fp < 8; fp++) { var fu2 = ((t * 1.5 + fp / 8) % 1); fillE(g, kb[0] + (hash(fp) - 0.5) * 30 * fu2, kb[1] + 10 + fu2 * 30, 1.6, 1.6, 'rgba(255,255,255,' + (0.9 * (1 - fu2)).toFixed(2) + ')'); } }
    if (KN.card) { g.save(); g.translate(kb[0], kb[1] - 6); g.rotate(-0.2); fillRR(g, -14, -10, 28, 18, 2, '#FFFFFF'); fillRR(g, -14, -10, 28, 5, 2, STRAW); text(g, 'DRAFT', 0, 5, 5.6, 800, COCOA, 'center'); g.restore(); }
    /* bubbles, flying leads, sprinkles, hearts */
    BUB = BUB.filter(function (b) { return t - b.t0 < b.life; }); BUB.forEach(function (b) { var u = (t - b.t0) / b.life; if (u < 0) return; var x = lerp(b.x, b.tx, smooth(u)), y = lerp(b.y, b.ty, smooth(u)) - Math.sin(u * Math.PI) * 30;
      g.save(); g.globalAlpha = u > 0.8 ? (1 - u) / 0.2 : 1; fillRR(g, x - 14, y - 9, 28, 18, 8, b.col); g.fillStyle = b.col; g.beginPath(); g.moveTo(x - 6, y + 7); g.lineTo(x - 9, y + 13); g.lineTo(x, y + 8); g.fill();
      if (b.kind === 'comment') [-6, 0, 6].forEach(function (dx) { fillE(g, x + dx, y, 1.8, 1.8, '#FFFFFF'); }); else if (b.kind === 'reply') { g.strokeStyle = '#FFFFFF'; g.lineWidth = 2; g.beginPath(); g.moveTo(x - 5, y); g.lineTo(x - 1, y + 4); g.lineTo(x + 6, y - 4); g.stroke(); }
      else if (b.kind === 'emoji') { heart(g, x, y + 1, 4.2, '#FFFFFF'); } g.restore(); });
    FLY = FLY.filter(function (f) { return t - f.t0 < 1.1; }); FLY.forEach(function (f) { var u = (t - f.t0) / 1.1; if (u < 0) return; var x = lerp(f.x, BOX.x + 22, smooth(u)), y = lerp(f.y, BOX.y + 12, smooth(u)) - Math.sin(u * Math.PI) * 40;
      g.save(); g.translate(x, y); g.rotate(u * 3); fillRR(g, -9, -6, 18, 12, 2, '#FFFFFF'); g.fillStyle = '#D2463D'; g.fillRect(-7, -4, 14, 3); g.fillStyle = '#C9D3E3'; g.fillRect(-7, 1, 10, 2); g.restore();
      if (u > 0.95 && !f.done) { f.done = true; S.leadT = t; } });
    SPR = SPR.filter(function (s) { return t - s.t0 < 1.6; }); SPR.forEach(function (s) { var u = t - s.t0; if (u < 0) return; g.save(); g.translate(s.x + s.vx * u, s.y + s.vy * u + 160 * u * u); g.rotate(u * 6 + s.r); fillRR(g, -3, -1, 6, 2.2, 1, s.c); g.restore(); });
    HEARTS = HEARTS.filter(function (h) { return t - h.t0 < 1.6; }); HEARTS.forEach(function (h) { var u = (t - h.t0) / 1.6; if (u < 0) return; g.save(); g.globalAlpha = 1 - u; heart(g, h.x + Math.sin(u * 8 + h.p) * 6, h.y - u * 70, 5 + u * 2, h.c || STRAW); g.restore(); });
    /* events: likes on the windows, comments to the community manager, replies, leads */
    var ev = Math.floor(t / 1.2); if (ev !== S.evN) { S.evN = ev;
      if (ev % 2) { var wr = WIN[(ev >> 1) % 3]; HEARTS.push({ x: wr.x + WW / 2 + (Math.random() - 0.5) * 40, y: 50, t0: t, p: Math.random() * 6, c: ev % 4 === 1 ? '#FF9DB4' : STRAW }); }
      CREW.slice(0, 2).forEach(function (w) { var P = w.P, st = P._w; if (!st || st.x !== st.tx) return; WIN.forEach(function (wn) { if (Math.abs(P.x - (wn.x + WW / 2)) < 60) HEARTS.push({ x: wn.x + WW / 2 + (Math.random() - 0.5) * 30, y: 40, t0: t, p: Math.random() * 6 }); }); });
      if (ev % 5 === 0) { var src = CREW[ev % 2].P, near = src._w && src.x > 650; BUB.push({ kind: 'comment', x: near ? src.x : WIN[ev % 3].x + WW / 2, y: near ? src.y - 270 : 90, tx: CMG.x - 18, ty: CMG.y - 260, t0: t, life: 1.6, col: '#9AA6BC' });
        BUB.push({ kind: 'reply', x: CMG.x + 10, y: CMG.y - 250, tx: CMG.x + 26, ty: CMG.y - 330, t0: t + 1.9, life: 1.4, col: '#14A38B' }); S.cmReply = t + 1.7; }
      if (ev % 15 === 7) { S.cmLead = t; }
    }
  }
  function runner(g, t, S, R) {
    var P = RUN, tapA = TAP.run && t - TAP.run < 1.8 ? (t - TAP.run) / 1.8 : -1, walking = R.phase === 'go' || R.phase === 'back', dir = R.phase === 'back' ? -1 : 1;
    P.x = R.x; P.y = 494; P.feet = true; P.sx = 1; P.tilt = 0; P.talk = false;
    var step = t * 9, sw = walking ? Math.sin(step) : 0; P.hop = walking ? Math.abs(Math.sin(step)) * 6 : 0;
    var carry = R.phase === 'take' || R.phase === 'go' || (R.phase === 'set' && R.u < 0.52);
    P.look = walking ? dir * 0.8 : R.phase === 'oven' || R.phase === 'take' ? -0.9 : R.phase === 'set' ? 0.2 : -0.3; P.mood = carry ? 'happy' : 'calm';
    if (R.phase === 'oven') P.hands = [[-150, -250], [70 + sw * 30, -150]];
    else if (R.phase === 'set') { var su = (R.u - 0.44) / 0.12; P.hands = [[-70, -150], [60, -330 - Math.sin(su * Math.PI) * 60]]; P.look = 0.1; }
    else if (carry) P.hands = [[-70 - sw * 30, -150 + Math.abs(sw) * 12], [80, -300]];
    else P.hands = [[-70 - sw * 34, -150 + Math.abs(sw) * 12], [70 + sw * 34, -150 + Math.abs(sw) * 12]];
    if (tapA >= 0) { P.sx = Math.cos(tapA * Math.PI * 2); P.hop = Math.sin(tapA * Math.PI) * 30; P.mood = 'happy'; P.talk = true; P.hands = [[-110, -330], [60, -400]]; carry = true; }
    K.person(g, P, t);
    if (carry) { var hd = handAt(P, 1); g.save(); g.translate(hd[0], hd[1] - 4); if (tapA >= 0) g.rotate(Math.sin(tapA * Math.PI * 4) * 0.2); fillRR(g, -26, -3, 52, 5, 2, '#B9C2CC');
      for (var q = 0; q < 3; q++) postCard(g, -16 + q * 16, -3, 13, 15, WIN[R.wi].ch, R.n * 3 + q, 0); g.restore();
      if (R.phase === 'take' || R.phase === 'go') for (var s = 0; s < 2; s++) { var u = (t * 0.9 + s * 0.5) % 1; g.strokeStyle = 'rgba(255,255,255,' + (0.7 * (1 - u)).toFixed(2) + ')'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(hd[0] - 6 + s * 12, hd[1] - 22 - u * 24); g.quadraticCurveTo(hd[0] - 2 + s * 12, hd[1] - 28 - u * 24, hd[0] - 6 + s * 12, hd[1] - 34 - u * 24); g.stroke(); } }
    if (R.phase === 'oven') { var oh = handAt(P, 0); fillRR(g, oh[0] - 8, oh[1] - 8, 16, 14, 5, STRAW); }
  }
  function props(g, t, S, R, M) {
    /* the planner's chalk (or the chalk flip on a tap) */
    var hp = handAt(PLN, 1);
    if (TAP.pln && t - TAP.pln < 1.1) { var u = (t - TAP.pln) / 1.1, cx = hp[0] + 6, cy = hp[1] - 70 * Math.sin(u * Math.PI); g.save(); g.translate(cx, cy); g.rotate(u * 12); fillRR(g, -6, -2, 12, 4, 2, '#FFFFFF'); g.restore(); }
    else { fillRR(g, hp[0] - 2, hp[1] - 8, 4, 10, 2, '#FFFFFF'); if (M.writing && M.chalkT < 0.6) { g.fillStyle = 'rgba(255,255,255,.5)'; for (var dd = 0; dd < 3; dd++) fillE(g, hp[0] - 4 + dd * 4, hp[1] + 6 + ((t * 30 + dd * 7) % 14), 1.2, 1.2, 'rgba(255,255,255,.6)'); } }
    /* the designer's piping bag (or the sprinkle shaker on a tap) */
    var hd = handAt(DES, 1);
    if (TAP.des && t - TAP.des < 1.4) { var sh = Math.sin(t * 30) * 4; fillRR(g, hd[0] - 6, hd[1] - 22 + sh, 12, 22, 4, '#FFFFFF'); fillRR(g, hd[0] - 7, hd[1] - 26 + sh, 14, 6, 3, STRAW); }
    else { g.save(); g.translate(hd[0], hd[1]); g.rotate(0.5); g.fillStyle = '#FFFFFF'; g.beginPath(); g.moveTo(-9, -16); g.lineTo(9, -16); g.lineTo(2, 10); g.lineTo(-2, 10); g.closePath(); g.fill(); g.fillStyle = '#FFD3DE'; g.beginPath(); g.moveTo(-7, -4); g.lineTo(7, -4); g.lineTo(2, 10); g.lineTo(-2, 10); g.closePath(); g.fill(); fillRR(g, -1.5, 9, 3, 4, 1, '#B9C2CC'); g.restore(); }
    /* the client: a sample bite, the stamp, a change note */
    var cs = CLI.stage, hc = handAt(CLI, cs === 'stamp' || cs === 'note' ? 0 : 1);
    if (cs === 'taste') { fillRR(g, hc[0] - 7, hc[1] - 12, 14, 12, 2, '#FFF6EA'); fillRR(g, hc[0] - 7, hc[1] - 12, 14, 3, 1.5, '#FFD3DE'); }
    else if (cs === 'stamp' || cs === 'big') { var big = cs === 'big'; fillRR(g, hc[0] - 6, hc[1] - 18, 12, 14, 3, COCOA); fillRR(g, hc[0] - 9, hc[1] - 5, 18, 7, 2, '#3A3F4F'); fillE(g, hc[0], hc[1] - 20, 6, 4, COCOA_D);
      if (CLI.thump != null && t - CLI.thump < 1.6) { var tu = (t - CLI.thump) / 1.6, sx = big ? CLI.x - 20 : BENCH.x + 178, sy = big ? CLI.y - 330 : BENCH.y - 18;
        g.save(); g.globalAlpha = clamp(1.5 - tu * 1.5, 0, 1); g.translate(sx, sy); g.rotate(-0.18); var sc = big ? 1.5 : 1; g.scale(sc, sc); g.strokeStyle = '#1E9E6A'; g.lineWidth = 2; rr(g, -26, -8, 52, 15, 3); g.stroke(); text(g, 'APPROVED', 0, 3.4, 8, 800, '#1E9E6A', 'center'); g.restore(); } }
    else if (cs === 'note') { fillRR(g, hc[0] - 9, hc[1] - 18, 18, 16, 2, BUTTER); g.fillStyle = COCOA; g.fillRect(hc[0] - 6, hc[1] - 13, 12, 1.6); g.fillRect(hc[0] - 6, hc[1] - 9, 8, 1.6); }
    /* the community manager: the lead card in her hand on its way to the postbox */
    if (S.cmLead && t - S.cmLead < 0.9) { var hm = handAt(CMG, 1); fillRR(g, hm[0] - 8, hm[1] - 14, 16, 11, 2, '#FFFFFF'); g.fillStyle = '#D2463D'; g.fillRect(hm[0] - 6, hm[1] - 12, 12, 2.6); }
    if (S.cmLead && t - S.cmLead >= 0.9 && !S.cmFlown) { S.cmFlown = true; var hm2 = handAt(CMG, 1); FLY.push({ x: hm2[0], y: hm2[1] - 10, t0: t }); }
    if (S.cmLead && t - S.cmLead > 2) S.cmFlown = false;
  }

  /* ---------------- the cast: an idle loop and a tap choreography each ---------------- */
  function tapped(id, st, t) { if (st.wave && st.wave !== st._my) { st._my = st.wave; TAP[id] = t; return true; } return false; }
  function lookAtNexi(P, st, t, S, base) { P.look = lerp(P.look, t < st.until ? clamp((S.nexi.x - P.x) / 160, -1, 1) : base, 0.08); }
  var castPLN = { id: 'pln', behind: true, keys: ['plan'], P: PLN, act: function (P, t, S) {
    var st = S.cast.pln, M = S.M || month(t); if (tapped('pln', st, t)) CR.burst('star', P.x + 30, P.y - 260, t);
    P.tilt = 0; P.hop = 0; P.sx = 1;
    if (TAP.pln && t - TAP.pln < 3) { var u = (t - TAP.pln) / 3; P.talk = true; P.mood = 'happy';
      if (u < 0.37) { P.hands = [[-70, -170], [70, -260 - Math.sin(u / 0.37 * Math.PI) * 80]]; P.look = 0.2; } else { P.hands = [[-70, -170], [150, -340 + Math.sin(t * 12) * 6]]; P.look = 0.9; P.tilt = 0.05; } return; }
    var M2 = M; P.talk = t < st.until || S.hot === 'plan';
    var tgt = M2.writing ? clamp(cell(PLAN[Math.max(0, M2.n - 1)][0], PLAN[Math.max(0, M2.n - 1)][1]).x - 30, 180, 222) : 186; P.x = lerp(P.x, tgt, K.ease(0.03));
    if (M2.writing) { var ce = cell(PLAN[Math.max(0, M2.n - 1)][0], PLAN[Math.max(0, M2.n - 1)][1]), tgx = (ce.x + 20 - P.x) / P.s, tgy = (ce.y + 18 - P.y) / P.s;
      var wr = M2.chalkT < 0.6 ? Math.sin(t * 30) * 8 : 0; P.hands = [[-70, -170], [clamp(tgx, 60, 220) + wr, clamp(tgy, -440, -200) + Math.cos(t * 30) * (wr ? 4 : 0)]]; P.mood = 'calm'; P.look = 0.8; P.tilt = 0.04; }
    else if (M2.wipe > 0) { P.hands = [[-70, -170], [180, -360 + Math.sin(t * 12) * 30]]; P.look = 0.9; P.mood = 'happy'; }
    else { P.hands = [[-50, -260], [40, -330]]; P.mood = 'happy'; P.tilt = -0.06; P.look = 0.7; }
    lookAtNexi(P, st, t, S, P.look);
  } };
  var castDES = { id: 'des', behind: true, keys: ['produce'], P: DES, act: function (P, t, S) {
    var st = S.cast.des; if (tapped('des', st, t)) { for (var i = 0; i < 26; i++) SPR.push({ x: BENCH.x + 100 + (Math.random() - 0.5) * 20, y: BENCH.y - 120, vx: (Math.random() - 0.5) * 90, vy: -40 - Math.random() * 60, t0: t + Math.random() * 0.8, r: Math.random() * 6, c: [STRAW, BUTTER, '#5FB38E', '#7FD6FF', '#B7A3E8'][i % 5] }); }
    P.tilt = 0; P.hop = 0; P.film = false; P.sx = 1;
    if (TAP.des && t - TAP.des < 3) { var u = (t - TAP.des) / 3; P.talk = true; P.mood = 'happy';
      if (u < 0.47) { P.hands = [[-60, -214], [20 + Math.sin(t * 30) * 10, -420]]; P.look = 0.3; } else { P.hands = [[-100, -300], [100, -300]]; P.hop = Math.abs(Math.sin(u * Math.PI * 4)) * 10; P.look = 0; } return; }
    var c = t % 11; P.talk = t < st.until || S.hot === 'produce';
    if (c < 7) { var a = t * 3.2; P.hands = [[-40 + Math.sin(t * 1.4) * 6, -218], [40 + Math.cos(a) * 14, -300 + Math.sin(a) * 6]]; P.mood = 'calm'; lookAtNexi(P, st, t, S, 0.1); }
    else if (c < 9.6) { P.film = true; P.hands = [[-140, -380], [60, -230]]; P.mood = 'happy'; lookAtNexi(P, st, t, S, -0.9); }
    else { P.hands = [[-40, -250], [40, -250]]; P.mood = 'happy'; P.tilt = 0.06; lookAtNexi(P, st, t, S, 0.6); }
  } };
  var castCLI = { id: 'cli', behind: true, keys: ['approve'], P: CLI, act: function (P, t, S) {
    var st = S.cast.cli; if (tapped('cli', st, t)) { CLI.thump = t + 0.7; }
    P.tilt = 0; P.hop = 0; P.sx = 1;
    if (TAP.cli && t - TAP.cli < 2.6) { var u = (t - TAP.cli) / 2.6; P.stage = 'big'; P.talk = true; P.mood = u > 0.27 ? 'happy' : 'wow';
      P.hands = [[-60, -200], [40, u < 0.27 ? -420 : -300 + Math.max(0, 0.4 - u) * 200]]; P.hop = u > 0.27 && u < 0.4 ? 14 : 0; if (u > 0.27 && !TAP.cliB) { TAP.cliB = true; CR.burst('heart', P.x - 20, P.y - 320, t); } return; }
    TAP.cliB = false;
    var c = (t + 2) % 9, round = Math.floor((t + 2) / 9); P.talk = t < st.until || S.hot === 'approve';
    if (c < 2.4) { P.stage = 'taste'; var up = Math.sin(clamp(c / 1.2, 0, 1) * Math.PI * 0.5); P.hands = [[-60, -200], [20 - up * 10, -200 - up * 150]]; P.mood = c > 1.4 ? 'happy' : 'calm'; P.talk = P.talk || (c > 1.2 && c < 2.2); lookAtNexi(P, st, t, S, 0.1); }
    else if (c < 4.4) { P.stage = ''; P.hands = [[-60, -200], [30, -330]]; P.tilt = -0.06; P.mood = 'calm'; lookAtNexi(P, st, t, S, -0.6); }
    else if (round % 3 === 2) { P.stage = 'note'; P.hands = [[-110 + Math.sin(t * 8) * 6, -214], [50, -200]]; P.mood = 'calm'; lookAtNexi(P, st, t, S, -0.8); }
    else { P.stage = 'stamp'; var sp = (c - 4.4) / 1.4, dn = sp < 1 ? Math.abs(Math.sin(sp * Math.PI)) : 0; P.hands = [[-110, -300 + dn * 70], [50, -200]]; if (sp > 0.45 && sp < 0.6 && (CLI.thump == null || t - CLI.thump > 1.5)) CLI.thump = t; P.mood = sp > 0.5 ? 'happy' : 'calm'; lookAtNexi(P, st, t, S, -0.8); }
  } };
  var castCMG = { id: 'cmg', behind: true, keys: ['community'], P: CMG, act: function (P, t, S) {
    var st = S.cast.cmg; if (tapped('cmg', st, t)) { for (var i = 0; i < 6; i++) BUB.push({ kind: 'emoji', x: P.x, y: P.y - 300, tx: P.x + (i - 2.5) * 34, ty: P.y - 380 - (i % 2) * 30, t0: t + i * 0.12, life: 1.4, col: [STRAW, '#14A38B', '#1877F2', BUTTER_D, '#DD2A7B', '#0A66C2'][i] }); }
    P.tilt = 0; P.hop = 0; P.sx = 1;
    if (TAP.cmg && t - TAP.cmg < 2.4) { var b = Math.sin(t * 9); P.mood = 'happy'; P.talk = true; P.tilt = b * 0.12; P.hop = Math.abs(b) * 12; P.hands = [[-40, -360], [80 + b * 10, -170]]; return; }
    var lead = S.cmLead && t - S.cmLead < 1.2, reply = S.cmReply && t > S.cmReply - 1.6 && t < S.cmReply + 0.6;
    P.talk = t < st.until || S.hot === 'community' || reply;
    if (lead) { P.hands = [[-40, -210], [150, -250 - Math.sin(clamp((t - S.cmLead) / 0.9, 0, 1) * Math.PI) * 40]]; P.look = 0.8; P.mood = 'happy'; return; }
    if (reply) { var k = Math.abs(Math.sin(t * 20)) * 6; P.hands = [[-40, -214 - k], [30, -200 - (6 - k)]]; P.mood = 'happy'; lookAtNexi(P, st, t, S, -0.2); return; }
    var c = t % 8; if (c > 6.4) { P.hands = [[-40, -210], [120, -380 + Math.sin(t * 12) * 16]]; P.mood = 'happy'; lookAtNexi(P, st, t, S, 0.7); }
    else { P.hands = [[-40, -210], [60, -190]]; P.mood = 'calm'; lookAtNexi(P, st, t, S, Math.sin(t * 0.5) * 0.6); }
  } };

  var castKN = { id: 'kn', behind: true, keys: ['plan'], P: KN, act: function (P, t, S) {
    P.tilt = 0; P.hop = 0; P.toss = null; P.flour = false; P.card = false; P.knead = 0; P.sx = 1;
    if (TAP.kn && t - TAP.kn < 2.6) { var u = (t - TAP.kn) / 2.6; P.talk = true; P.mood = 'happy'; P.toss = u * 1.25; P.hands = [[-40, -300 - Math.sin(Math.min(1, u * 1.25) * Math.PI) * 60], [40, -300 - Math.sin(Math.min(1, u * 1.25) * Math.PI) * 60]]; P.look = 0; P.hop = u > 0.8 ? Math.sin((u - 0.8) / 0.2 * Math.PI) * 10 : 0; return; }
    var c = (t + 6) % 12, busy = S.hot === 'plan'; P.talk = busy; P.mood = busy ? 'happy' : 'calm';
    if (c < 5) { var k = Math.sin(t * 5); P.knead = (k + 1) / 2; P.hands = [[-30, -232 + k * 10], [30, -232 - k * 10]]; P.tilt = k * 0.03; P.look = lerp(P.look, 0.1, 0.1); }
    else if (c < 7) { P.flour = true; P.hands = [[-40, -232], [60, -330 + Math.sin(t * 14) * 6]]; P.look = lerp(P.look, 0.5, 0.1); P.mood = 'happy'; }
    else if (c < 9.5) { P.card = true; var dn = Math.abs(Math.sin((c - 7) * 3)); P.hands = [[-40, -232], [40, -250 + dn * 20]]; P.look = lerp(P.look, 0.3, 0.1); }
    else { P.hands = [[-40, -232], [40, -232]]; P.look = lerp(P.look, 0.8, 0.06); P.mood = 'happy'; P.tilt = Math.sin(t * 2) * 0.03; }
  } };

  window.IXW.worlds['sol-social'] = {
    calmView: [130,-70,880,704], calmHide: ['kn'], /* CALM: the framed part of the set */
    pan: [-300, 1260],
    paintBg: paintBg, windowBehind: true, paintFrame: paintFrame, paintBack: paintBack, paintFront: paintFront, paintFore: paintFore,
    paintWindow: paintWindow, paintLive: paintLive, paintFrontLive: paintFrontLive,
    paintForeLive: function (g, t, S) {
      /* pigeons pecking on the near pavement (they flutter off when tapped), the cargo bike passing on the road */
      var fu = t - PIGFLY;
      PIG.forEach(function (p, i) { if (p.x > S.ext.r + 20) return; var x = p.x, y = 718, peck = Math.max(0, Math.sin(t * 3 + p.ph)) > 0.8;
        if (fu < 2.4) { x += fu * 60 * (i % 2 ? 1 : -1); y -= fu * 120 - fu * fu * 8; }
        g.save(); g.translate(x, y); if (fu < 2.4 && fu >= 0) { var fl = Math.sin(t * 30) * 6; g.fillStyle = '#9AA6BC'; g.beginPath(); g.moveTo(-2, -8); g.lineTo(-14, -14 - fl); g.lineTo(-4, -4); g.fill(); g.beginPath(); g.moveTo(2, -8); g.lineTo(14, -14 - fl); g.lineTo(4, -4); g.fill(); }
        fillE(g, 0, -8, 11, 8, '#A9B4C4'); fillE(g, peck ? 9 : 7, peck ? -6 : -16, 5, 5, '#8E9AAD'); fillE(g, peck ? 12 : 10, peck ? -6 : -17, 1.2, 1.2, INK); g.fillStyle = '#E3B04B'; g.fillRect(peck ? 13 : 11, peck ? -5 : -16, 4, 1.6); fillE(g, -9, -10, 4, 3, '#8E9AAD'); g.restore(); });
      var bu = ((t + 9) % 22) / 22, bx = CUT1 + 380 + bu * Math.max(0, S.ext.r - CUT1 - 260);
      if (S.ext.r > FAC1 + 60) { g.save(); g.translate(bx, 728); g.strokeStyle = '#2A3142'; g.lineWidth = 3; [-30, 30].forEach(function (wx) { g.beginPath(); g.arc(wx, -14, 14, 0, 7); g.stroke(); }); fillRR(g, -52, -52, 46, 32, 4, '#3167CA'); text(g, 'DELIVERY', -29, -32, 6.6, 800, '#FFFFFF', 'center');
        g.strokeStyle = '#3E4A59'; g.lineWidth = 3; g.beginPath(); g.moveTo(-30, -14); g.lineTo(0, -40); g.lineTo(30, -14); g.moveTo(0, -40); g.lineTo(8, -60); g.stroke(); g.restore(); }
      K.zfore(g, t, S, [], function () { CO.crew(CREW, g, t, S, 'fore'); }); CR.draw(g, t);
    },
    motes: false,
    glow: {
      plan: function (g) { rr(g, BD.x - 14, BD.y - 14, BD.w + 28, BD.h + 28, 14); },
      produce: function (g) { rr(g, BENCH.x - 10, BENCH.y - 120, BENCH.w + 4, 158, 14); },
      approve: function (g) { rr(g, CLI.x - 50, 238, 100, 210, 18); },
      schedule: function (g) { rr(g, OV.x - 10, OV.y - 6, OV.w + 20, F - OV.y + 4, 14); },
      windows: function (g) { rr(g, WIN[0].x - 16, -100, WIN[2].x + WW - WIN[0].x + 32, WY1 + 116, 16); },
      community: function (g) { rr(g, CMG.x - 52, 240, 160, 236, 18); },
      report: function (g) { rr(g, AB.x - 50, AB.y - 14, 100, F - AB.y + 22, 14); },
      timer: function (g) { rr(g, TIMER.x - 20, TIMER.y - 24, 40, 40, 14); }
    },
    backGlow: ['plan', 'schedule', 'windows', 'timer'],
    cast: [castKN, castPLN, castDES, castCLI, castCMG],
    toy: function (name, S, t) { if (name === 'timer') { TIMERD = t; CR.burst('star', TIMER.x, TIMER.y - 20, t); WIN.forEach(function (w) { for (var i = 0; i < 3; i++) HEARTS.push({ x: w.x + WW / 2 + (i - 1) * 20, y: 40, t0: t + i * 0.15, p: i }); }); } },
    hit: function (x, y, S, t, onBtn) {
      var w = CR.hitWalker(x, y, t); if (w) return w; if (onBtn) return null;
      if (Math.abs(x - KN.x) < 50 && y > 250 && y < DC.y + 30) { TAP.kn = t; CR.burst('heart', KN.x, 250, t); return { say: 'The copy desk: every caption is **drafted for its channel**, then proofed before it goes in the oven.', near: [-80, 20], pose: 'love', who: 'TechNext copywriter' }; }
      var R = S.R; if (R && Math.abs(x - RUN.x) < 50 && y < RUN.y + 8 && y > RUN.y - 260) { TAP.run = t; CR.burst('star', RUN.x, RUN.y - 260, t);
        return { say: 'Fresh out of the oven! Every approved post goes into its **' + CH[WIN[R.wi].ch].n + '** window on schedule.', near: [540, -70], pose: 'celebrate', who: 'TechNext · the runner' }; }
      if (S.ext.r > 1180 && Math.abs(x - SIT.x) < 46 && y > 250 && y < F) { TAP.sit = t; CR.burst('heart', SIT.x, SIT.y - 240, t); return { say: 'Scrolling, liking, **following**. The window display works on a phone too.', near: [960, -80], pose: 'love', who: 'A follower on the bench' }; }
      if (y > 690 && y < 740) for (var i = 0; i < PIG.length; i++) if (Math.abs(x - PIG[i].x) < 30) { PIGFLY = t; return { say: 'Off they go. Even the pigeons know a **fresh post** when they see one.', near: [clamp(x, 300, 900), 120], pose: 'wow', who: 'The pigeons' }; }
      if (y < ROOF - 30 && y > ROOF - 200 && Math.abs(x - (OV.x + OV.w / 2)) < 60) return { say: 'Steam from the chimney: the ovens are on, the **schedule** is running.', near: [540, -70], pose: 'wow', who: 'The chimney' };
      return null;
    },
    onStop: function (key, S, t) { S.kT = t; if (key === 'community') S.cmLead = t + 1.4; if (key === 'windows') WIN.forEach(function (w, i) { HEARTS.push({ x: w.x + WW / 2, y: 40, t0: t + 0.3 + i * 0.3, p: i }); }); }
  };
})(window.IXW && window.IXW.kit, window.CR, window.CO);
