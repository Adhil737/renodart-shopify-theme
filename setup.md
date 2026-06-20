# RenoDart Shopify Theme

> **Base Theme:** Turbo v2.0.10 by Out of the Sandbox  
> **Custom Layer:** RenoDart Design System (Phases 1-6)  
> **Identity:** Purple/Magenta luxury mobile brand — cinematic aesthetics

---

## Table of Contents

1. [Project Structure](#1-project-structure)
2. [Brand Identity & Color Palette](#2-brand-identity--color-palette)
3. [Typography System](#3-typography-system)
4. [Design Tokens](#4-design-tokens)
5. [Layout & Grid](#5-layout--grid)
6. [Component Library](#6-component-library)
7. [Section Inventory](#7-section-inventory)
8. [Snippet Inventory](#8-snippet-inventory)
9. [Template Inventory](#9-template-inventory)
10. [Theme Settings (Customizer)](#10-theme-settings-customizer)
11. [Animations & Motion](#11-animations--motion)
12. [JavaScript](#12-javascript)
13. [Current Status](#13-current-status)

---

## 1. Project Structure

```
renodart-shopify-theme/
├── assets/
│   ├── app.js / app.js.liquid          # Turbo core JS
│   ├── renodart-tokens.scss.liquid      # Design tokens (CSS custom properties)
│   ├── renodart-base.scss.liquid        # Base styles, typography, buttons, cards, animations
│   ├── renodart-header-footer.scss.liquid # Header, navigation, mini-cart, footer
│   ├── renodart-homepage.scss.liquid     # Hero banner, featured collection, promotions, image-text
│   ├── renodart-product.scss.liquid      # Product page, gallery, price, form, sticky ATC, thumbnails
│   ├── renodart-phase5.scss.liquid       # Collection, cart, featured text, newsletter, logo bar, testimonials
│   ├── renodart-phase6.scss.liquid       # Blog, article, search, contact, gallery, collection list, pagination
│   ├── renodart-interactions.js          # IntersectionObserver scroll reveals, header scroll, sticky ATC
│   ├── styles.scss / styles.scss.liquid  # Legacy Turbo stylesheet
│   ├── gift-card.scss / .liquid
│   ├── jquery.min.js / jquery.cart.min.js / jquery.currencies.min.js
│   ├── instantclick.min.js
│   ├── turbo.eot / .svg / .ttf / .woff   # Turbo icon font
│   ├── favicon.png / blank.gif / loader.gif / loader2x.gif / soldout.png
│   ├── select.png / select_light.png
│   └── password-page-background.jpg
│
├── config/
│   ├── settings_schema.json             # Theme settings schema (1000+ settings)
│   └── settings_data.json               # Current preset values ("Portland" preset)
│
├── layout/
│   └── theme.liquid                     # Main theme layout
│
├── locales/
│   ├── en.default.json                  # English (primary)
│   ├── de.json, es.json, fr.json, pt-BR.json, pt-PT.json, zh-CN.json
│
├── sections/
│   ├── header.liquid                    # Header section
│   ├── footer.liquid                    # Footer section
│   ├── slideshow.liquid                 # Slideshow/hero
│   ├── featured-collection.liquid       # Featured products grid
│   ├── featured-products.liquid         # Alternating product rows
│   ├── featured-promotions.liquid       # Promotion cards grid
│   ├── featured-blog.liquid             # Blog posts grid
│   ├── featured-text.liquid             # Rich text with image
│   ├── image-text.liquid                # Image with text side-by-side
│   ├── image-with-text-overlay.liquid   # Image with text overlay
│   ├── collection-list.liquid           # Collection cards grid
│   ├── collection-template.liquid       # Collection page
│   ├── product-template.liquid          # Product page
│   ├── product-details-template.liquid  # Alternate PDP layout
│   ├── product-description-bottom-template.liquid
│   ├── product-full-width-images-template.liquid
│   ├── blog-template.liquid             # Blog listing
│   ├── article-template.liquid          # Article page
│   ├── cart-template.liquid             # Cart page
│   ├── search-template.liquid           # Search results
│   ├── contact-template.liquid          # Contact form page
│   ├── content-page.liquid              # Standard content page
│   ├── page-banner-template.liquid      # Page with hero banner
│   ├── page-gallery-template.liquid     # Gallery page
│   ├── page-sidebar-template.liquid     # Page with sidebar
│   ├── list-collections-template.liquid # All collections listing
│   ├── collection-sub-collections-template.liquid
│   ├── newsletter.liquid                # Newsletter signup section
│   ├── logo-bar.liquid                  # Logo trust bar
│   ├── testimonial.liquid               # Testimonials slider/grid
│   ├── gallery.liquid                   # Image gallery section
│   ├── video.liquid                     # Video embed section
│   ├── social-feeds.liquid              # Social media feeds
│   ├── blog-sidebar.liquid              # Blog sidebar
│   └── testimonial.liquid               # Testimonials
│
├── snippets/
│   ├── product-loop.liquid              # Product card in collections
│   ├── product-details.liquid           # Product details block
│   ├── product-images.liquid            # Product gallery
│   ├── product-info.liquid              # Product info column
│   ├── product-form.liquid              # Add to cart form
│   ├── product-full.liquid              # Full product display
│   ├── product-thumbnail.liquid         # Thumbnail card
│   ├── product-slider.liquid            # Product image slider
│   ├── product-swatch.liquid            # Color/size swatches
│   ├── product-notify-me.liquid         # Back in stock notification
│   ├── collection-loop.liquid           # Collection listing loop
│   ├── collection-swatch.liquid         # Collection swatches
│   ├── blog-sidebar.liquid              # Blog sidebar
│   ├── currencies.liquid                # Currency display
│   ├── currencies-switcher.liquid       # Currency selector
│   ├── menu.liquid                      # Navigation menu
│   ├── mobile-menu.liquid               # Mobile hamburger menu
│   ├── sub-menu.liquid                  # Dropdown sub-menu
│   ├── sidebar.liquid                   # Page sidebar
│   ├── social-icons.liquid              # Social media icons
│   ├── social-buttons.liquid            # Share buttons
│   ├── social-meta-info.liquid          # Open Graph / meta tags
│   ├── pagination.liquid                # Page navigation
│   ├── newsletter-form.liquid           # Newsletter form
│   ├── popup-newsletter.liquid          # Newsletter popup
│   ├── popup-quick-shop.liquid          # Quick shop modal
│   ├── popup-size-chart.liquid          # Size chart popup
│   ├── quick-shop-button.liquid         # Quick shop trigger
│   ├── related-products.liquid          # Related products
│   ├── cart-shipping-calculator.liquid  # Shipping calculator
│   ├── cart-shipping-scripts.liquid     # Shipping JS
│   ├── page-multi-column.liquid         # Multi-column page layout
│   └── blog-sidebar.liquid
│
└── templates/
    ├── index.liquid                     # Homepage
    ├── product.liquid                   # Product page
    ├── product.description-bottom.liquid
    ├── product.details.liquid
    ├── product.full-width-images.liquid
    ├── collection.liquid                # Collection listing
    ├── collection.sub-collections.liquid
    ├── blog.liquid                      # Blog listing
    ├── article.liquid                   # Article page
    ├── cart.liquid                      # Cart page
    ├── cart.assets.liquid
    ├── cart.settings.liquid
    ├── search.liquid                    # Search results
    ├── page.liquid                      # Default page
    ├── page.banner.liquid               # Page with banner
    ├── page.contact.liquid              # Contact page
    ├── page.gallery.liquid              # Gallery page
    ├── page.multi-column.liquid         # Multi-column page
    ├── page.narrow.liquid               # Narrow page
    ├── page.no-title.liquid             # Page without title
    ├── page.sidebar.liquid              # Page with sidebar
    ├── list-collections.liquid          # All collections
    ├── 404.liquid                       # 404 page
    ├── password.liquid                  # Password page
    ├── gift_card.liquid                 # Gift card
    └── customers/                       # Customer account templates
```

---

## 2. Brand Identity & Color Palette

### Brand Pillars
- **Purple/Magenta** core identity — cinematic, premium, modern luxury
- **Dark cinematic backgrounds** with glass-morphism overlays
- **Gradient-forward** design (primary, header, footer, CTAs)
- **High contrast** light-on-dark text hierarchy

### Primary Purple Spectrum
| Token | Hex | Usage |
|-------|-----|-------|
| `--rd-purple-50` | `#f5f0ff` | Light backgrounds, hover states |
| `--rd-purple-100` | `#ede0ff` | Tag backgrounds, selection color |
| `--rd-purple-200` | `#d5baff` | Light decorative |
| `--rd-purple-300` | `#b88aff` | Text on dark, hover states |
| `--rd-purple-400` | `#9b5cff` | Focus rings, accent links |
| **`--rd-purple-500`** | **`#7c3aed`** | **Core brand purple** — primary buttons, links |
| `--rd-purple-600` | `#6d28d9` | Button hover, promo banners |
| `--rd-purple-700` | `#5b21b6` | Scrollbar thumb |
| `--rd-purple-800` | `#4c1d95` | Hover backgrounds |
| `--rd-purple-900` | `#2e1065` | Deep dark sections |
| `--rd-purple-950` | `#1a0840` | Deep cinematic dark |

### Magenta/Pink Accent Spectrum
| Token | Hex | Usage |
|-------|-----|-------|
| `--rd-magenta-300` | `#f472b6` | Light accent |
| `--rd-magenta-400` | `#ec4899` | Accent hover |
| **`--rd-magenta-500`** | **`#db2777`** | **Core magenta accent** — gradient partner |
| `--rd-magenta-600` | `#be185d` | Dark accent |
| `--rd-magenta-700` | `#9d174d` | Deep accent |

### Gradient Definitions
| Token | Gradient |
|-------|----------|
| `--rd-gradient-primary` | `linear-gradient(135deg, #7c3aed 0%, #db2777 100%)` |
| `--rd-gradient-header` | `linear-gradient(180deg, #1a0840 0%, #2e1065 60%, #4c1d95 100%)` |
| `--rd-gradient-footer` | `linear-gradient(180deg, #0f0520 0%, #1a0840 50%, #2e1065 100%)` |
| `--rd-gradient-card-hover` | `linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(219,39,119,0.15) 100%)` |
| `--rd-gradient-cta` | `linear-gradient(135deg, #7c3aed 0%, #9b5cff 50%, #db2777 100%)` |
| `--rd-gradient-hero-overlay` | `linear-gradient(to bottom, rgba(26,8,64,0.5) 0%, rgba(26,8,64,0.2) 50%, rgba(26,8,64,0.6) 100%)` |

### Semantic Colors
| Token | Hex | Usage |
|-------|-----|-------|
| **Backgrounds** | | |
| `--rd-bg-page` | `#ffffff` | Page background |
| `--rd-bg-surface` | `#f9f7ff` | Card surfaces |
| `--rd-bg-dark` | `#0f0520` | Deep cinematic sections |
| `--rd-bg-dark-mid` | `#1a0840` | Mid-dark sections |
| `--rd-bg-dark-card` | `rgba(30, 12, 72, 0.85)` | Dark cards |
| `--rd-bg-glass` | `rgba(255, 255, 255, 0.08)` | Glass overlay |
| `--rd-bg-overlay` | `rgba(26, 8, 64, 0.72)` | Modal overlays |
| **Text** | | |
| `--rd-text-primary` | `#1a1523` | Primary body text |
| `--rd-text-secondary` | `#4b4063` | Secondary text |
| `--rd-text-muted` | `#7c7490` | Muted/label text |
| `--rd-text-inverse` | `#ffffff` | White text |
| `--rd-text-accent` | `#7c3aed` | Accent text |
| `--rd-text-on-dark` | `rgba(255, 255, 255, 0.92)` | Text on dark bg |
| `--rd-text-on-dark-muted` | `rgba(255, 255, 255, 0.60)` | Muted text on dark |
| **Status** | | |
| `--rd-color-success` | `#10b981` | Success messages |
| `--rd-color-warning` | `#f59e0b` | Warnings |
| `--rd-color-error` | `#ef4444` | Errors |
| `--rd-color-sale` | `#f43f5e` | Sale price/badge |
| `--rd-color-new` | `#7c3aed` | New product badge |

### Borders
| Token | Value |
|-------|-------|
| `--rd-border-light` | `rgba(124, 58, 237, 0.12)` |
| `--rd-border-medium` | `rgba(124, 58, 237, 0.25)` |
| `--rd-border-accent` | `rgba(124, 58, 237, 0.60)` |
| `--rd-border-card` | `rgba(255, 255, 255, 0.10)` |

---

## 3. Typography System

### Font Families
| Token | Font Stack | Usage |
|-------|------------|-------|
| `--rd-font-display` | `'Outfit', 'Inter', system-ui, -apple-system, sans-serif` | Headings, hero text, display |
| `--rd-font-body` | `'Inter', 'DM Sans', system-ui, -apple-system, sans-serif` | Body text, navigation |
| `--rd-font-mono` | `'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace` | Code, keyboard keys |
| `--rd-font-accent` | `'Poppins', 'Outfit', sans-serif` | Accent typography |

**Google Fonts loaded:** Outfit (300-900), Inter (300-700), Poppins (400-700)

### Fluid Type Scale
| Token | `clamp()` | Usage |
|-------|-----------|-------|
| `--rd-text-xs` | `clamp(0.6875rem, 0.65rem + 0.2vw, 0.75rem)` | Labels, badges |
| `--rd-text-sm` | `clamp(0.8125rem, 0.78rem + 0.2vw, 0.875rem)` | Small body |
| `--rd-text-base` | `clamp(0.9375rem, 0.9rem + 0.25vw, 1rem)` | Body |
| `--rd-text-md` | `clamp(1.0625rem, 1.0rem + 0.3vw, 1.125rem)` | Large body |
| `--rd-text-lg` | `clamp(1.125rem, 1.05rem + 0.4vw, 1.25rem)` | Lead text |
| `--rd-text-xl` | `clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem)` | Small heading |
| `--rd-text-2xl` | `clamp(1.5rem, 1.3rem + 0.8vw, 1.875rem)` | H3 |
| `--rd-text-3xl` | `clamp(1.75rem, 1.5rem + 1.2vw, 2.25rem)` | H2 |
| `--rd-text-4xl` | `clamp(2rem, 1.6rem + 1.8vw, 3rem)` | H1 |
| `--rd-text-5xl` | `clamp(2.5rem, 2rem + 2.5vw, 3.75rem)` | Display |
| `--rd-text-6xl` | `clamp(3rem, 2.2rem + 3.5vw, 5rem)` | Large display |
| `--rd-text-hero` | `clamp(3.5rem, 2.5rem + 5vw, 6rem)` | Hero title |

### Typography Classes
| Class | Font | Size | Weight | Usage |
|-------|------|------|--------|-------|
| `.rd-display-hero` | Display | hero | 900 | Hero banners |
| `.rd-display-1` | Display | 6xl | 700 | Page titles |
| `.rd-display-2` | Display | 5xl | 700 | Section titles |
| `.rd-heading-1` | Display | 4xl | 700 | H1 |
| `.rd-heading-2` | Display | 3xl | 600 | H2 |
| `.rd-heading-3` | Display | 2xl | 600 | H3 |
| `.rd-heading-4` | Display | xl | 600 | H4 |
| `.rd-body-lg` | Body | lg | 400 | Lead body |
| `.rd-body` | Body | base | 400 | Body text |
| `.rd-body-sm` | Body | sm | 400 | Small body |
| `.rd-label` | Body | xs | 600 | Uppercase labels |
| `.rd-eyebrow` | Body | xs | 600 | Section eyebrow |
| `.rd-text-gradient` | — | — | — | Gradient text fill |

### Line Heights
| Token | Value | Usage |
|-------|-------|-------|
| `--rd-leading-tight` | `1.15` | Headings |
| `--rd-leading-snug` | `1.3` | Subheadings |
| `--rd-leading-normal` | `1.55` | Body text |
| `--rd-leading-relaxed` | `1.75` | Long-form content |

### Letter Spacing
| Token | Value | Usage |
|-------|-------|-------|
| `--rd-tracking-tight` | `-0.025em` | Headings |
| `--rd-tracking-normal` | `0em` | Body |
| `--rd-tracking-wide` | `0.04em` | Buttons |
| `--rd-tracking-wider` | `0.08em` | Labels, uppercase |
| `--rd-tracking-widest` | `0.15em` | Eyebrows, section headers |

### Font Weights
| Token | Value | Usage |
|-------|-------|-------|
| `--rd-weight-light` | `300` | Thin text |
| `--rd-weight-regular` | `400` | Body |
| `--rd-weight-medium` | `500` | Navigation |
| `--rd-weight-semibold` | `600` | Buttons, subheadings |
| `--rd-weight-bold` | `700` | Headings |
| `--rd-weight-black` | `900` | Hero display |

---

## 4. Design Tokens

### Spacing (4px grid)
| Token | Rem | PX |
|-------|-----|----|
| `--rd-space-1` | 0.25rem | 4px |
| `--rd-space-2` | 0.5rem | 8px |
| `--rd-space-3` | 0.75rem | 12px |
| `--rd-space-4` | 1rem | 16px |
| `--rd-space-5` | 1.25rem | 20px |
| `--rd-space-6` | 1.5rem | 24px |
| `--rd-space-8` | 2rem | 32px |
| `--rd-space-10` | 2.5rem | 40px |
| `--rd-space-12` | 3rem | 48px |
| `--rd-space-16` | 4rem | 64px |
| `--rd-space-20` | 5rem | 80px |
| `--rd-space-24` | 6rem | 96px |
| `--rd-space-32` | 8rem | 128px |

### Section Vertical Rhythm
| Token | `clamp()` |
|-------|-----------|
| `--rd-section-gap-sm` | `clamp(2.5rem, 4vw, 4rem)` |
| `--rd-section-gap-md` | `clamp(4rem, 6vw, 7rem)` |
| `--rd-section-gap-lg` | `clamp(5rem, 8vw, 10rem)` |
| `--rd-section-gap-xl` | `clamp(6rem, 10vw, 14rem)` |

### Container Widths
| Token | Value |
|-------|-------|
| `--rd-container-sm` | 640px |
| `--rd-container-md` | 768px |
| `--rd-container-lg` | 1024px |
| `--rd-container-xl` | 1280px |
| `--rd-container-2xl` | 1440px |
| `--rd-container-max` | 1600px |
| `--rd-container-px` | `clamp(1rem, 4vw, 2.5rem)` |

### Border Radius Tokens
| Token | Value | Usage |
|-------|-------|-------|
| `--rd-radius-sm` | 0.25rem (4px) | Inputs |
| `--rd-radius-md` | 0.5rem (8px) | Buttons, cards |
| `--rd-radius-lg` | 0.75rem (12px) | Panels |
| `--rd-radius-xl` | 1rem (16px) | Modals, cards |
| `--rd-radius-2xl` | 1.5rem (24px) | Promotions |
| `--rd-radius-3xl` | 2rem (32px) | Large elements |
| `--rd-radius-pill` | 9999px | Badges, pills |
| `--rd-radius-card` | 0.75rem (default) | Customizable via settings |
| `--rd-radius-btn` | 0.5rem (default) | Customizable via settings |

### Shadows & Glows
| Token | Value |
|-------|-------|
| `--rd-shadow-xs` | `0 1px 2px rgba(0, 0, 0, 0.06)` |
| `--rd-shadow-sm` | `0 2px 8px rgba(0, 0, 0, 0.08)` |
| `--rd-shadow-md` | `0 4px 16px rgba(0, 0, 0, 0.12)` |
| `--rd-shadow-lg` | `0 8px 32px rgba(0, 0, 0, 0.16)` |
| `--rd-shadow-xl` | `0 16px 48px rgba(0, 0, 0, 0.20)` |
| `--rd-shadow-2xl` | `0 24px 64px rgba(0, 0, 0, 0.28)` |
| `--rd-glow-sm` | `0 0 12px rgba(124, 58, 237, 0.35)` |
| `--rd-glow-md` | `0 0 24px rgba(124, 58, 237, 0.45), 0 4px 16px rgba(124, 58, 237, 0.25)` |
| `--rd-glow-lg` | `0 0 40px rgba(124, 58, 237, 0.55), 0 8px 32px rgba(124, 58, 237, 0.30)` |
| `--rd-shadow-card` | `0 2px 12px rgba(0,0,0,0.07), 0 0 1px rgba(124,58,237,0.10)` |
| `--rd-shadow-card-hover` | `0 8px 32px rgba(0,0,0,0.14), 0 0 24px rgba(124,58,237,0.20)` |
| `--rd-shadow-header` | `0 4px 24px rgba(0, 0, 0, 0.25), 0 1px 0 rgba(124, 58, 237, 0.20)` |

### Z-Index System
| Token | Value |
|-------|-------|
| `--rd-z-below` | -1 |
| `--rd-z-base` | 0 |
| `--rd-z-raised` | 10 |
| `--rd-z-dropdown` | 100 |
| `--rd-z-sticky` | 200 |
| `--rd-z-overlay` | 300 |
| `--rd-z-modal` | 400 |
| `--rd-z-toast` | 500 |
| `--rd-z-header` | 1000 |
| `--rd-z-top` | 9999 |

### Duration & Easing
| Token | Value |
|-------|-------|
| `--rd-duration-instant` | 60ms |
| `--rd-duration-fast` | 150ms |
| `--rd-duration-base` | 250ms |
| `--rd-duration-slow` | 400ms |
| `--rd-duration-slower` | 600ms |
| `--rd-duration-slowest` | 900ms |
| `--rd-ease-default` | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` |
| `--rd-ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `--rd-ease-cinematic` | `cubic-bezier(0.22, 1, 0.36, 1)` — Signature motion |
| `--rd-ease-bounce` | `cubic-bezier(0.34, 1.56, 0.64, 1)` |

### Glass / Blur Effects
| Token | Value |
|-------|-------|
| `--rd-blur-glass` | `blur(16px) saturate(1.4)` |
| `--rd-blur-glass-sm` | `blur(8px) saturate(1.3)` |
| `--rd-blur-glass-lg` | `blur(24px) saturate(1.5)` |

### Header Tokens
| Token | Value |
|-------|-------|
| `--rd-header-height` | 70px |
| `--rd-header-height-scrolled` | 56px |
| `--rd-header-bg-glass` | `rgba(15, 5, 32, 0.85)` |
| `--rd-header-border` | `rgba(124, 58, 237, 0.18)` |

### Grid & Product Layout
| Token | Value |
|-------|-------|
| `--rd-grid-cols` | 12 |
| `--rd-grid-gutter` | `clamp(1rem, 2vw, 1.5rem)` |
| `--rd-product-cols-xl` | 4 (≥1280px) |
| `--rd-product-cols-lg` | 3 (960-1280px) |
| `--rd-product-cols-md` | 2 (480-960px) |
| `--rd-product-cols-xs` | 1 (<480px) |
| `--rd-product-card-img-ratio` | `1 / 1.1` |

---

## 5. Layout & Grid

### Container System
- `.rd-container` — max 1280px with responsive padding `clamp(1rem, 4vw, 2.5rem)`
- Modifiers: `.rd-container--sm|md|lg|xl|2xl|full`

### Section Variants
| Class | Background |
|-------|-----------|
| `.rd-section` | Default (inherit) |
| `.rd-section--dark` | `--rd-bg-dark` (#0f0520) |
| `.rd-section--dark-mid` | `--rd-bg-dark-mid` (#1a0840) |
| `.rd-section--gradient` | `--rd-gradient-header` |
| `.rd-section--light` | #ffffff |
| `.rd-section--surface` | `--rd-bg-surface` (#f9f7ff) |

### Breakpoints
| Breakpoint | Width | Usage |
|------------|-------|-------|
| Desktop | ≥1280px | 4-column product grid |
| Tablet landscape | 960-1280px | 3-column product grid |
| Tablet portrait | 768-960px | 2-column product grid |
| Mobile | 480-768px | 2-column product grid |
| Small mobile | <480px | 1-column product grid |
| Desktop/mobile toggle | 769px | Header show/hide |

---

## 6. Component Library

### Button System (`.rd-btn`)
- **Primary** — Purple-500 background, glow shadow, hover lifts 1px
- **Secondary/Outline** — Transparent with purple border, fills on hover
- **CTA/Gradient** — Purple→Magenta gradient, stronger glow, shimmer effect
- **Ghost** — Glass background for dark sections, blur backdrop
- **Sizes:** `sm` (38px), `md` (48px), `lg` (56px), `xl` (64px), `full`
- Shimmer animation on CTA hover: sweeping light effect

### Card System (`.rd-card`)
- White card with subtle purple-tinted shadow/border
- **Dark variant** — Dark glass card for dark sections
- **Glass variant** — rgba(255,255,255,0.08) with `backdrop-filter: blur`
- **Elevated variant** — Extra shadow + glow
- All cards hover with `translateY(-3px)` and enhanced shadow

### Badge System (`.rd-badge`)
- Pill-shaped uppercase labels
- Variants: `primary` (gradient), `sale` (pink), `new` (purple), `outline`

### Glass Morphism (`.rd-glass`)
- Semi-transparent backgrounds with blur filter
- Used on: header, mini-cart, search overlay, dark cards, ghost buttons

### Overlay System (`.rd-overlay`)
- Gradient overlays for hero/banner images
- Positions: center, bottom-left, bottom-center

### Skeleton Loading (`.rd-skeleton`)
- Shimmer animation for loading states
- Purple-tinted gradient sweep

### Scroll Reveal (`.rd-reveal`)
- IntersectionObserver-based entrance animations
- Directions: up (default), left, right, scale
- Stagger delays for children (0-560ms, 80ms increments)

### Utility Classes
- `.rd-flex`, `.rd-flex-center`, `.rd-flex-between`, `.rd-flex-col`
- `.rd-gap-2|4|6|8`
- `.rd-sr-only` — Screen reader only
- `.rd-truncate` — Text overflow ellipsis
- `.rd-aspect-*` — Square, video (16:9), portrait (3:4), product (1:1.1)
- `.rd-object-cover` — Image fill
- `.rd-hide-mobile` / `.rd-hide-desktop` / `.rd-hide-tablet`

---

## 7. Section Inventory

| Section File | Type | Description |
|-------------|------|-------------|
| `header.liquid` | Global | Glass header with topbar, logo, nav, cart, search |
| `footer.liquid` | Global | Gradient footer with newsletter, links, social, payments |
| `slideshow.liquid` | Homepage | Full-width slideshow with Flickity, cinematic overlays |
| `featured-collection.liquid` | Homepage | Product grid with section header |
| `featured-products.liquid` | Homepage | Alternating two-column product rows |
| `featured-promotions.liquid` | Homepage | Promotion cards grid (2-4 per row) |
| `featured-blog.liquid` | Homepage | Blog article cards grid |
| `featured-text.liquid` | Homepage | Rich text with optional image |
| `image-text.liquid` | Homepage | Side-by-side image + text rows |
| `image-with-text-overlay.liquid` | Homepage | Image with overlaid text/CTA |
| `collection-list.liquid` | Homepage | Collection cards grid |
| `newsletter.liquid` | Homepage | Newsletter signup section |
| `logo-bar.liquid` | Homepage | Logo trust bar (static or marquee) |
| `testimonial.liquid` | Homepage | Testimonials (slider or grid) |
| `gallery.liquid` | Homepage | Image gallery grid (2-5 columns) |
| `video.liquid` | Homepage | Video embed section |
| `social-feeds.liquid` | Homepage | Social media feeds |
| `collection-template.liquid` | Template | Collection with filters, sort, grid |
| `product-template.liquid` | Template | PDP with gallery, info, form, tabs, related |
| `blog-template.liquid` | Template | Blog listing with sidebar |
| `article-template.liquid` | Template | Full article with comments, related |
| `cart-template.liquid` | Template | Cart with items, summary, trust badges |
| `search-template.liquid` | Template | Search with form, results grid/list |
| `contact-template.liquid` | Template | Contact form + info sidebar |
| `content-page.liquid` | Template | Rich text content page |
| `page-banner-template.liquid` | Template | Page with hero banner |
| `page-gallery-template.liquid` | Template | Gallery page layout |
| `page-sidebar-template.liquid` | Template | Page with sidebar |
| `list-collections-template.liquid` | Template | All collections listing |
| `collection-sub-collections-template.liquid` | Template | Sub-collection navigation |

---

## 8. Snippet Inventory

| Snippet | Purpose |
|---------|---------|
| `product-loop.liquid` | Product card in collection grid |
| `product-details.liquid` | Product title, price, description |
| `product-images.liquid` | Product image gallery (zoom, thumbnails) |
| `product-info.liquid` | Product info column block |
| `product-form.liquid` | Add to cart form with options |
| `product-full.liquid` | Full product display |
| `product-thumbnail.liquid` | Thumbnail card in grids |
| `product-slider.liquid` | Image slider for product gallery |
| `product-swatch.liquid` | Color/size/swatch options |
| `product-notify-me.liquid` | Back in stock notification form |
| `collection-loop.liquid` | Collection listing loop |
| `collection-swatch.liquid` | Collection color swatches |
| `menu.liquid` | Navigation menu with dropdowns |
| `mobile-menu.liquid` | Mobile hamburger navigation |
| `sub-menu.liquid` | Dropdown sub-menu items |
| `currencies.liquid` | Currency display |
| `currencies-switcher.liquid` | Currency selector dropdown |
| `sidebar.liquid` | Page sidebar |
| `blog-sidebar.liquid` | Blog sidebar with widgets |
| `social-icons.liquid` | Social media icon links |
| `social-buttons.liquid` | Share buttons |
| `social-meta-info.liquid` | Open Graph meta tags |
| `pagination.liquid` | Page navigation |
| `newsletter-form.liquid` | Newsletter signup form |
| `popup-newsletter.liquid` | Newsletter popup modal |
| `popup-quick-shop.liquid` | Quick shop modal |
| `popup-size-chart.liquid` | Size chart popup |
| `quick-shop-button.liquid` | Quick shop trigger button |
| `related-products.liquid` | Related product recommendations |
| `cart-shipping-calculator.liquid` | Shipping cost calculator |
| `cart-shipping-scripts.liquid` | Shipping calculation JS |
| `page-multi-column.liquid` | Multi-column content layout |

---

## 9. Template Inventory

| Template File | Description |
|--------------|-------------|
| `index.liquid` | Homepage (sections-based) |
| `product.liquid` | Default product page |
| `product.description-bottom.liquid` | PDP with description below gallery |
| `product.details.liquid` | Detailed PDP layout |
| `product.full-width-images.liquid` | Full-width image PDP |
| `collection.liquid` | Default collection listing |
| `collection.sub-collections.liquid` | Sub-collection navigation |
| `blog.liquid` | Blog listing |
| `article.liquid` | Single article |
| `cart.liquid` | Shopping cart |
| `search.liquid` | Search results |
| `page.liquid` | Default page |
| `page.banner.liquid` | Page with hero banner |
| `page.contact.liquid` | Contact page |
| `page.gallery.liquid` | Gallery page |
| `page.multi-column.liquid` | Multi-column page |
| `page.narrow.liquid` | Narrow content page |
| `page.no-title.liquid` | Page without title |
| `page.sidebar.liquid` | Page with sidebar |
| `list-collections.liquid` | All collections |
| `404.liquid` | 404 error page |
| `password.liquid` | Password/lock screen |
| `gift_card.liquid` | Gift card page |
| `customers/` | Account registration, login, orders, addresses |

---

## 10. Theme Settings (Customizer)

### Performance
- **Transitions:** Sport / Ludicrous (default)
- **Image loading:** Appear / Blur (default) / Fade / None
- **Custom Scripts:** HTML block

### Colors (Legacy Turbo)
- 50+ color settings for: text, links, buttons, backgrounds, headers, footer, banners, sale, swatches, testimonials, borders, newsletters, password page
- Current preset: **"Portland"** — teal/green accent (#03a196)

### Typography (Legacy Turbo)
- Logo font, weight, capitalization, size
- Headings font, weight, style, size, letter spacing, divider
- Top menu font size, letter spacing
- Main menu font, weight, capitalization
- **Font library:** 100+ font options including Google Fonts (sans-serif, serif, handwriting, monospace)

### RenoDart Custom Settings (in `renodart-tokens.scss.liquid`)
| Setting ID | Type | Effect |
|------------|------|--------|
| `rd_gradient_start` | Color | Override gradient start color |
| `rd_gradient_end` | Color | Override gradient end color |
| `rd_accent_color` | Color | Override primary purple (#7c3aed) |
| `rd_accent_secondary` | Color | Override magenta accent (#db2777) |
| `rd_bg_dark` | Color | Override dark background (#0f0520) |
| `rd_card_radius` | Number | Card border radius (px) |
| `rd_btn_radius` | Number | Button border radius (px) |
| `rd_glow_intensity` | Select | high / low / none — glow effect strength |
| `rd_blur_intensity` | Select | low / high — glass blur strength |
| `rd_header_height` | Number | Header height (px) |
| `rd_product_columns` | Number | Product columns on desktop |

---

## 11. Animations & Motion

### CSS Keyframe Animations
| Name | Description |
|------|-------------|
| `rd-fade-in` | `opacity 0→1` |
| `rd-fade-up` | `opacity 0→1` + `translateY(24px→0)` |
| `rd-fade-down` | `opacity 0→1` + `translateY(-24px→0)` |
| `rd-scale-in` | `opacity 0→1` + `scale(0.94→1)` |
| `rd-slide-in-right` | `opacity 0→1` + `translateX(32px→0)` |
| `rd-slide-in-left` | `opacity 0→1` + `translateX(-32px→0)` |
| `rd-glow-pulse` | `box-shadow` oscillates between `--rd-glow-sm` and `--rd-glow-lg` |
| `rd-shimmer` | Background position sweep for skeleton/CTA shimmer |
| `rd-float` | `translateY(0→-8px→0)` gentle hover |
| `rd-spin` | 360° rotation |
| `rd-scroll-line` | Hero scroll indicator animation |
| `rd-marquee` | Logo bar infinite scroll |
| `rd-cart-pulse` | Cart badge scale bounce when item added |

### Scroll-Based Reveals (`renodart-interactions.js`)
- IntersectionObserver detects elements entering viewport
- Classes: `.rd-reveal`, `.rd-reveal--left`, `.rd-reveal--right`, `.rd-reveal--scale`
- Stagger delays for grid children
- Header scroll behavior: transparent→glass on scroll
- Sticky ATC: appears on scroll past product form

### Accessibility
- `prefers-reduced-motion` support — all durations set to 0ms, transitions disabled
- `forced-colors: active` support — borders use `ButtonBorder`, shadows disabled
- `:focus-visible` outlines with purple ring
- `:focus:not(:focus-visible)` removes outline for mouse users
- Custom scrollbar styling (webkit only)

---

## 12. JavaScript

### Files
| File | Description |
|------|-------------|
| `renodart-interactions.js` | Custom RenoDart JS — scroll reveals, header scroll, sticky ATC |
| `app.js` / `app.js.liquid` | Turbo core theme JS (full ecommerce functionality) |
| `jquery.min.js` | jQuery 1.x (Turbo dependency) |
| `jquery.cart.min.js` | jQuery AJAX cart API |
| `jquery.currencies.min.js` | Currency conversion |
| `instantclick.min.js` | InstantClick page transitions (Ludicrous mode) |

### `renodart-interactions.js` Features
- **IntersectionObserver** for scroll reveal animations
- **Header scroll state** — adds `.rd-header--scrolled` class on scroll > 50px
- **Sticky Add to Cart** — `.rd-sticky-atc` appears when PDP form scrolls past viewport
- **Cart badge pulse** — `.rd-cart-badge--pulse` on quantity change
- **Footer accordion** — mobile accordion for footer columns

---

## 13. Current Status

### Completed Phases

| Phase | File | Status | What's Covered |
|-------|------|--------|----------------|
| **Phase 1** | `renodart-tokens.scss.liquid` | ✅ Complete | All design tokens (colors, typography, spacing, shadows, animations, z-index, grid) |
| **Phase 1** | `renodart-base.scss.liquid` | ✅ Complete | Reset, typography system, layout, buttons, cards, badges, glass, overlays, animations, scroll reveals, utilities, accessibility |
| **Phase 2** | `renodart-header-footer.scss.liquid` | ✅ Complete | Announcement banner, desktop glass header, topbar, nav, logo, cart button, mini-cart dropdown, fullscreen search overlay, mobile header/drawer, footer (newsletter, grid, links, social, bottom bar, payments), responsive |
| **Phase 3** | `renodart-homepage.scss.liquid` | ✅ Complete | Section header, hero banner (all heights, overlays, positions), featured collection grid, promotion cards (rounded/circle/square variants, overlay animations), image-text rows (reversible, feature list), responsive |
| **Phase 4** | `renodart-product.scss.liquid` | ✅ Complete | Breadcrumbs, PDP layout (55/45 split, image-right option), vendor, title, price block, swatches, quantity box, ATC button (gradient), buy now, size chart, trust badges, collapsible tabs, description, sticky mobile ATC, product thumbnail card, related products, responsive |
| **Phase 5** | `renodart-phase5.scss.liquid` | ✅ Complete | Collection hero, toolbar, filters/sort, grid, empty state, pagination; Cart page (items grid, summary card, trust, empty state, responsive); Featured text; Newsletter section (name/email fields, success/error, privacy); Logo bar (static + marquee); Testimonials (grid cards + slideshow stars); Featured products (alternating rows); Featured blog (cards, tags, meta, dark variant); Slideshow (Flickity skin, overlays) |
| **Phase 6** | `renodart-phase6.scss.liquid` | ✅ Complete | Page hero banner; Blog listing (grid, featured card, tag filter, sidebar layout, responsive); Article page (header, meta, tags, featured image, body, author, share, comments, comment form, notices, related posts, sidebar); Search results (form, product grid, mixed results, empty state); Contact page (form card, field row, info sidebar, map, success/error); Content page; Gallery section (grid 2-5 cols, lightbox overlay); Collection list (grid, gradient overlay cards, below-image variant); Pagination; Blog+search sidebar layouts; Reading progress bar |

### Key Notes
- All RenoDart styles are **namespaced with `.rd-` prefix** to avoid conflicts with Turbo's existing CSS
- The theme has **full Liquid/Sass integration** — `.scss.liquid` files allow Shopify settings to inject values
- **Customizer overrides** are built in for gradients, accent colors, radii, glow intensity, blur, header height, product columns
- **Glass-morphism** is used extensively: header, mini-cart, search overlay, dark cards, ghost buttons
- **Cinematic theme** with deep purple backgrounds, purple glow effects, and smooth cinematic easing curves
- The "Portland" preset currently uses teal/green accent colors — **RenoDart custom settings are separate from Turbo legacy settings**
- Interactive elements (scroll reveals, header glass transition, sticky ATC, cart pulse) are driven by `renodart-interactions.js`

### Files Yet to Create/Integrate (Potential Future Work)
- Custom section Liquid files with RenoDart markup (currently styling the existing Turbo sections)
- `settings_schema.json` entries for RenoDart-specific Customizer controls (gradient colors, glow, blur etc.) — these are currently referenced in tokens but may not have UI entries yet
- Dedicated RenoDart variant of each template Liquid file
