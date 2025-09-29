// app/api/checkout/route.ts
import Stripe from "stripe";
import { NextResponse } from "next/server";

// 让该 API 跑在 Node.js runtime（Stripe SDK 不支持 Edge）
export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { lineItems, clientId } = await req.json();

    // 兜底，防止 APP_BASE_URL 未设置导致 undefined/...
    const base = process.env.APP_BASE_URL || "https://pppur.xyz";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      // ⚠️ 这里的 price 必须是你 Stripe（Test 或 Live）里真实存在的 price_xxx
      line_items: lineItems, // e.g. [{ price: "price_123", quantity: 1 }]
      success_url: `${base}/dashboard/orders?paid=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/dashboard?canceled=1`,
      client_reference_id: clientId,
      metadata: { clientId },
    });

    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    console.error("create checkout session error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
