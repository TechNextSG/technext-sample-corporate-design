/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: sol-auto (/solutions/ai-automation) — "The Sorting Office": AI workflow automation drawn as a bright heritage
   sorting hall on a sunny morning (cream plaster, sage tiles, arched windows, a glazed roof). Every email is a letter.
   The AGENT is a little blue gantry robot on the overhead rail: it lifts each letter from the inbox chute (1 trigger),
   scans it in front of the pigeonhole wall (2 classify: the slot lights and a tag pops), stops at the Odoo record cabinet
   (3 record: a drawer slides out and the record card clips on), feeds the drafting press (4 draft: the rollers turn and
   the prepared document slides down the chute) — then it goes back for the next letter. The draft lands on the APPROVAL
   GATE desk (5): the signal lamp blinks amber, the approver reads it and stamps it, the lamp turns green, the barrier over
   the pneumatic tubes lifts and the document is whisked up the right tube (6 send: vendor, customer or Odoo) and the
   follow-up card drops into the tickler box (7). The RUN LOG tape across the top prints every step with its time.
   Nothing irreversible leaves without the stamp. The red lever is the kill switch: pull it and the whole run pauses.
   The cast: the TechNext consultant (tablet; points out the agent overhead; tap: draws the workflow in the air), the
   reviewer (magnifier over low-confidence items; tap: the giant eye, then LOOKS RIGHT), the TechNext developer (typing,
   tea, watching the tape; tap: a chair spin and a REPLAY sweep along the log), the approver (reads, stamps every draft in
   time with the run; tap: a double stamp, a blow on the stamp, APPROVED held high). Walkers carry boxes, tablets and a
   trolley; the office cat sleeps on the mail sacks. Everything in the scene is a plainly sample illustration. */
(function (K, CR, CO) {
  'use strict';
  if (!K || !CR || !CO) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed, FONT = K.FONT;
  var F = 470, INK = '#1B1F3B', SLATE = '#2F5D6B', SLATE_D = '#1F4450', SLATE_L = '#E3EEF0', BRASS = '#D4A23F', BRASS_D = '#A87A22', BRASS_L = '#F2D58C',
    RED = '#D64A3A', CREAM = '#FBF4E6', SAGE = '#CFE3D6', KRAFT = '#E6CFA3', GREEN = '#1E9E6A', AMBER = '#F2A93B', PUR = '#714B67', BLUE = '#3167CA', WOOD = '#9A6A43', MONO = '800 8.6px ui-monospace, Consolas, monospace';
  var ROOF = -122, CT = -112, TAPE = { y: -102, h: 36 }, HEAD_X = 956, RAIL = -32;
  var CHUTE = 176, BASKET = { x: 140, y: 262, w: 72 }, SORT = { x: 282, y: 50, w: 146, h: 176 }, CAB = { x: 446, y: 158, w: 98 }, MON = { x: 452, y: 84, w: 86, h: 56 };
  var PRESS = { x: 568, y: 96, w: 122, h: 136 }, DESK = { x: 708, y: 374, w: 110 }, POST = 830, RCV = { x: 846, y: 296, w: 104, h: 66 }, TUBES = [864, 898, 932], BEND = [176, 200, 224], FLANGE = 990, TICK = { x: 866, y: 38, w: 92, h: 112 };
  var LANE = { y: 634, h: 56, words: [['IN', -330], ['SORT', 562], ['OUT', 958], ['OUT', 1190]] };
  var GUARD = { x: 700, y: 30, w: 160, h: 100 }, BAR = { x: 830, y: 326 }, WINX = 300, WIN0 = 60;
  var CYC = 12, PAUSE_LEN = 3.2;
  var DOCS = [
    { kind: 'Purchase request', slot: 0, pct: 97, mod: 'Purchase', rec: 'Budget and vendor', l1: 'Budget left', l2: 'Vendor approved', draft: 'Purchase order', dest: 0, sent: 'Sent to the vendor', fol: 'Chase delivery', col: '#FFFFFF', tag: BLUE },
    { kind: 'Customer email', slot: 1, pct: 94, mod: 'Sales', rec: 'Sales order', l1: 'Order found', l2: 'Delivery date', draft: 'Reply', dest: 1, sent: 'Sent to the customer', fol: 'Check the reply', col: '#FFF6E0', tag: GREEN },
    { kind: 'Vendor bill', slot: 2, pct: 96, mod: 'Purchase', rec: 'PO and receipt', l1: 'PO matched', l2: 'Receipt found', draft: 'Bill entry', dest: 2, sent: 'Posted to Odoo', fol: 'Payment run', col: '#EEF4FF', tag: PUR }];
  var DEST = ['VENDOR', 'CUSTOMER', 'ODOO'], SLOTS = ['REQ', 'MAIL', 'BILL', 'HELP', 'MISC'];
  function setU(g, sx, sy, k) { g.translate(sx, sy); g.scale(k, k); }
  function extOf(W, H, k, sx, sy) { return { l: -(sx + 24) / k, r: (W - sx) / k, t: -(sy + 24) / k, b: (H - sy) / k }; }
  function smooth(u) { return u * u * (3 - 2 * u); }
  function kf(A, u) { if (u <= A[0][0]) return A[0][1]; for (var i = 0; i < A.length - 1; i++) { var a = A[i], b = A[i + 1]; if (u < b[0]) return lerp(a[1], b[1], smooth((u - a[0]) / (b[0] - a[0]))); } return A[A.length - 1][1]; }
  function rrAdd(g, x, y, w, h, r) { if (g.roundRect) g.roundRect(x, y, w, h, r); else g.rect(x, y, w, h); }
  function doc(n) { return DOCS[((n % 3) + 3) % 3]; }
  function tone(c, k) { return K.tone(c, k == null ? 0.22 : k); }

  /* ---------------- the run: one letter every 12 s; the shuttle and the gate overlap (two documents in flight) ---------------- */
  var SX = [[0, 176], [0.13, 176], [0.24, 355], [0.34, 355], [0.44, 495], [0.54, 495], [0.62, 630], [0.68, 630], [0.86, 176], [1, 176]];
  var DROP = [[0, 0], [0.07, 236], [0.13, 100], [0.34, 100], [0.44, 14], [0.54, 14], [0.62, 50], [0.65, 76], [0.68, 50], [0.86, 0], [1, 0]];
  var BARA = [[0, 0], [0.18, 0], [0.24, -1.38], [0.44, -1.38], [0.5, 0], [1, 0]];
  var EV = [[-0.10, 'in'], [0.30, 'cls'], [0.52, 'rec'], [0.80, 'dft'], [0.96, 'wait'], [1.15, 'ok'], [1.38, 'sent'], [1.58, 'fol']];
  var EVCOL = { 'in': BLUE, cls: '#3FA9E0', rec: PUR, dft: BRASS_D, wait: AMBER, ok: GREEN, sent: SLATE, fol: '#E07B12' };
  var WT = { t: 4.2, last: -1, until: -9, at: -9 };
  function wclock(t) { if (WT.last < 0) WT.last = t; var dt = clamp(t - WT.last, 0, 0.1); WT.last = t; if (t >= WT.until) WT.t += dt; return WT.t; }
  function runAt(w) {
    var n = Math.floor(w / CYC), u = w / CYC - n, D = doc(n), drop = kf(DROP, u);
    return { w: w, n: n, u: u, D: D, P: doc(n - 1), N: doc(n + 1), sx: kf(SX, u), cy: 20 + drop, moving: (u > 0.13 && u < 0.24) || (u > 0.34 && u < 0.44) || (u > 0.54 && u < 0.62) || (u > 0.68 && u < 0.86),
      phase: u < 0.07 ? 'grab' : u < 0.24 ? 'carry' : u < 0.34 ? 'scan' : u < 0.44 ? 'carry' : u < 0.56 ? 'record' : u < 0.62 ? 'carry' : u < 0.68 ? 'feed' : u < 0.86 ? 'back' : 'wait', bar: kf(BARA, u) };
  }
  function label(k, D) { return k === 'in' ? 'New email in' : k === 'cls' ? 'Classified: ' + D.kind : k === 'rec' ? 'Record: ' + D.rec : k === 'dft' ? D.draft + ' drafted' : k === 'wait' ? 'Waiting for a person' : k === 'ok' ? 'Approved' : k === 'sent' ? D.sent : 'Follow-up: ' + D.fol; }
  function events(w) {
    var n = Math.floor(w / CYC), out = [];
    for (var m = n + 1; m >= n - 5; m--) { var D = doc(m); for (var i = 0; i < EV.length; i++) { var te = (m + EV[i][0]) * CYC; if (te <= w) out.push({ te: te, k: EV[i][1], D: D }); } }
    out.sort(function (a, b) { return b.te - a.te; }); return out.slice(0, 30);
  }
  function hms(ms) { var d = new Date(ms), p = function (v) { return (v < 10 ? '0' : '') + v; }; return p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds()); }

  /* ---------------- the people ---------------- */
  var W = CR.who;
  var TN = W({ x: 252, y: 470, s: 0.46, ph: 0.3, skin: 1, hair: 0, style: 'bob', outfit: 'cardigan', top: BLUE, top2: '#FFFFFF', hold: 'tablet', hands: [[-56, -214], [60, -190]], look: 0.5 });
  var REV = W({ x: 362, y: 470, s: 0.46, ph: 1.1, skin: 2, hair: 1, style: 'short', outfit: 'shirt', top: '#5FA58A', glasses: true, sit: true, chairCol: '#3A4A5C', id: '#9AA6BC', hands: [[-60, -206], [60, -206]], look: 0.2 });
  var DEV = W({ x: 615, y: 470, s: 0.46, ph: 2.0, skin: 0, hair: 0, style: 'short', outfit: 'polo', top: '#1E3A6E', top2: '#FFFFFF', sit: true, chairCol: '#2A3550', hands: [[-60, -206], [60, -206]], look: 0.5 });
  var APR = W({ x: 763, y: 470, s: 0.47, ph: 2.7, skin: 3, hair: 2, style: 'long', outfit: 'shirt', top: '#C2506A', id: '#9AA6BC', clip: '#F2D58C', hands: [[-60, -200], [60, -200]], look: -0.4 });
  var CREW = [
    { x0: 1150, x1: 1256, y: 492, spd: 13, ph: 0.4, label: 'TechNext developer', lines: ['Access is **scoped** to what each task needs, nothing more.', 'Email, documents, spreadsheets and **Odoo**, joined in one run.'], acts: ['wave', 'id', 'nod'],
      P: W({ s: 0.52, skin: 2, hair: 0, style: 'short', outfit: 'shirt', top: '#14A38B', hold: 'tablet' }) },
    { front: true, x0: -860, x1: -760, y: 700, spd: 16, ph: 0.7, label: 'TechNext consultant', lines: ['Gates loosen only when there\'s **evidence** to.', 'Every month: what it **handled, escalated and corrected**.'], acts: ['nod', 'cheer', 'id'],
      P: W({ s: 0.58, skin: 1, hair: 1, style: 'pony', outfit: 'polo', top: PUR, clip: '#FFD84A', hold: 'clipboard' }) },
    { x0: -862, x1: -770, y: 492, spd: 14, ph: 0.2, label: 'TechNext trainer', lines: ['Map it, automate it, **keep a gate**.', 'Your team learns to read the **run log** on day one.'], acts: ['wave', 'jump', 'id'],
      P: W({ s: 0.52, skin: 0, hair: 1, style: 'bun', outfit: 'cardigan', top: '#E07B12', top2: '#FFFFFF', hold: 'box' }) }
  ];
  /* the supporting cast in the card's corner of the hall: the TechNext mail-room lead at the INWARD frame, and a courier
     (visitor, grey pass) with a hand truck of sacks */
  var SRT = W({ x: -572, y: 548, s: 0.48, ph: 0.9, skin: 0, hair: 0, style: 'pony', outfit: 'shirt', top: '#4C9BE8', glasses: true, hands: [[-20, -280], [40, -300]], look: 0.4 });
  var COU = W({ x: 12, y: 624, s: 0.53, ph: 1.7, skin: 2, hair: 1, style: 'short', outfit: 'polo', top: '#F2A93B', top2: '#FFFFFF', id: '#9AA6BC', hatKind: 'cap', hat: '#2F5D6B', hands: [[-20, -236], [81, -284]], look: 0.3 });
  var RACK = { x: -528, y: 330, w: 54, h: 94 }, TRUCK = { x: 74, y: 618 }, CONV = [{ x0: -420, x1: -200, y: 558, n: 3, sp: 26, ph: 0 }, { x0: 228, x1: 520, y: 564, n: 4, sp: 30, ph: 3.1 }];
  /* below 1400px the card reaches further left: the frame moves into the strip the card leaves open and the lead stands behind the card, facing it */
  function layoutLeft() { var narrow = (window.innerWidth || 1440) < 1400; RACK.x = narrow ? -624 : -528; SRT.x = narrow ? -478 : -572; SRT.side = narrow ? -1 : 1; }
  function slotAt(i) { var c = i % 3, r = Math.floor(i / 3) % 4, cw = (RACK.w - 8) / 3, rh = (RACK.h - 10) / 4; return [RACK.x + 4 + c * cw + cw / 2, RACK.y + 6 + r * rh + rh / 2, cw, rh]; }
  function handAt(P, side) {
    var F3 = K.F3, d = side ? 1 : -1, h = P.hands[side], sxk = P.sx == null ? 1 : P.sx, bw = P.build || 1;
    var r = K.ik(d * F3.shx * bw, F3.shy, h[0], h[1], F3.a, F3.b, d).h, dy = -(P.hop || 0) + (P.sit ? (P.sitDrop != null ? P.sitDrop : 46) : 0);
    return [P.x + r[0] * P.s * sxk, P.y + (r[1] + dy) * P.s];
  }
  function headAt(P) { var dy = -(P.hop || 0) + (P.sit ? (P.sitDrop != null ? P.sitDrop : 46) : 0); return [P.x + P.look * 9 * P.s, P.y + (K.F3.hy + dy) * P.s]; }

  /* ---------------- small painters ---------------- */
  function env(g, x, y, w, h, col, rot, stamp) {
    g.save(); g.translate(x, y); if (rot) g.rotate(rot); fillRR(g, -w / 2, -h / 2, w, h, 2, col || '#FFFFFF');
    g.strokeStyle = 'rgba(60,70,100,.32)'; g.lineWidth = 1; g.beginPath(); g.moveTo(-w / 2 + 1, -h / 2 + 1); g.lineTo(0, h * 0.06); g.lineTo(w / 2 - 1, -h / 2 + 1); g.stroke();
    fillRR(g, w / 2 - 8, -h / 2 + 2, 6, 7, 1, stamp || RED); g.restore();
  }
  function sheet(g, x, y, w, h, rot, head) {
    g.save(); g.translate(x, y); if (rot) g.rotate(rot); fillRR(g, -w / 2, -h / 2, w, h, 1.5, '#FFFFFF'); fillRR(g, -w / 2, -h / 2, w, h * 0.16, 1.5, head || BLUE);
    g.fillStyle = '#C9D3E3'; for (var i = 0; i < 4; i++) g.fillRect(-w / 2 + 3, -h / 2 + h * 0.3 + i * h * 0.15, (i === 3 ? 0.5 : 0.8) * w, Math.max(1, h * 0.06)); g.restore();
  }
  function stampMark(g, x, y, s, a) { g.save(); g.translate(x, y); g.rotate(-0.22); g.scale(s, s); g.globalAlpha = a == null ? 1 : a; g.strokeStyle = RED; g.lineWidth = 2; rr(g, -26, -8, 52, 16, 3); g.stroke(); text(g, 'APPROVED', 0, 3.4, 8.4, 800, RED, 'center'); g.restore(); }
  function star(g, x, y, r, col) { g.fillStyle = col; g.beginPath(); for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, rad = i % 2 ? r * 0.45 : r; g.lineTo(x + Math.cos(a) * rad, y + Math.sin(a) * rad); } g.closePath(); g.fill(); }
  function plate(g, x, y, w, n, lab, col) { fillRR(g, x, y, w, 15, 4, col || SLATE_D); fillE(g, x + 8, y + 7.5, 5.4, 5.4, BRASS); text(g, String(n), x + 8, y + 10.3, 7.4, 800, INK, 'center'); text(g, lab, x + 17, y + 10.6, 7.6, 800, '#FFFFFF'); }
  function rivets(g, x, y, w, h) { g.fillStyle = BRASS_L; [[x + 5, y + 5], [x + w - 5, y + 5], [x + 5, y + h - 5], [x + w - 5, y + h - 5]].forEach(function (p) { g.beginPath(); g.arc(p[0], p[1], 1.8, 0, 7); g.fill(); }); }
  function pot(g, x, y, s, lean) { g.save(); g.translate(x, y); g.scale(s, s); if (lean) g.rotate(lean); K.plant(g, { x: 0, y: 0 }, '#C77D5A', '#D99172'); g.restore(); }
  function sack(g, x, y, w, h, col, lab, ns) {
    if (!ns) soft(g, x + w / 2, y + h, w * 0.55, 5, 0.22); g.fillStyle = col; g.beginPath(); g.moveTo(x + w * 0.1, y + h); g.quadraticCurveTo(x - w * 0.05, y + h * 0.4, x + w * 0.18, y + h * 0.08);
    g.lineTo(x + w * 0.82, y + h * 0.08); g.quadraticCurveTo(x + w * 1.05, y + h * 0.4, x + w * 0.9, y + h); g.closePath(); g.fill();
    fillRR(g, x + w * 0.3, y - h * 0.05, w * 0.4, h * 0.16, 4, tone(col, 0.12)); g.strokeStyle = BRASS_D; g.lineWidth = 2; g.beginPath(); g.moveTo(x + w * 0.28, y + h * 0.1); g.lineTo(x + w * 0.72, y + h * 0.1); g.stroke();
    if (lab) { fillRR(g, x + w * 0.24, y + h * 0.42, w * 0.52, 13, 3, '#FFFFFF'); text(g, lab, x + w / 2, y + h * 0.42 + 9.4, 6.6, 800, SLATE_D, 'center'); }
  }

  /* ---------------- static layers ---------------- */
  function winPath(g, cx, door) { var hw = 84, top = 2, bot = door ? F : 250; g.moveTo(cx - hw, bot); g.lineTo(cx - hw, top + hw); g.arc(cx, top + hw, hw, Math.PI, 0); g.lineTo(cx + hw, bot); g.closePath(); }
  function wins(e) { var out = []; for (var x = Math.floor((e.l - 200) / WINX) * WINX + WIN0; x < e.r + 200; x += WINX) out.push(x); return out; }
  function isDoor(x) { return x === 1260; }
  function paintBg(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    var sg = g.createLinearGradient(0, e.t, 0, 260); sg.addColorStop(0, '#7EC6F4'); sg.addColorStop(0.6, '#BFE4FA'); sg.addColorStop(1, '#EAF7FE'); g.fillStyle = sg; g.fillRect(e.l, e.t, e.r - e.l, e.b - e.t);
    var gl = g.createRadialGradient(1120, -220, 10, 1120, -220, 460); gl.addColorStop(0, 'rgba(255,248,214,.95)'); gl.addColorStop(0.3, 'rgba(255,244,200,.35)'); gl.addColorStop(1, 'rgba(255,244,200,0)'); g.fillStyle = gl; g.fillRect(e.l, e.t, e.r - e.l, 600);
    fillE(g, 1120, -220, 28, 28, '#FFF6D0');
    /* the town beyond the windows: low pastel roofs and a row of rain trees */
    var cols = ['#F3D9C6', '#E8E0F2', '#D9ECE4', '#F6E7C8', '#DDE7F5'];
    for (var i = Math.floor(e.l / 46) - 1; i < e.r / 46 + 1; i++) { var bx = i * 46, h = 50 + hash(i * 2.3) * 60, c = cols[((i % 5) + 5) % 5];
      g.fillStyle = c; g.fillRect(bx, 250 - h, 44, h + 40); g.fillStyle = tone(c, 0.12); g.beginPath(); g.moveTo(bx - 3, 250 - h); g.lineTo(bx + 22, 236 - h); g.lineTo(bx + 47, 250 - h); g.closePath(); g.fill();
      g.fillStyle = 'rgba(255,255,255,.7)'; for (var wy = 262 - h; wy < 240; wy += 16) { g.fillRect(bx + 8, wy, 8, 9); g.fillRect(bx + 26, wy, 8, 9); } }
    for (var j = Math.floor(e.l / 90) - 1; j < e.r / 90 + 1; j++) { var tx = j * 90 + 40; fillRR(g, tx - 3, 214, 6, 40, 2, '#8A6A4A'); fillE(g, tx, 206, 36, 20, '#7FC07A'); fillE(g, tx - 14, 200, 18, 12, '#93CD86'); fillE(g, tx + 16, 210, 16, 10, '#6DB06A'); }
    g.fillStyle = '#C9D7C9'; g.fillRect(e.l, 252, e.r - e.l, e.b - 252);
    g.restore();
  }
  function paintFrame(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy), WS = wins(e);
    /* the courtyard through the open door (wide screens) */
    WS.forEach(function (x) { if (!isDoor(x)) return; g.save(); g.beginPath(); winPath(g, x, true); g.clip();
      g.fillStyle = '#D8CFC0'; g.fillRect(x - 90, 300, 180, 180); g.strokeStyle = 'rgba(120,100,80,.25)'; g.lineWidth = 1.5; g.beginPath(); for (var cy = 312; cy < F; cy += 14) { g.moveTo(x - 90, cy); g.lineTo(x + 90, cy); } g.stroke();
      fillRR(g, x + 30, 150, 6, 160, 2, '#7A6A5A'); fillE(g, x + 33, 120, 48, 40, '#7FC07A'); fillE(g, x + 10, 104, 26, 22, '#93CD86'); fillRR(g, x - 70, 288, 50, 6, 3, '#5C6B7A'); fillE(g, x - 62, 300, 10, 10, 'rgba(0,0,0,0)');
      g.strokeStyle = '#3A4458'; g.lineWidth = 2.4; g.beginPath(); g.arc(x - 62, 300, 10, 0, 7); g.arc(x - 28, 300, 10, 0, 7); g.moveTo(x - 62, 300); g.lineTo(x - 46, 284); g.lineTo(x - 28, 300); g.moveTo(x - 46, 284); g.lineTo(x - 40, 280); g.stroke(); g.restore(); });
    /* the glazed roof: slate trusses and white glazing bars over the sky */
    g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 1.6; g.beginPath(); for (var gx = Math.floor(e.l / 44) * 44; gx < e.r; gx += 44) { g.moveTo(gx, e.t); g.lineTo(gx, ROOF); } g.stroke();
    g.strokeStyle = 'rgba(47,93,107,.38)'; g.lineWidth = 2; g.beginPath(); for (var tx = Math.floor(e.l / 150) * 150; tx < e.r; tx += 150) { g.moveTo(tx, ROOF - 6); g.lineTo(tx + 75, e.t + 10); g.lineTo(tx + 150, ROOF - 6); } g.stroke();
    fillRR(g, e.l, e.t + 4, e.r - e.l, 6, 0, SLATE);
    /* the wall with its arched windows cut out */
    g.beginPath(); g.rect(e.l, ROOF, e.r - e.l, F - ROOF); WS.forEach(function (x) { winPath(g, x, isDoor(x)); });
    var wg = g.createLinearGradient(0, ROOF, 0, 300); wg.addColorStop(0, '#FFF9EE'); wg.addColorStop(1, '#F5EAD6'); g.fillStyle = wg; g.fill('evenodd');
    g.strokeStyle = 'rgba(150,120,80,.08)'; g.lineWidth = 1.2; g.beginPath(); for (var cy2 = ROOF + 40; cy2 < 296; cy2 += 38) { g.moveTo(e.l, cy2); g.lineTo(e.r, cy2); } g.stroke();
    fillRR(g, e.l, ROOF - 2, e.r - e.l, 12, 0, '#FFFFFF'); g.fillStyle = 'rgba(30,60,90,.10)'; g.fillRect(e.l, ROOF + 10, e.r - e.l, 3);
    /* the sage tiled dado with its brass rail */
    g.fillStyle = SAGE; g.fillRect(e.l, 300, e.r - e.l, F - 300); g.strokeStyle = 'rgba(255,255,255,.8)'; g.lineWidth = 1.4; g.beginPath();
    for (var ty = 300; ty < F; ty += 14) { g.moveTo(e.l, ty); g.lineTo(e.r, ty); var off = ((ty - 300) / 14) % 2 ? 14 : 0; for (var tx2 = Math.floor(e.l / 28) * 28 + off; tx2 < e.r; tx2 += 28) { g.moveTo(tx2, ty); g.lineTo(tx2, ty + 14); } } g.stroke();
    fillRR(g, e.l, 296, e.r - e.l, 6, 0, BRASS); g.fillStyle = 'rgba(255,255,255,.45)'; g.fillRect(e.l, 296, e.r - e.l, 1.6);
    WS.forEach(function (x) { if (isDoor(x)) { /* the doorway: an arched frame, two green leaves folded open */
        g.strokeStyle = '#FFFFFF'; g.lineWidth = 10; g.beginPath(); winPath(g, x, true); g.stroke(); g.fillStyle = '#4E8A72'; [-1, 1].forEach(function (d) { g.beginPath(); g.moveTo(x + d * 84, 90); g.lineTo(x + d * 116, 104); g.lineTo(x + d * 116, F + 4); g.lineTo(x + d * 84, F); g.closePath(); g.fill(); });
        fillRR(g, x - 30, -18, 60, 18, 4, SLATE_D); text(g, 'DISPATCH YARD', x, -6, 7.4, 800, '#FFFFFF', 'center'); return; }
      g.strokeStyle = '#FFFFFF'; g.lineWidth = 8; g.beginPath(); winPath(g, x, false); g.stroke();
      g.lineWidth = 3; g.beginPath(); g.moveTo(x - 28, 250); g.lineTo(x - 28, 40); g.moveTo(x + 28, 250); g.lineTo(x + 28, 40); g.moveTo(x - 84, 150); g.lineTo(x + 84, 150); g.moveTo(x - 84, 86); g.lineTo(x + 84, 86);
      for (var a = 1; a < 4; a++) { var an = Math.PI + a * Math.PI / 4; g.moveTo(x, 86); g.lineTo(x + Math.cos(an) * 84, 86 + Math.sin(an) * 84); } g.stroke();
      g.fillStyle = 'rgba(255,255,255,.22)'; g.beginPath(); g.moveTo(x - 70, 250); g.lineTo(x - 20, 40); g.lineTo(x + 4, 40); g.lineTo(x - 46, 250); g.closePath(); g.fill();
      fillRR(g, x - 96, 248, 192, 10, 4, '#FFFFFF'); g.fillStyle = 'rgba(30,60,90,.08)'; g.fillRect(x - 92, 258, 184, 3); });
    /* pilasters between the windows */
    WS.forEach(function (x) { var px = x + WINX / 2; fillRR(g, px - 16, ROOF + 12, 32, 288 - ROOF, 0, 'rgba(255,255,255,.45)'); fillRR(g, px - 20, ROOF + 12, 40, 10, 2, '#FFFFFF'); });
    /* the oak floor in perspective */
    var fg = g.createLinearGradient(0, F, 0, e.b); fg.addColorStop(0, '#D9B98C'); fg.addColorStop(1, '#C49A68'); g.fillStyle = fg; g.fillRect(e.l, F, e.r - e.l, e.b - F);
    g.strokeStyle = 'rgba(110,70,30,.16)'; g.lineWidth = 1.6; g.beginPath();
    for (var d = 1; d < 12; d++) { var yy = F + Math.pow(d / 11, 1.5) * (e.b - F); g.moveTo(e.l, yy); g.lineTo(e.r, yy); }
    for (var r2 = 0; r2 < 11; r2++) { var y0 = F + Math.pow(r2 / 11, 1.5) * (e.b - F), y1 = F + Math.pow((r2 + 1) / 11, 1.5) * (e.b - F), stp = 180 * (1 + r2 * 0.1);
      for (var i = ((r2 * 83) % 180) - stp + Math.floor(e.l / stp) * stp; i < e.r; i += stp) { g.moveTo(i, y0); g.lineTo(i + (i - 560) * 0.06, y1); } }
    g.stroke(); fillRR(g, e.l, F - 4, e.r - e.l, 8, 0, '#B98E5E'); g.fillStyle = 'rgba(40,30,20,.10)'; g.fillRect(e.l, F + 4, e.r - e.l, 10);
    /* the painted floor: the IN / SORT / OUT lane in safety yellow, its chevrons and stencils, a kerb hatch at each end */
    var LY = LANE.y, LH = LANE.h; g.fillStyle = 'rgba(255,246,222,.22)'; g.fillRect(e.l, LY, e.r - e.l, LH);
    g.fillStyle = '#EDBE4C'; g.fillRect(e.l, LY - 2, e.r - e.l, 4); g.fillRect(e.l, LY + LH - 2, e.r - e.l, 4);
    g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(e.l, LY - 2, e.r - e.l, 1.2); g.fillRect(e.l, LY + LH - 2, e.r - e.l, 1.2);
    g.strokeStyle = 'rgba(237,190,76,.55)'; g.lineWidth = 5; g.lineCap = 'round'; g.lineJoin = 'round';
    for (var cv = Math.floor(e.l / 150) * 150 + 40; cv < e.r; cv += 150) { if (LANE.words.some(function (w) { return Math.abs(cv - w[1]) < 90; })) continue;
      g.beginPath(); g.moveTo(cv - 8, LY + 14); g.lineTo(cv + 6, LY + LH / 2); g.lineTo(cv - 8, LY + LH - 14); g.moveTo(cv + 10, LY + 14); g.lineTo(cv + 24, LY + LH / 2); g.lineTo(cv + 10, LY + LH - 14); g.stroke(); }
    g.save(); g.font = '800 31px ' + FONT; g.fillStyle = 'rgba(214,160,40,.7)'; g.textAlign = 'center'; if (g.letterSpacing !== undefined) g.letterSpacing = '6px';
    LANE.words.forEach(function (w) { g.save(); g.translate(w[1], LY + LH / 2 + 10); g.scale(1, 0.72); g.fillText(w[0], 0, 0); g.restore(); }); g.restore();
    g.restore();
  }
  function paintBack(g, ext) {
    var e = ext; layoutLeft();
    /* the ceiling tube and the rail */
    fillRR(g, e.l, CT - 7, e.r - e.l, 14, 7, 'rgba(200,232,240,.75)'); g.fillStyle = 'rgba(255,255,255,.6)'; g.fillRect(e.l, CT - 5, e.r - e.l, 2.4);
    for (var cx = Math.floor(e.l / 120) * 120; cx < e.r; cx += 120) fillRR(g, cx - 4, CT - 9, 8, 18, 2, BRASS);
    for (var hx = Math.floor(e.l / 200) * 200 + 60; hx < e.r; hx += 200) { g.fillStyle = '#7A869C'; g.fillRect(hx - 1.5, ROOF, 3, RAIL - 8 - ROOF); }
    fillRR(g, e.l, RAIL - 12, e.r - e.l, 4, 0, SLATE_D); g.fillStyle = SLATE; g.fillRect(e.l, RAIL - 8, e.r - e.l, 8); fillRR(g, e.l, RAIL, e.r - e.l, 4, 0, SLATE_D); g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(e.l, RAIL - 7, e.r - e.l, 2);
    for (var bx = Math.floor(e.l / 40) * 40; bx < e.r; bx += 40) fillE(g, bx, RAIL - 4, 1.4, 1.4, '#7FA3AD');
    /* the run log tape across the hall: guides, paper, perforations, the stamping head and the supply reel */
    fillRR(g, e.l, TAPE.y - 6, e.r - e.l, 5, 0, SLATE_D); fillRR(g, e.l, TAPE.y + TAPE.h + 1, e.r - e.l, 5, 0, SLATE_D);
    g.fillStyle = '#FFFDF6'; g.fillRect(e.l, TAPE.y, e.r - e.l, TAPE.h); g.fillStyle = 'rgba(214,74,58,.25)'; g.fillRect(e.l, TAPE.y + 2, e.r - e.l, 1.2);
    g.fillStyle = 'rgba(31,68,80,.18)'; for (var px = Math.floor(e.l / 12) * 12; px < e.r; px += 12) { g.beginPath(); g.arc(px, TAPE.y + TAPE.h - 3, 1.1, 0, 7); g.fill(); }
    for (var bk = Math.floor(e.l / 260) * 260 + 130; bk < e.r; bk += 260) { fillRR(g, bk - 5, TAPE.y - 18, 10, 14, 2, SLATE_D); g.fillStyle = '#7A869C'; g.fillRect(bk - 1, ROOF, 2, TAPE.y - 18 - ROOF); }
    shadowed(g, 8, 3, 0.2, function () { fillRR(g, HEAD_X - 26, TAPE.y - 14, 54, TAPE.h + 28, 8, SLATE); });
    fillRR(g, HEAD_X - 20, TAPE.y - 8, 42, 12, 3, SLATE_D); text(g, 'RUN LOG', HEAD_X + 1, TAPE.y + 0.6, 6.6, 800, BRASS_L, 'center'); rivets(g, HEAD_X - 26, TAPE.y - 14, 54, TAPE.h + 28);
    fillRR(g, HEAD_X - 14, TAPE.y + TAPE.h + 4, 30, 6, 3, BRASS);
    var rx = 1214; g.strokeStyle = '#7A869C'; g.lineWidth = 3; g.beginPath(); g.moveTo(rx, ROOF); g.lineTo(rx, TAPE.y - 20); g.stroke(); fillE(g, rx, TAPE.y + 16, 30, 30, SLATE_D); fillE(g, rx, TAPE.y + 16, 24, 24, '#FFFDF6'); fillE(g, rx, TAPE.y + 16, 7, 7, BRASS);
    g.strokeStyle = 'rgba(31,68,80,.12)'; g.lineWidth = 1; for (var rg = 10; rg < 24; rg += 4) { g.beginPath(); g.arc(rx, TAPE.y + 16, rg, 0, 7); g.stroke(); }
    /* the inbox chute: a brass pipe down from the ceiling tube, a NEW lamp, the station plate, the flared mouth */
    fillRR(g, CHUTE - 10, CT, 20, 186 - CT, 4, BRASS); g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(CHUTE - 6, CT, 3, 186 - CT); for (var ry = -60; ry < 180; ry += 52) fillRR(g, CHUTE - 12, ry, 24, 6, 2, BRASS_D);
    g.fillStyle = BRASS; g.beginPath(); g.moveTo(CHUTE - 10, 178); g.lineTo(CHUTE - 24, 200); g.lineTo(CHUTE + 24, 200); g.lineTo(CHUTE + 10, 178); g.closePath(); g.fill(); fillRR(g, CHUTE - 25, 198, 50, 5, 2, BRASS_D);
    fillRR(g, CHUTE - 38, 56, 76, 40, 6, SLATE); rivets(g, CHUTE - 38, 56, 76, 40); fillE(g, CHUTE - 25, 69, 6, 6, BRASS); text(g, '1', CHUTE - 25, 71.8, 7.4, 800, INK, 'center'); text(g, 'TRIGGER', CHUTE - 16, 72.4, 8.6, 800, '#FFFFFF');
    text(g, 'email · PDF · scan', CHUTE, 88, 6.6, 700, BRASS_L, 'center'); fillE(g, CHUTE + 18, 118, 9, 9, SLATE_D);
    fillRR(g, BASKET.x - 2, BASKET.y - 2, BASKET.w + 4, 6, 2, '#7A869C'); fillRR(g, CHUTE - 4, BASKET.y + 30, 8, F - BASKET.y - 34, 2, '#7A869C'); fillRR(g, CHUTE - 22, F - 6, 44, 6, 3, '#5C6B7A');
    g.fillStyle = 'rgba(122,134,156,.35)'; g.fillRect(BASKET.x, BASKET.y, BASKET.w, 30);
    /* the pigeonhole wall */
    var S0 = SORT; for (var lg = 0; lg < 2; lg++) fillRR(g, S0.x + 6 + lg * (S0.w - 18), S0.y + S0.h, 6, F - S0.y - S0.h, 2, tone(WOOD, 0.1));
    shadowed(g, 12, 5, 0.18, function () { fillRR(g, S0.x, S0.y, S0.w, S0.h, 6, WOOD); });
    fillRR(g, S0.x - 4, S0.y - 22, S0.w + 8, 22, 5, SLATE); fillE(g, S0.x + 10, S0.y - 11, 6, 6, BRASS); text(g, '2', S0.x + 10, S0.y - 8.2, 7.4, 800, INK, 'center'); text(g, 'CLASSIFY', S0.x + 20, S0.y - 7.4, 8.6, 800, '#FFFFFF');
    fillE(g, S0.x + S0.w - 14, S0.y - 11, 5, 5, '#7FF0CF');
    var cw = (S0.w - 16) / 5, rh = (S0.h - 24) / 4;
    for (var c = 0; c < 5; c++) { fillRR(g, S0.x + 8 + c * cw + 1, S0.y + 4, cw - 2, 10, 2, BRASS_L); text(g, SLOTS[c], S0.x + 8 + c * cw + cw / 2, S0.y + 11.8, 6, 800, SLATE_D, 'center');
      for (var r = 0; r < 4; r++) { var x0 = S0.x + 8 + c * cw, y0 = S0.y + 18 + r * rh; fillRR(g, x0 + 1, y0 + 1, cw - 2, rh - 2, 2, '#5C3F27');
        var n = Math.floor(hash(c * 7 + r * 3) * 4); for (var q = 0; q < n; q++) fillRR(g, x0 + 3 + q * 1.5, y0 + rh - 12 - q * 3 + (q % 2), cw - 7, 10, 1.5, ['#FFFFFF', '#FFF6E0', '#EEF4FF', '#F7E7EC'][(q + c) % 4]); } }
    /* the record cabinet with its Odoo screen on top */
    var C0 = CAB; fillRR(g, C0.x + 40, MON.y + MON.h + 4, 18, C0.y - MON.y - MON.h - 2, 3, '#5C6B7A');
    shadowed(g, 12, 5, 0.2, function () { fillRR(g, MON.x - 5, MON.y - 5, MON.w + 10, MON.h + 10, 7, '#2A3142'); });
    shadowed(g, 14, 6, 0.2, function () { fillRR(g, C0.x, C0.y, C0.w, F - C0.y, 6, PUR); });
    fillRR(g, C0.x - 3, C0.y - 16, C0.w + 6, 18, 5, SLATE); fillE(g, C0.x + 9, C0.y - 7, 6, 6, BRASS); text(g, '3', C0.x + 9, C0.y - 4.2, 7.4, 800, INK, 'center'); text(g, 'RECORD', C0.x + 19, C0.y - 3.6, 8.6, 800, '#FFFFFF');
    for (var dc = 0; dc < 2; dc++) for (var dr = 0; dr < 6; dr++) { var dx = C0.x + 6 + dc * 44, dy = C0.y + 8 + dr * 49; fillRR(g, dx, dy, 42, 44, 4, '#8A5E80'); fillRR(g, dx + 11, dy + 8, 20, 11, 2, '#FFFFFF'); g.fillStyle = '#C9C2DA'; g.fillRect(dx + 14, dy + 12, 14, 2);
      fillRR(g, dx + 13, dy + 27, 16, 5, 2.5, BRASS); }
    soft(g, C0.x + C0.w / 2, F + 2, 60, 6, 0.25);
    /* the drafting press on its wall brackets, the chute down to the gate */
    var P0 = PRESS; [P0.x + 14, P0.x + P0.w - 22].forEach(function (x) { g.fillStyle = SLATE_D; g.beginPath(); g.moveTo(x, P0.y + P0.h); g.lineTo(x + 8, P0.y + P0.h); g.lineTo(x + 8, P0.y + P0.h + 30); g.closePath(); g.fill(); });
    shadowed(g, 14, 6, 0.22, function () { fillRR(g, P0.x, P0.y, P0.w, P0.h, 10, SLATE); });
    fillRR(g, P0.x + 4, P0.y + 4, P0.w - 8, 10, 5, SLATE_D); fillRR(g, P0.x + 30, P0.y - 4, 62, 9, 3, '#1A2A33'); fillRR(g, P0.x + 28, P0.y - 6, 66, 4, 2, BRASS);
    fillRR(g, P0.x + 20, P0.y + 18, 82, 24, 5, '#0F1A22'); rivets(g, P0.x, P0.y, P0.w, P0.h);
    [[604, 170], [654, 170]].forEach(function (p) { fillE(g, p[0], p[1], 21, 21, BRASS); fillE(g, p[0], p[1], 17, 17, '#14232B'); });
    fillRR(g, P0.x + P0.w - 4, 194, 8, 22, 2, '#14232B'); fillRR(g, P0.x + 8, P0.y + P0.h - 24, 72, 16, 4, SLATE_D); fillE(g, P0.x + 17, P0.y + P0.h - 16, 5.4, 5.4, BRASS); text(g, '4', P0.x + 17, P0.y + P0.h - 13.3, 7.4, 800, INK, 'center'); text(g, 'DRAFT', P0.x + 26, P0.y + P0.h - 12.6, 8.4, 800, '#FFFFFF');
    g.fillStyle = BRASS_D; g.beginPath(); g.moveTo(690, 210); g.lineTo(696, 204); g.lineTo(730, 360); g.lineTo(722, 364); g.closePath(); g.fill(); g.fillStyle = BRASS_L; g.beginPath(); g.moveTo(693, 207); g.lineTo(696, 204); g.lineTo(728, 358); g.lineTo(725, 360); g.closePath(); g.fill();
    /* the guardrails sign over the gate */
    shadowed(g, 12, 5, 0.18, function () { fillRR(g, GUARD.x, GUARD.y, GUARD.w, GUARD.h, 8, '#FFFFFF'); });
    fillRR(g, GUARD.x, GUARD.y, GUARD.w, 21, 8, SLATE); g.fillRect(GUARD.x, GUARD.y + 12, GUARD.w, 9); text(g, 'GUARDRAILS', GUARD.x + GUARD.w / 2, GUARD.y + 15, 9.6, 800, '#FFFFFF', 'center');
    [['ALONE', 'read · classify · prepare', GREEN], ['WAITS', 'pay · post · message', AMBER], ['NEVER', 'what you rule out', RED]].forEach(function (row, i) { var y = GUARD.y + 27 + i * 23;
      fillRR(g, GUARD.x + 6, y, GUARD.w - 12, 20, 4, i === 1 ? '#FFF6E5' : i === 2 ? '#FDEDEB' : '#EAF7F1'); fillRR(g, GUARD.x + 10, y + 4, 38, 12, 3, row[2]); text(g, row[0], GUARD.x + 29, y + 13, 7, 800, '#FFFFFF', 'center');
      text(g, row[1], GUARD.x + 53, y + 13.6, 8.2, 700, INK); });
    /* the gate post: the signal lamp, the kill switch box, the barrier pivot */
    fillRR(g, POST - 4, 150, 8, F - 150, 3, '#7A869C'); g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(POST - 3, 150, 2, F - 150); fillRR(g, POST - 14, F - 6, 28, 6, 3, '#5C6B7A');
    shadowed(g, 8, 3, 0.2, function () { fillRR(g, POST - 12, 146, 24, 62, 7, '#2A3142'); }); fillE(g, POST, 166, 8, 8, '#3A3020'); fillE(g, POST, 190, 8, 8, '#1F3A2C');
    fillRR(g, POST - 16, 214, 32, 52, 6, RED); fillRR(g, POST - 12, 218, 24, 10, 3, '#FFFFFF'); text(g, 'PAUSE', POST, 225.8, 6, 800, RED, 'center'); fillRR(g, POST - 3, 232, 6, 28, 3, '#8E2A20');
    fillE(g, BAR.x, BAR.y, 7, 7, '#5C6B7A');
    /* the pneumatic tubes (glass, brass bands) and the receiver */
    TUBES.forEach(function (x, i) { var by = BEND[i], r = 16; g.lineCap = 'butt'; g.beginPath(); g.moveTo(x, RCV.y); g.lineTo(x, by + r); g.arcTo(x, by, x + r, by, r); g.lineTo(FLANGE, by);
      g.strokeStyle = 'rgba(190,225,236,.92)'; g.lineWidth = 14; g.stroke(); g.strokeStyle = 'rgba(255,255,255,.75)'; g.lineWidth = 2.6; g.stroke();
      for (var vy = by + 26; vy < RCV.y - 4; vy += 30) fillRR(g, x - 9, vy, 18, 5, 2, BRASS); for (var hx = x + 30; hx < FLANGE - 8; hx += 32) fillRR(g, hx, by - 9, 5, 18, 2, BRASS);
      fillRR(g, FLANGE - 4, by - 12, 10, 24, 3, BRASS_D); fillRR(g, FLANGE - 2, by - 10, 3, 20, 1, BRASS_L); });
    shadowed(g, 12, 5, 0.2, function () { fillRR(g, RCV.x, RCV.y, RCV.w, RCV.h, 8, SLATE); }); rivets(g, RCV.x, RCV.y, RCV.w, RCV.h);
    fillRR(g, RCV.x + 4, RCV.y - 16, 70, 15, 4, SLATE_D); fillE(g, RCV.x + 12, RCV.y - 8.5, 5.4, 5.4, BRASS); text(g, '6', RCV.x + 12, RCV.y - 5.8, 7.4, 800, INK, 'center'); text(g, 'SEND', RCV.x + 21, RCV.y - 5, 8.4, 800, '#FFFFFF');
    TUBES.forEach(function (x, i) { fillE(g, x, BAR.y, 13, 13, BRASS); fillE(g, x, BAR.y, 10, 10, '#14232B'); text(g, DEST[i], x, RCV.y + RCV.h - 7, 5.6, 800, BRASS_L, 'center'); });
    /* the follow-up tickler box */
    var T0 = TICK; shadowed(g, 10, 4, 0.18, function () { fillRR(g, T0.x, T0.y, T0.w, T0.h, 7, WOOD); });
    fillRR(g, T0.x, T0.y, T0.w, 18, 7, SLATE); g.fillRect(T0.x, T0.y + 10, T0.w, 8); fillE(g, T0.x + 10, T0.y + 9, 5.4, 5.4, BRASS); text(g, '7', T0.x + 10, T0.y + 11.7, 7.4, 800, INK, 'center'); text(g, 'FOLLOW-UP', T0.x + 18, T0.y + 12.4, 7.8, 800, '#FFFFFF');
    ['MON', 'TUE', 'WED', 'THU', 'FRI'].forEach(function (d, i) { var x = T0.x + 7 + i * 16; fillRR(g, x, T0.y + 26, 13, 44, 2, '#FFFFFF'); fillRR(g, x, T0.y + 26, 13, 8, 2, i % 2 ? '#F7E7C8' : '#E3EEF0'); text(g, d, x + 6.5, T0.y + 32, 4.4, 800, SLATE_D, 'center'); });
    fillRR(g, T0.x + 4, T0.y + 74, T0.w - 8, 32, 4, '#7A5236');
    /* the wall clock (hands drawn live) */
    fillE(g, 510, 30, 22, 22, 'rgba(30,60,90,.08)');
    /* ---- the card's corner of the hall (left of the run): route map, report board, clock, franking station, crates, tea ---- */
    if (e.l < 140) {
      routeMap(g, -446, 26, 112, 130); report(g, -146, 58, 112, 128);
      /* an enamel sign over the report board: the house rule */
      shadowed(g, 8, 3, 0.18, function () { fillRR(g, -146, 6, 112, 38, 6, RED); }); g.strokeStyle = 'rgba(255,255,255,.85)'; g.lineWidth = 1.6; rr(g, -142, 10, 104, 30, 4); g.stroke();
      text(g, 'AGENTS PREPARE', -90, 23, 8.4, 800, '#FFFFFF', 'center'); text(g, 'PEOPLE POST', -90, 35, 8.4, 800, BRASS_L, 'center'); [-140, -40].forEach(function (x) { fillE(g, x, 25, 1.8, 1.8, '#FFFFFF'); });
      /* the franking station: a slate cabinet, the franking machine, its in- and out-trays, a plate on the dado */
      var fx = -440; soft(g, fx + 45, F + 2, 56, 5, 0.25); shadowed(g, 10, 4, 0.18, function () { fillRR(g, fx, 404, 90, F - 404, 6, SLATE); });
      fillRR(g, fx + 6, 412, 78, 22, 4, SLATE_D); fillRR(g, fx + 6, 440, 78, 24, 4, SLATE_D); fillRR(g, fx + 34, 420, 22, 5, 2.5, BRASS); fillRR(g, fx + 34, 449, 22, 5, 2.5, BRASS); rivets(g, fx, 404, 90, F - 404);
      fillRR(g, fx + 10, 312, 70, 16, 4, SLATE_D); text(g, 'FRANKING', fx + 45, 323.4, 7.4, 800, BRASS_L, 'center');
      fillRR(g, fx - 14, 394, 22, 6, 2, '#9AA6BC'); for (var fi = 0; fi < 3; fi++) env(g, fx - 3, 390 - fi * 3, 20, 12, ['#FFFFFF', '#FFF6E0', '#EEF4FF'][fi], -0.05, BLUE);
      fillRR(g, fx + 82, 396, 24, 6, 2, '#9AA6BC'); for (var fo = 0; fo < 2; fo++) env(g, fx + 94, 392 - fo * 3, 20, 12, '#FFFFFF', 0.06, RED);
      shadowed(g, 8, 3, 0.2, function () { fillRR(g, fx + 8, 366, 74, 38, 8, '#E3E8EF'); }); fillRR(g, fx + 8, 386, 74, 6, 0, RED); fillRR(g, fx + 8, 398, 74, 6, 3, '#C9D3DE');
      fillRR(g, fx + 16, 372, 34, 12, 3, '#14232B'); fillRR(g, fx + 58, 372, 18, 10, 3, '#C9D3DE'); fillE(g, fx + 63, 377, 2.6, 2.6, '#5C6B7A'); fillE(g, fx + 71, 377, 2.6, 2.6, '#5C6B7A');
      g.fillStyle = '#1A2A33'; g.fillRect(fx + 8, 392, 74, 3);
      /* crates of letters and the tea trolley (the kettle steams live) */
      [[-250, 432], [-246, 396], [-212, 432]].forEach(function (b) { fillRR(g, b[0], b[1], 40, 38, 3, '#C99A6B'); fillRR(g, b[0], b[1], 40, 7, 3, '#B5865A'); for (var q = 0; q < 4; q++) fillRR(g, b[0] + 5 + q * 8, b[1] - 6, 6, 12, 1, ['#FFFFFF', '#FFF6E0', '#EEF4FF', '#F7E7EC'][q]); });
      soft(g, -230, F + 2, 50, 5, 0.22);
      var cx2 = -110; soft(g, cx2 + 40, F + 2, 60, 5, 0.25); fillRR(g, cx2, 392, 84, 8, 3, '#B98E5E'); fillRR(g, cx2 + 4, 436, 76, 6, 3, '#B98E5E'); [cx2 + 4, cx2 + 74].forEach(function (x) { fillRR(g, x, 392, 5, 72, 2, '#7A869C'); fillE(g, x + 2.5, 466, 5, 5, '#2A3142'); });
      fillRR(g, cx2 + 10, 368, 24, 24, 8, '#E3EEF0'); fillRR(g, cx2 + 30, 374, 8, 3, 1.5, '#E3EEF0'); fillRR(g, cx2 + 18, 362, 8, 6, 2, SLATE_D); [cx2 + 46, cx2 + 60].forEach(function (x) { fillRR(g, x, 380, 10, 12, 3, '#FFFFFF'); fillRR(g, x, 380, 10, 3, 1.5, RED); });
      for (var tb = 0; tb < 3; tb++) fillRR(g, cx2 + 12 + tb * 20, 424, 16, 12, 2, ['#FFF6E0', '#EEF4FF', '#F7E7EC'][tb]);
    }
    /* the INWARD sorting frame on its legs, and the rubber mat the mail-room lead stands on */
    if (e.l < -470) {
      var R0 = RACK; [R0.x + 4, R0.x + R0.w - 9].forEach(function (x) { fillRR(g, x, R0.y + R0.h, 5, F - R0.y - R0.h, 2, tone(WOOD, 0.15)); }); soft(g, R0.x + R0.w / 2, F + 2, 36, 4, 0.22);
      shadowed(g, 10, 4, 0.18, function () { fillRR(g, R0.x, R0.y, R0.w, R0.h, 5, WOOD); });
      fillRR(g, R0.x - 3, R0.y - 16, R0.w + 6, 16, 4, SLATE); text(g, 'INWARD', R0.x + R0.w / 2, R0.y - 5, 7.4, 800, '#FFFFFF', 'center');
      for (var si = 0; si < 12; si++) { var sl = slotAt(si); fillRR(g, sl[0] - sl[2] / 2 + 1, sl[1] - sl[3] / 2 + 1, sl[2] - 2, sl[3] - 2, 2, '#5C3F27');
        if (hash(si * 3.7) > 0.35) fillRR(g, sl[0] - sl[2] / 2 + 3, sl[1] + sl[3] / 2 - 9, sl[2] - 6, 7, 1, ['#FFFFFF', '#FFF6E0', '#EEF4FF', '#F7E7EC'][si % 4]); }
      var mx0 = SRT.x - 48; g.fillStyle = 'rgba(58,68,88,.82)'; g.beginPath(); g.moveTo(mx0, 562); g.lineTo(mx0 + 94, 562); g.lineTo(mx0 + 84, 536); g.lineTo(mx0 + 10, 536); g.closePath(); g.fill();
      g.strokeStyle = 'rgba(255,255,255,.12)'; g.lineWidth = 1.4; g.beginPath(); for (var mr = 0; mr < 6; mr++) { var my2 = 539 + mr * 4; g.moveTo(mx0 + 2 + (562 - my2) * 0.38, my2); g.lineTo(mx0 + 92 - (562 - my2) * 0.38, my2); } g.stroke();
    }
    /* beyond the frame (wide screens): the lockers, the waiting bench */
    if (e.l < -645) {
      for (var lk = 0; lk < 3; lk++) { var lx = -726 + lk * 29; fillRR(g, lx, 268, 28, F - 268, 3, '#4E8A72'); fillRR(g, lx + 4, 276, 21, 6, 2, 'rgba(255,255,255,.25)'); fillRR(g, lx + 4, 290, 21, 4, 2, 'rgba(255,255,255,.25)'); fillRR(g, lx + 21, 340, 4, 14, 2, BRASS); text(g, String(11 + lk), lx + 14.5, 318, 9, 800, '#FFFFFF', 'center'); }
      fillRR(g, -730, 262, 92, 8, 3, '#3E7360'); soft(g, -683, F + 2, 50, 5, 0.22);
    }
    if (e.l < -760) {
      var bx2 = -900; soft(g, bx2 + 70, F + 2, 80, 5, 0.25); fillRR(g, bx2, 424, 140, 10, 4, '#B98E5E'); fillRR(g, bx2, 404, 140, 8, 4, '#C9A27A'); [bx2 + 8, bx2 + 126].forEach(function (x) { fillRR(g, x, 434, 6, 34, 2, '#5C6B7A'); });
      sheet(g, bx2 + 40, 420, 30, 8, 0.1, RED); sack(g, bx2 + 88, 384, 40, 40, '#E3D2B0', 'AP');
    }
  }
  /* the route map: the seven stops as a line diagram, the gate marked with a person */
  function routeMap(g, x, y, w, h) {
    shadowed(g, 12, 5, 0.18, function () { fillRR(g, x - 4, y - 4, w + 8, h + 8, 8, '#D9B98C'); }); fillRR(g, x, y, w, h, 5, '#FFFDF6');
    fillRR(g, x, y, w, 18, 5, SLATE); g.fillStyle = SLATE; g.fillRect(x, y + 10, w, 8); text(g, 'THE ROUTE', x + w / 2, y + 12.6, 8, 800, '#FFFFFF', 'center');
    var nodes = [['TRIGGER', BLUE], ['CLASSIFY', '#3FA9E0'], ['RECORD', PUR], ['DRAFT', BRASS_D], ['APPROVE', GREEN], ['SEND', SLATE], ['FOLLOW UP', '#E07B12']], lx = x + 16, y0 = y + 30, st = (h - 40) / 6;
    g.strokeStyle = '#C9D3DE'; g.lineWidth = 4; g.lineCap = 'round'; g.beginPath(); g.moveTo(lx, y0); g.lineTo(lx, y0 + st * 6); g.stroke();
    nodes.forEach(function (nd, i) { var ny = y0 + i * st; fillE(g, lx, ny, 5.4, 5.4, '#FFFFFF'); g.strokeStyle = nd[1]; g.lineWidth = 2.6; g.beginPath(); g.arc(lx, ny, 4.4, 0, 7); g.stroke(); text(g, nd[0], lx + 11, ny + 2.6, 7, 800, INK);
      if (i === 4) { fillRR(g, x + w - 44, ny - 6, 38, 12, 6, '#EAF7F1'); text(g, 'a person', x + w - 25, ny + 2.4, 5.8, 800, '#14704C', 'center'); } });
    [x + 6, x + w - 6].forEach(function (px) { fillE(g, px, y - 1, 3.4, 3.4, RED); });
  }
  /* the monthly report board: what the agent handled, escalated and corrected (plainly sample) */
  function report(g, x, y, w, h) {
    shadowed(g, 10, 4, 0.18, function () { fillRR(g, x, y, w, h, 7, '#FFFFFF'); }); fillRR(g, x, y, w, 20, 7, SLATE); g.fillStyle = SLATE; g.fillRect(x, y + 12, w, 8); text(g, 'MONTHLY REPORT', x + w / 2, y + 13.6, 7.4, 800, '#FFFFFF', 'center');
    [['handled', GREEN, 0.86], ['escalated', AMBER, 0.34], ['corrected', BLUE, 0.22]].forEach(function (b, i) { var yy = y + 32 + i * 28; text(g, b[0], x + 10, yy + 6, 7.4, 800, INK); fillRR(g, x + 10, yy + 11, w - 20, 8, 4, '#EEF2F7'); fillRR(g, x + 10, yy + 11, (w - 20) * b[2], 8, 4, b[1]); });
    text(g, 'sample', x + w - 10, y + h - 7, 5.8, 700, '#9AA6BC', 'right');
  }
  function paintFront(g, ext) {
    /* the basket's front wires (the letter sits inside) */
    g.strokeStyle = '#7A869C'; g.lineWidth = 2; g.beginPath(); for (var bw = BASKET.x; bw <= BASKET.x + BASKET.w; bw += 9) { g.moveTo(bw, BASKET.y); g.lineTo(bw + 2, BASKET.y + 30); } g.moveTo(BASKET.x, BASKET.y + 30); g.lineTo(BASKET.x + BASKET.w + 2, BASKET.y + 30); g.stroke();
    fillRR(g, BASKET.x - 3, BASKET.y - 3, BASKET.w + 6, 5, 2, '#9AA6BC');
    /* the review desk: the queue tray, the lamp */
    CO.desk(g, 300, 392, 128, F, { open: true, legs: '#9AA6BC', top: '#C9A27A' });
    fillRR(g, 304, 376, 32, 14, 3, '#9AA6BC'); for (var q = 0; q < 4; q++) fillRR(g, 306 + q * 0.6, 370 - q * 3, 28, 6, 1, q % 2 ? '#FFF6E0' : '#FFFFFF');
    fillRR(g, 306, 360, 28, 9, 3, AMBER); text(g, 'REVIEW', 320, 366.6, 5.4, 800, INK, 'center');
    g.strokeStyle = '#3A4458'; g.lineWidth = 3; g.lineCap = 'round'; g.beginPath(); g.moveTo(414, 392); g.lineTo(418, 352); g.lineTo(404, 336); g.stroke(); fillRR(g, 406, 388, 16, 5, 2, '#3A4458');
    g.fillStyle = BRASS; g.beginPath(); g.moveTo(396, 330); g.lineTo(412, 330); g.lineTo(418, 344); g.lineTo(392, 344); g.closePath(); g.fill();
    /* the developer's desk: keyboard, mug spot, the monitor BESIDE him */
    CO.desk(g, 556, 392, 146, F, { open: true, legs: '#9AA6BC', top: '#C9A27A' });
    fillRR(g, 588, 384, 54, 8, 2, '#E3E8EF'); g.fillStyle = '#C9D3DE'; for (var kx = 0; kx < 8; kx++) g.fillRect(591 + kx * 6.4, 386, 4.4, 3);
    fillRR(g, 677, 380, 6, 12, 2, '#5C6B7A'); fillRR(g, 666, 389, 28, 4, 2, '#5C6B7A'); shadowed(g, 8, 3, 0.2, function () { fillRR(g, 660, 318, 44, 64, 5, '#2A3142'); });
    /* the approval desk */
    shadowed(g, 10, 3, 0.16, function () { fillRR(g, DESK.x, DESK.y + 8, DESK.w, F - DESK.y - 8, 6, SLATE); });
    fillRR(g, DESK.x - 6, DESK.y, DESK.w + 12, 11, 4, '#C9A27A'); g.fillStyle = 'rgba(255,255,255,.3)'; g.fillRect(DESK.x - 4, DESK.y + 2, DESK.w + 8, 2);
    fillRR(g, DESK.x + 10, DESK.y + 24, DESK.w - 20, 36, 6, 'rgba(255,255,255,.12)'); fillE(g, DESK.x + 22, DESK.y + 42, 7, 7, BRASS); text(g, '5', DESK.x + 22, DESK.y + 45, 8, 800, INK, 'center');
    text(g, 'APPROVAL GATE', DESK.x + 33, DESK.y + 40, 9, 800, '#FFFFFF'); text(g, 'a person signs off', DESK.x + 33, DESK.y + 52, 6.6, 700, BRASS_L);
    fillRR(g, DESK.x + 4, DESK.y - 12, 40, 12, 2, '#9AA6BC'); g.fillStyle = '#7A869C'; g.fillRect(DESK.x + 6, DESK.y - 10, 36, 2);
    fillRR(g, DESK.x + 48, DESK.y - 3, 52, 3, 1, '#2E7D5B');
    fillRR(g, DESK.x + 98, DESK.y - 22, 14, 22, 3, '#7A5236'); [0, 1].forEach(function (i) { fillRR(g, DESK.x + 100 + i * 6, DESK.y - 30, 4, 10, 2, '#5C3F27'); fillE(g, DESK.x + 102 + i * 6, DESK.y - 31, 3, 3, BRASS); });
    paintFrontMid(g, ext);
  }
  /* mid-floor fixtures in front of the back row: the roller conveyors, the hamper, the pigeonhole trolley, the OUT cage */
  function conveyor(g, c, lab) {
    var x0 = c.x0, x1 = c.x1, y = c.y, base = y + 46; soft(g, (x0 + x1) / 2, base + 2, (x1 - x0) * 0.55, 6, 0.24);
    [x0 + 10, (x0 + x1) / 2 - 3, x1 - 16].forEach(function (x) { fillRR(g, x, y + 14, 6, base - y - 16, 2, '#7A869C'); fillRR(g, x - 4, base - 4, 14, 4, 2, '#5C6B7A'); });
    g.fillStyle = '#C9D3DE'; g.beginPath(); g.moveTo(x0 + 8, y - 8); g.lineTo(x1 - 8, y - 8); g.lineTo(x1, y + 2); g.lineTo(x0, y + 2); g.closePath(); g.fill();
    g.strokeStyle = '#8E9AB0'; g.lineWidth = 2.2; g.beginPath(); for (var rx = x0 + 6; rx < x1 - 4; rx += 9) { g.moveTo(rx + 2, y - 7); g.lineTo(rx, y + 1); } g.stroke();
    fillRR(g, x0 - 2, y + 2, x1 - x0 + 4, 12, 3, SLATE); g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(x0, y + 4, x1 - x0, 2);
    for (var bx = x0 + 12; bx < x1 - 6; bx += 26) fillE(g, bx, y + 8, 1.8, 1.8, BRASS_L);
    fillRR(g, (x0 + x1) / 2 - 22, y + 3, 44, 10, 3, BRASS); text(g, lab, (x0 + x1) / 2, y + 10.8, 6.6, 800, INK, 'center');
  }
  function hamper(g, x, base, w, lab, col) {
    soft(g, x + w / 2, base + 2, w * 0.6, 5, 0.24); [x + 10, x + w - 10].forEach(function (cx) { fillE(g, cx, base - 5, 5.4, 5.4, '#2A3142'); fillE(g, cx, base - 5, 2, 2, '#9AA6BC'); });
    for (var q = 0; q < 5; q++) fillRR(g, x + 8 + q * (w - 22) / 4, base - 76 - (q % 2) * 4, 12, 18, 1.5, ['#FFFFFF', '#FFF6E0', '#EEF4FF', '#F7E7EC', '#FFFFFF'][q]);
    g.fillStyle = col; g.beginPath(); g.moveTo(x, base - 66); g.lineTo(x + w, base - 66); g.lineTo(x + w - 5, base - 12); g.lineTo(x + 5, base - 12); g.closePath(); g.fill();
    g.fillStyle = 'rgba(0,0,0,.06)'; g.fillRect(x + 4, base - 40, w - 8, 3); fillRR(g, x - 3, base - 70, w + 6, 7, 3, '#7A869C'); fillRR(g, x + 2, base - 14, w - 4, 4, 2, '#7A869C');
    fillRR(g, x + w / 2 - 22, base - 50, 44, 14, 3, '#FFFFFF'); text(g, lab, x + w / 2, base - 40.4, 7, 800, SLATE_D, 'center');
  }
  function paintFrontMid(g, ext) {
    if (ext.l < 140) { conveyor(g, CONV[0], 'INWARD'); hamper(g, -186, 616, 82, 'SORTED', '#E8D9B8'); soft(g, TRUCK.x, TRUCK.y + 1, 44, 5, 0.26); }
    conveyor(g, CONV[1], 'SORT');
    /* the pigeonhole trolley */
    var px = 548, pb = 610; soft(g, px + 40, pb + 2, 48, 5, 0.24); [px + 10, px + 70].forEach(function (cx) { fillE(g, cx, pb - 5, 5.4, 5.4, '#2A3142'); fillE(g, cx, pb - 5, 2, 2, '#9AA6BC'); });
    fillRR(g, px, pb - 14, 80, 6, 2, '#7A869C'); fillRR(g, px + 4, pb - 96, 72, 84, 4, WOOD); fillRR(g, px - 2, pb - 102, 84, 8, 3, SLATE);
    for (var c = 0; c < 3; c++) for (var r = 0; r < 3; r++) { var sx = px + 8 + c * 22, sy = pb - 90 + r * 25; fillRR(g, sx, sy, 20, 22, 2, '#5C3F27'); if (hash(c * 5 + r * 2.2) > 0.3) fillRR(g, sx + 2, sy + 12, 16, 8, 1, ['#FFFFFF', '#FFF6E0', '#EEF4FF'][(c + r) % 3]); }
    g.strokeStyle = '#5C6B7A'; g.lineWidth = 3; g.lineCap = 'round'; g.beginPath(); g.moveTo(px + 80, pb - 60); g.lineTo(px + 92, pb - 64); g.lineTo(px + 92, pb - 104); g.stroke();
    /* the OUT cage on castors, two sacks inside */
    var ox = 652, ob = 610; soft(g, ox + 38, ob + 2, 46, 5, 0.24); [ox + 10, ox + 66].forEach(function (cx) { fillE(g, cx, ob - 5, 5.4, 5.4, '#2A3142'); fillE(g, cx, ob - 5, 2, 2, '#9AA6BC'); });
    fillRR(g, ox, ob - 92, 76, 80, 2, 'rgba(227,238,240,.78)'); sack(g, ox + 6, ob - 62, 36, 50, '#E3D2B0', ''); sack(g, ox + 36, ob - 56, 34, 44, '#D9C49C', '');
    g.strokeStyle = '#7A869C'; g.lineWidth = 2; g.beginPath(); for (var gx = ox; gx <= ox + 76; gx += 12.6) { g.moveTo(gx, ob - 92); g.lineTo(gx, ob - 12); } for (var gy = ob - 92; gy <= ob - 12; gy += 16) { g.moveTo(ox, gy); g.lineTo(ox + 76, gy); } g.stroke();
    fillRR(g, ox - 2, ob - 96, 80, 6, 3, SLATE_D); fillRR(g, ox + 22, ob - 64, 32, 14, 3, RED); text(g, 'OUT', ox + 38, ob - 54, 8, 800, '#FFFFFF', 'center');
    /* outgoing sacks waiting for collection, and the lane sign */
    sack(g, 750, 558, 50, 50, '#E3D2B0', 'VENDOR'); sack(g, 796, 566, 46, 42, '#D9C49C', 'AP');
    var ax = 872, ab = 608; soft(g, ax + 18, ab + 2, 24, 4, 0.22); g.fillStyle = '#5C6B7A'; g.beginPath(); g.moveTo(ax + 4, ab); g.lineTo(ax + 18, ab - 64); g.lineTo(ax + 32, ab); g.lineTo(ax + 28, ab); g.lineTo(ax + 18, ab - 54); g.lineTo(ax + 8, ab); g.closePath(); g.fill();
    fillRR(g, ax, ab - 66, 36, 44, 4, '#EDBE4C'); fillRR(g, ax + 3, ab - 63, 30, 38, 3, '#FFF4D2'); text(g, 'SORT', ax + 18, ab - 49, 7, 800, INK, 'center'); text(g, '→ OUT', ax + 18, ab - 37, 6.6, 800, RED, 'center');
  }
  function paintFore(g, ext) {
    /* near the camera, clear of the card, the caption and the stamp strip: sacks at the left edge, the cat's sack by the gate, plants */
    if (ext.l < -470) sack(g, -622, 700, 66, 50, '#D9C49C', 'INWARD');
    sack(g, 926, 712, 66, 48, '#E8D9B8', 'OUT');
    if (ext.r > 1180) pot(g, 1226, 760, 1);
    if (ext.l < -700) pot(g, -830, 760, 1.2);
  }
  /* ---------------- live ---------------- */
  var TAP = {}, WC = {}, CAPS = [];
  function paintWindow(g, t, par, S) {
    var e = S.ext, w = wclock(t); S.R = runAt(w); S.paused = t < WT.until;
    for (var c = 0; c < 5; c++) { var sp = 4 + c * 1.6, span = e.r - e.l + 400, x = e.l - 200 + ((hash(c + 3) * span + t * sp) % span), y = -230 + c * 46 - (c % 2) * 20; K.cloud(g, x, y, 0.2 + hash(c) * 0.12); }
    g.strokeStyle = 'rgba(40,60,90,.5)'; g.lineWidth = 1.5; g.lineCap = 'round';
    for (var b = 0; b < 4; b++) { var bsp = e.r - e.l + 300, bx = e.l - 100 + ((t * (14 + b * 3) + hash(b + 9) * bsp) % bsp), by = -190 + b * 40 + Math.sin(t * 0.8 + b) * 6, fl = Math.sin(t * 9 + b * 2) * 4;
      g.beginPath(); g.moveTo(bx - 6, by - fl); g.quadraticCurveTo(bx - 3, by - 3, bx, by); g.quadraticCurveTo(bx + 3, by - 3, bx + 6, by - fl); g.stroke(); }
  }
  function entW(g, it) { var s = label(it.k, it.D); if (WC[s] == null) { g.font = '700 9.8px ' + FONT; WC[s] = g.measureText(s).width; } return WC[s] + 90; }
  function tape(g, t, S, R) {
    var e = S.ext, y = TAPE.y, h = TAPE.h, list = events(R.w), xr = HEAD_X - 26, now = Date.now(), hot = S.hot === 'log';
    if (list.length) xr += entW(g, list[0]) * (1 - smooth(clamp((R.w - list[0].te) / 0.55, 0, 1)));
    var rep = TAP.dev && t - TAP.dev > 1.1 && t - TAP.dev < 3.4 ? (t - TAP.dev - 1.1) / 2.3 : -1;
    g.save(); g.beginPath(); g.rect(e.l, y, HEAD_X - 26 - e.l, h); g.clip();
    for (var i = 0; i < list.length && xr > e.l; i++) { var it = list[i], wd = entW(g, it), x = xr - wd, s = label(it.k, it.D);
      if (hot && i < 4) { g.fillStyle = 'rgba(242,169,59,' + (0.12 + 0.1 * Math.sin(t * 5 - i)).toFixed(3) + ')'; g.fillRect(x, y, wd, h); }
      if (rep >= 0) { var rx = HEAD_X - 26 - rep * 900; if (rx > x && rx < x + wd + 60) { g.fillStyle = 'rgba(49,103,202,.16)'; g.fillRect(x, y, wd, h); } }
      fillRR(g, x + 6, y + 9, 54, 18, 4, SLATE); g.font = MONO; g.fillStyle = '#FFFFFF'; g.textAlign = 'center'; g.fillText(hms(now - (R.w - it.te) * 1000), x + 33, y + 21.2); g.textAlign = 'left';
      fillE(g, x + 68, y + 18, 3.8, 3.8, EVCOL[it.k]); text(g, s, x + 76, y + 21.8, 9.8, 700, it.k === 'ok' ? GREEN : INK);
      if (it.k === 'ok') { g.save(); g.translate(x + wd - 28, y + 18); g.rotate(-0.25); g.strokeStyle = 'rgba(214,74,58,.75)'; g.lineWidth = 1.4; g.beginPath(); g.arc(0, 0, 10, 0, 7); g.stroke(); text(g, '✓', 0, 3.6, 10, 800, RED, 'center'); g.restore(); }
      g.strokeStyle = 'rgba(31,68,80,.22)'; g.lineWidth = 1; g.setLineDash([2, 3]); g.beginPath(); g.moveTo(x + wd - 2, y + 4); g.lineTo(x + wd - 2, y + h - 6); g.stroke(); g.setLineDash([]);
      xr = x; }
    if (rep >= 0) { var sx = HEAD_X - 26 - rep * 900; g.fillStyle = 'rgba(49,103,202,.55)'; g.fillRect(sx, y, 3, h); }
    g.restore();
    /* the stamping head: the hammer drops on every print, the lamp flashes; PAUSED while the kill switch is pulled */
    var since = list.length ? R.w - list[0].te : 9, hit = since < 0.25 ? Math.sin(since / 0.25 * Math.PI) : 0;
    fillRR(g, HEAD_X - 9, TAPE.y + 6 + hit * 8, 18, 10, 2, BRASS_D); fillE(g, HEAD_X + 16, TAPE.y + 24, 3.4, 3.4, S.paused ? RED : since < 0.4 ? '#7FF0CF' : '#2E5A50');
    if (rep >= 0) { fillRR(g, HEAD_X - 60, TAPE.y + TAPE.h + 8, 50, 14, 7, BLUE); text(g, '↺ REPLAY', HEAD_X - 35, TAPE.y + TAPE.h + 17.6, 6.8, 800, '#FFFFFF', 'center'); }
    if (S.paused) { var on = (t % 0.8) < 0.5; fillRR(g, HEAD_X - 86, TAPE.y + 4, 56, 24, 5, on ? AMBER : '#FFF1D6'); text(g, 'PAUSED', HEAD_X - 58, TAPE.y + 19.4, 9, 800, on ? INK : '#8A5A12', 'center'); }
  }
  function shuttle(g, x, cy, t, R, S) {
    var dir = R.moving ? (R.u > 0.68 ? -1 : 1) : 0, sway = R.moving ? Math.sin(t * 3) * 0.04 : 0, lx = dir * 3, bl = ((t + 1.3) % 3.4) < 0.12;
    [-16, 16].forEach(function (d) { fillE(g, x + d, RAIL + 2, 6, 6, '#5C6B7A'); fillE(g, x + d, RAIL + 2, 2.2, 2.2, '#C9D3DE'); });
    fillRR(g, x - 22, RAIL + 6, 44, 6, 2, SLATE_D);
    g.save(); g.translate(x, RAIL + 10); g.rotate(sway);
    fillRR(g, -30, 0, 60, 34, 11, BLUE); fillRR(g, -30, 0, 60, 9, 7, '#5B8DEF'); fillRR(g, -19, 7, 38, 20, 6, '#EAF2FF');
    if (bl) { g.fillStyle = INK; g.fillRect(-10 + lx, 16, 6, 2); g.fillRect(4 + lx, 16, 6, 2); } else { fillE(g, -7 + lx, 17, 2.6, 3.4, INK); fillE(g, 7 + lx, 17, 2.6, 3.4, INK); }
    g.strokeStyle = INK; g.lineWidth = 1.4; g.beginPath(); g.arc(lx, 20, 4, 0.3, Math.PI - 0.3); g.stroke();
    if (R.phase === 'scan') { fillE(g, -12 + lx, 22, 2.4, 1.6, 'rgba(255,120,140,.5)'); fillE(g, 12 + lx, 22, 2.4, 1.6, 'rgba(255,120,140,.5)'); }
    g.fillStyle = '#7A869C'; g.fillRect(20, -8, 2, 9); fillE(g, 21, -9, 3.2, 3.2, S.paused ? RED : (t % 1) < 0.5 ? '#7FF0CF' : '#3FBF9F');
    text(g, 'AGENT', 0, 32, 5.6, 800, 'rgba(255,255,255,.85)', 'center');
    g.restore();
    fillRR(g, x - 9, RAIL + 44, 18, 6, 3, SLATE_D);
    g.strokeStyle = '#5C6B7A'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(x, RAIL + 50); g.lineTo(x, cy); g.stroke();
    fillRR(g, x - 9, cy, 18, 8, 3, SLATE); g.strokeStyle = SLATE_D; g.lineWidth = 2.2; g.beginPath(); g.moveTo(x - 7, cy + 7); g.lineTo(x - 9, cy + 13); g.moveTo(x + 7, cy + 7); g.lineTo(x + 9, cy + 13); g.stroke();
  }
  function paintLive(g, t, now, S) {
    var e = S.ext, R = S.R, u = R.u, D = R.D, P = R.P, v = u;
    /* capsules zipping along the ceiling tube now and then */
    for (var c = 0; c < 2; c++) { var per = 7 + c * 3, ph = ((t + c * 4.1) % per) / per; if (ph > 0.4) continue; var dir = c ? -1 : 1, span = e.r - e.l + 100, cx = dir > 0 ? e.l - 40 + ph / 0.4 * span : e.r + 40 - ph / 0.4 * span;
      fillRR(g, cx - 11, CT - 4.5, 22, 9, 4.5, c ? '#C9D3DE' : BRASS); fillRR(g, cx - 3, CT - 4.5, 2, 9, 1, tone(BRASS, 0.3)); }
    tape(g, t, S, R);
    /* the wall clock */
    CO.clock(g, 510, 30, 17, 8, BRASS);
    /* the inbox: the NEW lamp, the next letter dropping down the chute, the letter waiting in the basket */
    var newOn = u > 0.86 || u < 0.07; fillE(g, CHUTE + 18, 118, 6.4, 6.4, newOn && (t % 0.5) < 0.3 ? RED : '#5A2A24'); text(g, 'NEW', CHUTE + 18, 133, 5.6, 800, newOn ? RED : '#9AA6BC', 'center');
    if (u > 0.86 && u < 0.92) { var f = (u - 0.86) / 0.06; env(g, CHUTE, 196 + 76 * f * f, 30, 20, R.N.col, Math.sin(f * 6) * 0.3, R.N.tag); }
    else if (u >= 0.92) env(g, CHUTE, 274, 30, 20, R.N.col, 0.06, R.N.tag);
    else if (u < 0.07) env(g, CHUTE, 274, 30, 20, D.col, 0.06, D.tag);
    /* the pigeonhole wall: the slot of this letter lights while it is scanned; the tag */
    var cw = (SORT.w - 16) / 5, rh = (SORT.h - 24) / 4;
    if (u > 0.24 && u < 0.42) { var sx0 = SORT.x + 8 + D.slot * cw; g.strokeStyle = 'rgba(127,240,207,' + (0.6 + 0.4 * Math.sin(t * 10)).toFixed(2) + ')'; g.lineWidth = 2.4; rr(g, sx0 + 1, SORT.y + 18, cw - 2, rh * 4 - 2, 3); g.stroke(); fillRR(g, sx0 + 1, SORT.y + 4, cw - 2, 10, 2, '#7FF0CF'); text(g, SLOTS[D.slot], sx0 + cw / 2, SORT.y + 11.8, 6, 800, SLATE_D, 'center'); }
    if (S.hot === 'classify') { var hc = Math.floor(t * 2) % 5; g.fillStyle = 'rgba(127,240,207,.35)'; g.fillRect(SORT.x + 8 + hc * cw + 1, SORT.y + 18, cw - 2, rh * 4 - 2); }
    /* the record cabinet: a drawer slides out and the record card flies up to the agent; the Odoo screen */
    var dOut = u > 0.44 && u < 0.58 ? Math.sin(clamp((u - 0.44) / 0.14, 0, 1) * Math.PI) : 0, drx = CAB.x + 50, dry = CAB.y + 8 + 49;
    if (dOut > 0.01) { var dz = dOut * 10; fillRR(g, drx - 4, dry - dz * 0.6, 50, 10 + dz, 3, '#B79AB0'); for (var ic = 0; ic < 5; ic++) fillRR(g, drx + 2 + ic * 8, dry - dz * 0.6 - 4 + (ic % 2), 6, 9, 1, '#FFFFFF'); fillRR(g, drx - 4, dry + dz * 0.4, 50, 44, 4, '#9C7392'); fillRR(g, drx + 7, dry + 8 + dz * 0.4, 28, 11, 2, '#FFFFFF'); fillRR(g, drx + 13, dry + 27 + dz * 0.4, 16, 5, 2.5, BRASS); }
    if (u > 0.47 && u < 0.52) { var cf = smooth((u - 0.47) / 0.05); sheet(g, lerp(drx + 21, R.sx + 12, cf), lerp(dry, R.cy + 22, cf) - Math.sin(cf * Math.PI) * 30, 18, 13, cf * 6.2, PUR); }
    var mx = MON.x, my = MON.y; fillRR(g, mx, my, MON.w, MON.h, 2, '#FFFFFF'); fillRR(g, mx, my, MON.w, 11, 2, PUR); text(g, 'Odoo · ' + (u > 0.4 && u < 0.62 ? D.mod : 'Records'), mx + 4, my + 8, 6, 800, '#FFFFFF');
    if (u > 0.4 && u < 0.62) { var fnd = u > 0.5; text(g, D.rec, mx + 5, my + 21, 6.6, 800, INK); [D.l1, D.l2].forEach(function (l, i) { var yy = my + 27 + i * 12; fillRR(g, mx + 4, yy, MON.w - 8, 10, 2, fnd ? '#EAF7F1' : '#F4F6FA'); text(g, l, mx + 8, yy + 7.2, 5.8, 700, '#3D4560');
        if (fnd && u > 0.5 + i * 0.03) text(g, '✓', mx + MON.w - 10, yy + 7.6, 7, 800, GREEN, 'center'); else if (!fnd) fillE(g, mx + MON.w - 10, yy + 5, 1.6 + Math.abs(Math.sin(t * 8 + i)) * 1.4, 1.6 + Math.abs(Math.sin(t * 8 + i)) * 1.4, '#9AA6BC'); }); }
    else { for (var l = 0; l < 4; l++) { var yy2 = my + 15 + l * 10, hi = Math.floor(t * 1.2) % 4 === l; fillRR(g, mx + 4, yy2, MON.w - 8, 8, 2, hi ? '#F3ECF1' : '#F6F8FA'); g.fillStyle = '#C9D3E3'; g.fillRect(mx + 8, yy2 + 3, 30 + (l * 7) % 20, 2); fillRR(g, mx + MON.w - 22, yy2 + 2, 14, 4, 2, [GREEN, AMBER, BLUE, PUR][l]); } }
    /* the drafting press: rollers turn, the display, the prepared sheet out and down the chute */
    var printing = u > 0.66 && u < 0.86, ang = printing ? R.w * 9 : 0, pd = PRESS;
    [[604, 170], [654, 170]].forEach(function (p, i) { g.save(); g.translate(p[0], p[1]); g.rotate(i ? -ang : ang); g.strokeStyle = BRASS_L; g.lineWidth = 2.4; for (var s = 0; s < 3; s++) { g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(s * 2.09) * 15, Math.sin(s * 2.09) * 15); g.stroke(); } fillE(g, 0, 0, 4, 4, BRASS); g.restore(); });
    var dsp = u > 0.62 && u < 0.68 ? ['FEEDING', '#FFD84A'] : printing ? ['DRAFTING' + '...'.slice(0, 1 + Math.floor(t * 3) % 3), '#7FF0CF'] : u >= 0.86 || u < 0.05 ? [(u >= 0.86 ? D : P).draft.toUpperCase() + ' ✓', '#7FF0CF'] : ['READY', '#5F8F9C'];
    text(g, dsp[0], pd.x + 61, pd.y + 34, 8, 800, dsp[1], 'center');
    if (u > 0.62 && u < 0.68) { g.fillStyle = 'rgba(255,216,74,' + (0.4 + 0.3 * Math.sin(t * 14)).toFixed(2) + ')'; g.fillRect(pd.x + 30, pd.y - 4, 62, 5); }
    if (u > 0.8 && u < 0.84) { var of = (u - 0.8) / 0.04; sheet(g, 690 + of * 8, 205, 24, 16, 0, BLUE); }
    else if (u >= 0.84 && u < 0.94) { var sf = (u - 0.84) / 0.1, ef = sf * sf; sheet(g, lerp(698, 726, ef), lerp(205, 356, ef), 24, 16, 1.36 * Math.min(1, sf * 3) - 1.36 + 0.2, BLUE); }
    /* the guardrails rows glow with what the agent is doing */
    var waiting = u > 0.94 || v < 0.145, row = S.paused ? 1 : waiting ? 1 : 0, gy = GUARD.y + 27 + row * 23; g.strokeStyle = row ? AMBER : GREEN; g.lineWidth = 1.6 + Math.sin(t * 6) * 0.6; rr(g, GUARD.x + 6, gy, GUARD.w - 12, 20, 4); g.stroke();
    /* the gate: the signal lamp, the barrier, the kill switch lever */
    var amber = S.paused || (waiting && (t % 0.9) < 0.6), green = !S.paused && v >= 0.145 && v < 0.46;
    fillE(g, POST, 166, 6.4, 6.4, amber ? AMBER : '#4A3A1E'); fillE(g, POST, 190, 6.4, 6.4, green ? '#2BC48A' : '#1F3A2C');
    if (amber) { g.fillStyle = 'rgba(242,169,59,.25)'; g.beginPath(); g.arc(POST, 166, 13, 0, 7); g.fill(); } if (green) { g.fillStyle = 'rgba(43,196,138,.25)'; g.beginPath(); g.arc(POST, 190, 13, 0, 7); g.fill(); }
    g.save(); g.translate(BAR.x, BAR.y); g.rotate(R.bar); for (var bs = 0; bs < 8; bs++) fillRR(g, 6 + bs * 14.5, -3.5, 14.5, 7, bs === 0 ? 2 : bs === 7 ? 3.5 : 0, bs % 2 ? '#FFFFFF' : RED); fillE(g, 0, 0, 5, 5, '#3A4458'); g.restore();
    var lv = TAP.lever && t - TAP.lever < PAUSE_LEN + 0.4 ? clamp(Math.min((t - TAP.lever) / 0.25, (PAUSE_LEN + 0.4 - (t - TAP.lever)) / 0.4), 0, 1) : 0;
    g.save(); g.translate(POST, 236); g.rotate(-0.7 + lv * 1.5); fillRR(g, -2.5, -22, 5, 22, 2, '#3A4458'); fillE(g, 0, -24, 6, 6, RED); fillE(g, -1.6, -25.6, 2, 2, 'rgba(255,255,255,.6)'); g.restore();
    /* sent: the capsule rises through its glass tube and races off along the ceiling */
    if (v > 0.36 && v < 0.6) { var cx2 = TUBES[P.dest], cu = (v - 0.36) / 0.11;
      var byy = BEND[P.dest];
      if (cu < 1) { var cyy = lerp(BAR.y - 14, byy + 8, cu * cu); fillRR(g, cx2 - 4.5, cyy - 11, 9, 22, 4.5, BRASS); fillRR(g, cx2 - 4.5, cyy - 2, 9, 3, 1, tone(BRASS, 0.3));
        g.strokeStyle = 'rgba(255,255,255,.8)'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(cx2 - 2, cyy + 14); g.lineTo(cx2 - 2, cyy + 30); g.moveTo(cx2 + 2, cyy + 16); g.lineTo(cx2 + 2, cyy + 26); g.stroke(); }
      else if (cu < 2.1) { var hx = lerp(cx2 + 8, FLANGE - 6, (cu - 1) / 1.1); g.save(); g.beginPath(); g.rect(cx2 - 10, byy - 10, FLANGE - 4 - cx2 + 10, 20); g.clip(); fillRR(g, hx - 11, byy - 4.5, 22, 9, 4.5, BRASS); fillRR(g, hx + 2, byy - 4.5, 3, 9, 1, tone(BRASS, 0.3));
        g.strokeStyle = 'rgba(255,255,255,.8)'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(hx - 14, byy - 2); g.lineTo(hx - 30, byy - 2); g.moveTo(hx - 16, byy + 2); g.lineTo(hx - 26, byy + 2); g.stroke(); g.restore(); } }
    if (v > 0.34 && v < 0.4) { var pf = 1 - (v - 0.34) / 0.06; g.strokeStyle = 'rgba(255,255,255,' + pf.toFixed(2) + ')'; g.lineWidth = 2; g.beginPath(); g.arc(TUBES[P.dest], BAR.y, 14 + (1 - pf) * 10, 0, 7); g.stroke(); }
    /* the follow-up card drops into the tickler; the bell; the next date */
    var T0 = TICK, day = (P.dest + 1) % 5, cardIn = v > 0.52 ? smooth(clamp((v - 0.52) / 0.06, 0, 1)) : 0;
    if (v > 0.52 && v < 0.62) { var cy3 = lerp(T0.y - 30, T0.y + 40, cardIn); fillRR(g, T0.x + 5 + day * 15.4, cy3, 15, 22, 2, '#FFF1D6'); g.fillStyle = '#E07B12'; g.fillRect(T0.x + 8 + day * 15.4, cy3 + 4, 9, 2); }
    var fl = v > 0.56 && v < 0.98; g.save(); g.translate(T0.x + 6 + day * 15.4 + 6.5, T0.y + 26); fillRR(g, -1, -18 * (fl ? 1 : 0.3), 2, 18 * (fl ? 1 : 0.3), 1, '#7A5236'); if (fl) { g.fillStyle = '#E07B12'; g.beginPath(); g.moveTo(1, -18); g.lineTo(11, -14); g.lineTo(1, -10); g.closePath(); g.fill(); } g.restore();
    var bw = v > 0.58 && v < 0.7 ? Math.sin((v - 0.58) * 120) * 0.5 * (0.7 - v) / 0.12 : 0; g.save(); g.translate(T0.x + T0.w - 12, T0.y + 6); g.rotate(bw); g.fillStyle = BRASS; g.beginPath(); g.moveTo(-7, 8); g.quadraticCurveTo(-6, -4, 0, -5); g.quadraticCurveTo(6, -4, 7, 8); g.closePath(); g.fill(); fillE(g, 0, 9, 2, 2, BRASS_D); g.restore();
    text(g, 'Next: ' + P.fol, T0.x + T0.w / 2, T0.y + 82, 6.4, 800, '#FFFFFF', 'center'); text(g, DEST[P.dest].toLowerCase() === 'odoo' ? 'Accounting' : 'in 3 days', T0.x + T0.w / 2, T0.y + 93, 5.6, 700, BRASS_L, 'center');
    /* the agent itself, on the rail */
    var carry = u > 0.07 && u < 0.655, x = R.sx, cy = R.cy, low = u > 0.62 && u < 0.68;
    if (R.phase === 'scan') { var sw = Math.sin(t * 5) * 10; g.fillStyle = 'rgba(127,240,207,.22)'; g.beginPath(); g.moveTo(x - 6, RAIL + 34); g.lineTo(x - 24 + sw, cy + 36); g.lineTo(x + 24 + sw, cy + 36); g.lineTo(x + 6, RAIL + 34); g.closePath(); g.fill();
      g.strokeStyle = 'rgba(127,240,207,.9)'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(x - 18 + sw, cy + 14 + Math.sin(t * 7) * 6); g.lineTo(x + 18 + sw, cy + 14 + Math.sin(t * 7) * 6); g.stroke(); }
    shuttle(g, x, cy, t, R, S);
    if (carry) { g.save(); if (low) { g.beginPath(); g.rect(x - 40, cy - 30, 80, PRESS.y + 2 - cy + 30); g.clip(); }
      if (u > 0.52) sheet(g, x + 10, cy + 20, 18, 13, 0.18, PUR); env(g, x, cy + 22, 30, 20, D.col, Math.sin(t * 2.4) * 0.05, D.tag); g.restore(); }
    if (u > 0.29 && u < 0.42) { var ta = clamp((u - 0.29) / 0.02, 0, 1), tw = 108, tx = x - tw - 22, ty = cy + 8; g.save(); g.globalAlpha = ta; fillRR(g, tx, ty, tw, 22, 6, '#FFFFFF'); fillRR(g, tx, ty, 4, 22, 2, D.tag);
      text(g, D.kind, tx + 9, ty + 9.6, 6.8, 800, INK); text(g, 'confidence ' + D.pct + '%', tx + 9, ty + 18, 5.8, 700, '#5C6B7A'); g.strokeStyle = 'rgba(255,255,255,.9)'; g.lineWidth = 1; g.beginPath(); g.moveTo(tx + tw, ty + 11); g.lineTo(x - 15, cy + 20); g.stroke(); g.restore(); }
    /* the tea trolley's kettle steam (beyond the frame, left) */
    if (e.l < 0) { g.strokeStyle = 'rgba(160,170,190,.5)'; g.lineWidth = 1.6; for (var st = 0; st < 3; st++) { var sy = 352 - ((t * 16 + st * 9) % 30); g.beginPath(); g.moveTo(-88 + st * 3, sy + 10); g.quadraticCurveTo(-84 + st * 3 + Math.sin(t * 2 + st) * 4, sy + 4, -88 + st * 3, sy - 2); g.stroke(); } }
    cornerBack(g, t, S);
    CO.crew(CREW, g, t, S, false);
  }

  /* ---------------- the card's corner, live: clock, pendant lamp, the franking machine, the INWARD slots, conveyors, the hand truck ---------------- */
  var LIFE = { slot: -1, slotT: -9 };
  function cornerBack(g, t, S) {
    var e = S.ext; if (e.l > 140) return;
    var sw = Math.sin(t * 0.7) * 0.05; g.save(); g.translate(-390, RAIL + 4); g.rotate(sw);
    g.fillStyle = 'rgba(255,240,190,.26)'; g.beginPath(); g.moveTo(-9, 32); g.lineTo(9, 32); g.lineTo(30, 66); g.lineTo(-30, 66); g.closePath(); g.fill();
    g.strokeStyle = '#5C6B7A'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 20); g.stroke();
    g.fillStyle = SLATE; g.beginPath(); g.moveTo(-5, 20); g.lineTo(5, 20); g.lineTo(14, 32); g.lineTo(-14, 32); g.closePath(); g.fill(); fillE(g, 0, 32, 5, 2.6, '#FFF3C4'); g.restore();
    /* the franking machine: a letter feeds through every few seconds and comes out franked */
    var fx = -440, fu = (t % 5.2) / 5.2, on = fu > 0.18 && fu < 0.5;
    if (fu < 0.52) { var ex = lerp(fx - 4, fx + 98, smooth(Math.min(1, fu / 0.5))); g.save(); g.beginPath(); g.rect(fx - 40, 340, 48, 60); g.rect(fx + 82, 340, 46, 60); g.clip(); env(g, ex, 389, 20, 12, '#FFFFFF', 0, ex > fx + 60 ? RED : BLUE); g.restore(); }
    text(g, on ? 'FRANKING' : 'READY', fx + 33, 380.4, 5.6, 800, on ? '#FFD84A' : '#7FF0CF', 'center');
    fillE(g, fx + 78, 369.5, 1.8, 1.8, on && (t % 0.3) < 0.15 ? RED : '#9AA6BC');
    /* the slot the mail-room lead just posted into glows */
    if (t - LIFE.slotT < 1.3 && LIFE.slot >= 0) { var sl = slotAt(LIFE.slot), a = 1 - (t - LIFE.slotT) / 1.3; g.strokeStyle = 'rgba(127,240,207,' + a.toFixed(2) + ')'; g.lineWidth = 2.2; rr(g, sl[0] - sl[2] / 2 + 1, sl[1] - sl[3] / 2 + 1, sl[2] - 2, sl[3] - 2, 2); g.stroke(); }
  }
  var PCOL = [['#C99A6B', '#E8C27A'], ['#FFFFFF', RED], ['#E6CFA3', BLUE], ['#D9B98C', '#E8C27A']];
  function parcels(g, t, c, idx) {
    var L = c.x1 - c.x0 - 34, span = L + 28, gap = span / c.n;
    for (var k = 0; k < c.n; k++) { var d = (t * c.sp + k * gap + c.ph * 40) % span, x = c.x0 + 12 + d, a = 1, drop = 0, kind = (k + idx) % 4;
      if (d > L) { var f = (d - L) / 28; a = 1 - f; drop = f * f * 18; } else if (d < 10) a = d / 10;
      g.save(); g.globalAlpha = a; g.translate(x, c.y - 4 + drop); if (drop) g.rotate(drop * 0.02);
      if (kind === 1) { for (var q = 0; q < 3; q++) env(g, 0, -5 - q * 4, 24, 12, ['#FFFFFF', '#FFF6E0', '#EEF4FF'][q], (q - 1) * 0.06, [RED, BLUE, GREEN][q]); }
      else { var w = kind === 3 ? 30 : 24, h = kind === 3 ? 18 : 16; fillRR(g, -w / 2, -h, w, h, 2, PCOL[kind][0]); g.fillStyle = 'rgba(0,0,0,.08)'; g.fillRect(-w / 2, -h, w, 3); fillRR(g, -2.5, -h, 5, h, 1, PCOL[kind][1]); if (kind === 2) fillRR(g, 3, -h + 4, 8, 6, 1, '#FFFFFF'); }
      g.restore(); }
  }
  function truck(g, t, P) {
    var x = TRUCK.x, b = TRUCK.y; g.save(); g.translate(x, b - 6); g.rotate(P.rock || 0); g.translate(-x, -(b - 6));
    fillRR(g, x - 23, b - 152, 5, 148, 2, '#3A4458'); fillRR(g, x + 18, b - 152, 5, 148, 2, '#3A4458'); [b - 46, b - 96].forEach(function (y) { fillRR(g, x - 22, y, 44, 4, 2, '#5C6B7A'); });
    g.strokeStyle = '#3A4458'; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.moveTo(x - 20, b - 150); g.quadraticCurveTo(x, b - 172, x + 20, b - 150); g.stroke();
    sack(g, x - 27, b - 52, 54, 48, '#E3D2B0', 'IN', true); sack(g, x - 23, b - 92, 46, 42, '#D9C49C', '', true);
    fillRR(g, x - 27, b - 6, 54, 6, 2, '#5C6B7A'); [-28, 28].forEach(function (d) { fillE(g, x + d, b - 8, 5, 11, '#2A3142'); fillE(g, x + d, b - 8, 1.8, 4, '#9AA6BC'); });
    g.restore();
    /* the top parcel: on the stack, or held high on a tap */
    var hl = handAt(P, 0), hr = handAt(P, 1), lf = P.lift || 0, bx = lerp(x, (hl[0] + hr[0]) / 2, lf), by = lerp(b - 92, Math.min(hl[1], hr[1]) + 4, lf);
    fillRR(g, bx - 16, by - 22, 32, 22, 3, '#C99A6B'); g.fillStyle = 'rgba(0,0,0,.08)'; g.fillRect(bx - 16, by - 22, 32, 4); fillRR(g, bx - 3, by - 22, 6, 22, 1, '#E8C27A'); fillRR(g, bx + 5, by - 16, 9, 7, 1, '#FFFFFF');
    if (lf > 0.6) { var ta = (lf - 0.6) / 0.4; g.save(); g.globalAlpha = ta; fillRR(g, bx - 34, by - 50, 68, 18, 9, GREEN); text(g, 'DELIVERED ✓', bx, by - 37.6, 7.6, 800, '#FFFFFF', 'center'); g.restore(); }
  }
  function cornerFront(g, t, S) {
    var e = S.ext;
    parcels(g, t, CONV[1], 1);
    if (e.l > 140) return;
    parcels(g, t, CONV[0], 0);
    /* the mail-room lead: the bundle, the scanner and its beam, the letters she posts or throws */
    var P = SRT, hl = handAt(P, 0), hr = handAt(P, 1);
    for (var q = 0; q < 3; q++) env(g, hl[0] + 2, hl[1] - 6 - q * 3, 22, 13, ['#FFFFFF', '#FFF6E0', '#EEF4FF'][q], -0.1 + q * 0.06, [RED, BLUE, GREEN][q]);
    if (P.letter) env(g, hr[0] + 6, hr[1] - 6, 20, 12, '#FFF6E0', -0.3, BLUE);
    else if (!P.fly && !P.pocket) { fillRR(g, hr[0] - 4, hr[1] - 12, 9, 16, 3, '#3A4458'); fillRR(g, hr[0] - 3, hr[1] - 17, 13, 7, 3, '#2A3142'); fillE(g, hr[0] + 9, hr[1] - 13.5, 1.6, 1.6, P.scan && (t % 1.2) < 0.15 ? '#7FF0CF' : RED);
      if (P.scan && (t % 1.2) < 0.5) { g.strokeStyle = 'rgba(214,74,58,.75)'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(hr[0] + 10, hr[1] - 13); g.lineTo(hl[0] - 6, hl[1] - 10); g.lineTo(hl[0] + 12, hl[1] - 8); g.closePath(); g.stroke(); } }
    if (P.fly) { var sl = slotAt((P.fly.n * 4 + 1) % 12), f = Math.min(1, P.fly.f / 0.55); if (f < 1) env(g, lerp(hr[0], sl[0], f), lerp(hr[1], sl[1], f) - Math.sin(f * Math.PI) * 40, 18, 11, '#FFFFFF', f * 6.28, [RED, BLUE, GREEN][P.fly.n % 3]); }
    if (TAP.srt && t - TAP.srt > 1.9 && t - TAP.srt < 3.2) { var su = (t - TAP.srt - 1.9) / 1.3; g.save(); g.globalAlpha = Math.min(1, (1 - su) * 3); fillRR(g, P.x - 30, P.y - 330 - su * 16, 60, 18, 9, SLATE); text(g, 'SORTED ✓', P.x, P.y - 317.4 - su * 16, 7.6, 800, '#7FF0CF', 'center'); g.restore(); }
    /* the courier: the hand truck, the delivery slip, the watch */
    var C = COU, cl = handAt(C, 0); truck(g, t, C);
    if (C.slip) { g.save(); g.translate(cl[0] + 4, cl[1] - 10); g.rotate(-0.12); fillRR(g, -9, -12, 18, 24, 2, '#FFFFFF'); fillRR(g, -9, -12, 18, 5, 2, '#F2A93B'); g.fillStyle = '#C9D3E3'; for (var ln = 0; ln < 3; ln++) g.fillRect(-6, -3 + ln * 4.4, 12 - ln * 3, 1.6); if (C.tick) text(g, '✓', 5, 10, 8, 800, GREEN, 'center'); g.restore(); }
    if (C.watch) { fillE(g, cl[0], cl[1] - 4, 4.4, 4.4, '#2A3142'); fillE(g, cl[0], cl[1] - 4, 3, 3, '#FFFFFF'); }
  }
  /* ---------------- in front of the cast: desk screens, props in hands, the tray, effects ---------------- */
  function paintFrontLive(g, t, S) {
    var R = S.R, u = R.u, v = u, D = R.D, P = R.P;
    CO.crew(CREW, g, t, S, true);
    cornerFront(g, t, S);
    /* the developer's monitor: the live trace of the run */
    var mx = 664, my = 322; fillRR(g, mx, my, 36, 56, 2, '#14232B'); text(g, 'TRACE', mx + 3, my + 7, 5, 800, '#7FF0CF');
    var steps = ['in', 'cls', 'rec', 'dft', 'wait', 'ok', 'sent'], stepU = [0, 0.3, 0.52, 0.8, 0.96, 1.15, 1.38];
    steps.forEach(function (k, i) { var y = my + 11 + i * 6.3, done = u >= (stepU[i] % 1) && stepU[i] < 1, cur = stepU[i] >= 1 ? v >= stepU[i] - 1 : done; fillE(g, mx + 5, y + 2, 1.6, 1.6, cur ? EVCOL[k] : '#3A4A55'); g.fillStyle = cur ? 'rgba(200,230,240,.75)' : 'rgba(120,140,160,.4)'; g.fillRect(mx + 9, y + 1.2, 10 + (i * 5) % 14, 1.8); });
    if ((t % 1) < 0.5) g.fillRect(mx + 9, my + 54, 4, 1.4);
    /* the letter landed in the gate tray; the approver's document in hand, stamped, slid into the tube */
    var trayD = u >= 0.94 ? D : v < 0.05 ? P : null;
    if (trayD) { var land = u >= 0.94 ? clamp((u - 0.94) / 0.02, 0, 1) : 1; sheet(g, 732, 366 - (1 - land) * 6, 26, 14, -0.04, BLUE); }
    var hl = handAt(APR, 0), hr = handAt(APR, 1);
    if (!TAP.apr || t - TAP.apr > 2.8) {
      if (v >= 0.05 && v < 0.12) sheet(g, hl[0] + 4, hl[1] - 10, 28, 20, -0.2, BLUE);
      else if (v >= 0.12 && v < 0.24) { sheet(g, 776, 366, 28, 15, 0.02, BLUE); if (v > 0.142) stampMark(g, 776, 367, 0.42, clamp((v - 0.142) / 0.01, 0, 1)); }
      else if (v >= 0.24 && v < 0.35) { var mf = smooth((v - 0.24) / 0.11), tx = TUBES[P.dest], sc = 1 - Math.max(0, mf - 0.7) / 0.3 * 0.8; g.save(); g.globalAlpha = sc;
        sheet(g, lerp(776, tx, mf), mf < 0.5 ? 366 : lerp(366, BAR.y, (mf - 0.5) * 2), 28 * sc, 15 * sc, 0.02, BLUE); stampMark(g, lerp(776, tx, mf), (mf < 0.5 ? 367 : lerp(367, BAR.y, (mf - 0.5) * 2)), 0.42 * sc); g.restore(); }
    }
    /* the approver's stamp */
    var stampUp = APR.stamp; if (stampUp) { g.save(); g.translate(hr[0], hr[1]); fillRR(g, -7, -4, 14, 8, 2, '#5C3F27'); fillRR(g, -2.5, -14, 5, 11, 2, '#7A5236'); fillE(g, 0, -15, 4, 3.4, BRASS); fillRR(g, -8, 4, 16, 3, 1, RED); g.restore(); }
    if (APR.thump && t - APR.thump < 0.35) { var tu = (t - APR.thump) / 0.35; g.strokeStyle = 'rgba(214,74,58,' + (1 - tu).toFixed(2) + ')'; g.lineWidth = 1.6; [-1, 1].forEach(function (d) { g.beginPath(); g.moveTo(hr[0] + d * 10, hr[1] + 6); g.lineTo(hr[0] + d * (16 + tu * 10), hr[1] + 2 - tu * 6); g.stroke(); }); }
    if (TAP.apr && t - TAP.apr < 2.8) { var au = (t - TAP.apr) / 2.8;
      if (au < 0.4) sheet(g, 776, 366, 28, 15, 0.02, '#C2506A'); if (au > 0.08) stampMark(g, 776, 367, 0.42); if (au > 0.25) stampMark(g, 778, 364, 0.42, 0.7);
      if (au >= 0.4 && au < 0.62) { for (var pf = 0; pf < 3; pf++) { var pu = ((au - 0.4) / 0.22 + pf * 0.3) % 1; fillE(g, hr[0] + 6 + pu * 16, hr[1] - 14 - pu * 10 + pf * 4, 2 + pu * 3, 2 + pu * 3, 'rgba(200,210,225,' + (1 - pu).toFixed(2) + ')'); } }
      if (au >= 0.62) { var mxp = (hl[0] + hr[0]) / 2, myp = Math.min(hl[1], hr[1]) - 14; shadowed(g, 6, 2, 0.2, function () { fillRR(g, mxp - 30, myp - 22, 60, 40, 3, '#FFFFFF'); }); fillRR(g, mxp - 30, myp - 22, 60, 7, 3, BLUE); stampMark(g, mxp, myp + 2, 0.82); } }
    /* the reviewer: the sheet under review, the magnifier, the tick */
    var hrv = handAt(REV, 1), rc = REV.rc || 0; sheet(g, 362, 386, 30, 12, 0.02, AMBER);
    if (REV.flip) { var fu = REV.flip; g.save(); g.translate(347, 386); g.scale(Math.cos(fu * Math.PI), 1); fillRR(g, 0, -6, 30, 12, 1.5, '#FFFFFF'); g.restore(); }
    for (var tk = 0; tk < 3; tk++) if (rc > tk) text(g, '✓', 352 + tk * 8, 391, 6, 800, GREEN, 'center');
    if (REV.eye) { var ex = hrv[0], ey = hrv[1] - 6; g.strokeStyle = '#3A4458'; g.lineWidth = 3; g.beginPath(); g.moveTo(ex + 8, ey + 14); g.lineTo(ex + 16, ey + 30); g.stroke();
      fillE(g, ex, ey, 17, 17, BRASS_D); fillE(g, ex, ey, 14, 14, '#FFFFFF'); var bl = ((t * 2) % 1.4) < 0.12; if (bl) { g.fillStyle = INK; g.fillRect(ex - 9, ey - 1, 18, 2.4); } else { fillE(g, ex, ey, 9, 9, '#5C3F27'); fillE(g, ex, ey, 4.6, 4.6, INK); fillE(g, ex - 3, ey - 3, 2.2, 2.2, '#FFFFFF'); }
      fillE(g, ex - 5, ey - 7, 5, 3, 'rgba(255,255,255,.55)'); }
    else { var gx = hrv[0], gy = hrv[1] - 8; g.strokeStyle = '#3A4458'; g.lineWidth = 3; g.beginPath(); g.moveTo(gx + 5, gy + 6); g.lineTo(gx + 11, gy + 15); g.stroke(); fillE(g, gx, gy, 9, 9, BRASS_D); fillE(g, gx, gy, 7, 7, 'rgba(220,240,255,.75)'); fillE(g, gx - 2.5, gy - 2.5, 2.2, 1.6, '#FFFFFF'); }
    if (TAP.rev && t - TAP.rev > 1.5 && t - TAP.rev < 3) { var lu = (t - TAP.rev - 1.5) / 1.5, ly = REV.y - 300 - lu * 20; g.save(); g.globalAlpha = Math.min(1, (1 - lu) * 3); g.translate(REV.x, ly); g.rotate(-0.12); g.scale(0.8 + Math.min(1, lu * 6) * 0.2, 0.8 + Math.min(1, lu * 6) * 0.2);
      g.strokeStyle = GREEN; g.lineWidth = 2.2; rr(g, -36, -10, 72, 20, 4); g.stroke(); text(g, 'LOOKS RIGHT ✓', 0, 4, 8.6, 800, GREEN, 'center'); g.restore(); }
    /* the developer's mug */
    if (DEV.mug) { var hm = handAt(DEV, 0); fillRR(g, hm[0] - 6, hm[1] - 12, 12, 13, 3, '#FFFFFF'); fillRR(g, hm[0] - 6, hm[1] - 12, 12, 4, 2, BLUE); g.strokeStyle = '#FFFFFF'; g.lineWidth = 2; g.beginPath(); g.arc(hm[0] - 7, hm[1] - 6, 3.4, 1.7, 4.6); g.stroke(); }
    else { fillRR(g, 566, 380, 11, 12, 3, '#FFFFFF'); fillRR(g, 566, 380, 11, 4, 2, BLUE); g.strokeStyle = 'rgba(160,170,190,.55)'; g.lineWidth = 1.3; for (var sv = 0; sv < 2; sv++) { var sy = 374 - ((t * 12 + sv * 7) % 14); g.beginPath(); g.moveTo(569 + sv * 4, sy + 6); g.quadraticCurveTo(572 + sv * 4, sy + 3, 569 + sv * 4, sy); g.stroke(); } }
    /* the consultant's holographic workflow, drawn in the air on a tap */
    if (TAP.tn && t - TAP.tn < 3.2) { var hu = (t - TAP.tn) / 3.2, hx = TN.x, hy = TN.y - 300, cols = [BLUE, '#3FA9E0', PUR, BRASS_D, GREEN];
      g.save(); g.globalAlpha = hu > 0.85 ? (1 - hu) / 0.15 : 1;
      for (var n = 0; n < 5; n++) { var nu = clamp((hu - n * 0.12) / 0.1, 0, 1); if (nu <= 0) continue; var nx = hx - 64 + n * 32, ny = hy - 24 - Math.sin(n / 4 * Math.PI) * 26;
        if (n) { var px = hx - 64 + (n - 1) * 32, py = hy - 24 - Math.sin((n - 1) / 4 * Math.PI) * 26; g.strokeStyle = 'rgba(49,103,202,.6)'; g.lineWidth = 2; g.beginPath(); g.moveTo(px, py); g.lineTo(lerp(px, nx, nu), lerp(py, ny, nu)); g.stroke(); }
        fillRR(g, nx - 9 * nu, ny - 7 * nu, 18 * nu, 14 * nu, 4, cols[n]); if (n === 4 && hu > 0.66) text(g, '✓', nx, ny + 4, 10, 800, '#FFFFFF', 'center'); }
      g.restore(); }
  }
  /* the office cat on the sacks, a swaying fern, the front-row walkers, the particles */
  function cat(g, t) {
    var cu = TAP.cat ? (t - TAP.cat) / 2.4 : 9, awake = cu < 1, x = 958, y = 712, st = awake ? Math.sin(Math.min(1, cu * 2) * Math.PI) : 0, br = Math.sin(t * 1.6) * 0.8;
    g.save(); g.translate(x, y);
    var tw = Math.sin(t * (awake ? 6 : 1.4)) * (awake ? 0.6 : 0.3); g.strokeStyle = '#D98A3E'; g.lineWidth = 6; g.lineCap = 'round'; g.beginPath(); g.moveTo(22, 2); g.quadraticCurveTo(38, 4 + tw * 10, 34 + tw * 6, -10 - tw * 4); g.stroke();
    fillE(g, 2, 0 - st * 4, 26 + st * 8, 12 + br * 0.5 - st * 2, '#E8A050'); g.fillStyle = 'rgba(150,80,20,.35)'; for (var s = 0; s < 3; s++) g.fillRect(-6 + s * 9, -10 - st * 4, 3, 8);
    var hx = -22 - st * 8, hy = -6 - st * 8; fillE(g, hx, hy, 11, 10, '#E8A050'); g.fillStyle = '#E8A050'; [-1, 1].forEach(function (d) { g.beginPath(); g.moveTo(hx + d * 4, hy - 7); g.lineTo(hx + d * 10, hy - 15); g.lineTo(hx + d * 10, hy - 4); g.closePath(); g.fill(); });
    g.strokeStyle = INK; g.lineWidth = 1.4; if (awake) { fillE(g, hx - 4, hy, 1.8, 2.4, INK); fillE(g, hx + 4, hy, 1.8, 2.4, INK); } else { g.beginPath(); g.arc(hx - 4, hy, 2.4, 0.2, Math.PI - 0.2); g.moveTo(hx + 6.4, hy); g.arc(hx + 4, hy, 2.4, 0.2, Math.PI - 0.2); g.stroke(); }
    fillE(g, hx, hy + 4, 1.6, 1.2, '#C25A6A');
    if (!awake) { var zu = (t % 2.4) / 2.4; g.globalAlpha = 1 - zu; text(g, 'z', hx + 8 + zu * 10, hy - 14 - zu * 18, 8 + zu * 4, 800, SLATE); }
    g.restore();
  }
  function fern(g, t, x, y, s, ph) { g.save(); g.translate(x, y); g.rotate(Math.sin(t * 0.9 + ph) * 0.03); pot(g, 0, 0, s); g.restore(); }
  function paintForeLive(g, t, S) {
    K.zfore(g, t, S, [[760, function () { cat(g, t); }], [700, function () { fern(g, t, 175, 700, 0.95, 0); }]], function () { CO.crew(CREW, g, t, S, 'fore'); });
    CR.draw(g, t);
  }

  /* ---------------- the cast: an idle loop and a tap choreography each ---------------- */
  function tapped(id, st, t) { if (st.wave && st.wave !== st._my) { st._my = st.wave; TAP[id] = t; return true; } return false; }
  function lookAtNexi(P, st, t, S, base) { P.look = lerp(P.look, t < st.until ? clamp((S.nexi.x - P.x) / 160, -1, 1) : base, 0.08); }
  var castTN = { id: 'tn', behind: true, keys: ['trigger'], P: TN, act: function (P, t, S) {
    var st = S.cast.tn, R = S.R; if (tapped('tn', st, t)) CR.burst('spark', P.x, P.y - 300, t);
    P.tilt = 0; P.hop = 0; P.sx = 1;
    if (TAP.tn && t - TAP.tn < 3.2) { var u = (t - TAP.tn) / 3.2; P.talk = true; P.mood = 'happy';
      if (u < 0.7) { var a = u / 0.7; P.hands = [[-56, -214], [-40 + a * 150, -420 - Math.sin(a * Math.PI) * 50]]; P.look = -0.4 + a * 0.8; }
      else { P.hands = [[-56, -214], [96, -330]]; P.hop = Math.sin((u - 0.7) / 0.3 * Math.PI) * 14; P.tilt = -0.05; } return; }
    var c = (t + 2) % 9, busy = S.hot === 'trigger' || t < st.until; P.talk = busy; P.mood = busy ? 'happy' : 'calm';
    if (c < 4) { var tap = Math.abs(Math.sin(t * 7)) * 8; P.hands = [[-56, -214], [-12 + Math.sin(t * 1.3) * 10, -238 + tap]]; lookAtNexi(P, st, t, S, -0.3); }
    else if (c < 6.4) { var dx = R.sx - P.x; P.hands = [[-56, -214], [clamp(dx * 0.9, -90, 150), -440]]; P.mood = 'happy'; lookAtNexi(P, st, t, S, clamp(dx / 120, -1, 1)); }
    else { P.hands = [[-70, -256], [70, -190]]; P.tilt = Math.sin(t * 4) * 0.05; lookAtNexi(P, st, t, S, 0.6); }
  } };
  var castREV = { id: 'rev', behind: true, keys: ['classify'], P: REV, act: function (P, t, S) {
    var st = S.cast.rev; if (tapped('rev', st, t)) CR.burst('star', P.x, P.y - 300, t);
    P.tilt = 0; P.hop = 0; P.eye = false; P.flip = 0;
    if (TAP.rev && t - TAP.rev < 3) { var u = (t - TAP.rev) / 3; P.talk = true;
      if (u < 0.5) { P.eye = true; P.mood = 'wow'; P.hands = [[-60, -206], [36, -392]]; P.look = 0.3; P.tilt = 0.05; }
      else { P.mood = 'happy'; P.hands = [[-60, -206], [90, -320]]; P.hop = Math.sin((u - 0.5) / 0.5 * Math.PI) * 10; } return; }
    var c = (t + 1) % 8, busy = S.hot === 'classify' || t < st.until; P.talk = busy; P.mood = busy ? 'happy' : 'calm';
    P.rc = c < 5 ? Math.floor(c / 1.7) : 3;
    if (c < 5) { var k = c / 5; P.hands = [[-50, -206], [-34 + k * 90, -214 + Math.sin(c * 3) * 3]]; lookAtNexi(P, st, t, S, -0.2 + k * 0.5); }
    else if (c < 5.6) { P.hands = [[-50, -206], [56, -200 + Math.abs(Math.sin((c - 5) * 16)) * 6]]; lookAtNexi(P, st, t, S, 0.3); }
    else if (c < 6.6) { var fu = (c - 5.6); P.flip = fu; P.rc = 0; P.hands = [[-40 + fu * 30, -230 - Math.sin(fu * Math.PI) * 50], [60, -206]]; lookAtNexi(P, st, t, S, -0.2); }
    else { P.rc = 0; P.hands = [[-50, -206], [24, -386]]; P.tilt = -0.04; lookAtNexi(P, st, t, S, 0.1); }
  } };
  var castDEV = { id: 'dev', behind: true, keys: ['log', 'draft'], P: DEV, act: function (P, t, S) {
    var st = S.cast.dev; if (tapped('dev', st, t)) CR.burst('code', P.x, P.y - 290, t);
    P.tilt = 0; P.hop = 0; P.sx = 1; P.mug = false;
    if (TAP.dev && t - TAP.dev < 3.4) { var u = (t - TAP.dev) / 3.4; P.talk = true; P.mood = 'happy';
      if (u < 0.32) { P.sx = Math.cos(u / 0.32 * Math.PI * 2); P.hop = Math.sin(u / 0.32 * Math.PI) * 16; P.hands = [[-90, -260], [90, -260]]; }
      else { var k = Math.abs(Math.sin(t * 22)) * 10; P.hands = [[-60, -206 - k], [80, -420 + Math.sin(t * 6) * 6]]; P.look = -0.5; } return; }
    var c = (t + 4) % 10, busy = S.hot === 'log' || S.hot === 'draft' || t < st.until; P.talk = busy; P.mood = busy ? 'happy' : 'calm';
    if (c < 5.5) { var k2 = Math.abs(Math.sin(t * 11)) * 6; P.hands = [[-50, -206 - k2], [40, -206 - (6 - k2)]]; lookAtNexi(P, st, t, S, 0.75); }
    else if (c < 7.5) { var su = (c - 5.5) / 2, up = Math.sin(su * Math.PI); P.mug = true; P.hands = [[-56 + up * 40, -210 - up * 140], [40, -206]]; P.tilt = -up * 0.08; lookAtNexi(P, st, t, S, 0); }
    else { P.hands = [[-50, -206], [70, -400]]; P.tilt = 0.05; lookAtNexi(P, st, t, S, -0.3); }
  } };
  var castAPR = { id: 'apr', behind: true, keys: ['gate'], P: APR, act: function (P, t, S) {
    var st = S.cast.apr, R = S.R, v = R.u; if (tapped('apr', st, t)) CR.burst('star', P.x, P.y - 300, t);
    P.tilt = 0; P.hop = 0; P.stamp = true;
    if (TAP.apr && t - TAP.apr < 2.8) { var u = (t - TAP.apr) / 2.8; P.talk = true; P.mood = 'happy';
      if (u < 0.4) { var b = (u / 0.4) * 2 % 1, dn = b > 0.5; P.hands = [[-60, -204], [26, dn ? -212 : -320]]; if (dn && !st._t) { st._t = true; P.thump = t; } if (!dn) st._t = false; }
      else if (u < 0.62) { P.hands = [[-60, -204], [30, -350]]; P.tilt = -0.06; }
      else { if (!st._c) { st._c = true; CR.burst('conf', P.x, P.y - 340, t); } P.stamp = false; P.hands = [[-40, -400], [40, -400]]; P.hop = Math.sin((u - 0.62) / 0.38 * Math.PI) * 14; } return; }
    st._c = false;
    var busy = S.hot === 'gate' || t < st.until; P.talk = busy; P.mood = busy ? 'happy' : 'calm';
    if (v < 0.05) { P.hands = [[-68, -206], [64, -214]]; P.look = lerp(P.look, -0.7, 0.15); }
    else if (v < 0.12) { P.hands = [[-34, -300], [64, -214]]; P.look = lerp(P.look, -0.3, 0.15); P.tilt = -0.05; }
    else if (v < 0.17) { var sd = v < 0.14 ? (v - 0.12) / 0.02 : 1, dn2 = v >= 0.138; P.hands = [[-20, -205], [26, dn2 ? -212 : -214 - sd * 110]]; if (dn2 && !st._s) { st._s = true; P.thump = t; CR.burst('spark', P.x + 10, 370, t); } P.mood = dn2 ? 'happy' : 'wow'; }
    else if (v < 0.26) { st._s = false; P.hands = [[-20 + (v - 0.17) / 0.09 * 70, -205], [64, -214]]; P.mood = 'happy'; P.look = lerp(P.look, 0.6, 0.15); }
    else { st._s = false; var c = (t + 3) % 7; if (R.u >= 0.94) { P.hands = [[-60, -204], [64, -214]]; P.look = lerp(P.look, -0.8, 0.12); }
      else if (c < 2.6) { var up = Math.sin(c / 2.6 * Math.PI); P.hands = [[-60 + up * 30, -206 - up * 120], [64, -214]]; P.stamp = true; lookAtNexi(P, st, t, S, 0); }
      else { var tp = Math.abs(Math.sin(t * 6)) * 6; P.hands = [[-40, -206 - tp], [40, -214 + tp]]; lookAtNexi(P, st, t, S, -0.3); } }
  } };

  /* the mail-room lead (TechNext): scans the bundle, posts a letter into the INWARD frame, pushes up her glasses;
     tap: a speed sort, three letters flicked into three slots, then a spin and SORTED */
  var castSRT = { id: 'srt', behind: true, keys: [], P: SRT, act: function (P, t, S) {
    var st = S.cast.srt; if (tapped('srt', st, t)) CR.burst('star', P.x + 30, P.y - 300, t);
    var sd = P.side || 1; P.tilt = 0; P.hop = 0; P.sx = sd; P.scan = false; P.letter = false; P.fly = null; P.pocket = false;
    if (TAP.srt && t - TAP.srt < 3.2) { var u = (t - TAP.srt) / 3.2; P.talk = true; P.mood = 'happy';
      if (u < 0.6) { var k = (u / 0.6) * 3, f = k % 1, n = Math.floor(k), out = f < 0.4 ? f / 0.4 : 1 - (f - 0.4) / 0.6;
        P.hands = [[-34, -220], [lerp(40, 150, out), -300 - Math.sin(f * Math.PI) * 50]]; P.look = lerp(P.look, 0.8, 0.2); P.fly = { n: n, f: f };
        if (f > 0.55 && st._n !== n) { st._n = n; LIFE.slot = (n * 4 + 1) % 12; LIFE.slotT = t; } }
      else { var v = (u - 0.6) / 0.4; P.sx = sd * Math.cos(v * Math.PI * 2); P.hop = Math.sin(v * Math.PI) * 18; P.hands = [[-90, -400], [90, -400]]; } return; }
    st._n = -1;
    var c = (t + 3) % 9, busy = t < st.until; P.talk = busy; P.mood = busy ? 'happy' : 'calm';
    if (c < 4) { P.scan = true; P.hands = [[-34, -200], [58, -232 + Math.sin(t * 3) * 6]]; lookAtNexi(P, st, t, S, 0.1); }
    else if (c < 6.4) { var k2 = (c - 4) / 2.4, up = Math.sin(k2 * Math.PI); P.letter = k2 < 0.5; P.hands = [[-34, -200], [lerp(58, 160, up), lerp(-232, -360, up)]]; P.look = lerp(P.look, 0.8, 0.1);
      var cyc = Math.floor((t + 3) / 9); if (k2 > 0.5 && st._p !== cyc) { st._p = cyc; LIFE.slot = Math.floor(hash(cyc) * 12); LIFE.slotT = t; } }
    else { P.pocket = true; P.hands = [[-34, -200], [26, -404]]; P.tilt = Math.sin(t * 2) * 0.03; lookAtNexi(P, st, t, S, 0.2); }
  } };
  /* the courier (visitor, grey pass): reads the delivery slip and ticks it, wipes his brow, checks his watch;
     tap: tips his cap, lifts the top parcel high (DELIVERED), the hand truck rocks */
  var HANDLE = [81, -284];
  var castCOU = { id: 'cou', behind: true, keys: [], P: COU, act: function (P, t, S) {
    var st = S.cast.cou; if (tapped('cou', st, t)) CR.burst('conf', P.x + 50, P.y - 340, t);
    P.tilt = 0; P.hop = 0; P.slip = false; P.lift = 0; P.rock = 0; P.watch = false; P.tick = false;
    if (TAP.cou && t - TAP.cou < 3.2) { var u = (t - TAP.cou) / 3.2; P.talk = true; P.mood = 'happy';
      if (u < 0.22) { P.hands = [[-6, -470], HANDLE]; P.tilt = -0.04; P.look = 0.1; }
      else if (u < 0.8) { var v = (u - 0.22) / 0.58, up = Math.sin(Math.min(1, v * 3) * Math.PI / 2); P.lift = up; P.hands = [[-34, lerp(-300, -500, up)], [46, lerp(-300, -500, up)]];
        P.hop = v > 0.3 && v < 0.7 ? Math.sin((v - 0.3) / 0.4 * Math.PI) * 16 : 0; P.rock = Math.sin(v * 18) * 0.05 * (1 - v); }
      else { var w = (u - 0.8) / 0.2; P.lift = 1 - w; P.hands = [[-34, lerp(-500, -300, w)], [lerp(46, HANDLE[0], w), lerp(-500, HANDLE[1], w)]]; } return; }
    var c = (t + 1) % 8, busy = t < st.until; P.talk = busy; P.mood = busy ? 'happy' : 'calm'; P.hands = [[-20, -300], HANDLE];
    if (c < 3.2) { P.slip = true; P.tick = c > 2.3; P.hands[0] = [-16, -236 + Math.sin(t * 1.4) * 4]; P.look = lerp(P.look, -0.25, 0.1); }
    else if (c < 4.8) { var wb = (c - 3.2) / 1.6; P.hands[0] = [-40 + Math.sin(wb * Math.PI * 3) * 18, -440]; P.tilt = -0.03; P.look = lerp(P.look, 0.2, 0.1); }
    else { P.watch = c < 6.2; P.hands[0] = P.watch ? [-8, -262] : [-60, -190]; lookAtNexi(P, st, t, S, P.watch ? -0.4 : 0.3); }
  } };

  window.IXW.worlds['sol-auto'] = {
    calmView: [110,-60,880,704], /* CALM: the framed part of the set */
    pan: [-300, 1180],
    paintBg: paintBg, windowBehind: true, paintFrame: paintFrame, paintBack: paintBack, paintFront: paintFront, paintFore: paintFore,
    paintWindow: paintWindow, paintLive: paintLive, paintFrontLive: paintFrontLive, paintForeLive: paintForeLive,
    moteCol: 'rgba(255,248,225,.75)',
    glow: {
      trigger: function (g) { rr(g, CHUTE - 44, 50, 88, 256, 14); },
      classify: function (g) { rr(g, SORT.x - 10, SORT.y - 30, SORT.w + 20, SORT.h + 40, 14); },
      record: function (g) { rr(g, CAB.x - 10, MON.y - 12, CAB.w + 20, F - MON.y + 16, 14); },
      draft: function (g) { rr(g, PRESS.x - 10, PRESS.y - 14, PRESS.w + 20, PRESS.h + 24, 14); },
      gate: function (g) { g.beginPath(); rrAdd(g, GUARD.x - 10, GUARD.y - 10, GUARD.w + 20, GUARD.h + 20, 14); rrAdd(g, DESK.x - 12, DESK.y - 28, DESK.w + 24, F - DESK.y + 32, 14); },
      route: function (g) { g.beginPath(); rrAdd(g, RCV.x - 10, RCV.y - 24, RCV.w + 20, RCV.h + 34, 14); rrAdd(g, TICK.x - 8, TICK.y - 8, TICK.w + 16, TICK.h + 16, 12); },
      log: function (g) { rr(g, 300, TAPE.y - 10, HEAD_X + 30 - 300, TAPE.h + 20, 12); },
      lever: function (g) { rr(g, POST - 22, 206, 44, 68, 12); }
    },
    backGlow: ['trigger', 'classify', 'record', 'draft', 'route', 'log', 'lever'],
    cast: [castTN, castREV, castDEV, castAPR, castSRT, castCOU],
    toy: function (name, S, t) { if (name === 'lever') { TAP.lever = t; WT.until = t + PAUSE_LEN; CR.burst('spark', POST, 220, t); } },
    hit: function (x, y, S, t, onBtn) {
      var w = CR.hitWalker(x, y, t); if (w) return w; if (onBtn) return null;
      var R = S.R; if (R && Math.abs(x - R.sx) < 40 && y > RAIL - 14 && y < R.cy + 40) {
        var what = { grab: 'picking up a **new letter** from the inbox', carry: 'carrying a **' + R.D.kind.toLowerCase() + '** to the next step', scan: 'reading and **classifying** a ' + R.D.kind.toLowerCase(), record: 'pulling the **record** from Odoo: ' + R.D.rec.toLowerCase(), feed: 'feeding the press to **prepare the ' + R.D.draft.toLowerCase() + '**', back: 'heading back to the inbox for the **next letter**', wait: 'waiting at the inbox for the **next trigger**' }[R.phase];
        return { say: 'I\'m the **agent**. Right now I\'m ' + what + '. Anything irreversible waits for a person.', near: [clamp(R.sx + (R.sx < 500 ? 170 : -170), 220, 900), 70], pose: R.sx < 500 ? 'point-left' : 'point-right', who: 'The agent' }; }
      if (x > 922 && x < 1000 && y > 672 && y < 752) { TAP.cat = t; CR.burst('heart', 950, 680, t); return { say: 'The office cat. She sleeps through every run: the **log** keeps watch for her.', near: [770, 440], pose: 'love', who: 'The office cat' }; }
      if (Math.hypot(x - 510, y - 30) < 22) return { say: CO.timeLine(8, 'Singapore', 'and the agent is still on its round.'), near: [600, 60], pose: 'wow', who: 'The wall clock' };
      return null;
    },
    onStop: function (key, S, t) { S.kT = t; }
  };
})(window.IXW && window.IXW.kit, window.CR, window.CO);
