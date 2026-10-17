/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* Odoo Experience 2026 article: the five takeaways as a deck. Arrows, the numbered track, swipe or
   the keyboard move between cards; each card pairs the fact from the article with what it means
   for a company running Odoo (also from the article). */
TN.demo('takeaways', function (root, K) {
  var cards = K.$$('.dtk-card', root), dots = K.$$('.dtk-dots button', root), bar = K.$('.dtk-bar i', root);
  var cur = 0, x0 = null;
  function go(i) {
    cur = (i + cards.length) % cards.length;
    cards.forEach(function (c, k) {
      c.classList.toggle('is-on', k === cur); c.classList.toggle('is-before', k < cur);
      c.setAttribute('aria-hidden', String(k !== cur));
      K.$$('a,button', c).forEach(function (f) { f.tabIndex = k === cur ? 0 : -1; });
    });
    dots.forEach(function (d, k) { d.setAttribute('aria-pressed', String(k === cur)); d.classList.toggle('is-done', k < cur); });
    bar.style.transform = 'scaleX(' + ((cur + 1) / cards.length).toFixed(3) + ')';
  }
  dots.forEach(function (d, k) { d.addEventListener('click', function () { go(k); }); });
  K.$('[data-prev]', root).addEventListener('click', function () { go(cur - 1); });
  K.$('[data-next]', root).addEventListener('click', function () { go(cur + 1); });
  root.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(cur + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(cur - 1); }
  });
  var deck = K.$('.dtk-deck', root);
  deck.addEventListener('pointerdown', function (e) { x0 = e.clientX; });
  deck.addEventListener('pointerup', function (e) { if (x0 == null) return; var dx = e.clientX - x0; x0 = null; if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1)); });
  go(0);
  return {};
});
