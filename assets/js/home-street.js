/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* Homepage · Odoo Street ([data-street], top of the "Every Odoo app, one database" section). The same street as the
   /odoo/apps hero (assets/js/worlds/app-all.js), carried on down the page: the lilac Peranakan shophouse terrace with its
   eight category shops upstairs (real app icons in the windows, scalloped awnings, the focus rosettes), the five-foot way
   below (arches, lanterns, ceiling fans, the bird cage, the cat on the ledge) and the Peranakan floor tiles, which run out
   into the section's own background. The drawing kit and the cast model are the site's own (industry-world.js IXW.kit,
   company/react.js CR, company/office.js CO), loaded only when the street comes near the screen.
   - each shop is a link to its category on /odoo/apps; hover, focus or a first tap opens its window card (every app of
     that category, each linking to its own page) and lights the shop; Nexi floats over to it
   - the people: a TechNext consultant with her tablet, a client at the kopitiam table with kopi, a TechNext developer
     carrying a box along the arcade, a client window-shopping with her bags, a TechNext trainer with a clipboard. Each has
     an idle loop and its own tap move; Nexi waves, and celebrates when tapped
   - phones and tablets: the street keeps its size and swipes sideways inside its own strip (the page never scrolls sideways)
   Loops stop off screen and in hidden tabs; reduced motion paints still frames. */
(function () {
  'use strict';
  var wrap = document.querySelector('[data-street]'); if (!wrap) return;
  var scroller = wrap.querySelector('[data-st-scroll]'), set = wrap.querySelector('[data-st-set]'), cv = wrap.querySelector('[data-st-cv]');
  var shops = [].slice.call(wrap.querySelectorAll('[data-st-shop]')), pops = [].slice.call(wrap.querySelectorAll('[data-st-pop]'));
  var reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  var fine = !!(window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches);
  var me = document.querySelector('script[src*="home-street.js"]'), src = me ? me.getAttribute('src') : 'assets/js/home-street.js';
  var ROOT = src.split('assets/js/')[0], VER = (src.split('?')[1] || '');
  var SW = 1700, SH = 440, F = 388;

  /* ---------------- open / close a shop's window card (works before the drawing loads) ---------------- */
  var openKey = null, closeT = 0, onOpen = null;
  function popOf(k) { for (var i = 0; i < pops.length; i++) if (pops[i].getAttribute('data-st-pop') === k) return pops[i]; return null; }
  function shopOf(k) { for (var i = 0; i < shops.length; i++) if (shops[i].getAttribute('data-st-shop') === k) return shops[i]; return null; }
  function place(k) {
    var p = popOf(k), s = shopOf(k); if (!p || !s) return;
    var wr = wrap.getBoundingClientRect(), sr = s.getBoundingClientRect(), pw = p.offsetWidth, vw = document.documentElement.clientWidth;
    var x = sr.left + sr.width / 2 - pw / 2; x = Math.max(Math.max(8, wr.left + 8), Math.min(x, Math.min(vw, wr.right) - pw - 8));
    p.style.left = (x - wr.left) + 'px'; p.style.top = (sr.bottom - wr.top + 8) + 'px';
    p.style.setProperty('--ax', Math.round(sr.left + sr.width / 2 - x) + 'px');
  }
  function open(k) {
    clearTimeout(closeT); if (openKey === k) return; if (openKey) close(true);
    openKey = k; var p = popOf(k), s = shopOf(k); if (!p) return;
    p.hidden = false; place(k); s.classList.add('is-open'); wrap.classList.add('is-shop');
    requestAnimationFrame(function () { p.classList.add('is-in'); });
    if (onOpen) onOpen(k);
  }
  function close(now) {
    clearTimeout(closeT);
    var go = function () { if (!openKey) return; var p = popOf(openKey), s = shopOf(openKey); p.classList.remove('is-in'); p.hidden = true; s.classList.remove('is-open'); wrap.classList.remove('is-shop'); openKey = null; if (onOpen) onOpen(null); };
    if (now) go(); else closeT = setTimeout(go, 260);
  }
  shops.forEach(function (s) {
    var k = s.getAttribute('data-st-shop');
    s.addEventListener('mouseenter', function () { if (fine) open(k); });
    s.addEventListener('mouseleave', function () { if (fine) close(); });
    s.addEventListener('focus', function () { open(k); });
    s.addEventListener('blur', function () { close(); });
    /* touch: the first tap opens the window card, a second tap on the shop goes to its category */
    s.addEventListener('click', function (e) { if (!fine && openKey !== k) { e.preventDefault(); open(k); } });
  });
  pops.forEach(function (p) {
    p.addEventListener('mouseenter', function () { clearTimeout(closeT); });
    p.addEventListener('mouseleave', function () { if (fine) close(); });
    p.addEventListener('focusin', function () { clearTimeout(closeT); });
    p.addEventListener('focusout', function () { close(); });
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && openKey) { var s = shopOf(openKey); close(true); if (s && wrap.contains(document.activeElement)) s.focus(); } });
  document.addEventListener('pointerdown', function (e) { if (openKey && !e.target.closest('[data-st-pop],[data-st-shop]')) close(true); });
  scroller.addEventListener('scroll', function () { wrap.classList.add('is-swiped'); if (openKey) place(openKey); }, { passive: true });
  window.addEventListener('resize', function () { if (openKey) place(openKey); });

  /* ---------------- size: the set is 1700 x 440 units; desktop fits it to the width, narrow screens swipe ---------------- */
  var k = 1, cw = 0, ox = 0, dpr = 1, SIGNX = 850;
  function layout() {
    var vw = wrap.clientWidth;
    k = vw >= 1100 ? Math.min(vw / SW, 1) : vw < 600 ? 0.66 : 0.74;
    set.style.width = Math.round(SW * k) + 'px'; set.style.height = Math.round(SH * k) + 'px';
    var sw = SW * k > vw + 1; SIGNX = sw ? 250 : SW / 2;
    wrap.style.setProperty('--k', k.toFixed(4)); wrap.style.setProperty('--sx', (SIGNX / SW * 100).toFixed(3) + '%'); wrap.classList.toggle('is-swipe', sw);
    cw = Math.max(vw, Math.round(SW * k)); ox = (cw - SW * k) / 2;
    cv.style.width = cw + 'px'; cv.style.height = Math.round(SH * k) + 'px'; cv.style.left = (-ox) + 'px';
    return true;
  }
  layout();

  /* ---------------- the drawing: load the site's kit, then build the street ---------------- */
  function load(list, done) {
    if (!list.length) { done(); return; }
    var path = list[0], have = document.querySelector('script[src*="' + path + '"]');
    if (have && have.getAttribute('data-done')) { load(list.slice(1), done); return; }
    var s = document.createElement('script'); s.src = ROOT + path + (VER ? '?' + VER : ''); s.async = false;
    s.onload = function () { s.setAttribute('data-done', '1'); load(list.slice(1), done); }; s.onerror = function () {};
    document.head.appendChild(s);
  }
  var started = false;
  function start() {
    if (started) return; started = true;
    load(['assets/js/industry-world.js', 'assets/js/company/react.js', 'assets/js/company/office.js'], function () {
      if (window.IXW && IXW.kit && window.CR && window.CO) street(IXW.kit, window.CR, window.CO);
    });
  }
  if ('IntersectionObserver' in window) {
    var pre = new IntersectionObserver(function (es) { if (es[es.length - 1].isIntersecting) { pre.disconnect(); start(); } }, { rootMargin: '900px 0px 900px 0px' });
    pre.observe(wrap);
  } else start();

  function street(K, CR, CO) {
    var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, shadowed = K.shadowed;
    var PUR = '#714B67', INK = '#1B1F3B', GOLD = '#FFD84A';
    var CATS = [
      { key: 'finance', col: '#0E9384', focus: true, apps: ['accountant', 'account', 'hr_expense', 'spreadsheet_dashboard', 'documents', 'sign'] },
      { key: 'sales', col: '#3167CA', focus: true, apps: ['crm', 'sale', 'point_of_sale', 'pos_restaurant', 'sale_subscription', 'sale_renting'] },
      { key: 'supply', col: '#E07B12', focus: true, apps: ['stock', 'mrp', 'mrp_plm', 'purchase', 'maintenance', 'quality_control'] },
      { key: 'websites', col: '#7B5CD6', apps: ['website', 'website_sale', 'website_blog', 'website_forum', 'im_livechat', 'website_slides'] },
      { key: 'hr', col: '#D63C64', apps: ['hr', 'hr_recruitment', 'hr_holidays', 'hr_appraisal', 'hr_referral', 'fleet', 'hr_payroll'] },
      { key: 'marketing', col: '#C98316', apps: ['social', 'mass_mailing', 'mass_mailing_sms', 'event', 'marketing_automation', 'survey'] },
      { key: 'services', col: '#14A38B', apps: ['project', 'hr_timesheet', 'industry_fsm', 'helpdesk', 'planning', 'appointment'] },
      { key: 'productivity', col: '#56709E', apps: ['mail', 'approvals', 'iot', 'voip', 'knowledge', 'whatsapp', 'ai_app'] }];
    var SHW = 188, SHH = 110, SHY = 92, BX0 = 50, BAY = 200, ARC = 214, BW = ['#F3E3D3', '#E2D2EA', '#E6EEF6', '#F7DDE3', '#DDEFE6', '#FBEBC8', '#E2D2EA', '#E6EEF6'];
    CATS.forEach(function (c, i) { c.x = BX0 + 6 + i * BAY; c.y = SHY; c.i = i; c.mid = BX0 + BAY / 2 + i * BAY; });
    var IMG = {}, wait = 0;
    function img(path) { if (IMG[path]) return IMG[path]; var im = new Image(); wait++; im.onload = im.onerror = function () { if (--wait === 0) { paintStatic(); frame(); } }; im.src = ROOT + path; IMG[path] = im; return im; }
    CATS.forEach(function (c) { c.apps.forEach(function (m) { img('assets/img/odoo/' + m + '.svg'); }); });
    var NX = { hello: [190, 244], present: [289, 244], celebrate: [248, 280], wow: [162, 289], love: [157, 244], 'point-left': [299, 244], 'point-right': [177, 244] };
    Object.keys(NX).forEach(function (p) { img('assets/img/nexi-id/nexi-' + p + '.webp'); });
    function icon(g, m, x, y, s) { var im = IMG['assets/img/odoo/' + m + '.svg']; if (im && im.complete && im.naturalWidth) g.drawImage(im, x, y, s, s); else fillRR(g, x, y, s, s, s * 0.26, '#EEF2F7'); }
    function iconXY(c, j) { return [c.x + 16 + (j % 4) * 41, c.y + 38 + Math.floor(j / 4) * 34]; }

    var g = cv.getContext('2d'), bgC = document.createElement('canvas'), stC = document.createElement('canvas');
    function ext() { return { l: -ox / k, r: (cw - ox) / k, t: 0, b: SH }; }
    function setT(c) { c.setTransform(dpr * k, 0, 0, dpr * k, dpr * ox, 0); }

    /* ---- static: the sky (bg cache) ---- */
    function paintSky(c) {
      var e = ext(); setT(c);
      var sg = c.createLinearGradient(0, 0, 0, F); sg.addColorStop(0, '#FFFFFF'); sg.addColorStop(0.22, '#E3F2FC'); sg.addColorStop(1, '#C4E6FA'); c.fillStyle = sg; c.fillRect(e.l, 0, e.r - e.l, F);
      var gl = c.createRadialGradient(1500, 10, 10, 1500, 10, 300); gl.addColorStop(0, 'rgba(255,248,214,.9)'); gl.addColorStop(1, 'rgba(255,244,200,0)'); c.fillStyle = gl; c.fillRect(e.l, 0, e.r - e.l, 320);
      for (var i = 0; i < 120; i++) { var bx = e.l + i * 46 + hash(i) * 20; if (bx > e.r) break; var bh = 60 + hash(i * 3.1) * 120; c.fillStyle = i % 3 ? 'rgba(170,196,228,.45)' : 'rgba(190,176,214,.42)'; c.fillRect(bx, 230 - bh, 34 + hash(i + 5) * 12, bh + 200);
        c.fillStyle = 'rgba(255,255,255,.35)'; for (var wy = 238 - bh; wy < 220; wy += 14) c.fillRect(bx + 6, wy, 20, 3); }
    }
    /* ---- static: the terrace, the neighbours, the ground (set cache) ---- */
    function tiles(c, x0, x1, y0, y1) {
      var tw = 24, th = 13; for (var y = y0; y < y1; y += th) for (var x = Math.floor(x0 / tw) * tw - tw; x < x1; x += tw) { var o = ((y - y0) / th) % 2 ? tw / 2 : 0, cx = x + o + tw / 2, cy = y + th / 2;
        c.fillStyle = ((Math.round(x / tw) + (y - y0) / th) % 2) ? '#F4EADF' : '#FFFFFF'; c.fillRect(x + o, y, tw, th);
        c.fillStyle = '#7FC4B4'; c.beginPath(); c.moveTo(cx, cy - 5); c.lineTo(cx + 7, cy); c.lineTo(cx, cy + 5); c.lineTo(cx - 7, cy); c.closePath(); c.fill(); fillE(c, cx, cy, 2.2, 1.6, '#E07B8E'); }
    }
    function neighbour(c, x, w, top, col, seed) {
      fillRR(c, x, top, w, F - top, 0, col); c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(x, top, w, 8);
      c.fillStyle = '#D9876B'; c.beginPath(); c.moveTo(x - 8, top); c.lineTo(x + w / 2, top - 34); c.lineTo(x + w + 8, top); c.closePath(); c.fill(); c.fillStyle = 'rgba(0,0,0,.08)'; for (var ry = top - 30; ry < top; ry += 7) c.fillRect(x - 4, ry, w + 8, 2);
      for (var r = 0; r < 2; r++) for (var q = 0; q < Math.floor(w / 64); q++) { var wx = x + 18 + q * 64, wy = top + 22 + r * 96; fillRR(c, wx - 4, wy - 4, 44, 66, 4, '#FFFFFF'); fillRR(c, wx, wy, 36, 58, 3, hash(q + r * 3 + seed) > 0.5 ? '#7FB7A6' : '#E3A1AE');
        c.fillStyle = 'rgba(255,255,255,.45)'; for (var lv = 6; lv < 58; lv += 7) c.fillRect(wx + 2, wy + lv, 32, 2); fillRR(c, wx - 6, wy + 60, 48, 5, 2, '#FFFFFF'); }
      var ac = ['#7FB7A6', '#E3A1AE', '#E8B95A', '#8FB2EA'][Math.floor(hash(seed * 0.37) * 4)], nw = Math.floor((w - 24) / 22);
      fillRR(c, x + 12, F - 104, w - 24, 104, 6, 'rgba(60,40,70,.12)');
      for (var aw = 0; aw < nw; aw++) { c.fillStyle = aw % 2 ? '#FFFFFF' : ac; c.fillRect(x + 12 + aw * 22, F - 112, 22, 14); c.beginPath(); c.arc(x + 23 + aw * 22, F - 98, 11, 0, Math.PI); c.fill(); }
      c.save(); c.translate(x + 28, F); c.scale(0.36, 0.36); K.plant(c, { x: 0, y: 0 }, '#FFFFFF', '#E3E8EF'); c.restore();
    }
    function shopFront(c, s) {
      var x = s.x, y = s.y;
      shadowed(c, 10, 4, 0.14, function () { fillRR(c, x - 3, y - 3, SHW + 6, SHH + 6, 8, '#FFFFFF'); });
      fillRR(c, x, y, SHW, 28, 6, s.col); c.fillStyle = 'rgba(255,255,255,.18)'; c.fillRect(x + 4, y + 3, SHW - 8, 3);
      fillRR(c, x + 4, y + 30, SHW - 8, SHH - 34, 4, '#F7FBFE'); var wg = c.createLinearGradient(x, y + 30, x + SHW, y + SHH); wg.addColorStop(0, 'rgba(190,220,245,.35)'); wg.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = wg; c.fillRect(x + 4, y + 30, SHW - 8, SHH - 34);
      var aw = (SHW - 8) / 9; for (var a = 0; a < 9; a++) { var ax = x + 4 + a * aw; c.fillStyle = a % 2 ? '#FFFFFF' : s.col; c.fillRect(ax, y + 28, aw, 6); c.beginPath(); c.arc(ax + aw / 2, y + 34, aw / 2, 0, Math.PI); c.fill(); }
      c.fillStyle = 'rgba(70,50,80,.10)'; [y + 70, y + 104].forEach(function (sy) { c.fillRect(x + 10, sy, SHW - 20, 3); });
      if (s.focus) { var bx = x + SHW - 16, by = y + SHH - 8; c.fillStyle = '#E8B92E'; c.beginPath(); c.moveTo(bx - 7, by + 4); c.lineTo(bx - 10, by + 20); c.lineTo(bx - 3, by + 15); c.lineTo(bx, by + 22); c.lineTo(bx + 2, by + 6); c.closePath(); c.fill();
        c.beginPath(); c.moveTo(bx + 7, by + 4); c.lineTo(bx + 10, by + 20); c.lineTo(bx + 3, by + 15); c.lineTo(bx, by + 22); c.closePath(); c.fill(); for (var p = 0; p < 12; p++) { var an = p * Math.PI / 6; fillE(c, bx + Math.cos(an) * 10, by + Math.sin(an) * 10, 3.6, 3.6, GOLD); }
        fillE(c, bx, by, 10, 10, GOLD); fillE(c, bx, by, 7.4, 7.4, '#FFFFFF'); CO.plane(c, bx, by, 0.5, 0, '#3167CA'); }
    }
    function paintSet(c) {
      var e = ext(); setT(c);
      /* the neighbours either side (wide screens) */
      for (var nx = BX0 + 1620; nx < e.r + 40; nx += 236) neighbour(c, nx, 222, 72 + ((nx / 236) % 2 ? 18 : 0), ['#CFEDE1', '#FBE7B0', '#CFE2F5'][Math.round(nx / 236) % 3], nx);
      for (var nl = BX0 - 10; nl > e.l - 20; nl -= 236) neighbour(c, nl - 222, 222, 72 + ((nl / 236) % 2 ? 0 : 18), ['#F7D3DA', '#CFE2F5', '#CFEDE1'][Math.round(-nl / 236) % 3], nl);
      /* the terrace: lilac body, parapet with balusters, two floors */
      var L = BX0 - 14, R = BX0 + 8 * BAY + 14;
      fillRR(c, L, 66, R - L, F - 66, 0, '#F2EAF6'); c.fillStyle = 'rgba(113,75,103,.05)'; for (var bz = 0; bz <= 8; bz++) c.fillRect(BX0 - 6 + bz * BAY, 80, 12, ARC - 80);
      fillRR(c, L - 8, 54, R - L + 16, 26, 4, '#FFFFFF'); fillRR(c, L - 8, 78, R - L + 16, 5, 0, '#E3D6EA');
      for (var bl = 0; bl < 66; bl++) fillRR(c, L + 2 + bl * 25, 58, 13, 17, 3, bl % 2 ? '#F2EAF6' : '#E9DEF1');
      fillRR(c, SIGNX - 140, 8, 280, 56, 12, '#FFFFFF'); /* the sign's mount (the sign itself is the link over it) */
      CATS.forEach(function (s) { shopFront(c, s); });
      var ly = SHY + SHH + 2; fillRR(c, L, ly, R - L, 10, 3, '#FFFFFF'); c.fillStyle = 'rgba(113,75,103,.12)'; c.fillRect(L, ly + 8, R - L, 3);
      CATS.forEach(function (s, i) { if (i % 2) return; fillRR(c, s.x + 22, ly + 8, 52, 9, 3, '#B5865A'); for (var f = 0; f < 5; f++) { fillE(c, s.x + 28 + f * 10, ly + 7, 5, 4, f % 2 ? '#3FBF7F' : '#2E9E66'); fillE(c, s.x + 28 + f * 10, ly + 4, 3, 3, ['#FF8FA3', '#FFD84A', '#FFFFFF'][f % 3]); } });
      /* the five-foot way: ceiling, back walls with doors, arches, columns */
      fillRR(c, L, ARC, R - L, 26, 0, '#FFFFFF'); c.fillStyle = 'rgba(113,75,103,.10)'; c.fillRect(L, ARC + 22, R - L, 4);
      CATS.forEach(function (s, i) { var x0 = BX0 + i * BAY + 8, x1 = x0 + BAY - 16, mid = (x0 + x1) / 2;
        fillRR(c, x0, ARC + 26, x1 - x0, F - ARC - 26, 0, BW[i]);
        if (i !== 2) { fillRR(c, mid - 34, F - 112, 68, 112, 4, '#FFFFFF'); fillRR(c, mid - 29, F - 107, 28, 107, 2, i % 2 ? '#7FB7A6' : '#C99A6B'); fillRR(c, mid + 1, F - 107, 28, 107, 2, i % 2 ? '#7FB7A6' : '#C99A6B');
          c.fillStyle = 'rgba(255,255,255,.28)'; for (var dl = F - 98; dl < F - 10; dl += 16) { c.fillRect(mid - 25, dl, 20, 9); c.fillRect(mid + 5, dl, 20, 9); }
          fillE(c, mid - 5, F - 54, 2, 2, GOLD); fillE(c, mid + 5, F - 54, 2, 2, GOLD); fillRR(c, mid - 40, F - 124, 80, 12, 4, s.col); }
        else { /* the kopitiam bay: the Odoo Line map on the wall */
          fillRR(c, x0 + 22, ARC + 52, 140, 40, 6, '#FFFFFF'); c.strokeStyle = PUR; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.moveTo(x0 + 34, ARC + 72); c.lineTo(x0 + 150, ARC + 72); c.stroke();
          CATS.forEach(function (q, j) { var mx = x0 + 34 + j * 16.5; fillE(c, mx, ARC + 72, 4.4, 4.4, '#FFFFFF'); c.strokeStyle = q.col; c.lineWidth = 2.2; c.beginPath(); c.arc(mx, ARC + 72, 3.8, 0, 7); c.stroke(); });
          fillRR(c, x0 + 22, ARC + 52, 140, 9, 6, PUR); }
        c.fillStyle = '#FFFFFF'; c.beginPath(); c.moveTo(x0, ARC + 26); c.lineTo(x1, ARC + 26); c.lineTo(x1, ARC + 64); c.quadraticCurveTo(mid, ARC + 16, x0, ARC + 64); c.closePath(); c.fill();
        c.strokeStyle = '#E3D6EA'; c.lineWidth = 2; c.beginPath(); c.moveTo(x1, ARC + 64); c.quadraticCurveTo(mid, ARC + 16, x0, ARC + 64); c.stroke(); });
      for (var col = 0; col <= 8; col++) { var cx = BX0 + col * BAY; fillRR(c, cx - 8, ARC + 18, 16, F - ARC - 18, 3, '#FFFFFF'); fillRR(c, cx - 11, ARC + 18, 22, 10, 3, '#F2EAF6'); fillRR(c, cx - 11, F - 24, 22, 24, 3, '#EEE4F2'); c.fillStyle = 'rgba(113,75,103,.08)'; c.fillRect(cx + 3, ARC + 28, 4, F - ARC - 52); }
      /* the kopitiam table (bay 3) */
      var TX = TABLE.x; soft(c, TX, F + 2, 40, 5, 0.25); fillRR(c, TX - 4, TABLE.y + 6, 8, F - TABLE.y - 8, 2, '#2A3142'); fillE(c, TX, F - 3, 22, 5, '#2A3142'); fillE(c, TX, TABLE.y, 40, 8, '#E9EEF4'); fillE(c, TX, TABLE.y - 2, 38, 7, '#FFFFFF');
      /* plants by the end columns */
      [[BX0 + 26, '#F7D3DA'], [BX0 + 8 * BAY - 26, '#CFEDE1'], [BX0 + 4 * BAY + 24, '#FBE7B0']].forEach(function (pl) { c.save(); c.translate(pl[0], F); c.scale(0.46, 0.46); K.plant(c, { x: 0, y: 0 }, pl[1], '#FFFFFF'); c.restore(); });
      /* the ground: five-foot way tiles, the kerb, then the street runs into the section */
      tiles(c, e.l, e.r, F, F + 26); c.fillStyle = 'rgba(70,40,70,.10)'; c.fillRect(e.l, F, e.r - e.l, 4);
      fillRR(c, e.l, F + 26, e.r - e.l, 7, 0, '#E3D6EA'); c.fillStyle = '#CDBFD8'; c.fillRect(e.l, F + 31, e.r - e.l, 2);
      var pg = c.createLinearGradient(0, F + 33, 0, SH); pg.addColorStop(0, '#EADFF0'); pg.addColorStop(1, '#F2EAF6'); c.fillStyle = pg; c.fillRect(e.l, F + 33, e.r - e.l, SH - F - 33 + 2);
    }
    var TABLE = { x: 2 * BAY + BX0 + 128, y: F - 66 };
    function paintStatic() {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      var W = Math.round(cw * dpr), H = Math.round(SH * k * dpr);
      [cv, bgC, stC].forEach(function (c) { c.width = W; c.height = H; });
      var b = bgC.getContext('2d'); b.clearRect(0, 0, W, H); paintSky(b);
      var s = stC.getContext('2d'); s.clearRect(0, 0, W, H); paintSet(s);
    }

    /* ---------------- the people (the site's cast model; TechNext staff wear the blue ID, clients a grey pass) ---------------- */
    var who = CR.who, S2 = 0.25, GREY = '#9AA6BC';
    var CON = who({ x: 150, y: F, s: S2, ph: 0.3, skin: 1, hair: 0, style: 'long', outfit: 'polo', top: '#3167CA', hold: 'tablet', hands: [[-70, -210], [70, -170]], look: 0.4 });
    var KOP = who({ x: TABLE.x - 62, y: F, s: S2, ph: 2.4, skin: 2, hair: 1, style: 'short', outfit: 'shirt', top: '#14A38B', glasses: true, sit: true, chairCol: '#8A5A3B', id: GREY, hands: [[60, -206], [80, -206]], look: 0.5 });
    var OWN = who({ x: 1150, y: F, s: S2, ph: 1.6, skin: 3, hair: 1, style: 'bob', outfit: 'cardigan', top: '#E0456B', top2: '#FFFFFF', id: GREY, hold: 'bags', hands: [[-70, -170], [70, -170]], look: -0.4 });
    var TRN = who({ x: 1450, y: F, s: S2, ph: 0.9, skin: 0, hair: 0, style: 'pony', outfit: 'polo', top: PUR, clip: GOLD, hold: 'clipboard', hands: [[-60, -200], [60, -220]], look: -0.5 });
    var DEV = who({ s: S2, skin: 0, hair: 2, style: 'short', outfit: 'shirt', top: '#1E3A6E', hold: 'box' }); DEV.fixS = true;
    var WALK = { x0: 690, x1: 1000, y: F, spd: 22, ph: 0.4, P: DEV, acts: ['cheer', 'id', 'spin'], label: 'TechNext developer' };
    [CON, KOP, OWN, TRN].forEach(function (P) { P.st = {}; });
    var FX = [], TAP = {}, CAT = { t: -9 }, NEXI = { x: 4 * BAY + BX0 + 100, y: F - 78, tx: 0, pose: 'hello', tap: -9, face: 1 }, ACT = null, ACTt = -9;
    NEXI.tx = NEXI.x;
    function handAt(P, side) {
      var F3 = K.F3, d = side ? 1 : -1, h = P.hands[side];
      var r = K.ik(d * F3.shx * (P.build || 1), F3.shy, h[0], h[1], F3.a, F3.b, d).h, dy = -(P.hop || 0) + (P.sit ? (P.sitDrop != null ? P.sitDrop : 46) : 0);
      return [P.x + r[0] * P.s, P.y + (r[1] + dy) * P.s];
    }
    function fly(m, from, to, arc, t, fx) { FX.push({ m: m, x0: from[0], y0: from[1], x1: to[0], y1: to[1], arc: arc, t0: t, dur: 1.3, fx: fx }); }
    function cat(i) { return CATS[i]; }
    var acts = {
      con: function (P, t) { /* points out the shops on her tablet; tap: an app flies from her tablet up into its shop window */
        P.tilt = 0; P.hop = 0; P.mood = 'calm'; P.talk = false;
        if (TAP.con && t - TAP.con < 2) { var u = (t - TAP.con) / 2; P.mood = 'happy'; P.talk = true; P.hands = [[-40, -380 - Math.sin(u * Math.PI) * 30], [80, -200]]; P.hop = Math.sin(u * Math.PI) * 12; P.look = 0.5; return; }
        var cyc = t % 9; if (cyc % 3 > 1.2) P.hands = [[-70, -210], [110, -360 + Math.sin(t * 3) * 6]]; else P.hands = [[-70, -214 + Math.sin(t * 6) * 3], [44, -226]];
        P.x = 150 + Math.sin(t * 0.35) * 10; P.look = cyc < 3 ? 0.3 : cyc < 6 ? 0.9 : -0.3;
      },
      kop: function (P, t) { /* sips kopi, types on the laptop beside her; tap: her phase-one checklist ticks itself */
        P.cup = false; P.tilt = 0; P.hop = 0; P.mood = 'calm'; P.talk = false;
        if (TAP.kop && t - TAP.kop < 2.8) { P.mood = 'happy'; P.talk = true; P.hands = (t - TAP.kop) > 2 ? [[60, -206], [110, -380 + Math.sin(t * 12) * 8]] : [[60, -206], [80, -230]]; P.look = 0.7; return; }
        var sc = t % 10; if (sc > 7.2) { var up = Math.sin((sc - 7.2) / 2.8 * Math.PI); P.cup = true; P.hands = [[60, -206], [40 - up * 20, -210 - up * 120]]; P.tilt = -up * 0.06; P.look = 0; return; }
        var k2 = Math.abs(Math.sin(t * 5)) * 6; P.hands = [[60, -206 - k2], [110, -206 - (6 - k2)]]; P.look = sc > 5.6 ? -0.3 : 0.7;
      },
      own: function (P, t) { /* window-shops, looking up from shop to shop; tap: an app drops from a window into her bag */
        P.tilt = 0; P.hop = 0; P.mood = 'calm'; P.talk = false;
        if (TAP.own && t - TAP.own < 2.2) { var u = (t - TAP.own) / 2.2; P.mood = u > 0.6 ? 'happy' : 'wow'; P.hands = [[-70, -150 + (u > 0.6 ? -30 : 0)], [100, -380 + Math.sin(t * 12) * 10]]; P.hop = u > 0.6 ? Math.abs(Math.sin(u * Math.PI * 4)) * 18 : 0; return; }
        var cyc = t % 8; P.look = cyc < 2.5 ? -0.8 : cyc < 5 ? 0.6 : -0.2; P.tilt = cyc < 5 ? -0.07 : 0;
        P.hands = cyc > 5 && cyc < 6.5 ? [[-70, -170], [-120, -330 + Math.sin(t * 3) * 8]] : [[-70, -170], [70, -170 + Math.sin(t * 2) * 4]]; P.x = 1150 + Math.sin(t * 0.3) * 14;
      },
      trn: function (P, t) { /* ticks her clipboard and nods; tap: a spin with notes */
        P.tilt = 0; P.hop = 0; P.mood = 'calm'; P.talk = false; P.sx = 1;
        if (TAP.trn && t - TAP.trn < 1.4) { var u = (t - TAP.trn) / 1.4; P.mood = 'happy'; P.sx = Math.cos(u * Math.PI * 2); P.hop = Math.sin(u * Math.PI) * 26; P.hands = [[-110, -360], [60, -220]]; return; }
        var cyc = t % 7; if (cyc < 4) { P.hands = [[-60, -200], [20 + Math.sin(t * 9) * 8, -214 + Math.abs(Math.sin(t * 9)) * 4]]; P.look = 0.1; P.tilt = 0.05; }
        else { P.hands = [[-60, -200], [70, -170]]; P.look = -0.6; P.tilt = Math.sin(t * 6) * 0.05; }
      }
    };
    var PEOPLE = [['con', CON], ['kop', KOP], ['own', OWN], ['trn', TRN]];
    var SAY = { con: 'Start with Accounting, Sales and Inventory.', kop: 'Phase one: quote, deliver and invoice on one set of records.', own: 'Add apps later, no integration project.', trn: 'Every app shares customers, products and accounts.', dev: 'Every Odoo app, one database.', nexi: 'Welcome to Odoo Street! Tap a shop to see its apps.' };
    var bubble = document.createElement('p'); bubble.className = 'hm-st-say'; bubble.setAttribute('aria-live', 'polite'); bubble.hidden = true; set.appendChild(bubble); var bubT = 0;
    function say(id, x, y) {
      bubble.textContent = SAY[id]; bubble.hidden = false; bubble.style.left = (x / SW * 100) + '%'; bubble.style.top = (y / SH * 100) + '%';
      bubble.classList.remove('is-in'); void bubble.offsetWidth; bubble.classList.add('is-in'); clearTimeout(bubT); bubT = setTimeout(function () { bubble.hidden = true; }, 2800);
    }
    function tap(id, t) {
      TAP[id] = t;
      if (id === 'con') { var c = cat(Math.floor(t * 7) % 3), j = Math.floor(t * 3) % c.apps.length, d = iconXY(c, j); fly(c.apps[j], handAt(CON, 0), [d[0] + 14, d[1] + 14], 70, t + 0.3, 'star'); ACT = c; ACTt = t + 0.6; }
      if (id === 'own') { var c2 = cat(3 + Math.floor(t * 5) % 5), j2 = Math.floor(t * 3) % c2.apps.length, d2 = iconXY(c2, j2), h = handAt(OWN, 0); fly(c2.apps[j2], [d2[0] + 14, d2[1] + 14], [h[0] + 8, h[1] + 4], 30, t + 0.2, 'heart'); ACT = c2; ACTt = t; }
      if (id === 'kop') CR.burst('spark', KOP.x, KOP.y - 120, t);
      if (id === 'trn') CR.burst('note', TRN.x, TRN.y - 130, t);
      if (id === 'nexi') { NEXI.tap = t; CR.burst('conf', NEXI.x, NEXI.y - 50, t); }
      if (id === 'cat') CAT.t = t;
    }

    /* ---------------- live ---------------- */
    var T0 = performance.now(), last = 0, running = false, visible = false;
    function active(t) { if (openKey) return CATS.filter(function (c) { return c.key === openKey; })[0]; return t - ACTt < 3.4 ? ACT : null; }
    function lantern(c, x, y) { c.strokeStyle = '#8A6A4A'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(x, ARC + 20); c.lineTo(x, y - 12); c.stroke(); fillRR(c, x - 5, y - 13, 10, 4, 2, '#C9962E'); fillE(c, x, y, 10, 12, '#E2453D'); fillE(c, x - 3, y - 3, 3, 5, 'rgba(255,255,255,.35)'); c.fillStyle = 'rgba(0,0,0,.12)'; c.fillRect(x - 10, y - 1, 20, 2); fillRR(c, x - 5, y + 10, 10, 4, 2, '#C9962E'); c.strokeStyle = GOLD; c.beginPath(); c.moveTo(x, y + 14); c.lineTo(x, y + 22); c.stroke(); }
    function draw(t) {
      var W = cv.width, H = cv.height, e = ext(), act = active(t);
      g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, W, H); g.drawImage(bgC, 0, 0);
      setT(g);
      for (var q = 0; q < 5; q++) { var span = e.r - e.l + 500, x = e.l - 250 + ((hash(q + 7) * span + t * (5 + q * 2)) % span), y = 22 + q * 22; K.cloud(g, x, y, 0.16 + hash(q) * 0.1); }
      g.strokeStyle = 'rgba(40,60,90,.5)'; g.lineWidth = 1.5; g.lineCap = 'round';
      for (var b = 0; b < 4; b++) { var bsp = e.r - e.l + 300, bx = e.l - 100 + ((t * (14 + b * 3) + hash(b + 2) * bsp) % bsp), by = 30 + b * 12 + Math.sin(t * 0.9 + b) * 5, fl = Math.sin(t * 8 + b * 2) * 4;
        g.beginPath(); g.moveTo(bx - 6, by - fl); g.quadraticCurveTo(bx - 3, by - 3, bx, by); g.quadraticCurveTo(bx + 3, by - 3, bx + 6, by - fl); g.stroke(); }
      g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(stC, 0, 0); setT(g);
      /* the shop windows: icons on their shelves; the lit shop glows and its icons bob; OPEN signs blink */
      CATS.forEach(function (c) { var on = act === c, dim = act && !on, lift = on ? -2 : 0;
        if (on) { g.save(); g.globalAlpha = 0.25 + 0.1 * Math.sin(t * 4); fillE(g, c.mid, F - 4, 90, 12, c.col); g.restore(); g.strokeStyle = c.col; g.lineWidth = 3.5; rr(g, c.x - 6, c.y - 6, SHW + 12, SHH + 12, 11); g.stroke(); }
        c.apps.forEach(function (m, j) { var p = iconXY(c, j), bob = on ? Math.sin(t * 4 + j) * 2.4 : Math.sin(t * 1.2 + j * 1.7 + c.i) * 0.6; g.save(); g.globalAlpha = dim ? 0.45 : 1; icon(g, m, p[0], p[1] + bob + lift, 28); g.restore(); });
        var bl = ((t + c.i * 0.7) % 5) < 4.6 || on; fillRR(g, c.x + SHW - (c.focus ? 58 : 36), c.y + 92, 26, 10, 5, '#FFFFFF'); g.strokeStyle = bl ? (on ? c.col : '#E0456B') : '#D9D9D9'; g.lineWidth = 1.4; rr(g, c.x + SHW - (c.focus ? 58 : 36), c.y + 92, 26, 10, 5); g.stroke();
        fillRR(g, c.x + SHW - (c.focus ? 53 : 31), c.y + 96, 16, 2.4, 1, bl ? (on ? c.col : '#E0456B') : '#D9D9D9'); });
      /* ceiling fans, lanterns, the bird cage, the kopi steam, the cat */
      [BX0 + 100, BX0 + 900, BX0 + 1500].forEach(function (fx, i) { fillRR(g, fx - 1.5, ARC + 26, 3, 12, 1, '#9AA6BC'); var a = t * 7 + i; for (var bl2 = 0; bl2 < 3; bl2++) { var ca = Math.cos(a + bl2 * 2.094); fillE(g, fx + ca * 15, ARC + 40, Math.abs(ca) * 14 + 2, 2.2, '#C9B79C'); } fillE(g, fx, ARC + 40, 5, 4, '#FFFFFF'); });
      for (var l = 1; l < 8; l++) { var sw = Math.sin(t * 1.4 + l) * 2.4; g.save(); g.translate(BX0 + l * BAY, ARC + 18); g.rotate(sw * 0.02); g.translate(-(BX0 + l * BAY), -(ARC + 18)); lantern(g, BX0 + l * BAY, ARC + 34); g.restore(); }
      var cgx = BX0 + 2 * BAY + 40, cgy = ARC + 74; g.strokeStyle = '#8A6A4A'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(cgx, ARC + 26); g.lineTo(cgx, cgy - 24); g.stroke(); g.strokeStyle = '#C9962E'; g.lineWidth = 1.4; g.beginPath(); g.ellipse(cgx, cgy - 10, 15, 14, 0, Math.PI, 0); for (var cb = -12; cb <= 12; cb += 6) { g.moveTo(cgx + cb, cgy - 10 - Math.sqrt(Math.max(0, 196 - cb * cb)) * 0.95); g.lineTo(cgx + cb, cgy + 10); } g.stroke(); fillRR(g, cgx - 17, cgy + 8, 34, 4, 2, '#C9962E');
      var hop = Math.max(0, Math.sin(t * 5)) * ((t % 4) < 1.4 ? 5 : 0), bdx = Math.sin(t * 0.6) * 5; fillE(g, cgx + bdx, cgy + 1 - hop, 5, 4, '#7FC4E8'); fillE(g, cgx + bdx + 4, cgy - 3 - hop, 3, 3, '#7FC4E8'); fillE(g, cgx + bdx + 5, cgy - 3.5 - hop, 0.9, 0.9, INK);
      /* the laptop beside the kopi drinker, and her cup's steam */
      var lx = TABLE.x - 6, ly2 = TABLE.y - 33; fillRR(g, lx - 3, ly2 - 3, 46, 32, 3, '#2A3142'); fillRR(g, lx, ly2, 40, 26, 2, '#FFFFFF'); fillRR(g, lx, ly2, 40, 6, 2, PUR); ['accountant', 'sale', 'stock'].forEach(function (m, j) { icon(g, m, lx + 3 + j * 12.5, ly2 + 9, 10); });
      fillRR(g, lx + 3, ly2 + 21, 34 * clamp((t % 6) / 4, 0.15, 1), 2.5, 1.2, '#2BC48A'); fillRR(g, lx - 9, TABLE.y - 8, 58, 5, 2, '#9AA6BC');
      if (!KOP.cup) { fillRR(g, TABLE.x + 22, TABLE.y - 16, 11, 12, 3, '#FFFFFF'); fillRR(g, TABLE.x + 22, TABLE.y - 16, 11, 3, 1.5, '#8A5A3B');
        g.strokeStyle = 'rgba(160,170,190,.55)'; g.lineWidth = 1.3; for (var sv = 0; sv < 2; sv++) { var syy = TABLE.y - 26 - ((t * 12 + sv * 7) % 14); g.beginPath(); g.moveTo(TABLE.x + 25 + sv * 4, syy + 8); g.quadraticCurveTo(TABLE.x + 29 + sv * 4, syy + 4, TABLE.x + 25 + sv * 4, syy); g.stroke(); } }
      var ct = t - CAT.t, cx = 1290 + (ct < 3 ? Math.sin(Math.min(1, ct / 3) * Math.PI) * 60 : 0), cy = SHY + SHH + 2;
      g.fillStyle = '#F2A65A'; g.beginPath(); g.ellipse(cx, cy - 7, 10, 7, 0, 0, 7); g.fill(); fillE(g, cx + 9, cy - 15, 6, 5.5, '#F2A65A'); g.beginPath(); g.moveTo(cx + 5, cy - 19); g.lineTo(cx + 6, cy - 24); g.lineTo(cx + 9, cy - 20); g.moveTo(cx + 10, cy - 20); g.lineTo(cx + 13, cy - 24); g.lineTo(cx + 14, cy - 18); g.fill();
      g.strokeStyle = '#F2A65A'; g.lineWidth = 3; g.beginPath(); g.moveTo(cx - 9, cy - 6); g.quadraticCurveTo(cx - 20, cy - 10 + Math.sin(t * 3) * 6, cx - 16 - Math.sin(t * 3) * 4, cy - 20); g.stroke(); fillE(g, cx + 11, cy - 15, 1, 1.2, INK); fillE(g, cx + 7, cy - 15, 1, 1.2, INK);
      /* the people */
      PEOPLE.forEach(function (p) { acts[p[0]](p[1], t); K.person(g, p[1], t); });
      if (KOP.cup) { var hc = handAt(KOP, 1); fillRR(g, hc[0] - 5, hc[1] - 12, 11, 12, 3, '#FFFFFF'); fillRR(g, hc[0] - 5, hc[1] - 12, 11, 3, 1.5, '#8A5A3B'); }
      if (TAP.kop && t - TAP.kop < 2.8) { var u = clamp((t - TAP.kop) / 2.8, 0, 1), px = KOP.x + 4, py = KOP.y - 150; fillRR(g, px - 40, py - 32, 84, 58, 7, '#FFFFFF'); g.strokeStyle = '#E3E8EF'; g.lineWidth = 1; rr(g, px - 40, py - 32, 84, 58, 7); g.stroke(); fillRR(g, px - 40, py - 32, 84, 11, 7, '#14A38B');
        ['accountant', 'sale', 'stock'].forEach(function (m, i) { var yy = py - 14 + i * 13, on = u > 0.18 + i * 0.2; fillRR(g, px - 34, yy - 5, 9, 9, 2, on ? '#2BC48A' : '#EEF2F7'); if (on) { g.strokeStyle = '#FFFFFF'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(px - 32, yy - 1); g.lineTo(px - 30, yy + 1.5); g.lineTo(px - 27, yy - 3); g.stroke(); } icon(g, m, px - 20, yy - 5, 10); fillRR(g, px - 6, yy - 2, 40 - i * 6, 4, 2, '#DCE3EE'); }); }
      CR.walk(g, WALK, t);
      /* Nexi floats along the arcade; over to the lit shop, presenting it; celebrates when tapped */
      var tgt = act ? act.mid + (act.i < 7 ? 52 : -52) : 4 * BAY + BX0 + 100 + Math.sin(t * 0.18) * 160;
      NEXI.x = lerp(NEXI.x, clamp(tgt, 110, SW - 110), reduce ? 1 : 0.04); NEXI.face = act ? (act.mid < NEXI.x ? -1 : 1) : NEXI.face;
      var pose = t - NEXI.tap < 1.8 ? 'celebrate' : act ? (act.mid < NEXI.x ? 'point-left' : 'point-right') : (t % 12) < 1.6 ? 'wow' : 'hello';
      var im = IMG['assets/img/nexi-id/nexi-' + pose + '.webp'], an = NX[pose], ny = NEXI.y + Math.sin(t * 2.2) * 4 - (t - NEXI.tap < 1.8 ? Math.abs(Math.sin((t - NEXI.tap) * 6)) * 14 : 0);
      soft(g, NEXI.x, F + 2, 30, 5, 0.22);
      if (im && im.complete && im.naturalWidth) { var sc = 112 / 494; g.drawImage(im, NEXI.x - an[0] * sc, ny - an[1] * sc, im.naturalWidth * sc, im.naturalHeight * sc); }
      NEXI.box = [NEXI.x - 40, ny - 58, 80, 116];
      /* apps in flight */
      FX = FX.filter(function (f) { return t - f.t0 < f.dur; });
      FX.forEach(function (f) { var u2 = clamp((t - f.t0) / f.dur, 0, 1); if (u2 <= 0) return; var ee = u2 * u2 * (3 - 2 * u2), x = lerp(f.x0, f.x1, ee), y = lerp(f.y0, f.y1, ee) - Math.sin(u2 * Math.PI) * f.arc;
        g.save(); g.translate(x, y); g.rotate(Math.sin(u2 * Math.PI) * 0.6); var s = 22 * lerp(0.7, 1.1, Math.sin(u2 * Math.PI)); icon(g, f.m, -s / 2, -s / 2, s); g.restore();
        if (u2 > 0.95 && !f.done) { f.done = true; CR.burst(f.fx, f.x1, f.y1, t); } });
      CR.draw(g, t);
    }
    function frame() { if (wait > 0) return; var t = (performance.now() - T0) / 1000; draw(t); }
    function loop(now) { if (!running) return; requestAnimationFrame(loop); if (now - last < 15) return; last = now; frame(); }
    function run() { var want = visible && !document.hidden && !reduce; if (want === running) return; running = want; if (running) requestAnimationFrame(loop); }
    onOpen = function () { if (!running) frame(); };

    /* taps on the people, Nexi and the cat (shops are links over the canvas) */
    function toSet(e) { var r = set.getBoundingClientRect(); return [(e.clientX - r.left) / k, (e.clientY - r.top) / k]; }
    function hitPerson(x, y) {
      if (NEXI.box && x > NEXI.box[0] && x < NEXI.box[0] + NEXI.box[2] && y > NEXI.box[1] && y < NEXI.box[1] + NEXI.box[3]) return ['nexi', NEXI.x, NEXI.box[1]];
      for (var i = 0; i < PEOPLE.length; i++) { var P = PEOPLE[i][1]; if (Math.abs(x - P.x) < 26 && y < P.y + 4 && y > P.y - 128) return [PEOPLE[i][0], P.x, P.y - 132]; }
      if (DEV._w && Math.abs(x - DEV.x) < 26 && y < DEV.y + 4 && y > DEV.y - 128) return ['dev', DEV.x, DEV.y - 132];
      if (Math.abs(x - 1290) < 26 && y > SHY + SHH - 30 && y < SHY + SHH + 6) return ['cat', 1290, SHY + SHH - 26];
      return null;
    }
    set.addEventListener('click', function (e) {
      if (e.target.closest('a')) return; var p = toSet(e), h = hitPerson(p[0], p[1]); if (!h) return;
      var t = (performance.now() - T0) / 1000;
      if (h[0] === 'dev') CR.hitWalker(p[0], p[1], t); else tap(h[0], t);
      if (SAY[h[0]]) say(h[0], h[1], h[2]);
      if (!running) frame();
    });
    if (fine) set.addEventListener('pointermove', function (e) { if (e.target.closest('a')) return; var p = toSet(e); set.style.cursor = hitPerson(p[0], p[1]) ? 'pointer' : ''; });

    paintStatic(); frame();
    var rT = 0; window.addEventListener('resize', function () { clearTimeout(rT); rT = setTimeout(function () { layout(); paintStatic(); frame(); }, 120); });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { visible = es[es.length - 1].isIntersecting; run(); }, { threshold: 0 }).observe(wrap); else { visible = true; run(); }
    document.addEventListener('visibilitychange', run);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (!running) frame(); });
  }
})();
