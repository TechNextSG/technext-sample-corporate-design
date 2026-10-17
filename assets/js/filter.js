/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* Filter chips for card lists (open roles on /careers, articles on /blog).
   <div data-filter role="group" aria-controls="LIST_ID" data-noun="role|roles">
     <button type="button" data-filter-tag="all" aria-pressed="true">All</button>
     <button type="button" data-filter-tag="erp" aria-pressed="false">…</button>
   </div>
   <p data-filter-say aria-live="polite"></p>
   <div id="LIST_ID"><article data-tags="erp">…</article></div>
   A #tag in the URL (blog#odoo-news) opens with that filter on. */
(function () {
  'use strict';
  [].forEach.call(document.querySelectorAll('[data-filter]'), function (bar) {
    var list = document.getElementById(bar.getAttribute('aria-controls') || '');
    if (!list) return;
    var items = [].slice.call(list.querySelectorAll('[data-tags]'));
    var btns = [].slice.call(bar.querySelectorAll('[data-filter-tag]'));
    var say = bar.parentNode.querySelector('[data-filter-say]');
    var noun = (bar.getAttribute('data-noun') || 'item|items').split('|');

    function apply(btn, announce) {
      var tag = btn.getAttribute('data-filter-tag');
      var shown = 0;
      items.forEach(function (it) {
        var tags = ' ' + (it.getAttribute('data-tags') || '') + ' ';
        var on = tag === 'all' || tags.indexOf(' ' + tag + ' ') > -1;
        it.hidden = !on;
        if (on) { shown += 1; it.classList.add('is-in'); }
      });
      btns.forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
      if (say && announce) say.textContent = shown + ' ' + (shown === 1 ? noun[0] : noun[1] || noun[0]) + ' shown';
    }

    btns.forEach(function (b) {
      b.addEventListener('click', function () { apply(b, true); });
    });

    function fromHash(announce) {
      var hash = (window.location.hash || '').slice(1);
      if (!hash) return;
      btns.forEach(function (b) {
        if (b.getAttribute('data-filter-tag') === hash) {
          apply(b, announce);
          bar.scrollIntoView({ block: 'start' });
        }
      });
    }
    fromHash(false);
    window.addEventListener('hashchange', function () { fromHash(true); });
  });
})();
