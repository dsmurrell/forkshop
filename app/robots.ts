import { MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/shop-config';

const BASE_URL = getBaseUrl();

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/order/success'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
