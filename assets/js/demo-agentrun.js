/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* AI workflow automation page: an agent run for vendor-bill intake, drawn as a DAG. Bills arrive,
   are read by OCR (each field with a confidence score), pass four validation rules (PO match, amount
   tolerance, duplicate, GST 9%), then branch: a fast track to one-click batch approval when the lowest field
   confidence clears the threshold, otherwise a review queue and an approval; failed rules go to
   exceptions, duplicates are rejected. Posted bills are scheduled for payment. Bills move as tokens;
   the threshold slider changes the split live against a histogram of 240 sample bills. */
TN.demo('agentrun', function (root, K) {
  var dag = K.$('.arn-dag', root), svg = K.$('.arn-edges', root), layer = K.$('.arn-toks', root);
  var N = {}; K.$$('[data-n]', dag).forEach(function (n) { N[n.dataset.n] = n; });
  var tip = K.tip(dag), slider = K.$('#arn-th', root), hsvg = K.$('.arn-hsvg', root), logEl = K.$('.arn-log', root);
  var B = {}; K.$$('[data-b]', root).forEach(function (n) { B[n.dataset.b] = n; });
  var KP = {}; K.$$('[data-k]', root).forEach(function (n) { KP[n.dataset.k] = n; });
  var CNT = {}; K.$$('[data-c]', dag).forEach(function (n) { CNT[n.dataset.c] = n; });
  var SPL = {}; K.$$('[data-s]', root).forEach(function (n) { SPL[n.dataset.s] = K.$('b', n); });
  var playBtn = K.$('[data-play]', root), qLab = K.$('[data-q]', dag);

  var VENDORS = ['Harbourline Supplies', 'Apex Supplies', 'Kestrel Components', 'Bluewater Print', 'Northpoint Logistics', 'Greenleaf Office', 'Ironbridge Metal', 'Sunpeak Packaging'];
  var FIELDS = ['Vendor', 'Bill number', 'Bill date', 'PO reference', 'Subtotal', 'GST 9%', 'Total'];
  var WEAK = [0, 1, 2, 3, 3, 3, 4, 6, 6, 2];                          // PO references and totals on scans are read least surely
  var FAIL = { po: 'No open PO for this vendor', tol: 'Total 3.8% over the PO', gst: 'GST not 9% on a standard-rated line', dup: 'Duplicate of an earlier bill', nab: 'Not a bill: a statement' };
  var SC = {
    normal: { every: 1350, mu: 92.5, sd: 4.8, dup: .015, nab: .006, po: .03, tol: .02, gst: .01 },
    rush: { every: 760, mu: 90, sd: 5.8, dup: .025, nab: .008, po: .045, tol: .025, gst: .012 },
    newsup: { every: 1350, mu: 86.5, sd: 6.8, dup: .012, nab: .008, po: .12, tol: .035, gst: .025 }
  };
  // DAG edges: from, to, anchor sides on desktop and on phones (source side, target side: r l t b)
  var E = {
    e1: ['in', 'ocr', 'rl', 'bt'], e2: ['ocr', 'rules', 'rl', 'bt'], e3: ['rules', 'gate', 'rl', 'bt'], e4: ['rules', 'exc', 'bl', 'rl'],
    e5: ['gate', 'post', 'rl', 'bt'], e6: ['gate', 'rev', 'bl', 'rl'], e7: ['exc', 'rev', 'rb', 'bt'], e8: ['exc', 'rej', 'rl', 'rt'],
    e9: ['rev', 'apr', 'rl', 'bt'], e10: ['apr', 'post', 'tb', 'lr'], e11: ['post', 'pay', 'rl', 'bt']
  };
  var TIPS = {
    'in': ['Bills in', 'The bills inbox, supplier uploads and scans. The agent picks up each new attachment.'],
    ocr: ['Read the bill', 'OCR and field extraction: vendor, number, dates, PO, lines, GST and total, each with a confidence score.'],
    rules: ['Validation rules', 'PO match: an open PO for the same vendor', 'Tolerance: total within 2% of the PO and receipt', 'Duplicate: no earlier bill with this vendor and number', 'GST: 9% on standard-rated lines'],
    gate: ['Confidence gate', 'The lowest field confidence decides. At or above the threshold the bill posts straight through; below it, a person checks it.'],
    rev: ['Review queue', 'An AP clerk sees the PDF beside the extracted fields, fixes what the agent was unsure of, and sends it on.'],
    apr: ['Approval', 'The budget owner approves reviewed bills, following your approval rules.'],
    post: ['Post to Odoo Accounting', 'Posted with the PDF attached: payables, GST input tax and the matched PO line.'],
    pay: ['Schedule payment', 'Due date from the payment terms. The bill joins a payment batch that Finance releases: the agent never releases money.'],
    exc: ['Exceptions', 'A failed rule stops the run. The buyer confirms a PO or price change, or AP rejects the bill.'],
    rej: ['Rejected', 'Duplicates and documents that are not bills are closed with a note. Nothing is posted.']
  };
  var DW = { ocr: 700, rules: 950, gate: 260, exc: 1150, rej: 650, apr: 650, post: 480, pay: 480 }, REVIEW = 2300, SPEED = .2;
  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var TODAY = Date.UTC(2026, 8, 25);
  function day(ms) { var d = new Date(ms); return d.getUTCDate() + ' ' + MON[d.getUTCMonth()]; }
  function money(v) { return v.toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function rng(seed) { return function () { seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function gauss(r) { return Math.sqrt(-2 * Math.log(1 - r())) * Math.cos(2 * Math.PI * r()); }
  var seq = 0;
  function makeBill(r, sc) {
    var base = K.clamp(sc.mu + gauss(r) * sc.sd, 62, 99), weak = WEAK[r() * WEAK.length | 0];
    var f = FIELDS.map(function (x, i) { return Math.round(i === weak ? base : Math.min(99, base + 1.5 + r() * 7)); });
    var fail = null, x = r();
    ['dup', 'nab', 'po', 'tol', 'gst'].some(function (k) { if (x < sc[k]) { fail = k; return true; } x -= sc[k]; return false; });
    var sub = Math.round((140 + Math.pow(r(), 1.7) * 9200) * 100) / 100, gst = Math.round(sub * 9) / 100, d = TODAY - (r() * 6 | 0) * 864e5;
    seq++;
    return { id: seq, conf: f[weak], f: f, weak: weak, fail: fail, sub: sub, gst: gst, tot: Math.round((sub + gst) * 100) / 100,
      v: VENDORS[r() * VENDORS.length | 0], ref: 'INV-' + (40000 + (r() * 59999 | 0)), po: 'P00' + (118 + (r() * 80 | 0)), date: d, due: d + 30 * 864e5 };
  }

  // ---------------------------------------------------------------- the histogram of a sample batch
  var T = 90, sc = 'normal', batch = [];
  function sample() { var r = rng(sc === 'normal' ? 11 : sc === 'rush' ? 23 : 37); batch = []; for (var i = 0; i < 240; i++) batch.push(makeBill(r, SC[sc])); seq = 0; }
  var HW = 300, HH = 124, HP = { l: 6, r: 6, t: 24, b: 20 }, LO = 70, NB = 30;
  function drawHist() {
    HW = hsvg.clientWidth || 300; hsvg.setAttribute('viewBox', '0 0 ' + HW + ' ' + HH); hsvg.textContent = '';
    var bins = [], i, iw = HW - HP.l - HP.r, ih = HH - HP.t - HP.b, bw = iw / NB;
    for (i = 0; i < NB; i++) bins.push([0, 0]);
    batch.forEach(function (b) { var k = K.clamp(b.conf - LO, 0, NB - 1); bins[k][b.fail ? 1 : 0]++; });
    var max = Math.max.apply(null, bins.map(function (q) { return q[0] + q[1]; })) || 1;
    var xOf = function (v) { return HP.l + (v - LO) / NB * iw; };
    bins.forEach(function (q, k) {
      var x = HP.l + k * bw + .6, h0 = q[0] / max * ih, h1 = q[1] / max * ih, y = HP.t + ih, w = Math.max(1, bw - 1.2);
      if (h1) hsvg.appendChild(K.svg('rect', { x: x, y: y - h1, width: w, height: h1, rx: 1, 'class': 'arn-bar is-exc' }));
      if (h0) hsvg.appendChild(K.svg('rect', { x: x, y: y - h1 - h0, width: w, height: Math.max(0, h0 - (h1 ? .8 : 0)), rx: 1, 'class': 'arn-bar ' + (LO + k >= T ? 'is-auto' : 'is-rev') }));
    });
    hsvg.appendChild(K.svg('path', { d: 'M' + HP.l + ' ' + (HP.t + ih + .5) + 'H' + (HW - HP.r), 'class': 'arn-hax' }));
    [70, 80, 90, 100].forEach(function (v) { var t = K.svg('text', { x: xOf(v), y: HH - 5, 'class': 'arn-htx', 'text-anchor': v === LO ? 'start' : v === 100 ? 'end' : 'middle' }); t.textContent = v + '%'; hsvg.appendChild(t); });
    var tx = xOf(T);
    hsvg.appendChild(K.svg('path', { d: 'M' + tx.toFixed(1) + ' ' + (HP.t - 6) + 'V' + (HP.t + ih), 'class': 'arn-hth' }));
    var lab = K.svg('text', { x: K.clamp(tx, 16, HW - 16), y: HP.t - 10, 'class': 'arn-hthl', 'text-anchor': 'middle' }); lab.textContent = T + '%'; hsvg.appendChild(lab);
    var s = split(); SPL.auto.textContent = s.auto; SPL.rev.textContent = s.rev; SPL.exc.textContent = s.exc + s.rej;
  }
  function split() {
    var o = { auto: 0, rev: 0, exc: 0, rej: 0 };
    batch.forEach(function (b) { if (b.fail === 'dup' || b.fail === 'nab') o.rej++; else if (b.fail) o.exc++; else if (b.conf >= T) o.auto++; else o.rev++; });
    return o;
  }
  function setT(v) {
    T = K.clamp(Math.round(v), 70, 99); slider.value = T;
    K.$('[data-thv]', root).textContent = T + '%'; K.$('[data-th]', dag).textContent = String(T);
    drawHist(); edgeLabels(); if (shown) verdict(shown);
  }
  slider.addEventListener('input', function () { touched = true; setT(+slider.value); });
  var dragH = false;
  function fromHist(e) { var r = hsvg.getBoundingClientRect(); setT(LO + (e.clientX - r.left - HP.l) / (r.width - HP.l - HP.r) * NB - .5); }
  hsvg.addEventListener('pointerdown', function (e) { dragH = true; touched = true; hsvg.setPointerCapture(e.pointerId); fromHist(e); });
  hsvg.addEventListener('pointermove', function (e) { if (dragH) fromHist(e); });
  hsvg.addEventListener('pointerup', function () { dragH = false; });

  // ---------------------------------------------------------------- DAG geometry
  var boxes = {}, paths = {}, phone = false, labs = {};
  function side(b, s) { return s === 'r' ? [b.r, b.cy, 1, 0] : s === 'l' ? [b.x, b.cy, -1, 0] : s === 't' ? [b.cx, b.y, 0, -1] : [b.cx, b.b, 0, 1]; }
  function layout() {
    phone = getComputedStyle(dag).getPropertyValue('--arn-mode').trim() === '1';
    Object.keys(N).forEach(function (k) { boxes[k] = K.box(N[k], dag); });
    svg.setAttribute('viewBox', '0 0 ' + dag.clientWidth + ' ' + dag.clientHeight);
    Object.keys(E).forEach(function (id) {
      var e = E[id], code = phone ? e[3] : e[2], a = side(boxes[e[0]], code[0]), b = side(boxes[e[1]], code[1]);
      var d = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.min(70, d * .45);
      var dd = 'M' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + 'C' + (a[0] + a[2] * k).toFixed(1) + ' ' + (a[1] + a[3] * k).toFixed(1) + ' ' + (b[0] + b[2] * k).toFixed(1) + ' ' + (b[1] + b[3] * k).toFixed(1) + ' ' + b[0].toFixed(1) + ' ' + b[1].toFixed(1);
      var p = paths[id];
      if (!p) { p = paths[id] = { el: K.svg('path', { 'class': 'arn-e arn-' + id }) }; svg.appendChild(p.el); }
      p.el.setAttribute('d', dd);
      // the 41 stops along the edge, worked out from its d rather than read back from the SVG
      var t = K.track(dd), L = t.len, pts = [];
      for (var i = 0; i <= 40; i++) { var q = K.trackAt(t, L * i / 40); pts.push([q.x, q.y]); }
      p.len = L; p.pts = pts;
    });
    edgeLabels(); placeQueue();
  }
  function at(p, q) { var f = K.clamp(q, 0, 1) * 40, i = Math.min(39, f | 0), t = f - i, a = p.pts[i], b = p.pts[i + 1]; return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; }
  function edgeLabels() {
    var s = split(), n = batch.length || 1, raw = [s.auto, s.rev, s.exc + s.rej].map(function (v) { return v / n * 100; });
    var pc = raw.map(Math.floor), left = 100 - pc.reduce(function (a, b) { return a + b; }, 0);
    raw.map(function (v, i) { return [v - pc[i], i]; }).sort(function (a, b) { return b[0] - a[0]; }).slice(0, left).forEach(function (q) { pc[q[1]]++; });
    [['e5', 'fast track ', pc[0]], ['e6', 'review ', pc[1]], ['e4', 'rule failed ', pc[2]]].forEach(function (q) {
      var p = paths[q[0]]; if (!p) return;
      var l = labs[q[0]]; if (!l) { l = labs[q[0]] = K.el('span', 'arn-el arn-el--' + q[0]); l.appendChild(K.el('b')); l.appendChild(document.createTextNode('')); dag.appendChild(l); }
      var m = at(p, q[0] === 'e5' ? .5 : q[0] === 'e6' ? .42 : .55); l.hidden = phone && q[0] !== 'e5';
      l.style.transform = 'translate(' + m[0].toFixed(1) + 'px,' + m[1].toFixed(1) + 'px)';
      l.firstChild.textContent = q[1]; l.lastChild.nodeValue = q[2] + '%';
    });
  }

  // ---------------------------------------------------------------- the simulation
  var bills = [], queue = [], desks = [null, null], touched = false, running = true, lastSpawn = 0, shown = null, pinned = null;
  var tally = { auto: 0, exc: 0, rej: 0, post: 0, pay: 0, 'in': 0 }, live = rng(97);
  // one virtual clock: pausing (or scrolling away) freezes every timer in the run
  var off = 0, pauseAt = 0;
  function clock() { return (pauseAt || performance.now()) - off; }
  function pause() { if (!pauseAt) pauseAt = performance.now(); }
  function resume() { if (pauseAt) { off += performance.now() - pauseAt; pauseAt = 0; } }
  function tok(b) { var t = K.el('i', 'arn-tok'); layer.appendChild(t); b.el = t; return t; }
  function cls(b) { return b.fail ? (b.fail === 'dup' || b.fail === 'nab' ? 'is-rej' : 'is-exc') : b.route === 'auto' ? 'is-auto' : b.route === 'rev' ? 'is-rev' : ''; }
  function paint(b) { if (b.el) b.el.className = 'arn-tok ' + cls(b) + (pinned === b ? ' is-follow' : ''); }
  function go(b, id, now) { var p = paths[id]; b.st = 'edge'; b.edge = id; b.t0 = now; b.dur = K.clamp(p.len / SPEED, 380, 1500); b.el.style.opacity = '1'; }
  function stay(b, node, now, ms) {
    b.st = 'node'; b.node = node; b.until = now + ms; b.el.style.opacity = '0';
    N[node].classList.add('is-busy'); K.restart(N[node], 'is-ping');
  }
  function free(node) { if (!bills.some(function (b) { return b.st === 'node' && b.node === node; })) N[node].classList.remove('is-busy'); }
  function spawn(now) {
    var b = makeBill(live, SC[sc]); b.row = row(b); tok(b); paint(b); bills.push(b);
    tally['in']++; count('in'); go(b, 'e1', now);
  }
  function count(k) { if (CNT[k]) { CNT[k].textContent = tally[k] ? String(tally[k]) : ''; CNT[k].classList.toggle('is-on', !!tally[k]); } }
  function kpis() {
    KP.auto.textContent = String(tally.auto); KP.exc.textContent = String(tally.exc); KP.rej.textContent = String(tally.rej);
    KP.rev.textContent = String(bills.filter(function (b) { return b.human && !b.posted; }).length);
    ['post', 'pay', 'exc', 'rej'].forEach(count);
    var wait = queue.length; qLab.textContent = wait ? wait + ' waiting · ' + (desks[1] ? 2 : 1) + (desks[1] ? ' clerks' : ' clerk') : 'AP clerk checks fields';
  }
  function arrive(b, node, now) {
    if (node === 'ocr') { stay(b, 'ocr', now, DW.ocr); step(b, 'Read ' + b.conf + '%'); if (!pinned) show(b); else if (pinned === b) show(b); }
    else if (node === 'rules') { stay(b, 'rules', now, DW.rules); lamps(b); }
    else if (node === 'gate') { stay(b, 'gate', now, DW.gate); }
    else if (node === 'exc') { stay(b, 'exc', now, DW.exc); tally.exc++; b.human = !(b.fail === 'dup' || b.fail === 'nab'); step(b, FAIL[b.fail], 'bad'); }
    else if (node === 'rej') { stay(b, 'rej', now, DW.rej); tally.rej++; step(b, 'Rejected, not posted', 'bad'); b.done = true; }
    else if (node === 'rev') { b.st = 'queue'; b.node = 'rev'; b.el.style.opacity = '1'; queue.push(b); step(b, 'Review queue'); placeQueue(); }
    else if (node === 'apr') { stay(b, 'apr', now, DW.apr); step(b, 'Approved'); }
    else if (node === 'post') {
      stay(b, 'post', now, DW.post); b.posted = true; tally.post++; if (b.route === 'auto') tally.auto++;
      b.no = 'BILL/2026/00' + (411 + tally.post); step(b, 'Posted ' + b.no, 'ok');
    }
    else if (node === 'pay') { stay(b, 'pay', now, DW.pay); tally.pay++; step(b, 'Payment ' + day(b.due), 'ok'); b.done = true; }
    if (b === shown) { state(b); if (node === 'post') je(b); }
    kpis(); paint(b);
  }
  function leave(b, now) {
    var n = b.node; b.el.style.opacity = '1';
    if (n === 'ocr') go(b, 'e2', now);
    else if (n === 'rules') { if (b.fail) go(b, 'e4', now); else { step(b, 'Rules 4/4'); go(b, 'e3', now); } }
    else if (n === 'gate') {
      b.route = b.conf >= T ? 'auto' : 'rev'; b.human = b.route === 'rev';
      step(b, b.route === 'auto' ? 'Fast track (≥ ' + T + '%)' : 'Below ' + T + '%'); go(b, b.route === 'auto' ? 'e5' : 'e6', now);
      if (b === shown) verdict(b);
    }
    else if (n === 'exc') { if (b.human) { b.route = 'rev'; step(b, b.fail === 'po' ? 'Buyer confirmed the PO' : 'Buyer confirmed the change'); go(b, 'e7', now); } else go(b, 'e8', now); }
    else if (n === 'apr') go(b, 'e10', now);
    else if (n === 'post') go(b, 'e11', now);
    else { b.st = 'gone'; b.el.classList.add('is-out'); var el = b.el; setTimeout(function () { el.remove(); }, 400); }
    free(n); paint(b);
  }
  var NEXT = { e1: 'ocr', e2: 'rules', e3: 'gate', e4: 'exc', e5: 'post', e6: 'rev', e7: 'rev', e8: 'rej', e9: 'apr', e10: 'post', e11: 'pay' };
  function placeQueue() {
    var bx = boxes.rev; if (!bx) return;
    queue.forEach(function (b, i) {
      var x = bx.r - 12 - (i % 8) * 9, y = bx.y - 8 - Math.floor(i / 8) * 9;
      b.el.style.transform = 'translate(' + (x - 5) + 'px,' + (y - 6) + 'px) scale(.72)';
      b.el.style.opacity = i < 16 ? '1' : '0';
    });
  }
  var loop = K.loop(function (real) {
    if (!running) return;
    var now = real - off;
    if (now - lastSpawn > SC[sc].every * (.75 + Math.random() * .5) && bills.length < 42) { lastSpawn = now; spawn(now); }
    // clerks at the review desk: a second one joins when the queue passes six
    desks.forEach(function (d, i) {
      if (d && now >= d.until) { var b = d.b; desks[i] = null; b.checked = true; step(b, 'Checked by AP' + (b.fail ? '' : ', ' + (1 + b.id % 2) + ' field' + (b.id % 2 ? 's' : '') + ' fixed')); b.el.style.opacity = '1'; go(b, 'e9', now); free('rev'); kpis(); }
      if (!desks[i] && queue.length && (i === 0 || queue.length > 6)) { var q = queue.shift(); desks[i] = { b: q, until: now + REVIEW }; q.st = 'desk'; q.el.style.opacity = '0'; N.rev.classList.add('is-busy'); K.restart(N.rev, 'is-ping'); placeQueue(); kpis(); }
    });
    for (var i = 0; i < bills.length; i++) {
      var b = bills[i];
      if (b.st === 'edge') {
        var q = (now - b.t0) / b.dur;
        if (q >= 1) arrive(b, NEXT[b.edge], now);
        else { var p = at(paths[b.edge], K.ease.inOut(q)); b.el.style.transform = 'translate(' + (p[0] - 5).toFixed(1) + 'px,' + (p[1] - 6).toFixed(1) + 'px)'; }
      } else if (b.st === 'node' && now >= b.until) leave(b, now);
    }
    bills = bills.filter(function (b) { return b.st !== 'gone'; });
  });

  // ---------------------------------------------------------------- the rules node lamps
  var lampT = [];
  function lamps(b) {
    lampT.forEach(clearTimeout); lampT = [];
    var L = K.$$('.arn-lamps i', dag), key = { po: 0, tol: 1, dup: 2, gst: 3, nab: 2 };
    L.forEach(function (l) { l.className = ''; });
    L.forEach(function (l, i) {
      lampT.push(setTimeout(function () { l.className = b.fail && key[b.fail] === i ? 'is-bad' : b.fail && key[b.fail] < i ? '' : 'is-ok'; }, K.reduce ? 0 : 120 + i * 170));
    });
  }

  // ---------------------------------------------------------------- the bill on the desk
  var fl = K.$('.arn-fields', root), rowsF = FIELDS.map(function (f) {
    var li = K.el('li'); li.appendChild(K.el('span', null, f)); var v = li.appendChild(K.el('b')); var bar = li.appendChild(K.el('i')); var s = bar.appendChild(K.el('s')); var pc = li.appendChild(K.el('em'));
    fl.appendChild(li); return { li: li, v: v, s: s, pc: pc };
  });
  function show(b) {
    shown = b;
    B.ref.textContent = b.ref; B.vendor.textContent = b.v;
    var vals = [b.v, b.ref, day(b.date) + ' 2026', b.po, money(b.sub), money(b.gst), money(b.tot)];
    rowsF.forEach(function (r, i) {
      r.v.textContent = vals[i]; r.pc.textContent = b.f[i] + '%';
      r.s.style.transform = 'scaleX(' + (b.f[i] / 100).toFixed(3) + ')';
      r.li.classList.toggle('is-weak', i === b.weak); r.li.classList.toggle('is-low', b.f[i] < T);
    });
    K.restart(fl, 'is-read');
    state(b); verdict(b); je(b);
  }
  function state(b) {
    var s = b.st === 'gone' || b.done ? (b.posted ? 'Paid by terms' : 'Closed') : b.posted ? 'Posted' : b.node === 'exc' ? 'Exception' : b.node === 'rev' || b.st === 'desk' ? 'In review' : b.node === 'apr' ? 'Approval' : b.node === 'rules' ? 'Checking rules' : 'Reading';
    B.state.textContent = s; B.state.className = b.fail ? 'is-bad' : b.posted ? 'is-ok' : '';
  }
  function verdict(b) {
    rowsF.forEach(function (r, i) { r.li.classList.toggle('is-low', b.f[i] < T); });
    var w = FIELDS[b.weak].toLowerCase(), t;
    if (b.fail) t = FAIL[b.fail] + ': exceptions, whatever the confidence.';
    else if (b.conf >= T) t = 'Lowest field ' + b.conf + '% (' + w + ') ≥ ' + T + '%: straight through to Odoo.';
    else t = 'Lowest field ' + b.conf + '% (' + w + ') < ' + T + '%: an AP clerk checks it.';
    B.verdict.textContent = t; B.verdict.className = 'arn-verdict ' + (b.fail ? 'is-bad' : b.conf >= T ? 'is-ok' : 'is-warn');
  }
  function je(b) {
    var j = B.je; j.textContent = ''; j.hidden = !b.posted; if (!b.posted) return;
    var h = K.el('p'); h.appendChild(K.el('b', null, b.no)); h.appendChild(K.el('span', null, 'journal entry')); j.appendChild(h);
    [['Received, not billed', b.sub, 0], ['GST input tax 9%', b.gst, 0], ['Payables · ' + b.v, 0, b.tot]].forEach(function (l) {
      var r = K.el('div', l[2] ? 'is-cr' : null); r.appendChild(K.el('span', null, l[0])); r.appendChild(K.el('em', null, (l[1] ? 'Dr ' : 'Cr ') + money(l[1] || l[2]))); j.appendChild(r);
    });
  }

  // ---------------------------------------------------------------- the trace log (one row per bill, built from text nodes)
  function row(b) {
    var li = K.el('li'), btn = li.appendChild(K.el('button', 'arn-row')); btn.type = 'button';
    btn.setAttribute('aria-label', 'Follow ' + b.ref + ' from ' + b.v);
    var h = btn.appendChild(K.el('span', 'arn-rh')); h.appendChild(K.el('i')); h.appendChild(K.el('b', null, b.ref)); h.appendChild(K.el('span', null, b.v)); h.appendChild(K.el('em', null, 'S$ ' + money(b.tot)));
    btn.appendChild(K.el('span', 'arn-rs'));
    btn.addEventListener('click', function () { touched = true; follow(pinned === b ? null : b); });
    logEl.insertBefore(li, logEl.firstChild);
    var all = K.$$('li', logEl); while (all.length > 6) { var gone = all.pop(); gone.remove(); }
    return li;
  }
  function step(b, text, kind) {
    if (!b.row) return;
    var s = K.$('.arn-rs', b.row); if (s.childNodes.length) s.appendChild(K.el('i', 'arn-ar'));
    s.appendChild(K.el('span', kind ? 'is-' + kind : null, text));
    b.row.className = cls(b) + (pinned === b ? ' is-pin' : '');
  }
  function follow(b) {
    var prev = pinned; pinned = b;
    if (prev && prev.el) paint(prev);
    K.$$('li', logEl).forEach(function (li) { li.classList.toggle('is-pin', !!b && li === b.row); });
    B.follow.textContent = b ? 'following ' + b.ref : 'latest read';
    if (b) { paint(b); show(b); }
  }

  // ---------------------------------------------------------------- hover details on the nodes
  Object.keys(N).forEach(function (k) {
    var n = N[k];
    function on() { var b = boxes[k] || K.box(n, dag), low = b.y < 90; tip.show(TIPS[k], b.cx, low ? b.b : b.y, low); }
    n.addEventListener('pointerenter', on); n.addEventListener('focus', on);
    n.addEventListener('pointerleave', function () { tip.hide(); }); n.addEventListener('blur', function () { tip.hide(); });
  });

  // ---------------------------------------------------------------- controls
  function reset() {
    bills.forEach(function (b) { if (b.el) b.el.remove(); }); bills = []; queue = []; desks = [null, null]; pinned = null; shown = null;
    Object.keys(tally).forEach(function (k) { tally[k] = 0; }); logEl.textContent = ''; B.follow.textContent = 'latest read';
    K.$$('.arn-n', dag).forEach(function (n) { n.classList.remove('is-busy'); });
    sample(); drawHist(); edgeLabels(); kpis();
  }
  K.$$('[data-sc]', root).forEach(function (b) {
    b.addEventListener('click', function () {
      touched = true; sc = b.dataset.sc;
      K.$$('[data-sc]', root).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      reset(); if (K.reduce) still(); else lastSpawn = -1e9;
    });
  });
  playBtn.addEventListener('click', function () {
    running = !running; touched = true;
    playBtn.classList.toggle('is-paused', !running); K.$('span', playBtn).textContent = running ? 'Pause' : 'Play';
    root.classList.toggle('is-paused', !running);
    if (running) resume(); else pause();
  });

  // reduced motion: the sample batch at the current threshold, as a finished run
  function still() {
    var s = split();
    tally.auto = s.auto; tally.exc = s.exc + s.rej; tally.rej = s.rej; tally.post = s.auto + s.rev + s.exc; tally.pay = tally.post; tally['in'] = batch.length;
    kpis(); KP.rev.textContent = String(s.rev + s.exc); K.$('dt', KP.rev.parentNode).textContent = 'Checked by a person'; ['in', 'post', 'pay', 'exc', 'rej'].forEach(count);
    logEl.textContent = ''; var picks = [batch.filter(function (b) { return b.fail === 'dup'; })[0], batch.filter(function (b) { return b.fail === 'po'; })[0], batch.filter(function (b) { return !b.fail && b.conf < T; })[0], batch.filter(function (b) { return !b.fail && b.conf >= T; })[0]];
    picks.forEach(function (b) {
      if (!b) return; b.row = row(b); step(b, 'Read ' + b.conf + '%');
      if (b.fail) { step(b, FAIL[b.fail], 'bad'); step(b, b.fail === 'dup' ? 'Rejected, not posted' : 'Buyer confirmed the PO', b.fail === 'dup' ? 'bad' : null); if (b.fail !== 'dup') { step(b, 'Approved'); step(b, 'Posted', 'ok'); } }
      else if (b.conf >= T) { b.route = 'auto'; step(b, 'Rules 4/4'); step(b, 'Batch approved by Finance'); step(b, 'Posted', 'ok'); step(b, 'Payment ' + day(b.due), 'ok'); }
      else { b.route = 'rev'; step(b, 'Rules 4/4'); step(b, 'Review'); step(b, 'Approved'); step(b, 'Posted', 'ok'); }
      b.row.className = cls(b);
    });
    var b0 = batch.filter(function (b) { return !b.fail; })[0]; show(b0); B.state.textContent = 'Sample bill';
  }

  var rt = 0;
  window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { layout(); drawHist(); }, 140); });
  if (K.reduce) playBtn.hidden = true;
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { layout(); drawHist(); });
  sample(); layout(); drawHist(); kpis();
  return {
    start: function (first) {
      layout(); drawHist();
      if (K.reduce) { if (first) still(); return; }
      if (first) { pauseAt = 0; lastSpawn = clock() - SC[sc].every + 300; }
      if (running) resume();
      loop.on();
    },
    stop: function () { pause(); loop.off(); }
  };
});
