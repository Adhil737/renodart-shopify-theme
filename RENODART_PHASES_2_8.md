# RenoDart V2 — Phase 2–8 Execution PRD

> **Base:** Turbo v2.0.10 by Out of the Sandbox  
> **Phase 1 Complete:** Foundation restructure, token normalization, hex→token migration, JS isolation markers  
> **Commit:** `eac45c3`

---

## Phase 2 — Global UI System (Header + Footer)

### 2.1 `sections/header.liquid` — Full Rebuild

Replace existing header structure with:

```
.rd-header (glass wrapper, sticky)
├── .rd-promo-banner (optional announcement bar, closable)
├── .rd-header__inner
│   ├── .rd-header__logo (center or left)
│   ├── .rd-header__nav (mega menu desktop navigation)
│   │   └── .rd-mega-menu (dropdown with columns)
│   ├── .rd-header__actions
│   │   ├── .rd-header__search (search trigger → fullscreen overlay)
│   │   ├── .rd-header__cart (cart trigger with badge)
│   │   └── .rd-header__hamburger (mobile toggle, desktop hidden)
│   └── .rd-header__drawer (mobile fullscreen drawer)
│       ├── .rd-drawer__nav (accordion categories)
│       ├── .rd-drawer__submenu (expandable)
│       └── .rd-drawer__footer (account links, currency)
```

**Features:**
- Sticky header with `.rd-header--scrolled` state (shrink + blur glass)
- Shrink-on-scroll: height 70px → 56px, logo scales down
- Mega menu: multi-column dropdown on hover, arrows for submenus
- Fullscreen search overlay trigger (uses existing `#rd-search-overlay`)
- Cart trigger with `.rd-cart-badge` animated count
- Mobile fullscreen drawer with slide-in animation, body scroll lock
- Active menu underline animation (`.rd-nav__link--active`)
- Schema settings: announcement bar toggle, logo max height, menu alignment, sticky behavior
- Accessibility: ARIA expanded states, keyboard navigation, escape to close drawer

**Key Schema Controls:**
```json
{
  "rd_header_sticky": true,
  "rd_header_announcement": "text/color/closeable",
  "rd_header_logo_max_height": 40,
  "rd_header_menu_alignment": "left/center",
  "rd_header_show_search": true,
  "rd_header_show_cart": true
}
```

---

### 2.2 `sections/footer.liquid` — Full Rebuild

Replace existing footer structure with:

```
.rd-footer (gradient dark background)
├── .rd-footer__newsletter (email signup + social row)
├── .rd-footer__grid (4-column)
│   ├── .rd-footer__col (brand description + social)
│   ├── .rd-footer__col (quick links menu)
│   ├── .rd-footer__col (customer service links)
│   └── .rd-footer__col (contact info / hours)
├── .rd-footer__bottom
│   ├── .rd-footer__payment-icons (Shopify payment methods)
│   └── .rd-footer__copyright
```

**Features:**
- Gradient dark background using `--rd-gradient-footer`
- 4-column grid layout, collapses to accordion on mobile
- Newsletter form with name + email fields
- Social icons row (configurable via settings)
- Payment icons row (auto-detects enabled Shopify payments)
- Copyright bar with dynamic year + shop name
- Mobile accordion: click column heading to expand/collapse (existing JS)
- Hover glow links on interactive items
- Schema: column content selection, newsletter toggle, payment icons toggle

**Key Schema Controls:**
```json
{
  "rd_footer_newsletter": true,
  "rd_footer_columns": "4/3/2",
  "rd_footer_payment_icons": true,
  "rd_footer_copyright_text": "text"
}
```

---

## Phase 3 — Homepage System (UX Flow Engine)

### 3.1 `sections/slideshow.liquid` — Cinematic Upgrade

**Add to existing slideshow:**
- Cinematic overlay system: `.rd-hero-overlay` gradient overlay on each slide
- Animated CTA buttons: use `.rd-btn--cta` with shimmer effect
- Text reveal animations on slide change (stagger heading/subtitle/button)
- Gradient dark overlay `--rd-gradient-hero-overlay` for readability
- Mobile-optimized caption positioning
- Lazy loading for off-screen slides

### 3.2 NEW: `sections/bento-grid.liquid` — Category Bento Grid

Create new section for a mixed-size card grid:

```
.rd-bento-grid
├── .rd-bento-card--large (2x width)
├── .rd-bento-card--tall (2x height)
├── .rd-bento-card--small (standard)
└── .rd-bento-card--wide (2x width, half height)
```

**Features:**
- Grid with `grid-template-areas` for bento layout
- Each card: background image with gradient overlay on hover
- Glass labels on hover: `.rd-card--glass` over bottom of image
- Zoom effect on hover (scale 1.05)
- Schema: per-card image, heading, link, size selector

### 3.3 `sections/featured-collection.liquid` — Product Grid Engine

**Upgrade:**
- Use `.rd-product-grid` CSS grid layout
- Add quick add button overlay on hover (`.rd-btn--sm`)
- Add hover secondary image swap (use existing `data-secondary-image`)
- Responsive columns: 4→3→2→1 via `--rd-product-cols-*` tokens
- Staggered entrance animation using `.rd-stagger`

### 3.4 `sections/image-text.liquid` — Enhanced

**Upgrade:**
- Reversible layout: image left/right toggle
- Scroll reveal animation via `.rd-reveal` classes
- Feature list with bullet icons (checkmark SVG)
- Background color section variant toggle

---

## Phase 4 — Product Page (PDP Engine)

### 4.1 `sections/product-template.liquid` — Layout Rebuild

```
.rd-pdp
├── .rd-pdp__gallery (left, ~55% width)
│   ├── .rd-pdp__main-image (zoom enabled)
│   └── .rd-pdp__thumbnails (vertical strip)
├── .rd-pdp__info (right, ~45% width, sticky)
│   ├── .rd-pdp__vendor
│   ├── .rd-pdp__title
│   ├── .rd-pdp__price-block (current + compare + discount badge)
│   ├── .rd-pdp__description (short)
│   ├── .rd-pdp__options (variant pills/swatches)
│   ├── .rd-pdp__quantity (stepper)
│   ├── .rd-pdp__actions
│   │   ├── .rd-btn--cta (Add to Cart)
│   │   └── .rd-btn--primary (Buy Now)
│   ├── .rd-pdp__trust-badges (secure checkout, returns)
│   ├── .rd-pdp__shipping-info
│   └── .rd-pdp__tabs (collapsible: details, sizing, shipping)
└── .rd-sticky-atc (fixed bottom on scroll past fold)
```

### 4.2 Sticky Purchase Module (existing JS, enhance markup)

- Sticky ATC bar appears on scroll past main form
- Shows: product title + price + quantity + ATC button
- Uses existing `initStickyAtc()` in `renodart-interactions.js`
- Schema: sticky ATC toggle

### 4.3 Conversion Modules

- **Bundle offers:** Section below add to cart, shows product recommendations
- **Upsell:** "Complete the look" with complementary products
- **Trust badges:** Row of icons (lock, truck, returns, support)
- **Shipping info:** "Free shipping on orders over $X" bar

### 4.4 `snippets/product-images.liquid` — Gallery Upgrade

- Zoom on hover/click for desktop (use existing imageFunctions.zoom or vanilla)
- Swipe gallery for mobile (Flickity or touch events)
- Thumbnail navigation with active state
- Lightbox fullscreen view

---

## Phase 5 — Collection System

### 5.1 `sections/collection-template.liquid` — Rebuild

```
.rd-collection
├── .rd-collection__hero (optional banner)
├── .rd-collection__toolbar
│   ├── .rd-collection__filter-toggle (mobile: opens drawer)
│   ├── .rd-collection__sort (dropdown)
│   └── .rd-collection__count (result count)
├── .rd-collection__body
│   ├── .rd-collection__sidebar (desktop: sticky filters)
│   │   ├── .rd-filter-group (collapsible)
│   │   │   ├── heading (tag group name)
│   │   │   └── chips (clickable tag filters)
│   │   └── .rd-filter-actions (apply/reset)
│   └── .rd-collection__grid (.rd-product-grid)
│       └── product cards
└── .rd-collection__pagination
```

### 5.2 Product Card Enhancements

- Hover zoom on product image
- Secondary image swap on hover (`.swap-true`)
- Quick add button overlay
- Wishlist icon (heart SVG, toggled state)
- Rating display (stars)
- Badges: sale %, new, sold out

### 5.3 Mobile Filter Drawer

- Slide-up panel from bottom
- Chip-based filter selection
- Apply/Reset buttons
- Smooth slide animation
- Backdrop overlay
- Body scroll lock when open

---

## Phase 6 — Cart System

### 6.1 `sections/cart-template.liquid` — Rebuild

```
.rd-cart-page
├── .rd-cart-page__header ("Your Cart" + item count)
├── .rd-cart-page__body
│   ├── .rd-cart-page__items
│   │   └── .rd-cart-item (per product)
│   │       ├── image + title + variant
│   │       ├── .rd-qty-box (+/-/input)
│   │       └── line total
│   └── .rd-cart-page__summary (sticky card)
│       ├── subtotal
│       ├── free shipping progress bar
│       ├── promo code input
│       ├── gift note toggle
│       ├── checkout button (.rd-btn--cta, full width)
│       └── trust badges
└── .rd-cart-page__recommendations (upsell carousel)
```

### 6.2 Cart Drawer (mini-cart in header)

- Slide-out panel from right
- Product list with quantity +/- via AJAX (existing `cart.js`)
- Free shipping progress bar
- Recommendation/upsell at bottom
- "View Cart" link + "Checkout" button
- Smooth open/close animation

---

## Phase 7 — Search + Auth System

### 7.1 Search Overlay (enhance existing `#rd-search-overlay`)

- Fullscreen overlay (existing markup, enhance schema)
- Predictive search results (fetch `/search/suggest.json`)
- Trending products carousel
- Instant results grid with product cards
- Empty state: "Try searching for..." suggestions
- Debounced input (300ms)
- Keyboard: up/down to navigate results, Enter to go, Escape to close

### 7.2 Customer Auth Pages (`templates/customers/`)

**Pages to rebuild with RenoDart styling:**
- `customers/login.liquid`
- `customers/register.liquid`
- `customers/account.liquid`
- `customers/order.liquid`
- `customers/addresses.liquid`
- `customers/activate_account.liquid`
- `customers/reset_password.liquid`

**Design:**
- Glass card container (`.rd-card--glass`)
- Floating labels for inputs
- Modern validation states (success/error borders + messages)
- Gradient CTA buttons
- Responsive: single column on mobile, two-column on desktop for login/register
- Social login buttons (if apps are installed)

---

## Phase 8 — Performance + Cleanup

### 8.1 Remove jQuery Dependencies (Gradual)

1. Identify all jQuery usage in Turbo `app.js.liquid`
2. Replace with vanilla JS equivalents:
   - `$(selector)` → `document.querySelectorAll()`
   - `$.ajax()` → `fetch()`
   - `$.each()` → `Array.forEach()`
   - `.on()` → `.addEventListener()`
   - `.toggleClass()` → `.classList.toggle()`
3. Start with non-critical interactions, end with cart/variant
4. Remove `jquery.min.js`, `jquery.cart.min.js`, `jquery.currencies.min.js` only when all references are gone

### 8.2 Replace InstantClick

- InstantClick causes issues with dynamic content reinitialization
- Replace with standard `<link rel="preload">` + passive resource hints
- Or use `swup` as a lightweight Turbolinks alternative
- Ensure all RenoDart JS re-initializes on page navigation

### 8.3 Split Heavy SCSS Modules

- Current `renodart-phase5.scss.liquid` (933 lines) and `renodart-phase6.scss.liquid` (1488 lines) are large
- Consider splitting by component into `renodart-collection.scss.liquid`, `renodart-cart.scss.liquid`, etc.
- Each file should be <500 lines for maintainability

### 8.4 Image Optimization

- Ensure ALL images use `loading="lazy"` (already handled by JS)
- Add `fetchpriority="high"` to Largest Contentful Paint candidate (hero image)
- Preload hero image via `<link rel="preload" as="image">`
- Use responsive images with `srcset` where Liquid provides image sizes
- WebP format where supported (Shopify auto-serves WebP)

### 8.5 DOM Complexity Reduction

- Audit section Liquid files for unnecessary nesting
- Reduce wrapper divs
- Flatten `.rd-container > .rd-section > .rd-flex > .rd-grid` patterns
- Move from `<div class="rd-flex rd-flex-center">` to direct CSS on parent

### 8.6 Performance Targets

| Metric | Target |
|--------|--------|
| LCP | < 2.0s |
| CLS | < 0.05 |
| INP | < 200ms |
| Lighthouse Performance | ≥ 95 |
| SEO | ≥ 95 |
| Accessibility | 100 |
| Total JS (minified) | < 50KB |
| Total CSS (rendered) | < 100KB |

---

## Execution Rules

1. **Never delete** working Shopify templates without replacement
2. **Always refactor** before removing legacy code
3. **Maintain fallback** for Turbo JS until replaced
4. **Every phase** must be independently deployable (no broken intermediate states)
5. **Schema required** — every section must have `{% schema %}` with full customizer controls
6. **No framework** — Vanilla JS + Liquid + CSS only
7. **Token-driven** — No hardcoded colors, shadows, radii, spacing. Use `--rd-*` tokens.
8. **Accessibility** — ARIA labels, keyboard nav, focus-visible, reduced-motion on every component

---

## File Inventory Per Phase

| Phase | Files to Create/Modify |
|-------|----------------------|
| **2.1** | `sections/header.liquid` (rebuild), `snippets/menu.liquid` (update), `snippets/mobile-menu.liquid` (update) |
| **2.2** | `sections/footer.liquid` (rebuild) |
| **3.1** | `sections/slideshow.liquid` (enhance) |
| **3.2** | `sections/bento-grid.liquid` (new) |
| **3.3** | `sections/featured-collection.liquid` (enhance), `snippets/product-loop.liquid` (update) |
| **3.4** | `sections/image-text.liquid` (enhance) |
| **4.1** | `sections/product-template.liquid` (rebuild), `snippets/product-images.liquid`, `snippets/product-info.liquid`, `snippets/product-form.liquid` |
| **4.2** | `renodart-interactions.js` (sticky ATC exists, verify) |
| **4.3** | `snippets/related-products.liquid` (enhance), new trust-badges snippet |
| **5.1** | `sections/collection-template.liquid` (rebuild) |
| **5.3** | `renodart-interactions.js` (mobile filter drawer) |
| **6.1** | `sections/cart-template.liquid` (rebuild) |
| **6.2** | `snippets/cart-drawer.liquid` (new or refactor from header) |
| **7.1** | `snippets/search-overlay.liquid` (refactor), `renodart-interactions.js` (predictive search) |
| **7.2** | `templates/customers/*.liquid` (rebuild all 7 templates) |
| **8.1-6** | `assets/app.js.liquid`, `assets/renodart-*.scss.liquid`, `layout/theme.liquid` |

---

## Quick-Start Commands

```bash
# After checking out a clean branch:
# Phase 2:
code sections/header.liquid
code sections/footer.liquid

# Phase 3:
code sections/slideshow.liquid
# Create: sections/bento-grid.liquid

# Phase 4:
code sections/product-template.liquid

# Phase 5:
code sections/collection-template.liquid

# Phase 6:
code sections/cart-template.liquid

# Phase 7:
# Create/modify: templates/customers/*.liquid

# Phase 8:
# Audit + optimize across all assets
```

---

## Verification Checklist (per phase)

- [ ] All new CSS uses `--rd-*` tokens, no hardcoded values
- [ ] Section has `{% schema %}` with settings for layout, design, typography, motion, visibility
- [ ] Mobile responsive: test at 375px, 768px, 1024px, 1440px
- [ ] Keyboard navigable: Tab, Enter, Escape, Arrow keys
- [ ] ARIA attributes: `aria-expanded`, `aria-controls`, `aria-label`, `role`
- [ ] Reduced motion: `prefers-reduced-motion: reduce` respected
- [ ] No jQuery used for new code (vanilla JS only)
- [ ] No Turbo base files deleted or broken
- [ ] Lighthouse passes: Performance ≥90, Accessibility ≥95, SEO ≥95
