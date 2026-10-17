/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* Manufacturing page demo: a multi-level bill of materials for an office desk. Costs roll up: each
   component's quantity (plus its scrap allowance) times its price, and each operation's minutes at its
   work centre's cost per hour, add up level by level to the unit cost, with animated deltas travelling
   up the tree. Requirements explode down: demand less stock becomes manufacturing orders for the desk
   and its sub-assemblies, kit components go straight into the desk's order, components short of stock
   raise purchase orders grouped per vendor with its lead time, and work-centre load is set against the
   hours available. Controls: lens (cost / MRP), select a component, price and scrap sliders, demand,
   expand or collapse sub-assemblies, compute price from BoM, reset. Sample data. */
TN.demo('bomtree', function (root, K) {
  'use strict';
  var stage = K.$('.bmt-stage', root), tree = K.$('.bmt-tree', root), svg = K.$('.bmt-links', root), mrpEl = K.$('.bmt-mrp', root);
  var inP = K.$('[data-in="price"]', root), inS = K.$('[data-in="scrap"]', root), inD = K.$('[data-in="demand"]', root);
  var wcList = K.$('.bmt-wcs', root), bCompute = K.$('[data-compute]', root), bReset = K.$('[data-reset]', root);
  var SV = {}, CV = {}, MC = {};
  'name sub price scrap demand'.split(' ').forEach(function (k) { SV[k] = K.$('[data-s="' + k + '"]', root); });
  'unit delta mat ops matv opsv std margin'.split(' ').forEach(function (k) { CV[k] = K.$('[data-c="' + k + '"]', root); });
  ['so', 'mo', 'short', 'po'].forEach(function (k) { MC[k] = K.$('.bmt-mcol[data-m="' + k + '"] ul', root); });

  // products: name, unit, price, on hand, vendor, lead time (days)
  var P = {
    tube: ['Steel tube 40×40 mm', 'm', 4.2, 150, 'Kaya Steel', 5], plate: ['Foot plate', 'pcs', 1.8, 400, 'Kaya Steel', 5],
    coat: ['Powder coat', 'kg', 10, 30, 'ChemCoat', 7], mdf: ['MDF board 18 mm', 'pcs', 38.5, 18, 'Timberline Boards', 4],
    edge: ['Edge banding tape', 'm', .75, 500, 'Timberline Boards', 4], lam: ['Laminate sheet', 'pcs', 10, 40, 'Timberline Boards', 4],
    scr: ['M6 screws', 'pcs', .15, 1500, 'FastFix Hardware', 3], cam: ['Cam locks', 'pcs', .3, 150, 'FastFix Hardware', 3],
    key: ['Allen key', 'pcs', .7, 300, 'FastFix Hardware', 3]
  };
  // bills of materials: name, type, finished stock, operations [work centre, operation, minutes per unit], lines [product, qty]
  var BOM = {
    desk: ['Office desk', 'Manufacture', 8, [['asm', 'Assemble', 16], ['pack', 'Pack', 6]], [['frame', 1], ['top', 1], ['kit', 1]]],
    frame: ['Steel frame', 'Manufacture', 12, [['cut', 'Cut tubes', 10], ['weld', 'Weld frame', 22], ['paint', 'Powder coat', 10]], [['tube', 6], ['plate', 4], ['coat', .6]]],
    top: ['Desk top', 'Manufacture', 20, [['wood', 'Edge band', 8]], [['mdf', 1], ['edge', 4.8], ['lam', 1]]],
    kit: ['Fixing kit', 'Kit', 0, [], [['scr', 16], ['cam', 4], ['key', 1]]]
  };
  var WC = { cut: ['Cutting', 15, 40], weld: ['Welding', 21, 30], paint: ['Paint booth', 18, 20], wood: ['Woodworking', 15, 30], asm: ['Assembly', 18, 40], pack: ['Packing', 16, 20] };
  var SUBS = ['frame', 'top', 'kit'], LEAVES = [], PARENT = {}, LIST = 189, STD0 = 116.4;
  SUBS.forEach(function (s) { BOM[s][4].forEach(function (l) { LEAVES.push(l[0]); PARENT[l[0]] = s; }); });
  var st;
  function initState() { st = { price: {}, scrap: {}, sel: 'tube', lens: st ? st.lens : 'cost', demand: 60, std: STD0, open: { frame: true, top: true, kit: true } }; }
  initState();

  function f2(v) { return v.toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function sgd(v) { return 'S$ ' + f2(v); }
  function qn(v, u) { var r = Math.round(v); if (u === 'pcs' && r === 1) return '1 pc'; return (u === 'pcs' || Math.abs(v - r) < 1e-9 ? r.toLocaleString('en-SG') : v.toFixed(1)) + ' ' + u; }
  function price(k) { return P[k][2] * (st.price[k] || 100) / 100; }
  function qty(k, q) { return q * (1 + (st.scrap[k] || 0) / 100); }
  function opsCost(b) { return BOM[b][3].reduce(function (s, o) { return s + o[2] / 60 * WC[o[0]][1]; }, 0); }
  function opsMin(b) { return BOM[b][3].reduce(function (s, o) { return s + o[2]; }, 0); }
  function roll() {
    var c = { mat: 0, ops: opsCost('desk') };
    SUBS.forEach(function (s) {
      var m = 0;
      BOM[s][4].forEach(function (l) { var v = qty(l[0], l[1]) * price(l[0]); c[l[0]] = v; m += v; });
      c[s + 'M'] = m; c[s + 'O'] = opsCost(s); c[s] = m + c[s + 'O']; c.mat += m; c.ops += c[s + 'O'];
    });
    c.desk = c.mat + c.ops;
    return c;
  }
  function mrp() {
    var D = st.demand, mo = { desk: Math.max(0, D - BOM.desk[2]) }, need = {}, short = {}, pos = [], byV = {}, n = 58;
    mo.frame = Math.max(0, mo.desk - BOM.frame[2]); mo.top = Math.max(0, mo.desk - BOM.top[2]); mo.kit = mo.desk;
    SUBS.forEach(function (s) { BOM[s][4].forEach(function (l) { need[l[0]] = qty(l[0], l[1]) * mo[s]; }); });
    LEAVES.forEach(function (k) {
      var sh = need[k] - P[k][3]; short[k] = sh > 1e-9 ? Math.ceil(sh - 1e-9) : 0;
      if (!short[k]) return;
      var v = P[k][4];
      if (!byV[v]) { byV[v] = { ref: 'P' + ('0000' + n++).slice(-5), v: v, lead: 0, lines: [] }; pos.push(byV[v]); }
      byV[v].lines.push([k, short[k]]); byV[v].lead = Math.max(byV[v].lead, P[k][5]);
    });
    var load = {}; Object.keys(WC).forEach(function (w) { load[w] = 0; });
    ['desk', 'frame', 'top'].forEach(function (b) { BOM[b][3].forEach(function (o) { load[o[0]] += o[2] * mo[b] / 60; }); });
    return { D: D, mo: mo, need: need, short: short, pos: pos, byV: byV, load: load };
  }

  // ------------------------------------------------------------------ build the tree
  var N = {};
  function chipRow(ops) {
    var row = K.el('span', 'bmt-ops');
    ops.forEach(function (o) { row.appendChild(K.el('span', null, o[1] + ' ' + o[2] + '′')); });
    return row;
  }
  function node(key, kind) {
    var isLeaf = kind === 'leaf', el = K.el(isLeaf ? 'button' : 'div', 'bmt-node bmt-node--' + kind);
    el.style.setProperty('--d', kind === 'root' ? '0' : kind === 'sub' ? '1' : '2');
    if (isLeaf) { el.type = 'button'; el.addEventListener('click', function () { select(key); }); }
    var head = K.el('span', 'bmt-nh'), t = K.el('span', 'bmt-nt');
    var name = isLeaf ? P[key][0] : BOM[key][0];
    t.appendChild(K.el('b', null, name));
    var sub = K.el('small'); t.appendChild(sub); head.appendChild(t);
    var cost = K.el('strong', 'bmt-nc'); head.appendChild(cost);
    el.appendChild(head);
    var n = { el: el, sub: sub, cost: cost, delta: K.el('em', 'bmt-delta') };
    el.appendChild(n.delta);
    if (kind === 'root') {
      var sp = K.el('span', 'bmt-split'); n.sm = K.el('i'); sp.appendChild(n.sm); el.appendChild(sp);
      el.appendChild(chipRow(BOM.desk[3]));
    }
    if (kind === 'sub') {
      if (BOM[key][3].length) el.appendChild(chipRow(BOM[key][3]));
      var tg = K.el('button', 'bmt-tog'); tg.type = 'button'; tg.setAttribute('aria-expanded', 'true');
      tg.setAttribute('aria-label', 'Show or hide the components of ' + name);
      tg.addEventListener('click', function () { st.open[key] = !st.open[key]; tg.setAttribute('aria-expanded', String(st.open[key])); N[key].kids.hidden = !st.open[key]; layout(); });
      head.insertBefore(tg, head.firstChild); n.tog = tg;
    }
    n.mrp = K.el('span', 'bmt-mr');                                // MRP lens row
    if (isLeaf) { n.bar = K.el('span', 'bmt-av'); n.have = K.el('i'); n.gap = K.el('u'); n.bar.appendChild(n.have); n.bar.appendChild(n.gap); n.mrp.appendChild(n.bar); }
    var row = K.el('span', 'bmt-mrow'); n.mt = K.el('small'); row.appendChild(n.mt);
    n.chip = K.el('span', 'bmt-chip'); row.appendChild(n.chip); n.mrp.appendChild(row);
    el.appendChild(n.mrp);
    N[key] = n;
    return el;
  }
  var rootCol = K.el('div', 'bmt-rootcol'); rootCol.appendChild(node('desk', 'root')); tree.appendChild(rootCol);
  var subsEl = K.el('div', 'bmt-subs'); tree.appendChild(subsEl);
  SUBS.forEach(function (s) {
    var br = K.el('div', 'bmt-branch'); br.appendChild(node(s, 'sub'));
    N[s].el.classList.add(s === 'kit' ? 'is-kit' : 'is-make');
    var kids = K.el('div', 'bmt-leaves'); BOM[s][4].forEach(function (l) { kids.appendChild(node(l[0], 'leaf')); }); br.appendChild(kids);
    N[s].kids = kids; subsEl.appendChild(br);
  });
  var wcRows = {};
  Object.keys(WC).forEach(function (w) {
    var li = K.el('li'), top = K.el('span', 'bmt-wt'); top.appendChild(K.el('b', null, WC[w][0]));
    var v = K.el('em'); top.appendChild(v); li.appendChild(top);
    var bar = K.el('span', 'bmt-cap'), fill = K.el('i'), over = K.el('u'); bar.appendChild(fill); bar.appendChild(over); li.appendChild(bar);
    var ops = []; ['desk', 'frame', 'top'].forEach(function (b) { BOM[b][3].forEach(function (o) { if (o[0] === w) ops.push(o[1] + ' ' + o[2] + ' min · ' + BOM[b][0].toLowerCase()); }); });
    li.appendChild(K.el('small', null, ops.join(' · ') + ' · S$ ' + WC[w][1] + '/h'));
    wcList.appendChild(li); wcRows[w] = { li: li, v: v, fill: fill, over: over };
  });

  // ------------------------------------------------------------------ connectors
  var edges = [], mode = 'h';
  function pb(el) { return K.box(el, stage); }
  function layout() {
    var W = stage.clientWidth, H = stage.clientHeight;
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H); svg.textContent = ''; edges = [];
    mode = getComputedStyle(tree).flexDirection === 'column' ? 'v' : 'h';
    SUBS.forEach(function (s) {
      edges.push(link('desk', s, 0));
      if (st.open[s]) BOM[s][4].forEach(function (l) { edges.push(link(s, l[0], 1)); });
    });
  }
  function geo(a, b) {
    var A = pb(N[a].el), B = pb(N[b].el);
    if (mode === 'h') {
      var x0 = A.r, y0 = A.cy, x1 = B.x, y1 = B.cy, mx = (x0 + x1) / 2;
      return 'M' + x0.toFixed(1) + ' ' + y0.toFixed(1) + 'C' + mx.toFixed(1) + ' ' + y0.toFixed(1) + ' ' + mx.toFixed(1) + ' ' + y1.toFixed(1) + ' ' + x1.toFixed(1) + ' ' + y1.toFixed(1);
    }
    var x = A.x + 12, yT = A.b, yB = B.cy, r = 7;
    return 'M' + x.toFixed(1) + ' ' + yT.toFixed(1) + 'V' + (yB - r).toFixed(1) + 'Q' + x.toFixed(1) + ' ' + yB.toFixed(1) + ' ' + (x + r).toFixed(1) + ' ' + yB.toFixed(1) + 'H' + B.x.toFixed(1);
  }
  function link(a, b, depth) {
    var d = geo(a, b), p = K.svg('path', { d: d, 'class': 'bmt-l bmt-l--' + depth, pathLength: 1 });
    svg.appendChild(p);
    return { a: a, b: b, p: p, d: d, depth: depth };
  }
  function pulse(child) {                                          // a spark from the component up to the desk
    if (K.reduce) return;
    var chain = [], k = child;
    while (k !== 'desk') { var par = PARENT[k] || 'desk'; chain.push([k, par]); k = par; }
    chain.forEach(function (c, i) {
      var e = edges.filter(function (x) { return x.a === c[1] && x.b === c[0]; })[0]; if (!e) return;
      var p = K.svg('path', { d: e.d, 'class': 'bmt-spark' }); svg.appendChild(p);
      var len = p.getTotalLength();
      p.style.strokeDasharray = '16 ' + (len + 20);
      var an = p.animate([{ strokeDashoffset: -len }, { strokeDashoffset: 16 }], { duration: 520, delay: i * 380, easing: 'cubic-bezier(.3,.6,.3,1)', fill: 'both' });
      an.onfinish = function () { p.remove(); };
    });
  }

  // ------------------------------------------------------------------ render
  var prev = null, first = true;
  function money(node, v) { K.count(node, v, first ? 0 : 520, sgd); }
  function delta(n, d, i) {
    if (Math.abs(d) < .005 || K.reduce) return;
    n.delta.textContent = (d > 0 ? '+' : '−') + sgd(Math.abs(d));
    n.delta.className = 'bmt-delta ' + (d > 0 ? 'is-up' : 'is-down');
    n.delta.style.animationDelay = (i * .38) + 's';
    K.restart(n.delta, 'is-on');
  }
  function render(changed) {
    var c = roll(), m = mrp();
    // tree: costs
    LEAVES.forEach(function (k) {
      var n = N[k], s = st.scrap[k] || 0, sel = k === st.sel;
      n.sub.textContent = qn(qty(k, BOM[PARENT[k]][4].filter(function (l) { return l[0] === k; })[0][1]), P[k][1]) + ' × ' + sgd(price(k)) + (s ? ' · +' + s + '% scrap' : '');
      money(n.cost, c[k]);
      n.el.setAttribute('aria-pressed', String(sel));
      n.el.setAttribute('aria-label', P[k][0] + ', line cost ' + sgd(c[k]) + (sel ? ', selected' : '. Press to adjust'));
      n.el.classList.toggle('is-scrap', !!s);
    });
    SUBS.forEach(function (s) {
      var n = N[s];
      n.sub.textContent = s === 'kit' ? 'Kit BoM · components only' : 'Materials ' + f2(c[s + 'M']) + ' + operations ' + f2(c[s + 'O']);
      money(n.cost, c[s]);
    });
    N.desk.sub.textContent = 'Finished product · ' + opsMin('desk') + ' min in its own operations';
    money(N.desk.cost, c.desk);
    N.desk.sm.style.transform = 'scaleX(' + (c.mat / c.desk).toFixed(4) + ')';
    if (prev && changed) {
      var chain = [changed], k = changed;
      while (k !== 'desk') { k = PARENT[k] || 'desk'; chain.push(k); }
      chain.forEach(function (x, i) { delta(N[x], c[x] - prev[x], i); });
      pulse(changed);
    }
    // side: unit cost
    money(CV.unit, c.desk);
    var dd = c.desk - st.std;
    CV.delta.textContent = Math.abs(dd) < .005 ? 'matches the product cost' : (dd > 0 ? '+' : '−') + sgd(Math.abs(dd)) + ' vs product cost';
    CV.delta.className = Math.abs(dd) < .005 ? 'is-eq' : dd > 0 ? 'is-up' : 'is-down';
    CV.mat.style.transform = 'scaleX(' + (c.mat / c.desk).toFixed(4) + ')';
    CV.matv.textContent = sgd(c.mat); CV.opsv.textContent = sgd(c.ops) + ' · ' + (opsMin('desk') + opsMin('frame') + opsMin('top')) + ' min';
    CV.std.textContent = sgd(st.std);
    CV.margin.textContent = sgd(LIST) + ' · ' + ((LIST - c.desk) / LIST * 100).toFixed(1) + '%';
    bCompute.disabled = Math.abs(dd) < .005;
    // side: selected component
    var sk = st.sel;
    SV.name.textContent = P[sk][0];
    SV.sub.textContent = 'In ' + BOM[PARENT[sk]][0].toLowerCase() + ' · vendor ' + P[sk][4] + ', ' + P[sk][5] + ' days';
    SV.price.textContent = sgd(price(sk)) + ' / ' + P[sk][1] + ((st.price[sk] || 100) !== 100 ? ' (' + ((st.price[sk] || 100) > 100 ? '+' : '') + ((st.price[sk] || 100) - 100) + '%)' : '');
    SV.scrap.textContent = (st.scrap[sk] || 0) + '%';
    SV.demand.textContent = st.demand + ' desks';
    // MRP lens rows
    N.desk.mt.textContent = 'Demand ' + m.D + ' · ' + BOM.desk[2] + ' in stock → WH/MO/00031 makes ' + m.mo.desk;
    N.desk.chip.textContent = '';
    [['frame', 'WH/MO/00032'], ['top', 'WH/MO/00033']].forEach(function (x) {
      var s = x[0], n = N[s], shortK = BOM[s][4].some(function (l) { return m.short[l[0]]; });
      n.mt.textContent = x[1] + ' makes ' + m.mo[s] + ' (' + BOM[s][2] + ' in stock)';
      n.chip.textContent = m.mo[s] ? (shortK ? 'Components not available' : 'Components available') : 'Covered by stock';
      n.chip.className = 'bmt-chip ' + (m.mo[s] && shortK ? 'is-bad' : 'is-ok');
    });
    N.kit.mt.textContent = 'No order of its own: components go into WH/MO/00031';
    N.kit.chip.textContent = BOM.kit[4].some(function (l) { return m.short[l[0]]; }) ? 'Components not available' : 'Components available';
    N.kit.chip.className = 'bmt-chip ' + (BOM.kit[4].some(function (l) { return m.short[l[0]]; }) ? 'is-bad' : 'is-ok');
    LEAVES.forEach(function (k) {
      var n = N[k], need = m.need[k], oh = P[k][3], sh = m.short[k], po = sh && m.byV[P[k][4]];
      n.mt.textContent = 'Need ' + qn(need, P[k][1]) + ' · ' + qn(oh, P[k][1]) + ' in stock';
      var have = need ? Math.min(1, oh / need) : 1;
      n.have.style.transform = 'scaleX(' + have.toFixed(3) + ')';
      n.gap.style.transform = 'scaleX(' + (1 - have).toFixed(3) + ')';
      n.chip.textContent = po ? po.ref + ' · ' + qn(sh, P[k][1]) : '';
      n.chip.className = 'bmt-chip is-po';
      n.el.classList.toggle('is-short', !!sh);
    });
    // work centres
    Object.keys(WC).forEach(function (w) {
      var r = wcRows[w], h = m.load[w], cap = WC[w][2], pc = h / cap;
      r.v.textContent = h.toFixed(1) + ' h of ' + cap + ' h' + (pc > 1 ? ' · ' + (h - cap).toFixed(1) + ' h over' : '');
      r.fill.style.transform = 'scaleX(' + Math.min(1, pc).toFixed(3) + ')';
      r.over.style.transform = 'scaleX(' + Math.min(1, Math.max(0, (pc - 1) / .5)).toFixed(3) + ')';   // the red third is 100-150%
      r.li.classList.toggle('is-over', pc > 1); r.li.classList.toggle('is-high', pc > .85 && pc <= 1);
    });
    drawMrp(m);
    prev = c; first = false;
  }
  function item(ul, b, s, cls) { var li = K.el('li', cls || null); li.appendChild(K.el('b', null, b)); li.appendChild(K.el('span', null, s)); ul.appendChild(li); return li; }
  function drawMrp(m) {
    Object.keys(MC).forEach(function (k) { MC[k].textContent = ''; });
    var a = Math.round(m.D * .4), b = Math.round(m.D * .43);
    item(MC.so, 'S00211', a + ' desks · confirmed'); item(MC.so, 'S00214', b + ' desks · confirmed'); item(MC.so, 'S00219', (m.D - a - b) + ' desks · confirmed');
    item(MC.so, 'Less stock', BOM.desk[2] + ' desks on hand', 'is-note');
    item(MC.mo, 'WH/MO/00031', 'Office desk × ' + m.mo.desk + ' · waits for its components');
    item(MC.mo, 'WH/MO/00032', 'Steel frame × ' + m.mo.frame + (m.mo.frame ? '' : ' · covered by stock'));
    item(MC.mo, 'WH/MO/00033', 'Desk top × ' + m.mo.top + (m.mo.top ? '' : ' · covered by stock'));
    var any = false;
    LEAVES.forEach(function (k) { if (!m.short[k]) return; any = true; item(MC.short, P[k][0], 'need ' + qn(m.need[k], P[k][1]) + ', ' + qn(P[k][3], P[k][1]) + ' in stock → short ' + qn(m.short[k], P[k][1]), 'is-bad'); });
    if (!any) item(MC.short, 'None', 'stock covers every component', 'is-ok');
    m.pos.forEach(function (p) { item(MC.po, p.ref + ' · ' + p.v, p.lines.map(function (l) { return P[l[0]][0] + ' ' + qn(l[1], P[l[0]][1]); }).join(', ') + ' · lead time ' + p.lead + ' days', 'is-po'); });
    if (!m.pos.length) item(MC.po, 'None needed', 'no RFQs this week', 'is-ok');
  }
  function select(k) {
    st.sel = k; inP.value = String(st.price[k] || 100); inS.value = String(st.scrap[k] || 0);
    render(null);
  }
  function setLens(l) {
    st.lens = l;
    K.$$('[data-lens]', root).forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.lens === l)); });
    root.classList.toggle('bmt-is-mrp', l === 'mrp'); mrpEl.hidden = l !== 'mrp';
    layout();
    if (!K.reduce && l === 'mrp') { K.restart(tree, 'is-explode'); K.restart(mrpEl, 'is-explode'); K.restart(svg, 'is-explode'); }
  }

  // ------------------------------------------------------------------ controls
  inP.addEventListener('input', function () { st.price[st.sel] = +inP.value; render(st.sel); });
  inS.addEventListener('input', function () { st.scrap[st.sel] = +inS.value; render(st.sel); });
  inD.addEventListener('input', function () { st.demand = +inD.value; render(null); });
  K.$$('[data-lens]', root).forEach(function (b) { b.addEventListener('click', function () { setLens(b.dataset.lens === 'mrp' ? 'mrp' : 'cost'); }); });
  bCompute.addEventListener('click', function () { st.std = roll().desk; render(null); K.restart(CV.std, 'bmt-flash'); });
  bReset.addEventListener('click', function () {
    initState(); inP.value = '100'; inS.value = '0'; inD.value = '60';
    SUBS.forEach(function (s) { N[s].kids.hidden = false; N[s].tog.setAttribute('aria-expanded', 'true'); });
    render(null); layout();
  });
  var rt = 0;
  window.addEventListener('resize', function () { cancelAnimationFrame(rt); rt = requestAnimationFrame(layout); });
  render(null);
  return {
    start: function (firstTime) {
      layout();
      if (firstTime && !K.reduce) setTimeout(function () { st.price.tube = 118; if (st.sel === 'tube') inP.value = '118'; render('tube'); }, 900);
    },
    stop: function () {}
  };
});
