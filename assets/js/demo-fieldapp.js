/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* App development page: a field technician's app on iOS, Android or the web walks through one job (pick the
   job, check in, checklist, photos, the customer's signature, done) and every step lands on the Field Service
   job in Odoo as it happens: a packet travels from the phone, the field fills and the chatter logs it. Tap a
   step to jump; switch the platform or the job. */
TN.demo('fieldapp', function (root, K) {
  var phone = K.$('.fap-phone', root), view = K.$('[data-view]', root), title = K.$('[data-app-title]', root), sub = K.$('[data-app-sub]', root);
  var wrap = K.$('.fap-wrap', root), wires = K.$('.fap-wires', root), odoo = K.$('.fap-odoo', root), logEl = K.$('.fap-log', root), ref = K.$('[data-ref]', root);
  var play = K.$('[data-play]', root), playTxt = K.$('[data-play] span', root), RAIL = K.$$('[data-step]', root);
  var F = {}; K.$$('[data-f]', root).forEach(function (n) { F[n.dataset.f] = n; });
  var KP = {}; K.$$('[data-k]', root).forEach(function (n) { KP[n.dataset.k] = n; });
  var JOBS = {
    aircon: { title: 'Aircon service', where: 'Tampines · 2 units', cust: 'M. Lim', mins: 45, amt: 180, ref: 'FS/2026/0418',
      list: ['Check and wash the filters', 'Clean the coil', 'Test the drain line', 'Check the gas pressure'] },
    install: { title: 'Installation', where: 'Bedok · new unit', cust: 'R. Chua', mins: 95, amt: 420, ref: 'FS/2026/0421',
      list: ['Unbox and inspect', 'Mount the unit', 'Connect and test', 'Walk the customer through it'] },
    delivery: { title: 'Delivery', where: 'Jurong East · 4 boxes', cust: 'S. Nair', mins: 20, amt: 60, ref: 'FS/2026/0425',
      list: ['Load checked against the order', 'Delivered to the site', 'Customer inspected the goods', 'Packaging taken back'] }
  };
  var OTHER = [['11:30', 'Filter replacement', 'Bedok'], ['14:00', 'Inspection', 'Jurong East']];
  var job = 'aircon', pf = 'ios', step = 0, paused = false, visible = false, timers = [], auto = 0, packets = [], track = null;

  function J() { return JOBS[job]; }
  function clock(m) { var h = 9 + Math.floor(m / 60), mm = m % 60; return (h < 10 ? '0' : '') + h + ':' + (mm < 10 ? '0' : '') + mm; }
  function at() {                                   // minutes after 09:00 when each step finishes
    var m = J().mins, t2 = 2 + Math.round(m * .45), t3 = t2 + Math.round(m * .2), t4 = t3 + Math.round(m * .25);
    return [0, 2, t2, t3, t4, 2 + m];
  }
  function hm(m) { return Math.floor(m / 60) + ':' + ('0' + m % 60).slice(-2) + ' h'; }
  function later(f, ms) { timers.push(setTimeout(f, ms)); }
  function clear() { timers.forEach(clearTimeout); timers = []; }

  // ---------------------------------------------------------------- the phone screens
  function screen(s, instant) {
    var j = J(), T = at(); view.textContent = ''; view.className = 'fap-view fap-v' + s;
    title.textContent = ["Today's jobs", j.title, 'Checklist', 'Photos', 'Customer signature', j.title][s];
    sub.textContent = ['3 jobs', j.where, '', '3 photos', j.cust, j.where][s];
    if (s === 0) {
      [['09:00', j.title, j.where]].concat(OTHER).forEach(function (r, k) {
        var c = view.appendChild(K.el('div', 'fap-job' + (k ? '' : ' is-next')));
        c.appendChild(K.el('i', null, r[0])); var tx = c.appendChild(K.el('span')); tx.appendChild(K.el('b', null, r[1])); tx.appendChild(K.el('small', null, r[2]));
        if (!k) c.appendChild(K.el('em', null, 'Next'));
      });
    } else if (s === 1) {
      var map = view.appendChild(K.el('div', 'fap-map')); map.appendChild(K.el('i', 'fap-pin'));
      var ok = view.appendChild(K.el('p', 'fap-okline')); ok.appendChild(K.el('b', null, 'Checked in ' + clock(T[1]))); ok.appendChild(K.el('small', null, 'Location confirmed at the customer'));
    } else if (s === 2) {
      var ul = view.appendChild(K.el('ul', 'fap-list'));
      j.list.forEach(function (txt, k) {
        var li = ul.appendChild(K.el('li')); li.appendChild(K.el('i')); li.appendChild(K.el('span', null, txt));
        if (instant) li.classList.add('is-done'); else later(function () { li.classList.add('is-done'); sub.textContent = (k + 1) + ' of 4 done'; }, 260 + k * 330);
      });
      sub.textContent = instant ? '4 of 4 done' : '0 of 4 done';
    } else if (s === 3) {
      var g = view.appendChild(K.el('div', 'fap-shots'));
      ['Before', 'During', 'After'].forEach(function (lb, k) {
        var p = g.appendChild(K.el('figure', 'fap-shot fap-shot' + k)); p.appendChild(K.el('figcaption', null, lb));
        if (instant) p.classList.add('is-in'); else later(function () { p.classList.add('is-in'); }, 200 + k * 300);
      });
    } else if (s === 4) {
      var pad = view.appendChild(K.el('div', 'fap-pad'));
      pad.innerHTML = '<svg viewBox="0 0 200 64" aria-hidden="true"><path d="M8 44 C 18 18, 30 16, 34 38 S 52 54, 60 32 S 74 8, 82 32 S 96 52, 108 30 C 116 14, 126 18, 128 36 C 130 46, 140 44, 150 32 C 158 24, 170 26, 192 28"/></svg><i class="fap-wipe"></i>';
      pad.appendChild(K.el('small', null, j.cust + ' · ' + clock(T[4])));
      if (instant) pad.classList.add('is-signed'); else later(function () { pad.classList.add('is-signed'); }, 120);
    } else {
      var d = view.appendChild(K.el('div', 'fap-done')); d.appendChild(K.el('i'));
      d.appendChild(K.el('b', null, 'Job complete')); d.appendChild(K.el('small', null, j.mins + ' min on site · S$ ' + j.amt + ' to invoice'));
      var sy = view.appendChild(K.el('p', 'fap-sync')); sy.appendChild(K.el('span', null, 'Synced to Odoo'));
    }
    RAIL.forEach(function (b, k) { b.classList.toggle('is-done', k < s); b.classList.toggle('is-on', k === s); b.setAttribute('aria-current', k === s ? 'step' : 'false'); });
  }

  // ---------------------------------------------------------------- the Odoo record
  var BLANK = { status: 'Scheduled', checkin: '–', checklist: '0 of 4', photos: '–', sign: '–', time: '–', invoice: '–' };
  function fields(s) {
    var j = J(), T = at(), v = Object.assign({}, BLANK);
    if (s >= 1) { v.status = 'In progress'; v.checkin = clock(T[1]) + ' · on site'; }
    if (s >= 2) v.checklist = '4 of 4';
    if (s >= 3) v.photos = '3 attached';
    if (s >= 4) v.sign = 'Signed · ' + j.cust;
    if (s >= 5) { v.status = 'Done'; v.time = hm(j.mins); v.invoice = 'Draft · S$ ' + j.amt; }
    return v;
  }
  function paint(s, flash) {
    var v = fields(s), n = 0;
    Object.keys(F).forEach(function (k) {
      var dd = K.$('dd', F[k]), changed = dd.textContent !== v[k];
      dd.textContent = v[k];
      F[k].classList.toggle('is-set', v[k] !== BLANK[k]); if (v[k] !== BLANK[k]) n++;
      F[k].classList.toggle('is-done', k === 'status' && v[k] === 'Done');
      if (changed && flash) K.restart(F[k], 'is-new');
    });
    var T = at();
    K.count(KP.steps, s, flash ? 260 : 0); K.count(KP.fields, n, flash ? 260 : 0); K.count(KP.mins, s >= 1 ? T[s] - 2 : 0, flash ? 260 : 0);
    KP.retype.textContent = '0';
  }
  var LOG = [null, function (j, T) { return 'Check-in saved'; }, function () { return 'Checklist complete, 4 of 4'; },
    function () { return '3 photos attached'; }, function (j) { return 'Signature saved · ' + j.cust; },
    function (j) { return 'Job done · timesheet ' + hm(j.mins) + ' · invoice drafted'; }];
  function say(s) {
    var j = J(), T = at();
    K.log(logEl, '<i style="--c:' + (s === 5 ? '#137A4A' : '#714B67') + '"></i><span><b>' + clock(T[s]) + '</b> ' + LOG[s](j, T) + '</span>', null, 3);
  }

  // ---------------------------------------------------------------- the wire between phone and Odoo, and its packets
  function layWire() {
    if (getComputedStyle(wires).display === 'none') { track = null; return; }
    var w = wrap.offsetWidth, h = wrap.offsetHeight; wires.setAttribute('viewBox', '0 0 ' + w + ' ' + h); wires.textContent = '';
    var a = K.box(phone, wrap), b = K.box(odoo, wrap);
    var p0 = [a.r + 4, a.y + a.h * .42], p1 = [b.x - 4, b.y + Math.min(b.h * .3, 110)];
    var d = K.curve(p0, p1, .55);
    wires.appendChild(K.svg('path', { d: d, 'class': 'fap-wire' }));
    track = K.track(d, 2);
    packets.forEach(function (p) { wires.appendChild(p.n); });
  }
  var loop = K.loop(function (now) {
    packets = packets.filter(function (p) {
      var q = (now - p.t0) / 700;
      if (q >= 1 || !track) { p.n.remove(); if (p.done) p.done(); return false; }
      var pt = K.trackAt(track, track.len * K.ease.inOut(q));
      p.n.setAttribute('cx', pt.x.toFixed(1)); p.n.setAttribute('cy', pt.y.toFixed(1));
      return true;
    });
    if (!packets.length) loop.off();
  });
  function send(done) {
    if (!track || K.reduce || !visible) { done(); return; }
    var n = K.svg('circle', { r: 5, 'class': 'fap-pkt' }); wires.appendChild(n);
    packets.push({ n: n, t0: performance.now(), done: done }); loop.on();
  }

  // ---------------------------------------------------------------- the walkthrough
  function go(s, opts) {
    opts = opts || {};
    clear(); step = s;
    screen(s, !!opts.instant);
    if (opts.instant || s === 0) { if (s === 0) { logEl.textContent = ''; ref.textContent = J().ref; } paint(s, false); }
    else send(function () { paint(s, true); say(s); });
    schedule();
  }
  function schedule() {
    clearTimeout(auto); auto = 0;
    if (paused || !visible || K.reduce) return;
    auto = setTimeout(function () { go(step >= 5 ? 0 : step + 1); }, step >= 5 ? 3800 : step === 2 ? 2700 : 2300);
  }
  function setPaused(p) {
    paused = p; root.classList.toggle('is-paused', p);
    playTxt.textContent = p ? 'Play' : 'Pause'; play.setAttribute('aria-label', p ? 'Play the walkthrough' : 'Pause the walkthrough');
    schedule();
  }
  play.addEventListener('click', function () { setPaused(!paused); });
  // a step tapped on the rail: forward runs it like the walkthrough; back (or the same step) shows it as it stood
  RAIL.forEach(function (b) {
    b.addEventListener('click', function () {
      var s = +b.dataset.step;
      if (s > step) { go(s); return; }
      logEl.textContent = ''; for (var k = 1; k <= s; k++) say(k);
      go(s, { instant: true });
    });
  });
  K.$$('[data-pf]', root).forEach(function (b) {
    if (b === phone) return;
    b.addEventListener('click', function () {
      pf = b.dataset.pf; phone.dataset.pf = pf;
      K.$$('.dm-seg [data-pf]', root).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      requestAnimationFrame(layWire);
    });
  });
  K.$$('[data-job]', root).forEach(function (b) {
    b.addEventListener('click', function () {
      job = b.dataset.job;
      K.$$('[data-job]', root).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      logEl.textContent = ''; ref.textContent = J().ref; paint(0, false); go(0);
    });
  });
  var rt = 0;
  window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(layWire, 140); });
  ref.textContent = J().ref;
  if (K.reduce) { root.classList.add('is-static'); go(5, { instant: true }); } else go(0);
  return {
    start: function () { visible = true; layWire(); schedule(); },
    stop: function () { visible = false; clearTimeout(auto); auto = 0; }
  };
});
