/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* AI chatbots page: an omnichannel inbox simulator. WhatsApp, website chat and email feed one
   inbox; the bot classifies each message (order status, quotation, support, booking, other), answers
   from Odoo records (sales order and delivery, knowledge articles, free appointment slots) or hands
   the conversation to a person with the context attached. Each conversation has a reply timer; the
   meter counts bot-answered against handed-off. Filter by channel, start a chat from any intent,
   or make the customer ask for a human. Sample conversations, sped up. */
TN.demo('inbox', function (root, K) {
  var itemsEl = K.$('.obx-items', root), msgsEl = K.$('.obx-msgs', root), phone = K.$('.obx-phone', root), tpl = K.$('template.obx-ico', root);
  var P = {}; K.$$('[data-p]', phone).forEach(function (n) { P[n.dataset.p] = n; });
  var KP = {}; K.$$('[data-k]', root).forEach(function (n) { KP[n.dataset.k] = n; });
  var BR = {}; K.$$('.obx-br li', root).forEach(function (n) { BR[n.dataset.in] = n; });
  var humanBtn = K.$('[data-human]', root), bars = K.$$('.obx-bar i', root), trunk = K.$('.obx-br', root);
  function ico(n) { var s = tpl && tpl.content.querySelector('[data-i="' + n + '"] svg'); return s ? s.cloneNode(true) : K.el('i'); }

  var CH = { wa: ['WhatsApp', 'Business number'], web: ['Website chat', 'Chat widget'], mail: ['Email', 'Shared inbox'] };
  var INT = { order: 'Order status', quote: 'Quotation', support: 'Support issue', booking: 'Booking', other: 'Other' };
  var AG = { order: ['Mei', 'Service'], quote: ['Arjun', 'Sales'], support: ['Mei', 'Service'], booking: ['Mei', 'Service'], other: ['Farah', 'Team inbox'] };
  var WHY = { quote: 'Needs a quotation from Sales', support: 'The approved answer did not solve it', other: 'No approved answer', order: 'Customer asked for a person', booking: 'Customer asked for a person' };
  var PEOPLE = ['Daniel Lim', 'Aisha Rahman', 'Wei Ling Tan', 'Marco Santos', 'Priya Nair', 'Hendra Wijaya', 'Grace Ong', 'Ravi Kumar', 'Maria Reyes', 'Jun Hao Lee'];
  var SIMX = 12, SLA = 300;                                             // a reply-time target of 5:00, run 12 times faster
  // a conversation script: [who, text, wait before (ms), extra]; who: c customer, b bot, a agent, s system, hand, end
  function plan(kind, p, n) {
    var f = p.split(' ')[0], so = 'S00' + (231 + n), tk = 1042 + n, ag = AG[kind][0];
    if (kind === 'order') return [
      ['c', 'Hi, where is my order ' + so + '?', 300, { cls: 1, ent: 'Order ' + so }],
      ['s', 'Looked up ' + so + ' in Odoo', 800, { rec: ['sale', 'Sales order ' + so, [['Status', 'Confirmed, invoiced'], ['Delivery', 'WH/OUT/00' + (417 + n) + ' · done 09:12'], ['Carrier', 'Out for delivery']]] }],
      ['b', 'Your order ' + so + ' left our warehouse at 9:12 this morning. The carrier shows it out for delivery, due today between 2 and 6 pm.', 400],
      ['c', 'Great, thanks!', 2600],
      ['b', 'You’re welcome, ' + f + '. Anything else I can help with?', 500],
      ['end', 'bot', 2400]];
    if (kind === 'quote') return [
      ['c', 'Can I get a quote for 40 ErgoPro office chairs?', 300, { cls: 1, ent: '40 ErgoPro chairs' }],
      ['b', 'Happy to help. What’s the delivery address, and do you need assembly?', 700],
      ['c', 'Jurong East, with assembly please.', 2800],
      ['s', 'Lead created in Odoo CRM', 600, { rec: ['crm', 'Lead · 40 ErgoPro chairs', [['Contact', p], ['Needs', '40 chairs, assembly, Jurong East'], ['Team', 'Sales · Arjun']]] }],
      ['b', 'Thanks, ' + f + '. I’ve passed this to our sales team with the details, and they’ll send you a formal quotation.', 500],
      ['hand', '', 500],
      ['a', 'Hi ' + f + ', Arjun from Sales. I’ll send the quotation for 40 chairs with assembly this afternoon.', 9000],
      ['end', 'person', 2600]];
    if (kind === 'support' && n % 2) return [
      ['c', 'My P-200 printer shows error E4 after I changed the paper.', 300, { cls: 1, ent: 'P-200 · error E4' }],
      ['s', 'Found an approved answer', 800, { rec: ['knowledge', 'P-200 troubleshooting', [['Article', 'Error E4: paper sensor'], ['Section', '3.2'], ['Source', 'Approved manual']]] }],
      ['b', 'E4 means the paper sensor is blocked. Open tray 2, take out any loose sheet and close it firmly. (P-200 guide, 3.2)', 400],
      ['c', 'That fixed it, thanks!', 3000],
      ['b', 'Glad it\u2019s working again, ' + f + '. Just message here if it comes back.', 500],
      ['end', 'bot', 2400]];
    if (kind === 'support') return [
      ['c', 'My P-200 printer shows error E4 after I changed the paper.', 300, { cls: 1, ent: 'P-200 · error E4' }],
      ['s', 'Found an approved answer', 800, { rec: ['knowledge', 'P-200 troubleshooting', [['Article', 'Error E4: paper sensor'], ['Section', '3.2'], ['Source', 'Approved manual']]] }],
      ['b', 'E4 means the paper sensor is blocked. Open tray 2, take out any loose sheet and close it firmly. (P-200 guide, 3.2)', 400],
      ['c', 'Done that, still E4.', 3200],
      ['s', 'Helpdesk ticket ' + tk + ' opened', 600, { rec: ['helpdesk', 'Ticket ' + tk + ' · P-200 error E4', [['Team', 'Service'], ['Priority', 'High'], ['Attached', 'This conversation']]] }],
      ['b', 'Sorry about that. I’ve opened ticket ' + tk + ' and a service agent will take it from here.', 500],
      ['hand', '', 500],
      ['a', 'Hi ' + f + ', Mei here. I can see the steps you tried. Can I call you in ten minutes to check the sensor?', 9500],
      ['end', 'person', 2600]];
    if (kind === 'booking') return [
      ['c', 'Can I book an aircon service for next week?', 300, { cls: 1, ent: 'Aircon service' }],
      ['s', 'Read free slots in Odoo', 800, { rec: ['appointment', 'Aircon service · 1 hour', [['Tuesday', '10:00'], ['Wednesday', '14:00'], ['Friday', '09:00']]] }],
      ['b', 'Next week I can offer Tuesday 10:00, Wednesday 14:00 or Friday 09:00. Which suits you?', 400],
      ['c', 'Wednesday 2 pm, please.', 2800],
      ['s', 'Appointment booked in Odoo', 600, { rec: ['appointment', 'Booked · Wednesday 14:00', [['Service', 'Aircon, 1 hour'], ['Address', 'From the customer record'], ['Reminder', 'The day before']]] }],
      ['b', 'Done: Wednesday at 14:00 is booked. You’ll get a reminder the day before.', 400],
      ['end', 'bot', 2400]];
    return [
      ['c', 'Do you sponsor community events?', 300, { cls: 1 }],
      ['b', 'I don’t have an approved answer for that, so I’ll pass you to the team.', 1000],
      ['hand', '', 500],
      ['a', 'Hi ' + f + ', Farah here. Tell me a little about the event and I’ll check with the right person.', 9000],
      ['end', 'person', 2600]];
  }

  // ---------------------------------------------------------------- conversations
  var convs = [], sel = null, chFilter = 'all', seq = 0, stats = { bot: 0, hand: 0, fbot: [], fag: [] }, routed = {};
  function mk(ch, kind, now, done) {
    var who = PEOPLE[seq % PEOPLE.length], c = { id: ++seq, ch: ch, kind: kind, who: who, first: who.split(' ')[0], steps: plan(kind, who, seq), i: 0, msgs: [], state: 'bot', next: now + 600, typing: false };
    c.el = item(c); convs.unshift(c); itemsEl.insertBefore(c.el, itemsEl.firstChild);
    routed[kind] = (routed[kind] || 0) + 1;
    if (done) { while (c.i < c.steps.length) run(c, now, true); }
    trim(); filter(); return c;
  }
  function trim() {
    while (convs.length > 7) {
      var old = null; for (var i = convs.length - 1; i >= 0; i--) if (convs[i].state === 'done' && convs[i] !== sel) { old = convs[i]; break; }
      if (!old) break; old.el.remove(); convs.splice(convs.indexOf(old), 1);
    }
  }
  function item(c) {
    var b = K.el('button', 'obx-item obx-item--' + c.ch); b.type = 'button'; b.setAttribute('aria-pressed', 'false');
    var av = b.appendChild(K.el('span', 'obx-av')); av.appendChild(ico(c.ch));
    var t = b.appendChild(K.el('span', 'obx-it'));
    var top = t.appendChild(K.el('span', 'obx-top')); top.appendChild(K.el('b', null, c.who)); c.slaEl = top.appendChild(K.el('em', 'obx-sla'));
    c.snipEl = t.appendChild(K.el('span', 'obx-snip', '…'));
    var tags = t.appendChild(K.el('span', 'obx-tags')); c.intEl = tags.appendChild(K.el('i', 'obx-int', INT[c.kind])); c.stEl = tags.appendChild(K.el('i', 'obx-st', 'Bot'));
    b.addEventListener('click', function () { touched = true; select(c); });
    return b;
  }
  function status(c) {
    var s = c.state === 'bot' ? ['Bot', 'is-bot'] : c.state === 'wait' ? ['Waiting for ' + c.agent, 'is-wait'] : c.state === 'agent' ? [c.agent + ' · ' + c.team, 'is-agent'] : [c.out === 'bot' ? 'Resolved by bot' : 'Resolved by ' + c.agent, 'is-done'];
    c.stEl.textContent = s[0]; c.stEl.className = 'obx-st ' + s[1]; c.el.classList.toggle('is-done', c.state === 'done');
  }
  function mmss(sec) { sec = Math.max(0, Math.round(sec)); return (sec / 60 | 0) + ':' + ('0' + sec % 60).slice(-2); }
  function slaText(c, now) {
    if (c.state === 'wait') { var left = SLA - (now - c.handAt) / 1000 * SIMX; return left >= 0 ? ['reply due ' + mmss(left), left < 60 ? 'is-warn' : 'is-wait'] : ['late ' + mmss(-left), 'is-late']; }
    if (c.agentIn != null) return ['agent ' + mmss(c.agentIn), 'is-ok'];
    if (c.botIn != null) return ['bot ' + (c.botIn / 1000).toFixed(1) + ' s', 'is-ok'];
    return c.msgs.length ? ['new', 'is-new'] : ['', ''];
  }
  // run the next step of a conversation (quiet = history, drawn without animation or delays)
  function run(c, now, quiet) {
    var s = c.steps[c.i]; if (!s) return;
    var who = s[0], x = s[3] || {};
    if ((who === 'b' || who === 'a') && !c.typing && !quiet) { c.typing = who; c.next = now + (c.ch === 'mail' ? 1100 : 850); if (c === sel) typing(c); return; }
    c.typing = false; c.i++;
    if (who === 'end') { c.state = 'done'; c.out = s[1]; if (s[1] === 'bot') stats.bot++; status(c); }
    else if (who === 'hand') {
      c.state = 'wait'; c.handAt = now; c.agent = AG[c.kind][0]; c.team = AG[c.kind][1]; stats.hand++;
      c.msgs.push({ w: 'h', t: 'Handed to ' + c.team + ' · ' + c.agent, x: { req: !!x.req } });
      status(c);
    } else {
      c.msgs.push({ w: who, t: s[1], x: x, n: c.msgs.length });
      if (who === 'b' && c.botIn == null && c.cAt != null) { c.botIn = quiet ? 900 + c.id * 137 % 700 : now - c.cAt; stats.fbot.push(c.botIn); }
      if (who === 'a' && c.agentIn == null) { c.agentIn = quiet ? 70 + c.id * 53 % 110 : (now - c.handAt) / 1000 * SIMX; stats.fag.push(c.agentIn); c.state = 'agent'; status(c); }
      if (who === 'c' && c.cAt == null) c.cAt = now;
      if (who !== 's') c.snipEl.textContent = (who === 'c' ? '' : who === 'b' ? 'Bot: ' : c.agent + ': ') + s[1];
      if (who === 'c' && x.cls && c === sel && !quiet) route(x.human ? 'human' : c.kind, true);
    }
    var nx = c.steps[c.i]; c.next = now + (nx ? nx[2] : 0);
    if (c === sel) { if (quiet) paint(c); else add(c, c.msgs[c.msgs.length - 1], who); header(c); }
    kpis();
  }

  // ---------------------------------------------------------------- the phone
  function msgEl(c, m) {
    var e;
    if (m.w === 's') {
      e = K.el('div', 'obx-sys'); var ch = e.appendChild(K.el('p', 'obx-sysl')); ch.appendChild(ico(m.x.rec && m.x.rec[0] === 'knowledge' ? 'search' : 'check')); ch.appendChild(document.createTextNode(m.t));
      if (m.x.rec) {
        var r = e.appendChild(K.el('div', 'obx-rec')), h = r.appendChild(K.el('p', 'obx-rech'));
        h.innerHTML = K.oi(m.x.rec[0], 16); h.appendChild(K.el('b', null, m.x.rec[1]));
        var dl = r.appendChild(K.el('dl')); m.x.rec[2].forEach(function (q) { var d = dl.appendChild(K.el('div')); d.appendChild(K.el('dt', null, q[0])); d.appendChild(K.el('dd', null, q[1])); });
      }
      return e;
    }
    if (m.w === 'h') {
      e = K.el('div', 'obx-hand'); var hh = e.appendChild(K.el('p', 'obx-handh')); hh.appendChild(ico('users')); hh.appendChild(K.el('b', null, m.t));
      var ul = e.appendChild(K.el('ul'));
      var ctx = ['Transcript, ' + c.msgs.filter(function (q) { return q.w === 'c' || q.w === 'b'; }).length + ' messages', 'Intent: ' + INT[c.kind] + (c.steps[0][3] && c.steps[0][3].ent ? ' · ' + c.steps[0][3].ent : ''), 'Customer record: ' + c.who, 'Why: ' + (m.x.req ? 'Customer asked for a person' : WHY[c.kind])];
      ctx.forEach(function (t) { var li = ul.appendChild(K.el('li')); li.appendChild(ico('check')); li.appendChild(document.createTextNode(t)); });
      var d = e.appendChild(K.el('p', 'obx-handd')); d.appendChild(ico('clock')); d.appendChild(document.createTextNode('Reply target 5:00 · the timer starts now'));
      return e;
    }
    e = K.el('div', 'obx-m obx-m--' + m.w);
    if (c.ch === 'mail') e.appendChild(K.el('p', 'obx-from', m.w === 'c' ? 'From ' + c.who : m.w === 'b' ? 'Reply from the assistant' : 'Reply from ' + c.agent + ', ' + c.team));
    else if (m.w !== 'c') e.appendChild(K.el('p', 'obx-from', m.w === 'b' ? 'Assistant' : c.agent + ' · ' + c.team));
    e.appendChild(K.el('p', 'obx-mt', m.t));
    return e;
  }
  function paint(c) {
    msgsEl.textContent = ''; c.msgs.forEach(function (m) { msgsEl.appendChild(msgEl(c, m)); });
    if (c.typing) typing(c);
  }
  function add(c, m, who) {
    K.$$('.obx-typing', msgsEl).forEach(function (t) { t.remove(); });
    if (!m) return;
    var e = msgEl(c, m); e.classList.add('is-new'); msgsEl.appendChild(e);
    var all = msgsEl.children; while (all.length > 14) all[0].remove();
  }
  function typing(c) {
    if (K.$('.obx-typing', msgsEl)) return;
    var t = K.el('div', 'obx-typing obx-m--' + c.typing);
    if (c.ch === 'mail') t.appendChild(K.el('span', null, c.typing === 'b' ? 'Assistant is drafting a reply' : c.agent + ' is writing'));
    else { t.appendChild(K.el('i')); t.appendChild(K.el('i')); t.appendChild(K.el('i')); }
    msgsEl.appendChild(t);
  }
  function header(c) {
    phone.dataset.ch = c.ch;
    P.av.textContent = c.who.split(' ').map(function (w) { return w[0]; }).join('').slice(0, 2);
    P.name.textContent = c.who; P.ch.textContent = ''; P.ch.appendChild(ico(c.ch));
    var sub = c.state === 'wait' ? 'Waiting for ' + c.agent : CH[c.ch][0] + ' · ' + (c.state === 'bot' ? 'assistant answering' : c.state === 'agent' ? c.agent + ', ' + c.team : 'resolved');
    P.sub.textContent = sub;
    P.comp.textContent = c.ch === 'mail' ? 'Reply to ' + c.first : 'Message';
    var busy = c.state === 'wait' || c.state === 'agent' || c.human;
    humanBtn.disabled = busy; humanBtn.title = busy ? 'This conversation is already with a person' : '';
  }
  function select(c) {
    sel = c;
    convs.forEach(function (x) { x.el.setAttribute('aria-pressed', String(x === c)); });
    paint(c); header(c); route(c.human ? 'human' : c.kind, false);
  }

  // ---------------------------------------------------------------- routing tree, meter, KPIs
  var routeT = 0;
  function route(kind, pulse) {
    var li = BR[kind]; if (!li) return;
    Object.keys(BR).forEach(function (k) { BR[k].classList.toggle('is-on', k === kind); });
    trunk.style.setProperty('--y', (li.offsetTop + li.offsetHeight / 2).toFixed(0) + 'px');
    if (pulse && !K.reduce) { K.restart(trunk, 'is-flow'); K.restart(li, 'is-ping'); clearTimeout(routeT); routeT = setTimeout(function () { trunk.classList.remove('is-flow'); }, 900); }
  }
  function avg(a) { return a.reduce(function (s, v) { return s + v; }, 0) / (a.length || 1); }
  function kpis() {
    var open = convs.filter(function (c) { return c.state !== 'done'; }).length;
    KP.open.textContent = open + ' open';
    KP.live.textContent = String(convs.filter(function (c) { return c.state === 'bot'; }).length);
    KP.wait.textContent = String(convs.filter(function (c) { return c.state === 'wait'; }).length);
    KP.fbot.textContent = stats.fbot.length ? (avg(stats.fbot) / 1000).toFixed(1) + ' s' : '–';
    KP.fag.textContent = stats.fag.length ? mmss(avg(stats.fag)) : '–';
    var tot = stats.bot + stats.hand;
    KP.bot.textContent = String(stats.bot); KP.hand.textContent = String(stats.hand);
    KP.pct.textContent = tot ? Math.round(stats.bot / tot * 100) + '% answered by the bot' : '–';
    bars[0].style.flexGrow = String(stats.bot || .0001); bars[1].style.flexGrow = String(stats.hand || .0001);
    Object.keys(BR).forEach(function (k) { var n = K.$('.obx-n', BR[k]); var v = k === 'human' ? routed.human || 0 : routed[k] || 0; n.textContent = v ? String(v) : ''; });
  }
  function filter() {
    convs.forEach(function (c) { c.el.hidden = chFilter !== 'all' && c.ch !== chFilter; });
  }
  function ticks(now) { convs.forEach(function (c) { var s = slaText(c, now); if (c.slaEl.textContent !== s[0]) c.slaEl.textContent = s[0]; c.slaEl.className = 'obx-sla ' + s[1]; }); if (sel && sel.state === 'wait') P.sub.textContent = 'Waiting for ' + sel.agent + ' · ' + slaText(sel, now)[0]; }

  // ---------------------------------------------------------------- the clock: steps, arrivals, timers
  var ARR = [['web', 'booking'], ['wa', 'order'], ['web', 'quote'], ['mail', 'order'], ['wa', 'support'], ['web', 'order'], ['wa', 'booking'], ['mail', 'other'], ['web', 'support'], ['mail', 'booking']];
  var arr = 0, nextArr = 0, lastTick = 0, touched = false, off = 0, pauseAt = 0;
  function clock() { return (pauseAt || performance.now()) - off; }
  var loop = K.loop(function (real) {
    var now = real - off;
    convs.slice().forEach(function (c) { var g = 0; while (c.state !== 'done' && c.i < c.steps.length && now >= c.next && g++ < 3) run(c, now, false); });
    if (now >= nextArr) { var a = ARR[arr++ % ARR.length]; mk(a[0], a[1], now); nextArr = now + 11000; }
    if (now - lastTick > 250) { lastTick = now; ticks(now); }
  });
  function start(kind) {
    var ch = chFilter !== 'all' ? chFilter : sel ? sel.ch : 'wa', now = clock();
    var c = mk(ch, kind, now); c.next = now + 250; select(c); nextArr = Math.max(nextArr, now + 7000);
    if (K.reduce) finish();
  }
  K.$$('[data-start]', root).forEach(function (b) { b.addEventListener('click', function () { touched = true; start(b.dataset.start); }); });
  humanBtn.addEventListener('click', function () {
    if (!sel || humanBtn.disabled) return; touched = true;
    var c = sel, now = clock(), f = c.first, ag = AG[c.kind][0];
    var add2 = [['c', 'Can I talk to a person, please?', 300, { cls: 1, human: 1 }],
      ['b', 'Of course. I’m passing you to the team now with this conversation, so you won’t need to repeat anything.', 700],
      ['hand', '', 500, { req: 1 }],
      ['a', 'Hi ' + f + ', ' + ag + ' here. I’ve read the chat, so let’s sort this out.', 8500],
      ['end', 'person', 2600]];
    c.steps = c.steps.slice(0, c.i).filter(function (s) { return s[0] !== 'end'; }).concat(add2); c.i = Math.min(c.i, c.steps.length - add2.length);
    if (c.state === 'done') { if (c.out === 'bot') stats.bot--; c.state = 'bot'; status(c); }
    c.human = true; c.typing = false; c.next = now + 200; routed.human = (routed.human || 0) + 1;
    K.$$('.obx-typing', msgsEl).forEach(function (t) { t.remove(); });
    header(c); kpis(); if (K.reduce) finish();
  });
  K.$$('[data-ch]', root).forEach(function (b) {
    b.addEventListener('click', function () {
      touched = true; chFilter = b.dataset.ch;
      K.$$('[data-ch]', root).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      filter();
      if (chFilter !== 'all' && (!sel || sel.ch !== chFilter)) { var c = convs.filter(function (x) { return x.ch === chFilter; })[0]; if (c) select(c); else start(['order', 'quote', 'support', 'booking'][seq % 4]); }
    });
  });
  // reduced motion: every running conversation shown complete
  function finish() { var now = clock(); convs.forEach(function (c) { while (c.i < c.steps.length) { c.typing = 'x'; run(c, now, true); } }); if (sel) { paint(sel); header(sel); } ticks(now); kpis(); }

  // opening state: two finished conversations as history, then live ones
  var t0 = clock();
  mk('wa', 'other', t0, true); mk('mail', 'order', t0, true); mk('web', 'booking', t0, true);
  var first = mk('wa', 'order', t0); first.next = t0 + 900;
  var sec = mk('mail', 'support', t0); sec.next = t0 + 3800;
  select(first); kpis();
  return {
    start: function (isFirst) {
      if (K.reduce) { if (isFirst) finish(); return; }
      if (isFirst) { off = 0; pauseAt = 0; var now = clock(); convs.forEach(function (c) { if (c.state !== 'done') c.next = now + (c === first ? 900 : 3800); }); nextArr = now + 7000; }
      if (pauseAt) { off += performance.now() - pauseAt; pauseAt = 0; }
      loop.on();
    },
    stop: function () { if (!pauseAt) pauseAt = performance.now(); loop.off(); }
  };
});
