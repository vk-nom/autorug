"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define user type
export interface User {
  id: string
  username: string
  name?: string
}

// Define auth context type
interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<boolean>
  register: (username: string, password: string, name?: string) => Promise<boolean>
  logout: () => void
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth provider props
interface AuthProviderProps {
  children: ReactNode
}

// Generate a unique ID for users
const generateId = () => Math.random().toString(36).substring(2, 15)

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem("autorug_current_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  // Register a new user
  const register = async (username: string, password: string, name?: string): Promise<boolean> => {
    try {
      // Check if user already exists
      const users = JSON.parse(localStorage.getItem("autorug_users") || "[]")
      const existingUser = users.find((u: any) => u.username === username)

      if (existingUser) {
        throw new Error("User already exists")
      }

      // Create new user
      const newUser = {
        id: generateId(),
        username,
        name: name || username,
        passwordHash: btoa(password), // Simple encoding, not secure for production
      }

      // Save user to localStorage
      localStorage.setItem("autorug_users", JSON.stringify([...users, newUser]))

      // Set current user (without password)
      const userWithoutPassword = { id: newUser.id, username: newUser.username, name: newUser.name }
      localStorage.setItem("autorug_current_user", JSON.stringify(userWithoutPassword))
      setUser(userWithoutPassword)

      return true
    } catch (error) {
      console.error("Registration error:", error)
      return false
    }
  }

  // Login user
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem("autorug_users") || "[]")

      // Find user by username
      const user = users.find((u: any) => u.username === username)

      // Check if user exists and password matches
      if (!user || user.passwordHash !== btoa(password)) {
        throw new Error("Invalid username or password")
      }

      // Set current user (without password)
      const userWithoutPassword = { id: user.id, username: user.username, name: user.name }
      localStorage.setItem("autorug_current_user", JSON.stringify(userWithoutPassword))
      setUser(userWithoutPassword)

      return true
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  // Logout user
  const logout = () => {
    localStorage.removeItem("autorug_current_user")
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

