/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* InvoiceNow and the GST timeline (blog): an invoice or credit note travels from the seller's Odoo to
   the seller's access point, over the InvoiceNow (Peppol) network to the buyer's access point and on
   to the buyer. With invoice data submission switched on, IRAS receives a copy through the access
   points. Below, a finder built only from the article's table and exclusions gives the date that
   applies, lights the matching table row and places it on the 2025 to 2031 timeline. */
TN.demo('peppol', function (root, K) {
  var stage = K.$('.pp-stage', root), svgEl = K.$('.pp-wires', root), logEl = K.$('.pp-log', root), tip = K.tip(stage);
  var subBtn = K.$('[data-sub]', root), docBtns = K.$$('[data-doc]', root);
  var cnt = {}; K.$$('[data-c]', root).forEach(function (d) { cnt[d.dataset.c] = d; });
  var N = {}; K.$$('.pp-node', root).forEach(function (n) { N[n.dataset.n] = n; });
  var BLUE = 'var(--tok-stock)', TEAL = 'var(--tok-pay)', GREY = '#A7A7BA', VIOLET = 'var(--tok-make)';

  var POS = { c1: [15, 20], iras: [50, 20], c4: [85, 20], c2: [15, 74], net: [50, 74], c3: [85, 74] };
  var POS_S = { c1: [33, 8], c2: [33, 29], net: [33, 50], c3: [33, 71], c4: [33, 92], iras: [78, 41] };
  var TIP = {
    c1: ["Seller's Odoo", 'Odoo 20 refines Singapore GST taxes to prepare for GST InvoiceNow document compliance, and adds IRAS-compliant tax invoice and credit note reports. You still need a confirmed path to an accredited access point, tested on your real documents.'],
    c2: ["Seller's access point", 'Invoices travel over the InvoiceNow network through IMDA-accredited Access Point Providers. IRAS publishes the lists of accredited providers.'],
    net: ['InvoiceNow', "Singapore's nationwide e-invoicing network, based on the international Peppol standard and introduced by IMDA in 2019."],
    c3: ["Buyer's access point", 'The invoice reaches the buyer through an accredited access point on the same network.'],
    c4: ["Buyer's system", 'The buyer receives the invoice over InvoiceNow.'],
    iras: ['IRAS', 'Once invoice data submission is switched on in the InvoiceNow-Ready Solution, IRAS receives a copy of the invoice data through the access points.']
  };
  var ROUTE = ['c1', 'c2', 'net', 'c3', 'c4'];

  // ------------------------------------------------------------ geometry
  var W = 0, H = 0, geo = {}, narrow = false;
  function place() {
    W = stage.offsetWidth; H = stage.offsetHeight; narrow = W < 540;
    var P = narrow ? POS_S : POS;
    Object.keys(N).forEach(function (k) {
      var el = N[k]; el.style.left = (P[k][0] / 100 * W - el.offsetWidth / 2).toFixed(1) + 'px'; el.style.top = (P[k][1] / 100 * H - el.offsetHeight / 2).toFixed(1) + 'px';
      geo[k] = K.box(el, stage);
    });
    svgEl.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    drawWires();
  }
  function edge(a, b) {
    // leave a from the side facing b, arrive at b on the facing side
    var A = geo[a], B = geo[b], dx = B.cx - A.cx, dy = B.cy - A.cy;
    if (Math.abs(dx) > Math.abs(dy)) return [[dx > 0 ? A.r : A.x, A.cy], [dx > 0 ? B.x : B.r, B.cy]];
    return [[A.cx, dy > 0 ? A.b : A.y], [B.cx, dy > 0 ? B.y : B.b]];
  }
  function copyPts() {
    // an S-curve from the seller's access point up into IRAS (sampled, so the copy can follow it)
    var A = geo.c2, B = geo.iras, p0 = [A.r, A.cy - (narrow ? 0 : 8)], p3 = [B.x, B.cy], dx = (p3[0] - p0[0]) * .55, pts = [];
    for (var i = 0; i <= 24; i++) {
      var t = i / 24, u = 1 - t;
      pts.push([u * u * u * p0[0] + 3 * u * u * t * (p0[0] + dx) + 3 * u * t * t * (p3[0] - dx) + t * t * t * p3[0],
                u * u * u * p0[1] + 3 * u * u * t * p0[1] + 3 * u * t * t * p3[1] + t * t * t * p3[1]]);
    }
    return pts;
  }
  function dOf(pts) { return pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(''); }
  var copyPath = null;
  function drawWires() {
    svgEl.textContent = '';
    for (var i = 0; i < ROUTE.length - 1; i++) {
      var e = edge(ROUTE[i], ROUTE[i + 1]);
      svgEl.appendChild(K.svg('path', { d: 'M' + e[0][0] + ' ' + e[0][1] + 'L' + e[1][0] + ' ' + e[1][1], 'class': 'pp-w' }));
    }
    copyPath = K.svg('path', { d: dOf(copyPts()), 'class': 'pp-w pp-w--copy' });
    svgEl.appendChild(copyPath);
  }

  // ------------------------------------------------------------ one clock
  var tl = 0, queue = [], toks = [];
  function at(ms, fn) { if (K.reduce) { fn(); return; } queue.push({ t: tl + ms, fn: fn }); }
  var loop = K.loop(function (now, dt) {
    tl += dt * 1000;
    if (queue.length) {
      var due = queue.filter(function (q) { return q.t <= tl; });
      if (due.length) { queue = queue.filter(function (q) { return q.t > tl; }); due.sort(function (a, b) { return a.t - b.t; }).forEach(function (q) { q.fn(); }); }
    }
    toks = toks.filter(function (k) {
      var p = K.clamp((tl - k.t0) / k.dur, 0, 1), e = K.ease.inOut(p), f = e * (k.pts.length - 1), i = Math.min(k.pts.length - 2, f | 0), q = f - i;
      var x = K.lerp(k.pts[i][0], k.pts[i + 1][0], q), y = K.lerp(k.pts[i][1], k.pts[i + 1][1], q);
      k.el.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
      if (p >= 1) { if (k.done) k.done(); if (k.drop) k.el.remove(); return false; }
      return true;
    });
  });
  function centre(k) { return [geo[k].cx, geo[k].cy]; }
  function move(el, pts, dur, done, drop) {
    if (K.reduce) { if (drop) el.remove(); if (done) done(); return; }
    toks.push({ el: el, pts: pts, t0: tl, dur: dur, done: done, drop: drop });
  }

  // ------------------------------------------------------------ one document through the network
  var docType = 'inv', sub = true, n = { inv: 41, cn: 6 }, sent = 0, got = 0, copies = 0, busy = false, auto = true;
  function say(text, c) { var li = K.log(logEl, '<i></i><span></span>', null, 3); K.$('span', li).textContent = text; li.style.setProperty('--c', c); }
  function ping(k) { K.restart(N[k], 'is-ping'); }
  function counts() { cnt.sent.textContent = sent; cnt.got.textContent = got; cnt.iras.textContent = copies; }
  function send() {
    busy = true; var type = docType, s = sub;
    n[type]++;
    var no = (type === 'inv' ? 'INV/2026/' : 'RINV/2026/') + String(n[type]).padStart(5, '0'), label = type === 'inv' ? 'Tax invoice' : 'Credit note';
    var doc = K.el('span', 'pp-doc pp-doc--' + type); doc.appendChild(K.el('b', null, type === 'inv' ? 'INV' : 'CN')); doc.appendChild(K.el('i'));
    var c0 = centre('c1'); doc.style.transform = 'translate(' + c0[0].toFixed(1) + 'px,' + c0[1].toFixed(1) + 'px)';
    if (!K.reduce) stage.appendChild(doc);
    at(0, function () { sent++; counts(); ping('c1'); say(label + ' ' + no + ' posted in Odoo', BLUE); });
    var t = 500;
    function hop(a, b, text, c, extra) {
      at(t, function () { move(doc, [centre(a), centre(b)], 900, function () { ping(b); if (text) say(text, c); if (extra) extra(); }); });
      t += 1050;
    }
    hop('c1', 'c2', "Sent to the seller's access point", BLUE, function () {
      if (s) {
        var cp = K.el('span', 'pp-doc pp-doc--copy'); cp.appendChild(K.el('b', null, 'DATA')); cp.appendChild(K.el('i'));
        var c2 = centre('c2'); cp.style.transform = 'translate(' + c2[0].toFixed(1) + 'px,' + c2[1].toFixed(1) + 'px)';
        if (!K.reduce) stage.appendChild(cp);
        var pts = copyPts(); pts.unshift(centre('c2')); pts.push(centre('iras'));
        move(cp, pts, 1100, function () { copies++; counts(); ping('iras'); say('IRAS receives a copy of the invoice data', TEAL); }, true);
      } else say('Invoice data submission is off: no copy goes to IRAS', GREY);
    });
    hop('c2', 'net', 'On the InvoiceNow network', VIOLET);
    hop('net', 'c3', "Received by the buyer's access point", BLUE);
    hop('c3', 'c4', null, null, function () { got++; counts(); say(label + ' delivered to the buyer', BLUE); });
    at(t + 150, function () { doc.classList.add('is-out'); setTimeout(function () { doc.remove(); }, 400); busy = false; if (auto && !K.reduce) later(1600); });   // reduced motion: one document per click, no loop
  }
  var gen = 0;
  function later(ms) { var g = ++gen; at(ms, function () { if (g === gen && !busy) send(); }); }   // a newer request cancels an older one
  function sendNow() { gen++; if (!busy) send(); }
  docBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      docType = b.dataset.doc; docBtns.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      auto = true; sendNow();
    });
  });
  subBtn.addEventListener('click', function () {
    sub = !sub; subBtn.setAttribute('aria-pressed', String(sub)); stage.classList.toggle('is-nosub', !sub);
    sendNow();
  });
  Object.keys(N).forEach(function (k) {
    var el = N[k];
    function on() { var g = geo[k]; if (g.y < 70) tip.show(TIP[k], g.cx, g.b + 8, true); else tip.show(TIP[k], g.cx, g.y - 4); }
    el.addEventListener('pointerenter', on); el.addEventListener('focus', on);
    el.addEventListener('pointerleave', tip.hide); el.addEventListener('blur', tip.hide);
  });

  // ------------------------------------------------------------ the finder: the article's table and exclusions only
  var find = K.$('.pp-find', root), stepEx = K.$('[data-step="ex"]', find), stepReg = K.$('[data-step="reg"]', find), stepSup = K.$('[data-step="sup"]', find);
  var resEl = K.$('.pp-res', find), tlEl = K.$('.pp-tl', find);
  var table = document.querySelector('[data-pp-table] tbody'), trs = table ? K.$$('tr', table) : [];
  var FALL = ['1 Nov 2025', '1 Apr 2026', '1 Apr 2028', '1 Apr 2029', '1 Apr 2030', '1 Apr 2031'];
  var DATES = FALL.map(function (f, i) { var c = trs[i] && trs[i].cells[0]; return c ? c.textContent.trim() : f; });
  var MON = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
  function parse(s) { var m = /^(\d{1,2}) ([A-Z][a-z]{2}) (\d{4})$/.exec(s); return m ? new Date(+m[3], MON[m[2]], +m[1]).getTime() : NaN; }
  var T = DATES.map(parse), okDates = T.every(function (v) { return !isNaN(v); });
  if (!okDates) { DATES = FALL; T = FALL.map(parse); }

  var st = { overseas: false, reverse: false, reg: null, sup: null };
  function opt(parent, key, list, multi) {
    var g = K.el('div', 'pp-opts'); g.setAttribute('role', 'group');
    list.forEach(function (o) {
      var b = K.el('button', 'pp-opt', o[1]); b.type = 'button'; b.dataset.k = o[0]; b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', function () {
        if (multi) st[o[0]] = !st[o[0]]; else { st[key] = st[key] === o[0] ? null : o[0]; if (key === 'reg' && st.reg !== 'exist') st.sup = null; }
        renderFind(true);
      });
      g.appendChild(b);
    });
    parent.appendChild(g); return g;
  }
  function label(parent, text, hint) { var p = K.el('p', 'pp-fl', text); if (hint) p.appendChild(K.el('small', null, hint)); parent.appendChild(p); }
  label(stepEx, 'Either of these?', 'IRAS excludes both from the requirement');
  var gEx = opt(stepEx, null, [['overseas', 'Overseas entity, including OVR pay-only or full regime'], ['reverse', 'Registered for GST wholly because of the reverse charge regime']], true);
  label(stepReg, 'Your GST registration');
  var gReg = opt(stepReg, 'reg', [['vol6', 'Registering voluntarily within six months of incorporation'], ['vol26', 'Applying for voluntary registration on or after 1 April 2026'],
    ['comp28', 'Applying for compulsory registration on or after 1 April 2028'], ['exist', 'Already GST-registered'], ['other', 'None of these']]);
  label(stepSup, 'Total annual supplies in 2025', 'Standard-rated, zero-rated and exempt supplies (Box 4 of the GST return) for periods ending in 2025');
  var gSup = opt(stepSup, 'sup', [['s200', 'S$200,000 or less'], ['s1m', 'S$1,000,000 or less'], ['s4m', 'S$4,000,000 or less'], ['over', 'Above S$4,000,000'], ['none', 'No GST returns for periods ending in 2025']]);
  var ROW = { vol6: 0, vol26: 1, comp28: 2, s200: 2, s1m: 3, s4m: 4, over: 5 };

  // the timeline: one marker per table row, plus today
  var t0 = T[0], t1 = T[T.length - 1], marks = [];
  function xOf(t) { return K.clamp((t - t0) / (t1 - t0), 0, 1) * 100; }
  DATES.forEach(function (d, i) {
    var m = K.el('span', 'pp-mk'); m.style.left = xOf(T[i]) + '%';
    m.appendChild(K.el('i')); m.appendChild(K.el('small', null, d.replace(/^1 /, '')));
    tlEl.appendChild(m); marks.push(m);
  });
  var now = Date.now(), today = K.el('span', 'pp-today'); today.style.left = xOf(now) + '%'; today.appendChild(K.el('small', null, 'Today'));
  tlEl.appendChild(today);

  function renderFind(user) {
    K.$$('.pp-opt', gEx).forEach(function (b) { b.setAttribute('aria-pressed', String(!!st[b.dataset.k])); });
    K.$$('.pp-opt', gReg).forEach(function (b) { b.setAttribute('aria-pressed', String(st.reg === b.dataset.k)); });
    K.$$('.pp-opt', gSup).forEach(function (b) { b.setAttribute('aria-pressed', String(st.sup === b.dataset.k)); });
    var ex = st.overseas || st.reverse;
    stepReg.classList.toggle('is-off', ex); stepSup.hidden = ex || st.reg !== 'exist';
    var key = ex ? 'ex' : st.reg === 'exist' ? st.sup : st.reg, row = key != null && ROW[key] != null ? ROW[key] : -1;
    resEl.textContent = '';
    var big = K.el('b', 'pp-rd'), line = K.el('span', 'pp-rl');
    if (ex) { big.textContent = 'Excluded'; line.textContent = 'IRAS lists overseas entities (including OVR pay-only and full regime vendors) and businesses liable to register wholly because of the reverse charge regime as exclusions.'; }
    else if (row >= 0) {
      big.textContent = 'From ' + DATES[row];
      line.textContent = (T[row] <= now ? 'Already applies. ' : '') + (st.reg === 'exist' ? 'IRAS has been notifying businesses registered before 2026 of their date since mid-2026. ' : '') + 'Then list your invoice flows, check your system, onboard early and clean your master data.';
    } else if (key === 'none') { big.textContent = 'Date to follow'; line.textContent = 'Without GST returns for periods ending in 2025, IRAS says the date will be communicated later.'; }
    else if (key === 'other') { big.textContent = 'Check with IRAS'; line.textContent = 'Find your date in the IRAS notification or the GST InvoiceNow Implementation Date Calculator.'; }
    else { big.textContent = st.reg === 'exist' ? 'Pick your 2025 supplies' : 'Pick your situation'; line.textContent = 'The finder uses only the dates and exclusions in the table above.'; }
    resEl.appendChild(big); resEl.appendChild(line);
    resEl.className = 'pp-res' + (row >= 0 ? ' is-date' : ex ? ' is-ex' : key ? ' is-info' : '');
    if (user && !K.reduce) K.restart(resEl, 'is-in');
    marks.forEach(function (m, i) {
      m.classList.toggle('is-on', i === row); m.classList.toggle('is-past', T[i] <= now);
      // narrow panels label only the ends and the answer, so close dates never collide
      m.classList.toggle('is-lab', i === row || (i === marks.length - 1) || (i === 0 && row !== 1));
    });
    trs.forEach(function (tr, i) { tr.classList.toggle('pp-hit', i === row); });
  }

  var rz = 0;
  window.addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(place, 120); });
  place(); counts(); renderFind(false);
  if (K.reduce) { auto = false; send(); }
  var first = true;
  return {
    start: function () {
      place(); loop.on();
      if (first && !K.reduce) { first = false; later(500); }
    },
    stop: function () { loop.off(); tip.hide(); }
  };
});
