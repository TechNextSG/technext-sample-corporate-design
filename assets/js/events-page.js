/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* /events: renders TechNext's own events, the events TechNext will join and its milestones (assets/js/events-data.js),
   by date, in the visitor's browser. An item whose last day has passed (in its own time zone) moves from Upcoming to
   Past; milestones before today show as reached. Empty lists show a designed "announced soon" state instead.
   The page re-sorts every few minutes, so a tab left open overnight stays right. */
(function () {
  'use strict';
  var EV = window.TN_EV, ALL = window.TN_EVENTS;
  if (!EV || !ALL) return;
  var ROOT = (document.querySelector('link[rel="stylesheet"][href*="assets/css/site.css"]') || { getAttribute: function () { return ''; } }).getAttribute('href').split('assets/css/site.css')[0];
  var DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function href(u) { return /^https?:/.test(u) ? u : ROOT + u; }
  function ext(u) { return /^https?:/.test(u) ? ' target="_blank" rel="noopener"' : ''; }
  function range(e) { var a = EV.dayMon(e.date); if (!e.end) return a[0] + ' ' + a[1] + ' ' + a[2]; var b = EV.dayMon(e.end); return a[0] + ' ' + a[1] + ' – ' + b[0] + ' ' + b[1] + ' ' + b[2]; }
  function daysTo(e, now) { return Math.ceil((EV.start(e) - now) / 864e5); }
  function when(e, now) { var d = daysTo(e, now); if (d <= 0) return 'Today'; return d === 1 ? 'Tomorrow' : 'In ' + d + ' days'; }
  var ARROW = '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function link(e, label) { return e.url ? '<a class="ev-go" href="' + esc(href(e.url)) + '"' + ext(e.url) + '>' + esc(label || (/youtube\.com/.test(e.url) ? 'Watch on YouTube' : 'Details')) + ARROW + '</a>' : ''; }
  function tags(e) { return '<span class="ev-tag ev-tag--' + e.type + '">' + (e.type === 'own' ? 'TechNext' : 'We’re joining') + '</span><span class="ev-tag">' + esc(e.kind) + '</span><span class="ev-tag">' + esc(e.where) + '</span>'; }
  function stub(e) { var d = EV.dayMon(e.date), p = e.date.split('-'), dow = DOW[new Date(Date.UTC(+p[0], +p[1] - 1, +p[2])).getUTCDay()];
    return '<span class="ev-stub" aria-hidden="true"><small>' + dow + '</small><b>' + d[0] + (e.end ? '<i>–' + EV.dayMon(e.end)[0] + '</i>' : '') + '</b><span>' + d[1] + '</span></span>'; }
  function row(e, now) { return '<li class="ev-row" data-type="' + e.type + '">' + stub(e) + '<div class="ev-row-b"><p class="ev-row-k"><span class="ev-cc">' + esc(e.kind) + '</span>' + esc(e.where) + '<em>' + when(e, now) + '</em></p><h3>' + esc(e.title) + '</h3>' +
    (e.time ? '<p class="ev-meta">' + esc(e.time) + '</p>' : '') + '<p class="ev-note">' + esc(e.note) + '</p><p class="ev-tags">' + tags(e) + '</p></div>' + link(e) + '</li>'; }
  function empty(kind, title, text) { return '<li class="ev-empty-booth" data-kind="' + kind + '"><span class="ev-easel" aria-hidden="true"><span class="ev-cloth"></span><span class="ev-easel-legs"></span></span><div><span class="ev-soon">Announced here soon</span><h3>' + title + '</h3><p>' + text + '</p></div></li>'; }

  function render() {
    var now = Date.now(), own = EV.upcoming(now, 'own'), joining = EV.upcoming(now, 'joining'), up = EV.upcoming(now), past = EV.past(now), ms = EV.milestones();
    var st = function (k, v) { var el = document.querySelector('[data-ev-stat="' + k + '"]'); if (el) el.textContent = v; };
    st('next', up[0] ? range(up[0]) + ' · ' + up[0].kind : 'None announced yet');
    st('own', own.length ? own.length + (own.length === 1 ? ' TechNext event ahead' : ' TechNext events ahead') : 'None announced yet');
    st('joining', joining.length ? joining.length + ' ahead' : 'Announced here soon');
    /* the next item, as an admission ticket, or "stay tuned" */
    var nx = document.querySelector('[data-ev-next]');
    if (nx) { var e = up[0];
      nx.innerHTML = e ? '<div class="ev-ticket" data-type="' + e.type + '">' + stub(e) + '<div class="ev-ticket-b"><p class="ev-ticket-k"><span class="ev-pulse"></span>Next up · ' + when(e, now) + '</p><h3>' + esc(e.title) + '</h3>' +
        (e.time ? '<p class="ev-meta">' + esc(e.time) + '</p>' : '') + '<p>' + esc(e.note) + '</p><p class="ev-tags">' + tags(e) + '</p></div>' +
        '<div class="ev-ticket-side"><span class="ev-count"><b>' + Math.max(0, daysTo(e, now)) + '</b>' + (daysTo(e, now) === 1 ? 'day to go' : 'days to go') + '</span>' + link(e) + '</div></div>'
        : '<div class="ev-ticket ev-ticket--empty"><span class="ev-stub ev-stub--tbc" aria-hidden="true"><small>Date</small><b>TBC</b><span>soon</span></span><div class="ev-ticket-b"><p class="ev-ticket-k">Stay tuned</p><h3>No TechNext events announced yet</h3><p>New dates appear here first, and move to Past by themselves once they end.</p></div></div>'; }
    var ol = document.querySelector('[data-ev-own]');
    var rest = own.filter(function (e) { return e !== up[0]; });
    if (ol) ol.innerHTML = rest.map(function (e) { return row(e, now); }).join('') || (own.length ? '' : empty('own', 'Upcoming TechNext events: none announced yet', 'Workshops, open days and premieres we run ourselves will be listed here, with dates and places, as soon as they are set.'));
    var jl = document.querySelector('[data-ev-joining]');
    if (jl) jl.innerHTML = joining.map(function (e) { return row(e, now); }).join('') || empty('joining', 'Events we’re joining: announced here soon', 'When TechNext confirms it will take part in an event, it appears on this board with the date, the place and what we will be doing there.');
    /* milestones with today's marker */
    var ml = document.querySelector('[data-ev-miles]');
    if (ml) { var out = [], marked = false;
      ms.forEach(function (m, i) { var done = EV.start(m) <= now, d = EV.dayMon(m.date);
        if (!done && !marked) { marked = true; out.push(today(now)); }
        out.push('<li class="ev-mile' + (done ? ' is-done' : '') + '" style="--i:' + i + '"><span class="ev-dot"></span><p class="ev-mile-d"><b>' + d[0] + ' ' + d[1] + '</b> ' + d[2] + '</p><div class="ev-mile-c"><span class="ev-mile-tag">' + esc(m.kind) + '</span><h3>' + esc(m.title) + '</h3><p>' + esc(m.note) + '</p>' +
          (m.url ? '<a class="btn-link" href="' + esc(href(m.url)) + '">Read more</a>' : '') + '<span class="ev-mile-st">' + (done ? 'Reached' : 'Ahead') + '</span></div></li>'); });
      if (!marked) out.push(today(now));
      out.push('<li class="ev-mile ev-mile--soon"><span class="ev-dot"></span><p class="ev-mile-d"><b>Next</b></p><div class="ev-mile-c"><span class="ev-mile-tag">TechNext</span><h3>The next milestone</h3><p>Added here with its date when it happens.</p><span class="ev-mile-st">Coming soon</span></div></li>');
      ml.innerHTML = out.join(''); }
    var pl = document.querySelector('[data-ev-past]');
    if (pl) pl.innerHTML = past.map(function (e, i) { return '<li class="ev-old" data-type="' + e.type + '" style="--r:' + ((i % 3) - 1) * 0.8 + 'deg">' + stub(e) + '<div><p class="ev-row-k"><span class="ev-cc">' + esc(e.kind) + '</span>' + esc(range(e)) + '</p><h3>' + esc(e.title) + '</h3><p class="ev-meta">' + esc(e.where) + '</p>' + link(e) + '</div><span class="ev-ended" aria-hidden="true">Ended</span></li>'; }).join('') ||
      '<li class="ev-empty-booth ev-empty-booth--past"><span class="ev-easel" aria-hidden="true"><span class="ev-cloth"></span><span class="ev-easel-legs"></span></span><div><span class="ev-soon">Archive</span><h3>Nothing here yet</h3><p>Events move here on their own the day after they end.</p></div></li>';
  }
  function today(now) { var td = new Date(now + 8 * 3600e3); return '<li class="ev-mile ev-mile--today" aria-label="Today"><span class="ev-dot"></span><span class="ev-today">Today · ' + td.getUTCDate() + ' ' + EV.MON[td.getUTCMonth()] + ' ' + td.getUTCFullYear() + '</span></li>'; }
  function init() { render(); setInterval(render, 5 * 60000); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
