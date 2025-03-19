"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function LoadingStep() {
  const [progress, setProgress] = useState(0)
  const [stage, setStage] = useState(1)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    // Simulate a loading process
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer)
          setIsComplete(true)
          return 100
        }

        // Update stage based on progress
        if (prevProgress < 25) {
          setStage(1)
        } else if (prevProgress < 50) {
          setStage(2)
        } else if (prevProgress < 75) {
          setStage(3)
        } else {
          setStage(4)
        }

        return prevProgress + 0.5 // Slow increment for longer loading
      })
    }, 50)

    return () => {
      clearInterval(timer)
    }
  }, [])

  // Get stage text based on current stage
  const getStageText = () => {
    switch (stage) {
      case 1:
        return "Creating coin..."
      case 2:
        return "Confirming transactions..."
      case 3:
        return "Signing transactions..."
      case 4:
        return "Launching coin..."
      default:
        return "Processing..."
    }
  }

  return (
    <Card>
      <CardContent className="pt-6 pb-8">
        <div className="flex flex-col items-center justify-center space-y-8">
          {isComplete ? (
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Coin Created Successfully!</h3>
              <p className="text-muted-foreground text-center max-w-md">
                Your coin has been created and is ready for the next steps.
              </p>
            </div>
          ) : (
            <>
              <div className="w-full max-w-md">
                <h3 className="text-xl font-semibold mb-6 text-center">Creating Your Coin</h3>
              </div>

              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
                </div>
                <div className="ml-4">
                  <p className="text-lg font-medium">{getStageText()}</p>
                  <p className="text-sm text-muted-foreground">Please wait while we process your request</p>
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

