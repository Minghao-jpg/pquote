// Mock database structure for MVP - can be replaced with Google Sheets/Airtable later
export interface Client {
  id: string
  name: string
  email: string
  password: string // In production, this would be hashed
  company: string
  accountBalance: number
  credits: number
}

export interface InventoryItem {
  id: string
  name: string
  stockQuantity: number
  moq: number // Minimum Order Quantity
  airPrice: number
  oceanPrice: number
  description?: string
}

export interface Order {
  id: string
  clientId: string
  items: OrderItem[]
  status: "pending" | "in-production" | "shipped" | "delivered"
  totalAmount: number
  orderDate: string
  paymentStatus: "unpaid" | "paid" | "processing"
  shippingMethod: "air" | "ocean"
  estimatedDelivery: string
  memo?: string
  packagingNotes?: string
  stripePaymentIntentId?: string
}

export interface OrderItem {
  itemId: string
  itemName: string
  quantity: number
  unitPrice: number
  totalPrice: number
  shippingMethod: "air" | "ocean"
}

// Mock data for MVP
export const mockClients: Client[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john@acmecorp.com",
    password: "password123",
    company: "Acme Corporation",
    accountBalance: 2450.75,
    credits: 150,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@techstart.com",
    password: "password123",
    company: "TechStart Inc",
    accountBalance: 1200.0,
    credits: 75,
  },
]

export const mockInventory: InventoryItem[] = [
  {
    id: "1",
    name: "Premium Business Cards",
    stockQuantity: 5000,
    moq: 100,
    airPrice: 0.35,
    oceanPrice: 0.25,
    description: "High-quality matte finish business cards",
  },
  {
    id: "2",
    name: "Corporate Brochures",
    stockQuantity: 2000,
    moq: 50,
    airPrice: 3.25,
    oceanPrice: 2.5,
    description: "Tri-fold corporate brochures, full color",
  },
  {
    id: "3",
    name: "Trade Show Banners",
    stockQuantity: 150,
    moq: 1,
    airPrice: 110.0,
    oceanPrice: 85.0,
    description: "Retractable banner stands with custom graphics",
  },
  {
    id: "4",
    name: "Promotional Flyers",
    stockQuantity: 8000,
    moq: 250,
    airPrice: 0.2,
    oceanPrice: 0.15,
    description: "Single-sided promotional flyers",
  },
]

export const mockOrders: Order[] = [
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
        shippingMethod: "ocean",
      },
    ],
    status: "delivered",
    totalAmount: 125.0,
    orderDate: "2024-01-15",
    paymentStatus: "paid",
    shippingMethod: "ocean",
    estimatedDelivery: "2024-03-15",
    memo: "Rush order for trade show",
    packagingNotes: "Pack in branded boxes, include company brochure",
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
        shippingMethod: "ocean",
      },
    ],
    status: "in-production",
    totalAmount: 250.0,
    orderDate: "2024-01-20",
    paymentStatus: "unpaid",
    shippingMethod: "ocean",
    estimatedDelivery: "2024-03-20",
    packagingNotes: "Standard packaging",
  },
]

export const shippingMethods = {
  air: {
    name: "Air Shipping",
    deliveryTime: "4-7 business days",
    description: "Fast delivery via air freight",
  },
  ocean: {
    name: "Ocean Shipping",
    deliveryTime: "2 months",
    description: "Economical shipping via ocean freight",
  },
} as const
