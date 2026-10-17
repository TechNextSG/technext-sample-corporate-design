/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* Standard first (blog): the article's five questions before approving any customisation, as a gate.
   Each yes or no moves a token down the line; the first exit decides where the request lands:
   configuration, a process change, Studio, a custom module, or not built at all. The verdict shows the
   article's level, what it is, its cost at upgrade and what happens at each of the next three upgrades. */
TN.demo('gate', function (root, K) {
  var body = K.$('.gt-body', root), grid = K.$('.gt-grid', root), svgEl = K.$('.gt-svg', root), vEl = K.$('.gt-verdict', root);
  var exBtns = K.$$('[data-ex]', root);

  var QS = [
    ["Does standard Odoo do this, perhaps with a setting we haven't switched on?", 'Yes: configure it'],
    ['Could we change the process instead, and would anyone outside the company notice?', 'Yes: we can change it, and nobody outside would notice'],
    ['Can Studio do it without code?', 'Yes: build it in Studio'],
    ['What does it cost to maintain through the next three upgrades, not just to build?', 'Yes: we know the cost, and it is worth it'],
    ['Who owns it: who will notice if it breaks, and who will fix it?', 'Yes: someone owns it']
  ];
  // where each answer goes: an outcome key, or null for the next question
  var EXIT = [{ y: 'cfg', n: null }, { y: 'proc', n: null }, { y: 'studio', n: null }, { y: null, n: 'nope' }, { y: 'custom', n: 'nope' }];
  var OUT = {
    cfg: { row: 0, name: 'Configuration', tag: 'Level 1', lvl: 1, what: 'Settings, workflows, taxes, routes, approval rules, templates and access rights.', cost: 'Low: carried forward by Odoo', up: 'Carried forward',
      line: 'Standard Odoo does it: switch the setting on and configure what is already there.' },
    proc: { row: 1, name: 'Change the process', tag: 'No build', lvl: 0, what: 'Odoo stays standard; the habit changes instead.', cost: 'Stays standard', up: 'Standard',
      line: 'Bending standard Odoo to match an old habit usually costs more than changing the habit.' },
    studio: { row: 2, name: 'Studio', tag: 'Level 2', lvl: 2, what: 'No-code fields, views, reports and automations (Custom plan).', cost: 'Medium: needs checking after each upgrade', up: 'Check',
      line: 'Studio can do it without code, so nothing needs a custom module.' },
    nope: { row: 3, name: "Don't build it", tag: 'No build', lvl: 0, what: 'It does not survive the five questions.', cost: 'Nothing to maintain', up: null, line: '' },
    custom: { row: 4, name: 'Custom module', tag: 'Level 3', lvl: 3, what: 'Python code for new logic, integrations or apps (Odoo.sh or on-premise).', cost: 'High: must be ported and tested every version', up: 'Port and retest',
      line: 'It survives all five: worth building, and worth building properly, as a clean module in version control, tested on staging and documented, rather than as a quick patch.' }
  };
  var NOPE = [
    '', '', '',
    'The upkeep through the next three upgrades is not worth it. Handle it another way: a rare case by hand, with a note in the procedure, or a saved filter or spreadsheet view when you only need to see a number.',
    'Nobody owns it: nobody will notice if it breaks, and nobody will fix it. It does not survive question five.'
  ];
  var EX = [
    { a: [true], note: 'Many "we need a new screen" requests are really "we need to see this number", and a saved filter or spreadsheet view does it.' },
    { a: [false, true], note: 'Old screens and old field names feel familiar, but familiarity fades in weeks, and the code stays.' },
    { a: [false, true], note: 'Something that happens twice a year is usually cheaper to handle by hand, with a note in the procedure.' },
    { a: [false, false, false, true, true], note: 'An integration with no connector: a bank Odoo cannot reach through standard connectors.' }
  ];

  // ------------------------------------------------------------ build the ladder: questions left, outcomes right
  var qEls = [], bins = {};
  var ORDER = ['cfg', 'proc', 'studio', 'nope', 'custom'];
  QS.forEach(function (q, i) {
    var card = K.el('div', 'gt-q'); card.style.gridRow = String(i + 1);
    card.appendChild(K.el('span', 'gt-no', String(i + 1)));
    var tx = K.el('div', 'gt-qt'); tx.appendChild(K.el('b', null, q[0])); tx.appendChild(K.el('small', null, q[1])); card.appendChild(tx);
    var seg = K.el('span', 'dm-seg gt-yn'); seg.setAttribute('role', 'group'); seg.setAttribute('aria-label', 'Question ' + (i + 1));
    [['Yes', true], ['No', false]].forEach(function (o) {
      var b = K.el('button', null, o[0]); b.type = 'button'; b.dataset.v = String(o[1]); b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', function () { clearEx(); answer(i, o[1], true); });
      seg.appendChild(b);
    });
    card.appendChild(seg);
    card.appendChild(K.el('em', 'gt-to'));
    grid.appendChild(card); qEls.push({ el: card, seg: seg, to: K.$('.gt-to', card), no: K.$('.gt-no', card) });
  });
  ORDER.forEach(function (k) {
    var o = OUT[k], b = K.el('div', 'gt-bin gt-bin--' + k); b.style.gridRow = String(o.row + 1);
    var m = K.el('span', 'gt-meter'); for (var j = 0; j < 3; j++) m.appendChild(K.el('i', j < o.lvl ? 'is-on' : null)); b.appendChild(m);
    b.appendChild(K.el('b', null, o.name)); b.appendChild(K.el('small', null, o.tag + (o.lvl ? ' · ' + ['', 'low', 'medium', 'high'][o.lvl] + ' at upgrade' : '')));
    grid.appendChild(b); bins[k] = b;
  });

  // ------------------------------------------------------------ geometry (measured on change, never per frame)
  var G = null;
  function measure() {
    var W = body.offsetWidth, H = body.offsetHeight;
    svgEl.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    var q = qEls.map(function (x) { return K.box(x.el, body); }), bx = {};
    ORDER.forEach(function (k) { bx[k] = K.box(bins[k], body); });
    var sx = (q[0].r + bx.cfg.x) / 2;
    G = { q: q, b: bx, sx: sx, top: q[0].y - 6 };
    drawBase();
  }
  function arm(i, k) {
    // from the line at question i's height to outcome k
    var y0 = G.q[i].cy, b = G.b[k], y1 = b.cy;
    if (Math.abs(y1 - y0) < 1) return [[G.sx, y0], [b.x - 2, y1]];
    var mx = G.sx + (b.x - G.sx) * .45;
    return [[G.sx, y0], [mx, y0], [mx, y1], [b.x - 2, y1]];
  }
  function dOf(pts) { return pts.length > 2 ? K.path(pts, 9) : 'M' + pts[0][0] + ' ' + pts[0][1] + 'L' + pts[1][0] + ' ' + pts[1][1]; }
  var hi = null, tok = null;
  function drawBase() {
    svgEl.textContent = '';
    var last = G.q[G.q.length - 1];
    svgEl.appendChild(K.svg('path', { d: 'M' + G.sx + ' ' + G.top + 'L' + G.sx + ' ' + last.cy, 'class': 'gt-line' }));
    G.q.forEach(function (q) { svgEl.appendChild(K.svg('path', { d: 'M' + q.r + ' ' + q.cy + 'L' + G.sx + ' ' + q.cy, 'class': 'gt-stub' })); });
    EXIT.forEach(function (e, i) {
      ['y', 'n'].forEach(function (s) { if (e[s]) svgEl.appendChild(K.svg('path', { d: dOf(arm(i, e[s])), 'class': 'gt-arm' })); });
    });
    hi = K.svg('path', { 'class': 'gt-hi', d: 'M0 0' }); svgEl.appendChild(hi);
    tok = K.svg('circle', { r: 6, 'class': 'gt-tok', cx: G.sx, cy: G.top }); svgEl.appendChild(tok);
    routeTo(false);
  }

  // ------------------------------------------------------------ state
  var ans = [null, null, null, null, null], exNote = '';
  function outcome() {
    for (var i = 0; i < ans.length; i++) {
      if (ans[i] == null) return { at: i, out: null };
      var o = EXIT[i][ans[i] ? 'y' : 'n'];
      if (o) return { at: i, out: o };
    }
    return { at: 4, out: null };
  }
  function answer(i, v, user) {
    ans[i] = v; for (var j = i + 1; j < ans.length; j++) ans[j] = null;
    render(user);
  }
  function render(user) {
    var st = outcome();
    qEls.forEach(function (q, i) {
      var a = ans[i], live = i <= st.at;
      q.el.classList.toggle('is-now', i === st.at && !st.out);
      q.el.classList.toggle('is-done', a != null && i <= st.at);
      q.el.classList.toggle('is-off', !live);
      K.$$('button', q.seg).forEach(function (b) { b.setAttribute('aria-pressed', String(a != null && live && String(a) === b.dataset.v)); b.disabled = !live; });
      var o = a != null && live ? EXIT[i][a ? 'y' : 'n'] : null;
      q.to.textContent = a == null || !live ? '' : o ? OUT[o].name : 'Next question';
      q.to.className = 'gt-to' + (o ? ' is-exit gt-to--' + o : a != null && live ? ' is-next' : '');
    });
    ORDER.forEach(function (k) { bins[k].classList.toggle('is-hit', st.out === k); bins[k].classList.toggle('is-dim', !!st.out && st.out !== k); });
    root.dataset.out = st.out || '';
    verdict(st, user);
    routeTo(user);
  }
  function verdict(st, user) {
    vEl.textContent = '';
    if (!st.out) {
      var w = K.el('p', 'gt-wait'); w.textContent = 'Question ' + (st.at + 1) + ' of 5: answer it to move the request down the line.'; vEl.appendChild(w);
      vEl.className = 'gt-verdict'; return;
    }
    var o = OUT[st.out]; vEl.className = 'gt-verdict is-set gt-v--' + st.out;
    var h = K.el('div', 'gt-vh');
    var m = K.el('span', 'gt-meter'); for (var j = 0; j < 3; j++) m.appendChild(K.el('i', j < o.lvl ? 'is-on' : null)); h.appendChild(m);
    var t = K.el('span', 'gt-vt'); t.appendChild(K.el('b', null, o.name)); t.appendChild(K.el('small', null, o.tag + ' · ' + o.what)); h.appendChild(t);
    vEl.appendChild(h);
    vEl.appendChild(K.el('p', 'gt-vline', st.out === 'nope' ? NOPE[st.at] : o.line));
    if (exNote) vEl.appendChild(K.el('p', 'gt-vex', 'From the article: ' + exNote));
    var up = K.el('div', 'gt-ups'); up.appendChild(K.el('span', 'gt-uph', 'Next three upgrades'));
    for (var u = 0; u < 3; u++) {
      var pip = K.el('span', 'gt-up' + (o.up ? '' : ' is-none')); pip.style.setProperty('--k', u);
      pip.appendChild(K.el('i', null, String(u + 1))); pip.appendChild(K.el('small', null, o.up || 'Nothing to carry'));
      up.appendChild(pip);
    }
    up.appendChild(K.el('span', 'gt-upc', 'Cost at upgrade: ' + o.cost));
    vEl.appendChild(up);
    if (user && !K.reduce) K.restart(vEl, 'is-in');
  }

  // ------------------------------------------------------------ the token runs the answered route
  var route = [], lens = [], total = 0, pos = 0, from = 0, to = 0, t0 = 0, dur = 1;
  function buildRoute() {
    var st = outcome(), pts = [[G.sx, G.top]];
    for (var k = 0; k <= st.at; k++) pts.push([G.sx, G.q[k].cy]);   // one vertex per question passed
    if (st.out) arm(st.at, st.out).slice(1).forEach(function (p) { pts.push(p); });
    return pts;
  }
  function lengths(pts) { var L = [0]; for (var i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); return L; }
  function at(d) {
    for (var i = 1; i < route.length; i++) if (d <= lens[i] || i === route.length - 1) {
      var q = K.clamp((d - lens[i - 1]) / ((lens[i] - lens[i - 1]) || 1), 0, 1);
      return [K.lerp(route[i - 1][0], route[i][0], q), K.lerp(route[i - 1][1], route[i][1], q)];
    }
    return route[0];
  }
  function routeTo(anim) {
    if (!G) return;
    // keep the shared part of the old route: the token carries on from where the paths split
    var nr = buildRoute(), k = 0;
    while (k < route.length && k < nr.length && Math.abs(route[k][0] - nr[k][0]) < .5 && Math.abs(route[k][1] - nr[k][1]) < .5) k++;
    var nl = lengths(nr), start = k ? Math.min(pos, nl[k - 1]) : 0;
    route = nr; lens = nl; total = lens[lens.length - 1];
    hi.setAttribute('d', route.length > 2 ? K.path(route, 9) : 'M' + route[0][0] + ' ' + route[0][1] + 'L' + route[1][0] + ' ' + route[1][1]);
    var hl = hi.getTotalLength(); hi.style.strokeDasharray = hl + ' ' + hl; hi.__len = hl;
    from = start; to = total;
    if (!anim || K.reduce) { pos = to; paint(); return; }
    t0 = performance.now(); dur = K.clamp((to - from) * 2.4, 250, 1200); loop.on();
  }
  function paint() {
    var p = at(pos); tok.setAttribute('cx', p[0].toFixed(1)); tok.setAttribute('cy', p[1].toFixed(1));
    hi.style.strokeDashoffset = (hi.__len - Math.min(pos, total) * (hi.__len / (total || 1))).toFixed(1);
  }
  var loop = K.loop(function (now) {
    var q = K.clamp((now - t0) / dur, 0, 1);
    pos = K.lerp(from, to, K.ease.inOut(q)); paint();
    if (q >= 1) loop.off();
  });

  // ------------------------------------------------------------ examples from the article, played step by step
  var exTimers = [];
  function clearEx() { exTimers.forEach(clearTimeout); exTimers = []; exNote = ''; exBtns.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); }); }
  exBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      clearEx(); var ex = EX[+b.dataset.ex]; b.setAttribute('aria-pressed', 'true');
      ans = [null, null, null, null, null]; render(false);
      ex.a.forEach(function (v, i) {
        var run = function () { if (i === ex.a.length - 1) exNote = ex.note; answer(i, v, true); };
        if (K.reduce) run(); else exTimers.push(setTimeout(run, 350 + i * 700));
      });
    });
  });
  K.$('[data-reset]', root).addEventListener('click', function () { clearEx(); ans = [null, null, null, null, null]; render(true); });

  var rz = 0;
  window.addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(function () { route = []; measure(); }, 120); });
  render(false);
  return {
    start: function () { route = []; measure(); },
    stop: function () { loop.off(); }
  };
});
