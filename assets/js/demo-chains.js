/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* Odoo ERP page: five end-to-end processes on one database. Each process is a chain of Odoo
   documents; each document uses shared master records (customer, vendor, products, BoM, employee,
   chart of accounts) and posts balanced journal entries into one ledger. Pick a process, run all
   five at once, hover a master record to see every document that uses it. Sample data, SGD, GST 9%. */
TN.demo('chains', function (root, K) {
  var rails = K.$('.dch-rails', root), hub = K.$('.dch-hub', root), links = K.$('.dch-links', root);
  var jlist = K.$('.dch-journal', root), tb = K.$('.dch-tb tbody', root), stage = K.$('.dch-stage', root);
  var kDocs = K.$('[data-k="docs"]', root), kJe = K.$('[data-k="je"]', root), kBal = K.$('[data-k="bal"]', root);
  var tip = K.tip(stage);

  var ACC = {
    1000: ['Bank', 'a'], 1100: ['Receivables', 'a'], 1150: ['GST input tax', 'a'], 1400: ['Stock valuation', 'a'],
    2100: ['Payables', 'l'], 2110: ['Received, not billed', 'l'], 2150: ['GST output tax', 'l'], 2200: ['Employee payable', 'l'],
    2300: ['Accrued expenses', 'l'], 3000: ['Opening equity', 'e'], 4000: ['Sales', 'i'], 5000: ['Cost of goods sold', 'x'],
    6200: ['Utilities', 'x'], 6300: ['Travel', 'x']
  };
  var OPEN = [[1000, 5000, 0], [1400, 2000, 0], [3000, 0, 7000]];
  // process → documents; each document: id, app icon, number, type, master refs, detail, journal lines [account, debit, credit, memo]
  var P = {
    o2c: { name: 'Order to cash', c: 'var(--tok-stock)', docs: [
      ['quote', 'sale', 'S00128', 'Quotation', ['cust', 'lamp'], '10 × Desk lamp at S$100, sent to sign online'],
      ['so', 'sale', 'S00128', 'Sales order', ['cust', 'lamp'], 'Signed online: order confirmed, stock reserved'],
      ['out', 'stock', 'WH/OUT/00042', 'Delivery', ['cust', 'lamp', 'coa'], '10 lamps out at S$45 cost', [[5000, 450, 0, 'Cost of goods sold'], [1400, 0, 450, 'Stock out · desk lamps']]],
      ['inv', 'account', 'INV/2026/00107', 'Invoice', ['cust', 'lamp', 'coa'], 'From delivered quantities, GST 9%', [[1100, 1090, 0, 'Lim & Co'], [4000, 0, 1000, 'Desk lamps'], [2150, 0, 90, 'GST 9%']]],
      ['pay', 'accountant', 'BNK1/00231', 'Payment', ['cust', 'coa'], 'Bank feed line matched to the invoice', [[1000, 1090, 0, 'Bank feed'], [1100, 0, 1090, 'Lim & Co']]]] },
    p2p: { name: 'Procure to pay', c: 'var(--tok-buy)', docs: [
      ['rfq', 'purchase', 'P00031', 'RFQ', ['vend', 'base'], 'Reorder rule: 20 lamp bases below minimum'],
      ['po', 'purchase', 'P00031', 'Purchase order', ['vend', 'base'], '20 × Lamp base at S$25, vendor lead time 5 days'],
      ['in', 'stock', 'WH/IN/00017', 'Receipt', ['vend', 'base', 'coa'], 'Received by barcode, valued at cost', [[1400, 500, 0, 'Stock in · lamp bases'], [2110, 0, 500, 'Awaiting the bill']]],
      ['bill', 'account', 'BILL/2026/00055', 'Vendor bill', ['vend', 'base', 'coa'], 'Digitised, 3-way match: order, receipt, bill', [[2110, 500, 0, 'Matched to receipt'], [1150, 45, 0, 'GST 9%'], [2100, 0, 545, 'Apex Supplies']]],
      ['vpay', 'accountant', 'BNK1/00232', 'Vendor payment', ['vend', 'coa'], 'Batch payment of bills due', [[2100, 545, 0, 'Apex Supplies'], [1000, 0, 545, 'Bank']]]] },
    mfg: { name: 'Plan to produce', c: 'var(--tok-make)', docs: [
      ['mo', 'mrp', 'WH/MO/00009', 'Manufacturing order', ['lamp', 'bom'], '5 desk lamps from the bill of materials'],
      ['wo', 'mrp', 'WO/00021', 'Work order', ['bom'], 'Assembly work centre, 12 min per lamp'],
      ['qc', 'quality_control', 'QC/00012', 'Quality check', ['lamp'], 'Pass: light test and finish'],
      ['fg', 'stock', 'WH/MO/00009', 'Finished goods', ['lamp', 'base', 'coa'], 'Components used, finished lamps valued', [[1400, 225, 0, 'Stock in · desk lamps'], [1400, 0, 225, 'Stock out · components']]]] },
    r2r: { name: 'Record to report', c: 'var(--tok-pay)', docs: [
      ['feed', 'accountant', 'Bank feed', 'Statement', ['coa'], 'Daily statement lines from the bank'],
      ['rec', 'accountant', 'Reconcile', 'Reconciliation', ['coa', 'cust', 'vend'], 'Reconciliation rules match most lines'],
      ['accr', 'accountant', 'MISC/00014', 'Accrual', ['coa'], 'Utilities for the month, bill not in yet', [[6200, 180, 0, 'Utilities'], [2300, 0, 180, 'Accrued']]],
      ['gst', 'accountant', 'GST report', 'Tax report', ['coa'], 'Output tax less input tax, from posted entries'],
      ['pl', 'spreadsheet_dashboard', 'P&L', 'Reports', ['coa'], 'P&L, balance sheet and cash forecast, same day']] },
    h2r: { name: 'Hire to reimburse', c: 'var(--tok-late)', docs: [
      ['emp', 'hr', 'Employee', 'Employee record', ['emp'], 'A. Tan, Sales team, contract and schedule'],
      ['to', 'hr_holidays', 'Time off', 'Leave request', ['emp'], 'Approved by the manager, team calendar updated'],
      ['exp', 'hr_expense', 'EXP/00008', 'Expense claim', ['emp', 'coa'], 'Receipt photographed, claim filled by OCR', [[6300, 120, 0, 'Client visit'], [2200, 0, 120, 'A. Tan']]],
      ['reimb', 'accountant', 'BNK1/00233', 'Reimbursement', ['emp', 'coa'], 'Paid with the next batch', [[2200, 120, 0, 'A. Tan'], [1000, 0, 120, 'Bank']]]] }
  };
  var ORDER = ['o2c', 'p2p', 'mfg', 'r2r', 'h2r'];
  var MASTER = { cust: 'Lim & Co Pte Ltd', vend: 'Apex Supplies', lamp: 'Desk lamp', base: 'Lamp base', bom: 'Bill of materials', emp: 'A. Tan', coa: 'Chart of accounts' };

  // ---------------------------------------------------------------- build the rails
  var docs = [];
  ORDER.forEach(function (pk) {
    var p = P[pk], row = K.el('div', 'dch-rail'); row.style.setProperty('--c', p.c); row.dataset.p = pk;
    var lab = K.el('div', 'dch-pname'); lab.appendChild(K.el('i')); lab.appendChild(K.el('b', null, p.name)); row.appendChild(lab);
    var line = K.el('div', 'dch-line'); row.appendChild(line);
    p.docs.forEach(function (d, i) {
      var chip = K.el('button', 'dch-doc'); chip.type = 'button';
      chip.innerHTML = K.oi(d[1], 20);
      var t = K.el('span'); t.appendChild(K.el('b', null, d[2])); t.appendChild(K.el('small', null, d[3])); chip.appendChild(t);
      chip.setAttribute('aria-label', d[3] + ' ' + d[2]);
      line.appendChild(chip);
      if (i < p.docs.length - 1) line.appendChild(K.el('i', 'dch-arrow'));
      docs.push({ el: chip, p: pk, id: d[0], app: d[1], no: d[2], type: d[3], refs: d[4], note: d[5], je: d[6] || null });
    });
    rails.appendChild(row);
  });
  var masters = {};
  K.$$('[data-m]', hub).forEach(function (m) { masters[m.dataset.m] = { el: m, n: K.$('.dch-n', m) }; });

  // ---------------------------------------------------------------- ledger
  var bal = {};
  function resetLedger() {
    Object.keys(ACC).forEach(function (a) { bal[a] = 0; });
    OPEN.forEach(function (l) { bal[l[0]] += l[1] - l[2]; });
    jlist.textContent = '';
    renderTB(null);
  }
  function renderTB(touch) {
    tb.textContent = '';
    var dr = 0, cr = 0;
    Object.keys(ACC).forEach(function (a) {
      var v = bal[a], tr = K.el('tr', touch && touch.indexOf(+a) >= 0 ? 'is-touch' : null);
      tr.appendChild(K.el('td', 'dch-code', a)); tr.appendChild(K.el('td', null, ACC[a][0]));
      tr.appendChild(K.el('td', 'dch-num', v > 0 ? v.toLocaleString('en-SG') : ''));
      tr.appendChild(K.el('td', 'dch-num', v < 0 ? (-v).toLocaleString('en-SG') : ''));
      if (v > 0) dr += v; else cr -= v;
      tb.appendChild(tr);
    });
    var ok = Math.abs(dr - cr) < .005;
    // the reports read the same ledger: nothing is exported or re-keyed
    var sales = -bal[4000], cogs = bal[5000], gp = sales - cogs, net = gp - bal[6200] - bal[6300];
    var R = { sales: sales, cogs: cogs, gp: gp, opex: bal[6200] + bal[6300], net: net, out: -bal[2150], inp: bal[1150], gst: -bal[2150] - bal[1150], bank: bal[1000], ar: bal[1100], ap: -bal[2100] };
    Object.keys(R).forEach(function (k) { var n = K.$('[data-r="' + k + '"]', root); if (n) n.textContent = (R[k] < 0 ? '(' : '') + Math.abs(R[k]).toLocaleString('en-SG') + (R[k] < 0 ? ')' : ''); });
    K.$('[data-t="dr"]', root).textContent = dr.toLocaleString('en-SG');
    K.$('[data-t="cr"]', root).textContent = cr.toLocaleString('en-SG');
    kBal.textContent = ok ? 'Dr = Cr' : 'check';
    kBal.parentNode.classList.toggle('dm-ok', ok);
  }
  function post(d) {
    var touch = [];
    d.je.forEach(function (l) { bal[l[0]] += l[1] - l[2]; touch.push(l[0]); });
    renderTB(touch);
    var li = K.el('li'); li.style.setProperty('--c', P[d.p].c);
    var h = K.el('div', 'dch-jh'); h.appendChild(K.el('b', null, d.no)); h.appendChild(K.el('span', null, d.type)); li.appendChild(h);
    d.je.forEach(function (l) {
      var r = K.el('div', 'dch-jl' + (l[2] ? ' is-cr' : ''));
      r.appendChild(K.el('span', null, l[0] + ' ' + ACC[l[0]][0]));
      r.appendChild(K.el('em', null, (l[1] || l[2]).toLocaleString('en-SG')));
      li.appendChild(r);
    });
    jlist.insertBefore(li, jlist.firstChild);
    var all = K.$$('li', jlist); while (all.length > 3) all.pop().remove();
  }

  // ---------------------------------------------------------------- links to the master records
  var W = 1, H = 1;
  function size() { W = stage.offsetWidth; H = stage.offsetHeight; links.setAttribute('viewBox', '0 0 ' + W + ' ' + H); }
  function linkPath(d, mk) {
    var a = K.box(d.el, stage), b = K.box(masters[mk].el, stage);
    var x0 = a.cx, y0 = a.b - 2, x1 = b.cx, y1 = b.y + 2;
    var my = (y0 + y1) / 2 + 10;
    return 'M' + x0.toFixed(1) + ' ' + y0.toFixed(1) + 'C' + x0.toFixed(1) + ' ' + my.toFixed(1) + ' ' + x1.toFixed(1) + ' ' + (my - 20).toFixed(1) + ' ' + x1.toFixed(1) + ' ' + y1.toFixed(1);
  }
  function drawLinks(d, cls, keep) {
    d.refs.forEach(function (mk) {
      if (!masters[mk]) return;
      var p = K.svg('path', { d: linkPath(d, mk), 'class': 'dch-l ' + (cls || ''), style: '--c:' + P[d.p].c });
      links.appendChild(p);
      var len = p.getTotalLength(); p.style.strokeDasharray = len; p.style.strokeDashoffset = K.reduce ? 0 : len;
      requestAnimationFrame(function () { p.style.strokeDashoffset = 0; });
      if (!keep) setTimeout(function () { p.classList.add('is-fade'); setTimeout(function () { p.remove(); }, 700); }, 1500);
      var m = masters[mk]; m.count = (m.count || 0) + 1; m.n.textContent = m.count; m.el.classList.add('has-n'); K.restart(m.el, 'is-ping');
    });
  }

  // ---------------------------------------------------------------- playing processes
  var timers = [], nDocs = 0, nJe = 0, running = false;
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }
  function reset() {
    clearTimers(); nDocs = 0; nJe = 0; kDocs.textContent = '0'; kJe.textContent = '0';
    docs.forEach(function (d) { d.el.classList.remove('is-done', 'is-now'); });
    Object.keys(masters).forEach(function (k) { masters[k].count = 0; masters[k].n.textContent = ''; masters[k].el.classList.remove('has-n'); });
    links.textContent = ''; resetLedger();
    K.$$('.dch-rail', rails).forEach(function (r) { r.classList.remove('is-on'); });
  }
  function step(d) {
    docs.forEach(function (x) { if (x.p === d.p) x.el.classList.remove('is-now'); });
    d.el.classList.add('is-now', 'is-done');
    nDocs++; kDocs.textContent = String(nDocs);
    drawLinks(d, 'is-run');
    if (d.je) { post(d); nJe++; kJe.textContent = String(nJe); }
  }
  function play(list, stagger) {
    clearTimers(); running = true;
    var t = 200;
    list.forEach(function (pk, j) {
      var row = K.$('.dch-rail[data-p="' + pk + '"]', rails); row.classList.add('is-on');
      docs.filter(function (d) { return d.p === pk; }).forEach(function (d, i) {
        timers.push(setTimeout(function () { step(d); }, K.reduce ? 0 : t + j * stagger + i * 820));
      });
    });
    var end = t + (list.length - 1) * stagger + 5 * 820 + 400;
    timers.push(setTimeout(function () { running = false; docs.forEach(function (d) { d.el.classList.remove('is-now'); }); }, K.reduce ? 0 : end));
  }
  function choose(pk) {
    K.$$('[data-p]', K.$('.dm-seg', root)).forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.p === pk)); });
    reset(); play([pk], 0);
  }
  var started = false;                              // any click before the auto-start cancels it
  K.$$('.dm-seg [data-p]', root).forEach(function (b) { b.addEventListener('click', function () { started = true; choose(b.dataset.p); }); });
  K.$('[data-run]', root).addEventListener('click', function () {
    started = true;
    K.$$('.dm-seg [data-p]', root).forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
    reset(); play(ORDER, 360);
  });
  K.$('[data-reset]', root).addEventListener('click', function () { started = true; reset(); });

  // ---------------------------------------------------------------- hover: a document, or a master record
  docs.forEach(function (d) {
    function on() {
      var b = K.box(d.el, stage);
      var lines = [d.type + ' · ' + d.no, d.note];
      if (d.je) lines.push(d.je.map(function (l) { return (l[1] ? 'Dr ' : 'Cr ') + l[0] + ' ' + ACC[l[0]][0] + ' ' + (l[1] || l[2]).toLocaleString('en-SG'); }).join('  ·  '));
      tip.show(lines, b.cx, b.y);
      stage.classList.add('is-peek'); d.el.classList.add('is-hot');
      d.refs.forEach(function (mk) { if (masters[mk]) masters[mk].el.classList.add('is-hot'); });
      drawLinks(d, 'is-hover', true);
    }
    function off() {
      tip.hide(); stage.classList.remove('is-peek'); d.el.classList.remove('is-hot');
      K.$$('.is-hot', hub).forEach(function (m) { m.classList.remove('is-hot'); });
      K.$$('.dch-l.is-hover', links).forEach(function (p) { p.remove(); });
    }
    d.el.addEventListener('pointerenter', on); d.el.addEventListener('pointerleave', off);
    d.el.addEventListener('focus', on); d.el.addEventListener('blur', off);
  });
  Object.keys(masters).forEach(function (mk) {
    var m = masters[mk];
    function on() {
      var used = docs.filter(function (d) { return d.refs.indexOf(mk) >= 0; });
      var procs = {}; used.forEach(function (d) { procs[d.p] = 1; });
      var b = K.box(m.el, stage);
      tip.show([MASTER[mk], 'Used by ' + used.length + ' documents in ' + Object.keys(procs).length + ' processes: one record, never re-typed'], b.cx, b.y);
      stage.classList.add('is-peek'); m.el.classList.add('is-hot');
      used.forEach(function (d) { d.el.classList.add('is-hot'); var p = K.svg('path', { d: linkPath(d, mk), 'class': 'dch-l is-hover', style: '--c:' + P[d.p].c }); links.appendChild(p); });
    }
    function off() {
      tip.hide(); stage.classList.remove('is-peek'); m.el.classList.remove('is-hot');
      docs.forEach(function (d) { d.el.classList.remove('is-hot'); });
      K.$$('.dch-l.is-hover', links).forEach(function (p) { p.remove(); });
    }
    m.el.addEventListener('pointerenter', on); m.el.addEventListener('pointerleave', off);
    m.el.addEventListener('focus', on); m.el.addEventListener('blur', off);
  });

  window.addEventListener('resize', function () { size(); K.$$('.dch-l', links).forEach(function (p) { p.remove(); }); });
  reset(); size();
  return {
    start: function (first) { size(); if (first && !started) { started = true; timers.push(setTimeout(function () { choose('o2c'); }, K.reduce ? 0 : 500)); } },
    stop: function () { /* the timeline is short and event-driven; nothing runs per frame */ }
  };
});
