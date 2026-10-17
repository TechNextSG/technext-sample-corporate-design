/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: sol-net (/solutions/networks) — "The Office Waterworks": the office network drawn as a building's water supply, in a
   bright daytime cutaway of an office and the street beside it. The INTERNET arrives like the mains from two water towers
   (the main line and a smaller backup); under the street the pipes run to the FIREWALL, a filter tank at the building's
   gate that catches the junk nobody asked for and throws it back out into the TURNED AWAY bin; the OFFICE SWITCH is a
   manifold of labelled valves that feeds colour-coded pipes through the ceiling: blue for staff, green for devices (the
   printer), orange for guests, which ends at a locked cap above the FILE SERVER cistern; Wi-Fi access points hang from the
   ceiling like sprinklers and their coverage rains down room by room; the VPN is a sealed violet pipe from a cottage
   where a remote colleague works. The cast: the TechNext engineer labels ports and writes the change log (tap: he rings
   the pipe with a wrench and a pulse runs through the whole network), the office manager studies the network diagram
   (tap: she holds it up high), a staff member opens shared drives (tap: a chair spin, three folders arrive), the TechNext
   surveyor walks the room with a coverage meter (tap: full bars and a jump), the visitor on the sofa browses on guest
   Wi-Fi (tap: internet yes, files no, a shrug). Tap a walker, the cottage, the bin, the pipes or the big red valve. */
(function (K, CR, CO) {
  'use strict';
  if (!K || !CR || !CO) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed, limb = K.limb;
  var F = 470, AQUA = '#1C9AD6', AQUA_D = '#0F6E9E', STAFF = '#3167CA', GUEST = '#F28C28', DEV = '#2FB57C', VPN = '#7A5CD6', JUNK = '#B4553A', BRASS = '#C9A24A', INK = '#1B2A3D', RED = '#E04F4F', GREY = '#9AA6BC';
  var ROOF = -52, VOID_B = 34, CEIL = 42, WALL = 252, FLOOR_B = 590, SOIL = 604, HZ = 150;
  var FIL = { x: 262, y: 212, w: 50, h: 228 }, MAN = { x: 320, y: 116, w: 80, h: 168 }, RT = { x: 404, y: -124, w: 74, h: 58 }, LOG = { x: 412, y: 98, w: 54, h: 92 }, CLK = { x: 287, y: 80, r: 12 }, STOOL = { x: 396, y: 440, w: 52 }, GAUGE = { x: 368, y: 298 };
  var BIN = { x: 214, y: 300, w: 34, h: 40 }, PART1 = 476, PART2 = 870, WIN = { x: 530, y: 70, w: 240, h: 116 }, PRN = { x: 486, y: 372, w: 40 }, DESK = { x: 610, y: 392, w: 150 }, MON = { x: 698, y: 346, w: 46, h: 36 };
  var SOFA = { x: 890, y: 384, w: 112 }, GSIGN = { x: 884, y: 112, w: 108, h: 36 }, APS = [[560, STAFF], [770, STAFF], [945, GUEST]], HOME = { x: 150, y: 386, w: 80 }, VALVE = { x: 238, y: 456 };
  var TANK = { x: 176, y: -112, w: 72, h: 70 }, BTANK = { x: 136, y: -88, w: 38, h: 48 }, PIT = { x: 952, w: 44 };
  var P_MAIN = [[212, -42], [212, 640], [238, 640], [238, 418], [FIL.x, 418]], P_BACK = [[155, -40], [155, 664], [238, 664], [238, 640]];
  var P_VPN = [[190, 472], [190, 700], [282, 700], [282, 470]], P_FM = [[287, FIL.y], [287, 168], [MAN.x, 168]];
  var P_STAFF = [[332, MAN.y], [332, -22], [1300, -22]], P_DEV = [[358, MAN.y], [358, -6], [506, -6], [506, PRN.y]], P_GUEST = [[384, MAN.y], [384, 10], [945, 10], [945, CEIL]];
  var P_STUB = [[466, 10], [466, -30]], P_TANK = [[441, RT.y + RT.h], [441, -22]];
  function setU(g, sx, sy, k) { g.translate(sx, sy); g.scale(k, k); }
  function extOf(W, H, k, sx, sy) { return { l: -(sx + 24) / k, r: (W - sx) / k, t: -(sy + 24) / k, b: (H - sy) / k }; }
  function tone(c, k) { return K.tone(c, k == null ? 0.22 : k); }
  function path(g, pts) { g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (var i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]); }
  function pipe(g, pts, w, col) {
    g.lineJoin = 'round'; g.lineCap = 'butt';
    g.strokeStyle = tone(col, 0.3); g.lineWidth = w + 2.4; path(g, pts); g.stroke();
    g.strokeStyle = col; g.lineWidth = w; path(g, pts); g.stroke();
    g.strokeStyle = 'rgba(255,255,255,.32)'; g.lineWidth = w * 0.26; path(g, pts); g.stroke();
    for (var i = 1; i < pts.length - 1; i++) fillRR(g, pts[i][0] - w * 0.85, pts[i][1] - w * 0.85, w * 1.7, w * 1.7, w * 0.45, tone(col, 0.12));
  }
  function flow(g, pts, w, col, t, spd) { g.save(); g.setLineDash([w * 0.7, w * 1.9]); g.lineDashOffset = -t * spd; g.strokeStyle = col; g.lineWidth = w * 0.34; g.lineCap = 'round'; g.lineJoin = 'round'; path(g, pts); g.stroke(); g.restore(); }
  function lens(pts) { var L = [0]; for (var i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); return L; }
  function along(pts, L, u) { var d = clamp(u, 0, 1) * L[L.length - 1]; for (var i = 1; i < pts.length; i++) if (d <= L[i]) { var f = (d - L[i - 1]) / Math.max(0.001, L[i] - L[i - 1]); return [lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f)]; } return pts[pts.length - 1]; }
  var P_FILE = [[441, RT.y + RT.h - 6], [441, -22], [560, -22], [560, CEIL + 8]], L_FILE = lens(P_FILE), L_MAIN = lens(P_MAIN), L_VPN = lens(P_VPN);
  var P_GSTUB = [[384, 10], [466, 10], [466, -26]], L_STUB = lens(P_GSTUB);
  function lock(g, x, y, s, col) { g.save(); g.translate(x, y); g.scale(s, s); g.strokeStyle = col || '#FFFFFF'; g.lineWidth = 1.8; g.beginPath(); g.arc(0, -3, 3.4, Math.PI, 0); g.stroke(); fillRR(g, -5, -3, 10, 8, 2, col || '#FFFFFF'); g.restore(); }

  /* ---------------- the people ---------------- */
  var W = CR.who;
  var ENG = W({ x: 422, y: STOOL.y, s: 0.46, ph: 0.4, skin: 2, hair: 0, style: 'short', outfit: 'polo', top: AQUA, top2: '#FFFFFF', hands: [[-70, -170], [70, -170]], look: -0.4 });
  var MGR = W({ x: 560, y: F, s: 0.46, ph: 1.2, skin: 0, hair: 1, style: 'bun', outfit: 'cardigan', top: VPN, top2: '#FFFFFF', id: GREY, hands: [[-60, -230], [60, -230]], look: 0.2 });
  var STF = W({ x: 652, y: F, s: 0.46, ph: 2.1, skin: 3, hair: 2, style: 'short', outfit: 'shirt', top: STAFF, glasses: true, id: GREY, sit: true, chairCol: INK, hands: [[60, -206], [130, -206]], look: 0.6 });
  var SRV = W({ x: 806, y: F, s: 0.46, ph: 2.9, skin: 1, hair: 1, style: 'pony', outfit: 'polo', top: DEV, top2: '#FFFFFF', clip: GUEST, hands: [[-70, -170], [80, -330]], look: -0.3 });
  var GST = W({ x: 945, y: F, s: 0.46, ph: 3.6, skin: 1, hair: 3, style: 'long', outfit: 'shirt', top: GUEST, id: GREY, sit: true, chair: false, hands: [[-30, -236], [40, -246]], look: -0.4 });
  var CREW = [
    { x0: 530, x1: 840, y: 446, spd: 12, ph: 0.35, label: 'TechNext cabling technician', lines: ['Every cable run tidy, **every port labelled**.', 'Cabling and racks installed tidily, never in a tangle.'], acts: ['wave', 'nod', 'id'],
      P: W({ s: 0.42, skin: 4, hair: 0, style: 'short', outfit: 'polo', top: BRASS }), reel: true },
    { x0: -980, x1: 112, y: 492, spd: 15, ph: 0.2, label: 'TechNext site surveyor', lines: ['First the **site survey**: rooms, people, devices.', 'And what works badly today, written down.'], acts: ['wave', 'nod', 'id'],
      P: W({ s: 0.52, skin: 0, hair: 1, style: 'long', outfit: 'cardigan', top: '#14A38B', top2: '#FFFFFF', hold: 'clipboard' }) },
    { x0: 1090, x1: 1290, y: 492, spd: 14, ph: 0.6, label: 'TechNext installer', lines: ['A new **access point**, placed where people sit.', 'Equipment list first, then a **fixed scope** before ordering.'], acts: ['cheer', 'id', 'wave'],
      P: W({ s: 0.52, skin: 2, hair: 0, style: 'short', outfit: 'shirt', top: STAFF, hold: 'box' }) },
    { front: true, x0: 1100, x1: 1220, y: 572, spd: 17, ph: 0.25, label: 'TechNext support engineer', lines: ['Changes, troubleshooting, regular checks: **documentation kept current**.', 'Network settings **backed up**, admin access shared with you.'], acts: ['nod', 'id', 'wave'],
      P: W({ s: 0.56, skin: 3, hair: 1, style: 'bob', outfit: 'polo', top: VPN, hold: 'tablet' }) }
  ];
  CREW[0].P.fixS = true;
  function handAt(P, side) {
    var F3 = K.F3, d = side ? 1 : -1, h = P.hands[side], sxk = P.sx == null ? 1 : P.sx, bw = P.build || 1;
    var r = K.ik(d * F3.shx * bw, F3.shy, h[0], h[1], F3.a, F3.b, d).h, dy = -(P.hop || 0) + (P.sit ? (P.sitDrop != null ? P.sitDrop : 46) : 0);
    return [P.x + r[0] * P.s * sxk, P.y + (r[1] + dy) * P.s];
  }
  function rel(P, x, y) { var dy = P.sit ? (P.sitDrop != null ? P.sitDrop : 46) : 0; return [(x - P.x) / P.s, (y - P.y) / P.s - dy]; }

  /* ---------------- the static layers ---------------- */
  function paintBg(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    var sg = g.createLinearGradient(0, e.t, 0, HZ); sg.addColorStop(0, '#62BDF0'); sg.addColorStop(0.6, '#AEDFF8'); sg.addColorStop(1, '#E4F5FD'); g.fillStyle = sg; g.fillRect(e.l, e.t, e.r - e.l, HZ + 10 - e.t);
    var gl = g.createRadialGradient(-120, -250, 10, -120, -250, 440); gl.addColorStop(0, 'rgba(255,247,210,.95)'); gl.addColorStop(0.3, 'rgba(255,240,190,.32)'); gl.addColorStop(1, 'rgba(255,240,190,0)'); g.fillStyle = gl; g.fillRect(e.l, e.t, e.r - e.l, 600);
    fillE(g, -120, -250, 28, 28, '#FFF4C9');
    /* the far city: hazy towers on the horizon, a few taller ones peeking over the roof */
    for (var i = 0; i < 90; i++) { var x = e.l + i * 34 + hash(i) * 14; if (x > e.r) break; var h = 40 + hash(i * 3.3) * 90 + (hash(i * 7.1) > 0.82 ? 120 : 0), w = 18 + hash(i + 5) * 16;
      g.fillStyle = i % 3 ? 'rgba(150,185,220,.55)' : 'rgba(170,200,230,.6)'; g.fillRect(x, HZ - h, w, h); g.fillStyle = 'rgba(255,255,255,.35)'; for (var wy = HZ - h + 6; wy < HZ - 4; wy += 9) for (var wx = x + 3; wx < x + w - 3; wx += 6) if (hash(wx * 0.3 + wy) > 0.55) g.fillRect(wx, wy, 2.4, 3); }
    /* the far ground: a park, hazy trees */
    g.fillStyle = '#CFEAD8'; g.fillRect(e.l, HZ, e.r - e.l, e.b - HZ);
    for (var tx = Math.floor(e.l / 38) * 38; tx < e.r; tx += 38) { var hs = hash(tx * 0.21); fillE(g, tx, HZ + 4 - hs * 6, 16 + hs * 8, 14 + hs * 6, hs > 0.5 ? '#A9DDB5' : '#9AD3A8'); }
    g.fillStyle = '#DDEFE3'; g.fillRect(e.l, HZ + 18, e.r - e.l, 60); g.fillStyle = '#C3D9CB'; g.fillRect(e.l, HZ + 78, e.r - e.l, e.b);
    g.restore();
  }
  function paintFrame(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    /* outside: a green hill behind the towers, the street verge and the pavement */
    g.fillStyle = '#B8E2A8'; g.beginPath(); g.moveTo(e.l, 330); for (var hx = e.l; hx <= WALL + 10; hx += 16) g.lineTo(hx, 300 - 40 * Math.sin((hx + 300) * 0.006) - 14 * Math.sin(hx * 0.02)); g.lineTo(WALL + 10, F); g.lineTo(e.l, F); g.closePath(); g.fill();
    g.fillStyle = '#A6D894'; g.fillRect(e.l, F - 50, WALL + 10 - e.l, 50);
    /* the building: roof slab, the ceiling void, the ceiling, the back walls round the window */
    var R = e.r + 10; g.fillStyle = '#DCE4EE'; g.fillRect(WALL, ROOF, R - WALL, VOID_B - ROOF);
    g.strokeStyle = 'rgba(120,140,170,.18)'; g.lineWidth = 1; g.beginPath(); for (var vx = WALL; vx < R; vx += 40) { g.moveTo(vx, ROOF + 14); g.lineTo(vx, VOID_B); } g.stroke();
    fillRR(g, WALL - 8, ROOF - 10, R - WALL + 8, 16, 3, '#AEB9C9'); g.fillStyle = '#C9D2DE'; g.fillRect(WALL - 8, ROOF + 4, R - WALL + 8, 6);
    g.fillStyle = '#FFFFFF'; g.fillRect(WALL, VOID_B, R - WALL, CEIL - VOID_B); g.strokeStyle = 'rgba(120,140,170,.25)'; g.beginPath(); for (var cx = WALL; cx < R; cx += 30) { g.moveTo(cx, VOID_B); g.lineTo(cx, CEIL); } g.stroke();
    function wall(x0, x1, c0, c1) { var wg = g.createLinearGradient(0, CEIL, 0, F); wg.addColorStop(0, c0); wg.addColorStop(1, c1); g.fillStyle = wg; g.fillRect(x0, CEIL, x1 - x0, F - CEIL); }
    wall(WALL, PART1, '#E1E9F2', '#D4DFEA'); wall(PART1, PART2, '#EEF3F8', '#E2EAF2'); wall(PART2, R, '#F8F0E6', '#EFE3D4');
    g.fillStyle = 'rgba(120,140,170,.08)'; for (var ty = CEIL + 20; ty < F; ty += 24) for (var tx2 = WALL + ((ty / 24) % 2) * 12; tx2 < PART1; tx2 += 24) g.fillRect(tx2, ty, 22, 1.2);
    g.clearRect(WIN.x, WIN.y, WIN.w, WIN.h);
    g.fillStyle = 'rgba(30,60,100,.06)'; g.fillRect(PART2, CEIL, R - PART2, 40);
    /* the floors: office tiles, the lounge rug, outside the verge; the cut slab; the soil with pebbles */
    var fg = g.createLinearGradient(0, F, 0, FLOOR_B); fg.addColorStop(0, '#E3EAF2'); fg.addColorStop(1, '#D3DCE7'); g.fillStyle = fg; g.fillRect(WALL, F, R - WALL, FLOOR_B - F);
    g.strokeStyle = 'rgba(255,255,255,.8)'; g.lineWidth = 1.6; g.beginPath(); for (var d = 1; d < 6; d++) { var yy = F + Math.pow(d / 6, 1.4) * (FLOOR_B - F); g.moveTo(WALL, yy); g.lineTo(R, yy); }
    for (var fx = WALL; fx < R; fx += 46) { g.moveTo(fx, F); g.lineTo(fx + (fx - 640) * 0.18, FLOOR_B); } g.stroke();
    fillE(g, 950, F + 40, 90, 22, 'rgba(242,140,40,.16)'); g.strokeStyle = 'rgba(242,140,40,.3)'; g.lineWidth = 2; g.beginPath(); g.ellipse(950, F + 40, 80, 18, 0, 0, Math.PI * 2); g.stroke();
    g.fillStyle = '#C9D3DE'; g.fillRect(e.l, F, WALL - e.l, 14); g.fillStyle = '#E6EBF1'; g.fillRect(e.l, F + 14, WALL - e.l, FLOOR_B - F - 14); g.strokeStyle = 'rgba(150,165,190,.4)'; g.lineWidth = 1.4; g.beginPath(); for (var px = Math.floor(e.l / 40) * 40; px < WALL; px += 40) { g.moveTo(px, F + 14); g.lineTo(px - 10, FLOOR_B); } g.stroke();
    var fsh = g.createLinearGradient(0, F - 8, 0, F + 24); fsh.addColorStop(0, 'rgba(40,60,100,0)'); fsh.addColorStop(0.3, 'rgba(40,60,100,.08)'); fsh.addColorStop(1, 'rgba(40,60,100,0)'); g.fillStyle = fsh; g.fillRect(e.l, F - 8, R - e.l, 32);
    g.fillStyle = '#B9C3D1'; g.fillRect(e.l, FLOOR_B, R - e.l, SOIL - FLOOR_B); g.fillStyle = 'rgba(255,255,255,.4)'; g.fillRect(e.l, FLOOR_B, R - e.l, 2); g.fillStyle = '#8A96A8'; for (var rb = Math.floor(e.l / 18) * 18; rb < R; rb += 18) fillE(g, rb, FLOOR_B + 7, 2, 2, '#8A96A8');
    var sg = g.createLinearGradient(0, SOIL, 0, e.b); sg.addColorStop(0, '#D9B98F'); sg.addColorStop(0.5, '#CDA77A'); sg.addColorStop(1, '#BF9668'); g.fillStyle = sg; g.fillRect(e.l, SOIL, R - e.l, e.b - SOIL);
    for (var pb = 0; pb < 260; pb++) { var bx = e.l + hash(pb * 1.7) * (R - e.l), by = SOIL + 6 + hash(pb * 3.9) * (e.b - SOIL); fillE(g, bx, by, 2 + hash(pb) * 3, 1.6 + hash(pb * 2.3) * 2, pb % 3 ? 'rgba(150,110,70,.35)' : 'rgba(255,240,220,.35)'); }
    g.fillStyle = 'rgba(120,85,50,.18)'; g.fillRect(e.l, SOIL, R - e.l, 4);
    /* roots under the hill */
    g.strokeStyle = 'rgba(120,85,50,.35)'; g.lineWidth = 2; g.lineCap = 'round'; for (var ro = 0; ro < 7; ro++) { var rx0 = e.l + 40 + ro * ((WALL - e.l) / 7); g.beginPath(); g.moveTo(rx0, SOIL); g.quadraticCurveTo(rx0 + 12, SOIL + 26, rx0 - 6, SOIL + 46 + (ro % 3) * 10); g.stroke(); }
    /* under the office: the cable duct carrying the three networks, clamped every few metres */
    var dx0 = FIL.x + FIL.w + 4, dy = 654; fillRR(g, dx0, dy - 11, R - dx0, 22, 11, '#AEB9C9'); fillRR(g, dx0 + 4, dy - 8, R - dx0, 4, 2, 'rgba(255,255,255,.45)');
    [STAFF, DEV, GUEST].forEach(function (c, i) { g.fillStyle = c; g.fillRect(dx0 + 6, dy - 3 + i * 4, R - dx0, 2.4); });
    for (var dc = dx0 + 70; dc < R; dc += 130) { fillRR(g, dc, dy - 14, 9, 28, 3, '#7A869C'); fillRR(g, dc - 2, dy + 14, 13, 30, 2, 'rgba(120,85,50,.25)'); }
    for (var dl = dx0 + 150; dl < R; dl += 520) { fillRR(g, dl, dy + 16, 132, 14, 7, '#FFFFFF'); text(g, 'CABLE DUCT · staff · devices · guest', dl + 66, dy + 25.6, 6.2, 800, INK, 'center'); }
    /* deeper down: the storm drain, junction boxes on the duct, stones */
    var dr = 724; fillRR(g, e.l, dr - 9, R - e.l, 18, 9, '#C9D3DE'); fillRR(g, e.l, dr - 6, R - e.l, 4, 2, 'rgba(255,255,255,.5)'); for (var dj = Math.floor(e.l / 160) * 160; dj < R; dj += 160) fillRR(g, dj, dr - 11, 10, 22, 3, '#AEB9C9');
    for (var jb = dx0 + 240; jb < R; jb += 390) { fillRR(g, jb, dy - 22, 34, 30, 4, '#5C6B8A'); fillRR(g, jb + 4, dy - 18, 26, 9, 2, '#FFFFFF'); text(g, 'J' + (1 + Math.round((jb - dx0) / 390)), jb + 17, dy - 11, 6.4, 800, INK, 'center'); [STAFF, DEV, GUEST].forEach(function (c, i) { fillE(g, jb + 9 + i * 8, dy + 1, 2.4, 2.4, c); }); }
    for (var st = 0; st < 40; st++) { var sx2 = e.l + hash(st * 5.7) * (R - e.l), sy2 = 690 + hash(st * 2.1) * 60; fillE(g, sx2, sy2, 7 + hash(st) * 6, 4 + hash(st * 3) * 3, 'rgba(160,120,80,.35)'); fillE(g, sx2 - 2, sy2 - 1.5, 3, 1.4, 'rgba(255,240,220,.4)'); }
    /* the service pit: the open hatch in the floor, the shaft and its ladder */
    var P0 = PIT; fillE(g, P0.x + P0.w / 2, F + 34, P0.w / 2 + 6, 9, '#5C6B8A'); fillE(g, P0.x + P0.w / 2, F + 34, P0.w / 2, 7, '#2A3550');
    g.save(); g.translate(P0.x + P0.w + 8, F + 30); g.rotate(-0.5); fillE(g, 0, 0, 6, P0.w / 2 + 4, '#7A869C'); fillE(g, -1, 0, 4, P0.w / 2, '#9AA6BC'); g.restore();
    fillRR(g, P0.x, FLOOR_B, P0.w, e.b - FLOOR_B, 2, '#8E99AA'); fillRR(g, P0.x + 5, FLOOR_B, P0.w - 10, e.b - FLOOR_B, 2, '#6E7A8E');
    g.strokeStyle = BRASS; g.lineWidth = 2.4; g.beginPath(); g.moveTo(P0.x + 12, FLOOR_B); g.lineTo(P0.x + 12, e.b); g.moveTo(P0.x + P0.w - 12, FLOOR_B); g.lineTo(P0.x + P0.w - 12, e.b); for (var lr = FLOOR_B + 10; lr < e.b; lr += 14) { g.moveTo(P0.x + 12, lr); g.lineTo(P0.x + P0.w - 12, lr); } g.stroke();
    fillRR(g, P0.x - 8, FLOOR_B + 26, P0.w + 16, 14, 7, '#FFFFFF'); text(g, 'SERVICE PIT', P0.x + P0.w / 2, FLOOR_B + 35.6, 6.4, 800, INK, 'center');
    g.restore();
  }
  function tower(g, T, legs, col, label, sub) { /* a water tower: legs with cross braces, the tank, its roof and a label */
    g.strokeStyle = '#8A96A8'; g.lineWidth = 3; g.beginPath(); legs.forEach(function (x) { g.moveTo(x, T.y + T.h - 4); g.lineTo(x + (x < T.x + T.w / 2 ? -8 : 8), F); }); g.stroke();
    g.lineWidth = 1.4; g.strokeStyle = 'rgba(138,150,168,.8)'; g.beginPath(); for (var by = T.y + T.h + 20; by < F - 20; by += 58) { g.moveTo(legs[0] - 2, by); g.lineTo(legs[1] + 2, by + 58); g.moveTo(legs[1] + 2, by); g.lineTo(legs[0] - 2, by + 58); } g.stroke();
    soft(g, T.x + T.w / 2, F + 2, T.w * 0.6, 6, 0.22);
    shadowed(g, 10, 4, 0.18, function () { fillRR(g, T.x, T.y, T.w, T.h, 10, col); }); g.fillStyle = 'rgba(255,255,255,.22)'; g.fillRect(T.x + 8, T.y + 4, 8, T.h - 8);
    g.fillStyle = 'rgba(0,0,0,.08)'; [0.33, 0.66].forEach(function (f) { g.fillRect(T.x, T.y + T.h * f, T.w, 3); });
    g.fillStyle = tone(col, 0.2); g.beginPath(); g.moveTo(T.x - 6, T.y + 2); g.lineTo(T.x + T.w / 2, T.y - T.h * 0.36); g.lineTo(T.x + T.w + 6, T.y + 2); g.closePath(); g.fill();
    if (label) { fillRR(g, T.x + 14, T.y + T.h * 0.38, T.w - 28, 22, 6, '#FFFFFF'); text(g, label, T.x + T.w / 2, T.y + T.h * 0.38 + 10, 8.6, 800, AQUA_D, 'center'); text(g, sub, T.x + T.w / 2, T.y + T.h * 0.38 + 18.6, 5.8, 800, '#5C6B7A', 'center'); }
  }
  function cottage(g) { /* the home office: a small house, its window (the remote colleague is drawn live), a HOME plaque */
    var H = HOME, top = H.y + 30; soft(g, H.x + H.w / 2, F + 2, H.w * 0.7, 6, 0.22);
    fillRR(g, H.x, top, H.w, F - top, 4, '#FFF4E3'); g.fillStyle = 'rgba(160,120,80,.12)'; for (var b = 0; b < 6; b++) g.fillRect(H.x, top + 8 + b * 14, H.w, 1.4);
    g.fillStyle = '#E2725A'; g.beginPath(); g.moveTo(H.x - 10, top + 2); g.lineTo(H.x + H.w / 2, H.y - 8); g.lineTo(H.x + H.w + 10, top + 2); g.closePath(); g.fill(); g.fillStyle = 'rgba(255,255,255,.18)'; g.beginPath(); g.moveTo(H.x - 2, top); g.lineTo(H.x + H.w / 2, H.y - 2); g.lineTo(H.x + H.w / 2, H.y + 6); g.lineTo(H.x + 8, top); g.closePath(); g.fill();
    fillRR(g, H.x + 54, H.y - 2, 12, 20, 2, '#C9644E'); fillRR(g, H.x + 8, top + 12, 46, 36, 4, '#FFFFFF'); fillRR(g, H.x + 11, top + 15, 40, 30, 3, '#CFE8F7');
    fillRR(g, H.x + 58, top + 24, 18, F - top - 24, 3, '#C98E55'); fillE(g, H.x + 72, top + 52, 1.8, 1.8, BRASS);
    fillRR(g, H.x + 14, top + 52, 34, 10, 3, VPN); text(g, 'HOME', H.x + 31, top + 59.4, 6.6, 800, '#FFFFFF', 'center');
  }
  function valveWheel(g, x, y, r, col) { g.strokeStyle = col; g.lineWidth = 2.4; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.stroke(); g.lineWidth = 1.6; g.beginPath(); for (var a = 0; a < 3; a++) { var an = a * Math.PI / 3; g.moveTo(x + Math.cos(an) * r, y + Math.sin(an) * r); g.lineTo(x - Math.cos(an) * r, y - Math.sin(an) * r); } g.stroke(); fillE(g, x, y, r * 0.3, r * 0.3, tone(col, 0.2)); }
  function paintBack(g, ext) {
    /* the left margin: the internet provider's reservoir, a hydrant, a lamp post (wide screens) */
    if (ext.l < -300) {
      var rx = -760; soft(g, rx + 110, F + 2, 140, 8, 0.24); fillRR(g, rx, 300, 220, F - 300, 16, '#E3EEF6'); fillRR(g, rx, 300, 220, 26, 12, AQUA); g.fillStyle = 'rgba(28,154,214,.12)'; for (var rb = 0; rb < 5; rb++) g.fillRect(rx, 340 + rb * 26, 220, 3);
      fillRR(g, rx + 30, 350, 160, 44, 10, '#FFFFFF'); text(g, 'INTERNET PROVIDER', rx + 110, 370, 11, 800, AQUA_D, 'center'); text(g, 'the city supply', rx + 110, 384, 8, 700, '#5C6B7A', 'center');
      fillRR(g, rx + 196, 420, 10, 50, 3, '#5C6B8A'); valveWheel(g, rx + 201, 418, 9, RED);
      var hy = -360; soft(g, hy, F + 2, 18, 3, 0.25); fillRR(g, hy - 9, F - 40, 18, 40, 6, RED); fillRR(g, hy - 12, F - 44, 24, 8, 4, '#C0383A'); fillRR(g, hy - 15, F - 28, 30, 8, 4, '#C0383A'); fillE(g, hy, F - 46, 5, 4, '#C0383A');
    }
    streetBack(g, ext);
    /* the towers: the main line and its backup */
    tower(g, BTANK, [BTANK.x + 6, BTANK.x + BTANK.w - 6], '#4FB3E3', null);
    fillRR(g, BTANK.x + 4, BTANK.y + 14, BTANK.w - 8, 16, 4, '#FFFFFF'); text(g, 'BACKUP', BTANK.x + BTANK.w / 2, BTANK.y + 25, 6.8, 800, AQUA_D, 'center');
    tower(g, TANK, [TANK.x + 10, TANK.x + TANK.w - 10], AQUA, 'INTERNET', 'main line');
    /* pipes: backup, main, the VPN (sealed: a violet pipe with a white stripe and locks), filter to manifold */
    pipe(g, P_BACK, 7, '#4FB3E3'); pipe(g, P_MAIN, 10, AQUA);
    pipe(g, P_VPN, 10, VPN); g.save(); g.setLineDash([3, 5]); g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = 2; path(g, P_VPN); g.stroke(); g.restore();
    [[190, 560], [236, 700], [282, 560]].forEach(function (p) { fillE(g, p[0], p[1], 8, 8, '#FFFFFF'); lock(g, p[0], p[1] + 1, 0.8, VPN); });
    cottage(g);
    /* the big red valve on the main riser */
    fillRR(g, VALVE.x - 9, VALVE.y - 6, 18, 12, 3, '#5C6B8A');
    /* the TURNED AWAY bin on its bracket, the chute from the filter */
    fillRR(g, BIN.x + BIN.w - 4, BIN.y + 6, WALL - BIN.x - BIN.w + 8, 8, 3, '#8A96A8'); g.fillStyle = '#7A869C'; g.beginPath(); g.moveTo(WALL + 22, BIN.y - 4); g.lineTo(BIN.x + BIN.w, BIN.y + 4); g.lineTo(BIN.x + BIN.w, BIN.y + 14); g.lineTo(WALL + 22, BIN.y + 6); g.closePath(); g.fill();
    shadowed(g, 6, 2, 0.18, function () { g.fillStyle = RED; g.beginPath(); g.moveTo(BIN.x, BIN.y); g.lineTo(BIN.x + BIN.w, BIN.y); g.lineTo(BIN.x + BIN.w - 4, BIN.y + BIN.h); g.lineTo(BIN.x + 4, BIN.y + BIN.h); g.closePath(); g.fill(); });
    fillRR(g, BIN.x - 2, BIN.y - 3, BIN.w + 4, 6, 3, '#C0383A'); text(g, 'TURNED', BIN.x + BIN.w / 2, BIN.y + 14, 5.6, 800, '#FFFFFF', 'center'); text(g, 'AWAY', BIN.x + BIN.w / 2, BIN.y + 21, 5.6, 800, '#FFFFFF', 'center');
    /* the building's left wall, cut (the inlets pass through it) */
    fillRR(g, WALL - 6, ROOF, 14, F - ROOF, 2, '#C9D3DE'); g.fillStyle = 'rgba(255,255,255,.5)'; g.fillRect(WALL - 5, ROOF, 3, F - ROOF); g.fillStyle = '#AEB9C9'; for (var wb = ROOF + 10; wb < F; wb += 22) g.fillRect(WALL - 6, wb, 14, 2);
    /* the rooftop: parapet planters, the sign, a vent, the flag */
    if (ext.r > 0) { [[300, 28], [540, 22], [1040, 30]].forEach(function (p) { fillRR(g, p[0] - p[1], ROOF - 22, p[1] * 2, 14, 4, '#C99A6B'); for (var lf = 0; lf < 5; lf++) fillE(g, p[0] - p[1] + 6 + lf * (p[1] * 2 - 12) / 4, ROOF - 26 - (lf % 2) * 5, 8, 7, lf % 2 ? '#5CC28A' : '#43B377'); }); }
    [620, 720].forEach(function (x) { fillRR(g, x - 2, ROOF - 30, 4, 22, 1, '#8A96A8'); }); shadowed(g, 6, 2, 0.16, function () { fillRR(g, 596, ROOF - 46, 148, 22, 6, '#FFFFFF'); });
    CO.plane(g, 612, ROOF - 35, 0.7, 0, STAFF); text(g, 'YOUR OFFICE', 682, ROOF - 30.6, 10, 800, INK, 'center'); fillRR(g, 790, ROOF - 24, 30, 16, 3, '#B9C3D1'); fillRR(g, 794, ROOF - 30, 22, 8, 3, '#C9D3DE');
    /* the file server: the office's own tank on the roof, a blue pipe down to the staff line; the guest stub ends at a locked cap */
    [RT.x + 8, RT.x + RT.w - 8].forEach(function (x) { fillRR(g, x - 2.5, RT.y + RT.h - 4, 5, ROOF - RT.y - RT.h + 4, 2, '#8A96A8'); }); soft(g, RT.x + RT.w / 2, ROOF - 2, 46, 4, 0.2);
    shadowed(g, 10, 4, 0.2, function () { fillRR(g, RT.x, RT.y, RT.w, RT.h, 12, '#FFFFFF'); }); g.fillStyle = 'rgba(49,103,202,.08)'; g.fillRect(RT.x + 4, RT.y + 6, 8, RT.h - 12); fillRR(g, RT.x, RT.y, RT.w, 12, 8, STAFF); g.fillRect(RT.x, RT.y + 6, RT.w, 6);
    text(g, 'FILE SERVER', RT.x + RT.w / 2, RT.y + 25, 7.4, 800, STAFF, 'center'); text(g, 'shared drives', RT.x + RT.w / 2, RT.y + 34, 5.6, 800, '#5C6B7A', 'center');
    fillRR(g, RT.x + RT.w - 14, RT.y + 16, 7, RT.h - 22, 3.5, '#E3EEF6');
    /* pipes in the ceiling void: staff blue, devices green, guest orange; brackets and labels */
    pipe(g, P_STAFF.map(function (p) { return [Math.min(p[0], ext.r + 20), p[1]]; }), 8, STAFF); pipe(g, P_DEV, 7, DEV); pipe(g, P_GUEST, 7, GUEST); pipe(g, P_STUB, 6, GUEST); pipe(g, P_TANK, 7, STAFF);
    fillRR(g, 458, -34, 16, 8, 3, '#D9741A'); fillE(g, 466, -40, 7, 7, RED); lock(g, 466, -39, 0.62, '#FFFFFF');
    for (var bx = 480; bx < Math.min(ext.r, 1300); bx += 90) { fillRR(g, bx - 2, ROOF + 10, 4, 34, 1, '#AEB9C9'); }
    [[620, -22, 'STAFF', STAFF], [680, 10, 'GUEST · internet only', GUEST], [440, -6, 'DEVICES', DEV]].forEach(function (q) { var w = q[2].length * 4.6 + 14; fillRR(g, q[0] - w / 2, q[1] - 6, w, 12, 6, '#FFFFFF'); text(g, q[2], q[0], q[1] + 3, 6.6, 800, q[3], 'center'); });
    /* the staff drops to the access points (and the guest one), the AP heads */
    [[560, -22], [770, -22]].forEach(function (p) { pipe(g, [[p[0], p[1]], [p[0], CEIL]], 6, STAFF); });
    APS.forEach(function (a) { fillRR(g, a[0] - 16, CEIL, 32, 8, 4, '#FFFFFF'); fillE(g, a[0], CEIL + 10, 13, 6, '#F3F6FA'); fillE(g, a[0], CEIL + 12, 5, 3, a[1]); });
    /* the plant room: the clock, the change log, the filter, the switch manifold, the engineer's step stool, a pressure gauge */
    shadowed(g, 6, 2, 0.15, function () { fillRR(g, LOG.x, LOG.y, LOG.w, LOG.h, 4, '#FFFFFF'); }); fillRR(g, LOG.x + 17, LOG.y - 5, 20, 9, 3, '#8A96A8'); text(g, 'CHANGE LOG', LOG.x + LOG.w / 2, LOG.y + 14, 6.4, 800, INK, 'center');
    K.clockFace(g, { x: CLK.x, y: CLK.y, r: CLK.r }, AQUA);
    pipe(g, P_FM, 8, AQUA);
    soft(g, FIL.x + FIL.w / 2, F + 2, 40, 5, 0.25); fillRR(g, FIL.x - 4, F - 30, FIL.w + 8, 30, 4, '#5C6B8A');
    shadowed(g, 10, 3, 0.2, function () { fillRR(g, FIL.x, FIL.y, FIL.w, FIL.h, 20, '#E8EEF5'); }); fillRR(g, FIL.x, FIL.y, FIL.w, 18, 9, RED); text(g, 'FIREWALL', FIL.x + FIL.w / 2, FIL.y + 12.4, 6.8, 800, '#FFFFFF', 'center');
    fillRR(g, FIL.x + 6, FIL.y + 26, FIL.w - 12, 150, 8, '#D6ECF8'); g.strokeStyle = '#7A869C'; g.lineWidth = 1; g.beginPath(); for (var mx = FIL.x + 8; mx < FIL.x + FIL.w - 8; mx += 4) { g.moveTo(mx, FIL.y + 84); g.lineTo(mx + 2, FIL.y + 92); } g.stroke(); fillRR(g, FIL.x + 6, FIL.y + 84, FIL.w - 12, 2, 1, '#5C6B8A');
    text(g, 'rules', FIL.x + FIL.w / 2, FIL.y + 196, 6, 800, '#5C6B7A', 'center'); text(g, 'reviewed', FIL.x + FIL.w / 2, FIL.y + 204, 6, 800, '#5C6B7A', 'center');
    shadowed(g, 10, 3, 0.2, function () { fillRR(g, MAN.x, MAN.y, MAN.w, MAN.h, 8, '#2A3550'); }); fillRR(g, MAN.x + 4, MAN.y + 4, MAN.w - 8, 16, 5, '#3A4766'); text(g, 'OFFICE SWITCH', MAN.x + MAN.w / 2, MAN.y + 15, 6.6, 800, '#FFFFFF', 'center');
    [[STAFF, 'STAFF'], [DEV, 'DEVICES'], [GUEST, 'GUEST']].forEach(function (row, r) { var y = MAN.y + 36 + r * 42; text(g, row[1], MAN.x + 8, y - 6, 5.2, 800, '#AEB9D4');
      for (var c = 0; c < 4; c++) { var x = MAN.x + 14 + c * 18; g.fillStyle = row[0]; g.fillRect(x - 2, y, 4, 16); valveWheel(g, x, y + 4, 6, row[0]); fillRR(g, x - 8, y + 14, 16, 8, 2, '#FFFFFF'); text(g, 'P' + (r * 4 + c + 1 < 10 ? '0' : '') + (r * 4 + c + 1), x, y + 20, 4.8, 800, INK, 'center'); } });
    fillRR(g, MAN.x + 6, MAN.y + MAN.h - 18, MAN.w - 12, 12, 4, '#3A4766'); text(g, '12 ports · all labelled', MAN.x + MAN.w / 2, MAN.y + MAN.h - 9.6, 5, 800, '#AEB9D4', 'center');
    fillRR(g, GAUGE.x - 2, MAN.y + MAN.h, 4, GAUGE.y - MAN.y - MAN.h - 6, 1, '#8A96A8'); fillE(g, GAUGE.x, GAUGE.y, 9, 9, '#FFFFFF'); g.strokeStyle = '#5C6B8A'; g.lineWidth = 2; g.beginPath(); g.arc(GAUGE.x, GAUGE.y, 9, 0, 7); g.stroke(); g.fillStyle = 'rgba(47,181,124,.35)'; g.beginPath(); g.moveTo(GAUGE.x, GAUGE.y); g.arc(GAUGE.x, GAUGE.y, 7, -2.4, -1.2); g.closePath(); g.fill();
    var S0 = STOOL; soft(g, S0.x + S0.w / 2, F + 2, 34, 4, 0.25); fillRR(g, S0.x, S0.y, S0.w, 7, 3, BRASS); fillRR(g, S0.x + 4, S0.y + 16, S0.w - 8, 6, 3, BRASS); g.strokeStyle = '#8A6A3A'; g.lineWidth = 3; g.beginPath(); g.moveTo(S0.x + 6, S0.y + 6); g.lineTo(S0.x + 2, F); g.moveTo(S0.x + S0.w - 6, S0.y + 6); g.lineTo(S0.x + S0.w - 2, F); g.stroke();
    /* the plant-room partition (glass), the office window with its mullions, the printer cabinet */
    g.fillStyle = 'rgba(200,225,245,.35)'; g.fillRect(PART1, CEIL, 8, F - CEIL); fillRR(g, PART1, CEIL, 3, F - CEIL, 1, '#B9C3D1'); fillRR(g, PART1 + 6, CEIL, 3, F - CEIL, 1, '#B9C3D1');
    fillRR(g, WIN.x - 8, WIN.y - 8, WIN.w + 16, WIN.h + 16, 6, '#FFFFFF'); g.clearRect(WIN.x, WIN.y, WIN.w, WIN.h);
    g.fillStyle = 'rgba(255,255,255,.22)'; g.beginPath(); g.moveTo(WIN.x + 30, WIN.y + WIN.h); g.lineTo(WIN.x + 110, WIN.y); g.lineTo(WIN.x + 150, WIN.y); g.lineTo(WIN.x + 70, WIN.y + WIN.h); g.closePath(); g.fill();
    g.fillStyle = '#FFFFFF'; [WIN.x + WIN.w / 3, WIN.x + WIN.w * 2 / 3].forEach(function (x) { g.fillRect(x - 3, WIN.y, 6, WIN.h); }); g.fillRect(WIN.x, WIN.y + 64, WIN.w, 5); fillRR(g, WIN.x - 12, WIN.y + WIN.h + 6, WIN.w + 24, 8, 3, '#FFFFFF');
    soft(g, PRN.x + PRN.w / 2, F + 2, 30, 4, 0.22); fillRR(g, PRN.x, PRN.y + 32, PRN.w, F - PRN.y - 32, 4, '#E3EAF2'); fillRR(g, PRN.x + 4, PRN.y + 40, PRN.w - 8, 12, 2, '#D3DCE7');
    fillRR(g, PRN.x + 2, PRN.y, PRN.w - 4, 32, 6, '#FFFFFF'); fillRR(g, PRN.x + 6, PRN.y + 18, PRN.w - 12, 4, 2, '#2A3550'); fillE(g, PRN.x + PRN.w - 9, PRN.y + 8, 2.4, 2.4, DEV); text(g, 'PRINTER', PRN.x + PRN.w / 2, PRN.y + 62, 5.6, 800, '#5C6B7A', 'center');
    /* the lounge: its glass partition, the GUEST sign, a frame, the sofa and a floor lamp */
    g.fillStyle = 'rgba(255,220,180,.25)'; g.fillRect(PART2, CEIL, 8, F - CEIL); fillRR(g, PART2, CEIL, 3, F - CEIL, 1, '#D9C3AA'); fillRR(g, PART2 + 6, CEIL, 3, F - CEIL, 1, '#D9C3AA');
    shadowed(g, 6, 2, 0.15, function () { fillRR(g, GSIGN.x, GSIGN.y, GSIGN.w, GSIGN.h, 8, GUEST); }); text(g, 'GUEST WI-FI', GSIGN.x + GSIGN.w / 2, GSIGN.y + 16, 9.4, 800, '#FFFFFF', 'center'); text(g, 'internet only', GSIGN.x + GSIGN.w / 2, GSIGN.y + 27, 6.6, 800, '#FFE7CF', 'center');
    fillRR(g, 904, 176, 70, 50, 4, '#FFFFFF'); fillRR(g, 908, 180, 62, 42, 2, '#BFE3F2'); g.fillStyle = '#7FC7A0'; g.beginPath(); g.moveTo(908, 222); g.lineTo(930, 196); g.lineTo(946, 210); g.lineTo(958, 200); g.lineTo(970, 222); g.closePath(); g.fill(); fillE(g, 958, 190, 5, 5, '#FFE27A');
    soft(g, SOFA.x + SOFA.w / 2, F + 3, SOFA.w * 0.6, 6, 0.24); fillRR(g, SOFA.x, SOFA.y, SOFA.w, 60, 16, '#F7B267'); fillRR(g, SOFA.x - 8, SOFA.y + 34, 20, 52, 9, '#EFA24F'); fillRR(g, SOFA.x + SOFA.w - 12, SOFA.y + 34, 20, 52, 9, '#EFA24F');
    fillRR(g, SOFA.x + 6, SOFA.y + 48, SOFA.w - 12, 22, 9, '#F9C083'); [SOFA.x + 10, SOFA.x + SOFA.w - 14].forEach(function (x) { fillRR(g, x, F - 8, 5, 8, 2, '#8A5A30'); });
    K.plant(g, { x: PART2 - 8, y: F }, '#7FC7E8', '#A6DBF0'); K.plant(g, { x: SOFA.x + SOFA.w + 18, y: F }, '#F7B267', '#F9C083');
    /* the right margin: reception and the entrance (wide screens) */
    if (ext.r > 1010) { var rx2 = 1040; soft(g, rx2 + 70, F + 3, 100, 7, 0.22); fillRR(g, rx2, 360, 140, F - 360, 8, '#FFFFFF'); fillRR(g, rx2, 360, 140, 14, 7, AQUA); fillRR(g, rx2 + 14, 388, 112, 30, 6, '#EEF6FB'); text(g, 'RECEPTION', rx2 + 70, 401, 9.4, 800, AQUA_D, 'center'); text(g, 'ask for the guest Wi-Fi', rx2 + 70, 412, 6.6, 700, '#5C6B7A', 'center');
      fillRR(g, rx2 + 100, 330, 28, 28, 4, '#2A3550'); fillRR(g, rx2 + 103, 333, 22, 18, 2, '#BFEAF2'); fillRR(g, 1210, 150, 74, F - 150, 4, '#C9D3DE'); fillRR(g, 1216, 156, 62, F - 156, 3, 'rgba(200,230,250,.7)'); fillE(g, 1270, 320, 3, 3, BRASS);
      fillRR(g, 1196, 120, 102, 24, 6, INK); text(g, 'ENTRANCE', 1247, 136, 9, 800, '#FFFFFF', 'center'); }
  }
  function paintFront(g, ext) {
    /* the staff desk (open, so the chair and legs show) with the monitor BESIDE him */
    CO.desk(g, DESK.x, DESK.y, DESK.w, F, { open: true, legs: '#9AA6BC', top: '#D9E6F3' });
    fillRR(g, MON.x - 3, MON.y - 3, MON.w + 6, MON.h + 6, 4, '#2A3550'); fillRR(g, MON.x + MON.w / 2 - 3, MON.y + MON.h + 3, 6, DESK.y - MON.y - MON.h - 3, 2, '#5C6B7A'); fillRR(g, MON.x + MON.w / 2 - 12, DESK.y - 3, 24, 3, 1.5, '#5C6B7A');
    fillRR(g, DESK.x + 58, DESK.y - 4, 40, 4, 2, '#C9D3DE'); fillRR(g, DESK.x + 8, DESK.y - 12, 10, 12, 3, '#FFFFFF'); fillRR(g, DESK.x + 22, DESK.y - 6, 26, 6, 2, '#FFD27A'); /* keyboard, a glass */
    if (ext.r > 1010) { CO.desk(g, 1060, 420, 100, F, { panel: '#F3F6FA', top: '#FFFFFF' }); }
  }
  function paintFore(g, ext) {
    /* foreground floor: a cable reel, AP boxes, a label printer case; the street side: a planter */
    function box(x, y, w, h, c, lab) { soft(g, x + w / 2, y + h + 2, w * 0.6, 4, 0.22); fillRR(g, x, y, w, h, 4, c); fillRR(g, x, y, w, 6, 3, tone(c, 0.14)); g.fillStyle = 'rgba(255,255,255,.5)'; g.fillRect(x + w / 2 - 4, y, 8, h); if (lab) text(g, lab, x + w / 2, y + h - 6, 6, 800, '#FFFFFF', 'center'); }
    if (ext.r > 1060) { box(1110, 548, 44, 34, '#C99A6B', 'AP'); box(1116, 520, 34, 28, '#B5865A', 'AP'); }
    if (ext.l < 180) { var cr = 150; soft(g, cr + 18, 590, 30, 4, 0.25); fillE(g, cr + 18, 562, 24, 24, '#5C6B8A'); fillE(g, cr + 18, 562, 18, 18, STAFF); fillE(g, cr + 18, 562, 7, 7, '#C9D3DE'); g.strokeStyle = STAFF; g.lineWidth = 3; g.beginPath(); g.moveTo(cr + 30, 580); g.quadraticCurveTo(cr + 60, 592, cr + 90, 584); g.stroke(); }
    if (ext.l < -480) { box(-560, 548, 60, 36, '#C99A6B', 'CABLES'); var pl = -860; fillRR(g, pl, 540, 90, 44, 6, '#C99A6B'); for (var lf = 0; lf < 6; lf++) fillE(g, pl + 10 + lf * 14, 536 - (lf % 2) * 8, 11, 10, lf % 2 ? '#5CC28A' : '#43B377'); }
    if (ext.r > 1250) box(1240, 548, 50, 34, '#C99A6B', 'SWITCH');
  }

  /* ---------------- live ---------------- */
  var SURGE = { t: -99 }, PULSE = { t: -99 }, FILES = { t: -99 }, TAP = {}, blocked = 9;
  function paintWindow(g, t, par, S) {
    var e = S.ext;
    for (var c = 0; c < 5; c++) { var sp = 4 + c * 2, span = e.r - e.l + 400, x = e.l - 200 + ((hash(c + 2) * span + t * sp) % span), y = -250 + c * 34 - (c % 2) * 20 + (c === 4 ? 230 : 0); K.cloud(g, x, y, 0.22 + hash(c) * 0.12); }
    g.strokeStyle = 'rgba(40,60,90,.55)'; g.lineWidth = 1.5; g.lineCap = 'round';
    for (var b = 0; b < 5; b++) { var bsp = e.r - e.l + 300, bx = e.r + 100 - ((t * (15 + b * 3) + hash(b + 9) * bsp) % bsp), by = -200 + b * 16 + (b === 4 ? 260 : 0) + Math.sin(t * 0.8 + b) * 6, fl = Math.sin(t * 9 + b * 2) * 4;
      g.beginPath(); g.moveTo(bx - 6, by - fl); g.quadraticCurveTo(bx - 3, by - 3, bx, by); g.quadraticCurveTo(bx + 3, by - 3, bx + 6, by - fl); g.stroke(); }
    /* a plane far off */
    var pspan = e.r - e.l + 600, px = e.l - 300 + ((t * 26) % pspan), py = -170 + Math.sin(t * 0.2) * 6; g.save(); g.translate(px, py); fillRR(g, -14, -2.5, 28, 5, 2.5, '#FFFFFF'); g.fillStyle = '#FFFFFF'; g.beginPath(); g.moveTo(-2, 0); g.lineTo(-8, -9); g.lineTo(-4, -9); g.lineTo(6, 0); g.closePath(); g.fill(); g.fillRect(-14, -6, 3, 4); g.restore();
    g.strokeStyle = 'rgba(255,255,255,.6)'; g.lineWidth = 2; g.beginPath(); g.moveTo(px - 16, py); g.lineTo(px - 90, py + 1); g.stroke();
  }
  function ripples(g, x, col, t, n, strong) { for (var i = 0; i < n; i++) { var u = ((t * 0.55 + i / n) % 1), rx = 14 + u * 110, ry = 6 + u * 64; g.strokeStyle = col; g.globalAlpha = (1 - u) * (strong ? 0.9 : 0.6); g.lineWidth = strong ? 3 : 2.4; g.beginPath(); g.ellipse(x, CEIL + 12, rx, ry, 0, 0.12, Math.PI - 0.12); g.stroke(); } g.globalAlpha = 1; }
  function paintLive(g, t, now, S) {
    var e = S.ext, surge = clamp(1 - (t - SURGE.t) / 2.4, 0, 1), sp = 1 + surge * 3, pulse = t - PULSE.t;
    /* water in the pipes */
    flow(g, P_MAIN, 10, '#BFEAFF', t, 26 * sp); flow(g, P_BACK, 7, '#D9F2FF', t, 10); flow(g, P_FM, 8, '#BFEAFF', t, 26 * sp);
    flow(g, P_STAFF.map(function (p) { return [Math.min(p[0], e.r + 20), p[1]]; }), 8, '#BFD3FF', t, 24 * sp); flow(g, P_DEV, 7, '#C8F2DD', t, 18 * sp); flow(g, P_GUEST, 7, '#FFE0BF', t, 20 * sp); flow(g, P_TANK, 7, '#BFD3FF', t, 18);
    [[560, -22], [770, -22]].forEach(function (p) { flow(g, [[p[0], p[1]], [p[0], CEIL]], 6, '#BFD3FF', t, 20 * sp); });
    /* the pulse from the engineer's wrench: a bright ring runs out along every pipe */
    if (pulse < 2.2) { var pu = pulse / 2.2; [[P_STAFF, STAFF], [P_DEV, DEV], [P_GUEST, GUEST], [P_MAIN, AQUA]].forEach(function (q) { var pts = q[0].map(function (p) { return [Math.min(p[0], e.r + 20), p[1]]; }), L = lens(pts), pos = along(pts, L, q[0] === P_MAIN ? 1 - pu : pu); fillE(g, pos[0], pos[1], 9 * (1 - pu * 0.4), 9 * (1 - pu * 0.4), 'rgba(255,255,255,.9)'); fillE(g, pos[0], pos[1], 5, 5, q[1]); }); }
    /* VPN capsules in the sealed pipe */
    for (var v = 0; v < 3; v++) { var vu = ((t * 0.12 + v / 3) % 1), vp = along(P_VPN, L_VPN, vu); fillRR(g, vp[0] - 6, vp[1] - 4, 12, 8, 4, '#FFFFFF'); lock(g, vp[0], vp[1] + 0.6, 0.5, VPN); }
    /* the junk: unasked-for traffic rides the main, is caught at the filter's mesh and thrown out to the bin */
    var nj = 4 + Math.round(surge * 4); for (var j = 0; j < nj; j++) { var ju = ((t * (0.16 + surge * 0.1) + j / nj + hash(j) * 0.1) % 1), jx, jy, rot = t * 4 + j;
      if (ju < 0.6) { var p = along(P_MAIN, L_MAIN, 0.35 + ju / 0.6 * 0.65); jx = p[0]; jy = p[1]; }
      else if (ju < 0.75) { var f = (ju - 0.6) / 0.15; jx = FIL.x + 14 + f * 18; jy = lerp(418, FIL.y + 96, f); }
      else if (ju < 0.85) { var f2 = (ju - 0.75) / 0.1; jx = lerp(FIL.x + 20, WALL + 8, f2); jy = FIL.y + 92 - Math.sin(f2 * Math.PI) * 6; }
      else { var f3 = (ju - 0.85) / 0.15; jx = lerp(WALL + 8, BIN.x + BIN.w / 2, f3); jy = lerp(BIN.y - 2, BIN.y + 10, f3 * f3); if (f3 > 0.9 && !S['jb' + j]) { S['jb' + j] = 1; blocked++; } if (f3 < 0.5) S['jb' + j] = 0; }
      g.save(); g.translate(jx, jy); g.rotate(rot); g.fillStyle = j % 2 ? JUNK : '#8A6A3A'; g.beginPath(); g.moveTo(-4, -2); g.lineTo(0, -4); g.lineTo(4, -1); g.lineTo(2, 3); g.lineTo(-3, 3); g.closePath(); g.fill(); g.restore(); }
    fillRR(g, BIN.x + 4, BIN.y + 24, BIN.w - 8, 11, 3, '#FFFFFF'); text(g, String(blocked), BIN.x + BIN.w / 2, BIN.y + 32.6, 7.4, 800, RED, 'center');
    if (S.hot === 'firewall') { g.strokeStyle = 'rgba(224,79,79,' + (0.5 + 0.4 * Math.sin(t * 6)).toFixed(2) + ')'; g.lineWidth = 2; rr(g, FIL.x + 4, FIL.y + 80, FIL.w - 8, 10, 3); g.stroke(); }
    /* the filter's water level, bubbles */
    var lvl = FIL.y + 40 + Math.sin(t * 1.4) * 3; g.fillStyle = 'rgba(28,154,214,.35)'; g.fillRect(FIL.x + 6, lvl, FIL.w - 12, FIL.y + 176 - lvl); for (var bb = 0; bb < 5; bb++) { var bu = (t * 0.5 + bb / 5) % 1; fillE(g, FIL.x + 12 + bb * 6, FIL.y + 172 - bu * 120, 1.6, 1.6, 'rgba(255,255,255,.8)'); }
    /* the manifold: port lights, labels the engineer adds */
    for (var r = 0; r < 3; r++) for (var c = 0; c < 4; c++) { var x = MAN.x + 14 + c * 18, y = MAN.y + 36 + r * 42, on = hash(Math.floor(t * (3 + r)) + c * 3 + r) > 0.35 || (pulse < 1.2); fillE(g, x + 7, y - 2, 1.8, 1.8, on ? [STAFF, DEV, GUEST][r] : '#4A5878');
      if (S.hot === 'switch' && Math.floor(t * 3) % 12 === r * 4 + c) { g.strokeStyle = '#FFE27A'; g.lineWidth = 2; g.beginPath(); g.arc(x, y + 4, 9, 0, 7); g.stroke(); } }
    /* the change log: lines written as the day goes on */
    var nl = 3 + Math.floor((t % 40) / 6); for (var l = 0; l < Math.min(nl, 8); l++) { g.fillStyle = '#C9D3E3'; g.fillRect(LOG.x + 6, LOG.y + 22 + l * 8, 30 - (l % 3) * 6, 2); fillE(g, LOG.x + LOG.w - 8, LOG.y + 23 + l * 8, 1.8, 1.8, [STAFF, DEV, GUEST, VPN][l % 4]); }
    CO.clock(g, CLK.x, CLK.y, CLK.r, 8, AQUA);
    /* the roof tank's level gauge; the guest stub's locked cap flashes when a guest drop tries it */
    var cl = RT.y + 20 + Math.sin(t * 0.9) * 4; fillRR(g, RT.x + RT.w - 13, cl, 5, RT.y + RT.h - 8 - cl, 2.5, STAFF);
    var gu = (t % 9) / 9, gp = along(P_GSTUB, L_STUB, Math.min(1, gu * 4)); if (gu < 0.25) { fillE(g, gp[0], gp[1], 4, 4, '#FFFFFF'); fillE(g, gp[0], gp[1], 2.6, 2.6, GUEST); }
    if (gu > 0.24 && gu < 0.36) { var ga = 1 - (gu - 0.24) / 0.12; g.strokeStyle = 'rgba(224,79,79,' + ga.toFixed(2) + ')'; g.lineWidth = 2; g.beginPath(); g.arc(466, -40, 9 + (1 - ga) * 10, 0, 7); g.stroke(); }
    if (S.hot === 'guest') { g.strokeStyle = 'rgba(224,79,79,.8)'; g.lineWidth = 2.4; g.beginPath(); g.arc(466, -40, 11 + Math.sin(t * 6) * 2, 0, 7); g.stroke(); }
    /* the file going to the staff member: up from the cistern, along the blue pipe, down the access point */
    var fu = ((t - FILES.t) < 2.4) ? (t - FILES.t) / 2.4 : ((t % 7) / 7) * 1.6; if (fu < 1) { var fp = along(P_FILE, L_FILE, fu); fillRR(g, fp[0] - 6, fp[1] - 5, 12, 9, 2, '#FFD27A'); fillRR(g, fp[0] - 6, fp[1] - 7, 5, 3, 1, '#FFD27A'); }
    /* coverage: ripples rain down from each access point */
    var wifiHot = S.hot === 'wifi'; APS.forEach(function (a, i) { var hot = wifiHot || (S.hot === 'guest' && i === 2); ripples(g, a[0], a[1], t + i * 0.37, hot ? 4 : 3, hot); fillE(g, a[0], CEIL + 12, 5, 3, (t + i) % 1 < 0.5 ? a[1] : '#FFFFFF'); });
    /* the printer: a page now and then (devices on their own segment) */
    var pg = (t % 8) / 8; if (pg < 0.4) { var len = Math.sin(pg / 0.4 * Math.PI) * 16; fillRR(g, PRN.x + 8, PRN.y + 20, PRN.w - 16, len, 1, '#FFFFFF'); g.fillStyle = '#C9D3E3'; if (len > 8) g.fillRect(PRN.x + 11, PRN.y + 26, PRN.w - 24, 1.4); }
    /* the home office: the remote colleague at a laptop, its screen glowing violet */
    var H = HOME, wy = H.y + 45; fillE(g, H.x + 31, wy + 12, 8, 7, '#F0CBA8'); fillE(g, H.x + 31, wy + 8, 8.4, 5, '#241A16'); fillRR(g, H.x + 22, wy + 18, 18, 12, 6, '#14A38B'); fillRR(g, H.x + 30, wy + 20, 14, 9, 2, '#2A3550'); fillRR(g, H.x + 31, wy + 21, 12, 7, 1, (t % 2) < 1.2 ? '#C9BDF5' : '#E8E1FB');
    if (S.hot === 'vpn') { g.strokeStyle = 'rgba(122,92,214,.8)'; g.lineWidth = 2.4; rr(g, H.x + 8, H.y + 42, 46, 36, 5); g.stroke(); }
    /* the big red valve: spins on a surge */
    g.save(); g.translate(VALVE.x, VALVE.y - 14); g.rotate((SURGE.t > -9 ? Math.max(0, 2.4 - (t - SURGE.t)) * 4 : 0) + Math.sin(t * 0.5) * 0.05); valveWheel(g, 0, 0, 13, RED); g.restore();
    CO.crew(CREW, g, t, S, false);
    var cw = CREW[0]; if (cw.P._w) { var h0 = handAt(cw.P, 0), h1 = handAt(cw.P, 1), mx = (h0[0] + h1[0]) / 2, my = (h0[1] + h1[1]) / 2; fillE(g, mx, my, 13, 13, '#5C6B8A'); fillE(g, mx, my, 10, 10, STAFF); fillE(g, mx, my, 4, 4, '#C9D3DE'); g.strokeStyle = STAFF; g.lineWidth = 1.6; g.beginPath(); g.arc(mx, my, 7, t, t + 4); g.stroke(); }
  }
  function paintFrontLive(g, t, S) {
    if (S.ext.l < 100) streetLive(g, t, S);
    CO.crew(CREW, g, t, S, true);
    if (S.ext.l < 100) { streetFront(g); cableDrum(g); }
    /* the staff monitor: the shared drive, a file arriving */
    var fopen = (t - FILES.t) < 2.6 || ((t % 7) / 7) * 1.6 > 0.95 && ((t % 7) / 7) * 1.6 < 1.5; fillRR(g, MON.x, MON.y, MON.w, MON.h, 2, '#FFFFFF'); fillRR(g, MON.x, MON.y, MON.w, 7, 2, STAFF); text(g, 'Shared drives', MON.x + 3, MON.y + 5.4, 4.6, 800, '#FFFFFF');
    for (var f = 0; f < 4; f++) { var fx = MON.x + 4 + (f % 2) * 21, fy = MON.y + 10 + Math.floor(f / 2) * 12; fillRR(g, fx, fy, 18, 10, 2, f === 3 && fopen ? '#FFF1CC' : '#F3F6FA'); fillRR(g, fx + 2, fy + 2, 7, 5, 1, '#FFD27A'); g.fillStyle = '#C9D3E3'; g.fillRect(fx + 10, fy + 4, 6, 1.4); }
    props(g, t, S);
  }
  function props(g, t, S) {
    /* the engineer: his label maker (a fresh label curling out), or the wrench on his tap */
    var he = handAt(ENG, 1), hw = handAt(ENG, 0);
    if (TAP.eng && t - TAP.eng < 2.4) { g.save(); g.translate(hw[0], hw[1]); g.rotate(-1.1 + Math.sin(clamp((t - TAP.eng) * 3, 0, 1) * Math.PI) * 0.7); fillRR(g, -2.5, -24, 5, 28, 2, '#8A96A8'); g.strokeStyle = '#8A96A8'; g.lineWidth = 4; g.beginPath(); g.arc(0, -28, 6, 0.6, Math.PI * 2 - 0.6); g.stroke(); g.restore();
      var wu = t - TAP.eng - 0.35; if (wu > 0 && wu < 1) { g.strokeStyle = 'rgba(224,170,40,' + (1 - wu).toFixed(2) + ')'; g.lineWidth = 2.4; for (var rg = 0; rg < 3; rg++) { g.beginPath(); g.arc(358, 292, 8 + wu * 30 + rg * 7, 0, Math.PI * 2); g.stroke(); } text(g, 'TING!', 372, 250 - wu * 14, 10, 800, BRASS, 'center'); } }
    /* the label maker stays in his right hand */
    { g.save(); g.translate(he[0], he[1] - 4); g.rotate(-0.25); fillRR(g, -9, -14, 18, 24, 4, '#FFC93C'); fillRR(g, -6, -10, 12, 7, 2, '#2A3550'); fillE(g, 0, 4, 3, 3, INK); var lab = ENG.label || 0; if (lab > 0) { fillRR(g, -3, -14 - lab * 12, 6, lab * 12, 1, '#FFFFFF'); g.fillStyle = INK; g.fillRect(-1.5, -12 - lab * 10, 3, lab * 6); } g.restore(); }
    /* the manager: the network diagram, open, rolled or held high */
    var hl = handAt(MGR, 0), hr = handAt(MGR, 1), open = MGR.open || 0, cx = (hl[0] + hr[0]) / 2, cy = (hl[1] + hr[1]) / 2;
    if (open > 0.05) { var w = Math.max(10, hr[0] - hl[0]) * open + 6, hgt = 34 + open * 10; g.save(); g.translate(cx, cy); g.rotate(MGR.high ? 0 : -0.08); fillRR(g, -w / 2, -hgt + 4, w, hgt, 2, '#DCEBFA'); g.strokeStyle = STAFF; g.lineWidth = 1.2; g.beginPath(); g.moveTo(-w / 2 + 6, -hgt + 14); g.lineTo(w / 2 - 6, -hgt + 14); g.moveTo(-w / 4, -hgt + 14); g.lineTo(-w / 4, -6); g.moveTo(w / 4, -hgt + 14); g.lineTo(w / 4, -6); g.stroke();
      if (open > 0.6) { fillRR(g, -5, -hgt + 10, 10, 8, 2, RED); fillE(g, -w / 4, -6, 3.4, 3.4, STAFF); fillE(g, w / 4, -6, 3.4, 3.4, GUEST); fillE(g, 0, -hgt + 26, 3, 3, DEV); text(g, 'NETWORK', 0, -hgt + 9, 4.4, 800, INK, 'center'); }
      fillRR(g, -w / 2 - 3, -hgt + 2, 5, hgt, 2.5, '#BFD6EE'); fillRR(g, w / 2 - 2, -hgt + 2, 5, hgt, 2.5, '#BFD6EE'); g.restore(); }
    else { g.save(); g.translate(hr[0], hr[1]); g.rotate(-0.9); fillRR(g, -4, -26, 8, 34, 4, '#BFD6EE'); fillE(g, 0, -26, 4, 2, '#9FBFE0'); g.restore(); }
    /* the surveyor: the coverage meter, its bars live */
    var hs = handAt(SRV, 1), bars = SRV.bars || 0; g.save(); g.translate(hs[0], hs[1] - 6); fillRR(g, -9, -24, 18, 28, 4, '#2A3550'); fillRR(g, -7, -22, 14, 16, 2, '#E9FBF2');
    for (var bq = 0; bq < 4; bq++) fillRR(g, -5 + bq * 3.2, -9 - bq * 3, 2.4, 3 + bq * 3, 0.8, bq < bars ? DEV : '#C9D3DE'); fillE(g, 0, 0, 1.8, 1.8, '#FFE27A'); g.restore();
    if (TAP.srv && t - TAP.srv < 1.6) { var su = (t - TAP.srv) / 1.6; g.strokeStyle = 'rgba(47,181,124,' + (1 - su).toFixed(2) + ')'; g.lineWidth = 2; for (var sr = 0; sr < 3; sr++) { g.beginPath(); g.arc(hs[0], hs[1] - 24, 6 + su * 24 + sr * 6, -2.4, -0.7); g.stroke(); } }
    /* the visitor: the phone (and the bubble on his tap) */
    var hg = handAt(GST, 1); g.save(); g.translate(hg[0], hg[1] - 2); g.rotate(GST.showPhone ? -0.1 : 0.2); fillRR(g, -6, -18, 12, 20, 2.6, '#1F2236'); fillRR(g, -4.6, -16.5, 9.2, 16, 1.6, '#FFE9D2'); fillRR(g, -3, -14, 6, 2, 1, GUEST); g.fillStyle = '#F7C99B'; g.fillRect(-3, -10 + ((t * 5) % 4), 6, 1.6); g.restore();
    if (GST.cup) { var hc = handAt(GST, 0); fillRR(g, hc[0] - 5, hc[1] - 12, 10, 12, 3, '#FFFFFF'); fillRR(g, hc[0] - 5, hc[1] - 12, 10, 3, 1.5, '#C98E55'); }
    if (TAP.gst && t - TAP.gst < 2.4) { var bu = clamp((t - TAP.gst) * 3, 0, 1), bx = GST.x - 20, by = GST.y - 300; g.save(); g.globalAlpha = bu; shadowed(g, 6, 2, 0.2, function () { fillRR(g, bx - 46, by - 22, 92, 30, 12, '#FFFFFF'); });
      text(g, 'Internet ✓', bx - 22, by - 3.4, 7, 800, DEV, 'center'); text(g, 'Files ✕', bx + 24, by - 3.4, 7, 800, RED, 'center'); g.fillStyle = '#FFFFFF'; g.beginPath(); g.moveTo(bx + 8, by + 8); g.lineTo(bx + 18, by + 16); g.lineTo(bx + 18, by + 8); g.fill(); g.restore(); }
  }

  /* ---------------- the cast: an idle loop and a tap choreography each ---------------- */
  function tapped(id, st, t) { if (st.wave && st.wave !== st._my) { st._my = st.wave; TAP[id] = t; return true; } return false; }
  function lookAtNexi(P, st, t, S, base) { P.look = lerp(P.look, t < st.until ? clamp((S.nexi.x - P.x) / 160, -1, 1) : base, 0.08); }
  /* ---------------- the street side (behind the title card): the provider's street cabinet where the supply is handed over,
     a TechNext field engineer at its gauges, a bus stop with a passer-by's phone on guest Wi-Fi out of reach, the street works
     barrier round an open manhole, warning tape over the buried conduit, and the city supply main running to the towers ---------------- */
  var CAB = { x: -262, y: 330, w: 92 }, MH = { x: -70 }, CITY = [[-610, F - 4], [-610, 676], [118, 676], [118, F + 10]];
  var FENG = W({ x: -305, y: F, s: 0.46, ph: 4.3, skin: 1, hair: 0, style: 'short', outfit: 'polo', top: AQUA, top2: '#FFFFFF', hatKind: 'cap', hat: STAFF, hold: 'tablet', hands: [[-40, -250], [40, -250]], look: 0.6 });
  function streetBack(g, ext) {
    if (ext.l > 80) return;
    /* the buried city supply main and the warning tape above the conduit */
    pipe(g, CITY, 12, '#4FB3E3'); fillRR(g, -470, 688, 112, 18, 9, '#FFFFFF'); text(g, 'CITY SUPPLY MAIN', -414, 700, 7.2, 800, AQUA_D, 'center');
    [[-610, 640], [118, 640]].forEach(function (p) { fillRR(g, p[0] - 10, p[1], 20, 12, 3, '#5C6B8A'); });
    g.save(); g.strokeStyle = '#FFD84A'; g.lineWidth = 7; g.beginPath(); g.moveTo(ext.l, 624); g.quadraticCurveTo(-260, 632, 120, 622); g.stroke(); g.setLineDash([10, 12]); g.strokeStyle = INK; g.lineWidth = 7; g.beginPath(); g.moveTo(ext.l, 624); g.quadraticCurveTo(-260, 632, 120, 622); g.stroke(); g.restore();
    fillRR(g, -230, 616, 118, 14, 3, '#FFD84A'); text(g, 'CAUTION · CABLE BELOW', -171, 626, 6.6, 800, INK, 'center');
    /* the bus stop: a shelter with a route map and a timetable */
    var bs = -520; [bs, bs + 120].forEach(function (x) { fillRR(g, x - 3, 300, 6, F - 300, 2, '#8A96A8'); }); fillRR(g, bs - 14, 290, 148, 14, 5, STAFF); fillRR(g, bs + 4, 312, 112, 96, 4, 'rgba(220,240,252,.55)');
    g.strokeStyle = 'rgba(255,255,255,.8)'; g.lineWidth = 2; rr(g, bs + 4, 312, 112, 96, 4); g.stroke(); fillRR(g, bs + 70, 320, 40, 52, 3, '#FFFFFF'); [AQUA, GUEST, DEV].forEach(function (c, i) { g.strokeStyle = c; g.lineWidth = 2; g.beginPath(); g.moveTo(bs + 74, 330 + i * 12); g.lineTo(bs + 106, 334 + i * 12 - (i % 2) * 6); g.stroke(); });
    fillRR(g, bs + 6, 424, 100, 8, 3, '#C99A6B'); [bs + 14, bs + 96].forEach(function (x) { fillRR(g, x, 432, 5, F - 432, 2, '#8A96A8'); }); fillRR(g, bs + 36, 274, 52, 18, 9, '#FFFFFF'); text(g, 'BUS', bs + 62, 286.5, 9, 800, STAFF, 'center');
    /* the provider's street cabinet on the pavement, its door, the handover valve, the meter */
    soft(g, CAB.x + CAB.w / 2, F + 2, 60, 5, 0.24); shadowed(g, 8, 3, 0.18, function () { fillRR(g, CAB.x, CAB.y, CAB.w, F - CAB.y, 6, '#5E8E78'); });
    fillRR(g, CAB.x, CAB.y, CAB.w, 16, 6, '#4E7A66'); text(g, 'PROVIDER · HANDOVER', CAB.x + CAB.w / 2, CAB.y + 11, 6, 800, '#FFFFFF', 'center');
    fillRR(g, CAB.x + 8, CAB.y + 24, CAB.w - 16, 92, 4, '#2A3550'); pipe(g, [[CAB.x + 22, CAB.y + 112], [CAB.x + 22, CAB.y + 44], [CAB.x + CAB.w - 22, CAB.y + 44], [CAB.x + CAB.w - 22, CAB.y + 112]], 7, AQUA);
    valveWheel(g, CAB.x + CAB.w / 2, CAB.y + 44, 9, RED); fillE(g, CAB.x + 30, CAB.y + 78, 12, 12, '#FFFFFF'); g.strokeStyle = '#7A869C'; g.lineWidth = 1.6; g.beginPath(); g.arc(CAB.x + 30, CAB.y + 78, 12, 0, Math.PI * 2); g.stroke();
    fillRR(g, CAB.x + 50, CAB.y + 70, 30, 16, 3, '#1E2A3A'); fillRR(g, CAB.x + 8, CAB.y + 120, CAB.w - 16, 12, 3, '#FFFFFF'); text(g, 'MAIN · 01', CAB.x + CAB.w / 2, CAB.y + 129, 6.4, 800, INK, 'center');
    /* the open manhole on the pavement */
    fillE(g, MH.x, F + 92, 40, 10, '#5C6B8A'); fillE(g, MH.x, F + 92, 34, 7.5, '#2A3550'); g.save(); g.translate(MH.x + 52, F + 88); g.rotate(-0.35); fillE(g, 0, 0, 30, 7, '#7A869C'); fillE(g, -1, -1, 24, 5, '#9AA6BC'); g.restore();
  }
  function streetFront(g) {
    /* the street-works barrier in front of the manhole (drawn over the passers-by on the pavement) */
    [MH.x - 56, MH.x + 56].forEach(function (x) { soft(g, x, F + 70, 12, 3, 0.25); g.strokeStyle = '#8A96A8'; g.lineWidth = 3; g.beginPath(); g.moveTo(x - 10, F + 70); g.lineTo(x, F + 20); g.lineTo(x + 10, F + 70); g.stroke(); });
    fillRR(g, MH.x - 66, F + 24, 132, 16, 3, '#FFFFFF'); g.save(); g.beginPath(); g.rect(MH.x - 66, F + 24, 132, 16); g.clip(); g.fillStyle = RED; for (var sx = MH.x - 80; sx < MH.x + 70; sx += 24) { g.beginPath(); g.moveTo(sx, F + 40); g.lineTo(sx + 12, F + 24); g.lineTo(sx + 24, F + 24); g.lineTo(sx + 12, F + 40); g.closePath(); g.fill(); } g.restore();
    g.strokeStyle = INK; g.lineWidth = 1.4; rr(g, MH.x - 66, F + 24, 132, 16, 3); g.stroke(); fillRR(g, MH.x - 30, F + 44, 60, 14, 4, '#FFFFFF'); text(g, 'NETWORK WORKS', MH.x, F + 54, 6.6, 800, INK, 'center');
  }
  function cableDrum(g) {
    var x = -420, y = F + 96; soft(g, x, y + 2, 50, 6, 0.26); fillE(g, x, y - 36, 38, 38, '#B5865A'); fillE(g, x, y - 36, 30, 30, STAFF); g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 1.4; for (var r = 0; r < 4; r++) { g.beginPath(); g.arc(x, y - 36, 14 + r * 4, -2.6, -1.2); g.stroke(); }
    fillE(g, x, y - 36, 12, 12, '#C99A6B'); fillE(g, x, y - 36, 4, 4, '#8A5A30'); fillRR(g, x - 40, y - 4, 80, 6, 3, '#9A7048'); fillRR(g, x - 18, y - 46, 36, 12, 3, '#FFFFFF'); text(g, 'CAT6 · 305 m', x, y - 37.5, 5.4, 800, INK, 'center');
    g.strokeStyle = STAFF; g.lineWidth = 3; g.beginPath(); g.moveTo(x + 30, y - 20); g.quadraticCurveTo(x + 80, y + 4, x + 140, y - 10); g.stroke();
  }
  function streetLive(g, t, S) {
    /* the city main's flow, the cabinet's meter and lamps, the barrier lamps blinking in turn */
    flow(g, CITY, 12, 'rgba(255,255,255,.85)', t, 26);
    var rate = 92 + Math.round(Math.sin(t * 0.7) * 4 + (t - (TAP.feng || -99) < 3 ? 6 : 0)); fillRR(g, CAB.x + 50, CAB.y + 70, 30, 16, 3, '#1E2A3A'); text(g, rate + '%', CAB.x + 65, CAB.y + 81, 7, 800, '#7FF0CF', 'center');
    var nd = -2.2 + 1.6 * (rate - 80) / 20; g.strokeStyle = RED; g.lineWidth = 1.6; g.beginPath(); g.moveTo(CAB.x + 30, CAB.y + 78); g.lineTo(CAB.x + 30 + Math.cos(nd) * 9, CAB.y + 78 + Math.sin(nd) * 9); g.stroke();
    var up = t - (TAP.feng || -99) < 3; [[CAB.x + 14, DEV], [CAB.x + 26, (t % 1.2) < 0.6 ? AQUA : '#2A3550'], [CAB.x + 38, up ? DEV : '#3A4766']].forEach(function (l) { fillE(g, l[0], CAB.y + 102, 3, 3, l[1]); });
    if (up) { var q = (t - TAP.feng) / 3; fillRR(g, CAB.x + 4, CAB.y - 30, CAB.w - 8, 20, 10, '#FFFFFF'); text(g, 'LINK UP ✓', CAB.x + CAB.w / 2, CAB.y - 16, 8, 800, DEV, 'center');
      for (var r = 0; r < 3; r++) { var f = (q * 2 + r / 3) % 1; g.strokeStyle = 'rgba(28,154,214,' + (0.7 * (1 - f)).toFixed(2) + ')'; g.lineWidth = 2; g.beginPath(); g.arc(CAB.x + CAB.w / 2, CAB.y - 20, 30 + f * 40, -2.6, -0.5); g.stroke(); } }
    [MH.x - 56, MH.x + 56].forEach(function (x, i) { var on = Math.floor(t * 2.2 + i) % 2 === 0; fillE(g, x, F + 18, 5, 5, on ? '#FFB020' : '#C9A24A'); if (on) fillE(g, x, F + 18, 9, 9, 'rgba(255,176,32,.25)'); });
  }
  var castFeng = { id: 'feng', behind: true, keys: [], P: FENG, act: function (P, t, S) {
    var st = S.cast.feng; if (tapped('feng', st, t)) {}
    P.tilt = 0; P.hop = 0; P.hold = 'tablet'; P.x = -305;
    var tk = TAP.feng != null ? t - TAP.feng : 99;
    if (tk < 2.8) { var q = tk / 2.8; P.talk = true; P.look = 0.8; P.hold = null;
      if (q < 0.45) { var a = q / 0.45 * Math.PI * 2; P.mood = 'calm'; P.hands = [[120 + Math.cos(a) * 18, -282 + Math.sin(a) * 18], [150 - Math.cos(a) * 18, -282 - Math.sin(a) * 18]]; P.tilt = 0.06; }
      else { P.mood = 'happy'; P.hands = [[-60, -230], [40, -420]]; P.hop = Math.sin((q - 0.45) / 0.55 * Math.PI) * 14; if (!TAP.fengB) { TAP.fengB = true; CR.burst('spark', CAB.x + CAB.w / 2, CAB.y + 40, t); } } return; }
    TAP.fengB = false;
    var cy = (t + 2) % 11; P.talk = t < st.until; P.mood = P.talk ? 'happy' : 'calm';
    if (cy < 4) { P.hands = [[-40, -250], [40, -254 + Math.abs(Math.sin(t * 5)) * 3]]; lookAtNexi(P, st, t, S, -0.2); return; }
    if (cy < 7.5) { P.hold = null; var tq = Math.sin(t * 3); P.hands = [[130 + tq * 8, -300], [150 - tq * 8, -260]]; P.tilt = 0.05; lookAtNexi(P, st, t, S, 0.9); return; }
    P.hold = null; P.hands = [[-60, -230], [86, -360 + Math.sin(t * 2.4) * 6]]; lookAtNexi(P, st, t, S, 0.6);
  } };
  var castENG = { id: 'eng', behind: true, keys: ['switch', 'firewall'], P: ENG, act: function (P, t, S) {
    var st = S.cast.eng; if (tapped('eng', st, t)) { PULSE.t = t + 0.35; }
    P.hop = 0; P.tilt = 0; P.label = 0;
    if (TAP.eng && t - TAP.eng < 2.4) { var u = (t - TAP.eng) / 2.4; P.talk = true; P.mood = u > 0.2 ? 'happy' : 'wow'; P.hands = [u < 0.15 ? [-60, -330] : rel(P, 372 + Math.max(0, Math.sin(u * 14)) * 6, 300), [50, -250]]; P.look = -0.8;
      if (u > 0.3 && !TAP.engB) { TAP.engB = true; CR.burst('star', P.x - 20, P.y - 330, t); } P.hop = u > 0.3 ? Math.abs(Math.sin((u - 0.3) * Math.PI * 3)) * 8 : 0; return; }
    TAP.engB = false;
    /* idle: a 9 s loop: print a label and stick it on a port, write a line in the change log, then turn a valve */
    var c = t % 9, busy = S.hot === 'switch' || S.hot === 'firewall'; P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm';
    P.x = 422;
    if (c < 3.4) { var pr = clamp(c / 2, 0, 1); P.label = c < 2 ? pr : 1; var port = 2 + Math.floor(t / 9) % 2, tx = MAN.x + 14 + port * 18, reach = c > 2 ? Math.sin(clamp((c - 2) / 1.4, 0, 1) * Math.PI) : 0;
      P.hands = [reach > 0.05 ? rel(P, lerp(P.x - 20, tx, reach), lerp(P.y - 120, MAN.y + 132, reach)) : [-60, -220], [50, -250]]; P.look = reach > 0.1 ? -0.6 : 0.1; if (reach > 0.05) P.label = 1 - reach; P.tilt = -reach * 0.06; }
    else if (c < 6) { var tap = Math.abs(Math.sin(t * 9)) * 6; P.hands = [rel(P, GAUGE.x + 4, GAUGE.y + tap), [60, -200]]; P.look = -0.8; P.tilt = -0.05; P.mood = 'calm'; }
    else { var vu = (c - 6) / 3, ang = vu * Math.PI * 4; P.hands = [rel(P, MAN.x + 68 + Math.cos(ang) * 6, MAN.y + 128 + Math.sin(ang) * 6), [60, -190]]; P.look = -0.5; P.tilt = -0.05; }
    lookAtNexi(P, st, t, S, P.look);
  } };
  var castMGR = { id: 'mgr', behind: true, keys: ['internet', 'vpn'], P: MGR, act: function (P, t, S) {
    var st = S.cast.mgr; if (tapped('mgr', st, t)) {}
    P.hop = 0; P.tilt = 0; P.high = false;
    if (TAP.mgr && t - TAP.mgr < 2.6) { var u = (t - TAP.mgr) / 2.6, up = Math.sin(clamp(u / 0.3, 0, 1) * Math.PI / 2); P.open = 1; P.high = true; P.talk = true; P.mood = 'happy'; P.hands = [[20 + up * 30, -260 - up * 70], [150 + up * 40, -260 - up * 70]]; P.look = 0.5;
      if (u > 0.3 && !TAP.mgrB) { TAP.mgrB = true; CR.burst('star', P.x, P.y - 420, t); } P.hop = u > 0.3 ? Math.sin((u - 0.3) / 0.7 * Math.PI) * 10 : 0; return; }
    TAP.mgrB = false;
    /* idle: unroll the diagram and study it, look up at the access point it shows, roll it and tap it on the palm */
    var c = t % 10; P.talk = t < st.until || S.hot === 'internet' || S.hot === 'vpn'; P.mood = P.talk ? 'happy' : 'calm';
    if (c < 1) { P.open = c; P.hands = [[-20 - c * 50, -205], [20 + c * 50, -205]]; P.look = 0; }
    else if (c < 5.4) { P.open = 1; P.hands = [[-72, -205 + Math.sin(t * 1.3) * 4], [72, -205 - Math.sin(t * 1.3) * 4]]; P.look = Math.sin(t * 0.8) * 0.4; P.tilt = 0.08; }
    else if (c < 6.8) { P.open = 1; P.hands = [[-72, -205], [72, -205]]; P.look = 0.7; P.tilt = -0.1; }
    else if (c < 7.6) { var rl = (c - 6.8) / 0.8; P.open = 1 - rl; P.hands = [[-72 + rl * 50, -205], [72 - rl * 50, -205]]; }
    else { P.open = 0; var tp = Math.abs(Math.sin(t * 6)); P.hands = [[-30, -210], [40, -220 - tp * 20]]; P.look = 0.3; }
    lookAtNexi(P, st, t, S, P.look);
  } };
  var castSTF = { id: 'staff', behind: true, keys: ['wifi'], P: STF, act: function (P, t, S) {
    var st = S.cast.staff; if (tapped('staff', st, t)) { FILES.t = t + 0.6; }
    P.sx = 1; P.hop = 0; P.tilt = 0;
    if (TAP.staff && t - TAP.staff < 2.6) { var u = (t - TAP.staff) / 2.6; P.talk = true; P.mood = 'happy';
      if (u < 0.3) { P.sx = Math.cos(u / 0.3 * Math.PI * 2); P.hands = [[-90, -260], [90, -260]]; P.hop = Math.sin(u / 0.3 * Math.PI) * 10; }
      else { if (!TAP.stfB) { TAP.stfB = true; CR.burst('spark', MON.x + 20, MON.y - 10, t); } P.hands = [[60, -206], [110, -380 + Math.sin(t * 14) * 10]]; P.look = 0.5; }
      return; }
    TAP.stfB = false;
    var c = t % 12, fileAt = ((t % 7) / 7) * 1.6; P.talk = t < st.until || S.hot === 'wifi' || (fileAt > 0.95 && fileAt < 1.3); P.mood = P.talk ? 'happy' : 'calm';
    if (c > 9.6 && c < 11.4) { var sv = Math.sin((c - 9.6) / 1.8 * Math.PI); P.hands = [[-90 - sv * 20, -260 - sv * 140], [90 + sv * 20, -260 - sv * 140]]; P.tilt = 0; P.look = 0; P.mood = 'happy'; }
    else { var k2 = Math.abs(Math.sin(t * 12)) * 6; P.hands = [[56, -206 - k2], [124, -206 - (6 - k2)]]; P.look = 0.65; P.tilt = Math.sin(t * 0.5) * 0.02; }
    lookAtNexi(P, st, t, S, P.look);
  } };
  var castSRV = { id: 'surv', behind: true, keys: ['wifi', 'guest'], P: SRV, act: function (P, t, S) {
    var st = S.cast.surv; if (tapped('srv', st, t)) {}
    P.hop = 0; P.tilt = 0;
    if (TAP.srv && t - TAP.srv < 1.6) { var u = (t - TAP.srv) / 1.6; P.bars = 4; P.talk = true; P.mood = 'happy'; P.hands = [[-110, -380], [60, -440]]; P.hop = Math.sin(u * Math.PI) * 60; if (u > 0.4 && !TAP.srvB) { TAP.srvB = true; CR.burst('star', P.x, P.y - 400, t); } return; }
    TAP.srvB = false;
    /* idle: pace between the two staff access points, the meter held up, reading bars that rise under each one */
    var c = t % 8, walk = c < 3 ? c / 3 : c < 4 ? 1 : c < 7 ? 1 - (c - 4) / 3 : 0, x = lerp(790, 826, (1 - Math.cos(walk * Math.PI)) / 2); P.x = x;
    var moving = (c < 3 || (c > 4 && c < 7)), stepH = moving ? Math.abs(Math.sin(t * 7)) * 5 : 0; P.hop = stepH;
    var near = Math.abs(x - APS[1][0]); P.bars = clamp(4 - Math.floor(near / 16), 2, 4);
    P.talk = t < st.until || S.hot === 'wifi'; P.mood = P.talk || !moving ? 'happy' : 'calm';
    if (!moving) { P.hands = [[-70, -170], [70, -380 - Math.sin(t * 3) * 10]]; P.look = 0.2; P.tilt = -0.05; }
    else { var sw = Math.sin(t * 7) * 20; P.hands = [[-70 - sw, -165], [80, -330]]; P.look = c < 4 ? 0.6 : -0.6; }
    lookAtNexi(P, st, t, S, P.look);
  } };
  var castGST = { id: 'guest', behind: true, keys: ['guest'], P: GST, act: function (P, t, S) {
    var st = S.cast.guest; if (tapped('gst', st, t)) {}
    P.hop = 0; P.tilt = 0; P.cup = false; P.showPhone = false;
    if (TAP.gst && t - TAP.gst < 2.4) { var u = (t - TAP.gst) / 2.4; P.talk = true; P.mood = 'happy'; P.showPhone = true;
      if (u < 0.5) P.hands = [[-30, -236], [60, -330]]; else { P.hands = [[-120, -300], [120, -300]]; P.tilt = Math.sin(t * 8) * 0.06; P.look = 0; } return; }
    var c = t % 11; P.talk = t < st.until || S.hot === 'guest' || (c > 6 && c < 7.4); P.mood = P.talk ? 'happy' : 'calm';
    if (c > 8 && c < 10) { var sp = Math.sin((c - 8) / 2 * Math.PI); P.cup = true; P.hands = [[-40 + sp * 10, -220 - sp * 110], [40, -246]]; P.look = 0; }
    else if (c > 6 && c < 7.4) { P.hands = [[-30, -236], [40, -246]]; P.tilt = Math.sin(t * 10) * 0.05; P.look = -0.3; }
    else { var th = Math.sin(t * 6) * 3; P.hands = [[-30, -236], [40, -246 + th]]; P.look = -0.25 + Math.sin(t * 0.4) * 0.15; }
    lookAtNexi(P, st, t, S, P.look);
  } };

  window.IXW.worlds['sol-net'] = {
    calmView: [140,-130,870,696], /* CALM: the framed part of the set */
    pan: [-260, 1240],
    paintBg: paintBg, windowBehind: true, paintFrame: paintFrame, paintBack: paintBack, paintFront: paintFront, paintFore: paintFore,
    paintWindow: paintWindow, paintLive: paintLive, paintFrontLive: paintFrontLive,
    paintForeLive: function (g, t, S) { K.zfore(g, t, S, [], function () { CO.crew(CREW, g, t, S, 'fore'); }); CR.draw(g, t); },
    motes: false,
    glow: {
      internet: function (g) { rr(g, BTANK.x - 12, TANK.y - 40, TANK.x + TANK.w - BTANK.x + 24, TANK.h + 52, 14); },
      firewall: function (g) { rr(g, FIL.x - 10, FIL.y - 10, FIL.w + 20, F - FIL.y + 14, 16); },
      'switch': function (g) { rr(g, MAN.x - 10, MAN.y - 10, MAN.w + 20, MAN.h + 20, 12); },
      wifi: function (g) { rr(g, 568, -32, 410, 96, 14); },
      guest: function (g) { rr(g, GSIGN.x - 12, CEIL - 6, GSIGN.w + 24, GSIGN.y + GSIGN.h - CEIL + 18, 12); },
      vpn: function (g) { rr(g, HOME.x - 14, HOME.y - 16, HOME.w + 28, F - HOME.y + 22, 14); },
      valve: function (g) { rr(g, VALVE.x - 20, VALVE.y - 34, 40, 40, 20); }
    },
    backGlow: ['internet', 'firewall', 'switch', 'wifi', 'guest', 'vpn', 'valve'],
    cast: [castFeng, castENG, castMGR, castSTF, castSRV, castGST],
    toy: function (name, S, t) { if (name === 'valve') { SURGE.t = t; CR.burst('spark', VALVE.x, VALVE.y - 30, t); } },
    hit: function (x, y, S, t, onBtn) {
      var w = CR.hitWalker(x, y, t); if (w) return w; if (onBtn) return null;
      if (x > HOME.x && x < HOME.x + HOME.w && y > HOME.y && y < F) return { say: 'Working from home today: in through the **VPN**, only to what I need.', near: [560, -66], pose: 'point-left', who: 'Remote colleague · client team' };
      if (x > BIN.x - 6 && x < BIN.x + BIN.w + 6 && y > BIN.y - 8 && y < BIN.y + BIN.h + 6) return { say: '**' + blocked + '** bits of traffic nobody asked for, turned away at the gate.', near: [620, -62], pose: 'point-left', who: 'The firewall bin' };
      if (x > CAB.x - 6 && x < CAB.x + CAB.w + 6 && y > CAB.y - 6 && y < F) return { say: 'The **handover point**: where the provider’s line ends and your network begins. We test it before anything else.', near: [-150, 180], pose: 'point-left', who: 'The street cabinet' };
      if (Math.abs(x - MH.x) < 80 && y > F && y < F + 104) return { say: 'Network works in progress: **cabling installed tidily**, then documented.', near: [-150, 300], pose: 'wow', who: 'The street works' };
      if (x > -530 && x < -390 && y > 270 && y < F) return { say: 'Even the bus stop wants Wi-Fi. **Guest access** stays separate from your staff network.', near: [-250, 160], pose: 'point-left', who: 'The bus stop' };
      if (y > SOIL && y < SOIL + 140) return { say: 'Under the street: the **main line**, the backup and the sealed **VPN** pipe, each labelled on the diagram.', near: [clamp(x, 260, 880), -60], pose: 'wow', who: 'The pipes' };
      if (y > WIN.y && y < WIN.y + WIN.h && x > WIN.x && x < WIN.x + WIN.w) return { say: 'Good Wi-Fi by the window **and** in the corners: coverage is checked room by room.', near: [420, -66], pose: 'point-right', who: 'The office' };
      return null;
    },
    onStop: function (key, S, t) { S.kT = t; if (key === 'firewall') SURGE.t = t; if (key === 'switch') PULSE.t = t; }
  };
})(window.IXW && window.IXW.kit, window.CR, window.CO);
