import { Suspense } from 'react';
import { getProducts } from '@/lib/products';
import HomeContent from './HomeContent';

export default async function Home() {
  let products: Awaited<ReturnType<typeof getProducts>> = [];
  try {
    products = await getProducts();
  } catch {
    // Stripe not configured yet — render empty grid
  }

  return (
    <Suspense fallback={null}>
      <HomeContent products={products} />
    </Suspense>
  );
}
