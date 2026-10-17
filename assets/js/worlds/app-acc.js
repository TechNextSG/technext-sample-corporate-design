/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: app-acc (/odoo/apps/accounting) — Odoo Accounting as a bright, daylit COUNTING HOUSE at month-end, where every coin
   is matched to an entry. A brass vault door (its wheel turns; tap it and it swings open on the gold), a ticker under the
   cornice posting sample journal lines, pneumatic tubes that shoot document capsules from the vault to the desks, a banker's
   lamp, ledger binders by month, a balance scale that keeps debits and credits level, world clocks for Singapore, Manila and
   Ho Chi Minh City. The screens: bank reconciliation (lines matched one by one), reports, invoices, bills, the GST return and
   the month-end checklist. Cast (client team, grey passes): the accountant and payables seated (chairs, legs, feet), the
   bookkeeper capturing receipts, the finance lead with the close checklist. TechNext consultants (blue IDs) walk through
   with files. Each person has an idle loop and a tap routine of their own. Sample figures only. */
(function (K, CR, CO) {
  'use strict';
  if (!K || !CR || !CO) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed;
  var F = 470, CEIL = -150, GRN = '#2E9C7E', GRD = '#1D5E4A', PUR = '#714B67', OK = '#1E9E6A', RED = '#E2453C', BR = '#C9A44A', BRL = '#E9D08A', INK = '#1B1F3B';
  var VA = { x: 228, y: 6, r: 62 }, BK = { x: 304, y: -106, w: 280, h: 200 }, RP = { x: 304, y: 108, w: 280, h: 50 },
    INV = { x: 744, y: -78, w: 116, h: 80 }, TAX = { x: 870, y: -78, w: 116, h: 80 }, BIL = { x: 744, y: 16, w: 116, h: 80 }, CLS = { x: 870, y: 16, w: 116, h: 80 },
    DESK = { x: 372, y: 392, w: 500 }, SIDE = { x: 178, y: 384, w: 92 }, SCALE = { x: 1068, y: 300 }, CAB = { x: 1118, y: 300, w: 74 },
    TUBE = 200, WINS = [{ x: -904, y: -96, w: 118, h: 300 }, { x: -752, y: -96, w: 118, h: 300 }, { x: 1214, y: -96, w: 118, h: 300 }];
  var LINES = [['Harbourline Supplies', '-4,280.00', 'BILL/2026/0912'], ['Card settlement', '+1,962.40', 'INV/2026/0388'], ['Kopi Co. payment', '+640.00', 'INV/2026/0391'], ['Transfer, no reference', '+350.00', '']];
  var TICK = ['BANK LINE MATCHED · INV/2026/0388', 'BILL/2026/0912 ↔ PO00123', 'GST · BOX 1 UPDATED', 'PAYMENT BATCH · 3 BILLS', 'ACCRUALS POSTED', 'LOCK DATE SET · 30 SEP', 'P&L REFRESHED'];
  function setU(g, sx, sy, k) { g.translate(sx, sy); g.scale(k, k); }
  function extOf(W, H, k, sx, sy) { return { l: -(sx + 24) / k, r: (W - sx) / k, t: -(sy + 24) / k, b: (H - sy) / k }; }
  function tick(g, x, y, r) { fillE(g, x, y, r, r, OK); g.strokeStyle = '#FFFFFF'; g.lineWidth = r * 0.3; g.beginPath(); g.moveTo(x - r * 0.45, y); g.lineTo(x - r * 0.1, y + r * 0.35); g.lineTo(x + r * 0.5, y - r * 0.35); g.stroke(); }
  function arch(g, w) { g.beginPath(); g.moveTo(w.x, w.y + w.h); g.lineTo(w.x, w.y + w.w / 2); g.arc(w.x + w.w / 2, w.y + w.w / 2, w.w / 2, Math.PI, 0); g.lineTo(w.x + w.w, w.y + w.h); g.closePath(); }
  /* an index card on a brass clip: the ledger's look for the four small screens */
  function card(g, b, head, col) {
    shadowed(g, 10, 4, 0.16, function () { fillRR(g, b.x, b.y, b.w, b.h, 6, '#FFFDF7'); });
    fillRR(g, b.x, b.y, b.w, 18, 6, col); g.fillRect(b.x, b.y + 10, b.w, 8); text(g, head, b.x + 8, b.y + 13, 7, 800, '#FFFFFF');
    g.strokeStyle = 'rgba(46,156,126,.16)'; g.lineWidth = 1; g.beginPath(); for (var l = b.y + 30; l < b.y + b.h - 4; l += 10) { g.moveTo(b.x + 6, l); g.lineTo(b.x + b.w - 6, l); } g.stroke();
    fillRR(g, b.x + b.w / 2 - 12, b.y - 6, 24, 9, 3, BR); fillRR(g, b.x + b.w / 2 - 8, b.y - 3, 16, 3, 1.5, BRL);
  }
  function fern(g, x, y, s, t, ph, pot) { /* a potted palm whose fronds sway (live) */
    g.save(); g.translate(x, y); g.scale(s, s);
    for (var i = 0; i < 7; i++) { var a = -Math.PI / 2 + (i - 3) * 0.36 + Math.sin(t * 1.1 + ph + i) * 0.05, L = 120 - Math.abs(i - 3) * 14;
      g.strokeStyle = '#2E8F5E'; g.lineWidth = 4; g.beginPath(); g.moveTo(0, -60); var ex = Math.cos(a) * L, ey = -60 + Math.sin(a) * L; g.quadraticCurveTo(ex * 0.4, -60 + Math.sin(a) * L * 0.8 - 20, ex, ey); g.stroke();
      for (var q = 1; q < 6; q++) { var u = q / 6, px = ex * u, py = -60 + (ey + 60) * u - Math.sin(u * Math.PI) * 14; K.ell(g, px, py, 14 - q, 5, a + 0.9); g.fillStyle = q % 2 ? '#3FBF7F' : '#35AE70'; g.fill(); K.ell(g, px, py, 14 - q, 5, a - 0.9); g.fill(); } }
    fillRR(g, -30, -62, 60, 62, 10, pot || '#FFFFFF'); fillRR(g, -34, -66, 68, 12, 6, pot ? K.tone(pot, 0.1) : '#E3E8EF'); fillRR(g, -30, -40, 60, 6, 2, BR); g.restore();
  }

  function paintBg(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    var wg = g.createLinearGradient(0, CEIL, 0, F); wg.addColorStop(0, '#F6FAF5'); wg.addColorStop(1, '#E9F2EC'); g.fillStyle = wg; g.fillRect(e.l, CEIL, e.r - e.l, F - CEIL);
    /* a faint lattice on the upper wall */
    g.strokeStyle = 'rgba(46,156,126,.06)'; g.lineWidth = 1.2; g.beginPath();
    for (var d = Math.floor((e.l - 400) / 46) * 46; d < e.r + 400; d += 46) { g.moveTo(d, CEIL); g.lineTo(d + 396, 246); g.moveTo(d + 396, CEIL); g.lineTo(d, 246); } g.stroke();
    /* windows: the sky and the city (frames are painted over the live clouds) */
    WINS.forEach(function (w, i) { g.save(); arch(g, w); g.clip(); var sg = g.createLinearGradient(0, w.y, 0, w.y + w.h); sg.addColorStop(0, '#7FBDF0'); sg.addColorStop(1, '#E4F2FC'); g.fillStyle = sg; g.fillRect(w.x, w.y, w.w, w.h);
      CO.skySG(g, w.x - 40 - i * 60, w.x + w.w + 40, w.y + 200, w.y + 248, { wheel: i === 1 ? w.x + 30 : -9999, mbs: i === 0 ? w.x + 20 : -9999 }); g.restore(); });
    /* the wainscot: green panels under a brass rail */
    g.fillStyle = '#D9EBE2'; g.fillRect(e.l, 250, e.r - e.l, F - 250); g.strokeStyle = 'rgba(29,94,74,.14)'; g.lineWidth = 2;
    for (var px = Math.floor(e.l / 120) * 120; px < e.r; px += 120) { rr(g, px + 12, 272, 96, 176, 6); g.stroke(); }
    fillRR(g, e.l, 244, e.r - e.l, 7, 2, BR); g.fillStyle = 'rgba(255,255,255,.5)'; g.fillRect(e.l, 245, e.r - e.l, 1.5); fillRR(g, e.l, F - 16, e.r - e.l, 16, 0, '#C7DDD3');
    /* a coffered ceiling */
    CO.ceiling(g, e, CEIL, '#EEF4EF', '#F9FBF8', null); g.strokeStyle = 'rgba(201,164,74,.35)'; g.lineWidth = 2;
    for (var cx = Math.floor(e.l / 110) * 110; cx < e.r; cx += 110) { rr(g, cx + 8, e.t + 8, 94, CEIL - e.t - 14, 6); g.stroke(); fillE(g, cx + 55, CEIL - 26, 10, 4, 'rgba(201,164,74,.55)'); fillE(g, cx + 55, CEIL - 20, 5, 5, '#FFF3C4'); }
    /* the floor: herringbone parquet with a sun patch from the windows */
    var fg = g.createLinearGradient(0, F, 0, e.b); fg.addColorStop(0, '#ECDDC2'); fg.addColorStop(1, '#D9C29C'); g.fillStyle = fg; g.fillRect(e.l, F, e.r - e.l, e.b - F);
    g.strokeStyle = 'rgba(120,84,40,.15)'; g.lineWidth = 1.2; g.beginPath(); var cw = 22;
    for (var hx = Math.floor(e.l / cw) * cw; hx < e.r; hx += cw) { var odd = Math.round(hx / cw) % 2; g.moveTo(hx, F); g.lineTo(hx, e.b);
      for (var hy = F - cw; hy < e.b; hy += 14) { if (odd) { g.moveTo(hx, hy); g.lineTo(hx + cw, hy + 11); } else { g.moveTo(hx, hy + 11); g.lineTo(hx + cw, hy); } } } g.stroke();
    g.fillStyle = 'rgba(40,70,60,.10)'; g.fillRect(e.l, F, e.r - e.l, 5);
    g.fillStyle = 'rgba(255,248,220,.35)'; WINS.forEach(function (w) { g.beginPath(); g.moveTo(w.x + 10, F + 6); g.lineTo(w.x + w.w + 10, F + 6); g.lineTo(w.x + w.w + 150, F + 150); g.lineTo(w.x + 120, F + 150); g.closePath(); g.fill(); });
    g.restore();
  }
  function paintWindow(g, t) { /* clouds drift past the arched windows */
    WINS.forEach(function (w, i) { g.save(); arch(g, w); g.clip(); for (var c = 0; c < 2; c++) { var x = w.x - 70 + ((hash(c + i * 3) * 300 + t * (4 + c * 2)) % (w.w + 140)); K.cloud(g, x, w.y + 40 + c * 50, 0.22 + c * 0.05); } g.restore(); });
  }
  function paintBack(g, ext) {
    /* window frames, sills and curtains */
    WINS.forEach(function (w) { g.save(); g.lineWidth = 9; g.strokeStyle = '#FFFFFF'; arch(g, w); g.stroke(); g.restore(); g.fillStyle = '#FFFFFF'; g.fillRect(w.x + w.w / 2 - 3, w.y + w.w / 2, 6, w.h - w.w / 2); g.fillRect(w.x, w.y + 150, w.w, 6);
      fillRR(g, w.x - 12, w.y + w.h, w.w + 24, 12, 4, '#FFFFFF'); g.fillStyle = 'rgba(29,94,74,.08)'; g.fillRect(w.x - 10, w.y + w.h + 12, w.w + 20, 3);
      [-1, 1].forEach(function (s) { var cx = s < 0 ? w.x - 22 : w.x + w.w + 4; fillRR(g, cx, w.y - 10, 18, w.h + 20, 8, '#8FC9B3'); g.fillStyle = 'rgba(255,255,255,.25)'; g.fillRect(cx + 4, w.y - 6, 3, w.h + 12); }); });
    fillRR(g, -932, -110, 304, 8, 4, BR);
    /* the left wall: a bookcase of ledgers and a grandfather of filing drawers */
    fillRR(g, -600, 20, 120, F - 20, 6, '#7A5A3A'); fillRR(g, -592, 28, 104, F - 36, 4, '#F3E7D2');
    for (var sh = 0; sh < 5; sh++) { var y0 = 30 + sh * 86; fillRR(g, -594, y0 + 76, 108, 6, 2, '#7A5A3A'); for (var b = 0; b < 8; b++) { var bh = 50 + hash(b + sh * 9) * 22; fillRR(g, -588 + b * 12.5, y0 + 76 - bh, 11, bh, 2, [GRN, GRD, PUR, '#B8863B', '#3167CA'][(b + sh) % 5]); g.fillStyle = 'rgba(255,255,255,.5)'; g.fillRect(-586 + b * 12.5, y0 + 76 - bh + 8, 7, 2); } }
    /* the ticker housing under the cornice (the text runs live) */
    if (!K.calm) { fillRR(g, ext.l, -152, ext.r - ext.l, 38, 0, GRD); g.fillStyle = BR; g.fillRect(ext.l, -152, ext.r - ext.l, 3); g.fillRect(ext.l, -117, ext.r - ext.l, 3); }
    /* the vault door */
    var v = VA; soft(g, v.x + 4, v.y + 10, v.r + 30, v.r + 24, 0.18); [-34, 26].forEach(function (dy) { fillRR(g, v.x - v.r - 16, v.y + dy, 14, 22, 4, '#B08A3A'); fillRR(g, v.x - v.r - 13, v.y + dy + 3, 4, 16, 2, BRL); });
    fillE(g, v.x, v.y, v.r + 10, v.r + 10, '#B08A3A'); fillE(g, v.x, v.y, v.r + 6, v.r + 6, BR);
    var dg = g.createRadialGradient(v.x - 20, v.y - 24, 6, v.x, v.y, v.r); dg.addColorStop(0, '#F3F6FA'); dg.addColorStop(1, '#B9C3D1'); g.fillStyle = dg; K.ell(g, v.x, v.y, v.r, v.r); g.fill();
    for (var bo = 0; bo < 16; bo++) { var a = bo * Math.PI / 8; fillE(g, v.x + Math.cos(a) * (v.r - 9), v.y + Math.sin(a) * (v.r - 9), 3.4, 3.4, '#8A96A8'); }
    g.strokeStyle = 'rgba(30,40,70,.12)'; g.lineWidth = 2; K.ell(g, v.x, v.y, v.r - 18, v.r - 18); g.stroke();
    fillRR(g, v.x - 34, v.y + v.r + 14, 68, 16, 4, BR); text(g, 'LEDGER VAULT', v.x, v.y + v.r + 25.5, 7, 800, '#5A3F12', 'center');
    /* the bank reconciliation screen: a brass-framed monitor */
    shadowed(g, 14, 5, 0.18, function () { fillRR(g, BK.x - 7, BK.y - 7, BK.w + 14, BK.h + 14, 9, '#2A3142'); }); g.strokeStyle = BR; g.lineWidth = 2; rr(g, BK.x - 7, BK.y - 7, BK.w + 14, BK.h + 14, 9); g.stroke();
    fillRR(g, BK.x, BK.y, BK.w, BK.h, 4, '#FFFFFF'); fillRR(g, BK.x, BK.y, BK.w, 22, 4, PUR); g.fillRect(BK.x, BK.y + 14, BK.w, 8); text(g, 'Accounting · Bank reconciliation · sample', BK.x + 10, BK.y + 15, 8, 800, '#FFFFFF');
    shadowed(g, 10, 4, 0.14, function () { fillRR(g, RP.x, RP.y, RP.w, RP.h, 10, '#FFFDF7'); }); fillRR(g, RP.x, RP.y, 6, RP.h, 3, GRN);
    card(g, INV, 'Customer invoices', '#3167CA'); card(g, BIL, 'Vendor bills', '#E0456B'); card(g, TAX, 'GST return', PUR); card(g, CLS, 'Month-end close', GRN);
    /* the pocket between the screens: two brass sconces and a framed balance sheet */
    [598, 726].forEach(function (x) { fillRR(g, x - 3, 30, 6, 22, 2, BR); g.fillStyle = '#FFF3C4'; g.beginPath(); g.moveTo(x - 10, 30); g.lineTo(x + 10, 30); g.lineTo(x + 6, 14); g.lineTo(x - 6, 14); g.closePath(); g.fill(); });
    shadowed(g, 8, 3, 0.14, function () { fillRR(g, 618, 84, 88, 76, 4, '#FFFDF7'); }); g.strokeStyle = BR; g.lineWidth = 3; rr(g, 618, 84, 88, 76, 4); g.stroke();
    text(g, 'BALANCE SHEET', 662, 98, 6, 800, GRD, 'center'); fillRR(g, 628, 104, 32, 48, 2, '#D8EEE5'); fillRR(g, 664, 104, 32, 22, 2, '#F4E3EC'); fillRR(g, 664, 128, 32, 24, 2, '#EDE3F2');
    text(g, 'Assets', 644, 131, 5.6, 800, GRD, 'center'); text(g, 'Liab.', 680, 118, 5.6, 800, PUR, 'center'); text(g, 'Equity', 680, 143, 5.6, 800, PUR, 'center');
    /* the month-end calendar (pages flip live) and the chart of accounts */
    if (!K.calm) { shadowed(g, 8, 3, 0.14, function () { fillRR(g, 752, 108, 60, 74, 5, '#FFFFFF'); }); fillRR(g, 752, 108, 60, 18, 5, RED); g.fillRect(752, 118, 60, 8); [764, 800].forEach(function (x) { fillRR(g, x - 2, 102, 4, 12, 2, '#5C6B7A'); });
    g.save(); g.translate(0, 16); shadowed(g, 8, 3, 0.14, function () { fillRR(g, 824, 90, 162, 78, 6, '#FFFDF7'); }); g.strokeStyle = BR; g.lineWidth = 2.5; rr(g, 824, 90, 162, 78, 6); g.stroke();
    text(g, 'CHART OF ACCOUNTS', 905, 104, 6.4, 800, GRD, 'center'); g.strokeStyle = '#9FCDB9'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(905, 110); g.lineTo(905, 118);
    var acc5 = [['1', 'Assets'], ['2', 'Liabilities'], ['3', 'Equity'], ['4', 'Income'], ['5', 'Expenses']]; g.moveTo(838, 118); g.lineTo(972, 118); acc5.forEach(function (a, i) { var x = 838 + i * 33.5; g.moveTo(x, 118); g.lineTo(x, 126); }); g.stroke();
    acc5.forEach(function (a, i) { var x = 838 + i * 33.5; fillRR(g, x - 15, 126, 30, 32, 4, i < 3 ? '#E3F3EC' : '#F2EAF0'); text(g, a[0], x, 138, 7, 800, i < 3 ? GRN : PUR, 'center'); text(g, a[1], x, 151, 4.6, 800, '#3D4560', 'center'); }); g.restore(); }
    /* the pneumatic tube: from the vault, along the wall, a drop to each desk */
    g.lineCap = 'round'; g.strokeStyle = 'rgba(160,200,190,.55)'; g.lineWidth = 12; g.beginPath(); g.moveTo(VA.x + VA.r + 4, VA.y + 30); g.quadraticCurveTo(VA.x + VA.r + 30, TUBE, VA.x + VA.r + 70, TUBE); g.lineTo(ext.r, TUBE);
    g.moveTo(404, TUBE); g.lineTo(404, 272); g.moveTo(848, TUBE); g.lineTo(848, 272); g.stroke(); g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(VA.x + VA.r + 70, TUBE - 3); g.lineTo(ext.r, TUBE - 3); g.stroke();
    for (var ri = Math.ceil((VA.x + VA.r + 80) / 70) * 70; ri < ext.r; ri += 70) fillRR(g, ri - 3, TUBE - 8, 6, 16, 2, BR);
    [404, 848].forEach(function (x) { fillRR(g, x - 9, 264, 18, 12, 3, BR); fillRR(g, x - 12, 274, 24, 6, 3, '#B08A3A'); });
    /* the binder shelf by month */
    fillRR(g, 514, 230, 214, 6, 2, '#7A5A3A'); ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP'].forEach(function (m, i) { var x = 520 + i * 17, h = 28 + (i % 3) * 2;
      fillRR(g, x, 230 - h, 15, h, 2, [GRN, PUR, '#B8863B'][i % 3]); fillRR(g, x + 3, 230 - h + 6, 9, 14, 1.5, '#FFFDF7'); g.save(); g.translate(x + 7.5, 230 - h + 13); g.rotate(-Math.PI / 2); text(g, m, 0, 2, 4.6, 800, INK, 'center'); g.restore(); fillE(g, x + 7.5, 230 - 10, 3, 3, 'rgba(255,255,255,.7)'); });
    fillRR(g, 684, 208, 22, 22, 6, 'rgba(200,230,240,.7)'); fillRR(g, 686, 202, 18, 6, 2, BR); for (var cn = 0; cn < 3; cn++) fillE(g, 695, 225 - cn * 4, 8, 2.4, BRL);
    /* the pigeonholes under the vault: bank statements waiting */
    fillRR(g, 166, 112, 112, 86, 4, '#8A6440'); for (var ph = 0; ph < 6; ph++) { var px2 = 172 + (ph % 3) * 34, py2 = 118 + Math.floor(ph / 3) * 38; fillRR(g, px2, py2, 30, 34, 2, '#F3E7D2');
      if (ph !== 4) { fillRR(g, px2 + 4, py2 + 10, 22, 22, 1.5, ['#FFFFFF', '#EAF3FB', '#FFF6E0'][ph % 3]); g.strokeStyle = 'rgba(30,40,70,.18)'; g.lineWidth = 0.8; g.beginPath(); g.moveTo(px2 + 4, py2 + 10); g.lineTo(px2 + 15, py2 + 19); g.lineTo(px2 + 26, py2 + 10); g.stroke(); } }
    /* a cork board on the right wall: pinned receipts and a payment run */
    shadowed(g, 8, 3, 0.14, function () { fillRR(g, 1030, 2, 160, 118, 6, '#C99A6B'); }); fillRR(g, 1036, 8, 148, 106, 4, '#D9B184'); g.fillStyle = 'rgba(122,90,58,.25)'; for (var ck = 0; ck < 60; ck++) g.fillRect(1038 + hash(ck) * 142, 10 + hash(ck + 9) * 100, 2, 2);
    text(g, 'PAYMENT RUN · FRI', 1110, 104, 6.4, 800, '#5A3F12', 'center');
    /* the stamp table */
    var sd = SIDE; soft(g, sd.x + sd.w / 2, F + 4, 60, 7, 0.3); fillRR(g, sd.x, sd.y, sd.w, 10, 4, '#8A6440'); [sd.x + 8, sd.x + sd.w - 14].forEach(function (x) { fillRR(g, x, sd.y + 8, 6, F - sd.y - 8, 2, '#7A5A3A'); }); fillRR(g, sd.x + 4, sd.y + 46, sd.w - 8, 6, 2, '#7A5A3A');
    fillRR(g, sd.x + 10, sd.y - 7, 46, 7, 2, '#FFFFFF'); fillRR(g, sd.x + 13, sd.y - 12, 42, 5, 2, '#F4F6FA'); fillRR(g, sd.x + 60, sd.y - 5, 26, 5, 2, '#2A3142'); fillRR(g, sd.x + 62, sd.y - 4, 22, 2.4, 1, RED);
    for (var bag = 0; bag < 2; bag++) { var bx = sd.x + 22 + bag * 40; fillE(g, bx, sd.y + 40 - 6, 16, 12, '#C9A27A'); fillRR(g, bx - 6, sd.y + 20, 12, 6, 2, '#A07A52'); text(g, '$', bx, sd.y + 38, 9, 800, '#7A5A3A', 'center'); }
    /* the right wall: world clocks, the balance plinth, a filing cabinet */
    [[1060, 'SINGAPORE'], [1150, 'MANILA'], [1240, 'HO CHI MINH']].forEach(function (c) { K.clockFace(g, { x: c[0], y: -62, r: 22 }, BR); text(g, c[1], c[0], -26, 6, 800, GRD, 'center'); });
    fillRR(g, SCALE.x - 34, 380, 68, F - 380, 4, '#F3E7D2'); fillRR(g, SCALE.x - 40, 374, 80, 10, 4, '#7A5A3A'); fillRR(g, SCALE.x - 40, F - 10, 80, 10, 3, '#7A5A3A'); soft(g, SCALE.x, F + 4, 50, 6, 0.3);
    var cb = CAB; soft(g, cb.x + cb.w / 2, F + 4, 50, 6, 0.3); fillRR(g, cb.x, cb.y, cb.w, F - cb.y, 4, '#6F8F84'); for (var dr = 0; dr < 4; dr++) { fillRR(g, cb.x + 5, cb.y + 6 + dr * 41, cb.w - 10, 36, 3, '#83A398'); fillRR(g, cb.x + cb.w / 2 - 10, cb.y + 20 + dr * 41, 20, 5, 2, BR); }
    fillRR(g, cb.x + 10, cb.y - 26, 50, 26, 3, '#B8863B'); fillRR(g, cb.x + 14, cb.y - 32, 42, 8, 2, '#FFFDF7');
    leftWall(g);
  }
  /* the wall behind the title card ("View the scene" shows it): a long-case clock, the deed boxes, a framed T-account,
     banker's pendants and the treasury counter's back shelf */
  var LC = { x: -430, y: 4 }, DEED = { x: -376, y: -50, c: 6, r: 5, w: 31, h: 42 }, TACC = { x: -156, y: -52, w: 176, h: 136 }, TELL = { x: -156, y: 372, w: 188 };
  function leftWall(g) {
    /* the long-case clock (its pendulum and hands run live) */
    soft(g, LC.x, F + 3, 40, 6, 0.3); fillRR(g, LC.x - 22, 40, 44, F - 40, 4, '#7A5A3A'); fillRR(g, LC.x - 16, 110, 32, 168, 4, '#F3E7D2'); g.strokeStyle = BR; g.lineWidth = 2; rr(g, LC.x - 16, 110, 32, 168, 4); g.stroke();
    fillRR(g, LC.x - 28, -40, 56, 84, 8, '#8A6440'); fillRR(g, LC.x - 32, -48, 64, 12, 5, '#6A4A2E'); g.fillStyle = '#6A4A2E'; g.beginPath(); g.moveTo(LC.x - 20, -48); g.quadraticCurveTo(LC.x, -66, LC.x + 20, -48); g.closePath(); g.fill();
    fillE(g, LC.x, -66, 4, 4, BR); fillRR(g, LC.x - 26, F - 22, 52, 22, 4, '#6A4A2E'); fillRR(g, LC.x - 12, 300, 24, 120, 3, 'rgba(255,255,255,.08)');
    K.clockFace(g, { x: LC.x, y: LC.y, r: 20 }, BR);
    /* the deed boxes: brass doors with numbered plates */
    var d = DEED; shadowed(g, 10, 4, 0.16, function () { fillRR(g, d.x - 8, d.y - 8, d.c * d.w + 16, d.r * d.h + 30, 6, '#8A6440'); });
    fillRR(g, d.x - 4, d.y - 4, d.c * d.w + 8, d.r * d.h + 8, 4, '#5A3F28');
    for (var r = 0; r < d.r; r++) for (var c = 0; c < d.c; c++) { var bx = d.x + c * d.w, by = d.y + r * d.h; fillRR(g, bx + 1.5, by + 1.5, d.w - 3, d.h - 3, 3, (r + c) % 2 ? '#D8BC7C' : '#E2C98E');
      fillRR(g, bx + 7, by + 7, d.w - 14, 9, 2, '#FFF6DE'); text(g, String(100 * (r + 1) + c + 1), bx + d.w / 2, by + 14, 5.4, 800, '#5A3F12', 'center'); fillE(g, bx + d.w / 2, by + 28, 3.2, 3.2, '#5A3F28'); fillRR(g, bx + d.w / 2 - 1, by + 29, 2, 6, 1, '#5A3F28'); }
    fillRR(g, d.x + 26, d.y + d.r * d.h + 6, d.c * d.w - 52, 14, 4, BR); text(g, 'DEED BOXES · RECORDS', d.x + d.c * d.w / 2, d.y + d.r * d.h + 16, 6.2, 800, '#5A3F12', 'center');
    /* a framed T-account under a picture light */
    var a = TACC; shadowed(g, 12, 4, 0.16, function () { fillRR(g, a.x - 8, a.y - 8, a.w + 16, a.h + 16, 6, BR); }); fillRR(g, a.x - 4, a.y - 4, a.w + 8, a.h + 8, 4, BRL); fillRR(g, a.x, a.y, a.w, a.h, 3, '#FFFDF7');
    fillRR(g, a.x + a.w / 2 - 34, a.y - 18, 68, 8, 4, BR); g.fillStyle = 'rgba(255,243,196,.35)'; g.beginPath(); g.moveTo(a.x + a.w / 2 - 30, a.y - 10); g.lineTo(a.x + a.w / 2 + 30, a.y - 10); g.lineTo(a.x + a.w - 6, a.y + 40); g.lineTo(a.x + 6, a.y + 40); g.closePath(); g.fill();
    text(g, 'T-ACCOUNT · BANK', a.x + a.w / 2, a.y + 17, 8.6, 800, GRD, 'center'); text(g, 'sample', a.x + a.w / 2, a.y + 27, 5.6, 700, '#8A96A8', 'center');
    g.strokeStyle = INK; g.lineWidth = 2; g.beginPath(); g.moveTo(a.x + 12, a.y + 44); g.lineTo(a.x + a.w - 12, a.y + 44); g.moveTo(a.x + a.w / 2, a.y + 44); g.lineTo(a.x + a.w / 2, a.y + a.h - 26); g.stroke();
    text(g, 'Debit', a.x + 16, a.y + 39, 7.4, 800, GRD); text(g, 'Credit', a.x + a.w - 16, a.y + 39, 7.4, 800, PUR, 'right');
    [['INV/0388', '1,962.40'], ['INV/0391', '640.00'], ['To review', '350.00']].forEach(function (l, i) { var y = a.y + 58 + i * 15; text(g, l[0], a.x + 14, y, 6.2, 700, '#5C6B7A'); text(g, l[1], a.x + a.w / 2 - 8, y, 6.8, 800, INK, 'right'); });
    text(g, 'BILL/0912', a.x + a.w / 2 + 8, a.y + 58, 6.2, 700, '#5C6B7A'); text(g, '4,280.00', a.x + a.w - 14, a.y + 58, 6.8, 800, INK, 'right');
    g.strokeStyle = 'rgba(30,40,70,.25)'; g.lineWidth = 1; g.beginPath(); g.moveTo(a.x + 14, a.y + a.h - 22); g.lineTo(a.x + a.w - 14, a.y + a.h - 22); g.stroke();
    fillRR(g, a.x + 14, a.y + a.h - 18, a.w - 28, 12, 6, '#E3F3EC'); text(g, 'Every line posted twice, once each side', a.x + a.w / 2, a.y + a.h - 9.6, 5.8, 800, GRD, 'center');
    /* the brass plaque and two sconces either side of it */
    fillRR(g, a.x + 12, 112, a.w - 24, 26, 5, '#1D5E4A'); g.strokeStyle = BR; g.lineWidth = 2; rr(g, a.x + 12, 112, a.w - 24, 26, 5); g.stroke(); text(g, 'ACCOUNTS', a.x + a.w / 2, 129.5, 10, 800, BRL, 'center');
    [a.x - 14, a.x + a.w + 14].forEach(function (x) { fillRR(g, x - 3, 118, 6, 22, 2, BR); g.fillStyle = '#FFF3C4'; g.beginPath(); g.moveTo(x - 10, 118); g.lineTo(x + 10, 118); g.lineTo(x + 6, 102); g.lineTo(x - 6, 102); g.closePath(); g.fill(); });
    /* banker's pendants from the cornice */
    [-540, 84].forEach(function (x) { g.strokeStyle = '#7A5A3A'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(x, -114); g.lineTo(x, -84); g.stroke(); g.fillStyle = '#1E8A66'; g.beginPath(); g.moveTo(x - 16, -70); g.quadraticCurveTo(x, -92, x + 16, -70); g.closePath(); g.fill();
      fillRR(g, x - 16, -72, 32, 4, 2, BR); fillE(g, x, -66, 6, 3, '#FFF3C4'); });
    /* the treasury counter's back shelf: cash boxes and a ledger stack */
    var tl = TELL; fillRR(g, tl.x + 8, 236, tl.w - 16, 7, 2, '#7A5A3A'); [[tl.x + 20, '#2E7D62'], [tl.x + 58, PUR], [tl.x + 96, '#B8863B']].forEach(function (b) { fillRR(g, b[0], 214, 30, 22, 3, b[1]); fillRR(g, b[0] + 11, 210, 8, 5, 2, BR); fillE(g, b[0] + 15, 225, 2.6, 2.6, BRL); });
    for (var lg = 0; lg < 4; lg++) fillRR(g, tl.x + 136 + lg * 2, 228 - lg * 6, 34, 6, 1.5, [GRN, PUR, '#B8863B', GRD][lg]);
  }
  function paintFront(g, ext) {
    var d = DESK; CO.desk(g, d.x, d.y, d.w, F, { open: true, legs: '#7A5A3A', top: '#8A6440' }); g.fillStyle = 'rgba(46,156,126,.5)'; g.fillRect(d.x + 30, d.y + 1, d.w - 60, 6);
    [[500, 104], [636, 104]].forEach(function (m) { var mx = m[0]; fillRR(g, mx - 4, d.y - 74, m[1] + 4, 64, 6, '#2A3142'); fillRR(g, mx + 46, d.y - 10, 10, 10, 2, '#5C6B7A'); fillRR(g, mx + 30, d.y - 3, 42, 4, 2, '#5C6B7A'); });
    /* the banker's lamp between the screens */
    fillRR(g, 612, d.y - 6, 20, 6, 3, BR); fillRR(g, 620, d.y - 36, 4, 32, 2, BR); g.fillStyle = '#1E8A66'; g.beginPath(); g.moveTo(604, d.y - 34); g.quadraticCurveTo(622, d.y - 52, 640, d.y - 34); g.closePath(); g.fill(); g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(610, d.y - 40, 14, 2);
    /* the calculator, the coin jar, the in and out trays */
    fillRR(g, 392, d.y - 14, 30, 14, 3, '#3D4560'); fillRR(g, 395, d.y - 12, 24, 4, 1, '#B9E6D3'); for (var kq = 0; kq < 6; kq++) fillRR(g, 395 + (kq % 3) * 8, d.y - 6 - Math.floor(kq / 3) * 0, 6, 3, 1, '#C9D2DE');
    fillRR(g, 438, d.y - 28, 22, 28, 6, 'rgba(210,235,245,.85)'); fillRR(g, 440, d.y - 34, 18, 6, 2, BR);
    fillRR(g, 820, d.y - 10, 44, 10, 2, '#B8863B'); fillRR(g, 820, d.y - 24, 44, 4, 2, '#B8863B'); g.fillStyle = '#B8863B'; g.fillRect(822, d.y - 24, 3, 14); g.fillRect(859, d.y - 24, 3, 14);
    for (var p = 0; p < 3; p++) fillRR(g, 825, d.y - 14 - p * 2, 34, 2, 1, '#FFFFFF');
    /* the treasury counter (behind the title card): green panels, a brass rail, the note counter and bundles on top */
    var tl = TELL; soft(g, tl.x + tl.w / 2, F + 5, tl.w * 0.6, 9, 0.3); fillRR(g, tl.x, tl.y + 8, tl.w, F - tl.y - 8, 6, '#2E7D62');
    [0, 1, 2].forEach(function (i) { var px = tl.x + 12 + i * ((tl.w - 24) / 3); g.strokeStyle = 'rgba(233,208,138,.55)'; g.lineWidth = 2; rr(g, px + 4, tl.y + 24, (tl.w - 24) / 3 - 8, F - tl.y - 40, 5); g.stroke(); });
    fillRR(g, tl.x - 6, tl.y, tl.w + 12, 12, 4, '#8A6440'); fillRR(g, tl.x - 6, tl.y + 10, tl.w + 12, 3, 1.5, BR); fillRR(g, tl.x, F - 8, tl.w, 8, 2, GRD);
    fillRR(g, tl.x + tl.w / 2 - 46, tl.y + 40, 92, 22, 6, '#FFFDF7'); text(g, 'TREASURY', tl.x + tl.w / 2, tl.y + 55, 9, 800, GRD, 'center');
    var mx = tl.x + 126; fillRR(g, mx, tl.y - 30, 56, 30, 6, '#3D4560'); fillRR(g, mx + 6, tl.y - 26, 22, 8, 2, '#9FE3C8'); fillRR(g, mx + 32, tl.y - 26, 18, 8, 2, '#5C6B7A'); fillRR(g, mx + 6, tl.y - 36, 44, 7, 3, '#2A3142');
    for (var bn = 0; bn < 3; bn++) { fillRR(g, tl.x + 10, tl.y - 8 - bn * 7, 40, 7, 2, '#BFE3C9'); fillRR(g, tl.x + 26, tl.y - 8 - bn * 7, 8, 7, 1, '#E9D08A'); }
  }
  function paintFore(g, ext) {
    /* the foreground: brass posts and a velvet rope, coin sacks, a palm, a document trolley */
    /* (behind the title card, standing back on the floor) brass posts and a velvet rope that queue the treasury counter */
    g.strokeStyle = '#2E7D62'; g.lineWidth = 6; g.lineCap = 'round'; g.beginPath(); g.moveTo(-372, 486); g.quadraticCurveTo(-306, 508, -240, 486); g.stroke();
    [-372, -240].forEach(function (x) { soft(g, x, 542, 26, 5, 0.3); fillRR(g, x - 4, 480, 8, 60, 3, BR); fillE(g, x, 478, 9, 9, BRL); fillE(g, x, 540, 17, 5, '#B08A3A'); });
    /* the floor band below the card: a long green runner with a brass border and the counting house's coin medallion inlay */
    g.fillStyle = 'rgba(46,125,98,.30)'; g.fillRect(ext.l - 20, 644, ext.r - ext.l + 40, 64); g.strokeStyle = 'rgba(201,164,74,.75)'; g.lineWidth = 3; g.beginPath(); g.moveTo(ext.l - 20, 650); g.lineTo(ext.r + 20, 650); g.moveTo(ext.l - 20, 702); g.lineTo(ext.r + 20, 702); g.stroke();
    g.strokeStyle = 'rgba(201,164,74,.4)'; g.lineWidth = 1.5; g.beginPath(); for (var rx = Math.floor(ext.l / 36) * 36; rx < ext.r; rx += 36) { g.moveTo(rx, 676); g.lineTo(rx + 12, 666); g.lineTo(rx + 24, 676); g.lineTo(rx + 12, 686); g.closePath(); } g.stroke();
    [-250, 560].forEach(function (mx) { fillE(g, mx, 676, 46, 18, 'rgba(201,164,74,.55)'); fillE(g, mx, 676, 38, 14, '#E9D08A'); fillE(g, mx, 676, 28, 10, '#C9A44A'); text(g, 'DR = CR', mx, 680, 9, 800, '#5A3F12', 'center'); });
    [[176, 700], [204, 706]].forEach(function (c, i) { soft(g, c[0], c[1] + 4, 24, 5, 0.3); fillE(g, c[0], c[1] - 16, 22 - i * 3, 18 - i * 2, '#C9A27A'); fillRR(g, c[0] - 8, c[1] - 40 + i * 4, 16, 7, 3, '#A07A52'); text(g, '$', c[0], c[1] - 10, 14, 800, '#7A5A3A', 'center'); });
    /* a green rug and a waiting bench on the left */
    g.fillStyle = 'rgba(46,156,126,.22)'; g.beginPath(); g.moveTo(-960, 560); g.lineTo(-700, 560); g.lineTo(-680, 660); g.lineTo(-980, 660); g.closePath(); g.fill(); g.strokeStyle = 'rgba(201,164,74,.6)'; g.lineWidth = 3; g.stroke();
    soft(g, -830, 632, 110, 8, 0.3); fillRR(g, -920, 570, 180, 18, 6, '#2E7D62'); fillRR(g, -924, 530, 188, 44, 10, '#3A9C7C'); fillRR(g, -910, 588, 8, 40, 2, '#7A5A3A'); fillRR(g, -758, 588, 8, 40, 2, '#7A5A3A'); fillRR(g, -880, 560, 70, 12, 5, '#FFFDF7');
    var tx = 1010; soft(g, tx + 50, 690, 70, 7, 0.3); fillRR(g, tx, 600, 100, 8, 3, '#7A5A3A'); fillRR(g, tx, 650, 100, 8, 3, '#7A5A3A'); fillRR(g, tx + 4, 600, 6, 84, 2, '#5C6B7A'); fillRR(g, tx + 90, 600, 6, 84, 2, '#5C6B7A');
    for (var f = 0; f < 4; f++) fillRR(g, tx + 10 + f * 20, 566 + (f % 2) * 6, 16, 34 - (f % 2) * 6, 2, [GRN, PUR, '#B8863B', '#3167CA'][f]); fillE(g, tx + 12, 688, 6, 6, INK); fillE(g, tx + 88, 688, 6, 6, INK);
  }

  var W = CR.who;
  var ACC = W({ x: 452, y: 470, s: 0.5, ph: 0.6, skin: 0, hair: 0, style: 'bob', outfit: 'cardigan', top: GRN, top2: '#FFFFFF', glasses: true, sit: true, chairCol: GRD, id: '#9AA6BC', hands: [[-60, -206], [60, -206]], look: 0.4 });
  var AP = W({ x: 792, y: 470, s: 0.5, ph: 1.8, skin: 2, hair: 1, style: 'short', outfit: 'shirt', top: '#E0456B', sit: true, chairCol: GRD, id: '#9AA6BC', hands: [[-60, -206], [60, -206]], look: -0.4 });
  var CFO = W({ x: 940, y: 470, s: 0.54, ph: 2.6, skin: 1, hair: 0, style: 'short', outfit: 'shirt', top: '#1E3A6E', id: '#9AA6BC', hold: 'clipboard', hands: [[-70, -210], [70, -170]], look: -0.6 });
  var TR = W({ x: -66, y: 470, s: 0.54, ph: 1.2, skin: 2, hair: 1, style: 'bun', outfit: 'shirt', top: '#3A7CA5', id: '#9AA6BC', hands: [[-20, -192], [60, -192]], look: 0.5 });
  var BKP = W({ x: 318, y: 470, s: 0.54, ph: 3.4, skin: 3, hair: 2, style: 'pony', clip: BR, outfit: 'polo', top: '#B8863B', id: '#9AA6BC', hold: 'tablet', hands: [[-60, -212], [-10, -230]], look: 0.3 });
  var CREW = [
    { x0: 1000, x1: 1320, y: 488, spd: 14, ph: 0.3, label: 'TechNext consultant', lines: ['Chart of accounts, taxes and journals set up for **how you close**.', 'Bank feeds tuned on your **real** statements.'], acts: ['nod', 'id', 'wave'],
      P: W({ s: 0.5, skin: 3, hair: 1, style: 'long', outfit: 'polo', top: '#3167CA', hold: 'box' }) },
    { x0: -900, x1: -480, y: 488, spd: 12, ph: 0.7, label: 'TechNext consultant', lines: ['Reconciliation rules tuned so most lines **match themselves**.', 'Lock dates so closed months **stay closed**.'], acts: ['think', 'id', 'nod'],
      P: W({ s: 0.5, skin: 1, hair: 0, style: 'short', outfit: 'cardigan', top: GRD, top2: '#FFFFFF', glasses: true, hold: 'clipboard' }) },
    { front: true, x0: -440, x1: 120, y: 690, spd: 18, ph: 0.6, label: 'TechNext consultant', lines: ['Opening balances migrated and **reconciled** first.', 'Your finance team trained on **month-end**.'], acts: ['cheer', 'id', 'wave'],
      P: W({ s: 0.58, skin: 0, hair: 0, style: 'short', outfit: 'shirt', top: PUR, hold: 'tablet', hands: [[-60, -212], [70, -150]] }) }
  ];

  /* ---------- tap timers and small shared bits of state ---------- */
  CREW[2].peek = true; /* the near walker strolls the floor in front of the title card only while the scene is in view */
  var HERO = null; function peekOn() { if (!HERO) HERO = document.querySelector('.ixw-hero'); return !!(HERO && HERO.classList.contains('is-peek')); }
  function crewVis() { var pk = peekOn(); return CREW.filter(function (w) { return !w.peek || pk; }); }
  var FX = { cash: -9, stamp: -9, vault: -9, scale: -9, plane: -9, coins: -9, matched: -9, cap: [], tape: 0, jar: 3 };
  function tapU(st, t, dur) { if (st.wave && st.wave !== st._tw) { st._tw = st.wave; st.tapT = t; } var u = (t - (st.tapT == null ? -99 : st.tapT)) / dur; return u >= 0 && u < 1 ? u : -1; }
  function look(P, st, t, S, rest) { P.look = lerp(P.look, t < st.until ? clamp((S.nexi.x - P.x) / 160, -1, 1) : rest, 0.08); }
  function handAt(P, i) { var h = P.hands[i], sxk = P.sx == null ? 1 : P.sx; return [P.x + h[0] * P.s * sxk, P.y + (h[1] - (P.hop || 0) + (P.sit ? 46 : 0)) * P.s]; }
  function reset(P) { P.sx = 1; P.hop = 0; P.tilt = 0; }
  function coin(g, x, y, r, t) { var w = Math.abs(Math.cos(t * 9)) * r + 0.6; fillE(g, x, y, w, r, BR); fillE(g, x, y, w * 0.6, r * 0.6, BRL); }

  function paintLive(g, t, now, S) {
    CO.crew(CREW, g, t, S, false);
    /* the ticker */
    if (!K.calm) { g.save(); g.beginPath(); g.rect(S.ext.l, -149, S.ext.r - S.ext.l, 32); g.clip(); var span = 0, xs = S.ext.l - ((t * 34) % 1960);
    while (xs < S.ext.r) { TICK.forEach(function (s, i) { var w = s.length * 7 + 48; if (xs > S.ext.l - w && xs < S.ext.r) { fillE(g, xs + 6, -134, 3.6, 3.6, i % 2 ? BRL : '#7FE3C4'); text(g, s, xs + 16, -129.5, 11, 800, i % 2 ? '#E9F7F1' : BRL); } xs += w; }); if (++span > 6) break; }
    g.restore(); }
    /* the vault: the wheel turns; tapped, the door swings open on the gold */
    var v = VA, vu = t - FX.vault, open = vu < 4.5 ? Math.sin(clamp(vu < 3.6 ? vu / 0.6 : (4.5 - vu) / 0.9, 0, 1) * Math.PI / 2) : 0;
    if (open > 0.02) { fillE(g, v.x, v.y, v.r, v.r, '#2A3142'); for (var gb = 0; gb < 6; gb++) { var gx = v.x - 30 + (gb % 3) * 22, gy = v.y + 18 - Math.floor(gb / 3) * 14; fillRR(g, gx, gy, 20, 11, 2, BR); fillRR(g, gx + 3, gy + 1, 14, 3, 1, BRL); }
      for (var lb = 0; lb < 5; lb++) fillRR(g, v.x - 28 + lb * 11, v.y - 36, 9, 26, 2, [GRN, PUR, '#B8863B', GRD, '#3167CA'][lb]);
      g.save(); g.translate(v.x - v.r, v.y); g.scale(1 - open * 0.78, 1); var dg = g.createLinearGradient(0, -v.r, 0, v.r); dg.addColorStop(0, '#E8EDF3'); dg.addColorStop(1, '#AEB9C8'); g.fillStyle = dg; K.ell(g, v.r, 0, v.r, v.r); g.fill(); g.restore(); }
    var wa = t * 0.5 + (vu < 1 ? vu * 8 : 0), hx = v.x - open * v.r * 0.78; if (open < 0.5) { g.strokeStyle = '#5C6B7A'; g.lineWidth = 4; g.lineCap = 'round'; g.beginPath(); for (var sp = 0; sp < 3; sp++) { var a = wa + sp * Math.PI / 3; g.moveTo(hx - Math.cos(a) * 26, v.y - Math.sin(a) * 26); g.lineTo(hx + Math.cos(a) * 26, v.y + Math.sin(a) * 26); } g.stroke();
      fillE(g, hx, v.y, 9, 9, BR); [0, 1, 2, 3, 4, 5].forEach(function (q) { var a = wa + q * Math.PI / 3; fillE(g, hx + Math.cos(a) * 27, v.y + Math.sin(a) * 27, 4, 4, BR); }); }
    g.fillStyle = 'rgba(255,255,255,' + (0.18 + 0.12 * Math.sin(t * 1.3)).toFixed(2) + ')'; if (open < 0.3) { K.ell(g, v.x - 24, v.y - 30, 14, 6, -0.6); g.fill(); }
    /* capsules racing through the tube */
    FX.cap = FX.cap.filter(function (c) { return t - c.t0 < 3; });
    var caps = [((t * 0.16) % 1), ((t * 0.16 + 0.5) % 1)].map(function (u, i) { return { u: u, drop: i ? 848 : 404 }; }); FX.cap.forEach(function (c) { caps.push({ u: (t - c.t0) / 3, drop: c.drop, hot: true }); });
    if (!K.calm) caps.forEach(function (c) { var x0 = VA.x + VA.r + 70, L1 = c.drop - x0, L2 = 72, tot = L1 + L2, d = c.u * tot, x, y;
      if (d < L1) { x = x0 + d; y = TUBE; } else { x = c.drop; y = TUBE + (d - L1); }
      fillRR(g, x - 9, y - 5, 18, 10, 5, c.hot ? RED : '#3167CA'); fillRR(g, x - 3, y - 5, 6, 10, 2, BRL); });
    /* bank reconciliation: statement lines on the left, the suggested match on the right, ticked in turn */
    var bh = S.hot === 'bank', n = Math.floor(bh ? ((t - (S.kT || 0)) * 1.4) % 6 : (t * 0.5) % 6);
    LINES.forEach(function (l, i) { var y = BK.y + 32 + i * 38, on = i < n && l[2]; fillRR(g, BK.x + 10, y, 132, 30, 6, '#F6F8FB'); text(g, l[0], BK.x + 18, y + 13, 7.2, 800, INK); text(g, 'S$ ' + l[1], BK.x + 18, y + 24, 6.8, 700, l[1][0] === '-' ? '#B3261E' : OK);
      g.strokeStyle = on ? OK : '#E3E8EF'; g.lineWidth = 2; g.setLineDash(on ? [] : [4, 4]); g.beginPath(); g.moveTo(BK.x + 142, y + 15); g.lineTo(BK.x + 156, y + 15); g.stroke(); g.setLineDash([]);
      fillRR(g, BK.x + 156, y, 114, 30, 6, on ? '#E8F7EF' : (l[2] ? '#FAFBFC' : '#FFF4E0')); text(g, l[2] || 'To review', BK.x + 164, y + 19, 7, 800, l[2] ? (on ? OK : '#9AA6BC') : '#B7791F'); if (on) tick(g, BK.x + 260, y + 15, 6); });
    fillRR(g, BK.x + 10, BK.y + BK.h - 22, 70, 16, 5, n >= 4 ? OK : PUR); text(g, n >= 4 ? 'Validated' : 'Validate', BK.x + 45, BK.y + BK.h - 11, 7, 800, '#FFFFFF', 'center');
    text(g, n >= 4 ? '3 of 4 matched' : (n > 0 ? 'matching…' : ''), BK.x + BK.w - 12, BK.y + BK.h - 11, 6.6, 800, n >= 4 ? OK : '#8A96A8', 'right');
    /* reports: P&L, balance sheet, cash */
    var rh = S.hot === 'reports'; [['Profit & loss', GRN], ['Balance sheet', '#3167CA'], ['Cash', '#F2A33A']].forEach(function (r, i) { var x = RP.x + 16 + i * 90;
      text(g, r[0], x, RP.y + 14, 6.8, 800, '#5C6B7A'); for (var b = 0; b < 6; b++) { var h = 6 + hash(b + i * 7 + (rh ? Math.floor(t * 2) : Math.floor(t * 0.25))) * 18; fillRR(g, x + b * 12, RP.y + 44 - h, 8, h, 2, r[1]); } });
    /* invoices: paid / sent / overdue */
    var ih = S.hot === 'invoices' && (t % 2) < 1; [['INV/0388', 'Paid', OK], ['INV/0391', 'Paid', OK], ['INV/0395', ih ? 'Sent' : 'Overdue', ih ? '#3167CA' : RED]].forEach(function (r, i) { var y = INV.y + 24 + i * 17;
      text(g, r[0], INV.x + 8, y + 9, 6.4, 700, '#3D4560'); fillRR(g, INV.x + 62, y, 46, 12, 6, r[2]); text(g, r[1], INV.x + 85, y + 9, 6, 800, '#FFFFFF', 'center'); });
    /* bills: matched to the PO */
    [['BILL/0912', 'PO00123'], ['BILL/0913', 'PO00127'], ['BILL/0914', 'PO00131']].forEach(function (r, i) { var y = BIL.y + 24 + i * 17, on = S.hot === 'bills' ? ((t - (S.kT || 0)) * 1.5) > i : true;
      text(g, r[0], BIL.x + 6, y + 9, 6.2, 700, '#3D4560'); text(g, '↔ ' + r[1], BIL.x + 54, y + 9, 6, 800, on ? OK : '#B0BAC9'); if (on) tick(g, BIL.x + 108, y + 6, 4.2); });
    /* GST return: the boxes fill from the posted entries */
    var tx = S.hot === 'tax' ? clamp((t - (S.kT || 0)) * 0.8, 0, 1) : 1; [['Box 1 · Supplies', 0.8], ['Box 5 · Purchases', 0.55], ['Box 8 · Net GST', 0.3]].forEach(function (b, i) { var y = TAX.y + 26 + i * 17;
      text(g, b[0], TAX.x + 8, y + 7, 6, 700, '#3D4560'); fillRR(g, TAX.x + 8, y + 9, 100, 4, 2, '#EEF2F7'); fillRR(g, TAX.x + 8, y + 9, 100 * b[1] * tx, 4, 2, PUR); });
    /* month-end: the checklist ticks off */
    var cl = S.hot === 'close' ? Math.floor((t - (S.kT || 0)) * 1.2) : (t - FX.scale < 3 ? 4 : 4); ['Accruals posted', 'Banks reconciled', 'Lock date set'].forEach(function (c, i) { var y = CLS.y + 26 + i * 17, on = i < cl;
      fillRR(g, CLS.x + 8, y, 11, 11, 3, on ? GRN : '#EEF2F7'); if (on) { g.strokeStyle = '#FFFFFF'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(CLS.x + 10.5, y + 5.5); g.lineTo(CLS.x + 12.8, y + 8); g.lineTo(CLS.x + 16.5, y + 3); g.stroke(); }
      text(g, c, CLS.x + 24, y + 8.6, 6.4, 700, on ? INK : '#9AA6BC'); });
    /* the calendar: month-end pages peel off */
    if (!K.calm) {
    var cp = (t * 0.22) % 1, days = ['28', '29', '30'], di = Math.floor(t * 0.22) % 3; g.save(); g.translate(0, 16); text(g, 'SEP', 782, 106, 7, 800, '#FFFFFF', 'center');
    text(g, days[(di + 1) % 3], 782, 150, 26, 800, INK, 'center'); if (cp < 0.85) { g.save(); g.translate(752, 110); g.transform(1, 0, 0, 1 - (cp > 0.6 ? (cp - 0.6) * 4 : 0), 0, 0); fillRR(g, 0, 0, 60, 54, 3, '#FFFFFF'); text(g, days[di], 30, 40, 26, 800, days[di] === '30' ? RED : INK, 'center'); if (days[di] === '30') text(g, 'MONTH-END', 30, 50, 5, 800, RED, 'center'); g.restore(); } g.restore();
    }
    /* the world clocks */
    [[1060, 8], [1150, 8], [1240, 7]].forEach(function (c) { var d = new Date(Date.now() + c[1] * 3600e3); K.clockHands(g, { x: c[0], y: -62, r: 22 }, d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds()); });
    /* the balance scale: debits and credits sway, then settle level when the finance lead weighs them */
    var su = t - FX.scale, tilt = su < 2.4 ? Math.sin(su * 7) * 0.22 * (1 - su / 2.4) : Math.sin(t * 0.9) * 0.06, sx0 = SCALE.x, sy0 = SCALE.y;
    fillRR(g, sx0 - 3, sy0, 6, 76, 2, BR); fillE(g, sx0, sy0, 7, 7, BRL); g.save(); g.translate(sx0, sy0); g.rotate(tilt); fillRR(g, -52, -3, 104, 6, 3, BR); g.restore();
    [-1, 1].forEach(function (s) { var px = sx0 + s * 50 * Math.cos(tilt), py = sy0 + s * 50 * Math.sin(tilt); g.strokeStyle = '#9AA6BC'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(px, py); g.lineTo(px - 16, py + 34); g.moveTo(px, py); g.lineTo(px + 16, py + 34); g.stroke();
      g.fillStyle = BR; g.beginPath(); g.ellipse(px, py + 34, 20, 6, 0, 0, Math.PI); g.fill(); text(g, s < 0 ? 'DR' : 'CR', px, py + 30, 7, 800, s < 0 ? GRD : PUR, 'center'); });
    if (su < 3.4) { g.save(); g.globalAlpha = clamp((3.4 - su) * 1.5, 0, 1); fillRR(g, sx0 - 34, sy0 - 34 - su * 4, 68, 16, 8, OK); text(g, 'Balanced ✓', sx0, sy0 - 23 - su * 4, 7.4, 800, '#FFFFFF', 'center'); g.restore(); }
    /* the filing cabinet: a drawer slides out and back */
    var dw = Math.max(0, Math.sin(t * 0.7)) * 16; fillRR(g, CAB.x + 5 + 0, CAB.y + 47, CAB.w - 10, 36, 3, '#83A398'); fillRR(g, CAB.x + 2 - dw * 0.3, CAB.y + 47 - dw * 0.2, CAB.w - 4, 36 + dw * 0.2, 3, '#8FB0A4'); fillRR(g, CAB.x + CAB.w / 2 - 10, CAB.y + 61 - dw * 0.1, 20, 5, 2, BR);
    /* pinned receipts on the cork board flutter */
    [[1046, 16, '#FFFFFF', 'INV/0388'], [1090, 22, '#FFF6E0', 'BILL/0912'], [1136, 14, '#EAF3FB', 'EXP/0041'], [1066, 58, '#FFFFFF', 'BILL/0913'], [1124, 56, '#F2EAF0', 'GST F5']].forEach(function (r, i) {
      g.save(); g.translate(r[0] + 18, r[1]); g.rotate(Math.sin(t * 1.6 + i * 1.7) * 0.06 + (i % 2 ? 0.05 : -0.04)); fillRR(g, -18, 0, 36, 34, 2, r[2]); g.fillStyle = '#C9D3E3'; g.fillRect(-13, 14, 26, 2); g.fillRect(-13, 19, 18, 2); g.fillRect(-13, 24, 22, 2);
      text(g, r[3], 0, 10, 5.4, 800, INK, 'center'); fillE(g, 0, 1, 3, 3, [RED, GRN, '#3167CA', BR, PUR][i]); g.restore(); });
    /* an envelope slides out of a pigeonhole now and then */
    var ep = (t * 0.3) % 1, eo = ep < 0.5 ? Math.sin(ep * 2 * Math.PI) * 12 : 0; if (eo > 0.5) { fillRR(g, 210, 166 + 0 - eo, 22, 18, 1.5, '#FFFFFF'); g.strokeStyle = 'rgba(30,40,70,.2)'; g.lineWidth = 0.8; g.beginPath(); g.moveTo(210, 166 - eo); g.lineTo(221, 174 - eo); g.lineTo(232, 166 - eo); g.stroke(); fillE(g, 221, 178 - eo, 3, 3, RED); }
    /* the palms sway */
    fern(g, 1364, F, 0.62, t, 0.4); fern(g, -650, F, 0.7, t, 1.7, '#E8D6B8');
    /* the PAID stamp: tapped, it comes down on the bill */
    var sd = SIDE, st = t - FX.stamp, down = st < 1.6, sy2 = down ? (st < 0.25 ? -40 + st * 160 : 0) : -40;
    if (st < 3) { g.save(); g.globalAlpha = clamp(3 - st, 0, 1); g.translate(sd.x + 34, sd.y - 16); g.rotate(-0.25); g.strokeStyle = RED; g.lineWidth = 2; g.strokeRect(-18, -6, 36, 12); text(g, 'PAID', 0, 4, 8, 800, RED, 'center'); g.restore(); }
    fillRR(g, sd.x + 62, sd.y - 28 + sy2 * 0.5, 22, 8, 3, '#7A5A3A'); fillRR(g, sd.x + 69, sd.y - 46 + sy2 * 0.5, 8, 18, 3, '#9A7A52'); fillE(g, sd.x + 73, sd.y - 48 + sy2 * 0.5, 7, 6, '#7A5A3A');
    /* the long-case clock: Singapore time, and the pendulum swings */
    var cd = new Date(Date.now() + 8 * 3600e3); K.clockHands(g, { x: LC.x, y: LC.y, r: 20 }, cd.getUTCHours(), cd.getUTCMinutes(), cd.getUTCSeconds());
    g.save(); g.beginPath(); g.rect(LC.x - 15, 111, 30, 166); g.clip(); g.translate(LC.x, 112); g.rotate(Math.sin(t * 3.1) * 0.12); g.strokeStyle = BR; g.lineWidth = 2; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 128); g.stroke(); fillE(g, 0, 136, 11, 11, BR); fillE(g, -3, 133, 4, 4, BRL); g.restore();
    /* a deed box swings open now and then: a file is taken out, then it shuts */
    var dc = Math.floor(t / 4.2), du2 = (t / 4.2) % 1, db = Math.floor(hash(dc * 1.7) * DEED.c * DEED.r), dop = du2 < 0.6 ? Math.sin(Math.min(1, du2 / 0.6) * Math.PI) : 0;
    if (dop > 0.02) { var bx2 = DEED.x + (db % DEED.c) * DEED.w, by2 = DEED.y + Math.floor(db / DEED.c) * DEED.h; fillRR(g, bx2 + 1.5, by2 + 1.5, DEED.w - 3, DEED.h - 3, 3, '#3A2A1C'); fillRR(g, bx2 + 6, by2 + 10 - dop * 6, DEED.w - 12, 26, 2, '#FFFDF7'); fillRR(g, bx2 + 6, by2 + 10 - dop * 6, DEED.w - 12, 5, 2, [GRN, PUR, '#3167CA'][dc % 3]);
      g.save(); g.translate(bx2 + 1.5, by2 + 1.5); g.scale(1 - dop * 0.75, 1); fillRR(g, 0, 0, DEED.w - 3, DEED.h - 3, 3, '#EED7A0'); g.restore(); }
  }
  function paintFrontLive(g, t, S) {
    CO.crew(CREW, g, t, S, true);
    var d = DESK; [[500, 'Reconcile', PUR], [636, 'Bills to pay', '#E0456B']].forEach(function (m, k) { var mx = m[0], my = d.y - 70; fillRR(g, mx, my, 100, 56, 3, '#FFFFFF'); fillRR(g, mx, my, 100, 10, 3, m[2]); text(g, m[1], mx + 4, my + 7.6, 5, 800, '#FFFFFF');
      for (var l = 0; l < 4; l++) { fillRR(g, mx + 6, my + 15 + l * 10, 58, 4, 2, '#D5DCE6'); if ((t * 0.8 + l + k) % 4 < 2.5) tick(g, mx + 88, my + 17 + l * 10, 3.2); } });
    /* the calculator's tape curls up as the accountant adds */
    var tp = clamp(FX.tape, 0, 1); if (tp > 0.02) { g.fillStyle = '#FFFFFF'; g.strokeStyle = '#D5DCE6'; g.lineWidth = 0.8; g.beginPath(); g.moveTo(398, d.y - 14); g.lineTo(398, d.y - 14 - tp * 20); g.quadraticCurveTo(398, d.y - 20 - tp * 26, 406 + tp * 4, d.y - 18 - tp * 24); g.lineTo(412 + tp * 4, d.y - 14 - tp * 20); g.lineTo(414, d.y - 14); g.closePath(); g.fill(); g.stroke(); }
    /* the coin jar fills */
    for (var c = 0; c < FX.jar; c++) fillE(g, 449, d.y - 4 - c * 3, 8, 2, BR);
    /* the payables bill in hand */
    if (AP._bill) { var hp = handAt(AP, 1); g.save(); g.translate(hp[0] - 4, hp[1] - 10); g.rotate(-0.15); fillRR(g, -9, -12, 18, 24, 2, '#FFFFFF'); g.fillStyle = '#E0456B'; g.fillRect(-9, -12, 18, 4); g.fillStyle = '#C9D3E3'; g.fillRect(-6, -4, 12, 1.6); g.fillRect(-6, 0, 9, 1.6); g.fillRect(-6, 4, 11, 1.6); g.restore(); }
    if (AP._fan) { var fh = handAt(AP, 0), fh2 = handAt(AP, 1), mx2 = (fh[0] + fh2[0]) / 2, my2 = Math.min(fh[1], fh2[1]) - 6; for (var b = 0; b < 5; b++) { g.save(); g.translate(mx2, my2 + 10); g.rotate((b - 2) * 0.28); fillRR(g, -7, -30, 14, 20, 2, '#FFFFFF'); g.fillStyle = ['#E0456B', PUR, GRN, '#3167CA', '#B8863B'][b]; g.fillRect(-7, -30, 14, 3.4); g.restore(); } }
    /* the paper plane from payables to the vault */
    var pu = (t - FX.plane) / 1.4; if (pu >= 0 && pu < 1) { var x = lerp(AP.x - 10, VA.x + 20, pu), y = lerp(AP.y - 230, VA.y, pu) - Math.sin(pu * Math.PI) * 90; CO.plane(g, x, y, 1.3, -0.4 - pu * 0.6, '#FFFFFF', '#9AA6BC'); }
    /* the accountant's "matched" ticket */
    var mu = (t - FX.matched) / 1.8; if (mu >= 0 && mu < 1) { g.save(); g.globalAlpha = clamp((1 - mu) * 2.5, 0, 1); var my = ACC.y - 250 - mu * 50; fillRR(g, ACC.x - 34, my, 68, 18, 9, OK); text(g, 'Matched ✓', ACC.x, my + 12.5, 8, 800, '#FFFFFF', 'center'); g.restore(); }
    /* coins: the bookkeeper's flips into the jar */
    var cu = t - FX.coins; if (cu < 2.2) for (var q = 0; q < 3; q++) { var u = (cu - q * 0.35) / 0.9; if (u < 0 || u > 1) continue; var x0 = BKP.x + 60, x1 = 449; coin(g, lerp(x0, x1, u), lerp(BKP.y - 120, d.y - 14, u) - Math.sin(u * Math.PI) * 120, 6, t + q); }
    if (BKP._drop > 0) { var du = BKP._drop; coin(g, lerp(BKP.x + 66, 449, du), lerp(BKP.y - 92, d.y - 20, du) - Math.sin(du * Math.PI) * 30, 4.5, t); }
    /* the finance lead's level badge */
    var su = t - FX.scale; if (su < 2.6) { g.save(); g.globalAlpha = clamp((2.6 - su) * 2, 0, 1); var by = CFO.y - 300 - su * 20; fillRR(g, CFO.x - 44, by, 88, 18, 9, GRD); text(g, 'Debit = Credit', CFO.x, by + 12.5, 7.6, 800, BRL, 'center'); g.restore(); }
    /* treasury: the note counter riffles, a bundle, the cash book, the fanned notes and the flutter */
    var mx = TELL.x + 126; if (TR._count) { for (var nn = 0; nn < 4; nn++) { var fa = (t * 6 + nn * 0.25) % 1; g.save(); g.translate(mx + 28, TELL.y - 38); g.rotate(-0.8 + fa * 1.6); fillRR(g, -13, -16, 26, 9, 1.5, nn % 2 ? '#BFE3C9' : '#D7EEDC'); g.restore(); } }
    else fillRR(g, mx + 12, TELL.y - 44, 32, 8, 1.5, '#BFE3C9');
    if (TR._bundle) { var bh = handAt(TR, 0); fillRR(g, bh[0] - 14, bh[1] - 6, 28, 9, 2, '#BFE3C9'); fillRR(g, bh[0] - 4, bh[1] - 6, 8, 9, 1, BR); }
    if (TR._ledger) { var lh = handAt(TR, 0), lh2 = handAt(TR, 1); g.save(); g.translate((lh[0] + lh2[0]) / 2, (lh[1] + lh2[1]) / 2 - 8); g.rotate(-0.08); fillRR(g, -20, -13, 40, 26, 3, GRD); fillRR(g, -1, -13, 2, 26, 1, BR); fillRR(g, -17, -10, 15, 20, 2, '#FFFDF7'); fillRR(g, 2, -10, 15, 20, 2, '#FFFDF7');
      g.fillStyle = '#C9D3E3'; for (var ll = 0; ll < 4; ll++) { g.fillRect(-15, -6 + ll * 4, 11, 1.2); g.fillRect(4, -6 + ll * 4, 11, 1.2); } g.restore(); }
    if (TR._fanN) { var f0 = handAt(TR, 0), f1 = handAt(TR, 1), fx = (f0[0] + f1[0]) / 2, fy = Math.min(f0[1], f1[1]); for (var fn = 0; fn < 5; fn++) { g.save(); g.translate(fx, fy + 6); g.rotate((fn - 2) * 0.3); fillRR(g, -6, -30, 12, 24, 2, fn % 2 ? '#BFE3C9' : '#D7EEDC'); fillE(g, 0, -18, 3, 3, '#7FBF95'); g.restore(); } }
    var cu2 = t - FX.cash - 1.1; if (cu2 > 0 && cu2 < 2.4) for (var fl = 0; fl < 7; fl++) { var a2 = clamp(2.4 - cu2, 0, 1), px2 = TR.x + (hash(fl) - 0.5) * 150 + Math.sin(cu2 * 3 + fl) * 14, py2 = TR.y - 230 - 60 * Math.sin(Math.min(1, cu2) * Math.PI / 2) + cu2 * cu2 * 34 + hash(fl + 4) * 30;
      g.save(); g.globalAlpha = a2; g.translate(px2, py2); g.rotate(Math.sin(cu2 * 5 + fl) * 0.8); fillRR(g, -7, -4, 14, 8, 1.5, fl % 2 ? '#BFE3C9' : '#D7EEDC'); g.restore(); }
    var cu3 = t - FX.cash; if (cu3 < 2.8) { g.save(); g.globalAlpha = clamp((2.8 - cu3) * 2, 0, 1); var cy3 = TR.y - 300 - cu3 * 12; fillRR(g, TR.x - 46, cy3, 92, 18, 9, GRD); text(g, 'Cash reconciled ✓', TR.x, cy3 + 12.5, 7.4, 800, BRL, 'center'); g.restore(); }
    CR.draw(g, t);
  }

  /* ---------- the cast: an idle loop and a tap routine each ---------- */
  function actAcc(P, t, S) { /* the accountant: types, adds on the calculator, pushes up her glasses; tapped: spins her chair and shows a match */
    var st = S.cast.acc, busy = S.hot === 'bank' || S.hot === 'reports', u = tapU(st, t, 2.2), c = (t + 1.3) % 8; reset(P); P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm';
    if (u >= 0) { if (FX.matched < st.tapT) { FX.matched = st.tapT + 1.0; CR.burst('star', P.x, P.y - 260, t); } P.mood = 'happy'; P.talk = true;
      if (u < 0.45) { P.sx = Math.cos(u / 0.45 * Math.PI * 2); P.hands = [[-90, -230], [90, -230]]; } else { P.hands = [[-110, -400 + Math.sin(t * 14) * 10], [110, -400 - Math.sin(t * 14) * 10]]; P.hop = Math.abs(Math.sin(u * Math.PI * 3)) * 10; } return; }
    if (busy || c < 4.6) { var k2 = Math.abs(Math.sin(t * (busy ? 11 : 8) + P.ph)) * 6; P.hands = [[-60, -206 - k2], [60, -206 - (6 - k2)]]; look(P, st, t, S, 0.5); }
    else if (c < 6.2) { P.hands = [[-110, -206 - Math.abs(Math.sin(t * 14)) * 8], [50, -206]]; look(P, st, t, S, -0.6); FX.tape = Math.min(1, FX.tape + 0.006); if (FX.tape >= 1) FX.tape = 0; }
    else { P.hands = [[-60, -206], [40, -372]]; P.tilt = -0.05; look(P, st, t, S, 0); }
  }
  function actAp(P, t, S) { /* payables: takes a bill from the tray, reads it, keys it, files it; tapped: fans the bills and sends a paper plane to the vault */
    var st = S.cast.ap, busy = S.hot === 'bills' || S.hot === 'invoices', u = tapU(st, t, 2.4), c = (t + 0.4) % 6.5; reset(P); P._bill = false; P._fan = false; P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm';
    if (u >= 0) { P.mood = 'happy'; P.talk = true;
      if (u < 0.5) { P._fan = true; P.hands = [[-50, -330], [50, -330]]; P.tilt = Math.sin(t * 8) * 0.06; }
      else { if (FX.plane < st.tapT) { FX.plane = t; FX.cap.push({ t0: t + 0.6, drop: 848 }); setTimeout(function () { CR.burst('spark', VA.x, VA.y, S.t); }, 1300); } P.hands = [[-60, -206], [lerp(40, -60, (u - 0.5) * 2), -360]]; P.hop = Math.sin((u - 0.5) * 2 * Math.PI) * 8; }
      return; }
    if (!busy && c < 1) { P.hands = [[-60, -206], [110, -214]]; look(P, st, t, S, 0.8); }
    else if (!busy && c < 2.4) { P._bill = true; P.hands = [[-40, -250], [40, -262]]; look(P, st, t, S, 0.1); P.tilt = 0.05; }
    else if (!busy && c < 3.4) { P._bill = true; P.hands = [[-60, -206], [104, -200]]; look(P, st, t, S, 0.8); }
    else { var k2 = Math.abs(Math.sin(t * (busy ? 11 : 7) + P.ph)) * 6; P.hands = [[-60, -206 - k2], [60, -206 - (6 - k2)]]; look(P, st, t, S, -0.5); }
  }
  function actCfo(P, t, S) { /* the finance lead: shifts her weight, checks her watch, ticks the checklist, points at the close board; tapped: weighs the books level */
    var st = S.cast.cfo, busy = S.hot === 'tax' || S.hot === 'close', u = tapU(st, t, 2.6), c = (t + 2) % 9; reset(P); P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm';
    if (u >= 0) { if (FX.scale < st.tapT) { FX.scale = t; CR.burst('conf', P.x, P.y - 280, t); } P.mood = 'happy'; P.talk = true;
      if (u < 0.4) { P.hands = [[-70, -210], [150, -250]]; P.look = 1; P.tilt = 0.06; } else { P.hands = [[-110, -400], [110, -400 + Math.sin(t * 12) * 10]]; P.hop = Math.abs(Math.sin((u - 0.4) * Math.PI * 2.5)) * 22; P.look = 0; }
      return; }
    if (busy) { P.hands = [[-70, -210], [-150, -330 + Math.sin(t * 3) * 8]]; look(P, st, t, S, -0.8); return; }
    P.tilt = Math.sin(t * 1.1) * 0.025;
    if (c < 3) { P.hands = [[-70, -210], [70, -170]]; look(P, st, t, S, -0.4); }
    else if (c < 4.6) { P.hands = [[-70, -250], [-20, -262]]; P.tilt = 0.09; look(P, st, t, S, -0.2); }
    else if (c < 6.6) { P.hands = [[-70, -210], [-20 + Math.sin(t * 12) * 8, -200 + Math.cos(t * 9) * 4]]; P.tilt = 0.07; look(P, st, t, S, -0.3); }
    else { P.hands = [[-70, -210], [-140, -330]]; look(P, st, t, S, -0.9); }
  }
  function actBk(P, t, S) { /* the bookkeeper: taps her tablet, snaps a receipt, drops a coin in the jar, chats; tapped: flips three coins into the jar and cheers */
    var st = S.cast.bk, u = tapU(st, t, 2.6), c = (t + 3) % 8; reset(P); P._drop = 0; P.talk = t < st.until; P.mood = P.talk ? 'happy' : 'calm';
    if (u >= 0) { if (FX.coins < st.tapT) { FX.coins = t; setTimeout(function () { FX.jar = Math.min(9, FX.jar + 3); CR.burst('star', 449, DESK.y - 30, S.t); }, 1400); } P.mood = 'happy'; P.talk = true;
      if (u < 0.6) { var fl = Math.sin(u * 30) > 0; P.hands = [[-60, -212], [110, fl ? -300 : -240]]; P.look = 0.6; } else { P.hands = [[-110, -400], [110, -400]]; P.hop = Math.sin((u - 0.6) / 0.4 * Math.PI) * 60; }
      return; }
    if (c < 3) { P.hands = [[-60, -212], [-10 + Math.sin(t * 6) * 6, -232]]; P.tilt = 0.06; look(P, st, t, S, -0.2); }
    else if (c < 4.2) { P.hands = [[-20, -360], [50, -300]]; P.look = -0.2; if (c - 3 < 0.05) CR.burst('spark', P.x - 10, P.y - 300, t); }
    else if (c < 5.4) { var du = (c - 4.2) / 1.2; P.hands = [[-60, -212], [lerp(60, 124, du), lerp(-240, -180, du)]]; P._drop = du > 0.5 ? (du - 0.5) * 2 : 0; if (du > 0.97 && FX.jar < 9 && !P._dd) { FX.jar = FX.jar >= 8 ? 3 : FX.jar + 1; P._dd = 1; } look(P, st, t, S, 0.7); }
    else { P._dd = 0; P.hands = [[-60, -212], [70, -170]]; P.talk = P.talk || Math.sin(t * 0.8) > 0.4; P.tilt = Math.sin(t * 3) * 0.05; look(P, st, t, S, 0.9); }
  }
  function actTr(P, t, S) { /* treasury: feeds the note counter, bands a bundle, checks the T-account, reads the cash book; tapped: fans the notes overhead and lets them flutter */
    var st = S.cast.tr, u = tapU(st, t, 2.6), c = (t + 0.5) % 9; reset(P); P._count = false; P._fanN = false; P._bundle = false; P._ledger = false; P.talk = t < st.until; P.mood = P.talk ? 'happy' : 'calm';
    if (u >= 0) { P.mood = 'happy'; P.talk = true; P._fanN = true; if (FX.cash < st.tapT) { FX.cash = t; CR.burst('star', P.x, P.y - 280, t); }
      if (u < 0.45) { P.hands = [[-50, -380], [50, -380]]; P.tilt = Math.sin(t * 10) * 0.05; } else { P.hands = [[-90, -400], [90, -400]]; P.hop = Math.abs(Math.sin((u - 0.45) / 0.55 * Math.PI * 2)) * 18; } return; }
    if (c < 3.6) { P._count = true; P.hands = [[-20, -192], [118, -200 + Math.sin(t * 14) * 4]]; look(P, st, t, S, 0.6); }
    else if (c < 5.2) { var k = (c - 3.6) / 1.6; P._bundle = true; P.hands = [[-100, -200 - Math.abs(Math.sin(k * Math.PI * 3)) * 30], [-60, -196]]; look(P, st, t, S, -0.6); }
    else if (c < 6.6) { P.hands = [[-70, -192], [-150, -330]]; P.tilt = -0.04; look(P, st, t, S, -0.9); }
    else { P._ledger = true; P.hands = [[-40, -250], [40, -262]]; P.tilt = 0.04; look(P, st, t, S, 0.1); }
  }
  function glowOf(b, pad) { return function (g) { rr(g, b.x - pad, b.y - pad, b.w + pad * 2, b.h + pad * 2, 12); }; }
  window.IXW.worlds['app-acc'] = {
    pan: [-300, 1200],
    calmView: [186, -124, 810, 648], calmCast: ['acc', 'ap', 'cfo', 'bk'],
    paintBg: paintBg, windowBehind: true, paintFrame: function () {}, paintBack: paintBack, paintFront: paintFront, paintFore: paintFore,
    paintWindow: paintWindow, paintLive: paintLive, paintFrontLive: paintFrontLive,
    paintForeLive: function (g, t, S) { K.zfore(g, t, S, [], function () { CO.crew(crewVis(), g, t, S, 'fore'); }); CR.draw(g, t); },
    moteCol: 'rgba(201,164,74,.28)',
    glow: { bank: glowOf(BK, 10), reports: glowOf(RP, 8), invoices: glowOf(INV, 8), bills: glowOf(BIL, 8), tax: glowOf(TAX, 8), close: glowOf(CLS, 8), stamp: function (g) { var s = SIDE; rr(g, s.x - 4, s.y - 60, s.w + 8, 66, 10); } },
    backGlow: ['bank', 'reports', 'invoices', 'bills', 'tax', 'close', 'stamp'],
    cast: [
      { id: 'acc', behind: true, keys: ['bank', 'reports'], P: ACC, act: actAcc },
      { id: 'ap', behind: true, keys: ['bills', 'invoices'], P: AP, act: actAp },
      { id: 'cfo', behind: false, keys: ['tax', 'close'], P: CFO, act: actCfo },
      { id: 'bk', behind: false, keys: [], P: BKP, act: actBk },
      { id: 'tr', behind: true, keys: [], P: TR, act: actTr }
    ],
    toy: function (name, S, t) { if (name === 'stamp') { FX.stamp = t; CR.burst('spark', SIDE.x + 40, SIDE.y - 20, t); } },
    hit: function (x, y, S, t) {
      var r = CR.hitWalker(x, y, t); if (r) return r;
      if (Math.hypot(x - VA.x, y - VA.y) < VA.r + 8) { FX.vault = t; CR.burst('star', VA.x, VA.y - 20, t); return { say: 'The ledger vault: every bank line **matched** to an invoice or a bill.', near: [662, -6], pose: 'wow' }; }
      if (x > SCALE.x - 60 && x < SCALE.x + 60 && y > SCALE.y - 30 && y < F) { FX.scale = t; CR.burst('conf', SCALE.x, SCALE.y - 20, t); return { say: 'Debits and credits, **balanced**. Every entry in Odoo is.', near: [662, -6], pose: 'celebrate' }; }
      return null;
    },
    onStop: function (key, S, t) { S.kT = t; if (key === 'bank') FX.cap.push({ t0: t, drop: 404 }); }
  };
})(window.IXW && window.IXW.kit, window.CR, window.CO);
