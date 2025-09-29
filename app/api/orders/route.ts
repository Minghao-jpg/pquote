import { type NextRequest, NextResponse } from "next/server"
import type { Order } from "@/lib/data"
import { mockOrders } from "@/lib/data"

const orders: Order[] = [...mockOrders]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const clientId = searchParams.get("clientId")

  if (!clientId) {
    return NextResponse.json({ error: "Client ID is required" }, { status: 400 })
  }

  const clientOrders = orders.filter((order) => order.clientId === clientId)
  return NextResponse.json(clientOrders)
}

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json()

    const newOrder: Order = {
      id: Date.now().toString(),
      clientId: orderData.clientId,
      items: orderData.items,
      status: "pending",
      totalAmount: orderData.totalAmount,
      orderDate: new Date().toISOString().split("T")[0],
      paymentStatus: "processing",
      shippingMethod: orderData.shippingMethod,
      estimatedDelivery: orderData.estimatedDelivery,
      memo: orderData.memo,
      packagingNotes: "Standard packaging - will be updated by production team",
    }

    const stripePaymentUrl = `https://checkout.stripe.com/pay/cs_test_${Date.now()}`

    orders.push(newOrder)

    return NextResponse.json({
      ...newOrder,
      stripePaymentUrl,
    })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
