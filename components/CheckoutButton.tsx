"use client";

export default function CheckoutButton() {
  async function handleCheckout() {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // ⚠️ 这里替换成你 Stripe 后台的价格 ID
        lineItems: [{ price: "price_xxx", quantity: 1 }],
        clientId: "12345",
      }),
    });

    const { url } = await res.json();
    window.location.href = url; // 跳转到 Stripe Checkout
  }

  return (
    <button onClick={handleCheckout}>
      Pay with Stripe
    </button>
  );
}

