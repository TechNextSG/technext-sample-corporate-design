/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* F&B page demo: floor plan to kitchen. Parties arrive and are seated at the smallest free table;
   each table runs free -> seated -> ordered -> served -> paying. An order splits by category into
   tickets for the grill, fryer and drinks stations of the kitchen display (FIFO, station capacity,
   timers that go amber at 8 and red at 12 minutes). Paying deducts every dish's recipe (bill of
   materials) from stock and adds its cost, so food cost per dish and per night is known; ingredients
   below par raise supplier RFQs, stock below zero offers to snooze the dishes that use it. Closing the
   session waits for open tables, then posts sales by category, GST 9%, card and cash, and cost of
   goods sold as balanced journal entries. Controls: dinner rush, pause, click a table, press a dish
   for its recipe, snooze, close session. Seeded, so reduced motion shows a real computed state. */
TN.demo('kitchen', function (root, K) {
  'use strict';
  var floor = K.$('.ktn-floor', root), bottom = K.$('.ktn-bottom', root), closeEl = K.$('.ktn-close', root);
  var clockEl = K.$('[data-clock]', root), tagEl = K.$('[data-tag]', root), queueEl = K.$('[data-queue]', root);
  var bRush = K.$('[data-rush]', root), bPause = K.$('[data-pause]', root), bClose = K.$('[data-close]', root), bNext = K.$('[data-next]', root);
  var ingList = K.$('.ktn-ings', root), dishList = K.$('.ktn-dishes', root);
  var KP = {}, O = {}, CL = {}, COLS = {};
  ['covers', 'bills', 'sales', 'tt', 'fc'].forEach(function (k) { KP[k] = K.$('[data-k="' + k + '"]', root); });
  'title state sub lines tot'.split(' ').forEach(function (k) { O[k] = K.$('[data-o="' + k + '"]', root); });
  'title sub sum je dr cr po'.split(' ').forEach(function (k) { CL[k] = K.$('[data-c="' + k + '"]', root); });
  ['grill', 'fryer', 'drinks'].forEach(function (st) { var c = K.$('.ktn-col[data-st="' + st + '"]', root); COLS[st] = { list: K.$('.ktn-tix', c), head: K.$('.ktn-ch small', c) }; });
  var logEl = K.$('.ktn-log', root);

  var SPEED = .42, DT = .25, END = 240, LAST = 225, WARN = 8, ALERT = 12, RUSH_X = 2.2;
  var STN = { grill: { name: 'Grill', cap: 2 }, fryer: { name: 'Fryer', cap: 2 }, drinks: { name: 'Drinks', cap: 1 } };
  var SK = ['grill', 'fryer', 'drinks'];
  // ingredient: name, unit, unit cost; tracked ones add on hand, par, max and supplier
  var ING = {
    chk: ['Chicken thigh', 'kg', 9.5, 9, 4, 12, 'Tan Poultry'], pat: ['Beef patties', 'pcs', 3.2, 30, 12, 40, 'Tan Poultry'],
    bun: ['Burger buns', 'pcs', .55, 36, 12, 48, 'GreenLeaf Produce'], fsh: ['Fish fillet', 'kg', 18, 4.2, 2, 6, 'Harbour Seafood'],
    sqd: ['Squid', 'kg', 16, 2.6, 1.2, 4, 'Harbour Seafood'], fry: ['Fries', 'kg', 4, 10, 4, 14, 'GreenLeaf Produce'],
    lme: ['Limes', 'pcs', .25, 60, 24, 90, 'GreenLeaf Produce'],
    ric: ['Rice', 'kg', 2.4], chs: ['Chilli-ginger sauce', 'kg', 6], chd: ['Cheddar slice', 'pcs', .35], pnt: ['Peanut sauce', 'kg', 6],
    rcc: ['Rice cakes', 'kg', 2], btr: ['Batter mix', 'kg', 4], trt: ['Tartare sauce', 'kg', 5], aio: ['Aioli', 'kg', 5],
    tea: ['Tea leaves', 'kg', 20], cdm: ['Condensed milk', 'kg', 5.5], syr: ['Sugar syrup', 'L', 3]
  };
  var TRACK = ['chk', 'pat', 'bun', 'fsh', 'sqd', 'fry', 'lme'];
  // dish: name, station, price before GST, prep minutes, recipe lines [ingredient, quantity]
  var DISH = {
    ckr: ['Grilled chicken rice', 'grill', 12.8, 8, [['chk', .2], ['ric', .15], ['chs', .04]]],
    bgr: ['Beef burger', 'grill', 16.5, 10, [['pat', 1], ['bun', 1], ['chd', 1], ['fry', .15]]],
    sat: ['Chicken satay', 'grill', 11, 9, [['chk', .25], ['pnt', .08], ['rcc', .1]]],
    fnc: ['Fish & chips', 'fryer', 15.8, 7, [['fsh', .18], ['fry', .2], ['btr', .05], ['trt', .03]]],
    cal: ['Calamari', 'fryer', 12.5, 5, [['sqd', .15], ['btr', .04], ['aio', .03]]],
    tth: ['Teh tarik', 'drinks', 3.2, 2, [['tea', .01], ['cdm', .04]]],
    lim: ['Fresh lime juice', 'drinks', 5, 2, [['lme', 3], ['syr', .03]]]
  };
  var DK = ['ckr', 'bgr', 'sat', 'fnc', 'cal', 'tth', 'lim'];
  var MAINS = [['ckr', .3], ['bgr', .26], ['sat', .16], ['fnc', .28]], DRINKS = [['tth', .55], ['lim', .45]];
  // table: name, seats, shape (r round, s square, w wide, v tall), x, y, phone x, phone y, zone
  var TAB = [['T1', 2, 'r', 10, 25, 11, 23], ['T3', 4, 's', 27, 25, 29, 23], ['T5', 4, 's', 44, 25, 47, 23], ['T7', 2, 'r', 60, 25, 63, 23],
             ['T2', 2, 'r', 10, 57, 11, 55], ['T4', 4, 's', 27, 57, 29, 55], ['T6', 6, 'w', 50, 58, 51, 57],
             ['T8', 4, 's', 85, 22, 86, 21], ['T9', 2, 'r', 85, 48, 86, 47], ['T10', 6, 'v', 85, 77, 86, 76]];
  var SIZES = [[1, .12], [2, .42], [3, .16], [4, .18], [5, .06], [6, .06]];
  var LABEL = { free: 'Free', seat: 'Seated', order: 'Ordered', served: 'Served', pay: 'Paying', clean: 'Clearing' };
  var C = { seat: 'var(--tok-stock)', order: 'var(--tok-buy)', served: 'var(--ok)', pay: 'var(--tok-pay)', late: 'var(--tok-late)', make: 'var(--tok-make)' };
  var rush = false, paused = false, sel = 5, fast = 1, sess = 42;

  function rng(a) { return function () { a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function cost(d) { return DISH[d][4].reduce(function (s, l) { return s + l[1] * ING[l[0]][2]; }, 0); }
  function cents(v) { return Math.round(v * 100); }
  function sgd(c) { return 'S$ ' + (c / 100).toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function hm(t) { var m = Math.floor(t) + 18 * 60; return Math.floor(m / 60) + ':' + ('0' + m % 60).slice(-2); }
  function qfmt(v, u) { return (u === 'pcs' ? Math.round(v) : v.toFixed(1)) + ' ' + u; }

  // ------------------------------------------------------------------ state
  var S, stock = {}, snoozed = {}, pos = [], seqPo = 76;
  TRACK.forEach(function (k) { stock[k] = ING[k][3]; });
  function fresh() {
    S = { t: 0, r: rng(1800 + sess), tables: TAB.map(function (d, i) { return { i: i, st: 'free', party: 0, tSeat: 0, tNext: 0, ord: null, last: null }; }),
          queue: [], tix: [], no: 140 + (sess - 42) * 60, covers: 0, bills: 0, net: 0, gst: 0, food: 0, drinks: 0, card: 0, cash: 0, cogs: 0,
          times: [], walk: 0, closing: false, closed: false, acc: 0, dirty: true, kd: true, sd: true, od: true };
  }
  function pick(list) {
    var l = list.filter(function (x) { return !snoozed[x[0]]; }); if (!l.length) return null;
    var tot = l.reduce(function (s, x) { return s + x[1]; }, 0), r = S.r() * tot;
    for (var i = 0; i < l.length; i++) { r -= l[i][1]; if (r <= 0) return l[i][0]; }
    return l[l.length - 1][0];
  }
  function rate(t) { return t < 30 ? .07 : t < 60 ? .12 : t < 150 ? .16 : t < 195 ? .1 : t < LAST ? .05 : 0; }

  function takeOrder(tb) {
    var n = tb.party, q = {};
    function add(d) { if (d) q[d] = (q[d] || 0) + 1; }
    for (var g = 0; g < n; g++) { add(pick(MAINS)); if (S.r() < .78) add(pick(DRINKS)); }
    if (n >= 2 && S.r() < .45 && !snoozed.cal) add('cal');
    var lines = DK.filter(function (d) { return q[d]; }).map(function (d) { return [d, q[d]]; });
    var o = { no: ++S.no, lines: lines, tix: [], net: 0, t0: S.t };
    lines.forEach(function (l) { o.net += cents(DISH[l[0]][2]) * l[1]; });
    SK.forEach(function (st) {
      var its = lines.filter(function (l) { return DISH[l[0]][1] === st; });
      if (!its.length) return;
      var dur = Math.max.apply(null, its.map(function (l) { return DISH[l[0]][3]; })) + .5 * (its.reduce(function (s, l) { return s + l[1]; }, 0) - 1);
      var tk = { tb: tb.i, no: o.no, st: st, its: its, t0: S.t, tStart: 0, dur: dur * (.85 + S.r() * .3), s: 'queue', el: null };
      S.tix.push(tk); o.tix.push(tk);
    });
    tb.ord = o; tb.st = 'order'; S.kd = true;
    ev(TAB[tb.i][0] + ' order <b>#' + o.no + '</b> sent: ' + o.tix.length + ' ticket' + (o.tix.length > 1 ? 's' : '') + ' (' + o.tix.map(function (k) { return STN[k.st].name.toLowerCase(); }).join(', ') + ')', C.order);
  }
  function pay(tb) {
    var o = tb.ord, g = Math.round(o.net * .09), card = S.r() < .74;
    S.bills++; S.net += o.net; S.gst += g;
    o.lines.forEach(function (l) {
      var d = DISH[l[0]], c = cents(d[2]) * l[1];
      if (d[1] === 'drinks') S.drinks += c; else S.food += c;
      d[4].forEach(function (r) { if (stock[r[0]] != null) stock[r[0]] -= r[1] * l[1]; });
      S.cogs += cost(l[0]) * l[1] * 100;
    });
    if (card) S.card += o.net + g; else S.cash += o.net + g;
    o.paid = card ? 'card' : 'cash'; o.gst = g; tb.last = o; S.sd = true;
    ev(TAB[tb.i][0] + ' paid <b>' + sgd(o.net + g) + '</b> by ' + o.paid + ': recipes deduct the ingredients', C.pay);
    TRACK.forEach(function (k) {
      var ing = ING[k];
      if (stock[k] < ing[4] && !pos.some(function (p) { return p.k === k && !p.recv; })) {
        var q = ing[1] === 'pcs' ? Math.ceil(ing[5] - stock[k]) : Math.ceil((ing[5] - stock[k]) * 2) / 2;
        var p = { ref: 'P' + ('0000' + (++seqPo)).slice(-5), k: k, q: q, recv: false };
        pos.push(p);
        ev(ing[0] + ' below par (' + qfmt(Math.max(0, stock[k]), ing[1]) + '): RFQ <b>' + p.ref + '</b> to ' + ing[6] + ' for ' + qfmt(q, ing[1]), C.order);
      }
      if (stock[k] < 0 && !neg[k]) { neg[k] = true; ev('<b>' + ing[0] + '</b> below zero: sold without stock on hand, snooze its dishes or recount', C.late); }
    });
  }
  var neg = {};
  function step() {
    var t = S.t;
    if (!S.closing && S.r() < rate(t) * (rush ? RUSH_X : 1) * DT) {
      var n = 1, r = S.r(); for (var i = 0; i < SIZES.length; i++) { r -= SIZES[i][1]; if (r <= 0) { n = SIZES[i][0]; break; } }
      S.queue.push({ n: n, t: t });
    }
    S.queue = S.queue.filter(function (p) {                       // seat at the smallest free table that fits
      var best = null;
      S.tables.forEach(function (tb) { var s = TAB[tb.i][1]; if (tb.st === 'free' && s >= p.n && (!best || s < TAB[best.i][1])) best = tb; });
      if (best) { best.st = 'seat'; best.party = p.n; best.tSeat = t; best.tNext = t + 2 + S.r() * 2; best.last = null; S.covers += p.n; S.dirty = true; return false; }
      if (t - p.t > 15) { S.walk++; ev('A party of ' + p.n + ' left after waiting 15 min: no table free', C.late); return false; }
      return true;
    });
    S.tables.forEach(function (tb) {
      if (tb.st === 'seat' && t >= tb.tNext) { takeOrder(tb); S.dirty = S.od = true; }
      else if (tb.st === 'order') {
        // drinks go out as soon as they are ready; the pass holds the food until the whole table's food is ready
        var tx = tb.ord.tix, food = tx.filter(function (k) { return k.st !== 'drinks'; });
        tx.forEach(function (k) { if (!k.gone && k.st === 'drinks' && k.s === 'ready' && t >= k.tDone + 1) { k.gone = true; S.kd = S.od = true; } });
        if (!food.some(function (k) { return k.s !== 'ready'; })) {
          var rd = Math.max.apply(null, food.map(function (k) { return k.tDone; }).concat([0]));
          if (t >= rd + 1) food.forEach(function (k) { if (!k.gone) { k.gone = true; S.kd = S.od = true; } });
        }
        if (tx.every(function (k) { return k.gone; })) { tb.st = 'served'; tb.tNext = t + 16 + S.r() * 10; S.dirty = S.od = true; }
        if (S.kd) S.tix = S.tix.filter(function (k) { return !k.gone; });
      }
      else if (tb.st === 'served' && t >= tb.tNext) { tb.st = 'pay'; tb.tNext = t + 2 + S.r() * 2; S.dirty = S.od = true; }
      else if (tb.st === 'pay' && t >= tb.tNext) { pay(tb); tb.st = 'clean'; tb.tNext = t + 1.5; S.dirty = S.od = true; }
      else if (tb.st === 'clean' && t >= tb.tNext) { tb.st = 'free'; tb.party = 0; S.dirty = S.od = true; }
    });
    SK.forEach(function (st) {                                     // first in, first out, up to the station's capacity
      var mine = S.tix.filter(function (k) { return k.st === st; }), busy = mine.filter(function (k) { return k.s === 'cook'; }).length;
      mine.forEach(function (k) {
        if (k.s === 'cook' && t >= k.tStart + k.dur) { k.s = 'ready'; k.tDone = t; busy--; S.times.push(t - k.t0); if (S.times.length > 12) S.times.shift(); S.kd = S.od = true; }
      });
      mine.forEach(function (k) { if (k.s === 'queue' && busy < STN[st].cap) { k.s = 'cook'; k.tStart = t; busy++; S.kd = S.od = true; } });
    });
    S.t = +(t + DT).toFixed(2);
    if (S.t >= END && !S.closing) startClose(true);
    if (S.closing && !S.closed && S.tables.every(function (tb) { return tb.st === 'free'; })) close();
  }

  // ------------------------------------------------------------------ floor plan
  var tabs = TAB.map(function (d, i) {
    var b = K.el('button', 'ktn-t ktn-t--' + d[2]); b.type = 'button';
    b.style.cssText = '--x:' + d[3] + '%;--y:' + d[4] + '%;--mx:' + d[5] + '%;--my:' + d[6] + '%';
    var chairs = [];
    for (var c = 0; c < d[1]; c++) { var ch = K.el('i', 'ktn-seat ktn-seat--' + d[2] + d[1] + '-' + c); b.appendChild(ch); chairs.push(ch); }
    var lab = K.el('span', 'ktn-tl'); var nm = K.el('b', null, d[0]), sub = K.el('small', null, d[1] + ' seats'); lab.appendChild(nm); lab.appendChild(sub); b.appendChild(lab);
    b.addEventListener('click', function () { select(i); });
    floor.appendChild(b);
    return { el: b, sub: sub, chairs: chairs, key: '' };
  });
  function drawTables() {
    S.tables.forEach(function (tb, i) {
      var e = tabs[i], d = TAB[i], m = tb.st === 'free' ? '' : Math.floor(S.t - tb.tSeat) + '′';
      var key = tb.st + '|' + tb.party + '|' + m;
      if (key === e.key) return; e.key = key;
      e.el.dataset.s = tb.st;
      e.sub.textContent = tb.st === 'free' ? d[1] + ' seats' : tb.party + ' · ' + m;
      e.chairs.forEach(function (ch, c) { ch.classList.toggle('is-on', tb.st !== 'free' && c < tb.party); });
      e.el.setAttribute('aria-label', d[0] + ', ' + d[1] + ' seats, ' + LABEL[tb.st].toLowerCase() + (tb.party && tb.st !== 'free' ? ', party of ' + tb.party : '') + '. Show the order');
    });
    var q = S.queue.length;
    queueEl.textContent = q ? q + ' waiting' : '';
  }
  function select(i) {
    sel = i; tabs.forEach(function (e, j) { e.el.setAttribute('aria-pressed', String(j === i)); });
    S.od = true; drawOrder();
  }

  // ------------------------------------------------------------------ kitchen display
  function tkEl(k) {
    var li = K.el('li', 'ktn-tk'), h = K.el('p', 'ktn-tkh');
    h.appendChild(K.el('b', null, TAB[k.tb][0] + ' · #' + k.no)); k.tm = K.el('em', null, '0′'); h.appendChild(k.tm); li.appendChild(h);
    var ul = K.el('ul');
    k.its.forEach(function (l) { ul.appendChild(K.el('li', null, l[1] + ' × ' + DISH[l[0]][0])); });
    li.appendChild(ul);
    var bar = K.el('span', 'ktn-tkb'); k.bar = K.el('i'); bar.appendChild(k.bar); li.appendChild(bar);
    k.lab = K.el('small', 'ktn-tks', 'Waiting'); li.appendChild(k.lab);
    return li;
  }
  function drawKds() {
    SK.forEach(function (st) {
      var col = COLS[st], mine = S.tix.filter(function (k) { return k.st === st; });
      K.$$('.ktn-tk', col.list).forEach(function (li) { if (!mine.some(function (k) { return k.el === li; })) li.remove(); });
      mine.forEach(function (k) { if (!k.el) { k.el = tkEl(k); col.list.appendChild(k.el); } k.el.dataset.s = k.s; k.lab.textContent = k.s === 'queue' ? 'Waiting' : k.s === 'cook' ? 'Cooking' : 'Ready'; });
      var ck = mine.filter(function (k) { return k.s === 'cook'; }).length, wq = mine.filter(function (k) { return k.s === 'queue'; }).length;
      col.head.textContent = ck + ' cooking · ' + wq + ' waiting';
    });
  }
  function tickKds() {                                             // timers and progress, per frame
    var t = S.t + S.acc;
    S.tix.forEach(function (k) {
      if (!k.el) return;
      var age = Math.floor((k.s === 'ready' ? k.tDone : t) - k.t0), txt = age + '′';
      if (k.tm.textContent !== txt || k.ls !== k.s) { k.tm.textContent = txt; k.ls = k.s; k.el.classList.toggle('is-warn', age >= WARN && age < ALERT && k.s !== 'ready'); k.el.classList.toggle('is-late', age >= ALERT && k.s !== 'ready'); }
      var p = k.s === 'queue' ? 0 : k.s === 'ready' ? 1 : K.clamp((t - k.tStart) / k.dur, 0, 1);
      k.bar.style.transform = 'scaleX(' + p.toFixed(3) + ')';
    });
  }

  // ------------------------------------------------------------------ panels
  function drawOrder() {
    var tb = S.tables[sel], d = TAB[sel], o = tb.st === 'free' || tb.st === 'clean' ? tb.last : tb.ord;
    if (tb.st === 'seat') o = null;
    O.title.textContent = d[0] + ' · ' + d[1] + ' seats';
    O.state.textContent = LABEL[tb.st]; O.state.dataset.s = tb.st;
    O.lines.textContent = ''; O.tot.textContent = '';
    if (tb.st === 'free' && !o) { O.sub.textContent = 'Free: the next party that fits is seated here.'; return; }
    if (!o) { O.sub.textContent = 'Party of ' + tb.party + ' seated at ' + hm(tb.tSeat) + ', reading the menu.'; return; }
    O.sub.textContent = o.paid ? 'Paid by ' + o.paid + ' at ' + hm(tb.tNext - 1.5) + ': ingredients deducted through the recipes' : 'Party of ' + tb.party + ' · order #' + o.no + ' sent at ' + hm(o.t0);
    var fcost = 0;
    o.lines.forEach(function (l) {
      var dd = DISH[l[0]], tk = o.tix.filter(function (k) { return k.st === dd[1]; })[0];
      var li = K.el('li'); li.style.setProperty('--c', 'var(--ktn-' + dd[1] + ')');
      li.appendChild(K.el('b', null, l[1] + ' × ' + dd[0]));
      li.appendChild(K.el('span', 'ktn-lst', o.paid ? 'Served' : tk && tk.gone ? 'Served' : tk ? (tk.s === 'queue' ? 'Waiting' : tk.s === 'cook' ? 'Cooking' : 'Ready') : ''));
      li.appendChild(K.el('em', null, sgd(cents(dd[2]) * l[1])));
      O.lines.appendChild(li); fcost += cost(l[0]) * l[1];
    });
    var g = Math.round(o.net * .09);
    [['Subtotal', sgd(o.net)], ['GST 9%', sgd(g)], ['Total', sgd(o.net + g)], ['Food cost of this order', sgd(cents(fcost)) + ' · ' + (fcost / (o.net / 100) * 100).toFixed(1) + '%']].forEach(function (r, i) {
      var div = K.el('div', i === 2 ? 'ktn-grand' : null); div.appendChild(K.el('dt', null, r[0])); div.appendChild(K.el('dd', null, r[1])); O.tot.appendChild(div);
    });
  }
  var ingRows = {};
  TRACK.forEach(function (k) {
    var ing = ING[k], li = K.el('li'), top = K.el('span', 'ktn-it');
    top.appendChild(K.el('b', null, ing[0])); var q = K.el('em'); top.appendChild(q); li.appendChild(top);
    var bar = K.el('span', 'ktn-ib'), fill = K.el('i'), par = K.el('s'); bar.appendChild(fill); bar.appendChild(par); li.appendChild(bar);
    par.style.left = (ing[4] / ing[5] * 100).toFixed(1) + '%';
    var note = K.el('small', 'ktn-in'); li.appendChild(note);
    var sn = K.el('button', 'ktn-snz', 'Snooze its dishes'); sn.type = 'button'; sn.hidden = true; li.appendChild(sn);
    sn.addEventListener('click', function () {
      var names = DK.filter(function (d) { return !snoozed[d] && DISH[d][4].some(function (r) { return r[0] === k; }); });
      names.forEach(function (d) { snoozed[d] = true; });
      ev('Snoozed on the POS: <b>' + names.map(function (d) { return DISH[d][0]; }).join(', ') + '</b> (Odoo 20)', C.make);
      drawStock(); drawMenu();
    });
    ingList.appendChild(li);
    ingRows[k] = { li: li, q: q, fill: fill, note: note, sn: sn };
  });
  function drawStock() {
    TRACK.forEach(function (k) {
      var ing = ING[k], r = ingRows[k], v = stock[k], p = pos.filter(function (x) { return x.k === k && !x.recv; })[0];
      r.q.textContent = qfmt(v, ing[1]) + ' · par ' + qfmt(ing[4], ing[1]);
      r.fill.style.transform = 'scaleX(' + K.clamp(v / ing[5], 0, 1).toFixed(3) + ')';
      r.li.dataset.s = v < 0 ? 'neg' : v < ing[4] ? 'low' : '';
      r.note.textContent = p ? 'RFQ ' + p.ref + ' to ' + ing[6] + ' · ' + qfmt(p.q, ing[1]) + ' for tomorrow' : v < ing[4] ? 'Below par' : '';
      var open = DK.some(function (d) { return !snoozed[d] && DISH[d][4].some(function (x) { return x[0] === k; }); });
      r.sn.hidden = !(v <= 0 && open);
    });
  }
  var dishRows = {};
  DK.forEach(function (d) {
    var dd = DISH[d], c = cost(d), pc = c / dd[2] * 100;
    var li = K.el('li'), b = K.el('button', 'ktn-dish'); b.type = 'button'; b.setAttribute('aria-expanded', 'false');
    b.style.setProperty('--c', 'var(--ktn-' + dd[1] + ')');
    var nm = K.el('span', 'ktn-dn'); nm.appendChild(K.el('b', null, dd[0])); nm.appendChild(K.el('small', null, STN[dd[1]].name + ' · ' + sgd(cents(dd[2])))); b.appendChild(nm);
    var bar = K.el('span', 'ktn-fcb'); var fi = K.el('i'); fi.style.transform = 'scaleX(' + Math.min(1, pc / 40).toFixed(3) + ')'; bar.appendChild(fi); b.appendChild(bar);
    b.appendChild(K.el('em', pc >= 30 ? 'is-hi' : null, pc.toFixed(1) + '%'));
    var tag = K.el('span', 'ktn-snzd', 'Snoozed'); tag.hidden = true; b.appendChild(tag);
    li.appendChild(b);
    var rec = K.el('ul', 'ktn-rec'); rec.hidden = true;
    dd[4].forEach(function (r) { var ing = ING[r[0]], x = K.el('li'); x.appendChild(K.el('span', null, ing[0] + ' · ' + (ing[1] === 'pcs' ? r[1] : r[1].toFixed(2)) + ' ' + ing[1])); x.appendChild(K.el('em', null, sgd(cents(r[1] * ing[2])))); rec.appendChild(x); });
    var tot = K.el('li', 'ktn-rt'); tot.appendChild(K.el('span', null, 'Recipe cost (bill of materials)')); tot.appendChild(K.el('em', null, sgd(cents(c)))); rec.appendChild(tot);
    li.appendChild(rec);
    b.addEventListener('click', function () {
      if (snoozed[d]) { snoozed[d] = false; ev(dd[0] + ' back on the menu', C.make); drawMenu(); drawStock(); return; }
      var open = rec.hidden; rec.hidden = !open; b.setAttribute('aria-expanded', String(open));
    });
    dishList.appendChild(li);
    dishRows[d] = { b: b, tag: tag };
  });
  function drawMenu() { DK.forEach(function (d) { var r = dishRows[d]; r.tag.hidden = !snoozed[d]; r.b.classList.toggle('is-snz', !!snoozed[d]); }); }
  function drawKpis() {
    KP.covers.textContent = String(S.covers); KP.bills.textContent = String(S.bills);
    KP.sales.textContent = 'S$ ' + Math.round(S.net / 100).toLocaleString('en-SG');
    var tt = S.times.length ? S.times.reduce(function (a, b) { return a + b; }, 0) / S.times.length : 0;
    KP.tt.textContent = tt.toFixed(1) + ' min'; KP.tt.parentNode.classList.toggle('ktn-bad', tt >= ALERT);
    KP.fc.textContent = S.net ? (S.cogs / S.net * 100).toFixed(1) + '%' : '0%';
  }
  var quiet = false, evq = [];
  function ev(html, c) { if (quiet) { evq.push([html, c]); evq = evq.slice(-4); return; } put(html, c); }
  function put(html, c) { var li = K.log(logEl, '<i></i><span>' + html + '</span>', null, 3); li.style.setProperty('--c', c); }
  function drawAll() {
    drawTables();
    if (S.kd) drawKds();
    if (S.od) drawOrder();
    if (S.sd) drawStock();
    drawKpis(); S.dirty = S.kd = S.od = S.sd = false;
  }

  // ------------------------------------------------------------------ closing the session
  function startClose(auto) {
    if (S.closing) return;
    S.closing = true; S.queue = [];
    var open = S.tables.filter(function (tb) { return tb.st !== 'free'; }).length;
    ev((auto ? '22:00, ' : '') + 'Closing: no new guests' + (open ? ', waiting for ' + open + ' open table' + (open > 1 ? 's' : '') + ' to pay' : ''), C.pay);
    tagEl.textContent = 'Closing'; fast = 4; bClose.disabled = true;
  }
  function close() {
    S.closed = true; fast = 1;
    CL.title.textContent = 'Session Outlet 1/000' + sess + ' closed and posted';
    CL.sub.textContent = '18:00 to ' + hm(S.t) + ' · ' + S.bills + ' bills · ' + S.covers + ' covers' + (S.walk ? ' · ' + S.walk + ' parties left waiting' : '');
    CL.sum.textContent = '';
    var fc = S.net ? S.cogs / S.net * 100 : 0;
    [['Food sales', sgd(S.food)], ['Beverage sales', sgd(S.drinks)], ['GST 9% collected', sgd(S.gst)], ['Card payments', sgd(S.card)], ['Cash counted', sgd(S.cash) + ' · difference S$ 0.00'], ['Food cost', sgd(Math.round(S.cogs)) + ' · ' + fc.toFixed(1) + '% of sales']].forEach(function (r) {
      var div = K.el('div'); div.appendChild(K.el('dt', null, r[0])); div.appendChild(K.el('dd', null, r[1])); CL.sum.appendChild(div);
    });
    var cogs = Math.round(S.cogs), JE = [['Card (outstanding receipts)', S.card, 0], ['Cash', S.cash, 0], ['Food sales', 0, S.food], ['Beverage sales', 0, S.drinks], ['GST output tax 9%', 0, S.gst],
                                         ['Cost of goods sold (recipes)', cogs, 0], ['Stock valuation (ingredients)', 0, cogs]];
    CL.je.textContent = ''; var dr = 0, cr = 0;
    JE.forEach(function (l, i) {
      var tr = K.el('tr', i === 5 ? 'ktn-je2' : null); tr.appendChild(K.el('td', l[2] ? 'ktn-cr' : null, l[0]));
      tr.appendChild(K.el('td', null, l[1] ? sgd(l[1]) : '')); tr.appendChild(K.el('td', null, l[2] ? sgd(l[2]) : ''));
      dr += l[1]; cr += l[2]; CL.je.appendChild(tr);
    });
    CL.dr.textContent = sgd(dr); CL.cr.textContent = sgd(cr);
    CL.po.textContent = '';
    var open = pos.filter(function (p) { return !p.recv; });
    CL.po.appendChild(K.el('li', 'ktn-poh', open.length ? 'Supplier RFQs from par levels, for tomorrow morning' : 'No ingredient below par: no supplier orders needed'));
    open.forEach(function (p) { var ing = ING[p.k], li = K.el('li'); li.appendChild(K.el('b', null, p.ref)); li.appendChild(K.el('span', null, ing[6] + ' · ' + ing[0] + ' ' + qfmt(p.q, ing[1]))); CL.po.appendChild(li); });
    bottom.hidden = true; closeEl.hidden = false; tagEl.textContent = 'Session closed';
    ev('Session <b>Outlet 1/000' + sess + '</b> closed: sales, GST, payments and food cost posted to Accounting', C.served);
    if (!quiet) K.restart(closeEl, 'is-in');
  }
  function nextSession() {
    sess++;
    pos.forEach(function (p) { if (!p.recv) { p.recv = true; stock[p.k] += p.q; } });
    neg = {}; TRACK.forEach(function (k) { if (stock[k] < 0) stock[k] = 0; });
    closeEl.hidden = true; bottom.hidden = false; bClose.disabled = false; fast = 1;
    fresh(); tagEl.textContent = rush ? 'Dinner rush' : 'Normal service';
    ev('Supplier deliveries received this morning; session Outlet 1/000' + sess + ' open', C.served);
    warm(K.reduce ? 100 : 30);
    drawMenu(); S.kd = S.od = S.sd = true; drawAll(); tickKds(); drawClock();
    if (vis && !paused) loop.on();
  }
  function busy() {                                               // show a table whose order is in the kitchen
    var i = S.tables.findIndex(function (tb) { return tb.st === 'order'; });
    if (i < 0) i = S.tables.findIndex(function (tb) { return tb.st !== 'free'; });
    if (i >= 0) select(i);
  }
  function warm(min) { quiet = true; while (S.t < min) step(); quiet = false; evq.forEach(function (e) { put(e[0], e[1]); }); evq = []; }

  // ------------------------------------------------------------------ controls and loop
  bRush.addEventListener('click', function () {
    rush = !rush; bRush.setAttribute('aria-pressed', String(rush));
    if (!S.closing) tagEl.textContent = rush ? 'Dinner rush' : 'Normal service';
    ev(rush ? 'Dinner rush: guests arrive ' + RUSH_X + '× faster' : 'Rush over: arrivals back to normal', C.late);
    if (K.reduce) snapshot();
  });
  bPause.addEventListener('click', function () {
    paused = !paused; bPause.setAttribute('aria-pressed', String(paused)); K.$('span', bPause).textContent = paused ? 'Resume' : 'Pause';
    if (paused) loop.off(); else if (vis) loop.on();
  });
  bClose.addEventListener('click', function () {
    startClose(false);
    if (K.reduce) { quiet = true; var g = 0; while (!S.closed && g++ < 4000) step(); quiet = false; drawAll(); drawClock(); }
  });
  bNext.addEventListener('click', function () { nextSession(); bClose.focus(); });
  var lastClock = '';
  function drawClock() { var c = hm(S.t + S.acc); if (c !== lastClock) { lastClock = c; clockEl.textContent = c; } }
  var vis = false;
  var loop = K.loop(function (now, dt) {
    if (S.closed) { loop.off(); return; }
    S.acc += dt / SPEED * fast;
    var g = 0; while (S.acc >= DT && g++ < 40) { S.acc -= DT; step(); if (S.closed) { S.acc = 0; break; } }
    if (S.dirty || S.kd || S.od || S.sd) drawAll(); else drawTables();
    tickKds(); drawClock();
  });
  function snapshot() {                                            // reduced motion: the service as it stands at 19:40
    fresh(); logEl.textContent = ''; closeEl.hidden = true; bottom.hidden = false; bClose.disabled = false;
    K.$$('.ktn-tk', root).forEach(function (li) { li.remove(); });
    TRACK.forEach(function (k) { stock[k] = ING[k][3]; }); pos = []; neg = {};
    warm(100); S.acc = 0; busy(); drawAll(); tickKds(); drawClock();
  }
  fresh(); S.acc = 0; select(sel); drawMenu();
  if (K.reduce) bPause.hidden = true;
  window.addEventListener('resize', function () { tickKds(); });
  return {
    start: function (first) {
      vis = true;
      if (first) { if (K.reduce) snapshot(); else { ev('18:00: session open · Outlet 1 · 10 tables', C.seat); warm(52); busy(); drawAll(); tickKds(); drawClock(); } }
      if (!paused) loop.on();
    },
    stop: function () { vis = false; loop.off(); }
  };
});
