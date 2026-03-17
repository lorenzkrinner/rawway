# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Rawway is a headless e-commerce storefront for a protein bar brand, built on the Vercel Commerce template. Next.js frontend connects to Shopify via the Storefront GraphQL API. Shopify owns all commerce data (products, cart, checkout, orders) — this repo is purely the frontend.

## Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Dev server with Turbopack (localhost:3000)
pnpm build            # Production build
pnpm test             # Runs prettier:check (formatting only, no unit tests)
pnpm prettier         # Auto-fix formatting
```

## Environment Variables

Required in `.env` (see `.env.example`):
- `SHOPIFY_STORE_DOMAIN` — e.g. `rawway.myshopify.com`
- `SHOPIFY_STOREFRONT_ACCESS_TOKEN` — from Shopify Partners app
- `SHOPIFY_REVALIDATION_SECRET` — for webhook-based ISR
- `COMPANY_NAME`, `SITE_NAME` — branding strings

## Architecture

### Shopify Integration Layer (`lib/shopify/`)

All Shopify communication lives here. `shopifyFetch()` in `index.ts` is the single GraphQL client — every data function goes through it.

- `queries/` — read operations (products, collections, cart, menus, pages)
- `mutations/` — write operations (cart create/add/remove/update)
- `fragments/` — shared GraphQL field sets
- `types.ts` — TypeScript types for both Shopify API shapes and reshaped frontend types

Data flows: Shopify GraphQL response → `reshape*()` functions → frontend-friendly types. Key transformations: edges/nodes flattened to arrays, hidden products filtered, image alt text generated.

### Cart System

Cart state uses React 19's `useOptimistic` for instant UI updates while server actions process in the background.

- `components/cart/cart-context.tsx` — `CartProvider` and `useCart()` hook. Root layout passes an **unawaited** cart Promise to avoid blocking render.
- `components/cart/actions.ts` — Server Actions that call Shopify mutations. Cart ID stored in cookies.
- Checkout redirects to Shopify's hosted checkout URL (`cart.checkoutUrl`).

### Caching Strategy

Uses Next.js experimental `"use cache"` directive with `cacheLife()` and `cacheTag()`:
- Products and collections: cached for days, revalidated via Shopify webhooks hitting `/api/revalidate`
- Cart: cached for seconds (private cache)
- Webhooks verify `SHOPIFY_REVALIDATION_SECRET` before revalidating

### Routing

Collections are rendered at `/search/[collection]` (not `/collections/`). Shopify menu URLs are rewritten: `/collections` → `/search`, `/pages` → root. Products at `/product/[handle]`. CMS pages at `/[page]`.

### Key Patterns

- Server Components by default; `"use client"` only for interactive pieces (cart modal, variant selector, search, mobile menu)
- Products tagged `nextjs-frontend-hidden` are filtered from listings but accessible via direct URL
- `noUncheckedIndexedAccess` is enabled in tsconfig — handle potential `undefined` on array access
- PPR (Partial Pre-Rendering) is enabled experimentally
- Uses `@headlessui/react` for accessible unstyled components, `@heroicons/react` for icons
