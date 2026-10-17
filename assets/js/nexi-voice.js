/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* Nexi's voice: the same robot voice as the chatbot on /nexi, never a human one. A reply chirp, then a soft
   square-wave blip every few letters while she "talks", with pauses at punctuation (Web Audio, no sound files and
   no speech engine). Plus small robot sounds (chirp, knock, pop, sparkle...).
   Off until the visitor turns it on with a speaker button ([data-nexi-voice]); the choice is remembered.
   Browsers allow sound only after a tap, so a remembered "on" waits for the first tap on the page.
   window.TNVoice: on, live, speaking (read-only), set(on), say(text) -> Promise (true when the line has been
   voiced, 'cut' when a newer line interrupted it, 'stop' when stopped, false if it was not voiced), stop(), sfx(name).
   Turning the voice on fires a cancelable tn:voice; a listener that voices its own line cancels the greeting. */
(function () {
  'use strict';
  var KEY = 'tn_nexi_voice';
  var AC = window.AudioContext || window.webkitAudioContext;
  var on = false, unlocked = false, ctx = null, master = null, current = null, talkT = 0;
  try { on = localStorage.getItem(KEY) === '1'; } catch (e) { /* storage may be blocked */ }

  // no Web Audio on this device: the voice buttons have nothing to do
  if (!AC) document.documentElement.classList.add('no-voice');

  /* what Nexi does not voice: stage directions (*taps the glass*), emoji and symbols */
  function clean(t) {
    return String(t || '').replace(/\*[^*]*\*/g, ' ').replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ')
      .replace(/[←-⇿☀-➿⬀-⯿✓✔✦✧♪♫♥❤️]/g, ' ')
      .replace(/·/g, ',').replace(/\s+/g, ' ').trim();
  }
  /* the robot voice, matched to /nexi: "reply" chirp, then a blip every 3 letters (the chat blips every 4 letters
     of its fast typewriter; this pace follows reading speed so the hero scenes still wait long enough) */
  function say(text) {
    return new Promise(function (res) {
      var t = clean(text), c = on && ac();
      if (!c || !/[a-z0-9]/i.test(t)) return res(false);
      if (current) current('cut');
      var done = false, i = 0;
      var fin = function (why) { if (done) return; done = true; clearTimeout(talkT); if (current === fin) current = null; res(why || true); };
      current = fin;
      try { voiceTone(c, 'triangle', 740, 1180, c.currentTime + 0.01, 0.08, 0.45); voiceTone(c, 'sine', 1180, 880, c.currentTime + 0.1, 0.1, 0.38); } catch (e) { /* optional */ }
      (function step() {
        if (done) return;
        if (i >= t.length) { talkT = setTimeout(function () { fin(true); }, 180); return; }
        var ch = t.charAt(i++);
        if (i % 3 === 0 && /[a-z0-9]/i.test(ch)) { try { var f = 640 + Math.random() * 360; voiceTone(c, 'square', f, f * 1.12, c.currentTime + 0.005, 0.045, 0.05); } catch (e) { /* optional */ } }
        talkT = setTimeout(step, /[.!?]/.test(ch) ? 260 : /[,;:—]/.test(ch) ? 140 : 42);
      })();
    });
  }
  function stop() { if (current) current('stop'); clearTimeout(talkT); }

  /* ---------- sounds ---------- */
  function ac() {
    if (!unlocked) return null;
    try {
      if (!AC) return null;
      if (!ctx) { ctx = new AC(); var comp = ctx.createDynamicsCompressor(); master = ctx.createGain(); master.gain.value = 0.26; master.connect(comp); comp.connect(ctx.destination); }
      if (ctx.state === 'suspended') ctx.resume();
      return ctx;
    } catch (e) { return null; }
  }
  function tone(c, type, f0, f1, t, dur, vol) {
    var o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(f0, t); if (f1) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + dur + 0.03);
  }
  /* the chat's tone, through the same master level and compressor as /nexi */
  function voiceTone(c, type, f0, f1, t, dur, vol) {
    var o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(f0, t); if (f1) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(master || c.destination); o.start(t); o.stop(t + dur + 0.03);
  }
  function noise(c, t, dur, vol, hz) {
    var b = c.createBuffer(1, Math.ceil(c.sampleRate * dur), c.sampleRate), d = b.getChannelData(0);
    for (var i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2);
    var s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    s.buffer = b; f.type = 'bandpass'; f.frequency.value = hz; f.Q.value = 0.8; g.gain.value = vol;
    s.connect(f); f.connect(g); g.connect(c.destination); s.start(t);
  }
  var SFX = {
    chirp: function (c, t) { [[620, 980, 0], [880, 1320, 0.12], [1175, 1700, 0.24]].forEach(function (n) { tone(c, 'triangle', n[0], n[1], t + n[2], 0.12, 0.09); }); },
    knock: function (c, t) { tone(c, 'sine', 190, 70, t, 0.16, 0.55); noise(c, t, 0.06, 0.5, 1500); },
    boop: function (c, t) { tone(c, 'sine', 880, 1320, t, 0.09, 0.12); },
    pop: function (c, t) { tone(c, 'triangle', 420, 1250, t, 0.09, 0.14); },
    gasp: function (c, t) { tone(c, 'triangle', 520, 1500, t, 0.22, 0.1); tone(c, 'sine', 1500, 1100, t + 0.2, 0.18, 0.07); },
    boing: function (c, t) { tone(c, 'sine', 160, 640, t, 0.3, 0.16); tone(c, 'sine', 620, 330, t + 0.3, 0.22, 0.09); },
    sparkle: function (c, t) { [1568, 2093, 2637, 3136, 4186].forEach(function (f, i) { tone(c, 'sine', f, 0, t + i * 0.055, 0.2, 0.045); }); },
    heart: function (c, t) { tone(c, 'sine', 660, 0, t, 0.13, 0.1); tone(c, 'sine', 990, 0, t + 0.14, 0.2, 0.1); },
    whoosh: function (c, t) { noise(c, t, 0.45, 0.22, 700); },
    tada: function (c, t) { [523, 659, 784, 1047].forEach(function (f, i) { tone(c, 'triangle', f, 0, t + i * 0.09, 0.28, 0.07); }); }
  };
  function sfx(name) {
    var c = on && ac(); if (!c || !SFX[name]) return;
    try { SFX[name](c, c.currentTime + 0.01); } catch (e) { /* sound is optional */ }
  }

  /* ---------- the toggle ---------- */
  function unlock() {
    if (unlocked) return; unlocked = true;
    ac();
  }
  function paint() {
    [].forEach.call(document.querySelectorAll('[data-nexi-voice]'), function (b) {
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      // a button with visible text is named by it; the icon-only one by a fixed name (its state is aria-pressed)
      var l = b.querySelector('[data-voice-label]');
      if (l) { l.textContent = on ? l.getAttribute('data-on') : l.getAttribute('data-off'); b.removeAttribute('aria-label'); }
      else b.setAttribute('aria-label', 'Nexi’s voice');
    });
    document.documentElement.classList.toggle('nexi-voice', on);
  }
  // returns true when a listener took the moment (it reads out its own line instead of the greeting)
  function set(v) {
    on = !!v;
    try { localStorage.setItem(KEY, on ? '1' : '0'); } catch (e) { /* storage may be blocked */ }
    if (!on) { stop(); if (ctx && ctx.state === 'running') try { ctx.suspend(); } catch (e) { /* ignore */ } }
    paint();
    var ev = new CustomEvent('tn:voice', { detail: { on: on }, cancelable: true });
    document.dispatchEvent(ev);
    return ev.defaultPrevented;
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-nexi-voice]'); if (!b) return;
    e.preventDefault(); unlock();
    var taken = set(!on);
    if (on) { sfx('chirp'); if (!taken) say('Hi! I’m Nexi. Now you can hear me!'); }
  });
  // a remembered "on" needs one tap somewhere before any sound
  ['pointerdown', 'keydown'].forEach(function (ev) { document.addEventListener(ev, function () { if (on) unlock(); }, { capture: true, passive: true }); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', paint); else paint();

  window.TNVoice = { say: say, stop: stop, sfx: sfx, set: set };
  Object.defineProperty(window.TNVoice, 'on', { get: function () { return on; } });
  Object.defineProperty(window.TNVoice, 'live', { get: function () { return on && unlocked; } });
  Object.defineProperty(window.TNVoice, 'speaking', { get: function () { return !!current; } });
})();
