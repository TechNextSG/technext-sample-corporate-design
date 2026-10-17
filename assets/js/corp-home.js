/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This design and code are not licensed for copying, reuse or AI training. */
/* HOME, corporate redesign SAMPLE: the focus-apps tabs (WAI-ARIA tabs pattern) and the lead-to-cash process map, whose
   route is drawn through the station icons and animated once when the map scrolls into view. Without JS the first
   tab's panel and every station stay visible. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------ tabs */
  $$('[data-tabs]').forEach(function (box) {
    var tabs = $$('[role="tab"]', box);
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) tab.focus();
    }
    tabs.forEach(function (t, k) {
      t.addEventListener('click', function () { select(t); });
      t.addEventListener('keydown', function (e) {
        var to = { ArrowRight: k + 1, ArrowLeft: k - 1, Home: 0, End: tabs.length - 1 }[e.key];
        if (to === undefined) return;
        e.preventDefault();
        select(tabs[(to + tabs.length) % tabs.length], true);
      });
    });
  });

  /* ------------------------------------------------ process map */
  var map = $('[data-map]');
  if (!map) return;
  var path = $('[data-route] path', map), icons = $$('.cx-stations img', map);

  function route() {
    // layout offsets, not client rects: the stations' entrance transform must not bend the route
    var pts = icons.map(function (im) {
      var li = im.parentNode;
      return [li.offsetLeft + im.offsetLeft + im.offsetWidth / 2, li.offsetTop + im.offsetTop + im.offsetHeight / 2];
    });
    // orthogonal route: along the lane, then down at the midpoint between two stations, with 8px rounded corners
    var d = 'M' + pts[0][0] + ' ' + pts[0][1], R = 8;
    for (var i = 1; i < pts.length; i++) {
      var a = pts[i - 1], b = pts[i];
      if (Math.abs(a[1] - b[1]) < 1) { d += ' L' + b[0] + ' ' + b[1]; continue; }
      var mx = (a[0] + b[0]) / 2, dir = b[1] > a[1] ? 1 : -1;
      d += ' L' + (mx - R) + ' ' + a[1] + ' Q' + mx + ' ' + a[1] + ' ' + mx + ' ' + (a[1] + R * dir) +
           ' L' + mx + ' ' + (b[1] - R * dir) + ' Q' + mx + ' ' + b[1] + ' ' + (mx + R) + ' ' + b[1] + ' L' + b[0] + ' ' + b[1];
    }
    path.setAttribute('d', d);
    map.style.setProperty('--len', Math.ceil(path.getTotalLength()) + 'px');
  }
  route();
  window.addEventListener('resize', route);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(route);

  if (reduced || !('IntersectionObserver' in window)) return;
  map.classList.add('is-drawable');
  var io = new IntersectionObserver(function (es) {
    if (!es[0].isIntersecting) return;
    map.classList.add('is-drawn');
    io.disconnect();
  }, { threshold: 0.35 });
  io.observe(map);
})();
