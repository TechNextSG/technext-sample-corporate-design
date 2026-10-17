/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* /nexi-explains hero: the Season 1 and Quick Tips sidekicks act out a short scene around Nexi's TV.
   The drawings are the episodes' own, from TechNext's Nexi video renderer (films/*.js): the IoT penguin with its
   paper fan, the App Development cat, the Networks duck and EP00's helper bots and spreadsheet monster (those
   episodes are still the current versions), plus three sidekicks of the remade Season 1: Olive the owl (EP13),
   Sprocket the otter (EP14) and Bramble the hedgehog (EP17), which replaced the old owl, hamster and goat. They are
   copied unchanged (only window.T became the local clock T). Holiday-special characters are not used.
   The scene (22 s, looping): cat and Olive sit on the TV; the penguin waddles in fanning; Sprocket zooms past
   (ZOOM!) and takes a break with his pebble; Bramble trots in and hops (BOING!); the duck lands on Nexi's head and quacks,
   the cat waves, Olive hoots; two helper bots float over the TV; the spreadsheet monster peeks up (EEK!), says
   hi and sinks away; everyone heads off and it starts again. Tapping Nexi makes the whole cast hop.
   On the home hero's Nexi Explains slide (index.html slide 6, [data-nxs]) a shorter "perch" scene plays on the
   TV only: cat and Olive on top, helper bots over it, the duck flies in, lands between them and quacks; it runs
   only while that slide is showing.
   One canvas around the stage, pointer-events none. It runs only while the hero is on screen and the tab is
   visible; reduced motion draws one still frame. */
(function () {
  'use strict';
  if (!document.querySelector('[data-nxe-stage],[data-nxs],canvas[data-nxe-portrait]')) return;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var T = 0;

  /* the renderer's colours and state objects these drawings read, and the two engine helpers they call */
  var INK2 = '#0B1534', YEL = '#FFD84A', ORANGE = '#F28C28';
  var MG = '#3FBF7F', MGS = '#258F5C', MGL = 'rgba(6,58,34,.36)', BEL = '#F2FBEA', BELS = '#C9E9BC';
  var DUCK = { bob: -9 }, GOAT = { hop: -9 }, LK = { hoot: -9 };
  var KJ = { rise: 0, roar: 0, hit: 0, chomp: 0, kb: 0, up: 0, dizzy: 0, flinch: 0, look: -1 };
  function lerp(a, b, k) { return a + (b - a) * k; }
  function clampV(v, a, b) { return v < a ? a : v > b ? b : v; }
  var L = { rrect: function (g, x, y, w, h, r) { g.beginPath(); if (g.roundRect) g.roundRect(x, y, w, h, r); else g.rect(x, y, w, h); } };
  var KIT = { chip: function (g, text, x, y, fg, bg, size) {
    g.save(); g.font = '800 ' + size + 'px "Plus Jakarta Sans", Inter, sans-serif';
    var w = g.measureText(text).width + size * 1.1, h = size * 1.7;
    L.rrect(g, x - w / 2, y - h / 2, w, h, h / 2); g.fillStyle = bg; g.fill(); g.lineWidth = 3; g.strokeStyle = '#101C45'; g.stroke();
    g.fillStyle = fg; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, x, y + 1); g.restore();
  } };

  /* ================= the drawings, unchanged from the episodes ================= */
  /* from films/iot.js */
  function penguin(gg, x, y, s) {
    var t = T; gg.save(); gg.translate(x, y); gg.scale(s, s);
    gg.fillStyle = '#F5A524'; gg.beginPath(); gg.ellipse(-16, 60, 15, 6, 0, 0, 7); gg.fill(); gg.beginPath(); gg.ellipse(16, 60, 15, 6, 0, 0, 7); gg.fill();
    gg.fillStyle = '#1F2A44'; gg.beginPath(); gg.ellipse(0, 4, 46, 60, 0, 0, 7); gg.fill();
    gg.fillStyle = '#fff'; gg.beginPath(); gg.ellipse(0, 14, 31, 44, 0, 0, 7); gg.fill();
    gg.fillStyle = '#1F2A44'; [-13, 13].forEach(function (ex) { gg.beginPath(); gg.arc(ex, -26, 6, 0, 7); gg.fill(); }); gg.fillStyle = '#fff'; [-11, 15].forEach(function (ex) { gg.beginPath(); gg.arc(ex, -28, 2, 0, 7); gg.fill(); });
    gg.fillStyle = '#F5A524'; gg.beginPath(); gg.moveTo(-9, -16); gg.lineTo(9, -16); gg.lineTo(0, -5); gg.closePath(); gg.fill();
    gg.fillStyle = 'rgba(255,120,140,.5)'; [-24, 24].forEach(function (ex) { gg.beginPath(); gg.ellipse(ex, -12, 7, 4, 0, 0, 7); gg.fill(); });
    /* flipper fanning a paper fan */
    gg.save(); gg.translate(40, -4); gg.rotate(-0.6 + Math.sin(t * 14) * 0.35); gg.fillStyle = '#1F2A44'; gg.beginPath(); gg.ellipse(0, 10, 10, 26, 0, 0, 7); gg.fill();
    gg.translate(0, -18); for (var k = 0; k < 5; k++) { gg.save(); gg.rotate(-0.7 + k * 0.35); gg.fillStyle = k % 2 ? '#FF8FB1' : '#FFC2D4'; gg.beginPath(); gg.moveTo(0, 0); gg.lineTo(-9, -46); gg.lineTo(9, -46); gg.closePath(); gg.fill(); gg.restore(); } gg.restore();
    gg.fillStyle = '#7CC8FF'; gg.beginPath(); gg.moveTo(-40, -50); gg.quadraticCurveTo(-30, -36, -40, -30); gg.quadraticCurveTo(-50, -36, -40, -50); gg.fill();
    gg.restore();
  }
  /* from films/appdev.js */
  function cat(gg, x, y, wave) {
    var t = T; gg.save(); gg.translate(x, y);
    gg.strokeStyle = '#E8892B'; gg.lineWidth = 10; gg.lineCap = 'round'; gg.beginPath(); gg.moveTo(26, -10); gg.quadraticCurveTo(64, -18 + Math.sin(t * 4) * 10, 58, -58 + Math.sin(t * 4) * 12); gg.stroke();
    gg.fillStyle = '#F5A142'; gg.beginPath(); gg.ellipse(0, -30, 34, 30, 0, 0, 7); gg.fill(); gg.beginPath(); gg.arc(-6, -78, 26, 0, 7); gg.fill();
    gg.beginPath(); gg.moveTo(-28, -90); gg.lineTo(-24, -118); gg.lineTo(-10, -100); gg.closePath(); gg.fill(); gg.beginPath(); gg.moveTo(16, -90); gg.lineTo(12, -118); gg.lineTo(-2, -100); gg.closePath(); gg.fill();
    gg.fillStyle = '#1F1F3D'; gg.beginPath(); gg.arc(-15, -80, 3.5, 0, 7); gg.fill(); gg.beginPath(); gg.arc(4, -80, 3.5, 0, 7); gg.fill();
    gg.strokeStyle = '#1F1F3D'; gg.lineWidth = 2; gg.beginPath(); gg.moveTo(-10, -70); gg.quadraticCurveTo(-5, -66, 0, -70); gg.stroke();
    gg.save(); gg.translate(-28, -40); gg.rotate(-0.4 - (wave > 0.01 ? (0.9 + Math.sin(t * 14) * 0.4) * wave : 0)); gg.fillStyle = '#F5A142'; gg.beginPath(); gg.ellipse(0, -14, 9, 20, 0, 0, 7); gg.fill(); gg.restore();
    gg.restore();
  }
  /* from films/network.js */
  function duck(gg, x, y) { var t = T, bob = Math.sin(t * 2.2) * 3 - (t - DUCK.bob < 0.8 ? Math.sin((t - DUCK.bob) / 0.8 * Math.PI * 3) * 10 * (1 - (t - DUCK.bob) / 0.8) : 0); gg.save(); gg.translate(x, y + bob);
    gg.fillStyle = '#FFD25E'; gg.beginPath(); gg.ellipse(0, 0, 28, 17, 0, 0, 7); gg.fill(); gg.beginPath(); gg.arc(16, -20, 14, 0, 7); gg.fill(); gg.fillStyle = ORANGE; gg.beginPath(); gg.moveTo(28, -20); gg.lineTo(42, -16); gg.lineTo(28, -12); gg.closePath(); gg.fill(); gg.fillStyle = '#1F1F3D'; gg.beginPath(); gg.arc(19, -23, 2.6, 0, 7); gg.fill(); gg.fillStyle = '#F5B82E'; gg.beginPath(); gg.ellipse(-6, -2, 13, 8, -0.3, 0, 7); gg.fill(); gg.restore(); }
  /* ---- the remade Season 1 sidekicks, copied unchanged from the films (only window.T became T) ---- */
  /* from films/inc (shared set kit) */
  function envShadow(gg, x, y, rx, ry, a) { var g0 = gg.createRadialGradient(x, y, 0, x, y, rx); g0.addColorStop(0, 'rgba(20,30,60,' + (a == null ? 0.25 : a) + ')'); g0.addColorStop(1, 'rgba(20,30,60,0)'); gg.save(); gg.translate(x, y); gg.scale(1, ry / rx); gg.translate(-x, -y); gg.fillStyle = g0; gg.fillRect(x - rx, y - rx, rx * 2, rx * 2); gg.restore(); }
  /* from films/odooai.js (EP13): Olive the owl */
  var BL13 = '#3167CA';
  function rr13(p, x, y, w, h, r) { r = Math.min(r, w / 2, h / 2); p.moveTo(x + r, y); p.arcTo(x + w, y, x + w, y + h, r); p.arcTo(x + w, y + h, x, y + h, r); p.arcTo(x, y + h, x, y, r); p.arcTo(x, y, x + w, y, r); p.closePath(); return p; }
  function pR13(x, y, w, h, r) { var p = new Path2D(); if (r) rr13(p, x, y, w, h, r); else p.rect(x, y, w, h); return p; }
  function pE13(x, y, rx, ry) { var p = new Path2D(); p.ellipse(x, y, Math.max(0.1, rx), Math.max(0.1, ry), 0, 0, Math.PI * 2); return p; }
  function fs13(gg, p, f, s, lw) { if (f) { gg.fillStyle = f; gg.fill(p); } if (s) { gg.strokeStyle = s; gg.lineWidth = lw || 3; gg.stroke(p); } }
  var OWC = { b: '#C99A66', be: '#A97B4A', w: '#B98955', belly: '#F6E8D2', face: '#FFF5E6', tuft: '#B07D4B', eye: '#3A2B24', ring: '#FFD45E', beak: '#F29B38', bk: '#D47C1E', ft: '#F2A541', bow: '#714B67' };
  function owWing(gg, a) {   /* the screen-left wing: pivot at the origin, hanging down; a > 0 swings it OUT and up (away from the face) */
    gg.save(); gg.rotate(a); var w = new Path2D(); w.moveTo(-15, -4); w.quadraticCurveTo(-24, 40, -2, 78); w.quadraticCurveTo(20, 44, 14, -4); w.closePath(); fs13(gg, w, OWC.w, OWC.be, 3);
    var fe = new Path2D(); fe.moveTo(-7, 30); fe.quadraticCurveTo(0, 37, 7, 30); fe.moveTo(-6, 48); fe.quadraticCurveTo(0, 55, 6, 48); gg.strokeStyle = OWC.be; gg.lineWidth = 2.5; gg.stroke(fe); gg.restore();
  }
  function owl13(gg, x, y, s, o) {
    var t = T, fl = clampV(o.fly || 0, 0, 1), hop = o.hop || 0, flap = fl > 0.01 ? Math.sin(t * 16) : 0, bob = fl * Math.sin(t * 5) * 6;
    gg.save(); gg.translate(x, y); gg.scale(s, s);
    if (fl < 0.95) envShadow(gg, 0, 3, 50, 10, 0.22 * (1 - fl) * clampV(1 - hop / 160, 0.4, 1));
    gg.translate(0, -hop - fl * 26 + bob); gg.scale(o.dir || 1, 1); gg.lineJoin = 'round'; gg.lineCap = 'round';
    if (o.item === 1) { gg.save(); gg.translate(0, 12); gg.rotate(Math.sin(t * 4) * 0.08); fs13(gg, pR13(-36, -4, 72, 50, 6), '#FFFFFF', '#C9D4E3', 3); var fl2 = new Path2D(); fl2.moveTo(-36, -4); fl2.lineTo(0, 22); fl2.lineTo(36, -4); gg.strokeStyle = '#C9D4E3'; gg.lineWidth = 3; gg.stroke(fl2); fs13(gg, pR13(-28, 28, 26, 12, 3), '#E5484D'); gg.restore(); }
    if (fl < 0.6) { var ft = new Path2D(); [-15, 15].forEach(function (fx) { [-7, 0, 7].forEach(function (d) { ft.moveTo(fx + d + 4, -3); ft.ellipse(fx + d, -3, 4, 5, 0, 0, 7); }); }); gg.fillStyle = OWC.ft; gg.fill(ft); }
    var wa = clampV(o.wing || 0, 0, 1), bk = clampV(o.book || 0, 0, 1), mac = clampV(o.mac || 0, 0, 1);
    var aw = lerp(0.12, 2.25 + Math.sin(t * 10) * 0.15, wa); aw = lerp(aw, -0.42, Math.max(bk, mac)); aw = lerp(aw, 0.6 + flap * 1.3, fl);
    var bd = pE13(0, -62, 48, 58); fs13(gg, bd, OWC.b, OWC.be, 3);
    gg.save(); gg.clip(bd); gg.fillStyle = OWC.belly; gg.fill(pE13(0, -44, 32, 40)); var sp = new Path2D(); [[-12, -60], [10, -56], [-4, -42], [14, -32], [-14, -28], [2, -20]].forEach(function (q) { sp.moveTo(q[0] - 5, q[1]); sp.quadraticCurveTo(q[0], q[1] + 5, q[0] + 5, q[1]); }); gg.strokeStyle = '#E2C9A2'; gg.lineWidth = 2.5; gg.stroke(sp); gg.restore();
    if (bk > 0.5) { gg.save(); gg.translate(0, -50); gg.rotate(-0.08); fs13(gg, pR13(-30, -21, 60, 42, 4), BL13); fs13(gg, pR13(-25, -17, 50, 34, 3), '#FFFFFF'); gg.fillStyle = BL13; gg.fill(pR13(-2, -21, 4, 42, 0)); gg.restore(); }
    if (mac > 0.5) { gg.save(); gg.translate(0, -48); fs13(gg, pE13(0, -6, 24, 9), '#F7A8C8'); fs13(gg, pE13(0, 0, 24, 5), '#FFF1F6'); fs13(gg, pE13(0, 6, 24, 9), '#F7A8C8'); gg.restore(); }
    gg.save(); gg.translate(-44, -88); owWing(gg, aw); gg.restore(); gg.save(); gg.scale(-1, 1); gg.translate(-44, -88); owWing(gg, aw); gg.restore();
    gg.save(); gg.translate(0, -128); gg.rotate(o.tilt || 0);
    var tf = new Path2D(); tf.moveTo(-40, -20); tf.lineTo(-40, -58); tf.lineTo(-17, -36); tf.closePath(); tf.moveTo(40, -20); tf.lineTo(40, -58); tf.lineTo(17, -36); tf.closePath(); fs13(gg, tf, OWC.tuft, OWC.be, 3);
    fs13(gg, pE13(0, 0, 46, 42), OWC.b, OWC.be, 3);
    var fd = new Path2D(); fd.ellipse(-17, 0, 22, 25, 0, 0, 7); fd.moveTo(39, 0); fd.ellipse(17, 0, 22, 25, 0, 0, 7); gg.fillStyle = OWC.face; gg.fill(fd);
    var hap = (o.happy || 0) > 0.5, slp = (o.sleep || 0) > 0.5, wow = clampV(o.wow || 0, 0, 1), blink = (t + 0.7) % 3.4 < 0.12;
    [-17, 17].forEach(function (ex) {
      if (slp || (blink && !hap)) { var sl = new Path2D(); sl.moveTo(ex - 10, 1); sl.quadraticCurveTo(ex, 7, ex + 10, 1); gg.strokeStyle = OWC.eye; gg.lineWidth = 3.5; gg.stroke(sl); }
      else if (hap) { var ha = new Path2D(); ha.arc(ex, 6, 10, Math.PI * 1.15, Math.PI * 1.85); gg.strokeStyle = OWC.eye; gg.lineWidth = 3.5; gg.stroke(ha); }
      else { var er = 13 + wow * 3; gg.fillStyle = OWC.ring; gg.fill(pE13(ex, 0, er, er)); gg.fillStyle = OWC.eye; gg.fill(pE13(ex, 1, er * 0.66, er * 0.7)); gg.fillStyle = '#FFFFFF'; gg.fill(pE13(ex - 3, -4, er * 0.24, er * 0.24)); gg.fill(pE13(ex + 4, 4, er * 0.1, er * 0.1)); } });
    gg.fillStyle = 'rgba(255,130,150,.42)'; gg.fill(pE13(-31, 17, 7, 4)); gg.fill(pE13(31, 17, 7, 4));
    var open = (t - (o.hootT == null ? -9 : o.hootT)) < 0.6 || wow > 0.5 || mac > 0.5; var bkp = new Path2D(); bkp.moveTo(-7, 10); bkp.lineTo(7, 10); bkp.lineTo(0, open ? 18 : 24); bkp.closePath(); fs13(gg, bkp, OWC.beak, OWC.bk, 2);
    if (open) { var lb = new Path2D(); lb.moveTo(-5, 22); lb.lineTo(5, 22); lb.lineTo(0, 30); lb.closePath(); fs13(gg, lb, OWC.beak, OWC.bk, 2); }
    if (slp) { var z = new Path2D(), zt = (t * 0.8) % 1; [[0, 1], [1, 0.7]].forEach(function (q, i) { var zx = 50 + i * 22, zy = -56 - i * 26 - zt * 16, zs = 9 * q[1]; z.moveTo(zx - zs, zy - zs); z.lineTo(zx + zs, zy - zs); z.lineTo(zx - zs, zy + zs); z.lineTo(zx + zs, zy + zs); }); gg.strokeStyle = '#8FB4E8'; gg.lineWidth = 4; gg.stroke(z); }
    gg.restore();
    var bw = new Path2D(); bw.moveTo(0, -86); bw.lineTo(-16, -95); bw.lineTo(-16, -77); bw.closePath(); bw.moveTo(0, -86); bw.lineTo(16, -95); bw.lineTo(16, -77); bw.closePath(); gg.fillStyle = OWC.bow; gg.fill(bw); gg.fill(pE13(0, -86, 5, 5));
    gg.restore();
  }
  /* from films/automation.js (EP14): Sprocket the otter */
  var BLU14 = '#3167CA', GOLD14 = '#F5B82E';
  function rp14(x, y, w, h, r) { var p = new Path2D(); r = Math.max(0, Math.min(r, w / 2, h / 2)); p.moveTo(x + r, y); p.arcTo(x + w, y, x + w, y + h, r); p.arcTo(x + w, y + h, x, y + h, r); p.arcTo(x, y + h, x, y, r); p.arcTo(x, y, x + w, y, r); p.closePath(); return p; }
  function fs14(gg, p, f, s, lw) { gg.fillStyle = f; gg.fill(p); if (s) { gg.strokeStyle = s; gg.lineWidth = lw || 3; gg.stroke(p); } }
  function pebble14(gg, x, y, s) { var p = new Path2D(); p.ellipse(x, y, 16 * s, 11 * s, -0.2, 0, 7); gg.fillStyle = '#9AA3B5'; gg.fill(p); var h = new Path2D(); h.ellipse(x - 5 * s, y - 4 * s, 5 * s, 3 * s, -0.3, 0, 7); gg.fillStyle = 'rgba(255,255,255,.6)'; gg.fill(h); }
  function otter14(gg, x, y, s, o, dir) {
    var t = T, hop = o.hop || 0, ch = clampV(o.cheer || 0, 0, 1), wv = clampV(o.wave || 0, 0, 1), gp = clampV(o.gasp || 0, 0, 1), sd = clampV(o.sad || 0, 0, 1), pt = clampV(o.point || 0, 0, 1), cw = clampV(o.chew || 0, 0, 1);
    var BD = '#A06D4A', OL = '#83552F', BL = '#F4E2CB', DK = '#7E5434', NS = '#3E2A1E', EYE = '#2A1C14';
    gg.save(); gg.translate(x, y); gg.scale(s, s); envShadow(gg, 0, 2, 76 - hop * 0.2, 13, 0.24 * clampV(1 - hop / 160, 0.35, 1)); gg.scale(dir || 1, 1); gg.translate(0, -hop); gg.lineJoin = 'round'; gg.lineCap = 'round';
    var tl = new Path2D(); tl.moveTo(24, -34); tl.bezierCurveTo(66, -30, 98, -12 + Math.sin(t * 3) * 3, 122, -18); tl.bezierCurveTo(104, -2, 60, 4, 20, -8); tl.closePath(); fs14(gg, tl, DK, OL, 2.5);
    [-20, 20].forEach(function (fx) { var ft = new Path2D(); ft.ellipse(fx, -5, 19, 9, 0, 0, 7); gg.fillStyle = DK; gg.fill(ft); });
    function arm(side, hx, hy) { var a = new Path2D(); a.moveTo(side * 30, -126); a.lineTo(hx, hy); gg.strokeStyle = BD; gg.lineWidth = 15; gg.stroke(a); var pw = new Path2D(); pw.arc(hx, hy, 9, 0, 7); gg.fillStyle = DK; gg.fill(pw); }
    var held = (o.peb || 0) > 0.5 && ch < 0.3 && gp < 0.3 && wv < 0.3 && pt < 0.3, lh = [-14, -98], rh = [14, -98];
    if (ch > 0.3) { lh = [-66, -236 - Math.sin(t * 12) * 6]; rh = [66, -236 + Math.sin(t * 12) * 6]; }
    else if (gp > 0.3) { lh = [-66, -150]; rh = [66, -150]; }
    else { if (wv > 0.3) rh = [74, -214 + Math.sin(t * 10) * 12]; else if (pt > 0.3) rh = [92, -122]; if (!held && wv <= 0.3 && pt <= 0.3) { lh = [-30, -72]; rh = [30, -72]; } else if (!held) lh = [-30, -72]; }
    if (lh[1] < -120) arm(-1, lh[0], lh[1]); if (rh[1] < -120) arm(1, rh[0], rh[1]);
    var bd = new Path2D(); bd.moveTo(-46, -12); bd.bezierCurveTo(-58, -74, -48, -138, 0, -142); bd.bezierCurveTo(48, -138, 58, -74, 46, -12); bd.quadraticCurveTo(0, 6, -46, -12); bd.closePath(); fs14(gg, bd, BD, OL, 3);
    var bl = new Path2D(); bl.ellipse(0, -66, 30, 46, 0, 0, 7); gg.fillStyle = BL; gg.fill(bl);
    /* the tool belt with its buckle and the tiny wrench */
    var bt = new Path2D(); bt.moveTo(-50, -52); bt.quadraticCurveTo(0, -38, 50, -52); bt.lineTo(50, -38); bt.quadraticCurveTo(0, -24, -50, -38); bt.closePath(); gg.fillStyle = BLU14; gg.fill(bt); var bk = rp14(-11, -48, 22, 18, 4); gg.fillStyle = GOLD14; gg.fill(bk);
    var wr = new Path2D(); wr.rect(36, -40, 7, 34); wr.moveTo(48, -6); wr.arc(39.5, -6, 8.5, 0, 7); gg.fillStyle = '#9AA6BC'; gg.fill(wr);
    if (lh[1] >= -120) arm(-1, lh[0], lh[1]); if (rh[1] >= -120) arm(1, rh[0], rh[1]);
    if (held) pebble14(gg, 0, -94, 1);
    gg.save(); gg.translate(0, -150); gg.rotate((o.tilt || 0) + Math.sin(t * 1.4) * 0.03); gg.translate(0, 150);
    [-1, 1].forEach(function (sg) { var er = new Path2D(); er.arc(sg * 38, -210, 13, 0, 7); fs14(gg, er, BD, OL, 2.5); var ie = new Path2D(); ie.arc(sg * 38, -210, 6, 0, 7); gg.fillStyle = '#E8A98C'; gg.fill(ie); });
    var hd = new Path2D(); hd.ellipse(0, -176, 50, 44, 0, 0, 7); fs14(gg, hd, BD, OL, 3);
    var mz = new Path2D(); mz.ellipse(0, -160, 32, 21, 0, 0, 7); gg.fillStyle = BL; gg.fill(mz);
    var blink = (t % 3.7) < 0.12, happy = (o.happy || 0) > 0.5 || ch > 0.5, er2 = gp > 0.5 ? 10 : 8;
    [[-19, -186], [19, -186]].forEach(function (ep) { if (happy || blink) { var ar = new Path2D(); if (happy) ar.arc(ep[0], ep[1] + 4, 8, Math.PI * 1.15, Math.PI * 1.85); else { ar.moveTo(ep[0] - 7, ep[1]); ar.lineTo(ep[0] + 7, ep[1]); } gg.strokeStyle = EYE; gg.lineWidth = 3.5; gg.stroke(ar); }
      else { var ey = new Path2D(); ey.arc(ep[0], ep[1], er2, 0, 7); gg.fillStyle = EYE; gg.fill(ey); var h1 = new Path2D(); h1.arc(ep[0] - 2.5, ep[1] - 3, er2 * 0.38, 0, 7); h1.moveTo(ep[0] + 4.4, ep[1] + 2.6); h1.arc(ep[0] + 3, ep[1] + 2.6, er2 * 0.17, 0, 7); gg.fillStyle = '#FFFFFF'; gg.fill(h1); } });
    if (sd > 0.3) { var br = new Path2D(); br.moveTo(-28, -204); br.lineTo(-12, -199); br.moveTo(28, -204); br.lineTo(12, -199); gg.strokeStyle = EYE; gg.lineWidth = 3; gg.stroke(br); }
    var ns = new Path2D(); ns.ellipse(0, -170, 9, 6.5, 0, 0, 7); gg.fillStyle = NS; gg.fill(ns);
    var wk = new Path2D(); [-1, 1].forEach(function (sg) { wk.moveTo(sg * 24, -162); wk.lineTo(sg * 54, -168); wk.moveTo(sg * 24, -157); wk.lineTo(sg * 54, -155); }); gg.strokeStyle = 'rgba(131,85,47,.7)'; gg.lineWidth = 2; gg.stroke(wk);
    var mo2;
    if (gp > 0.5 || (cw > 0.3 && Math.sin(t * 22) > 0)) { mo2 = new Path2D(); mo2.ellipse(0, -150, gp > 0.5 ? 7 : 5, gp > 0.5 ? 8.5 : 4.5, 0, 0, 7); gg.fillStyle = '#7A3A2A'; gg.fill(mo2); }
    else if (sd > 0.3) { mo2 = new Path2D(); mo2.moveTo(-7, -148); mo2.quadraticCurveTo(0, -154, 7, -148); gg.strokeStyle = EYE; gg.lineWidth = 2.5; gg.stroke(mo2); }
    else { mo2 = new Path2D(); mo2.moveTo(-8, -156); mo2.quadraticCurveTo(-4, -150, 0, -156); mo2.quadraticCurveTo(4, -150, 8, -156); gg.strokeStyle = EYE; gg.lineWidth = 2.5; gg.stroke(mo2); }
    var bh = new Path2D(); bh.ellipse(-34, -162, 8, 5, 0, 0, 7); bh.moveTo(42, -162); bh.ellipse(34, -162, 8, 5, 0, 0, 7); gg.fillStyle = 'rgba(255,120,150,.45)'; gg.fill(bh);
    gg.restore();
    gg.restore();
  }
  /* from films/social.js (EP17): Bramble the hedgehog */
  function fs7(gg, p, f, s, lw) { gg.fillStyle = f; gg.fill(p); if (s) { gg.strokeStyle = s; gg.lineWidth = lw || 4; gg.stroke(p); } }
  function brItem() {}
  function hedgehog(gg, x, y, s, st, dir) {
    var t = T, hop = st.hop || 0, happy = st.happy > 0.5, sad = clampV(st.sad || 0, 0, 1), sl = clampV(st.sleepy || 0, 0, 1), wave = clampV(st.wave || 0, 0, 1);
    var SP = '#9A7457', SPD = '#7A5A42', SPI = '#AD8A6C', FC = '#F7E3C6', FCD = '#E4C6A0', IK = '#3A2A22';
    gg.save(); gg.translate(x, y); gg.scale(s, s); envShadow(gg, 0, 2, 74 - hop * 0.2, 12, 0.24 * clampV(1 - hop / 160, 0.35, 1));
    gg.translate(0, -hop); gg.scale(dir || 1, 1); gg.lineJoin = 'round'; gg.lineCap = 'round';
    var br = Math.sin(t * 2.4) * 0.015 * (1 + sl) - sad * 0.04; gg.scale(1 + br, 1 - br);
    var ft = new Path2D(); ft.ellipse(-38, -6, 17, 8, 0, 0, 7); ft.moveTo(42, -6); ft.ellipse(26, -6, 16, 8, 0, 0, 7); gg.fillStyle = FCD; gg.fill(ft);
    /* the spines sit behind the face: a zigzag over the back and the top only */
    var sp = new Path2D(), cx = -16, cy = -58, n = 12, a0 = Math.PI * 0.8, a1 = Math.PI * 1.86;
    for (var i = 0; i <= n * 2; i++) { var a = a0 + (a1 - a0) * i / (n * 2), R = i % 2 ? 1.3 : 1.0, px = cx + Math.cos(a) * 70 * R, py = cy + Math.sin(a) * 56 * R; if (!i) sp.moveTo(px, py); else sp.lineTo(px, py); }
    sp.lineTo(34, -16); sp.lineTo(-70, -12); sp.closePath(); fs7(gg, sp, SP, SPD, 3);
    var ib = new Path2D(); ib.ellipse(cx - 4, cy + 10, 56, 40, 0, 0, 7); gg.fillStyle = SPI; gg.fill(ib);
    var tx = new Path2D(); for (var j = 0; j < 9; j++) { var aa = a0 + 0.2 + j * 0.11, r0 = 34, r1 = 52; tx.moveTo(cx + Math.cos(aa) * r0, cy + Math.sin(aa) * r0 * 0.8); tx.lineTo(cx + Math.cos(aa) * r1, cy + Math.sin(aa) * r1 * 0.8); } gg.strokeStyle = SPD; gg.lineWidth = 3; gg.stroke(tx);
    if (wave > 0.02) { var wa = -1.75 + Math.sin(t * 12) * 0.25 * wave, ex = -2 + Math.cos(wa) * 86 * wave, ey = -40 + Math.sin(wa) * 86 * wave, ar = new Path2D(); ar.moveTo(-2, -40); ar.lineTo(ex, ey); gg.strokeStyle = FCD; gg.lineWidth = 15; gg.stroke(ar); var hd = new Path2D(); hd.arc(ex, ey, 11, 0, 7); gg.fillStyle = FC; gg.fill(hd);
      if (st.item && st.itemK > 0.01) brItem(gg, st.item, ex, ey, st.itemK); }
    var er = new Path2D(); er.ellipse(24, -96, 13, 11, -0.2, 0, 7); gg.fillStyle = FCD; gg.fill(er); var ei = new Path2D(); ei.ellipse(24, -96, 6, 5, -0.2, 0, 7); gg.fillStyle = '#F4A9B6'; gg.fill(ei);
    var fc = new Path2D(); fc.ellipse(34, -50, 44, 40, 0, 0, 7); fc.moveTo(98, -46); fc.ellipse(72, -46, 26, 18, 0, 0, 7); fs7(gg, fc, FC, FCD, 2.5);
    var ns = new Path2D(); ns.arc(97, -48, 8.5, 0, 7); gg.fillStyle = IK; gg.fill(ns); var nh = new Path2D(); nh.arc(94.5, -50.5, 2.6, 0, 7); gg.fillStyle = 'rgba(255,255,255,.75)'; gg.fill(nh);
    var eyes = [[40, -64], [64, -62]], eR = st.big ? 10 : 8.5;
    eyes.forEach(function (ep) { if (sl > 0.5) { var ln = new Path2D(); ln.arc(ep[0], ep[1] - 3, 7, 0.15 * Math.PI, 0.85 * Math.PI); gg.strokeStyle = IK; gg.lineWidth = 3.5; gg.stroke(ln); }
      else if (happy) { var hp = new Path2D(); hp.arc(ep[0], ep[1] + 4, 8, Math.PI * 1.15, Math.PI * 1.85); gg.strokeStyle = IK; gg.lineWidth = 4; gg.stroke(hp); }
      else { var ey2 = new Path2D(); ey2.ellipse(ep[0], ep[1], eR * 0.9, eR, 0, 0, 7); gg.fillStyle = '#2B1E17'; gg.fill(ey2); var h1 = new Path2D(); h1.arc(ep[0] - eR * 0.3, ep[1] - eR * 0.35, eR * 0.38, 0, 7); h1.moveTo(ep[0] + eR * 0.55, ep[1] + eR * 0.3); h1.arc(ep[0] + eR * 0.38, ep[1] + eR * 0.3, eR * 0.16, 0, 7); gg.fillStyle = '#FFFFFF'; gg.fill(h1); } });
    if (sad > 0.3) { var bw = new Path2D(); bw.moveTo(32, -80); bw.lineTo(46, -84); bw.moveTo(58, -84); bw.lineTo(72, -80); gg.strokeStyle = IK; gg.lineWidth = 3; gg.stroke(bw); }
    var bl = new Path2D(); bl.ellipse(36, -42, 10, 6, 0, 0, 7); gg.fillStyle = 'rgba(255,120,150,.45)'; gg.fill(bl);
    var mo = new Path2D(); if (sad > 0.5) { mo.moveTo(76, -30); mo.quadraticCurveTo(82, -36, 88, -30); } else { mo.moveTo(76, -34); mo.quadraticCurveTo(82, -27, 88, -33); } gg.strokeStyle = IK; gg.lineWidth = 2.8; gg.stroke(mo);
    var pw = new Path2D(); pw.ellipse(48, -12, 12, 9, 0, 0, 7); gg.fillStyle = FCD; gg.fill(pw);
    if (sl > 0.5) { var zz = new Path2D(), zb = Math.sin(t * 2) * 6; [[110, -110, 14], [134, -138, 10]].forEach(function (z) { zz.moveTo(z[0] - z[2], z[1] - z[2] + zb); zz.lineTo(z[0] + z[2], z[1] - z[2] + zb); zz.lineTo(z[0] - z[2], z[1] + z[2] + zb); zz.lineTo(z[0] + z[2], z[1] + z[2] + zb); }); gg.strokeStyle = '#6F8BC9'; gg.lineWidth = 4; gg.stroke(zz); }
    gg.restore();
  }
  /* the scene's slots for the remade cast: Olive takes the owl's TV corner (hoots: beak open, a wing up, "Hoo!"),
     Sprocket the otter takes the hamster's zoom-in and break (his pebble instead of the coffee), Bramble the hedgehog
     takes the goat's trot-in and BOING hop. Feet sit at the origin. */
  function olive(gg, x, y, s) {
    var h = T - LK.hoot;
    owl13(gg, x, y, s, { hootT: LK.hoot, wing: h >= 0 && h < 0.9 ? 1 : 0 });
    if (h < 1.2) { gg.save(); gg.globalAlpha *= 1 - h / 1.2; KIT.chip(gg, 'Hoo!', x + 103 * s, y - (221 + h * 44) * s, '#8A5A3C', '#FFF4E3', 35 * s); gg.restore(); }
  }
  function sprocketOtter(gg, x, y, s, run) {
    var b = run > 0.5 ? Math.abs(Math.sin(T * 16)) * 16 : 0;
    otter14(gg, x, y, s, { hop: b, peb: run > 0.5 ? 0 : 1, cheer: 0, happy: run > 0.5 ? 1 : 0 }, 1);
  }
  function bramble(gg, x, y, s) {
    var hb = T - GOAT.hop < 0.6 ? Math.sin((T - GOAT.hop) / 0.6 * Math.PI) * 52 : 0;
    hedgehog(gg, x, y, s, { hop: hb, happy: hb > 4 ? 1 : 0 }, -1);
  }
  /* from films/pilot.js */
  function miniBot(gg, x, y, s, col, o) {
    o = o || {}; var t = T; gg.save(); gg.translate(x, y + Math.sin(t * 3 + (o.ph || 0)) * 6 * s); gg.scale(s, s);
    gg.fillStyle = 'rgba(95,140,220,.2)'; gg.fill(ellP(0, 84, 40, 9));
    cel(gg, ellP(0, 40, 30, 26), '#FFFFFF', '#D3DEF2', 8, 4, 4);
    [-1, 1].forEach(function (d) { cel(gg, ellP(d * 40, 42 + (o.arm && d > 0 ? -22 : 0), 11, 11), '#FFFFFF', '#D3DEF2', 3, 3, 3); });
    var an = new Path2D(); an.moveTo(0, -36); an.lineTo(0, -60); gg.strokeStyle = INK2; gg.lineWidth = 4; gg.stroke(an);
    gg.save(); gg.shadowColor = col; gg.shadowBlur = 14; gg.fillStyle = col; gg.fill(ellP(0, -64, 9, 9)); gg.restore(); gg.lineWidth = 3; gg.stroke(ellP(0, -64, 9, 9));
    cel(gg, ellP(0, 0, 46, 40), '#FFFFFF', '#D3DEF2', 10, 6, 4); gg.fillStyle = col; gg.fill(ellP(-46, 2, 8, 14)); gg.fill(ellP(46, 2, 8, 14));
    gg.fillStyle = '#1B2547'; gg.fill(ellP(0, 3, 34, 24));
    var ey = new Path2D(); if (o.sleepy) { ey.moveTo(-18, 4); ey.lineTo(-6, 4); ey.moveTo(6, 4); ey.lineTo(18, 4); } else { ey.moveTo(-19, 7); ey.quadraticCurveTo(-12, -4, -5, 7); ey.moveTo(5, 7); ey.quadraticCurveTo(12, -4, 19, 7); }
    gg.strokeStyle = '#7FE3FF'; gg.lineWidth = 4; gg.lineCap = 'round'; gg.stroke(ey);
    gg.restore();
  }
  /* from films/pilot.js */
  function ellP(x, y, rx, ry) { var p = new Path2D(); p.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); return p; }
  /* from films/pilot.js */
  function cel(gg, p, base, shade, dx, dy, lw) { gg.fillStyle = shade; gg.fill(p); gg.save(); gg.clip(p); gg.translate(-(dx || 10), -(dy || 10)); gg.fillStyle = base; gg.fill(p); gg.restore(); if (lw !== 0) { gg.lineJoin = 'round'; gg.lineWidth = lw || 6; gg.strokeStyle = INK2; gg.stroke(p); } }
  /* from films/pilot.js */
  function monster(gg, x, y, s) {
    var t = T, br = Math.sin(t * 2.2), rr = KJ.roar, ch = KJ.chomp, hit = KJ.hit, kb = KJ.kb, up = KJ.up, dz = KJ.dizzy, fl = KJ.flinch, flail = Math.max(hit, fl, up), wob = Math.sin(t * 14) * 18 * flail;
    var shk = (hit > 0.01 ? Math.sin(t * 60) * 12 * hit : 0) + Math.sin(t * 40) * 4 * rr + Math.sin(t * 70) * 10 * fl, sy = (1 - KJ.rise) * 800;
    gg.save(); gg.translate(x + shk + kb * 70, y + sy - up * 30); gg.scale(s, s);
    gg.fillStyle = 'rgba(0,0,20,.35)'; gg.fill(ellP(40, 0, 320, 32));
    gg.rotate(kb * 0.08 + Math.sin(t * 5) * 0.03 * dz);
    /* the tail, behind everything */
    var sw = Math.sin(t * 1.7) * 26, sw2 = Math.sin(t * 1.7 - 0.8) * 40;
    fat(gg, [[110, -170, 290, -112, 124], [290, -112, 412, -150 + sw * 0.4, 90], [412, -150 + sw * 0.4, 472 + sw * 0.3, -252 + sw, 62], [472 + sw * 0.3, -252 + sw, 448 + sw2 * 0.5, -334 + sw2 * 0.3, 36]], MG, MGS);
    /* the back leg and the back arm */
    fat(gg, [[96, -150, 114, -80, 94], [114, -80, 120, -24, 80]], MG, MGS); cel(gg, ellP(104, -14, 70, 26), MG, MGS, 8, 6, 6); claws(gg, 38, -14, Math.PI, 0.9);
    var be = [lerp(lerp(240, 262, rr), 252, flail), lerp(lerp(-362, -540, rr), -585, flail) + br * 5], bh = [lerp(lerp(292, 300, rr), 335 + wob, flail), lerp(lerp(-452, -684, rr), -705, flail) + br * 7];
    fat(gg, [[140, -450, be[0], be[1], 80], [be[0], be[1], bh[0], bh[1], 64]], MG, MGS); paw(gg, bh[0], bh[1], Math.atan2(bh[1] - be[1], bh[0] - be[0]));
    /* sticky-note plates down its back: they glow when it roars */
    [[92, -578, 0.35, '#FFE36E'], [170, -502, 0.75, '#FFFFFF'], [216, -406, 1.05, '#FFB3C1'], [234, -306, 1.3, '#BFE3FF'], [216, -206, 1.55, '#FFE36E']].forEach(function (q, i) { sheetSpike(gg, q[0], q[1], q[2] + Math.sin(t * 3 + i) * 0.04, 66, 98 - i * 6, q[3], 0.6 * rr); });
    /* the body: a hunched pear with a paper belly; spreadsheet skin; moonlight on its back */
    var body = new Path2D(); body.moveTo(-178, -140); body.bezierCurveTo(-238, -262, -228, -432, -150, -520); body.bezierCurveTo(-88, -594, 64, -604, 134, -532); body.bezierCurveTo(218, -452, 238, -282, 182, -170); body.bezierCurveTo(150, -112, 60, -92, -30, -96); body.bezierCurveTo(-110, -100, -162, -114, -178, -140); body.closePath();
    gg.save(); gg.translate(0, -300); gg.scale(1 + br * 0.012, 1 - br * 0.012); gg.translate(0, 300);
    cel(gg, body, MG, MGS, 36, 8, 0); skinGrid(gg, body, -250, -620, 250, -80, 46);
    gg.save(); gg.clip(body); var bel = ellP(-92, -300, 118, 168); gg.fillStyle = BELS; gg.fill(bel); gg.save(); gg.clip(bel); gg.translate(-12, -10); gg.fillStyle = BEL; gg.fill(bel); gg.restore();
    gg.save(); gg.clip(bel); var bg = new Path2D(); for (var gx = -210; gx < 30; gx += 44) { bg.moveTo(gx, -470); bg.lineTo(gx, -130); } for (var gy = -460; gy < -130; gy += 30) { bg.moveTo(-210, gy); bg.lineTo(30, gy); } gg.strokeStyle = 'rgba(37,143,92,.4)'; gg.lineWidth = 3; gg.stroke(bg);
    [[-166, -400, '#FFE36E'], [-78, -340, '#FFB3C1'], [-122, -250, '#FF6B7A'], [-34, -220, '#BFE3FF']].forEach(function (c) { gg.fillStyle = c[2]; gg.fill(rrP(c[0] + 3, c[1] + 3, 38, 24, 3)); }); gg.restore();
    gg.lineWidth = 5; gg.strokeStyle = 'rgba(37,143,92,.55)'; gg.stroke(bel);
    gg.translate(-12, 14); gg.strokeStyle = 'rgba(205,255,230,.5)'; gg.lineWidth = 14; gg.stroke(body); gg.restore();
    gg.lineJoin = 'round'; gg.lineWidth = 7; gg.strokeStyle = INK2; gg.stroke(body); gg.restore();
    /* the front leg */
    fat(gg, [[-96, -150, -122, -80, 98], [-122, -80, -140, -24, 84]], MG, MGS); cel(gg, ellP(-150, -14, 76, 28), MG, MGS, 8, 6, 6); claws(gg, -218, -14, Math.PI, 1);
    /* the head: pivots at the neck; it snaps back on the uppercut and wobbles when dizzy */
    var hr = 0.22 * rr + 0.5 * up - 0.12 * ch - 0.15 * fl + Math.sin(t * 6) * 0.12 * dz + br * 0.02;
    gg.save(); gg.translate(-60, -545 + br * 3); gg.rotate(hr);
    pencil(gg, -122, -172, -0.45, 86); pencil(gg, -30, -186, 0.12, 78);
    var mo = 6 + rr * 62 + ch * 48 + hit * 34 + up * 44, ja = -mo * 0.0042;
    gg.fillStyle = '#4A0B1C'; gg.fill(ellP(-90, -44 + mo * 0.42, 120, 10 + mo * 0.5));
    var tu = new Path2D(); for (var i = 0; i < 7; i++) { var tx = -190 + i * 32; tu.moveTo(tx - 11, -52); tu.lineTo(tx, -28); tu.lineTo(tx + 11, -52); } gg.fillStyle = '#FFFFFF'; gg.fill(tu); gg.lineWidth = 3; gg.strokeStyle = INK2; gg.stroke(tu);
    if (mo > 20) { gg.fillStyle = '#FF6B7A'; gg.fill(ellP(-100, -40 + mo * 0.74, 62, 14 + mo * 0.12)); }
    gg.save(); gg.translate(55, -35); gg.rotate(ja); gg.translate(-55, 35);
    var tl = new Path2D(); for (var j = 0; j < 6; j++) { var bx = -175 + j * 34; tl.moveTo(bx - 10, -44); tl.lineTo(bx, -66); tl.lineTo(bx + 10, -44); } gg.fillStyle = '#FFFFFF'; gg.fill(tl); gg.lineWidth = 3; gg.strokeStyle = INK2; gg.stroke(tl);
    var jaw = new Path2D(); jaw.moveTo(-205, -52); jaw.quadraticCurveTo(-90, -36, 28, -48); jaw.lineTo(62, -30); jaw.bezierCurveTo(72, 0, 20, 34, -60, 32); jaw.bezierCurveTo(-150, 30, -205, 6, -212, -30); jaw.closePath();
    cel(gg, jaw, MG, MGS, 0, -12, 7); skinGrid(gg, jaw, -220, -60, 80, 40, 40); gg.restore();
    var hd = new Path2D(); hd.moveTo(-208, -54); hd.bezierCurveTo(-236, -92, -228, -152, -172, -176); hd.bezierCurveTo(-110, -206, 12, -202, 62, -150); hd.bezierCurveTo(98, -110, 94, -58, 62, -30); hd.lineTo(28, -48); hd.quadraticCurveTo(-90, -38, -208, -54); hd.closePath();
    cel(gg, hd, MG, MGS, 24, 0, 0); skinGrid(gg, hd, -240, -210, 100, -30, 40); gg.save(); gg.clip(hd); gg.translate(-10, 12); gg.strokeStyle = 'rgba(205,255,230,.45)'; gg.lineWidth = 12; gg.stroke(hd); gg.restore(); gg.lineJoin = 'round'; gg.lineWidth = 7; gg.strokeStyle = INK2; gg.stroke(hd);
    [-172, -44].forEach(function (fx) { var fp = polyP([[fx - 10, -52], [fx, -16], [fx + 10, -52]]); gg.fillStyle = '#FFFFFF'; gg.fill(fp); gg.lineWidth = 3; gg.strokeStyle = INK2; gg.stroke(fp); });
    gg.fillStyle = INK2; gg.fill(ellP(-214, -112, 5, 8)); gg.fill(ellP(-198, -104, 4, 7));
    var lk = KJ.look * 6;
    [[-150, -118, 0.95], [-62, -126, 1]].forEach(function (e) {
      gg.save(); gg.translate(e[0], e[1]); gg.scale(e[2], e[2]); gg.lineCap = 'round'; gg.lineJoin = 'round';
      if (dz > 0.5) { gg.fillStyle = '#FFFFFF'; gg.fill(ellP(0, 0, 30, 30)); var sp = new Path2D(); for (var a = 0; a < 14; a += 0.3) { var r = a * 2.0, px = Math.cos(a + t * 8) * r, py = Math.sin(a + t * 8) * r; if (a) sp.lineTo(px, py); else sp.moveTo(px, py); } gg.strokeStyle = INK2; gg.lineWidth = 4; gg.stroke(sp); gg.lineWidth = 5; gg.stroke(ellP(0, 0, 30, 30)); }
      else if (fl > 0.4 || hit > 0.4 || up > 0.4) { var sq = new Path2D(); sq.moveTo(-24, -14); sq.lineTo(12, 0); sq.lineTo(-24, 14); gg.strokeStyle = INK2; gg.lineWidth = 9; gg.stroke(sq); }
      else { var ey = new Path2D(); ey.moveTo(-34, 4); ey.quadraticCurveTo(-4, -30 - rr * 6, 34, -8); ey.quadraticCurveTo(10, 26, -34, 4); ey.closePath();
        gg.save(); gg.shadowColor = 'rgba(255,225,74,.95)'; gg.shadowBlur = 24; gg.fillStyle = '#FFE14A'; gg.fill(ey); gg.restore();
        gg.save(); gg.clip(ey); gg.fillStyle = '#F28C28'; gg.fill(ellP(lk, 0, 16, 20)); gg.fillStyle = INK2; gg.fill(ellP(lk, -2, 5, 16 - rr * 4)); gg.restore(); gg.lineWidth = 6; gg.strokeStyle = INK2; gg.stroke(ey); }
      var bw = new Path2D(); bw.moveTo(-40, -30 + rr * 4); bw.lineTo(36, -46 - rr * 6); gg.strokeStyle = INK2; gg.lineWidth = 14; gg.stroke(bw); gg.restore(); });
    if (dz > 0.01) { gg.save(); gg.globalAlpha *= dz; for (var k = 0; k < 4; k++) { var an = t * 4 + k * Math.PI / 2, stx = -80 + Math.cos(an) * 130, sty = -250 + Math.sin(an) * 32, st = polyP(starPts(stx, sty, 24, 24, 5, 0.45, k)); gg.fillStyle = YEL; gg.fill(st); gg.lineWidth = 4; gg.strokeStyle = INK2; gg.stroke(st); } gg.restore(); }
    gg.restore();
    /* the front arm last: it reaches for Nexi, rises when it roars, feeds the mouth, flails when hit */
    var fe = [lerp(lerp(lerp(-252, -262, rr), -232, ch), -205, flail), lerp(lerp(lerp(-350, -520, rr), -420, ch), -560, flail) + br * 6];
    var fh = [lerp(lerp(lerp(-318, -300, rr), -212, ch), -150 + wob, flail), lerp(lerp(lerp(-432, -664, rr), -560, ch), -690, flail) + br * 8];
    fat(gg, [[-150, -455, fe[0], fe[1], 84], [fe[0], fe[1], fh[0], fh[1], 68]], MG, MGS); paw(gg, fh[0], fh[1], Math.atan2(fh[1] - fe[1], fh[0] - fe[0]));
    gg.restore();
  }
  /* from films/pilot.js */
  function starPts(cx, cy, rx, ry, n, inner, seed, rot) { var pts = []; for (var i = 0; i < n * 2; i++) { var a = i * Math.PI / n - Math.PI / 2 + (rot || 0), r = i % 2 ? inner * (0.92 + hsh(i + seed) * 0.16) : 0.88 + hsh(i * 3 + seed) * 0.24; pts.push([cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r]); } return pts; }
  /* from films/pilot.js */
  function hsh(i) { var s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }
  /* from films/pilot.js */
  function fat(gg, segs, base, shade) {
    gg.save(); gg.lineCap = 'round'; gg.lineJoin = 'round';
    [[INK2, 14, 1, 0], [shade, 0, 1, 0], [base, 0, 0.64, 1]].forEach(function (ps) {
      segs.forEach(function (q) { var o = ps[3] ? q[4] * 0.12 : 0, p = new Path2D(); p.moveTo(q[0] - o, q[1] - o); p.lineTo(q[2] - o, q[3] - o); gg.strokeStyle = ps[0]; gg.lineWidth = q[4] * ps[2] + ps[1]; gg.stroke(p); }); });
    gg.restore();
  }
  /* from films/pilot.js */
  function pencil(gg, x, y, rot, len) {
    gg.save(); gg.translate(x, y); gg.rotate(rot); var b = rrP(-12, -len, 24, len, 3); cel(gg, b, '#FFD84A', '#E0AE1E', 7, 0, 4);
    var er = rrP(-12, -8, 24, 20, 5); gg.fillStyle = '#FF9DB0'; gg.fill(er); gg.lineWidth = 4; gg.strokeStyle = INK2; gg.stroke(er);
    var tip = polyP([[-12, -len], [0, -len - 36], [12, -len]]); gg.fillStyle = '#F4D6A6'; gg.fill(tip); gg.stroke(tip); gg.fillStyle = INK2; gg.fill(polyP([[-4, -len - 24], [0, -len - 36], [4, -len - 24]])); gg.restore();
  }
  /* from films/pilot.js */
  function rrP(x, y, w, h, r) { var p = new Path2D(); r = Math.min(r, w / 2, h / 2); p.moveTo(x + r, y); p.arcTo(x + w, y, x + w, y + h, r); p.arcTo(x + w, y + h, x, y + h, r); p.arcTo(x, y + h, x, y, r); p.arcTo(x, y, x + w, y, r); p.closePath(); return p; }
  /* from films/pilot.js */
  function polyP(pts) { var p = new Path2D(); pts.forEach(function (q, i) { if (i) p.lineTo(q[0], q[1]); else p.moveTo(q[0], q[1]); }); p.closePath(); return p; }
  /* from films/pilot.js */
  function paw(gg, x, y, ang) { cel(gg, ellP(x, y, 46, 40), MG, MGS, 10, 8, 6); claws(gg, x + Math.cos(ang) * 34, y + Math.sin(ang) * 34, ang, 1); }
  /* from films/pilot.js */
  function claws(gg, x, y, ang, s) { gg.save(); gg.translate(x, y); gg.rotate(ang); [-1, 0, 1].forEach(function (k) { var c = polyP([[0, k * 20 * s - 9 * s], [38 * s, k * 25 * s], [0, k * 20 * s + 9 * s]]); gg.fillStyle = '#FFF6DA'; gg.fill(c); gg.lineWidth = 4; gg.lineJoin = 'round'; gg.strokeStyle = INK2; gg.stroke(c); }); gg.restore(); }
  /* from films/pilot.js */
  function sheetSpike(gg, x, y, rot, w, h, col, glow) {
    gg.save(); gg.translate(x, y); gg.rotate(rot); var p = polyP([[-w / 2, 6], [-w / 2, -h], [w / 2 - 18, -h], [w / 2, -h + 18], [w / 2, 6]]);
    if (glow > 0.01) { gg.shadowColor = 'rgba(170,255,210,' + glow + ')'; gg.shadowBlur = 34; } gg.fillStyle = col; gg.fill(p); gg.shadowBlur = 0;
    gg.lineJoin = 'round'; gg.lineWidth = 5; gg.strokeStyle = INK2; gg.stroke(p); var dog = polyP([[w / 2 - 18, -h], [w / 2 - 18, -h + 18], [w / 2, -h + 18]]); gg.fillStyle = 'rgba(0,0,0,.12)'; gg.fill(dog); gg.lineWidth = 3; gg.stroke(dog);
    var ln = new Path2D(); for (var yy = -h + 26; yy < -6; yy += 16) { ln.moveTo(-w / 2 + 9, yy); ln.lineTo(w / 2 - 12, yy); } gg.strokeStyle = 'rgba(31,31,61,.22)'; gg.lineWidth = 3; gg.stroke(ln); gg.restore();
  }
  /* from films/pilot.js */
  function skinGrid(gg, p, x0, y0, x1, y1, step, col) { gg.save(); gg.clip(p); var gl = new Path2D(); for (var gx = x0; gx < x1; gx += step) { gl.moveTo(gx, y0); gl.lineTo(gx, y1); } for (var gy = y0; gy < y1; gy += step * 0.64) { gl.moveTo(x0, gy); gl.lineTo(x1, gy); } gg.strokeStyle = col || MGL; gg.lineWidth = 3; gg.stroke(gl); gg.restore(); }

  /* ================= the scene ================= */
  /* the canvas covers the whole hero (host), so the cast walks and flies in from beyond the window edge */
  function castScene(host, stage, tv, nexiEl, perch) {
  var cv = document.createElement('canvas');
  cv.className = 'nxe-cast';
  cv.setAttribute('aria-hidden', 'true');
  host.appendChild(cv);
  var gg = cv.getContext('2d');
  if (!gg) { cv.remove(); return; }
  var slide = perch ? stage.closest('.slide') : null, heroEl = perch ? stage.closest('[data-hero]') : null, seen = true, wipeT = 0;
  var stacked = window.matchMedia('(max-width: 960px)');
  var SCENE = 22, W = 0, H = 0, dpr = 1, last = 0, raf = 0, on = true, u0 = 0, prevU = -1, fired = {}, tapAt = -9;
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function ease(k) { k = clamp(k, 0, 1); return k * k * (3 - 2 * k); }
  function seg(u, a, b) { return ease((u - a) / (b - a)); }
  function once(key, u, at, fn) { if (u >= at && !fired[key]) { fired[key] = 1; fn(); } }
  function size() {
    var r = cv.getBoundingClientRect();
    dpr = Math.min(1.5, window.devicePixelRatio || 1);
    W = r.width; H = r.height;
    cv.width = Math.max(1, Math.round(W * dpr)); cv.height = Math.max(1, Math.round(H * dpr));
  }
  /* where the cat sits on the TV (fraction of its width): just right of the ON AIR sticker, never on it, and clear
     of the owl in the far corner (cat: 34 units left of its feet, its tail 64 right; owl: 46 each side) */
  function catF(tvR, c, f0, cs, owlF, os) {
    var oa = tv.querySelector('.nxe-tv-on,.nxs-onair'), f = f0;
    if (oa) { var r = rel(oa, c); if (r.w) f = Math.max(f, (r.r + 34 * cs + 8 - tvR.l) / tvR.w); }
    return Math.min(f, (tvR.w * owlF - 46 * os - 64 * cs - 6) / tvR.w);
  }
  function rel(el, c) {
    var m = memo && memo.get(el); if (m) return m;
    var r = el.getBoundingClientRect(); m = { l: r.left - c.left, t: r.top - c.top, r: r.right - c.left, b: r.bottom - c.top, w: r.width, h: r.height };
    if (memo) memo.set(el, m);
    return m;
  }
  /* Where the TV, the stage and Nexi are. Reading their boxes on every frame forced a style update in the middle of
     the frame (the rest of the hero writes styles in its own animation callbacks), the biggest cost of this slide.
     The boxes only move when the slide enters, the page resizes or the visitor's pointer tilts / hovers things, so
     they are re-read every frame for a moment after any of those and otherwise twice a second. */
  var memo = null, geoAt = -1e9, freshUntil = 0, cBox = null;
  function fresh(ms) { freshUntil = Math.max(freshUntil, performance.now() + ms); }
  function geo(still) {
    var now = performance.now();
    if (still || now < freshUntil || now - geoAt > 500 || !cBox) { memo = typeof Map === 'function' ? new Map() : null; geoAt = now; cBox = cv.getBoundingClientRect(); }
    return cBox;
  }
  /* draw fn at (x, y) scaled by s; flip mirrors it; rot tilts it */
  function put(x, y, s, fn, flip, rot, alpha) {
    if (alpha !== undefined && alpha <= 0.01) return;
    gg.save(); if (alpha !== undefined) gg.globalAlpha *= alpha;
    gg.translate(x, y); if (rot) gg.rotate(rot); gg.scale(s * (flip || 1), s); fn(); gg.restore();
  }

  /* sound words (comic lettering) and speech chips */
  var words = [], chips = [];
  function word(text, x, y, sz, rot) { words.push({ text: text, x: x, y: y, t0: T, rot: rot || 0, sz: sz }); }
  function chip(text, x, y, sz, fg, bg) { chips.push({ text: text, x: x, y: y, t0: T, sz: sz, fg: fg, bg: bg }); }
  function drawWords() {
    words = words.filter(function (w) { return T - w.t0 < 1.1; });
    words.forEach(function (w) {
      var a = (T - w.t0) / 1.1, sc = a < 0.18 ? 0.4 + a / 0.18 * 0.8 : 1.2 - (a - 0.18) * 0.25, al = a < 0.7 ? 1 : 1 - (a - 0.7) / 0.3;
      gg.save(); gg.globalAlpha = al; gg.translate(w.x, w.y - a * 24); gg.rotate(w.rot); gg.scale(sc, sc);
      gg.font = w.sz + 'px Bangers, "Plus Jakarta Sans", sans-serif'; gg.textAlign = 'center'; gg.textBaseline = 'middle'; gg.lineJoin = 'round';
      gg.lineWidth = Math.max(4, w.sz * 0.22); gg.strokeStyle = '#101C45'; gg.strokeText(w.text, 0, w.sz * 0.12); gg.strokeText(w.text, 0, 0);
      gg.fillStyle = '#FFD23F'; gg.fillText(w.text, 0, 0); gg.restore();
    });
    chips = chips.filter(function (c) { return T - c.t0 < 1.6; });
    chips.forEach(function (c) {
      var a = (T - c.t0) / 1.6; gg.save(); gg.globalAlpha = a < 0.75 ? 1 : 1 - (a - 0.75) / 0.25;
      KIT.chip(gg, c.text, c.x, c.y - a * 14, c.fg, c.bg, c.sz); gg.restore();
    });
  }

  function frame(still) {
    var c = geo(still);
    if (Math.abs(c.width - W) > 1 || Math.abs(c.height - H) > 1) size();
    var tvR = rel(tv, c), sr = rel(stage, c);
    if (perch) { perchFrame(still, c, tvR, sr); return; }
    var nx = rel(nexiEl, c);
    var k = clamp(sr.w / 560, 0.6, 1.1), floor = sr.b - 10 * k, u = still ? 13.2 : (T - u0) % SCENE;
    if (u < prevU) { fired = {}; }
    prevU = u;
    var topAt = function (f) { return tvR.t + 7 * k + f * tvR.w * 0.04; };   /* the TV leans 2.5deg: its top drops to the right */
    var hop = T - tapAt < 0.55 ? -Math.sin((T - tapAt) / 0.55 * Math.PI) * 16 * k : 0;
    var exitR = W + 90 * k;
    gg.setTransform(dpr, 0, 0, dpr, 0, 0); gg.clearRect(0, 0, W, H);

    /* --- the spreadsheet monster peeks up behind the floor at the right (drawn first: everyone stands in front) --- */
    var rise = still ? 0 : seg(u, 15.6, 16.6) * (1 - seg(u, 19.2, 20.2));
    if (rise > 0.01) {
      KJ.rise = 0.12 + rise * 0.42; KJ.look = -1;
      KJ.roar = u > 16.6 && u < 17.5 ? Math.sin((u - 16.6) / 0.9 * Math.PI) * 0.55 : 0;
      gg.save(); gg.beginPath(); gg.rect(0, 0, W, floor + 2); gg.clip();
      put(sr.r + 6 * k, floor + 4, 0.28 * k, function () { monster(gg, 0, 0, 1); });
      gg.restore();
      once('eek', u, 16.9, function () { word('EEK!', sr.r - 90 * k, floor - 245 * k, 42 * k, -0.18); word('?!', tvR.l + tvR.w * 0.4 + 40 * k, topAt(0.4) - 120 * k, 28 * k, 0.12); LK.hoot = T; GOAT.hop = T; });
      once('hi', u, 18.1, function () { chip('hi…', sr.r - 60 * k, floor - 190 * k, 18 * k, '#258F5C', '#F2FBEA'); });
    }

    /* --- helper bots (EP00's AI lab) float over the TV --- */
    var ba = still ? 1 : seg(u, 13.4, 14.2) * (1 - seg(u, 20.3, 21));
    if (ba > 0.01) {
      var jit = u > 16.9 && u < 18 ? Math.sin(T * 40) * 3 * k : 0;
      put(tvR.l + tvR.w * 0.5 + jit, tvR.t - 62 * k + hop, 0.38 * k, function () { miniBot(gg, 0, 0, 1, '#5FD3FF', { ph: 0 }); }, 1, 0, ba);
      put(tvR.l + tvR.w * 0.68 - jit, tvR.t - 72 * k + hop, 0.34 * k, function () { miniBot(gg, 0, 0, 1, '#FFD84A', { ph: 1.7, arm: Math.sin(T * 6) > 0 }); }, 1, 0, ba);
    }

    /* --- the cat sits on the TV, Olive the owl on its other corner --- */
    var wave = (u > 11.4 && u < 13.2) || T - tapAt < 1.2 ? 1 : 0;
    var pf = catF(tvR, c, 0.36, 0.78 * k, 0.88, 0.62 * k);
    put(tvR.l + tvR.w * pf, topAt(pf) + hop, 0.78 * k, function () { cat(gg, 0, 0, wave); });
    cv.dataset.cat = Math.round(tvR.l + tvR.w * pf - 34 * 0.78 * k);
    put(tvR.l + tvR.w * 0.88, topAt(0.88) + hop, 0.42 * k, function () { olive(gg, 0, 0, 1); });
    once('hoot', u, 12.3, function () { LK.hoot = T; });

    /* --- the penguin waddles in fanning, spins when Sprocket zooms past, jumps at the monster --- */
    var px = still ? sr.r - 170 * k : lerp(exitR, sr.r - 170 * k, seg(u, 1, 4)) + (exitR - (sr.r - 170 * k)) * seg(u, 20.4, 22);
    var walking = !still && ((u > 1 && u < 4) || u > 20.4);
    var pb = walking ? -Math.abs(Math.sin(T * 9)) * 4 * k : 0, prot = walking ? Math.sin(T * 9) * 0.07 : 0;
    if (u > 6.5 && u < 7.2) prot = (u - 6.5) / 0.7 * Math.PI * 2;
    if (u > 16.9 && u < 17.5) pb -= Math.sin((u - 16.9) / 0.6 * Math.PI) * 26 * k;
    put(px, floor - 66 * 0.72 * k + pb + hop, 0.72 * k, function () { penguin(gg, 0, 0, 1); }, 1, prot);

    /* --- Sprocket the otter zooms in, stops beside Nexi with his pebble, bolts when the monster shows --- */
    var hStop = nx.r + 40 * k;
    if (still || (u > 5.6 && u < 18.4)) {
      var hx = still ? hStop : lerp(exitR, hStop, seg(u, 5.6, 7.1)), run = !still && (u < 7.1 || u > 17.1) ? 1 : 0, ha = 1;
      if (!still && u > 17.1) { hx = lerp(hStop, nx.l + nx.w * 0.4, seg(u, 17.1, 18.2)); ha = 1 - seg(u, 17.7, 18.3); }
      put(hx, floor + hop, 0.36 * k, function () { sprocketOtter(gg, 0, 0, 1, run); }, run ? -1 : 1, 0, ha);
      once('zoom', u, 6.4, function () { word('ZOOM!', sr.r - 150 * k, floor - 228 * k, 38 * k, -0.12); });
    }

    /* --- Bramble the hedgehog trots in and hops (BOING!) --- */
    if (still || u > 8) {
      var gx = still ? sr.r - 50 * k : lerp(exitR, sr.r - 50 * k, seg(u, 8, 9.4)) + (exitR + 40 * k - (sr.r - 50 * k)) * seg(u, 20.6, 22);
      var gw = !still && ((u > 8 && u < 9.4) || u > 20.6) ? -Math.abs(Math.sin(T * 10)) * 3 * k : 0;
      put(gx, floor + gw + hop, 0.52 * k, function () { bramble(gg, 0, 0, 1); });
      once('boing', u, 9.9, function () { GOAT.hop = T; word('BOING!', sr.r - 40 * k, floor - 200 * k, 36 * k, 0.15); });
    }

    /* --- the duck flies in and lands on Nexi's head, quacks, flies off --- */
    if (still || (u > 9.8 && u < 21.8)) {
      var hx2 = nx.l + nx.w * 0.52, hy = nx.t + 4 * k, fx = W + 70 * k, fy = tvR.t - 40 * k, q = still ? 1 : seg(u, 9.8, 11.1), out = still ? 0 : seg(u, 20.4, 21.8);
      var dx = lerp(fx, hx2, q), dy = lerp(fy, hy, q) - Math.sin(q * Math.PI) * 60 * k;
      dx = lerp(dx, nx.l - 40 * k, out); dy = lerp(dy, -90 * k, out) - Math.sin(out * Math.PI) * 30 * k;   /* flies off over the top */
      var flying = !still && ((u > 9.8 && u < 11.1) || u > 20.4);
      put(dx, dy - 17 * 1.55 * k + (flying ? Math.sin(T * 18) * 3 * k : 0) + hop, 1.55 * k, function () { duck(gg, 0, 0); }, u > 20.4 ? -1 : 1, flying ? -0.18 : 0);
      once('land', u, 11.1, function () { DUCK.bob = T; });
      once('quack', u, 11.5, function () { chip('Quack!', dx + 50 * k, dy - 70 * k, 17 * k, '#B4521E', '#FFF6DA'); });
    }

    drawWords();
  }

  /* the home slide: a 12 s party on top of the TV */
  function perchFrame(still, c, tvR, sr) {
    var k = clamp(sr.w / 580, 0.6, 1.1), u = still ? 6 : (T - u0) % 12;
    if (u < prevU) { fired = {}; }
    prevU = u;
    var topAt = function (f) { return tvR.t + 7 * k + f * tvR.w * 0.026; };   /* this TV leans 1.5deg */
    gg.setTransform(dpr, 0, 0, dpr, 0, 0); gg.clearRect(0, 0, W, H);
    put(tvR.l + tvR.w * 0.7, tvR.t - 64 * k, 0.34 * k, function () { miniBot(gg, 0, 0, 1, '#5FD3FF', { ph: 0 }); });
    put(tvR.l + tvR.w * 0.84, tvR.t - 76 * k, 0.3 * k, function () { miniBot(gg, 0, 0, 1, '#FFD84A', { ph: 1.7, arm: Math.sin(T * 6) > 0 }); });
    var wave = u > 3.8 && u < 5.6 ? 1 : 0;
    /* the cat sits clear of the countdown chip when the chip is above the TV (desktop), else at 62% */
    var chipEl = stage.querySelector('.nxs-next'), cf = 0.62;
    if (chipEl) { var ch = rel(chipEl, c); if (ch.b <= tvR.t + 4 && ch.w) cf = clamp((ch.r - tvR.l + 34 * k) / tvR.w, 0.5, 0.74); }
    cf = catF(tvR, c, cf, 0.66 * k, 0.95, 0.5 * k);
    put(tvR.l + tvR.w * cf, topAt(cf), 0.66 * k, function () { cat(gg, 0, 0, wave); });
    cv.dataset.cat = Math.round(tvR.l + tvR.w * cf - 34 * 0.66 * k);
    put(tvR.l + tvR.w * 0.95, topAt(0.95), 0.34 * k, function () { olive(gg, 0, 0, 1); });
    once('hoot', u, 4.6, function () { LK.hoot = T; });
    var q = still ? 1 : seg(u, 2, 3.2), out = still ? 0 : seg(u, 9.4, 10.8);
    if (still || (u > 2 && u < 10.8)) {
      var lf = (cf + 0.95) / 2 + 0.02, lx = tvR.l + tvR.w * lf, ly = topAt(lf), fx = W + 70 * k, fy = tvR.t - 130 * k;
      var dx = lerp(lerp(fx, lx, q), tvR.l + tvR.w * 0.3, out), dy = lerp(lerp(fy, ly, q), tvR.t - 170 * k, out) - Math.sin(q * Math.PI) * 50 * k - Math.sin(out * Math.PI) * 30 * k;
      var fly = !still && (u < 3.2 || u > 9.4);
      put(dx, dy - 17 * 1.3 * k + (fly ? Math.sin(T * 18) * 3 * k : 0), 1.3 * k, function () { duck(gg, 0, 0); }, u > 9.4 ? -1 : 1, fly ? -0.18 : 0, 1 - out);
      once('land', u, 3.2, function () { DUCK.bob = T; });
      once('quack', u, 3.6, function () { chip('Quack!', dx + 36 * k, dy - 60 * k, 16 * k, '#B4521E', '#FFF6DA'); });
    }
    /* phones and tablets: the floor under the countdown chip is empty, so a little parade walks it: the penguin
       waddles in fanning, Sprocket zooms across (ZOOM!), Bramble trots in and hops (BOING!), then they leave */
    if (stacked.matches) {
      /* keep clear of the round side buttons fixed at the bottom right of phones (usable floor = W - 90) */
      var fl = H - 12 * k, nb = rel(stage, c).b, room = fl - nb, pk = clamp(Math.min(k, room / 120), 0.42, 0.75), UW = W - 90;
      if (room > 48) {                 /* (48: the phone row for Nexi's bubble under the TV takes some floor) */
        var pX = still ? UW * 0.7 : lerp(W + 70 * pk, UW * 0.7, seg(u, 0.4, 3)) - (UW * 0.7 + 80 * pk) * seg(u, 10, 12);
        var pw = !still && ((u > 0.4 && u < 3) || u > 10);
        put(pX, fl - 66 * 0.72 * pk - (pw ? Math.abs(Math.sin(T * 9)) * 4 * pk : 0), 0.72 * pk, function () { penguin(gg, 0, 0, 1); }, 1, pw ? Math.sin(T * 9) * 0.07 : 0);
        if (!still && u > 4.4 && u < 5.8) {
          var hX = lerp(W + 50 * pk, -60 * pk, seg(u, 4.4, 5.8));
          put(hX, fl, 0.36 * pk, function () { sprocketOtter(gg, 0, 0, 1, 1); }, -1);
          once('pzoom', u, 4.9, function () { word('ZOOM!', W * 0.42, fl - 120 * pk, 30 * pk, -0.12); });
        }
        if (still || (u > 5.9 && u < 12)) {
          var gX = still ? UW * 0.36 : lerp(W + 70 * pk, UW * 0.36, seg(u, 5.9, 7.3)) - (UW * 0.36 + 90 * pk) * seg(u, 10.4, 12);
          put(gX, fl - (!still && (u < 7.3 || u > 10.4) ? Math.abs(Math.sin(T * 10)) * 3 * pk : 0), 0.5 * pk, function () { bramble(gg, 0, 0, 1); });
          once('pboing', u, 7.8, function () { GOAT.hop = T; word('BOING!', UW * 0.36, fl - 140 * pk, 28 * pk, 0.15); });
        }
      }
    }
    drawWords();
  }

  function loop(now) {
    raf = 0;
    if (!on) return;
    var dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
    last = now; T += dt;
    frame(false);
    raf = requestAnimationFrame(loop);
  }
  function start() { if (reduce) { frame(true); return; } if (!raf && on) { last = 0; raf = requestAnimationFrame(loop); } }
  function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; }
  function sync() {
    var showing = (!slide || slide.classList.contains('is-active')) && !document.documentElement.classList.contains('intro');
    if (on && showing && !document.hidden) { fresh(1800); if (slide && !seen) { u0 = T; prevU = -1; fired = {}; } seen = true; start(); }
    else {
      stop();
      /* the home slide went away: wipe the frame so nobody is left frozen on the next slide */
      /* (after the slide's closing circle, so the cast is not wiped while it is still on screen) */
      if (slide && !showing) { seen = false; clearTimeout(wipeT); wipeT = setTimeout(function () { if (!slide.classList.contains('is-active')) { gg.setTransform(1, 0, 0, 1, 0, 0); gg.clearRect(0, 0, cv.width, cv.height); } }, 950); }
    }
  }
  if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { on = en[en.length - 1].isIntersecting; sync(); }).observe(stage);
  document.addEventListener('visibilitychange', sync);
  document.addEventListener('tn:intro-done', sync);
  if (heroEl) heroEl.addEventListener('tn:slide', function () { setTimeout(sync, 0); });
  if ('ResizeObserver' in window) new ResizeObserver(function () { fresh(300); size(); if (reduce) frame(true); }).observe(stage);
  ['pointermove', 'pointerover', 'pointerout'].forEach(function (ev) { (heroEl || host).addEventListener(ev, function () { fresh(1100); }, { passive: true }); });
  window.addEventListener('resize', function () { fresh(600); }, { passive: true });
  stage.addEventListener('nxe:tap', function () { tapAt = T; LK.hoot = T; GOAT.hop = T; DUCK.bob = T; });
  size();
  /* the sound words use the page's comic font: draw once it is ready (the scene starts either way) */
  if (document.fonts && document.fonts.load) document.fonts.load('30px Bangers').then(sync, sync); else sync();
  }


  /* ---------------- the Characters category: a still portrait of each sidekick on its card ----------------
     window.NXEportraits(root) draws every canvas[data-nxe-portrait] inside root once (300 x 240 set units).
     Same drawings as the scene above, posed still (T fixed), so the cards match the hero. */
  var PORTRAIT = {
    penguin: function (g) { penguin(g, 150, 228 - 66 * 1.45, 1.45); },
    cat: function (g) { g.save(); g.translate(150, 214); g.scale(1.55, 1.55); cat(g, 0, 0, 1); g.restore(); },
    duck: function (g) { g.save(); g.translate(150, 150); g.scale(2.6, 2.6); duck(g, 0, 0); g.restore(); },
    bots: function (g) { g.save(); g.translate(98, 120); g.scale(0.85, 0.85); miniBot(g, 0, 0, 1, '#5FD3FF', { ph: 0 }); g.restore();
                         g.save(); g.translate(205, 104); g.scale(0.75, 0.75); miniBot(g, 0, 0, 1, '#FFD84A', { ph: 1.7, arm: true }); g.restore(); },
    monster: function (g) { var r = KJ.rise, lk = KJ.look; KJ.rise = 1; KJ.look = -1; g.save(); g.translate(170, 236); g.scale(0.26, 0.26); monster(g, 0, 0, 1); g.restore(); KJ.rise = r; KJ.look = lk; }
  };
  window.NXEportraits = function (root) {
    [].slice.call((root || document).querySelectorAll('canvas[data-nxe-portrait]')).forEach(function (cv) {
      if (cv.dataset.drawn || !cv.offsetWidth) return;
      var fn = PORTRAIT[cv.getAttribute('data-nxe-portrait')];
      if (!fn) return;
      var w = cv.offsetWidth, h = cv.offsetHeight, d = Math.min(2, window.devicePixelRatio || 1);
      cv.width = Math.round(w * d); cv.height = Math.round(h * d);
      var g = cv.getContext('2d'), k = Math.min(w / 300, h / 240), keep = T;
      T = 1.3;
      g.setTransform(d * k, 0, 0, d * k, d * (w - 300 * k) / 2, d * (h - 240 * k));
      try { fn(g); } catch (e) { /* a drawing that needs scene state just stays blank */ }
      T = keep;
      cv.dataset.drawn = '1';
    });
  };
  window.dispatchEvent(new Event('nxe:portraits-ready'));

  var pageStage = document.querySelector('[data-nxe-hero] [data-nxe-stage]');
  if (pageStage && pageStage.querySelector('.nxe-tv') && pageStage.querySelector('[data-nxe-nexi]'))
    castScene(pageStage.closest('[data-nxe-hero]'), pageStage, pageStage.querySelector('.nxe-tv'), pageStage.querySelector('[data-nxe-nexi]'), false);
  var homeStage = document.querySelector('[data-hero] [data-nxs]');
  /* home: the canvas lives in slide 6 itself, so the circle transition clips the cast with the slide */
  if (homeStage && homeStage.querySelector('.nxs-tv')) castScene(homeStage.closest('.slide'), homeStage, homeStage.querySelector('.nxs-tv'), null, true);
})();
