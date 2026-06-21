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
    var drawer = document.querySelector('.rd-mobile-drawer');
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.attributeName === 'class') {
          var isActive = document.body.classList.contains('is-active');
          document.documentElement.style.overflow = isActive ? 'hidden' : '';
          if (drawer) {
            drawer.classList.toggle('is-active', isActive);
          }
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
      var results = overlay.querySelector('[data-predictive-search-results]');
      if (results) results.setAttribute('hidden', '');
      if (input) input.value = '';
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

  /* ── Predictive Search ── */
  function initPredictiveSearch() {
    var input = document.querySelector('[data-predictive-search-input]');
    if (!input) return;

    var resultsContainer = document.querySelector('[data-predictive-search-results]');
    var quickContainer   = document.querySelector('[data-search-quick]');
    var quickGrid        = document.querySelector('[data-search-quick-grid]');

    var debounceTimer;
    var minChars = 2;

    input.addEventListener('input', function () {
      clearTimeout(debounceTimer);
      var query = this.value.trim();

      if (query.length < minChars) {
        if (resultsContainer) resultsContainer.setAttribute('hidden', '');
        return;
      }

      debounceTimer = setTimeout(function () {
        fetchPredictiveResults(query);
      }, 300);
    });

    function fetchPredictiveResults(query) {
      var url = '/search/suggest.json?q=' + encodeURIComponent(query) + '&resources[type]=product&resources[limit]=6';

      fetch(url)
        .then(function (res) { return res.json(); })
        .then(function (data) {
          var products = data.resources.results.products;
          if (!products || !products.length) {
            if (resultsContainer) resultsContainer.removeAttribute('hidden');
            if (quickContainer) quickContainer.setAttribute('hidden', '');
            return;
          }

          if (resultsContainer) resultsContainer.removeAttribute('hidden');

          var html = '';
          products.forEach(function (p) {
            var img = p.image
              ? '<img src="' + p.image + '" alt="' + p.title.replace(/"/g, '&quot;') + '" class="rd-search-overlay__quick-img" width="140" height="140" loading="lazy" />'
              : '<div class="rd-search-overlay__quick-img" style="background:var(--rd-bg-dark-card);aspect-ratio:1;border-radius:var(--rd-radius-md)"></div>';
            var price = p.price
              ? '<span class="rd-search-overlay__quick-price">' + Shopify.formatMoney(p.price) + '</span>'
              : '';
            html +=
              '<a href="' + p.url + '" class="rd-search-overlay__quick-item">' +
                img +
                '<span class="rd-search-overlay__quick-title">' + p.title + '</span>' +
                price +
              '</a>';
          });

          if (quickGrid) quickGrid.innerHTML = html;
          if (quickContainer) quickContainer.removeAttribute('hidden');

          // Hide trending when results show
          var trending = document.querySelector('[data-search-trending]');
          if (trending) trending.style.display = 'none';
        })
        .catch(function () {
          // Silently fail — search will still work on submit
        });
    }

    // Reset on close
    var overlay = input.closest('[data-search-overlay]');
    if (overlay) {
      var observer = new MutationObserver(function () {
        if (overlay.hasAttribute('hidden')) {
          if (quickGrid) quickGrid.innerHTML = '';
          if (resultsContainer) resultsContainer.setAttribute('hidden', '');
          var trending = document.querySelector('[data-search-trending]');
          if (trending) trending.style.display = '';
        }
      });
      observer.observe(overlay, { attributes: true, attributeFilter: ['hidden'] });
    }
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
    initPredictiveSearch();
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
   * 10. FILTER DRAWER (mobile) + sort chips
   * ──────────────────────────────────────────── */
  function initFilterDrawer() {
    var toggles = document.querySelectorAll('[id^="rd-filter-toggle-"]');

    // Mobile drawer sort chips
    document.querySelectorAll('[data-sort]').forEach(function (chip) {
      chip.addEventListener('click', function (e) {
        e.preventDefault();
        var url = new URL(window.location.href);
        url.searchParams.set('sort_by', this.getAttribute('data-sort'));
        url.searchParams.delete('page');
        window.location.href = url.toString();
      });
    });
    toggles.forEach(function (toggle) {
      toggle.addEventListener('click', function () {
        var drawerId = this.getAttribute('aria-controls');
        var drawer   = document.getElementById(drawerId);
        if (!drawer) return;
        var expanded = this.getAttribute('aria-expanded') === 'true';
        if (expanded) {
          drawer.setAttribute('hidden', '');
          this.setAttribute('aria-expanded', 'false');
        } else {
          drawer.removeAttribute('hidden');
          this.setAttribute('aria-expanded', 'true');
          document.body.classList.add('rd-body-locked');
        }
      });
    });

    // Close on backdrop click or close button
    document.addEventListener('click', function (e) {
      if (e.target.matches('[data-filter-close]')) {
        var drawer = e.target.closest('.rd-filter-drawer');
        if (!drawer) return;
        drawer.setAttribute('hidden', '');
        var toggle = document.querySelector('[aria-controls="' + drawer.id + '"]');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('rd-body-locked');
      }
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        var openDrawer = document.querySelector('.rd-filter-drawer:not([hidden])');
        if (openDrawer) {
          openDrawer.setAttribute('hidden', '');
          var toggle = document.querySelector('[aria-controls="' + openDrawer.id + '"]');
          if (toggle) toggle.setAttribute('aria-expanded', 'false');
          document.body.classList.remove('rd-body-locked');
        }
      }
    });
  }

  /* ────────────────────────────────────────────
   * INIT
   * ──────────────────────────────────────────── */
  function initPhase5() {
    initCollectionFilter();
    initCollectionSort();
    initFilterDrawer();
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
   * 7. CART DRAWER
   * ──────────────────────────────────────────── */
  function initCartDrawer() {
    var drawer = document.getElementById('rd-cart-drawer');
    if (!drawer) return;

    /* ── Open ── */
    function openCartDrawer() {
      drawer.removeAttribute('hidden');
      document.body.classList.add('rd-body-locked');
      fetchRecommendations();
    }

    /* ── Close ── */
    function closeCartDrawer() {
      drawer.setAttribute('hidden', '');
      document.body.classList.remove('rd-body-locked');
    }

    /* ── Public API ── */
    window.RenoDart.cartDrawer = { open: openCartDrawer, close: closeCartDrawer };

    /* ── Click close (backdrop + button) ── */
    drawer.addEventListener('click', function (e) {
      if (e.target.matches('[data-cart-drawer-close]')) {
        closeCartDrawer();
      }
    });

    /* ── Escape key ── */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !drawer.hasAttribute('hidden')) {
        closeCartDrawer();
      }
    });

    /* ── Quantity buttons ── */
    drawer.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-qty-minus], [data-qty-plus]');
      if (!btn) return;
      var input = btn.parentElement.querySelector('[data-qty-input]');
      if (!input) return;
      var line  = btn.getAttribute('data-line');
      var key   = btn.getAttribute('data-key');
      var delta = btn.hasAttribute('data-qty-plus') ? 1 : -1;
      var val   = Math.max(0, parseInt(input.value, 10) + delta);
      input.value = val;
      updateCartLine(line, key, val);
    });

    /* ── Direct quantity input ── */
    drawer.addEventListener('change', function (e) {
      var input = e.target.closest('[data-qty-input]');
      if (!input) return;
      var val  = Math.max(0, parseInt(input.value, 10) || 0);
      var line = input.getAttribute('data-line');
      var key  = input.getAttribute('data-key');
      updateCartLine(line, key, val);
    });

    /* ── Remove button ── */
    drawer.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-cart-drawer-remove]');
      if (!btn) return;
      var line = btn.getAttribute('data-line');
      var key  = btn.getAttribute('data-key');
      updateCartLine(line, key, 0);
    });

    function updateCartLine(line, key, quantity) {
      if (!line && key) {
        var item = drawer.querySelector('[data-cart-drawer-item="' + key + '"]');
        if (item) line = item.querySelector('[data-qty-input]').getAttribute('data-line');
      }
      fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ line: parseInt(line, 10), quantity: quantity })
      })
      .then(function (r) { return r.json(); })
      .then(function (cart) {
        refreshCartDrawer(cart);
        var badge = document.querySelector('.rd-cart-badge');
        if (badge) badge.textContent = cart.item_count;
      })
      .catch(function () {
        window.location.reload();
      });
    }

    function refreshCartDrawer(cart) {
      var itemsContainer = drawer.querySelector('.rd-cart-drawer__items');
      var subtotalEl    = drawer.querySelector('[data-cart-drawer-subtotal]');
      var emptyEl       = drawer.querySelector('.rd-cart-drawer__empty');
      var recsContainer = drawer.querySelector('[data-cart-drawer-recs]');

      if (cart.item_count === 0) {
        itemsContainer.innerHTML =
          '<div class="rd-cart-drawer__empty">' +
            '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" aria-hidden="true">' +
              '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>' +
              '<path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>' +
            '</svg>' +
            '<p class="rd-cart-drawer__empty-text">Your cart is empty</p>' +
          '</div>';
        if (recsContainer) recsContainer.setAttribute('hidden', '');
      } else {
        var html = '';
        cart.items.forEach(function (item) {
          var img = item.image ? '<img src="' + item.image + '" alt="' + item.title.replace(/"/g, '&quot;') + '" class="rd-cart-drawer__item-img" width="70" height="70" loading="lazy" />' : '';
          var variantHtml = item.variant_title && item.variant_title !== 'Default Title'
            ? '<p class="rd-cart-drawer__item-variant">' + item.variant_title + '</p>'
            : '';
          html +=
            '<div class="rd-cart-drawer__item" data-cart-drawer-item="' + item.key + '">' +
              '<a href="' + item.url + '" class="rd-cart-drawer__item-img-link">' + img + '</a>' +
              '<div class="rd-cart-drawer__item-info">' +
                '<a href="' + item.url + '" class="rd-cart-drawer__item-title">' + item.title.split(' - ')[0] + '</a>' +
                variantHtml +
                '<div class="rd-cart-drawer__item-bottom">' +
                  '<div class="rd-cart-drawer__qty">' +
                    '<button class="rd-cart-drawer__qty-btn" data-qty-minus data-line="' + item.line + '" data-key="' + item.key + '">−</button>' +
                    '<input type="number" value="' + item.quantity + '" class="rd-cart-drawer__qty-input" data-qty-input data-line="' + item.line + '" data-key="' + item.key + '" min="0" />' +
                    '<button class="rd-cart-drawer__qty-btn" data-qty-plus data-line="' + item.line + '" data-key="' + item.key + '">+</button>' +
                  '</div>' +
                  '<span class="rd-cart-drawer__item-price">' + Shopify.formatMoney(item.line_price) + '</span>' +
                '</div>' +
              '</div>' +
              '<button class="rd-cart-drawer__item-remove" data-cart-drawer-remove data-line="' + item.line + '" data-key="' + item.key + '">' +
                '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
              '</button>' +
            '</div>';
        });
        itemsContainer.innerHTML = html;
        if (recsContainer) recsContainer.removeAttribute('hidden');
      }
      subtotalEl.textContent = Shopify.formatMoney(cart.total_price);
    }

    /* ── Fetch recommendations via /recommendations/products ── */
    function fetchRecommendations() {
      var recsContainer = drawer.querySelector('[data-cart-drawer-recs]');
      if (!recsContainer) return;
      var recsGrid = drawer.querySelector('[data-cart-drawer-recs-grid]');
      if (!recsGrid) return;

      // Get product IDs from current items
      var items = drawer.querySelectorAll('[data-cart-drawer-item]');
      var productIds = [];
      items.forEach(function (item) {
        var input = item.querySelector('[data-qty-input]');
        if (input && parseInt(input.value, 10) > 0) {
          // We don't have product ID directly, so skip for now
        }
      });

      // Fetch from the last item's product URL as a simple approach
      var lastItemLink = drawer.querySelector('.rd-cart-drawer__item-img-link');
      if (!lastItemLink) return;

      var productUrl = lastItemLink.getAttribute('href');
      if (!productUrl) return;

      var recsUrl = productUrl + '?view=recommendations';
      fetch(recsUrl)
        .then(function (r) { return r.text(); })
        .then(function (html) {
          var parser = new DOMParser();
          var doc    = parser.parseFromString(html, 'text/html');
          var products = doc.querySelectorAll('[data-recommended-product]');
          if (products.length) {
            recsContainer.removeAttribute('hidden');
            var gridHtml = '';
            products.forEach(function (prod) {
              var img   = prod.querySelector('[data-recs-img]');
              var title = prod.querySelector('[data-recs-title]');
              var price = prod.querySelector('[data-recs-price]');
              var link  = prod.querySelector('[data-recs-url]');
              gridHtml +=
                '<a href="' + (link ? link.getAttribute('href') : '#') + '" class="rd-cart-drawer__rec-card">' +
                  (img ? img.outerHTML : '') +
                  (title ? '<span class="rd-cart-drawer__rec-title">' + title.textContent + '</span>' : '') +
                  (price ? '<span class="rd-cart-drawer__rec-price">' + price.textContent + '</span>' : '') +
                '</a>';
            });
            if (gridHtml) recsGrid.innerHTML = gridHtml;
          }
        })
        .catch(function () { /* silently fail */ });
    }

    /* ── Auto-open after AJAX add-to-cart ── */
    // If the page was loaded with recent add-to-cart, open drawer
    // Also, subscribe to basket changes via MutationObserver fallback
    document.addEventListener('cart:added', function () {
      openCartDrawer();
    });

    // Also intercept the Turbo AJAX add-to-cart by observing URL hash or badge changes
    var badge = document.querySelector('.rd-cart-badge');
    if (badge) {
      var badgeObserver = new MutationObserver(function () {
        if (drawer.hasAttribute('hidden') && parseInt(badge.textContent, 10) > 0) {
          // Don't auto-open, but be ready
        }
      });
      badgeObserver.observe(badge, { childList: true, characterData: true, subtree: true });
    }
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
    initCartDrawer();
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

  /* ════════════════════════════════════════════════
   * PHASE 7 — Customer Auth
   * ════════════════════════════════════════════════ */

  function initFloatingLabels() {
    // Activate floating labels for pre-filled inputs on page load
    document.querySelectorAll('.rd-field__input').forEach(function (input) {
      if (input.value) {
        input.setAttribute('placeholder', ' ');
      }
    });
  }

  function initPhase7() {
    initFloatingLabels();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPhase7);
  } else {
    initPhase7();
  }

  if (window.InstantClick) {
    document.addEventListener('page:change', initPhase7);
  }

  window.RenoDart = window.RenoDart || {};
  window.RenoDart.phase7 = { init: initPhase7 };

})();
