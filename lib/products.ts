import { Product } from './types';
import { commerce } from './shop-config';

// Test mode price IDs (Stripe test mode)
// Replace these with your own Price IDs from https://dashboard.stripe.com/products
const testPriceIds = {
  biscoff: 'price_REPLACE_ME',
  original: 'price_REPLACE_ME',
  pecan: 'price_REPLACE_ME',
  chocolate: 'price_REPLACE_ME',
};

// Production mode price IDs (Stripe live mode)
// Replace these with your live Price IDs when going to production
const prodPriceIds = {
  biscoff: 'price_REPLACE_ME',
  original: 'price_REPLACE_ME',
  pecan: 'price_REPLACE_ME',
  chocolate: 'price_REPLACE_ME',
};

// Select price IDs based on PRICE_MODE environment variable
const priceIds = process.env.PRICE_MODE === 'prod' ? prodPriceIds : testPriceIds;

export const DEFAULT_MIN_QTY = commerce.cart.defaultMinQuantity;

export const products: Product[] = [
  {
    id: '1',
    slug: 'biscoff-fudge',
    name: 'Biscoff Fudge',
    description: 'Buttery fudge with the irresistible caramelised flavour of Biscoff',
    longDescription:
      'Buttery fudge with the irresistible caramelised flavour of Biscoff.',
    price: 4.0,
    image: '/images/biscoff.jpg',
    stripePriceId: priceIds.biscoff,
    featured: true,
    minQuantity: DEFAULT_MIN_QTY,
    weight: 'Min 80g per bag of 6 squares',
    ingredients:
      'Sugar, Condensed Milk (MILK, Sugar), Water, Butter (MILK, Salt), Biscoff Spread (Caramelised Biscuits(WHEAT Flour, Sugar, Vegetable Oils (Palm, Rapeseed), Candy Sugar Syrup, Raising Agent (Sodium Hydrogen Carbonate), SOYA Flour, Salt, Cinnamon), Rapeseed Oil, Sugar, Emulsifier (Lecithins (SOYA)), Acid (Citric Acid)), Glucose Syrup',
  },
  {
    id: '2',
    slug: 'original-fudge',
    name: 'Original Fudge',
    description: 'Original, classic fudge handmade by The Fudge Sisters',
    longDescription:
      'Original, classic fudge handmade by The Fudge Sisters for the ultimate melt-in-your-mouth indulgence.',
    price: 3.5,
    image: '/images/original.jpg',
    stripePriceId: priceIds.original,
    featured: true,
    minQuantity: DEFAULT_MIN_QTY,
    weight: 'Min 75g per bag of 6 squares',
    ingredients:
      'Sugar, Condensed Milk (MILK, Sugar), Water, Butter (MILK, Salt), Glucose Syrup',
  },
  {
    id: '3',
    slug: 'pecan-fudge',
    name: 'Pecan Fudge',
    description: 'Decadently nutty fudge with the natural sweetness and crunch of pecans',
    longDescription:
      'Decadently nutty fudge, enhanced with the natural sweetness and crunch of pecans.',
    price: 4.5,
    image: '/images/pecan-nut.jpg',
    stripePriceId: priceIds.pecan,
    featured: true,
    minQuantity: DEFAULT_MIN_QTY,
    weight: 'Min 85g per bag of 6 squares',
    ingredients:
      'Sugar, Condensed Milk (MILK, Sugar), PECAN NUTS, Water, Butter (MILK, Salt)',
  },
  {
    id: '4',
    slug: 'chocolate-fudge',
    name: 'Chocolate Fudge',
    description: 'Rich, crumbly fudge packed with deep cocoa goodness',
    longDescription:
      'Rich, crumbly fudge packed with deep cocoa goodness for every chocolate lover.',
    price: 4.0,
    image: '/images/chocolate.jpg',
    stripePriceId: priceIds.chocolate,
    featured: true,
    minQuantity: DEFAULT_MIN_QTY,
    weight: 'Min 80g per bag of 6 squares',
    ingredients:
      'Sugar, Condensed Milk (MILK, Sugar), Water, Butter (MILK, Salt), Cocoa Powder (Cocoa Powder, Potassium Carbonates), Glucose Syrup, Vanilla Essence (Water, Organic Alcohol, Organic Bourbon Vanilla Pods)',
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getOtherProducts(currentSlug: string, limit: number = 3): Product[] {
  return products.filter((product) => product.slug !== currentSlug).slice(0, limit);
}

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

