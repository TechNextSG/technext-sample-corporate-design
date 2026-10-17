/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* IoT page: a sample cold store with two chillers and a freezer, each reporting every minute. A scenario scripts
   an incident (a door left open, a power cut); a reading above the room's limit alerts the person on duty,
   recovery is announced, ten minutes out of range opens a quality check in Odoo and a power fault opens a
   maintenance request. The chiller limit is a slider; hovering a chart reads any minute. */
TN.demo('coldchain', function (root, K) {
  var TILES = K.$$('.cld-room', root), logEl = K.$('.cld-log', root), recs = K.$('.cld-recs', root), clock = K.$('[data-clock]', root);
  var th = K.$('#cld-th', root), thv = K.$('[data-thv]', root), play = K.$('[data-play]', root), playTxt = K.$('[data-play] span', root);
  var KP = {}; K.$$('[data-k]', root).forEach(function (n) { KP[n.dataset.k] = n; });
  var N = 40, TICK = 520, CYCLE = 66, H = 72;
  var RED = '#D2433B', AMBER = '#B87700', GREEN = '#137A4A', BLUE = '#3167CA';
  var R = [
    { name: 'Chiller A', base: 3.2, lo: 0, hi: 10, fixed: null, extra: 'door' },
    { name: 'Chiller B', base: 3.6, lo: 0, hi: 10, fixed: null, extra: 'door' },
    { name: 'Freezer', base: -18, lo: -22, hi: -6, fixed: -15, extra: 'power' }
  ];
  var sc = 'door', limit = 5, t = 0, timer = 0, paused = false, visible = false, seed = 11;
  var stats, recNo = { qc: 41, mr: 16 };
  function rnd() { seed = seed * 16807 % 2147483647; return seed / 2147483647; }
  function lim(i) { return R[i].fixed != null ? R[i].fixed : limit; }
  function hhmm(m) { var h = 8 + Math.floor(m / 60), mm = m % 60; return (h < 10 ? '0' : '') + h + ':' + (mm < 10 ? '0' : '') + mm; }
  function deg(v) { return (v < 0 ? '−' : '') + Math.abs(v).toFixed(1); }

  // ---------------------------------------------------------------- the charts: built once, redrawn per tick
  R.forEach(function (r, i) {
    var tile = TILES[i], s = K.$('.cld-spark', tile);
    r.tile = tile; r.svg = s; r.v = K.$('[data-v]', tile); r.st = K.$('.cld-st', tile); r.lim = K.$('[data-lim]', tile); r.door = K.$('[data-door]', tile);
    r.ar = s.appendChild(K.svg('path', { 'class': 'ar' }));
    r.lm = s.appendChild(K.svg('line', { 'class': 'lm', x1: 0, x2: 240 }));
    r.ln = s.appendChild(K.svg('path', { 'class': 'ln' }));
    r.hv = s.appendChild(K.svg('line', { 'class': 'hv', y1: 2, y2: H - 2 }));
    r.pt = s.appendChild(K.svg('circle', { 'class': 'pt', r: 3.6 }));
    r.tip = K.tip(tile);
    s.addEventListener('pointermove', function (e) { hover(i, e); });
    s.addEventListener('pointerleave', function () { r.tip.hide(); r.hv.classList.remove('is-on'); });
  });
  function W(r) { return Math.max(120, r.svg.clientWidth || 240); }
  function Y(r, v) { return (H - 6) - K.clamp((v - r.lo) / (r.hi - r.lo), 0, 1) * (H - 12); }
  function draw(r, i) {
    var w = W(r), n = r.hist.length, step = (w - 6) / (N - 1), x0 = 3 + (N - n) * step;
    r.svg.setAttribute('viewBox', '0 0 ' + w + ' ' + H);
    var d = '';
    r.hist.forEach(function (v, k) { d += (k ? 'L' : 'M') + (x0 + k * step).toFixed(1) + ' ' + Y(r, v).toFixed(1); });
    r.ln.setAttribute('d', d);
    r.ar.setAttribute('d', d + 'L' + (x0 + (n - 1) * step).toFixed(1) + ' ' + H + 'L' + x0.toFixed(1) + ' ' + H + 'Z');
    var ly = Y(r, lim(i)).toFixed(1); r.lm.setAttribute('x2', w); r.lm.setAttribute('y1', ly); r.lm.setAttribute('y2', ly);
    r.pt.setAttribute('cx', (x0 + (n - 1) * step).toFixed(1)); r.pt.setAttribute('cy', Y(r, r.hist[n - 1]).toFixed(1));
  }
  function hover(i, e) {
    var r = R[i], b = r.svg.getBoundingClientRect(), w = W(r), n = r.hist.length, step = (w - 6) / (N - 1), x0 = 3 + (N - n) * step;
    var k = K.clamp(Math.round(((e.clientX - b.left) * w / b.width - x0) / step), 0, n - 1), v = r.hist[k];
    var x = x0 + k * step, y = Y(r, v), tb = K.box(r.svg, r.tile);
    r.hv.setAttribute('x1', x.toFixed(1)); r.hv.setAttribute('x2', x.toFixed(1)); r.hv.classList.add('is-on');
    r.tip.show([r.name + ' · ' + hhmm(Math.max(0, t - (n - 1 - k))), deg(v) + ' °C' + (v > lim(i) ? ' · above the limit' : '')], tb.x + x * tb.w / w, tb.y + y * tb.h / H - 6);
  }

  // ---------------------------------------------------------------- the simulation
  function reset() {
    t = 0; seed = sc === 'normal' ? 11 : sc === 'door' ? 23 : 37;
    stats = { reads: 0, alerts: 0, out: 0, recs: 0 };
    R.forEach(function (r) {
      r.temp = r.base; r.hist = []; r.open = false; r.power = true; r.out = 0; r.alerted = false; r.alertAt = 0; r.qc = false; r.mr = false; r.openSince = 0;
      for (var k = 0; k < N; k++) { r.temp += (r.base - r.temp) * .2 + (rnd() - .5) * .14; r.hist.push(r.temp); }
    });
    logEl.textContent = ''; recs.textContent = '';
    recs.appendChild(K.el('li', 'cld-none', 'Nothing yet: every room is in range.'));
    say('Monitoring started', 'three sensors, one reading a minute', BLUE);
    render(true);
  }
  function say(what, note, c) {
    K.log(logEl, '<i style="--c:' + c + '"></i><span><b>' + hhmm(t) + '</b> ' + what + (note ? ' · ' + note : '') + '</span>', null, 5);
  }
  function openRec(kind, room) {
    var none = K.$('.cld-none', recs); if (none) none.remove();
    var li = K.el('li'), no = kind === 'qc' ? 'QC/' + String(++recNo.qc).padStart(4, '0') : 'MR/' + String(++recNo.mr).padStart(4, '0');
    li.innerHTML = K.oi(kind === 'qc' ? 'quality_control' : 'maintenance', 20);
    var tx = li.appendChild(K.el('span'));
    tx.appendChild(K.el('b', null, no + (kind === 'qc' ? ' · Quality check' : ' · Maintenance request')));
    tx.appendChild(document.createTextNode(kind === 'qc' ? 'Check the stock in ' + room : room + ': power fault'));
    li.appendChild(K.el('em', null, 'New'));
    recs.insertBefore(li, recs.firstChild);
    while (recs.children.length > 3) recs.lastChild.remove();
    stats.recs++;
    say((kind === 'qc' ? 'Odoo opened a quality check' : 'Odoo opened a maintenance request'), room, '#714B67');
  }
  function step() {
    t++;
    var b = R[1], f = R[2];
    if (sc === 'door') {
      if (t === 8) { b.open = true; b.openSince = t; say('Chiller B door opened', 'loading bay', BLUE); }
      if (b.open && ((b.alertAt && t >= b.alertAt + 7) || t >= 46)) { b.open = false; say('Chiller B door closed', 'by the supervisor', GREEN); }
    }
    if (sc === 'power') {
      if (t === 6) { f.power = false; say('Freezer lost power', 'kitchen circuit', BLUE); }
      if (!f.power && ((f.alertAt && t >= f.alertAt + 16) || t >= 48)) { f.power = true; say('Freezer power restored', 'breaker reset', GREEN); }
    }
    R.forEach(function (r, i) {
      if (i === 1 && r.open) r.temp += .28 + rnd() * .05;
      else if (i === 2 && !r.power) r.temp += .38 + rnd() * .05;
      else r.temp += (r.base - r.temp) * .16 + (rnd() - .5) * .14;
      r.hist.push(r.temp); if (r.hist.length > N) r.hist.shift();
      var L = lim(i);
      if (r.temp > L) {
        stats.out++; r.out++;
        if (!r.alerted) {
          r.alerted = true; r.alertAt = t; stats.alerts++;
          say(r.name + ' above ' + deg(L) + ' °C', 'WhatsApp to the person on duty', RED);
          if (i === 2 && !r.power && !r.mr) { r.mr = true; openRec('mr', 'Freezer'); }
        } else if (r.out === 6) say(r.name + ' still above the limit', 'reminder sent', AMBER);
        if (r.out === 10 && !r.qc) { r.qc = true; openRec('qc', r.name); }
      } else if (r.alerted && r.temp < L - .3) {
        say(r.name + ' back in range', 'after ' + r.out + ' min', GREEN);
        r.alerted = false; r.out = 0;
      } else if (!r.alerted) r.out = 0;
    });
    stats.reads += 3;
    render(false);
    if (t >= CYCLE) reset();
  }
  function render(instant) {
    clock.textContent = hhmm(t);
    R.forEach(function (r, i) {
      var L = lim(i), over = r.temp > L, near = !over && r.temp > L - (r.fixed != null ? 1.2 : .6);
      r.tile.classList.toggle('is-alert', over); r.tile.classList.toggle('is-watch', near);
      r.st.textContent = over ? 'Alert' : near ? 'Watch' : 'OK';
      r.v.textContent = deg(r.temp);
      r.lim.textContent = deg(L) + ' °C';
      if (r.extra === 'door') { r.door.textContent = r.open ? 'Door open ' + (t - r.openSince) + ' min' : 'Door closed'; r.door.classList.toggle('is-bad', r.open); }
      else { r.door.textContent = r.power ? 'Power on' : 'Power off'; r.door.classList.toggle('is-bad', !r.power); }
      draw(r, i);
    });
    var dur = instant ? 0 : 280;
    K.count(KP.reads, stats.reads, 0); K.count(KP.out, stats.out, 0);
    K.count(KP.alerts, stats.alerts, dur); K.count(KP.recs, stats.recs, dur);
  }

  // ---------------------------------------------------------------- running, pausing, controls
  function run() { clearInterval(timer); timer = 0; if (visible && !paused && !K.reduce) timer = setInterval(step, TICK); }
  function fastForward(to) { while (t < to) step(); }
  function setPaused(p) {
    paused = p; root.classList.toggle('is-paused', p);
    playTxt.textContent = p ? 'Play' : 'Pause'; play.setAttribute('aria-label', p ? 'Play the simulation' : 'Pause the simulation');
    run();
  }
  play.addEventListener('click', function () { setPaused(!paused); });
  K.$$('[data-sc]', root).forEach(function (btn) {
    btn.addEventListener('click', function () {
      sc = btn.dataset.sc;
      K.$$('[data-sc]', root).forEach(function (x) { x.setAttribute('aria-pressed', String(x === btn)); });
      reset(); if (K.reduce) fastForward(30); run();
    });
  });
  th.addEventListener('input', function () {
    limit = +th.value; thv.textContent = limit.toFixed(1) + ' °C';
    render(true);
  });
  var rt = 0;
  window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { R.forEach(draw); }, 140); });
  if (K.reduce) { root.classList.add('is-static'); }
  reset(); if (K.reduce) fastForward(30);
  return {
    start: function () { visible = true; R.forEach(draw); run(); },
    stop: function () { visible = false; run(); }
  };
});
