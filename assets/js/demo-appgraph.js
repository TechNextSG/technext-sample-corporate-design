/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* Odoo apps page: a force-directed map of the Odoo apps and the native links between them. Each
   edge carries the data that moves between two apps (orders to deliveries, stock moves to
   valuation, payslips to journal entries...). Select an app to light up its neighbours and read
   every link; drag apps; highlight a category. Dots travel along the links in the direction the
   data flows. The detail panel links to each app's own page. */
TN.demo('appgraph', function (root, K) {
  var CATS = { fin: ['Finance', '#0E9384'], sal: ['Sales', '#3167CA'], sup: ['Supply Chain', '#D97B12'], hr: ['HR', '#C0267A'],
               srv: ['Services', '#4D7C0F'], mkt: ['Marketing', '#E0533D'], web: ['Websites', '#7447D6'], pro: ['Productivity', '#56709E'] };
  var CORDER = ['fin', 'sal', 'sup', 'hr', 'srv', 'mkt', 'web', 'pro'];
  var ANCH = { web: [.13, .2], mkt: [.12, .66], sal: [.36, .34], fin: [.58, .52], sup: [.85, .24], srv: [.34, .8], hr: [.8, .78], pro: [.6, .9] };
  var APPS = [
    ['accountant', 'Accounting', 'fin', 'Journals, bank sync, tax reports and closing.'], ['hr_expense', 'Expenses', 'fin', 'Capture receipts and approve claims.'],
    ['documents', 'Documents', 'fin', 'File storage with workflows and OCR.'], ['sign', 'Sign', 'fin', 'Legally binding e-signatures.'],
    ['crm', 'CRM', 'sal', 'Leads, pipeline and activities.'], ['sale', 'Sales', 'sal', 'Quotations, orders and upsells.'],
    ['point_of_sale', 'Point of Sale', 'sal', 'Offline-ready retail checkout.'], ['sale_subscription', 'Subscriptions', 'sal', 'Recurring billing and renewals.'],
    ['website', 'Website', 'web', 'Drag-and-drop pages with SEO tools.'], ['website_sale', 'eCommerce', 'web', 'Online store tied to stock and accounting.'],
    ['website_blog', 'Blog', 'web', 'Articles with scheduling and SEO.'], ['website_forum', 'Forum', 'web', 'Community Q&A.'],
    ['website_slides', 'eLearning', 'web', 'Courses, quizzes and certifications.'], ['stock', 'Inventory', 'sup', 'Multi-warehouse stock, barcodes, replenishment.'],
    ['purchase', 'Purchase', 'sup', 'RFQs, vendor pricelists, receipts.'], ['mrp', 'Manufacturing', 'sup', 'Bills of materials and work orders.'],
    ['quality_control', 'Quality', 'sup', 'Control points and quality alerts.'], ['mrp_plm', 'PLM', 'sup', 'Engineering changes and versions.'],
    ['maintenance', 'Maintenance', 'sup', 'Preventive and corrective requests.'], ['hr', 'Employees', 'hr', 'Directory, contracts and org chart.'],
    ['hr_payroll', 'Payroll', 'hr', 'Salary rules and payslips.'], ['hr_holidays', 'Time Off', 'hr', 'Leave requests and allocations.'],
    ['hr_recruitment', 'Recruitment', 'hr', 'Job posts, applicants and interviews.'], ['hr_appraisal', 'Appraisals', 'hr', 'Reviews and goals.'],
    ['project', 'Project', 'srv', 'Tasks, stages and milestones.'], ['hr_timesheet', 'Timesheets', 'srv', 'Time tracking billed to projects.'],
    ['planning', 'Planning', 'srv', 'Shifts, resources and field service.'], ['industry_fsm', 'Field Service', 'srv', 'On-site jobs, run in Planning from Odoo 20.'],
    ['helpdesk', 'Helpdesk', 'srv', 'Tickets, SLAs and knowledge base.'], ['mass_mailing', 'Email Marketing', 'mkt', 'Campaigns, lists and A/B tests.'],
    ['social', 'Social Marketing', 'mkt', 'Schedule and track posts.'], ['marketing_automation', 'Marketing Automation', 'mkt', 'Multi-step flows on triggers.'],
    ['approvals', 'Approvals', 'pro', 'Request and approve anything.'], ['knowledge', 'Knowledge', 'pro', 'Wiki pages linked to records.']
  ];
  // from, to, 1 = one way / 2 = both ways, what moves on the link
  var LINKS = [
    ['crm', 'sale', 1, 'Won opportunities become quotations, with the customer and products'],
    ['sale', 'stock', 2, 'Confirmed orders create deliveries; delivered quantities come back for invoicing'],
    ['sale', 'accountant', 2, 'Invoices from ordered or delivered quantities; payment status back on the order'],
    ['stock', 'accountant', 1, 'Stock moves post valuation entries when automated valuation is on'],
    ['point_of_sale', 'stock', 1, 'POS orders take products out of the shop’s warehouse'],
    ['point_of_sale', 'accountant', 1, 'Closing a session posts its sales, taxes and payments'],
    ['mrp', 'stock', 2, 'Components consumed and finished goods produced as stock moves'],
    ['mrp', 'purchase', 2, 'Missing components are bought through replenishment'],
    ['mrp', 'quality_control', 2, 'Quality checks on manufacturing operations, with alerts'],
    ['mrp_plm', 'mrp', 1, 'Engineering change orders release new bill of materials versions'],
    ['maintenance', 'mrp', 2, 'Equipment on work centres; maintenance requests from the shop floor'],
    ['purchase', 'stock', 2, 'Confirmed purchase orders create receipts; received quantities come back'],
    ['purchase', 'accountant', 1, 'Vendor bills from purchase orders, matched to what was received'],
    ['quality_control', 'stock', 2, 'Quality checks on receipts and deliveries'],
    ['hr', 'hr_payroll', 2, 'Contracts, wages and working schedules feed each payslip'],
    ['hr_payroll', 'accountant', 1, 'Payslip batches post salary expense and what is owed'],
    ['hr', 'hr_holidays', 2, 'Leave requests per employee, approved by their manager'],
    ['hr', 'hr_expense', 2, 'Expense claims per employee, approved by their manager'],
    ['hr_expense', 'accountant', 1, 'Approved expenses post to the books for reimbursement'],
    ['hr_recruitment', 'hr', 1, 'A hired applicant becomes an employee record'],
    ['hr', 'hr_appraisal', 2, 'Appraisals per employee and manager, with goals'],
    ['project', 'hr_timesheet', 2, 'Time logged on tasks against the planned hours'],
    ['project', 'planning', 2, 'Shifts planned on projects and tasks'],
    ['project', 'industry_fsm', 2, 'Field service jobs are project tasks, with worksheets'],
    ['hr_timesheet', 'sale', 1, 'Billable time invoiced through the sales order'],
    ['sale', 'project', 1, 'Service products create a project or task when the order is confirmed'],
    ['industry_fsm', 'sale', 1, 'Products used on site go on a sales order to invoice'],
    ['website', 'website_sale', 1, 'The shop runs on the website’s pages, menus and visitors'],
    ['website', 'website_blog', 1, 'Blog posts published on the website'],
    ['website', 'website_forum', 1, 'A community forum on the website'],
    ['website', 'website_slides', 1, 'Courses and quizzes published on the website'],
    ['website_sale', 'sale', 1, 'Online orders arrive as sales orders'],
    ['stock', 'website_sale', 1, 'Stock availability shown on product pages'],
    ['mass_mailing', 'crm', 1, 'Leads from a mailing are tracked back to it'],
    ['social', 'crm', 1, 'Leads from social posts, tracked by campaign'],
    ['marketing_automation', 'crm', 1, 'Timed emails and actions on leads until sales takes over'],
    ['helpdesk', 'hr_timesheet', 2, 'Time spent on tickets'],
    ['helpdesk', 'industry_fsm', 1, 'Plan an on-site intervention from a ticket'],
    ['knowledge', 'helpdesk', 1, 'Articles published in the help centre'],
    ['approvals', 'purchase', 1, 'Approved purchase requests create RFQs'],
    ['approvals', 'hr', 2, 'Requests routed to the employee’s manager'],
    ['planning', 'hr', 2, 'Shifts assigned to employees'],
    ['hr_holidays', 'planning', 1, 'Time off blocks planning availability'],
    ['documents', 'accountant', 1, 'Uploaded bills and receipts become draft vendor bills'],
    ['documents', 'hr', 2, 'Employee documents filed per employee'],
    ['documents', 'sign', 2, 'Any document sent for signature; the signed copy filed back'],
    ['sign', 'hr', 1, 'Employee contracts and forms sent for e-signature'],
    ['sale_subscription', 'sale', 2, 'Subscriptions are sales orders on a recurring plan'],
    ['sale_subscription', 'accountant', 1, 'Recurring invoices each billing period']
  ];
  var NOTE = { industry_fsm: 'In Odoo 20 the Field Service features move into the Planning app.' };
  var ARROW = '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';

  var stage = K.$('.agr-stage', root), svgE = K.$('.agr-edges', root), layer = K.$('.agr-nodes', root), side = K.$('.agr-side', root);
  var tip = K.tip(stage);
  var nodes = APPS.map(function (a, i) { return { id: a[0], name: a[1], cat: a[2], desc: a[3], i: i, x: 0, y: 0, vx: 0, vy: 0, fx: null, links: [] }; });
  var byId = {}; nodes.forEach(function (n) { byId[n.id] = n; });
  var edges = LINKS.map(function (l, k) { var e = { k: k, a: byId[l[0]], b: byId[l[1]], dir: l[2], text: l[3] }; e.a.links.push(e); e.b.links.push(e); return e; });
  var N = nodes.length;
  K.$('[data-k="count"]', root).textContent = N + ' apps · ' + edges.length + ' native links';

  // ---------------------------------------------------------------- DOM
  var gE = K.svg('g', {}), gHit = K.svg('g', {}), gDot = K.svg('g', {});
  svgE.appendChild(gE); svgE.appendChild(gDot); svgE.appendChild(gHit);
  edges.forEach(function (e) {
    e.ln = K.svg('line', { 'class': 'agr-e' }); gE.appendChild(e.ln);
    e.hit = K.svg('line', { 'class': 'agr-hit' }); gHit.appendChild(e.hit);
    e.hit.addEventListener('pointerenter', function (ev) { if (drag) return; var p = local(ev); showEdge(e, p[0], p[1]); });
    e.hit.addEventListener('pointerleave', function () { tip.hide(); if (hoverE === e) { hoverE = null; paint(); } });
  });
  nodes.forEach(function (n) {
    var b = K.el('button', 'agr-n'); b.type = 'button'; b.style.setProperty('--c', CATS[n.cat][1]);
    var ic = K.el('span', 'agr-ic'); ic.innerHTML = K.oi(n.id, 28); b.appendChild(ic);
    b.appendChild(K.el('span', 'agr-lb', n.name));
    b.setAttribute('aria-label', n.name + ', ' + CATS[n.cat][0] + ', ' + n.links.length + ' links');
    b.setAttribute('aria-pressed', 'false');
    layer.appendChild(b); n.el = b;
    b.addEventListener('pointerdown', function (ev) { startDrag(n, ev); });
    b.addEventListener('click', function () { if (moved) { moved = false; return; } select(sel === n ? null : n); });
    b.addEventListener('pointerenter', function () { if (drag) return; tip.show([n.name, CATS[n.cat][0] + ' · ' + n.links.length + ' links'], n.x, n.y - IC / 2 - 2); });
    b.addEventListener('pointerleave', function () { tip.hide(); });
  });
  stage.addEventListener('click', function (ev) { if (ev.target === stage || ev.target === svgE || ev.target === layer) select(null); });
  root.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && sel) { select(null); } });

  // ---------------------------------------------------------------- the force layout
  var W = 800, H = 540, IC = 44, NW = 88, small = false, alpha = 0, seed = 7;
  function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
  function measure() {
    var w = stage.clientWidth || 800, h = stage.clientHeight || 540;
    if (W && w !== W) nodes.forEach(function (n) { n.x *= w / W; if (n.fx != null) n.fx *= w / W; });
    if (H && h !== H) nodes.forEach(function (n) { n.y *= h / H; if (n.fx != null) n.fy *= h / H; });
    W = w; H = h; small = W < 560; IC = small ? 34 : 44; NW = small ? 40 : 88;
    root.classList.toggle('is-small', small);
    svgE.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
  }
  function scatter() {
    seed = 7;
    nodes.forEach(function (n) {
      var a = ANCH[n.cat]; n.fx = null; n.el.classList.remove('is-pin');
      n.x = W * (.5 + (a[0] - .5) * .25) + (rnd() - .5) * 40; n.y = H * (.5 + (a[1] - .5) * .25) + (rnd() - .5) * 40; n.vx = n.vy = 0;
    });
    alpha = 1;
  }
  function tick() {
    var s = Math.min(W, H), L = small ? s * .15 : s * .15, REP = s * s * (small ? .006 : .009), ANC = .05;
    var MIN = small ? 48 : 84, KY = small ? 1.1 : 1.42, i, j, n, m, dx, dy, d2, d, f;
    for (i = 0; i < N; i++) for (j = i + 1; j < N; j++) {
      n = nodes[i]; m = nodes[j]; dx = m.x - n.x; dy = m.y - n.y; d2 = dx * dx + dy * dy || .01;
      if (d2 > 90000) continue;
      d = Math.sqrt(d2); f = REP * alpha / d2;
      n.vx -= dx / d * f; n.vy -= dy / d * f; m.vx += dx / d * f; m.vy += dy / d * f;
    }
    edges.forEach(function (e) {
      var dx = e.b.x - e.a.x, dy = e.b.y - e.a.y, d = Math.sqrt(dx * dx + dy * dy) || .01, f = (d - L) / d * .045 * alpha;
      e.a.vx += dx * f; e.a.vy += dy * f; e.b.vx -= dx * f; e.b.vy -= dy * f;
    });
    nodes.forEach(function (n) {
      var a = ANCH[n.cat];
      n.vx += (a[0] * W - n.x) * ANC * alpha; n.vy += (a[1] * H - n.y) * ANC * alpha;
      if (n.fx != null) { n.x = n.fx; n.y = n.fy; n.vx = n.vy = 0; return; }
      n.vx *= .6; n.vy *= .6; n.x += n.vx; n.y += n.vy;
    });
    for (var pass = 0; pass < 2; pass++) for (i = 0; i < N; i++) for (j = i + 1; j < N; j++) {   // labels need room: an elliptic collision
      n = nodes[i]; m = nodes[j]; dx = m.x - n.x; dy = (m.y - n.y) * KY; d = Math.sqrt(dx * dx + dy * dy) || .01;
      if (d >= MIN) continue;
      var push = (MIN - d) / d * .5, px = dx * push, py = dy * push / KY, fa = n.fx != null, fb = m.fx != null;
      if (!fa) { n.x -= fb ? px * 2 : px; n.y -= fb ? py * 2 : py; }
      if (!fb) { m.x += fa ? px * 2 : px; m.y += fa ? py * 2 : py; }
    }
    var px0 = small ? 20 : 46, top = small ? 20 : 26, bot = small ? 20 : 38;
    nodes.forEach(function (n) { if (n.fx != null) return; n.x = K.clamp(n.x, px0, W - px0); n.y = K.clamp(n.y, top, H - bot); });
    alpha *= .982; if (alpha < .004) alpha = 0;
  }
  // written only when a value changes: once the layout settles, rewriting every node and both lines of
  // every edge each frame re-laid out the whole SVG 60 times a second for nothing
  var hitStale = false;
  function render(full) {
    full = full !== false || !!drag;
    nodes.forEach(function (n) {
      var tf = 'translate(' + (n.x - NW / 2).toFixed(1) + 'px,' + (n.y - IC / 2).toFixed(1) + 'px)';
      if (n.tf !== tf) { n.tf = tf; n.el.style.transform = tf; }
    });
    edges.forEach(function (e) {
      var x1 = e.a.x.toFixed(1), y1 = e.a.y.toFixed(1), x2 = e.b.x.toFixed(1), y2 = e.b.y.toFixed(1), k = x1 + ' ' + y1 + ' ' + x2 + ' ' + y2;
      if (e.k !== k) { e.k = k; e.ln.setAttribute('x1', x1); e.ln.setAttribute('y1', y1); e.ln.setAttribute('x2', x2); e.ln.setAttribute('y2', y2); }
      if (!full) { if (e.hk !== k) hitStale = true; return; }
      if (e.hk !== k) { e.hk = k; e.hit.setAttribute('x1', x1); e.hit.setAttribute('y1', y1); e.hit.setAttribute('x2', x2); e.hit.setAttribute('y2', y2); }
    });
  }

  // ---------------------------------------------------------------- dots: data moving along the links
  var dots = [], lastAmb = 0;
  function dot(e, rev, loop, delay, now) {
    var c = K.svg('circle', { r: loop ? 3.4 : 2.6, 'class': 'agr-dot' + (loop ? ' is-loop' : '') });
    c.style.fill = CATS[(rev ? e.b : e.a).cat][1];
    gDot.appendChild(c);
    dots.push({ e: e, rev: rev, loop: loop, t0: now + (delay || 0), el: c });
  }
  function clearDots(all) { dots = dots.filter(function (d) { if (all || d.loop) { d.el.remove(); return false; } return true; }); }
  function moveDots(now) {
    dots = dots.filter(function (d) {
      var a = d.rev ? d.e.b : d.e.a, b = d.rev ? d.e.a : d.e.b, len = Math.hypot(b.x - a.x, b.y - a.y) || 1, T = Math.max(700, len * 9);
      var q = (now - d.t0) / T;
      if (q < 0) { d.el.style.opacity = '0'; return true; }
      if (!d.loop && q >= 1) { d.el.remove(); return false; }
      q = q % 1;
      d.el.style.opacity = String(Math.min(1, Math.sin(q * Math.PI) * 2.2));
      d.el.setAttribute('cx', (a.x + (b.x - a.x) * q).toFixed(1)); d.el.setAttribute('cy', (a.y + (b.y - a.y) * q).toFixed(1));
      return true;
    });
  }
  function selDots(now) {
    clearDots(false);
    if (!sel || K.reduce) return;
    sel.links.forEach(function (e, i) {
      // dots follow the direction the data moves: a to b, or both ways
      if (e.dir === 2) { dot(e, false, true, i * 90, now); dot(e, true, true, i * 90 + 600, now); }
      else dot(e, false, true, i * 90, now);
    });
  }

  // ---------------------------------------------------------------- selection, category highlight, details
  var sel = null, cat = 'all', hoverE = null;
  function other(e, n) { return e.a === n ? e.b : e.a; }
  function paint() {
    var hi = {}, on = {}, focus = sel || cat !== 'all';
    if (sel) { hi[sel.id] = 2; sel.links.forEach(function (e) { hi[other(e, sel).id] = 1; on[e.k] = CATS[other(e, sel).cat][1]; }); }
    else if (cat !== 'all') nodes.forEach(function (n) {
      if (n.cat !== cat) return; hi[n.id] = 2;
      n.links.forEach(function (e) { var o = other(e, n); if (!hi[o.id]) hi[o.id] = 1; on[e.k] = CATS[cat][1]; });
    });
    nodes.forEach(function (n) {
      var c = n.el.classList;
      c.toggle('is-sel', sel === n); c.toggle('is-hi', hi[n.id] === 2 && sel !== n); c.toggle('is-nb', hi[n.id] === 1); c.toggle('is-fade', focus && !hi[n.id]);
      n.el.setAttribute('aria-pressed', String(sel === n));
    });
    edges.forEach(function (e) {
      var c = on[e.k];
      e.ln.classList.toggle('is-on', !!c); e.ln.classList.toggle('is-fade', focus && !c); e.ln.classList.toggle('is-hover', hoverE === e);
      e.ln.style.stroke = c || '';
    });
  }
  function select(n) {
    sel = n; tip.hide(); paint(); details(); selDots(performance.now());
    if (!K.reduce) loop.on();
  }
  function showEdge(e, x, y) {
    hoverE = e; paint();
    var arrow = e.dir === 2 ? ' ↔ ' : ' → ';
    tip.show([e.a.name + arrow + e.b.name, e.text], x, y - 6);
  }
  function linkRow(e, n, label) {                               // one link, as a button that selects the app at the other end
    var o = other(e, n), li = K.el('li'), b = K.el('button', 'agr-l'); b.type = 'button';
    var oi = K.el('span', 'agr-lic'); oi.innerHTML = K.oi(o.id, 20); b.appendChild(oi);
    var tx = K.el('span', 'agr-lt'), dir = e.dir === 2 ? '\u2194 ' : e.a === n ? '\u2192 ' : '\u2190 ';
    var nm = K.el('b', null, label ? n.name + ' ' + dir + o.name : dir + o.name);
    tx.appendChild(nm); tx.appendChild(K.el('small', null, e.text)); b.appendChild(tx);
    b.setAttribute('aria-label', (e.dir === 2 ? 'Both ways with ' : e.a === n ? 'To ' : 'From ') + o.name + ': ' + e.text + '. Select ' + o.name);
    b.addEventListener('pointerenter', function () { hoverE = e; paint(); });
    b.addEventListener('pointerleave', function () { hoverE = null; paint(); });
    b.addEventListener('focus', function () { hoverE = e; paint(); });
    b.addEventListener('blur', function () { hoverE = null; paint(); });
    b.addEventListener('click', function () { hoverE = null; select(o); var f = K.$('.agr-l', side); if (f) f.focus({ preventScroll: true }); });
    li.appendChild(b); return li;
  }
  function openLink(n) {
    var a = K.el('a', 'btn-link agr-open'); a.href = K.root + 'odoo/apps/' + ((window.TN_APP_SLUG || {})[n.id] || n.id);
    a.appendChild(document.createTextNode('Open the ' + n.name + ' app page '));
    var ar = K.el('span'); ar.innerHTML = ARROW; a.appendChild(ar.firstChild);
    return a;
  }
  function details() {
    side.textContent = '';
    if (!sel && cat !== 'all') {                                 // a category: its apps, then every link that leaves it
      var inCat = nodes.filter(function (n) { return n.cat === cat; });
      var hh = K.el('div', 'agr-dh'), sw = K.el('i', 'agr-csw', String(inCat.length)); sw.style.setProperty('--c', CATS[cat][1]); hh.appendChild(sw);
      var t2 = K.el('div'); t2.appendChild(K.el('b', null, CATS[cat][0])); var sm = K.el('small', null, 'apps in this category'); sm.style.setProperty('--c', CATS[cat][1]); t2.appendChild(sm); hh.appendChild(t2);
      side.appendChild(hh);
      var grid = K.el('ul', 'agr-apps');
      inCat.forEach(function (n) {
        var li = K.el('li'), b = K.el('button', 'agr-ab'); b.type = 'button';
        var ic = K.el('span'); ic.innerHTML = K.oi(n.id, 18); b.appendChild(ic.firstChild);
        b.appendChild(K.el('span', null, n.name)); b.appendChild(K.el('small', null, String(n.links.length)));
        b.setAttribute('aria-label', 'Select ' + n.name + ', ' + n.links.length + ' links');
        b.addEventListener('click', function () { select(n); });
        li.appendChild(b); grid.appendChild(li);
      });
      side.appendChild(grid);
      var out = [];
      inCat.forEach(function (n) { n.links.forEach(function (e) { if (other(e, n).cat !== cat) out.push([e, n]); }); });
      side.appendChild(K.el('p', 'agr-sh', out.length + ' links to other categories'));
      var l2 = K.el('ul', 'agr-links');
      out.forEach(function (x) { l2.appendChild(linkRow(x[0], x[1], true)); });
      side.appendChild(l2);
      return;
    }
    if (!sel) {
      side.appendChild(K.el('p', 'agr-sh', 'The map'));
      side.appendChild(K.el('p', 'agr-big', N + ' apps, ' + edges.length + ' native links'));
      var top = nodes.slice().sort(function (a, b) { return b.links.length - a.links.length; }).slice(0, 4);
      side.appendChild(K.el('p', 'agr-p', 'Most connected: ' + top.map(function (n) { return n.name + ' (' + n.links.length + ')'; }).join(', ') + '.'));
      var ul = K.el('ul', 'agr-cats');
      CORDER.forEach(function (k) {
        var li = K.el('li'); var sw2 = K.el('i', 'dm-sw'); sw2.style.setProperty('--c', CATS[k][1]); li.appendChild(sw2);
        li.appendChild(K.el('span', null, CATS[k][0])); li.appendChild(K.el('b', null, String(nodes.filter(function (n) { return n.cat === k; }).length)));
        ul.appendChild(li);
      });
      side.appendChild(ul);
      side.appendChild(K.el('p', 'agr-p agr-muted', 'Select an app to see every link and the data that moves on it. Accounting, Sales and Inventory sit in the middle: most apps post into them.'));
      return;
    }
    var n = sel, head = K.el('div', 'agr-dh'), ic = K.el('span', 'agr-dic'); ic.innerHTML = K.oi(n.id, 34); head.appendChild(ic);
    var tt = K.el('div'); tt.appendChild(K.el('b', null, n.name));
    var chip = K.el('small', null, CATS[n.cat][0]); chip.style.setProperty('--c', CATS[n.cat][1]); tt.appendChild(chip); head.appendChild(tt);
    side.appendChild(head);
    side.appendChild(K.el('p', 'agr-p', n.desc));
    if (NOTE[n.id]) side.appendChild(K.el('p', 'agr-note', NOTE[n.id]));
    side.appendChild(openLink(n));
    side.appendChild(K.el('p', 'agr-sh', 'Linked to ' + n.links.length + ' apps'));
    var list = K.el('ul', 'agr-links');
    n.links.slice().sort(function (a, b) { return CORDER.indexOf(other(a, n).cat) - CORDER.indexOf(other(b, n).cat); }).forEach(function (e) { list.appendChild(linkRow(e, n)); });
    side.appendChild(list);
  }

  // ---------------------------------------------------------------- dragging
  var drag = null, moved = false, box0 = null;
  function local(ev) { var r = box0 || stage.getBoundingClientRect(); return [ev.clientX - r.left, ev.clientY - r.top]; }
  function startDrag(n, ev) {
    if (ev.button !== 0) return;
    box0 = stage.getBoundingClientRect();
    drag = { n: n, x0: ev.clientX, y0: ev.clientY, id: ev.pointerId }; moved = false;
    n.el.setPointerCapture(ev.pointerId);
  }
  function moveDrag(ev) {
    if (!drag || ev.pointerId !== drag.id) return;
    if (!moved && Math.hypot(ev.clientX - drag.x0, ev.clientY - drag.y0) < 5) return;
    if (!moved) { moved = true; tip.hide(); drag.n.el.classList.add('is-drag', 'is-pin'); }
    var p = local(ev), n = drag.n;
    n.fx = K.clamp(p[0], 20, W - 20); n.fy = K.clamp(p[1], 16, H - 20); n.x = n.fx; n.y = n.fy;
    alpha = Math.max(alpha, .22);
    if (K.reduce) { alpha = 0; render(); } else loop.on();
  }
  function endDrag(ev) {
    if (!drag || ev.pointerId !== drag.id) return;
    drag.n.el.classList.remove('is-drag');
    drag = null; box0 = null;
  }
  layer.addEventListener('pointermove', moveDrag);
  layer.addEventListener('pointerup', endDrag);
  layer.addEventListener('pointercancel', endDrag);

  // ---------------------------------------------------------------- controls
  var segs = K.$$('[data-cat]', root), CKEYS = ['all'].concat(CORDER);
  segs.forEach(function (b, i) {
    b.addEventListener('click', function () {
      cat = CKEYS[i];                                            // buttons are in the same order as the categories
      segs.forEach(function (x, j) { x.setAttribute('aria-pressed', String(j === i)); });
      if (sel && cat !== 'all' && sel.cat !== cat) { sel = null; clearDots(false); }
      paint(); details();
    });
  });
  K.$('[data-relayout]', root).addEventListener('click', function () {
    scatter(); if (K.reduce) { settle(); render(); } else loop.on();
  });

  // ---------------------------------------------------------------- run
  function settle() { for (var i = 0; i < 420 && alpha > 0; i++) tick(); alpha = 0; }
  var loop = K.loop(function (now) {
    if (alpha > 0) tick();
    if (alpha > 0 || drag) render(false);
    else if (hitStale) { hitStale = false; render(true); }
    if (now - lastAmb > 1100 && !sel && !drag) {                 // a little ambient traffic between apps
      lastAmb = now;
      var pool = cat === 'all' ? edges : edges.filter(function (e) { return e.a.cat === cat || e.b.cat === cat; });
      var e = pool[Math.floor(Math.random() * pool.length)]; dot(e, e.dir === 2 && Math.random() < .5, false, 0, now);
    }
    moveDots(now);
  });
  var started = false;
  window.addEventListener('resize', function () { measure(); if (K.reduce || !loop.running) { alpha = Math.max(alpha, .1); settle(); } else alpha = Math.max(alpha, .15); render(); });
  measure(); scatter();
  if (K.reduce) settle(); else { for (var i = 0; i < 20; i++) tick(); }
  render(); paint(); details();
  return {
    start: function (first) {
      measure();
      if (first && !started) {
        started = true;
        if (!sel) { var acc = nodes.filter(function (n) { return n.id === 'accountant'; })[0]; if (acc) select(acc); }
      }
      if (!K.reduce) loop.on(); else render();
    },
    stop: function () { loop.off(); }
  };
});
