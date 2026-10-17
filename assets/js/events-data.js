/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* The /events page data: TechNext's OWN events, events TechNext WILL JOIN, and TechNext milestones. Nothing else: never
   list another organiser's event here unless TechNext has confirmed it will take part. The page (assets/js/events-page.js)
   and the hero scene (assets/js/worlds/events.js) read this list, sort it by date, and move anything whose date has passed
   into "Past" in the visitor's browser, so nothing has to be edited when an event ends.

   HOW TO ADD AN ITEM: copy the example below (remove the comment marks), put it anywhere in TN_EVENTS and fill in:
     id      a short unique slug (letters, digits, dashes)
     type    own (TechNext runs it) | joining (TechNext will take part in someone else's event) | milestone (a dated TechNext moment)
     date    'YYYY-MM-DD' (first day);  end: last day of a multi-day event (optional);  time: shown as written (optional)
     tz      the UTC offset where it happens (8 = Singapore / Manila, 7 = Ho Chi Minh City)
     title   the item's name;  kind: a short label (e.g. 'Recruitment day', 'Workshop', 'Video premiere', 'Booth')
     where   place or 'Online' (e.g. 'Taguig City', 'YouTube');  note: one sentence;  url: a page with the details (optional)
     src     the page on this site that states it. Only add what TechNext has announced; never guess a date.

     // { id: 'open-day-2027', type: 'own', date: '2027-01-15', tz: 8, time: '10:00–16:00 PHT', title: 'TechNext open day',
     //   kind: 'Open day', where: 'Taguig City', note: 'Meet the team at our main development and consulting hub.',
     //   url: 'careers.html', src: 'careers.html' },
*/
(function () {
  'use strict';
  var NX = 'nexi-explains.html';
  window.TN_EVENTS = [
    /* ---- own: the Nexi Explains Season 1 premieres on TechNext's YouTube channel (dates: _src/nexi_explains.py, /nexi-explains) ---- */
    { id: 'nx-ep00', type: 'own', date: '2026-10-13', tz: 8, time: '18:00 SGT · YouTube premiere', title: 'Nexi Explains EP00: Meet Nexi', kind: 'Video premiere', where: 'YouTube',
      note: 'The pilot of our animated series: a comic-book city, a spreadsheet monster and four power-ups.', url: 'https://www.youtube.com/watch?v=KmnP1UptJhs', src: NX },
    { id: 'nx-ep01', type: 'own', date: '2026-10-15', tz: 8, time: '18:00 SGT · YouTube premiere', title: 'Nexi Explains EP01: Odoo Walkthrough with Nexi', kind: 'Video premiere', where: 'YouTube',
      note: 'What is Odoo? A quick tour of the apps.', url: 'https://www.youtube.com/watch?v=xiuyzVw_dYE', src: NX },
    { id: 'nx-ep02', type: 'own', date: '2026-10-17', tz: 8, time: '18:00 SGT · YouTube premiere', title: 'Nexi Explains EP02: All Odoo Apps', kind: 'Video premiere', where: 'YouTube',
      note: 'Every app, one Odoo: all the apps on one database.', url: 'https://www.youtube.com/watch?v=cfM5O03OZkI', src: NX },
    { id: 'nx-ep03', type: 'own', date: '2026-10-20', tz: 8, time: '18:00 SGT · YouTube premiere', title: 'Nexi Explains EP03: Before vs After, Order to Invoice', kind: 'Video premiere', where: 'YouTube',
      note: 'Same order, typed three times? Before and after Odoo.', url: 'https://www.youtube.com/watch?v=7ouKgR1bj_M', src: NX },

    /* ---- joining: none announced yet (add them here when TechNext confirms) ---- */

    /* ---- milestones ---- */
    { id: 'blog-launch', type: 'milestone', date: '2026-09-27', tz: 8, title: 'The TechNext blog opens with ten guides', kind: 'Blog',
      where: 'technext.asia', note: 'Odoo 20, InvoiceNow, implementation and ERP, in plain language.', url: 'blog.html', src: 'blog.html' },
    { id: 'nexi-s1', type: 'milestone', date: '2026-10-13', tz: 8, title: 'Nexi Explains Season 1 premieres', kind: 'Nexi Explains',
      where: 'YouTube', note: 'Our animated series starts with the pilot, EP00: Meet Nexi.', url: NX, src: NX }
  ];

  /* helpers shared by the page and the scene */
  function at(d, tz, endOfDay) { var p = d.split('-'); return Date.UTC(+p[0], +p[1] - 1, +p[2], endOfDay ? 23 : 0, endOfDay ? 59 : 0) - (tz || 0) * 3600e3; }
  var EV = window.TN_EV = {
    start: function (e) { return at(e.date, e.tz, false); },
    end: function (e) { return at(e.end || e.date, e.tz, true); },
    isPast: function (e, now) { return EV.end(e) < (now || Date.now()); },
    of: function (type) { return window.TN_EVENTS.filter(function (e) { return e.type === type; }); },
    /* events (own + joining) still to come, soonest first; past events, newest first */
    upcoming: function (now, type) { now = now || Date.now(); return window.TN_EVENTS.filter(function (e) { return e.type !== 'milestone' && (!type || e.type === type) && !EV.isPast(e, now); }).sort(function (a, b) { return EV.start(a) - EV.start(b); }); },
    past: function (now) { now = now || Date.now(); return window.TN_EVENTS.filter(function (e) { return e.type !== 'milestone' && EV.isPast(e, now); }).sort(function (a, b) { return EV.start(b) - EV.start(a); }); },
    milestones: function () { return EV.of('milestone').slice().sort(function (a, b) { return a.date < b.date ? -1 : 1; }); },
    MON: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    dayMon: function (d) { var p = d.split('-'); return [+p[2], EV.MON[+p[1] - 1], +p[0]]; }
  };
})();
