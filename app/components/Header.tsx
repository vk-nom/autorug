"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import AuthModal from "./AuthModal"

export default function Header() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "register">("login")

  const openLoginModal = () => {
    setAuthMode("login")
    setIsAuthModalOpen(true)
  }

  const openRegisterModal = () => {
    setAuthMode("register")
    setIsAuthModalOpen(true)
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
          <nav className="hidden md:flex space-x-10"></nav>
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="hidden sm:inline-flex" onClick={openLoginModal}>
              Login
            </Button>
            <Button onClick={openRegisterModal}>Join Us!</Button>
          </div>
        </div>
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} mode={authMode} />
    </header>
  )
}

