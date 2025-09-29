import { mockClients, type Client } from "./data"

export interface AuthSession {
  client: Client
  isAuthenticated: boolean
}

// Simple authentication for MVP - replace with proper auth later
export function authenticateClient(email: string, password: string): Client | null {
  const client = mockClients.find((c) => c.email === email && c.password === password)
  return client || null
}

export function getClientById(id: string): Client | null {
  return mockClients.find((c) => c.id === id) || null
}
