import { type NextRequest, NextResponse } from "next/server"
import { mockInventory, type InventoryItem } from "@/lib/data"

// In production, this would connect to your actual database
const inventory: InventoryItem[] = [...mockInventory]

export async function GET() {
  return NextResponse.json(inventory)
}

export async function PATCH(request: NextRequest) {
  try {
    const updatedItem: InventoryItem = await request.json()

    const itemIndex = inventory.findIndex((item) => item.id === updatedItem.id)
    if (itemIndex === -1) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    inventory[itemIndex] = updatedItem

    // In production, you would:
    // 1. Update database
    // 2. Log inventory changes
    // 3. Send low stock alerts if needed
    // 4. Update pricing across all systems

    return NextResponse.json(inventory[itemIndex])
  } catch (error) {
    return NextResponse.json({ error: "Failed to update inventory" }, { status: 500 })
  }
}
