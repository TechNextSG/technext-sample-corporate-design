/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* /nexi-explains hero: a living comic book in four spreads (Series / Quick Tips / Cast / Specials).
   - The deck: four formats (Series = split cover, Quick Tips = pit lane + tip conveyor, Cast = splash page with a wide
     stage, Specials = banner + triptych). A new slide every 10 seconds, starting on a random one (picked in the head:
     html[data-nxe-first]; ?slide=N forces one, crawlers get slide 1). Chapter tabs (ARIA tabs), arrows, pause, swipe;
     named holds (pointer on the controls or a spread, keyboard focus, the intro, an off-screen hero, a hidden tab,
     the pause button). Any tap or drag gives the visitor 12 seconds on that slide.
   - The change: a comic burst slams in over the spread with the next slide's sound word, the page turns underneath,
     the burst blows apart and the new panels slam in (CSS .is-enter); the halftone sky ripples from the burst.
   - The sky: a canvas halftone field that breathes, swells around the pointer; parallax layers.
   - Each spread: Nexi reacts when tapped (new 3D poses, a sound word, the bubble); Series cycles the ON AIR reel,
     Quick Tips flips through every tip (the stopwatch riffles to a random one), Cast drops sidekicks on stage (tap one
     to meet it, shuffle the cast, tap Nexi for a new costume), Specials spotlights each holiday panel and fires confetti.
   Reduced motion: no autoplay, no burst, a still halftone, instant swaps; everything stays tappable. */
(function () {
  'use strict';
  var hero = document.querySelector('[data-nxe-hero]');
  if (!hero) return;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var rnd = function (a) { return a[Math.floor(Math.random() * a.length)]; };
  var slides = $$('[data-nxe-slide]', hero), chaps = $$('[data-nxe-to]', hero);
  var keys = slides.map(function (s) { return s.getAttribute('data-nxe-slide'); });
  var ctl = $('[data-nxe-ctl]', hero), pp = $('[data-nxe-pp]', hero), deck = $('[data-nxe-deck]', hero);
  var bam = $('[data-nxe-bam]', hero), bamWord = bam && $('[data-nxe-bam-word]', bam);
  var DUR = { series: 9140, tips: 9140, cast: 9140, specials: 9140 }, LINGER = 12000;  /* + the 0.86 s burst = a new slide every 10 s */
  var BAM = { series: ['ON AIR!', '#FFD23F'], tips: ['ZOOM!', '#FFD23F'], cast: ['TA-DA!', '#FF9DB4'], specials: ['BOO!', '#C3B4FF'] };
  var cur = 0, busy = false;

  /* ---------------- sound words ---------------- */
  function word(host, text, x, y, cls) {
    if (reduce) return;
    var w = document.createElement('span');
    w.className = 'nxe-word' + (cls ? ' ' + cls : '');
    w.setAttribute('aria-hidden', 'true');
    w.textContent = text;
    w.style.left = Math.round(x) + 'px';
    w.style.top = Math.round(y) + 'px';
    w.style.setProperty('--r', (Math.random() * 24 - 12).toFixed(1) + 'deg');
    w.style.setProperty('--x', Math.round(Math.random() * 50 - 25) + 'px');
    host.appendChild(w);
    w.addEventListener('animationend', function () { w.remove(); });
  }
  function rel(el, host) {
    var a = el.getBoundingClientRect(), b = host.getBoundingClientRect();
    return { x: a.left - b.left, y: a.top - b.top, w: a.width, h: a.height };
  }
  function restartAnim(el, cls) { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }

  /* ---------------- the halftone sky ----------------
     A grid of dots that breathe in a slow diagonal wave, denser in the bottom-left and top-right corners and quieter
     behind the copy; they swell around the pointer and in the rings a page turn sends out (shock). The dots are drawn
     by a WebGL fragment shader (the same formula per pixel, on the GPU): building ~4,000 arcs 30 times a second was the
     main thread's biggest job on this page. Without WebGL the canvas 2D version below draws the same picture. */
  var dots = (function (cv) {
    if (!cv) return { shock: function () {}, sync: function () {} };
    var W = 0, H = 0, dpr = 1, gap = 18, pts = [], waves = [], px = -999, py = -999, pa = 0, pt = 0, raf = 0, last = 0, run = false, box = null;
    var MAXW = 8, gl = null, U = {}, lost = false, g = null;
    var VS = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';
    var FS = [
      '#ifdef GL_FRAGMENT_PRECISION_HIGH', 'precision highp float;', '#else', 'precision mediump float;', '#endif',
      'uniform vec2 uRes,uP;uniform float uDpr,uGap,uT,uWide,uPa,uMax;uniform vec4 uW[' + MAXW + '];uniform int uN;',
      'void main(){',
      ' vec2 S=uRes/uDpr; vec2 p=vec2(gl_FragCoord.x,uRes.y-gl_FragCoord.y)/uDpr;',
      ' float cs=0.,ch=0.; float r0=floor(p.y/uGap);',
      ' for(int dr=-1;dr<=1;dr++){',
      '  float rw=r0+float(dr); float y=uGap*(rw+.5); if(rw<0.||y>=S.y) continue;',
      '  float xo=mod(rw,2.)>.5?uGap:uGap*.5; float c0=floor((p.x-xo)/uGap+.5);',
      '  for(int dc=-1;dc<=1;dc++){',
      '   float c=c0+float(dc); float x=xo+c*uGap; if(c<0.||x>=S.x) continue;',
      '   float d=distance(p,vec2(x,y)); if(d>uMax) continue;',
      '   float bl=max(0.,1.-length(vec2(x/S.x,1.-y/S.y))/.95), tr=max(0.,1.-length(vec2(1.-x/S.x,y/S.y))/.75);',
      '   float m=.28+.75*bl+.45*tr; if(uWide>.5&&x<S.x*.46&&y>S.y*.12&&y<S.y*.88) m*=.55; m=min(1.15,m);',
      '   float r=1.45*m*(.72+.42*sin(x*.011+y*.007-uT*1.5)); float b=0.;',
      '   if(uPa>0.){float dp=distance(vec2(x,y),uP); if(dp<190.){float q=1.-dp/190.; b+=uPa*3.4*q*q;}}',
      '   for(int j=0;j<' + MAXW + ';j++){ if(j>=uN) break; vec4 w=uW[j]; float dd=abs(distance(vec2(x,y),w.xy)-w.z*820.); if(dd<70.) b+=w.w*3.2*(1.-dd/70.)*(1.-w.z/1.3); }',
      '   r+=b; if(r<.35) continue;',
      '   float cov=clamp((r-d)*uDpr+.5,0.,1.); if(b>1.2) ch=max(ch,cov); else cs=max(cs,cov);',
      '  }',
      ' }',
      ' float as=.2*cs, ah=.62*ch; vec3 col=vec3(as)*(1.-ah)+vec3(1.,.8235,.247)*ah;',
      ' gl_FragColor=vec4(col,ah+as*(1.-ah));',
      '}'].join('\n');
    function initGL() {
      try { gl = cv.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false }); } catch (e) { gl = null; }
      if (!gl) return false;
      function sh(type, src) { var o = gl.createShader(type); gl.shaderSource(o, src); gl.compileShader(o); return gl.getShaderParameter(o, gl.COMPILE_STATUS) ? o : null; }
      var v = sh(gl.VERTEX_SHADER, VS), fr = sh(gl.FRAGMENT_SHADER, FS);
      if (!v || !fr) return false;
      var prog = gl.createProgram(); gl.attachShader(prog, v); gl.attachShader(prog, fr); gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return false;
      gl.useProgram(prog);
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      var loc = gl.getAttribLocation(prog, 'a'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      ['uRes', 'uDpr', 'uGap', 'uT', 'uWide', 'uPa', 'uMax', 'uP', 'uW', 'uN'].forEach(function (n) { U[n] = gl.getUniformLocation(prog, n); });
      gl.disable(gl.BLEND);
      return true;
    }
    if (!initGL()) {
      /* a canvas that handed out a WebGL context cannot give a 2D one: swap in a fresh copy */
      if (gl) { var c2 = cv.cloneNode(false); cv.parentNode.replaceChild(c2, cv); cv = c2; }
      gl = null; g = cv.getContext('2d');
      if (!g) return { shock: function () {}, sync: function () {} };
    } else {
      cv.addEventListener('webglcontextlost', function (e) { e.preventDefault(); lost = true; });
      cv.addEventListener('webglcontextrestored', function () { lost = !initGL(); size(); if (reduce) draw(0); });
    }
    var WU = new Float32Array(MAXW * 4);
    function size() {
      var r = cv.getBoundingClientRect(); box = null;
      W = r.width; H = r.height; dpr = Math.min(1.5, window.devicePixelRatio || 1);
      cv.width = Math.max(1, Math.round(W * dpr)); cv.height = Math.max(1, Math.round(H * dpr));
      gap = W < 760 ? 22 : 18;
      if (gl) return;
      pts = [];
      var wide = W >= 1100;
      for (var y = gap / 2, r0 = 0; y < H; y += gap, r0++) {
        for (var x = (r0 % 2 ? gap : gap / 2); x < W; x += gap) {
          var bl = Math.max(0, 1 - Math.hypot(x / W, 1 - y / H) / 0.95);       /* bottom-left corner */
          var tr = Math.max(0, 1 - Math.hypot(1 - x / W, y / H) / 0.75);       /* top-right corner */
          var m = 0.28 + 0.75 * bl + 0.45 * tr;
          if (wide && x < W * 0.46 && y > H * 0.12 && y < H * 0.88) m *= 0.55;  /* quieter behind the copy */
          pts.push(x, y, Math.min(1.15, m));
        }
      }
    }
    function draw(t) {
      var live = [];
      for (var k = 0; k < waves.length; k++) { var a = t - waves[k].t0; if (a < 1.3) live.push(waves[k]); }
      waves = live.slice(-MAXW);
      var pa2 = pa * (fine ? 1 : 0);
      if (gl) {
        if (lost) return;
        var reach = 2 + pa2 * 3.4;      /* the biggest a dot can get this frame: pixels farther from every centre stop early */
        for (var wi = 0; wi < MAXW; wi++) {
          var wv = waves[wi], o = wi * 4;
          if (wv) { WU[o] = wv.x; WU[o + 1] = wv.y; WU[o + 2] = t - wv.t0; WU[o + 3] = wv.s; reach += wv.s * 3.2; }
          else WU[o] = WU[o + 1] = WU[o + 2] = WU[o + 3] = 0;
        }
        gl.viewport(0, 0, cv.width, cv.height);
        gl.uniform2f(U.uRes, cv.width, cv.height); gl.uniform1f(U.uDpr, cv.width / Math.max(1, W));
        gl.uniform1f(U.uGap, gap); gl.uniform1f(U.uT, t); gl.uniform1f(U.uWide, W >= 1100 ? 1 : 0);
        gl.uniform1f(U.uPa, pa2); gl.uniform1f(U.uMax, reach); gl.uniform2f(U.uP, px, py);
        gl.uniform4fv(U.uW, WU); gl.uniform1i(U.uN, waves.length);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        return;
      }
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, W, H);
      var soft = new Path2D(), hot = new Path2D();
      var pr = 190;
      for (var i = 0; i < pts.length; i += 3) {
        var x = pts[i], y = pts[i + 1], m = pts[i + 2];
        var r = 1.45 * m * (0.72 + 0.42 * Math.sin(x * 0.011 + y * 0.007 - t * 1.5));
        var boost = 0;
        if (pa2 > 0) { var d = Math.hypot(x - px, y - py); if (d < pr) { var q = 1 - d / pr; boost += pa2 * 3.4 * q * q; } }
        for (var j = 0; j < waves.length; j++) {
          var w = waves[j], age = t - w.t0, R = age * 820, dd = Math.abs(Math.hypot(x - w.x, y - w.y) - R);
          if (dd < 70) boost += w.s * 3.2 * (1 - dd / 70) * (1 - age / 1.3);
        }
        r += boost;
        if (r < 0.35) continue;
        var p = boost > 1.2 ? hot : soft;
        p.moveTo(x + r, y); p.arc(x, y, r, 0, 6.2832);
      }
      g.fillStyle = 'rgba(255,255,255,.2)'; g.fill(soft);
      g.fillStyle = 'rgba(255,210,63,.62)'; g.fill(hot);
    }
    function loop(ts) {
      raf = requestAnimationFrame(loop);
      if (ts - last < 32) return;            /* ~30 fps is plenty for a breathing halftone */
      last = ts;
      pa += ((ts - pt < 1600 ? 1 : 0) - pa) * 0.12;
      draw(ts / 1000);
    }
    function sync() {
      var go = run && !reduce;
      if (go && !raf) { last = 0; raf = requestAnimationFrame(loop); }
      if (!go && raf) { cancelAnimationFrame(raf); raf = 0; }
    }
    size();
    if (reduce) draw(0);
    if ('ResizeObserver' in window) new ResizeObserver(function () { size(); if (reduce) draw(0); }).observe(cv);
    /* the canvas box is measured once per scroll / resize, not on every pointer move */
    window.addEventListener('scroll', function () { box = null; }, { passive: true });
    window.addEventListener('resize', function () { box = null; }, { passive: true });
    if (fine) hero.addEventListener('pointermove', function (e) {
      if (!box) box = cv.getBoundingClientRect();
      px = e.clientX - box.left; py = e.clientY - box.top; pt = performance.now();
    }, { passive: true });
    return {
      shock: function (x, y, s) { if (!reduce) waves.push({ x: x, y: y, t0: performance.now() / 1000, s: s || 1 }); },
      sync: function (on) { run = on; sync(); }
    };
  })($('[data-nxe-dots]', hero));

  /* parallax for the sky's floating layers */
  var layers = $$('.nxe-sky [data-depth]', hero);
  if (fine && !reduce && layers.length) {
    var lx = 0, ly = 0, lraf = 0;
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      lx = (e.clientX - r.left) / r.width - 0.5; ly = (e.clientY - r.top) / r.height - 0.5;
      if (!lraf) lraf = requestAnimationFrame(function () {
        lraf = 0;
        layers.forEach(function (el) {
          var d = parseFloat(el.getAttribute('data-depth')) || 0;
          el.style.translate = (lx * d * -40).toFixed(1) + 'px ' + (ly * d * -28).toFixed(1) + 'px';
        });
        var n = $('.nxe-slide.is-on .nxe-hero-nexi', hero);
        if (n) n.style.setProperty('--lean', (lx * 7).toFixed(2) + 'deg');
      });
    });
    hero.addEventListener('pointerleave', function () {
      layers.forEach(function (el) { el.style.translate = ''; });
      $$('.nxe-hero-nexi', hero).forEach(function (n) { n.style.removeProperty('--lean'); });
    });
  }


  /* ---------------- autoplay with named holds ---------------- */
  var holds = {}, timer = 0, remain = 0, started = 0;
  function held() { for (var k in holds) if (holds[k]) return true; return false; }
  function bar(restart, ms) {
    var on = chaps[cur];
    if (!on) return;
    on.style.setProperty('--dur', (ms || DUR[keys[cur]] || 9140) + 'ms');
    if (restart) { var i = $('i', on); if (i) { i.style.animation = 'none'; void i.offsetWidth; i.style.animation = ''; } }
    ctl.classList.toggle('is-held', held());
  }
  function arm() {
    clearTimeout(timer); timer = 0;
    ctl.classList.toggle('is-held', held());
    if (reduce || held() || busy) return;
    started = Date.now();
    timer = setTimeout(function () { timer = 0; go(cur + 1, 'auto'); }, remain);
  }
  function hold(why, on) {
    var was = held();
    if (on) {
      if (!was && timer) { remain = Math.max(400, remain - (Date.now() - started)); clearTimeout(timer); timer = 0; }
      holds[why] = true;
    } else delete holds[why];
    if (was && !held()) arm(); else ctl.classList.toggle('is-held', held());
  }
  function fresh(linger) { remain = linger ? LINGER : (DUR[keys[cur]] || 9140); bar(true, remain); arm(); }   /* the slide's time starts over (12 s after a tap) */

  /* ---------------- the deck ---------------- */
  function tabs(n, focus) {
    chaps.forEach(function (c, i) {
      var on = i === n;
      c.setAttribute('aria-selected', on ? 'true' : 'false');
      c.tabIndex = on ? 0 : -1;
      if (on && focus) c.focus();
    });
  }
  function settle(n) {
    slides.forEach(function (s, i) {
      var on = i === n;
      s.inert = !on;
      if (on) s.removeAttribute('aria-hidden'); else s.setAttribute('aria-hidden', 'true');
    });
  }
  function swap(from, to, n) {
    from.classList.remove('is-on', 'is-leave');
    to.classList.add('is-on');
    if (!reduce) { restartAnim(to, 'is-enter'); setTimeout(function () { to.classList.remove('is-enter'); }, 1500); }
    hero.setAttribute('data-slide', keys[n]);
    var old = cur;
    cur = n;
    settle(n);
    if (stage[keys[old]]) stage[keys[old]].leave();
    if (stage[keys[n]]) stage[keys[n]].enter();
  }
  function go(n, how) {
    n = (n + slides.length) % slides.length;
    if (n === cur || busy) return;
    var from = slides[cur], to = slides[n], key = keys[n];
    clearTimeout(timer); timer = 0;
    tabs(n, how === 'key');
    if (reduce || !bam || !bam.animate) {
      swap(from, to, n);
      fresh();
      return;
    }
    busy = true;
    var hr = hero.getBoundingClientRect(), sp = $('[data-nxe-spread]', from).getBoundingClientRect();
    var bx = sp.left - hr.left + sp.width / 2, by = sp.top - hr.top + sp.height / 2;
    if (sp.width === 0) { bx = hr.width / 2; by = hr.height / 2; }
    bam.style.setProperty('--bx', bx + 'px');
    bam.style.setProperty('--by', by + 'px');
    bam.style.setProperty('--bam', BAM[key][1]);
    bamWord.textContent = BAM[key][0];
    from.classList.add('is-leave');
    if (stage[keys[cur]]) stage[keys[cur]].leave();
    bam.animate([{ opacity: 1, transform: 'scale(0) rotate(-40deg)' }, { opacity: 1, transform: 'scale(1) rotate(0deg)' }],
                { duration: 300, easing: 'cubic-bezier(.2,1.45,.45,1)', fill: 'forwards' });
    setTimeout(function () {
      swap(from, to, n);
      dots.shock(bx, by, 1.4);
      restartAnim(hero, 'is-shake');
      bam.animate([{ opacity: 1, transform: 'scale(1) rotate(0deg)' }, { opacity: 0, transform: 'scale(2.6) rotate(14deg)' }],
                  { duration: 440, delay: 110, easing: 'cubic-bezier(.5,0,.75,0)', fill: 'forwards' }).onfinish = function () {
        busy = false;
        hero.classList.remove('is-shake');
        fresh();
      };
    }, 310);
  }
  chaps.forEach(function (c, i) {
    c.addEventListener('click', function () { go(i, 'click'); });
    c.addEventListener('keydown', function (e) {
      var k = e.key, n = chaps.length;
      var j = k === 'ArrowRight' ? (i + 1) % n : k === 'ArrowLeft' ? (i + n - 1) % n : k === 'Home' ? 0 : k === 'End' ? n - 1 : -1;
      if (j < 0) return;
      e.preventDefault();
      go(j, 'key');
    });
  });
  $$('[data-nxe-go]', hero).forEach(function (b) {
    b.addEventListener('click', function () { go(cur + (+b.getAttribute('data-nxe-go')), 'click'); });
  });
  if (pp) pp.addEventListener('click', function () {
    var on = !holds.user;
    hold('user', on);
    hero.classList.toggle('is-paused', on);
    pp.setAttribute('aria-pressed', on ? 'true' : 'false');
    pp.setAttribute('aria-label', on ? 'Play the slides' : 'Pause the slides');
    if (!on) fresh();
  });
  /* holds: pointer on the controls or a spread, keyboard focus inside the hero */
  if (fine) {
    var off = {};
    [ctl].concat($$('[data-nxe-spread],[data-nxe-belt]', hero)).forEach(function (z, k) {
      z.addEventListener('pointerenter', function () { clearTimeout(off[k]); hold('hover', true); });
      z.addEventListener('pointerleave', function () { off[k] = setTimeout(function () { hold('hover', false); }, 400); });
    });
  }
  hero.addEventListener('focusin', function (e) { if (e.target.matches(':focus-visible')) hold('focus', true); });
  hero.addEventListener('focusout', function (e) { if (!hero.contains(e.relatedTarget)) hold('focus', false); });
  /* swipe on touch screens */
  var sx = 0, sy = 0, st = 0;
  deck.addEventListener('pointerdown', function (e) { if (e.pointerType === 'touch' && !e.target.closest('[data-nxe-belt]')) { sx = e.clientX; sy = e.clientY; st = 1; } });
  deck.addEventListener('pointerup', function (e) {
    if (!st) return;
    st = 0;
    var dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) > 56 && Math.abs(dx) > Math.abs(dy) * 1.4) go(cur + (dx < 0 ? 1 : -1), 'swipe');
  });
  deck.addEventListener('pointercancel', function () { st = 0; });
  /* off screen / hidden tab / intro */
  var seen = true;
  function vis() {
    var on = seen && !document.hidden;
    hold('off', !on);
    dots.sync(on);
  }
  if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { seen = en[en.length - 1].isIntersecting; vis(); }).observe(hero);
  document.addEventListener('visibilitychange', vis);
  if (document.documentElement.classList.contains('intro')) {
    hold('intro', true);
    document.addEventListener('tn:intro-done', function () { hold('intro', false); }, { once: true });
    setTimeout(function () { hold('intro', false); }, 9000);
  }

  /* ---------------- each spread ---------------- */
  function nexiOf(sl) { return $('[data-nxe-nexi]', sl); }
  function base(img) { return img.getAttribute('src').replace(/[^/]+\.webp.*$/, ''); }
  function talker(sl, lines) {
    var say = $('[data-nxe-say]', sl), li = 0, iv = 0;
    function speak(t) { say.textContent = t; if (!reduce) restartAnim(say, 'is-pop'); }
    return {
      speak: speak,
      start: function (quiet) {
        clearInterval(iv);
        if (!quiet) { li = (li + 1) % lines.length; speak(lines[li]); }
        if (!reduce) iv = setInterval(function () { li = (li + 1) % lines.length; speak(lines[li]); }, 2200);
      },
      stop: function () { clearInterval(iv); },
      bump: function () { this.start(true); }
    };
  }
  /* Nexi's tap: a pose, a line, a sound word, a hop; back to the slide's own pose after a while */
  function reactor(sl, home, taps, words, extra) {
    var btn = nexiOf(sl), img = btn && $('img', btn), root = img ? base(img) : '', ti = 0, wi = 0, back = 0, spread = $('[data-nxe-spread]', sl);
    var talk = talker(sl, extra.lines);
    function pose(p) { if (!img) return; img.removeAttribute('width'); img.removeAttribute('height'); img.src = root + 'nexi-' + p + '.webp'; }
    if (btn) btn.addEventListener('click', function () {
      var t = taps[ti++ % taps.length];
      pose(t[0]); talk.speak(t[1]); talk.bump();
      var r = rel(btn, spread);
      word(spread, words[wi++ % words.length], r.x + r.w * 0.5, r.y + r.h * 0.12);
      if (!reduce) restartAnim(btn, 'is-hop');
      if (extra.tap) extra.tap(btn, r);
      clearTimeout(back);
      back = setTimeout(function () { pose(home); }, 4200);
      fresh(true);
    });
    /* warm the poses once the page is idle so a tap swaps instantly */
    setTimeout(function () { taps.forEach(function (t) { var i = new Image(); i.src = root + 'nexi-' + t[0] + '.webp'; }); }, 3000 + Math.random() * 2000);
    return talk;
  }
  function kids(sl) {
    var spread = $('[data-nxe-spread]', sl);
    $$('[data-nxe-kid][data-word]', sl).forEach(function (k) {
      k.addEventListener('click', function () {
        restartAnim(k, 'is-hop');
        var r = rel(k, spread);
        word(spread, k.getAttribute('data-word'), r.x + r.w * 0.5, r.y);
        fresh(true);
      });
    });
  }
  var stage = {};

  /* 1 · Series */
  (function () {
    var sl = slides[keys.indexOf('series')];
    if (!sl) return;
    var talk = reactor(sl, 'burst',
      [['kiss', 'Aww, thank you for watching!'], ['dizzy', 'Whoa! Breaking panels makes me dizzy!'], ['gasp', 'Is that a new episode?!'],
       ['clap', 'Beep boop! Pick a season below.'], ['cute', 'Hehe, that tickles!'], ['hi', 'Hi again! Grab some popcorn.']],
      ['BOOP!', 'WOW!', 'HEHE!', 'YAY!', 'ZING!', 'BEEP!'],
      { lines: ['Hi! I’m Nexi. Grab a seat!', 'One idea per episode. Promise!', 'New episodes every Tue, Thu and Sat.', 'Tap me. I dare you!', 'Season 2 is about the people side of Odoo.'],
        tap: function () { var sp = $('[data-nxe-spread]', sl); if (!reduce) restartAnim(sp, 'is-shake'); } });
    kids(sl);
    var imgs = $$('[data-nxe-reel] img', sl), cap = $('[data-nxe-tvcap]', sl), k = 0, iv = 0;
    imgs.forEach(function (im) { if (im.loading === 'lazy') im.loading = 'eager'; });
    function show(i) {
      imgs.forEach(function (im, j) { im.classList.toggle('is-on', j === i); });
      if (cap) {
        cap.textContent = '';
        var b = document.createElement('b'); b.textContent = imgs[i].getAttribute('data-cap');
        var s = document.createElement('span'); s.textContent = imgs[i].getAttribute('data-title');
        cap.appendChild(b); cap.appendChild(s);
        if (!reduce) restartAnim(cap, 'is-swap');
      }
    }
    stage.series = {
      enter: function () { talk.start(); clearInterval(iv); if (!reduce && imgs.length > 1) iv = setInterval(function () { k = (k + 1) % imgs.length; show(k); }, 1300); },
      leave: function () { talk.stop(); clearInterval(iv); }
    };
  })();

  /* 2 · Quick Tips: every tip rides a conveyor past a chequered finish line. The tip on the line shows in the readout.
     Drag the belt, tap a tip (it rolls to the line), or spin the stopwatch (the belt races and stops on a random tip). */
  (function () {
    var sl = slides[keys.indexOf('tips')];
    if (!sl) return;
    var belt = $('[data-nxe-belt]', sl), track = $('[data-nxe-track]', sl), out = $('[data-nxe-readout]', sl);
    var watch = $('[data-nxe-shuffle]', sl), wt = watch && $('.nxe-watch-t', watch), spread = $('[data-nxe-spread]', sl);
    /* the 34 tip thumbnails (plus their loop clones) load only once the slide is shown or the belt is touched (~1.3 MB) */
    function hydrate() { $$('img[data-src]', track).forEach(function (i) { i.src = i.getAttribute('data-src'); i.removeAttribute('data-src'); }); }
    belt.addEventListener('pointerdown', hydrate, { once: true });
    var cards = $$('[data-nxe-tip]', track), n = cards.length;
    if (!n || !belt) return;
    cards.forEach(function (c) {
      var k = c.cloneNode(true);
      k.removeAttribute('data-nxe-tip'); k.setAttribute('aria-hidden', 'true'); k.tabIndex = -1;
      track.appendChild(k);
    });
    var all = $$('.nxe-tipc', track), centers = [], SW = 1, pos = 0, speed = 52, raf = 0, last = 0, hit = -1, glide = null, drag = null, dragged = false, spinning = false;
    var oc = $('[data-nxe-tipcode]', out), ot = $('[data-nxe-tiptitle]', out), ol = $('[data-nxe-tiplen]', out);
    var BW = 1;   /* the belt's width, measured with the cards (reading it every frame forced a layout per frame) */
    function measure() {
      var x0 = track.offsetLeft; BW = belt.clientWidth;
      centers = cards.map(function (c) { return c.offsetLeft - x0 + c.offsetWidth / 2; });
      SW = Math.max(1, all[n].offsetLeft - cards[0].offsetLeft);
    }
    function readout(i) {
      var c = cards[i], code = c.getAttribute('data-c');
      oc.textContent = code; ot.textContent = c.getAttribute('data-t'); ol.textContent = c.getAttribute('data-l');
      out.href = '#' + (parseInt(code.replace(/\D/g, ''), 10) > 14 ? 'season-2-tips' : 'season-1-tips');
      out.setAttribute('aria-label', 'On the finish line: ' + code + ', ' + c.getAttribute('data-t') + '. See the Quick Tips');
      if (!reduce) restartAnim(out, 'is-new');
    }
    function render() {
      var m = ((pos % SW) + SW) % SW, x = m + BW / 2, best = 0, bd = 1e9;
      track.style.transform = 'translate3d(' + (-m).toFixed(1) + 'px,0,0)';
      for (var i = 0; i < n; i++) {
        var d = Math.min(Math.abs(centers[i] - x), Math.abs(centers[i] + SW - x));
        if (d < bd) { bd = d; best = i; }
      }
      if (best !== hit) {
        if (hit >= 0) { cards[hit].classList.remove('is-hit'); all[hit + n].classList.remove('is-hit'); }
        hit = best;
        cards[hit].classList.add('is-hit'); all[hit + n].classList.add('is-hit');
        readout(hit);
      }
    }
    function loop(ts) {
      raf = requestAnimationFrame(loop);
      var dt = last ? Math.min(0.05, (ts - last) / 1000) : 0;
      last = ts;
      if (glide) {
        var k = Math.min(1, (ts - glide.t0) / glide.d), e = 1 - Math.pow(1 - k, 3);
        pos = glide.a + (glide.b - glide.a) * e;
        if (k >= 1) { var f = glide.done; glide = null; if (f) f(); }
      } else if (!drag) pos += speed * dt;
      render();
    }
    function run(go) {
      if (go && !raf && !reduce) { last = 0; raf = requestAnimationFrame(loop); }
      if (!go && raf) { cancelAnimationFrame(raf); raf = 0; }
    }
    /* roll so tip i sits on the finish line, after at least `extra` px of travel */
    function rollTo(i, extra, d, done) {
      var want = centers[i] - BW / 2, tgt = pos + (extra || 0);
      tgt += (((want - tgt) % SW) + SW) % SW;
      if (reduce) { pos = tgt; render(); if (done) done(); return; }
      glide = { a: pos, b: tgt, t0: performance.now(), d: d || 600, done: done };
      run(true);
    }
    function landed(i, big) {
      var r = rel(out, spread);
      word(spread, big ? 'DING!' : rnd(['GOT IT!', 'THIS ONE!', 'DING!']), r.x + r.w * 0.3, r.y);
      talk.speak(cards[i].getAttribute('data-c') + ': ' + cards[i].getAttribute('data-t') + '!'); talk.bump();
    }
    track.addEventListener('click', function (e) {
      var c = e.target.closest('.nxe-tipc');
      if (!c) return;
      if (dragged) { dragged = false; e.preventDefault(); return; }
      var i = all.indexOf(c) % n;
      rollTo(i, 0, 520, function () { landed(i); });
      fresh(true);
    });
    belt.addEventListener('pointerdown', function (e) {
      if (e.button > 0) return;
      drag = { x: e.clientX, y: e.clientY, p: pos, id: e.pointerId, cap: false };
      glide = null; dragged = false;
    });
    belt.addEventListener('pointermove', function (e) {
      if (!drag || e.pointerId !== drag.id) return;
      var dx = e.clientX - drag.x;
      if (!drag.cap) {
        if (Math.abs(dx) < 7 || Math.abs(dx) < Math.abs(e.clientY - drag.y)) return;
        drag.cap = true; dragged = true;
        try { belt.setPointerCapture(e.pointerId); } catch (x) { /* fine without capture */ }
        belt.classList.add('is-drag');
        fresh(true);
      }
      pos = drag.p - dx;
      if (!raf) render();
    });
    function endDrag() { if (!drag) return; drag = null; belt.classList.remove('is-drag'); }
    belt.addEventListener('pointerup', endDrag);
    belt.addEventListener('pointercancel', endDrag);
    var talk = reactor(sl, 'racer',
      [['jump', 'Zoom zoom!'], ['reach', 'Faster than a coffee break!'], ['clap', 'That’s a wrap. Next tip!'], ['hi', 'Ready, set, Odoo!']],
      ['ZOOM!', 'VROOM!', 'GO!', 'WHOOSH!'],
      { lines: ['One trick. Under two minutes!', 'Spin the stopwatch!', 'Drag the conveyor. Pick a tip!', 'Quick Tips drop between the episodes.'] });
    if (watch) watch.addEventListener('click', function () {
      if (spinning) return;
      spinning = true;
      watch.classList.add('is-spin'); if (wt) wt.textContent = '?!';
      var r = rel(watch, spread), t = Math.floor(Math.random() * n);
      if (t === hit) t = (t + 7) % n;
      word(spread, 'TICK-TICK-TICK!', r.x + r.w * 0.6, r.y + r.h * 0.2);
      rollTo(t, SW + Math.random() * SW * 0.5, reduce ? 0 : 1800, function () {
        watch.classList.remove('is-spin'); if (wt) wt.textContent = 'SPIN!';
        landed(t, true);
        spinning = false;
      });
      fresh(true);
    });
    if ('ResizeObserver' in window) new ResizeObserver(function () { measure(); render(); }).observe(belt);
    measure(); render();
    stage.tips = {
      enter: function () { hydrate(); talk.start(); measure(); run(true); },
      leave: function () { talk.stop(); run(false); endDrag(); glide = null; spinning = false; if (watch) watch.classList.remove('is-spin'); }
    };
  })();

  /* 3 · Cast */
  (function () {
    var sl = slides[keys.indexOf('cast')];
    if (!sl) return;
    var troupe = $('[data-nxe-troupe]', sl), spread = $('[data-nxe-spread]', sl), tag = $('[data-nxe-tag]', sl);
    var recast = $('[data-nxe-recast]', sl), btn = nexiOf(sl), nimg = btn && $('img', btn);
    var root = troupe.getAttribute('data-root') || '', cast = [], wardrobe = [];
    try { cast = JSON.parse(troupe.getAttribute('data-cast') || '[]'); } catch (e) { cast = []; }
    try { wardrobe = JSON.parse(btn.getAttribute('data-wardrobe') || '[]'); } catch (e) { wardrobe = []; }
    var spots = $$('[data-nxe-kid]', troupe), tagT = 0, wi = 0, busyCast = false;
    function who(b) { var lab = b.getAttribute('aria-label') || ''; var c = lab.indexOf(':'); return [lab.slice(0, c), lab.slice(c + 2)]; }
    function puff(r) {
      if (reduce) return;
      var p = document.createElement('span');
      p.className = 'nxe-puff'; p.setAttribute('aria-hidden', 'true');
      p.style.left = (r.x + r.w / 2) + 'px'; p.style.top = (r.y + r.h / 2) + 'px';
      spread.appendChild(p);
      p.addEventListener('animationend', function () { p.remove(); });
    }
    function showTag(b) {
      var r = rel(b, spread), w = who(b);
      tag.textContent = '';
      var n = document.createElement('b'); n.textContent = w[0];
      tag.appendChild(n); tag.appendChild(document.createTextNode(w[1]));
      tag.hidden = false;
      var half = tag.offsetWidth / 2 + 4;
      tag.style.left = Math.max(half, Math.min(spread.clientWidth - half, r.x + r.w / 2)) + 'px';
      tag.style.top = Math.max(18, r.y - 6) + 'px';
      if (!reduce) restartAnim(tag, 'is-pop');
      clearTimeout(tagT);
      tagT = setTimeout(function () { tag.hidden = true; }, 2800);
    }
    spots.forEach(function (b) {
      b.addEventListener('click', function () {
        restartAnim(b, 'is-hop');
        spots.forEach(function (x) { x.classList.toggle('is-spot', x === b); });
        var r = rel(b, spread);
        word(spread, rnd(['HI!', 'YAY!', 'HEY!', 'WHEE!', 'HELLO!']), r.x + r.w / 2, r.y);
        showTag(b);
        fresh(true);
      });
    });
    function drop() {
      if (reduce) return;
      spots.forEach(function (b, i) { b.style.setProperty('--dd', (0.35 + i * 0.09).toFixed(2) + 's'); restartAnim(b, 'is-drop'); });
    }
    if (recast) recast.addEventListener('click', function () {
      if (busyCast || cast.length < spots.length) return;
      busyCast = true;
      var now = spots.map(function (b) { return who(b)[0]; });
      var pool = cast.filter(function (c) { return now.indexOf(c.n) < 0; });
      for (var i = pool.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = pool[i]; pool[i] = pool[j]; pool[j] = t; }
      tag.hidden = true;
      spots.forEach(function (b, i) {
        var c = pool[i % pool.length], im = $('img', b);
        setTimeout(function () {
          puff(rel(b, spread));
          if (!reduce) restartAnim(b, 'is-gone');
          setTimeout(function () {
            b.classList.remove('is-gone');
            im.src = root + 'cast/' + c.f;
            b.setAttribute('aria-label', c.n + ': ' + c.r);
            if (!reduce) { b.style.setProperty('--dd', '0s'); restartAnim(b, 'is-drop'); }
          }, reduce ? 0 : 320);
        }, reduce ? 0 : i * 90);
      });
      setTimeout(function () { busyCast = false; }, reduce ? 0 : spots.length * 90 + 900);
      var r = rel(recast, spread);
      word(spread, 'SHUFFLE!', r.x + r.w / 2, r.y);
      fresh(true);
    });
    var talk = talker(sl, ['Say hi to the gang!', 'Tap a sidekick. They love it!', 'Tap me for a new costume!', 'Every episode, a new friend.']);
    if (btn && nimg) btn.addEventListener('click', function () {
      if (!wardrobe.length) return;
      var w = wardrobe[wi++ % wardrobe.length], r = rel(btn, spread);
      puff({ x: r.x + r.w * 0.2, y: r.y + r.h * 0.2, w: r.w * 0.6, h: r.h * 0.4 });
      nimg.removeAttribute('width'); nimg.removeAttribute('height');
      nimg.src = root + 'wardrobe/' + w.k + '.webp';
      if (!reduce) restartAnim(btn, 'is-poof');
      word(spread, rnd(['POOF!', 'TA-DA!', 'SHAZAM!']), r.x + r.w / 2, r.y + r.h * 0.1);
      talk.speak(w.n + ', at your service!'); talk.bump();
      fresh(true);
    });
    setTimeout(function () { wardrobe.slice(0, 6).forEach(function (w) { var i = new Image(); i.src = root + 'wardrobe/' + w.k + '.webp'; }); }, 5000);
    var spotT = 0;
    function spotlight() {
      var b = rnd(spots.filter(function (x) { return x.offsetWidth; }));
      if (!b) return;
      spots.forEach(function (x) { x.classList.toggle('is-spot', x === b); });
      showTag(b);
    }
    stage.cast = {
      enter: function () { talk.start(); drop(); clearTimeout(spotT); if (!reduce) spotT = setTimeout(spotlight, 1150); },
      leave: function () { talk.stop(); tag.hidden = true; clearTimeout(spotT); spots.forEach(function (x) { x.classList.remove('is-spot'); }); }
    };
  })();

  /* 4 · Specials */
  (function () {
    var sl = slides[keys.indexOf('specials')];
    if (!sl) return;
    var spread = $('[data-nxe-spread]', sl), panels = $$('.nxe-hs', sl), conf = $('[data-nxe-confetti]', sl), fi = 0, iv = 0;
    function blast(x, y) {
      if (reduce || !conf) return;
      var C = ['#FFD23F', '#FF5A47', '#6FA0F5', '#3DDC84', '#FF9DB4', '#fff'];
      for (var i = 0; i < 26; i++) {
        var p = document.createElement('i'), a = -Math.PI / 2 + (Math.random() - 0.5) * 2.4, d = 90 + Math.random() * 170;
        p.style.setProperty('--x0', x + 'px'); p.style.setProperty('--y0', y + 'px');
        p.style.setProperty('--dx', (Math.cos(a) * d).toFixed(0) + 'px'); p.style.setProperty('--dy', (Math.sin(a) * d + 120).toFixed(0) + 'px');
        p.style.setProperty('--dr', (Math.random() * 900 - 450).toFixed(0) + 'deg'); p.style.setProperty('--c', rnd(C));
        p.style.animationDelay = (Math.random() * 0.08).toFixed(2) + 's';
        conf.appendChild(p);
        p.addEventListener('animationend', function () { this.remove(); });
      }
    }
    var lines = panels.map(function (p) { return p.getAttribute('data-title') + ' airs ' + p.getAttribute('data-airs') + '!'; });
    var talk = reactor(sl, 'party',
      [['gasp', 'Eek! A ghost in the office!'], ['cute', 'Ho ho ho! Christmas rush!'], ['kiss', 'Happy holidays!'], ['clap', '3… 2… 1… countdown time!']],
      ['WOO-HOO!', 'BOO!', 'HO HO!', 'POP!'],
      { lines: lines.concat(['Tap me for confetti!']), tap: function (b, r) { blast(r.x + r.w * 0.5, r.y + r.h * 0.2); } });
    var trip = $('[data-nxe-trip]', sl), GROW = 2.6;
    /* where the open panel's centre will be once the flex transition settles (so Nexi hops straight there) */
    function centre(i) {
      var W = trip.clientWidth, gap = parseFloat(getComputedStyle(trip).columnGap) || 0, u = (W - gap * (panels.length - 1)) / (GROW + panels.length - 1), x = 0;
      for (var j = 0; j < i; j++) x += u + gap;
      return (x + u * GROW / 2) / W * 100;
    }
    function front(i, say) {
      fi = i;
      panels.forEach(function (p, j) { p.classList.toggle('is-front', j === i); });
      if (i >= 0) { var cx = centre(i).toFixed(2); spread.style.setProperty('--nx', cx + '%'); spread.style.setProperty('--nxn', cx); }
      if (say && i >= 0) talk.speak(lines[i]);
    }
    panels.forEach(function (p, i) {
      p.addEventListener('pointerenter', function () { clearInterval(iv); if (fi !== i) front(i, true); });
      p.addEventListener('focus', function () { clearInterval(iv); if (fi !== i) front(i, true); });
      p.addEventListener('click', function (e) {
        if (fi === i) return;          /* a closed panel opens first; tap it again to go to the specials */
        e.preventDefault(); clearInterval(iv); front(i, true); fresh(true);
      });
    });
    stage.specials = {
      enter: function () {
        talk.start(true); clearInterval(iv); front(0, true);
        if (!reduce) iv = setInterval(function () { front((fi + 1) % panels.length, true); }, 1100);
      },
      leave: function () { talk.stop(); clearInterval(iv); }
    };
    front(0);
  })();

  /* ---------------- the rest of the page: sidekicks that peek in, doodles drifting with the scroll ---------------- */
  $$('[data-nxe-peek]').forEach(function (b) {
    b.addEventListener('click', function () {
      restartAnim(b, 'is-hop');
      var host = b.offsetParent || document.body, r = rel(b, host);
      word(host, b.getAttribute('data-word') || 'HI!', r.x + r.w / 2, r.y);
    });
  });
  var drift = $$('[data-sdepth]');
  if (drift.length && !reduce) {
    var dr = 0, dsec = drift[0].closest('section');
    var driftNow = function () {
      dr = 0;
      var top = dsec.getBoundingClientRect().top;
      if (top > innerHeight || top + dsec.offsetHeight < 0) return;
      drift.forEach(function (el) {
        el.style.translate = '0 ' + (top * (parseFloat(el.getAttribute('data-sdepth')) || 0) * 0.25).toFixed(1) + 'px';
      });
    };
    addEventListener('scroll', function () { if (!dr) dr = requestAnimationFrame(driftNow); }, { passive: true });
    driftNow();
  }

  /* ---------------- start: on the slide the head picked (html[data-nxe-first]) ---------------- */
  var f0 = Math.max(0, keys.indexOf(document.documentElement.getAttribute('data-nxe-first') || ''));
  if (f0) {
    slides[0].classList.remove('is-on');
    slides[f0].classList.add('is-on');
    cur = f0;
    hero.setAttribute('data-slide', keys[f0]);
    tabs(f0);
  }
  document.documentElement.removeAttribute('data-nxe-first');
  settle(cur);
  if (stage[keys[cur]]) stage[keys[cur]].enter();
  remain = DUR[keys[cur]];
  bar(true);
  vis();
  arm();
})();
