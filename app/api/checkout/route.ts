import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { lineItems, clientId } = await req.json();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems, // [{ price: "price_xxx", quantity: 1 }]
      success_url: `${process.env.APP_BASE_URL}/dashboard/orders?paid=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_BASE_URL}/dashboard?canceled=1`,
      client_reference_id: clientId,
      metadata: { clientId },
    });

    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    console.error("create checkout session error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
