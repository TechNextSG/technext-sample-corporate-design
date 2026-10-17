/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* Odoo customisation page: the upgrade-safe stack. Eight sample requirements, five layers (Odoo
   standard, configuration, Studio, a custom module on Odoo.sh, integrations). Drag a requirement
   onto a layer, or select it and press 1 to 5, or press Suggest to run the decision tree up the
   spine: does standard do it, can configuration, can Studio, does it involve another system.
   Meters for upgrade risk, effort and maintenance follow what is placed; the upgrade test shows
   what each layer costs at the next version. Relative values, not estimates. */
TN.demo('layers', function (root, K) {
  var tray = K.$('.lyr-tray', root), stack = K.$('.lyr-stack', root), spine = K.$('.lyr-spine', root), tok = K.$('.lyr-tok', root);
  var pathL = K.$('.lyr-path', root), verdict = K.$('.lyr-verdict', root), upL = K.$('.lyr-up', root), done = K.$('.lyr-done', root);
  var tip = K.tip(root);

  var ORDER = ['std', 'cfg', 'stu', 'mod', 'int'];
  var LN = { std: 'Odoo standard', cfg: 'Configuration', stu: 'Studio', mod: 'A custom module', int: 'Integrations' };
  var SN = { std: 'standard Odoo', cfg: 'configuration', stu: 'Studio', mod: 'a custom module', int: 'an integration' };
  var Q = ['Does standard Odoo already do it?', 'Can settings or configuration do it?', 'Can Studio do it?', 'Does it exchange data with another system?'];
  // relative weights per layer (illustrative): what a change costs to carry through upgrades, to build, to keep
  var COST = { risk: { std: 0, cfg: .5, stu: 1.5, mod: 4, int: 3.5 }, effort: { std: 0, cfg: 1, stu: 2, mod: 5, int: 4.5 }, maint: { std: 0, cfg: .5, stu: 1, mod: 4, int: 4 } };
  var UP = { std: ['Upgraded by Odoo', 'ok'], cfg: ['Carried over with your data', 'ok'], stu: ['Migrated by the upgrade, checked on a test copy', 'chk'],
             mod: ['Ported to the new version, tests run on a staging branch', 'work'], int: ['Connector re-tested against the new version', 'work'] };
  // requirement: the layer it needs, then the answer at each question on the way up
  var RQ = {
    appr: ['cfg', ['Not by default: purchase approvals are off until you set them.', 'Yes: Purchase settings require approval above a minimum amount.']],
    inv: ['stu', ['The standard layouts cover the logo, colours and fonts.', 'Document layout settings stop at branding.', "Yes: Studio's report editor adds your columns and a payment block."]],
    comm: ['mod', ['No: not a margin-tiered, split rule with clawback.', 'No setting calculates it.', 'No: Studio adds fields and simple rules, not this calculation.', 'No other system is involved: a small, tested module.']],
    sync: ['int', ['No.', 'No.', 'Not on its own: the legacy side needs mapping, scheduling and error handling.', 'Yes: an integration, through a connector or the API.']],
    slip: ['stu', ['No: the slip prints the standard fields.', "No: settings don't add fields.", 'Yes: add the field in Studio and place it on the delivery slip.']],
    matrix: ['mod', ['No.', 'Settings give one approval threshold, not a matrix.', 'Studio approvals suit a simple rule; a matrix with delegation needs code.', 'No other system: a module with its own tests.']],
    price: ['cfg', ["Pricelists are standard, but your rule isn't set up yet.", 'Yes: a pricelist rule for trade customers from a minimum quantity of 50.']],
    portal: ['std', ['Yes: the customer portal lists quotations, orders and invoices to download.']]
  };

  var reqs = {}, layers = {}, rlist = [];
  K.$$('.lyr-req', root).forEach(function (el, k) {
    var id = el.dataset.r, d = RQ[id], r = { id: id, el: el, k: k, need: d[0], ans: d[1], pick: K.$('.lyr-pick', el), sug: K.$('.lyr-sug', el), at: null, st: null };
    r.title = K.$('b', r.pick).textContent;
    r.sug.setAttribute('aria-label', 'Suggest a layer for: ' + r.title);
    r.mark = K.el('i', 'lyr-st'); r.pick.appendChild(r.mark);
    reqs[id] = r; rlist.push(r);
  });
  K.$$('.lyr-layer', root).forEach(function (el) {
    var id = el.dataset.l, L = { id: id, i: ORDER.indexOf(id), el: el, slot: K.$('.lyr-slot', el), put: K.$('.lyr-put', el), gate: K.$('.lyr-gate', el) };
    L.ans = K.el('b', 'lyr-ans'); L.gate.appendChild(L.ans);
    L.put.setAttribute('aria-label', 'Place the selected requirement on ' + LN[id]);
    layers[id] = L;
  });

  /* ------------------------------------------------------------------ placing */
  var sel = null, busy = false, cur = null, timers = [], touched = false;
  function later(fn, ms) { timers.push(setTimeout(fn, K.reduce ? 0 : ms)); }
  function clearT() { timers.forEach(clearTimeout); timers = []; }
  function verdictOf(r, l) {
    var need = r.need, a = ORDER.indexOf(l), b = ORDER.indexOf(need);
    if (need === 'int') return l === 'int' ? ['ok', 'Right layer: it talks to another system, so it is an integration.'] : ['no', 'This one moves data to and from another system: it belongs with the integrations.'];
    if (l === 'int') return ['no', 'No other system is involved, so there is nothing to integrate.'];
    if (a < b) return ['no', LN[l] + " can't do this. It needs " + SN[need] + '.'];
    if (a > b) return ['over', 'It works, but ' + SN[need] + ' would carry it with less effort and upgrade risk.'];
    return ['ok', 'Right layer: ' + SN[need] + ' is the lowest layer that can carry it.'];
  }
  function flip(el, fn) {                    // move a card in the DOM and glide it from where it was (or was dropped)
    var a = el.getBoundingClientRect();
    el.style.transition = 'none'; el.style.transform = ''; fn(); var b = el.getBoundingClientRect();
    if (K.reduce || !a.width || !b.width) { el.style.transition = ''; return; }
    el.style.transformOrigin = '0 0';
    el.style.transform = 'translate(' + (a.left - b.left).toFixed(1) + 'px,' + (a.top - b.top).toFixed(1) + 'px) scale(' + (a.width / b.width).toFixed(3) + ',' + (a.height / b.height).toFixed(3) + ')';
    void el.offsetWidth; el.style.transition = ''; el.style.transform = '';
  }
  function toTray(r) {
    var next = null;
    for (var i = r.k + 1; i < rlist.length; i++) if (!rlist[i].at) { next = rlist[i].el; break; }
    tray.insertBefore(r.el, next || done); allIn();
  }
  function allIn() { root.classList.toggle('is-all', !rlist.some(function (x) { return !x.at; })); }
  function place(r, l, why) {
    var v = verdictOf(r, l);
    if (v[0] === 'no') {                     // refused: the layer shakes and the card glides back to where it was
      K.restart(layers[l].el, 'is-shake');
      say(r.title + ': ' + v[1], 'no');
      flip(r.el, function () {}); showPath(r, false); return false;
    }
    flip(r.el, function () { layers[l].slot.appendChild(r.el); r.at = l; allIn(); });
    setMark(r, v[0]); r.v = v[1];
    say(r.title + ': ' + v[1], v[0]);
    if (why !== 'tree') showPath(r, false);
    tidy(); return true;
  }
  function unplace(r) { if (!r.at) return; flip(r.el, function () { r.at = null; toTray(r); }); setMark(r, null); tidy(); }
  function setMark(r, st) {
    r.st = st; r.el.classList.toggle('is-ok', st === 'ok'); r.el.classList.toggle('is-over', st === 'over');
    r.el.classList.remove('is-u-ok', 'is-u-chk', 'is-u-work', 'is-u-done');
    r.mark.textContent = st === 'ok' ? '✓' : st === 'over' ? '!' : '';
  }
  function select(r) {
    if (sel) sel.pick.setAttribute('aria-pressed', 'false');
    sel = r && sel !== r ? r : null;
    if (sel) sel.pick.setAttribute('aria-pressed', 'true');
    root.classList.toggle('is-placing', !!sel);
    if (sel) say('Now choose a layer for “' + sel.title + '”: click Place here, or press 1 to 5.', '');
  }
  function say(t, cls) { verdict.textContent = t; verdict.className = 'lyr-verdict' + (cls ? ' is-' + cls : ''); }
  function tidy() {
    allIn();
    ORDER.forEach(function (l) { layers[l].el.classList.toggle('has-n', !!layers[l].slot.children.length); });
    meters(); upL.textContent = ''; root.classList.remove('is-upd');
    if (!busy) gates();
  }

  /* ------------------------------------------------------------------ meters */
  var MET = K.$$('.lyr-m', root).map(function (el) { return { k: el.dataset.m, el: el, bar: K.$('i', el), low: K.$('u', el), lab: K.$('em', el) }; });
  function meters() {
    var placed = rlist.filter(function (r) { return r.at; }), over = placed.filter(function (r) { return r.st === 'over'; }).length;
    MET.forEach(function (m) {
      var c = COST[m.k], max = 8 * Math.max.apply(null, ORDER.map(function (l) { return c[l]; })), have = 0, low = 0;
      placed.forEach(function (r) { have += c[r.at]; low += c[r.need]; });
      var f = have / max;
      m.bar.style.transform = 'scaleX(' + f.toFixed(3) + ')';
      m.low.style.left = (low / max * 100).toFixed(1) + '%'; m.low.style.opacity = placed.length ? 1 : 0;
      var up = have > low + .01;
      m.el.classList.toggle('is-over', up);
      m.lab.textContent = !placed.length ? 'none yet' : have === 0 ? 'None' : up ? 'Higher than needed' : 'Lowest possible';
    });
  }

  /* ------------------------------------------------------------------ the decision tree on the spine */
  var gy = {};
  function gates() {                         // where each question sits on the spine
    var cx = 0;
    ORDER.forEach(function (l) { var b = K.box(K.$('em', layers[l].gate), stack); gy[l] = b.cy; cx = b.cx; });
    spine.style.left = (cx - 1).toFixed(1) + 'px'; spine.style.top = gy.int.toFixed(1) + 'px'; spine.style.height = (gy.std - gy.int).toFixed(1) + 'px';
    stack.style.setProperty('--sh', stack.offsetHeight + 'px');
  }
  function tokAt(l, into) {
    var y = gy[l] - gy.int;
    tok.style.transform = 'translate(' + (into ? -46 : 0) + 'px,' + y.toFixed(1) + 'px)';
  }
  function lightGate(l, yes, on) {
    var L = layers[l]; L.gate.classList.toggle('is-yes', on && yes); L.gate.classList.toggle('is-no', on && !yes); L.ans.textContent = on ? (yes ? 'Yes' : 'No') : '';
  }
  function clearGates() { ORDER.forEach(function (l) { lightGate(l, false, false); layers[l].el.classList.remove('is-hit'); }); spine.classList.remove('is-run'); }
  function pathRow(i, yes, text) {
    var li = K.el('li', yes ? 'is-yes' : 'is-no'); li.style.setProperty('--i', i);
    li.appendChild(K.el('b', null, 'Q' + (i + 1) + ' · ' + Q[i]));
    var s = K.el('span'); s.appendChild(K.el('em', null, yes ? 'Yes' : 'No')); s.appendChild(document.createTextNode(' ' + text.replace(/^(Yes|No)[:.]\s*/, ''))); li.appendChild(s);
    pathL.appendChild(li);
  }
  function showPath(r, animated) {
    pathL.textContent = '';
    r.ans.forEach(function (t, i) { pathRow(i, isYes(r, i), t); });
    if (!animated) { clearGates(); r.ans.forEach(function (t, i) { lightGate(ORDER[i], isYes(r, i), true); }); }
  }
  function isYes(r, i) { return i === r.ans.length - 1 && (r.need !== 'mod'); }
  function settle() {                        // the visitor acted mid-animation: finish it at once
    if (!busy) return;
    clearT(); busy = false; root.classList.remove('is-busy', 'is-scan');
    tok.classList.remove('is-on', 'is-in');
    if (cur) { var r = cur; cur = null; clearGates(); place(r, r.need, 'tree'); showPath(r, false); }
    gates();
  }
  function suggest(r, fast, then) {
    settle();
    busy = true; cur = r; root.classList.add('is-busy'); select(null); tip.hide();
    if (r.at) { r.at = null; toTray(r); setMark(r, null); tidy(); }
    gates(); clearGates(); pathL.textContent = '';
    say('Running the decision tree for “' + r.title + '”…', '');
    var step = fast ? 380 : 760, n = r.ans.length;
    spine.classList.add('is-run'); tok.classList.remove('is-in'); tokAt('std'); tok.classList.add('is-on');
    r.ans.forEach(function (t, i) {
      later(function () {
        var l = ORDER[i], yes = isYes(r, i);
        tokAt(l); lightGate(l, yes, true); pathRow(i, yes, t);
        if (i === n - 1) {
          var dest = r.need;
          later(function () {
            if (dest === 'int') tokAt('int');
            later(function () {
              tokAt(dest, true); tok.classList.add('is-in'); layers[dest].el.classList.add('is-hit');
              later(function () {
                cur = null; place(r, dest, 'tree'); tok.classList.remove('is-on');
                busy = false; root.classList.remove('is-busy'); gates();
                if (then) then();
              }, fast ? 200 : 360);
            }, dest === 'int' ? step * .8 : 0);
          }, step * .7);
        }
      }, i * step + 60);
    });
  }
  function suggestAll() {
    settle();
    var left = rlist.filter(function (r) { return !r.at || r.st === 'over'; });
    if (!left.length) { say('Everything is already on its lowest layer. Try the upgrade test.', 'ok'); return; }
    (function nx(i) { if (i < left.length) suggest(left[i], true, function () { later(function () { nx(i + 1); }, 180); }); })(0);
  }

  /* ------------------------------------------------------------------ the upgrade test */
  function upgrade() {
    var placed = rlist.filter(function (r) { return r.at; });
    settle(); placed = rlist.filter(function (r) { return r.at; });
    if (!placed.length) { say('Place at least one requirement, then run the upgrade test.', 'no'); return; }
    busy = true; root.classList.add('is-busy', 'is-scan'); upL.textContent = ''; root.classList.remove('is-upd');
    say('Upgrading to the next version on a copy of the database…', '');
    placed.forEach(function (r) { r.el.classList.remove('is-u-ok', 'is-u-chk', 'is-u-work', 'is-u-done'); });
    ORDER.forEach(function (l, i) {
      later(function () {
        layers[l].el.classList.add('is-hit');
        placed.filter(function (r) { return r.at === l; }).forEach(function (r) {
          var u = UP[l][1]; r.el.classList.add('is-u-' + u);
          if (u === 'work') later(function () { r.el.classList.add('is-u-done'); }, 1100);
        });
        later(function () { layers[l].el.classList.remove('is-hit'); }, 420);
      }, i * 420);
    });
    later(function () {
      root.classList.remove('is-scan', 'is-busy'); root.classList.add('is-upd'); busy = false;
      var by = {}; placed.forEach(function (r) { by[r.at] = (by[r.at] || 0) + 1; });
      ORDER.forEach(function (l) {
        if (!by[l]) return;
        var li = K.el('li', 'is-' + UP[l][1]); li.appendChild(K.el('b', null, String(by[l])));
        li.appendChild(K.el('span', null, LN[l] + ': ' + UP[l][0].charAt(0).toLowerCase() + UP[l][0].slice(1)));
        upL.appendChild(li);
      });
      var over = placed.filter(function (r) { return r.st === 'over'; });
      if (over.length) { var w = K.el('li', 'is-warn'); w.appendChild(K.el('b', null, '!')); w.appendChild(K.el('span', null, over.length + ' built higher than needed: extra porting at every version')); upL.appendChild(w); }
      var work = placed.filter(function (r) { return UP[r.at][1] === 'work'; }).length;
      say(work ? 'Done. ' + work + ' of ' + placed.length + ' needed porting or re-testing; the rest came through with the upgrade.' : 'Done. Everything came through with the upgrade, nothing to port.', work > 3 ? 'over' : 'ok');
    }, ORDER.length * 420 + 1300);
  }

  /* ------------------------------------------------------------------ input: click, keys, drag */
  var dragged = false;
  rlist.forEach(function (r) {
    r.pick.addEventListener('click', function () {
      if (dragged) { dragged = false; return; }
      touched = true; settle();
      if (r.at) { unplace(r); select(r); } else select(r);
    });
    r.sug.addEventListener('click', function () { touched = true; suggest(r, false); });
    r.pick.addEventListener('pointerenter', function () { if (!r.at || busy || drag) return; var b = K.box(r.el, root); tip.show([r.title, r.v || '', UP[r.at][0]], b.cx, b.y); });
    r.pick.addEventListener('pointerleave', function () { tip.hide(); });
  });
  ORDER.forEach(function (l) {
    layers[l].put.addEventListener('click', function () { if (!sel || busy) return; var r = sel; select(null); place(r, l); r.pick.focus(); });
  });
  root.addEventListener('keydown', function (e) {
    if (!sel || busy) return;
    if (e.key >= '1' && e.key <= '5') { e.preventDefault(); var r = sel; select(null); place(r, ORDER[+e.key - 1]); r.pick.focus(); }
    else if (e.key === 'Escape') { select(null); say('Pick a requirement to start.', ''); }
  });
  var drag = null;
  root.addEventListener('pointerdown', function (e) {
    var el = e.target.closest('.lyr-req');
    if (!el || e.button !== 0 || e.pointerType === 'touch' || e.target.closest('.lyr-sug')) return;
    if (busy) { touched = true; settle(); }
    drag = { r: reqs[el.dataset.r], x0: e.clientX, y0: e.clientY, on: false, over: null };
  });
  window.addEventListener('pointermove', function (e) {
    if (!drag) return;
    var dx = e.clientX - drag.x0, dy = e.clientY - drag.y0;
    if (!drag.on) {
      if (Math.hypot(dx, dy) < 6) return;
      drag.on = true; touched = true; select(null); tip.hide();
      drag.rects = ORDER.map(function (l) { return [l, layers[l].el.getBoundingClientRect()]; });
      drag.r.el.classList.add('is-drag'); root.classList.add('is-dragging');
    }
    drag.r.el.style.transform = 'translate(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px) rotate(1.5deg)';
    var hit = null;
    drag.rects.forEach(function (q) { var b = q[1]; if (e.clientX >= b.left && e.clientX <= b.right && e.clientY >= b.top && e.clientY <= b.bottom) hit = q[0]; });
    if (hit !== drag.over) { if (drag.over) layers[drag.over].el.classList.remove('is-target'); if (hit) layers[hit].el.classList.add('is-target'); drag.over = hit; }
  });
  window.addEventListener('pointerup', function () {
    if (!drag) return;
    var d = drag; drag = null;
    if (!d.on) return;
    dragged = true; setTimeout(function () { dragged = false; }, 0);
    d.r.el.classList.remove('is-drag'); root.classList.remove('is-dragging');
    if (d.over) { layers[d.over].el.classList.remove('is-target'); place(d.r, d.over); }
    else if (d.r.at) unplace(d.r);                                  // dropped outside the stack: back to the tray
    else flip(d.r.el, function () {});
  });

  K.$('[data-all]', root).addEventListener('click', function () { touched = true; suggestAll(); });
  K.$('[data-up]', root).addEventListener('click', function () { touched = true; upgrade(); });
  K.$('[data-reset]', root).addEventListener('click', function () {
    touched = true; cur = null; clearT(); busy = false; root.classList.remove('is-busy', 'is-scan', 'is-upd'); select(null);
    rlist.forEach(function (r) { if (r.at) { r.at = null; toTray(r); } setMark(r, null); r.v = ''; });
    clearGates(); tok.classList.remove('is-on', 'is-in'); pathL.textContent = ''; tidy(); say('Pick a requirement to start.', '');
  });
  window.addEventListener('resize', function () { if (!busy) gates(); });

  tidy();
  if (K.reduce) { ['appr', 'slip', 'sync'].forEach(function (id) { place(reqs[id], reqs[id].need); }); showPath(reqs.sync, false); say('Three placed as examples. Drag or select the others.', 'ok'); }
  return {
    start: function (first) {
      gates();
      if (first && !touched && !K.reduce) {
        var demo = ['appr', 'slip', 'sync'];            // three worked examples, then it is the visitor's turn
        (function nx(i) {
          if (touched) return;
          if (i === demo.length) { say('Your turn: drag the other five onto a layer, or press Suggest all.', 'ok'); return; }
          suggest(reqs[demo[i]], false, function () { later(function () { nx(i + 1); }, 600); });
        })(0);
      }
    },
    stop: function () { /* event-driven; nothing runs per frame */ }
  };
});
