# Next.js Shop Template

A beautiful, production-ready e-commerce storefront built with Next.js 16, Stripe Checkout, and Tailwind CSS 4. Products, prices, images, and inventory are all managed from your Stripe Dashboard — no database required. Originally built for [The Fudge Sisters](https://thefudgesisters.com), designed to be forked and repurposed for any small shop.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript 5.9
- **Styling:** Tailwind CSS 4 (CSS-first configuration)
- **Payments:** Stripe Checkout (one-time payments)
- **Product Data:** Stripe Products API (single source of truth)
- **State:** Zustand 5 (cart persistence via localStorage)
- **Animations:** Framer Motion 12
- **UI:** React 19
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
# Edit .env.local with your Stripe keys

# 4. Set up products in Stripe (see below)

# 5. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the shop.

## Setting Up Stripe Products

Products are fetched directly from Stripe — there is no product catalog file to edit. All product data lives in your [Stripe Dashboard](https://dashboard.stripe.com/products).

### 1. Create products in Stripe

For each product, set:

| Field | Where | Notes |
|-------|-------|-------|
| **Name** | Product name | Displayed as the product title |
| **Description** | Product description | Used as the long description on the detail page |
| **Image** | Product images | Upload at least one; the first image is used everywhere |
| **Price** | Default price | Set a one-time price in your currency |

### 2. Add metadata

In the **Metadata** section of each Stripe product, add these keys:

| Key | Required | Example | Purpose |
|-----|----------|---------|---------|
| `slug` | Yes | `biscoff-fudge` | URL-friendly identifier (`/product/biscoff-fudge`) |
| `short_description` | No | `Rich biscoff butter fudge` | Brief tagline for product cards (falls back to product description) |
| `featured` | No | `true` | Set to `true` to feature this product |
| `stock` | No | `50` | Number of units available. Omit or set to `unlimited` for unlimited stock |
| `min_quantity` | No | `2` | Minimum order quantity (defaults to 1 if not set) |
| `min_order_message` | No | `Minimum {minQty} per item — ...` | Per-product min order note (falls back to global config). `{minQty}` is replaced automatically |

You can add any additional metadata keys (e.g. `ingredients`, `weight`, `materials`) and configure them in `lib/shop-config.ts` under `productConfig.detailFields` to display on the product page. Fields with `markdown: true` in the config support inline formatting: `**bold**`, `*italic*`, and `\n` for line breaks.

### 3. Set up webhooks

Webhooks are required for inventory management. When a checkout session expires without payment, the webhook restores the held stock.

1. Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
2. Add an endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Select events: `checkout.session.completed`, `checkout.session.expired`
4. Copy the **Signing secret** to your `.env.local` as `STRIPE_WEBHOOK_SECRET`

For local development, use the [Stripe CLI](https://stripe.com/docs/stripe-cli):

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### How inventory works

1. When a customer starts checkout, stock is **decremented** immediately
2. The checkout session has a **30-minute expiry** (configurable in `lib/shop-config.ts`)
3. If the customer completes payment → stock stays decremented, cache is busted
4. If the session expires → the webhook **restores** the stock automatically
5. Product data is cached for 60 seconds (ISR) and busted on checkout events

## Local Development

### Prerequisites

- Node.js 22+
- A [Stripe account](https://dashboard.stripe.com/register) (free to create)
- [Stripe CLI](https://docs.stripe.com/stripe-cli) for local webhook testing

### Getting started

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local
```

Edit `.env.local` with your Stripe **test mode** secret key (starts with `sk_test_`). You can find it at [dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys).

### Stripe test mode

Stripe has a built-in test mode that lets you simulate the full checkout flow without real payments. When you're in test mode:

- Use test API keys (`sk_test_...`) — never your live keys during development
- Use [Stripe's test card numbers](https://docs.stripe.com/testing#cards) at checkout (e.g. `4242 4242 4242 4242` with any future expiry and any CVC)
- Products, prices, and metadata you create in test mode are separate from live mode
- Toggle between test and live mode using the switch in the top-right of the Stripe Dashboard

### Running webhooks locally

Stripe can't reach `localhost` directly, so you need the Stripe CLI to forward webhook events to your local dev server:

```bash
# 1. Install the Stripe CLI
brew install stripe/stripe-cli/stripe    # macOS
# See https://docs.stripe.com/stripe-cli for other platforms

# 2. Log in to your Stripe account
stripe login

# 3. Forward webhooks to your local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

The CLI will print a webhook signing secret (starts with `whsec_`). Add it to your `.env.local`:

```
STRIPE_WEBHOOK_SECRET=whsec_your_local_secret_here
```

Then start the dev server in a separate terminal:

```bash
npm run dev
```

Now when you complete a test checkout, Stripe fires events → the CLI forwards them → your local webhook processes them (stock updates, cache busting, etc.).

> **Note:** If you skip the webhook setup, the shop still works for browsing and purchasing. The only thing you lose is automatic stock restoration when a checkout session expires. For development and testing, this is usually fine.

## Customization

### 1. `lib/shop-config.ts` — Brand, commerce, content

This is the single source of truth for everything that makes the shop yours:

| Section | What it controls |
|---------|-----------------|
| `brand` | Shop name, tagline, email, domain |
| `commerce` | Currency, shipping rules, cart limits |
| `seo` | Page titles, descriptions, keywords |
| `images` | Logo, hero banner, about image paths |
| `analytics` | Plausible script URL (set to `null` to disable) |
| `productConfig` | Detail fields to display from Stripe metadata, allergen note, stock hold duration |
| `content` | All page copy — hero, about, contact, 404, error, success pages |

### 2. Theme colors

Colors are defined in `app/globals.css` inside the `@theme` block using Tailwind CSS 4's CSS-first configuration:

```css
@theme {
  --color-cream-50: #FFFDF9;
  --color-cream-100: #FAF7F2;
  --color-espresso: #2C1810;
  --color-copper: #B87333;
  /* ... */
}
```

Edit these CSS custom properties to change the color palette across the entire site.

### 3. Images

Replace the files in `public/images/` with your own:

| File | Usage | Recommended size |
|------|-------|-----------------|
| `logo.png` | Navbar & footer logo | 200x200px, transparent PNG |
| `hero-banner.jpg` | Homepage hero background, OG image | 1920x1080px+ |
| `hero-grid.jpg` | About section image | 800x800px+ |

Product images are hosted on Stripe — upload them in the Stripe Dashboard.

Also replace favicons and PWA icons:
- `favicon.ico`, `favicon.svg`
- `apple-touch-icon.png`
- `web-app-manifest-192x192.png`, `web-app-manifest-512x512.png`

### 4. `public/manifest.json`

Update the PWA manifest with your shop name, description, and theme colors to match your `lib/shop-config.ts` values.

## Using a Coding Agent

The fastest way to repurpose this shop is with a coding agent (Cursor, Claude, etc.). See **[SETUP_PROMPT.md](SETUP_PROMPT.md)** for a ready-to-paste prompt — or paste it into Claude with a short description of your shop and let it fill in the blanks for you.

## Deployment

### AWS Amplify

This project includes an `amplify.yml` build spec. To deploy:

1. Push your repo to GitHub
2. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
3. Connect your repository
4. Add environment variables in the Amplify console:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `NEXT_PUBLIC_BASE_URL`
5. Deploy
6. Set up the Stripe webhook endpoint with your Amplify URL

### Vercel

This also works on Vercel out of the box:

1. Push your repo to GitHub
2. Import it at [vercel.com/new](https://vercel.com/new)
3. Add the same environment variables
4. Deploy

## Project Structure

```
├── app/
│   ├── api/checkout/route.ts          # Stripe Checkout API (stock verification + session creation)
│   ├── api/webhooks/stripe/route.ts   # Stripe webhooks (stock restore on session expiry)
│   ├── order/success/page.tsx         # Post-purchase page
│   ├── product/[slug]/page.tsx        # Product detail pages (SSG with ISR)
│   ├── layout.tsx                     # Root layout, metadata, analytics
│   ├── page.tsx                       # Homepage (server component, fetches products)
│   ├── HomeContent.tsx                # Homepage client component (hero, products, about, contact)
│   ├── globals.css                    # Tailwind 4 theme (colors, fonts, animations)
│   ├── not-found.tsx                  # 404 page
│   ├── error.tsx                      # Error boundary
│   ├── sitemap.ts                     # Auto-generated sitemap
│   └── robots.ts                      # Robots.txt
├── components/
│   ├── Navbar.tsx                     # Header with cart button
│   ├── Footer.tsx                     # Site footer
│   ├── Cart.tsx                       # Slide-out cart drawer
│   ├── ProductCard.tsx                # Product grid card (with out-of-stock badge)
│   ├── ProductPageContent.tsx         # Product detail view (dynamic metadata fields)
│   └── ...
├── lib/
│   ├── shop-config.ts                 # ** ALL SHOP CONFIG — edit this **
│   ├── stripe.ts                      # Stripe client, product fetching, stock management
│   ├── products.ts                    # Re-exports from stripe.ts
│   ├── cartStore.ts                   # Zustand cart state
│   └── types.ts                       # TypeScript interfaces
├── public/
│   ├── images/                        # Brand images (product images hosted on Stripe)
│   └── manifest.json                  # PWA manifest
├── .env.example                       # Environment variable template
├── SETUP_PROMPT.md                    # Coding agent prompt
└── amplify.yml                        # AWS Amplify build config
```

## License

MIT
