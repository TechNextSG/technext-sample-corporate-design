/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* Odoo in the Philippines page: a year of BIR forms in Odoo 20, by cadence only (no deadline
   dates). A 12-month heatmap shows how often each form comes round: 2307 and 2306 certificates per
   vendor payment, the monthly 1600-VT and 1601-C items, the quarterly 2551Q for non-VAT companies,
   and the yearly 2316 and 1604-C with the Alphalist DAT. Beside it, the document flow: vendor bill,
   withholding, certificate, payment and sending; payroll run to 1601-C items to the year-end forms.
   Company type and a month scrubber drive both. Sample company and volumes. */
TN.demo('bir', function (root, K) {
  var MON = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'Year-end'];
  var V2307 = [12, 9, 14, 11, 10, 15, 13, 12, 11, 14, 12, 16];      // vendor bills with expanded withholding
  var V2306 = [1, 0, 2, 1, 0, 1, 2, 0, 1, 1, 0, 2];                  // vendor bills with final withholding
  var FVAT = [1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1];                   // payments with final withholding VAT
  var EMP = [18, 18, 19, 19, 19, 20, 20, 20, 21, 21, 21, 21];        // employees on the payroll
  var INV = [38, 41, 46, 40, 44, 49, 43, 47, 45, 50, 52, 55];        // invoices issued
  var LATE = [1, 0, 2, 1, 1, 2, 1, 1, 0, 2, 1, 2];                   // bills paid the month after
  var YEAR_EMP = 23;                                                 // everyone on the payroll during the year
  var ROWS = [
    { k: '2307', n: 'BIR 2307', d: 'Expanded withholding certificate', cad: 'per payment', v: V2307 },
    { k: '2306', n: 'BIR 2306', d: 'Final withholding certificate', cad: 'per payment', v: V2306 },
    { k: '1600', n: '1600-VT', d: 'Final withholding VAT report', cad: 'monthly', v: FVAT },
    { k: '1601', n: '1601-C', d: 'Payroll reporting items', cad: 'monthly', v: EMP },
    { k: '2551', n: '2551Q', d: 'Non-VAT registered companies', cad: 'quarterly' },
    { k: '2316', n: 'BIR 2316', d: 'Yearly certificate per employee', cad: 'yearly' },
    { k: '1604', n: '1604-C', d: 'Worksheets and Alphalist DAT', cad: 'yearly' }
  ];
  // the three lanes of the document flow: title and a line for month m (0..11, 12 = year-end)
  var NODES = [
    [['Vendor bill', function (m) { return m > 11 ? 'none at year-end' : V2307[m] + V2306[m] + ' bills with withholding'; }],
     ['Withholding on the bill', function (m) { return m > 11 ? '\u2014' : 'expanded on ' + V2307[m] + (V2306[m] ? ', final on ' + V2306[m] : ''); }],
     ['2307 and 2306 PDFs', function (m) { return m > 11 ? '\u2014' : V2307[m] + ' \u00d7 2307' + (V2306[m] ? ' \u00b7 ' + V2306[m] + ' \u00d7 2306' : ''); }],
     ['Bill paid', function (m) { var t = V2307[m] + V2306[m]; return m > 11 ? '\u2014' : t - LATE[m] + ' paid' + (LATE[m] ? ' \u00b7 ' + LATE[m] + ' next month' : ''); }],
     ['Sent to the vendor', function (m) { return m > 11 ? '\u2014' : 'with the payment, if requested'; }]],
    [['1600-VT report', function (m) { return m > 11 ? '\u2014' : FVAT[m] ? 'final VAT on ' + FVAT[m] + ' payment' : 'no final VAT withheld'; }],
     ['BIR- and CAS-compliant invoices', function (m) { return m > 11 ? 'Book of Accounts for the year' : INV[m] + ' invoices'; }],
     ['2551Q report', function (m) { return vat ? 'not for VAT-registered companies' : m > 11 ? '\u2014' : m % 3 === 2 ? 'Q' + (m / 3 + 1 | 0) + ', from the quarter\u2019s invoices' : 'next at quarter end'; }]],
    [['Payroll run', function (m) { return m > 11 ? 'the year closed' : EMP[m] + ' employees'; }],
     ['1601-C items', function (m) { return m > 11 ? '12 months of items' : 'monthly payroll reporting'; }],
     ['BIR 2316', function (m) { return m > 11 ? YEAR_EMP + ' certificates, one per employee' : 'yearly'; }],
     ['1604-C and Alphalist DAT', function (m) { return m > 11 ? 'worksheets and the DAT for eSubmission' : 'yearly'; }]]
  ];

  var grid = K.$('.bir-grid', root), scrub = K.$('.bir-scrub input', root), moEl = K.$('.bir-mo', root), kMonth = K.$('[data-k="month"]', root);
  var lanes = K.$('.bir-lanes', root), svgL = K.$('.bir-links', root), logEl = K.$('.bir-log', root);
  var playBtn = K.$('[data-play]', root), playLab = K.$('[data-play] span', root), vatBtns = K.$$('[data-vat]', root);
  var tip = K.tip(root);
  var vat = 0, m = 0, playing = false, touched = false;

  // ---------------------------------------------------------------- the heatmap
  var cells = [];
  function heat(v) {                                              // light blue to the brand's dark blue
    var a = [238, 243, 252], b = [30, 70, 145];
    return 'rgb(' + a.map(function (x, i) { return Math.round(x + (b[i] - x) * v); }).join(',') + ')';
  }
  function cell(txt, cls, c0, c1, lines, v) {
    var e = K.el('span', 'bir-c ' + (cls || ''), txt); e.setAttribute('role', 'cell');
    if (v != null) { e.style.background = heat(v); if (v > .55) e.classList.add('is-dark'); }
    e.tabIndex = -1; cells.push({ el: e, c0: c0, c1: c1 });
    e.addEventListener('pointerenter', function () { var b = K.box(e, root); tip.show(lines(), b.cx, b.y); });
    e.addEventListener('pointerleave', function () { tip.hide(); });
    return e;
  }
  function buildGrid() {
    grid.textContent = ''; cells = [];
    var hr = K.el('div', 'bir-row bir-row--h'); hr.setAttribute('role', 'row');
    var corner = K.el('span', 'bir-rh', 'Form'); corner.setAttribute('role', 'columnheader'); hr.appendChild(corner);
    MON.forEach(function (x, i) { var h = K.el('span', 'bir-mh' + (i > 11 ? ' is-ye' : ''), i > 11 ? 'Year-end' : x.slice(0, 3)); h.setAttribute('role', 'columnheader'); hr.appendChild(h); cells.push({ el: h, c0: i, c1: i, head: true }); });
    grid.appendChild(hr);
    ROWS.forEach(function (r) {
      var row = K.el('div', 'bir-row bir-row--' + r.k); row.setAttribute('role', 'row');
      var rh = K.el('span', 'bir-rh'); rh.setAttribute('role', 'rowheader');
      var code = K.el('b', null, r.n); code.appendChild(K.el('em', 'bir-cad bir-cad--' + r.cad.split(' ')[0], r.cad)); rh.appendChild(code); rh.appendChild(K.el('small', null, r.d));
      row.appendChild(rh);
      if (r.v) {
        var lo = Math.min.apply(null, r.v.filter(Boolean)), hi = Math.max.apply(null, r.v);   // heat is relative to the row
        r.v.forEach(function (v, i) {
          row.appendChild(v ? cell(String(v), null, i, i, function () { return tipFor(r, i, v); }, hi > lo ? .14 + .86 * (v - lo) / (hi - lo) : .5)
                            : cell('–', 'is-zero', i, i, function () { return [MON[i] + ' · ' + r.n, r.k === '1600' ? 'No final withholding VAT this month (sample)' : 'No bills with final withholding this month (sample)']; }));
        });
        row.appendChild(cell('', 'is-ye is-none', 12, 12, function () { return [r.n, 'Nothing extra at year-end: ' + r.cad]; }));
      } else if (r.k === '2551') {
        for (var q = 0; q < 4; q++) (function (q) {
          var e = cell(vat ? 'n/a' : 'Q' + (q + 1), 'is-q' + (vat ? ' is-off' : ''), q * 3, q * 3 + 2, function () {
            return vat ? ['2551Q', 'VAT-registered companies do not file the 2551Q'] : ['Q' + (q + 1) + ' · 2551Q', MON[q * 3] + ' to ' + MON[q * 3 + 2] + ': one report from the quarter’s invoices (sample: ' + (INV[q * 3] + INV[q * 3 + 1] + INV[q * 3 + 2]) + ' invoices)'];
          });
          e.style.gridColumn = 'span 3'; row.appendChild(e);
        })(q);
        row.appendChild(cell('', 'is-ye is-none', 12, 12, function () { return ['2551Q', 'Quarterly: nothing extra at year-end'] }));
      } else {
        for (var i = 0; i < 12; i++) row.appendChild(cell('', 'is-none', i, i, function () { return [r.n, 'Yearly: produced once the year closes']; }));
        row.appendChild(cell(r.k === '2316' ? String(YEAR_EMP) : 'DAT', 'is-y', 12, 12, function () {
          return r.k === '2316' ? ['Year-end · BIR 2316', 'One certificate for each of the ' + YEAR_EMP + ' employees on the payroll during the year']
                                : ['Year-end · 1604-C', 'Summary worksheets and a validated Alphalist DAT file for eSubmission'];
        }));
      }
      grid.appendChild(row);
    });
    paintGrid();
  }
  function tipFor(r, i, v) {
    var mo = MON[i];
    if (r.k === '2307') return [mo + ' · BIR 2307', v + ' certificates, one per vendor bill with expanded withholding'];
    if (r.k === '2306') return [mo + ' · BIR 2306', v + ' certificate' + (v > 1 ? 's' : '') + ' for final withholding on vendor bills'];
    if (r.k === '1600') return [mo + ' · 1600-VT', 'Final withholding VAT on ' + v + ' payment (sample)'];
    return [mo + ' · 1601-C', 'Payroll reporting items for ' + v + ' employees'];
  }
  function paintGrid() {
    cells.forEach(function (c) {
      var st = c.c1 < m ? 'is-past' : c.c0 > m ? 'is-fut' : 'is-now';
      c.el.classList.remove('is-past', 'is-fut', 'is-now'); c.el.classList.add(st);
    });
  }

  // ---------------------------------------------------------------- the document flow
  var nodeEls = [[], [], []], paths = [], routes = {};
  NODES.forEach(function (lane, li) {
    var host = K.$('[data-lane="' + li + '"]', root);
    lane.forEach(function (nd) {
      var e = K.el('div', 'bir-n'); e.appendChild(K.el('b', null, nd[0])); var s = K.el('small'); e.appendChild(s);
      host.appendChild(e); nodeEls[li].push({ el: e, sub: s, f: nd[1] });
    });
  });
  function active(li, j) {                                        // does this step happen in month m?
    if (li === 0) return m < 12;
    if (li === 2) return m < 12 ? j < 2 : j !== 0;
    if (j === 0) return m < 12 && FVAT[m] > 0;
    if (j === 1) return true;
    return !vat && m < 12 && m % 3 === 2;
  }
  function paintFlow() {
    nodeEls.forEach(function (lane, li) {
      lane.forEach(function (n, j) {
        n.sub.textContent = n.f(m);
        n.el.classList.toggle('is-on', active(li, j));
        n.el.classList.toggle('is-off', li === 1 && j === 2 && !!vat);
      });
    });
    paths.forEach(function (p) { p.el.classList.toggle('is-on', p.on()); });
    kMonth.textContent = MON[m]; moEl.textContent = MON[m];
    // this month in Odoo
    logEl.textContent = '';
    var items = [];
    if (m < 12) {
      items.push(['BIR 2307 and 2306', V2307[m] + V2306[m] + ' certificates generated on the vendor bills', 'var(--tok-stock)']);
      items.push(['Sent', V2307[m] + V2306[m] - LATE[m] + ' certificates to vendors with their payment', 'var(--tok-pay)']);
      if (FVAT[m]) items.push(['1600-VT', 'final withholding VAT on ' + FVAT[m] + ' payment', 'var(--tok-buy)']);
      items.push(['1601-C', 'items for ' + EMP[m] + ' employees from the payroll', 'var(--tok-make)']);
      if (!vat && m % 3 === 2) items.push(['2551Q', 'Q' + (m / 3 + 1 | 0) + ' report from ' + (INV[m - 2] + INV[m - 1] + INV[m]) + ' invoices', 'var(--odoo)']);
    } else {
      items.push(['BIR 2316', YEAR_EMP + ' yearly certificates, one per employee', 'var(--tok-make)']);
      items.push(['1604-C', 'summary worksheets from the year’s payroll', 'var(--tok-make)']);
      items.push(['Alphalist DAT', 'validated file for BIR eSubmission', 'var(--ok)']);
    }
    items.forEach(function (x) {
      var li = K.el('li'); li.style.setProperty('--c', x[2]); li.appendChild(K.el('i'));
      var sp = K.el('span'); sp.appendChild(K.el('b', null, x[0])); sp.appendChild(document.createTextNode(' · ' + x[1])); li.appendChild(sp);
      logEl.appendChild(li);
    });
  }
  // links between the steps, and the routes documents travel on
  function layoutLinks() {
    svgL.textContent = ''; paths = []; routes = {};
    var W = lanes.offsetWidth, H = lanes.offsetHeight; svgL.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    function bx(li, j) { return K.box(nodeEls[li][j].el, lanes); }
    function seg(key, pts, on) {
      var el = K.svg('path', { d: K.path(pts, 8), 'class': 'bir-l' + (key === 'VAT' ? ' is-vat' : '') }); svgL.appendChild(el);
      paths.push({ el: el, on: on });
      (routes[key] = routes[key] || []).push(pts);
    }
    var stacked = W < 560;
    [0, 1, 2].forEach(function (li) {
      for (var j = 0; j < nodeEls[li].length - 1; j++) {
        if (li === 1 && j === 0) continue;                           // the 1600-VT is fed from the bills, not the invoices
        var a = bx(li, j), b = bx(li, j + 1);
        (function (li, j) { seg('L' + li, [[a.cx, a.b], [b.cx, b.y]], function () { return active(li, j) && active(li, j + 1); }); })(li, j);
      }
    });
    if (!stacked) {                                                // final VAT withheld on a bill feeds the 1600-VT
      var w = bx(0, 1), v = bx(1, 0), x = w.r + (v.x - w.r) * .5;
      seg('VAT', [[w.r, w.cy], [x, w.cy], [x, v.cy], [v.x, v.cy]], function () { return active(1, 0); });
    }
    paintFlow();
  }
  // documents moving through the flow (never under reduced motion)
  var toks = [];
  function route(key) {                                           // join a lane's segments into one polyline
    var segs = routes[key] || [], pts = [];
    segs.forEach(function (s) { s.forEach(function (p) { pts.push(p); }); });
    return pts;
  }
  function spawn(pts, delay, now, cls) {
    if (pts.length < 2) return;
    var len = 0, cum = [0];
    for (var i = 1; i < pts.length; i++) { len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); cum.push(len); }
    var el = K.svg('rect', { width: 10, height: 12, rx: 2.5, 'class': 'bir-tok ' + (cls || '') });
    svgL.appendChild(el);
    toks.push({ pts: pts, cum: cum, len: len, t0: now + delay, dur: Math.max(900, len * 5.5), el: el });
  }
  function monthTokens(now) {
    if (K.reduce) return;
    if (m < 12) {
      var n = Math.min(5, V2307[m] + V2306[m]), a = route('L0'), p = route('L2').slice(0, 2);
      for (var i = 0; i < n; i++) spawn(a, i * 260, now);
      spawn(p, 120, now, 'is-pay');
      if (FVAT[m] && routes.VAT) spawn(routes.VAT[0], 500, now, 'is-vat');
      if (!vat && m % 3 === 2 && routes.L1) spawn(routes.L1[0], 700, now, 'is-q');
    } else {
      var y = route('L2').slice(2);
      for (var k = 0; k < 3; k++) spawn(y, k * 300, now, 'is-pay');
    }
  }
  function moveToks(now) {
    toks = toks.filter(function (t) {
      var q = (now - t.t0) / t.dur;
      if (q < 0) { t.el.style.opacity = '0'; return true; }
      if (q >= 1) { t.el.remove(); return false; }
      var d = K.ease.inOut(q) * t.len, i = 1;
      while (i < t.cum.length - 1 && t.cum[i] < d) i++;
      var f = (d - t.cum[i - 1]) / ((t.cum[i] - t.cum[i - 1]) || 1), p0 = t.pts[i - 1], p1 = t.pts[i];
      var x = p0[0] + (p1[0] - p0[0]) * f, y = p0[1] + (p1[1] - p0[1]) * f;
      t.el.setAttribute('transform', 'translate(' + (x - 5).toFixed(1) + ' ' + (y - 6).toFixed(1) + ')');
      t.el.style.opacity = String(Math.min(1, q * 8, (1 - q) * 8));
      return true;
    });
  }

  // ---------------------------------------------------------------- time
  var MONTH_MS = 2600, tMonth = 0;
  function setMonth(i, now) {
    m = K.clamp(i, 0, 12); scrub.value = String(m + 1); scrub.setAttribute('aria-valuetext', MON[m]);
    paintGrid(); paintFlow(); monthTokens(now || performance.now());
  }
  var loop = K.loop(function (now) {
    if (playing && now - tMonth > MONTH_MS) {
      tMonth = now;
      if (m >= 12) setPlaying(false); else setMonth(m + 1, now);
    }
    moveToks(now);
    if (!playing && !toks.length) loop.off();
  });
  function setPlaying(p) {
    playing = p; playBtn.setAttribute('aria-pressed', String(p)); playBtn.classList.toggle('is-pause', p);
    playLab.textContent = p ? 'Pause' : m >= 12 ? 'Play again' : 'Play the year';
    if (p) { tMonth = performance.now(); loop.on(); }
  }
  playBtn.addEventListener('click', function () {
    touched = true;
    if (playing) { setPlaying(false); return; }
    if (K.reduce) { setMonth(m >= 12 ? 0 : m + 1); return; }      // reduced motion: one month per press
    if (m >= 12) setMonth(0);
    setPlaying(true);
  });
  scrub.addEventListener('input', function () {
    touched = true; if (playing) setPlaying(false);
    setMonth(+scrub.value - 1); if (!K.reduce) loop.on();
  });
  vatBtns.forEach(function (b, i) {
    b.addEventListener('click', function () {
      touched = true; vat = i;                                      // buttons: Non-VAT, VAT-registered
      vatBtns.forEach(function (x, j) { x.setAttribute('aria-pressed', String(j === i)); });
      root.classList.toggle('is-vat', !!vat);
      buildGrid(); paintFlow();
    });
  });
  window.addEventListener('resize', function () { layoutLinks(); });
  // the lanes grow as documents appear; keep the links' viewBox equal to the lanes' size
  var lastWH = '', rzq = 0;
  if ('ResizeObserver' in window) new ResizeObserver(function () {
    if (rzq) return;
    rzq = requestAnimationFrame(function () { rzq = 0; var wh = lanes.offsetWidth + 'x' + lanes.offsetHeight; if (wh !== lastWH) { lastWH = wh; layoutLinks(); } });
  }).observe(lanes);

  buildGrid();
  if (K.reduce) m = 11;                                           // a still: December, with Q4
  scrub.value = String(m + 1); paintGrid();
  return {
    start: function (first) {
      layoutLinks();
      if (first && !touched && !K.reduce) { setMonth(0); setPlaying(true); }
      else if (playing) loop.on();
    },
    stop: function () { loop.off(); }
  };
});
