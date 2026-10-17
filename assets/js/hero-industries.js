/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* The homepage hero's industries slide ([data-inds], markup from worlds.showcase_html()): the whole slide becomes each
   industry's own hero in turn. Its real scene fills the background (crossfading, drifting with the pointer), the page's
   own title card, tag and buttons (skins extracted from the industry stylesheets into hero-skins.css, loaded here when the
   page is idle) and Nexi in that industry's costume with three workflow steps. The industries change every few seconds
   while the slide shows and carry on from where they stopped next time; the badge strip (click or arrow keys) picks one.
   Scenes load one at a time: the one showing and the next. */
(function () {
  'use strict';
  var root = document.querySelector('[data-inds]'); if (!root) return;
  var slide = root.closest('.slide'), hero = root.closest('.hero') || document;
  var $$ = function (s) { return [].slice.call(root.querySelectorAll(s)); };
  var bgs = $$('.hxs-bg'), panels = $$('.hxs-panel'), casts = $$('.hxs-cast'), chans = $$('.hxs-ch');
  var reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  var fine = !!(window.matchMedia && matchMedia('(hover:hover) and (pointer:fine)').matches);
  var STEP = 5200, n = panels.length, at = 0, timer = 0, outT = 0, enterT = 0, dressT = 0, held = false, active = false;
  var html = document.documentElement, header = document.querySelector('.header');
  /* the page around the slide takes the showing industry's style: its colours go on <html> as --hx-* for the header's
     Contact Us and the side tabs (hero.css); the header stays see-through over the scene; the roaming 3D Nexi steps aside */
  /* The colours go only on the elements that use them (the header, the side tabs, the sky's ring), never on <html>:
     a custom property set there restyles all ~3,000 elements of the page, which was a 100 ms hitch on every change.
     Each industry's colours are read once, when the skins have loaded, and kept. */
  var VARS = ['st-ink', 'st-meet', 'st-talk', 'st-nexi', 'st-nexi-fg', 'st-fg', 'hc-bg', 'hc-fg'];
  var sky = root.querySelector('.hxs-sky'), tabs = document.querySelector('.side-tabs'), cols = null, painted = -2;
  var wearers = [header, tabs, sky].filter(Boolean);
  function colours() {
    if (cols || !root.classList.contains('is-skinned')) return cols;
    cols = panels.map(function (p) { var cs = getComputedStyle(p); return VARS.map(function (v) { return cs.getPropertyValue('--' + v).trim(); }); });
    return cols;
  }
  function dress() {
    var want = active ? at : -1;
    if (want === -1) { html.classList.remove('hxs-on', 'hxs-top'); }
    else { html.classList.add('hxs-on'); topSoon(); }
    var c = want === -1 ? null : colours(); if (c === null && want !== -1) return;   // the colours come with the skins
    if (painted === want) return; painted = want;
    wearers.forEach(function (el) { VARS.forEach(function (v, k) { var val = c && c[want][k]; if (val) el.style.setProperty('--hx-' + v, val); else el.style.removeProperty('--hx-' + v); }); });
  }
  /* the header stays see-through while the slide's bottom is well below it (read in a frame, never after a write) */
  var topRaf = 0;
  function top() { topRaf = 0; var r = slide.getBoundingClientRect(); html.classList.toggle('hxs-top', active && r.bottom > (header ? header.offsetHeight : 70) + 120); }
  function topSoon() { if (!topRaf) topRaf = requestAnimationFrame(function () { setTimeout(top, 0); }); }   // read after the frame's layout, never force one
  window.addEventListener('scroll', function () { if (active) topSoon(); }, { passive: true });
  /* restart a class's animation without forcing a layout: off now, back on two frames later */
  function replay(el, cls, on) {
    el.classList.remove(cls); var tok = (el['_r' + cls] = (el['_r' + cls] || 0) + 1);
    requestAnimationFrame(function () { requestAnimationFrame(function () { if (el['_r' + cls] === tok && (!on || on())) el.classList.add(cls); }); });
  }
  /* tell the carousel the visitor is busy with Nexi, so the slide never changes under a reaction */
  function heroHold(on) { if (hero && hero.dispatchEvent) hero.dispatchEvent(new CustomEvent('tn:hero-hold', { detail: { why: 'hxs-react', on: on } })); }
  /* where the scene opens from: the picked badge, in the sky's own coordinates, and the radius that covers the sky */
  function origin() {
    var s = sky.getBoundingClientRect(), c = chans[at].getBoundingClientRect(); if (!s.width || !c.width) return;
    var x = c.left + c.width / 2 - s.left, y = c.top + c.height / 2 - s.top;
    var r = Math.ceil(Math.sqrt(Math.pow(Math.max(x, s.width - x), 2) + Math.pow(Math.max(y, s.height - y), 2))) + 8;
    sky.style.setProperty('--ox', x.toFixed(0) + 'px'); sky.style.setProperty('--oy', y.toFixed(0) + 'px'); sky.style.setProperty('--or', r + 'px');
  }
  function pickOther() { var r = Math.floor(Math.random() * (n - 1)); return r >= at ? r + 1 : r; }
  /* the industry the next visit opens on is picked ahead and its scene and Nexi loaded, so the circle never opens on a
     scene still downloading */
  var nextUp = -1;
  function pickAhead() { nextUp = pickOther(); warm(nextUp); }

  /* the skins (the industry pages' cards and buttons) */
  var skinned = false;
  function skins() {
    if (skinned) return; skinned = true;
    var base = document.querySelector('link[href*="hero.css"]');
    var l = document.createElement('link'); l.rel = 'stylesheet';
    l.href = base ? base.href.replace('hero.css', 'hero-skins.css') : '/assets/css/hero-skins.css';
    l.onload = function () {
      root.classList.add('is-skinned');
      if (active) dress(); else (window.requestIdleCallback || function (f) { return setTimeout(f, 200); })(colours);
    };
    l.onerror = function () { root.classList.add('is-skinned'); };
    document.head.appendChild(l);
  }
  function img(el) { if (!el) return; [].forEach.call(el.querySelectorAll('img[data-src]'), function (im) { im.src = im.getAttribute('data-src'); im.removeAttribute('data-src'); }); }
  function warm(i) { img(bgs[i]); var pr = casts[i] && casts[i].querySelector('.hxs-pose[data-pose="present"]'); if (pr && pr.hasAttribute('data-src')) { pr.src = pr.getAttribute('data-src'); pr.removeAttribute('data-src'); } }

  /* Nexi as the model: a tap swaps the pose for the next of the page's reactions and floats its line above the head */
  var reactHeld = false;
  function esc(t) { return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function pose(cast, name) {
    var want = cast.querySelector('.hxs-pose[data-pose="' + name + '"]');
    if (!want || want.hasAttribute('data-src') || !(want.complete && want.naturalWidth)) want = cast.querySelector('.hxs-pose[data-pose="present"]');
    [].forEach.call(cast.querySelectorAll('.hxs-pose'), function (im) { im.classList.toggle('is-on', im === want); });
  }
  function calm(cast) {
    if (!cast) return; clearTimeout(cast._t);
    var say = cast.querySelector('.hxs-say'); if (say) say.classList.remove('is-on');
    cast.classList.remove('is-saying'); pose(cast, 'present');
  }
  function react(cast) {
    var btn = cast.querySelector('.hxs-nexi-b'); if (!btn) return;
    img(cast);   // the reaction poses load on the first tap
    var list = (btn.getAttribute('data-reacts') || '').split('|').map(function (x) { var k = x.indexOf('::'); return { pose: x.slice(0, k), text: x.slice(k + 2) }; }).filter(function (x) { return x.pose; });
    if (!list.length) return;
    var ri = cast.getAttribute('data-ri'), n2 = ri === null ? 0 : (+ri + 1) % list.length, r = list[n2]; cast.setAttribute('data-ri', n2);
    var go = function () {
      pose(cast, r.pose);
      var say = cast.querySelector('.hxs-say');
      say.innerHTML = esc(r.text).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
      say.classList.remove('is-on'); void say.offsetWidth; say.classList.add('is-on');
      btn.classList.remove('is-react'); void btn.offsetWidth; btn.classList.add('is-react');
    };
    var im = cast.querySelector('.hxs-pose[data-pose="' + r.pose + '"]');
    if (im && !(im.complete && im.naturalWidth)) { im.addEventListener('load', go, { once: true }); setTimeout(go, 500); } else go();
    root.classList.add('was-tapped'); cast.classList.add('is-saying');
    reactHeld = true; arm(); heroHold(true);
    clearTimeout(cast._t); cast._t = setTimeout(function () { calm(cast); reactHeld = false; arm(); heroHold(false); }, 4600);
  }
  casts.forEach(function (cast) {
    var btn = cast.querySelector('.hxs-nexi-b'); if (!btn) return;
    btn.addEventListener('click', function (e) { e.preventDefault(); react(cast); });
    btn.addEventListener('pointerenter', function () { img(cast); }, { once: true });
  });

  function show(i) {
    i = (i + n) % n; if (i === at) { arm(); return; }
    var prev = at; at = i; origin();   // measure first, while nothing has changed yet
    warm(at); warm((at + 1) % n);
    if (reactHeld) heroHold(false);
    calm(casts[prev]); reactHeld = false;
    casts.forEach(function (cs, k) { var b = cs.querySelector('.hxs-nexi-b'); if (b) b.tabIndex = k === at ? 0 : -1; });
    clearTimeout(outT);
    replay(root, 'is-swap');
    [bgs, panels, casts].forEach(function (list) {
      list.forEach(function (el, k) { el.classList.toggle('is-on', k === at); el.classList.toggle('is-out', k === prev); });
    });
    panels.forEach(function (p, k) {
      p.setAttribute('aria-hidden', k === at ? 'false' : 'true');
      [].forEach.call(p.querySelectorAll('a'), function (a) { a.tabIndex = k === at ? 0 : -1; });
    });
    chans.forEach(function (c, k) { c.classList.toggle('is-on', k === at); c.setAttribute('aria-selected', k === at ? 'true' : 'false'); c.tabIndex = k === at ? 0 : -1; });
    outT = setTimeout(function () { [bgs, panels, casts].forEach(function (list) { list[prev].classList.remove('is-out'); }); }, 1300);
    if (skinned && root.classList.contains('is-skinned')) dress();
    arm();
  }
  function arm() {
    clearTimeout(timer);
    var still = !active || held || reactHeld || reduce || document.hidden;
    root.classList.toggle('is-held', still);
    replay(root, 'is-tick', function () { return !root.classList.contains('is-held'); });
    if (still) return;
    timer = setTimeout(function () { show(at + 1); }, STEP);
  }
  function setActive(on) {
    if (on === active) return; active = on;
    // every visit opens on a different industry, picked at random
    if (on) { skins(); var next = nextUp >= 0 ? nextUp : pickOther(); jump(next); nextUp = -1; }
    else { if (reactHeld) { reactHeld = false; heroHold(false); } setTimeout(pickAhead, 1500); }
    // the page's colours change as the circle sweeps past the header (straight away on the way out)
    clearTimeout(dressT); if (on) dressT = setTimeout(dress, 420); else dress();
    // the entrance: the scene pushes in, the card rises, its parts arrive in turn, Nexi hops in (hero.css .is-enter)
    var cls = on ? 'is-enter' : 'is-leave', had = root.classList.contains(cls);
    root.classList.remove('is-enter', 'is-leave');
    if (had) replay(root, cls); else root.classList.add(cls);   // only a quick return needs the replay
    clearTimeout(enterT); enterT = setTimeout(function () { root.classList.remove('is-enter', 'is-leave', 'is-swap'); }, 1800);
    arm();
  }
  /* switch with no transition (the slide itself is fading in) */
  function jump(i) {
    at = i; warm(at); warm((at + 1) % n);
    // measured in the next frame: the slide is changing now, and a read here would force a layout of the whole hero
    cancelAnimationFrame(jump._r); jump._r = requestAnimationFrame(function () { setTimeout(origin, 0); });   // after that frame's layout: a read in rAF forced it
    [bgs, panels, casts].forEach(function (list) { list.forEach(function (el, k) { el.classList.toggle('is-on', k === at); el.classList.remove('is-out'); }); });
    panels.forEach(function (p, k) { p.setAttribute('aria-hidden', k === at ? 'false' : 'true'); [].forEach.call(p.querySelectorAll('a'), function (a) { a.tabIndex = k === at ? 0 : -1; }); });
    chans.forEach(function (c, k) { c.classList.toggle('is-on', k === at); c.setAttribute('aria-selected', k === at ? 'true' : 'false'); c.tabIndex = k === at ? 0 : -1; });
  }

  chans.forEach(function (c, k) {
    c.addEventListener('click', function () { show(k); });
    c.addEventListener('keydown', function (e) {
      var d = null; if (e.key === 'ArrowRight') d = at + 1; else if (e.key === 'ArrowLeft') d = at - 1; else if (e.key === 'Home') d = 0; else if (e.key === 'End') d = n - 1;
      if (d === null) return; e.preventDefault(); show(d); chans[at].focus();
    });
  });
  // holding: the pointer over the card, the strip or Nexi pauses the turn; the scene drifts a touch with the pointer
  var left = root.querySelector('.hxs-left');
  if (left) { left.addEventListener('pointerenter', function (e) { if (e.pointerType !== 'touch') { held = true; arm(); } });
    left.addEventListener('pointerleave', function () { held = false; arm(); }); }
  if (fine && !reduce) {
    var raf = 0, px = 0, py = 0;
    slide.addEventListener('pointermove', function (e) {
      px = e.clientX / window.innerWidth * 2 - 1; py = e.clientY / window.innerHeight * 2 - 1;
      if (!raf) raf = requestAnimationFrame(function () { raf = 0; root.style.setProperty('--px', px.toFixed(3)); root.style.setProperty('--py', py.toFixed(3)); });
    });
  }

  if (hero && hero.addEventListener) hero.addEventListener('tn:slide', function (e) { setActive(!!(e.detail && e.detail.slide === slide)); });
  document.addEventListener('visibilitychange', arm);
  jump(Math.floor(Math.random() * n));   // the page opens on a random industry too
  window.addEventListener('load', function () { setTimeout(function () { skins(); warm(at); if (!active) pickAhead(); }, 2500); });
  if (slide && slide.classList.contains('is-active')) { nextUp = at; setActive(true); }   // opening the page: the one just loaded
})();
