/* Calm homepage (styles: assets/css/home.css). Only one behaviour: the FAQ search filters the questions as you type;
   arrow keys move between them, "/" jumps to the search while the FAQ is on screen. Nothing moves by itself.
   The earlier homepage script (counters, clocks, the stepping road) is kept, unused, in _src/legacy/home-carousel.js. */
(function () {
  'use strict';
  if (!document.body.classList.contains('is-home')) return;

  /* ---------------------------------------------------------------- help desk search (FAQ) */
  var pal = document.querySelector('[data-hm-pal]');
  if (pal) {
    var q = pal.querySelector('[data-hm-pal-q]'), items = Array.prototype.slice.call(pal.querySelectorAll('details'));
    var empty = pal.querySelector('[data-hm-pal-empty]'), count = pal.querySelector('[data-hm-pal-count]');
    var norm = function (s) { return s.toLowerCase().replace(/\s+/g, ' '); };
    var text = items.map(function (d) { return norm(d.textContent); });
    var filter = function () {
      var words = norm(q.value).trim().split(' ').filter(Boolean), n = 0;
      items.forEach(function (d, i) {
        var hit = words.every(function (w) { return text[i].indexOf(w) >= 0; });
        d.hidden = !hit; if (hit) n++;
      });
      empty.hidden = n > 0;
      count.textContent = n + (n === 1 ? ' answer' : ' answers');
    };
    q.addEventListener('input', filter);
    var visible = function () { return items.filter(function (d) { return !d.hidden; }).map(function (d) { return d.querySelector('summary'); }); };
    pal.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      var list = visible(); if (!list.length) return;
      var i = list.indexOf(document.activeElement);
      if (document.activeElement === q) i = e.key === 'ArrowDown' ? -1 : list.length;
      var next = e.key === 'ArrowDown' ? i + 1 : i - 1;
      if (next < 0) { q.focus(); e.preventDefault(); return; }
      if (next >= list.length) return;
      list[next].focus(); e.preventDefault();
    });
    q.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { var l = visible(); if (l.length === 1) { l[0].parentNode.open = true; l[0].focus(); } e.preventDefault(); }
      if (e.key === 'Escape' && q.value) { q.value = ''; filter(); }
    });
    var palOn = false;
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { palOn = en[0].isIntersecting; }).observe(pal);
    document.addEventListener('keydown', function (e) {
      if (!palOn || e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
      var a = document.activeElement;
      if (a && (a.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName))) return;
      e.preventDefault(); q.focus();
    });
  }

})();
