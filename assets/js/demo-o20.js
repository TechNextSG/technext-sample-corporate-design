/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* Odoo 20: what's new (blog): a feature explorer over the article's areas (AI agents, MCP, offline
   and mobile, Field Service into Planning, accounting, payroll and the other apps, pricing), with
   cards that animate in, and an upgrade helper built from the article's "Should you upgrade to Odoo
   20 now?" advice. What you use today flags the matching cards and the checks to do first. */
TN.demo('o20', function (root, K) {
  var chipsEl = K.$('.ox-chips', root), cardsEl = K.$('.ox-cards', root), usesEl = K.$('.ox-uses', root), outEl = K.$('.ox-out', root);
  var hostBtns = K.$$('[data-host]', root);
  var TAG = { n: ['New', 'var(--tok-stock)'], c: ['Changed', 'var(--tok-make)'], m: ['Moved', 'var(--tok-buy)'], r: ['Removed', 'var(--tok-late)'], $: ['Cost', 'var(--tok-pay)'], s: ['Unchanged', '#8888A0'], t: ['Test first', 'var(--ink)'] };
  // area: label, cards [tag, title, detail, flag]; a flag ties a card to something you use today
  var AREAS = [
    ['ai', 'AI agents', [
      ['n', 'Automated and scheduled actions can call an AI agent', 'Describe a process in plain language and let the agent carry it out.'],
      ['n', 'Agents create records, even from an uploaded PDF', 'Such as a vendor bill or a purchase order.'],
      ['n', 'Agents update existing records', 'And answer questions about a file you give them.'],
      ['n', 'Images and voice', 'Agents generate images and take instructions by voice.'],
      ['c', 'Conversations kept up to 30 days', 'Odoo picks the AI model automatically, and "topics" are now "skills".'],
      ['$', 'Every AI feature uses paid IAP credits', 'Budget for usage, not just for the subscription.', 'ai']]],
    ['mcp', 'MCP connector', [
      ['n', 'A connector for the Model Context Protocol', 'The open standard AI assistants use to reach business systems.'],
      ['n', 'Link any AI system to your database', "Odoo's own description of the connector."],
      ['c', 'Access rights still apply', "The external tool works within the user's existing access rights."],
      ['n', 'Ask the live system', 'For companies already using AI assistants: ask questions of the live system instead of copying data out.']]],
    ['off', 'Offline & mobile', [
      ['n', 'Work without a connection', 'Create, edit, archive and delete records, and rerun earlier searches.'],
      ['n', 'Changes sync when you are back online', 'Pitched at warehouse floors, construction sites and field technicians.'],
      ['c', 'A better phone experience', 'A swipe-down command palette, a bottom-sheet date picker and better forms on touchscreens.'],
      ['n', 'File sharing from the phone', 'Part of the refreshed mobile interface.']]],
    ['fsm', 'Field Service → Planning', [
      ['r', 'The standalone Field Service app is discontinued', 'Its features move rather than disappear.', 'fs'],
      ['m', 'Now in Planning', 'The live map, routing preferences, travel fees, the website request form and worksheets.', 'fs'],
      ['t', 'The first thing to test', 'If your technicians use Field Service today, test it on a copy of your database before upgrading.', 'fs']]],
    ['acc', 'Accounting', [
      ['n', 'Pay bills from Odoo', 'Approve and pay vendor bills singly or in batches with one signature, where your bank supports payment initiation.'],
      ['n', 'Bill line prediction', 'Suggests how new vendor bills should be coded.'],
      ['c', 'Parent accounts replace account groups', 'And account codes become optional.', 'ag'],
      ['n', 'Invoice reminders and valuation without Inventory', 'Both are built in.'],
      ['n', 'The Accounting Assistant', 'Answers finance questions and audits reconciliations.']]],
    ['apps', 'Payroll, inventory & more', [
      ['c', 'Payroll: a dashboard built around warnings', 'Test print of pay runs, net-to-gross simulation and working schedules in hours per day.'],
      ['r', 'Payroll: work entries are removed', 'And so is the Planning-to-Payroll link.', 'we'],
      ['n', 'Inventory & Purchase: suggested stock levels', 'For reordering rules, from the last 30 days of sales, plus inventory at a past date, stock aging and a vendor quality rate.'],
      ['n', 'Manufacturing: continuous production', 'Bill of materials comparison, split manufacturing orders and new work order views.'],
      ['n', 'Spreadsheet: bubble and calendar charts', 'Named ranges, locked sheets, regex formulas and calculated columns.'],
      ['n', 'Point of Sale, CRM and Website', 'Snoozed products and combos in POS, Dun & Bradstreet lead data in CRM, an AI Website Assistant.']]],
    ['price', 'Pricing', [
      ['s', 'Prices held since 2022', 'Despite 26% cumulative inflation, Odoo said at Odoo Experience.'],
      ['s', 'One App Free stays', 'And the Standard plan is unchanged.'],
      ['$', 'The Custom plan rises by 20%', 'The one plan with a price rise.'],
      ['n', 'A new Light User access type', 'For employees who only need things like HR self-service.'],
      ['c', 'Prices differ by country and currency', 'Check odoo.com/pricing for your market, or ask TechNext for the licence estimate in your quotation.']]]
  ];
  var USES = [['fs', 'Field Service app'], ['we', 'Payroll work entries'], ['ag', 'Account groups'], ['custom', 'Custom modules'], ['studio', 'Studio changes'], ['ai', 'AI features, planned']];
  var use = { fs: false, we: false, ag: false, custom: false, studio: false, ai: false }, host = 'online';

  // ------------------------------------------------------------ chips (a tablist: arrows move between areas)
  var cur = 0, chips = AREAS.map(function (a, i) {
    var b = K.el('button', 'ox-chip'); b.type = 'button'; b.setAttribute('role', 'tab'); b.id = 'ox-t' + i; b.tabIndex = i ? -1 : 0;
    b.appendChild(K.el('span', null, a[1])); b.appendChild(K.el('small', null, String(a[2].length))); b.appendChild(K.el('i', 'ox-flag'));
    b.addEventListener('click', function () { show(i, true); });
    b.addEventListener('keydown', function (e) {
      var j = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? AREAS.length - 1 : null;
      if (j == null) return; e.preventDefault(); j = (j + AREAS.length) % AREAS.length; show(j, true); chips[j].focus();
    });
    chipsEl.appendChild(b); return b;
  });
  cardsEl.id = 'ox-p';
  function flagged(card) { return !!(card[3] && use[card[3]]); }
  function show(i, user) {
    cur = i;
    chips.forEach(function (c, j) { c.setAttribute('aria-selected', String(j === i)); c.tabIndex = j === i ? 0 : -1; c.setAttribute('aria-controls', 'ox-p'); });
    cardsEl.setAttribute('aria-labelledby', 'ox-t' + i);
    if (chipsEl.scrollWidth > chipsEl.clientWidth + 2) {      // narrow screens: bring the chip into the row's view (the page never scrolls)
      var c = chips[i]; chipsEl.scrollTo({ left: Math.max(0, c.offsetLeft - (chipsEl.clientWidth - c.offsetWidth) / 2), behavior: K.reduce ? 'auto' : 'smooth' });
    }
    cardsEl.textContent = '';
    AREAS[i][2].forEach(function (c, k) {
      var el = K.el('div', 'ox-card' + (flagged(c) ? ' is-you' : '')); el.style.setProperty('--c', TAG[c[0]][1]); el.style.setProperty('--k', k);
      var t = K.el('span', 'ox-tag', TAG[c[0]][0]); el.appendChild(t);
      el.appendChild(K.el('b', null, c[1])); el.appendChild(K.el('small', null, c[2]));
      if (c[3]) el.appendChild(K.el('em', 'ox-you', c[3] === 'ai' ? 'You plan AI: budget for credits' : 'You use this: check before upgrading'));
      cardsEl.appendChild(el);
    });
    if (user && !K.reduce) K.restart(cardsEl, 'is-in');
    else cardsEl.classList.remove('is-in');
  }
  function chipFlags() {
    AREAS.forEach(function (a, i) { chips[i].classList.toggle('has-flag', a[2].some(flagged)); });
  }

  // ------------------------------------------------------------ the upgrade helper
  var useBtns = USES.map(function (u) {
    var b = K.el('button', 'ox-use'); b.type = 'button'; b.setAttribute('aria-pressed', 'false');
    b.appendChild(K.el('i')); b.appendChild(K.el('span', null, u[1]));
    b.addEventListener('click', function () {
      use[u[0]] = !use[u[0]]; b.setAttribute('aria-pressed', String(use[u[0]]));
      // jump to the area the answer affects, so the flagged cards are in view
      var area = { fs: 3, we: 5, ag: 4, ai: 0 }[u[0]];
      if (use[u[0]] && area != null) show(area, true); else show(cur, false);
      chipFlags(); advise(true);
    });
    usesEl.appendChild(b); return b;
  });
  hostBtns.forEach(function (b) {
    b.addEventListener('click', function () { host = b.dataset.host; hostBtns.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); advise(true); });
  });
  function advise(user) {
    outEl.textContent = '';
    var route = K.el('div', 'ox-route ox-route--' + (host === 'online' ? 'svc' : 'plan'));
    route.appendChild(K.el('small', null, 'How you move'));
    route.appendChild(K.el('b', null, host === 'online' ? "Odoo's own upgrade service" : 'A planned upgrade'));
    route.appendChild(K.el('span', null, host === 'online' ? 'Odoo Online databases go through the upgrade service.' : (use.custom ? 'Odoo.sh and on-premise databases with custom modules need a planned upgrade.' : 'Odoo.sh and on-premise databases, especially with custom modules, need a planned upgrade.')));
    outEl.appendChild(route);
    var moved = [];
    if (use.fs) moved.push('Field Service (now in Planning)');
    if (use.we) moved.push('payroll work entries');
    if (use.ag) moved.push('account groups (now parent accounts)');
    var code = [];
    if (use.custom) code.push('custom modules'); if (use.studio) code.push('Studio changes');
    var CH = [
      ['Removed or moved features', moved.length ? 'Yours: ' + moved.join(', ') + '.' : 'Nothing flagged from your answers; the list is Field Service, payroll work entries and account groups.', moved.length > 0],
      ['Custom modules and Studio changes', code.length ? 'Test your ' + code.join(' and ') + '; custom code may need porting.' : 'Nothing custom to test from your answers.', code.length > 0],
      ['AI usage', use.ai ? 'Decide which AI features to switch on, and set a budget for credits.' : 'No AI plans yet: decide which features to switch on, and budget for credits, when you do.', use.ai],
      ['A dry run on a copy', 'Upgrade a duplicate database, run a normal week of transactions and a month-end close, then decide.', true]
    ];
    var ol = K.el('ol', 'ox-checks'), n = 0;
    CH.forEach(function (c, i) {
      var li = K.el('li', c[2] ? 'is-todo' : 'is-clear'); li.style.setProperty('--k', i); if (c[2]) n++;
      li.appendChild(K.el('i', null, String(i + 1)));
      var s = K.el('span'); s.appendChild(K.el('b', null, c[0])); s.appendChild(K.el('small', null, c[1])); li.appendChild(s);
      ol.appendChild(li);
    });
    var sum = K.el('p', 'ox-sum'); sum.appendChild(K.el('b', null, n + ' of 4 checks')); sum.appendChild(document.createTextNode(' to do before you decide'));
    outEl.appendChild(sum); outEl.appendChild(ol);
    outEl.appendChild(K.el('p', 'ox-foot', 'Go live on Odoo 20 only once the finance team has closed a test month on the copy.'));
    if (user && !K.reduce) K.restart(outEl, 'is-in');
  }
  show(0, false); chipFlags(); advise(false);
  var seen = false;
  return { start: function () { if (!seen && !K.reduce) { seen = true; K.restart(cardsEl, 'is-in'); } }, stop: function () {} };
});
