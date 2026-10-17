/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: sol-ai (/solutions/ai) — the AI hub as a hands-on science museum, the AI Discovery Hall. Four exhibit bays under
   arches, one per discipline: 01 the Answer Archive (knowledge assistants: a kiosk answers from the binders on the shelf and
   lights up the one it quoted), 02 AI in Odoo (a vendor bill on the wall screen fills itself in while a TechNext engineer
   works the console), 03 the Agent Machine (a marble run: every marble is a task that is classified, looked up, prepared,
   waits at a flap for a person to decide, is routed and followed up) and 04 the Talking Booth (a chatbot kiosk answering on
   web, WhatsApp and in-app, handing over to a person). All four hang from one source: the YOUR DATA globe under the
   clerestory, its beams feeding every bay. In the middle stands the approval gate: anything that moves money or a commitment
   drops down the chute and a person stamps it. Margins: the entrance and welcome desk, the floor plan, a replica automaton,
   the museum shop; velvet ropes, a cleaning robot and visitors in front. TechNext staff wear the blue ID, visitors and the
   client's approver the grey pass. Every person has an idle loop and a tap choreography of their own. */
(function (K, CR, CO) {
  'use strict';
  if (!K || !CR || !CO) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed, tone = K.tone;
  var F = 470;
  var INK = '#16323A', IVORY = '#FBF6EA', WALL = '#F5ECDA', STONE = '#E6D8BC', STONE_D = '#CCB892', BRASS = '#C9A227', BRASS_D = '#94741A', BRASS_L = '#F2DD8E',
    TEAL = '#0E9384', PUR = '#714B67', AMB = '#D97B12', BLUE = '#3167CA', OK = '#1E9E6A', PINK = '#E0456B', RED = '#C8453B', WOOD = '#B07A4A';
  var BAY = {
    know: { x: 176, w: 172, c: TEAL, l: '#DDF2EE', d: '#0A6B60', n: '01', t: 'KNOWLEDGE' },
    odoo: { x: 360, w: 172, c: PUR, l: '#F3E8F0', d: '#4F3248', n: '02', t: 'AI IN ODOO' },
    auto: { x: 648, w: 172, c: AMB, l: '#FCEBD5', d: '#8F4C08', n: '03', t: 'AGENTS' },
    chat: { x: 832, w: 168, c: BLUE, l: '#E3ECFB', d: '#1E4691', n: '04', t: 'CHATBOTS' }
  };
  var ORDER = ['know', 'odoo', 'auto', 'chat'];
  var GATE = { x: 544, w: 92 }, GL = { x: 590, y: -84, r: 54 }, ARCH = 26;
  var KIO = { x: 264, y: 214, w: 80, h: 84 }, OSC = { x: 374, y: 70, w: 144, h: 140 }, CHW = { x: 852, y: 160, w: 80, h: 140 };
  var PAD = { x: 563, y: 356 }, BELL = { x: 884, y: 322 }, LEVER = { x: 668, y: 312 };
  var WINS = []; for (var wi = 0; wi < 14; wi++) WINS.push({ x: -1010 + wi * 196, y: -296, w: 112, h: 116 });
  var DOOR = { x: -1130, y: 150, w: 176, h: 320 }, DX = -182; /* the entrance sits left of every desktop view; the welcome desk is in full view at 1920 */
  /* the card zone (seen with "View the scene"): the how-it-works screen, the timeline, the audio-guide post, the pendant lamps;
     on the floor the info totem, the school group at the automaton, a bench with a sketching visitor, a glass dome, a touch table */
  var SCR = { x: -452, y: -66, w: 164, h: 116 }, TL = { x: -220, y: 240, w: 240, h: 96 }, AUD = { x: 24, y: 66, w: 124, h: 178 };
  var LAMPS = [-226, 6], TOT = { x: -590, y: 600 }, BEN = { x: -104, y: 612 }, DOME = { x: 84, y: 612 }, TT = { x: 400, y: 606 }, YAH = { x: -590, y: 642 };
  var BINDERS = [['POLICIES', ['#0E9384', '#3FB5A3', '#0A6B60', '#7CCFC1', '#0E9384']], ['MANUALS', ['#3167CA', '#6F95DC', '#1E4691', '#3167CA', '#9DB8EA']], ['CONTRACTS', ['#714B67', '#A07796', '#4F3248', '#C9A227', '#714B67']]];
  var FIELDS = [['Vendor', 'Harbourline Supplies'], ['Bill date', '12 Sep 2026'], ['Total', 'S$ 1,284.00'], ['PO match', 'PO00123']];
  var NET = [[-895, [-56, 0, 56]], [-853, [-84, -28, 28, 84]], [-811, [-84, -28, 28, 84]], [-769, [-30, 30]]].map(function (L) { return L[1].map(function (y) { return [L[0], y - 6]; }); });
  var MPATH = [[676, 60], [792, 88], [676, 124], [792, 156], [684, 196], [744, 228], [690, 262], [806, 290]];
  function ease(u) { u = clamp(u, 0, 1); return u * u * (3 - 2 * u); }
  function hw(P, i) { var h = P.hands[i], sxk = P.sx == null ? 1 : P.sx; return [P.x + h[0] * P.s * sxk, P.y + (h[1] - (P.hop || 0) + (P.sit ? (P.sitDrop != null ? P.sitDrop : 46) : 0)) * P.s]; }
  function tapU(st, t, dur) { if (!st || !st.wave) return -1; var u = (t - (st.wave - 1.6)) / dur; return u >= 0 && u < 1 ? u : -1; }
  function looks(P, st, t, S, rest) { P.look = lerp(P.look, t < st.until ? clamp((S.nexi.x - P.x) / 160, -1, 1) : rest, 0.08); }
  function reset(P) { P.tilt = 0; P.sx = 1; P.hop = 0; P.mood = 'calm'; }
  function tick(g, x, y, r, col) { fillE(g, x, y, r, r, col || OK); g.strokeStyle = '#FFFFFF'; g.lineWidth = r * 0.3; g.lineCap = 'round'; g.beginPath(); g.moveTo(x - r * 0.45, y); g.lineTo(x - r * 0.1, y + r * 0.38); g.lineTo(x + r * 0.5, y - r * 0.38); g.stroke(); }
  function spark(g, x, y, r, col) { g.fillStyle = col; g.beginPath(); g.moveTo(x, y - r); g.quadraticCurveTo(x, y, x + r, y); g.quadraticCurveTo(x, y, x, y + r); g.quadraticCurveTo(x, y, x - r, y); g.quadraticCurveTo(x, y, x, y - r); g.fill(); }
  function wrap(g, s, x, y, max, lh, size, weight, col, align) { var line = '', ln = 0; s.split(' ').forEach(function (w) { if ((line + w).length > max && line) { text(g, line.trim(), x, y + ln * lh, size, weight, col, align); line = ''; ln++; } line += w + ' '; }); if (line.trim()) text(g, line.trim(), x, y + ln * lh, size, weight, col, align); }
  function archPath(g, x, w, top, bot) { var r = w / 2; g.beginPath(); g.moveTo(x, bot); g.lineTo(x, top + r); g.arc(x + r, top + r, r, Math.PI, 0); g.lineTo(x + w, bot); g.closePath(); }
  function winPath(g, w) { var r = w.w / 2; g.moveTo(w.x, w.y + w.h); g.lineTo(w.x, w.y + r); g.arc(w.x + r, w.y + r, r, Math.PI, 0); g.lineTo(w.x + w.w, w.y + w.h); g.closePath(); }
  /* small pictograms (centre x, y, size r) */
  function icDoc(g, x, y, r, col) { fillRR(g, x - r * 0.7, y - r, r * 1.4, r * 2, r * 0.25, '#FFFFFF'); g.fillStyle = col; g.fillRect(x - r * 0.45, y - r * 0.5, r * 0.9, r * 0.18); g.fillRect(x - r * 0.45, y - r * 0.1, r * 0.9, r * 0.18); g.fillRect(x - r * 0.45, y + r * 0.3, r * 0.6, r * 0.18); }
  function icDb(g, x, y, r, col) { fillRR(g, x - r * 0.8, y - r * 0.7, r * 1.6, r * 1.5, r * 0.3, col); fillE(g, x, y - r * 0.7, r * 0.8, r * 0.3, col === '#FFFFFF' ? '#BFE6DF' : '#FFFFFF'); g.fillStyle = 'rgba(255,255,255,.55)'; g.fillRect(x - r * 0.8, y - r * 0.15, r * 1.6, r * 0.12); g.fillRect(x - r * 0.8, y + r * 0.3, r * 1.6, r * 0.12); }
  function icShield(g, x, y, r, col) { g.fillStyle = col; g.beginPath(); g.moveTo(x, y - r); g.lineTo(x + r * 0.85, y - r * 0.6); g.quadraticCurveTo(x + r * 0.8, y + r * 0.6, x, y + r); g.quadraticCurveTo(x - r * 0.8, y + r * 0.6, x - r * 0.85, y - r * 0.6); g.closePath(); g.fill(); }
  function icBolt(g, x, y, r, col) { g.fillStyle = col; g.beginPath(); g.moveTo(x + r * 0.2, y - r); g.lineTo(x - r * 0.6, y + r * 0.15); g.lineTo(x - r * 0.05, y + r * 0.15); g.lineTo(x - r * 0.25, y + r); g.lineTo(x + r * 0.6, y - r * 0.2); g.lineTo(x + r * 0.05, y - r * 0.2); g.closePath(); g.fill(); }
  function icBot(g, x, y, r, col) { fillRR(g, x - r * 0.9, y - r * 0.55, r * 1.8, r * 1.3, r * 0.4, col); fillE(g, x - r * 0.35, y + r * 0.08, r * 0.17, r * 0.2, '#FFFFFF'); fillE(g, x + r * 0.35, y + r * 0.08, r * 0.17, r * 0.2, '#FFFFFF'); g.fillStyle = col; g.fillRect(x - r * 0.06, y - r * 0.95, r * 0.12, r * 0.4); fillE(g, x, y - r * 0.98, r * 0.16, r * 0.16, col); }
  function icOdoo(g, x, y, r) { [[-0.62, '#714B67'], [-0.2, '#A07796'], [0.22, '#C9A0BE'], [0.64, '#8F6A86']].forEach(function (o, i) { g.lineWidth = r * 0.3; g.strokeStyle = o[1]; g.beginPath(); g.arc(x + o[0] * r * 1.1, y, r * 0.36, 0, Math.PI * 2); g.stroke(); }); }
  function icWA(g, x, y, r) { fillE(g, x, y, r, r, '#25D366'); g.strokeStyle = '#FFFFFF'; g.lineWidth = r * 0.18; g.beginPath(); g.arc(x, y, r * 0.55, 0.3, Math.PI * 2 - 0.3); g.stroke(); fillE(g, x + r * 0.1, y + r * 0.05, r * 0.2, r * 0.2, '#FFFFFF'); }
  function icWeb(g, x, y, r) { fillE(g, x, y, r, r, BLUE); g.strokeStyle = '#FFFFFF'; g.lineWidth = r * 0.14; g.beginPath(); g.arc(x, y, r * 0.62, 0, 7); g.moveTo(x - r * 0.62, y); g.lineTo(x + r * 0.62, y); g.moveTo(x, y - r * 0.62); g.quadraticCurveTo(x + r * 0.45, y, x, y + r * 0.62); g.quadraticCurveTo(x - r * 0.45, y, x, y - r * 0.62); g.stroke(); }
  function icApp(g, x, y, r) { fillE(g, x, y, r, r, PINK); fillRR(g, x - r * 0.38, y - r * 0.62, r * 0.76, r * 1.24, r * 0.18, '#FFFFFF'); fillRR(g, x - r * 0.26, y - r * 0.46, r * 0.52, r * 0.8, r * 0.08, PINK); }
  function icPerson(g, x, y, r, col) { fillE(g, x, y - r * 0.35, r * 0.38, r * 0.38, col); g.fillStyle = col; g.beginPath(); g.ellipse(x, y + r * 0.6, r * 0.7, r * 0.5, 0, Math.PI, 0); g.fill(); }
  var ICON = { know: function (g, x, y, r) { icDb(g, x, y, r, '#FFFFFF'); }, odoo: function (g, x, y, r) { fillE(g, x, y, r * 1.1, r * 1.1, '#FFFFFF'); icOdoo(g, x, y, r * 0.62); }, auto: function (g, x, y, r) { icBolt(g, x, y, r, '#FFFFFF'); }, chat: function (g, x, y, r) { icBot(g, x, y + r * 0.15, r, '#FFFFFF'); } };

  /* ------------------------------ the static layers ------------------------------ */
  function paintBg(g, W, H, k, sx, sy) {
    g.save(); g.translate(sx, sy); g.scale(k, k); var e = { l: -(sx + 24) / k, r: (W - sx) / k, t: -(sy + 24) / k, b: (H - sy) / k };
    CO.sky(g, e, -320, 480, [[0, '#7FC2F0'], [0.55, '#BFE3F8'], [1, '#EAF6FC']]);
    /* outside the entrance: a lawn, trees and a low city */
    CO.skySG(g, -1040 + DX, -740 + DX, 330, 400, { hazy: 'rgba(170,200,230,.6)', near: ['#B9CCE8', '#AFC4E6'], trees: false, wheel: -900 });
    g.fillStyle = '#9ED39A'; g.fillRect(-1040 + DX, 380, 320, 100);
    [-930 + DX, -860 + DX, -790 + DX].forEach(function (tx, i) { fillRR(g, tx - 3, 330, 6, 60, 3, '#7A5236'); fillE(g, tx, 316, 34 - i * 3, 40, i % 2 ? '#4FAE6A' : '#3E9C5B'); fillE(g, tx - 10, 300, 18, 18, 'rgba(255,255,255,.14)'); });
    g.restore();
  }
  function paintWindow(g, t) {
    for (var c = 0; c < 9; c++) { var span = 2600, x = -1100 + ((hash(c + 3) * span + t * (4 + (c % 3) * 2)) % span); K.cloud(g, x, -268 + (c % 3) * 24, 0.2 + (c % 2) * 0.06); }
    for (var b = 0; b < 3; b++) { var u = ((t * 0.035 + b * 0.33) % 1), bx = -1000 + u * 2500, by = -258 + Math.sin(t * 0.7 + b) * 12 + b * 14, fl = Math.sin(t * 9 + b) * 3;
      g.strokeStyle = '#3B4A60'; g.lineWidth = 1.6; g.lineCap = 'round'; g.beginPath(); g.moveTo(bx - 6, by - fl); g.quadraticCurveTo(bx - 3, by - 3, bx, by); g.quadraticCurveTo(bx + 3, by - 3, bx + 6, by - fl); g.stroke(); }
    var cx = ((t * 18) % 520) - 1150 + DX; if (cx > -980 + DX && cx < -740 + DX) { fillRR(g, cx, 424, 46, 20, 5, '#F2C94C'); fillRR(g, cx + 4, 428, 12, 7, 2, '#BFE3F8'); fillRR(g, cx + 20, 428, 12, 7, 2, '#BFE3F8'); fillE(g, cx + 10, 446, 5, 5, '#2A3550'); fillE(g, cx + 36, 446, 5, 5, '#2A3550'); }
  }
  function paintBack(g, e) {
    /* the hall wall: warm plaster in stone courses, the clerestory and the entrance glass cut out */
    g.beginPath(); g.rect(e.l - 10, e.t - 10, e.r - e.l + 20, F - e.t + 10); WINS.forEach(function (w) { winPath(g, w); }); g.rect(DOOR.x + 14, DOOR.y + 16, DOOR.w - 28, DOOR.h - 16); g.fillStyle = WALL; g.fill('evenodd');
    g.save(); g.beginPath(); g.rect(e.l - 10, -140, e.r - e.l + 20, 540); g.clip();
    g.strokeStyle = 'rgba(150,120,70,.13)'; g.lineWidth = 1.2; g.beginPath();
    for (var cy = -140, row = 0; cy < 400; cy += 36, row++) { g.moveTo(e.l - 10, cy); g.lineTo(e.r + 10, cy); for (var cx = Math.floor(e.l / 96) * 96 + (row % 2 ? 48 : 0); cx < e.r + 96; cx += 96) { g.moveTo(cx, cy); g.lineTo(cx, cy + 36); } }
    g.stroke(); g.restore();
    /* the coffered ceiling above the clerestory */
    var cg = g.createLinearGradient(0, e.t, 0, -300); cg.addColorStop(0, '#EFE4CF'); cg.addColorStop(1, '#F8F1E3'); g.fillStyle = cg; g.fillRect(e.l - 10, e.t - 10, e.r - e.l + 20, -300 - e.t + 10);
    for (var qx = Math.floor(e.l / 90) * 90; qx < e.r; qx += 90) for (var qy = -390; qy > e.t - 90; qy -= 70) { fillRR(g, qx + 8, qy + 6, 74, 56, 4, '#E8DABE'); fillRR(g, qx + 16, qy + 12, 58, 44, 3, '#F3EAD7'); fillE(g, qx + 45, qy + 34, 4, 4, BRASS); }
    fillRR(g, e.l - 10, -316, e.r - e.l + 20, 18, 2, STONE); g.fillStyle = STONE_D; g.fillRect(e.l - 10, -300, e.r - e.l + 20, 4);
    /* the clerestory frames */
    WINS.forEach(function (w) { g.lineWidth = 7; g.strokeStyle = '#FFFFFF'; g.beginPath(); winPath(g, w); g.stroke(); g.lineWidth = 3; g.strokeStyle = BRASS_D; g.beginPath(); g.moveTo(w.x + w.w / 2, w.y + 4); g.lineTo(w.x + w.w / 2, w.y + w.h); g.moveTo(w.x, w.y + w.h * 0.6); g.lineTo(w.x + w.w, w.y + w.h * 0.6); g.stroke();
      g.fillStyle = 'rgba(255,255,255,.28)'; g.beginPath(); g.moveTo(w.x + 14, w.y + w.h); g.lineTo(w.x + 52, w.y + 20); g.lineTo(w.x + 66, w.y + 20); g.lineTo(w.x + 28, w.y + w.h); g.closePath(); g.fill(); fillRR(g, w.x - 8, w.y + w.h, w.w + 16, 8, 3, STONE); });
    /* the frieze: the hall's name carved in stone */
    fillRR(g, e.l - 10, -172, e.r - e.l + 20, 32, 2, STONE); g.fillStyle = STONE_D; g.fillRect(e.l - 10, -142, e.r - e.l + 20, 3); g.fillStyle = 'rgba(255,255,255,.5)'; g.fillRect(e.l - 10, -172, e.r - e.l + 20, 2);
    for (var fx = Math.floor(e.l / 64) * 64; fx < e.r; fx += 64) fillE(g, fx + 32, -156, 3, 3, STONE_D);
    [[262, 'AI DISCOVERY HALL'], [914, 'HANDS-ON GALLERY'], [-560, 'AI DISCOVERY HALL'], [1240, 'MUSEUM SHOP']].forEach(function (f) { var w = f[1].length * 9.6 + 26; fillRR(g, f[0] - w / 2, -169, w, 26, 3, '#F7EEDB'); text(g, f[1], f[0], -150.5, 12.5, 800, '#7A6337', 'center'); });
    /* the wainscot: marble, a brass rail and skirting */
    var wg = g.createLinearGradient(0, 396, 0, F); wg.addColorStop(0, '#EFE6D3'); wg.addColorStop(1, '#E2D5BA'); g.fillStyle = wg; g.fillRect(e.l - 10, 396, e.r - e.l + 20, F - 396);
    g.strokeStyle = 'rgba(160,130,90,.18)'; g.lineWidth = 1.2; g.beginPath(); for (var vx = Math.floor(e.l / 140) * 140; vx < e.r; vx += 140) { g.moveTo(vx + 20, 404); g.quadraticCurveTo(vx + 60, 430, vx + 50, 462); g.moveTo(vx + 90, 400); g.quadraticCurveTo(vx + 110, 420, vx + 130, 440); } g.stroke();
    fillRR(g, e.l - 10, 392, e.r - e.l + 20, 6, 3, BRASS); fillRR(g, e.l - 10, F - 8, e.r - e.l + 20, 8, 2, '#BBA57C');
    /* the floor: polished terrazzo with brass inlay diamonds */
    var fg = g.createLinearGradient(0, F, 0, e.b); fg.addColorStop(0, '#EFE4CF'); fg.addColorStop(1, '#E3D3B4'); g.fillStyle = fg; g.fillRect(e.l - 10, F, e.r - e.l + 20, e.b - F + 10);
    g.fillStyle = 'rgba(160,130,90,.10)'; for (var sp = 0; sp < 260; sp++) { var px = e.l + hash(sp * 1.7) * (e.r - e.l), py = F + 8 + hash(sp * 2.3) * (e.b - F); g.fillRect(px, py, 2.4, 1.6); }
    g.strokeStyle = 'rgba(201,162,39,.45)'; g.lineWidth = 2; g.beginPath(); for (var dx = Math.floor(e.l / 220) * 220; dx < e.r + 220; dx += 220) { g.moveTo(dx, F + 70); g.lineTo(dx + 110, F + 150); g.lineTo(dx + 220, F + 70); g.moveTo(dx, F + 70); g.lineTo(dx + 110, F - 10 + 30); g.lineTo(dx + 220, F + 70); } g.stroke();
    g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 1.4; g.beginPath(); for (var ly = F + 30; ly < e.b + 40; ly += 46) { g.moveTo(e.l - 10, ly); g.lineTo(e.r + 10, ly); } g.stroke();
    g.fillStyle = 'rgba(60,40,10,.08)'; g.fillRect(e.l - 10, F, e.r - e.l + 20, 6);
    /* the floor: a terrazzo visitor route from the welcome desk to the YOUR DATA medallion, then one coloured line to each bay */
    g.lineCap = 'round'; g.lineJoin = 'round';
    function route(w, col) { g.strokeStyle = col; g.lineWidth = w; g.beginPath(); g.moveTo(-835, 496); g.quadraticCurveTo(-835, 692, -700, 692); g.lineTo(300, 692); g.quadraticCurveTo(380, 692, 410, 664); g.stroke(); }
    route(26, 'rgba(204,184,146,.55)'); route(18, '#F3E9D6'); route(2, 'rgba(201,162,39,.55)');
    g.fillStyle = 'rgba(148,116,26,.55)'; for (var cx2 = -660; cx2 < 290; cx2 += 64) { g.beginPath(); g.moveTo(cx2, 686); g.lineTo(cx2 + 8, 692); g.lineTo(cx2, 698); g.lineTo(cx2 + 3, 692); g.closePath(); g.fill(); }
    [[262, 448, 646, 300, 646], [446, 524, 616, 446, 612], [734, 656, 616, 734, 612], [916, 732, 646, 880, 646]].forEach(function (a, i) { var col = BAY[ORDER[i]].c;
      g.strokeStyle = 'rgba(255,255,255,.75)'; g.lineWidth = 10; g.beginPath(); g.moveTo(a[1], a[2]); g.quadraticCurveTo(a[3], a[4], a[0], 494); g.stroke();
      g.strokeStyle = col; g.globalAlpha = 0.6; g.lineWidth = 5; g.stroke(); g.globalAlpha = 1;
      g.fillStyle = col; g.beginPath(); g.moveTo(a[0] - 9, 500); g.lineTo(a[0], 486); g.lineTo(a[0] + 9, 500); g.closePath(); g.fill(); });
    /* the medallion: four gallery colours round YOUR DATA */
    g.save(); g.translate(590, 652); g.scale(0.9, 0.2); fillE(g, 0, 8, 250, 250, 'rgba(120,90,40,.08)'); fillE(g, 0, 0, 236, 236, '#F7EFDD'); g.lineWidth = 7; g.strokeStyle = BRASS; g.beginPath(); g.arc(0, 0, 228, 0, Math.PI * 2); g.stroke();
    ORDER.forEach(function (k, i) { g.fillStyle = BAY[k].c; g.globalAlpha = 0.6; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, 204, Math.PI + i * Math.PI / 2 - Math.PI / 4, Math.PI + (i + 1) * Math.PI / 2 - Math.PI / 4); g.closePath(); g.fill(); });
    g.globalAlpha = 1; fillE(g, 0, 0, 124, 124, '#F7EFDD'); g.strokeStyle = BRASS_D; g.lineWidth = 5; g.beginPath(); g.arc(0, 0, 124, 0, Math.PI * 2); g.stroke(); fillE(g, 0, 0, 92, 92, INK); g.restore();
    text(g, 'YOUR DATA', 590, 656, 12, 800, BRASS_L, 'center');
    /* the you-are-here disc by the info totem */
    g.save(); g.translate(YAH.x, YAH.y); g.scale(1, 0.34); fillE(g, 0, 0, 36, 36, '#FFFDF8'); g.lineWidth = 4; g.strokeStyle = RED; g.beginPath(); g.arc(0, 0, 33, 0, 7); g.stroke(); g.restore();
    text(g, 'YOU ARE HERE', YAH.x, YAH.y + 2.6, 6.4, 800, RED, 'center');
    /* pilasters between the bays */
    [170, 354, 538, 642, 826, 1006].forEach(function (px) { fillRR(g, px - 7, -138, 14, F - 8 + 138, 2, '#EFE3CC'); g.fillStyle = 'rgba(150,120,70,.12)'; g.fillRect(px + 3, -138, 4, F + 130); fillRR(g, px - 11, -140, 22, 10, 2, STONE); fillRR(g, px - 11, F - 26, 22, 18, 2, STONE); });
    /* ---- the four bays ---- */
    ORDER.forEach(function (k) { var b = BAY[k]; shadowed(g, 14, 5, 0.14, function () { archPath(g, b.x + 4, b.w - 8, ARCH, F - 8); g.fillStyle = b.c; g.fill(); });
      archPath(g, b.x + 12, b.w - 24, ARCH + 8, F - 8); g.fillStyle = b.l; g.fill();
      g.save(); archPath(g, b.x + 12, b.w - 24, ARCH + 8, F - 8); g.clip(); g.fillStyle = 'rgba(255,255,255,.35)'; for (var sx = b.x; sx < b.x + b.w; sx += 18) g.fillRect(sx, ARCH, 1.2, F); g.restore();
      /* the plaque over the keystone */
      var px = b.x + b.w / 2; shadowed(g, 8, 3, 0.18, function () { fillRR(g, px - 66, -10, 132, 30, 6, INK); }); fillRR(g, px - 63, -7, 126, 24, 4, 'rgba(255,255,255,.04)'); g.strokeStyle = BRASS; g.lineWidth = 1.4; rr(g, px - 62, -6, 124, 22, 4); g.stroke();
      fillE(g, px - 46, 5, 9, 9, b.c); text(g, b.n, px - 46, 8.6, 9, 800, '#FFFFFF', 'center'); text(g, b.t, px - 32, 9.6, 10.5, 800, '#FFFFFF'); });
    /* ---- 01 the Answer Archive: binders on three shelves, the kiosk stand ---- */
    var kb = BAY.know; BINDERS.forEach(function (sh, i) { var y = 96 + i * 44, x0 = kb.x + 26; fillRR(g, kb.x + 18, y, kb.w - 36, 6, 2, WOOD); g.fillStyle = 'rgba(80,50,20,.18)'; g.fillRect(kb.x + 18, y + 6, kb.w - 36, 3);
      for (var j = 0; j < 9; j++) { var bw = 11 + (j % 3) * 2, bh = 30 - (j % 2) * 5, bx = x0 + j * 14.2; if (bx + bw > kb.x + kb.w - 22) break; fillRR(g, bx, y - bh, bw - 1.5, bh, 2, sh[1][j % 5]); g.fillStyle = 'rgba(255,255,255,.6)'; g.fillRect(bx + 2, y - bh + 6, bw - 5.5, 4); fillE(g, bx + (bw - 1.5) / 2, y - 7, 2.2, 2.2, 'rgba(255,255,255,.7)'); }
      fillRR(g, kb.x + kb.w - 62, y + 9, 48, 11, 3, '#FFFFFF'); text(g, sh[0], kb.x + kb.w - 38, y + 17, 6.4, 800, kb.d, 'center'); });
    fillRR(g, KIO.x + KIO.w / 2 - 6, KIO.y + KIO.h, 12, F - KIO.y - KIO.h - 4, 3, '#5C6B7A'); fillRR(g, KIO.x + KIO.w / 2 - 26, F - 10, 52, 10, 4, '#3D4A5C');
    shadowed(g, 12, 4, 0.2, function () { fillRR(g, KIO.x - 6, KIO.y - 6, KIO.w + 12, KIO.h + 12, 9, '#2A3142'); });
    /* ---- 02 AI in Odoo: the wall screen ---- */
    shadowed(g, 14, 5, 0.2, function () { fillRR(g, OSC.x - 7, OSC.y - 7, OSC.w + 14, OSC.h + 14, 10, '#2A3142'); });
    fillRR(g, OSC.x, OSC.y, OSC.w, OSC.h, 4, '#FFFFFF'); fillRR(g, OSC.x, OSC.y, OSC.w, 22, 4, PUR); g.fillRect(OSC.x, OSC.y + 14, OSC.w, 8);
    text(g, 'Vendor bill · Draft', OSC.x + 10, OSC.y + 15, 8, 800, '#FFFFFF'); spark(g, OSC.x + OSC.w - 13, OSC.y + 11, 5.5, '#FFFFFF');
    FIELDS.forEach(function (f, i) { text(g, f[0], OSC.x + 8, OSC.y + 41 + i * 22, 6.6, 700, '#8A96A8'); });
    /* the tube from the screen to the gate */
    g.strokeStyle = 'rgba(255,255,255,.9)'; g.lineWidth = 9; g.lineCap = 'round'; g.beginPath(); g.moveTo(OSC.x + OSC.w + 6, OSC.y + 30); g.lineTo(548, OSC.y + 30); g.quadraticCurveTo(562, OSC.y + 30, 562, 120); g.stroke();
    g.strokeStyle = 'rgba(113,75,103,.35)'; g.lineWidth = 1.5; g.stroke();
    /* ---- the approval gate: two brass posts, the sign, the glass chute ---- */
    var gx = GATE.x, gw = GATE.w; fillRR(g, gx + 2, 106, 10, F - 106, 3, BRASS_D); fillRR(g, gx + gw - 12, 106, 10, F - 106, 3, BRASS_D); fillRR(g, gx + 4, 106, 4, F - 106, 2, BRASS_L); fillRR(g, gx + gw - 10, 106, 4, F - 106, 2, BRASS_L);
    shadowed(g, 10, 4, 0.2, function () { fillRR(g, gx - 6, 92, gw + 12, 56, 8, OK); }); fillRR(g, gx - 2, 96, gw + 4, 48, 6, '#22AE76'); g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 1.3; rr(g, gx + 1, 99, gw - 2, 42, 5); g.stroke();
    text(g, 'APPROVAL', gx + gw / 2, 116, 10.5, 800, '#FFFFFF', 'center'); text(g, 'GATE', gx + gw / 2, 129, 10.5, 800, '#FFFFFF', 'center'); text(g, 'a person decides', gx + gw / 2, 139.5, 6.4, 700, '#E2FFF1', 'center');
    fillRR(g, gx + gw / 2 - 5, 80, 10, 14, 3, BRASS_D);
    g.fillStyle = 'rgba(220,240,250,.55)'; fillRR(g, 556, 148, 14, 196, 7, 'rgba(220,240,250,.6)'); g.strokeStyle = 'rgba(255,255,255,.95)'; g.lineWidth = 1.5; rr(g, 556, 148, 14, 196, 7); g.stroke();
    g.strokeStyle = 'rgba(255,255,255,.9)'; g.lineWidth = 9; g.beginPath(); g.moveTo(660, 120); g.quadraticCurveTo(618, 120, 618, 150); g.stroke();
    /* ---- 03 the Agent Machine: a pegboard in the arch, its tracks and stations ---- */
    var ab = BAY.auto; g.save(); archPath(g, ab.x + 16, ab.w - 32, ARCH + 12, 344); g.clip(); g.fillStyle = '#F7E2C2'; g.fillRect(ab.x, ARCH, ab.w, 330);
    g.fillStyle = 'rgba(143,76,8,.18)'; for (var hy = ARCH + 20; hy < 344; hy += 12) for (var hx = ab.x + 20 + ((hy / 12) % 2 ? 6 : 0); hx < ab.x + ab.w - 16; hx += 12) g.fillRect(hx, hy, 2.2, 2.2); g.restore();
    g.strokeStyle = tone(AMB, 0.25); g.lineWidth = 2; archPath(g, ab.x + 16, ab.w - 32, ARCH + 12, 344); g.stroke();
    g.lineCap = 'round'; for (var m = 0; m < MPATH.length - 1; m++) { var a0 = MPATH[m], a1 = MPATH[m + 1]; g.strokeStyle = '#8F4C08'; g.lineWidth = 3.4; g.beginPath(); g.moveTo(a0[0], a0[1] + 7); g.lineTo(a1[0], a1[1] + 7); g.stroke(); g.strokeStyle = '#E9A14B'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(a0[0], a0[1] + 5.5); g.lineTo(a1[0], a1[1] + 5.5); g.stroke(); }
    [['trigger', 0], ['classify', 1], ['look up', 2], ['prepare', 3], ['a person decides', 4], ['route', 5], ['follow up', 6]].forEach(function (s, i) { var p = MPATH[s[1]], left = p[0] < 740; fillRR(g, left ? p[0] - 6 : p[0] - 50, p[1] - 15, s[0].length * 4.4 + 12, 10, 5, i === 4 ? OK : '#FFFFFF'); text(g, s[0], left ? p[0] : p[0] - 44, p[1] - 7.6, 6.2, 800, i === 4 ? '#FFFFFF' : ab.d); });
    /* the hopper, the lift tube, the crank and the follow-up bell */
    g.fillStyle = '#8F4C08'; g.beginPath(); g.moveTo(664, 44); g.lineTo(692, 44); g.lineTo(684, 60); g.lineTo(672, 60); g.closePath(); g.fill();
    fillRR(g, 802, 52, 10, 248, 5, 'rgba(255,255,255,.7)'); g.strokeStyle = '#8F4C08'; g.lineWidth = 1.4; rr(g, 802, 52, 10, 248, 5); g.stroke(); g.beginPath(); g.moveTo(807, 52); g.quadraticCurveTo(807, 40, 790, 40); g.lineTo(684, 40); g.stroke();
    fillE(g, 690, 276, 9, 3, '#5C6B7A'); g.fillStyle = '#E2B13C'; g.beginPath(); g.arc(690, 274, 7, Math.PI, 0); g.closePath(); g.fill();
    /* ---- 04 the Talking Booth: a chatbot kiosk and its three speaking horns ---- */
    var chb = BAY.chat; shadowed(g, 14, 5, 0.18, function () { fillRR(g, 846, 140, 92, F - 144, 16, '#FFFFFF'); }); fillRR(g, 846, 140, 92, 12, 6, BLUE);
    fillRR(g, 862, 302, 60, 8, 3, '#DCE6F7'); fillRR(g, 862, 314, 60, 8, 3, '#DCE6F7'); for (var v = 0; v < 4; v++) fillRR(g, 860 + v * 16, 400, 12, 40, 4, '#E8EFFB');
    text(g, 'TALK TO THE BOT', 892, 360, 7, 800, chb.d, 'center'); text(g, 'a person when it matters', 892, 372, 5.6, 700, '#5C6B7A', 'center');
    fillRR(g, 874, 120, 36, 22, 6, '#CFDBF2'); shadowed(g, 10, 4, 0.2, function () { fillRR(g, 852, 54, 80, 70, 24, '#2A3550'); }); fillRR(g, 858, 60, 68, 58, 20, '#1B2350');
    g.strokeStyle = '#2A3550'; g.lineWidth = 3; g.beginPath(); g.moveTo(892, 54); g.lineTo(892, 40); g.stroke();
    [[958, 92, 'web'], [958, 136, 'wa'], [958, 180, 'app']].forEach(function (h) { g.strokeStyle = BRASS_D; g.lineWidth = 3; g.beginPath(); g.moveTo(938, h[1] + 30); g.quadraticCurveTo(948, h[1] + 10, h[0] - 10, h[1]); g.stroke();
      g.fillStyle = BRASS; g.beginPath(); g.moveTo(h[0] - 12, h[1] - 5); g.lineTo(h[0] + 14, h[1] - 14); g.lineTo(h[0] + 14, h[1] + 14); g.lineTo(h[0] - 12, h[1] + 5); g.closePath(); g.fill(); fillE(g, h[0] + 14, h[1], 4, 14, BRASS_D);
      if (h[2] === 'web') icWeb(g, h[0] + 26, h[1], 8); else if (h[2] === 'wa') icWA(g, h[0] + 26, h[1], 8); else icApp(g, h[0] + 26, h[1], 8); });
    /* ---- YOUR DATA: the globe on its cables, its glow and its beams to every bay ---- */
    g.strokeStyle = '#7A6337'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(GL.x - 30, GL.y - 45); g.lineTo(GL.x - 60, e.t - 10); g.moveTo(GL.x + 30, GL.y - 45); g.lineTo(GL.x + 60, e.t - 10); g.moveTo(GL.x, GL.y - GL.r); g.lineTo(GL.x, e.t - 10); g.stroke();
    var gg = g.createRadialGradient(GL.x, GL.y, GL.r * 0.6, GL.x, GL.y, GL.r * 2.4); gg.addColorStop(0, 'rgba(120,200,255,.35)'); gg.addColorStop(1, 'rgba(120,200,255,0)'); g.fillStyle = gg; g.fillRect(GL.x - GL.r * 2.4, GL.y - GL.r * 2.4, GL.r * 4.8, GL.r * 4.8);
    ORDER.forEach(function (k) { var b = BAY[k], tx = b.x + b.w / 2, c1 = beamCtl(k); g.strokeStyle = 'rgba(255,255,255,.95)'; g.lineWidth = 7; g.beginPath(); g.moveTo(GL.x, GL.y + GL.r * 0.6); g.quadraticCurveTo(c1[0], c1[1], tx, -10); g.stroke();
      g.strokeStyle = b.c; g.globalAlpha = 0.35; g.lineWidth = 2; g.stroke(); g.globalAlpha = 1; });
    var sg = g.createRadialGradient(GL.x - 18, GL.y - 20, 6, GL.x, GL.y, GL.r); sg.addColorStop(0, '#FFFFFF'); sg.addColorStop(0.5, '#CDEBFF'); sg.addColorStop(1, '#7FB8E8');
    fillE(g, GL.x, GL.y, GL.r, GL.r, sg); g.strokeStyle = 'rgba(49,103,202,.28)'; g.lineWidth = 1.2;
    for (var la = -2; la <= 2; la++) { g.beginPath(); g.ellipse(GL.x, GL.y + la * 18, Math.sqrt(GL.r * GL.r - la * la * 324), 5, 0, 0, Math.PI * 2); g.stroke(); }
    for (var lo = 1; lo < 4; lo++) { g.beginPath(); g.ellipse(GL.x, GL.y, GL.r * lo / 4, GL.r, 0, 0, Math.PI * 2); g.stroke(); }
    fillRR(g, GL.x - 44, GL.y - 9, 88, 18, 9, INK); text(g, 'YOUR DATA', GL.x, GL.y + 3.6, 9.6, 800, BRASS_L, 'center');
    fillRR(g, GL.x - 58, GL.y + GL.r + 6, 116, 15, 7, '#FFFFFF'); text(g, 'documents · records · policies', GL.x, GL.y + GL.r + 16.4, 6.6, 800, '#5C6B7A', 'center');
    /* ---- the left margin: the entrance, the floor plan, the automaton, a palm ---- */
    var d = DOOR; shadowed(g, 12, 5, 0.16, function () { fillRR(g, d.x - 10, d.y - 30, d.w + 20, d.h + 30, 6, STONE); }); g.fillStyle = WALL; g.beginPath(); g.rect(d.x - 10, d.y - 30, d.w + 20, d.h + 30); g.rect(d.x + 14, d.y + 16, d.w - 28, d.h - 16); g.fill('evenodd');
    fillRR(g, d.x - 10, d.y - 30, d.w + 20, 30, 4, STONE_D); fillRR(g, d.x + 30, d.y - 26, d.w - 60, 22, 4, INK); text(g, 'ENTRANCE', d.x + d.w / 2, d.y - 10.5, 10.5, 800, BRASS_L, 'center');
    g.lineWidth = 6; g.strokeStyle = BRASS_D; g.strokeRect(d.x + 14, d.y + 16, d.w - 28, d.h - 16); g.beginPath(); g.moveTo(d.x + d.w / 2, d.y + 16); g.lineTo(d.x + d.w / 2, F); g.stroke();
    fillRR(g, d.x + d.w / 2 - 16, d.y + 150, 8, 40, 3, BRASS); fillRR(g, d.x + d.w / 2 + 8, d.y + 150, 8, 40, 3, BRASS); K.windowGlass(g, { x: d.x + 14, y: d.y + 16, w: d.w - 28, h: d.h - 16 });
    /* the network: a brass-rod installation on the wall, hung from the frieze (its pulses are live) */
    g.strokeStyle = '#7A6337'; g.lineWidth = 1.2; g.beginPath(); [-895, -769].forEach(function (x) { g.moveTo(x, -140); g.lineTo(x, -96); }); g.stroke();
    g.strokeStyle = 'rgba(148,116,26,.55)'; g.lineWidth = 1.6; g.beginPath(); for (var nl = 0; nl < NET.length - 1; nl++) NET[nl].forEach(function (a) { NET[nl + 1].forEach(function (b) { g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); }); }); g.stroke();
    NET.forEach(function (L) { L.forEach(function (n) { fillE(g, n[0], n[1] + 2, 9, 9, 'rgba(60,45,20,.12)'); fillE(g, n[0], n[1], 9, 9, BRASS_D); fillE(g, n[0], n[1], 6.5, 6.5, '#FFFDF8'); }); });
    fillRR(g, -907, 104, 150, 24, 4, '#FFFDF8'); g.strokeStyle = STONE_D; g.lineWidth = 1.2; rr(g, -907, 104, 150, 24, 4); g.stroke(); text(g, 'THE NETWORK · installation', -832, 120, 7.4, 800, '#7A6337', 'center');
    /* the welcome sign over the desk */
    fillRR(g, -910, 150, 150, 46, 8, TEAL); g.strokeStyle = 'rgba(255,255,255,.6)'; g.lineWidth = 1.3; rr(g, -906, 154, 142, 38, 6); g.stroke(); text(g, 'WELCOME', -835, 172, 12, 800, '#FFFFFF', 'center'); text(g, 'tap any exhibit to try it', -835, 185, 7, 700, '#D7F5EF', 'center');
    /* the question wall above the info totem: what visitors ask, in the four gallery colours */
    shadowed(g, 10, 4, 0.16, function () { fillRR(g, -632, 112, 140, 262, 6, '#FFFDF8'); }); g.strokeStyle = STONE_D; g.lineWidth = 1.2; rr(g, -627, 117, 130, 252, 4); g.stroke();
    fillRR(g, -620, 124, 116, 20, 4, INK); text(g, 'WHAT PEOPLE ASK', -562, 137.6, 8, 800, BRASS_L, 'center');
    [['Claim travel expenses?', TEAL, 0], ['Match this bill to a PO', PUR, 1], ['Chase the late invoices', AMB, 0], ['Where is my order?', BLUE, 1], ['Approve this quote?', OK, 0]].forEach(function (q, i) { var y = 156 + i * 40, w = 106, x = q[2] ? -506 - w : -618;
      fillRR(g, x, y, w, 26, 9, q[1]); g.fillStyle = q[1]; g.beginPath(); if (q[2]) { g.moveTo(x + w - 18, y + 24); g.lineTo(x + w - 4, y + 34); g.lineTo(x + w - 30, y + 24); } else { g.moveTo(x + 18, y + 24); g.lineTo(x + 4, y + 34); g.lineTo(x + 30, y + 24); } g.fill();
      text(g, q[0], x + w / 2, y + 16.4, 7, 800, '#FFFFFF', 'center'); });
    /* the automaton on its plinth */
    fillRR(g, -448, 380, 112, 90, 4, STONE); fillRR(g, -454, 372, 124, 12, 3, STONE_D); fillRR(g, -430, 406, 76, 24, 3, '#FFFFFF'); text(g, 'AUTOMATON', -392, 418, 7.4, 800, INK, 'center'); text(g, 'replica', -392, 427, 5.8, 700, '#7A6337', 'center');
    fillRR(g, -426, 270, 68, 100, 14, '#B8C2CF'); fillRR(g, -418, 280, 52, 40, 8, '#8E9AAB'); [0, 1, 2].forEach(function (i) { fillE(g, -404 + i * 12, 300, 3.6, 3.6, ['#E2553D', '#F2C94C', '#3FA66B'][i]); });
    fillRR(g, -448, 284, 18, 64, 8, '#A9B4C3'); fillRR(g, -354, 284, 18, 64, 8, '#A9B4C3'); fillRR(g, -414, 206, 44, 54, 12, '#C9D2DE'); fillRR(g, -398, 258, 12, 14, 3, '#8E9AAB');
    g.strokeStyle = '#8E9AAB'; g.lineWidth = 2.4; g.beginPath(); g.moveTo(-392, 206); g.lineTo(-392, 188); g.stroke(); fillRR(g, -406, 236, 28, 10, 3, '#8E9AAB');
    K.plant(g, { x: -272, y: F }, '#E9DCC4', '#F2E8D4');
    /* a framed poster of the four disciplines, a water fountain (mostly behind the title card) */
    shadowed(g, 10, 4, 0.16, function () { fillRR(g, -214, 10, 190, 150, 6, '#FFFFFF'); }); fillRR(g, -206, 18, 174, 134, 3, IVORY); text(g, 'FOUR DISCIPLINES', -119, 40, 10, 800, INK, 'center'); text(g, 'one source: your data', -119, 54, 7, 700, '#7A6337', 'center');
    ORDER.forEach(function (k, i) { var b = BAY[k]; fillE(g, -180 + i * 41, 96, 15, 15, b.c); ICON[k](g, -180 + i * 41, 96, 7); text(g, b.n, -180 + i * 41, 128, 7.4, 800, b.d, 'center'); });
    fillRR(g, -120, 360, 44, 110, 6, '#E6EBF1'); fillRR(g, -126, 352, 56, 12, 5, '#C9D1DC'); fillE(g, -98, 350, 8, 3, '#9FD3F0');
    /* a vitrine with a replica terminal, a wayfinding sign (behind the title card; seen with "View the scene") */
    soft(g, 86, F + 4, 70, 8, 0.22); fillRR(g, 30, 400, 112, 70, 4, WOOD); fillRR(g, 26, 394, 120, 10, 3, '#8A5A3B'); fillRR(g, 34, 250, 104, 146, 4, 'rgba(220,238,248,.55)'); g.strokeStyle = BRASS_D; g.lineWidth = 2; rr(g, 34, 250, 104, 146, 4); g.stroke();
    fillRR(g, 52, 300, 68, 56, 8, '#E8DCC2'); fillRR(g, 58, 306, 56, 40, 4, '#1E2A22'); fillRR(g, 48, 356, 76, 16, 4, '#D9CBAE'); for (var kb2 = 0; kb2 < 8; kb2++) fillRR(g, 52 + kb2 * 8.6, 360, 6, 3, 1, '#B8A888');
    g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.moveTo(44, 396); g.lineTo(84, 254); g.lineTo(96, 254); g.lineTo(56, 396); g.closePath(); g.fill();
    fillRR(g, 50, 418, 72, 22, 3, '#FFFDF8'); text(g, 'TERMINAL', 86, 428, 7, 800, INK, 'center'); text(g, 'replica', 86, 436, 5.6, 700, '#7A6337', 'center');
    fillRR(g, -230, 196, 170, 30, 6, INK); text(g, 'GALLERIES 01–04  →', -145, 216, 10, 800, BRASS_L, 'center');
    /* the card zone's wall: pendant-lamp glows, the how-it-works screen, the timeline, the audio-guide post */
    LAMPS.forEach(function (lx) { var lg = g.createRadialGradient(lx, -24, 4, lx, -24, 110); lg.addColorStop(0, 'rgba(255,226,150,.38)'); lg.addColorStop(1, 'rgba(255,226,150,0)'); g.fillStyle = lg; g.fillRect(lx - 110, -134, 220, 220); });
    fillRR(g, SCR.x + 18, SCR.y - 18, 6, 12, 2, BRASS_D); fillRR(g, SCR.x + SCR.w - 24, SCR.y - 18, 6, 12, 2, BRASS_D);
    shadowed(g, 12, 4, 0.18, function () { fillRR(g, SCR.x - 8, SCR.y - 8, SCR.w + 16, SCR.h + 16, 10, '#2A3142'); }); fillRR(g, SCR.x, SCR.y, SCR.w, SCR.h, 4, '#FFFFFF');
    fillRR(g, SCR.x, SCR.y, SCR.w, 18, 4, INK); g.fillRect(SCR.x, SCR.y + 12, SCR.w, 6); text(g, 'HOW IT WORKS', SCR.x + 9, SCR.y + 12.4, 7.4, 800, BRASS_L); text(g, 'every exhibit', SCR.x + SCR.w - 9, SCR.y + 12.4, 6, 700, '#BFD3DA', 'right');
    fillRR(g, SCR.x + 34, SCR.y + SCR.h + 14, SCR.w - 68, 18, 3, '#FFFDF8'); g.strokeStyle = STONE_D; g.lineWidth = 1; rr(g, SCR.x + 34, SCR.y + SCR.h + 14, SCR.w - 68, 18, 3); g.stroke(); text(g, 'ask · find · answer · approve', SCR.x + SCR.w / 2, SCR.y + SCR.h + 25.6, 6.4, 800, '#7A6337', 'center');
    shadowed(g, 10, 4, 0.16, function () { fillRR(g, TL.x, TL.y, TL.w, TL.h, 6, '#FFFDF8'); }); g.strokeStyle = STONE_D; g.lineWidth = 1.2; rr(g, TL.x + 5, TL.y + 5, TL.w - 10, TL.h - 10, 4); g.stroke();
    fillRR(g, TL.x + TL.w / 2 - 74, TL.y - 8, 148, 18, 4, INK); text(g, 'FROM ABACUS TO AGENTS', TL.x + TL.w / 2, TL.y + 4.4, 7.6, 800, BRASS_L, 'center');
    g.strokeStyle = BRASS; g.lineWidth = 2.4; g.beginPath(); g.moveTo(TL.x + 30, TL.y + 44); g.lineTo(TL.x + TL.w - 30, TL.y + 44); g.stroke();
    [['count', '#7A5236'], ['store', PUR], ['compute', TEAL], ['converse', BLUE]].forEach(function (m, i) { var x = TL.x + 36 + i * 56, y = TL.y + 44; fillE(g, x, y, 18, 18, '#FFFFFF'); g.strokeStyle = m[1]; g.lineWidth = 2.4; g.beginPath(); g.arc(x, y, 17, 0, 7); g.stroke();
      if (i === 0) { g.strokeStyle = '#7A5236'; g.lineWidth = 1.6; rr(g, x - 10, y - 9, 20, 18, 2); g.stroke(); for (var r = 0; r < 3; r++) { g.beginPath(); g.moveTo(x - 10, y - 4 + r * 5); g.lineTo(x + 10, y - 4 + r * 5); g.stroke(); for (var b = 0; b < 3; b++) fillE(g, x - 6 + b * 3.6 + (r % 2) * 4, y - 4 + r * 5, 1.9, 1.9, [RED, AMB, TEAL][r]); } }
      else if (i === 1) { fillRR(g, x - 11, y - 7, 22, 14, 2, '#F2E2C4'); g.fillStyle = PUR; for (var h = 0; h < 8; h++) g.fillRect(x - 8 + h * 2.4, y - 4 + (h * 7 % 3) * 3, 1.4, 2.2); }
      else if (i === 2) { fillRR(g, x - 10, y - 9, 20, 14, 2, '#1E2A22'); fillRR(g, x - 7, y - 6, 9, 2, 1, '#7FE3A0'); fillRR(g, x - 7, y - 2, 6, 2, 1, '#7FE3A0'); fillRR(g, x - 12, y + 6, 24, 4, 1.5, '#D9CBAE'); }
      else icBot(g, x, y + 1, 9, BLUE);
      text(g, m[0], x, TL.y + 80, 7, 800, '#7A6337', 'center'); });
    fillRR(g, AUD.x, AUD.y, AUD.w, AUD.h, 10, INK); fillRR(g, AUD.x + 3, AUD.y + 3, AUD.w - 6, AUD.h - 6, 8, '#1C3C45'); g.strokeStyle = BRASS; g.lineWidth = 1.4; rr(g, AUD.x + 6, AUD.y + 6, AUD.w - 12, AUD.h - 12, 7); g.stroke();
    text(g, 'AUDIO GUIDE', AUD.x + AUD.w / 2, AUD.y + 22, 9, 800, BRASS_L, 'center'); fillRR(g, AUD.x + 14, AUD.y + 30, AUD.w - 28, 30, 4, '#0E1E24');
    [[AUD.x + 36, TEAL], [AUD.x + 88, AMB]].forEach(function (h) { fillRR(g, h[0] - 9, AUD.y + 72, 18, 6, 3, BRASS_D); g.strokeStyle = '#0E1E24'; g.lineWidth = 1.4; g.beginPath(); for (var q = 0; q < 6; q++) { g.lineTo(h[0] + (q % 2 ? 4 : -4), AUD.y + 124 + q * 3.2); } g.stroke();
      fillRR(g, h[0] - 6, AUD.y + 78, 12, 46, 6, h[1]); fillRR(g, h[0] - 9, AUD.y + 78, 18, 12, 5, h[1]); fillRR(g, h[0] - 9, AUD.y + 112, 18, 12, 5, h[1]); fillRR(g, h[0] - 3, AUD.y + 82, 6, 2, 1, 'rgba(255,255,255,.5)'); });
    text(g, 'TRACKS 01–04', AUD.x + AUD.w / 2, AUD.y + AUD.h - 12, 7, 800, '#BFD3DA', 'center');
    /* ---- the right margin: the museum shop ---- */
    fillRR(g, 1030, -40, 330, F + 40, 6, '#FFFDF7'); g.fillStyle = 'rgba(150,120,70,.08)'; g.fillRect(1030, -40, 330, 14);
    fillRR(g, 1060, -32, 230, 34, 6, PINK); text(g, 'MUSEUM SHOP', 1175, -10, 12.5, 800, '#FFFFFF', 'center');
    for (var s = 0; s < 3; s++) { var shy = 70 + s * 74; fillRR(g, 1040, shy, 310, 7, 2, WOOD); g.fillStyle = 'rgba(80,50,20,.15)'; g.fillRect(1040, shy + 7, 310, 3);
      for (var it = 0; it < 8; it++) { var ix = 1056 + it * 38, kind = (it + s) % 4;
        if (kind === 0) { fillRR(g, ix - 9, shy - 30, 18, 22, 6, ['#3167CA', '#0E9384', '#D97B12'][s]); fillRR(g, ix - 7, shy - 46, 14, 14, 4, '#C9D2DE'); fillE(g, ix - 3, shy - 40, 1.8, 1.8, INK); fillE(g, ix + 3, shy - 40, 1.8, 1.8, INK); }
        else if (kind === 1) { fillRR(g, ix - 9, shy - 22, 16, 22, 3, '#FFFFFF'); g.strokeStyle = '#C9D2DE'; g.lineWidth = 2; g.beginPath(); g.arc(ix + 8, shy - 11, 5, -1.2, 1.2); g.stroke(); CO.plane(g, ix - 1, shy - 12, 0.5, 0, BLUE); }
        else if (kind === 2) { fillE(g, ix, shy - 16, 13, 14, '#FFFFFF'); fillRR(g, ix - 9, shy - 22, 18, 9, 4, '#1B2350'); fillE(g, ix - 4, shy - 18, 2, 2, '#7FD6FF'); fillE(g, ix + 4, shy - 18, 2, 2, '#7FD6FF'); }
        else { fillRR(g, ix - 10, shy - 30, 20, 30, 3, ['#F2E2C4', '#E3ECFB', '#DDF2EE'][s]); g.strokeStyle = WOOD; g.lineWidth = 1.6; g.beginPath(); g.arc(ix, shy - 30, 6, Math.PI, 0); g.stroke(); fillE(g, ix, shy - 16, 4, 4, [AMB, BLUE, TEAL][s]); } } }
    /* the exit sign, the clock frame */
    fillRR(g, 1230, -96, 76, 24, 5, OK); text(g, 'EXIT  →', 1268, -79.5, 10.5, 800, '#FFFFFF', 'center');
  }
  function beamCtl(k) { var b = BAY[k], tx = b.x + b.w / 2; return [lerp(GL.x, tx, 0.75), GL.y + 40]; }
  function paintFront(g, e) {
    /* 02: the open console desk, its side monitor and keyboard (the engineer sits behind it) */
    CO.desk(g, 374, 384, 156, F, { open: true, legs: '#5C6B7A', top: '#8A6440' }); g.fillStyle = 'rgba(113,75,103,.45)'; g.fillRect(392, 385, 120, 4);
    fillRR(g, 404, 376, 10, 8, 2, '#5C6B7A'); fillRR(g, 394, 382, 30, 4, 2, '#5C6B7A'); shadowed(g, 8, 3, 0.18, function () { fillRR(g, 380, 322, 58, 54, 5, '#2A3142'); });
    fillRR(g, 456, 377, 46, 7, 2, '#3D4560'); for (var kq = 0; kq < 8; kq++) fillRR(g, 458 + kq * 5.4, 379, 4, 3, 1, '#C9D2DE');
    /* the gate: the stamp pad's lectern, in front of the approver */
    soft(g, PAD.x + 2, F + 4, 30, 6, 0.22); fillRR(g, PAD.x - 6, PAD.y + 8, 16, F - PAD.y - 8, 3, WOOD); fillRR(g, PAD.x - 20, PAD.y, 44, 12, 4, '#8A6440'); fillRR(g, PAD.x - 16, PAD.y - 4, 34, 6, 2, '#2A3550'); fillRR(g, PAD.x - 22, F - 8, 48, 8, 3, '#7A5236');
    /* 04: the kiosk's ledge and the hand-off bell's base */
    fillRR(g, 852, 330, 80, 8, 3, '#DCE6F7'); fillRR(g, BELL.x - 14, 326, 28, 5, 2, '#5C6B7A'); fillRR(g, 856, 316, 20, 14, 3, '#FFFFFF'); text(g, 'a person', 866, 325.6, 4.6, 800, BLUE, 'center');
    /* 03: the lever's housing */
    fillRR(g, LEVER.x - 10, LEVER.y, 20, 26, 4, '#5C6B7A'); fillRR(g, LEVER.x - 14, LEVER.y + 22, 28, 6, 3, '#3D4560');
    /* the welcome desk's curved front (margin) and the shop counter */
    shadowed(g, 10, 4, 0.16, function () { fillRR(g, -918, 380, 166, 90, 14, '#FFFFFF'); }); fillRR(g, -918, 380, 166, 12, 6, TEAL); fillRR(g, -904, 404, 138, 44, 8, '#EAF6F3'); text(g, 'INFORMATION', -835, 431, 9.5, 800, '#0A6B60', 'center');
    shadowed(g, 10, 4, 0.16, function () { fillRR(g, 1116, 388, 160, 82, 10, '#FFFFFF'); }); fillRR(g, 1116, 388, 160, 10, 5, PINK); fillRR(g, 1128, 410, 136, 40, 6, '#FDECF1'); text(g, 'PAY HERE', 1196, 434, 9.5, 800, '#A3264A', 'center');
  }
  function paintFore(g, e) { /* the static foreground: velvet ropes, the info totem, the bench, the glass dome, the touch table, palms */
    function post(x, y) { soft(g, x, y + 3, 16, 4, 0.24); fillE(g, x, y, 13, 4, BRASS_D); fillRR(g, x - 3, y - 64, 6, 64, 3, BRASS); fillE(g, x, y - 66, 6, 6, BRASS_L); }
    function rope(x0, x1, y) { g.strokeStyle = '#B5303A'; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.moveTo(x0, y - 60); g.quadraticCurveTo((x0 + x1) / 2, y - 26, x1, y - 60); g.stroke(); g.strokeStyle = 'rgba(255,255,255,.25)'; g.lineWidth = 1.4; g.stroke(); }
    [[-456, -330, 548], [1176, 1250, 640]].forEach(function (r) { rope(r[0], r[1], r[2]); post(r[0], r[2]); post(r[1], r[2]); });
    function pot(x, y) { K.plant(g, { x: x, y: y }, '#C9A227', '#DDBB46'); }
    pot(-688, 690);
    /* the info totem: a brass foot, a slim pillar, the touch screen (its content is live) */
    var T = TOT; soft(g, T.x, T.y + 3, 40, 7, 0.26); fillE(g, T.x, T.y, 30, 7, BRASS_D); fillE(g, T.x, T.y - 2, 26, 5, BRASS); fillRR(g, T.x - 11, T.y - 92, 22, 90, 6, '#E9EEF5'); g.fillStyle = 'rgba(60,80,110,.12)'; g.fillRect(T.x + 4, T.y - 90, 5, 86);
    fillE(g, T.x, T.y - 44, 9, 9, TEAL); text(g, 'i', T.x, T.y - 40, 11, 800, '#FFFFFF', 'center');
    shadowed(g, 10, 4, 0.2, function () { fillRR(g, T.x - 34, T.y - 160, 68, 78, 10, INK); }); fillRR(g, T.x - 34, T.y - 160, 68, 10, 6, TEAL);
    /* the bench (the sketching visitor sits on it): a buttoned leather top on oak legs */
    var B0 = BEN; soft(g, B0.x, B0.y + 3, 96, 8, 0.24); [-70, 70].forEach(function (d) { fillRR(g, B0.x + d - 6, B0.y - 36, 12, 36, 3, '#7A5236'); fillRR(g, B0.x + d - 9, B0.y - 4, 18, 5, 2, '#5C3B22'); });
    fillRR(g, B0.x - 80, B0.y - 50, 160, 16, 6, '#2E5560'); fillRR(g, B0.x - 80, B0.y - 40, 160, 6, 3, '#1F3E46'); for (var bt = -60; bt <= 60; bt += 30) fillE(g, B0.x + bt, B0.y - 44, 2, 1.6, '#173238');
    fillRR(g, B0.x + 30, B0.y - 76, 30, 28, 4, '#E9A23B'); g.strokeStyle = '#B87A1E'; g.lineWidth = 2; g.beginPath(); g.arc(B0.x + 45, B0.y - 76, 9, Math.PI, 0); g.stroke(); fillRR(g, B0.x + 36, B0.y - 68, 18, 8, 2, '#FFFDF8'); text(g, 'SHOP', B0.x + 45, B0.y - 62, 4.6, 800, '#B87A1E', 'center');
    /* the glass dome on its plinth: a sensor head, prototype replica */
    var D0 = DOME; soft(g, D0.x, D0.y + 3, 44, 7, 0.24); fillRR(g, D0.x - 32, D0.y - 66, 64, 66, 4, STONE); fillRR(g, D0.x - 36, D0.y - 72, 72, 10, 3, STONE_D); fillRR(g, D0.x - 22, D0.y - 46, 44, 18, 2, '#FFFDF8');
    text(g, 'SENSOR HEAD', D0.x, D0.y - 37, 6, 800, INK, 'center'); text(g, 'prototype replica', D0.x, D0.y - 31, 4.6, 700, '#7A6337', 'center');
    fillRR(g, D0.x - 16, D0.y - 98, 32, 26, 9, '#C9D2DE'); fillRR(g, D0.x - 12, D0.y - 92, 24, 12, 5, '#2A3550'); fillRR(g, D0.x - 3, D0.y - 106, 6, 9, 2, '#8E9AAB'); fillRR(g, D0.x - 10, D0.y - 76, 20, 5, 2, '#8E9AAB');
    g.fillStyle = 'rgba(220,238,248,.35)'; g.beginPath(); g.moveTo(D0.x - 28, D0.y - 72); g.lineTo(D0.x - 28, D0.y - 104); g.arc(D0.x, D0.y - 104, 28, Math.PI, 0); g.lineTo(D0.x + 28, D0.y - 72); g.closePath(); g.fill();
    g.strokeStyle = 'rgba(255,255,255,.9)'; g.lineWidth = 1.6; g.stroke(); g.fillStyle = 'rgba(255,255,255,.55)'; g.fillRect(D0.x - 20, D0.y - 118, 4, 34);
    /* the touch table: a glowing glass top on a pedestal (the visitor stands behind it) */
    var T2 = TT; soft(g, T2.x, T2.y + 3, 60, 7, 0.24); fillE(g, T2.x, T2.y, 34, 6, '#3D4A5C'); fillRR(g, T2.x - 15, T2.y - 70, 30, 70, 6, '#E9EEF5'); g.fillStyle = 'rgba(60,80,110,.12)'; g.fillRect(T2.x + 5, T2.y - 68, 7, 64);
    g.fillStyle = '#2A3142'; g.beginPath(); g.moveTo(T2.x - 70, T2.y - 74); g.lineTo(T2.x + 70, T2.y - 74); g.lineTo(T2.x + 62, T2.y - 88); g.lineTo(T2.x - 62, T2.y - 88); g.closePath(); g.fill();
    fillRR(g, T2.x - 72, T2.y - 76, 144, 9, 4, '#3D4560'); fillRR(g, T2.x - 52, T2.y - 62, 104, 13, 3, '#FFFDF8'); text(g, 'TOUCH TABLE · try a use case', T2.x, T2.y - 53, 6, 800, INK, 'center');
  }

  /* ------------------------------ the cast ------------------------------ */
  var W = CR.who;
  var DOC = W({ x: 216, y: 470, s: 0.48, ph: 0.4, skin: 1, hair: 0, style: 'bob', outfit: 'cardigan', top: TEAL, top2: '#FFFFFF', hands: [[-60, -196], [60, -196]], look: 0.4 });
  var ENG = W({ x: 486, y: 470, s: 0.48, ph: 1.2, skin: 2, hair: 1, style: 'short', outfit: 'shirt', top: '#6A4F8F', glasses: true, sit: true, chairCol: INK, hands: [[-50, -236], [50, -236]], look: -0.3 });
  var APP = W({ x: 612, y: 470, s: 0.48, ph: 2.1, skin: 0, hair: 2, style: 'pony', outfit: 'shirt', top: '#2E8A63', id: '#9AA6BC', hands: [[-90, -196], [60, -196]], look: -0.5 });
  APP.clipCol = BRASS_L;
  var MEC = W({ x: 790, y: 470, s: 0.49, ph: 2.8, skin: 3, hair: 0, style: 'short', outfit: 'polo', top: '#26407A', print: AMB, hands: [[-70, -150], [80, -230]], look: -0.4 });
  var VIS = W({ x: 962, y: 470, s: 0.47, ph: 3.5, skin: 4, hair: 3, style: 'long', outfit: 'polo', top: PINK, id: '#9AA6BC', hands: [[-40, -230], [40, -232]], look: -0.6 });
  var CREW = [
    { x0: 1120, x1: 1225, y: 488, spd: 14, ph: 0.3, label: 'Visitor', lines: ['Got a **Nexi** plush from the shop!', 'Every exhibit runs on the **same data**. Clever.', 'The booth handed me to **a real person**. Nice.'], acts: ['cheer', 'love', 'wave'],
      P: W({ s: 0.5, skin: 2, hair: 2, style: 'bun', outfit: 'cardigan', top: '#E9A23B', top2: '#FFFFFF', id: '#9AA6BC', hold: 'bags' }) },
    { x0: -900, x1: -768, y: 486, spd: 12, ph: 0.7, label: 'Visitor', lines: ['Which exhibit saves **the most hours**? Let\'s find out.', 'First stop: the **Answer Archive**.'], acts: ['wave', 'think', 'jump'],
      P: W({ s: 0.5, skin: 1, hair: 1, style: 'short', outfit: 'shirt', top: '#5B8DEF', id: '#9AA6BC', hold: 'tablet' }) },
    { front: true, x0: -880, x1: -764, y: 672, spd: 14, ph: 0.15, label: 'TechNext docent', lines: ['New documents for the archive: **approved content only**.', 'Everything in this hall reads **your data**, nothing else.'], acts: ['id', 'nod', 'cheer'],
      P: W({ s: 0.56, skin: 0, hair: 0, style: 'pony', outfit: 'polo', top: TEAL, hold: 'box', hands: [[-60, -212], [70, -150]] }) },
    { front: true, x0: 1186, x1: 1236, y: 700, spd: 10, ph: 0.55, label: 'Visitor with a guidebook', lines: ['Exhibit 01 answers with **the source**. Love it.', 'Page 4: "a person approves anything that **moves money**".'], acts: ['msmBook'],
      P: W({ s: 0.58, skin: 3, hair: 2, style: 'long', outfit: 'cardigan', top: '#8C76B8', top2: '#FFFFFF', id: '#9AA6BC', hold: 'clipboard' }) },
    { front: true, x0: 1090, x1: 1160, y: 652, spd: 12, ph: 0.85, label: 'TechNext guide', lines: ['Each bay is one of **our four disciplines**.', 'Start with the task that costs your team **the most hours**.'], acts: ['wave', 'spin', 'id'],
      P: W({ s: 0.57, skin: 2, hair: 1, style: 'short', outfit: 'shirt', top: BLUE, glasses: true, hold: 'tablet' }) }
  ];
  /* the guidebook reader's own move: opens the guidebook overhead like a fan, a turn, a little bow */
  CR.ACT.msmBook = { dur: 1.8, fx: 'star', pose: function (P, u) { P.mood = 'happy'; var k = Math.min(1, u / 0.25); P.hands = [[lerp(-70, -40, k), lerp(-150, -420, k)], [lerp(70, 40, k), lerp(-150, -420, k)]];
    P.sx = u > 0.25 && u < 0.7 ? Math.cos((u - 0.25) / 0.45 * Math.PI * 2) : 1; P.tilt = u > 0.78 ? 0.16 : 0; P.hop = u < 0.7 ? Math.abs(Math.sin(u * Math.PI * 2)) * 8 : 0; } };
  var FX = { page: -9, odoo: -9, gate: -9, oil: -9, selfie: -9, lever: -9, bell: -9, globe: -9, map: -9, gift: -9, robot: -9 };
  function kCyc(S, t) { return S.hot === 'know' ? ((t - (S.kT || 0)) * 0.9) % 8 : (t * 0.42) % 8; }
  function oCyc(S, t) { return S.hot === 'odoo' ? ((t - (S.kT || 0)) * 0.9) % 8 : ((t + 2) * 0.4) % 8; }
  function gCyc(t) { return (t * 0.5 + 1) % 6; }

  function actDoc(P, t, S) { /* the docent: reaches up for a binder, reads it, shows the kiosk; tap: lifts the open binder and a page flies to the kiosk */
    var st = S.cast.doc, u = tapU(st, t, 2.2), c = (t + 0.5) % 10, busy = S.hot === 'know'; reset(P); P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm'; P.binder = 0;
    if (u >= 0) { P.talk = true; P.mood = u < 0.3 ? 'wow' : 'happy'; var k2 = ease(u / 0.3); P.hands = [[lerp(-40, -60, k2), lerp(-250, -410, k2)], [lerp(40, 60, k2), lerp(-250, -410, k2)]]; P.binder = 2;
      if (u > 0.3 && !st._b) { st._b = 1; FX.page = t; CR.burst('star', P.x, P.y - 300, t); } if (u > 0.7) { P.sx = Math.cos((u - 0.7) / 0.3 * Math.PI * 2); P.hop = Math.sin((u - 0.7) / 0.3 * Math.PI) * 14; } return; }
    st._b = 0;
    if (busy || c < 3) { P.hands = [[-60, -196], [lerp(60, 110, ease(c / 0.6)), lerp(-196, -420, ease(c / 0.6))]]; P.look = lerp(P.look, 0.5, 0.1); P.tilt = -0.06; }
    else if (c < 5.6) { P.hands = [[-36, -250 + Math.sin(t * 2) * 3], [36, -250 - Math.sin(t * 2) * 3]]; P.binder = 1; P.look = lerp(P.look, 0, 0.1); if (c > 4.4) P.mood = 'happy'; }
    else if (c < 8) { P.hands = [[-60, -196], [150, -250 + Math.sin(t * 3) * 6]]; P.talk = true; looks(P, st, t, S, 0.9); }
    else { P.hands = [[-30, -180], [30, -182]]; looks(P, st, t, S, Math.sin(t * 0.8) * 0.6); P.tilt = Math.sin(t * 1.5) * 0.03; }
  }
  function actEng(P, t, S) { /* the Odoo engineer, seated: types, turns to the side monitor, looks up at the bill, stretches; tap: a full chair spin and every field flashes */
    var st = S.cast.eng, u = tapU(st, t, 2.0), c = (t + 1.1) % 9, busy = S.hot === 'odoo'; reset(P); P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm';
    if (u >= 0) { P.talk = true; P.mood = 'happy'; P.sx = Math.cos(u * Math.PI * 2); P.hands = u < 0.6 ? [[-100, -330], [100, -330]] : [[-110, -420 + Math.sin(t * 14) * 8], [110, -420 - Math.sin(t * 14) * 8]];
      if (!st._b) { st._b = 1; FX.odoo = t; CR.burst('code', P.x, P.y - 250, t); } return; }
    st._b = 0;
    if (busy || c < 4) { var kk = Math.abs(Math.sin(t * (busy ? 12 : 9) + P.ph)) * 7; P.hands = [[-40, -236 - kk], [44, -236 - (7 - kk)]]; P.look = lerp(P.look, 0.15, 0.1); P.tilt = -0.04; }
    else if (c < 5.6) { P.hands = [[-110, -236], [30, -236]]; P.look = lerp(P.look, -0.9, 0.1); P.sx = 0.92; }
    else if (c < 7.4) { P.hands = [[-50, -236], [50, -236]]; P.look = lerp(P.look, 0, 0.1); P.tilt = -0.12; if (c > 6.6) { P.mood = 'happy'; P.tilt = -0.12 + Math.sin(t * 10) * 0.04; } }
    else { var s2 = Math.sin((c - 7.4) / 1.6 * Math.PI); P.hands = [[-90, lerp(-236, -440, s2)], [90, lerp(-236, -440, s2)]]; P.mood = s2 > 0.6 ? 'happy' : 'calm'; P.tilt = Math.sin(t * 3) * 0.04; }
  }
  function actApp(P, t, S) { /* the approver (client): checks the capsule on the pad, raises the stamp, stamps, files it; tap: a double stamp and APPROVED on the sign */
    var st = S.cast.app, u = tapU(st, t, 2.2), c = gCyc(t), busy = S.hot === 'gate'; reset(P); P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm'; P.stampDown = 0;
    if (u >= 0) { P.talk = true; P.mood = u < 0.5 ? 'wow' : 'happy'; var q = u < 0.5 ? Math.abs(Math.sin(u / 0.5 * Math.PI * 2)) : 0;
      P.hands = u < 0.5 ? [[-90, -196], [lerp(-60, -40, q), lerp(-200, -380, q)]] : [[-110, -420 + Math.sin(t * 12) * 6], [110, -420 - Math.sin(t * 12) * 6]]; P.stampDown = u < 0.5 && q < 0.15 ? 1 : 0; P.hop = u > 0.5 ? Math.abs(Math.sin(u * Math.PI * 4)) * 14 : 0;
      if (u > 0.5 && !st._b) { st._b = 1; FX.gate = t; CR.burst('conf', 590, 100, t); } return; }
    st._b = 0;
    if (c < 1.6) { P.hands = [[-90, -196], [50, -230]]; P.look = lerp(P.look, -0.7, 0.1); P.tilt = -0.05; }
    else if (c < 2.6) { var r = ease((c - 1.6) / 1); P.hands = [[-90, -196], [lerp(50, -40, r), lerp(-230, -400, r)]]; P.look = lerp(P.look, -0.8, 0.1); }
    else if (c < 3.0) { var dn = ease((c - 2.6) / 0.25); P.hands = [[-90, -196], [lerp(-40, -60, dn), lerp(-400, -200, dn)]]; P.stampDown = dn > 0.9 ? 1 : 0; P.hop = dn > 0.9 ? 4 : 0; }
    else if (c < 4.2) { P.hands = [[-90, -196], [-30, -260]]; P.mood = 'happy'; P.look = lerp(P.look, -0.4, 0.1); }
    else { P.hands = [[-60, -196], [60, -196]]; looks(P, st, t, S, 0.3); P.tilt = Math.sin(t * 1.3) * 0.03; }
  }
  function actMec(P, t, S) { /* the machine's engineer: cranks the marble lift, wipes his brow, watches a marble; tap: oils the gears, they whirr, thumbs up */
    var st = S.cast.mec, u = tapU(st, t, 2.4), c = (t + 2.2) % 8, busy = S.hot === 'auto'; reset(P); P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm'; P.oil = 0;
    if (u >= 0) { P.talk = true; P.mood = 'happy'; P.oil = u < 0.65 ? 1 : 0; P.hands = u < 0.65 ? [[-70, -150], [lerp(80, -20, ease(u / 0.2)), lerp(-230, -330, ease(u / 0.2)) + (u > 0.2 ? Math.sin(t * 20) * 6 : 0)]] : [[-70, -150], [70, -380]];
      P.look = u < 0.65 ? -0.6 : 0.2; P.hop = u > 0.65 ? Math.sin((u - 0.65) / 0.35 * Math.PI) * 16 : 0; if (u > 0.2 && !st._b) { st._b = 1; FX.oil = t; } return; }
    st._b = 0;
    if (busy || c < 4.5) { var a = t * 4; P.hands = [[-50, -170], [70 + Math.cos(a) * 26, -300 + Math.sin(a) * 26]]; P.look = lerp(P.look, -0.3, 0.1); P.tilt = Math.sin(a) * 0.03; }
    else if (c < 5.6) { P.hands = [[-30, -390 + Math.sin(t * 8) * 10], [80, -230]]; P.tilt = -0.08; P.mood = 'happy'; }
    else { P.hands = [[-70, -150], [80, -170]]; looks(P, st, t, S, -0.7); P.tilt = Math.sin(t * 2) * 0.04; }
  }
  function actVis(P, t, S) { /* the visitor: chats on her phone, laughs when the bot answers, waves at the kiosk; tap: a selfie with the bot, flash and hearts */
    var st = S.cast.vis, u = tapU(st, t, 2.2), c = (t + 3) % 7, busy = S.hot === 'chat'; reset(P); P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm'; P.phone = 1;
    if (u >= 0) { P.talk = true; P.mood = 'happy'; var k2 = ease(u / 0.25); P.hands = [[lerp(-40, -10, k2), lerp(-230, -400, k2)], [lerp(40, 150, k2), lerp(-232, -430, k2)]]; P.phone = 2; P.tilt = -0.12 * k2; P.look = -0.4;
      if (u > 0.45 && !st._b) { st._b = 1; FX.selfie = t; CR.burst('heart', P.x - 30, P.y - 300, t); } return; }
    st._b = 0;
    if (busy || c < 3.4) { var th = Math.abs(Math.sin(t * 10 + P.ph)) * 6; P.hands = [[-36, -232 - th], [34, -236]]; P.look = lerp(P.look, -0.1, 0.1); P.tilt = 0.05; }
    else if (c < 4.6) { P.hands = [[-36, -232], [34, -236]]; P.mood = 'happy'; P.tilt = Math.sin(t * 9) * 0.06; P.hop = Math.abs(Math.sin(t * 9)) * 4; }
    else if (c < 5.8) { P.hands = [[-130, -360 + Math.sin(t * 12) * 18], [34, -236]]; P.look = lerp(P.look, -1, 0.1); P.mood = 'happy'; }
    else { P.hands = [[-36, -232], [34, -236]]; looks(P, st, t, S, -0.5); }
  }

  /* ------------------------------ the live layers ------------------------------ */
  /* the margin people: the welcome-desk docent (behind the desk) and the shop's cashier */
  var WEL = W({ x: -835, y: 470, s: 0.52, ph: 0.9, skin: 2, hair: 0, style: 'bun', outfit: 'polo', top: TEAL, hands: [[-60, -196], [60, -196]] });
  var CASH = W({ x: 1196, y: 470, s: 0.52, ph: 1.7, skin: 1, hair: 1, style: 'short', outfit: 'cardigan', top: PINK, top2: '#FFFFFF', hands: [[-60, -196], [60, -196]] });
  function wel(g, t) { var P = WEL, u = (t - FX.map) / 2.2, c = (t + 1) % 7; reset(P); P.talk = u >= 0 && u < 1;
    if (u >= 0 && u < 1) { P.mood = 'happy'; var k2 = ease(u / 0.3); P.hands = [[lerp(-40, -150, k2), -300], [lerp(40, 150, k2), -300]]; P.hop = u > 0.3 ? Math.abs(Math.sin(u * Math.PI * 3)) * 8 : 0; }
    else if (c < 2.5) { P.hands = [[-60, -196], [lerp(60, 150, ease(c / 0.6)), -230]]; P.look = 0.7; }
    else if (c < 4.5) { P.hands = [[-40, -206 - Math.abs(Math.sin(t * 6)) * 6], [40, -206]]; P.look = 0; P.tilt = 0.05; }
    else { P.hands = [[-60, -196], [60, -196]]; P.look = Math.sin(t * 0.9) * 0.8; P.mood = c > 6 ? 'happy' : 'calm'; }
    K.person(g, P, t);
    var h1 = hw(P, 1); if (!(u >= 0 && u < 1) && c < 2.5) { g.save(); g.translate(h1[0] + 4, h1[1] - 6); g.rotate(-0.2); fillRR(g, -10, -14, 20, 26, 2, '#FFFFFF'); fillRR(g, -8, -10, 7, 8, 1, TEAL); fillRR(g, 1, -10, 7, 8, 1, AMB); fillRR(g, -8, 0, 7, 8, 1, PUR); fillRR(g, 1, 0, 7, 8, 1, BLUE); g.restore(); }
    if (u >= 0 && u < 1) { var h0 = hw(P, 0), mw = h1[0] - h0[0]; fillRR(g, h0[0], h0[1] - 34, mw, 46, 3, '#FFFFFF'); g.strokeStyle = '#E2D5BA'; g.lineWidth = 1; for (var f = 1; f < 4; f++) { g.beginPath(); g.moveTo(h0[0] + mw * f / 4, h0[1] - 34); g.lineTo(h0[0] + mw * f / 4, h0[1] + 12); g.stroke(); }
      ORDER.forEach(function (k, i) { fillRR(g, h0[0] + 6 + i * (mw - 12) / 4, h0[1] - 26, (mw - 12) / 4 - 4, 24, 2, BAY[k].c); }); text(g, 'FLOOR PLAN', (h0[0] + h1[0]) / 2, h0[1] + 8, 6.4, 800, INK, 'center'); }
  }
  function cash(g, t) { var P = CASH, u = (t - FX.gift) / 2.2, c = (t + 2) % 6; reset(P); P.talk = u >= 0 && u < 1;
    if (u >= 0 && u < 1) { P.mood = 'happy'; P.hands = [[-50, -230 - Math.sin(u * Math.PI * 4) * 30], [50, -230 + Math.sin(u * Math.PI * 4) * 30]]; P.sx = u > 0.6 ? Math.cos((u - 0.6) / 0.4 * Math.PI * 2) : 1; }
    else if (c < 2) { P.hands = [[-90, -210], [lerp(30, 70, Math.abs(Math.sin(t * 3))), -214]]; P.look = -0.5; }
    else if (c < 3.5) { P.hands = [[-40, -230], [40, -230]]; P.look = 0; P.mood = 'happy'; }
    else { P.hands = [[-60, -196], [60, -196]]; P.look = Math.sin(t * 0.7) * 0.8; }
    K.person(g, P, t);
    if (c < 2 && !(u >= 0 && u < 1)) { var hs = hw(P, 1); fillRR(g, hs[0] - 4, hs[1] - 8, 16, 10, 3, '#2A3550'); g.globalAlpha = 0.5 + 0.5 * Math.sin(t * 20); g.fillStyle = '#FF4D5E'; g.fillRect(hs[0] + 10, hs[1] - 6, 22, 1.5); g.globalAlpha = 1; }
    if (u >= 0 && u < 1) { var bx = P.x, by = P.y - 250 * P.s - 40; fillRR(g, bx - 16, by, 32, 24, 3, BLUE); g.fillStyle = '#FFD84A'; g.fillRect(bx - 2, by, 4, 24); g.fillRect(bx - 16, by + 10, 32, 4); fillE(g, bx - 6, by - 4, 7, 5, '#FFD84A'); fillE(g, bx + 6, by - 4, 7, 5, '#FFD84A'); }
  }
  function automaton(g, t) { var bl = ((t + 0.3) % 5) < 0.18, wink = (t - FX.robot) < 1.6 && (t - FX.robot) >= 0;
    [-404, -380].forEach(function (ex, i) { if (bl || (wink && i === 1)) fillRR(g, ex - 5, 225, 10, 2.4, 1, INK); else { fillE(g, ex, 226, 5, 5, '#FFFFFF'); fillE(g, ex, 226, 2.6, 2.6, INK); } });
    fillE(g, -392, 186, 4.5, 4.5, (t % 1.4) < 0.7 || wink ? '#E2553D' : '#F7B4AA');
    if (wink) { var a = Math.sin((t - FX.robot) * 10) * 0.6; g.save(); g.translate(-345, 286); g.rotate(-1.2 + a); fillRR(g, -6, -60, 12, 60, 6, '#A9B4C3'); fillE(g, 0, -62, 8, 8, '#8E9AAB'); g.restore(); }
  }
  function globe(g, t, S) { /* the orbiting chips (behind the sphere is clipped away), the flowing beams, the pulse on its stop */
    var on = S.hot === 'data' || (t - FX.globe) < 2, spd = on ? 1.4 : 0.5;
    ORDER.forEach(function (k, i) { var b = BAY[k], tx = b.x + b.w / 2, c1 = beamCtl(k);
      for (var j = 0; j < 3; j++) { var u = ((t * (on ? 0.6 : 0.3) + j / 3 + i * 0.13) % 1), x = (1 - u) * (1 - u) * GL.x + 2 * u * (1 - u) * c1[0] + u * u * tx, y = (1 - u) * (1 - u) * (GL.y + GL.r * 0.6) + 2 * u * (1 - u) * c1[1] + u * u * -10;
        fillE(g, x, y, 3.2, 3.2, '#FFFFFF'); fillE(g, x, y, 2, 2, b.c); } });
    if (on) { g.strokeStyle = 'rgba(49,103,202,' + (0.35 + 0.3 * Math.sin(t * 6)).toFixed(2) + ')'; g.lineWidth = 3; g.beginPath(); g.arc(GL.x, GL.y, GL.r + 8 + Math.sin(t * 6) * 2, 0, Math.PI * 2); g.stroke(); }
    [['doc', 0], ['rec', 2.09], ['pol', 4.19]].forEach(function (o) { var a = t * spd + o[1], x = GL.x + Math.cos(a) * (GL.r + 22), y = GL.y + Math.sin(a) * 14 - 4, front = Math.sin(a) > 0, sc = front ? 1 : 0.8;
      if (!front && Math.abs(x - GL.x) < GL.r * 0.95) return;
      g.save(); g.globalAlpha = front ? 1 : 0.7; fillE(g, x, y, 11 * sc, 11 * sc, '#FFFFFF'); g.strokeStyle = 'rgba(49,103,202,.35)'; g.lineWidth = 1; g.beginPath(); g.arc(x, y, 11 * sc, 0, 7); g.stroke();
      if (o[0] === 'doc') icDoc(g, x, y, 6 * sc, TEAL); else if (o[0] === 'rec') icDb(g, x, y, 6 * sc, PUR); else icShield(g, x, y, 6.4 * sc, OK); g.restore(); });
  }
  function banners(g, t) { ORDER.forEach(function (k, i) { var b = BAY[k], x = b.x + b.w / 2, sw = Math.sin(t * 0.9 + i * 1.3) * 3, w = 46, y0 = -138, y1 = -48;
    g.fillStyle = BRASS_D; g.fillRect(x - w / 2 - 4, y0 - 2, w + 8, 4);
    g.fillStyle = b.c; g.beginPath(); g.moveTo(x - w / 2, y0); g.lineTo(x + w / 2, y0); g.lineTo(x + w / 2 + sw, y1); g.lineTo(x + sw, y1 - 12); g.lineTo(x - w / 2 + sw, y1); g.closePath(); g.fill();
    g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(x - w / 2 + 4, y0, 4, 70); ICON[k](g, x + sw * 0.4, y0 + 30, 9); text(g, b.n, x + sw * 0.6, y0 + 62, 11, 800, '#FFFFFF', 'center'); }); }
  function kiosk(g, t, S) { /* 01: the question types, the binders are scanned, the source lights up, the answer cites it */
    var c = kCyc(S, t), K0 = KIO, flash = (t - FX.page) < 1.6 && (t - FX.page) >= 0;
    fillRR(g, K0.x, K0.y, K0.w, K0.h, 4, '#FFFFFF'); fillRR(g, K0.x, K0.y, K0.w, 14, 4, TEAL); g.fillRect(K0.x, K0.y + 8, K0.w, 6); text(g, 'Ask the archive', K0.x + 6, K0.y + 10, 6.2, 800, '#FFFFFF');
    var q = 'How do I claim travel expenses?', qn = Math.floor(clamp(c * 24, 0, q.length)); fillRR(g, K0.x + 22, K0.y + 18, 54, 20, 6, '#EEF2F7'); wrap(g, q.slice(0, qn), K0.x + 26, K0.y + 26, 18, 7.6, 5.6, 700, '#3D4560');
    if (c > 1.6 && c < 3) { for (var i = 0; i < 3; i++) fillE(g, K0.x + 30 + i * 8, K0.y + 50, 2.4, 2.4, i === Math.floor(t * 6) % 3 ? TEAL : '#C9D3E3'); text(g, 'searching your documents', K0.x + 6, K0.y + 64, 5, 700, '#8A96A8'); }
    if (c >= 3 || flash) { var a = 'Submit the receipt in Expenses within 30 days; your manager approves it.', an = flash ? a.length : Math.floor(clamp((c - 3.4) * 30, 0, a.length)); fillRR(g, K0.x + 4, K0.y + 42, 60, 30, 6, '#DDF2EE'); wrap(g, a.slice(0, an), K0.x + 8, K0.y + 50, 20, 6.6, 5, 700, '#0A4F47');
      if (c > 5 || flash) { fillRR(g, K0.x + 4, K0.y + 74, 70, 8, 4, TEAL); text(g, '[1] Expense policy §4.2', K0.x + 8, K0.y + 80, 4.8, 800, '#FFFFFF'); } }
    /* the shelves: a scan beam while searching, the source binder lit when found */
    var kb = BAY.know; if (c > 1.6 && c < 3) { var sx = kb.x + 24 + ((c - 1.6) / 1.4) * (kb.w - 50); g.fillStyle = 'rgba(14,147,132,.18)'; g.fillRect(sx - 6, 56, 12, 136); }
    if ((c >= 3 && c < 7.5) || flash) { var bx = kb.x + 26 + 2 * 14.2, by = 96; g.strokeStyle = 'rgba(255,214,90,' + (0.6 + 0.4 * Math.sin(t * 6)).toFixed(2) + ')'; g.lineWidth = 2.4; rr(g, bx - 3, by - 34, 18, 36, 3); g.stroke(); spark(g, bx + 6, by - 40, 4, '#F2C94C');
      g.strokeStyle = 'rgba(14,147,132,.55)'; g.setLineDash([3, 3]); g.lineWidth = 1.3; g.beginPath(); g.moveTo(bx + 14, by - 16); g.quadraticCurveTo(KIO.x + 40, 150, KIO.x + 30, KIO.y + 74); g.stroke(); g.setLineDash([]); }
  }
  function odooScreen(g, t, S) { /* 02: the bill fills field by field, the PO matches, it waits for the gate, then it is approved */
    var c = oCyc(S, t), fl = (t - FX.odoo) < 1.4 && (t - FX.odoo) >= 0, nf = fl ? 4 : Math.min(4, Math.floor(c)), O = OSC;
    FIELDS.forEach(function (f, i) { var y = O.y + 30 + i * 22, on = i < nf; fillRR(g, O.x + 48, y, 90, 15, 4, fl ? '#F6E9F2' : (i === nf ? '#F3E8F0' : '#F6F8FB'));
      if (on) { text(g, f[1], O.x + 53, y + 10.4, 6.6, 800, INK); if (i === 3) tick(g, O.x + 130, y + 7.5, 4.6); else spark(g, O.x + 131, y + 7.5, 3.6, PUR); }
      else if (i === nf) { fillRR(g, O.x + 53, y + 6, (t * 30) % 40, 3.4, 1.7, '#E1CFDC'); } });
    var appr = c > 6.2, wait = c > 4.4 && !appr; fillRR(g, O.x + 8, O.y + 120, 128, 14, 7, appr ? OK : wait ? '#FFF3D6' : '#F1E6EE');
    text(g, appr ? '✓ Approved by a person' : wait ? 'Waiting for a person…' : 'Prepared by AI', O.x + 72, O.y + 129.6, 6.6, 800, appr ? '#FFFFFF' : wait ? '#8F4C08' : PUR, 'center');
  }
  function gate(g, t, S) { /* the capsules in the tube, down the chute onto the pad, stamped, then away; the lamp, the APPROVED mark */
    var c = gCyc(t), kinds = [PUR, AMB, TEAL, BLUE], n = Math.floor((t * 0.5 + 1) / 6), col = kinds[n % 4], ap = (t - FX.gate) >= 0 && (t - FX.gate) < 1.8;
    if (c < 1.2) { var u = c / 1.2, fromL = n % 2 === 0, x = fromL ? lerp(OSC.x + OSC.w + 8, 560, Math.min(1, u * 1.4)) : lerp(660, 620, Math.min(1, u * 1.4)), y = fromL ? OSC.y + 30 : 120; if (u > 0.7) { x = 563; y = lerp(150, PAD.y - 8, (u - 0.7) / 0.3); } capsule(g, x, y, col, false); }
    else if (c < 4.2) { capsule(g, PAD.x, PAD.y - 8, col, c > 3.0); }
    else if (c < 5) { var v = (c - 4.2) / 0.8; g.globalAlpha = 1 - v; capsule(g, PAD.x + v * 10, PAD.y - 8 - v * 40, col, true); g.globalAlpha = 1; }
    var lit = (c > 3.0 && c < 4.6) || ap; fillE(g, 590, 82, 7, 7, lit ? '#3FE08F' : '#B8D9C8'); if (lit) { g.globalAlpha = 0.35; fillE(g, 590, 82, 14, 14, '#3FE08F'); g.globalAlpha = 1; }
    if (c > 3.0 && c < 3.6) { g.globalAlpha = 1 - (c - 3.0) / 0.6; text(g, 'stamp!', PAD.x + 20, PAD.y - 26 - (c - 3) * 20, 7, 800, OK, 'center'); g.globalAlpha = 1; }
    if (ap) { var a = (t - FX.gate) / 1.8, s = a < 0.15 ? 1.6 - a * 4 : 1; g.save(); g.translate(590, 184); g.rotate(-0.18); g.scale(s, s); g.globalAlpha = a > 0.8 ? (1 - a) * 5 : 0.92;
      g.strokeStyle = OK; g.lineWidth = 3; rr(g, -44, -14, 88, 28, 5); g.stroke(); text(g, 'APPROVED', 0, 5, 13, 800, OK, 'center'); g.restore(); }
  }
  function capsule(g, x, y, col, ok) { fillRR(g, x - 9, y - 5, 18, 10, 5, col); fillRR(g, x - 9, y - 5, 9, 10, 5, 'rgba(255,255,255,.35)'); if (ok) tick(g, x + 10, y - 7, 4.4); }
  function machine(g, t, S) { /* 03: marbles run the stations; each waits at the decision flap until a person lets it through */
    var on = S.hot === 'auto', lv = (t - FX.lever), oil = (t - FX.oil) >= 0 && (t - FX.oil) < 2.4;
    var balls = [t * 0.16, t * 0.16 + 0.5]; if (lv >= 0 && lv < 4) { balls.push(lv * 0.22, lv * 0.22 - 0.1, lv * 0.22 - 0.2); }
    balls.forEach(function (b, i) { if (b < 0) return; var u = b % 1, p = ballAt(u); fillE(g, p[0] + 0.8, p[1] + 1.4, 5, 5, 'rgba(80,40,0,.18)'); fillE(g, p[0], p[1], 5, 5, i > 1 ? OK : ['#3167CA', '#E0456B'][i]); fillE(g, p[0] - 1.6, p[1] - 1.6, 1.6, 1.6, 'rgba(255,255,255,.8)'); });
    var wait = balls.some(function (b) { var u = b % 1; return b >= 0 && u > 0.5 && u < 0.6; }); fillRR(g, 700, 202, 4, 10, 1, wait ? '#C8453B' : OK); text(g, wait ? '…' : '✓', 712, 212, 8, 800, wait ? '#C8453B' : OK);
    /* gears: the classify wheel and the prepare funnel turn (faster when oiled) */
    var sp = oil ? 9 : on ? 3 : 1.4; [[792, 88], [792, 156]].forEach(function (gp, i) { g.save(); g.translate(gp[0] + 10, gp[1] - 2); g.rotate(t * sp * (i ? -1 : 1)); g.fillStyle = '#8F4C08'; for (var q = 0; q < 6; q++) { g.rotate(Math.PI / 3); g.fillRect(-2, -9, 4, 18); } fillE(g, 0, 0, 6, 6, '#E9A14B'); fillE(g, 0, 0, 2, 2, '#8F4C08'); g.restore(); });
    var bellRing = balls.some(function (b) { var u = b % 1; return b >= 0 && u > 0.84 && u < 0.88; }); if (bellRing) { g.strokeStyle = 'rgba(226,177,60,.8)'; g.lineWidth = 1.4; [8, 13].forEach(function (r) { g.beginPath(); g.arc(690, 272, r, -2.6, -0.5); g.stroke(); }); }
    if (oil) { var ou = (t - FX.oil) / 2.4; for (var d = 0; d < 4; d++) { var dv = (ou * 3 + d / 4) % 1; fillE(g, 806 - dv * 12, 150 + dv * 30, 2, 3, '#C9A227'); } }
    /* the lever: its arm swings down when tapped */
    var la = lv >= 0 && lv < 0.8 ? Math.sin(lv / 0.8 * Math.PI) : 0; g.save(); g.translate(LEVER.x, LEVER.y + 6); g.rotate(-0.5 + la * 1.2); fillRR(g, -2.5, -34, 5, 34, 2, '#5C6B7A'); fillE(g, 0, -36, 6, 6, RED); g.restore();
  }
  function crank(g, t) { /* the lift's crank wheel the engineer turns, belted to the lift tube */
    var x = 826, y = 324, a = t * 4, spin = (t - FX.oil) >= 0 && (t - FX.oil) < 2.4 ? t * 9 : a; g.strokeStyle = '#8F4C08'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(x, y - 12); g.lineTo(807, 290); g.moveTo(x, y + 12); g.lineTo(812, 300); g.stroke();
    fillE(g, x, y, 13, 13, BRASS_D); fillE(g, x, y, 10, 10, BRASS); g.strokeStyle = BRASS_D; g.lineWidth = 2; g.beginPath(); for (var i = 0; i < 3; i++) { var b = spin + i * 2.09; g.moveTo(x, y); g.lineTo(x + Math.cos(b) * 10, y + Math.sin(b) * 10); } g.stroke(); fillE(g, x + Math.cos(spin) * 12, y + Math.sin(spin) * 12, 3.4, 3.4, RED); }
  function ballAt(u) { /* 0-0.08 hopper drop, 0.08-0.84 the tracks (a pause at the flap), 0.84-1 back up the lift */
    if (u > 0.84) { var v = (u - 0.84) / 0.16; return v < 0.7 ? [807, lerp(296, 46, v / 0.7)] : [lerp(800, 680, (v - 0.7) / 0.3), 40]; }
    var w = clamp(u / 0.84, 0, 1); if (w > 0.55 && w < 0.66) w = 0.55; else if (w >= 0.66) w = 0.55 + (w - 0.66) / 0.34 * 0.45;
    var segs = MPATH.length - 1, f = w * segs, i = Math.min(segs - 1, Math.floor(f)), r = f - i, a = MPATH[i], b = MPATH[i + 1]; return [lerp(a[0], b[0], r), lerp(a[1], b[1], r) + 1]; }
  function chatbot(g, t, S) { /* 04: the bot's face, the chat window answering on three channels, the hand-off */
    var c = S.hot === 'chat' ? ((t - (S.kT || 0)) * 0.9) % 9 : ((t + 4) * 0.45) % 9, rung = (t - FX.bell) >= 0 && (t - FX.bell) < 2.4, ch = Math.floor((t * 0.45 + 4) / 9) % 3;
    var bl = ((t + 1.1) % 4.4) < 0.14, happy = rung || c > 2.4 && c < 4; [-1, 1].forEach(function (d) { var ex = 892 + d * 14; if (bl) fillRR(g, ex - 6, 88, 12, 3, 1.5, '#7FD6FF'); else if (happy) { g.strokeStyle = '#7FD6FF'; g.lineWidth = 3; g.beginPath(); g.arc(ex, 92, 6, Math.PI * 1.15, Math.PI * 1.85); g.stroke(); } else { fillE(g, ex, 88, 5.5, 7, '#7FD6FF'); fillE(g, ex - 1.6, 85, 1.8, 1.8, '#FFFFFF'); } });
    g.strokeStyle = '#7FD6FF'; g.lineWidth = 2.4; g.lineCap = 'round'; g.beginPath(); g.arc(892, 100, 7, 0.25, Math.PI - 0.25); g.stroke(); fillE(g, 892, 38, 4, 4, (t % 1.2) < 0.6 ? '#FF8FA3' : '#FFD84A');
    var C0 = CHW; fillRR(g, C0.x, C0.y, C0.w, C0.h, 6, '#F4F7FC'); fillRR(g, C0.x, C0.y, C0.w, 16, 6, BLUE); g.fillRect(C0.x, C0.y + 10, C0.w, 6);
    if (ch === 0) icWeb(g, C0.x + 9, C0.y + 8, 5); else if (ch === 1) icWA(g, C0.x + 9, C0.y + 8, 5); else icApp(g, C0.x + 9, C0.y + 8, 5); text(g, ['Website chat', 'WhatsApp', 'In-app'][ch], C0.x + 18, C0.y + 11, 5.8, 800, '#FFFFFF');
    function bub(y, s, me, col, fg) { var w = Math.min(60, s.length * 2.9 + 10); fillRR(g, me ? C0.x + C0.w - w - 5 : C0.x + 5, y, w, 15, 5, col); wrap(g, s, me ? C0.x + C0.w - w : C0.x + 10, y + 6.4, 22, 6, 4.6, 700, fg); }
    if (c > 0.3) bub(C0.y + 22, 'Where is my order?', true, '#DCE6F7', '#2A3550');
    if (c > 1.2 && c < 2.2) { for (var i = 0; i < 3; i++) fillE(g, C0.x + 12 + i * 6, C0.y + 46, 2, 2, i === Math.floor(t * 6) % 3 ? BLUE : '#AEBBD3'); }
    if (c > 2.2) bub(C0.y + 42, 'Shipped today, arriving Thursday.', false, BLUE, '#FFFFFF');
    if (c > 3.8) bub(C0.y + 62, 'Can I change the address?', true, '#DCE6F7', '#2A3550');
    if (c > 5 || rung) { bub(C0.y + 82, 'Handing you to a person, with the chat so far.', false, BLUE, '#FFFFFF'); }
    if (c > 6.2 || rung) { fillRR(g, C0.x + 6, C0.y + 114, 68, 16, 8, OK); icPerson(g, C0.x + 15, C0.y + 122, 6, '#FFFFFF'); text(g, 'A person joined', C0.x + 24, C0.y + 124.5, 5.4, 800, '#FFFFFF'); }
    /* the active channel's horn sends out rings */
    var hy = [92, 136, 180][ch]; for (var r = 0; r < 2; r++) { var ru = ((t * 0.9 + r * 0.5) % 1); g.globalAlpha = 1 - ru; g.strokeStyle = BLUE; g.lineWidth = 1.5; g.beginPath(); g.arc(944, hy, 8 + ru * 16, -0.7, 0.7); g.stroke(); } g.globalAlpha = 1;
    /* the bell */
    var rb = rung ? (t - FX.bell) : 9, ring = rb < 0.8 ? Math.sin(rb * 40) * (1 - rb / 0.8) * 0.3 : 0; g.save(); g.translate(BELL.x, 326); g.rotate(ring); g.fillStyle = '#E2B13C'; g.beginPath(); g.arc(0, -2, 9, Math.PI, 0); g.closePath(); g.fill(); fillE(g, 0, -12, 2.4, 2.4, '#C9952A'); g.restore();
    if (rb < 1) { g.globalAlpha = 1 - rb; fillRR(g, BELL.x - 16, 290 - rb * 14, 32, 14, 7, '#FFFFFF'); text(g, 'Ding!', BELL.x, 299.6 - rb * 14, 7, 800, '#C9952A', 'center'); g.globalAlpha = 1; }
  }
  function network(g, t) { /* a signal runs through the installation, layer by layer, in the four gallery colours */
    var cyc = (t * 0.8) % 5, col = BAY[ORDER[Math.floor(t * 0.16) % 4]].c;
    NET.forEach(function (L, li) { var on = clamp(1 - Math.abs(cyc - li - 0.5) * 1.6, 0, 1); if (on <= 0) return;
      L.forEach(function (n, j) { if (hash(j + li * 7 + Math.floor(t * 0.16)) < 0.25) return; g.globalAlpha = on; fillE(g, n[0], n[1], 7, 7, col); g.globalAlpha = on * 0.3; fillE(g, n[0], n[1], 15, 15, col); });
      if (li < NET.length - 1) { var u = clamp(cyc - li - 0.5, 0, 1); if (u > 0 && u < 1) L.forEach(function (a) { NET[li + 1].forEach(function (b, k) { if ((k + li) % 2) return; g.globalAlpha = 0.9; fillE(g, lerp(a[0], b[0], u), lerp(a[1], b[1], u), 2.4, 2.4, col); }); }); } });
    g.globalAlpha = 1; }
  function hallBanners(g, t) { /* two long hall banners behind the title card */
    [[-690, 'HALL A', TEAL, 120], [96, 'HANDS-ON', AMB, 56]].forEach(function (h, i) { var x = h[0], sw = Math.sin(t * 0.8 + i * 2) * 3, w = 54, y0 = -138, y1 = h[3];
      g.fillStyle = BRASS_D; g.fillRect(x - w / 2 - 4, y0 - 2, w + 8, 4); g.fillStyle = h[2]; g.beginPath(); g.moveTo(x - w / 2, y0); g.lineTo(x + w / 2, y0); g.lineTo(x + w / 2 + sw, y1); g.lineTo(x + sw, y1 - 14); g.lineTo(x - w / 2 + sw, y1); g.closePath(); g.fill();
      g.save(); g.translate(x + sw * 0.5, (y0 + y1) / 2 - 6); g.rotate(-Math.PI / 2); text(g, h[1], 0, 5, 14, 800, '#FFFFFF', 'center'); g.restore(); fillE(g, x + sw * 0.2, y0 + 22, 6, 6, BRASS_L); }); }
  function terminal(g, t) { var lines = ['> ask', '> sources: 3', '> a person', '  approves'], n = Math.floor(t * 1.2) % 6; for (var i = 0; i < Math.min(n, 4); i++) text(g, lines[i], 61, 315 + i * 8.6, 6, 800, '#7FE3A0'); if ((t % 1) < 0.5) fillRR(g, 61 + (n < 4 ? 0 : 0), 309 + Math.min(n, 4) * 8.6, 5, 7, 1, '#7FE3A0'); }
  function mobile(g, t) { /* a mobile of paper planes over the shop */
    var x = 1180, y = -230; g.strokeStyle = '#7A6337'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(x, -300); g.lineTo(x, y); g.stroke();
    for (var i = 0; i < 3; i++) { var a = t * 0.4 + i * 2.09, px = x + Math.cos(a) * 46, py = y + 30 + i * 8, s = 0.7 + 0.3 * Math.sin(a); g.beginPath(); g.moveTo(x, y); g.lineTo(px, py - 8); g.stroke(); CO.plane(g, px, py, 1.4, Math.cos(a) * 0.3, [BLUE, TEAL, AMB][i], '#FFFFFF'); }
  }
  function paintLive(g, t, now, S) {
    CO.crew(CREW, g, t, S, false);
    banners(g, t); globe(g, t, S); kiosk(g, t, S); odooScreen(g, t, S); machine(g, t, S); crank(g, t); chatbot(g, t, S); gate(g, t, S); mobile(g, t); automaton(g, t);
    /* the floor plan's you-are-here dot, the tube's flowing light */
    network(g, t); hallBanners(g, t); terminal(g, t); wallLive(g, t);
    wel(g, t); cash(g, t);
    CO.clock(g, 1110, -84, 18, 8, BRASS_D);
  }
  function paintFrontLive(g, t, S) {
    CO.crew(CREW, g, t, S, true);
    /* the console's side monitor (in front of the desk layer) */
    CO.screen(g, 383, 325, 52, 46, t, 'odoo');
    /* held props: the docent's binder, the approver's stamp, the engineer's oil can, the visitor's phone */
    var P = DOC, h0 = hw(P, 0), h1 = hw(P, 1);
    if (P.binder) { var mx = (h0[0] + h1[0]) / 2, my = (h0[1] + h1[1]) / 2; g.save(); g.translate(mx, my - 10); fillRR(g, -22, -14, 22, 28, 2, '#0A6B60'); fillRR(g, 0, -14, 22, 28, 2, '#0E9384'); fillRR(g, -19, -11, 17, 22, 1.5, '#FFFFFF'); fillRR(g, 2, -11, 17, 22, 1.5, '#FFFFFF');
      g.fillStyle = '#C9D3E3'; for (var l = 0; l < 4; l++) { g.fillRect(-16, -7 + l * 5, 12, 1.6); g.fillRect(5, -7 + l * 5, 12, 1.6); } fillRR(g, 5, -2, 12, 4, 1, 'rgba(242,201,76,.8)'); g.restore(); }
    var pu = (t - FX.page) / 1.4; if (pu >= 0 && pu < 1) { var px = lerp(DOC.x, KIO.x + 40, pu), py = lerp(DOC.y - 410 * DOC.s, KIO.y + 40, pu) - Math.sin(pu * Math.PI) * 60; g.save(); g.translate(px, py); g.rotate(pu * 6); fillRR(g, -9, -12, 18, 24, 2, '#FFFFFF'); fillRR(g, -6, -8, 12, 3, 1, TEAL); text(g, '[1]', 0, 6, 7, 800, TEAL, 'center'); g.restore(); }
    var a1 = hw(APP, 1); g.save(); g.translate(a1[0], a1[1]); fillRR(g, -3, -22, 6, 18, 3, WOOD); fillE(g, 0, -24, 5, 5, '#8A5A3B'); fillRR(g, -8, -6, 16, 7, 2, OK); g.restore();
    if (APP.stampDown) { fillE(g, PAD.x, PAD.y - 3, 12, 3, 'rgba(30,158,106,.5)'); }
    if (MEC.oil) { var m1 = hw(MEC, 1); g.save(); g.translate(m1[0], m1[1]); g.rotate(-0.6); fillRR(g, -8, -6, 16, 16, 4, '#C9A227'); fillRR(g, 6, -3, 18, 3.4, 1.5, '#94741A'); g.restore(); }
    var v1 = hw(VIS, 1); g.save(); g.translate(v1[0], v1[1] - 6); g.rotate(VIS.phone === 2 ? -0.4 : -0.1); fillRR(g, -6, -11, 12, 21, 3, '#1B1F3B'); fillRR(g, -4.6, -9, 9.2, 15, 1.5, '#DCE6F7'); fillRR(g, -3.6, -7, 6, 2.4, 1, BLUE); fillRR(g, -3.6, -3, 5, 2.4, 1, '#AEBBD3'); g.restore();
    var su = (t - FX.selfie); if (su >= 0.7 && su < 1.3) { g.globalAlpha = 1 - (su - 0.7) / 0.6; fillE(g, v1[0], v1[1] - 10, 30, 30, '#FFFFFF'); g.globalAlpha = 1; }
    CR.draw(g, t);
  }
  /* ------------------------------ the card zone: life behind the title card ------------------------------ */
  /* a school group at the automaton (grey passes), their TechNext docent with a pennant, a visitor sketching on the bench,
     a visitor at the touch table. Each has an idle loop and a tap move of their own (FZ holds the tap times). */
  var FZ = { k0: -9, k1: -9, k2: -9, d2: -9, sit: -9, tbl: -9 };
  var KIDS = [
    W({ x: -420, y: 600, s: 0.34, ph: 0.3, skin: 1, hair: 0, style: 'bun', outfit: 'polo', top: '#F2C94C', low: '#3D4A7A', id: '#9AA6BC', hands: [[-70, -150], [70, -150]] }),
    W({ x: -378, y: 606, s: 0.33, ph: 1.4, skin: 3, hair: 1, style: 'short', outfit: 'polo', top: '#5B8DEF', low: '#2A3550', id: '#9AA6BC', hands: [[-70, -150], [70, -150]] }),
    W({ x: -338, y: 598, s: 0.35, ph: 2.2, skin: 2, hair: 2, style: 'pony', outfit: 'cardigan', top: '#E0456B', top2: '#FFFFFF', low: '#3D4A7A', id: '#9AA6BC', hold: 'clipboard', hands: [[-40, -210], [40, -200]] })
  ];
  var DOC2 = W({ x: -268, y: 608, s: 0.48, ph: 0.8, skin: 1, hair: 1, style: 'bob', outfit: 'polo', top: TEAL, glasses: true, hands: [[-80, -360], [70, -150]], look: -0.6 });
  var SIT = W({ x: -136, y: BEN.y, s: 0.5, ph: 2.6, skin: 3, hair: 2, style: 'long', outfit: 'cardigan', top: '#7A8B3A', top2: '#FFFFFF', id: '#9AA6BC', sit: true, chair: false, sitDrop: 40, hands: [[-30, -200], [30, -196]], look: 0.3 });
  function zU(k, t, dur) { var u = (t - FZ[k]) / dur; return u >= 0 && u < 1 ? u : -1; }
  function kid0(P, t) { var u = zU('k0', t, 1.8), c = (t + 0.4) % 6; reset(P); P.talk = u >= 0 || (c > 2.5 && c < 4);
    if (u >= 0) { P.mood = 'happy'; var j = Math.abs(Math.sin(u * Math.PI * 3)); P.hop = j * 26; P.hands = [[-90, -360 - j * 50], [90, -360 - j * 50]]; return; } /* tap: three star jumps */
    if (c < 2.5) { P.hands = [[-60, -150], [130, -380 + Math.sin(t * 5) * 8]]; P.look = lerp(P.look, 0.8, 0.1); P.hop = Math.abs(Math.sin(t * 5)) * 4; }
    else if (c < 4) { P.hands = [[-40, -330], [40, -330]]; P.mood = 'wow'; P.look = lerp(P.look, 0.6, 0.1); }
    else { P.hands = [[-70, -150 + Math.sin(t * 4) * 10], [70, -150 - Math.sin(t * 4) * 10]]; P.look = lerp(P.look, Math.sin(t * 0.9), 0.06); } }
  function kid1(P, t) { var u = zU('k1', t, 2.2), c = (t + 1.3) % 7; reset(P); P.talk = u >= 0;
    if (u >= 0) { P.mood = 'happy'; var s2 = Math.floor(u * 8) % 2; P.hands = s2 ? [[-120, -330], [60, -160]] : [[-60, -160], [120, -330]]; P.sx = u > 0.6 ? Math.cos((u - 0.6) / 0.4 * Math.PI * 2) : 1; P.tilt = s2 ? 0.08 : -0.08; return; } /* tap: a robot dance and a spin */
    if (c < 3.5) { var st = Math.floor(t * 2) % 2; P.hands = st ? [[-110, -270], [100, -200]] : [[-100, -200], [110, -270]]; P.tilt = st ? 0.05 : -0.05; P.look = st ? 0.5 : -0.2; P.mood = 'happy'; } /* idle: copies the automaton, stiff arms */
    else { P.hands = [[-50, -170], [50, -170]]; P.look = lerp(P.look, 0.4, 0.1); P.tilt = Math.sin(t * 1.4) * 0.04; } }
  function kid2(P, t) { var u = zU('k2', t, 1.9), c = (t + 2) % 8; reset(P); P.talk = u >= 0;
    if (u >= 0) { P.mood = 'happy'; P.hands = [[lerp(-40, -20, u), -420 + Math.sin(u * Math.PI * 6) * 20], [60, -390 + Math.sin(u * Math.PI * 6) * 20]]; P.hop = Math.sin(u * Math.PI) * 18; return; } /* tap: the worksheet goes up, a gold star on it */
    if (c < 4.5) { P.hands = [[-40, -210], [lerp(10, 40, (Math.sin(t * 9) + 1) / 2), -214 + Math.sin(t * 13) * 3]]; P.look = lerp(P.look, -0.2, 0.1); P.tilt = 0.08; } /* writes */
    else if (c < 6.5) { P.hands = [[-40, -210], [40, -200]]; P.look = lerp(P.look, -0.7, 0.1); P.tilt = -0.06; }
    else { P.hands = [[-40, -210], [60, -250]]; P.mood = 'happy'; P.look = lerp(P.look, 0.3, 0.1); } }
  function doc2(P, t) { var u = zU('d2', t, 2.2), c = (t + 0.2) % 9; reset(P); P.talk = u >= 0 || c < 3.5;
    if (u >= 0) { P.mood = 'happy'; var a = u * Math.PI * 4; P.hands = [[-80 + Math.cos(a) * 40, -400 + Math.sin(a) * 30], [90, -330]]; P.hop = u > 0.7 ? Math.sin((u - 0.7) / 0.3 * Math.PI) * 12 : 0; return; } /* tap: twirls the pennant */
    if (c < 3.5) { P.hands = [[-80, -380 + Math.sin(t * 2) * 6], [-20 - Math.abs(Math.sin(t * 3)) * 30, -230]]; P.look = lerp(P.look, -0.8, 0.1); P.mood = 'happy'; } /* tells the group about the automaton */
    else if (c < 6) { P.hands = [[-80, -360], [-150, -380]]; P.look = lerp(P.look, -0.9, 0.1); P.tilt = -0.05; } /* points up at the automaton */
    else { P.hands = [[-80, -350], [70, -150]]; P.look = lerp(P.look, Math.sin(t * 0.8) * 0.5, 0.06); if (c > 8) { P.hands[1] = [30, -250]; P.look = 0.2; } } } /* checks her watch */
  function sit(P, t) { var u = zU('sit', t, 2.2), c = (t + 1) % 10; reset(P); P.talk = u >= 0; P.book = 1;
    if (u >= 0) { P.mood = 'happy'; var k2 = ease(u / 0.3); P.hands = [[lerp(-30, -50, k2), lerp(-200, -360, k2)], [lerp(30, 50, k2), lerp(-196, -360, k2)]]; P.book = 2; P.tilt = Math.sin(u * Math.PI * 2) * 0.06; return; } /* tap: shows the sketch */
    if (c < 6) { P.hands = [[-30, -200], [24 + Math.cos(t * 7) * 8, -206 + Math.sin(t * 7) * 5]]; P.look = lerp(P.look, 0.2, 0.08); P.tilt = 0.1; } /* sketches */
    else if (c < 8) { P.hands = [[-30, -200], [30, -196]]; P.look = lerp(P.look, 0.7, 0.08); P.tilt = -0.08; } /* looks up at the poster */
    else { P.hands = [[-30, -200], [-6, -300]]; P.mood = 'happy'; P.look = lerp(P.look, 0.4, 0.08); P.tilt = 0.02; } } /* taps the pencil on her chin */
  function flag(g, P) { var h = hw(P, 0); g.strokeStyle = '#5C6B7A'; g.lineWidth = 2.4; g.lineCap = 'round'; g.beginPath(); g.moveTo(h[0], h[1] + 8); g.lineTo(h[0], h[1] - 92); g.stroke();
    g.fillStyle = TEAL; g.beginPath(); g.moveTo(h[0] + 1, h[1] - 92); g.lineTo(h[0] + 36, h[1] - 81); g.lineTo(h[0] + 1, h[1] - 70); g.closePath(); g.fill(); fillE(g, h[0] + 12, h[1] - 81, 3.4, 3.4, BRASS_L); fillE(g, h[0], h[1] - 94, 3, 3, BRASS); }
  function sketch(g, P) { var a = hw(P, 0), b = hw(P, 1), mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2; g.save(); g.translate(mx, my - 4);
    if (P.book === 2) { fillRR(g, -20, -16, 40, 28, 2, '#FFFFFF'); g.strokeStyle = '#C9D3E3'; g.lineWidth = 1; rr(g, -20, -16, 40, 28, 2); g.stroke(); fillE(g, 0, -5, 8, 7, '#E3ECFB'); fillRR(g, -5, -8, 10, 5, 2, '#1B2350'); fillE(g, -2, -5.6, 1, 1, '#7FD6FF'); fillE(g, 2, -5.6, 1, 1, '#7FD6FF'); fillE(g, 0, 5, 5, 4, '#E3ECFB'); }
    else { g.rotate(-0.3); fillRR(g, -16, -6, 32, 12, 2, '#2E5560'); fillRR(g, -14, -8, 28, 4, 1, '#FFFFFF'); }
    g.restore(); if (P.book !== 2) { g.strokeStyle = '#E2B13C'; g.lineWidth = 2; g.beginPath(); g.moveTo(b[0], b[1]); g.lineTo(b[0] + 6, b[1] - 10); g.stroke(); } }
  function star(g, P, t) { if (zU('k2', t, 1.9) < 0) return; var h = hw(P, 0); spark(g, h[0] + 4, h[1] - 14, 6, '#F2C94C'); }
  function totemScreen(g, t) { /* the info totem cycles: the floor plan, then "ask me" */
    var x = TOT.x - 29, y = TOT.y - 148, c = (t * 0.3) % 3; fillRR(g, x, y, 58, 62, 4, '#FFFFFF');
    if (c < 2) { text(g, 'FLOOR PLAN', x + 29, y + 9, 5.4, 800, INK, 'center'); ORDER.forEach(function (k, i) { var on = Math.floor(t * 1.5) % 4 === i; fillRR(g, x + 5 + i * 12.5, y + 14, 11, 20, 2, on ? BAY[k].c : BAY[k].l); text(g, BAY[k].n, x + 10.5 + i * 12.5, y + 26, 4.6, 800, on ? '#FFFFFF' : BAY[k].d, 'center'); });
      fillRR(g, x + 17, y + 38, 24, 8, 2, OK); text(g, 'GATE', x + 29, y + 43.6, 4.4, 800, '#FFFFFF', 'center'); fillE(g, x + 10, y + 54, 2.6, 2.6, (t % 1) < 0.5 ? RED : '#F2A39B'); text(g, 'you are here', x + 15, y + 55.6, 4.2, 700, '#5C6B7A'); }
    else { fillE(g, x + 29, y + 22, 12, 12, '#DDF2EE'); icBot(g, x + 29, y + 23, 7, TEAL); fillRR(g, x + 6, y + 40, 46, 12, 6, '#EEF2F7'); text(g, 'Ask me anything', x + 29, y + 47.6, 4.8, 800, '#3D4560', 'center'); } }
  function tableGlow(g, t) { /* the touch table's top: use-case cards drift; ripples where the visitor touches */
    var x0 = TT.x - 62, y0 = TT.y - 88, fl = zU('tbl', t, 1.8); g.save(); g.beginPath(); g.moveTo(x0 - 8, y0 + 14); g.lineTo(x0 + 132, y0 + 14); g.lineTo(x0 + 124, y0); g.lineTo(x0, y0); g.closePath(); g.clip();
    ORDER.forEach(function (k, i) { var cx = x0 + ((t * 10 + i * 36) % 140) - 4; fillRR(g, cx, y0 + 3 + (i % 2) * 5, 20, 5, 2, BAY[k].c); });
    var tc = (t * 0.5) % 1; if (tc < 0.6) { var r = (t * 2) % 1, tx2 = TT.x + Math.sin(Math.floor(t * 0.5) * 2.3) * 44; g.globalAlpha = 1 - r; g.strokeStyle = '#7FE3FF'; g.lineWidth = 1.4; g.beginPath(); g.ellipse(tx2, y0 + 8, 4 + r * 14, 2 + r * 4, 0, 0, 7); g.stroke(); g.globalAlpha = 1; }
    if (fl >= 0) { g.globalAlpha = 1 - fl; g.fillStyle = '#BFF3FF'; g.fillRect(x0 - 8, y0, 156, 16); g.globalAlpha = 1; }
    g.restore();
    if (fl >= 0) { var px = lerp(TT.x, 262, fl), py = lerp(TT.y - 92, 300, fl) - Math.sin(fl * Math.PI) * 120; g.save(); g.globalAlpha = fl > 0.85 ? (1 - fl) / 0.15 : 1; g.translate(px, py); g.rotate(fl * 4); fillRR(g, -13, -9, 26, 18, 3, '#FFFFFF'); fillRR(g, -13, -9, 26, 5, 2, TEAL); fillRR(g, -9, 0, 18, 2.4, 1, '#C9D3E3'); g.restore(); g.globalAlpha = 1; } }
  function domeEye(g, t) { var x = DOME.x, y = DOME.y - 86, bl = ((t + 0.6) % 3.6) < 0.15; [-5, 5].forEach(function (d) { if (bl) fillRR(g, x + d - 3, y - 0.5, 6, 1.6, 1, '#7FD6FF'); else fillE(g, x + d + Math.sin(t * 0.7) * 1.5, y, 2.6, 2.6, '#7FD6FF'); }); fillE(g, x, DOME.y - 108, 2.2, 2.2, (t % 1.6) < 0.8 ? '#3FE08F' : '#B8D9C8'); }
  function zone(t) { /* the card zone's people and live props, in depth order (drawn by K.zfore) */
    return [[TOT.y, function (g) { totemScreen(g, t); }], [DOME.y, function (g) { domeEye(g, t); }], [TT.y, function (g) { tableGlow(g, t); }],
      [KIDS[2].y, function (g) { kid2(KIDS[2], t); K.person(g, KIDS[2], t); star(g, KIDS[2], t); }], [KIDS[0].y, function (g) { kid0(KIDS[0], t); K.person(g, KIDS[0], t); }],
      [KIDS[1].y, function (g) { kid1(KIDS[1], t); K.person(g, KIDS[1], t); }], [DOC2.y, function (g) { doc2(DOC2, t); K.person(g, DOC2, t); flag(g, DOC2); }],
      [BEN.y + 1, function (g) { sit(SIT, t); K.person(g, SIT, t); sketch(g, SIT); }]]; }
  function zoneHit(x, y, t) { var who = [[KIDS[0], 'k0', 'star', 'Visitor · school group', 'Look! The robot **waves back**!'], [KIDS[1], 'k1', 'code', 'Visitor · school group', 'Beep boop! I can do **the robot** too.'], [KIDS[2], 'k2', 'star', 'Visitor · school group', 'Worksheet done: **four exhibits**, one gold star!'],
      [DOC2, 'd2', 'conf', 'TechNext docent', ['This way, everyone: **four exhibits**, and a person at the gate.', 'The old automaton followed a script. Today\'s AI **asks a person** when it matters.']],
      [SIT, 'sit', 'heart', 'Visitor', 'I\'m sketching the exhibits. Here\'s **Nexi**, my favourite!']];
    if (Math.abs(x - TT.x) < 74 && y > TT.y - 92 && y < TT.y + 4) { FZ.tbl = t; CR.burst('spark', TT.x, TT.y - 100, t); return { say: 'Swipe! A sample use case flies to **Exhibit 01**, and the answer comes back with its source.', who: 'Touch table', role: 'hands-on exhibit · sample', near: [400, 110], pose: 'wow' }; }
    for (var i = 0; i < who.length; i++) { var o = who[i], P = o[0]; if (Math.abs(x - P.x) < 120 * P.s && y < P.y + 6 && y > P.y - 500 * P.s + (P.sit ? 40 : 0)) {
      FZ[o[1]] = t; if (o[1] === 'k0' || o[1] === 'k1') FX.robot = t; if (o[1] === 'd2') FZ.k0 = t + 0.5; CR.burst(o[2], P.x, P.y - 460 * P.s, t);
      var ln = typeof o[4] === 'string' ? o[4] : o[4][(FZ.di = (FZ.di || 0) + 1) % o[4].length];
      return { say: ln, who: o[3], role: (o[1] === 'd2' ? 'TechNext · school tours' : 'museum visitor') + ' · illustration', near: [clamp(P.x + 120, -560, 900), 110], pose: o[1] === 'd2' ? 'clap' : 'love' }; } }
    return null; }
  function wallLive(g, t) { /* the pendant lamps sway; the how-it-works screen steps; a spark runs the timeline; the audio guide's levels */
    LAMPS.forEach(function (lx, i) { var a = Math.sin(t * 0.7 + i * 1.7) * 0.025; g.save(); g.translate(lx, -140); g.rotate(a); g.strokeStyle = '#7A6337'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 92); g.stroke();
      fillRR(g, -5, 88, 10, 8, 2, BRASS_D); g.fillStyle = BRASS; g.beginPath(); g.moveTo(-8, 96); g.lineTo(8, 96); g.lineTo(22, 116); g.lineTo(-22, 116); g.closePath(); g.fill(); fillE(g, 0, 117, 22, 4, BRASS_D); fillE(g, 0, 119, 9, 5, '#FFF3C4'); g.restore(); });
    var S0 = SCR, step = Math.floor(t * 0.8) % 4, ph = (t * 0.8) % 1, labs = ['ask', 'find', 'answer', 'approve'], cols = [BLUE, TEAL, PUR, OK];
    g.strokeStyle = '#E2D5BA'; g.lineWidth = 2; g.beginPath(); g.moveTo(S0.x + 24, S0.y + 52); g.lineTo(S0.x + S0.w - 24, S0.y + 52); g.stroke();
    labs.forEach(function (l, i) { var x = S0.x + 24 + i * (S0.w - 48) / 3, on = i <= step; fillE(g, x, S0.y + 52, 13, 13, on ? cols[i] : '#F1ECE1');
      if (i === 0) fillRR(g, x - 6, S0.y + 48, 12, 8, 3, on ? '#FFFFFF' : '#C9BFA8'); else if (i === 1) icDoc(g, x, S0.y + 52, 5.4, on ? cols[i] : '#C9BFA8'); else if (i === 2) spark(g, x, S0.y + 52, 6, on ? '#FFFFFF' : '#C9BFA8'); else if (on) tick(g, x, S0.y + 52, 6, OK); else fillE(g, x, S0.y + 52, 5, 5, '#C9BFA8');
      text(g, l, x, S0.y + 78, 6.6, 800, i === step ? cols[i] : '#8A96A8', 'center'); });
    var dx = S0.x + 24 + (step + ph) * (S0.w - 48) / 3; if (step < 3) fillE(g, dx, S0.y + 52, 3, 3, '#FFFFFF');
    fillRR(g, S0.x + 14, S0.y + 88, S0.w - 28, 7, 3.5, '#F1ECE1'); fillRR(g, S0.x + 14, S0.y + 88, (S0.w - 28) * ((step + ph) / 4), 7, 3.5, cols[step]);
    text(g, step === 3 ? 'a person decides' : 'the AI prepares', S0.x + S0.w / 2, S0.y + 107, 6, 800, step === 3 ? OK : '#5C6B7A', 'center');
    var tu = (t * 0.12) % 1, tx = TL.x + 30 + tu * (TL.w - 60); g.globalAlpha = 0.35; fillE(g, tx, TL.y + 44, 8, 8, '#F2C94C'); g.globalAlpha = 1; fillE(g, tx, TL.y + 44, 3.4, 3.4, '#FFFFFF');
    for (var b = 0; b < 12; b++) { var h = 4 + Math.abs(Math.sin(t * (3 + b * 0.4) + b)) * 18; fillRR(g, AUD.x + 20 + b * 7.4, AUD.y + 56 - h, 4.6, h, 1.5, b < 6 ? '#3FB5A3' : '#E9A14B'); }
    text(g, '▶ TRACK 0' + (1 + Math.floor(t / 6) % 4), AUD.x + AUD.w / 2, AUD.y + AUD.h - 32, 6, 800, '#F2DD8E', 'center'); }

  /* the cleaning robot: a little disc that roams the front floor, a blue light on top */
  var ROB = [{ x0: 170, x1: 540, y: 702, ph: 0.2 }, { x0: -905, x1: -720, y: 704, ph: 0.6 }];
  function robot(g, t, R) { var span = R.x1 - R.x0, u = (t * 22 / span + R.ph) % 2, x = R.x0 + (u < 1 ? u : 2 - u) * span, y = R.y; R.cx = x;
    soft(g, x, y + 3, 30, 6, 0.24); fillE(g, x, y - 6, 26, 9, '#3D4A5C'); fillE(g, x, y - 10, 24, 8, '#E9EEF5'); fillE(g, x, y - 12, 8, 3, (t % 1) < 0.5 ? '#3FA9E0' : '#9FD8F5'); fillRR(g, x + (u < 1 ? 18 : -24), y - 8, 6, 3, 1.5, '#5C6B7A'); }
  function FORE(t) { return [[ROB[0].y, function (g2, e, t2) { robot(g2, t2, ROB[0]); }], [ROB[1].y, function (g2, e, t2) { robot(g2, t2, ROB[1]); }]].concat(zone(t)); }

  window.IXW.worlds['sol-ai'] = {
    calmView: [140,-120,860,688], calmHide: ['vis'], /* CALM: the framed part of the set */
    pan: [-700, 1260],
    paintBg: paintBg, windowBehind: true, paintFrame: function () {}, paintBack: paintBack, paintFront: paintFront, paintFore: paintFore,
    paintWindow: paintWindow, paintLive: paintLive, paintFrontLive: paintFrontLive,
    paintForeLive: function (g, t, S) { K.zfore(g, t, S, FORE(t), function () { CO.crew(CREW, g, t, S, 'fore'); }); CR.draw(g, t); },
    moteCol: 'rgba(255,248,225,.8)',
    glow: {
      know: function (g) { rr(g, BAY.know.x + 6, 50, BAY.know.w - 12, 256, 16); },
      odoo: function (g) { rr(g, OSC.x - 10, OSC.y - 10, OSC.w + 20, OSC.h + 20, 12); },
      auto: function (g) { rr(g, BAY.auto.x + 12, ARCH + 8, BAY.auto.w - 24, 324, 18); },
      chat: function (g) { rr(g, 842, 30, 156, 312, 16); },
      data: function (g) { g.beginPath(); g.arc(GL.x, GL.y, GL.r + 14, 0, Math.PI * 2); },
      gate: function (g) { rr(g, GATE.x - 10, 86, GATE.w + 20, F - 80, 14); },
      lever: function (g) { rr(g, LEVER.x - 18, LEVER.y - 44, 36, 76, 10); },
      bell: function (g) { rr(g, BELL.x - 18, 306, 36, 28, 10); },
      globe: function (g) { g.beginPath(); g.arc(GL.x, GL.y, GL.r + 14, 0, Math.PI * 2); }
    },
    backGlow: ['know', 'odoo', 'auto', 'chat', 'data', 'gate', 'globe'],
    cast: [
      { id: 'doc', behind: true, keys: ['know'], P: DOC, act: actDoc },
      { id: 'eng', behind: true, keys: ['odoo'], P: ENG, act: actEng },
      { id: 'app', behind: true, keys: ['gate'], P: APP, act: actApp },
      { id: 'mec', behind: true, keys: ['auto'], P: MEC, act: actMec },
      { id: 'vis', behind: true, keys: ['chat'], P: VIS, act: actVis }
    ],
    toy: function (name, S, t) { if (name === 'lever') { FX.lever = t; CR.burst('spark', LEVER.x, LEVER.y - 30, t); } else if (name === 'bell') { FX.bell = t; CR.burst('star', BELL.x, 300, t); } else if (name === 'globe') { FX.globe = t; CR.burst('spark', GL.x, GL.y - 40, t); } },
    hit: function (x, y, S, t) {
      if (Math.abs(x - WEL.x) < 60 && y < F && y > F - 270) { FX.map = t; CR.burst('star', WEL.x, F - 280, t); return { say: ['Welcome! Here is the **floor plan**: four exhibits, one gate.', 'Start with the exhibit that saves **the most hours**.'][(FX.mi = (FX.mi || 0) + 1) % 2], who: 'TechNext docent', role: 'TechNext · welcome desk · illustration', near: [-640, 120], pose: 'clap' }; }
      if (Math.abs(x - CASH.x) < 60 && y < F && y > F - 270) { FX.gift = t; CR.burst('heart', CASH.x, F - 280, t); return { say: 'Gift-wrapped! The **Nexi** plush is our bestseller.', who: 'Shop assistant', role: 'TechNext · museum shop · illustration', near: [1100, 120], pose: 'love' }; }
      if (x > -450 && x < -334 && y > 180 && y < 372) { FX.robot = t; return { say: 'The old **automaton** waves hello. Today\'s AI also asks **before it matters**.', who: 'Automaton', role: 'replica · museum piece', near: [-300, 120], pose: 'wow' }; }
      var zh = zoneHit(x, y, t); if (zh) return zh;
      for (var i = 0; i < ROB.length; i++) { var R = ROB[i]; if (R.cx != null && Math.abs(x - R.cx) < 34 && Math.abs(y - (R.y - 8)) < 24) { CR.burst('spark', R.cx, R.y - 30, t); return { say: 'Beep! The cleaning robot does **one repetitive job** really well.', who: 'Cleaning robot', role: 'museum floor', near: [clamp(R.cx, 200, 900), 120], pose: 'wow' }; } }
      return CR.hitWalker(x, y, t); },
    onStop: function (key, S, t) { S.kT = t; }
  };
  /* the hub's exhibits link to their pages: a first tap presents the exhibit, a second tap on the same one opens its page
     (registered before the engine's own handler, so the check sees the state the visitor left it in) */
  [].forEach.call(document.querySelectorAll('[data-world="sol-ai"] [data-hot][data-href]'), function (b, i, all) {
    b.addEventListener('click', function () { if (b.getAttribute('data-armed') === '1') { location.href = b.getAttribute('data-href'); return; }
      [].forEach.call(all, function (o) { o.removeAttribute('data-armed'); }); b.setAttribute('data-armed', '1'); });
  });
})(window.IXW && window.IXW.kit, window.CR, window.CO);
