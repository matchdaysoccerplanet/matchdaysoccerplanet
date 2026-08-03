/*
 * Matchday Soccer Planet — GA4 + Google Consent Mode v2
 * ------------------------------------------------------
 * One shared file included on every page (index.html + every standalone
 * article page). Handles three things:
 *  1. Sets Consent Mode v2 defaults to DENIED for everyone, before any
 *     Google tag fires, as required by Google's EU User Consent Policy.
 *  2. Loads GA4 (gtag.js) with your Measurement ID.
 *  3. Shows a cookie banner with separate Accept / Decline buttons
 *     (GDPR requires refusal to be as easy as acceptance — a single
 *     "Accept" button with no equal alternative is not compliant).
 *     If the page already has its own #cookie-banner / #accept-cookies
 *     elements (index.html does), this script reuses them and just adds
 *     a Decline button. If not (article pages), it builds one from
 *     scratch using the same look as the rest of the site.
 *
 * IMPORTANT: replace GA_MEASUREMENT_ID below with your real ID if it
 * ever changes (currently set to the one from your GA4 property).
 */
(function () {
  var GA_MEASUREMENT_ID = 'G-8Z2PTVHJH3';
  var CONSENT_KEY = 'msp_consent'; // 'granted' | 'denied'

  // ── 1. Consent Mode v2 defaults — MUST run before gtag.js loads ──
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('consent', 'default', {
    'ad_storage': 'denied',
    'ad_user_data': 'denied',
    'ad_personalization': 'denied',
    'analytics_storage': 'denied',
    'wait_for_update': 500
  });

  // If the visitor already chose on a previous visit, apply it immediately.
  var existing = localStorage.getItem(CONSENT_KEY);
  if (existing === 'granted') {
    gtag('consent', 'update', {
      'ad_storage': 'granted',
      'ad_user_data': 'granted',
      'ad_personalization': 'granted',
      'analytics_storage': 'granted'
    });
  }

  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, { 'anonymize_ip': true });

  // ── 2. Load gtag.js itself ──
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
  document.head.appendChild(s);

  // ── 3. Cookie banner (reuse existing markup if present, else build one) ──
  function grantConsent() {
    localStorage.setItem(CONSENT_KEY, 'granted');
    gtag('consent', 'update', {
      'ad_storage': 'granted',
      'ad_user_data': 'granted',
      'ad_personalization': 'granted',
      'analytics_storage': 'granted'
    });
  }
  function denyConsent() {
    localStorage.setItem(CONSENT_KEY, 'denied');
    // Already denied by default — nothing further to send to Google.
  }

  function setupBanner() {
    if (localStorage.getItem(CONSENT_KEY)) return; // already decided, nothing to show

    var banner = document.getElementById('cookie-banner');

    if (banner) {
      // index.html already has the markup — just make sure a Decline button exists.
      banner.style.display = 'flex';
      var acceptBtn = document.getElementById('accept-cookies');
      var declineBtn = document.getElementById('decline-cookies');
      if (!declineBtn) {
        declineBtn = document.createElement('button');
        declineBtn.id = 'decline-cookies';
        declineBtn.textContent = 'Decline';
        declineBtn.style.cssText = 'background:transparent;border:1px solid #888;color:#fff;padding:8px 20px;border-radius:20px;font-weight:700;cursor:pointer;margin-left:8px;';
        acceptBtn.insertAdjacentElement('afterend', declineBtn);
      }
      acceptBtn.onclick = function () { grantConsent(); banner.classList.add('hidden'); };
      declineBtn.onclick = function () { denyConsent(); banner.classList.add('hidden'); };
    } else {
      // Standalone article page — no banner in the markup, build one.
      banner = document.createElement('div');
      banner.id = 'cookie-banner';
      banner.style.cssText = 'position:fixed;bottom:0;left:0;width:100%;background:#0d0d0d;color:#fff;padding:14px 16px;display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:12px;z-index:9999;border-top:3px solid #c9a84c;font-family:Inter,Arial,sans-serif;font-size:0.85rem;';
      banner.innerHTML =
        '<span style="max-width:520px;">We use cookies to improve your experience and measure site traffic. ' +
        '<a href="/privacy.html" style="color:#c9a84c;">Privacy Policy</a></span>' +
        '<button id="accept-cookies" style="background:#c9a84c;border:none;color:#000;padding:8px 20px;border-radius:20px;font-weight:700;cursor:pointer;">Accept</button>' +
        '<button id="decline-cookies" style="background:transparent;border:1px solid #888;color:#fff;padding:8px 20px;border-radius:20px;font-weight:700;cursor:pointer;">Decline</button>';
      document.body.appendChild(banner);
      document.getElementById('accept-cookies').onclick = function () { grantConsent(); banner.remove(); };
      document.getElementById('decline-cookies').onclick = function () { denyConsent(); banner.remove(); };
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupBanner);
  } else {
    setupBanner();
  }
})();
