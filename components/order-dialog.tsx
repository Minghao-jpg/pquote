"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/components/auth-guard"
import type { InventoryItem } from "@/lib/data"
import { shippingMethods } from "@/lib/data"
import { createOrder } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, Calculator, CheckCircle, Truck, Plane, Ship, CreditCard } from "lucide-react"

interface OrderDialogProps {
  item: InventoryItem
  trigger: React.ReactNode
}

export function OrderDialog({ item, trigger }: OrderDialogProps) {
  const [quantity, setQuantity] = useState(item.moq)
  const [shippingMethod, setShippingMethod] = useState<"air" | "ocean">("ocean")
  const [memo, setMemo] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { client } = useAuth()
  const { toast } = useToast()

  const unitPrice = shippingMethod === "air" ? item.airPrice : item.oceanPrice
  const totalPrice = quantity * unitPrice
  const isValidQuantity = quantity >= item.moq && quantity <= item.stockQuantity

  const getEstimatedDelivery = () => {
    const today = new Date()
    if (shippingMethod === "air") {
      today.setDate(today.getDate() + 7) // 7 days for air
    } else {
      today.setDate(today.getDate() + 60) // 60 days for ocean
    }
    return today.toLocaleDateString()
  }

  const handleSubmit = async () => {
    if (!client || !isValidQuantity) return

    setIsSubmitting(true)

    try {
      const orderData = {
        clientId: client.id,
        items: [
          {
            itemId: item.id,
            itemName: item.name,
            quantity,
            unitPrice,
            totalPrice,
            shippingMethod,
          },
        ],
        totalAmount: totalPrice,
        shippingMethod,
        estimatedDelivery: getEstimatedDelivery(),
        memo: memo.trim() || undefined,
      }

      const order = await createOrder(orderData)

      if (order.stripePaymentUrl) {
        window.location.href = order.stripePaymentUrl
      } else {
        toast({
          title: "Order placed successfully",
          description: `Your order for ${quantity} ${item.name} has been submitted.`,
          action: (
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Order #${order.id}</span>
            </div>
          ),
        })

        setIsOpen(false)
        setQuantity(item.moq)
        setMemo("")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Place Order</DialogTitle>
          <DialogDescription>
            Order {item.name} for {client?.company}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label>Shipping Method</Label>
            <Select value={shippingMethod} onValueChange={(value: "air" | "ocean") => setShippingMethod(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ocean">
                  <div className="flex items-center space-x-2">
                    <Ship className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Ocean Shipping</div>
                      <div className="text-sm text-muted-foreground">2 months • ${item.oceanPrice.toFixed(2)}/unit</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="air">
                  <div className="flex items-center space-x-2">
                    <Plane className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Air Shipping</div>
                      <div className="text-sm text-muted-foreground">
                        4-7 business days • ${item.airPrice.toFixed(2)}/unit
                      </div>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Unit Price ({shippingMethod})</p>
              <p className="font-medium">${unitPrice.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Available Stock</p>
              <p className="font-medium">{item.stockQuantity.toLocaleString()}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min={item.moq}
              max={item.stockQuantity}
              value={quantity}
              onChange={(e) => setQuantity(Number.parseInt(e.target.value) || item.moq)}
            />
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              <span>Minimum order: {item.moq} units</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="memo">Order Notes (Optional)</Label>
            <Textarea
              id="memo"
              placeholder="Special instructions, packaging requirements, etc."
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              rows={3}
            />
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Truck className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-900">Delivery Information</span>
            </div>
            <p className="text-sm text-blue-800">
              Estimated delivery: <strong>{getEstimatedDelivery()}</strong>
            </p>
            <p className="text-sm text-blue-700 mt-1">
              {shippingMethods[shippingMethod].deliveryTime} via {shippingMethods[shippingMethod].name}
            </p>
          </div>

          <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
            <div className="flex items-center space-x-2">
              <Calculator className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Total Amount</span>
            </div>
            <span className="text-lg font-semibold">${totalPrice.toFixed(2)}</span>
          </div>

          {!isValidQuantity && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">
                {quantity < item.moq
                  ? `Quantity must be at least ${item.moq} units`
                  : `Quantity cannot exceed ${item.stockQuantity} units`}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!isValidQuantity || isSubmitting}>
            <CreditCard className="mr-2 h-4 w-4" />
            {isSubmitting ? "Processing..." : "Proceed to Payment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
