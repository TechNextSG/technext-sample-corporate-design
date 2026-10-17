/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* Industry "world" pages, in the look of TechNext's Nexi Explains videos. This file is the ENGINE; each industry's room,
   props and cast live in assets/js/worlds/<key>.js, which registers itself in IXW.worlds[<key>] with the drawing kit below.
   1. The hero set: one canvas paints the room the way the video renderer's envkit does (wall, wainscot, floor, a window with
      a live view, light pools, motes) plus the industry's props and its two staff members in the Season 2 "F3 pill flat"
      cast model (big round head, pill body, dot eyes, no outlines), drawn live so they breathe, blink, look at Nexi, wave and
      talk. Static layers are painted ONCE per resize into two caches (behind / in front of the counter staff); a frame only
      blits them and draws what moves. The loop stops off screen and in hidden tabs; reduced motion paints one still frame.
   2. Nexi (pre-rendered poses of the real 3D model in the world's costume) gives a guided tour: she flies to each hotspot,
      points, and her caption types out what Odoo does there, with a sample Odoo record. The tour plays while the hero is on
      screen and stops for good on the visitor's first click; the Pause button holds it. "Toys" ([data-toy]) are extra
      tappable things a world animates (a globe, a paper plane).
   3. The workflow: six stations on a route, a small Nexi rides to the active one, its vignette plays and the caption types.
      A world may add a sample picker ([data-ixw-pick]) that swaps the data in every station ([data-v] text, [data-vbar]).
   All copy lives in the HTML; this file only animates it. Without JS the page reads top to bottom. */
(function () {
  'use strict';
  var REDUCE = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches), reduce = REDUCE;
  var fine = !!(window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches);
  /* CALM (the calm layer, build.py CALM = True): the hero scene is ONE framed illustration ([data-ixw-frame]) with the
     world's gentle idle motion only: no walkers / passers-by, no tour, no Nexi, no peek button, no tap reactions; the
     workflow does not autoplay. A world may set calmView [x, y, w, h], calmCast [ids kept] or calmHide [ids hidden]. */
  var CALM = !!document.querySelector('[data-ixw-frame]');
  /* the part of the set (x, y, w, h in set units) the frame shows; a world may set calmView itself */
  var CALM_VIEW = { def: [125, -40, 750, 600] };
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, k) { return a + (b - a) * k; }
  /* the hero paints at ~30 fps (see loop()): FS is how many 60 fps steps the current paint covers, and ease(k) turns a
     per-60-fps-frame easing factor into the one for this paint, so every glide keeps its speed */
  var FS = 1;
  function ease(k) { return FS === 1 ? k : 1 - Math.pow(1 - k, FS); }
  function hash(i) { var s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }
  function rr(g, x, y, w, h, r) { g.beginPath(); if (g.roundRect) g.roundRect(x, y, w, h, r); else g.rect(x, y, w, h); }
  function ell(g, x, y, rx, ry, rot) { g.beginPath(); g.ellipse(x, y, Math.max(0.01, rx), Math.max(0.01, ry), rot || 0, 0, Math.PI * 2); }
  function fillRR(g, x, y, w, h, r, c) { rr(g, x, y, w, h, r); g.fillStyle = c; g.fill(); }
  function fillE(g, x, y, rx, ry, c) { ell(g, x, y, rx, ry); g.fillStyle = c; g.fill(); }
  function limb(g, pts, w, c) { g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (var i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]); g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = c; g.lineWidth = w; g.stroke(); }
  function soft(g, x, y, rx, ry, a) {
    g.save(); g.translate(x, y); g.scale(1, ry / rx); var gr = g.createRadialGradient(0, 0, 0, 0, 0, rx);
    gr.addColorStop(0, 'rgba(22,40,80,' + a + ')'); gr.addColorStop(1, 'rgba(22,40,80,0)'); g.fillStyle = gr; g.fillRect(-rx, -rx, rx * 2, rx * 2); g.restore();
  }
  function shadowed(g, blur, oy, a, fn) { g.save(); g.shadowColor = 'rgba(30,60,90,' + (a == null ? 0.16 : a) + ')'; g.shadowBlur = blur; g.shadowOffsetY = oy; fn(); g.restore(); }
  function text(g, s, x, y, size, weight, col, align) { g.fillStyle = col; g.font = (weight || 700) + ' ' + size + 'px ' + FONT; g.textAlign = align || 'left'; g.textBaseline = 'alphabetic'; g.fillText(s, x, y); g.textAlign = 'left'; }
  function onScreen(el, cb, th) {
    if (!('IntersectionObserver' in window)) { cb(true); return; }
    new IntersectionObserver(function (es) { cb(es[es.length - 1].isIntersecting); }, { threshold: th || 0.05 }).observe(el);
  }
  function tone(hex, k) {
    var n = parseInt(hex.slice(1), 16), r = n >> 16, gg = (n >> 8) & 255, b = n & 255;
    return 'rgb(' + Math.round(lerp(r, 27, k)) + ',' + Math.round(lerp(gg, 31, k)) + ',' + Math.round(lerp(b, 59, k)) + ')';
  }
  var FONT = '"Plus Jakarta Sans", Inter, system-ui, sans-serif';

  /* ============================== the cast: Season 2 "F3 pill flat" model ==============================
     Origin = the floor between the feet; about 490 units tall at s 1 (head centre y -392, rx 92, ry 88; pill body
     y -314..-108, 172 wide; shoulders (±76, -258); arm segments 80 + 76, 36 wide).
     P: x, y, s, ph, c {skin, hair, top, top2, shirt, low, shoe, hat, hatBand, print, pocket}, outfit (scrubs | coat | blazer | tee | hoodie),
        hairStyle (bun | long | pony | short | curly | buzz | bald), hat (sunhat | cap | hardhat | toque), hijab (colour), beard (colour), build (0.9..1.25 body width),
        glasses, scarf, apron (colour), vest (hi-vis colour),
        headset (mic colour), backpack, hold (clipboard | passport | bags | box | tablet | tray | mat), feet, short,
        mood (calm | happy | wow), look (-1..1), talk, tilt, hop, hands [[lx, ly], [rx, ry]] */
  var F3 = { hy: -392, rx: 92, ry: 88, top: -314, bot: -108, tw: 172, shx: 76, shy: -258, a: 80, b: 76, aw: 36 };
  function ik(sx, sy, hx, hy, a, b, d) {
    var dx = hx - sx, dy = hy - sy, L = clamp(Math.hypot(dx, dy), Math.abs(a - b) + 1, a + b - 1), an = Math.atan2(dy, dx);
    var A = Math.acos(clamp((a * a + L * L - b * b) / (2 * a * L), -1, 1)), e = an - d * A;
    return { e: [sx + Math.cos(e) * a, sy + Math.sin(e) * a], h: [sx + Math.cos(an) * L, sy + Math.sin(an) * L] };
  }
  var INK = '#1B1F3B', MOUTH = '#8A2B3E';
  function face(g, P, t) {
    var rx = F3.rx, ry = F3.ry, cy = F3.hy, lx = P.look * 9, ey = cy + ry * 0.1, ex = rx * 0.38, er = rx * 0.1,
      blink = ((t + P.ph * 0.7) % 3.7) < 0.12, happy = P.mood === 'happy', wow = P.mood === 'wow';
    g.fillStyle = happy ? 'rgba(255,110,140,.42)' : 'rgba(255,120,140,.26)';
    [-1, 1].forEach(function (d) { ell(g, d * rx * 0.62 + lx * 0.5, cy + ry * 0.4, rx * 0.15, ry * 0.08); g.fill(); });
    g.lineCap = 'round';
    [-1, 1].forEach(function (d) {
      var x = d * ex + lx;
      if (happy) { g.lineWidth = 6; g.strokeStyle = INK; g.beginPath(); g.arc(x, ey + er * 0.9, er * 1.3, Math.PI * 1.15, Math.PI * 1.85); g.stroke(); return; }
      if (blink) { g.lineWidth = 5; g.strokeStyle = INK; g.beginPath(); g.moveTo(x - er, ey + 2); g.lineTo(x + er, ey + 2); g.stroke(); return; }
      var k = wow ? 1.35 : 1; fillE(g, x, ey, er * k, er * 1.25 * k, INK); fillE(g, x - er * 0.35 * k, ey - er * 0.45 * k, er * 0.34 * k, er * 0.34 * k, '#FFFFFF');
    });
    g.lineWidth = 5; g.strokeStyle = tone(P.c.hair, 0.1);
    [-1, 1].forEach(function (d) { var lift = happy ? -3 : wow ? -7 : 0; g.beginPath(); g.moveTo(d * ex + lx - rx * 0.2, cy - ry * 0.22 + lift); g.lineTo(d * ex + lx + rx * 0.2, cy - ry * 0.22 + lift); g.stroke(); });
    if (P.glasses) { g.lineWidth = 4.5; g.strokeStyle = '#3B3F55'; [-1, 1].forEach(function (d) { ell(g, d * ex + lx, ey, rx * 0.22, rx * 0.2); g.stroke(); }); g.beginPath(); g.moveTo(-ex + lx + rx * 0.22, ey); g.lineTo(ex + lx - rx * 0.22, ey); g.stroke(); }
    var my = cy + ry * 0.52, mw = rx * 0.22;
    if (P.talk) { var o = 0.5 + 0.5 * Math.sin(t * 17 + P.ph); fillE(g, lx, my + 2, 13, 4 + 9 * o, MOUTH); if (o > 0.4) fillE(g, lx, my + 5 + 5 * o, 7, 3, '#FF8FA3'); }
    else if (wow) fillE(g, lx, my + 6, mw * 0.5, ry * 0.12, MOUTH);
    else if (happy) { g.beginPath(); g.moveTo(lx - mw, my - 3); g.quadraticCurveTo(lx, my + ry * 0.28, lx + mw, my - 3); g.closePath(); g.fillStyle = MOUTH; g.fill(); }
    else { g.lineWidth = 5; g.strokeStyle = INK; g.beginPath(); g.moveTo(lx - mw * 0.7, my); g.quadraticCurveTo(lx, my + ry * 0.11, lx + mw * 0.7, my); g.stroke(); }
  }
  function hair(g, P, back) {
    var rx = F3.rx, ry = F3.ry, cy = F3.hy, st = P.hairStyle;
    if (P.hijab) { if (back) { var hc = P.hijab; g.fillStyle = tone(hc, 0.1); g.beginPath(); g.moveTo(-rx * 1.22, cy); g.bezierCurveTo(-rx * 1.3, cy - ry * 1.42, rx * 1.3, cy - ry * 1.42, rx * 1.22, cy);
        g.quadraticCurveTo(rx * 1.3, cy + ry * 1.05, rx * 1.05, cy + ry * 1.5); g.lineTo(-rx * 1.05, cy + ry * 1.5); g.quadraticCurveTo(-rx * 1.3, cy + ry * 1.05, -rx * 1.22, cy); g.closePath(); g.fill(); } return; }
    g.fillStyle = P.c.hair;
    if (st === 'curly') { if (back) { for (var k = 0; k < 11; k++) { var a = Math.PI * (0.92 + k * 0.116); ell(g, Math.cos(a) * rx * 1.08, cy - ry * 0.12 + Math.sin(a) * ry * 1.04, 30, 30); g.fill(); } ell(g, 0, cy - ry * 0.25, rx * 1.12, ry * 0.95); g.fill(); return; }
      for (var q = 0; q < 6; q++) { ell(g, -rx * 0.72 + q * rx * 0.29, cy - ry * 0.8 + Math.abs(q - 2.5) * 6, 26, 22); g.fill(); } return; }
    if (st === 'buzz') { if (back) return; g.globalAlpha = 0.85; g.beginPath(); g.moveTo(-rx * 0.98, cy - ry * 0.12); g.bezierCurveTo(-rx * 1.04, cy - ry * 1.18, rx * 1.04, cy - ry * 1.18, rx * 0.98, cy - ry * 0.12);
      g.quadraticCurveTo(rx * 0.7, cy - ry * 0.62, 0, cy - ry * 0.66); g.quadraticCurveTo(-rx * 0.7, cy - ry * 0.62, -rx * 0.98, cy - ry * 0.12); g.closePath(); g.fill(); g.globalAlpha = 1; return; }
    if (st === 'bald') { if (back) return; ell(g, -rx * 0.3, cy - ry * 0.62, rx * 0.22, ry * 0.1); g.fillStyle = 'rgba(255,255,255,.22)'; g.fill(); g.fillStyle = P.c.hair; [-1, 1].forEach(function (d) { ell(g, d * rx * 0.92, cy - ry * 0.1, rx * 0.16, ry * 0.32); g.fill(); }); return; }
    if (st === 'bob') { /* a chin-length bob with a straight fringe */
      if (back) { g.beginPath(); g.moveTo(-rx * 1.16, cy + ry * 0.55); g.lineTo(-rx * 1.16, cy - ry * 0.1); g.bezierCurveTo(-rx * 1.22, cy - ry * 1.32, rx * 1.22, cy - ry * 1.32, rx * 1.16, cy - ry * 0.1);
        g.lineTo(rx * 1.16, cy + ry * 0.55); g.quadraticCurveTo(rx * 1.1, cy + ry * 0.74, rx * 0.86, cy + ry * 0.7); g.lineTo(-rx * 0.86, cy + ry * 0.7); g.quadraticCurveTo(-rx * 1.1, cy + ry * 0.74, -rx * 1.16, cy + ry * 0.55); g.closePath(); g.fill(); return; }
      g.beginPath(); g.moveTo(-rx * 1.06, cy + ry * 0.1); g.bezierCurveTo(-rx * 1.14, cy - ry * 1.26, rx * 1.14, cy - ry * 1.26, rx * 1.06, cy + ry * 0.1);
      g.lineTo(rx * 0.92, cy - ry * 0.34); g.lineTo(-rx * 0.92, cy - ry * 0.34); g.closePath(); g.fill(); return;
    }
    if (st === 'bun' || st === 'long' || st === 'pony') {
      if (back) {
        if (st === 'long') { g.beginPath(); g.moveTo(-rx * 1.12, cy + ry * 0.62); g.lineTo(-rx * 1.14, cy - ry * 0.1); g.bezierCurveTo(-rx * 1.2, cy - ry * 1.32, rx * 1.2, cy - ry * 1.32, rx * 1.14, cy - ry * 0.1); g.lineTo(rx * 1.12, cy + ry * 0.62); g.quadraticCurveTo(rx * 1.1, cy + ry * 0.8, rx * 0.9, cy + ry * 0.78); g.lineTo(-rx * 0.9, cy + ry * 0.78); g.quadraticCurveTo(-rx * 1.1, cy + ry * 0.8, -rx * 1.12, cy + ry * 0.62); g.closePath(); g.fill(); return; }
        ell(g, 0, cy - ry * 0.08, rx * 1.1, ry * 1.06); g.fill();
        if (st === 'bun') { ell(g, 0, cy - ry * 1.12, 34, 30); g.fill(); }
        else { g.beginPath(); g.moveTo(rx * 0.7, cy - ry * 0.7); g.quadraticCurveTo(rx * 1.55, cy - ry * 0.6, rx * 1.3, cy + ry * 0.5); g.quadraticCurveTo(rx * 1.15, cy - ry * 0.1, rx * 0.8, cy - ry * 0.35); g.closePath(); g.fill(); }
        return;
      }
      g.beginPath(); g.moveTo(-rx * 1.05, cy + ry * 0.02); g.bezierCurveTo(-rx * 1.14, cy - ry * 1.26, rx * 1.14, cy - ry * 1.26, rx * 1.05, cy + ry * 0.02);
      g.quadraticCurveTo(rx * 0.62, cy - ry * 0.46, rx * 0.05, cy - ry * 0.46); g.quadraticCurveTo(-rx * 0.55, cy - ry * 0.34, -rx * 1.05, cy + ry * 0.02); g.closePath(); g.fill();
      if (P.clipCol !== null) { g.save(); g.translate(rx * 0.58, cy - ry * 0.7); g.rotate(0.35); fillRR(g, -20, -7, 40, 14, 7, P.clipCol || '#FFD84A'); g.restore(); }
      return;
    }
    if (back) return;
    g.beginPath(); g.moveTo(-rx * 1.04, cy - ry * 0.02); g.bezierCurveTo(-rx * 1.12, cy - ry * 1.25, rx * 1.12, cy - ry * 1.25, rx * 1.04, cy - ry * 0.02);
    g.quadraticCurveTo(rx * 0.9, cy - ry * 0.55, rx * 0.3, cy - ry * 0.62); g.quadraticCurveTo(-rx * 0.35, cy - ry * 0.78, -rx * 0.62, cy - ry * 0.5);
    g.quadraticCurveTo(-rx * 0.85, cy - ry * 0.3, -rx * 1.04, cy - ry * 0.02); g.closePath(); g.fill();
  }
  function hat(g, P) {
    var rx = F3.rx, ry = F3.ry, cy = F3.hy;
    if (P.hijab) { var hc = P.hijab; g.fillStyle = hc; g.beginPath(); g.moveTo(-rx * 1.16, cy + ry * 0.2); g.bezierCurveTo(-rx * 1.22, cy - ry * 1.34, rx * 1.22, cy - ry * 1.34, rx * 1.16, cy + ry * 0.2);
      g.quadraticCurveTo(rx * 1.18, cy + ry * 0.9, rx * 0.6, cy + ry * 1.18); g.lineTo(rx * 0.62, cy + ry * 0.86); g.quadraticCurveTo(rx * 0.96, cy + ry * 0.5, rx * 0.94, cy - ry * 0.1);
      g.bezierCurveTo(rx * 0.92, cy - ry * 0.92, -rx * 0.92, cy - ry * 0.92, -rx * 0.94, cy - ry * 0.1); g.quadraticCurveTo(-rx * 0.96, cy + ry * 0.5, -rx * 0.62, cy + ry * 0.86); g.lineTo(-rx * 0.6, cy + ry * 1.18);
      g.quadraticCurveTo(-rx * 1.18, cy + ry * 0.9, -rx * 1.16, cy + ry * 0.2); g.closePath(); g.fill();
      g.fillStyle = tone(hc, 0.12); g.beginPath(); g.moveTo(-rx * 0.6, cy + ry * 1.18); g.quadraticCurveTo(0, cy + ry * 1.5, rx * 0.6, cy + ry * 1.18); g.lineTo(rx * 0.62, cy + ry * 0.86); g.quadraticCurveTo(0, cy + ry * 1.12, -rx * 0.62, cy + ry * 0.86); g.closePath(); g.fill(); }
    if (P.hat === 'cap') { /* a baseball cap seen from the front: the crown, the visor, the button */
      var cc = P.c.hat || '#3167CA';
      g.beginPath(); g.ellipse(0, cy - ry * 0.4, rx * 1.03, ry * 0.88, 0, Math.PI, 0); g.closePath(); g.fillStyle = cc; g.fill();
      g.fillStyle = 'rgba(255,255,255,.14)'; g.beginPath(); g.ellipse(-rx * 0.3, cy - ry * 0.86, rx * 0.36, ry * 0.2, -0.3, 0, Math.PI * 2); g.fill();
      fillE(g, 0, cy - ry * 0.36, rx * 0.92, ry * 0.17, tone(cc, 0.22)); fillE(g, 0, cy - ry * 1.27, 10, 7, tone(cc, 0.25));
      if (P.c.hatBand) fillRR(g, -16, cy - ry * 0.98, 32, 22, 6, P.c.hatBand);
    }
    if (P.hat === 'hardhat') { /* a safety helmet: the shell, its ridge and the brim all round */
      var hh = P.c.hat || '#FFC93C';
      fillE(g, 0, cy - ry * 0.46, rx * 1.2, ry * 0.18, tone(hh, 0.18));
      g.beginPath(); g.ellipse(0, cy - ry * 0.5, rx * 1.02, ry * 0.92, 0, Math.PI, 0); g.closePath(); g.fillStyle = hh; g.fill();
      fillRR(g, -9, cy - ry * 1.4, 18, ry * 0.9, 9, tone(hh, 0.1)); g.fillStyle = 'rgba(255,255,255,.22)'; g.beginPath(); g.ellipse(-rx * 0.4, cy - ry * 1.0, rx * 0.26, ry * 0.18, -0.5, 0, Math.PI * 2); g.fill();
    }
    if (P.hat === 'toque') { /* a chef's hat: a tall pleated crown on a band */
      var tq = P.c.hat || '#FFFFFF';
      fillE(g, -rx * 0.45, cy - ry * 1.42, rx * 0.5, ry * 0.42, tq); fillE(g, rx * 0.45, cy - ry * 1.42, rx * 0.5, ry * 0.42, tq); fillE(g, 0, cy - ry * 1.58, rx * 0.56, ry * 0.46, tq);
      fillRR(g, -rx * 0.86, cy - ry * 1.4, rx * 1.72, ry * 0.7, 10, tq); fillRR(g, -rx * 0.9, cy - ry * 0.84, rx * 1.8, ry * 0.3, 8, tone(tq, 0.06));
      g.strokeStyle = 'rgba(30,40,70,.08)'; g.lineWidth = 3; g.beginPath(); g.moveTo(-rx * 0.3, cy - ry * 1.5); g.lineTo(-rx * 0.32, cy - ry * 0.86); g.moveTo(rx * 0.3, cy - ry * 1.5); g.lineTo(rx * 0.32, cy - ry * 0.86); g.stroke();
    }
    if (P.hat === 'sunhat') {
      var c = P.c.hat || '#F2D59B';
      fillE(g, 0, cy - ry * 0.55, rx * 1.48, ry * 0.3, tone(c, 0.08)); fillE(g, 0, cy - ry * 0.62, rx * 1.44, ry * 0.26, c);
      g.beginPath(); g.ellipse(0, cy - ry * 0.7, rx * 0.95, ry * 0.85, 0, Math.PI, 0); g.closePath(); g.fillStyle = c; g.fill();
      g.fillStyle = P.c.hatBand || '#3167CA'; g.fillRect(-rx * 0.95, cy - ry * 0.86, rx * 1.9, ry * 0.18);
    }
  }
  function headset(g, P) { /* a call-centre headset: the band over the head, two ear cups, the mic boom */
    var rx = F3.rx, ry = F3.ry, cy = F3.hy;
    g.strokeStyle = '#2A3550'; g.lineCap = 'round'; g.lineWidth = 9;
    g.beginPath(); g.ellipse(0, cy, rx * 1.07, ry * 1.1, 0, Math.PI * 1.06, Math.PI * 1.94); g.stroke();
    fillRR(g, -rx * 1.2, cy - 20, 28, 42, 12, '#2A3550'); fillRR(g, rx * 1.2 - 28, cy - 20, 28, 42, 12, '#2A3550');
    g.lineWidth = 5; g.beginPath(); g.moveTo(-rx * 1.08, cy + 14); g.quadraticCurveTo(-rx * 0.9, cy + ry * 0.62, -rx * 0.34, cy + ry * 0.6); g.stroke();
    fillE(g, -rx * 0.3, cy + ry * 0.6, 10, 8, P.headset);
  }
  function torso(g, P) {
    var c = P.c, w = F3.tw / 2, top = F3.top, bot = F3.bot, o = P.outfit || 'scrubs';
    if (P.backpack) { fillRR(g, -w - 18, top + 30, 40, 120, 14, P.backpack); fillRR(g, w - 22, top + 30, 40, 120, 14, P.backpack); }
    rr(g, -w, top, w * 2, bot - top, 68); g.fillStyle = o === 'coat' ? '#FBFCFF' : c.top; g.fill();
    g.save(); rr(g, -w, top, w * 2, bot - top, 68); g.clip();
    g.fillStyle = 'rgba(25,30,70,.07)'; g.fillRect(w * 0.3, top - 10, 200, 300);
    if (o === 'coat') {
      g.fillStyle = c.top2 || '#5B8DEF'; g.beginPath(); g.moveTo(-36, top - 4); g.lineTo(0, top + 84); g.lineTo(36, top - 4); g.closePath(); g.fill();
      g.fillStyle = '#E5EAF3'; [-1, 1].forEach(function (d) { g.beginPath(); g.moveTo(d * 36, top - 4); g.lineTo(d * 4, top + 92); g.lineTo(d * 28, top + 74); g.lineTo(d * 58, top + 20); g.closePath(); g.fill(); });
      fillRR(g, 30, -196, 40, 34, 6, '#EEF2F8'); fillRR(g, 38, -206, 5, 22, 2, '#3167CA'); fillRR(g, 48, -204, 5, 20, 2, '#E0456B');
      g.lineWidth = 7; g.strokeStyle = '#2B3A6B'; g.lineCap = 'round'; g.beginPath(); g.moveTo(-40, top + 2); g.quadraticCurveTo(-52, top + 70, -30, top + 104); g.stroke();
      g.beginPath(); g.moveTo(40, top + 2); g.quadraticCurveTo(52, top + 60, 36, top + 92); g.stroke();
      fillE(g, -30, top + 112, 13, 13, '#DDE3EC'); fillE(g, -30, top + 112, 7, 7, '#AAB4C4');
    } else if (o === 'blazer') {
      g.fillStyle = c.shirt || '#FFFFFF'; g.beginPath(); g.moveTo(-36, top - 4); g.lineTo(0, top + 90); g.lineTo(36, top - 4); g.closePath(); g.fill();
      g.fillStyle = tone(c.top, 0.18); [-1, 1].forEach(function (d) { g.beginPath(); g.moveTo(d * 36, top - 4); g.lineTo(d * 6, top + 96); g.lineTo(d * 30, top + 74); g.lineTo(d * 58, top + 18); g.closePath(); g.fill(); });
      fillE(g, -6, top + 112, 6, 6, '#E9C46A'); fillE(g, -6, top + 140, 6, 6, '#E9C46A');
      fillRR(g, 34, -206, 34, 8, 3, c.pocket || '#FFD84A');
    } else if (o === 'hoodie') { /* the hood folds behind the neck, drawstrings, a front pocket */
      fillE(g, 0, top + 6, 74, 30, tone(c.top, 0.16)); fillE(g, 0, top - 2, 32, 20, c.skin);
      g.strokeStyle = '#FFFFFF'; g.lineWidth = 4; g.lineCap = 'round'; g.beginPath(); g.moveTo(-14, top + 14); g.lineTo(-17, top + 58); g.moveTo(14, top + 14); g.lineTo(17, top + 58); g.stroke();
      fillE(g, -17, top + 61, 4, 4, '#FFFFFF'); fillE(g, 17, top + 61, 4, 4, '#FFFFFF');
      fillRR(g, -52, -200, 104, 46, 18, tone(c.top, 0.12));
    } else if (o === 'polo') { /* a polo shirt: the flat collar, the placket and two buttons */
      fillE(g, 0, top - 2, 30, 18, c.skin);
      g.fillStyle = tone(c.top, 0.12); [-1, 1].forEach(function (d) { g.beginPath(); g.moveTo(d * 4, top - 6); g.lineTo(d * 40, top - 8); g.lineTo(d * 30, top + 22); g.lineTo(d * 6, top + 26); g.closePath(); g.fill(); });
      fillRR(g, -6, top + 18, 12, 50, 4, tone(c.top, 0.08)); fillE(g, 0, top + 34, 3.5, 3.5, c.top2 || '#FFFFFF'); fillE(g, 0, top + 52, 3.5, 3.5, c.top2 || '#FFFFFF');
      if (c.print) fillRR(g, 30, -216, 24, 6, 3, c.print);
    } else if (o === 'shirt' || o === 'cardigan') { /* an open-collar casual shirt (sleeves rolled), or a cardigan open over a tee */
      if (o === 'cardigan') { g.fillStyle = c.top2 || '#FFFFFF'; g.fillRect(-34, top - 4, 68, bot - top + 4); fillE(g, 0, top - 2, 30, 18, c.skin);
        g.fillStyle = tone(c.top, 0.1); g.fillRect(-36, top, 6, bot - top); g.fillRect(30, top, 6, bot - top);
        [0, 1, 2].forEach(function (k) { fillE(g, -40, top + 50 + k * 34, 3.5, 3.5, tone(c.top, 0.25)); }); }
      else { g.fillStyle = c.skin; g.beginPath(); g.moveTo(-24, top - 4); g.lineTo(0, top + 34); g.lineTo(24, top - 4); g.closePath(); g.fill();
        g.fillStyle = tone(c.top, 0.14); [-1, 1].forEach(function (d) { g.beginPath(); g.moveTo(d * 22, top - 8); g.lineTo(d * 2, top + 36); g.lineTo(d * 16, top + 40); g.lineTo(d * 44, top + 6); g.closePath(); g.fill(); });
        g.fillStyle = tone(c.top, 0.1); g.fillRect(-2, top + 36, 4, bot - top - 36); [0, 1, 2].forEach(function (k) { fillE(g, 6, top + 60 + k * 36, 3, 3, '#FFFFFF'); });
        fillRR(g, -60, -222, 34, 28, 6, tone(c.top, 0.08)); }
    } else if (o === 'tee') {
      fillE(g, 0, top - 2, 34, 22, c.skin);
      if (c.print) { g.fillStyle = c.print; g.save(); g.translate(0, -214); g.rotate(-0.2); g.beginPath(); g.moveTo(-24, 6); g.lineTo(26, -14); g.lineTo(6, 22); g.lineTo(2, 6); g.closePath(); g.fill(); g.restore(); }
      if (P.backpack) { g.fillStyle = tone(P.backpack, 0.12); [-1, 1].forEach(function (d) { g.fillRect(d > 0 ? 40 : -56, top - 6, 16, 160); }); }
    } else {
      g.fillStyle = c.top2; g.beginPath(); g.moveTo(-30, top - 4); g.lineTo(0, top + 40); g.lineTo(30, top - 4); g.closePath(); g.fill();
      g.fillStyle = c.skin; g.beginPath(); g.moveTo(-22, top - 4); g.lineTo(0, top + 28); g.lineTo(22, top - 4); g.closePath(); g.fill();
      fillRR(g, -66, -214, 40, 32, 8, c.top2); fillRR(g, -58, -224, 5, 20, 2, '#FFFFFF');
    }
    if (P.vest) { /* a hi-vis vest over any outfit: two front panels with reflective bands */
      g.fillStyle = P.vest; g.beginPath(); g.moveTo(-w, top + 30); g.lineTo(-30, top - 2); g.lineTo(-12, top + 60); g.lineTo(-12, bot); g.lineTo(-w, bot); g.closePath(); g.fill();
      g.beginPath(); g.moveTo(w, top + 30); g.lineTo(30, top - 2); g.lineTo(12, top + 60); g.lineTo(12, bot); g.lineTo(w, bot); g.closePath(); g.fill();
      g.fillStyle = 'rgba(235,240,245,.92)'; g.fillRect(-w, -190, w - 12, 12); g.fillRect(12, -190, w - 12, 12); g.fillRect(-w, -150, w - 12, 12); g.fillRect(12, -150, w - 12, 12);
    }
    if (P.apron) { /* a shop apron over any outfit: the bib, the straps, the body and a pocket */
      g.strokeStyle = tone(P.apron, 0.2); g.lineWidth = 6; g.lineCap = 'round'; g.beginPath(); g.moveTo(-28, top + 24); g.lineTo(-40, top - 4); g.moveTo(28, top + 24); g.lineTo(40, top - 4); g.stroke();
      fillRR(g, -34, top + 20, 68, 70, 12, P.apron); fillRR(g, -54, top + 76, 108, bot - top - 60, 18, P.apron);
      fillRR(g, -26, -176, 52, 30, 8, tone(P.apron, 0.14)); g.fillStyle = 'rgba(255,255,255,.55)'; g.fillRect(-1, -176, 2, 30);
    }
    g.restore();
    if (P.scarf) { /* a knotted neck scarf over the collar */
      g.fillStyle = P.scarf; g.beginPath(); g.moveTo(-40, top - 2); g.quadraticCurveTo(0, top + 26, 40, top - 2); g.lineTo(30, top - 14); g.quadraticCurveTo(0, top + 8, -30, top - 14); g.closePath(); g.fill();
      g.beginPath(); g.moveTo(8, top + 10); g.lineTo(30, top + 52); g.lineTo(12, top + 58); g.closePath(); g.fill(); fillE(g, 6, top + 12, 11, 9, tone(P.scarf, 0.1));
    }
    if (P.idcard) { /* a staff ID on a lanyard (P.idcard = the strap colour): the strap round the neck, the clip, the card with its header band */
      var lc = P.idcard === true ? '#3167CA' : P.idcard, cy0 = -206 + (P.idSwing ? Math.sin(P.idSwing) * 2 : 0), cx0 = P.idSwing ? Math.sin(P.idSwing) * 4 : 0;
      g.strokeStyle = lc; g.lineWidth = 7; g.lineCap = 'round'; g.beginPath(); g.moveTo(-26, top - 2); g.quadraticCurveTo(-18, top + 40, cx0 - 3, cy0 - 30); g.moveTo(26, top - 2); g.quadraticCurveTo(18, top + 40, cx0 + 3, cy0 - 30); g.stroke();
      fillRR(g, cx0 - 6, cy0 - 34, 12, 12, 3, '#B9C3D1');
      g.save(); g.translate(cx0, cy0); g.rotate(P.idSwing ? Math.sin(P.idSwing) * 0.12 : 0);
      fillRR(g, -21, -24, 42, 54, 6, '#1E2F5C'); fillRR(g, -19, -22, 38, 50, 5, '#FFFFFF'); fillRR(g, -19, -22, 38, 13, 5, lc); g.fillRect(-19, -14, 38, 5);
      fillRR(g, -13, -4, 12, 14, 2, '#C9D6EE'); g.fillStyle = '#AAB7CC'; g.fillRect(3, -2, 12, 3); g.fillRect(3, 4, 9, 3); g.fillStyle = lc; g.fillRect(-13, 16, 26, 4);
      g.fillStyle = '#FFFFFF'; g.beginPath(); g.moveTo(-6, -15.5); g.lineTo(6, -20); g.lineTo(3.4, -12); g.lineTo(0.4, -15); g.closePath(); g.fill();
      g.restore();
    }
  }
  function held(g, kind, hp) {
    g.save(); g.translate(hp[0] + 30, hp[1] - 6);
    if (kind === 'clipboard') { g.rotate(-0.12); fillRR(g, -40, -54, 80, 104, 8, '#C98E55'); fillRR(g, -32, -44, 64, 88, 4, '#FFFFFF'); fillRR(g, -16, -60, 32, 14, 4, '#9AA6BC'); g.fillStyle = '#C9D3E3'; for (var k = 0; k < 5; k++) g.fillRect(-24, -30 + k * 14, k === 2 ? 30 : 46, 4); fillE(g, 16, 30, 7, 7, '#21B799'); }
    else if (kind === 'bags') { /* two paper shopping bags hanging from the hand */
      g.translate(-30, 6);
      fillRR(g, -2, 20, 54, 62, 6, '#9DBFA4'); g.strokeStyle = '#6E9B7A'; g.lineWidth = 4; g.beginPath(); g.arc(25, 22, 12, Math.PI, 0); g.stroke();
      g.strokeStyle = '#8A5A3B'; g.beginPath(); g.arc(0, 16, 14, Math.PI, 0); g.stroke();
      fillRR(g, -32, 14, 64, 72, 7, '#E8C394'); fillRR(g, -32, 14, 64, 11, 5, '#DDAF78'); fillE(g, 0, 52, 13, 13, '#C96F4A'); fillE(g, 0, 52, 6, 6, '#F8E7CF');
    }
    else if (kind === 'box') { /* a parcel held in front: kraft card, tape, a shipping label */
      g.translate(32, -4); fillRR(g, -56, -40, 112, 78, 7, '#C99A6B'); fillRR(g, -56, -40, 112, 12, 5, '#B5865A');
      g.fillStyle = 'rgba(255,240,210,.55)'; g.fillRect(-9, -40, 18, 78); fillRR(g, 14, -18, 34, 24, 3, '#FFFFFF'); g.fillStyle = '#2A3550'; for (var bk = 0; bk < 6; bk++) g.fillRect(18 + bk * 4.6, -12, bk % 2 ? 1.6 : 3, 12);
    }
    else if (kind === 'mat') { /* a rolled yoga mat under the arm */
      g.translate(-10, -10); g.rotate(-0.5); fillRR(g, -70, -14, 140, 28, 14, '#B9A6D8'); fillE(g, 70, 0, 9, 14, tone('#B9A6D8', 0.2)); g.strokeStyle = 'rgba(255,255,255,.5)'; g.lineWidth = 3; g.beginPath(); g.moveTo(-40, -14); g.lineTo(-40, 14); g.moveTo(40, -14); g.lineTo(40, 14); g.stroke();
    }
    else if (kind === 'tablet') { /* a site tablet held up, its screen showing a progress chart */
      g.translate(-4, -8); g.rotate(-0.1); fillRR(g, -38, -52, 76, 100, 10, '#2A3550'); fillRR(g, -32, -46, 64, 86, 5, '#FFFFFF');
      fillRR(g, -32, -46, 64, 14, 4, '#1F4E8C'); g.fillStyle = '#FFC93C'; g.fillRect(-24, -6, 10, 34); g.fillRect(-8, -18, 10, 46); g.fillStyle = '#1F4E8C'; g.fillRect(8, 2, 10, 26);
    }
    else if (kind === 'tray') { /* a serving tray held high on the hand, two plates on it */
      g.translate(-30, -14); fillE(g, 0, 0, 74, 14, '#C9A44A'); fillE(g, 0, -3, 70, 11, '#E3C36A');
      fillE(g, -26, -10, 24, 7, '#FFFFFF'); fillE(g, -26, -14, 14, 6, '#E2553D'); fillE(g, 26, -10, 24, 7, '#FFFFFF'); fillE(g, 26, -14, 13, 6, '#7CB342');
    }
    else if (kind === 'passport') { g.translate(-6, 4); g.rotate(-0.25); fillRR(g, -30, -40, 60, 80, 8, '#1E4691'); fillE(g, 0, -6, 15, 15, '#E9C46A'); fillE(g, 0, -6, 9, 9, '#1E4691'); fillRR(g, -16, 18, 32, 5, 2, '#E9C46A'); fillRR(g, 10, -52, 30, 40, 4, '#FFFFFF'); g.fillStyle = '#3167CA'; g.fillRect(14, -46, 22, 5); }
    g.restore();
  }
  var VIEW = null; /* the set units on screen this frame (the engine sets it); people outside it are skipped */
  function person(g, P, t) {
    if (VIEW && (P.x < VIEW.l - 140 || P.x > VIEW.r + 140)) return;
    var c = P.c, br = Math.sin(t * 2.1 + P.ph), hop = P.hop || 0, hb = Math.sin(t * 2.3 + P.ph + 0.6) * 2 + (P.talk ? Math.sin(t * 8.5) * 2.5 : 0);
    var sxk = P.sx == null ? 1 : Math.abs(P.sx) < 0.08 ? (P.sx < 0 ? -0.08 : 0.08) : P.sx; /* P.sx: a turn on the spot (Company scenes) */
    g.save(); g.translate(P.x, P.y); g.scale(P.s * sxk, P.s);
    if (P.sit) { /* seated (P.sit): an office chair (P.chair: false for none, P.chairCol), knees toward us, shins down, feet on the floor */
      soft(g, 0, 4, 140, 18, 0.24);
      if (P.chair !== false) { var cc = P.chairCol || '#2A3550';
        g.strokeStyle = tone(cc, 0.1); g.lineWidth = 12; g.lineCap = 'round'; g.beginPath(); g.moveTo(-86, -6); g.lineTo(86, -6); g.moveTo(-50, -2); g.lineTo(0, -16); g.lineTo(50, -2); g.stroke();
        [-86, 0, 86].forEach(function (x) { fillE(g, x, 0, 9, 7, '#1B1F3B'); }); fillRR(g, -8, -82, 16, 70, 5, '#7A869C');
        fillRR(g, -108, -326 + 46, 216, 230, 40, cc); fillRR(g, -96, -314 + 46, 192, 40, 20, 'rgba(255,255,255,.08)');
        fillRR(g, -112, -96, 224, 30, 14, tone(cc, 0.12)); }
      [-1, 1].forEach(function (d) { limb(g, [[d * 38, -70 - hop], [d * 40, -30]], 40, c.low); fillRR(g, d * 40 - 30 + d * 6, -28, 60, 30, 14, c.shoe); });
      [-1, 1].forEach(function (d) { fillE(g, d * 38, -78 - hop, 40, 30, c.low); fillE(g, d * 38, -88 - hop, 30, 12, 'rgba(255,255,255,.12)'); });
    } else if (P.feet) {
      soft(g, 0, 4, 120 - hop * 0.4, 18, 0.22);
      [-1, 1].forEach(function (d) { limb(g, [[d * 34, -128 - hop], [d * 34, -30 - hop * 0.4]], 42, c.low); });
      [-1, 1].forEach(function (d) { fillRR(g, d * 36 - 30 + d * 8, -28 - hop * 0.4, 60, 30, 14, c.shoe); });
    }
    g.translate(0, -hop + (P.sit ? (P.sitDrop != null ? P.sitDrop : 46) : 0)); /* P.sitDrop: a seat higher than the office chair (a banquette or a cafe chair behind a table) */
    var bw = P.build || 1;
    g.save(); g.translate(0, -116); g.scale((1 + 0.008 * br) * bw, 1 + 0.012 * br); g.translate(0, 116); torso(g, P); g.restore();
    g.save(); g.translate(0, F3.top + hb); g.rotate(P.tilt || 0); g.translate(0, -F3.top);
    hair(g, P, true);
    fillRR(g, -20, F3.top - 14, 40, 30, 8, tone(c.skin, 0.1));
    [-1, 1].forEach(function (d) { fillE(g, d * F3.rx * 0.96, F3.hy + F3.ry * 0.12, F3.rx * 0.15, F3.ry * 0.19, c.skin); });
    fillE(g, 0, F3.hy, F3.rx, F3.ry, c.skin);
    if (P.beard) { g.fillStyle = P.beard; g.beginPath(); g.moveTo(-F3.rx * 0.98, F3.hy + F3.ry * 0.05); g.quadraticCurveTo(-F3.rx * 0.9, F3.hy + F3.ry * 1.12, 0, F3.hy + F3.ry * 1.12); g.quadraticCurveTo(F3.rx * 0.9, F3.hy + F3.ry * 1.12, F3.rx * 0.98, F3.hy + F3.ry * 0.05);
      g.quadraticCurveTo(F3.rx * 0.7, F3.hy + F3.ry * 0.5, F3.rx * 0.3, F3.hy + F3.ry * 0.42); g.quadraticCurveTo(0, F3.hy + F3.ry * 0.36, -F3.rx * 0.3, F3.hy + F3.ry * 0.42); g.quadraticCurveTo(-F3.rx * 0.7, F3.hy + F3.ry * 0.5, -F3.rx * 0.98, F3.hy + F3.ry * 0.05); g.closePath(); g.fill();
      fillE(g, 0, F3.hy + F3.ry * 0.7, F3.rx * 0.26, F3.ry * 0.14, tone(c.skin, 0.06)); }
    face(g, P, t); hair(g, P, false); hat(g, P); if (P.headset) headset(g, P);
    g.restore();
    var sl = P.outfit === 'coat' ? '#F1F4FA' : tone(c.top, 0.06);
    [[-1, P.hands[0]], [1, P.hands[1]]].forEach(function (a) {
      var d = a[0], h = a[1], sx = d * F3.shx * bw, sy = F3.shy, r = ik(sx, sy, h[0], h[1], F3.a, F3.b, d), e = r.e, hp = r.h;
      if (P.short) { limb(g, [[sx, sy], e, hp], F3.aw - 6, c.skin); limb(g, [[sx, sy], [lerp(sx, e[0], 0.62), lerp(sy, e[1], 0.62)]], F3.aw + 2, sl); }
      else limb(g, [[sx, sy], e, [lerp(e[0], hp[0], 0.8), lerp(e[1], hp[1], 0.8)]], F3.aw, sl);
      if (d < 0 && P.hold) held(g, P.hold, hp);
      fillE(g, hp[0], hp[1], 19, 19, c.skin);
    });
    g.restore();
  }

  /* a passer-by for a world's margins: walks between x0 and x1 (set units) at spd units/s, bobbing and swinging the arms,
     looking where they go; drag (a colour) pulls a roller case behind them, carry ('bags', 'box', 'tray' ...) holds something */
  var zq = null;
  /* the foreground in depth order: props [[y, fn(g, ext)], ...] and the passers-by that drawWalkers() queues, sorted by the
     y they stand on, so nearer things always cover farther ones */
  function zfore(g, t, S, props, drawWalkers) {
    zq = []; props.forEach(function (p) { if (p) zq.push({ y: p[0], f: function () { p[1](g, S.ext, t); } }); });
    if (drawWalkers) drawWalkers(); var q = zq; zq = null;
    q.sort(function (a, b) { return a.y - b.y; }).forEach(function (it) { it.f(); });
  }
  /* people scale with depth: everyone standing at the same y is the same size */
  function depthScale(y) { return 0.54 + (y - 480) * 0.0002; }
  function walker(g, W, t) {
    if (CALM) return;
    if (zq) { zq.push({ y: W.y, f: function () { walker(g, W, t); } }); return; }
    if (!W.P.fixS) W.P.s = depthScale(W.y) * (W.P.kid ? 0.72 : 1);
    var P = W.P, st = P._w, lo = Math.min(W.x0, W.x1), hi = Math.max(W.x0, W.x1);
    if (!st || st.lo !== lo || st.hi !== hi) { var x0 = lo + (hi - lo) * (((W.ph || 0) % 1 + 1) % 1); st = P._w = { lo: lo, hi: hi, x: x0, tx: x0, t: t, until: t + Math.random() * 2, spd: W.spd, dir: 1, dist: 0 }; }
    var dt = Math.min(0.2, Math.max(0, t - st.t)); st.t = t;
    if (st.x === st.tx && t >= st.until) { /* choose the next stop: somewhere new, at a fresh pace */
      var far = (hi - lo) * (0.25 + Math.random() * 0.75), tx = st.x + (Math.random() < 0.5 ? -far : far);
      if (tx < lo || tx > hi) tx = st.x - (tx - st.x); st.tx = clamp(tx, lo, hi); st.spd = W.spd * (0.6 + Math.random() * 0.8); }
    var moving = st.x !== st.tx;
    if (moving) { var d = st.tx - st.x, mv = Math.min(Math.abs(d), st.spd * dt); st.dir = d > 0 ? 1 : -1; st.x += st.dir * mv; st.dist += mv;
      if (Math.abs(st.tx - st.x) < 0.5) { st.x = st.tx; st.until = t + 0.8 + Math.random() * 3.6; } }
    var x = st.x, dir = st.dir, step = st.dist * 0.09 + (W.ph || 0) * 7, sw = moving ? Math.sin(step) * 30 : 0;
    P.x = x; P.y = W.y; P.look = moving ? dir * 0.8 : Math.sin(t * 0.7 + (W.ph || 0) * 9) * 0.9; P.hop = moving ? Math.abs(Math.sin(step)) * 6 : 0; P.feet = true;
    P.hands = W.drag ? (dir > 0 ? [[-94, -150], [70 + sw * 0.3, -150]] : [[-70 - sw * 0.3, -150], [94, -150]]) : [[-70 - sw * 0.4, -150 + Math.abs(sw) * 0.4], [70 + sw * 0.4, -150 + Math.abs(sw) * 0.4]];
    if (P.wheel) { /* a wheelchair user, seen from the front like everyone else: big wheels either side, pushing the rims */
      var wx = x, wy = W.y, s = P.s, push = Math.sin(step * 0.6) * 10, spin = step * 0.25 * dir; P.hop = 0; P.feet = false; P.look = dir * 0.6;
      g.save(); g.translate(wx, wy); g.scale(s, s); soft(g, 0, 4, 130, 16, 0.22); fillRR(g, -78, -270, 156, 170, 18, '#3A4458'); g.restore();
      P.hands = [[-102, -118 + push], [102, -118 - push]]; var y0 = P.y; P.y = wy - 36 * s; person(g, P, t); P.y = y0;
      g.save(); g.translate(wx, wy); g.scale(s, s); var lo = P.c.low || '#3A4458';
      fillRR(g, -84, -150, 168, 26, 10, '#4A5468'); [-1, 1].forEach(function (d) { fillRR(g, d * 34 - 20, -140, 40, 104, 16, lo); fillRR(g, d * 36 - 26, -46, 52, 24, 11, P.c.shoe || '#F7F8FB'); });
      g.strokeStyle = '#8A94A8'; g.lineWidth = 6; g.beginPath(); g.moveTo(-70, -20); g.lineTo(70, -20); g.stroke();
      [-1, 1].forEach(function (d) { var cx2 = d * 104; g.strokeStyle = '#2A3142'; g.lineWidth = 10; g.beginPath(); g.ellipse(cx2, -92, 18, 90, 0, 0, Math.PI * 2); g.stroke();
        g.strokeStyle = '#A9B2C4'; g.lineWidth = 4; g.beginPath(); g.ellipse(cx2 - d * 6, -92, 12, 76, 0, 0, Math.PI * 2); g.stroke();
        fillE(g, cx2 + Math.sin(spin) * 6, -92 + Math.cos(spin) * 60, 4, 6, '#FFFFFF'); fillE(g, d * 66, -6, 9, 9, '#2A3142'); });
      g.restore(); return; }
    if (W.drag) { var cx = x - dir * 70 * P.s, cy = W.y; g.save(); g.translate(cx, cy); g.scale(P.s, P.s); g.strokeStyle = '#5C6670'; g.lineWidth = 6; g.beginPath(); g.moveTo(dir * 12, -70); g.lineTo(dir * 34, -150); g.stroke();
      fillRR(g, -40, -96, 80, 96, 12, W.drag); fillRR(g, -40, -96, 80, 14, 7, tone(W.drag, 0.18)); fillE(g, -26, 2, 7, 7, '#2A3550'); fillE(g, 26, 2, 7, 7, '#2A3550'); g.restore(); }
    person(g, P, t);
  }
  /* ============================== shared room painters (set units: 1000 x 600; walls and floors in hero px) ============================== */
  /* R: { wall:[top,bottom], wains:[top,bottom], rail, base, panelLine, floor:[top,bottom], floorKind: tiles | planks, floorLine, pattern(g, W, railY, k, sx, sy) } */
  function room(g, W, Hh, k, sx, sy, R) {
    var F = R.floorY || 470, fy = sy + F * k, ry = fy - (R.wainsH == null ? 150 : R.wainsH) * k, wg = g.createLinearGradient(0, 0, 0, fy);
    wg.addColorStop(0, R.wall[0]); wg.addColorStop(1, R.wall[1]); g.fillStyle = wg; g.fillRect(0, 0, W, fy);
    if (R.pattern) R.pattern(g, W, ry, k, sx, sy);
    var wa = g.createLinearGradient(0, ry, 0, fy); wa.addColorStop(0, R.wains[0]); wa.addColorStop(1, R.wains[1]); g.fillStyle = wa; g.fillRect(0, ry, W, fy - ry);
    g.strokeStyle = R.panelLine || 'rgba(30,70,80,.07)'; g.lineWidth = 3 * k; var pw = 150 * k;
    for (var px = (sx % pw) - pw; px < W; px += pw) { rr(g, px + 14 * k, ry + 22 * k, pw - 28 * k, (fy - ry) - 48 * k, 8 * k); g.stroke(); }
    g.fillStyle = R.rail || '#FFFFFF'; g.fillRect(0, ry - 7 * k, W, 9 * k); g.fillStyle = 'rgba(30,70,80,.08)'; g.fillRect(0, ry + 2 * k, W, 3 * k);
    g.fillStyle = R.base || '#BFDDD7'; g.fillRect(0, fy - 18 * k, W, 18 * k); g.fillStyle = 'rgba(255,255,255,.5)'; g.fillRect(0, fy - 18 * k, W, 3 * k);
    var fg = g.createLinearGradient(0, fy, 0, Hh); fg.addColorStop(0, R.floor[0]); fg.addColorStop(1, R.floor[1]); g.fillStyle = fg; g.fillRect(0, fy, W, Hh - fy);
    var cx = sx + 560 * k, d, i;
    if (R.floorKind === 'planks') {
      g.strokeStyle = R.floorLine || 'rgba(120,80,40,.16)'; g.lineWidth = 2 * k; g.beginPath();
      for (d = 1; d < 10; d++) { var yy = fy + Math.pow(d / 9, 1.5) * (Hh - fy) * 1.02; g.moveTo(0, yy); g.lineTo(W, yy); }
      for (d = 0; d < 9; d++) { var y0 = fy + Math.pow(d / 9, 1.5) * (Hh - fy), y1 = fy + Math.pow((d + 1) / 9, 1.5) * (Hh - fy), stp = 230 * k * (1 + d * 0.12);
        for (i = ((d * 97) % 230) * k - stp; i < W; i += stp) { g.moveTo(i, y0); g.lineTo(i + (i - cx) * 0.05, y1); } }
      g.stroke();
    } else {
      g.strokeStyle = R.floorLine || 'rgba(255,255,255,.75)'; g.lineWidth = 2.2 * k; g.beginPath();
      for (d = 1; d < 9; d++) { var yt = fy + Math.pow(d / 8, 1.6) * (Hh - fy) * 1.02; g.moveTo(0, yt); g.lineTo(W, yt); }
      for (i = -30; i <= 30; i++) { g.moveTo(cx + i * 70 * k, fy); g.lineTo(cx + i * 70 * k * 2.6, Hh + 40); }
      g.stroke();
    }
    var sh = g.createLinearGradient(0, fy, 0, fy + 40 * k); sh.addColorStop(0, 'rgba(20,50,70,.10)'); sh.addColorStop(1, 'rgba(20,50,70,0)'); g.fillStyle = sh; g.fillRect(0, fy, W, 40 * k);
  }
  function plusPattern(col) {
    return function (g, W, ry, k, sx, sy) {
      g.fillStyle = col; var step = 46 * k, s = 5 * k, w2 = 1.6 * k;
      for (var y = sy % step + step * 0.5; y < ry - step * 0.4; y += step) for (var x = (sx % step) + ((Math.round(y / step) % 2) ? step / 2 : 0); x < W; x += step) { g.fillRect(x - s, y - w2, s * 2, w2 * 2); g.fillRect(x - w2, y - s, w2 * 2, s * 2); }
    };
  }
  function windowFrame(g, w, floorY) {
    var F = floorY || 470;
    g.save(); var lp = g.createRadialGradient(w.x + w.w * 0.75, F + 40, 10, w.x + w.w * 0.75, F + 40, 260); lp.addColorStop(0, 'rgba(255,250,225,.55)'); lp.addColorStop(1, 'rgba(255,250,225,0)');
    g.fillStyle = lp; g.beginPath(); g.moveTo(w.x + 40, F + 2); g.lineTo(w.x + w.w + 180, F + 2); g.lineTo(w.x + w.w + 330, 660); g.lineTo(w.x + 120, 660); g.closePath(); g.fill(); g.restore();
    shadowed(g, 22, 8, 0.18, function () { fillRR(g, w.x - 14, w.y - 14, w.w + 28, w.h + 28, 18, '#FFFFFF'); });
    fillRR(g, w.x - 24, w.y + w.h + 12, w.w + 48, 14, 6, '#FFFFFF'); g.fillStyle = 'rgba(30,60,90,.08)'; g.fillRect(w.x - 20, w.y + w.h + 24, w.w + 40, 3);
  }
  function cloud(g, x, y, s) {
    g.save(); g.translate(x, y); g.scale(s, s);
    [[0, 0, 62], [58, -22, 74], [128, -4, 58], [70, 18, 62], [-46, 14, 44]].forEach(function (p) { fillE(g, p[0] + 6, p[1] + 10, p[2], p[2], 'rgba(205,222,245,.9)'); });
    [[0, 0, 62], [58, -22, 74], [128, -4, 58], [70, 18, 62], [-46, 14, 44]].forEach(function (p) { fillE(g, p[0], p[1], p[2], p[2], '#FFFFFF'); }); g.restore();
  }
  function windowSky(g, w, t, par, top, bot) {
    var sg = g.createLinearGradient(0, w.y, 0, w.y + w.h); sg.addColorStop(0, top || '#8FD3FF'); sg.addColorStop(1, bot || '#E3F5FF'); g.fillStyle = sg; g.fillRect(w.x, w.y, w.w, w.h);
    var sx = w.x + w.w * 0.78 - par * 4, sy = w.y + 48, gl = g.createRadialGradient(sx, sy, 6, sx, sy, 90); gl.addColorStop(0, 'rgba(255,244,200,.9)'); gl.addColorStop(0.3, 'rgba(255,236,170,.35)'); gl.addColorStop(1, 'rgba(255,236,170,0)');
    g.fillStyle = gl; g.fillRect(w.x, w.y, w.w, w.h); fillE(g, sx, sy, 15, 15, '#FFF4C9');
    for (var c = 0; c < 3; c++) { var sp = 5 + c * 2.2, x = w.x - 60 + ((hash(c + 4) * 400 + t * sp) % (w.w + 140)) - par * (2 + c), y = w.y + 40 + c * 34; cloud(g, x, y, 0.26 + c * 0.04); }
  }
  function windowGlass(g, w) {
    g.fillStyle = 'rgba(255,255,255,.32)'; g.beginPath(); g.moveTo(w.x + w.w * 0.12, w.y + w.h); g.lineTo(w.x + w.w * 0.44, w.y); g.lineTo(w.x + w.w * 0.6, w.y); g.lineTo(w.x + w.w * 0.28, w.y + w.h); g.closePath(); g.fill();
  }
  function windowMullions(g, w) { g.fillStyle = '#FFFFFF'; g.fillRect(w.x + w.w / 2 - 5, w.y, 10, w.h); g.fillRect(w.x, w.y + w.h * 0.46 - 5, w.w, 10); }
  function plaque(g, s, title, sub, iconCol, icon) {
    shadowed(g, 14, 5, 0.16, function () { fillRR(g, s.x, s.y, s.w, s.h, 14, '#FFFFFF'); });
    fillE(g, s.x + 27, s.y + 25, 17, 17, iconCol || '#21B799'); if (icon) icon(g, s.x + 27, s.y + 25);
    text(g, title, s.x + 52, s.y + 25, 17, 800, '#1F1F3D'); text(g, sub, s.x + 52, s.y + 40, 10.5, 600, '#5C5C73');
  }
  function clockFace(g, c, rim) {
    shadowed(g, 10, 4, 0.16, function () { fillE(g, c.x, c.y, c.r + 5, c.r + 5, rim || '#21B799'); });
    fillE(g, c.x, c.y, c.r, c.r, '#FFFFFF'); g.fillStyle = '#9AA6BC';
    for (var i = 0; i < 12; i++) { var a = i * Math.PI / 6; g.beginPath(); g.arc(c.x + Math.cos(a) * (c.r - 5), c.y + Math.sin(a) * (c.r - 5), i % 3 ? 1.2 : 2, 0, 7); g.fill(); }
  }
  function clockHands(g, c, h, m, s) {
    var hr = (h % 12 + m / 60) * Math.PI / 6 - Math.PI / 2, mn = (m + s / 60) * Math.PI / 30 - Math.PI / 2, se = s * Math.PI / 30 - Math.PI / 2, r = c.r;
    g.lineCap = 'round'; g.strokeStyle = '#1F1F3D'; g.lineWidth = 3.2; g.beginPath(); g.moveTo(c.x, c.y); g.lineTo(c.x + Math.cos(hr) * r * 0.45, c.y + Math.sin(hr) * r * 0.45); g.stroke();
    g.lineWidth = 2.2; g.beginPath(); g.moveTo(c.x, c.y); g.lineTo(c.x + Math.cos(mn) * r * 0.68, c.y + Math.sin(mn) * r * 0.68); g.stroke();
    g.strokeStyle = '#E0456B'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(c.x, c.y); g.lineTo(c.x + Math.cos(se) * r * 0.78, c.y + Math.sin(se) * r * 0.78); g.stroke(); fillE(g, c.x, c.y, 2.4, 2.4, '#1F1F3D');
  }
  function plant(g, pl, pot, potRim) {
    var lv = [[-30, -150, 20, 46, -0.6], [26, -160, 20, 48, 0.55], [-8, -190, 18, 50, -0.1], [-38, -100, 18, 36, -1], [36, -110, 18, 38, 1], [10, -128, 16, 40, 0.3], [-20, -130, 16, 40, -0.4]];
    g.strokeStyle = '#2E9E66'; g.lineWidth = 4; g.lineCap = 'round';
    lv.forEach(function (L) { g.beginPath(); g.moveTo(pl.x, pl.y - 48); g.quadraticCurveTo(pl.x + L[0] * 0.3, pl.y + L[1] * 0.6, pl.x + L[0], pl.y + L[1] + 20); g.stroke(); });
    lv.forEach(function (L, i) { ell(g, pl.x + L[0], pl.y + L[1], L[2], L[3], L[4]); g.fillStyle = i % 2 ? '#3FBF7F' : '#35AE70'; g.fill(); ell(g, pl.x + L[0] - 3, pl.y + L[1] - 6, L[2] * 0.35, L[3] * 0.6, L[4]); g.fillStyle = 'rgba(255,255,255,.18)'; g.fill(); });
    fillRR(g, pl.x - 26, pl.y - 52, 52, 52, 10, pot || '#F59A8B'); fillRR(g, pl.x - 30, pl.y - 56, 60, 12, 6, potRim || '#F7AE9F'); g.fillStyle = 'rgba(120,30,20,.08)'; g.fillRect(pl.x + 8, pl.y - 44, 18, 42);
  }
  function motes(g, t, col) {
    g.fillStyle = col || 'rgba(255,255,255,.7)';
    for (var i = 0; i < 18; i++) { var bx = 150 + hash(i * 3.3) * 820, span = 380, by = 80 + ((hash(i * 1.9) * span - t * (6 + hash(i) * 10)) % span + span) % span, r = 1.4 + hash(i * 7) * 2.2;
      g.beginPath(); g.arc(bx + Math.sin(t * 0.7 + i) * 12, by, r, 0, 7); g.fill(); }
  }

  var IXW = window.IXW = window.IXW || {};
  IXW.worlds = IXW.worlds || {};
  IXW.kit = { clamp: clamp, lerp: lerp, ease: ease, hash: hash, rr: rr, ell: ell, fillRR: fillRR, fillE: fillE, limb: limb, soft: soft, shadowed: shadowed, text: text, tone: tone, FONT: FONT,
    person: person, ik: ik, F3: F3, room: room, plusPattern: plusPattern, windowFrame: windowFrame, windowSky: windowSky, windowGlass: windowGlass, windowMullions: windowMullions, cloud: cloud,
    plaque: plaque, clockFace: clockFace, clockHands: clockHands, plant: plant, motes: motes, walker: walker, zfore: zfore, depthScale: depthScale, reduce: reduce, calm: CALM };

  /* ============================== the hero ==============================
     A world: { room (see room()) or paintBg(g, W, H, k, sx, sy), paintBack(g), paintFront(g), paintWindow(g, t, par, S), paintLive(g, t, date, S),
     paintFrontLive?(g, t, S), paintFore?(g, ext) (static props in the foreground, y >= 560, cached and drawn over the passers-by on
     the floor line), paintForeLive?(g, t, S) (the front-row passers-by, over the foreground props), glow {hotKey or toyName: fn(g) path}, backGlow [keys drawn behind the counter staff],
     cast [{ id, P, behind, keys [hotKeys that make them talk], act(P, t, S) }], toy?(name, S, t, btn), onStop?(key, S, t), moteCol, motes (false: no dust motes),
     windowBehind? (the window view is painted BEHIND the back props, which get a third cache: paintBg, then the live view,
     then paintFrame?(g, W, H, k, sx, sy) (hero px: mullions, ceiling, floor) and paintBack) }
     paintBack(g, ext) and paintFront(g, ext) may paint beyond the frame: ext {l, r, t, b} is the whole hero in set units.
     S (shared state): hot, hotA, peek (the hotspot or toy under the pointer), peekA, ext, nexi {x, y}, cast {id: {wave, until, hover, hopAt}}, toy {name: start time}, t */
  function hero(root) {
    var W0 = IXW.worlds[root.getAttribute('data-world')];
    var frame = root.querySelector('[data-ixw-frame]'), box = frame || root, reduce = REDUCE;
    var cv = root.querySelector('[data-ixw-cv]'), set = root.querySelector('[data-ixw-set]'), front = root.querySelector('[data-ixw-front]');
    var nexi = root.querySelector('[data-ixw-nexi]'), cap = root.querySelector('[data-ixw-cap]');
    if (!W0 || !cv || !set || !cv.getContext) return;
    var g = cv.getContext('2d'), A = document.createElement('canvas'), B = document.createElement('canvas'), ga = A.getContext('2d'), gb = B.getContext('2d');
    var C = W0.windowBehind ? document.createElement('canvas') : null, gc = C && C.getContext('2d');
    var D = W0.paintFore ? document.createElement('canvas') : null, gd = D && D.getContext('2d'); /* the foreground props, in front of the passers-by */
    var W = 0, Hh = 0, dpr = 1, k = 1, sx = 0, sy = 0, M = 24, live = false, raf = 0, frameN = 0, T0 = performance.now();
    /* phones: the sideways drag. pan (px) runs from -Er (the right margin in view) to El (the left margin in view) */
    var El = 0, Er = 0, pan = 0, panT = 0, panSet = null, drag = null, noClick = 0, follow = 0, lastHot = '', PAN_L = -300, PAN_R = 1280;
    var phoneQ = window.matchMedia ? window.matchMedia('(max-width:767px)') : { matches: false };
    var par = { x: 0, y: 0, tx: 0, ty: 0 };
    var home = (root.getAttribute('data-home') || '288,196').split(',').map(Number);
    var S = { hot: '', hotA: 0, peek: '', peekA: 0, nexi: { x: home[0], y: home[1] }, cast: {}, toy: {}, t: 0, ext: { l: 0, r: 1000, t: 0, b: 600 } }, pk = '';
    W0.cast.forEach(function (c) { S.cast[c.id] = { wave: 0, until: 0, hover: false, hopAt: -9 }; });
    root.classList.add('is-live');
    /* "View the scene": hides the title card and the caption so the whole scene shows (desktop; the button is added here) */
    if (!frame) { var peekBtn = document.createElement('button'), peekLab = document.createElement('span');
    peekBtn.type = 'button'; peekBtn.className = 'ixw-peek'; peekBtn.setAttribute('aria-pressed', 'false'); peekLab.textContent = 'View the scene'; peekBtn.appendChild(peekLab);
    peekBtn.addEventListener('click', function () { var on = root.classList.toggle('is-peek'); peekBtn.setAttribute('aria-pressed', on ? 'true' : 'false'); peekLab.textContent = on ? 'Show the text' : 'View the scene'; });
    root.appendChild(peekBtn); }
    function now() { return (performance.now() - T0) / 1000; }

    var capEl = root.querySelector('.ixw-cap');
    function setPan() { var v = pan.toFixed(1); if (v === panSet) return; panSet = v;
      set.style.translate = v + 'px 0'; if (capEl) capEl.style.translate = (-pan).toFixed(1) + 'px 0'; if (hint) hint.style.translate = 'calc(-50% - ' + v + 'px) 0'; }
    var hint = document.createElement('span'); hint.className = 'ixw-drag'; hint.setAttribute('aria-hidden', 'true'); hint.textContent = 'Drag to look around'; if (!frame) set.appendChild(hint);
    function dragDone() { if (!root.classList.contains('was-dragged')) root.classList.add('was-dragged'); }
    root.addEventListener('pointerdown', function (e) {
      if (!(El || Er) || !e.isPrimary || (e.target.closest && e.target.closest('.ixw-cap, .ixw-copy, a'))) return;
      drag = { x: e.clientX, y: e.clientY, p: pan, on: false, id: e.pointerId, vx: 0, lx: e.clientX, lt: performance.now() };
    });
    root.addEventListener('pointermove', function (e) {
      if (!drag || e.pointerId !== drag.id) return;
      var dx = e.clientX - drag.x, dy = e.clientY - drag.y, tn = performance.now();
      if (!drag.on) { if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy) * 1.2) { drag.on = true; root.classList.add('is-dragging'); dragDone(); } else { if (Math.abs(dy) > 12) drag = null; return; } }
      drag.vx = lerp(drag.vx, (e.clientX - drag.lx) / Math.max(8, tn - drag.lt), 0.5); drag.lx = e.clientX; drag.lt = tn;
      pan = panT = clamp(drag.p + dx, -Er, El); follow = 0; setPan(); if (reduce || !raf) draw(performance.now());
    });
    function dragEnd() { if (!drag) return; if (drag.on) { panT = clamp(pan + drag.vx * 240, -Er, El); noClick = performance.now(); root.classList.remove('is-dragging'); if (reduce || !raf) { pan = panT; setPan(); draw(performance.now()); } } drag = null; }
    root.addEventListener('pointerup', dragEnd); root.addEventListener('pointercancel', dragEnd);
    root.addEventListener('click', function (e) { if (performance.now() - noClick < 350) { e.stopPropagation(); e.preventDefault(); } }, true);
    if (phoneQ.addEventListener) phoneQ.addEventListener('change', function () { panT = pan = 0; measure(); });
    function frameSet() { /* CALM: scale and place the set so the frame shows the world's calm view, centred, covering the frame */
      var fr = frame.getBoundingClientRect(), V = W0.calmView || CALM_VIEW[root.getAttribute('data-world')] || CALM_VIEW.def;
      var kk = Math.max(fr.width / V[2], fr.height / V[3]);
      set.style.width = (1000 * kk).toFixed(2) + 'px';
      set.style.left = (-V[0] * kk + (fr.width - V[2] * kk) / 2).toFixed(2) + 'px';
      set.style.top = (-V[1] * kk + (fr.height - V[3] * kk) / 2).toFixed(2) + 'px';
    }
    function measure() {
      if (frame) frameSet();
      var hr = box.getBoundingClientRect(), r = set.getBoundingClientRect();
      W = Math.round(hr.width); Hh = Math.round(hr.height); dpr = Math.min(window.devicePixelRatio || 1, phoneQ.matches ? 1.25 : 1.5);   // R9 perf: the full-hero canvas at 1.75x cost a third more fill per frame for no visible gain
      k = r.width / 1000; sx = r.left - hr.left - pan; sy = r.top - hr.top;
      /* phones: how far the scene may slide each way to reach set units PAN_L .. PAN_R */
      var PL = W0.pan ? W0.pan[0] : PAN_L, PR = W0.pan ? W0.pan[1] : PAN_R;
      El = Er = 0; if (phoneQ.matches && !frame) { El = Math.max(0, Math.round(-(sx + PL * k))); Er = Math.max(0, Math.round(sx + PR * k - W)); }
      pan = panT = clamp(panT, -Er, El); setPan();
      VIEW = null; /* the static layers paint everything */
      var VW = W + El + Er, SX = sx + El; /* the caches see a hero widened by the drag range */
      [cv, A, B, C, D].forEach(function (c) { if (!c) return; c.width = Math.round(((c === cv ? W : VW) + M * 2) * dpr); c.height = Math.round((Hh + M * 2) * dpr); });
      cv.style.width = (W + M * 2) + 'px'; cv.style.height = (Hh + M * 2) + 'px';
      ga.setTransform(dpr, 0, 0, dpr, M * dpr, M * dpr);
      if (W0.paintBg) W0.paintBg(ga, VW + M, Hh + M, k, SX, sy); else room(ga, VW + M, Hh + M, k, SX, sy, W0.room);
      var gp = gc || ga; /* the back props get their own cache when the window view sits behind them */
      if (gc) { gc.setTransform(dpr, 0, 0, dpr, M * dpr, M * dpr); if (W0.paintFrame) W0.paintFrame(gc, VW + M, Hh + M, k, SX, sy); }
      /* the whole hero in set units: a world paints beyond its 1000 x 600 frame into the margins (ext.l < 0, ext.r > 1000) */
      S.ext = { l: -(SX + M) / k, r: (VW + M - SX) / k, t: -(sy + M) / k, b: (Hh + M - sy) / k };
      gp.setTransform(dpr * k, 0, 0, dpr * k, (SX + M) * dpr, (sy + M) * dpr); W0.paintBack(gp, S.ext);
      gb.setTransform(dpr * k, 0, 0, dpr * k, (SX + M) * dpr, (sy + M) * dpr); W0.paintFront(gb, S.ext);
      if (gd) { gd.setTransform(dpr * k, 0, 0, dpr * k, (SX + M) * dpr, (sy + M) * dpr); W0.paintFore(gd, S.ext); }
      draw(performance.now());
    }
    /* the tour glow pulses; the hover glow (the thing under the pointer) is a steady outline with a light wash */
    function glow(t, key, a, hover) {
      var fn = W0.glow && W0.glow[key]; if (!fn || a < 0.01) return;
      g.save(); g.shadowColor = 'rgba(255,255,255,.95)'; g.shadowBlur = 18; g.lineWidth = 4; fn(g);
      if (hover) { g.fillStyle = 'rgba(255,255,255,' + (0.16 * a).toFixed(3) + ')'; g.fill(); g.strokeStyle = 'rgba(49,103,202,' + (0.85 * a).toFixed(3) + ')'; }
      else g.strokeStyle = 'rgba(49,103,202,' + ((0.5 + 0.3 * Math.sin(t * 5)) * a).toFixed(3) + ')';
      g.stroke(); g.restore();
    }
    /* a staff member under the pointer smiles and gives one little hop */
    function figure(c, t) {
      var st = S.cast[c.id], P = c.P, m0 = P.mood, h0 = P.hop || 0, u = (t - st.hopAt) / 0.5;
      if (st.hover && m0 === 'calm') P.mood = 'happy';
      if (u >= 0 && u < 1 && !reduce) P.hop = h0 + Math.sin(u * Math.PI) * 16;
      person(g, P, t); P.mood = m0; P.hop = h0;
    }
    /* CALM: only the core of the analogy stays: a world lists the cast it keeps (calmCast) or hides (calmHide) */
    function shown(c) { if (!frame) return true; if (W0.calmCast) return W0.calmCast.indexOf(c.id) >= 0; return !(W0.calmHide && W0.calmHide.indexOf(c.id) >= 0); }
    var cost = { n: 0, avg: 0, max: 0 }; IXW.stats = cost;
    function draw(nowMs) {
      var c0 = performance.now();
      drawFrame(nowMs);
      var dt = performance.now() - c0; cost.n++; cost.avg += (dt - cost.avg) * 0.05; if (dt > cost.max) cost.max = dt;
    }
    function drawFrame(nowMs) {
      var t = Math.max(0, (nowMs - T0) / 1000); S.t = t;   // a rAF timestamp can predate T0 on the first frame
      VIEW = { l: (-M - sx - pan) / k, r: (W + M - sx - pan) / k };
      par.x = lerp(par.x, par.tx, ease(0.08)); par.y = lerp(par.y, par.ty, ease(0.08));
      if (S.hot) S.hotA = Math.min(1, S.hotA + 0.08 * FS);
      if (S.peek) { if (pk !== S.peek) { pk = S.peek; S.peekA = 0; } S.peekA = reduce ? 1 : Math.min(1, S.peekA + 0.2 * FS); }
      else { S.peekA = reduce ? 0 : Math.max(0, S.peekA - 0.2 * FS); if (!S.peekA) pk = ''; }
      if (El || Er) {
        if (S.hot !== lastHot) { lastHot = S.hot; if (!drag) follow = nowMs + 2600; }
        if (!drag && nowMs < follow) { var nx = sx + S.nexi.x * k + panT, pad = 56; if (nx < pad) panT += pad - nx; else if (nx > W - pad) panT -= nx - (W - pad); panT = clamp(panT, -Er, El); }
        if (!drag) pan = Math.abs(panT - pan) < 0.3 ? panT : lerp(pan, panT, ease(0.16)); setPan();
      }
      var fx = par.x * 6, fy = par.y * 3, back = W0.backGlow || [], pkOn = pk && pk !== S.hot, px = sx + pan, sh = pan - El;
      g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, cv.width, cv.height);
      g.drawImage(A, sh * dpr, 0);
      g.setTransform(dpr * k, 0, 0, dpr * k, (px + M) * dpr, (sy + M) * dpr);
      W0.paintWindow(g, t, par.x, S);
      if (C) { g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(C, sh * dpr, 0); g.setTransform(dpr * k, 0, 0, dpr * k, (px + M) * dpr, (sy + M) * dpr); }
      W0.paintLive(g, t, new Date(), S);
      if (S.hot && back.indexOf(S.hot) >= 0) glow(t, S.hot, S.hotA);
      if (pkOn && back.indexOf(pk) >= 0) glow(t, pk, S.peekA, true);
      g.setTransform(dpr * k, 0, 0, dpr * k, (px + M + fx) * dpr, (sy + M + fy) * dpr);
      W0.cast.forEach(function (c) { if (c.behind && shown(c)) { c.act(c.P, t, S); figure(c, t); } });
      g.setTransform(dpr, 0, 0, dpr, fx * dpr, fy * dpr); g.drawImage(B, sh, 0, B.width / dpr, B.height / dpr);
      g.setTransform(dpr * k, 0, 0, dpr * k, (px + M + fx) * dpr, (sy + M + fy) * dpr);
      if (W0.paintFrontLive) W0.paintFrontLive(g, t, S);
      if (D) { g.setTransform(dpr, 0, 0, dpr, fx * dpr, fy * dpr); g.drawImage(D, sh, 0, D.width / dpr, D.height / dpr); g.setTransform(dpr * k, 0, 0, dpr * k, (px + M + fx) * dpr, (sy + M + fy) * dpr); }
      if (W0.paintForeLive && !frame) W0.paintForeLive(g, t, S);
      if (S.hot && back.indexOf(S.hot) < 0) glow(t, S.hot, S.hotA);
      if (pkOn && back.indexOf(pk) < 0) glow(t, pk, S.peekA, true);
      W0.cast.forEach(function (c) { if (!c.behind && shown(c)) { c.act(c.P, t, S); figure(c, t); } });
      if (!reduce && W0.motes !== false) motes(g, t, W0.moteCol);
      if (front) front.style.transform = 'translate3d(' + fx.toFixed(2) + 'px,' + fy.toFixed(2) + 'px,0)';
    }
    /* R10 perf: the canvas covers the whole hero and every paint clears it and blits up to four full-size caches, which
       kept laptop GPUs busy at 60 fps. The scene's motion is gentle (breathing, blinking, drifting motes), so it paints at
       ~30 fps (every other 60 Hz frame, every 4th at 120 Hz); a drag on phones still paints every frame. Nexi and the
       captions are DOM and stay at the display rate. */
    var lastDraw = 0;
    function loop(nowMs) {
      raf = 0; if (!live) return;
      var el = lastDraw ? nowMs - lastDraw : 1e9;
      if (drag || el >= 29) { FS = el > 1e8 ? 1 : clamp(Math.round(el / 16.67), 1, 4); lastDraw = nowMs; draw(nowMs); FS = 1; }
      raf = requestAnimationFrame(loop);
    }
    function start() { if (!raf && live && !reduce) raf = requestAnimationFrame(loop); }
    function setLive(on) { live = on && !document.hidden; lastDraw = 0; if (live) start(); else if (raf) { cancelAnimationFrame(raf); raf = 0; } }
    function redraw() { if (!live || reduce) draw(performance.now()); }
    var rt = 0; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(measure, 120); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    measure();
    if ('ResizeObserver' in window) { var lastW = 0, lastH = 0; new ResizeObserver(function (es) { var r = es[0].contentRect; if (Math.abs(r.width - lastW) < 1 && Math.abs(r.height - lastH) < 1) return; lastW = r.width; lastH = r.height; clearTimeout(rt); rt = setTimeout(measure, 120); }).observe(box); }
    if (frame) { /* repaint the caches when late images (sprites, photos) have arrived */
      window.addEventListener('load', function () { measure(); setTimeout(measure, 900); });
      setTimeout(function () { if (!frame.dataset.done) { frame.dataset.done = '1'; measure(); } }, 1600);
    }
    var started = false, tour;
    onScreen(root, function (on) { root.classList.toggle('is-off', !on); setLive(on); if (tour) tour.visible(on); });
    document.addEventListener('visibilitychange', function () { setLive(!document.hidden && root.getBoundingClientRect().bottom > 0); });
    if (fine && !reduce) {
      var pbox = null;
      root.addEventListener('pointerenter', function () { pbox = root.getBoundingClientRect(); });
      root.addEventListener('pointermove', function (e) { if (!pbox) pbox = root.getBoundingClientRect(); par.tx = clamp((e.clientX - pbox.left) / pbox.width * 2 - 1, -1, 1); par.ty = clamp((e.clientY - pbox.top) / pbox.height * 2 - 1, -1, 1); });
      root.addEventListener('pointerleave', function () { par.tx = 0; par.ty = 0; pbox = null; });
      window.addEventListener('scroll', function () { pbox = null; }, { passive: true });
    }

    /* ---------------- Nexi: poses, flights, reactions ---------------- */
    var poses = nexi ? [].slice.call(nexi.querySelectorAll('[data-pose]')) : [], flyT = 0;
    function pose(name) { poses.forEach(function (im) { im.classList.toggle('is-on', im.getAttribute('data-pose') === name); }); if (nexi) { nexi.classList.remove('is-pop'); void nexi.offsetWidth; nexi.classList.add('is-pop'); } }
    function flyTo(x, y, p) {
      if (!nexi) return;
      var dx = x - S.nexi.x, far = Math.hypot(dx, y - S.nexi.y) > 30;
      S.nexi = { x: x, y: y };
      nexi.style.setProperty('--nx', x); nexi.style.setProperty('--ny', y); nexi.style.setProperty('--tilt', (clamp(dx / 40, -10, 10)).toFixed(1) + 'deg');
      if (far && !reduce) { nexi.classList.remove('is-fly'); void nexi.offsetWidth; nexi.classList.add('is-fly'); clearTimeout(flyT); flyT = setTimeout(function () { nexi.classList.remove('is-fly'); }, 1150); pose('present'); setTimeout(function () { pose(p); }, 760); }
      else pose(p);
    }

    /* ---------------- caption: typed like the videos ---------------- */
    var typeEl = cap && cap.querySelector('[data-ixw-type]'), liveEl = cap && cap.querySelector('[data-ixw-live]'), whoEl = cap && cap.querySelector('[data-ixw-who]'), roleEl = cap && cap.querySelector('[data-ixw-role]'), avEl = cap && cap.querySelector('[data-ixw-av]');
    var typeTimer = 0, recEl = cap && cap.querySelector('[data-ixw-rec]');
    function say(textS, who, role, av, announce) {
      if (!typeEl) return;
      if (whoEl) whoEl.textContent = who || 'Nexi'; if (roleEl) roleEl.textContent = role || roleEl.getAttribute('data-default') || '';
      if (avEl) { avEl.setAttribute('data-av', av || 'nexi'); avEl.classList.toggle('is-cast', !!av && av !== 'nexi'); [].forEach.call(avEl.querySelectorAll('b[data-for]'), function (b) { b.classList.toggle('is-on', b.getAttribute('data-for') === av); }); }
      var plain = textS.replace(/\*\*/g, ''); if (liveEl && announce) liveEl.textContent = (who || 'Nexi') + ': ' + plain;
      clearInterval(typeTimer);
      var parts = textS.split('**'), n = 0, total = plain.length;
      /* built from text nodes (never markup): **bold** parts become <b> elements */
      function render(m) { var frag = document.createDocumentFragment(), left = m; parts.forEach(function (p, i) { if (left <= 0) return; var s = p.slice(0, left); left -= s.length; if (i % 2) { var b = document.createElement('b'); b.textContent = s; frag.appendChild(b); } else frag.appendChild(document.createTextNode(s)); }); typeEl.textContent = ''; typeEl.appendChild(frag); }
      cap.classList.add('is-typing');
      if (reduce) { render(total); cap.classList.remove('is-typing'); return; }
      typeTimer = setInterval(function () { n += 2; render(n); if (n >= total) { clearInterval(typeTimer); cap.classList.remove('is-typing'); } }, 32);
    }
    function rec(el) {
      if (!recEl) return; var ic = el && el.querySelector('.oi'), r = el && el.getAttribute('data-rec');
      recEl.textContent = '';
      if (r) { if (ic) recEl.appendChild(ic.cloneNode(true)); var sp = document.createElement('span'); sp.textContent = r; recEl.appendChild(sp); var em = document.createElement('em'); em.textContent = 'Sample'; recEl.appendChild(em); }
      cap.classList.remove('has-rec'); if (r) { void cap.offsetWidth; cap.classList.add('has-rec'); }
    }

    /* ---------------- tour stops (hotspots) ---------------- */
    var hots = [].slice.call(root.querySelectorAll('[data-hot]')), dots = cap ? [].slice.call(cap.querySelectorAll('[data-ixw-dot]')) : [];
    var STOPS = [{ key: '', say: cap ? cap.getAttribute('data-intro') : '', nx: home, pose: 'hello' }];
    hots.forEach(function (h) { var n = (h.getAttribute('data-nx') || home.join(',')).split(','); STOPS.push({ key: h.getAttribute('data-hot'), say: h.getAttribute('data-say'), nx: [+n[0], +n[1]], pose: h.getAttribute('data-pose') || 'point-right', el: h }); });
    if (cap && cap.getAttribute('data-outro')) STOPS.push({ key: '', say: cap.getAttribute('data-outro'), nx: home, pose: 'love' });
    var at = 0;
    function clearHot() { hots.forEach(function (h) { h.classList.remove('is-on'); h.setAttribute('aria-pressed', 'false'); }); }
    function go(i, user) {
      at = (i + STOPS.length) % STOPS.length; var s = STOPS[at];
      S.hot = s.key; S.hotA = 0;
      hots.forEach(function (h) { var on = h === s.el; h.classList.toggle('is-on', on); h.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      dots.forEach(function (d, j) { d.classList.toggle('is-on', j === at); });
      flyTo(s.nx[0], s.nx[1], s.pose); say(s.say || '', '', '', '', user); rec(s.el);
      W0.cast.forEach(function (c) { if (c.keys && c.keys.indexOf(s.key) >= 0) S.cast[c.id].until = now() + 1.6; });
      if (W0.onStop) W0.onStop(s.key, S, now());
      redraw();
    }
    tour = (function () {
      var auto = !reduce && !frame, vis = false, held = false, timer = 0, playBtn = cap && cap.querySelector('[data-ixw-play]');
      function sync() { if (playBtn) { var on = auto && !held; playBtn.setAttribute('aria-pressed', on ? 'true' : 'false'); playBtn.setAttribute('aria-label', on ? 'Pause the tour' : 'Play the tour'); playBtn.classList.toggle('is-on', on); } }
      function arm() { clearTimeout(timer); if (!auto || held || !vis) return; timer = setTimeout(function () { if (auto && !held && vis && !document.hidden) go(at + 1); arm(); }, at === 0 ? 5200 : 6400); }
      if (playBtn) playBtn.addEventListener('click', function () { if (auto && !held) { held = true; } else { auto = true; held = false; go(at + 1); } sync(); arm(); });
      sync();
      return { visible: function (on) { vis = on; if (on && !started) { started = true; setTimeout(function () { go(0); arm(); }, 500); } else arm(); }, stop: function () { auto = false; clearTimeout(timer); sync(); },
        play: function () { started = true; auto = !reduce; held = false; go(0, true); sync(); arm(); } };
    })();
    hots.forEach(function (h, j) { h.addEventListener('click', function () { tour.stop(); go(j + 1, true); }); });
    /* R9: the card's "Nexi Explains" pill (a play icon) plays THIS scene's episode: Nexi's tour starts again from her
       welcome, on autoplay, and the caption is brought into view. It used to leave the page for the series index, so
       the play button never played anything. A modified click (new tab / window) still opens the series page. */
    var epTag = root.querySelector('.ixw-copy a.ixw-ep-tag');
    if (epTag && cap && STOPS.length > 1) {
      epTag.setAttribute('aria-label', 'Play Nexi Explains: the tour of this scene');
      epTag.addEventListener('click', function (e) {
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button) return;
        e.preventDefault(); tour.play();
        epTag.classList.remove('is-play'); void epTag.offsetWidth; epTag.classList.add('is-play');
        var cr = cap.getBoundingClientRect();
        if (cr.bottom > window.innerHeight || cr.top < 0) cap.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
      });
    }
    var prev = cap && cap.querySelector('[data-ixw-prev]'), next = cap && cap.querySelector('[data-ixw-next]');
    if (prev) prev.addEventListener('click', function () { tour.stop(); go(at - 1, true); });
    if (next) next.addEventListener('click', function () { tour.stop(); go(at + 1, true); });
    dots.forEach(function (d, j) { d.addEventListener('click', function () { tour.stop(); go(j, true); }); });

    /* tap Nexi, a staff member or a toy: a reaction and a line of their own */
    var nb = nexi && nexi.querySelector('button'), reacts = nexi ? (nexi.getAttribute('data-reacts') || '').split('|') : [], ri = 0;
    if (nb) nb.addEventListener('click', function () {
      tour.stop(); var r = reacts[ri++ % reacts.length].split('::'), p = r[0] || 'wow';
      pose(p); say(r[1] || '', '', '', '', true); rec(null);
      nexi.classList.remove('is-boing'); void nexi.offsetWidth; nexi.classList.add('is-boing');
      setTimeout(function () { pose('hello'); }, 1800);
    });
    [].forEach.call(root.querySelectorAll('[data-cast]'), function (b) {
      b.addEventListener('click', function () {
        tour.stop(); var who = b.getAttribute('data-cast'), st = S.cast[who], t = now(), near = (b.getAttribute('data-near') || '').split(',');
        if (!st) return; st.wave = t + 1.6; st.until = t + 2.2; S.hot = ''; clearHot();
        say(b.getAttribute('data-say') || '', b.getAttribute('data-who'), b.getAttribute('data-role'), who, true); rec(null);
        if (near.length === 2) flyTo(+near[0], +near[1], 'clap');
        redraw();
      });
    });
    [].forEach.call(root.querySelectorAll('[data-toy]'), function (b) {
      b.addEventListener('click', function () {
        tour.stop(); var name = b.getAttribute('data-toy'), near = (b.getAttribute('data-near') || '').split(',');
        S.toy[name] = now(); S.hot = ''; clearHot();
        if (W0.toy) W0.toy(name, S, now(), b);
        say(b.getAttribute('data-say') || '', '', '', '', true); rec(null);
        if (near.length === 2) flyTo(+near[0], +near[1], b.getAttribute('data-pose') || 'wow');
        b.classList.remove('is-pop'); void b.offsetWidth; b.classList.add('is-pop');
        redraw();
      });
    });
    /* pointing at a hotspot or a toy glows it (S.peek); at a staff member, they smile and hop. A touch tap skips the hover
       (the tap itself plays the stop); keyboard focus counts as pointing. */
    function pointed(el, on, off) {
      el.addEventListener('pointerenter', function (e) { if (e.pointerType !== 'touch') on(); });
      el.addEventListener('pointerleave', off);
      el.addEventListener('focus', function () { if (!el.matches || el.matches(':focus-visible')) on(); });
      el.addEventListener('blur', off);
    }
    [].forEach.call(root.querySelectorAll('[data-hot], [data-toy]'), function (el) {
      var key = el.getAttribute('data-hot') || el.getAttribute('data-toy');
      pointed(el, function () { S.peek = key; redraw(); }, function () { if (S.peek === key) S.peek = ''; redraw(); });
    });
    [].forEach.call(root.querySelectorAll('[data-cast]'), function (el) {
      var st = S.cast[el.getAttribute('data-cast')]; if (!st) return;
      pointed(el, function () { if (!st.hover) st.hopAt = now(); st.hover = true; redraw(); }, function () { st.hover = false; redraw(); });
    });
    /* a world can make moving things in its canvas tappable (the travel paper plane): hit(x, y, S, t, onBtn) in set units.
       Capture phase: a moving thing in front of a person or a hotspot wins the click (hit() gets onBtn = true then). */
    if (W0.hit && !frame) root.addEventListener('click', function (e) { /* the whole hero, so things in the margins can be tapped too */
      if (!e.target.closest || e.target.closest('.ixw-cap, .ixw-copy, .ixw-peek, a')) return;
      var onBtn = !!e.target.closest('button');
      var r = set.getBoundingClientRect(), res = W0.hit((e.clientX - r.left - par.x * 6) / k, (e.clientY - r.top - par.y * 3) / k, S, now(), onBtn);
      if (!res) return;
      if (onBtn) e.stopPropagation();
      tour.stop(); S.hot = ''; clearHot(); say(res.say || '', res.who || '', res.role || '', '', true); rec(null);
      if (res.near) flyTo(res.near[0], res.near[1], res.pose || 'wow');
      redraw();
    }, true);
    if (reduce) go(0);
  }

  /* ============================== the workflow: stations on a route ============================== */
  function flow(root) {
    var tabs = [].slice.call(root.querySelectorAll('[role="tab"]')), panels = [].slice.call(root.querySelectorAll('[role="tabpanel"]'));
    var scenes = [].slice.call(root.querySelectorAll('[data-scene]')), rider = root.querySelector('[data-ixw-rider]');
    var playBtn = root.querySelector('[data-ixw-fplay]'), prev = root.querySelector('[data-ixw-fprev]'), next = root.querySelector('[data-ixw-fnext]');
    if (!tabs.length || tabs.length !== panels.length) return;
    root.classList.add('is-js');
    var at = 0, auto = !reduce && !CALM, vis = false, held = false, timer = 0, resume = 0, typed = {};
    var track = root.querySelector('.ixw-track'), stopsBox = root.querySelector('.ixw-stops') || track;
    function typeIn(p) {
      var el = p.querySelector('[data-ixw-ftype]'); if (!el || reduce || CALM) return;
      var full = el.getAttribute('data-full') || el.textContent; el.setAttribute('data-full', full);
      var n = 0; clearInterval(typed.t); el.textContent = ''; p.classList.add('is-typing');
      typed.t = setInterval(function () { n += 2; el.textContent = full.slice(0, n); if (n >= full.length) { clearInterval(typed.t); p.classList.remove('is-typing'); } }, 24);
    }
    function replay(s) { if (!s || reduce) return; s.classList.remove('is-on'); void s.offsetWidth; s.classList.add('is-on'); }
    function show(i, focus) {
      at = (i + tabs.length) % tabs.length;
      tabs.forEach(function (t, k2) { var on = k2 === at; t.classList.toggle('is-on', on); t.classList.toggle('is-done', k2 < at); t.setAttribute('aria-selected', on ? 'true' : 'false'); t.tabIndex = on ? 0 : -1; panels[k2].classList.toggle('is-on', on); });
      scenes.forEach(function (s, k2) { s.classList.toggle('is-on', k2 === at); });
      root.style.setProperty('--at', at); root.style.setProperty('--p', String(at / (tabs.length - 1)));
      if (rider) { rider.classList.remove('is-hop'); void rider.offsetWidth; rider.classList.add('is-hop'); }
      typeIn(panels[at]);
      if (track && track.scrollWidth > track.clientWidth + 2) {
        var t0 = tabs[at], x = t0.offsetLeft + t0.offsetWidth / 2 - track.clientWidth / 2 + (stopsBox && stopsBox !== track ? stopsBox.offsetLeft : 0);
        if (track.scrollTo) track.scrollTo({ left: Math.max(0, x), behavior: reduce ? 'auto' : 'smooth' }); else track.scrollLeft = x;
      }
      if (focus) tabs[at].focus({ preventScroll: true });
    }
    function sync() { if (playBtn) { var on = auto && !held; playBtn.setAttribute('aria-pressed', on ? 'true' : 'false'); playBtn.setAttribute('aria-label', on ? 'Pause the walkthrough' : 'Play the walkthrough'); playBtn.classList.toggle('is-on', on); } }
    function arm() { clearTimeout(timer); if (!auto || held || !vis) return; timer = setTimeout(function () { if (auto && !held && vis && !document.hidden) show(at + 1); arm(); }, 6200); }
    function stop() { auto = false; clearTimeout(timer); clearTimeout(resume); if (!reduce && !held && !CALM) resume = setTimeout(function () { auto = true; sync(); arm(); }, 12000); sync(); }
    tabs.forEach(function (t, k2) {
      t.addEventListener('click', function () { stop(); show(k2); });
      t.addEventListener('keydown', function (e) {
        var n = null; if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = at + 1; else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = at - 1; else if (e.key === 'Home') n = 0; else if (e.key === 'End') n = tabs.length - 1;
        if (n === null) return; e.preventDefault(); stop(); show(n, true);
      });
    });
    if (prev) prev.addEventListener('click', function () { stop(); show(at - 1); });
    if (next) next.addEventListener('click', function () { stop(); show(at + 1); });
    if (playBtn) playBtn.addEventListener('click', function () { clearTimeout(resume); if (auto && !held) held = true; else { auto = true; held = false; show(at + 1); } sync(); arm(); });
    if (fine) { root.addEventListener('mouseenter', function () { clearTimeout(timer); }); root.addEventListener('mouseleave', arm); }
    /* the sample picker: every [data-v="field"] text, [data-vbar="field"] bar (--v) and [data-vshow="sample"] block follows the pick */
    var pick = root.querySelector('[data-ixw-pick]'), data = null;
    if (pick) {
      try { data = JSON.parse(pick.getAttribute('data-samples') || 'null'); } catch (e) { data = null; }
      var pbtns = [].slice.call(pick.querySelectorAll('button[data-sample]'));
      pbtns.forEach(function (b) {
        b.addEventListener('click', function () {
          var key = b.getAttribute('data-sample'), d = data && data[key]; if (!d) return;
          stop();
          pbtns.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
          root.setAttribute('data-sample', key);
          [].forEach.call(root.querySelectorAll('[data-v]'), function (el) { var v = d[el.getAttribute('data-v')]; if (v != null) el.textContent = v; });
          [].forEach.call(root.querySelectorAll('[data-vbar]'), function (el) { var v = d[el.getAttribute('data-vbar')]; if (v != null) el.style.setProperty('--v', v); });
          root.classList.remove('is-swap'); void root.offsetWidth; root.classList.add('is-swap');
          replay(scenes[at]);
        });
      });
    }
    sync(); show(0);
    onScreen(track || root, function (on) { vis = on; root.classList.toggle('is-offscreen', !on); if (on) { if (!root.dataset.seen) { root.dataset.seen = '1'; show(0); } arm(); } else clearTimeout(timer); }, 0.5);
  }

  /* ============================== small things ============================== */
  function ctaBurst(btn) {
    if (reduce || CALM) return;
    var host = btn.closest('[data-ixw-burst]'); if (!host) return;
    var r = btn.getBoundingClientRect(), hr = host.getBoundingClientRect();
    for (var i = 0; i < 14; i++) {
      var s = document.createElement('i'); s.className = 'ixw-conf'; s.setAttribute('aria-hidden', 'true');
      var a = -Math.PI / 2 + (Math.random() - 0.5) * 2.4, d = 60 + Math.random() * 70;
      s.style.cssText = 'left:' + (r.left - hr.left + r.width / 2) + 'px;top:' + (r.top - hr.top + r.height / 2) + 'px;--dx:' + (Math.cos(a) * d).toFixed(0) + 'px;--dy:' + (Math.sin(a) * d).toFixed(0) + 'px;--r:' + Math.round(Math.random() * 360) + 'deg;--c:' + ['#FFD84A', '#7CD6C4', '#FF8FA3', '#FFFFFF', '#6FA0F5'][i % 5];
      host.appendChild(s); setTimeout(function (el) { el.remove(); }.bind(null, s), 900);
    }
  }
  /* things that animate in once, the first time they scroll into view ([data-ixw-in] gets .is-in) */
  function inOnce() {
    [].forEach.call(document.querySelectorAll('[data-ixw-in]'), function (el) {
      if (reduce || !('IntersectionObserver' in window)) { el.classList.add('is-in'); return; }
      var io = new IntersectionObserver(function (es) { if (es[es.length - 1].isIntersecting) { el.classList.add('is-in'); io.disconnect(); } }, { threshold: 0.25 });
      io.observe(el);
    });
  }

  function init() {
    [].forEach.call(document.querySelectorAll('[data-ixw-hero]'), hero);
    [].forEach.call(document.querySelectorAll('[data-ixw-flow]'), flow);
    [].forEach.call(document.querySelectorAll('[data-ixw-burst]'), function (el) { onScreen(el, function (on) { el.classList.toggle('is-off', !on); }); });
    inOnce();
    document.addEventListener('pointerenter', function (e) { var b = e.target; if (b && b.matches && b.matches('[data-ixw-burst] .btn-white')) ctaBurst(b); }, true);
  }
  /* the world files register after this engine (all scripts are deferred): start once the document has been parsed */
  if (document.readyState === 'complete') init(); else document.addEventListener('DOMContentLoaded', init);
})();

/* ---------------- the entry intro (html.ixw-intro is set by the head gate; the markup is worlds.intro_html) ----------------
   3 s in all: the badge pops (0.1 s), the ripples and sparks burst, Nexi peeks out (0.45 s), the title lands (0.6 s), three
   workflow steps burst out (0.9 s), then at END_AT an iris opens from the badge onto the hero. A tap, Skip or Esc ends it
   early. The beats are CSS keyframes keyed on .is-on, so they start with the timer that ends them. */
(function () {
  'use strict';
  var el = document.getElementById('ixw-intro'), de = document.documentElement;
  if (!el) return;
  if (!de.classList.contains('ixw-intro')) { el.parentNode.removeChild(el); return; }
  if (/[?&]intro=1(&|$)/.test(location.search) && history.replaceState) {
    history.replaceState(null, '', location.pathname + location.search.replace(/([?&])intro=1(&|$)/, function (m, a, b) { return b === '&' ? a : ''; }) + location.hash);
  }
  var END_AT = 2450, IRIS_MS = 550, done = false, timer = 0;
  var mark = el.querySelector('.ixwi-badge'), lock = el.querySelector('.ixwi-lock'), ring = el.querySelector('.ixwi-ring');
  document.body.style.overflow = 'hidden';
  function hole(x, y, r, W, H) {
    var p = ['0 0', W + 'px 0', W + 'px ' + H + 'px', '0 ' + H + 'px', '0 0'];
    for (var i = 0; i <= 48; i++) p.push((x + r * Math.cos(i / 24 * Math.PI)).toFixed(1) + 'px ' + (y + r * Math.sin(i / 24 * Math.PI)).toFixed(1) + 'px');
    return 'polygon(evenodd,' + p.join(',') + ',0 0)';
  }
  function finish() {
    if (done) return; done = true; clearTimeout(timer);
    /* the iris works in the intro's own box (the whole window; the site header is hidden until the intro opens) */
    var b = mark.getBoundingClientRect(), box = el.getBoundingClientRect(), W = box.width, H = box.height, x = b.left + b.width / 2 - box.left, y = b.top + b.height / 2 - box.top;
    var R = Math.ceil(Math.sqrt(Math.pow(Math.max(x, W - x), 2) + Math.pow(Math.max(y, H - y), 2))) + 4;
    lock.style.transformOrigin = '50% ' + (b.top + b.height / 2 - lock.getBoundingClientRect().top).toFixed(1) + 'px';
    el.classList.add('is-out');
    if (el.animate) {
      var o = { duration: IRIS_MS, easing: 'cubic-bezier(.6,0,.2,1)', fill: 'forwards' };
      el.animate([{ clipPath: hole(x, y, 0, W, H) }, { clipPath: hole(x, y, R, W, H) }], o);
      ring.style.cssText = 'left:' + (x - R) + 'px;top:' + (y - R) + 'px;width:' + 2 * R + 'px;height:' + 2 * R + 'px';
      ring.animate([{ opacity: 1, transform: 'scale(0)' }, { opacity: 0.9, offset: 0.6 }, { opacity: 0, transform: 'scale(1)' }], o);
    }
    de.classList.remove('ixw-intro'); document.body.style.overflow = '';
    document.removeEventListener('keydown', onKey);
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, IRIS_MS + 60);
  }
  function onKey(e) { if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') finish(); }
  el.addEventListener('click', finish);
  document.addEventListener('keydown', onKey);
  var started = false;
  function start() { if (started) return; started = true; el.classList.add('is-on'); timer = setTimeout(finish, END_AT); }
  requestAnimationFrame(start); setTimeout(start, 120);
})();

/* The glance strip hangs below the hero. Under it the page used to show a white band before a tinted section began, so the
   next section is pulled up behind the strip (its own background fills the gap; a transparent top border keeps its content
   where it was). */
(function () {
  var wraps = document.querySelectorAll('.ixw-credits-wrap');
  if (!wraps.length) return;
  function fit(w) {
    var hero = w.previousElementSibling, next = w.nextElementSibling;
    if (!hero || !next) return;
    w.style.marginBottom = ''; next.style.borderTop = '';
    var cs = getComputedStyle(next);
    if (cs.backgroundColor === 'rgba(0, 0, 0, 0)' && cs.backgroundImage === 'none') return;
    var ov = Math.round(w.getBoundingClientRect().bottom - hero.getBoundingClientRect().bottom);
    if (ov <= 0) return;
    w.style.marginBottom = -ov + 'px';
    next.style.borderTop = ov + 'px solid transparent';
  }
  function all() { for (var i = 0; i < wraps.length; i++) fit(wraps[i]); }
  all();
  if (window.ResizeObserver) { var ro = new ResizeObserver(function () { requestAnimationFrame(all); }); for (var i = 0; i < wraps.length; i++) { ro.observe(wraps[i]); if (wraps[i].previousElementSibling) ro.observe(wraps[i].previousElementSibling); } }
  else window.addEventListener('resize', all);
})();
