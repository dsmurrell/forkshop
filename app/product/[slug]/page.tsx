import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProducts, getProductBySlug, getOtherProducts } from '@/lib/products';
import ProductPageContent from '@/components/ProductPageContent';
import { brand, seo, formatPrice, getBaseUrl } from '@/lib/shop-config';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

const BASE_URL = getBaseUrl();

export async function generateStaticParams() {
  try {
    const products = await getProducts();
    return products.map((product) => ({ slug: product.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  const price = formatPrice(product.price);
  const title = `${product.name} | ${brand.name}`;
  const description = `${product.longDescription} ${price}. ${seo.description}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${BASE_URL}/product/${product.slug}`,
      siteName: brand.name,
      images: product.imageUrl
        ? [{ url: product.imageUrl, width: 800, height: 800, alt: product.name }]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: product.imageUrl ? [product.imageUrl] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getOtherProducts(product.slug, 3);

  return <ProductPageContent product={product} relatedProducts={relatedProducts} />;
}
