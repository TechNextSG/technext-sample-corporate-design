/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* Odoo 20 in Singapore, the Philippines and Vietnam (blog): a country switcher over a stylised dot
   map with TechNext's three offices. Each country shows the article's five areas (tax, documents,
   statements, payroll, e-invoicing) with what Odoo 20 changes; "All three" compares them side by side
   and shows one database with a company per country. The matching column of the article's table lights up. */
TN.demo('locales', function (root, K) {
  var svgEl = K.$('.lc-svg', root), panel = K.$('.lc-panel', root), btns = K.$$('[data-cc]', root);
  var CC = ['sg', 'ph', 'vn'], NAME = { sg: 'Singapore', ph: 'Philippines', vn: 'Vietnam' }, COL = { sg: 1, ph: 2, vn: 3 };
  var OFFICE = { sg: 'Singapore', ph: 'Taguig City, Metro Manila', vn: 'Ho Chi Minh City' };
  var AREAS = ['Tax', 'Documents', 'Statements', 'Payroll', 'E-invoicing'];
  var ST = { sg: ['ok', 'ok', 'ok', 'none', 'part'], ph: ['ok', 'ok', 'ok', 'ok', 'gap'], vn: ['ok', 'ok', 'ok', 'none', 'ok'] };
  var STL = { ok: 'In Odoo 20', part: 'Groundwork', none: 'Not in these notes', gap: 'Not mentioned' };
  var D = {
    sg: [["GST taxes are refined to match current government requirements and, in Odoo's words, to prepare for future GST InvoiceNow document compliance."],
      ['New tax invoice, credit note and customer accounting PDF reports comply with IRAS GST requirements.'],
      ['The chart of accounts, balance sheet and profit and loss statement are improved to comply with SFRS.'],
      ['Payroll is not in the Odoo 20 notes for Singapore.'],
      ['The notes describe preparation, not a finished InvoiceNow transmission feature: confirm how your database will send invoice data before your date.']],
    ph: [['BIR 2306 and 2307 withholding tax certificates as official PDFs for a partner and date range, generated on vendor bills and sent to the vendor when a bill is paid.', 'BIR 1600-VT covers final withholding VAT; 2551Q is available for non-VAT-registered companies.'],
      ['Invoices are BIR- and CAS-compliant, with statutory senior citizen and PWD discounts on invoices and credit notes.', 'An Entity type field, names split into first, middle and last for BIR reports, and a disbursement voucher for internal use.'],
      ["The partner ledger follows BIR's format, and a Book of Accounts is added for CBA and CAS compliance."],
      ['A basic payroll package: basic pay, benefits, taxes and overtime.', '1601-C items, the yearly BIR Form 2316, and 1604-C worksheets with Alphalist DAT exports to BIR eSubmission standards.', 'Automatic SSS and Pag-IBIG loan deductions.'],
      ["The notes do not mention the BIR's Electronic Invoicing System (EIS): if EIS covers your company, plan that connection as its own piece of work."]],
    vn: [['Tax Declaration Form 01/GTGT and its Appendix 142, both exporting to XML for import into HTKK or direct submission on the tax portal.'],
      ['Electronic internal transfer notes through SInvoice, and SInvoice e-invoices for POS orders.'],
      ['Chart of accounts and balance sheet under Circular 99/2025/TT-BTC, with parent accounts grouping child accounts.', 'General Journal (S03a-DN) and General Ledger (S03b-DN) with counterpart accounts, compliant with Circular 99/2025/TT-BTC.'],
      ['Payroll is not in the Odoo 20 notes for Vietnam.'],
      ['SInvoice, for transfer notes and POS orders.']]
  };
  // the article's side-by-side table supplies the short cell texts (fallbacks mirror it)
  var FALL = {
    sg: ['GST taxes refined', 'IRAS-compliant tax invoice and credit note', 'SFRS chart of accounts, balance sheet, P&L', 'Not in these notes', 'Groundwork for GST InvoiceNow'],
    ph: ['2306/2307 certificates, 1600-VT, 2551Q', 'BIR- and CAS-compliant invoices', 'Book of Accounts, BIR partner ledger', 'Basic package, 1601-C, 2316, 1604-C', 'EIS not mentioned'],
    vn: ['01/GTGT with Appendix 142, XML export', 'SInvoice for transfer notes and POS', 'Circular 99 chart of accounts, S03a/S03b-DN', 'Not in these notes', 'SInvoice']
  };
  var trs = K.$$('tr', document.querySelector('[data-lc-table] table') || document.createElement('table'));
  function short(cc, i) { var tr = trs[i + 1], c = tr && tr.children[COL[cc]]; return c ? c.textContent.trim() : FALL[cc][i]; }

  // ------------------------------------------------------------ a stylised dot map (lon, lat outlines, simplified)
  var P = {
    vn: [[[102.1, 22.4], [103.6, 22.8], [105, 23.1], [106.3, 22.9], [106.6, 22.2], [108, 21.5], [106.7, 20.6], [105.9, 19.6], [105.7, 18.9], [106.7, 17.6], [108.2, 16.1], [109, 14.5], [109.3, 12.3], [108.4, 11], [106.8, 10.3], [105.6, 8.8], [104.8, 9.3], [104.5, 10.4], [106, 11], [107.5, 12.3], [107.4, 14.4], [107.6, 15.3], [106.7, 16.5], [105.6, 17.9], [104.3, 19], [104.6, 19.9], [103.4, 20.7], [102.6, 21.7]]],
    ph: [[[120.6, 18.5], [122.2, 18.5], [122.3, 17.4], [121.6, 15.8], [121.6, 14.3], [122.9, 14], [124.2, 13], [124, 12.6], [122.9, 13.2], [121.8, 13.9], [120.7, 14.1], [120, 15.4], [119.8, 16.2], [120.4, 17.3]],
      [[120.4, 13.5], [121.2, 13.5], [121.5, 12.9], [121.2, 12.2], [120.4, 13]], [[124.3, 12.6], [125.2, 12.6], [125.7, 11.3], [125.1, 10.2], [124.4, 10.4], [124.3, 11.6]],
      [[121.9, 11.9], [122.6, 11.8], [123.1, 11.2], [122.7, 10.6], [122, 10.5]], [[122.5, 10.9], [123.6, 11.2], [124.1, 10.8], [124.6, 9.7], [123.4, 9.3], [122.9, 9.1], [122.4, 10.5]],
      [[122, 7], [122.9, 8.1], [124.3, 8.6], [125.5, 9.8], [126.4, 8.3], [126.6, 7.3], [125.3, 5.6], [124.1, 6.4], [123.7, 7.6], [122.3, 6.9]], [[117.2, 8.4], [117.6, 8.3], [119.6, 10.6], [119.7, 11.3], [119.3, 11.4], [117.7, 9.3]]],
    ctx: [[[99.5, 22.5], [102.1, 22.4], [102.6, 21.7], [103.4, 20.7], [104.6, 19.9], [104.3, 19], [105.6, 17.9], [106.7, 16.5], [107.6, 15.3], [107.4, 14.4], [107.5, 12.3], [106, 11], [104.5, 10.4], [103, 11.2], [101.5, 12.7], [100.5, 13.5], [99.9, 12.5], [99.5, 11.6]],
      [[99.5, 10], [100.3, 8.3], [101.1, 6.9], [102.6, 5.9], [103.4, 4.8], [103.8, 2.6], [104.3, 1.5], [103.4, 1.3], [101.3, 2.9], [100.4, 5.4], [99.7, 6.9], [99.5, 7.3]],
      [[109.6, 1.9], [111.2, 2.3], [113, 3.2], [115.4, 5.3], [116.8, 6.9], [117.8, 6.2], [119.2, 5.3], [117.8, 4.1], [118, 2.3], [118.9, 1], [119, .5], [109.2, .5]],
      [[108.6, 19.1], [109.3, 19.9], [110.5, 20.1], [111, 19.6], [110.4, 18.7], [109.6, 18.2]], [[106.7, 22.8], [108, 21.5], [109.7, 21.5], [110.6, 21.2], [111.8, 21.6], [114.2, 22.3], [116.6, 23.1], [117.1, 23.5], [104, 23.5]],
      [[120.1, 23], [120.7, 22], [121.5, 23.5], [120.2, 23.5]]]
  };
  var PIN = { sg: [103.82, 1.35], ph: [121.05, 14.52], vn: [106.63, 10.82] };
  function xy(p) { return [(p[0] - 99.5) * 10, (23.5 - p[1]) * 10]; }
  function inPoly(x, y, poly) {
    for (var c = false, i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      var a = poly[i], b = poly[j];
      if ((a[1] > y) !== (b[1] > y) && x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0]) c = !c;
    }
    return c;
  }
  var dots = { sg: [], ph: [], vn: [] }, gDots = K.svg('g', { 'class': 'lc-dots' });
  for (var lat = 23.2; lat > .5; lat -= .62) for (var lon = 99.8; lon < 127; lon += .62) {
    var who = null;
    ['vn', 'ph', 'ctx'].some(function (k) { if (P[k].some(function (poly) { return inPoly(lon, lat, poly); })) { who = k; return true; } return false; });
    if (!who) continue;
    var q = xy([lon, lat]), d = K.svg('circle', { cx: q[0].toFixed(1), cy: q[1].toFixed(1), r: 2, 'class': 'lc-d lc-d--' + who });
    gDots.appendChild(d);
    if (who !== 'ctx') { var pp = xy(PIN[who]); d.style.transitionDelay = (Math.hypot(q[0] - pp[0], q[1] - pp[1]) * 3.2).toFixed(0) + 'ms'; dots[who].push(d); }
  }
  svgEl.appendChild(gDots);
  var sgp = xy(PIN.sg), sgDot = K.svg('circle', { cx: sgp[0], cy: sgp[1], r: 3.2, 'class': 'lc-d lc-d--sg' }); gDots.appendChild(sgDot); dots.sg.push(sgDot);
  var links = K.svg('g', { 'class': 'lc-links' });
  [['sg', 'vn'], ['vn', 'ph'], ['sg', 'ph']].forEach(function (l) {
    var a = xy(PIN[l[0]]), b = xy(PIN[l[1]]), mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 - 18;
    links.appendChild(K.svg('path', { d: 'M' + a[0] + ' ' + a[1] + 'Q' + mx + ' ' + my + ' ' + b[0] + ' ' + b[1], 'class': 'lc-link' }));
  });
  svgEl.appendChild(links);
  var pins = {};
  CC.forEach(function (cc) {
    var p = xy(PIN[cc]), g = K.svg('g', { 'class': 'lc-pin lc-pin--' + cc, transform: 'translate(' + p[0] + ' ' + p[1] + ')' });
    g.appendChild(K.svg('circle', { r: 9, 'class': 'lc-ring' })); g.appendChild(K.svg('circle', { r: 4.2, 'class': 'lc-core' }));
    var t = K.svg('text', { x: cc === 'ph' ? -8 : 8, y: cc === 'sg' ? -8 : 3.5, 'text-anchor': cc === 'ph' ? 'end' : 'start', 'class': 'lc-lab' }); t.textContent = OFFICE[cc].split(',')[0];
    g.appendChild(t); svgEl.appendChild(g); pins[cc] = g;
  });

  // ------------------------------------------------------------ the panel
  var cur = 'sg', open = 0;
  function row(cc, i) {
    var r = K.el('div', 'lc-row lc-st--' + ST[cc][i] + (i === open ? ' is-open' : ''));
    var b = K.el('button', 'lc-rh'); b.type = 'button'; b.setAttribute('aria-expanded', String(i === open));
    b.appendChild(K.el('span', 'lc-area', AREAS[i])); b.appendChild(K.el('span', 'lc-sum', short(cc, i))); b.appendChild(K.el('em', 'lc-chip', STL[ST[cc][i]]));
    b.addEventListener('click', function () { open = open === i ? -1 : i; render(false); });
    r.appendChild(b);
    var ul = K.el('ul', 'lc-det'); D[cc][i].forEach(function (t) { ul.appendChild(K.el('li', null, t)); }); r.appendChild(ul);
    return r;
  }
  function render(anim) {
    btns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.cc === cur)); });
    root.dataset.cc = cur;
    CC.forEach(function (cc) {
      var on = cur === 'all' || cur === cc;
      dots[cc].forEach(function (d) { d.classList.toggle('is-on', on); });
      pins[cc].classList.toggle('is-on', on);
    });
    links.classList.toggle('is-on', cur === 'all');
    panel.textContent = '';
    if (cur === 'all') {
      var h = K.el('p', 'lc-ph'); h.appendChild(K.el('b', null, 'Side by side')); h.appendChild(K.el('small', null, 'One database, a company per country, each with its own localisation')); panel.appendChild(h);
      var grid = K.el('div', 'lc-mx');
      grid.appendChild(K.el('span', 'lc-mh')); CC.forEach(function (cc) { grid.appendChild(K.el('span', 'lc-mh lc-mh--' + cc, NAME[cc])); });
      AREAS.forEach(function (a, i) {
        grid.appendChild(K.el('span', 'lc-ma', a));
        CC.forEach(function (cc) { var c = K.el('span', 'lc-mc lc-st--' + ST[cc][i]); c.appendChild(K.el('i')); c.appendChild(K.el('small', null, short(cc, i))); grid.appendChild(c); });
      });
      panel.appendChild(grid);
      panel.appendChild(K.el('p', 'lc-note', 'E-invoicing and payroll coverage differ by country, so confirm what each package covers and what needs another step.'));
    } else {
      var hd = K.el('p', 'lc-ph'); hd.appendChild(K.el('b', null, NAME[cur])); hd.appendChild(K.el('small', null, 'TechNext office: ' + OFFICE[cur])); panel.appendChild(hd);
      AREAS.forEach(function (a, i) { panel.appendChild(row(cur, i)); });
    }
    if (anim && !K.reduce) K.restart(panel, 'is-in');
    trs.forEach(function (tr) { K.$$('th,td', tr).forEach(function (c, i) { c.classList.toggle('lc-col', cur !== 'all' && i === COL[cur]); }); });
  }
  btns.forEach(function (b) { b.addEventListener('click', function () { cur = b.dataset.cc; open = 0; render(true); }); });
  render(false);
  return { start: function () {}, stop: function () {} };
});
