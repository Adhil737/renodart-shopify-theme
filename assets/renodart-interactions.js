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

/* ════════════════════════════════════════════════
 * PHASE 4 — PRODUCT PAGE
 * ════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── Collapsible tabs ── */
  function initProductTabs() {
    document.querySelectorAll('.rd-pdp__tab-trigger').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var expanded = btn.getAttribute('aria-expanded') === 'true';
        var contentId = btn.getAttribute('aria-controls');
        var content   = document.getElementById(contentId);
        if (!content) return;

        if (expanded) {
          btn.setAttribute('aria-expanded', 'false');
          content.hidden = true;
        } else {
          btn.setAttribute('aria-expanded', 'true');
          content.hidden = false;
        }
      });
    });
  }

  /* ── Sticky ATC — shows after scrolling past the main ATC button ── */
  function initStickyAtc() {
    var stickyBars = document.querySelectorAll('.rd-sticky-atc');
    if (!stickyBars.length) return;

    stickyBars.forEach(function (bar) {
      var productId = bar.id.replace('rd-sticky-atc-', '');
      var mainForm  = document.getElementById('product-form-' + productId);
      if (!mainForm) return;

      var ticking = false;

      function check() {
        var rect = mainForm.getBoundingClientRect();
        if (rect.bottom < 0) {
          bar.classList.add('is-visible');
          bar.removeAttribute('aria-hidden');
        } else {
          bar.classList.remove('is-visible');
          bar.setAttribute('aria-hidden', 'true');
        }
        ticking = false;
      }

      window.addEventListener('scroll', function () {
        if (!ticking) { window.requestAnimationFrame(check); ticking = true; }
      }, { passive: true });

      check();
    });

    /* Sticky ATC button → add to cart via AJAX */
    document.querySelectorAll('.js-rd-sticky-atc-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var variantId = btn.getAttribute('data-variant-id');
        if (!variantId) return;

        btn.disabled = true;
        btn.textContent = 'Adding…';

        fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: parseInt(variantId, 10), quantity: 1 })
        })
        .then(function (r) { return r.json(); })
        .then(function () {
          btn.textContent = 'Added!';
          setTimeout(function () {
            btn.disabled = false;
            btn.textContent = btn.getAttribute('data-original-text') || 'Add to Cart';
          }, 1800);
        })
        .catch(function () {
          btn.disabled = false;
          btn.textContent = 'Try again';
        });
      });

      /* Store original text */
      btn.setAttribute('data-original-text', btn.textContent);
    });
  }

  /* ── Buy Now — keep variant in sync with main form ── */
  function initBuyNow() {
    document.querySelectorAll('[id^="rd-buy-now-form-"]').forEach(function (form) {
      var productId = form.id.replace('rd-buy-now-form-', '');
      var mainSelect = document.getElementById('product-select-' + productId);
      var hiddenInput = document.getElementById('rd-buy-now-variant-' + productId);
      if (!mainSelect || !hiddenInput) return;

      mainSelect.addEventListener('change', function () {
        hiddenInput.value = mainSelect.value;
      });
    });
  }

  /* ── Discount badge on variant change ── */
  function initVariantDiscountSync() {
    /* Hooks into Turbo's selectCallback via MutationObserver on price elements */
    document.querySelectorAll('.rd-pdp__current-price').forEach(function (el) {
      var observer = new MutationObserver(function () {
        var priceWrap   = el.closest('.rd-pdp__price-block');
        if (!priceWrap) return;
        var badge = priceWrap.querySelector('.rd-pdp__discount-badge');
        var comparePriceEl = priceWrap.querySelector('.rd-pdp__compare-price .money');
        var currentPriceEl = priceWrap.querySelector('.rd-pdp__current-price .money');
        if (!badge || !comparePriceEl || !currentPriceEl) return;

        var compare = parseFloat(comparePriceEl.textContent.replace(/[^0-9.]/g, ''));
        var current = parseFloat(currentPriceEl.textContent.replace(/[^0-9.]/g, ''));
        if (compare > current) {
          var pct = Math.round((compare - current) / compare * 100);
          badge.textContent = 'Save ' + pct + '%';
          badge.style.display = '';
        } else {
          badge.style.display = 'none';
        }
      });
      observer.observe(el, { childList: true, subtree: true, characterData: true });
    });
  }

  function initPhase4() {
    initProductTabs();
    initStickyAtc();
    initBuyNow();
    initVariantDiscountSync();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPhase4);
  } else {
    initPhase4();
  }

  if (window.InstantClick) {
    document.addEventListener('page:change', initPhase4);
  }

  window.RenoDart = window.RenoDart || {};
  window.RenoDart.phase4 = { init: initPhase4 };

})();

/* ════════════════════════════════════════════════
 * PHASE 5 — Collection, Cart, Sections
 * ════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ────────────────────────────────────────────
   * 1. COLLECTION FILTER SELECT
   * Immediately redirects on <select> change
   * (Turbo's app.js also does this, but this
   *  ensures it works with the new rd- markup)
   * ──────────────────────────────────────────── */
  function initCollectionFilter() {
    var tagFilter = document.getElementById('tag_filter');
    if (tagFilter) {
      tagFilter.addEventListener('change', function () {
        window.location.href = this.value;
      });
    }
  }

  /* ────────────────────────────────────────────
   * 2. COLLECTION SORT SELECT
   * Appends sort_by param to current URL
   * ──────────────────────────────────────────── */
  function initCollectionSort() {
    var sortSelect = document.getElementById('sort-by');
    if (!sortSelect) return;

    // Set the currently active sort
    var params = new URLSearchParams(window.location.search);
    var currentSort = params.get('sort_by') || sortSelect.getAttribute('data-default-sort') || '';
    if (currentSort) {
      for (var i = 0; i < sortSelect.options.length; i++) {
        if (sortSelect.options[i].value === currentSort) {
          sortSelect.selectedIndex = i;
          break;
        }
      }
    }

    sortSelect.addEventListener('change', function () {
      var url = new URL(window.location.href);
      url.searchParams.set('sort_by', this.value);
      // Remove page param when resorting
      url.searchParams.delete('page');
      window.location.href = url.toString();
    });
  }

  /* ────────────────────────────────────────────
   * 3. CART PAGE — live line-price update
   * Updates line totals when quantity inputs
   * change (before form submit)
   * ──────────────────────────────────────────── */
  function initCartQuantityPreview() {
    var cartItems = document.querySelectorAll('.rd-cart-item');
    if (!cartItems.length) return;

    cartItems.forEach(function (item) {
      var qtyInput = item.querySelector('.rd-qty-input, input.quantity');
      var totalEl  = item.querySelector('.rd-cart-item__total');
      var priceEl  = item.querySelector('.rd-cart-item__price .money, .modal_price .money');

      if (!qtyInput || !totalEl || !priceEl) return;

      // Parse unit price from displayed money string
      function parsePrice(moneyStr) {
        return parseFloat((moneyStr || '').replace(/[^0-9.]/g, '')) || 0;
      }

      var unitPrice = parsePrice(priceEl.textContent);

      qtyInput.addEventListener('input', function () {
        var qty = Math.max(0, parseInt(this.value, 10) || 0);
        var lineTotal = (unitPrice * qty).toFixed(2);
        // Format like the page currency (simple — no multi-currency conversion)
        var prefix = (priceEl.textContent.match(/^[^0-9]+/) || [''])[0];
        totalEl.textContent = prefix + lineTotal;
      });
    });
  }

  /* ────────────────────────────────────────────
   * 4. CART QUANTITY BUTTONS — rd-qty-box
   * Handles +/- on the cart page quantity boxes
   * (Turbo's .js-change-quantity handles mini cart)
   * ──────────────────────────────────────────── */
  function initCartQtyButtons() {
    document.querySelectorAll('.rd-qty-box').forEach(function (box) {
      var input   = box.querySelector('.rd-qty-input, input.quantity');
      var minusBtn = box.querySelector('[data-func="minus"]');
      var plusBtn  = box.querySelector('[data-func="plus"]');
      if (!input) return;

      if (minusBtn) {
        minusBtn.addEventListener('click', function () {
          var val = parseInt(input.value, 10) || 1;
          if (val > 0) {
            input.value = val - 1;
            input.dispatchEvent(new Event('input', { bubbles: true }));
          }
        });
      }
      if (plusBtn) {
        plusBtn.addEventListener('click', function () {
          var val = parseInt(input.value, 10) || 0;
          input.value = val + 1;
          input.dispatchEvent(new Event('input', { bubbles: true }));
        });
      }
    });
  }

  /* ────────────────────────────────────────────
   * 5. LOGO BAR MARQUEE — duplicate items for
   * seamless infinite scroll effect
   * ──────────────────────────────────────────── */
  function initLogoBarMarquee() {
    document.querySelectorAll('.rd-logo-bar__track--marquee').forEach(function (track) {
      // Clone all children for seamless loop
      var items = track.querySelectorAll('.rd-logo-bar__item');
      if (items.length === 0) return;

      items.forEach(function (item) {
        var clone = item.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
      });
    });
  }

  /* ────────────────────────────────────────────
   * 6. NEWSLETTER BACKGROUND (lazy bg-image)
   * Sets background-image from data-src on
   * .rd-newsletter__bg elements
   * ──────────────────────────────────────────── */
  function initNewsletterBg() {
    document.querySelectorAll('.rd-newsletter__bg[data-src]').forEach(function (el) {
      var src = el.getAttribute('data-src');
      if (src) {
        el.style.backgroundImage = 'url("' + src + '")';
        el.removeAttribute('data-src');
      }
    });
  }

  /* ────────────────────────────────────────────
   * 7. TESTIMONIAL GRID — animate cards in
   * ──────────────────────────────────────────── */
  function initTestimonialGrid() {
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !('IntersectionObserver' in window)) return;

    var cards = document.querySelectorAll('.rd-testimonial-card');
    if (!cards.length) return;

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          // stagger by index
          setTimeout(function () {
            entry.target.classList.add('is-visible');
          }, i * 80);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    cards.forEach(function (card) {
      card.classList.add('rd-reveal');
      obs.observe(card);
    });
  }

  /* ────────────────────────────────────────────
   * 8. FEATURED-PRODUCTS — stagger reveal
   * Adds .rd-reveal to .collection-in-detail items
   * ──────────────────────────────────────────── */
  function initFeaturedProductsReveal() {
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !('IntersectionObserver' in window)) return;

    document.querySelectorAll('.rd-featured-product-row').forEach(function (row) {
      if (!row.classList.contains('rd-reveal')) {
        row.classList.add('rd-reveal');
      }

      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      obs.observe(row);
    });
  }

  /* ────────────────────────────────────────────
   * 9. COLLECTION HERO PARALLAX (subtle)
   * ──────────────────────────────────────────── */
  function initCollectionHeroParallax() {
    var hero = document.querySelector('.rd-collection-hero .rd-hero__img');
    if (!hero) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(hover: none)').matches) return; // skip touch

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          var scrollY = window.scrollY;
          var heroEl  = hero.closest('.rd-collection-hero');
          if (!heroEl) { ticking = false; return; }
          var rect    = heroEl.getBoundingClientRect();
          if (rect.bottom < 0 || rect.top > window.innerHeight) { ticking = false; return; }
          var offset  = scrollY * 0.25;
          hero.style.transform = 'scale(1.06) translateY(' + offset + 'px)';
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ────────────────────────────────────────────
   * INIT
   * ──────────────────────────────────────────── */
  function initPhase5() {
    initCollectionFilter();
    initCollectionSort();
    initCartQuantityPreview();
    initCartQtyButtons();
    initLogoBarMarquee();
    initNewsletterBg();
    initTestimonialGrid();
    initFeaturedProductsReveal();
    initCollectionHeroParallax();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPhase5);
  } else {
    initPhase5();
  }

  if (window.InstantClick) {
    document.addEventListener('page:change', initPhase5);
  }

  window.RenoDart = window.RenoDart || {};
  window.RenoDart.phase5 = { init: initPhase5 };

})();

/* ════════════════════════════════════════════════
 * PHASE 6 — Blog, Article, Search, Gallery, Collection List
 * ════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ────────────────────────────────────────────
   * 1. BLOG TAG FILTER — redirect on select change
   * (The existing app.js also handles .blog_filter,
   *  but this ensures rd- markup works too)
   * ──────────────────────────────────────────── */
  function initBlogFilter() {
    var filter = document.getElementById('blog_filter');
    if (filter) {
      filter.addEventListener('change', function () {
        if (this.value) {
          window.location.href = this.value;
        }
      });
    }
  }

  /* ────────────────────────────────────────────
   * 2. ARTICLE READING PROGRESS BAR
   * Thin purple bar across top of page that fills
   * as the reader scrolls through the article body
   * ──────────────────────────────────────────── */
  function initReadingProgress() {
    var articleBody = document.querySelector('.rd-article__body');
    if (!articleBody) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Create the bar element
    var bar = document.createElement('div');
    bar.id = 'rd-reading-progress';
    bar.setAttribute('role', 'progressbar');
    bar.setAttribute('aria-label', 'Reading progress');
    bar.setAttribute('aria-valuenow', '0');
    bar.setAttribute('aria-valuemin', '0');
    bar.setAttribute('aria-valuemax', '100');
    bar.style.cssText = [
      'position: fixed',
      'top: 0',
      'left: 0',
      'height: 3px',
      'width: 0%',
      'background: var(--rd-gradient-primary)',
      'z-index: var(--rd-z-top)',
      'transition: width 0.1s linear',
      'pointer-events: none'
    ].join(';');

    document.body.appendChild(bar);

    var ticking = false;

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          var bodyRect   = articleBody.getBoundingClientRect();
          var bodyTop    = bodyRect.top + window.scrollY;
          var bodyBottom = bodyTop + articleBody.offsetHeight;
          var scrolled   = window.scrollY - bodyTop;
          var total      = bodyBottom - bodyTop - window.innerHeight;
          var pct        = total > 0 ? Math.min(100, Math.max(0, (scrolled / total) * 100)) : 0;

          bar.style.width = pct + '%';
          bar.setAttribute('aria-valuenow', Math.round(pct));
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ────────────────────────────────────────────
   * 3. SEARCH RESULTS — highlight search terms
   * Adds <mark> around the matched search query
   * in result descriptions (already has Liquid |highlight
   * for mixed results, but this covers product grid)
   * ──────────────────────────────────────────── */
  function initSearchHighlight() {
    var params = new URLSearchParams(window.location.search);
    var terms  = params.get('q');
    if (!terms || terms.length < 2) return;

    // Highlight in product card titles only (lightweight)
    var escaped = terms.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var regex   = new RegExp('(' + escaped + ')', 'gi');

    document.querySelectorAll('.rd-search-item__title a').forEach(function (el) {
      if (el.innerHTML && !el.querySelector('mark')) {
        el.innerHTML = el.innerHTML.replace(regex, '<mark style="background:rgba(124,58,237,.18);color:inherit;border-radius:2px;">$1</mark>');
      }
    });
  }

  /* ────────────────────────────────────────────
   * 4. GALLERY — lazy-load observer for items
   * Adds rd-reveal to each gallery item for
   * staggered entrance animation on scroll
   * ──────────────────────────────────────────── */
  function initGalleryReveal() {
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !('IntersectionObserver' in window)) return;

    var items = document.querySelectorAll('.rd-gallery-item:not(.rd-reveal)');
    if (!items.length) return;

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, idx) {
        if (entry.isIntersecting) {
          setTimeout(function () {
            entry.target.classList.add('is-visible');
          }, (idx % 5) * 60);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });

    items.forEach(function (item) {
      item.classList.add('rd-reveal');
      obs.observe(item);
    });
  }

  /* ────────────────────────────────────────────
   * 5. COLLECTION CARDS — stagger reveal
   * ──────────────────────────────────────────── */
  function initCollectionCardReveal() {
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !('IntersectionObserver' in window)) return;

    var cards = document.querySelectorAll('.rd-collection-card:not(.is-visible)');
    if (!cards.length) return;

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, idx) {
        if (entry.isIntersecting) {
          setTimeout(function () {
            entry.target.classList.add('is-visible');
          }, (idx % 6) * 80);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    cards.forEach(function (card) {
      obs.observe(card);
    });
  }

  /* ────────────────────────────────────────────
   * 6. SIDEBAR WIDGET — collapsible on mobile
   * ──────────────────────────────────────────── */
  function initSidebarWidgets() {
    if (window.innerWidth > 960) return;

    document.querySelectorAll('.rd-sidebar-widget').forEach(function (widget) {
      var title = widget.querySelector('.rd-sidebar-widget__title');
      if (!title) return;

      // Mark as collapsible
      title.style.cursor = 'pointer';
      title.setAttribute('role', 'button');
      title.setAttribute('aria-expanded', 'false');

      // Hide widget content initially on mobile
      var content = title.nextElementSibling;
      if (content) { content.style.display = 'none'; }

      title.addEventListener('click', function () {
        var expanded = title.getAttribute('aria-expanded') === 'true';
        title.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        if (content) {
          content.style.display = expanded ? 'none' : '';
        }
      });
    });
  }

  /* ────────────────────────────────────────────
   * INIT
   * ──────────────────────────────────────────── */
  function initPhase6() {
    initBlogFilter();
    initReadingProgress();
    initSearchHighlight();
    initGalleryReveal();
    initCollectionCardReveal();
    initSidebarWidgets();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPhase6);
  } else {
    initPhase6();
  }

  if (window.InstantClick) {
    document.addEventListener('page:change', initPhase6);
  }

  window.RenoDart = window.RenoDart || {};
  window.RenoDart.phase6 = { init: initPhase6 };

})();
