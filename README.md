# Next.js Shop Template

A beautiful, production-ready e-commerce storefront built with Next.js 14, Stripe Checkout, and Tailwind CSS. Originally built for [The Fudge Sisters](https://thefudgesisters.com), designed to be forked and repurposed for any small shop.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Payments:** Stripe Checkout (one-time payments)
- **State:** Zustand (cart persistence via localStorage)
- **Animations:** Framer Motion
- **Deployment:** AWS Amplify (also works on Vercel)

## Quick Start

```bash
# 1. Clone / fork the repo
git clone https://github.com/your-username/your-shop.git
cd your-shop

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Stripe key and domain

# 4. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the shop.

## Customization

All shop-specific configuration lives in **two files**:

### 1. `lib/shop-config.ts` — Brand, commerce, content & theme

This is the single source of truth for everything that makes the shop yours:

| Section | What it controls |
|---------|-----------------|
| `brand` | Shop name, tagline, email, domain |
| `commerce` | Currency, shipping rules, cart limits |
| `seo` | Page titles, descriptions, keywords |
| `images` | Logo, hero banner, about image paths |
| `analytics` | Plausible script URL (set to `null` to disable) |
| `themeColors` | Tailwind color palette (cream, espresso, copper, etc.) |
| `content` | All page copy — hero, about, contact, 404, error, success pages |

### 2. `lib/products.ts` — Product catalog

Define your products here. Each product needs:

- `id`, `slug`, `name`, `description`, `longDescription`
- `price` (in base currency units, e.g. 4.00 for GBP)
- `image` (path relative to `/public`)
- `stripePriceId` (from your Stripe dashboard)
- `ingredients`, `weight`, `minQuantity`

### 3. Images

Replace the files in `public/images/` with your own:

| File | Usage | Recommended size |
|------|-------|-----------------|
| `logo.png` | Navbar & footer logo | 200x200px, transparent PNG |
| `hero-banner.jpg` | Homepage hero background, OG image | 1920x1080px+ |
| `hero-grid.jpg` | About section image | 800x800px+ |
| `{product}.jpg` | Product images | 800x800px, square |

Also replace favicons and PWA icons:
- `favicon.ico`, `favicon.svg`
- `apple-touch-icon.png`
- `web-app-manifest-192x192.png`, `web-app-manifest-512x512.png`

### 4. `public/manifest.json`

Update the PWA manifest with your shop name, description, and theme colors to match your `lib/shop-config.ts` values.

## Setting Up Stripe

1. Create a [Stripe account](https://dashboard.stripe.com/register)
2. Create products and prices in your [Stripe Dashboard](https://dashboard.stripe.com/products)
3. Copy the **Price IDs** (e.g. `price_1Abc...`) into `lib/products.ts`
4. For testing, use your **test mode** API key and test Price IDs
5. For production, set `PRICE_MODE=prod` and add your live Price IDs

The checkout flow uses Stripe Checkout Sessions — customers are redirected to Stripe's hosted payment page and returned to `/order/success` on completion.

## Using a Coding Agent

The fastest way to repurpose this shop is with a coding agent (Cursor, Claude, etc.). See **[SETUP_PROMPT.md](SETUP_PROMPT.md)** for a ready-to-paste prompt.

If you open this repo in Cursor, the agent will automatically pick up project context from `.cursor/rules/` and understand the configuration structure.

## Deployment

### AWS Amplify

This project includes an `amplify.yml` build spec. To deploy:

1. Push your repo to GitHub
2. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
3. Connect your repository
4. Add environment variables in the Amplify console:
   - `STRIPE_SECRET_KEY`
   - `NEXT_PUBLIC_BASE_URL`
   - `PRICE_MODE`
5. Deploy

### Vercel

This also works on Vercel out of the box:

1. Push your repo to GitHub
2. Import it at [vercel.com/new](https://vercel.com/new)
3. Add the same environment variables
4. Deploy

## Project Structure

```
├── app/
│   ├── api/checkout/route.ts   # Stripe Checkout API
│   ├── order/success/page.tsx  # Post-purchase page
│   ├── product/[slug]/page.tsx # Product detail pages
│   ├── layout.tsx              # Root layout, metadata, analytics
│   ├── page.tsx                # Homepage (hero, products, about, contact)
│   ├── not-found.tsx           # 404 page
│   ├── error.tsx               # Error boundary
│   ├── sitemap.ts              # Auto-generated sitemap
│   └── robots.ts               # Robots.txt
├── components/
│   ├── Navbar.tsx              # Header with cart button
│   ├── Footer.tsx              # Site footer
│   ├── Cart.tsx                # Slide-out cart drawer
│   ├── ProductCard.tsx         # Product grid card
│   ├── ProductPageContent.tsx  # Product detail view
│   └── ...
├── lib/
│   ├── shop-config.ts          # ** ALL SHOP CONFIG — edit this **
│   ├── products.ts             # ** PRODUCT CATALOG — edit this **
│   ├── cartStore.ts            # Zustand cart state
│   └── types.ts                # TypeScript interfaces
├── public/
│   ├── images/                 # Product & brand images
│   └── manifest.json           # PWA manifest
├── .env.example                # Environment variable template
├── SETUP_PROMPT.md             # Coding agent prompt
├── amplify.yml                 # AWS Amplify build config
└── tailwind.config.ts          # Tailwind (imports colors from shop-config)
```

## License

MIT
