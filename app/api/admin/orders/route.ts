import { type NextRequest, NextResponse } from "next/server"
import type { Order } from "@/lib/data"

// In production, this would connect to your actual database
const orders: Order[] = [
  {
    id: "1",
    clientId: "1",
    items: [
      {
        itemId: "1",
        itemName: "Premium Business Cards",
        quantity: 500,
        unitPrice: 0.25,
        totalPrice: 125.0,
      },
    ],
    status: "delivered",
    totalAmount: 125.0,
    orderDate: "2024-01-15",
    paymentStatus: "paid",
  },
  {
    id: "2",
    clientId: "1",
    items: [
      {
        itemId: "2",
        itemName: "Corporate Brochures",
        quantity: 100,
        unitPrice: 2.5,
        totalPrice: 250.0,
      },
    ],
    status: "in-production",
    totalAmount: 250.0,
    orderDate: "2024-01-20",
    paymentStatus: "unpaid",
  },
  {
    id: "3",
    clientId: "2",
    items: [
      {
        itemId: "3",
        itemName: "Trade Show Banners",
        quantity: 2,
        unitPrice: 85.0,
        totalPrice: 170.0,
      },
    ],
    status: "pending",
    totalAmount: 170.0,
    orderDate: "2024-01-22",
    paymentStatus: "unpaid",
  },
]

export async function GET() {
  return NextResponse.json(orders)
}

export async function PATCH(request: NextRequest) {
  try {
    const { orderId, status, paymentStatus } = await request.json()

    const orderIndex = orders.findIndex((order) => order.id === orderId)
    if (orderIndex === -1) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    if (status) {
      orders[orderIndex].status = status
    }
    if (paymentStatus) {
      orders[orderIndex].paymentStatus = paymentStatus
    }

    // In production, you would:
    // 1. Update database
    // 2. Send notification emails
    // 3. Log the status change
    // 4. Update inventory if needed

    return NextResponse.json(orders[orderIndex])
  } catch (error) {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}
