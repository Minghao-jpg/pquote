"use client"

import type React from "react"

import { useState } from "react"
import type { Order } from "@/lib/data"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Package,
  DollarSign,
  Clock,
  RefreshCw,
  Truck,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Plane,
  Ship,
  FileText,
  PackageOpen,
} from "lucide-react"

interface OrderDetailsDialogProps {
  order: Order
  trigger: React.ReactNode
}

export function OrderDetailsDialog({ order, trigger }: OrderDetailsDialogProps) {
  const [isOpen, setIsOpen] = useState(false)

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

  const getShippingIcon = (method: "air" | "ocean") => {
    return method === "air" ? <Plane className="h-4 w-4" /> : <Ship className="h-4 w-4" />
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getStatusDescription = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "Your order has been received and is being processed."
      case "in-production":
        return "Your order is currently being produced."
      case "shipped":
        return "Your order has been shipped and is on its way."
      case "delivered":
        return "Your order has been successfully delivered."
      default:
        return "Order status unknown."
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>Order #{order.id}</span>
          </DialogTitle>
          <DialogDescription>Placed on {formatDate(order.orderDate)}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Order Status</h3>
              <Badge variant={getStatusVariant(order.status)} className="flex items-center space-x-1">
                {getStatusIcon(order.status)}
                <span className="capitalize">{order.status.replace("-", " ")}</span>
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{getStatusDescription(order.status)}</p>
          </div>

          <Separator />

          <div className="space-y-3">
            <h3 className="font-medium">Shipping Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  {getShippingIcon(order.shippingMethod)}
                  <span className="font-medium capitalize">{order.shippingMethod} Shipping</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {order.shippingMethod === "air" ? "4-7 business days" : "2 months"}
                </p>
              </div>
              {order.estimatedDelivery && (
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Truck className="h-4 w-4" />
                    <span className="font-medium">Estimated Delivery</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{formatDate(order.estimatedDelivery)}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Items Section */}
          <div className="space-y-3">
            <h3 className="font-medium">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{item.itemName}</p>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity} × ${item.unitPrice.toFixed(2)} ({item.shippingMethod})
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${item.totalPrice.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {(order.memo || order.packagingNotes) && (
            <>
              <div className="space-y-3">
                <h3 className="font-medium">Order Notes</h3>
                {order.memo && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <FileText className="h-4 w-4 text-amber-600" />
                      <span className="font-medium text-amber-900">Order Memo</span>
                    </div>
                    <p className="text-sm text-amber-800">{order.memo}</p>
                  </div>
                )}
                {order.packagingNotes && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <PackageOpen className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-900">Packaging Notes</span>
                    </div>
                    <p className="text-sm text-green-800">{order.packagingNotes}</p>
                  </div>
                )}
              </div>
              <Separator />
            </>
          )}

          {/* Payment & Total Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Payment Status</h3>
              <Badge
                variant={
                  order.paymentStatus === "paid"
                    ? "default"
                    : order.paymentStatus === "processing"
                      ? "secondary"
                      : "destructive"
                }
                className="flex items-center space-x-1"
              >
                <CreditCard className="h-4 w-4" />
                <span className="capitalize">{order.paymentStatus}</span>
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Total Amount</span>
              </div>
              <span className="text-xl font-semibold">${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {order.paymentStatus === "unpaid" && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                Payment is required to proceed with production. Please contact our team to arrange payment.
              </p>
            </div>
          )}

          {order.paymentStatus === "processing" && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                Your payment is being processed. We'll update the status once payment is confirmed.
              </p>
            </div>
          )}

          {order.stripePaymentIntentId && (
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-xs text-gray-600">Payment ID: {order.stripePaymentIntentId}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
