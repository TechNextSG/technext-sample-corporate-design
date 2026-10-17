/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* Hero stages (assets/css/stage.css): start after the first-visit intro, pause when
   offscreen or in a hidden tab, add pointer depth, cycle the Training roles, and load
   the Google Map only on request (or once the visitor has accepted cookies). */
(function () {
  'use strict';
  var doc = document.documentElement;
  var reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  var fine = !!(window.matchMedia && matchMedia('(pointer: fine)').matches);
  var stages = [].slice.call(document.querySelectorAll('.stage'));

  /* ---------------- run / pause ---------------- */
  function svgsOf(stage) { return [].slice.call(stage.querySelectorAll('svg.st-anim')); }
  function apply(stage) {
    var on = !reduce && !doc.classList.contains('intro') && stage._inView !== false && !document.hidden;
    if (on === stage._on) return;
    stage._on = on;
    stage.classList.toggle('is-paused', !on);
    svgsOf(stage).forEach(function (s) {
      try { if (on) s.unpauseAnimations(); else s.pauseAnimations(); } catch (e) { /* no SMIL */ }
    });
  }
  function applyAll() { stages.forEach(apply); }

  stages.forEach(function (st) { st._on = null; apply(st); });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { en.target._inView = en.isIntersecting; apply(en.target); });
    }, { rootMargin: '80px 0px' });
    stages.forEach(function (st) { io.observe(st); });
  }
  document.addEventListener('visibilitychange', applyAll);
  document.addEventListener('tn:intro-done', applyAll);

  /* ---------------- pointer depth + backdrop spotlight ---------------- */
  if (!reduce && fine) {
    [].forEach.call(document.querySelectorAll('[data-stage-hero]'), function (hero) {
      var st = hero.querySelector('.stage'), spot = hero.querySelector('.ph-spot');
      /* Each depth layer gets its own translate. Setting --px/--py on the stage made every element in it
         inherit a new value, so the whole stage restyled on every pointer frame. The cards ease over .9 s
         (a CSS transition), so 20 target updates a second look the same as 60; the spotlight stays per frame. */
      var deps = st ? [].map.call(st.querySelectorAll('.dp'), function (el) { return { el: el, d: parseFloat(getComputedStyle(el).getPropertyValue('--d')) || 0, v: '' }; }) : [];
      var raf = 0, x = 0, y = 0, box = null, depT = 0, depAt = 0;
      function measure() { var r = hero.getBoundingClientRect(); box = { l: r.left, t: r.top + window.scrollY, w: r.width, h: r.height }; }
      function depth() {
        depT = 0; depAt = performance.now();
        deps.forEach(function (p) {
          var v = (x * 2 * p.d).toFixed(1) + 'px ' + (y * 2 * p.d).toFixed(1) + 'px';
          if (v !== p.v) { p.v = v; p.el.style.translate = v; }
        });
      }
      function paint() {
        raf = 0;
        if (spot && box) { spot.style.setProperty('--sx', ((x + 0.5) * box.w).toFixed(1) + 'px'); spot.style.setProperty('--sy', ((y + 0.5) * box.h).toFixed(1) + 'px'); }
        if (deps.length && !depT) { var wait = 50 - (performance.now() - depAt); if (wait <= 0) depth(); else depT = setTimeout(depth, wait); }
      }
      window.addEventListener('resize', function () { box = null; }, { passive: true });
      hero.addEventListener('pointerenter', function () { box = null; });
      hero.addEventListener('pointermove', function (e) {
        if (!box) measure();
        if (!box.w || !box.h) return;
        x = (e.clientX - box.l) / box.w - 0.5;
        y = (e.clientY + window.scrollY - box.t) / box.h - 0.5;
        if (!raf) raf = requestAnimationFrame(paint);
      }, { passive: true });
      hero.addEventListener('pointerleave', function () { x = 0; y = 0; if (!raf) raf = requestAnimationFrame(paint); });
      /* the spotlight starts where it always sat (72% / 34%); the stage layers stay at rest */
      measure(); if (spot) { spot.style.setProperty('--sx', (0.72 * box.w).toFixed(1) + 'px'); spot.style.setProperty('--sy', (0.34 * box.h).toFixed(1) + 'px'); }
      if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { hero.classList.toggle('is-still', !es[es.length - 1].isIntersecting); }).observe(hero);
    });
  }

  /* ---------------- integration: hovering a system lights its line ---------------- */
  [].forEach.call(document.querySelectorAll('.stage [data-node]'), function (n) {
    var st = n.closest('.stage');
    n.addEventListener('pointerenter', function () { st.setAttribute('data-hot', n.getAttribute('data-node')); });
    n.addEventListener('pointerleave', function () { st.removeAttribute('data-hot'); });
  });

  /* ---------------- training: cycle the role tabs ---------------- */
  [].forEach.call(document.querySelectorAll('.stage[data-cycle]'), function (st) {
    var roles = st.getAttribute('data-cycle').split(',');
    var i = 0, hold = 0;
    function show(k) {
      i = k;
      roles.forEach(function (r, j) { st.classList.toggle('is-' + r, j === k); });
    }
    show(0);
    [].forEach.call(st.querySelectorAll('[data-role-tab]'), function (tab) {
      tab.addEventListener('click', function () {
        var k = roles.indexOf(tab.getAttribute('data-role-tab'));
        if (k > -1) { show(k); hold = Date.now() + 12000; }
      });
    });
    if (reduce) return;
    setInterval(function () {
      if (st._on && Date.now() > hold) show((i + 1) % roles.length);
    }, 5200);
  });

  /* ---------------- Google Map: nothing loads from Google until asked ----------------
     One map shows one office at a time; the office cards' "Show on map" buttons switch it.
     Every URL and label is a constant here: the DOM only ever supplies a key, which is
     matched against MAP_KEYS before use. */
  var MAPS = {
    hq: {
      src: 'https://www.google.com/maps?q=261%20Waterloo%20Street%20%2303-36%2C%20Singapore%20180261&z=17&output=embed',
      title: 'Map: TechNext Singapore HQ, 261 Waterloo Street #03-36, Singapore 180261',
      label: ['261 Waterloo Street #03-36', 'Singapore 180261']
    },
    ph: {
      src: 'https://www.google.com/maps?q=TechNext%20Philippines&ll=14.5349862,121.0513368&z=17&output=embed',
      title: 'Map: TechNext Philippines, Level 9, IP Center, Taguig City, Metro Manila',
      label: ['Level 9, IP Center', 'Taguig City, Metro Manila']
    },
    vn: {
      src: 'https://www.google.com/maps?q=62%20Nguy%E1%BB%85n%20Th%E1%BB%8B%20Nhung%2C%20Hi%E1%BB%87p%20B%C3%ACnh%2C%20H%E1%BB%93%20Ch%C3%AD%20Minh&z=16&output=embed',
      title: 'Map: TechNext Vietnam AI engineering hub, 62 Nguyen Thi Nhung, Hiep Binh, Ho Chi Minh City',
      label: ['62 Nguyễn Thị Nhung, Phường Hiệp Bình', 'Ho Chi Minh City, Vietnam']
    }
  };
  var MAP_KEYS = Object.keys(MAPS);
  function mapKey(v) { var i = MAP_KEYS.indexOf(v); return i > -1 ? MAP_KEYS[i] : null; }
  function consented() {
    try { return document.cookie.indexOf('tn_consent=yes') > -1; } catch (e) { return false; }
  }
  function loadMap(box) {
    var k = mapKey(box.getAttribute('data-map'));
    if (!k || box.classList.contains('is-loaded')) return;
    var f = document.createElement('iframe');
    f.src = MAPS[k].src;
    f.title = MAPS[k].title;
    f.allowFullscreen = true;
    f.referrerPolicy = 'no-referrer-when-downgrade';
    box.appendChild(f);
    box.classList.add('is-loaded');
  }
  function pointMap(box, key) {
    var k = mapKey(key);
    if (!k) return;
    box.setAttribute('data-map', k);
    var label = box.querySelector('[data-map-label]');
    if (label) {
      label.textContent = MAPS[k].label[0];
      label.appendChild(document.createElement('br'));
      label.appendChild(document.createTextNode(MAPS[k].label[1]));
    }
    var f = box.querySelector('iframe');
    if (f) { f.src = MAPS[k].src; f.title = MAPS[k].title; }
  }
  [].forEach.call(document.querySelectorAll('.map[data-map]'), function (box) {
    var btn = box.querySelector('[data-map-load]');
    if (btn) btn.addEventListener('click', function () { loadMap(box); });
    if (!('IntersectionObserver' in window)) return;
    var mio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && consented()) { loadMap(box); mio.disconnect(); }
      });
    }, { rootMargin: '200px 0px' });
    mio.observe(box);
  });
  var showBtns = [].slice.call(document.querySelectorAll('[data-office-show]'));
  function showOffice(btn, load) {
    var box = document.getElementById(btn.getAttribute('aria-controls') || '');
    if (!box) return;
    pointMap(box, btn.getAttribute('data-office-show'));
    showBtns.forEach(function (b) {
      var on = b === btn;
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      var card = b.closest('[data-office]');
      if (card) card.classList.toggle('is-on', on);
    });
    if (load) {
      loadMap(box);                                   // pressing "Show on map" is the request to load it
      var r = box.getBoundingClientRect();
      if (r.top < 0 || r.bottom > window.innerHeight) box.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
    }
  }
  showBtns.forEach(function (b) { b.addEventListener('click', function () { showOffice(b, true); }); });
  // company#office-ph (from the Company menu) opens with that office on the map
  function fromHash() {
    var k = mapKey((window.location.hash || '').replace('#office-', ''));
    if (k) showBtns.forEach(function (b) { if (b.getAttribute('data-office-show') === k) showOffice(b, false); });
  }
  if (showBtns.length) { fromHash(); window.addEventListener('hashchange', fromHash); }
})();
