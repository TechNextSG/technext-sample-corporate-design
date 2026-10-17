/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* Upcoming Odoo events article: a timeline of the events listed further down, read straight from
   the article's own event list (no second copy of the data). Filter by country and format; the
   filters also hide non-matching events in the list. "Next up" counts down to the next event. */
TN.demo('evcal', function (root, K) {
  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var LABEL = { sg: 'Singapore', ph: 'Philippines', vn: 'Vietnam', online: 'Online' };
  var strip = K.$('.dec-strip', root), ticks = K.$('.dec-ticks', root), next = K.$('.dec-next', root), count = K.$('.dec-count', root);
  var tip = K.tip(K.$('.dec-body', root));
  var items = [], filt = { c: 'all', f: 'all' };
  K.$$('.ev-list').forEach(function (ol) {
    var h = ol.previousElementSibling; while (h && h.tagName !== 'H2') h = h.previousElementSibling;
    var region = h ? h.textContent : '';
    var c = /Singapore/.test(region) ? 'sg' : /Philippines/.test(region) ? 'ph' : /Vietnam/.test(region) ? 'vn' : 'online';
    K.$$('li.ev', ol).forEach(function (li) {
      var d = K.$('.ev-date', li); if (!d) return;
      var day = parseInt(K.$('b', d).textContent, 10), mon = MON.indexOf(d.textContent.replace(/[0-9\s]/g, '').slice(0, 3));
      if (!(day > 0) || mon < 0) return;
      var tags = K.$$('.ev-tags span', li).map(function (t) { return t.textContent.trim(); });
      var f = tags.some(function (t) { return /online|webinar/i.test(t); }) || c === 'online' ? 'online' : 'inperson';
      var h3 = K.$('h3', li);
      items.push({ li: li, ol: ol, h2: h, c: c, f: f, date: new Date(2026, mon, day), title: h3 ? h3.textContent : '' });
    });
  });
  if (!items.length) return {};
  items.sort(function (a, b) { return a.date - b.date; });
  var t0 = items[0].date.getTime(), t1 = items[items.length - 1].date.getTime(), span = Math.max(1, t1 - t0);
  function pct(dt) { return 4 + (dt.getTime() - t0) / span * 92; }
  // month ticks
  var m = new Date(items[0].date.getFullYear(), items[0].date.getMonth(), 1);
  while (m.getTime() <= t1) {
    var x = pct(m);
    if (x >= 0) { var tk = K.el('span', 'dec-tick', MON[m.getMonth()]); tk.style.left = x.toFixed(2) + '%'; ticks.appendChild(tk); }
    m = new Date(m.getFullYear(), m.getMonth() + 1, 1);
  }
  // one dot per event; dots on the same day stack
  var perDay = {};
  items.forEach(function (it) {
    var key = it.date.toDateString(), n = perDay[key] = (perDay[key] || 0) + 1;
    var b = K.el('button', 'dec-dot dec-dot--' + it.c); b.type = 'button';
    b.style.left = pct(it.date).toFixed(2) + '%'; b.style.setProperty('--row', n - 1);
    b.setAttribute('aria-label', it.title + ', ' + it.date.getDate() + ' ' + MON[it.date.getMonth()] + ', ' + LABEL[it.c]);
    function show() { var r = K.box(b, K.$('.dec-body', root)); tip.show([it.title, it.date.getDate() + ' ' + MON[it.date.getMonth()] + ' · ' + LABEL[it.c] + ' · ' + (it.f === 'online' ? 'Online' : 'In person')], r.cx, r.y - 4); }
    b.addEventListener('pointerenter', show); b.addEventListener('focus', show);
    b.addEventListener('pointerleave', tip.hide); b.addEventListener('blur', tip.hide);
    b.addEventListener('click', function () {
      it.li.scrollIntoView({ behavior: K.reduce ? 'auto' : 'smooth', block: 'center' });
      K.restart(it.li, 'dec-hit');
    });
    strip.appendChild(b); it.dot = b;
  });
  function apply() {
    var shown = 0, lists = [];
    items.forEach(function (it) {
      var on = (filt.c === 'all' || it.c === filt.c) && (filt.f === 'all' || it.f === filt.f);
      it.li.hidden = !on; it.dot.classList.toggle('is-off', !on); it.dot.tabIndex = on ? 0 : -1;
      if (on) shown++;
      if (lists.indexOf(it.ol) < 0) lists.push(it.ol);
    });
    lists.forEach(function (ol) {
      var any = K.$$('li.ev', ol).some(function (li) { return !li.hidden; });
      ol.hidden = !any;
      var h = ol.previousElementSibling; while (h && h.tagName !== 'H2') h = h.previousElementSibling;
      if (h) h.hidden = !any;
    });
    count.textContent = shown + (shown === 1 ? ' event' : ' events');
    var now = new Date(); now.setHours(0, 0, 0, 0);
    var up = items.filter(function (it) { return !it.li.hidden && it.date >= now; })[0];
    next.textContent = '';
    if (!up) { next.appendChild(K.el('span', null, 'Every event in this selection has passed.')); return; }
    var days = Math.round((up.date - now) / 864e5);
    next.appendChild(K.el('b', null, days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : 'In ' + days + ' days'));
    next.appendChild(K.el('span', null, up.title + ' · ' + up.date.getDate() + ' ' + MON[up.date.getMonth()] + ' · ' + LABEL[up.c]));
  }
  K.$$('[data-c]', root).forEach(function (b) { b.addEventListener('click', function () { filt.c = b.dataset.c; K.$$('[data-c]', root).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); apply(); }); });
  K.$$('[data-f]', root).forEach(function (b) { b.addEventListener('click', function () { filt.f = b.dataset.f; K.$$('[data-f]', root).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); apply(); }); });
  apply();
  return {};
});
