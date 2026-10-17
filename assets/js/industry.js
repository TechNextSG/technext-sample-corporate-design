/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* Industry pages: the workflow tabs (auto-advance until the visitor takes over), the before/after
   flip and the sample dashboard's view buttons. Everything is readable without this script. */
(function () {
  'use strict';
  var reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  function inView(el, cb) {
    if (!('IntersectionObserver' in window)) { cb(true); return; }
    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { cb(en.isIntersecting); });
    }, { threshold: 0.35 }).observe(el);
  }

  /* ---------------- workflow: tabs on a rail ---------------- */
  [].forEach.call(document.querySelectorAll('[data-ixflow]'), function (flow) {
    var tabs = [].slice.call(flow.querySelectorAll('[role="tab"]'));
    var panels = [].slice.call(flow.querySelectorAll('[role="tabpanel"]'));
    var rail = flow.querySelector('.ix-rail');
    if (!tabs.length || tabs.length !== panels.length) return;
    flow.classList.add('is-js');
    var at = 0, auto = !reduce, visible = false, timer = null;
    function show(i, focus) {
      at = (i + tabs.length) % tabs.length;
      tabs.forEach(function (t, k) {
        var on = k === at;
        t.classList.toggle('is-on', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        panels[k].classList.toggle('is-on', on);
      });
      if (rail) rail.style.setProperty('--p', String(at / (tabs.length - 1)));
      if (focus) tabs[at].focus();
    }
    function stop() { auto = false; if (timer) { clearInterval(timer); timer = null; } }
    function tick() {
      if (timer || !auto) return;
      timer = setInterval(function () {
        if (auto && visible && !document.hidden) show(at + 1);
      }, 4800);
    }
    tabs.forEach(function (t, k) {
      t.addEventListener('click', function () { stop(); show(k); });
      t.addEventListener('keydown', function (e) {
        var next = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = at + 1;
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = at - 1;
        else if (e.key === 'Home') next = 0;
        else if (e.key === 'End') next = tabs.length - 1;
        if (next === null) return;
        e.preventDefault(); stop(); show(next, true);
      });
    });
    // hovering or focusing inside pauses the tour; the visitor's first click ends it
    flow.addEventListener('mouseenter', function () { visible = false; });
    flow.addEventListener('mouseleave', function () { visible = true; });
    flow.addEventListener('focusin', function () { visible = false; });
    show(0);
    inView(flow, function (on) { visible = on; if (on) tick(); });
  });

  /* ---------------- before / after ---------------- */
  [].forEach.call(document.querySelectorAll('[data-ixba]'), function (list) {
    var wrap = list.closest('.ix-ba-wrap') || document;
    var btns = [].slice.call(wrap.querySelectorAll('[data-ba]'));
    list.classList.add('is-js');
    function set(state) {
      list.setAttribute('data-state', state);
      btns.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-ba') === state ? 'true' : 'false'); });
    }
    btns.forEach(function (b) {
      b.addEventListener('click', function () { played = true; set(b.getAttribute('data-ba') === 'before' ? 'before' : 'after'); });
    });
    // first time it scrolls into view: show today, then flip to Odoo row by row
    var played = reduce;
    if (!played) set('before');
    inView(list, function (on) {
      if (!on || played) return;
      played = true;
      setTimeout(function () { set('after'); }, 700);
    });
  });

  /* ---------------- sample dashboard views ---------------- */
  [].forEach.call(document.querySelectorAll('[data-ixchart]'), function (dash) {
    var btns = [].slice.call(dash.querySelectorAll('[data-view]'));
    var plots = [].slice.call(dash.querySelectorAll('[data-plot]'));
    btns.forEach(function (b, k) {
      b.addEventListener('click', function () {
        btns.forEach(function (x, j) { x.setAttribute('aria-pressed', j === k ? 'true' : 'false'); });
        plots.forEach(function (p, j) { p.hidden = j !== k; });
        // replay the grow animation for the newly shown view
        if (!reduce && plots[k]) {
          dash.classList.remove('is-in');
          void dash.offsetWidth;
          dash.classList.add('is-in');
        }
      });
    });
  });
})();
