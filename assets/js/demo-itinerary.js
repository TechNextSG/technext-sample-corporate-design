/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* Travel page demo: an itinerary builder with margin. Supplier services (flights, hotel nights,
   transfers, tours) are dragged onto a five-day trip, or added with the keyboard. Costs in SGD, USD,
   JPY and EUR convert at sample rates, markups per category set the price, and a waterfall shows
   cost, markup, price, exchange difference and margin. The same booking schedules the deposit and
   balance invoices, the supplier payments and the cash position. Sample data and rates. */
TN.demo('itinerary', function (root, K) {
  var body = K.$('.itn-body', root), pal = K.$('.itn-pal', root), daysEl = K.$('.itn-days', root), checks = K.$('.itn-checks', root);
  var wf = K.$('.itn-wfp', root), sumL = K.$('.itn-sumd', root), curL = K.$('.itn-cur', root), invL = K.$('.itn-invl', root), payL = K.$('.itn-payl', root);
  var cash = K.$('.itn-cashsvg', root), cashN = K.$('.itn-cashn', root), fxB = K.$('[data-fx]', root), tpl = K.$('.itn-ic', root), tip = K.tip(body);
  function ic(n) { var s = tpl && tpl.content.querySelector('[data-i="' + n + '"] svg'); return s ? s.cloneNode(true) : K.el('i'); }

  // ---------------------------------------------------------------- sample booking
  var DAY = 864e5, T0 = Date.UTC(2026, 11, 12), SIGN = Date.UTC(2026, 9, 2), BOOK = Date.UTC(2026, 9, 5), BAL = Date.UTC(2026, 10, 12), TARGET = .12, NDAY = 5;
  function dd(ms, wd) { var o = { day: 'numeric', month: 'short', timeZone: 'UTC' }; if (wd) o.weekday = 'short'; return new Date(ms).toLocaleDateString('en-GB', o); }
  var RATE = { SGD: 1, USD: 1.30, EUR: 1.46, JPY: .0088 }, SYM = { SGD: 'S$', USD: 'US$', EUR: '€', JPY: '¥' }, CURS = ['SGD', 'JPY', 'EUR', 'USD'];
  function cm(v, cur) { return SYM[cur] + ' ' + Math.round(v).toLocaleString('en-SG'); }
  function sg(v) { return (v < 0 ? '−' : '') + 'S$ ' + Math.round(Math.abs(v)).toLocaleString('en-SG'); }
  var TY = { fl: { n: 'Flights', i: 'plane', m: 6 }, ht: { n: 'Hotels', i: 'briefcase', m: 20 }, tr: { n: 'Transfers', i: 'truck', m: 15 }, to: { n: 'Tours', i: 'users', m: 25 } };
  var TORDER = ['fl', 'ht', 'tr', 'to'];
  var C = {
    fo: { t: 'fl', n: 'Flight SIN → HND', s: 'Air consolidator', cur: 'SGD', c: 640, u: '2 seats' },
    fr: { t: 'fl', n: 'Flight KIX → SIN', s: 'Air consolidator', cur: 'SGD', c: 590, u: '2 seats' },
    ht: { t: 'ht', n: 'Hotel night · Tokyo', s: 'Hotel bed bank', cur: 'EUR', c: 168, u: '1 room' },
    rk: { t: 'ht', n: 'Ryokan night · Kyoto', s: 'Kyoto ryokan', cur: 'JPY', c: 52000, u: 'half board' },
    ta: { t: 'tr', n: 'Airport transfer', s: 'Ground handler', cur: 'JPY', c: 18000, u: 'private car' },
    sk: { t: 'tr', n: 'Shinkansen to Kyoto', s: 'Rail agent', cur: 'JPY', c: 29600, u: '2 seats' },
    fj: { t: 'to', n: 'Mt Fuji day tour', s: 'Tour platform', cur: 'USD', c: 236, u: '2 guests' },
    gw: { t: 'to', n: 'Kyoto guided walk', s: 'Local guide', cur: 'JPY', c: 24000, u: 'half day' },
    tc: { t: 'to', n: 'Tea ceremony', s: 'Tour platform', cur: 'USD', c: 112, u: '2 guests' }
  };
  // supplier → purchase order, payment term, due date
  var SUP = {
    'Air consolidator': ['P00211', 'at ticketing', BOOK], 'Rail agent': ['P00212', 'at booking', BOOK], 'Tour platform': ['P00213', 'at booking', BOOK],
    'Hotel bed bank': ['P00214', '14 days before arrival', Date.UTC(2026, 10, 28)], 'Kyoto ryokan': ['P00215', 'on arrival', Date.UTC(2026, 11, 14)],
    'Local guide': ['P00216', 'after the tour', Date.UTC(2026, 11, 22)], 'Ground handler': ['P00217', '30 days after service', Date.UTC(2027, 0, 15)]
  };
  var CITY = ['Tokyo', 'Tokyo', 'Kyoto', 'Kyoto', 'fly home'];
  var DEF = [['fo', 0], ['ta', 0], ['ht', 0], ['fj', 1], ['ht', 1], ['sk', 2], ['rk', 2], ['gw', 3], ['tc', 3], ['rk', 3], ['ta', 4], ['fr', 4]];

  var items = [], mk = {}, dep = 30, fx = false, target = 0, uid = 0, built = false, vis = false;
  TORDER.forEach(function (t) { mk[t] = TY[t].m; });

  // ---------------------------------------------------------------- one clock for the build-up animation
  var clk = 0, jobs = [];
  var loop = K.loop(function (now, dt) {
    clk += dt * 1000;
    for (var i = 0; i < jobs.length; i++) if (jobs[i][0] <= clk) { var f = jobs[i][1]; jobs.splice(i, 1); i--; f(); }
    if (!jobs.length) loop.off();
  });
  function at(ms, fn) { if (K.reduce) { fn(); return; } jobs.push([clk + ms, fn]); if (vis) loop.on(); }

  function hover(el, lines) {
    function on() { var b = K.box(el, body); tip.show(lines(), b.cx, b.y); }
    function off() { tip.hide(); }
    el.addEventListener('pointerenter', on); el.addEventListener('pointerleave', off);
    el.addEventListener('focus', on); el.addEventListener('blur', off);
  }
  function svcTip(k) {
    var c = C[k], s = c.c * RATE[c.cur];
    return [c.n + ' · ' + c.u, c.s + ' · cost ' + cm(c.c, c.cur) + (c.cur === 'SGD' ? '' : ' = ' + sg(s)), TY[c.t].n + ' markup ' + mk[c.t] + '% · sells ' + sg(s * (1 + mk[c.t] / 100))];
  }

  // ---------------------------------------------------------------- palette of supplier services
  var palBtn = {};
  TORDER.forEach(function (t) {
    var g = K.el('div', 'itn-pg'); g.appendChild(K.el('p', 'itn-pgh', TY[t].n));
    Object.keys(C).forEach(function (k) {
      var c = C[k]; if (c.t !== t) return;
      var b = K.el('button', 'itn-svc itn-t-' + t); b.type = 'button';
      b.appendChild(ic(TY[t].i));
      var tx = K.el('span'), sm = K.el('small', null, c.s); sm.appendChild(K.el('em', null, cm(c.c, c.cur))); tx.appendChild(K.el('b', null, c.n)); tx.appendChild(sm); b.appendChild(tx);
      b.setAttribute('aria-label', c.n + ', ' + c.s + ', ' + cm(c.c, c.cur) + '. Adds it to the chosen day');
      b.addEventListener('click', function () { if (!dragEnd) addItem(k, target, b.getBoundingClientRect()); });
      hover(b, function () { return svcTip(k); });
      draggable(b, { c: k });
      g.appendChild(b); palBtn[k] = b;
    });
    pal.appendChild(g);
  });

  // ---------------------------------------------------------------- the trip, day by day
  var dayEls = [];
  for (var d0 = 0; d0 < NDAY; d0++) (function (d) {
    var col = K.el('div', 'itn-day'), h = K.el('button', 'itn-dh'); h.type = 'button';
    h.appendChild(K.el('b', null, 'Day ' + (d + 1))); h.appendChild(K.el('small', null, dd(T0 + d * DAY, 1) + ' · ' + CITY[d]));
    h.addEventListener('click', function () { setTarget(d); });
    col.appendChild(h);
    var list = K.el('ol', 'itn-list'); col.appendChild(list);
    var night = K.el('div', 'itn-night'), ns = K.el('span', 'itn-ns'), nl = K.el('ol', 'itn-nl');
    night.appendChild(nl); night.appendChild(ns); col.appendChild(night);
    daysEl.appendChild(col);
    dayEls.push({ col: col, h: h, list: list, nl: nl, ns: ns, night: night });
  })(d0);
  function setTarget(d) {
    target = d;
    dayEls.forEach(function (x, i) { x.h.setAttribute('aria-pressed', String(i === d)); x.col.classList.toggle('is-target', i === d); });
  }
  function itemEl(it) {
    var c = C[it.c], li = K.el('li', 'itn-it itn-t-' + c.t), b = K.el('button', 'itn-ib'); b.type = 'button';
    b.appendChild(ic(TY[c.t].i));
    var tx = K.el('span'); tx.appendChild(K.el('b', null, c.n)); it.pr = K.el('small'); tx.appendChild(it.pr); b.appendChild(tx);
    var x = K.el('button', 'itn-x', '×'); x.type = 'button'; x.setAttribute('aria-label', 'Remove ' + c.n);
    li.appendChild(b); li.appendChild(x);
    x.addEventListener('click', function () { removeItem(it, true); });
    b.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        var nd = K.clamp(it.d + (e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 1), 0, NDAY - 1);
        if (nd !== it.d) { moveItem(it, nd); b.focus(); }
      } else if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); removeItem(it, true); }
    });
    hover(b, function () { return svcTip(it.c).concat(['Day ' + (it.d + 1) + ' · drag, or use the arrow keys, to move it']); });
    draggable(b, { it: it });
    it.el = li; it.btn = b;
    return li;
  }
  function place(it) { (C[it.c].t === 'ht' ? dayEls[it.d].nl : dayEls[it.d].list).appendChild(it.el); }
  function flipFrom(a, el, ms) {
    if (!a || K.reduce) return;
    var b = el.getBoundingClientRect();
    el.animate([{ transform: 'translate(' + (a.left - b.left).toFixed(1) + 'px,' + (a.top - b.top).toFixed(1) + 'px)', opacity: .5 }, { transform: 'none', opacity: 1 }], { duration: ms || 520, easing: 'cubic-bezier(.2,.8,.2,1)' });
  }
  function addItem(k, d, from) {
    var it = { c: k, d: d, id: ++uid };
    items.push(it); itemEl(it); place(it); flipFrom(from, it.el); update();
    K.restart(dayEls[d].col, 'is-drop');
  }
  function moveItem(it, d, from) {
    var a = from || (K.reduce ? null : it.el.getBoundingClientRect());
    it.d = d; place(it); flipFrom(a, it.el, 420); update();
  }
  function removeItem(it, kb) {
    var i = items.indexOf(it); if (i < 0) return;
    items.splice(i, 1);
    var el = it.el;
    if (kb) dayEls[it.d].h.focus();
    if (K.reduce) el.remove();
    else el.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scale(.88)' }], { duration: 200, easing: 'ease-in', fill: 'forwards' }).onfinish = function () { el.remove(); };
    update();
  }

  // ---------------------------------------------------------------- pointer drag (mouse and pen; touch taps to add)
  var drag = null, dragEnd = false;
  function draggable(el, what) {
    el.addEventListener('pointerdown', function (e) {
      if (e.button !== 0 || e.pointerType === 'touch') return;
      drag = { el: el, what: what, x: e.clientX, y: e.clientY, on: false };
    });
  }
  function overDay(s, x, y) {
    for (var i = 0; i < s.rects.length; i++) { var r = s.rects[i]; if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return i; }
    return -1;
  }
  document.addEventListener('pointermove', function (e) {
    if (!drag) return;
    if (!drag.on) {
      if (Math.abs(e.clientX - drag.x) + Math.abs(e.clientY - drag.y) < 6) return;
      var r = drag.el.getBoundingClientRect();
      drag.on = true; drag.ox = drag.x - r.left; drag.oy = drag.y - r.top; drag.src = r;
      drag.rects = dayEls.map(function (x) { return x.col.getBoundingClientRect(); });
      var g = drag.g = drag.el.cloneNode(true); g.classList.add('itn-ghost'); g.removeAttribute('aria-label'); g.setAttribute('aria-hidden', 'true'); g.tabIndex = -1; g.style.width = r.width + 'px';
      document.body.appendChild(g); root.classList.add('is-drag');
      if (drag.what.it) drag.what.it.el.classList.add('is-lift');
    }
    drag.g.style.transform = 'translate(' + (e.clientX - drag.ox).toFixed(1) + 'px,' + (e.clientY - drag.oy).toFixed(1) + 'px) rotate(-2deg)';
    var o = overDay(drag, e.clientX, e.clientY);
    dayEls.forEach(function (x, i) { x.col.classList.toggle('is-over', i === o); });
  });
  function endDrag(e, cancel) {
    var s = drag; drag = null;
    if (!s || !s.on) return;
    dragEnd = true; requestAnimationFrame(function () { dragEnd = false; });
    var o = cancel ? -1 : overDay(s, e.clientX, e.clientY), gr = s.g.getBoundingClientRect();
    dayEls.forEach(function (x) { x.col.classList.remove('is-over'); });
    root.classList.remove('is-drag');
    if (s.what.it) s.what.it.el.classList.remove('is-lift');
    if (o >= 0) {
      s.g.remove();
      if (s.what.c) addItem(s.what.c, o, gr);
      else if (s.what.it.d !== o) moveItem(s.what.it, o, gr);
      setTarget(o);
      return;
    }
    var back = s.g.animate([{ transform: s.g.style.transform, opacity: 1 }, { transform: 'translate(' + s.src.left.toFixed(1) + 'px,' + s.src.top.toFixed(1) + 'px)', opacity: 0 }], { duration: 260, easing: 'ease-in' });
    back.onfinish = function () { s.g.remove(); };
  }
  document.addEventListener('pointerup', function (e) { endDrag(e, false); });
  document.addEventListener('pointercancel', function (e) { endDrag(e, true); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && drag && drag.on) endDrag(e, true); });

  // ---------------------------------------------------------------- pricing
  function calc() {
    var r = { cost: 0, price: 0, cur: {}, ty: {}, sup: {}, fx: 0, n: [0, 0, 0, 0, 0] };
    items.forEach(function (it) {
      var c = C[it.c], s = c.c * RATE[c.cur], p = s * (1 + mk[c.t] / 100);
      r.cost += s; r.price += p;
      var u = r.cur[c.cur] || (r.cur[c.cur] = { amt: 0, sg: 0 }); u.amt += c.c; u.sg += s;
      r.ty[c.t] = (r.ty[c.t] || 0) + (p - s);
      var v = r.sup[c.s] || (r.sup[c.s] = { cur: c.cur, amt: 0, sg: 0, k: c.s }); v.amt += c.c; v.sg += s;
      if (c.t === 'ht') r.n[it.d]++;
    });
    // later payments in a foreign currency cost 3% more when the toggle is on: the exchange difference
    Object.keys(r.sup).forEach(function (k) {
      var v = r.sup[k], t = SUP[k]; v.po = t[0]; v.rule = t[1]; v.due = t[2]; v.paid = v.sg;
      if (fx && v.cur !== 'SGD' && v.due > BOOK) { v.paid = v.sg * 1.03; r.fx += v.paid - v.sg; }
    });
    r.mk = r.price - r.cost; r.mg = r.price - r.cost - r.fx; r.pct = r.price ? r.mg / r.price : 0;
    r.dep = r.price * dep / 100; r.bal = r.price - r.dep;
    return r;
  }
  function has(k, d) { return items.some(function (it) { return it.c === k && (d == null || it.d === d); }); }
  function checkList(r) {
    var w = [];
    for (var d = 0; d < 4; d++) { if (!r.n[d]) w.push('Day ' + (d + 1) + ' has no hotel night'); else if (r.n[d] > 1) w.push('Day ' + (d + 1) + ' has ' + r.n[d] + ' hotel nights'); }
    if (r.n[4]) w.push('Day 5 is the flight home: no night needed');
    if (!has('fo')) w.push('No outbound flight');
    if (!has('fr')) w.push('No flight home');
    for (d = 0; d < NDAY; d++) if ((has('fo', d) || has('fr', d)) && !has('ta', d)) w.push('Day ' + (d + 1) + ': a flight without an airport transfer');
    if (r.price && r.pct < TARGET) w.push('Margin ' + (r.pct * 100).toFixed(1) + '% is under the 12% target');
    return w;
  }

  // ---------------------------------------------------------------- the waterfall
  var WF = {}, plotH = 150;
  [['cost', 'Supplier cost'], ['mk', '+ Markup'], ['price', '= Price'], ['fx', '− Exchange diff.'], ['mg', '= Margin']].forEach(function (x) {
    var col = K.el('div', 'itn-wc itn-wc--' + x[0]), stk = K.el('div', 'itn-stk'), v = K.el('b', 'itn-wv');
    col.appendChild(stk); col.appendChild(v); col.appendChild(K.el('span', 'itn-wl', x[1])); wf.appendChild(col);
    WF[x[0]] = { col: col, stk: stk, v: v, s: {} };
  });
  function seg(col, k, cls, lines) { var s = K.el('i', 'itn-sg ' + cls); WF[col].stk.appendChild(s); WF[col].s[k] = s; if (lines) hover(s, lines); return s; }
  var last = null;
  CURS.forEach(function (c) { seg('cost', c, 'itn-c-' + c, function () { var u = last && last.cur[c]; return u ? [c + ' costs · ' + cm(u.amt, c), c === 'SGD' ? 'Paid in SGD' : 'At the sample rate ' + RATE[c] + ' = ' + sg(u.sg)] : [c, 'Nothing in ' + c]; }); });
  TORDER.forEach(function (t) { seg('mk', t, 'itn-t-' + t, function () { return [TY[t].n + ' · ' + mk[t] + '% on cost', 'Adds ' + sg(last ? last.ty[t] || 0 : 0) + ' to the price']; }); });
  seg('price', 'all', 'itn-sg--price'); seg('fx', 'all', 'itn-sg--fx'); seg('mg', 'all', 'itn-sg--mg');
  var tgt = K.el('i', 'itn-tgt'); WF.mg.stk.appendChild(tgt);
  function put(s, v0, v1, max) { s.style.transform = 'translateY(' + ((1 - v1 / max) * 100).toFixed(2) + '%) scaleY(' + Math.max(0, (v1 - v0) / max).toFixed(4) + ')'; }
  function lab(col, v1, max, txt) { var v = WF[col].v; v.textContent = txt; v.style.transform = 'translateY(' + ((1 - v1 / max) * plotH - 17).toFixed(1) + 'px)'; }
  function renderWF(r) {
    var max = Math.max(r.price, r.cost + r.fx, 1) * 1.14, y = 0;
    CURS.forEach(function (c) { var v = r.cur[c] ? r.cur[c].sg : 0; put(WF.cost.s[c], y, y + v, max); y += v; });
    y = r.cost;
    TORDER.forEach(function (t) { var v = r.ty[t] || 0; put(WF.mk.s[t], y, y + v, max); y += v; });
    put(WF.price.s.all, 0, r.price, max); put(WF.fx.s.all, r.price - r.fx, r.price, max); put(WF.mg.s.all, 0, Math.max(0, r.mg), max);
    tgt.style.transform = 'translateY(' + ((1 - r.price * TARGET / max) * plotH).toFixed(1) + 'px)';
    WF.mg.col.classList.toggle('is-low', r.price > 0 && r.pct < TARGET);
    lab('cost', r.cost, max, sg(r.cost)); lab('mk', r.price, max, '+' + sg(r.mk)); lab('price', r.price, max, sg(r.price));
    lab('fx', r.price, max, r.fx ? '−' + sg(r.fx) : 'none'); lab('mg', Math.max(0, r.mg), max, sg(r.mg) + ' · ' + (r.pct * 100).toFixed(1) + '%');
    WF.fx.col.classList.toggle('is-none', !r.fx);
  }

  // ---------------------------------------------------------------- summary, invoices, supplier payments, cash
  function row(list, cls, cells) {
    var li = K.el('li', cls);
    cells.forEach(function (c) { li.appendChild(K.el(c[0], c[1] || null, c[2])); });
    list.appendChild(li); return li;
  }
  function renderSum(r) {
    sumL.textContent = '';
    [['Quotation total', sg(r.price), 'is-big'], ['Supplier cost', sg(r.cost)], ['Margin', sg(r.mg) + ' · ' + (r.pct * 100).toFixed(1) + '%', r.price && r.pct < TARGET ? 'is-low' : 'is-ok']].forEach(function (x) {
      var dv = K.el('div', x[2] || null); dv.appendChild(K.el('dt', null, x[0])); dv.appendChild(K.el('dd', null, x[1])); sumL.appendChild(dv);
    });
    curL.textContent = '';
    CURS.forEach(function (c) { var u = r.cur[c]; if (u) row(curL, 'itn-c-' + c, [['i'], ['b', null, c], ['span', null, cm(u.amt, c)], ['em', null, sg(u.sg)]]); });
  }
  function renderInv(r) {
    invL.textContent = '';
    row(invL, 'is-sign', [['b', null, 'S00214'], ['span', null, 'Quotation signed online · ' + dd(SIGN)], ['em', null, sg(r.price)], ['small', null, 'Confirmed']]);
    row(invL, 'is-paid', [['b', null, 'INV/2026/00412'], ['span', null, 'Down payment ' + dep + '% · ' + dd(SIGN)], ['em', null, sg(r.dep)], ['small', null, 'Paid online']]);
    row(invL, null, [['b', null, 'INV/2026/00498'], ['span', null, 'Balance · ' + dd(BAL) + ', 30 days before departure'], ['em', null, sg(r.bal)], ['small', null, 'Scheduled']]);
  }
  function renderPay(r) {
    payL.textContent = '';
    Object.keys(r.sup).map(function (k) { return r.sup[k]; }).sort(function (a, b) { return a.due - b.due; }).forEach(function (v) {
      var li = row(payL, v.paid > v.sg + .5 ? 'is-fx' : null, [['b', null, v.po], ['span', null, v.k + ' · ' + v.rule], ['em', null, cm(v.amt, v.cur)], ['small', null, dd(v.due) + ' · ' + sg(v.paid)]]);
      if (v.paid > v.sg + .5) li.appendChild(K.el('i', 'itn-xd', 'Exchange difference ' + sg(v.paid - v.sg)));
    });
    if (!payL.firstChild) row(payL, 'is-empty', [['span', null, 'Add services to raise supplier orders']]);
  }
  var cashW = 360;
  function renderCash(r) {
    var ev = [[SIGN, r.dep, 'Deposit'], [BAL, r.bal, 'Balance']], by = {};
    Object.keys(r.sup).forEach(function (k) { var v = r.sup[k]; by[v.due] = (by[v.due] || 0) + v.paid; });
    Object.keys(by).forEach(function (t) { ev.push([+t, -by[t], 'Suppliers']); });
    ev.sort(function (a, b) { return a[0] - b[0] || b[1] - a[1]; });
    var t0 = SIGN - 5 * DAY, t1 = Date.UTC(2027, 0, 22), W = cashW, H = 150, pl = 8, pr = 8, top = 16, bot = 20;
    var cum = 0, pts = [], lo = 0, loAt = SIGN, minV = 0, maxV = 1;
    ev.forEach(function (e) { cum += e[1]; pts.push([e[0], cum]); if (cum < lo - .5) { lo = cum; loAt = e[0]; } minV = Math.min(minV, cum, e[1]); maxV = Math.max(maxV, cum, e[1]); });
    function X(t) { return pl + (t - t0) / (t1 - t0) * (W - pl - pr); }
    function Y(v) { return top + (maxV - v) / (maxV - minV || 1) * (H - top - bot); }
    cash.setAttribute('viewBox', '0 0 ' + W + ' ' + H); cash.textContent = '';
    [Date.UTC(2026, 9, 1), Date.UTC(2026, 10, 1), Date.UTC(2026, 11, 1), Date.UTC(2027, 0, 1)].forEach(function (t) {
      cash.appendChild(K.svg('line', { x1: X(t), x2: X(t), y1: top - 6, y2: H - bot, 'class': 'itn-gl' }));
      var tx = K.svg('text', { x: X(t) + 3, y: H - 6, 'class': 'itn-gt' }); tx.textContent = new Date(t).toLocaleDateString('en-GB', { month: 'short', timeZone: 'UTC' }); cash.appendChild(tx);
    });
    cash.appendChild(K.svg('line', { x1: pl, x2: W - pr, y1: Y(0), y2: Y(0), 'class': 'itn-zero' }));
    var px = -99;
    ev.forEach(function (e) {
      var x = Math.max(X(e[0]), px + 8), y0 = Y(0), y1 = Y(e[1]); px = x;          // keep bars a few days apart readable
      cash.appendChild(K.svg('rect', { x: (x - 3).toFixed(1), y: Math.min(y0, y1).toFixed(1), width: 6, height: Math.max(1, Math.abs(y1 - y0)).toFixed(1), rx: 1.5, 'class': e[1] >= 0 ? 'itn-in' : 'itn-out' }));
    });
    var d = 'M' + X(t0).toFixed(1) + ' ' + Y(0).toFixed(1);
    pts.forEach(function (p) { d += 'H' + X(p[0]).toFixed(1) + 'V' + Y(p[1]).toFixed(1); });
    d += 'H' + X(t1).toFixed(1);
    var cp = K.svg('clipPath', { id: 'itn-clip' }); cp.appendChild(K.svg('path', { d: d + 'V' + Y(0).toFixed(1) + 'Z' })); cash.appendChild(cp);
    cash.appendChild(K.svg('rect', { x: pl, y: 0, width: W - pl - pr, height: Y(0).toFixed(1), 'class': 'itn-pos', 'clip-path': 'url(#itn-clip)' }));
    cash.appendChild(K.svg('rect', { x: pl, y: Y(0).toFixed(1), width: W - pl - pr, height: Math.max(0, H - Y(0)).toFixed(1), 'class': 'itn-neg', 'clip-path': 'url(#itn-clip)' }));
    cash.appendChild(K.svg('path', { d: d, 'class': 'itn-cum' }));
    if (lo < -.5) { var m = K.svg('circle', { cx: X(loAt), cy: Y(lo), r: 3.5, 'class': 'itn-lo' }); cash.appendChild(m); }
    cashN.textContent = '';
    cashN.classList.toggle('is-low', lo < -.5);
    cashN.appendChild(K.el('b', null, lo < -.5 ? 'Cash gap ' + sg(-lo) + ' from ' + dd(loAt) : 'Covered all the way'));
    cashN.appendChild(document.createTextNode(lo < -.5 ? ': suppliers paid at booking cost more than the ' + dep + '% deposit until the balance arrives on ' + dd(BAL) + '.' : ': the deposit covers every supplier payment due before the balance.'));
  }
  function update() {
    var r = calc(); last = r;
    items.forEach(function (it) {
      var c = C[it.c], s = c.c * RATE[c.cur];
      it.pr.textContent = cm(c.c, c.cur) + ' · sells ' + sg(s * (1 + mk[c.t] / 100));
      it.btn.setAttribute('aria-label', c.n + ' on day ' + (it.d + 1) + '. Arrow keys move it to another day, Delete removes it');
    });
    dayEls.forEach(function (x, d) {
      var n = r.n[d], warn = d < 4 ? n !== 1 : n > 0;
      x.night.classList.toggle('is-warn', warn); x.night.classList.toggle('is-empty', !n);
      x.ns.textContent = d === 4 ? (n ? 'No night needed' : 'No night · flight home') : n === 0 ? 'Drop a hotel night' : n > 1 ? n + ' nights booked' : '';
    });
    var w = checkList(r);
    checks.textContent = '';
    if (!w.length) row(checks, 'is-ok', [['b', null, '✓'], ['span', null, '4 nights, flights and transfers in place, margin above the 12% target']]);
    w.slice(0, 3).forEach(function (m) { row(checks, null, [['b', null, '!'], ['span', null, m]]); });
    if (w.length > 3) row(checks, 'is-more', [['span', null, '+' + (w.length - 3) + ' more']]);
    renderWF(r); renderSum(r); renderInv(r); renderPay(r); renderCash(r);
  }

  // ---------------------------------------------------------------- controls
  K.$$('input[data-m]', root).forEach(function (s) {
    var out = s.parentNode.querySelector('output');
    s.addEventListener('input', function () { mk[s.dataset.m] = +s.value; out.textContent = s.value + '%'; update(); });
  });
  K.$$('[data-dep]', root).forEach(function (b) {
    b.addEventListener('click', function () {
      dep = +b.dataset.dep;
      K.$$('[data-dep]', root).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      update();
    });
  });
  fxB.addEventListener('click', function () { fx = !fx; fxB.setAttribute('aria-pressed', String(fx)); update(); });
  function build(animate) {
    jobs = [];
    items.slice().forEach(function (it) { it.el.remove(); }); items = [];
    if (!animate) { DEF.forEach(function (x) { addItem(x[0], x[1], null); }); return; }
    update();
    DEF.forEach(function (x, i) { at(260 + i * 190, function () { addItem(x[0], x[1], palBtn[x[0]].getBoundingClientRect()); }); });
  }
  K.$('[data-reset]', root).addEventListener('click', function () {
    TORDER.forEach(function (t) { mk[t] = TY[t].m; });
    K.$$('input[data-m]', root).forEach(function (s) { s.value = mk[s.dataset.m]; s.parentNode.querySelector('output').textContent = s.value + '%'; });
    dep = 30; K.$$('[data-dep]', root).forEach(function (x) { x.setAttribute('aria-pressed', String(x.dataset.dep === '30')); });
    fx = false; fxB.setAttribute('aria-pressed', 'false');
    setTarget(0); build(!K.reduce);
  });
  function size() {
    plotH = WF.cost.stk.offsetHeight || plotH;
    var w = cash.getBoundingClientRect().width; if (w) cashW = Math.round(w);   // the svg's own width, so the drawing is 1:1
  }
  var rz = 0;
  window.addEventListener('resize', function () { if (rz) return; rz = requestAnimationFrame(function () { rz = 0; size(); update(); }); });

  setTarget(0); size(); update();
  if (K.reduce) { built = true; build(false); }
  return {
    start: function (first) {
      vis = true; size();
      if (first && !built) { built = true; build(true); }
      if (jobs.length) loop.on();
    },
    stop: function () { vis = false; loop.off(); }
  };
});
