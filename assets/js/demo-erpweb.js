/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* What is ERP (blog): one sample order run two ways. Spreadsheets: sales, warehouse, purchasing,
   finance and HR each keep their own file, so the order is re-typed at every hop and the copies
   disagree. One ERP database: the order is entered once, reserves stock (or triggers a purchase when
   stock is short), the delivery updates stock, the invoice and entries post themselves and the
   payment reconciles, and every team sees the same status. Counts are illustrative. */
TN.demo('erpweb', function (root, K) {
  var stage = K.$('.ew-stage', root), wg = K.$('.ew-wg', root), svgEl = K.$('.ew-wires', root);
  var hub = K.$('.ew-hub', root), logEl = K.$('.ew-log', root), tip = K.tip(stage);
  var kpi = {}; K.$$('[data-k]', root).forEach(function (d) { kpi[d.dataset.k] = d; });
  var segBtns = K.$$('[data-mode]', K.$('.dm-head', root)), shortBtn = K.$('[data-short]', root);
  var AMBER = 'var(--tok-buy)', RED = 'var(--tok-late)', BLUE = 'var(--tok-stock)', TEAL = 'var(--tok-pay)', VIOLET = 'var(--tok-make)';

  var POS = { sales: [50, 15], wh: [83, 41], buy: [70, 82], fin: [30, 82], hr: [17, 41] };
  var POS_S = { sales: [50, 21], wh: [80, 45], buy: [72, 83], fin: [28, 83], hr: [20, 45] };   // narrow panels: clear of the scenario switch
  var SUB = {
    sheets: { sales: 'orders.xlsx', wh: 'stock.xlsx', buy: 'purchasing tool', fin: 'accounting software', hr: 'staff.xlsx' },
    erp: { sales: 'Sales app', wh: 'Inventory app', buy: 'Purchase app', fin: 'Accounting app', hr: 'Employees app' }
  };
  var TIP = {
    sheets: {
      sales: ['Sales · its own file', 'The order starts here, then gets typed again in every other file.'],
      wh: ['Warehouse · a spreadsheet for stock', 'Stock numbers nobody trusts: the file is only as current as the last copy-paste.'],
      buy: ['Purchasing · a separate tool', 'A shortage reaches purchasing only when someone re-types it.'],
      fin: ['Finance · accounting software', 'The invoice is typed again from the order, and month-end means a week of reconciling.'],
      hr: ['HR · its own file', 'Employees, leave, expenses and pay, kept apart from the books.']
    },
    erp: {
      sales: ['Sales', 'A confirmed quotation becomes a sales order on the shared record.'],
      wh: ['Warehouse', 'The order reserves stock, and the delivery updates stock levels.'],
      buy: ['Purchasing', 'When stock is short, the order triggers a purchase order.'],
      fin: ['Finance', 'The invoice is created from the order, the entries post themselves and the bank line reconciles.'],
      hr: ['HR', 'Employees, leave, expenses and pay on the same database.']
    }
  };
  var ORDER_TEAMS = ['sales', 'wh', 'buy', 'fin'];
  var N = {};
  K.$$('.ew-node', root).forEach(function (el) {
    N[el.dataset.d] = { el: el, sub: K.$('.ew-sub', el), n: K.$('.ew-n', el), st: K.$('.ew-st', el), c: 0 };
  });

  // ------------------------------------------------------------ geometry (cached; never read per frame)
  var W = 0, H = 0, geo = {}, paths = {};
  function place() {
    W = stage.offsetWidth; H = stage.offsetHeight;
    Object.keys(N).forEach(function (d) {
      var el = N[d].el, pos = W < 520 ? POS_S[d] : POS[d], x = pos[0] / 100 * W, y = pos[1] / 100 * H;
      el.style.left = (x - el.offsetWidth / 2).toFixed(1) + 'px'; el.style.top = (y - el.offsetHeight / 2).toFixed(1) + 'px';
      geo[d] = K.box(el, stage);
    });
    hub.style.left = (W / 2 - hub.offsetWidth / 2).toFixed(1) + 'px'; hub.style.top = (H * (W < 520 ? .53 : .49) - hub.offsetHeight / 2).toFixed(1) + 'px';
    geo.hub = K.box(hub, stage);
    svgEl.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    paths = {};
  }
  function inside(p, g, pad) { return p[0] > g.x - pad && p[0] < g.r + pad && p[1] > g.y - pad && p[1] < g.b + pad; }
  function curvePts(a, b, bend) {
    var ax = a.cx, ay = a.cy, bx = b.cx, by = b.cy, dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy) || 1;
    var nx = -dy / L, ny = dx / L, mx = (ax + bx) / 2, my = (ay + by) / 2;
    if ((mx - W / 2) * nx + (my - H * .49) * ny < 0) { nx = -nx; ny = -ny; }
    var cx = mx + nx * L * bend, cy = my + ny * L * bend, pts = [];
    for (var i = 0; i <= 40; i++) { var t = i / 40, u = 1 - t; pts.push([u * u * ax + 2 * u * t * cx + t * t * bx, u * u * ay + 2 * u * t * cy + t * t * by]); }
    var s = 0, e = pts.length - 1;
    while (s < e && inside(pts[s], a, 3)) s++;
    while (e > s && inside(pts[e], b, 6)) e--;
    return pts.slice(s, e + 1);
  }
  function route(a, b) {
    var k = a + '>' + b;
    if (!paths[k]) paths[k] = a === 'hub' || b === 'hub' ? curvePts(geo[a], geo[b], .04) : curvePts(geo[a], geo[b], .2);
    return paths[k];
  }
  function dOf(pts) { return pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(''); }
  var SHEET_WIRES = [['sales', 'wh'], ['wh', 'buy'], ['sales', 'fin'], ['hr', 'fin']];
  function drawWires(animate) {
    wg.textContent = '';
    var list = mode === 'sheets' ? SHEET_WIRES : Object.keys(N).map(function (d) { return ['hub', d]; });
    list.forEach(function (w, i) {
      var pts = route(w[0], w[1]); if (pts.length < 2) return;
      var p = K.svg('path', { d: dOf(pts), 'class': 'ew-w ' + (mode === 'sheets' ? 'ew-w--copy' : 'ew-w--spoke'), 'marker-end': mode === 'sheets' ? 'url(#ew-ah)' : null });
      wg.appendChild(p);
      if (animate && !K.reduce && mode === 'erp') {
        var len = p.getTotalLength(); p.style.strokeDasharray = len; p.style.strokeDashoffset = len;
        p.style.transitionDelay = (i * 70) + 'ms';
        requestAnimationFrame(function () { requestAnimationFrame(function () { p.style.strokeDashoffset = 0; }); });
      }
    });
  }

  // ------------------------------------------------------------ one clock: a timeline that only advances while visible
  var tl = 0, queue = [], toks = [];
  function at(ms, fn) { if (K.reduce) { fn(); return; } queue.push({ t: tl + ms, fn: fn }); }
  function ptAt(pts, e) {
    var f = e * (pts.length - 1), i = Math.min(pts.length - 2, f | 0), q = f - i;
    return [K.lerp(pts[i][0], pts[i + 1][0], q), K.lerp(pts[i][1], pts[i + 1][1], q)];
  }
  var loop = K.loop(function (now, dt) {
    tl += dt * 1000;
    if (queue.length) {
      var due = queue.filter(function (q) { return q.t <= tl; });
      if (due.length) {
        queue = queue.filter(function (q) { return q.t > tl; });
        due.sort(function (a, b) { return a.t - b.t; }).forEach(function (q) { q.fn(); });
      }
    }
    toks = toks.filter(function (k) {
      var p = K.clamp((tl - k.t0) / k.dur, 0, 1), pt = ptAt(k.pts, K.ease.inOut(p));
      k.el.style.transform = 'translate(' + pt[0].toFixed(1) + 'px,' + pt[1].toFixed(1) + 'px)';
      if (p >= 1) { k.el.remove(); if (k.done) k.done(); return false; }
      return true;
    });
  });
  function send(a, b, cls, dur, done) {
    var pts = route(a, b);
    if (K.reduce || pts.length < 2) { if (done) done(); return; }
    var el = K.el('i', 'ew-tok ' + cls); el.style.transform = 'translate(' + pts[0][0].toFixed(1) + 'px,' + pts[0][1].toFixed(1) + 'px)';
    stage.appendChild(el);
    if (a === 'hub') K.restart(hub, 'is-ping');
    toks.push({ el: el, pts: pts, t0: tl, dur: dur, done: b === 'hub' ? function () { K.restart(hub, 'is-ping'); if (done) done(); } : done });
  }
  function clearRun() { queue = []; toks.forEach(function (k) { k.el.remove(); }); toks = []; }

  // ------------------------------------------------------------ state, counters, log
  var mode = 'sheets', short = false, orders = 0, typed = 0, re = 0, conf = 0, auto = 0, busy = false;
  function renderK() {
    kpi.orders.textContent = orders; kpi.typed.textContent = typed; kpi.re.textContent = re; kpi.conf.textContent = conf;
    var erp = mode === 'erp';
    kpi.where.textContent = erp ? 'On the record' : 'Ask around';
    kpi.where.parentNode.classList.toggle('dm-ok', erp);
    kpi.re.parentNode.classList.toggle('dm-ok', erp && orders > 0);
    kpi.conf.parentNode.classList.toggle('dm-ok', erp && orders > 0);
    kpi.re.parentNode.classList.toggle('ew-bad', !erp && re > 0);
    kpi.conf.parentNode.classList.toggle('ew-bad', !erp && conf > 0);
  }
  function say(text, c) { var li = K.log(logEl, '<i></i><span></span>', null, 3); K.$('span', li).textContent = text; li.style.setProperty('--c', c); }
  function setSt(d, text, cls) { var s = N[d].st; s.textContent = text; s.className = 'ew-st' + (text ? ' is-on ' + (cls || '') : ''); }
  function allSt(text) { ORDER_TEAMS.forEach(function (d) { setSt(d, text, 'is-live'); }); }
  function ping(d) { K.restart(N[d].el, 'is-ping'); }
  function retype(d, notOrder) {
    var n = N[d]; n.c++; n.n.textContent = n.c; n.el.classList.add('has-n'); K.restart(n.n, 'is-pop');
    re++; if (!notOrder) typed++; renderK(); ping(d);
  }
  function resetAll() {
    clearRun(); orders = 0; typed = 0; re = 0; conf = 0; busy = false;
    Object.keys(N).forEach(function (d) { N[d].c = 0; N[d].n.textContent = ''; N[d].el.classList.remove('has-n', 'is-conf'); setSt(d, ''); });
    logEl.textContent = ''; renderK();
  }

  // ------------------------------------------------------------ the order, run two ways
  function runSheets() {
    var o = ++orders, sh = short, t;
    busy = true; typed = 0; renderK();
    ORDER_TEAMS.forEach(function (d) { setSt(d, d === 'sales' ? '' : 'Not yet', 'is-stale'); });
    N.wh.el.classList.remove('is-conf');
    at(0, function () { typed = 1; renderK(); setSt('sales', 'Confirmed', 'is-own'); ping('sales'); say('Sales types the order into its own file', BLUE); });
    at(450, function () { send('sales', 'wh', 'is-copy', 1050, function () { retype('wh'); setSt('wh', sh ? 'Short?' : 'To ship', 'is-own'); say('Warehouse re-types the order into stock.xlsx', AMBER); }); });
    t = 1750;
    if (o % 2) {
      at(t, function () { conf++; renderK(); N.wh.el.classList.add('is-conf'); setSt('wh', '120 or 112?', 'is-bad'); ping('wh'); say('Two copies of the stock file disagree: which count is right?', RED); });
      t += 900;
    }
    if (sh) {
      at(t, function () { send('wh', 'buy', 'is-copy', 1000, function () { retype('buy'); setSt('buy', 'Request typed', 'is-own'); say('The shortage is re-typed as a purchase request', AMBER); }); });
      t += 1350;
    }
    at(t, function () { send('sales', 'fin', 'is-copy', 1150, function () { retype('fin'); setSt('fin', 'Invoiced', 'is-own'); say('Finance re-types the order as an invoice', AMBER); }); });
    t += 1500;
    at(t, function () { setSt('fin', 'Paid?', 'is-stale'); say('The payment waits to be matched by hand at month-end', TEAL); });
    t += 700;
    at(t, function () { send('hr', 'fin', 'is-copy', 1000, function () { retype('fin', true); say("Meanwhile, HR's expenses are typed into the books again", AMBER); }); });
    at(t + 1300, finish);
  }
  function runErp() {
    var sh = short, t;
    ++orders; busy = true; typed = 0; renderK();
    ORDER_TEAMS.forEach(function (d) { setSt(d, ''); });
    at(0, function () { typed = 1; renderK(); allSt('Sales order'); ping('sales'); say('Quotation confirmed: it becomes a sales order', BLUE); send('sales', 'hub', 'is-live', 650); });
    at(700, function () { send('hub', 'wh', 'is-live', 650, function () { allSt(sh ? 'Waiting for stock' : 'Stock reserved'); ping('wh'); say(sh ? 'The order finds stock short' : 'The order reserves stock in the warehouse', BLUE); }); });
    t = 1550;
    if (sh) {
      at(t, function () { send('hub', 'buy', 'is-live', 650, function () { allSt('Purchase ordered'); ping('buy'); say('The shortage triggers a purchase order', VIOLET); }); });
      t += 1100;
    }
    at(t, function () { allSt('Delivered'); ping('wh'); say('The delivery updates stock levels', BLUE); });
    t += 800;
    at(t, function () { send('hub', 'fin', 'is-live', 650, function () { allSt('Invoiced'); ping('fin'); say('The invoice is created from the order and its entries post themselves', BLUE); }); });
    t += 1250;
    at(t, function () { allSt('Paid'); ping('fin'); say('The customer pays: the bank line reconciles against the invoice', TEAL); });
    at(t + 900, finish);
  }
  function run() { clearRun(); if (mode === 'sheets') runSheets(); else runErp(); }
  function finish() { busy = false; if (auto > 0) { auto--; at(2600, run); } }

  // ------------------------------------------------------------ switching modes: the files fold into one database
  function ghosts(toHub) {
    if (K.reduce) return;
    var hb = geo.hub;
    Object.keys(N).forEach(function (d, i) {
      var sb = K.box(N[d].sub, stage), g = K.el('span', 'ew-ghost', SUB.sheets[d]);
      stage.appendChild(g);
      var fx = sb.cx, fy = sb.cy, tx = hb.cx, ty = hb.cy;
      if (!toHub) { fx = hb.cx; fy = hb.cy; tx = sb.cx; ty = sb.cy; }
      g.style.transform = 'translate(' + fx.toFixed(1) + 'px,' + fy.toFixed(1) + 'px) translate(-50%,-50%)' + (toHub ? '' : ' scale(.4)');
      g.style.opacity = toHub ? '1' : '0';
      g.style.transitionDelay = (i * 55) + 'ms';
      requestAnimationFrame(function () { requestAnimationFrame(function () {
        g.style.transform = 'translate(' + tx.toFixed(1) + 'px,' + ty.toFixed(1) + 'px) translate(-50%,-50%)' + (toHub ? ' scale(.4)' : '');
        g.style.opacity = toHub ? '0' : '1';
      }); });
      setTimeout(function () { g.remove(); }, 900 + i * 55);
    });
  }
  function setMode(m) {
    var from = mode; mode = m;
    segBtns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.mode === m)); });
    stage.dataset.mode = m; tip.hide();
    resetAll();
    if (from !== m && m === 'erp') ghosts(true);          // files fold into the one database...
    Object.keys(N).forEach(function (d) { N[d].sub.textContent = SUB[m][d]; });
    place();
    if (from !== m && m === 'sheets') ghosts(false);      // ...or scatter back out into five files
    drawWires(true);
    auto = 0;
    if (K.reduce) run(); else at(m === 'erp' ? 950 : 500, run);
  }
  segBtns.forEach(function (b) { b.addEventListener('click', function () { started = true; if (b.dataset.mode !== mode) setMode(b.dataset.mode); }); });
  shortBtn.addEventListener('click', function () {
    started = true; short = !short; shortBtn.setAttribute('aria-pressed', String(short));
    if (!busy) run();
  });
  K.$('[data-run]', root).addEventListener('click', function () { started = true; auto = 0; run(); });

  // ------------------------------------------------------------ hover or focus a team
  Object.keys(N).forEach(function (d) {
    var el = N[d].el;
    function on() {
      var g = geo[d], t = TIP[mode][d], lines = [t[0], t[1]];
      if (mode === 'sheets' && N[d].c) lines.push('Re-typed here so far: ' + N[d].c);
      if (g.y < 60) tip.show(lines, g.cx, g.b + 26, true); else tip.show(lines, g.cx, g.y - 2);
    }
    el.addEventListener('pointerenter', on); el.addEventListener('focus', on);
    el.addEventListener('pointerleave', tip.hide); el.addEventListener('blur', tip.hide);
  });

  var started = false, rz = 0;
  window.addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(function () { place(); drawWires(false); }, 120); });
  Object.keys(N).forEach(function (d) { N[d].sub.textContent = SUB.sheets[d]; });
  place(); drawWires(false); renderK();
  if (K.reduce) run();
  return {
    start: function (first) {
      root.classList.remove('is-paused');
      place(); drawWires(false); loop.on();
      if (first && !started) { started = true; if (!K.reduce) { auto = 1; at(600, run); } }
    },
    stop: function () { loop.off(); root.classList.add('is-paused'); }
  };
});
