/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: sol-brand (/solutions/brand-assets) — "The Print & Type Studio": graphic and brand assets told as a sunlit
   letterpress loft. Under the clerestory windows, two drying lines carry the collateral (brochures, one-pagers, campaign
   posters, card sheets, social prints) swaying in the breeze. Below, left to right: the logo pinboard over the drafting table
   (the mark drawn on its construction grid with a compass), the brand guide on its lectern in front of the swatch wall
   (colour, type pair, logo, spacing pages flipping), the platen press printing the document templates (letterhead,
   quotation, invoice) under the template rack, the deck screen running the master slides, and the plan chest of master
   files (PowerPoint, Canva, Figma, InDesign, fonts) with the big brass key: files, fonts and rights handed over.
   The cast: the designer draws arcs with her compass (tap: she spins on her stool and holds up the finished mark), the
   guide keeper flips pages and checks colours with a loupe (tap: a swatch fan bursts open), the printer pulls the lever
   (tap: a double pull and a shower of business cards), the presenter clicks through the deck (tap: the slides fan out and
   he bows), the client weighs concepts A, B and C (tap: "this one!" with B held high). The walkers carry paper and tubes;
   the studio cat on the window ledge, the logo stamp and the drying prints are tappable too. */
(function (K, CR, CO) {
  'use strict';
  if (!K || !CR || !CO) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed;
  var F = 470, CEIL = -196, WB0 = -150, WB1 = -12;
  var PAPER = '#FFFDF7', KRAFT = '#D9B98C', KRAFT_D = '#B8955F', INK = '#1D1F2A', RED = '#E8452C', RED_D = '#B9301C', CYAN = '#00A3E0', MAG = '#E6007E', YEL = '#FFD100';
  var MUST = '#E9B949', TEAL = '#1F7A8C', SLATE = '#3E4A59', BRICK = '#F4F0E8', IRON = '#2F4F5F', IRON_D = '#22394A', BLUE = '#3167CA';
  var PIN = { x: 134, y: 18, w: 194, h: 172 }, SW = { x: 344, y: 22, w: 148, h: 172 }, TR = { x: 506, y: 28, w: 150, h: 150 }, PR = { x: 500, y: 236, w: 116 };
  var SCR = { x: 688, y: 88, w: 176, h: 108 }, CH = { x: 900, y: 362, w: 104 }, CERT = { x: 902, y: 212, w: 100, h: 70 }, STAMP = { x: 346, y: 398 };
  var SW_COL = [['#3167CA', 'Primary'], ['#1F1F3D', 'Ink'], ['#D69A00', 'Accent'], ['#EAF0FB', 'Surface']];
  var SLIDES = ['title', 'agenda', 'chart', 'team', 'next'], PAGES = ['Colour', 'Type', 'Logo', 'Spacing'];
  var DRAWERS = ['PowerPoint', 'Canva', 'Figma', 'InDesign', 'Fonts'];
  var TEMPL = ['Quotation', 'Invoice', 'Letterhead', 'Report', 'Post', 'Story'];
  function smooth(u) { u = clamp(u, 0, 1); return u * u * (3 - 2 * u); }
  function heart(g, x, y, r, col) { g.fillStyle = col; g.beginPath(); g.moveTo(x, y + r * 0.9); g.bezierCurveTo(x - r * 1.5, y - r * 0.2, x - r * 0.8, y - r * 1.3, x, y - r * 0.5); g.bezierCurveTo(x + r * 0.8, y - r * 1.3, x + r * 1.5, y - r * 0.2, x, y + r * 0.9); g.fill(); }
  /* the sample mark (the old hero's construction: a circle with a cut quarter and a dot) */
  function mark(g, x, y, r, col, dot) { g.fillStyle = col; g.beginPath(); g.moveTo(x, y); g.arc(x, y, r, -Math.PI / 2, Math.PI, false); g.closePath(); g.fill(); fillE(g, x + r * 0.62, y - r * 0.62, r * 0.26, r * 0.26, dot || MUST); }
  function regMark(g, x, y, r, col) { g.strokeStyle = col; g.lineWidth = 1; g.beginPath(); g.arc(x, y, r, 0, 7); g.moveTo(x - r * 1.6, y); g.lineTo(x + r * 1.6, y); g.moveTo(x, y - r * 1.6); g.lineTo(x, y + r * 1.6); g.stroke(); }
  /* a printed piece hanging on the line: kind = brochure | onepager | poster | cards | post */
  function print(g, kind, x, y, s, seed, sw) {
    g.save(); g.translate(x, y); g.rotate(sw || 0); g.scale(s, s);
    fillRR(g, -3, -4, 6, 10, 1.5, KRAFT_D);
    var cols = [[BLUE, MUST], [RED, '#1F1F3D'], [TEAL, YEL], [MAG, CYAN], ['#1F1F3D', RED]][Math.floor(hash(seed) * 5)];
    if (kind === 'brochure') { fillRR(g, -24, 4, 48, 56, 2, PAPER); g.fillStyle = 'rgba(0,0,0,.06)'; g.fillRect(-8, 4, 1.5, 56); g.fillRect(8, 4, 1.5, 56); fillRR(g, -21, 8, 13, 18, 1, cols[0]); fillRR(g, -5, 8, 10, 4, 1, cols[1]);
      g.fillStyle = '#C9CED8'; for (var i = 0; i < 5; i++) { g.fillRect(-4, 16 + i * 5, 10, 1.6); g.fillRect(11, 10 + i * 5, 10, 1.6); } mark(g, 16, 48, 5, cols[0]); }
    else if (kind === 'onepager') { fillRR(g, -18, 4, 36, 50, 2, PAPER); fillRR(g, -18, 4, 36, 14, 2, cols[0]); g.fillStyle = '#FFFFFF'; g.fillRect(-14, 9, 18, 3); g.fillStyle = '#C9CED8'; for (var j = 0; j < 6; j++) g.fillRect(-14, 23 + j * 4.6, j % 3 === 2 ? 18 : 28, 1.6); fillRR(g, -14, 47, 12, 3, 1, cols[1]); }
    else if (kind === 'poster') { fillRR(g, -20, 4, 40, 58, 2, cols[0]); fillE(g, 6, 26, 13, 13, cols[1]); fillRR(g, -15, 44, 30, 5, 1, '#FFFFFF'); fillRR(g, -15, 52, 20, 3, 1, 'rgba(255,255,255,.7)'); g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(-20, 4, 6, 58); }
    else if (kind === 'cards') { fillRR(g, -22, 4, 44, 44, 2, PAPER); for (var c = 0; c < 4; c++) { var cx = -19 + (c % 2) * 20, cy = 7 + Math.floor(c / 2) * 20; fillRR(g, cx, cy, 18, 17, 1, c % 3 ? '#FFFFFF' : cols[0]); g.strokeStyle = 'rgba(0,0,0,.1)'; g.lineWidth = 0.6; rr(g, cx, cy, 18, 17, 1); g.stroke(); mark(g, cx + 6, cy + 7, 3, c % 3 ? cols[0] : '#FFFFFF', cols[1]); } }
    else { fillRR(g, -20, 4, 40, 44, 2, PAPER); fillRR(g, -17, 7, 34, 26, 1, cols[0]); fillE(g, 8, 16, 5, 5, cols[1]); g.fillStyle = '#C9CED8'; g.fillRect(-16, 37, 22, 1.8); g.fillRect(-16, 41, 14, 1.8); }
    g.restore();
  }
  function handAt(P, side) {
    var F3 = K.F3, d = side ? 1 : -1, h = P.hands[side], sxk = P.sx == null ? 1 : P.sx, bw = P.build || 1;
    var r = K.ik(d * F3.shx * bw, F3.shy, h[0], h[1], F3.a, F3.b, d).h, dy = -(P.hop || 0) + (P.sit ? (P.sitDrop != null ? P.sitDrop : 46) : 0);
    return [P.x + r[0] * P.s * sxk, P.y + (r[1] + dy) * P.s];
  }

  /* ---------------- the people ---------------- */
  var W = CR.who;
  var DSG = W({ x: 290, y: 470, s: 0.47, ph: 0.3, skin: 1, hair: 0, style: 'long', outfit: 'cardigan', top: TEAL, top2: '#FFFFFF', sit: true, chair: false, glasses: true, hands: [[-120, -330], [50, -200]], look: -0.6 });
  DSG.sitDrop = 8;
  var GKP = W({ x: 466, y: 470, s: 0.47, ph: 1.4, skin: 3, hair: 1, style: 'bob', outfit: 'polo', top: MUST, top2: '#FFFFFF', hands: [[-130, -390], [60, -200]], look: -0.5 });
  var OPR = W({ x: 642, y: 470, s: 0.47, ph: 2.2, skin: 2, hair: 0, style: 'short', outfit: 'shirt', top: '#3A6EA5', hands: [[-60, -300], [60, -180]], look: -0.4 });
  OPR.apron = '#4A4F5E';
  var PRS = W({ x: 752, y: 470, s: 0.47, ph: 3.1, skin: 0, hair: 2, style: 'short', outfit: 'polo', top: RED, top2: '#FFFFFF', hands: [[-80, -330], [60, -200]], look: -0.3 });
  var CLT = W({ x: 846, y: 470, s: 0.47, ph: 0.9, skin: 4, hair: 1, style: 'pony', outfit: 'shirt', top: '#6E5BA8', id: '#9AA6BC', clip: MUST, sit: true, chair: false, hands: [[-40, -230], [40, -230]], look: -0.3 });
  CLT.sitDrop = 12;
  var CREW = [
    { x0: -920, x1: -480, y: 496, spd: 15, ph: 0.35, label: 'TechNext production assistant', lines: ['A fresh ream for the press: **letterheads** today.', 'Every new asset matches the last: that is what the **guideline** is for.'], acts: ['id', 'wave', 'nod'],
      P: W({ s: 0.5, skin: 1, hair: 1, style: 'bun', outfit: 'cardigan', top: '#5FA8D3', top2: '#FFFFFF', hold: 'box' }) },
    { x0: 1010, x1: 1360, y: 496, spd: 14, ph: 0.6, label: 'TechNext designer', lines: ['Campaign graphics on demand, built **in the same system**.', 'Banners, ads and event material: all **on-brand**.'], acts: ['wave', 'id', 'cheer'],
      P: W({ s: 0.5, skin: 0, hair: 0, style: 'short', outfit: 'shirt', top: MAG, hold: 'clipboard' }) },
    { front: true, x0: 1040, x1: 1380, y: 690, spd: 16, ph: 0.2, label: 'TechNext account manager', lines: ['Send us what you have today: **logo files, a deck, a brochure**.', 'We quote **before** work begins.'], acts: ['id', 'nod', 'wave'],
      P: W({ s: 0.58, skin: 2, hair: 1, style: 'pony', outfit: 'polo', top: '#714B67', top2: '#FFFFFF', clip: MUST, hold: 'tablet' }) }
  ];
  CREW[0].P.fixS = true; CREW[1].P.fixS = true;
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
  /* the finishing table (left, behind the title card): the TechNext finisher trims and stacks business cards */
  var FIN = W({ x: -150, y: 486, s: 0.47, ph: 1.9, skin: 0, hair: 0, style: 'short', outfit: 'polo', top: '#E9B949', top2: '#FFFFFF', glasses: true, hands: [[-50, -230], [50, -230]], look: 0.2 });
  FIN.apron = '#3E4A59';
  var FT = { x: -244, y: 420, w: 190 };

  /* ---------------- the static layers ---------------- */
  function setU(g, sx, sy, k) { g.translate(sx, sy); g.scale(k, k); }
  function extOf(W, H, k, sx, sy) { return { l: -(sx + 24) / k, r: (W - sx) / k, t: -(sy + 24) / k, b: (H - sy) / k }; }
  function paintBg(g, W, H, k, sx, sy) { /* the sky and the rooftops seen through the clerestory */
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    var sg = g.createLinearGradient(0, e.t, 0, WB1); sg.addColorStop(0, '#8ED0F7'); sg.addColorStop(1, '#E2F4FD'); g.fillStyle = sg; g.fillRect(e.l, e.t, e.r - e.l, WB1 + 20 - e.t);
    var gl = g.createRadialGradient(-160, -240, 10, -160, -240, 420); gl.addColorStop(0, 'rgba(255,247,210,.9)'); gl.addColorStop(0.3, 'rgba(255,240,190,.3)'); gl.addColorStop(1, 'rgba(255,240,190,0)'); g.fillStyle = gl; g.fillRect(e.l, e.t, e.r - e.l, 400);
    for (var i = 0; i < 60; i++) { var bx = Math.floor(e.l / 54) * 54 + i * 54; if (bx > e.r) break; var bh = 30 + hash(i * 2.3 + 1) * 60; fillRR(g, bx, WB1 - bh, 50, bh + 20, 2, i % 3 ? '#C7DDEB' : '#D4E5F0');
      g.fillStyle = 'rgba(255,255,255,.65)'; for (var wy = WB1 - bh + 8; wy < WB1 - 6; wy += 12) for (var wx = bx + 6; wx < bx + 44; wx += 11) if (hash(wx * 0.3 + wy) > 0.45) g.fillRect(wx, wy, 6, 6); }
    g.restore();
  }
  function paintFrame(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    /* the ceiling: white boards, a steel truss, skylight panes */
    g.fillStyle = '#F7F7F4'; g.fillRect(e.l, e.t, e.r - e.l, CEIL + 34 - e.t);
    for (var sk = Math.floor(e.l / 260) * 260 + 60; sk < e.r; sk += 260) { fillRR(g, sk, CEIL - 120, 150, 70, 4, '#D9EEF9'); g.fillStyle = 'rgba(255,255,255,.7)'; g.fillRect(sk + 74, CEIL - 120, 3, 70); g.fillRect(sk, CEIL - 86, 150, 3); }
    g.fillStyle = '#E4E7EC'; g.fillRect(e.l, CEIL, e.r - e.l, 6); g.fillRect(e.l, CEIL + 26, e.r - e.l, 6);
    g.strokeStyle = '#E8EBEF'; g.lineWidth = 2; g.beginPath(); for (var tx = Math.floor(e.l / 40) * 40; tx < e.r; tx += 40) { g.moveTo(tx, CEIL + 8); g.lineTo(tx + 20, CEIL + 26); g.lineTo(tx + 40, CEIL + 8); } g.stroke();
    /* the clerestory: steel-framed panes (the sky shows through), a ledge below */
    g.fillStyle = BRICK; g.fillRect(e.l, CEIL + 32, e.r - e.l, WB0 - CEIL - 32);
    g.fillStyle = SLATE; for (var mx = Math.floor(e.l / 36) * 36; mx < e.r; mx += 36) g.fillRect(mx - 1.5, WB0, 3, WB1 - WB0); g.fillRect(e.l, WB0 - 4, e.r - e.l, 5); g.fillRect(e.l, (WB0 + WB1) / 2 - 1.5, e.r - e.l, 3);
    g.fillStyle = 'rgba(255,255,255,.22)'; for (var gx = Math.floor(e.l / 180) * 180; gx < e.r; gx += 180) { g.beginPath(); g.moveTo(gx + 20, WB1); g.lineTo(gx + 64, WB0); g.lineTo(gx + 84, WB0); g.lineTo(gx + 40, WB1); g.closePath(); g.fill(); }
    for (var col = Math.floor(e.l / 300) * 300; col < e.r; col += 300) { g.fillStyle = '#E9E4DA'; g.fillRect(col - 12, CEIL + 32, 24, WB1 - CEIL - 32); }
    fillRR(g, e.l, WB1, e.r - e.l, 10, 0, '#FFFFFF'); g.fillStyle = 'rgba(40,40,60,.08)'; g.fillRect(e.l, WB1 + 10, e.r - e.l, 4);
    /* white-painted brick */
    g.fillStyle = BRICK; g.fillRect(e.l, WB1 + 10, e.r - e.l, F - WB1 - 10); g.strokeStyle = 'rgba(160,140,110,.16)'; g.lineWidth = 1.3; g.beginPath();
    for (var by = WB1 + 22; by < F; by += 14) { g.moveTo(e.l, by); g.lineTo(e.r, by); var off = (Math.round(by / 14) % 2) * 22; for (var bx = Math.floor(e.l / 44) * 44 + off; bx < e.r; bx += 44) { g.moveTo(bx, by); g.lineTo(bx, by - 14); } } g.stroke();
    fillRR(g, e.l, F - 14, e.r - e.l, 14, 0, '#E3DCCF');
    /* sun shafts from the clerestory, soft and static */
    g.save(); g.globalAlpha = 0.5; for (var sh = Math.floor(e.l / 300) * 300 + 120; sh < e.r; sh += 300) { var lg = g.createLinearGradient(0, WB1, 0, F); lg.addColorStop(0, 'rgba(255,248,220,.55)'); lg.addColorStop(1, 'rgba(255,248,220,0)'); g.fillStyle = lg;
      g.beginPath(); g.moveTo(sh, WB1); g.lineTo(sh + 110, WB1); g.lineTo(sh + 210, F); g.lineTo(sh + 60, F); g.closePath(); g.fill(); } g.restore();
    /* the floor: warm polished concrete with a big cutting mat and paper scraps */
    var fl = g.createLinearGradient(0, F, 0, e.b); fl.addColorStop(0, '#E6E0D5'); fl.addColorStop(1, '#D3CBBD'); g.fillStyle = fl; g.fillRect(e.l, F, e.r - e.l, e.b - F);
    g.strokeStyle = 'rgba(120,110,95,.14)'; g.lineWidth = 1.5; g.beginPath(); for (var d = 1; d < 7; d++) { var yy = F + Math.pow(d / 7, 1.4) * (e.b - F); g.moveTo(e.l, yy); g.lineTo(e.r, yy); } g.stroke();
    var sh2 = g.createLinearGradient(0, F, 0, F + 34); sh2.addColorStop(0, 'rgba(40,40,60,.12)'); sh2.addColorStop(1, 'rgba(40,40,60,0)'); g.fillStyle = sh2; g.fillRect(e.l, F, e.r - e.l, 34);
    for (var ps = 0; ps < 26; ps++) { var px = e.l + hash(ps * 3.1) * (e.r - e.l), py = F + 30 + hash(ps * 7.7) * (e.b - F - 60); if (px > 150 && px < 960 && py < 620) continue; g.save(); g.translate(px, py); g.rotate(hash(ps) * 3); fillRR(g, -6, -4, 12, 8, 1, ['#FFFFFF', '#FFE9A8', '#CDE8F6', '#FAD3CC'][ps % 4]); g.restore(); }
    g.restore();
  }
  function shelfOfReams(g, x, y, w) { fillRR(g, x, y, w, 7, 2, KRAFT_D); for (var i = 0; i < Math.floor(w / 26); i++) { var c = ['#FFFFFF', '#FFE9A8', '#CDE8F6', '#FAD3CC', '#D7F0DF', '#E6DDF7'][i % 6]; for (var r2 = 0; r2 < 3; r2++) fillRR(g, x + 4 + i * 26, y - 10 - r2 * 9, 22, 8, 1, c); g.fillStyle = 'rgba(0,0,0,.08)'; g.fillRect(x + 4 + i * 26, y - 28, 22, 1); } }
  function paintBack(g, ext) {
    /* ---- the far studio (wide screens): door, paper stock, the guillotine, a moodboard, the type case ---- */
    if (ext.l < -560) {
      var dx = -900; fillRR(g, dx - 8, 200, 100, F - 200, 4, SLATE); fillRR(g, dx, 208, 84, F - 208, 3, '#C8D3DD'); fillRR(g, dx + 10, 220, 64, 90, 3, '#E2F1FA'); fillE(g, dx + 72, 350, 5, 5, MUST);
      fillRR(g, dx - 2, 168, 88, 24, 4, INK); text(g, 'PRINT · TYPE · BRAND', dx + 42, 184, 7.4, 800, '#FFFFFF', 'center');
      [0, 1, 2, 3].forEach(function (r) { shelfOfReams(g, -780, 120 + r * 72, 180); }); fillRR(g, -786, 106, 6, F - 106, 2, KRAFT_D); fillRR(g, -594, 106, 6, F - 106, 2, KRAFT_D);
      text(g, 'PAPER STOCK', -690, 98, 8, 800, INK, 'center');
      /* the moodboard */
      fillRR(g, -930, -2, 200, 140, 6, '#C9A57A'); fillRR(g, -924, 4, 188, 128, 4, '#E8D3B2');
      [[-910, 12, BLUE], [-866, 18, RED], [-820, 10, MUST], [-776, 20, TEAL], [-904, 70, MAG], [-852, 66, '#1F1F3D'], [-796, 72, CYAN]].forEach(function (m, i) { g.save(); g.translate(m[0] + 20, m[1] + 22); g.rotate((hash(i) - 0.5) * 0.3); fillRR(g, -20, -22, 40, 44, 2, '#FFFFFF'); fillRR(g, -16, -18, 32, 26, 1, m[2]); fillE(g, 0, -24, 3, 3, RED); g.restore(); });
      text(g, 'MOODBOARD', -830, 128, 7, 800, '#7A5A3A', 'center');
    }
    if (ext.l < -200) {
      /* the type case: a tall cabinet of shallow drawers */
      var tc = -540; fillRR(g, tc, 150, 170, F - 150, 6, '#B07A4A'); for (var dr = 0; dr < 10; dr++) { fillRR(g, tc + 8, 160 + dr * 30, 154, 24, 2, '#C98E5A'); fillRR(g, tc + 70, 168 + dr * 30, 30, 8, 2, '#E8D3B2'); fillE(g, tc + 85, 178 + dr * 30, 4, 2.4, '#7A5A3A'); }
      text(g, 'TYPE CASE', tc + 85, 142, 8, 800, INK, 'center');
      /* the guillotine */
      var gx = -330; fillRR(g, gx, 360, 130, 18, 4, '#5C6B7A'); fillRR(g, gx + 10, 378, 10, F - 378, 2, '#3E4A59'); fillRR(g, gx + 110, 378, 10, F - 378, 2, '#3E4A59'); fillRR(g, gx + 12, 300, 8, 62, 2, '#3E4A59');
      g.strokeStyle = '#7A869C'; g.lineWidth = 6; g.lineCap = 'round'; g.beginPath(); g.moveTo(gx + 16, 304); g.lineTo(gx + 110, 280); g.stroke(); fillRR(g, gx + 100, 268, 30, 16, 6, RED); fillRR(g, gx + 30, 350, 70, 8, 1, '#FFFFFF');
      text(g, 'TRIM', gx + 65, 373, 7, 800, '#FFFFFF', 'center');
      /* ink tins on a shelf */
      fillRR(g, -230, 140, 220, 8, 2, KRAFT_D); [CYAN, MAG, YEL, INK, RED, TEAL, MUST].forEach(function (c, i) { fillRR(g, -222 + i * 30, 112, 24, 28, 3, '#D5DAE0'); fillRR(g, -222 + i * 30, 120, 24, 12, 1, c); fillRR(g, -224 + i * 30, 108, 28, 6, 2, '#AEB6C2'); });
      text(g, 'INKS', -120, 102, 8, 800, INK, 'center');
      /* the proof wall: press proofs with crop marks and colour bars, clipped to a wire */
      g.strokeStyle = 'rgba(60,60,70,.55)'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(-236, 186); g.quadraticCurveTo(-130, 194, -22, 186); g.stroke();
      [[-226, 'brochure', 0.03], [-176, 'poster', -0.04], [-124, 'onepager', 0.02], [-72, 'cards', -0.03]].forEach(function (p2, i) { g.save(); g.translate(p2[0] + 22, 190); g.rotate(p2[2]);
        shadowed(g, 6, 2, 0.16, function () { fillRR(g, -22, 0, 44, 62, 1, '#FFFFFF'); }); g.save(); g.translate(0, 2); g.scale(0.78, 0.78); print(g, p2[1], 0, 2, 1, 40 + i, 0); g.restore();
        [CYAN, MAG, YEL, INK].forEach(function (c, k) { g.fillStyle = c; g.fillRect(-18 + k * 9, 54, 8, 4); }); regMark(g, 16, 8, 2.4, 'rgba(30,30,40,.5)'); fillRR(g, -4, -4, 8, 8, 2, '#9AA6BC'); g.restore(); });
      text(g, 'PROOFS · CHECK BEFORE PRINT', -130, 176, 6.8, 800, '#7A869C', 'center');
    }
    if (ext.l < 110) { /* a tall plant and a paper roll by the pinboard */
      fillRR(g, 40, 300, 60, F - 300, 6, '#EDE6DA'); fillE(g, 70, 300, 30, 9, '#D9CFBE'); g.fillStyle = '#C9BCA6'; g.fillRect(66, 300, 8, F - 300);
      g.save(); g.translate(14, F); g.scale(1.1, 1.1); K.plant(g, { x: 0, y: 0 }, '#2F4F5F', '#3E6378'); g.restore(); }
    /* ---- the logo pinboard: three sketches, the chosen one circled, the construction card ---- */
    shadowed(g, 10, 4, 0.16, function () { fillRR(g, PIN.x - 6, PIN.y - 6, PIN.w + 12, PIN.h + 12, 6, '#B08A60'); });
    fillRR(g, PIN.x, PIN.y, PIN.w, PIN.h, 3, '#D8B98E'); g.fillStyle = 'rgba(120,80,40,.12)'; for (var cp = 0; cp < 40; cp++) fillE(g, PIN.x + hash(cp) * PIN.w, PIN.y + hash(cp * 3.3) * PIN.h, 1.4, 1.4, 'rgba(120,80,40,.14)');
    [[PIN.x + 12, PIN.y + 14, 'A', -0.06], [PIN.x + 70, PIN.y + 10, 'B', 0.04], [PIN.x + 128, PIN.y + 16, 'C', -0.03]].forEach(function (s, i) { g.save(); g.translate(s[0] + 26, s[1] + 30); g.rotate(s[3]);
      fillRR(g, -26, -30, 52, 60, 2, PAPER); fillE(g, 0, -33, 3.4, 3.4, RED); g.strokeStyle = '#9AA6BC'; g.lineWidth = 1; g.setLineDash([2, 2]); g.beginPath(); g.arc(0, -4, 14, 0, 7); g.stroke(); g.setLineDash([]);
      if (i === 0) { g.strokeStyle = INK; g.lineWidth = 2.4; g.beginPath(); g.arc(0, -4, 11, 0.5, 5.6); g.stroke(); } else if (i === 1) mark(g, 0, -4, 12, '#3167CA'); else { fillRR(g, -10, -14, 20, 20, 3, INK); fillE(g, 0, -4, 5, 5, MUST); }
      text(g, s[2], -20, 24, 9, 800, '#7A869C'); g.restore(); });
    g.strokeStyle = RED; g.lineWidth = 2; g.beginPath(); g.ellipse(PIN.x + 96, PIN.y + 38, 32, 30, 0, 0, 7); g.stroke();
    fillRR(g, PIN.x + 14, PIN.y + 96, PIN.w - 28, 64, 3, PAPER); fillE(g, PIN.x + PIN.w / 2, PIN.y + 94, 3.4, 3.4, BLUE);
    g.strokeStyle = 'rgba(49,103,202,.25)'; g.lineWidth = 0.8; g.beginPath(); for (var gl = 0; gl < 7; gl++) { g.moveTo(PIN.x + 24 + gl * 10, PIN.y + 102); g.lineTo(PIN.x + 24 + gl * 10, PIN.y + 154); } for (var gh = 0; gh < 6; gh++) { g.moveTo(PIN.x + 24, PIN.y + 104 + gh * 10); g.lineTo(PIN.x + 84, PIN.y + 104 + gh * 10); } g.stroke();
    text(g, 'Logo · construction', PIN.x + 96, PIN.y + 118, 8, 800, INK); text(g, 'grid · circle · dot', PIN.x + 96, PIN.y + 130, 6.6, 700, '#7A869C');
    text(g, 'print · screen · social', PIN.x + 96, PIN.y + 142, 6.6, 700, '#7A869C');
    /* ---- the swatch wall: four colour chips, the type pair ---- */
    shadowed(g, 10, 4, 0.14, function () { fillRR(g, SW.x, SW.y, SW.w, SW.h, 6, '#FFFFFF'); }); text(g, 'BRAND GUIDE · tokens', SW.x + 10, SW.y + 16, 7.4, 800, INK);
    SW_COL.forEach(function (c, i) { var cx = SW.x + 10 + (i % 2) * 66, cy = SW.y + 24 + Math.floor(i / 2) * 54; fillRR(g, cx, cy, 62, 34, 3, c[0]); g.strokeStyle = 'rgba(0,0,0,.08)'; g.lineWidth = 1; rr(g, cx, cy, 62, 34, 3); g.stroke();
      text(g, c[1], cx + 2, cy + 43, 6.4, 800, INK); text(g, c[0], cx + 2, cy + 50, 5.6, 700, '#7A869C'); });
    fillRR(g, SW.x + 10, SW.y + 132, SW.w - 20, 32, 3, '#F4F1EA'); text(g, 'Aa', SW.x + 16, SW.y + 157, 22, 800, INK); text(g, 'Plus Jakarta Sans', SW.x + 50, SW.y + 146, 7, 800, INK); text(g, 'headings 800 · 600', SW.x + 50, SW.y + 156, 6, 700, '#7A869C');
    /* the drafting table (a tilted board on a stand) and the designer's stool */
    g.strokeStyle = '#7A869C'; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.moveTo(186, 350); g.lineTo(166, F - 2); g.moveTo(186, 350); g.lineTo(212, F - 2); g.moveTo(170, 440); g.lineTo(208, 440); g.stroke();
    /* the lectern for the guide book */
    fillRR(g, 392, 300, 10, F - 300, 3, '#8A6A4A'); fillRR(g, 372, F - 8, 50, 8, 3, '#8A6A4A');
    g.fillStyle = '#8A6A4A'; g.beginPath(); g.moveTo(352, 304); g.lineTo(442, 304); g.lineTo(434, 278); g.lineTo(360, 278); g.closePath(); g.fill();
    /* the tilted drafting board (on its stand) with the sheet */
    g.save(); g.translate(188, 318); g.rotate(-0.16); shadowed(g, 8, 3, 0.18, function () { fillRR(g, -62, -42, 124, 84, 4, '#E8D3B2'); }); fillRR(g, -56, -36, 112, 72, 2, PAPER);
    g.strokeStyle = 'rgba(49,103,202,.2)'; g.lineWidth = 0.8; g.beginPath(); for (var gl = -48; gl <= 48; gl += 12) { g.moveTo(gl, -32); g.lineTo(gl, 32); } for (var gh = -28; gh <= 28; gh += 12) { g.moveTo(-52, gh); g.lineTo(52, gh); } g.stroke();
    fillRR(g, -62, 40, 124, 6, 2, '#8A6A4A'); g.restore();

    /* ---- the template rack: six pigeon-holes with papers sticking out ---- */
    shadowed(g, 10, 4, 0.16, function () { fillRR(g, TR.x, TR.y, TR.w, TR.h, 6, '#B07A4A'); });
    TEMPL.forEach(function (n, i) { var cx = TR.x + 8 + (i % 2) * 70, cy = TR.y + 10 + Math.floor(i / 2) * 46; fillRR(g, cx, cy, 64, 40, 2, '#8A5A34');
      for (var p = 0; p < 3; p++) fillRR(g, cx + 5 + p * 2, cy + 6 + p * 3, 54 - p * 4, 22, 1, p === 2 ? PAPER : '#F1ECE2');
      fillRR(g, cx + 8, cy + 10, 18, 4, 1, [BLUE, RED, TEAL, MUST, MAG, CYAN][i]); fillRR(g, cx + 6, cy + 30, 52, 9, 2, '#F4E3C3'); text(g, n, cx + 32, cy + 37, 6.2, 800, '#5A3A1A', 'center'); });
    text(g, 'TEMPLATES · documents & social', TR.x + TR.w / 2, TR.y - 6, 7, 800, INK, 'center');
    /* ---- the platen press: cabinet, cast-iron body, platen, ink disc arm, flywheel housing ---- */
    var px = PR.x; soft(g, px + 58, F + 3, 80, 8, 0.28);
    fillRR(g, px - 6, 382, PR.w + 12, F - 382, 6, IRON_D); fillRR(g, px + 6, 394, PR.w - 12, 30, 3, IRON); fillRR(g, px + 6, 430, PR.w - 12, 30, 3, IRON); fillE(g, px + 58, 409, 5, 3, '#9AA6BC'); fillE(g, px + 58, 445, 5, 3, '#9AA6BC');
    g.fillStyle = IRON; g.beginPath(); g.moveTo(px + 10, 382); g.lineTo(px + 24, 270); g.lineTo(px + 92, 270); g.lineTo(px + 106, 382); g.closePath(); g.fill();
    fillRR(g, px + 26, 284, 64, 76, 4, '#46667A'); fillRR(g, px + 32, 290, 52, 64, 2, PAPER);
    fillRR(g, px + 50, 238, 16, 34, 3, IRON_D); fillRR(g, px - 10, 362, 30, 20, 4, IRON_D);
    text(g, 'TN · No. 2', px + 58, 376, 7, 800, MUST, 'center');
    fillRR(g, px + PR.w - 4, 340, 40, 42, 3, '#C9B79A'); for (var st = 0; st < 5; st++) fillRR(g, px + PR.w - 2 + st * 0.6, 372 - st * 4, 36, 4, 1, st % 2 ? PAPER : '#F1ECE2');
    /* ---- the deck screen on its wall arm ---- */
    fillRR(g, SCR.x + SCR.w / 2 - 6, SCR.y + SCR.h, 12, 26, 3, '#7A869C'); fillRR(g, SCR.x + SCR.w / 2 - 30, SCR.y + SCR.h + 22, 60, 8, 3, '#7A869C');
    shadowed(g, 14, 5, 0.22, function () { fillRR(g, SCR.x - 8, SCR.y - 8, SCR.w + 16, SCR.h + 16, 8, '#2A3142'); });
    fillRR(g, SCR.x + SCR.w / 2 - 50, SCR.y - 26, 100, 16, 5, INK); text(g, 'SALES DECK · masters', SCR.x + SCR.w / 2, SCR.y - 15, 7, 800, '#FFFFFF', 'center');
    /* ---- the ownership certificate and the plan chest of master files ---- */
    shadowed(g, 8, 3, 0.16, function () { fillRR(g, CERT.x - 6, CERT.y - 6, CERT.w + 12, CERT.h + 12, 4, '#C9A44A'); }); fillRR(g, CERT.x, CERT.y, CERT.w, CERT.h, 2, PAPER);
    g.strokeStyle = '#C9A44A'; g.lineWidth = 1; rr(g, CERT.x + 4, CERT.y + 4, CERT.w - 8, CERT.h - 8, 2); g.stroke();
    text(g, 'HANDED OVER', CERT.x + CERT.w / 2, CERT.y + 20, 8, 800, INK, 'center'); text(g, 'files · fonts · rights', CERT.x + CERT.w / 2, CERT.y + 32, 6.6, 700, '#7A869C', 'center'); text(g, 'yours to keep', CERT.x + CERT.w / 2, CERT.y + 44, 6.6, 800, RED, 'center');
    fillE(g, CERT.x + CERT.w - 18, CERT.y + CERT.h - 14, 9, 9, RED); fillE(g, CERT.x + CERT.w - 18, CERT.y + CERT.h - 14, 5, 5, '#F27C66');
    var cx2 = CH.x; soft(g, cx2 + CH.w / 2, F + 3, 80, 7, 0.26); fillRR(g, cx2, CH.y, CH.w, F - CH.y, 4, '#4E6E7E'); fillRR(g, cx2 - 4, CH.y - 6, CH.w + 8, 10, 3, '#3E5A68');
    DRAWERS.forEach(function (n, i) { var dy = CH.y + 8 + i * 19; fillRR(g, cx2 + 6, dy, CH.w - 12, 16, 2, '#5F8292'); fillRR(g, cx2 + 12, dy + 4, 50, 8, 1.5, '#F4E3C3'); text(g, n, cx2 + 37, dy + 10.4, 5.4, 800, '#3A2A1A', 'center'); fillRR(g, cx2 + CH.w - 30, dy + 6, 18, 4, 2, '#C9A44A'); });
    /* the next corner (wide screens): the roll-up banner, a paper roll stand, a bike with a poster tube */
    if (ext.r > 1010) {
      var rx = 1040; soft(g, rx + 40, F + 3, 50, 6, 0.25); fillRR(g, rx, F - 12, 80, 12, 4, '#9AA6BC'); fillRR(g, rx + 4, 120, 72, F - 132, 2, BLUE); fillRR(g, rx + 4, 120, 72, 6, 2, '#1E4691');
      mark(g, rx + 40, 180, 18, '#FFFFFF', MUST); text(g, 'Campaign', rx + 40, 236, 10, 800, '#FFFFFF', 'center'); text(g, 'graphics', rx + 40, 250, 10, 800, '#FFFFFF', 'center'); fillRR(g, rx + 14, 380, 52, 14, 7, MUST); text(g, 'event', rx + 40, 390, 7, 800, INK, 'center');
      var pr = 1150; fillRR(g, pr - 4, 300, 8, F - 300, 2, '#7A869C'); fillRR(g, pr + 96, 300, 8, F - 300, 2, '#7A869C'); fillRR(g, pr - 2, 286, 104, 30, 15, '#FFFFFF'); fillE(g, pr - 2, 301, 8, 15, '#E3DCCF'); g.fillStyle = '#F4F1EA'; g.fillRect(pr + 20, 316, 60, 120);
      fillRR(g, pr - 30, F - 16, 160, 16, 4, '#B08A60');
      if (ext.r > 1280) { fillRR(g, 1290, 180, 120, 160, 6, '#FFFFFF'); fillRR(g, 1298, 188, 104, 144, 2, '#E2F1FA'); text(g, 'STUDIO', 1350, 172, 9, 800, INK, 'center'); }
    }
  }
  function finTable(g) {
    var f = FT; soft(g, f.x + f.w / 2, 524, f.w * 0.6, 7, 0.25); fillRR(g, f.x, f.y + 12, f.w, 520 - f.y - 12, 6, '#5C6B7A'); g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(f.x + f.w - 14, f.y + 12, 14, 520 - f.y - 12);
    for (var dd = 0; dd < 3; dd++) { fillRR(g, f.x + 12 + dd * 58, f.y + 30, 50, 22, 3, '#6E7D8F'); fillRR(g, f.x + 29 + dd * 58, f.y + 38, 16, 4, 2, '#C9D3DE'); fillRR(g, f.x + 12 + dd * 58, f.y + 58, 50, 22, 3, '#6E7D8F'); fillRR(g, f.x + 29 + dd * 58, f.y + 66, 16, 4, 2, '#C9D3DE'); }
    fillRR(g, f.x - 8, f.y, f.w + 16, 14, 4, '#2F7A5F'); g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 0.8; g.beginPath(); for (var gx = f.x; gx < f.x + f.w; gx += 12) { g.moveTo(gx, f.y + 1); g.lineTo(gx + 2, f.y + 13); } g.stroke();
    /* the rotary trimmer's rail on the table top, a ruler, a stack of cut sheets */
    fillRR(g, f.x + 4, f.y - 4, 96, 5, 2, '#AEB6C2'); fillRR(g, f.x + 120, f.y - 10, 50, 8, 1, '#FFFFFF'); fillRR(g, f.x + 120, f.y - 14, 50, 4, 1, '#FFE9A8'); fillRR(g, f.x + 112, f.y + 2, 60, 3, 1, MUST);
    text(g, 'FINISHING', f.x + f.w / 2, f.y + 100, 8, 800, '#FFFFFF', 'center');
  }
  function paintFront(g, ext) {
    finTable(g);
    /* the designer's stool */
    var sx = DSG.x; fillRR(g, sx - 28, 414, 56, 9, 4, '#3E4A59'); g.strokeStyle = '#5C6B7A'; g.lineWidth = 4; g.lineCap = 'round'; g.beginPath(); g.moveTo(sx, 422); g.lineTo(sx, 452); g.moveTo(sx - 26, F - 2); g.lineTo(sx, 452); g.lineTo(sx + 26, F - 2); g.stroke();
    /* the lectern top and the logo stamp's side table */
    var st = STAMP; soft(g, st.x, F + 2, 24, 4, 0.22); fillRR(g, st.x - 3, st.y, 6, F - st.y, 2, '#5C6B7A'); fillRR(g, st.x - 16, F - 4, 32, 4, 2, '#5C6B7A'); fillRR(g, st.x - 20, st.y - 4, 40, 7, 3, '#B07A4A');
    fillRR(g, st.x - 14, st.y - 10, 28, 7, 2, '#2A3142');
    /* the client's armchair (she sits on its cushion) */
    var ax = CLT.x; soft(g, ax, F + 3, 60, 7, 0.25); fillRR(g, ax - 52, 400, 104, 52, 14, '#6E5BA8'); fillRR(g, ax - 58, 386, 18, 70, 8, '#5A4890'); fillRR(g, ax + 40, 386, 18, 70, 8, '#5A4890'); fillRR(g, ax - 44, 410, 88, 20, 8, '#8A78C2');
    fillRR(g, ax - 46, 452, 8, 18, 2, '#3E4A59'); fillRR(g, ax + 38, 452, 8, 18, 2, '#3E4A59');
    /* the press: the flywheel housing and the front tray lip */
    fillRR(g, PR.x + PR.w - 2, 374, 44, 8, 3, '#A8977A');
    /* the open archive box on the plan chest: master files and the brass key */
    var bx = CH.x + 8, by = CH.y - 50; fillRR(g, bx, by, 88, 46, 4, KRAFT); fillRR(g, bx, by, 88, 9, 3, KRAFT_D); g.fillStyle = KRAFT_D; g.beginPath(); g.moveTo(bx, by); g.lineTo(bx - 12, by - 16); g.lineTo(bx + 76, by - 16); g.lineTo(bx + 88, by); g.closePath(); g.fill();
    ['PPTX', 'CANVA', 'FIG', 'INDD'].forEach(function (f, i) { fillRR(g, bx + 8 + i * 19, by - 10 - (i % 2) * 4, 16, 20, 2, ['#D24726', '#00C4CC', '#A259FF', '#FF3366'][i]); text(g, f.slice(0, 3), bx + 16 + i * 19, by + 4 - (i % 2) * 4, 4.6, 800, '#FFFFFF', 'center'); });
    fillRR(g, bx + 10, by + 18, 68, 14, 3, PAPER); text(g, 'MASTER FILES', bx + 44, by + 28, 7, 800, INK, 'center');
  }
  function paintFore(g, ext) {
    /* the near floor: a pallet of reams, a crate of wood type, a bin of rolled posters, the files box */
    /* a printed colour-bar runner on the floor (behind the title card; seen in View the scene) */
    [CYAN, MAG, YEL, INK, RED, TEAL, MUST, BLUE, '#FFFFFF', CYAN, MAG, YEL].forEach(function (c, i) { var x0 = -440 + i * 46; g.fillStyle = c; g.globalAlpha = 0.8; g.beginPath(); g.moveTo(x0, 596); g.lineTo(x0 + 44, 596); g.lineTo(x0 + 46, 612); g.lineTo(x0 + 2, 612); g.closePath(); g.fill(); g.globalAlpha = 1; });
    g.strokeStyle = 'rgba(30,30,40,.35)'; g.lineWidth = 1; g.strokeRect(-440, 596, 552, 16); regMark(g, -456, 604, 5, 'rgba(30,30,40,.5)'); regMark(g, 128, 604, 5, 'rgba(30,30,40,.5)');
    g.save(); g.translate(0, -30);
    var pl = 140; soft(g, pl + 70, 742, 90, 7, 0.25); fillRR(g, pl, 726, 140, 14, 2, '#C9A57A'); g.fillStyle = '#A8845A'; g.fillRect(pl + 10, 740, 20, 6); g.fillRect(pl + 60, 740, 20, 6); g.fillRect(pl + 110, 740, 20, 6);
    for (var r = 0; r < 4; r++) for (var c = 0; c < 3; c++) fillRR(g, pl + 6 + c * 44, 712 - r * 14, 42, 13, 1, ['#FFFFFF', '#FFE9A8', '#CDE8F6', '#FAD3CC'][(r + c) % 4]);
    text(g, 'PAPER · 120 gsm', pl + 70, 738, 6.6, 800, '#6A4A2A', 'center');
    var wt = 470; soft(g, wt + 50, 744, 64, 6, 0.25); fillRR(g, wt, 700, 100, 44, 5, '#B07A4A'); fillRR(g, wt, 700, 100, 8, 4, '#8A5A34');
    ['A', 'a', 'B', 'R', '&'].forEach(function (l, i) { fillRR(g, wt + 6 + i * 19, 682 - (i % 2) * 6, 17, 22, 2, '#D9B98C'); text(g, l, wt + 14.5 + i * 19, 698 - (i % 2) * 6, 14, 800, INK, 'center'); });
    var bn = 940; soft(g, bn + 26, 744, 34, 5, 0.25); fillRR(g, bn, 690, 52, 54, 6, TEAL); [[8, '#FFFFFF'], [18, MUST], [28, RED], [38, CYAN]].forEach(function (p) { fillRR(g, bn + p[0] - 4, 650 - (p[0] % 3) * 6, 8, 48, 4, p[1]); fillE(g, bn + p[0], 650 - (p[0] % 3) * 6, 4, 2.4, 'rgba(0,0,0,.12)'); });
    g.restore(); g.save(); g.translate(0, -32);
    if (ext.l < -500) {
      /* a hand truck with boxes of finished collateral, and a bike with a poster tube (kept left of the title card) */
      var ht = -640; soft(g, ht + 20, 746, 50, 5, 0.25); g.strokeStyle = '#3E4A59'; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.moveTo(ht, 600); g.lineTo(ht, 736); g.lineTo(ht + 50, 736); g.stroke(); fillE(g, ht + 4, 740, 9, 9, '#2A3142');
      [[0, KRAFT, 'BROCHURES'], [1, '#C9A57A', 'ONE-PAGERS'], [2, KRAFT, 'CARDS']].forEach(function (b) { fillRR(g, ht + 4, 700 - b[0] * 34, 56, 32, 3, b[1]); fillRR(g, ht + 4, 700 - b[0] * 34, 56, 6, 2, KRAFT_D); text(g, b[2], ht + 32, 722 - b[0] * 34, 6, 800, '#5A3A1A', 'center'); });
      var bk = -750; g.save(); g.translate(bk, 742); soft(g, 0, 2, 70, 6, 0.25); g.strokeStyle = '#2A3142'; g.lineWidth = 4; [-40, 40].forEach(function (wx) { g.beginPath(); g.arc(wx, -26, 25, 0, 7); g.stroke(); });
      g.strokeStyle = TEAL; g.lineWidth = 5; g.beginPath(); g.moveTo(-40, -26); g.lineTo(-6, -26); g.lineTo(18, -58); g.lineTo(-20, -58); g.lineTo(-40, -26); g.moveTo(-6, -26); g.lineTo(-18, -64); g.moveTo(18, -58); g.lineTo(40, -26); g.moveTo(18, -58); g.lineTo(22, -74); g.stroke();
      fillRR(g, -28, -70, 20, 6, 3, '#2A3142'); g.save(); g.rotate(-0.5); fillRR(g, -10, -110, 12, 70, 6, RED); fillE(g, -4, -110, 6, 3, '#9A2A18'); g.restore(); g.restore();
      soft(g, -880, 744, 70, 6, 0.25); fillRR(g, -940, 700, 120, 44, 6, KRAFT); fillRR(g, -940, 700, 120, 8, 4, KRAFT_D); text(g, 'FONTS & LICENCES', -880, 730, 7.4, 800, '#5A3A1A', 'center'); }
    if (ext.r > 1150) { soft(g, 1230, 744, 60, 6, 0.25); fillRR(g, 1180, 690, 100, 54, 8, '#E9E4DA'); text(g, 'OFFCUTS', 1230, 722, 8, 800, '#7A869C', 'center'); }
    g.restore();
  }

  /* ---------------- live ---------------- */
  var TAP = {}, CARDS = [], FAN = [], STAMPT = -9, CATT = -9, PRINTT = -9;
  var LEV = { x: PR.x + PR.w - 2, y: 380 };
  function leverTip(pull) { var a = -1.5 + pull * 1.1; return [LEV.x + Math.cos(a) * 58, LEV.y + Math.sin(a) * 58]; }
  function line(t, y0, sag, e) { return function (x) { var span = 300, u = ((x % span) + span) % span / span; return y0 + Math.sin(u * Math.PI) * sag + Math.sin(t * 1.3 + x * 0.01) * 1.2; }; }
  function paintWindow(g, t, par, S) {
    var e = S.ext;
    for (var c = 0; c < 4; c++) { var sp = 3 + c * 1.5, span = e.r - e.l + 400, x = e.l - 200 + ((hash(c + 11) * span + t * sp) % span), y = -116 + c * 14 - (c % 2) * 20; K.cloud(g, x, y, 0.16 + hash(c + 3) * 0.08); }
    g.strokeStyle = 'rgba(40,60,90,.5)'; g.lineWidth = 1.4; g.lineCap = 'round';
    for (var b = 0; b < 3; b++) { var bsp = e.r - e.l + 300, bx = e.r + 100 - ((t * (15 + b * 4) + hash(b + 5) * bsp) % bsp), by = -110 + b * 12 + Math.sin(t + b) * 5, fl = Math.sin(t * 9 + b * 2) * 3.6;
      g.beginPath(); g.moveTo(bx - 5, by - fl); g.quadraticCurveTo(bx - 2.5, by - 2.5, bx, by); g.quadraticCurveTo(bx + 2.5, by - 2.5, bx + 5, by - fl); g.stroke(); }
  }
  function paintLive(g, t, now, S) {
    var e = S.ext;
    /* the drying lines and the prints pegged on them */
    var L1 = line(t, -130, 18, e), L2 = line(t, -74, 16, e), x0 = Math.floor(e.l / 300) * 300;
    g.strokeStyle = 'rgba(80,70,60,.6)'; g.lineWidth = 1.2; [L1, L2].forEach(function (L) { g.beginPath(); for (var x = e.l - 10; x < e.r + 10; x += 12) { if (x === e.l - 10) g.moveTo(x, L(x)); else g.lineTo(x, L(x)); } g.stroke(); });
    var kinds = ['brochure', 'onepager', 'poster', 'cards', 'post'], hotC = S.hot === 'collateral';
    for (var px = x0 + 26; px < e.r; px += 46) { var i = Math.round(px / 46), L = i % 2 ? L1 : L2, sw = Math.sin(t * 1.6 + i * 0.9) * 0.08, sc = 0.82 + (i % 2 ? 0 : 0.08);
      print(g, kinds[((i % 5) + 5) % 5], px, L(px) - 2, sc, i * 1.7, sw); if (hotC && ((i + Math.floor(t * 2)) % 5) === 0) { g.strokeStyle = 'rgba(232,69,44,.8)'; g.lineWidth = 2; rr(g, px - 26, L(px) + 2, 52, 56, 4); g.stroke(); } }
    /* the studio cat on the clerestory ledge: sleeps, stretches */
    var cx = 980, cy = WB1 + 1, ct = t - CATT, up = ct < 2.2 ? Math.sin(Math.min(1, ct / 0.6) * Math.PI / 2) : ((t % 14) > 12 ? Math.sin(((t % 14) - 12) / 2 * Math.PI) : 0);
    if (cx < e.r - 20) { g.save(); g.translate(cx, cy); fillE(g, 0, -8 - up * 4, 16, 9 + up * 2, '#F2A65A'); fillE(g, 13, -14 - up * 8, 7, 7, '#F2A65A'); g.fillStyle = '#F2A65A'; g.beginPath(); g.moveTo(9, -19 - up * 8); g.lineTo(11, -26 - up * 8); g.lineTo(15, -20 - up * 8); g.fill(); g.beginPath(); g.moveTo(15, -20 - up * 8); g.lineTo(19, -26 - up * 8); g.lineTo(19, -17 - up * 8); g.fill();
      g.strokeStyle = '#F2A65A'; g.lineWidth = 4; g.lineCap = 'round'; g.beginPath(); g.moveTo(-14, -6); g.quadraticCurveTo(-26, -4 + Math.sin(t * 2) * 4, -24, -16 + Math.sin(t * 2) * 3); g.stroke();
      g.strokeStyle = '#C97A34'; g.lineWidth = 1.2; [-6, 0, 6].forEach(function (d) { g.beginPath(); g.moveTo(d, -15 - up * 5); g.lineTo(d + 2, -9 - up * 3); g.stroke(); });
      if (up > 0.4) { fillE(g, 11, -15 - up * 8, 1.4, 1.4, INK); fillE(g, 16, -15 - up * 8, 1.4, 1.4, INK); } else { g.strokeStyle = INK; g.lineWidth = 1; g.beginPath(); g.moveTo(9.5, -14); g.lineTo(12.5, -14); g.moveTo(14.5, -14); g.lineTo(17.5, -14); g.stroke();
        if ((t % 3) < 2) text(g, 'z', 22 + (t % 3) * 4, -26 - (t % 3) * 6, 7, 800, 'rgba(60,70,90,.5)'); }
      g.restore(); }
    /* a wall clock over the press (the studio runs on Singapore time) */
    CO.clock(g, 680, 34, 15, 8, RED);
    /* the logo being drawn on the drafting sheet: arcs grow with the compass */
    var cyc = (t % 9) / 9; g.save(); g.translate(188, 318); g.rotate(-0.16);
    var hotL = S.hot === 'logo', full = hotL || (TAP.dsg && t - TAP.dsg < 3) ? 1 : smooth(cyc * 1.6);
    g.strokeStyle = 'rgba(49,103,202,.55)'; g.lineWidth = 1; g.setLineDash([2, 2]); g.beginPath(); g.arc(0, 0, 24, 0, Math.PI * 2 * Math.min(1, full * 1.4)); g.stroke(); g.setLineDash([]);
    if (full > 0.55) { g.save(); g.globalAlpha = clamp((full - 0.55) / 0.3, 0, 1); mark(g, 0, 0, 20, '#3167CA'); g.restore(); }
    g.restore();
    /* the guide book on the lectern: pages flip through the guideline */
    var pgI = Math.floor(t / 2.6) % 4, pgU = (t % 2.6) / 2.6, hotG = S.hot === 'guide'; if (hotG) pgI = Math.floor(t / 1.3) % 4;
    g.save(); g.translate(397, 272); fillRR(g, -46, -4, 92, 8, 3, '#7A3E2A');
    [-1, 1].forEach(function (d) { g.fillStyle = PAPER; g.beginPath(); g.moveTo(0, 2); g.lineTo(d * 44, -2); g.lineTo(d * 42, -38); g.lineTo(0, -34); g.closePath(); g.fill(); });
    g.fillStyle = 'rgba(0,0,0,.08)'; g.fillRect(-1, -34, 2, 36);
    var pn = PAGES[pgI]; text(g, pn, -22, -26, 6.4, 800, INK, 'center');
    if (pgI === 0) SW_COL.forEach(function (c, i) { fillRR(g, -38 + i * 9, -20, 7, 14, 1, c[0]); }); else if (pgI === 1) { text(g, 'Aa', -22, -8, 13, 800, INK, 'center'); } else if (pgI === 2) mark(g, -22, -13, 8, '#3167CA'); else { [4, 8, 16, 24].forEach(function (w, i) { fillRR(g, -38, -20 + i * 4, w, 2.4, 1, BLUE); }); }
    g.fillStyle = '#C9CED8'; for (var bl = 0; bl < 5; bl++) g.fillRect(6, -27 + bl * 5, bl % 2 ? 22 : 30, 1.6);
    if (pgU > 0.8) { var fu = (pgU - 0.8) / 0.2, fx = 44 * Math.cos(fu * Math.PI); g.fillStyle = '#FFFFFF'; g.beginPath(); g.moveTo(0, 2); g.lineTo(fx, -2 - Math.sin(fu * Math.PI) * 10); g.lineTo(fx * 0.95, -38 - Math.sin(fu * Math.PI) * 10); g.lineTo(0, -34); g.closePath(); g.fill(); g.strokeStyle = 'rgba(0,0,0,.08)'; g.stroke(); }
    g.restore();
    /* the press: the ink disc turns, the flywheel spins, a sheet slides out after every pull */
    var pull = OPR.pull || 0, px = PR.x, spin = S.spin = (S.spin || 0) + 0.02 + pull * 0.2;
    g.save(); g.translate(px + 58, 236); g.rotate(spin * 0.3); fillE(g, 0, 0, 30, 9, '#3A4458'); fillE(g, 0, -2, 28, 7.6, '#59607A'); g.fillStyle = 'rgba(232,69,44,.75)'; g.beginPath(); g.ellipse(0, -2, 24, 6, 0, 0, Math.PI); g.fill(); g.restore();
    g.strokeStyle = IRON_D; g.lineWidth = 4; g.beginPath(); g.moveTo(px + 30, 270); g.lineTo(px + 44 - pull * 10, 244 + pull * 30); g.moveTo(px + 86, 270); g.lineTo(px + 72 + pull * 10, 244 + pull * 30); g.stroke(); fillRR(g, px + 36 - pull * 8, 240 + pull * 30, 44 + pull * 16, 7, 3, '#1B1F2A');
    var fw = [px + 24, 412]; g.save(); g.translate(fw[0], fw[1]); g.rotate(spin); g.strokeStyle = '#59607A'; g.lineWidth = 4; g.beginPath(); g.arc(0, 0, 24, 0, 7); g.stroke(); g.lineWidth = 2.4; for (var sp2 = 0; sp2 < 6; sp2++) { g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(sp2 * Math.PI / 3) * 22, Math.sin(sp2 * Math.PI / 3) * 22); g.stroke(); } fillE(g, 0, 0, 5, 5, MUST); g.restore();
    var lt = leverTip(pull); g.strokeStyle = '#59607A'; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.moveTo(LEV.x, LEV.y); g.lineTo(lt[0], lt[1]); g.stroke(); fillE(g, LEV.x, LEV.y, 5, 5, IRON_D); fillE(g, lt[0], lt[1], 6, 6, RED);
    var pt = t - PRINTT; text(g, ['Letterhead', 'Quotation', 'Invoice'][Math.floor(Math.abs(PRINTT) / 2.4) % 3], px + 58, 300, 6.4, 800, '#7A869C', 'center');
    g.fillStyle = '#C9CED8'; for (var ln = 0; ln < 6; ln++) g.fillRect(px + 38, 308 + ln * 6, ln % 3 === 2 ? 22 : 40, 1.8); mark(g, px + 74, 296, 5, '#3167CA');
    if (pt < 1.2) { var su = smooth(pt / 1.2); g.save(); g.translate(lerp(px + 58, px + PR.w + 18, su), lerp(330, 362, su)); g.rotate(su * 0.12); fillRR(g, -18, -12, 36, 24, 1, PAPER); fillRR(g, -15, -9, 10, 4, 1, BLUE); g.fillStyle = '#C9CED8'; g.fillRect(-15, -2, 24, 1.6); g.fillRect(-15, 3, 18, 1.6); g.restore(); }
    if (S.hot === 'templates') { var ti = Math.floor(t * 1.4) % 6, tcx = TR.x + 8 + (ti % 2) * 70, tcy = TR.y + 10 + Math.floor(ti / 2) * 46; g.strokeStyle = 'rgba(232,69,44,.9)'; g.lineWidth = 2.4; rr(g, tcx - 2, tcy - 2, 68, 44, 4); g.stroke(); }
    /* the deck screen: master slides in turn */
    var si = Math.floor(t / 3) % SLIDES.length, sU = (t % 3) / 3; if (S.hot === 'decks') si = Math.floor(t / 1.4) % SLIDES.length; var X = SCR.x, Y = SCR.y, Wd = SCR.w, Hd = SCR.h;
    fillRR(g, X, Y, Wd, Hd, 2, '#FFFFFF'); fillRR(g, X, Y + Hd - 10, Wd, 10, 0, '#F1F4F8'); mark(g, X + Wd - 14, Y + Hd - 5, 3.4, '#3167CA'); text(g, (si + 1) + ' / ' + SLIDES.length, X + 8, Y + Hd - 2.6, 5.6, 700, '#7A869C');
    var sl = SLIDES[si];
    if (sl === 'title') { fillRR(g, X, Y, 64, Hd - 10, 0, '#3167CA'); mark(g, X + 32, Y + 40, 16, '#FFFFFF'); text(g, 'Company', X + 76, Y + 40, 13, 800, INK); text(g, 'profile', X + 76, Y + 56, 13, 800, INK); fillRR(g, X + 76, Y + 66, 60, 4, 2, MUST); }
    else if (sl === 'agenda') { text(g, 'Agenda', X + 12, Y + 22, 11, 800, INK); ['Who we are', 'What we do', 'How we work', 'Next steps'].forEach(function (a, i) { fillE(g, X + 16, Y + 36 + i * 15, 4, 4, [BLUE, RED, TEAL, MUST][i]); text(g, a, X + 26, Y + 39 + i * 15, 7.6, 700, '#3D4560'); }); }
    else if (sl === 'chart') { text(g, 'Proposal', X + 12, Y + 22, 11, 800, INK); [0.4, 0.6, 0.5, 0.85].forEach(function (v, i) { var bh = v * 60 * smooth(sU * 2.5); fillRR(g, X + 18 + i * 34, Y + 88 - bh, 22, bh, 2, i === 3 ? RED : '#BFD3F2'); }); }
    else if (sl === 'team') { text(g, 'Your team', X + 12, Y + 22, 11, 800, INK); for (var tm = 0; tm < 4; tm++) { fillE(g, X + 30 + tm * 38, Y + 52, 12, 12, CR.skin[tm]); fillE(g, X + 30 + tm * 38, Y + 45, 12, 6, CR.hair[tm % 4]); fillRR(g, X + 18 + tm * 38, Y + 68, 24, 10, 4, [BLUE, TEAL, MUST, RED][tm]); } }
    else { fillRR(g, X, Y, Wd, Hd - 10, 0, INK); text(g, 'Thank you', X + Wd / 2, Y + 44, 14, 800, '#FFFFFF', 'center'); mark(g, X + Wd / 2, Y + 66, 9, '#FFFFFF'); }
    if (sU > 0.88) { g.fillStyle = 'rgba(255,255,255,' + ((sU - 0.88) / 0.12 * 0.8).toFixed(2) + ')'; g.fillRect(X, Y, Wd, Hd); }
    /* the plan chest: during the hand-over its drawers slide open, the key glints */
    var hoff = S.hot === 'handover'; DRAWERS.forEach(function (n, i) { var o = hoff ? Math.max(0, Math.sin((t * 1.6 - i * 0.5))) * 10 : 0; if (o < 0.5) return; var dy = CH.y + 8 + i * 19; fillRR(g, CH.x + 6 - o, dy, CH.w - 12, 16, 2, '#6E93A4'); fillRR(g, CH.x + 12 - o, dy + 4, 50, 8, 1.5, '#FFF1D0'); text(g, n, CH.x + 37 - o, dy + 10.4, 5.4, 800, '#3A2A1A', 'center'); });
    var kx = CH.x + 90, ky = CH.y - 30, kg = (t % 4) < 0.5; g.save(); g.translate(kx, ky); g.rotate(-0.5 + Math.sin(t * 1.2) * 0.05); g.strokeStyle = '#C9A44A'; g.lineWidth = 4; g.beginPath(); g.arc(0, -14, 9, 0, 7); g.stroke(); fillRR(g, -2, -6, 4, 30, 2, '#C9A44A'); fillRR(g, 2, 14, 8, 4, 1, '#C9A44A'); fillRR(g, 2, 20, 6, 4, 1, '#C9A44A');
    if (kg || hoff) { g.fillStyle = 'rgba(255,255,255,.9)'; g.beginPath(); for (var kk = 0; kk < 8; kk++) { var a = kk * Math.PI / 4, rd = kk % 2 ? 2 : 6; g.lineTo(-6 + Math.cos(a) * rd, -18 + Math.sin(a) * rd); } g.closePath(); g.fill(); } g.restore();
    g.strokeStyle = RED; g.lineWidth = 3; g.beginPath(); g.moveTo(kx - 4, ky - 22); g.quadraticCurveTo(kx - 20, ky - 30, kx - 26, ky - 14); g.stroke();
    fitCrew(S); CO.crew(CREW, g, t, S, false);
  }
  function paintFrontLive(g, t, S) {
    /* the logo stamp on its side table: idle, or thumping when tapped */
    var su = t - STAMPT, st = STAMP, lift = su < 1.4 ? (su < 0.3 ? -su / 0.3 * 26 : su < 0.45 ? -26 + (su - 0.3) / 0.15 * 30 : 4 - (su - 0.45) * 4) : 0;
    g.save(); g.translate(st.x, st.y - 12 + Math.min(0, lift)); fillRR(g, -11, -6, 22, 8, 2, '#3A4458'); fillRR(g, -4, -26, 8, 22, 3, '#B07A4A'); fillE(g, 0, -28, 9, 7, RED); fillE(g, -3, -30, 3, 2, 'rgba(255,255,255,.5)'); g.restore();
    if (su > 0.42 && su < 2.2) { g.save(); g.globalAlpha = clamp(2.2 - su, 0, 1); var ring = (su - 0.42) * 60; g.strokeStyle = 'rgba(232,69,44,.6)'; g.lineWidth = 2; g.beginPath(); g.ellipse(st.x, st.y - 4, 14 + ring, 4 + ring * 0.25, 0, 0, 7); g.stroke(); mark(g, st.x, st.y - 40 - (su - 0.42) * 20, 12, '#3167CA'); g.restore(); }
    props(g, t, S);
    CO.crew(CREW, g, t, S, true);
    /* the finishing table: the trimmer's blade, the card stack, the juggled ink tins */
    var tb = FT.x + 8 + (FIN.trim || 0) * 84; fillRR(g, tb - 6, FT.y - 12, 14, 10, 3, RED); fillE(g, tb + 1, FT.y - 3, 5, 5, '#C9D3DE');
    var fa = handAt(FIN, 0), fb = handAt(FIN, 1);
    if (FIN.stack) { var sx3 = (fa[0] + fb[0]) / 2, sy3 = Math.min(fa[1], fb[1]) - 4; for (var cs = 0; cs < 5; cs++) fillRR(g, sx3 - 14, sy3 - cs * 2.2, 28, 16, 1.5, cs % 2 ? '#FFFFFF' : '#F4F0E8'); fillRR(g, sx3 - 14, sy3 - 9, 28, 4, 1.5, BLUE); mark(g, sx3 + 8, sy3 - 1, 3.4, BLUE); }
    if (FIN.juggle != null) { [CYAN, MAG, YEL].forEach(function (c, i) { var a = FIN.juggle * 7 + i * 2.09, jx = FIN.x + Math.cos(a) * 34, jy = FIN.y - 300 + Math.sin(a) * 26 - Math.abs(Math.sin(a)) * 30;
      fillRR(g, jx - 9, jy - 10, 18, 20, 3, '#D5DAE0'); fillRR(g, jx - 9, jy - 4, 18, 8, 1, c); fillRR(g, jx - 10, jy - 13, 20, 5, 2, '#AEB6C2'); }); }
    if (FIN.loupe) { g.save(); g.translate(fb[0], fb[1] - 8); g.strokeStyle = SLATE; g.lineWidth = 2; g.beginPath(); g.moveTo(0, 0); g.lineTo(-6, 10); g.stroke(); g.fillStyle = 'rgba(205,232,246,.85)'; g.beginPath(); g.arc(0, -4, 7, 0, 7); g.fill(); g.strokeStyle = MUST; g.lineWidth = 2; g.stroke();
      [CYAN, MAG, YEL].forEach(function (c, k) { fillE(g, -3 + k * 3, -4, 1.4, 1.4, c); }); g.restore(); }
    /* flying business cards and the swatch fan */
    CARDS = CARDS.filter(function (c) { return t - c.t0 < 1.6; }); CARDS.forEach(function (c) { var u = t - c.t0; if (u < 0) return; g.save(); g.translate(c.x + c.vx * u, c.y + c.vy * u + 150 * u * u); g.rotate(u * c.r); g.globalAlpha = clamp(1.6 - u, 0, 1); fillRR(g, -9, -5.5, 18, 11, 1, '#FFFFFF'); g.strokeStyle = 'rgba(0,0,0,.12)'; g.lineWidth = 0.6; rr(g, -9, -5.5, 18, 11, 1); g.stroke(); mark(g, -4, 0, 3, c.c); g.restore(); });
    if (TAP.gkp && t - TAP.gkp < 2.6) { var u2 = clamp((t - TAP.gkp - 0.3) / 0.8, 0, 1), hp = handAt(GKP, 1), cols = [BLUE, '#1F1F3D', '#D69A00', RED, TEAL, MAG, CYAN];
      g.save(); g.translate(hp[0], hp[1]); cols.forEach(function (c, i) { g.save(); g.rotate(-1.4 + i * 0.22 * u2); fillRR(g, -4, -50, 12, 48, 3, c); fillRR(g, -4, -12, 12, 10, 2, '#FFFFFF'); g.restore(); }); fillE(g, 0, 0, 4, 4, '#C9A44A'); g.restore(); }
  }
  function props(g, t, S) {
    /* the designer's compass (or the finished mark held up) */
    var hl = handAt(DSG, 0);
    if (TAP.dsg && t - TAP.dsg < 3 && t - TAP.dsg > 1.1) { var hr = handAt(DSG, 1); g.save(); g.translate(hr[0], hr[1] - 26); fillRR(g, -22, -22, 44, 44, 3, PAPER); mark(g, 0, 0, 14, '#3167CA'); g.restore(); }
    else { g.save(); g.translate(hl[0], hl[1]); g.rotate(-0.4 + Math.sin(t * 2.4) * 0.5); g.strokeStyle = '#7A869C'; g.lineWidth = 2; g.beginPath(); g.moveTo(0, -10); g.lineTo(-6, 12); g.moveTo(0, -10); g.lineTo(6, 12); g.stroke(); fillE(g, 0, -11, 3, 3, '#C9A44A'); g.restore(); }
    /* her coffee steams on the stool-side ledge */
    for (var s = 0; s < 2; s++) { var u = (t * 0.6 + s * 0.5) % 1; g.strokeStyle = 'rgba(160,150,140,' + (0.5 * (1 - u)).toFixed(2) + ')'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(244 + s * 6, 360 - u * 20); g.quadraticCurveTo(248 + s * 6, 354 - u * 20, 244 + s * 6, 348 - u * 20); g.stroke(); }
    fillRR(g, 240, 362, 14, 13, 3, '#FFFFFF'); fillRR(g, 240, 362, 14, 4, 2, RED);
    /* the guide keeper's loupe */
    if (GKP.loupe) { var hg = handAt(GKP, 1); g.strokeStyle = '#3A4458'; g.lineWidth = 2.4; g.beginPath(); g.arc(hg[0], hg[1] - 8, 6, 0, 7); g.stroke(); g.fillStyle = 'rgba(200,230,255,.5)'; g.fill(); fillRR(g, hg[0] - 1.5, hg[1] - 2, 3, 8, 1.5, '#3A4458'); }
    if (GKP.chip) { var hc = handAt(GKP, 1); fillRR(g, hc[0] - 8, hc[1] - 18, 16, 22, 2, '#FFFFFF'); fillRR(g, hc[0] - 6, hc[1] - 16, 12, 12, 1, GKP.chip); }
    /* the printer's sheet held to the light */
    if (OPR.sheet) { var ho = handAt(OPR, 1); g.save(); g.translate(ho[0], ho[1] - 20); g.rotate(0.1); fillRR(g, -16, -22, 32, 42, 1, PAPER); fillRR(g, -12, -18, 10, 4, 1, BLUE); g.fillStyle = '#C9CED8'; for (var q = 0; q < 5; q++) g.fillRect(-12, -10 + q * 5, 22, 1.6); g.restore(); }
    /* the presenter's clicker */
    var hp = handAt(PRS, 1); fillRR(g, hp[0] - 3, hp[1] - 10, 6, 13, 2, '#2A3142'); if ((t % 3) > 2.85) fillE(g, hp[0], hp[1] - 11, 2, 2, RED);
    /* the client's concept cards A, B, C */
    var cl = handAt(CLT, 0), cr = handAt(CLT, 1), pick = CLT.pick;
    if (TAP.clt && t - TAP.clt < 2.4) { g.save(); g.translate(cr[0], cr[1] - 24); g.rotate(-0.1); fillRR(g, -15, -20, 30, 40, 2, PAPER); mark(g, 0, -3, 9, '#3167CA'); text(g, 'B', 0, 15, 8, 800, RED, 'center'); g.restore(); }
    else { ['A', 'B', 'C'].forEach(function (l, i) { var h = i < 2 ? cl : cr, off = i === 1 ? 10 : 0; if (pick === i) return; g.save(); g.translate(h[0] + (i - 1) * 10, h[1] - 16 - off); g.rotate((i - 1) * 0.18); fillRR(g, -11, -15, 22, 30, 2, PAPER); g.strokeStyle = 'rgba(0,0,0,.12)'; g.lineWidth = 0.6; rr(g, -11, -15, 22, 30, 2); g.stroke();
        if (i === 0) { g.strokeStyle = INK; g.lineWidth = 1.6; g.beginPath(); g.arc(0, -3, 6, 0.5, 5.6); g.stroke(); } else if (i === 1) mark(g, 0, -3, 7, '#3167CA'); else { fillRR(g, -6, -9, 12, 12, 2, INK); } text(g, l, 0, 11, 6.4, 800, '#7A869C', 'center'); g.restore(); });
      if (pick != null) { g.save(); g.translate(cr[0], cr[1] - 36); fillRR(g, -13, -18, 26, 36, 2, PAPER); mark(g, 0, -3, 8, '#3167CA'); text(g, ['A', 'B', 'C'][pick], 0, 13, 7, 800, RED, 'center'); g.restore(); } }
  }

  /* ---------------- the cast: an idle loop and a tap choreography each ---------------- */
  function tapped(id, st, t) { if (st.wave && st.wave !== st._my) { st._my = st.wave; TAP[id] = t; return true; } return false; }
  function lookAtNexi(P, st, t, S, base) { P.look = lerp(P.look, t < st.until ? clamp((S.nexi.x - P.x) / 160, -1, 1) : base, 0.08); }
  var castFIN = { id: 'fin', behind: true, keys: ['collateral'], P: FIN, act: function (P, t, S) {
    P.tilt = 0; P.hop = 0; P.stack = false; P.juggle = null; P.loupe = false; P.trim = 0.1;
    if (TAP.fin && t - TAP.fin < 3) { var u = (t - TAP.fin) / 3; P.talk = true; P.mood = 'happy'; P.juggle = u * 3; var j = Math.sin(t * 14); P.hands = [[-50 + j * 14, -330 - Math.max(0, j) * 30], [50 - j * 14, -330 - Math.max(0, -j) * 30]]; P.look = 0; P.hop = Math.abs(Math.sin(u * Math.PI * 3)) * 4; return; }
    var c = (t + 3) % 13, busy = S.hot === 'collateral'; P.talk = busy; P.mood = busy ? 'happy' : 'calm';
    if (c < 4.5) { var sw = (Math.sin(t * 2.4) + 1) / 2; P.trim = sw; P.hands = [[-40, -232], [-170 + sw * 180, -238]]; P.look = lerp(P.look, -0.4 + sw * 0.6, 0.1); }
    else if (c < 7.5) { P.stack = true; var tap2 = Math.abs(Math.sin(t * 7)); P.hands = [[-30, -250 + tap2 * 10], [30, -250 + tap2 * 10]]; P.look = lerp(P.look, 0, 0.1); }
    else if (c < 10.5) { P.loupe = true; P.hands = [[-50, -232], [30, -300]]; P.look = lerp(P.look, 0.2, 0.1); P.tilt = 0.05; }
    else { P.stack = true; P.hands = [[-30, -300], [30, -300]]; P.look = lerp(P.look, 0.7, 0.08); P.mood = 'happy'; }
  } };
  var castDSG = { id: 'dsg', behind: true, keys: ['logo'], P: DSG, act: function (P, t, S) {
    var st = S.cast.dsg; if (tapped('dsg', st, t)) CR.burst('spark', P.x, P.y - 300, t);
    P.tilt = 0; P.hop = 0; P.sx = 1;
    if (TAP.dsg && t - TAP.dsg < 3) { var u = (t - TAP.dsg) / 3; P.talk = true; P.mood = 'happy';
      if (u < 0.37) { P.sx = Math.cos(u / 0.37 * Math.PI * 2); P.hands = [[-90, -260], [90, -260]]; } else { P.hands = [[-60, -220], [40, -380]]; P.look = 0.3; if (!TAP.dsgB) { TAP.dsgB = true; CR.burst('star', P.x + 20, P.y - 360, t); } } return; }
    TAP.dsgB = false;
    var c = t % 9, a = t * 2.4; P.talk = t < st.until || S.hot === 'logo';
    if (c < 6) { P.hands = [[-140 + Math.cos(a) * 18, -330 + Math.sin(a) * 14], [40, -200]]; P.mood = 'calm'; P.tilt = -0.04; lookAtNexi(P, st, t, S, -0.8); }
    else if (c < 7.6) { P.hands = [[-60, -220], [30, -300]]; P.mood = 'calm'; P.tilt = 0.05; lookAtNexi(P, st, t, S, -0.5); }
    else { P.hands = [[-50, -200], [60, -250]]; P.mood = 'happy'; lookAtNexi(P, st, t, S, 0.4); }
  } };
  var castGKP = { id: 'gkp', behind: true, keys: ['guide'], P: GKP, act: function (P, t, S) {
    var st = S.cast.gkp; if (tapped('gkp', st, t)) CR.burst('spark', P.x, P.y - 300, t);
    P.tilt = 0; P.hop = 0; P.sx = 1; P.loupe = false; P.chip = null;
    if (TAP.gkp && t - TAP.gkp < 2.6) { var u = (t - TAP.gkp) / 2.6; P.talk = true; P.mood = 'happy'; P.hands = [[-60, -200], [50, -400]]; P.hop = Math.sin(u * Math.PI) * 12; P.look = 0.2; return; }
    var c = t % 10; P.talk = t < st.until || S.hot === 'guide';
    if (c < 4) { var fl = (t % 2.6) / 2.6; P.hands = [[-140 + (fl > 0.8 ? (fl - 0.8) * 200 : 0), -400], [60, -200]]; P.mood = 'calm'; lookAtNexi(P, st, t, S, -0.7); }
    else if (c < 7) { P.loupe = true; P.hands = [[-60, -200], [30, -390]]; P.mood = 'calm'; P.tilt = -0.05; lookAtNexi(P, st, t, S, -0.4); }
    else { P.chip = SW_COL[Math.floor(t / 10) % 4][0]; P.hands = [[-60, -200], [90, -330]]; P.mood = 'happy'; lookAtNexi(P, st, t, S, 0.5); }
  } };
  var castOPR = { id: 'opr', behind: true, keys: ['templates'], P: OPR, act: function (P, t, S) {
    var st = S.cast.opr; if (tapped('opr', st, t)) { for (var i = 0; i < 18; i++) CARDS.push({ x: PR.x + PR.w + 10, y: 350, vx: (Math.random() - 0.3) * 160, vy: -120 - Math.random() * 120, t0: t + 0.4 + i * 0.03, r: (Math.random() - 0.5) * 12, c: [BLUE, RED, TEAL, MUST][i % 4] }); }
    P.tilt = 0; P.hop = 0; P.sx = 1; P.sheet = false;
    var tapA = TAP.opr && t - TAP.opr < 2.4, rate = tapA ? 2.2 : 0.42, ph = (t * rate) % 1, pl = ph < 0.4 ? Math.sin(ph / 0.4 * Math.PI) : 0;
    if (!tapA && (t % 12) > 9.4) { P.pull = lerp(P.pull || 0, 0, 0.2); P.sheet = true; P.hands = [[-60, -200], [40, -380]]; P.mood = 'happy'; P.talk = t < st.until || S.hot === 'templates'; P.look = 0.2; lookAtNexi(P, st, t, S, 0.3); return; }
    P.pull = pl; if (ph > 0.38 && ph < 0.42 && t - PRINTT > 0.5) PRINTT = t;
    var tip = leverTip(pl); P.hands = [[(tip[0] - P.x) / P.s, (tip[1] - P.y) / P.s], [60, -180]]; P.mood = tapA ? 'happy' : 'calm'; P.talk = tapA || t < st.until || S.hot === 'templates'; P.hop = tapA ? Math.abs(Math.sin(t * 10)) * 6 : 0; P.tilt = pl * 0.05;
    lookAtNexi(P, st, t, S, -0.6);
  } };
  var castPRS = { id: 'prs', behind: true, keys: ['decks'], P: PRS, act: function (P, t, S) {
    var st = S.cast.prs; if (tapped('prs', st, t)) { for (var i = 0; i < 5; i++) FAN.push(t); CR.burst('star', P.x, P.y - 320, t); }
    P.tilt = 0; P.hop = 0; P.sx = 1;
    if (TAP.prs && t - TAP.prs < 2.6) { var u = (t - TAP.prs) / 2.6; P.talk = true; P.mood = 'happy';
      if (u < 0.5) { P.hands = [[-150, -360 + Math.sin(t * 10) * 10], [150, -360 - Math.sin(t * 10) * 10]]; P.look = 0; } else { P.tilt = Math.sin((u - 0.5) / 0.5 * Math.PI) * 0.22; P.hands = [[-40, -200], [60, -230]]; P.look = 0; } return; }
    var c = t % 6; P.talk = t < st.until || S.hot === 'decks' || c < 3;
    if (c < 3) { P.hands = [[-60, -360 + Math.sin(t * 3) * 20], [60, -220]]; P.mood = 'happy'; lookAtNexi(P, st, t, S, 0.2); }
    else { P.hands = [[-70, -170], [70, -230 - ((t % 3) > 2.8 ? 10 : 0)]]; P.mood = 'calm'; lookAtNexi(P, st, t, S, -0.6); }
  } };
  var castCLT = { id: 'clt', behind: true, keys: ['handover'], P: CLT, act: function (P, t, S) {
    var st = S.cast.clt; if (tapped('clt', st, t)) CR.burst('heart', P.x, P.y - 320, t);
    P.tilt = 0; P.hop = 0; P.sx = 1; P.pick = null;
    if (TAP.clt && t - TAP.clt < 2.4) { var u = (t - TAP.clt) / 2.4; P.talk = true; P.mood = 'happy'; P.hands = [[-90, -300], [40, -400]]; P.hop = Math.abs(Math.sin(u * Math.PI * 3)) * 16; return; }
    var c = t % 11; P.talk = t < st.until || S.hot === 'handover';
    if (c < 4) { var sh = Math.sin(t * 4); P.hands = [[-40 + sh * 8, -250], [40 - sh * 8, -250]]; P.mood = 'calm'; lookAtNexi(P, st, t, S, -0.2); }
    else if (c < 6.5) { P.hands = [[-40, -250], [30, -330]]; P.tilt = -0.07; P.mood = 'calm'; lookAtNexi(P, st, t, S, -0.6); }
    else { P.pick = 1; P.hands = [[-40, -250], [60, -390]]; P.mood = 'happy'; P.talk = P.talk || c < 8; lookAtNexi(P, st, t, S, 0.3); }
  } };

  window.IXW.worlds['sol-brand'] = {
    calmView: [120,-60,880,704], /* CALM: the framed part of the set */
    pan: [-300, 1260],
    paintBg: paintBg, windowBehind: true, paintFrame: paintFrame, paintBack: paintBack, paintFront: paintFront, paintFore: paintFore,
    paintWindow: paintWindow, paintLive: paintLive, paintFrontLive: paintFrontLive,
    paintForeLive: function (g, t, S) {
      /* the deck fan from the presenter's tap */
      FAN = FAN.filter(function (f) { return t - f < 1.8; }); if (FAN.length) { var u = clamp((t - FAN[0]) / 0.6, 0, 1), a = 1 - clamp((t - FAN[0] - 1.2) / 0.6, 0, 1);
        g.save(); g.globalAlpha = a; g.translate(SCR.x + SCR.w / 2, SCR.y + SCR.h + 40); for (var i = 0; i < 5; i++) { g.save(); g.rotate((i - 2) * 0.22 * u); fillRR(g, -30, -84, 60, 38, 3, '#FFFFFF'); g.strokeStyle = 'rgba(0,0,0,.12)'; g.lineWidth = 0.8; rr(g, -30, -84, 60, 38, 3); g.stroke(); fillRR(g, -30, -84, 18, 38, 3, [BLUE, RED, TEAL, MUST, INK][i]); g.restore(); } g.restore(); }
      K.zfore(g, t, S, [], function () { CO.crew(CREW, g, t, S, 'fore'); }); CR.draw(g, t);
    },
    moteCol: 'rgba(255,248,220,.75)',
    glow: {
      logo: function (g) { rr(g, PIN.x - 14, PIN.y - 14, PIN.w + 28, PIN.h + 28, 12); },
      guide: function (g) { rr(g, SW.x - 12, SW.y - 12, SW.w + 24, SW.h + 24, 12); },
      templates: function (g) { rr(g, TR.x - 12, TR.y - 20, TR.w + 24, TR.h + 32, 12); },
      decks: function (g) { rr(g, SCR.x - 16, SCR.y - 32, SCR.w + 32, SCR.h + 48, 12); },
      collateral: function (g) { rr(g, 420, -160, 520, 150, 16); },
      handover: function (g) { rr(g, CH.x - 14, CERT.y - 14, CH.w + 28, F - CERT.y + 18, 14); },
      stamp: function (g) { rr(g, STAMP.x - 22, STAMP.y - 48, 44, 56, 14); }
    },
    backGlow: ['logo', 'guide', 'templates', 'decks', 'collateral', 'handover'],
    cast: [castFIN, castDSG, castGKP, castOPR, castPRS, castCLT],
    toy: function (name, S, t) { if (name === 'stamp') { STAMPT = t; CR.burst('star', STAMP.x, STAMP.y - 40, t); } },
    hit: function (x, y, S, t, onBtn) {
      var w = CR.hitWalker(x, y, t); if (w) return w; if (onBtn) return null;
      if (Math.abs(x - FIN.x) < 50 && y > 250 && y < FT.y + 30) { TAP.fin = t; CR.burst('star', FIN.x, 250, t); return { say: 'Cyan, magenta, yellow: the finishing table checks every colour against the **guideline** before anything is trimmed.', near: [80, 20], pose: 'wow', who: 'TechNext finisher' }; }
      if (Math.abs(x - 990) < 30 && y > WB1 - 34 && y < WB1 + 4) { CATT = t; return { say: 'The studio cat approves of the **paper stock**. Mostly for sleeping on.', near: [620, -60], pose: 'love', who: 'The studio cat' }; }
      if (y > -160 && y < 0) { var L = Math.round(x / 46); CR.burst('spark', x, y, t); return { say: ['A **brochure**, drying: laid out for print and PDF.', 'A **one-pager**: a service sheet in your brand.', 'A **campaign poster**, built in the same system.', 'A sheet of **business cards**, fresh off the press.', 'A **social post**, from the template set.'][((L % 5) + 5) % 5], near: [620, -60], pose: 'wow', who: 'On the drying line' }; }
      return null;
    },
    onStop: function (key, S, t) { S.kT = t; if (key === 'templates') PRINTT = t; if (key === 'logo') TAP.dsg = -9; }
  };
})(window.IXW && window.IXW.kit, window.CR, window.CO);
