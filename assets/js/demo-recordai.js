/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* Odoo AI integration page: AI inside an Odoo record. Switch the record (vendor bill, helpdesk
   ticket, CRM opportunity) and run its AI actions: each one highlights the fields it reads, writes
   its result, and anything that posts, sends or commits waits at a gate for a person to approve.
   Every step lands in the record's log. Sample data. */
TN.demo('recordai', function (root, K) {
  var form = K.$('.dra-form', root), acts = K.$('.dra-acts', root), log = K.$('.dra-log', root), gate = K.$('.dra-gate', root);
  var scopeEl = K.$('.dra-scope span', root), title = K.$('.dra-rt', root), stage = K.$('.dra-rec', root);
  var R = {
    bill: { name: 'Vendor bill · Draft', scope: 'Can read: vendor bills, purchase orders, receipts',
      fields: [['Vendor', ''], ['Bill date', ''], ['Total', ''], ['GST 9%', ''], ['Purchase order', ''], ['Account', '']],
      acts: [
        { k: 'ocr', t: 'Read the PDF', reads: [0, 1, 2, 3], out: { 0: 'Harbourline Supplies', 1: '12 Sep 2026', 2: 'S$ 1,284.00', 3: 'S$ 106.02' }, log: 'AI read the bill and filled four fields' },
        { k: 'po', t: 'Match to the order', reads: [0, 2, 4], out: { 4: 'PO00123 · receipt WH/IN/00231' }, log: 'Matched to purchase order PO00123 and its receipt' },
        { k: 'code', t: 'Code the lines', reads: [0, 4, 5], out: { 5: '5100 Stock purchases' }, log: 'Lines coded from the vendor and the order' },
        { k: 'post', t: 'Post the bill', gate: 'Posting a journal entry needs a person', reads: [2, 3, 5], out: {}, log: 'Approved and posted by Finance', no: 'Sent back to the buyer with a note' }] },
    ticket: { name: 'Helpdesk ticket · In progress', scope: 'Can read: this ticket, the customer, their orders',
      fields: [['Customer', 'Lim & Co Pte Ltd'], ['Subject', 'Order S00419 arrived with one lamp missing'], ['Messages', '7 in the thread'], ['Summary', ''], ['Team', ''], ['Reply', '']],
      acts: [
        { k: 'sum', t: 'Summarise the thread', reads: [1, 2], out: { 3: 'Short by one desk lamp on S00419; wants it before Friday' }, log: 'Thread of 7 messages summarised on the ticket' },
        { k: 'route', t: 'Route and prioritise', reads: [1, 3], out: { 4: 'Warehouse · High' }, log: 'Classified and routed to the warehouse team' },
        { k: 'draft', t: 'Draft a reply', reads: [0, 1, 3], out: { 5: 'Sorry about that: a replacement lamp ships today, tracking to follow.' }, log: 'Reply drafted from the record' },
        { k: 'send', t: 'Send the reply', gate: 'Contacting a customer needs a person', reads: [5], out: {}, log: 'Reviewed and sent by the support agent', no: 'Returned to the draft for edits' }] },
    lead: { name: 'CRM opportunity · Proposition', scope: 'Can read: this opportunity, past quotations, documents',
      fields: [['Customer', 'Apex Trading'], ['Opportunity', 'Warehouse scanners, second site'], ['Last year', ''], ['Source', ''], ['Next step', ''], ['Follow-up', '']],
      acts: [
        { k: 'look', t: 'What did we quote last year?', reads: [0, 1], out: { 2: '40 scanners at S$ 312 each', 3: 'Quotation S00341, 14 Mar 2025' }, log: 'Answered from Odoo, with the source shown' },
        { k: 'next', t: 'Suggest the next step', reads: [1, 2], out: { 4: 'Call about the second site before month-end' }, log: 'Next best action suggested on the record' },
        { k: 'fu', t: 'Draft a follow-up', reads: [0, 2, 4], out: { 5: 'Following up on last year’s scanners: a quote for the second site is ready.' }, log: 'Follow-up email drafted' },
        { k: 'commit', t: 'Send the quotation', gate: 'A commitment to a customer needs a person', reads: [5], out: {}, log: 'Approved and sent by the salesperson', no: 'Held: the price needs a manager' }] }
  };
  var cur = 'bill', busy = false, pending = null, cells = [];
  function el(t, c, x) { return K.el(t, c, x); }
  function line(txt, kind) {
    var li = el('li', 'dra-l' + (kind ? ' dra-l--' + kind : ''));
    li.appendChild(el('i')); li.appendChild(el('span', null, txt));
    var t = new Date(); li.appendChild(el('time', null, ('0' + t.getHours()).slice(-2) + ':' + ('0' + t.getMinutes()).slice(-2)));
    log.insertBefore(li, log.firstChild);
    var rows = K.$$('li', log); while (rows.length > 5) rows.pop().remove();
  }
  function render() {
    var r = R[cur]; form.textContent = ''; cells = [];
    title.textContent = r.name; scopeEl.textContent = r.scope;
    r.fields.forEach(function (f) {
      var row = el('div', 'dra-f'); row.appendChild(el('span', 'dra-fl', f[0]));
      var v = el('b', 'dra-fv' + (f[1] ? '' : ' is-empty'), f[1] || '—'); row.appendChild(v);
      form.appendChild(row); cells.push({ row: row, v: v });
    });
    acts.textContent = '';
    r.acts.forEach(function (a, i) {
      var b = el('button', 'dra-act' + (a.gate ? ' dra-act--gate' : '')); b.type = 'button';
      b.appendChild(el('i', null, String(i + 1))); b.appendChild(el('span', null, a.t));
      if (a.gate) b.appendChild(el('em', null, 'needs approval'));
      b.addEventListener('click', function () { run(a, b); });
      acts.appendChild(b);
    });
    gate.hidden = true; pending = null; log.textContent = '';
    line('Record opened · AI access scoped to this task', 'info');
  }
  function type(node, text, done) {
    node.classList.remove('is-empty');
    if (K.reduce) { node.textContent = text; if (done) done(); return; }
    var i = 0; node.textContent = '';
    (function tick() { i += Math.max(1, Math.round(text.length / 18)); node.textContent = text.slice(0, i); if (i < text.length) setTimeout(tick, 28); else if (done) done(); })();
  }
  function run(a, btn) {
    if (busy || (pending && !a.gate)) return;
    busy = true; stage.classList.add('is-busy'); K.restart(btn, 'is-run');
    a.reads.forEach(function (i, k) { setTimeout(function () { cells[i].row.classList.add('is-read'); }, K.reduce ? 0 : k * 140); });
    setTimeout(function () {
      a.reads.forEach(function (i) { cells[i].row.classList.remove('is-read'); });
      var keys = Object.keys(a.out), left = keys.length;
      function fin() {
        busy = false; stage.classList.remove('is-busy'); btn.classList.add('is-done');
        if (a.gate) { pending = a; K.$('.dra-gq', gate).textContent = a.gate; gate.hidden = false; line('Waiting for approval: ' + a.t.toLowerCase(), 'wait'); }
        else line(a.log, 'ai');
      }
      if (!left) return fin();
      keys.forEach(function (k) { type(cells[+k].v, a.out[k], function () { if (--left === 0) fin(); }); });
    }, K.reduce ? 0 : 700 + a.reads.length * 140);
  }
  K.$('[data-yes]', root).addEventListener('click', function () { if (!pending) return; line(pending.log, 'ok'); gate.hidden = true; K.restart(stage, 'is-ok'); pending = null; });
  K.$('[data-no]', root).addEventListener('click', function () { if (!pending) return; line(pending.no, 'no'); gate.hidden = true; pending = null; });
  K.$$('[data-rec]', root).forEach(function (b) {
    b.addEventListener('click', function () {
      if (busy) return; cur = b.dataset.rec;
      K.$$('[data-rec]', root).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      render();
    });
  });
  render();
  return {};
});
