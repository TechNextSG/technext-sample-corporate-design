/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* Web design page: a sitemap that assembles a live wireframe, build choices that move illustrative
   Core Web Vitals and SEO checks, and enquiries routed into Odoo CRM (UTM source, spam check,
   similar leads, timed rule-based assignment by team and capacity, automation rule for the call). */
TN.demo('sitebuild', function (root, K) {
  var q = function (s) { return K.$(s, root); };
  var tree = q('.sbd-tree'), pageEl = q('.sbd-page'), scroller = q('.sbd-scroll'), frame = q('.sbd-frame');
  var gWrap = q('.sbd-gauges'), seoList = q('.sbd-seo'), why = q('.sbd-why');
  var rail = q('.sbd-rail'), toks = q('.sbd-toks'), wire = q('.sbd-wire'), ring = q('.sbd-ring circle'), qBadge = q('.sbd-q');
  var queueEl = q('.sbd-queue'), teamEl = q('.sbd-team'), srcEl = q('.sbd-src'), actsEl = q('.sbd-acts'), runEl = q('[data-run]');
  var sts = K.$$('.sbd-st', root).map(function (s) { return { el: s, d: K.$('small', s), dot: K.$('.sbd-dot', s), base: K.$('small', s).textContent }; });
  var tip = K.tip(root);
  var ICO = {
    ok: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7"/></svg>',
    no: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 4.5l7 7M11.5 4.5l-7 7"/></svg>',
    warn: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3.8v5.4M8 12v.2"/></svg>'
  };

  /* ------------------------------------------------------------ the sitemap */
  // [id, label, parent]
  var PG = [['home', 'Home', null], ['svc', 'Services', 'home'], ['svc1', 'Consulting', 'svc'], ['svc2', 'Installation', 'svc'], ['svc3', 'Maintenance', 'svc'],
    ['ind', 'Industries', 'home'], ['ind1', 'Manufacturing', 'ind'], ['ind2', 'Retail', 'ind'], ['abt', 'About', 'home'], ['team', 'Our team', 'abt'],
    ['blog', 'Blog', 'home'], ['cta', 'Contact', 'home']];
  var BY = {}; PG.forEach(function (p) { BY[p[0]] = p; });
  function url(p) { return !p[2] ? '/' : (p[2] === 'home' ? '' : url(BY[p[2]])) + '/' + p[1].toLowerCase().replace(' ', '-'); }
  var DEF = { home: 1, svc: 1, svc1: 1, svc2: 1, abt: 1, cta: 1 };
  var S = {}, O = {}, dev = 'desk', nodes = {};
  function defaults() { PG.forEach(function (p) { S[p[0]] = !!DEF[p[0]]; }); O = { hero: 'image', lazy: true, dims: true, defer: false, faq: false }; dev = 'desk'; }

  PG.forEach(function (p) {
    var li = K.el('li', p[2] ? null : 'sbd-root'), b = K.el('button', 'sbd-pg');
    b.type = 'button'; b.dataset.id = p[0];
    b.appendChild(K.el('i')); b.appendChild(K.el('span', null, p[1]));
    if (!p[2]) { b.setAttribute('aria-disabled', 'true'); b.appendChild(K.el('small', null, 'always on')); }
    li.appendChild(b); nodes[p[0]] = { li: li, b: b };
    if (!p[2]) { tree.appendChild(li); return; }
    var par = nodes[p[2]].li, ul = par.querySelector(':scope > ul');
    if (!ul) ul = par.appendChild(K.el('ul'));
    ul.appendChild(li);
  });
  function orphan(id) { var p = BY[id][2]; return !!p && S[id] && !S[p]; }

  /* ------------------------------------------------------------ the wireframe */
  function bars(host, spec) { spec.split(' ').forEach(function (w) { var i = K.el('i'); i.style.width = w + '%'; host.appendChild(i); }); return host; }
  function kids(id) { return PG.filter(function (p) { return p[2] === id && S[p[0]]; }); }
  var SEC = {
    nav: ['Menu', function (s) {
      s.appendChild(K.el('b', 'sbd-logo'));
      var m = K.el('span', 'sbd-menu');
      PG.forEach(function (p) { if (p[2] === 'home' && S[p[0]] && p[0] !== 'cta') m.appendChild(K.el('span', null, p[1])); });
      s.appendChild(m); s.appendChild(K.el('span', 'sbd-burger'));
      if (S.cta) s.appendChild(K.el('em', null, 'Contact'));
    }],
    hero: ['Hero', function (s) {
      s.classList.add('is-' + O.hero);
      var c = bars(K.el('div', 'sbd-copy'), '78 56 90 70'); c.appendChild(K.el('em', null, 'Get a quotation')); s.appendChild(c);
      if (O.hero !== 'text') { var m = K.el('div', 'sbd-media'); if (O.hero === 'video') { m.appendChild(K.el('span', 'sbd-play')); m.appendChild(K.el('u')); } s.appendChild(m); }
      var lcp = K.$(O.hero === 'text' ? '.sbd-copy i' : '.sbd-media', s); lcp.classList.add('is-lcp');
    }],
    svc: ['Services', function (s) {
      bars(s, '34');
      var g = K.el('div', 'sbd-cards'), list = kids('svc');
      (list.length ? list : [['', 'Our services']]).forEach(function (p) { var c = K.el('div', 'sbd-card'); c.appendChild(K.el('span', 'sbd-ic')); c.appendChild(K.el('b', null, p[1])); bars(c, '90 64'); g.appendChild(c); });
      s.appendChild(g);
    }],
    ind: ['Industries', function (s) {
      bars(s, '30');
      var g = K.el('div', 'sbd-tiles'), list = kids('ind');
      (list.length ? list : [['', 'Industries we serve']]).forEach(function (p) { var c = K.el('div', 'sbd-tile'); c.appendChild(K.el('b', null, p[1])); g.appendChild(c); });
      s.appendChild(g);
    }],
    abt: ['About', function (s) {
      s.appendChild(K.el('div', 'sbd-pic'));
      var c = bars(K.el('div', 'sbd-copy'), '44 92 84 60');
      if (S.team) c.appendChild(K.el('span', 'sbd-faces'));
      s.appendChild(c);
    }],
    faq: ['FAQ', function (s) { bars(s, '24'); for (var i = 0; i < 3; i++) s.appendChild(bars(K.el('div', 'sbd-qarow'), String([72, 60, 66][i]))); }],
    blog: ['Blog', function (s) {
      bars(s, '28');
      var g = K.el('div', 'sbd-cards');
      for (var i = 0; i < 3; i++) { var c = K.el('div', 'sbd-card sbd-post'); c.appendChild(K.el('span', 'sbd-thumb')); bars(c, '88 60'); g.appendChild(c); }
      s.appendChild(g);
    }],
    form: ['Contact form', function (s) {
      bars(s, '36');
      var f = K.el('div', 'sbd-form');
      ['Name', 'Company', 'Email', 'Interest'].forEach(function (l) { f.appendChild(K.el('span', null, l)); });
      f.appendChild(K.el('em', null, 'Send enquiry'));
      s.appendChild(f);
    }],
    foot: ['Footer', function (s) {
      var n = PG.filter(function (p) { return S[p[0]] && !orphan(p[0]); }).length;
      for (var i = 0; i < 3; i++) s.appendChild(bars(K.el('div'), '70 52 60'));
      s.appendChild(K.el('small', null, n + ' pages linked'));
    }]
  };
  var secEls = {};
  function wantSecs() {
    var w = ['nav', 'hero'];
    if (S.svc) w.push('svc'); if (S.ind) w.push('ind'); if (S.abt) w.push('abt'); if (O.faq) w.push('faq');
    if (S.blog) w.push('blog'); if (S.cta) w.push('form'); w.push('foot');
    return w;
  }
  var IMGSEC = { svc: 1, ind: 1, abt: 1, blog: 1 };
  function renderPage(focus, shift) {
    var want = wantSecs(), before = {};
    Object.keys(secEls).forEach(function (k) { before[k] = secEls[k].offsetTop; });
    Object.keys(secEls).forEach(function (k) { if (want.indexOf(k) < 0) { secEls[k].remove(); delete secEls[k]; } });
    var fresh = [];
    want.forEach(function (k) {
      var s = secEls[k];
      if (!s) { s = secEls[k] = K.el('div', 'sbd-sec sbd-s-' + k); fresh.push(s); }
      s.textContent = ''; s.className = 'sbd-sec sbd-s-' + k;
      s.appendChild(K.el('u', 'sbd-tag', SEC[k][0]));
      SEC[k][1](s);
      pageEl.appendChild(s);                                          // appending in order keeps the order
    });
    if (!K.reduce) {
      want.forEach(function (k) {
        var s = secEls[k];
        if (fresh.indexOf(s) >= 0) { K.restart(s, 'is-new'); return; }
        var d = before[k] - s.offsetTop;
        if (Math.abs(d) > .5) { s.style.transition = 'none'; s.style.transform = 'translateY(' + d + 'px)'; void s.offsetWidth; s.style.transition = ''; s.style.transform = ''; }
        if (shift && !O.dims && (IMGSEC[k] || k === 'hero')) K.restart(s, 'is-shift');
      });
    }
    if (focus && secEls[focus]) {
      var top = Math.max(0, secEls[focus].offsetTop - 14);
      if (Math.abs(scroller.scrollTop - top) > 4) scroller.scrollTo({ top: top, behavior: K.reduce ? 'auto' : 'smooth' });
    }
  }

  /* ------------------------------------------------------------ Core Web Vitals (illustrative) */
  // [key, label, unit, max, good, poor, description]
  var GV = [['lcp', 'LCP', 's', 6, 2.5, 4, 'Largest Contentful Paint: when the biggest element in view has rendered. Good at 2.5 s or less.'],
    ['cls', 'CLS', '', .4, .1, .25, 'Cumulative Layout Shift: how much the page jumps while it loads. Good at 0.1 or less.'],
    ['inp', 'INP', 'ms', 800, 200, 500, 'Interaction to Next Paint: how fast the page answers a tap or click. Good at 200 ms or less.']];
  function metrics() {
    var m = dev === 'mob', img = 0;
    Object.keys(IMGSEC).forEach(function (k) { if (S[k]) img++; });
    var h = O.hero;
    return {
      lcp: (m ? 1.4 : .8) + (h === 'video' ? (m ? 3 : 1.7) : h === 'image' ? (m ? .8 : .45) : 0) + img * (O.lazy ? .03 : (m ? .3 : .16)) + (O.defer ? 0 : (m ? .55 : .25)),
      cls: .01 + (O.dims ? 0 : .05 * img + (h === 'text' ? 0 : .07) + (h === 'video' ? .04 : 0)),
      inp: (m ? 140 : 70) + (O.defer ? 0 : (m ? 270 : 150)) + (O.faq ? 15 : 0) + (S.cta ? 10 : 0)
    };
  }
  function grade(v, g) { return v <= g[4] ? 0 : v <= g[5] ? 1 : 2; }
  var GRADE = ['Good', 'Needs work', 'Poor'], gEls = {};
  function fmt(k, v) { return k === 'lcp' ? v.toFixed(1) + ' s' : k === 'cls' ? v.toFixed(2) : Math.round(v) + ' ms'; }
  function arc(a0, a1, r) {
    var p = function (a) { return [50 + r * Math.cos(Math.PI * (1 - a)), 50 - r * Math.sin(Math.PI * (1 - a))]; };
    var s = p(a0), e = p(a1);
    return 'M' + s[0].toFixed(2) + ' ' + s[1].toFixed(2) + 'A' + r + ' ' + r + ' 0 0 1 ' + e[0].toFixed(2) + ' ' + e[1].toFixed(2);
  }
  GV.forEach(function (g) {
    var box = K.el('div', 'sbd-g'); box.tabIndex = 0; box.setAttribute('role', 'img');
    var sv = K.svg('svg', { viewBox: '0 0 100 58', 'aria-hidden': 'true' });
    [[0, g[4] / g[3], 'g0'], [g[4] / g[3], g[5] / g[3], 'g1'], [g[5] / g[3], 1, 'g2']].forEach(function (z) { sv.appendChild(K.svg('path', { d: arc(z[0] + .006, z[1] - .006, 40), 'class': 'sbd-z ' + z[2] })); });
    var nd = K.svg('g', { 'class': 'sbd-needle' });
    nd.appendChild(K.svg('path', { d: 'M50 50L14 50', 'class': 'sbd-nl' })); nd.appendChild(K.svg('circle', { cx: 50, cy: 50, r: 4.2 }));
    sv.appendChild(nd); box.appendChild(sv);
    var v = K.el('b', null, '0'), st = K.el('small', null, '');
    box.appendChild(K.el('span', 'sbd-gl', g[1])); box.appendChild(v); box.appendChild(st);
    gWrap.appendChild(box); gEls[g[0]] = { box: box, needle: nd, v: v, st: st, g: g };
    box.addEventListener('pointerenter', function () { gTip(g); }); box.addEventListener('focus', function () { gTip(g); });
    box.addEventListener('pointerleave', tip.hide); box.addEventListener('blur', tip.hide);
  });
  function gTip(g) { var b = K.box(gEls[g[0]].box, root); tip.show([g[1] + ' · ' + fmt(g[0], lastM[g[0]]) + ' · ' + GRADE[grade(lastM[g[0]], g)], g[6], 'Illustrative estimate for this build, not a measurement.'], b.cx, b.b, true); }
  var lastM = null;
  function renderVitals(label) {
    var M = metrics();
    GV.forEach(function (g) {
      var e = gEls[g[0]], v = M[g[0]], gr = grade(v, g);
      e.needle.style.transform = 'rotate(' + (K.clamp(v / g[3], 0, 1) * 180).toFixed(1) + 'deg)';
      e.v.textContent = fmt(g[0], v); e.st.textContent = GRADE[gr];
      e.box.className = 'sbd-g is-' + gr;
      e.box.setAttribute('aria-label', g[1] + ' ' + fmt(g[0], v) + ', ' + GRADE[gr] + ' (illustrative)');
    });
    if (label && lastM) {
      var best = null;
      GV.forEach(function (g) { var d = Math.abs(M[g[0]] - lastM[g[0]]) / g[4]; if (d > .02 && (!best || d > best[1])) best = [g, d]; });
      var li = K.el('li');
      K.$$('.is-hint', why).forEach(function (h) { h.remove(); });
      li.appendChild(K.el('b', null, label));
      if (best) {
        var g = best[0], up = M[g[0]] > lastM[g[0]];
        li.appendChild(K.el('span', null, g[1] + ' ' + fmt(g[0], lastM[g[0]]) + ' → ' + fmt(g[0], M[g[0]])));
        li.className = up ? 'is-worse' : 'is-better';
      } else li.appendChild(K.el('span', null, 'no change to the vitals'));
      why.insertBefore(li, why.firstChild);
      var rows = K.$$('li', why); while (rows.length > 2) rows.pop().remove();
    }
    lastM = M;
    return M;
  }

  /* ------------------------------------------------------------ SEO checks */
  var seoRows = [];
  function checks(M) {
    var on = PG.filter(function (p) { return S[p[0]]; }), n = on.length;
    var orph = on.filter(function (p) { return orphan(p[0]); });
    var types = ['Organization', 'WebSite']; if (n > 1) types.push('BreadcrumbList'); if (O.faq) types.push('FAQPage'); if (S.blog) types.push('BlogPosting');
    var gr = GV.map(function (g) { return grade(M[g[0]], g); }), worst = Math.max.apply(null, gr);
    var weak = GV.filter(function (g, i) { return gr[i] > 0; }).map(function (g) { return g[1]; });
    return [
      ['ok', 'Titles and meta descriptions', n + ' of ' + n + ' pages, each one unique'],
      ['ok', 'One H1 per page', 'Checked on every page template'],
      ['ok', 'XML sitemap', n + ' URLs listed, linked from robots.txt'],
      [orph.length ? 'no' : 'ok', 'Internal links', orph.length ? orph.map(function (p) { return p[1]; }).join(', ') + ': orphan page, its parent is off' : 'Every page reachable from the menu'],
      ['ok', 'Structured data', types.join(' · ')],
      [O.dims ? 'ok' : 'warn', 'Images: sizes and alt text', O.dims ? 'Width, height and alt text on every image' : 'Sizes not reserved: the layout jumps as images load'],
      [S.cta ? 'ok' : 'no', 'Enquiry path', S.cta ? 'Form on Contact and Home, sent to the CRM' : 'No contact page: enquiries have nowhere to go'],
      [worst ? 'warn' : 'ok', 'Core Web Vitals', worst ? weak.join(' and ') + ' outside the good range (' + (dev === 'mob' ? 'mobile' : 'desktop') + ')' : 'All three in the good range (' + (dev === 'mob' ? 'mobile' : 'desktop') + ')']
    ];
  }
  function renderSeo(M) {
    checks(M).forEach(function (c, i) {
      var r = seoRows[i];
      if (!r) {
        var li = K.el('li'), ic = K.el('i'), t = K.el('span');
        t.appendChild(K.el('b')); t.appendChild(K.el('small')); li.appendChild(ic); li.appendChild(t); seoList.appendChild(li);
        r = seoRows[i] = { li: li, ic: ic, b: K.$('b', t), s: K.$('small', t), st: '' };
      }
      if (r.st !== c[0]) { r.ic.innerHTML = ICO[c[0]]; r.li.className = 'is-' + c[0]; if (r.st) K.restart(r.li, 'is-flash'); r.st = c[0]; }
      r.b.textContent = c[1]; r.s.textContent = c[2];
    });
  }

  /* ------------------------------------------------------------ render everything */
  function renderTree() {
    PG.forEach(function (p) {
      var n = nodes[p[0]], on = !!S[p[0]], orph = orphan(p[0]);
      n.li.classList.toggle('is-on', on); n.li.classList.toggle('is-orphan', orph);
      if (p[2]) { n.b.setAttribute('aria-pressed', String(on)); n.b.setAttribute('aria-label', p[1] + (on ? ', on the site' : ', not on the site') + (orph ? ', orphan page' : '')); }
    });
    root.classList.toggle('is-noform', !S.cta);
  }
  function render(label, focus, shift) {
    renderTree(); renderPage(focus, shift);
    var M = renderVitals(label); renderSeo(M);
    frame.classList.toggle('is-mob', dev === 'mob');
    K.$$('[data-dev]', root).forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.dev === dev)); });
    K.$$('[data-hero]', root).forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.hero === O.hero)); });
    K.$$('[data-opt]', root).forEach(function (b) { b.setAttribute('aria-checked', String(!!O[b.dataset.opt])); });
  }

  /* ------------------------------------------------------------ controls */
  var touched = false, intro = [];
  function user() { touched = true; intro.forEach(clearTimeout); intro = []; }
  tree.addEventListener('click', function (e) {
    var b = e.target.closest('.sbd-pg'); if (!b || !b.dataset.id || b.getAttribute('aria-disabled') === 'true') return;
    user(); var id = b.dataset.id; S[id] = !S[id];
    var sec = { svc: 'svc', svc1: 'svc', svc2: 'svc', svc3: 'svc', ind: 'ind', ind1: 'ind', ind2: 'ind', abt: 'abt', team: 'abt', blog: 'blog', cta: 'form' }[id];
    render(BY[id][1] + (S[id] ? ' added' : ' removed'), S[id] ? sec : null, true);
  });
  function treeTip(e) {
    var b = e.target.closest('.sbd-pg'); if (!b) return;
    var p = BY[b.dataset.id], bx = K.box(b, root), on = S[p[0]];
    tip.show([p[1] + ' · ' + url(p), !on ? 'Not on the site: click to add it' : orphan(p[0]) ? 'Orphan: nothing links here while ' + BY[p[2]][1] + ' is off' : p[2] ? 'In the menu, the XML sitemap and the breadcrumbs' : 'The home page, always on'], bx.cx, bx.y);
  }
  tree.addEventListener('pointerover', treeTip); tree.addEventListener('focusin', treeTip); tree.addEventListener('focusout', tip.hide);
  tree.addEventListener('pointerout', function (e) { if (!e.relatedTarget || !tree.contains(e.relatedTarget)) tip.hide(); });
  K.$$('[data-hero]', root).forEach(function (b) { b.addEventListener('click', function () { user(); O.hero = b.dataset.hero; render(b.textContent + ' hero', 'hero', true); }); });
  var OPTL = { lazy: 'Lazy-loading', dims: 'Reserved image sizes', defer: 'Deferred scripts', faq: 'FAQ section' };
  K.$$('[data-opt]', root).forEach(function (b) {
    b.addEventListener('click', function () { user(); var k = b.dataset.opt; O[k] = !O[k]; render(OPTL[k] + (O[k] ? ' on' : ' off'), k === 'faq' && O[k] ? 'faq' : null, k === 'dims'); });
  });
  K.$$('[data-dev]', root).forEach(function (b) { b.addEventListener('click', function () { user(); dev = b.dataset.dev; render(b.textContent + ' preview'); }); });

  /* ------------------------------------------------------------ enquiries into Odoo CRM */
  // source: [label, utm_source, utm_medium, campaign, colour]
  var SRC = { g: ['Google Ads', 'google', 'cpc', 'services-sg', 'var(--tok-stock)'], l: ['LinkedIn', 'linkedin', 'social', 'q4-content', 'var(--tok-make)'],
    n: ['Newsletter', 'newsletter', 'email', 'monthly-news', 'var(--tok-pay)'], d: ['Direct', '', '', '', 'var(--tok-buy)'] };
  var SK = ['g', 'l', 'n', 'd'];
  var WHO = [['Reyes Trading', 'PH', 'Consulting'], ['Koh Interiors', 'SG', 'Installation'], ['Lee Logistics', 'SG', 'Maintenance'], ['Nguyen Foods', 'SG', 'Consulting'],
    ['Santos Retail', 'PH', 'Installation'], ['Ong Precision', 'SG', 'Consulting'], ['Cruz Builders', 'PH', 'Maintenance'], ['Wong Studio', 'SG', 'Installation']];
  var TEAM = { SG: 'Sales SG', PH: 'Sales PH' };
  var MEM, K0 = ['enq', 'lead', 'spam', 'dup', 'act'], kv, bySrc, seq = 0, pick = 'g', queue = [], live = [], RUN = 7000, runAt = 0, lastSec = -1, nextSpawn = 0;
  var kEls = {}; K.$$('[data-k]', root).forEach(function (d) { kEls[d.dataset.k] = d; });
  var memRows = [], srcRows = {};
  function resetCrm() {
    MEM = [{ n: 'A. Lim', t: 'SG', cap: 10, load: 4 }, { n: 'M. Chua', t: 'SG', cap: 8, load: 3 }, { n: 'R. Santos', t: 'PH', cap: 8, load: 2 }];
    kv = {}; K0.forEach(function (k) { kv[k] = 0; kEls[k].textContent = '0'; kEls[k].dataset.v = 0; });
    bySrc = { g: 0, l: 0, n: 0, d: 0 }; seq = 0; queue = []; live.forEach(function (t) { t.el.remove(); }); live = [];
    queueEl.textContent = ''; actsEl.textContent = ''; qBadge.textContent = '';
    actsEl.appendChild(K.el('li', 'sbd-empty', 'Calls appear after assignment'));
    sts.forEach(function (s) { s.d.textContent = s.base; s.el.classList.remove('is-hit', 'is-bad'); });
    teamEl.textContent = ''; memRows = MEM.map(function (m) {
      var li = K.el('li'), bar = K.el('span', 'sbd-cap'), fill = K.el('i'), n = K.el('em');
      li.appendChild(K.el('b', null, m.n)); li.appendChild(K.el('small', null, TEAM[m.t])); bar.appendChild(fill); li.appendChild(bar); li.appendChild(n); teamEl.appendChild(li);
      return { li: li, fill: fill, n: n };
    });
    srcEl.textContent = ''; SK.forEach(function (k) {
      var li = K.el('li'), bar = K.el('span', 'sbd-cap'), fill = K.el('i'), n = K.el('em', null, '0');
      li.style.setProperty('--c', SRC[k][4]); li.appendChild(K.el('b', null, SRC[k][0])); bar.appendChild(fill); li.appendChild(bar); li.appendChild(n); srcEl.appendChild(li);
      srcRows[k] = { fill: fill, n: n };
    });
    renderMem(); renderSrc(); renderQueue();
  }
  function bump(k) { kv[k]++; K.count(kEls[k], kv[k], 500); }
  function renderMem() { MEM.forEach(function (m, i) { memRows[i].fill.style.transform = 'scaleX(' + (m.load / m.cap).toFixed(3) + ')'; memRows[i].n.textContent = m.load + '/' + m.cap; memRows[i].li.classList.toggle('is-full', m.load >= m.cap); }); }
  function renderSrc() { var mx = Math.max(4, Math.max.apply(null, SK.map(function (k) { return bySrc[k]; }))); SK.forEach(function (k) { srcRows[k].fill.style.transform = 'scaleX(' + (bySrc[k] / mx).toFixed(3) + ')'; srcRows[k].n.textContent = bySrc[k]; }); }
  function renderQueue() {
    queueEl.textContent = '';
    if (!queue.length) queueEl.appendChild(K.el('li', 'sbd-empty', 'Queue empty'));
    queue.forEach(function (L) { var li = K.el('li'); li.style.setProperty('--c', SRC[L.src][4]); li.appendChild(K.el('b', null, L.co)); li.appendChild(K.el('small', null, L.cc + ' · ' + L.int)); queueEl.appendChild(li); });
    qBadge.textContent = queue.length ? String(queue.length) : '';
  }
  function say(i, text, bad) { var s = sts[i]; s.d.textContent = text; s.el.classList.toggle('is-bad', !!bad); if (!K.reduce) K.restart(s.el, 'is-hit'); }
  function act(L, m) {
    var li = K.el('li'); li.style.setProperty('--c', SRC[L.src][4]);
    K.$$('.sbd-empty', actsEl).forEach(function (x) { x.remove(); });
    li.appendChild(K.el('b', null, 'Call · ' + m.n)); li.appendChild(K.el('span', null, L.co + ' · due tomorrow'));
    actsEl.insertBefore(li, actsEl.firstChild);
    var rows = K.$$('li', actsEl); while (rows.length > 3) rows.pop().remove();
  }

  // geometry of the stations (cached; the loop only reads this)
  var G = [];
  function measure() {
    wire.setAttribute('viewBox', '0 0 ' + rail.offsetWidth + ' ' + rail.offsetHeight);
    G = sts.map(function (s) { var b = K.box(s.dot, rail); return [b.cx, b.cy]; });
    wire.textContent = '';
    if (G.length) wire.appendChild(K.svg('path', { d: K.path(G, 10), 'class': 'sbd-wl' }));
  }

  function makeLead(src) {
    var w = WHO[seq % WHO.length], n = seq++;
    return { src: src || 'glngldgn'.charAt(n % 8), co: w[0], cc: w[1], int: w[2], spam: n % 6 === 4, dup: n % 5 === 2 };
  }
  function spawn(src) {
    var L = makeLead(src);
    bump('enq');
    if (secEls.form && !K.reduce) K.restart(secEls.form, 'is-send');
    var s = SRC[L.src];
    say(0, s[1] ? 'utm_source=' + s[1] + ' · utm_medium=' + s[2] : 'No UTM tags: a direct visit');
    if (K.reduce) { flow(L); return; }
    var el = K.el('i', 'sbd-tok'); el.style.setProperty('--c', s[4]); toks.appendChild(el);
    L.el = el; L.at = 0; place(L, G[0][0], G[0][1]); live.push(L);
    hop(L, 1, 520);
  }
  function place(L, x, y) { L.el.style.transform = 'translate(' + (x - 6).toFixed(1) + 'px,' + (y - 6).toFixed(1) + 'px)'; }
  function hop(L, to, delay) { L.leg = { a: L.at, b: to, t0: performance.now() + (delay || 0), dur: 640 }; }
  function drop(L, cls) { L.el.classList.add(cls || 'is-gone'); L.dead = performance.now() + 700; }

  // what happens when a lead reaches a station (animated or not)
  function arrive(L, i) {
    var s = SRC[L.src];
    if (i === 1) {
      if (!S.cta) { say(1, 'No contact form on the site: the visitor leaves', true); if (L.el) drop(L, 'is-bad'); return false; }
      say(1, L.co + ' · interest: ' + L.int);
    } else if (i === 2) {
      if (L.spam) { say(2, 'Blocked: a bot filled the hidden field', true); bump('spam'); if (L.el) drop(L, 'is-bad'); return false; }
      say(2, 'Passed: hidden field empty, CAPTCHA fine');
    } else if (i === 3) {
      bump('lead'); bySrc[L.src]++; renderSrc();
      say(3, (s[1] ? s[1] + ' / ' + s[2] + ' · campaign ' + s[3] : 'No UTM tags: source left empty') + (L.dup ? ' · similar lead found' : ''));
      if (L.dup) { bump('dup'); if (L.el) L.el.classList.add('is-dup'); }
    } else if (i === 4) {
      queue.push(L); renderQueue(); if (L.el) L.el.classList.add('is-gone');
      say(4, queue.length + ' waiting for the next assignment run');
      return false;
    } else if (i === 5) {
      bump('act'); act(L, L.m);
      say(5, 'Call · ' + L.m.n + ' · due tomorrow');
      if (L.el) drop(L);
      return false;
    }
    return true;
  }
  function flow(L) { for (var i = 1; i < 5; i++) if (!arrive(L, i)) break; runAssign(); }  // reduced motion: straight through
  function runAssign() {
    MEM.forEach(function (m) { if (m.load > 1 && Math.random() < .35) m.load--; });   // the 30-day window rolls on
    if (!queue.length) { say(4, 'Assignment run: nothing waiting'); renderMem(); return; }
    var left = [];
    queue.forEach(function (L, j) {
      var team = MEM.filter(function (m) { return m.t === L.cc && m.load < m.cap; }).sort(function (a, b) { return (b.cap - b.load) - (a.cap - a.load); });
      if (!team.length) { left.push(L); return; }
      var m = team[0]; m.load++; L.m = m;
      say(4, TEAM[L.cc] + ' → ' + m.n + ' (' + m.load + '/' + m.cap + ')');
      if (K.reduce || !L.el) { arrive(L, 5); return; }
      L.el.classList.remove('is-gone'); L.at = 4; place(L, G[4][0], G[4][1]); hop(L, 5, j * 260);
    });
    if (left.length) say(4, left.length + ' left in the queue: the team is at capacity', true);
    queue = left; renderQueue(); renderMem();
  }

  var lp = K.loop(function (now) {
    if (now > nextSpawn) { spawn(null); nextSpawn = now + K.rnd(3200, 4600); }
    var left = runAt - now;
    if (left <= 0) { runAssign(); runAt = now + RUN; left = RUN; }
    ring.style.strokeDashoffset = (113.1 * (left / RUN)).toFixed(1);
    var sec = Math.ceil(left / 1000); if (sec !== lastSec) { lastSec = sec; runEl.textContent = 'next run in ' + sec + ' s'; }
    live = live.filter(function (L) {
      if (L.dead) { if (now > L.dead) { L.el.remove(); return false; } return true; }
      var g = L.leg; if (!g || now < g.t0) return true;
      var t = K.clamp((now - g.t0) / g.dur, 0, 1), e = K.ease.inOut(t), a = G[g.a], b = G[g.b];
      place(L, K.lerp(a[0], b[0], e), K.lerp(a[1], b[1], e) - Math.sin(Math.PI * t) * 7);
      if (t >= 1) { L.leg = null; L.at = g.b; if (arrive(L, g.b)) hop(L, g.b + 1, 260); }
      return true;
    });
  });

  q('[data-send]').addEventListener('click', function () { user(); if (!G.length) measure(); spawn(pick); nextSpawn = performance.now() + 5000; });
  K.$$('[data-from]', root).forEach(function (b) { b.addEventListener('click', function () { pick = b.dataset.from; K.$$('[data-from]', root).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); }); });
  function railTip(e) {
    var s = e.target.closest('.sbd-st'); if (!s) return;
    var b = K.box(sts[+s.dataset.st].dot, root);
    tip.show([K.$('b', s).textContent, s.dataset.tip], b.cx, b.y - 4);             // text only: the tip builds text nodes
  }
  sts.forEach(function (s) { s.el.tabIndex = 0; });
  rail.addEventListener('pointerover', railTip); rail.addEventListener('focusin', railTip); rail.addEventListener('focusout', tip.hide);
  rail.addEventListener('pointerout', function (e) { if (!e.relatedTarget || !rail.contains(e.relatedTarget)) tip.hide(); });
  q('[data-reset]').addEventListener('click', function () { user(); defaults(); scroller.scrollTop = 0; why.textContent = ''; lastM = null; render(); hint(); resetCrm(); runAt = performance.now() + RUN; });
  window.addEventListener('resize', function () { measure(); });

  function hint() { if (why.firstChild) return; var li = K.el('li', 'is-hint'); li.appendChild(K.el('b', null, 'Try it')); li.appendChild(K.el('span', null, 'switch on Defer third-party scripts, or pick the video hero')); why.appendChild(li); }
  defaults(); resetCrm();
  if (K.reduce) { render(); runEl.textContent = 'runs on a schedule'; [null, 'l', 'n', null, 'g'].forEach(function (s) { spawn(s); }); }
  else { PG.forEach(function (p) { S[p[0]] = p[0] === 'home'; }); O.hero = 'text'; render(); }
  hint();
  return {
    start: function (first) {
      measure();
      if (first && !touched && !K.reduce) {
        var steps = [['svc', 'Services added'], ['svc1', 'Consulting added'], ['svc2', 'Installation added'], ['hero', 'Image hero'], ['abt', 'About added'], ['cta', 'Contact added']];
        steps.forEach(function (s, i) {
          intro.push(setTimeout(function () {
            if (s[0] === 'hero') O.hero = 'image'; else S[s[0]] = true;
            render(s[1], { svc1: 'svc', svc2: 'svc', cta: 'form' }[s[0]] || s[0]);
            if (i === steps.length - 1) scroller.scrollTo({ top: 0, behavior: 'smooth' });
          }, 500 + i * 650));
        });
        nextSpawn = performance.now() + 500 + steps.length * 650 + 600; runAt = nextSpawn + 3200;
      } else if (!runAt) { runAt = performance.now() + RUN; }
      if (runAt < performance.now()) runAt = performance.now() + RUN;
      lp.on();
    },
    stop: function () { lp.off(); }
  };
});
