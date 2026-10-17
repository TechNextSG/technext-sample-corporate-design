/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: ecommerce (/industries/ecommerce) — Parcel Lane, a sample online shop, drawn as its PACKING ROOM. Lilac block walls
   with a mint safety stripe over a polished concrete floor, strip lights overhead. Left to right: the returns cage; the
   order rail, where slips from the web store and two marketplaces clip in (eCommerce, every channel); the support desk
   with Nora on a headset and her helpdesk screen (Helpdesk, returns); the wall dashboard of sales by channel (Dashboards)
   over the stock rack, whose low bin flags a reorder (Purchase); the packing table with the order tablet showing the
   payment captured (payments), the label printer printing the courier label (Inventory, shipping) and Kai in his hoodie
   and cap with a parcel; a roll of bubble wrap that pops; the conveyor carrying parcels out through the roller door, where
   the courier van waits (tap the door, the parcels or the bubble wrap). Staff: Kai, packer (sample); Nora, customer
   support (sample). */
(function (K) {
  'use strict';
  if (!K) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed;
  var F = 470;
  var T = {
    cage: { x: 92, y: 300, w: 96, h: 170 }, rail: { x: 196, y: 56, w: 176 }, desk: { x: 196, y: 352, w: 178 }, mon: { x: 298, y: 280 },
    tv: { x: 394, y: 30, w: 168, h: 110 }, rack: { x: 394, y: 166, w: 148, h: 304 },
    table: { x: 602, y: 346, w: 206 }, tab: { x: 612, y: 292 }, printer: { x: 750, y: 304 }, wrap: { x: 552, y: 470 },
    belt: { x0: 808, x1: 1034, y: 360 }, door: { x: 852, y: 104, w: 164, h: 366 }, lights: [300, 650, 930]
  };
  var C = { violet: '#6D5BD0', violetD: '#5443B5', mint: '#3CCFAE', mintD: '#22A88A', kraft: '#C99A6B', kraftD: '#A87A4C', ink: '#2B2350', lilac: '#E9E4F4', steel: '#9C95B8' };
  var CH = [{ k: 'WEB', col: C.violet }, { k: 'MKT A', col: '#F08A5D' }, { k: 'MKT B', col: C.mintD }];
  function blocks(g, W, ry, k, sx, sy) { g.strokeStyle = 'rgba(110,90,170,.10)'; g.lineWidth = 1.5 * k; var bh = 30 * k, bw = 64 * k, r = 0;
    for (var y = (sy % bh) - bh; y < ry; y += bh, r++) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); for (var x = (sx % bw) + (r % 2 ? bw / 2 : 0) - bw; x < W; x += bw) { g.moveTo(x, y); g.lineTo(x, y + bh); } g.stroke(); } }
  var ROOM = { wall: ['#F4F1FA', '#EAE5F5'], wains: ['#DDD6EF', '#D3CBE8'], rail: C.mint, base: '#B8AED6', floor: ['#E7E3EF', '#D4CEE2'], floorKind: 'tiles', floorLine: 'rgba(255,255,255,.55)',
    panelLine: 'rgba(0,0,0,0)', wainsH: 128, pattern: blocks };
  function parcel(g, x, y, w, h, tapeV) { fillRR(g, x, y, w, h, 4, C.kraft); fillRR(g, x, y, w, Math.min(10, h * 0.22), 3, C.kraftD); g.fillStyle = 'rgba(255,240,210,.5)';
    if (tapeV) g.fillRect(x + w / 2 - 5, y, 10, h); else g.fillRect(x, y + h / 2 - 4, w, 8); }


  /* ---------------- beyond the frame: the rest of the warehouse (ext = the whole hero in set units) ----------------
     Far left: tall pallet racking and a forklift shuttling a pallet. Behind the copy: a second packing bench and a tote
     cart under the "zone A" sign. Right: dock 2 (closed) and a pallet jack. Pickers walk the margins. */
  function rackBay(g, x, w) { g.fillStyle = '#F08A5D'; g.fillRect(x, 100, 8, F - 100); g.fillRect(x + w - 8, 100, 8, F - 100);
    for (var lv = 0; lv < 3; lv++) { var ly = 200 + lv * 110; fillRR(g, x, ly, w, 8, 2, '#3167CA'); fillRR(g, x + 10, ly - 6, w - 20, 6, 2, '#C99A6B');
      for (var b = 0; b < Math.floor((w - 20) / 40); b++) parcel(g, x + 12 + b * 40, ly - 6 - 34 - (b % 2) * 10, 36, 34 + (b % 2) * 10, (b + lv) % 2 === 0); } }
  function hangSign(g, cx, y, w, label) { g.fillStyle = '#9C95B8'; g.fillRect(cx - w / 2 + 16, 24, 2, y - 24); g.fillRect(cx + w / 2 - 18, 24, 2, y - 24);
    shadowed(g, 8, 3, 0.16, function () { fillRR(g, cx - w / 2, y, w, 30, 6, C.ink); }); fillRR(g, cx - w / 2, y + 24, w, 6, 3, C.mint); text(g, label, cx, y + 17, 10, 800, '#FFFFFF', 'center'); }
  function wideBack(g, ext) {
    /* strip lights over the margins, a duct along the ceiling, wall banners */
    g.fillStyle = '#C9C3DE'; g.fillRect(ext.l, Math.max(ext.t + 30, -50), ext.r - ext.l, 14); g.fillStyle = 'rgba(0,0,0,.08)'; g.fillRect(ext.l, Math.max(ext.t + 30, -50) + 10, ext.r - ext.l, 4);
    for (var lx = Math.floor(ext.l / 220) * 220 + 80; lx < ext.r; lx += 220) { if (lx > 220 && lx < 990) continue; g.fillStyle = '#9C95B8'; g.fillRect(lx - 30, -36, 2, 52); g.fillRect(lx + 28, -36, 2, 52); fillRR(g, lx - 40, 14, 80, 10, 5, '#FFFFFF'); }
    if (ext.l < 60) { shadowed(g, 10, 4, 0.18, function () { fillRR(g, -250, 40, 200, 56, 8, C.violet); }); text(g, 'PARCEL LANE', -150, 66, 15, 800, '#FFFFFF', 'center'); text(g, 'FULFILMENT · SAMPLE', -150, 84, 8, 800, '#D6CEEE', 'center'); }
    if (ext.l < -560) { rackBay(g, -950, 150); rackBay(g, -790, 150); soft(g, -790, F + 4, 160, 9, 0.2); hangSign(g, -810, 104, 180, 'BULK STOCK · AISLE 4'); }
    if (ext.l < 120) {
      hangSign(g, -320, 104, 180, 'ZONE A · PICK');
      var bx = -420; fillRR(g, bx, 346, 200, 14, 5, '#E9D6B8'); g.fillStyle = '#7D759E'; g.fillRect(bx + 8, 360, 8, F - 360); g.fillRect(bx + 184, 360, 8, F - 360);
      parcel(g, bx + 20, 300, 60, 46, true); parcel(g, bx + 90, 316, 50, 30, false); fillRR(g, bx + 150, 326, 30, 18, 4, '#3A3358'); fillRR(g, bx + 152, 318, 12, 10, 3, '#D8D2EA');
      var cx = -150; fillRR(g, cx, 380, 110, 8, 3, '#7D759E'); fillRR(g, cx, 430, 110, 8, 3, '#7D759E'); g.fillStyle = '#7D759E'; g.fillRect(cx + 4, 340, 6, 120); fillE(g, cx + 14, F - 4, 6, 6, C.ink); fillE(g, cx + 96, F - 4, 6, 6, C.ink);
      for (var tt = 0; tt < 2; tt++) { fillRR(g, cx + 12 + tt * 48, 348, 42, 32, 4, '#4A86C5'); fillRR(g, cx + 12 + tt * 48, 398, 42, 32, 4, tt ? C.violet : '#4A86C5'); }
    }
    if (ext.r > 1010) { var dx = 1052; fillRR(g, dx - 12, 104 - 14, 188, 16, 4, '#7D759E'); g.fillStyle = '#8A82AA'; g.fillRect(dx - 12, 104, 12, F - 104); g.fillRect(dx + 164, 104, 12, F - 104);
      for (var y = 104; y < F - 4; y += 10) { fillRR(g, dx, y, 164, 10, 2, (Math.floor((y - 104) / 10) % 2) ? '#B9B2D3' : '#C9C3DE'); }
      for (var hz = 0; hz < 10; hz++) { g.fillStyle = hz % 2 ? '#2B2350' : '#FFD84A'; g.fillRect(dx + hz * 16.4, F - 4, 16.4, 6); } text(g, 'DOCK 2', dx + 82, 100, 8.5, 800, '#FFFFFF', 'center');
      var jx = 1230; fillRR(g, jx, F - 14, 110, 10, 3, '#C99A6B'); parcel(g, jx + 6, F - 64, 48, 50, true); parcel(g, jx + 56, F - 54, 48, 40, false); g.strokeStyle = '#F08A5D'; g.lineWidth = 5; g.beginPath(); g.moveTo(jx + 110, F - 8); g.lineTo(jx + 140, F - 70); g.stroke(); fillRR(g, jx + 130, F - 82, 26, 10, 4, '#F08A5D'); }
  }
  function wideLive(g, t, S) {
    var ext = S.ext;
    if (ext.l < -380) { /* the forklift shuttles a pallet between the racks and the bench */
      var span = 240, d = (t * 40) % (span * 2), fx = -620 + (d < span ? d : span * 2 - d), dir = d < span ? 1 : -1;
      g.save(); g.translate(fx, F); g.scale(dir, 1); soft(g, 0, 4, 70, 8, 0.25);
      fillRR(g, -60, -54, 80, 44, 8, '#FFD84A'); fillRR(g, -50, -112, 52, 60, 8, 'rgba(255,255,255,.0)'); g.strokeStyle = '#3A3358'; g.lineWidth = 5; g.strokeRect(-50, -110, 46, 58);
      fillRR(g, -66, -52, 14, 30, 4, '#3A3358'); fillE(g, -40, -6, 12, 12, C.ink); fillE(g, 4, -6, 12, 12, C.ink); g.fillStyle = '#3A3358'; g.fillRect(24, -120, 6, 114); g.fillRect(28, -14, 46, 6);
      fillRR(g, 30, -22, 46, 8, 2, '#C99A6B'); parcel(g, 32, -62, 40, 40, true); g.restore();
    }
    pick(g, t, S, false);
  }
  var PICK = [{ x0: -480, x1: 60, y: 490, spd: 20, ph: 0.3, drag: '#4A86C5', P: { s: 0.44, ph: 0.6, c: { skin: '#F3CDA8', hair: '#4A2E22', top: '#22A88A', low: '#2B2350', shoe: '#F7F8FB', hat: '#6D5BD0' }, outfit: 'hoodie', hat: 'cap', hairStyle: 'pony', hijab: '#C9503A', clipCol: null, mood: 'calm', look: 0, hands: [[-70, -150], [70, -150]] } },
    { front: true, x0: -940, x1: -420, y: 650, spd: 26, ph: 0.7, P: { s: 0.5, ph: 1.4, c: { skin: '#C68B5E', hair: '#1F1A1A', top: '#F08A5D', low: '#2B2350', shoe: '#F7F8FB' }, outfit: 'hoodie', hairStyle: 'short', short: true, hold: 'box', mood: 'happy', look: 0, hands: [[-60, -212], [64, -216]] } },
    { x0: 1010, x1: 1340, y: 490, spd: 22, ph: 0.2, P: { s: 0.44, ph: 2.1, c: { skin: '#6B4329', hair: '#1F1A1A', top: '#6D5BD0', low: '#2B2350', shoe: '#F7F8FB', hat: '#3CCFAE' }, outfit: 'hoodie', hat: 'cap', hairStyle: 'curly', short: true, hold: 'box', mood: 'calm', look: 0, hands: [[-60, -212], [64, -216]] } }];
  function pick(g, t, S, front) { var ext = S.ext;
    PICK.slice().sort(function (a, b) { return a.y - b.y; }).forEach(function (w) { var L = (w.front || w.y >= 560) ? 'fore' : w.y > 470; if (L !== front) return; var a = Math.max(w.x0, ext.l + 40), b = Math.min(w.x1, ext.r - 50); if (b - a < 60) return; K.walker(g, { x0: a, x1: b, y: w.y, spd: w.spd, ph: w.ph, drag: w.drag, P: w.P }, t); }); }
  function wideFront(g, ext) {
  }

  /* ---------------- static back props (set units) ---------------- */
  /* ---------------- more of the warehouse: aisle signs and a mezzanine rail; pallets, a pallet jack, carton stacks ---------------- */
  function moreBack(g, ext) {
    var my = Math.max(ext.t + 40, -170); g.fillStyle = '#C9C3DE'; g.fillRect(ext.l, my + 40, ext.r - ext.l, 8); g.strokeStyle = '#9C95B8'; g.lineWidth = 3; g.beginPath(); g.moveTo(ext.l, my); g.lineTo(ext.r, my);
    for (var x = Math.floor(ext.l / 60) * 60; x < ext.r; x += 60) { g.moveTo(x, my); g.lineTo(x, my + 40); } g.stroke();
    var n = 1; for (var a = Math.floor(ext.l / 280) * 280 + 140; a < ext.r; a += 280, n++) { if (a > 150 && a < 1000) continue; g.fillStyle = '#9C95B8'; g.fillRect(a - 1, my + 48, 2, 40); fillRR(g, a - 46, my + 88, 92, 34, 6, C.mint); text(g, 'AISLE ' + ((n % 6) + 1), a, my + 110, 11, 800, '#FFFFFF', 'center'); }
  }
  function pallet(g, x, y, w) { fillRR(g, x, y - 12, w, 12, 2, '#B98E62'); g.fillStyle = '#8E6A44'; for (var i = 0; i < 3; i++) g.fillRect(x + 6 + i * (w - 20) / 2, y - 12, 8, 12); }
  function moreFront(g, ext) {
  }
  function paintBack(g, ext) {
    wideBack(g, ext);
    T.lights.forEach(function (lx) { g.fillStyle = '#9C95B8'; g.fillRect(lx - 40, 0, 2, 18); g.fillRect(lx + 38, 0, 2, 18); fillRR(g, lx - 48, 16, 96, 12, 6, '#FFFFFF'); fillRR(g, lx - 44, 26, 88, 4, 2, '#FFF8E0');
      g.save(); var gl = g.createLinearGradient(0, 28, 0, 220); gl.addColorStop(0, 'rgba(255,250,230,.35)'); gl.addColorStop(1, 'rgba(255,250,230,0)'); g.fillStyle = gl; g.beginPath(); g.moveTo(lx - 44, 30); g.lineTo(lx + 44, 30); g.lineTo(lx + 110, 220); g.lineTo(lx - 110, 220); g.closePath(); g.fill(); g.restore(); });
    /* the returns cage */
    var cg = T.cage; soft(g, cg.x + cg.w / 2, F + 3, cg.w * 0.6, 8, 0.2);
    parcel(g, cg.x + 10, F - 52, 46, 44, true); parcel(g, cg.x + 44, F - 84, 42, 36, false);
    g.save(); g.translate(cg.x + 30, F - 40); g.rotate(-0.12); fillRR(g, -16, -6, 32, 13, 3, '#FFFFFF'); text(g, 'RETURN', 0, 4, 6.5, 800, '#E0456B', 'center'); g.restore();
    g.strokeStyle = 'rgba(80,70,120,.55)'; g.lineWidth = 1.4; g.beginPath();
    for (var mx = cg.x; mx <= cg.x + cg.w; mx += 12) { g.moveTo(mx, cg.y); g.lineTo(mx, F - 4); }
    for (var my = cg.y; my <= F - 4; my += 12) { g.moveTo(cg.x, my); g.lineTo(cg.x + cg.w, my); } g.stroke();
    fillRR(g, cg.x - 3, cg.y - 6, cg.w + 6, 8, 3, '#7D759E'); fillRR(g, cg.x - 3, F - 8, cg.w + 6, 8, 3, '#7D759E');
    fillRR(g, cg.x + 18, cg.y + 10, 60, 16, 4, C.ink); text(g, 'RETURNS', cg.x + 48, cg.y + 21.5, 8, 800, '#FFFFFF', 'center');
    /* the order rail: a steel bar, slips clipped on (a new slip slides in live) */
    var rl = T.rail; fillRR(g, rl.x - 6, rl.y, rl.w + 12, 8, 4, '#8A82AA'); fillRR(g, rl.x - 6, rl.y, rl.w + 12, 3, 2, '#B9B2D3');
    text(g, 'ORDERS', rl.x, rl.y - 6, 9, 800, C.ink);
    /* the dashboard on the wall (its bars are live) */
    var tv = T.tv; shadowed(g, 16, 6, 0.2, function () { fillRR(g, tv.x, tv.y, tv.w, tv.h, 8, '#221C40'); }); fillRR(g, tv.x + 5, tv.y + 5, tv.w - 10, tv.h - 10, 5, '#FFFFFF');
    fillRR(g, tv.x + 5, tv.y + 5, tv.w - 10, 16, 4, C.violet); text(g, 'SALES BY CHANNEL', tv.x + 12, tv.y + 16.5, 7.5, 800, '#FFFFFF');
    /* the stock rack: steel uprights, three levels of bins and boxes */
    var rk = T.rack; soft(g, rk.x + rk.w / 2, F + 4, rk.w * 0.6, 10, 0.2);
    g.fillStyle = '#7D759E'; g.fillRect(rk.x, rk.y, 7, rk.h); g.fillRect(rk.x + rk.w - 7, rk.y, 7, rk.h);
    var lv = [rk.y + 90, rk.y + 180, rk.y + 270];
    lv.forEach(function (ly, i) { fillRR(g, rk.x, ly, rk.w, 8, 2, '#9C95B8');
      for (var b = 0; b < 3; b++) { var bx = rk.x + 12 + b * 44, low = i === 0 && b === 2; fillRR(g, bx, ly - 40, 38, 40, 4, low ? '#E9E4F4' : [C.violet, C.mintD, '#F08A5D'][(b + i) % 3]);
        fillRR(g, bx + 4, ly - 30, 30, 10, 2, '#FFFFFF'); g.fillStyle = C.ink; g.fillRect(bx + 8, ly - 26, 22, 2);
        if (!low) { parcel(g, bx + 6, ly - 58, 26, 20, true); } } });
    parcel(g, rk.x + 14, rk.y + 6, 56, 44, false); parcel(g, rk.x + 76, rk.y + 18, 54, 32, true); fillRR(g, rk.x, rk.y, rk.w, 6, 2, '#9C95B8');
    /* the dock door's frame (the door and the van are live) */
    var dr = T.door; fillRR(g, dr.x - 12, dr.y - 14, dr.w + 24, 16, 4, '#7D759E'); g.fillStyle = '#8A82AA'; g.fillRect(dr.x - 12, dr.y, 12, dr.h); g.fillRect(dr.x + dr.w, dr.y, 12, dr.h);
    for (var hz = 0; hz < 8; hz++) { g.fillStyle = hz % 2 ? '#2B2350' : '#FFD84A'; g.fillRect(dr.x + hz * (dr.w / 8), F - 4, dr.w / 8, 6); }
    text(g, 'DOCK 1', dr.x + dr.w / 2, dr.y - 2, 8.5, 800, '#FFFFFF', 'center');
    /* floor shadows of the desk and the table */
    soft(g, T.desk.x + T.desk.w / 2, F + 6, T.desk.w * 0.6, 14, 0.18); soft(g, T.table.x + T.table.w / 2, F + 6, T.table.w * 0.6, 14, 0.18);
  }

  /* ---------------- static front props: the support desk, the packing table, the conveyor (over the staff) ---------------- */
  function paintFront(g, ext) {
    var dk = T.desk; fillRR(g, dk.x, dk.y, dk.w, 12, 5, '#F4F1FA'); fillRR(g, dk.x + 6, dk.y + 10, dk.w - 12, F - dk.y - 10, 6, C.violet);
    g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(dk.x + 18, dk.y + 26, dk.w - 36, 3); fillRR(g, dk.x + 24, dk.y + 44, 62, 30, 5, C.violetD); fillRR(g, dk.x + 30, dk.y + 52, 50, 4, 2, '#8D7FE0');
    text(g, 'SUPPORT', dk.x + dk.w - 30, dk.y + 66, 9, 800, '#FFFFFF', 'center');
    var mn = T.mon; fillRR(g, mn.x + 28, mn.y + 50, 12, 18, 3, '#9C95B8'); fillRR(g, mn.x + 16, mn.y + 64, 36, 6, 3, '#B9B2D3'); fillRR(g, mn.x, mn.y, 70, 54, 6, '#221C40'); fillRR(g, mn.x + 4, mn.y + 4, 62, 46, 3, '#FFFFFF');
    fillRR(g, dk.x + 14, dk.y - 22, 18, 22, 4, '#F08A5D'); g.strokeStyle = '#F08A5D'; g.lineWidth = 3; g.beginPath(); g.arc(dk.x + 33, dk.y - 11, 5, -1.4, 1.4); g.stroke();
    /* the packing table: a work top, open legs, a shelf of flat boxes below */
    var tb = T.table; fillRR(g, tb.x - 4, tb.y, tb.w + 8, 14, 5, '#E9D6B8'); g.fillStyle = '#C9B08A'; g.fillRect(tb.x, tb.y + 10, tb.w, 4);
    g.fillStyle = '#7D759E'; g.fillRect(tb.x + 8, tb.y + 14, 8, F - tb.y - 14); g.fillRect(tb.x + tb.w - 16, tb.y + 14, 8, F - tb.y - 14); fillRR(g, tb.x + 8, F - 46, tb.w - 16, 7, 3, '#9C95B8');
    parcel(g, tb.x + 30, F - 86, 70, 40, false); parcel(g, tb.x + 108, F - 76, 60, 30, true);
    fillRR(g, tb.x + 30, tb.y + 22, 140, 26, 6, C.ink); text(g, 'PACK · LABEL · SHIP', tb.x + 100, tb.y + 39, 8.5, 800, '#FFFFFF', 'center');
    /* the tablet on its stand and the label printer */
    var tt = T.tab; fillRR(g, tt.x + 22, tt.y + 40, 8, 14, 2, '#9C95B8'); fillRR(g, tt.x + 10, tt.y + 50, 32, 5, 2, '#B9B2D3'); fillRR(g, tt.x, tt.y, 52, 42, 6, '#221C40'); fillRR(g, tt.x + 3, tt.y + 3, 46, 36, 3, '#FFFFFF');
    var pr = T.printer; fillRR(g, pr.x, pr.y, 54, 42, 8, '#ECE8F5'); fillRR(g, pr.x, pr.y, 54, 12, 6, '#D8D2EA'); fillRR(g, pr.x + 8, pr.y + 26, 12, 5, 2, C.mint); fillRR(g, pr.x + 34, pr.y + 26, 12, 5, 2, '#D8D2EA');
    fillRR(g, pr.x + 6, pr.y - 3, 42, 6, 2, '#2B2350');
    /* the conveyor out through the dock door */
    var be = T.belt; fillRR(g, be.x0, be.y, be.x1 - be.x0, 12, 6, '#3A3358'); fillRR(g, be.x0 + 2, be.y + 12, be.x1 - be.x0 - 4, 14, 5, '#8A82AA');
    g.fillStyle = '#7D759E'; for (var lg = be.x0 + 22; lg < be.x1; lg += 64) g.fillRect(lg, be.y + 26, 7, F - be.y - 26);
    soft(g, (be.x0 + be.x1) / 2, F + 4, (be.x1 - be.x0) * 0.5, 9, 0.18);
    /* the bubble-wrap roll standing on the floor */
    var wr = T.wrap; soft(g, wr.x + 16, F + 3, 22, 6, 0.2); fillRR(g, wr.x, F - 76, 32, 76, 12, 'rgba(214,236,250,.95)');
    g.fillStyle = 'rgba(255,255,255,.9)'; for (var bb = 0; bb < 12; bb++) fillE(g, wr.x + 8 + (bb % 3) * 8, F - 66 + Math.floor(bb / 3) * 15, 3, 3, 'rgba(255,255,255,.95)');
    fillRR(g, wr.x + 4, F - 80, 24, 8, 4, '#B9D8EE');
  }

  /* ---------------- the dock door: the roller door and the courier van outside ---------------- */
  function doorOpen(S, t) { var td = S.toy.door != null ? t - S.toy.door : 99, base = 0.42; if (td < 0.9) return lerp(base, 1, td / 0.9); if (td < 3.6) return 1; if (td < 4.5) return lerp(1, base, (td - 3.6) / 0.9); return base; }
  function paintWindow(g, t, par, S) {
    var dr = T.door, op = doorOpen(S, t), oy = dr.y + dr.h * (1 - op);
    g.save(); rr(g, dr.x, dr.y, dr.w, dr.h, 2); g.clip();
    var sk = g.createLinearGradient(0, dr.y, 0, F); sk.addColorStop(0, '#CFEAF7'); sk.addColorStop(0.55, '#F2F8FB'); sk.addColorStop(0.56, '#C9C4D6'); sk.addColorStop(1, '#BAB4CA'); g.fillStyle = sk; g.fillRect(dr.x, dr.y, dr.w, dr.h);
    /* the courier van's rear, doors open */
    var vx = dr.x + (dr.w - 108) / 2 - par * 2, vy = F - 168;
    fillRR(g, vx, vy, 108, 150, 10, '#FFFFFF'); fillRR(g, vx + 6, vy + 8, 96, 108, 6, '#3A3358'); parcel(g, vx + 14, vy + 64, 36, 30, true); parcel(g, vx + 56, vy + 70, 32, 24, false); parcel(g, vx + 30, vy + 36, 30, 26, false);
    fillRR(g, vx + 4, vy + 120, 100, 14, 4, '#D8D2EA'); text(g, 'PARCEL LANE', vx + 54, vy + 131, 7.5, 800, C.violet, 'center');
    fillE(g, vx + 18, F - 12, 9, 9, '#2B2350'); fillE(g, vx + 90, F - 12, 9, 9, '#2B2350');
    /* the roller door's slats */
    for (var y = dr.y; y < oy; y += 10) { fillRR(g, dr.x, y, dr.w, 10, 2, (Math.floor((y - dr.y) / 10) % 2) ? '#B9B2D3' : '#C9C3DE'); g.fillStyle = 'rgba(40,30,80,.12)'; g.fillRect(dr.x, y + 8, dr.w, 2); }
    if (oy > dr.y + 4) { fillRR(g, dr.x, oy - 8, dr.w, 10, 3, '#8A82AA'); fillRR(g, dr.x + dr.w / 2 - 14, oy - 4, 28, 6, 3, '#FFD84A'); }
    g.restore();
  }

  /* ---------------- live back: order slips, the dashboard, the low bin ---------------- */
  var SLIPS = [['WEB', '#1042', 0], ['MKT A', '#A-5531', 1], ['MKT B', '#B-2208', 2], ['WEB', '#1043', 0]];
  function paintLive(g, t, now, S) {
    wideLive(g, t, S);
    var rl = T.rail, on = S.hot === 'order', shift = on ? clamp((t - (S.ordT || 0)) / 0.8, 0, 1) : 1;
    for (var i = 0; i < 4; i++) {
      var s = SLIPS[i], x = rl.x + 2 + i * 44, dy = i === 3 ? (on ? (1 - shift) * -60 : 0) : 0, sw = Math.sin(t * 1.6 + i) * 0.03;
      if (i === 3 && !on) continue;
      g.save(); g.translate(x + 19, rl.y + 6 + dy); g.rotate(sw); fillRR(g, -5, -4, 10, 8, 2, '#5E5682');
      fillRR(g, -19, 2, 38, 54, 3, '#FFFFFF'); fillRR(g, -19, 2, 38, 10, 3, CH[s[2]].col); text(g, s[0], 0, 10, 6.5, 800, '#FFFFFF', 'center');
      text(g, s[1], 0, 24, 6.5, 800, C.ink, 'center'); g.fillStyle = '#D8D2EA'; g.fillRect(-13, 30, 26, 2); g.fillRect(-13, 36, 20, 2); g.fillRect(-13, 42, 24, 2); g.restore();
    }
    /* the dashboard: three channel bars that breathe, a counter */
    var tv = T.tv, n = 118 + Math.floor(t / 4) % 20, hi = S.hot === 'report' || S.peek === 'report';
    text(g, 'Orders today', tv.x + 12, tv.y + 35, 7, 700, '#6B6B84'); text(g, String(n), tv.x + 12, tv.y + 56, 17, 800, C.ink);
    var vals = [0.82, 0.56, 0.38];
    for (var b = 0; b < 3; b++) { var bh = 54 * vals[b] * (0.92 + Math.sin(t * 1.3 + b) * 0.08) * (hi ? 1.06 : 1), bx = tv.x + 76 + b * 26;
      fillRR(g, bx, tv.y + 94 - bh, 18, bh, 3, CH[b].col); text(g, CH[b].k.replace('MKT ', ''), bx + 9, tv.y + 103, 6, 800, '#6B6B84', 'center'); }
    g.strokeStyle = C.mintD; g.lineWidth = 2; g.beginPath(); for (var p = 0; p < 7; p++) { var px = tv.x + 12 + p * 9, py = tv.y + 92 - (hash(p + Math.floor(t / 4)) * 14 + p * 2); if (p) g.lineTo(px, py); else g.moveTo(px, py); } g.stroke();
    /* the low bin: blinks and raises a reorder on the Restock stop */
    var rk = T.rack, bx2 = rk.x + 12 + 88, ly = rk.y + 90, rs = S.hot === 'restock', blink = Math.floor(t * 2.5) % 2 === 0;
    fillRR(g, bx2 + 4, ly - 30, 30, 10, 2, rs && blink ? '#FFD84A' : '#FFFFFF'); text(g, rs ? 'REORDER' : 'LOW', bx2 + 19, ly - 22.5, 6, 800, rs ? C.ink : '#E0456B', 'center');
    if (rs) { var u = clamp((t - (S.rsT || 0)) / 1.2, 0, 1); parcel(g, bx2 + 6, ly - 58 + (1 - u) * -80, 26, 18, true); }
  }

  /* ---------------- live front: the tablet, the label, the helpdesk screen, the parcels, the bubbles ---------------- */
  var BOXES = [{ w: 46, h: 30 }, { w: 38, h: 36 }, { w: 52, h: 26 }];
  function paintFrontLive(g, t, S) {
    pick(g, t, S, true);
    var tt = T.tab, pay = S.hot === 'pay' || S.peek === 'pay', cyc = (t % 6) / 6, paid = pay || cyc > 0.45;
    text(g, '#1042', tt.x + 7, tt.y + 13, 6.5, 800, C.ink); text(g, 'S$ 49.80', tt.x + 45, tt.y + 13, 6, 700, '#6B6B84', 'right');
    fillRR(g, tt.x + 6, tt.y + 20, 40, 13, 6, paid ? C.mintD : '#ECE8F5'); text(g, paid ? 'PAID ✓' : 'paying…', tt.x + 26, tt.y + 29.5, 6.5, 800, paid ? '#FFFFFF' : '#6B6B84', 'center');
    /* the label printer: a label slides out, the full courier label on the Ship stop */
    var pr = T.printer, sh = S.hot === 'ship', len = sh ? clamp((t - (S.shT || 0)) * 30, 6, 44) : 6 + ((t % 5) < 1.2 ? (t % 5) / 1.2 * 16 : 16 * Math.max(0, 1 - ((t % 5) - 1.2) / 0.6));
    g.save(); rr(g, pr.x - 30, pr.y - 60, 120, 60, 0); g.clip(); fillRR(g, pr.x + 9, pr.y - len, 36, len, 2, '#FFFFFF');
    if (len > 26) { g.fillStyle = C.ink; for (var bc = 0; bc < 9; bc++) g.fillRect(pr.x + 13 + bc * 3.2, pr.y - len + 5, bc % 3 ? 1.4 : 2.4, 10); text(g, 'PL1042SG', pr.x + 27, pr.y - len + 23, 5.5, 800, C.ink, 'center'); }
    g.restore();
    /* the helpdesk screen: a ticket, a reply typing */
    var mn = T.mon, sup = S.hot === 'support' || S.peek === 'support';
    fillRR(g, mn.x + 4, mn.y + 4, 62, 10, 3, C.mintD); text(g, 'HELPDESK', mn.x + 8, mn.y + 11.5, 6, 800, '#FFFFFF');
    text(g, '#318 Return', mn.x + 8, mn.y + 24, 6.2, 800, C.ink); g.fillStyle = '#D8D2EA'; g.fillRect(mn.x + 8, mn.y + 29, 44, 2); g.fillRect(mn.x + 8, mn.y + 34, 34, 2);
    fillRR(g, mn.x + 8, mn.y + 38, 50, 9, 4, sup ? C.violet : '#ECE8F5');
    for (var d = 0; d < 3; d++) fillE(g, mn.x + 18 + d * 7, mn.y + 42.5, 1.6, 1.6 + (Math.floor(t * 4) % 3 === d ? 0.6 : 0), sup ? '#FFFFFF' : '#9C95B8');
    /* parcels ride the conveyor out through the door (they hop when tapped) */
    var be = T.belt, span = be.x1 - be.x0 + 60, off = (t * 22) % span, tp = S.toy.parcel != null ? t - S.toy.parcel : 99;
    g.save(); rr(g, be.x0, be.y - 70, T.door.x + T.door.w - be.x0 - 6, 82, 2); g.clip();
    g.fillStyle = '#4A4370'; for (var sl = be.x0 - 20 + (t * 22) % 20; sl < be.x1; sl += 20) g.fillRect(sl, be.y + 2, 2, 8);
    BOXES.forEach(function (bx, j) { var x = be.x0 - 50 + ((j * span / BOXES.length + off) % span), hop = tp < 0.7 ? Math.max(0, Math.sin((tp - j * 0.08) / 0.6 * Math.PI)) * 22 : 0;
      parcel(g, x, be.y - bx.h - hop, bx.w, bx.h, j % 2 === 0); fillRR(g, x + bx.w - 20, be.y - bx.h + 8 - hop, 14, 10, 2, '#FFFFFF'); g.fillStyle = C.ink; g.fillRect(x + bx.w - 17, be.y - bx.h + 11 - hop, 8, 1.6); });
    g.restore();
    /* bubble wrap: pops */
    var tw = S.toy.wrap != null ? t - S.toy.wrap : 99, wr = T.wrap;
    if (tw < 1.1) for (var pp = 0; pp < 5; pp++) { var a = -Math.PI / 2 + (pp - 2) * 0.5, r0 = 30 + tw * 40, al = (1 - tw / 1.1).toFixed(2);
      g.strokeStyle = 'rgba(109,91,208,' + al + ')'; g.lineWidth = 2.4; g.lineCap = 'round'; g.beginPath(); g.moveTo(wr.x + 16 + Math.cos(a) * r0, F - 60 + Math.sin(a) * r0); g.lineTo(wr.x + 16 + Math.cos(a) * (r0 + 9), F - 60 + Math.sin(a) * (r0 + 9)); g.stroke();
      if (pp === 2) text(g, 'POP!', wr.x + 16, F - 96 - tw * 26, 12, 800, 'rgba(109,91,208,' + al + ')', 'center'); }
  }

  var KAI = { x: 714, y: 458, s: 0.56, ph: 0.5, c: { skin: '#C68B5E', hair: '#1F1A1A', top: C.violet, low: '#2B2350', shoe: '#F7F8FB', hat: C.mint, hatBand: null }, outfit: 'hoodie', hat: 'cap', hold: 'box', hairStyle: 'short', beard: '#1F1A1A', glasses: true,
    feet: false, mood: 'calm', look: 0, talk: false, hands: [[-60, -212], [64, -216]] };
  var NORA = { x: 286, y: 458, s: 0.56, ph: 1.7, c: { skin: '#F3CDA8', hair: '#4A2E22', top: C.mintD, shirt: '#FFFFFF', pocket: '#FFD84A' }, outfit: 'blazer', headset: C.violet, glasses: true, hairStyle: 'long',
    feet: false, mood: 'calm', look: 0, talk: false, hands: [[-62, -186], [62, -186]] };

  /* the foreground, nearest last: each prop stands at a y, sorted with the front-row passers-by (K.zfore) */
  function FORE() {
    return [
      [680, function (g, ext) {
    if (ext.l < -600) { for (var p2 = 0; p2 < 3; p2++) parcel(g, -880 + p2 * 50, 640 - p2 * 6, 48, 40 + p2 * 6, p2 % 2 === 0); fillRR(g, -890, 680, 170, 10, 3, '#C99A6B'); soft(g, -810, 694, 100, 8, 0.25); }
      }],
      [652, function (g, ext) {
    if (ext.r > 1060) { var cx = 1100; fillRR(g, cx, 560, 40, 90, 10, '#FFD84A'); fillRR(g, cx + 4, 600, 32, 10, 3, '#2B2350'); text(g, 'CAUTION', cx + 20, 590, 7, 800, '#2B2350', 'center'); soft(g, cx + 20, 654, 30, 6, 0.25); }
      }],
      [702, function (g, ext) {
    if (ext.l < -480) { var px = -640; K.soft(g, px + 70, 706, 90, 8, 0.25); pallet(g, px, 700, 140); for (var r = 0; r < 3; r++) for (var c = 0; c < 3 - (r === 2 ? 1 : 0); c++) parcel(g, px + 6 + c * 44 + (r === 2 ? 22 : 0), 688 - r * 36 - 34, 42, 34, (r + c) % 2 === 0);
      g.fillStyle = 'rgba(220,235,245,.35)'; g.fillRect(px + 4, 580, 132, 108); }
      }]
    ];
  }
  window.IXW.worlds.ecommerce = {
    calmView: [190,0,720,576], /* calm layer: the framed hero shows the core of the scene */
    pan: [-440, 1280], /* phones: how far the scene drags each way (set units), ending on whole objects */
    room: ROOM, paintBack: paintBack, paintFront: paintFront, paintWindow: paintWindow, paintLive: paintLive, paintFrontLive: paintFrontLive, paintForeLive: function (g, t, S) { K.zfore(g, t, S, FORE(), function () { pick(g, t, S, 'fore'); }); },
    moteCol: 'rgba(255,255,255,.7)',
    glow: {
      order: function (g) { var rl = T.rail; rr(g, rl.x - 12, rl.y - 18, rl.w + 24, 82, 12); },
      pay: function (g) { rr(g, T.tab.x - 8, T.tab.y - 8, 68, 70, 12); },
      ship: function (g) { var pr = T.printer; rr(g, pr.x - 8, pr.y - 30, 70, 80, 12); },
      restock: function (g) { var rk = T.rack; rr(g, rk.x - 10, rk.y - 10, rk.w + 20, rk.h + 14, 14); },
      support: function (g) { rr(g, T.mon.x - 8, T.mon.y - 8, 86, 84, 12); },
      report: function (g) { var tv = T.tv; rr(g, tv.x - 8, tv.y - 8, tv.w + 16, tv.h + 16, 14); },
      door: function (g) { var dr = T.door; rr(g, dr.x - 14, dr.y - 16, dr.w + 28, dr.h + 14, 12); },
      parcel: function (g) { var be = T.belt; rr(g, be.x0 - 6, be.y - 52, 200, 86, 12); },
      wrap: function (g) { rr(g, T.wrap.x - 8, F - 88, 48, 94, 12); }
    },
    backGlow: ['order', 'restock', 'report', 'door'],
    cast: [
      { id: 'nora', behind: true, keys: ['support'], P: NORA, act: function (P, t, S) {
        var st = S.cast.nora, busy = S.hot === 'support';
        P.talk = t < st.until || (busy && (t % 2.4) < 1.4); P.mood = P.talk || busy ? 'happy' : 'calm';
        var tap = busy ? Math.abs(Math.sin(t * 9)) * 7 : 0;
        P.hands = t < st.wave ? [[-62, -186], [128 + Math.sin(t * 12) * 16, -404]] : [[-62, -186 + tap], [62, -186 + (busy ? Math.abs(Math.cos(t * 9)) * 7 : 0)]];
        P.look = lerp(P.look, clamp((S.nexi.x - P.x) / 160, -1, 1), 0.08);
      } },
      { id: 'kai', behind: true, keys: ['ship', 'pay'], P: KAI, act: function (P, t, S) {
        var st = S.cast.kai, busy = S.hot === 'ship', lift = busy ? Math.abs(Math.sin(t * 3)) * 18 : Math.sin(t * 1.4) * 3;
        P.talk = t < st.until; P.mood = P.talk || busy ? 'happy' : 'calm';
        P.hold = t < st.wave ? null : 'box';
        P.hands = t < st.wave ? [[-60, -212], [128 + Math.sin(t * 12) * 16, -404]] : [[-60, -212 - lift], [64, -216 - lift]];
        P.look = lerp(P.look, clamp((S.nexi.x - P.x) / 160, -1, 1), 0.08);
      } }
    ],
    onStop: function (key, S, t) { if (key === 'order') S.ordT = t; if (key === 'restock') S.rsT = t; if (key === 'ship') { S.shT = t; S.toy.parcel = t; } }
  };
  /* ---------------- audit round: a marked-out floor (the pick lane with zone letters), a small robot cart that shuttles
     totes along it (tap it: it stops, beeps and spins its light), and a hand truck of parcels right of the tracking card ---------------- */
  var AGV = { x0: -560, x1: 940, y: 578, beep: -9, paid: 0 };
  function agvT(t) { var d = t - AGV.beep; return d < 2.5 ? AGV.beep - AGV.paid : t - AGV.paid - 2.5; }
  function exFloor(g, ext) {
    g.fillStyle = 'rgba(255,216,74,.85)'; g.fillRect(ext.l, 546, ext.r - ext.l, 5); g.fillRect(ext.l, 606, ext.r - ext.l, 5);
    g.fillStyle = 'rgba(109,91,208,.07)'; g.fillRect(ext.l, 551, ext.r - ext.l, 55);
    [['A \u00B7 PICK', -440], ['B \u00B7 PACK', 160], ['C \u00B7 SHIP', 760]].forEach(function (z) { if (z[1] < ext.l - 60 || z[1] > ext.r) return;
      fillRR(g, z[1] - 44, 618, 88, 22, 5, 'rgba(43,35,80,.10)'); text(g, z[0], z[1], 634, 11, 800, 'rgba(43,35,80,.42)', 'center'); });
    for (var x = Math.floor(ext.l / 120) * 120; x < ext.r; x += 120) { g.fillStyle = 'rgba(43,35,80,.12)'; g.beginPath(); g.moveTo(x, 572); g.lineTo(x + 14, 578); g.lineTo(x, 584); g.closePath(); g.fill(); }
  }
  function agvX(t) { var span = AGV.x1 - AGV.x0, u = (t * 48) % (span * 2); return { x: AGV.x0 + (u < span ? u : span * 2 - u), dir: u < span ? 1 : -1 }; }
  function exFore(g, t, S) {
    var ext = S.ext, p = agvX(agvT(t)), d = t - AGV.beep;
    var x = p.x, y = AGV.y; if (x > ext.l - 60 && x < ext.r + 60) {
      soft(g, x, y + 3, 48, 6, 0.24); fillRR(g, x - 40, y - 22, 80, 20, 8, '#E9E4F4'); fillRR(g, x - 40, y - 10, 80, 8, 4, '#C9C1E2');
      fillE(g, x - 26, y - 2, 6, 6, '#2B2350'); fillE(g, x + 26, y - 2, 6, 6, '#2B2350'); fillRR(g, x + p.dir * 30 - 4, y - 18, 8, 6, 3, '#3CCFAE');
      fillRR(g, x - 30, y - 50, 60, 28, 5, '#6D5BD0'); fillRR(g, x - 30, y - 50, 60, 7, 3, '#5443B5'); fillRR(g, x - 16, y - 62, 32, 16, 3, '#C99A6B'); g.fillStyle = 'rgba(255,240,210,.5)'; g.fillRect(x - 3, y - 62, 6, 16);
      g.fillStyle = '#2B2350'; g.fillRect(x - 1, y - 78, 2, 16); var on = d >= 0 && d < 2.5, bl = on ? (Math.floor(t * 8) % 2 ? '#FF6B6B' : '#FFD84A') : (Math.floor(t * 2) % 2 ? '#3CCFAE' : '#8EE8D2'); fillE(g, x, y - 80, 4.5, 4.5, bl);
      if (on) { fillRR(g, x + 12, y - 112, 44, 20, 8, '#FFFFFF'); text(g, 'beep!', x + 34, y - 98, 9, 800, '#6D5BD0', 'center'); }
    }
    if (ext.r > 970) { /* a hand truck of parcels */
      var hx = 952, hy = 640; soft(g, hx, hy + 3, 44, 6, 0.22); g.strokeStyle = '#5C6670'; g.lineWidth = 5; g.beginPath(); g.moveTo(hx + 28, hy - 6); g.lineTo(hx + 36, hy - 118); g.stroke();
      fillRR(g, hx - 30, hy - 10, 64, 8, 3, '#5C6670'); fillE(g, hx + 24, hy - 2, 7, 7, '#2B2350');
      parcel(g, hx - 28, hy - 48, 52, 38, true); parcel(g, hx - 24, hy - 80, 44, 32, false); parcel(g, hx - 18, hy - 104, 34, 24, true);
    }
  }
  function exHit(x, y, S, t) { if (t - AGV.beep < 2.5) return false; var at = agvT(t), p = agvX(at); if (Math.abs(x - p.x) < 50 && y > AGV.y - 90 && y < AGV.y + 10) { AGV.paid = t - at; AGV.beep = t; return true; } return false; }
  (function (W) { var pb = W.paintBack, pf = W.paintForeLive, h0 = W.hit;
    W.paintBack = function (g, ext) { exFloor(g, ext); pb(g, ext); };
    W.paintForeLive = function (g, t, S) { exFore(g, t, S); pf(g, t, S); };
    W.hit = function (x, y, S, t, onBtn) { if (!onBtn && exHit(x, y, S, t)) return null; return h0 ? h0(x, y, S, t, onBtn) : null; };
  })(window.IXW.worlds.ecommerce);
})(window.IXW && window.IXW.kit);
