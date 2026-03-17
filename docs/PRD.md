# Product Requirements Document — Rawway

## Overview

Rawway is a direct-to-consumer protein bar brand with a custom headless e-commerce storefront. The store sells protein bars in three flavors with a brand identity centered on minimal ingredients (5 or fewer), natural/earthy aesthetics, and sustainable paper packaging.

## Brand Identity

- **Name**: Rawway
- **Philosophy**: Least ingredients possible (max 5 per bar), down-to-earth, natural
- **USP**: Paper packaging, ultra-clean ingredient lists, high protein
- **Visual Direction**: Earthy, natural tones. Minimal and grounded — not flashy fitness branding.

## Product Catalog

### Protein Bars

| Product | Key Ingredients | Variants |
|---------|----------------|----------|
| Honey Almond Bar | Honey, almonds, ... | Box of 6 / 12 / 24 |
| Cacao Cinnamon Honey Bar | Cacao, cinnamon, honey, ... | Box of 6 / 12 / 24 |
| Strawberry Honey Bar | Strawberry, honey, ... | Box of 6 / 12 / 24 |

### Bundles
- Variety Sampler Pack (12-pack: 4 of each flavor)

### Merch
- TBD (tote bag, hemp snack pouch, or similar on-brand item)

## Tech Stack

| Layer | Tool | Cost |
|-------|------|------|
| Frontend framework | Next.js (App Router) | Free |
| Hosting | Vercel (Hobby tier) | Free |
| Commerce backend | Shopify (Partners dev store) | Free |
| Styling | Tailwind CSS + shadcn/ui (structural components) | Free |
| Email marketing | Klaviyo (free tier: 250 contacts / 500 emails) | Free |
| Source control | GitHub | Free |

**Total cost: $0** — all tools are on free tiers or developer plans.

## Architecture

```
┌─────────────────────────┐
│   Next.js on Vercel      │
│   (Custom Storefront)    │
│                          │
│  - Product pages         │
│  - Cart UI               │
│  - Brand pages           │
│  - Search & filtering    │
└──────────┬───────────────┘
           │ Storefront GraphQL API
           ▼
┌─────────────────────────┐
│   Shopify Dev Store      │
│   (Commerce Backend)     │
│                          │
│  - Products & variants   │
│  - Inventory             │
│  - Cart & checkout       │
│  - Orders & payments     │
│  - Navigation menus      │
└──────────┬───────────────┘
           │ Native integration
           ▼
┌─────────────────────────┐
│   Klaviyo                │
│   (Email Marketing)      │
│                          │
│  - Welcome series        │
│  - Abandoned cart        │
│  - Order confirmation    │
│  - Reorder reminders     │
└─────────────────────────┘
```

## What We Build vs What Shopify Handles

### We Build (Next.js)
- Custom storefront design with earthy/natural branding
- Home page with hero, featured bars, brand story
- Product listing page with collection filtering
- Product detail pages with nutrition info, ingredient highlights, box size selector
- Cart drawer UI
- About page (brand story, sustainability, ingredient philosophy)
- Responsive design across all pages

### Shopify Handles
- Product data, variants, inventory management
- Cart logic and persistence
- Checkout flow (hosted by Shopify — PCI compliant)
- Payment processing
- Order management and fulfillment
- Tax and shipping calculation

### Klaviyo Handles
- Email flow automation (connects directly to Shopify, minimal custom code)

## Pages

| Page | Description |
|------|-------------|
| `/` | Home — hero section, featured bars, brand story snippet, CTA |
| `/search` | All products with sorting |
| `/search/[collection]` | Filtered by collection (bars, bundles, merch) |
| `/product/[handle]` | Product detail — images, description, nutrition facts, ingredients list, box size selector, add-to-cart |
| `/about` | Brand story — philosophy, ingredients sourcing, paper packaging |
| Cart drawer | Slide-out cart with line items, totals, checkout button |

## Build Phases

### Phase 1 — Foundation
- Customize the Vercel Commerce template for Rawway branding
- Connect to Shopify dev store (environment variables)
- Set up Shopify products, collections, and navigation menus
- Replace default styling with earthy/natural theme (colors, typography, imagery)

### Phase 2 — Core Storefront
- Custom home page (hero, featured products, brand messaging)
- Product detail page enhancements (nutrition facts section, ingredient count badge, paper packaging callout)
- Collection pages for Bars, Bundles, Merch
- About page

### Phase 3 — Cart & Checkout
- Customize cart drawer styling
- Ensure smooth add-to-cart → cart → Shopify checkout flow
- Test full purchase flow with Shopify test payments

### Phase 4 — Email & Polish
- Connect Klaviyo to Shopify dev store
- Set up welcome and abandoned cart email flows
- Responsive design pass
- Performance optimization
- SEO metadata for all pages

## Design Direction

- **Colors**: Earth tones — warm browns, forest greens, cream/off-white, honey gold
- **Typography**: Clean sans-serif for body, potentially a natural/organic-feeling display font for headings
- **Imagery**: Close-up product shots, natural textures (wood, paper, grain), ingredient photography
- **Components**: shadcn/ui for structural pieces (sheet for cart drawer, accordion for FAQ/nutrition, dialog, tabs). Custom Tailwind for storefront-specific UI (product cards, hero, grid layouts).
- **Overall feel**: Premium but approachable. Think farmer's market meets modern DTC brand.
