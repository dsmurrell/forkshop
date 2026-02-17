# Coding Agent Setup Prompt

Copy the prompt below into your coding agent (Cursor, Claude, ChatGPT, etc.) after filling in the bracketed placeholders with your own details.

> **Tip:** You don't have to fill in the placeholders yourself. Paste the entire prompt into Claude (or a similar AI) along with a short description like *"I've forked this repo with a prompt to help me set it up. I want to create a shop that sells pottery. Can you fill in the prompt for me?"* — and it will generate a completed version of the prompt tailored to your shop. Then paste that filled-in prompt into your coding agent.

---

## The Prompt

```
I've forked a Next.js e-commerce shop template and I need to repurpose it for my own shop. Here are my details:

**Shop name:** [YOUR SHOP NAME]
**Tagline:** [e.g. "Handmade with care"]
**What I sell:** [Describe your products — e.g. "artisan candles in 5 scents"]
**Contact email:** [your@email.com]
**Domain:** [https://your-domain.com]
**Country/region I ship to:** [e.g. US, GB, EU countries]
**Currency:** [e.g. USD, GBP, EUR]
**Shipping cost:** [e.g. "$5.99 standard, free over $50"]
**Brand vibe/colors:** [e.g. "minimal, earthy — sage greens and warm whites" or "bold and colorful — hot pink and black"]

**About us (a few sentences):**
[Write 2-3 paragraphs about your business story, what makes you special, etc.]

**Products:**
[List each product with: name, short description, long description, price, and any relevant details like ingredients/materials/weight]

---

Please make the following changes to repurpose this shop:

### 1. Update `lib/shop-config.ts`
This is the central config file. Update ALL sections:
- `brand` — name, shortName, tagline, email, domain
- `commerce` — currency code & locale, shipping (freeThreshold, standardAmount in smallest currency unit like cents, countries as ISO codes, estimates, bannerText), cart settings
- `seo` — title, titleTemplate, description, keywords relevant to my products
- `images` — keep the paths but update alt text to match my products
- `analytics` — set plausibleScript to null (I'll set up my own analytics later)
- `manifestColors` — update to match the new theme
- `content` — rewrite ALL content sections:
  - hero: eyebrow text, heading (split into heading + accent word), description, CTA button text
  - products: section eyebrow, heading, description, minOrderNote (or remove if not needed by setting minQuantity to 1), categoryLabel
  - about: eyebrow, heading, paragraphs (use the about text I provided)
  - contact: eyebrow, heading, description
  - notFound: fun 404 message matching my brand voice
  - error: emoji, title, description matching my brand voice
  - orderSuccess: thank you message mentioning my products
  - cart: emptyTitle, emptyMessage
  - footer: description, tagline, motto

### 2. Update `lib/products.ts`
Replace the product array with my products. For each product:
- Generate a unique `id` (1, 2, 3...)
- Generate a URL-friendly `slug` from the product name
- Set the `price` in base currency units (e.g. 4.50)
- Set `image` to `/images/{slug}.jpg` (I'll add the actual images)
- Set `stripePriceId` to a placeholder like `'price_REPLACE_ME'` (I'll add real Stripe IDs later)
- Set `minQuantity` to 1 unless I specified otherwise
- Set `weight` and `ingredients` (or rename these fields in `lib/types.ts` if they don't apply — e.g. "materials" instead of "ingredients")
- Keep `featured: true` for products I want highlighted

Also update the test/prod price ID objects at the top to have keys matching my product slugs.

### 3. Update `app/globals.css` — Theme colors
The `@theme` block in `globals.css` defines the Tailwind color palette. Update the CSS custom properties to match my brand vibe (e.g. `--color-cream-100`, `--color-espresso`, `--color-copper`, etc.). You can rename colors or add new ones. Make sure there's good contrast for readability.

### 4. Update `public/manifest.json`
Update `name`, `short_name`, `description`, `background_color`, and `theme_color` to match the new config.

### 5. Update `package.json`
Change the `name` field to match my shop.

### 6. Review and adjust
- If my products don't have "ingredients", update `lib/types.ts` to rename the `ingredients` field to something appropriate (e.g. `materials`, `details`) and update `components/ProductPageContent.tsx` accordingly
- If I don't need minimum order quantities, set `defaultMinQuantity` to 1 in the config and remove the min order notes
- Make sure the allergen info section in ProductPageContent.tsx is appropriate for my product type, or remove it if not relevant

After making changes, list the image files I need to provide in `public/images/` with recommended dimensions.
```

---

## After the Agent Finishes

1. **Add your images** to `public/images/` (the agent will tell you which files are needed)
2. **Set up Stripe** — create products in your [Stripe Dashboard](https://dashboard.stripe.com/products) and copy the Price IDs into `lib/products.ts`
3. **Create `.env.local`** — copy `.env.example` and fill in your Stripe key and domain
4. **Test locally** — run `npm run dev` and test the full checkout flow with Stripe test mode
5. **Replace favicons** — update `favicon.ico`, `favicon.svg`, `apple-touch-icon.png`, and the PWA icons
6. **Deploy** — push to GitHub and connect to AWS Amplify or Vercel (see README.md)
