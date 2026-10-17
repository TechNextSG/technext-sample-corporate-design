/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* Careers page: find your role. Pick what you like doing; the six open roles re-rank live, and the
   best match shows how its work runs (taken from its JobStreet listing). "See the listing" jumps to
   and highlights the role's card below. */
TN.demo('rolematch', function (root, K) {
  var chips = K.$$('[data-i]', root), rows = K.$$('.drm-row', root), flow = K.$('.drm-flow', root), ftitle = K.$('.drm-ft', root);
  var picked = {};
  var ROLES = {
    arch: { w: { proc: 1, dev: 1 }, steps: ['Requirements workshop, sometimes with a CFO', 'Technical blueprint for the Odoo solution', 'Build in Python across Odoo modules', 'Own it through implementation'] },
    fin: { w: { proc: .6, acct: 1 }, steps: ['Discovery: how the client closes the books', 'Odoo Accounting, Expenses, Assets, Analytic, Budgets', 'Tax and e-invoicing: VAT/GST, withholding, BIR', 'Opening balances, UAT and training'] },
    sales: { w: { sales: 1, proc: .4 }, steps: ['Discovery with buyers in the US, Singapore and the EU', 'Qualification', 'Proposal and negotiation', 'Close'] },
    mkt: { w: { content: 1, sales: .3 }, steps: ['Content calendar and gated assets', 'Landing pages and campaigns for the US, Singapore and EU', 'Nurture email sequences', 'Hand-off to sales, tracked from visitor to lead'] },
    cpa: { w: { acct: 1 }, steps: ['Bookkeeping, reconciliations, AP and AR', 'Month-end and year-end close', 'BIR filings: VAT, withholding and income tax', 'Philippine and Singapore entities, in Odoo'] },
    hr: { w: { people: 1 }, steps: ['Policies and HR systems from the ground up', 'Recruitment for developers and consultants', 'Onboarding and performance reviews', 'Employee relations across a hybrid team'] }
  };
  function scores() {
    var any = Object.keys(picked).length, out = {};
    Object.keys(ROLES).forEach(function (r) {
      var w = ROLES[r].w, s = 0, max = 0;
      Object.keys(w).forEach(function (k) { max += w[k]; if (picked[k]) s += w[k]; });
      out[r] = any ? s / max : 0;                   // share of the role's work you'd enjoy
    });
    return out;
  }
  function render() {
    var sc = scores(), order = Object.keys(sc).sort(function (a, b) { return sc[b] - sc[a]; });
    rows.forEach(function (row) {
      var r = row.dataset.r, v = K.clamp(sc[r], 0, 1), rank = order.indexOf(r);
      row.style.setProperty('--v', v.toFixed(3));
      row.style.order = String(rank);
      K.$('.drm-pc', row).textContent = Object.keys(picked).length ? Math.round(v * 100) + '%' : '';
      row.classList.toggle('is-top', rank === 0 && v > 0);
    });
    var top = order[0];
    if (!Object.keys(picked).length || sc[top] <= 0) { flow.textContent = ''; ftitle.textContent = 'Pick what you like doing'; root.classList.remove('has-top'); return; }
    root.classList.add('has-top');
    var row = K.$('.drm-row[data-r="' + top + '"]', root);
    ftitle.textContent = 'How the work runs: ' + K.$('b', row).textContent;
    flow.textContent = '';
    ROLES[top].steps.forEach(function (s, i) {
      var li = K.el('li', null); li.style.setProperty('--i', i);
      li.appendChild(K.el('i', null, String(i + 1))); li.appendChild(K.el('span', null, s));
      flow.appendChild(li);
    });
  }
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      var k = c.dataset.i; if (picked[k]) delete picked[k]; else picked[k] = 1;
      c.setAttribute('aria-pressed', String(!!picked[k])); render();
    });
  });
  rows.forEach(function (row) {
    var go = K.$('[data-go]', row);
    go.addEventListener('click', function () {
      var title = K.$('b', row).textContent;
      var card = K.$$('#role-list .job').filter(function (j) { var h = K.$('h3', j); return h && h.firstChild && h.firstChild.textContent.trim().indexOf(title) === 0; })[0];
      if (!card) return;
      card.scrollIntoView({ behavior: K.reduce ? 'auto' : 'smooth', block: 'center' });
      K.restart(card, 'is-matched');
    });
  });
  // open with the first interest picked: the panel shows a matched role straight away (one click undoes it)
  if (chips[0]) { picked[chips[0].dataset.i] = 1; chips[0].setAttribute('aria-pressed', 'true'); }
  render();
  return {};
});
