"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import AuthModal from "./AuthModal"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function Header() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "register">("login")
  const router = useRouter()
  const { user } = useAuth()

  const openLoginModal = () => {
    setAuthMode("login")
    setIsAuthModalOpen(true)
  }

  const openRegisterModal = () => {
    setAuthMode("register")
    setIsAuthModalOpen(true)
  }

  const handleGetStarted = () => {
    if (user) {
      // If user is already logged in, navigate to onboarding
      router.push("/onboarding")
    } else {
      // If not logged in, open the auth modal with register mode
      setAuthMode("register")
      setIsAuthModalOpen(true)
    }
  }

  return (
    <header className="bg-background border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              AutoRug
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="hidden sm:inline-flex" onClick={openLoginModal}>
              Login
            </Button>
            <Button onClick={handleGetStarted}>Get Started</Button>
          </div>
        </div>
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} mode={authMode} />
    </header>
  )
}

