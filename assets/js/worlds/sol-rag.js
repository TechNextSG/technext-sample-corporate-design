/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: sol-rag (/solutions/ai-knowledge) — a RAG knowledge assistant as a grand reading room. Every shelf is one of your
   sources (manuals, contracts, Odoo records, policies, tickets); a question is typed at the ask terminal; the robot librarian
   runs along the brass rail under the gallery, reaches down, pulls the one book that answers it, lays it open on the
   lectern and quotes the page, with the citation. The restricted shelves sit behind a brass cage: who may read a book
   decides who may get an answer from it (the finance lead's key card opens it, the robot is turned away when Sales asks).
   An empty slot on the shelf is a question the documents don't answer yet: it goes on the gap list. TechNext's knowledge
   engineer keeps the card catalogue (the index, each card with its access tab). Margins: a window nook with an armchair
   reader, a globe, the spiral stair to the gallery, the returns slot, new arrivals; a rug, book stacks and a sleeping
   library cat in front. TechNext staff wear the blue ID, client staff and visitors the grey pass. */
(function (K, CR, CO) {
  'use strict';
  if (!K || !CR || !CO) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed, tone = K.tone;
  var F = 470, GAL = -40, RAIL = -24, CEIL = -200;
  var INK = '#1F2A2E', WALL = '#F4EBD6', WOOD = '#7A5236', WOOD_D = '#563820', WOOD_L = '#A9774E', PARCH = '#FBF4E2', GRN = '#1F6B52', GRN_L = '#E1EFE7', GOLD = '#C8A24A', GOLD_D = '#9A7A2C', GOLD_L = '#F0D98C',
    OXB = '#8E2C3A', BLUE = '#3167CA', OK = '#1E9E6A', RED = '#C8453B', PUR = '#714B67';
  var SPINES = ['#8E2C3A', '#1F6B52', '#2F4A7A', '#C8A24A', '#6B4A8A', '#B4583A', '#3C7A6A', '#7A3B2E', '#3A5F9A', '#9A7A2C', '#5A6B3A', '#A33D57'];
  var BAYS = [[176, 'MANUALS'], [296, 'CONTRACTS'], [416, 'ODOO RECORDS'], [536, 'POLICIES'], [656, 'TICKETS']], BW = 120;
  var CAGE = { x: 784, w: 226 }, GATE = { x: 848, w: 70 }, CAT = { x: 176, y: 236, w: 88 }, LECT = { x: 730, y: 324 }, QC = { x: 638, y: 124, w: 188, h: 146 }, TERM = { x: 376, y: 290 };
  var TABLE = { x: 520, y: 386, w: 178 }, GAP = { x: 694, y: 40, w: 30 }, SHELF = { x: 596, y: 150 };
  var WINS = [{ x: 424, y: -194, w: 104, h: 104 }, { x: 784, y: -194, w: 104, h: 104 }, { x: -704, y: -194, w: 104, h: 104 }, { x: 1144, y: -194, w: 104, h: 104 }, { x: -900, y: 60, w: 120, h: 380 }, { x: 1240, y: -6, w: 104, h: 300 }];
  var Q = 'How do I claim travel expenses?', A = 'Submit the receipt in Expenses within 30 days. Your manager approves it, and Finance reimburses you with the next payroll.';
  function ease(u) { u = clamp(u, 0, 1); return u * u * (3 - 2 * u); }
  function hw(P, i) { var h = P.hands[i], sxk = P.sx == null ? 1 : P.sx; return [P.x + h[0] * P.s * sxk, P.y + (h[1] - (P.hop || 0) + (P.sit ? (P.sitDrop != null ? P.sitDrop : 46) : 0)) * P.s]; }
  function tapU(st, t, dur) { if (!st || !st.wave) return -1; var u = (t - (st.wave - 1.6)) / dur; return u >= 0 && u < 1 ? u : -1; }
  function looks(P, st, t, S, rest) { P.look = lerp(P.look, t < st.until ? clamp((S.nexi.x - P.x) / 160, -1, 1) : rest, 0.08); }
  function reset(P) { P.tilt = 0; P.sx = 1; P.hop = 0; P.mood = 'calm'; }
  function tick(g, x, y, r, col) { fillE(g, x, y, r, r, col || OK); g.strokeStyle = '#FFFFFF'; g.lineWidth = r * 0.3; g.lineCap = 'round'; g.beginPath(); g.moveTo(x - r * 0.45, y); g.lineTo(x - r * 0.1, y + r * 0.38); g.lineTo(x + r * 0.5, y - r * 0.38); g.stroke(); }
  function cross(g, x, y, r) { fillE(g, x, y, r, r, RED); g.strokeStyle = '#FFFFFF'; g.lineWidth = r * 0.3; g.lineCap = 'round'; g.beginPath(); g.moveTo(x - r * 0.4, y - r * 0.4); g.lineTo(x + r * 0.4, y + r * 0.4); g.moveTo(x + r * 0.4, y - r * 0.4); g.lineTo(x - r * 0.4, y + r * 0.4); g.stroke(); }
  function wrap(g, s, x, y, max, lh, size, weight, col) { var line = '', ln = 0; s.split(' ').forEach(function (w) { if ((line + w).length > max && line) { text(g, line.trim(), x, y + ln * lh, size, weight, col); line = ''; ln++; } line += w + ' '; }); if (line.trim()) text(g, line.trim(), x, y + ln * lh, size, weight, col); return ln + 1; }
  function winPath(g, w) { var r = w.w / 2; g.moveTo(w.x, w.y + w.h); g.lineTo(w.x, w.y + r); g.arc(w.x + r, w.y + r, r, Math.PI, 0); g.lineTo(w.x + w.w, w.y + w.h); g.closePath(); }
  function padlock(g, x, y, s, open) { g.strokeStyle = GOLD_D; g.lineWidth = 3 * s; g.beginPath(); g.arc(x, y - 6 * s - (open ? 5 * s : 0), 6 * s, Math.PI, 0); g.stroke(); fillRR(g, x - 9 * s, y - 6 * s, 18 * s, 15 * s, 3 * s, GOLD); fillE(g, x, y + 0.5 * s, 2.2 * s, 2.2 * s, WOOD_D); }
  /* one shelf of books between x0 and x1, standing on y (deterministic heights and colours) */
  function books(g, x0, x1, y, seed, maxH) { var x = x0 + 2, i = 0; while (x < x1 - 6) { var w = 6 + Math.floor(hash(seed + i * 1.7) * 6), h = (maxH || 48) - Math.floor(hash(seed + i * 2.9) * 14), c = SPINES[Math.floor(hash(seed + i * 4.1) * SPINES.length)];
      if (x + w > x1 - 2) break; if (hash(seed + i * 5.3) > 0.93 && x + 14 < x1) { g.save(); g.translate(x + 2, y); g.rotate(-0.22); fillRR(g, 0, -h, w, h, 1.2, c); g.restore(); x += w + 8; i++; continue; }
      fillRR(g, x, y - h, w, h, 1.2, c); g.fillStyle = 'rgba(255,255,255,.22)'; g.fillRect(x + 1, y - h + 1, 1.4, h - 2); g.fillStyle = 'rgba(240,217,140,.75)'; g.fillRect(x + 0.5, y - h + 5, w - 1, 1.6); g.fillRect(x + 0.5, y - 9, w - 1, 1.6); x += w + 0.6; i++; } }
  function bookcase(g, x, w, top, bot, seed, rows) { fillRR(g, x, top, w, bot - top, 2, WOOD); fillRR(g, x + 6, top + 6, w - 12, bot - top - 10, 1, '#E9DAB8'); g.fillStyle = 'rgba(120,80,40,.10)'; g.fillRect(x + 6, top + 6, 8, bot - top - 10); var gap = (bot - top - 10) / rows;
    for (var r = 1; r <= rows; r++) { var sy = top + 6 + r * gap, obj = hash(seed + r * 3.3) > 0.7 && w > 90, x1 = obj ? x + w - 36 : x + w - 7; books(g, x + 7, x1, sy - 4, seed + r * 13, Math.min(50, gap - 16));
      if (obj) shelfObj(g, x + w - 22, sy - 4, Math.floor(hash(seed + r * 7.7) * 4));
      fillRR(g, x + 4, sy - 4, w - 8, 6, 1, WOOD_L); g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(x + 6, sy + 2, w - 12, 2); } }
  function shelfObj(g, x, y, k) { /* a vase, a bust, a small plant or a brass bookend clock on the shelf */
    if (k === 0) { fillE(g, x, y - 14, 9, 13, '#3A6EA5'); fillRR(g, x - 4, y - 32, 8, 8, 2, '#3A6EA5'); fillE(g, x - 3, y - 18, 2.4, 5, 'rgba(255,255,255,.35)'); }
    else if (k === 1) { fillRR(g, x - 9, y - 10, 18, 10, 2, '#D8D0C2'); fillE(g, x, y - 20, 9, 7, '#EEE8DC'); fillE(g, x, y - 32, 7, 8, '#F4EFE6'); }
    else if (k === 2) { fillRR(g, x - 8, y - 12, 16, 12, 3, '#B4583A'); [[-6, -22], [0, -28], [6, -22], [-2, -18], [4, -16]].forEach(function (l) { fillE(g, x + l[0], y + l[1], 4.4, 6, '#3FA66B'); }); }
    else { fillRR(g, x - 9, y - 22, 18, 22, 4, GOLD_D); fillE(g, x, y - 12, 6.4, 6.4, '#FFFDF5'); g.strokeStyle = INK; g.lineWidth = 1; g.beginPath(); g.moveTo(x, y - 12); g.lineTo(x, y - 16); g.moveTo(x, y - 12); g.lineTo(x + 3, y - 11); g.stroke(); } }

  /* ------------------------------ the static layers ------------------------------ */
  function paintBg(g, W, H, k, sx, sy) {
    g.save(); g.translate(sx, sy); g.scale(k, k); var e = { l: -(sx + 24) / k, r: (W - sx) / k, t: -(sy + 24) / k, b: (H - sy) / k };
    CO.sky(g, e, -320, 480, [[0, '#7CC0EE'], [0.55, '#BCE1F7'], [1, '#E8F5FC']]);
    /* outside the windows: treetops, a garden, a low city */
    CO.skyPH(g, e.l, e.r, -110, -60, { tall: 1500, hazy: 'rgba(170,200,215,.55)', near: ['#B8D7DE', '#C6DFE3', '#ADCBD6'] });
    g.fillStyle = '#A7D7A0'; g.fillRect(e.l, 300, e.r - e.l, 200);
    for (var i = 0; i < 26; i++) { var tx = e.l + i * 96 + hash(i) * 30, ty = 260 + hash(i + 3) * 60; fillRR(g, tx - 3, ty, 6, 90, 3, '#7A5236'); fillE(g, tx, ty - 10, 42, 54, i % 2 ? '#4FAE6A' : '#3E9C5B'); fillE(g, tx - 12, ty - 26, 16, 18, 'rgba(255,255,255,.14)'); }
    g.restore();
  }
  function paintWindow(g, t) {
    for (var c = 0; c < 8; c++) { var span = 2600, x = -1100 + ((hash(c + 7) * span + t * (4 + (c % 3) * 2)) % span); K.cloud(g, x, -170 + (c % 3) * 26, 0.18 + (c % 2) * 0.05); }
    for (var b = 0; b < 2; b++) { var u = ((t * 0.04 + b * 0.5) % 1), bx = -1000 + u * 2500, by = -160 + Math.sin(t * 0.6 + b) * 10 + b * 22, fl = Math.sin(t * 9 + b) * 3;
      g.strokeStyle = '#3B4A60'; g.lineWidth = 1.6; g.lineCap = 'round'; g.beginPath(); g.moveTo(bx - 6, by - fl); g.quadraticCurveTo(bx - 3, by - 3, bx, by); g.quadraticCurveTo(bx + 3, by - 3, bx + 6, by - fl); g.stroke(); }
    /* the trees outside the nook window sway */
    for (var tr = 0; tr < 3; tr++) { var sw = Math.sin(t * 1.1 + tr) * 4; fillE(g, -880 + tr * 44 + sw, 250 + tr * 30, 30, 36, tr % 2 ? '#57B874' : '#45A463'); }
  }
  function paintBack(g, e) {
    /* the wall with the windows cut out */
    g.beginPath(); g.rect(e.l - 10, e.t - 10, e.r - e.l + 20, F - e.t + 10); WINS.forEach(function (w) { winPath(g, w); }); g.fillStyle = WALL; g.fill('evenodd');
    /* the vaulted ceiling: gilded ribs and rosettes, the chandelier */
    var cg = g.createLinearGradient(0, e.t, 0, CEIL); cg.addColorStop(0, '#F1E6CC'); cg.addColorStop(1, '#FAF3E2'); g.fillStyle = cg; g.fillRect(e.l - 10, e.t - 10, e.r - e.l + 20, CEIL - e.t + 10);
    g.strokeStyle = 'rgba(200,162,74,.35)'; g.lineWidth = 2; g.beginPath(); for (var rx = Math.floor(e.l / 160) * 160; rx < e.r + 160; rx += 160) { g.moveTo(rx, CEIL - 18); g.quadraticCurveTo(rx + 80, CEIL - 120, rx + 160, CEIL - 18); } g.stroke();
    for (var rs = Math.floor(e.l / 160) * 160; rs < e.r; rs += 160) { fillE(g, rs + 80, CEIL - 96, 7, 7, 'rgba(200,162,74,.45)'); fillE(g, rs + 80, CEIL - 96, 3, 3, '#FAF3E2'); }
    fillRR(g, e.l - 10, CEIL - 18, e.r - e.l + 20, 18, 2, WOOD_L); g.fillStyle = GOLD; g.fillRect(e.l - 10, CEIL - 2, e.r - e.l + 20, 3); for (var dx = Math.floor(e.l / 24) * 24; dx < e.r; dx += 24) fillRR(g, dx, CEIL - 14, 14, 9, 2, WOOD);
    /* ---- the upper gallery: bookcases between the tall windows ---- */
    for (var ux = Math.floor(e.l / BW) * BW + 56; ux < e.r; ux += BW) { var win = WINS.some(function (w) { return w.y < -150 && ux < w.x + w.w && ux + BW > w.x; }); if (win) continue; bookcase(g, ux, BW, CEIL + 4, GAL - 46, ux * 0.37, 2); }
    WINS.forEach(function (w) { g.lineWidth = 7; g.strokeStyle = WOOD; g.beginPath(); winPath(g, w); g.stroke(); g.lineWidth = 2.6; g.strokeStyle = WOOD_D; g.beginPath(); g.moveTo(w.x + w.w / 2, w.y + 4); g.lineTo(w.x + w.w / 2, w.y + w.h); for (var my = w.y + w.w / 2 + 30; my < w.y + w.h; my += 46) { g.moveTo(w.x, my); g.lineTo(w.x + w.w, my); } g.stroke();
      g.fillStyle = 'rgba(255,255,255,.25)'; g.beginPath(); g.moveTo(w.x + 14, w.y + w.h); g.lineTo(w.x + 56, w.y + 26); g.lineTo(w.x + 70, w.y + 26); g.lineTo(w.x + 28, w.y + w.h); g.closePath(); g.fill(); fillRR(g, w.x - 8, w.y + w.h, w.w + 16, 8, 3, WOOD_L); });
    /* light falling from the high windows */
    [476, 836].forEach(function (lx) { var lg = g.createLinearGradient(0, -90, 0, F); lg.addColorStop(0, 'rgba(255,248,220,.32)'); lg.addColorStop(1, 'rgba(255,248,220,0)'); g.fillStyle = lg; g.beginPath(); g.moveTo(lx - 50, -90); g.lineTo(lx + 50, -90); g.lineTo(lx + 150, F); g.lineTo(lx - 10, F); g.closePath(); g.fill(); });
    /* ---- the lower level: bookcases wall to wall, each bay one source ---- */
    for (var lx2 = Math.floor(e.l / BW) * BW + 56; lx2 < e.r; lx2 += BW) { if (lx2 > -960 && lx2 < -760) continue; if (lx2 > 1200 && lx2 < 1360) continue; if (lx2 === -424 || lx2 === -304 || lx2 === -184) continue; bookcase(g, lx2, BW, -10, F, lx2 * 0.91 + 5, 7); }
    BAYS.forEach(function (b) { fillRR(g, b[0] + 14, -8, BW - 28, 16, 3, GOLD_D); fillRR(g, b[0] + 16, -6, BW - 32, 12, 2, GOLD_L); text(g, b[1], b[0] + BW / 2, 3, 7.4, 800, WOOD_D, 'center'); });
    /* the empty slot: a question the documents don't answer yet */
    var gp = GAP; fillRR(g, gp.x - 3, gp.y + 2, gp.w + 6, 50, 1, '#3A2616'); g.strokeStyle = 'rgba(240,217,140,.9)'; g.setLineDash([3, 3]); g.lineWidth = 1.4; rr(g, gp.x, gp.y + 6, gp.w, 44, 2); g.stroke(); g.setLineDash([]);
    /* the source book on POLICIES: the expense policy, green with a gold band */
    fillRR(g, SHELF.x - 5, SHELF.y - 48, 12, 46, 1.4, '#3C7A6A');
    /* ---- the restricted section: a brass cage over two bays ---- */
    var cx = CAGE.x, cw = CAGE.w; g.save(); g.beginPath(); g.rect(cx, 6, cw, F - 6); g.clip(); g.fillStyle = 'rgba(200,162,74,.10)'; g.fillRect(cx, 6, cw, F);
    g.strokeStyle = 'rgba(154,122,44,.75)'; g.lineWidth = 2; g.beginPath(); for (var d = -F; d < cw + F; d += 22) { g.moveTo(cx + d, 6); g.lineTo(cx + d + F, F + 6); g.moveTo(cx + d + F, 6); g.lineTo(cx + d, F + 6); } g.stroke(); g.restore();
    fillRR(g, cx - 4, 2, cw + 8, 8, 3, GOLD_D); [cx, cx + cw].forEach(function (px) { fillRR(g, px - 4, 2, 8, F - 2, 3, GOLD_D); fillRR(g, px - 2, 2, 3, F - 2, 1, GOLD_L); }); fillRR(g, GATE.x - 4, 160, 4, F - 160, 2, GOLD_D); fillRR(g, GATE.x + GATE.w, 160, 4, F - 160, 2, GOLD_D); fillRR(g, GATE.x - 4, 156, GATE.w + 8, 6, 3, GOLD_D);
    shadowed(g, 8, 3, 0.2, function () { fillRR(g, cx + 40, 18, cw - 80, 40, 6, OXB); }); g.strokeStyle = GOLD_L; g.lineWidth = 1.3; rr(g, cx + 44, 22, cw - 88, 32, 4); g.stroke();
    text(g, 'RESTRICTED', cx + cw / 2, 37, 11, 800, GOLD_L, 'center'); text(g, 'Finance · HR · by role', cx + cw / 2, 49, 7, 700, '#F6DCDF', 'center');
    /* the card reader on the cage */
    fillRR(g, 926, 300, 18, 28, 4, '#2A3142'); fillRR(g, 929, 304, 12, 8, 2, '#3A4458');
    /* ---- the card catalogue: the index, every card with its access tab ---- */
    var c = CAT; shadowed(g, 10, 4, 0.22, function () { fillRR(g, c.x, c.y, c.w, F - c.y, 4, WOOD_L); });
    fillRR(g, c.x - 4, c.y - 6, c.w + 8, 10, 3, WOOD); for (var dr = 0; dr < 7; dr++) for (var dc = 0; dc < 3; dc++) { var ddx = c.x + 6 + dc * 26.6, ddy = c.y + 12 + dr * 30; fillRR(g, ddx, ddy, 24, 26, 2, '#C08A58'); fillRR(g, ddx + 6, ddy + 4, 12, 7, 1, GOLD_L); g.fillStyle = WOOD_D; g.fillRect(ddx + 8, ddy + 6, 8, 1.2); g.fillRect(ddx + 8, ddy + 8.4, 6, 1.2); fillRR(g, ddx + 8, ddy + 16, 8, 4, 2, GOLD_D); }
    fillRR(g, c.x + 2, c.y - 30, 12, 24, 2, '#FFFFFF'); fillRR(g, c.x + 4, c.y - 26, 8, 2, 1, '#C9D3E3'); text(g, 'INDEX', c.x + c.w / 2 + 6, c.y - 12, 9, 800, GRN, 'center');
    /* ---- the ask terminal: a brass post and a small screen ---- */
    fillRR(g, TERM.x - 4, TERM.y + 40, 8, F - TERM.y - 40, 3, GOLD_D); fillRR(g, TERM.x - 20, F - 8, 40, 8, 3, WOOD_D); shadowed(g, 8, 3, 0.2, function () { fillRR(g, TERM.x - 30, TERM.y - 4, 60, 46, 6, '#2A3142'); });
    fillRR(g, TERM.x - 26, TERM.y + 42, 52, 8, 3, WOOD); text(g, 'ASK', TERM.x, TERM.y + 49, 6, 800, GOLD_L, 'center');
    /* ---- the lectern ---- */
    var L = LECT; fillRR(g, L.x - 6, L.y + 10, 12, F - L.y - 10, 3, WOOD); fillRR(g, L.x - 26, F - 10, 52, 10, 4, WOOD_D); g.fillStyle = WOOD_L; g.beginPath(); g.moveTo(L.x - 44, L.y + 16); g.lineTo(L.x + 44, L.y + 16); g.lineTo(L.x + 38, L.y - 2); g.lineTo(L.x - 38, L.y - 2); g.closePath(); g.fill(); fillRR(g, L.x - 46, L.y + 14, 92, 5, 2, WOOD_D);
    /* the inscription on the gallery front (drawn in front later) needs the beam here too, and the rail for the robot */
    fillRR(g, e.l - 10, RAIL - 3, e.r - e.l + 20, 6, 3, GOLD_D); g.fillStyle = GOLD_L; g.fillRect(e.l - 10, RAIL - 3, e.r - e.l + 20, 1.6);
    /* ---- the left margin: the window nook, the armchair, a globe, a sign ---- */
    var nw = WINS[4]; fillRR(g, nw.x - 16, nw.y + nw.h, nw.w + 32, 34, 6, WOOD); fillRR(g, nw.x - 8, nw.y + nw.h - 8, nw.w + 16, 14, 7, '#7FA88E'); fillRR(g, nw.x + 6, nw.y + nw.h - 26, 30, 22, 8, '#E9C46A'); fillRR(g, nw.x + 80, nw.y + nw.h - 24, 28, 20, 8, '#D9785A');
    g.fillStyle = WOOD; g.fillRect(nw.x - 16, nw.y - 20, 12, nw.h + 20); g.fillRect(nw.x + nw.w + 4, nw.y - 20, 12, nw.h + 20);
    cardWall(g);
    /* ---- the right margin: the spiral stair, the returns slot, new arrivals ---- */
    var sx = 1096; fillRR(g, sx - 5, GAL, 10, F - GAL, 4, GOLD_D);
    for (var st = 0; st < 14; st++) { var sy = F - 10 - st * 36, a = st * 0.9, w = Math.cos(a) * 62, front = Math.sin(a) > 0; g.fillStyle = front ? WOOD_L : WOOD; g.beginPath(); g.moveTo(sx, sy); g.lineTo(sx + w, sy - 6); g.lineTo(sx + w, sy + 2); g.lineTo(sx, sy + 8); g.closePath(); g.fill();
      g.strokeStyle = GOLD_D; g.lineWidth = 2; g.beginPath(); g.moveTo(sx + w, sy - 6); g.lineTo(sx + w, sy - 40); g.stroke(); }
    g.strokeStyle = GOLD; g.lineWidth = 3; g.beginPath(); for (var hs = 0; hs <= 14 * 8; hs++) { var ha = hs / 8 * 0.9, hy = F - 50 - hs / 8 * 36; g[hs ? 'lineTo' : 'moveTo'](sx + Math.cos(ha) * 62, hy); } g.stroke();
    fillRR(g, 1170, 330, 64, 78, 6, WOOD_D); fillRR(g, 1178, 344, 48, 8, 3, '#1A120B'); fillRR(g, 1176, 312, 68, 20, 4, GRN); text(g, 'RETURNS', 1210, 326, 8, 800, GOLD_L, 'center');
    /* new arrivals on a trolley */
    var nx = 1190; soft(g, nx, F + 4, 60, 7, 0.22); fillRR(g, nx - 56, 410, 112, 8, 3, WOOD); fillRR(g, nx - 56, 450, 112, 8, 3, WOOD); fillRR(g, nx - 54, 410, 6, 54, 2, WOOD_D); fillRR(g, nx + 48, 410, 6, 54, 2, WOOD_D); fillE(g, nx - 46, 466, 5, 5, INK); fillE(g, nx + 46, 466, 5, 5, INK);
    books(g, nx - 52, nx + 52, 410, 91, 34); [['SharePoint', '#3A5F9A'], ['Drive', '#3C7A6A'], ['PDFs', '#8E2C3A']].forEach(function (b, i) { fillRR(g, nx - 50 + i * 36, 422, 32, 12, 3, '#FFFFFF'); text(g, b[0], nx - 34 + i * 36, 430.6, 5.4, 800, b[1], 'center'); });
    fillRR(g, nx - 40, 380, 80, 18, 4, PARCH); text(g, 'NEW ARRIVALS', nx, 392, 7, 800, GRN, 'center');
    /* the floor: oak parquet in a herringbone */
    var fg = g.createLinearGradient(0, F, 0, e.b); fg.addColorStop(0, '#D9B98C'); fg.addColorStop(1, '#C9A473'); g.fillStyle = fg; g.fillRect(e.l - 10, F, e.r - e.l + 20, e.b - F + 10);
    g.strokeStyle = 'rgba(110,70,30,.18)'; g.lineWidth = 1.2; g.beginPath(); for (var py = F + 10, row = 0; py < e.b + 20; py += 18, row++) for (var px = Math.floor(e.l / 36) * 36 + (row % 2 ? 18 : 0); px < e.r + 36; px += 36) { g.moveTo(px, py); g.lineTo(px + 18, py - 9); g.moveTo(px, py); g.lineTo(px - 18, py - 9); } g.stroke();
    g.fillStyle = 'rgba(60,30,10,.12)'; g.fillRect(e.l - 10, F, e.r - e.l + 20, 6);
    rug(g, e);
    /* a round green rug under the long reading table */
    fillE(g, -282, 636, 178, 50, GOLD_D); fillE(g, -282, 636, 173, 47, '#2C6450'); g.strokeStyle = GOLD_L; g.lineWidth = 1.4; g.beginPath(); g.ellipse(-282, 636, 160, 41, 0, 0, 7); g.stroke(); g.strokeStyle = 'rgba(240,217,140,.3)'; g.lineWidth = 1; g.beginPath(); g.ellipse(-282, 636, 110, 27, 0, 0, 7); g.stroke();
  }
  function lamp(g, x, y, on) { fillRR(g, x - 10, y - 4, 20, 4, 2, GOLD_D); fillRR(g, x - 1.5, y - 26, 3, 22, 1, GOLD_D); g.fillStyle = '#1E7A55'; g.beginPath(); g.moveTo(x - 16, y - 24); g.quadraticCurveTo(x, y - 40, x + 16, y - 24); g.closePath(); g.fill(); g.fillStyle = 'rgba(255,255,255,.3)'; g.fillRect(x - 10, y - 30, 12, 2); fillRR(g, x - 16, y - 25, 32, 3, 1.5, GOLD); }
  /* ---- behind the title card: the regional map, a low reference shelf, the reading alcove, the globe, a step stool ---- */
  var GLX = -583, AX = -184, MAP = { x: -412, y: 8, w: 216, h: 188 }, LOW = { x: -420, w: 232, top: 300 };
  function land(g, m, pts) { g.beginPath(); pts.forEach(function (q, i) { g[i ? 'lineTo' : 'moveTo'](m.x + q[0], m.y + q[1]); }); g.closePath(); g.fillStyle = '#EADFB8'; g.fill(); g.strokeStyle = '#B49A5A'; g.lineWidth = 1.2; g.stroke(); }
  function cardWall(g) {
    fillRR(g, -424, 216, 240, 6, 2, WOOD_L);
    /* the map in a gilt frame under a brass picture light */
    var m = MAP; shadowed(g, 12, 5, 0.22, function () { fillRR(g, m.x - 12, m.y - 12, m.w + 24, m.h + 24, 5, GOLD_D); });
    fillRR(g, m.x - 9, m.y - 9, m.w + 18, m.h + 18, 4, GOLD); g.strokeStyle = GOLD_L; g.lineWidth = 1.2; rr(g, m.x - 6, m.y - 6, m.w + 12, m.h + 12, 3); g.stroke(); fillRR(g, m.x - 2, m.y - 2, m.w + 4, m.h + 4, 2, GOLD_D);
    fillRR(g, m.x, m.y, m.w, m.h, 2, '#D9EBEA'); g.save(); rr(g, m.x, m.y, m.w, m.h, 2); g.clip();
    g.strokeStyle = 'rgba(58,110,165,.18)'; g.lineWidth = 1; g.beginPath(); for (var wy = m.y + 10, row = 0; wy < m.y + m.h; wy += 12, row++) for (var wx = m.x + (row % 2 ? 0 : 11); wx < m.x + m.w; wx += 22) { g.moveTo(wx, wy); g.quadraticCurveTo(wx + 4, wy - 3, wx + 8, wy); } g.stroke();
    g.strokeStyle = 'rgba(154,122,44,.28)'; g.beginPath(); for (var gx = m.x + 36; gx < m.x + m.w; gx += 48) { g.moveTo(gx, m.y); g.lineTo(gx, m.y + m.h); } for (var gy = m.y + 40; gy < m.y + m.h; gy += 48) { g.moveTo(m.x, gy); g.lineTo(m.x + m.w, gy); } g.stroke();
    land(g, m, [[-4, -4], [150, -4], [140, 18], [128, 30], [124, 52], [112, 70], [96, 66], [86, 50], [84, 34], [70, 40], [64, 60], [70, 84], [84, 108], [98, 118], [92, 126], [76, 114], [62, 92], [52, 66], [40, 48], [24, 40], [-4, 44]]);
    land(g, m, [[30, 124], [56, 114], [80, 136], [100, 160], [94, 168], [70, 154], [44, 140]]);
    land(g, m, [[118, 118], [150, 100], [178, 106], [186, 128], [172, 150], [140, 154], [122, 140]]);
    land(g, m, [[176, 22], [188, 18], [194, 40], [186, 60], [196, 76], [188, 86], [176, 68], [172, 42]]); land(g, m, [[104, 174], [150, 176], [178, 182], [150, 186], [110, 184]]);
    [[40, 18, 30, 12], [150, 128, 18, 12], [110, 8, 26, 7]].forEach(function (f) { fillE(g, m.x + f[0], m.y + f[1], f[2], f[3], 'rgba(63,166,107,.22)'); });
    var pins = [[96, 117], [182, 44], [104, 62]]; g.strokeStyle = OXB; g.lineWidth = 1.4; g.setLineDash([3, 3]); g.beginPath(); g.moveTo(m.x + 96, m.y + 117); g.quadraticCurveTo(m.x + 156, m.y + 92, m.x + 182, m.y + 44); g.moveTo(m.x + 96, m.y + 117); g.quadraticCurveTo(m.x + 118, m.y + 92, m.x + 104, m.y + 62); g.stroke(); g.setLineDash([]);
    pins.forEach(function (q, i) { var px = m.x + q[0], py = m.y + q[1], c = i ? OXB : BLUE; fillE(g, px, py - 7, 5, 5, c); g.fillStyle = c; g.beginPath(); g.moveTo(px - 4, py - 5); g.lineTo(px, py + 1); g.lineTo(px + 4, py - 5); g.fill(); fillE(g, px, py - 7, 1.8, 1.8, '#FFFFFF'); });
    var cx = m.x + m.w - 30, cy = m.y + m.h - 36; g.fillStyle = GOLD_D; for (var r = 0; r < 4; r++) { var a0 = r * Math.PI / 2; g.beginPath(); g.moveTo(cx + Math.cos(a0) * 18, cy + Math.sin(a0) * 18); g.lineTo(cx + Math.cos(a0 + 0.7) * 5, cy + Math.sin(a0 + 0.7) * 5); g.lineTo(cx + Math.cos(a0 - 0.7) * 5, cy + Math.sin(a0 - 0.7) * 5); g.closePath(); g.fill(); }
    fillE(g, cx, cy, 3, 3, OXB); text(g, 'N', cx, cy - 21, 6.5, 800, WOOD_D, 'center'); g.restore();
    fillRR(g, m.x + 12, m.y + m.h - 30, 104, 22, 4, PARCH); g.strokeStyle = GOLD_D; g.lineWidth = 1; rr(g, m.x + 14, m.y + m.h - 28, 100, 18, 3); g.stroke(); text(g, 'OUR OFFICES · SG · PH · VN', m.x + 64, m.y + m.h - 16.4, 5.8, 800, WOOD_D, 'center');
    fillRR(g, m.x + m.w / 2 - 3, m.y - 28, 6, 16, 2, GOLD_D); fillRR(g, m.x + m.w / 2 - 46, m.y - 32, 92, 8, 4, GOLD); fillRR(g, m.x + m.w / 2 - 46, m.y - 26, 92, 2, 1, GOLD_D);
    var pl = g.createLinearGradient(0, m.y - 24, 0, m.y + 70); pl.addColorStop(0, 'rgba(255,240,190,.45)'); pl.addColorStop(1, 'rgba(255,240,190,0)'); g.fillStyle = pl; g.beginPath(); g.moveTo(m.x + m.w / 2 - 42, m.y - 24); g.lineTo(m.x + m.w / 2 + 42, m.y - 24); g.lineTo(m.x + m.w / 2 + 104, m.y + 70); g.lineTo(m.x + m.w / 2 - 104, m.y + 70); g.closePath(); g.fill();
    /* the low reference shelf: two rows of books, a bust, a fern, a vase and a clock on top */
    var L = LOW; shadowed(g, 10, 4, 0.2, function () { fillRR(g, L.x, L.top, L.w, F - L.top, 3, WOOD); }); fillRR(g, L.x - 6, L.top - 6, L.w + 12, 10, 3, WOOD_D); fillRR(g, L.x + 6, L.top + 34, L.w - 12, F - L.top - 44, 2, '#E9DAB8');
    [L.top + 100, L.top + 166].forEach(function (sy, i) { books(g, L.x + 8, L.x + L.w - 8, sy - 4, 400 + i * 37, 54); fillRR(g, L.x + 4, sy - 4, L.w - 8, 6, 1, WOOD_L); });
    fillRR(g, L.x + 4, F - 8, L.w - 8, 8, 2, WOOD_D); fillRR(g, L.x + L.w / 2 - 38, L.top + 10, 76, 16, 3, GOLD); fillRR(g, L.x + L.w / 2 - 36, L.top + 12, 72, 12, 2, GOLD_L); text(g, 'REFERENCE', L.x + L.w / 2, L.top + 21, 7, 800, WOOD_D, 'center');
    shelfObj(g, L.x + 30, L.top - 1, 1); shelfObj(g, L.x + 88, L.top - 1, 2); shelfObj(g, L.x + 150, L.top - 1, 0); shelfObj(g, L.x + 204, L.top - 1, 3);
    /* the reading alcove: an arched niche, a round window, a cushioned bench, two sconces, the quiet sign on the keystone */
    var a = AX, aw = 120, ar = 50, acx = a + aw / 2, acy = 104;
    fillRR(g, a, -10, aw, F + 10, 2, WOOD); fillRR(g, a + 3, -10, 3, F + 10, 1, WOOD_L); fillRR(g, a + aw - 6, -10, 3, F + 10, 1, WOOD_D);
    g.fillStyle = '#2C6450'; g.beginPath(); g.moveTo(a + 10, F); g.lineTo(a + 10, acy); g.arc(acx, acy, ar, Math.PI, 0); g.lineTo(a + aw - 10, F); g.closePath(); g.fill();
    g.fillStyle = 'rgba(240,217,140,.16)'; for (var dy = acy - 20, rw = 0; dy < F - 40; dy += 22, rw++) for (var dx = a + 22 + (rw % 2 ? 11 : 0); dx < a + aw - 14; dx += 22) { g.beginPath(); g.moveTo(dx, dy - 5); g.lineTo(dx + 4, dy); g.lineTo(dx, dy + 5); g.lineTo(dx - 4, dy); g.closePath(); g.fill(); }
    g.strokeStyle = GOLD; g.lineWidth = 2.4; g.beginPath(); g.moveTo(a + 10, F); g.lineTo(a + 10, acy); g.arc(acx, acy, ar, Math.PI, 0); g.lineTo(a + aw - 10, F); g.stroke();
    fillE(g, acx, 150, 29, 29, WOOD_D); var og = g.createLinearGradient(0, 124, 0, 176); og.addColorStop(0, '#86C6EE'); og.addColorStop(1, '#D8EFFA'); g.fillStyle = og; g.beginPath(); g.arc(acx, 150, 25, 0, 7); g.fill();
    g.save(); g.beginPath(); g.arc(acx, 150, 25, 0, 7); g.clip(); fillE(g, acx - 10, 172, 18, 12, '#57B874'); fillE(g, acx + 12, 174, 16, 11, '#45A463'); fillE(g, acx + 6, 136, 9, 4, 'rgba(255,255,255,.9)'); g.restore();
    g.strokeStyle = WOOD_D; g.lineWidth = 2.6; g.beginPath(); g.moveTo(acx - 25, 150); g.lineTo(acx + 25, 150); g.moveTo(acx, 125); g.lineTo(acx, 175); g.stroke();
    fillRR(g, a + 18, 392, 28, 32, 10, '#E9C46A'); fillRR(g, a + aw - 46, 394, 28, 30, 10, '#F4EBD6');
    fillRR(g, a + 16, 434, aw - 32, 36, 4, WOOD_D); fillRR(g, a + 22, 442, aw - 44, 2, 1, WOOD_L); fillRR(g, a + 12, 420, aw - 24, 16, 8, '#C8714E'); fillRR(g, a + 18, 422, aw - 36, 3, 2, 'rgba(255,255,255,.2)');
    [a + 5, a + aw - 5].forEach(function (sx) { fillRR(g, sx - 2, 238, 4, 14, 2, GOLD_D); fillRR(g, sx - 7, 250, 14, 4, 2, GOLD); fillRR(g, sx - 5, 222, 10, 16, 3, '#FFF6D8'); });
    shadowed(g, 6, 2, 0.2, function () { fillRR(g, acx - 52, 12, 104, 34, 6, GRN); }); g.strokeStyle = GOLD_L; g.lineWidth = 1.2; rr(g, acx - 48, 16, 96, 26, 4); g.stroke(); text(g, 'QUIET PLEASE', acx, 28, 8.6, 800, GOLD_L, 'center'); text(g, 'reading alcove', acx, 38, 6, 700, '#CFE6DA', 'center');
    /* the globe's stand */
    g.strokeStyle = WOOD_D; g.lineWidth = 4; g.beginPath(); g.moveTo(GLX - 20, F); g.lineTo(GLX, 400); g.moveTo(GLX + 20, F); g.lineTo(GLX, 400); g.moveTo(GLX, 400); g.lineTo(GLX, 380); g.stroke(); fillE(g, GLX, F - 1, 26, 4, 'rgba(0,0,0,.12)');
    g.strokeStyle = GOLD_D; g.lineWidth = 3; g.beginPath(); g.arc(GLX, 340, 44, -2.4, 0.9); g.stroke();
    /* the library step stool at the shelves, two books waiting on it */
    var sx2 = 8; fillRR(g, sx2 - 26, F - 50, 52, 8, 3, WOOD_L); fillRR(g, sx2 - 30, F - 26, 60, 8, 3, WOOD_L); fillRR(g, sx2 - 26, F - 50, 6, 50, 2, WOOD_D); fillRR(g, sx2 + 20, F - 50, 6, 50, 2, WOOD_D); fillRR(g, sx2 - 18, F - 60, 32, 10, 2, '#2F4A7A'); fillRR(g, sx2 - 14, F - 68, 26, 8, 2, OXB); g.fillStyle = GOLD_L; g.fillRect(sx2 - 15, F - 56, 26, 1.4);
  }
  /* the rug: a woven border, a lattice field and a medallion with the reading room's open-book crest */
  function rug(g, e) {
    var B = e.b + 20; function path(k) { g.beginPath(); g.moveTo(140 + k, 520 + k * 0.7); g.lineTo(1030 - k, 520 + k * 0.7); g.lineTo(1080 - k * 1.1, B); g.lineTo(90 + k * 1.1, B); g.closePath(); }
    path(0); g.fillStyle = OXB; g.fill(); g.save(); path(0); g.clip();
    path(9); g.strokeStyle = GOLD; g.lineWidth = 3; g.stroke(); path(15); g.fillStyle = '#6A1D29'; g.fill();
    g.fillStyle = 'rgba(240,217,140,.75)'; for (var bx = 168; bx < 1004; bx += 20) { g.beginPath(); g.moveTo(bx, 532); g.lineTo(bx + 5, 536.5); g.lineTo(bx, 541); g.lineTo(bx - 5, 536.5); g.closePath(); g.fill(); }
    path(30); g.fillStyle = OXB; g.fill(); g.strokeStyle = GOLD_L; g.lineWidth = 1.4; g.stroke(); g.save(); path(30); g.clip();
    g.strokeStyle = 'rgba(240,217,140,.16)'; g.lineWidth = 1.2; g.beginPath(); for (var d = 0; d < 1100; d += 40) { g.moveTo(100 + d, 540); g.lineTo(100 + d - 260, B); g.moveTo(100 + d - 160, 540); g.lineTo(100 + d + 100, B); } g.stroke();
    g.fillStyle = 'rgba(240,217,140,.3)'; for (var fx = 180; fx < 1000; fx += 40) for (var fy = 566; fy < B; fy += 36) fillE(g, fx + (Math.round((fy - 566) / 36) % 2 ? 20 : 0), fy, 2.2, 2.2, 'rgba(240,217,140,.3)');
    [[176, 554, 1], [994, 554, -1]].forEach(function (c) { g.fillStyle = 'rgba(240,217,140,.55)'; g.beginPath(); g.moveTo(c[0], c[1]); g.arc(c[0], c[1], 34, c[2] > 0 ? 0 : Math.PI / 2, c[2] > 0 ? Math.PI / 2 : Math.PI); g.closePath(); g.fill(); fillE(g, c[0], c[1], 10, 10, '#6A1D29'); });
    var mx = 585, my = 664; [-1, 1].forEach(function (s) { g.fillStyle = GOLD; g.beginPath(); g.moveTo(mx + s * 150, my - 10); g.lineTo(mx + s * 176, my); g.lineTo(mx + s * 150, my + 10); g.closePath(); g.fill(); });
    fillE(g, mx, my, 158, 50, GOLD); fillE(g, mx, my, 153, 46, '#6A1D29'); g.strokeStyle = 'rgba(240,217,140,.6)'; g.lineWidth = 1.2; g.beginPath(); g.ellipse(mx, my, 140, 40, 0, 0, 7); g.stroke();
    fillE(g, mx, my, 104, 30, GOLD_D); fillE(g, mx, my, 100, 27, GRN);
    g.fillStyle = 'rgba(240,217,140,.35)'; for (var ry = 0; ry < 16; ry++) { var ra = ry / 16 * Math.PI * 2; g.beginPath(); g.moveTo(mx + Math.cos(ra) * 60, my + Math.sin(ra) * 17); g.lineTo(mx + Math.cos(ra + 0.08) * 94, my + Math.sin(ra + 0.08) * 25); g.lineTo(mx + Math.cos(ra - 0.08) * 94, my + Math.sin(ra - 0.08) * 25); g.closePath(); g.fill(); }
    g.fillStyle = GOLD_L; g.beginPath(); g.moveTo(mx, my - 4); g.quadraticCurveTo(mx - 20, my - 12, mx - 40, my - 6); g.lineTo(mx - 40, my + 10); g.quadraticCurveTo(mx - 20, my + 4, mx, my + 12); g.quadraticCurveTo(mx + 20, my + 4, mx + 40, my + 10); g.lineTo(mx + 40, my - 6); g.quadraticCurveTo(mx + 20, my - 12, mx, my - 4); g.closePath(); g.fill();
    g.strokeStyle = GRN; g.lineWidth = 1.2; g.beginPath(); g.moveTo(mx, my - 4); g.lineTo(mx, my + 12); for (var ln = 0; ln < 3; ln++) { g.moveTo(mx - 34, my - 1 + ln * 4); g.quadraticCurveTo(mx - 18, my - 6 + ln * 4, mx - 5, my - 1 + ln * 4); g.moveTo(mx + 5, my - 1 + ln * 4); g.quadraticCurveTo(mx + 18, my - 6 + ln * 4, mx + 34, my - 1 + ln * 4); } g.stroke();
    fillRR(g, mx - 3, my + 10, 6, 14, 1, OXB);
    g.restore(); g.restore(); g.fillStyle = 'rgba(240,217,140,.7)'; for (var fr = 146; fr < 1030; fr += 8) g.fillRect(fr, 514, 3, 7);
  }
  function paintFront(g, e) {
    /* the gallery's front: the beam with its inscription, balusters and the handrail (over the gallery visitors' legs) */
    fillRR(g, e.l - 10, GAL, e.r - e.l + 20, 14, 2, WOOD); g.fillStyle = GOLD; g.fillRect(e.l - 10, GAL, e.r - e.l + 20, 2); g.fillRect(e.l - 10, GAL + 12, e.r - e.l + 20, 2);
    g.fillStyle = WOOD_D; for (var bx = Math.floor(e.l / 14) * 14; bx < e.r; bx += 14) { fillRR(g, bx, GAL - 42, 5, 42, 2, WOOD_L); fillE(g, bx + 2.5, GAL - 22, 4, 5, WOOD_L); }
    fillRR(g, e.l - 10, GAL - 48, e.r - e.l + 20, 8, 3, WOOD_D); g.fillStyle = GOLD; g.fillRect(e.l - 10, GAL - 48, e.r - e.l + 20, 1.6);
    shadowed(g, 6, 2, 0.2, function () { fillRR(g, 410, GAL - 4, 360, 22, 4, GRN); }); g.strokeStyle = GOLD_L; g.lineWidth = 1; rr(g, 413, GAL - 1, 354, 16, 3); g.stroke(); text(g, 'THE READING ROOM · APPROVED CONTENT ONLY', 590, GAL + 11, 8.6, 800, GOLD_L, 'center');
    /* the reading table: open, so the reader's chair and legs show; the lamp, a book stack, the laptop beside her */
    var T = TABLE; CO.desk(g, T.x, T.y, T.w, F, { open: true, legs: WOOD_D, top: WOOD }); g.fillStyle = 'rgba(31,107,82,.55)'; g.fillRect(T.x + 20, T.y + 1, T.w - 40, 4);
    [[T.x - 30, '#8E2C3A'], [T.x - 28, '#2F4A7A'], [T.x - 31, '#C8A24A']].forEach(function (b, i) { fillRR(g, b[0], F - 8 - i * 8, 30, 8, 1.5, b[1]); g.fillStyle = 'rgba(240,217,140,.6)'; g.fillRect(b[0] + 3, F - 6 - i * 8, 2, 4); });
    fillRR(g, T.x + 8, T.y - 2, 40, 3, 1, '#9AA6BC'); fillRR(g, T.x + 12, T.y - 34, 32, 30, 3, '#2A3142'); /* laptop lid at the table's end, beside the reader: its screen is live */
    fillRR(g, T.x + T.w - 58, T.y - 9, 14, 9, 3, '#FFFFFF'); g.strokeStyle = '#FFFFFF'; g.lineWidth = 2; g.beginPath(); g.arc(T.x + T.w - 42, T.y - 5, 3.4, -1.3, 1.3); g.stroke();
    /* the ask terminal's ledge */
    fillRR(g, TERM.x - 24, TERM.y + 38, 48, 6, 3, GOLD);
    /* the open book on the lectern (pages are live), the catalogue's top lamp */
    lamp(g, CAT.x + CAT.w - 18, CAT.y - 6, false);
  }
  /* ------------------------------ the cast ------------------------------ */
  var W = CR.who;
  var ENG = W({ x: 290, y: 470, s: 0.48, ph: 0.5, skin: 1, hair: 0, style: 'short', outfit: 'shirt', top: GRN, glasses: true, hands: [[-60, -196], [60, -196]], look: -0.4 });
  var ASK = W({ x: 434, y: 470, s: 0.48, ph: 1.6, skin: 3, hair: 2, style: 'pony', outfit: 'polo', top: BLUE, id: '#9AA6BC', hands: [[-60, -196], [60, -196]], look: 0.4 });
  var RDR = W({ x: 628, y: 470, s: 0.48, ph: 2.4, skin: 0, hair: 1, style: 'bob', outfit: 'cardigan', top: '#D9785A', top2: '#FFFFFF', sit: true, chairCol: WOOD_D, id: '#9AA6BC', hands: [[-50, -236], [50, -236]], look: 0 });
  var FIN = W({ x: 954, y: 470, s: 0.48, ph: 3.1, skin: 2, hair: 0, style: 'bun', outfit: 'cardigan', top: OXB, top2: PARCH, glasses: true, id: '#9AA6BC', hold: 'clipboard', hands: [[-40, -230], [60, -196]], look: -0.4 });
  var CREW = [
    { x0: 200, x1: 940, y: GAL, spd: 12, ph: 0.2, label: 'TechNext librarian', lines: ['Up here: more **policies and manuals**, all indexed.', 'Every answer **cites its page**, so you can check it.'], acts: ['wave', 'id', 'nod'],
      P: (function () { var P = W({ s: 0.3, skin: 2, hair: 1, style: 'short', outfit: 'polo', top: GRN, hold: 'tablet' }); P.fixS = true; return P; })() },
    { x0: 180, x1: 960, y: GAL, spd: 9, ph: 0.75, label: 'Visitor on the gallery', lines: ['Found it, **with the section number**.', 'It said "I don\'t know" instead of **guessing**. Good.'], acts: ['cheer', 'love', 'wave'],
      P: (function () { var P = W({ s: 0.3, skin: 4, hair: 3, style: 'long', outfit: 'cardigan', top: '#6B4A8A', top2: PARCH, id: '#9AA6BC', hold: 'clipboard' }); P.fixS = true; return P; })() }
  ];
  /* the book-stack visitor's own move: books overhead, a careful wobble, a bow */
  CR.ACT.ragBooks = { dur: 1.9, fx: 'star', pose: function (P, u, t) { P.mood = u < 0.3 ? 'wow' : 'happy'; var k = Math.min(1, u / 0.25); P.hands = [[lerp(-70, -40, k), lerp(-150, -430, k)], [lerp(70, 40, k), lerp(-150, -430, k)]];
    P.tilt = u > 0.25 && u < 0.75 ? Math.sin(t * 12) * 0.12 : u >= 0.8 ? 0.18 : 0; P.hop = u > 0.25 && u < 0.75 ? Math.abs(Math.sin(t * 12)) * 6 : 0; } };
  var FX = { fan: -9, bulb: -9, head: -9, key: -9, ladder: -9, lamp: -9, cat: -9, nook: -9, ret: -9 };
  /* the robot's cycle (12 s): home, to POLICIES, reach down, pull the book, to the lectern, lay it open, quote it, home */
  var RK = [[0, 470, 0], [1, 470, 0], [2.6, SHELF.x, 0], [3.4, SHELF.x, SHELF.y - 70], [4.2, SHELF.x, SHELF.y - 70], [5, SHELF.x, 0], [6.4, LECT.x, 0], [7.2, LECT.x, LECT.y - 52], [7.8, LECT.x, LECT.y - 52], [8.6, LECT.x, 0], [11, LECT.x, 0], [12, 470, 0]];
  var RL = [[0, 760, 0], [1, 880, 0], [1.6, 880, 150], [2.6, 880, 150], [3.2, 880, 0], [4, 760, 0]]; /* turned away at the cage */
  function key(arr, c) { for (var i = 0; i < arr.length - 1; i++) { var a = arr[i], b = arr[i + 1]; if (c >= a[0] && c <= b[0]) { var u = ease((c - a[0]) / (b[0] - a[0])); return [lerp(a[1], b[1], u), lerp(a[2], b[2], u)]; } } return [arr[0][1], arr[0][2]]; }
  function rCyc(S, t) { return S.hot === 'fetch' || S.hot === 'cite' ? ((t - (S.kT || 0)) * 1.1 + (S.hot === 'cite' ? 7.6 : 0.6)) % 12 : (t * 0.8) % 12; }
  function lockMode(S) { return S.hot === 'locked'; }

  function actEng(P, t, S) { /* the knowledge engineer: pulls a catalogue drawer, reads a card, tabs it with its access rule, files it; tap: fans the cards into the air */
    var st = S.cast.eng, u = tapU(st, t, 2.2), c = (t + 0.4) % 8, busy = S.hot === 'index'; reset(P); P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm'; P.card = 0; P.drawer = 0;
    if (u >= 0) { P.talk = true; P.mood = 'happy'; P.drawer = 1; var k2 = ease(u / 0.25); P.hands = u < 0.25 ? [[lerp(-60, -90, k2), -230], [60, -196]] : [[-110, -420 + Math.sin(t * 12) * 8], [110, -420 - Math.sin(t * 12) * 8]]; P.hop = u > 0.25 ? Math.abs(Math.sin(u * Math.PI * 3)) * 12 : 0;
      if (u > 0.25 && !st._b) { st._b = 1; FX.fan = t; } return; }
    st._b = 0;
    if (busy || c < 1.8) { P.hands = [[lerp(-60, -92, ease(c / 0.6)), lerp(-196, -232, ease(c / 0.6))], [60, -196]]; P.drawer = ease(c / 0.6); P.look = lerp(P.look, -0.8, 0.1); P.tilt = -0.06; }
    else if (c < 3.8) { P.hands = [[-34, -262 + Math.sin(t * 2) * 3], [34, -262]]; P.card = 1; P.drawer = 1; P.look = lerp(P.look, 0, 0.1); }
    else if (c < 5) { P.hands = [[-34, -262], [lerp(34, 4, Math.abs(Math.sin(t * 8))), -270]]; P.card = 2; P.drawer = 1; P.mood = 'happy'; }
    else if (c < 6.4) { var f = ease((c - 5) / 0.8); P.hands = [[lerp(-34, -92, f), lerp(-262, -232, f)], [60, -196]]; P.drawer = 1 - ease((c - 5.8) / 0.6); P.card = f < 0.9 ? 1 : 0; P.look = lerp(P.look, -0.7, 0.1); }
    else { P.hands = [[-60, -196], [60, -196]]; looks(P, st, t, S, 0.4); P.tilt = Math.sin(t * 1.2) * 0.03; }
  }
  function actAsk(P, t, S) { /* the sales rep: types the question, waits for the robot, reads the answer, thumbs up; tap: a light-bulb moment */
    var st = S.cast.ask, u = tapU(st, t, 2.0), c = rCyc(S, t), busy = S.hot === 'ask'; reset(P); P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm'; P.thumb = 0;
    if (u >= 0) { P.talk = true; P.mood = u < 0.3 ? 'wow' : 'happy'; P.hands = u < 0.3 ? [[-60, -196], [60, -330]] : [[-60, -196], [40, -440 + Math.sin(t * 16) * 6]]; P.hop = Math.sin(u * Math.PI) * 30; if (u > 0.2 && !st._b) { st._b = 1; FX.bulb = t; CR.burst('star', P.x, P.y - 280, t); } return; }
    st._b = 0;
    if (busy || c < 1.4) { var kk = Math.abs(Math.sin(t * 11)) * 6; P.hands = [[-112, -290 - kk], [-40, -270 - (6 - kk)]]; P.look = lerp(P.look, -0.7, 0.1); P.tilt = -0.05; }
    else if (c < 3.6) { P.hands = [[-60, -196], [60, -196]]; P.look = lerp(P.look, 0.6, 0.1); P.tilt = -0.1; P.hop = Math.abs(Math.sin(t * 6)) * 3; }
    else if (c < 6.2) { P.hands = [[-50, -230], [-10, -300]]; P.look = lerp(P.look, 0.3, 0.1); P.tilt = 0.06; }
    else if (c < 8.2) { P.hands = [[-40, -200], [40, -200]]; P.look = lerp(P.look, 1, 0.1); }
    else if (c < 10.6) { P.hands = [[-50, -196], c > 9.4 ? [90, -360] : [60, -196]]; P.thumb = c > 9.4 ? 1 : 0; P.look = lerp(P.look, 1, 0.1); P.mood = 'happy'; P.tilt = Math.sin(t * 8) * 0.05; }
    else { P.hands = [[-60, -196], [60, -196]]; looks(P, st, t, S, 0.2); }
  }
  function actRdr(P, t, S) { /* the reader at the table: reads, turns a page, asks on the laptop, sips tea, gives feedback; tap: balances the book on her head */
    var st = S.cast.rdr, u = tapU(st, t, 2.2), c = (t + 2) % 10, busy = S.hot === 'gap'; reset(P); P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm'; P.book = 1; P.cup = 0; P.fb = 0;
    if (u >= 0) { P.talk = true; P.mood = 'happy'; P.book = 2; P.hands = [[-60, -420], [60, -420]]; P.tilt = Math.sin(t * 7) * 0.1; P.hop = Math.abs(Math.sin(t * 7)) * 5; if (!st._b) { st._b = 1; FX.head = t; CR.burst('heart', P.x, P.y - 260, t); } return; }
    st._b = 0;
    if (busy) { P.book = 0; P.hands = [[-50, -236], [80, -380]]; P.fb = 1; P.mood = 'happy'; P.look = lerp(P.look, 0.3, 0.1); return; }
    if (c < 3) { P.hands = [[-34, -246], [c > 2.3 && c < 2.9 ? lerp(34, -20, (c - 2.3) / 0.6) : 34, -246]]; P.look = lerp(P.look, 0, 0.1); P.tilt = 0.05; }
    else if (c < 5) { P.book = 0; var kk = Math.abs(Math.sin(t * 10)) * 6; P.hands = [[-150, -236 - kk], [-104, -236 - (6 - kk)]]; P.look = lerp(P.look, -1, 0.1); P.sx = 0.92; }
    else if (c < 6.6) { P.book = 0; P.cup = 1; P.hands = [[-40, -236], [10, -340]]; P.look = lerp(P.look, 0.1, 0.1); P.mood = 'happy'; }
    else if (c < 8) { P.book = 0; P.fb = 1; P.hands = [[-50, -236], [80, -380]]; P.mood = 'happy'; }
    else { P.hands = [[-34, -246], [34, -246]]; looks(P, st, t, S, 0); }
  }
  function actFin(P, t, S) { /* the finance lead: reads her ledger, swipes the key card, the gate opens for her role; tap: twirls the key card, role badges pop */
    var st = S.cast.fin, u = tapU(st, t, 2.2), c = (t + 1) % 9, busy = S.hot === 'locked'; reset(P); P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm'; P.card = 1;
    if (u >= 0) { P.talk = true; P.mood = 'happy'; var a = t * 12; P.hands = [[-40, -230], [40 + Math.cos(a) * 30, -400 + Math.sin(a) * 30]]; P.hop = Math.abs(Math.sin(u * Math.PI * 2)) * 10; if (!st._b) { st._b = 1; FX.key = t; CR.burst('spark', P.x, P.y - 300, t); } return; }
    st._b = 0;
    if (c < 2.6) { P.hands = [[-40, -230], [10, -250]]; P.look = lerp(P.look, -0.2, 0.1); P.tilt = 0.06; }
    else if (c < 4) { var r = ease((c - 2.6) / 0.6); P.hands = [[-40, -230], [lerp(10, -50, r), lerp(-250, -310, r)]]; P.look = lerp(P.look, -0.9, 0.1); }
    else if (c < 6) { P.hands = [[-40, -230], [60, -196]]; P.mood = 'happy'; P.look = lerp(P.look, -0.8, 0.1); P.tilt = Math.sin((c - 4) * Math.PI * 2) * 0.05; }
    else { P.hands = [[-40, -230], [60, -196]]; looks(P, st, t, S, -0.3); }
    if (busy) { P.hands = [[-40, -230], [-110, -300]]; P.look = -1; }
  }

  /* ------------------------------ the card zone's life: the long table, the alcove, the returns trolley ------------------------------ */
  var TBL = { x: -430, y: 500, w: 300, F: 590 }, TRL = { x: -10, y: 606 }, SIDE = { x: 956, y: 690 }, TAP = { ta: -9, tb: -9, al: -9, st: -9 };
  var TA = W({ x: -352, y: 590, s: 0.52, ph: 0.7, skin: 2, hair: 1, style: 'short', outfit: 'shirt', top: '#3A5F9A', glasses: true, sit: true, chairCol: WOOD_D, id: '#9AA6BC', hands: [[-34, -246], [34, -246]] });
  var TB = W({ x: -206, y: 590, s: 0.52, ph: 2.2, skin: 0, hair: 0, style: 'bob', outfit: 'cardigan', top: '#2F4A7A', top2: '#FFFFFF', sit: true, chairCol: WOOD_D, hands: [[-34, -246], [60, -236]] });
  var AL = W({ x: -124, y: 470, s: 0.44, ph: 1.3, skin: 3, hair: 0, style: 'short', outfit: 'polo', top: '#B4583A', sit: true, chair: false, sitDrop: 30, id: '#9AA6BC', hands: [[-70, -270], [70, -270]] });
  var ST = W({ x: 100, y: 612, s: 0.53, ph: 3.3, skin: 1, hair: 0, style: 'short', outfit: 'polo', top: '#6B4A8A', hands: [[-60, -196], [60, -196]] }); ST.feet = true;
  function tapOn(k, t, d) { var u = (t - TAP[k]) / d; return u >= 0 && u < 1 ? u : -1; }
  function heldBook(g, x, y, col, open) { if (open) { fillRR(g, x - 18, y - 10, 36, 20, 2, col); fillRR(g, x - 16, y - 9, 15, 17, 1, PARCH); fillRR(g, x + 1, y - 9, 15, 17, 1, PARCH); g.fillStyle = '#C9B98F'; for (var l = 0; l < 3; l++) { g.fillRect(x - 14, y - 5 + l * 4, 11, 1.2); g.fillRect(x + 3, y - 5 + l * 4, 11, 1.2); } }
    else { fillRR(g, x - 7, y - 16, 14, 30, 1.6, col); g.fillStyle = GOLD_L; g.fillRect(x - 7, y - 11, 14, 1.6); g.fillRect(x - 7, y + 8, 14, 1.6); } }
  function readers(g, t) { /* paintFrontLive, before the cached table: the reader with the policy binder and the TechNext engineer at her laptop */
    var u = tapOn('ta', t, 2.4), c = (t + 1.1) % 9; reset(TA); TA.book = 1; TA.flip = -1; TA.talk = u >= 0;
    if (u >= 0) { TA.mood = 'wow'; TA.hands = u < 0.35 ? [[-34, -246], [24, -350]] : [[-30, -246], [60, -420]]; TA.hop = Math.sin(u * Math.PI) * 10; TA.book = u < 0.35 ? 1 : 3; if (u > 0.35) TA.mood = 'happy'; }
    else if (c < 3.2) { TA.hands = [[-34, -246], [34, -246]]; TA.tilt = 0.05; TA.look = lerp(TA.look || 0, 0, 0.1); }
    else if (c < 4) { TA.flip = (c - 3.2) / 0.8; TA.hands = [[-34, -246], [lerp(34, -20, ease(TA.flip)), -252]]; }
    else if (c < 6.4) { TA.book = 0; TA.hands = [[-40, -236], [62 + Math.sin(t * 9) * 8, -232]]; TA.look = lerp(TA.look || 0, 0.5, 0.1); TA.tilt = 0.1; }
    else { TA.hands = [[-34, -246], [34, -246]]; TA.look = lerp(TA.look || 0, Math.sin(t * 0.6) * 0.6, 0.06); TA.mood = 'happy'; }
    K.person(g, TA, t); var a0 = hw(TA, 0), a1 = hw(TA, 1);
    if (TA.book === 1) { var bx = (a0[0] + a1[0]) / 2, by = (a0[1] + a1[1]) / 2 - 6; heldBook(g, bx, by, OXB, true); if (TA.flip >= 0) { var fw = Math.cos(TA.flip * Math.PI) * 15; g.fillStyle = '#FFFDF5'; g.beginPath(); g.moveTo(bx, by - 9); g.lineTo(bx + fw, by - 10 - Math.sin(TA.flip * Math.PI) * 5); g.lineTo(bx + fw, by + 7); g.lineTo(bx, by + 8); g.closePath(); g.fill(); g.strokeStyle = 'rgba(120,90,40,.4)'; g.lineWidth = 0.8; g.stroke(); } }
    if (TA.book === 3) { heldBook(g, a1[0], a1[1] - 12, OXB, false); g.globalAlpha = clamp((1 - u) * 3, 0, 1); fillRR(g, TA.x - 30, TA.y - 282, 60, 17, 8.5, '#FFFFFF'); text(g, '§ 4.2 found', TA.x, TA.y - 270.5, 7, 800, GRN, 'center'); g.globalAlpha = 1; }
    if (TA.book === 0) fillE(g, a1[0], a1[1] - 4, 2, 7, '#E2B23A');
    var v = tapOn('tb', t, 2.4), d = (t + 3.7) % 10; reset(TB); TB.talk = v >= 0; TB.pen = 0;
    if (v >= 0) { TB.mood = 'happy'; var a = t * 14; TB.hands = [[-34, -246], [60 + Math.cos(a) * 12, -340 + Math.sin(a) * 12]]; TB.pen = 2; TB.hop = Math.abs(Math.sin(v * Math.PI * 2)) * 8; }
    else if (d < 4.5) { var k2 = Math.abs(Math.sin(t * 11)) * 6; TB.hands = [[44, -236 - k2], [100, -236 - (6 - k2)]]; TB.look = lerp(TB.look || 0, 0.9, 0.1); TB.sx = 0.94; }
    else if (d < 7) { TB.hands = [[-30, -246], [30, -246]]; TB.look = lerp(TB.look || 0, -0.1, 0.1); TB.tilt = -0.05; TB.pen = 1; }
    else if (d < 8.2) { TB.hands = [[-34, -246], [56, -340]]; TB.mood = 'happy'; TB.look = lerp(TB.look || 0, 0.4, 0.1); TB.tilt = Math.sin(t * 8) * 0.06; TB.pen = 3; }
    else { TB.hands = [[-34, -246], [60, -236]]; TB.look = lerp(TB.look || 0, Math.sin(t * 0.5) * 0.7, 0.05); }
    K.person(g, TB, t); var b0 = hw(TB, 0), b1 = hw(TB, 1);
    if (TB.pen === 1) heldBook(g, (b0[0] + b1[0]) / 2, (b0[1] + b1[1]) / 2 - 6, '#3C7A6A', true);
    if (TB.pen === 2) { g.save(); g.translate(b1[0], b1[1] - 8); g.rotate(t * 16); fillRR(g, -1.6, -13, 3.2, 26, 1.2, '#E2B23A'); fillRR(g, -1.6, 9, 3.2, 4, 1, '#E98A9A'); g.restore(); g.globalAlpha = clamp((1 - v) * 3, 0, 1); fillRR(g, TB.x - 34, TB.y - 280, 68, 17, 8.5, GRN); tick(g, TB.x - 22, TB.y - 271.5, 5); text(g, 'citation ok', TB.x + 6, TB.y - 268.5, 7, 800, '#FFFFFF', 'center'); g.globalAlpha = 1; }
    if (TB.pen === 3) thumb(g, b1[0], b1[1] - 12, 0.9);
  }
  function alcove(g, t) { /* paintLive: the visitor on the alcove bench reads the paper, lowers it for tea; tap: drops it in surprise */
    var u = tapOn('al', t, 2.4), c = (t + 0.3) % 11, P = AL, paper = 1, cup = 0; reset(P); P.talk = u >= 0;
    if (u >= 0) { P.mood = u < 0.4 ? 'wow' : 'happy'; paper = u < 0.4 ? 2 : 1; P.hands = u < 0.4 ? [[-60, -200], [60, -200]] : [[-70, -270], [70, -270]]; P.hop = u < 0.4 ? Math.sin(u / 0.4 * Math.PI) * 14 : 0; }
    else if (c < 6) { P.hands = [[-70, -270 + Math.sin(t * 1.3) * 3], [70, -270 - Math.sin(t * 1.3) * 3]]; P.tilt = Math.sin(t * 0.8) * 0.04; }
    else if (c < 8.6) { paper = 2; cup = 1; P.hands = [[-56, -200], [16, -330]]; P.mood = 'happy'; P.look = 0.2; }
    else { P.hands = [[-70, -270], [70, -270]]; P.look = Math.sin(t) * 0.3; }
    K.person(g, P, t); var h0 = hw(P, 0), h1 = hw(P, 1);
    if (paper === 1) { var x0 = h0[0] - 6, x1 = h1[0] + 6, py = Math.min(h0[1], h1[1]) - 26; fillRR(g, x0, py, x1 - x0, 44, 1.5, '#FBF8F0'); g.fillStyle = 'rgba(0,0,0,.08)'; g.fillRect((x0 + x1) / 2 - 0.6, py, 1.2, 44);
      text(g, u >= 0.4 ? 'ANSWER FOUND' : 'THE DAILY INDEX', (x0 + x1) / 2, py + 9, 5.4, 800, u >= 0.4 ? GRN : INK, 'center'); g.fillStyle = '#C9C2B2'; for (var l = 0; l < 4; l++) { g.fillRect(x0 + 4, py + 15 + l * 6, (x1 - x0) / 2 - 8, 2); g.fillRect((x0 + x1) / 2 + 4, py + 15 + l * 6, (x1 - x0) / 2 - 8, 2); } fillRR(g, x0 + 5, py + 13, 14, 12, 1, '#B8D7DE'); }
    else { fillRR(g, P.x - 26, 414, 44, 9, 1.5, '#FBF8F0'); g.fillStyle = '#C9C2B2'; g.fillRect(P.x - 22, 417, 34, 1.5); }
    if (cup) { fillRR(g, h1[0] - 5, h1[1] - 12, 10, 10, 3, '#FFFFFF'); } else fillRR(g, AX + 96, 410, 9, 9, 3, '#FFFFFF');
    if (u >= 0 && u < 0.4) text(g, '!', P.x + 26, P.y - 196, 16, 800, OXB, 'center');
  }
  function staffer(g, t) { /* zfore: the TechNext librarian at the returns trolley: lifts a book, scans it, shelves it; tap: tosses one and catches it */
    var u = tapOn('st', t, 2.4), c = (t + 2.5) % 8, P = ST, bk = 0, scan = false; reset(P); P.talk = u >= 0;
    if (u >= 0) { P.mood = 'happy'; var arc = Math.sin(u * Math.PI); P.hands = [[-40, -300 - arc * 50], [40, -300 - arc * 50]]; P.look = 0; P.hop = arc * 6; bk = 2; }
    else if (c < 1.6) { var k = ease(c / 0.8); P.hands = [[lerp(-60, -124, k), lerp(-196, -226, k)], [60, -196]]; P.look = lerp(P.look || 0, -0.9, 0.1); P.tilt = -0.06; bk = c > 1 ? 1 : 0; }
    else if (c < 3.8) { P.hands = [[-30, -300], [44, -290]]; bk = 1; scan = c > 2.2 && c < 3.4; P.look = lerp(P.look || 0, 0, 0.1); }
    else if (c < 5.2) { var k3 = ease((c - 3.8) / 1.4); P.hands = [[lerp(-30, -124, k3), lerp(-300, -226, k3)], [60, -196]]; bk = c < 5 ? 1 : 0; P.look = lerp(P.look || 0, -0.8, 0.1); }
    else { P.hands = [[-60, -196], [60, -196]]; P.look = lerp(P.look || 0, Math.sin(t * 0.7) * 0.8, 0.05); P.mood = 'happy'; }
    K.person(g, P, t); var h0 = hw(P, 0), h1 = hw(P, 1);
    if (bk === 1) heldBook(g, h0[0] + 4, h0[1] - 12, '#2F4A7A', false);
    if (bk === 2) { var bx = P.x + Math.sin(u * Math.PI * 2) * 8, by = P.y - (330 + 110 * Math.sin(u * Math.PI)) * P.s; g.save(); g.translate(bx, by); g.rotate(u * Math.PI * 4); heldBook(g, 0, 0, '#2F4A7A', false); g.restore(); }
    if (scan || bk === 1) { fillRR(g, h1[0] - 4, h1[1] - 14, 9, 16, 2.5, '#2A3142'); fillRR(g, h1[0] - 3, h1[1] - 12, 7, 4, 1, '#6FD3A8'); }
    if (scan) { g.strokeStyle = 'rgba(232,69,59,' + (0.55 + 0.35 * Math.sin(t * 30)).toFixed(2) + ')'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(h1[0] - 4, h1[1] - 12); g.lineTo(h0[0] + 10, h0[1] - 10); g.stroke(); if (c > 3) { fillRR(g, P.x - 30, P.y - 268, 60, 15, 7.5, '#FFFFFF'); text(g, 're-indexed', P.x, P.y - 257.6, 6.6, 800, GRN, 'center'); } }
  }
  function trolley(g, x, y) { var x0 = x - 60, w = 120; soft(g, x, y + 4, 66, 8, 0.22);
    fillRR(g, x0 + 2, y - 92, 6, 86, 2, WOOD_D); fillRR(g, x0 + w - 8, y - 92, 6, 86, 2, WOOD_D);
    books(g, x0 + 8, x0 + w - 8, y - 88, 77, 40); books(g, x0 + 8, x0 + w - 8, y - 42, 83, 34);
    fillRR(g, x0, y - 90, w, 8, 3, WOOD); fillRR(g, x0, y - 44, w, 8, 3, WOOD); fillRR(g, x0 + 4, y - 14, w - 8, 6, 3, WOOD_L);
    g.strokeStyle = GOLD_D; g.lineWidth = 3; g.lineCap = 'round'; g.beginPath(); g.moveTo(x0 + w - 5, y - 90); g.lineTo(x0 + w + 8, y - 112); g.lineTo(x0 + w + 8, y - 120); g.stroke();
    fillE(g, x0 + 12, y - 3, 6, 6, INK); fillE(g, x0 + w - 12, y - 3, 6, 6, INK); fillE(g, x0 + 12, y - 3, 2, 2, '#9AA6BC'); fillE(g, x0 + w - 12, y - 3, 2, 2, '#9AA6BC');
    fillRR(g, x - 36, y - 88, 72, 14, 3, PARCH); text(g, 'TO RESHELVE', x, y - 78.4, 6.6, 800, GRN, 'center'); }
  function fern(g, x, y, k) { soft(g, x, y + 4, 40 * k, 7, 0.24); g.strokeStyle = '#2E8A55'; g.lineWidth = 3; g.lineCap = 'round'; for (var f = 0; f < 9; f++) { var a = -Math.PI / 2 + (f - 4) * 0.3; g.beginPath(); g.moveTo(x, y - 40 * k); g.quadraticCurveTo(x + Math.cos(a) * 34 * k, y - 40 * k + Math.sin(a) * 52 * k, x + Math.cos(a) * 56 * k, y - 40 * k + Math.sin(a) * 34 * k + 26 * k); g.stroke(); }
    fillRR(g, x - 22 * k, y - 40 * k, 44 * k, 40 * k, 9 * k, '#B4583A'); fillRR(g, x - 26 * k, y - 44 * k, 52 * k, 9 * k, 4 * k, '#C8714E'); }
  function vitrine(g, x, y) { /* a glass display case on turned legs: the oldest book in the room, open under glass */
    soft(g, x, y + 4, 44, 7, 0.24); fillRR(g, x - 34, y - 46, 6, 46, 2, WOOD_D); fillRR(g, x + 28, y - 46, 6, 46, 2, WOOD_D); fillRR(g, x - 30, y - 20, 60, 4, 2, WOOD);
    fillRR(g, x - 40, y - 58, 80, 14, 3, WOOD); fillRR(g, x - 38, y - 92, 76, 36, 3, 'rgba(214,236,244,.55)'); g.strokeStyle = GOLD_D; g.lineWidth = 2; rr(g, x - 38, y - 92, 76, 36, 3); g.stroke();
    fillRR(g, x - 24, y - 66, 48, 8, 1, OXB); fillRR(g, x - 22, y - 70, 21, 9, 1, PARCH); fillRR(g, x + 1, y - 70, 21, 9, 1, PARCH); g.fillStyle = 'rgba(255,255,255,.6)'; g.fillRect(x - 30, y - 90, 4, 30); g.fillRect(x - 22, y - 90, 2, 30);
    fillRR(g, x - 18, y - 54, 36, 8, 2, GOLD_L); text(g, 'FIRST EDITION', x, y - 48.2, 4.6, 800, WOOD_D, 'center'); }
  function bookStack(g, x, y, n, seed) { soft(g, x, y + 3, 36, 6, 0.24); for (var i = 0; i < n; i++) { var w = 52 - (i % 3) * 6, c = SPINES[Math.floor(hash(seed + i) * SPINES.length)], ox = x - w / 2 + (i % 2 ? 3 : -2); fillRR(g, ox, y - 10 - i * 10, w, 10, 2, c); g.fillStyle = PARCH; g.fillRect(ox + w - 4, y - 8 - i * 10, 3, 6); } }
  function paintFore(g, e) { /* static foreground (cached): the long reading table, the returns trolley, the cat's cushion, the rug's side table, a fern */
    var T = TBL; CO.desk(g, T.x, T.y, T.w, T.F, { open: true, legs: WOOD_D, top: WOOD }); g.fillStyle = 'rgba(31,107,82,.6)'; g.fillRect(T.x + 14, T.y + 2, T.w - 28, 4);
    lamp(g, -404, T.y, false); lamp(g, -268, T.y, false);
    [['#8E2C3A', 0], ['#2F4A7A', 2], ['#C8A24A', -1]].forEach(function (b, i) { fillRR(g, -318 + b[1], T.y - 8 - i * 7, 30, 7, 1.5, b[0]); });
    fillRR(g, -176, T.y - 3, 46, 3, 1, '#9AA6BC'); fillRR(g, -172, T.y - 36, 36, 32, 3, '#2A3142');
    trolley(g, TRL.x, TRL.y);
    soft(g, CATP.x, CATP.y + 6, 42, 7, 0.24); fillE(g, CATP.x, CATP.y - 2, 40, 13, OXB); fillE(g, CATP.x, CATP.y - 8, 36, 10, '#A63A4A'); [-1, 1].forEach(function (d) { fillE(g, CATP.x + d * 38, CATP.y - 2, 4, 4, GOLD); });
    var S2 = SIDE; soft(g, S2.x, S2.y + 3, 30, 6, 0.24); fillE(g, S2.x, S2.y - 2, 18, 4, WOOD_D); fillRR(g, S2.x - 3, S2.y - 50, 6, 48, 2, WOOD_D); fillE(g, S2.x, S2.y - 52, 30, 7, WOOD); fillE(g, S2.x, S2.y - 54, 28, 5, WOOD_L);
    lamp(g, S2.x - 8, S2.y - 54, false); fillRR(g, S2.x + 8, S2.y - 63, 10, 9, 3, '#FFFFFF'); fillRR(g, S2.x + 2, S2.y - 56, 22, 3, 1.5, '#FFFFFF'); fillRR(g, S2.x - 26, S2.y - 59, 16, 5, 1, '#3C7A6A');
    fern(g, 1036, 704, 0.8); bookStack(g, -830, 702, 5, 3); vitrine(g, -692, 664); bookStack(g, 1206, 702, 4, 5);
  }
  function tableLive(g, t) { /* the lamps' glow breathes, the laptop beside the engineer updates, motes drift in the lamplight */
    [[-404, 0], [-268, 1.7], [SIDE.x - 8, 3.1]].forEach(function (l) { var y = l[0] === SIDE.x - 8 ? SIDE.y - 54 : TBL.y, f = 0.2 + 0.05 * Math.sin(t * 2.3 + l[1]) + 0.03 * Math.sin(t * 7.1 + l[1] * 2);
      g.save(); g.globalAlpha = f; g.fillStyle = '#FFE9A8'; g.beginPath(); g.moveTo(l[0] - 14, y - 24); g.lineTo(l[0] + 14, y - 24); g.lineTo(l[0] + 30, y); g.lineTo(l[0] - 30, y); g.closePath(); g.fill(); g.restore(); fillRR(g, l[0] - 12, y - 25, 24, 2, 1, '#FFF1B8'); });
    var lx = -168, ly = TBL.y - 32; fillRR(g, lx, ly, 28, 25, 2, '#FFFFFF'); fillRR(g, lx, ly, 28, 6, 2, GRN); g.fillRect(lx, ly + 3, 28, 3); var n = Math.floor(t * 1.4) % 4;
    for (var r = 0; r < 3; r++) fillRR(g, lx + 3, ly + 9 + r * 5, r === n % 3 ? 22 : 14 + r * 2, 2.6, 1.2, r === n % 3 ? BLUE : '#C9D3E3'); fillRR(g, lx + 20, ly + 19, 6, 4, 1, OK);
    if (TA.book === 0) { fillRR(g, -322 + 36, TBL.y - 4, 24, 4, 1, '#FFFFFF'); }
    for (var i = 0; i < 7; i++) { var p = (t * 0.05 + hash(i * 3.1)) % 1, mx = -440 + hash(i * 7.7) * 320 + Math.sin(t * 0.7 + i) * 8, my = 470 - p * 160; g.globalAlpha = Math.sin(p * Math.PI) * 0.6; fillE(g, mx, my, 1.4, 1.4, '#FFF4D6'); } g.globalAlpha = 1;
  }
  /* ------------------------------ the live layers ------------------------------ */
  function robot(g, t, S) { /* the robot librarian on the gallery rail: its cab, face, arm and gripper; the book it carries */
    var lk = lockMode(S), c = rCyc(S, t), p = lk ? key(RL, (t - (S.kT || 0)) % 4) : key(RK, c), x = p[0], arm = p[1], bob = Math.sin(t * 3) * 1.5, carry = !lk && c > 4.2 && c < 7.8;
    /* the trolley on the rail */
    fillE(g, x - 14, RAIL, 5, 5, '#3A2616'); fillE(g, x + 14, RAIL, 5, 5, '#3A2616'); fillRR(g, x - 3, RAIL, 6, 12, 2, GOLD_D);
    /* the telescopic arm and its gripper */
    var ay = 40 + bob + arm, scan = !lk && c > 2.6 && c < 3.6;
    if (scan) { g.save(); g.globalAlpha = 0.22 + 0.08 * Math.sin(t * 9); g.fillStyle = GOLD_L; g.beginPath(); g.moveTo(x - 8, 40 + bob); g.lineTo(x + 8, 40 + bob); g.lineTo(x + 40, SHELF.y + 4); g.lineTo(x - 40, SHELF.y + 4); g.closePath(); g.fill(); g.restore(); }
    if (arm > 2) { g.lineCap = 'round'; g.strokeStyle = '#3A2616'; g.lineWidth = 10; g.beginPath(); g.moveTo(x, 40 + bob); g.lineTo(x, ay); g.stroke(); g.strokeStyle = GOLD; g.lineWidth = 6.5; g.stroke(); g.strokeStyle = GOLD_L; g.lineWidth = 2; g.beginPath(); g.moveTo(x - 1.5, 44 + bob); g.lineTo(x - 1.5, ay - 4); g.stroke();
      for (var s = 1; s < 4; s++) fillRR(g, x - 6, 40 + bob + arm * s / 4, 12, 5, 2, GOLD_D); }
    var grip = carry || (!lk && c > 3.4 && c < 4.2) ? 5 : 12; g.strokeStyle = '#2A3142'; g.lineWidth = 4; g.lineCap = 'round'; g.beginPath(); g.moveTo(x - 3, ay); g.lineTo(x - grip, ay + 14); g.lineTo(x - grip + 3, ay + 18); g.moveTo(x + 3, ay); g.lineTo(x + grip, ay + 14); g.lineTo(x + grip - 3, ay + 18); g.stroke(); fillE(g, x, ay, 7, 7, '#2A3142'); fillE(g, x, ay, 3, 3, GOLD_L);
    if (carry) { g.save(); g.globalAlpha = 0.35; fillE(g, x, ay + 28, 18, 26, GOLD_L); g.restore(); fillRR(g, x - 7, ay + 8, 14, 42, 1.6, '#3C7A6A'); g.fillStyle = GOLD_L; g.fillRect(x - 7, ay + 14, 14, 2); g.fillRect(x - 7, ay + 42, 14, 2); }
    /* the cab */
    shadowed(g, 8, 3, 0.2, function () { fillRR(g, x - 32, -14 + bob, 64, 56, 16, '#F4EAD2'); }); fillRR(g, x - 32, -14 + bob, 64, 10, 6, GRN); fillRR(g, x - 24, -2 + bob, 48, 30, 10, '#123B2E');
    var bl = ((t + 0.7) % 3.9) < 0.12, reading = !lk && c > 7.6 && c < 11, happy = !lk && c > 9.4 && c < 11;
    [-1, 1].forEach(function (d) { var ex = x + d * 10; if (bl) fillRR(g, ex - 5, 11 + bob, 10, 2.6, 1.2, GOLD_L); else if (happy) { g.strokeStyle = GOLD_L; g.lineWidth = 2.4; g.beginPath(); g.arc(ex, 15 + bob, 5, Math.PI * 1.15, Math.PI * 1.85); g.stroke(); } else { fillE(g, ex, 11 + bob, 4.6, 5.6, GOLD_L); fillE(g, ex - 1.4, 9 + bob, 1.4, 1.4, '#FFFFFF'); } });
    if (lk && ((t - (S.kT || 0)) % 4) > 1.5 && ((t - (S.kT || 0)) % 4) < 3) { g.strokeStyle = '#F6A3A0'; g.lineWidth = 2; g.beginPath(); g.moveTo(x - 6, 20 + bob); g.quadraticCurveTo(x, 16 + bob, x + 6, 20 + bob); g.stroke(); }
    else { g.strokeStyle = GOLD_L; g.lineWidth = 2; g.beginPath(); g.arc(x, 17 + bob, 4.4, 0.3, Math.PI - 0.3); g.stroke(); }
    fillE(g, x - 34, 18 + bob, 4, 8, GOLD_D); fillE(g, x + 34, 18 + bob, 4, 8, GOLD_D); fillRR(g, x - 10, 32 + bob, 20, 6, 3, GOLD);
    if (reading) { g.save(); g.globalAlpha = 0.16 + 0.06 * Math.sin(t * 6); g.fillStyle = GOLD_L; g.beginPath(); g.moveTo(x - 10, 26 + bob); g.lineTo(x + 10, 26 + bob); g.lineTo(LECT.x + 34, LECT.y - 4); g.lineTo(LECT.x - 34, LECT.y - 4); g.closePath(); g.fill(); g.restore(); }
    /* turned away at the cage */
    if (lk) { var lc = (t - (S.kT || 0)) % 4; if (lc > 1.5 && lc < 3) { cross(g, 880, 150, 11); fillRR(g, 838, 168, 84, 18, 9, '#FFFFFF'); text(g, 'Not for Sales', 880, 180.5, 8, 800, RED, 'center'); } }
    /* the book on the shelf is out while it's being read */
    if (!lk && c > 4.2 && c < 11.6) { fillRR(g, SHELF.x - 5, SHELF.y - 48, 12, 46, 1.4, '#2A1A0E'); }
    if (!lk && c > 3 && c < 4.2) { g.strokeStyle = 'rgba(240,217,140,' + (0.5 + 0.4 * Math.sin(t * 8)).toFixed(2) + ')'; g.lineWidth = 2.4; rr(g, SHELF.x - 9, SHELF.y - 52, 20, 54, 3); g.stroke(); }
  }
  function lectern(g, t, S) { /* the open book on the lectern and the quote card above it */
    var c = rCyc(S, t), on = !lockMode(S) && c > 7.6 && c < 11.8, L = LECT;
    if (on) { var fl = c < 8.2 ? (c - 7.6) / 0.6 : 1; g.fillStyle = '#FFFDF5'; g.beginPath(); g.moveTo(L.x, L.y - 2); g.lineTo(L.x - 40 * fl, L.y - 6); g.lineTo(L.x - 36 * fl, L.y + 12); g.lineTo(L.x, L.y + 14); g.closePath(); g.fill();
      g.beginPath(); g.moveTo(L.x, L.y - 2); g.lineTo(L.x + 40, L.y - 6); g.lineTo(L.x + 36, L.y + 12); g.lineTo(L.x, L.y + 14); g.closePath(); g.fill(); g.strokeStyle = 'rgba(120,90,40,.4)'; g.lineWidth = 1; g.stroke();
      g.fillStyle = '#C9B98F'; for (var l = 0; l < 4; l++) { g.fillRect(L.x - 34 * fl, L.y - 1 + l * 3.2, 28 * fl, 1.2); g.fillRect(L.x + 6, L.y - 1 + l * 3.2, 28, 1.2); } if (c > 8.6) { g.fillStyle = 'rgba(255,214,90,.75)'; g.fillRect(L.x + 6, L.y + 5.4, 28, 2.6); } }
    else { fillRR(g, L.x - 22, L.y - 6, 44, 12, 2, '#3C7A6A'); g.fillStyle = PARCH; g.fillRect(L.x - 20, L.y + 2, 40, 3); }
    /* the quote card: question, answer typed from the page, the citation (searching while the robot fetches) */
    var Qc = QC, show = on && c > 8.2, a = show ? Math.floor(clamp((c - 8.4) * 40, 0, A.length)) : 0;
    g.strokeStyle = 'rgba(200,162,74,.8)'; g.setLineDash([3, 4]); g.lineWidth = 1.4; g.beginPath(); g.moveTo(L.x, Qc.y + Qc.h); g.lineTo(L.x, L.y - 8); g.stroke(); g.setLineDash([]);
    shadowed(g, 14, 5, 0.25, function () { fillRR(g, Qc.x - 4, Qc.y - 4, Qc.w + 8, Qc.h + 8, 10, GOLD); }); fillRR(g, Qc.x, Qc.y, Qc.w, Qc.h, 8, PARCH); fillRR(g, Qc.x, Qc.y, Qc.w, 20, 8, GRN); g.fillRect(Qc.x, Qc.y + 12, Qc.w, 8);
    text(g, 'ANSWER · from your documents', Qc.x + 10, Qc.y + 14, 7.4, 800, GOLD_L); fillRR(g, Qc.x + 8, Qc.y + 26, Qc.w - 16, 17, 5, '#EDE3C8'); text(g, Q, Qc.x + 14, Qc.y + 37.6, 7.6, 800, '#5C4A2A');
    if (show) { wrap(g, A.slice(0, a), Qc.x + 10, Qc.y + 58, 34, 11.5, 8.2, 700, INK); if (a >= A.length) { fillE(g, Qc.x + Qc.w - 14, Qc.y + 52, 5, 5, BLUE); text(g, '1', Qc.x + Qc.w - 14, Qc.y + 55, 6.6, 800, '#FFFFFF', 'center'); } }
    else { for (var i = 0; i < 3; i++) fillE(g, Qc.x + 16 + i * 10, Qc.y + 60, 3, 3, i === Math.floor(t * 5) % 3 ? GRN : '#D9C69E'); text(g, lockMode(S) ? 'Checking who may read it…' : 'Searching approved shelves…', Qc.x + 48, Qc.y + 63, 7.4, 700, '#8A7A5A');
      g.fillStyle = '#E8DDC0'; for (var j = 0; j < 3; j++) fillRR(g, Qc.x + 10, Qc.y + 76 + j * 11, Qc.w - 20 - (j === 2 ? 70 : 0), 4.4, 2, '#E8DDC0'); }
    var cite = show && c > 10.2; fillRR(g, Qc.x + 8, Qc.y + Qc.h - 22, Qc.w - 16, 16, 8, cite ? GRN : '#EDE3C8'); if (cite) tick(g, Qc.x + 17, Qc.y + Qc.h - 14, 5); text(g, '[1] Expense policy, section 4.2', Qc.x + 27, Qc.y + Qc.h - 11, 7.4, 800, cite ? '#FFFFFF' : '#B3A27A');
  }
  function bubble(g, t, S) { /* the question over the sales rep, typed */
    var c = rCyc(S, t), n = S.hot === 'ask' ? Math.floor(clamp(((t - (S.kT || 0)) % 6) * 22, 0, Q.length)) : Math.floor(clamp(c * 26, 0, Q.length)), x = 348, y = 150, w = 176, h = 48;
    shadowed(g, 8, 3, 0.16, function () { fillRR(g, x, y, w, h, 12, '#FFFFFF'); }); g.fillStyle = '#FFFFFF'; g.beginPath(); g.moveTo(x + 74, y + h); g.lineTo(x + 88, y + h + 16); g.lineTo(x + 94, y + h); g.closePath(); g.fill();
    fillRR(g, x + 8, y + 8, 22, 12, 6, '#E3ECFB'); text(g, 'Sales', x + 19, y + 16.6, 5.6, 800, BLUE, 'center'); text(g, 'asks in plain language', x + 36, y + 16.6, 5.8, 700, '#8A96A8');
    text(g, Q.slice(0, n), x + 10, y + 38, 9.6, 800, INK); if (n < Q.length && (t % 0.8) < 0.4) fillRR(g, x + 10 + n * 4.85, y + 29, 1.8, 11, 0.8, INK);
    /* the terminal's screen */
    var T = TERM; fillRR(g, T.x - 26, T.y, 52, 38, 3, '#FFFFFF'); fillRR(g, T.x - 26, T.y, 52, 9, 3, GRN); g.fillRect(T.x - 26, T.y + 5, 52, 4); text(g, 'Knowledge', T.x - 22, T.y + 7.4, 4.8, 800, '#FFFFFF');
    fillRR(g, T.x - 22, T.y + 13, 44, 8, 3, '#EEF2F7'); fillRR(g, T.x - 20, T.y + 15.5, Math.min(40, n * 1.4), 3, 1.5, '#9AA6BC'); if (c > 9) { fillRR(g, T.x - 22, T.y + 24, 40, 10, 3, GRN_L); fillRR(g, T.x - 20, T.y + 27, 26, 2, 1, GRN); fillRR(g, T.x - 20, T.y + 30.4, 18, 2, 1, BLUE); }
  }
  function cage(g, t, S) { /* the gate opens for the finance lead's key card (and on her tap); the padlock follows */
    var c = (t + 1) % 9, k2 = (t - FX.key) >= 0 && (t - FX.key) < 2.2, open = k2 ? Math.sin(Math.min(1, (t - FX.key) / 2.2) * Math.PI) : (c > 3.2 && c < 6 ? Math.sin((c - 3.2) / 2.8 * Math.PI) : 0), G = GATE;
    var w = G.w * (1 - open * 0.75); fillRR(g, G.x, 162, w, F - 162, 2, 'rgba(200,162,74,.18)'); g.save(); g.beginPath(); g.rect(G.x, 162, w, F - 162); g.clip(); g.strokeStyle = GOLD; g.lineWidth = 2.4; g.beginPath(); for (var d = 0; d < 6; d++) { var gx = G.x + (d + 0.5) * (w / 6); g.moveTo(gx, 162); g.lineTo(gx, F); } g.moveTo(G.x, 250); g.lineTo(G.x + w, 250); g.moveTo(G.x, 360); g.lineTo(G.x + w, 360); g.stroke(); g.restore();
    g.strokeStyle = GOLD_D; g.lineWidth = 3; rr(g, G.x, 162, w, F - 162, 2); g.stroke(); padlock(g, G.x + w - 8, 330, 1, open > 0.05);
    var led = open > 0.05 ? OK : (c > 2.6 && c < 3.2 ? '#F2C94C' : RED); fillE(g, 935, 320, 3, 3, led);
    if (k2) { var a = (t - FX.key) / 2.2; g.globalAlpha = clamp((1 - a) * 3, 0, 1); fillRR(g, 818, 96 - a * 20, 76, 18, 9, OK); tick(g, 828, 105 - a * 20, 5); text(g, 'Finance', 862, 108.6 - a * 20, 7.6, 800, '#FFFFFF', 'center');
      fillRR(g, 904, 120 - a * 20, 70, 18, 9, RED); cross(g, 914, 129 - a * 20, 5); text(g, 'Sales', 946, 132.6 - a * 20, 7.6, 800, '#FFFFFF', 'center'); g.globalAlpha = 1; }
  }
  function catalogue(g, t, S) { /* the drawer the engineer pulls, and the fan of index cards on her tap */
    var P = ENG, dx = CAT.x + 6 + 2 * 26.6, dy = CAT.y + 12 + 3 * 30, out = (P.drawer || 0) * 26;
    if (out > 0.5) { fillRR(g, dx + 2, dy - 2, 24 + out * 0.2, 30, 2, '#5C3B22'); fillRR(g, dx + out, dy, 24, 26, 2, '#C08A58'); fillRR(g, dx + out + 6, dy + 4, 12, 7, 1, GOLD_L); fillRR(g, dx + out + 8, dy + 16, 8, 4, 2, GOLD_D);
      for (var i = 0; i < 5; i++) fillRR(g, dx + out + 3 + i * 4, dy - 6 - (i % 2) * 2, 3, 8, 1, i === 2 ? GRN : '#FFFFFF'); }
    var fu = (t - FX.fan) / 1.8; if (fu >= 0 && fu < 1) for (var k = 0; k < 7; k++) { var a = -Math.PI / 2 + (k - 3) * 0.32, r = Math.sin(fu * Math.PI) * 120, cx = P.x - 20 + Math.cos(a) * r * 0.8, cy = P.y - 240 + Math.sin(a) * r;
      g.save(); g.translate(cx, cy); g.rotate(a + Math.PI / 2 + fu * 2); fillRR(g, -10, -7, 20, 14, 1.5, '#FFFFFF'); g.fillStyle = '#E2553D'; g.fillRect(-10, -4, 20, 1); fillRR(g, 4, -9, 6, 4, 1, [GRN, BLUE, OXB, GOLD][k % 4]); g.restore(); }
  }
  function ladder(g, t) { /* the rolling ladder on the rail (it slides along when tapped, and drifts on its own now and then) */
    var u = (t - FX.ladder), drift = Math.sin(t * 0.18) * 30, x = 520 + drift + (u >= 0 && u < 2.4 ? Math.sin(u / 2.4 * Math.PI) * 90 : 0), top = RAIL + 4, bot = F, lean = 46;
    g.strokeStyle = WOOD_D; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.moveTo(x, top); g.lineTo(x + lean, bot); g.moveTo(x + 26, top); g.lineTo(x + 26 + lean, bot); g.stroke();
    g.strokeStyle = WOOD_L; g.lineWidth = 3; g.beginPath(); for (var r = 1; r < 14; r++) { var f = r / 14; g.moveTo(x + lean * f, top + (bot - top) * f); g.lineTo(x + 26 + lean * f, top + (bot - top) * f); } g.stroke();
    fillE(g, x + 13, top - 2, 8, 5, GOLD_D); fillE(g, x + lean + 2, bot - 2, 4, 4, INK); fillE(g, x + 26 + lean, bot - 2, 4, 4, INK); return x; }
  function gapSlot(g, t, S) { /* the empty slot's tag swings; on its stop, a "?" pulses and the note goes to the gap list */
    var on = S.hot === 'gap', sw = Math.sin(t * 2) * 0.12, G = GAP; g.save(); g.translate(G.x + G.w / 2, G.y + 4); g.rotate(sw); g.strokeStyle = GOLD_D; g.lineWidth = 1; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 12); g.stroke();
    fillRR(g, -16, 12, 32, 22, 3, on ? '#FFF1C2' : PARCH); text(g, '?', 0, 28, 14, 800, on ? OXB : '#A37A2C', 'center'); g.restore();
    if (on || ((t * 0.25) % 1) < 0.35) { var a = on ? ((t - (S.kT || 0)) % 3) / 3 : ((t * 0.25) % 1) / 0.35; g.globalAlpha = clamp(1.2 - a, 0, 1); fillRR(g, G.x - 34, G.y + 56 - a * 10, 98, 16, 8, '#FFFFFF'); text(g, 'I don\'t know → gap list', G.x + 15, G.y + 67 - a * 10, 6.6, 800, OXB, 'center'); g.globalAlpha = 1; }
  }
  function nook(g, t) { /* the armchair reader in the window nook: turns pages, dozes, wakes (tap: waves the book) */
    var x = NOOKX, y = F, P = NOOK, u = (t - FX.nook) / 2, c = (t + 5) % 11; reset(P);
    soft(g, x, y + 4, 70, 9, 0.22); fillRR(g, x - 62, y - 128, 124, 100, 30, '#2F6B55'); fillRR(g, x - 70, y - 70, 30, 60, 12, '#245845'); fillRR(g, x + 40, y - 70, 30, 60, 12, '#245845'); fillRR(g, x - 54, y - 46, 108, 26, 10, '#3A7D64');
    fillRR(g, x - 56, y - 22, 8, 22, 3, WOOD_D); fillRR(g, x + 48, y - 22, 8, 22, 3, WOOD_D);
    if (u >= 0 && u < 1) { P.mood = 'happy'; P.talk = true; P.hands = [[-40, -300], [lerp(40, 120, Math.abs(Math.sin(u * Math.PI * 3))), -380]]; }
    else if (c < 6) { P.hands = [[-36, -250], [c % 3 > 2.4 ? 0 : 36, -250]]; P.look = 0.1; P.tilt = 0.05; }
    else if (c < 9) { P.hands = [[-36, -236], [36, -236]]; P.tilt = 0.18 + Math.sin(t * 1.5) * 0.03; P.mood = 'calm'; }
    else { P.hands = [[-36, -250], [36, -250]]; P.mood = 'happy'; P.look = 0.6; }
    K.person(g, P, t);
    var h0 = hw(P, 0), h1 = hw(P, 1), mx = (h0[0] + h1[0]) / 2, my = (h0[1] + h1[1]) / 2; fillRR(g, mx - 14, my - 12, 28, 18, 2, OXB); fillRR(g, mx - 12, my - 11, 11, 15, 1, PARCH); fillRR(g, mx + 1, my - 11, 11, 15, 1, PARCH);
    if (c >= 6 && c < 9 && !(u >= 0 && u < 1)) { var z = (t * 0.6) % 1; g.globalAlpha = 1 - z; text(g, 'z', x + 30 + z * 14, y - 250 - z * 30, 10 + z * 6, 800, '#5C6B7A'); g.globalAlpha = 1; }
    /* the side table, lamp and tea */
    fillRR(g, NOOKX + 66, 410, 40, 6, 2, WOOD); fillRR(g, NOOKX + 82, 416, 8, 54, 2, WOOD_D); lamp(g, NOOKX + 78, 410, true); fillRR(g, NOOKX + 94, 401, 10, 9, 3, '#FFFFFF');
    for (var i = 0; i < 2; i++) { var s = (t * 0.6 + i * 0.5) % 1; g.globalAlpha = (1 - s) * 0.5; fillE(g, NOOKX + 99 + Math.sin(t * 2 + i) * 3, 396 - s * 30, 3 + s * 5, 3 + s * 5, '#FFFFFF'); } g.globalAlpha = 1;
  }
  var NOOKX = -840, NOOK = W({ x: NOOKX, y: 470, s: 0.46, ph: 0.9, skin: 1, hair: 2, style: 'long', outfit: 'cardigan', top: '#E9C46A', top2: '#FFFFFF', sit: true, chair: false, sitDrop: 30, id: '#9AA6BC', hands: [[-36, -250], [36, -250]] });
  function globe(g, t) { var x = GLX, y = 340, r = 40, a = t * 0.4; fillE(g, x, y, r, r, '#7FB8E8'); g.save(); g.beginPath(); g.arc(x, y, r, 0, 7); g.clip();
    for (var i = 0; i < 4; i++) { var cx = x - r + ((a * 20 + i * 34) % (r * 2 + 40)) - 20; fillE(g, cx, y - 14 + (i % 2) * 22, 14 + (i % 3) * 4, 10 + (i % 2) * 6, '#7CC08A'); } g.restore();
    g.strokeStyle = 'rgba(255,255,255,.5)'; g.lineWidth = 1; g.beginPath(); g.ellipse(x, y, r, 10, 0, 0, 7); g.stroke(); fillE(g, x - 14, y - 16, 8, 6, 'rgba(255,255,255,.35)'); }
  function returns(g, t) { var u = (t * 0.22) % 1; if (u < 0.3) { var k2 = u / 0.3; g.save(); g.beginPath(); g.rect(1170, 300, 70, 46); g.clip(); fillRR(g, 1196, 300 + k2 * 44, 12, 30, 1.5, SPINES[Math.floor(t * 0.22) % SPINES.length]); g.restore(); } }
  function chandelier(g, t) { var x = 600, y = -150; g.strokeStyle = GOLD_D; g.lineWidth = 2; g.beginPath(); g.moveTo(x, CEIL - 60); g.lineTo(x, y); g.stroke(); fillE(g, x, y, 10, 10, GOLD);
    for (var i = 0; i < 5; i++) { var a = (i - 2) * 0.55, ax = x + Math.sin(a) * 50, ay = y + 14 - Math.cos(a) * 6; g.strokeStyle = GOLD_D; g.lineWidth = 2; g.beginPath(); g.moveTo(x, y + 4); g.quadraticCurveTo(x + Math.sin(a) * 30, y + 26, ax, ay); g.stroke(); fillRR(g, ax - 3, ay - 12, 6, 12, 2, '#FFFDF5'); fillE(g, ax, ay - 15, 2.6, 4, (Math.sin(t * 7 + i) > 0.6) ? '#FFE9A8' : '#FFF6D8'); } }
  function sconces(g, t) { [AX + 5, AX + 115].forEach(function (x, i) { var f = 0.5 + 0.25 * Math.sin(t * 6.3 + i * 2) + 0.15 * Math.sin(t * 13 + i); g.save(); g.globalAlpha = f * 0.5; fillE(g, x, 222, 10, 12, '#FFE9A8'); g.globalAlpha = 1; fillE(g, x, 219 - f * 2, 2.6, 4.4 + f * 1.6, '#FFC94A'); g.restore(); }); }
  function paintLive(g, t, now, S) {
    chandelier(g, t); CO.crew(CREW, g, t, S, false);
    var lx = ladder(g, t); robot(g, t, S); lectern(g, t, S); bubble(g, t, S); cage(g, t, S); catalogue(g, t, S); gapSlot(g, t, S); globe(g, t); returns(g, t); nook(g, t); alcove(g, t); sconces(g, t);
    CO.clock(g, 680, -142, 17, 8, GOLD_D);
  }
  function paintFrontLive(g, t, S) {
    CO.crew(CREW, g, t, S, true); readers(g, t);
    /* the laptop beside the reader (its lid is in the front layer), the lamp on the table */
    var T = TABLE, lx = T.x + 14; fillRR(g, lx, T.y - 32, 28, 25, 2, '#FFFFFF'); fillRR(g, lx, T.y - 32, 28, 6, 2, GRN); g.fillRect(lx, T.y - 29, 28, 3); fillRR(g, lx + 3, T.y - 22, 18, 3, 1.5, '#C9D3E3'); fillRR(g, lx + 3, T.y - 16, 22, 3, 1.5, GRN_L); fillRR(g, lx + 3, T.y - 11, 12, 2.4, 1.2, BLUE);
    var lampOn = (t - FX.lamp) >= 0 && (t - FX.lamp) < 5, lpx = T.x + T.w - 16; lamp(g, lpx, T.y, lampOn); if (lampOn) { g.save(); g.globalAlpha = 0.25; g.fillStyle = '#FFE9A8'; g.beginPath(); g.moveTo(lpx - 16, T.y - 24); g.lineTo(lpx + 16, T.y - 24); g.lineTo(lpx + 30, T.y); g.lineTo(lpx - 30, T.y); g.closePath(); g.fill(); g.restore(); }
    /* the tea's steam */
    for (var i = 0; i < 2; i++) { var s = (t * 0.6 + i * 0.5) % 1; g.globalAlpha = (1 - s) * 0.5; fillE(g, T.x + T.w - 51 + Math.sin(t * 2 + i) * 3, T.y - 14 - s * 26, 2.6 + s * 4, 2.6 + s * 4, '#FFFFFF'); } g.globalAlpha = 1;
    /* held props: the index card, the reader's book or cup or feedback thumb, the key card, the rep's thumb and light bulb */
    var e0 = hw(ENG, 0), e1 = hw(ENG, 1); if (ENG.card) { var mx = (e0[0] + e1[0]) / 2, my = (e0[1] + e1[1]) / 2 - 8; fillRR(g, mx - 13, my - 9, 26, 17, 1.5, '#FFFFFF'); g.fillStyle = '#E2553D'; g.fillRect(mx - 13, my - 6, 26, 1); g.fillStyle = '#C9D3E3'; g.fillRect(mx - 10, my - 2, 18, 1.4); g.fillRect(mx - 10, my + 2, 14, 1.4); if (ENG.card === 2 || (t % 8) > 4.4) { padlock(g, mx + 8, my + 4, 0.45, false); } }
    var r0 = hw(RDR, 0), r1 = hw(RDR, 1);
    if (RDR.book === 1) { var bx = (r0[0] + r1[0]) / 2, by = (r0[1] + r1[1]) / 2 - 6; fillRR(g, bx - 18, by - 10, 36, 20, 2, '#2F4A7A'); fillRR(g, bx - 16, by - 9, 15, 17, 1, PARCH); fillRR(g, bx + 1, by - 9, 15, 17, 1, PARCH); g.fillStyle = '#C9B98F'; for (var l = 0; l < 3; l++) { g.fillRect(bx - 14, by - 5 + l * 4, 11, 1.2); g.fillRect(bx + 3, by - 5 + l * 4, 11, 1.2); } }
    if (RDR.book === 2) { var hx = RDR.x, hy = RDR.y - (392 + 88 - 46) * RDR.s - 8; g.save(); g.translate(hx, hy); g.rotate(Math.sin(t * 7) * 0.1); g.fillStyle = '#2F4A7A'; g.beginPath(); g.moveTo(-30, 8); g.lineTo(0, -12); g.lineTo(30, 8); g.lineTo(26, 10); g.lineTo(0, -6); g.lineTo(-26, 10); g.closePath(); g.fill(); g.restore(); }
    if (RDR.cup) { fillRR(g, r1[0] - 5, r1[1] - 12, 10, 10, 3, '#FFFFFF'); }
    if (RDR.fb) { thumb(g, r1[0] + 4, r1[1] - 18, 1); fillRR(g, r1[0] + 16, r1[1] - 34, 66, 15, 7.5, '#FFFFFF'); text(g, 'feedback noted', r1[0] + 49, r1[1] - 23.8, 6.4, 800, GRN, 'center'); }
    var f1 = hw(FIN, 1); g.save(); g.translate(f1[0], f1[1]); g.rotate((t - FX.key) >= 0 && (t - FX.key) < 2.2 ? t * 12 : -0.2); fillRR(g, -6, -9, 12, 16, 2, '#FFFFFF'); fillRR(g, -6, -9, 12, 5, 2, OXB); fillRR(g, -4, 0, 5, 4, 1, '#C9D6EE'); g.restore();
    var a1 = hw(ASK, 1); if (ASK.thumb) thumb(g, a1[0], a1[1] - 12, 1);
    var bu = (t - FX.bulb) / 1.6; if (bu >= 0 && bu < 1) { var bx2 = ASK.x, by2 = ASK.y - 280 - bu * 20; g.globalAlpha = clamp((1 - bu) * 2.5, 0, 1); fillE(g, bx2, by2, 13, 13, '#FFE27A'); fillRR(g, bx2 - 6, by2 + 10, 12, 8, 2, '#9AA6BC'); g.strokeStyle = '#F2C94C'; g.lineWidth = 2; for (var q = 0; q < 6; q++) { var qa = q * Math.PI / 3; g.beginPath(); g.moveTo(bx2 + Math.cos(qa) * 17, by2 + Math.sin(qa) * 17); g.lineTo(bx2 + Math.cos(qa) * 24, by2 + Math.sin(qa) * 24); g.stroke(); } g.globalAlpha = 1; }
    CR.draw(g, t);
  }
  function thumb(g, x, y, s) { g.save(); g.translate(x, y); g.scale(s, s); fillRR(g, -7, -2, 14, 14, 4, '#F2C94C'); fillRR(g, -4, -12, 6, 12, 3, '#F2C94C'); fillRR(g, -9, 0, 4, 11, 2, '#D9A93A'); g.restore(); }
  /* the library cat on its cushion: the tail swishes, an ear twitches; tap: it stretches and purrs */
  var CATP = { x: -578, y: 700 };
  function cat(g, t) { var x = CATP.x, y = CATP.y, u = (t - FX.cat) / 2, up = u >= 0 && u < 1 ? Math.sin(u * Math.PI) : 0;
    var tail = Math.sin(t * 1.6) * 0.5; g.strokeStyle = '#E39A4A'; g.lineWidth = 7; g.lineCap = 'round'; g.beginPath(); g.moveTo(x + 22, y - 6); g.quadraticCurveTo(x + 44, y - 4 - up * 10, x + 40 + Math.cos(tail) * 10, y - 18 + Math.sin(tail) * 8 - up * 16); g.stroke();
    fillE(g, x, y - 10 - up * 8, 28, 14 + up * 4, '#F0A95A'); g.fillStyle = '#E39A4A'; for (var s = 0; s < 3; s++) g.fillRect(x - 10 + s * 9, y - 22 - up * 10, 4, 8);
    var hx = x - 24, hy = y - 16 - up * 14; fillE(g, hx, hy, 13, 11, '#F0A95A'); var tw = ((t + 1.3) % 4) < 0.15 ? -3 : 0;
    g.fillStyle = '#F0A95A'; g.beginPath(); g.moveTo(hx - 11, hy - 4); g.lineTo(hx - 8, hy - 16 + tw); g.lineTo(hx - 2, hy - 8); g.closePath(); g.fill(); g.beginPath(); g.moveTo(hx + 2, hy - 8); g.lineTo(hx + 8, hy - 16); g.lineTo(hx + 11, hy - 4); g.closePath(); g.fill();
    if (up > 0.3) { fillE(g, hx - 4, hy, 2, 2.4, INK); fillE(g, hx + 4, hy, 2, 2.4, INK); } else { g.strokeStyle = INK; g.lineWidth = 1.4; g.beginPath(); g.arc(hx - 4, hy, 2.4, 0.2, Math.PI - 0.2); g.moveTo(hx + 6.4, hy); g.arc(hx + 4, hy, 2.4, 0.2, Math.PI - 0.2); g.stroke(); }
    fillE(g, hx, hy + 4, 1.6, 1.2, '#D96A7A'); if (up > 0.2) { g.globalAlpha = up; text(g, 'purr', hx - 6, hy - 22, 8, 800, '#A3602A'); g.globalAlpha = 1; } }
  function FORE() { return [[612, function (g2, e, t) { staffer(g2, t); }], [700, function (g2, e, t) { cat(g2, t); }]]; }

  window.IXW.worlds['sol-rag'] = {
    calmView: [190,-60,800,640], calmHide: ['fin'], /* CALM: the framed part of the set */
    pan: [-700, 1260],
    paintBg: paintBg, windowBehind: true, paintFrame: function () {}, paintBack: paintBack, paintFront: paintFront, paintFore: paintFore,
    paintWindow: paintWindow, paintLive: paintLive, paintFrontLive: paintFrontLive,
    paintForeLive: function (g, t, S) { tableLive(g, t); K.zfore(g, t, S, FORE(), function () { CO.crew(CREW, g, t, S, 'fore'); }); CR.draw(g, t); },
    moteCol: 'rgba(255,244,214,.85)',
    glow: {
      ask: function (g) { rr(g, 350, 150, 168, 58, 14); },
      fetch: function (g) { rr(g, 300, RAIL - 16, 600, 90, 18); },
      cite: function (g) { rr(g, QC.x - 10, QC.y - 10, QC.w + 20, LECT.y + 30 - QC.y, 14); },
      locked: function (g) { rr(g, CAGE.x - 10, 8, CAGE.w + 20, 236, 14); },
      index: function (g) { rr(g, CAT.x - 10, CAT.y - 34, CAT.w + 20, F - CAT.y + 34, 12); },
      gap: function (g) { rr(g, GAP.x - 16, GAP.y - 2, GAP.w + 32, 66, 10); },
      ladder: function (g) { rr(g, 470, RAIL - 10, 200, 80, 12); },
      lamp: function (g) { rr(g, TABLE.x + TABLE.w - 38, TABLE.y - 46, 44, 46, 10); }
    },
    backGlow: ['ask', 'fetch', 'cite', 'locked', 'index', 'gap', 'ladder'],
    cast: [
      { id: 'eng', behind: true, keys: ['index'], P: ENG, act: actEng },
      { id: 'ask', behind: true, keys: ['ask'], P: ASK, act: actAsk },
      { id: 'rdr', behind: true, keys: ['gap'], P: RDR, act: actRdr },
      { id: 'fin', behind: true, keys: ['locked'], P: FIN, act: actFin }
    ],
    toy: function (name, S, t) { if (name === 'ladder') { FX.ladder = t; CR.burst('spark', 560, 120, t); } else if (name === 'lamp') { FX.lamp = t; CR.burst('star', TABLE.x + TABLE.w - 16, TABLE.y - 40, t); } },
    hit: function (x, y, S, t) {
      if (Math.abs(x - CATP.x) < 50 && Math.abs(y - (CATP.y - 14)) < 30) { FX.cat = t; CR.burst('heart', CATP.x, CATP.y - 50, t); return { say: 'Mrrp. The library cat keeps the **quiet**. Only answers from the shelves here.', who: 'Library cat', role: 'reading room · resident', near: [-420, 150], pose: 'love' }; }
      if (Math.abs(x - NOOK.x) < 70 && y < F && y > F - 250) { FX.nook = t; CR.burst('star', NOOK.x, F - 260, t); return { say: ['Oh! I asked about **leave policy** and it showed me the exact page.', 'Answers with **the source**, so I can read the rest myself.'][(FX.ni = (FX.ni || 0) + 1) % 2], who: 'Reader in the nook', role: 'Client team · illustration', near: [-700, -110], pose: 'clap' }; }
      var me = [['ta', TA.x, 400, 590, 52, 'Found it: **section 4.2**, quoted word for word. I can open the source and check it myself.', 'Reader at the long table', 'Client team · illustration', 'star'],
        ['tb', TB.x, 400, 590, 52, 'Every document I connect keeps **its access rules**. Then I check that each answer **cites the right page**.', 'TechNext AI engineer', 'TechNext · tuning the assistant · illustration', 'code'],
        ['al', AL.x, 300, 470, 50, 'It answers from **approved content only**. If the documents do not say, it tells you so instead of guessing.', 'Visitor in the reading alcove', 'Client team · illustration', 'note'],
        ['st', ST.x, 400, 612, 46, 'Returned and **re-indexed**: new and updated documents stay connected where they already live.', 'TechNext librarian', 'TechNext · keeps the shelves · illustration', 'spark']];
      for (var i = 0; i < me.length; i++) { var m = me[i]; if (Math.abs(x - m[1]) < m[4] && y > m[2] && y < m[3]) { TAP[m[0]] = t; CR.burst(m[8], m[1], m[2] - 10, t); return { say: m[5], who: m[6], role: m[7], near: [m[1] + 120, -110], pose: 'clap' }; } }
      return CR.hitWalker(x, y, t); },
    onStop: function (key, S, t) { S.kT = t; }
  };
})(window.IXW && window.IXW.kit, window.CR, window.CO);
