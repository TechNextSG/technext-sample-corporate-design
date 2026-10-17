/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: construction (/industries/construction) — Northline Builders, a sample contractor, drawn as a BUILDING SITE in the
   open air. Sky and a far city behind the blue site hoarding; on the compacted ground: the project signboard (CRM, the
   tender won), the site office cabin with the job's task board in its window (Project), the whiteboard with the progress
   claim and the cost curve (Accounting), the concrete frame going up behind its scaffolding with a crew member on the
   planks, the progress banner on level 2 (Timesheets, progress), the tower crane carrying a steel beam (Planning, crews
   and site work; tap it to swing the load), the materials yard with bricks and rebar (Purchase) and a cement mixer that
   spins faster when tapped. Clouds pass behind it all (windowBehind). Staff: Siti, site engineer with her tablet
   (sample); Ben, foreman on the scaffold (sample). */
(function (K) {
  'use strict';
  if (!K) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed;
  var F = 470, HO = 344; /* the ground line; the top of the hoarding */
  var T = {
    board: { x: 180, y: 216, w: 168, h: 80 }, cabin: { x: 196, y: 334, w: 144, h: 136 }, easel: { x: 452, y: 336 },
    bld: { x: 560, w: 300 }, cols: [568, 660, 752, 844], slabs: [362, 252, 142], banner: { x: 762, y: 262, w: 80, h: 38 },
    crane: { x: 896, top: 30 }, jib: { x0: 520, x1: 912, y: 38 }, yard: { x: 760, y: 470 }, mixer: { x: 104, y: 470 }
  };
  var C = { yellow: '#FFC93C', yellowD: '#E0A800', orange: '#FF7A1A', navy: '#1F3F73', blue: '#2E5C9A', concrete: '#C9C5BC', concreteD: '#A9A49A', steel: '#6B7A8F', ink: '#1E2A3A', dirt: '#CDAE86' };

  /* ---------------- the sky and the far city (hero px, behind everything) ---------------- */
  function paintBg(g, W, Hh, k, sx, sy) {
    var hz = sy + 330 * k, sk = g.createLinearGradient(0, 0, 0, hz); sk.addColorStop(0, '#86C6F0'); sk.addColorStop(1, '#E4F3FC'); g.fillStyle = sk; g.fillRect(0, 0, W, hz + 40 * k);
    var sun = g.createRadialGradient(sx + 980 * k, sy + 60 * k, 4, sx + 980 * k, sy + 60 * k, 160 * k); sun.addColorStop(0, 'rgba(255,246,210,.95)'); sun.addColorStop(0.25, 'rgba(255,240,190,.35)'); sun.addColorStop(1, 'rgba(255,240,190,0)');
    g.fillStyle = sun; g.fillRect(0, 0, W, hz);
    for (var i = 0, x = -30; x < W; i++) { var bw = (34 + hash(i * 2.3) * 54) * k, bh = (40 + hash(i * 4.1) * 110) * k; g.fillStyle = i % 3 ? '#B9D2E6' : '#A8C4DC'; g.fillRect(x, hz + 20 * k - bh, bw, bh + 30 * k);
      g.fillStyle = 'rgba(255,255,255,.35)'; for (var wy = hz + 30 * k - bh; wy < hz; wy += 14 * k) g.fillRect(x + 6 * k, wy, bw - 12 * k, 3 * k); x += bw + 4 * k; }
  }
  /* ---------------- the hoarding and the ground, in front of the sky (hero px) ---------------- */
  function paintFrame(g, W, Hh, k, sx, sy) {
    var ho = sy + HO * k, fy = sy + F * k;
    g.fillStyle = C.blue; g.fillRect(0, ho, W, fy - ho);
    g.fillStyle = 'rgba(255,255,255,.12)'; for (var px = (sx % (120 * k)) - 120 * k; px < W; px += 120 * k) g.fillRect(px, ho, 3 * k, fy - ho);
    g.fillStyle = '#FFFFFF'; g.fillRect(0, ho + 12 * k, W, 6 * k); g.fillStyle = C.yellow; g.fillRect(0, ho, W, 6 * k);
    g.font = '800 ' + (13 * k) + 'px "Plus Jakarta Sans", Inter, sans-serif'; g.fillStyle = 'rgba(255,255,255,.55)';
    for (var tx = (sx % (360 * k)) - 360 * k + 40 * k; tx < W; tx += 360 * k) g.fillText('NORTHLINE BUILDERS · SAMPLE', tx, ho + 52 * k);
    var gr = g.createLinearGradient(0, fy, 0, Hh); gr.addColorStop(0, '#D5B791'); gr.addColorStop(1, '#BF9C72'); g.fillStyle = gr; g.fillRect(0, fy, W, Hh - fy);
    g.fillStyle = '#B48D62'; g.fillRect(0, fy, W, 5 * k);
    g.fillStyle = 'rgba(120,85,50,.35)'; for (var d = 0; d < 260; d++) { var gx = hash(d * 3.7) * W, gyy = fy + 10 * k + hash(d * 1.9) * (Hh - fy); g.fillRect(gx, gyy, 3 * k, 2 * k); }
    g.strokeStyle = 'rgba(140,100,60,.30)'; g.lineWidth = 9 * k; g.beginPath(); g.moveTo(sx + 600 * k, Hh); g.quadraticCurveTo(sx + 760 * k, fy + 50 * k, sx + 1100 * k, fy + 30 * k); g.moveTo(sx + 660 * k, Hh); g.quadraticCurveTo(sx + 800 * k, fy + 70 * k, sx + 1140 * k, fy + 50 * k); g.stroke();
  }


  /* ---------------- beyond the frame: the rest of the site (ext = the whole hero in set units) ----------------
     Far left: the excavator digging by its spoil heap, the gate with the security booth and its barrier. Behind the copy:
     stacked site containers, a portaloo and a pipe stack. Right: the concrete truck and the rebar stack. Workers walk the
     margins (paintLive). */
  var EX = -690, GATE = -280;
  function wideBack(g, ext) {
    if (ext.l < EX + 260) { /* the excavator's tracks, body and cab (the arm is live), the spoil heap */
      soft(g, EX + 10, F + 6, 120, 12, 0.25);
      g.fillStyle = '#9C7A55'; g.beginPath(); g.moveTo(EX + 120, F); g.quadraticCurveTo(EX + 190, F - 80, EX + 270, F); g.closePath(); g.fill();
      g.fillStyle = 'rgba(80,55,30,.25)'; for (var d = 0; d < 18; d++) g.fillRect(EX + 140 + hash(d * 2.1) * 110, F - 8 - hash(d * 3.7) * 50, 4, 3);
      fillRR(g, EX - 80, F - 30, 170, 30, 15, '#3A4A5E'); for (var w = 0; w < 6; w++) fillE(g, EX - 62 + w * 27, F - 15, 9, 9, '#5C6B7E');
      fillRR(g, EX - 64, F - 82, 136, 54, 10, C.yellow); fillRR(g, EX - 64, F - 46, 136, 10, 3, C.yellowD); fillRR(g, EX - 80, F - 74, 22, 40, 6, '#5C6B7E');
      fillRR(g, EX - 34, F - 136, 62, 58, 10, C.yellow); fillRR(g, EX - 26, F - 128, 46, 34, 5, '#7FB7E3'); g.fillStyle = 'rgba(255,255,255,.4)'; g.fillRect(EX - 22, F - 124, 10, 26);
      text(g, 'NB-EX2', EX + 2, F - 52, 9, 800, C.ink, 'center');
    }
    if (ext.l < -560) { /* a far tower crane on the skyline and the safety board on the hoarding */
      g.strokeStyle = 'rgba(150,175,200,.75)'; g.lineWidth = 2; g.beginPath(); g.moveTo(-620, HO); g.lineTo(-620, 140); g.moveTo(-608, HO); g.lineTo(-608, 140);
      for (var zy = HO; zy > 146; zy -= 14) { g.moveTo(-620, zy); g.lineTo(-608, zy - 14); } g.moveTo(-760, 146); g.lineTo(-540, 146); g.moveTo(-760, 154); g.lineTo(-540, 154);
      for (var zx = -760; zx < -540; zx += 14) { g.moveTo(zx, 154); g.lineTo(zx + 7, 146); g.lineTo(zx + 14, 154); } g.moveTo(-614, 146); g.lineTo(-614, 118); g.lineTo(-760, 146); g.moveTo(-614, 118); g.lineTo(-540, 146); g.moveTo(-700, 154); g.lineTo(-700, 214); g.stroke();
      fillRR(g, -716, 214, 32, 8, 2, 'rgba(150,175,200,.85)');
      g.fillStyle = '#8A97A8'; g.fillRect(-688, 286, 5, HO - 286); g.fillRect(-578, 286, 5, HO - 286);
      shadowed(g, 10, 4, 0.2, function () { fillRR(g, -704, 226, 144, 64, 6, '#1FA463'); }); text(g, 'SAFETY FIRST', -632, 250, 11, 800, '#FFFFFF', 'center');
      text(g, '412 days without an incident', -632, 266, 7, 700, '#DDF4EE', 'center'); text(g, 'sample site', -632, 280, 6.5, 600, 'rgba(255,255,255,.7)', 'center');
    }
    if (ext.l < GATE + 160) { /* the site gate: mesh panels, the security booth */
      g.strokeStyle = 'rgba(60,70,90,.55)'; g.lineWidth = 1.2; g.beginPath();
      for (var gx = GATE - 120; gx <= GATE - 10; gx += 10) { g.moveTo(gx, HO - 10); g.lineTo(gx, F); } for (var gy = HO - 10; gy <= F; gy += 10) { g.moveTo(GATE - 120, gy); g.lineTo(GATE - 10, gy); } g.stroke();
      fillRR(g, GATE - 124, HO - 14, 118, 6, 3, '#8A97A8'); fillRR(g, GATE - 124, F - 6, 118, 6, 3, '#8A97A8');
      soft(g, GATE + 60, F + 4, 70, 8, 0.22); fillRR(g, GATE, F - 180, 124, 180, 6, '#FFFFFF'); fillRR(g, GATE + 70, F - 150, 44, 50, 4, '#7FB7E3'); fillRR(g, GATE - 4, F - 188, 132, 14, 4, C.navy);
      text(g, 'SECURITY', GATE + 62, F - 177, 8.5, 800, '#FFFFFF', 'center'); fillRR(g, GATE + 10, F - 140, 52, 140, 3, '#D7DEE8'); fillRR(g, GATE + 16, F - 132, 40, 46, 3, '#AFC8DD'); fillRR(g, GATE + 50, F - 74, 8, 4, 2, '#5C6B7A');
      fillRR(g, GATE + 32, F - 214, 60, 22, 4, C.yellow); text(g, 'SIGN IN HERE', GATE + 62, F - 199, 7, 800, C.ink, 'center');
    }
    /* behind the copy: two stacked site containers, a portaloo, a pipe stack */
    [[-170, F - 64, '#2E7FA8', 'NORTHLINE'], [-160, F - 128, '#E0650C', 'SITE STORE']].forEach(function (c) {
      fillRR(g, c[0], c[1], 190, 64, 3, c[2]); g.fillStyle = 'rgba(0,0,0,.12)'; for (var r = c[0] + 8; r < c[0] + 190; r += 11) g.fillRect(r, c[1] + 6, 4, 52); text(g, c[3], c[0] + 95, c[1] + 38, 13, 800, 'rgba(255,255,255,.85)', 'center'); });
    soft(g, -75, F + 4, 110, 10, 0.22);
    fillRR(g, 34, F - 104, 48, 104, 6, '#3A93C0'); fillRR(g, 40, F - 96, 36, 86, 3, '#2F7FA8'); fillRR(g, 30, F - 110, 56, 10, 4, '#2F7FA8'); fillE(g, 70, F - 50, 3, 3, '#FFFFFF');
    for (var pp = 0; pp < 3; pp++) for (var pc = 0; pc < 3 - pp; pc++) { var px = -458 + pc * 22 + pp * 11, py = F - 11 - pp * 19; fillE(g, px, py, 10, 10, '#8A97A8'); fillE(g, px, py, 5.5, 5.5, '#5C6B7E'); }
    if (ext.r > 1010) { /* right: the concrete truck (its drum is live), the rebar stack */
      var TX = 1040; soft(g, TX + 90, F + 6, 110, 10, 0.25);
      fillRR(g, TX, F - 34, 190, 16, 4, '#3A4A5E'); fillRR(g, TX + 150, F - 104, 56, 72, 8, '#FFFFFF'); fillRR(g, TX + 160, F - 96, 38, 28, 4, '#7FB7E3'); fillRR(g, TX + 150, F - 40, 56, 10, 3, C.navy);
      [TX + 30, TX + 70, TX + 176].forEach(function (wx) { fillE(g, wx, F - 12, 14, 14, '#2A3550'); fillE(g, wx, F - 12, 6, 6, '#A9B4C2'); });
      g.strokeStyle = '#6B5A4A'; g.lineWidth = 3; g.beginPath(); for (var rb = 0; rb < 7; rb++) { g.moveTo(TX + 230, F - 6 - rb * 4); g.lineTo(TX + 330, F - 14 - rb * 4); } g.stroke();
      fillRR(g, TX + 262, F - 30, 10, 26, 2, '#E2553D'); fillRR(g, TX + 300, F - 34, 10, 26, 2, '#E2553D');
    }
  }
  var CREW = [{ front: true, x0: 90, x1: 520, y: 700, spd: 16, ph: 0.2, P: { s: 0.52, ph: 2.6, c: { skin: '#8D5A3B', hair: '#1F1A1A', top: '#5C6B7E', low: '#3A4A5E', shoe: '#5C4632', hat: '#FFC93C' }, outfit: 'tee', hat: 'hardhat', vest: '#D7F04B', hairStyle: 'short', beard: '#1F1A1A', short: true, mood: 'happy', look: 0, hold: 'box', hands: [[-60, -212], [64, -216]] } },
    { x0: -880, x1: -450, y: 520, spd: 20, ph: 0.45, P: { s: 0.4, ph: 1.7, c: { skin: '#F1C6A0', hair: '#C9C9C9', top: '#E2553D', low: '#3A4A5E', shoe: '#5C4632', hat: '#FFFFFF' }, outfit: 'tee', hat: 'hardhat', vest: '#FF7A1A', hairStyle: 'bun', glasses: true, clipCol: null, mood: 'calm', look: 0, hold: 'clipboard', hands: [[-58, -230], [70, -160]] } },
{ x0: -940, x1: -600, y: 476, spd: 24, ph: 0.1, P: { s: 0.36, ph: 0.3, c: { skin: '#C68B5E', hair: '#1F1A1A', top: '#5C6B7E', low: '#3A4A5E', shoe: '#5C4632', hat: '#FFC93C' }, outfit: 'tee', hat: 'hardhat', vest: '#FF7A1A', hairStyle: 'short', short: true, mood: 'calm', look: 0, hands: [[-70, -150], [70, -150]] } },
    { x0: -400, x1: 40, y: 478, spd: 18, ph: 0.6, P: { s: 0.36, ph: 1.1, c: { skin: '#6B4329', hair: '#3A2620', top: '#1F3F73', low: '#3A4A5E', shoe: '#5C4632', hat: '#FFFFFF' }, outfit: 'tee', hat: 'hardhat', vest: '#D7F04B', hairStyle: 'curly', clipCol: null, mood: 'happy', look: 0, hands: [[-70, -150], [70, -150]] } },
    { front: true, x0: -900, x1: -360, y: 640, spd: 30, ph: 0.8, P: { s: 0.46, ph: 0.6, c: { skin: '#E8B48F', hair: '#2B1D16', top: '#3A93C0', low: '#3A4A5E', shoe: '#5C4632', hat: '#FFFFFF' }, outfit: 'tee', hat: 'hardhat', vest: '#FF7A1A', hairStyle: 'long', hijab: '#5E3C8C', mood: 'calm', look: 0, hold: 'tablet', hands: [[-58, -230], [70, -160]] } },
    { x0: 1030, x1: 1340, y: 478, spd: 22, ph: 0.35, P: { s: 0.36, ph: 2.1, c: { skin: '#A86B45', hair: '#1F1A1A', top: '#E2553D', low: '#3A4A5E', shoe: '#5C4632', hat: '#FFC93C' }, outfit: 'tee', hat: 'hardhat', vest: '#FF7A1A', hairStyle: 'buzz', build: 1.15, short: true, mood: 'calm', look: 0, hold: 'box', hands: [[-60, -212], [64, -216]] } }];
  function wideLive(g, t, S) {
    var ext = S.ext;
    if (ext.l < EX + 260) { /* the excavator's arm digs */
      var dig = Math.sin(t * 0.8), a1 = -0.75 + dig * 0.18, bx = EX + 40, by = F - 100, ex = bx + Math.cos(a1) * 120, ey = by + Math.sin(a1) * 120, a2 = 1.15 + dig * 0.35, kx = ex + Math.cos(a2) * 92, ky = ey + Math.sin(a2) * 92;
      g.strokeStyle = C.yellowD; g.lineCap = 'round'; g.lineWidth = 16; g.beginPath(); g.moveTo(bx, by); g.lineTo(ex, ey); g.lineTo(kx, ky); g.stroke();
      g.save(); g.translate(kx, ky); g.rotate(a2 + 0.6 + dig * 0.4); fillRR(g, -6, -10, 40, 28, 6, '#5C6B7E'); g.restore();
    }
    if (ext.l < GATE + 160) { var up = (t % 9) < 3 ? Math.sin((t % 9) / 3 * Math.PI) : 0; g.save(); g.translate(GATE + 124, F - 46); g.rotate(-up * 1.2); fillRR(g, 0, -4, 120, 8, 4, '#FFFFFF');
      g.fillStyle = '#E2553D'; for (var st = 8; st < 120; st += 24) g.fillRect(st, -4, 12, 8); g.restore(); fillRR(g, GATE + 120, F - 54, 12, 54, 3, '#8A97A8'); }
    if (ext.r > 1010) { var TX = 1040, ang = t * 1.6; g.save(); g.translate(TX + 74, F - 74); g.rotate(-0.25); fillE(g, 0, 0, 74, 40, '#E0650C'); fillE(g, 56, 0, 18, 30, '#C9560A');
      g.strokeStyle = 'rgba(255,255,255,.5)'; g.lineWidth = 5; for (var f = 0; f < 3; f++) { var fa = ang + f * 2.1; g.beginPath(); g.moveTo(-60 * Math.cos(fa) * 0.7, -32 * Math.sin(fa)); g.lineTo(60 * Math.cos(fa) * 0.7, 32 * Math.sin(fa)); g.stroke(); } g.restore(); }
    crew(g, t, S, false);
    var span = ext.r - ext.l + 300, dx = ext.l - 150 + ((t * 34) % span), dy = 74 + Math.sin(t * 0.9) * 14, bob = Math.sin(t * 6) * 1.5;
    g.fillStyle = 'rgba(255,240,170,.10)'; g.beginPath(); g.moveTo(dx - 4, dy + 10); g.lineTo(dx + 4, dy + 10); g.lineTo(dx + 40, dy + 150); g.lineTo(dx - 40, dy + 150); g.closePath(); g.fill();
    g.strokeStyle = '#3A4A5E'; g.lineWidth = 3; g.beginPath(); g.moveTo(dx - 22, dy + bob); g.lineTo(dx + 22, dy + bob); g.stroke(); fillRR(g, dx - 12, dy - 5 + bob, 24, 12, 5, '#FFFFFF'); fillRR(g, dx - 4, dy + 6 + bob, 8, 6, 2, '#3A4A5E');
    [-22, 22].forEach(function (r) { var sp = Math.abs(Math.sin(t * 30 + r)) * 12 + 3; fillE(g, dx + r, dy - 3 + bob, sp, 2, 'rgba(90,110,130,.55)'); });
    fillE(g, dx + 10, dy - 1 + bob, 2, 2, (t % 1) < 0.5 ? '#E2553D' : '#1FA463'); text(g, 'SURVEY', dx, dy + 4 + bob, 4.5, 800, C.navy, 'center');
  }
  function crew(g, t, S, front) { var ext = S.ext;
    CREW.slice().sort(function (a, b) { return a.y - b.y; }).forEach(function (w) { var L = (w.front || w.y >= 560) ? 'fore' : w.y > 470; if (L !== front) return; var a = Math.max(w.x0, ext.l + 30), b = Math.min(w.x1, ext.r - 40); if (b - a < 60) return; K.walker(g, { x0: a, x1: b, y: w.y, spd: w.spd, ph: w.ph, P: w.P }, t); });
  }

  /* ---------------- static back props (set units) ---------------- */
  function lattice(g, x0, y0, x1, y1, n, col, wdt) { /* a crane lattice between two points, drawn as two chords and zigzags */
    var dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy), nx = -dy / L * wdt / 2, ny = dx / L * wdt / 2;
    g.strokeStyle = col; g.lineWidth = 2.4; g.beginPath(); g.moveTo(x0 + nx, y0 + ny); g.lineTo(x1 + nx, y1 + ny); g.moveTo(x0 - nx, y0 - ny); g.lineTo(x1 - nx, y1 - ny);
    for (var i = 0; i < n; i++) { var a = i / n, b = (i + 1) / n, s = i % 2 ? 1 : -1; g.moveTo(x0 + dx * a + nx * s, y0 + dy * a + ny * s); g.lineTo(x0 + dx * b - nx * s, y0 + dy * b - ny * s); } g.stroke();
  }
  function paintBack(g, ext) {
    wideBack(g, ext);
    /* the project signboard on posts above the hoarding */
    var bd = T.board; g.fillStyle = '#8A97A8'; g.fillRect(bd.x + 24, bd.y + bd.h, 6, HO - bd.y - bd.h); g.fillRect(bd.x + bd.w - 30, bd.y + bd.h, 6, HO - bd.y - bd.h);
    shadowed(g, 12, 4, 0.2, function () { fillRR(g, bd.x, bd.y, bd.w, bd.h, 6, '#FFFFFF'); });
    fillRR(g, bd.x, bd.y, bd.w, 24, 6, C.navy); g.fillStyle = C.navy; g.fillRect(bd.x, bd.y + 14, bd.w, 10); text(g, 'RIVERSIDE BLOCK B', bd.x + 12, bd.y + 17, 11, 800, '#FFFFFF');
    fillRR(g, bd.x + bd.w - 40, bd.y + 5, 32, 14, 3, C.yellow); text(g, 'SAMPLE', bd.x + bd.w - 24, bd.y + 15, 6.5, 800, C.ink, 'center');
    text(g, 'Main contractor: Northline Builders', bd.x + 10, bd.y + 42, 7.8, 700, C.ink); text(g, 'Contract value S$ 2.4M · 14 months', bd.x + 10, bd.y + 57, 7.8, 600, '#5C6B7E');
    g.fillStyle = C.yellow; g.fillRect(bd.x, bd.y + bd.h - 8, bd.w, 8); g.fillStyle = C.ink; for (var hz2 = 0; hz2 < bd.w; hz2 += 16) { g.beginPath(); g.moveTo(bd.x + hz2, bd.y + bd.h); g.lineTo(bd.x + hz2 + 8, bd.y + bd.h - 8); g.lineTo(bd.x + hz2 + 14, bd.y + bd.h - 8); g.lineTo(bd.x + hz2 + 6, bd.y + bd.h); g.closePath(); g.fill(); }
    /* the site office cabin */
    var cb = T.cabin; soft(g, cb.x + cb.w / 2, F + 4, cb.w * 0.6, 10, 0.22);
    shadowed(g, 12, 5, 0.18, function () { fillRR(g, cb.x, cb.y, cb.w, cb.h, 4, '#E6ECF3'); });
    g.fillStyle = 'rgba(30,60,90,.07)'; for (var rb = cb.x + 8; rb < cb.x + cb.w; rb += 12) g.fillRect(rb, cb.y + 8, 3, cb.h - 12);
    fillRR(g, cb.x - 4, cb.y - 6, cb.w + 8, 10, 3, '#C3CDDA');
    fillRR(g, cb.x + 10, cb.y + 22, 78, 58, 4, '#3A4A5E'); fillRR(g, cb.x + 14, cb.y + 26, 70, 50, 2, '#F4F7FB');
    text(g, 'JOB B-14', cb.x + 18, cb.y + 36, 6.5, 800, C.navy); g.fillStyle = '#D5DEE9'; g.fillRect(cb.x + 37, cb.y + 40, 1.5, 34); g.fillRect(cb.x + 60, cb.y + 40, 1.5, 34);
    fillRR(g, cb.x + 98, cb.y + 26, 36, 106, 3, '#C3CDDA'); fillRR(g, cb.x + 102, cb.y + 30, 28, 98, 2, '#DCE3EC'); fillE(g, cb.x + 126, cb.y + 82, 2.5, 2.5, '#6B7A8F');
    fillRR(g, cb.x + 94, cb.y + 10, 44, 12, 3, C.navy); text(g, 'SITE OFFICE', cb.x + 116, cb.y + 18.5, 6, 800, '#FFFFFF', 'center');
    fillRR(g, cb.x + 92, F - 8, 48, 8, 2, '#8A97A8');
    /* the whiteboard on its A-frame (its curve is live) */
    var es = T.easel; g.strokeStyle = '#8A97A8'; g.lineWidth = 4; g.lineCap = 'round'; g.beginPath(); g.moveTo(es.x + 8, F); g.lineTo(es.x + 22, es.y + 20); g.moveTo(es.x + 60, F); g.lineTo(es.x + 46, es.y + 20); g.stroke();
    soft(g, es.x + 34, F + 3, 30, 6, 0.2);
    shadowed(g, 8, 3, 0.18, function () { fillRR(g, es.x, es.y, 68, 76, 4, '#FFFFFF'); }); g.strokeStyle = '#C3CDDA'; g.lineWidth = 2; rr(g, es.x, es.y, 68, 76, 4); g.stroke();
    text(g, 'CLAIM #4', es.x + 6, es.y + 12, 6.5, 800, C.navy); g.strokeStyle = '#E3E9F2'; g.lineWidth = 1; g.beginPath(); for (var gl = 1; gl < 4; gl++) { g.moveTo(es.x + 6, es.y + 18 + gl * 13); g.lineTo(es.x + 62, es.y + 18 + gl * 13); } g.stroke();
    fillRR(g, es.x + 2, es.y + 74, 64, 4, 2, '#8A97A8');
    /* the crane mast and its base (the jib, the trolley and the load are live) */
    var cr = T.crane; fillRR(g, cr.x - 24, F - 26, 64, 26, 3, C.concreteD); lattice(g, cr.x + 8, F - 26, cr.x + 8, cr.top + 30, 26, C.yellowD, 20);
    /* the concrete frame going up */
    var b = T.bld, sl = T.slabs; soft(g, b.x + b.w / 2, F + 6, b.w * 0.6, 14, 0.2);
    fillRR(g, b.x + 22, sl[0] + 14, 72, F - sl[0] - 14, 2, '#C2674B'); g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 1.2; g.beginPath();
    for (var by = sl[0] + 22; by < F; by += 9) { g.moveTo(b.x + 22, by); g.lineTo(b.x + 94, by); for (var bx = b.x + 22 + ((by / 9) % 2 ? 9 : 0); bx < b.x + 94; bx += 18) { g.moveTo(bx, by); g.lineTo(bx, by + 9); } } g.stroke();
    fillRR(g, b.x + 112, sl[1] + 20, 72, 80, 2, '#7FB7E3'); fillRR(g, b.x + 116, sl[1] + 24, 30, 72, 1, '#A9D3F1'); fillRR(g, b.x + 150, sl[1] + 24, 30, 72, 1, '#A9D3F1');
    fillRR(g, b.x + 112, sl[0] + 24, 72, 84, 2, '#7FB7E3');
    T.cols.forEach(function (cx, i) { var topY = i < 3 ? sl[2] - 6 : sl[1]; fillRR(g, cx - 7, topY, 14, F - topY, 1, C.concrete); g.fillStyle = 'rgba(0,0,0,.08)'; g.fillRect(cx + 3, topY, 4, F - topY);
      if (i < 3) { g.strokeStyle = '#7A6A5A'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(cx - 3, topY); g.lineTo(cx - 3, topY - 18); g.moveTo(cx + 3, topY); g.lineTo(cx + 3, topY - 22); g.stroke(); } });
    fillRR(g, b.x, sl[0], b.w, 14, 1, C.concrete); fillRR(g, b.x, sl[1], b.w, 14, 1, C.concrete); fillRR(g, b.x, sl[2], 200, 12, 1, C.concrete);
    g.fillStyle = 'rgba(0,0,0,.10)'; g.fillRect(b.x, sl[0] + 10, b.w, 4); g.fillRect(b.x, sl[1] + 10, b.w, 4); g.fillRect(b.x, sl[2] + 8, 200, 4);
    /* the materials yard: a pallet of bricks, a bundle of rebar, the purchase order tag */
    var yd = T.yard; soft(g, yd.x + 56, F + 4, 64, 8, 0.22);
    fillRR(g, yd.x, F - 10, 76, 10, 2, '#B98E62'); for (var br = 0; br < 4; br++) for (var bc = 0; bc < 3; bc++) fillRR(g, yd.x + 3 + bc * 24, F - 22 - br * 12, 22, 11, 2, br % 2 ? '#C2674B' : '#B35A40');
    g.strokeStyle = '#6B5A4A'; g.lineWidth = 2.4; g.beginPath(); for (var rbx = 0; rbx < 5; rbx++) { g.moveTo(yd.x + 70, F - 6 - rbx * 3); g.lineTo(yd.x + 118, F - 12 - rbx * 3); } g.stroke();
    fillRR(g, yd.x + 88, F - 34, 16, 6, 2, '#E2553D'); fillRR(g, yd.x + 34, F - 66, 30, 20, 2, '#FFFFFF'); text(g, 'PO', yd.x + 49, F - 52, 8, 800, C.navy, 'center');
    /* the cement mixer's stand (the drum is live) and two cones */
    var mx = T.mixer; soft(g, mx.x + 44, F + 3, 50, 7, 0.22); g.strokeStyle = '#5C6B7E'; g.lineWidth = 5; g.beginPath(); g.moveTo(mx.x + 20, F - 6); g.lineTo(mx.x + 44, F - 44); g.lineTo(mx.x + 70, F - 6); g.stroke();
    fillE(g, mx.x + 18, F - 4, 8, 8, C.ink); fillE(g, mx.x + 70, F - 4, 8, 8, C.ink);
    [[mx.x + 96, 0], [mx.x + 116, 1]].forEach(function (c) { g.fillStyle = C.orange; g.beginPath(); g.moveTo(c[0] - 9, F); g.lineTo(c[0], F - 30); g.lineTo(c[0] + 9, F); g.closePath(); g.fill(); g.fillStyle = '#FFFFFF'; g.fillRect(c[0] - 5, F - 18, 10, 4); fillRR(g, c[0] - 12, F - 3, 24, 4, 2, C.ink); });
  }

  /* the open ground in front: a wheelbarrow, cement bags on a pallet, a barrier line, timber, puddles (beyond the frame and below it) */
  function foreground(g, ext) {
    var y0 = 560;
    /* a brick pallet and sandbags just in front of the hoarding line */
  }
  /* ---------------- static front props: the scaffold in front of the frame (over the foreman) ---------------- */
  function paintFront(g, ext) {
    var x0 = 548, x1 = 704, sl = T.slabs;
    g.strokeStyle = '#8A97A8'; g.lineWidth = 4; g.lineCap = 'round'; g.beginPath();
    [x0, 600, 652, x1].forEach(function (x) { g.moveTo(x, F); g.lineTo(x, sl[1] - 40); });
    [sl[0] - 4, sl[0] - 54, sl[1] - 4, sl[1] - 40].forEach(function (y) { g.moveTo(x0 - 6, y); g.lineTo(x1 + 6, y); }); g.stroke();
    g.lineWidth = 2.4; g.beginPath(); g.moveTo(x0, F); g.lineTo(600, sl[0] - 4); g.moveTo(600, F); g.lineTo(652, sl[0] - 4); g.moveTo(652, F); g.lineTo(x1, sl[0] - 4); g.stroke();
    fillRR(g, x0 - 8, sl[0] - 8, x1 - x0 + 16, 7, 2, '#C99A6B'); fillRR(g, x0 - 8, sl[1] - 8, x1 - x0 + 16, 7, 2, '#C99A6B');
    g.fillStyle = 'rgba(255,201,60,.9)'; for (var t = 0; t < 6; t++) g.fillRect(x0 + 6 + t * 26, sl[0] - 44, 14, 3);
  }

  /* ---------------- the sky: clouds and a bird or two ---------------- */
  function farCrane(g, x, top, jl, jr, a) { g.strokeStyle = 'rgba(140,165,190,' + a + ')'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(x - 5, HO); g.lineTo(x - 5, top); g.moveTo(x + 5, HO); g.lineTo(x + 5, top);
    for (var y = HO; y > top + 10; y -= 12) { g.moveTo(x - 5, y); g.lineTo(x + 5, y - 12); } g.moveTo(x - jl, top); g.lineTo(x + jr, top); g.moveTo(x - jl, top + 6); g.lineTo(x + jr, top + 6);
    for (var j = x - jl; j < x + jr; j += 12) { g.moveTo(j, top + 6); g.lineTo(j + 6, top); g.lineTo(j + 12, top + 6); } g.moveTo(x, top); g.lineTo(x, top - 22); g.lineTo(x - jl, top); g.moveTo(x, top - 22); g.lineTo(x + jr, top); g.stroke();
    g.beginPath(); g.moveTo(x + jr * 0.6, top + 6); g.lineTo(x + jr * 0.6, top + 60); g.stroke(); }
  function tower(g, x, w, top, floors) { var fh = (HO - top) / floors; g.fillStyle = 'rgba(176,190,204,.85)';
    for (var f = 0; f < floors; f++) { var y = HO - (f + 1) * fh; g.fillRect(x, y, w, 4); for (var c = 0; c <= 4; c++) g.fillRect(x + c * (w - 5) / 4, y, 5, fh); }
    g.fillStyle = 'rgba(255,201,60,.55)'; g.fillRect(x - 4, top - 10, w + 8, 10); g.fillStyle = 'rgba(120,140,160,.5)'; g.fillRect(x + w * 0.3, top - 30, 3, 20); }
  function paintWindow(g, t, par) {
    tower(g, -520 - par * 1.5, 120, 110, 9); tower(g, 1190 - par * 1.5, 110, 150, 7); tower(g, 240 - par * 1.5, 90, 200, 5);
    farCrane(g, -420 - par * 2, 70, 150, 70, 0.7); farCrane(g, 1300 - par * 2, 96, 60, 140, 0.7); farCrane(g, 120 - par * 2, 150, 90, 50, 0.45);
    for (var c = 0; c < 7; c++) K.cloud(g, -1100 + ((hash(c + 3) * 2600 + t * (3 + (c % 4) * 1.6)) % 2700) - par * (2 + c % 4), 22 + (c % 4) * 24, 0.24 + (c % 4) * 0.04); /* high in the sky, never behind a head */
    for (var b = 0; b < 4; b++) { var bx = ((t * (18 + b * 6) + b * 700) % 2400) - 900, by = 90 + b * 30 + Math.sin(t * 2 + b) * 6, fl = Math.sin(t * 10 + b) * 4;
      g.strokeStyle = 'rgba(40,60,90,.5)'; g.lineWidth = 2; g.lineCap = 'round'; g.beginPath(); g.moveTo(bx - 8, by - fl); g.quadraticCurveTo(bx - 4, by - 4, bx, by); g.quadraticCurveTo(bx + 4, by - 4, bx + 8, by - fl); g.stroke(); }
  }

  /* ---------------- live: the crane, the banner, the task board, the claim curve, the mixer ---------------- */
  function cranePos(t, S) { var tc = S.toy.crane != null ? t - S.toy.crane : 99, x = 700 + Math.sin(t * 0.25) * 90, drop = 150 + Math.sin(t * 0.6) * 10;
    if (tc < 3) { x += Math.sin(tc / 3 * Math.PI) * 60; drop -= Math.sin(tc / 3 * Math.PI) * 70; } return { x: x, drop: drop, sw: Math.sin(t * 1.3) * 0.05 + (tc < 3 ? Math.sin(tc * 5) * 0.12 * (1 - tc / 3) : 0) }; }
  function paintLive(g, t, now, S) {
    wideLive(g, t, S);
    var j = T.jib, cr = T.crane;
    /* the jib, the counter-jib, the cab and the tie lines */
    lattice(g, j.x0, j.y, j.x1, j.y, 30, C.yellowD, 12); lattice(g, cr.x + 8, j.y, 994, j.y, 6, C.yellowD, 12);
    fillRR(g, 950, j.y + 4, 40, 22, 3, '#8A97A8'); fillRR(g, 954, j.y + 8, 32, 6, 2, '#A9B4C2');
    g.strokeStyle = C.yellowD; g.lineWidth = 2.4; g.beginPath(); g.moveTo(cr.x + 8, j.y); g.lineTo(cr.x + 8, 2); g.moveTo(cr.x + 8, 2); g.lineTo(j.x0 + 40, j.y - 4); g.moveTo(cr.x + 8, 2); g.lineTo(990, j.y - 4); g.stroke();
    fillRR(g, cr.x + 12, j.y + 6, 28, 22, 4, '#FFFFFF'); fillRR(g, cr.x + 16, j.y + 10, 20, 10, 2, '#7FB7E3');
    var cp = cranePos(t, S);
    fillRR(g, cp.x - 12, j.y + 4, 24, 8, 2, '#5C6B7E');
    g.save(); g.translate(cp.x, j.y + 12); g.rotate(cp.sw); g.strokeStyle = '#3A4A5E'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, cp.drop - 20); g.stroke();
    fillRR(g, -6, cp.drop - 22, 12, 10, 2, C.yellow); g.beginPath(); g.moveTo(0, cp.drop - 12); g.lineTo(-30, cp.drop - 2); g.moveTo(0, cp.drop - 12); g.lineTo(30, cp.drop - 2); g.stroke();
    fillRR(g, -44, cp.drop - 4, 88, 10, 1, '#B35A40'); fillRR(g, -44, cp.drop - 4, 88, 3, 1, '#C77A5E'); fillRR(g, -44, cp.drop + 3, 88, 3, 1, '#8E4532'); g.restore();
    /* the progress banner on level 2 (the percentage climbs on the Track stop) */
    var bn = T.banner, tr = S.hot === 'track', pct = tr ? Math.min(62, 48 + Math.floor((t - (S.trT || 0)) * 8)) : 62, sw = Math.sin(t * 1.6) * 1.2;
    g.fillStyle = '#3A4A5E'; g.fillRect(bn.x + 6, bn.y - 6, 2, 8); g.fillRect(bn.x + bn.w - 8, bn.y - 6, 2, 8);
    fillRR(g, bn.x, bn.y + sw * 0.3, bn.w, bn.h, 3, C.navy); text(g, 'LEVEL 2', bn.x + bn.w / 2, bn.y + 14, 7.5, 800, '#BFD7F2', 'center'); text(g, pct + '%', bn.x + bn.w / 2, bn.y + 32, 14, 800, C.yellow, 'center');
    fillRR(g, bn.x + 6, bn.y + bn.h - 4, (bn.w - 12) * pct / 100, 2.5, 1, C.yellow);
    /* the task board in the cabin window: on the Set up stop a card moves to Done */
    var cb = T.cabin, su = S.hot === 'setup', mv = su ? clamp((t - (S.suT || 0)) / 1.2, 0, 1) : 1, cols = ['#FFD84A', '#7FB7E3', '#9FE3C1'];
    for (var c = 0; c < 3; c++) for (var r = 0; r < (c === 2 ? 1 : 2); r++) fillRR(g, cb.x + 18 + c * 23, cb.y + 42 + r * 12, 17, 9, 2, cols[c]);
    fillRR(g, lerp(cb.x + 18, cb.x + 64, mv), cb.y + 42 + lerp(24, 12, mv), 17, 9, 2, mv > 0.98 ? cols[2] : cols[1]);
    /* the claim curve on the whiteboard: budget dashed, cost drawn in; on the Bill stop it draws again */
    var es = T.easel, bl = S.hot === 'bill', u = bl ? clamp((t - (S.blT || 0)) / 1.6, 0, 1) : 1;
    g.strokeStyle = '#A9B4C2'; g.lineWidth = 1.6; g.setLineDash([3, 3]); g.beginPath(); g.moveTo(es.x + 8, es.y + 68); g.bezierCurveTo(es.x + 30, es.y + 66, es.x + 36, es.y + 24, es.x + 62, es.y + 22); g.stroke(); g.setLineDash([]);
    g.strokeStyle = '#E2553D'; g.lineWidth = 2.4; g.beginPath(); g.moveTo(es.x + 8, es.y + 68);
    for (var s = 1; s <= 12; s++) { var a = s / 12 * 0.62 * u, x = es.x + 8 + a * 54, y = es.y + 68 - (Math.pow(a / 0.62, 1.8)) * 0.62 * 40; g.lineTo(x, y); } g.stroke();
    if (bl && u > 0.95) { fillRR(g, es.x + 34, es.y + 50, 30, 14, 3, '#1FA463'); text(g, 'PAID', es.x + 49, es.y + 60, 6.5, 800, '#FFFFFF', 'center'); }
    /* the cement mixer's drum turns (faster when tapped) */
    var mx = T.mixer, tm = S.toy.mixer != null ? t - S.toy.mixer : 99, ang = t * 1.2 + (tm < 2.5 ? (tm - Math.sin(tm * 2) / 2) * 6 : 15);
    g.save(); g.translate(mx.x + 44, F - 56); g.rotate(-0.45); fillE(g, 0, 0, 34, 26, C.orange); fillE(g, 22, 0, 12, 18, '#E0650C'); fillE(g, 30, 0, 6, 12, '#3A2A1A');
    g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 3; for (var fin = 0; fin < 3; fin++) { var fa = ang + fin * 2.1; g.beginPath(); g.moveTo(-26 * Math.cos(fa) * 0.6 - 4, -20 * Math.sin(fa)); g.lineTo(26 * Math.cos(fa) * 0.6 - 4, 20 * Math.sin(fa)); g.stroke(); } g.restore();
    /* the purchase order tag blinks on the Buy stop */
    if (S.hot === 'buy' && Math.floor(t * 3) % 2 === 0) { var yd = T.yard; g.strokeStyle = C.yellow; g.lineWidth = 2.4; rr(g, yd.x + 32, F - 68, 34, 24, 3); g.stroke(); }
  }

  /* ---------------- live front: welding sparks on the top floor ---------------- */
  function paintFrontLive(g, t, S) {
    crew(g, t, S, true);
    var ph = t % 3.4; if (ph > 1.2) return; var sx = 734, sy = T.slabs[2] - 4;
    fillE(g, sx, sy, 5 + Math.sin(t * 40) * 1.5, 5, 'rgba(255,240,180,.95)');
    for (var i = 0; i < 9; i++) { var a = -Math.PI / 2 + (hash(i + Math.floor(t * 6)) - 0.5) * 2.6, d = 6 + hash(i * 7 + Math.floor(t * 6)) * 22;
      g.fillStyle = i % 2 ? '#FFC93C' : '#FF7A1A'; g.fillRect(sx + Math.cos(a) * d, sy + Math.sin(a) * d + d * 0.4, 2.4, 2.4); }
  }

  var SITI = { x: 404, y: 486, s: 0.56, ph: 0.6, c: { skin: '#D9A07A', hair: '#2B1D16', top: '#1F3F73', low: '#3A4A5E', shoe: '#5C4632', hat: '#FFFFFF' }, outfit: 'tee', hat: 'hardhat', vest: C.orange, hold: 'tablet',
    hairStyle: 'pony', clipCol: null, feet: true, mood: 'calm', look: -0.4, talk: false, hands: [[-58, -230], [70, -160]] };
  var BEN = { x: 630, y: 356, s: 0.38, ph: 1.9, c: { skin: '#B9845F', hair: '#1F1A1A', top: '#5C6B7E', low: '#3A4A5E', shoe: '#5C4632', hat: C.yellow }, outfit: 'tee', hat: 'hardhat', vest: '#D7F04B',
    hairStyle: 'short', short: true, feet: true, mood: 'calm', look: 0.5, talk: false, hands: [[-70, -150], [72, -150]] };

  var y0 = 560;
  /* the foreground, nearest last: each prop stands at a y, sorted with the front-row passers-by (K.zfore) */
  function FORE() {
    return [
      [0, function (g, ext) {
    g.fillStyle = 'rgba(150,190,220,.45)'; [[-300, 640, 60], [120, 720, 80], [1080, 650, 50]].forEach(function (pd) { if (pd[0] > ext.l && pd[0] < ext.r) { g.beginPath(); g.ellipse(pd[0], pd[1], pd[2], pd[2] * 0.18, 0, 0, Math.PI * 2); g.fill(); } });
      }],
      [600, function (g, ext) {
    var px = 120; soft(g, px + 40, 604, 56, 7, 0.25); fillRR(g, px, 588, 84, 12, 2, '#B98E62'); for (var br = 0; br < 4; br++) for (var bc = 0; bc < 4; bc++) fillRR(g, px + 4 + bc * 19 + (br % 2) * 4, 572 - br * 13, 17, 12, 2, br % 2 ? '#C0664A' : '#B4573C');
      }],
      [572, function (g, ext) {
    if (ext.l < -600) { fillRR(g, -860, y0 + 10, 120, 12, 3, '#B98E62'); for (var b = 0; b < 3; b++) for (var c = 0; c < 4 - b; c++) fillRR(g, -856 + c * 28 + b * 14, y0 - 12 - b * 20, 26, 20, 5, b % 2 ? '#E6E1D6' : '#D9D3C6');
      text(g, 'CEMENT', -800, y0 - 2, 7, 800, '#8A7F6E', 'center'); soft(g, -800, y0 + 26, 70, 8, 0.25); }
      }],
      [606, function (g, ext) {
    if (ext.l < -420) { var wx = -560, wy = y0 + 44; soft(g, wx, wy + 18, 56, 7, 0.25); g.fillStyle = '#5C6B7E'; g.beginPath(); g.moveTo(wx - 50, wy - 30); g.lineTo(wx + 34, wy - 30); g.lineTo(wx + 22, wy); g.lineTo(wx - 38, wy); g.closePath(); g.fill();
      g.fillStyle = '#D5B791'; g.beginPath(); g.ellipse(wx - 8, wy - 30, 40, 9, 0, Math.PI, 0); g.fill(); fillE(g, wx - 46, wy + 8, 11, 11, C.ink); g.strokeStyle = '#3A4A5E'; g.lineWidth = 4; g.beginPath(); g.moveTo(wx + 22, wy - 8); g.lineTo(wx + 70, wy - 26); g.moveTo(wx - 30, wy); g.lineTo(wx - 30, wy + 16); g.stroke(); }
      }],
      [586, function (g, ext) {
    if (ext.r > 960) { for (var tb = 0; tb < 4; tb++) fillRR(g, 960 + tb * 4, 568 - tb * 9, 150, 9, 2, tb % 2 ? '#C99A6B' : '#B98552'); soft(g, 1036, 584, 80, 7, 0.25);
      g.fillStyle = C.orange; g.beginPath(); g.moveTo(1150, 600); g.lineTo(1162, 562); g.lineTo(1174, 600); g.closePath(); g.fill(); g.fillStyle = '#FFFFFF'; g.fillRect(1156, 580, 12, 5); }
      }],
      [694, function (g, ext) {
    for (var bx = -380; bx < -60; bx += 64) { if (bx < ext.l) continue; fillRR(g, bx, 660, 58, 16, 4, '#FFFFFF'); g.fillStyle = '#E2553D'; for (var st = 4; st < 58; st += 16) g.fillRect(bx + st, 660, 8, 16); g.fillStyle = '#5C6B7E'; g.fillRect(bx + 6, 676, 4, 18); g.fillRect(bx + 48, 676, 4, 18); }
      }],
      [700, function (g, ext) {
    if (ext.r > 1180) { /* a mobile light tower */ var lx = 1250; soft(g, lx, 700, 60, 8, 0.25); fillRR(g, lx - 50, 640, 100, 46, 8, C.yellow); fillE(g, lx - 30, 690, 12, 12, C.ink); fillE(g, lx + 30, 690, 12, 12, C.ink);
      g.fillStyle = '#8A97A8'; g.fillRect(lx - 4, 420, 8, 220); fillRR(g, lx - 52, 396, 104, 30, 4, '#3A4A5E'); for (var lp = 0; lp < 4; lp++) fillRR(g, lx - 46 + lp * 24, 400, 20, 22, 3, '#FFF6D2'); }
      }],
      [730, function (g, ext) {
    if (ext.l < -620) { /* a mini dumper loaded with sand */ var mx = -720, my = 730; soft(g, mx, my + 4, 90, 9, 0.25); g.fillStyle = C.orange; g.beginPath(); g.moveTo(mx - 90, my - 70); g.lineTo(mx + 10, my - 70); g.lineTo(mx - 6, my - 26); g.lineTo(mx - 76, my - 26); g.closePath(); g.fill();
      g.fillStyle = '#D5B791'; g.beginPath(); g.ellipse(mx - 40, my - 70, 48, 12, 0, Math.PI, 0); g.fill(); fillRR(g, mx - 80, my - 30, 150, 14, 4, '#3A4A5E'); fillRR(g, mx + 20, my - 76, 44, 50, 6, '#3A4A5E'); fillRR(g, mx + 26, my - 98, 6, 24, 2, '#3A4A5E'); fillRR(g, mx + 52, my - 98, 6, 24, 2, '#3A4A5E'); fillRR(g, mx + 22, my - 102, 40, 6, 3, C.yellow);
      fillE(g, mx - 54, my - 10, 22, 22, C.ink); fillE(g, mx - 54, my - 10, 9, 9, '#A9B4C2'); fillE(g, mx + 46, my - 10, 22, 22, C.ink); fillE(g, mx + 46, my - 10, 9, 9, '#A9B4C2'); }
      }]
    ];
  }
  window.IXW.worlds.construction = {
    calmView: [105,-60,850,680], /* calm layer: the framed hero shows the core of the scene */
    pan: [-420, 1280], /* phones: how far the scene drags each way (set units), ending on whole objects */
    paintBg: paintBg, paintFrame: paintFrame, windowBehind: true, paintBack: paintBack, paintFront: paintFront, paintWindow: paintWindow, paintLive: paintLive, paintFrontLive: paintFrontLive, paintForeLive: function (g, t, S) { K.zfore(g, t, S, FORE(), function () { crew(g, t, S, 'fore'); }); },
    motes: false,
    glow: {
      win: function (g) { var bd = T.board; rr(g, bd.x - 8, bd.y - 8, bd.w + 16, bd.h + 16, 12); },
      setup: function (g) { var cb = T.cabin; rr(g, cb.x - 8, cb.y - 12, cb.w + 16, cb.h + 16, 12); },
      buy: function (g) { var yd = T.yard; rr(g, yd.x - 8, F - 74, 132, 82, 12); },
      site: function (g) { var cr = T.crane; rr(g, cr.x - 20, cr.top - 8, 56, F - cr.top + 4, 12); },
      track: function (g) { var bn = T.banner; rr(g, bn.x - 8, bn.y - 10, bn.w + 16, bn.h + 18, 10); },
      bill: function (g) { var es = T.easel; rr(g, es.x - 8, es.y - 8, 84, 92, 10); },
      mixer: function (g) { var mx = T.mixer; rr(g, mx.x - 4, F - 92, 96, 96, 14); },
      crane: function (g) { rr(g, 590, T.jib.y + 80, 260, 120, 14); }
    },
    backGlow: ['win', 'setup', 'buy', 'site', 'track', 'bill', 'mixer', 'crane'],
    cast: [
      { id: 'ben', behind: true, keys: ['site', 'track'], P: BEN, act: function (P, t, S) {
        var st = S.cast.ben, busy = S.hot === 'site' || S.hot === 'track';
        P.talk = t < st.until; P.mood = P.talk || busy ? 'happy' : 'calm';
        P.hands = t < st.wave ? [[-70, -150], [118 + Math.sin(t * 12) * 16, -420]] : busy ? [[-70, -150], [86, -330 + Math.abs(Math.sin(t * 6)) * 30]] : [[-70, -150], [72, -150]];
        P.look = lerp(P.look, clamp((S.nexi.x - P.x) / 160, -1, 1), 0.08);
      } },
      { id: 'siti', keys: ['setup', 'bill', 'win'], P: SITI, act: function (P, t, S) {
        var st = S.cast.siti, on = S.hot === 'setup' || S.hot === 'bill', waving = t < st.wave;
        P.talk = t < st.until; P.mood = P.talk || on ? 'happy' : 'calm';
        P.hop = waving ? Math.abs(Math.sin(t * 7)) * 12 : 0;
        P.hands = waving ? [[-58, -230], [118 + Math.sin(t * 12) * 16, -420]] : on ? [[-58, -236 + Math.sin(t * 3) * 6], [74, -238]] : [[-58, -230], [70, -160]];
        P.look = lerp(P.look, clamp((S.nexi.x - P.x) / 160, -1, 1), 0.08);
      } }
    ],
    onStop: function (key, S, t) { if (key === 'setup') S.suT = t; if (key === 'track') S.trT = t; if (key === 'bill') S.blT = t; if (key === 'site') S.toy.crane = t; }
  };
  /* ---------------- audit round: the setting-out crew's total station on its tripod behind the card (its laser sweeps to
     a target pole; tap it: it beeps and logs a point), and a line of water-filled barriers with cones right of the caption ---------------- */
  var TS = { x: -70, y: 612, log: -9 };
  function exFore(g, t, S) {
    var ext = S.ext;
    if (ext.l < 40) { var x = TS.x, y = TS.y, d = t - TS.log; soft(g, x, y + 3, 40, 6, 0.24);
      g.strokeStyle = '#E9B949'; g.lineWidth = 4; g.beginPath(); g.moveTo(x, y - 70); g.lineTo(x - 30, y); g.moveTo(x, y - 70); g.lineTo(x + 30, y); g.moveTo(x, y - 70); g.lineTo(x + 4, y + 2); g.stroke();
      fillRR(g, x - 16, y - 96, 32, 26, 5, '#F2C230'); fillRR(g, x - 10, y - 90, 14, 12, 3, '#1E2A33'); fillE(g, x + 10, y - 84, 4, 4, Math.floor(t * 2) % 2 ? '#3CCFAE' : '#1FA463');
      var tx = x + 170, ty = y - 6; g.strokeStyle = '#FFFFFF'; g.lineWidth = 3; g.beginPath(); g.moveTo(tx, ty); g.lineTo(tx, ty - 110); g.stroke(); for (var b = 0; b < 4; b++) fillRR(g, tx - 2, ty - 110 + b * 26, 4, 13, 1, '#E2553D'); fillE(g, tx, ty - 114, 7, 7, '#E2553D');
      var sweep = 0.5 + 0.5 * Math.sin(t * 1.6); g.strokeStyle = 'rgba(226,85,61,' + (d >= 0 && d < 1.5 ? 0.9 : 0.35 * sweep) + ')'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(x + 16, y - 84); g.lineTo(tx, ty - 60 - sweep * 30); g.stroke();
      if (d >= 0 && d < 2.2) { fillRR(g, x - 40, y - 132, 80, 22, 8, '#FFFFFF'); text(g, 'point logged', x, y - 117, 8.5, 800, '#1E2A33', 'center'); } }
    if (ext.r > 970) { var bx = 900, by = 648; for (var i = 0; i < 2; i++) { var xx = bx + i * 46; soft(g, xx + 20, by + 3, 30, 5, 0.22); fillRR(g, xx, by - 40, 42, 40, 8, i % 2 ? '#FFFFFF' : '#E2553D'); fillRR(g, xx + 4, by - 30, 34, 6, 3, 'rgba(0,0,0,.08)'); }
      var cx = 1004, cy = 650; soft(g, cx, cy + 2, 18, 4, 0.2); g.fillStyle = '#FF7A1A'; g.beginPath(); g.moveTo(cx - 14, cy); g.lineTo(cx - 4, cy - 40); g.lineTo(cx + 4, cy - 40); g.lineTo(cx + 14, cy); g.closePath(); g.fill(); fillRR(g, cx - 9, cy - 24, 18, 6, 2, '#FFFFFF'); fillRR(g, cx - 18, cy - 4, 36, 5, 2, '#E06A10'); }
  }
  function exHit(x, y, S, t) { if (Math.abs(x - TS.x) < 45 && y > TS.y - 110 && y < TS.y + 10) { TS.log = t; return true; } return false; }
  (function (W) { var pf = W.paintForeLive, h0 = W.hit;
    W.paintForeLive = function (g, t, S) { exFore(g, t, S); pf(g, t, S); };
    W.hit = function (x, y, S, t, onBtn) { if (!onBtn && exHit(x, y, S, t)) return null; return h0 ? h0(x, y, S, t, onBtn) : null; };
  })(window.IXW.worlds.construction);
})(window.IXW && window.IXW.kit);
