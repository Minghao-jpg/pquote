import { OrderHistory } from "@/components/order-history"

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Order History</h1>
        <p className="text-muted-foreground">Track your orders and view past purchases</p>
      </div>
      <OrderHistory />
    </div>
  )
}
