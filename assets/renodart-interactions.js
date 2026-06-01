/**
 * RenoDart Interactions System
 * Phase 1: Foundation – Scroll Reveal, Smooth Animations, Performance
 * ─────────────────────────────────────────────────────────────────────
 * Vanilla JS only — no framework dependencies.
 * Designed to coexist with the existing jQuery/Turbo app.js.
 * Uses IntersectionObserver for scroll reveals (no layout thrashing).
 * Respects prefers-reduced-motion.
 */

(function () {
  'use strict';

  /* ─── Guard: only run once ─── */
  if (window.__rdInteractionsLoaded) return;
  window.__rdInteractionsLoaded = true;

  /* ─── Reduced motion check ─── */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ════════════════════════════════════════════════
   * 1. SCROLL REVEAL — IntersectionObserver
   * ════════════════════════════════════════════════ */
  function initScrollReveal() {
    if (prefersReducedMotion) {
      // Make all reveal elements immediately visible
      document.querySelectorAll('.rd-reveal, .rd-reveal--left, .rd-reveal--right, .rd-reveal--scale')
        .forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    if (!('IntersectionObserver' in window)) {
      // Fallback: show everything immediately
      document.querySelectorAll('.rd-reveal, .rd-reveal--left, .rd-reveal--right, .rd-reveal--scale')
        .forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // Reveal once only
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.rd-reveal, .rd-reveal--left, .rd-reveal--right, .rd-reveal--scale')
      .forEach(function (el) { observer.observe(el); });
  }

  /* ════════════════════════════════════════════════
   * 2. HEADER SCROLL BEHAVIOR
   * Adds .rd-header--scrolled class when page scrolls
   * ════════════════════════════════════════════════ */
  function initHeaderScroll() {
    var header = document.querySelector('.rd-header');
    if (!header) return;

    var scrollThreshold = 60;
    var ticking = false;

    function updateHeader() {
      if (window.scrollY > scrollThreshold) {
        header.classList.add('rd-header--scrolled');
      } else {
        header.classList.remove('rd-header--scrolled');
      }
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });

    // Run on init
    updateHeader();
  }

  /* ════════════════════════════════════════════════
   * 3. SMOOTH HOVER LIFT — Product Cards
   * Adds subtle 3D tilt on hover for premium feel
   * ════════════════════════════════════════════════ */
  function initCardTilt() {
    if (prefersReducedMotion) return;
    if (window.matchMedia('(hover: none)').matches) return; // Skip touch devices

    document.querySelectorAll('.rd-card--tilt').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;
        var rotateX = ((y - centerY) / centerY) * -4;
        var rotateY = ((x - centerX) / centerX) * 4;

        card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-3px)';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }

  /* ════════════════════════════════════════════════
   * 4. CART COUNT ANIMATION
   * Pulses the cart badge when item count changes
   * ════════════════════════════════════════════════ */
  function initCartBadge() {
    var badge = document.querySelector('.rd-cart-badge');
    if (!badge) return;

    // Watch for DOM changes to the badge
    var observer = new MutationObserver(function () {
      if (prefersReducedMotion) return;
      badge.classList.remove('rd-cart-badge--pulse');
      // Force reflow
      void badge.offsetWidth;
      badge.classList.add('rd-cart-badge--pulse');
    });

    observer.observe(badge, { childList: true, subtree: true, characterData: true });
  }

  /* ════════════════════════════════════════════════
   * 5. LAZY IMAGE ENHANCEMENT
   * Adds native loading="lazy" to images missing it
   * ════════════════════════════════════════════════ */
  function initLazyImages() {
    if (!('loading' in HTMLImageElement.prototype)) return;

    document.querySelectorAll('img:not([loading])').forEach(function (img) {
      // Don't lazy-load above-the-fold images (first 3 in hero areas)
      if (!img.closest('.rd-hero') && !img.closest('.rd-header')) {
        img.setAttribute('loading', 'lazy');
        img.setAttribute('decoding', 'async');
      }
    });
  }

  /* ════════════════════════════════════════════════
   * 6. SMOOTH ANCHOR SCROLL
   * ════════════════════════════════════════════════ */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        var headerHeight = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--rd-header-height') || '70'
        );
        var top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
        window.scrollTo({ top: top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      });
    });
  }

  /* ════════════════════════════════════════════════
   * 7. SECTION ENTRANCE — page load animation
   * ════════════════════════════════════════════════ */
  function initPageEntrance() {
    if (prefersReducedMotion) return;
    document.documentElement.classList.add('rd-page-loaded');
  }

  /* ════════════════════════════════════════════════
   * 8. MOBILE MENU BODY LOCK
   * Prevents scroll when mobile drawer is open
   * ════════════════════════════════════════════════ */
  function initBodyLock() {
    // Watch for the existing Turbo .is-active class on body
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.attributeName === 'class') {
          var isActive = document.body.classList.contains('is-active');
          document.documentElement.style.overflow = isActive ? 'hidden' : '';
        }
      });
    });
    observer.observe(document.body, { attributes: true });
  }

  /* ════════════════════════════════════════════════
   * INIT — Run after DOM is ready
   * ════════════════════════════════════════════════ */
  function init() {
    initScrollReveal();
    initHeaderScroll();
    initCardTilt();
    initCartBadge();
    initLazyImages();
    initSmoothScroll();
    initPageEntrance();
    initBodyLock();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* Re-init on InstantClick page transitions (Turbo compatibility) */
  if (window.InstantClick) {
    document.addEventListener('page:change', function () {
      window.__rdInteractionsLoaded = false;
      init();
      window.__rdInteractionsLoaded = true;
    });
  }

  /* Expose public API for other scripts */
  window.RenoDart = window.RenoDart || {};
  window.RenoDart.interactions = {
    initScrollReveal: initScrollReveal,
    initCardTilt: initCardTilt
  };

})();

/* ════════════════════════════════════════════════
 * PHASE 2 ADDITIONS
 * ════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Fullscreen Search Overlay ── */
  function initFullscreenSearch() {
    var overlay  = document.getElementById('rd-search-overlay');
    var input    = document.getElementById('rd-search-overlay-input');
    var triggers = document.querySelectorAll('.js-rd-search-open');
    var closes   = document.querySelectorAll('.js-rd-search-close');

    if (!overlay) return;

    function openSearch() {
      overlay.removeAttribute('hidden');
      overlay.setAttribute('aria-hidden', 'false');
      document.documentElement.style.overflow = 'hidden';
      if (input) {
        setTimeout(function () { input.focus(); }, 80);
      }
    }

    function closeSearch() {
      overlay.setAttribute('hidden', '');
      overlay.setAttribute('aria-hidden', 'true');
      document.documentElement.style.overflow = '';
    }

    triggers.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        openSearch();
      });
    });

    closes.forEach(function (btn) {
      btn.addEventListener('click', closeSearch);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !overlay.hasAttribute('hidden')) {
        closeSearch();
      }
    });
  }

  /* ── Footer accordion (mobile) ── */
  function initFooterAccordion() {
    var headings = document.querySelectorAll('.rd-footer__col-heading');

    headings.forEach(function (heading) {
      heading.addEventListener('click', function () {
        // Only activate on mobile
        if (window.innerWidth > 768) return;

        var content = heading.nextElementSibling;
        if (!content || !content.classList.contains('rd-footer__col-content')) return;

        var isOpen = content.classList.contains('is-open');

        // Close all
        document.querySelectorAll('.rd-footer__col-content.is-open').forEach(function (el) {
          el.classList.remove('is-open');
          el.previousElementSibling && el.previousElementSibling.classList.remove('is-open');
        });

        // Open clicked if it was closed
        if (!isOpen) {
          content.classList.add('is-open');
          heading.classList.add('is-open');
        }
      });
    });
  }

  /* ── Header scroll shrink (Phase 2 version — targets .rd-header) ── */
  function initRdHeaderScroll() {
    var header = document.querySelector('.rd-header');
    if (!header) return;

    var ticking = false;
    var threshold = 80;

    function update() {
      if (window.scrollY > threshold) {
        header.classList.add('rd-header--scrolled');
      } else {
        header.classList.remove('rd-header--scrolled');
      }
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });

    update();
  }

  /* ── Cart badge pulse on item count change ── */
  function initCartBadgePulse() {
    var badges = document.querySelectorAll('.rd-cart-badge');
    badges.forEach(function (badge) {
      var observer = new MutationObserver(function () {
        badge.classList.remove('rd-cart-badge--pulse');
        void badge.offsetWidth; // reflow
        badge.classList.add('rd-cart-badge--pulse');

        // Show/hide based on count
        var count = parseInt(badge.textContent, 10);
        if (count > 0) {
          badge.classList.remove('rd-cart-badge--empty');
        } else {
          badge.classList.add('rd-cart-badge--empty');
        }
      });
      observer.observe(badge, { childList: true, subtree: true, characterData: true });
    });
  }

  /* ── Promo banner close ── */
  function initPromoBanner() {
    document.querySelectorAll('.rd-promo-banner__close').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var banner = btn.closest('.rd-promo-banner');
        if (!banner) return;
        banner.style.maxHeight = banner.offsetHeight + 'px';
        banner.style.overflow = 'hidden';
        banner.style.transition = 'max-height 0.3s ease, opacity 0.3s ease';
        requestAnimationFrame(function () {
          banner.style.maxHeight = '0';
          banner.style.opacity = '0';
        });
        setTimeout(function () { banner.remove(); }, 350);
      });
    });
  }

  /* ── Init all Phase 2 features ── */
  function initPhase2() {
    initFullscreenSearch();
    initFooterAccordion();
    initRdHeaderScroll();
    initCartBadgePulse();
    initPromoBanner();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPhase2);
  } else {
    initPhase2();
  }

  /* Re-init on InstantClick transitions */
  if (window.InstantClick) {
    document.addEventListener('page:change', initPhase2);
  }

  window.RenoDart = window.RenoDart || {};
  window.RenoDart.phase2 = { init: initPhase2 };

})();
