/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* Home "Every Odoo app, one database" — a system you build.
   Every app sits on the rings; press one to plug it into (or out of) the one database. Spokes
   carry a pulse from the core, lines join apps that already work together, the core lights the
   shared records an app uses, and the readout counts the connections Odoo gives you with no
   integration project. The picks hand over to the quotation builder. */
(function () {
  'use strict';
  var field = document.querySelector('[data-suite]');
  if (!field) return;
  var sec = field.closest('section') || document.body;
  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var has = function (o, k) { return Object.prototype.hasOwnProperty.call(o, k); };

  // [shared records it uses (c customers, p products, a accounts), name, what it does with them]
  var APPS = {
    accountant: ['ca', 'Accounting', 'Invoices, bills and payments from every other app post here on their own.'],
    sale: ['cpa', 'Sales', 'A confirmed order reserves the stock and becomes the invoice.'],
    stock: ['pa', 'Inventory', 'Every sale, purchase and delivery moves the same stock records.'],
    crm: ['c', 'CRM', 'A won deal becomes a quotation in Sales, with nothing re-typed.'],
    purchase: ['pa', 'Purchase', 'Receipts update Inventory, and vendor bills post to Accounting.'],
    point_of_sale: ['cpa', 'Point of Sale', 'Every till sale moves stock and posts the takings.'],
    website_sale: ['cpa', 'eCommerce', 'Online orders reserve real stock and land in Sales.'],
    mrp: ['pa', 'Manufacturing', 'Work orders use components from Inventory and carry their real cost.'],
    project: ['ca', 'Project', 'Tasks and billable time turn into invoices.'],
    account: ['ca', 'Invoicing', 'Invoices go out and payments come in, straight into the books.'],
    ai_app: ['cpa', 'AI', 'Assistants and agents work on the same records as your team.'],
    hr: ['', 'Employees', 'One employee record for planning, time off and expenses.'],
    helpdesk: ['c', 'Helpdesk', 'Tickets sit on the same customer record that Sales and CRM use.'],
    mass_mailing: ['c', 'Email Marketing', 'Campaigns go to the contacts already in your CRM.'],
    documents: ['a', 'Documents', 'Scanned bills and files attach to the records they belong to.'],
    sign: ['c', 'Sign', 'Contracts and documents get signed without leaving Odoo.'],
    planning: ['', 'Planning', 'Shifts are planned on the same employees and projects.'],
    website: ['c', 'Website', 'Website forms create leads straight in CRM.']
  };
  var KEYS = Object.keys(APPS);
  // apps that already work together in standard Odoo (drawn when both are plugged in)
  var LINKS = [['crm', 'sale'], ['sale', 'stock'], ['sale', 'accountant'], ['sale', 'account'], ['stock', 'purchase'],
    ['purchase', 'accountant'], ['stock', 'mrp'], ['mrp', 'accountant'], ['point_of_sale', 'stock'], ['point_of_sale', 'accountant'],
    ['website_sale', 'stock'], ['website_sale', 'sale'], ['project', 'sale'], ['project', 'accountant'], ['account', 'accountant'],
    ['helpdesk', 'crm'], ['mass_mailing', 'crm'], ['sign', 'sale'], ['sign', 'hr'], ['planning', 'hr'], ['planning', 'project'],
    ['documents', 'accountant'], ['ai_app', 'crm'], ['ai_app', 'helpdesk'], ['ai_app', 'accountant'], ['website', 'crm'],
    ['website', 'website_sale']];
  var PRESETS = {
    core: ['accountant', 'sale', 'stock'],
    retail: ['point_of_sale', 'stock', 'accountant', 'purchase', 'website_sale'],
    mfg: ['mrp', 'stock', 'purchase', 'accountant', 'sale'],
    services: ['project', 'helpdesk', 'planning', 'crm', 'sale', 'accountant'],
    all: KEYS.slice()
  };
  var PRESET_NAME = { core: 'The core three', retail: 'Retail', mfg: 'Manufacturing', services: 'Services', all: 'Everything' };
  var QUOTABLE = { accountant: 1, sale: 1, stock: 1, account: 1, crm: 1, purchase: 1, point_of_sale: 1, website_sale: 1,
    mrp: 1, project: 1, hr: 1, helpdesk: 1, website: 1 };

  // ---------------------------------------------------------------- the apps on the rings
  var btn = {}, order = [];
  Array.prototype.forEach.call(field.querySelectorAll('.su-app'), function (b) {
    var i = KEYS.indexOf(b.getAttribute('data-mod'));
    if (i < 0) return;
    var m = KEYS[i];                       // canonical key, never the raw attribute
    btn[m] = b; order.push(m);
  });
  if (!order.length) return;
  var on = {};
  order.forEach(function (m) { if (btn[m].classList.contains('is-on')) on[m] = true; });

  // ---------------------------------------------------------------- spokes, links, rings (SVG)
  var NS = 'http://www.w3.org/2000/svg';
  var svg = field.querySelector('.su-svg');
  var gRings = svg.querySelector('.su-rings'), gLinks = svg.querySelector('.su-links'), gSpokes = svg.querySelector('.su-spokes');
  var spoke = {}, links = [];
  function mkPath(cls, i) {
    var p = document.createElementNS(NS, 'path');
    p.setAttribute('class', cls);
    p.setAttribute('pathLength', '1');
    if (i != null) p.style.setProperty('--i', String(i));
    return p;
  }
  order.forEach(function (m, i) {
    var base = mkPath('su-spoke', i), pulse = mkPath('su-pulse');
    pulse.style.setProperty('--dl', (-((i * 0.73) % 3.2)).toFixed(2) + 's');
    gSpokes.appendChild(base); gSpokes.appendChild(pulse);
    spoke[m] = { base: base, pulse: pulse };
  });
  LINKS.forEach(function (pair, i) {
    if (!btn[pair[0]] || !btn[pair[1]]) return;
    var base = mkPath('su-link', i), pulse = mkPath('su-pulse link');
    gLinks.appendChild(base); gLinks.appendChild(pulse);
    links.push({ a: pair[0], b: pair[1], base: base, pulse: pulse, burst: 0 });
  });

  function num(v) { var n = parseFloat(v); return isNaN(n) ? 0 : n; }
  function layout() {
    var W = field.clientWidth, H = field.clientHeight;
    if (!W || !H) return;
    var cx = W / 2, cy = H / 2, geo = {}, radii = {};
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    order.forEach(function (m) {
      var cs = window.getComputedStyle(btn[m]);
      var r = num(cs.getPropertyValue('--rad')) * W / 100;          // --rad is in cqw
      var a = num(cs.getPropertyValue('--ang')) * Math.PI / 180;
      geo[m] = [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
      radii[r.toFixed(1)] = r;
    });
    while (gRings.firstChild) gRings.removeChild(gRings.firstChild);
    Object.keys(radii).forEach(function (k) {
      var c = document.createElementNS(NS, 'circle');
      c.setAttribute('class', 'su-ring');
      c.setAttribute('cx', cx.toFixed(1)); c.setAttribute('cy', cy.toFixed(1)); c.setAttribute('r', radii[k].toFixed(1));
      gRings.appendChild(c);
    });
    var f = function (v) { return v.toFixed(1); };
    order.forEach(function (m) {
      var d = 'M' + f(cx) + ' ' + f(cy) + 'L' + f(geo[m][0]) + ' ' + f(geo[m][1]);
      spoke[m].base.setAttribute('d', d); spoke[m].pulse.setAttribute('d', d);
    });
    links.forEach(function (L) {
      var A = geo[L.a], B = geo[L.b], mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2;
      var qx = mx + (cx - mx) * 0.42, qy = my + (cy - my) * 0.42;
      var d = 'M' + f(A[0]) + ' ' + f(A[1]) + 'Q' + f(qx) + ' ' + f(qy) + ' ' + f(B[0]) + ' ' + f(B[1]);
      L.base.setAttribute('d', d); L.pulse.setAttribute('d', d);
    });
  }

  // ---------------------------------------------------------------- readout, CTA, presets
  var live = reduce, hot = null, used = false, inView = false;
  var rest = { mode: 'default' };
  var nApps = sec.querySelector('[data-n="apps"]'), nLinks = sec.querySelector('[data-n="links"]'), zero = sec.querySelector('.su-zero');
  var cta = sec.querySelector('[data-cta]'), quote = sec.querySelector('[data-quote]');
  var presetBtns = Array.prototype.slice.call(sec.querySelectorAll('[data-preset]'));
  // replays the tick without a forced reflow: the class returns two frames later (a newer tick supersedes it)
  function tick(el) {
    if (reduce || !el) return;
    if (!el.classList.contains('is-tick')) { el.classList.add('is-tick'); return; }
    el.classList.remove('is-tick');
    var tok = el.__tnTk = (el.__tnTk || 0) + 1;
    requestAnimationFrame(function () { requestAnimationFrame(function () { if (el.__tnTk === tok) el.classList.add('is-tick'); }); });
  }
  function setNum(el, v) { if (!el || el.textContent === String(v)) return; el.textContent = String(v); tick(el); }
  function picks() { return order.filter(function (m) { return on[m]; }); }
  function countLinks() { var n = 0; links.forEach(function (L) { if (on[L.a] && on[L.b]) n++; }); return n; }
  function same(a, b) { if (a.length !== b.length) return false; for (var i = 0; i < a.length; i++) if (b.indexOf(a[i]) < 0) return false; return true; }
  function readout() {
    var list = picks(), n = list.length;
    setNum(nApps, n); setNum(nLinks, countLinks());
    if (cta) cta.textContent = n === 0 ? 'Get a quotation' : 'Get a quotation for ' + (n === 1 ? 'this app' : 'these ' + n + ' apps');
    if (quote) {
      var q = list.filter(function (m) { return has(QUOTABLE, m); }), more = list.filter(function (m) { return !has(QUOTABLE, m); });
      var params = [];
      if (q.length) params.push('apps=' + q.join(','));
      if (more.length) params.push('more=' + more.join(','));
      quote.setAttribute('href', 'quotation' + (params.length ? '?' + params.join('&') : ''));
    }
    var key = '';
    Object.keys(PRESETS).forEach(function (k) { if (same(PRESETS[k], list)) key = k; });
    presetBtns.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-preset') === key ? 'true' : 'false'); });
  }

  function render() {
    order.forEach(function (m) {
      var o = !!on[m];
      btn[m].classList.toggle('is-on', o);
      btn[m].setAttribute('aria-pressed', o ? 'true' : 'false');
      spoke[m].base.classList.toggle('is-on', live && o);
      spoke[m].pulse.classList.toggle('is-on', live && o && !reduce);
    });
    links.forEach(function (L) {
      var o = !!(on[L.a] && on[L.b]);
      L.base.classList.toggle('is-on', live && o);
      if (!o) { L.pulse.classList.remove('is-on'); L.burst = 0; }
    });
    readout();
  }

  // ---------------------------------------------------------------- the core and the detail card
  var core = field.querySelector('.su-core');
  var coreIc = core.querySelector('.su-core-ic'), coreName = core.querySelector('.su-core-app b');
  var recs = {};
  Array.prototype.forEach.call(core.querySelectorAll('[data-rec]'), function (r) { recs[r.getAttribute('data-rec')] = r; });
  var det = sec.querySelector('.su-detail');
  var detIc = det.querySelector('.su-detail-ic'), detT = det.querySelector('.su-detail-t');
  var detA = det.querySelector('.su-detail-a'), detAT = detA.querySelector('span');
  var say = sec.querySelector('[data-say]');
  var DB_ICON = detIc.firstElementChild ? detIc.firstElementChild.cloneNode(true) : null;

  function lightRecs(uses, flash) {
    ['c', 'p', 'a'].forEach(function (k) {
      if (!recs[k]) return;
      var lit = uses == null || uses.indexOf(k) > -1;
      recs[k].classList.toggle('is-lit', lit);
      if (flash && lit && !reduce) { recs[k].classList.remove('is-flash'); void recs[k].offsetWidth; recs[k].classList.add('is-flash'); }
    });
  }
  function appIcon(m) { var img = btn[m].querySelector('img'); return img ? img.cloneNode(false) : null; }
  function peek(m) {
    coreIc.textContent = '';
    var ic = appIcon(m); if (ic) coreIc.appendChild(ic);
    coreName.textContent = APPS[m][1];
    field.classList.add('is-peek');
    lightRecs(APPS[m][0]);
  }
  function unpeek() { field.classList.remove('is-peek'); lightRecs(null); }

  function detail(st, swap) {
    var m = st.m, lead = '', text = '', linkText = 'How we implement Odoo ERP', href = 'solutions/odoo-erp';
    detIc.textContent = '';
    if (m && st.mode !== 'preset' && st.mode !== 'default') {
      var ic = appIcon(m); if (ic) detIc.appendChild(ic);
      var name = APPS[m][1], does = APPS[m][2];
      if (st.mode === 'preview') { lead = name; text = ' — ' + does + (on[m] ? ' Press to take it out.' : ' Press to plug it in.'); }
      if (st.mode === 'added') { lead = name + ' is in.'; text = ' ' + does + ' Still one database, and no integration to build.'; }
      if (st.mode === 'removed') { lead = name + ' is out.'; text = ' The other apps keep working on the same records.'; }
      linkText = 'About Odoo ' + name; href = 'odoo/apps/' + ((window.TN_APP_SLUG || {})[m] || m);
    } else {
      if (DB_ICON) detIc.appendChild(DB_ICON.cloneNode(true));
      if (st.mode === 'preset') {
        var list = picks().map(function (k) { return APPS[k][1]; });
        lead = PRESET_NAME[st.preset] + ':';
        text = ' ' + list.join(', ') + '. ' + countLinks() + ' connections work out of the box.';
      } else {
        lead = 'Accounting, Sales and Inventory';
        text = ' are where most companies start: quote, deliver and invoice on one set of records.';
      }
    }
    detT.textContent = '';
    var b = document.createElement('b'); b.textContent = lead;
    detT.appendChild(b); detT.appendChild(document.createTextNode(text));
    detAT.textContent = linkText;
    detA.setAttribute('href', href);
    if (swap && !reduce) { det.classList.remove('is-swap'); void det.offsetWidth; det.classList.add('is-swap'); }
    return lead + text;
  }
  function announce(msg) { if (say) { say.textContent = ''; window.setTimeout(function () { say.textContent = msg; }, 30); } }

  // ---------------------------------------------------------------- hover / focus preview
  function related(m) { return links.filter(function (L) { return L.a === m || L.b === m; }); }
  function paintHot(m) {
    btn[m].classList.add('is-hot');
    spoke[m].base.classList.add('is-hot');
    spoke[m].base.classList.toggle('is-ghost', !on[m]);
    related(m).forEach(function (L) {
      var other = L.a === m ? L.b : L.a, show = !!on[other];
      L.base.classList.toggle('is-hot', show);
      L.base.classList.toggle('is-ghost', show && !on[m]);
      L.pulse.classList.toggle('is-on', show && !reduce && !!on[m]);
    });
  }
  function clearHot(m) {
    btn[m].classList.remove('is-hot');
    spoke[m].base.classList.remove('is-hot', 'is-ghost');
    related(m).forEach(function (L) {
      L.base.classList.remove('is-hot', 'is-ghost');
      if (!L.burst) L.pulse.classList.remove('is-on');
    });
  }
  var leaveT = 0;
  function hotOn(m) {
    if (leaveT) { window.clearTimeout(leaveT); leaveT = 0; }
    if (hot && hot !== m) clearHot(hot);            // switch tiles without clearing the peek state
    hot = m;
    field.classList.add('is-peek');
    paintHot(m); peek(m); detail({ m: m, mode: 'preview' }, false);
  }
  function hotOff(m) {
    if (hot !== m) return;
    hot = null;
    clearHot(m); unpeek(); detail(rest, false);
  }

  // ---------------------------------------------------------------- plugging apps in and out
  function markUsed() { if (!used) { used = true; sec.classList.add('is-used'); } }
  function plugFx(m, quiet) {
    if (reduce) return;
    var b = btn[m];
    b.classList.remove('is-out', 'is-new'); void b.offsetWidth; b.classList.add('is-new');
    window.setTimeout(function () { b.classList.remove('is-new'); }, 900);
    related(m).forEach(function (L) {
      if (!(on[L.a] && on[L.b])) return;
      L.burst++; L.pulse.classList.add('is-on');
      window.setTimeout(function () { L.burst = Math.max(0, L.burst - 1); if (!L.burst && hot !== L.a && hot !== L.b) L.pulse.classList.remove('is-on'); }, 2600);
    });
    if (!quiet) { lightRecs(APPS[m][0], true); tick(zero); window.setTimeout(function () { if (!hot) lightRecs(null); }, 1300); }
  }
  function unplugFx(m) {
    if (reduce) return;
    var b = btn[m];
    b.classList.remove('is-new', 'is-out'); void b.offsetWidth; b.classList.add('is-out');
    window.setTimeout(function () { b.classList.remove('is-out'); }, 500);
  }
  function toggle(m) {
    markUsed();
    var added = !on[m];
    if (added) on[m] = true; else delete on[m];
    render();
    if (added) plugFx(m); else unplugFx(m);
    rest = { m: m, mode: added ? 'added' : 'removed' };
    var msg = detail(rest, true);
    announce(msg);
    if (hot === m) { clearHot(m); paintHot(m); peek(m); }
  }

  order.forEach(function (m, i) {
    var b = btn[m];
    b.addEventListener('click', function () { toggle(m); });
    b.addEventListener('pointerenter', function () { hotOn(m); });
    b.addEventListener('pointerleave', function () {
      if (leaveT) window.clearTimeout(leaveT);
      leaveT = window.setTimeout(function () { leaveT = 0; hotOff(m); }, 300);
    });
    b.addEventListener('focus', function () {
      order.forEach(function (x) { btn[x].tabIndex = x === m ? 0 : -1; });
      hotOn(m);
    });
    b.addEventListener('blur', function () { hotOff(m); });
    b.addEventListener('keydown', function (e) {
      var k = e.key, j = -1;
      if (k === 'ArrowRight' || k === 'ArrowDown') j = (i + 1) % order.length;
      else if (k === 'ArrowLeft' || k === 'ArrowUp') j = (i - 1 + order.length) % order.length;
      else if (k === 'Home') j = 0;
      else if (k === 'End') j = order.length - 1;
      if (j > -1) {
        e.preventDefault();
        order.forEach(function (x, n) { btn[x].tabIndex = n === j ? 0 : -1; });
        btn[order[j]].focus();
      }
    });
  });

  presetBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      var names = Object.keys(PRESETS), i = names.indexOf(b.getAttribute('data-preset'));
      if (i < 0) return;
      var k = names[i], before = on;
      markUsed();
      on = {};
      PRESETS[k].forEach(function (m) { if (btn[m]) on[m] = true; });
      render();
      order.forEach(function (m) { if (on[m] && !before[m]) plugFx(m, true); });
      if (!reduce) { lightRecs(null, true); tick(zero); }
      rest = { mode: 'preset', preset: k };
      announce(detail(rest, true));
    });
  });

  // ---------------------------------------------------------------- start
  layout();
  render();
  if (reduce) field.classList.add('is-settled');
  function goLive() {
    if (live) return;
    live = true;
    render();                                        // spokes draw in, one after another
    window.setTimeout(function () { field.classList.add('is-settled'); }, 1700);
  }
  function setOff() {
    var off = !inView || document.hidden;
    field.classList.toggle('is-off', off);
    sec.classList.toggle('is-off', off);
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) {
      inView = en[0].isIntersecting;
      if (inView && !live) window.setTimeout(goLive, 450);
      setOff();
    }, { threshold: 0.25 }).observe(field);
  } else { inView = true; goLive(); }
  document.addEventListener('visibilitychange', setOff);
  if ('ResizeObserver' in window) new ResizeObserver(layout).observe(field);
  else window.addEventListener('resize', layout);
})();
