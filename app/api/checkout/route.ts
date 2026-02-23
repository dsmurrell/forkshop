import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripe, getProductById, decrementStock, incrementStock } from '@/lib/stripe';
import { commerce, productConfig, getBaseUrl } from '@/lib/shop-config';

interface CartItemPayload {
  productId: string;
  quantity: number;
}

const { shipping, cart } = commerce;
const currencyCode = commerce.currency.code.toLowerCase();

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe();
    const { items }: { items: CartItemPayload[] } = await request.json();

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    const stockHolds: Array<{ productId: string; quantity: number }> = [];
    let cartTotal = 0;

    for (const item of items) {
      const product = await getProductById(item.productId);

      if (!product) {
        return NextResponse.json({ error: `Product not found: ${item.productId}` }, { status: 400 });
      }

      if (!product.stripePriceId) {
        return NextResponse.json({ error: `Missing price for product: ${product.name}` }, { status: 400 });
      }

      const minQty = product.minQuantity ?? 1;
      if (!Number.isInteger(item.quantity) || item.quantity < minQty || item.quantity > cart.maxQuantity) {
        return NextResponse.json(
          { error: `Invalid quantity for ${product.name} (min ${minQty}, max ${cart.maxQuantity})` },
          { status: 400 }
        );
      }

      if (product.stock !== 'unlimited') {
        const result = await decrementStock(product.id, item.quantity);
        if (!result.success) {
          // Roll back any stock holds we already made in this request
          for (const hold of stockHolds) {
            await incrementStock(hold.productId, hold.quantity);
          }
          const remaining = result.remaining ?? 0;
          return NextResponse.json(
            { error: remaining > 0
                ? `Only ${remaining} of ${product.name} left in stock`
                : `${product.name} is out of stock` },
            { status: 409 }
          );
        }
        stockHolds.push({ productId: product.id, quantity: item.quantity });
      }

      cartTotal += product.price * item.quantity;
      lineItems.push({ price: product.stripePriceId, quantity: item.quantity });
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
    const holdMinutes = productConfig.stockHoldMinutes;
    const expiresAt = Math.floor(Date.now() / 1000) + holdMinutes * 60;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      shipping_address_collection: {
        allowed_countries: shipping.countries as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[],
      },
      shipping_options: shippingOptions,
      allow_promotion_codes: true,
      expires_at: expiresAt,
      success_url: `${baseUrl}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/?canceled=true`,
      metadata: {
        stock_holds: stockHolds.length > 0 ? JSON.stringify(stockHolds) : '',
      },
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
