/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* Screenshot viewer for the Odoo app pages. Every screenshot is a link to the full-size file
   (so it still works without JavaScript); this opens it in a dialog instead, with previous /
   next, a counter and the caption. The picture shown is a clone of the page's own <img>, so
   nothing is read from the URL or rebuilt from strings. */
(function () {
  'use strict';
  var links = Array.prototype.slice.call(document.querySelectorAll('a[data-zoom]'));
  if (!links.length || typeof HTMLDialogElement !== 'function') return;

  var SVG = 'http://www.w3.org/2000/svg';
  function icon(d) {
    var s = document.createElementNS(SVG, 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    s.setAttribute('aria-hidden', 'true');
    s.setAttribute('class', 'ic');
    var p = document.createElementNS(SVG, 'path');
    p.setAttribute('d', d);
    s.appendChild(p);
    return s;
  }
  function button(cls, label, d) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = cls;
    b.setAttribute('aria-label', label);
    b.appendChild(icon(d));
    return b;
  }

  var dlg = document.createElement('dialog');
  dlg.className = 'zoom-dlg';
  dlg.setAttribute('aria-label', 'Screenshot viewer');
  var fig = document.createElement('figure');
  fig.className = 'zoom-fig';
  var frame = document.createElement('div');
  frame.className = 'zoom-frame';
  var cap = document.createElement('figcaption');
  cap.className = 'zoom-cap';
  var count = document.createElement('span');
  count.className = 'zoom-count';
  var text = document.createElement('span');
  cap.appendChild(count);
  cap.appendChild(text);
  fig.appendChild(frame);
  fig.appendChild(cap);
  var close = button('zoom-btn zoom-x', 'Close', 'M18 6 6 18M6 6l12 12');
  var prev = button('zoom-btn zoom-prev', 'Previous screenshot', 'm15 18-6-6 6-6');
  var next = button('zoom-btn zoom-next', 'Next screenshot', 'm9 18 6-6-6-6');
  dlg.appendChild(fig);
  dlg.appendChild(prev);
  dlg.appendChild(next);
  dlg.appendChild(close);
  document.body.appendChild(dlg);

  var at = 0;
  function show(i) {
    at = (i + links.length) % links.length;
    var src = links[at].querySelector('img');
    if (!src) return;
    var img = src.cloneNode(false);
    img.removeAttribute('loading');
    img.removeAttribute('data-onerror');
    img.removeAttribute('style');
    img.className = 'zoom-img';
    img.decoding = 'async';
    while (frame.firstChild) frame.removeChild(frame.firstChild);
    frame.appendChild(img);
    text.textContent = src.getAttribute('alt') || '';
    count.textContent = links.length > 1 ? (at + 1) + ' / ' + links.length : '';
  }
  function open(i) {
    show(i);
    var many = links.length > 1;
    prev.hidden = !many;
    next.hidden = !many;
    document.documentElement.classList.add('zoom-open');
    dlg.showModal();
    wasOpen = true;
    close.focus();
  }

  links.forEach(function (a, i) {
    a.addEventListener('click', function (e) {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;   // let "open in new tab" work
      e.preventDefault();
      open(i);
    });
  });
  // tidy up once, however the viewer closes (button, backdrop, or Esc via the native close event)
  var wasOpen = false;
  function done() {
    if (!wasOpen) return;
    wasOpen = false;
    document.documentElement.classList.remove('zoom-open');
    var a = links[at];
    if (a && typeof a.focus === 'function') a.focus({ preventScroll: true });
  }
  function shut() { if (dlg.open) dlg.close(); done(); }
  close.addEventListener('click', shut);
  prev.addEventListener('click', function () { show(at - 1); });
  next.addEventListener('click', function () { show(at + 1); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg || e.target === frame) shut(); });   // backdrop
  dlg.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(at - 1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); show(at + 1); }
  });
  dlg.addEventListener('close', done);

  // swipe left / right on touch screens
  var x0 = null;
  frame.addEventListener('touchstart', function (e) { x0 = e.touches.length === 1 ? e.touches[0].clientX : null; }, { passive: true });
  frame.addEventListener('touchend', function (e) {
    if (x0 === null || !e.changedTouches.length) return;
    var dx = e.changedTouches[0].clientX - x0;
    x0 = null;
    if (Math.abs(dx) > 50 && links.length > 1) show(at + (dx < 0 ? 1 : -1));
  }, { passive: true });
})();
