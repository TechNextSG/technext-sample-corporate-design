/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* Brand assets page: a brand system pipeline. Design tokens (colour, type pair, logo lock-ups,
   spacing, radius) feed components, components feed five assets; switching between three fictional
   directions sends the change through in order, contrast checks auto-fix button text, and each
   channel's export checklist ticks as its asset is ready. Hover any item to trace what it feeds. */
TN.demo('brandkit', function (root, K) {
  var q = function (s) { return K.$(s, root); };
  var wrap = q('.bkt-wrap'), wires = q('.bkt-wires'), status = q('[data-status]'), rad = q('.bkt-rad input'), radOut = q('.bkt-rad output');
  // p primary, a accent, s surface, i ink; display and body fonts; radius; spacing; mark
  var DIRS = {
    a: { n: 'A · Calm', p: '#1F4E5A', a: '#9E5230', s: '#F3EEE6', i: '#1C2326', fd: 'Georgia,"Times New Roman",serif', fdn: 'Georgia', fb: 'var(--font-body)', fbn: 'Inter', dw: 700, tt: 'none', ls: '0', r: 4, sp: 1.25, spn: 'roomy', m: 'a' },
    b: { n: 'B · Bold', p: '#1A1D29', a: '#E4572E', s: '#F4F4F1', i: '#0F1115', fd: 'var(--font-display)', fdn: 'Plus Jakarta Sans', fb: 'var(--font-body)', fbn: 'Inter', dw: 800, tt: 'uppercase', ls: '.02em', r: 0, sp: .9, spn: 'tight', m: 'b' },
    c: { n: 'C · Warm', p: '#5B3A4A', a: '#E0A43A', s: '#F7EFE2', i: '#2A1E24', fd: 'var(--font-hand)', fdn: 'Caveat', fb: 'var(--font-display)', fbn: 'Plus Jakarta Sans', dw: 700, tt: 'none', ls: '0', r: 16, sp: 1.1, spn: 'relaxed', m: 'c' }
  };
  var TOK = { col: ['btn', 'tag', 'card', 'head', 'pat'], type: ['btn', 'tag', 'card', 'head'], logo: ['head', 'pat'], space: ['btn', 'card', 'head'], rad: ['btn', 'tag', 'card'] };
  var CMP = { btn: ['post', 'mail'], tag: ['slide', 'sign'], card: ['card', 'slide'], head: ['slide', 'sign', 'card', 'mail'], pat: ['card', 'post', 'slide', 'sign'] };
  var ORDER = ['card', 'post', 'mail', 'slide', 'sign'];
  var scopes = K.$$('[data-scope]', root), byScope = {};
  scopes.forEach(function (s) { byScope[s.dataset.scope] = s; });
  var tEls = {}, cEls = {}, aEls = {};
  K.$$('[data-t]', root).forEach(function (e) { tEls[e.dataset.t] = e; });
  K.$$('[data-c]', root).forEach(function (e) { cEls[e.dataset.c] = e; });
  K.$$('[data-a]', root).forEach(function (e) { aEls[e.dataset.a] = e; });
  var groups = {}; K.$$('[data-g]', root).forEach(function (g) { groups[g.dataset.g] = K.$$('li', g); });
  var cur = null, timers = [], override = null, touched = false;

  /* ------------------------------------------------------------ contrast (WCAG relative luminance) */
  function lum(hex) { return [1, 3, 5].map(function (i) { var c = parseInt(hex.substr(i, 2), 16) / 255; return c <= .03928 ? c / 12.92 : Math.pow((c + .055) / 1.055, 2.4); }).reduce(function (s, c, i) { return s + c * [.2126, .7152, .0722][i]; }, 0); }
  function ratio(a, b) { var x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); }
  function qa(d) {
    var w = ratio('#FFFFFF', d.a), k = ratio(d.i, d.a), body = ratio(d.i, d.s), ok = w >= 4.5, ink = !ok && k > w;
    return { at: ink ? d.i : '#FFFFFF', fix: !ok, btn: ok ? 'Button text ' + w.toFixed(1) + ':1, passes AA' : ink && k >= 4.5 ? 'Button text: white ' + w.toFixed(1) + ':1 fails AA, switched to ink ' + k.toFixed(1) + ':1' : 'Button text ' + Math.max(w, k).toFixed(1) + ':1 fails AA: darken the accent', body: 'Body text ' + body.toFixed(1) + ':1 on the surface colour' };
  }

  /* ------------------------------------------------------------ apply a direction to one scope */
  function apply(el, d, Q) {
    var st = el.style;
    st.setProperty('--bk-p', d.p); st.setProperty('--bk-a', d.a); st.setProperty('--bk-s', d.s); st.setProperty('--bk-i', d.i); st.setProperty('--bk-at', Q.at);
    st.setProperty('--bk-fd', d.fd); st.setProperty('--bk-fb', d.fb); st.setProperty('--bk-dw', d.dw); st.setProperty('--bk-tt', d.tt); st.setProperty('--bk-ls', d.ls);
    st.setProperty('--bk-r', (override == null ? d.r : override) + 'px'); st.setProperty('--bk-sp', d.sp);
    el.dataset.dir = d.m;
    K.$$('use', el).forEach(function (u) { u.setAttribute('href', '#bkt-m-' + d.m); });
  }
  function tokens(d) {
    ['p', 'a', 's', 'i'].forEach(function (k) { q('[data-hex="' + k + '"]').textContent = { p: 'Primary', a: 'Accent', s: 'Surface', i: 'Ink' }[k] + String.fromCharCode(10) + d[k]; });
    q('[data-font="d"]').textContent = d.fdn + ' · headings'; q('[data-font="b"]').textContent = d.fbn + ' · body';
    q('[data-sp]').textContent = '4 px base × ' + d.sp + ', ' + d.spn;
    q('[data-rd]').textContent = (override == null ? d.r : override) + ' px';
  }

  /* ------------------------------------------------------------ the wires between tokens and components */
  var edges = [], dots = [];
  // the travelling dots are HTML over the wires (the SVG's units are CSS pixels): each moves in a bare wrapper
  // on the compositor with a box-shadow glow. As SVG circles with a drop-shadow filter, all 17 re-ran their
  // filter and repainted the panel on every frame of a pulse.
  var dotsEl = document.createElement('div'); dotsEl.className = 'bkt-dots'; dotsEl.setAttribute('aria-hidden', 'true'); wires.parentNode.insertBefore(dotsEl, wires.nextSibling);
  Object.keys(TOK).forEach(function (t) { TOK[t].forEach(function (c) {
    var w = document.createElement('span'); w.style.cssText = 'position:absolute;left:0;top:0;opacity:0;will-change:transform,opacity';
    w.appendChild(K.el('i', 'bkt-dot')); dotsEl.appendChild(w);
    edges.push({ t: t, c: c, p: K.svg('path', { 'class': 'bkt-w' }), d: w, op: '0' });
  }); });
  edges.forEach(function (e) { wires.appendChild(e.p); });
  function measure() {
    wires.setAttribute('viewBox', '0 0 ' + wrap.offsetWidth + ' ' + wrap.offsetHeight);
    edges.forEach(function (e) {
      var a = K.box(tEls[e.t], wrap), b = K.box(cEls[e.c], wrap);
      e.a = [a.r, a.cy]; e.b = [b.x, b.cy];
      e.p.setAttribute('d', K.curve(e.a, e.b, .5));
    });
  }
  var pulse = 0;
  function bez(e, t) { var dx = (e.b[0] - e.a[0]) * .5, mt = 1 - t, x = mt * mt * mt * e.a[0] + 3 * mt * mt * t * (e.a[0] + dx) + 3 * mt * t * t * (e.b[0] - dx) + t * t * t * e.b[0]; return [x, e.a[1] + (e.b[1] - e.a[1]) * t * t * (3 - 2 * t)]; }
  var lp = K.loop(function (now) {
    var t = (now - pulse) / 650;
    edges.forEach(function (e, i) {
      var u = K.clamp(t - (i % 5) * .06, 0, 1), pt = bez(e, K.ease.inOut(u));
      e.d.style.transform = 'translate(' + (pt[0] - 3.2).toFixed(1) + 'px,' + (pt[1] - 3.2).toFixed(1) + 'px)';
      var op = u > 0 && u < 1 ? '1' : '0'; if (op !== e.op) { e.op = op; e.d.style.opacity = op; }
    });
    if (t > 1.4) lp.off();
  });

  /* ------------------------------------------------------------ the wave: tokens, then components, then assets */
  function at(ms, fn) { if (K.reduce) fn(); else timers.push(setTimeout(fn, ms)); }
  function setLi(li, cls, text) { li.className = cls; if (text) li.textContent = text; }
  function go(key) {
    timers.forEach(clearTimeout); timers = [];
    var d = DIRS[key], Q = qa(d); cur = key;
    K.$$('[data-dir]', q('.dm-head')).forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.dir === key)); });
    override = null; rad.value = d.r; radOut.textContent = d.r + ' px';
    Object.keys(groups).forEach(function (g) { groups[g].forEach(function (li) { setLi(li, 'is-wait'); }); });
    status.textContent = 'applying ' + d.n + '…';
    at(0, function () { apply(byScope.tok, d, Q); tokens(d); if (!K.reduce) { pulse = performance.now(); measure(); lp.on(); } });
    at(560, function () {
      apply(byScope.cmp, d, Q);
      Object.keys(cEls).forEach(function (c, i) { if (!K.reduce) setTimeout(function () { K.restart(cEls[c], 'is-flash'); }, i * 60); });
      var g = groups.qa;
      setLi(g[0], Q.fix ? 'is-fix' : 'is-ok', Q.btn); setLi(g[1], 'is-ok', Q.body); setLi(g[2], 'is-ok');
    });
    ORDER.forEach(function (a, i) {
      at(900 + i * 240, function () {
        apply(byScope[a], d, Q); if (!K.reduce) K.restart(aEls[a], 'is-swap');
        groups[a].forEach(function (li) { setLi(li, 'is-busy'); });
        at(380, function () { groups[a].forEach(function (li) { setLi(li, 'is-ok'); }); });
      });
    });
    at(900 + ORDER.length * 240 + 420, function () {
      status.textContent = d.n + ' · 13 of 13 exports and checks ready' + (Q.fix ? ', 1 auto-fixed' : '');
    });
  }

  /* ------------------------------------------------------------ hover: trace what feeds what */
  function trace(kind, key) {
    var ts = {}, cs = {}, as = {};
    if (kind === 't') { ts[key] = 1; TOK[key].forEach(function (c) { cs[c] = 1; CMP[c].forEach(function (a) { as[a] = 1; }); }); }
    if (kind === 'c') { cs[key] = 1; CMP[key].forEach(function (a) { as[a] = 1; }); Object.keys(TOK).forEach(function (t) { if (TOK[t].indexOf(key) >= 0) ts[t] = 1; }); }
    if (kind === 'a') { as[key] = 1; Object.keys(CMP).forEach(function (c) { if (CMP[c].indexOf(key) >= 0) { cs[c] = 1; Object.keys(TOK).forEach(function (t) { if (TOK[t].indexOf(c) >= 0) ts[t] = 1; }); } }); }
    root.classList.add('is-peek');
    Object.keys(tEls).forEach(function (k) { tEls[k].classList.toggle('is-hot', !!ts[k]); });
    Object.keys(cEls).forEach(function (k) { cEls[k].classList.toggle('is-hot', !!cs[k]); });
    Object.keys(aEls).forEach(function (k) { aEls[k].classList.toggle('is-hot', !!as[k]); });
    edges.forEach(function (e) { e.p.classList.toggle('is-hot', !!ts[e.t] && !!cs[e.c] && (kind !== 'c' || e.c === key)); });
  }
  function untrace() { root.classList.remove('is-peek'); K.$$('.is-hot', root).forEach(function (e) { e.classList.remove('is-hot'); }); }
  [[tEls, 't'], [cEls, 'c'], [aEls, 'a']].forEach(function (g) {
    Object.keys(g[0]).forEach(function (k) {
      var el = g[0][k];
      el.addEventListener('pointerenter', function () { trace(g[1], k); }); el.addEventListener('focus', function () { trace(g[1], k); });
      el.addEventListener('pointerleave', untrace); el.addEventListener('blur', untrace);
    });
  });

  /* ------------------------------------------------------------ controls */
  var cyc = [];
  function user() { touched = true; cyc.forEach(clearTimeout); cyc = []; }
  K.$$('[data-dir]', q('.dm-head')).forEach(function (b) { b.addEventListener('click', function () { user(); if (b.dataset.dir !== cur) go(b.dataset.dir); }); });
  rad.addEventListener('input', function () {
    user(); override = +rad.value; radOut.textContent = override + ' px'; q('[data-rd]').textContent = override + ' px';
    scopes.forEach(function (s) { s.style.setProperty('--bk-r', override + 'px'); });
  });
  window.addEventListener('resize', measure);

  var d0 = DIRS.a, Q0 = qa(d0);
  scopes.forEach(function (s) { apply(s, d0, Q0); }); tokens(d0); cur = 'a';
  if (K.reduce) go('a');
  return {
    start: function (first) {
      measure();
      if (first && !touched && !K.reduce) {
        go('a');
        cyc.push(setTimeout(function () { go('b'); }, 4200), setTimeout(function () { go('c'); }, 8600));
      }
    },
    stop: function () { lp.off(); }
  };
});
