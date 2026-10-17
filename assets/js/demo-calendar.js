/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* Social media page: a sample month of LinkedIn, Facebook and Instagram posts, coloured by content
   pillar. Every post runs draft, in review, approved, scheduled, published; changes loop back and a
   post not approved by its day is held, never published. Published posts build engagement; tracked
   links and messages become leads in Odoo CRM, which sales qualifies. Drag to reschedule. */
TN.demo('calendar', function (root, K) {
  var q = function (s) { return K.$(s, root); };
  var grid = q('.ccp-grid'), detail = q('.ccp-detail'), logEl = q('.ccp-log'), statesEl = q('.ccp-states');
  var weeksEl = q('.ccp-weeks'), funnelEl = q('.ccp-funnel'), leadsEl = q('.ccp-leads');
  var runBtn = q('[data-run]'), runLbl = K.$('span', runBtn), todayEl = q('[data-today]'), dayEl = q('[data-day]'), prog = q('.ccp-prog i');
  var tip = K.tip(root);
  var CH = { li: ['LinkedIn', 'LI', '08:30'], fb: ['Facebook', 'FB', '12:00'], ig: ['Instagram', 'IG', '19:30'] }, CHK = ['li', 'fb', 'ig'];
  var CHC = ['#1F1F3D', '#5B74A6', '#A9B7D6'];                    // chart shades by channel (neutral, not brand colours)
  var PIL = [['Expertise', 'var(--tok-stock)'], ['Behind the scenes', 'var(--tok-make)'], ['Projects', 'var(--tok-pay)'], ['Offers and events', 'var(--tok-buy)']];
  var SN = { draft: 'Draft', review: 'In review', changes: 'Changes requested', approved: 'Approved', scheduled: 'Scheduled', published: 'Published', held: 'Held' };
  var SK = ['draft', 'review', 'approved', 'scheduled', 'published', 'changes', 'held'];
  var WD = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  var GLY = {                                                      // constant markup for the status glyphs
    draft: '<svg viewBox="0 0 12 12" aria-hidden="true"><circle cx="6" cy="6" r="4.2" stroke-dasharray="2.2 1.8"/></svg>',
    review: '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M1.2 6S3 3 6 3s4.8 3 4.8 3S9 9 6 9 1.2 6 1.2 6z"/><circle cx="6" cy="6" r="1.3"/></svg>',
    changes: '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M6 2.3v4.6M6 9.3v.2"/></svg>',
    approved: '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.4 6.3l2.3 2.3 4.9-5.2"/></svg>',
    scheduled: '<svg viewBox="0 0 12 12" aria-hidden="true"><circle cx="6" cy="6" r="4.4"/><path d="M6 3.5V6l1.8 1.2"/></svg>',
    published: '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M1 6.4l2.1 2.1 4.3-4.8M5.9 8.1l.4.4 4.2-4.8"/></svg>'
  };
  GLY.held = GLY.changes;
  // [day, channel, pillar, title]
  var BASE = [[1, 'li', 0, 'Five signs a process needs fixing'], [2, 'ig', 1, 'Meet the installation crew'], [5, 'fb', 3, 'Open house invitation'],
    [6, 'li', 2, 'Project: warehouse fit-out'], [7, 'ig', 0, 'Quick tip: label your racks'], [8, 'li', 0, 'Checklist before you expand'],
    [9, 'fb', 1, 'Friday team lunch'], [12, 'li', 3, 'Webinar: planning for 2027'], [13, 'ig', 2, 'Before and after'],
    [14, 'fb', 0, 'How we quote a job'], [15, 'li', 1, 'How we plan a site visit'], [16, 'ig', 3, 'Open house: last call'],
    [19, 'li', 0, 'Three questions for a vendor'], [20, 'fb', 2, 'Project: showroom refresh'], [21, 'ig', 1, 'Studio day'],
    [22, 'li', 2, 'What a smooth handover looks like'], [23, 'ig', 0, 'Myth or fact?'], [26, 'li', 3, 'Year-end booking slots'],
    [27, 'fb', 1, 'Welcome to our new starter'], [28, 'ig', 2, 'Detail shot: joinery'], [29, 'li', 0, 'Guide: budgeting a refit'], [30, 'fb', 3, 'Weekend visit hours']];
  var START = 12, INIT = { 12: 'scheduled', 13: 'scheduled', 14: 'scheduled', 15: 'review', 16: 'review', 19: 'approved', 20: 'review', 21: 'changes', 22: 'review' };
  var WHO = ['Koh Interiors', 'Lee Logistics', 'Tan Fabrication', 'Reyes Trading', 'Ong Precision', 'Nguyen Foods', 'Wong Studio', 'Cruz Builders', 'Lim Hardware', 'Santos Retail', 'Chua Kitchens', 'Ho Engineering'];
  var CUM = [.5, .8, .95, 1], DAY = 1150;
  function dl(d) { return d > 31 ? 'Sun 1 Nov' : WD[(d + 2) % 7] + ' ' + d + ' Oct'; }
  function wk(d) { return Math.floor((d + 2) / 7); }
  function rng(s) { return function () { s = s + 0x6D2B79F5 | 0; var t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

  /* ------------------------------------------------------------ the month grid */
  var cells = [];
  for (var i = 0; i < 35; i++) {
    var d = i - 2, c = K.el('div', 'ccp-day' + (d < 1 || d > 31 ? ' is-out' : ''));
    c.appendChild(K.el('span', 'ccp-dn', String(d < 1 ? 28 + i : d > 31 ? d - 31 : d)));
    var list = K.el('div', 'ccp-posts'); c.appendChild(list);
    if (d >= 1 && d <= 31) c.setAttribute('aria-label', dl(d));
    grid.appendChild(c); cells.push({ el: c, list: list, d: d });
  }
  function cellOf(d) { return cells[d + 2]; }

  /* ------------------------------------------------------------ state */
  var posts, today, leads, seq, rnd, sel = null, filt = 'all', running = false, acc = 0, touched = false, lastDrop = 0, pops = [], vis = false, drag = null;
  function trail(p, d, t) { p.trail.push([d, t]); }
  function reset() {
    rnd = rng(20261012); today = START; leads = []; seq = 0; acc = 0;
    grid.classList.remove('is-closed');
    posts = BASE.map(function (b, i) {
      var p = { id: i, day: b[0], ch: b[1], pil: b[2], title: b[3], st: 'draft', acc: 0, nl: 0, trail: [], missed: false, revised: false, sent: 0, slow: 0 };
      var imp = { li: 1250, fb: 900, ig: 1400 }[p.ch] * (.7 + rnd() * .6);
      p.fin = { imp: imp, eng: imp * [.045, .06, .05, .03][p.pil] * (.8 + rnd() * .4), clk: imp * [.012, .004, .01, .016][p.pil] * (.8 + rnd() * .4), msg: p.ch === 'li' ? 0 : rnd() * .7 };
      p.fin.lead = p.fin.clk * .04 + p.fin.msg * .6; p.lseed = rnd();
      var st = p.day < START ? 'published' : INIT[p.day] || 'draft';
      trail(p, -2, 'Planned at the monthly kick-off');
      if (st !== 'draft') { trail(p, Math.max(-1, p.day - 9), 'Draft sent to you for review'); p.sent = START - 1; }
      if (st === 'changes') trail(p, START - 1, 'You asked for changes');
      if (/approved|scheduled|published/.test(st)) trail(p, Math.max(0, p.day - 7), 'Approved by you');
      if (/scheduled|published/.test(st)) trail(p, Math.max(0, p.day - 4), 'Scheduled in Odoo Social Marketing');
      if (st === 'published') { trail(p, p.day, 'Published at ' + CH[p.ch][2]); p.pub = p.day; }
      p.st = st; p.chg = START - 1;
      if (p.day === 16) p.slow = 6;                              // the client is slow on this one: it misses its day
      if (!p.el) makeChip(p);
      return p;
    });
    posts.forEach(function (p) { if (p.st === 'published') accrue(p, true); });
    leads.forEach(function (L) { if (today - L.day >= 2) L.opp = rnd() < .45; });
    sel = null; logEl.textContent = '';
    note('ok', 'Month planned: ' + posts.length + ' posts across three channels');
    render();
  }

  /* ------------------------------------------------------------ chips */
  var chipEls = {};
  function makeChip(p) {
    var b = chipEls[p.id] || K.el('button', 'ccp-post');
    b.type = 'button'; b.dataset.id = p.id; b.textContent = ''; delete b.dataset.s;
    b.appendChild(K.el('b', null, CH[p.ch][1])); b.appendChild(K.el('span', null, p.title)); b.appendChild(K.el('i'));
    b.style.setProperty('--c', PIL[p.pil][1]);
    chipEls[p.id] = b; p.el = b;
  }
  function stOf(p) { return p.missed && p.st !== 'published' ? 'held' : p.st; }
  function renderGrid() {
    cells.forEach(function (c) { c.el.classList.toggle('is-past', c.d < today && c.d >= 1); c.el.classList.toggle('is-today', c.d === today && today <= 31); });
    posts.forEach(function (p) {
      var b = chipEls[p.id], cell = cellOf(p.day), s = stOf(p);
      if (b.parentNode !== cell.list) cell.list.appendChild(b);
      if (b.dataset.s !== s) { K.$('i', b).innerHTML = GLY[s]; b.dataset.s = s; }
      b.className = 'ccp-post ccp-g s-' + s + (sel === p ? ' is-sel' : '') + (filt !== 'all' && p.ch !== filt ? ' is-dim' : '') + (drag && drag.on && drag.b === b ? ' is-lift' : '');
      b.setAttribute('aria-label', CH[p.ch][0] + ' post, ' + p.title + ', ' + dl(p.day) + ', ' + SN[s] + (sel === p ? ', selected' : ''));
    });
  }

  /* ------------------------------------------------------------ one simulated day */
  function set(p, st, d, t) { p.st = st; if (t) trail(p, d, t); }
  function note(kind, text) {
    var li = K.el('li'); li.style.setProperty('--c', { ok: 'var(--ok)', pub: 'var(--blue)', chg: 'var(--tok-late)', lead: 'var(--tok-pay)', rev: 'var(--tok-buy)' }[kind]);
    li.appendChild(K.el('i')); li.appendChild(K.el('span', null, text)); li.title = text;
    logEl.insertBefore(li, logEl.firstChild);
    var rows = K.$$('li', logEl); while (rows.length > 4) rows.pop().remove();
  }
  function free(p, d) { return !posts.some(function (o) { return o !== p && o.day === d && o.ch === p.ch; }) && posts.filter(function (o) { return o !== p && o.day === d; }).length < 2; }
  function accrue(p, quiet) {
    p.acc = CUM[Math.min(today - p.pub, 3)];
    var want = Math.floor(p.fin.lead * p.acc + p.lseed);
    while (p.nl < want) {
      p.nl++;
      var L = { who: WHO[seq++ % WHO.length], p: p, via: rnd() < p.fin.clk * .04 / p.fin.lead ? 'form' : 'msg', day: quiet ? p.pub + 1 : today, opp: null };
      leads.push(L);
      if (!quiet) note('lead', 'Lead in Odoo CRM: ' + L.who + ', from ' + CH[p.ch][0] + (L.via === 'form' ? ' via the website form' : ' via a message'));
    }
  }
  function tick() {
    var d = today;
    posts.forEach(function (p) {
      if (p.day !== d || p.st === 'published') return;
      if (p.st === 'scheduled') { set(p, 'published', d, 'Published at ' + CH[p.ch][2]); p.pub = d; note('pub', 'Published on ' + CH[p.ch][0] + ': ' + p.title); pops.push(p.el); }
      else if (!p.missed) { p.missed = true; trail(p, d, 'Held: not approved by its day, so not published'); note('chg', 'Held back, not approved in time: ' + p.title); }
    });
    posts.forEach(function (p) {
      if (p.st === 'review' && p.sent + 1 + p.slow <= d) {
        if (!p.revised && rnd() < .18) { set(p, 'changes', d, 'You asked for changes'); p.chg = d; note('chg', 'Changes requested: ' + p.title); }
        else { set(p, 'approved', d, 'Approved by you'); note('ok', 'Approved by you: ' + p.title); }
      } else if (p.st === 'changes' && p.chg < d) { p.revised = true; set(p, 'review', d, 'Revised by TechNext, sent back to you'); p.sent = d; note('rev', 'Revised and back in review: ' + p.title); }
      else if (p.st === 'draft' && p.day > d && p.day - d <= 6) { set(p, 'review', d, 'Draft sent to you for review'); p.sent = d; note('rev', 'Sent for your review: ' + p.title); }
      else if (p.st === 'approved' && p.missed) {
        for (var n = d + 1; n <= 31 && !free(p, n); n++);
        if (n <= 31) { p.day = n; p.missed = false; set(p, 'scheduled', d, 'Approved late: moved to ' + dl(n) + ' and scheduled'); note('rev', 'Moved to the next free slot, ' + dl(n) + ': ' + p.title); }
      } else if (p.st === 'approved' && p.day > d && p.day - d <= 4) set(p, 'scheduled', d, 'Scheduled in Odoo Social Marketing for ' + CH[p.ch][2]);
    });
    posts.forEach(function (p) { if (p.st === 'published') accrue(p); });
    leads.forEach(function (L) {
      if (L.opp === null && d - L.day >= 2) { L.opp = rnd() < .45; if (L.opp) note('ok', 'Sales qualified ' + L.who + ' as an opportunity'); }
    });
    today++;
    if (today > 31) finish();
    render();
  }
  function finish() {
    running = false; grid.classList.add('is-closed');
    runBtn.setAttribute('aria-pressed', 'false'); runLbl.textContent = 'Replay the month';
    note('ok', 'Month closed: the one-page report is ready');
  }

  /* ------------------------------------------------------------ moving a post */
  function move(p, nd, how) {
    var why = p.st === 'published' ? 'Published posts stay on the day they ran' : nd < today ? 'Pick today or a later day' : nd > 31 ? 'Keep it inside October' :
      posts.some(function (o) { return o !== p && o.day === nd && o.ch === p.ch; }) ? 'One ' + CH[p.ch][0] + ' post per day keeps the feed spaced' : !free(p, nd) ? 'Two posts a day at most' : '';
    if (why) { note('chg', why); return false; }
    if (nd === p.day) return false;
    p.day = nd; p.missed = false; tip.hide();
    if (p.st === 'scheduled') set(p, 'approved', today, 'Moved to ' + dl(nd) + ' by you: approval kept, to be scheduled again');
    else trail(p, today, 'Moved to ' + dl(nd) + (how ? ' by ' + how : ''));
    note('rev', 'Moved to ' + dl(nd) + ': ' + p.title);
    render();
    return true;
  }

  /* ------------------------------------------------------------ the detail panel */
  function btn(a, label, primary, off) { var b = K.el('button', 'dm-btn' + (primary ? ' dm-btn--primary' : ''), label); b.type = 'button'; b.dataset.a = a; if (off) b.disabled = true; return b; }
  function renderDetail() {
    var fa = document.activeElement && detail.contains(document.activeElement) ? document.activeElement.dataset.a : null;
    detail.textContent = '';
    if (!sel) {
      detail.appendChild(K.el('b', 'ccp-dt', 'Select a post'));
      detail.appendChild(K.el('p', 'ccp-hint', 'Click any post to see its approval trail and act on it. Drag a post to another day to reschedule it, or use the move buttons here.'));
      var ul = K.el('ul', 'ccp-key');
      SK.forEach(function (s) { var li = K.el('li', 'ccp-post ccp-mini ccp-g s-' + s); li.appendChild(K.el('i')); K.$('i', li).innerHTML = GLY[s]; li.appendChild(K.el('span', null, SN[s])); ul.appendChild(li); });
      detail.appendChild(ul);
      return;
    }
    var p = sel, s = stOf(p);
    detail.style.setProperty('--c', PIL[p.pil][1]);
    var h = K.el('div', 'ccp-dh');
    h.appendChild(K.el('b', 'ccp-badge', CH[p.ch][1])); h.appendChild(K.el('span', null, CH[p.ch][0] + ' · ' + PIL[p.pil][0]));
    h.appendChild(K.el('small', null, dl(p.day) + ' · ' + CH[p.ch][2]));
    detail.appendChild(h);
    detail.appendChild(K.el('b', 'ccp-dt', p.title));
    var art = K.el('div', 'ccp-art'); art.appendChild(K.el('i')); var cap = K.el('span'); for (var i = 0; i < 3; i++) cap.appendChild(K.el('i')); art.appendChild(cap); detail.appendChild(art);
    // approval stepper
    var steps = K.el('ol', 'ccp-steps'), at = ['draft', 'review', 'approved', 'scheduled', 'published'].indexOf(p.st === 'changes' ? 'review' : p.st);
    ['Draft', 'Review', 'Approve', 'Schedule', 'Publish'].forEach(function (t, k) { var li = K.el('li', k < at ? 'is-done' : k === at ? 'is-now' + (s === 'held' || s === 'changes' ? ' is-bad' : '') : null); li.appendChild(K.el('i')); li.appendChild(K.el('span', null, t)); steps.appendChild(li); });
    detail.appendChild(steps);
    var st = K.el('p', 'ccp-st ccp-g s-' + s); st.appendChild(K.el('i')); K.$('i', st).innerHTML = GLY[s];
    st.appendChild(K.el('span', null, { draft: 'Draft: TechNext is writing it', review: 'Waiting for your approval', changes: 'You asked for changes: TechNext revises it', approved: 'Approved: waiting to be scheduled', scheduled: 'Scheduled for ' + dl(p.day) + ', ' + CH[p.ch][2], published: 'Published ' + dl(p.pub), held: 'Held: it missed its day without approval' }[s]));
    detail.appendChild(st);
    var row = K.el('div', 'ccp-acts');
    if (p.st === 'published') {
      var f = p.fin, a = p.acc, m = K.el('dl', 'ccp-pm');
      [['Impressions', f.imp * a], ['Engagements', f.eng * a], ['Link clicks', f.clk * a], ['Leads', p.nl]].forEach(function (x) { var dv = K.el('div'); dv.appendChild(K.el('dt', null, x[0])); dv.appendChild(K.el('dd', null, Math.round(x[1]).toLocaleString('en-SG'))); m.appendChild(dv); });
      detail.appendChild(m);
    } else {
      if (p.st === 'draft') row.appendChild(btn('send', 'Send for review', true));
      if (p.st === 'review') { row.appendChild(btn('approve', 'Approve', true)); row.appendChild(btn('changes', 'Ask for changes')); }
      if (p.st === 'changes') row.appendChild(btn('revise', 'Send the revision', true));
      if (p.st === 'approved') row.appendChild(btn('schedule', 'Schedule', true, p.day < today || p.missed));
      var mv = K.el('div', 'ccp-mv'); mv.setAttribute('role', 'group'); mv.setAttribute('aria-label', 'Move this post');
      mv.appendChild(K.el('span', null, 'Move'));
      mv.appendChild(btn('m-1', '← Day')); mv.appendChild(btn('m1', 'Day →')); mv.appendChild(btn('m7', '+1 week'));
      detail.appendChild(row); detail.appendChild(mv);
    }
    var tr = K.el('ol', 'ccp-trail');
    p.trail.slice(-4).reverse().forEach(function (t) { var li = K.el('li'); li.appendChild(K.el('b', null, t[0] < 1 ? (30 + t[0]) + ' Sep' : t[0] + ' Oct')); li.appendChild(K.el('span', null, t[1])); tr.appendChild(li); });
    detail.appendChild(tr);
    if (fa) { var again = K.$('[data-a="' + fa + '"]', detail) || K.$('[data-a]', detail); if (again && !again.disabled) again.focus({ preventScroll: true }); }
  }
  detail.addEventListener('click', function (e) {
    var b = e.target.closest('[data-a]'); if (!b || !sel) return;
    user(); var p = sel, a = b.dataset.a;
    if (a === 'send') { set(p, 'review', today, 'Draft sent to you for review'); p.sent = today; note('rev', 'Sent for your review: ' + p.title); }
    else if (a === 'approve') { set(p, 'approved', today, 'Approved by you'); note('ok', 'Approved by you: ' + p.title); if (p.missed) { p.missed = false; } }
    else if (a === 'changes') { set(p, 'changes', today, 'You asked for changes'); p.chg = today; note('chg', 'Changes requested: ' + p.title); }
    else if (a === 'revise') { p.revised = true; set(p, 'review', today, 'Revised by TechNext, sent back to you'); p.sent = today; }
    else if (a === 'schedule') { set(p, 'scheduled', today, 'Scheduled in Odoo Social Marketing for ' + CH[p.ch][2]); note('ok', 'Scheduled: ' + p.title); }
    else { move(p, p.day + +a.slice(1), 'you'); return; }
    render();
  });

  /* ------------------------------------------------------------ totals, chart, funnel, leads */
  var kEls = {}; K.$$('[data-k]', root).forEach(function (n) { kEls[n.dataset.k] = n; });
  var stRows = {}, wkCols = [], fRows = [];
  SK.forEach(function (s) { var li = K.el('li', 'ccp-g s-' + s); li.appendChild(K.el('i')); K.$('i', li).innerHTML = GLY[s]; li.appendChild(K.el('span', null, SN[s])); var n = K.el('em', null, '0'); li.appendChild(n); statesEl.appendChild(li); stRows[s] = n; });
  ['1–4', '5–11', '12–18', '19–25', '26–31'].forEach(function (r, w) {
    var col = K.el('div', 'ccp-wk'), tot = K.el('em', null, '0'), stack = K.el('span', 'ccp-stack'), segs = [];
    CHK.forEach(function (c, k) { var s = K.el('i', 'ccp-seg'); s.style.background = CHC[k]; stack.appendChild(s); segs.push(s); });
    col.appendChild(tot); col.appendChild(stack); col.appendChild(K.el('small', null, r));
    col.tabIndex = 0; weeksEl.appendChild(col); wkCols.push({ el: col, tot: tot, segs: segs, r: r });
    function show() { var b = K.box(col, root), v = lastAgg.wk[w]; tip.show(['Week ' + (w + 1) + ' · ' + r + ' Oct', CHK.map(function (c, k) { return CH[c][0] + ' ' + Math.round(v[k]); }).join(' · '), 'Engagements from posts published that week'], b.cx, b.y); }
    col.addEventListener('pointerenter', show); col.addEventListener('focus', show); col.addEventListener('pointerleave', tip.hide); col.addEventListener('blur', tip.hide);
  });
  var leg = K.el('ul', 'ccp-cl'); CHK.forEach(function (c, k) { var li = K.el('li', null, CH[c][0]); li.style.setProperty('--c', CHC[k]); leg.appendChild(li); }); weeksEl.parentNode.appendChild(leg);
  ['Impressions', 'Engagements', 'Link clicks', 'Leads', 'Opportunities'].forEach(function (t) {
    var li = K.el('li'), bar = K.el('span', 'ccp-fb'), fill = K.el('i'), v = K.el('em', null, '0'), r = K.el('small');
    li.appendChild(K.el('b', null, t)); bar.appendChild(fill); li.appendChild(bar); li.appendChild(v); li.appendChild(r); funnelEl.appendChild(li);
    fRows.push({ fill: fill, v: v, r: r });
  });
  var lastAgg = null;
  function agg() {
    var a = { imp: 0, eng: 0, clk: 0, lead: 0, opp: 0, wk: [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]] };
    posts.forEach(function (p) {
      if (p.st !== 'published' || (filt !== 'all' && p.ch !== filt)) return;
      a.imp += p.fin.imp * p.acc; a.eng += p.fin.eng * p.acc; a.clk += p.fin.clk * p.acc;
      a.wk[wk(p.pub)][CHK.indexOf(p.ch)] += p.fin.eng * p.acc;
    });
    leads.forEach(function (L) { if (filt === 'all' || L.p.ch === filt) { a.lead++; if (L.opp) a.opp++; } });
    return a;
  }
  function renderStats() {
    var a = lastAgg = agg(), counts = {};
    SK.forEach(function (s) { counts[s] = 0; });
    posts.forEach(function (p) { if (filt === 'all' || p.ch === filt) counts[stOf(p)]++; });
    SK.forEach(function (s) { stRows[s].textContent = counts[s]; stRows[s].parentNode.classList.toggle('is-zero', !counts[s]); });
    ['imp', 'eng', 'clk'].forEach(function (k) { K.count(kEls[k], a[k], 600); });
    K.count(kEls.lead, a.lead, 400);
    var mx = 0; a.wk.forEach(function (v) { mx = Math.max(mx, v[0] + v[1] + v[2]); });
    mx = Math.max(50, Math.ceil(mx * 1.12 / 50) * 50);
    wkCols.forEach(function (c, w) {
      var v = a.wk[w], off = 0;
      c.segs.forEach(function (s, k) { s.style.transform = 'translateY(' + (-off / mx * 100).toFixed(2) + '%) scaleY(' + (v[k] / mx).toFixed(4) + ')'; off += v[k]; });
      c.tot.textContent = off ? Math.round(off) : '';
      c.el.classList.toggle('is-now', w === wk(Math.min(today, 31)));
    });
    var F = [a.imp, a.eng, a.clk, a.lead, a.opp], top = Math.log10(Math.max(10, F[0]) + 1);
    fRows.forEach(function (r, i) {
      r.fill.style.transform = 'scaleX(' + (Math.log10(F[i] + 1) / top).toFixed(4) + ')';
      r.v.textContent = Math.round(F[i]).toLocaleString('en-SG');
      r.r.textContent = i && F[i - 1] ? (F[i] / F[i - 1] * 100).toFixed(F[i] / F[i - 1] < .1 ? 1 : 0) + '% of the step before' : i ? '' : 'published posts so far';
    });
    leadsEl.textContent = '';
    var shown = leads.filter(function (L) { return filt === 'all' || L.p.ch === filt; }).slice(-3).reverse();
    if (!shown.length) leadsEl.appendChild(K.el('li', 'ccp-empty', 'No leads from this channel yet'));
    shown.forEach(function (L) {
      var li = K.el('li'); li.style.setProperty('--c', PIL[L.p.pil][1]);
      var t = K.el('span'); t.appendChild(K.el('b', null, L.who)); t.appendChild(K.el('small', null, CH[L.p.ch][0] + ' · ' + (L.via === 'form' ? 'website form, UTM tagged' : 'message, passed to sales')));
      li.appendChild(t); li.appendChild(K.el('em', L.opp ? 'is-opp' : L.opp === false ? 'is-nur' : null, L.opp ? 'Opportunity' : L.opp === false ? 'Nurture' : 'New'));
      leadsEl.appendChild(li);
    });
  }
  function render() {
    renderGrid(); renderDetail(); renderStats();
    pops.forEach(function (el) { K.restart(el, 'is-pop'); }); pops = [];
    var d = Math.min(today, 31);
    todayEl.textContent = today > 31 ? 'Month closed' : dl(today);
    dayEl.textContent = today > 31 ? 'report ready' : 'day ' + d + ' of 31';
    prog.style.transform = 'scaleX(' + ((Math.min(today, 32) - 1) / 31).toFixed(3) + ')';
  }

  /* ------------------------------------------------------------ select, hover, drag */
  function user() { touched = true; }
  grid.addEventListener('click', function (e) {
    var b = e.target.closest('.ccp-post'); if (!b || performance.now() - lastDrop < 350) return;
    user(); var p = posts[+b.dataset.id]; sel = sel === p ? null : p; render();
  });
  grid.addEventListener('pointerover', function (e) {
    var b = e.target.closest('.ccp-post'); if (!b || drag) return;
    var p = posts[+b.dataset.id], bx = K.box(b, root);
    tip.show([p.title, CH[p.ch][0] + ' · ' + PIL[p.pil][0] + ' · ' + dl(p.day) + ', ' + CH[p.ch][2], SN[stOf(p)] + (p.st === 'published' ? '' : ' · drag to reschedule')], bx.cx, bx.y);
  });
  grid.addEventListener('pointerout', function (e) { if (!e.relatedTarget || !e.relatedTarget.closest || !e.relatedTarget.closest('.ccp-post')) tip.hide(); });
  grid.addEventListener('pointerdown', function (e) {
    var b = e.target.closest('.ccp-post'); if (!b || e.button) return;
    drag = { b: b, p: posts[+b.dataset.id], x: e.clientX, y: e.clientY, on: false, t: null };
  });
  window.addEventListener('pointermove', function (e) {
    if (!drag) return;
    if (!drag.on) {
      if (Math.abs(e.clientX - drag.x) + Math.abs(e.clientY - drag.y) < 6) return;
      if (drag.p.st === 'published') { note('chg', 'Published posts stay on the day they ran'); drag = null; return; }
      var r = drag.b.getBoundingClientRect(); drag.rr = root.getBoundingClientRect();
      drag.ox = e.clientX - r.left; drag.oy = e.clientY - r.top;
      drag.rects = cells.map(function (c) { return c.el.getBoundingClientRect(); });
      drag.g = drag.b.cloneNode(true); drag.g.classList.add('ccp-ghost'); drag.g.style.width = r.width + 'px'; drag.g.removeAttribute('aria-label');
      root.appendChild(drag.g); drag.b.classList.add('is-lift'); drag.on = true; tip.hide(); user();
    }
    drag.g.style.transform = 'translate(' + (e.clientX - drag.rr.left - drag.ox).toFixed(1) + 'px,' + (e.clientY - drag.rr.top - drag.oy).toFixed(1) + 'px) rotate(-2deg)';
    var hit = null;
    drag.rects.forEach(function (r, i) { if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) hit = cells[i]; });
    if (hit !== drag.t) {
      if (drag.t) drag.t.el.classList.remove('is-drop', 'is-nodrop');
      drag.t = hit;
      if (hit) { var ok = hit.d >= today && hit.d <= 31 && (hit.d === drag.p.day || free(drag.p, hit.d)); hit.el.classList.add(ok ? 'is-drop' : 'is-nodrop'); }
    }
  });
  function endDrag() {
    if (!drag) return;
    if (drag.on) {
      drag.g.remove(); drag.b.classList.remove('is-lift'); lastDrop = performance.now();
      if (drag.t) { drag.t.el.classList.remove('is-drop', 'is-nodrop'); move(drag.p, drag.t.d, 'you'); }
    }
    drag = null;
  }
  window.addEventListener('pointerup', endDrag); window.addEventListener('pointercancel', endDrag);

  /* ------------------------------------------------------------ controls and the clock */
  K.$$('[data-ch]', root).forEach(function (b) { b.addEventListener('click', function () { user(); filt = b.dataset.ch; K.$$('[data-ch]', root).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); render(); }); });
  function play(on) { running = on; if (on && vis) lp.on(); else if (!on) lp.off(); runBtn.setAttribute('aria-pressed', String(on)); runLbl.textContent = on ? 'Pause' : today > 31 ? 'Replay the month' : 'Run the month'; }
  runBtn.addEventListener('click', function () {
    user();
    if (today > 31) { reset(); }
    if (K.reduce) { for (var n = 0; n < 7 && today <= 31; n++) tick(); runLbl.textContent = today > 31 ? 'Replay the month' : 'Advance a week'; return; }
    play(!running);
  });
  q('[data-reset]').addEventListener('click', function () { user(); play(false); reset(); if (K.reduce) runLbl.textContent = 'Advance a week'; });
  var lp = K.loop(function (now, dt) {
    if (!running) return;
    acc += dt * 1000;
    if (acc >= DAY) { acc = 0; tick(); if (today > 31) play(false); }
    prog.style.transform = 'scaleX(' + ((Math.min(today, 32) - 1 + (running ? acc / DAY : 0)) / 31).toFixed(4) + ')';
  });

  reset();
  if (K.reduce) { runLbl.textContent = 'Advance a week'; for (var n = 0; n < 6; n++) tick(); }
  return {
    start: function (first) { vis = true; if (first && !touched && !K.reduce) setTimeout(function () { if (!touched && vis) play(true); }, 900); if (running) lp.on(); },
    stop: function () { vis = false; lp.off(); }
  };
});
