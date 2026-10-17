/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* Odoo discovery page: one order through a sample distributor, today and with Odoo. Today is a
   tangle of WhatsApp, email, spreadsheets, paper delivery orders and re-typing, with illustrative
   counts of hand-offs, re-keyed fields and waiting days read off the map. The toggle morphs each
   step into the Odoo app that replaces it and carries each numbered pain point onto its fix. The
   walk-through plays the method: interviews, process map, app mapping, gaps, written scope. */
TN.demo('asis', function (root, K) {
  var stage = K.$('.asis-stage', root), svg = K.$('.asis-svg', root), pillBox = K.$('.asis-pills', root);
  var badgeBox = K.$('.asis-badges', root), cap = K.$('.asis-cap', root), capB = K.$('b', cap), capS = K.$('span', cap);
  var list = K.$('.asis-pains', root), db = K.$('.asis-db', root), walkBtn = K.$('[data-walk]', root), walkLbl = K.$('span', walkBtn);
  var segs = K.$$('[data-state]', root), wsteps = K.$$('.asis-ws', root);
  var kH = K.$('[data-k="h"]', root), kK = K.$('[data-k="k"]', root), kW = K.$('[data-k="w"]', root), kL = K.$('[data-k="lbl"]', root);
  var tip = K.tip(stage);

  /* ------------------------------------------------------------------ the sample map */
  // a/b: today and with Odoo [x%, y%]; an/bn: the same on a phone; into: folded into that app;
  // app: the Odoo app it maps to; r: tilt today (sticky notes); ta/tb: hover text
  var ND = {
    cust: { t: 'Customer', a: [9, 36], b: [8, 18], an: [24, 20], bn: [27, 5], app: ['website_sale', 'Portal'], r: -2.2,
      ta: 'Orders come in on WhatsApp, by email and by phone, each in its own format.',
      tb: 'Customers order on the portal at their own prices and sign quotations online.' },
    chat: { t: 'Sales', a: [27, 11], b: [29, 18], an: [73, 5], bn: [73, 5], app: ['crm', 'CRM'], r: 1.8,
      ta: 'Orders are forwarded as screenshots in the team chat. Nobody sees the full list.',
      tb: 'Every request becomes one record in CRM: from the portal, a web form or an email alias.' },
    price: { t: 'Sales', a: [13, 68], an: [27, 33], into: 'quote', app: ['sale', 'Pricelists'], r: -1.4,
      ta: "Each rep keeps a copy of the price list, and not every copy is this year's." },
    quote: { t: 'Sales', a: [35, 39], b: [50, 18], an: [74, 19], bn: [73, 19], app: ['sale', 'Sales'], r: 1.2,
      ta: 'Quotes are typed into a document, saved as PDF and emailed.',
      tb: "The quotation takes the customer's pricelist and shows stock on every line." },
    boss: { t: 'Manager', a: [51, 10], b: [50, 52], an: [26, 7], bn: [27, 19], app: ['approvals', 'Approval'], r: -1.6,
      ta: "Discounts over 10% wait in the manager's inbox until someone chases.",
      tb: 'Orders over the discount limit wait for the manager, who approves inside Odoo.' },
    log: { t: 'Sales admin', a: [61, 37], an: [73, 33], into: 'stock', app: ['stock', 'Inventory'], r: 2,
      ta: 'Confirmed orders are re-typed into an order log and emailed to the warehouse.' },
    dockt: { t: 'Warehouse', a: [86, 58], an: [74, 46], into: 'stock', app: ['stock', 'Inventory'], r: -2.4,
      ta: 'Delivery orders are written by hand. The signed copy comes back days later.' },
    stock: { t: 'Warehouse', a: [46, 66], b: [71, 18], an: [26, 47], bn: [73, 34], app: ['stock', 'Inventory'], r: 1.5,
      ta: 'The stock sheet is updated at the end of the day, so it is always behind.',
      tb: 'Stock moves with every receipt and delivery. Deliveries are validated by barcode and signed on the spot.' },
    po: { t: 'Purchasing', a: [30, 89], b: [71, 52], an: [25, 60], bn: [27, 34], app: ['purchase', 'Purchase'], r: -1.2,
      ta: 'A purchase order goes out by email when someone notices an empty shelf.',
      tb: 'Reordering rules raise the request for quotation before the shelf runs out.' },
    sup: { t: 'Supplier', a: [9, 88], b: [71, 86], an: [27, 73], bn: [27, 49], app: ['purchase', 'Purchase'], r: 2.2,
      ta: 'Receives the PO by email and sends the bill on paper.',
      tb: 'Receives the PO from Odoo. The bill is digitised and matched to the order and the receipt.' },
    acc: { t: 'Finance', a: [74, 12], b: [92, 18], an: [73, 60], bn: [73, 49], app: ['accountant', 'Accounting'], r: -1.8,
      ta: 'Invoices and bills are keyed by hand into a separate accounts package.',
      tb: 'Invoices from delivered quantities with GST 9%, bills matched, bank lines reconciled, reports live.' },
    bank: { t: 'Finance', a: [92, 33], b: [92, 52], an: [74, 73], bn: [73, 64], app: ['accountant', 'Bank feed'], r: 1.4,
      ta: 'The bank statement arrives as a PDF and every line is ticked off by hand.',
      tb: 'Statement lines arrive on the bank feed; reconciliation rules match most of them.' },
    rep: { t: 'Finance', a: [67, 89], an: [50, 87], into: 'acc', app: ['spreadsheet_dashboard', 'Reporting'], r: -1,
      ta: 'Month-end reports are rebuilt in Excel from exports, which takes days.' }
  };
  var ORDER = ['cust', 'chat', 'price', 'quote', 'boss', 'log', 'dockt', 'stock', 'po', 'sup', 'acc', 'bank', 'rep'];
  // today: id, from, to, channel (msg · key · paper), hand-off, fields re-keyed, days waiting, what happens, bend
  var EA = [
    ['a1', 'cust', 'chat', 'msg', 1, 0, 0, 'Order sent on WhatsApp', .22],
    ['a2', 'chat', 'quote', 'msg', 0, 0, 0, 'A rep drafts the quote', -.2],
    ['a3', 'chat', 'stock', 'msg', 1, 0, .5, 'In stock? Ask the warehouse', .3],
    ['a4', 'price', 'quote', 'key', 0, 6, 0, 'Prices copied by hand', .2],
    ['a5', 'quote', 'boss', 'msg', 1, 0, 1.5, 'Discount approval by email', .26],
    ['a6', 'boss', 'quote', 'msg', 1, 0, 0, 'Approved by reply', .26],
    ['a7', 'quote', 'cust', 'msg', 1, 0, 1, 'PDF quote emailed', .28],
    ['a8', 'cust', 'log', 'key', 1, 8, 0, 'Confirmed by email, re-typed', -.28],
    ['a9', 'log', 'dockt', 'paper', 1, 7, 0, 'Delivery order written by hand', .2],
    ['a10', 'dockt', 'stock', 'key', 0, 4, 1, 'Stock sheet updated at day end', .16],
    ['a11', 'dockt', 'acc', 'paper', 1, 9, 2, 'Signed copy back, invoice keyed', -.2],
    ['a12', 'stock', 'po', 'msg', 1, 6, 0, 'Shelf empty: PO by email', .2],
    ['a13', 'po', 'sup', 'msg', 1, 0, 0, 'PO sent', .25],
    ['a14', 'sup', 'acc', 'paper', 1, 8, 1, 'Paper bill keyed and matched', .1],
    ['a15', 'bank', 'acc', 'key', 0, 3, 1, 'Statement ticked by hand', .3],
    ['a16', 'acc', 'rep', 'key', 0, 12, 3, 'Exports rebuilt in Excel', .14]
  ];
  // with Odoo: id, from, to, hand-off, days waiting, what happens, route [wide, phone], offset
  var EB = [
    ['b1', 'cust', 'chat', 0, 0, 'Portal or email alias', ['h', 'h']],
    ['b2', 'chat', 'quote', 0, 0, 'Quotation from the request', ['h', 'v']],
    ['b3', 'quote', 'boss', 1, .5, 'Over the discount limit', ['v', 'h'], -11],
    ['b4', 'boss', 'quote', 0, 0, 'Approved in Odoo', ['v', 'h'], 11],
    ['b5', 'quote', 'stock', 0, 0, 'Confirmed: delivery created', ['h', 'v']],
    ['b6', 'stock', 'acc', 0, 0, 'Invoice from delivered qty', ['h', 'v']],
    ['b7', 'stock', 'po', 0, 0, 'Reordering rule: RFQ', ['v', 'h']],
    ['b8', 'po', 'sup', 0, 0, 'PO sent from Odoo', ['v', 'v'], -11],
    ['b9', 'sup', 'po', 1, .5, 'Bill matched to PO and receipt', ['v', 'v'], 11],
    ['b10', 'bank', 'acc', 0, 0, 'Bank feed matched by rules', ['v', 'v']]
  ];
  // pain point: where it sits today (edge or node), where its fix sits with Odoo, pain, fix, app
  var PAIN = [
    ['a1', 'chat', 'Orders arrive on WhatsApp, email and phone', 'Every request lands in CRM, from the portal, a web form or an email alias', 'crm'],
    ['a4', 'quote', 'Prices copied from a spreadsheet into each quote', 'Pricelists put the right price on the quotation', 'sale'],
    ['a3', 'stock', 'Stock checked by messaging the warehouse', 'The quotation shows on-hand and forecast stock', 'stock'],
    ['a5', 'boss', 'Discount approvals chased by email', 'An approval rule sends over-limit discounts to the manager in Odoo', 'approvals'],
    ['a8', 'b5', 'The confirmed order is re-typed for the warehouse', 'Confirming the order creates the delivery order', 'sale'],
    ['dockt', 'stock', 'Handwritten delivery orders, signed copy back days later', 'Deliveries validated by barcode and signed on the spot', 'stock'],
    ['a11', 'acc', 'Invoices keyed from the signed delivery order', 'The invoice comes from delivered quantities, with GST 9%', 'accountant'],
    ['a12', 'po', 'Reorders only when someone notices an empty shelf', 'Reordering rules raise the RFQ; bills match the PO and receipt', 'purchase'],
    ['a15', 'acc', 'Bank lines ticked by hand, month-end rebuilt in Excel', 'The bank feed is matched by rules; P&L and GST report read live', 'accountant']
  ];
  var GAPS = [['cust', 'dat', 'Data', 'customers, products'], ['quote', 'cfg', 'Config', 'pricelists'], ['boss', 'cfg', 'Config', 'approval limit'],
              ['stock', 'cfg', 'Config', 'reorder rules'], ['bank', 'int', 'Integration', 'bank feed'], ['acc', 'cus', 'Custom', 'volume rebates']];
  var TEAMS = [['Sales', ['cust', 'chat', 'price', 'quote', 'boss'], 'Orders come in on WhatsApp, prices from a spreadsheet, discounts approved by email.'],
               ['Warehouse', ['log', 'dockt', 'stock'], 'Orders arrive by email, delivery orders are handwritten, the stock sheet is updated at day end.'],
               ['Purchasing', ['po', 'sup'], 'Reorders go out by email when a shelf looks empty; bills come back on paper.'],
               ['Finance', ['acc', 'bank', 'rep'], 'Invoices typed from signed delivery orders, bank lines ticked by hand, month-end in Excel.']];
  var STEPS = [['Interviews', 'We sit with sales, the warehouse, purchasing and finance and write down what each team does with an order.'],
               ['Process map', 'Every hand-off, re-typed field and wait between order and cash, drawn with the people who do the work.'],
               ['App mapping', 'Each step is matched to a standard Odoo app. Spreadsheets and paper fold into the app that replaces them.'],
               ['Gaps', 'Anything standard Odoo does not cover is flagged as configuration, integration, custom work or data, and sized.'],
               ['Written scope', 'Apps in order, gaps, data, integrations and training: a scope you keep, priced in a quotation.']];
  var DUR = [4800, 4300, 3400, 3600, 5600];
  var JA = [['a1', 'a2', 'a5', 'a6', 'a7', 'a8', 'a9', 'a11', 'a14'], ['a3'], ['a4'], ['a10', 'a12', 'a13'], ['a15', 'a16']];
  var JB = [['b1', 'b2', 'b3', 'b4', 'b5', 'b6'], ['b7', 'b8', 'b9'], ['b10']];

  /* ------------------------------------------------------------------ build */
  var NODE = {}, EDGE = {}, nodes = [];
  function oimg(mod) {                        // an Odoo app icon, built without markup strings
    var i = K.el('img', 'oi'); i.src = K.root + 'assets/img/odoo/' + mod + '.svg'; i.alt = ''; i.width = i.height = 14; return i;
  }
  ORDER.forEach(function (id, k) {
    var d = ND[id], el = K.$('[data-n="' + id + '"]', root), card = K.$('.asis-card', el);
    el.style.setProperty('--k', k);
    var n = { id: id, el: el, card: card, fa: K.$('.asis-fa', el), fb: K.$('.asis-fb', el), k: k, d: d, into: d.into, r: d.r, w: 120, h: 44, x: 0, y: 0 };
    n.ta = K.$('b', n.fa).textContent; n.tb = n.fb ? K.$('b', n.fb).textContent : '';
    card.appendChild(K.el('em', 'asis-team', d.t));
    var app = K.el('em', 'asis-app'); app.appendChild(oimg(d.app[0])); app.appendChild(K.el('span', null, d.app[1])); card.appendChild(app);
    NODE[id] = n; nodes.push(n);
    card.addEventListener('pointerenter', function () {
      if (anim || +el.style.opacity < .5) return;
      var tobe = mix > .5, low = n.y < H * .3;
      tip.show([d.t + ' · ' + (tobe && n.fb ? n.tb : n.ta), tobe && d.tb ? d.tb : d.ta], n.x, low ? n.y + n.h / 2 + 4 : n.y - n.h / 2 - 2, low);
      if (tobe) EB.forEach(function (r) { if (r[1] === id || r[2] === id) EDGE[r[0]].pill.classList.add('is-show'); });
    });
    card.addEventListener('pointerleave', function () { tip.hide(); K.$$('.asis-lb.is-show', root).forEach(function (l) { l.classList.remove('is-show'); }); });
  });
  GAPS.forEach(function (g, i) { var t = K.el('em', 'asis-gap asis-gap--' + g[1]); t.style.setProperty('--i', i); t.appendChild(K.el('b', null, g[2])); t.appendChild(document.createTextNode(' ' + g[3])); NODE[g[0]].card.appendChild(t); });

  var defs = K.svg('defs', {}), mk = K.svg('marker', { id: 'asis-ar', viewBox: '0 0 10 10', refX: 7, refY: 5, markerWidth: 6.5, markerHeight: 6.5, orient: 'auto-start-reverse' });
  mk.appendChild(K.svg('path', { d: 'M1 1.5 8.5 5 1 8.5z' })); defs.appendChild(mk); svg.appendChild(defs);
  var gA = svg.appendChild(K.svg('g', { 'class': 'asis-ga' })), gB = svg.appendChild(K.svg('g', { 'class': 'asis-gb' })), gT = svg.appendChild(K.svg('g', { 'class': 'asis-gt' }));
  var pillA = K.el('div', 'asis-pa'), pillB = K.el('div', 'asis-pb'); pillBox.appendChild(pillA); pillBox.appendChild(pillB);
  var TA = { h: 0, k: 0, w: 0 }, TB = { h: 0, k: 0, w: 0 };
  EA.forEach(function (r, q) {
    var e = { id: r[0], a: r[1], b: r[2], ch: r[3], h: r[4], k: r[5], w: r[6], label: r[7], bend: r[8], q: q, today: true, pt: .5 };
    e.p = K.svg('path', { 'class': 'asis-e asis-e--' + e.ch, pathLength: 1 }); e.p.style.setProperty('--d', (q * 150) + 'ms'); gA.appendChild(e.p);
    if (e.k || e.w) {
      e.pill = K.el('span', 'asis-pill'); e.pill.style.setProperty('--d', (q * 150 + 380) + 'ms');
      if (e.k) e.pill.appendChild(K.el('b', 'asis-pk', e.k + ' fields'));
      if (e.w) e.pill.appendChild(K.el('b', 'asis-pw', e.w + ' d'));
      pillA.appendChild(e.pill);
    }
    TA.h += e.h; TA.k += e.k; TA.w += e.w;
    EDGE[e.id] = e;
  });
  EB.forEach(function (r) {
    var e = { id: r[0], a: r[1], b: r[2], h: r[3], w: r[4], label: r[5], route: r[6], o: r[7] || 0, live: 0 };
    e.p = K.svg('path', { 'class': 'asis-e asis-e--auto', 'marker-end': 'url(#asis-ar)' }); gB.appendChild(e.p);
    e.pill = K.el('span', 'asis-lb', e.label); pillB.appendChild(e.pill);
    TB.h += e.h; TB.w += e.w;
    EDGE[e.id] = e;
  });
  var pains = PAIN.map(function (p, i) {
    var b = K.el('button', 'asis-b'); b.type = 'button'; b.textContent = String(i + 1);
    b.setAttribute('aria-label', 'Pain point ' + (i + 1) + ': ' + p[2] + '. Fix: ' + p[3] + '.');
    b.style.setProperty('--d', (EA.length * 150 + 300 + i * 90) + 'ms');
    badgeBox.appendChild(b);
    var li = K.el('li'), btn = K.el('button', 'asis-p'); btn.type = 'button';
    btn.appendChild(K.el('i', null, String(i + 1)));
    var s = K.el('span'); s.appendChild(K.el('b', null, p[2]));
    var sm = K.el('small'); sm.appendChild(oimg(p[4])); sm.appendChild(K.el('span', null, p[3])); s.appendChild(sm);
    btn.appendChild(s); li.appendChild(btn); list.appendChild(li);
    var P = { i: i, b: b, li: btn, from: p[0], to: p[1], pain: p[2], fix: p[3], pa: [0, 0], pb: [0, 0], pos: [0, 0] };
    [b, btn].forEach(function (x) {
      x.addEventListener('pointerenter', function () { hot(P, true); }); x.addEventListener('pointerleave', function () { hot(P, false); });
      x.addEventListener('focus', function () { hot(P, true); }); x.addEventListener('blur', function () { hot(P, false); });
    });
    return P;
  });

  /* ------------------------------------------------------------------ geometry */
  var W = 1, H = 1, narrow = false;
  function size() {
    W = stage.offsetWidth || 1; narrow = W < 560;
    root.classList.toggle('is-narrow', narrow); H = stage.offsetHeight || 1;
    stage.style.setProperty('--nw', (narrow ? K.clamp(W * .31, 96, 132) : K.clamp(W * .165, 108, 150)).toFixed(0) + 'px');
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    nodes.forEach(function (n) {
      n.w = n.el.offsetWidth; n.h = n.el.offsetHeight;
      var a = narrow ? n.d.an : n.d.a, b = narrow ? n.d.bn : n.d.b;
      n.pa = [a[0] / 100 * W, a[1] / 100 * H]; n.pb = b ? [b[0] / 100 * W, b[1] / 100 * H] : null;
    });
    nodes.forEach(function (n) { if (n.into) n.pb = NODE[n.into].pb; });
    var dp = narrow ? [50, 80] : [25, 74];
    db.style.transform = 'translate(' + (dp[0] / 100 * W - db.offsetWidth / 2).toFixed(1) + 'px,' + (dp[1] / 100 * H - db.offsetHeight / 2).toFixed(1) + 'px)';
    EA.forEach(function (r) { var e = EDGE[r[0]]; if (e.pill) { e.pw = e.pill.offsetWidth; e.ph = e.pill.offsetHeight; } });
    EB.forEach(function (r) { var e = EDGE[r[0]]; e.pw = e.pill.offsetWidth; });
    var keep = mix;
    setPos(1); pains.forEach(function (p) { p.pb = anchor(p.to, 1, p.i); });
    setPos(0); place();
    mix = keep; render();
  }
  function setPos(m) { nodes.forEach(function (n) { var b = n.pb || n.pa; n.x = K.lerp(n.pa[0], b[0], m); n.y = K.lerp(n.pa[1], b[1], m); }); }
  function bx(n) { return { x: n.x, y: n.y, w: n.w, h: n.h, l: n.x - n.w / 2, r: n.x + n.w / 2, t: n.y - n.h / 2, b: n.y + n.h / 2 }; }
  function clip(n, to) {                      // where a line from the card centre towards `to` leaves the card
    var dx = to[0] - n.x, dy = to[1] - n.y, t = Math.min(dx ? (n.w / 2 + 3) / Math.abs(dx) : 1e9, dy ? (n.h / 2 + 3) / Math.abs(dy) : 1e9);
    return [n.x + dx * t, n.y + dy * t];
  }
  function bez(e) {                           // today: a hand-drawn cubic, bent sideways
    var A = NODE[e.a], B = NODE[e.b], dx = B.x - A.x, dy = B.y - A.y, L = Math.hypot(dx, dy) || 1;
    var o = e.bend * L, nx = -dy / L * o, ny = dx / L * o;
    var c1 = [A.x + dx * .3 + nx, A.y + dy * .3 + ny], c2 = [A.x + dx * .7 + nx, A.y + dy * .7 + ny];
    return [clip(A, c1), c1, c2, clip(B, c2)];
  }
  function bAt(z, t) { var u = 1 - t; return [0, 1].map(function (i) { return u * u * u * z[0][i] + 3 * u * u * t * z[1][i] + 3 * u * t * t * z[2][i] + t * t * t * z[3][i]; }); }
  function bD(z) { var f = function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }; return 'M' + f(z[0]) + 'C' + f(z[1]) + ' ' + f(z[2]) + ' ' + f(z[3]); }
  function ortho(e) {                         // with Odoo: tidy right-angled routes
    var A = bx(NODE[e.a]), B = bx(NODE[e.b]), r = e.route[narrow ? 1 : 0], o = e.o, sx = B.x > A.x ? 1 : -1, sy = B.y > A.y ? 1 : -1;
    if (r === 'h') return [[sx > 0 ? A.r : A.l, A.y + o], [(sx > 0 ? B.l : B.r) - sx * 4, B.y + o]];
    return [[A.x + o, sy > 0 ? A.b : A.t], [B.x + o, (sy > 0 ? B.t : B.b) - sy * 4]];
  }
  function mid(pts) { return [(pts[0][0] + pts[1][0]) / 2, (pts[0][1] + pts[1][1]) / 2]; }
  function anchor(ref, m, i) {
    var n = NODE[ref];
    if (n) {                                  // several fixes on one app line up along its top edge
      var same = pains.filter(function (p) { return (m ? p.to : p.from) === ref; }), k = same.indexOf(pains[i]);
      return [n.x + n.w / 2 - 4 - k * 22, n.y - n.h / 2 + 2];
    }
    var e = EDGE[ref];
    return e.today ? bAt(bez(e), .4) : mid(ortho(e));
  }
  function spot(z, t, o) {                    // a point on a curve, nudged o px along its normal
    var a = bAt(z, t), b = bAt(z, Math.min(1, t + .02)), dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
    return [a[0] - dy / l * o, a[1] + dx / l * o];
  }
  // today's badges and line labels: slide each along its curve until it sits clear of the cards and of each other
  function place() {
    var R = nodes.map(function (n) { return [n.x - n.w / 2 - 3, n.y - n.h / 2 - 3, n.x + n.w / 2 + 3, n.y + n.h / 2 + 3]; });
    function clear(r) { return r[0] > 2 && r[2] < W - 2 && R.every(function (q) { return r[2] < q[0] || r[0] > q[2] || r[3] < q[1] || r[1] > q[3]; }); }
    var T = [.5, .4, .6, .32, .68, .25, .75, .18, .82], O = [0, 15, -15, 28, -28];
    function find(z, hw, hh) {
      for (var i = 0; i < O.length; i++) for (var j = 0; j < T.length; j++) {
        var c = spot(z, T[j], O[i]), r = [c[0] - hw, c[1] - hh, c[0] + hw, c[1] + hh];
        if (clear(r)) { R.push(r); return { t: T[j], o: O[i], c: c }; }
      }
      return null;
    }
    pains.forEach(function (p) {
      var e = EDGE[p.from];
      if (!e) { var a = anchor(p.from, 0, p.i); R.push([a[0] - 12, a[1] - 12, a[0] + 12, a[1] + 12]); p.pa = a; return; }
      var got = find(bez(e), 13, 13);
      p.pa = got ? got.c : bAt(bez(e), .4);
    });
    EA.forEach(function (row) {
      var e = EDGE[row[0]]; if (!e.pill) return;
      var got = find(bez(e), e.pw / 2 + 2, e.ph / 2 + 2);
      e.pt = got ? got.t : .55; e.po = got ? got.o : 0;
    });
  }
  // with Odoo, a label shows while an order travels its line: under the row for a sideways hop, beside a vertical one
  function lbl(e) {
    var p = e.pts, r = e.route[narrow ? 1 : 0], A = bx(NODE[e.a]), B = bx(NODE[e.b]);
    if (r === 'h') { var m = mid(p); return e.o ? [m[0], m[1] + (e.o < 0 ? -12 : 12), 'c'] : [m[0], Math.max(A.b, B.b) + 22, 'c']; }
    var left = e.o < 0 || p[0][0] + 8 + e.pw > W - 6;                   // keep the label inside the map
    return [p[0][0] + (left ? -8 : 8), (p[0][1] + p[1][1]) / 2, left ? 'l' : 'r'];
  }

  /* ------------------------------------------------------------------ render one frame of the morph */
  var mix = 0, anim = null;
  function sm(a, b, v) { var t = K.clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); }
  function tr(el, x, y) { el.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)'; }
  function render() {
    nodes.forEach(function (n) {
      var q = K.ease.inOut(K.clamp(mix * 1.3 - n.k / nodes.length * .3, 0, 1)), b = n.pb || n.pa;
      n.x = K.lerp(n.pa[0], b[0], q); n.y = K.lerp(n.pa[1], b[1], q);
      var s = 1, o = 1;
      if (n.into) { var f = sm(.4, 1, q); s = 1 - .55 * f; o = 1 - f; }
      n.el.style.transform = 'translate3d(' + (n.x - n.w / 2).toFixed(1) + 'px,' + (n.y - n.h / 2).toFixed(1) + 'px,0) rotate(' + (n.r * (1 - q)).toFixed(2) + 'deg) scale(' + s.toFixed(3) + ')';
      n.el.style.opacity = o.toFixed(3);
      n.el.style.pointerEvents = o < .5 ? 'none' : '';
      if (n.fb) { var f2 = sm(.35, .65, q); n.fa.style.opacity = (1 - f2).toFixed(3); n.fb.style.opacity = f2.toFixed(3); }
    });
    EA.forEach(function (r) { var e = EDGE[r[0]]; e.z = bez(e); e.g = null; e.p.setAttribute('d', bD(e.z)); if (e.pill) { var p = spot(e.z, e.pt, e.po || 0); tr(e.pill, p[0], p[1]); } });
    EB.forEach(function (r) {
      var e = EDGE[r[0]]; e.pts = ortho(e); e.g = null; e.p.setAttribute('d', K.path(e.pts, 9));
      var l = lbl(e); tr(e.pill, l[0], l[1]); e.pill.classList.toggle('is-l', l[2] === 'l'); e.pill.classList.toggle('is-r', l[2] === 'r');
    });
    var oa = 1 - sm(0, .4, mix), ob = sm(.55, 1, mix);
    gA.style.opacity = pillA.style.opacity = oa.toFixed(3); gB.style.opacity = pillB.style.opacity = ob.toFixed(3);
    db.style.opacity = sm(.75, 1, mix).toFixed(3);
    var mq = K.ease.inOut(mix);
    pains.forEach(function (p) { p.pos = [K.lerp(p.pa[0], p.pb[0], mq), K.lerp(p.pa[1], p.pb[1], mq)]; tr(p.b, p.pos[0], p.pos[1]); });
    var tobe = mix > .5;
    if (tobe !== root.classList.contains('is-b')) { root.classList.toggle('is-b', tobe); pains.forEach(function (p) { p.b.classList.toggle('is-fix', tobe); }); }
  }

  /* ------------------------------------------------------------------ counters and highlight */
  function half(v) { return String(Math.round(v * 2) / 2); }
  function cnt(node, to, dur, fmt) {          // a counter that a newer count cancels
    fmt = fmt || function (v) { return String(Math.round(v)); };
    var from = +node.dataset.v || 0, id = node.__c = (node.__c || 0) + 1, t0 = performance.now();
    node.dataset.v = to;
    if (K.reduce || !dur) { node.textContent = fmt(to); return; }
    (function f() { if (node.__c !== id) return; var q = K.clamp((performance.now() - t0) / dur, 0, 1); node.textContent = fmt(K.lerp(from, to, K.ease.out(q))); if (q < 1) requestAnimationFrame(f); })();
  }
  function counts(which, dur) {
    var t = which === 1 ? TB : which === 0 ? TA : { h: 0, k: 0, w: 0 };
    cnt(kH, t.h, dur); cnt(kK, t.k, dur); cnt(kW, t.w, dur, half);
    kL.textContent = which === 1 ? 'with Odoo' : 'today';
    kK.parentNode.classList.toggle('dm-ok', which === 1);
  }
  var hotP = null;
  function hot(p, on) {
    if (!on && hotP !== p) return;
    if (hotP && on) hot(hotP, false);
    hotP = on ? p : null;
    stage.classList.toggle('is-peek', on); p.b.classList.toggle('is-hot', on); p.li.classList.toggle('is-hot', on);
    var ref = mix > .5 ? p.to : p.from, n = NODE[ref], e = EDGE[ref];
    if (n) n.el.classList.toggle('is-hot', on);
    if (e) { e.p.classList.toggle('is-hot', on); if (e.pill) e.pill.classList.toggle('is-hot', on); }
    var low = p.pos[1] < H * .3;
    if (on) tip.show(['#' + (p.i + 1) + ' · ' + p.pain, 'Fix: ' + p.fix], p.pos[0], p.pos[1] + (low ? 14 : -14), low); else tip.hide();
  }

  /* ------------------------------------------------------------------ orders moving through the map */
  var toks = [], nextAt = [], dayN = 1, handN = 0, fieldsN = 0, running = false;
  // arc-length tables so tokens keep an even speed along curves and right-angled routes
  function geo(e) {
    if (e.g) return e.g;
    var pts = [], i;
    if (e.today) for (i = 0; i <= 24; i++) pts.push(bAt(e.z, i / 24)); else pts = e.pts;
    var cum = [0];
    for (i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    return (e.g = { pts: pts, cum: cum, L: cum[cum.length - 1] || 1 });
  }
  function at(e, d) {
    var g = geo(e), c = g.cum, i = 1;
    while (i < c.length - 1 && c[i] < d) i++;
    var q = (d - c[i - 1]) / ((c[i] - c[i - 1]) || 1);
    return [K.lerp(g.pts[i - 1][0], g.pts[i][0], q), K.lerp(g.pts[i - 1][1], g.pts[i][1], q)];
  }
  function live(e, on) {
    if (!e || e.today) return;
    e.live = Math.max(0, e.live + (on ? 1 : -1));
    if (on) e.pill.classList.add('is-live');
    else setTimeout(function () { if (!e.live) e.pill.classList.remove('is-live'); }, 700);
  }
  function killTokens() { toks.forEach(function (t) { t.g.remove(); live(t.e, false); }); toks = []; nextAt = []; }
  function spawn(j) {
    var tobe = mix > .5, g = K.svg('g', { 'class': 'asis-tok' + (tobe ? ' is-b' : '') + (j ? '' : ' is-main') });
    g.appendChild(K.svg('circle', { r: 9, 'class': 'asis-th' })); g.appendChild(K.svg('circle', { r: 4.2, 'class': 'asis-td' }));
    var ring = K.svg('circle', { r: 12.5, 'class': 'asis-tw', pathLength: 1 }); g.appendChild(ring);
    gT.appendChild(g);
    var t = { j: j, list: (tobe ? JB : JA)[j], i: -1, s: 0, len: 0, g: g, ring: ring, wait: 0, waited: false, tobe: tobe, e: null };
    if (!j) { dayN = 1; handN = 0; fieldsN = 0; }
    next(t); toks.push(t);
  }
  function next(t) {
    live(t.e, false);
    t.i++; var id = t.list[t.i];
    if (!id) { t.e = null; return false; }
    var e = EDGE[id]; t.e = e; t.s = 0; t.len = geo(e).L; t.waited = false;
    live(e, true);
    if (!t.j && !walk.on) {
      handN += e.h; fieldsN += e.k || 0;
      capB.textContent = e.label;
      capS.textContent = (t.tobe ? 'Order S00128' : 'Order #1042 on WhatsApp') + ' · day ' + half(dayN) + ' · ' + handN + ' hand-off' + (handN === 1 ? '' : 's') + (t.tobe ? ' · nothing re-typed' : ' · ' + fieldsN + ' fields re-typed');
    }
    return true;
  }
  function stepTokens(now, dt) {
    var list = mix > .5 ? JB : JA;
    for (var j = 0; j < list.length; j++) {
      if (toks.some(function (t) { return t.j === j; })) continue;
      if (!nextAt[j]) nextAt[j] = now + (j ? 500 + j * 700 : 200);
      if (now >= nextAt[j]) { nextAt[j] = 0; spawn(j); }
    }
    toks = toks.filter(function (t) {
      if (t.wait > 0) {
        t.wait -= dt; t.ring.style.strokeDashoffset = K.clamp(t.wait / t.wt, 0, 1).toFixed(3);
        if (t.wait <= 0) { t.g.classList.remove('is-wait'); if (!t.j) dayN += t.e.w; }
        return true;
      }
      t.s += (t.tobe ? 250 : 85) * dt;
      if (!t.waited && t.e.w && t.s >= t.len * .5) { t.waited = true; t.s = t.len * .5; t.wt = t.wait = t.e.w * (t.tobe ? .7 : 1.25); t.g.classList.add('is-wait'); }
      if (t.s >= t.len && !next(t)) {
        t.g.remove(); nextAt[t.j] = now + (t.j ? 1200 : 900);
        if (!t.j && !walk.on) capS.textContent += ' · done';
        return false;
      }
      var p = at(t.e, Math.min(t.s, t.len));
      t.g.setAttribute('transform', 'translate(' + p[0].toFixed(1) + ' ' + p[1].toFixed(1) + ')');
      return true;
    });
  }
  var loop = K.loop(function (now, dt) {
    if (anim) {
      var q = K.clamp((now - anim.t0) / anim.dur, 0, 1);
      mix = K.lerp(anim.from, anim.to, q); render();
      if (q >= 1) { anim = null; settled(700); }
      return;
    }
    if (running) stepTokens(now, dt);
  });

  /* ------------------------------------------------------------------ switching state */
  function morph(to, dur) {
    killTokens(); tip.hide();
    if (hotP) hot(hotP, false);
    root.classList.remove('is-b-done');
    if (K.reduce || !dur || !visible) { mix = to; anim = null; render(); settled(dur ? 700 : 0); return; }
    anim = { from: mix, to: to, t0: performance.now(), dur: dur * Math.abs(to - mix) + 1 };
    loop.on();
  }
  function settled(cd) {
    var tobe = mix > .5;
    root.classList.toggle('is-b-done', tobe);
    if (!walk.on) counts(tobe ? 1 : 0, cd);
    segs.forEach(function (b) { b.setAttribute('aria-pressed', String(+b.dataset.state === (tobe ? 1 : 0))); });
    running = !K.reduce;
    if (running && visible) loop.on();
    if (!walk.on) { capB.textContent = tobe ? 'The same order on one database' : 'One order, the way it runs today'; capS.textContent = tobe ? 'Hover a green number to see what fixed it.' : 'Hover a red number to see the pain point.'; }
  }

  /* ------------------------------------------------------------------ the walk-through */
  var walk = { on: false, step: -1, play: false }, timers = [];
  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function clearT() { timers.forEach(clearTimeout); timers = []; }
  function showAll(on) { nodes.forEach(function (n) { n.el.classList.toggle('is-on', on); }); }
  function setRail() {
    wsteps.forEach(function (b, j) { b.classList.toggle('is-now', walk.on && j === walk.step); b.classList.toggle('is-done', walk.on && j < walk.step); b.setAttribute('aria-current', walk.on && j === walk.step ? 'step' : 'false'); });
    walkBtn.setAttribute('aria-pressed', String(walk.play)); walkBtn.classList.toggle('is-play', walk.play); root.classList.toggle('is-run', walk.play);
    walkLbl.textContent = walk.play ? 'Pause' : walk.on && walk.step < 4 ? (K.reduce ? 'Next step' : 'Resume') : 'Walk-through';
  }
  function caption(i, extra) { capB.textContent = 'Step ' + (i + 1) + ' of 5 · ' + STEPS[i][0]; capS.textContent = extra || STEPS[i][1]; }
  function go(i, play) {
    clearT(); walk.on = true; walk.step = i; walk.play = !!play && !K.reduce;
    var fast = K.reduce || !visible, c = root.classList;
    // what the earlier steps leave behind, set without transitions
    c.add('is-walk', 'is-cut'); c.remove('is-fast', 'is-scope', 'is-team');
    c.toggle('is-map', i === 3); c.toggle('is-gap', i === 4);
    c.toggle('is-draw', i >= 2); c.toggle('is-pins', i >= 2);
    showAll(i > 0);
    if (i < 4 && (mix !== 0 || anim)) morph(0, 0);
    running = i >= 2 && !K.reduce; if (!running) killTokens();
    counts(i >= 2 ? 0 : -1, 0);
    void root.offsetWidth; c.remove('is-cut');
    caption(i);
    // this step, animated
    if (i === 0) {
      c.add('is-team');
      TEAMS.forEach(function (tm, j) {
        later(function () { tm[1].forEach(function (id) { NODE[id].el.classList.add('is-on'); }); caption(0, 'Interview ' + (j + 1) + ' of 4 · ' + tm[0] + ': ' + tm[2]); }, fast ? 0 : 250 + j * 1100);
      });
    }
    if (i === 1) { c.add('is-draw', 'is-pins'); counts(0, fast ? 0 : EA.length * 150 + 500); }
    if (i === 2) c.add('is-map');
    if (i === 3) c.add('is-gap');
    if (i === 4) { morph(1, fast ? 0 : 1500); later(function () { c.add('is-scope'); counts(1, fast ? 0 : 900); }, fast ? 0 : 1300); }
    if (fast) c.add('is-fast');
    root.style.setProperty('--dur', DUR[i] + 'ms');
    if (walk.play) later(function () { if (i < 4) go(i + 1, true); else { walk.play = false; setRail(); } }, DUR[i]);
    setRail();
  }
  function leave() {
    clearT(); walk.on = false; walk.play = false;
    root.classList.remove('is-walk', 'is-team', 'is-map', 'is-scope');
    root.classList.add('is-draw', 'is-pins', 'is-gap', 'is-fast');     // no staged delays outside the walk-through
    showAll(true); setRail();
  }
  function pause() {
    clearT(); walk.play = false; root.classList.add('is-fast');
    if (walk.step === 0) { showAll(true); caption(0); }
    if (walk.step === 4) { if (anim) { anim = null; mix = 1; render(); settled(0); } root.classList.add('is-scope'); counts(1, 0); }
    setRail();
  }

  segs.forEach(function (b) {
    b.addEventListener('click', function () { touched = true; if (walk.on) leave(); morph(+b.dataset.state, 1400); segs.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); });
  });
  walkBtn.addEventListener('click', function () {
    touched = true;
    if (walk.play) pause(); else if (walk.on && walk.step < 4) go(K.reduce ? walk.step + 1 : walk.step, true); else go(0, true);
  });
  wsteps.forEach(function (b) { b.addEventListener('click', function () { touched = true; go(+b.dataset.s, false); }); });

  var visible = false, touched = false, ro = 0, lastWH = '';
  function remeasure(force) {                 // new width, a taller panel or late fonts: lay the map out again
    cancelAnimationFrame(ro);
    ro = requestAnimationFrame(function () {
      var wh = stage.offsetWidth + 'x' + stage.offsetHeight;
      if (wh === lastWH && !force) return;
      lastWH = wh; killTokens(); size();
    });
  }
  if ('ResizeObserver' in window) new ResizeObserver(function () { remeasure(); }).observe(stage);
  else window.addEventListener('resize', function () { remeasure(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { remeasure(true); });
  root.classList.add('is-draw', 'is-pins', 'is-gap'); showAll(true);
  size(); lastWH = stage.offsetWidth + 'x' + stage.offsetHeight; counts(0, 0); settled(0);
  return {
    start: function (first) {
      visible = true; remeasure();
      if (first && !touched && !K.reduce) { go(0, true); return; }
      if (walk.on && walk.play) { go(walk.step, true); return; }
      if (running || anim) loop.on();
    },
    stop: function () {
      visible = false; loop.off();
      if (walk.play) { clearT(); root.classList.add('is-fast'); }
    }
  };
});
