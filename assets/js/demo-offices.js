/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* Company page: three offices, one team. An abstract network map of Singapore HQ, the Taguig City
   development and consulting hub and the Ho Chi Minh City AI engineering hub; step through an engagement and watch the work move between
   the offices (packets on the arcs), with who does what at each step. */
TN.demo('offices', function (root, K) {
  var stage = K.$('.dof-stage', root), svg = K.$('.dof-svg', root);
  var offices = {}; K.$$('.dof-office[data-o]', root).forEach(function (el) { offices[el.dataset.o] = { el: el, x: +el.dataset.x, y: +el.dataset.y }; });
  var steps = K.$$('.dof-steps [data-step]', root), cards = K.$$('.dof-card', root), roster = K.$$('.dof-roster [data-o]', root);
  var W = 1, H = 1, arcs = {}, packets = [], cur = -1, auto = true, nextAt = 0, nextPkt = 0;
  // who is on each step, and which way the work flows
  var PLAN = [
    { on: ['sg', 'ph'], flow: [['client', 'sg', 'Process walk-through'], ['client', 'ph', 'How orders run today'], ['sg', 'ph', 'Scope draft']] },
    { on: ['ph'], flow: [['sg', 'ph', 'Signed scope'], ['ph', 'client', 'Module on staging'], ['client', 'ph', 'Review notes']] },
    { on: ['ph', 'vn'], flow: [['ph', 'client', 'Bank feed connected'], ['client', 'ph', 'Field mapping'], ['vn', 'ph', 'AI assistant, if in scope']] },
    { on: ['ph', 'sg'], flow: [['ph', 'client', 'Training on your data'], ['sg', 'client', 'Quick-reference guides']] },
    { on: ['sg', 'ph', 'vn'], flow: [['client', 'ph', 'Support request'], ['ph', 'client', 'Tested fix'], ['vn', 'ph', 'AI answers tuned'], ['sg', 'client', 'Upgrade plan']] }
  ];
  var client = K.$('.dof-client', root), clientAt = null;
  function pos(k) {
    if (k === 'client') {                                                // it sits at top:50% with translateY(-50%)
      if (!clientAt) { var b = K.box(client, stage); clientAt = { x: b.r - 6, y: b.cy - b.h / 2 }; }
      return clientAt;
    }
    var o = offices[k]; return { x: o.x * W, y: o.y * H };
  }
  function layout() {
    W = stage.offsetWidth || 1; H = stage.offsetHeight || 1;
    Object.keys(offices).forEach(function (k) { var o = offices[k]; o.el.style.left = (o.x * 100) + '%'; o.el.style.top = (o.y * 100) + '%'; });
    clientAt = null; pos('client');                                      // read once, before the SVG is rebuilt
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    var html = '';
    // a faint dot field suggests the region without drawing coastlines
    for (var gx = 18; gx < W; gx += 22) for (var gy = 14; gy < H; gy += 22) {
      var dx = gx / W - .55, dy = gy / H - .5; if (dx * dx * 1.3 + dy * dy < .2) html += '<circle cx="' + gx + '" cy="' + gy + '" r="1.3" class="dof-dotf"/>';
    }
    svg.innerHTML = html;
    arcs = {};
    var pairs = [['sg', 'ph'], ['sg', 'vn'], ['ph', 'vn'], ['client', 'sg'], ['client', 'ph'], ['client', 'vn']], made = [];
    pairs.forEach(function (p) {
      var a = pos(p[0]), b = pos(p[1]), mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2 - Math.hypot(b.x - a.x, b.y - a.y) * .22;
      var d = 'M' + a.x.toFixed(1) + ' ' + a.y.toFixed(1) + 'Q' + mx.toFixed(1) + ' ' + my.toFixed(1) + ' ' + b.x.toFixed(1) + ' ' + b.y.toFixed(1);
      var el = K.svg('path', { d: d, 'class': 'dof-arc' + (p[0] === 'client' ? ' dof-arc--c' : '') });
      svg.appendChild(el); made.push([p, el]);
    });
    // the 10+ countries TechNext delivers to, as rays from the client node (no names on purpose)
    var c = pos('client');
    for (var i = 0; i < 11; i++) {
      var a2 = Math.PI * (.55 + i / 10 * .9), r = H * .36;
      svg.appendChild(K.svg('line', { x1: c.x, y1: c.y, x2: c.x + Math.cos(a2) * r * .5, y2: c.y + Math.sin(a2) * r, 'class': 'dof-ray' }));
    }
    var g = K.svg('g', { 'class': 'dof-pk' }); svg.appendChild(g);
    // each arc as a track worked out from its d: nothing is read back from the SVG, here or per frame
    made.forEach(function (m) {
      var p = m[0], el = m[1], t = K.track(el);
      arcs[p[0] + '>' + p[1]] = { el: el, len: t.len, t: t, rev: false };
      arcs[p[1] + '>' + p[0]] = { el: el, len: t.len, t: t, rev: true };
    });
  }
  function go(i, user) {
    cur = (i + PLAN.length) % PLAN.length;
    if (user) auto = false;
    steps.forEach(function (b, k) { b.setAttribute('aria-pressed', String(k === cur)); b.classList.toggle('is-done', k < cur); });
    cards.forEach(function (c, k) { c.hidden = k !== cur; });
    var on = PLAN[cur].on;
    Object.keys(offices).forEach(function (k) { offices[k].el.classList.toggle('is-on', on.indexOf(k) >= 0); });
    roster.forEach(function (r) { r.classList.toggle('is-on', on.indexOf(r.dataset.o) >= 0); });
    Object.keys(arcs).forEach(function (k) { arcs[k].el.classList.remove('is-hot'); });
    PLAN[cur].flow.forEach(function (f) { var a = arcs[f[0] + '>' + f[1]]; if (a) a.el.classList.add('is-hot'); });
    if (K.reduce) return;
    nextAt = performance.now() + 5200; nextPkt = 0;
  }
  function packet(f) {
    var a = arcs[f[0] + '>' + f[1]]; if (!a) return;
    var g = K.svg('g', { 'class': 'dof-p' }); g.appendChild(K.svg('circle', { r: 9, 'class': 'dof-ph' })); g.appendChild(K.svg('circle', { r: 4, 'class': 'dof-pd' }));
    if (f[2]) { var t = K.svg('text', { x: 10, y: -9, 'class': 'dof-pt' }); t.textContent = f[2]; g.appendChild(t); }
    K.$('.dof-pk', svg).appendChild(g);
    packets.push({ g: g, a: a, t0: performance.now(), dur: 1500 + Math.random() * 500, to: f[1] });
  }
  var loop = K.loop(function (now) {
    if (auto && now > nextAt) go(cur + 1);
    if (now > nextPkt) { var fl = PLAN[cur].flow; packet(fl[Math.random() * fl.length | 0]); nextPkt = now + 700 + Math.random() * 500; }
    packets = packets.filter(function (p) {
      var q = K.clamp((now - p.t0) / p.dur, 0, 1), e = K.ease.inOut(q), L = p.a.rev ? (1 - e) * p.a.len : e * p.a.len;
      var pt = K.trackAt(p.a.t, L);
      p.g.setAttribute('transform', 'translate(' + pt.x.toFixed(1) + ' ' + pt.y.toFixed(1) + ')');
      if (q >= 1) { p.g.remove(); var o = offices[p.to]; if (o) K.restart(o.el, 'is-ping'); return false; }
      return true;
    });
  });
  steps.forEach(function (b, k) { b.addEventListener('click', function () { go(k, true); }); });
  K.$('[data-prev]', root).addEventListener('click', function () { go(cur - 1, true); });
  K.$('[data-next]', root).addEventListener('click', function () { go(cur + 1, true); });
  window.addEventListener('resize', function () { packets.forEach(function (p) { p.g.remove(); }); packets = []; layout(); go(cur, false); });
  layout(); go(0);
  return {
    start: function () { layout(); go(cur < 0 ? 0 : cur); loop.on(); },
    stop: function () { loop.off(); }
  };
});
