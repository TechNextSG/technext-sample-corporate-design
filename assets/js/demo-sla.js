/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* Odoo support page: the ticket lifecycle against an example plan's targets. Tickets (bug, how-to,
   change request, upgrade task) arrive with priorities and move through New, Triage, In progress,
   Waiting on you, Testing on staging, Deployed and Closed, each type on its own path. A named team
   picks work by priority and time used; the clock pauses while a ticket waits on the client; at 75%
   of a target a ticket escalates to the lead, and urgent work pre-empts lower priorities. Fixes are
   batched onto release trains, staging first and then production. Sample data, simulated time. */
TN.demo('sla', function (root, K) {
  var ST = [['new', 'New'], ['tri', 'Triage'], ['prog', 'In progress'], ['wait', 'Waiting on you'], ['test', 'Testing on staging'], ['dep', 'Deployed'], ['done', 'Closed']];
  var STN = {}; ST.forEach(function (s) { STN[s[0]] = s[1]; });
  var DAY = 540;                                                // one business day, 09:00 to 18:00, in minutes
  var PRI = {                                                   // example plan only
    1: { n: 'Urgent', c: '#D2433B', resp: 30, res: 240, rl: '30 min', sl: '4 h' },
    2: { n: 'High', c: '#D97B12', resp: 120, res: DAY, rl: '2 h', sl: '1 day' },
    3: { n: 'Normal', c: '#56709E', resp: 240, res: 3 * DAY, rl: '4 h', sl: '3 days' },
    4: { n: 'Low', c: '#A3A3B8', resp: DAY, res: 5 * DAY, rl: '1 day', sl: '5 days' }
  };
  var TY = { bug: { n: 'Bug', c: '#7447D6' }, how: { n: 'How-to', c: '#0E9384' }, chg: { n: 'Change', c: '#714B67' }, upg: { n: 'Upgrade', c: '#3167CA' } };
  var TITLES = {
    bug: ['Bank sync stopped', 'Invoice PDF layout', 'Count won’t post', 'Payslip rule error', 'Portal login loops', 'Report total is off', 'Barcode scan fails', 'Refund tax is wrong'],
    how: ['Add a pricelist', 'Credit one line', 'Split a payment', 'Archive products', 'Reprint a label', 'Add a new user'],
    chg: ['PO approval step', 'New field on quotes', 'Extra sales report', 'Second warehouse', 'Email template edit'],
    upg: ['Upgrade to Odoo 20', 'Test modules on 20', 'Migrate a report'],
    hot: ['Orders won’t confirm', 'POS won’t close', 'Payments not posting', 'Checkout failing']
  };
  var WHY = { info: 'we asked for the steps to reproduce', scope: 'approve the scope and estimate', confirm: 'confirm the answer works', date: 'choose the go-live date' };
  var TEAM = [{ k: 'sg', n: 'SG lead consultant', i: 'SG', con: 1 }, { k: 'ph', n: 'PH consultant', i: 'PH', con: 1 },
              { k: 'v1', n: 'VN developer', i: 'VN', dev: 1 }, { k: 'v2', n: 'VN developer', i: 'VN', dev: 1 }];
  var HOST = {
    sh: ['Development branch', 'Staging branch, a copy of your database', 'Merged to the production branch'],
    own: ['Developer build', 'Test server with a copy of your database', 'Deployed in the release window']
  };
  var SPEED = 20;                                               // simulated minutes per real second
  var STG = 180, PRD = 270;                                     // example cadence: staging every 3 h, release windows twice a day

  var seed = 20260927;
  function rnd() { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var x = Math.imul(seed ^ seed >>> 15, 1 | seed); x = x + Math.imul(x ^ x >>> 7, 61 | x) ^ x; return ((x ^ x >>> 14) >>> 0) / 4294967296; }
  function between(a, b) { return Math.round(a + rnd() * (b - a)); }
  function pickR(list) { return list[Math.floor(rnd() * list.length)]; }

  var board = K.$('.sla-board', root), teamEl = K.$('.sla-team', root), kClock = K.$('[data-k="clock"]', root);
  var tbody = K.$('.sla-tbl tbody', root), chart = K.$('.sla-chart', root), logEl = K.$('.sla-log', root);
  var track = K.$('.sla-track', root), stns = K.$$('.sla-stn', root), qEls = [0, 1, 2].map(function (i) { return K.$('[data-q="' + i + '"]', root); });
  var subs = [0, 1, 2].map(function (i) { return K.$('[data-sub="' + i + '"]', root); });
  var tip = K.tip(root);

  // ---------------------------------------------------------------- columns
  var cols = {};
  ST.forEach(function (s) {
    var col = K.el('div', 'sla-col sla-col--' + s[0]), h = K.el('p', 'sla-colh');
    h.appendChild(K.el('b', null, s[1])); var n = K.el('small', null, '0'); h.appendChild(n);
    if (s[0] === 'wait' || s[0] === 'test') { var p = K.el('span', 'sla-pz', 'clock paused'); h.appendChild(p); }
    var list = K.el('div', 'sla-list'), more = K.el('span', 'sla-more');
    col.appendChild(h); col.appendChild(list); col.appendChild(more); board.appendChild(col);
    cols[s[0]] = { list: list, n: n, more: more };
  });
  var team = TEAM.map(function (w) {
    var li = K.el('li'); var av = K.el('b', null, w.i); li.appendChild(av);
    var tx = K.el('span'); tx.appendChild(K.el('em', null, w.n)); var job = K.el('small', null, 'free'); tx.appendChild(job); li.appendChild(tx);
    teamEl.appendChild(li); w.el = li; w.job = job; w.tk = null; return w;
  });
  var rowsT = {};
  [1, 2, 3, 4].forEach(function (p) {
    var tr = K.el('tr'); var th = K.el('th'); var sw = K.el('i', 'dm-sw'); sw.style.setProperty('--c', PRI[p].c); th.appendChild(sw); th.appendChild(document.createTextNode(PRI[p].n)); tr.appendChild(th);
    tr.appendChild(K.el('td', null, PRI[p].rl)); tr.appendChild(K.el('td', null, PRI[p].sl));
    var o = K.el('td', 'sla-num', '0'), r = K.el('td', 'sla-num', '0'); tr.appendChild(o); tr.appendChild(r);
    tbody.appendChild(tr); rowsT[p] = { tr: tr, o: o, r: r };
  });

  // ---------------------------------------------------------------- tickets
  var tks = [], nextId = 1051, sim = 60, filter = 0;
  var RING = 2 * Math.PI * 7;
  function mk(o) {
    var tk = { id: o.id || nextId++, ty: o.ty, pri: o.pri, title: o.title, st: o.st || 'new', act: o.act || 0, work: o.work || 0, timer: o.timer || 0,
               who: null, ready: !!o.ready, appr: !!o.appr, why: o.why || null, info: !!o.info, hot: !!o.hot, esc: false, miss: false,
               resp: o.st && o.st !== 'new', res: o.st === 'dep' || o.st === 'done' || (o.ty === 'how' && (o.st === 'wait' || o.st === 'done')), onTrain: false, born: sim };
    var el = K.el('button', 'sla-t'); el.type = 'button';
    el.style.setProperty('--p', PRI[tk.pri].c); el.style.setProperty('--y', TY[tk.ty].c);
    var top = K.el('span', 'sla-tt'); top.appendChild(K.el('b', null, '#' + tk.id)); top.appendChild(K.el('em', null, PRI[tk.pri].n));
    var ring = K.svg('svg', { viewBox: '0 0 18 18', 'class': 'sla-ring', 'aria-hidden': 'true' });
    ring.appendChild(K.svg('circle', { cx: 9, cy: 9, r: 7, 'class': 'sla-rt' }));
    var arc = K.svg('circle', { cx: 9, cy: 9, r: 7, 'class': 'sla-ra', 'stroke-dasharray': RING.toFixed(2), 'stroke-dashoffset': RING.toFixed(2) });
    ring.appendChild(arc); top.appendChild(ring);
    el.appendChild(top); el.appendChild(K.el('span', 'sla-tn', tk.title));
    var meta = K.el('span', 'sla-tm'); meta.appendChild(K.el('i')); meta.appendChild(document.createTextNode(TY[tk.ty].n));
    var who = K.el('span', 'sla-who'); meta.appendChild(who); var badge = K.el('span', 'sla-bdg'); meta.appendChild(badge);
    el.appendChild(meta);
    tk.el = el; tk.arc = arc; tk.whoEl = who; tk.badge = badge;
    el.addEventListener('pointerenter', function () { showTip(tk); }); el.addEventListener('focus', function () { showTip(tk); });
    el.addEventListener('pointerleave', function () { tip.hide(); }); el.addEventListener('blur', function () { tip.hide(); });
    el.addEventListener('click', function () { showTip(tk); });
    tks.push(tk);
    return tk;
  }
  function frac(tk) { var P = PRI[tk.pri]; return tk.resp ? tk.act / P.res : tk.act / P.resp; }
  function paused(tk) { return (tk.st === 'wait' || tk.st === 'test') && !tk.appr; }
  function dur(m) { m = Math.max(0, Math.round(m)); var d = Math.floor(m / DAY), h = Math.floor(m % DAY / 60), mm = m % 60, o = []; if (d) o.push(d + ' d'); if (h) o.push(h + ' h'); if (!d && (mm || !h)) o.push(mm + ' m'); return o.join(' '); }
  function showTip(tk) {
    var P = PRI[tk.pri], b = K.box(tk.el, root), f = frac(tk);
    var target = tk.resp ? 'Resolve within ' + P.sl : 'Respond within ' + P.rl;
    var lines = ['#' + tk.id + ' · ' + TY[tk.ty].n + ' · ' + P.n, tk.title + ' · ' + STN[tk.st]];
    if (tk.st === 'done') lines.push(tk.miss ? 'Closed after its target: in the monthly review' : 'Closed within its targets');
    else {
      lines.push(target + ' (example plan): ' + dur(tk.act) + ' used' + (tk.res ? '' : ', ' + (f >= 1 ? 'target missed' : dur((tk.resp ? P.res : P.resp) - tk.act) + ' left')));
      if (paused(tk)) lines.push('Clock paused: ' + (WHY[tk.why] || 'you are testing the fix on staging'));
      if (tk.who) lines.push('With ' + tk.who.n);
      if (tk.ready && !tk.onTrain) lines.push('Fix ready: boards the next staging deploy');
      if (tk.appr && !tk.onTrain) lines.push('Approved on staging: waits for the next release window');
      if (tk.esc) lines.push('Escalated to the lead consultant');
    }
    tip.show(lines, b.cx, b.y);
  }

  // ---------------------------------------------------------------- moving cards between states (FLIP)
  var MAXV = 3;
  function order(list) {
    return list.sort(function (a, b) { return a.st === 'done' ? b.closed - a.closed : (b.esc - a.esc) || (a.pri - b.pri) || (a.id - b.id); });
  }
  function layout(animate) {
    var els = tks.map(function (t) { return t.el; }), first = null;
    if (animate && !K.reduce) first = els.map(function (e) { return e.isConnected && e.offsetParent ? e.getBoundingClientRect() : null; });
    ST.forEach(function (s) {
      var c = cols[s[0]], list = order(tks.filter(function (t) { return t.st === s[0]; }));
      list.forEach(function (t, i) { t.el.hidden = i >= MAXV; c.list.appendChild(t.el); });
      c.n.textContent = String(list.length);
      c.more.textContent = list.length > MAXV ? '+' + (list.length - MAXV) + ' more' : '';
    });
    if (!first) return;
    var moves = [];                                              // every new position first, then the writes: one layout, not one per card
    els.forEach(function (e, i) {
      var a = first[i]; if (!a || e.hidden) return;
      var z = e.getBoundingClientRect(), dx = a.left - z.left, dy = a.top - z.top;
      if (Math.abs(dx) + Math.abs(dy) < 1) return;
      moves.push([e, dx, dy]);
    });
    moves.forEach(function (m) {
      var e = m[0];
      e.style.transition = 'none'; e.style.transform = 'translate(' + m[1].toFixed(1) + 'px,' + m[2].toFixed(1) + 'px)';
      e.classList.add('is-moving');
    });
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      els.forEach(function (e) { if (e.classList.contains('is-moving')) { e.style.transition = ''; e.style.transform = ''; } });
      setTimeout(function () { els.forEach(function (e) { e.classList.remove('is-moving'); }); }, 600);
    }); });
  }
  var dirty = false;
  function go(tk, st, why) {
    tk.st = st; tk.why = why || null; dirty = true;
    if (st === 'done') { tk.closed = sim; closeStats(tk); }
    paintCard(tk);
  }

  // ---------------------------------------------------------------- the desk: people, work and trains
  function worker(tk, w) { tk.who = w; w.tk = tk; }
  function free(tk) { if (tk.who) { tk.who.tk = null; tk.who = null; } }
  function rank(a, b) { return (b.esc - a.esc) || (a.pri - b.pri) || (frac(b) - frac(a)); }
  function assign() {
    team.forEach(function (w) {
      if (w.tk) return;
      var cand = tks.filter(function (t) {
        if (t.who || t.onTrain) return false;
        if (w.con) return t.st === 'new' || t.st === 'tri' || (t.st === 'prog' && t.ty === 'how' && t.work > 0);
        return t.st === 'prog' && t.ty !== 'how' && !t.ready && t.work > 0;
      }).sort(rank);
      var t = cand[0]; if (!t) return;
      worker(t, w);
      if (t.st === 'new') { t.resp = true; t.work = t.hot ? 15 : between(30, 75); go(t, 'tri'); }
      paintCard(t);
    });
    // urgent or escalated work pre-empts a consultant or developer busy with lower-priority work
    tks.filter(function (t) { return !t.who && !t.onTrain && (t.hot || t.esc) && (t.st === 'new' || t.st === 'tri' || (t.st === 'prog' && !t.ready)); }).sort(rank).forEach(function (t) {
      var dev = t.st === 'prog' && t.ty !== 'how';
      var busy = team.filter(function (w) { return (dev ? w.dev : w.con) && w.tk && w.tk.pri >= 3 && !w.tk.esc && !w.tk.hot; });
      if (!busy.length) return;
      var w = busy.sort(function (a, b) { return b.tk.pri - a.tk.pri; })[0], old = w.tk;
      free(old); worker(t, w);
      if (t.st === 'new') { t.resp = true; t.work = t.hot ? 15 : between(30, 75); go(t, 'tri'); }
      paintCard(old); paintCard(t); dirty = true;
      say('Pre-empted', '#' + old.id + ' waits; ' + w.n + ' takes #' + t.id, PRI[1].c);
    });
  }
  function done(tk) {                                            // the current activity has finished
    var w = tk.who; free(tk);
    if (tk.st === 'tri') {
      tk.work = tk.ty === 'how' ? between(30, 90) : tk.ty === 'bug' ? (tk.hot ? between(60, 90) : between(120, 360)) : tk.ty === 'chg' ? between(240, 600) : between(600, 1200);
      if (tk.ty === 'chg') { tk.timer = between(120, 420); go(tk, 'wait', 'scope'); say('Sized', '#' + tk.id + ': estimate sent for your approval', TY.chg.c); }
      else if (tk.ty === 'bug' && tk.info) { tk.info = false; tk.timer = between(60, 180); go(tk, 'wait', 'info'); say('Reproducing', '#' + tk.id + ' needs your steps to reproduce', TY.bug.c); }
      else go(tk, 'prog');
    } else if (tk.st === 'prog') {
      if (tk.ty === 'how') { tk.res = true; tk.timer = between(60, 240); go(tk, 'wait', 'confirm'); say('Answered', '#' + tk.id + ' ' + tk.title.toLowerCase() + ': steps sent', TY.how.c); }
      else { tk.ready = true; paintCard(tk); dirty = true; if (tk.hot) depart(0, [tk], 'Hotfix'); }
    }
    return w;
  }
  function clientDone(tk) {                                      // the client's part (or monitoring) has finished
    if (tk.st === 'wait') {
      if (tk.why === 'confirm') go(tk, 'done');
      else if (tk.why === 'date') { tk.appr = true; paintCard(tk); dirty = true; }
      else go(tk, 'prog');
    } else if (tk.st === 'test') {
      if (tk.ty === 'upg') { tk.timer = between(180, 540); go(tk, 'wait', 'date'); say('Tested', '#' + tk.id + ' passed your tests: pick a go-live date', TY.upg.c); }
      else { tk.appr = true; paintCard(tk); dirty = true; if (tk.hot) depart(1, [tk], 'Hotfix'); }
    } else if (tk.st === 'dep') go(tk, 'done');
  }

  var trains = [], nextStg = STG, nextPrd = PRD;
  function depart(leg, list, hot) {
    if (!list.length) return;
    var el = K.el('span', 'sla-train' + (hot ? ' is-hot' : '') + (leg ? ' is-prd' : ''));
    el.appendChild(K.el('b', null, hot || list.length + (list.length === 1 ? ' fix' : ' fixes')));
    el.appendChild(K.el('small', null, list.map(function (t) { return '#' + t.id; }).join(' ')));
    track.appendChild(el);
    list.forEach(function (t) { t.onTrain = true; paintCard(t); });
    var tr = { leg: leg, list: list, el: el, t0: performance.now(), dur: K.reduce ? 0 : 1500 };
    trains.push(tr);
    say(leg ? 'Released' : 'Deployed to staging', list.map(function (t) { return '#' + t.id; }).join(', ') + (leg ? ' to production' : ' for you to test'), leg ? 'var(--ok)' : 'var(--blue)');
    if (K.reduce) arrive(tr);
  }
  function arrive(tr) {
    tr.list.forEach(function (t) {
      t.onTrain = false;
      if (tr.leg === 0) { t.ready = false; t.timer = t.hot ? 30 : t.ty === 'upg' ? between(540, 1080) : between(120, 420); go(t, 'test'); }
      else { t.appr = false; t.res = true; t.timer = t.hot ? 60 : between(60, 120); go(t, 'dep'); }
    });
    tr.el.remove();
  }
  var trackW = 1;
  function stationX(i) { return trackW * [.13, .5, .87][i]; }
  function moveTrains(now) {
    trains = trains.filter(function (tr) {
      var q = tr.dur ? K.clamp((now - tr.t0) / tr.dur, 0, 1) : 1, e = K.ease.inOut(q);
      var x = K.lerp(stationX(tr.leg), stationX(tr.leg + 1), e);
      tr.el.style.transform = 'translate(' + x.toFixed(1) + 'px,-100%) translateX(-50%)';
      if (q >= 1) { arrive(tr); return false; }
      return true;
    });
  }

  // ---------------------------------------------------------------- arrivals
  var nextArr = 60;
  function arrival() {
    var r = rnd(), ty = r < .4 ? 'bug' : r < .7 ? 'how' : r < .9 ? 'chg' : 'upg';
    var q = rnd(), pri = ty === 'bug' ? (q < .35 ? 2 : q < .85 ? 3 : 4) : ty === 'upg' ? (q < .5 ? 3 : 4) : (q < .6 ? 3 : 4);
    var tk = mk({ ty: ty, pri: pri, title: pickR(TITLES[ty]), info: ty === 'bug' && rnd() < .3 });
    board && cols.new.list.appendChild(tk.el);
    say('New ticket', '#' + tk.id + ' ' + TY[ty].n.toLowerCase() + ', ' + PRI[pri].n.toLowerCase() + ': ' + tk.title, PRI[pri].c);
    dirty = true; paintCard(tk);
  }
  var hotIdx = 0;
  function urgent() {
    var tk = mk({ ty: 'bug', pri: 1, title: TITLES.hot[hotIdx++ % TITLES.hot.length], hot: true });
    cols.new.list.insertBefore(tk.el, cols.new.list.firstChild);
    say('Urgent', '#' + tk.id + ' ' + tk.title + ', respond in ' + PRI[1].rl, PRI[1].c);
    dirty = true; paintCard(tk);
    if (K.reduce) { assign(); layout(false); paintAll(); }
  }

  // ---------------------------------------------------------------- one step of simulated time
  function step(dm) {
    sim += dm;
    if (sim >= nextArr) { arrival(); nextArr = sim + between(80, 200); }
    tks.forEach(function (t) {
      if (t.st === 'done') return;
      if (!t.res && !paused(t)) {
        t.act += dm;
        var f = frac(t);
        if (!t.esc && f >= .75) { t.esc = true; say('Escalated', '#' + t.id + ' to the lead: 75% of its ' + (t.resp ? 'resolve' : 'respond') + ' target used', PRI[2].c); paintCard(t); dirty = true; }
        if (!t.miss && f >= 1) { t.miss = true; say('Target missed', '#' + t.id + ': flagged for the monthly review', PRI[1].c); paintCard(t); }
      }
      if (t.esc && !t.res && !t.onTrain && t.ready && t.st === 'prog') depart(0, [t], t.hot ? 'Hotfix' : 'Expedited');
      else if (t.esc && !t.res && !t.onTrain && t.appr) depart(1, [t], t.hot ? 'Hotfix' : 'Expedited');
      if (t.who) { t.work -= dm; if (t.work <= 0) done(t); }
      else if ((t.st === 'wait' || t.st === 'test' || t.st === 'dep') && !t.appr && !t.onTrain) { t.timer -= dm; if (t.timer <= 0) clientDone(t); }
    });
    assign();
    if (sim >= nextStg) { depart(0, tks.filter(function (t) { return t.ready && !t.onTrain && t.st === 'prog'; })); nextStg += STG; }
    if (sim >= nextPrd) { depart(1, tks.filter(function (t) { return t.appr && !t.onTrain && (t.st === 'test' || t.st === 'wait'); })); nextPrd += PRD; }
    // closed tickets beyond the last few leave the board (they stay in the monthly report)
    var closed = tks.filter(function (t) { return t.st === 'done'; }).sort(function (a, b) { return b.closed - a.closed; });
    closed.slice(6).forEach(function (t) { t.el.remove(); tks.splice(tks.indexOf(t), 1); });
  }

  // ---------------------------------------------------------------- painting
  function paintCard(tk) {
    var e = tk.el, f = frac(tk), P = PRI[tk.pri];
    var state = tk.st === 'done' || tk.res ? (tk.miss ? 'miss' : 'met') : tk.miss ? 'miss' : paused(tk) ? 'pause' : f >= .75 ? 'risk' : 'ok';
    e.dataset.s = state;
    e.classList.toggle('is-queued', !tk.who && (tk.st === 'new' || (tk.st === 'prog' && !tk.ready)));
    e.classList.toggle('is-hot', tk.hot && tk.st !== 'done');
    e.classList.toggle('is-dim', !!filter && tk.pri !== filter);
    tk.whoEl.textContent = tk.who ? tk.who.i : '';
    var b = tk.onTrain ? 'on the train' : tk.ready ? 'fix ready' : tk.appr ? 'approved' : tk.esc && !tk.res ? 'escalated' : tk.hot && tk.st !== 'done' ? 'hotfix' : '';
    tk.badge.textContent = b; tk.badge.className = 'sla-bdg' + (b ? ' is-' + b.split(' ')[0] : '');
    e.setAttribute('aria-label', '#' + tk.id + ', ' + TY[tk.ty].n + ', ' + P.n + ': ' + tk.title + '. ' + STN[tk.st] + (b ? ', ' + b : ''));
    tk._f = -1;
  }
  function paintRings() {
    tks.forEach(function (t) {
      var f = t.st === 'done' || t.res ? 1 : K.clamp(frac(t), 0, 1);
      if (Math.abs(f - t._f) < .004) return;
      t._f = f; t.arc.setAttribute('stroke-dashoffset', (RING * (1 - f)).toFixed(2));
      var st = t.st === 'done' || t.res ? (t.miss ? 'miss' : 'met') : t.miss ? 'miss' : paused(t) ? 'pause' : f >= .75 ? 'risk' : 'ok';
      if (t.el.dataset.s !== st) t.el.dataset.s = st;
    });
  }
  var WD = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  function hhmm(m) { var d = Math.floor(m / DAY), r = m - d * DAY, h = 9 + Math.floor(r / 60), mm = Math.floor(r % 60); return WD[(d + 1) % 5] + ' ' + (h < 10 ? '0' : '') + h + ':' + (mm < 10 ? '0' : '') + mm; }
  function inTime(m) { return m <= 0 ? 'now' : 'in ' + dur(m); }
  var memo = {};
  function set(k, node, v) { if (memo[k] !== v) { memo[k] = v; node.textContent = v; } }
  function paintAll() {
    set('clock', kClock, hhmm(sim));
    team.forEach(function (w, i) { set('w' + i, w.job, w.tk ? '#' + w.tk.id + ' · ' + STN[w.tk.st].toLowerCase() : 'free'); w.el.classList.toggle('is-busy', !!w.tk); });
    [1, 2, 3, 4].forEach(function (p) {
      var open = tks.filter(function (t) { return t.pri === p && t.st !== 'done'; }), risk = open.filter(function (t) { return t.esc && !t.res; }).length;
      set('o' + p, rowsT[p].o, String(open.length)); set('r' + p, rowsT[p].r, String(risk));
      rowsT[p].tr.classList.toggle('is-risk', risk > 0); rowsT[p].tr.classList.toggle('is-dim', !!filter && filter !== p);
    });
    var ready = tks.filter(function (t) { return t.ready && !t.onTrain; }), appr = tks.filter(function (t) { return t.appr && !t.onTrain; });
    var testing = tks.filter(function (t) { return t.st === 'test' && !t.appr; });
    set('q0', qEls[0], ready.length ? ready.length + ' ready · next deploy ' + inTime(nextStg - sim) : 'next deploy ' + inTime(nextStg - sim));
    set('q1', qEls[1], testing.length + ' in your test' + (appr.length ? ' · ' + appr.length + ' approved' : ''));
    set('q2', qEls[2], 'next release window ' + (nextPrd % DAY ? hhmm(nextPrd).slice(4) : '18:00'));
  }

  // ---------------------------------------------------------------- monthly report (sample history, live September)
  var MONTHS = [['Apr', [14, 11, 6, 0]], ['May', [12, 13, 5, 1]], ['Jun', [16, 10, 7, 0]], ['Jul', [11, 12, 8, 2]], ['Aug', [13, 9, 6, 3]], ['Sep', [6, 5, 3, 1]]];
  var TYK = ['bug', 'how', 'chg', 'upg'], live = MONTHS[5][1], met = 15, missed = 0, liveRects = [], liveLab = null, liveMet = null;
  function closeStats(tk) { live[TYK.indexOf(tk.ty)]++; if (tk.miss) missed++; else met++; drawLive(); }
  var CH = { x0: 30, y0: 138, h: 108, max: 45 };
  function drawChart() {
    chart.textContent = '';
    [0, 15, 30, 45].forEach(function (v) {
      var y = CH.y0 - v / CH.max * CH.h;
      chart.appendChild(K.svg('line', { x1: CH.x0, x2: 352, y1: y, y2: y, 'class': 'sla-gl' }));
      var t = K.svg('text', { x: CH.x0 - 6, y: y + 3.5, 'class': 'sla-ax', 'text-anchor': 'end' }); t.textContent = String(v); chart.appendChild(t);
    });
    MONTHS.concat([['Oct', null]]).forEach(function (m, i) {
      var x = CH.x0 + 10 + i * 45, w = 26;
      var lab = K.svg('text', { x: x + w / 2, y: CH.y0 + 14, 'class': 'sla-ax', 'text-anchor': 'middle' }); lab.textContent = m[0]; chart.appendChild(lab);
      if (!m[1]) {                                               // the upgrade path: next month's planned window
        chart.appendChild(K.svg('rect', { x: x, y: CH.y0 - 44, width: w, height: 44, rx: 4, 'class': 'sla-plan' }));
        var p = K.svg('text', { x: x + w / 2, y: CH.y0 - 61, 'class': 'sla-ax is-plan', 'text-anchor': 'middle' }); p.textContent = 'Odoo 20'; chart.appendChild(p);
        var p2 = K.svg('text', { x: x + w / 2, y: CH.y0 - 50, 'class': 'sla-ax is-plan', 'text-anchor': 'middle' }); p2.textContent = 'upgrade'; chart.appendChild(p2);
        return;
      }
      var y = CH.y0, rects = [];
      m[1].forEach(function (v, k) {
        var h = v / CH.max * CH.h, r = K.svg('rect', { x: x, y: (y - h).toFixed(1), width: w, height: Math.max(0, h).toFixed(1), 'class': 'sla-bx', style: 'fill:' + TY[TYK[k]].c });
        chart.appendChild(r); rects.push(r); y -= h;
      });
      var tot = K.svg('text', { x: x + w / 2, y: (y - 5).toFixed(1), 'class': 'sla-tot', 'text-anchor': 'middle' }); tot.textContent = String(m[1].reduce(function (a, b) { return a + b; }, 0));
      chart.appendChild(tot);
      if (i === 5) { liveRects = rects; liveLab = tot; lab.setAttribute('class', 'sla-ax is-live'); }
    });
    liveMet = K.svg('text', { x: 352, y: 16, 'class': 'sla-met', 'text-anchor': 'end' }); chart.appendChild(liveMet);
    drawLive();
  }
  function drawLive() {
    if (!liveRects.length) return;
    var y = CH.y0;
    live.forEach(function (v, k) { var h = v / CH.max * CH.h; liveRects[k].setAttribute('y', (y - h).toFixed(1)); liveRects[k].setAttribute('height', h.toFixed(1)); y -= h; });
    var tot = live.reduce(function (a, b) { return a + b; }, 0);
    liveLab.textContent = String(tot); liveLab.setAttribute('y', (y - 5).toFixed(1));
    liveMet.textContent = 'September so far: ' + met + ' of ' + (met + missed) + ' within target';
  }

  // ---------------------------------------------------------------- log
  function say(b, rest, c) {
    var li = K.log(logEl, '<i></i><span></span>', null, 5), sp = li.lastChild;
    sp.appendChild(K.el('b', null, b)); sp.appendChild(document.createTextNode(' · ' + rest));
    li.style.setProperty('--c', c);
  }

  // ---------------------------------------------------------------- controls
  K.$$('[data-f]', root).forEach(function (btn, i) {
    btn.addEventListener('click', function () {
      filter = i;                                                // the buttons are in priority order: All, 1, 2, 3, 4
      K.$$('[data-f]', root).forEach(function (x, j) { x.setAttribute('aria-pressed', String(j === i)); });
      tks.forEach(paintCard); paintRings(); paintAll();
    });
  });
  var hosts = K.$$('[data-host]', root);
  hosts.forEach(function (btn, i) {
    btn.addEventListener('click', function () {
      var h = i ? HOST.own : HOST.sh;
      hosts.forEach(function (x, j) { x.setAttribute('aria-pressed', String(j === i)); });
      subs.forEach(function (s, k) { s.textContent = h[k]; });
      root.classList.toggle('is-own', !!i);
    });
  });
  K.$('[data-urgent]', root).addEventListener('click', function () { urgent(); if (!K.reduce) loop.on(); });

  // ---------------------------------------------------------------- start state: a desk mid-morning
  [[1036, 'how', 3, 'Add a pricelist', 'done'], [1037, 'bug', 2, 'Report total is off', 'done'], [1038, 'chg', 3, 'Extra sales report', 'done'],
   [1039, 'bug', 3, 'Barcode scan fails', 'dep', { act: 700, timer: 50 }], [1040, 'upg', 3, 'Upgrade to Odoo 20', 'test', { act: 900, timer: 420 }],
   [1041, 'bug', 2, 'Portal login loops', 'test', { act: 290, appr: true }], [1042, 'chg', 3, 'PO approval step', 'wait', { act: 200, timer: 170, why: 'scope' }],
   [1043, 'how', 3, 'Split a payment', 'wait', { act: 110, timer: 90, why: 'confirm' }], [1044, 'bug', 3, 'Count won’t post', 'prog', { act: 610, ready: true }],
   [1045, 'chg', 3, 'New field on quotes', 'prog', { act: 380, work: 210, who: 2 }], [1046, 'bug', 2, 'Payslip rule error', 'prog', { act: 230, work: 120, who: 3 }],
   [1047, 'how', 4, 'Archive products', 'prog', { act: 60, work: 40, who: 1 }], [1048, 'bug', 2, 'Bank sync stopped', 'tri', { act: 40, work: 25, who: 0 }],
   [1049, 'how', 3, 'Add a new user', 'new', { act: 25 }], [1050, 'bug', 3, 'Invoice PDF layout', 'new', { act: 5 }]].forEach(function (s, i) {
    var o = s[5] || {};
    var tk = mk({ id: s[0], ty: s[1], pri: s[2], title: s[3], st: s[4], act: o.act, work: o.work, timer: o.timer, ready: o.ready, appr: o.appr, why: o.why });
    if (o.who != null) worker(tk, team[o.who]);
    if (tk.st === 'done') tk.closed = i;
    paintCard(tk);
  });
  layout(false); paintRings(); paintAll(); drawChart();
  say('Desk open', 'sample tickets from a normal morning', 'var(--blue)');

  function size() { trackW = track.offsetWidth || 1; }
  var loop = K.loop(function (now, dt) {
    step(dt * SPEED);
    moveTrains(now);
    if (dirty) { dirty = false; layout(true); }
    paintRings(); paintAll();
  });
  window.addEventListener('resize', size);
  size();
  return {
    start: function () { size(); loop.on(); },
    stop: function () { loop.off(); }
  };
});
