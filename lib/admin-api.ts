import type { Order, InventoryItem } from "./data"

export async function getAllOrders(): Promise<Order[]> {
  const response = await fetch("/api/admin/orders")
  if (!response.ok) {
    throw new Error("Failed to fetch orders")
  }
  return response.json()
}

export async function updateOrderStatus(
  orderId: string,
  status?: Order["status"],
  paymentStatus?: Order["paymentStatus"],
): Promise<Order> {
  const response = await fetch("/api/admin/orders", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ orderId, status, paymentStatus }),
  })

  if (!response.ok) {
    throw new Error("Failed to update order")
  }

  return response.json()
}

export async function getInventory(): Promise<InventoryItem[]> {
  const response = await fetch("/api/admin/inventory")
  if (!response.ok) {
    throw new Error("Failed to fetch inventory")
  }
  return response.json()
}

export async function updateInventoryItem(item: InventoryItem): Promise<InventoryItem> {
  const response = await fetch("/api/admin/inventory", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  })

  if (!response.ok) {
    throw new Error("Failed to update inventory item")
  }

  return response.json()
}
