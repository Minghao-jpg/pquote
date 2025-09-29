import type { Order, OrderItem } from "./data"

export interface CreateOrderRequest {
  clientId: string
  items: OrderItem[]
  totalAmount: number
  shippingMethod: "air" | "ocean"
  estimatedDelivery: string
  memo?: string
}

export interface CreateOrderResponse extends Order {
  stripePaymentUrl?: string
}

export async function createOrder(orderData: CreateOrderRequest): Promise<CreateOrderResponse> {
  const response = await fetch("/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  })

  if (!response.ok) {
    throw new Error("Failed to create order")
  }

  return response.json()
}

export async function getClientOrders(clientId: string): Promise<Order[]> {
  const response = await fetch(`/api/orders?clientId=${clientId}`)

  if (!response.ok) {
    throw new Error("Failed to fetch orders")
  }

  return response.json()
}
