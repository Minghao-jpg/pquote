"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-guard"
import { getClientOrders } from "@/lib/api"
import type { Order } from "@/lib/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Package,
  Calendar,
  DollarSign,
  Eye,
  Truck,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Plane,
  Ship,
} from "lucide-react"
import { OrderDetailsDialog } from "@/components/order-details-dialog"

export function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const { client } = useAuth()

  useEffect(() => {
    if (client) {
      loadOrders()
    }
  }, [client])

  const loadOrders = async () => {
    if (!client) return

    try {
      setIsLoading(true)
      const clientOrders = await getClientOrders(client.id)
      setOrders(clientOrders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()))
    } catch (error) {
      console.error("Failed to load orders:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "in-production":
        return <RefreshCw className="h-4 w-4" />
      case "shipped":
        return <Truck className="h-4 w-4" />
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getStatusVariant = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "secondary" as const
      case "in-production":
        return "default" as const
      case "shipped":
        return "default" as const
      case "delivered":
        return "default" as const
      default:
        return "secondary" as const
    }
  }

  const getPaymentStatusVariant = (status: Order["paymentStatus"]) => {
    switch (status) {
      case "paid":
        return "default" as const
      case "processing":
        return "secondary" as const
      default:
        return "destructive" as const
    }
  }

  const getShippingIcon = (method: "air" | "ocean") => {
    return method === "air" ? <Plane className="h-4 w-4" /> : <Ship className="h-4 w-4" />
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading orders...</p>
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No orders yet</h3>
        <p className="text-muted-foreground mb-4">
          You haven't placed any orders yet. Browse our inventory to get started.
        </p>
        <Button onClick={() => (window.location.href = "/dashboard")}>Browse Inventory</Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                <CardDescription className="flex items-center space-x-4 mt-1">
                  <span className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(order.orderDate)}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <DollarSign className="h-4 w-4" />
                    <span>${order.totalAmount.toFixed(2)}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    {getShippingIcon(order.shippingMethod)}
                    <span className="capitalize">{order.shippingMethod} Shipping</span>
                  </span>
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={getStatusVariant(order.status)} className="flex items-center space-x-1">
                  {getStatusIcon(order.status)}
                  <span className="capitalize">{order.status.replace("-", " ")}</span>
                </Badge>
                <Badge variant={getPaymentStatusVariant(order.paymentStatus)}>
                  {order.paymentStatus === "paid"
                    ? "Paid"
                    : order.paymentStatus === "processing"
                      ? "Processing"
                      : "Unpaid"}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Items</h4>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span>{item.itemName}</span>
                      <span className="text-muted-foreground">
                        {item.quantity} × ${item.unitPrice.toFixed(2)} = ${item.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {order.estimatedDelivery && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Truck className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">
                      Estimated Delivery: {formatDate(order.estimatedDelivery)}
                    </span>
                  </div>
                </div>
              )}

              {order.memo && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">
                    <strong>Note:</strong> {order.memo}
                  </p>
                </div>
              )}

              <Separator />

              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Status: <span className="capitalize">{order.status.replace("-", " ")}</span>
                </div>
                <OrderDetailsDialog
                  order={order}
                  trigger={
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
