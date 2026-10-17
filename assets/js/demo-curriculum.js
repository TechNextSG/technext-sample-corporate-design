/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* Odoo training page: a role-based curriculum builder. Pick the roles going live and the plan
   assembles the Odoo modules each role needs; every module has a session, a sandbox exercise on a
   staging copy of the client's data and a sign-off check. The timeline runs key users first, end
   users next, then train-the-trainer, UAT and a readiness check. A competency radar per role fills
   as checkpoints pass, one sign-off fails and is retaken, and a go-live readiness score gates the
   cut-over. The whole state is a pure function of the plan day, so the timeline can be dragged. */
TN.demo('curriculum', function (root, K) {
  var ROLES = {
    adm: { n: 'Admin', team: 'Administrators', c: '#475569', ic: null },
    acc: { n: 'Accountant', team: 'Finance team', c: '#0E9384', ic: 'accountant' },
    sal: { n: 'Sales', team: 'Sales team', c: '#3167CA', ic: 'sale' },
    wh: { n: 'Warehouse', team: 'Warehouse team', c: '#D97B12', ic: 'stock' },
    buy: { n: 'Buyer', team: 'Purchasing', c: '#7447D6', ic: 'purchase' },
    mgr: { n: 'Manager', team: 'Managers', c: '#714B67', ic: 'approvals' }
  };
  var ORDER = ['adm', 'acc', 'sal', 'wh', 'buy', 'mgr'];          // administrators are trained first
  var APPS = [['acct', 'Accounting', 'accountant'], ['sale', 'Sales', 'sale'], ['inv', 'Inventory', 'stock'],
              ['pur', 'Purchase', 'purchase'], ['appr', 'Approvals and reports', 'approvals'], ['set', 'Settings', null]];
  // id, app, module, radar label, roles, session, exercise on your data, sign-off check
  var MODS = [
    ['cinv', 'acct', 'Invoices and credit notes', 'Invoices', ['acc'], 'Post, send and correct customer invoices', 'Invoice last week’s real orders, then credit one line', 'Posts five invoices and a credit note unaided'],
    ['bill', 'acct', 'Vendor bills', 'Bills', ['acc', 'buy'], 'Enter bills and match them to orders and receipts', 'Match ten of last month’s bills to their purchase orders', 'Spots the one bill that does not match'],
    ['bank', 'acct', 'Bank reconciliation', 'Bank rec.', ['acc'], 'Bank feeds, suggested matches and reconciliation rules', 'Reconcile last month’s statement from your own bank', 'Statement cleared, open lines explained'],
    ['close', 'acct', 'Tax and month-end', 'Month-end', ['acc', 'mgr'], 'Tax report, accruals, lock dates and the closing checklist', 'Close a past month on the staging copy', 'Tax report agrees with the ledger'],
    ['crm', 'sale', 'CRM pipeline', 'Pipeline', ['sal', 'mgr'], 'Leads, stages and next activities', 'Move your own open deals through the stages', 'Every open deal has a next activity'],
    ['quote', 'sale', 'Quotations and pricelists', 'Quotations', ['sal'], 'Quotation templates, pricelists and discounts', 'Quote three real customers on their own pricelists', 'Right pricelist and discount, first time'],
    ['order', 'sale', 'Order to invoice', 'To invoice', ['sal'], 'Confirm, deliver, then invoice delivered quantities', 'Take one real order from quotation to invoice', 'One order end to end, unaided'],
    ['portal', 'sale', 'Customer portal', 'Portal', ['sal'], 'Online signature and payment on quotations', 'Send a quotation to a colleague to sign online', 'Signature tested, customer view explained'],
    ['rcpt', 'inv', 'Receipts and put-away', 'Receipts', ['wh'], 'Receive by barcode and put away to locations', 'Receive an open purchase order by barcode', 'Receipt validated, stock in the right bin'],
    ['pick', 'inv', 'Picking and delivery', 'Picking', ['wh'], 'Barcode picking, packing and delivery orders', 'Pick and pack today’s orders with the scanner', 'A full pick with no wrong items'],
    ['adj', 'inv', 'Transfers and adjustments', 'Adjustments', ['wh'], 'Internal transfers, scrap and quantity corrections', 'Move stock between locations, fix one quantity', 'Adjustment posted with the right reason'],
    ['count', 'inv', 'Cycle counts', 'Counts', ['wh'], 'Count sheets, applying counts and variances', 'Count one aisle of your warehouse and apply it', 'Variance found and explained'],
    ['rfq', 'pur', 'RFQs and purchase orders', 'RFQs', ['buy'], 'Requests for quotation, vendor replies, confirming', 'Turn this week’s reorder list into RFQs', 'Best offer confirmed as an order'],
    ['reord', 'pur', 'Reordering rules', 'Reordering', ['buy', 'wh'], 'Minimum and maximum, lead times, replenishment', 'Set min and max for ten of your fast movers', 'Replenishment suggestions make sense to them'],
    ['vprice', 'pur', 'Vendor pricelists', 'Vendor prices', ['buy'], 'Vendor prices, quantities and lead times', 'Load two vendors’ real price lists', 'Orders pick the right vendor price'],
    ['appr', 'appr', 'Approvals', 'Approvals', ['mgr'], 'Approve or refuse purchases, expenses and time off', 'Clear the week’s pending approvals', 'Queue cleared, reasons recorded'],
    ['dash', 'appr', 'Dashboards and reports', 'Dashboards', ['mgr'], 'Live pivots, dashboards and filters', 'Build your weekly view from live data', 'Reads margin, cash and overdue unaided'],
    ['users', 'set', 'Users and access rights', 'Access', ['adm'], 'Users, groups, record rules and companies', 'Create your real users with the planned rights', 'Each user sees only their own menus'],
    ['seq', 'set', 'Settings and templates', 'Templates', ['adm'], 'Company settings, numbering and document layouts', 'Set the invoice layout and numbering', 'Templates signed off by finance'],
    ['rules', 'set', 'Approval rules', 'Approval rules', ['adm'], 'Thresholds and approvers per document', 'Set the approval step for large purchases', 'Rule tested with a buyer and a manager']
  ].map(function (m) { return { id: m[0], app: m[1], name: m[2], short: m[3], roles: m[4], ses: m[5], ex: m[6], so: m[7] }; });
  var MOD = {}; MODS.forEach(function (m) { MOD[m.id] = m; });
  // checkpoint weights on a module's axis: key user trained, team session, sandbox exercise, sign-off
  var W = { ku: .3, ses: .15, ex: .2, so: .35 };
  var T = 36, LIVE = 30;                                       // plan days shown; go-live after six working weeks
  var SH = { ttt: [21.6, 24.4], uat: [24.6, 28.6], chk: [28.7, 29.7], ref: [32.4, 34.2] };
  var GEAR = '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="7" fill="currentColor" fill-opacity=".2" stroke="none"/><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  var TICK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
  function icon(ic, size) { return ic ? K.oi(ic, size) : GEAR; }

  var chips = {}, sum = K.$('.cur-sum', root);
  ORDER.forEach(function (r) { chips[r] = K.$('.cur-chips [data-role="' + r + '"]', root); });
  var board = K.$('.cur-board', root), detail = K.$('.cur-detail', root), logEl = K.$('.cur-log', root);
  var tabs = K.$('.cur-tabs', root), radar = K.$('.cur-radar', root);
  var gv = K.$('.cur-gv', root), kReady = K.$('[data-k="ready"]', root), verdict = K.$('.cur-verdict', root), gates = K.$('.cur-gates', root);
  var weeks = K.$('.cur-weeks', root), labels = K.$('.cur-labels', root), lane = K.$('.cur-lane', root), rowsEl = K.$('.cur-rows', root);
  var bands = K.$('.cur-bands', root), head = K.$('.cur-head', root), golive = K.$('.cur-golive', root);
  var scrub = K.$('.cur-scrub input', root), dayEl = K.$('.cur-day', root), runBtn = K.$('[data-run]', root), runLab = K.$('[data-run] span', root);
  var tip = K.tip(root);

  var on = { acc: true, sal: true, wh: true, buy: false, mgr: false, adm: false };
  var sel = [], evs = [], blocks = [], fail = null, t = 0, playing = false, touched = false, picked = null, focus = null, focusPinned = false;
  var disp = {}, lastLog = -1;

  function X(d) { return d <= LIVE ? .86 * d / LIVE : .86 + .14 * (d - LIVE) / (T - LIVE); }   // after go-live is compressed
  function Xinv(f) { return f <= .86 ? f / .86 * LIVE : LIVE + (f - .86) / .14 * (T - LIVE); }
  function pct(d) { return (X(d) * 100).toFixed(3) + '%'; }
  function modsOf(r) { return MODS.filter(function (m) { return m.roles.indexOf(r) >= 0; }); }
  function axesOf(r) {
    var ms = modsOf(r).map(function (m) { return { id: m.id, label: m.short }; }), n = ms.length + 2, out = [{ id: 'teach', label: 'Trains others' }];
    for (var i = 1; i < n; i++) out.push(i === Math.floor(n / 2) ? { id: 'err', label: 'Common errors' } : ms.shift());
    return out;
  }
  function dayLabel(d) { if (d >= LIVE) return d < LIVE + .05 ? 'Go-live' : 'After go-live'; var w = Math.floor(d / 5); return 'Week ' + (w + 1) + ' · day ' + (Math.floor(d - w * 5) + 1); }

  // ---------------------------------------------------------------- the plan: blocks and checkpoints
  function build() {
    sel = ORDER.filter(function (r) { return on[r]; });
    var n = sel.length, kuD = Math.min(3, 9.6 / n), euD = Math.min(3.2, 9.6 / n);
    evs = []; blocks = [];
    sel.forEach(function (r, i) {
      var ms = modsOf(r), k = ms.length;
      var ku = { r: r, kind: 'ku', t0: 1 + i * kuD, t1: 1 + (i + 1) * kuD - .12 };
      var eu = { r: r, kind: 'eu', t0: 11 + i * euD, t1: 11 + (i + 1) * euD - .12 };
      blocks.push(ku, eu);
      ms.forEach(function (m, j) {
        evs.push({ t: K.lerp(ku.t0, ku.t1, (j + .92) / k), r: r, m: m.id, k: 'ku', last: j === k - 1 });
        evs.push({ t: K.lerp(eu.t0, eu.t1, (j + .3) / k), r: r, m: m.id, k: 'ses' });
        evs.push({ t: K.lerp(eu.t0, eu.t1, (j + .62) / k), r: r, m: m.id, k: 'ex' });
        evs.push({ t: K.lerp(eu.t0, eu.t1, (j + .95) / k), r: r, m: m.id, k: 'so' });
      });
    });
    // one sign-off is not passed first time; a retake is booked before train-the-trainer
    var fr = on.wh ? ['wh', 'count'] : on.acc ? ['acc', 'bank'] : [sel[0], modsOf(sel[0]).slice(-1)[0].id];
    fail = null;
    evs.forEach(function (e) { if (e.k === 'so' && e.r === fr[0] && e.m === fr[1]) { e.fail = true; fail = e; } });
    var rt = { r: fr[0], kind: 'rt', t0: 20.75, t1: 21.45 };
    blocks.push(rt); fail.retake = rt.t1;
    evs.push({ t: rt.t1, r: fr[0], m: fr[1], k: 'rt' });
    // milestones for the log
    [[SH.ttt[0], 'ttt'], [SH.uat[0], 'uat'], [SH.chk[1], 'chk'], [LIVE, 'live'], [SH.ref[1], 'ref']].forEach(function (x) { evs.push({ t: x[0], k: x[1] }); });
    evs.sort(function (a, b) { return a.t - b.t; });
    sel.forEach(function (r) { if (!disp[r]) disp[r] = {}; });
    if (!focus || !on[focus]) { focus = sel[0]; focusPinned = false; }
    if (picked && !MOD[picked].roles.some(function (r) { return on[r]; })) picked = null;
    renderBoard(); renderTimeline(); renderTabs(); drawRadarFrame(); lastLog = -1; logEl.textContent = '';
    var nm = MODS.filter(function (m) { return m.roles.some(function (r) { return on[r]; }); }).length;
    var nso = evs.filter(function (e) { return e.k === 'so'; }).length;
    sum.textContent = n + (n === 1 ? ' role' : ' roles') + ' · ' + nm + ' modules · ' + nso + ' sign-off checks';
  }

  // ---------------------------------------------------------------- state at day t (pure)
  function state(d) {
    var s = { done: {}, failNow: false, so: 0, soAll: 0, ex: 0, exAll: 0, ku: 0 };
    evs.forEach(function (e) {
      if (!e.m) return;
      var key = e.r + ':' + e.m;
      if (e.k === 'so') s.soAll++;
      if (e.k === 'ex') s.exAll++;
      if (e.t > d) return;
      var x = s.done[key] || (s.done[key] = {});
      if (e.k === 'so' && e.fail) { if (d < e.retake) { x.fail = true; s.failNow = true; } return; }
      if (e.k === 'rt') { x.fail = false; x.so = true; s.so++; return; }
      x[e.k] = true;
      if (e.k === 'so') s.so++;
      if (e.k === 'ex') s.ex++;
      if (e.k === 'ku') s.ku++;
    });
    function prog(a) { return K.clamp((d - a[0]) / (a[1] - a[0]), 0, 1); }
    s.ttt = prog(SH.ttt); s.uat = prog(SH.uat); s.chk = prog(SH.chk); s.ref = prog(SH.ref);
    s.ready = s.soAll ? 10 * s.ku / s.soAll + 40 * s.so / s.soAll + 10 * s.ex / s.exAll + 10 * s.ttt + 20 * s.uat + 10 * s.chk : 0;
    return s;
  }
  function axisValue(s, r, a) {
    var ms = modsOf(r), k = ms.length, v = 0;
    if (a === 'err') { ms.forEach(function (m) { var x = s.done[r + ':' + m.id]; if (x && x.ex) v += .3 / k; }); return v + .7 * s.uat; }
    if (a === 'teach') { ms.forEach(function (m) { var x = s.done[r + ':' + m.id]; if (x && x.ku) v += .3 / k; }); return v + .7 * s.ttt; }
    var x = s.done[r + ':' + a] || {};
    return (x.ku ? W.ku : 0) + (x.ses ? W.ses : 0) + (x.ex ? W.ex : 0) + (x.so ? W.so : 0);
  }

  // ---------------------------------------------------------------- board: modules per Odoo app
  var cards = {};
  function roleStatus(x) { return x.so ? 'signed off' : x.fail ? 'retake booked' : x.ex ? 'practised on your data' : x.ses ? 'session done' : x.ku ? 'key user trained' : 'planned'; }
  function renderBoard() {
    board.textContent = '';
    APPS.forEach(function (a) {
      var ms = MODS.filter(function (m) { return m.app === a[0] && m.roles.some(function (r) { return on[r]; }); });
      if (!ms.length) return;
      var col = K.el('div', 'cur-col'), h = K.el('p', 'cur-colh');
      h.innerHTML = icon(a[2], 18); h.appendChild(K.el('b', null, a[1])); h.appendChild(K.el('small', null, String(ms.length)));
      col.appendChild(h);
      ms.forEach(function (m) {
        var c = cards[m.id];
        if (!c) {
          c = cards[m.id] = K.el('button', 'cur-card-m is-new'); c.type = 'button'; c.dataset.m = m.id;
          var top = K.el('span', 'cur-mt'); top.appendChild(K.el('b', null, m.name)); var st = K.el('i', 'cur-ms'); st.innerHTML = TICK; top.appendChild(st);
          c.appendChild(top); c.appendChild(K.el('span', 'cur-pips'));
          c.addEventListener('click', function () { touched = true; picked = picked === m.id ? null : m.id; lastDetail = ''; paint(state(t), 0, true); });
          c.addEventListener('pointerenter', function () {
            var s = state(t), b = K.box(c, root);
            tip.show([m.name].concat(m.roles.filter(function (r) { return on[r]; }).map(function (r) { return ROLES[r].n + ': ' + roleStatus(s.done[r + ':' + m.id] || {}); })), b.cx, b.y);
          });
          c.addEventListener('pointerleave', function () { tip.hide(); });
        } else c.classList.remove('is-new');
        var pips = K.$('.cur-pips', c); pips.textContent = ''; c._p = []; c._sig = '';
        m.roles.filter(function (r) { return on[r]; }).forEach(function (r) {
          var p = K.el('span', 'cur-pip'); p.style.setProperty('--c', ROLES[r].c);
          p.setAttribute('aria-hidden', 'true');
          var q = ['ku', 'ses', 'ex', 'so'].map(function () { var i = K.el('i'); p.appendChild(i); return i; });
          pips.appendChild(p); c._p.push({ r: r, q: q });
        });
        c.setAttribute('aria-label', m.name + ', ' + a[1] + ': show the exercise and sign-off check');
        col.appendChild(c);
      });
      board.appendChild(col);
    });
  }

  // ---------------------------------------------------------------- timeline
  var laneW = 1;
  function renderTimeline() {
    weeks.textContent = ''; labels.textContent = ''; rowsEl.textContent = ''; bands.textContent = '';
    var wk = K.el('div', 'cur-wk'), ph = K.el('div', 'cur-ph');
    for (var w = 0; w < 6; w++) { var x = K.el('span', null, 'W' + (w + 1)); x.style.left = pct(w * 5); x.style.width = 'calc(' + pct(5) + ' - 2px)'; wk.appendChild(x); }
    var a = K.el('span', 'is-after', 'After go-live'); a.style.left = pct(LIVE); a.style.right = '0'; wk.appendChild(a);
    [[1, 10.6, 'Key users'], [11, 20.6, 'End users'], [SH.ttt[0], SH.ttt[1], 'Train-the-trainer'], [SH.uat[0], SH.uat[1], 'UAT'], [SH.ref[0] - .6, T, 'Refresher']].forEach(function (p) {
      var s = K.el('span', null, p[2]); s.style.left = pct(p[0]); s.style.width = 'calc(' + (X(p[1]) * 100 - X(p[0]) * 100).toFixed(3) + '% - 2px)'; ph.appendChild(s);
    });
    weeks.appendChild(wk); weeks.appendChild(ph);
    sel.forEach(function (r) {
      var R = ROLES[r], lab = K.el('button', 'cur-rl'); lab.type = 'button'; lab.dataset.r = r; lab.style.setProperty('--c', R.c);
      lab.innerHTML = icon(R.ic, 16); lab.appendChild(K.el('span', null, R.n));
      lab.setAttribute('aria-label', 'Show the ' + R.n + ' competency radar');
      lab.addEventListener('click', function () { touched = true; focus = r; focusPinned = true; renderTabs(); drawRadarFrame(); paint(state(t)); });
      labels.appendChild(lab);
      var row = K.el('div', 'cur-row'); row.dataset.r = r; row.style.setProperty('--c', R.c);
      blocks.filter(function (b) { return b.r === r; }).forEach(function (b) {
        var el = K.el('div', 'cur-b cur-b--' + b.kind); el.style.left = pct(b.t0); el.style.width = ((X(b.t1) - X(b.t0)) * 100).toFixed(3) + '%';
        el.appendChild(K.el('i')); el.appendChild(K.el('span', null, b.kind === 'ku' ? 'Key user' : b.kind === 'eu' ? 'End users' : 'Retake'));
        el.addEventListener('pointerenter', function () {
          var bx = K.box(el, root), n = modsOf(r).length;
          var lines = b.kind === 'ku' ? [R.n + ' · key user', n + ' modules, deep and hands-on, on your staging copy']
            : b.kind === 'eu' ? [R.team + ' · end users', n + ' sessions, exercises and sign-off checks'] : ['Retake · ' + MOD[fail.m].name, 'A second attempt at the sign-off after more practice'];
          tip.show(lines, bx.cx, bx.y);
        });
        el.addEventListener('pointerleave', function () { tip.hide(); });
        b.el = el; row.appendChild(el);
      });
      rowsEl.appendChild(row);
    });
    [['ttt', 'Train-the-trainer', 'Key users rehearse teaching the rest, with the quick-reference guides'],
     ['uat', 'UAT', 'Each team runs its tasks end to end; gaps are fixed on staging'],
     ['chk', 'Readiness check', 'Go-live readiness checked before cut-over'],
     ['ref', 'Refresher', 'A refresher session after the first month-end']].forEach(function (p) {
      var b = K.el('div', 'cur-band cur-band--' + p[0]); b.style.left = pct(SH[p[0]][0]); b.style.width = ((X(SH[p[0]][1]) - X(SH[p[0]][0])) * 100).toFixed(3) + '%';
      b.appendChild(K.el('i'));
      b.addEventListener('pointerenter', function () { var bx = K.box(b, root); tip.show([p[1], p[2]], bx.cx, bx.y); });
      b.addEventListener('pointerleave', function () { tip.hide(); });
      bands.appendChild(b); SH[p[0]].el = b;
    });
    golive.style.left = pct(LIVE);
    size();
  }
  var tlw = K.$('.cur-tlw', root), tlView = 0, tlFull = 0, tlLast = -1;
  function size() { laneW = lane.offsetWidth || 1; tlView = tlw.clientWidth; tlFull = tlw.scrollWidth; }
  function follow() {                                            // keep the playhead in view when the timeline scrolls
    if (tlFull <= tlView + 4) return;
    var x = K.clamp(118 + X(t) * laneW - tlView * .45, 0, tlFull - tlView);
    if (Math.abs(x - tlLast) > 24 || x === 0) { tlLast = x; tlw.scrollLeft = x; }
  }

  // ---------------------------------------------------------------- radar
  var rPoly = null, rDots = [], CX = 150, CY = 100, RR = 64;
  function renderTabs() {
    tabs.textContent = '';
    sel.forEach(function (r) {
      var b = K.el('button', null, ROLES[r].n); b.type = 'button'; b.style.setProperty('--c', ROLES[r].c);
      b.setAttribute('aria-pressed', String(r === focus));
      b.addEventListener('click', function () { touched = true; focus = r; focusPinned = true; renderTabs(); drawRadarFrame(); paint(state(t), 0, true); });
      tabs.appendChild(b);
    });
  }
  function ang(i, n) { return -Math.PI / 2 + i * 2 * Math.PI / n; }
  function pt(i, n, v) { var a = ang(i, n); return [CX + Math.cos(a) * RR * v, CY + Math.sin(a) * RR * v]; }
  function drawRadarFrame() {
    radar.textContent = '';
    var ax = axesOf(focus), n = ax.length, R = ROLES[focus], Wd = Math.max(240, radar.clientWidth || 300);
    radar.setAttribute('viewBox', '0 0 ' + Wd + ' 200');
    CX = Wd / 2;
    var g = K.svg('g', { 'class': 'cur-rg' }), texts = ax.map(function (a) {
      var tx = K.svg('text', { 'class': a.id === 'err' || a.id === 'teach' ? 'cur-rl2 is-x' : 'cur-rl2' }); tx.textContent = a.label; g.appendChild(tx); return tx;
    });
    radar.appendChild(g);
    // the largest radius at which every label still fits inside the width
    RR = 76;
    texts.forEach(function (tx, i) {
      var c = Math.abs(Math.cos(ang(i, n))), w = tx.getComputedTextLength ? tx.getComputedTextLength() : 60;
      if (c >= .2) RR = Math.min(RR, (Wd / 2 - 6 - w) / c - 11);
    });
    RR = K.clamp(RR, 46, 76);
    var H = Math.round(2 * RR + 58); CY = H / 2 + 1;
    radar.setAttribute('viewBox', '0 0 ' + Wd + ' ' + H);
    [.25, .5, .75, 1].forEach(function (v) {
      var d = ax.map(function (_, i) { var p = pt(i, n, v); return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join('') + 'Z';
      g.insertBefore(K.svg('path', { d: d, 'class': v === 1 ? 'cur-rr is-out' : 'cur-rr' }), texts[0]);
    });
    ax.forEach(function (a, i) {
      var p = pt(i, n, 1), c = Math.cos(ang(i, n)), s = Math.sin(ang(i, n)), lr = RR + 11;
      g.insertBefore(K.svg('line', { x1: CX, y1: CY, x2: p[0].toFixed(1), y2: p[1].toFixed(1), 'class': 'cur-rs' }), texts[0]);
      texts[i].setAttribute('x', (CX + c * lr).toFixed(1));
      texts[i].setAttribute('y', (CY + s * lr + (s > .3 ? 9 : s < -.3 ? -2 : 4)).toFixed(1));
      texts[i].setAttribute('text-anchor', Math.abs(c) < .2 ? 'middle' : c > 0 ? 'start' : 'end');
    });
    rPoly = K.svg('path', { 'class': 'cur-rp', style: '--c:' + R.c }); radar.appendChild(rPoly);
    rDots = ax.map(function () { var c = K.svg('circle', { r: 3, 'class': 'cur-rd', style: '--c:' + R.c }); radar.appendChild(c); return c; });
    radar.setAttribute('aria-label', 'Competency radar for ' + R.n);
  }
  function paintRadar(s, snap, dt) {
    if (!focus) return false;
    var ax = axesOf(focus), n = ax.length, D = disp[focus], d = '', gap = 0;
    ax.forEach(function (a, i) {
      var v = axisValue(s, focus, a.id), cur = D[a.id] == null ? v : D[a.id];
      cur = snap ? v : cur + (v - cur) * (1 - Math.exp(-(dt || .016) * 9));
      if (Math.abs(v - cur) < .002) cur = v;
      gap = Math.max(gap, Math.abs(v - cur));
      D[a.id] = cur;
      var p = pt(i, n, Math.max(.02, cur));
      d += (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1);
      rDots[i].setAttribute('cx', p[0].toFixed(1)); rDots[i].setAttribute('cy', p[1].toFixed(1));
    });
    rPoly.setAttribute('d', d + 'Z');
    return gap > 0;
  }

  // ---------------------------------------------------------------- paint everything for day t
  var C = 2 * Math.PI * 42, memo = {};
  function set(k, node, v) { if (memo[k] !== v) { memo[k] = v; node.textContent = v; } }
  function paint(s, dt, snap) {
    MODS.forEach(function (m) {                                    // cards: one pip row per role
      var c = cards[m.id]; if (!c || !c.isConnected) return;
      var all = true, bad = false, sig = '';
      c._p.forEach(function (p) {
        var x = s.done[p.r + ':' + m.id] || {};
        sig += (x.ku ? 1 : 0) + '' + (x.ses ? 1 : 0) + (x.ex ? 1 : 0) + (x.so ? 1 : x.fail ? 2 : 0);
        if (!x.so) all = false; if (x.fail) bad = true;
      });
      sig += picked === m.id ? 'p' : '';
      if (sig === c._sig) return; c._sig = sig;
      c._p.forEach(function (p) {
        var x = s.done[p.r + ':' + m.id] || {};
        p.q[0].className = x.ku ? 'is-on' : ''; p.q[1].className = x.ses ? 'is-on' : ''; p.q[2].className = x.ex ? 'is-on' : '';
        p.q[3].className = x.so ? 'is-on' : x.fail ? 'is-bad' : '';
      });
      c.classList.toggle('is-done', all); c.classList.toggle('is-bad', bad); c.classList.toggle('is-pick', picked === m.id);
      c.setAttribute('aria-pressed', String(picked === m.id));
    });
    blocks.forEach(function (b) {                                  // blocks and whole-team bands
      if (!b.el) return;
      var p = K.clamp((t - b.t0) / (b.t1 - b.t0), 0, 1);
      if (b.kind === 'rt') b.el.classList.toggle('is-shown', t >= fail.t);
      if (b._p === p) return; b._p = p;
      b.el.firstChild.style.transform = 'scaleX(' + p.toFixed(3) + ')';
      b.el.classList.toggle('is-now', p > 0 && p < 1); b.el.classList.toggle('is-done', p >= 1);
    });
    ['ttt', 'uat', 'chk', 'ref'].forEach(function (k) {
      var e = SH[k].el; if (!e || e._p === s[k]) return; e._p = s[k];
      e.firstChild.style.transform = 'scaleX(' + s[k].toFixed(3) + ')'; e.classList.toggle('is-done', s[k] >= 1); e.classList.toggle('is-now', s[k] > 0 && s[k] < 1);
    });
    head.style.transform = 'translateX(' + (X(t) * laneW).toFixed(1) + 'px)';
    var dl = dayLabel(t);
    if (memo.day !== dl) { memo.day = dl; dayEl.textContent = dl; scrub.setAttribute('aria-valuetext', dl); }
    if (document.activeElement !== scrub) scrub.value = String(Math.round(X(t) * 1000));
    // readiness
    gv.style.strokeDashoffset = (C * (1 - s.ready / 100)).toFixed(1);
    set('ready', kReady, String(Math.round(s.ready)));
    var left = s.soAll - s.so, uatN = sel.length * 2, ready = s.chk >= 1;
    root.classList.toggle('is-ready', ready);
    set('verdict', verdict, t >= LIVE ? 'Live: the teams run Odoo on their own.' : ready ? 'Ready for cut-over.' : s.failNow ? 'Not ready: a retake is booked.'
      : left ? 'Not ready: ' + left + ' sign-off' + (left === 1 ? '' : 's') + ' to go.' : s.uat >= 1 ? 'Readiness check under way.' : s.uat > 0 ? 'UAT under way.' : 'Sign-offs done: UAT next.');
    gateRows([
      ['Key users trained, module by module', s.ku + ' / ' + s.soAll, s.ku === s.soAll],
      ['Sign-off checks passed', s.so + ' / ' + s.soAll, s.so === s.soAll, s.failNow],
      ['Quick-reference guides handed over', s.ex + ' / ' + s.exAll, s.ex === s.exAll],
      ['Key users can train the rest', s.ttt >= 1 ? 'done' : s.ttt > 0 ? 'in progress' : 'pending', s.ttt >= 1],
      ['UAT scenarios end to end', Math.floor(s.uat * uatN + .001) + ' / ' + uatN, s.uat >= 1],
      ['Readiness check before cut-over', s.chk >= 1 ? 'passed' : 'pending', s.chk >= 1]
    ]);
    var moving = paintRadar(s, snap, dt);
    paintDetail(s);
    return moving;
  }
  var gateEls = [];
  function gateRows(list) {
    if (gateEls.length !== list.length) {
      gates.textContent = ''; gateEls = list.map(function () { var li = K.el('li'); li.appendChild(K.el('i')); li.appendChild(K.el('span')); li.appendChild(K.el('b')); gates.appendChild(li); return li; });
    }
    list.forEach(function (g, i) {
      var li = gateEls[i], v = g[0] + g[1] + g[2] + g[3];
      if (li._v === v) return; li._v = v;
      li.children[1].textContent = g[0]; li.children[2].textContent = g[1];
      li.className = g[3] ? 'is-bad' : g[2] ? 'is-ok' : '';
    });
  }
  var lastDetail = '';
  function paintDetail(s) {
    var id = picked;
    if (!id) {                                                   // follow the module most recently worked on
      for (var i = evs.length - 1; i >= 0; i--) { var e = evs[i]; if (e.m && e.t <= t) { id = e.m; break; } }
    }
    var key = (id || '') + '|' + JSON.stringify(id ? sel.map(function (r) { return s.done[r + ':' + id] || 0; }) : 0) + '|' + !!picked;
    if (key === lastDetail) return; lastDetail = key;
    detail.textContent = '';
    if (!id) { detail.appendChild(K.el('p', 'cur-dh', 'Select a module to see its session, the exercise on your own data and the sign-off check.')); return; }
    var m = MOD[id], app = APPS.filter(function (a) { return a[0] === m.app; })[0];
    var h = K.el('p', 'cur-dt'); h.innerHTML = icon(app[2], 20); h.appendChild(K.el('b', null, m.name)); h.appendChild(K.el('small', null, app[1] + (picked ? '' : ' · latest')));
    detail.appendChild(h);
    var dl = K.el('dl', 'cur-dl');
    [['Session', m.ses], ['Exercise on your data', m.ex], ['Sign-off check', m.so]].forEach(function (x) {
      var d = K.el('div'); d.appendChild(K.el('dt', null, x[0])); d.appendChild(K.el('dd', null, x[1])); dl.appendChild(d);
    });
    detail.appendChild(dl);
    var st = K.el('p', 'cur-dst');
    m.roles.filter(function (r) { return on[r]; }).forEach(function (r) {
      var x = s.done[r + ':' + id] || {}, lab = x.so ? 'signed off' : x.fail ? 'retake booked' : x.ex ? 'practised' : x.ses ? 'session done' : x.ku ? 'key user trained' : 'planned';
      var c = K.el('span', x.so ? 'is-ok' : x.fail ? 'is-bad' : null); c.style.setProperty('--c', ROLES[r].c);
      c.appendChild(K.el('i')); c.appendChild(document.createTextNode(ROLES[r].n + ': ' + lab)); st.appendChild(c);
    });
    detail.appendChild(st);
  }

  // ---------------------------------------------------------------- log (only while running forwards)
  function logUpTo(d) {
    evs.forEach(function (e, i) {
      if (i <= lastLog || e.t > d) return;
      lastLog = i;
      var R = e.r ? ROLES[e.r] : null, m = e.m ? MOD[e.m] : null, b = null, rest = '', c = R ? R.c : 'var(--blue)';
      if (e.k === 'ku' && e.last) { b = 'Key user trained'; rest = R.n + ', ' + modsOf(e.r).length + ' modules practised'; }
      else if (e.k === 'so' && e.fail) { b = 'Sign-off not passed'; rest = R.n + ': ' + m.name + '. Retake booked'; c = 'var(--tok-late)'; }
      else if (e.k === 'so') { b = 'Signed off'; rest = R.n + ': ' + m.name; }
      else if (e.k === 'rt') { b = 'Retake passed'; rest = R.n + ': ' + m.name; }
      else if (e.k === 'ttt') { b = 'Train-the-trainer'; rest = 'key users rehearse with the guides'; }
      else if (e.k === 'uat') { b = 'UAT started'; rest = sel.length * 2 + ' scenarios end to end'; }
      else if (e.k === 'chk') { b = 'Readiness check passed'; rest = 'ready for cut-over'; c = 'var(--ok)'; }
      else if (e.k === 'live') { b = 'Go-live'; rest = 'the teams run Odoo on their own'; c = 'var(--ok)'; }
      else if (e.k === 'ref') { b = 'Refresher'; rest = 'after the first month-end'; }
      if (b) {
        var li = K.log(logEl, '<i></i><span></span>', null, 3), sp = li.lastChild;
        sp.appendChild(K.el('b', null, b)); sp.appendChild(document.createTextNode(' \u00b7 ' + rest));
        li.style.setProperty('--c', c);
      }
      if (!focusPinned && e.r && on[e.r] && e.r !== focus && (e.k === 'ku' || e.k === 'ses')) { focus = e.r; renderTabs(); drawRadarFrame(); }
    });
  }
  function relog(d) { logEl.textContent = ''; lastLog = -1; logUpTo(d); }

  // ---------------------------------------------------------------- running
  var loop = K.loop(function (now, dt) {
    if (playing) {
      t = Math.min(T, t + dt * 1.8);
      logUpTo(t); follow();
      if (t >= T) setPlaying(false);
    }
    if (!paint(state(t), dt) && !playing) loop.off();
  });
  function setPlaying(p) {
    playing = p; runBtn.setAttribute('aria-pressed', String(p));
    runLab.textContent = p ? 'Pause' : t >= T ? 'Run again' : t > 0 ? 'Resume' : 'Run the plan';
    runBtn.classList.toggle('is-pause', p);
    if (p) loop.on();
  }
  runBtn.addEventListener('click', function () {
    touched = true;
    if (playing) { setPlaying(false); return; }
    if (t >= T) { t = 0; relog(0); if (!focusPinned) { focus = sel[0]; renderTabs(); drawRadarFrame(); } }
    if (K.reduce) { t = T; relog(T); paint(state(t), 0, true); setPlaying(false); return; }
    setPlaying(true);
  });
  K.$('[data-reset]', root).addEventListener('click', function () {
    touched = true; setPlaying(false); t = 0; picked = null; focusPinned = false; focus = sel[0];
    renderTabs(); drawRadarFrame(); relog(0); lastDetail = ''; paint(state(t), 0, true); setPlaying(false);
  });
  scrub.addEventListener('input', function () {
    touched = true; if (playing) setPlaying(false);
    t = K.clamp(Xinv(+scrub.value / 1000), 0, T); relog(t); paint(state(t), 0, K.reduce); if (!K.reduce) loop.on();
  });
  ORDER.forEach(function (r) {
    var b = chips[r]; if (!b) return;
    b.setAttribute('aria-pressed', String(on[r]));
    b.addEventListener('click', function () {
      var next = !on[r];
      if (!next && sel.length === 1) { K.restart(b, 'is-nope'); return; }   // keep at least one role
      touched = true; on[r] = next; b.setAttribute('aria-pressed', String(next));
      build(); relog(t); lastDetail = ''; paint(state(t), 0, true);
    });
  });
  var rw = 0;
  window.addEventListener('resize', function () {
    size();
    if (radar.clientWidth !== rw) { rw = radar.clientWidth; drawRadarFrame(); }
    paint(state(t), 0, true);
  });

  build();
  if (K.reduce) t = 26;                                          // a meaningful still: sign-offs done, UAT under way
  relog(t); paint(state(t), 0, true);
  return {
    start: function (first) {
      size(); paint(state(t), 0, true);
      if (K.reduce) return;
      if (first && !touched) { t = 0; relog(0); setPlaying(true); }
      else if (playing) loop.on();
    },
    stop: function () { loop.off(); }
  };
});
