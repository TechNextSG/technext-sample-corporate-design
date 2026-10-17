/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* Technology overview page: one situation travels from the sensor over the network to an app and into Odoo.
   Switch a service off and the information stalls there: the outcome, the minutes until someone acts and the
   manual steps change. Three situations (freezer warming, machine stopped, delivery arrived); the times are
   typical examples, labelled as such on the page. */
TN.demo('techflow', function (root, K) {
  var ST = {}; K.$$('[data-st]', root).forEach(function (n) { ST[n.dataset.st] = n; });
  var pipe = K.$('.tfl-pipe', root), rail = K.$('.tfl-rail', root), pk = K.$('.tfl-pk', root), outBox = K.$('.tfl-out', root);
  var outH = K.$('[data-out-h]', root), out = K.$('[data-out]', root);
  var KP = {}; K.$$('[data-k]', root).forEach(function (n) { KP[n.dataset.k] = n; });
  var ORDER = ['iot', 'net', 'app', 'odoo'], NAME = { iot: 'IoT', net: 'the network', app: 'the app' };
  var on = { iot: true, net: true, app: true }, sc = 'freezer', timers = [], auto = 0, visible = false;
  var SC = {
    freezer: {
      t: { iot: 'Freezer reads −14.6 °C, over its limit', net: 'The reading reaches the server in seconds', app: 'The supervisor’s phone: freezer warming', odoo: 'Quality check opened on the stock' },
      ok: [4, 0, 1, 'The supervisor moves the stock within minutes, and the check is already in Odoo.'],
      miss: {
        iot: [180, 3, 0, 'No sensor: nobody knows until the morning walk-round, and then someone types it up.'],
        net: [180, 3, 0, 'The sensor sees it, but the reading never leaves the room.'],
        app: [45, 2, 1, 'Odoo has the check, but nobody is told: it waits until someone looks at the screen.']
      },
      odooNoApp: 'Check opened, but nobody is alerted'
    },
    machine: {
      t: { iot: 'Packing machine stopped: runtime counter flat', net: 'The status reaches the server', app: 'The technician gets the job in the field app', odoo: 'Maintenance request and job opened' },
      ok: [6, 0, 2, 'The technician is on the way before the line supervisor picks up the phone.'],
      miss: {
        iot: [40, 3, 0, 'No counter: the stop is noticed when the output pile stops growing.'],
        net: [40, 3, 0, 'The machine knows, but the status stays on the shop floor.'],
        app: [25, 2, 2, 'The request is in Odoo, but the technician only hears about it from a phone call.']
      },
      odooNoApp: 'Request opened, technician not told'
    },
    delivery: {
      t: { iot: 'Dock scale weighs 4 pallets: 812 kg', net: 'The weight reaches the server', app: 'The storekeeper confirms the count in the app', odoo: 'Receipt validated, stock updated' },
      ok: [3, 0, 1, 'Stock is up to date before the truck leaves the dock.'],
      miss: {
        iot: [20, 2, 1, 'No scale reading: the storekeeper weighs the pallets and writes it down by hand.'],
        net: [20, 2, 1, 'The scale has the weight, but it never reaches the server.'],
        app: [25, 3, 1, 'The weight arrives, but the count is checked on paper and typed in later.']
      },
      odooNoApp: 'Receipt typed in later, by hand'
    }
  };
  function later(f, ms) { timers.push(setTimeout(f, ms)); }
  function clear() { timers.forEach(clearTimeout); timers = []; clearTimeout(auto); auto = 0; }
  function cx(id) { var b = K.box(ST[id], pipe), r = K.box(rail, pipe); return b.cx - r.x; }
  function lay() {
    if (!rail.offsetWidth) return;
    var a = cx('iot'), z = cx('odoo');
    rail.style.setProperty('--x1', a.toFixed(1) + 'px'); rail.style.setProperty('--w', (z - a).toFixed(1) + 'px');
  }
  function move(id, instant) {
    if (!rail.offsetWidth) return;
    pk.style.transition = instant ? 'none' : ''; pk.style.transform = 'translateX(' + cx(id).toFixed(1) + 'px)';
  }
  function text(id, s) { K.$('[data-t]', ST[id]).textContent = s; }
  function result() {
    var S = SC[sc], miss = ['iot', 'net', 'app'].filter(function (k) { return !on[k]; })[0];
    return { S: S, miss: miss, r: miss ? S.miss[miss] : S.ok };
  }
  function idle() {
    ORDER.forEach(function (id) { ST[id].className = 'tfl-st' + (id !== 'odoo' && !on[id] ? ' is-missing' : ''); text(id, id === 'iot' ? 'Waiting for a reading' : 'Ready'); });
    pk.className = 'tfl-pk'; outBox.className = 'tfl-out';
    outH.textContent = 'Following the alert…'; out.textContent = 'Watch where it goes and who hears about it.';
  }
  function finish(res, instant) {
    var miss = res.miss, r = res.r;
    outBox.className = 'tfl-out ' + (miss ? 'is-bad' : 'is-good');
    outH.textContent = miss ? 'Without ' + NAME[miss] : 'All three services on';
    out.textContent = r[3];
    var d = instant ? 0 : 420;
    K.count(KP.mins, r[0], d); K.count(KP.manual, r[1], d); K.count(KP.recs, r[2], d);
    K.count(KP.svc, ['iot', 'net', 'app'].filter(function (k) { return on[k]; }).length, d);
    if (!instant) schedule();
  }
  // The situation runs stage by stage. A missing IoT or network stops it where it is; a missing app lets it reach
  // Odoo, but nobody is told.
  function run(instant) {
    clear(); idle();
    var res = result(), S = res.S, stopAt = res.miss === 'iot' || res.miss === 'net' ? res.miss : null;
    var path = []; for (var i = 0; i < ORDER.length; i++) { path.push(ORDER[i]); if (ORDER[i] === stopAt) break; }
    function settle(id) {
      if (!on[id] && id !== 'odoo') { ST[id].className = 'tfl-st is-broken'; text(id, id === 'app' ? 'Nobody is alerted' : 'Not in place'); return; }
      ST[id].className = 'tfl-st is-done';
      text(id, id === 'odoo' && res.miss === 'app' ? S.odooNoApp : S.t[id]);
    }
    if (instant || K.reduce) {
      path.forEach(settle);
      ORDER.slice(path.length).forEach(function (id) { ST[id].className = 'tfl-st is-off'; text(id, 'Never reached'); });
      move(path[path.length - 1], true); pk.className = 'tfl-pk ' + (stopAt ? 'is-stall' : 'is-ok');
      finish(res, true); return;
    }
    move('iot', true);
    var t = 250;
    path.forEach(function (id, k) {
      later(function () { if (k) move(id); }, t);
      later(function () { ST[id].classList.add('is-on'); }, t + (k ? 440 : 0));
      t += (k ? 440 : 0) + 640;
      later(function () { settle(id); if (id === stopAt) pk.classList.add('is-stall'); }, t);
      t += 120;
    });
    later(function () {
      ORDER.slice(path.length).forEach(function (id) { ST[id].className = 'tfl-st is-off'; text(id, 'Never reached'); });
      if (!stopAt) pk.classList.add('is-ok');
      finish(res, false);
    }, t + 200);
  }
  function schedule() { clearTimeout(auto); auto = 0; if (visible && !K.reduce) auto = setTimeout(function () { run(false); }, 6200); }
  K.$$('[data-sc]', root).forEach(function (b) {
    b.addEventListener('click', function () {
      sc = b.dataset.sc; K.$$('[data-sc]', root).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      run(!visible);
    });
  });
  K.$$('[data-svc]', root).forEach(function (b) {
    b.addEventListener('click', function () {
      var k = b.dataset.svc; on[k] = !on[k]; b.setAttribute('aria-pressed', String(on[k]));
      run(!visible);
    });
  });
  K.$('[data-run]', root).addEventListener('click', function () { run(false); });
  var rt = 0;
  window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { lay(); run(true); }, 140); });
  run(true);
  return {
    start: function (first) { visible = true; lay(); run(K.reduce); },
    stop: function () { visible = false; clear(); }
  };
});
