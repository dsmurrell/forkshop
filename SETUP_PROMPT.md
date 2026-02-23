# Coding Agent Setup Prompt

Copy the prompt below into your coding agent (Cursor, Claude, ChatGPT, etc.) after filling in the bracketed placeholders with your own details.

> **Tip:** You don't have to fill in the placeholders yourself. Paste the entire prompt into Claude (or a similar AI) along with a short description like *"I've forked this repo with a prompt to help me set it up. I want to create a shop that sells pottery. Can you fill in the prompt for me?"* — and it will generate a completed version of the prompt tailored to your shop. Then paste that filled-in prompt into your coding agent.

---

## The Prompt

```
I've forked a Next.js e-commerce shop template and I need to repurpose it for my own shop. Products are managed in Stripe (not in code), so I only need to update branding, content, and theme. Here are my details:

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

**Product detail fields I want displayed:**
[List metadata fields you'll add to Stripe products. Examples:
- "Ingredients" (with allergens in **bold** markdown) for food products
- "Materials" for handmade goods
- "Dimensions" for physical products
- "Weight" for shipped items
Or say "none" if you just want name, description, and price]

---

Please make the following changes to repurpose this shop:

### 1. Update `lib/shop-config.ts`
This is the central config file. Update ALL sections:
- `brand` — name, shortName, tagline, email, domain
- `commerce` — currency code & locale, shipping (freeThreshold, standardAmount in smallest currency unit like cents, countries as ISO codes, estimates, bannerText), cart settings (defaultMinQuantity controls the homepage grid note only — per-product minimums are set via Stripe metadata `min_quantity`)
- `seo` — title, titleTemplate, description, keywords relevant to my products
- `images` — keep the paths but update alt text to match my products
- `analytics` — set plausibleScript to null (I'll set up my own analytics later)
- `productConfig` — update `detailFields` to match my product metadata fields (e.g. if I sell pottery, change "Ingredients" to "Materials" and "Net weight" to "Dimensions"). Set `markdown: true` on fields where the Stripe metadata value uses inline markdown (**bold**, *italic*, line breaks). Update or remove `detailNote` as appropriate. Adjust `stockHoldMinutes` if needed (default 30).
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

### 2. Update `app/globals.css` — Theme colors
The `@theme` block in `globals.css` defines the Tailwind color palette. Update the CSS custom properties to match my brand vibe (e.g. `--color-cream-100`, `--color-espresso`, `--color-copper`, etc.). You can rename colors or add new ones. Make sure there's good contrast for readability.

### 3. Update `public/manifest.json`
Update `name`, `short_name`, `description`, `background_color`, and `theme_color` to match the new config.

### 4. Update `package.json`
Change the `name` field to match my shop.

### 5. Review and adjust
- If my product detail fields don't include "ingredients", make sure `productConfig.detailFields` reflects my actual Stripe metadata keys
- If I don't need minimum order quantities, set `defaultMinQuantity` to 1 (hides the homepage min order note) and don't add `min_quantity` metadata to Stripe products
- Make sure the `detailNote` (allergen/disclaimer text) is appropriate for my product type, or set it to `null`

After making changes, tell me:
1. What Stripe metadata keys I should add to my products (based on the `detailFields` config)
2. The image files I need to provide in `public/images/` with recommended dimensions
3. How to set up my Stripe products and webhook
```

---

## After the Agent Finishes

1. **Set up Stripe products** — create products in your [Stripe Dashboard](https://dashboard.stripe.com/products):
   - Add name, description, price, and images
   - Add metadata keys: `slug` (required), plus any detail fields (e.g. `ingredients`, `weight`)
   - Optionally add: `featured` (`true`), `stock` (number or omit for unlimited), `min_quantity`, `short_description`
2. **Set up Stripe webhooks** — add an endpoint at `https://your-domain.com/api/webhooks/stripe` for `checkout.session.completed` and `checkout.session.expired` events
3. **Create `.env.local`** — copy `.env.example` and fill in your Stripe secret key, webhook secret, and domain
4. **Add brand images** to `public/images/` (logo, hero banner, about image — product images are on Stripe)
5. **Test locally** — run `npm run dev` and test the full checkout flow with Stripe test mode. Use `stripe listen --forward-to localhost:3000/api/webhooks/stripe` for local webhook testing
6. **Replace favicons** — update `favicon.ico`, `favicon.svg`, `apple-touch-icon.png`, and the PWA icons
7. **Deploy** — push to GitHub and connect to AWS Amplify or Vercel (see README.md)
