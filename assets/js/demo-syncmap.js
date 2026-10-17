/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* Odoo integration page: the sync map. Odoo is the hub; bank feeds, a payment gateway, a
   marketplace connector, a courier, InvoiceNow (Peppol access point), a BI warehouse and a legacy
   WMS are the spokes. Webhooks push single events, scheduled jobs move batches on a timer. Every
   message carries an idempotency key; failures retry with exponential backoff and end in a
   dead-letter queue that alerts a person. Take a connector down, watch the backlog, the retries
   and the recovery. Sample traffic, timings sped up. */
TN.demo('syncmap', function (root, K) {
  var stage = K.$('.smap-stage', root), svg = K.$('.smap-svg', root), hub = K.$('.smap-hub', root), logL = K.$('.smap-log', root);
  var clockK = K.$('[data-k="clock"]', root), keysK = K.$('[data-k="keys"]', root), k = {};
  ['tp', 'bl', 'rt', 'dl', 'dup', 'dupl'].forEach(function (n) { k[n] = K.$('[data-k="' + n + '"]', root); });
  var keysBtn = K.$('[data-keys]', root), keysLbl = K.$('span', keysBtn), replayBtn = K.$('[data-replay]', root), replayLbl = K.$('span', replayBtn);
  var lanes = {}; K.$$('.smap-lane', root).forEach(function (el) { lanes[el.dataset.l] = { q: K.$('.smap-q', el), c: K.$('[data-c]', el), n: 0 }; });
  var tip = K.tip(stage);

  // spoke: name, colour, place on the map (wide, phone) and its traffic:
  // [direction, how (hook = pushed, job = on a timer), seconds between, key prefix, what happens in Odoo, batch size]
  var SP = {
    bank: { n: 'Bank feeds', c: '#0E9384', w: [14, 16], p: [26, 8], t: [['in', 'job', 9, 'bnk', 'statement lines imported for reconciliation', [3, 5]]] },
    pay: { n: 'Payment gateway', c: '#3167CA', w: [50, 9], p: [74, 8], t: [['in', 'hook', 2.6, 'pay', 'payment registered against the invoice']] },
    mkt: { n: 'Marketplace connector', c: '#D97B12', w: [86, 16], p: [78, 30], t: [['in', 'hook', 2, 'ord', 'sales order created'], ['out', 'job', 6, 'stk', 'stock levels pushed', [1, 1]]] },
    cour: { n: 'Courier', c: '#7447D6', w: [88, 62], p: [76, 67], t: [['out', 'hook', 3, 'lbl', 'label and tracking number returned'], ['in', 'hook', 3.6, 'trk', 'delivery tracking updated']] },
    inv: { n: 'InvoiceNow', c: '#1E4691', w: [66, 90], p: [74, 85], t: [['out', 'hook', 4.2, 'einv', 'e-invoice sent through the access point'], ['in', 'job', 10, 'sts', 'e-invoice delivery status updated', [1, 3]]] },
    bi: { n: 'BI / data warehouse', c: '#6E6E88', w: [34, 90], p: [26, 85], t: [['out', 'job', 12, 'bi', 'extract loaded into the warehouse', [1, 1]]] },
    wms: { n: 'Legacy WMS', c: '#A96B00', w: [12, 62], p: [24, 67], t: [['out', 'job', 7, 'pick', 'pick list sent', [1, 2]], ['in', 'job', 7, 'conf', 'pick confirmed, stock updated', [1, 3]]] }
  };
  var IDS = Object.keys(SP), HOOKS = { pay: 1, mkt: 1, cour: 1 };
  var node = {}, line = {};
  IDS.forEach(function (id) {
    var el = K.$('[data-s="' + id + '"]', stage), s = SP[id], job = s.t.some(function (t) { return t[1] === 'job'; });
    el.style.setProperty('--c', s.c);
    node[id] = { el: el, em: K.$('em', el), job: job, every: job ? s.t.filter(function (t) { return t[1] === 'job'; })[0][2] : 0 };
    node[id].em.textContent = HOOKS[id] ? 'webhook' : 'every ' + node[id].every + ' s';
    el.classList.toggle('is-job', !HOOKS[id]);
    el.addEventListener('pointerenter', function () {
      var b = K.box(el, stage), low = b.y < stage.offsetHeight * .3;
      tip.show([s.n + (down === id ? ' · down' : ''), s.t.map(function (t) { return (t[0] === 'in' ? 'In: ' : 'Out: ') + t[4] + (t[1] === 'hook' ? ' (webhook)' : ' (every ' + t[2] + ' s)'); }).join(' · '),
                'Keys: ' + s.t.map(function (t) { return t[3] + '-…'; }).join(', ')], b.cx, low ? b.b + 4 : b.y - 2, low);
    });
    el.addEventListener('pointerleave', function () { tip.hide(); });
  });
  var gL = K.svg('g', { 'class': 'smap-lines' }), gP = K.svg('g', { 'class': 'smap-pk' }); svg.appendChild(gL); svg.appendChild(gP);
  IDS.forEach(function (id) { line[id] = K.svg('line', { 'class': 'smap-ln' + (HOOKS[id] ? '' : ' is-job') }); line[id].style.setProperty('--c', SP[id].c); gL.appendChild(line[id]); });

  /* ------------------------------------------------------------------ geometry */
  var W = 1, H = 1, P = {}, HB = null, narrow = false;
  function size() {
    W = stage.offsetWidth || 1; narrow = W < 600; root.classList.toggle('is-narrow', narrow); H = stage.offsetHeight || 1;
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    var hx = W / 2, hy = H * (narrow ? .45 : .5);
    hub.style.transform = 'translate(' + (hx - hub.offsetWidth / 2).toFixed(1) + 'px,' + (hy - hub.offsetHeight / 2).toFixed(1) + 'px)';
    HB = { x: hx, y: hy };
    IDS.forEach(function (id) {
      var q = narrow ? SP[id].p : SP[id].w, el = node[id].el, x = q[0] / 100 * W, y = q[1] / 100 * H;
      el.style.transform = 'translate(' + (x - el.offsetWidth / 2).toFixed(1) + 'px,' + (y - el.offsetHeight / 2).toFixed(1) + 'px)';
      P[id] = { x: x, y: y };
      line[id].setAttribute('x1', hx); line[id].setAttribute('y1', hy); line[id].setAttribute('x2', x.toFixed(1)); line[id].setAttribute('y2', y.toFixed(1));
    });
  }

  /* ------------------------------------------------------------------ messages */
  var msgs = [], seen = {}, nSeen = 0, seq = {}, t = 0, done = [], stats = { rt: 0, dl: 0, dup: 0, bad: 0 }, keysOn = true, down = '', downUntil = 0, pend = {};
  function newKey(p) { seq[p] = (seq[p] || 58100 + (p.length * 37) % 90) + 1; return p + '-' + seq[p]; }
  function add(m) {
    m.g = K.svg('circle', { r: m.n > 1 ? 5.5 : 4, 'class': 'smap-dot' }); m.g.style.setProperty('--c', SP[m.s].c); gP.appendChild(m.g);
    m.g.style.opacity = 0; msgs.push(m); return m;
  }
  function spawn(s, tr, key, dupe) {             // one event (a webhook) or one batch (a scheduled run)
    var dir = tr[0], how = tr[1], n = tr[5] ? Math.round(K.rnd(tr[5][0], tr[5][1])) : 1;
    var m = { s: s, tr: tr, dir: dir, how: how, key: key || newKey(tr[3]), n: n, tries: 0, dupe: !!dupe, st: '', at: 0, u: 0 };
    if (dir === 'in' && how === 'hook') {
      if (down === s) { pend[s] = (pend[s] || 0) + 1; pend[s + ':k'] = (pend[s + ':k'] || []).concat([m.key]); return; }
      add(m); fly(m, 'in');
      if (!dupe && (s === 'pay' || s === 'mkt') && Math.random() < .09) setTimeout(function () { if (visible) spawn(s, tr, m.key, true); }, 900);
    } else { add(m); queue(m); }                  // outbound calls and scheduled polls start from Odoo's queue
  }
  function fly(m, dir) { m.st = dir === 'in' ? 'fi' : 'fo'; m.u = 0; m.g.style.opacity = 1; laneOut(m); }
  function queue(m) { m.st = 'q'; m.at = t + K.rnd(.25, .5); laneIn(m, m.how === 'hook' ? 'hook' : 'job'); m.g.style.opacity = 0; }
  function laneIn(m, l) {
    laneOut(m); m.lane = l; lanes[l].n++;
    if (lanes[l].q.children.length < 16) { m.b = K.el('i', 'smap-b'); m.b.style.setProperty('--c', SP[m.s].c); if (m.n > 1) m.b.classList.add('is-batch'); lanes[l].q.appendChild(m.b); }
  }
  function laneOut(m) { if (!m.lane) return; lanes[m.lane].n--; if (m.b) m.b.remove(); m.b = null; m.lane = null; }
  function fail(m) {
    m.tries++; stats.rt++;
    if (m.tries >= 5) { m.st = 'x'; laneIn(m, 'dead'); m.g.style.opacity = 0; stats.dl++; say(SP[m.s].n + ': ' + m.key + ' failed 5 times, moved to dead letters, ops alerted', 'var(--tok-late)', 1); return; }
    var wait = Math.pow(2, m.tries - 1) * K.rnd(.85, 1.15);
    m.st = 'r'; m.at = t + wait; laneIn(m, 'retry'); m.g.style.opacity = 0;
    if (m.b) m.b.textContent = String(Math.ceil(wait));
    if (m.tries === 1 || m.tries === 4) say(SP[m.s].n + ' timed out on ' + m.key + ': retry ' + m.tries + ' in ' + Math.ceil(wait) + ' s', 'var(--tok-buy)');
  }
  function process(m) {                           // the worker books an inbound message, once per key
    laneOut(m); m.st = 'done';
    if (seen[m.key]) {
      if (keysOn) { stats.dup++; say('Duplicate ' + m.key + ' ignored: key already processed', 'var(--ok)', 1); }
      else { stats.bad++; say('Duplicate ' + m.key + ' booked again: a second ' + (m.s === 'pay' ? 'payment' : 'record') + ' created', 'var(--tok-late)', 1); }
      return;
    }
    seen[m.key] = 1; nSeen++; keysK.textContent = String(nSeen);
    done.push(t); pulse(hub, 'rgba(49,103,202,.35)');
    if (Math.random() < .3 || m.n > 1) say(SP[m.s].n + ' → Odoo · ' + m.key + (m.n > 1 ? ' · ' + m.n + ' records' : '') + ' · ' + m.tr[4], SP[m.s].c);
    if (m.s === 'mkt' && Math.random() < .5) setTimeout(function () { if (visible) spawn('cour', SP.cour.t[0]); }, 400);   // a paid order asks the courier for a label
  }
  function arrive(m) {                            // a call reached the other system
    if (down === m.s) { fail(m); return; }
    if (m.dir === 'out') { m.st = 'done'; done.push(t); if (Math.random() < .25) say('Odoo → ' + SP[m.s].n + ' · ' + m.key + ' · ' + m.tr[4], SP[m.s].c); return; }
    m.back = true; fly(m, 'in');                  // a scheduled poll: the batch comes back
  }
  function pulse(el, c) { if (el.animate) el.animate([{ boxShadow: '0 0 0 0 ' + c }, { boxShadow: '0 0 0 9px rgba(0,0,0,0)' }], { duration: 650, easing: 'ease-out' }); }

  /* ------------------------------------------------------------------ outage and controls */
  function setDown(s, secs) {
    var was = down;
    down = s; downUntil = s ? t + (secs || 30) : 0;
    K.$$('[data-out]', root).forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.out === s)); });
    IDS.forEach(function (id) { node[id].el.classList.toggle('is-down', id === s); line[id].classList.toggle('is-down', id === s); });
    if (s) say(SP[s].n + ' is not answering: calls will retry with backoff', 'var(--tok-late)', 1);
    if (was && was !== s) recover(was);
  }
  function recover(s) {
    say(SP[s].n + ' is back: retries succeed and the backlog drains', 'var(--ok)', 1);
    var keys = pend[s + ':k'] || [], i = 0;
    pend[s] = 0; pend[s + ':k'] = [];
    keys.forEach(function (key) {                 // the sender delivers what it held, some of it twice
      var tr = SP[s].t.filter(function (x) { return x[0] === 'in' && x[1] === 'hook'; })[0];
      setTimeout(function () { spawn(s, tr, key); if (Math.random() < .3) spawn(s, tr, key, true); }, 150 + (i++) * 180);
    });
    if (keys.length) say(SP[s].n + ' re-delivers ' + keys.length + ' held events', SP[s].c);
    msgs.forEach(function (m) { if (m.s === s && m.st === 'r') m.at = Math.min(m.at, t + .3); });
  }
  K.$$('[data-out]', root).forEach(function (b) { b.addEventListener('click', function () { setDown(b.dataset.out); touched = true; }); });
  keysBtn.addEventListener('click', function () {
    keysOn = !keysOn; keysBtn.setAttribute('aria-pressed', String(keysOn)); keysLbl.textContent = 'Idempotency keys ' + (keysOn ? 'on' : 'off');
    k.dupl.textContent = keysOn ? 'Duplicates blocked' : 'Duplicate records'; k.dup.parentNode.classList.toggle('dm-ok', keysOn); k.dup.parentNode.classList.toggle('is-bad', !keysOn);
    say(keysOn ? 'Idempotency keys on: re-delivered events are recognised' : 'Idempotency keys off: a re-delivered event books twice', keysOn ? 'var(--ok)' : 'var(--tok-late)', 1);
    paintK();
  });
  replayBtn.addEventListener('click', function () {
    var dead = msgs.filter(function (m) { return m.st === 'x'; });
    dead.forEach(function (m, i) { m.tries = 0; m.back = false; setTimeout(function () { if (m.st === 'x') queue(m); }, i * 120); });
    if (dead.length) say('Replaying ' + dead.length + ' dead letters with their original keys', 'var(--blue)', 1);
  });

  /* ------------------------------------------------------------------ the clock */
  var nextAt = {};
  function hhmmss(s) { var d = new Date(Date.UTC(2026, 0, 1, 9, 0, 0) + s * 1000); return d.toISOString().slice(11, 19); }
  function say(text, color, strong) {
    var li = K.el('li'); li.style.setProperty('--c', color || 'var(--blue)');
    li.appendChild(K.el('i')); var sp = K.el('span'); sp.appendChild(K.el('b', null, hhmmss(t) + ' ')); sp.appendChild(document.createTextNode(text)); li.appendChild(sp);
    if (strong) li.classList.add('is-strong');
    logL.insertBefore(li, logL.firstChild); while (logL.children.length > 4) logL.lastChild.remove();
  }
  var paintT = 0;
  function paintK() {
    done = done.filter(function (x) { return x > t - 60; });
    var bl = msgs.filter(function (m) { return m.st === 'q' || m.st === 'r'; }).length + IDS.reduce(function (a, id) { return a + (pend[id] || 0); }, 0);
    k.tp.textContent = String(done.length); k.bl.textContent = String(bl); k.rt.textContent = String(stats.rt); k.dl.textContent = String(stats.dl);
    k.dup.textContent = String(keysOn ? stats.dup : stats.bad);
    k.bl.parentNode.classList.toggle('is-warn', bl > 8);
    var dead = msgs.filter(function (m) { return m.st === 'x'; }).length;
    replayBtn.disabled = !dead; replayLbl.textContent = dead ? 'Replay ' + dead + ' dead letter' + (dead > 1 ? 's' : '') : 'Replay dead letters';
    Object.keys(lanes).forEach(function (l) { lanes[l].c.textContent = String(lanes[l].n); });
    IDS.forEach(function (id) { var n = node[id]; n.em.textContent = down === id ? 'down · ' + (pend[id] ? pend[id] + (narrow ? ' held' : ' held at source') : 'retrying') : HOOKS[id] ? 'webhook' : 'every ' + n.every + ' s'; });
  }
  var loop = K.loop(function (now, dt) {
    t += dt; var clk = hhmmss(t); if (clk !== clockK._v) { clockK._v = clk; clockK.textContent = clk; }
    if (down && t >= downUntil) setDown('');
    IDS.forEach(function (id) {
      SP[id].t.forEach(function (tr, j) {
        var key = id + j;
        if (nextAt[key] == null) nextAt[key] = t + (tr[1] === 'job' ? K.rnd(1, tr[2]) : K.rnd(.3, tr[2]));
        if (t >= nextAt[key]) {
          nextAt[key] = t + (tr[1] === 'job' ? tr[2] : tr[2] * K.rnd(.55, 1.45));
          spawn(id, tr);
          if (tr[1] === 'job') pulse(node[id].el, 'rgba(49,103,202,.3)');
        }
      });
      if (node[id].job && !HOOKS[id]) { var jt = SP[id].t.filter(function (x) { return x[1] === 'job'; })[0], nk = id + SP[id].t.indexOf(jt); var ring = node[id].ring || (node[id].ring = node[id].el.querySelector('em') || node[id].el), pv = (1 - K.clamp((nextAt[nk] - t) / jt[2], 0, 1)).toFixed(2); if (ring._p !== pv) { ring._p = pv; ring.style.setProperty('--p', pv); } }
    });
    msgs = msgs.filter(function (m) {
      if (m.st === 'fi' || m.st === 'fo') {
        m.u += dt / .95;
        var q = K.clamp(m.u, 0, 1), a = m.st === 'fi' ? P[m.s] : HB, b = m.st === 'fi' ? HB : P[m.s], e = K.ease.inOut(q);
        m.g.setAttribute('cx', K.lerp(a.x, b.x, e).toFixed(1)); m.g.setAttribute('cy', K.lerp(a.y, b.y, e).toFixed(1));
        if (q >= 1) { if (m.st === 'fi') queue(m); else arrive(m); }
      } else if (m.st === 'q' && t >= m.at) {
        if (m.dir === 'in' && m.how === 'hook' || m.back) process(m);
        else fly(m, 'out');                                            // calls and polls go out first
      } else if (m.st === 'r') {
        if (m.b && t - (m.bt || 0) > .25) { m.bt = t; m.b.textContent = String(Math.max(0, Math.ceil(m.at - t))); }
        if (t >= m.at) { laneOut(m); fly(m, 'out'); }
      }
      if (m.st === 'done') { m.g.remove(); return false; }
      return true;
    });
    if (t - paintT > .2) { paintT = t; paintK(); }
  });

  var visible = false, touched = false;
  if ('ResizeObserver' in window) new ResizeObserver(function () { size(); }).observe(stage);
  else window.addEventListener('resize', function () { size(); });
  size(); paintK();
  say('Sync map live: 7 connectors, one queue', 'var(--blue)');
  if (K.reduce) {                                 // a still: the state a few minutes in
    ['ord-58201', 'pay-58133', 'bnk-58145'].forEach(function (x) { seen[x] = 1; nSeen++; }); keysK.textContent = String(nSeen);
    k.tp.textContent = '42'; k.rt.textContent = '3'; k.dup.textContent = '2';
    say('Marketplace re-delivered ord-58201: key already processed, ignored', 'var(--ok)', 1);
    say('Courier timed out on lbl-58117: retry 1 in 1 s, then 2, 4, 8', 'var(--tok-buy)');
  }
  return {
    start: function (first) { visible = true; size(); loop.on(); if (first && !touched && !K.reduce) setTimeout(function () { if (!touched && visible) setDown('cour', 26); }, 4000); },
    stop: function () { visible = false; loop.off(); }
  };
});
