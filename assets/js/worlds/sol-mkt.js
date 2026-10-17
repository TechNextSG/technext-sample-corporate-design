/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: sol-mkt (/solutions/marketing) — "Harbour Town": marketing as a sunny seaside harbour where the client's business
   is easy to find, easy to contact and dressed in one livery. Left to right: the old town climbing the hill; the client's
   shopfront (the website: its display window is a browser that cycles Home, Services and a Contact form; a sent form drops
   an envelope into the SALES slot of the postbox by the door); the A-frame on the cobbles (a landing page: one offer, one
   form); the harbour office with the town noticeboard (social: posts pinned in a feed, likes ticking) and bunting overhead;
   the lighthouse on the breakwater (be easy to find: its beam sweeps the bay); a boat on its cradle getting the brand livery
   (brand assets); the tide board on the pier (the one-page monthly report: three gauges rise like the tide, plus next
   month's plan). Every company asset wears the same blue, white and gold; the rest of the town is mixed pastel.
   The cast, each with an idle loop and a tap move of their own: the TechNext web developer at the cafe table (types, sips,
   checks the window; tap: turns the laptop round and an enquiry flies to the right slot), the shop owner (client: polishes
   the door, flips the OPEN sign, greets passers-by; tap: stamps the proof APPROVED), the TechNext social producer (pins a
   post, photographs the board, scrolls; tap: a selfie, likes float up), the TechNext designer (rolls the livery stripe, dips,
   frames it with her fingers; tap: fans the swatches and flicks brand paint), the TechNext account lead (reads the gauges,
   writes the log, scans the bay; tap: semaphore with two flags, then a salute). Gulls, sailboats, the ferry, the banner
   plane, chimney smoke and the cat in the window keep the town moving; the gulls, boats and plane can be tapped. */
(function (K, CR, CO) {
  'use strict';
  if (!K || !CR || !CO) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed, limb = K.limb;
  var F = 470, HZ = 100, Q0 = 452, QE = 702, INK = '#1B1F3B';
  /* the client's livery (every asset of "your company" wears it) and the town's own pastels */
  var BLUE = '#2F62C0', BLUE_L = '#4F82DA', NAVY = '#1F2A55', GOLD = '#E3A21A', GOLD_L = '#F6C74A', MIST = '#EAF0FB', WHITE = '#FFFFFF';
  var PASTEL = ['#F7CDB9', '#C4E6D7', '#F6E4A6', '#CFE0F6', '#E4D5F2', '#F6C1C6', '#D9EDC2'], ROOFS = ['#D9734E', '#C9624A', '#E08A5C', '#7D8DA8'];
  var SHOP = { x: 150, w: 312, win: { x: 172, y: 128, w: 180, h: 148 }, door: { x: 384, y: 188, w: 62 } };
  var OFF = { x: 480, w: 222 }, NB = { x: 500, y: 160, w: 182, h: 172 }, CLK = { x: 591, y: 50, r: 19 }, POLE = { x: 666, y0: -64, y1: -178 };
  var LH = { x: 790, base: 112, gal: -112 }, BOARD = { x: 862, y: 92, w: 98, h: 156 }, BOAT = { x: 760, y: 340, w: 140 }, MAIL = { x: 355, y: 298 }, AF = { x: 460, y: 384 };
  var TABLE = { x: 258, y: 398 };
  function setU(g, sx, sy, k) { g.translate(sx, sy); g.scale(k, k); }
  function extOf(W, H, k, sx, sy) { return { l: -(sx + 24) / k, r: (W - sx) / k, t: -(sy + 24) / k, b: (H - sy) / k }; }
  function tri(g, a, b, c, col) { g.fillStyle = col; g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.lineTo(c[0], c[1]); g.closePath(); g.fill(); }
  function heart(g, x, y, r, col) { g.fillStyle = col; g.beginPath(); g.moveTo(x, y + r * 0.9); g.bezierCurveTo(x - r * 1.6, y - r * 0.3, x - r * 0.8, y - r * 1.5, x, y - r * 0.6); g.bezierCurveTo(x + r * 0.8, y - r * 1.5, x + r * 1.6, y - r * 0.3, x, y + r * 0.9); g.fill(); }
  function smooth(u) { u = clamp(u, 0, 1); return u * u * (3 - 2 * u); }
  /* the client's mark: a gold sail over a wave */
  function mark(g, x, y, s, col, wave) { g.save(); g.translate(x, y); g.scale(s, s); tri(g, [0, -12], [0, 6], [11, 6], col); tri(g, [-2, -8], [-2, 6], [-9, 6], col);
    g.strokeStyle = wave || col; g.lineWidth = 2.4; g.lineCap = 'round'; g.beginPath(); g.moveTo(-11, 10); g.quadraticCurveTo(-5, 6, 0, 10); g.quadraticCurveTo(5, 14, 11, 10); g.stroke(); g.restore(); }
  function gull(g, x, y, s, fl) { g.save(); g.translate(x, y); g.scale(s, s); g.strokeStyle = '#5A6478'; g.lineWidth = 2; g.lineCap = 'round'; g.lineJoin = 'round';
    g.beginPath(); g.moveTo(-10, -fl); g.quadraticCurveTo(-5, -5, 0, 0); g.quadraticCurveTo(5, -5, 10, -fl); g.stroke(); fillE(g, 0, 0.6, 2.4, 1.6, '#FFFFFF'); g.restore(); }
  function sailboat(g, x, y, s, sail, sail2, hull, stripe, tilt) {
    g.save(); g.translate(x, y); g.rotate(tilt || 0); g.scale(s, s);
    g.fillStyle = hull; g.beginPath(); g.moveTo(-34, -2); g.lineTo(34, -2); g.quadraticCurveTo(30, 10, 22, 12); g.lineTo(-24, 12); g.quadraticCurveTo(-32, 8, -34, -2); g.closePath(); g.fill();
    if (stripe) { g.fillStyle = stripe; g.fillRect(-32, 2, 64, 3); }
    g.fillStyle = '#7A869C'; g.fillRect(-1.5, -62, 3, 60);
    tri(g, [2, -60], [2, -6], [30, -6], sail); if (sail2) { g.fillStyle = sail2; g.beginPath(); g.moveTo(2, -30); g.lineTo(2, -22); g.lineTo(22, -14); g.lineTo(18, -10); g.closePath(); g.fill(); }
    tri(g, [-2, -54], [-2, -8], [-22, -8], 'rgba(255,255,255,.92)'); g.restore();
  }
  function bunting(g, a, b, sag, n, t, cols, amp) {
    var pts = []; g.strokeStyle = 'rgba(60,70,90,.55)'; g.lineWidth = 1.2; g.beginPath();
    for (var i = 0; i <= 24; i++) { var u = i / 24, x = lerp(a[0], b[0], u), y = lerp(a[1], b[1], u) + Math.sin(u * Math.PI) * sag; if (i) g.lineTo(x, y); else g.moveTo(x, y); }
    g.stroke();
    for (var j = 0; j < n; j++) { var u2 = (j + 0.5) / n, x2 = lerp(a[0], b[0], u2), y2 = lerp(a[1], b[1], u2) + Math.sin(u2 * Math.PI) * sag, sw = Math.sin(t * 5 + j * 1.3 + a[0]) * (amp || 2.5);
      g.fillStyle = cols[j % cols.length]; g.beginPath(); g.moveTo(x2 - 6, y2); g.lineTo(x2 + 6, y2); g.lineTo(x2 + sw, y2 + 15); g.closePath(); g.fill(); }
  }

  /* ---------------- the people ---------------- */
  var W = CR.who;
  var DEV = W({ x: 198, y: 470, s: 0.46, ph: 0.3, skin: 1, hair: 0, style: 'short', outfit: 'shirt', top: '#2EA597', low: '#3A4458', glasses: true, sit: true, chair: false, hands: [[56, -206], [118, -206]], look: 0.6 });
  var OWN = W({ x: 418, y: 470, s: 0.46, ph: 1.1, skin: 3, hair: 2, style: 'bun', outfit: 'cardigan', top: '#F08A5D', top2: '#FFFFFF', low: '#465068', id: '#9AA6BC', hold: 'clipboard', hands: [[-70, -190], [70, -170]], look: 0.3 });
  var SOC = W({ x: 702, y: 470, s: 0.46, ph: 2.0, skin: 0, hair: 1, style: 'pony', outfit: 'polo', top: '#E0567A', top2: '#FFFFFF', clip: '#FFD84A', hands: [[-70, -170], [70, -200]], look: -0.4 });
  var DES = W({ x: 866, y: 470, s: 0.46, ph: 2.7, skin: 2, hair: 0, style: 'bob', outfit: 'shirt', top: '#7B5CD6', low: '#2A3550', hands: [[-80, -310], [-20, -300]], look: -0.6 });
  DES.apron = '#F3E2C7';
  var LEAD = W({ x: 962, y: 470, s: 0.44, ph: 3.4, skin: 4, hair: 3, style: 'short', outfit: 'polo', top: '#3167CA', top2: '#FFFFFF', hatKind: 'cap', hat: NAVY, hold: 'clipboard', hands: [[-70, -190], [70, -170]], look: -0.3 });
  LEAD.c.hatBand = GOLD;
  /* the left quay (behind the title card): a visitor on the bench with a map, a TechNext photographer shooting content for the posts */
  var VIS = W({ x: -142, y: 474, s: 0.44, ph: 1.7, skin: 2, hair: 1, style: 'long', outfit: 'shirt', top: '#F6C1C6', id: '#9AA6BC', sit: true, chair: false, hands: [[-60, -250], [60, -250]], look: 0.3 });
  var PHO = W({ x: -30, y: 566, s: 0.5, ph: 2.9, skin: 1, hair: 0, style: 'short', outfit: 'polo', top: '#2F62C0', top2: '#FFFFFF', hands: [[-60, -300], [60, -300]], look: 0.6 });
  VIS.c.low = '#5C6B7A'; PHO.c.low = '#2A3550';
  var TRI = { x: 36, y: 566 }, STALL = { x: -330 }, GULLQ = [[-250, 640, 0], [-200, 652, 2.1], [70, 624, 4.2]];
  var CREW = [
    { x0: 1010, x1: 1290, y: 492, spd: 15, ph: 0.4, label: 'A visitor', lines: ['Saw the **lighthouse** from the bay. Now, where is the door?', 'The posts, the boat, the shop: all **the same colours**. Easy to spot.'], acts: ['wave', 'jump', 'love'],
      P: W({ s: 0.52, skin: 2, hair: 1, style: 'long', outfit: 'tee', top: '#FFB3C4', id: '#9AA6BC', hold: 'bags' }) },
    { x0: -900, x1: 110, y: 492, spd: 14, ph: 0.2, label: 'TechNext copywriter', lines: ['Short copy, real information. **Approved** by you first.', 'Next month\'s posts are **planned**; this month\'s are scheduled.'], acts: ['nod', 'id', 'wave'],
      P: W({ s: 0.52, skin: 1, hair: 0, style: 'short', outfit: 'cardigan', top: '#3FA9E0', top2: '#FFFFFF', hold: 'clipboard', glasses: true }) },
    { front: true, x0: 1010, x1: 1300, y: 690, spd: 17, ph: 0.6, label: 'TechNext production', lines: ['Brochures fresh from the printer, in the **same livery** as the site.', 'Design, copy, graphics and short video: **all in-house**.'], acts: ['cheer', 'id', 'wave'],
      P: W({ s: 0.58, skin: 3, hair: 1, style: 'pony', outfit: 'polo', top: '#F2B233', clip: '#3167CA', hold: 'box' }) },
    { front: true, x0: -900, x1: -470, y: 690, spd: 16, ph: 0.8, label: 'TechNext analyst', lines: ['Analytics stay in **your own accounts**. I just read them.', 'Visits, enquiries, followers: the numbers for **one page**.'], acts: ['nod', 'wave', 'id'],
      P: W({ s: 0.58, skin: 0, hair: 2, style: 'bob', outfit: 'shirt', top: '#21B799', hold: 'tablet' }) }
  ];
  /* walkers keep to the margins you can actually see: left of the title card, right of the scene but clear of the side tabs */
  var MG = { ext: null, cardL: -9999, tabR: 9999 };
  function fitCrew(S) {
    if (MG.ext !== S.ext) { MG.ext = S.ext; MG.cardL = -9999; MG.tabR = 9999;
      var c = document.querySelector('.ixw-copy'), st = document.querySelector('[data-ixw-set]');
      if (c && st && window.innerWidth >= 768) { var cr = c.getBoundingClientRect(), sr = st.getBoundingClientRect(), k = sr.width / 1000; MG.cardL = (cr.left - sr.left) / k; MG.tabR = (window.innerWidth - 84 - sr.left) / k; } }
    CREW.forEach(function (w) { if (w.xMin == null) { w.xMin = w.x0; w.xMax = w.x1; }
      if (MG.cardL === -9999) { w.x0 = w.xMin; w.x1 = w.xMax; }
      else if (w.xMin >= 1000) { w.x0 = w.xMin; w.x1 = Math.min(w.xMax, MG.tabR - 60); }
      else if (w.xMax <= 200) { w.x0 = Math.max(w.xMin, S.ext.l + 90); w.x1 = Math.min(w.xMax, MG.cardL - 70); } });
  }
  function handAt(P, side) {
    var F3 = K.F3, d = side ? 1 : -1, h = P.hands[side], sxk = P.sx == null ? 1 : P.sx, bw = P.build || 1;
    var r = K.ik(d * F3.shx * bw, F3.shy, h[0], h[1], F3.a, F3.b, d).h, dy = -(P.hop || 0) + (P.sit ? (P.sitDrop != null ? P.sitDrop : 46) : 0);
    return [P.x + r[0] * P.s * sxk, P.y + (r[1] + dy) * P.s];
  }
  function headAt(P) { var dy = -(P.hop || 0) + (P.sit ? (P.sitDrop != null ? P.sitDrop : 46) : 0); return [P.x + P.look * 9 * P.s, P.y + (K.F3.hy + dy) * P.s]; }

  /* ---------------- static: the sky, the bay, the breakwater and the lighthouse ---------------- */
  function paintBg(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    var sk = g.createLinearGradient(0, e.t, 0, HZ); sk.addColorStop(0, '#6EC0F2'); sk.addColorStop(0.6, '#AEDDF8'); sk.addColorStop(1, '#E4F5FD'); g.fillStyle = sk; g.fillRect(e.l, e.t, e.r - e.l, HZ - e.t + 2);
    var sun = g.createRadialGradient(1120, -250, 8, 1120, -250, 420); sun.addColorStop(0, 'rgba(255,247,210,.95)'); sun.addColorStop(0.22, 'rgba(255,240,190,.4)'); sun.addColorStop(1, 'rgba(255,240,190,0)'); g.fillStyle = sun; g.fillRect(e.l, e.t, e.r - e.l, 500);
    fillE(g, 1120, -250, 26, 26, '#FFF5CF');
    /* the bay: lighter at the horizon, deeper by the quay */
    var sea = g.createLinearGradient(0, HZ, 0, Q0); sea.addColorStop(0, '#CDEEFA'); sea.addColorStop(0.25, '#8FD2EF'); sea.addColorStop(1, '#4AAEDC'); g.fillStyle = sea; g.fillRect(e.l, HZ, e.r - e.l, Q0 - HZ + 4);
    g.strokeStyle = 'rgba(255,255,255,.45)'; g.lineWidth = 1.4; g.beginPath();
    for (var w = 0; w < 46; w++) { var wy = HZ + 30 + hash(w * 2.1) * (Q0 - HZ - 40), wx = e.l + hash(w * 3.7) * (e.r - e.l), wl = 10 + (wy - HZ) * 0.08; g.moveTo(wx, wy); g.quadraticCurveTo(wx + wl / 2, wy - 2, wx + wl, wy); }
    g.stroke();
    /* the far shore across the bay, hazy, with a few white houses */
    g.fillStyle = 'rgba(132,178,170,.55)'; g.beginPath(); g.moveTo(980, HZ + 1); for (var hx = 980; hx <= e.r + 20; hx += 20) g.lineTo(hx, HZ - 14 - Math.sin(hx * 0.013) * 9 - Math.sin(hx * 0.041) * 4); g.lineTo(e.r + 20, HZ + 1); g.closePath(); g.fill();
    for (var fh = 0; fh < 24; fh++) { var fx = 1000 + fh * 23 + hash(fh) * 10; if (fx > e.r) break; fillRR(g, fx, HZ - 12 - hash(fh + 3) * 6, 7, 6, 1, 'rgba(255,255,255,.75)'); }
    /* the hill behind the old town (left half) */
    g.fillStyle = '#B9DDB0'; g.beginPath(); g.moveTo(e.l - 20, HZ + 10); for (var hl = e.l - 20; hl <= 740; hl += 20) g.lineTo(hl, 30 - Math.sin((hl + 900) * 0.006) * 46 - Math.sin(hl * 0.019) * 10); g.lineTo(740, HZ + 10); g.closePath(); g.fill();
    g.fillStyle = 'rgba(255,255,255,.18)'; g.beginPath(); g.moveTo(e.l - 20, HZ + 10); for (var h2 = e.l - 20; h2 <= 740; h2 += 20) g.lineTo(h2, 62 - Math.sin((h2 + 900) * 0.006) * 30); g.lineTo(740, HZ + 10); g.closePath(); g.fill();
    for (var tr = 0; tr < 40; tr++) { var tx = e.l + tr * 46 + hash(tr * 5) * 20; if (tx > 720) break; var ty = 34 - Math.sin((tx + 900) * 0.006) * 46 - Math.sin(tx * 0.019) * 10 + 6; fillE(g, tx, ty, 9, 12, tr % 2 ? '#8CC79A' : '#7DBB8C'); }
    /* the breakwater out to the lighthouse */
    var bw0 = 600; g.fillStyle = '#A7B4C4'; g.beginPath(); g.moveTo(bw0, 126); for (var rx = bw0; rx <= e.r + 20; rx += 14) g.lineTo(rx, 128 + hash(rx) * 6); g.lineTo(e.r + 20, 104); g.lineTo(bw0 + 6, 104); g.closePath(); g.fill();
    fillRR(g, bw0, 100, e.r - bw0 + 40, 8, 2, '#D7DFE8'); g.fillStyle = 'rgba(80,100,130,.18)'; for (var bk = bw0; bk < e.r + 20; bk += 26) g.fillRect(bk, 108, 2, 16);
    /* the lighthouse: the client's livery, banded blue and white, a gold lantern */
    var x = LH.x, b0 = LH.base, gy = LH.gal;
    fillRR(g, x + 16, 74, 52, 34, 3, '#FFFFFF'); tri(g, [x + 12, 76], [x + 42, 56], [x + 72, 76], NAVY); fillRR(g, x + 36, 88, 10, 18, 2, BLUE); fillRR(g, x + 52, 84, 9, 9, 2, '#BFE3F7');
    g.save(); g.beginPath(); g.moveTo(x - 26, b0); g.lineTo(x - 16, gy + 8); g.lineTo(x + 16, gy + 8); g.lineTo(x + 26, b0); g.closePath(); g.fillStyle = '#FFFFFF'; g.fill(); g.clip();
    g.fillStyle = BLUE; [0, 2, 4].forEach(function (i) { g.fillRect(x - 30, gy + 8 + i * 37, 60, 37); });
    g.fillStyle = 'rgba(20,40,90,.10)'; g.fillRect(x + 4, gy, 30, b0 - gy); g.restore();
    fillRR(g, x - 6, 60, 12, 20, 6, NAVY); [0, 1].forEach(function (i) { fillRR(g, x - 3, gy + 30 + i * 74, 6, 10, 3, '#E9F3FB'); });
    fillRR(g, x - 26, gy, 52, 9, 2, NAVY); g.strokeStyle = NAVY; g.lineWidth = 1.5; g.beginPath(); for (var rl = -24; rl <= 24; rl += 6) { g.moveTo(x + rl, gy); g.lineTo(x + rl, gy - 9); } g.moveTo(x - 25, gy - 9); g.lineTo(x + 25, gy - 9); g.stroke();
    fillRR(g, x - 15, gy - 38, 30, 30, 3, '#FFF3C8'); g.strokeStyle = GOLD; g.lineWidth = 2; g.beginPath(); for (var lw = -15; lw <= 15; lw += 10) { g.moveTo(x + lw, gy - 38); g.lineTo(x + lw, gy - 8); } g.stroke();
    g.fillStyle = GOLD; g.beginPath(); g.moveTo(x - 20, gy - 38); g.quadraticCurveTo(x, gy - 64, x + 20, gy - 38); g.closePath(); g.fill(); fillE(g, x, gy - 58, 4, 4, NAVY); g.fillStyle = NAVY; g.fillRect(x - 1, gy - 74, 2, 14);
    g.restore();
  }

  /* ---------------- live, behind the town: clouds, the banner plane, gulls, the beam, boats on the bay ---------------- */
  var PLANE = { x: 0, y: 0 }, GULLS = [], BOATS = [], FERRY = { x: 0, y: 0 };
  function paintWindow(g, t, par, S) {
    var e = S.ext;
    for (var c = 0; c < 6; c++) { var sp = 3 + c * 1.6, span = e.r - e.l + 500, x = e.l - 250 + ((hash(c + 7) * span + t * sp) % span), y = -250 + c * 34 - (c % 2) * 40; K.cloud(g, x, y, 0.2 + hash(c + 2) * 0.14); }
    /* the lighthouse beam: a pale wedge sweeping round (daylight, so faint); the lantern flashes when it faces us */
    var a = t * 0.9, cx = LH.x, cy = LH.gal - 23, f = Math.cos(a), len = 420, wdt = 0.13;
    g.save(); g.globalAlpha = 0.16 + 0.1 * Math.max(0, Math.sin(a)); g.fillStyle = '#FFF6CF'; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + f * len, cy - len * wdt - 6); g.lineTo(cx + f * len, cy + len * wdt + 6); g.closePath(); g.fill(); g.restore();
    var fl = Math.max(0, Math.sin(a)); if (fl > 0.9) { var gl = (fl - 0.9) * 10; g.save(); g.globalAlpha = gl * 0.8; fillE(g, cx, cy, 20 + gl * 12, 20 + gl * 12, 'rgba(255,240,170,.55)'); fillE(g, cx, cy, 9, 9, '#FFFBE6'); g.restore(); }
    if (S.hot === 'lighthouse') { var hb = 0.5 + 0.5 * Math.sin(t * 6); g.save(); g.globalAlpha = 0.25 + hb * 0.3; fillE(g, cx, cy, 26, 26, 'rgba(255,236,160,.6)'); g.restore(); }
    /* the banner plane tows the client's handle across the sky */
    var ps = e.r - e.l + 700, px = e.r + 350 - ((t * 22 + 300) % ps), py = -196 + Math.sin(t * 0.7) * 6; PLANE.x = px; PLANE.y = py;
    g.save(); g.translate(px, py);
    g.strokeStyle = 'rgba(90,100,120,.6)'; g.lineWidth = 1; g.beginPath(); g.moveTo(22, 0); g.lineTo(48, 2); g.stroke();
    var bw = 132, wv = Math.sin(t * 6) * 2; g.fillStyle = '#FFFFFF'; g.beginPath(); g.moveTo(48, -9); g.quadraticCurveTo(48 + bw / 2, -9 + wv, 48 + bw, -9); g.lineTo(48 + bw, 11); g.quadraticCurveTo(48 + bw / 2, 11 + wv, 48, 11); g.closePath(); g.fill();
    g.fillStyle = BLUE; g.fillRect(48, -9, 5, 20); text(g, '@yourcompany', 48 + bw / 2 + 3, 5.5 + wv * 0.5, 11, 800, NAVY, 'center');
    fillE(g, 0, 0, 22, 6.5, '#F4F6FA'); fillRR(g, -8, -16, 6, 32, 3, '#E0456B'); fillRR(g, 14, -9, 6, 18, 3, '#E0456B'); fillE(g, -14, -2, 5, 3.5, '#9FD3F2'); fillE(g, -23, 0, 2, 7 * Math.abs(Math.sin(t * 40)), 'rgba(80,90,110,.5)');
    g.restore();
    /* gulls circling over the bay */
    GULLS = [];
    for (var gq = 0; gq < 7; gq++) { var ang = t * (0.25 + hash(gq) * 0.2) + gq * 1.9, gx = 840 + Math.cos(ang) * (120 + gq * 30) + (gq > 4 ? -760 : 0), gy2 = -60 + gq * 18 + Math.sin(ang) * 26; if (gq > 4) gy2 -= 70;
      gull(g, gx, gy2, 1 + hash(gq + 1) * 0.4, 3 + Math.sin(t * (6 + gq) + gq) * 4); GULLS.push([gx, gy2]); }
    /* two tiny visitors walking the breakwater to the lighthouse */
    for (var v = 0; v < 2; v++) { var vu = ((t * 0.018 + v * 0.45) % 1), vx = 712 + vu * 64, bob = Math.abs(Math.sin(t * 6 + v)) * 1.2;
      fillRR(g, vx - 2.2, 87 - bob, 4.4, 9, 2, v ? '#E0567A' : '#FFD84A'); fillE(g, vx, 85 - bob, 2.2, 2.2, '#F0CBA8'); g.fillStyle = '#3A4458'; g.fillRect(vx - 1.6, 96 - bob, 1.2, 4); g.fillRect(vx + 0.4, 96 - bob, 1.2, 4); }
    /* the bay: sparkles, the ferry, sailboats (one in the client's livery), buoys */
    g.fillStyle = 'rgba(255,255,255,.85)';
    for (var s = 0; s < 34; s++) { var sxp = e.l + hash(s * 1.7) * (e.r - e.l), syp = 140 + hash(s * 2.9) * 290, tw = Math.sin(t * 2.4 + s * 1.3); if (tw < 0.35 || sxp < 700) continue; g.fillRect(sxp - 4 * tw, syp, 8 * tw, 1.6); }
    var fs = e.r - 600 + 500, fx = 600 + ((t * 9 + 200) % fs), fy = 150 + Math.sin(t * 1.2) * 1.4; FERRY.x = fx; FERRY.y = fy;
    g.save(); g.translate(fx, fy); g.fillStyle = 'rgba(255,255,255,.7)'; g.beginPath(); g.moveTo(-48, 8); g.lineTo(-90, 12); g.lineTo(-48, 12); g.fill();
    g.fillStyle = '#FFFFFF'; g.beginPath(); g.moveTo(-46, 0); g.lineTo(44, 0); g.lineTo(36, 12); g.lineTo(-40, 12); g.closePath(); g.fill(); g.fillStyle = '#E0456B'; g.fillRect(-44, 3, 86, 3);
    fillRR(g, -30, -14, 54, 14, 3, '#FFFFFF'); for (var fw = 0; fw < 6; fw++) fillRR(g, -26 + fw * 8, -11, 5, 5, 1, '#8FC6EA'); fillRR(g, 8, -26, 10, 12, 2, '#E0456B'); fillRR(g, 8, -26, 10, 3, 1, '#1B1F3B');
    g.restore();
    BOATS = [];
    [[0, 228, 0.62, BLUE, GOLD, '#FFFFFF', BLUE, 11], [1, 300, 0.78, '#FFFFFF', null, '#E0567A', '#FFFFFF', 7], [2, 196, 0.5, '#FFD84A', null, '#3FA9E0', '#FFFFFF', 15]].forEach(function (b) {
      var span = e.r - 620 + 400, bx = 640 + ((t * b[7] + hash(b[0] + 4) * span) % span), by = b[1] + Math.sin(t * 1.6 + b[0]) * 2, tl = Math.sin(t * 1.3 + b[0] * 2) * 0.05;
      sailboat(g, bx, by, b[2], b[3], b[4], b[5], b[6], tl); g.fillStyle = 'rgba(255,255,255,.6)'; g.fillRect(bx - 34 * b[2] - 14, by + 6 * b[2], 14, 1.4); BOATS.push([bx, by, b[2], b[0]]); });
    [[905, 330, '#E0456B'], [1180, 280, '#2BC48A'], [1080, 380, '#E0456B']].forEach(function (bu, i) { var by2 = bu[1] + Math.sin(t * 2 + i) * 2.2, bt = Math.sin(t * 1.7 + i) * 0.12;
      g.save(); g.translate(bu[0], by2); g.rotate(bt); fillE(g, 0, 6, 12, 3, 'rgba(255,255,255,.55)'); fillRR(g, -6, -10, 12, 16, 4, bu[2]); fillRR(g, -6, -4, 12, 3, 1, '#FFFFFF'); g.fillStyle = '#7A869C'; g.fillRect(-1, -20, 2, 10); fillE(g, 0, -21, 2.5, 2.5, '#FFD84A'); g.restore(); });
  }

  /* ---------------- static: the quay, the cobbles and the near water (hero px) ---------------- */
  function paintFrame(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    var q = g.createLinearGradient(0, Q0, 0, QE); q.addColorStop(0, '#E8DDCB'); q.addColorStop(1, '#D9C8AE'); g.fillStyle = q; g.fillRect(e.l, Q0, e.r - e.l, QE - Q0);
    /* cobbles, larger towards us */
    for (var r = 0; r < 12; r++) { var y0 = Q0 + 6 + Math.pow(r / 12, 1.25) * (QE - Q0 - 10), ch = 7 + r * 1.6, cw = 16 + r * 3.2, off = (r % 2) * cw / 2;
      for (var cx = Math.floor((e.l - off) / cw) * cw + off; cx < e.r; cx += cw) { var hv = hash(cx * 0.13 + r * 7.1); g.fillStyle = hv > 0.66 ? 'rgba(160,130,95,.16)' : hv > 0.33 ? 'rgba(255,255,255,.28)' : 'rgba(140,115,85,.10)'; rr(g, cx + 1.5, y0, cw - 3, ch, ch / 2.4); g.fill(); } }
    /* a sand-coloured path to the shop door, then the kerb along the buildings */
    g.fillStyle = 'rgba(255,240,215,.45)'; g.beginPath(); g.moveTo(370, Q0); g.lineTo(460, Q0); g.lineTo(560, QE); g.lineTo(330, QE); g.closePath(); g.fill();
    g.fillStyle = '#CDBEA6'; g.fillRect(e.l, Q0 - 4, e.r - e.l, 6); g.fillStyle = 'rgba(255,255,255,.5)'; g.fillRect(e.l, Q0 - 4, e.r - e.l, 1.5);
    /* the quay's edge: dressed stone, iron rings, then the harbour water towards us */
    fillRR(g, e.l, QE, e.r - e.l, 14, 0, '#C7B79C'); g.fillStyle = 'rgba(90,70,40,.18)'; for (var st = Math.floor(e.l / 44) * 44; st < e.r; st += 44) g.fillRect(st, QE, 2, 14);
    var wq = g.createLinearGradient(0, QE + 14, 0, e.b); wq.addColorStop(0, '#3E9FD0'); wq.addColorStop(1, '#5CB8E3'); g.fillStyle = wq; g.fillRect(e.l, QE + 14, e.r - e.l, e.b - QE - 14);
    g.fillStyle = 'rgba(20,60,100,.18)'; g.fillRect(e.l, QE + 14, e.r - e.l, 6);
    g.restore();
  }

  /* ---------------- static back props: the old town, the shopfront, the harbour office, the boat, the tide board ---------------- */
  function win(g, x, y, w, h, frame, glass, shut) {
    if (shut) { fillRR(g, x - 9, y, 8, h, 2, shut); fillRR(g, x + w + 1, y, 8, h, 2, shut); }
    fillRR(g, x - 2, y - 2, w + 4, h + 4, 3, frame); fillRR(g, x + 1, y + 1, w - 2, h - 2, 2, glass); g.fillStyle = frame; g.fillRect(x + w / 2 - 1, y, 2, h); g.fillRect(x, y + h * 0.45, w, 2);
    g.fillStyle = 'rgba(255,255,255,.45)'; g.beginPath(); g.moveTo(x + 3, y + h - 3); g.lineTo(x + w * 0.4, y + 3); g.lineTo(x + w * 0.55, y + 3); g.lineTo(x + 6, y + h - 3); g.closePath(); g.fill();
  }
  function flowers(g, x, y, w, col) { fillRR(g, x, y, w, 9, 2, '#B98A5E'); for (var f = 0; f < w / 7; f++) { fillE(g, x + 4 + f * 7, y - 2, 4.5, 4, f % 2 ? '#3FAE6B' : '#4FBE7A'); fillE(g, x + 4 + f * 7 + 1, y - 5, 2.6, 2.6, f % 3 ? col : '#FFFFFF'); } }
  function house(g, x, w, top, i) {
    /* a three-storey harbour house: pastel walls, a gable, flat or hipped roof, shuttered windows, a shop or a door below */
    var wall = PASTEL[i % PASTEL.length], roof = ROOFS[i % ROOFS.length], base = Q0 - 2, kind = i % 3, gf = base - 118;
    soft(g, x + w / 2, base + 2, w * 0.55, 6, 0.18); fillRR(g, x, top, w, base - top, 2, wall); g.fillStyle = 'rgba(40,40,70,.06)'; g.fillRect(x + w - 10, top, 10, base - top);
    if (kind === 0) tri(g, [x - 8, top + 2], [x + w / 2, top - 44], [x + w + 8, top + 2], roof);
    else if (kind === 1) { fillRR(g, x - 6, top - 10, w + 12, 14, 3, roof); fillRR(g, x + w * 0.3, top - 34, w * 0.4, 26, 3, wall); tri(g, [x + w * 0.26, top - 32], [x + w / 2, top - 52], [x + w * 0.74, top - 32], roof); fillE(g, x + w / 2, top - 22, 6, 6, '#FFFFFF'); }
    else { g.fillStyle = roof; g.beginPath(); g.moveTo(x - 6, top + 2); g.lineTo(x + 12, top - 28); g.lineTo(x + w - 12, top - 28); g.lineTo(x + w + 6, top + 2); g.closePath(); g.fill(); g.fillStyle = 'rgba(255,255,255,.14)'; g.fillRect(x + 6, top - 14, w - 12, 3); }
    if (i % 2) { fillRR(g, x + w - 28, top - 50, 12, 30, 2, '#B86A4E'); fillRR(g, x + w - 30, top - 52, 16, 5, 2, '#9C5840'); }
    g.fillStyle = 'rgba(255,255,255,.6)'; g.fillRect(x - 2, gf - 4, w + 4, 5);
    var cols = Math.max(1, Math.min(3, Math.floor((w - 10) / 38))), gap = (w - cols * 24) / (cols + 1);
    for (var fy = gf - 80; fy >= top + 4; fy -= 80) for (var cc = 0; cc < cols; cc++) { var wx = x + gap + cc * (24 + gap); win(g, wx, fy + 16, 24, 40, '#FFFFFF', '#CFE6F7', ['#5D8FCB', '#2EA597', null, '#C9624A'][i % 4]); if ((cc + i) % 2 === 0) flowers(g, wx - 3, fy + 58, 30, ['#E0456B', '#FFD84A', '#B05FC9'][i % 3]); }
    /* the ground floor: a little shop window with an awning, or a front door and a bench */
    var dc = ['#5D8FCB', '#C9624A', '#2EA597', '#7B5CD6'][i % 4];
    if (i % 3 === 1) { var aw = ['#E0456B', '#2EA597', '#F2B233'][i % 3]; win(g, x + 10, gf + 22, w - 54, 54, '#FFFFFF', '#DCEFFA'); for (var a = 0; a < Math.floor((w - 14) / 14); a++) fillRR(g, x + 6 + a * 14, gf + 4, 14, 14, 0, a % 2 ? '#FFFFFF' : aw);
      fillRR(g, x + w - 38, gf + 26, 28, base - gf - 26, 3, dc); }
    else { fillRR(g, x + w / 2 - 15, gf + 30, 30, base - gf - 30, 4, dc); fillRR(g, x + w / 2 - 10, gf + 36, 20, 22, 3, 'rgba(255,255,255,.45)'); fillE(g, x + w / 2 + 8, gf + 78, 2, 2, '#FFD84A'); fillRR(g, x + w / 2 - 19, gf + 24, 38, 6, 2, '#FFFFFF');
      K.plant(g, { x: x + 14, y: base }, '#FFFFFF', '#E3E9F3'); }
  }
  function paintBack(g, ext) {
    /* the old town: a hazy back row on the hill, then the street of pastel houses up to the shop */
    for (var hx = Math.floor((ext.l - 60) / 70) * 70, n = 0; hx < 470; hx += 58 + hash(hx) * 24, n++) { var hill = 30 - Math.sin((hx + 900) * 0.006) * 46, top = hill - 18 - hash(hx * 0.7) * 50, hw = 50 + hash(hx + 3) * 16;
      fillRR(g, hx, top, hw, 190 - top, 2, ['rgba(255,236,224,.92)', 'rgba(226,244,236,.92)', 'rgba(255,248,222,.92)', 'rgba(232,240,252,.92)'][n % 4]); tri(g, [hx - 5, top + 2], [hx + hw / 2, top - 22], [hx + hw + 5, top + 2], ['#E39A78', '#D9886A', '#C7A08C'][n % 3]);
      g.fillStyle = 'rgba(110,140,180,.45)'; for (var hr = top + 14; hr < 150; hr += 30) { g.fillRect(hx + 10, hr, 9, 12); g.fillRect(hx + hw - 19, hr, 9, 12); } }
    /* the church on the hill (wide screens and above the card) */
    var chx = -250; fillRR(g, chx, -206, 46, 260, 2, '#FFF7EC'); tri(g, [chx - 6, -204], [chx + 23, -270], [chx + 52, -204], '#C9624A'); fillE(g, chx + 23, -170, 12, 12, '#FFFFFF'); g.strokeStyle = NAVY; g.lineWidth = 2; g.beginPath(); g.arc(chx + 23, -170, 12, 0, 7); g.stroke();
    g.beginPath(); g.moveTo(chx + 23, -170); g.lineTo(chx + 23, -178); g.moveTo(chx + 23, -170); g.lineTo(chx + 29, -168); g.stroke(); fillRR(g, chx + 15, -140, 16, 26, 8, '#CFE6F7'); g.fillStyle = '#9AA6BC'; g.fillRect(chx + 22, -290, 2, 22); g.fillRect(chx + 17, -284, 12, 2);
    var widths = [96, 118, 104, 126, 92, 112, 108, 120, 98, 116, 104], i = 0;
    for (var x = 148; x > ext.l - 140; i++) { var w = widths[i % widths.length]; x -= w + 4; var tp = 130 - hash(i * 3.3) * 90; house(g, x, w, tp, i); }
    /* street life between the houses (wide screens): a cafe awning with tables, a lamp, a bike */
    if (ext.l < -420) { var cx0 = -760; for (var aw = 0; aw < 8; aw++) fillRR(g, cx0 + aw * 20, 300, 20, 26, aw === 0 || aw === 7 ? 4 : 0, aw % 2 ? '#FFFFFF' : '#2EA597'); for (var sc = 0; sc < 8; sc++) { g.fillStyle = sc % 2 ? '#FFFFFF' : '#2EA597'; g.beginPath(); g.arc(cx0 + 10 + sc * 20, 326, 10, 0, Math.PI); g.fill(); }
      text(g, 'CAFE', cx0 + 80, 296, 11, 800, '#2EA597', 'center');
      [cx0 + 30, cx0 + 120].forEach(function (tx) { soft(g, tx, Q0 + 4, 30, 4, 0.2); fillE(g, tx, 404, 24, 5, '#FFFFFF'); g.fillStyle = '#7A869C'; g.fillRect(tx - 1.5, 404, 3, 50); fillE(g, tx, Q0 - 2, 12, 3, '#7A869C'); fillRR(g, tx - 8, 390, 10, 13, 2, '#FFFFFF'); fillRR(g, tx + 4, 394, 8, 9, 2, '#F2B233'); });
      g.strokeStyle = '#2A3550'; g.lineWidth = 3; g.beginPath(); g.arc(-520, 440, 14, 0, 7); g.arc(-472, 440, 14, 0, 7); g.moveTo(-520, 440); g.lineTo(-500, 412); g.lineTo(-472, 440); g.moveTo(-500, 412); g.lineTo(-480, 412); g.stroke(); fillRR(g, -514, 404, 22, 8, 3, '#E0567A'); }
    /* a lamp post with a flower basket at the corner of the street */
    g.fillStyle = '#2A3550'; g.fillRect(118, 140, 5, Q0 - 140); fillE(g, 120, Q0 - 2, 10, 3, '#2A3550'); fillRR(g, 108, 124, 26, 18, 6, '#2A3550'); fillRR(g, 111, 128, 20, 11, 4, '#FFF3C8'); fillE(g, 120, 176, 16, 9, '#4FBE7A'); [-10, -3, 5, 11].forEach(function (d, j) { fillE(g, 120 + d, 172 + (j % 2) * 4, 3.4, 3.4, j % 2 ? '#E0456B' : '#FFD84A'); });
    leftQuay(g);
    shop(g); office(g); board(g);
    if (ext.r > 1000) rightPier(g, ext);
  }
  /* the left quay: a mosaic of the client's mark in the cobbles, a fruit and flower stall, a bench against the houses */
  function leftQuay(g) {
    /* the mosaic: a blue disc with a gold sail, laid flat in the cobbles */
    g.save(); g.translate(-210, 604); g.scale(1, 0.22); fillE(g, 0, 0, 120, 120, 'rgba(47,98,192,.5)'); g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = 8; g.beginPath(); g.arc(0, 0, 104, 0, 7); g.stroke();
    g.strokeStyle = 'rgba(227,162,26,.55)'; g.lineWidth = 5; g.beginPath(); g.arc(0, 0, 118, 0, 7); g.stroke(); g.restore();
    g.save(); g.translate(-210, 600); g.scale(2.6, 0.62); mark(g, 0, 0, 1, '#F6C74A', '#FFFFFF'); g.restore();
    /* the stall: trestle, crates of fruit and flowers, a striped awning on poles, a chalkboard */
    var x = STALL.x, b = Q0 + 22; soft(g, x, b + 3, 84, 7, 0.22);
    [x - 64, x + 64].forEach(function (px) { fillRR(g, px - 3, 330, 6, b - 330, 2, '#8E6440'); });
    for (var a = 0; a < 9; a++) { fillRR(g, x - 76 + a * 17, 318, 17, 22, a === 0 || a === 8 ? 4 : 0, a % 2 ? '#FFFFFF' : '#2EA597'); g.fillStyle = a % 2 ? '#FFFFFF' : '#2EA597'; g.beginPath(); g.arc(x - 67.5 + a * 17, 340, 8.5, 0, Math.PI); g.fill(); }
    fillRR(g, x - 52, 306, 104, 14, 4, '#FFFFFF'); text(g, 'HARBOUR MARKET', x, 316.4, 8, 800, '#2EA597', 'center');
    fillRR(g, x - 70, b - 58, 140, 10, 3, '#B98A5E'); [x - 60, x + 52].forEach(function (lx) { fillRR(g, lx, b - 48, 8, 48, 2, '#8E6440'); });
    [[x - 66, '#F2B233', '#E07B12'], [x - 22, '#E0456B', '#B83250'], [x + 22, '#7DBB4C', '#4E9A2E']].forEach(function (c) { fillRR(g, c[0], b - 82, 42, 26, 3, '#C99A6B'); g.fillStyle = 'rgba(90,60,30,.25)'; g.fillRect(c[0], b - 70, 42, 2);
      for (var f = 0; f < 6; f++) fillE(g, c[0] + 7 + f * 6, b - 84 - (f % 2) * 4, 5.2, 5.2, f % 2 ? c[1] : c[2]); });
    fillRR(g, x - 14, b - 44, 40, 40, 3, '#C99A6B'); for (var fl = 0; fl < 6; fl++) { fillE(g, x - 8 + fl * 6, b - 50 - (fl % 2) * 6, 3.4, 3.4, ['#FFFFFF', '#E0456B', '#FFD84A'][fl % 3]); g.strokeStyle = '#3FAE6B'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(x - 8 + fl * 6, b - 46 - (fl % 2) * 6); g.lineTo(x - 6 + fl * 3, b - 42); g.stroke(); }
    g.fillStyle = '#2A3550'; g.beginPath(); g.moveTo(x + 74, b); g.lineTo(x + 84, b - 50); g.lineTo(x + 108, b - 50); g.lineTo(x + 118, b); g.lineTo(x + 112, b); g.lineTo(x + 104, b - 44); g.lineTo(x + 88, b - 44); g.lineTo(x + 80, b); g.closePath(); g.fill();
    fillRR(g, x + 84, b - 48, 24, 34, 2, '#33405E'); text(g, 'FRESH', x + 96, b - 38, 5.6, 800, '#FFFFFF', 'center'); g.fillStyle = 'rgba(255,255,255,.7)'; g.fillRect(x + 88, b - 32, 16, 1.4); g.fillRect(x + 88, b - 26, 12, 1.4); fillE(g, x + 96, b - 19, 3, 3, '#F2B233');
    /* the bench against the houses (the visitor sits on its seat) */
    var bx = VIS.x; soft(g, bx, Q0 + 26, 70, 5, 0.22); fillRR(g, bx - 66, Q0 - 26, 132, 8, 3, '#8E6440'); fillRR(g, bx - 66, Q0 - 14, 132, 8, 3, '#8E6440');
    fillRR(g, bx - 70, Q0 + 4, 140, 9, 3, '#B98A5E'); [bx - 60, bx + 54].forEach(function (lx) { fillRR(g, lx, Q0 + 12, 6, 14, 2, '#2A3550'); fillRR(g, lx, Q0 - 28, 6, 34, 2, '#2A3550'); });
  }
  function shop(g) {
    var x = SHOP.x, w = SHOP.w, base = Q0 - 2, wn = SHOP.win, dr = SHOP.door;
    soft(g, x + w / 2, base + 3, w * 0.55, 8, 0.24);
    /* the Dutch gable, the upper floor, the chimney */
    fillRR(g, x + w - 52, -128, 22, 70, 2, '#2A3550'); fillRR(g, x + w - 55, -132, 28, 7, 2, '#1F2A55');
    g.fillStyle = BLUE; g.beginPath(); g.moveTo(x + 6, -62); g.lineTo(x + 70, -62); g.quadraticCurveTo(x + 76, -96, x + 100, -100); g.lineTo(x + 108, -128); g.quadraticCurveTo(x + w / 2, -170, x + w - 108, -128); g.lineTo(x + w - 100, -100); g.quadraticCurveTo(x + w - 76, -96, x + w - 70, -62); g.lineTo(x + w - 6, -62); g.lineTo(x + w - 6, 44); g.lineTo(x + 6, 44); g.closePath(); g.fill();
    g.strokeStyle = '#FFFFFF'; g.lineWidth = 4; g.beginPath(); g.moveTo(x + 4, -62); g.lineTo(x + 70, -62); g.quadraticCurveTo(x + 76, -96, x + 100, -100); g.lineTo(x + 108, -128); g.quadraticCurveTo(x + w / 2, -170, x + w - 108, -128); g.lineTo(x + w - 100, -100); g.quadraticCurveTo(x + w - 76, -96, x + w - 70, -62); g.lineTo(x + w - 4, -62); g.stroke();
    fillE(g, x + w / 2, -116, 16, 16, '#FFFFFF'); fillE(g, x + w / 2, -116, 12, 12, '#CFE6F7'); mark(g, x + w / 2, -117, 0.7, GOLD, NAVY);
    [x + 36, x + 128, x + 220].forEach(function (wx) { win(g, wx, -36, 52, 50, '#FFFFFF', '#CFE6F7'); flowers(g, wx - 4, 16, 60, wx > x + 100 && wx < x + 200 ? GOLD_L : '#E0456B'); });
    /* the ground floor: the facade, the sign, the awning, the display window (a browser), the postbox, the door */
    fillRR(g, x, 40, w, base - 40, 3, BLUE); g.fillStyle = 'rgba(20,30,80,.1)'; g.fillRect(x + w - 12, 40, 12, base - 40); g.fillStyle = 'rgba(255,255,255,.08)'; g.fillRect(x, 40, 10, base - 40);
    fillRR(g, x - 4, 38, w + 8, 8, 2, '#FFFFFF');
    fillRR(g, x + 12, 50, w - 24, 30, 4, NAVY); mark(g, x + 44, 66, 0.82, GOLD_L, '#FFFFFF'); text(g, 'YOUR COMPANY', x + w / 2 + 12, 71, 17, 800, GOLD_L, 'center'); g.fillStyle = GOLD; g.fillRect(x + 12, 77, w - 24, 3);
    for (var s = 0; s < 14; s++) { fillRR(g, x + 14 + s * 20.3, 86, 20.3, 32, s === 0 || s === 13 ? 4 : 0, s % 2 ? '#FFFFFF' : BLUE_L); }
    for (var sc = 0; sc < 14; sc++) { g.fillStyle = sc % 2 ? '#FFFFFF' : BLUE_L; g.beginPath(); g.arc(x + 24 + sc * 20.3, 118, 10, 0, Math.PI); g.fill(); } g.fillStyle = GOLD; g.fillRect(x + 14, 116, w - 28, 2.5);
    shadowed(g, 10, 4, 0.18, function () { fillRR(g, wn.x - 6, wn.y - 6, wn.w + 12, wn.h + 12, 6, '#FFFFFF'); });
    fillRR(g, wn.x, wn.y, wn.w, 18, 3, '#EEF2F8'); [0, 1, 2].forEach(function (d) { fillE(g, wn.x + 10 + d * 9, wn.y + 9, 3, 3, ['#FF6F6F', '#FFC94A', '#2BC48A'][d]); });
    fillRR(g, wn.x + 40, wn.y + 4, wn.w - 50, 10, 5, '#FFFFFF'); g.fillStyle = '#2BC48A'; fillRR(g, wn.x + 46, wn.y + 6.5, 4.5, 5, 1, '#2BC48A'); text(g, 'yourcompany.com', wn.x + 55, wn.y + 12, 7, 700, '#5C6B7A');
    fillRR(g, wn.x - 10, wn.y + wn.h + 6, wn.w + 20, 8, 2, '#FFFFFF'); flowers(g, wn.x + 8, wn.y + wn.h + 16, wn.w - 16, '#E0456B');
    /* below the window: panelled wall */
    g.strokeStyle = 'rgba(255,255,255,.22)'; g.lineWidth = 2; [wn.x, wn.x + 92].forEach(function (px) { rr(g, px, 318, 86, 112, 4); g.stroke(); });
    /* the postbox: two slots, Sales and Support (live flag) */
    var m = MAIL; fillRR(g, m.x, m.y, 26, 48, 5, NAVY); fillRR(g, m.x + 3, m.y + 4, 20, 4, 2, GOLD); fillRR(g, m.x + 5, m.y + 15, 16, 3, 1.5, '#0B1236'); fillRR(g, m.x + 5, m.y + 29, 16, 3, 1.5, '#0B1236');
    text(g, 'SALES', m.x + 13, m.y + 25, 4.6, 800, '#FFFFFF', 'center'); text(g, 'SUPPORT', m.x + 13, m.y + 39, 4.2, 800, '#FFFFFF', 'center');
    /* the door: glass top, brass, a bell above, a step */
    fillRR(g, dr.x - 6, dr.y - 6, dr.w + 12, base - dr.y + 6, 4, '#FFFFFF'); fillRR(g, dr.x, dr.y, dr.w, base - dr.y, 3, NAVY);
    fillRR(g, dr.x + 8, dr.y + 10, dr.w - 16, 108, 3, '#BFE0F5'); g.fillStyle = 'rgba(255,255,255,.5)'; g.beginPath(); g.moveTo(dr.x + 12, dr.y + 110); g.lineTo(dr.x + 30, dr.y + 14); g.lineTo(dr.x + 40, dr.y + 14); g.lineTo(dr.x + 20, dr.y + 110); g.closePath(); g.fill();
    g.strokeStyle = 'rgba(255,255,255,.18)'; g.lineWidth = 2; rr(g, dr.x + 8, dr.y + 132, dr.w - 16, 100, 3); g.stroke(); fillE(g, dr.x + dr.w - 10, dr.y + 128, 3.5, 3.5, GOLD);
    text(g, 'Contact us', dr.x + dr.w / 2, dr.y + 252, 6.6, 800, GOLD_L, 'center');
    g.strokeStyle = '#9AA6BC'; g.lineWidth = 2; g.beginPath(); g.moveTo(dr.x + dr.w / 2, dr.y - 8); g.lineTo(dr.x + dr.w / 2, dr.y - 2); g.stroke();
    fillRR(g, dr.x - 10, base - 6, dr.w + 20, 10, 3, '#D8CDB9');
    /* the developer's cafe chair (its back sits behind him) */
    var cx = DEV.x; g.strokeStyle = '#2A3550'; g.lineWidth = 3; g.lineCap = 'round'; g.beginPath(); g.moveTo(cx - 26, 438); g.lineTo(cx - 32, 466); g.moveTo(cx + 26, 438); g.lineTo(cx + 32, 466); g.moveTo(cx - 20, 438); g.lineTo(cx - 14, 466); g.moveTo(cx + 20, 438); g.lineTo(cx + 14, 466); g.stroke();
    g.beginPath(); g.moveTo(cx - 30, 438); g.lineTo(cx - 34, 352); g.quadraticCurveTo(cx, 336, cx + 34, 352); g.lineTo(cx + 30, 438); g.stroke(); fillE(g, cx, 438, 34, 5, '#2A3550');
  }
  function office(g) {
    var x = OFF.x, w = OFF.w, base = Q0 - 2, n = NB;
    soft(g, x + w / 2, base + 3, w * 0.55, 8, 0.22);
    g.fillStyle = '#C9624A'; g.beginPath(); g.moveTo(x - 10, -8); g.lineTo(x + 30, -62); g.lineTo(x + w - 30, -62); g.lineTo(x + w + 10, -8); g.closePath(); g.fill();
    g.fillStyle = 'rgba(255,255,255,.12)'; for (var t2 = 0; t2 < 7; t2++) g.fillRect(x + 4 + t2 * 32, -30 + (t2 % 2) * 4, 26, 3);
    fillRR(g, x, -10, w, base + 10, 3, '#BFE3D4'); g.fillStyle = 'rgba(20,80,70,.08)'; g.fillRect(x + w - 12, -10, 12, base + 10);
    fillRR(g, x - 4, 128, w + 8, 8, 2, '#FFFFFF'); fillRR(g, x - 4, -12, w + 8, 6, 2, '#FFFFFF');
    [x + 18, x + w - 66].forEach(function (wx) { win(g, wx, 14, 48, 72, '#FFFFFF', '#CFE6F7', '#2EA597'); });
    fillRR(g, x + w / 2 - 50, 98, 100, 22, 4, '#FFFFFF'); text(g, 'HARBOUR OFFICE', x + w / 2, 113, 9.6, 800, '#127A64', 'center');
    K.clockFace(g, { x: CLK.x, y: CLK.y, r: CLK.r }, '#2EA597');
    /* the flagpole on the roof (the toy raises signal flags) */
    g.fillStyle = '#E3E8EF'; g.fillRect(POLE.x - 1.5, POLE.y1, 3, POLE.y0 - POLE.y1 + 4); fillE(g, POLE.x, POLE.y1 - 2, 4, 4, GOLD);
    /* the town noticeboard: a little roof, the client's header band; the posts are live */
    g.fillStyle = '#8E6440'; g.fillRect(n.x + 8, n.y + n.h, 8, base - n.y - n.h); g.fillRect(n.x + n.w - 16, n.y + n.h, 8, base - n.y - n.h);
    shadowed(g, 12, 5, 0.2, function () { fillRR(g, n.x - 6, n.y - 4, n.w + 12, n.h + 10, 6, '#A9774B'); });
    tri(g, [n.x - 14, n.y - 2], [n.x + n.w / 2, n.y - 26], [n.x + n.w + 14, n.y - 2], '#8E6440'); g.fillStyle = '#C9624A'; g.beginPath(); g.moveTo(n.x - 10, n.y - 4); g.lineTo(n.x + n.w / 2, n.y - 22); g.lineTo(n.x + n.w + 10, n.y - 4); g.closePath(); g.fill();
    fillRR(g, n.x, n.y + 2, n.w, n.h - 2, 4, '#E8C99A'); g.fillStyle = 'rgba(150,100,50,.12)'; for (var dt = 0; dt < 80; dt++) g.fillRect(n.x + hash(dt) * n.w, n.y + 4 + hash(dt * 3.3) * (n.h - 8), 2, 2);
    fillRR(g, n.x + 4, n.y + 6, n.w - 8, 20, 4, BLUE); mark(g, n.x + 18, n.y + 16, 0.5, GOLD_L, '#FFFFFF'); text(g, '@yourcompany · this week', n.x + 30, n.y + 20, 8.6, 800, '#FFFFFF');
    /* a bench and a life ring on the office wall */
    fillE(g, x + w - 26, 170, 16, 16, '#FFFFFF'); g.strokeStyle = '#E0456B'; g.lineWidth = 7; g.setLineDash([12.5, 12.5]); g.beginPath(); g.arc(x + w - 26, 170, 12.5, 0, 7); g.stroke(); g.setLineDash([]); fillE(g, x + w - 26, 170, 8, 8, '#BFE3D4');
  }
  function boat(g) {
    var b = BOAT, x = b.x, y = b.y, w = b.w;
    soft(g, x + w / 2, Q0 + 4, w * 0.6, 7, 0.26);
    /* the cradle: two timber trestles and a ladder */
    [x + 26, x + w - 30].forEach(function (lx) { g.fillStyle = '#9C7048'; g.beginPath(); g.moveTo(lx - 16, Q0); g.lineTo(lx - 4, y + 70); g.lineTo(lx + 4, y + 70); g.lineTo(lx + 16, Q0); g.lineTo(lx + 10, Q0); g.lineTo(lx, y + 80); g.lineTo(lx - 10, Q0); g.closePath(); g.fill(); fillRR(g, lx - 22, y + 66, 44, 7, 2, '#B98A5E'); });
    /* the wheelhouse and the mast */
    fillRR(g, x + 14, y - 46, 50, 48, 5, '#FFFFFF'); fillRR(g, x + 10, y - 52, 58, 9, 3, NAVY); [0, 1].forEach(function (i) { fillRR(g, x + 20 + i * 22, y - 36, 16, 14, 2, '#BFE0F5'); });
    g.fillStyle = '#9AA6BC'; g.fillRect(x + 38, y - 112, 3, 60); g.strokeStyle = '#9AA6BC'; g.lineWidth = 1; g.beginPath(); g.moveTo(x + 39, y - 110); g.lineTo(x - 4, y - 2); g.moveTo(x + 39, y - 110); g.lineTo(x + 70, y - 2); g.stroke();
    g.fillStyle = GOLD_L; g.beginPath(); g.moveTo(x + 41, y - 112); g.lineTo(x + 62, y - 106); g.lineTo(x + 41, y - 100); g.closePath(); g.fill();
    /* the hull: white, the livery band (painted live), a name on the bow */
    g.fillStyle = '#FFFFFF'; g.beginPath(); g.moveTo(x - 6, y); g.lineTo(x + w + 10, y - 6); g.quadraticCurveTo(x + w + 2, y + 50, x + w - 26, y + 72); g.lineTo(x + 24, y + 72); g.quadraticCurveTo(x - 2, y + 50, x - 6, y); g.closePath(); g.fill();
    g.fillStyle = 'rgba(20,40,90,.08)'; g.beginPath(); g.moveTo(x + 4, y + 46); g.lineTo(x + w - 2, y + 44); g.quadraticCurveTo(x + w - 10, y + 62, x + w - 26, y + 72); g.lineTo(x + 24, y + 72); g.closePath(); g.fill();
    fillRR(g, x - 8, y - 4, w + 20, 6, 3, '#E3E8EF');
    /* paint tins under the hull, a tray on the gunwale */
    [[x + 52, BLUE], [x + 64, GOLD], [x + 76, '#FFFFFF'], [x + 88, NAVY]].forEach(function (c) { fillRR(g, c[0], Q0 - 20, 10, 18, 2, '#C9D3DE'); fillRR(g, c[0] + 1, Q0 - 19, 8, 5, 2, c[1]); });
    fillRR(g, x + w - 18, y - 12, 30, 9, 3, '#C9D3DE'); fillRR(g, x + w - 15, y - 11, 24, 4, 2, BLUE);
    /* the brand guide propped against the trestle */
    g.save(); g.translate(x + 2, Q0 - 2); g.rotate(-0.12); fillRR(g, -14, -40, 28, 40, 3, NAVY); fillRR(g, -10, -34, 20, 3, 1, GOLD); mark(g, 0, -19, 0.55, GOLD_L, '#FFFFFF'); text(g, 'BRAND', 0, -6, 5, 800, '#FFFFFF', 'center'); g.restore();
  }
  function board(g) {
    var b = BOARD;
    [b.x + 10, b.x + b.w - 10].forEach(function (px) { fillRR(g, px - 4, b.y + b.h, 8, Q0 - b.y - b.h, 2, '#8E6440'); g.fillStyle = 'rgba(255,255,255,.2)'; g.fillRect(px - 3, b.y + b.h, 2, Q0 - b.y - b.h); });
    shadowed(g, 12, 5, 0.2, function () { fillRR(g, b.x - 4, b.y - 4, b.w + 8, b.h + 8, 7, '#FFFFFF'); });
    fillRR(g, b.x - 4, b.y - 4, b.w + 8, 24, 7, NAVY); g.fillRect(b.x - 4, b.y + 10, b.w + 8, 10); text(g, 'MONTHLY REPORT', b.x + b.w / 2, b.y + 8, 7.6, 800, '#FFFFFF', 'center'); text(g, 'one page · sample', b.x + b.w / 2, b.y + 17, 5.6, 700, GOLD_L, 'center');
    ['Visits', 'Enquiries', 'Followers'].forEach(function (l, i) { var gx = b.x + 8 + i * 30; fillRR(g, gx, b.y + 28, 22, 86, 3, '#EEF5FB'); g.fillStyle = '#9AA6BC'; for (var tk = 0; tk < 8; tk++) g.fillRect(gx, b.y + 34 + tk * 10, tk % 2 ? 4 : 7, 1.2); text(g, l, gx + 11, b.y + 124, 5.2, 800, '#3D4560', 'center'); });
    g.fillStyle = '#E3E8EF'; g.fillRect(b.x + 6, b.y + 130, b.w - 12, 1.2); text(g, 'Next month’s plan', b.x + 8, b.y + 141, 6, 800, NAVY);
  }
  function rightPier(g, ext) {
    /* the harbourmaster's hut at the end of the pier, a windsock mast, a boat moored in the livery */
    var hx = 1030; soft(g, hx + 60, Q0 + 4, 80, 7, 0.22); fillRR(g, hx, 300, 120, Q0 - 300, 3, '#FFFFFF'); tri(g, [hx - 10, 302], [hx + 60, 256], [hx + 130, 302], NAVY);
    win(g, hx + 16, 330, 34, 36, BLUE, '#CFE6F7'); fillRR(g, hx + 70, 340, 34, Q0 - 342, 3, BLUE); fillE(g, hx + 98, 400, 2.5, 2.5, GOLD);
    fillE(g, hx + 36, 410, 14, 14, '#FFFFFF'); g.strokeStyle = '#E0456B'; g.lineWidth = 6; g.setLineDash([11, 11]); g.beginPath(); g.arc(hx + 36, 410, 11, 0, 7); g.stroke(); g.setLineDash([]); fillE(g, hx + 36, 410, 7, 7, '#FFFFFF');
    fillRR(g, hx + 20, 282, 80, 16, 4, '#FFFFFF'); text(g, 'HARBOURMASTER', hx + 60, 294, 7, 800, NAVY, 'center');
    g.fillStyle = '#C9D3DE'; g.fillRect(1196, 120, 3, Q0 - 120); fillE(g, 1197, Q0 - 2, 10, 3, '#9AA6BC');
    /* stacked lobster pots and a coil of rope */
    [[1170, 0], [1196, 0], [1183, -24]].forEach(function (p) { fillRR(g, p[0] - 12, Q0 - 26 + p[1], 26, 24, 5, '#C9A06A'); g.strokeStyle = 'rgba(90,60,30,.5)'; g.lineWidth = 1; for (var q = 0; q < 4; q++) { g.beginPath(); g.moveTo(p[0] - 10 + q * 7, Q0 - 24 + p[1]); g.lineTo(p[0] - 10 + q * 7, Q0 - 4 + p[1]); g.stroke(); } });
  }
  /* ---------------- static front props: the cafe table, the A-frame (a landing page) ---------------- */
  function paintFront(g, ext) {
    boat(g);
    var tb = TABLE; soft(g, tb.x, Q0 + 6, 34, 5, 0.25); g.fillStyle = '#2A3550'; g.fillRect(tb.x - 2, tb.y + 4, 4, F - 6 - tb.y); fillE(g, tb.x, F - 4, 16, 4, '#2A3550');
    fillE(g, tb.x, tb.y + 2, 38, 7, '#C9D3DE'); fillE(g, tb.x, tb.y, 38, 6.5, '#FFFFFF');
    /* the laptop: its base on the table, beside the developer (its screen is live) */
    fillRR(g, tb.x - 14, tb.y - 6, 40, 5, 2, '#AEB8C8'); g.save(); g.translate(tb.x + 6, tb.y - 6); g.rotate(-0.06); fillRR(g, -20, -32, 40, 32, 3, '#3A4458'); g.restore();
    /* the A-frame on the cobbles: one campaign, one page, one form */
    var a = AF; soft(g, a.x + 22, F + 2, 30, 4, 0.25); g.fillStyle = '#1F2A55'; g.beginPath(); g.moveTo(a.x + 2, F); g.lineTo(a.x + 10, a.y); g.lineTo(a.x + 14, a.y); g.lineTo(a.x + 8, F); g.closePath(); g.fill(); g.beginPath(); g.moveTo(a.x + 42, F); g.lineTo(a.x + 34, a.y); g.lineTo(a.x + 30, a.y); g.lineTo(a.x + 36, F); g.closePath(); g.fill();
    fillRR(g, a.x + 2, a.y - 4, 40, 72, 4, BLUE); fillRR(g, a.x + 5, a.y, 34, 64, 3, '#FFFFFF');
    text(g, 'ONE OFFER', a.x + 22, a.y + 9, 5.4, 800, NAVY, 'center'); fillRR(g, a.x + 8, a.y + 12, 28, 18, 2, '#CFE6F7'); fillE(g, a.x + 30, a.y + 16, 3, 3, GOLD_L); tri(g, [a.x + 10, a.y + 30], [a.x + 20, a.y + 20], [a.x + 30, a.y + 30], '#7FB4E8');
    g.fillStyle = '#C9D3E3'; g.fillRect(a.x + 8, a.y + 34, 28, 2.4); g.fillRect(a.x + 8, a.y + 39, 20, 2.4); fillRR(g, a.x + 8, a.y + 44, 28, 6, 1.5, '#EEF2F8'); text(g, 'ONE FORM', a.x + 22, a.y + 61, 4.6, 800, '#5C6B7A', 'center');
  }
  /* ---------------- static foreground: bollards, rope, crates, a flower barrow, the rowing boat ---------------- */
  function paintFore(g, ext) {
    function bollard(x) { soft(g, x, 704, 18, 4, 0.3); fillRR(g, x - 12, 660, 24, 42, 6, '#2A3550'); fillE(g, x, 660, 16, 7, '#3A4458'); fillE(g, x, 657, 13, 5, '#4A5468'); g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(x - 8, 664, 4, 34); }
    function rope(x, y) { for (var r = 0; r < 4; r++) { g.strokeStyle = r % 2 ? '#D9B57A' : '#C9A06A'; g.lineWidth = 4; g.beginPath(); g.ellipse(x, y - r * 4, 22 - r * 3, 7 - r, 0, 0, Math.PI * 2); g.stroke(); } }
    function crate(x, y, lab) { soft(g, x + 24, y + 30, 30, 4, 0.25); fillRR(g, x, y, 48, 30, 3, '#C99A6B'); g.fillStyle = 'rgba(90,60,30,.25)'; g.fillRect(x, y + 14, 48, 2); g.fillRect(x + 23, y, 2, 30); if (lab) { fillRR(g, x + 6, y + 4, 36, 8, 2, '#FFFFFF'); text(g, lab, x + 24, y + 10.4, 5.4, 800, NAVY, 'center'); } }
    bollard(190); rope(230, 700); bollard(600); bollard(960); rope(920, 700);
    crate(290, 668, 'BROCHURES'); crate(310, 640, 'DECKS'); crate(700, 670, null);
    /* a flower barrow */
    soft(g, 820, 704, 44, 5, 0.25); g.strokeStyle = '#2A3550'; g.lineWidth = 3; g.beginPath(); g.arc(796, 694, 10, 0, 7); g.stroke(); fillRR(g, 784, 660, 76, 26, 5, '#2EA597'); g.fillStyle = '#2EA597'; g.fillRect(856, 666, 26, 3);
    for (var f = 0; f < 10; f++) { fillE(g, 790 + f * 7, 656 - (f % 2) * 4, 5, 5, '#3FAE6B'); fillE(g, 790 + f * 7, 652 - (f % 3) * 4, 3.6, 3.6, ['#E0456B', '#FFD84A', '#FFFFFF', '#B05FC9'][f % 4]); }
    /* the rowing boat in the livery, tied up below the quay */
    var bx = 470, by = 722; soft(g, bx + 60, by + 16, 70, 5, 0.25); g.fillStyle = '#FFFFFF'; g.beginPath(); g.moveTo(bx, by); g.lineTo(bx + 126, by); g.quadraticCurveTo(bx + 116, by + 22, bx + 96, by + 26); g.lineTo(bx + 22, by + 26); g.quadraticCurveTo(bx + 6, by + 18, bx, by); g.closePath(); g.fill();
    g.fillStyle = BLUE; g.fillRect(bx + 4, by + 6, 118, 7); g.fillStyle = GOLD; g.fillRect(bx + 4, by + 14, 118, 2); mark(g, bx + 104, by + 10, 0.4, '#FFFFFF', '#FFFFFF');
    g.strokeStyle = '#C9A06A'; g.lineWidth = 2; g.beginPath(); g.moveTo(bx + 2, by); g.quadraticCurveTo(bx - 20, by - 30, bx - 26, by - 40); g.stroke();
    /* under the title card only low things: rope coils, a lobster pot, a mooring ring */
    rope(-330, 700); rope(-120, 702);
    soft(g, -430, 704, 24, 4, 0.25); fillRR(g, -452, 680, 44, 22, 8, '#C9A06A'); g.strokeStyle = 'rgba(90,60,30,.5)'; g.lineWidth = 1.2; for (var lp = 0; lp < 6; lp++) { g.beginPath(); g.moveTo(-448 + lp * 7, 682); g.lineTo(-448 + lp * 7, 700); g.stroke(); }
    g.strokeStyle = '#3A4458'; g.lineWidth = 3; g.beginPath(); g.ellipse(-230, 708, 10, 4, 0, 0, 7); g.stroke();
    /* a chalk pavement sign pointing to the shop */
    var ps = 76; soft(g, ps + 18, 612, 26, 4, 0.25); g.fillStyle = '#2A3550'; g.beginPath(); g.moveTo(ps, 610); g.lineTo(ps + 8, 556); g.lineTo(ps + 30, 556); g.lineTo(ps + 38, 610); g.lineTo(ps + 32, 610); g.lineTo(ps + 26, 562); g.lineTo(ps + 12, 562); g.lineTo(ps + 6, 610); g.closePath(); g.fill();
    fillRR(g, ps + 8, 558, 22, 40, 2, '#33405E'); text(g, 'THIS', ps + 19, 570, 5.4, 800, '#FFFFFF', 'center'); text(g, 'WAY', ps + 19, 578, 5.4, 800, '#FFFFFF', 'center'); g.fillStyle = GOLD_L; g.beginPath(); g.moveTo(ps + 11, 588); g.lineTo(ps + 23, 588); g.lineTo(ps + 23, 584); g.lineTo(ps + 29, 590); g.lineTo(ps + 23, 596); g.lineTo(ps + 23, 592); g.lineTo(ps + 11, 592); g.closePath(); g.fill();
    if (ext.r > 1100) { bollard(1180); crate(1100, 668, 'NETS'); }
  }

  /* ---------------- live: smoke, bunting, the window, the noticeboard, the tide board, the postbox, flags ---------------- */
  var POSTS = [[0, BLUE, 'sun'], [1, '#F2B233', 'wave'], [2, '#E0567A', 'shop'], [0, '#2EA597', 'boat'], [1, '#7B5CD6', 'star'], [2, BLUE, 'sun']];
  var CH = [['in', '#0A66C2'], ['f', '#1877F2'], ['ig', '#D9367A']];
  var FX = [], ENV = [], TAP = {}, FLAGS = { t: -9 };
  function postIcon(g, kind, x, y, col) {
    if (kind === 'sun') { fillE(g, x, y, 5, 5, '#FFD84A'); g.fillStyle = col; g.fillRect(x - 12, y + 6, 24, 4); }
    else if (kind === 'wave') { g.strokeStyle = '#FFFFFF'; g.lineWidth = 2; g.beginPath(); g.moveTo(x - 12, y + 4); g.quadraticCurveTo(x - 6, y - 2, x, y + 4); g.quadraticCurveTo(x + 6, y + 10, x + 12, y + 4); g.stroke(); }
    else if (kind === 'shop') { fillRR(g, x - 9, y - 4, 18, 12, 1, '#FFFFFF'); tri(g, [x - 11, y - 3], [x, y - 10], [x + 11, y - 3], '#FFFFFF'); }
    else if (kind === 'boat') { tri(g, [x, y - 10], [x, y + 2], [x + 8, y + 2], '#FFFFFF'); fillRR(g, x - 10, y + 3, 20, 4, 2, '#FFFFFF'); }
    else { g.fillStyle = '#FFFFFF'; g.beginPath(); for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 2.6 : 6; g.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); } g.closePath(); g.fill(); }
  }
  function paintLive(g, t, now, S) {
    var e = S.ext;
    /* chimney smoke and the cat in the upper window */
    for (var p = 0; p < 4; p++) { var u = ((t * 0.22 + p / 4) % 1); fillE(g, SHOP.x + SHOP.w - 41 + Math.sin(u * 4 + p) * 8 + u * 30, -134 - u * 90, 6 + u * 12, 5 + u * 9, 'rgba(235,240,246,' + (0.7 * (1 - u)).toFixed(2) + ')'); }
    var cw = SHOP.x + 128, tl = Math.sin(t * 2.2) * 0.5; fillE(g, cw + 26, 4, 10, 8, '#3A4458'); fillE(g, cw + 26, -6, 7, 6.5, '#3A4458'); tri(g, [cw + 20, -10], [cw + 21, -17], [cw + 25, -11], '#3A4458'); tri(g, [cw + 27, -11], [cw + 31, -17], [cw + 32, -10], '#3A4458'); fillE(g, cw + 23.5, -6, 1.3, 1.3, '#FFD84A'); fillE(g, cw + 28.5, -6, 1.3, 1.3, '#FFD84A');
    g.strokeStyle = '#3A4458'; g.lineWidth = 2.4; g.lineCap = 'round'; g.beginPath(); g.moveTo(cw + 34, 8); g.quadraticCurveTo(cw + 44 + tl * 6, 0, cw + 42 + tl * 10, -10); g.stroke();
    /* bunting across the harbour: the client's colours */
    var bc = [BLUE, GOLD_L, '#FFFFFF', BLUE_L];
    bunting(g, [SHOP.x + SHOP.w - 10, -60], [POLE.x, POLE.y1 + 8], 34, 12, t, bc);
    bunting(g, [POLE.x, POLE.y1 + 8], [LH.x - 6, LH.gal - 6], 30, 7, t, bc);
    bunting(g, [LH.x + 6, LH.gal - 6], [BOARD.x + BOARD.w + 10, BOARD.y - 6], 26, 7, t, bc);
    if (e.r > 1000) bunting(g, [BOARD.x + BOARD.w + 10, BOARD.y - 6], [1196, 122], 22, 8, t, bc);
    if (e.l < 120) bunting(g, [SHOP.x + 6, -60], [e.l - 40, -130], 40, Math.max(6, Math.round((SHOP.x - e.l) / 30)), t, ['#E0456B', '#FFD84A', '#2EA597', '#FFFFFF']);
    /* the flag on the pole, and the signal flags when the toy runs */
    var fl = Math.sin(t * 6); g.fillStyle = BLUE; g.beginPath(); g.moveTo(POLE.x + 1, POLE.y1); g.quadraticCurveTo(POLE.x + 14, POLE.y1 + 2 + fl * 3, POLE.x + 28, POLE.y1 + 4 + fl * 4); g.lineTo(POLE.x + 28, POLE.y1 + 18 + fl * 4); g.quadraticCurveTo(POLE.x + 14, POLE.y1 + 16 + fl * 3, POLE.x + 1, POLE.y1 + 16); g.closePath(); g.fill(); mark(g, POLE.x + 14, POLE.y1 + 9 + fl * 2, 0.36, GOLD_L, '#FFFFFF');
    var fu = t - FLAGS.t; if (fu >= 0 && fu < 7) { var up = fu < 1.2 ? smooth(fu / 1.2) : fu > 6 ? 1 - smooth(fu - 6) : 1, top = lerp(POLE.y0 - 4, POLE.y1 + 26, up);
      [['#E0456B', '#FFFFFF'], ['#FFD84A', BLUE], ['#2BC48A', '#FFFFFF'], [BLUE, '#FFD84A']].forEach(function (c, i) { var fy = top + i * 15, fx = POLE.x + 3 + Math.sin(t * 7 + i) * 1.5; fillRR(g, fx, fy, 14, 12, 1, c[0]); fillRR(g, fx + 4, fy + 3, 6, 6, 1, c[1]); }); }
    /* the shop window: the website, cycling Home, Services, Contact */
    website(g, t, S);
    /* the noticeboard: the feed of posts */
    feed(g, t, S);
    /* the office clock (Singapore time) */
    var d = new Date(Date.now() + 8 * 3600e3); K.clockHands(g, { x: CLK.x, y: CLK.y, r: CLK.r }, d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds());
    /* the tide board: three gauges rise like the tide; next month's plan ticks off */
    tide(g, t, S);
    /* gulls perched: one on the tide board, one on the shop gable */
    perch(g, BOARD.x + BOARD.w - 14, BOARD.y - 6, t, 0); perch(g, SHOP.x + SHOP.w / 2 + 2, -155, t, 1.7);
    /* the moored boat bobbing (wide screens), the near-water sparkles */
    if (e.r > 1150) { var mb = Math.sin(t * 1.4) * 2; sailboat(g, 1260, 436 + mb, 0.9, BLUE, GOLD, '#FFFFFF', BLUE, Math.sin(t * 1.1) * 0.03); }
    g.fillStyle = 'rgba(255,255,255,.8)'; for (var s = 0; s < 16; s++) { var wx = e.l + hash(s * 3.1) * (e.r - e.l), wy = QE + 24 + hash(s * 1.3) * 60, tw = Math.sin(t * 2 + s * 1.7); if (tw > 0.4) g.fillRect(wx - 5 * tw, wy, 10 * tw, 1.6); }
    CO.crew(CREW, g, t, S, false);
  }
  function perch(g, x, y, t, ph) { var b = Math.sin(t * 1.3 + ph), peck = (t + ph) % 6 < 0.4; g.save(); g.translate(x, y); fillE(g, 0, 0, 8, 5.5, '#FFFFFF'); fillE(g, 2, -1, 6, 3, '#C9D3DE'); fillE(g, -7 + b, -6 + (peck ? 3 : 0), 4, 4, '#FFFFFF'); tri(g, [-11 + b, -6 + (peck ? 3 : 0)], [-16 + b, -5 + (peck ? 4 : 0)], [-11 + b, -4 + (peck ? 3 : 0)], '#F2B233'); fillE(g, -8 + b, -7 + (peck ? 3 : 0), 0.9, 0.9, INK); g.fillStyle = '#F2B233'; g.fillRect(-2, 5, 1.2, 4); g.fillRect(2, 5, 1.2, 4); g.restore(); }
  var WEB_C = 12;
  function website(g, t, S) {
    var wn = SHOP.win, x = wn.x + 4, y = wn.y + 20, w = wn.w - 8, h = wn.h - 24, p = (t + 2) % WEB_C;
    if (S.hot === 'website' && S.kT) p = ((t - S.kT) * 1.4 + 9) % WEB_C;
    var page = p < 4 ? 0 : p < 8 ? 1 : 2;
    fillRR(g, x, y, w, h, 2, '#FFFFFF');
    fillRR(g, x, y, w, 12, 1, '#F7F9FC'); mark(g, x + 9, y + 6, 0.32, BLUE, BLUE); ['Home', 'Services', 'Contact'].forEach(function (l, i) { text(g, l, x + 26 + i * 34, y + 8.6, 5.6, 800, i === page ? BLUE : '#8A96A8'); });
    fillRR(g, x + w - 34, y + 2.5, 30, 7, 3.5, GOLD); text(g, 'Contact', x + w - 19, y + 8, 4.6, 800, '#FFFFFF', 'center');
    var cy = y + 16, cur = null;
    if (page === 0) {
      var hb = g.createLinearGradient(x, cy, x + w, cy); hb.addColorStop(0, '#EAF0FB'); hb.addColorStop(1, '#D7E5FA'); g.fillStyle = hb; g.fillRect(x, cy, w, 62);
      fillRR(g, x + 8, cy + 10, 70, 7, 2, NAVY); fillRR(g, x + 8, cy + 20, 54, 7, 2, NAVY); g.fillStyle = '#9AA6BC'; g.fillRect(x + 8, cy + 32, 64, 2.6); g.fillRect(x + 8, cy + 37, 50, 2.6);
      var bp = p > 2.6 && p < 3.4; fillRR(g, x + 8, cy + 44, 40, 11, 5.5, bp ? '#C98C10' : GOLD); text(g, 'Contact us', x + 28, cy + 51.6, 5.4, 800, '#FFFFFF', 'center');
      fillRR(g, x + w - 70, cy + 8, 62, 46, 4, BLUE_L); mark(g, x + w - 39, cy + 31, 1.1, GOLD_L, '#FFFFFF');
      [0, 1, 2].forEach(function (c) { fillRR(g, x + 8 + c * ((w - 16) / 3), cy + 68, (w - 16) / 3 - 5, 30, 3, '#F4F7FC'); fillE(g, x + 16 + c * ((w - 16) / 3), cy + 76, 4, 4, [BLUE, GOLD, '#2EA597'][c]); g.fillStyle = '#C9D3E3'; g.fillRect(x + 12 + c * ((w - 16) / 3), cy + 85, 34, 2.4); g.fillRect(x + 12 + c * ((w - 16) / 3), cy + 90, 24, 2.4); });
      cur = [lerp(x + w - 30, x + 30, smooth(p / 3)), lerp(cy + 90, cy + 50, smooth(p / 3))];
    } else if (page === 1) {
      var sc = smooth((p - 4) / 3) * 18; fillRR(g, x + 8, cy + 8 - sc, 64, 7, 2, NAVY); g.fillStyle = '#9AA6BC'; g.fillRect(x + 8, cy + 19 - sc, 90, 2.6);
      ['Websites', 'Social', 'Brand'].forEach(function (l, c) { var cx = x + 8 + c * ((w - 16) / 3), cw = (w - 16) / 3 - 5; fillRR(g, cx, cy + 28 - sc, cw, 62, 4, '#F4F7FC'); fillRR(g, cx, cy + 28 - sc, cw, 22, 4, [BLUE_L, GOLD_L, '#7FD3BC'][c]); text(g, l, cx + 5, cy + 60 - sc, 6, 800, NAVY); g.fillStyle = '#C9D3E3'; g.fillRect(cx + 5, cy + 66 - sc, cw - 12, 2.4); g.fillRect(cx + 5, cy + 71 - sc, cw - 20, 2.4); });
      fillRR(g, x + 8, cy + 98 - sc, w - 16, 14, 3, '#EAF0FB');
      cur = [lerp(x + 40, x + w - 20, smooth((p - 4) / 4)), cy + 60];
    } else {
      var fp = clamp((p - 8) / 2.4, 0, 1), sent = p > 10.9;
      text(g, 'Contact us', x + 8, cy + 14, 9, 800, NAVY); g.fillStyle = '#9AA6BC'; g.fillRect(x + 8, cy + 20, 80, 2.4);
      ['Name', 'Company', 'Email'].forEach(function (l, i) { var fy = cy + 28 + i * 18; fillRR(g, x + 8, fy, w - 70, 13, 3, '#F4F7FC'); g.strokeStyle = '#DCE3EE'; g.lineWidth = 1; rr(g, x + 8, fy, w - 70, 13, 3); g.stroke(); var fill = clamp(fp * 3 - i, 0, 1); if (fill > 0) { g.fillStyle = '#3D4560'; g.fillRect(x + 12, fy + 5, (w - 90) * fill * (0.5 + 0.2 * i), 3); } else text(g, l, x + 12, fy + 9, 5, 700, '#A9B3C4'); });
      fillRR(g, x + w - 56, cy + 28, 48, 49, 3, '#F4F7FC'); g.fillStyle = '#C9D3E3'; [0, 1, 2, 3].forEach(function (r) { g.fillRect(x + w - 50, cy + 34 + r * 9, 36 - r * 5, 2.4); });
      fillRR(g, x + 8, cy + 84, 44, 13, 6.5, sent ? '#2BC48A' : BLUE); text(g, sent ? 'Sent ✓' : 'Send', x + 30, cy + 92.6, 6, 800, '#FFFFFF', 'center');
      if (sent) text(g, 'to the right person', x + 58, cy + 92.6, 5.6, 800, '#127A64');
      cur = [lerp(x + w - 30, x + 30, smooth((p - 8) / 2.8)), lerp(cy + 40, cy + 90, smooth((p - 8) / 2.8))];
      if (p > 10.9 && !TAP.envSent) { TAP.envSent = true; ENV.push({ t0: t, x0: SHOP.door.x + 30, y0: SHOP.door.y + 60, x1: MAIL.x + 13, y1: MAIL.y + 16 }); }
    }
    if (p < 10.9) TAP.envSent = false;
    if (cur) { g.save(); g.translate(cur[0], cur[1]); g.fillStyle = INK; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 9); g.lineTo(2.6, 6.6); g.lineTo(5, 10.6); g.lineTo(6.4, 9.8); g.lineTo(4.2, 6); g.lineTo(7.4, 5.8); g.closePath(); g.fill(); g.restore(); }
    /* the OPEN sign behind the door glass, swinging (flipped by the owner) */
    var dr = SHOP.door, sw = Math.sin(t * 2) * 0.04 + (OWN.flip || 0), sx = dr.x + dr.w / 2, sy = dr.y + 40;
    g.strokeStyle = '#C9A06A'; g.lineWidth = 1; g.beginPath(); g.moveTo(sx - 8, dr.y + 16); g.lineTo(sx, dr.y + 10); g.lineTo(sx + 8, dr.y + 16); g.stroke();
    g.save(); g.translate(sx, sy); g.rotate(sw * 0.3); g.scale(Math.cos((OWN.flip || 0) * Math.PI * 2) || 0.05, 1); fillRR(g, -20, -12, 40, 22, 4, '#FFFFFF'); g.strokeStyle = BLUE; g.lineWidth = 1.5; rr(g, -18, -10, 36, 18, 3); g.stroke(); text(g, 'OPEN', 0, 3.4, 9.4, 800, BLUE, 'center'); g.restore();
    /* the postbox flag and envelopes on their way in */
    var lastE = ENV.length ? ENV[ENV.length - 1].t0 : -9, up = t - lastE < 4.5;
    g.save(); g.translate(MAIL.x + 26, MAIL.y + 12); g.rotate(up ? -1.4 : 0); fillRR(g, 0, -2, 14, 4, 2, '#7A869C'); fillRR(g, 10, -6, 7, 8, 1.5, '#E0456B'); g.restore();
  }
  function feed(g, t, S) {
    var n = NB, cw = 52, ch = 66, gx = n.x + 8, gy = n.y + 32, newest = Math.floor((t + 1) / 10) % 6, pin = SOC.pinU || 0;
    for (var i = 0; i < 6; i++) { var c = i % 3, r = Math.floor(i / 3), x = gx + c * (cw + 5), y = gy + r * (ch + 6), P = POSTS[i], isNew = i === newest, a = isNew ? pin : 1;
      if (a <= 0.01) { g.strokeStyle = 'rgba(120,80,40,.3)'; g.setLineDash([3, 3]); g.lineWidth = 1; rr(g, x, y, cw, ch, 3); g.stroke(); g.setLineDash([]); continue; }
      g.save(); g.globalAlpha = a; g.translate(x + cw / 2, y + ch / 2 + (1 - a) * 14); g.rotate((hash(i + 3) - 0.5) * 0.06 + (1 - a) * 0.3);
      fillRR(g, -cw / 2, -ch / 2, cw, ch, 3, '#FFFFFF'); var chn = CH[P[0]]; fillRR(g, -cw / 2 + 4, -ch / 2 + 4, 12, 8, 2, chn[1]); text(g, chn[0], -cw / 2 + 10, -ch / 2 + 10, 5.4, 800, '#FFFFFF', 'center');
      g.fillStyle = '#C9D3E3'; g.fillRect(-cw / 2 + 19, -ch / 2 + 6.5, 20, 2.4);
      fillRR(g, -cw / 2 + 4, -ch / 2 + 15, cw - 8, 26, 2, P[1]); postIcon(g, P[2], 0, -ch / 2 + 27, P[1] === BLUE ? GOLD : BLUE);
      g.fillStyle = '#C9D3E3'; g.fillRect(-cw / 2 + 4, -ch / 2 + 45, cw - 14, 2.4); g.fillRect(-cw / 2 + 4, -ch / 2 + 50, cw - 22, 2.4);
      var likes = 12 + Math.floor(hash(i * 7) * 40) + Math.floor((t + i * 3) / 4) % 9; heart(g, -cw / 2 + 8, -ch / 2 + 59, 2.6, '#E0456B'); text(g, String(likes), -cw / 2 + 13, -ch / 2 + 61, 5, 800, '#5C6B7A');
      if (isNew) { fillRR(g, cw / 2 - 24, -ch / 2 + 55, 20, 8, 4, S.hot === 'social' ? '#2BC48A' : GOLD); text(g, 'NEW', cw / 2 - 14, -ch / 2 + 61, 4.8, 800, '#FFFFFF', 'center'); }
      fillE(g, 0, -ch / 2 + 1, 3, 3, ['#E0456B', '#2EA597', BLUE][i % 3]); g.restore(); }
    /* a heart drifts up from a post now and then */
    var hk = Math.floor(t / 1.6), hu = (t / 1.6) % 1, hi = Math.floor(hash(hk) * 6), hx = gx + (hi % 3) * (cw + 5) + cw - 8, hy = gy + Math.floor(hi / 3) * (ch + 6) + ch - 8 - hu * 40;
    g.save(); g.globalAlpha = 1 - hu; heart(g, hx + Math.sin(hu * 8) * 3, hy, 4 + hu * 2, '#FF6F91'); g.restore();
  }
  var TIDE = [0.78, 0.46, 0.62];
  function tide(g, t, S) {
    var b = BOARD, re = S.hot === 'report' ? clamp((t - (S.kT || 0)) / 1.6, 0, 1) : 1;
    TIDE.forEach(function (lv, i) { var gx = b.x + 8 + i * 30, top = b.y + 28, hgt = 86, l = lv * smooth(re) + Math.sin(t * 1.6 + i) * 0.025, wy = top + hgt * (1 - l);
      g.save(); rr(g, gx, top, 22, hgt, 3); g.clip(); g.fillStyle = ['#4F8FE0', '#F2B233', '#2EA597'][i]; g.beginPath(); g.moveTo(gx, top + hgt); g.lineTo(gx, wy);
      for (var wx = 0; wx <= 22; wx += 2) g.lineTo(gx + wx, wy + Math.sin(t * 4 + wx * 0.5 + i) * 1.4); g.lineTo(gx + 22, top + hgt); g.closePath(); g.fill(); g.fillStyle = 'rgba(255,255,255,.3)'; g.fillRect(gx, wy + 2, 22, 2); g.restore();
      g.fillStyle = '#9AA6BC'; for (var tk = 0; tk < 8; tk++) g.fillRect(gx, top + 6 + tk * 10, tk % 2 ? 4 : 7, 1.2); });
    var plan = Math.floor(t / 2.5) % 4;

    for (var r = 0; r < 3; r++) { var px = b.x + 8 + r * 30, on = r < plan; fillRR(g, px, b.y + 145, 24, 6, 3, on ? '#2BC48A' : '#E3E8EF'); }
    fillE(g, b.x + b.w - 10, b.y + 138, 3, 3, (t % 1) < 0.5 ? GOLD : '#FFE7A3');
  }

  /* ---------------- in front of the cast: the laptop screen, held props, envelopes, effects ---------------- */
  function paintFrontLive(g, t, S) {
    fitCrew(S);
    /* the boat's livery band: the blue stripe and the gold line, a wet sheen behind the roller */
    var b = BOAT, x = b.x, y = b.y;
    g.save(); g.beginPath(); g.moveTo(x - 6, y); g.lineTo(x + b.w + 10, y - 6); g.quadraticCurveTo(x + b.w + 2, y + 50, x + b.w - 26, y + 72); g.lineTo(x + 24, y + 72); g.quadraticCurveTo(x - 2, y + 50, x - 6, y); g.closePath(); g.clip();
    var prog = S.hot === 'brand' ? clamp((t - (S.kT || 0)) / 2.4, 0, 1) : 1, sx0 = x - 10, sx1 = lerp(sx0, x + b.w + 12, prog);
    g.fillStyle = BLUE; g.fillRect(sx0, y + 16, sx1 - sx0, 18); g.fillStyle = GOLD; g.fillRect(sx0, y + 37, sx1 - sx0, 3);
    var rl = DES.roll; if (rl != null) { g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(rl - 16, y + 18, 16, 14); }
    g.restore();
    if (prog > 0.85) { mark(g, x + 22, y + 25, 0.62, '#FFFFFF', '#FFFFFF'); text(g, 'YOUR CO.', x + 36, y + 30, 7, 800, '#FFFFFF'); }
    CO.crew(CREW, g, t, S, true);
    /* the developer's laptop screen: code, then the enquiry form test */
    var lx = TABLE.x + 6, ly = TABLE.y - 6; g.save(); g.translate(lx, ly); g.rotate(-0.06); fillRR(g, -17, -29, 34, 26, 2, '#1E2A3A');
    for (var l = 0; l < 5; l++) { var ww = 6 + hash(l + Math.floor(t * 2)) * 20; fillRR(g, -14 + (l % 2) * 3, -26 + l * 5, ww, 2.2, 1, ['#7FE3C4', '#FFD84A', '#9FC4FF'][l % 3]); }
    if (TAP.dev && t - TAP.dev < 2.4) { fillRR(g, -17, -29, 34, 26, 2, '#FFFFFF'); text(g, 'Enquiry', 0, -18, 5.6, 800, NAVY, 'center'); fillRR(g, -10, -13, 20, 6, 3, '#2BC48A'); text(g, 'Sent', 0, -8.6, 4.6, 800, '#FFFFFF', 'center'); }
    g.restore();
    props(g, t, S);
    /* envelopes flying to the right slot */
    ENV = ENV.filter(function (v) { return t - v.t0 < 1.2; });
    ENV.forEach(function (v) { var u = clamp((t - v.t0) / 0.9, 0, 1), x = lerp(v.x0, v.x1, smooth(u)), y = lerp(v.y0, v.y1, smooth(u)) - Math.sin(u * Math.PI) * 50;
      g.save(); g.translate(x, y); g.rotate(Math.sin(u * 9) * 0.2); g.scale(1 - u * 0.4, 1 - u * 0.4); fillRR(g, -9, -6, 18, 12, 2, '#FFFFFF'); g.strokeStyle = BLUE; g.lineWidth = 1.2; rr(g, -9, -6, 18, 12, 2); g.stroke(); g.beginPath(); g.moveTo(-9, -6); g.lineTo(0, 1); g.lineTo(9, -6); g.stroke(); g.restore(); });
    /* paint flicks and floating likes */
    FX = FX.filter(function (f) { return t - f.t0 < f.life; });
    FX.forEach(function (f) { var u = t - f.t0; if (u < 0) return; var a = 1 - u / f.life, x = f.x + f.vx * u, y = f.y + f.vy * u + (f.k === 'drop' ? 220 * u * u : 0);
      g.save(); g.globalAlpha = clamp(a * 1.3, 0, 1);
      if (f.k === 'drop') fillE(g, x, y, f.r, f.r * 1.2, f.c);
      else if (f.k === 'like') { fillE(g, x, y, 9, 9, f.c); if (f.c === '#E0456B') heart(g, x, y + 1, 3.6, '#FFFFFF'); else { fillRR(g, x - 3.5, y - 1, 3, 6, 1, '#FFFFFF'); fillRR(g, x - 0.5, y - 5, 4, 10, 2, '#FFFFFF'); } }
      else if (f.k === 'flash') { fillE(g, x, y, 30 * (1 - a) + 6, 30 * (1 - a) + 6, 'rgba(255,255,255,' + (a * 0.8).toFixed(2) + ')'); }
      g.restore(); });
  }
  function props(g, t, S) {
    /* the developer: a coffee cup on the table, or at his mouth on a sip */
    var cupAt = DEV.sip ? handAt(DEV, 1) : [TABLE.x - 24, TABLE.y - 2];
    fillRR(g, cupAt[0] - 5, cupAt[1] - 11, 10, 11, 2, '#FFFFFF'); fillRR(g, cupAt[0] - 5, cupAt[1] - 11, 10, 3, 1, GOLD); g.strokeStyle = '#FFFFFF'; g.lineWidth = 1.6; g.beginPath(); g.arc(cupAt[0] + 6, cupAt[1] - 6, 2.6, -1.4, 1.4); g.stroke();
    if (!DEV.sip) { g.strokeStyle = 'rgba(170,180,200,.6)'; g.lineWidth = 1.2; for (var sv = 0; sv < 2; sv++) { var sy = cupAt[1] - 14 - ((t * 12 + sv * 7) % 14); g.beginPath(); g.moveTo(cupAt[0] - 2 + sv * 4, sy + 7); g.quadraticCurveTo(cupAt[0] + 1 + sv * 4, sy + 3, cupAt[0] - 2 + sv * 4, sy); g.stroke(); } }
    /* the owner: a polishing cloth, or the APPROVED stamp */
    var ho = handAt(OWN, 1);
    if (TAP.own && t - TAP.own < 2.4) { var u = (t - TAP.own) / 2.4, hl = handAt(OWN, 0), px = hl[0] + 18, py = hl[1] - 30;
      shadowed(g, 6, 2, 0.2, function () { fillRR(g, px - 22, py - 28, 44, 54, 3, '#FFFFFF'); }); fillRR(g, px - 22, py - 28, 44, 10, 3, BLUE); g.fillStyle = '#C9D3E3'; for (var ln = 0; ln < 4; ln++) g.fillRect(px - 16, py - 12 + ln * 7, 30 - ln * 5, 2.4);
      var down = u > 0.35 && u < 0.5; fillRR(g, ho[0] - 7, ho[1] - 20 + (down ? 8 : 0), 14, 14, 3, '#8E6440'); fillRR(g, ho[0] - 10, ho[1] - 6 + (down ? 8 : 0), 20, 6, 2, '#E0456B');
      if (u > 0.42) { g.save(); g.translate(px, py + 6); g.rotate(-0.22); g.globalAlpha = Math.min(1, (u - 0.42) * 6); g.strokeStyle = '#E0456B'; g.lineWidth = 2; rr(g, -20, -8, 40, 15, 3); g.stroke(); text(g, 'APPROVED', 0, 3.2, 7.4, 800, '#E0456B', 'center'); g.restore(); } }
    else if (OWN.polish) { fillRR(g, ho[0] - 7, ho[1] - 6, 14, 12, 4, '#FFD84A'); }
    /* the social producer: her phone (a flash on a photo) */
    var hs = handAt(SOC, 1); g.save(); g.translate(hs[0], hs[1] - 8); g.rotate(SOC.phoneRot || 0); fillRR(g, -6, -11, 12, 20, 3, '#2A3550'); fillRR(g, -4.6, -9, 9.2, 15, 2, SOC.flash ? '#FFFFFF' : '#9FC4FF'); g.restore();
    if (SOC.flash) { fillE(g, hs[0], hs[1] - 12, 14, 14, 'rgba(255,255,255,.7)'); }
    /* the designer: the roller on its pole (to the hull), or the swatch fan */
    var hd0 = handAt(DES, 0), hd1 = handAt(DES, 1);
    if (TAP.des && t - TAP.des < 2.4 && (t - TAP.des) < 1.4) { var fu = smooth((t - TAP.des) / 0.6); g.save(); g.translate(hd1[0], hd1[1]);
      [BLUE, NAVY, GOLD, GOLD_L, MIST, '#FFFFFF'].forEach(function (c, i) { g.save(); g.rotate(-1.6 + (i / 5) * 1.6 * fu); fillRR(g, -4, -46, 9, 46, 3, c); g.strokeStyle = 'rgba(30,40,70,.2)'; g.lineWidth = 1; rr(g, -4, -46, 9, 46, 3); g.stroke(); g.restore(); }); fillE(g, 0, 0, 3, 3, '#7A869C'); g.restore(); }
    else { var ex = DES.rollX != null ? DES.rollX : BOAT.x + BOAT.w - 30, ey = BOAT.y + 26; DES.roll = ex; g.strokeStyle = '#9C7048'; g.lineWidth = 3.4; g.lineCap = 'round'; g.beginPath(); g.moveTo(hd1[0], hd1[1]); g.quadraticCurveTo((hd1[0] + ex) / 2 + 8, BOAT.y - 10, ex + 10, ey + 4); g.stroke();
      g.strokeStyle = '#7A869C'; g.lineWidth = 2; g.beginPath(); g.moveTo(ex + 10, ey + 4); g.lineTo(ex + 4, ey); g.stroke(); fillRR(g, ex - 9, ey - 9, 18, 18, 5, DES.dip ? BLUE : '#F3F6FA'); g.fillStyle = BLUE; g.fillRect(ex - 9, ey - 1, 18, 8); }
    /* the account lead: a pencil on the log, or two semaphore flags */
    var hl0 = handAt(LEAD, 0), hl1 = handAt(LEAD, 1);
    if (TAP.lead && t - TAP.lead < 2.6 && (t - TAP.lead) < 2.0) { [hl0, hl1].forEach(function (h, i) { g.save(); g.translate(h[0], h[1]); g.rotate(i ? 0.5 : -0.5); g.fillStyle = '#7A869C'; g.fillRect(-1, -26, 2, 28); fillRR(g, i ? 1 : -15, -26, 14, 12, 1, '#FFD84A'); g.fillStyle = '#E0456B'; g.beginPath(); g.moveTo(i ? 1 : -15, -26); g.lineTo(i ? 15 : -1, -26); g.lineTo(i ? 1 : -15, -14); g.closePath(); g.fill(); g.restore(); }); }
    else if (LEAD.write) { g.save(); g.translate(hl1[0], hl1[1]); g.rotate(-0.7); fillRR(g, -1.5, -12, 3, 14, 1, '#FFD84A'); fillRR(g, -1.5, -14, 3, 3, 1, '#E0456B'); g.restore(); }
  }

  /* the left quay, live: gulls pecking on the cobbles, the tripod and camera, the photographer's flash and prints, the visitor's map */
  function quayLive(g, t, S) {
    GULLQ.forEach(function (q, i) { var hop = ((t + q[2]) % 5) < 0.25 ? Math.sin(((t + q[2]) % 5) / 0.25 * Math.PI) * 6 : 0, dx = Math.sin((t + q[2]) * 0.3) * 14; soft(g, q[0] + dx, q[1] + 6, 10, 2, 0.2); perch(g, q[0] + dx, q[1] - hop, t, q[2]); });
    var tx = TRI.x, ty = TRI.y; g.strokeStyle = '#2A3550'; g.lineWidth = 2.6; g.lineCap = 'round'; g.beginPath(); g.moveTo(tx, ty - 120); g.lineTo(tx - 22, ty); g.moveTo(tx, ty - 120); g.lineTo(tx + 20, ty); g.moveTo(tx, ty - 120); g.lineTo(tx + 3, ty - 4); g.stroke();
    var tilt = PHO.camTilt || 0; g.save(); g.translate(tx, ty - 126); g.rotate(tilt); fillRR(g, -20, -16, 40, 24, 5, '#2A3550'); fillRR(g, -10, -22, 14, 8, 2, '#3A4458'); fillE(g, 8, -4, 9, 9, '#4A5468'); fillE(g, 8, -4, 5.6, 5.6, '#9FC4FF'); fillE(g, 6, -6, 1.8, 1.8, '#FFFFFF'); fillRR(g, -16, -13, 6, 3, 1, BLUE); g.restore();
    if (PHO.flash) { fillE(g, tx + 8, ty - 132, 22, 22, 'rgba(255,255,255,.75)'); fillE(g, tx + 8, ty - 132, 8, 8, '#FFFFFF'); }
    if (PHO.prints) { var hp = handAt(PHO, 1); [0, 1, 2].forEach(function (i) { var u = clamp(PHO.prints - i * 0.15, 0, 1); if (!u) return; g.save(); g.translate(hp[0] + i * 4, hp[1] - 6 - u * 10 * i); g.rotate(-0.3 + i * 0.3 * u); fillRR(g, -11, -26, 22, 26, 2, '#FFFFFF'); fillRR(g, -9, -24, 18, 16, 1, [BLUE, '#F2B233', '#2EA597'][i]); fillE(g, -3 + i * 2, -18, 3, 3, '#FFF3C8'); g.restore(); }); }
    if (VIS.map) { var a0 = handAt(VIS, 0), a1 = handAt(VIS, 1), mx = (a0[0] + a1[0]) / 2, my = Math.min(a0[1], a1[1]) - 12, mw = Math.max(30, Math.abs(a1[0] - a0[0]) + 14);
      g.save(); g.translate(mx, my); fillRR(g, -mw / 2, -18, mw, 32, 2, '#FFF7E6'); g.fillStyle = '#BFE3F7'; g.fillRect(-mw / 2 + 2, 0, mw - 4, 12); g.strokeStyle = 'rgba(200,180,140,.8)'; g.lineWidth = 1; for (var fd = 1; fd < 3; fd++) { g.beginPath(); g.moveTo(-mw / 2 + fd * mw / 3, -18); g.lineTo(-mw / 2 + fd * mw / 3, 14); g.stroke(); }
      g.strokeStyle = '#E0456B'; g.setLineDash([2, 2]); g.beginPath(); g.moveTo(-mw / 2 + 6, -12); g.quadraticCurveTo(0, -2, mw / 2 - 8, -10); g.stroke(); g.setLineDash([]);
      var pin = VIS.found ? 1 : 0; fillE(g, mw / 2 - 8, -12 - pin * 4, 3.4 + pin, 3.4 + pin, '#E0456B'); g.restore();
      if (VIS.found) { mark(g, mx + mw / 2 - 8, my - 34, 0.6, GOLD, BLUE); } }
  }
  /* ---------------- the cast: an idle loop and a tap choreography each ---------------- */
  function tapped(id, st, t) { if (st.wave && st.wave !== st._my) { st._my = st.wave; TAP[id] = t; return true; } return false; }
  function lookAtNexi(P, st, t, S, base) { P.look = lerp(P.look, t < st.until ? clamp((S.nexi.x - P.x) / 160, -1, 1) : base, 0.08); }
  var castDEV = { id: 'dev', behind: true, keys: ['website'], P: DEV, act: function (P, t, S) {
    var st = S.cast.dev, busy = S.hot === 'website'; if (tapped('dev', st, t)) { ENV.push({ t0: t + 0.7, x0: TABLE.x + 6, y0: TABLE.y - 30, x1: MAIL.x + 13, y1: MAIL.y + 16 }); CR.burst('code', P.x + 40, P.y - 260, t); }
    P.sip = false; P.tilt = 0; P.hop = 0; P.mood = 'calm';
    if (TAP.dev && t - TAP.dev < 2.4) { var u = (t - TAP.dev) / 2.4; P.talk = true; P.mood = 'happy';
      if (u < 0.6) { P.hands = [[80, -300], [140, -290]]; P.look = 0.2; } else { P.hands = [[56, -206], [60, -400 + Math.sin(t * 14) * 10]]; P.hop = Math.abs(Math.sin(u * Math.PI * 4)) * 6; P.look = 0.9; } return; }
    var cyc = t % 14, sip = cyc > 9 && cyc < 11.4 && !busy;
    P.talk = t < st.until || busy; if (P.talk) P.mood = 'happy';
    if (sip) { var su = (cyc - 9) / 2.4, upv = Math.sin(su * Math.PI); P.sip = true; P.hands = [[56, -206], [lerp(100, 30, upv), -206 - upv * 150]]; P.tilt = -upv * 0.07; lookAtNexi(P, st, t, S, 0.1); return; }
    var wp = (t + 2) % WEB_C, enter = (wp > 3.6 && wp < 4.0) || (wp > 7.6 && wp < 8.0) || (wp > 10.6 && wp < 11.0), k = Math.abs(Math.sin(t * (busy ? 14 : 9))) * 7;
    P.hands = enter ? [[56, -206], [126, -236]] : [[56, -206 - k], [118, -206 - (7 - k)]];
    var glance = (t % 7) > 5.6; lookAtNexi(P, st, t, S, glance ? -0.2 : 0.6); if (glance) P.tilt = -0.05;
  } };
  var castOWN = { id: 'own', behind: true, keys: ['landing', 'website'], P: OWN, act: function (P, t, S) {
    var st = S.cast.own, busy = S.hot === 'landing'; if (tapped('own', st, t)) CR.burst('star', P.x, P.y - 300, t);
    P.polish = false; P.tilt = 0; P.hop = 0; P.flip = 0; P.mood = 'calm';
    if (TAP.own && t - TAP.own < 2.4) { var u = (t - TAP.own) / 2.4; P.talk = true; P.mood = u > 0.45 ? 'happy' : 'calm';
      P.hands = [[-40, -300], u < 0.35 ? [60, -380] : u < 0.5 ? [50, -300] : [80, -330 - Math.sin(u * 20) * 6]]; P.hop = u > 0.5 ? Math.abs(Math.sin(u * Math.PI * 3)) * 8 : 0; P.look = 0.2;
      if (u > 0.42 && !TAP.ownC) { TAP.ownC = true; CR.burst('spark', P.x + 20, P.y - 310, t); } return; }
    TAP.ownC = false;
    var cyc = t % 12; P.talk = t < st.until || busy;
    if (cyc < 4 && !busy) { var a = t * 5; P.polish = true; P.hands = [[-70, -190], [-30 + Math.cos(a) * 26, -320 + Math.sin(a) * 22]]; P.look = -0.5; P.tilt = 0.04; return; }
    if (cyc < 5) { P.flip = smooth(cyc - 4); P.hands = [[-70, -190], [-40, -360]]; P.look = -0.4; return; }
    if (cyc < 8 || busy) { var wv = Math.sin(t * 9); P.mood = 'happy'; P.hands = [[-70, -190], [110 + wv * 18, -390]]; lookAtNexi(P, st, t, S, 0.8); return; }
    P.hands = [[-60, -230], [40, -200]]; P.tilt = Math.sin(t * 2) > 0.7 ? 0.06 : 0; lookAtNexi(P, st, t, S, -0.2);
  } };
  var castSOC = { id: 'soc', behind: true, keys: ['social'], P: SOC, act: function (P, t, S) {
    var st = S.cast.soc, busy = S.hot === 'social'; tapped('soc', st, t);
    P.flash = false; P.phoneRot = 0; P.tilt = 0; P.hop = 0; P.mood = 'calm'; P.x = 702;
    var cyc = (t + 1) % 10; P.pinU = cyc < 1.6 ? 0 : cyc < 2.2 ? smooth((cyc - 1.6) / 0.6) : 1;
    if (TAP.soc && t - TAP.soc < 2.4) { var u = (t - TAP.soc) / 2.4; P.talk = true; P.mood = 'happy'; P.pinU = 1;
      P.hands = [[-30, -330], [130, -420]]; P.phoneRot = 2.8; P.tilt = 0.1; P.look = 0.6; P.flash = u > 0.2 && u < 0.28;
      if (u > 0.3 && !TAP.socC) { TAP.socC = true; for (var b = 0; b < 7; b++) FX.push({ k: 'like', x: NB.x + 30 + b * 22, y: NB.y + 60 + (b % 2) * 50, vx: (b - 3) * 6, vy: -60 - b * 6, t0: t + b * 0.12, life: 1.6, c: b % 2 ? '#E0456B' : '#1877F2' }); } return; }
    TAP.socC = false; P.talk = t < st.until || busy;
    if (cyc < 2.2) { var pu = cyc / 2.2; P.hands = [pu < 0.7 ? [-60, -230] : [-86, -440], [70, -200]]; P.look = -0.8; P.tilt = -0.04; return; }
    if (cyc < 3.6) { P.x = 702 + smooth((cyc - 2.2) / 1.4) * 10; P.hands = [[-70, -170], [70, -200]]; lookAtNexi(P, st, t, S, -0.6); return; }
    if (cyc < 5.2) { P.x = 712; P.hands = [[-30, -300], [-10, -330]]; P.look = -0.7; P.flash = cyc > 4.4 && cyc < 4.6; return; }
    P.x = 712 - smooth((cyc - 5.2) / 2) * 10;
    if (cyc < 8) { P.hands = [[-50, -230], [10 + Math.sin(t * 3) * 4, -240]]; P.look = 0.1; P.tilt = 0.05; P.mood = (t % 3) < 1 ? 'happy' : 'calm'; return; }
    P.hands = [[-70, -170], [70, -200]]; lookAtNexi(P, st, t, S, -0.5);
  } };
  var castDES = { id: 'des', behind: true, keys: ['brand'], P: DES, act: function (P, t, S) {
    var st = S.cast.des, busy = S.hot === 'brand'; if (tapped('des', st, t)) {}
    P.dip = false; P.rollX = null; P.tilt = 0; P.hop = 0; P.mood = 'calm';
    if (TAP.des && t - TAP.des < 2.4) { var u = (t - TAP.des) / 2.4; P.talk = true; P.mood = 'happy';
      if (u < 0.58) { P.hands = [[-60, -320], [60, -360]]; P.look = 0.3; }
      else { P.hands = [[-60, -320], [-120 + Math.sin(u * 30) * 20, -330]]; P.look = -0.7; if (!TAP.desC) { TAP.desC = true; var cols = [BLUE, GOLD, NAVY, GOLD_L, BLUE_L]; for (var dd = 0; dd < 14; dd++) FX.push({ k: 'drop', x: P.x - 50, y: P.y - 160, vx: -60 - Math.random() * 140, vy: -120 - Math.random() * 120, t0: t + dd * 0.02, life: 1.1, r: 2.5 + Math.random() * 3, c: cols[dd % 5] }); } }
      return; }
    TAP.desC = false;
    var cyc = t % 9; P.talk = t < st.until || busy;
    if (cyc < 5 || busy) { var rx = Math.sin(t * 1.9); P.rollX = BOAT.x + 62 + rx * 46; P.hands = [[-120 + rx * 24, -300], [-60 + rx * 30, -296]]; P.look = -0.7; P.tilt = -0.05; return; }
    if (cyc < 6.4) { var du = Math.sin((cyc - 5) / 1.4 * Math.PI); P.dip = du > 0.6; P.rollX = BOAT.x + BOAT.w - 8 - du * 6; P.hands = [[-60, -300], [30 + du * 20, -300 + du * 12]]; P.look = 0.4; P.tilt = du * 0.06; return; }
    var fu = (cyc - 6.4) / 2.6; P.rollX = BOAT.x + 96; P.hands = [[-50, -380], [30, -370]]; P.tilt = Math.sin(fu * Math.PI) * -0.1; P.mood = fu > 0.6 ? 'happy' : 'calm'; lookAtNexi(P, st, t, S, -0.9);
  } };
  var castLEAD = { id: 'lead', behind: true, keys: ['report', 'lighthouse'], P: LEAD, act: function (P, t, S) {
    var st = S.cast.lead, busy = S.hot === 'report'; if (tapped('lead', st, t)) {}
    P.write = false; P.tilt = 0; P.hop = 0; P.mood = 'calm';
    if (TAP.lead && t - TAP.lead < 2.6) { var u = (t - TAP.lead) / 2.6; P.talk = true; P.mood = 'happy';
      if (u < 0.77) { var ph = Math.floor(u / 0.77 * 4); P.hands = [[[-150, -360], [-120, -160], [-160, -260], [-110, -420]][ph], [[150, -360], [150, -260], [120, -160], [110, -420]][ph]]; P.look = 0; P.hop = ph === 3 ? 10 : 0; }
      else { P.hands = [[-70, -190], [30, -420]]; P.tilt = -0.05; if (!TAP.leadC) { TAP.leadC = true; CR.burst('star', P.x, P.y - 320, t); } }
      return; }
    TAP.leadC = false;
    var cyc = t % 11; P.talk = t < st.until || busy;
    if (busy || cyc < 3) { P.hands = [[-70, -190], [-40, -420]]; P.look = -0.3; P.tilt = 0.05; return; }
    if (cyc < 6) { P.write = true; P.hands = [[-70, -200], [-10 + Math.sin(t * 9) * 6, -205 + Math.cos(t * 7) * 4]]; P.look = -0.4; P.tilt = 0.08; return; }
    if (cyc < 9) { P.hands = [[-70, -190], [40, -400]]; lookAtNexi(P, st, t, S, 0.9); return; }
    P.hands = [[-70, -190], [70, -170]]; P.mood = (t % 2) < 1 ? 'happy' : 'calm'; lookAtNexi(P, st, t, S, -0.4);
  } };

  var castVIS = { id: 'vis', behind: true, keys: [], P: VIS, act: function (P, t, S) {
    P.tilt = 0; P.hop = 0; P.map = false; P.found = false; P.talk = false;
    if (TAP.vis && t - TAP.vis < 2.8) { var u = (t - TAP.vis) / 2.8; P.map = u < 0.5; P.found = u > 0.2 && u < 0.5; P.mood = 'happy'; P.talk = true;
      P.hands = u < 0.5 ? [[-60, -270], [60, -270]] : [[-60, -220], [140, -360 + Math.sin(u * 20) * 6]]; P.look = u < 0.5 ? 0 : 0.9; P.hop = u > 0.5 ? Math.abs(Math.sin(u * Math.PI * 3)) * 8 : 0; return; }
    var c = (t + 4) % 12; P.mood = 'calm';
    if (c < 6) { P.map = true; P.hands = [[-58 - Math.sin(t * 0.8) * 4, -262], [58 + Math.sin(t * 0.8) * 4, -262]]; P.look = lerp(P.look, Math.sin(t * 0.6) * 0.4, 0.08); P.tilt = Math.sin(t * 0.6) * 0.03; }
    else if (c < 9) { P.hands = [[-50, -210], [40, -220]]; P.look = lerp(P.look, 0.9, 0.06); P.mood = 'happy'; }
    else { P.hands = [[-50, -210], [-20, -330 + Math.sin(t * 2) * 4]]; P.look = lerp(P.look, -0.6, 0.06); P.tilt = -0.04; }
  } };
  var castPHO = { id: 'pho', behind: false, keys: ['social'], P: PHO, act: function (P, t, S) {
    P.tilt = 0; P.hop = 0; P.flash = false; P.prints = 0; P.camTilt = 0; P.x = -30;
    if (TAP.pho && t - TAP.pho < 3) { var u = (t - TAP.pho) / 3; P.talk = true; P.mood = 'happy';
      if (u < 0.3) { P.hands = [[40, -330], [70, -320]]; P.look = 0.9; P.flash = u > 0.18 && u < 0.24; P.camTilt = -0.1; }
      else { P.prints = clamp((u - 0.3) * 3, 0, 1.4); P.hands = [[-60, -240], [70, -380]]; P.look = 0.3; P.hop = u < 0.5 ? Math.sin((u - 0.3) / 0.2 * Math.PI) * 10 : 0; } return; }
    var c = (t + 2) % 11, busy = S.hot === 'social'; P.talk = busy; P.mood = busy ? 'happy' : 'calm';
    if (c < 4) { P.x = -30 + Math.sin(c / 4 * Math.PI) * 4; P.hands = [[44, -330], [74, -318]]; P.look = 0.9; P.camTilt = Math.sin(t * 0.9) * 0.08; P.flash = (c > 2.6 && c < 2.75); }
    else if (c < 6.5) { P.hands = [[-50, -230], [20, -260]]; P.look = -0.2; P.tilt = 0.05; P.mood = 'happy'; }
    else if (c < 8.5) { P.hands = [[-90, -420], [-40, -420]]; P.look = -0.8; P.tilt = -0.05; }
    else { P.hands = [[-60, -200], [60, -200]]; P.look = lerp(P.look, 0.4, 0.1); P.hop = Math.abs(Math.sin(t * 6)) * 2; }
  } };

  window.IXW.worlds['sol-mkt'] = {
    calmView: [105,-60,860,688], calmHide: ['lead'], /* CALM: the framed part of the set */
    pan: [-320, 1180],
    paintBg: paintBg, windowBehind: true, paintFrame: paintFrame, paintBack: paintBack, paintFront: paintFront, paintFore: paintFore,
    paintWindow: paintWindow, paintLive: paintLive, paintFrontLive: paintFrontLive,
    paintForeLive: function (g, t, S) { K.zfore(g, t, S, [], function () { CO.crew(CREW, g, t, S, 'fore'); }); quayLive(g, t, S); CR.draw(g, t); },
    motes: false,
    glow: {
      lighthouse: function (g) { rr(g, LH.x - 34, LH.gal - 80, 68, LH.base - LH.gal + 84, 18); },
      website: function (g) { rr(g, SHOP.win.x - 14, SHOP.win.y - 14, SHOP.win.w + 28, SHOP.win.h + 28, 12); },
      landing: function (g) { rr(g, AF.x - 8, AF.y - 14, 60, F - AF.y + 20, 10); },
      social: function (g) { rr(g, NB.x - 14, NB.y - 32, NB.w + 28, NB.h + 44, 12); },
      brand: function (g) { rr(g, BOAT.x - 16, BOAT.y - 60, BOAT.w + 36, 140, 14); },
      report: function (g) { rr(g, BOARD.x - 12, BOARD.y - 12, BOARD.w + 24, BOARD.h + 24, 12); },
      flags: function (g) { rr(g, POLE.x - 16, POLE.y1 - 12, 56, POLE.y0 - POLE.y1 + 18, 12); }
    },
    backGlow: ['lighthouse', 'website', 'social', 'report', 'flags'],
    cast: [castVIS, castDEV, castOWN, castSOC, castDES, castLEAD, castPHO],
    toy: function (name, S, t) { if (name === 'flags') { FLAGS.t = t; CR.burst('conf', POLE.x + 10, POLE.y1 + 10, t); } },
    hit: function (x, y, S, t, onBtn) {
      var w = CR.hitWalker(x, y, t); if (w) return w; if (onBtn) return null;
      if (Math.abs(x - VIS.x) < 60 && y > 330 && y < Q0 + 20) { TAP.vis = t; CR.burst('star', VIS.x, 320, t); return { say: 'A visitor with a map. Your shop is **marked on it**: the website, the posts and the signs all point the same way.', near: [80, 20], pose: 'love', who: 'Visitor' }; }
      if (Math.abs(x - PHO.x - 20) < 60 && y > 300 && y < 580) { TAP.pho = t; CR.burst('spark', TRI.x, TRI.y - 130, t); return { say: 'Short video and graphics made from **your own** shop and people, so the posts look like you.', near: [200, 30], pose: 'wow', who: 'TechNext content producer' }; }
      for (var i = 0; i < GULLS.length; i++) if (Math.abs(x - GULLS[i][0]) < 22 && Math.abs(y - GULLS[i][1]) < 16) { CR.burst('note', GULLS[i][0], GULLS[i][1], t); return { say: 'Squawk! Even the gulls can **find you** now.', near: [clamp(x, 240, 900), clamp(y + 120, -40, 120)], pose: 'wow', who: 'A gull' }; }
      if (Math.abs(x - PLANE.x - 60) < 90 && Math.abs(y - PLANE.y) < 20) return { say: 'The banner plane tows your **handle** past the whole bay: social reach, in the same colours.', near: [clamp(x, 240, 900), -30], pose: 'wow', who: 'The banner plane' };
      for (var b = 0; b < BOATS.length; b++) { var B = BOATS[b]; if (Math.abs(x - B[0]) < 30 * B[2] + 8 && y < B[1] + 10 && y > B[1] - 64 * B[2]) return { say: B[3] === 0 ? 'A sail in **your livery**: blue, white and gold. People know it is you from across the bay.' : 'Every boat in the bay can see the **lighthouse**. That is the point of it.', near: [clamp(B[0], 240, 900), clamp(B[1] - 160, -60, 80)], pose: 'point-right', who: 'A sailboat' }; }
      if (Math.abs(x - FERRY.x) < 50 && Math.abs(y - FERRY.y) < 22) return { say: 'The ferry brings **visitors** in. A clear website takes them from the quay to your door.', near: [clamp(FERRY.x, 240, 900), -40], pose: 'point-right', who: 'The ferry' };
      return null;
    },
    onStop: function (key, S, t) { S.kT = t; if (key === 'lighthouse') CR.burst('spark', LH.x, LH.gal - 24, t); if (key === 'landing') CR.burst('star', AF.x + 22, AF.y, t); }
  };
})(window.IXW && window.IXW.kit, window.CR, window.CO);
