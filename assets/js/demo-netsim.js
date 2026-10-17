/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* Networks page: a sample office network carrying live traffic. Staff reach the file server and the internet,
   guests get the internet only, remote staff come in through the VPN and the firewall turns away unasked-for
   traffic from outside. Each safeguard can be switched off to show what slips through; the office size changes
   access points, ports and traffic. Hover or focus a device for what it does. */
TN.demo('netsim', function (root, K) {
  var map = K.$('.nsm-map', root), svg = K.$('.nsm-svg', root), logEl = K.$('.nsm-log', root), clockEl = K.$('[data-clock]', root);
  var play = K.$('[data-play]', root), playTxt = K.$('[data-play] span', root);
  var KP = {}; K.$$('[data-k]', root).forEach(function (n) { KP[n.dataset.k] = n; });
  var NODE = {}; K.$$('.nsm-n', root).forEach(function (n) { NODE[n.dataset.n] = n; });
  var POS_H = { home: [.1, .16], net: [.1, .5], scan: [.1, .84], fw: [.33, .5], sw: [.56, .5], srv: [.87, .15], prn: [.87, .39], staff: [.87, .64], guest: [.62, .87] };
  // narrow maps stack it: outside on top, firewall and switch down the middle, the office below
  var POS_V = { home: [.17, .09], net: [.5, .09], scan: [.83, .09], fw: [.5, .33], sw: [.5, .53], srv: [.15, .75], prn: [.37, .93], staff: [.85, .75], guest: [.63, .93] };
  var POS = POS_H, VERT = false;
  var EDGES = [['home', 'fw', 'vpn'], ['net', 'fw'], ['scan', 'fw'], ['fw', 'sw'], ['sw', 'srv'], ['sw', 'prn'], ['sw', 'staff'], ['sw', 'guest']];
  var G = { guest: true, vpn: true, fw: true }, size = 25, paused = false, visible = false, mins = 0;
  var BLUE = '#3167CA', GREY = '#8A93A8', GREEN = '#137A4A', RED = '#D2433B', AMBER = '#B87700';
  var FLOWS = [
    { k: 'staffSrv', w: 3, r: ['staff', 'sw', 'srv'] },
    { k: 'staffNet', w: 2.2, r: ['staff', 'sw', 'fw', 'net'] },
    { k: 'print', w: .9, r: ['staff', 'sw', 'prn'] },
    { k: 'guestNet', w: 2, r: ['guest', 'sw', 'fw', 'net'] },
    { k: 'guestSrv', w: 1.3, r: ['guest', 'sw', 'srv'], gate: 'guest', stop: 'sw' },
    { k: 'remote', w: 1.3, r: ['home', 'fw', 'sw', 'srv'], gate: 'vpn', stop: 'fw' },
    { k: 'scan', w: 1.4, r: ['scan', 'fw', 'sw', 'srv'], gate: 'fw', stop: 'fw' }
  ];
  var W = 1, H = 1, geo = {}, packets = [], spawnAt = 0, lastLog = {}, stats = { blk: 0 };

  // ---------------------------------------------------------------- layout: node positions and edge paths
  function P(id) { return [POS[id][0] * W, POS[id][1] * H]; }
  function legPts(a, b) {
    var A = P(a), B = P(b);
    if (VERT) { if (Math.abs(A[0] - B[0]) < 2) return [A, B]; var my = (A[1] + B[1]) / 2; return [A, [A[0], my], [B[0], my], B]; }
    if (Math.abs(A[1] - B[1]) < 2) return [A, B];
    var mx = a === 'sw' || b === 'sw' ? (a === 'sw' ? A[0] + (B[0] - A[0]) * .42 : B[0] + (A[0] - B[0]) * .42) : (A[0] + B[0]) / 2;
    if (b === 'guest' || a === 'guest') return a === 'guest' ? [A, [A[0], B[1]], B] : [A, [B[0], A[1]], B];
    return [A, [mx, A[1]], [mx, B[1]], B];
  }
  function layout() {
    W = map.clientWidth; VERT = W < 560; POS = VERT ? POS_V : POS_H; root.classList.toggle('nsm-vert', VERT);
    H = map.clientHeight; svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H); svg.textContent = '';
    Object.keys(POS).forEach(function (id) { NODE[id].style.left = (POS[id][0] * 100) + '%'; NODE[id].style.top = (POS[id][1] * 100) + '%'; });
    geo = {};
    EDGES.forEach(function (e) {
      var pts = legPts(e[0], e[1]); geo[e[0] + '>' + e[1]] = pts;
      var p = svg.appendChild(K.svg('path', { d: K.path(pts, 10), 'class': 'nsm-e' + (e[2] ? ' nsm-e--vpn' : '') }));
      if (e[2]) p.dataset.vpn = '1';
    });
    packets.forEach(function (p) { svg.appendChild(p.n); p.track = K.track(K.path(route(p.ids), 10), 2); });
    paintGuards();
  }
  function route(ids) {
    var pts = [];
    for (var i = 0; i < ids.length - 1; i++) {
      var f = geo[ids[i] + '>' + ids[i + 1]], seg = f ? f.slice() : geo[ids[i + 1] + '>' + ids[i]].slice().reverse();
      pts = pts.concat(i ? seg.slice(1) : seg);
    }
    return pts;
  }

  // ---------------------------------------------------------------- traffic
  function hhmm() { var h = 9 + Math.floor(mins / 60), m = mins % 60; return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m; }
  function say(k, txt, c, gap) {
    var now = performance.now(); if (lastLog[k] && now - lastLog[k] < (gap || 2600)) return; lastLog[k] = now;
    K.log(logEl, '<i style="--c:' + c + '"></i><span><b>' + hhmm() + '</b> ' + txt + '</span>', null, 5);
  }
  function pick() {
    var tot = 0; FLOWS.forEach(function (f) { tot += f.w; }); var x = Math.random() * tot;
    for (var i = 0; i < FLOWS.length; i++) { x -= FLOWS[i].w; if (x <= 0) return FLOWS[i]; }
    return FLOWS[0];
  }
  function spawn() {
    var f = pick(), open = !f.gate || G[f.gate], ids = f.r, c = BLUE, end = 'ok';
    if (f.k === 'guestNet') c = GREY;
    if (f.k === 'remote') c = GREEN;
    if (f.gate) {
      if (open) {
        if (f.k === 'guestSrv' || f.k === 'scan') { ids = f.r.slice(0, f.r.indexOf(f.stop) + 1); c = RED; end = 'block'; }
      } else {
        if (f.k === 'remote') { ids = f.r.slice(0, f.r.indexOf(f.stop) + 1); c = AMBER; end = 'nogo'; }
        else { c = f.k === 'scan' ? RED : AMBER; end = 'breach'; }
      }
    }
    var n = svg.appendChild(K.svg('circle', { r: 5, 'class': 'nsm-p', fill: c }));
    var pts = route(ids);
    packets.push({ f: f, ids: ids, n: n, end: end, t0: performance.now(), track: K.track(K.path(pts, 10), 2) });
  }
  function arrive(p) {
    var last = NODE[p.ids[p.ids.length - 1]], f = p.f;
    if (p.end === 'block') {
      stats.blk++; K.count(KP.blk, stats.blk, 200); K.restart(last, 'is-hit');
      if (f.k === 'guestSrv') say('guestSrv', 'Guest phone tried the file server · stopped at the guest network', RED);
      else say('scan', 'Firewall turned away a scan from outside', RED);
    } else if (p.end === 'nogo') {
      K.restart(last, 'is-warn'); say('remote-no', 'Remote staff can’t get in · no VPN', AMBER);
    } else if (p.end === 'breach') {
      K.restart(last, 'is-warn');
      if (f.k === 'guestSrv') say('guestSrv-b', 'A guest device reached the file server', AMBER, 2000);
      else say('scan-b', 'A scan from outside reached the file server', RED, 2000);
    } else {
      K.restart(last, 'is-ping');
      if (f.k === 'remote') say('remote', 'Remote staff signed in through the VPN', GREEN, 5200);
      else if (f.k === 'staffSrv') say('staff', 'Staff opened files on the server', BLUE, 6000);
      else if (f.k === 'print') say('print', 'Print job sent to the printer', BLUE, 7000);
    }
  }
  var loop = K.loop(function (now, dt) {
    if (!paused && now >= spawnAt) { spawn(); spawnAt = now + 900 - size * 5; }
    packets = packets.filter(function (p) {
      var s = (now - p.t0) / 1000 * 260;
      if (s >= p.track.len) { p.n.remove(); arrive(p); return false; }
      var pt = K.trackAt(p.track, s); p.n.setAttribute('cx', pt.x.toFixed(1)); p.n.setAttribute('cy', pt.y.toFixed(1));
      return true;
    });
  });
  var tick = 0;
  function clockRun() { clearInterval(tick); tick = 0; if (visible && !paused && !K.reduce) tick = setInterval(function () { mins++; clockEl.textContent = hhmm(); }, 2000); }

  // ---------------------------------------------------------------- safeguards, size, readouts
  function paintGuards() {
    root.classList.toggle('nsm-g-off', !G.guest); root.classList.toggle('nsm-v-off', !G.vpn); root.classList.toggle('nsm-f-off', !G.fw);
    NODE.guest.classList.toggle('is-risk', !G.guest); NODE.fw.classList.toggle('is-risk', !G.fw); NODE.home.classList.toggle('is-risk', !G.vpn);
    K.$('[data-gtag]', root).textContent = G.guest ? 'Internet only' : 'On the staff network';
    K.$$('.nsm-e--vpn', svg).forEach(function (e) { e.classList.toggle('is-off', !G.vpn); });
  }
  function readouts(dur) {
    var aps = size === 10 ? 1 : size === 25 ? 2 : 4, dev = size + Math.round(size * .6) + Math.round(size / 5) + 3, ports = size + aps + 1 + 6;
    K.$('[data-aps]', root).textContent = aps + (aps > 1 ? ' access points' : ' access point');
    K.$('[data-ports]', root).textContent = ports + ' ports in use';
    K.count(KP.dev, dev, dur); K.count(KP.ap, aps + 1, dur); K.count(KP.ports, ports, dur);
  }
  var TIP = {
    home: function () { return ['Home office', G.vpn ? 'Comes in through the VPN, encrypted' : 'No VPN: can’t reach office systems']; },
    net: function () { return ['Internet', 'Main line with a backup line']; },
    scan: function () { return ['Outside traffic', G.fw ? 'Turned away by the firewall' : 'Firewall rules off: it gets through']; },
    fw: function () { return ['Firewall', 'Checks everything that crosses into the office']; },
    sw: function () { return ['Office switch', K.$('[data-ports]', root).textContent + ' · staff, guest and device networks']; },
    srv: function () { return ['File server', G.guest ? 'Reached by staff and VPN users only' : 'Guests can reach it too']; },
    prn: function () { return ['Printer', 'On its own network segment']; },
    staff: function () { return ['Staff Wi-Fi', K.$('[data-aps]', root).textContent + ' · placed for coverage']; },
    guest: function () { return ['Guest Wi-Fi', G.guest ? 'Internet only, kept apart from staff' : 'On the staff network: can see the server']; }
  };
  var tip = K.tip(map);
  Object.keys(NODE).forEach(function (id) {
    var n = NODE[id];
    function show() { var b = K.box(n, map); tip.show(TIP[id](), b.cx, b.y - 4); }
    n.addEventListener('pointerenter', show); n.addEventListener('focus', show); n.addEventListener('click', show);
    n.addEventListener('pointerleave', function () { tip.hide(); }); n.addEventListener('blur', function () { tip.hide(); });
  });
  var GUARD_MSG = {
    guest: [['Guest Wi-Fi kept apart again', GREEN], ['Guest Wi-Fi joined the staff network', AMBER]],
    vpn: [['VPN switched on for remote staff', GREEN], ['VPN switched off', AMBER]],
    fw: [['Firewall rules switched on', GREEN], ['Firewall rules switched off', RED]]
  };
  K.$$('[data-g]', root).forEach(function (b) {
    b.addEventListener('click', function () {
      var g = b.dataset.g; G[g] = !G[g]; b.setAttribute('aria-pressed', String(G[g]));
      var m = GUARD_MSG[g][G[g] ? 0 : 1]; lastLog['g' + g] = 0; say('g' + g, m[0], m[1], 0);
      paintGuards();
    });
  });
  K.$$('[data-size]', root).forEach(function (b) {
    b.addEventListener('click', function () {
      size = +b.dataset.size; K.$$('[data-size]', root).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      readouts(300); say('size', 'Office set for ' + size + ' people', BLUE, 0);
    });
  });
  function setPaused(p) {
    paused = p; root.classList.toggle('is-paused', p);
    playTxt.textContent = p ? 'Play' : 'Pause'; play.setAttribute('aria-label', p ? 'Play the traffic' : 'Pause the traffic');
    clockRun();
  }
  play.addEventListener('click', function () { setPaused(!paused); });
  var rt = 0;
  window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(layout, 140); });
  if (K.reduce) root.classList.add('is-static');
  layout(); readouts(0); clockEl.textContent = hhmm();
  say('start', 'Network up · staff, guest and device networks', BLUE, 0);
  return {
    start: function () { visible = true; layout(); spawnAt = 0; loop.on(); clockRun(); },
    stop: function () { visible = false; loop.off(); clockRun(); }
  };
});
