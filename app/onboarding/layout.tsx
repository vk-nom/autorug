"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Inter } from "next/font/google"
import "../globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { useAuth } from "@/contexts/auth-context"
import { Loader2 } from "lucide-react"

const inter = Inter({ subsets: ["latin"] })

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <html lang="en" className="dark" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider>
            <div className="min-h-screen bg-background flex items-center justify-center">
              <div className="flex flex-col items-center">
                <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground">Loading...</p>
              </div>
            </div>
          </ThemeProvider>
        </body>
      </html>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
              <header className="mb-8">
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-primary">AutoRug</div>
                  <div className="text-sm text-muted-foreground">
                    Logged in as <span className="font-medium text-foreground">{user.name || user.username}</span>
                  </div>
                </div>
              </header>
              <main>{children}</main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

