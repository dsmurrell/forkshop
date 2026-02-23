import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripe, incrementStock, bustProductCache } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not configured');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook signature verification failed:', message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      bustProductCache();
      break;
    }

    case 'checkout.session.expired': {
      const session = event.data.object as Stripe.Checkout.Session;
      await restoreStockFromSession(session);
      bustProductCache();
      break;
    }
  }

  return NextResponse.json({ received: true });
}

async function restoreStockFromSession(session: Stripe.Checkout.Session) {
  const raw = session.metadata?.stock_holds;
  if (!raw) return;

  try {
    const holds: Array<{ productId: string; quantity: number }> = JSON.parse(raw);
    for (const hold of holds) {
      await incrementStock(hold.productId, hold.quantity);
    }
  } catch (err) {
    console.error('Failed to restore stock from expired session:', err);
  }
}
