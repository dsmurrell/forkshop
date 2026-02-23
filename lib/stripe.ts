import 'server-only';
import Stripe from 'stripe';
import { unstable_cache, revalidateTag } from 'next/cache';
import { Product } from './types';
import { commerce } from './shop-config';

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY environment variable is not configured');
  _stripe = new Stripe(key);
  return _stripe;
}

// ---------------------------------------------------------------------------
// Stripe → App type mapping
// ---------------------------------------------------------------------------

function parseStock(value: string | undefined): number | 'unlimited' {
  if (!value || value === 'unlimited') return 'unlimited';
  const n = parseInt(value, 10);
  return isNaN(n) ? 'unlimited' : n;
}

function mapStripeProduct(product: Stripe.Product): Product | null {
  const price = product.default_price as Stripe.Price | null;
  if (!price || !price.unit_amount) return null;

  const meta = product.metadata ?? {};

  return {
    id: product.id,
    slug: meta.slug || product.id,
    name: product.name,
    description: meta.short_description || product.description || '',
    longDescription: product.description || '',
    price: price.unit_amount / 100,
    imageUrl: product.images?.[0] || '',
    stripePriceId: price.id,
    featured: meta.featured === 'true',
    minQuantity: parseInt(meta.min_quantity, 10) || 1,
    stock: parseStock(meta.stock),
    metadata: meta,
  };
}

// ---------------------------------------------------------------------------
// Cached product fetching (ISR — revalidates every 60s or on-demand via tag)
// ---------------------------------------------------------------------------

async function fetchAllProducts(): Promise<Product[]> {
  const stripe = getStripe();
  const products: Product[] = [];
  let hasMore = true;
  let startingAfter: string | undefined;

  while (hasMore) {
    const response = await stripe.products.list({
      active: true,
      expand: ['data.default_price'],
      limit: 100,
      ...(startingAfter ? { starting_after: startingAfter } : {}),
    });

    for (const sp of response.data) {
      const mapped = mapStripeProduct(sp);
      if (mapped) products.push(mapped);
    }

    hasMore = response.has_more;
    if (response.data.length > 0) {
      startingAfter = response.data[response.data.length - 1].id;
    }
  }

  return products;
}

export const getProducts = unstable_cache(fetchAllProducts, ['stripe-products'], {
  revalidate: 60,
  tags: ['products'],
});

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((p) => p.slug === slug);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((p) => p.id === id);
}

export async function getOtherProducts(currentSlug: string, limit = 3): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((p) => p.slug !== currentSlug).slice(0, limit);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((p) => p.featured);
}

// ---------------------------------------------------------------------------
// Stock management (reads/writes Stripe metadata directly — not cached)
// ---------------------------------------------------------------------------

export async function decrementStock(
  productId: string,
  quantity: number
): Promise<{ success: boolean; remaining?: number }> {
  const stripe = getStripe();
  const product = await stripe.products.retrieve(productId);
  const current = parseStock(product.metadata?.stock);

  if (current === 'unlimited') return { success: true };

  if (current < quantity) {
    return { success: false, remaining: current };
  }

  const newStock = current - quantity;
  await stripe.products.update(productId, {
    metadata: { ...product.metadata, stock: String(newStock) },
  });

  return { success: true, remaining: newStock };
}

export async function incrementStock(productId: string, quantity: number): Promise<void> {
  const stripe = getStripe();
  const product = await stripe.products.retrieve(productId);
  const current = parseStock(product.metadata?.stock);

  if (current === 'unlimited') return;

  const newStock = current + quantity;
  await stripe.products.update(productId, {
    metadata: { ...product.metadata, stock: String(newStock) },
  });
}

export function bustProductCache(): void {
  try {
    revalidateTag('products', { expire: 0 });
  } catch {
    // revalidateTag throws if called outside a request context (e.g. during build)
  }
}
