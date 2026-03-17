# Repository Structure

This repo is a clone of [vercel/commerce](https://github.com/vercel/commerce), a Next.js App Router e-commerce template designed for headless Shopify.

## Directory Overview

```
rawway/
├── app/                         # Next.js App Router (pages & API routes)
│   ├── layout.tsx               # Root layout — CartProvider, Navbar, global styles
│   ├── page.tsx                 # Home page — 3-item product grid + carousel
│   ├── product/[handle]/        # Product detail page — gallery, variants, add-to-cart
│   ├── search/                  # Product listing & filtering
│   │   ├── page.tsx             # All products (supports ?q= search & ?sort= sorting)
│   │   ├── [collection]/        # Filtered by Shopify collection
│   │   └── layout.tsx           # Sidebar with collection filters + sort dropdown
│   ├── [page]/                  # Dynamic CMS pages from Shopify (about, FAQ, etc.)
│   └── api/revalidate/          # Webhook endpoint — Shopify pushes product/collection updates
├── components/
│   ├── cart/                    # Cart system
│   │   ├── cart-context.tsx     # React context + useOptimistic for cart state
│   │   ├── actions.ts           # Server Actions — addItem, removeItem, updateItemQuantity, redirectToCheckout
│   │   ├── modal.tsx            # Slide-out cart drawer
│   │   ├── add-to-cart.tsx      # Add to cart button (disables when no variant selected)
│   │   ├── delete-item-button.tsx
│   │   └── edit-item-quantity-button.tsx
│   ├── product/
│   │   ├── gallery.tsx          # Image carousel with prev/next navigation
│   │   ├── product-description.tsx  # Title, price, variant selector, add-to-cart
│   │   └── variant-selector.tsx # Option buttons (size, flavor, etc.) — updates URL params
│   ├── layout/
│   │   ├── navbar/              # Header — logo, navigation menu (from Shopify), search, cart icon
│   │   ├── footer.tsx           # Footer links + branding
│   │   └── search/filter/       # Collection filter sidebar + sort dropdown
│   ├── grid/                    # Product grid components
│   │   ├── three-items.tsx      # Homepage 3-item featured grid
│   │   └── tile.tsx             # Individual product tile (image + label overlay)
│   ├── carousel.tsx             # Horizontal product scroller
│   ├── price.tsx                # Currency formatter (Intl.NumberFormat)
│   └── prose.tsx                # Renders Shopify rich text HTML safely
├── lib/
│   ├── shopify/                 # Shopify Storefront API integration
│   │   ├── index.ts             # All API functions + data reshaping
│   │   ├── types.ts             # TypeScript types for Shopify & app data
│   │   ├── queries/             # GraphQL read queries (product, collection, cart, menu, page)
│   │   ├── mutations/           # GraphQL write mutations (cart operations)
│   │   └── fragments/           # Reusable GraphQL field fragments
│   ├── constants.ts             # Sort options, cache tags, hidden product tag, API endpoint
│   ├── utils.ts                 # Helpers — URL validation, env var checks, base URL
│   └── type-guards.ts           # Runtime type checking for Shopify errors
└── fonts/                       # Geist font files
```

## How Data Flows

1. **Product data**: Shopify admin → Storefront GraphQL API → `lib/shopify/index.ts` (fetch + reshape) → Server Components render pages
2. **Cart**: User action → Server Action (`components/cart/actions.ts`) → Shopify cart mutation → cookie stores cart ID → optimistic UI update via `useOptimistic`
3. **Checkout**: Cart drawer "Proceed to Checkout" → `redirectToCheckout()` → user sent to Shopify's hosted checkout page
4. **Cache invalidation**: Shopify webhook → `/api/revalidate` → verifies secret → `revalidateTag()` clears relevant cache

## Key Concepts

- **No database** — all data lives in Shopify. No user accounts or auth in this repo.
- **Navigation menus** are managed in Shopify admin and fetched via GraphQL (`getMenu`). The navbar and footer pull from Shopify menu handles `next-js-frontend-header-menu` and `next-js-frontend-footer-menu`.
- **Collections map to `/search/[collection]`**, not `/collections/`. This is a deliberate routing choice in the template.
- **Variant selection** works via URL search params — each option combination updates `?size=12-pack&flavor=honey` etc., making selections shareable/bookmarkable.
- **The homepage** is configured through Shopify collections: it renders products from `hidden-homepage-featured-items` (3-item grid) and `hidden-homepage-carousel` (carousel section).
