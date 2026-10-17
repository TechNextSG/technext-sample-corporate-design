/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* Cookie consent + first-party visitor context. Ported from the previous site's
   cookie-consent.js. Google Consent Mode v2 defaults (everything denied) are set by the
   inline snippet at the top of <head>, BEFORE any Google tag loads; this file only asks
   the visitor and sends the update. No inline event handlers: the site's CSP blocks
   them, so hover states live in an injected stylesheet. */
(function () {
  'use strict';

  /* ---------------- helpers ---------------- */
  function setCookie(name, value, days) {
    var d = new Date();
    d.setTime(d.getTime() + days * 864e5);
    document.cookie = name + '=' + encodeURIComponent(value) +
      ';expires=' + d.toUTCString() + ';path=/;SameSite=Lax;Secure';
  }
  function getCookie(name) {
    var m = document.cookie.match('(?:^|;\\s*)' + name + '=([^;]*)');
    return m ? decodeURIComponent(m[1]) : null;
  }
  function genId() {
    return 'v' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  /* ---------------- first-party visitor context (only after consent) ---------------- */
  function trackVisit() {
    var now = new Date().toISOString();
    if (!getCookie('tn_vid')) setCookie('tn_vid', genId(), 365);
    setCookie('tn_visits', parseInt(getCookie('tn_visits') || '0', 10) + 1, 365);
    if (!getCookie('tn_first')) setCookie('tn_first', now, 365);
    setCookie('tn_last', now, 365);
    if (document.referrer && document.referrer.indexOf(location.host) < 0 && !getCookie('tn_ref')) {
      setCookie('tn_ref', document.referrer, 365);
    }
    var pages = (getCookie('tn_pages') || '').split('|').filter(Boolean);
    var cur = location.pathname;
    if (pages[pages.length - 1] !== cur) {
      pages.push(cur);
      setCookie('tn_pages', pages.slice(-15).join('|'), 30);
    }
    try {
      var params = new URLSearchParams(location.search);
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'].forEach(function (p) {
        var v = params.get(p);
        if (v) setCookie('tn_' + p.slice(4), v, 30);
      });
    } catch (e) {}
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'tn_visitor_identified',
      tn_visitor_id: getCookie('tn_vid'),
      tn_visit_count: parseInt(getCookie('tn_visits'), 10) || 1,
      tn_first_visit: getCookie('tn_first'),
      tn_referrer: getCookie('tn_ref') || '(direct)'
    });
  }

  /* ---------------- Google Consent Mode v2 update ---------------- */
  function setConsent(granted) {
    try {
      window.dataLayer = window.dataLayer || [];
      var g = function () { window.dataLayer.push(arguments); };
      var v = granted ? 'granted' : 'denied';
      g('consent', 'update', { ad_storage: v, ad_user_data: v, ad_personalization: v, analytics_storage: v });
    } catch (e) { /* consent plumbing must never break the page */ }
  }

  /* ---------------- banner ---------------- */
  var ID = 'tn-cookie-banner';

  function removeBanner() {
    var b = document.getElementById(ID);
    if (!b) return;
    b.classList.remove('is-in');
    setTimeout(function () { if (b.parentNode) b.parentNode.removeChild(b); }, 400);
  }
  function accept() { setCookie('tn_consent', 'yes', 365); setConsent(true); removeBanner(); trackVisit(); }
  function decline() { setCookie('tn_consent', 'no', 180); setConsent(false); removeBanner(); }

  function styles() {
    if (document.getElementById(ID + '-css')) return;
    var s = document.createElement('style');
    s.id = ID + '-css';
    s.textContent =
      '#' + ID + '{position:fixed;left:50%;bottom:20px;z-index:9999;width:calc(100% - 32px);max-width:680px;' +
      'transform:translateX(-50%) translateY(24px);opacity:0;display:flex;flex-wrap:wrap;align-items:center;gap:16px;' +
      'padding:18px 22px;border-radius:16px;background:#1F1F3D;color:#F1F5F9;box-shadow:0 12px 40px rgba(31,31,61,.35);' +
      'font:13px/1.5 Inter,system-ui,sans-serif;transition:transform .45s cubic-bezier(.34,1.45,.64,1),opacity .35s ease}' +
      '#' + ID + '.is-in{transform:translateX(-50%) translateY(0);opacity:1}' +
      '#' + ID + ' .tn-cc-text{flex:1;min-width:220px}' +
      '#' + ID + ' strong{display:block;color:#fff;font-size:13px}' +
      '#' + ID + ' p{margin:4px 0 0;color:#A7B0C0;font-size:12px}' +
      '#' + ID + ' a{color:#9DBCF2;font-weight:600;text-decoration:underline}' +
      '#' + ID + ' .tn-cc-actions{display:flex;gap:8px;flex-shrink:0}' +
      '#' + ID + ' button{height:36px;padding:0 20px;border-radius:999px;font:700 12px Inter,system-ui,sans-serif;cursor:pointer;' +
      'transition:background .2s ease,color .2s ease,border-color .2s ease}' +
      '#tn-cookie-accept{background:#3167CA;color:#fff;border:0}' +
      '#tn-cookie-accept:hover,#tn-cookie-accept:focus-visible{background:#1E4691}' +
      '#tn-cookie-decline{background:rgba(255,255,255,.08);color:#A7B0C0;border:1px solid rgba(255,255,255,.14)}' +
      '#tn-cookie-decline:hover,#tn-cookie-decline:focus-visible{background:rgba(255,255,255,.16);color:#fff}' +
      '@media (prefers-reduced-motion:reduce){#' + ID + '{transition:none}}';
    document.head.appendChild(s);
  }

  function createBanner() {
    if (document.getElementById(ID)) return;
    styles();
    var b = document.createElement('div');
    b.id = ID;
    b.setAttribute('role', 'dialog');
    b.setAttribute('aria-label', 'Cookie notice');
    b.innerHTML =
      '<div class="tn-cc-text"><strong>Cookie notice</strong>' +
      '<p>We use Google Analytics and Google Ads cookies to understand how the site is used and whether our ads work. ' +
      'They are only set if you accept. See our <a href="/privacy">Privacy Policy</a>.</p></div>' +
      '<div class="tn-cc-actions">' +
      '<button type="button" id="tn-cookie-accept">Accept</button>' +
      '<button type="button" id="tn-cookie-decline">Decline</button></div>';
    document.body.appendChild(b);
    requestAnimationFrame(function () { requestAnimationFrame(function () { b.classList.add('is-in'); }); });
    document.getElementById('tn-cookie-accept').addEventListener('click', accept);
    document.getElementById('tn-cookie-decline').addEventListener('click', decline);
  }

  /* ---------------- init ---------------- */
  function init() {
    var c = getCookie('tn_consent');
    if (c === 'yes') trackVisit();
    else if (!c) {
      // the home page's first-visit intro (html.intro) plays first: the notice comes 1.2 s after it ends,
      // never on top of it
      var show = function () { setTimeout(createBanner, 1200); };
      if (document.documentElement.classList.contains('intro')) document.addEventListener('tn:intro-done', show, { once: true });
      else show();
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.TechNextCookies = { accept: accept, decline: decline, get: getCookie };
})();
