"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2 } from "lucide-react"
import Step1CreateCoin from "./components/Step1CreateCoin"
import Step1bSocialMedia from "./components/Step1bSocialMedia"
import Step2SelectPlatform from "./components/Step2SelectPlatform"
import Step3ConnectWallet from "./components/Step3ConnectWallet"
import Step4AddLiquidity from "./components/Step4AddLiquidity"
import SuccessPage from "./components/SuccessPage"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import LoadingStep from "./components/LoadingStep"

// Generate a random ID
const generateId = () => Math.random().toString(36).substring(2, 15)

export default function OnboardingPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    id: generateId(),
    name: "",
    image: null as File | null,
    description: "",
    platform: "",
    walletConnected: false,
    liquidityAmount: 0,
    socialLinks: {} as {
      website?: string
      telegram?: string
      discord?: string
      reddit?: string
      twitter?: string
      tiktok?: string
    },
  })

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
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const totalSteps = 6
  const progress = (currentStep / totalSteps) * 100

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  // Validate each step
  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
        // Validate Step 1: Name is required
        if (!formData.name.trim()) {
          toast({
            title: "Missing information",
            description: "Please enter a name for your coin",
            variant: "destructive",
          })
          return false
        }
        return true

      case 2:
        // Validation for Step 1b (Social Media) is handled separately. Always considered valid for now.
        return true

      case 3:
        // Validate Step 2: Platform is required
        if (!formData.platform) {
          toast({
            title: "Missing information",
            description: "Please select a platform for your coin",
            variant: "destructive",
          })
          return false
        }
        return true

      case 4:
        // This step is now a loading step, so no validation is needed
        return true

      case 5:
        // Validate Step 3: Wallet must be connected
        if (!formData.walletConnected) {
          toast({
            title: "Wallet not connected",
            description: "Please connect your wallet to continue",
            variant: "destructive",
          })
          return false
        }
        return true

      case 6:
        // Validate Step 4: Liquidity amount must be greater than 0
        if (formData.liquidityAmount <= 0) {
          toast({
            title: "Invalid liquidity",
            description: "Please add some liquidity to your coin",
            variant: "destructive",
          })
          return false
        }
        return true

      default:
        return true
    }
  }

  const nextStep = () => {
    // Validate current step before proceeding
    if (!validateCurrentStep()) {
      return
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      // Show success page and save coin data
      setCurrentStep(totalSteps + 1)

      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please login to create a coin",
          variant: "destructive",
        })
        router.push("/")
        return
      }

      // Create coin data for storage - simplified with only necessary fields
      const coinData = {
        id: formData.id,
        userId: user.id, // Associate coin with current user
        name: formData.name || "Unnamed Coin",
        image: formData.image ? URL.createObjectURL(formData.image) : "/placeholder.svg?height=40&width=40",
        investment: formData.liquidityAmount, // Store only the actual investment amount
        profit: 0, // Set initial profit to 0
        platform: formData.platform === "raydium" ? "Raydium" : "Pump.fun",
        createdAt: new Date(),
        pnl: 0, // Set initial PNL to 0
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

      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        router.push("/dashboard")
      }, 3000)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1CreateCoin formData={formData} updateFormData={updateFormData} />
      case 2:
        return <Step1bSocialMedia formData={formData} updateFormData={updateFormData} />
      case 3:
        return <Step2SelectPlatform formData={formData} updateFormData={updateFormData} />
      case 4:
        return <LoadingStep />
      case 5:
        return <Step3ConnectWallet formData={formData} updateFormData={updateFormData} />
      case 6:
        return <Step4AddLiquidity formData={formData} updateFormData={updateFormData} />
      case 7:
        return <SuccessPage />
      default:
        return null
    }
  }

  // Check if current step is valid
  const isCurrentStepValid = (): boolean => {
    switch (currentStep) {
      case 1:
        return !!formData.name.trim()
      case 2:
        return true // Social media links are optional, so always valid
      case 3:
        return !!formData.platform
      case 4:
        return true // Loading step, always valid
      case 5:
        return formData.walletConnected
      case 6:
        return formData.liquidityAmount > 0
      default:
        return true
    }
  }

  const isLastStep = currentStep === totalSteps
  const isFirstStep = currentStep === 1
  const isSuccessPage = currentStep > totalSteps

  useEffect(() => {
    if (currentStep === 4) {
      // Wait for 6 seconds after loading is complete before navigating
      const timer = setTimeout(() => {
        setCurrentStep(5)
      }, 12000) // 6s for loading + 6s for success screen

      return () => clearTimeout(timer)
    }
  }, [currentStep])

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
    <div className="max-w-3xl mx-auto px-4">
      {!isSuccessPage && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold">Create Your Memecoin</h1>
            <div className="text-sm text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </div>
          </div>
          <Progress value={progress} className="h-2 bg-secondary/50" indicatorClassName="bg-primary/90" />
          <div className="flex justify-between mt-2">
            <div className="text-sm text-muted-foreground">Start</div>
            <div className="text-sm text-muted-foreground">Finish</div>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>

      {!isSuccessPage && currentStep !== 4 && (
        <div className="mt-8 flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={isFirstStep}
            className={isFirstStep ? "invisible" : ""}
          >
            Previous
          </Button>
          <div className="flex gap-2">
            {currentStep === 2 && (
              <Button variant="outline" onClick={nextStep}>
                Skip
              </Button>
            )}
            <Button onClick={nextStep} className="bg-primary/90 hover:bg-primary" disabled={!isCurrentStepValid()}>
              {isLastStep ? "Finish" : "Next"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

