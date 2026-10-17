/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* Odoo CRM page: lead routing and the pipeline. Leads arrive from five channels; scoring,
   territory, product-line and round-robin rules route each to a team and a salesperson; the
   kanban runs New, Qualified, Proposition, Won (lost deals archived with a reason), schedules
   activities and flags stale leads; a won deal opens its quotation in Sales. Stage conversion and
   a weighted forecast (expected revenue × probability) follow the team view. Sample data, SGD. */
TN.demo('pipeline', function (root, K) {
  var wrap = K.$('.ppl-wrap', root), cols = K.$$('.ppl-col', root), lists = cols.map(function (c) { return K.$('.ppl-list', c); });
  var mores = cols.map(function (c) { return K.$('.ppl-more', c); }), sums = cols.map(function (c) { return K.$('[data-sum]', c); });
  var lostL = K.$('.ppl-lostl', root), quote = K.$('.ppl-quote', root), qNo = K.$('[data-q="no"]', root), qTx = K.$('[data-q="txt"]', root);
  var logL = K.$('.ppl-log', root), fun = K.$('.ppl-fun', root), bars = K.$('.ppl-bars', root), dayK = K.$('[data-k="day"]', root);
  var playBtn = K.$('[data-play]', root), playLbl = K.$('span', playBtn);
  var kOpen = K.$('[data-k="open"]', root), kWf = K.$('[data-k="wf"]', root), kWon = K.$('[data-k="won"]', root), kStale = K.$('[data-k="stale"]', root);
  var tip = K.tip(root);

  var STAGE = ['New', 'Qualified', 'Proposition', 'Won'], FACTOR = [1, 1.35, 1.8], ACT = [['Call', 1], ['Meeting', 2], ['Follow-up', 3]];
  var TEAM = { sg: { name: 'Singapore', c: 'var(--blue)', m: ['Alex', 'Rina'] }, ph: { name: 'Philippines', c: 'var(--tok-pay)', m: ['Jo', 'Mara'] }, pj: { name: 'Projects', c: 'var(--tok-make)', m: ['Ken'] } };
  var CH = { web: 'Web form', mail: 'Email alias', wa: 'WhatsApp', evt: 'Event list', li: 'LinkedIn' };
  var LINE = {
    hw: { name: 'Retail hardware', v: [8000, 40000], deals: ['POS terminals for 6 outlets', 'Scanners for 12 stores', 'Label printers for 3 sites', 'Handhelds for the shop floor'] },
    wh: { name: 'Warehouse systems', v: [40000, 120000], deals: ['Warehouse roll-out', 'Barcode picking for 2 sites', 'WMS replacement', 'Cold-room stock control'] },
    sp: { name: 'Support plans', v: [3000, 12000], deals: ['Support renewal', 'Annual support plan', 'Training and support', 'Upgrade support'] }
  };
  var WHO = ['Café chain', 'Hardware wholesaler', '3PL warehouse', 'Fashion retailer', 'Furniture maker', 'Engineering firm', 'F&B group', 'Electronics retailer', 'Bakery group', 'Auto parts dealer', 'Sports retailer', 'Cold-chain logistics', 'Stationery distributor', 'Beverage distributor', 'Print shop', 'Home furnishing store'];
  var LOST = ['price', 'timing', 'chose a competitor', 'no budget', 'went quiet'];
  var COUNTRY = ['SG', 'SG', 'SG', 'PH', 'PH', 'MY', 'ID'];
  var rules = { score: true, terr: true, line: true, rr: true }, view = 'all', playing = true;
  var day = 1, seq = 400, qseq = 230, cards = [], wonV = { all: 0, sg: 0, ph: 0, pj: 0 }, chN = { web: 0, mail: 0, wa: 0, evt: 0, li: 0 };
  var reached = {}; ['all', 'sg', 'ph', 'pj'].forEach(function (t) { reached[t] = [0, 0, 0, 0, 0]; });   // New, Qualified, Proposition, Won, Lost
  var rrPtr = { sg: 0, ph: 0, pj: 0 }, ruleOut = {};
  K.$$('[data-o]', root).forEach(function (e) { ruleOut[e.dataset.o] = e; });
  var teamEl = {}; K.$$('.ppl-team', root).forEach(function (e) { teamEl[e.dataset.t] = e; });

  function money(v) { return 'S$ ' + (v >= 1e6 ? (v / 1e6).toFixed(2) + 'm' : v >= 1e4 ? Math.round(v / 1000) + 'k' : Math.round(v).toLocaleString('en-SG')); }
  function prob(c) { return c.s >= 3 ? 1 : Math.min(.92, c.p * FACTOR[c.s]); }
  function stars(c) { return !c.scored ? '' : c.fit >= .58 ? '★★★' : c.fit >= .4 ? '★★' : '★'; }

  /* ------------------------------------------------------------------ routing: the rules in order */
  function route(c) {
    var why = {};
    c.scored = rules.score;
    c.p = rules.score ? K.clamp(c.fit + K.rnd(-.06, .06), .08, .8) : .2;
    why.score = rules.score ? Math.round(c.p * 100) + '% · priority ' + stars(c) : 'off · 20% for all, no priority';
    var t = null;
    if (rules.line && c.line === 'wh') { t = 'pj'; why.line = 'warehouse → Projects'; } else why.line = rules.line ? 'no match' : 'off';
    if (!t && rules.terr) { t = c.cty === 'PH' ? 'ph' : 'sg'; why.terr = c.cty + ' → ' + TEAM[t].name; } else why.terr = rules.terr ? 'skipped' : 'off';
    if (!t) { t = 'sg'; if (!rules.terr) why.terr = 'off · default team'; }
    c.t = t;
    if (rules.rr) {
      var m = TEAM[t].m, load = m.map(function (who) { return cards.filter(function (x) { return x.owner === who && x.s < 3 && !x.lost; }).length; });
      var best = Math.min.apply(null, load), pick = null;
      for (var k = 0; k < m.length; k++) { var j = (rrPtr[t] + k) % m.length; if (load[j] === best) { pick = j; break; } }
      rrPtr[t] = (pick + 1) % m.length; c.owner = m[pick]; why.rr = '→ ' + c.owner + ' (' + best + ' open)';
    } else { c.owner = null; why.rr = 'off · unassigned'; }
    return why;
  }
  function showWhy(why) {
    Object.keys(why).forEach(function (k) { var e = ruleOut[k]; if (!e) return; e.textContent = why[k]; K.restart(e.parentNode, 'is-ping'); });
  }

  /* ------------------------------------------------------------------ cards */
  function make(chk, opt) {
    opt = opt || {};
    var line = opt.line || K.pick(['hw', 'hw', 'wh', 'sp', 'sp']), L = LINE[line];
    var c = { id: 'L-0' + (++seq), ch: chk, line: line, deal: K.pick(L.deals), who: K.pick(WHO), cty: opt.cty || K.pick(COUNTRY),
              v: Math.round(K.rnd(L.v[0], L.v[1]) / 500) * 500, fit: opt.fit != null ? opt.fit : K.rnd(.18, .76), s: 0, d: 0, due: 0, stale: false, lost: false };
    var why = route(c);
    c.el = K.el('button', 'ppl-card'); c.el.type = 'button'; c.el.style.setProperty('--c', TEAM[c.t].c);
    c.el.appendChild(K.el('b', null, c.deal));
    c.el.appendChild(K.el('small', null, c.who + ' · ' + c.cty));
    var row = K.el('span', 'ppl-row');
    c.vEl = row.appendChild(K.el('em', 'ppl-v'));
    c.stEl = row.appendChild(K.el('i', 'ppl-stars'));
    c.actEl = row.appendChild(K.el('i', 'ppl-act'));
    c.avEl = row.appendChild(K.el('i', 'ppl-av'));
    c.el.appendChild(row);
    c.alEl = c.el.appendChild(K.el('i', 'ppl-alert'));
    c.el.addEventListener('pointerenter', function () { hover(c, true); }); c.el.addEventListener('pointerleave', function () { hover(c, false); });
    c.el.addEventListener('focus', function () { hover(c, true); }); c.el.addEventListener('blur', function () { hover(c, false); });
    cards.push(c);
    return { c: c, why: why };
  }
  function paint(c) {
    c.vEl.textContent = money(c.v);
    c.stEl.textContent = c.s < 3 ? stars(c) : '';
    c.avEl.textContent = c.owner ? c.owner.slice(0, 2).toUpperCase() : '?';
    c.el.classList.toggle('is-none', !c.owner);
    if (c.s < 3) {
      var a = ACT[c.s], left = c.due - day;
      c.actEl.textContent = a[0] + ' · ' + (left > 0 ? left + 'd' : left === 0 ? 'today' : 'late');
      c.actEl.classList.toggle('is-late', left < 0);
    } else c.actEl.textContent = '→ ' + c.q;
    c.alEl.textContent = c.stale ? (c.owner ? 'Stale · ' + c.d + 'd' : 'No owner · ' + c.d + 'd') : '';
    c.el.classList.toggle('is-stale', c.stale);
    c.el.setAttribute('aria-label', c.deal + ', ' + c.who + ', ' + money(c.v) + ', ' + STAGE[c.s] + (c.owner ? ', ' + c.owner : ', unassigned') + (c.stale ? ', stale' : ''));
  }
  function hover(c, on) {
    if (!on) { tip.hide(); return; }
    var b = K.box(c.el, root), p = prob(c);
    tip.show([c.deal + ' · ' + c.id, c.who + ' · ' + c.cty + ' · from ' + CH[c.ch] + ' · ' + LINE[c.line].name,
              c.s < 3 ? money(c.v) + ' × ' + Math.round(p * 100) + '% = ' + money(c.v * p) + ' weighted' : 'Won: quotation ' + c.q + ' in Sales',
              (c.owner ? 'Owner: ' + c.owner : 'No salesperson yet') + ' · ' + TEAM[c.t].name + ' team'], b.cx, b.y < 190 ? b.b : b.y, b.y < 190);
  }
  function enter(c, s, silent) {             // move a card to a stage, gliding from where it was
    var first = c.el.isConnected ? c.el.getBoundingClientRect() : null;
    c.s = s; c.d = 0; c.stale = false; c.alerted = false;
    if (s < 3) c.due = day + ACT[s][1];
    reached.all[s]++; reached[c.t][s]++;
    var list = lists[s];
    list.insertBefore(c.el, list.firstChild);
    paint(c); layout();
    if (first && !K.reduce && !silent && c.el.animate && !c.el.hidden) {
      var last = c.el.getBoundingClientRect();
      if (last.width) c.el.animate([{ transform: 'translate(' + (first.left - last.left) + 'px,' + (first.top - last.top) + 'px)' }, { transform: 'none' }], { duration: 620, easing: 'cubic-bezier(.16,1,.3,1)' });
    }
    if (!silent && s > 0) K.restart(c.el, 'is-move');
  }
  function layout() {                        // what each column shows for the team in view
    var mine = function (c) { return view === 'all' || c.t === view; };
    cards.forEach(function (c) { c.el.hidden = !mine(c) || c.lost; });
    lists.forEach(function (list, s) {
      var shown = 0, extra = 0, cap = s === 3 ? 2 : 3;
      K.$$('.ppl-card', list).forEach(function (el) { if (el.hidden) return; if (shown < cap) shown++; else { el.hidden = true; extra++; } });
      mores[s].textContent = extra ? '+' + extra + ' more' : '';
      var tot = cards.filter(function (c) { return c.s === s && !c.lost && mine(c); }).reduce(function (a, c) { return a + c.v; }, 0);
      sums[s].textContent = s === 3 ? money(view === 'all' ? wonV.all : wonV[view]) : money(tot);
    });
    kpis();
  }

  /* ------------------------------------------------------------------ one day in the pipeline */
  function tick() {
    day++; dayK.textContent = String(day);
    cards.slice().forEach(function (c) {
      if (c.lost || c.s >= 3) return;
      c.d++;
      if (!c.owner && rules.rr) {           // round-robin switched back on: the backlog gets owners
        var why = route(c); c.el.style.setProperty('--c', TEAM[c.t].c); showWhy(why);
        log(c.id + ' assigned to ' + c.owner + ' by round-robin', TEAM[c.t].c);
      }
      var p = c.p, go = false;
      if (c.owner) {
        var boost = c.stale ? .15 : 0;       // the team lead chases what was flagged
        if (c.s === 0) go = Math.random() < .26 + .42 * c.fit * (c.scored ? 1.15 : .9) + boost;
        else if (c.s === 1) go = Math.random() < .2 + .4 * c.fit + boost;
        else if (c.d >= 2 && Math.random() < .5) {
          if (Math.random() < Math.min(.9, c.fit * 1.55)) win(c); else lose(c);
          return;
        }
      }
      if (go) { enter(c, c.s + 1); log(c.id + ' moved to ' + STAGE[c.s] + ' · next: ' + ACT[c.s][0].toLowerCase(), TEAM[c.t].c); return; }
      var lim = c.owner ? 5 : 2;
      if (c.d >= lim && !c.alerted) {
        c.stale = true; c.alerted = true;
        log(c.owner ? c.id + ' stale: ' + c.d + ' days in ' + STAGE[c.s] + ', team lead alerted' : c.id + ' has no salesperson after ' + c.d + ' days', 'var(--tok-late)');
      }
      paint(c);
    });
    layout();
  }
  function win(c) {
    c.q = 'S00' + (++qseq);
    wonV.all += c.v; wonV[c.t] += c.v;
    enter(c, 3);
    c.el.classList.add('is-won');
    qNo.textContent = c.q + ' · quotation';
    qTx.textContent = 'From ' + c.id + ': ' + c.who + ', ' + c.deal + ', ' + money(c.v) + ', pricelist set. Nothing re-typed.';
    K.restart(quote, 'is-new');
    log(c.id + ' won: quotation ' + c.q + ' opened in Sales', 'var(--ok)');
    var won = cards.filter(function (x) { return x.s === 3; });
    if (won.length > 8) { var old = won[0]; cards.splice(cards.indexOf(old), 1); old.el.remove(); }
  }
  function lose(c) {
    c.lost = true; c.el.remove(); cards.splice(cards.indexOf(c), 1);
    reached.all[4]++; reached[c.t][4]++;
    var r = K.pick(LOST), li = K.el('li'); li.appendChild(K.el('b', null, c.id)); li.appendChild(document.createTextNode(' ' + r));
    lostL.insertBefore(li, lostL.firstChild); while (lostL.children.length > 3) lostL.lastChild.remove();
    log(c.id + ' lost (' + r + '), archived with the reason', '#9AA3B8');
    layout();
  }
  function log(text, color) {
    var li = K.el('li'); li.style.setProperty('--c', color || 'var(--blue)');
    li.appendChild(K.el('i')); li.appendChild(K.el('span', null, 'Day ' + day + ' · ' + text));
    logL.insertBefore(li, logL.firstChild);
    while (logL.children.length > 4) logL.lastChild.remove();
  }

  /* ------------------------------------------------------------------ a new lead flies in */
  var fly = K.el('div', 'ppl-fly'); fly.setAttribute('aria-hidden', 'true'); wrap.appendChild(fly);
  function arrive(chk, manual) {
    if (cards.filter(function (c) { return c.s < 3; }).length >= 18 && !manual) return;
    chN[chk]++; var n = K.$('[data-n="' + chk + '"]', root); if (n) n.textContent = String(chN[chk]);
    var r = make(chk), c = r.c;
    var src = K.$('[data-ch="' + chk + '"]', root), team = teamEl[c.t], col = lists[0];
    if (K.reduce || !src.offsetWidth || !visible) { showWhy(r.why); enter(c, 0, true); announce(c); return; }
    var chip = K.el('span', 'ppl-chip', c.id); chip.style.setProperty('--c', TEAM[c.t].c); fly.appendChild(chip);
    // one calm glide from the channel into New; the rules that fire and the team they pick light up in place
    var a = K.box(src, wrap), d = K.box(col, wrap);
    function at(x, y) { return 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)'; }
    var anim = chip.animate([
      { transform: at(a.cx - 24, a.cy - 10), opacity: 0 },
      { transform: at(a.cx - 24, a.cy - 10), opacity: 1, offset: .15 },
      { transform: at(d.x + 10, d.y + 6), opacity: 1, offset: .88 },
      { transform: at(d.x + 10, d.y + 6), opacity: 0 }
    ], { duration: 1300, easing: 'cubic-bezier(.4,0,.2,1)' });
    setTimeout(function () { showWhy(r.why); }, 250);
    setTimeout(function () { K.restart(team, 'is-ping'); }, 650);
    anim.onfinish = function () { chip.remove(); enter(c, 0, true); K.restart(c.el, 'is-in'); announce(c); };
  }
  function announce(c) { log(CH[c.ch] + ' → ' + c.id + ' · ' + Math.round(c.p * 100) + '% · ' + TEAM[c.t].name + (c.owner ? ' · ' + c.owner : ' · unassigned'), TEAM[c.t].c); }

  /* ------------------------------------------------------------------ numbers and charts */
  var FUN = [], FC = [];
  ['New', 'Qualified', 'Proposition', 'Won', 'Lost'].forEach(function (s, i) {
    var row = K.el('div', 'ppl-fr'); row.appendChild(K.el('b', null, s));
    var bar = K.el('span', 'ppl-fb'), fill = K.el('i'); bar.appendChild(fill); row.appendChild(bar);
    var v = K.el('em'); row.appendChild(v); fun.appendChild(row); FUN.push({ fill: fill, v: v });
    if (i < 3) {
      var col = K.el('div', 'ppl-bc'), stack = K.el('span', 'ppl-bs'), ex = K.el('i', 'ppl-bx'), wt = K.el('i', 'ppl-bw');
      stack.appendChild(ex); stack.appendChild(wt); col.appendChild(stack);
      var lab = K.el('p'); var e1 = K.el('b'), e2 = K.el('small'); lab.appendChild(e1); lab.appendChild(e2); col.appendChild(lab);
      col.appendChild(K.el('span', 'ppl-bl', s)); bars.appendChild(col); FC.push({ ex: ex, wt: wt, e1: e1, e2: e2 });
    }
  });
  function kpis() {
    var mine = cards.filter(function (c) { return !c.lost && c.s < 3 && (view === 'all' || c.t === view); });
    var open = mine.reduce(function (a, c) { return a + c.v; }, 0), wf = mine.reduce(function (a, c) { return a + c.v * prob(c); }, 0);
    kOpen.textContent = money(open); kWf.textContent = money(wf); kWon.textContent = money(wonV[view]);
    kStale.textContent = String(mine.filter(function (c) { return c.stale; }).length);
    kStale.parentNode.classList.toggle('is-bad', mine.some(function (c) { return c.stale; }));
    var r = reached[view], n0 = Math.max(1, r[0]);
    FUN.forEach(function (f, i) {
      f.fill.style.transform = 'scaleX(' + (r[i] / n0).toFixed(3) + ')';
      var pct = i === 0 ? '' : i < 3 ? ' · ' + Math.round(r[i] / Math.max(1, r[i - 1]) * 100) + '%' : i === 3 ? ' · win rate ' + Math.round(r[3] / Math.max(1, r[3] + r[4]) * 100) + '%' : ' archived';
      f.v.textContent = r[i] + pct;
    });
    var per = [0, 1, 2].map(function (s) { var l = mine.filter(function (c) { return c.s === s; }); return [l.reduce(function (a, c) { return a + c.v; }, 0), l.reduce(function (a, c) { return a + c.v * prob(c); }, 0)]; });
    var mx = Math.max(1, per[0][0], per[1][0], per[2][0]);
    FC.forEach(function (f, i) {
      f.ex.style.transform = 'scaleY(' + (per[i][0] / mx).toFixed(3) + ')'; f.wt.style.transform = 'scaleY(' + (per[i][1] / mx).toFixed(3) + ')';
      f.e1.textContent = money(per[i][1]); f.e2.textContent = 'of ' + money(per[i][0]);
    });
  }

  /* ------------------------------------------------------------------ controls */
  K.$$('[data-rule]', root).forEach(function (b) {
    b.addEventListener('click', function () {
      var k = b.dataset.rule; rules[k] = !rules[k]; b.setAttribute('aria-checked', String(rules[k]));
      ruleOut[k].textContent = rules[k] ? 'on' : 'off';
      if (k === 'score') { cards.forEach(function (c) { if (c.s < 3) { c.scored = rules.score; c.p = rules.score ? K.clamp(c.fit + K.rnd(-.06, .06), .08, .8) : .2; paint(c); } }); layout(); }
      log(K.$('b', b).textContent + ' ' + (rules[k] ? 'switched on' : 'switched off') + (k === 'rr' && !rules[k] ? ': new leads will wait for an owner' : ''), rules[k] ? 'var(--ok)' : '#9AA3B8');
    });
  });
  K.$$('[data-team]', root).forEach(function (b) {
    b.addEventListener('click', function () {
      view = b.dataset.team; K.$$('[data-team]', root).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      root.dataset.view = view; layout();
      K.$$('.ppl-team', root).forEach(function (t) { t.classList.toggle('is-dim', view !== 'all' && t.dataset.t !== view); });
    });
  });
  K.$$('[data-ch]', root).forEach(function (b) { b.addEventListener('click', function () { arrive(b.dataset.ch, true); }); });
  playBtn.addEventListener('click', function () { playing = !playing; setPlay(); if (playing && visible) loop.on(); });
  K.$('[data-day]', root).addEventListener('click', function () { tick(); if (K.reduce) arrive(K.pick(Object.keys(CH)), true); });
  function setPlay() { playBtn.setAttribute('aria-pressed', String(playing)); playBtn.classList.toggle('is-paused', !playing); playLbl.textContent = playing ? 'Pause' : 'Play'; }

  /* ------------------------------------------------------------------ the clock */
  var DAY = 1700, nextDay = 0, nextLead = 0, visible = false;
  var loop = K.loop(function (now) {
    if (!playing) { loop.off(); return; }
    if (!nextDay) { nextDay = now + DAY; nextLead = now + 900; }
    if (now >= nextDay) { nextDay = now + DAY; tick(); }
    if (now >= nextLead) { nextLead = now + K.rnd(1500, 2700); arrive(K.pick(['web', 'web', 'mail', 'mail', 'wa', 'evt', 'li'])); }
  });

  // a pipeline already in motion: history counts and a few open deals on each stage
  [[0, 'web', 'hw', 'SG', .62], [0, 'wa', 'sp', 'PH', .35], [0, 'mail', 'wh', 'MY', .5], [1, 'evt', 'hw', 'PH', .55], [1, 'li', 'wh', 'SG', .7],
   [1, 'web', 'sp', 'SG', .28], [2, 'mail', 'hw', 'SG', .66], [2, 'web', 'wh', 'ID', .48], [3, 'wa', 'hw', 'PH', .7]].forEach(function (s, i) {
    var c = make(s[1], { line: s[2], cty: s[3], fit: s[4] }).c;
    for (var k = 0; k <= s[0]; k++) { reached.all[k]++; reached[c.t][k]++; }
    c.s = s[0]; c.d = i % 3; if (c.s < 3) c.due = day + ACT[c.s][1] - c.d; else { c.q = 'S00' + (++qseq); wonV.all += c.v; wonV[c.t] += c.v; c.el.classList.add('is-won'); }
    lists[c.s].appendChild(c.el); paint(c);
  });
  [['sg', 9, 5, 3, 1, 2], ['ph', 6, 3, 2, 1, 1], ['pj', 3, 2, 1, 0, 1]].forEach(function (h) {    // earlier weeks
    for (var k = 0; k < 5; k++) { reached[h[0]][k] += h[k + 1]; reached.all[k] += h[k + 1]; }
  });
  ['price', 'timing'].forEach(function (r, i) { var li = K.el('li'); li.appendChild(K.el('b', null, 'L-038' + (7 - i * 3))); li.appendChild(document.createTextNode(' ' + r)); lostL.appendChild(li); });
  ruleOut.score.textContent = 'on'; ruleOut.terr.textContent = 'on'; ruleOut.line.textContent = 'on'; ruleOut.rr.textContent = 'on';
  layout();
  log('Pipeline open: 9 deals across three teams', 'var(--blue)');
  if (K.reduce) { playing = false; setPlay(); playBtn.disabled = true; }

  return {
    start: function () { visible = true; if (playing) { nextDay = 0; loop.on(); } },
    stop: function () { visible = false; loop.off(); }
  };
});
