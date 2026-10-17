/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* Health and wellness page demo: a studio's week. A class timetable with capacity and waitlists
   (click to book as the sample client), memberships as subscriptions that renew, upgrade or churn,
   a monthly recurring revenue breakdown with a "new members campaign" scenario, 1:1 appointments
   paid up front, and retail sold at the front desk, all on one client record. Sample data only. */
TN.demo('studio', function (root, K) {
  var grid = K.$('.wsd-tt', root), rec = K.$('.wsd-docs', root), bk = K.$('.wsd-bk', root), apL = K.$('.wsd-ap', root), posL = K.$('.wsd-pos', root);
  var chart = K.$('.wsd-mrr', root), logL = K.$('.wsd-log', root), campB = K.$('[data-camp]', root), fB = K.$$('[data-f]', root);
  var kEl = {}; K.$$('[data-k]', root).forEach(function (el) { kEl[el.dataset.k] = el; });
  var body = K.$('.wsd-body', root), tip = K.tip(body);
  function sg(v, d) { return 'S$ ' + v.toLocaleString('en-SG', { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 }); }

  // ---------------------------------------------------------------- sample studio
  var DAYS = ['Mon 12', 'Tue 13', 'Wed 14', 'Thu 15', 'Fri 16', 'Sat 17', 'Sun 18'], TIMES = ['07:00', '09:30', '12:15', '18:30', '19:45'];
  var TYPE = { yoga: 'Yoga', pil: 'Pilates', hiit: 'HIIT', spin: 'Spin' };
  // [day, time row, type, name, instructor, capacity, booked, waitlist]
  var CL0 = [
    [0, 0, 'yoga', 'Yoga Flow', 'Mei', 20, 20, 2], [0, 2, 'pil', 'Mat Pilates', 'Sofia', 14, 11, 0], [0, 3, 'hiit', 'HIIT 45', 'Arjun', 16, 16, 3], [0, 4, 'yoga', 'Yin Yoga', 'Mei', 18, 9, 0],
    [1, 0, 'spin', 'Spin 45', 'Daniel', 18, 14, 0], [1, 3, 'pil', 'Reformer', 'Sofia', 10, 10, 4], [1, 4, 'yoga', 'Yoga Flow', 'Mei', 20, 15, 0],
    [2, 0, 'hiit', 'HIIT 45', 'Arjun', 16, 12, 0], [2, 2, 'yoga', 'Yoga Flow', 'Mei', 20, 8, 0], [2, 3, 'spin', 'Spin 45', 'Daniel', 18, 18, 1],
    [3, 0, 'pil', 'Reformer', 'Sofia', 10, 10, 2], [3, 3, 'hiit', 'HIIT 45', 'Arjun', 16, 13, 0], [3, 4, 'yoga', 'Yin Yoga', 'Mei', 18, 12, 0],
    [4, 0, 'yoga', 'Yoga Flow', 'Mei', 20, 16, 0], [4, 3, 'spin', 'Spin 45', 'Daniel', 18, 10, 0],
    [5, 0, 'spin', 'Spin 45', 'Daniel', 18, 15, 0], [5, 1, 'pil', 'Reformer', 'Sofia', 10, 10, 5], [5, 2, 'hiit', 'HIIT 45', 'Arjun', 16, 11, 0],
    [6, 1, 'yoga', 'Yoga Flow', 'Mei', 20, 20, 3], [6, 2, 'yoga', 'Yin Yoga', 'Mei', 18, 7, 0]
  ];
  var AP0 = [['Massage · 60 min', 'Thu 15 Oct, 2:00 pm', 120], ['Private yoga · 60 min', 'Fri 16 Oct, 10:00 am', 110], ['Massage · 60 min', 'Sat 17 Oct, 4:00 pm', 120]];
  var POS0 = [['Mat towel', 28, 14], ['Grip socks', 18, 22], ['Water bottle', 22, 9], ['Yoga mat', 68, 6]];
  var PLANS = { un: ['Unlimited monthly', 199], p8: ['8 classes monthly', 139], an: ['Annual unlimited', 1990 / 12] };
  var MONTHS = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
  var NEW = [3.2, 2.8, 3.9, 3.1, 2.9, 3.4, 3.0, 2.7, 3.3, 3.6, 3.2, 2.9], EXP = [.6, .5, .7, .6, .5, .8, .6, .5, .7, .6, .7, .5], CHURN = [2.4, 2.9, 2.6, 2.2, 2.5, 2.3, 2.8, 2.6, 2.4, 2.7, 2.5, 2.2];
  var PROJ = { base: [[3.0, .6, 2.5], [2.6, .5, 2.8], [3.4, .6, 2.6]], camp: [[7.2, .6, 2.5], [3.4, 3.1, 4.1], [3.6, .7, 3.0]] };
  var MRR0 = 53.28 - NEW.reduce(function (a, b) { return a + b; }) - EXP.reduce(function (a, b) { return a + b; }) + CHURN.reduce(function (a, b) { return a + b; });
  var NAMES = ['Aisha', 'Ben', 'Chloe', 'Dev', 'Elena', 'Farid', 'Grace', 'Hiro', 'Ivy', 'Jonas', 'Kavya', 'Liam', 'Maya', 'Noor', 'Omar', 'Priya'];

  var S, filter = 'all', camp = false, vis = false;
  function fresh() {
    return { cl: CL0.map(function (c, i) { return { i: i, d: c[0], r: c[1], t: c[2], n: c[3], who: c[4], cap: c[5], b: c[6], w: c[7], me: 0, mw: 0 }; }),
             ap: AP0.map(function (a) { return { n: a[0], at: a[1], p: a[2], done: false }; }), pos: POS0.map(function (p) { return { n: p[0], p: p[1], q: p[2] }; }),
             docs: [['INV/2026/01842', 'Membership renewal · Unlimited monthly', 199, 'Paid by saved card · 12 Oct']], seq: { inv: 1901, pos: 212, sub: 431 },
             mem: 312, mrr: 53.28, ren: 94, churn: 7, nw: 0, oct: [NEW[11], EXP[11], CHURN[11]], t: 0, nextB: 1.2, nextS: 2 };
  }

  // ---------------------------------------------------------------- timetable
  var cells = [];
  function buildGrid() {
    grid.textContent = '';
    grid.appendChild(K.el('span', 'wsd-corner'));
    DAYS.forEach(function (d) { grid.appendChild(K.el('span', 'wsd-dh', d + ' Oct')); });
    TIMES.forEach(function (tm, r) {
      grid.appendChild(K.el('span', 'wsd-th', tm));
      for (var d = 0; d < 7; d++) {
        var c = S.cl.filter(function (x) { return x.d === d && x.r === r; })[0];
        if (!c) { grid.appendChild(K.el('span', 'wsd-free')); continue; }
        grid.appendChild(cellEl(c));
      }
    });
  }
  function cellEl(c) {
    var b = K.el('button', 'wsd-c wsd-t-' + c.t); b.type = 'button';
    b.appendChild(K.el('b', null, c.n)); b.appendChild(K.el('small', null, c.who));
    var m = K.el('i', 'wsd-fill'), f = K.el('i'); m.appendChild(f); b.appendChild(m);
    c.lab = K.el('em'); b.appendChild(c.lab); c.fill = f; c.el = b;
    b.addEventListener('click', function () { tapClass(c); });
    b.addEventListener('pointerenter', function () { showTip(c); }); b.addEventListener('pointerleave', function () { tip.hide(); });
    b.addEventListener('focus', function () { showTip(c); }); b.addEventListener('blur', function () { tip.hide(); });
    paintC(c); return b;
  }
  function showTip(c) {
    var bx = K.box(c.el, body);
    tip.show([c.n + ' · ' + DAYS[c.d] + ' Oct, ' + TIMES[c.r], 'With ' + c.who + ' · ' + c.b + ' of ' + c.cap + ' booked' + (c.w ? ' · ' + c.w + ' waiting' : ''),
              c.me ? 'Jamie is booked: press to cancel' : c.mw ? 'Jamie is number ' + c.mw + ' on the waitlist: press to leave it' : c.b < c.cap ? 'Press to book Jamie a place' : 'Full: press to join the waitlist'], bx.cx, bx.y);
  }
  function paintC(c) {
    c.fill.style.transform = 'scaleX(' + (c.b / c.cap).toFixed(3) + ')';
    c.lab.textContent = c.b + '/' + c.cap + (c.w ? ' · ' + c.w + ' waiting' : '');
    c.el.classList.toggle('is-full', c.b >= c.cap); c.el.classList.toggle('is-me', !!c.me); c.el.classList.toggle('is-mw', !!c.mw);
    c.el.classList.toggle('is-dim', filter !== 'all' && c.t !== filter);
    c.el.setAttribute('aria-pressed', String(!!c.me));
    c.el.setAttribute('aria-label', c.n + ', ' + DAYS[c.d] + ' October ' + TIMES[c.r] + ', ' + c.b + ' of ' + c.cap + ' booked' + (c.w ? ', ' + c.w + ' on the waitlist' : '') + (c.me ? '. Jamie is booked' : c.mw ? '. Jamie is on the waitlist' : ''));
    if (!K.reduce) K.restart(c.el, 'is-tick');
  }
  function when(c) { return c.n + ' · ' + DAYS[c.d].slice(0, 3) + ' ' + TIMES[c.r]; }
  function tapClass(c) {
    if (c.me) {                                                  // cancel, and the first on the waitlist gets the place
      c.me = 0; c.b--; log('var(--muted)', 'Cancelled', when(c) + ' · Jamie\'s place released');
      if (c.w) { c.w--; c.b++; log('var(--tok-pay)', 'Waitlist', when(c) + ': ' + K.pick(NAMES) + ' moves up and is booked'); }
    } else if (c.mw) { c.w--; c.mw = 0; log('var(--muted)', 'Waitlist', 'Jamie left the list for ' + when(c)); }
    else if (c.b < c.cap) { c.b++; c.me = 1; log('var(--tok-stock)', 'Booked', when(c) + ' · confirmation sent, reminder the day before'); }
    else { c.w++; c.mw = c.w; log('var(--tok-buy)', 'Waitlist', 'Jamie is number ' + c.mw + ' for ' + when(c)); }
    paintC(c); showTip(c); paintRec();
  }
  function other() {                                             // other clients book and cancel in the background
    var open = S.cl.filter(function (c) { return !c.me; }), c = K.pick(open);
    if (Math.random() < (camp ? .8 : .66)) {
      if (c.b < c.cap) { c.b++; if (c.b === c.cap) log('var(--tok-buy)', 'Full', when(c) + ': the next booking joins the waitlist'); }
      else c.w++;
    } else if (c.b > 0) {
      c.b--;
      if (c.w) {
        c.w--; c.b++;
        if (c.mw === 1) { c.mw = 0; c.me = 1; log('var(--tok-pay)', 'Waitlist', 'A place opened in ' + when(c) + ': Jamie is booked and notified'); }
        else { if (c.mw) c.mw--; log('var(--tok-pay)', 'Waitlist', when(c) + ': ' + K.pick(NAMES) + ' moves up and is booked'); }
      }
    }
    if (c.mw > c.w) c.mw = c.w;
    paintC(c); paintRec();
  }

  // ---------------------------------------------------------------- the client record: bookings, 1:1 sessions, retail, invoices
  function paintRec() {
    bk.textContent = '';
    S.cl.filter(function (c) { return c.me || c.mw; }).forEach(function (c) {
      var li = K.el('li', c.me ? 'is-me' : 'is-mw'); li.style.setProperty('--c', 'var(--wsd-' + c.t + ')');
      li.appendChild(K.el('span', null, when(c))); li.appendChild(K.el('em', null, c.me ? 'Booked' : 'Waitlist #' + c.mw)); bk.appendChild(li);
    });
    if (!bk.firstChild) bk.appendChild(K.el('li', 'is-empty', 'No classes booked this week'));
    rec.textContent = '';
    S.docs.slice(-4).reverse().forEach(function (d) {
      var li = K.el('li'); li.appendChild(K.el('b', null, d[0])); li.appendChild(K.el('span', null, d[1])); li.appendChild(K.el('em', null, sg(d[2], 2))); li.appendChild(K.el('small', null, d[3])); rec.appendChild(li);
    });
    var tot = S.docs.reduce(function (t, d) { return t + d[2]; }, 0);
    kEl.spent.textContent = sg(tot, 2);
  }
  function buildSide() {
    apL.textContent = '';
    S.ap.forEach(function (a) {
      var b = K.el('button', 'wsd-slot'); b.type = 'button';
      b.appendChild(K.el('b', null, a.n)); b.appendChild(K.el('span', null, a.at)); var st = K.el('em', null, sg(a.p)); b.appendChild(st);
      b.addEventListener('click', function () {
        if (a.done) return;
        a.done = true; b.disabled = true; b.classList.add('is-done'); st.textContent = 'Booked';
        var inv = 'INV/2026/0' + (S.seq.inv++);
        S.docs.push([inv, a.n + ' · ' + a.at.split(',')[0], a.p, 'Paid up front online']);
        log('var(--tok-make)', 'Appointment', a.n + ' booked for ' + a.at + ': ' + inv + ' paid at booking');
        paintRec();
      });
      apL.appendChild(b);
    });
    posL.textContent = '';
    S.pos.forEach(function (p) {
      var b = K.el('button', 'wsd-prod'); b.type = 'button';
      b.appendChild(K.el('b', null, p.n)); b.appendChild(K.el('em', null, sg(p.p))); var q = K.el('small', null, p.q + ' in stock'); b.appendChild(q);
      b.addEventListener('click', function () {
        if (!p.q) return;
        p.q--; q.textContent = p.q ? p.q + ' in stock' : 'Out of stock'; if (!p.q) { b.disabled = true; }
        var ref = 'Shop/0' + (S.seq.pos++);
        S.docs.push([ref, 'Front desk · ' + p.n, p.p, 'Point of Sale · stock updated']);
        log('var(--tok-buy)', 'Point of Sale', ref + ': ' + p.n + ' ' + sg(p.p) + ' on Jamie\'s record, ' + p.q + ' left');
        if (!K.reduce) K.restart(b, 'is-tick');
        paintRec();
      });
      posL.appendChild(b);
    });
  }

  // ---------------------------------------------------------------- memberships: renewals, upgrades, churn and the MRR breakdown
  function subEvent() {
    var r = Math.random(), sub = 'SUB/2026/0' + (S.seq.sub++), plan = K.pick(['un', 'un', 'p8', 'an']), pr = PLANS[plan];
    if (r < (camp ? .34 : .16)) {
      var intro = camp && Math.random() < .7, v = intro ? 99 : pr[1];
      S.mem++; S.nw++; S.oct[0] += v / 1000; S.mrr += v / 1000;
      log('var(--ok)', 'New member', sub + ' · ' + (intro ? 'intro month S$ 99, then Unlimited monthly' : pr[0] + ' · +' + sg(v) + ' MRR'));
    } else if (r < (camp ? .44 : .28)) {
      S.oct[1] += .06; S.mrr += .06;
      log('var(--tok-stock)', 'Upgrade', sub + ' · 8 classes to Unlimited monthly · +S$ 60 MRR');
    } else if (r < (camp ? .54 : .38)) {
      S.mem--; S.churn++; S.oct[2] += pr[1] / 1000; S.mrr -= pr[1] / 1000;
      log('var(--tok-late)', 'Closed', sub + ' · ' + pr[0] + ' · reason: ' + K.pick(['moving away', 'price', 'schedule changed', 'injury break']) + ' · −' + sg(pr[1]) + ' MRR');
    } else {
      S.ren++;
      log('var(--tok-pay)', 'Renewed', sub + ' · ' + pr[0] + ' · INV/2026/0' + (S.seq.inv++) + ' paid by saved card');
    }
    paintK(); drawMRR();
  }
  function paintK() {
    kEl.mem.textContent = S.mem.toLocaleString('en-SG');
    kEl.mrr.textContent = 'S$ ' + S.mrr.toFixed(1) + 'k';
    kEl.ren.textContent = String(S.ren);
    kEl.churn.textContent = (S.churn / 312 * 100).toFixed(1) + '%';
  }
  var cW = 560;
  function drawMRR() {
    var W = cW, H = 210, pl = 34, pr = 8, top = 12, split = 112, bot = 20;
    var rows = NEW.map(function (n, i) { return [n, EXP[i], CHURN[i]]; });
    rows[11] = S.oct.slice();
    PROJ[camp ? 'camp' : 'base'].forEach(function (p) { rows.push(p); });
    var mrr = [], m = MRR0;
    rows.forEach(function (r, i) { m += r[0] + r[1] - r[2]; if (i === 11) m = S.mrr; mrr.push(m); });
    var lo = Math.floor(Math.min.apply(null, mrr) / 5) * 5 - 5, hi = Math.ceil(Math.max.apply(null, mrr) / 5) * 5;
    var n = rows.length, bw = (W - pl - pr) / n;
    function X(i) { return pl + bw * i + bw / 2; }
    function Y1(v) { return top + (hi - v) / (hi - lo) * (split - top - 10); }
    var mv = 8, y0 = split + 10 + (H - bot - split - 10) * (mv / (mv + 5));
    function Y2(v) { return y0 - v / (mv + 5) * (H - bot - split - 10); }
    chart.setAttribute('viewBox', '0 0 ' + W + ' ' + H); chart.textContent = '';
    [lo, (lo + hi) / 2, hi].forEach(function (v) {
      chart.appendChild(K.svg('line', { x1: pl, x2: W - pr, y1: Y1(v), y2: Y1(v), 'class': 'wsd-gl' }));
      var t = K.svg('text', { x: pl - 5, y: Y1(v) + 3, 'class': 'wsd-ax', 'text-anchor': 'end' }); t.textContent = v.toFixed(0) + 'k'; chart.appendChild(t);
    });
    chart.appendChild(K.svg('rect', { x: X(12) - bw / 2, y: top - 6, width: bw * 3, height: H - bot - top + 6, 'class': 'wsd-proj' }));
    var pt = K.svg('text', { x: X(13), y: split + 6, 'class': 'wsd-pt', 'text-anchor': 'middle' }); pt.textContent = camp ? 'scenario: campaign' : 'scenario: as now'; chart.appendChild(pt);
    chart.appendChild(K.svg('line', { x1: pl, x2: W - pr, y1: y0, y2: y0, 'class': 'wsd-zero' }));
    rows.forEach(function (r, i) {
      var x = X(i) - bw * .3, w = bw * .6, f = i > 11 ? ' is-f' : '';
      chart.appendChild(K.svg('rect', { x: x, y: Y2(r[0]), width: w, height: Y2(0) - Y2(r[0]), 'class': 'wsd-new' + f, rx: 1.5 }));
      chart.appendChild(K.svg('rect', { x: x, y: Y2(r[0] + r[1]), width: w, height: Y2(r[0]) - Y2(r[0] + r[1]), 'class': 'wsd-exp' + f, rx: 1.5 }));
      chart.appendChild(K.svg('rect', { x: x, y: y0, width: w, height: Math.max(0, Y2(-r[2]) - y0), 'class': 'wsd-chu' + f, rx: 1.5 }));
      var t = K.svg('text', { x: X(i), y: H - 5, 'class': 'wsd-ax' + (i === 11 ? ' is-now' : ''), 'text-anchor': 'middle' }); t.textContent = MONTHS[i]; chart.appendChild(t);
    });
    var d = '', a = '';
    mrr.forEach(function (v, i) { d += (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y1(v).toFixed(1); });
    a = d + 'L' + X(n - 1).toFixed(1) + ' ' + (split - 10) + 'L' + X(0).toFixed(1) + ' ' + (split - 10) + 'Z';
    chart.appendChild(K.svg('path', { d: a, 'class': 'wsd-area' }));
    chart.appendChild(K.svg('path', { d: d, 'class': 'wsd-line' }));
    mrr.forEach(function (v, i) { if (i === 11 || i === n - 1) { chart.appendChild(K.svg('circle', { cx: X(i), cy: Y1(v), r: 3.5, 'class': 'wsd-dot' + (i > 11 ? ' is-f' : '') })); var t = K.svg('text', { x: X(i), y: Y1(v) - 8, 'class': 'wsd-lv', 'text-anchor': 'middle' }); t.textContent = 'S$ ' + v.toFixed(1) + 'k'; chart.appendChild(t); } });
  }

  // ---------------------------------------------------------------- log, clock, controls
  function log(c, bold, rest) {
    var li = K.el('li'); li.style.setProperty('--c', c); li.appendChild(K.el('i'));
    var s = K.el('span'); s.appendChild(K.el('b', null, bold)); s.appendChild(document.createTextNode(' ' + rest)); li.appendChild(s);
    logL.insertBefore(li, logL.firstChild);
    var all = K.$$('li', logL); while (all.length > 4) all.pop().remove();
  }
  var loop = K.loop(function (now, dt) {
    S.t += dt;
    if (S.t >= S.nextB) { S.nextB = S.t + (camp ? .9 : 1.6) * K.rnd(.6, 1.4); other(); }
    if (S.t >= S.nextS) { S.nextS = S.t + (camp ? 1.8 : 2.6) * K.rnd(.7, 1.3); subEvent(); }
  });
  fB.forEach(function (b) {
    b.addEventListener('click', function () {
      filter = b.dataset.f;
      fB.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      S.cl.forEach(function (c) { c.el.classList.toggle('is-dim', filter !== 'all' && c.t !== filter); });
    });
  });
  campB.addEventListener('click', function () {
    camp = !camp; campB.setAttribute('aria-pressed', String(camp)); root.classList.toggle('is-camp', camp);
    log(camp ? 'var(--ok)' : 'var(--muted)', 'Campaign', camp ? 'intro month at S$ 99 for new members: more sign-ups and fuller classes, and some leave after the intro month' : 'switched off: back to the usual month');
    drawMRR();
    if (K.reduce && camp) { for (var i = 0; i < 6; i++) { other(); subEvent(); } }
  });
  function reset() {
    S = fresh(); logL.textContent = '';
    S.cl[6].me = 1; S.cl[6].b++; S.cl[16].w++; S.cl[16].mw = S.cl[16].w;       // Jamie: booked on Tuesday, waitlisted on Saturday
    buildGrid(); buildSide(); paintRec(); paintK(); drawMRR();
  }
  K.$('[data-reset]', root).addEventListener('click', function () { reset(); });
  function size() { var w = chart.getBoundingClientRect().width; if (w) cW = Math.round(w); }   // the svg's own width, 1:1
  var rz = 0;
  window.addEventListener('resize', function () { if (rz) return; rz = requestAnimationFrame(function () { rz = 0; size(); drawMRR(); }); });
  size(); reset();
  if (K.reduce) for (var i = 0; i < 8; i++) { other(); subEvent(); }
  return {
    start: function () { vis = true; size(); drawMRR(); loop.on(); },
    stop: function () { vis = false; loop.off(); }
  };
});
