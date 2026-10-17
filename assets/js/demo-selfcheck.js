/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* Seven signs you have outgrown spreadsheets (blog): the article's seven signs as a checklist. A
   seven-segment gauge fills as signs are ticked, with the article's line at three ("costing more
   than they save"), each ticked sign's fix from the article's self-check table, and the article's
   three rules for the way in. The matching rows of the article's own self-check table light up. */
TN.demo('selfcheck', function (root, K) {
  var list = K.$('.sfc-list', root), svgEl = K.$('.sfc-svg', root), scoreEl = K.$('[data-score]', root);
  var bandEl = K.$('[data-band]', root), verdictEl = K.$('[data-verdict]', root);
  var fixBox = K.$('[data-fixes]', root), fixList = K.$('[data-fixes] ul', root), nextBox = K.$('[data-next]', root), nextList = K.$('[data-next] ol', root);
  var table = document.querySelector('[data-sfc-table] tbody');
  var rows = table ? K.$$('tr', table) : [];

  // sign: title, the article's example, the fix, the self-check table row it answers (or -1)
  var SIGNS = [
    ['The same data is typed in more than once', 'An order goes into the order sheet, then the accounting software, then the stock file.', 'Connect sales, stock and invoicing', 0],
    ['Nobody trusts the stock number', '"Do we have it?" is answered with "let me check the shelf".', 'Track stock on every movement', 1],
    ['Month-end takes a week', 'Bank statements are matched to invoices by hand.', 'Automate bank reconciliation', 2],
    ['Reports mean someone stays late', 'A simple question takes a day of copying three files into a fourth.', 'Move reporting onto live data', 3],
    ['One person holds the key file', 'The formulas only its author understands.', 'Move reporting onto live data', 3],
    ['Growth adds people, not output', 'Every jump in orders needs another admin hire.', 'Add volume to the same system, not headcount to feed it', -1],
    ["Customers ask questions you can't answer quickly", '"Has my order shipped?" means searching inboxes.', "Keep the answer on the customer's record", -1]
  ];
  var RULES = [
    ['Map before you buy', 'Write down how an order becomes cash, and how a purchase becomes a paid bill.'],
    ['Start where money and stock move', 'For most companies that is accounting, sales and inventory.'],
    ['Clean data on the way in', 'Fix duplicates and codes before go-live.']
  ];
  var BANDS = [
    { max: 0, cls: 'is-calm', label: 'None of the seven, for now', text: 'Spreadsheets are how most companies start, and for a while they work. Come back to this list as the company grows.' },
    { max: 2, cls: 'is-watch', label: 'Below the line of three', text: 'Fix the friction you ticked, and watch for more: the trigger is friction, not company size.' },
    { max: 7, cls: 'is-hot', label: 'Three or more: time for one system', text: 'The spreadsheets are costing more than they save. The fix is rarely "buy everything at once": map how orders, stock and money move, then put the busiest part on one system first.' }
  ];

  // ------------------------------------------------------------ the checklist
  var on = SIGNS.map(function () { return false; }), btns = [];
  SIGNS.forEach(function (s, i) {
    var b = K.el('button', 'sfc-row'); b.type = 'button'; b.setAttribute('aria-pressed', 'false');
    b.appendChild(K.el('span', 'sfc-no', String(i + 1)));
    var tx = K.el('span', 'sfc-tx'); tx.appendChild(K.el('b', null, s[0])); tx.appendChild(K.el('small', null, s[1])); b.appendChild(tx);
    var box = K.el('span', 'sfc-box'); box.setAttribute('aria-hidden', 'true'); b.appendChild(box);
    b.addEventListener('click', function () { on[i] = !on[i]; render(true); });
    list.appendChild(b); btns.push(b);
  });

  // ------------------------------------------------------------ the gauge: seven segments on a half circle
  var CX = 110, CY = 114, R = 90, GAP = 2.4, SEG = (180 - GAP * 6) / 7;
  function polar(deg, r) { var a = (deg - 180) * Math.PI / 180; return [CX + r * Math.cos(a), CY + r * Math.sin(a)]; }
  function arc(d0, d1, r) {
    var a = polar(d0, r), b = polar(d1, r);
    return 'M' + a[0].toFixed(2) + ' ' + a[1].toFixed(2) + 'A' + r + ' ' + r + ' 0 0 1 ' + b[0].toFixed(2) + ' ' + b[1].toFixed(2);
  }
  var segs = [];
  for (var i = 0; i < 7; i++) {
    var d0 = i * (SEG + GAP), p = K.svg('path', { d: arc(d0, d0 + SEG, R), 'class': 'sfc-seg' + (i >= 2 ? ' is-red' : ' is-amb') });
    p.style.transitionDelay = (i * 40) + 'ms';
    svgEl.appendChild(p); segs.push(p);
  }
  var tAng = 2 * (SEG + GAP) - GAP / 2, t0 = polar(tAng, R - 13), t1 = polar(tAng, R + 13), tl = polar(tAng, R + 23);
  svgEl.appendChild(K.svg('line', { x1: t0[0], y1: t0[1], x2: t1[0], y2: t1[1], 'class': 'sfc-tick' }));
  var tlab = K.svg('text', { x: tl[0], y: tl[1] + 3, 'class': 'sfc-tlab', 'text-anchor': 'middle' }); tlab.textContent = '3';
  svgEl.appendChild(tlab);
  var needle = K.svg('g', { 'class': 'sfc-needle' });
  needle.appendChild(K.svg('path', { d: 'M' + (CX - 3.2) + ' ' + CY + 'L' + CX + ' ' + (CY - R + 22) + 'L' + (CX + 3.2) + ' ' + CY + 'Z' }));
  needle.appendChild(K.svg('circle', { cx: CX, cy: CY, r: 7 }));
  svgEl.appendChild(needle);
  function aim(score) {
    // 0 points left; each sign moves the needle to the end of its segment
    var deg = score ? score * (SEG + GAP) - GAP : 0;
    needle.style.transform = 'rotate(' + (deg - 90).toFixed(2) + 'deg)';
  }

  // ------------------------------------------------------------ verdict, fixes, next steps
  var lastBand = null;
  function render(user) {
    var n = on.filter(Boolean).length, band = BANDS.filter(function (b) { return n <= b.max; })[0];
    btns.forEach(function (b, i) { b.setAttribute('aria-pressed', String(on[i])); });
    segs.forEach(function (s, i) { s.classList.toggle('is-lit', i < n); });
    aim(n);
    K.count(scoreEl, n, user ? 450 : 0);
    root.dataset.band = band.cls;
    if (band !== lastBand) {
      bandEl.textContent = band.label; verdictEl.textContent = band.text;
      if (user) { K.restart(bandEl, 'is-in'); K.restart(verdictEl, 'is-in'); }
      lastBand = band;
    }
    // one fix per ticked sign, without repeats (signs 4 and 5 share the same fix)
    var seen = {}, fixes = [];
    SIGNS.forEach(function (s, i) { if (on[i] && !seen[s[2]]) { seen[s[2]] = 1; fixes.push([s[2], i]); } });
    var had = K.$$('li', fixList).map(function (li) { return li.dataset.f; });
    fixList.textContent = '';
    fixes.forEach(function (f) {
      var li = K.el('li', had.indexOf(f[0]) < 0 && user ? 'is-new' : null); li.dataset.f = f[0];
      li.appendChild(K.el('i', null, String(f[1] + 1))); li.appendChild(K.el('span', null, f[0]));
      fixList.appendChild(li);
    });
    fixBox.hidden = !fixes.length;
    nextBox.hidden = n < 3;
    if (!nextList.childElementCount) RULES.forEach(function (r, k) {
      var li = K.el('li'); li.style.setProperty('--k', k);
      li.appendChild(K.el('b', null, r[0])); li.appendChild(K.el('span', null, r[1])); nextList.appendChild(li);
    });
    // the article's self-check table, just above: light the questions this answers yes to
    rows.forEach(function (tr, k) {
      var hit = SIGNS.some(function (s, i) { return on[i] && s[3] === k; });
      tr.classList.toggle('sfc-hit', hit);
    });
  }
  K.$('[data-reset]', root).addEventListener('click', function () { on = on.map(function () { return false; }); render(true); });

  render(false);
  var swept = false;
  return {
    start: function (first) {
      // one warm-up sweep of the needle the first time the gauge is seen
      if (!first || swept || K.reduce || on.some(Boolean)) return;
      swept = true; root.classList.add('is-sweep'); aim(7);
      setTimeout(function () { aim(0); setTimeout(function () { root.classList.remove('is-sweep'); }, 900); }, 700);
    },
    stop: function () {}
  };
});
