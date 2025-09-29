"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { Client } from "@/lib/data"

interface AuthGuardProps {
  children: React.ReactNode
  redirectTo?: string
}

export function AuthGuard({ children, redirectTo = "/" }: AuthGuardProps) {
  const [client, setClient] = useState<Client | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const sessionData = localStorage.getItem("clientSession")

    if (sessionData) {
      try {
        const clientData = JSON.parse(sessionData) as Client
        setClient(clientData)
      } catch (error) {
        console.error("Invalid session data:", error)
        localStorage.removeItem("clientSession")
        router.push(redirectTo)
      }
    } else {
      router.push(redirectTo)
    }

    setIsLoading(false)
  }, [router, redirectTo])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!client) {
    return null
  }

  return <>{children}</>
}

export function useAuth() {
  const [client, setClient] = useState<Client | null>(null)
  const router = useRouter()

  useEffect(() => {
    const sessionData = localStorage.getItem("clientSession")
    if (sessionData) {
      try {
        const clientData = JSON.parse(sessionData) as Client
        setClient(clientData)
      } catch (error) {
        console.error("Invalid session data:", error)
        localStorage.removeItem("clientSession")
      }
    }
  }, [])

  const logout = () => {
    localStorage.removeItem("clientSession")
    setClient(null)
    router.push("/")
  }

  return { client, logout, isAuthenticated: !!client }
}
