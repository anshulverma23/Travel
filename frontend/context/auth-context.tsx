"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { authApi, getToken, setToken, clearToken, ApiError } from "@/lib/api"
import type { User } from "@/lib/types"

interface AuthContextValue {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>
  loginWithGoogle: (idToken: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = async () => {
    const token = getToken()
    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }
    try {
      const { user } = await authApi.me()
      setUser(user)
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) clearToken()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const login = async (email: string, password: string) => {
    const { token, user } = await authApi.login({ email, password })
    setToken(token)
    setUser(user)
  }

  const register = async (name: string, email: string, password: string, phone?: string) => {
    const { token, user } = await authApi.register({ name, email, password, phone })
    setToken(token)
    setUser(user)
  }

  const loginWithGoogle = async (idToken: string) => {
    const { token, user } = await authApi.google(idToken)
    setToken(token)
    setUser(user)
  }

  const logout = () => {
    clearToken()
    setUser(null)
    authApi.logout().catch(() => {})
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider")
  return ctx
}
