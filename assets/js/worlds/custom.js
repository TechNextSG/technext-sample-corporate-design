/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: custom (/odoo/erp-system) — Odoo customization as a tailor's atelier. Standard Odoo is the ready-to-wear rack (it
   already fits most of a business); the alteration order on the wall climbs from standard apps through configuration and
   Studio to a custom module, and only climbs when it must; the pattern is drafted as clean code on the cutting-table laptop;
   the custom module is cut and sewn as a separate piece at the sewing machine; the next-season mirror tries the module on the
   next version and ticks it upgrade-safe; the garment bags are the three ways to run Odoo (Odoo Online, Odoo.sh, on-premise).
   TechNext's people: a pattern drafter (developer) at the cutting table, a developer at the sewing machine, the head tailor
   (lead consultant, tape round the neck) measuring a client on the fitting podium. The client wears a grey visitor pass.
   Every person has an idle loop of their own and a tap choreography of their own (written below, not the shared acts). */
(function (K, CR, CO) {
  'use strict';
  if (!K || !CR || !CO) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed;
  var F = 470, CEIL = -232;
  var PLUM = '#714B67', PLUM_D = '#553449', BRASS = '#C9A24A', BRASS_D = '#A07C2E', INK = '#23284A', TAPE = '#F2C94C', PIN = '#D64545', WAL = '#8A5B3A', WAL_D = '#6E4529', BLUE = '#3167CA', MINT = '#2E9C7E', PINK = '#E0456B', CREAM = '#FFFBF2';
  /* the set (units): the garment bags over the ready-to-wear rack, the partner plaque and hanging tape, the alteration order,
     the cutting table with its laptop and the boxed module, the mirror over the fitting podium, the spool wall and sewing table */
  var BAGS = { x: 176, y: -118, w: 168 }, RACK = { x: 180, y: 118, w: 160 }, PLAQ = { x: 352, y: -134, w: 106, h: 50 };
  var BOARD = { x: 470, y: -138, w: 172, h: 260 }, TABLE = { x: 362, y: 392, w: 268 }, LAP = { x: 390, y: 316, w: 106, h: 68 }, BOX = { x: 584, y: 350, w: 46, h: 42 };
  var MIR = { x: 660, y: -140, w: 330, h: 152 }, CARD = { x: 740, y: 30, w: 92, h: 128 }, CLK = { x: 698, y: 84, r: 21 }, POD = { x: 680, y: 446, rx: 66, ry: 12 };
  var PEG = { x: 860, y: 44, w: 132, h: 184 }, SEW = { x: 858, y: 392, w: 140 };
  var WINS = [{ x: -770, y: -132, w: 150, h: 396 }, { x: 1048, y: -132, w: 150, h: 396 }];
  var LAYERS = [{ key: 'standard', name: 'Standard apps', sub: 'off the rack · one database', col: MINT },
    { key: 'config', name: 'Configuration', sub: 'settings, rules, reports', col: BLUE },
    { key: 'studio', name: 'Studio', sub: 'fields, views, approvals', col: PINK },
    { key: 'module', name: 'Custom module', sub: 'only where it earns its place', col: PLUM }];
  var RACKC = ['#3167CA', '#2E9C7E', '#E9A23B', '#714B67', '#E0456B'];
  var CODE = [['class ', 'SaleOrder', '(models.Model):'], ['    _inherit = ', '"sale.order"', ''], ['    approval_required = ', 'fields.Boolean()', ''], ['', '', ''], ['    def ', 'action_confirm', '(self):'], ['        self.', '_check_approval', '()'], ['        return ', 'super()', '.action_confirm()']];
  function setU(g, sx, sy, k) { g.translate(sx, sy); g.scale(k, k); }
  function extOf(W, H, k, sx, sy) { return { l: -(sx + 24) / k, r: (W - sx) / k, t: -(sy + 24) / k, b: (H - sy) / k }; }
  function arch(g, w) { var r = w.w / 2; g.moveTo(w.x, w.y + w.h); g.lineTo(w.x, w.y + r); g.arc(w.x + r, w.y + r, r, Math.PI, 0); g.lineTo(w.x + w.w, w.y + w.h); g.closePath(); }
  function ease(u) { u = clamp(u, 0, 1); return u * u * (3 - 2 * u); }
  /* a hand of a cast member in set units (the engine's person() model: hands relative to the floor point, scaled by P.s) */
  function hw(P, i) { var h = P.hands[i], sxk = P.sx == null ? 1 : P.sx, drop = P.sit ? (P.sitDrop != null ? P.sitDrop : 46) : 0; return [P.x + h[0] * P.s * sxk, P.y + (h[1] - (P.hop || 0) + drop) * P.s]; }
  /* a tap on a cast member: the engine stamps st.wave = tap time + 1.6; u runs 0..1 over the choreography, -1 outside it */
  function tapU(st, t, dur) { if (!st || !st.wave) return -1; var u = (t - (st.wave - 1.6)) / dur; return u >= 0 && u < 1 ? u : -1; }
  function looks(P, st, t, S, rest) { P.look = lerp(P.look, t < st.until ? clamp((S.nexi.x - P.x) / 160, -1, 1) : rest, 0.08); }

  /* ------------------------------ small painters ------------------------------ */
  function jacket(g, x, y, col, s, rot) { /* a suit jacket on a hanger hooked at (x, y) */
    g.save(); g.translate(x, y); g.rotate(rot || 0); g.scale(s, s);
    g.strokeStyle = '#8A94A8'; g.lineWidth = 2.4; g.beginPath(); g.arc(0, -4, 5, Math.PI * 1.1, Math.PI * 0.1); g.stroke();
    g.strokeStyle = WAL; g.lineWidth = 3.4; g.beginPath(); g.moveTo(-24, 10); g.lineTo(0, 1); g.lineTo(24, 10); g.stroke();
    var d = K.tone(col, 0.16);
    fillRR(g, -31, 12, 12, 92, 6, d); fillRR(g, 19, 12, 12, 92, 6, d);
    g.fillStyle = col; g.beginPath(); g.moveTo(-24, 8); g.lineTo(24, 8); g.lineTo(28, 112); g.quadraticCurveTo(0, 120, -28, 112); g.closePath(); g.fill();
    g.fillStyle = '#FFFFFF'; g.beginPath(); g.moveTo(-9, 8); g.lineTo(0, 40); g.lineTo(9, 8); g.closePath(); g.fill();
    g.fillStyle = d; g.beginPath(); g.moveTo(-10, 8); g.lineTo(0, 44); g.lineTo(-4, 60); g.lineTo(-16, 22); g.closePath(); g.fill(); g.beginPath(); g.moveTo(10, 8); g.lineTo(0, 44); g.lineTo(4, 60); g.lineTo(16, 22); g.closePath(); g.fill();
    fillE(g, 0, 70, 2.4, 2.4, '#F2E3B3'); fillE(g, 0, 86, 2.4, 2.4, '#F2E3B3'); fillRR(g, 10, 30, 10, 3, 1.5, 'rgba(255,255,255,.55)');
    g.restore();
  }
  function bust(g, x, y, s, col) { /* a dress form with a jacket on it: knob, neck, torso, the pole and the tripod */
    g.save(); g.translate(x, y); g.scale(s, s);
    fillRR(g, -3, 96, 6, 70, 2, BRASS_D); g.strokeStyle = BRASS_D; g.lineWidth = 4; g.beginPath(); g.moveTo(-26, 176); g.lineTo(0, 160); g.lineTo(26, 176); g.moveTo(0, 160); g.lineTo(0, 178); g.stroke();
    fillE(g, 0, -6, 6, 6, BRASS); fillRR(g, -9, 0, 18, 14, 5, '#E9DCC4');
    g.fillStyle = '#EFE3CC'; g.beginPath(); g.moveTo(-32, 16); g.quadraticCurveTo(0, 6, 32, 16); g.quadraticCurveTo(40, 50, 26, 70); g.quadraticCurveTo(34, 92, 30, 100); g.lineTo(-30, 100); g.quadraticCurveTo(-34, 92, -26, 70); g.quadraticCurveTo(-40, 50, -32, 16); g.closePath(); g.fill();
    if (col) { var d = K.tone(col, 0.16); g.fillStyle = col; g.beginPath(); g.moveTo(-34, 16); g.quadraticCurveTo(0, 8, 34, 16); g.lineTo(36, 98); g.quadraticCurveTo(0, 106, -36, 98); g.closePath(); g.fill();
      g.fillStyle = '#FFFFFF'; g.beginPath(); g.moveTo(-9, 12); g.lineTo(0, 44); g.lineTo(9, 12); g.closePath(); g.fill();
      g.fillStyle = d; g.beginPath(); g.moveTo(-11, 12); g.lineTo(0, 48); g.lineTo(-5, 62); g.lineTo(-17, 24); g.closePath(); g.fill(); g.beginPath(); g.moveTo(11, 12); g.lineTo(0, 48); g.lineTo(5, 62); g.lineTo(17, 24); g.closePath(); g.fill(); }
    g.restore();
  }
  function pin(g, x, y, col) { g.strokeStyle = '#B7BFCC'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 5, y + 8); g.stroke(); fillE(g, x, y, 2.8, 2.8, col || PIN); fillE(g, x - 0.8, y - 0.9, 0.9, 0.9, 'rgba(255,255,255,.7)'); }
  function tick(g, x, y, r) { fillE(g, x, y, r, r, '#2BAE74'); g.strokeStyle = '#FFFFFF'; g.lineWidth = r * 0.28; g.lineCap = 'round'; g.beginPath(); g.moveTo(x - r * 0.45, y); g.lineTo(x - r * 0.1, y + r * 0.38); g.lineTo(x + r * 0.5, y - r * 0.38); g.stroke(); }
  function steam(g, x, y, t, n) { for (var i = 0; i < n; i++) { var u = ((t * 0.55 + i / n) % 1); g.globalAlpha = (1 - u) * 0.5; fillE(g, x + Math.sin(t * 2 + i * 2) * 6 * u, y - u * 60, 6 + u * 10, 6 + u * 10, '#FFFFFF'); } g.globalAlpha = 1; }
  function bolt(g, x, y, w, col) { /* a fabric bolt on a shelf, seen end-on with its roll */ fillRR(g, x, y, w, 26, 4, col); g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(x + 3, y + 4, w - 6, 3); fillE(g, x + w - 6, y + 13, 6, 12, K.tone(col, 0.2)); fillE(g, x + w - 6, y + 13, 2, 4, '#E9DCC4'); }

  /* ------------------------------ the static layers ------------------------------ */
  function paintBg(g, W, H, k, sx, sy) { /* the daylight beyond the arched windows: sky and the Singapore skyline */
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    CO.sky(g, e, CEIL, 280, [[0, '#7FC0F0'], [0.7, '#D9EEFB'], [1, '#F4FAFE']]);
    CO.skySG(g, e.l, e.r, 200, 262, { mbs: -690, wheel: 1080 });
    g.fillStyle = '#E8D9C2'; g.fillRect(e.l, 262, e.r - e.l, F - 262);
    g.restore();
  }
  function paintWindow(g, t) { /* clouds drift past the two arched windows */
    WINS.forEach(function (w, i) { for (var c = 0; c < 2; c++) { var x = w.x - 60 + ((hash(c + i * 3) * 300 + t * (5 + c * 2)) % (w.w + 120)); K.cloud(g, x, w.y + 70 + c * 70, 0.26 + c * 0.05); } });
  }
  function paintBack(g, e) {
    CREW.forEach(function (w) { if (w.x0 < 0) return; if (w.x1b == null) w.x1b = w.x1; w.x1 = Math.min(w.x1b, e.r - 150); });
    /* the linen wall, pinstriped, with the two arches cut out of it */
    var wg = g.createLinearGradient(0, CEIL, 0, 300); wg.addColorStop(0, '#FCF8F1'); wg.addColorStop(1, '#F3E9D8');
    g.beginPath(); g.rect(e.l - 10, CEIL, e.r - e.l + 20, F - CEIL); WINS.forEach(function (w) { arch(g, w); }); g.fillStyle = wg; g.fill('evenodd');
    g.save(); g.beginPath(); g.rect(e.l - 10, CEIL, e.r - e.l + 20, 300 - CEIL); WINS.forEach(function (w) { arch(g, w); }); g.clip('evenodd');
    g.strokeStyle = 'rgba(150,110,60,.07)'; g.lineWidth = 1.2; g.beginPath(); for (var x = Math.floor(e.l / 16) * 16; x < e.r; x += 16) { g.moveTo(x, CEIL); g.lineTo(x, 300); } g.stroke();
    /* the daylight falling in from the left windows */
    g.fillStyle = 'rgba(255,248,226,.32)'; [[-620, 120], [-440, 90], [1198, 80]].forEach(function (b) { g.beginPath(); g.moveTo(b[0], -60); g.lineTo(b[0] + b[1], -60); g.lineTo(b[0] + b[1] + 300, 300); g.lineTo(b[0] + 300, 300); g.closePath(); g.fill(); });
    g.restore();
    /* the walnut wainscot and the brass rail */
    var wa = g.createLinearGradient(0, 300, 0, F); wa.addColorStop(0, '#E9D6BA'); wa.addColorStop(1, '#DCC3A1'); g.fillStyle = wa; g.fillRect(e.l - 10, 300, e.r - e.l + 20, F - 300);
    g.strokeStyle = 'rgba(110,70,40,.16)'; g.lineWidth = 2; for (var px = Math.floor(e.l / 120) * 120; px < e.r; px += 120) { rr(g, px + 10, 318, 100, 128, 6); g.stroke(); }
    fillRR(g, e.l - 10, 293, e.r - e.l + 20, 10, 3, WAL); g.fillStyle = BRASS; g.fillRect(e.l - 10, 293, e.r - e.l + 20, 2);
    g.fillStyle = WAL_D; g.fillRect(e.l - 10, F - 14, e.r - e.l + 20, 14); g.fillStyle = 'rgba(255,255,255,.25)'; g.fillRect(e.l - 10, F - 14, e.r - e.l + 20, 2);
    /* the oak floor in a herringbone, a long runner rug down the middle */
    var fg = g.createLinearGradient(0, F, 0, e.b); fg.addColorStop(0, '#E8D2B0'); fg.addColorStop(1, '#D6B78C'); g.fillStyle = fg; g.fillRect(e.l - 10, F, e.r - e.l + 20, e.b - F + 10);
    g.strokeStyle = 'rgba(120,80,40,.15)'; g.lineWidth = 1.2; g.beginPath();
    for (var fy = F; fy < e.b + 20; fy += 22) for (var fx = Math.floor(e.l / 44) * 44; fx < e.r + 44; fx += 44) { g.moveTo(fx, fy); g.lineTo(fx + 22, fy + 22); g.lineTo(fx + 44, fy); g.moveTo(fx + 22, fy + 22); g.lineTo(fx + 22, fy + 44); } g.stroke();
    g.fillStyle = 'rgba(60,40,20,.10)'; g.fillRect(e.l - 10, F, e.r - e.l + 20, 6);
    fillE(g, 720, 500, 230, 40, '#A8798F'); fillE(g, 720, 500, 214, 33, '#C59CB0'); g.setLineDash([5, 5]); g.strokeStyle = 'rgba(255,240,200,.8)'; g.lineWidth = 2; g.beginPath(); g.ellipse(720, 500, 196, 27, 0, 0, 7); g.stroke(); g.setLineDash([]); fillE(g, 720, 500, 120, 14, 'rgba(255,255,255,.18)');
    /* the window frames: white arches, a brass mullion, sills */
    WINS.forEach(function (w) { g.save(); g.lineWidth = 10; g.strokeStyle = '#FFFFFF'; g.beginPath(); arch(g, w); g.stroke(); g.lineWidth = 4; g.strokeStyle = BRASS; g.beginPath(); g.moveTo(w.x + w.w / 2, w.y + 6); g.lineTo(w.x + w.w / 2, w.y + w.h); g.moveTo(w.x, w.y + w.h * 0.45); g.lineTo(w.x + w.w, w.y + w.h * 0.45); g.stroke(); g.restore();
      K.windowGlass(g, { x: w.x, y: w.y + 40, w: w.w, h: w.h - 40 }); fillRR(g, w.x - 14, w.y + w.h, w.w + 28, 12, 4, '#FFFFFF'); });
    /* the ceiling, coffered, and the crown moulding */
    var cg = g.createLinearGradient(0, e.t, 0, CEIL); cg.addColorStop(0, '#EFE6D8'); cg.addColorStop(1, '#F8F2E9'); g.fillStyle = cg; g.fillRect(e.l - 10, e.t - 10, e.r - e.l + 20, CEIL - e.t + 10);
    g.strokeStyle = 'rgba(150,110,60,.12)'; g.lineWidth = 2; for (var cx = Math.floor(e.l / 180) * 180; cx < e.r; cx += 180) { rr(g, cx + 12, e.t + 8, 156, CEIL - e.t - 22, 6); g.stroke(); }
    fillRR(g, e.l - 10, CEIL - 6, e.r - e.l + 20, 14, 2, '#FFFFFF'); g.fillStyle = BRASS; g.fillRect(e.l - 10, CEIL + 6, e.r - e.l + 20, 2); g.fillStyle = 'rgba(120,80,40,.10)'; g.fillRect(e.l - 10, CEIL + 8, e.r - e.l + 20, 5);
    /* pendant lamps (static; their pools of light are part of the wall) */
    [300, 860, -380, 1260].forEach(function (lx) { g.strokeStyle = '#6E5A44'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(lx, CEIL + 8); g.lineTo(lx, -178); g.stroke();
      g.fillStyle = BRASS; g.beginPath(); g.moveTo(lx - 22, -160); g.quadraticCurveTo(lx, -196, lx + 22, -160); g.closePath(); g.fill(); fillE(g, lx, -160, 22, 4, BRASS_D); fillE(g, lx, -157, 8, 4, '#FFF6D6');
      var lg = g.createRadialGradient(lx, -150, 4, lx, -150, 110); lg.addColorStop(0, 'rgba(255,240,200,.35)'); lg.addColorStop(1, 'rgba(255,240,200,0)'); g.fillStyle = lg; g.fillRect(lx - 110, -160, 220, 140); });

    /* ---- the left margin: fabric bolts, the window, the ironing board, a dress form ---- */
    shadowed(g, 12, 5, 0.14, function () { fillRR(g, -942, -150, 170, F + 150, 8, WAL); });
    fillRR(g, -934, -142, 154, F + 134, 5, '#F4E8D6');
    for (var sh = 0; sh < 6; sh++) { var shy = -112 + sh * 92; fillRR(g, -936, shy + 30, 158, 6, 2, WAL_D);
      for (var b = 0; b < 4; b++) bolt(g, -928 + b * 36, shy + 4 - (b % 2) * 2, 32, ['#714B67', '#3167CA', '#E9A23B', '#2E9C7E', '#E0456B', '#9AA6BC', '#C98E55', '#5A6B8C'][(sh * 3 + b) % 8]); }
    bust(g, -548, 286, 1.15, '#5A6B8C'); pin(g, -566, 312, PIN); pin(g, -532, 330, '#3167CA'); pin(g, -560, 352, TAPE);
    g.setLineDash([4, 4]); g.strokeStyle = '#FFFFFF'; g.lineWidth = 2; g.beginPath(); g.moveTo(-588, 384); g.lineTo(-508, 384); g.stroke(); g.setLineDash([]);
    /* the ironing board and the iron */
    g.strokeStyle = '#8A94A8'; g.lineWidth = 4; g.beginPath(); g.moveTo(-760, F); g.lineTo(-660, 396); g.moveTo(-640, F); g.lineTo(-740, 396); g.stroke();
    fillRR(g, -790, 386, 170, 12, 6, '#CFD6E2'); fillRR(g, -786, 384, 162, 8, 4, '#E6ECF4'); g.fillStyle = 'rgba(49,103,202,.25)'; for (var ib = 0; ib < 8; ib++) g.fillRect(-776 + ib * 20, 386, 8, 4);
    g.fillStyle = '#5A6B8C'; g.beginPath(); g.moveTo(-720, 384); g.lineTo(-668, 384); g.quadraticCurveTo(-662, 368, -690, 366); g.lineTo(-712, 366); g.closePath(); g.fill(); fillRR(g, -708, 356, 30, 6, 3, INK);
    /* ---- the right margin: a finished suit waiting for collection, a tall plant ---- */
    bust(g, 1250, 286, 1.15, PLUM); fillRR(g, 1272, 326, 40, 26, 4, '#FFFFFF'); g.strokeStyle = '#B7BFCC'; g.lineWidth = 1; g.beginPath(); g.moveTo(1264, 320); g.lineTo(1276, 330); g.stroke();
    text(g, 'Ready', 1292, 337, 7, 800, PLUM, 'center'); text(g, 'to collect', 1292, 346, 5.5, 700, '#8A96A8', 'center');
    K.plant(g, { x: 1350, y: F }, '#E9DCC4', '#F2E8D6');

    atelierBack(g);
    /* ---- the garment bags: where it's worn ---- */
    fillRR(g, BAGS.x - 4, BAGS.y - 4, BAGS.w + 8, 6, 3, BRASS); fillE(g, BAGS.x, BAGS.y - 1, 5, 5, BRASS_D); fillE(g, BAGS.x + BAGS.w, BAGS.y - 1, 5, 5, BRASS_D);
    text(g, 'WHERE IT\'S WORN', BAGS.x + BAGS.w / 2, BAGS.y - 12, 7.5, 800, '#8A6A45', 'center');
    /* ---- the plaque and the hook for the hanging tape ---- */
    shadowed(g, 8, 3, 0.16, function () { fillRR(g, PLAQ.x, PLAQ.y, PLAQ.w, PLAQ.h, 8, BRASS); });
    fillRR(g, PLAQ.x + 4, PLAQ.y + 4, PLAQ.w - 8, PLAQ.h - 8, 6, '#FFF8E6'); text(g, 'odoo', PLAQ.x + PLAQ.w / 2, PLAQ.y + 24, 13, 800, PLUM, 'center'); text(g, 'Ready Partner', PLAQ.x + PLAQ.w / 2, PLAQ.y + 37, 7.5, 800, INK, 'center');
    fillE(g, 405, -66, 4, 4, BRASS_D);
    /* ---- the ready-to-wear rack (standard Odoo) ---- */
    g.strokeStyle = '#B7BFCC'; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.moveTo(RACK.x + 6, RACK.y); g.lineTo(RACK.x + 6, F - 8); g.moveTo(RACK.x + RACK.w - 6, RACK.y); g.lineTo(RACK.x + RACK.w - 6, F - 8);
    g.moveTo(RACK.x - 8, F - 8); g.lineTo(RACK.x + 20, F - 8); g.moveTo(RACK.x + RACK.w - 20, F - 8); g.lineTo(RACK.x + RACK.w + 8, F - 8); g.moveTo(RACK.x + 6, 404); g.lineTo(RACK.x + RACK.w - 6, 404); g.stroke();
    fillRR(g, RACK.x - 4, RACK.y - 4, RACK.w + 8, 8, 4, '#D7DDE6'); [RACK.x - 6, RACK.x + 18, RACK.x + RACK.w - 18, RACK.x + RACK.w + 6].forEach(function (cx) { fillE(g, cx, F - 4, 5, 5, INK); });
    shadowed(g, 6, 3, 0.14, function () { fillRR(g, RACK.x + 22, RACK.y - 36, RACK.w - 44, 28, 6, INK); });
    text(g, 'READY-TO-WEAR', RACK.x + RACK.w / 2, RACK.y - 23, 8, 800, '#FFFFFF', 'center'); text(g, 'standard Odoo apps', RACK.x + RACK.w / 2, RACK.y - 13, 6.5, 700, TAPE, 'center');
    /* folded shirts on the rack's low shelf */
    for (var fs = 0; fs < 4; fs++) { fillRR(g, RACK.x + 14 + fs * 34, 384, 30, 18, 4, ['#FFFFFF', '#DCE7FA', '#F6E2E8', '#E0F1EA'][fs]); g.fillStyle = 'rgba(30,40,70,.08)'; g.fillRect(RACK.x + 14 + fs * 34, 392, 30, 2); }
    /* ---- the alteration order ---- */
    shadowed(g, 14, 5, 0.16, function () { fillRR(g, BOARD.x, BOARD.y, BOARD.w, BOARD.h, 10, BRASS); });
    fillRR(g, BOARD.x + 5, BOARD.y + 5, BOARD.w - 10, BOARD.h - 10, 7, CREAM);
    g.strokeStyle = 'rgba(201,162,74,.18)'; g.lineWidth = 1; g.beginPath(); for (var by = BOARD.y + 14; by < BOARD.y + BOARD.h - 8; by += 12) { g.moveTo(BOARD.x + 8, by); g.lineTo(BOARD.x + BOARD.w - 8, by); } g.stroke();
    text(g, 'ALTERATION ORDER', BOARD.x + 22, BOARD.y + 24, 9.5, 800, PLUM); text(g, 'climb only when you must', BOARD.x + 22, BOARD.y + 36, 7.2, 700, '#9A8A70');
    pin(g, BOARD.x + 12, BOARD.y + 14, PIN); pin(g, BOARD.x + BOARD.w - 14, BOARD.y + 14, BLUE);
    /* ---- the next-season mirror ---- */
    shadowed(g, 16, 6, 0.18, function () { fillRR(g, MIR.x - 8, MIR.y - 8, MIR.w + 16, MIR.h + 16, 14, BRASS); });
    fillRR(g, MIR.x - 3, MIR.y - 3, MIR.w + 6, MIR.h + 6, 11, BRASS_D);
    var mg = g.createLinearGradient(MIR.x, MIR.y, MIR.x + MIR.w, MIR.y + MIR.h); mg.addColorStop(0, '#EEF4F8'); mg.addColorStop(0.5, '#FAFCFD'); mg.addColorStop(1, '#E6EEF4'); fillRR(g, MIR.x, MIR.y, MIR.w, MIR.h, 9, mg);
    g.fillStyle = 'rgba(255,255,255,.55)'; g.beginPath(); g.moveTo(MIR.x + 30, MIR.y + MIR.h); g.lineTo(MIR.x + 80, MIR.y); g.lineTo(MIR.x + 100, MIR.y); g.lineTo(MIR.x + 50, MIR.y + MIR.h); g.closePath(); g.fill();
    [MIR.x + 2, MIR.x + MIR.w - 2].forEach(function (cx) { [MIR.y + 2, MIR.y + MIR.h - 2].forEach(function (cy) { fillE(g, cx, cy, 9, 9, BRASS); fillE(g, cx, cy, 4, 4, '#FFF1C4'); }); });
    text(g, 'THIS VERSION', MIR.x + 86, MIR.y + 20, 7.5, 800, '#5C6B7A', 'center'); text(g, 'NEXT VERSION', MIR.x + MIR.w - 86, MIR.y + 20, 7.5, 800, '#5C6B7A', 'center');
    text(g, 'Odoo 20', MIR.x + 86, MIR.y + 31, 6.5, 700, '#8A96A8', 'center'); text(g, 'after the upgrade', MIR.x + MIR.w - 86, MIR.y + 31, 6.5, 700, '#8A96A8', 'center');
    g.save(); rr(g, MIR.x, MIR.y, MIR.w, MIR.h, 9); g.clip(); bust(g, MIR.x + 86, MIR.y + 48, 0.62, PLUM); bust(g, MIR.x + MIR.w - 86, MIR.y + 48, 0.62, PLUM); g.restore();
    g.strokeStyle = '#C9B48A'; g.lineWidth = 2; g.setLineDash([5, 5]); g.beginPath(); g.moveTo(MIR.x + 122, MIR.y + 82); g.quadraticCurveTo(MIR.x + MIR.w / 2, MIR.y + 40, MIR.x + MIR.w - 122, MIR.y + 82); g.stroke(); g.setLineDash([]);
    /* ---- the clock and the fitting card ---- */
    shadowed(g, 10, 4, 0.14, function () { fillRR(g, CARD.x, CARD.y, CARD.w, CARD.h, 6, '#FFFFFF'); });
    fillRR(g, CARD.x, CARD.y, CARD.w, 20, 6, PLUM); g.fillRect(CARD.x, CARD.y + 12, CARD.w, 8); text(g, 'FITTING CARD', CARD.x + CARD.w / 2, CARD.y + 14, 7, 800, '#FFFFFF', 'center');
    pin(g, CARD.x + CARD.w / 2, CARD.y - 2, TAPE);
    ['Measured', 'Pinned', 'Fitted', 'Still fits'].forEach(function (s, i) { fillRR(g, CARD.x + 10, CARD.y + 32 + i * 22, 12, 12, 3, '#F3EDE2'); text(g, s, CARD.x + 28, CARD.y + 42 + i * 22, 8, 800, INK); });
    text(g, 'after the upgrade', CARD.x + 28, CARD.y + 116, 5.6, 700, '#8A96A8');
    /* ---- the fitting podium (its top: the client stands on it) and the rug ---- */
        fillE(g, POD.x, POD.y + 22, POD.rx, POD.ry, '#5A3E2B'); g.fillStyle = '#7A5538'; g.fillRect(POD.x - POD.rx, POD.y, POD.rx * 2, 22); fillE(g, POD.x, POD.y, POD.rx, POD.ry, '#B98A5E'); fillE(g, POD.x, POD.y, POD.rx - 8, POD.ry - 3, '#C99A6B');
    /* ---- the spool wall ---- */
    shadowed(g, 10, 4, 0.14, function () { fillRR(g, PEG.x, PEG.y, PEG.w, PEG.h, 8, '#E7D3B3'); });
    g.fillStyle = 'rgba(110,70,40,.22)'; for (var pr = 0; pr < 9; pr++) for (var pc = 0; pc < 7; pc++) fillE(g, PEG.x + 12 + pc * 18, PEG.y + 12 + pr * 20, 1.6, 1.6, 'rgba(110,70,40,.22)');
    text(g, 'THREAD', PEG.x + PEG.w / 2, PEG.y + PEG.h - 8, 7, 800, '#8A6A45', 'center');
    /* scissors hanging on the spool wall */
    g.save(); g.translate(PEG.x + 112, PEG.y + 128); g.rotate(0.3); g.strokeStyle = '#8A94A8'; g.lineWidth = 3; g.beginPath(); g.moveTo(0, 0); g.lineTo(-6, 34); g.moveTo(0, 0); g.lineTo(6, 34); g.stroke();
    g.strokeStyle = PLUM; g.lineWidth = 3; g.beginPath(); g.arc(-7, -8, 6, 0, 7); g.stroke(); g.beginPath(); g.arc(7, -8, 6, 0, 7); g.stroke(); g.restore();
  }
  /* ---- the fitting corner behind the title card: a framed pattern sketch, an embroidery hoop, a shelf of boxed apps,
     a sideboard, a dress form with a jacket half pinned, a velvet armchair on a round rug ---- */
  var DF = { x: -150 }, ARM = { x: -330, y: 600 };
  function atelierBack(g) {
    /* the round rug under the armchair */
    fillE(g, ARM.x + 20, 606, 150, 26, '#C9A27A'); fillE(g, ARM.x + 20, 606, 138, 21, '#E9D6BA'); g.setLineDash([4, 5]); g.strokeStyle = 'rgba(113,75,103,.45)'; g.lineWidth = 2; g.beginPath(); g.ellipse(ARM.x + 20, 606, 122, 16, 0, 0, 7); g.stroke(); g.setLineDash([]);
    /* the framed pattern sketch: a jacket drafted on squared paper, measure lines and three notes */
    var fx = -462, fy = -58, fw = 214, fh = 196;
    shadowed(g, 14, 5, 0.16, function () { fillRR(g, fx - 8, fy - 8, fw + 16, fh + 16, 8, WAL); }); fillRR(g, fx - 3, fy - 3, fw + 6, fh + 6, 5, BRASS); fillRR(g, fx, fy, fw, fh, 3, '#FFF8EA');
    g.strokeStyle = 'rgba(49,103,202,.10)'; g.lineWidth = 1; g.beginPath(); for (var gx = fx + 12; gx < fx + fw; gx += 12) { g.moveTo(gx, fy); g.lineTo(gx, fy + fh); } for (var gy = fy + 12; gy < fy + fh; gy += 12) { g.moveTo(fx, gy); g.lineTo(fx + fw, gy); } g.stroke();
    text(g, 'PATTERN No. 01 · STANDARD FIRST', fx + 12, fy + 18, 7, 800, PLUM);
    g.save(); g.translate(fx + 78, fy + 34); g.strokeStyle = INK; g.lineWidth = 1.8; g.lineJoin = 'round';
    g.beginPath(); g.moveTo(-34, 6); g.lineTo(-10, 0); g.lineTo(0, 30); g.lineTo(10, 0); g.lineTo(34, 6); g.lineTo(44, 60); g.lineTo(36, 132); g.quadraticCurveTo(0, 142, -36, 132); g.lineTo(-44, 60); g.closePath(); g.stroke();
    g.beginPath(); g.moveTo(-34, 6); g.lineTo(-56, 110); g.lineTo(-46, 112); g.moveTo(34, 6); g.lineTo(56, 110); g.lineTo(46, 112); g.moveTo(0, 30); g.lineTo(0, 136); g.stroke();
    fillE(g, 4, 66, 2.2, 2.2, INK); fillE(g, 4, 86, 2.2, 2.2, INK); fillE(g, 4, 106, 2.2, 2.2, INK);
    g.setLineDash([3, 3]); g.strokeStyle = PIN; g.lineWidth = 1.2; g.beginPath(); g.moveTo(-60, 0); g.lineTo(-60, 136); g.moveTo(-44, 150); g.lineTo(44, 150); g.stroke(); g.setLineDash([]);
    g.restore();
    [['fields', 64, PINK], ['views', 104, BLUE], ['approvals', 144, MINT]].forEach(function (n) { var ny = fy + n[1]; g.strokeStyle = n[2]; g.lineWidth = 1.2; g.beginPath(); g.moveTo(fx + 124, ny - 3); g.lineTo(fx + 140, ny - 3); g.stroke();
      fillRR(g, fx + 142, ny - 12, 60, 16, 4, '#FFFFFF'); g.strokeStyle = n[2]; rr(g, fx + 142, ny - 12, 60, 16, 4); g.stroke(); text(g, n[0], fx + 172, ny - 1, 7, 800, n[2], 'center'); });
    text(g, 'Studio before code', fx + fw - 10, fy + fh - 8, 6.4, 700, '#9A8A70', 'right');
    /* the embroidery hoop on the wall */
    var hx = -112, hy = -6; g.fillStyle = '#B7BFCC'; g.fillRect(hx - 1, hy - 74, 2, 14); fillE(g, hx, hy, 58, 58, BRASS_D); fillE(g, hx, hy, 53, 53, '#FFFDF6');
    g.strokeStyle = 'rgba(214,69,69,.6)'; g.lineWidth = 1.4; g.setLineDash([2.5, 2.5]); g.beginPath(); g.arc(hx, hy, 46, 0, 7); g.stroke(); g.setLineDash([]);
    text(g, 'Measure', hx, hy - 12, 11, 800, PLUM, 'center'); text(g, 'twice,', hx, hy + 2, 11, 800, PLUM, 'center'); text(g, 'code once.', hx, hy + 17, 10, 800, MINT, 'center');
    for (var fl = 0; fl < 5; fl++) { var fa = Math.PI * 0.65 + fl * 0.16; fillE(g, hx + Math.cos(fa) * 40, hy + Math.sin(fa) * 40, 3.2, 3.2, [PINK, TAPE, BLUE, MINT, PINK][fl]); }
    /* the shelf: the boxed apps, spools, a vase */
    fillRR(g, -210, 112, 250, 7, 3, WAL); g.fillStyle = WAL_D; g.fillRect(-196, 119, 5, 14); g.fillRect(16, 119, 5, 14);
    [['Sales', '#E46E78', 0], ['Inventory', '#F2A33A', 1], ['Accounting', '#2E9C7E', 2]].forEach(function (b2) { var by = 94 - b2[2] * 19, bw = 78 - b2[2] * 6; fillRR(g, -200 + b2[2] * 3, by, bw, 18, 3, '#F4ECDD'); fillRR(g, -200 + b2[2] * 3, by, 8, 18, 2, b2[1]); text(g, b2[0], -186 + b2[2] * 3, by + 12.5, 7, 800, INK); });
    [[-96, PLUM], [-80, BLUE], [-64, TAPE], [-48, MINT]].forEach(function (sp) { fillRR(g, sp[0] - 6, 94, 12, 18, 2, '#E9DCC4'); fillRR(g, sp[0] - 5, 97, 10, 12, 3, sp[1]); });
    fillRR(g, -10, 86, 22, 26, 8, '#FFFFFF'); g.strokeStyle = '#2E9E66'; g.lineWidth = 2; [[-6, -14], [1, -22], [8, -12]].forEach(function (st2) { g.beginPath(); g.moveTo(1, 88); g.lineTo(st2[0], st2[1] + 88); g.stroke(); fillE(g, st2[0], st2[1] + 86, 5, 5, st2[0] < 0 ? PINK : st2[0] > 4 ? TAPE : '#FFFFFF'); });
    /* the sideboard: drawers with brass pulls, a basket and fabric rolls on top */
    var sb = { x: -462, y: 378, w: 196 }; soft(g, sb.x + sb.w / 2, F + 3, sb.w * 0.55, 7, 0.22); fillRR(g, sb.x, sb.y, sb.w, F - sb.y - 6, 6, WAL); fillRR(g, sb.x - 4, sb.y - 6, sb.w + 8, 10, 4, WAL_D);
    for (var dr = 0; dr < 3; dr++) { fillRR(g, sb.x + 8 + dr * 62, sb.y + 12, 56, 32, 4, '#9A6B48'); fillRR(g, sb.x + 8 + dr * 62, sb.y + 50, 56, 26, 4, '#9A6B48'); fillRR(g, sb.x + 28 + dr * 62, sb.y + 26, 16, 4, 2, BRASS); fillRR(g, sb.x + 28 + dr * 62, sb.y + 61, 16, 4, 2, BRASS); }
    fillRR(g, sb.x + 6, F - 8, 10, 8, 2, WAL_D); fillRR(g, sb.x + sb.w - 16, F - 8, 10, 8, 2, WAL_D);
    fillRR(g, sb.x + 14, sb.y - 34, 54, 28, 8, '#C98E55'); g.strokeStyle = 'rgba(110,60,20,.35)'; g.lineWidth = 1.6; for (var bw2 = 0; bw2 < 3; bw2++) { g.beginPath(); g.moveTo(sb.x + 16, sb.y - 26 + bw2 * 8); g.lineTo(sb.x + 66, sb.y - 26 + bw2 * 8); g.stroke(); }
    [[PLUM, 0], [BLUE, 1], [TAPE, 2]].forEach(function (c) { fillRR(g, sb.x + 90 + c[1] * 30, sb.y - 30, 26, 24, 5, c[0]); fillE(g, sb.x + 103 + c[1] * 30, sb.y - 18, 4, 9, K.tone(c[0], 0.2)); });
    /* the dress form with a plum jacket, half pinned, a chalk line on the hem */
    bust(g, DF.x, 286, 1.15, PLUM); pin(g, DF.x - 20, 318, PIN); pin(g, DF.x + 18, 336, TAPE); pin(g, DF.x - 8, 360, BLUE);
    g.setLineDash([4, 4]); g.strokeStyle = '#FFFFFF'; g.lineWidth = 2; g.beginPath(); g.moveTo(DF.x - 40, 386); g.lineTo(DF.x + 40, 386); g.stroke(); g.setLineDash([]);
  }
  function armchair(g) { /* the velvet armchair (drawn behind the client sitting in it) */
    var x = ARM.x, y = ARM.y; soft(g, x, y + 3, 80, 8, 0.24);
    fillRR(g, x - 62, 466, 124, 92, 30, PLUM_D); fillRR(g, x - 54, 474, 108, 76, 24, PLUM); for (var b = 0; b < 3; b++) fillE(g, x - 30 + b * 30, 508, 3, 3, 'rgba(255,255,255,.25)');
    fillRR(g, x - 58, 544, 116, 22, 10, PLUM); fillRR(g, x - 76, 520, 26, 50, 12, PLUM_D); fillRR(g, x + 50, 520, 26, 50, 12, PLUM_D);
    g.fillStyle = BRASS_D; g.fillRect(x - 64, 566, 5, y - 566); g.fillRect(x + 59, 566, 5, y - 566); fillE(g, x - 62, y, 4, 2, BRASS); fillE(g, x + 62, y, 4, 2, BRASS);
  }
  function paintFront(g, e) {
    /* the fitting corner's side table: a teacup on a saucer, a swatch book */
    var st = { x: -226, y: 548 }; soft(g, st.x, 602, 28, 5, 0.22); g.fillStyle = WAL_D; g.fillRect(st.x - 2, st.y, 4, 600 - st.y); g.fillRect(st.x - 16, 596, 32, 4); fillE(g, st.x, st.y, 30, 6, WAL);
    fillE(g, st.x - 10, st.y - 4, 10, 2.6, '#FFFFFF'); fillRR(g, st.x - 17, st.y - 16, 14, 12, 4, '#FFFFFF'); fillRR(g, st.x - 17, st.y - 12, 14, 2, 1, PLUM); g.strokeStyle = '#FFFFFF'; g.lineWidth = 2; g.beginPath(); g.arc(st.x - 2, st.y - 11, 3, -1.4, 1.4); g.stroke();
    fillRR(g, st.x + 4, st.y - 9, 22, 7, 2, MINT); fillRR(g, st.x + 6, st.y - 14, 20, 5, 2, PINK);
    /* the cutting table: walnut top, brass legs (open, so the drafter's chair and legs show), the pattern hanging over the edge */
    var d = TABLE; soft(g, d.x + d.w / 2, F + 4, d.w * 0.6, 9, 0.22);
    [d.x + 8, d.x + d.w - 16].forEach(function (lx) { fillRR(g, lx, d.y + 8, 8, F - d.y - 8, 3, BRASS_D); fillRR(g, lx - 10, F - 6, 28, 6, 3, BRASS_D); });
    g.fillStyle = 'rgba(110,70,40,.2)'; g.fillRect(d.x + 16, d.y + 22, d.w - 32, 5);
    fillRR(g, d.x - 6, d.y, d.w + 12, 12, 4, WAL); g.fillStyle = 'rgba(255,255,255,.22)'; g.fillRect(d.x - 4, d.y + 2, d.w + 8, 2);
    g.save(); g.translate(d.x + 116, d.y + 2); g.rotate(0.03); fillRR(g, 0, 0, 132, 46, 3, '#FFF6E4'); g.strokeStyle = 'rgba(201,162,74,.35)'; g.lineWidth = 0.8; g.beginPath(); for (var gx = 8; gx < 132; gx += 10) { g.moveTo(gx, 2); g.lineTo(gx, 44); } g.stroke();
    g.setLineDash([3, 3]); g.strokeStyle = PLUM; g.lineWidth = 1.4; g.beginPath(); g.moveTo(10, 12); g.quadraticCurveTo(60, 4, 122, 14); g.lineTo(116, 38); g.quadraticCurveTo(64, 44, 14, 36); g.closePath(); g.stroke(); g.setLineDash([]);
    text(g, 'sale_order · pattern', 66, 28, 6.4, 800, PLUM, 'center'); g.restore();
    fillRR(g, d.x + 12, d.y - 3, 90, 4, 2, TAPE); g.fillStyle = INK; for (var tk = 0; tk < 18; tk++) g.fillRect(d.x + 14 + tk * 5, d.y - 3, 0.8, tk % 2 ? 1.6 : 2.6);
    fillRR(g, d.x + 214, d.y - 5, 14, 5, 2, '#FFFFFF'); fillRR(g, d.x + 232, d.y - 5, 10, 5, 2, '#9FC4FF');
    /* the laptop beside the drafter (its screen is drawn live) */
    fillRR(g, LAP.x - 8, LAP.y + LAP.h + 2, LAP.w + 16, 6, 3, '#9AA6BC'); fillRR(g, LAP.x - 4, LAP.y - 4, LAP.w + 8, LAP.h + 6, 5, '#2A3142');
    /* the boxed module (its lid is drawn live) */
    var b = BOX; soft(g, b.x + b.w / 2, b.y + b.h, b.w * 0.6, 4, 0.25); fillRR(g, b.x, b.y + 8, b.w, b.h - 8, 3, '#E9DCC4'); g.fillStyle = PLUM; g.fillRect(b.x + b.w / 2 - 3, b.y + 8, 6, b.h - 8);
    fillRR(g, b.x + 4, b.y + 22, 28, 12, 2, '#FFFFFF'); text(g, 'custom_', b.x + 18, b.y + 27.5, 4.6, 800, PLUM, 'center'); text(g, 'approvals', b.x + 18, b.y + 32.4, 4.6, 800, PLUM, 'center');
    /* the podium's front band, over the client's shoes' shadow but under their feet */
    g.save(); g.beginPath(); g.ellipse(POD.x, POD.y, POD.rx, POD.ry, 0, 0, Math.PI); g.lineTo(POD.x - POD.rx, POD.y + 22); g.ellipse(POD.x, POD.y + 22, POD.rx, POD.ry, 0, Math.PI, 0, true); g.closePath();
    g.fillStyle = '#7A5538'; g.fill(); g.restore(); g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(POD.x - POD.rx + 10, POD.y + 12, 30, 14); g.fillStyle = BRASS; g.fillRect(POD.x - POD.rx, POD.y + 26, POD.rx * 2, 2);
    /* the sewing table and the machine (its needle, wheel and spool move live) */
    var s = SEW; soft(g, s.x + s.w / 2, F + 4, s.w * 0.6, 8, 0.22);
    [s.x + 6, s.x + s.w - 14].forEach(function (lx) { fillRR(g, lx, s.y + 8, 8, F - s.y - 8, 3, '#5C6B7A'); });
    fillRR(g, s.x - 4, s.y, s.w + 8, 12, 4, '#E9DCC4'); g.fillStyle = 'rgba(110,70,40,.18)'; g.fillRect(s.x - 2, s.y + 10, s.w + 4, 2);
    g.fillStyle = '#F4F1EA'; fillRR(g, 918, 380, 80, 12, 3, '#F4F1EA'); fillRR(g, 972, 318, 22, 64, 6, '#F4F1EA'); fillRR(g, 926, 316, 70, 22, 8, '#F4F1EA'); fillRR(g, 926, 330, 20, 30, 4, '#F4F1EA');
    fillRR(g, 940, 322, 30, 8, 3, PLUM); g.fillStyle = 'rgba(30,40,70,.1)'; g.fillRect(918, 388, 80, 4); fillRR(g, 958, 310, 4, 8, 1, '#8A94A8');
  }
  function paintFore(g, e) { /* the foreground: a basket of fabric scraps, a stool with a pin cushion, a potted fig */
    var bx = 120, by = 708; soft(g, bx, by + 4, 70, 9, 0.25); fillRR(g, bx - 54, by - 44, 108, 46, 12, '#C98E55'); g.strokeStyle = 'rgba(110,60,20,.35)'; g.lineWidth = 2; for (var w = 0; w < 4; w++) { g.beginPath(); g.moveTo(bx - 50, by - 36 + w * 10); g.lineTo(bx + 50, by - 36 + w * 10); g.stroke(); }
    [['#714B67', -30], ['#3167CA', -6], ['#F2C94C', 18], ['#2E9C7E', 36]].forEach(function (f, i) { g.save(); g.translate(bx + f[1], by - 46); g.rotate(-0.4 + i * 0.3); fillRR(g, -14, -14, 28, 22, 4, f[0]); g.restore(); });
    var sx2 = 1090, sy2 = 640; soft(g, sx2, sy2 + 4, 60, 8, 0.25); g.strokeStyle = WAL_D; g.lineWidth = 6; g.beginPath(); g.moveTo(sx2 - 30, sy2); g.lineTo(sx2 - 20, sy2 - 70); g.moveTo(sx2 + 30, sy2); g.lineTo(sx2 + 20, sy2 - 70); g.stroke();
    fillE(g, sx2, sy2 - 74, 44, 10, WAL); fillE(g, sx2, sy2 - 86, 22, 16, PIN); for (var p = 0; p < 7; p++) pin(g, sx2 - 16 + p * 5, sy2 - 96 + (p % 2) * 6, ['#FFFFFF', TAPE, BLUE, '#2E9C7E'][p % 4]);
    K.plant(g, { x: -620, y: 720 }, '#E9DCC4', '#F2E8D6');
    var fb = 300, fby = 700; soft(g, fb, fby + 4, 80, 9, 0.22); [['#3167CA', 0], ['#E9A23B', 1], ['#714B67', 2]].forEach(function (c) { bolt(g, fb - 60 + c[1] * 8, fby - 26 - c[1] * 26, 112, c[0]); });
    var ky = 690; soft(g, 980, ky + 4, 60, 8, 0.22); fillRR(g, 940, ky - 40, 80, 40, 8, '#E9DCC4'); fillRR(g, 940, ky - 40, 80, 8, 4, '#DCCBAE'); g.fillStyle = PLUM; g.fillRect(976, ky - 40, 8, 40);
    for (var ks = 0; ks < 4; ks++) { fillRR(g, 948 + ks * 17, ky - 58, 12, 18, 3, ['#E0456B', '#2E9C7E', '#3167CA', '#F2C94C'][ks]); }
  }

  /* ------------------------------ the cast ------------------------------ */
  var W = CR.who;
  var DV1 = W({ x: 545, y: 470, s: 0.5, ph: 0.6, skin: 1, hair: 0, style: 'long', clip: '#F2C94C', outfit: 'shirt', top: BLUE, sit: true, chairCol: '#5A3E2B', hands: [[-60, -206], [60, -206]] });
  var DV2 = W({ x: 872, y: 470, s: 0.5, ph: 1.8, skin: 0, hair: 1, style: 'bun', outfit: 'polo', top: MINT, glasses: true, sit: true, chairCol: '#5A3E2B', hands: [[-40, -206], [100, -206]] });
  var CLI = W({ x: POD.x, y: POD.y, s: 0.52, ph: 2.2, skin: 2, hair: 2, style: 'bob', outfit: 'blazer', top: PLUM, low: '#3A3F5C', shoe: '#2A2230', id: '#9AA6BC', hands: [[-70, -150], [70, -150]], look: 0.4 });
  CLI.c.shirt = '#FFFFFF'; CLI.c.pocket = TAPE;
  var TAI = W({ x: 774, y: 470, s: 0.56, ph: 2.9, skin: 3, hair: 0, style: 'short', outfit: 'cardigan', top: '#5A6B8C', top2: '#FFFFFF', glasses: true, hands: [[-70, -200], [70, -170]], look: -0.6 });
  var FC = W({ x: -60, y: 470, s: 0.54, ph: 4.3, skin: 1, hair: 1, style: 'pony', outfit: 'cardigan', top: MINT, top2: '#FFFFFF', hands: [[-80, -230], [40, -180]], look: -0.8 });
  var AC = W({ x: ARM.x, y: ARM.y, s: 0.56, ph: 5.4, skin: 0, hair: 0, style: 'short', outfit: 'shirt', top: '#3167CA', low: '#3A3F5C', glasses: true, sit: true, chair: false, id: '#9AA6BC', hands: [[-34, -262], [34, -262]], look: 0.3 });
  var CREW = [
    { x0: 1010, x1: 1300, y: 488, spd: 14, ph: 0.3, label: 'TechNext consultant', lines: ['Can **configuration** do it? Then no code at all.', 'Studio first, module last. That is the house rule.', 'This one is boxed and ready: **custom_approvals**.'], acts: ['nod', 'id', 'wave'],
      P: W({ s: 0.5, skin: 2, hair: 1, style: 'pony', outfit: 'polo', top: PINK, hold: 'box' }) },
    { front: true, x0: -930, x1: 70, y: 700, spd: 18, ph: 0.6, label: 'TechNext developer', lines: ['Written so **another developer** can maintain it.', 'Tested against the **next version** before it ships.', 'More fabric for the **standard** rack!'], acts: ['cheer', 'id', 'wave'],
      P: W({ s: 0.58, skin: 0, hair: 0, style: 'short', outfit: 'shirt', top: PLUM, hold: 'mat', hands: [[-60, -212], [70, -150]] }) }
  ];

  /* the head tailor's loop (10 s), shared with the client so they move together: measure the arm, note it, pin it, rest */
  function tailorPhase(t) { var c = (t + 2) % 10; return c < 4.5 ? 'measure' : c < 7 ? 'note' : c < 8.6 ? 'pin' : 'rest'; }
  var FX = { box: -9, boxPop: -9, bell: -9 };
  function actDv1(P, t, S) { /* the pattern drafter: chalks the pattern, then types it up on the laptop; tap: rolls back and holds the pattern up */
    var st = S.cast.dv1, busy = S.hot === 'code', u = tapU(st, t, 2.6), c = (t + 0.8) % 9, typing = busy || c > 5;
    P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm'; P.tilt = 0; P.sx = 1; P.hop = 0; P.x = 545;
    if (typing) { var k2 = Math.abs(Math.sin(t * (busy ? 14 : 9))) * 6; P.hands = [[-150, -206 - k2], [-90, -206 - (6 - k2)]]; looks(P, st, t, S, -0.85); }
    else { var a = t * 2.2; P.hands = [[-40, -204], [30 + Math.cos(a) * 26, -202 + Math.sin(a * 2) * 4]]; looks(P, st, t, S, 0.15); P.tilt = 0.04; }
    if (u >= 0) { var roll = u < 0.2 ? ease(u / 0.2) : u > 0.82 ? 1 - ease((u - 0.82) / 0.18) : 1; P.x = 545 + roll * 22; P.mood = u < 0.25 ? 'wow' : 'happy'; P.talk = true;
      if (!st._b) { st._b = 1; CR.burst('code', P.x, P.y - 290, t); }
      var up = u < 0.2 ? ease(u / 0.2) : u > 0.82 ? 1 - ease((u - 0.82) / 0.18) : 1; P.hands = [[lerp(-60, -86, up), lerp(-206, -440 + Math.sin(t * 8) * 4, up)], [lerp(60, 86, up), lerp(-206, -440 - Math.sin(t * 8) * 4, up)]]; P.look = 0; }
    else st._b = 0;
  }
  function actDv2(P, t, S) { /* the sewing developer: feeds the fabric under the needle, snips the thread now and then; tap: spins and shows the finished sleeve */
    var st = S.cast.dv2, busy = S.hot === 'module', u = tapU(st, t, 2.4), c = (t + 3) % 8;
    P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm'; P.tilt = 0; P.sx = 1; P.hop = 0;
    var feed = (t * (busy ? 1.6 : 0.9)) % 1;
    if (c < 6.6) { P.hands = [[-30 + feed * 30, -204], [96 + feed * 14, -206 - Math.abs(Math.sin(t * 9)) * 2]]; looks(P, st, t, S, 0.7); }
    else { var sn = (c - 6.6) / 1.4; P.hands = [[-30, -204], [104, -250 - Math.sin(sn * Math.PI) * 40]]; looks(P, st, t, S, 0.9); P.tilt = -0.05; }
    if (u >= 0) { P.mood = 'happy'; P.talk = true; P.sx = u > 0.25 && u < 0.75 ? Math.cos((u - 0.25) / 0.5 * Math.PI * 2) : 1; P.hop = Math.sin(u * Math.PI) * 10;
      var up = ease(Math.min(1, u / 0.2)) * (u > 0.85 ? 1 - ease((u - 0.85) / 0.15) : 1); P.hands = [[lerp(-30, -110, up), lerp(-204, -300, up)], [lerp(96, 90, up), lerp(-206, -430, up)]];
      if (!st._b) { st._b = 1; CR.burst('star', P.x, P.y - 300, t); } } else st._b = 0;
  }
  function actTai(P, t, S) { /* the head tailor: measures the client's arm, notes it, pins the sleeve; tap: whips the tape out and pins */
    var st = S.cast.tai, busy = S.hot === 'fit' || S.hot === 'upgrade', u = tapU(st, t, 2.2), ph = tailorPhase(t);
    P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm'; P.tilt = 0; P.sx = 1; P.hop = 0;
    var cw = hw(CLI, 1), csh = [CLI.x + 76 * CLI.s, CLI.y - 258 * CLI.s];
    function loc(p) { return [(p[0] - P.x) / P.s, (p[1] - P.y) / P.s]; }
    if (ph === 'measure') { var a = loc([csh[0] + 4, csh[1] + 8]), b = loc([cw[0] + 2, cw[1]]); P.hands = [a, b]; P.look = lerp(P.look, -0.7, 0.1); P.tilt = -0.06; }
    else if (ph === 'note') { P.hands = [[-34, -236], [24 + Math.sin(t * 14) * 5, -232 + Math.cos(t * 9) * 3]]; P.look = lerp(P.look, 0.1, 0.1); P.tilt = 0.05; }
    else if (ph === 'pin') { var pp = loc([csh[0] + 6, csh[1] + 30]); P.hands = [[-70, -200], [pp[0], pp[1] + Math.sin(t * 10) * 3]]; P.look = lerp(P.look, -0.8, 0.1); }
    else { P.hands = [[-70, -200], [70, -170]]; looks(P, st, t, S, -0.4); }
    if (busy && ph !== 'measure') { P.hands = [[-70, -200], [-130, -330 + Math.sin(t * 3) * 8]]; }
    if (u >= 0) { P.talk = true; P.mood = u < 0.3 ? 'wow' : 'happy'; P.hands = [[-70, -200], [lerp(70, 120, ease(u / 0.2)), lerp(-170, -420, ease(u / 0.2))]]; P.hop = Math.sin(u * Math.PI) * 8;
      if (!st._b) { st._b = 1; CR.burst('spark', P.x + 40, P.y - 360, t); } } else st._b = 0;
  }
  function actCli(P, t, S) { /* the client on the podium: holds the arm out while measured, turns to admire the fit; tap: a twirl and a thumbs-up */
    var st = S.cast.cli, u = tapU(st, t, 2.0), ph = tailorPhase(t);
    P.talk = t < st.until; P.mood = P.talk ? 'happy' : 'calm'; P.tilt = 0; P.hop = 0; P.sx = 1;
    if (ph === 'measure' || ph === 'pin') { P.hands = [[-70, -150], [150, -252]]; P.look = lerp(P.look, 0.6, 0.1); P.mood = 'happy'; }
    else if (ph === 'note') { var adj = Math.sin(t * 6) * 4; P.hands = [[46 + adj, -170], [70, -150]]; P.look = lerp(P.look, 0.2, 0.1); P.tilt = 0.04; }
    else { P.sx = 0.92 + Math.cos(t * 1.4) * 0.08; P.hands = [[-66, -170], [66, -170]]; looks(P, st, t, S, -0.4); P.mood = 'happy'; }
    if (u >= 0) { P.talk = true; P.mood = 'happy'; P.sx = u < 0.6 ? Math.cos(u / 0.6 * Math.PI * 2) : 1; P.hop = Math.sin(Math.min(1, u / 0.6) * Math.PI) * 18;
      P.hands = u < 0.6 ? [[-140, -300], [140, -300]] : [[-70, -150], [96, -400]];
      if (!st._b) { st._b = 1; CR.burst('conf', P.x, P.y - 280, t); } } else st._b = 0;
  }

  function actFc(P, t, S) { /* the fitter: pins the jacket on the dress form, steps back to look, chalks the hem; tap: drapes the tape, claps, the jacket gets its "fits" tag */
    var st = S.cast.fc, u = tapU(st, t, 2.2); P.talk = t < st.until; P.mood = P.talk ? 'happy' : 'calm'; P.tilt = 0; P.hop = 0; P.sx = 1; P.x = -60;
    if (u >= 0) { P.talk = true; P.mood = 'happy'; if (!st._b) { st._b = 1; DONE.t = t + 0.5; CR.burst('star', DF.x + 20, 300, t); }
      if (u < 0.4) { P.hands = [[-50, -390], [50, -390]]; P.look = 0; P.hop = Math.sin(u / 0.4 * Math.PI) * 10; } else { var cl = Math.abs(Math.sin(t * 16)); P.hands = [[-14 - cl * 20, -290], [14 + cl * 20, -290]]; P.look = -0.5; }
      return; } st._b = 0;
    var c = (t + 1) % 12;
    if (c < 5) { var j = Math.sin(t * 5) * 6; P.hands = [[-100 + j, -280 + j], [-40, -200]]; P.look = lerp(P.look, -0.9, 0.1); P.tilt = -0.05; }
    else if (c < 8) { var b = clamp(Math.min((c - 5) / 0.5, (8 - c) / 0.5), 0, 1); P.x = -60 + b * 22; P.hands = [[-40, -240], [36, -270]]; P.look = lerp(P.look, -0.6, 0.08); P.tilt = 0.06 * b; P.mood = 'happy'; }
    else if (c < 10.5) { P.hands = [[-110, -170 + Math.sin(t * 3) * 18], [40, -190]]; P.look = lerp(P.look, -0.9, 0.1); P.tilt = -0.1; }
    else { P.hands = [[-70, -180], [70, -180]]; looks(P, st, t, S, 0.4); }
  }
  function actAc(P, t, S) { /* the client in the armchair: leafs through the lookbook, sips tea, gazes at the rack; tap: holds the page up to you, thumbs up */
    var st = S.cast.ac, u = tapU(st, t, 2.2); P.talk = t < st.until; P.mood = P.talk ? 'happy' : 'calm'; P.tilt = 0; P.hop = 0; P.sx = 1; BOOK.open = 1; BOOK.show = 0;
    if (u >= 0) { P.talk = true; P.mood = 'happy'; BOOK.show = 1; var a = ease(Math.min(1, u / 0.25)); P.hands = [[lerp(-34, -50, a), lerp(-262, -360, a)], [lerp(34, 50, a), lerp(-262, -360, a)]]; P.look = 0; P.hop = u > 0.3 ? Math.abs(Math.sin(t * 9)) * 5 : 0;
      if (!st._b) { st._b = 1; CR.burst('heart', P.x, P.y - 250, t); } return; } st._b = 0;
    var c = (t + 6) % 13;
    if (c < 6) { var flip = (c % 2.4) < 0.3; P.hands = [[-34, -262], [flip ? -4 : 34, flip ? -270 : -262]]; P.look = lerp(P.look, 0.15, 0.1); P.tilt = 0.06; }
    else if (c < 8.5) { var r = clamp(Math.min((c - 6) / 0.4, (8.5 - c) / 0.4), 0, 1); BOOK.open = 1 - r; P.hands = [[-34, -250], [34, -250]]; P.look = lerp(P.look, 0.2, 0.1); P.tilt = -0.05 * r; }
    else { BOOK.open = 0.4; P.hands = [[-30, -244], [36, -248]]; P.look = lerp(P.look, 0.85, 0.06); P.mood = 'happy'; }
  }

  /* ------------------------------ the live layers ------------------------------ */
  function level(S, t) { var keys = LAYERS.map(function (L) { return L.key; }); if (S.hot === 'standard') return 0; if (S.hot === 'fit') return 2; if (S.hot === 'module') return 3; if (keys.indexOf(S.hot) >= 0) return keys.indexOf(S.hot); return Math.floor((t * 0.32) % 5) - 1; }
  function rowY(i) { return BOARD.y + BOARD.h - 60 - i * 50; }
  function paintLive(g, t, now, S) {
    CO.crew(CREW, g, t, S, false);
    /* the garment bags sway on their hooks; on the editions stop they light in turn */
    var ei = S.hot === 'editions' ? Math.floor(t * 1.3) % 3 : -1;
    [['Odoo Online', 'Odoo\'s cloud', '#3167CA', '#E3ECFB'], ['Odoo.sh', 'custom code ok', PLUM, '#F1E6EE'], ['On-premise', 'your servers', INK, '#E3E6EE']].forEach(function (b, i) {
      var cx = BAGS.x + 28 + i * 56, rot = Math.sin(t * 0.9 + i * 1.7) * 0.025; g.save(); g.translate(cx, BAGS.y); g.rotate(rot);
      g.strokeStyle = '#8A94A8'; g.lineWidth = 2; g.beginPath(); g.arc(0, 4, 4, Math.PI, 0); g.lineTo(4, 10); g.stroke();
      g.fillStyle = b[3]; g.beginPath(); g.moveTo(-14, 12); g.lineTo(14, 12); g.lineTo(26, 30); g.lineTo(26, 152); g.quadraticCurveTo(0, 160, -26, 152); g.lineTo(-26, 30); g.closePath(); g.fill();
      g.strokeStyle = ei === i ? b[2] : 'rgba(30,40,70,.12)'; g.lineWidth = ei === i ? 3 : 1.4; g.stroke();
      g.setLineDash([2, 3]); g.strokeStyle = 'rgba(30,40,70,.25)'; g.lineWidth = 1; g.beginPath(); g.moveTo(0, 20); g.lineTo(0, 92); g.stroke(); g.setLineDash([]);
      fillRR(g, -18, 32, 36, 36, 8, '#FFFFFF'); var iy = 50; g.fillStyle = b[2];
      if (i === 0) { g.beginPath(); g.arc(-6, iy + 3, 6, 0, 7); g.arc(2, iy - 2, 8, 0, 7); g.arc(9, iy + 3, 5.5, 0, 7); g.fill(); g.fillRect(-6, iy + 3, 15, 5.5); }
      else if (i === 1) { fillRR(g, -11, iy - 9, 22, 18, 5, b[2]); text(g, '.sh', 0, iy + 3.5, 7.5, 800, '#FFFFFF', 'center'); }
      else { for (var sv = 0; sv < 3; sv++) { fillRR(g, -11, iy - 10 + sv * 7, 22, 5.5, 1.5, b[2]); fillE(g, 7, iy - 7.3 + sv * 7, 1.2, 1.2, '#2BC48A'); } }
      fillRR(g, -24, 100, 48, 40, 6, '#FFFFFF'); text(g, b[0], 0, 117, b[0].length > 8 ? 7.6 : 8.6, 800, INK, 'center'); text(g, b[1], 0, 130, 6.2, 700, '#7A869C', 'center');
      g.restore(); });
    /* the ready-to-wear jackets sway a little on the rail */
    RACKC.forEach(function (c, i) { jacket(g, RACK.x + 24 + i * 28, RACK.y + 2, c, 0.92, Math.sin(t * 1.1 + i * 1.3) * 0.03 + (S.hot === 'standard' ? Math.sin(t * 4 + i) * 0.04 : 0)); });
    if (S.hot === 'standard') { fillRR(g, RACK.x + 6, RACK.y + 128, RACK.w - 12, 22, 11, MINT); text(g, 'one database · apps on as needed', RACK.x + RACK.w / 2, RACK.y + 142, 6.6, 800, '#FFFFFF', 'center'); }
    /* the hanging tape measure sways under its hook */
    var sw = Math.sin(t * 1.2) * 4; g.strokeStyle = TAPE; g.lineWidth = 9; g.lineCap = 'butt'; g.beginPath(); g.moveTo(405, -62); g.quadraticCurveTo(405 + sw, 30, 405 + sw * 1.6, 112); g.stroke();
    g.strokeStyle = INK; g.lineWidth = 1; g.beginPath(); for (var ty = -56; ty < 108; ty += 7) { var tx = 405 + sw * Math.pow((ty + 62) / 174, 1.6) * 1.6; g.moveTo(tx - 4.5, ty); g.lineTo(tx - (ty % 14 === 0 ? 0 : 2), ty); } g.stroke();
    fillRR(g, 399 + sw * 1.6, 110, 12, 8, 2, BRASS_D);
    /* the alteration order: rows light to the level the process needs, the tape marker climbs only as far as it must */
    var lvl = level(S, t);
    LAYERS.forEach(function (L, i) { var y = rowY(i), x = BOARD.x + 26, w = BOARD.w - 38, on = i <= lvl, top = i === lvl;
      fillRR(g, x, y, w, 42, 8, on ? L.col : '#F3EDE2'); g.setLineDash([3, 3]); g.strokeStyle = on ? 'rgba(255,255,255,.6)' : 'rgba(150,110,60,.25)'; g.lineWidth = 1; rr(g, x + 3, y + 3, w - 6, 36, 6); g.stroke(); g.setLineDash([]);
      fillE(g, x + 17, y + 21, 10, 10, on ? 'rgba(255,255,255,.95)' : '#FFFFFF'); text(g, String(i + 1), x + 17, y + 25, 9, 800, on ? L.col : '#B0A48C', 'center');
      text(g, L.name, x + 32, y + 19, 9.4, 800, on ? '#FFFFFF' : '#A89A80'); text(g, L.sub, x + 32, y + 31, 6.2, 700, on ? 'rgba(255,255,255,.88)' : '#C2B69C');
      if (top && lvl >= 0) { fillE(g, x + w - 4, y + 4, 4, 4, '#FFFFFF'); } });
    var my = lvl >= 0 ? rowY(lvl) + 21 : BOARD.y + BOARD.h - 14, mx = BOARD.x + 12;
    g.fillStyle = TAPE; g.fillRect(mx - 4, my, 8, BOARD.y + BOARD.h - 8 - my); g.fillStyle = INK; for (var mt = BOARD.y + BOARD.h - 10; mt > my; mt -= 6) g.fillRect(mx - 4, mt, 3, 0.8);
    fillE(g, mx, my, 6, 6, PIN); fillE(g, mx - 1.6, my - 1.8, 1.8, 1.8, 'rgba(255,255,255,.7)');
    /* the next-season mirror: the module rides from this version to the next, and the fit is ticked */
    var up = S.hot === 'upgrade', f = up ? ((t - (S.kT || 0)) * 0.45) % 1.5 : (t * 0.16) % 1.5, p = ease(clamp(f, 0, 1));
    var ax = MIR.x + 122, bx2 = MIR.x + MIR.w - 122, qx = lerp(lerp(ax, MIR.x + MIR.w / 2, p), lerp(MIR.x + MIR.w / 2, bx2, p), p), qy = lerp(lerp(MIR.y + 82, MIR.y + 40, p), lerp(MIR.y + 40, MIR.y + 82, p), p);
    fillRR(g, qx - 28, qy - 10, 56, 20, 10, PLUM); text(g, 'your module', qx, qy + 3, 6.6, 800, '#FFFFFF', 'center');
    if (f >= 1) { var pop = Math.min(1, (f - 1) * 6); tick(g, MIR.x + MIR.w - 86 + 26, MIR.y + 70, 9 * pop); fillRR(g, MIR.x + MIR.w / 2 - 50, MIR.y + MIR.h - 30, 100, 20, 10, '#E3F6EC'); text(g, 'Still fits · upgrade-safe', MIR.x + MIR.w / 2, MIR.y + MIR.h - 17, 7, 800, '#1E9E6A', 'center'); }
    var sh = ((t * 0.12) % 1.6) * (MIR.w + 120) - 60; g.save(); rr(g, MIR.x, MIR.y, MIR.w, MIR.h, 9); g.clip(); g.fillStyle = 'rgba(255,255,255,.5)'; g.beginPath(); g.moveTo(MIR.x + sh, MIR.y + MIR.h); g.lineTo(MIR.x + sh + 40, MIR.y); g.lineTo(MIR.x + sh + 52, MIR.y); g.lineTo(MIR.x + sh + 12, MIR.y + MIR.h); g.closePath(); g.fill(); g.restore();
    /* the fitting card ticks itself off; the clock keeps Singapore time */
    var fc = (t * 0.5) % 6; for (var i = 0; i < 4; i++) if (fc > i + 0.6) tick(g, CARD.x + 16, CARD.y + 38 + i * 22, 6);
    CO.clock(g, CLK.x, CLK.y, CLK.r, 8, BRASS);
    /* the spools on the wall: one spins while the machine runs, its thread runs down to the machine */
    var cols = ['#714B67', '#3167CA', '#E0456B', '#2E9C7E', '#E9A23B', '#5A6B8C', '#F2C94C', '#C98E55', '#9AA6BC', '#1B1F3B', '#7CC2E8', '#FF8FA3'];
    for (var r2 = 0; r2 < 3; r2++) for (var c2 = 0; c2 < 4; c2++) { var x2 = PEG.x + 20 + c2 * 30, y2 = PEG.y + 26 + r2 * 46, col = cols[r2 * 4 + c2], spin = r2 === 2 && c2 === 3;
      fillRR(g, x2 - 9, y2 - 2, 18, 4, 1.5, '#C9A27A'); fillRR(g, x2 - 9, y2 + 26, 18, 4, 1.5, '#C9A27A'); fillRR(g, x2 - 7, y2 + 2, 14, 24, 3, col);
      g.fillStyle = 'rgba(255,255,255,.28)'; var off = spin ? (t * 30) % 6 : 0; for (var ln = 0; ln < 4; ln++) g.fillRect(x2 - 7, y2 + 4 + ((ln * 6 + off) % 22), 14, 1.2); }
    g.strokeStyle = 'rgba(46,156,126,.8)'; g.lineWidth = 1; g.beginPath(); g.moveTo(PEG.x + 110, PEG.y + 150); g.quadraticCurveTo(PEG.x + 116, 270, 960, 312); g.stroke();
    /* steam rises from the iron in the left margin */
    steam(g, -694, 356, t, 4);
    armchair(g);
  }
  var BOOK = { open: 0, show: 0 }, DONE = { t: -99 };
  function paintFrontLive(g, t, S) {
    CO.crew(CREW, g, t, S, true);
    /* tea steam; the client's lookbook; the jacket's "fits" tag after the fitter's tap */
    for (var sw = 0; sw < 2; sw++) { var sy = 528 - ((t * 9 + sw * 7) % 14); g.strokeStyle = 'rgba(170,150,130,.45)'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(-238 + sw * 4, sy); g.quadraticCurveTo(-234 + sw * 4, sy - 4, -237 + sw * 4, sy - 8); g.stroke(); }
    var bl = hw(AC, 0), br = hw(AC, 1), bx = (bl[0] + br[0]) / 2, by = (bl[1] + br[1]) / 2 - 6, bwid = 16 + 16 * BOOK.open;
    g.save(); g.translate(bx, by); g.rotate(BOOK.show ? 0 : 0.08); fillRR(g, -bwid, -14, bwid * 2, 26, 2, BOOK.show ? '#FFFFFF' : PLUM); if (BOOK.open > 0.3) { fillRR(g, -bwid + 2, -12, bwid - 3, 22, 1, '#FFF8EA'); fillRR(g, 1, -12, bwid - 3, 22, 1, '#FFF8EA');
      g.fillStyle = PLUM; g.beginPath(); g.moveTo(-bwid * 0.6, -8); g.lineTo(-bwid * 0.3, -9); g.lineTo(-bwid * 0.25, 8); g.lineTo(-bwid * 0.65, 8); g.closePath(); g.fill(); g.fillStyle = '#C9D3E3'; for (var ll = 0; ll < 3; ll++) g.fillRect(4, -7 + ll * 5, bwid - 10, 1.6); }
    if (BOOK.show) text(g, 'Odoo 20 · tailored', 0, -18, 6.4, 800, PLUM, 'center'); g.restore();
    var du2 = t - DONE.t; if (du2 >= 0 && du2 < 3) { g.save(); g.globalAlpha = du2 > 2.5 ? (3 - du2) / 0.5 : 1; g.translate(DF.x + 30, 330 - Math.min(1, du2 / 0.2) * 6); g.rotate(0.12); fillRR(g, -2, -11, 46, 20, 4, '#FFFFFF'); g.strokeStyle = MINT; g.lineWidth = 1.6; rr(g, -2, -11, 46, 20, 4); g.stroke(); tick(g, 8, -1, 5.5); text(g, 'fits', 28, 3, 8, 800, MINT, 'center'); g.restore(); }
    /* the drafter's laptop: the custom_approvals module, typed in line by line */
    var fast = S.hot === 'code', n = Math.floor((t * (fast ? 4 : 1.3)) % 10), L = LAP;
    fillRR(g, L.x, L.y, L.w, L.h, 3, '#FFFFFF'); fillRR(g, L.x, L.y, L.w, 10, 3, '#F3EDE2'); text(g, 'custom_approvals / sale_order.py', L.x + 4, L.y + 7.4, 4.6, 800, '#8A6A45');
    g.font = '700 4.5px ui-monospace, Consolas, monospace'; g.textAlign = 'left';
    CODE.forEach(function (ln, i) { if (i > n) return; var y = L.y + 17 + i * 7.2, x = L.x + 4; g.fillStyle = PLUM; g.fillText(ln[0], x, y); x += g.measureText(ln[0]).width; g.fillStyle = BLUE; g.fillText(ln[1], x, y); x += g.measureText(ln[1]).width; g.fillStyle = '#3D4560'; g.fillText(ln[2], x, y); });
    if (n >= 7) { fillRR(g, L.x + L.w - 44, L.y + L.h - 11, 40, 8, 4, '#DDF5EA'); text(g, 'tests pass', L.x + L.w - 24, L.y + L.h - 5, 4.6, 800, '#1E9E6A', 'center'); }
    /* the sewing machine: the needle bobs, the hand wheel turns, the fabric feeds under the foot */
    var run = S.hot === 'module' ? 2 : ((t + 3) % 8) < 6.6 ? 1 : 0, nb = run ? Math.abs(Math.sin(t * (run === 2 ? 26 : 16))) * 6 : 0;
    fillRR(g, 934, 358 + nb, 2, 14, 1, '#8A94A8'); fillRR(g, 929, 370, 12, 3, 1, '#5C6B7A');
    var fo = run ? (t * (run === 2 ? 14 : 8)) % 20 : 0; fillRR(g, 900, 374, 56, 7, 2, PLUM); g.setLineDash([2, 2]); g.strokeStyle = '#F2E3B3'; g.lineWidth = 0.9; g.beginPath(); g.moveTo(900 + fo, 377.5); g.lineTo(956, 377.5); g.stroke(); g.setLineDash([]);
    var wa = t * (run ? 9 : 0); g.save(); g.translate(998, 336); fillE(g, 0, 0, 10, 10, '#C9CFDA'); g.strokeStyle = '#8A94A8'; g.lineWidth = 1.6; for (var sp = 0; sp < 3; sp++) { var an = wa + sp * 2.1; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(an) * 8, Math.sin(an) * 8); g.stroke(); } fillE(g, 0, 0, 2.4, 2.4, '#5C6B7A'); g.restore();
    fillRR(g, 954, 300, 12, 12, 2, PINK); g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(954, 302 + ((t * (run ? 20 : 0)) % 8), 12, 1.4);
    /* the boxed module: the lid lifts and the module pops out when tapped, or on the module stop */
    var b = BOX, op = S.hot === 'module' ? 1 : clamp((2.6 - (t - FX.box)) * 2.2, 0, 1);
    g.save(); g.translate(b.x - 2, b.y + 8); g.rotate(-0.55 * op); fillRR(g, 0, -10 - op * 6, b.w + 4, 12, 3, '#DCCBAE'); g.fillStyle = PLUM; g.fillRect(b.w / 2 - 1, -10 - op * 6, 6, 12); g.restore();
    if (op > 0.05) { g.save(); g.globalAlpha = op; var py = b.y - 4 - op * 30; fillRR(g, b.x - 6, py - 14, 58, 26, 7, PLUM); text(g, 'module', b.x + 23, py + 3, 8, 800, '#FFFFFF', 'center'); tick(g, b.x + 50, py - 12, 6); g.restore(); }
    /* the people's props: the client's chalk marks and pins, the tailor's tape, notebook and pin cushion, the drafter's pattern, the sleeve */
    var cs = CLI.s, cx = CLI.x, cy = CLI.y - (CLI.hop || 0) * cs, sxk = CLI.sx == null ? 1 : CLI.sx;
    g.save(); g.setLineDash([3, 3]); g.strokeStyle = 'rgba(255,255,255,.85)'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(cx - 74 * cs * sxk, cy - 132 * cs); g.lineTo(cx + 74 * cs * sxk, cy - 132 * cs); g.stroke(); g.setLineDash([]); g.restore();
    pin(g, cx - 56 * cs * sxk, cy - 262 * cs, TAPE); pin(g, cx + 50 * cs * sxk, cy - 266 * cs, BLUE); pin(g, cx - 64 * cs * sxk, cy - 150 * cs, PIN);
    var T2 = TAI, ph = tailorPhase(t), ts = T2.s, nk = [T2.x, T2.y - (T2.hop || 0) * ts - 300 * ts];
    g.strokeStyle = TAPE; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.moveTo(nk[0] - 30 * ts, nk[1] - 10 * ts); g.quadraticCurveTo(nk[0] - 40 * ts, nk[1] + 60 * ts, nk[0] - 34 * ts, nk[1] + 120 * ts); g.moveTo(nk[0] + 30 * ts, nk[1] - 10 * ts); g.quadraticCurveTo(nk[0] + 40 * ts, nk[1] + 60 * ts, nk[0] + 34 * ts, nk[1] + 112 * ts); g.stroke();
    var h0 = hw(T2, 0), h1 = hw(T2, 1), tu = tapU(S.cast.tai, t, 2.2);
    if (tu >= 0) { /* the tape whips out of the hand in a wave and rolls back in */
      var ext = Math.sin(Math.min(1, tu / 0.7) * Math.PI) * 120; g.strokeStyle = TAPE; g.lineWidth = 5; g.beginPath(); g.moveTo(h1[0], h1[1]);
      for (var q = 1; q <= 14; q++) { var qq = q / 14; g.lineTo(h1[0] + qq * ext * 0.9, h1[1] - qq * ext * 0.3 + Math.sin(qq * 9 - t * 18) * 10 * qq); } g.stroke();
      if (tu > 0.7) pin(g, h1[0] + 2, h1[1] - 6, PIN);
    } else if (ph === 'measure') { g.strokeStyle = TAPE; g.lineWidth = 4; g.beginPath(); g.moveTo(h0[0], h0[1]); g.lineTo(h1[0], h1[1]); g.stroke(); g.fillStyle = INK; for (var mm = 0; mm < 8; mm++) { var mu = mm / 8; g.fillRect(lerp(h0[0], h1[0], mu) - 0.5, lerp(h0[1], h1[1], mu) - 2, 1, 2.4); } }
    else if (ph === 'note') { fillRR(g, h0[0] - 4, h0[1] - 16, 22, 28, 3, '#FFFFFF'); fillRR(g, h0[0] - 4, h0[1] - 16, 22, 5, 2, PLUM); g.fillStyle = '#C9D3E3'; for (var nl = 0; nl < 3; nl++) g.fillRect(h0[0] - 1, h0[1] - 6 + nl * 5, 14, 1.4); g.strokeStyle = INK; g.lineWidth = 1.6; g.beginPath(); g.moveTo(h1[0], h1[1]); g.lineTo(h1[0] - 6, h1[1] + 10); g.stroke(); }
    else if (ph === 'pin') { pin(g, h1[0] - 3, h1[1] - 5, PIN); }
    fillE(g, h0[0], h0[1] + 6, 7, 5, PIN); pin(g, h0[0] - 3, h0[1] + 2, '#FFFFFF'); pin(g, h0[0] + 2, h0[1] + 1, BLUE);
    var du = tapU(S.cast.dv1, t, 2.6); if (du >= 0 && du < 0.95) { var a1 = hw(DV1, 0), a2 = hw(DV1, 1), pw = a2[0] - a1[0] + 20; g.save(); g.translate(a1[0] - 10, a1[1] - 46); fillRR(g, 0, 0, pw, 50, 3, '#FFF6E4'); g.setLineDash([3, 3]); g.strokeStyle = PLUM; g.lineWidth = 1.2; rr(g, 6, 6, pw - 12, 38, 4); g.stroke(); g.setLineDash([]);
      text(g, '_inherit =', pw / 2, 22, 7, 800, PLUM, 'center'); text(g, '"sale.order"', pw / 2, 34, 7, 800, BLUE, 'center'); g.restore(); }
    var su = tapU(S.cast.dv2, t, 2.4); if (su >= 0) { var sh2 = hw(DV2, 1); g.save(); g.translate(sh2[0], sh2[1] - 8); g.rotate(-0.3); fillRR(g, -10, -46, 20, 52, 8, PLUM); fillRR(g, -10, -2, 20, 8, 3, K.tone(PLUM, 0.2)); fillRR(g, 4, -40, 30, 12, 6, '#DDF5EA'); text(g, 'tests pass', 19, -32, 5, 800, '#1E9E6A', 'center'); g.restore(); }
    CR.draw(g, t);
  }

  window.IXW.worlds.custom = {
    pan: [-700, 1260],
    paintBg: paintBg, windowBehind: true, paintFrame: function () {}, paintBack: paintBack, paintFront: paintFront, paintFore: paintFore,
    paintWindow: paintWindow, paintLive: paintLive, paintFrontLive: paintFrontLive,
    paintForeLive: function (g, t, S) { K.zfore(g, t, S, [], function () { CO.crew(CREW, g, t, S, 'fore'); }); CR.draw(g, t); },
    moteCol: 'rgba(201,162,74,.28)',
    glow: {
      standard: function (g) { rr(g, RACK.x - 12, RACK.y - 44, RACK.w + 24, 300, 14); },
      fit: function (g) { rr(g, BOARD.x + 18, rowY(2) - 6, BOARD.w - 22, 104, 12); },
      module: function (g) { rr(g, SEW.x - 8, 296, SEW.w + 14, 104, 12); },
      code: function (g) { rr(g, LAP.x - 10, LAP.y - 10, LAP.w + 20, LAP.h + 22, 10); },
      upgrade: function (g) { rr(g, MIR.x - 14, MIR.y - 14, MIR.w + 28, MIR.h + 28, 16); },
      editions: function (g) { rr(g, BAGS.x - 6, BAGS.y - 20, BAGS.w + 12, 186, 12); },
      box: function (g) { rr(g, BOX.x - 8, BOX.y - 8, BOX.w + 16, BOX.h + 14, 8); }
    },
    backGlow: ['standard', 'fit', 'upgrade', 'editions'],
    calmView: [230, -90, 800, 640],
    cast: [
      { id: 'dv1', behind: true, keys: ['code'], P: DV1, act: actDv1 },
      { id: 'dv2', behind: true, keys: ['module'], P: DV2, act: actDv2 },
      { id: 'cli', behind: true, keys: [], P: CLI, act: actCli },
      { id: 'tai', behind: true, keys: ['fit', 'upgrade', 'standard'], P: TAI, act: actTai },
      { id: 'fc', behind: true, keys: [], P: FC, act: actFc },
      { id: 'ac', behind: true, keys: [], P: AC, act: actAc }
    ],
    toy: function (name, S, t) { if (name === 'box') { FX.box = t; CR.burst('spark', BOX.x + 22, BOX.y - 24, t); } },
    hit: function (x, y, S, t) { return CR.hitWalker(x, y, t); },
    onStop: function (key, S, t) { S.kT = t; }
  };
})(window.IXW && window.IXW.kit, window.CR, window.CO);
