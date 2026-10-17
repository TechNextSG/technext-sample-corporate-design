/* Nexi, TechNext's AI companion. A small 3D robot in the home hero. On desktop it roams every slide:
   it circles the Odoo app orbit, chases order tokens through the flow chart, cheers the launch path,
   points at the call-to-action and follows slide changes. On the two Nexi slides (data-slide-nexi) it is
   the show: hero-scenes.js runs a script and Nexi performs it. Clicking Nexi opens a short
   self-introduction. No chat logic lives here.

   This file is only the loader, so pages pay for a few hundred bytes until Nexi is needed. It downloads
   Three.js (r128, MIT, self-hosted in assets/js/vendor/ because the CSP only allows same-origin scripts)
   and the robot in assets/js/nexi-bot.js.
   - Desktop (min-width:961px, a fine pointer): while the intro plays, and Nexi starts as it ends.
   - Phones and touch screens: a lighter Nexi (no glow pass, lower pixel ratio) that runs only while a
     Nexi slide shows. The files are fetched in the background once the page is quiet (not on Save-Data),
     and Nexi starts the moment a Nexi slide opens.
   Reduced motion: never (the Nexi slides show a drawn Nexi instead). */
(function () {
  'use strict';
  var hero = document.querySelector('[data-hero]');
  if (!hero) return;
  var ROOT = hero.getAttribute('data-root') || '';
  /* both scripts resolve next to this file's own URL (never from page markup) */
  var me = document.currentScript && document.currentScript.src;
  if (!me) return;
  var V = new URL(me).searchParams.get('v');
  var THREE_URL = new URL('vendor/three-r128.min.js', me).href;
  var BOT_URL = new URL('nexi-bot.js' + (V ? '?v=' + encodeURIComponent(V) : ''), me).href;
  var desk = matchMedia('(min-width: 961px) and (hover: hover) and (pointer: fine)');
  var calm = matchMedia('(prefers-reduced-motion: reduce)');
  var app = null, loading = false, failed = false, whenUp = null;

  function webgl() { try { var c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; } }
  function onNexiSlide() { var s = hero.querySelector('.slide.is-active'); return !!(s && s.hasAttribute('data-slide-nexi')); }
  function hasNexiSlides() { return !!hero.querySelector('[data-slide-nexi]'); }
  /* may Nexi draw right now? Never under the first-visit intro: she warms up there and starts as it ends */
  function introOn() { return document.documentElement.classList.contains('intro'); }
  function allowed() {
    if (calm.matches || introOn()) return false;
    if (document.documentElement.classList.contains('hxs-on')) return false;   // the industries slide has its own Nexi
    // the desktop build is hidden below 961 px (hero.css): it runs only where it shows
    if (app && !app.lite) return desk.matches;
    return desk.matches || onNexiSlide();
  }
  /* may Nexi exist on this device at all? */
  function possible() { return !calm.matches && (desk.matches || hasNexiSlides()); }
  function script(src, ok) {
    var s = document.createElement('script');
    s.src = src; s.async = true;
    s.onload = ok; s.onerror = function () { loading = false; failed = true; hero.dispatchEvent(new CustomEvent('tn:nexi-fail')); up(); };
    document.head.appendChild(s);
  }
  /* tell whoever waits for Nexi (the intro's held quiet beat) that she is up, or will not be */
  function up() { var f = whenUp; whenUp = null; if (f) f(); }
  function start() {
    loading = false;
    if (app || !possible() || !window.THREE || !window.tnNexi) { up(); return; }
    app = window.tnNexi(hero, ROOT, { lite: !desk.matches });
    if (!app) { failed = true; hero.dispatchEvent(new CustomEvent('tn:nexi-fail')); up(); return; }
    window.TNNexi = app;
    sync(); up();
  }
  function load(done) {
    if (typeof done === 'function') whenUp = done;          /* (requestIdleCallback passes a deadline) */
    if (app || loading || failed || !possible()) { if (!loading) up(); return; }
    if (!webgl()) { failed = true; hero.dispatchEvent(new CustomEvent('tn:nexi-fail')); up(); return; }
    loading = true;
    var bot = function () { if (window.tnNexi) start(); else script(BOT_URL, start); };
    if (window.THREE) bot(); else script(THREE_URL, bot);
  }
  /* fetch both files into the cache now (network only, nothing runs), so nothing waits later */
  var preloaded = false;
  function preload() {
    if (preloaded || !possible()) return; preloaded = true;
    [THREE_URL, BOT_URL].forEach(function (u) { var l = document.createElement('link'); l.rel = 'prefetch'; l.as = 'script'; l.href = u; document.head.appendChild(l); });
  }
  function whenSettled(fn, wait) {
    var html = document.documentElement;
    /* start right after the hero's entrance settles, in a quiet frame */
    var go = function () { setTimeout(function () { (window.requestIdleCallback || function (f) { return setTimeout(f, 50); })(fn, { timeout: 600 }); }, wait == null ? 900 : wait); };
    if (html.classList.contains('intro')) document.addEventListener('tn:intro-done', go, { once: true }); else go();
  }
  function sync() {
    if (!app) { if (allowed()) load(); return; }
    if (allowed()) app.resume(); else app.pause();
  }
  [desk, calm].forEach(function (m) { if (m.addEventListener) m.addEventListener('change', sync); else m.addListener(sync); });
  /* phones: Nexi wakes with a Nexi slide and sleeps when the carousel moves on */
  /* desktop: stepping aside (the industries slide) is immediate; coming back waits until the new slide has settled,
     so her restart (about 20 ms of WebGL work) never lands on the transition */
  var backT = 0;
  hero.addEventListener('tn:slide', function () {
    if (!desk.matches) { sync(); return; }
    clearTimeout(backT);
    setTimeout(function () {
      if (!app) return;
      if (!allowed()) { app.pause(); return; }
      backT = setTimeout(function () { if (app) sync(); }, 1100);
    }, 0);
  });

  var saveData = navigator.connection && navigator.connection.saveData;
  /* the intro's end only wakes a Nexi that already exists: loading her here would land her set-up (Three.js + WebGL,
     the page's longest task) on the iris; whenSettled loads her once the hero has settled */
  document.addEventListener('tn:intro-done', function () { if (app) sync(); });
  /* a Nexi slide opening the page loads Nexi during the intro, once its flight is over (so her slide's timer
     never waits for her, and her set-up never lands on the flight); otherwise desktop loads her after the hero
     settles, and phones keep the files in the cache for one */
  if (onNexiSlide() && possible()) { if (introOn()) setTimeout(load, 1600); else load(); }
  else if (desk.matches) {
    preload();
    /* under the intro: in its quiet last beat, which waits for her (see site.js); otherwise once the hero settles */
    if (introOn()) document.addEventListener('tn:intro-quiet', function (e) { load(e.detail && e.detail.hold ? e.detail.hold() : null); }, { once: true });
    whenSettled(load);
  }
  else if (possible() && !saveData) whenSettled(preload, 2500);
})();
