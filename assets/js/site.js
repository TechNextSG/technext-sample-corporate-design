/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* TechNext Website v2 — shared behaviour: one-time intro, header menus, mobile nav, Let's Talk
   panel, forms (to the Odoo CRM), scroll reveals, button ripple + magnetic hover. No dependencies. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------------- one-time intro (html.intro is set by the inline head script) ---------------- */
  (function intro() {
    var el = $('#intro');
    if (!el) return;
    if (!document.documentElement.classList.contains('intro')) { el.remove(); return; }
    document.body.style.overflow = 'hidden';
    // Plays on every fresh load and every refresh (the head script skips it only for in-site link
    // navigation and back/forward). Old "seen" flags from earlier builds are cleared so they never block it.
    try { localStorage.removeItem('tn_intro_seen'); sessionStorage.removeItem('tn_intro_seen'); } catch (_) {}
    try { document.cookie = 'tn_intro_seen=; max-age=0; path=/'; document.cookie = 'tn_intro_s=; max-age=0; path=/'; } catch (_) {}
    if (/[?&]intro=1(&|$)/.test(location.search) && history.replaceState) {
      var clean = location.search.replace(/([?&])intro=1(&|$)/, function (m, a, b) { return b === '&' ? a : ''; });
      history.replaceState(null, '', location.pathname + clean + location.hash);
    }
    // ~4 s, the beats are in site.css: flight 0.15–1.45 s (FLY_AT, FLY_MS, FLY_EASE: the plane and its trail),
    // finish() at 3.35 s, then a 0.7 s iris. Every beat is clocked from the real start, which fires on the next
    // frame or after 120 ms at the latest (requestAnimationFrame can stall in a throttled tab).
    var FLY_AT = 150, FLY_MS = 1300, FLY_EASE = 'cubic-bezier(.5,0,.25,1)', END_AT = 3350, IRIS_MS = 700;
    // 3.15 s: the pills have settled, and all that still moves (the plane's bob, the rays, the progress bar) runs on the
    // compositor, so a long main-thread task here drops no visible frame. tn:intro-quiet lets a heavy start-up (Nexi)
    // run in this beat and hold it until done (HOLD_MAX at most) rather than land on the iris or the hero after it.
    var QUIET_AT = 3150, HOLD_MAX = 400, holds = 0, ending = false;
    var NOSE = -30;                                              // the logo plane points 30° above the horizontal
    var lockup = $('.intro-lockup', el), stage = $('.intro-stage', el), ring = $('.intro-ring', el);
    var wrap = $('.intro-plane-wrap', el), plane = $('.intro-plane', el), sub = $('.intro-sub', el);
    var trails = $$('.intro-trail path', el), pills = $$('.intro-pill', el);
    var done = false, started = false, timers = [], anims = [], lastW = window.innerWidth, L = 0, flightKF = null, pillKF = [];
    // The plane's flight and the apps' bursts are transform keyframes sampled along their curves, not offset-path:
    // transforms run on the compositor, so the page starting up underneath (its scripts, fonts, layout, the tag
    // manager) cannot stutter them. bez() is a CSS cubic-bezier as a function of time, so the motion is unchanged.
    function bez(x1, y1, x2, y2) {
      var B = function (a, b, t) { return 3 * a * t * (1 - t) * (1 - t) + 3 * b * t * t * (1 - t) + t * t * t; };
      return function (x) {
        if (x <= 0) return 0; if (x >= 1) return 1;
        var lo = 0, hi = 1, t = x;
        for (var i = 0; i < 22; i++) { t = (lo + hi) / 2; if (B(x1, x2, t) < x) lo = t; else hi = t; }
        return B(y1, y2, t);
      };
    }
    var flyEase = bez(.5, 0, .25, 1), pillEase = bez(.2, .75, .25, 1);
    if (document.documentElement.classList.contains('intro-nxe') && el.dataset.taglineNxe) {
      // the page opens on Nexi Explains: the tagline is Nexi's speech bubble, like the header's Nexi Explains button
      sub.innerHTML = '<span class="nb-face" aria-hidden="true"><i></i></span><span></span><b class="intro-new">NEW!</b>';
      sub.children[1].textContent = el.dataset.taglineNxe;
    } else sub.textContent = el.dataset.tagline || '';

    /* (f) exit, the iris: the whole overlay gets a round hole that grows from the middle of the logo to the farthest
       corner, so the page shows through it and never through a half-faded logo. The hole is the viewport minus a
       circle as one even-odd polygon; both ends have the same points, so the browser interpolates it. The ring
       rides its edge (same curve and duration) while the lock-up rushes forward into it (CSS). */
    function hole(x, y, r, W, H) {
      var p = ['0 0', W + 'px 0', W + 'px ' + H + 'px', '0 ' + H + 'px', '0 0'];
      for (var i = 0; i <= 48; i++) p.push((x + r * Math.cos(i / 24 * Math.PI)).toFixed(1) + 'px ' + (y + r * Math.sin(i / 24 * Math.PI)).toFixed(1) + 'px');
      return 'polygon(evenodd,' + p.join(',') + ',0 0)';
    }
    function finish() {
      if (done) return; done = true;
      timers.forEach(clearTimeout);
      var s = stage.getBoundingClientRect(), W = window.innerWidth, H = window.innerHeight;
      var x = s.left + s.width / 2, y = s.top + s.height / 2;
      var R = Math.ceil(Math.sqrt(Math.pow(Math.max(x, W - x), 2) + Math.pow(Math.max(y, H - y), 2))) + 4;
      lockup.style.transformOrigin = '50% ' + (y - lockup.getBoundingClientRect().top).toFixed(1) + 'px';
      el.classList.add('is-out');
      if (el.animate) {
        var o = { duration: IRIS_MS, easing: 'cubic-bezier(.6,0,.2,1)', fill: 'forwards' };
        el.animate([{ clipPath: hole(x, y, 0, W, H) }, { clipPath: hole(x, y, R, W, H) }], o);
        ring.style.cssText = 'left:' + (x - R) + 'px;top:' + (y - R) + 'px;width:' + 2 * R + 'px;height:' + 2 * R + 'px';
        ring.animate([{ opacity: 1, transform: 'scale(0)' }, { opacity: 0.9, offset: 0.6 }, { opacity: 0, transform: 'scale(1)' }], o);
      }
      document.documentElement.classList.remove('intro');
      document.body.style.overflow = '';
      // the hero, its scenes and Nexi start on the next frame, after the iris's first one (a timer covers a tab
      // where frames are paused)
      var told = false, tell = function () { if (told) return; told = true; document.dispatchEvent(new CustomEvent('tn:intro-done')); };
      requestAnimationFrame(tell); setTimeout(tell, 120);
      setTimeout(function () { el.remove(); }, IRIS_MS + 60);
    }

    // Centre the lock-up once, in pixels: a later viewport-height change (mobile URL bar) then leaves it
    // exactly where the flight path expects it.
    function place() {
      lockup.style.top = '50%'; lockup.style.transform = 'translate(-50%,-50%)';
      var lh = lockup.offsetHeight, H = window.innerHeight;
      lockup.style.top = Math.max(8, Math.round((H - lh) / 2)) + 'px'; lockup.style.transform = 'translateX(-50%)';
    }

    /* (b) the flight: one clockwise loop round the lock-up, spiralling in from the upper left, over the top, round
       the right, back underneath and up into the plane's slot, which sits 15° past the loop's leftmost point (so the
       plane climbs into it). Built in viewport pixels from the stage's box and kept inside the viewport minus the
       plane's own reach, so it never leaves the screen, even at 320 px wide; sampled, joined as a Catmull-Rom
       spline, drawn as the SVG trail and sampled into the plane's keyframes (60 steps, eased in time as
       FLY_EASE). The plane flies nose first (the path's heading + 30°); --flare turns it from its heading into the
       slot to the logo's attitude. */
    function buildPath() {
      anims.forEach(function (a) { a.cancel(); }); anims = [];   // measure the slot, not a point of an old flight
      var r = wrap.getBoundingClientRect(), s = stage.getBoundingClientRect(), W = window.innerWidth, H = window.innerHeight;
      var cx = r.left + r.width / 2, cy = r.top + r.height / 2, m = Math.sqrt(r.width * r.width + r.height * r.height) / 2 + 6;
      var D = 0.26, rx = (Math.min(W - m, s.right + Math.min(110, s.width * 0.16)) - cx) / (1 + Math.cos(D));
      var ry = Math.min(s.width * 0.3 + s.height / 2, (cy - m) / (1 - Math.sin(D)), (H - m - cy) / (1 + Math.sin(D)));
      var ex = cx + rx * Math.cos(D), ey = cy + ry * Math.sin(D), a0 = -2.3, a1 = Math.PI + D, n = 16, q = [];
      var fit = function (x, y) { return [Math.max(m, Math.min(W - m, x)), Math.max(m, Math.min(H - m, y))]; };
      for (var i = -1; i <= n + 1; i++) {                        // one extra sample past each end sets the end tangents
        var u = i / n, a = a0 + (a1 - a0) * u, f = 1 + 0.22 * Math.pow(Math.max(0, 1 - u / 0.45), 2);
        q.push(i === n ? [cx, cy] : fit(ex + rx * f * Math.cos(a), ey + ry * f * Math.sin(a)));
      }
      var P = function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); };
      var d = 'M' + P(q[1]);
      for (var j = 1; j <= n; j++) {
        d += ' C' + P(fit(q[j][0] + (q[j + 1][0] - q[j - 1][0]) / 6, q[j][1] + (q[j + 1][1] - q[j - 1][1]) / 6)) +
          ' ' + P(fit(q[j + 1][0] - (q[j + 2][0] - q[j][0]) / 6, q[j + 1][1] - (q[j + 2][1] - q[j][1]) / 6)) + ' ' + P(q[j + 1]);
      }
      var end = Math.atan2(q[n + 2][1] - q[n][1], q[n + 2][0] - q[n][0]) * 180 / Math.PI;   // heading into the slot
      trails.forEach(function (t) { t.setAttribute('d', d); });
      var path = trails[0], tot = path.getTotalLength(), kf = [], prev = null;
      for (var k = 0; k <= 60; k++) {
        var t = k / 60, at = flyEase(t) * tot, p = path.getPointAtLength(at);
        var p0 = path.getPointAtLength(Math.max(0, at - 1)), p1 = path.getPointAtLength(Math.min(tot, at + 1));
        var hd = Math.atan2(p1.y - p0.y, p1.x - p0.x) * 180 / Math.PI;
        if (prev !== null) hd = prev + ((hd - prev + 540) % 360 - 180);   // no 360° flips between samples
        prev = hd;
        kf.push({ offset: t, opacity: Math.min(1, t / 0.08),
          transform: 'translate(' + (p.x - cx).toFixed(1) + 'px,' + (p.y - cy).toFixed(1) + 'px) rotate(' + (hd - NOSE).toFixed(1) + 'deg)' });
      }
      flightKF = kf;
      el.style.setProperty('--pw', r.width.toFixed(1) + 'px');        // the plane's size: spark reach, trail weight
      plane.style.setProperty('--flare', (NOSE - end).toFixed(1) + 'deg');
      return trails[0].getTotalLength();
    }
    // the comet trail: three dashes of falling length share one head that rides with the plane, then their tails
    // catch up and vanish into the landed plane
    function trail() {
      var tot = FLY_MS + 320;
      trails.forEach(function (t, k) {
        var s = L * [0.34, 0.2, 0.09][k];
        t.style.strokeDasharray = s.toFixed(1) + 'px ' + (L + s + 10).toFixed(1) + 'px';
        t.style.strokeDashoffset = s.toFixed(1) + 'px';          // hidden before the path's start
        if (t.animate) anims.push(t.animate([
          { strokeDashoffset: s + 'px', easing: FLY_EASE },
          { strokeDashoffset: (s - L) + 'px', offset: FLY_MS / tot, easing: 'cubic-bezier(.3,.6,.35,1)' },
          { strokeDashoffset: -L + 'px' }], { duration: tot, delay: FLY_AT, fill: 'both' }));
      });
    }

    /* (e) each app's burst: from the middle of the logo (behind it) out and down into its place, the outer pills
       bowed outward: a quadratic curve in the pill's own box, sampled with its scale (.35, 1.07 at 72 %, 1), its
       turn (16° to 0) and its fade (in by 28 %), each eased over its own stretch as the CSS keyframes were. The
       order rotate · scale · translate is the one the individual properties and offset-path had. */
    function pillPaths() {
      var s = stage.getBoundingClientRect(), ox = s.left + s.width / 2, oy = s.top + s.height / 2;
      pillKF = pills.map(function (p, i) {
        var b = p.getBoundingClientRect(), w = p.offsetWidth, h = p.offsetHeight, side = i - (pills.length - 1) / 2;
        var sx = ox - (b.left + b.width / 2 - w / 2), sy = oy - (b.top + b.height / 2 - h / 2);   // the unscaled box
        var qx = w / 2 + side * Math.max(36, s.width * 0.2), qy = sy + (h / 2 - sy) * 0.2, kf = [];
        // the curve by length, as offset-distance moved along it: a table of the length at 200 steps, then inverted
        var Q = function (v) { var m = 1 - v; return [m * m * sx + 2 * m * v * qx + v * v * w / 2, m * m * sy + 2 * m * v * qy + v * v * h / 2]; };
        var len = [0], last = Q(0), j;
        for (j = 1; j <= 200; j++) { var c = Q(j / 200); len.push(len[j - 1] + Math.hypot(c[0] - last[0], c[1] - last[1])); last = c; }
        var at = function (f) { var d = f * len[200], lo = 0; while (lo < 199 && len[lo + 1] < d) lo++; var g = len[lo + 1] - len[lo]; return Q((lo + (g ? (d - len[lo]) / g : 0)) / 200); };
        for (var k = 0; k <= 30; k++) {
          var t = k / 30, e = pillEase(t), pt = at(e);
          var x = pt[0] - w / 2, y = pt[1] - h / 2;
          var sc = t < 0.72 ? 0.35 + 0.72 * pillEase(t / 0.72) : 1.07 - 0.07 * pillEase((t - 0.72) / 0.28);
          kf.push({ offset: t, opacity: t < 0.28 ? pillEase(t / 0.28) : 1,
            transform: 'rotate(' + (side * 16 * (1 - e)).toFixed(2) + 'deg) scale(' + sc.toFixed(3) + ') translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)' });
        }
        return kf;
      });
    }

    function start() {
      if (started || done) return; started = true;
      el.classList.add('is-go');
      trail();
      if (wrap.animate && flightKF) anims.push(wrap.animate(flightKF, { duration: FLY_MS, delay: FLY_AT, fill: 'both' }));
      else wrap.style.opacity = 1;
      pills.forEach(function (p, i) {
        if (p.animate && pillKF[i]) anims.push(p.animate(pillKF[i], { duration: 750, delay: 2200 + i * 80, fill: 'both' }));
        else p.style.opacity = 1;
      });
      timers.push(setTimeout(function () { wrap.style.willChange = 'auto'; }, FLY_AT + FLY_MS + 60));   // landed
      timers.push(setTimeout(quiet, QUIET_AT));
      timers.push(setTimeout(end, END_AT));
    }
    function quiet() {
      document.dispatchEvent(new CustomEvent('tn:intro-quiet', { detail: { hold: function () {
        var freed = false; holds++;
        return function () { if (freed) return; freed = true; holds--; if (!holds && ending) finish(); };
      } } }));
    }
    function end() { ending = true; if (!holds) finish(); else timers.push(setTimeout(finish, HOLD_MAX)); }
    place(); L = buildPath(); pillPaths();
    // the flight starts once the page's other deferred scripts have run (DOMContentLoaded), so their start-up never
    // lands on it (the sheet's bloom and grid already play from the first paint); 900 ms at the latest
    document.addEventListener('DOMContentLoaded', function () { requestAnimationFrame(start); timers.push(setTimeout(start, 120)); }, { once: true });
    timers.push(setTimeout(start, 900));
    function restart() {
      timers.forEach(clearTimeout); timers = [];
      anims.forEach(function (a) { a.cancel(); }); anims = [];
      el.classList.remove('is-go'); started = false; ending = false; wrap.style.willChange = '';
      void el.offsetWidth;                       // reflow so every CSS animation restarts from frame 0
      place(); L = buildPath(); pillPaths(); start();
    }
    window.addEventListener('resize', function () {
      var W = window.innerWidth;
      if (!started) { place(); L = buildPath(); pillPaths(); lastW = W; return; }
      // Rotation or a real resize re-runs the sequence on the new layout. Height-only changes (mobile URL
      // bar) are ignored: the lock-up is pinned in pixels, so nothing moves under the plane.
      if (Math.abs(W - lastW) > 100 && !done) { lastW = W; restart(); }
    });
    el.addEventListener('click', finish); // let impatient visitors skip (the Skip button is inside)
    // Escape, Enter or Tab ends it (Tab: keyboard focus would otherwise move behind the overlay)
    document.addEventListener('keydown', function onKey(e) { if (e.key === 'Escape' || e.key === 'Enter' || e.key === 'Tab') { finish(); document.removeEventListener('keydown', onKey); } });
  })();

  /* ---------------- page-chrome state classes, mirrored onto the chrome itself ----------------
     The home hero dresses the header, side tabs and WhatsApp button for its full-bleed slides (html.nxs-dark,
     nxs-swap, hxs-on, hxs-top). The rules for them used to hang off <html>, so every switch restyled every icon,
     button and image on the page (~1,300-1,500 elements on a slide change). The rules now hang off these hosts
     (hero.css / site.css), and this keeps the hosts' c-<name> classes in step with <html>'s. The host classes need their own names: an invalidation
     set belongs to a class NAME, so the same name on <html> would still restyle the whole page. */
  (function chromeState() {
    var de = document.documentElement, K = ['nxs-dark', 'nxs-swap', 'hxs-on', 'hxs-top'];
    var hosts = [].slice.call(document.querySelectorAll('.header,.side-tabs,.wa-float'));
    if (!hosts.length || !window.MutationObserver) return;
    function sync() {
      K.forEach(function (k) { var on = de.classList.contains(k); hosts.forEach(function (h) { if (h.classList.contains('c-' + k) !== on) h.classList.toggle('c-' + k, on); }); });
    }
    sync();
    new MutationObserver(sync).observe(de, { attributes: true, attributeFilter: ['class'] });
  })();

  /* ---------------- header: scrolled state + click-to-open mega menus ---------------- */
  var header = $('[data-header]');
  var megas = $$('.has-mega');

  if ('IntersectionObserver' in window) {
    var mark = document.createElement('div');
    mark.setAttribute('aria-hidden', 'true');
    mark.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:5px;pointer-events:none';
    document.body.prepend(mark);
    new IntersectionObserver(function (es) { header.classList.toggle('is-scrolled', !es[es.length - 1].isIntersecting); }).observe(mark);
  } else {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 4); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function closeMegas(except) {
    megas.forEach(function (li) {
      if (li === except) return;
      li.classList.remove('is-open');
      $('.nav-link', li).setAttribute('aria-expanded', 'false');
    });
    header.classList.toggle('is-open', !!except);
  }
  megas.forEach(function (li) {
    var btn = $('.nav-link', li);
    btn.addEventListener('click', function () {
      var open = li.classList.contains('is-open');
      closeMegas(open ? null : li);
      li.classList.toggle('is-open', !open);
      btn.setAttribute('aria-expanded', String(!open));
    });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.has-mega')) closeMegas(null);
  });

  /* ---------------- mobile nav ---------------- */
  var mnav = $('#mnav'), mOverlay = $('.mnav-overlay'), mBtn = $('[data-mnav-open]');
  function openMnav() {
    mnav.hidden = false; mOverlay.hidden = false;
    mBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    var first = $('[data-mnav-close]', mnav); if (first) first.focus();
  }
  function closeMnav() {
    if (mnav.hidden) return;
    mnav.hidden = true; mOverlay.hidden = true;
    mBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  mBtn.addEventListener('click', openMnav);
  $$('[data-mnav-close]').forEach(function (el) { el.addEventListener('click', closeMnav); });
  // Tapping a link or an action button inside the drawer closes it (in-page anchors included).
  mnav.addEventListener('click', function (e) { if (e.target.closest('a')) closeMnav(); });
  window.tnCloseMnav = closeMnav;

  /* ---------------- Let's Talk panel ---------------- */
  var panel = $('#talk-panel'), tOverlay = $('.talk-overlay');
  var lastFocus = null;
  function openTalk() {
    lastFocus = document.activeElement;
    closeMnav();
    // exit animation on the tab: the plane flies off, then both tabs slide out behind the panel
    var tab = $('.talk-tab');
    if (tab) { tab.classList.add('is-exiting'); setTimeout(function () { tab.classList.remove('is-exiting'); }, 700); }
    document.body.classList.add('talk-open');
    panel.hidden = false; tOverlay.hidden = false;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(function () {
      panel.classList.add('is-open'); tOverlay.classList.add('is-open');
      var f = $('#tf-name'); if (f && fine) f.focus({ preventScroll: true });
    });
  }
  function closeTalk() {
    if (panel.hidden) return;
    panel.classList.remove('is-open'); tOverlay.classList.remove('is-open');
    document.body.classList.remove('talk-open');
    document.body.style.overflow = '';
    var done = function () { panel.hidden = true; tOverlay.hidden = true; panel.removeEventListener('transitionend', done); };
    if (reduce) done(); else { panel.addEventListener('transitionend', done); setTimeout(done, 400); }
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  window.tnOpenTalk = openTalk;
  /* /nexi: Full screen. The stage covers the window at once (body.nx-max), then asks for real full screen on
     top. Some browsers (in-app browsers, embedded webviews) never answer that request, so the cover mode
     must not wait for it. */
  var nxStage = $('[data-nx-stage]'), nxBtn = $('[data-nx-full]');
  if (nxStage && nxBtn) {
    var fsEl = function () { return document.fullscreenElement || document.webkitFullscreenElement; };
    var nxOn = function () { return document.body.classList.contains('nx-max'); };
    var nxSet = function (on) {
      document.body.classList.toggle('nx-max', on);
      nxBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
      nxBtn.setAttribute('aria-label', on ? 'Exit full screen' : 'Full screen');
    };
    /* Opened from another page of the site (Ask Nexi, Chat with me -> /nexi#full): leaving full screen goes back
       to that page, where the visitor was. Opened on /nexi itself, leaving just shows the normal /nexi page. */
    var nxFrom = '';
    if (document.documentElement.classList.contains('nx-full-start')) {
      try { var ref = new URL(document.referrer); if (ref.origin === location.origin && ref.pathname !== location.pathname) nxFrom = ref.href; } catch (e) { /* typed in or from another site */ }
    }
    /* /nexi#full is Nexi only (html.nx-solo): leaving goes back to where the visitor came from, or home,
       never to the /nexi page around the stage */
    var nxSolo = function () { return document.documentElement.classList.contains('nx-solo'); };
    var nxLeave = function () {
      if (fsEl()) { try { var y = (document.exitFullscreen || document.webkitExitFullscreen).call(document); if (y && y.catch) y.catch(function () {}); } catch (e) { /* already out */ } }
      if (nxFrom && history.length > 1) { history.back(); return; }
      location.href = nxFrom || (document.querySelector('.header .logo, a.logo') || { href: '/' }).href || '/';
    };
    var nxExit = function (back) {
      if (nxSolo() && back !== false) { nxLeave(); return; }
      if (fsEl()) { try { var x = (document.exitFullscreen || document.webkitExitFullscreen).call(document); if (x && x.catch) x.catch(function () {}); } catch (e) { /* already out */ } }
      if (back !== false && nxFrom) {
        var to = nxFrom; nxFrom = '';
        /* history.back() restores the page as it was (scroll position included); a new tab has no history */
        if (history.length > 1) history.back(); else location.href = to;
        return;
      }
      nxFrom = '';
      nxSet(false);
      /* drop #full so a reload shows the normal page */
      if (location.hash === '#full' && history.replaceState) history.replaceState(null, '', location.pathname + location.search);
    };
    nxBtn.setAttribute('aria-label', 'Full screen');
    /* "Ask Nexi" and "Chat with me" link to /nexi#full: open straight into full-window mode */
    if (document.documentElement.classList.contains('nx-full-start')) { nxSet(true); document.documentElement.classList.remove('nx-full-start'); }
    nxBtn.addEventListener('click', function () {
      if (nxOn()) { nxExit(); return; }
      nxSet(true);
      var req = nxStage.requestFullscreen || nxStage.webkitRequestFullscreen;
      if (req) { try { var pr = req.call(nxStage); if (pr && pr.catch) pr.catch(function () {}); } catch (e) { /* the cover mode stays */ } }
    });
    /* leaving real full screen with the browser's own Esc also ends the cover mode */
    var nxFs = function () { if (!fsEl() && nxOn() && !nxSolo()) nxSet(false); };
    document.addEventListener('fullscreenchange', nxFs);
    document.addEventListener('webkitfullscreenchange', nxFs);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nxOn() && !nxSolo()) nxExit(); });
    /* a link to #full while already on /nexi */
    window.addEventListener('hashchange', function () { if (location.hash === '#full' && !nxSolo()) { document.documentElement.classList.add('nx-solo'); nxSet(true); } });
    window.tnNexiFs = function () {
      if (fsEl()) { try { (document.exitFullscreen || document.webkitExitFullscreen).call(document); } catch (e) { /* ignore */ } return; }
      var rq = nxStage.requestFullscreen || nxStage.webkitRequestFullscreen;
      if (rq) { try { var pr2 = rq.call(nxStage); if (pr2 && pr2.catch) pr2.catch(function () {}); } catch (e) { /* cover mode stays */ } }
    };
    window.tnNexiLeave = function () { if (nxSolo()) nxLeave(); else nxExit(); };
    window.tnNexiFull = nxExit;
    window.addEventListener('pageshow', function (e) { if (e.persisted && nxOn() && !nxFrom) { nxSet(false); if (location.hash === '#full' && history.replaceState) history.replaceState(null, '', location.pathname + location.search); } });
  }
  /* Nexi on /nexi runs in a same-origin frame and asks for the Let's Talk form from there */
  window.addEventListener('message', function (e) {
    if (e.origin !== location.origin || !e.data) return;
    if (e.data.tn === 'nexi-talk') { if (document.body.classList.contains('nx-max') && window.tnNexiFull && !document.documentElement.classList.contains('nx-solo')) window.tnNexiFull(false); openTalk(); }
    if (e.data.tn === 'nexi-fs' && window.tnNexiFs) window.tnNexiFs();
    if (e.data.tn === 'nexi-leave' && window.tnNexiLeave) window.tnNexiLeave();
    if (e.data.tn === 'nexi-esc' && document.body.classList.contains('nx-max') && nxBtn && !document.documentElement.classList.contains('nx-solo')) nxBtn.click();
  });
  $$('[data-talk-open]').forEach(function (el) { el.addEventListener('click', function (e) { e.preventDefault(); openTalk(); }); });
  $$('[data-talk-close]').forEach(function (el) { el.addEventListener('click', closeTalk); });
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href$="#talk"]');
    if (a) { e.preventDefault(); openTalk(); }
  });
  if (location.hash === '#talk') setTimeout(openTalk, 300);

  panel.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var f = $$('button, [href], input, select, textarea', panel).filter(function (el) { return !el.disabled && el.offsetParent !== null; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeMegas(null); closeTalk(); closeMnav(); }
  });

  /* ---------------- forms → /api/lead (Odoo CRM) ---------------- */
  function serialize(form) {
    var data = {};
    new FormData(form).forEach(function (v, k) {
      if (k === '_honey') return;
      data[k] = data[k] ? data[k] + ', ' + v : v;
    });
    return data;
  }
  /* where the visit started (kept for the session) - goes into the CRM lead with the page and referrer */
  try {
    if (!sessionStorage.getItem('tn_landing')) {
      sessionStorage.setItem('tn_landing', location.href.slice(0, 300));
      sessionStorage.setItem('tn_referrer', (document.referrer || '').slice(0, 300));
    }
  } catch (e) { /* storage blocked: the lead just lacks these lines */ }
  /* Every submission becomes a lead in the Odoo CRM through /api/lead (api/lead.py: salesperson Jeric,
     source, department, tags, Jeric @mentioned). Page, first page of the visit and referrer go along. */
  window.tnPostForm = function (endpoint, payload) {
    var p = {};
    Object.keys(payload || {}).forEach(function (k) { p[k] = payload[k]; });
    p.page = location.href.slice(0, 300);
    try {
      var land = sessionStorage.getItem('tn_landing'), ref = sessionStorage.getItem('tn_referrer');
      if (land && land !== p.page) p.landing = land;
      if (ref) p.referrer = ref;
    } catch (e) {}
    return fetch(endpoint || '/api/lead', {
      method: 'POST', keepalive: true,
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(p)
    }).then(function (r) { return r.json().then(function (j) { return { ok: r.ok && j.ok, j: j }; }, function () { return { ok: false, j: {} }; }); },
            function () { return { ok: false, j: {} }; })
      .then(function (res) {
        if (!res.ok) throw new Error('Sorry, your message could not be sent just now.');
        // Lead conversions fire only on a submission the CRM accepted.
        try {
          if (typeof window.gtag === 'function') {
            window.gtag('event', 'conversion', { send_to: 'AW-18068724830/dBpuCLul3bQcEN6466dD' });
            window.gtag('event', 'generate_lead', { form: payload && payload.source ? String(payload.source).slice(0, 60) : 'website' });
          }
        } catch (e) { /* analytics must never break a submission */ }
        return res.j;
      });
  };
  $$('form[data-endpoint]').forEach(function (form) {
    var status = $('.form-status', form);
    var btn = $('button[type=submit]', form);
    if (!$('.form-sent', form)) {
      var sent = document.createElement('div');
      sent.className = 'form-sent';
      sent.innerHTML = '<h3>Thanks — we have it.</h3><p>Your message is with our team. We reply from sales@technext.asia.</p>';
      form.appendChild(sent);
    }
    // time trap: a person needs a few seconds between first touching the form and sending it;
    // scripts post instantly (or never focus a field). They see the normal thank-you, nothing is sent.
    var startedAt = 0;
    form.addEventListener('focusin', function () { if (!startedAt) startedAt = Date.now(); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if ($('input[name=_honey]', form) && $('input[name=_honey]', form).value) return;
      if (!form.checkValidity()) { form.reportValidity(); return; }
      if (!startedAt || Date.now() - startedAt < 3000) { form.classList.add('is-sent'); return; }
      if (form.dataset.beforeSend) { try { window[form.dataset.beforeSend](form); } catch (_) {} }
      var payload = serialize(form);
      btn.classList.add('is-busy'); btn.disabled = true;
      status.className = 'form-status'; status.textContent = 'Sending…';
      window.tnPostForm(form.dataset.endpoint, payload)
        .then(function () {
          form.classList.add('is-sent');
          status.className = 'form-status is-ok'; status.textContent = '';
        })
        .catch(function (err) {
          status.className = 'form-status is-err';
          status.textContent = (err && err.message ? err.message + ' ' : '') + 'You can also email us directly at ';
          var mail = document.createElement('a'); mail.href = 'mailto:sales@technext.asia'; mail.textContent = 'sales@technext.asia';
          status.appendChild(mail); status.appendChild(document.createTextNode('.'));
        })
        .finally(function () { btn.classList.remove('is-busy'); btn.disabled = false; });
    });
  });

  /* ---------------- YouTube facades: load the player only on click ---------------- */
  document.addEventListener('click', function (e) {
    var f = e.target.closest('[data-yt]');
    if (!f || f.classList.contains('is-playing')) return;
    var id = f.getAttribute('data-yt'), title = f.getAttribute('aria-label') || 'Video';
    f.classList.add('is-playing');
    if (!/^[A-Za-z0-9_-]{6,20}$/.test(id)) { f.classList.remove('is-playing'); return; }
    var fr = document.createElement('iframe');
    fr.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0&modestbranding=1';
    fr.title = title;
    fr.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture');
    fr.setAttribute('allowfullscreen', '');
    f.textContent = ''; f.appendChild(fr);
  });

  /* ---------------- scroll reveals ---------------- */
  var reveals = $$('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    // A section that scrolls in switches its reveals on over a few frames, six at a time, instead of
    // restyling every card in one frame (the reveals stagger with their own delays anyway).
    var rq = [], rqRaf = 0;
    var rqFlush = function () {
      rqRaf = 0;
      for (var n = 0; rq.length && n < 6; n++) rq.shift().classList.add('is-in');
      if (rq.length) rqRaf = requestAnimationFrame(rqFlush);
    };
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { rq.push(en.target); io.unobserve(en.target); }
      });
      if (rq.length && !rqRaf) rqRaf = requestAnimationFrame(rqFlush);
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------------- buttons: ripple on press, magnetic pull on hover ---------------- */
  document.addEventListener('pointerdown', function (e) {
    var btn = e.target.closest('.btn');
    if (!btn || reduce) return;
    var r = btn.getBoundingClientRect();
    var d = Math.max(r.width, r.height) * 1.6;
    var s = document.createElement('span');
    s.className = 'ripple';
    s.style.cssText = 'width:' + d + 'px;height:' + d + 'px;left:' + (e.clientX - r.left - d / 2) + 'px;top:' + (e.clientY - r.top - d / 2) + 'px';
    btn.appendChild(s);
    setTimeout(function () { s.remove(); }, 650);
  });
  if (fine && !reduce) {
    // magnetic pull on large buttons only (never on the fixed side tabs — a moving fixed target flickers)
    $$('.btn-lg').forEach(function (btn) {
      var raf = null;
      btn.addEventListener('pointermove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) / r.width, y = (e.clientY - r.top - r.height / 2) / r.height;
        if (raf) return;
        raf = requestAnimationFrame(function () {
          raf = null;
          btn.style.transform = 'translate(' + (x * 6).toFixed(1) + 'px,' + (y * 4 - 2).toFixed(1) + 'px)';
        });
      });
      btn.addEventListener('pointerleave', function () { btn.style.transform = ''; });
    });
  }
})();

/* ---------------- "Set up meeting" (Odoo Appointments): a GA4 event, not an Ads conversion ----------------
   A click opens the booking page; the meeting itself is booked in Odoo. */
document.addEventListener('click', function (e) {
  var a = e.target.closest && e.target.closest('[data-meet]');
  if (a && typeof window.gtag === 'function') window.gtag('event', 'book_meeting_click', { link: 'odoo_appointment' });
});

/* ---------------- image fallbacks (replaces the generated inline onerror= handlers) ----------------
   `error` does not bubble, so listen in the capture phase. Images that failed before this
   script ran (eager ones above the fold) are swept on DOMContentLoaded. */
(function () {
  'use strict';
  function fallback(img) {
    var f = img.getAttribute('data-onerror');
    if (!f) return;
    img.removeAttribute('data-onerror');
    if (f === 'remove') { img.remove(); return; }
    if (f === 'feat') { var w = img.closest('.feat'); if (w) w.classList.add('feat--noimg'); return; }
    if (f.indexOf('closest:') === 0) { var t = img.closest(f.slice(8)); if (t) t.remove(); }
  }
  document.addEventListener('error', function (e) {
    if (e.target && e.target.tagName === 'IMG') fallback(e.target);
  }, true);
  function sweep() {
    Array.prototype.slice.call(document.querySelectorAll('img[data-onerror]')).forEach(function (img) {
      if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) fallback(img);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', sweep); else sweep();
})();

/* © TechNext Pte. Ltd. (technext.asia). Overlay scrollbar (mouse/trackpad screens): the browser's bar is hidden
   (site.css html.tn-sb-on) so dark heroes run to the window edge; this thin thumb shows while the page scrolls or the
   pointer nears the right edge, and can be dragged. Keyboard, wheel and touch scrolling are untouched. */
(function () {
  'use strict';
  if (!window.matchMedia || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  var root = document.documentElement, bar = document.createElement('div'), th = document.createElement('i');
  bar.className = 'tn-sb'; bar.setAttribute('aria-hidden', 'true'); bar.appendChild(th);
  document.body.appendChild(bar);
  root.classList.add('tn-sb-on');
  var hideT = 0, raf = 0, drag = null;
  function metrics() {
    var vh = window.innerHeight, dh = Math.max(root.scrollHeight, document.body.scrollHeight, vh);
    var h = Math.max(36, vh * vh / dh), top = (vh - h) * (window.scrollY / Math.max(1, dh - vh));
    return { vh: vh, dh: dh, h: h, top: top };
  }
  function paint() {
    raf = 0;
    var m = metrics();
    bar.hidden = m.dh <= m.vh + 1;
    th.style.height = Math.round(m.h) + 'px';
    th.style.transform = 'translateY(' + m.top.toFixed(1) + 'px)';
  }
  function req() { if (!raf) raf = requestAnimationFrame(paint); }
  function show() {
    bar.classList.add('is-on'); clearTimeout(hideT);
    hideT = setTimeout(function () { if (!drag) bar.classList.remove('is-on'); }, 1300);
  }
  window.addEventListener('scroll', function () { req(); show(); }, { passive: true });
  window.addEventListener('resize', req);
  if ('ResizeObserver' in window) new ResizeObserver(req).observe(document.body);
  window.addEventListener('mousemove', function (e) { if (e.clientX > window.innerWidth - 20) show(); }, { passive: true });
  th.addEventListener('pointerdown', function (e) {
    e.preventDefault();
    var m = metrics();
    drag = { y: e.clientY, s: window.scrollY, k: (m.dh - m.vh) / Math.max(1, m.vh - m.h) };
    try { th.setPointerCapture(e.pointerId); } catch (err) {}
    bar.classList.add('is-drag', 'is-on');
  });
  th.addEventListener('pointermove', function (e) {
    if (!drag) return;
    window.scrollTo({ top: drag.s + (e.clientY - drag.y) * drag.k, behavior: 'instant' });
  });
  function end() { if (!drag) return; drag = null; bar.classList.remove('is-drag'); show(); }
  th.addEventListener('pointerup', end);
  th.addEventListener('pointercancel', end);
  paint();
})();

/* phones: the floating Meet / Talk / Nexi buttons wait until the visitor scrolls past the first screen, so they never
   sit on top of the page's own first buttons */
(function () {
  var b = document.body; if (!b || !document.querySelector('.side-tabs')) return;
  var raf = 0;
  function upd() { raf = 0; b.classList.toggle('tabs-wait', window.scrollY < window.innerHeight * 0.55); }
  upd(); window.addEventListener('scroll', function () { if (!raf) raf = requestAnimationFrame(upd); }, { passive: true });
  window.addEventListener('resize', upd);
})();
/* tablets and phones: the floating buttons fold into one round button (styles in site.css under 960px) */
(function () {
  var box = document.querySelector('.side-tabs'); if (!box) return;
  var b = document.body, fab = document.createElement('button');
  fab.type = 'button'; fab.className = 'side-fab'; fab.setAttribute('aria-expanded', 'false'); fab.setAttribute('aria-label', 'Contact options');
  fab.innerHTML = '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
  box.appendChild(fab);
  function set(on) { b.classList.toggle('tabs-open', on); fab.setAttribute('aria-expanded', on ? 'true' : 'false'); }
  fab.addEventListener('click', function (e) { e.stopPropagation(); set(!b.classList.contains('tabs-open')); });
  box.addEventListener('click', function (e) { if (e.target.closest('.side-tab')) set(false); });
  document.addEventListener('click', function (e) { if (b.classList.contains('tabs-open') && !box.contains(e.target)) set(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
})();
/* R9 sweep: build.py makes every image below the hero lazy, and a lazy image inside UI that starts hidden (tab panels,
   the homepage Odoo Street pop-ups, closed panels) only starts loading the moment it is shown, so it popped in late.
   Once the page is loaded and idle, those images are fetched (skipped when the visitor asked to save data). */
(function () {
  var c = navigator.connection; if (c && (c.saveData || /2g/.test(c.effectiveType || ''))) return;
  function warm() {
    var l = document.querySelectorAll('img[loading="lazy"]'), b = document.body;
    for (var i = 0; i < l.length; i++) {
      for (var p = l[i].parentElement; p && p !== b; p = p.parentElement) {
        if (p.hidden || getComputedStyle(p).display === 'none') { l[i].loading = 'eager'; break; }
      }
    }
  }
  function idle() { (window.requestIdleCallback || function (f) { setTimeout(f, 1200); })(warm, { timeout: 5000 }); }
  if (document.readyState === 'complete') idle(); else window.addEventListener('load', idle);
})();
