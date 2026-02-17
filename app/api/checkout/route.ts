import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getProductById } from '@/lib/products';
import { commerce, getBaseUrl } from '@/lib/shop-config';

interface CartItemPayload {
  productId: string;
  quantity: number;
}

const { shipping, cart } = commerce;
const currencyCode = commerce.currency.code.toLowerCase();

function getStripeClient(): Stripe {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    throw new Error('STRIPE_SECRET_KEY environment variable is not configured');
  }
  return new Stripe(stripeSecretKey);
}

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripeClient();

    const { items }: { items: CartItemPayload[] } = await request.json();

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    let cartTotal = 0;

    for (const item of items) {
      const product = getProductById(item.productId);

      if (!product) {
        return NextResponse.json({ error: `Product not found: ${item.productId}` }, { status: 400 });
      }

      if (!product.stripePriceId) {
        return NextResponse.json({ error: `Missing price for product: ${product.name}` }, { status: 400 });
      }

      const minQty = product.minQuantity ?? 1;
      if (!Number.isInteger(item.quantity) || item.quantity < minQty || item.quantity > cart.maxQuantity) {
        return NextResponse.json(
          { error: `Minimum order for ${product.name} is ${minQty} bags` },
          { status: 400 }
        );
      }

      cartTotal += product.price * item.quantity;

      lineItems.push({
        price: product.stripePriceId,
        quantity: item.quantity,
      });
    }

    const shippingOptions: Stripe.Checkout.SessionCreateParams.ShippingOption[] = [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: shipping.standardAmount, currency: currencyCode },
          display_name: shipping.standardLabel,
          delivery_estimate: {
            minimum: { unit: 'business_day', value: shipping.estimateMinDays },
            maximum: { unit: 'business_day', value: shipping.estimateMaxDays },
          },
        },
      },
    ];

    if (cartTotal >= shipping.freeThreshold) {
      shippingOptions.unshift({
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: 0, currency: currencyCode },
          display_name: shipping.freeLabel,
          delivery_estimate: {
            minimum: { unit: 'business_day', value: shipping.estimateMinDays },
            maximum: { unit: 'business_day', value: shipping.estimateMaxDays },
          },
        },
      });
    }

    const baseUrl = getBaseUrl();
    const successUrl = `${baseUrl}/order/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}/?canceled=true`;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      shipping_address_collection: {
        allowed_countries: shipping.countries as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[],
      },
      shipping_options: shippingOptions,
      allow_promotion_codes: true,
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Checkout failed: ${message}` },
      { status: 500 }
    );
  }
}

