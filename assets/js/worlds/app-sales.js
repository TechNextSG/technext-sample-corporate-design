/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: app-sales (/odoo/apps/sales) — Odoo Sales as a bright SHOWROOM COUNTER: the shop under a striped awning with
   blinking bulbs, a glass cabinet whose price tags flip between pricelists, the quotation on a gold-framed menu board that
   fills line by line (the optional extra joins when the gift box opens), a ticket rail where the sales order and the
   delivery and invoice slips hang, the customer portal where the quote is signed and paid, a receipt printer, a counter
   bell and the till. Through the windows a delivery van pulls up and drives off. Cast (client team and their customer,
   grey passes): the sales rep and sales ops stand behind the counter, the customer signs on her tablet, the sales manager
   minds the pricelists. TechNext consultants (blue IDs) walk through with samples. Every person has an idle loop and a tap
   routine of their own. Sample figures only. */
(function (K, CR, CO) {
  'use strict';
  if (!K || !CR || !CO) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed;
  var F = 470, CEIL = -150, ROSE = '#E46E78', RD = '#C24E5D', PUR = '#714B67', OK = '#1E9E6A', BLUE = '#3167CA', GOLD = '#E0B04A', GL = '#F6D88E', INK = '#1B1F3B', CREAM = '#FFF7F0';
  var QS = { x: 332, y: -100, w: 280, h: 196 }, DSH = { x: 340, y: 106, w: 264, h: 70 }, ORD = { x: 780, y: -64, w: 96, h: 96 }, DLV = { x: 890, y: -64, w: 96, h: 96 }, SGN = { x: 778, y: 50, w: 210, h: 82 },
    CAB = { x: 170, y: 58, w: 148 }, CTR = { x: 360, y: 362, w: 540 }, GIFT = { x: 404, y: 362 }, WINL = { x: 176, y: -96, w: 134, h: 132 },
    WINS = [{ x: -900, y: -96, w: 360, h: 300 }, { x: 1030, y: -96, w: 300, h: 300 }];
  var QL = [['Barcode scanner', '× 6', '1,080.00'], ['Label printer', '× 2', '460.00'], ['Set-up service', '× 1', '300.00'], ['Optional: carry case', '× 6', '120.00']];
  var TAGS = [['Retail', '190', '#FFFFFF'], ['Reseller', '180', '#FFF1D6'], ['10+ units', '172', '#E8F7EF']];
  function setU(g, sx, sy, k) { g.translate(sx, sy); g.scale(k, k); }
  function extOf(W, H, k, sx, sy) { return { l: -(sx + 24) / k, r: (W - sx) / k, t: -(sy + 24) / k, b: (H - sy) / k }; }
  function tick(g, x, y, r) { fillE(g, x, y, r, r, OK); g.strokeStyle = '#FFFFFF'; g.lineWidth = r * 0.3; g.beginPath(); g.moveTo(x - r * 0.45, y); g.lineTo(x - r * 0.1, y + r * 0.35); g.lineTo(x + r * 0.5, y - r * 0.35); g.stroke(); }
  function prod(g, x, y, kind, s) { /* a product on display: scanner, printer or case */
    g.save(); g.translate(x, y); g.scale(s || 1, s || 1);
    if (kind === 0) { fillRR(g, -16, -30, 30, 16, 6, '#2A3142'); fillRR(g, -6, -16, 12, 16, 4, '#3D4560'); fillRR(g, -16, -27, 6, 10, 2, '#E2453C'); }
    else if (kind === 1) { fillRR(g, -18, -26, 36, 26, 4, '#F4F6FA'); fillRR(g, -14, -22, 28, 6, 2, '#3D4560'); fillRR(g, -10, -10, 20, 10, 1, '#FFFFFF'); }
    else { fillRR(g, -18, -24, 36, 24, 6, ROSE); fillRR(g, -8, -30, 16, 8, 4, RD); fillRR(g, -18, -14, 36, 3, 1, 'rgba(255,255,255,.4)'); }
    g.restore();
  }
  function giftBox(g, x, y, w, h, col, rib) { fillRR(g, x, y, w, h, 3, col); g.fillStyle = rib; g.fillRect(x + w / 2 - 2.5, y, 5, h); fillRR(g, x - 2, y - 6, w + 4, 8, 2, K.tone(col, 0.1)); g.fillRect(x + w / 2 - 2.5, y - 6, 5, 8); fillE(g, x + w / 2 - 5, y - 9, 5, 3.4, rib); fillE(g, x + w / 2 + 5, y - 9, 5, 3.4, rib); }
  function bag(g, x, y, col) { fillRR(g, x - 14, y - 36, 28, 36, 3, col); g.strokeStyle = K.tone(col, 0.3); g.lineWidth = 2.5; g.beginPath(); g.arc(x, y - 36, 8, Math.PI, 0); g.stroke(); fillRR(g, x - 14, y - 36, 28, 6, 2, 'rgba(255,255,255,.35)'); }

  function street(g, w, t, van) { /* the view through a shop window: the shops across the road, trees, the pavement; the van drives by */
    var sg = g.createLinearGradient(0, w.y, 0, w.y + w.h); sg.addColorStop(0, '#86C4F2'); sg.addColorStop(1, '#E8F4FD'); g.fillStyle = sg; g.fillRect(w.x, w.y, w.w, w.h);
    var base = w.y + w.h * 0.82; for (var i = 0; i < 12; i++) { var bx = w.x - 20 + i * 52; if (bx > w.x + w.w) break; var bh = 80 + hash(i + w.x) * 70; fillRR(g, bx, base - bh, 48, bh, 3, ['#F4D9C6', '#EDE1F2', '#D9E8F5', '#F7E7B9'][i % 4]);
      for (var r = 0; r < 4; r++) for (var c = 0; c < 3; c++) fillRR(g, bx + 6 + c * 14, base - bh + 10 + r * 18, 9, 11, 1.5, 'rgba(255,255,255,.7)'); fillRR(g, bx, base - 22, 48, 6, 1, ['#E46E78', '#3167CA', '#2E9C7E', '#F2A33A'][i % 4]); }
    g.fillStyle = '#C9CED8'; g.fillRect(w.x, base, w.w, w.h * 0.18); g.fillStyle = '#E3E6EC'; g.fillRect(w.x, base, w.w, 6);
    for (var tr = 0; tr < 4; tr++) { var tx = w.x + 30 + tr * 110; fillRR(g, tx - 2, base - 40, 4, 40, 2, '#7A5A3A'); fillE(g, tx, base - 50, 22, 18, '#5DBB7D'); fillE(g, tx - 8, base - 56, 12, 10, '#7FD49A'); }
    if (van) { var vx = w.x - 140 + ((t * 30) % (w.w + 300)); g.save(); g.translate(vx, base + 18); fillRR(g, 0, -42, 80, 34, 5, '#FFFFFF'); fillRR(g, 80, -34, 30, 26, 5, '#FFFFFF'); fillRR(g, 86, -30, 18, 12, 2, '#9FD0F2'); fillRR(g, 6, -34, 68, 8, 2, ROSE);
      text(g, 'DELIVERY', 40, -18, 8, 800, RD, 'center'); fillE(g, 20, -6, 8, 8, INK); fillE(g, 90, -6, 8, 8, INK); fillE(g, 20, -6, 3, 3, '#C9D2DE'); fillE(g, 90, -6, 3, 3, '#C9D2DE'); g.restore(); }
  }
  function awning(g, x0, x1, y, t) { /* the striped awning; its scalloped edge carries the bulbs */
    for (var x = Math.floor(x0 / 36) * 36; x < x1; x += 36) { fillRR(g, x, y, 36, 34, 0, (Math.round(x / 36) % 2) ? '#FFFFFF' : ROSE); g.fillStyle = (Math.round(x / 36) % 2) ? '#FFFFFF' : ROSE; g.beginPath(); g.arc(x + 18, y + 34, 18, 0, Math.PI); g.fill(); }
    g.fillStyle = 'rgba(120,30,40,.12)'; g.fillRect(x0, y + 26, x1 - x0, 8); fillRR(g, x0, y - 4, x1 - x0, 6, 0, RD);
  }

  function paintBg(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    var wg = g.createLinearGradient(0, CEIL, 0, F); wg.addColorStop(0, '#FFF6F3'); wg.addColorStop(1, '#FBE6E6'); g.fillStyle = wg; g.fillRect(e.l, CEIL, e.r - e.l, F - CEIL);
    g.strokeStyle = 'rgba(194,78,93,.07)'; g.lineWidth = 3; g.beginPath(); for (var x = Math.floor(e.l / 18) * 18; x < e.r; x += 18) { g.moveTo(x, -110); g.lineTo(x, F); } g.stroke();
    [WINL].concat(WINS).forEach(function (w) { street(g, w, 0, false); });
    g.fillStyle = '#F6D2D5'; g.fillRect(e.l, 300, e.r - e.l, F - 300); fillRR(g, e.l, 296, e.r - e.l, 6, 0, GOLD); fillRR(g, e.l, F - 14, e.r - e.l, 14, 0, '#E9B9BF');
    CO.ceiling(g, e, CEIL, '#FCEFEF', '#FFF9F8', null);
    /* the shop fascia above the awning */
    fillRR(g, e.l, e.t, e.r - e.l, -154 - e.t, 0, '#FBE3E6'); g.fillStyle = GOLD; g.fillRect(e.l, -160, e.r - e.l, 3);
    for (var fx = Math.floor(e.l / 60) * 60; fx < e.r; fx += 60) fillE(g, fx + 30, -172, 3, 3, 'rgba(224,176,74,.55)');
    /* the floor: big cream and blush tiles */
    var fg = g.createLinearGradient(0, F, 0, e.b); fg.addColorStop(0, '#FBF1EC'); fg.addColorStop(1, '#F0DCD6'); g.fillStyle = fg; g.fillRect(e.l, F, e.r - e.l, e.b - F);
    var rows = [F, F + 22, F + 50, F + 86, F + 132, F + 190, F + 262, F + 350]; for (var r = 0; r < rows.length - 1; r++) { var tw = 40 + r * 14; for (var tx = Math.floor(e.l / tw) * tw; tx < e.r; tx += tw) if ((Math.round(tx / tw) + r) % 2) fillRR(g, tx, rows[r], tw, rows[r + 1] - rows[r], 0, 'rgba(228,110,120,.13)'); }
    g.fillStyle = 'rgba(120,40,50,.08)'; g.fillRect(e.l, F, e.r - e.l, 5);
    g.restore();
  }
  function paintWindow(g, t) { [WINL].concat(WINS).forEach(function (w, i) { g.save(); g.beginPath(); g.rect(w.x, w.y, w.w, w.h); g.clip(); street(g, w, t + i * 4, true); g.restore(); }); }
  function paintBack(g, ext) {
    /* window frames */
    [WINL].concat(WINS).forEach(function (w) { g.lineWidth = 8; g.strokeStyle = '#FFFFFF'; g.strokeRect(w.x, w.y, w.w, w.h); g.fillStyle = '#FFFFFF'; for (var m = w.x + 120; m < w.x + w.w - 20; m += 120) g.fillRect(m - 3, w.y, 6, w.h);
      fillRR(g, w.x - 10, w.y + w.h, w.w + 20, 10, 4, '#FFFFFF'); g.fillStyle = 'rgba(255,255,255,.28)'; g.beginPath(); g.moveTo(w.x + 10, w.y + w.h); g.lineTo(w.x + 40, w.y); g.lineTo(w.x + 60, w.y); g.lineTo(w.x + 30, w.y + w.h); g.closePath(); g.fill(); });
    /* the awning across the shop */
    awning(g, ext.l, ext.r, -150);
    /* the window displays under the side windows: gift boxes and bags */
    var w0 = WINS[0]; fillRR(g, w0.x, w0.y + w0.h + 10, w0.w, F - w0.y - w0.h - 10, 4, '#F2C3C9'); fillRR(g, w0.x - 6, w0.y + w0.h + 6, w0.w + 12, 8, 3, GOLD);
    giftBox(g, -860, 160, 54, 44, '#3167CA', '#FFD84A'); giftBox(g, -800, 150, 64, 54, ROSE, '#FFFFFF'); giftBox(g, -830, 110, 44, 36, '#2E9C7E', '#FFD84A'); bag(g, -700, 204, PUR); bag(g, -668, 204, GOLD); bag(g, -600, 204, ROSE);
    var w1 = WINS[1]; fillRR(g, w1.x, w1.y + w1.h + 10, w1.w, F - w1.y - w1.h - 10, 4, '#F2C3C9'); fillRR(g, w1.x - 6, w1.y + w1.h + 6, w1.w + 12, 8, 3, GOLD);
    /* the pricelist cabinet: glass shelves of products */
    var c = CAB; soft(g, c.x + c.w / 2, F + 4, 90, 9, 0.3); fillRR(g, c.x, c.y, c.w, F - c.y, 6, '#FFFFFF'); fillRR(g, c.x + 6, c.y + 6, c.w - 12, 236, 4, 'rgba(210,235,250,.55)');
    fillRR(g, c.x - 4, c.y - 8, c.w + 8, 12, 4, RD); fillRR(g, c.x + 6, c.y + 250, c.w - 12, F - c.y - 260, 4, '#F6D2D5'); fillRR(g, c.x + c.w / 2 - 10, c.y + 290, 20, 5, 2, GOLD);
    [74, 144, 214].forEach(function (sy, i) { fillRR(g, c.x + 6, c.y + sy, c.w - 12, 4, 1, 'rgba(255,255,255,.95)'); g.fillStyle = 'rgba(120,150,180,.25)'; g.fillRect(c.x + 6, c.y + sy + 4, c.w - 12, 2);
      for (var p = 0; p < 3; p++) prod(g, c.x + 30 + p * 44, c.y + sy, (p + i) % 3, 1); });
    g.fillStyle = 'rgba(255,255,255,.5)'; g.beginPath(); g.moveTo(c.x + 14, c.y + 240); g.lineTo(c.x + 40, c.y + 8); g.lineTo(c.x + 54, c.y + 8); g.lineTo(c.x + 28, c.y + 240); g.closePath(); g.fill();
    text(g, 'PRICELISTS', c.x + c.w / 2, c.y + 1, 7, 800, '#FFFFFF', 'center');
    /* the quotation: a gold-framed menu board */
    shadowed(g, 14, 5, 0.18, function () { fillRR(g, QS.x - 8, QS.y - 8, QS.w + 16, QS.h + 16, 10, GOLD); }); fillRR(g, QS.x - 4, QS.y - 4, QS.w + 8, QS.h + 8, 8, GL);
    fillRR(g, QS.x, QS.y, QS.w, QS.h, 4, '#FFFFFF'); fillRR(g, QS.x, QS.y, QS.w, 22, 4, PUR); g.fillRect(QS.x, QS.y + 14, QS.w, 8); text(g, 'Sales · Quotation S00042 · sample', QS.x + 10, QS.y + 15, 8, 800, '#FFFFFF');
    /* the sales board under it */
    shadowed(g, 10, 4, 0.16, function () { fillRR(g, DSH.x, DSH.y, DSH.w, DSH.h, 10, INK); }); text(g, 'SALES THIS MONTH · BY REP · BY PRODUCT', DSH.x + 12, DSH.y + 15, 6.6, 800, '#F9C5CB');
    /* the ticket rail with its hanging slips, and the customer portal */
    fillRR(g, 772, -76, 222, 6, 3, '#9AA6BC'); [ORD, DLV].forEach(function (b, i) { fillRR(g, b.x + b.w / 2 - 5, b.y - 12, 10, 16, 2, i ? BLUE : PUR);
      shadowed(g, 8, 3, 0.16, function () { g.fillStyle = CREAM; g.beginPath(); g.moveTo(b.x, b.y); g.lineTo(b.x + b.w, b.y); g.lineTo(b.x + b.w, b.y + b.h); for (var z = 0; z < 8; z++) g.lineTo(b.x + b.w - (z + 0.5) * b.w / 8, b.y + b.h + (z % 2 ? 0 : -5)); g.lineTo(b.x, b.y + b.h); g.closePath(); g.fill(); });
      fillRR(g, b.x, b.y, b.w, 16, 2, i ? '#2E9C7E' : BLUE); text(g, i ? 'Deliver & invoice' : 'Sales order', b.x + 6, b.y + 11, 6.6, 800, '#FFFFFF'); });
    shadowed(g, 12, 4, 0.18, function () { fillRR(g, SGN.x - 5, SGN.y - 5, SGN.w + 10, SGN.h + 10, 8, '#2A3142'); }); fillRR(g, SGN.x, SGN.y, SGN.w, SGN.h, 3, '#FFFFFF');
    fillRR(g, SGN.x, SGN.y, SGN.w, 15, 3, ROSE); g.fillRect(SGN.x, SGN.y + 8, SGN.w, 7); text(g, 'Customer portal · sign & pay', SGN.x + 8, SGN.y + 11, 6.6, 800, '#FFFFFF');
    /* the shelf of boxes and bags over the counter's right end */
    fillRR(g, 784, 190, 206, 6, 2, '#B0707B'); giftBox(g, 792, 162, 30, 28, '#3167CA', '#FFD84A'); giftBox(g, 830, 158, 36, 32, ROSE, '#FFFFFF'); bag(g, 892, 190, PUR); bag(g, 924, 190, GOLD); giftBox(g, 950, 166, 30, 24, '#2E9C7E', '#FFFFFF');
    /* the right wall: a hanging OPEN sign by the door and a topiary */
    fillRR(g, 1340, -10, 70, F + 10, 4, '#FFFFFF'); fillRR(g, 1346, -4, 58, F - 2, 3, 'rgba(210,235,250,.6)'); fillE(g, 1352, 240, 4, 4, GOLD);
    K.plant(g, { x: 1006, y: F }, '#FFFFFF', '#F2C3C9'); K.plant(g, { x: -520, y: F }, ROSE, '#F28C96');
    leftWall(g);
  }
  /* the wall behind the title card ("View the scene" shows it): a pegboard of products, the chalk pricelist, the shop clock,
     and the demo corner where the shop assistant tries the products out */
  var PEG = { x: -446, y: -40, w: 196, h: 250 }, CHK = { x: -222, y: -46, w: 190, h: 196 }, STK = { x: -26 };
  var PL = [['Barcode scanner', '190', '180', '172'], ['Label printer', '240', '230', '218'], ['Carry case', '22', '20', '18'], ['Set-up service', '300', '300', '300']];
  function leftWall(g) {
    var p = PEG; shadowed(g, 10, 4, 0.14, function () { fillRR(g, p.x, p.y, p.w, p.h, 8, '#FFFFFF'); }); fillRR(g, p.x + 6, p.y + 6, p.w - 12, p.h - 12, 5, '#FBE9EC');
    g.fillStyle = 'rgba(194,78,93,.22)'; for (var hy = p.y + 16; hy < p.y + p.h - 8; hy += 14) for (var hx = p.x + 16; hx < p.x + p.w - 8; hx += 14) g.fillRect(hx - 1, hy - 1, 2.4, 2.4);
    fillRR(g, p.x + 30, p.y - 12, p.w - 60, 20, 6, RD); text(g, 'TRY BEFORE YOU BUY', p.x + p.w / 2, p.y + 2, 7.6, 800, '#FFFFFF', 'center');
    [[0, 0], [1, 1], [2, 2], [0, 1], [1, 2], [2, 0]].forEach(function (q, i) { var x = p.x + 40 + (i % 3) * 58, y = p.y + 66 + Math.floor(i / 3) * 96;
      g.strokeStyle = '#9AA6BC'; g.lineWidth = 2; g.beginPath(); g.moveTo(x, y - 40); g.lineTo(x, y - 30); g.lineTo(x + 8, y - 30); g.stroke(); prod(g, x, y, q[0], 1.15); });
    fillRR(g, p.x + 14, p.y + p.h - 34, p.w - 28, 6, 2, '#B0707B'); [0, 1, 2, 3].forEach(function (b) { giftBox(g, p.x + 22 + b * 42, p.y + p.h - 58, 30, 24, [BLUE, ROSE, '#2E9C7E', GOLD][b], b % 2 ? '#FFFFFF' : '#FFD84A'); });
    /* the chalk pricelist in a gold frame */
    var c = CHK; shadowed(g, 12, 5, 0.18, function () { fillRR(g, c.x - 8, c.y - 8, c.w + 16, c.h + 16, 8, GOLD); }); fillRR(g, c.x - 3, c.y - 3, c.w + 6, c.h + 6, 6, GL); fillRR(g, c.x, c.y, c.w, c.h, 4, '#2F3A3A');
    text(g, "TODAY'S PRICELISTS", c.x + c.w / 2, c.y + 20, 9.6, 800, '#FFFFFF', 'center'); text(g, 'sample · S$ per unit', c.x + c.w / 2, c.y + 32, 6, 700, '#B8C7C2', 'center');
    ['Retail', 'Reseller', '10+'].forEach(function (h, i) { text(g, h, c.x + 104 + i * 30, c.y + 52, 6.2, 800, ['#F9C5CB', GL, '#9FE3C8'][i], 'center'); });
    PL.forEach(function (r, i) { var y = c.y + 74 + i * 24; text(g, r[0], c.x + 12, y, 7, 700, '#FFFFFF'); for (var k2 = 0; k2 < 3; k2++) text(g, r[k2 + 1], c.x + 104 + k2 * 30, y, 7.4, 800, '#FFFFFF', 'center');
      g.strokeStyle = 'rgba(255,255,255,.18)'; g.lineWidth = 1; g.beginPath(); g.moveTo(c.x + 10, y + 8); g.lineTo(c.x + c.w - 10, y + 8); g.stroke(); });
    text(g, 'Odoo picks the right list', c.x + c.w / 2, c.y + c.h - 10, 7, 700, GL, 'center'); fillRR(g, c.x + 20, c.y + c.h + 8, c.w - 40, 6, 3, '#B0707B');
    for (var ch = 0; ch < 3; ch++) fillRR(g, c.x + 30 + ch * 12, c.y + c.h + 3, 9, 5, 2, ['#FFFFFF', '#F9C5CB', GL][ch]);
    /* the shop clock (its hands run live) */
    K.clockFace(g, { x: 70, y: -20, r: 24 }, GOLD); text(g, 'SINGAPORE', 70, 14, 6, 800, RD, 'center');
    /* the assistant's demo stock: a stack of boxed products on the floor by the wall */
    soft(g, STK.x, F + 3, 40, 6, 0.3); box2(g, STK.x - 30, F - 34, 60, 34, '#E8C9A0'); box2(g, STK.x - 24, F - 62, 48, 28, '#F0D6B4'); box2(g, STK.x - 14, F - 84, 30, 22, '#E8C9A0');
    fillRR(g, STK.x - 18, F - 26, 22, 12, 2, '#FFFFFF'); g.fillStyle = INK; for (var bb = 0; bb < 7; bb++) g.fillRect(STK.x - 16 + bb * 3, F - 24, bb % 2 ? 1 : 2, 8);
  }
  function box2(g, x, y, w, h, col) { fillRR(g, x, y, w, h, 3, col); g.fillStyle = 'rgba(0,0,0,.07)'; g.fillRect(x + w / 2 - 3, y, 6, h); fillRR(g, x + 4, y + 4, w * 0.35, 4, 1.5, 'rgba(255,255,255,.6)'); }
  function paintFront(g, ext) {
    /* the counter: a rose front with cream slats and a gold trim */
    var c = CTR; soft(g, c.x + c.w / 2, F + 6, c.w * 0.6, 10, 0.3); fillRR(g, c.x, c.y + 10, c.w, F - c.y - 10, 6, ROSE);
    for (var s = c.x + 20; s < c.x + c.w - 14; s += 22) fillRR(g, s, c.y + 26, 12, F - c.y - 40, 5, 'rgba(255,247,240,.35)');
    fillRR(g, c.x - 8, c.y, c.w + 16, 14, 5, CREAM); fillRR(g, c.x - 8, c.y + 12, c.w + 16, 4, 2, GOLD); fillRR(g, c.x, F - 8, c.w, 8, 2, RD);
    fillRR(g, c.x + c.w / 2 - 60, c.y + 46, 120, 30, 8, CREAM); text(g, 'QUOTE · SIGN · PAY', c.x + c.w / 2, c.y + 65.5, 9, 800, RD, 'center');
    /* on the counter: the rep's laptop, the bell, the receipt printer, the till, the card reader */
    fillRR(g, 500, c.y - 30, 52, 30, 3, '#C9D2DE'); fillRR(g, 494, c.y - 3, 64, 4, 2, '#9AA6BC'); fillE(g, 526, c.y - 15, 5, 5, '#FFFFFF');
    fillRR(g, 548, c.y - 4, 28, 4, 2, '#7A869C'); g.fillStyle = GOLD; g.beginPath(); g.arc(562, c.y - 4, 11, Math.PI, 0); g.fill(); fillE(g, 562, c.y - 17, 3, 3, GL);
    fillRR(g, 610, c.y - 22, 40, 22, 4, '#F4F6FA'); fillRR(g, 614, c.y - 26, 32, 5, 2, '#3D4560');
    fillRR(g, 800, c.y - 34, 66, 34, 5, '#3D4560'); fillRR(g, 806, c.y - 30, 30, 12, 2, '#9FE3C8'); for (var kq = 0; kq < 6; kq++) fillRR(g, 840 + (kq % 2) * 11, c.y - 30 + Math.floor(kq / 2) * 9, 8, 6, 1.5, '#C9D2DE');
    fillRR(g, 876, c.y - 26, 18, 26, 4, INK); fillRR(g, 879, c.y - 23, 12, 8, 1.5, '#9FE3C8');
  }
  function paintFore(g, ext) {
    /* the shop floor in front: a basket stand, a product table, an A-frame sign, a monstera */
    /* (behind the title card, back on the floor) the basket stand and a product table */
    soft(g, -420, 546, 56, 6, 0.3); for (var b = 0; b < 3; b++) { fillRR(g, -460, 506 - b * 14, 80, 30, 6, ROSE); g.strokeStyle = RD; g.lineWidth = 2; g.strokeRect(-456, 512 - b * 14, 72, 18); }
    soft(g, -260, 548, 86, 7, 0.3); fillRR(g, -330, 490, 140, 12, 4, CREAM); fillRR(g, -320, 500, 8, 46, 2, '#B0707B'); fillRR(g, -208, 500, 8, 46, 2, '#B0707B');
    giftBox(g, -316, 456, 40, 34, BLUE, '#FFD84A'); giftBox(g, -270, 446, 46, 44, ROSE, '#FFFFFF'); prod(g, -216, 490, 0, 1.2);
    /* the floor band below the card: a welcome runner with gold edges and pink arrows that lead to the counter */
    g.fillStyle = 'rgba(228,110,120,.20)'; g.fillRect(ext.l - 20, 644, ext.r - ext.l + 40, 58); g.strokeStyle = 'rgba(224,176,74,.8)'; g.lineWidth = 3; g.beginPath(); g.moveTo(ext.l - 20, 650); g.lineTo(ext.r + 20, 650); g.moveTo(ext.l - 20, 696); g.lineTo(ext.r + 20, 696); g.stroke();
    g.fillStyle = 'rgba(194,78,93,.45)'; for (var ax2 = Math.floor(ext.l / 120) * 120; ax2 < ext.r; ax2 += 120) { g.beginPath(); g.moveTo(ax2, 664); g.lineTo(ax2 + 22, 673); g.lineTo(ax2, 682); g.lineTo(ax2 + 6, 673); g.closePath(); g.fill(); }
    fillRR(g, 470, 656, 180, 34, 10, '#C24E5D'); fillRR(g, 476, 660, 168, 26, 8, '#E46E78'); text(g, 'WELCOME · QUOTES INSIDE', 560, 677, 9, 800, '#FFFFFF', 'center');
    /* a round display plinth with a gift pyramid and balloons on the left */
    soft(g, -760, 700, 100, 9, 0.3); fillE(g, -760, 690, 92, 16, '#E9B9BF'); fillRR(g, -852, 640, 184, 50, 0, '#F6D2D5'); fillE(g, -760, 640, 92, 16, CREAM); g.strokeStyle = GOLD; g.lineWidth = 3; K.ell(g, -760, 640, 92, 16); g.stroke();
    giftBox(g, -830, 594, 50, 44, BLUE, '#FFD84A'); giftBox(g, -774, 588, 56, 50, ROSE, '#FFFFFF'); giftBox(g, -712, 600, 40, 38, '#2E9C7E', '#FFD84A'); giftBox(g, -800, 552, 44, 38, PUR, GL); giftBox(g, -748, 556, 40, 34, GOLD, '#FFFFFF');
    [[-860, 470, ROSE], [-830, 450, GOLD], [-800, 476, BLUE]].forEach(function (b) { g.strokeStyle = 'rgba(30,40,70,.35)'; g.lineWidth = 1; g.beginPath(); g.moveTo(b[0], b[1] + 26); g.quadraticCurveTo(b[0] + 10, b[1] + 70, -790, 552); g.stroke(); fillE(g, b[0], b[1], 20, 25, b[2]); fillE(g, b[0] - 6, b[1] - 9, 5, 7, 'rgba(255,255,255,.45)'); });
    var ax = 1160; soft(g, ax, 706, 50, 6, 0.3); g.fillStyle = '#7A5A3A'; g.beginPath(); g.moveTo(ax - 40, 704); g.lineTo(ax - 26, 600); g.lineTo(ax + 26, 600); g.lineTo(ax + 40, 704); g.lineTo(ax + 32, 704); g.lineTo(ax + 20, 610); g.lineTo(ax - 20, 610); g.lineTo(ax - 32, 704); g.closePath(); g.fill();
    fillRR(g, ax - 30, 608, 60, 76, 3, '#2A3142'); text(g, 'QUOTES', ax, 630, 9, 800, GL, 'center'); text(g, 'in minutes', ax, 644, 7, 700, '#FFFFFF', 'center'); text(g, 'sign online', ax, 660, 7, 700, '#F9C5CB', 'center'); text(g, '✓ pay online', ax, 674, 7, 700, '#9FE3C8', 'center');
  }

  var W = CR.who;
  var REP = W({ x: 470, y: 470, s: 0.54, ph: 0.6, skin: 1, hair: 0, style: 'bob', outfit: 'cardigan', top: ROSE, top2: '#FFFFFF', headset: GOLD, id: '#9AA6BC', hands: [[-60, -206], [60, -206]], look: 0.4 });
  var OPS = W({ x: 730, y: 470, s: 0.54, ph: 1.8, skin: 3, hair: 1, style: 'short', outfit: 'polo', top: '#F2A33A', id: '#9AA6BC', hands: [[-60, -206], [60, -206]], look: -0.4 });
  var CUS = W({ x: 948, y: 470, s: 0.54, ph: 2.6, skin: 0, hair: 1, style: 'long', outfit: 'shirt', top: BLUE, id: '#9AA6BC', hold: 'tablet', hands: [[-70, -210], [70, -170]], look: -0.6 });
  var SA = W({ x: -104, y: 470, s: 0.54, ph: 0.9, skin: 1, hair: 0, style: 'pony', outfit: 'polo', top: '#2E9C7E', id: '#9AA6BC', hands: [[-60, -212], [70, -230]], look: 0.4 });
  var MGR = W({ x: 326, y: 470, s: 0.54, ph: 3.3, skin: 2, hair: 0, style: 'short', outfit: 'shirt', top: PUR, glasses: true, id: '#9AA6BC', hold: 'clipboard', hands: [[-60, -212], [70, -170]], look: -0.5 });
  var CREW = [
    { x0: 1010, x1: 1320, y: 488, spd: 14, ph: 0.3, label: 'TechNext consultant', lines: ['Your products, prices and taxes, set up **once**.', 'Quote templates for what you sell **most**.'], acts: ['nod', 'id', 'wave'],
      P: W({ s: 0.5, skin: 2, hair: 0, style: 'short', outfit: 'shirt', top: BLUE, hold: 'box' }) },
    { x0: -900, x1: -500, y: 488, spd: 12, ph: 0.8, label: 'Visitor', lines: ['Signed the quote on my **phone**, on the way here.', 'The invoice came from the **same lines** as my order.'], acts: ['love', 'wave', 'spin'],
      P: W({ s: 0.5, skin: 4, hair: 2, style: 'bun', outfit: 'cardigan', top: '#2E9C7E', top2: '#FFFFFF', id: '#9AA6BC', hold: 'bags' }) },
    { front: true, x0: -440, x1: 120, y: 690, spd: 18, ph: 0.6, label: 'TechNext consultant', lines: ['Confirmed orders flow to **Inventory**.', 'And to **Accounting**, without re-typing.'], acts: ['cheer', 'id', 'wave'],
      P: W({ s: 0.58, skin: 3, hair: 1, style: 'long', outfit: 'polo', top: PUR, hold: 'tablet', hands: [[-60, -212], [70, -150]] }) }
  ];

  CREW[2].peek = true; /* the near walker strolls in front of the title card only while the scene is in view */
  var HERO = null; function peekOn() { if (!HERO) HERO = document.querySelector('.ixw-hero'); return !!(HERO && HERO.classList.contains('is-peek')); }
  function crewVis() { var pk = peekOn(); return CREW.filter(function (w) { return !w.peek || pk; }); }
  var FX = { opt: -9, gift: -9, plane: -9, bell: -9, sign: -9, price: -9, rcpt: 0, stamp: -9 };
  function tapU(st, t, dur) { if (st.wave && st.wave !== st._tw) { st._tw = st.wave; st.tapT = t; } var u = (t - (st.tapT == null ? -99 : st.tapT)) / dur; return u >= 0 && u < 1 ? u : -1; }
  function look(P, st, t, S, rest) { P.look = lerp(P.look, t < st.until ? clamp((S.nexi.x - P.x) / 160, -1, 1) : rest, 0.08); }
  function handAt(P, i) { var h = P.hands[i], sxk = P.sx == null ? 1 : P.sx; return [P.x + h[0] * P.s * sxk, P.y + (h[1] - (P.hop || 0) + (P.sit ? 46 : 0)) * P.s]; }
  function reset(P) { P.sx = 1; P.hop = 0; P.tilt = 0; }
  function pill(g, x, y, w, s, bg, fg, a) { g.save(); g.globalAlpha = a; fillRR(g, x - w / 2, y, w, 18, 9, bg); text(g, s, x, y + 12.5, 7.6, 800, fg, 'center'); g.restore(); }

  function paintLive(g, t, now, S) {
    CO.crew(CREW, g, t, S, false);
    /* bulbs along the awning: they chase */
    for (var x = Math.floor(S.ext.l / 36) * 36; x < S.ext.r; x += 36) { var on = (Math.round(x / 36) + Math.floor(t * 3)) % 3 === 0; fillE(g, x + 18, -98, 4.4, 4.4, on ? '#FFE27A' : '#FFF6D8'); if (on) fillE(g, x + 18, -98, 9, 9, 'rgba(255,226,122,.25)'); }
    /* the quotation fills in line by line; the optional extra joins when the box is opened (or on the Quotation stop) */
    var qh = S.hot === 'quote', n = Math.floor(qh ? ((t - (S.kT || 0)) * 1.4) % 6 : (t * 0.5) % 6), opt = qh || t - FX.gift < 5;
    text(g, 'Customer', QS.x + 12, QS.y + 38, 7, 700, '#8A96A8'); text(g, 'Harbourline Supplies', QS.x + 60, QS.y + 38, 8, 800, INK);
    QL.forEach(function (l, i) { if (i === 3 && !opt) return; var y = QS.y + 48 + i * 25, on = i < n || (i === 3 && opt); fillRR(g, QS.x + 10, y, QS.w - 20, 21, 5, i === 3 ? '#FDF0F2' : '#F6F8FB');
      if (on) { text(g, l[0], QS.x + 18, y + 14, 7.4, 800, i === 3 ? '#A33E4E' : INK); text(g, l[1], QS.x + 160, y + 14, 7.2, 700, '#5C6B7A'); text(g, 'S$ ' + l[2], QS.x + QS.w - 18, y + 14, 7.4, 800, INK, 'right'); } });
    var tot = n >= 3 ? (opt ? '1,960.00' : '1,840.00') : '…'; text(g, 'Total', QS.x + 160, QS.y + QS.h - 12, 8, 800, '#5C6B7A'); text(g, 'S$ ' + tot, QS.x + QS.w - 18, QS.y + QS.h - 12, 10, 800, PUR, 'right');
    fillRR(g, QS.x + 12, QS.y + QS.h - 26, 64, 18, 6, PUR); text(g, 'Send', QS.x + 44, QS.y + QS.h - 13, 7.4, 800, '#FFFFFF', 'center');
    /* the sales board: bars by month, a running total */
    var dh = S.hot === 'report'; for (var b = 0; b < 12; b++) { var h = 8 + (b / 11) * 26 + hash(b + (dh ? Math.floor(t * 2) : Math.floor(t * 0.3))) * 12; fillRR(g, DSH.x + 12 + b * 15, DSH.y + DSH.h - 8 - h, 10, h, 2, b === 11 ? ROSE : '#7E4E6E'); }
    [['Rep A', 0.8], ['Rep B', 0.62], ['Rep C', 0.45]].forEach(function (r, i) { var y = DSH.y + 26 + i * 13; text(g, r[0], DSH.x + 200, y + 6, 6, 800, '#F9C5CB'); fillRR(g, DSH.x + 226, y, 30, 6, 3, 'rgba(255,255,255,.15)'); fillRR(g, DSH.x + 226, y, 30 * r[1] * (0.85 + 0.15 * Math.sin(t + i)), 6, 3, [ROSE, GOLD, '#7FE3C4'][i]); });
    /* the pricelist tags swing on their strings and flip between lists */
    var pi = S.hot === 'price' ? Math.floor(t * 1.2) % 3 : (t - FX.price < 3 ? 2 : Math.floor(t * 0.25) % 3);
    [74, 144, 214].forEach(function (sy, i) { for (var p = 0; p < 3; p++) { var px = CAB.x + 30 + p * 44 + 10, py = CAB.y + sy + 6, sw = Math.sin(t * 2.2 + p + i * 2) * 0.18, flip = t - FX.price < 1 ? Math.cos((t - FX.price) * Math.PI * 4) : 1, tg = TAGS[(pi + p + i) % 3];
      g.save(); g.translate(px, py); g.rotate(sw); g.strokeStyle = '#B0707B'; g.lineWidth = 0.8; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 8); g.stroke(); g.scale(flip, 1);
      fillRR(g, -15, 8, 30, 20, 3, tg[2]); g.strokeStyle = '#E3B6BC'; g.lineWidth = 0.8; rr(g, -15, 8, 30, 20, 3); g.stroke(); text(g, tg[0], 0, 15.6, 4.6, 800, '#8A5A64', 'center'); text(g, 'S$' + tg[1], 0, 24.6, 7, 800, RD, 'center'); g.restore(); } });
    /* sales order: confirmed from the quote, stamped */
    var oc = S.hot === 'order' ? (t - (S.kT || 0)) % 3 > 1 : n >= 4 || t - FX.stamp < 2; text(g, 'S00042', ORD.x + 8, ORD.y + 34, 10, 800, INK); text(g, 'Harbourline', ORD.x + 8, ORD.y + 46, 6, 700, '#8A96A8');
    if (oc) { g.save(); g.translate(ORD.x + 50, ORD.y + 70); g.rotate(-0.18); g.strokeStyle = BLUE; g.lineWidth = 2; rr(g, -38, -10, 76, 20, 4); g.stroke(); text(g, 'CONFIRMED', 0, 4, 8.4, 800, BLUE, 'center'); g.restore(); }
    else { fillRR(g, ORD.x + 8, ORD.y + 60, 64, 14, 7, '#EEF2F7'); text(g, 'Quotation', ORD.x + 40, ORD.y + 70, 6.6, 800, '#5C6B7A', 'center'); }
    /* delivery and invoice from the same lines */
    var dv = S.hot === 'deliver' ? Math.floor((t - (S.kT || 0)) * 1.2) : 2; [['WH/OUT/0042', 'Delivery'], ['INV/2026/0402', 'Invoice']].forEach(function (r, i) { var y = DLV.y + 26 + i * 30, on = i < dv;
      text(g, r[1], DLV.x + 8, y + 6, 6.2, 700, '#8A96A8'); text(g, r[0], DLV.x + 8, y + 17, 6.6, 800, on ? INK : '#C9D2DE'); if (on) tick(g, DLV.x + DLV.w - 12, y + 10, 5); });
    /* the customer portal: a signature draws, then the payment ticks */
    var sp = S.hot === 'sign' ? clamp((t - (S.kT || 0)) * 0.7, 0, 1.4) : (t - FX.sign < 3 ? clamp((t - FX.sign) * 0.9, 0, 1.4) : ((t * 0.25) % 1.4)); text(g, 'S00042 · S$ 1,960.00', SGN.x + 8, SGN.y + 28, 7, 800, INK);
    g.strokeStyle = INK; g.lineWidth = 1.6; g.beginPath(); for (var q = 0; q <= Math.min(1, sp) * 40; q++) { var sxp = SGN.x + 12 + q * 2.4, syp = SGN.y + 52 + Math.sin(q * 0.6) * 6 * Math.cos(q * 0.13); if (q === 0) g.moveTo(sxp, syp); else g.lineTo(sxp, syp); } g.stroke();
    fillRR(g, SGN.x + 10, SGN.y + 62, 100, 1.5, 0.7, '#C9D2DE'); fillRR(g, SGN.x + 124, SGN.y + 40, 76, 22, 7, sp > 1 ? OK : ROSE); text(g, sp > 1 ? '✓ Paid online' : 'Sign & pay', SGN.x + 162, SGN.y + 54.5, 7.2, 800, '#FFFFFF', 'center');
    text(g, 'Signed by the customer · paid by card', SGN.x + 8, SGN.y + 76, 5.6, 700, '#8A96A8');
  }
  function paintFrontLive(g, t, S) {
    CO.crew(CREW, g, t, S, true);
    var c = CTR;
    /* the receipt printer feeds a curl of paper */
    var rp = (t * 0.2) % 1; g.fillStyle = '#FFFFFF'; g.strokeStyle = '#E3E8EF'; g.lineWidth = 0.8; g.beginPath(); g.moveTo(616, c.y - 24); g.lineTo(616, c.y - 24 - rp * 24); g.quadraticCurveTo(620, c.y - 32 - rp * 26, 640, c.y - 28 - rp * 22); g.lineTo(644, c.y - 24); g.closePath(); g.fill(); g.stroke();
    g.fillStyle = '#C9D3E3'; for (var l = 0; l < Math.floor(rp * 4); l++) g.fillRect(620, c.y - 30 - l * 5, 14, 1.2);
    /* the till drawer pops when a payment lands */
    var tu = t - FX.sign; if (tu > 1 && tu < 2.6) { fillRR(g, 802, c.y - 4, 62, 10, 2, '#5C6B7A'); fillE(g, 820, c.y - 2, 4, 2, GOLD); }
    /* the bell rings */
    var bu = t - FX.bell; if (bu < 1.2) { g.strokeStyle = 'rgba(224,176,74,' + (1.2 - bu).toFixed(2) + ')'; g.lineWidth = 1.5; [10, 16].forEach(function (r) { g.beginPath(); g.arc(562, c.y - 10, r + bu * 16, Math.PI * 1.15, Math.PI * 1.85); g.stroke(); }); }
    /* the gift box on the counter: the optional product; tapped, the lid pops */
    var gt = GIFT, gp = t - FX.gift, lid = gp < 1.4 ? Math.sin(Math.min(1, gp * 2) * Math.PI / 2) * 22 : 0;
    fillRR(g, gt.x - 22, gt.y - 30, 44, 30, 4, ROSE); g.fillStyle = '#FFD84A'; g.fillRect(gt.x - 3, gt.y - 30, 6, 30); fillRR(g, gt.x - 25, gt.y - 38 - lid, 50, 10, 3, RD); g.fillRect(gt.x - 3, gt.y - 38 - lid, 6, 10);
    fillE(g, gt.x - 6, gt.y - 42 - lid, 6, 4, '#FFD84A'); fillE(g, gt.x + 6, gt.y - 42 - lid, 6, 4, '#FFD84A'); if (gp < 3) { g.save(); g.globalAlpha = clamp(3 - gp, 0, 1); prod(g, gt.x, gt.y - 30 - lid * 1.3, 2, 0.8); g.restore(); }
    /* the rep's paper plane: the quote flies to the customer */
    var pu = (t - FX.plane) / 1.3; if (pu >= 0 && pu < 1) { var px = lerp(REP.x + 20, CUS.x - 10, pu), py = lerp(REP.y - 260, CUS.y - 250, pu) - Math.sin(pu * Math.PI) * 110; CO.plane(g, px, py, 1.4, 0.3 - pu * 0.6, '#FFFFFF', ROSE); }
    if (pu >= 1 && pu < 2.4) pill(g, CUS.x, CUS.y - 330 - (pu - 1) * 10, 80, 'Quote received', PUR, '#FFFFFF', clamp((2.4 - pu) * 2, 0, 1));
    /* the rep's quote sheet in hand */
    if (REP._sheet) { var hp = handAt(REP, 1); g.save(); g.translate(hp[0] + 6, hp[1] - 16); g.rotate(0.12); fillRR(g, -11, -15, 22, 30, 2, '#FFFFFF'); g.fillStyle = PUR; g.fillRect(-11, -15, 22, 5); g.fillStyle = '#C9D3E3'; for (var r = 0; r < 4; r++) g.fillRect(-8, -6 + r * 5, 16 - (r % 2) * 5, 1.6); g.restore(); }
    /* ops: the order slip under the stamp */
    if (OPS._slip) { fillRR(g, 690, c.y - 6, 30, 6, 1, '#FFFFFF'); if (OPS._stamped) { g.strokeStyle = BLUE; g.lineWidth = 1; g.strokeRect(694, c.y - 5, 22, 4); } }
    /* the customer's signature on her tablet */
    var su = t - FX.sign; if (su < 2.4) pill(g, CUS.x - 4, CUS.y - 330 - su * 12, 92, 'Signed & paid ✓', OK, '#FFFFFF', clamp((2.4 - su) * 2, 0, 1));
    if (CUS._sig) { var th = handAt(CUS, 0); g.strokeStyle = INK; g.lineWidth = 1.4; g.beginPath(); for (var q = 0; q < 10; q++) { var xx = th[0] + 18 + q * 2, yy = th[1] - 12 + Math.sin(q * 0.9 + t * 6) * 3; if (q) g.lineTo(xx, yy); else g.moveTo(xx, yy); } g.stroke(); }
    /* the manager's pricelist switch */
    var mu = t - FX.price; if (mu < 2.2) pill(g, MGR.x, MGR.y - 330 - mu * 12, 96, 'Pricelist: 10+ units', GOLD, INK, clamp((2.2 - mu) * 2, 0, 1));
    /* the shop assistant's scanner (a red line on the box) and the carry case held high */
    if (SA._scan) { var sh = handAt(SA, 1); g.save(); g.translate(sh[0], sh[1]); g.rotate(-0.5); fillRR(g, -6, -14, 22, 11, 4, '#2A3142'); fillRR(g, -3, -6, 8, 12, 3, '#3D4560'); fillRR(g, 12, -12, 4, 7, 1.5, '#E2453C'); g.restore();
      if ((t * 2.2) % 1 < 0.6) { var bh = handAt(SA, 0); g.strokeStyle = 'rgba(226,69,60,.75)'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(sh[0] + 6, sh[1] - 16); g.lineTo(bh[0] + 14, bh[1] - 4 + Math.sin(t * 20) * 4); g.stroke(); } }
    if (SA._case) { var c0 = handAt(SA, 0), c1 = handAt(SA, 1); prod(g, (c0[0] + c1[0]) / 2, Math.min(c0[1], c1[1]) + 6, 2, 1.1); }
    var ou = t - FX.opt; if (ou < 2.6) pill(g, SA.x, SA.y - 340 - ou * 12, 112, '+ Optional: carry case', PUR, '#FFFFFF', clamp((2.6 - ou) * 2, 0, 1));
    var ck = new Date(Date.now() + 8 * 3600e3); K.clockHands(g, { x: 70, y: -20, r: 24 }, ck.getUTCHours(), ck.getUTCMinutes(), ck.getUTCSeconds());
    CR.draw(g, t);
  }

  /* ---------- the cast: an idle loop and a tap routine each ---------- */
  function actRep(P, t, S) { /* the rep: types, takes a call on her headset, shows a quote sheet; tapped: sends the quote as a paper plane to the customer */
    var st = S.cast.rep, busy = S.hot === 'quote' || S.hot === 'price', u = tapU(st, t, 2.0), c = (t + 0.8) % 8.5; reset(P); P._sheet = false; P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm';
    if (u >= 0) { P.mood = 'happy'; P.talk = true; if (FX.plane < st.tapT) { FX.plane = t + 0.5; CR.burst('heart', P.x, P.y - 280, t); }
      if (u < 0.3) { P._sheet = true; P.hands = [[-60, -206], [40, -300]]; P.look = 0.6; } else if (u < 0.55) { P.hands = [[-60, -206], [lerp(40, 150, (u - 0.3) / 0.25), lerp(-300, -380, (u - 0.3) / 0.25)]]; P.look = 1; }
      else { P.hands = [[-100, -380 + Math.sin(t * 14) * 8], [100, -380 - Math.sin(t * 14) * 8]]; P.hop = Math.abs(Math.sin((u - 0.55) * Math.PI * 3)) * 16; } return; }
    if (busy || c < 3) { var k2 = Math.abs(Math.sin(t * 9 + P.ph)) * 6; P.hands = [[-10, -206 - k2], [90, -206 - (6 - k2)]]; look(P, st, t, S, 0.5); }
    else if (c < 5.4) { P.hands = [[-60, -206], [-40, -330]]; P.talk = true; P.tilt = Math.sin(t * 5) * 0.05; look(P, st, t, S, -0.2); }
    else if (c < 7) { P._sheet = true; P.hands = [[-60, -206], [90, -290]]; look(P, st, t, S, 0.9); }
    else { var k3 = Math.abs(Math.sin(t * 9)) * 6; P.hands = [[-10, -206 - k3], [90, -206 - (6 - k3)]]; look(P, st, t, S, 0.5); }
  }
  function actOps(P, t, S) { /* sales ops: stamps order slips CONFIRMED, spikes them, checks the till; tapped: rings the counter bell twice and spins */
    var st = S.cast.ops, busy = S.hot === 'order' || S.hot === 'deliver', u = tapU(st, t, 2.0), c = (t + 2) % 6; reset(P); P._slip = false; P._stamped = false; P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm';
    if (u >= 0) { P.mood = 'happy'; P.talk = true;
      if (u < 0.5) { var ring = Math.floor(u * 8) % 2; if (FX.bell < st.tapT || (u > 0.25 && FX.bell < st.tapT + 0.4)) { FX.bell = t; CR.burst('note', 562, CTR.y - 30, t); } P.hands = [[-60, -206], [-310, ring ? -230 : -205]]; P.look = -0.8; }
      else { P.sx = Math.cos((u - 0.5) / 0.5 * Math.PI * 2); P.hands = [[-100, -360], [100, -360]]; P.hop = Math.sin((u - 0.5) * 2 * Math.PI) * 18; } return; }
    if (c < 2.8 || busy) { P._slip = true; var s2 = (t * (busy ? 1.6 : 1)) % 1; P._stamped = s2 > 0.5; P.hands = [[-60, -206], [-70, s2 < 0.4 ? -206 - (0.4 - s2) * 200 : -206]]; look(P, st, t, S, -0.5); if (s2 > 0.4 && s2 < 0.45) FX.stamp = t; }
    else if (c < 4) { P.hands = [[-60, -206], [60, -260]]; P.tilt = 0.06; look(P, st, t, S, 0.4); }
    else { P.hands = [[60, -206], [140, -210]]; look(P, st, t, S, 0.9); }
  }
  function actCus(P, t, S) { /* the customer: scrolls her tablet, looks round the shop, signs; tapped: holds the signed quote up high */
    var st = S.cast.cust, busy = S.hot === 'sign', u = tapU(st, t, 2.2), c = (t + 1) % 9; reset(P); P._sig = false; P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm';
    if (u >= 0) { P.mood = 'happy'; P.talk = true; if (FX.sign < st.tapT) { FX.sign = t; CR.burst('heart', P.x, P.y - 300, t); }
      P.hands = [[-20, -420], [60, -400]]; P.hop = Math.abs(Math.sin(u * Math.PI * 2)) * 30; P.tilt = Math.sin(t * 8) * 0.05; return; }
    if (busy || (c > 6.5 && c < 8.2)) { P._sig = true; P.hands = [[-70, -230], [10 + Math.sin(t * 9) * 10, -236 + Math.cos(t * 7) * 4]]; P.tilt = 0.06; look(P, st, t, S, -0.2); }
    else if (c < 3) { P.hands = [[-70, -220], [-20, -230 + Math.sin(t * 3) * 10]]; P.tilt = 0.05; look(P, st, t, S, -0.3); }
    else if (c < 5) { P.hands = [[-70, -210], [70, -170]]; P.tilt = Math.sin(t * 0.9) * 0.04; look(P, st, t, S, Math.sin(t * 0.7) > 0 ? -0.9 : 0.6); }
    else { P.hands = [[-70, -210], [-120, -320]]; look(P, st, t, S, -0.9); }
  }
  function actMgr(P, t, S) { /* the sales manager: points at the price tags, checks the board, ticks his clipboard; tapped: switches the pricelist with a little dance */
    var st = S.cast.mgr, busy = S.hot === 'price' || S.hot === 'report', u = tapU(st, t, 2.0), c = (t + 3) % 8; reset(P); P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm';
    if (u >= 0) { P.mood = 'happy'; P.talk = true; if (FX.price < st.tapT) { FX.price = t; CR.burst('note', P.x, P.y - 300, t); }
      var b = Math.sin(t * 9); P.tilt = b * 0.14; P.hop = Math.abs(b) * 16; P.hands = b > 0 ? [[-120, -380], [80, -170]] : [[-80, -170], [120, -380]]; return; }
    if (busy || c < 3) { P.hands = [[-60, -212], [-150, -330 + Math.sin(t * 2) * 30]]; look(P, st, t, S, -0.9); }
    else if (c < 5) { P.hands = [[-60, -212], [60, -280]]; P.tilt = -0.06; look(P, st, t, S, 0.7); }
    else { P.hands = [[-60, -212], [-30 + Math.sin(t * 12) * 6, -210]]; P.tilt = 0.07; look(P, st, t, S, -0.2); }
  }
  function actSa(P, t, S) { /* the shop assistant: scans a boxed product, restocks from the stack, straightens the pegboard, waves; tapped: lifts the carry case high (the optional extra) and twirls */
    var st = S.cast.sa, u = tapU(st, t, 2.4), c = (t + 2) % 10; reset(P); P._scan = false; P._case = false; P.hold = null; P.talk = t < st.until; P.mood = P.talk ? 'happy' : 'calm';
    if (u >= 0) { P.mood = 'happy'; P.talk = true; P._case = true; if (FX.opt < st.tapT) { FX.opt = t; CR.burst('heart', P.x, P.y - 290, t); }
      if (u < 0.35) { P.hands = [[-40, -300], [40, -300]]; P.tilt = 0.05; } else { P.hands = [[-50, -420], [50, -420]]; P.sx = Math.cos((u - 0.35) / 0.65 * Math.PI * 2); P.hop = Math.abs(Math.sin((u - 0.35) / 0.65 * Math.PI)) * 16; } return; }
    if (c < 3) { P._scan = true; P.hold = 'box'; P.hands = [[-30, -250], [80, -262 + Math.sin(t * 3) * 6]]; look(P, st, t, S, 0.3); if (c % 1 < 0.04) CR.burst('spark', P.x + 30, P.y - 150, t); }
    else if (c < 4) { P.hands = [[-60, -212], [140, -130]]; P.tilt = 0.12; look(P, st, t, S, 0.9); }
    else if (c < 5.4) { P.hold = 'box'; P.hands = [[-40, -300], [40, -300]]; P.hop = Math.abs(Math.sin((c - 4) * Math.PI * 2)) * 6; look(P, st, t, S, -0.3); }
    else if (c < 7.6) { P.hands = [[-60, -212], [-160 + Math.sin(t * 7) * 10, -400]]; P.tilt = -0.06; look(P, st, t, S, -0.9); }
    else { P.hands = [[-60, -212], [110, -390 + Math.sin(t * 11) * 14]]; look(P, st, t, S, 0.7); }
  }
  function glowOf(b, pad) { return function (g) { rr(g, b.x - pad, b.y - pad, b.w + pad * 2, b.h + pad * 2, 12); }; }
  window.IXW.worlds['app-sales'] = {
    pan: [-300, 1200],
    calmView: [234, -128, 770, 616], calmCast: ['rep', 'ops', 'cust', 'mgr'],
    paintBg: paintBg, windowBehind: true, paintFrame: function () {}, paintBack: paintBack, paintFront: paintFront, paintFore: paintFore,
    paintWindow: paintWindow, paintLive: paintLive, paintFrontLive: paintFrontLive,
    paintForeLive: function (g, t, S) { K.zfore(g, t, S, [], function () { CO.crew(crewVis(), g, t, S, 'fore'); }); CR.draw(g, t); },
    moteCol: 'rgba(228,110,120,.22)',
    glow: { quote: glowOf(QS, 12), price: function (g) { rr(g, CAB.x - 8, CAB.y - 14, CAB.w + 16, 260, 12); }, order: glowOf(ORD, 8), sign: glowOf(SGN, 9), deliver: glowOf(DLV, 8), report: glowOf(DSH, 8),
      gift: function (g) { rr(g, GIFT.x - 32, GIFT.y - 54, 64, 58, 10); } },
    backGlow: ['quote', 'price', 'order', 'sign', 'deliver', 'report'],
    cast: [
      { id: 'rep', behind: true, keys: ['quote', 'price'], P: REP, act: actRep },
      { id: 'ops', behind: true, keys: ['order', 'deliver'], P: OPS, act: actOps },
      { id: 'cust', behind: false, keys: ['sign'], P: CUS, act: actCus },
      { id: 'mgr', behind: false, keys: ['report'], P: MGR, act: actMgr },
      { id: 'sa', behind: true, keys: [], P: SA, act: actSa }
    ],
    toy: function (name, S, t) { if (name === 'gift') { FX.gift = t; CR.burst('conf', GIFT.x, GIFT.y - 40, t); } },
    hit: function (x, y, S, t) {
      var r = CR.hitWalker(x, y, t); if (r) return r;
      if (x > 554 && x < 572 && y > CTR.y - 26 && y < CTR.y + 2) { FX.bell = t; CR.burst('note', 562, CTR.y - 30, t); return { say: 'Ding! A new **order** confirmed.', near: [694, -6], pose: 'clap' }; }
      return null;
    },
    onStop: function (key, S, t) { S.kT = t; if (key === 'order') FX.bell = t; }
  };
})(window.IXW && window.IXW.kit, window.CR, window.CO);
