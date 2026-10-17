/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: integration (/odoo/integration) — step 3 of 4: connect what you keep, drawn as ODOO CENTRAL, a bright daytime railway
   station. Every system the client keeps runs on its own coloured line into one interchange, the client's Odoo: the network
   map on the wall (online store, marketplaces, payments, bank feeds, email and calendar, their own systems over the API) has
   little trains running each line both ways; a monorail carries the cargo over the hall, an express docks at the back
   platform and departs across the station, a freight train crosses the front track with orders, stock and payouts.
   The TechNext crew: the signal-desk engineer (seated, chair, legs and feet) keeps the sync log, the dispatcher waves the
   trains off with a green flag, the connector engineer paces with a new plug. Tap the signal lever and a line drops: the
   signal turns red, the line retries with backoff, then recovers and nothing is booked twice. Tap anyone, any line, the
   lever or the trains. Everyone from TechNext wears a TechNext ID; the visitor wears a grey pass. */
(function (K, CR, CO) {
  'use strict';
  if (!K || !CR || !CO) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed;
  var F = 470, CEIL = -150, TEAL = '#14A38B', TEALD = '#0E7A68', TEALL = '#E2F5F0', NAVY = '#1B2A4A', PUR = '#714B67', AMBER = '#F2B233', RED = '#E2453C', GO = '#2BC48A';
  var WALL = { x: 290, y: -112, w: 700, h: 300 }, HUB = { x: 565, y: -20, w: 150, h: 120 };
  var SYS = [
    { key: 'store', n: 1, name: 'Online store', sub: 'Shopify · WooCommerce', col: '#7DAE38', x: 312, y: -92, ev: 'Web order became a sales order', cargo: 'ORDERS' },
    { key: 'market', n: 2, name: 'Marketplaces', sub: 'orders in, stock out', col: '#F08A24', x: 312, y: 0, ev: 'Stock level synced to the store', cargo: 'STOCK' },
    { key: 'pay', n: 3, name: 'Payments', sub: 'gateway payouts', col: '#635BFF', x: 312, y: 92, ev: 'Gateway payout matched in Accounting', cargo: 'PAYOUTS' },
    { key: 'bank', n: 4, name: 'Bank feeds', sub: 'statement lines', col: '#3167CA', x: 830, y: -92, ev: 'Bank statement imported and matched', cargo: 'STATEMENTS' },
    { key: 'mail', n: 5, name: 'Email & calendar', sub: 'meetings, threads', col: '#E0456B', x: 830, y: 0, ev: 'Customer email logged on the order', cargo: 'EMAILS' },
    { key: 'api', n: 6, name: 'Your systems', sub: 'over the Odoo API', col: '#1B2A4A', x: 830, y: 92, ev: 'Legacy WMS synced over the API', cargo: 'API CALLS' }];
  var T = { desk: { x: 360, y: 392, w: 260 }, mon: { x: 400, y: 298, w: 142, h: 84 }, lever: { x: 780, y: 470 }, clock: { x: 222, y: -36, r: 32 }, dock: 958 };

  /* ---------------- helpers ---------------- */
  function setU(g, sx, sy, k) { g.translate(sx, sy); g.scale(k, k); }
  function extOf(W, H, k, sx, sy) { return { l: -(sx + 24) / k, r: (W - sx) / k, t: -(sy + 24) / k, b: (H - sy) / k }; }
  function ease(u) { return u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2; }
  /* each line on the map: out of its station box, along, one 45-degree run, into the interchange */
  SYS.forEach(function (s, i) {
    var left = s.x < HUB.x, px = left ? s.x + 148 : s.x, py = s.y + 26, hx = left ? HUB.x : HUB.x + HUB.w, hy = HUB.y + 30 + (i % 3) * 30, d = left ? 1 : -1;
    var run = (Math.abs(hx - px) - Math.abs(hy - py)) / 2;
    s.pts = [[px, py], [px + d * run, py], [hx - d * run, hy], [hx, hy]]; s.seg = []; s.len = 0;
    for (var j = 1; j < 4; j++) { var L = Math.hypot(s.pts[j][0] - s.pts[j - 1][0], s.pts[j][1] - s.pts[j - 1][1]); s.seg.push(L); s.len += L; }
    s.hx = hx; s.hy = hy; s.left = left;
  });
  function along(s, f) { /* a point (and heading) at fraction f of the line, 0 = the station, 1 = the interchange */
    var dist = clamp(f, 0, 1) * s.len;
    for (var j = 0; j < 3; j++) { var L = s.seg[j]; if (dist <= L || j === 2) { var a = s.pts[j], b = s.pts[j + 1], q = L ? clamp(dist / L, 0, 1) : 0; return [lerp(a[0], b[0], q), lerp(a[1], b[1], q), Math.atan2(b[1] - a[1], b[0] - a[0])]; } dist -= L; }
  }
  function line(g, s, col, w, dash) { g.strokeStyle = col; g.lineWidth = w; g.lineCap = 'round'; g.lineJoin = 'round'; if (dash) g.setLineDash(dash);
    g.beginPath(); s.pts.forEach(function (p, j) { if (j) g.lineTo(p[0], p[1]); else g.moveTo(p[0], p[1]); }); g.stroke(); if (dash) g.setLineDash([]); }
  /* where a cast member's hand is, in set units (props held in a hand are drawn over the figure) */
  function handAt(P, i) { var h = P.hands[i], s = P.s, kx = P.sx == null ? 1 : P.sx, drop = P.sit ? (P.sitDrop != null ? P.sitDrop : 46) : 0; return [P.x + h[0] * s * kx, P.y + (h[1] + drop - (P.hop || 0)) * s]; }
  function icon(g, key, cx, cy, col) { /* a line's white glyph */
    g.fillStyle = '#FFFFFF'; g.strokeStyle = '#FFFFFF'; g.lineCap = 'round'; g.lineJoin = 'round';
    if (key === 'store') { g.lineWidth = 1.8; g.beginPath(); g.moveTo(cx - 8, cy - 6); g.lineTo(cx - 5, cy - 6); g.lineTo(cx - 3, cy + 3); g.lineTo(cx + 7, cy + 3); g.lineTo(cx + 8, cy - 3); g.lineTo(cx - 4, cy - 3); g.stroke(); fillE(g, cx - 2, cy + 6.5, 1.8, 1.8, '#FFFFFF'); fillE(g, cx + 6, cy + 6.5, 1.8, 1.8, '#FFFFFF'); }
    else if (key === 'market') { fillRR(g, cx - 8, cy - 4, 16, 11, 2, '#FFFFFF'); g.lineWidth = 1.8; g.beginPath(); g.arc(cx, cy - 4, 4.5, Math.PI, 0); g.stroke(); g.fillStyle = col; g.fillRect(cx - 1, cy - 1, 2, 5); }
    else if (key === 'pay') { fillRR(g, cx - 9, cy - 6, 18, 12, 2, '#FFFFFF'); g.fillStyle = col; g.fillRect(cx - 9, cy - 3, 18, 3); g.fillRect(cx + 2, cy + 2, 5, 2); }
    else if (key === 'bank') { g.beginPath(); g.moveTo(cx - 10, cy - 2); g.lineTo(cx, cy - 9); g.lineTo(cx + 10, cy - 2); g.fill(); for (var c2 = -1; c2 <= 1; c2++) g.fillRect(cx + c2 * 6 - 1.5, cy, 3, 6); g.fillRect(cx - 10, cy + 7, 20, 2); }
    else if (key === 'mail') { fillRR(g, cx - 9, cy - 6, 18, 12, 2, '#FFFFFF'); g.strokeStyle = col; g.lineWidth = 1.6; g.beginPath(); g.moveTo(cx - 8, cy - 5); g.lineTo(cx, cy + 1); g.lineTo(cx + 8, cy - 5); g.stroke(); }
    else { g.lineWidth = 2; g.beginPath(); g.moveTo(cx - 4, cy - 6); g.lineTo(cx - 9, cy); g.lineTo(cx - 4, cy + 6); g.moveTo(cx + 4, cy - 6); g.lineTo(cx + 9, cy); g.lineTo(cx + 4, cy + 6); g.stroke(); }
  }
  /* the front track sits a little above the bottom of the hero, whatever its height */
  var GT = null; /* the top of the glance strip in set units (measured on resize), so the front track never runs under it */
  function measureGT() { var set = document.querySelector('.ixw--integration [data-ixw-set]'), st = document.querySelector('.ixw--integration .ixw-credits');
    if (!set || !st) return null; var r = set.getBoundingClientRect(), c = st.getBoundingClientRect(), k = r.width / 1000; if (!k || c.top <= r.top) return null; return (c.top - r.top) / k; }
  function track(e) { var r2 = clamp(GT != null ? Math.min(GT - 6, e.b - 16) : e.b - 16, 700, 770); return { edge: r2 - 64, r1: r2 - 34, r2: r2 }; }

  /* ---------------- static layers ---------------- */
  function paintBg(g, W, H, k, sx, sy) { /* the sky and the city beyond the glass hall */
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    CO.sky(g, e, e.t, 304, [[0, '#7CC2F2'], [0.55, '#BFE4FA'], [1, '#EEF8FF']]);
    var sg = g.createRadialGradient(1060, -60, 10, 1060, -60, 260); sg.addColorStop(0, 'rgba(255,246,205,.85)'); sg.addColorStop(1, 'rgba(255,246,205,0)'); g.fillStyle = sg; g.fillRect(800, -320, 520, 520);
    CO.skySG(g, e.l, e.r, 238, 300, { hazy: 'rgba(170,200,230,.55)', near: ['#BCD3EC', '#AEC7E5'], lit: 'rgba(255,255,255,.6)', icon: '#A3BCDF', water: 'rgba(140,190,225,.45)', mbs: 1090, wheel: -330, park: '#93AED8' });
    /* the city line on its viaduct, far away */
    g.fillStyle = '#C9D9EA'; g.fillRect(e.l, 280, e.r - e.l, 5); for (var px = Math.floor(e.l / 60) * 60; px < e.r; px += 60) g.fillRect(px, 285, 5, 15);
    g.restore();
  }
  function paintFrame(g, W, H, k, sx, sy) { /* the glass hall: mullions, the roof truss, the tiled platform wall, the platform and the front track */
    GT = measureGT(); g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy), x, y;
    CO.glass(g, e, CEIL, 304, 118, '#FFFFFF', 64); g.fillStyle = '#FFFFFF'; g.fillRect(e.l, 186, e.r - e.l, 4);
    /* the roof: glass vaults on white arched ribs, a lattice truss along the eaves */
    g.fillStyle = 'rgba(255,255,255,.22)'; g.fillRect(e.l, e.t, e.r - e.l, CEIL - e.t);
    for (x = Math.floor(e.l / 560) * 560; x < e.r; x += 560) {
      g.strokeStyle = 'rgba(255,255,255,.9)'; g.lineWidth = 9; g.beginPath(); g.ellipse(x + 280, CEIL, 280, 170, 0, Math.PI, 0); g.stroke();
      g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 3; for (var rb = 1; rb < 6; rb++) { var ra = Math.PI + rb * Math.PI / 6; g.beginPath(); g.moveTo(x + 280 + Math.cos(ra) * 280, CEIL + Math.sin(ra) * 170); g.lineTo(x + 280, CEIL); g.stroke(); }
      g.beginPath(); g.ellipse(x + 280, CEIL, 200, 116, 0, Math.PI, 0); g.stroke(); }
    g.strokeStyle = '#FFFFFF'; g.lineWidth = 3; g.beginPath();
    for (x = Math.floor(e.l / 44) * 44; x < e.r; x += 44) { g.moveTo(x, CEIL); g.lineTo(x + 22, CEIL - 22); g.lineTo(x + 44, CEIL); }
    g.stroke(); g.fillStyle = '#FFFFFF'; g.fillRect(e.l, CEIL - 25, e.r - e.l, 4); g.fillRect(e.l, CEIL - 6, e.r - e.l, 12); g.fillStyle = 'rgba(30,70,90,.10)'; g.fillRect(e.l, CEIL + 6, e.r - e.l, 3);
    /* the platform wall: white tiles, a teal band, the recess of the back track */
    g.fillStyle = '#F4F8F6'; g.fillRect(e.l, 304, e.r - e.l, F - 304);
    g.strokeStyle = 'rgba(20,110,100,.07)'; g.lineWidth = 1.2; g.beginPath(); for (y = 318; y < 440; y += 14) { g.moveTo(e.l, y); g.lineTo(e.r, y); } for (y = 318; y < 440; y += 14) for (x = Math.floor(e.l / 28) * 28 + ((y / 14) % 2 ? 14 : 0); x < e.r; x += 28) { g.moveTo(x, y); g.lineTo(x, y + 14); } g.stroke();
    fillRR(g, e.l, 300, e.r - e.l, 9, 0, '#FFFFFF'); g.fillStyle = 'rgba(30,70,90,.10)'; g.fillRect(e.l, 309, e.r - e.l, 3);
    g.fillStyle = TEAL; g.fillRect(e.l, 330, e.r - e.l, 9); g.fillStyle = NAVY; g.fillRect(e.l, 339, e.r - e.l, 3);
    g.fillStyle = '#DCE3E1'; g.fillRect(e.l, 440, e.r - e.l, F - 440); g.fillStyle = '#9AA5A8'; g.fillRect(e.l, 461, e.r - e.l, 4); g.fillStyle = 'rgba(20,40,50,.12)'; g.fillRect(e.l, 440, e.r - e.l, 4);
    /* the platform: warm stone, the yellow line, the edge, then the front track */
    var tk = track(e), fg = g.createLinearGradient(0, F, 0, tk.edge); fg.addColorStop(0, '#F1EDE5'); fg.addColorStop(1, '#E4DDD0'); g.fillStyle = fg; g.fillRect(e.l, F, e.r - e.l, tk.edge - F);
    g.fillStyle = '#FFFFFF'; g.fillRect(e.l, F, e.r - e.l, 6);
    g.strokeStyle = 'rgba(120,100,70,.10)'; g.lineWidth = 1.5; g.beginPath(); for (y = F + 30; y < tk.edge - 20; y += 34) { g.moveTo(e.l, y); g.lineTo(e.r, y); } for (x = Math.floor(e.l / 90) * 90; x < e.r; x += 90) { g.moveTo(x, F + 6); g.lineTo(x + (x - 560) * 0.12, tk.edge - 18); } g.stroke();
    /* the six line colours painted along the platform, a roundel every 520 */
    SYS.forEach(function (s2, i2) { g.fillStyle = s2.col; g.globalAlpha = 0.42; g.fillRect(e.l, 488 + i2 * 4.6, e.r - e.l, 3); }); g.globalAlpha = 1;
    for (x = Math.floor(e.l / 520) * 520 + 110; x < e.r; x += 520) { fillE(g, x, 501, 17, 17, '#FFFFFF'); g.strokeStyle = PUR; g.lineWidth = 3.4; g.beginPath(); g.arc(x, 501, 14, 0, 7); g.stroke(); text(g, 'O', x, 505.5, 12, 800, PUR, 'center'); }
    /* wayfinding painted on the platform: arrows and the station name */
    for (x = Math.floor(e.l / 520) * 520; x < e.r; x += 520) { var py = F + 74; g.fillStyle = 'rgba(20,163,139,.16)'; fillRR(g, x + 160, py - 16, 210, 32, 16, 'rgba(20,163,139,.14)');
      text(g, 'ODOO CENTRAL · LINES 1–6', x + 265, py + 5, 11, 800, 'rgba(14,122,104,.62)', 'center');
      for (var ar = 0; ar < 3; ar++) { g.fillStyle = 'rgba(27,42,74,.14)'; g.beginPath(); g.moveTo(x + 400 + ar * 34, py - 12); g.lineTo(x + 422 + ar * 34, py); g.lineTo(x + 400 + ar * 34, py + 12); g.lineTo(x + 410 + ar * 34, py); g.closePath(); g.fill(); } }
    g.fillStyle = '#F2C230'; g.fillRect(e.l, tk.edge - 18, e.r - e.l, 12); g.fillStyle = 'rgba(160,110,10,.35)'; for (x = Math.floor(e.l / 8) * 8; x < e.r; x += 8) g.fillRect(x + 2, tk.edge - 14, 3, 3), g.fillRect(x + 6, tk.edge - 10, 3, 3);
    g.fillStyle = '#FFFFFF'; g.fillRect(e.l, tk.edge - 6, e.r - e.l, 8); g.fillStyle = 'rgba(40,40,30,.22)'; g.fillRect(e.l, tk.edge + 2, e.r - e.l, 5);
    g.fillStyle = '#D3CBBC'; g.fillRect(e.l, tk.edge + 7, e.r - e.l, e.b - tk.edge);
    g.fillStyle = 'rgba(110,95,70,.22)'; for (var i = 0; i < 900; i++) { var bx = e.l + hash(i * 1.7) * (e.r - e.l), by = tk.edge + 10 + hash(i * 3.1) * (e.b - tk.edge - 8); g.fillRect(bx, by, 2.2, 1.6); }
    for (x = Math.floor(e.l / 34) * 34; x < e.r; x += 34) fillRR(g, x, tk.r1 - 6, 20, tk.r2 - tk.r1 + 12, 2, '#B4A895');
    [tk.r1, tk.r2].forEach(function (ry) { g.fillStyle = '#7D8893'; g.fillRect(e.l, ry - 3, e.r - e.l, 6); g.fillStyle = '#DCE2E8'; g.fillRect(e.l, ry - 3, e.r - e.l, 1.6); });
    g.restore();
  }
  function station(g, s) { /* a station box on the network map */
    shadowed(g, 7, 2, 0.13, function () { fillRR(g, s.x, s.y, 148, 52, 10, '#FFFFFF'); }); fillRR(g, s.x, s.y, 7, 52, 3.5, s.col);
    fillE(g, s.x + 30, s.y + 26, 15, 15, s.col); g.strokeStyle = '#FFFFFF'; g.lineWidth = 2.5; g.beginPath(); g.arc(s.x + 30, s.y + 26, 12.5, 0, 7); g.stroke(); icon(g, s.key, s.x + 30, s.y + 26, s.col);
    text(g, s.name, s.x + 52, s.y + 24, 9.5, 800, '#1B1F3B'); text(g, s.sub, s.x + 52, s.y + 37, 7, 700, '#8A96A8');
    fillRR(g, s.x + 124, s.y + 6, 18, 12, 6, s.col); text(g, 'L' + s.n, s.x + 133, s.y + 15, 7, 800, '#FFFFFF', 'center');
  }
  function cardEdge() { /* where the title card's left edge sits in set units (null when the card is not beside the set, on phones) */
    var set = document.querySelector('.ixw--integration [data-ixw-set]'), card = document.querySelector('.ixw--integration .ixw-copy');
    if (!set || !card) return null; var r = set.getBoundingClientRect(), c = card.getBoundingClientRect(), k = r.width / 1000;
    if (!k || c.bottom < r.top + 20 || c.top > r.bottom) return null; return (c.left - r.left) / k;
  }
  function paintBack(g, ext) {
    /* the passers-by on the left walk only where they are clear of the title card */
    CREW.forEach(function (w) { if (w.left) return; if (w.x1b == null) w.x1b = w.x1; w.x1 = Math.min(w.x1b, ext.r - 150); });
    concourse(g);
    /* the monorail beam over the hall */
    g.fillStyle = '#FFFFFF'; for (var hx = Math.floor(ext.l / 150) * 150; hx < ext.r; hx += 150) g.fillRect(hx, CEIL, 3, 18);
    fillRR(g, ext.l, -132, ext.r - ext.l, 9, 0, '#C9D4DC'); g.fillStyle = '#E8EEF2'; g.fillRect(ext.l, -132, ext.r - ext.l, 2);
    /* the network map */
    shadowed(g, 18, 6, 0.16, function () { fillRR(g, WALL.x, WALL.y, WALL.w, WALL.h, 14, '#FFFFFF'); });
    g.save(); rr(g, WALL.x, WALL.y, WALL.w, WALL.h, 14); g.clip();
    g.strokeStyle = 'rgba(27,42,74,.045)'; g.lineWidth = 1; g.beginPath(); for (var gx = WALL.x + 20; gx < WALL.x + WALL.w; gx += 20) { g.moveTo(gx, WALL.y); g.lineTo(gx, WALL.y + WALL.h); } for (var gy = WALL.y + 20; gy < WALL.y + WALL.h; gy += 20) { g.moveTo(WALL.x, gy); g.lineTo(WALL.x + WALL.w, gy); } g.stroke();
    g.strokeStyle = 'rgba(143,201,240,.38)'; g.lineWidth = 22; g.lineCap = 'round'; g.beginPath(); g.moveTo(WALL.x - 20, 150); g.bezierCurveTo(470, 120, 560, 190, 660, 150); g.bezierCurveTo(780, 104, 880, 168, WALL.x + WALL.w + 20, 120); g.stroke();
    fillRR(g, WALL.x, WALL.y, WALL.w, 18, 0, NAVY); text(g, 'INTEGRATION NETWORK · EVERY LINE RUNS TO YOUR ODOO', WALL.x + 14, WALL.y + 12.5, 7.6, 800, '#FFFFFF'); text(g, 'sample map', WALL.x + WALL.w - 12, WALL.y + 12.5, 6.6, 700, '#9FB6D8', 'right');
    g.restore();
    /* the fare zone round the interchange */
    g.setLineDash([5, 6]); g.strokeStyle = 'rgba(113,75,103,.35)'; g.lineWidth = 1.6; g.beginPath(); g.ellipse(HUB.x + HUB.w / 2, HUB.y + HUB.h / 2, 112, 92, 0, 0, Math.PI * 2); g.stroke(); g.setLineDash([]);
    text(g, 'ZONE 1 · ONE DATABASE', HUB.x + HUB.w / 2, HUB.y + HUB.h + 44, 6.6, 800, '#A07A97', 'center');
    /* the lines, white casing then colour, a station tick halfway */
    SYS.forEach(function (s) { line(g, s, '#FFFFFF', 11); line(g, s, s.col, 6); var m = along(s, 0.5); fillE(g, m[0], m[1], 5, 5, '#FFFFFF'); g.strokeStyle = NAVY; g.lineWidth = 2; g.beginPath(); g.arc(m[0], m[1], 5, 0, 7); g.stroke(); });
    SYS.forEach(function (s) { station(g, s); });
    /* the interchange: your Odoo */
    shadowed(g, 16, 6, 0.24, function () { fillRR(g, HUB.x - 4, HUB.y - 4, HUB.w + 8, HUB.h + 8, 20, '#FFFFFF'); }); fillRR(g, HUB.x, HUB.y, HUB.w, HUB.h, 16, PUR);
    g.fillStyle = 'rgba(255,255,255,.08)'; g.beginPath(); g.moveTo(HUB.x, HUB.y + 60); g.lineTo(HUB.x + HUB.w, HUB.y + 20); g.lineTo(HUB.x + HUB.w, HUB.y); g.lineTo(HUB.x, HUB.y); g.closePath(); g.fill();
    text(g, 'ODOO CENTRAL', HUB.x + HUB.w / 2, HUB.y + 17, 6.8, 800, '#E6D3E2', 'center'); text(g, 'Your Odoo', HUB.x + HUB.w / 2, HUB.y + 38, 15, 800, '#FFFFFF', 'center'); text(g, 'one database', HUB.x + HUB.w / 2, HUB.y + 52, 8, 700, '#E6D3E2', 'center');
    [['#E46E78', 'S', 'Sales'], ['#F2A33A', 'I', 'Inventory'], ['#2E9C7E', 'A', 'Accounting']].forEach(function (a, i) { var ax = HUB.x + 20 + i * 40; fillRR(g, ax, HUB.y + 64, 30, 30, 8, a[0]); text(g, a[1], ax + 15, HUB.y + 84, 12, 800, '#FFFFFF', 'center'); text(g, a[2], ax + 15, HUB.y + 107, 5.6, 800, '#E6D3E2', 'center'); });
    /* the legend */
    var lx = WALL.x + 196, ly = WALL.y + WALL.h - 16;
    fillE(g, lx, ly - 3, 4, 4, NAVY); text(g, 'webhook: pushed in seconds', lx + 8, ly, 6.6, 700, '#5C6378');
    g.strokeStyle = NAVY; g.lineWidth = 1.5; g.beginPath(); g.arc(lx + 120, ly - 3, 4, 0, 7); g.stroke(); text(g, 'scheduled job: batches', lx + 128, ly, 6.6, 700, '#5C6378');
    text(g, '↻', lx + 222, ly + 1, 9, 800, RED); text(g, 'retry with backoff', lx + 232, ly, 6.6, 700, '#5C6378');
    /* the gap by the title card: the hanging station clock, a platform sign */
    var c = T.clock; g.fillStyle = '#B9C4CE'; g.fillRect(c.x - 1.5, CEIL, 3, c.y - c.r - CEIL);
    shadowed(g, 10, 4, 0.18, function () { fillE(g, c.x, c.y, c.r + 6, c.r + 6, NAVY); }); fillE(g, c.x, c.y, c.r, c.r, '#FFFFFF');
    for (var tk = 0; tk < 12; tk++) { var a = tk * Math.PI / 6; g.fillStyle = tk % 3 ? '#9AA6BC' : NAVY; g.beginPath(); g.arc(c.x + Math.cos(a) * (c.r - 5), c.y + Math.sin(a) * (c.r - 5), tk % 3 ? 1.3 : 2.4, 0, 7); g.fill(); }
    text(g, 'SGT', c.x, c.y + 14, 6, 800, TEAL, 'center');
    g.fillStyle = '#B9C4CE'; g.fillRect(c.x - 40, c.y + c.r + 6, 2, 22); g.fillRect(c.x + 38, c.y + c.r + 6, 2, 22);
    shadowed(g, 6, 2, 0.16, function () { fillRR(g, c.x - 58, c.y + c.r + 26, 116, 30, 7, NAVY); });
    fillE(g, c.x - 42, c.y + c.r + 41, 9, 9, TEAL); text(g, '1–6', c.x - 42, c.y + c.r + 43.5, 6.4, 800, '#FFFFFF', 'center');
    text(g, 'All platforms', c.x - 28, c.y + c.r + 39, 7.4, 800, '#FFFFFF'); text(g, 'to Odoo Central →', c.x - 28, c.y + c.r + 49, 6.4, 700, '#A9C9F0');
    /* the left wall: the station name board, a way-out sign, the arrivals board */
    var nx = -560;
    g.fillStyle = '#B9C4CE'; g.fillRect(nx - 50, CEIL, 3, 56); g.fillRect(nx + 48, CEIL, 3, 56);
    shadowed(g, 12, 5, 0.2, function () { fillRR(g, nx - 76, -96, 152, 52, 12, NAVY); });
    fillE(g, nx - 50, -70, 17, 17, PUR); fillRR(g, nx - 59, -76, 18, 11, 3, '#FFFFFF'); fillE(g, nx - 55, -63, 2.2, 2.2, '#FFFFFF'); fillE(g, nx - 45, -63, 2.2, 2.2, '#FFFFFF'); g.fillStyle = PUR; g.fillRect(nx - 57, -74, 14, 4);
    text(g, 'ODOO', nx - 26, -73, 13, 800, '#FFFFFF'); text(g, 'CENTRAL', nx - 26, -57, 11, 800, '#7FE3C9');
    shadowed(g, 6, 2, 0.14, function () { fillRR(g, nx - 76, 40, 152, 26, 6, '#FFC94A'); }); text(g, 'Way out ↖   ·   Lines 1–6 ↘', nx, 57, 7.6, 800, NAVY, 'center');
    shadowed(g, 12, 5, 0.2, function () { fillRR(g, nx - 76, 150, 152, 118, 10, '#22324F'); }); fillRR(g, nx - 70, 156, 140, 106, 6, '#16233B');
    text(g, 'ARRIVING · ODOO CENTRAL', nx - 62, 170, 6.6, 800, '#FFC94A'); text(g, 'sample', nx + 62, 170, 5.6, 700, '#7F8DA6', 'right');
    /* far left: the line map poster */
    var px = -900; shadowed(g, 10, 4, 0.16, function () { fillRR(g, px, -40, 200, 150, 10, '#FFFFFF'); }); fillRR(g, px, -40, 200, 20, 10, TEAL); g.fillRect(px, -28, 200, 8); text(g, 'LINES TO YOUR ODOO', px + 100, -26, 7.2, 800, '#FFFFFF', 'center');
    SYS.forEach(function (s, i) { var yy = -6 + i * 18; g.strokeStyle = s.col; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.moveTo(px + 16, yy); g.lineTo(px + 120, yy); g.lineTo(px + 150, 50); g.stroke(); text(g, s.name, px + 16, yy - 4, 6, 800, '#5C6378'); });
    fillE(g, px + 160, 50, 14, 14, PUR); text(g, 'O', px + 160, 54, 11, 800, '#FFFFFF', 'center');
    /* the right platform: its hanging sign */
    var sx2 = 1000; g.fillStyle = '#B9C4CE'; g.fillRect(sx2 + 12, -123, 2, 249); g.fillRect(sx2 + 94, -123, 2, 249);
    shadowed(g, 8, 3, 0.18, function () { fillRR(g, sx2, 126, 106, 42, 8, NAVY); }); fillE(g, sx2 + 20, 147, 12, 12, TEAL); text(g, '6', sx2 + 20, 151, 11, 800, '#FFFFFF', 'center');
    text(g, 'Platform 6', sx2 + 37, 144, 8.6, 800, '#FFFFFF'); text(g, 'Express · L6', sx2 + 37, 157, 7, 700, '#A9C9F0');
  }
  /* ---------------- the concourse behind the title card ---------------- */
  var BOARD = { x: -440, y: -66, w: 380, h: 186 }, DEP = [['L1', 'Online store', 'Sales', '1'], ['L2', 'Marketplaces', 'Inventory', '2'], ['L3', 'Payments', 'Accounting', '3'], ['L4', 'Bank feeds', 'Accounting', '4'], ['L5', 'Email & calendar', 'CRM', '5'], ['L6', 'Your systems', 'Odoo API', '6']];
  function concourse(g) {
    /* the departures board, hung from the roof on two rods */
    var b = BOARD; g.fillStyle = '#B9C4CE'; g.fillRect(b.x + 60, CEIL, 3, b.y - CEIL); g.fillRect(b.x + b.w - 63, CEIL, 3, b.y - CEIL);
    shadowed(g, 16, 6, 0.22, function () { fillRR(g, b.x - 6, b.y - 6, b.w + 12, b.h + 12, 14, '#22324F'); });
    fillRR(g, b.x, b.y, b.w, b.h, 10, '#16233B'); fillRR(g, b.x, b.y, b.w, 26, 10, NAVY); g.fillStyle = NAVY; g.fillRect(b.x, b.y + 14, b.w, 12);
    fillE(g, b.x + 16, b.y + 13, 7, 7, TEAL); text(g, '→', b.x + 16, b.y + 16.5, 8, 800, '#FFFFFF', 'center');
    text(g, 'DEPARTURES · TO YOUR ODOO', b.x + 30, b.y + 17, 9, 800, '#FFFFFF'); text(g, 'sample', b.x + b.w - 66, b.y + 17, 6.6, 700, '#7F8DA6', 'right');
    var hy = b.y + 40; [['LINE', 12], ['FROM', 50], ['TO', 168], ['PLAT', 248], ['STATUS', 290]].forEach(function (c) { text(g, c[0], b.x + c[1], hy, 6.4, 800, '#7F8DA6'); });
    g.fillStyle = 'rgba(255,255,255,.08)'; g.fillRect(b.x + 8, hy + 5, b.w - 16, 1.5);
    DEP.forEach(function (r, i) { var y = b.y + 62 + i * 21, sc = SYS[i];
      if (i % 2) { g.fillStyle = 'rgba(255,255,255,.035)'; g.fillRect(b.x + 6, y - 13, b.w - 12, 21); }
      fillRR(g, b.x + 10, y - 9, 26, 13, 6.5, sc.col); text(g, r[0], b.x + 23, y + 0.5, 7, 800, '#FFFFFF', 'center');
      text(g, r[1], b.x + 50, y, 8.4, 800, '#E7EEF8'); text(g, '→ ' + r[2], b.x + 168, y, 8.4, 700, '#BFD3F0');
      fillRR(g, b.x + 250, y - 10, 18, 14, 3, '#22324F'); text(g, r[3], b.x + 259, y + 0.5, 8, 800, '#FFC94A', 'center'); });
    /* lightbox posters hung from the glass transom */
    [[-430, TEAL, 'CONNECT', 'what you keep', 0], [-290, PUR, 'STANDARD', 'connectors first', 1], [-150, NAVY, 'BOOKED', 'once, never twice', 2]].forEach(function (pp) {
      var x = pp[0], y = 198; g.fillStyle = '#9AA6BC'; g.fillRect(x + 20, 188, 3, 12); g.fillRect(x + 95, 188, 3, 12); shadowed(g, 8, 3, 0.16, function () { fillRR(g, x, y, 118, 82, 8, '#C9D4DC'); }); fillRR(g, x + 5, y + 5, 108, 72, 5, pp[1]);
      g.fillStyle = 'rgba(255,255,255,.12)'; g.beginPath(); g.moveTo(x + 5, y + 50); g.lineTo(x + 113, y + 18); g.lineTo(x + 113, y + 5); g.lineTo(x + 5, y + 5); g.closePath(); g.fill();
      text(g, pp[2], x + 14, y + 26, 11, 800, '#FFFFFF'); text(g, pp[3], x + 14, y + 39, 7.6, 700, 'rgba(255,255,255,.85)');
      if (pp[4] === 0) SYS.forEach(function (s2, i2) { g.strokeStyle = s2.col; g.lineWidth = 2.4; g.beginPath(); g.moveTo(x + 14, y + 50 + i2 * 3.4); g.lineTo(x + 84, y + 50 + i2 * 3.4); g.lineTo(x + 96, y + 58); g.stroke(); });
      if (pp[4] === 0) { fillE(g, x + 99, y + 58, 6, 6, '#FFFFFF'); }
      if (pp[4] === 1) { fillRR(g, x + 14, y + 50, 38, 18, 4, '#FFFFFF'); g.fillStyle = PUR; g.fillRect(x + 20, y + 54, 3, 10); g.fillRect(x + 27, y + 54, 3, 10); g.strokeStyle = '#FFFFFF'; g.lineWidth = 3; g.beginPath(); g.moveTo(x + 52, y + 59); g.bezierCurveTo(x + 70, y + 59, x + 70, y + 66, x + 100, y + 64); g.stroke(); }
      if (pp[4] === 2) { g.strokeStyle = '#7FE3C9'; g.lineWidth = 3; rr(g, x + 14, y + 48, 62, 20, 5); g.stroke(); text(g, 'SYNCED ✓', x + 45, y + 61.5, 7.6, 800, '#7FE3C9', 'center'); }
      });
  }
  var FLAP = { row: -1, t: 0 };
  function boardLive(g, t) { /* the status column: on time / boarding / departed, a row flaps over now and then, the SGT clock */
    var b = BOARD, d = new Date(Date.now() + 8 * 3600e3), hh = d.getUTCHours(), mm = d.getUTCMinutes();
    text(g, (hh < 10 ? '0' : '') + hh + ':' + (mm < 10 ? '0' : '') + mm + ' SGT', b.x + b.w - 12, b.y + 17, 7.6, 800, '#FFC94A', 'right');
    var cyc = Math.floor(t / 3.2), row = cyc % 6, fu = (t % 3.2) / 3.2;
    DEP.forEach(function (r, i) { var y = b.y + 62 + i * 21, st = i === row ? (fu < 0.5 ? 'Boarding' : 'Departed ✓') : (i === (row + 5) % 6 ? 'Arrived ✓' : 'On time'),
        col = st === 'Boarding' ? ((t * 2.4) % 1 < 0.6 ? '#FFC94A' : '#8A7030') : st === 'On time' ? '#7FE3C9' : '#B8F5DE';
      fillRR(g, b.x + 286, y - 10, 84, 14, 3, '#0F1A2E');
      var flap = i === row && fu > 0.5 && fu < 0.58 ? (fu - 0.5) / 0.08 : 0;
      if (flap) { g.save(); g.translate(0, y - 3); g.scale(1, Math.abs(Math.cos(flap * Math.PI))); g.translate(0, -(y - 3)); }
      text(g, st, b.x + 292, y + 0.5, 8, 800, col); if (flap) g.restore();
      g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(b.x + 286, y - 3.5, 84, 1); });
  }
  function bench(g, x, y, w, col) { fillRR(g, x, y - 46, w, 10, 4, col); fillRR(g, x, y - 32, w, 9, 4, col); g.fillStyle = '#7A869C'; g.fillRect(x + 10, y - 23, 5, 23); g.fillRect(x + w - 15, y - 23, 5, 23); soft(g, x + w / 2, y + 2, w * 0.6, 6, 0.2); }
  function paintFront(g, ext) {
    /* the signal desk: open legs, the monitor on its arm beside the engineer, the keyboard, a sign */
    var d = T.desk, m = T.mon; CO.desk(g, d.x, d.y, d.w, F, { open: true, legs: '#9AA6BC', top: '#E9EEF6' });
    fillRR(g, m.x + m.w / 2 - 5, m.y + m.h, 10, d.y - m.y - m.h, 2, '#5C6B7A'); fillRR(g, m.x + m.w / 2 - 22, d.y - 4, 44, 5, 2, '#5C6B7A'); fillRR(g, m.x - 5, m.y - 5, m.w + 10, m.h + 10, 7, '#2A3142');
    fillRR(g, 486, d.y - 7, 70, 7, 2, '#C9D2DE'); fillRR(g, 420, d.y + 16, 120, 20, 5, NAVY); text(g, 'SIGNAL DESK · SYNC LOG', 480, d.y + 29.5, 7, 800, '#FFFFFF', 'center');
    fillRR(g, 372, d.y - 22, 14, 22, 3, '#FFFFFF'); g.fillStyle = TEAL; g.fillRect(374, d.y - 30, 2, 10); g.fillStyle = '#E0456B'; g.fillRect(379, d.y - 28, 2, 8); g.fillStyle = '#3167CA'; g.fillRect(383, d.y - 31, 2, 11);
    /* the lever frame (the levers move, so they are drawn live) */
    var L = T.lever; soft(g, L.x, F + 2, 60, 7, 0.24); fillRR(g, L.x - 44, F - 50, 88, 50, 8, NAVY); fillRR(g, L.x - 40, F - 46, 80, 8, 4, '#2E4470');
    text(g, 'SIGNALS', L.x, F - 14, 7, 800, '#9FC0EA', 'center'); [-22, 0, 22].forEach(function (o) { fillRR(g, L.x + o - 4, F - 44, 8, 6, 2, '#0F1A30'); });
    /* the left wall: fare gates, a bench, a plant */
    for (var gi = 0; gi < 4; gi++) { var gx = -905 + gi * 62; soft(g, gx + 12, F + 2, 26, 5, 0.2); fillRR(g, gx, F - 96, 24, 96, 6, '#DCE3EC'); fillRR(g, gx + 3, F - 90, 18, 20, 3, '#22324F'); fillRR(g, gx, F - 96, 24, 8, 4, TEAL);
      if (gi < 3) { g.fillStyle = 'rgba(160,215,235,.45)'; g.beginPath(); g.moveTo(gx + 24, F - 70); g.lineTo(gx + 40, F - 66); g.lineTo(gx + 40, F - 34); g.lineTo(gx + 24, F - 30); g.closePath(); g.fill(); } }
    bench(g, -640, F, 120, TEAL); K.plant(g, { x: -490, y: F }, '#FFFFFF', '#E3E8EF');
    /* the right platform: a parcel trolley, a bench and a plant */
    var tx = 1124; soft(g, tx + 50, F + 2, 70, 7, 0.22); fillRR(g, tx, F - 30, 104, 10, 3, '#5C6B7A'); g.fillStyle = '#5C6B7A'; g.fillRect(tx + 96, F - 110, 6, 84);
    [[tx + 4, F - 76, 46, 46, '#C99A6B'], [tx + 52, F - 64, 40, 34, '#D6A877'], [tx + 14, F - 108, 34, 32, '#C99A6B']].forEach(function (b) { fillRR(g, b[0], b[1], b[2], b[3], 4, b[4]); g.fillStyle = 'rgba(255,240,210,.55)'; g.fillRect(b[0] + b[2] / 2 - 4, b[1], 8, b[3]); });
    fillE(g, tx + 14, F - 8, 9, 9, '#2A3142'); fillE(g, tx + 90, F - 8, 9, 9, '#2A3142');
    bench(g, 1230, F, 120, NAVY); K.plant(g, { x: 1390, y: F }, '#FFFFFF', '#E3E8EF');
    /* the concourse: the help point beside the guide, the traveller's case, a planter, a litter bin */
    var hp = HELP; soft(g, hp.x, 566, 30, 6, 0.24); fillRR(g, hp.x - 22, 404, 44, 162, 10, '#E9EEF4'); fillRR(g, hp.x - 22, 404, 44, 30, 10, TEAL); g.fillRect(hp.x - 22, 420, 44, 14);
    fillE(g, hp.x, 418, 9, 9, '#FFFFFF'); text(g, 'i', hp.x, 422.5, 12, 800, TEAL, 'center'); fillRR(g, hp.x - 16, 442, 32, 44, 4, '#22324F');
    text(g, 'HELP', hp.x, 500, 7.4, 800, NAVY, 'center'); text(g, 'POINT', hp.x, 509, 6.4, 800, '#5C6B7A', 'center');
    fillE(g, hp.x, 526, 7, 7, '#C9D2DE'); fillE(g, hp.x, 526, 4, 4, '#5C6B7A'); fillRR(g, hp.x - 12, 540, 24, 5, 2, '#22324F'); fillRR(g, hp.x - 24, 560, 48, 7, 3, '#C9D2DE');
    var cs = -226; soft(g, cs + 18, 601, 26, 5, 0.24); fillRR(g, cs, 548, 38, 52, 7, '#E0456B'); fillRR(g, cs + 3, 552, 32, 4, 2, 'rgba(255,255,255,.25)'); g.fillStyle = 'rgba(0,0,0,.14)'; g.fillRect(cs + 12, 552, 2.4, 46); g.fillRect(cs + 24, 552, 2.4, 46);
    g.strokeStyle = '#5C6B7A'; g.lineWidth = 3; g.beginPath(); g.moveTo(cs + 10, 548); g.lineTo(cs + 10, 526); g.lineTo(cs + 28, 526); g.lineTo(cs + 28, 548); g.stroke(); fillRR(g, cs + 6, 562, 16, 11, 2, '#FFFFFF'); text(g, 'SG', cs + 14, 570, 5.4, 800, '#E0456B', 'center');
    fillE(g, cs + 7, 601, 3, 3, '#2A3142'); fillE(g, cs + 31, 601, 3, 3, '#2A3142');
    g.save(); g.translate(-462, 606); g.scale(0.66, 0.66); K.plant(g, { x: 0, y: 0 }, '#FFFFFF', '#E3E8EF'); g.restore();
    var lb = 66; soft(g, lb, 568, 18, 4, 0.2); fillRR(g, lb - 12, 528, 24, 40, 6, '#C9D2DE'); fillRR(g, lb - 14, 522, 28, 8, 4, NAVY); fillRR(g, lb - 6, 538, 12, 14, 3, '#E9EEF4');
  }
  var HELP = { x: 8 };

  /* ---------------- the cast ---------------- */
  var W = CR.who;
  var EN1 = W({ x: 584, y: 470, s: 0.52, ph: 0.6, skin: 1, hair: 1, style: 'short', outfit: 'polo', top: TEAL, glasses: true, sit: true, chairCol: '#2A3550', hands: [[-120, -205], [-30, -205]], look: -0.7 });
  var EN2 = W({ x: 930, y: 470, s: 0.54, ph: 1.6, skin: 0, hair: 0, style: 'bob', outfit: 'shirt', top: '#3167CA', hold: 'tablet', hands: [[-70, -212], [60, -200]], look: -0.5 });
  var CN = W({ x: 222, y: 470, s: 0.53, ph: 2.3, skin: 2, hair: 0, style: 'pony', outfit: 'cardigan', top: PUR, top2: '#FFFFFF', clip: '#7FE3C9', hands: [[-70, -160], [86, -176]], look: 0.4 });
  var PS = W({ x: 938, y: 598, s: 0.56, ph: 3.4, skin: 0, hair: 1, style: 'bun', outfit: 'cardigan', top: '#E0456B', top2: '#FFFFFF', low: '#3A4458', sit: true, chair: false, id: '#9AA6BC', hands: [[-48, -300], [48, -300]], look: 0 });
  var CREW = [
    { x0: 1112, x1: 1380, y: 494, spd: 16, ph: 0.3, label: 'TechNext developer', lines: ['Standard connector **first**. API only where we must.', 'Every message has a key, so nothing is **booked twice**.'], acts: ['nod', 'id', 'wave'],
      P: W({ s: 0.5, skin: 2, hair: 0, style: 'short', outfit: 'shirt', top: '#1B2A4A', hold: 'box' }) },
    { left: true, x0: -940, x1: -430, y: 640, spd: 17, ph: 0.6, label: 'Visitor · client', lines: ['Our web orders just **arrive in Odoo** now.', 'No more copying the **bank statement** by hand.'], acts: ['wave', 'cheer', 'nod'],
      P: W({ s: 0.57, skin: 3, hair: 1, style: 'long', outfit: 'shirt', top: '#E07B12', hold: 'bags', id: '#9AA6BC' }) },
    { left: true, x0: -760, x1: 120, y: 664, spd: 22, ph: 0.15, label: 'TechNext consultant', lines: ['We map the data **field by field** first.', 'Tested on **staging** with real records.'], acts: ['cheer', 'id', 'wave'],
      P: W({ s: 0.59, skin: 1, hair: 0, style: 'short', outfit: 'polo', top: TEAL, hold: 'clipboard' }) }
  ];
  /* the concourse behind the title card: the station guide at the help point, a traveller on the bench */
  var GD = W({ x: -64, y: 560, s: 0.56, ph: 4.2, skin: 2, hair: 0, style: 'pony', outfit: 'polo', top: AMBER, low: '#2E3A55', hands: [[-80, -180], [80, -180]], look: 0.5 });
  var TV = W({ x: -300, y: 598, s: 0.56, ph: 5.1, skin: 3, hair: 0, style: 'short', outfit: 'shirt', top: '#7DAE38', low: '#3A4458', glasses: true, sit: true, chair: false, id: '#9AA6BC', hands: [[-24, -262], [26, -268]], look: 0.2 });

  /* ---------------- live state ---------------- */
  var PLUG = { t: -99, k: 3 }, STAMP = { t: -99 }, NEWL = { t: -99 }, FT = { t0: 0 }, BOOST = { t: -99 }, MUG = { hand: false }, FLAG = { on: false, w: 0 }, WHISTLE = { on: false };
  function lineState(s, t) { var pt = t - PLUG.t, hit = SYS[PLUG.k] === s; if (!hit || pt > 5) return 'ok'; return pt < 2.8 ? 'down' : 'recover'; }
  function mapLive(g, t, S) {
    var fast = t - BOOST.t < 2.5;
    SYS.forEach(function (s, i) {
      var on = S.hot === s.key, st = lineState(s, t), pt = t - PLUG.t;
      if (on) line(g, s, s.col, 12, null), line(g, s, '#FFFFFF', 3, [2, 7]);
      if (st === 'down') { line(g, s, '#FFFFFF', 9); line(g, s, '#F19C95', 5, [8, 6]); var m = along(s, 0.5); fillE(g, m[0], m[1] - 16, 15, 9, '#FFFFFF');
        text(g, '↻ ' + [1, 2, 4][Math.min(2, Math.floor(pt / 0.95))] + ' s', m[0], m[1] - 13, 7.2, 800, RED, 'center'); }
      /* the trains: one each way (more, and faster, on the line Nexi is showing); a downed line queues at the signal */
      var n = on ? 3 : 1, sp = (on ? 0.32 : 0.11) * (fast ? 2.6 : 1) * (st === 'recover' ? 2.4 : 1);
      for (var q = 0; q < n; q++) for (var dir = 0; dir < 2; dir++) {
        var f = (t * sp + q / n + i * 0.17 + dir * 0.5) % 1; if (dir) f = 1 - f;
        if (st === 'down') f = dir ? 0.12 + q * 0.06 : 0.66 + q * 0.07;
        var p = along(s, f); g.save(); g.translate(p[0], p[1]); g.rotate(p[2]); fillRR(g, -9, -4.5, 18, 9, 4.5, '#FFFFFF'); fillRR(g, -8, -3.5, 16, 7, 3.5, s.col); g.fillStyle = 'rgba(255,255,255,.85)'; g.fillRect(-5, -1.5, 3, 3); g.fillRect(1, -1.5, 3, 3); g.restore();
      }
      if (on) { g.strokeStyle = s.col; g.lineWidth = 2.5; rr(g, s.x - 3, s.y - 3, 154, 58, 12); g.stroke(); }
      /* the signal at the interchange */
      var sx = s.left ? s.hx - 9 : s.hx + 9, col = st === 'down' ? RED : st === 'recover' ? ((t * 4) % 1 < 0.5 ? AMBER : GO) : GO;
      fillE(g, sx, s.hy, 4.6, 4.6, '#22324F'); fillE(g, sx, s.hy, 3, 3, col);
    });
    /* the interchange breathes as the trains come in */
    var hp = 0.5 + 0.5 * Math.sin(t * 3); g.save(); g.globalAlpha = 0.14 + hp * 0.16; g.strokeStyle = PUR; g.lineWidth = 5; rr(g, HUB.x - 9, HUB.y - 9, HUB.w + 18, HUB.h + 18, 22); g.stroke(); g.restore();
    /* a new connector, drawn in by the connector engineer */
    var nu = t - NEWL.t; if (nu >= 0 && nu < 5) { var a = clamp(nu / 1.1, 0, 1), fade = nu > 4 ? 1 - (nu - 4) : 1, x0 = WALL.x + 8, y0 = 168, x1 = HUB.x + 30, y1 = HUB.y + HUB.h;
      g.save(); g.globalAlpha = fade; g.strokeStyle = TEAL; g.lineWidth = 6; g.lineCap = 'round'; g.setLineDash([10, 6]); g.lineDashOffset = -t * 30; g.beginPath(); g.moveTo(x0, y0); var mx = lerp(x0, 470, a); g.lineTo(mx, y0);
      if (a > 0.6) { var b = (a - 0.6) / 0.4; g.lineTo(lerp(470, x1, b), lerp(y0, y1, b)); } g.stroke(); g.setLineDash([]);
      if (a >= 1) { fillRR(g, x0 + 2, y0 - 26, 108, 18, 9, TEAL); text(g, '+ New connector · L7', x0 + 56, y0 - 14, 7.4, 800, '#FFFFFF', 'center'); }
      g.restore(); }
  }
  function monorail(g, t, e) { /* two little cargo trains run along the beam over the hall */
    var span = e.r - e.l + 400;
    [[0, 64, TEAL, ['ORDERS', 'STOCK']], [0.5, 64, PUR, ['PAYOUTS', 'STATEMENTS']]].forEach(function (tr) {
      var x = e.l - 200 + ((t * tr[1] + tr[0] * span) % span);
      for (var c = 0; c < 3; c++) { var cx = x - c * 52, front = c === 0; fillRR(g, cx - 48, -149, 48, 17, front ? 8 : 4, '#FFFFFF'); fillRR(g, cx - 48, -139, 48, 4, 2, tr[2]);
        if (front) { fillRR(g, cx - 14, -146, 11, 6, 2, '#9FD3F5'); } else text(g, tr[3][c - 1], cx - 24, -142, 5.2, 800, NAVY, 'center');
        fillE(g, cx - 38, -131, 3, 3, '#5C6B7A'); fillE(g, cx - 10, -131, 3, 3, '#5C6B7A'); }
    });
  }
  function backTrain(g, t, e) { /* the express: arrives, waits at the platform, departs across the station */
    var cyc = 30, u = (t + 3) % cyc, dock = T.dock, x, moving = true;
    if (u < 5) { var v = 1 - u / 5; x = dock + (e.r + 40 - dock) * v * v; }
    else if (u < 13) { x = dock; moving = false; }
    else { var w = (u - 13) / 17; x = dock - (dock - (e.l - 560)) * w * w; }
    if (x > e.r + 30 || x < e.l - 540) return;
    var y0 = 344, y1 = 452;
    /* the locomotive, nose to the left */
    soft(g, x + 70, 462, 90, 6, 0.25);
    g.fillStyle = '#FFFFFF'; g.beginPath(); g.moveTo(x + 30, y0); g.lineTo(x + 140, y0); g.lineTo(x + 140, y1); g.lineTo(x + 4, y1); g.quadraticCurveTo(x - 6, y1 - 30, x + 6, y0 + 40); g.quadraticCurveTo(x + 14, y0 + 6, x + 30, y0); g.closePath(); g.fill();
    g.fillStyle = TEAL; g.fillRect(x + 6, y1 - 34, 134, 22); g.fillStyle = NAVY; g.fillRect(x + 4, y1 - 12, 136, 12);
    g.fillStyle = '#22324F'; g.beginPath(); g.moveTo(x + 32, y0 + 8); g.lineTo(x + 54, y0 + 8); g.lineTo(x + 54, y0 + 40); g.lineTo(x + 14, y0 + 40); g.quadraticCurveTo(x + 18, y0 + 18, x + 32, y0 + 8); g.closePath(); g.fill();
    g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(x + 36, y0 + 12, 6, 24);
    for (var wi = 0; wi < 3; wi++) fillRR(g, x + 64 + wi * 24, y0 + 10, 18, 26, 4, '#9FD3F5');
    text(g, 'EXPRESS · L6', x + 98, y1 - 19, 7, 800, '#FFFFFF', 'center');
    fillE(g, x + 8, y1 - 20, 4, 4, moving ? '#FFE9A0' : '#FFF6D8'); if (moving) { g.fillStyle = 'rgba(255,233,160,.35)'; g.beginPath(); g.moveTo(x + 6, y1 - 22); g.lineTo(x - 40, y1 - 34); g.lineTo(x - 40, y1 - 4); g.closePath(); g.fill(); }
    if (!moving && (t % 1) < 0.5) fillE(g, x + 120, y0 - 4, 5, 4, AMBER);
    /* the wagons, each with a container from one of the lines */
    for (var c = 0; c < 4; c++) { var cx = x + 146 + c * 118, s = SYS[(c + Math.floor((t + 3) / cyc)) % 6];
      fillRR(g, cx, y1 - 14, 112, 14, 3, '#5C6B7A'); fillRR(g, cx + 6, y0 + 14, 100, 60, 4, s.col); g.fillStyle = 'rgba(255,255,255,.14)'; for (var r = 0; r < 6; r++) g.fillRect(cx + 12 + r * 16, y0 + 18, 3, 52);
      fillRR(g, cx + 22, y0 + 34, 68, 18, 4, '#FFFFFF'); text(g, s.cargo, cx + 56, y0 + 46.5, 7.4, 800, NAVY, 'center');
      fillE(g, cx + 18, y1 + 2, 7, 7, '#2A3142'); fillE(g, cx + 94, y1 + 2, 7, 7, '#2A3142'); g.fillStyle = '#5C6B7A'; g.fillRect(cx - 6, y1 - 8, 6, 3); }
    [x + 26, x + 116].forEach(function (wx) { fillE(g, wx, y1 + 2, 8, 8, '#2A3142'); fillE(g, wx, y1 + 2, 3, 3, '#9AA6BC'); });
  }
  function foreTrain(g, t, e) { /* the freight on the front track: orders, stock, payouts and statements */
    var tk = track(e), spd = 170, len = 760, span = e.r - e.l + len + 500, x = e.l - 120 + ((t - FT.t0) * spd) % span; if (x - len > e.r) return;
    var b = tk.r2 - 4, h = 66;
    soft(g, x - len / 2, b + 6, len * 0.55, 8, 0.2);
    /* the locomotive, nose to the right */
    g.fillStyle = PUR; g.beginPath(); g.moveTo(x - 150, b - h - 16); g.lineTo(x - 30, b - h - 16); g.quadraticCurveTo(x + 6, b - h - 10, x + 10, b - 30); g.lineTo(x + 10, b - 8); g.lineTo(x - 150, b - 8); g.closePath(); g.fill();
    g.fillStyle = '#FFFFFF'; g.fillRect(x - 150, b - 40, 158, 9); fillRR(g, x - 52, b - h - 8, 40, 26, 6, '#9FD3F5'); g.fillStyle = 'rgba(255,255,255,.4)'; g.fillRect(x - 46, b - h - 4, 6, 18);
    text(g, 'ODOO CENTRAL FREIGHT', x - 92, b - 18, 8.4, 800, '#FFFFFF', 'center'); fillE(g, x + 4, b - 22, 4.5, 4.5, '#FFE9A0');
    for (var c = 0; c < 5; c++) { var cx = x - 160 - (c + 1) * 120, s = SYS[c % 6];
      fillRR(g, cx, b - 16, 114, 10, 3, '#4A5468'); fillRR(g, cx + 4, b - h - 2, 106, h - 14, 4, s.col); g.fillStyle = 'rgba(255,255,255,.16)'; for (var r = 0; r < 6; r++) g.fillRect(cx + 10 + r * 17, b - h + 2, 3, h - 22);
      fillRR(g, cx + 18, b - h + 12, 78, 20, 4, '#FFFFFF'); text(g, s.cargo, cx + 57, b - h + 26, 8.4, 800, NAVY, 'center');
      fillE(g, cx + 20, b - 4, 8, 8, '#2A3142'); fillE(g, cx + 94, b - 4, 8, 8, '#2A3142'); }
    [x - 130, x - 40].forEach(function (wx) { fillE(g, wx, b - 4, 9, 9, '#2A3142'); fillE(g, wx, b - 4, 3.5, 3.5, '#9AA6BC'); });
  }
  function paintLive(g, t, now, S) {
    var e = S.ext;
    monorail(g, t, e);
    mapLive(g, t, S);
    /* the station clock on Singapore time */
    var d = new Date(Date.now() + 8 * 3600e3); K.clockHands(g, T.clock, d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds());
    /* the arrivals board: rows roll in */
    var nx = -560, roll = Math.floor(t / 2.6);
    for (var r = 0; r < 4; r++) { var s = SYS[(r + roll) % 6], y = 186 + r * 19, fresh = r === 3 && (t % 2.6) < 0.5;
      fillE(g, nx - 62, y - 3, 3.5, 3.5, s.col); text(g, s.name, nx - 54, y, 7, 800, fresh ? '#FFFFFF' : '#E7EEF8'); text(g, r === 0 ? 'arrived' : r === 3 ? 'now' : (r * 2) + ' min', nx + 62, y, 6.6, 800, r === 0 ? '#7FE3C9' : '#FFC94A', 'right'); }
    backTrain(g, t, e);
    boardLive(g, t);
    platformBench(g, 876); platformBench(g, -362, PUR);
  }
  function platformBench(g, x, col) { /* a platform bench: backrest, seat, arm rests, legs */
    var w = 124, y = 598, TEAL = col || '#14A38B'; soft(g, x + w / 2, y + 3, 72, 7, 0.22);
    fillRR(g, x + 4, 478, w - 8, 22, 6, TEAL); fillRR(g, x + 4, 506, w - 8, 18, 6, TEAL); g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(x + 8, 481, w - 16, 3);
    g.fillStyle = '#7A869C'; g.fillRect(x + 12, 524, 5, 24); g.fillRect(x + w - 17, 524, 5, 24);
    fillRR(g, x, 546, w, 11, 5, col ? '#5A3B52' : '#0E7A68'); fillRR(g, x - 4, 532, 10, 26, 4, '#5C6B7A'); fillRR(g, x + w - 6, 532, 10, 26, 4, '#5C6B7A');
    g.fillStyle = '#5C6B7A'; g.fillRect(x + 8, 557, 6, y - 557); g.fillRect(x + w - 14, 557, 6, y - 557); fillRR(g, x + 2, y - 4, 18, 4, 2, '#4A5468'); fillRR(g, x + w - 20, y - 4, 18, 4, 2, '#4A5468');
  }
  function paintFrontLive(g, t, S) {
    CO.crew(CREW, g, t, S, true);
    /* the sync log on the engineer's monitor */
    var m = T.mon, hot = SYS.filter(function (s) { return s.key === S.hot; })[0], pt = t - PLUG.t, bad = SYS[PLUG.k];
    fillRR(g, m.x, m.y, m.w, m.h, 3, '#FFFFFF'); fillRR(g, m.x, m.y, m.w, 13, 3, TEAL); g.fillRect(m.x, m.y + 7, m.w, 6); text(g, 'SYNC LOG · sample', m.x + 6, m.y + 9.5, 5.8, 800, '#FFFFFF');
    fillE(g, m.x + m.w - 8, m.y + 6.5, 2.6, 2.6, (t % 1) < 0.5 ? '#B8F5DE' : '#FFFFFF');
    var list = hot ? [hot, hot, hot, hot] : SYS, off = Math.floor(t * (hot ? 1.5 : 0.6));
    for (var i = 0; i < 4; i++) { var s = list[(i + off) % list.length], y = m.y + 19 + i * 15, fresh = i === 3, col = fresh && (t % 1) < 0.5 ? GO : '#BDEBD7', msg = s.ev;
      if (pt < 5 && i === 3) { if (pt < 2.8) { col = RED; msg = 'Retry · ' + bad.name + ' · backoff ' + [1, 2, 4][Math.min(2, Math.floor(pt / 0.95))] + ' s'; } else { col = GO; msg = 'Recovered · backlog drained, no duplicates'; } }
      fillRR(g, m.x + 6, y, 8, 8, 2, col); fillRR(g, m.x + 6, y, 3, 8, 1.5, s.col); text(g, msg, m.x + 18, y + 6.5, 5.3, fresh ? 800 : 700, '#3D4560'); }
    var su = t - STAMP.t; if (su >= 0 && su < 1.8) { g.save(); g.translate(m.x + m.w * 0.56, m.y + m.h * 0.55); g.rotate(-0.18); var sc = su < 0.12 ? 1.6 - su * 5 : 1; g.scale(sc, sc); g.globalAlpha = su > 1.4 ? (1.8 - su) / 0.4 : 1;
      g.strokeStyle = GO; g.lineWidth = 3; rr(g, -40, -13, 80, 26, 6); g.stroke(); text(g, 'SYNCED ✓', 0, 5, 12, 800, '#1E9E6A', 'center'); g.restore(); }
    /* the mug: on the desk, or in the engineer's hand */
    var mp = MUG.hand ? handAt(EN1, 1) : [548, 386]; fillRR(g, mp[0] - 6, mp[1] - 12, 12, 13, 3, '#FFFFFF'); g.strokeStyle = '#FFFFFF'; g.lineWidth = 2.4; g.beginPath(); g.arc(mp[0] + 7, mp[1] - 6, 3.5, -1.4, 1.4); g.stroke(); fillRR(g, mp[0] - 6, mp[1] - 8, 12, 3, 1, TEAL);
    if (!MUG.hand) { g.strokeStyle = 'rgba(160,170,190,.5)'; g.lineWidth = 1.4; for (var sw = 0; sw < 2; sw++) { var sy = mp[1] - 16 - ((t * 10 + sw * 7) % 14); g.beginPath(); g.moveTo(mp[0] - 2 + sw * 4, sy); g.quadraticCurveTo(mp[0] + 2 + sw * 4, sy - 4, mp[0] - 1 + sw * 4, sy - 8); g.stroke(); } }
    /* the dispatcher's flag and whistle */
    if (FLAG.on) { var hp = handAt(EN2, 1), wv = Math.sin(t * 12) * 0.25 + FLAG.w; g.save(); g.translate(hp[0], hp[1]); g.rotate(-0.3 + wv * 0.4); g.fillStyle = '#7A869C'; g.fillRect(-1.5, -46, 3, 50);
      g.fillStyle = GO; g.beginPath(); g.moveTo(1.5, -46); g.quadraticCurveTo(18, -50 + Math.sin(t * 14) * 4, 34, -42); g.lineTo(34, -24); g.quadraticCurveTo(18, -30 + Math.sin(t * 14 + 1) * 4, 1.5, -26); g.closePath(); g.fill(); g.restore(); }
    if (WHISTLE.on) { var wp = handAt(EN2, 1); fillRR(g, wp[0] - 7, wp[1] - 4, 14, 7, 3, '#C9D2DE'); fillE(g, wp[0] + 6, wp[1] - 1, 4, 4, '#9AA6BC'); }
    /* the connector engineer's plug on its cable */
    var cp = handAt(CN, 1); g.strokeStyle = NAVY; g.lineWidth = 3; g.lineCap = 'round'; g.beginPath(); g.moveTo(cp[0], cp[1] + 6); g.bezierCurveTo(cp[0] + 10, cp[1] + 60, CN.x + 52, F - 30, CN.x + 46, F - 8); g.stroke();
    [0, 1, 2].forEach(function (c) { g.strokeStyle = c % 2 ? '#2E4470' : NAVY; g.lineWidth = 3; g.beginPath(); g.ellipse(CN.x + 46, F - 7 - c * 3, 16 - c * 2, 5, 0, 0, Math.PI * 2); g.stroke(); });
    g.save(); g.translate(cp[0], cp[1]); fillRR(g, -7, -8, 14, 16, 4, TEAL); g.fillStyle = '#C9D2DE'; g.fillRect(-4, -15, 2.4, 8); g.fillRect(1.6, -15, 2.4, 8); g.restore();
    /* the passenger's newspaper (turning a page now and then) or the paper plane she throws */
    if (PAPER.on) { var l = handAt(PS, 0), r = handAt(PS, 1), cx = (l[0] + r[0]) / 2, cy = (l[1] + r[1]) / 2 + 6, hw = Math.max(8, (r[0] - l[0]) / 2 + 12) * PAPER.k, fl = PAPER.flip;
      g.save(); g.translate(cx, cy); g.rotate(PAPER.tilt);
      fillRR(g, -hw, -20, hw * 2, 40, 2, '#F4F1EA'); g.fillStyle = 'rgba(30,40,60,.10)'; g.fillRect(-1, -20, 2, 40);
      if (hw > 20) { g.fillStyle = NAVY; g.fillRect(-hw + 4, -16, hw - 8, 5); g.fillStyle = '#C3C9D4'; for (var ln = 0; ln < 4; ln++) { g.fillRect(-hw + 4, -7 + ln * 6, hw - 8, 2); g.fillRect(4, -16 + ln * 6, hw - 8, 2); } fillRR(g, 4, 8, hw * 0.5, 8, 1, '#9FD3F5'); }
      if (fl > 0) { var fw = hw * Math.cos(fl * Math.PI); fillRR(g, Math.min(0, fw), -20, Math.abs(fw), 40, 2, fw < 0 ? '#E8E3D8' : '#F4F1EA'); }
      g.restore(); }
    var pu = t - PLANE.t; if (pu >= 0 && pu < 2.8) { var v = pu / 2.8, px = PLANE.x - 330 * v + Math.sin(v * 6) * 16, py = PLANE.y - Math.sin(v * Math.PI) * 120 - 40 * v, ang = Math.atan2(-Math.cos(v * Math.PI) * 120, -330) + Math.PI;
      g.save(); g.globalAlpha = v > 0.8 ? (1 - v) / 0.2 : 1; fillE(g, px, py + 10, 10, 2.5, 'rgba(30,40,60,.12)'); CO.plane(g, px, py, 2.2, ang + 0.4, '#F4F1EA', NAVY); g.restore(); }
    /* the lever handles: the middle one pulls back when tapped */
    var L = T.lever, lu = t - PLUG.t, pull = lu >= 0 && lu < 1.4 ? Math.sin(Math.min(1, lu / 0.25) * Math.PI / 2) * (lu > 1 ? (1.4 - lu) / 0.4 : 1) : 0;
    [[-22, RED, 0], [0, AMBER, 1], [22, TEAL, 0]].forEach(function (lv) { var a = -0.12 + lv[2] * pull * 0.85 + (lv[2] ? 0 : Math.sin(t * 0.9 + lv[0]) * 0.02), bx = L.x + lv[0], by = F - 42;
      g.strokeStyle = '#C9D2DE'; g.lineWidth = 4; g.beginPath(); g.moveTo(bx, by); g.lineTo(bx + Math.sin(a) * 58, by - Math.cos(a) * 58); g.stroke(); fillRR(g, bx + Math.sin(a) * 58 - 6, by - Math.cos(a) * 58 - 9, 12, 14, 4, lv[1]); });
    concourseLive(g, t);
    /* the fare gates' arrows blink */
    for (var gi = 0; gi < 4; gi++) { var gx = -905 + gi * 62, on = ((t * 1.4 + gi * 0.37) % 1) < 0.6; g.fillStyle = on ? GO : '#335244'; g.beginPath(); g.moveTo(gx + 7, F - 85); g.lineTo(gx + 17, F - 80); g.lineTo(gx + 7, F - 75); g.closePath(); g.fill(); }
  }
  var LEAF = { k: 0, out: false, flip: 1 }, PING = { t: -99 };
  function concourseLive(g, t) {
    /* the help point's screen: each line in turn, a cursor blinking */
    var hp = HELP, s0 = SYS[Math.floor(t / 1.6) % 6]; fillRR(g, hp.x - 13, 445, 26, 38, 3, '#0F1A30'); fillRR(g, hp.x - 10, 449, 20, 6, 3, s0.col);
    for (var i = 0; i < 3; i++) fillRR(g, hp.x - 10, 460 + i * 6, 6 + hash(i + Math.floor(t / 1.6)) * 14, 2.6, 1.3, '#9FB6D8'); if ((t % 1) < 0.5) g.fillStyle = '#7FE3C9', g.fillRect(hp.x - 10, 478, 5, 2);
    /* the guide's leaflet (handing out) or her fold-out line map */
    if (LEAF.out) { var h = handAt(GD, 1); g.save(); g.translate(h[0], h[1]); g.rotate(-0.15); fillRR(g, -2, -14, 16, 20, 2, '#FFFFFF'); fillRR(g, -2, -14, 16, 5, 2, TEAL); g.fillStyle = '#C3C9D4'; g.fillRect(1, -6, 10, 1.6); g.fillRect(1, -2, 8, 1.6); g.restore(); }
    if (LEAF.k > 0) { var a = handAt(GD, 0), c = handAt(GD, 1), mx = (a[0] + c[0]) / 2, my = (a[1] + c[1]) / 2 - 4, hw = Math.max(10, (c[0] - a[0]) / 2 + 8) * LEAF.k;
      g.save(); g.translate(mx, my); g.scale(LEAF.flip, 1); fillRR(g, -hw, -26, hw * 2, 40, 3, '#FFFFFF'); g.fillStyle = 'rgba(27,42,74,.08)'; g.fillRect(-hw / 3, -26, 1.2, 40); g.fillRect(hw / 3, -26, 1.2, 40);
      if (hw > 24) { SYS.forEach(function (s2, i2) { g.strokeStyle = s2.col; g.lineWidth = 2.6; g.beginPath(); g.moveTo(-hw + 6, -18 + i2 * 5.4); g.lineTo(hw - 22, -18 + i2 * 5.4); g.lineTo(hw - 12, -4); g.stroke(); }); fillE(g, hw - 10, -4, 6, 6, PUR); }
      g.restore(); }
    /* the traveller's phone, and the sync ping when she is tapped */
    var ph = handAt(TV, 1); g.save(); g.translate(ph[0] - 2, ph[1] - 4); g.rotate(-0.2); fillRR(g, -5, -9, 10, 17, 2.5, '#22324F'); fillRR(g, -3.8, -7.6, 7.6, 13, 1.5, (t - PING.t) < 2 ? '#B8F5DE' : '#9FD3F5'); g.restore();
    var pu = t - PING.t; if (pu >= 0 && pu < 2.2) { var by = ph[1] - 40 - Math.min(1, pu / 0.25) * 10; g.save(); g.globalAlpha = pu > 1.8 ? (2.2 - pu) / 0.4 : 1;
      shadowed(g, 6, 2, 0.16, function () { fillRR(g, ph[0] - 46, by - 12, 92, 22, 11, '#FFFFFF'); }); fillE(g, ph[0] - 34, by - 1, 7, 7, GO); text(g, '✓', ph[0] - 34, by + 2.5, 8, 800, '#FFFFFF', 'center');
      text(g, 'Order synced', ph[0] - 24, by + 2.6, 8, 800, NAVY); g.restore(); }
  }
  function paintFore(g, ext) { /* the near platform on the right: a recycling bin, a parcel trolley, a drinks machine */
    var bn = 1084; soft(g, bn, 600, 24, 5, 0.22); fillRR(g, bn - 16, 548, 32, 52, 7, TEAL); fillRR(g, bn - 20, 542, 40, 10, 5, NAVY); fillRR(g, bn - 8, 546, 16, 3, 1.5, '#0F1A30');
    g.strokeStyle = '#FFFFFF'; g.lineWidth = 2.4; g.lineCap = 'round'; g.beginPath(); g.arc(bn, 574, 8, -2.2, 1.2); g.stroke(); g.fillStyle = '#FFFFFF'; g.beginPath(); g.moveTo(bn + 4, 581); g.lineTo(bn + 10, 577); g.lineTo(bn + 10, 585); g.closePath(); g.fill();
    var tx = 1126; soft(g, tx + 38, 622, 52, 6, 0.24); fillRR(g, tx, 600, 80, 8, 3, '#5C6B7A'); g.fillStyle = '#5C6B7A'; g.fillRect(tx - 4, 540, 5, 64); fillRR(g, tx - 10, 536, 16, 6, 3, NAVY);
    [[tx + 6, 566, 36, 34, '#C99A6B', 'ORDER'], [tx + 44, 572, 32, 28, '#D6A877', ''], [tx + 12, 540, 28, 26, '#E0456B', '']].forEach(function (b) { fillRR(g, b[0], b[1], b[2], b[3], 3, b[4]); g.fillStyle = 'rgba(255,240,210,.5)'; g.fillRect(b[0] + b[2] / 2 - 3, b[1], 6, b[3]);
      if (b[5]) { fillRR(g, b[0] + 4, b[1] + 12, 20, 9, 2, '#FFFFFF'); text(g, b[5], b[0] + 14, b[1] + 18.6, 4.6, 800, NAVY, 'center'); } });
    fillE(g, tx + 10, 612, 7, 7, '#2A3142'); fillE(g, tx + 70, 612, 7, 7, '#2A3142');
    var vx = 1208, vy = 588; soft(g, vx + 30, vy + 3, 44, 6, 0.26); fillRR(g, vx, vy - 172, 62, 172, 8, '#E9EEF4'); fillRR(g, vx, vy - 172, 62, 22, 8, TEAL); g.fillRect(vx, vy - 160, 62, 10);
    text(g, 'DRINKS', vx + 31, vy - 157, 8, 800, '#FFFFFF', 'center'); fillRR(g, vx + 6, vy - 144, 36, 96, 4, '#BFE3F4');
    for (var rw = 0; rw < 4; rw++) for (var cl = 0; cl < 3; cl++) { var cx2 = vx + 10 + cl * 11, cy2 = vy - 136 + rw * 23; fillRR(g, cx2, cy2, 8, 15, 3, [TEAL, '#F08A24', '#E0456B', '#635BFF'][(rw + cl) % 4]); g.fillStyle = 'rgba(255,255,255,.5)'; g.fillRect(cx2 + 1.5, cy2 + 2, 1.5, 10); g.fillStyle = '#9FB3C8'; g.fillRect(vx + 7, cy2 + 16, 34, 2); }
    fillRR(g, vx + 46, vy - 140, 11, 46, 3, '#22324F'); fillRR(g, vx + 8, vy - 40, 32, 14, 3, '#22324F'); g.fillStyle = 'rgba(255,255,255,.3)'; g.beginPath(); g.moveTo(vx + 8, vy - 144); g.lineTo(vx + 20, vy - 144); g.lineTo(vx + 6, vy - 100); g.closePath(); g.fill();
    fillRR(g, vx + 4, vy - 8, 54, 8, 3, '#C9D2DE');
  }
  function edgeLights(g, t, e) { /* studs along the platform edge: a sweep runs with the freight, all pulse amber while the express pulls in */
    var tk = track(e), y = tk.edge - 3, spd = 170, len = 760, span = e.r - e.l + len + 500, fx = e.l - 120 + ((t - FT.t0) * spd) % span, arr = ((t + 3) % 30) < 5;
    for (var x = Math.floor(e.l / 40) * 40 + 20; x < e.r; x += 40) { var near = x < fx + 160 && x > fx - len - 60, a = near ? 1 : arr ? 0.5 + 0.5 * Math.sin(t * 8) : 0.25 + 0.15 * Math.sin(t * 1.5 + x * 0.02);
      fillRR(g, x - 6, y - 2, 12, 4, 2, '#7D8893'); g.globalAlpha = a; fillRR(g, x - 5, y - 1.5, 10, 3, 1.5, near ? '#FFE27A' : arr ? AMBER : '#BFF0E3'); g.globalAlpha = 1; }
  }
  var BIRDS = [{ x: 1142, ph: 0 }, { x: 1166, ph: 1.7 }, { x: 1190, ph: 3.1 }], FLY = { t: -99 }, BOT = { t: -99, x: 1200 };
  function botX(t) { return 1205 + Math.sin(t * 0.22) * 82; }
  function pigeons(g, t) { /* three pigeons peck the platform; the cleaner robot, the freight or a tap sends them up for a moment */
    var bx = botX(t); BIRDS.forEach(function (b, i) { var fu = t - FLY.t - i * 0.08, close = Math.abs(bx - b.x) < 34;
      if (close && t - FLY.t > 2.2) FLY.t = t;
      var air = fu >= 0 && fu < 1.6 ? Math.sin(fu / 1.6 * Math.PI) : 0, x = b.x + Math.sin(t * 0.4 + b.ph) * 6 + air * (i - 1) * 14, y = 644 - air * 46, peck = air ? 0 : Math.max(0, Math.sin(t * 3 + b.ph * 2)) ;
      fillE(g, x, 646, 9 * (1 - air * 0.6), 2.4, 'rgba(40,40,30,.18)');
      g.save(); g.translate(x, y); if (Math.sin(t * 0.4 + b.ph) < 0) g.scale(-1, 1);
      if (air) { var fl = Math.sin(t * 30) * 0.9; g.fillStyle = '#7F8BA0'; g.beginPath(); g.moveTo(-2, -8); g.lineTo(-14, -8 - 10 * fl); g.lineTo(4, -6); g.closePath(); g.fill(); }
      else { g.strokeStyle = '#E07B5A'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(-2, -3); g.lineTo(-3, 0); g.moveTo(2, -3); g.lineTo(3, 0); g.stroke(); }
      fillE(g, 0, -8, 9, 6, '#9AA6BC'); fillE(g, -7, -9, 5, 3, '#7F8BA0'); fillE(g, 1, -10, 4, 2.6, 'rgba(120,200,170,.6)');
      var hx = 7 + peck * 2, hy = -14 + peck * 9; fillE(g, hx, hy, 3.6, 3.6, '#8C98AE'); fillE(g, hx + 1.2, hy - 0.8, 0.9, 0.9, '#1B1F3B'); g.fillStyle = '#F2C230'; g.beginPath(); g.moveTo(hx + 3, hy - 0.5); g.lineTo(hx + 6, hy + 0.5); g.lineTo(hx + 3, hy + 1.5); g.closePath(); g.fill();
      g.restore(); });
  }
  function robot(g, t) { /* the cleaner robot sweeps the platform: brushes spin, a light blinks, a damp shine trails behind; tapped, it spins */
    var x = botX(t), dir = Math.cos(t * 0.22) >= 0 ? 1 : -1, su = t - BOT.t, spin = su >= 0 && su < 1.2 ? su / 1.2 * Math.PI * 2 : 0, y = 654;
    g.fillStyle = 'rgba(160,215,235,.35)'; g.beginPath(); g.ellipse(x - dir * 40, y + 1, 30, 3.5, 0, 0, Math.PI * 2); g.fill();
    fillE(g, x, y + 2, 26, 4, 'rgba(30,40,60,.18)');
    [-1, 1].forEach(function (d) { var bx = x + d * 18 + dir * 4; g.save(); g.translate(bx, y - 1); g.rotate(t * 14 * d); g.strokeStyle = '#F2C230'; g.lineWidth = 1.6; for (var q = 0; q < 4; q++) { g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(q * Math.PI / 2) * 6, Math.sin(q * Math.PI / 2) * 2.2); g.stroke(); } g.restore(); });
    g.save(); g.translate(x, y - 6); g.scale(Math.cos(spin) || 0.05, 1);
    fillRR(g, -22, -16, 44, 16, 8, '#FFFFFF'); fillRR(g, -22, -6, 44, 6, 3, TEAL); g.beginPath(); g.ellipse(0, -16, 16, 12, 0, Math.PI, 0); g.closePath(); g.fillStyle = '#E9EEF4'; g.fill();
    fillRR(g, -9, -24, 18, 8, 4, '#22324F'); fillE(g, -4 + dir * 2, -20, 1.8, 1.8, '#7FE3C9'); fillE(g, 4 + dir * 2, -20, 1.8, 1.8, '#7FE3C9');
    g.fillStyle = '#9AA6BC'; g.fillRect(-1, -34, 2, 8); fillE(g, 0, -35, 2.6, 2.6, (t % 1.2) < 0.4 ? '#FFC94A' : '#C9D2DE');
    g.restore();
  }
  function vendingLive(g, t) { /* a button blinks; now and then a can drops to the tray */
    var vx = 1208, vy = 588; fillE(g, vx + 51, vy - 130, 2.4, 2.4, (t % 1) < 0.5 ? GO : '#335244'); fillE(g, vx + 51, vy - 122, 2.4, 2.4, ((t + 0.5) % 1) < 0.5 ? AMBER : '#5C4A20');
    var cu = (t + 1.5) % 9; if (cu < 0.7) { var cy = lerp(vy - 90, vy - 34, cu / 0.7); fillRR(g, vx + 21, cy, 8, 13, 3, '#E0456B'); } else if (cu < 2) fillRR(g, vx + 18, vy - 37, 13, 8, 3, '#E0456B');
  }
  function paintForeLive(g, t, S) {
    var e = S.ext;
    K.zfore(g, t, S, [[588, function () { vendingLive(g, t); }], [644, function () { pigeons(g, t); }], [654, function () { robot(g, t); }], [track(e).edge - 3, function () { edgeLights(g, t, e); }], [track(e).r2, function () { foreTrain(g, t, e); }]], function () { CO.crew(CREW, g, t, S, 'fore'); });
    CR.draw(g, t);
  }

  /* ---------------- each person's own loop and tap ---------------- */
  function tapped(st, t) { if (st.wave && st.wave !== st._seen) { st._seen = st.wave; st.c = t; return true; } return false; }
  function lookAt(P, S, st, t, def) { P.look = lerp(P.look, t < st.until ? clamp((S.nexi.x - P.x) / 160, -1, 1) : def, 0.08); }
  function en1(P, t, S) { /* types; sips her coffee; glances up at the map. Tap: stamps SYNCED on the log, then spins her chair */
    var st = S.cast.en1; tapped(st, t); var u = (t - (st.c == null ? -99 : st.c)) / 1.9;
    P.sx = 1; P.tilt = 0; P.hop = 0; P.talk = t < st.until; P.mood = P.talk ? 'happy' : 'calm'; MUG.hand = false; lookAt(P, S, st, t, -0.7);
    if (u >= 0 && u < 1) { P.talk = true; P.mood = 'happy';
      if (u < 0.3) { var a = u / 0.3; P.mood = 'wow'; P.hands = [[-120, -205], [lerp(-30, 52, a), lerp(-205, -392, a)]]; st.stamped = false; }
      else if (u < 0.4) { var b = (u - 0.3) / 0.1; P.hands = [[-120, -205], [lerp(52, -90, b), lerp(-392, -206, b)]]; if (b > 0.8 && !st.stamped) { st.stamped = true; STAMP.t = t; CR.burst('star', T.mon.x + 80, T.mon.y + 30, t); } }
      else { var w = (u - 0.4) / 0.6; P.hands = [[-120, -205], [-80, -210]]; P.sx = Math.cos(w * Math.PI * 2); P.hop = Math.sin(w * Math.PI) * 8; }
      return; }
    var c = (t + 2) % 10, busy = !!S.hot;
    if (c < 6.2 || busy) { var k2 = Math.abs(Math.sin(t * (busy ? 12 : 5))) * 7; P.hands = [[-122, -205 - k2], [-36, -205 - (7 - k2)]]; }
    else if (c < 8.4) { var e2 = clamp(Math.min((c - 6.2) / 0.5, (8.4 - c) / 0.5), 0, 1); MUG.hand = e2 > 0.3; P.hands = [[-122, -205], [lerp(-36, 16, e2), lerp(-205, -322, e2)]]; P.look = lerp(P.look, 0.05, 0.2); P.tilt = -0.05 * e2; }
    else { P.hands = [[-122, -205], [-40, -200]]; P.look = lerp(P.look, 0.35, 0.1); P.tilt = -0.1; }
  }
  function en2(P, t, S) { /* reads the timetable on her tablet, then waves a train off with the green flag. Tap: whistle, a big flag sweep, the freight departs */
    var st = S.cast.en2; if (tapped(st, t)) { st.sent = false; CR.burst('note', P.x, P.y - 250, t); } var u = (t - (st.c == null ? -99 : st.c)) / 2.4;
    P.sx = 1; P.tilt = 0; P.hop = 0; P.talk = t < st.until; P.mood = P.talk ? 'happy' : 'calm'; FLAG.on = false; FLAG.w = 0; WHISTLE.on = false; lookAt(P, S, st, t, -0.4);
    if (u >= 0 && u < 1) { P.talk = u > 0.3; P.mood = 'happy';
      if (u < 0.3) { WHISTLE.on = true; P.hands = [[-70, -212], [12, -334]]; P.mood = 'wow'; P.talk = false; }
      else { var a = lerp(-2.5, -0.55, ease((u - 0.3) / 0.7)); FLAG.on = true; FLAG.w = 0.6; P.hands = [[-70, -212], [76 + Math.cos(a) * 146, -258 + Math.sin(a) * 146]]; P.hop = Math.sin((u - 0.3) / 0.7 * Math.PI) * 22; P.look = 0.6;
        if (!st.sent) { st.sent = true; FT.t0 = t; BOOST.t = t; } }
      return; }
    var c = (t + 4) % 10;
    if (c < 6) { P.hands = [[-70, -212], [-6 + Math.sin(t * 2.4) * 10, -226]]; P.tilt = 0.07; P.look = lerp(P.look, -0.25, 0.1); }
    else if (c < 8.4) { var r = clamp(Math.min((c - 6) / 0.4, (8.4 - c) / 0.4), 0, 1); FLAG.on = r > 0.5; P.hands = [[-70, -212], [lerp(60, 104 + Math.sin(t * 9) * 14, r), lerp(-200, -392, r)]]; P.look = lerp(P.look, 0.7, 0.1); P.mood = 'happy'; }
    else P.hands = [[-70, -212], [64, -176]];
  }
  function cn(P, t, S) { /* paces with a new plug, stops to point at the map, checks the plug. Tap: plugs in a new line (L7) and cheers */
    var st = S.cast.cn; tapped(st, t); var u = (t - (st.c == null ? -99 : st.c)) / 2.2;
    P.sx = 1; P.tilt = 0; P.hop = 0; P.talk = t < st.until; P.mood = P.talk ? 'happy' : 'calm'; lookAt(P, S, st, t, 0.4);
    if (u >= 0 && u < 1) { P.talk = true; P.mood = 'happy';
      if (u < 0.35) { var a = u / 0.35; P.hands = [[lerp(-70, -30, a), lerp(-160, -398, a)], [lerp(86, 30, a), lerp(-176, -400, a)]]; P.mood = 'wow'; st.done = false; }
      else { if (!st.done) { st.done = true; NEWL.t = t; CR.burst('conf', P.x, P.y - 260, t); } var b = (u - 0.35) / 0.65; P.hop = Math.abs(Math.sin(b * Math.PI * 3)) * 22; P.hands = [[-96 + Math.sin(t * 16) * 8, -390], [96 - Math.sin(t * 16) * 8, -392]]; }
      return; }
    var c = t % 12;
    if (c < 7) { var v = Math.cos(t * 0.6); P.x = 222 + Math.sin(t * 0.6) * 22; P.hop = Math.abs(v) > 0.2 ? Math.abs(Math.sin(t * 4.4)) * 5 : 0; P.look = lerp(P.look, v > 0 ? 0.6 : -0.6, 0.06); P.hands = [[-70 - Math.sin(t * 4.4) * 10, -160], [86, -176]]; }
    else if (c < 10) { P.hands = [[-70, -160], [118, -392]]; P.look = lerp(P.look, 0.85, 0.1); P.tilt = -0.06; }
    else { P.hands = [[-34, -232], [30, -236]]; P.tilt = 0.08; P.look = lerp(P.look, 0, 0.1); }
  }

  var PAPER = { on: true, k: 1, flip: 0, tilt: 0 }, PLANE = { t: -99, x: 0, y: 0 };
  function ps(P, t, S) { /* reads the paper, turns a page, lowers it to watch the express come in. Tap: folds it into a paper plane, throws it, cheers */
    var st = S.cast.ps; if (tapped(st, t)) st.thrown = false; P.sx = 1; P.hop = 0; P.talk = t < st.until; P.mood = P.talk ? 'happy' : 'calm'; PAPER.on = true; PAPER.k = 1; PAPER.flip = 0; PAPER.tilt = 0;
    var u = (t - (st.c == null ? -99 : st.c)) / 2.6;
    if (u >= 0 && u < 1) { P.talk = u > 0.4; P.mood = 'happy'; P.tilt = 0;
      if (u < 0.3) { var a = u / 0.3; PAPER.k = 1 - a * 0.85; PAPER.tilt = a * 0.6; P.hands = [[lerp(-48, -10, a), lerp(-300, -310, a)], [lerp(48, 10, a), lerp(-300, -310, a)]]; P.look = 0; }
      else if (u < 0.42) { PAPER.on = false; var b = (u - 0.3) / 0.12; P.hands = [[-50, -240], [lerp(10, 60, b), lerp(-310, -404, b)]]; P.mood = 'wow'; if (b > 0.6 && !st.thrown) { st.thrown = true; var h = handAt(P, 1); PLANE.t = t; PLANE.x = h[0]; PLANE.y = h[1]; CR.burst('spark', h[0], h[1], t); } }
      else { PAPER.on = false; P.hands = [[-96, -380 + Math.sin(t * 14) * 8], [96, -380 - Math.sin(t * 14) * 8]]; P.look = lerp(P.look, -0.8, 0.1); P.hop = Math.abs(Math.sin(t * 9)) * 6; }
      return; }
    var c = (t + 2) % 12;
    if (c < 6.5) { P.hands = [[-48, -300], [48, -300]]; P.tilt = 0.08; P.look = lerp(P.look, Math.sin(t * 0.8) * 0.25, 0.1);
      var pg = c - 4.6; if (pg > 0 && pg < 0.8) { PAPER.flip = pg / 0.8; P.hands = [[-48, -300], [lerp(48, -36, Math.sin(PAPER.flip * Math.PI)), -304]]; } }
    else if (c < 9.5) { var r2 = clamp(Math.min((c - 6.5) / 0.4, (9.5 - c) / 0.4), 0, 1); P.hands = [[-48, lerp(-300, -246, r2)], [48, lerp(-300, -246, r2)]]; P.look = lerp(P.look, -0.85, 0.08); P.tilt = -0.04 * r2; P.mood = r2 > 0.6 ? 'happy' : 'calm'; }
    else { P.hands = [[-48, -300], [48, -300]]; P.tilt = 0.1; P.look = lerp(P.look, 0.2, 0.1); }
  }

  function gd(P, t, S) { /* points travellers to their line, hands out a leaflet, checks the time. Tap: unfolds the line map, turns it round to show you */
    var st = S.cast.gd; if (tapped(st, t)) st.boom = false; var u = (t - (st.c == null ? -99 : st.c)) / 2.6;
    P.sx = 1; P.tilt = 0; P.hop = 0; P.talk = t < st.until; P.mood = P.talk ? 'happy' : 'calm'; LEAF.out = false; LEAF.k = 0; LEAF.flip = 1; lookAt(P, S, st, t, 0.5);
    if (u >= 0 && u < 1) { P.talk = u > 0.25; P.mood = 'happy';
      if (u < 0.25) { var a = u / 0.25; LEAF.k = a; P.hands = [[lerp(-80, -60, a), lerp(-180, -300, a)], [lerp(80, 60, a), lerp(-180, -300, a)]]; P.look = 0; }
      else if (u < 0.7) { LEAF.k = 1; P.hands = [[-92, -300], [92, -300]]; P.hop = Math.abs(Math.sin((u - 0.25) * 14)) * 4; P.look = 0;
        if (!st.boom) { st.boom = true; CR.burst('conf', P.x, P.y - 230, t); } }
      else { var b = (u - 0.7) / 0.3; LEAF.k = 1; LEAF.flip = Math.cos(b * Math.PI) < 0 ? -1 : 1; P.hands = [[-92, -300], [92, -300]]; P.sx = Math.cos(b * Math.PI * 2) >= 0 ? 1 : -1; P.mood = 'happy'; }
      return; }
    var c = (t + 3) % 11;
    if (c < 4) { var w = Math.sin(t * 1.3) * 10; P.hands = [[-70, -176], [150 + w, -330 + w]]; P.look = lerp(P.look, 0.85, 0.08); P.mood = 'happy'; }
    else if (c < 7) { var r = clamp(Math.min((c - 4) / 0.4, (7 - c) / 0.4), 0, 1); LEAF.out = true; P.hands = [[-60, -196], [lerp(70, 128, r), lerp(-190, -236, r)]]; P.look = lerp(P.look, -0.3, 0.08); }
    else if (c < 9) { P.hands = [[-12, -248], [18, -238]]; P.look = lerp(P.look, 0.05, 0.1); P.tilt = 0.06; }
    else { P.hands = [[-84, -178], [84, -178]]; P.look = lerp(P.look, Math.sin(t * 1.4) * 0.6, 0.06); }
  }
  function tv(P, t, S) { /* scrolls her phone, looks up at the departures board, swings her feet. Tap: the phone pings (order synced) and she holds it up, delighted */
    var st = S.cast.tv; if (tapped(st, t)) { PING.t = t; CR.burst('heart', P.x, P.y - 230, t); } var u = (t - (st.c == null ? -99 : st.c)) / 2.2;
    P.sx = 1; P.tilt = 0; P.hop = 0; P.talk = t < st.until; P.mood = P.talk ? 'happy' : 'calm'; lookAt(P, S, st, t, 0.2);
    if (u >= 0 && u < 1) { P.talk = u > 0.3; P.mood = u < 0.25 ? 'wow' : 'happy';
      var a = clamp(u / 0.25, 0, 1); P.hands = [[lerp(-24, -70, a), lerp(-262, -300, a)], [lerp(26, 60, a), lerp(-268, -390, a)]]; P.look = lerp(P.look, 0.4, 0.2); P.hop = u > 0.25 ? Math.abs(Math.sin((u - 0.25) * 16)) * 6 : 0; return; }
    var c = (t + 5) % 12;
    if (c < 6) { var k2 = Math.sin(t * 7) > 0.6 ? 3 : 0; P.hands = [[-24, -262], [26, -268 - k2]]; P.look = lerp(P.look, 0.15, 0.1); P.tilt = 0.05; }
    else if (c < 9) { P.hands = [[-36, -236], [36, -240]]; P.look = lerp(P.look, -0.35, 0.08); P.tilt = -0.07; P.mood = 'happy'; }
    else { P.hands = [[-30, -244], [34, -250]]; P.tilt = Math.sin(t * 2.2) * 0.05; P.look = lerp(P.look, 0.7, 0.06); }
  }

  window.IXW.worlds.integration = {
    pan: [-300, 1200],
    paintBg: paintBg, windowBehind: true, paintFrame: paintFrame, paintBack: paintBack, paintFront: paintFront, paintFore: paintFore,
    paintWindow: function (g, t, par, S) { /* clouds drift past the glass, a city train crosses its viaduct */
      var e = S.ext, w = e.r - e.l + 500;
      for (var c = 0; c < 5; c++) { var x = e.l - 250 + ((hash(c + 2) * w + t * (5 + c * 1.6)) % w) - par * (2 + c); K.cloud(g, x, -100 + (c % 3) * 70 + hash(c) * 20, 0.34 + (c % 2) * 0.12); }
      var tx = e.l - 120 + ((t * 45) % (e.r - e.l + 240)); for (var k2 = 0; k2 < 4; k2++) { fillRR(g, tx - k2 * 30, 271, 28, 9, 3, '#FFFFFF'); g.fillStyle = TEAL; g.fillRect(tx - k2 * 30, 276, 28, 2); }
    },
    paintLive: paintLive, paintFrontLive: paintFrontLive, paintForeLive: paintForeLive,
    moteCol: 'rgba(20,163,139,.2)',
    glow: (function () { var o = {}; SYS.forEach(function (s) { o[s.key] = function (g) { rr(g, s.x - 8, s.y - 8, 164, 68, 14); }; });
      o.lever = function (g) { rr(g, T.lever.x - 52, F - 112, 104, 116, 14); }; return o; })(),
    backGlow: ['store', 'market', 'pay', 'bank', 'mail', 'api'],
    calmView: [125, -40, 750, 600],
    cast: [
      { id: 'en1', behind: true, keys: ['store', 'pay'], P: EN1, act: en1 },
      { id: 'en2', behind: true, keys: ['bank', 'mail'], P: EN2, act: en2 },
      { id: 'cn', behind: true, keys: ['market', 'api'], P: CN, act: cn },
      { id: 'ps', behind: true, keys: [], P: PS, act: ps },
      { id: 'gd', behind: true, keys: [], P: GD, act: gd },
      { id: 'tv', behind: true, keys: [], P: TV, act: tv }
    ],
    toy: function (name, S, t) { if (name === 'lever') { PLUG.t = t; PLUG.k = (PLUG.k + 2) % SYS.length; CR.burst('spark', T.lever.x, F - 110, t); } },
    hit: function (x, y, S, t, onBtn) {
      var r = CR.hitWalker(x, y, t); if (r) return r;
      var bx = botX(t); if (Math.abs(x - bx) < 32 && y > 612 && y < 664) { BOT.t = t; FLY.t = t; return { say: 'Beep! The platform **stays clean**, like data that is never typed twice.', near: [clamp(bx - 160, 220, 860), 236], pose: 'love' }; }
      if (x > 1124 && x < 1206 && y > 606 && y < 652) { FLY.t = t; return { say: 'Coo! Even the **pigeons** know: every line runs to Odoo Central.', near: [860, 236], pose: 'wow' }; }
      var e = S.ext, tk = track(e), spd = 170, len = 760, span = e.r - e.l + len + 500, fx = e.l - 120 + ((t - FT.t0) * spd) % span;
      if (y > tk.r2 - 90 && y < tk.r2 + 6 && x < fx + 14 && x > fx - len) { BOOST.t = t; return { say: 'The **freight** to Odoo Central: orders, stock and payouts ride the same line, every day.', near: [clamp(x, 220, 860), 236], pose: 'wow' }; }
      if (!onBtn && y > 330 && y < 470) { var u = (t + 3) % 30; if (u >= 5 && u < 13 && x > T.dock && x < T.dock + 620) return { say: 'The **express** waits at platform 6, then runs across the station: connected once, synced every day.', near: [840, 236], pose: 'point-right' }; }
      return null;
    },
    onStop: function () {}
  };
})(window.IXW && window.IXW.kit, window.CR, window.CO);
