/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: sol-chat (/solutions/ai-chatbots) — "The Grand Lobby": an AI chatbot drawn as the concierge of a bright hotel lobby
   on a sunny day (ivory walls, plum panels with gold mouldings, a marble floor, ceiling fans, arched windows onto palms).
   Guests arrive by three channels: the WEB kiosk by the revolving door, WHATSAPP on a guest's phone, IN-APP on a guest's
   tablet (the lift shows the app). The ASSISTANT is the robot concierge behind the desk: it answers from the house guide
   (your content: a leaflet folds into a paper plane and flies to it), looks bookings, orders and invoices up on the key
   board and the parcel and folio shelves, lights the guided flow on the directory sign, writes the lead into the guest book
   and, when a person is needed, rings the bell and sends the context folder (transcript, order, customer) to the duty
   manager. The greeting medallions light in the guest's language. Five sample conversations loop.
   The cast: the TechNext consultant stocks the house guide (tap: a fan of leaflets folds into paper planes), the WhatsApp
   guest types and reads (tap: a selfie with the assistant), the in-app guest checks his tablet and his watch (tap: a twirl
   and a five-star rating), the duty manager writes the shift log and takes calls (tap: the full transcript unrolls to the
   floor, then a bow). Tap the assistant, the bell, the revolving door or the lift too. Every line in the scene is sample. */
(function (K, CR, CO) {
  'use strict';
  if (!K || !CR || !CO) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed, limb = K.limb, FONT = K.FONT;
  var F = 470, INK = '#1B1F3B', PLUM = '#6B3F63', PLUM_D = '#4E2C48', PLUM_L = '#F3E7F0', GOLD = '#C9A24A', GOLD_D = '#9C7A2E', GOLD_L = '#F1DB9A', WALNUT = '#8A5A3B', MARBLE = '#F7F3EE',
    IVORY = '#FBF3EA', WA = '#25D366', WA_D = '#128C4B', WEB = '#3167CA', APP = '#F0715A', TEAL = '#5FE0D0', SCREEN = '#1E2A44';
  var CEIL = -92, MED = { y: -30, xs: [410, 470, 530, 590, 650], r: 17 }, SIGN = { x: 450, y: 6, w: 160, h: 28 }, KEYS = { x: 408, y: 44, w: 96, h: 106 }, SHELF = { x: 556, y: 44, w: 100, h: 106 };
  var BOT = { x: 530 }, DESK = { x: 398, y: 380, w: 266 }, BELL = { x: 556, y: 374 }, RACK = { x: 270, y: 168, w: 60 }, NEON = { x: 268, y: 28, w: 124, h: 74 }, DOOR = { x: 142, y: 120, w: 84 },
    KIOSK = { x: 232, y: 262, w: 34, h: 50 }, DIR = { x: 684, y: 60, w: 96, h: 112 }, BOOK = { x: 702, y: 318 }, POD = { x: 792, y: 368, w: 106 }, LIFT = { x: 946, y: 150, w: 80 }, HANG = { x: 790, y: 160, w: 112 };
  var WINC = [860, 1160, 1460, -345, -645, -945], WHW = 74, ALC = { x: 531, y: 75, r: 146 };
  var LANGS = [['Hello', 'English'], ['Halo', 'Malay'], ['Kumusta', 'Filipino'], ['Xin chào', 'Vietnamese'], ['你好', 'Chinese']];
  var FLOWS = ['Book a slot', 'Track an order', 'Your invoice', 'Talk to a person'];
  var CYC = 12;
  var RUNS = [
    { ch: 'wa', who: 'g1', q: 'Do you deliver on Saturdays?', src: 'Delivery policy', fetch: 'guide', a: 'Yes, Saturday slots run 9am to 1pm. Shall I book one?', res: 'Slot booked', act: 'key', flow: 0, lang: 0 },
    { ch: 'web', who: 'kiosk', q: 'Where is my order SO-1042?', src: 'Sales order', fetch: 'parcel', a: 'It is packed and out for delivery today.', res: 'Order found', act: 'card', flow: 1, lang: 0 },
    { ch: 'app', who: 'g2', q: 'Can I get my May invoice?', src: 'Invoices', fetch: 'folio', a: 'Here it is. Anything else I can help with?', res: 'Invoice shared', act: 'sheet', flow: 2, lang: 0 },
    { ch: 'wa', who: 'g1', q: 'Can I talk to someone about a bulk order?', src: 'No approved answer', fetch: 'none', a: 'Of course. I\'m passing you to our sales team with this chat.', res: 'Lead saved with the chat', act: 'hand', flow: 3, lang: 0 },
    { ch: 'app', who: 'g2', q: 'May delivery ba kayo sa Sabado?', src: 'Delivery policy', fetch: 'guide', a: 'Opo! Tuwing Sabado, 9am hanggang 1pm.', res: 'Answered in Filipino', act: 'none', flow: 0, lang: 2 }];
  var CHC = { wa: WA, web: WEB, app: APP }, CHN = { wa: 'WhatsApp', web: 'Web chat', app: 'In-app' };
  function setU(g, sx, sy, k) { g.translate(sx, sy); g.scale(k, k); }
  function extOf(W, H, k, sx, sy) { return { l: -(sx + 24) / k, r: (W - sx) / k, t: -(sy + 24) / k, b: (H - sy) / k }; }
  function smooth(u) { return u * u * (3 - 2 * u); }
  function rrAdd(g, x, y, w, h, r) { if (g.roundRect) g.roundRect(x, y, w, h, r); else g.rect(x, y, w, h); }
  function tone(c, k) { return K.tone(c, k == null ? 0.22 : k); }
  function runAt(t) { var n = Math.floor(t / CYC), u = t / CYC - n; return { n: n, u: u, R: RUNS[((n % RUNS.length) + RUNS.length) % RUNS.length] }; }

  /* ---------------- the people ---------------- */
  var W = CR.who;
  var TN = W({ x: 364, y: 470, s: 0.46, ph: 0.4, skin: 1, hair: 0, style: 'bob', outfit: 'cardigan', top: '#3167CA', top2: '#FFFFFF', hands: [[-70, -200], [60, -190]], look: -0.5 });
  var G1 = W({ x: 440, y: 470, s: 0.47, ph: 1.3, skin: 0, hair: 1, style: 'pony', outfit: 'cardigan', top: '#F0715A', top2: '#FFF4EC', id: '#9AA6BC', clip: '#FFD84A', hands: [[-60, -190], [40, -250]], look: 0.4 });
  var G2 = W({ x: 624, y: 470, s: 0.47, ph: 2.1, skin: 3, hair: 0, style: 'short', outfit: 'polo', top: '#14A38B', top2: '#FFFFFF', id: '#9AA6BC', hold: 'tablet', glasses: true, hands: [[-56, -214], [60, -190]], look: -0.4 });
  var DM = W({ x: 846, y: 470, s: 0.47, ph: 2.9, skin: 2, hair: 2, style: 'long', outfit: 'shirt', top: PLUM, id: '#9AA6BC', clip: GOLD_L, hands: [[-60, -200], [60, -200]], look: -0.5 });
  /* the lounge (left, behind the title card): a guest on the sofa with the paper and her tea, a traveller by the window */
  var LG = { sofa: -175, tbl: -38, lamp: 70, rug: -150 };
  var RD = W({ x: -196, y: 470, s: 0.45, ph: 0.8, skin: 2, hair: 0, style: 'bun', outfit: 'shirt', top: '#5FA8D3', id: '#9AA6BC', sit: true, chair: false, hands: [[-60, -250], [60, -250]], look: 0.2 });
  var TV = W({ x: -392, y: 470, s: 0.46, ph: 2.4, skin: 0, hair: 0, style: 'short', outfit: 'polo', top: '#E07B12', id: '#9AA6BC', glasses: true, hands: [[-64, -196], [40, -250]], look: 0.3 });
  G1.c.low = '#3A4458'; G2.c.low = '#5C6B7A'; DM.c.low = PLUM_D; RD.c.low = '#3A4458'; TV.c.low = '#4A5568';
  var CREW = [
    { x0: 1040, x1: 1340, y: 492, spd: 15, ph: 0.3, label: 'TechNext developer', lines: ['The same assistant runs on your **website, WhatsApp and app**.', 'One knowledge base behind **every channel**.'], acts: ['wave', 'id', 'nod'],
      P: W({ s: 0.52, skin: 2, hair: 0, style: 'short', outfit: 'shirt', top: '#714B67', hold: 'tablet' }) },
    { x0: -440, x1: 96, y: 506, spd: 17, ph: 0.6, label: 'TechNext consultant', lines: ['Send us your **top twenty** customer questions.', 'Unanswered questions are reviewed **every month**.'], acts: ['nod', 'cheer', 'id'],
      P: W({ s: 0.53, skin: 1, hair: 1, style: 'bun', outfit: 'polo', top: '#3167CA', clip: '#FFD84A', hold: 'clipboard' }) },
    { x0: -900, x1: -180, y: 492, spd: 14, ph: 0.15, label: 'TechNext trainer', lines: ['Your team learns to **pick up a hand-off** in Live Chat.'], acts: ['wave', 'jump', 'id'],
      P: W({ s: 0.52, skin: 0, hair: 1, style: 'long', outfit: 'cardigan', top: '#14A38B', top2: '#FFFFFF', hold: 'box' }) },
    { x0: -900, x1: -500, y: 496, spd: 16, ph: 0.45, label: 'Guest', drag: '#6B3F63', lines: ['I asked on WhatsApp and got the **delivery slot** straight away.'], acts: ['cheer', 'wave'],
      P: W({ s: 0.52, skin: 3, hair: 0, style: 'short', outfit: 'shirt', top: '#E9B949', id: '#9AA6BC' }) }
  ];
  function handAt(P, side) {
    var F3 = K.F3, d = side ? 1 : -1, h = P.hands[side], sxk = P.sx == null ? 1 : P.sx, bw = P.build || 1;
    var r = K.ik(d * F3.shx * bw, F3.shy, h[0], h[1], F3.a, F3.b, d).h, dy = -(P.hop || 0) + (P.sit ? (P.sitDrop != null ? P.sitDrop : 46) : 0);
    return [P.x + r[0] * P.s * sxk, P.y + (r[1] + dy) * P.s];
  }
  function headTop(P) { return P.y - (480 + (P.hop || 0)) * P.s; }

  /* ---------------- small painters ---------------- */
  var WR = {};
  function wrap(g, s, maxW, size) { var key = s + '|' + maxW + '|' + size; if (WR[key]) return WR[key]; g.font = '700 ' + size + 'px ' + FONT; var words = s.split(' '), lines = [], cur = '';
    words.forEach(function (w) { var tryS = cur ? cur + ' ' + w : w; if (g.measureText(tryS).width > maxW && cur) { lines.push(cur); cur = w; } else cur = tryS; }); if (cur) lines.push(cur);
    var wd = 0; lines.forEach(function (l) { wd = Math.max(wd, g.measureText(l).width); }); return (WR[key] = { lines: lines, w: wd }); }
  function chIcon(g, ch, x, y, r, fg) {
    g.fillStyle = fg; g.strokeStyle = fg; g.lineWidth = r * 0.22;
    if (ch === 'wa') { g.beginPath(); g.arc(x, y, r * 0.6, 0, 7); g.stroke(); g.beginPath(); g.moveTo(x - r * 0.5, y + r * 0.35); g.lineTo(x - r * 0.7, y + r * 0.75); g.lineTo(x - r * 0.2, y + r * 0.55); g.fill(); }
    else if (ch === 'web') { g.beginPath(); g.arc(x, y, r * 0.62, 0, 7); g.stroke(); g.beginPath(); g.ellipse(x, y, r * 0.26, r * 0.62, 0, 0, 7); g.stroke(); g.beginPath(); g.moveTo(x - r * 0.62, y); g.lineTo(x + r * 0.62, y); g.stroke(); }
    else { for (var i = 0; i < 4; i++) fillRR(g, x - r * 0.55 + (i % 2) * r * 0.6, y - r * 0.55 + Math.floor(i / 2) * r * 0.6, r * 0.48, r * 0.48, r * 0.12, fg); }
  }
  /* a speech bubble: anchored by its tail tip (tx, ty); the box sits at (x, y); n = characters typed so far */
  function bubble(g, x, y, s, n, tx, ty, col, opt) {
    opt = opt || {}; var size = opt.size || 10.4, maxW = opt.maxW || 176, L = wrap(g, s, maxW, size), pad = 9, lh = size * 1.32, bw = L.w + pad * 2 + (opt.ch ? 18 : 0), bh = L.lines.length * lh + pad * 1.6, a = opt.a == null ? 1 : opt.a;
    if (opt.anchor === 'right') x -= bw; else if (opt.anchor === 'center') x -= bw / 2;
    g.save(); g.globalAlpha = a; fillRR(g, x, y, bw, bh, 9, '#FFFFFF'); g.strokeStyle = col; g.lineWidth = 2; rr(g, x, y, bw, bh, 9); g.stroke();
    var bx = clamp(tx, x + 12, x + bw - 12); g.fillStyle = '#FFFFFF'; g.beginPath(); g.moveTo(bx - 7, y + bh - 1); g.lineTo(tx, ty); g.lineTo(bx + 7, y + bh - 1); g.closePath(); g.fill(); g.stroke(); g.fillRect(bx - 6, y + bh - 3, 12, 4);
    var ox = x + pad; if (opt.ch) { fillE(g, x + pad + 6, y + pad + 4, 7.4, 7.4, col); chIcon(g, opt.ch, x + pad + 6, y + pad + 4, 7, '#FFFFFF'); ox += 18; }
    var left = n == null ? 1e9 : n; g.font = '700 ' + size + 'px ' + FONT; g.fillStyle = INK; g.textBaseline = 'alphabetic';
    L.lines.forEach(function (l, i) { if (left <= 0) return; var part = l.slice(0, left); left -= l.length + 1; g.fillText(part, ox, y + pad + size * 0.9 + i * lh); });
    g.restore(); return { x: x, y: y, w: bw, h: bh };
  }
  function dots(g, x, y, t, col) { for (var i = 0; i < 3; i++) fillE(g, x + i * 8, y - Math.max(0, Math.sin(t * 9 - i * 0.8)) * 3, 2.6, 2.6, col); }
  function chip(g, x, y, s, col, a, icon) { g.save(); g.globalAlpha = a == null ? 1 : a; g.font = '800 8px ' + FONT; var w = g.measureText(s).width + 18 + (icon ? 8 : 0); fillRR(g, x, y, w, 15, 7.5, col); if (icon) text(g, icon, x + 8, y + 10.8, 8, 800, '#FFFFFF'); text(g, s, x + 9 + (icon ? 8 : 0), y + 10.6, 8, 800, '#FFFFFF'); g.restore(); return w; }
  function key(g, x, y, rot, num) { g.save(); g.translate(x, y); g.rotate(rot || 0); g.strokeStyle = GOLD_D; g.lineWidth = 2; g.beginPath(); g.arc(0, 0, 4, 0, 7); g.stroke(); fillRR(g, -1.4, 3, 2.8, 14, 1, GOLD); fillRR(g, 0, 12, 5, 2, 1, GOLD); fillRR(g, 0, 15, 4, 2, 1, GOLD);
    g.strokeStyle = 'rgba(80,60,40,.5)'; g.lineWidth = 1; g.beginPath(); g.moveTo(0, -4); g.lineTo(0, -8); g.stroke(); fillRR(g, -7, -22, 14, 14, 3, PLUM); if (num) text(g, num, 0, -12, 6.4, 800, GOLD_L, 'center'); g.restore(); }
  function parcel(g, x, y, w, h, col, rib) { fillRR(g, x, y, w, h, 2, col); g.fillStyle = rib; g.fillRect(x + w / 2 - 1.5, y, 3, h); g.fillRect(x, y + h / 2 - 1.5, w, 3); fillE(g, x + w / 2 - 3, y - 1, 3, 2, rib); fillE(g, x + w / 2 + 3, y - 1, 3, 2, rib); }
  function folder(g, x, y, s, rot, open) { g.save(); g.translate(x, y); g.rotate(rot || 0); g.scale(s, s);
    fillRR(g, -18, -12, 9, 6, 1.5, WA); fillRR(g, -7, -13, 9, 6, 1.5, WEB); fillRR(g, 4, -12, 9, 6, 1.5, GOLD);
    fillRR(g, -20, -9, 40, 26, 3, PLUM); if (open) { fillRR(g, -18, -26, 36, 22, 2, '#FFFFFF'); g.fillStyle = '#C9C2DA'; for (var i = 0; i < 4; i++) g.fillRect(-14, -22 + i * 4.5, i === 3 ? 18 : 28, 2); }
    fillRR(g, -10, 1, 20, 6, 2, GOLD_L); text(g, 'CONTEXT', 0, 6, 4.4, 800, PLUM_D, 'center'); g.restore(); }
  function palm(g, x, y, s, sway) { g.save(); g.translate(x, y); g.scale(s, s);
    fillRR(g, -30, -60, 60, 60, 12, PLUM); fillRR(g, -34, -66, 68, 12, 6, GOLD); g.strokeStyle = '#7A6248'; g.lineWidth = 7; g.lineCap = 'round'; g.beginPath(); g.moveTo(0, -60); g.quadraticCurveTo(-6, -140, 4, -210); g.stroke();
    g.rotate(sway || 0); [[-1, -0.3], [1, -0.4], [-1, 0.5], [1, 0.6], [-0.2, -1], [0.3, 1]].forEach(function (L, i) { g.save(); g.translate(4, -210); g.rotate(L[1] + (L[0] < 0 ? -0.6 : 0.6)); g.fillStyle = i % 2 ? '#3FAE6E' : '#2E9E5E';
      g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(L[0] * 50, -30, L[0] * 100, 10); g.quadraticCurveTo(L[0] * 50, -6, 0, 0); g.fill(); g.restore(); }); g.restore(); }
  function marbleVeins(g, x, y, w, h, seed) { g.strokeStyle = 'rgba(150,140,130,.22)'; g.lineWidth = 1; for (var i = 0; i < 3; i++) { var yy = y + h * (0.2 + 0.3 * i); g.beginPath(); g.moveTo(x, yy); g.bezierCurveTo(x + w * 0.3, yy - 4 + hash(seed + i) * 8, x + w * 0.6, yy + 5, x + w, yy - 2); g.stroke(); } }

  /* ---------------- static layers ---------------- */
  function winPath(g, cx) { var top = 0, bot = 250; g.moveTo(cx - WHW, bot); g.lineTo(cx - WHW, top + WHW); g.arc(cx, top + WHW, WHW, Math.PI, 0); g.lineTo(cx + WHW, bot); g.closePath(); }
  function paintBg(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    var sg = g.createLinearGradient(0, -40, 0, 260); sg.addColorStop(0, '#86CBF2'); sg.addColorStop(0.7, '#CDEBFB'); sg.addColorStop(1, '#EEF8FD'); g.fillStyle = sg; g.fillRect(e.l, e.t, e.r - e.l, e.b - e.t);
    var gl = g.createRadialGradient(1100, -60, 10, 1100, -60, 380); gl.addColorStop(0, 'rgba(255,248,214,.9)'); gl.addColorStop(1, 'rgba(255,244,200,0)'); g.fillStyle = gl; g.fillRect(e.l, e.t, e.r - e.l, 500);
    /* the garden beyond the windows: a hedge, frangipani and palms */
    g.fillStyle = '#9ED39B'; g.fillRect(e.l, 196, e.r - e.l, 80); for (var h = Math.floor(e.l / 36) - 1; h < e.r / 36 + 1; h++) fillE(g, h * 36, 198, 26, 16, h % 2 ? '#8FCB8C' : '#A7D9A2');
    for (var p = Math.floor(e.l / 150) - 1; p < e.r / 150 + 1; p++) { var px = p * 150 + 40; g.strokeStyle = '#A08A6A'; g.lineWidth = 5; g.beginPath(); g.moveTo(px, 230); g.quadraticCurveTo(px - 8, 120, px + 6, 60); g.stroke();
      [-1, 1, -0.4, 0.5].forEach(function (d, i) { g.fillStyle = i % 2 ? '#4FB57A' : '#3FA56C'; g.beginPath(); g.moveTo(px + 6, 60); g.quadraticCurveTo(px + 6 + d * 40, 34 + i * 6, px + 6 + d * 80, 70 + i * 4); g.quadraticCurveTo(px + 6 + d * 40, 50, px + 6, 60); g.fill(); }); }
    g.restore();
  }
  function paintFrame(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    /* the coffered ceiling with its gold mouldings */
    var cg = g.createLinearGradient(0, e.t, 0, CEIL); cg.addColorStop(0, '#F3E9DD'); cg.addColorStop(1, '#FBF5EE'); g.fillStyle = cg; g.fillRect(e.l, e.t, e.r - e.l, CEIL - e.t);
    for (var cx = Math.floor(e.l / 120) * 120; cx < e.r; cx += 120) { fillRR(g, cx + 8, e.t + 8, 104, CEIL - e.t - 22, 8, '#F7EFE4'); g.strokeStyle = 'rgba(201,162,74,.45)'; g.lineWidth = 1.6; rr(g, cx + 16, e.t + 16, 88, CEIL - e.t - 38, 6); g.stroke(); fillE(g, cx + 60, (e.t + CEIL) / 2 - 6, 4, 4, 'rgba(201,162,74,.5)'); }
    fillRR(g, e.l, CEIL - 6, e.r - e.l, 10, 0, GOLD); g.fillStyle = 'rgba(255,255,255,.4)'; g.fillRect(e.l, CEIL - 5, e.r - e.l, 2);
    /* the wall, the windows cut out */
    g.beginPath(); g.rect(e.l, CEIL + 4, e.r - e.l, F - CEIL - 4); WINC.forEach(function (x) { if (x > e.l - 100 && x < e.r + 100) winPath(g, x); });
    var wg = g.createLinearGradient(0, CEIL, 0, 300); wg.addColorStop(0, '#FFF9F1'); wg.addColorStop(1, '#F6E8DA'); g.fillStyle = wg; g.fill('evenodd');
    /* the frieze under the ceiling */
    g.fillStyle = 'rgba(201,162,74,.28)'; for (var fx = Math.floor(e.l / 24) * 24; fx < e.r; fx += 24) { g.beginPath(); g.arc(fx + 12, CEIL + 12, 5, 0, Math.PI); g.fill(); } g.fillStyle = 'rgba(201,162,74,.5)'; g.fillRect(e.l, CEIL + 20, e.r - e.l, 1.6);
    /* the plum panelled dado with gold mouldings */
    g.fillStyle = PLUM; g.fillRect(e.l, 300, e.r - e.l, F - 300); fillRR(g, e.l, 294, e.r - e.l, 9, 0, GOLD); g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(e.l, 295, e.r - e.l, 2);
    g.strokeStyle = 'rgba(241,219,154,.55)'; g.lineWidth = 2; for (var px = Math.floor(e.l / 110) * 110; px < e.r; px += 110) { rr(g, px + 10, 318, 90, 128, 6); g.stroke(); }
    fillRR(g, e.l, F - 14, e.r - e.l, 14, 0, PLUM_D);
    /* the window frames: white arches, gold sills, glazing */
    WINC.forEach(function (x) { if (x < e.l - 100 || x > e.r + 100) return; g.strokeStyle = '#FFFFFF'; g.lineWidth = 8; g.beginPath(); winPath(g, x); g.stroke();
      g.lineWidth = 3; g.beginPath(); g.moveTo(x, 250); g.lineTo(x, 0); g.moveTo(x - WHW, 120); g.lineTo(x + WHW, 120); g.moveTo(x - WHW, 74); g.lineTo(x + WHW, 74); g.stroke();
      g.fillStyle = 'rgba(255,255,255,.2)'; g.beginPath(); g.moveTo(x - 60, 250); g.lineTo(x - 20, 20); g.lineTo(x + 2, 20); g.lineTo(x - 38, 250); g.closePath(); g.fill();
      fillRR(g, x - 84, 248, 168, 10, 4, GOLD); fillRR(g, x - 18, -24, 36, 24, 6, '#FFFFFF'); fillE(g, x, -12, 6, 6, GOLD); });
    /* pilasters */
    for (var pl = Math.floor(e.l / 300) * 300 + 150; pl < e.r; pl += 300) { if (WINC.some(function (w) { return Math.abs(w - pl) < 110; })) continue; fillRR(g, pl - 14, CEIL + 22, 28, 272 - CEIL, 0, 'rgba(255,255,255,.4)'); fillRR(g, pl - 18, CEIL + 22, 36, 9, 2, GOLD_L); }
    /* the marble floor: a checkerboard in perspective, a plum runner */
    var fg = g.createLinearGradient(0, F, 0, e.b); fg.addColorStop(0, '#F2ECE3'); fg.addColorStop(1, '#E6DDD0'); g.fillStyle = fg; g.fillRect(e.l, F, e.r - e.l, e.b - F);
    var rows = 10; for (var r = 0; r < rows; r++) { var y0 = F + Math.pow(r / rows, 1.45) * (e.b - F), y1 = F + Math.pow((r + 1) / rows, 1.45) * (e.b - F), tw = 60 * (1 + r * 0.16);
      for (var c = Math.floor((e.l - 560) / tw) - 1; c < (e.r - 560) / tw + 1; c++) { if ((c + r) % 2) continue; var xa = 560 + c * tw, xb = xa + tw, k0 = 1 + (r / rows) * 0.18, k1 = 1 + ((r + 1) / rows) * 0.18;
        g.fillStyle = 'rgba(160,140,120,.16)'; g.beginPath(); g.moveTo(560 + (xa - 560) * 1, y0); g.lineTo(560 + (xb - 560) * 1, y0); g.lineTo(560 + (xb - 560) * (k1 / k0), y1); g.lineTo(560 + (xa - 560) * (k1 / k0), y1); g.closePath(); g.fill(); } }
    g.fillStyle = 'rgba(78,44,72,.10)'; g.fillRect(e.l, F, e.r - e.l, 8);
    fillRR(g, e.l, 640, e.r - e.l, 52, 0, PLUM); g.fillStyle = GOLD; g.fillRect(e.l, 644, e.r - e.l, 3); g.fillRect(e.l, 685, e.r - e.l, 3); g.fillStyle = 'rgba(241,219,154,.3)'; for (var rx = Math.floor(e.l / 40) * 40; rx < e.r; rx += 40) { g.beginPath(); g.moveTo(rx, 666); g.lineTo(rx + 10, 656); g.lineTo(rx + 20, 666); g.lineTo(rx + 10, 676); g.closePath(); g.fill(); }
    g.restore();
  }
  function paintBack(g, ext) {
    var e = ext;
    /* the arched alcove behind the concierge desk: a gold frame round a plum damask panel */
    g.beginPath(); g.moveTo(ALC.x - ALC.r, 300); g.lineTo(ALC.x - ALC.r, ALC.y); g.arc(ALC.x, ALC.y, ALC.r, Math.PI, 0); g.lineTo(ALC.x + ALC.r, 300); g.closePath();
    g.fillStyle = '#7D4C74'; g.fill(); g.lineWidth = 9; g.strokeStyle = GOLD; g.stroke(); g.lineWidth = 2; g.strokeStyle = GOLD_L; g.stroke();
    g.save(); g.clip(); g.fillStyle = 'rgba(241,219,154,.13)'; for (var dy = ALC.y - ALC.r; dy < 300; dy += 22) for (var dx = ALC.x - ALC.r + ((dy / 22) % 2 ? 11 : 0); dx < ALC.x + ALC.r; dx += 22) { g.beginPath(); g.moveTo(dx, dy - 5); g.lineTo(dx + 4, dy); g.lineTo(dx, dy + 5); g.lineTo(dx - 4, dy); g.closePath(); g.fill(); }
    var lg = g.createRadialGradient(ALC.x, 60, 10, ALC.x, 60, 200); lg.addColorStop(0, 'rgba(255,240,210,.28)'); lg.addColorStop(1, 'rgba(255,240,210,0)'); g.fillStyle = lg; g.fillRect(ALC.x - ALC.r, ALC.y - ALC.r, ALC.r * 2, 300); g.restore();
    fillE(g, ALC.x, ALC.y - ALC.r - 2, 12, 12, GOLD); fillE(g, ALC.x, ALC.y - ALC.r - 2, 6, 6, GOLD_L);
    [ALC.x - ALC.r - 2, ALC.x + ALC.r + 2].forEach(function (x) { fillRR(g, x - 9, 120, 18, 180, 4, GOLD); fillRR(g, x - 13, 112, 26, 10, 3, GOLD_L); fillRR(g, x - 13, 292, 26, 10, 3, GOLD_D); });
    /* sconces either side of the alcove */
    [ALC.x - ALC.r - 2, ALC.x + ALC.r + 2].forEach(function (x) { fillRR(g, x - 2, 150, 4, 26, 2, GOLD_D); g.fillStyle = '#FFF4DA'; g.beginPath(); g.moveTo(x - 12, 150); g.lineTo(x + 12, 150); g.lineTo(x + 8, 132); g.lineTo(x - 8, 132); g.closePath(); g.fill(); fillRR(g, x - 13, 148, 26, 4, 2, GOLD); });
    /* the transom arch over the revolving door */
    var D1 = DOOR, tcx = D1.x + D1.w / 2, tr = D1.w / 2 + 4; g.fillStyle = 'rgba(205,232,245,.75)'; g.beginPath(); g.arc(tcx, D1.y - 30, tr, Math.PI, 0); g.closePath(); g.fill(); g.strokeStyle = GOLD; g.lineWidth = 5; g.stroke();
    g.lineWidth = 2; g.beginPath(); for (var ra = 1; ra < 6; ra++) { var an = Math.PI + ra * Math.PI / 6; g.moveTo(tcx, D1.y - 30); g.lineTo(tcx + Math.cos(an) * tr, D1.y - 30 + Math.sin(an) * tr); } g.stroke(); fillE(g, tcx, D1.y - 30, 8, 8, GOLD);
    /* a painting over the directory sign: the bay at noon */
    { var px0 = DIR.x + 8, py0 = -54, pw = DIR.w - 16, ph = 84; shadowed(g, 8, 3, 0.18, function () { fillRR(g, px0 - 6, py0 - 6, pw + 12, ph + 12, 4, GOLD); });
      var sk = g.createLinearGradient(0, py0, 0, py0 + ph); sk.addColorStop(0, '#9FD6F5'); sk.addColorStop(1, '#E6F5FC'); g.fillStyle = sk; g.fillRect(px0, py0, pw, ph);
      fillE(g, px0 + pw - 18, py0 + 16, 7, 7, '#FFF1B8'); g.fillStyle = '#9DB6DC'; [[6, 30], [16, 46], [28, 22], [40, 38], [52, 28], [64, 44]].forEach(function (b) { g.fillRect(px0 + b[0], py0 + ph - 18 - b[1], 10, b[1] + 4); });
      g.fillStyle = '#7FA7D8'; g.fillRect(px0, py0 + ph - 16, pw, 16); g.fillStyle = 'rgba(255,255,255,.5)'; g.fillRect(px0 + 8, py0 + ph - 10, 20, 1.6); g.fillRect(px0 + 40, py0 + ph - 6, 26, 1.6); }
    /* the lift's floor dial */
    var Lx = LIFT.x + LIFT.w / 2; fillRR(g, Lx - 34, 66, 68, 40, 8, GOLD); g.fillStyle = '#FFFDF8'; g.beginPath(); g.arc(Lx, 100, 26, Math.PI, 0); g.closePath(); g.fill();
    for (var fl2 = 0; fl2 < 5; fl2++) { var fa = Math.PI + (fl2 + 0.5) * Math.PI / 5; text(g, String(fl2 + 1), Lx + Math.cos(fa) * 20, 103 + Math.sin(fa) * 20, 6.4, 800, PLUM_D, 'center'); }
    /* ceiling fan rods; the greeting medallions on their chains */
    [230, 760, -420, 1230].forEach(function (fx) { if (fx < e.l - 80 || fx > e.r + 80) return; fillRR(g, fx - 2, e.t, 4, -70 - e.t, 1, GOLD_D); fillRR(g, fx - 12, -78, 24, 14, 6, GOLD); });
    MED.xs.forEach(function (x, i) { g.strokeStyle = GOLD_D; g.lineWidth = 1.4; g.beginPath(); g.moveTo(x, CEIL + 4); g.lineTo(x, MED.y - MED.r); g.stroke(); shadowed(g, 8, 3, 0.18, function () { fillE(g, x, MED.y, MED.r + 3, MED.r + 3, GOLD); }); fillE(g, x, MED.y, MED.r, MED.r, '#FFFDF8'); });
    /* the concierge sign with its crossed keys */
    shadowed(g, 10, 4, 0.18, function () { fillRR(g, SIGN.x, SIGN.y, SIGN.w, SIGN.h, 7, PLUM); }); g.strokeStyle = GOLD; g.lineWidth = 1.6; rr(g, SIGN.x + 4, SIGN.y + 4, SIGN.w - 8, SIGN.h - 8, 5); g.stroke();
    text(g, 'CONCIERGE', SIGN.x + SIGN.w / 2 + 8, SIGN.y + 19, 11, 800, GOLD_L, 'center'); key(g, SIGN.x + 18, SIGN.y + 10, -0.7); key(g, SIGN.x + 22, SIGN.y + 10, 0.7);
    /* the key board (bookings) */
    shadowed(g, 10, 4, 0.18, function () { fillRR(g, KEYS.x, KEYS.y, KEYS.w, KEYS.h, 6, WALNUT); }); fillRR(g, KEYS.x + 4, KEYS.y + 4, KEYS.w - 8, 14, 3, PLUM_D); text(g, 'BOOKINGS', KEYS.x + KEYS.w / 2, KEYS.y + 14, 7.6, 800, GOLD_L, 'center');
    for (var kr = 0; kr < 3; kr++) for (var kc = 0; kc < 4; kc++) fillE(g, KEYS.x + 16 + kc * 21, KEYS.y + 28 + kr * 27, 2.2, 2.2, GOLD_L);
    /* the parcel and folio shelves (orders, invoices) */
    shadowed(g, 10, 4, 0.18, function () { fillRR(g, SHELF.x, SHELF.y, SHELF.w, SHELF.h, 6, WALNUT); }); fillRR(g, SHELF.x + 4, SHELF.y + 48, SHELF.w - 8, 4, 2, '#6E452D'); fillRR(g, SHELF.x + 4, SHELF.y + SHELF.h - 8, SHELF.w - 8, 4, 2, '#6E452D');
    fillRR(g, SHELF.x + 4, SHELF.y + 4, SHELF.w - 8, 13, 3, PLUM_D); text(g, 'ORDERS', SHELF.x + SHELF.w / 2, SHELF.y + 13.6, 7.4, 800, GOLD_L, 'center');
    fillRR(g, SHELF.x + 4, SHELF.y + 54, SHELF.w - 8, 13, 3, PLUM_D); text(g, 'INVOICES', SHELF.x + SHELF.w / 2, SHELF.y + 63.6, 7.4, 800, GOLD_L, 'center');
    for (var fo = 0; fo < 7; fo++) fillRR(g, SHELF.x + 10 + fo * 11, SHELF.y + 72 + (fo % 2) * 2, 9, 26 - (fo % 2) * 2, 1.5, ['#E8D9C4', '#F7F3EE', '#D9C9B4', '#FFFFFF'][fo % 4]);
    /* the WhatsApp neon over the house guide */
    fillRR(g, NEON.x, NEON.y, NEON.w, NEON.h, 12, '#F2FBF5'); g.strokeStyle = 'rgba(37,211,102,.35)'; g.lineWidth = 6; rr(g, NEON.x + 6, NEON.y + 6, NEON.w - 12, NEON.h - 12, 10); g.stroke();
    /* the house guide rack (your content) */
    var R0 = RACK; soft(g, R0.x + R0.w / 2, F + 2, 44, 5, 0.25); shadowed(g, 10, 4, 0.2, function () { fillRR(g, R0.x, R0.y, R0.w, F - R0.y, 6, WALNUT); });
    fillRR(g, R0.x - 4, R0.y - 22, R0.w + 8, 22, 6, PLUM); text(g, 'HOUSE GUIDE', R0.x + R0.w / 2, R0.y - 8, 7.6, 800, GOLD_L, 'center');
    var LF = [['Delivery', WEB], ['Prices', GOLD], ['Hours', WA_D], ['Policies', PLUM], ['Services', APP], ['FAQ', '#3FA9E0']];
    LF.forEach(function (l, i) { var y = R0.y + 10 + i * 46; fillRR(g, R0.x + 5, y + 26, R0.w - 10, 14, 2, '#6E452D'); fillRR(g, R0.x + 9, y, R0.w - 18, 34, 2, '#FFFFFF'); fillRR(g, R0.x + 9, y, R0.w - 18, 9, 2, l[1]); text(g, l[0], R0.x + R0.w / 2, y + 21, 6.6, 800, INK, 'center');
      g.fillStyle = '#C9D3E3'; g.fillRect(R0.x + 14, y + 25, R0.w - 28, 1.6); });
    /* the revolving door (web) with its canopy and the web kiosk */
    var D0 = DOOR; fillRR(g, D0.x - 8, D0.y - 28, D0.w + 16, 30, 8, PLUM); g.strokeStyle = GOLD; g.lineWidth = 1.6; rr(g, D0.x - 4, D0.y - 24, D0.w + 8, 22, 6); g.stroke();
    fillE(g, D0.x + 20, D0.y - 13, 7.4, 7.4, WEB); chIcon(g, 'web', D0.x + 20, D0.y - 13, 7, '#FFFFFF'); text(g, 'WEB · ENTRANCE', D0.x + 32, D0.y - 9.4, 7.6, 800, GOLD_L);
    fillRR(g, D0.x, D0.y, D0.w, F - D0.y, 4, 'rgba(205,232,245,.55)'); g.strokeStyle = GOLD; g.lineWidth = 4; rr(g, D0.x, D0.y, D0.w, F - D0.y, 4); g.stroke(); fillRR(g, D0.x - 4, F - 8, D0.w + 8, 8, 2, GOLD_D);
    var K0 = KIOSK; fillRR(g, K0.x - 8, K0.y + 18, 10, 14, 2, GOLD_D); text(g, 'WEB CHAT', K0.x + K0.w / 2, K0.y + K0.h + 13, 6.4, 800, PLUM_D, 'center'); shadowed(g, 8, 3, 0.2, function () { fillRR(g, K0.x - 3, K0.y - 3, K0.w + 6, K0.h + 6, 5, '#2A3142'); });
    /* the directory sign (guided flows) */
    shadowed(g, 10, 4, 0.18, function () { fillRR(g, DIR.x, DIR.y, DIR.w, DIR.h, 7, WALNUT); }); fillRR(g, DIR.x + 4, DIR.y + 4, DIR.w - 8, 18, 4, PLUM_D); text(g, 'HOW CAN WE HELP?', DIR.x + DIR.w / 2, DIR.y + 16, 7, 800, GOLD_L, 'center');
    FLOWS.forEach(function (f, i) { var y = DIR.y + 28 + i * 20; fillRR(g, DIR.x + 6, y, DIR.w - 12, 16, 3, '#FFF9EE'); text(g, f, DIR.x + 12, y + 11.2, 7.4, 800, INK); g.fillStyle = GOLD_D; g.beginPath(); g.moveTo(DIR.x + DIR.w - 16, y + 4); g.lineTo(DIR.x + DIR.w - 9, y + 8); g.lineTo(DIR.x + DIR.w - 16, y + 12); g.closePath(); g.fill(); });
    /* the guest book on its lectern (leads), the CRM card box */
    var B0 = BOOK; soft(g, B0.x + 32, F + 2, 36, 5, 0.25); fillRR(g, B0.x + 24, B0.y + 30, 16, F - B0.y - 30, 3, WALNUT); fillRR(g, B0.x + 6, F - 8, 52, 8, 3, '#6E452D');
    g.fillStyle = WALNUT; g.beginPath(); g.moveTo(B0.x - 4, B0.y + 34); g.lineTo(B0.x + 68, B0.y + 34); g.lineTo(B0.x + 62, B0.y + 8); g.lineTo(B0.x + 2, B0.y + 8); g.closePath(); g.fill();
    g.fillStyle = '#FFFDF8'; g.beginPath(); g.moveTo(B0.x + 4, B0.y + 30); g.lineTo(B0.x + 31, B0.y + 32); g.lineTo(B0.x + 31, B0.y + 6); g.lineTo(B0.x + 8, B0.y + 4); g.closePath(); g.fill(); g.beginPath(); g.moveTo(B0.x + 33, B0.y + 32); g.lineTo(B0.x + 60, B0.y + 30); g.lineTo(B0.x + 56, B0.y + 4); g.lineTo(B0.x + 33, B0.y + 6); g.closePath(); g.fill();
    fillRR(g, B0.x + 10, B0.y + 40, 44, 14, 3, PLUM); text(g, 'GUEST BOOK', B0.x + 32, B0.y + 50, 6.4, 800, GOLD_L, 'center');
    fillRR(g, B0.x + 44, B0.y + 62, 26, 20, 3, '#6E452D'); fillRR(g, B0.x + 46, B0.y + 58, 22, 6, 2, '#FFFFFF'); text(g, 'CRM', B0.x + 57, B0.y + 76, 6.4, 800, GOLD_L, 'center');
    /* the duty manager's hanging sign (hand-off) */
    g.strokeStyle = GOLD_D; g.lineWidth = 1.4; g.beginPath(); g.moveTo(HANG.x + 14, HANG.y); g.lineTo(HANG.x + 14, CEIL + 4); g.moveTo(HANG.x + HANG.w - 14, HANG.y); g.lineTo(HANG.x + HANG.w - 14, CEIL + 4); g.stroke();
    shadowed(g, 8, 3, 0.18, function () { fillRR(g, HANG.x, HANG.y, HANG.w, 34, 7, PLUM); }); text(g, 'DUTY MANAGER', HANG.x + HANG.w / 2, HANG.y + 15, 8.4, 800, GOLD_L, 'center'); text(g, 'hand-offs with context', HANG.x + HANG.w / 2, HANG.y + 27, 6.6, 700, '#E9D6E4', 'center');
    /* the lift (in-app) */
    var L0 = LIFT; fillRR(g, L0.x - 8, L0.y - 8, L0.w + 16, F - L0.y + 8, 6, GOLD); fillRR(g, L0.x, L0.y, L0.w, F - L0.y, 3, '#D9DEE6'); fillRR(g, L0.x - 4, L0.y - 40, L0.w + 8, 28, 6, PLUM_D);
    fillE(g, L0.x + 16, L0.y - 26, 7.4, 7.4, APP); chIcon(g, 'app', L0.x + 16, L0.y - 26, 7, '#FFFFFF'); text(g, 'IN-APP', L0.x + 28, L0.y - 22.4, 8, 800, GOLD_L);
    fillRR(g, L0.x + L0.w + 12, 300, 12, 26, 4, GOLD_D); fillE(g, L0.x + L0.w + 18, 308, 3, 3, '#FFFFFF'); fillE(g, L0.x + L0.w + 18, 318, 3, 3, '#FFFFFF');
    /* ---- beyond the frame: the fountain and the bench (left); the lounge (right) ---- */
    if (e.l < -440) { var fx2 = -580; soft(g, fx2, F + 4, 110, 10, 0.25); fillE(g, fx2, F - 10, 100, 18, '#E6DDD0'); fillE(g, fx2, F - 16, 92, 14, '#9BD3E6'); fillRR(g, fx2 - 10, F - 120, 20, 104, 4, '#E6DDD0'); fillE(g, fx2, F - 120, 40, 9, '#E6DDD0'); fillE(g, fx2, F - 124, 34, 6, '#9BD3E6');
      var bx = -820; fillRR(g, bx, F - 54, 150, 12, 4, WALNUT); fillRR(g, bx, F - 84, 150, 10, 4, '#A0704C'); [bx + 10, bx + 132].forEach(function (x) { fillRR(g, x, F - 42, 8, 42, 2, GOLD_D); }); }
    lounge(g);
    if (e.r > 1040) { var sf = 1060; soft(g, sf + 90, F + 2, 120, 8, 0.25); fillRR(g, sf, F - 96, 180, 50, 24, '#4E8A72'); fillRR(g, sf + 6, F - 60, 168, 40, 16, '#5E9C82'); fillRR(g, sf - 10, F - 74, 26, 60, 12, '#3E7360'); fillRR(g, sf + 164, F - 74, 26, 60, 12, '#3E7360');
      [sf + 40, sf + 100].forEach(function (x, i) { fillRR(g, x, F - 86, 40, 26, 10, i ? '#F1DB9A' : '#F3E7F0'); });
      fillRR(g, sf + 200, F - 40, 70, 8, 3, MARBLE); fillRR(g, sf + 230, F - 32, 8, 32, 2, GOLD_D); fillRR(g, sf + 212, F - 64, 14, 24, 3, '#FFFFFF'); fillE(g, sf + 219, F - 68, 9, 6, '#F0715A'); }
  }
  /* the lounge behind the title card: a gilt painting, three office clocks (faces here, hands live), the sofa, a side table, a floor lamp, a rug, a vase */
  function lounge(g) {
    var cx = LG.sofa;
    /* the rug on the marble, in perspective */
    g.fillStyle = PLUM_D; g.beginPath(); g.moveTo(cx - 190, F + 4); g.lineTo(cx + 190, F + 4); g.lineTo(cx + 230, F + 62); g.lineTo(cx - 230, F + 62); g.closePath(); g.fill();
    g.fillStyle = PLUM; g.beginPath(); g.moveTo(cx - 178, F + 8); g.lineTo(cx + 178, F + 8); g.lineTo(cx + 214, F + 57); g.lineTo(cx - 214, F + 57); g.closePath(); g.fill();
    g.strokeStyle = GOLD; g.lineWidth = 1.6; g.beginPath(); g.moveTo(cx - 166, F + 13); g.lineTo(cx + 166, F + 13); g.lineTo(cx + 198, F + 52); g.lineTo(cx - 198, F + 52); g.closePath(); g.stroke();
    g.fillStyle = 'rgba(241,219,154,.35)'; for (var d = -4; d <= 4; d++) { var dx = cx + d * 38, dy = F + 32; g.beginPath(); g.moveTo(dx, dy - 8); g.lineTo(dx + 10, dy); g.lineTo(dx, dy + 8); g.lineTo(dx - 10, dy); g.closePath(); g.fill(); }
    g.strokeStyle = GOLD_L; g.lineWidth = 1; for (var fr = -16; fr <= 16; fr++) { g.beginPath(); g.moveTo(cx + fr * 13.5, F + 62); g.lineTo(cx + fr * 13.8, F + 67); g.stroke(); }
    /* an inlaid marble medallion further out on the floor: a gold compass star in a plum ring */
    [[-250, 596, 1], [560, 600, 0.8]].forEach(function (m) { var mx = m[0], my = m[1], ms = m[2]; g.save(); g.translate(mx, my); g.scale(ms, ms * 0.2);
      g.strokeStyle = 'rgba(107,63,99,.45)'; g.lineWidth = 9; g.beginPath(); g.arc(0, 0, 120, 0, 7); g.stroke(); g.strokeStyle = 'rgba(201,162,74,.6)'; g.lineWidth = 3; g.beginPath(); g.arc(0, 0, 104, 0, 7); g.stroke();
      g.fillStyle = 'rgba(201,162,74,.38)'; g.beginPath(); for (var pt = 0; pt < 16; pt++) { var pa = pt * Math.PI / 8, pr = pt % 2 ? 30 : (pt % 4 ? 70 : 96); g.lineTo(Math.cos(pa) * pr, Math.sin(pa) * pr); } g.closePath(); g.fill(); fillE(g, 0, 0, 16, 16, 'rgba(107,63,99,.5)'); g.restore(); });
    /* the painting: the bay, in a gilt frame */
    var px = cx - 84, py = -40, pw = 168, ph = 92; shadowed(g, 10, 4, 0.18, function () { fillRR(g, px - 9, py - 9, pw + 18, ph + 18, 5, GOLD); });
    fillRR(g, px - 4, py - 4, pw + 8, ph + 8, 3, GOLD_D); var sk = g.createLinearGradient(0, py, 0, py + ph); sk.addColorStop(0, '#9FD6F5'); sk.addColorStop(0.62, '#E6F5FC'); sk.addColorStop(0.62, '#5FB4D9'); sk.addColorStop(1, '#3E95C4'); g.fillStyle = sk; g.fillRect(px, py, pw, ph);
    fillE(g, px + 30, py + 22, 10, 10, '#FFF1B8'); g.fillStyle = '#F2E2C0'; g.beginPath(); g.moveTo(px, py + ph); g.quadraticCurveTo(px + 60, py + ph - 26, px + 110, py + ph); g.closePath(); g.fill();
    g.strokeStyle = '#8A6A48'; g.lineWidth = 3; g.beginPath(); g.moveTo(px + 50, py + ph - 14); g.quadraticCurveTo(px + 44, py + 40, px + 58, py + 24); g.stroke();
    [[-1, 0], [1, 0.2], [-0.5, -0.8], [0.6, 0.9]].forEach(function (L) { g.fillStyle = '#3FA56C'; g.beginPath(); g.moveTo(px + 58, py + 24); g.quadraticCurveTo(px + 58 + L[0] * 16, py + 14 + L[1] * 4, px + 58 + L[0] * 30, py + 30 + L[1] * 4); g.quadraticCurveTo(px + 58 + L[0] * 14, py + 22, px + 58, py + 24); g.fill(); });
    g.fillStyle = '#FFFFFF'; g.beginPath(); g.moveTo(px + 120, py + 58); g.lineTo(px + 132, py + 40); g.lineTo(px + 134, py + 58); g.closePath(); g.fill(); fillRR(g, px + 116, py + 58, 22, 4, 2, PLUM);
    /* three clocks: Singapore, Taguig, Ho Chi Minh City (the hands are live) */
    fillRR(g, cx - 120, 104, 240, 6, 3, GOLD_D);
    [['SINGAPORE', -80], ['TAGUIG', 0], ['HO CHI MINH', 80]].forEach(function (c) { var x = cx + c[1]; shadowed(g, 8, 3, 0.16, function () { fillE(g, x, 146, 27, 27, GOLD); }); fillRR(g, x - 30, 180, 60, 14, 4, PLUM); text(g, c[0], x, 190.4, c[0].length > 8 ? 6 : 6.8, 800, GOLD_L, 'center'); });
    /* wall sconces either side of the painting */
    [cx - 128, cx + 128].forEach(function (x) { fillRR(g, x - 2, 10, 4, 26, 2, GOLD_D); g.fillStyle = '#FFF4DA'; g.beginPath(); g.moveTo(x - 12, 10); g.lineTo(x + 12, 10); g.lineTo(x + 8, -8); g.lineTo(x - 8, -8); g.closePath(); g.fill(); fillRR(g, x - 13, 8, 26, 4, 2, GOLD); });
    /* the sofa: back and arms here; the guest sits on its seat */
    soft(g, cx, F + 4, 150, 8, 0.26); fillRR(g, cx - 128, F - 112, 256, 76, 30, '#4E8A72'); [-1, 0, 1].forEach(function (b) { fillRR(g, cx + b * 78 - 36, F - 104, 72, 52, 18, '#5E9C82'); g.fillStyle = 'rgba(255,255,255,.14)'; g.fillRect(cx + b * 78 - 26, F - 98, 52, 3); });
    fillRR(g, cx - 120, F - 50, 240, 30, 12, '#5E9C82'); fillRR(g, cx - 120, F - 24, 240, 10, 4, '#3E7360');
    [-1, 1].forEach(function (d) { fillRR(g, cx + d * 128 - 18, F - 78, 36, 66, 14, '#3E7360'); fillRR(g, cx + d * 128 - 14, F - 76, 28, 10, 5, '#4E8A72'); fillRR(g, cx + d * 112 - 4, F - 14, 8, 14, 2, GOLD_D); });
    fillRR(g, cx + 50, F - 92, 44, 30, 12, GOLD_L); fillRR(g, cx + 58, F - 86, 28, 4, 2, 'rgba(156,122,46,.4)');
    /* the side table with a teapot and cups (steam is live), the floor lamp, a tall vase */
    var tx = LG.tbl; soft(g, tx, F + 3, 40, 5, 0.24); fillRR(g, tx - 3, F - 54, 6, 54, 2, GOLD_D); fillRR(g, tx - 20, F - 3, 40, 4, 2, GOLD_D); fillE(g, tx, F - 56, 32, 7, MARBLE); g.strokeStyle = GOLD; g.lineWidth = 1.4; g.beginPath(); g.ellipse(tx, F - 56, 32, 7, 0, 0, 7); g.stroke();
    fillE(g, tx - 8, F - 70, 13, 11, '#FFFFFF'); fillRR(g, tx - 12, F - 84, 8, 5, 2, '#FFFFFF'); fillE(g, tx - 8, F - 82, 4, 2.4, GOLD); g.strokeStyle = '#FFFFFF'; g.lineWidth = 3; g.beginPath(); g.moveTo(tx + 3, F - 72); g.quadraticCurveTo(tx + 12, F - 78, tx + 14, F - 82); g.stroke();
    g.strokeStyle = '#E3DCD2'; g.lineWidth = 2; g.beginPath(); g.arc(tx - 21, F - 70, 4, Math.PI * 0.5, Math.PI * 1.5); g.stroke(); fillRR(g, tx - 10, F - 72, 4, 3, 1, GOLD); fillRR(g, tx + 14, F - 64, 10, 8, 2, '#FFFFFF'); fillRR(g, tx + 12, F - 58, 14, 2, 1, '#E3DCD2');
    var lx = LG.lamp; soft(g, lx, F + 3, 26, 4, 0.24); fillE(g, lx, F - 2, 18, 4, GOLD_D); fillRR(g, lx - 2, F - 150, 4, 148, 2, GOLD_D);
    g.fillStyle = '#FFF4DA'; g.beginPath(); g.moveTo(lx - 26, F - 150); g.lineTo(lx + 26, F - 150); g.lineTo(lx + 18, F - 186); g.lineTo(lx - 18, F - 186); g.closePath(); g.fill(); fillRR(g, lx - 27, F - 152, 54, 4, 2, GOLD); fillRR(g, lx - 19, F - 188, 38, 3, 1.5, GOLD);
    var vx = -312; soft(g, vx, F + 3, 26, 4, 0.24); g.fillStyle = PLUM; g.beginPath(); g.moveTo(vx - 12, F); g.quadraticCurveTo(vx - 26, F - 40, vx - 10, F - 70); g.lineTo(vx + 10, F - 70); g.quadraticCurveTo(vx + 26, F - 40, vx + 12, F); g.closePath(); g.fill(); fillRR(g, vx - 13, F - 74, 26, 6, 3, GOLD);
    g.strokeStyle = '#3FA56C'; g.lineWidth = 2; [[-26, -150], [-8, -170], [10, -160], [24, -140], [0, -130]].forEach(function (s) { g.beginPath(); g.moveTo(vx, F - 72); g.quadraticCurveTo(vx + s[0] * 0.4, F - 110, vx + s[0], F + s[1] + 10); g.stroke(); });
    [[-26, -150, '#F7D1DC'], [-8, -170, '#FFFFFF'], [10, -160, '#FFE7A3'], [24, -140, '#F7D1DC'], [0, -130, '#F0715A']].forEach(function (f) { for (var p = 0; p < 5; p++) { var a = p * 1.26; fillE(g, vx + f[0] + Math.cos(a) * 5, F + f[1] + Math.sin(a) * 5, 4, 4, f[2]); } fillE(g, vx + f[0], F + f[1], 2.4, 2.4, '#F2B233'); });
  }
  function paintFront(g, ext) {
    /* the duty manager's podium (covers his lower half) */
    shadowed(g, 10, 3, 0.18, function () { fillRR(g, POD.x, POD.y + 6, POD.w, F - POD.y - 6, 6, WALNUT); }); fillRR(g, POD.x - 6, POD.y, POD.w + 12, 10, 4, MARBLE); marbleVeins(g, POD.x - 6, POD.y, POD.w + 12, 10, 3);
    g.strokeStyle = GOLD; g.lineWidth = 1.6; rr(g, POD.x + 8, POD.y + 18, POD.w - 16, F - POD.y - 32, 5); g.stroke(); fillE(g, POD.x + POD.w / 2, POD.y + 50, 12, 12, PLUM); key(g, POD.x + POD.w / 2 - 3, POD.y + 48, -0.7); key(g, POD.x + POD.w / 2 + 3, POD.y + 48, 0.7);
    fillRR(g, POD.x + 8, POD.y - 8, 34, 8, 2, '#FFFFFF'); g.fillStyle = '#C9C2DA'; g.fillRect(POD.x + 12, POD.y - 6, 24, 1.5); fillRR(g, POD.x + POD.w - 30, POD.y - 12, 22, 12, 3, '#2A3142'); fillRR(g, POD.x + POD.w - 28, POD.y - 16, 18, 5, 2.5, '#3A4458');
  }
  function paintFore(g, ext) {
    /* the brass luggage trolley, a marble planter, the palm, an armchair */
    var tx = 132; g.save(); g.translate(171, 708); g.scale(0.68, 0.68); g.translate(-(tx + 52), -738); soft(g, tx + 50, 742, 70, 6, 0.25); fillRR(g, tx, 718, 104, 10, 4, GOLD_D); [tx + 12, tx + 92].forEach(function (x) { fillE(g, x, 738, 9, 9, '#2A3142'); fillE(g, x, 738, 3.5, 3.5, GOLD_L); });
    g.strokeStyle = GOLD; g.lineWidth = 4; g.beginPath(); g.moveTo(tx + 6, 718); g.lineTo(tx + 6, 610); g.moveTo(tx + 98, 718); g.lineTo(tx + 98, 610); g.stroke(); g.beginPath(); g.arc(tx + 52, 610, 46, Math.PI, 0); g.stroke();
    fillRR(g, tx + 12, 662, 60, 54, 8, PLUM); fillRR(g, tx + 24, 652, 36, 10, 4, PLUM_D); fillRR(g, tx + 60, 676, 34, 40, 6, '#F0715A'); fillRR(g, tx + 18, 640, 50, 24, 6, '#3167CA'); fillRR(g, tx + 30, 680, 18, 4, 2, GOLD_L); g.restore();
    g.save(); g.translate(0, -34); soft(g, 372, 744, 64, 6, 0.25); fillRR(g, 316, 702, 112, 40, 8, MARBLE); marbleVeins(g, 316, 702, 112, 40, 7); fillRR(g, 312, 698, 120, 8, 4, GOLD);
    for (var f = 0; f < 9; f++) { var fx = 326 + f * 11.5, fy = 690 - (f % 3) * 6; fillE(g, fx, fy + 6, 6, 9, '#3FA56C'); fillE(g, fx, fy - 2, 5.4, 5.4, ['#FFFFFF', '#F7D1DC', '#FFE7A3'][f % 3]); fillE(g, fx, fy - 2, 1.8, 1.8, '#F2B233'); } g.restore();
    /* a velvet rope on brass posts under the title card; a 'chat with us' QR stand under the caption */
    g.save(); g.translate(0, -28); var SP = [-430, -330, -230]; g.strokeStyle = PLUM; g.lineWidth = 5; g.lineCap = 'round'; for (var sr = 0; sr < SP.length - 1; sr++) { g.beginPath(); g.moveTo(SP[sr] + 4, 668); g.quadraticCurveTo((SP[sr] + SP[sr + 1]) / 2, 694, SP[sr + 1] - 4, 668); g.stroke(); }
    SP.forEach(function (x) { soft(g, x, 734, 24, 4, 0.25); fillE(g, x, 730, 16, 5, GOLD_D); fillRR(g, x - 3, 666, 6, 64, 3, GOLD); fillE(g, x, 664, 7, 7, GOLD_L); fillE(g, x - 2, 662, 2.4, 2, '#FFFFFF'); }); g.restore();
    g.save(); g.translate(656, 708); g.scale(0.74, 0.74); g.translate(-656, -740); var qx = 656; soft(g, qx, 744, 30, 5, 0.25); fillE(g, qx, 740, 22, 5, GOLD_D); fillRR(g, qx - 3, 696, 6, 44, 3, GOLD); shadowed(g, 8, 3, 0.18, function () { fillRR(g, qx - 34, 648, 68, 52, 8, PLUM); });
    fillRR(g, qx - 29, 653, 30, 30, 3, '#FFFFFF'); for (var qi = 0; qi < 25; qi++) { if (hash(qi * 3.7) > 0.5 || qi === 0 || qi === 4 || qi === 20) fillRR(g, qx - 27 + (qi % 5) * 5.2, 655 + Math.floor(qi / 5) * 5.2, 4.6, 4.6, 0.6, INK); }
    fillE(g, qx + 17, 662, 9, 9, WA); chIcon(g, 'wa', qx + 17, 662, 8.6, '#FFFFFF'); text(g, 'SCAN', qx + 17, 682, 6.4, 800, GOLD_L, 'center'); text(g, 'CHAT WITH US', qx, 694, 6.4, 800, GOLD_L, 'center'); g.restore();
    /* a clipped bay topiary in a gold-rimmed pot, right of the caption */
    var tpx = 952; soft(g, tpx, 712, 30, 5, 0.25); fillRR(g, tpx - 20, 676, 40, 34, 6, PLUM); fillRR(g, tpx - 23, 672, 46, 8, 4, GOLD); fillRR(g, tpx - 2, 636, 4, 38, 2, '#7A6248');
    fillE(g, tpx, 626, 27, 26, '#2E9E5E'); fillE(g, tpx - 8, 618, 15, 13, '#3FAE6E'); fillE(g, tpx + 9, 632, 10, 8, '#3FAE6E'); fillE(g, tpx - 12, 612, 4, 3, 'rgba(255,255,255,.35)');
    g.save(); g.translate(0, -30); if (ext.r > 1060) { var ac = 1150; soft(g, ac + 50, 744, 70, 6, 0.25); fillRR(g, ac, 650, 100, 90, 24, PLUM); fillRR(g, ac + 10, 690, 80, 34, 12, '#8A5784'); fillRR(g, ac - 8, 676, 22, 64, 10, PLUM_D); fillRR(g, ac + 86, 676, 22, 64, 10, PLUM_D); }
    g.restore(); g.save(); g.translate(0, -32); if (ext.l < -300) { var lx = -560; soft(g, lx + 50, 744, 70, 6, 0.25); fillRR(g, lx, 700, 46, 40, 8, '#F0715A'); fillRR(g, lx + 40, 690, 54, 50, 8, '#3167CA'); } g.restore();
  }

  /* ---------------- live ---------------- */
  var TAP = {}, PLANES = [], SCROLL = { t: -9 };
  function paintWindow(g, t, par, S) {
    var e = S.ext; S.C = runAt(t);
    for (var c = 0; c < 4; c++) { var sp = 4 + c * 2, span = e.r - e.l + 400, x = e.l - 200 + ((hash(c + 5) * span + t * sp) % span), y = -10 + c * 32; K.cloud(g, x, y, 0.18 + hash(c) * 0.1); }
    g.strokeStyle = 'rgba(40,60,90,.5)'; g.lineWidth = 1.5; g.lineCap = 'round';
    for (var b = 0; b < 3; b++) { var bsp = e.r - e.l + 300, bx = e.l - 100 + ((t * (14 + b * 4) + hash(b + 11) * bsp) % bsp), by = 30 + b * 34 + Math.sin(t * 0.8 + b) * 5, fl = Math.sin(t * 9 + b * 2) * 4;
      g.beginPath(); g.moveTo(bx - 6, by - fl); g.quadraticCurveTo(bx - 3, by - 3, bx, by); g.quadraticCurveTo(bx + 3, by - 3, bx + 6, by - fl); g.stroke(); }
  }
  function bot(g, t, S) {
    var C = S.C, u = C.u, R = C.R, x = BOT.x, B = S.B || (S.B = {}), tap = TAP.bot && t - TAP.bot < 2.6 ? (t - TAP.bot) / 2.6 : -1;
    var srcX = R.who === 'g1' ? G1.x : R.who === 'g2' ? G2.x : KIOSK.x + 20, talk = (u > 0.32 && u < 0.58) || tap >= 0, think = u > 0.14 && u < 0.32;
    var look = tap >= 0 ? Math.sin(tap * 12) * 0.5 : think ? (R.fetch === 'parcel' || R.fetch === 'folio' ? 0.6 : R.fetch === 'guide' ? -0.8 : -0.3) : clamp((srcX - x) / 140, -1, 1);
    B.look = lerp(B.look || 0, look, 0.12);
    /* the hands: listening, fetching, handing over, ringing the bell */
    var hl = [x - 46, 352], hr = [x + 46, 352];
    if (think) { var fu = smooth(clamp((u - 0.16) / 0.1, 0, 1)) * (1 - smooth(clamp((u - 0.28) / 0.04, 0, 1)));
      if (R.fetch === 'parcel') hr = [lerp(x + 46, SHELF.x + 30, fu), lerp(352, SHELF.y + 40, fu)]; else if (R.fetch === 'folio') hr = [lerp(x + 46, SHELF.x + 40, fu), lerp(352, SHELF.y + 90, fu)];
      else if (R.fetch === 'guide') hl = [lerp(x - 46, x - 70, fu), lerp(352, 300, fu)]; else hl = [x - 30, 320 + Math.sin(t * 6) * 4]; }
    if (R.act === 'key' && u > 0.56 && u < 0.64) { var ku = Math.sin((u - 0.56) / 0.08 * Math.PI); hl = [lerp(x - 46, KEYS.x + 50, ku), lerp(352, KEYS.y + 70, ku)]; }
    if (R.act === 'hand' && u > 0.64 && u < 0.72) { var bu = Math.sin((u - 0.64) / 0.08 * Math.PI); hl = [lerp(x - 46, BELL.x - 2, bu), lerp(352, BELL.y - 6, bu)]; hr = [x + 70, 330 - bu * 20]; }
    if (talk && !think) { hr = [x + 56 + Math.sin(t * 5) * 8, 336 + Math.cos(t * 4) * 6]; }
    if (tap >= 0) { hr = [x + 34, 214 + Math.sin(tap * Math.PI) * -6]; hl = [x - 70 + Math.sin(t * 12) * 6, 300]; }
    B.hl = hl; B.hr = hr;
    g.save(); g.beginPath(); g.rect(x - 160, -200, 320, DESK.y + 2 + 200); g.clip();
    /* body: a plum concierge jacket, gold buttons, a bow tie */
    var br = Math.sin(t * 2) * 1.2;
    fillRR(g, x - 50, 296 + br, 100, 110, 32, PLUM); g.fillStyle = '#FFFFFF'; g.beginPath(); g.moveTo(x - 18, 298 + br); g.lineTo(x, 340); g.lineTo(x + 18, 298 + br); g.closePath(); g.fill();
    g.fillStyle = PLUM_D; [-1, 1].forEach(function (d) { g.beginPath(); g.moveTo(x + d * 18, 298 + br); g.lineTo(x + d * 2, 344); g.lineTo(x + d * 14, 336); g.lineTo(x + d * 34, 304 + br); g.closePath(); g.fill(); });
    g.fillStyle = GOLD; g.beginPath(); g.moveTo(x, 306); g.lineTo(x - 11, 300); g.lineTo(x - 11, 312); g.closePath(); g.moveTo(x, 306); g.lineTo(x + 11, 300); g.lineTo(x + 11, 312); g.closePath(); g.fill(); fillE(g, x, 306, 3, 3, GOLD_D);
    [352, 370].forEach(function (y) { fillE(g, x - 8, y, 2.6, 2.6, GOLD); fillE(g, x + 8, y, 2.6, 2.6, GOLD); }); fillRR(g, x + 16, 322, 26, 9, 2, GOLD_L); text(g, 'ASSISTANT', x + 29, 328.6, 4, 800, PLUM_D, 'center');
    /* arms in plum sleeves, white gloves */
    [[-1, hl], [1, hr]].forEach(function (a) { var d = a[0], h = a[1], sx = x + d * 42, sy = 312 + br, r = K.ik(sx, sy, h[0], h[1], 36, 34, d);
      limb(g, [[sx, sy], r.e, r.h], 15, PLUM_D); fillE(g, r.h[0], r.h[1], 8, 8, '#FFFFFF'); fillE(g, r.h[0] + 2, r.h[1] - 2, 3, 2.4, 'rgba(0,0,0,.06)'); });
    /* neck, the screen head, the pillbox cap */
    fillRR(g, x - 10, 284, 20, 16, 4, '#9AA6BC');
    var hy = 248 + Math.sin(t * 2.3) * 1.4, tilt = B.look * 0.06; g.save(); g.translate(x, hy); g.rotate(tilt);
    fillRR(g, -44, -42, 88, 84, 22, '#F7F3EE'); fillRR(g, -36, -34, 72, 68, 16, SCREEN);
    var lx = B.look * 8, blink = ((t + 0.4) % 3.3) < 0.12, happy = (u > 0.66 && u < 0.92) || tap >= 0;
    if (think && R.fetch !== 'none') { for (var i = 0; i < 3; i++) fillE(g, -12 + i * 12, -4, 3 + Math.max(0, Math.sin(t * 8 - i)) * 2, 3 + Math.max(0, Math.sin(t * 8 - i)) * 2, TEAL); }
    else if (happy) { g.strokeStyle = TEAL; g.lineWidth = 4; g.lineCap = 'round'; [-1, 1].forEach(function (d) { g.beginPath(); g.arc(d * 14 + lx, -2, 7, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); }); }
    else if (blink) { g.fillStyle = TEAL; g.fillRect(-20 + lx, -4, 12, 3); g.fillRect(8 + lx, -4, 12, 3); }
    else { fillRR(g, -20 + lx, -14, 11, 18, 5, TEAL); fillRR(g, 9 + lx, -14, 11, 18, 5, TEAL); fillE(g, -16 + lx, -10, 2.4, 2.4, '#FFFFFF'); fillE(g, 13 + lx, -10, 2.4, 2.4, '#FFFFFF'); }
    if (talk) { for (var m = 0; m < 5; m++) { var mh = 2 + Math.abs(Math.sin(t * 14 + m * 1.3)) * 7; fillRR(g, -12 + m * 6 + lx * 0.5, 16 - mh / 2, 3.4, mh, 1.7, TEAL); } }
    else { g.strokeStyle = TEAL; g.lineWidth = 2.6; g.beginPath(); g.arc(lx * 0.5, 12, 6, 0.3, Math.PI - 0.3); g.stroke(); }
    fillE(g, -22 + lx, 10, 4, 2.4, 'rgba(255,120,160,.45)'); fillE(g, 22 + lx, 10, 4, 2.4, 'rgba(255,120,160,.45)');
    [-1, 1].forEach(function (d) { fillRR(g, d * 44 - 4, -10, 8, 20, 4, '#E3DCD2'); fillE(g, d * 48, 0, 2.6, 2.6, talk && (t % 0.4) < 0.2 ? TEAL : '#9AA6BC'); });
    g.save(); var tipA = tap >= 0 ? -Math.sin(Math.min(1, tap * 2.2) * Math.PI) * 0.45 : 0; g.translate(30, -42); g.rotate(tipA); g.translate(-30, 0);
    fillRR(g, -30, -22, 60, 22, 6, PLUM); fillRR(g, -30, -9, 60, 6, 2, GOLD); fillE(g, 0, -13, 6, 6, GOLD_L); key(g, -1.5, -15, -0.7); g.restore();
    g.restore();
    g.restore();
    /* the desk-top things in front of the assistant: the bell, the guide, a pen */
    var ring = TAP.bell && t - TAP.bell < 1 ? (t - TAP.bell) : (R.act === 'hand' && u > 0.68 && u < 0.76 ? (u - 0.68) * CYC : -1);
    var bs = ring >= 0 && ring < 0.6 ? Math.sin(ring * 40) * 0.12 * (1 - ring / 0.6) : 0; g.save(); g.translate(BELL.x, BELL.y + 4); g.rotate(bs); fillE(g, 0, 0, 13, 3.4, GOLD_D); g.fillStyle = GOLD; g.beginPath(); g.arc(0, 0, 11, Math.PI, 0); g.fill(); fillE(g, -3, -6, 3.4, 2.4, 'rgba(255,255,255,.5)'); fillRR(g, -1.6, -15, 3.2, 5, 1.6, GOLD_D); g.restore();
    if (ring >= 0 && ring < 1) { g.strokeStyle = 'rgba(201,162,74,' + (1 - ring).toFixed(2) + ')'; g.lineWidth = 1.8; for (var w = 0; w < 3; w++) { g.beginPath(); g.arc(BELL.x, BELL.y - 6, 12 + ring * 26 + w * 8, -2.6, -0.5); g.stroke(); } }
  }
  function paintLive(g, t, now, S) {
    var e = S.ext, C = S.C, u = C.u, R = C.R, x;
    /* ceiling fans */
    [230, 760, -420, 1230].forEach(function (fx) { if (fx < e.l - 80 || fx > e.r + 80) return; var a = t * 2.6 + fx; g.save(); g.translate(fx, -64); g.scale(1, 0.22);
      for (var b = 0; b < 4; b++) { g.save(); g.rotate(a + b * Math.PI / 2); fillRR(g, 8, -9, 58, 18, 9, b % 2 ? '#8A5A3B' : '#A0704C'); g.restore(); } g.restore(); fillE(g, fx, -64, 10, 6, GOLD); fillRR(g, fx - 6, -60, 12, 7, 3, GOLD_D); });
    /* the greeting medallions: they light in turn; the guest's language stays lit while the assistant answers */
    var cur = (u > 0.1 && u < 0.92) ? R.lang : Math.floor(t * 0.8) % 5; MED.xs.forEach(function (mx, i) { var on = i === cur, hot = S.hot === 'languages' && Math.floor(t * 1.4) % 5 === i;
      if (on || hot) fillE(g, mx, MED.y, MED.r, MED.r, on && R.lang === i && u > 0.1 && u < 0.92 ? PLUM : '#F3E7F0'); text(g, LANGS[i][0], mx, MED.y + 3.4, LANGS[i][0].length > 6 ? 6.2 : 8, 800, (on && R.lang === i && u > 0.1 && u < 0.92) ? GOLD_L : PLUM_D, 'center'); });
    /* the WhatsApp neon flickers on WhatsApp chats */
    var waOn = R.ch === 'wa' && u < 0.6, fl = waOn ? (0.8 + 0.2 * Math.sin(t * 20)) : 0.92; g.save(); g.globalAlpha = fl; if (waOn) { g.fillStyle = 'rgba(37,211,102,.16)'; rr(g, NEON.x - 6, NEON.y - 6, NEON.w + 12, NEON.h + 12, 18); g.fill(); }
    fillE(g, NEON.x + 34, NEON.y + 37, 24, 24, WA); chIcon(g, 'wa', NEON.x + 34, NEON.y + 37, 22, '#FFFFFF'); text(g, 'WhatsApp', NEON.x + 64, NEON.y + 34, 12, 800, WA_D); text(g, 'chat with us', NEON.x + 64, NEON.y + 48, 8, 700, '#2E8B57'); g.restore();
    /* the revolving door turns (faster on a web chat); the kiosk screen shows the chat */
    var D0 = DOOR, dsp = R.ch === 'web' && u < 0.5 ? 1.6 : 0.4, ang = t * dsp; g.save(); g.beginPath(); g.rect(D0.x + 3, D0.y + 3, D0.w - 6, F - D0.y - 6); g.clip();
    for (var wg = 0; wg < 4; wg++) { var an = ang + wg * Math.PI / 2, cx = D0.x + D0.w / 2 + Math.sin(an) * (D0.w / 2 - 6), dep = Math.cos(an); g.strokeStyle = 'rgba(201,162,74,' + (0.45 + 0.4 * (dep + 1) / 2).toFixed(2) + ')'; g.lineWidth = 3 + dep; g.beginPath(); g.moveTo(cx, D0.y + 6); g.lineTo(cx, F - 6); g.stroke();
      g.fillStyle = 'rgba(255,255,255,' + (0.08 + 0.12 * (dep + 1) / 2).toFixed(2) + ')'; g.fillRect(Math.min(cx, D0.x + D0.w / 2), D0.y + 6, Math.abs(cx - D0.x - D0.w / 2), F - D0.y - 12); }
    fillRR(g, D0.x + D0.w / 2 - 3, D0.y, 6, F - D0.y, 2, GOLD_D); g.restore();
    var K0 = KIOSK, webOn = R.ch === 'web' && u < 0.92; fillRR(g, K0.x, K0.y, K0.w, K0.h, 3, '#FFFFFF'); fillRR(g, K0.x, K0.y, K0.w, 9, 3, WEB); chIcon(g, 'web', K0.x + 6, K0.y + 4.5, 4, '#FFFFFF');
    if (webOn) { fillRR(g, K0.x + 12, K0.y + 13, 25, 7, 3.5, '#DCE8FA'); if (u > 0.36) fillRR(g, K0.x + 3, K0.y + 24, 28, 7, 3.5, PLUM_L); if (u > 0.5) fillRR(g, K0.x + 3, K0.y + 34, 20, 7, 3.5, PLUM_L); }
    else { fillRR(g, K0.x + 4, K0.y + 16, 32, 6, 3, '#EEF2F7'); text(g, 'Ask us', K0.x + 20, K0.y + 36, 6.6, 800, WEB, 'center'); fillE(g, K0.x + 20, K0.y + 44, 2 + Math.abs(Math.sin(t * 3)) * 1.4, 2 + Math.abs(Math.sin(t * 3)) * 1.4, WEB); }
    /* the key board: one key leaves for a booking */
    var keyGone = R.act === 'key' && u > 0.6; for (var kr = 0; kr < 3; kr++) for (var kc = 0; kc < 4; kc++) { if (keyGone && kr === 1 && kc === 2) continue; var sw = Math.sin(t * 1.4 + kr + kc * 1.7) * 0.06; key(g, KEYS.x + 16 + kc * 21, KEYS.y + 46 + kr * 27, sw, String(10 + kr * 4 + kc + 1)); }
    if (S.hot === 'lookups') { g.strokeStyle = 'rgba(201,162,74,.9)'; g.lineWidth = 2; var hk = Math.floor(t * 2) % 3; rr(g, hk === 0 ? KEYS.x + 4 : SHELF.x + 4, hk === 2 ? SHELF.y + 52 : KEYS.y + 20, hk === 0 ? KEYS.w - 8 : SHELF.w - 8, hk === 0 ? KEYS.h - 24 : 48, 4); g.stroke(); }
    /* the order shelf: parcels; the one being looked up lifts */
    [[0, '#F0715A', '#FFFFFF'], [1, '#3167CA', GOLD_L], [2, '#F2D58C', PLUM]].forEach(function (p) { var lift = R.fetch === 'parcel' && p[0] === 1 && u > 0.2 && u < 0.32 ? -6 : 0, px = SHELF.x + 10 + p[0] * 29; parcel(g, px, SHELF.y + 26 + lift, 24, 20, p[1], p[2]);
      if (R.fetch === 'parcel' && p[0] === 1 && u > 0.18 && u < 0.6) { g.strokeStyle = 'rgba(95,224,208,.9)'; g.lineWidth = 1.6; rr(g, px - 3, SHELF.y + 23 + lift, 30, 26, 4); g.stroke(); } });
    if (R.fetch === 'folio' && u > 0.18 && u < 0.6) { g.strokeStyle = 'rgba(95,224,208,.9)'; g.lineWidth = 1.6; rr(g, SHELF.x + 30, SHELF.y + 68, 24, 32, 3); g.stroke(); }
    /* the house guide: a leaflet leaves its slot and flies to the assistant as a paper plane */
    if (R.fetch === 'guide' && u > 0.15 && u < 0.3) { var pu = smooth((u - 0.15) / 0.15), px2 = lerp(RACK.x + RACK.w / 2, BOT.x - 70, pu), py = lerp(RACK.y + 30, 290, pu) - Math.sin(pu * Math.PI) * 70; CO.plane(g, px2, py, 1.3, -0.3 + pu * 0.5, '#FFFFFF', WEB); g.fillStyle = 'rgba(49,103,202,.35)'; fillE(g, px2 - 14, py + 3, 3, 1.4, 'rgba(49,103,202,.35)'); }
    if (R.fetch === 'guide' && u > 0.12 && u < 0.4) { g.strokeStyle = 'rgba(95,224,208,.9)'; g.lineWidth = 1.8; rr(g, RACK.x + 7, RACK.y + 8, RACK.w - 14, 38, 3); g.stroke(); }
    PLANES = PLANES.filter(function (p) { return t - p.t0 < 1.6; }); PLANES.forEach(function (p) { var pu2 = (t - p.t0) / 1.6; if (pu2 < 0) return; var qx = lerp(p.x, BOT.x - 40, smooth(pu2)), qy = lerp(p.y, 270, smooth(pu2)) - Math.sin(pu2 * Math.PI) * 60 - p.i * 10; CO.plane(g, qx, qy, 1.2, -0.2 + p.i * 0.2, '#FFFFFF', [WEB, GOLD, WA][p.i % 3]); });
    /* the directory sign: the guided flow for this chat lights */
    if (u > 0.1 && u < 0.95) { var fy = DIR.y + 28 + R.flow * 20; fillRR(g, DIR.x + 6, fy, DIR.w - 12, 16, 3, GOLD); text(g, FLOWS[R.flow], DIR.x + 12, fy + 11.2, 7.4, 800, PLUM_D); g.fillStyle = PLUM_D; g.beginPath(); g.moveTo(DIR.x + DIR.w - 16 + Math.sin(t * 8) * 2, fy + 4); g.lineTo(DIR.x + DIR.w - 9 + Math.sin(t * 8) * 2, fy + 8); g.lineTo(DIR.x + DIR.w - 16 + Math.sin(t * 8) * 2, fy + 12); g.closePath(); g.fill(); }
    if (S.hot === 'flows') { var hf = Math.floor(t * 1.5) % 4; g.strokeStyle = PLUM; g.lineWidth = 2; rr(g, DIR.x + 6, DIR.y + 28 + hf * 20, DIR.w - 12, 16, 3); g.stroke(); }
    /* the guest book: the lead is written in; the card drops into the CRM box */
    var B0 = BOOK, writing = R.act === 'hand' && u > 0.56 && u < 0.68, wu = writing ? (u - 0.56) / 0.12 : (R.act === 'hand' && u >= 0.68 ? 1 : 0);
    g.strokeStyle = 'rgba(78,44,72,.75)'; g.lineWidth = 1.1; for (var ln = 0; ln < 4; ln++) { var lw = clamp(wu * 4 - ln, 0, 1); if (lw <= 0) { g.strokeStyle = 'rgba(160,150,170,.35)'; g.beginPath(); g.moveTo(B0.x + 36, B0.y + 11 + ln * 5); g.lineTo(B0.x + 54, B0.y + 11 + ln * 5); g.stroke(); g.strokeStyle = 'rgba(78,44,72,.75)'; continue; }
      g.beginPath(); for (var q = 0; q <= 10 * lw; q++) g.lineTo(B0.x + 36 + q * 1.8, B0.y + 11 + ln * 5 + Math.sin(q * 2.2) * 1.1); g.stroke(); }
    var qx2 = writing ? B0.x + 36 + ((wu * 4) % 1) * 18 : B0.x + 58, qy2 = writing ? B0.y + 6 + Math.floor(wu * 4) * 5 : B0.y - 2; g.save(); g.translate(qx2, qy2); g.rotate(-0.6 + (writing ? Math.sin(t * 20) * 0.08 : 0)); g.fillStyle = '#FFFFFF'; g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(-4, -18, 2, -30); g.quadraticCurveTo(6, -16, 0, 0); g.fill(); g.strokeStyle = GOLD_D; g.lineWidth = 1; g.beginPath(); g.moveTo(0, 2); g.lineTo(1, -26); g.stroke(); g.restore();
    if (R.act === 'hand' && u > 0.64 && u < 0.76) { var cu = smooth((u - 0.64) / 0.12); g.save(); g.translate(lerp(B0.x + 40, B0.x + 57, cu), lerp(B0.y - 10, B0.y + 60, cu) - Math.sin(cu * Math.PI) * 26); g.rotate(cu * 0.4); fillRR(g, -11, -7, 22, 14, 2, '#FFFFFF'); fillRR(g, -11, -7, 22, 4, 2, WA); g.fillStyle = '#C9C2DA'; g.fillRect(-8, 0, 14, 1.5); g.fillRect(-8, 3, 10, 1.5); g.restore(); }
    /* the lift: doors part now and then; the in-app sign pulses on in-app chats */
    var L0 = LIFT, op = Math.max(0, Math.sin(((t + 3) % 16) / 16 * Math.PI * 2) * 1.6 - 0.6) * (L0.w / 2 - 6);
    g.save(); g.beginPath(); g.rect(L0.x, L0.y, L0.w, F - L0.y); g.clip(); fillRR(g, L0.x, L0.y, L0.w, F - L0.y, 2, '#F6E7D3'); fillE(g, L0.x + L0.w / 2, L0.y + 60, 20, 12, 'rgba(255,240,200,.8)');
    [-1, 1].forEach(function (d) { var dx = d < 0 ? L0.x - op : L0.x + L0.w / 2 + op; fillRR(g, dx, L0.y, L0.w / 2, F - L0.y, 0, '#C9CFD8'); g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(dx + 6, L0.y + 6, 4, F - L0.y - 12); g.strokeStyle = 'rgba(122,134,156,.6)'; g.lineWidth = 1; g.strokeRect(dx + 0.5, L0.y + 0.5, L0.w / 2 - 1, F - L0.y - 1); }); g.restore();
    var Lx = LIFT.x + LIFT.w / 2, fln = (Math.sin(t * 0.4) + 1) / 2, na = Math.PI + (0.5 + fln * 4) * Math.PI / 5; g.strokeStyle = PLUM_D; g.lineWidth = 2; g.beginPath(); g.moveTo(Lx, 100); g.lineTo(Lx + Math.cos(na) * 16, 100 + Math.sin(na) * 16); g.stroke(); fillE(g, Lx, 100, 3, 3, PLUM_D);
    var appOn = R.ch === 'app' && u < 0.92; fillE(g, L0.x + L0.w - 14, L0.y - 26, 4 + (appOn ? Math.abs(Math.sin(t * 6)) * 1.6 : 0), 4 + (appOn ? Math.abs(Math.sin(t * 6)) * 1.6 : 0), appOn ? APP : '#9AA6BC');
    /* the fountain (wide screens, left) */
    if (e.l < -440) { g.strokeStyle = 'rgba(155,211,230,.85)'; g.lineWidth = 2.4; for (var j = 0; j < 6; j++) { var jp = ((t * 0.9 + j / 6) % 1), jx = -580 + (j - 2.5) * 12; g.beginPath(); g.moveTo(-580, F - 126); g.quadraticCurveTo(-580 + (j - 2.5) * 24, F - 170 - Math.sin(jp * Math.PI) * 6, -580 + (j - 2.5) * 40, F - 22); g.stroke(); fillE(g, jx * 1 + (j - 2.5) * 20 * jp, F - 124 - Math.sin(jp * Math.PI) * 40, 2, 2, 'rgba(255,255,255,.9)'); } }
    /* the lounge: three live clocks, steam off the teapot and the cup, the traveller's case */
    [[-80, 8], [0, 8], [80, 7]].forEach(function (c) { CO.clock(g, LG.sofa + c[0], 146, 23, c[1], GOLD_D); });
    for (var sm = 0; sm < 3; sm++) { var sp2 = ((t * 0.5 + sm / 3) % 1), sxx = LG.tbl + (sm === 2 ? 19 : -12) + Math.sin(t * 2 + sm) * 3 * sp2; g.strokeStyle = 'rgba(255,255,255,' + (0.8 * (1 - sp2)).toFixed(2) + ')'; g.lineWidth = 2; g.beginPath(); g.moveTo(sxx, F - 86 - sp2 * 26 + (sm === 2 ? 20 : 0)); g.quadraticCurveTo(sxx + 4, F - 92 - sp2 * 26 + (sm === 2 ? 20 : 0), sxx, F - 98 - sp2 * 26 + (sm === 2 ? 20 : 0)); g.stroke(); }
    var lampOn = 0.18 + 0.06 * Math.sin(t * 1.3); g.fillStyle = 'rgba(255,236,190,' + lampOn.toFixed(2) + ')'; g.beginPath(); g.moveTo(LG.lamp - 24, F - 150); g.lineTo(LG.lamp + 24, F - 150); g.lineTo(LG.lamp + 56, F - 60); g.lineTo(LG.lamp - 56, F - 60); g.closePath(); g.fill();
    var cs = TV.x + 46, ch2 = TAP.tv && t - TAP.tv < 2.8 ? Math.min(1, (t - TAP.tv) * 3) * 26 : 0; soft(g, cs + 14, F + 2, 22, 4, 0.25); fillRR(g, cs, F - 58, 30, 54, 6, WEB); fillRR(g, cs + 4, F - 50, 22, 3, 1.5, 'rgba(255,255,255,.5)'); fillRR(g, cs + 4, F - 30, 22, 3, 1.5, 'rgba(255,255,255,.5)');
    g.strokeStyle = '#5C6B7A'; g.lineWidth = 2.4; g.beginPath(); g.moveTo(cs + 9, F - 58); g.lineTo(cs + 9, F - 76 - ch2); g.lineTo(cs + 21, F - 76 - ch2); g.lineTo(cs + 21, F - 58); g.stroke(); fillE(g, cs + 6, F - 2, 3, 3, '#2A3142'); fillE(g, cs + 24, F - 2, 3, 3, '#2A3142');
    fillRR(g, cs + 6, F - 44, 18, 10, 2, GOLD_L); text(g, 'SIN', cs + 15, F - 36.6, 6, 800, PLUM_D, 'center');
    bot(g, t, S);
    CO.crew(CREW, g, t, S, false);
  }

  /* ---------------- in front: the guests' phones and tablets, the bubbles, the items handed over, the manager's folder ---------------- */
  function paintFrontLive(g, t, S) {
    var C = S.C, u = C.u, R = C.R;
    CO.crew(CREW, g, t, S, true);
    /* the WhatsApp guest's phone */
    var hp = handAt(G1, 1), waNow = R.who === 'g1' && u < 0.95; g.save(); g.translate(hp[0] - 2, hp[1] - 10); g.rotate(G1.selfie ? 0.1 : -0.2); fillRR(g, -9, -15, 18, 30, 4, '#2A3142'); fillRR(g, -7, -12, 14, 24, 2, '#ECE5DD'); fillRR(g, -7, -12, 14, 5, 2, WA_D);
    if (waNow) { fillRR(g, -5, -4, 9, 3.5, 1.7, '#FFFFFF'); if (u > 0.36) fillRR(g, -2, 2, 8, 3.5, 1.7, '#DCF8C6'); } g.restore();
    if (waNow && u < 0.06) { g.strokeStyle = 'rgba(37,211,102,.8)'; g.lineWidth = 1.6; for (var v = 0; v < 2; v++) { g.beginPath(); g.arc(hp[0], hp[1] - 10, 16 + v * 6 + (t % 0.3) * 20, -0.6, 0.6); g.stroke(); } }
    if (G1.selfie) { var sf = (t - TAP.g1) % 1; if (sf < 0.12) { g.fillStyle = 'rgba(255,255,255,' + (1 - sf / 0.12).toFixed(2) + ')'; g.beginPath(); g.arc(hp[0], hp[1] - 14, 30, 0, 7); g.fill(); } }
    /* the in-app guest's tablet glows; his suitcase */
    var ht = handAt(G2, 0); if (R.who === 'g2' && u < 0.95) { g.fillStyle = 'rgba(240,113,90,.25)'; g.beginPath(); g.arc(ht[0] + 26, ht[1] - 14, 26, 0, 7); g.fill(); }
    var sx = G2.x + 54, sy = F; soft(g, sx + 12, sy + 2, 20, 4, 0.25); fillRR(g, sx, sy - 52, 26, 50, 5, PLUM); fillRR(g, sx + 3, sy - 48, 20, 3, 1.5, GOLD_L); g.strokeStyle = '#5C6B7A'; g.lineWidth = 2.4; g.beginPath(); g.moveTo(sx + 8, sy - 52); g.lineTo(sx + 8, sy - 70); g.lineTo(sx + 18, sy - 70); g.lineTo(sx + 18, sy - 52); g.stroke(); fillE(g, sx + 6, sy, 3, 3, '#2A3142'); fillE(g, sx + 20, sy, 3, 3, '#2A3142');
    /* the conversation: the guest asks, the assistant fetches and answers */
    var ch = R.ch, col = CHC[ch], who = R.who, ax = who === 'g1' ? G1.x - 4 : who === 'g2' ? G2.x + 4 : KIOSK.x + 20, ay = who === 'kiosk' ? KIOSK.y - 4 : headTop(who === 'g1' ? G1 : G2) - 4;
    var qa = u < 0.02 ? u / 0.02 : u > 0.94 ? (1 - u) / 0.06 : 1;
    if (u > 0.01) { var qn = Math.floor(clamp((u - 0.02) / 0.1, 0, 1) * R.q.length), bx = who === 'g1' ? 262 : who === 'g2' ? 600 : 150, by = who === 'kiosk' ? 186 : 180;
      bubble(g, bx, by, R.q, qn, ax, ay, col, { ch: ch, a: qa, maxW: who === 'g2' ? 156 : 168, size: 11.2 }); }
    var ba = u < 0.16 ? 0 : u < 0.18 ? (u - 0.16) / 0.02 : u > 0.94 ? (1 - u) / 0.06 : 1;
    if (ba > 0) { if (u < 0.32) { g.save(); g.globalAlpha = ba; fillRR(g, BOT.x - 26, 160, 52, 22, 11, '#FFFFFF'); g.strokeStyle = PLUM; g.lineWidth = 2; rr(g, BOT.x - 26, 160, 52, 22, 11); g.stroke(); dots(g, BOT.x - 8, 171, t, PLUM); g.restore(); }
      else { var an = Math.floor(clamp((u - 0.32) / 0.22, 0, 1) * R.a.length), bb = bubble(g, BOT.x, 146, R.a, an, BOT.x + 6, 196, PLUM, { a: ba, anchor: 'center', maxW: 196, size: 10.8 });
        var srcCol = R.fetch === 'none' ? '#E07B12' : PLUM_D; chip(g, bb.x + 8, bb.y - 13, (R.fetch === 'none' ? '' : 'from: ') + R.src, srcCol, ba); } }
    /* the result, pinned under the guest's bubble */
    if (u > 0.68 && u < 0.97) { var ra = clamp((u - 0.68) / 0.03, 0, 1) * (u > 0.94 ? (1 - u) / 0.03 : 1), rx = who === 'g1' ? 262 : who === 'g2' ? 606 : 168, ry = who === 'kiosk' ? 182 : 172; chip(g, rx, ry, R.res + (R.act === 'hand' ? '' : ' ✓'), R.act === 'hand' ? '#E07B12' : '#1E9E6A', ra); }
    /* the item handed over: a key, a tracking card, an invoice */
    if (u > 0.6 && u < 0.7 && (R.act === 'key' || R.act === 'card' || R.act === 'sheet')) { var iu = smooth((u - 0.6) / 0.1), hb = S.B ? S.B.hl : [BOT.x - 46, 352], tgt = R.act === 'card' ? [KIOSK.x + 20, KIOSK.y + 20] : R.who === 'g1' ? handAt(G1, 1) : handAt(G2, 0);
      var ix = lerp(hb[0], tgt[0], iu), iy = lerp(hb[1], tgt[1], iu) - Math.sin(iu * Math.PI) * 50;
      if (R.act === 'key') key(g, ix, iy, iu * 6, '19'); else { g.save(); g.translate(ix, iy); g.rotate(iu * 4); fillRR(g, -10, -7, 20, 14, 2, '#FFFFFF'); fillRR(g, -10, -7, 20, 4, 2, R.act === 'card' ? WEB : APP); g.fillStyle = '#C9C2DA'; g.fillRect(-7, 0, 12, 1.5); g.fillRect(-7, 3, 9, 1.5); g.restore(); } }
    if (R.act === 'key' && u >= 0.7 && u < 0.95) { var kh = handAt(G1, 0); key(g, kh[0], kh[1] - 6, Math.sin(t * 3) * 0.2, '19'); }
    /* the hand-off: the context folder flies to the duty manager, who reads it and greets the guest */
    var hand = R.act === 'hand', folU = hand && u > 0.7 && u < 0.8 ? smooth((u - 0.7) / 0.1) : -1, dmh = handAt(DM, 0), dmh2 = handAt(DM, 1);
    if (folU >= 0) { var fx = lerp(BOT.x + 60, (dmh[0] + dmh2[0]) / 2, folU), fy = lerp(320, (dmh[1] + dmh2[1]) / 2 - 8, folU) - Math.sin(folU * Math.PI) * 120; folder(g, fx, fy, 1, folU * 6.28, false);
      for (var tr = 1; tr < 4; tr++) { var tu = Math.max(0, folU - tr * 0.06); fillE(g, lerp(BOT.x + 60, dmh[0], tu), lerp(320, dmh[1] - 8, tu) - Math.sin(tu * Math.PI) * 120, 3.2 - tr * 0.6, 2.4 - tr * 0.4, ['#DCF8C6', '#DCE8FA', '#F3E7F0'][tr - 1]); } }
    if ((hand && u >= 0.8 && u < 0.97) || (TAP.dm && t - TAP.dm < 3.2)) { folder(g, (dmh[0] + dmh2[0]) / 2, Math.min(dmh[1], dmh2[1]) - 6, 1.1, 0, true); }
    if (hand && u > 0.84 && u < 0.97) bubble(g, 736, 186, 'Hi! I have your whole chat. Let\'s talk about the bulk order.', Math.floor(clamp((u - 0.84) / 0.08, 0, 1) * 58), DM.x - 6, headTop(DM) - 2, PLUM, { maxW: 150, size: 9.6, a: u > 0.94 ? (1 - u) / 0.03 : 1 });
    if (TAP.dm && t - TAP.dm < 3.2) { var su = clamp((t - TAP.dm - 0.3) / 1.4, 0, 1), sx2 = (dmh[0] + dmh2[0]) / 2, sy2 = Math.min(dmh[1], dmh2[1]) + 4, len = su * (F - sy2 + 10);
      fillRR(g, sx2 - 16, sy2, 32, len, 2, '#FFFDF8'); g.strokeStyle = 'rgba(160,150,170,.5)'; g.lineWidth = 1; for (var sl = 8; sl < len - 4; sl += 7) { var gwa = (sl / 7) % 2 === 0; fillRR(g, gwa ? sx2 - 12 : sx2 - 4, sy2 + sl, 16, 4, 2, gwa ? '#DCF8C6' : PLUM_L); }
      fillE(g, sx2, sy2 + len, 17, 4, '#EDE4D6'); }
    /* the consultant's leaflets, her tap's paper planes; the in-app guest's rating card */
    var hl = handAt(TN, 0); for (var lf = 0; lf < 3; lf++) fillRR(g, hl[0] - 8 + lf * 2, hl[1] - 14 - lf * 3, 16, 20, 2, ['#FFFFFF', '#FFF6E0', '#EEF4FF'][lf]); fillRR(g, hl[0] - 4, hl[1] - 20, 16, 5, 1.5, WEB);
    if (TN.slide) { var hr2 = handAt(TN, 1); fillRR(g, hr2[0] - 8, hr2[1] - 12, 16, 20, 2, '#FFFFFF'); fillRR(g, hr2[0] - 8, hr2[1] - 12, 16, 5, 1.5, GOLD); }
    if (TN.fan) { var hr3 = handAt(TN, 1); for (var fa = 0; fa < 3; fa++) { g.save(); g.translate(hr3[0], hr3[1] - 6); g.rotate(-0.5 + fa * 0.5); fillRR(g, -7, -24, 14, 20, 2, '#FFFFFF'); fillRR(g, -7, -24, 14, 5, 1.5, [WEB, GOLD, WA][fa]); g.restore(); } }
    if (TAP.g2 && t - TAP.g2 > 1.1 && t - TAP.g2 < 3) { var ru = (t - TAP.g2 - 1.1) / 1.9, ry2 = headTop(G2) - 24 - ru * 10; g.save(); g.globalAlpha = Math.min(1, (1 - ru) * 4); fillRR(g, G2.x - 40, ry2, 80, 24, 12, '#FFFFFF'); g.strokeStyle = APP; g.lineWidth = 2; rr(g, G2.x - 40, ry2, 80, 24, 12); g.stroke();
      for (var st = 0; st < 5; st++) { var sr = st < Math.ceil(ru * 12) ? 6 : 4.4; g.fillStyle = st < Math.ceil(ru * 12) ? '#F2B233' : '#E3E8EF'; g.beginPath(); for (var p = 0; p < 10; p++) { var pa = -Math.PI / 2 + p * Math.PI / 5, rad = p % 2 ? sr * 0.45 : sr; g.lineTo(G2.x - 28 + st * 14 + Math.cos(pa) * rad, ry2 + 12 + Math.sin(pa) * rad); } g.closePath(); g.fill(); } g.restore(); }
    /* the lounge: the guest's newspaper, her tea cup and phone; the traveller's phone and his check-in chip */
    var rl = handAt(RD, 0), rh = handAt(RD, 1);
    if (RD.paper) { var pmx = (rl[0] + rh[0]) / 2, pmy = Math.min(rl[1], rh[1]); g.save(); g.translate(pmx, pmy - 14); g.rotate((rh[1] - rl[1]) * 0.004);
      fillRR(g, -34, -22, 68, 44, 2, '#FBFAF6'); g.fillStyle = '#E8E4DA'; g.fillRect(-1, -22, 2, 44); text(g, 'THE DAILY', -17, -12, 5.6, 800, INK, 'center'); g.fillStyle = '#C9C2DA'; for (var nl = 0; nl < 5; nl++) { g.fillRect(-30, -6 + nl * 5, 26, 1.6); g.fillRect(4, -16 + nl * 6, 26, 1.6); } fillRR(g, 6, 14, 22, 5, 1, '#9FD6F5'); g.restore();
      if (RD.flip > 0) { g.save(); g.translate(pmx, pmy - 14); g.scale(Math.cos(RD.flip * Math.PI), 1); fillRR(g, 0, -22, 34, 44, 2, '#FFFFFF'); g.restore(); } }
    if (RD.cup) { var cp = RD.cup === 'r' ? rh : rl; fillRR(g, cp[0] - 7, cp[1] - 14, 14, 11, 3, '#FFFFFF'); fillRR(g, cp[0] - 7, cp[1] - 14, 14, 3, 1.5, GOLD); g.strokeStyle = '#FFFFFF'; g.lineWidth = 2; g.beginPath(); g.arc(cp[0] + 8, cp[1] - 9, 3, -1.4, 1.4); g.stroke();
      if (TAP.rd && t - TAP.rd < 3) { var hu = (t - TAP.rd) / 3; g.save(); g.globalAlpha = Math.min(1, (1 - hu) * 3); g.fillStyle = 'rgba(255,255,255,.95)'; var hx = cp[0], hy = cp[1] - 30 - hu * 30; g.beginPath(); g.moveTo(hx, hy + 6); g.bezierCurveTo(hx - 12, hy - 4, hx - 6, hy - 14, hx, hy - 6); g.bezierCurveTo(hx + 6, hy - 14, hx + 12, hy - 4, hx, hy + 6); g.fill(); g.restore(); } }
    if (RD.phone) { fillRR(g, rh[0] - 6, rh[1] - 20, 12, 20, 3, '#2A3142'); fillRR(g, rh[0] - 4, rh[1] - 17, 8, 13, 1.5, RD.ping ? '#DCF8C6' : '#ECE5DD'); if (RD.ping) fillE(g, rh[0] + 6, rh[1] - 20, 3.4, 3.4, WA); }
    var tp2 = handAt(TV, 1); g.save(); g.translate(tp2[0], tp2[1] - 8); g.rotate(TV.phoneUp ? 0 : -0.25); fillRR(g, -6, -11, 12, 21, 3, '#2A3142'); fillRR(g, -4, -8, 8, 14, 1.5, TV.phoneUp ? '#FDE3DD' : '#E8EEF7'); g.restore();
    if (TV.watch) { var wl = handAt(TV, 0); fillE(g, wl[0], wl[1] + 4, 4, 4, GOLD); fillE(g, wl[0], wl[1] + 4, 2.4, 2.4, '#FFFFFF'); }
    if (TAP.tv && t - TAP.tv < 2.8 && t - TAP.tv > 0.5) chip(g, TV.x - 46, headTop(TV) - 26, 'Checked in · in-app ✓', '#1E9E6A', Math.min(1, (2.8 - (t - TAP.tv)) * 3));
    /* the duty manager's phone between hand-offs */
    if (DM.phone) { var pm = handAt(DM, 1); fillRR(g, pm[0] - 4, pm[1] - 22, 8, 26, 3, '#2A3142'); fillE(g, pm[0], pm[1] - 22, 5, 3, '#2A3142'); g.strokeStyle = '#2A3142'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(pm[0] + 2, pm[1] + 4); g.quadraticCurveTo(pm[0] + 26, pm[1] + 30, POD.x + POD.w - 20, POD.y - 10); g.stroke(); }
  }
  function paintForeLive(g, t, S) {
    K.zfore(g, t, S, [], function () { CO.crew(CREW, g, t, S, 'fore'); });
    CR.draw(g, t);
  }

  /* ---------------- the cast: an idle loop and a tap choreography each ---------------- */
  function tapped(id, st, t) { if (st.wave && st.wave !== st._my) { st._my = st.wave; TAP[id] = t; return true; } return false; }
  function lookAtNexi(P, st, t, S, base) { P.look = lerp(P.look, t < st.until ? clamp((S.nexi.x - P.x) / 160, -1, 1) : base, 0.08); }
  var castTN = { id: 'tn', behind: true, keys: ['answers'], P: TN, act: function (P, t, S) {
    var st = S.cast.tn; if (tapped('tn', st, t)) CR.burst('spark', P.x, P.y - 300, t);
    P.tilt = 0; P.hop = 0; P.slide = false; P.fan = false;
    if (TAP.tn && t - TAP.tn < 2.6) { var u = (t - TAP.tn) / 2.6; P.talk = true; P.mood = 'happy';
      if (u < 0.35) { P.fan = true; P.hands = [[-70, -200], [70, -400]]; P.look = 0.3; }
      else { if (!st._p) { st._p = true; var hr = handAt(P, 1); for (var i = 0; i < 3; i++) PLANES.push({ x: hr[0], y: hr[1] - 10, t0: t + i * 0.15, i: i }); } P.hands = [[-70, -200], [110, -330]]; P.hop = Math.sin((u - 0.35) / 0.65 * Math.PI) * 12; } return; }
    st._p = false;
    var c = (t + 1) % 10, busy = S.hot === 'answers' || t < st.until; P.talk = busy; P.mood = busy ? 'happy' : 'calm';
    if (c < 4) { var k = c < 2 ? c / 2 : 1 - (c - 2) / 2; P.slide = c < 2; P.hands = [[-70, -200], [-60 - k * 80, -240 - k * 60]]; lookAtNexi(P, st, t, S, -0.8); }
    else if (c < 6.5) { P.hands = [[-70, -200], [-130 + Math.sin(t * 7) * 10, -300 + Math.cos(t * 7) * 8]]; lookAtNexi(P, st, t, S, -0.7); }
    else { P.hands = [[-70, -200], [60, -190]]; P.tilt = Math.sin(t * 3) * 0.04; lookAtNexi(P, st, t, S, 0.7); }
  } };
  var castG1 = { id: 'g1', behind: true, keys: ['channels'], P: G1, act: function (P, t, S) {
    var st = S.cast.g1, C = S.C, mine = C.R.who === 'g1', u = C.u; if (tapped('g1', st, t)) CR.burst('heart', P.x, P.y - 300, t);
    P.tilt = 0; P.hop = 0; P.selfie = false; P.sx = 1;
    if (TAP.g1 && t - TAP.g1 < 2.6) { var tu = (t - TAP.g1) / 2.6; P.selfie = true; P.talk = true; P.mood = 'happy'; P.hands = [[-110, -400 + Math.sin(t * 10) * 6], [80, -440]]; P.tilt = 0.08; P.look = 0.6; P.hop = Math.sin(tu * Math.PI) * 8; return; }
    var busy = S.hot === 'channels' || t < st.until;
    if (mine && u < 0.14) { var tp = Math.abs(Math.sin(t * 16)) * 5; P.hands = [[-50, -230], [30, -262 + tp]]; P.talk = false; P.mood = 'calm'; P.look = lerp(P.look, -0.1, 0.1); }
    else if (mine && u < 0.62) { P.hands = [[-60, -190], [36, -300]]; P.mood = u > 0.4 ? 'happy' : 'calm'; P.talk = busy; P.look = lerp(P.look, 0.6, 0.1); }
    else if (mine && u < 0.92) { P.hands = [[-50, -210], [40, -250]]; P.mood = 'happy'; P.talk = true; P.hop = u > 0.68 && u < 0.76 ? Math.sin((u - 0.68) / 0.08 * Math.PI) * 12 : 0; P.look = lerp(P.look, 0.5, 0.1); }
    else { var c = (t + 2) % 8; P.talk = busy; P.mood = busy ? 'happy' : 'calm'; if (c < 5) { P.hands = [[-50, -210], [36, -256 + Math.abs(Math.sin(t * 12)) * 4]]; lookAtNexi(P, st, t, S, -0.1); } else { P.hands = [[-60, -190], [40, -250]]; lookAtNexi(P, st, t, S, Math.sin(t * 0.9) * 0.9); } }
  } };
  var castG2 = { id: 'g2', behind: true, keys: ['channels', 'languages'], P: G2, act: function (P, t, S) {
    var st = S.cast.g2, C = S.C, mine = C.R.who === 'g2', u = C.u; if (tapped('g2', st, t)) CR.burst('note', P.x, P.y - 300, t);
    P.tilt = 0; P.hop = 0; P.sx = 1;
    if (TAP.g2 && t - TAP.g2 < 3) { var tu = (t - TAP.g2) / 3; P.talk = true; P.mood = 'happy'; if (tu < 0.36) { P.sx = Math.cos(tu / 0.36 * Math.PI * 2); P.hop = Math.sin(tu / 0.36 * Math.PI) * 20; P.hands = [[-100, -300], [100, -300]]; }
      else { var b = Math.sin(t * 9); P.tilt = b * 0.1; P.hop = Math.abs(b) * 10; P.hands = [[-56, -214], [110, -380 + b * 20]]; } return; }
    var busy = S.hot === 'channels' || S.hot === 'languages' || t < st.until;
    if (mine && u < 0.14) { var tp = Math.abs(Math.sin(t * 14)) * 6; P.hands = [[-56, -214], [-10, -238 + tp]]; P.mood = 'calm'; P.talk = false; P.look = lerp(P.look, -0.3, 0.1); }
    else if (mine && u < 0.92) { P.hands = [[-56, -230], [60, -200]]; P.mood = u > 0.6 ? 'happy' : 'calm'; P.talk = busy || u > 0.7; P.look = lerp(P.look, -0.6, 0.1); P.hop = u > 0.68 && u < 0.75 ? Math.sin((u - 0.68) / 0.07 * Math.PI) * 10 : 0; }
    else { var c = (t + 5) % 9; P.talk = busy; P.mood = busy ? 'happy' : 'calm';
      if (c < 3) { P.hands = [[-56, -214], [-40, -250]]; lookAtNexi(P, st, t, S, -0.2); P.tilt = 0.03; }
      else if (c < 5) { P.hands = [[-56, -214], [60, -190]]; P.hop = Math.abs(Math.sin(t * 8)) * 3; lookAtNexi(P, st, t, S, 0.6); }
      else { P.hands = [[-56, -214], [-10, -236 + Math.abs(Math.sin(t * 12)) * 4]]; lookAtNexi(P, st, t, S, -0.4); } }
  } };
  var castDM = { id: 'dm', behind: true, keys: ['handoff', 'leads'], P: DM, act: function (P, t, S) {
    var st = S.cast.dm, C = S.C, u = C.u, hand = C.R.act === 'hand'; if (tapped('dm', st, t)) CR.burst('spark', P.x, P.y - 300, t);
    P.tilt = 0; P.hop = 0; P.phone = false;
    if (TAP.dm && t - TAP.dm < 3.2) { var tu = (t - TAP.dm) / 3.2; P.talk = true; P.mood = tu < 0.55 ? 'wow' : 'happy'; P.hands = [[-34, -300], [34, -300]]; if (tu > 0.62) { P.tilt = Math.sin((tu - 0.62) / 0.38 * Math.PI) * 0.22; P.look = 0; } return; }
    var busy = S.hot === 'handoff' || t < st.until;
    if (hand && u > 0.68 && u < 0.8) { P.hands = [[-90, -330], [-30, -330]]; P.mood = 'wow'; P.talk = false; P.look = lerp(P.look, -0.9, 0.2); }
    else if (hand && u >= 0.8 && u < 0.97) { P.hands = [[-34, -280], [34, -280]]; P.mood = 'happy'; P.talk = u > 0.84; P.look = lerp(P.look, -0.7, 0.1); P.tilt = u < 0.84 ? 0.05 : 0; }
    else { var c = (t + 1) % 11; P.talk = busy; P.mood = busy ? 'happy' : 'calm';
      if (c < 4.5) { var w = Math.sin(t * 9) * 8; P.hands = [[-50, -206], [-18 + w, -214 + Math.abs(w) * 0.4]]; lookAtNexi(P, st, t, S, -0.2); }
      else if (c < 8) { P.phone = true; P.talk = true; P.hands = [[-60, -206], [30, -380]]; P.tilt = 0.06; lookAtNexi(P, st, t, S, 0.4); }
      else { P.hands = [[-60, -200], [60, -200]]; lookAtNexi(P, st, t, S, -0.6); } }
  } };

  var castRD = { id: 'rd', behind: true, keys: [], P: RD, act: function (P, t, S) {
    P.tilt = 0; P.hop = 0; P.paper = false; P.cup = ''; P.phone = false; P.ping = false; P.flip = 0;
    if (TAP.rd && t - TAP.rd < 3) { var u = (t - TAP.rd) / 3; P.talk = true; P.mood = 'happy'; P.cup = 'r'; P.hands = [[-50, -210], [70, -420 + Math.sin(u * 9) * 10]]; P.look = 0.5; P.tilt = Math.sin(u * Math.PI) * 0.08; P.hop = Math.sin(Math.min(1, u * 2) * Math.PI) * 10; return; }
    var c = (t + 3) % 13; P.talk = false;
    if (c < 5.4) { P.paper = true; P.mood = 'calm'; P.hands = [[-54, -258 + Math.sin(t * 1.3) * 2], [54, -258 + Math.sin(t * 1.3 + 0.4) * 2]]; P.look = lerp(P.look, Math.sin(t * 0.7) * 0.25, 0.1); if (c > 4.6) P.flip = (c - 4.6) / 0.8; }
    else if (c < 8.6) { P.paper = false; P.cup = 'r'; P.mood = 'happy'; var sip = c > 6.2 && c < 7.6; P.hands = [[-44, -200], sip ? [14, -330] : [50, -240]]; P.look = lerp(P.look, sip ? 0 : 0.6, 0.1); P.tilt = sip ? -0.05 : 0; }
    else { P.phone = true; P.ping = c > 10.5; P.mood = P.ping ? 'happy' : 'calm'; P.hands = [[-44, -206], [26, -262 + (P.ping ? 0 : Math.abs(Math.sin(t * 12)) * 3)]]; P.look = lerp(P.look, -0.1, 0.1); if (P.ping) { P.hop = c < 10.9 ? Math.sin((c - 10.5) / 0.4 * Math.PI) * 6 : 0; P.talk = true; } }
  } };
  var castTV = { id: 'tv', behind: true, keys: [], P: TV, act: function (P, t, S) {
    P.tilt = 0; P.hop = 0; P.watch = false; P.phoneUp = false; P.sx = 1;
    if (TAP.tv && t - TAP.tv < 2.8) { var u = (t - TAP.tv) / 2.8; P.talk = true; P.mood = 'happy'; P.phoneUp = true; P.hands = [[-90, -330 + Math.sin(u * 14) * 12], [70, -430]]; P.hop = u < 0.4 ? Math.sin(u / 0.4 * Math.PI) * 18 : 0; P.look = 0.4; return; }
    var c = (t + 1) % 11; P.talk = false; P.mood = 'calm';
    if (c < 4) { P.hands = [[-64, -196], [30, -262 + Math.abs(Math.sin(t * 11)) * 3]]; P.look = lerp(P.look, 0.1, 0.1); }
    else if (c < 6) { P.watch = true; P.hands = [[-10, -300], [40, -220]]; P.look = lerp(P.look, -0.4, 0.1); P.tilt = -0.04; }
    else if (c < 8.5) { P.hands = [[-64, -196], [40, -230]]; P.look = lerp(P.look, -0.9, 0.06); P.tilt = 0.03; }
    else { P.hands = [[-64, -196], [30, -262]]; P.look = lerp(P.look, 0.7, 0.1); P.hop = Math.abs(Math.sin(t * 7)) * 2.5; P.mood = 'happy'; }
  } };

  window.IXW.worlds['sol-chat'] = {
    calmView: [140,-60,800,640], /* CALM: the framed part of the set */
    pan: [-300, 1180],
    paintBg: paintBg, windowBehind: true, paintFrame: paintFrame, paintBack: paintBack, paintFront: paintFront, paintFore: paintFore,
    paintWindow: paintWindow, paintLive: paintLive, paintFrontLive: paintFrontLive, paintForeLive: paintForeLive,
    moteCol: 'rgba(255,246,220,.75)',
    glow: {
      channels: function (g) { g.beginPath(); rrAdd(g, DOOR.x - 14, DOOR.y - 34, DOOR.w + 70, F - DOOR.y + 38, 14); rrAdd(g, NEON.x - 6, NEON.y - 6, NEON.w + 12, NEON.h + 12, 14); rrAdd(g, LIFT.x - 14, LIFT.y - 46, LIFT.w + 28, 54, 12); },
      answers: function (g) { rr(g, RACK.x - 10, RACK.y - 30, RACK.w + 20, F - RACK.y + 34, 12); },
      lookups: function (g) { rr(g, KEYS.x - 8, KEYS.y - 8, SHELF.x + SHELF.w - KEYS.x + 16, KEYS.h + 16, 12); },
      flows: function (g) { rr(g, DIR.x - 8, DIR.y - 8, DIR.w + 16, DIR.h + 16, 12); },
      leads: function (g) { rr(g, BOOK.x - 10, BOOK.y - 12, 84, F - BOOK.y + 16, 12); },
      handoff: function (g) { g.beginPath(); rrAdd(g, HANG.x - 8, HANG.y - 8, HANG.w + 16, 50, 12); rrAdd(g, POD.x - 12, POD.y - 20, POD.w + 24, F - POD.y + 24, 12); rrAdd(g, BELL.x - 18, BELL.y - 20, 36, 30, 10); },
      languages: function (g) { rr(g, MED.xs[0] - MED.r - 10, MED.y - MED.r - 10, MED.xs[4] - MED.xs[0] + MED.r * 2 + 20, MED.r * 2 + 20, 16); },
      bell: function (g) { rr(g, BELL.x - 18, BELL.y - 20, 36, 30, 10); }
    },
    backGlow: ['channels', 'answers', 'lookups', 'flows', 'leads', 'languages'],
    cast: [castRD, castTV, castTN, castG1, castG2, castDM],
    toy: function (name, S, t) { if (name === 'bell') { TAP.bell = t; CR.burst('note', BELL.x, BELL.y - 20, t); } },
    hit: function (x, y, S, t, onBtn) {
      var w = CR.hitWalker(x, y, t); if (w) return w; if (onBtn) return null;
      if (Math.abs(x - BOT.x) < 48 && y > 180 && y < 380) { TAP.bot = t; CR.burst('heart', BOT.x, 190, t); var L = LANGS[Math.floor(t) % LANGS.length];
        return { say: '**' + L[0] + '!** I\'m the assistant. I answer from **your content**, in the guest\'s language (' + L[1] + ' too), and I call a person when it matters.', near: [700, 30], pose: 'love', who: 'The assistant' }; }
      if (Math.abs(x - RD.x) < 60 && y > 300 && y < F + 6) { TAP.rd = t; CR.burst('heart', RD.x + 20, 300, t); return { say: 'A guest in the lounge: she asked about her booking on **WhatsApp** between two pages of the paper. Cheers to that.', near: [120, 30], pose: 'love', who: 'Guest in the lounge' }; }
      if (Math.abs(x - TV.x) < 50 && y > 230 && y < F + 6) { TAP.tv = t; CR.burst('star', TV.x, 240, t); return { say: 'A traveller checks in **in the app** while he waits. The same assistant, the same answers.', near: [-60, 30], pose: 'wow', who: 'Traveller' }; }
      if (x > DOOR.x && x < DOOR.x + DOOR.w && y > DOOR.y && y < F) { TAP.door = t; return { say: 'The **web** entrance: the chat widget on your website, styled to your brand.', near: [330, 40], pose: 'point-left', who: 'The revolving door' }; }
      if (x > LIFT.x && x < LIFT.x + LIFT.w && y > LIFT.y && y < F) return { say: 'Going up: the **in-app** assistant, inside your own app, with the same knowledge.', near: [760, 40], pose: 'point-right', who: 'The lift' };
      return null;
    },
    onStop: function (key, S, t) { S.kT = t; }
  };
})(window.IXW && window.IXW.kit, window.CR, window.CO);
