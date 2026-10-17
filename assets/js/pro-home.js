/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This design and code are not licensed for copying, reuse or AI training. */
/* HOME, IT-consulting redesign: hero word swap, the systems map (wires + pulses on canvas, nodes on two slow rings),
   the sample ledger feed, the focus-apps console tabs, the scroll-driven lead-to-cash line, practice spotlights and the
   steps line. No dependencies; everything degrades to static, readable content. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduced = RM.matches;

  /* ------------------------------------------------ rotating word */
  var rot = $('[data-rot]');
  if (rot && !reduced) {
    var words = $$('b', rot), wi = 0;
    setInterval(function () {
      if (document.hidden) return;
      var cur = words[wi]; wi = (wi + 1) % words.length; var nxt = words[wi];
      cur.classList.remove('is-on'); cur.classList.add('is-out');
      nxt.classList.remove('is-out'); nxt.classList.add('is-on');
      setTimeout(function () { cur.classList.remove('is-out'); }, 650);
    }, 2600);
  }

  /* ------------------------------------------------ systems map */
  var map = $('[data-map]');
  if (map) {
    var cv = $('[data-wires]', map), ctx = cv.getContext('2d');
    var nodes = $$('.px-node', map).map(function (el, k) {
      var ring = +el.getAttribute('data-ring');
      return { el: el, ring: ring, k: k, x: 0, y: 0 };
    });
    var r0 = nodes.filter(function (n) { return n.ring === 0; }), r1 = nodes.filter(function (n) { return n.ring === 1; });
    r0.forEach(function (n, i) { n.a0 = -Math.PI / 2 + i * (Math.PI * 2 / r0.length); });
    r1.forEach(function (n, i) { n.a0 = -Math.PI / 2 + Math.PI / r1.length + i * (Math.PI * 2 / r1.length); });
    var W = 0, H = 0, dpr = 1, pulses = [], t0 = performance.now(), running = false, visible = true;
    function size() {
      var r = map.getBoundingClientRect(); dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function place(t) {
      var cx = W / 2, cy = H / 2, R0 = W * 0.31, R1 = W * 0.455;
      var s = reduced ? 0 : t / 1000;
      nodes.forEach(function (n) {
        var a = n.a0 + (n.ring === 0 ? s * 0.05 : -s * 0.035);
        var R = n.ring === 0 ? R0 : R1;
        n.x = cx + Math.cos(a) * R; n.y = cy + Math.sin(a) * R * 0.92;
        n.el.style.transform = 'translate3d(' + n.x.toFixed(1) + 'px,' + n.y.toFixed(1) + 'px,0)';
      });
    }
    function curve(n) {   // control point bends each wire slightly off the straight spoke
      var cx = W / 2, cy = H / 2, mx = (n.x + cx) / 2, my = (n.y + cy) / 2;
      var dx = n.y - cy, dy = cx - n.x, L = Math.hypot(dx, dy) || 1, b = n.ring === 0 ? 0.12 : 0.18;
      return { cx: cx, cy: cy, qx: mx + dx / L * L * b, qy: my + dy / L * L * b };
    }
    function qpt(n, c, u) {
      var a = (1 - u) * (1 - u), b = 2 * (1 - u) * u, d = u * u;
      return [a * n.x + b * c.qx + d * c.cx, a * n.y + b * c.qy + d * c.cy];
    }
    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      // orbit guides
      ctx.strokeStyle = 'rgba(140,170,235,.13)'; ctx.lineWidth = 1; ctx.setLineDash([2, 6]);
      [0.31, 0.455].forEach(function (k) { ctx.beginPath(); ctx.ellipse(W / 2, H / 2, W * k, W * k * 0.92, 0, 0, Math.PI * 2); ctx.stroke(); });
      ctx.setLineDash([]);
      nodes.forEach(function (n) {
        var c = curve(n);
        var g = ctx.createLinearGradient(n.x, n.y, c.cx, c.cy);
        g.addColorStop(0, n.ring === 0 ? 'rgba(120,165,255,.42)' : 'rgba(120,165,255,.2)');
        g.addColorStop(1, 'rgba(61,214,245,.06)');
        ctx.strokeStyle = g; ctx.lineWidth = n.ring === 0 ? 1.4 : 1;
        ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.quadraticCurveTo(c.qx, c.qy, c.cx, c.cy); ctx.stroke();
      });
      // pulses: data travelling between an app and the core
      for (var i = pulses.length - 1; i >= 0; i--) {
        var p = pulses[i], u = (t - p.t) / p.d;
        if (u >= 1) { pulses.splice(i, 1); if (!p.inb) p.n.el.classList.remove('is-ping'); continue; }
        var e = u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
        var c2 = curve(p.n), pt = qpt(p.n, c2, p.inb ? e : 1 - e);
        var rg = ctx.createRadialGradient(pt[0], pt[1], 0, pt[0], pt[1], 10);
        rg.addColorStop(0, 'rgba(160,240,255,.95)'); rg.addColorStop(1, 'rgba(61,214,245,0)');
        ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(pt[0], pt[1], 10, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(pt[0], pt[1], 2.2, 0, Math.PI * 2); ctx.fill();
      }
    }
    var lastSpawn = 0;
    function frame(t) {
      if (!visible) { running = false; return; }
      place(t - t0);
      if (t - lastSpawn > 520) {
        lastSpawn = t;
        var n = nodes[Math.floor(Math.random() * nodes.length)], inb = Math.random() < .55;
        pulses.push({ n: n, t: t, d: 1500 + Math.random() * 700, inb: inb });
        if (!inb) n.el.classList.add('is-ping');
      }
      draw(t);
      requestAnimationFrame(frame);
    }
    function start() { if (!running && !reduced) { running = true; requestAnimationFrame(frame); } }
    size(); place(0); draw(performance.now());
    window.addEventListener('resize', function () { size(); place(performance.now() - t0); draw(performance.now()); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) start(); }).observe(map);
    }
    document.addEventListener('visibilitychange', function () { visible = !document.hidden; if (visible) start(); });
    start();
  }

  /* ------------------------------------------------ sample ledger feed */
  var feed = $('[data-feed]');
  if (feed && !reduced) {
    var icon = function (m) { var src = $('img', feed).getAttribute('src').replace(/[^/]+\.svg$/, m + '.svg'); return '<img class="oi" src="' + src + '" alt="" width="16" height="16">'; };
    var pool = [
      ['crm', 'Lead', ' qualified, assigned to Sales'], ['sale', 'S00420', ' quotation sent'], ['account', 'INV/0422', ' posted, GST applied'],
      ['stock', 'WH/OUT/0311', ' picked and packed'], ['purchase', 'PO00089', ' confirmed with vendor'], ['accountant', '12', ' bank lines matched'],
      ['mrp', 'MO/0057', ' finished, stock updated'], ['sale', 'S00421', ' signed, order confirmed'], ['account', 'BILL/0094', ' matched to receipt']
    ];
    var pi = 0;
    setInterval(function () {
      if (document.hidden) return;
      var d = pool[pi]; pi = (pi + 1) % pool.length;
      var li = document.createElement('li'); li.className = 'is-new';
      li.innerHTML = icon(d[0]) + '<span><b></b></span><time>now</time>';
      li.querySelector('b').textContent = d[1]; li.querySelector('span').appendChild(document.createTextNode(d[2]));
      $$('time', feed).forEach(function (tm, k) { tm.textContent = k === 0 ? '1 min' : tm.textContent === 'now' ? '1 min' : tm.textContent; });
      feed.insertBefore(li, feed.firstChild);
      while (feed.children.length > 3) feed.removeChild(feed.lastChild);
    }, 3200);
  }

  /* ------------------------------------------------ count-ups */
  if (!reduced) $$('[data-count]').forEach(function (el) {
    var to = +el.getAttribute('data-count'), st = null; el.textContent = '0';
    function step(t) { if (!st) st = t; var u = Math.min(1, (t - st) / 1400), e = 1 - Math.pow(1 - u, 4); el.textContent = Math.round(to * e); if (u < 1) requestAnimationFrame(step); }
    setTimeout(function () { requestAnimationFrame(step); }, 500);
  });

  /* ------------------------------------------------ console tabs */
  var con = $('[data-console]');
  if (con) {
    var tabs = $$('[role="tab"]', con), ind = $('.px-tab-ind', con);
    function moveInd(tab) { if (!ind) return; ind.style.transform = 'translateY(' + tab.offsetTop + 'px)'; ind.style.height = tab.offsetHeight + 'px'; }
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
      moveInd(tab); if (focus) tab.focus();
    }
    tabs.forEach(function (t, k) {
      t.addEventListener('click', function () { select(t); });
      t.addEventListener('keydown', function (e) {
        var d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
        if (d) { e.preventDefault(); select(tabs[(k + d + tabs.length) % tabs.length], true); }
        if (e.key === 'Home') { e.preventDefault(); select(tabs[0], true); }
        if (e.key === 'End') { e.preventDefault(); select(tabs[tabs.length - 1], true); }
      });
    });
    requestAnimationFrame(function () { moveInd(tabs[0]); });
    window.addEventListener('resize', function () { moveInd(tabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0]); });
  }

  /* ------------------------------------------------ lead-to-cash, scroll-driven */
  var flow = $('[data-flow]');
  if (flow) {
    var stick = $('.px-flow-sticky', flow), board = $('.px-board', flow), svg = $('[data-track]', flow), bg = $('.px-track-bg', svg), fg = $('.px-track-fg', svg);
    var sts = $$('[data-stations] li', flow), tok = $('[data-token]', flow), hand = $('[data-hand]', flow);
    var pts = [], segLen = [], total = 0, vert = false, lastP = -1;
    function layout() {
      var w = board.clientWidth, h = board.clientHeight;
      vert = w < 520; board.classList.toggle('is-vert', vert);
      var padX = vert ? 0 : 50, padY = vert ? 58 : 0;
      pts = sts.map(function (li) {
        var l = +li.getAttribute('data-l'), c = +li.getAttribute('data-c');
        var x, y;
        if (vert) { x = (l + .5) / 5 * w; y = padY + c / 9 * (h - padY * 2); }
        else { x = padX + c / 9 * (w - padX * 2); y = (l + .5) / 5 * h - 4; }
        li.style.transform = 'translate(' + x + 'px,' + y + 'px)' + (vert && l === 4 ? ' translateX(calc(-100% + 34px))' : '');
        return [x, y];
      });
      // right-angle route with rounded corners between stations
      var d = 'M' + pts[0][0] + ' ' + pts[0][1];
      for (var i = 1; i < pts.length; i++) {
        var a = pts[i - 1], b = pts[i];
        if (a[1] === b[1] || a[0] === b[0]) { d += ' L' + b[0] + ' ' + b[1]; continue; }
        if (vert) { var my = (a[1] + b[1]) / 2; d += ' L' + a[0] + ' ' + my + ' L' + b[0] + ' ' + my + ' L' + b[0] + ' ' + b[1]; }
        else { var mx = (a[0] + b[0]) / 2; d += ' L' + mx + ' ' + a[1] + ' L' + mx + ' ' + b[1] + ' L' + b[0] + ' ' + b[1]; }
      }
      bg.setAttribute('d', d); fg.setAttribute('d', d);
      total = fg.getTotalLength();
      // the path length at which each station sits
      segLen = pts.map(function (p) {
        var best = 0, bd = 1e9;
        for (var s = 0; s <= total; s += 4) { var q = fg.getPointAtLength(s), dd = Math.hypot(q.x - p[0], q.y - p[1]); if (dd < bd) { bd = dd; best = s; } }
        return best;
      });
      fg.style.strokeDasharray = total + ' ' + total;
      lastP = -1; update();
    }
    function update() {
      var p;
      if (reduced) p = 1;
      else {
        if (getComputedStyle(stick).position === 'sticky') {
          var r = flow.getBoundingClientRect(), span = flow.offsetHeight - window.innerHeight;
          p = span > 0 ? Math.min(1, Math.max(0, (-r.top) / span)) : 1;
          p = Math.min(1, p * 1.12);
        } else {   // phones: the order follows the board as it passes the middle of the screen
          var br = board.getBoundingClientRect();
          p = Math.min(1, Math.max(0, (window.innerHeight * 0.62 - br.top) / br.height));
        }
      }
      if (Math.abs(p - lastP) < .0005) return; lastP = p;
      var L = total * p;
      fg.style.strokeDashoffset = (total - L).toFixed(1);
      var q = fg.getPointAtLength(L);
      tok.style.transform = 'translate(' + q.x.toFixed(1) + 'px,' + q.y.toFixed(1) + 'px)';
      var lit = 0;
      sts.forEach(function (li, k) { var on = L >= segLen[k] - 2; li.classList.toggle('is-lit', on); if (on) lit++; });
      if (hand) hand.textContent = Math.max(0, lit - 1);
    }
    var ticking = false;
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(function () { ticking = false; update(); }); } }, { passive: true });
    window.addEventListener('resize', layout);
    layout();
  }

  /* ------------------------------------------------ practice spotlights */
  if (window.matchMedia('(hover: hover)').matches) $$('[data-tilt]').forEach(function (el) {
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px'); el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* ------------------------------------------------ steps line draws when the list arrives */
  var steps = $('[data-steps]');
  if (steps && 'IntersectionObserver' in window) {
    var so = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { steps.classList.add('is-in'); so.disconnect(); } }, { threshold: .4 });
    so.observe(steps);
  } else if (steps) steps.classList.add('is-in');
})();
