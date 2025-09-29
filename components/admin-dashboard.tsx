"use client"

const money = (n: number | null | undefined) =>
  new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', minimumFractionDigits: 2 })
    .format(Number(n ?? 0));

const int = (n: number | null | undefined) => Number(n ?? 0);

import { useState, useEffect } from "react"
import { mockInventory, mockClients, type Order, type InventoryItem, type Client } from "@/lib/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, ShoppingCart, DollarSign, Clock, RefreshCw, Truck, CheckCircle, Edit, Save, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory)
  const [clients] = useState<Client[]>(mockClients)
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<Partial<InventoryItem>>({})
  const { toast } = useToast()

  useEffect(() => {
    // Load all orders from all clients
    loadAllOrders()
  }, [])

  const loadAllOrders = async () => {
    try {
      // In production, this would fetch from your backend
      const allOrders: Order[] = [
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
      setOrders(allOrders)
    } catch (error) {
      console.error("Failed to load orders:", error)
    }
  }

  const getClientName = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId)
    return client ? client.name : "Unknown Client"
  }

  const getClientCompany = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId)
    return client ? client.company : "Unknown Company"
  }

  const updateOrderStatus = async (orderId: string, newStatus: Order["status"]) => {
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))

    toast({
      title: "Order updated",
      description: `Order #${orderId} status changed to ${newStatus.replace("-", " ")}`,
    })
  }

  const updatePaymentStatus = async (orderId: string, newStatus: Order["paymentStatus"]) => {
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, paymentStatus: newStatus } : order)))

    toast({
      title: "Payment updated",
      description: `Order #${orderId} payment status changed to ${newStatus}`,
    })
  }

  const startEditing = (item: InventoryItem) => {
    setEditingItem(item.id)
    setEditValues(item)
  }

  const saveInventoryItem = () => {
    if (!editingItem || !editValues) return

    setInventory((prev) => prev.map((item) => (item.id === editingItem ? { ...item, ...editValues } : item)))

    setEditingItem(null)
    setEditValues({})

    toast({
      title: "Inventory updated",
      description: "Item has been successfully updated",
    })
  }

  const cancelEditing = () => {
    setEditingItem(null)
    setEditValues({})
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
        return <Clock className="h-4 w-4" />
    }
  }

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0)
  const pendingOrders = orders.filter((order) => order.status === "pending").length
  const unpaidOrders = orders.filter((order) => order.paymentStatus === "unpaid").length

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-semibold text-sm">PPP</span>
              </div>
              <span className="font-semibold text-foreground">Admin Dashboard</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage orders, inventory, and clients</p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{money(totalRevenue)}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{orders.length}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingOrders}</div>
                <p className="text-xs text-muted-foreground">Needs attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{clients.length}</div>
                <p className="text-xs text-muted-foreground">Registered</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="orders" className="space-y-4">
            <TabsList>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="clients">Clients</TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>All Orders</CardTitle>
                  <CardDescription>Manage and track all client orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 border border-border rounded-lg"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-4">
                            <span className="font-medium">Order #{order.id}</span>
                            <Badge variant="outline">{getClientName(order.clientId)}</Badge>
                            <span className="text-sm text-muted-foreground">{getClientCompany(order.clientId)}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {(order.items ?? []).map((item) => item.itemName).join(", ")} • {money(order.totalAmount)} •{" "}
                            {order.orderDate}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Select
                            value={order.status}
                            onValueChange={(value) => updateOrderStatus(order.id, value as Order["status"])}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="in-production">In Production</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                            </SelectContent>
                          </Select>
                          <Select
                            value={order.paymentStatus}
                            onValueChange={(value) => updatePaymentStatus(order.id, value as Order["paymentStatus"])}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="unpaid">Unpaid</SelectItem>
                              <SelectItem value="paid">Paid</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="inventory" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Inventory Management</CardTitle>
                  <CardDescription>Update stock quantities and pricing</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {inventory.map((item) => (
                      <div key={item.id} className="p-4 border border-border rounded-lg">
                        {editingItem === item.id ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="name">Item Name</Label>
                                <Input
                                  id="name"
                                  value={editValues.name || ""}
                                  onChange={(e) => setEditValues((prev) => ({ ...prev, name: e.target.value }))}
                                />
                              </div>
                              <div>
                                <Label htmlFor="stockQuantity">Stock Quantity</Label>
                                <Input
                                  id="stockQuantity"
                                  type="number"
                                  value={editValues.stockQuantity || 0}
                                  onChange={(e) =>
                                    setEditValues((prev) => ({
                                      ...prev,
                                      stockQuantity: Number.parseInt(e.target.value) || 0,
                                    }))
                                  }
                                />
                              </div>
                              <div>
                                <Label htmlFor="unitPrice">Unit Price</Label>
                                <Input
                                  id="unitPrice"
                                  type="number"
                                  step="0.01"
                                  value={editValues.unitPrice || 0}
                                  onChange={(e) =>
                                    setEditValues((prev) => ({
                                      ...prev,
                                      unitPrice: Number.parseFloat(e.target.value) || 0,
                                    }))
                                  }
                                />
                              </div>
                              <div>
                                <Label htmlFor="moq">MOQ</Label>
                                <Input
                                  id="moq"
                                  type="number"
                                  value={editValues.moq || 0}
                                  onChange={(e) =>
                                    setEditValues((prev) => ({ ...prev, moq: Number.parseInt(e.target.value) || 0 }))
                                  }
                                />
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button onClick={saveInventoryItem} size="sm">
                                <Save className="mr-2 h-4 w-4" />
                                Save
                              </Button>
                              <Button onClick={cancelEditing} variant="outline" size="sm">
                                <X className="mr-2 h-4 w-4" />
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="font-medium">{item.name}</div>
                              <div className="text-sm text-muted-foreground">
                                Stock: {int(item.stockQuantity)} • Price: {money(item.unitPrice)} • MOQ: {int(item.moq)}
                              </div>
                            </div>
                            <Button onClick={() => startEditing(item)} variant="outline" size="sm">
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="clients" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Client Management</CardTitle>
                  <CardDescription>View and manage client accounts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {clients.map((client) => {
                      const clientOrders = orders.filter((order) => order.clientId === client.id)
                      const clientRevenue = clientOrders.reduce((sum, order) => sum + order.totalAmount, 0)

                      return (
                        <div
                          key={client.id}
                          className="flex items-center justify-between p-4 border border-border rounded-lg"
                        >
                          <div className="space-y-1">
                            <div className="font-medium">{client.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {client.company} • {client.email}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{money(clientRevenue)}</div>
                            <div className="text-sm text-muted-foreground">{clientOrders.length} orders</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
