import { MetadataRoute } from 'next';
import { products } from '@/lib/products';
import { getBaseUrl } from '@/lib/shop-config';

const BASE_URL = getBaseUrl();

export default function sitemap(): MetadataRoute.Sitemap {
  const productPages = products.map((product) => ({
    url: `${BASE_URL}/product/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...productPages,
  ];
}
