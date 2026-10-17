/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* How an Odoo implementation works (blog): the article's seven stages on one rail, with the staging
   copy, the live database and the old system as lanes underneath. Each stage shows what happens, what
   your team brings, what you get and the mistake to avoid. The go-live gate follows the article:
   nothing goes live until balances reconcile and the team has practised on its own data, so a failed
   check sends the project back to the stage that has to be redone. */
TN.demo('phases', function (root, K) {
  var rail = K.$('.phz-rail', root), stopsEl = K.$('.phz-stops', root), panel = K.$('.phz-panel', root);
  var laneOld = K.$('.phz-lane--old', root), laneStg = K.$('.phz-lane--stg', root), laneLive = K.$('.phz-lane--live', root);
  var gateEl = K.$('.phz-gate', root), gateMsg = K.$('[data-gate-msg]', root), playBtn = K.$('[data-play]', root);
  var icons = K.$$('.phz-icons > *', root);

  // stage: name, short label, tag, what happens, list (optional), your team brings, you get, avoid (optional), gate (optional)
  var S = [
    { n: 'Discovery', s: 'Discovery', tag: 'Step 1',
      what: 'We map how the business works today, before anyone opens Odoo, walking through three flows with the people who run them. Each step is matched to an Odoo app, and anything Odoo does not do out of the box is flagged.',
      chips: ['Order-to-cash', 'Procure-to-pay', 'Record-to-report'],
      bring: ['A decision-maker, so scope questions get answered in days, not weeks', 'Process owners for sales, stock and finance, who know how the work really runs'],
      get: ['A process map and an app map', 'A written scope and a quotation', 'An agreed first phase: what goes in, and what waits'] },
    { n: 'Configuration', s: 'Configure', tag: 'On staging',
      what: 'Configuration happens on a staging database, never on the one you will go live with, and standard first: configure what Odoo already does before writing any custom code.',
      list: ['Chart of accounts, taxes and journals, set up for how you close the month', 'Quotation templates, pricelists and approval rules', 'Warehouses, locations, routes and reordering rules modelled on your sites', 'Users and access rights by role'],
      bring: ['Process owners who know how you close the month and how your sites run'],
      get: ['A configured staging database for the first phase'],
      avoid: "Customising before configuring: recreating the old system's screens adds cost at every upgrade." },
    { n: 'Data migration', s: 'Data', tag: 'On staging',
      what: 'Master data (customers, vendors, products, the chart of accounts) and open items (unpaid invoices, bills, opening stock and balances) are cleaned and loaded into staging, then reconciled.',
      bring: ['Current data exports: customers, products, open items and balances'],
      get: ['A trial balance, receivables, payables and stock value in Odoo that match your old system'],
      avoid: 'Migrating dirty data: duplicates and wrong codes survive the move unless they are fixed first.', gate: 'bal' },
    { n: 'Training', s: 'Training', tag: 'Step 2',
      what: 'Role-based, on your own data in staging: the warehouse team practises receipts and picking, sales practises quotations, and finance runs a practice month-end.',
      bring: ['Time for training and testing: practice on staging is what makes go-live calm'],
      get: ['People who have practised on their own products and customers', 'Configuration gaps found while they are still cheap to fix'],
      avoid: 'Skipping the practice month-end: finance should close a test month in staging before the real one.', gate: 'trn' },
    { n: 'Integration', s: 'Integrate', tag: 'Step 3',
      what: "Odoo is connected to the tools around it. Odoo's standard connectors come first; the API is used only where no connector exists.",
      chips: ['Bank feeds', 'Payment providers', 'Online stores', 'Marketplaces', 'Email'],
      bring: ['The tools around Odoo today, from bank feeds to marketplaces'],
      get: ['Connected systems, so nobody re-keys data between them'] },
    { n: 'Go-live', s: 'Go-live', tag: 'Cut-over',
      what: 'A planned cut-over, usually at a period boundary so the books start clean. Final open items are loaded, balances are checked one last time, and the old system becomes read-only.',
      bring: ['The final open items for the last load'],
      get: ['Books that start clean at the period boundary', 'Close support in the first days, when real transactions find the last gaps'],
      avoid: 'Going live on every app at once: a focused first phase goes live sooner and teaches the team the system.', gate: 'live' },
    { n: 'Support', s: 'Support', tag: 'Step 4',
      what: 'Fixes, month-end help, small changes and version upgrades, through one tracked channel with a named team. This is also when phase two gets planned.',
      bring: ['The next apps to add, now that the core is running'],
      get: ['One tracked channel with a named team', 'A plan for phase two'] }
  ];
  var LIVE = 5, GATE = { bal: true, trn: true };

  // ------------------------------------------------------------ rail
  var stops = S.map(function (st, i) {
    var b = K.el('button', 'phz-stop'); b.type = 'button'; b.setAttribute('role', 'tab'); b.id = 'phz-t' + i;
    b.setAttribute('aria-controls', 'phz-p'); b.setAttribute('aria-selected', 'false'); b.tabIndex = -1;
    var dot = K.el('span', 'phz-dot'); if (icons[i]) dot.appendChild(icons[i].cloneNode(true)); b.appendChild(dot);
    var lab = K.el('span', 'phz-lab'); lab.appendChild(K.el('b', 'phz-long', st.n)); lab.appendChild(K.el('b', 'phz-short', st.s)); lab.appendChild(K.el('small', null, st.tag));
    b.appendChild(lab);
    b.addEventListener('click', function () { stopPlay(); go(i, true); });
    b.addEventListener('keydown', function (e) {
      var k = e.key, j = k === 'ArrowRight' ? i + 1 : k === 'ArrowLeft' ? i - 1 : k === 'Home' ? 0 : k === 'End' ? S.length - 1 : -1;
      if (j < 0 && k !== 'ArrowLeft') return;
      e.preventDefault(); stopPlay(); j = K.clamp(j, 0, S.length - 1); go(j, true); stops[j].focus();
    });
    stopsEl.appendChild(b);
    return b;
  });
  panel.id = 'phz-p';
  var track = K.el('span', 'phz-track'), fill = K.el('span', 'phz-fill'); track.appendChild(fill); rail.insertBefore(track, rail.firstChild);
  var lanesEl = K.$('.phz-lanes', root);
  var loopSvg = K.svg('svg', { 'class': 'phz-loop', 'aria-hidden': 'true' }); rail.appendChild(loopSvg);

  var X = [];
  function layout() {
    X = stops.map(function (s) { var d = K.box(K.$('.phz-dot', s), rail); return d.cx; });
    var y = K.box(K.$('.phz-dot', stops[0]), rail).cy;
    track.style.left = X[0] + 'px'; track.style.width = (X[X.length - 1] - X[0]) + 'px'; track.style.top = (y - 1.5) + 'px';
    var lx = K.box(lanesEl, rail).x;
    function lane(el, a, b) { el.style.left = (a - 14 - lx) + 'px'; el.style.width = (b - a + 28) + 'px'; }
    lane(laneOld, X[0], X[S.length - 1]); lane(laneStg, X[1], X[3]); lane(laneLive, X[LIVE], X[S.length - 1]);
    laneOld.style.setProperty('--ro', (X[LIVE] - X[0] + 14) + 'px');
    loopSvg.setAttribute('viewBox', '0 0 ' + rail.offsetWidth + ' ' + rail.offsetHeight);
    setFill(cur, false);
  }
  function setFill(i, anim) {
    var f = X.length ? (X[i] - X[0]) / (X[X.length - 1] - X[0]) : 0;
    fill.style.transition = anim && !K.reduce ? '' : 'none';
    fill.style.transform = 'scaleX(' + f.toFixed(4) + ')';
  }

  // ------------------------------------------------------------ the stage panel
  function box(title, items, cls) {
    var d = K.el('div', 'phz-box ' + cls); d.appendChild(K.el('p', 'phz-bh', title));
    var ul = K.el('ul'); items.forEach(function (t) { ul.appendChild(K.el('li', null, t)); }); d.appendChild(ul);
    return d;
  }
  function gateOk() { return GATE.bal && GATE.trn; }
  function failing() { return !GATE.bal ? 2 : !GATE.trn ? 3 : -1; }
  function fillPanel(i) {
    var st = S[i]; panel.textContent = ''; panel.setAttribute('aria-labelledby', 'phz-t' + i);
    var head = K.el('div', 'phz-ph');
    head.appendChild(K.el('span', 'phz-no', String(i + 1).padStart(2, '0')));
    var ht = K.el('span', 'phz-pt'); ht.appendChild(K.el('b', null, st.n)); ht.appendChild(K.el('small', null, st.tag)); head.appendChild(ht);
    var env = i === 0 ? 'Before Odoo' : i <= 3 ? 'Staging copy' : i === 4 ? 'Connections' : 'Live database';
    head.appendChild(K.el('em', 'phz-env phz-env--' + (i === 0 ? 'pre' : i <= 3 ? 'stg' : i === 4 ? 'int' : 'live'), env));
    panel.appendChild(head);
    var main = K.el('div', 'phz-main');
    main.appendChild(K.el('p', 'phz-what', st.what));
    if (st.chips) { var ch = K.el('p', 'phz-chips'); st.chips.forEach(function (c) { ch.appendChild(K.el('span', null, c)); }); main.appendChild(ch); }
    if (st.list) { var ul = K.el('ul', 'phz-list'); st.list.forEach(function (t) { ul.appendChild(K.el('li', null, t)); }); main.appendChild(ul); }
    if (st.gate && st.gate !== 'live') {
      var ok = GATE[st.gate], g = K.el('p', 'phz-gnote ' + (ok ? 'is-ok' : 'is-bad'));
      g.textContent = st.gate === 'bal' ? (ok ? 'Gate check passed: the balances match the old system.' : "Balances don't match: if day-one balances don't match, nothing else matters. Fix and reconcile again.")
        : (ok ? 'Gate check passed: the team has practised on its own data.' : 'Not practised yet: people learn faster on their own products and customers, so train on staging first.');
      main.appendChild(g);
    }
    if (st.gate === 'live' && !gateOk()) {
      var bl = K.el('p', 'phz-gnote is-bad');
      bl.textContent = 'Not yet: nothing goes live until balances reconcile and the people who will use it have practised on their own data. Back to ' + S[failing()].n.toLowerCase() + '.';
      main.appendChild(bl);
    }
    panel.appendChild(main);
    var side = K.el('div', 'phz-side');
    side.appendChild(box('Your team brings', st.bring, 'phz-box--bring'));
    side.appendChild(box('You get', st.get, 'phz-box--get'));
    if (st.avoid) { var a = K.el('div', 'phz-box phz-box--avoid'); a.appendChild(K.el('p', 'phz-bh', 'Avoid')); a.appendChild(K.el('p', 'phz-av', st.avoid)); side.appendChild(a); }
    panel.appendChild(side);
    if (!K.reduce) K.restart(panel, 'is-in');
  }

  // ------------------------------------------------------------ moving between stages
  var cur = 0;
  function go(i, user) {
    cur = i;
    stops.forEach(function (s, j) {
      s.classList.toggle('is-done', j < i); s.classList.toggle('is-on', j === i);
      s.setAttribute('aria-selected', String(j === i)); s.tabIndex = j === i ? 0 : -1;
    });
    setFill(i, true);
    laneStg.classList.toggle('is-on', i >= 1 && i <= 3);
    laneLive.classList.toggle('is-on', i >= LIVE && gateOk());
    laneOld.classList.toggle('is-ro', i >= LIVE && gateOk());
    fillPanel(i);
    if (i >= LIVE && !gateOk()) loopBack();
    else loopSvg.textContent = '';
    renderGate(i >= LIVE && !gateOk() && user);
  }
  function loopBack() {
    // the exception: draw the way back from go-live to the stage that failed
    var f = failing(), y = K.box(K.$('.phz-dot', stops[0]), rail).y - 4, x0 = X[LIVE], x1 = X[f];
    loopSvg.textContent = '';
    var p = K.svg('path', { d: 'M' + x0 + ' ' + y + 'C' + x0 + ' ' + (y - 26) + ' ' + x1 + ' ' + (y - 26) + ' ' + x1 + ' ' + y, 'class': 'phz-back' });
    loopSvg.appendChild(p);
    var head = K.svg('path', { d: 'M' + (x1 - 4) + ' ' + (y - 6) + 'L' + x1 + ' ' + y + 'L' + (x1 + 4) + ' ' + (y - 6), 'class': 'phz-back phz-back-h' });
    loopSvg.appendChild(head);
    if (!K.reduce) { var len = p.getTotalLength(); p.style.strokeDasharray = len; p.style.strokeDashoffset = len; requestAnimationFrame(function () { requestAnimationFrame(function () { p.style.strokeDashoffset = 0; }); }); }
  }
  function renderGate(shake) {
    var ok = gateOk();
    K.$$('.phz-chk', gateEl).forEach(function (b) { b.setAttribute('aria-pressed', String(GATE[b.dataset.g])); });
    gateEl.classList.toggle('is-open', ok); gateEl.classList.toggle('is-shut', !ok);
    gateMsg.textContent = ok ? 'Open: the balances match and the team has practised on its own data.' : 'Locked until both checks pass. Tick them off to see the way through.';
    stops[LIVE].classList.toggle('is-locked', !ok); stops[LIVE + 1].classList.toggle('is-locked', !ok);
    if (shake && !K.reduce) K.restart(gateEl, 'is-shake');
  }
  K.$$('.phz-chk', gateEl).forEach(function (b) {
    b.addEventListener('click', function () { GATE[b.dataset.g] = !GATE[b.dataset.g]; stopPlay(); go(cur, true); });
  });
  K.$('[data-prev]', root).addEventListener('click', function () { stopPlay(); go(Math.max(0, cur - 1), true); });
  K.$('[data-next]', root).addEventListener('click', function () { stopPlay(); go(Math.min(S.length - 1, cur + 1), true); });

  // ------------------------------------------------------------ play through the project
  var timer = 0, playing = false, visible = false;
  function tick() {
    timer = 0;
    if (!playing || !visible) return;
    if (cur >= S.length - 1) { stopPlay(); return; }
    var nx = cur + 1;
    if (nx === LIVE && !gateOk()) {           // the gate stops the run and sends it back
      go(LIVE, true); stopPlay();
      timer = setTimeout(function () { go(failing(), true); }, 2200);
      return;
    }
    go(nx, false);
    timer = setTimeout(tick, 2700);
  }
  function startPlay() {
    if (K.reduce) return;
    playing = true; playBtn.classList.add('is-on'); K.$('span', playBtn).textContent = 'Pause';
    if (cur >= S.length - 1) go(0, false);
    clearTimeout(timer); timer = setTimeout(tick, 1600);
  }
  function stopPlay() { playing = false; clearTimeout(timer); timer = 0; playBtn.classList.remove('is-on'); K.$('span', playBtn).textContent = 'Play'; }
  playBtn.addEventListener('click', function () { if (playing) stopPlay(); else startPlay(); });
  if (K.reduce) playBtn.hidden = true;

  var rz = 0, auto = true;
  window.addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(function () { layout(); if (cur >= LIVE && !gateOk()) loopBack(); }, 120); });
  go(0, false); layout();
  return {
    start: function (first) {
      visible = true; layout();
      if (first && auto) { auto = false; startPlay(); }
      else if (playing && !timer) timer = setTimeout(tick, 1200);
    },
    stop: function () { visible = false; clearTimeout(timer); timer = 0; }
  };
});
