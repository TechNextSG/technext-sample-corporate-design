/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* Office life for the Company scenes (About, Singapore HQ, Taguig City, Ho Chi Minh City): what makes each person their own
   character. COL.tap() gives every cast member a tap clock (the engine sets st.wave on a tap) so a world can play its own
   choreography instead of the shared CR moves; COL.hand() says where a hand is in set units, so a world can put a mug, a
   marker, a sticky note or a phone in it; small live props (steam, a swaying plant, lanterns, birds, a robot vacuum) and
   "extras": people a world draws itself (no hotspot button) that still idle in their own way and answer a tap through
   world.hit(). Everything is drawn in set units with the engine's kit. */
(function (K, CR) {
  'use strict';
  if (!K || !CR) return;
  var fillRR = K.fillRR, fillE = K.fillE, text = K.text, clamp = K.clamp, lerp = K.lerp, hash = K.hash, rr = K.rr;
  var F3 = K.F3;
  function bell(u) { return u <= 0 || u >= 1 ? 0 : Math.sin(u * Math.PI); }
  function ease(u) { u = clamp(u, 0, 1); return u * u * (3 - 2 * u); }
  var COL = window.COL = {
    bell: bell, ease: ease,
    /* the tap clock: e = seconds since this person's last tap (99 when never), n = how many taps so far */
    tap: function (st, t) {
      if (st.wave && st.wave !== st._cw) { st._cw = st.wave; st._ct = st.wave - 1.6; st._cn = (st._cn || 0) + 1; }
      return { e: st._ct == null ? 99 : t - st._ct, n: st._cn || 0 };
    },
    /* back to a neutral pose before a frame's idle and tap moves */
    reset: function (P, hands) { P.sx = 1; P.tilt = 0; P.hop = 0; P.idSwing = 0; P.mood = 'calm'; if (hands) P.hands = hands.map(function (h) { return h.slice(); }); },
    /* where hand i (0 left, 1 right) is, in set units: the engine's arm reach (two segments from the shoulder) applied */
    hand: function (P, i) {
      var h = P.hands[i], d = i ? 1 : -1, bw = P.build || 1, sxk = P.sx == null ? 1 : P.sx, sx = d * F3.shx * bw, sy = F3.shy;
      var dx = h[0] - sx, dy = h[1] - sy, L = clamp(Math.hypot(dx, dy), Math.abs(F3.a - F3.b) + 1, F3.a + F3.b - 1), an = Math.atan2(dy, dx);
      var hx = sx + Math.cos(an) * L, hy = sy + Math.sin(an) * L, drop = P.sit ? (P.sitDrop != null ? P.sitDrop : 46) : 0;
      return [P.x + hx * P.s * sxk, P.y + (hy - (P.hop || 0) + drop) * P.s];
    },
    head: function (P) { var drop = P.sit ? (P.sitDrop != null ? P.sitDrop : 46) : 0; return [P.x, P.y + (F3.hy - (P.hop || 0) + drop) * P.s]; },

    /* ---------------- small props ---------------- */
    mug: function (g, x, y, s, col, band) { g.save(); g.translate(x, y); g.scale(s, s);
      g.strokeStyle = col || '#FFFFFF'; g.lineWidth = 3; g.beginPath(); g.arc(9, -8, 5, -1.2, 1.2); g.stroke();
      fillRR(g, -9, -18, 18, 20, 4, col || '#FFFFFF'); if (band) fillRR(g, -9, -14, 18, 5, 1, band); g.restore(); },
    cup: function (g, x, y, s, ice) { /* a tall glass: iced coffee with a straw */
      g.save(); g.translate(x, y); g.scale(s, s); fillRR(g, -8, -26, 16, 28, 3, 'rgba(255,255,255,.75)'); fillRR(g, -6.5, -16, 13, 17, 2, '#8A5A3B'); fillRR(g, -6.5, -16, 13, 5, 2, '#E9D2B4');
      if (ice) { fillRR(g, -5, -24, 5, 5, 1, 'rgba(255,255,255,.9)'); fillRR(g, 1, -22, 5, 5, 1, 'rgba(255,255,255,.85)'); }
      g.strokeStyle = '#E0456B'; g.lineWidth = 2; g.beginPath(); g.moveTo(2, -26); g.lineTo(6, -36); g.stroke(); g.restore(); },
    steam: function (g, x, y, t, a, n) { n = n || 3; for (var i = 0; i < n; i++) { var u = ((t * 0.9 + i / n) % 1); g.globalAlpha = (1 - u) * (a == null ? 0.6 : a); fillE(g, x + Math.sin(t * 2.4 + i * 2) * 3 * (0.4 + u), y - u * 26, 2.6 + u * 2.4, 2.6 + u * 2.4, '#FFFFFF'); } g.globalAlpha = 1; },
    note: function (g, x, y, w, rot, col, label, ink) { g.save(); g.translate(x, y); g.rotate(rot || 0);
      g.fillStyle = 'rgba(20,30,60,.12)'; g.fillRect(-w / 2 + 1.5, -w / 2 + 2.5, w, w); fillRR(g, -w / 2, -w / 2, w, w, 1.5, col || '#FFE680'); g.fillStyle = 'rgba(0,0,0,.06)'; g.fillRect(-w / 2, -w / 2, w, w * 0.18);
      if (label) text(g, label, 0, w * 0.12, Math.max(4.4, w * 0.2), 800, ink || '#1B1F3B', 'center'); g.restore(); },
    marker: function (g, x, y, rot, col) { g.save(); g.translate(x, y); g.rotate(rot || 0); fillRR(g, -2.6, -14, 5.2, 18, 2.4, '#FFFFFF'); fillRR(g, -2.6, -14, 5.2, 5, 2, col || '#3167CA'); fillRR(g, -1.6, 3, 3.2, 4, 1, col || '#3167CA'); g.restore(); },
    sheet: function (g, x, y, rot, w, h, lines) { g.save(); g.translate(x, y); g.rotate(rot || 0); fillRR(g, -w / 2, -h / 2, w, h, 1.5, '#FFFFFF'); g.strokeStyle = 'rgba(30,60,110,.15)'; g.lineWidth = 0.8; g.strokeRect(-w / 2, -h / 2, w, h);
      g.fillStyle = '#C9D3E3'; for (var i = 0; i < (lines || 4); i++) g.fillRect(-w / 2 + 3, -h / 2 + 4 + i * 4, (i % 2 ? 0.55 : 0.8) * (w - 6), 1.6); g.restore(); },
    phone: function (g, x, y, rot, lit) { g.save(); g.translate(x, y); g.rotate(rot || 0); fillRR(g, -5, -9, 10, 18, 2.5, '#2A3550'); fillRR(g, -4, -7.5, 8, 15, 1.5, lit ? '#9FE3FF' : '#3A4458'); g.restore(); },
    laptop: function (g, x, y, s, lid, scr) { g.save(); g.translate(x, y); g.scale(s, s); fillRR(g, -26, -2, 52, 6, 2, '#AEB8C8'); g.save(); g.translate(0, -2); g.scale(1, lid == null ? 1 : lid); fillRR(g, -23, -32, 46, 32, 3, '#2A3550'); fillRR(g, -20, -29, 40, 26, 2, scr || '#E9F1FF'); g.restore(); g.restore(); },
    /* a speech bubble with a tail pointing down at (x, y) */
    bubble: function (g, x, y, s, a, fg, bg, w) { if (a <= 0.01) return; w = w || Math.max(30, s.length * 4.6 + 14); g.save(); g.globalAlpha = clamp(a, 0, 1);
      fillRR(g, x - w / 2, y - 26, w, 18, 9, bg || '#FFFFFF'); g.beginPath(); g.moveTo(x - 4, y - 8.5); g.lineTo(x, y - 2); g.lineTo(x + 4, y - 8.5); g.closePath(); g.fillStyle = bg || '#FFFFFF'; g.fill();
      g.strokeStyle = 'rgba(30,60,110,.18)'; g.lineWidth = 1; rr(g, x - w / 2, y - 26, w, 18, 9); g.stroke(); text(g, s, x, y - 14, 7.6, 800, fg || '#1B1F3B', 'center'); g.restore(); },
    /* a badge that pops up and fades: ✓ Merged, Quack!, ... */
    pop: function (g, x, y, s, u, bg, fg) { if (u < 0 || u > 1) return; var k = u < 0.2 ? ease(u / 0.2) : 1, a = u > 0.75 ? (1 - u) / 0.25 : 1, w = s.length * 4.8 + 16;
      g.save(); g.globalAlpha = a; g.translate(x, y - 10 * ease(u / 0.4)); g.scale(k, k); fillRR(g, -w / 2, -10, w, 20, 10, bg || '#0E7A50'); text(g, s, 0, 3.4, 8.4, 800, fg || '#FFFFFF', 'center'); g.restore(); },

    /* ---------------- ambient life ---------------- */
    /* a potted floor plant whose leaves sway (live; keep it small) */
    swayPlant: function (g, x, y, t, s, pot, rim, seed) { s = s || 1; seed = seed || 0; g.save(); g.translate(x, y); g.scale(s, s);
      var lv = [[-30, -150, 20, 46, -0.6], [26, -160, 20, 48, 0.55], [-8, -190, 18, 50, -0.1], [-38, -100, 18, 36, -1], [36, -110, 18, 38, 1], [10, -128, 16, 40, 0.3]];
      g.strokeStyle = '#2E9E66'; g.lineWidth = 4; g.lineCap = 'round';
      lv.forEach(function (L, i) { var w = Math.sin(t * 1.1 + i * 1.7 + seed) * 4 * (L[1] / -150); g.beginPath(); g.moveTo(0, -48); g.quadraticCurveTo(L[0] * 0.3, L[1] * 0.6, L[0] + w, L[1] + 20); g.stroke();
        g.beginPath(); g.ellipse(L[0] + w, L[1], L[2], L[3], L[4] + w * 0.02, 0, Math.PI * 2); g.fillStyle = i % 2 ? '#3FBF7F' : '#35AE70'; g.fill(); });
      fillRR(g, -26, -52, 52, 52, 10, pot || '#FFFFFF'); fillRR(g, -30, -56, 60, 12, 6, rim || '#E3E9F3'); g.restore(); },
    /* a macramé planter hanging from y0, trailing leaves that sway */
    hangPlant: function (g, x, y0, len, t, s, seed) { s = s || 1; seed = seed || 0; var sw = Math.sin(t * 0.9 + seed) * 0.05;
      g.save(); g.translate(x, y0); g.rotate(sw); g.strokeStyle = '#C9A27A'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(0, 0); g.lineTo(-12 * s, len); g.moveTo(0, 0); g.lineTo(12 * s, len); g.moveTo(0, 0); g.lineTo(0, len); g.stroke();
      fillRR(g, -15 * s, len, 30 * s, 20 * s, 8 * s, '#F4EEE4'); g.fillStyle = '#C9A27A'; g.fillRect(-15 * s, len + 6 * s, 30 * s, 2);
      for (var v = 0; v < 4; v++) { var vx = (-12 + v * 8) * s, vl = (26 + hash(v + seed) * 34) * s; for (var l = 0; l < 5; l++) { var ly = len + 12 * s + l * vl / 5, lx = vx + Math.sin(t * 1.3 + l + v + seed) * 2.5 * (l / 5); fillE(g, lx + (l % 2 ? 3 : -3) * s, ly, 4.6 * s, 3 * s, l % 2 ? '#3FBF7F' : '#2E9E66'); } }
      fillE(g, -6 * s, len - 2 * s, 9 * s, 6 * s, '#35AE70'); fillE(g, 7 * s, len - 3 * s, 8 * s, 6 * s, '#3FBF7F'); g.restore(); },
    /* a silk lantern (Hội An style) on a string, swaying */
    lantern: function (g, x, y0, len, t, col, s, seed, glow) { s = s || 1; var sw = Math.sin(t * 1.1 + (seed || 0)) * 0.07 + (glow ? Math.sin(t * 10) * 0.2 * glow : 0);
      g.save(); g.translate(x, y0); g.rotate(sw); g.strokeStyle = '#9AA6BC'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, len); g.stroke(); g.translate(0, len); g.scale(s, s);
      if (glow) fillE(g, 0, 30, 40, 40, 'rgba(255,190,110,' + (0.35 * glow).toFixed(3) + ')');
      fillE(g, 0, 30, 20, 26, col); g.strokeStyle = 'rgba(0,0,0,.18)'; g.lineWidth = 1.2; for (var q = -2; q <= 2; q++) { g.beginPath(); g.ellipse(0, 30, Math.abs(q) * 5 + 0.5, 26, 0, 0, Math.PI * 2); g.stroke(); }
      fillE(g, -6, 22, 4, 9, 'rgba(255,255,255,.25)'); fillRR(g, -8, 2, 16, 5, 2, '#F2B233'); fillRR(g, -8, 53, 16, 5, 2, '#F2B233'); g.strokeStyle = '#F2B233'; g.lineWidth = 1.6; g.beginPath(); for (var f = -4; f <= 4; f += 2) { g.moveTo(f, 58); g.lineTo(f * 1.3, 74 + Math.sin(t * 3 + f) * 1.5); } g.stroke(); g.restore(); },
    /* a parol: the Filipino star lantern of the "ber" months, a five-point star with a ring and two tails */
    parol: function (g, x, y0, len, t, col, col2, s, seed, spin) { s = s || 1; var sw = Math.sin(t * 0.8 + (seed || 0)) * 0.06;
      g.save(); g.translate(x, y0); g.rotate(sw); g.strokeStyle = '#9AA6BC'; g.lineWidth = 1.3; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, len); g.stroke(); g.translate(0, len + 30 * s); g.scale(s, s);
      g.strokeStyle = col2; g.lineWidth = 3; g.beginPath(); g.arc(0, 0, 29, 0, Math.PI * 2); g.stroke();
      g.save(); g.rotate((spin || 0) * Math.PI * 2 / 5); g.beginPath(); for (var i = 0; i < 10; i++) { var r = i % 2 ? 11 : 27, a = -Math.PI / 2 + i * Math.PI / 5; g.lineTo(Math.cos(a) * r, Math.sin(a) * r); } g.closePath(); g.fillStyle = col; g.fill();
      g.beginPath(); for (var j = 0; j < 10; j++) { var r2 = j % 2 ? 5 : 13, a2 = -Math.PI / 2 + j * Math.PI / 5; g.lineTo(Math.cos(a2) * r2, Math.sin(a2) * r2); } g.closePath(); g.fillStyle = 'rgba(255,255,255,.55)'; g.fill(); g.restore();
      g.strokeStyle = col; g.lineWidth = 2.2; [-9, 9].forEach(function (d, k) { g.beginPath(); g.moveTo(d * 0.6, 26); g.quadraticCurveTo(d + Math.sin(t * 2 + k) * 3, 46, d * 1.2 + Math.sin(t * 2.4 + k) * 4, 64); g.stroke(); fillE(g, d * 1.2 + Math.sin(t * 2.4 + k) * 4, 66, 3, 3, col2); });
      g.restore(); },
    /* a few birds crossing the sky */
    birds: function (g, t, x0, x1, y, n, col) { g.strokeStyle = col || 'rgba(60,80,110,.5)'; g.lineWidth = 1.5; g.lineCap = 'round'; var span = x1 - x0 + 200;
      for (var i = 0; i < n; i++) { var bx = x0 - 100 + ((t * (14 + i * 2.5) + i * 197) % span), by = y + i * 14 + Math.sin(t * 1.3 + i) * 5, fl = Math.sin(t * 8 + i * 2) * 3;
        g.beginPath(); g.moveTo(bx - 5, by - fl); g.quadraticCurveTo(bx - 2.5, by - 2.5, bx, by); g.quadraticCurveTo(bx + 2.5, by - 2.5, bx + 5, by - fl); g.stroke(); } },
    /* a small robot vacuum that roams the floor between x0 and x1 (tap it: a spin) */
    vac: function (g, V, t, x0, x1, y, col) { var span = x1 - x0, p = (t * 22 + (V.ph || 0)) % (span * 2), x = x0 + (p < span ? p : span * 2 - p), dir = p < span ? 1 : -1, sp = t - (V.t || -9);
      V.x = x; V.y = y; g.save(); g.translate(x, y); if (sp < 1.2) g.rotate(Math.sin(sp * 14) * 0.3);
      fillE(g, 0, 4, 26, 6, 'rgba(22,40,80,.16)'); fillE(g, 0, -4, 22, 8, '#E9EEF6'); fillE(g, 0, -7, 22, 7, '#FFFFFF'); fillE(g, 0, -9, 9, 3.4, col || '#3167CA');
      fillE(g, dir * 15, -6, 2.4, 2.4, Math.floor(t * 2) % 2 ? '#2BC48A' : '#B8F0D8'); g.strokeStyle = 'rgba(30,60,110,.25)'; g.lineWidth = 1; g.beginPath(); g.moveTo(dir * 20, -2); g.lineTo(dir * 26, 2 + Math.sin(t * 30) * 2); g.stroke(); g.restore();
      if (sp < 1.6) COL.pop(g, x, y - 26, 'Beep boop!', sp / 1.6, '#3167CA'); },

    /* ---------------- extras: people a world draws itself, each with its own idle and tap moves ---------------- */
    /* X: { P, hands, box: [cx, cy, w, h], who, role, lines [], near [x, y], pose, fx [burst per move], dur [seconds per move],
           idle(P, t, S, X), moves [fn(P, u, t, S, X)], after(g, P, t, S, X, u, k) (props drawn over the person) } */
    draw: function (list, g, t, S) {
      list.forEach(function (X) { var P = X.P; COL.reset(P, X.hands); P.talk = false; var e = t - (X.tT == null ? -99 : X.tT), k = X.k || 0, d = (X.dur && X.dur[k]) || 1.6, u = e / d;
        if (X.idle) X.idle(P, t, S, X);
        if (u >= 0 && u < 1 && X.moves && X.moves[k]) { P.talk = true; P.mood = 'happy'; X.moves[k](P, u, t, S, X); } else u = -1;
        K.person(g, P, t); if (X.after) X.after(g, P, t, S, X, u, k); });
    },
    hit: function (list, x, y, t) {
      for (var i = list.length - 1; i >= 0; i--) { var X = list[i], b = X.box; if (!b || Math.abs(x - b[0]) > b[2] / 2 || Math.abs(y - b[1]) > b[3] / 2) continue;
        X.n = (X.n || 0) + 1; X.k = X.moves ? (X.n - 1) % X.moves.length : 0; X.tT = t; var fx = X.fx && X.fx[X.k]; if (fx) CR.burst(fx, X.P.x, X.P.y - 430 * X.P.s, t);
        return { say: X.lines[(X.n - 1) % X.lines.length], near: X.near, pose: X.pose || 'clap', who: X.who, role: X.role }; }
      return null;
    }
  };
})(window.IXW && window.IXW.kit, window.CR);
