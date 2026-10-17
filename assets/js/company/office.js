/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* Shared painters for the Company page scenes (set units; the world engine's kit does the rest): the three cities' skylines,
   glass walls, ceilings and floors, desks with monitors, screens that scroll code, wall clocks on a city's time, the TechNext
   logo. Each page composes its own room from these (assets/js/worlds/office-*.js, careers.js, blog.js, team.js). */
(function (K) {
  'use strict';
  if (!K) return;
  var fillRR = K.fillRR, fillE = K.fillE, hash = K.hash, text = K.text, soft = K.soft, shadowed = K.shadowed;
  function tower(g, x, w, top, col, base, wc, seed) { g.fillStyle = col; g.fillRect(x, top, w, base - top); if (wc) wins(g, x, top, w, base - top, wc, seed || 0); }
  function wins(g, x, y, w, h, col, seed) { g.fillStyle = col; for (var fy = y + 6; fy < y + h - 4; fy += 9) for (var fx = x + 4; fx < x + w - 4; fx += 7) if (hash(fx * 0.37 + fy * 1.3 + seed) > 0.55) g.fillRect(fx, fy, 3, 3.4); }
  var CO = window.CO = {
    C: { blue: '#3167CA', blueD: '#1E4691', ink: '#1B1F3B', sg: '#3167CA', ph: '#14A38B', vn: '#E07B12', odoo: '#714B67', white: '#FFFFFF' },
    tower: tower, wins: wins,
    /* sky: a vertical gradient over the whole hero (stops: [[0, col], [1, col]]) */
    sky: function (g, e, y0, y1, stops) { var sg = g.createLinearGradient(0, y0, 0, y1); stops.forEach(function (s) { sg.addColorStop(s[0], s[1]); }); g.fillStyle = sg; g.fillRect(e.l, e.t, e.r - e.l, y1 - e.t); },
    /* Singapore: hazy towers, the bay, the three towers under their sky park, the observation wheel, the garden's tree towers */
    skySG: function (g, x0, x1, hz, land, k) {
      k = k || {}; var hazy = k.hazy || 'rgba(160,185,225,.55)', near = k.near || ['#B3C7E6', '#A6BDE2'], lit = k.lit || 'rgba(255,255,255,.55)', icon = k.icon || '#9DB6DC';
      for (var i = 0; i < 40; i++) { var fx = x0 + i * 40 + hash(i) * 20; if (fx > x1) break; tower(g, fx, 22 + hash(i + 9) * 18, hz - 30 - hash(i * 3) * 70, hazy, land); }
      g.fillStyle = k.water || 'rgba(120,170,215,.55)'; g.fillRect(x0, land - 6, x1 - x0, 60);
      var mx = k.mbs != null ? k.mbs : x0 + (x1 - x0) * 0.58;
      if (mx > x0 + 20 && mx < x1 - 60) { [0, 34, 68].forEach(function (d, i) { g.fillStyle = icon; g.beginPath(); g.moveTo(mx + d, land); g.lineTo(mx + d + 4, hz - 112 - i * 2); g.lineTo(mx + d + 22, hz - 112 - i * 2); g.lineTo(mx + d + 24, land); g.closePath(); g.fill(); });
        fillRR(g, mx - 10, hz - 124, 118, 12, 6, k.park || '#8AA7D4'); }
      var wx = k.wheel != null ? k.wheel : x0 + (x1 - x0) * 0.2, wy = hz - 66;
      if (wx > x0 && wx < x1 - 40) { g.strokeStyle = k.wheelCol || '#A8BDE0'; g.lineWidth = 3; g.beginPath(); g.arc(wx, wy, 54, 0, 7); g.stroke(); g.lineWidth = 1.2; for (var s = 0; s < 12; s++) { var a = s * Math.PI / 6; g.beginPath(); g.moveTo(wx, wy); g.lineTo(wx + Math.cos(a) * 54, wy + Math.sin(a) * 54); g.stroke(); }
        g.lineWidth = 4; g.beginPath(); g.moveTo(wx - 30, land); g.lineTo(wx, wy); g.lineTo(wx + 30, land); g.stroke(); }
      for (var c = 0; c < 30; c++) { var cx = x0 + 30 + c * 52; if (cx > x1 - 20) break; if (Math.abs(cx - mx - 30) < 70) continue; var h = 120 + hash(c + 40) * 120; tower(g, cx, 30, land - h, near[c % 2], land + 60, lit, c); }
      if (k.trees !== false) for (var tr = 0; tr < 4; tr++) { var tx = mx + 120 + tr * 30; if (tx > x1 - 10) break; g.fillStyle = k.treeCol || '#9C8FCB'; g.fillRect(tx - 2, land - 50, 4, 56); g.beginPath(); g.moveTo(tx - 16, land - 56); g.lineTo(tx + 16, land - 56); g.lineTo(tx + 3, land - 44); g.lineTo(tx - 3, land - 44); g.closePath(); g.fill(); }
    },
    /* Taguig City: the hills, a dense business district of glass towers, one slender tall tower */
    skyPH: function (g, x0, x1, hz, land, k) {
      k = k || {};
      g.fillStyle = k.hill || 'rgba(150,190,200,.5)'; g.beginPath(); g.moveTo(x0, hz); for (var hx = x0; hx <= x1; hx += 20) g.lineTo(hx, hz - 16 - Math.sin(hx * 0.02) * 12); g.lineTo(x1, hz); g.closePath(); g.fill();
      for (var i = 0; i < 60; i++) { var fx = x0 + i * 26 + hash(i + 70) * 10; if (fx > x1) break; tower(g, fx, 20, hz - 20 - hash(i + 71) * 50, k.hazy || 'rgba(160,200,205,.55)', land); }
      var cols = k.near || ['#9FD3CB', '#B4DDD6', '#A7C9D9'];
      for (var c = 0; c < 60; c++) { var cx = x0 + 6 + c * 30; if (cx > x1 - 10) break; var h = 90 + hash(c + 20) * 130, w = 24 + hash(c + 2) * 10;
        tower(g, cx, w, land - h, cols[c % 3], land + 60, k.lit || 'rgba(255,255,255,.6)', c + 9); g.fillStyle = 'rgba(255,255,255,.3)'; g.fillRect(cx + 3, land - h, 3, h); }
      var tx = k.tall != null ? k.tall : x0 + (x1 - x0) * 0.55;
      if (tx > x0 && tx < x1 - 30) { g.fillStyle = k.tallCol || '#8CC7BE'; g.beginPath(); g.moveTo(tx, land); g.lineTo(tx + 4, hz - 192); g.lineTo(tx + 16, hz - 208); g.lineTo(tx + 28, hz - 192); g.lineTo(tx + 32, land); g.closePath(); g.fill(); wins(g, tx + 4, hz - 182, 26, land - hz + 182, k.lit || 'rgba(255,255,255,.6)', 3); }
      g.fillStyle = k.low || '#B9D9CF'; for (var lr = x0; lr < x1; lr += 18) g.fillRect(lr, land + 6 - hash(lr) * 14, 16, 60);
    },
    /* Ho Chi Minh City: the low city, the river with its bend and boats, the tall stepped tower, the tulip tower with its helipad */
    skyVN: function (g, x0, x1, hz, land, k) {
      k = k || {};
      for (var i = 0; i < 60; i++) { var fx = x0 + i * 24 + hash(i + 120) * 10; if (fx > x1) break; tower(g, fx, 18, hz - 10 - hash(i + 121) * 30, k.hazy || 'rgba(235,190,150,.45)', land); }
      g.fillStyle = k.river || 'rgba(140,175,205,.75)'; g.beginPath(); g.moveTo(x0, land + 16); g.bezierCurveTo(x0 + (x1 - x0) * 0.3, land - 4, x1 - (x1 - x0) * 0.3, land + 30, x1, land + 4); g.lineTo(x1, land + 40); g.lineTo(x0, land + 40); g.closePath(); g.fill();
      var lx = k.landmark != null ? k.landmark : x0 + (x1 - x0) * 0.66, lt = k.lmCols || ['#D5A87F', '#DDB38D', '#E5BE9A', '#ECC9A8'];
      if (lx > x0 && lx < x1 - 30) { g.fillStyle = lt[0]; g.fillRect(lx, land - 150, 40, 150); g.fillStyle = lt[1]; g.fillRect(lx + 5, land - 196, 30, 50); g.fillStyle = lt[2]; g.fillRect(lx + 10, land - 230, 20, 36); g.fillStyle = lt[3]; g.fillRect(lx + 15, land - 252, 10, 24);
        g.fillStyle = '#C69A72'; g.fillRect(lx + 19, land - 270, 2, 20); wins(g, lx, land - 150, 40, 150, k.lit || 'rgba(255,255,255,.55)', 11); }
      var bx = k.tulip != null ? k.tulip : x0 + (x1 - x0) * 0.28;
      if (bx > x0 && bx < x1 - 20) { g.fillStyle = k.tulipCol || '#C9B3A0'; g.beginPath(); g.moveTo(bx, land); g.quadraticCurveTo(bx - 4, land - 110, bx + 8, land - 150); g.lineTo(bx + 22, land - 160); g.quadraticCurveTo(bx + 30, land - 100, bx + 28, land); g.closePath(); g.fill();
        fillE(g, bx + 20, land - 108, 16, 4, '#B89E8A'); wins(g, bx + 4, land - 140, 20, 138, k.lit || 'rgba(255,255,255,.5)', 7); }
      var cols = k.near || ['#E9C9AC', '#DDBFA6'];
      for (var c = 0; c < 40; c++) { var cx = x0 + 10 + c * 46; if (cx > x1 - 10) break; if (Math.abs(cx - lx) < 46 || Math.abs(cx - bx) < 36) continue; var h = 50 + hash(c + 33) * 70; tower(g, cx, 28, land - h, cols[c % 2], land + 60, k.lit || 'rgba(255,255,255,.5)', c + 30); }
    },
    /* a glass curtain wall: diagonal glints, mullions every `step`, a transom */
    glass: function (g, e, top, bot, step, col, transom) {
      g.fillStyle = 'rgba(255,255,255,.16)'; for (var gx = Math.floor(e.l / step) * step; gx < e.r; gx += step) { g.beginPath(); g.moveTo(gx + 20, bot); g.lineTo(gx + 44, top); g.lineTo(gx + 58, top); g.lineTo(gx + 34, bot); g.closePath(); g.fill(); }
      g.fillStyle = col || '#E8EEF7'; for (var mx = Math.floor(e.l / step) * step; mx < e.r; mx += step) g.fillRect(mx - 2.5, top, 5, bot - top);
      if (transom != null) g.fillRect(e.l, transom, e.r - e.l, 4);
    },
    ceiling: function (g, e, y, c0, c1, lights) {
      var cg = g.createLinearGradient(0, e.t, 0, y); cg.addColorStop(0, c0 || '#E9EEF6'); cg.addColorStop(1, c1 || '#F8FAFD'); g.fillStyle = cg; g.fillRect(e.l, e.t, e.r - e.l, y - e.t);
      g.fillStyle = 'rgba(30,60,110,.08)'; g.fillRect(e.l, y - 3, e.r - e.l, 3);
      if (lights) for (var lx = Math.floor(e.l / 160) * 160; lx < e.r; lx += 160) { fillRR(g, lx + 30, y - 22, 100, 7, 3, lights); g.save(); var lg = g.createLinearGradient(0, y, 0, y + 120); lg.addColorStop(0, 'rgba(255,255,250,.3)'); lg.addColorStop(1, 'rgba(255,255,250,0)'); g.fillStyle = lg;
        g.beginPath(); g.moveTo(lx + 30, y); g.lineTo(lx + 130, y); g.lineTo(lx + 160, y + 120); g.lineTo(lx, y + 120); g.closePath(); g.fill(); g.restore(); }
    },
    floor: function (g, e, F, c0, c1, lines) {
      var fg = g.createLinearGradient(0, F, 0, e.b); fg.addColorStop(0, c0); fg.addColorStop(1, c1); g.fillStyle = fg; g.fillRect(e.l, F, e.r - e.l, e.b - F);
      g.fillStyle = 'rgba(40,70,120,.10)'; g.fillRect(e.l, F, e.r - e.l, 6);
      if (lines) { g.strokeStyle = lines; g.lineWidth = 1.5; g.beginPath(); for (var d = 1; d < 7; d++) { var yy = F + Math.pow(d / 6, 1.5) * (e.b - F); g.moveTo(e.l, yy); g.lineTo(e.r, yy); } g.stroke(); }
    },
    /* the TechNext paper plane */
    plane: function (g, x, y, s, rot, col, fold) { g.save(); g.translate(x, y); g.rotate(rot || 0); g.scale(s, s);
      g.beginPath(); g.moveTo(-10.5, -2.2); g.lineTo(10.5, -10); g.lineTo(5.9, 10.4); g.lineTo(0.7, 3.3); g.lineTo(-3.4, 7.8); g.lineTo(-3, 1.5); g.closePath(); g.fillStyle = col; g.fill();
      if (fold) { g.strokeStyle = fold; g.lineWidth = 1.3; g.lineCap = 'round'; g.beginPath(); g.moveTo(-3, 1.5); g.lineTo(10.5, -10); g.moveTo(0.7, 3.3); g.lineTo(-3, 1.5); g.stroke(); } g.restore(); },
    logo: function (g, x, y, s, col, bg) { CO.plane(g, x - 70 * s, y - 10 * s, 2.4 * s, 0, col, bg); text(g, 'TechNext', x - 38 * s, y, 34 * s, 800, col); },
    /* a desk seen from the front: the top, the modesty panel, two monitors on arms (their screens are drawn live) */
    desk: function (g, x, y, w, F, k) {
      k = k || {}; soft(g, x + w / 2, F + 4, w * 0.6, 9, 0.22);
      if (k.open) { /* an open desk: legs and a back rail, so whoever sits at it shows their legs and chair */
        var lc = k.legs || '#7A869C'; fillRR(g, x + 6, y + 8, 8, F - y - 8, 3, lc); fillRR(g, x + w - 14, y + 8, 8, F - y - 8, 3, lc); fillRR(g, x + 6, F - 6, 30, 6, 3, lc); fillRR(g, x + w - 36, F - 6, 30, 6, 3, lc);
        g.fillStyle = 'rgba(30,60,110,.18)'; g.fillRect(x + 14, y + 22, w - 28, 5); }
      else { fillRR(g, x, y + 10, w, F - y - 10, 6, k.panel || '#F4F7FC'); g.fillStyle = 'rgba(30,60,110,.06)'; g.fillRect(x + w - 12, y + 10, 12, F - y - 10); }
      fillRR(g, x - 6, y, w + 12, 12, 5, k.top || '#C9A27A'); g.fillStyle = 'rgba(255,255,255,.3)'; g.fillRect(x - 4, y + 2, w + 8, 2);
      (k.mons || []).forEach(function (m) { g.fillStyle = '#5C6B7A'; g.fillRect(m[0] + m[1] / 2 - 2, y - 26, 4, 26); fillRR(g, m[0] + m[1] / 2 - 14, y - 4, 28, 5, 2, '#5C6B7A'); fillRR(g, m[0], y - 26 - (m[2] || 48), m[1], m[2] || 48, 5, '#2A3550'); });
    },
    /* a screen's content, live: kind = code | dark | chart | odoo */
    screen: function (g, x, y, w, h, t, kind, fast) {
      var dark = kind === 'dark' || kind === 'code'; fillRR(g, x, y, w, h, 2, dark ? '#1E2A3A' : '#FFFFFF');
      if (kind === 'chart') { for (var b = 0; b < 5; b++) { var bh = (0.3 + 0.6 * Math.abs(Math.sin(b * 1.7 + t * (fast ? 2 : 0.4)))) * (h - 12); fillRR(g, x + 6 + b * (w - 12) / 5, y + h - 4 - bh, (w - 12) / 5 - 4, bh, 1.5, ['#3167CA', '#14A38B', '#F2B233', '#714B67', '#E07B12'][b]); } return; }
      if (kind === 'odoo') { fillRR(g, x, y, w, 7, 2, '#714B67'); for (var a = 0; a < 6; a++) fillRR(g, x + 5 + (a % 3) * (w - 10) / 3, y + 11 + Math.floor(a / 3) * 14, (w - 10) / 3 - 4, 10, 2, ['#3167CA', '#14A38B', '#F2B233', '#714B67', '#E0456B', '#3FA9E0'][a]); return; }
      var n = Math.floor((h - 6) / 7);
      for (var l = 0; l < n; l++) { var ww = 8 + hash(l + x + Math.floor(t * (fast ? 8 : 1.5))) * (w - 20); fillRR(g, x + 5 + (l % 2) * 6, y + 5 + l * 7, ww, 3.4, 1.5, dark ? ['#7FE3C4', '#FFD84A', '#9FC4FF'][l % 3] : ['#3167CA', '#C9D3E3', '#14A38B'][l % 3]); }
    },
    /* a wall clock on a city's time (UTC offset) */
    clock: function (g, x, y, r, off, rim) {
      var d = new Date(Date.now() + off * 3600e3); K.clockFace(g, { x: x, y: y, r: r }, rim); K.clockHands(g, { x: x, y: y, r: r }, d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds());
    },
    timeLine: function (off, city, tail) { var d = new Date(Date.now() + off * 3600e3), h = d.getUTCHours(), m = d.getUTCMinutes(); return "It's **" + (h % 12 || 12) + ':' + (m < 10 ? '0' : '') + m + ' ' + (h < 12 ? 'am' : 'pm') + '** in ' + city + (tail ? ', ' + tail : '.'); },
    plaque: function (g, x, y, w, h, title, sub, col) { shadowed(g, 10, 4, 0.16, function () { fillRR(g, x, y, w, h, 10, '#FFFFFF'); }); fillRR(g, x, y, w, 18, 10, col || '#714B67'); g.fillRect(x, y + 10, w, 8); text(g, title, x + w / 2, y + h / 2 + 10, 12, 800, '#1B1F3B', 'center'); if (sub) text(g, sub, x + w / 2, y + h / 2 + 24, 7.5, 700, '#5C5C73', 'center'); },
    /* a passer-by's walk cycle, kept on one object so CR can make them react */
    crew: function (list, g, t, S, layer) { var ext = S.ext; if (window.IXW && IXW.kit && IXW.kit.calm) return; /* CALM: no passers-by */
      list.forEach(function (w) { var L = (w.front || w.y >= 560) ? 'fore' : w.y > 470; if (L !== layer) return; var a = Math.max(w.x0, ext.l + 40), b = Math.min(w.x1, ext.r - 50); if (b - a < 60) return;
        var Wk = w._W || (w._W = { y: w.y, spd: w.spd, ph: w.ph, P: w.P, label: w.label, lines: w.lines, acts: w.acts }); Wk.x0 = a; Wk.x1 = b; window.CR.walk(g, Wk, t); }); }
  };
})(window.IXW && window.IXW.kit);
