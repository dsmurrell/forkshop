export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  image: string;
  stripePriceId: string;
  featured?: boolean;
  minQuantity: number;
  weight: string;
  ingredients: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CheckoutItem {
  productId: string;
  quantity: number;
}

