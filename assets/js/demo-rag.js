/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* RAG knowledge page: retrieval with permissions. A question is embedded and searched against a
   sample corpus of 60 passages (SOPs, policies, product specs, Odoo records) drawn as a 2D map;
   the six closest are ranked by similarity; a permission filter locks the ones the chosen role may
   not see; the answer is composed only from what remains above the relevance bar, with a citation on
   every sentence, or the assistant says it has no confident answer. */
TN.demo('rag', function (root, K) {
  var svg = K.$('.rtv-svg', root), plot = K.$('.rtv-plot', root), list = K.$('.rtv-list', root), slider = K.$('#rtv-bar', root);
  var KP = {}; K.$$('[data-k]', root).forEach(function (n) { KP[n.dataset.k] = n; });
  var ST = K.$$('.rtv-pipe li', root), STT = K.$$('.rtv-pipe small', root), vec = K.$('.rtv-vec', root);
  var tip = K.tip(plot);
  var TYPES = { sop: ['SOP', '#0E9384'], pol: ['Policy', '#3167CA'], spec: ['Product spec', '#D97B12'], odoo: ['Odoo record', '#714B67'] };
  var ROLES = { fin: ['Finance', ['all', 'fin']], sal: ['Sales', ['all', 'sal']], wh: ['Warehouse', ['all', 'wh']], mgr: ['Manager', ['all', 'fin', 'sal', 'wh', 'mgr']] };
  var ACL = { all: 'all staff', fin: 'Finance', sal: 'Sales', wh: 'Warehouse', mgr: 'managers' };
  var CL = [['Finance', .5, .12, 'fin'], ['Procurement', .19, .3, 'all'], ['Sales pricing', .81, .3, 'sal'], ['Warehouse', .2, .74, 'wh'], ['Products', .8, .74, 'all'], ['HR', .5, .89, 'all']];
  // questions: text, position in the map, and the passages written for it: type, title, access, similarity, angle, claim
  var Q = [
    { t: 'What is the approval limit on purchase orders?', p: [.27, .31], rel: [
      ['pol', 'Procurement policy §3.1', ['all'], .88, 200, 'Purchase orders up to S$ 5,000 can be confirmed by the requester’s team lead.'],
      ['odoo', 'Purchase settings: order approval', ['fin'], .85, 320, 'In Odoo, orders above S$ 5,000 need a manager’s approval before they are confirmed.'],
      ['sop', 'Finance SOP FP-02 §2', ['fin'], .79, 40, 'Orders above S$ 50,000 also need the finance director’s sign-off, recorded on the order.'],
      ['sop', 'Procurement SOP PR-01 §4', ['all'], .74, 125, 'Raise the request in Purchase with the supplier quote attached; the approver follows the amount.']] },
    { t: 'How do I return a damaged delivery to a supplier?', p: [.25, .66], rel: [
      ['sop', 'Warehouse SOP WH-07 §4', ['wh'], .88, 150, 'Photograph the damage and note it on the receipt before you validate it.'],
      ['odoo', 'Inventory: return from a receipt', ['wh'], .85, 20, 'In Odoo, create a return from the validated receipt; it raises the return transfer to the vendor.'],
      ['sop', 'Finance SOP AP-03 §5', ['fin'], .79, 300, 'Finance then asks the vendor for a credit note against the bill.'],
      ['pol', 'Quality policy §2', ['all'], .74, 230, 'Damage above S$ 500 is reported to the quality lead the same day.']] },
    { t: 'What discount can I give on a bulk order?', p: [.77, .33], rel: [
      ['pol', 'Sales pricing policy §2', ['sal'], .89, 330, 'Sales can give up to 10% on orders of 50 units or more.'],
      ['odoo', 'Pricelist: Bulk 50+', ['sal', 'fin'], .84, 200, 'The Bulk 50+ pricelist in Odoo applies 8% automatically from 50 units.'],
      ['pol', 'Discount approval matrix', ['mgr'], .82, 90, 'Discounts from 10% to 20% need the sales manager’s approval; above 20%, the director’s.'],
      ['sop', 'Quotation SOP SQ-01 §3', ['sal'], .72, 250, 'Put any extra discount on the quotation line, where the approver can see it.']] },
    { t: 'What is the X200 sensor’s operating temperature range?', p: [.76, .69], rel: [
      ['spec', 'X200 datasheet §2.1', ['all'], .91, 300, 'The X200 is rated for −20 °C to 70 °C.'],
      ['spec', 'X200 installation guide §5', ['all'], .8, 170, 'Keep it out of direct sun in enclosures: readings drift above 60 °C.'],
      ['odoo', 'Product: X200 sensor', ['sal', 'wh'], .78, 60, 'The X200 product record in Odoo lists IP65 and −20 to 70 °C.']] },
    { t: 'Can staff work remotely from abroad?', p: [.5, .58], rel: [
      ['pol', 'Flexible work policy §1', ['all'], .67, 75, 'Staff can work from home up to two days a week with their manager’s agreement.'],
      ['pol', 'Overseas assignments (HR)', ['mgr'], .69, 108, 'Overseas assignments are agreed case by case by HR and the country manager.'],
      ['pol', 'Travel policy §4', ['all'], .6, 92, 'Business travel is booked through the travel desk.']] }
  ];
  var FILL = [
    [['Finance SOP FP-03 · payment runs', 'sop'], ['Month-end close checklist', 'sop'], ['Credit control policy §2', 'pol'], ['Payment terms', 'odoo'], ['GST tax report', 'odoo'], ['Expense policy §4', 'pol', 'all'], ['Finance FAQ · reimbursements', 'sop', 'all']],
    [['Procurement policy §2 · vendor onboarding', 'pol'], ['Procurement SOP PR-01 §2 · RFQs', 'sop'], ['Vendor pricelists', 'odoo', 'fin'], ['Purchase agreements', 'odoo', 'fin'], ['Supplier code of conduct', 'pol'], ['Procurement SOP PR-03 · blanket orders', 'sop'], ['Reordering rules', 'odoo', 'wh']],
    [['Sales playbook §3 · objections', 'sop'], ['Pricelist: Standard SGD', 'odoo'], ['Sales pricing policy §4 · rebates', 'pol'], ['Quotation SOP SQ-01 §1', 'sop'], ['Commission plan', 'pol', 'mgr'], ['Quotation templates', 'odoo'], ['Key account rules', 'pol', 'mgr']],
    [['Warehouse SOP WH-02 · putaway', 'sop'], ['Warehouse SOP WH-05 · cycle counts', 'sop'], ['Barcode picking', 'odoo'], ['Safety policy · forklifts', 'pol', 'all'], ['Delivery routes', 'odoo'], ['Warehouse SOP WH-09 · customer returns', 'sop'], ['Lots and expiry dates', 'odoo']],
    [['X100 datasheet §2', 'spec'], ['X300 datasheet §1', 'spec'], ['Gateway G2 manual §4', 'spec'], ['X200 warranty terms', 'spec'], ['Product variants', 'odoo', 'sal'], ['Calibration SOP CA-01', 'sop', 'wh'], ['Spare parts list', 'spec']],
    [['Leave policy §3', 'pol'], ['Employee handbook §7 · conduct', 'pol'], ['Time off types', 'odoo'], ['Payroll calendar', 'sop', 'mgr'], ['Onboarding SOP HR-02', 'sop'], ['Salary bands', 'pol', 'mgr'], ['Training policy §2', 'pol']]
  ];
  // ---------------------------------------------------------------- the corpus: written passages first, then the rest around their clusters
  var C = [];
  Q.forEach(function (q, qi) {
    q.rel.forEach(function (r) { var d = (1 - r[3]) / 1.4, a = r[4] * Math.PI / 180; C.push({ ty: r[0], t: r[1], acl: r[2], q: qi, own: r[3], claim: r[5], x: q.p[0] + Math.cos(a) * d, y: q.p[1] + Math.sin(a) * d }); });
  });
  var seed = 7; function rnd() { seed = seed * 16807 % 2147483647; return seed / 2147483647; }
  FILL.forEach(function (f, ci) {
    f.forEach(function (it) {
      var x, y, ok = false, n = 0;
      while (!ok && n++ < 60) { x = CL[ci][1] + (rnd() - .5) * .24; y = CL[ci][2] + (rnd() - .5) * .19; ok = x > .04 && x < .96 && y > .05 && y < .95 && C.every(function (c) { return Math.hypot(c.x - x, c.y - y) > .045; }); }
      C.push({ ty: it[1], t: (it[1] === 'odoo' ? 'Odoo: ' : '') + it[0], acl: [it[2] || CL[ci][3]], q: -1, x: x, y: y });
    });
  });
  function sim(c, qi) { if (c.q === qi) return c.own; var q = Q[qi].p; return Math.min(.64, 1 - 1.4 * Math.hypot(c.x - q[0], c.y - q[1])); }
  function can(c, role) { return c.acl.some(function (a) { return ROLES[role][1].indexOf(a) >= 0; }); }

  // ---------------------------------------------------------------- the map
  var W = 1, H = 1, pad = 14, dots = [], qg = null;
  function X(u) { return pad + u * (W - pad * 2); } function Y(v) { return pad + v * (H - pad * 2); }
  function drawMap() {
    W = plot.clientWidth; H = plot.clientHeight; svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H); svg.textContent = '';
    CL.forEach(function (c) { var t = K.svg('text', { x: X(c[1]), y: Y(c[2]) + (c[2] < .5 ? -34 : 40), 'class': 'rtv-cl', 'text-anchor': 'middle' }); t.textContent = c[0]; svg.appendChild(t); });
    var lines = K.svg('g', { 'class': 'rtv-lines' }); svg.appendChild(lines);
    svg.appendChild(K.svg('circle', { 'class': 'rtv-rad', cx: 0, cy: 0, r: 10 }));
    dots = C.map(function (c, i) {
      var d = K.svg('circle', { cx: X(c.x).toFixed(1), cy: Y(c.y).toFixed(1), r: 4.4, 'class': 'rtv-d', fill: TYPES[c.ty][1] });
      d.addEventListener('pointerenter', function () { hover(i, true); }); d.addEventListener('pointerleave', function () { hover(i, false); });
      svg.appendChild(d); return d;
    });
    qg = K.svg('g', { 'class': 'rtv-qg' });
    qg.appendChild(K.svg('circle', { r: 11, 'class': 'rtv-qr' })); qg.appendChild(K.svg('path', { d: 'M-6 0H6M0 -6V6', 'class': 'rtv-qx' })); qg.appendChild(K.svg('circle', { r: 3.2, 'class': 'rtv-qc' }));
    svg.appendChild(qg);
    if (cur) paintMap(cur, 9);
  }
  function hover(i, on) {
    if (!on) { tip.hide(); return; }
    var c = C[i], s = cur ? sim(c, cur.qi) : 0;
    tip.show([c.t, TYPES[c.ty][0] + ' · ' + c.acl.map(function (a) { return ACL[a]; }).join(', '), 'Similarity ' + s.toFixed(2) + (cur && !can(c, cur.role) ? ' · locked for ' + ROLES[cur.role][0] : '')], X(c.x), Y(c.y) - 8);
  }
  // ---------------------------------------------------------------- one retrieval run
  var cur = null, qi = 2, role = 'sal', bar = .7, timers = [];
  function compute() {
    var ranked = C.map(function (c, i) { return { i: i, c: c, s: sim(c, qi) }; }).sort(function (a, b) { return b.s - a.s; }).slice(0, 6);
    ranked.forEach(function (r) { r.ok = can(r.c, role); r.above = r.s >= bar - 1e-9; r.use = r.ok && r.above && !!r.c.claim; });
    var used = ranked.filter(function (r) { return r.use; }).slice(0, 3);
    return { qi: qi, role: role, bar: bar, ranked: ranked, used: used };
  }
  function paintMap(run, step) {
    var q = Q[run.qi].p, qx = X(q[0]), qy = Y(q[1]), top = {}; run.ranked.forEach(function (r, k) { top[r.i] = r; });
    qg.setAttribute('transform', 'translate(' + qx.toFixed(1) + ',' + qy.toFixed(1) + ')'); qg.classList.toggle('is-on', step >= 2);
    var rad = K.$('.rtv-rad', svg), far = run.ranked[run.ranked.length - 1].c;
    rad.setAttribute('cx', qx); rad.setAttribute('cy', qy); rad.setAttribute('r', (Math.hypot(X(far.x) - qx, Y(far.y) - qy) + 6).toFixed(1));
    rad.classList.toggle('is-on', step >= 2);
    var g = K.$('.rtv-lines', svg); g.textContent = '';
    dots.forEach(function (d, i) {
      var r = top[i], c = C[i];
      d.setAttribute('class', 'rtv-d' + (r && step >= 3 ? ' is-top' : '') + (step >= 4 && !can(c, run.role) ? ' is-lock' : '') + (r && step >= 4 && r.use ? ' is-use' : ''));
      if (r && step >= 3) {
        var l = K.svg('path', { d: 'M' + qx.toFixed(1) + ' ' + qy.toFixed(1) + 'L' + X(c.x).toFixed(1) + ' ' + Y(c.y).toFixed(1), 'class': 'rtv-l' + (step >= 4 ? (r.use ? ' is-use' : !r.ok ? ' is-lock' : ' is-low') : '') });
        l.dataset.i = i; g.appendChild(l);
      }
    });
  }
  function row(r, k) {
    var li = K.el('li', 'rtv-r'); li.dataset.i = r.i;
    li.appendChild(K.el('i', 'rtv-rk', String(k + 1)));
    var t = li.appendChild(K.el('span', 'rtv-rt')); t.appendChild(K.el('b', null, r.c.t));
    var m = t.appendChild(K.el('small')); var sw = m.appendChild(K.el('i', 'dm-sw')); sw.style.setProperty('--c', TYPES[r.c.ty][1]);
    m.appendChild(document.createTextNode(TYPES[r.c.ty][0] + ' · ' + r.c.acl.map(function (a) { return ACL[a]; }).join(', ')));
    var b = li.appendChild(K.el('span', 'rtv-sb')); var s = b.appendChild(K.el('s')); s.style.transform = 'scaleX(' + K.clamp((r.s - .5) / .5, 0, 1).toFixed(3) + ')';
    li.appendChild(K.el('em', 'rtv-sv', r.s.toFixed(2)));
    li.appendChild(K.el('span', 'rtv-flag'));
    li.addEventListener('pointerenter', function () { mark(r.i, true); }); li.addEventListener('pointerleave', function () { mark(r.i, false); });
    return li;
  }
  function flags(run) {
    K.$$('.rtv-r', list).forEach(function (li, k) {
      var r = run.ranked[k], f = K.$('.rtv-flag', li);
      li.className = 'rtv-r ' + (!r.ok ? 'is-lock' : r.use ? 'is-use' : 'is-low');
      f.textContent = !r.ok ? 'Locked' : r.use ? 'Used [' + (run.used.indexOf(r) + 1) + ']' : r.above ? 'Not needed' : 'Below bar';
    });
    var locked = run.ranked.filter(function (r) { return !r.ok; }).length;
    KP.locked.textContent = locked ? locked + ' locked for ' + ROLES[run.role][0] : 'nothing locked';
    STT[4].textContent = locked ? locked + ' locked' : 'none locked';
  }
  function mark(i, on) {
    var d = dots[i]; if (d) d.classList.toggle('is-hot', on);
    K.$$('.rtv-l', svg).forEach(function (l) { if (+l.dataset.i === i) l.classList.toggle('is-hot', on); });
    K.$$('.rtv-r', list).forEach(function (li) { if (+li.dataset.i === i) li.classList.toggle('is-hot', on); });
  }
  function answer(run) {
    var a = KP.a, src = KP.src; a.textContent = ''; src.textContent = '';
    KP.q.textContent = Q[run.qi].t; KP.as.textContent = 'as ' + ROLES[run.role][0];
    var locked = run.ranked.filter(function (r) { return !r.ok && r.above && r.c.claim; });
    if (!run.used.length) {
      a.className = 'rtv-a is-none';
      var h = a.appendChild(K.el('p', 'rtv-none')); h.appendChild(K.el('b', null, 'No confident answer'));
      a.appendChild(K.el('p', null, 'I can’t find this in the documents available to you, so I won’t guess. The question is logged for the knowledge owners to review.'));
      STT[5].textContent = 'no confident answer';
    } else {
      a.className = 'rtv-a';
      var p = a.appendChild(K.el('p'));
      run.used.forEach(function (r, k) {
        p.appendChild(document.createTextNode((k ? ' ' : '') + r.c.claim + ' '));
        var c = p.appendChild(K.el('button', 'rtv-cite', '[' + (k + 1) + ']')); c.type = 'button'; c.setAttribute('aria-label', 'Source ' + (k + 1) + ': ' + r.c.t);
        ['pointerenter', 'focus'].forEach(function (e) { c.addEventListener(e, function () { mark(r.i, true); }); });
        ['pointerleave', 'blur'].forEach(function (e) { c.addEventListener(e, function () { mark(r.i, false); }); });
        var li = src.appendChild(K.el('li')); li.appendChild(K.el('b', null, '[' + (k + 1) + '] ' + r.c.t)); li.appendChild(K.el('span', null, TYPES[r.c.ty][0] + ' · similarity ' + r.s.toFixed(2)));
      });
      if (run.used.some(function (r) { return r.s < .7; })) a.appendChild(K.el('p', 'rtv-warn', 'Low bar: a passage under 0.70 was used, so this answer may be only loosely related.'));
      STT[5].textContent = run.used.length + (run.used.length > 1 ? ' sources cited' : ' source cited');
    }
    KP.behind.textContent = locked.length ? 'Behind the scenes: ' + locked.length + ' relevant passage' + (locked.length > 1 ? 's were' : ' was') + ' locked for ' + ROLES[run.role][0] + ' and never reached the model.' : 'Behind the scenes: nothing relevant was locked for ' + ROLES[run.role][0] + '.';
  }
  function go() {
    timers.forEach(clearTimeout); timers = [];
    var run = cur = compute();
    STT[0].textContent = '“' + ['PO approval', 'damaged delivery', 'bulk discount', 'X200 range', 'working abroad'][run.qi] + '”';
    vec.textContent = ''; for (var i = 0; i < 14; i++) { var b = vec.appendChild(K.el('i')); b.style.transform = 'scaleY(' + (.25 + ((run.qi * 7 + i * 13) % 10) / 13).toFixed(2) + ')'; }
    list.textContent = ''; run.ranked.forEach(function (r, k) { list.appendChild(row(r, k)); });
    var at = function (step) {
      ST.forEach(function (s, k) { s.classList.toggle('is-on', k <= step); s.classList.toggle('is-now', k === step); });
      root.classList.toggle('rtv-s3', step >= 3); root.classList.toggle('rtv-s5', step >= 5);
      paintMap(run, step);
      if (step >= 4) flags(run);
      if (step >= 5) answer(run);
      if (step < 4) { K.$$('.rtv-r', list).forEach(function (li) { li.className = 'rtv-r'; K.$('.rtv-flag', li).textContent = ''; }); }
      if (step < 5) { KP.a.textContent = ''; KP.src.textContent = ''; KP.behind.textContent = ''; KP.q.textContent = Q[run.qi].t; STT[5].textContent = 'with citations'; }
    };
    if (K.reduce || !started) { at(5); return; }
    [0, 380, 850, 1500, 2300, 3000].forEach(function (ms, k) { timers.push(setTimeout(function () { at(k); }, ms)); });
  }
  // ---------------------------------------------------------------- controls
  K.$$('[data-q]', root).forEach(function (b) { b.addEventListener('click', function () { qi = +b.dataset.q; K.$$('[data-q]', root).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); go(); }); });
  K.$$('[data-role]', root).forEach(function (b) { b.addEventListener('click', function () { role = b.dataset.role; K.$$('[data-role]', root).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); go(); }); });
  slider.addEventListener('input', function () {
    bar = +slider.value; KP.bar.textContent = bar.toFixed(2); root.style.setProperty('--rtv-bar', ((bar - .5) / .5 * 100).toFixed(1) + '%');
    timers.forEach(clearTimeout); timers = []; var run = cur = compute();
    list.textContent = ''; run.ranked.forEach(function (r, k) { list.appendChild(row(r, k)); });
    ST.forEach(function (s) { s.classList.add('is-on'); s.classList.remove('is-now'); }); root.classList.add('rtv-s3', 'rtv-s5');
    paintMap(run, 5); flags(run); answer(run);
  });
  root.style.setProperty('--rtv-bar', '40%');
  var started = false, rt = 0;
  window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(drawMap, 140); });
  drawMap(); go();
  return {
    start: function (first) { if (first) { started = true; drawMap(); if (!K.reduce) go(); } },
    stop: function () {}
  };
});
