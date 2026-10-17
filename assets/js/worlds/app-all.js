/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: app-all (/odoo/apps) — "Odoo Street": every Odoo app, by category, on one database, told as a bright row of Peranakan
   shophouses on a sunny morning. Eight shops on two floors, one per category, show the real Odoo app icons in their windows (the
   focus categories, Finance, Sales and Supply Chain, wear a TechNext rosette). Under the five-foot way, the ONE DATABASE vault
   feeds every shop through one grid of cables: tap a shop and its cable lights; on the database stop all of them pulse. The
   street lives: a kopitiam corner with a laptop and kopi, a bird in its cage, ceiling fans, lanterns, a cat on the ledge, the
   Odoo Line map, the database tram on the road, clouds and birds over the neighbours. The cast: the TechNext consultant points
   out shops on her tablet (tap: an app flies from the tablet into its shop), the planner sips kopi at the laptop (tap: her
   first-phase checklist ticks itself), the TechNext database keeper turns the vault's wheel (tap: a full spin that lights the
   whole street), the business owner window-shops with her bags (tap: an app drops into her bag). Tap anyone, a shop, the
   database, the tram or the cat. */
(function (K, CR, CO) {
  'use strict';
  if (!K || !CR || !CO) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed, limb = K.limb;
  var F = 470, PUR = '#714B67', PUR_D = '#4A2E44', INK = '#1B1F3B', GOLD = '#FFD84A';
  var CATS = [
    { key: 'finance', name: 'Finance', col: '#0E9384', focus: true, apps: ['accountant', 'account', 'hr_expense', 'spreadsheet_dashboard', 'documents', 'sign'] },
    { key: 'sales', name: 'Sales', col: '#3167CA', focus: true, apps: ['crm', 'sale', 'point_of_sale', 'pos_restaurant', 'sale_subscription', 'sale_renting'] },
    { key: 'supply', name: 'Supply Chain', col: '#E07B12', focus: true, apps: ['stock', 'mrp', 'mrp_plm', 'purchase', 'maintenance', 'quality_control'] },
    { key: 'websites', name: 'Websites', col: '#7B5CD6', apps: ['website', 'website_sale', 'website_blog', 'website_forum', 'im_livechat', 'website_slides'] },
    { key: 'hr', name: 'Human Resources', col: '#D63C64', apps: ['hr', 'hr_recruitment', 'hr_holidays', 'hr_appraisal', 'hr_referral', 'fleet', 'hr_payroll'] },
    { key: 'marketing', name: 'Marketing', col: '#C98316', apps: ['social', 'mass_mailing', 'mass_mailing_sms', 'event', 'marketing_automation', 'survey'] },
    { key: 'services', name: 'Services', col: '#14A38B', apps: ['project', 'hr_timesheet', 'industry_fsm', 'helpdesk', 'planning', 'appointment'] },
    { key: 'productivity', name: 'Productivity', col: '#56709E', apps: ['mail', 'approvals', 'iot', 'voip', 'knowledge', 'whatsapp', 'ai_app'] }];
  var SH = { w: 189, h: 110 }, L3 = -94, L2 = 30, ARC = 152, DB = { x: 560, y: 302, r: 64 }, WHEEL = { x: 640, y: 392 }, TABLE = { x: 392, y: 404 };
  var COLS = [186, 430, 760, 1000], PAST = { mint: '#CFEDE1', pink: '#F7D3DA', butter: '#FBE7B0', blue: '#CFE2F5', lilac: '#E9DEF1' };
  CATS.forEach(function (c, i) { c.x = 192 + (i % 4) * 201; c.y = i < 4 ? L3 : L2; c.i = i; });
  /* the real app icons (local SVGs), loaded once; drawn when ready */
  var ROOT = (function () { var s = document.querySelector('script[src*="worlds/app-all.js"]'); return s ? s.getAttribute('src').split('assets/js/')[0] : '/'; })(), IMG = {};
  CATS.forEach(function (c) { c.apps.forEach(function (m) { var im = new Image(); im.src = ROOT + 'assets/img/odoo/' + m + '.svg'; IMG[m] = im; }); });
  /* drawing an SVG image re-rasterises it on every call (~45 icons a frame): each icon is rasterised once into a bitmap */
  var BMP = {};
  function bmp(m) {
    if (BMP[m]) return BMP[m];
    var im = IMG[m]; if (!(im && im.complete && im.naturalWidth)) return null;
    var c = document.createElement('canvas'); c.width = c.height = 160; c.getContext('2d').drawImage(im, 0, 0, 160, 160);
    return (BMP[m] = c);
  }
  function icon(g, m, x, y, s) { var b = bmp(m); if (b) g.drawImage(b, x, y, s, s); else fillRR(g, x, y, s, s, s * 0.26, '#EEF2F7'); }
  function setU(g, sx, sy, k) { g.translate(sx, sy); g.scale(k, k); }
  function extOf(W, H, k, sx, sy) { return { l: -(sx + 24) / k, r: (W - sx) / k, t: -(sy + 24) / k, b: (H - sy) / k }; }
  function catAt(x, y) { for (var i = 0; i < CATS.length; i++) { var c = CATS[i]; if (x > c.x && x < c.x + SH.w && y > c.y && y < c.y + SH.h) return c; } return null; }
  function iconXY(c, j) { return [c.x + 18 + (j % 4) * 42, c.y + 37 + Math.floor(j / 4) * 34]; }

  /* ---------------- the static layers ---------------- */
  function paintBg(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    var sg = g.createLinearGradient(0, e.t, 0, 300); sg.addColorStop(0, '#86C8F2'); sg.addColorStop(0.6, '#C4E6FA'); sg.addColorStop(1, '#EEF8FD'); g.fillStyle = sg; g.fillRect(e.l, e.t, e.r - e.l, 480 - e.t);
    var gl = g.createRadialGradient(1120, -150, 10, 1120, -150, 380); gl.addColorStop(0, 'rgba(255,248,214,.95)'); gl.addColorStop(0.3, 'rgba(255,244,200,.35)'); gl.addColorStop(1, 'rgba(255,244,200,0)'); g.fillStyle = gl; g.fillRect(e.l, e.t, e.r - e.l, 400); fillE(g, 1120, -150, 24, 24, '#FFF6D0');
    /* a hazy skyline behind the neighbours */
    for (var i = 0; i < 80; i++) { var bx = e.l + i * 46 + hash(i) * 20; if (bx > e.r) break; var bh = 90 + hash(i * 3.1) * 170; g.fillStyle = i % 3 ? 'rgba(170,196,228,.55)' : 'rgba(190,176,214,.5)'; g.fillRect(bx, 120 - bh, 34 + hash(i + 5) * 12, bh + 200);
      g.fillStyle = 'rgba(255,255,255,.35)'; for (var wy = 128 - bh; wy < 110; wy += 14) g.fillRect(bx + 6, wy, 20, 3); }
    g.restore();
  }
  function tiles(g, x0, x1, y0, y1) { /* Peranakan floor tiles: a flower in a diamond on every tile */
    var tw = 24, th = 12; for (var y = y0; y < y1; y += th) for (var x = Math.floor(x0 / tw) * tw; x < x1; x += tw) { var o = ((y - y0) / th) % 2 ? tw / 2 : 0, cx = x + o + tw / 2, cy = y + th / 2;
      g.fillStyle = ((x / tw + (y - y0) / th) % 2) ? '#F4EADF' : '#FFFFFF'; g.fillRect(x + o, y, tw, th);
      g.fillStyle = '#7FC4B4'; g.beginPath(); g.moveTo(cx, cy - 5); g.lineTo(cx + 7, cy); g.lineTo(cx, cy + 5); g.lineTo(cx - 7, cy); g.closePath(); g.fill(); fillE(g, cx, cy, 2.2, 1.6, '#E07B8E'); }
  }
  function neighbour(g, x, w, top, col, seed) { /* a two-storey shophouse next door: louvred windows, a pitched tile roof, an AC unit */
    fillRR(g, x, top, w, F - top, 0, col); g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(x, top, w, 10);
    g.fillStyle = '#D9876B'; g.beginPath(); g.moveTo(x - 10, top); g.lineTo(x + w / 2, top - 46); g.lineTo(x + w + 10, top); g.closePath(); g.fill(); g.fillStyle = 'rgba(0,0,0,.08)'; for (var ry = top - 40; ry < top; ry += 8) g.fillRect(x - 6, ry, w + 12, 2);
    for (var r = 0; r < 2; r++) for (var c = 0; c < Math.floor(w / 70); c++) { var wx = x + 20 + c * 70, wy = top + 30 + r * 120; fillRR(g, wx - 4, wy - 4, 48, 78, 4, '#FFFFFF'); fillRR(g, wx, wy, 40, 70, 3, hash(c + r * 3 + seed) > 0.5 ? '#7FB7A6' : '#E3A1AE');
      g.fillStyle = 'rgba(255,255,255,.45)'; for (var lv = 6; lv < 70; lv += 7) g.fillRect(wx + 2, wy + lv, 36, 2); fillRR(g, wx - 6, wy + 72, 52, 6, 2, '#FFFFFF'); }
    fillRR(g, x + w - 52, top + 160, 40, 26, 3, '#F3F5F8'); fillE(g, x + w - 32, top + 173, 9, 9, '#C9D3DE');
    fillRR(g, x, F - 150, w, 16, 0, 'rgba(255,255,255,.7)'); fillRR(g, x + 16, F - 128, w - 32, 128, 6, 'rgba(60,40,70,.12)');
    var ac = ['#7FB7A6', '#E3A1AE', '#E8B95A', '#8FB2EA'][Math.floor(hash(seed * 0.37) * 4)], nw = Math.floor((w - 32) / 22);
    for (var aw = 0; aw < nw; aw++) { g.fillStyle = aw % 2 ? '#FFFFFF' : ac; g.fillRect(x + 16 + aw * 22, F - 134, 22, 16); g.beginPath(); g.arc(x + 27 + aw * 22, F - 118, 11, 0, Math.PI); g.fill(); }
    fillRR(g, x + w / 2 - 44, F - 176, 88, 22, 5, '#FFFFFF'); g.strokeStyle = ac; g.lineWidth = 2; rr(g, x + w / 2 - 44, F - 176, 88, 22, 5); g.stroke(); fillE(g, x + w / 2 - 30, F - 165, 4, 4, ac); fillE(g, x + w / 2 + 30, F - 165, 4, 4, ac);
    g.fillStyle = 'rgba(60,40,70,.22)'; g.fillRect(x + w / 2 - 22, F - 168, 44, 3); g.fillRect(x + w / 2 - 16, F - 162, 32, 3);
    g.save(); g.translate(x + 30, F); g.scale(0.4, 0.4); K.plant(g, { x: 0, y: 0 }, '#FFFFFF', '#E3E8EF'); g.restore(); g.save(); g.translate(x + w - 30, F); g.scale(0.4, 0.4); K.plant(g, { x: 0, y: 0 }, '#FFFFFF', '#E3E8EF'); g.restore();
  }
  function paintFrame(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    /* the neighbours either side */
    for (var nx = 1010; nx < e.r + 40; nx += 240) neighbour(g, nx + 6, 230, -10 + (nx % 480 ? 20 : 0), [PAST.mint, PAST.butter, PAST.blue][Math.round(nx / 240) % 3], nx);
    for (var nl = -60; nl > e.l - 260; nl -= 240) neighbour(g, nl - 230 + 6, 230, -10 + (nl % 480 ? 20 : 0), [PAST.pink, PAST.blue, PAST.mint][Math.round(-nl / 240) % 3], nl);
    /* the street: five-foot way tiles, the kerb, the road and its tram rails, the near pavement */
    tiles(g, e.l, e.r, F, F + 36); g.fillStyle = 'rgba(70,40,70,.10)'; g.fillRect(e.l, F, e.r - e.l, 5);
    fillRR(g, e.l, F + 36, e.r - e.l, 8, 0, '#D9D2C8'); g.fillStyle = '#B9B2A8'; g.fillRect(e.l, F + 42, e.r - e.l, 3);
    var rg = g.createLinearGradient(0, F + 45, 0, 700); rg.addColorStop(0, '#C9CDD6'); rg.addColorStop(1, '#B8BDC8'); g.fillStyle = rg; g.fillRect(e.l, F + 45, e.r - e.l, 700 - F - 45);
    g.fillStyle = '#FFFFFF'; for (var dx = Math.floor(e.l / 90) * 90; dx < e.r; dx += 90) g.fillRect(dx, 600, 46, 4);
    g.fillStyle = '#8E95A3'; g.fillRect(e.l, 664, e.r - e.l, 4); g.fillRect(e.l, 676, e.r - e.l, 4); g.fillStyle = 'rgba(255,255,255,.5)'; g.fillRect(e.l, 664, e.r - e.l, 1.4); g.fillRect(e.l, 676, e.r - e.l, 1.4);
    fillRR(g, e.l, 700, e.r - e.l, 8, 0, '#D9D2C8'); var pg = g.createLinearGradient(0, 708, 0, e.b); pg.addColorStop(0, '#EDE6DC'); pg.addColorStop(1, '#E2D9CC'); g.fillStyle = pg; g.fillRect(e.l, 708, e.r - e.l, e.b - 708);
    g.strokeStyle = 'rgba(150,130,110,.18)'; g.lineWidth = 1.5; g.beginPath(); for (var px = Math.floor(e.l / 60) * 60; px < e.r; px += 60) { g.moveTo(px, 708); g.lineTo(px + (px - 560) * 0.2, e.b); } g.moveTo(e.l, 740); g.lineTo(e.r, 740); g.moveTo(e.l, 790); g.lineTo(e.r, 790); g.stroke();
    g.restore();
  }
  function shopFront(g, c) {
    var x = c.x, y = c.y;
    shadowed(g, 10, 4, 0.14, function () { fillRR(g, x - 3, y - 3, SH.w + 6, SH.h + 6, 8, '#FFFFFF'); });
    fillRR(g, x, y, SH.w, 24, 6, c.col); g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(x + 4, y + 3, SH.w - 8, 3);
    text(g, c.name, x + 10, y + 16.5, 9.4, 800, '#FFFFFF'); text(g, c.apps.length + ' apps', x + SH.w - 10, y + 16, 7.2, 700, 'rgba(255,255,255,.88)', 'right');
    fillRR(g, x + 4, y + 26, SH.w - 8, SH.h - 30, 4, '#F7FBFE'); var wg = g.createLinearGradient(x, y + 26, x + SH.w, y + SH.h); wg.addColorStop(0, 'rgba(190,220,245,.35)'); wg.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = wg; g.fillRect(x + 4, y + 26, SH.w - 8, SH.h - 30);
    for (var a = 0; a < 9; a++) { var ax = x + 4 + a * ((SH.w - 8) / 9); g.fillStyle = a % 2 ? '#FFFFFF' : c.col; g.fillRect(ax, y + 26, (SH.w - 8) / 9, 6); g.beginPath(); g.arc(ax + (SH.w - 8) / 18, y + 32, (SH.w - 8) / 18, 0, Math.PI); g.fill(); }
    g.fillStyle = 'rgba(70,50,80,.10)'; [y + 67, y + 101].forEach(function (sy2) { g.fillRect(x + 10, sy2, SH.w - 20, 3); });
    if (c.focus) { var bx = x + SH.w - 18, by = y + SH.h - 6; g.fillStyle = '#E8B92E'; g.beginPath(); g.moveTo(bx - 7, by + 4); g.lineTo(bx - 10, by + 22); g.lineTo(bx - 3, by + 17); g.lineTo(bx, by + 24); g.lineTo(bx + 2, by + 6); g.closePath(); g.fill();
      g.beginPath(); g.moveTo(bx + 7, by + 4); g.lineTo(bx + 10, by + 22); g.lineTo(bx + 3, by + 17); g.lineTo(bx, by + 24); g.closePath(); g.fill(); for (var p = 0; p < 12; p++) { var an = p * Math.PI / 6; fillE(g, bx + Math.cos(an) * 11, by + Math.sin(an) * 11, 4, 4, GOLD); }
      fillE(g, bx, by, 11, 11, GOLD); fillE(g, bx, by, 8, 8, '#FFFFFF'); CO.plane(g, bx, by, 0.55, 0, '#3167CA'); }
  }
  function lantern(g, x, y) { g.strokeStyle = '#8A6A4A'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(x, ARC + 20); g.lineTo(x, y - 12); g.stroke(); fillRR(g, x - 5, y - 13, 10, 4, 2, '#C9962E'); fillE(g, x, y, 11, 13, '#E2453D'); fillE(g, x - 3, y - 3, 3, 6, 'rgba(255,255,255,.35)'); g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(x - 11, y - 1, 22, 2); fillRR(g, x - 5, y + 11, 10, 4, 2, '#C9962E'); g.strokeStyle = GOLD; g.beginPath(); g.moveTo(x, y + 15); g.lineTo(x, y + 24); g.stroke(); }
  function paintBack(g, ext) {
    /* the building: a lilac body, white trim, a parapet with the street's name */
    fillRR(g, 176, -124, 836, F + 124, 0, '#F2EAF6'); g.fillStyle = 'rgba(113,75,103,.05)'; for (var bz = 0; bz < 5; bz++) g.fillRect(182 + bz * 201, -124, 12, F + 124);
    fillRR(g, 168, -134, 852, 34, 4, '#FFFFFF'); fillRR(g, 168, -104, 852, 6, 0, '#E3D6EA');
    for (var bl = 0; bl < 34; bl++) fillRR(g, 180 + bl * 24.6, -128, 14, 18, 3, bl % 2 ? '#F2EAF6' : '#E9DEF1');
    fillRR(g, 470, -150, 240, 40, 10, PUR); text(g, 'ODOO STREET', 590, -125, 15, 800, '#FFFFFF', 'center'); fillE(g, 486, -130, 5, 5, GOLD); fillE(g, 694, -130, 5, 5, GOLD);
    /* the two shop floors, their ledges and flower boxes */
    CATS.forEach(function (c) { shopFront(g, c); });
    [L3 + SH.h + 2, L2 + SH.h + 2].forEach(function (ly, li) { fillRR(g, 172, ly, 844, 10, 3, '#FFFFFF'); g.fillStyle = 'rgba(113,75,103,.12)'; g.fillRect(172, ly + 8, 844, 3);
      if (!li) CATS.slice(0, 4).forEach(function (c) { fillRR(g, c.x + 24, ly + 8, 52, 9, 3, '#B5865A'); for (var f = 0; f < 5; f++) { fillE(g, c.x + 30 + f * 10, ly + 7, 5, 4, f % 2 ? '#3FBF7F' : '#2E9E66'); fillE(g, c.x + 30 + f * 10, ly + 4, 3, 3, ['#FF8FA3', '#FFD84A', '#FFFFFF'][f % 3]); } }); });
    /* the five-foot way: the arcade ceiling, the arches, the back walls of each bay */
    fillRR(g, 172, ARC, 844, 28, 0, '#FFFFFF'); g.fillStyle = 'rgba(113,75,103,.10)'; g.fillRect(172, ARC + 24, 844, 4);
    [[COLS[0], COLS[1], '#F3E3D3'], [COLS[1], COLS[2], '#E2D2EA'], [COLS[2], COLS[3], '#E6EEF6']].forEach(function (b) { fillRR(g, b[0] + 7, ARC + 28, b[1] - b[0] - 14, F - ARC - 28, 0, b[2]); });
    COLS.forEach(function (cx) { fillRR(g, cx - 8, ARC + 20, 16, F - ARC - 20, 3, '#FFFFFF'); fillRR(g, cx - 11, ARC + 20, 22, 10, 3, '#F2EAF6'); fillRR(g, cx - 11, F - 26, 22, 26, 3, '#EEE4F2'); g.fillStyle = 'rgba(113,75,103,.08)'; g.fillRect(cx + 3, ARC + 30, 4, F - ARC - 56); });
    for (var a = 0; a < 3; a++) { var x0 = COLS[a] + 8, x1 = COLS[a + 1] - 8, mid = (x0 + x1) / 2; g.fillStyle = '#FFFFFF'; g.beginPath(); g.moveTo(x0, ARC + 28); g.lineTo(x1, ARC + 28); g.lineTo(x1, ARC + 74); g.quadraticCurveTo(mid, ARC + 20, x0, ARC + 74); g.closePath(); g.fill();
      g.strokeStyle = '#E3D6EA'; g.lineWidth = 2; g.beginPath(); g.moveTo(x1, ARC + 74); g.quadraticCurveTo(mid, ARC + 20, x0, ARC + 74); g.stroke(); }
    /* the kopitiam corner: the Odoo Line map on the wall, the marble table, the bird cage hook */
    fillRR(g, 252, 232, 150, 46, 6, '#FFFFFF'); text(g, 'THE ODOO LINE', 327, 244, 6.8, 800, PUR, 'center');
    g.strokeStyle = PUR; g.lineWidth = 4; g.lineCap = 'round'; g.beginPath(); g.moveTo(264, 260); g.lineTo(390, 260); g.stroke();
    CATS.forEach(function (c, i) { var mx = 264 + i * 18; fillE(g, mx, 260, 4.4, 4.4, '#FFFFFF'); g.strokeStyle = c.col; g.lineWidth = 2.2; g.beginPath(); g.arc(mx, 260, 3.8, 0, 7); g.stroke(); text(g, c.name.split(' ')[0].slice(0, 5), mx, i % 2 ? 274 : 252, 4.2, 800, '#5C5C73', 'center'); });
    soft(g, TABLE.x, F + 2, 44, 6, 0.25); fillRR(g, TABLE.x - 4, TABLE.y + 6, 8, F - TABLE.y - 8, 2, '#2A3142'); fillE(g, TABLE.x, F - 3, 24, 5, '#2A3142');
    /* the vault: tiled back wall, gauges, the ONE DATABASE drum and its valve */
    g.fillStyle = 'rgba(113,75,103,.07)'; for (var tx = COLS[1] + 14; tx < COLS[2] - 10; tx += 22) for (var ty = ARC + 80; ty < F - 10; ty += 22) g.fillRect(tx, ty, 20, 20);
    [462, 662].forEach(function (gx, i) { fillE(g, gx, 252, 16, 16, '#FFFFFF'); g.strokeStyle = PUR; g.lineWidth = 2.5; g.beginPath(); g.arc(gx, 252, 15, 0, 7); g.stroke(); text(g, i ? 'SYNC' : 'LIVE', gx, 263, 4.6, 800, '#8A6A84', 'center'); });
    soft(g, DB.x, F + 4, 100, 12, 0.3); var dx = DB.x - DB.r;
    g.fillStyle = PUR; g.fillRect(dx, DB.y, DB.r * 2, F - 16 - DB.y); fillE(g, DB.x, F - 16, DB.r, 16, '#5A3A52');
    for (var b = 0; b < 3; b++) fillE(g, DB.x, DB.y + 44 + b * 40, DB.r, 16, b % 2 ? '#7E5675' : '#6A4462'); fillE(g, DB.x, DB.y, DB.r, 16, '#8A6080'); fillE(g, DB.x - 10, DB.y - 3, DB.r * 0.6, 7, 'rgba(255,255,255,.18)');
    g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(dx + 12, DB.y + 6, 10, F - DB.y - 30);
    text(g, 'ONE DATABASE', DB.x, DB.y + 76, 11, 800, '#FFFFFF', 'center'); text(g, 'customers · products · accounts', DB.x, DB.y + 91, 6.6, 700, '#F0DDEB', 'center');
    g.strokeStyle = '#9AA6BC'; g.lineWidth = 6; g.beginPath(); g.moveTo(DB.x + DB.r - 4, WHEEL.y); g.lineTo(WHEEL.x, WHEEL.y); g.stroke();
    /* the showroom bay: an "Odoo 20 · now open" poster and a display plinth */
    fillRR(g, 872, 296, 112, 64, 6, '#FFFFFF'); fillRR(g, 872, 296, 112, 16, 6, PUR); g.fillRect(872, 304, 112, 8); text(g, 'NOW OPEN', 928, 308, 7.6, 800, '#FFFFFF', 'center'); text(g, 'Odoo 20', 928, 334, 15, 800, PUR, 'center'); text(g, 'every app, one database', 928, 350, 6.2, 700, '#8A6A84', 'center');
    for (var cf = 0; cf < 10; cf++) fillRR(g, 878 + hash(cf) * 100, 316 + hash(cf + 3) * 38, 4, 2, 1, ['#3167CA', '#14A38B', GOLD, '#E0456B'][cf % 4]);
    soft(g, 930, F + 2, 44, 5, 0.25); fillRR(g, 894, F - 68, 72, 68, 6, '#FFFFFF'); fillRR(g, 890, F - 72, 80, 8, 4, '#E9DEF1'); text(g, 'NEW ARRIVALS', 930, F - 50, 6.4, 800, PUR, 'center');
    /* plants by the columns */
    [[COLS[0] + 28, '#F7D3DA'], [COLS[3] - 26, '#CFEDE1']].forEach(function (pl) { g.save(); g.translate(pl[0], F); g.scale(0.55, 0.55); K.plant(g, { x: 0, y: 0 }, pl[1], '#FFFFFF'); g.restore(); });
  }
  function paintFront(g, ext) {
    /* the planner's laptop on the marble table (beside her), her kopi cup */
    fillE(g, TABLE.x, TABLE.y, 42, 9, '#E9EEF4'); fillE(g, TABLE.x, TABLE.y - 2, 40, 8, '#FFFFFF'); g.strokeStyle = 'rgba(150,160,180,.35)'; g.lineWidth = 1; g.beginPath(); g.moveTo(TABLE.x - 20, TABLE.y - 4); g.quadraticCurveTo(TABLE.x, TABLE.y + 2, TABLE.x + 24, TABLE.y - 6); g.stroke();
    fillRR(g, TABLE.x - 14, TABLE.y - 40, 46, 32, 3, '#2A3142'); fillRR(g, TABLE.x - 20, TABLE.y - 9, 58, 5, 2, '#9AA6BC');
    fillRR(g, TABLE.x - 34, TABLE.y - 16, 12, 12, 3, '#FFFFFF'); fillRR(g, TABLE.x - 36, TABLE.y - 6, 16, 3, 1.5, '#E3E8EF'); fillRR(g, TABLE.x - 34, TABLE.y - 16, 12, 3, 1.5, '#8A5A3B');
    /* the valve wheel on the drum's pipe */
    fillE(g, WHEEL.x, WHEEL.y, 5, 5, '#5C6B7A');
  }
  function paintFore(g, ext) {
    /* the near pavement: planters, a bench, a bicycle, a hydrant, the street sign */
    function planter(x, col) { soft(g, x, 760, 40, 6, 0.25); g.save(); g.translate(x, 760); g.scale(0.62, 0.62); K.plant(g, { x: 0, y: 0 }, col, '#FFFFFF'); g.restore(); }
    planter(230, '#F7D3DA'); planter(980, '#CFEDE1');
    var bx = 600; soft(g, bx + 60, 770, 80, 6, 0.25); fillRR(g, bx, 732, 124, 8, 3, '#C99A6B'); fillRR(g, bx, 716, 124, 8, 3, '#C99A6B'); fillRR(g, bx + 8, 740, 6, 28, 2, '#2A3142'); fillRR(g, bx + 110, 740, 6, 28, 2, '#2A3142'); fillRR(g, bx + 4, 712, 4, 26, 2, '#2A3142'); fillRR(g, bx + 116, 712, 4, 26, 2, '#2A3142');
    var cx = 400; soft(g, cx + 30, 768, 50, 5, 0.25); g.strokeStyle = '#3167CA'; g.lineWidth = 4; g.beginPath(); g.arc(cx, 748, 18, 0, 7); g.moveTo(cx + 78, 748); g.arc(cx + 60, 748, 18, 0, 7); g.stroke();
    g.beginPath(); g.moveTo(cx, 748); g.lineTo(cx + 24, 722); g.lineTo(cx + 52, 722); g.lineTo(cx + 60, 748); g.moveTo(cx + 24, 722); g.lineTo(cx + 32, 748); g.lineTo(cx + 52, 722); g.moveTo(cx + 22, 716); g.lineTo(cx + 26, 726); g.moveTo(cx + 50, 712); g.lineTo(cx + 54, 722); g.stroke(); fillRR(g, cx + 14, 712, 16, 5, 2, '#2A3142'); fillRR(g, cx + 44, 708, 14, 4, 2, '#2A3142');
    fillRR(g, cx + 54, 712, 20, 12, 3, '#C99A6B');
    var hx = 860; soft(g, hx, 772, 18, 4, 0.25); fillRR(g, hx - 10, 738, 20, 34, 5, '#E2453D'); fillE(g, hx, 738, 11, 7, '#C9362F'); fillRR(g, hx - 15, 750, 30, 7, 3, '#C9362F');
    var sx2 = 540; fillRR(g, sx2 - 2, 690, 4, 82, 2, '#7A869C'); soft(g, sx2, 772, 14, 3, 0.25); fillRR(g, sx2 - 46, 680, 92, 22, 4, '#0E7A4C'); g.strokeStyle = '#FFFFFF'; g.lineWidth = 1.2; rr(g, sx2 - 43, 683, 86, 16, 3); g.stroke(); text(g, 'Odoo Street', sx2, 695, 8.4, 800, '#FFFFFF', 'center');
    /* (behind the title card) the kueh cart on the five-foot way, a red post box, a trishaw parked in the far lane */
    cart(g); var pb = -150; soft(g, pb, 508, 24, 5, 0.25); fillRR(g, pb - 18, 434, 36, 72, 8, '#E2453D'); fillE(g, pb, 436, 20, 9, '#C9362F'); fillRR(g, pb - 11, 452, 22, 5, 2, '#2A3142'); fillRR(g, pb - 9, 468, 18, 13, 2, 'rgba(255,255,255,.85)');
    trishaw(g, -250, 592);
    if (ext.l < -560) { /* a bus stop for the Odoo Street line (wide screens, left of the title card) */
      var bs = -770; soft(g, bs, 790, 110, 8, 0.25); fillRR(g, bs - 96, 632, 192, 12, 5, PUR); fillRR(g, bs - 88, 644, 6, 146, 2, '#9AA6BC'); fillRR(g, bs + 82, 644, 6, 146, 2, '#9AA6BC');
      g.fillStyle = 'rgba(200,225,245,.45)'; g.fillRect(bs - 82, 650, 164, 92); g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = 2; g.beginPath(); g.moveTo(bs - 70, 740); g.lineTo(bs - 40, 656); g.moveTo(bs - 50, 740); g.lineTo(bs - 20, 656); g.stroke();
      fillRR(g, bs - 70, 748, 140, 8, 3, '#C99A6B'); fillRR(g, bs - 64, 756, 5, 30, 2, '#2A3142'); fillRR(g, bs + 59, 756, 5, 30, 2, '#2A3142');
      fillRR(g, bs + 100, 600, 6, 190, 2, '#7A869C'); fillE(g, bs + 103, 600, 22, 22, '#FFFFFF'); g.strokeStyle = '#0E7A4C'; g.lineWidth = 4; g.beginPath(); g.arc(bs + 103, 600, 19, 0, 7); g.stroke(); text(g, 'BUS', bs + 103, 604, 9, 800, '#0E7A4C', 'center');
      fillRR(g, bs - 60, 660, 120, 30, 5, '#FFFFFF'); text(g, 'Odoo Street', bs, 674, 9, 800, PUR, 'center'); text(g, 'every stop · one database', bs, 685, 6.4, 700, '#8A6A84', 'center'); }
    if (ext.r > 1100) { planter(1200, '#F7D3DA'); }
    if (ext.l < -500) planter(-620, '#CFEDE1');
  }
  /* the kueh cart: a glass case of kueh, a card reader (Point of Sale), a striped umbrella; its keeper stands behind it */
  var CART = { x: -400, w: 124, y: 440 };
  function cart(g) { var c = CART, cx = c.x + c.w / 2; soft(g, cx, 508, 74, 7, 0.28);
    fillRR(g, cx + 50, 200, 4, c.y - 200, 2, '#8A6A4A');
    fillRR(g, c.x, c.y, c.w, 54, 6, '#7FC4B4'); g.fillStyle = 'rgba(255,255,255,.35)'; for (var sl = c.x + 10; sl < c.x + c.w - 6; sl += 16) g.fillRect(sl, c.y + 10, 6, 36);
    fillRR(g, c.x + 22, c.y + 16, c.w - 44, 20, 5, '#FFFFFF'); text(g, 'KUEH', cx, c.y + 30, 10, 800, '#C24E5D', 'center');
    fillRR(g, c.x + 6, c.y - 30, c.w - 12, 32, 5, 'rgba(210,235,245,.75)'); g.strokeStyle = '#FFFFFF'; g.lineWidth = 2; rr(g, c.x + 6, c.y - 30, c.w - 12, 32, 5); g.stroke();
    for (var k = 0; k < 10; k++) { var kx = c.x + 16 + (k % 5) * 20, ky = c.y - 22 + Math.floor(k / 5) * 12; fillRR(g, kx, ky, 14, 8, 2, ['#3FBF7F', '#F28C96', '#FFD84A', '#B7A3E8', '#FFFFFF'][(k * 3) % 5]); fillRR(g, kx, ky, 14, 3, 1.5, 'rgba(255,255,255,.5)'); }
    fillRR(g, c.x + c.w - 30, c.y - 42, 22, 13, 3, '#2A3142'); fillRR(g, c.x + c.w - 27, c.y - 40, 16, 5, 1.5, '#9FE3C8');
    [c.x + 18, c.x + c.w - 18].forEach(function (wx) { fillE(g, wx, 500, 12, 12, '#2A3142'); fillE(g, wx, 500, 5, 5, '#C9D3DE'); });
    for (var u = 0; u < 8; u++) { g.fillStyle = u % 2 ? '#FFFFFF' : '#E07B8E'; g.beginPath(); g.moveTo(cx + 52, 172); g.lineTo(cx - 32 + u * 21, 200); g.lineTo(cx - 11 + u * 21, 200); g.closePath(); g.fill(); }
    for (var sc = 0; sc < 8; sc++) { g.fillStyle = sc % 2 ? '#FFFFFF' : '#E07B8E'; g.beginPath(); g.arc(cx - 21.5 + sc * 21, 200, 10.5, 0, Math.PI); g.fill(); } fillE(g, cx + 52, 170, 4, 4, GOLD);
  }
  function trishaw(g, x, y) { soft(g, x + 70, y + 4, 80, 7, 0.25); g.strokeStyle = '#2A3142'; g.lineWidth = 3;
    [[x + 20, y - 18], [x + 110, y - 18], [x + 150, y - 18]].forEach(function (w) { g.beginPath(); g.arc(w[0], w[1], 18, 0, 7); g.stroke(); fillE(g, w[0], w[1], 3, 3, '#2A3142'); });
    fillRR(g, x, y - 72, 66, 42, 8, '#3167CA'); fillRR(g, x + 4, y - 66, 58, 14, 5, '#FFFFFF'); g.fillStyle = '#E0456B'; g.beginPath(); g.moveTo(x - 6, y - 74); g.quadraticCurveTo(x + 30, y - 140, x + 70, y - 74); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(x + 66, y - 40); g.lineTo(x + 150, y - 20); g.moveTo(x + 112, y - 40); g.lineTo(x + 130, y - 70); g.stroke(); fillRR(g, x + 120, y - 76, 26, 7, 3, '#2A3142');
    for (var f = 0; f < 4; f++) fillE(g, x + 12 + f * 13, y - 78, 6, 6, ['#FF8FA3', '#FFD84A', '#FFFFFF', '#3FBF7F'][f]); }

  /* ---------------- the people ---------------- */
  var W = CR.who;
  var CON = W({ x: 236, y: 470, s: 0.46, ph: 0.3, skin: 1, hair: 0, style: 'long', outfit: 'polo', top: '#3167CA', hold: 'tablet', hands: [[-70, -210], [70, -170]], look: 0.6 });
  var PLN = W({ x: 322, y: 470, s: 0.46, ph: 2.4, skin: 2, hair: 0, style: 'short', outfit: 'cardigan', top: '#14A38B', top2: '#FFFFFF', glasses: true, sit: true, chairCol: '#8A5A3B', id: '#9AA6BC', hands: [[-60, -206], [60, -206]], look: 0.5 });
  var KPR = W({ x: 690, y: 470, s: 0.46, ph: 1.1, skin: 0, hair: 1, style: 'short', outfit: 'shirt', top: PUR, hands: [[-80, -230], [-40, -260]], look: -0.6 });
  var OWN = W({ x: 820, y: 470, s: 0.47, ph: 1.6, skin: 3, hair: 1, style: 'bob', outfit: 'shirt', top: '#E0456B', id: '#9AA6BC', hold: 'bags', hands: [[-70, -170], [70, -170]], look: -0.6 });
  var STL = W({ x: -338, y: 470, s: 0.46, ph: 0.7, skin: 1, hair: 0, style: 'bun', outfit: 'shirt', top: '#E07B12', id: '#9AA6BC', hands: [[-60, -140], [60, -140]], look: 0.3 });
  var CREW = [
    { x0: 1010, x1: 1290, y: 492, spd: 14, ph: 0.5, label: 'TechNext developer', lines: ['App delivery: **Inventory**, plugged into the same records.', 'No exports between apps. **One database**.'], acts: ['cheer', 'id', 'wave'],
      P: W({ s: 0.5, skin: 0, hair: 0, style: 'short', outfit: 'shirt', top: '#1E3A6E', hold: 'box' }) },
    { front: true, x0: 1060, x1: 1300, y: 730, spd: 18, ph: 0.7, label: 'TechNext trainer', lines: ['Start with **Finance, Sales and Supply Chain**.', 'Add the rest **as you need them**.'], acts: ['nod', 'id', 'wave'],
      P: W({ s: 0.58, skin: 2, hair: 1, style: 'pony', outfit: 'polo', top: PUR, clip: '#FFD84A', hold: 'clipboard' }) },
    { x0: -900, x1: 150, y: 492, spd: 15, ph: 0.3, label: 'TechNext consultant', lines: ['Discovery maps your processes to **apps**.'], acts: ['wave', 'id'],
      P: W({ s: 0.5, skin: 1, hair: 1, style: 'bun', outfit: 'cardigan', top: '#14A38B', top2: '#FFFFFF', hold: 'tablet' }) }
  ];
  function handAt(P, side) {
    var F3 = K.F3, d = side ? 1 : -1, h = P.hands[side], sxk = P.sx == null ? 1 : P.sx;
    var r = K.ik(d * F3.shx * (P.build || 1), F3.shy, h[0], h[1], F3.a, F3.b, d).h, dy = -(P.hop || 0) + (P.sit ? (P.sitDrop != null ? P.sitDrop : 46) : 0);
    return [P.x + r[0] * P.s * sxk, P.y + (r[1] + dy) * P.s];
  }

  /* ---------------- live ---------------- */
  var PICK = { c: null, t: -9 }, FX = [], TAP = {}, SPIN = { t: -9 }, CAT = { t: -9 }, TRAM = { t0: -5 };
  function active(S, t) { var byKey = CATS.filter(function (c) { return c.key === S.hot; })[0]; if (byKey) return byKey; if (S.hot === 'db' || t - SPIN.t < 2.4) return 'all'; return t - PICK.t < 4 ? PICK.c : null; }
  /* the grid: one cable per shop, from the vault's drum up the facade to the shop's sill */
  function cablePts(c) {
    var i = c.i % 4, top = c.y === L3, sx = c.x + SH.w / 2, ox = DB.x - 21 + i * 14, ly = top ? L3 + SH.h + 4 : ARC + 8;
    var pil = [COLS[0] + 2, COLS[1] - 2, COLS[2] + 2, COLS[3] - 2][i], up = top ? L2 + SH.h + 7 : ARC + 8;
    return top ? [[ox, DB.y - 12], [ox, ARC + 14 + i * 3], [pil, ARC + 14 + i * 3], [pil, ly + 2], [sx, ly + 2], [sx, c.y + SH.h]] : [[ox, DB.y - 12], [ox, up + i * 3], [sx, up + i * 3], [sx, c.y + SH.h]];
  }
  function polyAt(pts, f) { var L = 0, seg = []; for (var i = 1; i < pts.length; i++) { var d = Math.abs(pts[i][0] - pts[i - 1][0]) + Math.abs(pts[i][1] - pts[i - 1][1]); seg.push(d); L += d; }
    var want = f * L; for (var j = 0; j < seg.length; j++) { if (want <= seg[j]) { var u = seg[j] ? want / seg[j] : 0; return [lerp(pts[j][0], pts[j + 1][0], u), lerp(pts[j][1], pts[j + 1][1], u)]; } want -= seg[j]; } return pts[pts.length - 1]; }
  function paintWindow(g, t, par, S) {
    var e = S.ext;
    for (var c = 0; c < 4; c++) { var sp = 5 + c * 2, span = e.r - e.l + 400, x = e.l - 200 + ((hash(c + 7) * span + t * sp) % span), y = -190 + c * 26; K.cloud(g, x, y, 0.2 + hash(c) * 0.12); }
    g.strokeStyle = 'rgba(40,60,90,.55)'; g.lineWidth = 1.6; g.lineCap = 'round';
    for (var b = 0; b < 5; b++) { var bsp = e.r - e.l + 300, bx = e.l - 100 + ((t * (14 + b * 3) + hash(b + 2) * bsp) % bsp), by = -200 + b * 14 + Math.sin(t * 0.9 + b) * 6, fl = Math.sin(t * 8 + b * 2) * 4;
      g.beginPath(); g.moveTo(bx - 6, by - fl); g.quadraticCurveTo(bx - 3, by - 3, bx, by); g.quadraticCurveTo(bx + 3, by - 3, bx + 6, by - fl); g.stroke(); }
  }
  function paintLive(g, t, now, S) {
    var act = active(S, t), e = S.ext;
    /* the grid: idle cables faint; the chosen shop's cable (or all, on the database stop) carries data pulses */
    CATS.forEach(function (c) { var on = act === 'all' || act === c, pts = cablePts(c);
      g.lineJoin = 'round'; g.lineCap = 'round'; g.strokeStyle = on ? c.col : 'rgba(113,75,103,.22)'; g.lineWidth = on ? 3.2 : 1.8; g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (var i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]); g.stroke();
      var n = on ? 3 : 1; for (var q = 0; q < n; q++) { var f = ((t * (on ? 0.5 : 0.18) + q / n + c.i * 0.13) % 1), p = polyAt(pts, f); fillE(g, p[0], p[1], on ? 3.6 : 2.2, on ? 3.6 : 2.2, on ? '#FFFFFF' : c.col); if (on) { g.strokeStyle = c.col; g.lineWidth = 1.6; g.beginPath(); g.arc(p[0], p[1], 3.6, 0, 7); g.stroke(); } } });
    /* the shop windows: icons on their shelves; the chosen shop glows, its icons bob; OPEN signs blink */
    CATS.forEach(function (c) { var on = act === c || act === 'all', dim = act && !on, lift = act === c ? -3 : 0;
      if (act === c) { g.strokeStyle = c.col; g.lineWidth = 3; rr(g, c.x - 5, c.y - 5 + lift, SH.w + 10, SH.h + 10, 10); g.stroke(); }
      c.apps.forEach(function (m, j) { var p = iconXY(c, j), bob = on ? Math.sin(t * 4 + j) * 2 : Math.sin(t * 1.2 + j * 1.7 + c.i) * 0.6; g.save(); g.globalAlpha = dim ? 0.4 : 1; icon(g, m, p[0], p[1] + bob + lift, 28); g.restore(); });
      var blink = ((t + c.i * 0.7) % 5) < 4.6 || on; fillRR(g, c.x + SH.w - 34, c.y + 92, 26, 11, 5, blink ? '#FFFFFF' : '#F2F2F2'); g.strokeStyle = blink ? (on ? c.col : '#E0456B') : '#D9D9D9'; g.lineWidth = 1.4; rr(g, c.x + SH.w - 34, c.y + 92, 26, 11, 5); g.stroke();
      text(g, 'OPEN', c.x + SH.w - 21, c.y + 100.4, 5.6, 800, blink ? (on ? c.col : '#E0456B') : '#C9C9C9', 'center'); });
    /* the drum glows and its rings turn when the grid is busy */
    if (act) { g.save(); g.globalAlpha = 0.28 + 0.14 * Math.sin(t * 4); fillE(g, DB.x, DB.y, DB.r + 14, 22, act === 'all' ? GOLD : act.col); g.restore(); }
    for (var rgi = 0; rgi < 3; rgi++) { var rx = DB.x - DB.r + 6 + ((t * (act ? 60 : 16) + rgi * 40) % (DB.r * 2 - 12)); fillE(g, rx, DB.y + 44 + rgi * 40 + 14, 2.2, 2.2, 'rgba(255,255,255,.55)'); }
    /* the gauges' needles, the valve wheel */
    [462, 662].forEach(function (gx, i) { var a = -2.4 + 1.6 + Math.sin(t * (act ? 3 : 0.7) + i) * (act ? 1 : 0.35); g.strokeStyle = '#E0456B'; g.lineWidth = 2; g.beginPath(); g.moveTo(gx, 252); g.lineTo(gx + Math.cos(a) * 11, 252 + Math.sin(a) * 11); g.stroke(); fillE(g, gx, 252, 2.4, 2.4, INK); });
    var wa = WHEEL.a = (WHEEL.a || 0) + (t - SPIN.t < 2.2 ? 0.35 : KPR.turning ? 0.03 : 0.004);
    g.save(); g.translate(WHEEL.x, WHEEL.y); g.rotate(wa); g.strokeStyle = '#E0456B'; g.lineWidth = 4; g.beginPath(); g.arc(0, 0, 17, 0, 7); g.stroke(); g.lineWidth = 2.6; g.beginPath(); for (var sp = 0; sp < 4; sp++) { g.moveTo(0, 0); g.lineTo(Math.cos(sp * Math.PI / 2) * 17, Math.sin(sp * Math.PI / 2) * 17); } g.stroke(); fillE(g, 0, 0, 4, 4, '#C9362F'); g.restore();
    /* ceiling fans and lanterns in the five-foot way, the bird in its cage, the kopi steam */
    [308, 595, 880].forEach(function (fx, i) { fillRR(g, fx - 1.5, ARC + 28, 3, 14, 1, '#9AA6BC'); var a = t * 7 + i; for (var bl = 0; bl < 3; bl++) { var ca = Math.cos(a + bl * 2.094); fillE(g, fx + ca * 16, ARC + 43, Math.abs(ca) * 15 + 2, 2.4, '#C9B79C'); } fillE(g, fx, ARC + 43, 5, 4, '#FFFFFF'); });
    [[214, 214], [420, 210], [500, 220], [735, 214], [800, 216], [975, 212]].forEach(function (l, i) { var sw = Math.sin(t * 1.4 + i) * 2.5; g.save(); g.translate(sw, 0); lantern(g, l[0], l[1]); g.restore(); });
    var cgx = 238, cgy = 222; g.strokeStyle = '#8A6A4A'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(cgx, ARC + 28); g.lineTo(cgx, cgy - 24); g.stroke(); g.strokeStyle = '#C9962E'; g.lineWidth = 1.4; g.beginPath(); g.ellipse(cgx, cgy - 10, 15, 14, 0, Math.PI, 0); for (var cb = -12; cb <= 12; cb += 6) { g.moveTo(cgx + cb, cgy - 10 - Math.sqrt(Math.max(0, 196 - cb * cb)) * 0.95); g.lineTo(cgx + cb, cgy + 10); } g.stroke(); fillRR(g, cgx - 17, cgy + 8, 34, 4, 2, '#C9962E');
    var hop = Math.max(0, Math.sin(t * 5)) * ((t % 4) < 1.4 ? 5 : 0), bdx = Math.sin(t * 0.6) * 5; fillE(g, cgx + bdx, cgy + 1 - hop, 5, 4, '#7FC4E8'); fillE(g, cgx + bdx + 4, cgy - 3 - hop, 3, 3, '#7FC4E8'); fillE(g, cgx + bdx + 5, cgy - 3.5 - hop, 0.9, 0.9, INK); g.fillStyle = '#F2B233'; g.beginPath(); g.moveTo(cgx + bdx + 7, cgy - 3 - hop); g.lineTo(cgx + bdx + 10, cgy - 2 - hop); g.lineTo(cgx + bdx + 7, cgy - 1 - hop); g.fill();
    g.strokeStyle = 'rgba(160,170,190,.55)'; g.lineWidth = 1.3; for (var sv = 0; sv < 2; sv++) { var syy = TABLE.y - 22 - ((t * 12 + sv * 7) % 14); g.beginPath(); g.moveTo(TABLE.x - 30 + sv * 4, syy + 8); g.quadraticCurveTo(TABLE.x - 26 + sv * 4, syy + 4, TABLE.x - 30 + sv * 4, syy); g.stroke(); }
    /* the cat on the top ledge: sits, swishes its tail, sometimes strolls along */
    var ct = t - CAT.t, cx = 900 + (ct < 3 ? Math.sin(Math.min(1, ct / 3) * Math.PI) * 60 : 0), cy = L3 + SH.h + 2;
    g.fillStyle = '#F2A65A'; g.beginPath(); g.ellipse(cx, cy - 7, 10, 7, 0, 0, 7); g.fill(); fillE(g, cx + 9, cy - 15, 6, 5.5, '#F2A65A'); g.beginPath(); g.moveTo(cx + 5, cy - 19); g.lineTo(cx + 6, cy - 24); g.lineTo(cx + 9, cy - 20); g.moveTo(cx + 10, cy - 20); g.lineTo(cx + 13, cy - 24); g.lineTo(cx + 14, cy - 18); g.fill();
    g.strokeStyle = '#F2A65A'; g.lineWidth = 3; g.beginPath(); g.moveTo(cx - 9, cy - 6); g.quadraticCurveTo(cx - 20, cy - 10 + Math.sin(t * 3) * 6, cx - 16 - Math.sin(t * 3) * 4, cy - 20); g.stroke(); fillE(g, cx + 11, cy - 15, 1, 1.2, INK); fillE(g, cx + 7, cy - 15, 1, 1.2, INK);
    /* the planner's laptop: the first-phase plan */
    var lx = TABLE.x - 11, ly = TABLE.y - 37; fillRR(g, lx, ly, 40, 26, 2, '#FFFFFF'); fillRR(g, lx, ly, 40, 6, 2, PUR); ['accountant', 'sale', 'stock'].forEach(function (m, j) { icon(g, m, lx + 3 + j * 12.5, ly + 9, 10); });
    fillRR(g, lx + 3, ly + 21, 34 * clamp(((t % 6) / 4), 0.15, 1), 2.5, 1.2, '#2BC48A');
    CO.crew(CREW, g, t, S, false);
  }
  function drawTram(g, t, S) { /* the database tram: rolls along the street every half minute */
    var e = S.ext, span = e.r - e.l + 700, u = (t - TRAM.t0) % 30; if (u < 0 || u > 18) return; var x = e.l - 350 + (u / 18) * span, y = 664;
    soft(g, x, y + 10, 160, 8, 0.25); fillRR(g, x - 150, y - 84, 300, 78, 18, PUR); fillRR(g, x - 150, y - 84, 300, 14, 10, '#8A6080'); fillRR(g, x - 146, y - 22, 292, 12, 6, PUR_D);
    for (var w = 0; w < 6; w++) { fillRR(g, x - 132 + w * 46, y - 64, 36, 30, 5, '#E6F2FB'); g.fillStyle = 'rgba(255,255,255,.6)'; g.fillRect(x - 128 + w * 46, y - 62, 6, 26); }
    [-110, -66, 66, 110].forEach(function (wx) { fillE(g, x + wx, y - 4, 10, 10, '#2A3142'); fillE(g, x + wx, y - 4, 4, 4, '#9AA6BC'); });
    fillRR(g, x - 60, y - 30, 120, 9, 4, GOLD); text(g, 'ONE DATABASE LINE', x, y - 23.4, 6.6, 800, INK, 'center'); g.strokeStyle = '#2A3142'; g.lineWidth = 2; g.beginPath(); g.moveTo(x - 20, y - 84); g.lineTo(x, y - 104); g.lineTo(x + 20, y - 84); g.stroke();
    ['customers', 'products', 'accounts'].forEach(function (l, i) { fillRR(g, x - 120 + i * 92, y - 108, 60, 22, 4, ['#C99A6B', '#B98552', '#D4A877'][i]); text(g, l, x - 90 + i * 92, y - 94, 6.6, 800, '#FFFFFF', 'center'); });
  }
  function paintFrontLive(g, t, S) {
    CO.crew(CREW, g, t, S, true);
    /* held props: the keeper's grip on the wheel, the consultant's launched app, the planner's checklist and kopi, the owner's app in her bag */
    if (PLN.cup) { var hc = handAt(PLN, 1); fillRR(g, hc[0] - 5, hc[1] - 12, 11, 12, 3, '#FFFFFF'); fillRR(g, hc[0] - 5, hc[1] - 12, 11, 3, 1.5, '#8A5A3B'); }
    if (TAP.pln && t - TAP.pln < 2.6) { var hp = handAt(PLN, 1), u = clamp((t - TAP.pln) / 2.6, 0, 1), cx = hp[0] + 10, cy = hp[1] - 60; shadowed(g, 8, 3, 0.2, function () { fillRR(g, cx - 40, cy - 34, 84, 62, 7, '#FFFFFF'); });
      fillRR(g, cx - 40, cy - 34, 84, 12, 7, '#14A38B'); g.fillRect(cx - 40, cy - 27, 84, 5); text(g, 'Phase 1', cx + 2, cy - 25, 6.6, 800, '#FFFFFF', 'center');
      ['Accounting', 'Sales', 'Inventory'].forEach(function (l, i) { var y = cy - 12 + i * 13, on = u > 0.18 + i * 0.2; fillRR(g, cx - 34, y - 6, 9, 9, 2, on ? '#2BC48A' : '#EEF2F7'); if (on) { g.strokeStyle = '#FFFFFF'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(cx - 32, y - 2); g.lineTo(cx - 30, y + 0.5); g.lineTo(cx - 27, y - 4); g.stroke(); } text(g, l, cx - 20, y + 1.5, 6.6, 700, '#3D4560'); }); }
    if (STL._fan) { var fh = handAt(STL, 0); g.save(); g.translate(fh[0], fh[1] - 6); g.rotate(-0.4 + Math.sin(t * 14) * 0.35); g.fillStyle = '#E07B8E'; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, 18, -Math.PI * 0.85, -Math.PI * 0.15); g.closePath(); g.fill(); g.strokeStyle = '#FFFFFF'; g.lineWidth = 1; for (var fr = 0; fr < 5; fr++) { var fa = -Math.PI * 0.85 + fr * Math.PI * 0.175; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(fa) * 18, Math.sin(fa) * 18); g.stroke(); } g.restore(); }
    FX = FX.filter(function (f) { return t - f.t0 < f.dur; });
    FX.forEach(function (f) { var u = clamp((t - f.t0) / f.dur, 0, 1), e = u * u * (3 - 2 * u), x = lerp(f.x0, f.x1, e), y = lerp(f.y0, f.y1, e) - Math.sin(u * Math.PI) * f.arc;
      g.save(); g.translate(x, y); g.rotate(Math.sin(u * Math.PI) * 0.6); var s = 24 * (f.grow ? lerp(0.6, 1.1, Math.sin(u * Math.PI)) : 1); icon(g, f.m, -s / 2, -s / 2, s); g.restore();
      if (u > 0.96 && !f.done) { f.done = true; CR.burst(f.fx || 'star', f.x1, f.y1, t); } });
  }

  /* ---------------- the cast: an idle loop and a tap choreography each ---------------- */
  function tapped(id, st, t) { if (st.wave && st.wave !== st._my) { st._my = st.wave; TAP[id] = t; return true; } return false; }
  function lookAtNexi(P, st, t, S, base) { P.look = lerp(P.look, t < st.until ? clamp((S.nexi.x - P.x) / 160, -1, 1) : base, 0.08); }
  var castCON = { id: 'con', behind: true, keys: ['finance', 'sales', 'supply'], P: CON, act: function (P, t, S) {
    var st = S.cast.con, busy = ['finance', 'sales', 'supply', 'hr', 'services'].indexOf(S.hot) >= 0;
    if (tapped('con', st, t)) { var c = CATS[Math.floor(t * 7) % 3], j = Math.floor(t * 3) % c.apps.length, h = handAt(P, 0), d = iconXY(c, j); FX.push({ m: c.apps[j], x0: h[0], y0: h[1] - 20, x1: d[0] + 14, y1: d[1] + 14, arc: 70, t0: t + 0.4, dur: 1.4, grow: true, fx: 'star' }); PICK.c = c; PICK.t = t + 0.6; }
    P.tilt = 0; P.hop = 0; P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm';
    if (TAP.con && t - TAP.con < 2.2) { var u = (t - TAP.con) / 2.2; P.mood = 'happy'; P.talk = true; P.hands = [[-40, -380 - Math.sin(u * Math.PI) * 30], [80, -200]]; P.hop = Math.sin(u * Math.PI) * 10; P.look = 0.4; P.tilt = -0.06; return; }
    var cyc = t % 9, tgt = busy ? (S.hot === 'hr' || S.hot === 'finance' ? 0.2 : 0.9) : cyc < 3 ? 0.3 : cyc < 6 ? 0.9 : 0.6;
    if (busy || (cyc % 3) > 1.2) P.hands = [[-70, -210], [70 + tgt * 70, -330 - tgt * 40 + Math.sin(t * 3) * 6]]; else P.hands = [[-70, -214 + Math.sin(t * 6) * 3], [44, -226]];
    P.x = 236 + Math.sin(t * 0.35) * 10; lookAtNexi(P, st, t, S, tgt);
  } };
  var castPLN = { id: 'pln', behind: true, keys: ['hr', 'services'], P: PLN, act: function (P, t, S) {
    var st = S.cast.pln, busy = S.hot === 'hr' || S.hot === 'services'; if (tapped('pln', st, t)) CR.burst('spark', P.x, P.y - 280, t);
    P.cup = false; P.tilt = 0; P.hop = 0; P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm';
    if (TAP.pln && t - TAP.pln < 2.6) { var u = (t - TAP.pln) / 2.6; P.mood = 'happy'; P.talk = true; P.hands = u > 0.75 ? [[-60, -206], [110, -380 + Math.sin(t * 12) * 8]] : [[-60, -206], [70, -230]]; P.look = 0.6; return; }
    var sip = (t % 10) > 7.4 && !busy;
    if (sip) { var su = ((t % 10) - 7.4) / 2.6, up = Math.sin(su * Math.PI); P.cup = true; P.hands = [[-60, -206], [40 - up * 20, -210 - up * 120]]; P.tilt = -up * 0.06; lookAtNexi(P, st, t, S, 0); return; }
    var k2 = Math.abs(Math.sin(t * (busy ? 11 : 5))) * 6; P.hands = [[20, -206 - k2], [80, -206 - (6 - k2)]];
    lookAtNexi(P, st, t, S, (t % 7) > 5.5 ? -0.3 : 0.7); P.tilt = (t % 7) > 5.5 ? -0.08 : 0;
  } };
  var castKPR = { id: 'kpr', behind: true, keys: ['db'], P: KPR, act: function (P, t, S) {
    var st = S.cast.kpr, busy = S.hot === 'db'; if (tapped('kpr', st, t)) { SPIN.t = t; CR.burst('spark', WHEEL.x, WHEEL.y - 20, t); }
    P.tilt = 0; P.hop = 0; P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm';
    var spin = t - SPIN.t < 2.2, turning = spin || busy || (t % 8) < 4; KPR.turning = turning;
    var a = (WHEEL.a || 0), r = 70;
    if (turning) { P.hands = [[-108 + Math.cos(a) * r * 0.5, -170 + Math.sin(a) * r * 0.5], [-108 + Math.cos(a + Math.PI) * r * 0.5, -170 + Math.sin(a + Math.PI) * r * 0.5]]; P.look = -0.7; if (spin) { P.mood = 'happy'; P.hop = Math.abs(Math.sin(t * 9)) * 6; } }
    else { P.hands = [[-60, -170], [40, -330]]; P.tilt = 0.08; P.look = lerp(P.look, -0.9, 0.1); }
    if (!turning) return; lookAtNexi(P, st, t, S, -0.7);
  } };
  var castOWN = { id: 'own', behind: true, keys: ['db'], P: OWN, act: function (P, t, S) {
    var st = S.cast.own, busy = S.hot === 'db';
    if (tapped('own', st, t)) { var c = CATS[3 + Math.floor(t * 5) % 5], j = Math.floor(t * 3) % c.apps.length, d = iconXY(c, j), h = handAt(P, 0); FX.push({ m: c.apps[j], x0: d[0] + 14, y0: d[1] + 14, x1: h[0] + 30, y1: h[1] + 10, arc: 40, t0: t + 0.2, dur: 1.3, fx: 'heart' }); PICK.c = c; PICK.t = t; }
    P.tilt = 0; P.hop = 0; P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm';
    if (TAP.own && t - TAP.own < 2.2) { var u = (t - TAP.own) / 2.2; P.mood = u > 0.6 ? 'happy' : 'wow'; P.hands = [[-70, -150 + (u > 0.6 ? -30 : 0)], [100, -380 + Math.sin(t * 12) * 10]]; P.hop = u > 0.6 ? Math.abs(Math.sin(u * Math.PI * 4)) * 18 : 0; P.look = -0.5; return; }
    var cyc = t % 8, glance = cyc < 2.5 ? -0.8 : cyc < 5 ? 0.6 : -0.2;
    P.hands = cyc > 5 && cyc < 6.5 ? [[-70, -230], [70, -170]] : busy ? [[-70, -170], [-150, -320 + Math.sin(t * 3) * 8]] : [[-70, -170], [70, -170 + Math.sin(t * 2) * 4]];
    P.tilt = cyc < 5 ? -0.06 : 0; P.x = 820 + Math.sin(t * 0.3) * 8; lookAtNexi(P, st, t, S, glance);
  } };
  var castSTL = { id: 'stl', behind: true, keys: [], P: STL, act: function (P, t, S) { /* the kueh seller: wraps kueh, taps the card reader, fans herself, rings her bell, waves; tapped: a Point of Sale icon hops from her cart up into the Sales shop */
    var st = S.cast.stl; if (tapped('stl', st, t)) { var c = CATS[1], j = 2, d = iconXY(c, j); FX.push({ m: c.apps[j], x0: CART.x + CART.w - 20, y0: CART.y - 50, x1: d[0] + 14, y1: d[1] + 14, arc: 90, t0: t + 0.3, dur: 1.5, grow: true, fx: 'heart' }); PICK.c = c; PICK.t = t + 0.6; CR.burst('star', P.x, P.y - 230, t); }
    P.tilt = 0; P.hop = 0; P.sx = 1; P._fan = false; P.talk = t < st.until; P.mood = P.talk ? 'happy' : 'calm';
    if (TAP.stl && t - TAP.stl < 2.2) { var u = (t - TAP.stl) / 2.2; P.mood = 'happy'; P.talk = true; P.hands = [[-90, -330 + Math.sin(t * 12) * 10], [100, -360 - Math.sin(t * 12) * 10]]; P.hop = Math.abs(Math.sin(u * Math.PI * 3)) * 16; P.look = 0.8; return; }
    var c2 = (t + 3) % 10;
    if (c2 < 3) { var w2 = Math.sin(t * 5); P.hands = [[-30 + w2 * 10, -150], [30 - w2 * 10, -156]]; P.tilt = 0.06; lookAtNexi(P, st, t, S, 0.1); }
    else if (c2 < 4.4) { P.hands = [[-60, -140], [96, -168 + Math.abs(Math.sin(t * 9)) * -14]]; lookAtNexi(P, st, t, S, 0.8); if (c2 > 4.3 && !P._beep) { P._beep = 1; CR.burst('spark', CART.x + CART.w - 19, CART.y - 50, t); } }
    else if (c2 < 6.6) { P._beep = 0; P._fan = true; P.hands = [[-50, -300 + Math.sin(t * 14) * 8], [60, -140]]; P.tilt = -0.04; lookAtNexi(P, st, t, S, Math.sin(t * 0.9) * 0.8); }
    else if (c2 < 8) { P.hands = [[-60, -140], [70, -300 + Math.sin(t * 16) * 10]]; lookAtNexi(P, st, t, S, 0.4); if (c2 < 6.66 && !P._bell) { P._bell = 1; CR.burst('note', P.x + 40, P.y - 200, t); } }
    else { P._bell = 0; P.hands = [[-60, -140], [-110, -340 + Math.sin(t * 9) * 14]]; P.mood = 'happy'; lookAtNexi(P, st, t, S, -0.8); }
  } };
  function glowCat(k) { return function (g) { var c = CATS.filter(function (x) { return x.key === k; })[0]; rr(g, c.x - 9, c.y - 9, SH.w + 18, SH.h + 18, 14); }; }
  window.IXW.worlds['app-all'] = {
    pan: [-300, 1240],
    paintBg: paintBg, windowBehind: true, paintFrame: paintFrame, paintBack: paintBack, paintFront: paintFront, paintFore: paintFore,
    paintWindow: paintWindow, paintLive: paintLive, paintFrontLive: paintFrontLive,
    paintForeLive: function (g, t, S) { K.zfore(g, t, S, [[664, function () { drawTram(g, t, S); }]], function () { CO.crew(CREW, g, t, S, 'fore'); }); CR.draw(g, t); },
    motes: false,
    glow: { finance: glowCat('finance'), sales: glowCat('sales'), supply: glowCat('supply'), hr: glowCat('hr'), services: glowCat('services'), db: function (g) { rr(g, DB.x - DB.r - 16, DB.y - 30, DB.r * 2 + 32, F - DB.y + 34, 22); } },
    backGlow: ['finance', 'sales', 'supply', 'hr', 'services', 'db'],
    calmView: [150, -70, 860, 688],
    cast: [castCON, castPLN, castKPR, castOWN, castSTL],
    toy: function () {},
    hit: function (x, y, S, t, onBtn) {
      var w = CR.hitWalker(x, y, t); if (w) return w;
      var e = S.ext, tu = (t - TRAM.t0) % 30, tx = e.l - 350 + (tu / 18) * (e.r - e.l + 700);
      if (tu >= 0 && tu < 18 && Math.abs(x - tx) < 150 && y > 560 && y < 672) return { say: 'All aboard the **one database** line: the same customers, products and accounts for every shop.', near: [clamp(tx, 240, 900), 300], pose: 'wow', who: 'The database tram' };
      if (onBtn) return null;
      if (Math.abs(x - 900) < 40 && y > L3 + SH.h - 30 && y < L3 + SH.h + 4) { CAT.t = t; return { say: 'Even the street cat knows: **one database**, every shop.', near: [935, 190], pose: 'love', who: 'The shop cat' }; }
      var c = catAt(x, y); if (!c) return null; PICK.c = c; PICK.t = t; CR.burst('star', c.x + SH.w / 2, c.y, t);
      return { say: '**' + c.name + '**: ' + c.apps.length + ' apps, all on the same database.', near: c.i % 4 < 2 ? [935, 190] : [330, 186], pose: c.i % 4 < 2 ? 'point-left' : 'point-right', who: 'Odoo apps' };
    },
    onStop: function (key, S, t) { if (key === 'db') SPIN.t = t + 0.3; }
  };
})(window.IXW && window.IXW.kit, window.CR, window.CO);
