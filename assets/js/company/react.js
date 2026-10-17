/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* Click reactions for the people in the Company scenes (About, the three offices, Careers, Blog, the team page). The world
   engine (industry-world.js) already makes a tapped staff member wave and talk; this adds a different move on every tap —
   jump, spin, cheer, dance, flash the TechNext ID, think, type — with confetti, stars, hearts or notes, and makes the
   passers-by tappable too. A world file uses it like this:
     cast act():     CR.cast(P, S.cast[id], t, ['jump', 'id', 'spin'])      (call it last; it overrides the pose while it plays)
     walkers:        CR.walk(g, W, t) in place of IXW.kit.walker(g, W, t)    (W gets .label, .lines, .acts)
     hit():          var r = CR.hitWalker(x, y, t); if (r) return r;
     paint*Live():   CR.draw(g, t)                                           (the particles, on top) */
(function (K) {
  'use strict';
  if (!K) return;
  var reduce = K.reduce, clamp = K.clamp;
  var CONF = ['#3167CA', '#14A38B', '#F08A24', '#FFD84A', '#FF8FA3'];
  var parts = [], walkers = [];
  var ACT = {
    wave: { dur: 1.6, fx: 'spark', pose: function (P, u, t) { P.mood = 'happy'; P.hands = [P.hands0[0], [128 + Math.sin(t * 14) * 18, -404]]; P.hop = Math.max(0, Math.sin(u * Math.PI * 2)) * 10; } },
    jump: { dur: 0.9, fx: 'star', pose: function (P, u) { P.mood = u < 0.5 ? 'wow' : 'happy'; P.hop = Math.sin(u * Math.PI) * 90; P.hands = [[-110, -380], [110, -380]]; } },
    spin: { dur: 1.0, fx: 'spark', pose: function (P, u) { P.mood = 'happy'; P.sx = Math.cos(u * Math.PI * 2); P.hop = Math.sin(u * Math.PI) * 24; } },
    cheer: { dur: 1.5, fx: 'conf', pose: function (P, u, t) { P.mood = 'happy'; P.hands = [[-100 + Math.sin(t * 16) * 8, -420], [100 - Math.sin(t * 16) * 8, -420]]; P.hop = Math.abs(Math.sin(u * Math.PI * 3)) * 26; } },
    dance: { dur: 2.0, fx: 'note', pose: function (P, u, t) { var b = Math.sin(t * 9); P.mood = 'happy'; P.tilt = b * 0.14; P.hop = Math.abs(b) * 16; P.hands = b > 0 ? [[-120, -400], [80, -170]] : [[-80, -170], [120, -400]]; } },
    love: { dur: 1.6, fx: 'heart', pose: function (P, u) { P.mood = 'happy'; P.hands = [[-40, -250], [40, -250]]; P.hop = Math.sin(u * Math.PI) * 10; } },
    think: { dur: 1.8, fx: 'ask', pose: function (P) { P.mood = 'calm'; P.tilt = -0.08; P.hands = [P.hands0[0], [40, -330]]; } },
    id: { dur: 1.8, fx: 'spark', pose: function (P, u, t) { P.mood = 'happy'; P.idSwing = t * 6; P.hands = [P.hands0[0], [70, -250]]; P.hop = Math.sin(u * Math.PI) * 8; } },
    type: { dur: 1.5, fx: 'code', pose: function (P, u, t) { P.mood = 'happy'; var k = Math.abs(Math.sin(t * 22)) * 12, h0 = P.sit ? -196 : -196; P.hands = [[-70, h0 - k], [60, h0 - (12 - k)]]; } },
    nod: { dur: 1.2, fx: 'spark', pose: function (P, u, t) { P.mood = 'happy'; P.tilt = Math.sin(t * 10) * 0.08; } }
  };
  function burst(kind, x, y, t) {
    if (!kind || reduce) return; var n = kind === 'conf' ? 22 : kind === 'code' ? 6 : 8;
    for (var i = 0; i < n; i++) { var a = -Math.PI / 2 + (Math.random() - 0.5) * (kind === 'conf' ? 2.6 : 1.8), v = 70 + Math.random() * (kind === 'conf' ? 180 : 80);
      parts.push({ k: kind, x: x + (Math.random() - 0.5) * 40, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, t0: t + i * (kind === 'note' || kind === 'heart' ? 0.12 : 0.01), life: kind === 'conf' ? 1.4 : 1.6, c: CONF[i % 5], r: Math.random() * 6 }); }
  }
  function start(P, st, t, acts) {
    var a = acts[(st.rxI = (st.rxI || 0) + 1) % acts.length]; st.rx = a; st.rxT = t;
    burst(ACT[a].fx, P.x, P.y - 470 * P.s, t);
  }
  function applyPose(P, st, t) {
    if (!P.hands0) P.hands0 = P.hands.map(function (h) { return h.slice(); });
    if (P.tilt0 == null) P.tilt0 = P.tilt || 0; P.sx = 1; P.idSwing = 0; P.tilt = P.tilt0;
    if (!st.rx) return false; var A = ACT[st.rx], u = (t - st.rxT) / A.dur; if (u < 0 || u >= 1) { st.rx = ''; return false; }
    P.talk = true; A.pose(P, u, t); return true;
  }
  var CR = window.CR = {
    ACT: ACT, burst: burst,
    /* a staff member: a tap (the engine sets st.wave) starts their next move */
    cast: function (P, st, t, acts) {
      if (st.wave && st.wave !== st._seen) { st._seen = st.wave; start(P, st, t, acts || ['wave', 'jump', 'id', 'spin', 'cheer']); }
      return applyPose(P, st, t);
    },
    /* a passer-by: walks (IXW.kit.walker) or, while reacting, stops and plays the move */
    walk: function (g, W, t) { if (window.IXW && IXW.kit && IXW.kit.calm) return; /* CALM: no passers-by */
      var P = W.P, st = W.st || (W.st = {}); if (walkers.indexOf(W) < 0) walkers.push(W);
      if (st.rx && P._w) { if (!applyPose(P, st, t)) { K.walker(g, W, t); return; } P._w.tx = P._w.x; P._w.until = t + 0.6; P._w.t = t; P.feet = true; K.person(g, P, t); return; }
      K.walker(g, W, t);
    },
    hitWalker: function (x, y, t) {
      for (var i = walkers.length - 1; i >= 0; i--) { var W = walkers[i], P = W.P, s = P.s; if (!P._w) continue;
        if (Math.abs(x - P.x) < 90 * s && y < P.y + 10 && y > P.y - 500 * s) {
          if (!P.hands0) P.hands0 = [[-70, -150], [70, -150]]; P.hands = P.hands0;
          start(P, W.st || (W.st = {}), t, W.acts || ['wave', 'jump', 'id', 'spin', 'cheer']);
          var ln = W.lines ? W.lines[(W.li = (W.li || 0) + 1) % W.lines.length] : 'Hello from the TechNext team!';
          return { say: ln, near: [clamp(P.x, 200, 900), clamp(P.y - 320, 40, 200)], pose: 'clap', who: W.label };
        } }
      return null;
    },
    draw: function (g, t) {
      parts = parts.filter(function (p) { return t - p.t0 < p.life; });
      parts.forEach(function (p) { var u = t - p.t0; if (u < 0) return; var a = 1 - u / p.life, x = p.x + p.vx * u, y = p.y + p.vy * u + (p.k === 'conf' ? 180 * u * u : -24 * u);
        g.save(); g.globalAlpha = clamp(a * 1.4, 0, 1); g.translate(x, y);
        if (p.k === 'conf') { g.rotate(u * 8 + p.r); g.fillStyle = p.c; g.fillRect(-4, -6, 8, 12); }
        else if (p.k === 'heart') { g.fillStyle = '#FF6F91'; g.beginPath(); g.moveTo(0, 6); g.bezierCurveTo(-14, -4, -8, -16, 0, -8); g.bezierCurveTo(8, -16, 14, -4, 0, 6); g.fill(); }
        else if (p.k === 'note') { g.fillStyle = p.c; g.font = '800 22px ' + K.FONT; g.fillText(p.r > 3 ? '♪' : '♫', -6, 6); }
        else if (p.k === 'ask') { g.fillStyle = '#3167CA'; g.font = '800 24px ' + K.FONT; g.fillText('?', -6, 8); }
        else if (p.k === 'code') { g.fillStyle = '#14A38B'; g.font = '800 15px ui-monospace, Consolas, monospace'; g.fillText(['{ }', '</>', 'def', '01'][Math.floor(p.r) % 4], -10, 4); }
        else { g.rotate(u * 3); g.fillStyle = p.k === 'star' ? '#FFC94A' : '#FFFFFF'; g.strokeStyle = 'rgba(49,103,202,.55)'; g.lineWidth = 1.5; g.beginPath();
          for (var i = 0; i < 10; i++) { var rr = i % 2 ? 4 : 10; g.lineTo(Math.cos(i * Math.PI / 5) * rr, Math.sin(i * Math.PI / 5) * rr); } g.closePath(); g.fill(); g.stroke(); }
        g.restore(); });
    },
    /* the TechNext team: Asian skin tones and straight dark hair, semi-casual clothes, everyone with a TechNext ID */
    skin: ['#F6D9BF', '#F0CBA8', '#E8BC95', '#DDAE86', '#D29E74'], hair: ['#1A1414', '#241A16', '#2E211B', '#3A2A20'],
    who: function (o) {
      return { x: o.x || 0, y: o.y || 0, s: o.s || 0.54, ph: o.ph || 0, c: { skin: CR.skin[o.skin || 0], hair: CR.hair[o.hair || 0], top: o.top || '#3167CA', top2: o.top2 || '#FFFFFF', shirt: '#FFFFFF', low: o.low || '#2A3550', shoe: o.shoe || '#2A3550', print: o.print, pocket: o.pocket, hat: o.hat },
        outfit: o.outfit || 'polo', hairStyle: o.style || 'short', clipCol: o.clip || null, glasses: !!o.glasses, hold: o.hold, headset: o.headset, idcard: o.id || '#3167CA', short: o.outfit === 'polo' || !!o.short,
        feet: o.feet !== false, sit: !!o.sit, chair: o.chair, chairCol: o.chairCol, mood: 'calm', look: o.look || 0, talk: false, hands: o.hands || [[-70, -150], [70, -150]], build: o.build, hat: o.hatKind };
    }
  };
  /* live local times on the page ([data-cp-clock] = the city's UTC offset; Singapore and Manila +8, Ho Chi Minh City +7) */
  function clocks() {
    var els = [].slice.call(document.querySelectorAll('[data-cp-clock]')); if (!els.length) return;
    function tick() { els.forEach(function (el) { var d = new Date(Date.now() + (+el.getAttribute('data-cp-clock') || 8) * 3600e3), h = d.getUTCHours(), m = d.getUTCMinutes(), sp = el.querySelector('span') || el;
      sp.textContent = (h % 12 || 12) + ':' + (m < 10 ? '0' : '') + m + ' ' + (h < 12 ? 'am' : 'pm'); }); }
    tick(); setInterval(tick, 20000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', clocks); else clocks();
})(window.IXW && window.IXW.kit);
