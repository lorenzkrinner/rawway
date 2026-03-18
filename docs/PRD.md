# Keon — Product Requirements Document

> Mechanical keyboards built for entrepreneurs.

## 1. Overview

Keon is a direct-to-consumer e-commerce store selling premium mechanical keyboards ($90–$200) to entrepreneurs. The storefront is a headless Next.js application powered by Shopify's Storefront GraphQL API. Design language is clean, minimalistic, and Apple-inspired.

**Domain**: `usekeon.myshopify.com` (Shopify-hosted for v1)
**Launch date**: 2026-03-20

---

## 2. Target Audience

Entrepreneurs and professionals who value quality tools for their daily work. They appreciate clean design, premium build quality, and products that reflect their identity. They are willing to pay $90–$200 for a keyboard that feels and looks exceptional.

---

## 3. v1 Scope (Launch — 2026-03-20)

### 3.1 Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero, featured products, brand story |
| Product listing | `/search`, `/search/[collection]` | Browse/filter all keyboards |
| Product detail | `/product/[handle]` | Images, variants, specs, add-to-cart |
| Cart | Slide-over modal | Cart contents, quantity controls, checkout CTA |
| Checkout | Shopify hosted | Redirects to `checkout.shopify.com` |
| CMS pages | `/[page]` | About, FAQ, shipping policy, etc. (managed in Shopify) |
| Search | `/search?q=` | Full-text product search |

### 3.2 Core Features

- **Product browsing**: Grid/list views with product cards, variant previews
- **Product detail page**: Image gallery, variant selector (switches, colorways), pricing, add-to-cart
- **Cart**: Slide-over cart with optimistic UI updates, quantity adjustment, line item removal
- **Checkout**: Redirect to Shopify's hosted checkout (supports multi-currency)
- **Customer accounts**: Shopify-hosted account pages (login, registration, order history, addresses)
- **Navigation**: Header with logo, nav links, search, cart icon, account link. Footer with links and legal pages
- **Search**: Full-text product search with instant results
- **Responsive design**: Mobile-first, fully responsive across all breakpoints
- **SEO**: Meta tags, Open Graph, structured data for products

### 3.3 Internationalization (v1)

- **Languages**: English (default), German
- **Currency**: Multi-currency via Shopify Markets (EUR, USD at minimum)
- Implementation: Shopify's built-in market/locale support via Storefront API

### 3.4 Design System

- **Typography**: Climate Crisis (display/headings), DM Sans (body)
- **Color palette**: oklch-based CSS custom properties (see `globals.css`), light & dark mode
- **Style direction**: Minimalistic, generous whitespace, Apple-inspired product photography focus
- **Component library**: shadcn/ui + Headless UI + Heroicons

### 3.5 Integrations

| Service | Purpose | Scope |
|---------|---------|-------|
| Shopify Storefront API | Products, collections, cart, checkout | Frontend |
| Shopify Customer Accounts | Login, registration, order history | Shopify-hosted |
| Klaviyo | Email marketing | Managed in Shopify backend |

### 3.6 Technical Stack

- **Framework**: Next.js 15 (App Router, PPR, Turbopack)
- **Language**: TypeScript (strict, `noUncheckedIndexedAccess`)
- **Styling**: Tailwind CSS v4
- **Hosting**: Vercel
- **Commerce backend**: Shopify
- **Caching**: `"use cache"` directive + Shopify webhook revalidation

---

## 4. v1.1 — Post-Launch Enhancements

These features are scoped but **not included in the initial launch**.

### 4.1 Original Series Collection

A dedicated collection page showcasing the first 1–3 keyboards in Keon's lineup. Serves as the brand's flagship product line with:
- Curated collection page with editorial layout
- Story/narrative section for the series
- Individual product highlights

### 4.2 Custom Domain

Migrate from `usekeon.myshopify.com` to a branded custom domain.

---

## 5. v2 — Future Roadmap

### 5.1 Custom Keyboard Builder

Interactive configurator allowing customers to build their own keyboard by selecting:
- Base/case
- Switches
- Keycaps
- Cable/accessories

Implementation: likely a multi-step wizard component with live preview and dynamic pricing.

### 5.2 Custom Account Frontend

Replace Shopify-hosted account pages with a fully branded account experience:
- Custom login/registration UI matching Keon's design
- Order history and tracking
- Saved addresses
- Wishlist / saved builds

Uses Shopify's Customer Account API with custom token management.

### 5.3 Additional Collections & Categories

Expand product lines beyond keyboards (switches, keycaps, cables, desk mats, accessories).

---

## 6. Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| Lighthouse Performance | > 90 |
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3s |
| Core Web Vitals | All green |
| Accessibility | WCAG 2.1 AA |
| Browser support | Last 2 versions of Chrome, Firefox, Safari, Edge |
| Mobile support | iOS Safari 16+, Chrome Android |

---

## 7. Success Metrics

- **Conversion rate**: Baseline to establish in first 30 days
- **Cart abandonment rate**: Track and optimize
- **Page load performance**: Core Web Vitals passing
- **Revenue**: Track through Shopify Analytics

---

## 8. Open Questions

- [ ] Final product photography — ready for launch?
- [ ] Shipping policy and rates configured in Shopify?
- [ ] Payment providers set up (Stripe, PayPal, etc.)?
- [ ] Klaviyo email flows configured (welcome, abandoned cart, post-purchase)?
- [ ] Legal pages (Impressum, Datenschutz for German market) created in Shopify CMS?
