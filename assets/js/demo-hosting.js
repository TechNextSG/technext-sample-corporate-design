/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* Odoo Online vs Odoo.sh vs on-premise (blog): a chooser built on the article's rule of thumb. Four
   questions (custom code, own servers, an infrastructure team, Studio) pick Online, Odoo.sh or
   on-premise with the article's reasons, show who runs servers, upgrades, code and staging, and light
   the matching column of the article's comparison table. Values are read from that table. */
TN.demo('hosting', function (root, K) {
  var qsEl = K.$('.hc-qs', root), cardsEl = K.$('.hc-cards', root), slide = K.$('.hc-slide', root);
  var whyEl = K.$('.hc-why ul', root), layersEl = K.$('.hc-layers', root);
  var cards = {}; K.$$('.hc-card', root).forEach(function (c) { cards[c.dataset.o] = { el: c, best: K.$('[data-best]', c), fit: K.$('[data-fit]', c) }; });
  var OPTS = ['online', 'sh', 'prem'], COL = { online: 1, sh: 2, prem: 3 };

  // ------------------------------------------------------------ the article's comparison table (read, never duplicated)
  var table = document.querySelector('[data-hc-table] table');
  var trs = table ? K.$$('tr', table) : [];
  function cell(rowStart, o) {
    for (var i = 0; i < trs.length; i++) {
      var c = trs[i].children;
      if (c[0] && c[0].textContent.trim().indexOf(rowStart) === 0 && c[COL[o]]) return c[COL[o]].textContent.trim();
    }
    return null;
  }
  var FALLBACK = {
    'Who runs the servers': { online: 'Odoo', sh: 'Odoo', prem: 'You' },
    'Version upgrades': { online: "Odoo's upgrade service", sh: 'Planned, with your code', prem: 'Planned, fully yours' },
    'Staging copies for testing': { online: 'Database duplicates', sh: 'Built in (branches)', prem: 'You set them up' },
    'Best for': { online: 'Most first phases', sh: 'Custom modules, integrations', prem: 'Strict IT or data rules' }
  };
  function val(row, o) { return cell(row, o) || FALLBACK[row][o]; }
  OPTS.forEach(function (o) { cards[o].best.textContent = val('Best for', o); });

  // position on the track: 0 = Odoo runs it, .5 = shared, 1 = you (or your partner); null = not available
  var LAYERS = [
    { row: 'Who runs the servers', label: 'Servers', pos: { online: 0, sh: 0, prem: 1 } },
    { row: 'Version upgrades', label: 'Version upgrades', pos: { online: 0, sh: .5, prem: 1 } },
    { row: null, label: 'Custom code', pos: { online: null, sh: 1, prem: 1 }, text: { online: 'Not on Odoo Online', sh: 'You or your partner own it', prem: 'Yours' } },
    { row: 'Staging copies for testing', label: 'Staging copies', pos: { online: 0, sh: 0, prem: 1 } }
  ];
  var tracks = LAYERS.map(function (L) {
    var row = K.el('div', 'hc-layer'); row.appendChild(K.el('span', 'hc-ll', L.label));
    var tr = K.el('span', 'hc-track'), chip = K.el('b', 'hc-chip'); tr.appendChild(chip); row.appendChild(tr);
    layersEl.appendChild(row);
    return { L: L, row: row, chip: chip, tr: tr };
  });

  // ------------------------------------------------------------ the four questions
  var QS = [
    { k: 'code', q: 'Will you need custom code?', s: "Custom Python modules, a bespoke integration, a module Odoo doesn't have, or logic Studio can't express." },
    { k: 'own', q: 'Must Odoo run on your own servers?', s: 'Because a regulator, a group IT policy or data-residency rules require it.' },
    { k: 'infra', q: 'Do you already run your own infrastructure team?', s: 'On-premise hands you hosting, backups, security patches, monitoring and upgrades.' },
    { k: 'studio', q: 'Will you want no-code changes in Studio?', s: 'Fields, views and automations, added without code.' }
  ];
  var ans = { code: false, own: false, infra: false, studio: false };
  QS.forEach(function (Q, i) {
    var row = K.el('div', 'hc-q' + (i ? '' : ' is-big'));
    var tx = K.el('span', 'hc-qt'); tx.appendChild(K.el('b', null, Q.q)); tx.appendChild(K.el('small', null, Q.s)); row.appendChild(tx);
    var seg = K.el('span', 'dm-seg hc-yn'); seg.setAttribute('role', 'group'); seg.setAttribute('aria-label', Q.q);
    [['No', false], ['Yes', true]].forEach(function (o) {
      var b = K.el('button', null, o[0]); b.type = 'button'; b.dataset.v = String(o[1]);
      b.setAttribute('aria-pressed', String(ans[Q.k] === o[1]));
      b.addEventListener('click', function () { ans[Q.k] = o[1]; render(true); });
      seg.appendChild(b);
    });
    row.appendChild(seg); qsEl.appendChild(row);
    Q.seg = seg;
  });

  // ------------------------------------------------------------ the rule of thumb
  function decide(a) {
    var rec = a.own ? 'prem' : a.code ? 'sh' : 'online', also = !a.own && a.infra ? 'prem' : null, why = [];
    if (rec === 'online') {
      why.push('Standard apps and configuration cover your processes: the simplest to run and the cheapest to start.');
      why.push('Odoo hosts the database, handles servers, backups and security, and runs upgrades through its own upgrade service.');
      if (a.studio) why.push('Studio adds fields, views and automations without code, on the Custom plan.');
      if (a.infra) why.push('Your infrastructure team makes on-premise possible, but it moves the whole operations burden to you.');
      why.push('You can move later: the database can move to Odoo.sh or on-premise when custom code becomes necessary.');
    } else if (rec === 'sh') {
      why.push('A requirement needs custom code, and Odoo Online cannot install custom Python modules.');
      why.push('It connects to a GitHub repository, with development and staging branches that copy production data for testing.');
      why.push('Odoo still runs the infrastructure; you or your partner own the code.');
      why.push('It needs the Custom plan, with hosting billed on top of the subscription.');
      if (a.infra) why.push('With your own infrastructure team, on-premise also fits, and runs custom modules too.');
    } else {
      why.push('Your IT policy or data rules require your own servers, or your own cloud account.');
      why.push('Full control of the environment, and full responsibility for it: hosting, backups, security patches, monitoring and upgrades.');
      why.push('For Odoo Enterprise it needs the Custom plan, billed yearly.');
      if (a.code) why.push('Custom Python modules run on-premise too.');
    }
    var fit = {};
    OPTS.forEach(function (o) {
      if (o === rec) fit[o] = ['Recommended', 'is-rec'];
      else if (o === also) fit[o] = ['Also fits', 'is-also'];
      else if (o === 'online') fit[o] = [a.own ? 'Odoo runs the servers' : 'No custom modules', 'is-no'];
      else if (o === 'sh') fit[o] = [a.own ? 'Odoo runs the servers' : 'Not needed yet', 'is-no'];
      else fit[o] = ['Only for a concrete reason', 'is-no'];
    });
    return { rec: rec, also: also, why: why, fit: fit };
  }

  // ------------------------------------------------------------ render
  var last = null;
  function placeSlide(o) {
    var b = K.box(cards[o].el, cardsEl);
    slide.style.width = b.w + 'px'; slide.style.height = b.h + 'px';
    slide.style.transform = 'translate(' + b.x + 'px,' + b.y + 'px)';
  }
  function render(user) {
    QS.forEach(function (Q) { K.$$('button', Q.seg).forEach(function (b) { b.setAttribute('aria-pressed', String(String(ans[Q.k]) === b.dataset.v)); }); });
    var d = decide(ans);
    OPTS.forEach(function (o) {
      var c = cards[o]; c.fit.textContent = d.fit[o][0];
      c.el.className = 'hc-card ' + d.fit[o][1];
    });
    placeSlide(d.rec);
    whyEl.textContent = '';
    d.why.forEach(function (w, i) { var li = K.el('li', null, w); li.style.setProperty('--k', i); whyEl.appendChild(li); });
    if (user && d.rec !== last) K.restart(whyEl, 'is-in');
    tracks.forEach(function (t) {
      var p = t.L.pos[d.rec];
      t.chip.textContent = t.L.text ? t.L.text[d.rec] : val(t.L.row, d.rec);
      t.row.classList.toggle('is-na', p == null);
      t.p = p == null ? 0 : p;
    });
    slideChips();
    // the comparison table below: light the recommended column
    trs.forEach(function (tr) {
      K.$$('th,td', tr).forEach(function (c, i) {
        c.classList.toggle('hc-col', i === COL[d.rec]);
        c.classList.toggle('hc-col-also', !!d.also && i === COL[d.also]);
      });
    });
    root.dataset.rec = d.rec; last = d.rec;
  }
  function slideChips() {
    // measured once per change, never per frame: the chip slides between "Odoo" and "you"
    tracks.forEach(function (t) { t.chip.style.transform = 'translateX(' + ((t.tr.offsetWidth - t.chip.offsetWidth) * t.p).toFixed(1) + 'px)'; });
  }
  K.$('[data-reset]', root).addEventListener('click', function () { Object.keys(ans).forEach(function (k) { ans[k] = false; }); render(true); });
  var rz = 0;
  window.addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(function () { placeSlide(last || 'online'); slideChips(); }, 100); });
  render(false);
  return { start: function () { placeSlide(last || 'online'); slideChips(); }, stop: function () {} };
});
