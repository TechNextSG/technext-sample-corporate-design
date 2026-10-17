/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* /nexi-explains: season tabs, premiere countdowns (cards switch to "Watch now" when a YouTube premiere
   starts; the hero's caption panel counts down to the next one), the video player dialog (one episode, or a whole
   season as a YouTube playlist) and the Quick Tips rails. The hero's comic carousel is nexi-explains-hero.js.
   Video ids come from data-nxe-play and must look like a YouTube id; the player URL is a constant. */
(function () {
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ID = /^[A-Za-z0-9_-]{6,20}$/;
  var EMBED = 'https://www.youtube-nocookie.com/embed/';
  var WATCH = 'https://www.youtube.com/watch?v=';
  var SUBSCRIBE = 'https://www.youtube.com/@TechNextAsia?sub_confirmation=1';
  /* a tap on a locked card: the status tag wiggles (it already says when it premieres) */
  function nudge(b) { var st = b.querySelector('[data-nxe-state]'); if (!st) return; st.classList.remove('is-nudge'); void st.offsetWidth; st.classList.add('is-nudge'); }
  var $$ = function (sel, root) { return [].slice.call((root || document).querySelectorAll(sel)); };
  var SGT = { timeZone: 'Asia/Singapore' };
  var fmtDay = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'Asia/Singapore' });
  var fmtTime = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: SGT.timeZone });

  function when(el) { var t = Date.parse(el.getAttribute('data-nxe-premiere') || ''); return isNaN(t) ? 0 : t; }
  function released(el) { var t = when(el); return !t || t <= Date.now(); }
  function left(ms) {
    var m = Math.max(1, Math.round(ms / 60000)), d = Math.floor(m / 1440), h = Math.floor((m % 1440) / 60), mm = m % 60;
    if (d) return d + ' d ' + h + ' h';
    if (h) return h + ' h ' + mm + ' min';
    return mm + ' min';
  }

  /* ---------------- cards pop in like comic panels as they scroll into view ---------------- */
  var popIO = null;
  if (!reduce && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('nxe-anim');
    popIO = new IntersectionObserver(function (en) {
      en.forEach(function (x) {
        if (!x.isIntersecting) return;
        var c = x.target, sibs = c.parentNode ? [].slice.call(c.parentNode.children) : [];
        c.style.setProperty('--k', Math.min(5, Math.max(0, sibs.indexOf(c) % 4)) * 70 + 'ms');
        c.classList.add('is-in');
        popIO.unobserve(c);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.12 });
    $$('.nxe-card,.nxe-ch').forEach(function (c) { popIO.observe(c); });
  }

  /* ---------------- category tabs (Series / Specials / Comics / Characters) + season filters ----------------
     Deep links: #series #specials #comics #characters, and any id inside a category (#season-2, #cast-season-2…)
     opens that category and its season. Tabs follow the ARIA tabs pattern (arrows, Home, End). */
  var tabs = $$('.nxe-cats .nxe-tab'), cats = $$('.nxe-cat');
  function pickGroup(cat, gid) {
    var chips = $$('[data-nxe-filter]', cat);
    if (!chips.length) return;
    if (!chips.some(function (c) { return c.getAttribute('data-nxe-filter') === gid; })) gid = chips[0].getAttribute('data-nxe-filter');
    chips.forEach(function (c) { c.setAttribute('aria-pressed', c.getAttribute('data-nxe-filter') === gid ? 'true' : 'false'); });
    /* phones: the chip row scrolls sideways; bring the chosen season into view (row only, never the page) */
    var on = chips.filter(function (c) { return c.getAttribute('data-nxe-filter') === gid; })[0], row = on && on.parentNode;
    if (row && row.scrollWidth > row.clientWidth) row.scrollLeft = Math.max(0, on.offsetLeft - row.offsetLeft - 24);
    $$('[data-nxe-group]', cat).forEach(function (g) { g.classList.toggle('is-on', g.getAttribute('data-nxe-group') === gid); });
    portraits(cat);
    rails();
  }
  function select(id, focus, push, group) {
    var found = false;
    tabs.forEach(function (t) {
      var on = t.getAttribute('aria-controls') === id;
      if (on) found = true;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
    });
    if (!found) return false;
    cats.forEach(function (p) {
      var on = p.id === id;
      p.classList.toggle('is-on', on);
      if (on && group) pickGroup(p, group);
      if (on && popIO) $$('.nxe-card:not(.is-in),.nxe-ch:not(.is-in)', p).forEach(function (c) { popIO.unobserve(c); popIO.observe(c); });
    });
    if (push && history.replaceState) history.replaceState(null, '', '#' + (group || id));
    portraits(document.getElementById(id));
    rails();
    return true;
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { select(t.getAttribute('aria-controls'), false, true); });
    t.addEventListener('keydown', function (e) {
      var k = e.key, n = tabs.length, j = k === 'ArrowRight' ? (i + 1) % n : k === 'ArrowLeft' ? (i + n - 1) % n : k === 'Home' ? 0 : k === 'End' ? n - 1 : -1;
      if (j < 0) return;
      e.preventDefault();
      select(tabs[j].getAttribute('aria-controls'), true, true);
    });
  });
  $$('[data-nxe-filter]').forEach(function (c) {
    c.addEventListener('click', function () {
      var cat = c.closest('.nxe-cat'), gid = c.getAttribute('data-nxe-filter');
      pickGroup(cat, gid);
      if (history.replaceState) history.replaceState(null, '', '#' + gid);
    });
  });
  function fromHash() {
    var h = decodeURIComponent((location.hash || '').slice(1));
    if (!h) return;
    var el = document.getElementById(h);
    if (!el) return;
    var cat = el.classList.contains('nxe-cat') ? el : el.closest('.nxe-cat');
    if (!cat) return;
    var g = el.closest('[data-nxe-group]');
    select(cat.id, false, false, g ? g.getAttribute('data-nxe-group') : null);
  }
  /* links to a category from inside the page (e.g. the Comics "watch the series" button) */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href').slice(1), el = id && document.getElementById(id);
    if (!el || !(el.classList.contains('nxe-cat') || el.closest('.nxe-cat'))) return;
    e.preventDefault();
    if (history.replaceState) history.replaceState(null, '', '#' + id);
    fromHash();
    var top = document.querySelector('.nxe-cats');
    if (top) top.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  });
  /* the sidekick portraits are drawn by nexi-explains-cast.js once their category is open */
  function portraits(root) { if (root && window.NXEportraits) window.NXEportraits(root); }
  if (tabs.length) {
    select(tabs[0].getAttribute('aria-controls'), false, false);
    fromHash();
    addEventListener('hashchange', fromHash);
    addEventListener('nxe:portraits-ready', function () { cats.forEach(function (c) { if (c.classList.contains('is-on')) portraits(c); }); });
  }

  /* ---------------- premiere states + the "next premiere" strip ---------------- */
  var pre = document.querySelector('[data-nxe-pre]'), post = document.querySelector('[data-nxe-post]');
  var next = document.querySelector('[data-nxe-next]');
  function states() {
    var now = Date.now(), soon = null;
    $$('.nxe-thumb[data-nxe-play]').forEach(function (b) {
      var t = when(b), st = b.querySelector('[data-nxe-state]');
      var live = !t || t <= now;
      b.classList.toggle('is-live', live);
      b.classList.toggle('is-wait', !live);   /* locked until its premiere: no player, no YouTube link */
      if (live) b.removeAttribute('aria-disabled'); else b.setAttribute('aria-disabled', 'true');
      if (st) st.textContent = live ? 'Watch now' : 'Premieres in ' + left(t - now);
      if (!live && (!soon || t < when(soon))) soon = b;
    });
    if (pre && post) { var on = released(post); pre.hidden = on; post.hidden = !on; }
    $$('[data-nxe-playall]').forEach(function (b) {
      var p = b.closest('.nxe-panel'), lab = b.querySelector('span');
      var eps = p ? $$('.nxe-thumb[data-nxe-play]', p).filter(function (x) { return !x.closest('.nxe-tips'); }) : [];
      var out = eps.filter(released);
      if (!lab) return;
      if (out.length) lab.textContent = out.length > 1 ? 'Play the season (' + out.length + ')' : 'Play the season';
      else if (eps.length) lab.textContent = 'Season premiere ' + fmtDay.format(new Date(when(eps[0])));
    });
    /* the hero's caption panel: the next premiere with a countdown, or the channel when nothing is scheduled */
    if (next && soon) {
      var t = when(soon), d = new Date(t);
      var cta = next.querySelector('[data-nxe-next-cta]');
      var tg = next.querySelector('[data-nxe-next-tag]');
      if (tg) tg.textContent = 'Next premiere';
      next.querySelector('[data-nxe-next-title]').textContent = soon.getAttribute('data-nxe-title') || '';
      var w = next.querySelector('[data-nxe-next-when]');
      w.textContent = '';
      var s = document.createElement('strong'); s.textContent = 'in ' + left(t - now);
      w.appendChild(s);
      w.appendChild(document.createTextNode(' · ' + fmtDay.format(d) + ', ' + fmtTime.format(d).toLowerCase() + ' SGT'));
      /* only a public premiere takes a reminder; a private upload stays hidden until its time, so point at the channel */
      var id = soon.getAttribute('data-nxe-play'), pub = soon.hasAttribute('data-nxe-pub') && ID.test(id);
      next.querySelector('[data-nxe-next-link]').href = pub ? WATCH + id : SUBSCRIBE;
      if (cta) cta.textContent = pub ? 'Set a reminder on YouTube' : 'Subscribe on YouTube';
    }
  }
  states();
  setInterval(function () { if (!document.hidden) states(); }, 30000);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) states(); });

  /* ---------------- player ---------------- */
  var dlg = document.getElementById('nxe-player');
  var frame = dlg && dlg.querySelector('[data-nxe-frame]'), ttl = dlg && dlg.querySelector('#nxe-player-t');
  var ytLink = dlg && dlg.querySelector('[data-nxe-yt]');
  var prevB = dlg && dlg.querySelector('[data-nxe-prev]'), nextB = dlg && dlg.querySelector('[data-nxe-next-ep]');
  var list = [], pos = -1;
  function load(id, title, more) {
    if (!ID.test(id)) return false;
    var src = EMBED + id + '?autoplay=1&rel=0&modestbranding=1';
    var ids = (more || []).filter(function (x) { return ID.test(x); });
    if (ids.length) src += '&playlist=' + ids.join(',');
    frame.textContent = '';
    var fr = document.createElement('iframe');
    fr.src = src;
    fr.title = title;
    fr.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture; fullscreen');
    fr.setAttribute('allowfullscreen', '');
    frame.appendChild(fr);
    ttl.textContent = title;
    ytLink.href = WATCH + id;
    return true;
  }
  function show() {
    if (!dlg.open) {
      if (typeof dlg.showModal === 'function') dlg.showModal();
      else dlg.setAttribute('open', '');
    }
  }
  function nav() {
    prevB.disabled = pos <= 0;
    nextB.disabled = pos < 0 || pos >= list.length - 1;
    prevB.hidden = nextB.hidden = list.length < 2;
  }
  function playAt(k) {
    var b = list[k];
    if (!b) return;
    pos = k;
    load(b.getAttribute('data-nxe-play'), b.getAttribute('data-nxe-title') || 'Nexi Explains');
    nav();
  }
  function playOne(btn) {
    var tips = btn.closest('.nxe-tips'), panel = btn.closest('.nxe-panel') || document.getElementById('season-1');
    if (!released(btn)) { nudge(btn); return; }
    var pool = (tips ? $$('.nxe-thumb[data-nxe-play]', tips)
                     : $$('.nxe-thumb[data-nxe-play]', panel || document).filter(function (x) { return !x.closest('.nxe-tips'); })).filter(released);
    list = pool;
    var id = btn.getAttribute('data-nxe-play');
    pos = -1;
    for (var k = 0; k < pool.length; k++) if (pool[k].getAttribute('data-nxe-play') === id) { pos = k; break; }
    if (pos < 0) { list = [btn]; pos = 0; }
    if (!dlg) { if (ID.test(id)) window.open(WATCH + id, '_blank', 'noopener'); return; }
    playAt(pos);
    show();
  }
  function playSeason(btn) {
    var panel = btn.closest('.nxe-panel');
    var eps = $$('.nxe-thumb[data-nxe-play]', panel).filter(function (x) { return !x.closest('.nxe-tips'); });
    var out = eps.filter(released);
    if (!out.length) { if (eps[0]) playOne(eps[0]); return; }
    var ids = out.map(function (x) { return x.getAttribute('data-nxe-play'); });
    var name = (panel.querySelector('.nxe-sn') || {}).textContent || 'Season';
    list = []; pos = -1; nav();
    if (load(ids[0], 'Nexi Explains · ' + name + ' (' + ids.length + (ids.length > 1 ? ' episodes)' : ' episode)'), ids.slice(1))) show();
  }
  document.addEventListener('click', function (e) {
    var all = e.target.closest('[data-nxe-playall]');
    if (all) { e.preventDefault(); playSeason(all); return; }
    var b = e.target.closest('[data-nxe-play]');
    if (b) { e.preventDefault(); playOne(b); }
  });
  if (dlg) {
    prevB.addEventListener('click', function () { playAt(pos - 1); });
    nextB.addEventListener('click', function () { playAt(pos + 1); });
    dlg.querySelector('[data-nxe-close]').addEventListener('click', function () { dlg.close ? dlg.close() : dlg.removeAttribute('open'); frame.textContent = ''; });
    dlg.addEventListener('close', function () { frame.textContent = ''; });
    // a click on the backdrop (outside the box) closes the player
    dlg.addEventListener('click', function (e) { if (e.target === dlg && dlg.close) dlg.close(); });
  }

  /* ---------------- Quick Tips rails ---------------- */
  function rails() {
    $$('.nxe-rail-wrap').forEach(function (w) {
      var r = w.querySelector('[data-nxe-rail]');
      var p = w.querySelector('[data-nxe-step="-1"]'), n = w.querySelector('[data-nxe-step="1"]');
      if (!r || !p || !n) return;
      p.disabled = r.scrollLeft < 8;
      n.disabled = r.scrollLeft + r.clientWidth >= r.scrollWidth - 8;
    });
  }
  $$('.nxe-rail-wrap').forEach(function (w) {
    var r = w.querySelector('[data-nxe-rail]');
    if (!r) return;
    r.addEventListener('scroll', function () { requestAnimationFrame(rails); }, { passive: true });
    $$('[data-nxe-step]', w).forEach(function (b) {
      b.addEventListener('click', function () {
        r.scrollBy({ left: (+b.getAttribute('data-nxe-step')) * r.clientWidth * 0.85, behavior: reduce ? 'auto' : 'smooth' });
      });
    });
  });
  addEventListener('resize', rails);
  rails();
})();
