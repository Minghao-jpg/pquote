import { OrderHistory } from "@/components/order-history";
import CheckoutButton from "@/components/CheckoutButton";

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Order History</h1>
        <p className="text-muted-foreground">
          Track your orders and view past purchases
        </p>
      </div>

      {/* 订单历史 */}
      <OrderHistory />

      {/* Stripe Checkout 按钮 */}
      <div>
        <h2 className="text-xl font-semibold">New Order</h2>
        <CheckoutButton />
      </div>
    </div>
  );
}
