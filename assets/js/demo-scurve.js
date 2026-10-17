/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* Construction page demo: a twelve-month project S-curve with earned value. PV is the budget of the work
   scheduled to date, EV the budget of the work actually done (% complete x budget), AC the actual cost
   from the project's analytic account; CPI = EV / AC, SPI = EV / PV, EAC = BAC / CPI. Approved variation
   orders add to the contract and to the budget from the month they are approved. Each month's progress
   claim is the certified work done to date, less retention (5% or 10%, limited to 5% of the contract sum),
   less previous claims, plus GST 9%. Subcontractor claims are certified with retention held from them, and
   the retention ledger shows both sides with their release dates. Drag the "as of" marker (or use the
   arrow keys): actuals after that month dim and the forecast is redrawn from what was known then. */
TN.demo('scurve', function (root, K) {
  'use strict';
  var chart = K.$('.scv-chart', root), svg = K.$('.scv-svg', root), handle = K.$('.scv-handle', root), hLab = K.$('b', handle);
  var R = {};
  'date pv ev ac cpi cpit spi spit eac eact prog stack costs claimh inv claim vos subs rate ledger rel cpib spib'.split(' ').forEach(function (k) { R[k] = K.$('[data-r="' + k + '"]', root); });
  var tip = K.tip(chart);

  var MON = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');
  var FULL = 'January February March April May June July August September October November December'.split(' ');
  var END = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  var BAC0 = 1250000, CS0 = 1480000, CAP = CS0 * .05, DATA = 8, YMAX = 1500000, GST = .09, HOUR = 36;
  var PLAN = [2, 4, 7, 10, 12, 13, 13, 12, 10, 8, 6, 3];                       // % of the base budget per month
  var ACT = [1.9, 3.8, 6.4, 8.6, 10.8, 11.8, 11.9, 11.2];                      // % of base scope done per month
  var FAC = [1, .99, 1.01, 1.04, 1.08, 1.07, 1.04, 1.02];                      // cost of the work done vs its budget
  // variation orders: ref, name, month approved (0 = pending), contract value, budget, planned months, % done by month
  var VO = [['VO-01', 'Additional loading bay', 4, 64000, 52000, [5, 6, 7], [0, 0, 0, 0, 25, 40, 25, 10]],
            ['VO-02', 'Upgraded fire protection', 7, 38000, 31000, [8, 9, 10], [0, 0, 0, 0, 0, 0, 0, 20]],
            ['VO-03', 'Extra car park lighting', 0, 18000, 0, [], []]];
  // subcontracts: name, value, % certified by month
  var SUB = [['Piling & foundations', 120000, [10, 30, 35, 25, 0, 0, 0, 0]], ['Structural steel', 260000, [0, 0, 3, 12, 25, 25, 20, 15]],
             ['M&E services', 210000, [0, 0, 0, 0, 4, 8, 14, 18]]];
  var C = { pv: 'var(--tok-stock)', ev: 'var(--ok)', ac: 'var(--tok-late)', sub: 'var(--tok-make)', mat: 'var(--tok-stock)', lab: 'var(--tok-pay)', plant: 'var(--tok-buy)' };

  // ------------------------------------------------------------------ the numbers, month by month (index 0 = start)
  var pv = [0], ev = [0], ac = [0], bac = [BAC0], cert = [0], voCert = [0], subC = [[0, 0, 0]], pcA = [0];
  (function () {
    var cp = 0, ca = 0;
    for (var m = 1; m <= 12; m++) {
      cp += PLAN[m - 1];
      var p = BAC0 * cp / 100, b = BAC0;
      VO.forEach(function (v) { if (v[2] && m >= v[2]) b += v[4]; if (v[5].length) p += v[4] * v[5].filter(function (x) { return x <= m; }).length / v[5].length; });
      pv[m] = p; bac[m] = b;
      if (m > DATA) continue;
      ca += ACT[m - 1]; pcA[m] = ca;
      var e = BAC0 * ca / 100, cv = CS0 * ca / 100, vc = 0;
      VO.forEach(function (v) { var d = v[6].slice(0, m).reduce(function (s, x) { return s + x; }, 0) / 100; e += v[4] * d; vc += v[3] * d; });
      ev[m] = e; ac[m] = ac[m - 1] + (e - ev[m - 1]) * FAC[m - 1]; cert[m] = cv + vc; voCert[m] = vc;
      subC[m] = SUB.map(function (s) { return s[1] * s[2].slice(0, m).reduce(function (a, x) { return a + x; }, 0) / 100; });
    }
  })();
  var rate = .05, asOf = DATA, pos = DATA;
  function ret(m) { return Math.min(rate * cert[m], CAP); }
  function net(m) { return m ? cert[m] - ret(m) : 0; }
  function sret(i, m) { return Math.min(rate * subC[m][i], SUB[i][1] * .05); }
  function eac(m) { return bac[m] * ac[m] / ev[m]; }
  function sgd(v) { return (v < 0 ? '−' : '') + 'S$ ' + Math.round(Math.abs(v)).toLocaleString('en-SG'); }
  function kfmt(v) { return v >= 1e6 ? (v / 1e6).toFixed(2).replace(/\.?0+$/, '') + 'M' : v ? Math.round(v / 1e3) + 'k' : '0'; }

  // ------------------------------------------------------------------ chart
  var W = 1, H = 1, L = 58, RP = 44, T = 30, B = 96, PW = 1, PH = 1, SY = 1;
  var g = {};
  function x(t) { return L + t / 12 * PW; }
  function y(v) { return T + (1 - v / YMAX) * PH; }
  function f(v) { return v.toFixed(1); }
  function mono(pts) {                                            // monotone cubic: smooth, no overshoot
    var n = pts.length, dx = [], m = [], tg = [], i;
    for (i = 0; i < n - 1; i++) { dx[i] = pts[i + 1][0] - pts[i][0]; m[i] = (pts[i + 1][1] - pts[i][1]) / dx[i]; }
    tg[0] = m[0]; tg[n - 1] = m[n - 2];
    for (i = 1; i < n - 1; i++) tg[i] = m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2;
    for (i = 0; i < n - 1; i++) {
      if (!m[i]) { tg[i] = tg[i + 1] = 0; continue; }
      var a = tg[i] / m[i], b = tg[i + 1] / m[i], s = a * a + b * b;
      if (s > 9) { var k = 3 / Math.sqrt(s); tg[i] = k * a * m[i]; tg[i + 1] = k * b * m[i]; }
    }
    var d = 'M' + f(pts[0][0]) + ' ' + f(pts[0][1]);
    for (i = 0; i < n - 1; i++) { var h = dx[i] / 3; d += 'C' + f(pts[i][0] + h) + ' ' + f(pts[i][1] + tg[i] * h) + ' ' + f(pts[i + 1][0] - h) + ' ' + f(pts[i + 1][1] - tg[i + 1] * h) + ' ' + f(pts[i + 1][0]) + ' ' + f(pts[i + 1][1]); }
    return d;
  }
  function curve(arr, to) { var p = []; for (var t = 0; t <= to; t++) p.push([x(t), y(arr[t])]); return mono(p); }
  function el(tag, attrs, parent) { var n = K.svg(tag, attrs); (parent || svg).appendChild(n); return n; }
  function draw() {
    W = chart.clientWidth; H = chart.clientHeight;
    var narrow = W < 560; L = narrow ? 44 : 58; RP = narrow ? 34 : 44; B = narrow ? 84 : 96;
    PW = W - L - RP; PH = H - T - B; SY = H - 24;
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H); svg.textContent = '';
    var defs = el('defs', {}), clip = el('clipPath', { id: 'scv-past' }, defs);
    g.clip = el('rect', { x: 0, y: 0, width: x(asOf), height: H }, clip);
    // grid and axes
    for (var v = 0; v <= YMAX; v += 250000) {
      el('line', { x1: L, x2: W - RP, y1: y(v), y2: y(v), 'class': 'scv-grid' });
      el('text', { x: L - 8, y: y(v) + 3.5, 'class': 'scv-ax', 'text-anchor': 'end' }).textContent = v ? 'S$ ' + kfmt(v) : '0';
    }
    [0, 25, 50, 75, 100].forEach(function (p) { el('text', { x: W - RP + 6, y: y(bac[12] * p / 100) + 3.5, 'class': 'scv-ax scv-ax--r' }).textContent = p + '%'; });
    if (!narrow) el('text', { x: W - RP + 6, y: T - 10, 'class': 'scv-ax scv-ax--r' }).textContent = '% budget';
    for (var t = 0; t < 12; t++) {
      el('text', { x: (x(t) + x(t + 1)) / 2, y: H - 8, 'class': 'scv-ax' + (t + 1 > DATA ? ' scv-ax--fut' : ''), 'text-anchor': 'middle' }).textContent = narrow ? MON[t].charAt(0) : MON[t];
      if (t) el('line', { x1: x(t), x2: x(t), y1: T, y2: SY, 'class': 'scv-vgrid' });
    }
    el('line', { x1: x(DATA), x2: x(DATA), y1: T, y2: SY, 'class': 'scv-data' });
    if (!narrow) el('text', { x: x(DATA) + 5, y: T + 10, 'class': 'scv-ax scv-ax--data' }).textContent = 'Data date';
    // claims strip: net claim and retention per month
    g.strip = el('g', { 'class': 'scv-strip' });
    el('line', { x1: L, x2: W - RP, y1: SY, y2: SY, 'class': 'scv-base' }, g.strip);
    g.bars = [];
    var mx = 0; for (var m = 1; m <= DATA; m++) mx = Math.max(mx, cert[m] - cert[m - 1]);
    for (m = 1; m <= DATA; m++) {
      var bw = Math.min(26, PW / 12 * .52), bx = (x(m - 1) + x(m)) / 2 - bw / 2, gr = el('g', { 'class': 'scv-bar' }, g.strip);
      var hN = el('rect', { x: bx, width: bw, rx: 2 }, gr), hR = el('rect', { x: bx, width: bw, rx: 2, 'class': 'scv-ret' }, gr);
      g.bars.push({ g: gr, n: hN, r: hR, scale: (B - 50) / mx });
    }
    VO.forEach(function (v, i) {
      var mth = v[2] || DATA, cx = x(mth) - (v[2] ? 0 : 6), cy = SY + 1;
      el('path', { d: 'M' + f(cx) + ' ' + f(cy - 6) + 'l6 6l-6 6l-6-6z', 'class': 'scv-vo' + (v[2] ? '' : ' is-pending') });
      void i;
    });
    // curves: plan in full, actuals bright up to the marker and faint after it
    g.pv = el('path', { d: curve(pv, 12), 'class': 'scv-c scv-c--pv', pathLength: 1 });
    ['ev', 'ac'].forEach(function (k) {
      var arr = k === 'ev' ? ev : ac;
      el('path', { d: curve(arr, DATA), 'class': 'scv-c scv-c--' + k + ' scv-c--ghost' });
      g[k] = el('path', { d: curve(arr, DATA), 'class': 'scv-c scv-c--' + k, 'clip-path': 'url(#scv-past)', pathLength: 1 });
    });
    g.fc = el('path', { 'class': 'scv-c scv-c--fc' });
    g.eac = el('circle', { r: 3.5, 'class': 'scv-eacdot' });
    g.eacT = el('text', { 'class': 'scv-ax scv-ax--eac', 'text-anchor': 'end' });
    // marker
    g.mk = el('line', { y1: T - 6, y2: SY, 'class': 'scv-mk' });
    g.dots = ['pv', 'ev', 'ac'].map(function (k) { return el('circle', { r: 4.5, 'class': 'scv-dot scv-dot--' + k }); });
    place(pos); bars(); forecast();
  }
  function valAt(arr, t) { var a = Math.floor(t), b = Math.min(arr.length - 1, a + 1), q = t - a; return arr[a] + ((arr[b] == null ? arr[a] : arr[b]) - arr[a]) * q; }
  function place(t) {
    var X = x(t);
    g.mk.setAttribute('x1', f(X)); g.mk.setAttribute('x2', f(X));
    g.clip.setAttribute('width', f(X + 1));
    [pv, ev, ac].forEach(function (arr, i) { g.dots[i].setAttribute('cx', f(X)); g.dots[i].setAttribute('cy', f(y(valAt(arr, t)))); });
    handle.style.transform = 'translateX(' + X.toFixed(1) + 'px) translateX(-50%)';
    g.bars && g.bars.forEach(function (b, i) { b.g.classList.toggle('is-fut', i + 1 > Math.round(t)); b.g.classList.toggle('is-on', i + 1 === Math.round(t)); });
  }
  function bars() {
    g.bars.forEach(function (b, i) {
      var m = i + 1, gross = cert[m] - cert[m - 1], r = ret(m) - ret(m - 1), n = gross - r;
      var hn = n * b.scale, hr = r * b.scale;
      b.n.setAttribute('y', f(SY - hn)); b.n.setAttribute('height', f(Math.max(0, hn)));
      b.r.setAttribute('y', f(SY - hn - hr)); b.r.setAttribute('height', f(Math.max(0, hr)));
    });
  }
  function forecast() {
    var m = asOf, e = eac(m), p = [];
    for (var t = m; t <= 12; t++) p.push([x(t), y(ac[m] + (e - ac[m]) * (pv[t] - pv[m]) / ((pv[12] - pv[m]) || 1))]);
    g.fc.setAttribute('d', mono(p));
    g.eac.setAttribute('cx', f(x(12))); g.eac.setAttribute('cy', f(y(e)));
    g.eacT.setAttribute('x', f(x(12) - 7)); g.eacT.setAttribute('y', f(y(e) - 8)); g.eacT.textContent = (W < 560 ? 'EAC ' : 'EAC S$ ') + kfmt(e);
  }

  // ------------------------------------------------------------------ readout and panels
  function row(dl, a, b, cls) { var d = K.el('div', cls || null); d.appendChild(K.el('dt', null, a)); d.appendChild(K.el('dd', null, b)); dl.appendChild(d); }
  function read() {
    var m = asOf, cpi = ev[m] / ac[m], spi = ev[m] / pv[m], e = eac(m), cv = ev[m] - ac[m], sv = ev[m] - pv[m];
    R.date.textContent = END[m - 1] + ' ' + MON[m - 1] + ' 2026';
    R.pv.textContent = sgd(pv[m]); R.ev.textContent = sgd(ev[m]); R.ac.textContent = sgd(ac[m]);
    R.cpi.textContent = cpi.toFixed(2); R.spi.textContent = spi.toFixed(2);
    R.cpit.textContent = 'S$ ' + cpi.toFixed(2) + ' of budgeted work done per S$ 1 spent · CV ' + sgd(cv);
    R.spit.textContent = Math.round(spi * 100) + '% of the work planned by now is done · SV ' + sgd(sv);
    R.cpib.className = cpi >= .995 ? 'is-ok' : 'is-bad'; R.spib.className = spi >= .995 ? 'is-ok' : 'is-warn';
    R.eac.textContent = sgd(e);
    R.eact.textContent = 'Budget (BAC) ' + sgd(bac[m]) + ' · VAC ' + sgd(bac[m] - e);
    R.prog.textContent = 'planned ' + (pv[m] / bac[m] * 100).toFixed(1) + '% · done ' + (ev[m] / bac[m] * 100).toFixed(1) + '% of budget';
    // job cost by source: subcontractor bills, then the project's own purchases, timesheets and plant
    var sub = subC[m].reduce(function (a, b) { return a + b; }, 0), own = ac[m] - sub;
    var parts = [['sub', 'Subcontractor bills', sub], ['mat', 'Materials (purchase orders)', own * .6], ['lab', 'Labour (timesheets)', own * .32], ['plant', 'Plant hire and site costs', own * .08]];
    R.stack.textContent = ''; R.costs.textContent = '';
    parts.forEach(function (p) {
      var i = K.el('i'); i.style.flexGrow = String(p[2]); i.style.background = C[p[0]]; R.stack.appendChild(i);
      var li = K.el('li'); li.style.setProperty('--c', C[p[0]]);
      li.appendChild(K.el('span', null, p[1] + (p[0] === 'lab' ? ' · ' + Math.round(p[2] / HOUR).toLocaleString('en-SG') + ' h' : '')));
      li.appendChild(K.el('b', null, sgd(p[2]))); R.costs.appendChild(li);
    });
    // progress claim
    var r = ret(m), nt = net(m), prev = net(m - 1), claim = nt - prev, gst = Math.round(claim * GST);
    R.claimh.textContent = 'Progress claim #' + m + ' · ' + MON[m - 1] + ' 2026';
    R.inv.textContent = 'INV/2026/' + ('0000' + (40 + m)).slice(-5);
    R.claim.textContent = '';
    row(R.claim, 'Work done to date, certified', sgd(cert[m]));
    row(R.claim, 'of which variations', sgd(voCert[m]), 'scv-sub');
    row(R.claim, 'Retention held ' + Math.round(rate * 100) + '%' + (r >= CAP - .5 ? ' · limit reached' : ''), '−' + sgd(r));
    row(R.claim, 'Less previous claims', '−' + sgd(prev));
    row(R.claim, 'This claim', sgd(claim), 'scv-sum');
    row(R.claim, 'GST 9%', sgd(gst));
    row(R.claim, 'Invoice total', sgd(claim + gst), 'scv-sum');
    R.vos.textContent = '';
    VO.forEach(function (v) {
      var st = v[2] && m >= v[2] ? 'approved ' + MON[v[2] - 1] : !v[2] && m === DATA ? 'submitted Aug · pending, not claimable' : 'raised later';
      var li = K.el('li', v[2] && m >= v[2] ? 'is-ok' : !v[2] && m === DATA ? 'is-pend' : 'is-later');
      li.appendChild(K.el('b', null, v[0] + ' · ' + v[1])); li.appendChild(K.el('span', null, '+' + sgd(v[3]) + ' · ' + st)); R.vos.appendChild(li);
    });
    // subcontractors
    R.subs.textContent = ''; var tc = 0, tr = 0, tm = 0;
    SUB.forEach(function (s, i) {
      var c = subC[m][i], rr = sret(i, m), mo = c - rr - (subC[m - 1][i] - sret(i, m - 1));
      tc += c; tr += rr; tm += mo;
      var trr = K.el('tr'); trr.appendChild(K.el('td', null, s[0])); trr.appendChild(K.el('td', null, sgd(c))); trr.appendChild(K.el('td', null, sgd(rr))); trr.appendChild(K.el('td', null, mo ? sgd(mo) : '—'));
      R.subs.appendChild(trr);
    });
    var tt = K.el('tr', 'scv-tot'); tt.appendChild(K.el('td', null, 'Total')); tt.appendChild(K.el('td', null, sgd(tc))); tt.appendChild(K.el('td', null, sgd(tr))); tt.appendChild(K.el('td', null, sgd(tm)));
    R.subs.appendChild(tt);
    // retention ledger
    R.rate.textContent = Math.round(rate * 100) + '% · limit ' + sgd(CAP);
    R.ledger.textContent = '';
    for (var k = Math.max(1, m - 3); k <= m; k++) {
      var rp = SUB.reduce(function (a, s, i) { return a + sret(i, k); }, 0), tr2 = K.el('tr', k === m ? 'is-on' : null);
      tr2.appendChild(K.el('td', null, MON[k - 1])); tr2.appendChild(K.el('td', null, sgd(ret(k)))); tr2.appendChild(K.el('td', null, sgd(rp)));
      R.ledger.appendChild(tr2);
    }
    var pay = SUB.reduce(function (a, s, i) { return a + sret(i, m); }, 0), rec = ret(m);
    var nr = K.el('tr', 'scv-tot'); nr.appendChild(K.el('td', null, 'Net held')); var ntd = K.el('td', null, sgd(rec - pay)); ntd.colSpan = 2; nr.appendChild(ntd); R.ledger.appendChild(nr);
    R.rel.textContent = '';
    [['Half at practical completion', 'Dec 2026'], ['Half after 12 months of defects liability', 'Dec 2027']].forEach(function (x2) {
      var li = K.el('li'); li.appendChild(K.el('b', null, x2[0] + ' · ' + x2[1])); li.appendChild(K.el('span', null, 'in ' + sgd(rec / 2) + ' from the client · out ' + sgd(pay / 2) + ' to subcontractors, on balances to date')); R.rel.appendChild(li);
    });
    handle.setAttribute('aria-valuenow', String(m));
    handle.setAttribute('aria-valuetext', END[m - 1] + ' ' + FULL[m - 1] + ' 2026: CPI ' + cpi.toFixed(2) + ', SPI ' + spi.toFixed(2));
    hLab.textContent = MON[m - 1];
  }
  function setMonth(m) { m = K.clamp(Math.round(m), 1, DATA); if (m === asOf && g.fc) return; asOf = m; read(); if (g.fc) forecast(); }

  // ------------------------------------------------------------------ drag, keys and hover
  var drag = false, anim = 0;
  function toT(ev2) { var r = chart.getBoundingClientRect(); return K.clamp((ev2.clientX - r.left - L) / PW * 12, 1, DATA); }
  function glide(to) {
    cancelAnimationFrame(anim);
    if (K.reduce) { pos = to; place(pos); return; }
    var from = pos, t0 = performance.now();
    (function stp() { var q = K.clamp((performance.now() - t0) / 220, 0, 1); pos = K.lerp(from, to, K.ease.out(q)); place(pos); if (q < 1) anim = requestAnimationFrame(stp); })();
  }
  chart.addEventListener('pointerdown', function (e) {
    var r = chart.getBoundingClientRect(); if (e.clientY - r.top > SY + 4) return;
    drag = true; chart.setPointerCapture(e.pointerId); cancelAnimationFrame(anim); tip.hide();
    pos = toT(e); place(pos); setMonth(pos); chart.classList.add('is-drag'); e.preventDefault();
  });
  chart.addEventListener('pointermove', function (e) {
    if (drag) { pos = toT(e); place(pos); setMonth(pos); return; }
    var r = chart.getBoundingClientRect(), t = (e.clientX - r.left - L) / PW * 12;
    if (t < 0 || t > 12 || e.clientY - r.top > SY + 20) { tip.hide(); return; }
    var m = Math.min(12, Math.max(1, Math.ceil(t)));
    var lines = [FULL[m - 1] + ' 2026', 'Planned value ' + sgd(pv[m])];
    if (m <= DATA) { lines.push('Earned ' + sgd(ev[m]) + ' · actual cost ' + sgd(ac[m])); lines.push('Claim #' + m + ': ' + sgd(net(m) - net(m - 1)) + ' net, ' + sgd(ret(m) - ret(m - 1)) + ' retention'); }
    else lines.push('Not reached yet: plan only');
    VO.forEach(function (v) { if (v[2] === m) lines.push(v[0] + ' approved: +' + sgd(v[3]) + ' contract, +' + sgd(v[4]) + ' budget'); else if (!v[2] && m === DATA) lines.push(v[0] + ' submitted: +' + sgd(v[3]) + ', awaiting approval'); });
    tip.show(lines, (x(m - 1) + x(m)) / 2, T + 4, true);
  });
  function end() { if (!drag) return; drag = false; chart.classList.remove('is-drag'); glide(asOf); }
  chart.addEventListener('pointerup', end); chart.addEventListener('pointercancel', end);
  chart.addEventListener('pointerleave', function () { if (!drag) tip.hide(); });
  handle.addEventListener('keydown', function (e) {
    var m = e.key === 'ArrowRight' || e.key === 'ArrowUp' ? asOf + 1 : e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? asOf - 1 : e.key === 'Home' ? 1 : e.key === 'End' ? DATA : null;
    if (m === null) return;
    e.preventDefault(); setMonth(m); glide(asOf);
  });
  K.$$('[data-ret]', root).forEach(function (b) {
    b.addEventListener('click', function () {
      rate = b.dataset.ret === '10' ? .1 : .05;
      K.$$('[data-ret]', root).forEach(function (x2) { x2.setAttribute('aria-pressed', String(x2 === b)); });
      bars(); read(); K.restart(g.strip, 'is-flip');
    });
  });
  var rt = 0;
  window.addEventListener('resize', function () { cancelAnimationFrame(rt); rt = requestAnimationFrame(draw); });
  read();
  return {
    start: function (first) {
      draw();
      if (first && !K.reduce) {                                    // draw the curves, then walk the marker from January to August
        root.classList.add('scv-intro');
        pos = 1; asOf = 1; read(); forecast(); place(pos);
        setTimeout(function () {
          var t0 = performance.now();
          (function walk() {
            if (drag) return;
            var q = K.clamp((performance.now() - t0) / 1800, 0, 1); pos = K.lerp(1, DATA, K.ease.inOut(q)); place(pos); setMonth(pos);
            if (q < 1) anim = requestAnimationFrame(walk); else root.classList.remove('scv-intro');
          })();
        }, 900);
      }
    },
    stop: function () {}
  };
});
