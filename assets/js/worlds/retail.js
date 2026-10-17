/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: retail (/industries/retail) — Harbour Goods, a sample homeware store, drawn as the SHOP FLOOR on a sunny morning.
   A cream wall with sage pinstripes and a terracotta wainscot over an oak floor. On the left, the glass shop door looks out
   on the street (a café awning across the road, people walking by, now and then a transfer van; tap the street to call
   it), with the OPEN sign hanging on the glass and the door bell above (both tappable). Next to it the shelving, stocked with
   mugs, candles and throws, its shelf labels flipping when goods are scanned in (Inventory); the counter with the till
   (Point of Sale), the barcode scanner (tap it), the card terminal and the receipt printer, whose roll prints the day's
   takings on the Close stop (Accounting); the click-and-collect cubbies on the wall (eCommerce); a blue transfer tote
   bound for another store (transfers) and supplier cartons on a hand truck with the purchase order taped on (Purchase).
   Staff: Ana at the till (sample); Raj, a shopper with his bags at the counter, collecting an online order (sample). */
(function (K) {
  'use strict';
  if (!K) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed, tone = K.tone;
  var F = 470;
  var T = {
    door: { x: 116, y: 118, w: 160, h: 352 }, sign: { x: 196, y: 200 }, bell: { x: 196, y: 96 },
    shelf: { x: 290, y: 150, w: 136, h: 320 }, logo: { x: 650, y: 30, w: 216, h: 64 },
    counter: { x: 556, y: 332, w: 252 }, till: { x: 572, y: 262 }, scan: { x: 666, y: 318 }, term: { x: 718, y: 296 }, printer: { x: 756, y: 302 },
    cubby: { x: 832, y: 126, w: 158, h: 164 }, tote: { x: 824, y: 470 }, cartons: { x: 906, y: 470 }, lamps: [358, 920]
  };
  var C = { terra: '#D9785A', terraD: '#B95E43', peach: '#F2B8A0', sage: '#81B29A', sageD: '#5E8F77', cream: '#FBF3E6', ink: '#3D405B', oak: '#D9B48A', oakD: '#B98E62', kraft: '#C99A6B' };
  function stripes(g, W, ry, k, sx) { g.fillStyle = 'rgba(129,178,154,.17)'; var step = 34 * k; for (var x = (sx % step) - step; x < W; x += step) g.fillRect(x, 0, 3 * k, ry - 7 * k); }
  var ROOM = { wall: ['#FCF6EE', '#F6E8D7'], wains: ['#F0D0BC', '#E8BCA3'], rail: '#FFF9F2', base: '#D6A385', floor: ['#EBD5B8', '#D9BB96'], floorKind: 'planks',
    floorLine: 'rgba(130,85,45,.15)', panelLine: 'rgba(170,90,60,.10)', pattern: stripes };


  /* ---------------- beyond the frame: the rest of the shop (ext = the whole hero in set units) ----------------
     Left of the door: the display window onto the street with two mannequins; further left the clothing rail, the
     fitting room and a mirror. Right: baskets and a plant. Foreground: a display table, a big plant. Shoppers walk. */
  var WIN = { x: -320, y: 96, w: 400, h: 300 };
  function mannequin(g, x, y, top, skirt) { fillRR(g, x - 3, y - 6, 6, 8, 2, '#B9A58A'); fillRR(g, x - 22, y - 2, 44, 6, 3, '#B9A58A'); g.fillStyle = '#E8DCCB'; g.fillRect(x - 3, y - 80, 6, 78);
    fillRR(g, x - 26, y - 190, 52, 80, 18, top); if (skirt) { g.fillStyle = skirt; g.beginPath(); g.moveTo(x - 26, y - 118); g.lineTo(x + 26, y - 118); g.lineTo(x + 36, y - 66); g.lineTo(x - 36, y - 66); g.closePath(); g.fill(); }
    fillE(g, x, y - 206, 15, 17, '#E8DCCB'); fillRR(g, x - 6, y - 192, 12, 8, 3, '#E8DCCB'); }
  function wideBack(g, ext) {
    /* bunting across the shop and pendant lamps beyond the frame */
    var by = Math.max(ext.t + 30, -40), cols = [C.terra, C.sage, '#E9C46A', '#7FA8C9'];
    g.strokeStyle = '#B9A58A'; g.lineWidth = 1.4; g.beginPath(); for (var bx = ext.l; bx < ext.r; bx += 40) { var sag = Math.sin((bx - ext.l) / 240 * Math.PI) * 14; if (bx === ext.l) g.moveTo(bx, by + sag); else g.lineTo(bx, by + sag); } g.stroke();
    for (var fx = ext.l + 10, i = 0; fx < ext.r; fx += 40, i++) { var s2 = Math.sin((fx - ext.l) / 240 * Math.PI) * 14; g.fillStyle = cols[i % 4]; g.beginPath(); g.moveTo(fx, by + s2); g.lineTo(fx + 24, by + s2); g.lineTo(fx + 12, by + s2 + 22); g.closePath(); g.fill(); }
    [-760, -360, 1120].forEach(function (lx) { if (lx < ext.l || lx > ext.r) return; g.fillStyle = '#8A7F6E'; g.fillRect(lx - 1, by, 2, 70 - by); g.fillStyle = C.sage; g.beginPath(); g.moveTo(lx - 24, 96); g.quadraticCurveTo(lx - 22, 70, lx, 70); g.quadraticCurveTo(lx + 22, 70, lx + 24, 96); g.closePath(); g.fill(); fillE(g, lx, 100, 8, 5, '#FFF2CF'); });
    var w = WIN;
    if (ext.l < w.x + w.w) { /* the display window: the street outside, a decal, the mannequins */
      shadowed(g, 12, 4, 0.16, function () { fillRR(g, w.x - 10, w.y - 10, w.w + 20, w.h + 20, 8, '#F3E6D2'); }); fillRR(g, w.x, w.y, w.w, w.h, 4, C.sageD);
      var sk = g.createLinearGradient(0, w.y, 0, w.y + w.h); sk.addColorStop(0, '#BFE3F3'); sk.addColorStop(0.55, '#EAF6FB'); sk.addColorStop(0.56, '#D9C9B4'); sk.addColorStop(1, '#CFC1AE'); g.fillStyle = sk; g.fillRect(w.x + 8, w.y + 8, w.w - 16, w.h - 16);
      [[w.x + 20, 140, '#D98E73'], [w.x + 150, 110, '#C9B79C'], [w.x + 270, 150, '#9DBFA4']].forEach(function (b) { fillRR(g, b[0], w.y + 8 + (180 - b[1]), 118, b[1], 2, b[2]); g.fillStyle = '#F6E7D2'; for (var r = 0; r < 3; r++) for (var c = 0; c < 3; c++) g.fillRect(b[0] + 12 + c * 36, w.y + 30 + (180 - b[1]) + r * 34, 22, 22); });
      g.fillStyle = '#A9A39A'; g.fillRect(w.x + 8, w.y + 188, w.w - 16, 18); g.fillStyle = '#E3D9CB'; g.fillRect(w.x + 8, w.y + 206, w.w - 16, w.h - 214);
      g.fillStyle = 'rgba(255,255,255,.25)'; g.beginPath(); g.moveTo(w.x + 40, w.y + w.h - 8); g.lineTo(w.x + 200, w.y + 8); g.lineTo(w.x + 260, w.y + 8); g.lineTo(w.x + 100, w.y + w.h - 8); g.closePath(); g.fill();
      g.fillStyle = 'rgba(255,255,255,.9)'; g.font = '800 22px "Plus Jakarta Sans", Inter, sans-serif'; g.textAlign = 'center'; g.fillText('NEW SEASON', w.x + w.w / 2, w.y + 54); g.font = '700 10px "Plus Jakarta Sans", Inter, sans-serif'; g.fillText('HOMEWARE · LINEN · CERAMICS', w.x + w.w / 2, w.y + 72); g.textAlign = 'left';
      fillRR(g, w.x - 6, w.y + w.h + 4, w.w + 12, 70, 6, '#E9D2B4'); fillRR(g, w.x + 20, F - 12, w.w - 40, 12, 4, C.oak);
      mannequin(g, w.x + 110, F - 14, C.sage, null); mannequin(g, w.x + 290, F - 14, '#F3DCC0', C.terra);
      fillRR(g, w.x + 170, F - 74, 60, 60, 6, C.oakD); fillRR(g, w.x + 176, F - 68, 48, 20, 3, '#F4E4CC'); mug(g, w.x + 182, F - 74, C.terra); mug(g, w.x + 204, F - 74, C.sage);
    }
    if (ext.l < -420) { /* the clothing rail with hangers, the fitting room, a mirror */
      var rx = -820; g.fillStyle = '#8A7F6E'; g.fillRect(rx, 230, 6, F - 230); g.fillRect(rx + 230, 230, 6, F - 230); fillRR(g, rx - 4, 226, 244, 8, 4, '#8A7F6E');
      ['#D9785A', '#81B29A', '#F3DCC0', '#7FA8C9', '#E9C46A', '#D9785A', '#5E8F77', '#F6CDBB'].forEach(function (col, i) { var hx = rx + 18 + i * 27; g.strokeStyle = '#6B6B6B'; g.lineWidth = 1.6; g.beginPath(); g.arc(hx + 10, 236, 4, Math.PI, 0); g.stroke();
        g.fillStyle = col; g.beginPath(); g.moveTo(hx, 246); g.lineTo(hx + 20, 246); g.lineTo(hx + 24, 330 - (i % 3) * 14); g.lineTo(hx - 4, 330 - (i % 3) * 14); g.closePath(); g.fill(); g.fillStyle = 'rgba(255,255,255,.2)'; g.fillRect(hx + 8, 248, 3, 60); });
      fillRR(g, rx + 4, F - 10, 228, 10, 3, '#B9A58A'); soft(g, rx + 118, F + 4, 120, 8, 0.2);
      var fx = -540; fillRR(g, fx, 150, 120, 320, 6, C.oakD); fillRR(g, fx + 8, 158, 104, 312, 4, '#F4E4CC'); g.fillStyle = C.terra; g.beginPath(); g.moveTo(fx + 8, 170);
      for (var cu = 0; cu <= 8; cu++) g.lineTo(fx + 8 + cu * 9, 170 + (cu % 2 ? 6 : 0)); g.lineTo(fx + 80, F); g.lineTo(fx + 8, F); g.closePath(); g.fill(); g.fillStyle = '#8A7F6E'; g.fillRect(fx + 4, 162, 112, 5);
      fillRR(g, fx + 20, 120, 80, 24, 5, C.ink); text(g, 'FITTING ROOM', fx + 60, 136, 8.5, 800, '#FFFFFF', 'center');
    }
    if (ext.r > 1010) { /* baskets and a plant by the right wall */
      var bx = 1040; for (var bk = 0; bk < 4; bk++) { fillRR(g, bx, F - 26 - bk * 12, 70, 26, 5, C.terra); g.strokeStyle = C.terraD; g.lineWidth = 3; g.beginPath(); g.arc(bx + 35, F - 26 - bk * 12, 16, Math.PI, 0); g.stroke(); }
      fillRR(g, bx + 6, F - 92, 58, 16, 4, C.ink); text(g, 'BASKETS', bx + 35, F - 80.5, 8, 800, '#FFFFFF', 'center'); soft(g, bx + 35, F + 4, 50, 7, 0.2);
      K.plant(g, { x: 1180, y: F }, C.terra, '#E58F72');
    }
  }
  function wideFront(g, ext) {
  }
  var SHOPPERS = [{ x0: -560, x1: -220, y: 488, spd: 22, ph: 0.2, P: { s: 0.46, ph: 0.5, c: { skin: '#F3CDA8', hair: '#4A2E22', top: '#E9C46A', low: '#3D405B', shoe: '#F7F8FB' }, outfit: 'tee', hairStyle: 'long', hold: 'bags', mood: 'happy', look: 0, hands: [[-74, -150], [70, -150]] } },
    { x0: -160, x1: 80, y: 488, spd: 16, ph: 0.7, P: { s: 0.46, ph: 1.4, c: { skin: '#8D5A3B', hair: '#1F1A1A', top: '#81B29A', low: '#3D405B', shoe: '#F7F8FB' }, outfit: 'tee', hairStyle: 'curly', short: true, mood: 'calm', look: 0, hands: [[-74, -150], [70, -150]] } },
    { front: true, x0: -940, x1: -420, y: 720, spd: 26, ph: 0.45, P: { s: 0.5, ph: 2.2, c: { skin: '#E8B48F', hair: '#2B1D16', top: '#7FA8C9', low: '#3D405B', shoe: '#F7F8FB' }, outfit: 'tee', hairStyle: 'bun', hijab: '#D9785A', clipCol: '#D9785A', hold: 'bags', mood: 'happy', look: 0, hands: [[-74, -150], [70, -150]] } },
    { x0: 1010, x1: 1330, y: 488, spd: 20, ph: 0.1, P: { s: 0.46, ph: 0.9, c: { skin: '#B9845F', hair: '#1F1A1A', top: '#D9785A', low: '#3D405B', shoe: '#F7F8FB' }, outfit: 'tee', hairStyle: 'short', short: true, hold: 'bags', mood: 'calm', look: 0, hands: [[-74, -150], [70, -150]] } }];
  function crowd(g, t, S, front) { var ext = S.ext;
    SHOPPERS.slice().sort(function (a, b) { return a.y - b.y; }).forEach(function (w) { var L = (w.front || w.y >= 560) ? 'fore' : w.y > 470; if (L !== front) return; var a = Math.max(w.x0, ext.l + 30), b = Math.min(w.x1, ext.r - 40); if (b - a < 60) return; K.walker(g, { x0: a, x1: b, y: w.y, spd: w.spd, ph: w.ph, P: w.P }, t); }); }

  /* ---------------- static back props (set units) ---------------- */
  function mug(g, x, y, col) { fillRR(g, x, y - 26, 26, 26, 5, col); g.strokeStyle = col; g.lineWidth = 4; g.beginPath(); g.arc(x + 27, y - 13, 7, -1.4, 1.4); g.stroke(); fillRR(g, x + 3, y - 24, 20, 4, 2, 'rgba(255,255,255,.35)'); }
  function candle(g, x, y, col) { fillRR(g, x, y - 30, 24, 30, 6, 'rgba(255,255,255,.75)'); fillRR(g, x + 3, y - 20, 18, 17, 4, col); fillRR(g, x + 2, y - 34, 20, 6, 3, '#C9B79C'); }
  function tag(g, x, y, col, rot) { g.save(); g.translate(x, y); g.rotate(rot || 0); g.strokeStyle = '#B9A58A'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(0, -10); g.lineTo(0, 0); g.stroke();
    fillRR(g, -9, 0, 18, 13, 3, '#FFFFFF'); fillE(g, 0, 4, 1.8, 1.8, '#C9B79C'); g.fillStyle = col; g.fillRect(-6, 8, 12, 2.2); g.restore(); }
  /* ---------------- more of the shop: a wall shelf of plants and prints, a sale banner; baskets, gift boxes ---------------- */
  function moreBack(g, ext) {
    var y = 30;
    [[-900, -700], [-560, -360], [1020, 1240]].forEach(function (r, i) { if (r[1] < ext.l || r[0] > ext.r) return; fillRR(g, r[0], y, r[1] - r[0], 8, 3, C.oakD);
      for (var x = r[0] + 20; x < r[1] - 30; x += 64) { if (((x - r[0]) / 64 | 0) % 2) { for (var lf = 0; lf < 5; lf++) { g.save(); g.translate(x + 18, y - 24); g.rotate((lf - 2) * 0.4); g.fillStyle = lf % 2 ? '#7FB59A' : C.sageD; g.beginPath(); g.ellipse(0, -16, 5, 14, 0, 0, Math.PI * 2); g.fill(); g.restore(); } fillRR(g, x + 6, y - 26, 24, 26, 6, C.terra); } else { fillRR(g, x, y - 60, 40, 56, 3, '#FFFFFF'); fillRR(g, x + 5, y - 55, 30, 46, 2, i % 2 ? C.peach : '#CFE3D8'); } } });
    if (ext.l < -260) { fillRR(g, -320, 120, 160, 46, 8, C.terra); text(g, 'SEASON SALE', -240, 140, 12, 800, '#FFFFFF', 'center'); text(g, 'up to 30% off · sample', -240, 156, 7, 700, '#FFE3D6', 'center'); }
  }
  function moreFront(g, ext) {
  }
  function paintBack(g, ext) {
    wideBack(g, ext);
    /* the wall sign: Harbour Goods, a sample homeware store */
    var lg = T.logo; g.fillStyle = '#B9A58A'; g.fillRect(lg.x + 30, 0, 2, lg.y); g.fillRect(lg.x + lg.w - 32, 0, 2, lg.y);
    shadowed(g, 14, 5, 0.16, function () { fillRR(g, lg.x, lg.y, lg.w, lg.h, 14, '#FFFFFF'); });
    fillE(g, lg.x + 30, lg.y + 32, 18, 18, C.terra);
    g.strokeStyle = '#FFFFFF'; g.lineWidth = 2.6; g.lineCap = 'round'; g.beginPath(); g.arc(lg.x + 30, lg.y + 30, 8, 0.35, Math.PI - 0.35); g.moveTo(lg.x + 30, lg.y + 22); g.lineTo(lg.x + 30, lg.y + 38); g.moveTo(lg.x + 25, lg.y + 25); g.lineTo(lg.x + 35, lg.y + 25); g.stroke();
    text(g, 'Harbour Goods', lg.x + 56, lg.y + 31, 18, 800, C.ink); text(g, 'SAMPLE HOMEWARE STORE', lg.x + 56, lg.y + 47, 9.5, 700, '#8A7F6E');
    /* pendant lamps and their warm pools */
    T.lamps.forEach(function (lx) {
      g.save(); var gl = g.createRadialGradient(lx, 90, 6, lx, 110, 150); gl.addColorStop(0, 'rgba(255,214,150,.30)'); gl.addColorStop(1, 'rgba(255,214,150,0)'); g.fillStyle = gl; g.fillRect(lx - 160, 40, 320, 230); g.restore();
      g.fillStyle = '#8A7F6E'; g.fillRect(lx - 1, 0, 2, 52);
      g.fillStyle = C.terra; g.beginPath(); g.moveTo(lx - 26, 76); g.quadraticCurveTo(lx - 24, 50, lx, 50); g.quadraticCurveTo(lx + 24, 50, lx + 26, 76); g.closePath(); g.fill();
      fillRR(g, lx - 28, 74, 56, 6, 3, C.terraD); fillE(g, lx, 82, 9, 6, '#FFF2CF');
    });
    /* the shop door: a sage frame round a glass panel (the street is painted live inside it) */
    var d = T.door; soft(g, d.x + d.w / 2, F + 4, d.w * 0.7, 10, 0.18);
    shadowed(g, 12, 4, 0.18, function () { fillRR(g, d.x - 10, d.y - 12, d.w + 20, d.h + 12, 8, '#F3E6D2'); });
    fillRR(g, d.x, d.y, d.w, d.h, 6, C.sage); fillRR(g, d.x + 4, d.y + 4, d.w - 8, d.h - 4, 4, C.sageD);
    fillRR(g, d.x - 16, d.y - 18, d.w + 32, 12, 5, '#FFFFFF');
    /* the bell's bracket */
    g.strokeStyle = '#B08A4A'; g.lineWidth = 3; g.lineCap = 'round'; g.beginPath(); g.moveTo(T.bell.x - 18, d.y - 18); g.quadraticCurveTo(T.bell.x - 18, T.bell.y - 22, T.bell.x, T.bell.y - 22); g.stroke();
    /* the shelving: oak sides, three shelves of mugs, candles and throws, price tags */
    var sh = T.shelf; soft(g, sh.x + sh.w / 2, F + 4, sh.w * 0.6, 10, 0.2);
    shadowed(g, 14, 5, 0.16, function () { fillRR(g, sh.x, sh.y, sh.w, sh.h, 6, C.oakD); });
    fillRR(g, sh.x + 7, sh.y + 7, sh.w - 14, sh.h - 14, 4, '#F4E4CC');
    var levels = [sh.y + 86, sh.y + 166, sh.y + 246];
    levels.forEach(function (ly) { fillRR(g, sh.x + 2, ly, sh.w - 4, 9, 2, C.oak); g.fillStyle = 'rgba(80,50,20,.10)'; g.fillRect(sh.x + 7, ly + 9, sh.w - 14, 6); });
    fillRR(g, sh.x - 6, sh.y - 8, sh.w + 12, 12, 4, C.oak);
    mug(g, sh.x + 12, levels[0], C.terra); mug(g, sh.x + 48, levels[0], C.sage); mug(g, sh.x + 84, levels[0], '#F3DCC0');
    fillRR(g, sh.x + 110, levels[0] - 20, 18, 20, 4, C.terraD); fillE(g, sh.x + 119, levels[0] - 28, 12, 10, '#4F9A6E'); fillE(g, sh.x + 113, levels[0] - 34, 7, 8, '#5DB07E');
    candle(g, sh.x + 14, levels[1], C.peach); candle(g, sh.x + 44, levels[1], C.sage); candle(g, sh.x + 74, levels[1], '#E9C46A');
    fillRR(g, sh.x + 98, levels[1] - 46, 28, 46, 12, '#7FA8C9'); fillRR(g, sh.x + 104, levels[1] - 54, 16, 10, 4, '#6B94B5');
    [[C.terra, '#F7D9C9'], [C.sage, '#DDEBE2'], ['#7FA8C9', '#E3EEF6']].forEach(function (cl, i) {
      var tx = sh.x + 10 + i * 40; for (var f = 0; f < 3; f++) { fillRR(g, tx, levels[2] - 14 - f * 14, 36, 13, 4, f % 2 ? cl[1] : cl[0]); g.fillStyle = 'rgba(255,255,255,.4)'; g.fillRect(tx + 4, levels[2] - 9 - f * 14, 28, 1.6); }
    });
    fillRR(g, sh.x + 12, sh.y + sh.h - 52, sh.w - 24, 38, 6, '#EAD4B6'); text(g, 'GIFT WRAP FREE', sh.x + sh.w / 2, sh.y + sh.h - 28, 9, 800, C.terraD, 'center');
    tag(g, sh.x + 30, levels[0] + 14, C.terra, -0.15); tag(g, sh.x + 70, levels[1] + 14, C.sage, 0.12); tag(g, sh.x + 112, levels[2] + 14, C.terra, -0.1);
    /* the SALE sign hanging off the top */
    g.save(); g.translate(sh.x + sh.w - 22, sh.y + 4); g.rotate(0.12); g.strokeStyle = '#B9A58A'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 12); g.stroke();
    fillRR(g, -22, 12, 44, 22, 5, C.terra); text(g, 'SALE', 0, 28, 10.5, 800, '#FFFFFF', 'center'); g.restore();
    /* click & collect cubbies on the wall */
    var cb = T.cubby; shadowed(g, 14, 5, 0.16, function () { fillRR(g, cb.x, cb.y, cb.w, cb.h, 8, C.oakD); });
    fillRR(g, cb.x, cb.y, cb.w, 30, 8, C.ink); text(g, 'ONLINE ORDERS', cb.x + cb.w / 2, cb.y + 13, 9, 800, '#FFFFFF', 'center'); text(g, 'pick up here', cb.x + cb.w / 2, cb.y + 25, 8.5, 600, '#F2B8A0', 'center');
    for (var r = 0; r < 2; r++) for (var c = 0; c < 3; c++) {
      var cx = cb.x + 8 + c * 49, cy = cb.y + 36 + r * 64; fillRR(g, cx, cy, 45, 58, 4, '#F4E4CC');
      if ((r * 3 + c) % 4 !== 3) { var bc = [C.kraft, '#E8C394', '#9DBFA4'][(r + c) % 3]; fillRR(g, cx + 7, cy + 18, 31, 38, 4, bc); g.strokeStyle = tone(bc, 0.25); g.lineWidth = 2; g.beginPath(); g.arc(cx + 22.5, cy + 19, 7, Math.PI, 0); g.stroke();
        fillRR(g, cx + 12, cy + 30, 21, 12, 2, '#FFFFFF'); g.fillStyle = C.ink; g.fillRect(cx + 15, cy + 35, 15, 1.6); }
    }
    /* the transfer tote bound for another store, on a dolly */
    var to = T.tote; soft(g, to.x + 34, F + 3, 40, 7, 0.22);
    fillRR(g, to.x, F - 16, 68, 10, 4, '#8A9AAE'); fillE(g, to.x + 10, F - 3, 5, 5, '#3D405B'); fillE(g, to.x + 58, F - 3, 5, 5, '#3D405B');
    fillRR(g, to.x + 4, F - 66, 60, 50, 6, '#4A86C5'); fillRR(g, to.x + 4, F - 66, 60, 10, 4, '#3B74B0'); fillRR(g, to.x + 22, F - 62, 24, 5, 2, '#2E5F94');
    fillRR(g, to.x + 10, F - 50, 48, 22, 3, '#FFFFFF'); text(g, '→ ORCHARD', to.x + 34, F - 36, 8, 800, C.ink, 'center');
    /* supplier cartons on a hand truck, the purchase order taped on */
    var ca = T.cartons; soft(g, ca.x + 42, F + 3, 50, 8, 0.22);
    g.strokeStyle = '#6E7A8A'; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.moveTo(ca.x + 2, F - 150); g.lineTo(ca.x + 2, F - 8); g.lineTo(ca.x + 62, F - 8); g.stroke();
    fillE(g, ca.x + 8, F - 2, 8, 8, '#3D405B'); fillE(g, ca.x + 8, F - 2, 3, 3, '#AAB4C4');
    [[ca.x + 8, F - 58, 78, 50], [ca.x + 10, F - 106, 72, 48], [ca.x + 14, F - 146, 62, 40]].forEach(function (b, i) {
      fillRR(g, b[0], b[1], b[2], b[3], 4, i % 2 ? '#D2A673' : C.kraft); g.fillStyle = 'rgba(255,240,210,.5)'; g.fillRect(b[0] + b[2] / 2 - 6, b[1], 12, b[3]);
      g.fillStyle = 'rgba(80,50,20,.12)'; g.fillRect(b[0], b[1] + b[3] - 4, b[2], 4);
    });
    fillRR(g, ca.x + 46, F - 52, 34, 38, 2, '#FFFFFF'); g.fillStyle = '#C9D3E3'; for (var ln = 0; ln < 4; ln++) g.fillRect(ca.x + 50, F - 44 + ln * 7, ln === 3 ? 14 : 26, 2.4);
    text(g, 'PO', ca.x + 50, F - 46, 7, 800, C.terraD);
    text(g, 'APEX HOMEWARE', ca.x + 47, F - 116, 7, 800, '#7A5531', 'center');
    /* the counter's back edge (the front panel is painted over the cashier) */
    soft(g, T.counter.x + T.counter.w / 2, F + 6, T.counter.w * 0.6, 16, 0.2);
  }

  /* ---------------- static front props: the counter and what stands on it (over the cashier) ---------------- */
  function paintFront(g, ext) {
    var co = T.counter, top = co.y;
    fillRR(g, co.x + 6, top + 12, co.w - 12, F - top - 12, 10, C.terra);
    g.save(); rr(g, co.x + 6, top + 12, co.w - 12, F - top - 12, 10); g.clip();
    g.fillStyle = 'rgba(255,255,255,.10)'; for (var pl = co.x + 24; pl < co.x + co.w; pl += 34) g.fillRect(pl, top, 4, F - top);
    g.fillStyle = C.terraD; g.fillRect(co.x, F - 14, co.w, 14); g.restore();
    fillRR(g, co.x + 70, top + 40, 122, 40, 8, C.cream); text(g, 'PAY HERE', co.x + 131, top + 58, 10.5, 800, C.terraD, 'center'); text(g, 'card · cash · QR', co.x + 131, top + 72, 8.5, 600, '#8A7F6E', 'center');
    fillRR(g, co.x - 6, top, co.w + 12, 14, 6, C.oak); g.fillStyle = C.oakD; g.fillRect(co.x, top + 10, co.w, 4);
    /* the till: a stand and a screen (its sale is painted live) */
    var tl = T.till; fillRR(g, tl.x + 34, tl.y + 52, 12, 18, 3, '#9AA6BC'); fillRR(g, tl.x + 20, tl.y + 66, 40, 6, 3, '#C3CDDA');
    fillRR(g, tl.x, tl.y, 80, 56, 7, '#2A3550'); fillRR(g, tl.x + 4, tl.y + 4, 72, 48, 4, '#FFFFFF');
    /* the barcode scanner lying on the counter */
    var sc = T.scan; g.save(); g.translate(sc.x, sc.y); g.rotate(-0.12); fillRR(g, 0, 0, 34, 12, 5, '#3D405B'); fillRR(g, 26, -4, 12, 18, 4, '#3D405B'); fillRR(g, 34, -2, 5, 14, 2, '#E0456B'); g.restore();
    /* the card terminal */
    var tm = T.term; g.save(); g.translate(tm.x + 14, tm.y + 16); g.rotate(-0.08); fillRR(g, -14, -18, 28, 42, 7, '#2A3550'); fillRR(g, -10, -14, 20, 12, 3, '#EAF0FB');
    for (var kk = 0; kk < 6; kk++) fillRR(g, -9 + (kk % 3) * 7, 3 + Math.floor(kk / 3) * 7, 5, 4.5, 1.2, kk === 5 ? C.sage : '#5D6E93'); g.restore();
    /* the receipt printer (its roll is painted live) */
    var pr = T.printer; fillRR(g, pr.x, pr.y + 8, 48, 26, 7, '#E9E3D8'); fillRR(g, pr.x, pr.y + 8, 48, 8, 4, '#D5CCBD'); fillRR(g, pr.x + 8, pr.y + 26, 10, 4, 2, C.sage);
  }

  /* ---------------- the street through the glass door ---------------- */
  var VAN = { t0: -99, next: 9 };
  function vanX(t) { var u = (t - VAN.t0) / 9; if (u < 0 || u > 1) return null; /* drives in, stops at the door, drives off */
    var x = u < 0.3 ? lerp(250, 112, (u / 0.3) * (2 - u / 0.3)) : u < 0.7 ? 112 : lerp(112, -60, Math.pow((u - 0.7) / 0.3, 2)); return x; }
  function paintWindow(g, t, par, S) {
    var d = T.door, gx = d.x + 10, gy = d.y + 12, gw = d.w - 20, gh = d.h - 60;
    g.save(); rr(g, gx, gy, gw, gh, 4); g.clip();
    var sk = g.createLinearGradient(0, gy, 0, gy + gh); sk.addColorStop(0, '#BFE3F3'); sk.addColorStop(0.5, '#EAF6FB'); sk.addColorStop(0.51, '#D9C9B4'); sk.addColorStop(1, '#CFC1AE'); g.fillStyle = sk; g.fillRect(gx, gy, gw, gh);
    var ox = gx - par * 3;
    fillRR(g, ox - 30, gy + 40, 170, 200, 4, '#D98E73'); g.fillStyle = '#F6E7D2'; for (var wy = 0; wy < 3; wy++) for (var wx = 0; wx < 3; wx++) fillRR(g, ox - 18 + wx * 52, gy + 56 + wy * 50, 30, 34, 3, '#F6E7D2');
    for (var a = 0; a < 8; a++) { g.fillStyle = a % 2 ? '#FFFFFF' : C.terra; g.beginPath(); g.moveTo(ox - 30 + a * 22, gy + 200); g.lineTo(ox - 8 + a * 22, gy + 200); g.lineTo(ox - 8 + a * 22, gy + 214); g.arc(ox - 19 + a * 22, gy + 214, 11, 0, Math.PI); g.closePath(); g.fill(); }
    g.fillStyle = '#A9A39A'; g.fillRect(gx, gy + 238, gw, 22); g.fillStyle = '#FFFFFF'; for (var dsh = 0; dsh < 6; dsh++) g.fillRect(gx + dsh * 24 - ((t * 10) % 24), gy + 248, 12, 2);
    g.fillStyle = '#E3D9CB'; g.fillRect(gx, gy + 260, gw, gh - 260); g.fillStyle = 'rgba(0,0,0,.06)'; g.fillRect(gx, gy + 260, gw, 4);
    /* a tree on the pavement */
    g.fillStyle = '#8A6A4A'; g.fillRect(ox + 70, gy + 170, 7, 92); fillE(g, ox + 73, gy + 160, 30, 26, '#6FAF86'); fillE(g, ox + 58, gy + 172, 18, 15, '#5E9E75');
    /* the transfer van */
    var vx = vanX(t); if (vx != null) { var vy = gy + 206;
      fillRR(g, vx - 50, vy, 100, 42, 8, '#FFFFFF'); fillRR(g, vx - 50, vy, 28, 30, 6, '#CFE7F5'); fillRR(g, vx - 16, vy + 10, 60, 16, 3, C.sage); text(g, 'HG', vx + 14, vy + 22, 10, 800, '#FFFFFF', 'center');
      fillE(g, vx - 30, vy + 42, 7, 7, '#3D405B'); fillE(g, vx + 30, vy + 42, 7, 7, '#3D405B'); }
    /* people walking by */
    for (var p = 0; p < 2; p++) { var px = gx - 20 + (((t * (16 + p * 7)) + p * 70) % (gw + 50)), py = gy + gh - 40 - p * 8, col = p ? '#7FA8C9' : C.peach, bob = Math.abs(Math.sin(t * 6 + p)) * 2;
      fillRR(g, px - 8, py - 30 - bob, 16, 30, 7, col); fillE(g, px, py - 38 - bob, 7, 7, p ? '#C68B5E' : '#F3CDA8'); }
    g.restore();
    /* the glass: a reflection and the brass push bar */
    g.save(); rr(g, gx, gy, gw, gh, 4); g.clip(); g.fillStyle = 'rgba(255,255,255,.28)'; g.beginPath(); g.moveTo(gx + 10, gy + gh); g.lineTo(gx + gw * 0.7, gy); g.lineTo(gx + gw, gy); g.lineTo(gx + gw * 0.36, gy + gh); g.closePath(); g.fill(); g.restore();
    fillRR(g, gx - 2, d.y + d.h * 0.62, gw + 4, 8, 4, '#C9A44A'); fillRR(g, gx, d.y + d.h - 44, gw, 30, 3, C.sageD);
    if (t > VAN.t0 + 9 && t > VAN.next) { VAN.t0 = t; VAN.next = t + 22; }
  }

  /* ---------------- live: the OPEN sign, the bell, shelf labels, the cubby tickets ---------------- */
  function paintLive(g, t, now, S) {
    crowd(g, t, S, false);
    /* the OPEN sign swings on its strings; tapped, it flips to say hello */
    var sg = T.sign, ts = S.toy.sign != null ? t - S.toy.sign : 99, sw = Math.sin(t * 1.3) * 0.03 + (ts < 1.4 ? Math.sin(ts * 9) * 0.22 * (1 - ts / 1.4) : 0), flip = ts < 3.2;
    g.save(); g.translate(sg.x, sg.y - 40); g.rotate(sw); g.strokeStyle = '#B9A58A'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(-18, 22); g.lineTo(0, 0); g.lineTo(18, 22); g.stroke();
    var sq = ts < 0.5 ? Math.abs(Math.cos(ts / 0.5 * Math.PI)) : 1; g.translate(0, 38); g.scale(Math.max(0.06, sq), 1);
    fillRR(g, -32, -16, 64, 32, 7, flip && ts > 0.25 ? C.sage : C.terra); fillRR(g, -28, -12, 56, 24, 5, flip && ts > 0.25 ? C.sageD : C.terraD);
    text(g, flip && ts > 0.25 ? 'HELLO!' : 'OPEN', 0, 5, 12, 800, '#FFFFFF', 'center'); g.restore();
    /* the door bell: rings on the door's toy and when the shopper waves */
    var bl = T.bell, tb = S.toy.bell != null ? t - S.toy.bell : 99, ring = tb < 1.2 ? Math.sin(tb * 30) * 0.4 * (1 - tb / 1.2) : Math.sin(t * 1.1) * 0.03;
    g.save(); g.translate(bl.x, bl.y - 22); g.rotate(ring); g.fillStyle = '#B08A4A'; g.fillRect(-1, 0, 2, 8);
    g.fillStyle = '#E2B84C'; g.beginPath(); g.moveTo(-12, 26); g.quadraticCurveTo(-11, 8, 0, 7); g.quadraticCurveTo(11, 8, 12, 26); g.closePath(); g.fill(); fillRR(g, -14, 24, 28, 5, 2.5, '#C9A040'); fillE(g, 0, 31, 3.5, 3.5, '#B08A4A'); g.restore();
    if (tb < 1.2) { g.strokeStyle = 'rgba(217,120,90,' + (1 - tb / 1.2).toFixed(2) + ')'; g.lineWidth = 2.2; g.lineCap = 'round';
      for (var w = 0; w < 2; w++) { var rad = 22 + w * 8 + tb * 14; g.beginPath(); g.arc(bl.x, bl.y - 4, rad, -0.6, 0.3); g.stroke(); g.beginPath(); g.arc(bl.x, bl.y - 4, rad, Math.PI - 0.3, Math.PI + 0.6); g.stroke(); } }
    /* shelf labels: the count steps up as goods are scanned in on the Receive stop */
    var sh = T.shelf, levels = [sh.y + 86, sh.y + 166, sh.y + 246], rec = S.hot === 'receive', base = [24, 18, 12];
    levels.forEach(function (ly, i) {
      var n = base[i] + (rec ? Math.min(12, Math.floor(clamp((t - (S.recT || 0)) * 3 - i * 2, 0, 12))) : 0);
      fillRR(g, sh.x + sh.w - 42, ly + 1, 34, 8, 2, rec ? '#3D405B' : '#5E5A54'); text(g, n + ' pcs', sh.x + sh.w - 25, ly + 7.4, 6.5, 800, rec ? '#9FE3C1' : '#F4E4CC', 'center');
    });
    /* click & collect: the ready ticket blinks on the Online stop */
    var cb = T.cubby, on = S.hot === 'online', blink = on && Math.floor(t * 3) % 2 === 0;
    fillRR(g, cb.x + 105, cb.y + 102, 39, 14, 4, blink ? '#FFD84A' : C.sage); text(g, '#1042', cb.x + 124.5, cb.y + 112, 7.5, 800, blink ? C.ink : '#FFFFFF', 'center');
  }

  /* ---------------- live front: the till's sale, the scanner beam, the card waves, the receipt roll ---------------- */
  var ITEMS = [['Ceramic mug', 18], ['Soy candle', 24], ['Linen throw', 59], ['Bud vase', 16]];
  function money(v) { return 'S$ ' + v.toFixed(2); }
  function paintFrontLive(g, t, S) {
    crowd(g, t, S, true);
    var tl = T.till, cyc = (t % 7) / 7, shown = Math.min(3, Math.floor(cyc * 5)), total = 0;
    fillRR(g, tl.x + 4, tl.y + 4, 72, 9, 3, C.terra); text(g, 'HARBOUR · POS', tl.x + 8, tl.y + 11, 5.8, 800, '#FFFFFF');
    for (var i = 0; i < shown; i++) { var it = ITEMS[(i + Math.floor(t / 7)) % ITEMS.length]; total += it[1];
      text(g, it[0], tl.x + 8, tl.y + 22 + i * 8, 5.6, 700, C.ink); text(g, it[1].toFixed(2), tl.x + 72, tl.y + 22 + i * 8, 5.6, 700, C.ink, 'right'); }
    fillRR(g, tl.x + 6, tl.y + 41, 68, 9, 3, shown === 3 ? C.sage : '#E6E0D6'); text(g, shown === 3 ? 'PAY ' + money(total) : 'adding items…', tl.x + 40, tl.y + 47.6, 5.8, 800, shown === 3 ? '#FFFFFF' : '#8A7F6E', 'center');
    /* the scanner: a beam and a beep when tapped (and on the Sell stop) */
    var sc = T.scan, tsc = S.toy.scan != null ? t - S.toy.scan : 99, beam = tsc < 0.9 || (S.hot === 'sell' && (t % 2.4) < 0.5);
    if (beam) { g.save(); g.translate(sc.x, sc.y); g.rotate(-0.12); var bg = g.createLinearGradient(40, 0, 90, 0); bg.addColorStop(0, 'rgba(224,69,107,.55)'); bg.addColorStop(1, 'rgba(224,69,107,0)');
      g.fillStyle = bg; g.beginPath(); g.moveTo(39, 1); g.lineTo(92, -12); g.lineTo(92, 24); g.lineTo(39, 11); g.closePath(); g.fill(); g.restore();
      if (tsc < 0.9) text(g, 'beep!', sc.x + 22, sc.y - 12 - tsc * 18, 11, 800, 'rgba(224,69,107,' + (1 - tsc / 0.9).toFixed(2) + ')', 'center'); }
    /* card terminal: contactless waves */
    var tm = T.term, wv = (t % 1.6) / 1.6, act = S.hot === 'sell' || S.peek === 'sell' ? 1 : 0.45;
    g.strokeStyle = 'rgba(94,143,119,' + ((1 - wv) * act).toFixed(2) + ')'; g.lineWidth = 2; g.lineCap = 'round';
    for (var r2 = 0; r2 < 2; r2++) { g.beginPath(); g.arc(tm.x + 14, tm.y - 6, 5 + r2 * 6 + wv * 6, -2.4, -0.74); g.stroke(); }
    /* the receipt roll: a short curl, or the day's takings printing out on the Close stop */
    var pr = T.printer, cl = S.hot === 'close', len = cl ? clamp((t - (S.closeT || 0)) * 40, 8, 74) : 10 + Math.sin(t * 1.4) * 1.5;
    g.save(); g.translate(pr.x + 24, pr.y + 10); fillRR(g, -14, -len, 28, len, 2, '#FFFFFF');
    g.fillStyle = '#FFFFFF'; g.beginPath(); for (var z = 0; z < 7; z++) { g.lineTo(-14 + z * 4.66, -len - (z % 2 ? 3 : 0)); } g.lineTo(14, -len); g.closePath(); g.fill();
    if (len > 30) { text(g, 'Z-REPORT', 0, -len + 10, 5.6, 800, C.ink, 'center'); g.fillStyle = '#C9D3E3'; for (var q = 0; q < 3; q++) g.fillRect(-10, -len + 15 + q * 6, q === 2 ? 12 : 20, 1.8); }
    if (len > 60) text(g, 'S$ 3,480', 0, -len + 42, 6.2, 800, C.terraD, 'center');
    g.restore();
  }

  var ANA = { x: 676, y: 456, s: 0.56, ph: 0.3, c: { skin: '#E8B48F', hair: '#2B1D16', top: '#F2EFE8', low: '#3D405B', shoe: '#F7F8FB' }, outfit: 'tee', apron: C.sage, hairStyle: 'pony', clipCol: C.terra,
    feet: false, mood: 'calm', look: 0, talk: false, hands: [[-62, -186], [62, -186]] };
  var RAJ = { x: 462, y: 486, s: 0.56, ph: 1.4, c: { skin: '#B9845F', hair: '#1F1A1A', top: '#7FA8C9', print: null, low: '#3D405B', shoe: '#F7F8FB' }, outfit: 'tee', hold: 'bags', hairStyle: 'short', beard: '#1F1A1A',
    short: true, feet: true, mood: 'calm', look: 0.6, talk: false, hands: [[-74, -150], [80, -170]] };

  /* the foreground, nearest last: each prop stands at a y, sorted with the front-row passers-by (K.zfore) */
  function FORE() {
    return [
      [670, function (g, ext) {
    if (ext.l < -500) { /* a round display table in front, stacked linen and a vase */ var tx = -700, ty = 600; soft(g, tx, ty + 70, 110, 10, 0.25);
      g.fillStyle = C.oakD; g.fillRect(tx - 6, ty, 12, 70); fillRR(g, tx - 50, ty + 62, 100, 10, 4, C.oakD); g.fillStyle = C.oak; g.beginPath(); g.ellipse(tx, ty, 110, 18, 0, 0, Math.PI * 2); g.fill();
      for (var f = 0; f < 4; f++) fillRR(g, tx - 80, ty - 14 - f * 12, 60, 11, 3, f % 2 ? '#F7D9C9' : C.terra); for (var h = 0; h < 3; h++) fillRR(g, tx + 6, ty - 14 - h * 12, 56, 11, 3, h % 2 ? '#DDEBE2' : C.sage);
      fillRR(g, tx + 70, ty - 46, 22, 40, 9, '#7FA8C9'); fillE(g, tx + 81, ty - 54, 12, 10, '#5DB07E'); fillRR(g, tx - 30, ty - 76, 60, 22, 4, '#FFFFFF'); text(g, '2 FOR S$ 99', tx, ty - 61, 8, 800, C.terraD, 'center'); }
      }],
      [650, function (g, ext) {
    if (ext.r > 1050) { K.plant(g, { x: 1110, y: 650 }, '#5E8F77', '#81B29A'); }
      }]
    ];
  }
  window.IXW.worlds.retail = {
    calmView: [250,-30,760,608], /* calm layer: the framed hero shows the core of the scene */
    pan: [-340, 1250], /* phones: how far the scene drags each way (set units), ending on whole objects */
    room: ROOM, paintBack: paintBack, paintFront: paintFront, paintWindow: paintWindow, paintLive: paintLive, paintFrontLive: paintFrontLive, paintForeLive: function (g, t, S) { K.zfore(g, t, S, FORE(), function () { crowd(g, t, S, 'fore'); }); },
    moteCol: 'rgba(255,236,200,.8)',
    glow: {
      buy: function (g) { var ca = T.cartons; rr(g, ca.x - 8, F - 160, 102, 166, 14); },
      receive: function (g) { var sh = T.shelf; rr(g, sh.x - 10, sh.y - 14, sh.w + 20, sh.h + 18, 14); },
      move: function (g) { var to = T.tote; rr(g, to.x - 6, F - 74, 80, 82, 12); },
      sell: function (g) { rr(g, T.till.x - 8, T.till.y - 8, 96, 84, 12); },
      online: function (g) { var cb = T.cubby; rr(g, cb.x - 8, cb.y - 8, cb.w + 16, cb.h + 16, 14); },
      close: function (g) { var pr = T.printer; rr(g, pr.x - 8, pr.y - 30, 64, 72, 12); },
      sign: function (g) { rr(g, T.sign.x - 40, T.sign.y - 22, 80, 44, 10); },
      bell: function (g) { rr(g, T.bell.x - 20, T.bell.y - 26, 40, 46, 10); },
      scan: function (g) { rr(g, T.scan.x - 8, T.scan.y - 14, 56, 34, 10); }
    },
    backGlow: ['buy', 'receive', 'move', 'online', 'sign', 'bell'],
    cast: [
      { id: 'ana', behind: true, keys: ['sell', 'close'], P: ANA, act: function (P, t, S) {
        var st = S.cast.ana, busy = S.hot === 'sell' || S.hot === 'close';
        P.talk = t < st.until; P.mood = P.talk || busy ? 'happy' : 'calm';
        var tap = busy ? Math.abs(Math.sin(t * 9)) * 7 : 0;
        P.hands = t < st.wave ? [[-62, -186], [128 + Math.sin(t * 12) * 16, -404]] : [[-62, -186 + tap], [62, -186 + (busy ? Math.abs(Math.cos(t * 9)) * 7 : 0)]];
        P.look = lerp(P.look, clamp((S.nexi.x - P.x) / 160, -1, 1), 0.08);
      } },
      { id: 'raj', keys: ['online'], P: RAJ, act: function (P, t, S) {
        var st = S.cast.raj, on = S.hot === 'online', waving = t < st.wave;
        P.talk = t < st.until; P.mood = P.talk || on ? 'happy' : 'calm';
        P.hop = waving ? Math.abs(Math.sin(t * 7)) * 14 : 0;
        P.hands = waving ? [[-74, -150], [118 + Math.sin(t * 12) * 16, -420]] : [[-74, -150], [80, -170]];
        P.look = lerp(P.look, on ? 1 : clamp((S.nexi.x - P.x) / 160, -1, 1), 0.08);
        if (waving && (S.toy.bell == null || t - S.toy.bell > 1.6)) S.toy.bell = t; /* the door bell rings as he waves */
      } }
    ],
    onStop: function (key, S, t) { if (key === 'receive') S.recT = t; if (key === 'close') S.closeT = t; if (key === 'move' && t > VAN.t0 + 9) { VAN.t0 = t; VAN.next = t + 22; } },
    /* the street through the door: a tap calls the transfer van */
    hit: function (x, y, S, t, onBtn) {
      if (onBtn) return null;
      var d = T.door;
      if (x > d.x && x < d.x + d.w && y > d.y && y < F) { if (t > VAN.t0 + 9) { VAN.t0 = t; VAN.next = t + 22; } return { say: 'Here comes a **transfer** from the warehouse. Both stores see it in Odoo until it is received.', near: [300, 120], pose: 'wow' }; }
      return null;
    }
  };
  /* ---------------- audit round: a dressed floor (a woven runner, the welcome mat), a basket stack and a pavement board
     between the card and the receipt ---------------- */
  function exFloor(g, ext) {
    /* the woven runner along the front of the shop, with fringes */
    var x0 = Math.max(ext.l, -620), x1 = 880, y0 = 540, y1 = 592; if (x1 > x0) {
      fillRR(g, x0, y0, x1 - x0, y1 - y0, 6, '#D9785A'); fillRR(g, x0 + 6, y0 + 6, x1 - x0 - 12, y1 - y0 - 12, 4, '#F0C9A8');
      g.fillStyle = 'rgba(217,120,90,.55)'; for (var x = x0 + 20; x < x1 - 20; x += 36) { g.beginPath(); g.moveTo(x, (y0 + y1) / 2); g.lineTo(x + 12, y0 + 12); g.lineTo(x + 24, (y0 + y1) / 2); g.lineTo(x + 12, y1 - 12); g.closePath(); g.fill(); }
      g.strokeStyle = '#B95E43'; g.lineWidth = 2; for (var fy = y0 + 4; fy < y1; fy += 6) { g.beginPath(); g.moveTo(x1, fy); g.lineTo(x1 + 8, fy); g.stroke(); if (x0 > ext.l + 4) { g.beginPath(); g.moveTo(x0, fy); g.lineTo(x0 - 8, fy); g.stroke(); } } }
    /* the welcome mat at the door */
    fillRR(g, 126, 476, 140, 22, 6, '#81B29A'); fillRR(g, 132, 480, 128, 14, 4, '#5E8F77'); text(g, 'WELCOME', 196, 491, 9, 800, '#FBF3E6', 'center');
  }
  function exFore(g, t, S) {
    var ext = S.ext;
    if (ext.l < 120) { /* the pavement board: today's pick */
      var ax = 150, ay = 650, sw = Math.sin(t * 1.4) * 2; soft(g, ax, ay + 3, 40, 6, 0.22);
      g.strokeStyle = '#B98E62'; g.lineWidth = 5; g.beginPath(); g.moveTo(ax - 30, ay); g.lineTo(ax - 12, ay - 110); g.moveTo(ax + 30, ay); g.lineTo(ax + 12, ay - 110); g.stroke();
      fillRR(g, ax - 34, ay - 104, 68, 80, 6, '#3D405B'); fillRR(g, ax - 30, ay - 100, 60, 72, 4, '#2F3249');
      text(g, 'NEW IN', ax, ay - 80, 10, 800, '#F2B8A0', 'center'); text(g, 'linen', ax, ay - 64, 12, 700, '#FBF3E6', 'center'); text(g, '& ceramics', ax, ay - 51, 7.5, 700, '#FBF3E6', 'center');
      g.save(); g.translate(ax + 26, ay - 104); g.rotate(0.2 + sw * 0.05); fillRR(g, -8, 0, 16, 22, 3, '#E9C46A'); fillE(g, 0, 4, 2.5, 2.5, '#3D405B'); g.restore();
    }
    if (ext.r > 970) { /* a stack of shopping baskets by the till side */
      var bx = 950, by = 642; soft(g, bx, by + 3, 46, 6, 0.22);
      for (var i = 0; i < 4; i++) { var yy = by - 8 - i * 9; fillRR(g, bx - 36, yy - 26, 72, 30, 6, i === 3 ? '#D9785A' : '#B95E43'); g.fillStyle = 'rgba(255,255,255,.25)'; for (var h = 0; h < 5; h++) g.fillRect(bx - 28 + h * 13, yy - 20, 6, 18); }
      g.strokeStyle = '#3D405B'; g.lineWidth = 3; g.beginPath(); g.arc(bx, by - 62, 22, Math.PI, 0); g.stroke();
      text(g, 'BASKETS', bx, by - 14, 7, 800, '#FFFFFF', 'center');
    }
  }
  (function (W) { var pb = W.paintBack, pf = W.paintForeLive;
    W.paintBack = function (g, ext) { exFloor(g, ext); pb(g, ext); };
    W.paintForeLive = function (g, t, S) { exFore(g, t, S); pf(g, t, S); };
  })(window.IXW.worlds.retail);
})(window.IXW && window.IXW.kit);
