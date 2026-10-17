/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* Marketing page: an attribution Sankey. Five channels bring visits; visits become leads, MQLs, SQLs
   and won deals, with the losses at each stage. First touch, last touch and linear attribution
   re-weight the credit for the same people (flows stay balanced), the budget and conversion sliders
   drive the totals, cost per lead and cost per won deal. Particles show the flow. Sample figures. */
TN.demo('sankey', function (root, K) {
  var q = function (s) { return K.$(s, root); };
  var stage = q('.snk-stage'), svg = q('.snk-svg'), fx = q('.snk-fx'), ctx = fx.getContext('2d'), cap = q('.snk-cap'), tbody = q('.snk-tab tbody');
  var tip = K.tip(stage);
  // [name, colour, S$ per paid visit, share of the paid budget, organic visits, quality per step: lead, MQL, SQL, won]
  var CHN = [['Search', '#3167CA', 2.4, .45, 1800, [1, 1, 1, 1]], ['Social', '#7447D6', 1.1, .30, 600, [.6, .8, .9, .9]],
    ['Email', '#0E9384', .8, .05, 900, [1.3, 1.1, 1, 1]], ['Referral', '#D97B12', 0, 0, 450, [2.2, 1.4, 1.3, 1.4]], ['Events', '#C43D7A', 16, .2, 0, [9, .7, 1.1, 1.2]]];
  var RGB = CHN.map(function (c) { return [1, 3, 5].map(function (i) { return parseInt(c[1].substr(i, 2), 16); }); });
  // for people whose first touch was each channel: how their later touches split (Search, Social, Email, Referral, Events)
  var T = [[.4, .1, .3, .05, .15], [.3, .25, .25, .05, .15], [.2, .05, .55, .05, .15], [.15, .05, .3, .4, .1], [.15, .05, .35, .05, .4]];
  var STG = ['Visits', 'Leads', 'MQL', 'SQL', 'Won'], SINK = ['not MQL', 'not SQL', 'lost'];
  var MOD = { first: 'first touch', last: 'last touch', linear: 'linear' };
  var DEF = { budget: 10000, r1: 2.5, r2: 40, r3: 45, r4: 25 }, P = {}, model = 'first', R = null;
  var NL = 125, NN = 33, NT = 12, TAU = Math.PI * 2;

  /* ------------------------------------------------------------ the model */
  function calc() {
    var N = [[], [], [], [], []], sp = [];
    CHN.forEach(function (c, i) {
      sp[i] = P.budget * c[3];
      N[0][i] = c[4] + (c[2] ? sp[i] / c[2] : 0);
      N[1][i] = N[0][i] * Math.min(.8, P.r1 / 100 * c[5][0]);
      N[2][i] = N[1][i] * Math.min(1, P.r2 / 100 * c[5][1]);
      N[3][i] = N[2][i] * Math.min(1, P.r3 / 100 * c[5][2]);
      N[4][i] = N[3][i] * Math.min(1, P.r4 / 100 * c[5][3]);
    });
    function cred(c, s) {                                          // credit vector at stage s for people first touched by c
      var d = [0, 0, 0, 0, 0], j;
      if (model === 'first' || !s) { d[c] = 1; return d; }
      if (model === 'last') return T[c].slice();
      for (j = 0; j < 5; j++) d[j] = s * T[c][j] / (s + 1);
      d[c] += 1 / (s + 1); return d;
    }
    var B = [], Lk = [], D = [], tot = [], s, c, i, j;
    for (s = 0; s < 5; s++) {
      B[s] = [0, 0, 0, 0, 0]; tot[s] = 0;
      for (c = 0; c < 5; c++) { var cr = cred(c, s); tot[s] += N[s][c]; for (j = 0; j < 5; j++) B[s][j] += N[s][c] * cr[j]; }
    }
    for (s = 0; s < 4; s++) {
      Lk[s] = []; D[s] = [0, 0, 0, 0, 0];
      for (i = 0; i < 5; i++) Lk[s][i] = [0, 0, 0, 0, 0];
      for (c = 0; c < 5; c++) {
        var a = cred(c, s), b = cred(c, s + 1);
        for (i = 0; i < 5; i++) { D[s][i] += (N[s][c] - N[s + 1][c]) * a[i]; for (j = 0; j < 5; j++) Lk[s][i][j] += N[s + 1][c] * a[i] * b[j]; }
      }
    }
    return { N: N, B: B, Lk: Lk, D: D, tot: tot, sp: sp };
  }

  /* ------------------------------------------------------------ layout: flow axis u, cross axis v */
  var W = 800, H = 400, vert = false;
  // link kinds: channel→visit 0-4, lens (visit→lead) 5-29, stage links 30-104, losses 105-119, visits that leave 120-124
  var SRC = [], DST = [];
  for (var k = 0; k < NL; k++) {
    SRC[k] = k < 5 ? k : k < 30 ? (k - 5) / 5 | 0 : k < 105 ? ((k - 30) % 25) / 5 | 0 : k < 120 ? (k - 105) % 5 : k - 120;
    DST[k] = k < 5 ? k : k < 30 ? (k - 5) % 5 : k < 105 ? (k - 30) % 5 : SRC[k];
  }
  function geo(R) {
    var U = vert ? H : W, V = vert ? W : H;
    var a = vert ? 34 : 88, b = vert ? 26 : 74, t0 = vert ? 8 : 32, t1 = vert ? 42 : 46, gap = vert ? 5 : 7;
    var cu = [0, .16, .44, .63, .815, 1].map(function (f) { return a + f * (U - a - b - NT); });
    var Va = V - t0 - t1, H0 = Va - 4 * gap, k0 = H0 / R.tot[0], k1 = Va * .88 / R.tot[1], kk = [k0, k1, k1, k1];
    var L = new Float64Array(NL * 6), N = new Float64Array(NN * 3), s, i, j, c;
    function node(n, u, v, len) { N[n * 3] = u; N[n * 3 + 1] = v; N[n * 3 + 2] = len; }
    function link(n, us, ut, vs, vt, ws, wt) { var o = n * 6; L[o] = us; L[o + 1] = ut; L[o + 2] = vs; L[o + 3] = vt; L[o + 4] = ws; L[o + 5] = wt; }
    var v = t0, vv = t0 + 2 * gap;
    for (c = 0; c < 5; c++) {
      var len = R.N[0][c] * k0;
      node(c, cu[0], v, len); node(5 + c, cu[1], vv, len);
      link(c, cu[0] + NT, cu[1], v + len / 2, vv + len / 2, len, len);
      v += len + gap; vv += len;
    }
    for (s = 1; s < 5; s++) {
      var y = t0;
      for (j = 0; j < 5; j++) { var l2 = R.B[s][j] * k1; node(5 + s * 5 + j, cu[s + 1], y, l2); y += l2; }
      if (s > 1) node(28 + s, cu[s + 1], y + gap * 1.6, (R.tot[s - 1] - R.tot[s]) * k1);
    }
    for (s = 0; s < 4; s++) {
      var inC = [], sink = s ? N[(29 + s) * 3 + 1] : 0;
      for (j = 0; j < 5; j++) inC[j] = N[(5 + (s + 1) * 5 + j) * 3 + 1];
      for (i = 0; i < 5; i++) {
        var out = N[(5 + s * 5 + i) * 3 + 1];
        for (j = 0; j < 5; j++) {
          var val = R.Lk[s][i][j], ws = val * kk[s], wt = val * k1;
          link(s ? 30 + (s - 1) * 25 + i * 5 + j : 5 + i * 5 + j, cu[s + 1] + NT, cu[s + 2], out + ws / 2, inC[j] + wt / 2, ws, wt);
          out += ws; inC[j] += wt;
        }
        var dv = R.D[s][i] * kk[s];
        if (!s) link(120 + i, cu[1] + NT, cu[1] + NT + 34, out + dv / 2, out + dv / 2, dv, dv);
        else { link(105 + (s - 1) * 5 + i, cu[s + 1] + NT, cu[s + 2], out + dv / 2, sink + dv / 2, dv, dv); sink += dv; }
      }
    }
    return { L: L, N: N, cu: cu, t0: t0, V: V, zoom: k1 / k0 };
  }

  /* ------------------------------------------------------------ SVG scene */
  var NS = 'http://www.w3.org/2000/svg';
  var defs = K.svg('defs', {}), gLens = K.svg('g', {}), gLinks = K.svg('g', { 'class': 'snk-links' }), gNodes = K.svg('g', {}), gText = K.svg('g', { 'class': 'snk-txt' });
  var grads = CHN.map(function (c, i) {
    var g = K.svg('linearGradient', { id: 'snk-f' + i, x1: 0, y1: 0, x2: 1, y2: 0 });
    g.appendChild(K.svg('stop', { offset: 0, 'stop-color': c[1], 'stop-opacity': .42 })); g.appendChild(K.svg('stop', { offset: 1, 'stop-color': c[1], 'stop-opacity': 0 }));
    defs.appendChild(g); return g;
  });
  var lens = K.svg('path', { 'class': 'snk-lens' }); gLens.appendChild(lens);
  var paths = [], rects = [], hits = [];
  for (k = 0; k < NL; k++) {
    var p = K.svg('path', { 'class': 'snk-l' + (k >= 105 && k < 120 ? ' is-loss' : '') + (k >= 120 ? ' is-leave' : ''), fill: k >= 120 ? 'url(#snk-f' + SRC[k] + ')' : CHN[SRC[k]][1] });
    p.dataset.k = k; gLinks.appendChild(p); paths.push(p);
  }
  for (k = 0; k < NN; k++) {
    var r = K.svg('rect', { 'class': k >= 30 ? 'snk-sink' : 'snk-n', rx: 2, fill: k < 30 ? CHN[k < 5 ? k : (k - 5) % 5][1] : null });
    gNodes.appendChild(r); rects.push(r);
  }
  // focusable hit areas: five channels and five stages
  for (k = 0; k < 10; k++) {
    var h = K.svg('rect', { 'class': 'snk-hit', tabindex: 0, fill: 'transparent' }); h.dataset.h = k;
    h.setAttribute('aria-label', k < 5 ? CHN[k][0] + ' channel' : STG[k - 5] + ' stage'); gNodes.appendChild(h); hits.push(h);
  }
  function tx(cls) { var t = K.svg('text', { 'class': cls }); gText.appendChild(t); return t; }
  var chLab = CHN.map(function () { return tx('snk-cl'); }), stLab = STG.map(function () { return tx('snk-sl'); }), skLab = SINK.map(function () { return tx('snk-kl'); });
  var leaveLab = tx('snk-kl'), zoomLab = tx('snk-zl'), rtLab = [0, 1, 2].map(function () { return tx('snk-rl'); });
  [defs, gLens, gLinks, gNodes, gText].forEach(function (g) { svg.appendChild(g); });
  function span(t, a, b) { t.textContent = ''; var x = document.createElementNS(NS, 'tspan'); x.textContent = a; t.appendChild(x); if (b) { var y = document.createElementNS(NS, 'tspan'); y.setAttribute('class', 'snk-v'); y.textContent = ' ' + b; t.appendChild(y); } }

  function pt(u, v) { return (vert ? v.toFixed(1) + ' ' + u.toFixed(1) : u.toFixed(1) + ' ' + v.toFixed(1)); }
  function ribbon(L, o) {
    var us = L[o], ut = L[o + 1], m = (ut - us) / 2, a0 = L[o + 2] - L[o + 4] / 2, a1 = L[o + 3] - L[o + 5] / 2, b0 = L[o + 2] + L[o + 4] / 2, b1 = L[o + 3] + L[o + 5] / 2;
    return 'M' + pt(us, a0) + 'C' + pt(us + m, a0) + ' ' + pt(ut - m, a1) + ' ' + pt(ut, a1) + 'L' + pt(ut, b1) + 'C' + pt(ut - m, b1) + ' ' + pt(us + m, b0) + ' ' + pt(us, b0) + 'Z';
  }
  function place(t, u, v, anchor) { var xy = pt(u, v).split(' '); t.setAttribute('x', xy[0]); t.setAttribute('y', xy[1]); t.setAttribute('text-anchor', anchor); }
  function box(el, u, v, lu, lv) { el.setAttribute(vert ? 'y' : 'x', u.toFixed(1)); el.setAttribute(vert ? 'x' : 'y', v.toFixed(1)); el.setAttribute(vert ? 'height' : 'width', Math.max(0, lu).toFixed(1)); el.setAttribute(vert ? 'width' : 'height', Math.max(0, lv).toFixed(1)); }
  function spread(pos, min, hi) {                                  // keep labels apart along the cross axis
    var n = pos.length, i;
    for (i = 1; i < n; i++) pos[i] = Math.max(pos[i], pos[i - 1] + min);
    if (pos[n - 1] > hi) { pos[n - 1] = hi; for (i = n - 2; i >= 0; i--) pos[i] = Math.min(pos[i], pos[i + 1] - min); }
    return pos;
  }
  function draw(G) {
    var L = G.L, N = G.N, i, o;
    for (i = 0; i < NL; i++) { o = i * 6; paths[i].setAttribute('d', L[o + 4] < .08 && L[o + 5] < .08 ? '' : ribbon(L, o)); }
    for (i = 0; i < NN; i++) { o = i * 3; box(rects[i], N[o], N[o + 1], NT, N[o + 2]); }
    for (i = 0; i < 5; i++) box(hits[i], N[i * 3] - 2, N[i * 3 + 1] - 2, NT + 4, N[i * 3 + 2] + 4);
    for (i = 0; i < 5; i++) {                                      // a stage spans its five bands
      var f = 5 + i * 5, v0 = N[f * 3 + 1], v1 = N[(f + 4) * 3 + 1] + N[(f + 4) * 3 + 2];
      box(hits[5 + i], N[f * 3] - 3, v0 - 2, NT + 6, v1 - v0 + 4);
      if (vert) place(stLab[i], N[f * 3] - 6, v0, 'start'); else place(stLab[i], N[f * 3] + NT / 2, v0 - 9, 'middle');
    }
    var cp = spread([0, 1, 2, 3, 4].map(function (c) { return N[c * 3 + 1] + N[c * 3 + 2] / 2; }), vert ? 58 : 13, G.V - (vert ? 30 : 14));
    chLab.forEach(function (t, c) { if (vert) { t.setAttribute('x', cp[c].toFixed(1)); t.setAttribute('y', (N[c * 3] - 8).toFixed(1)); t.setAttribute('text-anchor', 'middle'); } else place(t, N[c * 3] - 7, cp[c] + 4, 'end'); });
    for (i = 0; i < 3; i++) { o = (30 + i) * 3; if (vert) place(skLab[i], N[o] + NT / 2 + 4, N[o + 1] + N[o + 2] + 5, 'start'); else place(skLab[i], N[o] + NT / 2, N[o + 1] + N[o + 2] + 14, 'middle'); }
    o = 5 * 3; var vEnd = N[(9) * 3 + 1] + N[9 * 3 + 2];
    place(leaveLab, N[o] + NT / 2, vEnd + 16, 'middle');
    // the lens: visits (small scale) open out into leads (large scale)
    var u0 = N[o] + NT, u1 = N[10 * 3], a0 = N[o + 1], a1 = vEnd, b0 = N[10 * 3 + 1], b1 = N[14 * 3 + 1] + N[14 * 3 + 2], m = (u1 - u0) / 2;
    lens.setAttribute('d', 'M' + pt(u0, a0) + 'C' + pt(u0 + m, a0) + ' ' + pt(u1 - m, b0) + ' ' + pt(u1, b0) + 'L' + pt(u1, b1) + 'C' + pt(u1 - m, b1) + ' ' + pt(u0 + m, a1) + ' ' + pt(u0, a1) + 'Z');
    if (vert) place(zoomLab, (u0 + u1) / 2 + 4, G.V - 2, 'end'); else place(zoomLab, (u0 + u1) / 2, G.t0 - 9, 'middle');
    for (i = 0; i < 3; i++) {
      var ua = N[(10 + i * 5) * 3] + NT, ub = N[(15 + i * 5) * 3];
      if (vert) place(rtLab[i], (ua + ub) / 2 + 4, G.V - 2, 'end'); else place(rtLab[i], (ua + ub) / 2, G.t0 - 9, 'middle');
    }
  }

  /* ------------------------------------------------------------ numbers */
  function f0(v) { return Math.round(v).toLocaleString('en-SG'); }
  function sgd(v) { return 'S$' + Math.round(v).toLocaleString('en-SG'); }
  var kEls = {}; K.$$('[data-k]', root).forEach(function (n) { kEls[n.dataset.k] = n; });
  var rows = CHN.map(function (c) {
    var tr = K.el('tr'), th = K.el('th'), sw = K.el('i', 'dm-sw'); sw.style.setProperty('--c', c[1]); th.scope = 'row'; th.appendChild(sw); th.appendChild(document.createTextNode(c[0]));
    tr.appendChild(th); var td = [0, 1, 2, 3].map(function () { var d = K.el('td'); tr.appendChild(d); return d; }); tbody.appendChild(tr); return td;
  });
  var first = null;
  function numbers() {
    var t = R.tot, i;
    K.count(kEls.v, t[0], 500); K.count(kEls.l, t[1], 500);
    K.count(kEls.w, t[4], 500, function (v) { return v.toFixed(1); });
    K.count(kEls.cpl, P.budget / t[1], 500, sgd); K.count(kEls.cpw, P.budget / t[4], 500, sgd);
    kEls.ms.textContent = f0(t[2]) + ' · ' + f0(t[3]);
    q('[data-t="model"]').textContent = MOD[model];
    rows.forEach(function (td, c) {
      td[0].textContent = R.sp[c] ? sgd(R.sp[c]) : 'organic';
      td[1].textContent = f0(R.B[1][c]); td[2].textContent = R.B[4][c].toFixed(1);
      td[3].textContent = R.sp[c] && R.B[4][c] > .05 ? sgd(R.sp[c] / R.B[4][c]) : '–';
    });
    span(stLab[0], 'Visits', f0(t[0]) + (vert ? ' · ' + f0(t[0] - t[1]) + ' leave' : ''));
    for (i = 1; i < 5; i++) span(stLab[i], STG[i], i === 4 ? t[4].toFixed(1) : f0(t[i]));
    chLab.forEach(function (tl, c) { tl.textContent = CHN[c][0]; });
    for (i = 0; i < 3; i++) skLab[i].textContent = f0(t[i + 1] - t[i + 2]) + ' ' + SINK[i];
    leaveLab.textContent = vert ? '' : f0(t[0] - t[1]) + ' visits leave';
    for (i = 0; i < 3; i++) rtLab[i].textContent = Math.round(t[i + 2] / t[i + 1] * 100) + '%';
    // compare the current model with first touch for the caption
    var won = R.B[4], best = 0;
    for (i = 1; i < 5; i++) if (won[i] > won[best]) best = i;
    var txt = MOD[model].charAt(0).toUpperCase() + MOD[model].slice(1) + ': ' + CHN[best][0] + ' is credited with ' + won[best].toFixed(1) + ' of ' + t[4].toFixed(1) + ' won deals.';
    if (model !== 'first' && first) {
      var d = won.map(function (w, c) { return w - first[c]; }), up = 0, dn = 0;
      for (i = 1; i < 5; i++) { if (d[i] > d[up]) up = i; if (d[i] < d[dn]) dn = i; }
      txt += ' Against first touch, ' + CHN[up][0] + ' gains ' + d[up].toFixed(1) + ' and ' + CHN[dn][0] + ' loses ' + (-d[dn]).toFixed(1) + '.';
    } else txt += ' Credit stays with the channel that brought the first visit.';
    cap.textContent = txt;
  }

  /* ------------------------------------------------------------ motion: morphs and particles */
  var cur = null, tw = null, parts = [], accs = new Float64Array(NL), rate = new Float64Array(NL), dpr = 1;
  function refresh(dur) {
    var mm = model; model = 'first'; first = calc().B[4]; model = mm;
    R = calc(); var G = geo(R);
    numbers();
    zoomLab.textContent = (vert ? '×' : 'leads onward ×') + Math.round(G.zoom);
    if (!cur || K.reduce || !dur) { cur = G; tw = null; draw(cur); return; }
    tw = { a: { L: cur.L.slice(), N: cur.N.slice() }, b: G, t0: performance.now(), d: dur };
    cur = { L: cur.L.slice(), N: cur.N.slice(), cu: G.cu, t0: G.t0, V: G.V, zoom: G.zoom };
    lp.on();
  }
  function rates() {
    var L = cur.L, tot = 0, i;
    for (i = 0; i < NL; i++) { var w = (L[i * 6 + 4] + L[i * 6 + 5]) / 2; rate[i] = w < .15 ? 0 : Math.min(i >= 120 ? 4 : 9, Math.max(.35, w * .26)); tot += rate[i]; }
    if (tot > 130) for (i = 0; i < NL; i++) rate[i] *= 130 / tot;
  }
  function size() {
    W = stage.clientWidth; vert = W < 560; root.classList.toggle('is-vert', vert); H = stage.clientHeight;
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    dpr = Math.min(2, window.devicePixelRatio || 1); fx.width = W * dpr; fx.height = H * dpr;
    grads.forEach(function (g) { g.setAttribute('x2', vert ? 0 : 1); g.setAttribute('y2', vert ? 1 : 0); });
    parts = []; cur = null; if (R) refresh(0);
  }
  var lp = K.loop(function (now, dt) {
    var i, o;
    if (tw) {
      var t = K.clamp((now - tw.t0) / tw.d, 0, 1), e = K.ease.inOut(t);
      for (i = 0; i < NL * 6; i++) cur.L[i] = K.lerp(tw.a.L[i], tw.b.L[i], e);
      for (i = 0; i < NN * 3; i++) cur.N[i] = K.lerp(tw.a.N[i], tw.b.N[i], e);
      draw(cur); if (t >= 1) { cur = tw.b; tw = null; }
    }
    rates();
    for (i = 0; i < NL; i++) { accs[i] += rate[i] * dt; while (accs[i] >= 1) { accs[i]--; if (parts.length < 340) { o = i * 6; parts.push({ k: i, t: 0, o: K.rnd(-.82, .82), sp: 1 / Math.max(.9, Math.abs(cur.L[o + 1] - cur.L[o]) / (i >= 120 ? 40 : 105)), r: K.rnd(1.3, 2.3) }); } } }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    var L = cur.L;
    parts = parts.filter(function (p) {
      p.t += dt * p.sp; if (p.t >= 1) return false;
      var t = p.t, o2 = p.k * 6, h = t * t * (3 - 2 * t), mt = 1 - t;
      var um = (L[o2] + L[o2 + 1]) / 2, u = mt * mt * mt * L[o2] + 3 * t * mt * um + t * t * t * L[o2 + 1];
      var v = K.lerp(L[o2 + 2], L[o2 + 3], h) + p.o * K.lerp(L[o2 + 4], L[o2 + 5], h) / 2;
      var a = RGB[SRC[p.k]], b = RGB[DST[p.k]], al = p.k >= 105 ? .8 * (1 - t) : .9;
      ctx.fillStyle = 'rgba(' + (a[0] + (b[0] - a[0]) * h | 0) + ',' + (a[1] + (b[1] - a[1]) * h | 0) + ',' + (a[2] + (b[2] - a[2]) * h | 0) + ',' + al.toFixed(2) + ')';
      ctx.beginPath(); ctx.arc(vert ? v : u, vert ? u : v, p.r, 0, TAU); ctx.fill();
      return true;
    });
  });

  /* ------------------------------------------------------------ hover and focus */
  function linkTip(k) {
    var s = k < 5 ? -1 : k < 30 ? 0 : k < 105 ? 1 + ((k - 30) / 25 | 0) : k < 120 ? 1 + ((k - 105) / 5 | 0) : 0, i = SRC[k], j = DST[k], v;
    if (k < 5) return [CHN[i][0] + ' · ' + f0(R.N[0][i]) + ' visits', R.sp[i] ? sgd(R.sp[i]) + ' paid, plus ' + f0(CHN[i][4]) + ' organic' : 'Organic and partner referrals, no paid spend'];
    if (k >= 120) return [f0(R.D[0][i]) + ' ' + CHN[i][0] + ' visits leave', 'No form, no call: they leave without becoming a lead'];
    if (k >= 105) return [f0(R.D[s][i]) + ' ' + CHN[i][0] + ' ' + ['', 'leads', 'MQLs', 'SQLs'][s] + ' go no further', 'They stay in nurture or are marked lost in the CRM'];
    v = R.Lk[s][i][j];
    return [STG[s] + ' → ' + STG[s + 1] + ' · ' + (v < 10 ? v.toFixed(1) : f0(v)), (i === j ? 'Credited to ' + CHN[i][0] : CHN[i][0] + ' credit passes to ' + CHN[j][0]) + ' (' + MOD[model] + ')'];
  }
  function hitTip(h) {
    if (h < 5) return [CHN[h][0], f0(R.N[0][h]) + ' visits · ' + (R.sp[h] ? sgd(R.sp[h]) + ' paid' : 'organic') + ' · ' + R.B[4][h].toFixed(1) + ' won deals credited (' + MOD[model] + ')'];
    var s = h - 5, t = R.tot[s];
    return [STG[s] + ' · ' + (s === 4 ? t.toFixed(1) : f0(t)), CHN.map(function (c, j) { return c[0] + ' ' + Math.round(R.B[s][j] / t * 100) + '%'; }).join(' · '), s ? 'Share of the credit, ' + MOD[model] : 'Visits by channel'];
  }
  function at(e) { var r = stage.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }
  svg.addEventListener('pointermove', function (e) {
    var t = e.target, k = t.dataset ? t.dataset.k : null, h = t.dataset ? t.dataset.h : null, xy = at(e);
    if (k != null) { svg.classList.add('is-peek'); paths.forEach(function (p) { p.classList.toggle('is-hot', p === t); }); tip.show(linkTip(+k), xy[0], xy[1] - 10); }
    else if (h != null) tip.show(hitTip(+h), xy[0], xy[1] - 10);
    else { svg.classList.remove('is-peek'); tip.hide(); }
  });
  svg.addEventListener('pointerleave', function () { svg.classList.remove('is-peek'); tip.hide(); });
  hits.forEach(function (h, i) {
    h.addEventListener('focus', function () { var b = h.getBBox(); tip.show(hitTip(i), b.x + b.width / 2, b.y); });
    h.addEventListener('blur', tip.hide);
  });

  /* ------------------------------------------------------------ controls */
  // the first-view tour through the models: [model, due time]; it pauses while the demo is stopped,
  // so its timers never restart the particle loop off-screen
  var touched = false, cyc = [], tour = [], tourPause = 0;
  function user() { touched = true; cyc.forEach(clearTimeout); cyc = []; tour = []; }
  function arm(now) {
    cyc.forEach(clearTimeout);
    cyc = tour.map(function (s) { return setTimeout(function () { tour.splice(tour.indexOf(s), 1); setModel(s[0], 1100); }, Math.max(0, s[1] - now)); });
  }
  function setModel(m, dur) { model = m; K.$$('[data-m]', root).forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.m === m)); }); refresh(dur); }
  K.$$('[data-m]', root).forEach(function (b) { b.addEventListener('click', function () { user(); setModel(b.dataset.m, 900); }); });
  var sliders = K.$$('input[type="range"]', root);
  function out() {
    sliders.forEach(function (s) {
      var key = s.id.slice(4); q('[data-o="' + key + '"]').textContent = key === 'budget' ? sgd(P.budget) : P[key] + '%';
      s.style.setProperty('--p', ((s.value - s.min) / (s.max - s.min) * 100).toFixed(1) + '%');
    });
  }
  sliders.forEach(function (s) {
    s.addEventListener('input', function () { user(); P[s.id.slice(4)] = parseFloat(s.value); out(); refresh(220); });
  });
  q('[data-reset]').addEventListener('click', function () {
    user(); Object.keys(DEF).forEach(function (k) { P[k] = DEF[k]; }); sliders.forEach(function (s) { s.value = P[s.id.slice(4)]; }); out(); setModel('first', 700);
  });
  window.addEventListener('resize', function () { var w = stage.clientWidth; if (w !== W) size(); });

  Object.keys(DEF).forEach(function (k) { P[k] = DEF[k]; });
  out(); R = calc(); size();
  return {
    start: function (first) {
      if (stage.clientWidth !== W) size();
      var now = performance.now();
      if (first && !touched && !K.reduce) tour = ['last', 'linear', 'first'].map(function (m, i) { return [m, now + 3200 + i * 4200]; });
      else if (tourPause) tour.forEach(function (s) { s[1] += now - tourPause; });
      tourPause = 0; arm(now);
      lp.on();
    },
    stop: function () { lp.off(); cyc.forEach(clearTimeout); cyc = []; if (tour.length && !tourPause) tourPause = performance.now(); }
  };
});
