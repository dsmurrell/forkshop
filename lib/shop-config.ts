// ============================================================================
// SHOP CONFIG — The single source of truth for your shop.
//
// Fork this repo and edit THIS FILE to make the shop your own.
// For products, edit lib/products.ts. For images, replace files in public/images/.
// ============================================================================

// ---------------------------------------------------------------------------
// Brand
// ---------------------------------------------------------------------------
export const brand = {
  name: 'The Fudge Sisters',
  shortName: 'Fudge Sisters',
  tagline: 'Handcrafted Goodness',
  email: 'hello@thefudgesisters.com',
  /** Fallback when NEXT_PUBLIC_BASE_URL env var is not set */
  domain: 'https://thefudgesisters.com',
};

// ---------------------------------------------------------------------------
// Commerce
// ---------------------------------------------------------------------------
export const commerce = {
  currency: {
    /** ISO 4217 currency code */
    code: 'GBP',
    /** BCP 47 locale for number formatting */
    locale: 'en-GB',
  },
  shipping: {
    /** Cart total (in base currency) at which shipping becomes free */
    freeThreshold: 50,
    /** Standard shipping cost in smallest currency unit (e.g. pence / cents) */
    standardAmount: 599,
    standardLabel: 'Standard Shipping',
    freeLabel: 'Free Shipping',
    /** ISO 3166-1 alpha-2 country codes for allowed shipping destinations */
    countries: ['GB'] as string[],
    /** Delivery estimate range in business days */
    estimateMinDays: 3,
    estimateMaxDays: 7,
    /** Banner shown at the top of every page */
    bannerText: 'UK shipping only. Free shipping on orders over £50',
  },
  cart: {
    /** Maximum quantity of a single product per order */
    maxQuantity: 20,
    /** Default minimum order quantity when a product doesn't specify one */
    defaultMinQuantity: 4,
    /** localStorage key for persisting the cart */
    storageKey: 'shop-cart',
  },
};

// ---------------------------------------------------------------------------
// SEO & Metadata
// ---------------------------------------------------------------------------
export const seo = {
  title: 'The Fudge Sisters | Handcrafted Artisan Fudge',
  titleTemplate: '%s | The Fudge Sisters',
  description:
    'Handcrafted artisan fudge made fresh to order. Traditional fudge done right — no artificial flavourings or preservatives. UK delivery via Royal Mail.',
  keywords: [
    'fudge',
    'artisan fudge',
    'handcrafted fudge',
    'traditional fudge',
    'fudge gift',
    'UK fudge',
    'chocolate fudge',
    'biscoff fudge',
  ],
  ogImageAlt: 'The Fudge Sisters — Handcrafted Artisan Fudge',
};

// ---------------------------------------------------------------------------
// Images (paths relative to /public)
// ---------------------------------------------------------------------------
export const images = {
  logo: '/images/logo.png',
  heroBanner: '/images/hero-banner.jpg',
  heroAlt: 'Freshly cut fudge',
  aboutImage: '/images/hero-grid.jpg',
  aboutImageAlt: 'Fudge arrangement',
  ogImage: '/images/hero-banner.jpg',
};

// ---------------------------------------------------------------------------
// Analytics (set to null to disable)
// ---------------------------------------------------------------------------
export const analytics = {
  plausibleScript: null as string | null,
};

// ---------------------------------------------------------------------------
// Theme — Tailwind color palette
// ---------------------------------------------------------------------------
export const themeColors = {
  cream: {
    50: '#FFFDF9',
    100: '#FAF7F2',
    200: '#F5F0E8',
    300: '#EDE5D8',
  },
  espresso: {
    DEFAULT: '#2C1810',
    light: '#4A3228',
    lighter: '#6B4D3E',
  },
  copper: {
    DEFAULT: '#B87333',
    light: '#D4915A',
    dark: '#8B5A2B',
  },
  sage: {
    DEFAULT: '#9CAF88',
    light: '#B8C9A8',
  },
  rose: {
    DEFAULT: '#C9A9A6',
    light: '#E0CCC9',
  },
};

/** Colors used in public/manifest.json — update that file if you change these */
export const manifestColors = {
  background: '#FAF7F2',
  theme: '#2C1810',
};

// ---------------------------------------------------------------------------
// Page Content — All the shop-specific copy in one place.
// ---------------------------------------------------------------------------
export const content = {
  hero: {
    eyebrow: 'Handcrafted with Love',
    heading: 'Fudge Worth',
    headingAccent: 'Savoring',
    description:
      'Every batch is made by hand in small quantities, using time-honored recipes and the finest ingredients. No shortcuts—just pure, melt-in-your-mouth goodness.',
    cta: 'Shop Our Collection',
  },

  products: {
    eyebrow: 'Our Collection',
    heading: 'Small Batch. Big Flavor.',
    description:
      'Each variety is crafted with care, using only the finest ingredients to create moments of pure indulgence.',
    minOrderNote:
      'Each flavour has a minimum order of {minQty} bags — we make everything fresh in small batches to avoid waste. The more people who discover us, the sooner we can lower it. So spread the word!',
    /** Label shown above the product name on the detail page */
    categoryLabel: 'Artisan Fudge',
    /** Note shown on product detail page below the quantity selector */
    productMinOrderNote:
      'Minimum {minQty} per flavour — we make each batch fresh to order and want to avoid waste while we\'re still growing. Help us bring it down — tell your friends!',
  },

  about: {
    eyebrow: 'About Us',
    heading: 'About Us',
    paragraphs: [
      'We\'re two sisters who were tired of fudge not made right. With our sugar thermometers and our mother\'s childhood recipe, we have perfected the art of traditional fudge.',
      'Made with simple, quality ingredients and no artificial flavourings or preservatives. Traditional fudge done right!',
      'After rave reviews, we decided to bring our fudge to you. Enjoy fudge delivered through your letterbox UK Wide.',
    ],
  },

  contact: {
    eyebrow: 'Get in Touch',
    heading: 'We\'d Love to Hear From You',
    description:
      'Whether you have a question about our fudge, want to place a custom order, or just want to say hello—we\'re here for you.',
  },

  notFound: {
    title: 'This page has been eaten',
    description:
      'We looked everywhere, but it seems someone couldn\'t resist. Our fudge is irresistible like that. Let\'s get you back to the good stuff.',
    cta: 'Browse Our Fudge',
  },

  error: {
    emoji: '🍫',
    emojiLabel: 'Melting fudge',
    title: 'Something went wrong',
    description:
      'Our fudge is fine, but something on our end melted. Give it another try or head back to the shop.',
  },

  orderSuccess: {
    title: 'Thank You!',
    description:
      'Your order has been placed successfully. You\'ll receive a payment receipt from Stripe shortly. We\'ll get to work on your fudge and have it on its way to you soon!',
    cta: 'Continue Shopping',
  },

  cart: {
    emptyTitle: 'Your cart is empty',
    emptyMessage: 'Add some delicious fudge to get started',
  },

  footer: {
    description:
      'Every batch of our fudge is made by hand in small quantities, using time-honored recipes and the finest ingredients. No shortcuts, no compromises—just pure, melt-in-your-mouth goodness.',
    tagline: 'Made with love in small batches',
    motto: 'Small batch. Big flavor.',
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Resolved base URL: prefers the env var, falls back to config domain */
export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_BASE_URL ?? brand.domain;
}

/** Format a number as a price string using the configured locale and currency */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat(commerce.currency.locale, {
    style: 'currency',
    currency: commerce.currency.code,
    minimumFractionDigits: 2,
  }).format(amount);
}

/** Create an Intl.NumberFormat instance for the configured currency */
export function createPriceFormatter(): Intl.NumberFormat {
  return new Intl.NumberFormat(commerce.currency.locale, {
    style: 'currency',
    currency: commerce.currency.code,
    minimumFractionDigits: 2,
  });
}
