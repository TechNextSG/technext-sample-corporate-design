/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* /employee-hub: turns the team list (built from _src/team.py into [data-bc-src]) into TechNext employee ID cards hanging
   from a lanyard rack, in the style of the blue TechNext ID the cast wear across the site.
   Front: the TechNext header band, a photo slot (initials until a photo is set in team.py), name, position, ID No.
   (the order on the list: 001, 002 …), the office when team.py gives one, and a barcode strip.
   Back: work email, the three office addresses, "property of TechNext Pte. Ltd." and a VALID stamp.
   A tap (or the Flip button) turns the card over; "Save contact" builds a vCard (.vcf) in the browser.
   Without JS the plain team list stays visible. The hero scene reads [data-bc-name] / [data-bc-role]. */
(function () {
  'use strict';
  var ORG = 'TechNext Pte. Ltd.', WEB = 'https://technext.asia/', HQ = ';;261 Waterloo Street #03-36;Singapore;;180261;Singapore';
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function vEsc(s) { return String(s || '').replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1'); }
  function vcard(p) {
    var parts = p.name.trim().split(/\s+/), last = parts.length > 1 ? parts.pop() : '', first = parts.join(' ');
    return ['BEGIN:VCARD', 'VERSION:3.0', 'N:' + vEsc(last) + ';' + vEsc(first) + ';;;', 'FN:' + vEsc(p.name), 'ORG:' + vEsc(ORG), p.role ? 'TITLE:' + vEsc(p.role) : '',
      p.email ? 'EMAIL;TYPE=INTERNET,WORK:' + p.email : '', 'URL:' + WEB, 'ADR;TYPE=WORK:' + HQ, 'END:VCARD'].filter(Boolean).join('\r\n') + '\r\n';
  }
  function slug(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  var PLANE = '<svg class="idc-plane" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 11.5 21 4l-4.5 16-5-5.2-3 3.2.4-5.1z" fill="#FFFFFF"/><path d="M8.9 12.9 21 4l-9.5 10.8" fill="#C9D6EE"/></svg>';
  var ICON = { mail: 'M4 6h16v12H4z M4 7l8 6 8-6', vcf: 'M12 4v11m0 0-4-4m4 4 4-4M5 19h14', flip: 'M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M18 3v4h-4M6 21v-4h4' };
  function ic(k) { return '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="' + ICON[k] + '" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'; }
  function build() {
    var src = document.querySelector('[data-bc-src]'), grid = document.querySelector('[data-bc-grid]'); if (!src || !grid) return;
    var people = [].map.call(src.querySelectorAll('.th-person'), function (el, i) {
      var h = el.querySelector('h3'), role = el.querySelector('.th-role'), mail = el.querySelector('.th-mail'), ini = el.querySelector('.th-ini'), img = el.querySelector('.ef-photo img'), off = el.getAttribute('data-office');
      return { name: h ? h.textContent.trim() : '', role: role ? role.textContent.trim() : '', email: mail ? mail.textContent.trim() : '', ini: ini ? ini.textContent.trim() : '',
        img: img ? img.getAttribute('src') : '', office: off || '', tone: i % 4, no: String(i + 1).padStart(3, '0') };
    }).filter(function (p) { return p.name; });
    if (!people.length) return;
    grid.innerHTML = people.map(function (p, i) {
      var pic = p.img ? '<img src="' + esc(p.img) + '" alt="" width="240" height="280" loading="lazy">' : '<span>' + esc(p.ini) + '</span>';
      return '<article class="idc" data-bc-name="' + esc(p.name) + '" data-bc-role="' + esc(p.role) + '" style="--i:' + i + '">' +
        '<span class="idc-strap" aria-hidden="true"></span><span class="idc-clip" aria-hidden="true"></span>' +
        '<div class="idc-swing"><div class="idc-card">' +
          '<div class="idc-face idc-front">' +
            '<span class="idc-band">' + PLANE + '<b>TechNext</b><small>Employee ID</small></span>' +
            '<span class="idc-slot" aria-hidden="true"></span>' +
            '<span class="idc-photo th-tone-' + p.tone + '">' + pic + '</span>' +
            '<h3>' + esc(p.name) + '</h3><span class="idc-role">' + esc(p.role) + '</span>' +
            '<dl class="idc-meta"><div><dt>ID No.</dt><dd>' + p.no + '</dd></div>' + (p.office ? '<div><dt>Office</dt><dd>' + esc(p.office) + '</dd></div>' : '<div><dt>Company</dt><dd>TechNext Pte. Ltd.</dd></div>') + '</dl>' +
            '<span class="idc-bar" aria-hidden="true"></span>' +
          '</div>' +
          '<div class="idc-face idc-back" aria-hidden="true">' +
            '<span class="idc-slot"></span>' +
            '<p class="idc-k">Work email</p><p class="idc-mail">' + esc(p.email) + '</p>' +
            '<p class="idc-k">Our offices</p><ul class="idc-offices"><li><b>Singapore HQ</b>261 Waterloo Street #03-36, Singapore 180261</li><li><b>Taguig City</b>Level 9, IP Center, Taguig City, Metro Manila</li><li><b>Ho Chi Minh City</b>62 Nguyễn Thị Nhung, Phường Hiệp Bình</li></ul>' +
            '<p class="idc-prop">This card is property of TechNext Pte. Ltd.</p>' +
            '<span class="idc-valid">Valid</span><span class="idc-bar idc-bar--b"></span>' +
          '</div>' +
        '</div></div>' +
        '<p class="idc-actions">' + (p.email ? '<a class="idc-btn" href="mailto:' + esc(p.email) + '">' + ic('mail') + 'Email</a>' : '') +
        '<button type="button" class="idc-btn idc-btn--v" data-bc-vcf="' + i + '">' + ic('vcf') + 'Save contact (.vcf)</button>' +
        '<button type="button" class="idc-btn idc-btn--f" data-bc-flip aria-pressed="false" aria-label="Flip the ID card of ' + esc(p.name) + '">' + ic('flip') + 'Flip</button></p>' +
        '</article>';
    }).join('');
    src.hidden = true; document.documentElement.classList.add('bc-on');
    var cnt = document.querySelector('[data-bc-count]'); if (cnt) cnt.textContent = people.length + (people.length === 1 ? ' ID card · one per person' : ' ID cards · one per person');
    function flip(card, on) { on = on == null ? !card.classList.contains('is-flipped') : on; card.classList.toggle('is-flipped', on);
      var art = card.closest('.idc'), fb = art.querySelector('[data-bc-flip]'); if (fb) fb.setAttribute('aria-pressed', on ? 'true' : 'false');
      card.querySelector('.idc-front').setAttribute('aria-hidden', on ? 'true' : 'false'); card.querySelector('.idc-back').setAttribute('aria-hidden', on ? 'false' : 'true'); }
    [].forEach.call(grid.querySelectorAll('.idc'), function (art) {
      var card = art.querySelector('.idc-card');
      card.addEventListener('click', function (e) { if (e.target.closest('a')) return; flip(card); });
      art.querySelector('[data-bc-flip]').addEventListener('click', function () { flip(card); });
      art.querySelector('[data-bc-vcf]').addEventListener('click', function () {
        var p = people[+this.getAttribute('data-bc-vcf')], blob = new Blob([vcard(p)], { type: 'text/vcard;charset=utf-8' }), a = document.createElement('a');
        a.href = URL.createObjectURL(blob); a.download = slug(p.name) + '-technext.vcf'; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 400);
      });
    });
    var all = document.querySelector('[data-bc-flipall]');
    if (all) all.addEventListener('click', function () { var on = all.getAttribute('aria-pressed') !== 'true'; all.setAttribute('aria-pressed', on ? 'true' : 'false'); all.querySelector('span').textContent = on ? 'Show the fronts' : 'Flip all IDs';
      [].forEach.call(grid.querySelectorAll('.idc-card'), function (c, i) { setTimeout(function () { flip(c, on); }, i * 110); }); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
})();
