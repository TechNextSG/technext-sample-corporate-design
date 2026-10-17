/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* Enterprise AI page: an AI use-case matrix. Sixteen sample use cases across five departments,
   plotted by business value against effort, bubble size by items handled a month. Filter by
   department, switch to a roadmap that re-lays them into quick wins, foundations and scale with the
   dependencies between them, and open any use case to see its workflow into Odoo: trigger, data
   read, AI step, human checkpoint and write-back, plus its guardrails and what "done" means. */
TN.demo('aimap', function (root, K) {
  var plot = K.$('.umx-plot', root), grid = K.$('.umx-grid', root), deps = K.$('.umx-deps', root), lanesBox = K.$('.umx-lanes', root);
  var side = K.$('.umx-side', root), drawer = K.$('.umx-drawer', root), tpl = K.$('template.umx-ico', root);
  var tip = K.tip(plot);
  function ico(name) { var n = tpl && tpl.content.querySelector('[data-i="' + name + '"] svg'); return n ? n.cloneNode(true) : K.el('i'); }
  function fmt(v) { return Math.round(v).toLocaleString('en-SG'); }

  var DEPT = { fin: ['Finance', '#0E9384'], sal: ['Sales', '#3167CA'], svc: ['Service', '#7447D6'], ops: ['Operations', '#D97B12'], hr: ['HR', '#C2417A'] };
  var DISC = { know: ['Knowledge assistant', 'database'], odoo: ['AI inside Odoo', 'cpu'], agent: ['Workflow agent', 'zap'], chat: ['AI chatbot', 'bot'] };
  var LANES = [['Quick wins', 'One team, data already in Odoo'], ['Foundations', 'Data and knowledge the rest reuse'], ['Scale', 'Cross-system, builds on the rest']];
  // id, name, department, discipline, value, effort, items a month, unit, lane, summary, trigger, reads
  // ([o]doo module | [d]ocument | [m]ail), AI step, human checkpoint, write-back [module, text], guardrails, done
  var U = [
    { id: 'bill', sn: 'Bill capture', n: 'Vendor bill capture', d: 'fin', t: 'odoo', v: 86, e: 24, vol: 1200, u: 'bills', l: 0,
      s: 'PDF bills read, coded and matched to the purchase order before anyone types.',
      tr: 'A PDF bill arrives in the bills inbox', src: [['o', 'purchase', 'Purchase orders'], ['o', 'stock', 'Receipts'], ['d', 'PDF bill'], ['m', 'Bills inbox']],
      ai: 'Read vendor, bill number, dates, lines and GST; match the PO and the receipt', hu: 'AP clerk confirms any field under the confidence bar',
      wb: ['account', 'Draft vendor bill with the PDF attached'], g: ['Never posts or pays on its own', 'Duplicates blocked by vendor and bill number', 'Totals must equal the PDF'],
      ok: 'Bills arrive as drafts with every field filled; the clerk checks and posts.' },
    { id: 'triage', sn: 'Ticket triage', n: 'Ticket triage', d: 'svc', t: 'agent', v: 78, e: 32, vol: 2400, u: 'tickets', l: 0,
      s: 'Incoming tickets classified, prioritised and routed to the right team.',
      tr: 'A support email or web form creates a ticket', src: [['o', 'helpdesk', 'Ticket'], ['o', 'sale', 'Customer orders'], ['m', 'Customer email']],
      ai: 'Classify the type and priority; spot the product and the order', hu: 'Team lead reviews re-routed and urgent tickets',
      wb: ['helpdesk', 'Team, type, priority and tags set on the ticket'], g: ['Routes only, never closes a ticket', 'Low confidence goes to a triage queue', 'SLA policies stay as configured'],
      ok: 'Tickets land with the right team, already typed and prioritised.' },
    { id: 'dun', sn: 'Reminders', n: 'Collections reminders', d: 'fin', t: 'agent', v: 68, e: 18, vol: 450, u: 'reminders', l: 0,
      s: 'Overdue invoices get a reminder drafted in the right tone for each customer.',
      tr: 'An invoice passes its due date', src: [['o', 'account', 'Invoices and payments'], ['o', 'sale', 'Order history'], ['m', 'Past emails']],
      ai: 'Pick the tone from payment history; draft the email with the statement', hu: 'Credit controller approves reminders to key accounts',
      wb: ['account', 'Reminder logged on the invoice, next follow-up date set'], g: ['Never offers discounts or new terms', 'Skips customers with an open dispute', 'Amounts only as read from Odoo'],
      ok: 'Every overdue invoice has a reminder sent or queued, visible on the record.' },
    { id: 'pol', sn: 'Policy Q&A', n: 'Policy Q&A', d: 'hr', t: 'know', v: 56, e: 12, vol: 1500, u: 'questions', l: 0,
      s: 'Staff ask leave, expense and benefit questions and get the policy answer.',
      tr: 'An employee asks in Discuss or on the intranet', src: [['o', 'knowledge', 'HR policies'], ['o', 'hr_holidays', 'Leave balance'], ['d', 'Employee handbook']],
      ai: 'Answer from the policy, cite the section, add their own balance', hu: 'HR answers anything the policy does not cover',
      wb: ['knowledge', 'Unanswered questions logged for HR to review'], g: ['Shows only the asker’s own data', 'Cites the policy section', 'Sensitive topics go straight to HR'],
      ok: 'HR stops answering the same ten questions every week.' },
    { id: 'mtg', sn: 'Meeting notes', n: 'Meeting summaries', d: 'sal', t: 'agent', v: 50, e: 26, vol: 400, u: 'meetings', l: 0,
      s: 'Call and meeting notes summarised onto the opportunity, with the next step.',
      tr: 'A meeting ends and its notes are saved', src: [['d', 'Meeting notes'], ['o', 'crm', 'Opportunity'], ['m', 'Follow-up email']],
      ai: 'Summarise decisions, objections and next steps', hu: 'Salesperson edits the summary before it is saved',
      wb: ['crm', 'Note in the chatter and the next activity scheduled'], g: ['Recordings only with consent', 'Summary points to the notes it used', 'Saved as a draft until confirmed'],
      ok: 'Every meeting leaves a note and a next activity on the opportunity.' },
    { id: 'exp', sn: 'Receipts', n: 'Expense receipt coding', d: 'fin', t: 'odoo', v: 40, e: 16, vol: 600, u: 'receipts', l: 0,
      s: 'Receipts photographed by staff become coded expense lines.',
      tr: 'An employee snaps a receipt', src: [['d', 'Receipt photo'], ['o', 'hr_expense', 'Expense categories'], ['o', 'hr', 'Employee']],
      ai: 'Read merchant, date, amount and GST; suggest the category', hu: 'Manager approves the claim, as today',
      wb: ['hr_expense', 'Expense with category, amount and tax filled'], g: ['Flags claims over policy limits', 'Duplicate receipt check', 'Approval flow unchanged'],
      ok: 'Staff attach a photo; the claim fills itself and waits for approval.' },
    { id: 'eta', sn: 'Supplier dates', n: 'Supplier date updates', d: 'ops', t: 'agent', v: 60, e: 34, vol: 700, u: 'emails', l: 0,
      s: 'Supplier emails about delays update the expected dates on purchase orders.',
      tr: 'A supplier replies to a purchase order email', src: [['m', 'Supplier reply'], ['o', 'purchase', 'Purchase order'], ['o', 'stock', 'Incoming receipt']],
      ai: 'Read the new date and quantities; compare them with the order', hu: 'Buyer confirms any change of more than two days',
      wb: ['purchase', 'Expected arrival updated, email linked in the chatter'], g: ['Never changes prices or quantities', 'Every change links to its email', 'Late orders alert the salesperson'],
      ok: 'Expected dates in Odoo match what suppliers last said.' },
    { id: 'onb', sn: 'Onboarding', n: 'Onboarding plans', d: 'hr', t: 'agent', v: 28, e: 10, vol: 40, u: 'new hires', l: 0,
      s: 'A role-specific onboarding plan drafted when a new hire is added.',
      tr: 'A new employee record is created', src: [['o', 'hr', 'Employee and role'], ['o', 'sign', 'Signed contract'], ['d', 'Onboarding templates']],
      ai: 'Draft accounts, equipment, training and first-week tasks', hu: 'Manager adjusts and launches the plan',
      wb: ['hr', 'Onboarding activities scheduled for each owner'], g: ['Approved templates only', 'No access changes without IT', 'The manager launches it'],
      ok: 'New hires have accounts, equipment and a plan on day one.' },
    { id: 'kb', sn: 'Knowledge', n: 'Knowledge answers', d: 'svc', t: 'know', v: 84, e: 50, vol: 3000, u: 'questions', l: 1,
      s: 'Agents get a drafted answer from manuals and solved tickets, with sources.',
      tr: 'An agent opens a ticket', src: [['o', 'knowledge', 'Articles'], ['d', 'Manuals and SOPs'], ['o', 'helpdesk', 'Solved tickets']],
      ai: 'Retrieve the relevant passages; draft an answer that cites them', hu: 'Agent edits and sends the reply',
      wb: ['helpdesk', 'Draft reply on the ticket with source links'], g: ['Approved sources only', 'Says “not found” instead of guessing', 'Respects document access rights'],
      ok: 'Agents start from a sourced draft instead of a blank reply.' },
    { id: 'quote', sn: 'Quotes', n: 'Quote drafting', d: 'sal', t: 'agent', v: 72, e: 42, vol: 300, u: 'quotes', l: 1,
      s: 'Customer RFQs turned into draft quotations with the right products.',
      tr: 'A customer emails a request for quotation', src: [['m', 'RFQ email'], ['o', 'sale', 'Products and pricelists'], ['o', 'crm', 'Customer history']],
      ai: 'Match the requested items to products and build the lines', hu: 'Salesperson checks the lines and sends it',
      wb: ['sale', 'Draft quotation, prices from the pricelist'], g: ['Prices only from Odoo pricelists', 'Unmatched items flagged, never guessed', 'Nothing sent without a person'],
      ok: 'A draft quotation is waiting minutes after the email lands.' },
    { id: 'lead', sn: 'Lead scoring', n: 'Lead scoring', d: 'sal', t: 'odoo', v: 66, e: 56, vol: 900, u: 'leads', l: 1,
      s: 'New leads ranked by fit and intent, with the reason written on the lead.',
      tr: 'A lead arrives from the web form, email or WhatsApp', src: [['o', 'crm', 'Won and lost history'], ['o', 'website', 'Pages visited'], ['m', 'Enquiry email']],
      ai: 'Score fit and intent; write a two-line reason', hu: 'Sales lead reviews the top of the queue each morning',
      wb: ['crm', 'Priority, tags and a reason note on the lead'], g: ['No scoring on personal traits', 'A reason shown with every score', 'Salespeople can override'],
      ok: 'Salespeople start the day on the likeliest leads, and know why.' },
    { id: 'cv', sn: 'CV screening', n: 'CV screening', d: 'hr', t: 'agent', v: 46, e: 46, vol: 800, u: 'CVs', l: 1,
      s: 'Applications summarised against the job’s must-have criteria.',
      tr: 'An application arrives for a job position', src: [['o', 'hr_recruitment', 'Job and criteria'], ['d', 'CV'], ['m', 'Cover email']],
      ai: 'Summarise experience against each criterion, with evidence', hu: 'Recruiter makes every shortlist and rejection',
      wb: ['hr_recruitment', 'Summary note and criteria tags on the applicant'], g: ['No automatic rejections', 'Ignores age, gender, photo, nationality', 'Criteria set by the hiring manager'],
      ok: 'Recruiters read a one-screen summary per applicant, then decide.' },
    { id: 'stock', sn: 'Stock alerts', n: 'Stock anomaly alerts', d: 'ops', t: 'agent', v: 52, e: 64, vol: 8000, u: 'stock moves', l: 1,
      s: 'Unusual adjustments, negative stock and odd moves flagged every morning.',
      tr: 'A nightly scan of the day’s stock moves', src: [['o', 'stock', 'Moves and adjustments'], ['o', 'purchase', 'Receipts'], ['o', 'mrp', 'Component use']],
      ai: 'Spot moves outside the usual pattern for each product and location', hu: 'Warehouse manager checks each alert',
      wb: ['stock', 'Activity on the product, with the moves listed'], g: ['Read-only on stock', 'Explains why each move looks unusual', 'Thresholds agreed per warehouse'],
      ok: 'Shrinkage and mis-picks surface the next morning, not at stock-take.' },
    { id: 'wa', sn: 'WhatsApp status', n: 'WhatsApp order status', d: 'svc', t: 'chat', v: 80, e: 70, vol: 5000, u: 'chats', l: 2,
      s: 'Customers ask where their order is on WhatsApp and get the live status.',
      tr: 'A customer messages the business number', src: [['o', 'whatsapp', 'Conversation'], ['o', 'sale', 'Sales order'], ['o', 'stock', 'Delivery order']],
      ai: 'Understand the question, find the order, answer from its delivery', hu: 'Hand-off to an agent on request or when unsure',
      wb: ['helpdesk', 'Chat logged on the contact; hand-offs open a ticket'], g: ['Checks the customer before sharing details', 'Answers only from the order record', 'A person on request, any time'],
      ok: 'Order-status chats are answered at any hour, with a person one tap away.' },
    { id: 'fc', sn: 'Forecast', n: 'Demand forecast', d: 'ops', t: 'agent', v: 90, e: 86, vol: 2000, u: 'products', l: 2,
      s: 'A weekly forecast per product that proposes reordering-rule changes.',
      tr: 'Every Monday night', src: [['o', 'sale', 'Sales history'], ['o', 'stock', 'Stock and lead times'], ['d', 'Promotions calendar']],
      ai: 'Forecast demand per product and warehouse; propose min and max', hu: 'Buyer approves each change to a reordering rule',
      wb: ['stock', 'New min and max on reordering rules, after approval'], g: ['Changes capped per week', 'The drivers behind each change shown', 'No purchase orders raised by AI'],
      ok: 'Buyers review a short list of proposed changes, not a spreadsheet.' },
    { id: 'close', sn: 'Variance notes', n: 'Month-end variance notes', d: 'fin', t: 'know', v: 36, e: 76, vol: 12, u: 'report packs', l: 2,
      s: 'Draft commentary on why each P&L line moved against last month and budget.',
      tr: 'The month-end close is marked done', src: [['o', 'accountant', 'General ledger'], ['o', 'spreadsheet_dashboard', 'Budget'], ['d', 'Last month’s notes']],
      ai: 'Compare periods, find the entries behind each big variance, draft notes', hu: 'Financial controller edits and signs off',
      wb: ['documents', 'Commentary filed with the month’s report pack'], g: ['Every figure links to its journal entries', 'Explains what moved, no advice', 'Read-only access to the ledger'],
      ok: 'The controller edits a draft instead of writing from scratch.' }
  ];
  var DEPS = [['mtg', 'lead'], ['pol', 'kb'], ['triage', 'wa'], ['kb', 'wa'], ['stock', 'fc'], ['eta', 'fc'], ['bill', 'close']];
  var byId = {}; U.forEach(function (u) { byId[u.id] = u; });

  // ---------------------------------------------------------------- bubbles (DOM order: value, high to low)
  U.slice().sort(function (a, b) { return b.v - a.v; }).forEach(function (u, k) {
    var b = K.el('button', 'umx-b'); b.type = 'button';
    b.style.setProperty('--c', DEPT[u.d][1]); b.style.setProperty('--i', k);
    b.setAttribute('aria-controls', 'umx-drawer'); b.setAttribute('aria-expanded', 'false');
    u.after = DEPS.filter(function (d) { return d[1] === u.id; }).map(function (d) { return byId[d[0]].n; });
    b.setAttribute('aria-label', u.n + ', ' + DEPT[u.d][0] + ', ' + DISC[u.t][0] + '. Value ' + u.v + ', effort ' + u.e + ', about ' + fmt(u.vol) + ' ' + u.u + ' a month (sample). Roadmap: ' + LANES[u.l][0] + (u.after.length ? ', builds on ' + u.after.join(' and ') : '') + '.');
    u.ring = b.appendChild(K.el('i', 'umx-ring')); u.dot = b.appendChild(K.el('i', 'umx-dot'));
    u.ic = b.appendChild(ico(DISC[u.t][1])); u.lab = b.appendChild(K.el('span', 'umx-lab')); u.lab.appendChild(document.createTextNode(u.n));
    if (u.after.length) u.lab.appendChild(K.el('small', 'umx-sub', 'Builds on ' + u.after.join(' + ')));
    u.el = b; plot.appendChild(b);
  });
  var lanes = LANES.map(function (l, i) {
    var n = K.el('div', 'umx-lane'); n.appendChild(K.el('b', null, (i + 1) + ' · ' + l[0])); n.appendChild(K.el('small', null, l[1]));
    lanesBox.appendChild(n); return n;
  });
  var qs = K.$$('.umx-q', plot), ticks = {}; K.$$('.umx-tick', plot).forEach(function (t) { ticks[t.dataset.t] = t; });
  var axX = K.$('.umx-ax--x', plot), axY = K.$('.umx-ax--y', plot);

  // ---------------------------------------------------------------- layout
  var W = 1, H = 1, R0 = 9, R1 = 28, narrow = false, mode = 'matrix', dept = 'all', pos = {}, M;
  function shown(u) { return dept === 'all' || u.d === dept; }
  function rad(u, max) { var k = K.clamp((Math.log(u.vol) / Math.LN10 - 1) / 3, 0, 1); return Math.min(K.lerp(R0, R1, k), max || 99); }
  function matrixPos() {
    plot.style.height = ''; H = plot.clientHeight;
    var iw = W - M.l - M.r, ih = H - M.t - M.b, out = {};
    U.forEach(function (u) { out[u.id] = { x: M.l + u.e / 100 * iw, y: M.t + (1 - u.v / 100) * ih, r: rad(u) }; });
    return out;
  }
  function roadPos() {
    plot.style.height = ''; var h0 = plot.clientHeight, out = { lanes: [] }, cols = W >= 600, gap = 10, head = 56;
    var lists = [0, 1, 2].map(function (l) { return U.filter(function (u) { return u.l === l; }).sort(function (a, b) { return b.v - a.v; }); });
    if (cols) {
      var lw = (W - gap * 2) / 3, maxY = 0;
      lists.forEach(function (list, l) {
        var x0 = l * (lw + gap), y = head;
        list.forEach(function (u) { var hr = u.after.length ? 54 : 42; out[u.id] = { x: x0 + 28, y: y + hr / 2, r: rad(u, 15), lw: lw - 62 }; y += hr; });
        out.lanes.push({ x: x0, y: 0, w: lw }); maxY = Math.max(maxY, y);
      });
      H = Math.max(h0, maxY + 8); out.lanes.forEach(function (l) { l.h = H; });
    } else {
      var y = 0, c = W >= 460 ? 3 : 2, cw = (W - 12) / c, rh = 60;
      lists.forEach(function (list) {
        var lh = 46 + Math.ceil(list.length / c) * rh;
        list.forEach(function (u, k) { out[u.id] = { x: 6 + cw * (k % c) + 18, y: y + 46 + rh / 2 + rh * Math.floor(k / c) - 6, r: rad(u, 13), lw: cw - 46 }; });
        out.lanes.push({ x: 0, y: y, w: W, h: lh }); y += lh + gap;
      });
      H = Math.max(h0, y - gap);
    }
    out.cols = cols; plot.style.height = H + 'px';
    return out;
  }
  function drawGrid() {
    grid.setAttribute('viewBox', '0 0 ' + W + ' ' + H); grid.textContent = '';
    var x0 = M.l, x1 = W - M.r, y0 = M.t, y1 = H - M.b, xm = (x0 + x1) / 2, ym = (y0 + y1) / 2, r = 12;
    grid.appendChild(K.svg('path', { d: 'M' + x0 + ' ' + ym + 'V' + (y0 + r) + 'Q' + x0 + ' ' + y0 + ' ' + (x0 + r) + ' ' + y0 + 'H' + xm + 'V' + ym + 'Z', 'class': 'umx-win' }));
    grid.appendChild(K.svg('rect', { x: x0, y: y0, width: x1 - x0, height: y1 - y0, rx: r, 'class': 'umx-frame' }));
    grid.appendChild(K.svg('path', { d: 'M' + xm + ' ' + y0 + 'V' + y1 + 'M' + x0 + ' ' + ym + 'H' + x1, 'class': 'umx-mid' }));
    var tk = '';
    for (var i = 1; i < 4; i++) { if (i === 2) continue; var tx = x0 + (x1 - x0) * i / 4, ty = y0 + (y1 - y0) * i / 4; tk += 'M' + tx + ' ' + y1 + 'v4M' + x0 + ' ' + ty + 'h-4'; }
    grid.appendChild(K.svg('path', { d: tk, 'class': 'umx-tk' }));
    var place = function (n, x, y) { n.style.left = x.toFixed(1) + 'px'; n.style.top = y.toFixed(1) + 'px'; };
    place(qs[0], x0 + 10, y0 + 8); place(qs[2], x0 + 10, y1 - 22);
    qs[1].style.left = qs[3].style.left = ''; qs[1].style.right = qs[3].style.right = (W - x1 + 10) + 'px';
    qs[1].style.top = (y0 + 8) + 'px'; qs[3].style.top = (y1 - 22) + 'px';
    place(axX, xm, y1 + 12); place(axY, x0 - 14, ym);
    place(ticks.x0, x0, y1 + 12); place(ticks.x1, x1, y1 + 12); place(ticks.y0, x0 - 14, y1 - 14); place(ticks.y1, x0 - 14, y0 + 16);
  }
  // labels: try eight spots around each bubble; test against the other labels and the true circles
  function hitsCircle(bx, c) { var nx = K.clamp(c[0], bx[0], bx[2]), ny = K.clamp(c[1], bx[1], bx[3]); return Math.hypot(nx - c[0], ny - c[1]) < c[2]; }
  function placeLabels() {
    var boxes = [], circ = [];
    qs.forEach(function (q) { var b = K.box(q, plot); boxes.push([b.x - 2, b.y - 2, b.r + 2, b.b + 2]); });
    U.forEach(function (u) { u.lab.className = 'umx-lab'; u.lab.style.cssText = ''; u.lab.firstChild.nodeValue = narrow ? u.sn : u.n; });
    U.forEach(function (u) { u.lw = u.lab.offsetWidth; });
    var vis = U.filter(shown);
    vis.forEach(function (u) { var p = pos[u.id]; circ.push([p.x, p.y, p.r + 1]); });
    vis.slice().sort(function (a, b) { return b.v - a.v; }).forEach(function (u) {
      var p = pos[u.id], w = u.lw, h = 16, g = 5, ok = null;
      var d = p.r * .7 + g - 2, c = [[p.r + g, -h / 2], [-p.r - g - w, -h / 2], [-w / 2, -p.r - g - h + 1], [-w / 2, p.r + g - 1],
        [d, -d - h + 2], [d, d - 2], [-d - w, -d - h + 2], [-d - w, d - 2]];
      for (var i = 0; i < c.length && !ok; i++) {
        var bx = [p.x + c[i][0], p.y + c[i][1], p.x + c[i][0] + w, p.y + c[i][1] + h];
        if (bx[0] < M.l + 3 || bx[2] > W - 2 || bx[1] < 2 || bx[3] > H - M.b + 4) continue;
        if (boxes.some(function (o) { return bx[0] < o[2] && bx[2] > o[0] && bx[1] < o[3] && bx[3] > o[1]; })) continue;
        if (circ.some(function (o) { return hitsCircle(bx, o); })) continue;
        ok = c[i]; boxes.push(bx);
      }
      if (ok) { u.lab.style.left = ok[0].toFixed(1) + 'px'; u.lab.style.top = ok[1].toFixed(1) + 'px'; }
      else { u.lab.classList.add('is-hide'); u.lab.style.left = (p.r + g) + 'px'; u.lab.style.top = (-h / 2) + 'px'; }
    });
    U.filter(function (u) { return !shown(u); }).forEach(function (u) { u.lab.classList.add('is-hide'); });
  }
  function layout() {
    W = plot.clientWidth; narrow = W < 560;
    R0 = narrow ? 7 : 9; R1 = narrow ? 19 : 28;
    M = narrow ? { l: 30, r: 8, t: 10, b: 34 } : { l: 44, r: 14, t: 14, b: 40 };
    pos = mode === 'road' ? roadPos() : matrixPos();
    plot.classList.toggle('is-road', mode === 'road'); plot.classList.toggle('is-narrow', narrow);
    if (mode === 'matrix') drawGrid();
    U.forEach(function (u) {
      var p = pos[u.id], rr = p.r + 5;
      u.el.style.transform = 'translate(' + p.x.toFixed(1) + 'px,' + p.y.toFixed(1) + 'px)';
      u.dot.style.transform = 'scale(' + (p.r / 24).toFixed(3) + ')';
      u.ring.style.cssText = 'width:' + (rr * 2) + 'px;height:' + (rr * 2) + 'px;left:' + (-rr) + 'px;top:' + (-rr) + 'px';
      u.el.classList.toggle('no-ic', p.r < 11);
      var on = shown(u); u.el.classList.toggle('is-off', !on); u.el.tabIndex = on ? 0 : -1;
      if (on) u.el.removeAttribute('aria-hidden'); else u.el.setAttribute('aria-hidden', 'true');
    });
    if (mode === 'matrix') placeLabels();
    else {
      U.forEach(function (u) {
        u.lab.className = 'umx-lab is-wrap' + (shown(u) ? '' : ' is-hide'); u.lab.firstChild.nodeValue = u.n;
        u.lab.style.cssText = 'left:' + (narrow ? 20 : 24) + 'px;top:0;max-width:' + pos[u.id].lw.toFixed(0) + 'px';
      });
      U.forEach(function (u) { u.lw = u.lab.offsetWidth; });
    }
    if (pos.lanes) pos.lanes.forEach(function (l, i) { lanes[i].style.cssText = 'left:' + l.x + 'px;top:' + l.y + 'px;width:' + l.w + 'px;height:' + l.h + 'px'; });
    K.$$('.umx-sizes span', side).forEach(function (s) { var r = rad({ vol: +s.dataset.v }); var i = s.firstChild; i.style.width = i.style.height = (r * 2).toFixed(0) + 'px'; });
    drawDeps();
    kpis();
  }

  // ---------------------------------------------------------------- dependencies ("builds on")
  var depT = 0;
  function depPath(a, b) {
    var p = pos[a.id], q = pos[b.id];
    if (mode === 'road' && pos.cols) return K.curve([p.x + 24 + a.lw + 6, p.y], [q.x - q.r - 6, q.y], .5);
    var dx = q.x - p.x, dy = q.y - p.y, d = Math.hypot(dx, dy) || 1, ux = dx / d, uy = dy / d;
    var s = [p.x + ux * (p.r + 3), p.y + uy * (p.r + 3)], e = [q.x - ux * (q.r + 5), q.y - uy * (q.r + 5)];
    var mx = (s[0] + e[0]) / 2 - uy * d * .18, my2 = (s[1] + e[1]) / 2 + ux * d * .18;
    return 'M' + s[0].toFixed(1) + ' ' + s[1].toFixed(1) + 'Q' + mx.toFixed(1) + ' ' + my2.toFixed(1) + ' ' + e[0].toFixed(1) + ' ' + e[1].toFixed(1);
  }
  function drawDeps() {
    clearTimeout(depT);
    K.$$('path', deps).forEach(function (p) { if (!p.closest('marker')) p.remove(); });
    deps.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    var focus = mode === 'road' && !pos.cols ? null : hot || openId;           // phone roadmap: the "builds on" lines say it
    var list = DEPS.filter(function (d) { return focus && (d[0] === focus || d[1] === focus); });
    if (!list.length) return;
    var go = function () {
      list.forEach(function (d) {
        var a = byId[d[0]], b = byId[d[1]], dim = !(shown(a) && shown(b));
        var p = K.svg('path', { d: depPath(a, b), 'class': 'umx-dep' + (dim ? ' is-dim' : ''), 'marker-end': 'url(#umx-arrow)' });
        deps.appendChild(p);
        if (!K.reduce) { var len = p.getTotalLength(); p.style.strokeDasharray = len + ' ' + len; p.style.strokeDashoffset = len; requestAnimationFrame(function () { requestAnimationFrame(function () { p.style.strokeDashoffset = 0; }); }); }
      });
    };
    if (mode === 'road' && !hot && !K.reduce) depT = setTimeout(go, 650); else go();
  }

  // ---------------------------------------------------------------- KPIs
  var kN = K.$('[data-k="n"]', side), kVol = K.$('[data-k="vol"]', side), kQw = K.$('[data-k="qw"]', side), kHu = K.$('[data-k="hu"]', side);
  function kpis() {
    var list = U.filter(shown);
    K.count(kN, list.length, 400); K.count(kVol, list.reduce(function (s, u) { return s + u.vol; }, 0), 700);
    K.count(kQw, list.filter(function (u) { return u.l === 0; }).length, 400);
    kHu.textContent = list.length + ' of ' + list.length;
    [0, 1, 2].forEach(function (l) { var n = list.filter(function (u) { return u.l === l; }).length; mix[l].style.flexGrow = String(n); mix[l].hidden = !n; K.$('b', mix[l]).textContent = String(n); });
  }
  var mix = K.$$('.umx-mix > span', side);

  // ---------------------------------------------------------------- hover, focus, tooltip
  var hot = null;
  function peek(u) {
    hot = u.id; plot.classList.add('is-peek'); u.el.classList.add('is-hot');
    DEPS.forEach(function (d) { if (d[0] === u.id) byId[d[1]].el.classList.add('is-rel'); if (d[1] === u.id) byId[d[0]].el.classList.add('is-rel'); });
    var p = pos[u.id];
    tip.show([u.n, DEPT[u.d][0] + ' · ' + DISC[u.t][0], 'Value ' + u.v + ' · effort ' + u.e + ' · ~' + fmt(u.vol) + ' ' + u.u + ' a month'], p.x, p.y - p.r - 4);
    drawDeps();
  }
  function unpeek() {
    hot = null; tip.hide(); plot.classList.remove('is-peek');
    U.forEach(function (u) { u.el.classList.remove('is-hot', 'is-rel'); });
    drawDeps();
  }
  U.forEach(function (u) {
    u.el.addEventListener('pointerenter', function (e) { if (e.pointerType !== 'touch') peek(u); });
    u.el.addEventListener('pointerleave', unpeek);
    u.el.addEventListener('focus', function () { peek(u); });
    u.el.addEventListener('blur', unpeek);
    u.el.addEventListener('click', function () { touched = true; if (openId === u.id) closeCase(true); else openCase(u, true); });
  });

  // ---------------------------------------------------------------- the drawer: the use case as a workflow
  var openId = null, pipe = null, stages = [], tok = null, TL = [], TT = 0, t0 = 0, lastKey = '';
  var ST = [['tr', 'zap', 'Trigger'], ['src', 'database', 'Reads'], ['ai', 'sparkle', 'AI step'], ['hu', 'usercheck', 'Human checkpoint'], ['wb', null, 'Write-back into Odoo']];
  function chip(s) {
    var c = K.el('span', 'umx-chip');
    if (s[0] === 'o') { c.innerHTML = K.oi(s[1], 14); c.appendChild(document.createTextNode(s[2])); }
    else { c.appendChild(ico(s[0] === 'm' ? 'mail' : 'file')); c.appendChild(document.createTextNode(s[1])); }
    return c;
  }
  function openCase(u, byUser) {
    openId = u.id; drawer.textContent = '';
    U.forEach(function (x) { x.el.setAttribute('aria-expanded', String(x === u)); x.el.classList.toggle('is-sel', x === u); });
    drawer.style.setProperty('--c', DEPT[u.d][1]); drawer.setAttribute('aria-label', 'Workflow: ' + u.n);
    var head = K.el('div', 'umx-dh'), tag = K.el('p', 'umx-dtag'), sw = K.el('i', 'dm-sw');
    sw.style.setProperty('--c', DEPT[u.d][1]); tag.appendChild(sw); tag.appendChild(ico(DISC[u.t][1]));
    tag.appendChild(document.createTextNode(DEPT[u.d][0] + ' · ' + DISC[u.t][0]));
    head.appendChild(tag);
    var x = K.el('button', 'umx-x'); x.type = 'button'; x.setAttribute('aria-label', 'Close the workflow'); x.appendChild(ico('x'));
    x.addEventListener('click', function () { closeCase(true); }); head.appendChild(x);
    drawer.appendChild(head);
    drawer.appendChild(K.el('h3', 'umx-dt', u.n));
    drawer.appendChild(K.el('p', 'umx-ds', u.s));
    var st = K.el('p', 'umx-dstat');
    [['Value', u.v], ['Effort', u.e], ['Volume', '~' + fmt(u.vol) + ' ' + u.u + '/mo'], ['Lane', LANES[u.l][0]]].forEach(function (q) {
      var s = K.el('span'); s.appendChild(K.el('small', null, q[0])); s.appendChild(K.el('b', null, String(q[1]))); st.appendChild(s);
    });
    drawer.appendChild(st);
    pipe = K.el('ol', 'umx-pipe'); pipe.setAttribute('aria-label', 'How it runs');
    stages = ST.map(function (s, n) {
      var li = K.el('li', 'umx-st'); li.dataset.k = s[0]; li.style.setProperty('--n', n);
      var pi = K.el('span', 'umx-pi');
      if (s[1]) pi.appendChild(ico(s[1])); else pi.innerHTML = K.oi(u.wb[0], 18);
      li.appendChild(pi);
      var tx = K.el('div', 'umx-stx'), lb = tx.appendChild(K.el('b', null, s[2]));
      if (s[0] === 'src') { var cs = K.el('span', 'umx-chips'); u.src.forEach(function (q, i) { var c = chip(q); c.style.setProperty('--k', i); cs.appendChild(c); }); tx.appendChild(cs); }
      else tx.appendChild(K.el('span', null, s[0] === 'wb' ? u.wb[1] : u[s[0]]));
      if (s[0] === 'hu') { var w = K.el('em', 'umx-wait'); w.appendChild(ico('clock')); w.appendChild(document.createTextNode('Waiting for a person')); lb.appendChild(w);
        var ok = K.el('em', 'umx-okk'); ok.appendChild(ico('check')); ok.appendChild(document.createTextNode('Approved')); lb.appendChild(ok); }
      li.appendChild(tx); pipe.appendChild(li); return li;
    });
    tok = K.el('i', 'umx-tok'); pipe.appendChild(tok);
    drawer.appendChild(pipe);
    var foot = K.el('div', 'umx-dfoot'), g = K.el('div', 'umx-guard'), gh = K.el('p', 'umx-h'); gh.appendChild(ico('shield')); gh.appendChild(document.createTextNode('Guardrails'));
    g.appendChild(gh); var ul = K.el('ul'); u.g.forEach(function (t) { ul.appendChild(K.el('li', null, t)); }); g.appendChild(ul); foot.appendChild(g);
    var dn = K.el('div', 'umx-done'), dh = K.el('p', 'umx-h'); dh.appendChild(ico('check')); dh.appendChild(document.createTextNode('Done looks like'));
    dn.appendChild(dh); dn.appendChild(K.el('p', null, u.ok)); foot.appendChild(dn);
    drawer.appendChild(foot);
    side.classList.add('is-open'); K.restart(drawer, 'is-in'); drawDeps();
    drawer.scrollTop = 0;
    pipeStart();
    if (byUser) {
      x.focus({ preventScroll: true });
      if (side.offsetTop > plot.offsetTop + 60 && drawer.scrollIntoView) drawer.scrollIntoView({ block: 'nearest', behavior: K.reduce ? 'auto' : 'smooth' });
    }
  }
  function closeCase(byUser) {
    var u = byId[openId]; openId = null; pipeLoop.off();
    side.classList.remove('is-open'); drawDeps();
    U.forEach(function (x) { x.el.setAttribute('aria-expanded', 'false'); x.el.classList.remove('is-sel'); });
    if (byUser && u) u.el.focus({ preventScroll: true });
  }
  // the token walks the pipeline: travel, dwell; the human checkpoint waits, then approves
  var MOVE = 430, DW = [420, 700, 520, 1500, 900], END = 1400;
  function pipeStart() {
    if (!pipe) return;
    var ys = stages.map(function (li) { return K.box(K.$('.umx-pi', li), pipe).cy; });
    TL = []; var t = 0;
    ys.forEach(function (y, i) { TL.push([t, t + MOVE, 'm', i]); t += MOVE; TL.push([t, t + DW[i], 'd', i]); t += DW[i]; });
    TL.push([t, t + END, 'e', 4]); TT = t + END; TL.ys = ys; lastKey = '';
    if (K.reduce) { stages.forEach(function (li) { li.classList.add('is-on'); }); stages[3].classList.add('is-ok'); tok.style.display = 'none'; return; }
    t0 = performance.now(); pipeLoop.on();
  }
  var pipeLoop = K.loop(function (now) {
    if (!TL.ys) return;
    var t = (now - t0) % TT, seg = TL[0];
    for (var i = 0; i < TL.length; i++) if (t < TL[i][1]) { seg = TL[i]; break; }
    var ys = TL.ys, k = seg[3], q = (t - seg[0]) / (seg[1] - seg[0]), y;
    var op = 0;
    if (seg[2] === 'm') { y = K.lerp(k ? ys[k - 1] + 15 : ys[0] - 32, ys[k] - 15, K.ease.inOut(q)); op = K.clamp(Math.min(q, 1 - q) * 6, 0, 1); } else y = ys[k];
    tok.style.transform = 'translate(0,' + y.toFixed(1) + 'px)';
    tok.style.opacity = op.toFixed(2);
    var reached = seg[2] === 'm' ? k - 1 : k, okk = k > 3 || (k === 3 && seg[2] === 'd' && q > .55);
    var key = reached + '|' + seg[2] + '|' + okk + '|' + (seg[2] === 'e');
    if (key === lastKey) return; lastKey = key;
    stages.forEach(function (li, j) {
      li.classList.toggle('is-on', j <= reached && seg[2] !== 'e' || seg[2] === 'e');
      li.classList.toggle('is-now', j === k && seg[2] === 'd');
    });
    stages[3].classList.toggle('is-wait', k === 3 && seg[2] === 'd' && !okk);
    stages[3].classList.toggle('is-ok', okk && (reached >= 3));
  });

  // ---------------------------------------------------------------- controls
  var touched = false;
  K.$$('[data-dept]', root).forEach(function (b) {
    b.addEventListener('click', function () {
      touched = true; dept = b.dataset.dept;
      K.$$('[data-dept]', root).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      if (openId && !shown(byId[openId])) closeCase(false);
      layout();
    });
  });
  K.$$('[data-view]', root).forEach(function (b) {
    b.addEventListener('click', function () {
      touched = true; if (mode === b.dataset.view) return; mode = b.dataset.view;
      K.$$('[data-view]', root).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      unpeek(); layout();
    });
  });
  root.addEventListener('keydown', function (e) { if (e.key === 'Escape' && openId) { e.preventDefault(); closeCase(true); } });
  var rt = 0;
  window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { layout(); if (openId) pipeStart(); }, 140); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { layout(); });

  if (!K.reduce) plot.classList.add('umx-pre');
  layout();
  var autoT = 0;
  return {
    start: function (first) {
      layout();
      if (first) {
        if (!K.reduce) requestAnimationFrame(function () { plot.classList.add('umx-enter'); plot.classList.remove('umx-pre'); setTimeout(function () { plot.classList.remove('umx-enter'); }, 1600); });
        autoT = setTimeout(function () { if (!touched && !openId) openCase(byId.bill, false); }, K.reduce ? 0 : 1250);
      } else if (openId) pipeStart();
    },
    stop: function () { clearTimeout(autoT); pipeLoop.off(); }
  };
});
