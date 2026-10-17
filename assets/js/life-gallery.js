/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* /life: the TechNext photo gallery. ONE list (LIFE_PHOTOS below) drives the filters, the polaroid wall and the lightbox.

   HOW TO ADD PHOTOS
   1. Put the originals (JPG or PNG) in a folder and run:  python _src/life_photos.py <folder> --category outings --place "Taguig City" --date 2026-11-14
      It writes assets/img/life/<name>.webp (about 1600 px) and <name>-thumb.webp (about 600 px) and prints one entry per photo.
   2. Paste the printed entries into LIFE_PHOTOS and fill in caption and alt (what the photo shows, for screen readers).
      { src: 'assets/img/life/team-dinner-01.webp', thumb: 'assets/img/life/team-dinner-01-thumb.webp', w: 1600, h: 1067,
        category: 'dinners', caption: 'Our team dinner after go-live', date: '2026-11-14', place: 'Taguig City', alt: 'The team around a long dinner table' },
   3. Run python _src/build.py. A category with no photos shows a "photos coming soon" polaroid on its own.
   category is one of: outings | dinners | meetings | office | events | milestones (see CATS). Only real TechNext photos:
   no stock photos, no AI-generated people, no invented captions. */
(function () {
  'use strict';
  var LIFE_PHOTOS = [
    {"src": "assets/img/life/dinner-group-wide.webp", "thumb": "assets/img/life/dinner-group-wide-thumb.webp", "w": 1280, "h": 960, "category": "dinners", "caption": "Team night out", "date": "", "place": "", "alt": "The whole team posing in a long restaurant"},
    {"src": "assets/img/life/dive-trip-beach.webp", "thumb": "assets/img/life/dive-trip-beach-thumb.webp", "w": 1600, "h": 1200, "category": "outings", "caption": "Dive trip", "date": "", "place": "", "alt": "Four colleagues in wetsuits on a pebble beach"},
    {"src": "assets/img/life/core-ops-go-live.webp", "thumb": "assets/img/life/core-ops-go-live-thumb.webp", "w": 1600, "h": 1200, "category": "meetings", "caption": "Core operations go live", "date": "", "place": "", "alt": "A presenter in front of a screen titled Core Operations Go Live"},
    {"src": "assets/img/life/late-nite-dinner.webp", "thumb": "assets/img/life/late-nite-dinner-thumb.webp", "w": 1200, "h": 1600, "category": "dinners", "caption": "Team dinner", "date": "", "place": "", "alt": "The team around a dinner table at a restaurant"},
    {"src": "assets/img/life/dive-buddies.webp", "thumb": "assets/img/life/dive-buddies-thumb.webp", "w": 1600, "h": 1200, "category": "outings", "caption": "Dive trip", "date": "", "place": "", "alt": "Two dive buddies making the OK sign underwater"},
    {"src": "assets/img/life/spreadsheets-to-odoo.webp", "thumb": "assets/img/life/spreadsheets-to-odoo-thumb.webp", "w": 1600, "h": 1200, "category": "events", "caption": "From spreadsheets to Odoo ERP", "date": "", "place": "", "alt": "A TechNext and Odoo screen at the entrance of an event room"},
    {"src": "assets/img/life/team-lunch.webp", "thumb": "assets/img/life/team-lunch-thumb.webp", "w": 1600, "h": 1200, "category": "dinners", "caption": "Team lunch", "date": "", "place": "", "alt": "The team at a long lunch table"},
    {"src": "assets/img/life/office-team.webp", "thumb": "assets/img/life/office-team-thumb.webp", "w": 1600, "h": 1200, "category": "office", "caption": "At the office", "date": "", "place": "", "alt": "Four colleagues standing together holding orange signs"},
    {"src": "assets/img/life/working-session.webp", "thumb": "assets/img/life/working-session-thumb.webp", "w": 1600, "h": 1200, "category": "meetings", "caption": "Working session", "date": "", "place": "", "alt": "The team working on laptops in front of a large screen"},
    {"src": "assets/img/life/dive-ok.webp", "thumb": "assets/img/life/dive-ok-thumb.webp", "w": 1600, "h": 1200, "category": "outings", "caption": "Dive trip", "date": "", "place": "", "alt": "A diver making the OK sign underwater"},
    {"src": "assets/img/life/lunch-selfie.webp", "thumb": "assets/img/life/lunch-selfie-thumb.webp", "w": 1600, "h": 1200, "category": "dinners", "caption": "Lunch together", "date": "", "place": "", "alt": "A group selfie at a lunch table"},
    {"src": "assets/img/life/client-visit.webp", "thumb": "assets/img/life/client-visit-thumb.webp", "w": 1600, "h": 1200, "category": "meetings", "caption": "Catching up over coffee", "date": "", "place": "", "alt": "The team seated together at a café"},
    {"src": "assets/img/life/training-session.webp", "thumb": "assets/img/life/training-session-thumb.webp", "w": 1600, "h": 900, "category": "meetings", "caption": "Training session", "date": "", "place": "", "alt": "People at desks during a session with a projected screen"},
    {"src": "assets/img/life/pantry.webp", "thumb": "assets/img/life/pantry-thumb.webp", "w": 1280, "h": 960, "category": "office", "caption": "Pantry break", "date": "", "place": "", "alt": "Two colleagues chatting in the pantry"},
    {"src": "assets/img/life/dive-pool.webp", "thumb": "assets/img/life/dive-pool-thumb.webp", "w": 1600, "h": 1200, "category": "outings", "caption": "Dive trip", "date": "", "place": "", "alt": "Two divers practising in a pool"},
    {"src": "assets/img/life/dinner-group.webp", "thumb": "assets/img/life/dinner-group-thumb.webp", "w": 960, "h": 1280, "category": "dinners", "caption": "Team night out", "date": "", "place": "", "alt": "The team posing in a restaurant with woven lamps"},
    {"src": "assets/img/life/project-room.webp", "thumb": "assets/img/life/project-room-thumb.webp", "w": 1600, "h": 900, "category": "meetings", "caption": "In the project room", "date": "", "place": "", "alt": "Colleagues working around desks in a project room"},
    {"src": "assets/img/life/breakfast-spread.webp", "thumb": "assets/img/life/breakfast-spread-thumb.webp", "w": 1600, "h": 1200, "category": "office", "caption": "Breakfast at the office", "date": "", "place": "", "alt": "A breakfast spread of sandwiches, cold cuts and coffee"},
    {"src": "assets/img/life/dive-practice.webp", "thumb": "assets/img/life/dive-practice-thumb.webp", "w": 1600, "h": 1200, "category": "outings", "caption": "Dive trip", "date": "", "place": "", "alt": "Divers practising skills in a pool"},
    {"src": "assets/img/life/bar-counter.webp", "thumb": "assets/img/life/bar-counter-thumb.webp", "w": 1280, "h": 960, "category": "office", "caption": "Behind the counter", "date": "", "place": "", "alt": "Colleagues seated at a bar counter"}
  ];
  var CATS = [
    { key: 'outings', label: 'Outings', soon: 'Team outing', icon: 'M4 18l5-7 4 5 3-4 4 6z M16 7a2 2 0 1 0 0.01 0' },
    { key: 'dinners', label: 'Group dinners', soon: 'Group dinner', icon: 'M6 3v8a2 2 0 0 0 4 0V3 M8 11v10 M17 3c-2 2-2 6 0 8v10' },
    { key: 'meetings', label: 'Meetings', soon: 'Team meeting', icon: 'M3 5h18v11H3z M8 20h8 M12 16v4' },
    { key: 'office', label: 'Office life', soon: 'Office life', icon: 'M4 21V7l8-4 8 4v14 M9 21v-6h6v6' },
    { key: 'events', label: 'Events', soon: 'TechNext event', icon: 'M4 6h16v14H4z M4 10h16 M8 3v5 M16 3v5' },
    { key: 'milestones', label: 'Milestones', soon: 'Milestone', icon: 'M12 3l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.3 6.8 19.1l1-5.8L3.5 9.2l5.9-.8z' }
  ];
  window.LIFE_PHOTOS = LIFE_PHOTOS; window.LIFE_CATS = CATS;
  var ROOT = (document.querySelector('link[rel="stylesheet"][href*="assets/css/site.css"]') || { getAttribute: function () { return ''; } }).getAttribute('href').split('assets/css/site.css')[0];
  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function day(d) { if (!d) return ''; var p = d.split('-'); return (+p[2] ? +p[2] + ' ' : '') + MON[+p[1] - 1] + ' ' + p[0]; }
  function svg(path) { return '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="' + path + '" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'; }
  function cat(k) { for (var i = 0; i < CATS.length; i++) if (CATS[i].key === k) return CATS[i]; return CATS[0]; }

  function init() {
    var wall = document.querySelector('[data-lg-wall]'), bar = document.querySelector('[data-lg-filters]'); if (!wall) return;
    var cur = 'all', shown = [], box = null, at = 0, lastFocus = null;
    function counts(k) { return LIFE_PHOTOS.filter(function (p) { return k === 'all' || p.category === k; }).length; }
    if (bar) bar.innerHTML = [{ key: 'all', label: 'All' }].concat(CATS).map(function (c) { var n = counts(c.key);
      return '<button type="button" data-lg-f="' + c.key + '" aria-pressed="' + (c.key === 'all') + '">' + esc(c.label) + '<span class="lg-n">' + (n || '·') + '</span></button>'; }).join('');
    function render() {
      shown = LIFE_PHOTOS.filter(function (p) { return cur === 'all' || p.category === cur; });
      var html = shown.map(function (p, i) { var c = cat(p.category);
        return '<li class="lg-item" style="--r:' + (((i * 37) % 7) - 3) * 0.6 + 'deg"><button type="button" class="lg-pol" data-lg-i="' + i + '" aria-label="Open photo: ' + esc(p.caption || p.alt) + '">' +
          '<img src="' + esc(ROOT + (p.thumb || p.src)) + '" alt="' + esc(p.alt || '') + '" loading="lazy" decoding="async"' + (p.w ? ' width="' + p.w + '" height="' + p.h + '"' : '') + '>' +
          '<span class="lg-cap"><b>' + esc(p.caption || '') + '</b><small>' + esc(c.label + (p.place ? ' · ' + p.place : '') + (p.date ? ' · ' + day(p.date) : '')) + '</small></span></button></li>'; });
      /* every category without photos gets its "coming soon" polaroid */
      (cur === 'all' ? CATS : [cat(cur)]).forEach(function (c, i) { if (counts(c.key)) return;
        html.push('<li class="lg-item lg-item--soon" data-cat="' + c.key + '" style="--r:' + ((i % 3) - 1) * 1.4 + 'deg"><div class="lg-pol lg-pol--soon"><span class="lg-ph">' + svg(c.icon) + '<span class="lg-tape" aria-hidden="true"></span></span>' +
          '<span class="lg-cap"><b>' + esc(c.soon) + '</b><small>Photos coming soon</small></span></div></li>'); });
      wall.innerHTML = html.join('');
      [].forEach.call(bar ? bar.querySelectorAll('[data-lg-f]') : [], function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-lg-f') === cur ? 'true' : 'false'); });
      var st = document.querySelector('[data-lg-status]'); if (st) st.textContent = shown.length ? shown.length + (shown.length === 1 ? ' photo' : ' photos') : 'Photos coming soon';
    }
    if (bar) bar.addEventListener('click', function (e) { var b = e.target.closest('[data-lg-f]'); if (!b) return; cur = b.getAttribute('data-lg-f'); render(); });
    wall.addEventListener('click', function (e) { var b = e.target.closest('[data-lg-i]'); if (b) open(+b.getAttribute('data-lg-i'), b); });

    /* the lightbox: a modal dialog with the photo, caption, date and place; arrows/Esc on the keyboard, swipe on touch */
    function build() {
      box = document.createElement('div'); box.className = 'lg-box'; box.hidden = true; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', 'Photo viewer');
      box.innerHTML = '<div class="lg-shade" data-lg-close></div><figure class="lg-fig"><img alt=""><figcaption><b></b><small></small><span class="lg-count"></span></figcaption></figure>' +
        '<button type="button" class="lg-btn lg-prev" aria-label="Previous photo">' + svg('M15 5l-7 7 7 7') + '</button><button type="button" class="lg-btn lg-next" aria-label="Next photo">' + svg('M9 5l7 7-7 7') + '</button>' +
        '<button type="button" class="lg-btn lg-x" data-lg-close aria-label="Close">' + svg('M6 6l12 12M18 6L6 18') + '</button>';
      document.body.appendChild(box);
      box.addEventListener('click', function (e) { if (e.target.closest('[data-lg-close]')) close(); });
      box.querySelector('.lg-prev').addEventListener('click', function () { go(-1); }); box.querySelector('.lg-next').addEventListener('click', function () { go(1); });
      box.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { e.preventDefault(); close(); } else if (e.key === 'ArrowLeft') go(-1); else if (e.key === 'ArrowRight') go(1);
        else if (e.key === 'Tab') { var f = [].slice.call(box.querySelectorAll('button')), i = f.indexOf(document.activeElement); e.preventDefault(); f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus(); } });
      var sx = null; box.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
      box.addEventListener('touchend', function (e) { if (sx == null) return; var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1); sx = null; });
    }
    function show() { var p = shown[at], c = cat(p.category), img = box.querySelector('img');
      img.src = ROOT + p.src; img.alt = p.alt || ''; if (p.w) { img.width = p.w; img.height = p.h; }
      box.querySelector('figcaption b').textContent = p.caption || ''; box.querySelector('figcaption small').textContent = [c.label, p.place, day(p.date)].filter(Boolean).join(' · ');
      box.querySelector('.lg-count').textContent = (at + 1) + ' / ' + shown.length;
      box.querySelector('.lg-prev').hidden = box.querySelector('.lg-next').hidden = shown.length < 2; }
    function open(i, from) { if (!box) build(); lastFocus = from; at = i; show(); box.hidden = false; document.documentElement.classList.add('lg-open'); box.querySelector('.lg-x').focus(); }
    function go(d) { if (!shown.length) return; at = (at + d + shown.length) % shown.length; show(); }
    function close() { box.hidden = true; document.documentElement.classList.remove('lg-open'); if (lastFocus) lastFocus.focus(); }
    render();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
