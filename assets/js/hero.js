/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* Home hero engine: carousel (3 formats, 10 s, desktop only), animated background (aurora CSS +
   particles canvas + cursor spotlight), stage tilt, rotating word, KPI counters and the zooming
   pop-ups for apps and process steps. The scenes themselves (orbit, process map, plan) live in
   hero-scenes.js and follow the tn:slide event. Pauses on hover / hidden tab; honours reduced
   motion; below 960px the carousel is replaced by one clean static hero. */
(function () {
  'use strict';
  var hero = document.querySelector('[data-hero]');
  if (!hero) return;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mobile = window.matchMedia('(max-width: 960px)');
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var ROOT = hero.dataset.root || '';
  var DUR = 10000;

  /* ================================================================ content data */
  var APPS = {
    accountant: { name: 'Accounting', cat: 'finance', eyebrow: 'Odoo app · Finance', lead: 'The general ledger, bank feeds, tax and reporting — configured for how you actually close the month.',
      points: ['Bank synchronisation and one-click reconciliation', 'GST / VAT returns and tax reports', 'Multi-currency and multi-company consolidation', 'Aged receivables, P&L, balance sheet, cash forecast'], related: ['account', 'sale', 'purchase'] },
    account: { name: 'Invoicing', cat: 'finance', eyebrow: 'Odoo app · Finance', lead: 'Customer invoices, credit notes and online payment — created from orders or on their own.',
      points: ['Invoice on order, on delivery or by milestone', 'Online payment links and automatic reminders', 'Customer portal with history', 'Posts straight into Accounting'], related: ['accountant', 'sale'] },
    sale: { name: 'Sales', cat: 'sales', eyebrow: 'Odoo app · Sales', lead: 'Quotations, order confirmation and invoicing that follow your pricing and approval rules.',
      points: ['Quotation templates with optional products and e-signature', 'Pricelists, discounts and margin control', 'Confirmation reserves stock and schedules delivery', 'Upsell and recurring order support'], related: ['crm', 'stock', 'account'] },
    stock: { name: 'Inventory', cat: 'supply-chain', eyebrow: 'Odoo app · Supply Chain', lead: 'Real stock levels across warehouses, with replenishment rules that raise purchase orders before you run out.',
      points: ['Multi-warehouse, locations, routes', 'Barcode receipts, picking, packing, delivery', 'Reordering rules that create Purchase orders', 'Lots, serial numbers and expiry dates'], related: ['purchase', 'sale', 'mrp'] },
    purchase: { name: 'Purchase', cat: 'supply-chain', eyebrow: 'Odoo app · Supply Chain', lead: 'Requests for quotation, vendor pricelists and bills matched to what was actually received.',
      points: ['RFQs to several vendors, compare and confirm', 'Vendor pricelists and lead times', 'Three-way match: order, receipt, bill', 'Triggered automatically by reordering rules'], related: ['stock', 'accountant'] },
    crm: { name: 'CRM', cat: 'sales', eyebrow: 'Odoo app · Sales', lead: 'Leads, pipeline stages and activities — and a won deal becomes a quotation without re-entry.',
      points: ['Pipeline by team or product line', 'Lead capture from web forms, email, WhatsApp', 'Scheduled activities so nothing goes quiet', 'Forecast and conversion reporting'], related: ['sale', 'mass_mailing'] },
    point_of_sale: { name: 'Point of Sale', cat: 'sales', eyebrow: 'Odoo app · Sales', lead: 'Offline-capable checkout for shops and restaurants that posts sales and stock moves automatically.',
      points: ['Works offline, syncs when back', 'Barcode, promotions, loyalty', 'Sessions closed straight to Accounting', 'Shared stock with online and other stores'], related: ['stock', 'accountant'] },
    website_sale: { name: 'eCommerce', cat: 'websites', eyebrow: 'Odoo app · Websites', lead: 'An online store that reads live stock and writes orders straight into Sales and Inventory.',
      points: ['Products, variants and live availability', 'Payment gateways and shipping connectors', 'Orders reserve stock on payment', 'Same customer record as CRM and Accounting'], related: ['stock', 'sale'] },
    hr: { name: 'Employees', cat: 'hr', eyebrow: 'Odoo app · Human Resources', lead: 'Directory, contracts and org chart — the base for Time Off, Payroll and Appraisals.', points: ['Employee records and documents', 'Departments and managers', 'Contracts and working schedules', 'Links to Time Off, Payroll, Expenses'], related: ['hr_holidays', 'hr_expense'] },
    project: { name: 'Project', cat: 'services', eyebrow: 'Odoo app · Services', lead: 'Tasks, stages and milestones, with timesheets that bill to the customer.', points: ['Kanban and Gantt views', 'Milestone invoicing', 'Timesheets to Sales orders', 'Customer portal for tasks'], related: ['hr_timesheet', 'sale'] },
    helpdesk: { name: 'Helpdesk', cat: 'services', eyebrow: 'Odoo app · Services', lead: 'Tickets, SLAs and a knowledge base — with refunds and returns tied to Sales and Inventory.', points: ['Email, form and chat tickets', 'SLA policies and escalation', 'Refund or return from the ticket', 'Knowledge base articles'], related: ['crm', 'stock'] },
    mass_mailing: { name: 'Email Marketing', cat: 'marketing', eyebrow: 'Odoo app · Marketing', lead: 'Campaigns to CRM lists with A/B tests and results tied back to opportunities.', points: ['Drag-and-drop templates', 'Lists from CRM and Sales data', 'A/B subject tests', 'Revenue attribution'], related: ['crm', 'social'] },
    mrp: { name: 'Manufacturing', cat: 'supply-chain', eyebrow: 'Odoo app · Supply Chain', lead: 'Bills of materials and work orders that consume components from Inventory.', points: ['Multi-level BoMs', 'Work centres and routings', 'Quality points on work orders', 'Cost roll-up to Accounting'], related: ['stock', 'purchase'] },
    documents: { name: 'Documents', cat: 'finance', eyebrow: 'Odoo app · Finance', lead: 'File storage with workflows and OCR — vendor bills become draft entries.', points: ['Split, tag and route PDFs', 'OCR to vendor bills', 'Approval workflows', 'Linked to any record'], related: ['accountant', 'sign'] },
    sign: { name: 'Sign', cat: 'finance', eyebrow: 'Odoo app · Finance', lead: 'Legally binding e-signatures on quotations, contracts and HR documents.', points: ['Templates with roles', 'Audit trail and certificates', 'Signed quotations confirm orders', 'Works from the customer portal'], related: ['sale', 'documents'] },
    hr_expense: { name: 'Expenses', cat: 'finance', eyebrow: 'Odoo app · Finance', lead: 'Receipts captured by photo, approved by managers, posted to Accounting.', points: ['Snap a receipt, OCR fills the claim', 'Approval flows', 'Reimburse or pay by company card', 'Re-invoice to customers'], related: ['accountant', 'hr'] },
    social: { name: 'Social Marketing', cat: 'marketing', eyebrow: 'Odoo app · Marketing', lead: 'Schedule posts, track engagement and turn social leads into CRM opportunities.', points: ['LinkedIn, Facebook, Instagram, X', 'Post calendar', 'Engagement statistics', 'Leads to CRM'], related: ['crm', 'mass_mailing'] },
    web_studio: { name: 'Studio', cat: 'productivity', eyebrow: 'Odoo app · Customization', lead: 'Add fields, views, reports and automations without breaking the next upgrade.', points: ['Fields and views', 'Report templates', 'Automated actions', 'Exportable customisations'], related: ['accountant', 'sale'] },
    ai_app: { name: 'AI', cat: 'productivity', eyebrow: 'Odoo app · Productivity', lead: 'Assistants and agents inside Odoo — drafting, summarising and looking things up on your own data.', points: ['Draft replies from the record', 'Summarise threads and documents', 'Lookups across Odoo data', 'Human approval where money moves'], related: ['helpdesk', 'crm'] },
    hr_holidays: { name: 'Time Off', cat: 'hr', eyebrow: 'Odoo app · Human Resources', lead: 'Leave requests, allocations and approvals synced with Payroll.', points: ['Leave types and accruals', 'Manager approvals', 'Team calendar', 'Payroll integration'], related: ['hr'] },
    hr_timesheet: { name: 'Timesheets', cat: 'services', eyebrow: 'Odoo app · Services', lead: 'Time tracked against tasks and billed through Sales.', points: ['Timer or grid entry', 'Billable rates', 'Invoice from timesheets', 'Project profitability'], related: ['project', 'sale'] },
    planning: { name: 'Planning', cat: 'services', eyebrow: 'Odoo app · Services', lead: 'Shift and resource scheduling with open-shift publishing.', points: ['Gantt by employee or role', 'Templates and recurrence', 'Publish to employees', 'Links to Project and Field Service'], related: ['project', 'hr'] },
    appointment: { name: 'Appointments', cat: 'services', eyebrow: 'Odoo app · Services', lead: 'Online booking calendars for consultations, demos and service slots.', points: ['Public booking pages', 'Staff availability', 'Reminders and video links', 'Creates CRM leads'], related: ['crm'] },
    knowledge: { name: 'Knowledge', cat: 'productivity', eyebrow: 'Odoo app · Productivity', lead: 'Wiki pages linked to records — procedures next to the work.', points: ['Nested articles', 'Templates and embeds', 'Shared with customers', 'Linked from any record'], related: ['helpdesk'] },
    quality_control: { name: 'Quality', cat: 'supply-chain', eyebrow: 'Odoo app · Supply Chain', lead: 'Control points on receipts and work orders, with quality alerts when a check fails.', points: ['Pass/fail, measurement and photo checks', 'Control points by product or operation', 'Quality alerts with follow-up', 'Statistics by product and work centre'], related: ['mrp', 'stock'] },
    spreadsheet_dashboard: { name: 'Dashboards', cat: 'productivity', eyebrow: 'Odoo app · Productivity', lead: 'Live dashboards on your Odoo data, in spreadsheet form.', points: ['Ready-made dashboards per app', 'Spreadsheet formulas on live data', 'Shared with each team', 'Filters by period, company and team'], related: ['accountant', 'sale'] },
    mail: { name: 'Discuss', cat: 'productivity', eyebrow: 'Odoo app · Productivity', lead: 'Chat, channels and notifications on every record.', points: ['Channels and direct messages', 'Chatter on every record', 'Email integration', 'Mentions and follow-ups'], related: ['crm'] }
  };

  var FLOW = [
    { id: 'lead', app: 'crm', title: 'Lead', lane: 'Sales', lead: 'Leads arrive from your website forms, email aliases, live chat and WhatsApp, and assignment rules route each one to a salesperson.',
      points: ['Web forms and email aliases create leads automatically', 'Assignment rules by territory, team or product', 'Scheduled activities so no lead goes quiet', 'A won lead becomes a quotation without re-typing'], trigger: 'Qualified → quotation' },
    { id: 'quote', app: 'sale', title: 'Quotation', lane: 'Sales', lead: 'The quotation is built from a template with your pricelist, optional products and terms, and sent with a link to sign and pay online.',
      points: ['Quotation templates and optional products', 'Pricelists, discounts and margins visible', 'Online signature and payment from the portal', 'Validity dates on every quotation'], trigger: 'Sent → waiting for a signature' },
    { id: 'g_sign', app: 'sign', title: 'Signed?', lane: 'Decision · Sales', lead: 'If the customer signs online, the order confirms itself. If not, a follow-up activity lands on the salesperson’s list and the quotation is revised and resent.',
      points: ['Signed online → order confirmed automatically', 'No reply → follow-up activity for the salesperson', 'Expiry dates close stale quotations', 'Every version kept in the record’s history'], trigger: 'Yes → order · No → revise' },
    { id: 'order', app: 'sale', title: 'Sales order', lane: 'Sales', lead: 'Confirming the order creates the delivery, checks stock and applies the invoicing policy you chose: on order or on delivery.',
      points: ['Delivery order created with the expected date', 'Stock reserved per line where available', 'Invoicing policy per product', 'Down payments and deposit invoices'], trigger: 'Confirmed → stock check' },
    { id: 'g_stock', app: 'stock', title: 'In stock?', lane: 'Decision · Warehouse', lead: 'Odoo checks the forecasted quantity, and each product’s routes decide what happens next: reserve from stock, buy from a vendor, or manufacture.',
      points: ['Enough stock → reserved for this order', 'Buy route or reordering rule → request for quotation', 'Manufacture route → manufacturing order from the bill of materials', 'Forecasts count incoming receipts and other orders'], trigger: 'Stock → pick · Buy → PO · Make → MO' },
    { id: 'mo', app: 'mrp', title: 'Manufacturing order', lane: 'Production', lead: 'The manufacturing order follows the bill of materials: components are reserved, work orders run at each work centre, and shortages raise purchase orders.',
      points: ['Multi-level bills of materials', 'Work orders by work centre, with times recorded', 'Component shortages trigger purchasing (dashed line)', 'Actual costs roll up to Accounting'], trigger: 'Finished → quality check' },
    { id: 'g_qc', app: 'quality_control', title: 'Quality OK?', lane: 'Decision · Production', lead: 'A quality control point holds the work order until the check is recorded. A failed check raises a quality alert, so the team reworks or scraps before goods reach stock.',
      points: ['Pass/fail, measurement and photo checks', 'Control points by product, operation or work centre', 'Fail → quality alert for rework or scrap', 'Pass → finished goods to stock for the order'], trigger: 'Pass → pick · Fail → rework' },
    { id: 'po', app: 'purchase', title: 'Purchase order', lane: 'Purchasing', lead: 'A reordering rule or the buy route creates a request for quotation to the preferred vendor, with their price and lead time. Confirming it schedules the receipt.',
      points: ['Min/max reordering rules per warehouse', 'Vendor pricelists and lead times applied', 'RFQs to several vendors, compared side by side', 'Approvals above an amount you set'], trigger: 'Confirmed → receipt expected' },
    { id: 'receipt', app: 'stock', title: 'Receipt', lane: 'Purchasing · Warehouse', lead: 'The warehouse receives by barcode. Validating the receipt updates stock, frees the waiting order to be picked, and sets what the vendor may bill.',
      points: ['Barcode receiving with lots and serial numbers', 'Quality checks on receipt where needed', 'Backorders for partial deliveries', 'Bill control on received quantities'], trigger: 'Validated → stock in, bill allowed' },
    { id: 'vbill', app: 'account', title: 'Vendor bill', lane: 'Finance', lead: 'The vendor’s bill is digitised from the PDF and matched to the purchase order and the receipt, so you pay only for what arrived.',
      points: ['Bill digitisation from email or upload', 'Three-way match: order, receipt, bill', 'Differences flagged before approval', 'Posted to payables with the right taxes'], trigger: 'Matched → ready to pay' },
    { id: 'vpay', app: 'accountant', title: 'Pay vendor', lane: 'Finance', lead: 'Bills that are due are paid together in a batch payment, and the bank feed matches the payment back to each bill.',
      points: ['Batch payments by due date', 'Payment approvals where you need them', 'Bank feed matching closes each bill', 'Aged payables always current'], trigger: 'Paid → bank reconciliation' },
    { id: 'pick', app: 'stock', title: 'Pick & pack', lane: 'Warehouse', lead: 'Stock is picked by barcode from the right location, packed and labelled for the carrier, in one, two or three steps, the way your warehouse works.',
      points: ['Pick, pack and ship in one to three steps', 'Barcode app on phones or scanners', 'Batch and wave picking', 'Carrier labels and tracking numbers'], trigger: 'Packed → delivery' },
    { id: 'ship', app: 'stock', title: 'Delivery', lane: 'Warehouse', lead: 'Validating the delivery moves stock out, records lots and serial numbers against the customer, and makes the delivered quantities invoiceable.',
      points: ['Delivery slips and carrier tracking', 'Lots and serials traced to the customer', 'Backorders handled automatically', 'Returns from the same record'], trigger: 'Delivered → invoice' },
    { id: 'inv', app: 'account', title: 'Invoice', lane: 'Finance', lead: 'The invoice is created from what was delivered, with prices and taxes already right, and sent with a payment link.',
      points: ['Invoices from delivered quantities', 'Taxes and fiscal positions applied', 'Online payment links', 'Posted to receivables immediately'], trigger: 'Sent → waiting for payment' },
    { id: 'g_paid', app: 'accountant', title: 'Paid?', lane: 'Decision · Finance', lead: 'When the payment arrives in the bank feed, Odoo matches it to the invoice. Overdue invoices move through follow-up levels: a reminder email, then a letter or a call.',
      points: ['Bank feed payments matched to invoices', 'Follow-up levels with email reminders', 'Letters or call activities at later levels', 'Customer statements on demand'], trigger: 'Paid → reconcile · Overdue → reminder' },
    { id: 'recon', app: 'accountant', title: 'Bank reconciliation', lane: 'Finance', lead: 'Statement lines from the bank feed are matched by reconciliation rules, so receivables, payables and cash agree every day.',
      points: ['Bank synchronisation where your bank supports it', 'Reconciliation models match most lines', 'Partial and grouped payments handled', 'Cash position current the same day'], trigger: 'Reconciled → reports current' },
    { id: 'reports', app: 'spreadsheet_dashboard', title: 'P&L, GST and cash', lane: 'Finance', lead: 'Every step posted as it happened, so the P&L, balance sheet, GST report and cash forecast are ready without a spreadsheet export.',
      points: ['P&L and balance sheet at any date', 'GST report from posted entries', 'Aged receivables and payables', 'Cash forecast from open invoices and bills'], trigger: 'Month-end without re-keying' }
  ];
  var CAT_LABEL = { finance: 'Finance', sales: 'Sales', 'supply-chain': 'Supply Chain', websites: 'Websites', hr: 'Human Resources', marketing: 'Marketing', services: 'Services', productivity: 'Productivity' };

  /* ================================================================ pop-up */
  var pop = $('.pop'), backdrop = $('.pop-backdrop');
  var popFrom = null, popIndex = -1;
  function oi(mod, size) { return '<img class="oi" src="' + ROOT + 'assets/img/odoo/' + mod + '.svg" alt="" width="' + size + '" height="' + size + '">'; }
  function icon(name) {
    var d = { x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>', arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>', check: '<path d="M20 6 9 17l-5-5"/>' }[name];
    return '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
  }
  function renderApp(mod) {
    // Canonicalise: `mod` arrives from a data-* attribute. Everything spliced into the
    // HTML below is APPS' own key, taken from Object.keys, never the attribute string.
    var keys = Object.keys(APPS), ki = keys.indexOf(String(mod));
    if (ki < 0 || !/^[a-z0-9_]+$/.test(keys[ki])) return '';
    mod = keys[ki];
    var a = APPS[mod];
    var rel = (a.related || []).map(function (m) { return APPS[m] ? '<button class="tag" type="button" data-pop-app="' + m + '">' + oi(m, 16) + APPS[m].name + '</button>' : ''; }).join('');
    return '<div class="pop-head">' + oi(mod, 56) + '<div><div class="pop-eyebrow">' + a.eyebrow + '</div><h3>' + a.name + '</h3></div>' +
      '<button class="icon-btn icon-btn--sm" type="button" data-pop-close aria-label="Close">' + icon('x') + '</button></div>' +
      '<div class="pop-body"><p class="lead">' + a.lead + '</p><ul class="checks">' + a.points.map(function (p, i) { return '<li style="--i:' + i + '">' + icon('check') + p + '</li>'; }).join('') + '</ul>' +
      (rel ? '<div class="pop-meta"><span class="small muted" style="align-self:center">Works with</span>' + rel + '</div>' : '') + '</div>' +
      '<div class="pop-foot"><a class="btn btn-ghost" href="' + ROOT + 'odoo/apps/' + ((window.TN_APP_SLUG || {})[mod] || mod) + '">About Odoo ' + a.name + ' ' + icon('arrow') + '</a>' +
      '<a class="btn btn-primary" href="' + ROOT + 'quotation">Get a quotation ' + icon('arrow') + '</a></div>';
  }
  function renderFlow(i) {
    var s = FLOW[i];
    var nav = '<div class="pop-nav">' +
      '<button class="icon-btn icon-btn--sm icon-btn--prev" type="button" data-pop-step="' + (i - 1) + '" aria-label="Previous step"' + (i === 0 ? ' disabled' : '') + '>' + icon('arrow') + '</button>' +
      '<button class="icon-btn icon-btn--sm icon-btn--next" type="button" data-pop-step="' + (i + 1) + '" aria-label="Next step"' + (i >= FLOW.length - 1 ? ' disabled' : '') + '>' + icon('arrow') + '</button></div>';
    return '<div class="pop-head">' + oi(s.app, 56) + '<div><div class="pop-eyebrow">' + s.lane + ' · step ' + (i + 1) + ' of ' + FLOW.length + '</div><h3>' + s.title + '</h3></div>' +
      '<button class="icon-btn icon-btn--sm" type="button" data-pop-close aria-label="Close">' + icon('x') + '</button></div>' +
      '<div class="pop-body"><p class="lead">' + s.lead + '</p><ul class="checks">' + s.points.map(function (p, k) { return '<li style="--i:' + k + '">' + icon('check') + p + '</li>'; }).join('') + '</ul>' +
      '<div class="pop-meta"><span class="tag tag--ok">' + icon('check') + s.trigger + '</span><button class="tag" type="button" data-pop-app="' + s.app + '">' + oi(s.app, 16) + 'About ' + APPS[s.app].name + '</button></div></div>' +
      '<div class="pop-foot">' + nav + '<a class="btn btn-primary" href="' + ROOT + 'quotation">Get a quotation ' + icon('arrow') + '</a></div>';
  }
  function openPop(fromEl, html) {
    if (!pop) return;
    popFrom = fromEl || popFrom;
    var wasOpen = !pop.hidden;
    pop.innerHTML = html;
    pop.hidden = false; backdrop.hidden = false;
    document.body.style.overflow = 'hidden';
    hold('pop');
    if (!wasOpen && popFrom && !reduce) {
      var r = popFrom.getBoundingClientRect(), p = pop.getBoundingClientRect();
      var dx = (r.left + r.width / 2) - (p.left + p.width / 2), dy = (r.top + r.height / 2) - (p.top + p.height / 2);
      var s = Math.max(.12, Math.min(r.width / p.width, .45));
      pop.animate([{ transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + s + ')', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 460, easing: 'cubic-bezier(.2,.8,.2,1)' });
      backdrop.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 320 });
      popFrom.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.18)' }, { transform: 'scale(1)' }], { duration: 420, easing: 'ease-out' });
    } else if (wasOpen && !reduce) {
      pop.animate([{ transform: 'scale(.97)', opacity: .6 }, { transform: 'none', opacity: 1 }], { duration: 220, easing: 'ease-out' });
    }
    var c = $('[data-pop-close]', pop); if (c) c.focus({ preventScroll: true });
  }
  function closePop() {
    if (!pop || pop.hidden) return;
    var from = popFrom;
    var finish = function () { pop.hidden = true; backdrop.hidden = true; document.body.style.overflow = ''; litNode(-1); release('pop'); if (from && from.focus) from.focus({ preventScroll: true }); };
    if (reduce || !from) { finish(); return; }
    var r = from.getBoundingClientRect(), p = pop.getBoundingClientRect();
    var dx = (r.left + r.width / 2) - (p.left + p.width / 2), dy = (r.top + r.height / 2) - (p.top + p.height / 2);
    var a = pop.animate([{ transform: 'none', opacity: 1 }, { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(.2)', opacity: 0 }], { duration: 300, easing: 'cubic-bezier(.4,0,.6,1)' });
    backdrop.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 260 });
    a.onfinish = finish;
  }
  function openFlow(i, fromEl) { if (!FLOW[i]) return; popIndex = i; openPop(fromEl, renderFlow(i)); litNode(i); }
  function openApp(mod, fromEl) { popIndex = -1; openPop(fromEl, renderApp(mod)); }
  window.tnOpenApp = openApp;
  if (pop) {
    pop.addEventListener('click', function (e) {
      var t = e.target.closest('[data-pop-close],[data-pop-step],[data-pop-app]');
      if (!t) return;
      if (t.hasAttribute('data-pop-close')) return closePop();
      if (t.hasAttribute('data-pop-app')) return openApp(t.getAttribute('data-pop-app'), null);
      var n = +t.getAttribute('data-pop-step');
      if (n >= 0 && n < FLOW.length) { popIndex = n; openPop(null, renderFlow(n)); litNode(n); }
    });
    backdrop.addEventListener('click', closePop);
    document.addEventListener('keydown', function (e) {
      if (pop.hidden) return;
      if (e.key === 'Escape') closePop();
      if (popIndex >= 0 && e.key === 'ArrowRight' && popIndex < FLOW.length - 1) { popIndex++; openPop(null, renderFlow(popIndex)); litNode(popIndex); }
      if (popIndex >= 0 && e.key === 'ArrowLeft' && popIndex > 0) { popIndex--; openPop(null, renderFlow(popIndex)); litNode(popIndex); }
    });
  }
  // Any element with data-app / data-flow opens its pop-up.
  hero.addEventListener('click', function (e) {
    var a = e.target.closest('[data-app]'); if (a) { openApp(a.getAttribute('data-app'), a); return; }
    var f = e.target.closest('[data-flow]'); if (f) { openFlow(+f.getAttribute('data-flow'), f); }
  });
  // Same for Odoo icons elsewhere on the page that opt in.
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-app-pop]'); if (a && !hero.contains(a)) openApp(a.getAttribute('data-app-pop'), a);
  });

  /* ================================================================ carousel */
  var slides = $$('.slide', hero), dots = $$('.dot', hero), live = $('[data-hero-live]', hero);
  var idx = Math.max(0, slides.findIndex(function (s) { return s.classList.contains('is-active'); }));
  var timer = null, startedAt = 0, remaining = DUR, paused = false, autoplay = !reduce;
  // Random play on every device: a random slide opens the page, then autoplay deals the others in a shuffled
  // order, each once before any repeats (a new deal never starts with the slide just shown). Arrows, dots, keys
  // and swipes step in order. Crawlers and page-speed tools always get slide 1, the one with the page's H1.
  // named crawlers, anything with "bot/" in its UA (Googlebot/2.1, AhrefsBot/7.0), audits and headless browsers;
  // not a bare "bot", which would catch phone brands such as CUBOT
  var crawler = /googlebot|google-inspectiontool|googleother|storebot-google|bingbot|adsbot|applebot|duckduckbot|baiduspider|yandex|slurp|facebookexternalhit|linkedinbot|twitterbot|bot\/|crawler|spider|lighthouse|pagespeed|headlesschrome/i.test(navigator.userAgent || '');
  // a crawler's renderer may fast-forward timers: it gets slide 1 (the H1) and keeps it
  if (crawler) autoplay = false;
  // every visit opens on a different slide than the last one (remembered in this browser)
  var LAST = 'tn_hero_first', last = -1;
  try { last = parseInt(localStorage.getItem(LAST), 10); } catch (e) { /* storage may be blocked */ }
  if (autoplay && slides.length > 1 && !crawler) {
    var pool = slides.map(function (s0, k) { return k; }).filter(function (k) { return k !== last; });
    // the head script (build.py HERO_FIRST_HEAD) has usually picked it already, so the intro could dress for it
    var pre = window.__tnHeroFirst;
    var r0 = typeof pre === 'number' && slides[pre] ? pre : pool[Math.floor(Math.random() * pool.length)];
    if (r0 !== idx) { slides[idx].classList.remove('is-active'); slides[r0].classList.add('is-active'); idx = r0; }
    try { localStorage.setItem(LAST, String(idx)); } catch (e) { /* storage may be blocked */ }
  }
  // ?slide=2 opens that slide and holds it (deep links and QA); the arrows and dots still work
  var want = /[?&]slide=([1-9])(?:&|$)/.exec(location.search);
  if (want && slides[+want[1] - 1]) {
    var wi = +want[1] - 1;
    if (wi !== idx) { slides[idx].classList.remove('is-active'); slides[wi].classList.add('is-active'); idx = wi; }
    autoplay = false;
  }
  var deck = [];
  function deal() {
    deck = slides.map(function (s, i) { return i; }).filter(function (i) { return i !== idx; });
    for (var i = deck.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = deck[i]; deck[i] = deck[j]; deck[j] = t; }
  }
  function nextIdx() {
    if (slides.length < 2) return idx;
    if (crawler) return (idx + 1) % slides.length;
    deck = deck.filter(function (i) { return i !== idx; });
    if (!deck.length) deal();
    return deck.shift();
  }

  function announce(viaUser) {
    if (!live) return;
    live.setAttribute('aria-live', viaUser || !autoplay ? 'polite' : 'off');
    live.textContent = 'Slide ' + (idx + 1) + ' of ' + slides.length + ': ' + (slides[idx].dataset.title || '');
  }

  /* ---- camera transitions: a different enter + exit style per slide, ~3 s in total ---- */
  var CAM_IN = ['cam-in-orbit', 'cam-in-spiral', 'cam-in-tumble'];
  var CAM_OUT = ['cam-out-spin', 'cam-out-fly', 'cam-out-tilt'];
  var CAM_CLASSES = CAM_IN.concat(CAM_OUT, ['is-leaving', 'is-entering', 'cam-first']);
  var camTimers = [], camOn = !reduce && !mobile.matches;
  function camClear() {
    camTimers.forEach(clearTimeout); camTimers = [];
    slides.forEach(function (s) { CAM_CLASSES.forEach(function (c) { s.classList.remove(c); }); });
    hero.classList.remove('is-cam'); slides.forEach(function (s) { s.style.removeProperty('--cam'); });
  }
  // quick: coming from the industries slide, which makes no camera exit of its own (its scene closes into the badge),
  // so the new slide's content starts arriving at once instead of leaving the hero empty for a beat
  function camEnter(slide, n, first, quick) {
    slide.classList.add('is-entering', CAM_IN[n % CAM_IN.length]);
    if (first) slide.classList.add('cam-first');
    hero.classList.add('is-cam');
    // the delay of the slide's own reveals, on the slide (on the hero it restyled everything when the move ended);
    // it stays until the next change clears it
    slide.style.setProperty('--cam', first ? '700ms' : quick ? '400ms' : '900ms');
    tiltReset();
    camTimers.push(setTimeout(function () {
      slide.classList.remove('is-entering', 'cam-first'); CAM_IN.forEach(function (c) { slide.classList.remove(c); });
      hero.classList.remove('is-cam');
      // ease from flat into the current cursor tilt instead of snapping
      tilt.cx = tilt.cy = 0; if (!tilt.raf) tilt.raf = requestAnimationFrame(tiltStep);
    }, first ? 2000 : 3000));
  }
  function camLeave(slide, o) {
    slide.classList.add('is-leaving', CAM_OUT[o % CAM_OUT.length]);
    camTimers.push(setTimeout(function () { slide.classList.remove('is-leaving'); CAM_OUT.forEach(function (c) { slide.classList.remove(c); }); }, 1200));
  }

  function show(n, viaUser) {
    n = (n + slides.length) % slides.length;
    if (n === idx) return;
    var old = idx;
    if (camOn) camClear();
    var circle = isCircle(n) || isCircle(old);
    if (circle) keepUnder(isCircle(n) ? slides[old] : slides[n]);
    // the industries slide opens as a circle from its badge strip over the slide before, which holds still under it
    if (!circle && isOwn(n)) keepUnder(slides[old]);
    if (isCircle(old)) keepClosing(slides[old]);
    if (isCircle(n)) { slides[n].classList.remove('is-closing'); clearTimeout(closeT); }
    slides[old].classList.remove('is-active');
    if (dots[old]) { dots[old].classList.remove('is-active'); dots[old].setAttribute('aria-selected', 'false'); }
    idx = n;
    slides[idx].classList.add('is-active');
    // the industries slide makes its own entrance and exit (a full-bleed scene must not spin): it only fades, its
    // neighbours keep their camera moves
    if (camOn && !isNexi(idx) && !circle) { if (!isOwn(old) && !isOwn(idx)) camLeave(slides[old], old); if (!isOwn(idx)) camEnter(slides[idx], idx, false, isOwn(old)); }
    if (dots[idx]) { dots[idx].classList.add('is-active'); dots[idx].setAttribute('aria-selected', 'true'); if (!autoplay) dots[idx].classList.add('is-static'); }
    announce(viaUser); onSlide(idx); restart();
    if (viaUser === 'key' && dots[idx]) dots[idx].focus({ preventScroll: true });
  }
  function clear() { if (timer) { clearTimeout(timer); timer = null; } }
  // Nexi's slides: no camera move (she performs the entrance) and a still hero background while she presents
  function isNexi(i) { return !!(slides[i] && slides[i].hasAttribute('data-slide-nexi')); }
  // the Nexi Explains slide opens and closes as a circle on its own layer (hero.css): no camera move on either side
  // of it, and the slide underneath stays fully visible (and still) until the circle has covered or uncovered it
  function isCircle(i) { return !!(slides[i] && slides[i].hasAttribute('data-slide-circle')); }
  function isOwn(i) { return !!(slides[i] && slides[i].hasAttribute('data-slide-inds')); }
  var underT = null, under = null, closeT = null;
  function keepUnder(el) {
    if (under) under.classList.remove('is-under');
    clearTimeout(underT); under = el; el.classList.add('is-under');
    underT = setTimeout(function () { el.classList.remove('is-under'); under = null; }, 1000);
  }
  // a slide's headline and fade-ins reset the moment it stops being active: the circle slide keeps its content
  // (.is-closing, hero.css) while its circle shrinks, and the slide underneath keeps its own (.is-under)
  function keepClosing(el) {
    el.classList.add('is-closing'); clearTimeout(closeT);
    closeT = setTimeout(function () { el.classList.remove('is-closing'); }, 950);
  }
  // a slide may ask for a longer turn (data-dur, ms): the launch path needs ~14 s to reach Run
  function durOf(i) { return (slides[i] && +slides[i].dataset.dur) || DUR; }
  // restarted two frames later instead of with a forced reflow (that read restyled the whole page, ~45 ms, on the intro's iris)
  function restartBar() { var d = dots[idx]; if (!d) return; d.classList.add('is-restart'); var tok = (d._rb = (d._rb || 0) + 1); requestAnimationFrame(function () { requestAnimationFrame(function () { if (d._rb === tok) d.classList.remove('is-restart'); }); }); }
  // barDur: the length of the active dot's bar animation (its --dur), so a postponed turn can redraw the bar to match
  var barDur = DUR;
  function setBar(dur, lag) { var d = dots[idx]; if (!d) return; barDur = dur; d.style.setProperty('--dur', dur + 'ms'); d.style.setProperty('--lag', (lag || 0) + 'ms'); }
  function restart() { clear(); remaining = durOf(idx); dots.forEach(function (d) { d.style.removeProperty('--lag'); }); setBar(remaining, 0); if (!autoplay) return; if (!paused) { startedAt = performance.now(); timer = setTimeout(function () { show(nextIdx()); }, remaining); } }
  function pause() { if (paused || !autoplay) return; paused = true; hero.classList.add('is-paused'); if (timer) { remaining = Math.max(200, remaining - (performance.now() - startedAt)); clear(); } }
  // after the visitor has been doing something in the hero the turn is postponed: at least GRACE is left when the
  // countdown runs again, and the bar steps back to show it
  var GRACE = 4000;
  function resume() {
    if (!paused || !autoplay) return; paused = false;
    if (remaining < GRACE && barDur > GRACE) { remaining = GRACE; setBar(barDur, GRACE - barDur); restartBar(); }
    hero.classList.remove('is-paused'); startedAt = performance.now(); timer = setTimeout(function () { show(nextIdx()); }, remaining);
  }
  // Autoplay stops while anything holds it: the pause button, a hand on the interactive visual, keyboard
  // focus, an open pop-up, a touch, the intro, a hidden tab or the hero off screen. It runs again only when
  // no hold is left. The progress bar pauses with the timer (.is-paused), so the two always agree.
  var holds = {};
  function hold(why) { holds[why] = 1; pause(); }
  function release(why) { delete holds[why]; for (var k in holds) if (holds[k]) return; resume(); }

  dots.forEach(function (d, i) { d.addEventListener('click', function () { show(i, true); }); });
  var prev = $('[data-hero-prev]', hero), next = $('[data-hero-next]', hero);
  if (prev) prev.addEventListener('click', function () { show(idx - 1, 'click'); });
  if (next) next.addEventListener('click', function () { show(idx + 1, 'click'); });
  // the pause button: the visitor's own hold, shown as pause / play
  var pp = $('[data-hero-pp]', hero);
  if (pp) {
    if (!autoplay) pp.hidden = true;
    pp.addEventListener('click', function () {
      var stop = pp.getAttribute('aria-pressed') !== 'true';
      pp.setAttribute('aria-pressed', stop ? 'true' : 'false');
      pp.setAttribute('aria-label', stop ? 'Play the slides' : 'Pause the slides');
      stop ? hold('user') : release('user');
    });
  }
  // A hand on the interactive visual holds the slide (so it never changes under the cursor); the headline,
  // the text and these controls do not. Released with a short delay, so crossing the stage does not stop it.
  var HOLD = '.dash-wrap,.cine,.pmap,.lj,.nxh-stage button,.nxs,.actions,.pill-row,[data-app],[data-flow],.hxs-left,.hxs-nexi-b,.hxs-pills', holdT = null;
  // the Nexi stage holds the slide while Nexi finishes a spoken line (hero-scenes.js, tn:hero-hold)
  hero.addEventListener('tn:hero-hold', function (e) { var d = e.detail || {}; if (!d.why) return; d.on ? hold(d.why) : release(d.why); });
  // ...and asks for a new turn when the visitor jumps within its script, so it never changes mid-explanation
  hero.addEventListener('tn:hero-dur', function (e) {
    var ms = e.detail && +e.detail.ms; if (!ms || !autoplay) return;
    clear(); remaining = ms;
    if (dots[idx]) { setBar(ms, 0); restartBar(); }
    if (!paused) { startedAt = performance.now(); timer = setTimeout(function () { show(nextIdx()); }, remaining); }
  });
  hero.addEventListener('pointerover', function (e) {
    if (e.pointerType === 'touch' || !e.target.closest(HOLD)) return;
    clearTimeout(holdT); hold('hover');
  });
  hero.addEventListener('pointerout', function (e) {
    if (e.pointerType === 'touch' || !e.target.closest(HOLD)) return;
    var to = e.relatedTarget;
    if (to && to.closest && to.closest(HOLD)) return;
    clearTimeout(holdT); holdT = setTimeout(function () { release('hover'); }, 400);
  });
  hero.addEventListener('pointerleave', function () { clearTimeout(holdT); release('hover'); });
  // a click or tap anywhere in the hero (not on the slide controls) is the visitor doing something: the turn waits
  // while they do and a few seconds after (and then has GRACE left)
  var actT = 0;
  hero.addEventListener('pointerdown', function (e) {
    if (e.target.closest('.hero-ctl')) return;
    hold('act'); clearTimeout(actT); actT = setTimeout(function () { release('act'); }, 2500);
  });
  // the header's menus, the phone menu and the Let's Talk panel cover the hero: the turn waits until they close
  var hdr = document.querySelector('[data-header]'), mnav = document.getElementById('mnav');
  function menus() {
    var open = !!(hdr && hdr.classList.contains('is-open')) || !!(mnav && !mnav.hidden) || document.body.classList.contains('talk-open') || document.body.classList.contains('tabs-open');
    open ? hold('menu') : release('menu');
  }
  if (window.MutationObserver) {
    var mo = new MutationObserver(menus);
    if (hdr) mo.observe(hdr, { attributes: true, attributeFilter: ['class'] });
    if (mnav) mo.observe(mnav, { attributes: true, attributeFilter: ['hidden'] });
    mo.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }
  // keyboard focus holds it too; a mouse click on an arrow or a dot does not (that used to freeze the bar)
  hero.addEventListener('focusin', function (e) { if (e.target.matches && e.target.matches(':focus-visible')) hold('focus'); });
  hero.addEventListener('focusout', function (e) { if (!hero.contains(e.relatedTarget)) release('focus'); });
  document.addEventListener('visibilitychange', function () { document.hidden ? hold('tab') : release('tab'); });
  hero.addEventListener('keydown', function (e) {
    if (e.target.closest('input,textarea')) return;
    if (e.key === 'ArrowRight' && (!pop || pop.hidden)) show(idx + 1, 'key');
    if (e.key === 'ArrowLeft' && (!pop || pop.hidden)) show(idx - 1, 'key');
  });
  // Swipe to change slide, except where a swipe already means something: spinning the orbit, scrolling the
  // process map sideways, scrubbing the plan. A touch pauses autoplay for a while.
  var tx = null, ty = null, touchT = 0;
  hero.addEventListener('touchstart', function (e) {
    var own = e.target.closest('.cine,.pm-view,.pm-scen,.lj,.hxs-strip');
    tx = own ? null : e.changedTouches[0].clientX; ty = e.changedTouches[0].clientY;
    hold('touch'); clearTimeout(touchT); touchT = setTimeout(function () { release('touch'); }, 9000);
  }, { passive: true });
  hero.addEventListener('touchend', function (e) {
    if (tx === null) return;
    var dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty; tx = null;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4) show(idx + (dx < 0 ? 1 : -1), true);
  }, { passive: true });

  /* ================================================================ background: particles + spotlight */
  var bg = (function () {
    var canvas = $('canvas.particles', hero);
    if (!canvas || reduce || mobile.matches) return { on: function () {}, off: function () {} };
    var ctx = canvas.getContext('2d'), W = 0, H = 0, dpr = 1, raf = null, pts = [], mx = .5, my = .4, on = false;
    var sized = false;
    function size() {
      var r = hero.getBoundingClientRect(); dpr = Math.min(1.5, window.devicePixelRatio || 1);
      W = Math.max(1, Math.round(r.width)); H = Math.max(1, Math.round(r.height));
      var cw = Math.round(W * dpr), ch = Math.round(H * dpr);
      if (canvas.width !== cw) canvas.width = cw;
      if (canvas.height !== ch) canvas.height = ch;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); sized = true;
    }
    function seed() {
      pts = [];
      var n = Math.round(W / 26);
      for (var i = 0; i < n; i++) { var d = .3 + Math.random() * .7; pts.push({ x: Math.random() * W, y: Math.random() * H, r: 1.2 + Math.random() * 2.4, v: .12 + Math.random() * .3, ph: Math.random() * 6.28, d: d, fs: 'rgba(49,103,202,' + (0.10 + d * 0.16).toFixed(3) + ')' }); }
    }
    // links are batched into 8 alpha bands (one stroke per band instead of one per pair) and every
    // colour string is built once: same picture, a fraction of the canvas calls and no per-frame garbage
    var BANDS = 8, bandStyle = [], bandSeg = [];
    for (var bi = 0; bi < BANDS; bi++) { bandStyle.push('rgba(111,160,245,' + (0.10 * (bi + 0.5) / BANDS).toFixed(4) + ')'); bandSeg.push([]); }
    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      var px = (mx - .5) * 30, py = (my - .5) * 20, i, j, b, p, q;
      for (i = 0; i < pts.length; i++) {
        p = pts[i];
        p.y -= p.v; p.ph += .01;
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
        p.sx = p.x + Math.sin(p.ph) * 14 + px * p.d; p.sy = p.y + py * p.d;
      }
      for (b = 0; b < BANDS; b++) bandSeg[b].length = 0;
      for (i = 0; i < pts.length; i++) {
        p = pts[i];
        for (j = i + 1; j < pts.length; j++) {
          q = pts[j]; var ddx = q.x - p.x, ddy = q.y - p.y, dist = ddx * ddx + ddy * ddy;
          if (dist < 8100) bandSeg[Math.min(BANDS - 1, ((1 - dist / 8100) * BANDS) | 0)].push(p.sx, p.sy, q.sx, q.sy);
        }
      }
      ctx.lineWidth = 1;
      for (b = 0; b < BANDS; b++) {
        var sg = bandSeg[b]; if (!sg.length) continue;
        ctx.beginPath(); for (var k = 0; k < sg.length; k += 4) { ctx.moveTo(sg[k], sg[k + 1]); ctx.lineTo(sg[k + 2], sg[k + 3]); }
        ctx.strokeStyle = bandStyle[b]; ctx.stroke();
      }
      for (i = 0; i < pts.length; i++) { p = pts[i]; ctx.beginPath(); ctx.arc(p.sx, p.sy, p.r, 0, 6.283); ctx.fillStyle = p.fs; ctx.fill(); }
      raf = (on && !document.hidden) ? requestAnimationFrame(draw) : null;
    }
    var spot = $('.spotlight', hero), box = null, pmRaf = 0;
    function heroBox() { var r = hero.getBoundingClientRect(); box = { l: r.left, t: r.top + window.scrollY, w: r.width || 1, h: r.height || 1 }; }
    function placeSpot() { if (spot) { spot.style.setProperty('--sx', (mx * box.w).toFixed(1) + 'px'); spot.style.setProperty('--sy', (my * box.h).toFixed(1) + 'px'); } }
    heroBox(); mx = .5; my = .3; placeSpot(); mx = .5; my = .4;
    window.addEventListener('resize', function () { box = null; }, { passive: true });
    hero.addEventListener('pointerenter', function () { box = null; });
    hero.addEventListener('pointermove', function (e) {
      if (!box) heroBox();
      mx = (e.clientX - box.l) / box.w; my = (e.clientY + window.scrollY - box.t) / box.h;
      if (!pmRaf) pmRaf = requestAnimationFrame(function () { pmRaf = 0; placeSpot(); parallax(mx - .5, my - .5); });
    }, { passive: true });
    hero.addEventListener('pointerleave', function () { hoverLock = false; parallax(0, 0); });
    window.addEventListener('resize', function () { if (on) { size(); seed(); } else sized = false; });
    // the hero's own height can change without a window resize (web fonts arriving): measured then, after layout
    if ('ResizeObserver' in window) new ResizeObserver(function () { if (!sized) return; if (on) size(); else sized = false; }).observe(hero);
    document.addEventListener('visibilitychange', function () { if (!document.hidden && on && !raf) raf = requestAnimationFrame(draw); });
    return { on: function () { on = true; if (!raf) { if (!sized) size(); if (!pts.length) seed(); raf = requestAnimationFrame(draw); } }, off: function () { on = false; } };
  })();
  bg.on();
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      var vis = es[es.length - 1].isIntersecting;
      hero.classList.toggle('is-off', !vis);
      if (vis) { if (!isNexi(idx) && !hero.classList.contains('is-full')) bg.on(); release('off'); } else { bg.off(); hold('off'); }
    }, { threshold: 0 }).observe(hero);
  }

  /* ================================================================ 3D tilt stage + parallax layers
     The active slide's .slide-inner rotates toward the cursor (max ±6° X, ±9° Y) with eased follow-through;
     [data-depth] floaters also drift laterally and sit at their own Z (data-z). Everything else gets its
     depth from CSS translateZ, so the tilt reveals the layering. */
  var layers = $$('[data-depth]', hero);
  var tilt = { tx: 0, ty: 0, cx: 0, cy: 0, raf: null };
  function tiltStep() {
    tilt.cx += (tilt.tx - tilt.cx) * 0.11; tilt.cy += (tilt.ty - tilt.cy) * 0.11;
    var inner = $('.slide-inner', slides[idx]);
    if (inner) inner.style.transform = 'rotateX(' + (-tilt.cy * 16).toFixed(2) + 'deg) rotateY(' + (tilt.cx * 24).toFixed(2) + 'deg)';
    layers.forEach(function (el) {
      // floaters drift laterally by depth factor but stay on the slide plane (Z 0) so they hit-test in 2D
      var d = parseFloat(el.dataset.depth) || 0;
      el.style.transform = 'translate(' + (tilt.cx * d * 48).toFixed(1) + 'px,' + (tilt.cy * d * 36).toFixed(1) + 'px)';
    });
    tilt.raf = (Math.abs(tilt.tx - tilt.cx) > 0.0005 || Math.abs(tilt.ty - tilt.cy) > 0.0005) ? requestAnimationFrame(tiltStep) : null;
  }
  // While the pointer is over an interactive icon the stage stops moving, so the hit box stays put.
  // Whole interactive zones lock the stage, not just the icons: the visual column, the spec strip, the CTAs.
  var HOT = '.dash-wrap,.cine,.pmap,.lj,.nxh-stage,.nxs,.spec-strip,.actions,.pill-row,[data-app],[data-flow],.hero-arrow,.dot,.hxs-left,.hxs-strip,.hxs-cast';
  var hoverLock = false, unlockTimer = null;
  function lock() {
    clearTimeout(unlockTimer); unlockTimer = null;
    if (!hoverLock) { hoverLock = true; hero.classList.add('is-hot'); }
    tilt.tx = tilt.cx; tilt.ty = tilt.cy;                       // stop the stage exactly where it is
  }
  function unlockSoon() {
    // release with hysteresis so the stage never starts moving the instant the cursor grazes an edge
    clearTimeout(unlockTimer);
    unlockTimer = setTimeout(function () { hoverLock = false; hero.classList.remove('is-hot'); unlockTimer = null; }, 350);
  }
  hero.addEventListener('pointerover', function (e) { if (e.target.closest(HOT)) lock(); });
  hero.addEventListener('pointerout', function (e) {
    var t = e.target.closest(HOT);
    if (t && !(e.relatedTarget && t.contains(e.relatedTarget))) unlockSoon();
  });
  hero.addEventListener('pointerleave', function () { clearTimeout(unlockTimer); hoverLock = false; hero.classList.remove('is-hot'); });
  function parallax(x, y) {
    if (!fine || reduce || mobile.matches || hoverLock) return;
    // R9: the industries slide stays flat. Its badge strip sat on the tilting plane, so the stage leaned toward the
    // cursor as it neared a badge and the badge's hit area slid ~30 px away from where it was drawn (about half of
    // the clicks missed). The full-bleed scene has its own pointer drift (hero-industries.js --px/--py).
    if (isOwn(idx)) { x = 0; y = 0; }
    tilt.tx = x; tilt.ty = y;
    if (!tilt.raf) tilt.raf = requestAnimationFrame(tiltStep);
  }
  function tiltReset() { tilt.cx = tilt.cy = 0; slides.forEach(function (s) { var i = $('.slide-inner', s); if (i) i.style.transform = ''; }); }

  /* ================================================================ rotating word */
  var rot = $('.rot', hero), rotTimer = null;
  function startRot() {
    if (!rot || reduce) { if (rot) $$('b', rot)[0].classList.add('is-on'); return; }
    var words = $$('b', rot), k = 0;
    words.forEach(function (w, i) { w.classList.toggle('is-on', i === 0); w.classList.remove('is-out'); });
    clearInterval(rotTimer);
    rotTimer = setInterval(function () {
      if (hero.classList.contains('is-off')) return;
      var cur = words[k]; k = (k + 1) % words.length; var nxt = words[k];
      cur.classList.remove('is-on'); cur.classList.add('is-out');
      nxt.classList.remove('is-out'); nxt.classList.add('is-on');
      setTimeout(function () { cur.classList.remove('is-out'); }, 600);
    }, 2600);
  }

  /* ================================================================ counters + toasts (slide 1) */
  function grp(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function counters(slide) {
    $$('[data-count]', slide).forEach(function (el) {
      var end = +el.dataset.count, suf = el.dataset.suffix || '', t0 = null, dur = 1100;
      if (reduce) { el.textContent = grp(end) + suf; return; }
      var shown = '';
      function step(t) { if (!t0) t0 = t; var p = Math.min(1, (t - t0) / dur); p = 1 - Math.pow(1 - p, 3); var v = grp(Math.round(end * p)) + suf; if (v !== shown) { shown = v; el.textContent = v; } if (p < 1) requestAnimationFrame(step); }
      requestAnimationFrame(step);
    });
  }
  var toastTimer = null;
  function toasts(slide, on) {
    var list = $$('.toast', slide); clearInterval(toastTimer);
    list.forEach(function (t) { t.classList.remove('is-on'); });
    if (!on || !list.length || reduce) { if (list[0] && reduce) list[0].classList.add('is-on'); return; }
    var k = 0;
    var tick = function () { if (hero.classList.contains('is-off')) return; list.forEach(function (t, i) { t.classList.toggle('is-on', i === k); }); k = (k + 1) % list.length; };
    setTimeout(tick, 900);
    toastTimer = setInterval(tick, 3200);
  }

  /* ================================================================ map nodes (slide 2, drawn by hero-scenes.js) */
  function litNode(i) {
    $$('[data-flow]', hero).forEach(function (n) { n.classList.toggle('is-lit', +n.getAttribute('data-flow') === i); });
  }

  /* ================================================================ per-slide hooks */
  var fullT = 0;
  function onSlide(i) {
    var s = slides[i];
    hero.classList.toggle('is-nexi-slide', isNexi(i));
    if (isNexi(i)) bg.off(); else if (!hero.classList.contains('is-off')) bg.on();
    // a full-bleed slide (the industries scene, the Nexi Explains sky) covers the backdrop: once its circle has
    // closed over it, the particle canvas and the aurora blobs stop drawing (R9 perf: ~1/4 of each frame's work)
    clearTimeout(fullT); hero.classList.remove('is-full');
    if (isCircle(i) || isOwn(i)) fullT = setTimeout(function () { if (idx === i) { hero.classList.add('is-full'); bg.off(); } }, 1300);
    if (s.hasAttribute('data-slide-dash')) { counters(s); toasts(s, true); startRot(); } else { toasts(slides[0], false); clearInterval(rotTimer); }
    // the scenes (orbit, process map, plan) start and stop themselves on this event
    hero.dispatchEvent(new CustomEvent('tn:slide', { detail: { index: i, slide: s } }));
  }

  // init — the first slide also arrives with a camera move, once the one-time intro (if any) has finished
  if (dots[idx]) { dots[idx].classList.add('is-active'); dots[idx].setAttribute('aria-selected', 'true'); if (!autoplay) dots[idx].classList.add('is-static'); }
  announce(); onSlide(idx); restart();
  if (document.documentElement.classList.contains('intro')) {
    hold('intro');
    document.addEventListener('tn:intro-done', function () { remaining = durOf(idx); release('intro'); restartBar(); }, { once: true });
  }
  if (camOn) {
    var firstEnter = function () { camClear(); if (!isNexi(idx) && !isCircle(idx)) camEnter(slides[idx], idx, true); };
    if (document.documentElement.classList.contains('intro')) document.addEventListener('tn:intro-done', firstEnter, { once: true });
    else firstEnter();
  }
})();
