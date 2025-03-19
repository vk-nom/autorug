"use client"

import { useState } from "react"
import { Wallet, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"

interface Step3Props {
  formData: {
    walletConnected: boolean
  }
  updateFormData: (data: Partial<(typeof Step3Props)["formData"]>) => void
}

export default function Step3ConnectWallet({ formData, updateFormData }: Step3Props) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const { toast } = useToast()

  const generateSolanaAddress = () => {
    const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
    let address = ""
    for (let i = 0; i < 44; i++) {
      address += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return address
  }

  const connectWallet = () => {
    setIsConnecting(true)

    // Generate a random Solana address
    const address = generateSolanaAddress()

    // Simulate longer connection delay
    setTimeout(() => {
      setWalletAddress(address)
      updateFormData({ walletConnected: true })
      setIsConnecting(false)

      // Show toast notification
      toast({
        variant: "success",
        title: "Wallet connected!",
        description: "Your wallet has been successfully connected.",
      })
    }, 4000) // Longer delay of 4 seconds
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Connect Your Wallet</h2>
            <p className="text-muted-foreground mb-6">
              Connect your wallet to continue with the memecoin creation process.
            </p>
          </div>

          <Alert className="border-amber-500/20 bg-amber-500/10">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <AlertTitle className="text-amber-500">Important Notice</AlertTitle>
            <AlertDescription>
              You are connecting your wallet to AutoRug. Make sure you trust this site before proceeding.
            </AlertDescription>
          </Alert>

          <div className="flex justify-center py-6">
            {formData.walletConnected ? (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                  <Wallet className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="font-medium text-lg">Wallet Connected</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-4">Your wallet is ready to use</p>

                {walletAddress && (
                  <div className="mt-2 p-4 border border-green-500/20 bg-green-500/10 rounded-lg w-full max-w-sm">
                    <div className="flex items-center justify-center">
                      <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mr-3">
                        <Wallet className="h-4 w-4 text-green-500" />
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
              <Button
                size="lg"
                className="relative bg-primary/90 hover:bg-primary"
                disabled={isConnecting}
                onClick={connectWallet}
              >
                {isConnecting ? (
                  <div className="flex items-center">
                    <WalletConnectingAnimation />
                    <span className="ml-2">Connecting...</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Wallet className="mr-2 h-4 w-4" />
                    Connect Wallet
                  </div>
                )}
              </Button>
            )}
          </div>

          <div className="text-sm text-muted-foreground">
            <p className="mb-2">By connecting your wallet, you agree to our Terms of Service and Privacy Policy.</p>
            <p>Your wallet will be used to sign transactions when creating your memecoin and adding liquidity.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function WalletConnectingAnimation() {
  return (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-primary-foreground rounded-full"
          animate={{
            y: ["0%", "-50%", "0%"],
          }}
          transition={{
            duration: 0.5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            delay: i * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

