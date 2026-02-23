export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  imageUrl: string;
  stripePriceId: string;
  featured: boolean;
  minQuantity: number;
  stock: number | 'unlimited';
  metadata: Record<string, string>;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CheckoutItem {
  productId: string;
  quantity: number;
}
