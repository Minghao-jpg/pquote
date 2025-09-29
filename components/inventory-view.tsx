"use client"

import { useState } from "react"
import { mockInventory, type InventoryItem } from "@/lib/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Package, ShoppingCart, AlertCircle, Plane, Ship } from "lucide-react"
import { OrderDialog } from "@/components/order-dialog"

export function InventoryView() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)

  const filteredInventory = mockInventory.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { label: "Out of Stock", variant: "destructive" as const }
    if (quantity < 100) return { label: "Low Stock", variant: "secondary" as const }
    return { label: "In Stock", variant: "default" as const }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Label htmlFor="search" className="sr-only">
            Search inventory
          </Label>
          <Input
            id="search"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredInventory.map((item) => {
          const stockStatus = getStockStatus(item.stockQuantity)

          return (
            <Card key={item.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                  </div>
                  <Badge variant={stockStatus.variant} className="text-xs">
                    {stockStatus.label}
                  </Badge>
                </div>
                {item.description && <CardDescription className="text-sm">{item.description}</CardDescription>}
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Stock Quantity</p>
                    <p className="font-medium">{item.stockQuantity.toLocaleString()}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Pricing</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded">
                        <div className="flex items-center space-x-2">
                          <Plane className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-900">Air (4-7 days)</span>
                        </div>
                        <span className="font-medium text-blue-900">${item.airPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded">
                        <div className="flex items-center space-x-2">
                          <Ship className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-900">Ocean (2 months)</span>
                        </div>
                        <span className="font-medium text-green-900">${item.oceanPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <AlertCircle className="h-4 w-4" />
                  <span>MOQ: {item.moq} units</span>
                </div>

                <OrderDialog
                  item={item}
                  trigger={
                    <Button className="w-full" disabled={item.stockQuantity === 0}>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Place Order
                    </Button>
                  }
                />
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredInventory.length === 0 && (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No items found</h3>
          <p className="text-muted-foreground">
            {searchTerm ? "Try adjusting your search terms." : "No inventory items available."}
          </p>
        </div>
      )}
    </div>
  )
}
