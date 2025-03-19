"use client"

import { useState } from "react"
import { Coins } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

interface Step4Props {
  formData: {
    liquidityAmount: number
  }
  updateFormData: (data: Partial<{ liquidityAmount: number }>) => void
}

export default function Step4AddLiquidity({ formData, updateFormData }: Step4Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [amount, setAmount] = useState(formData.liquidityAmount.toString())
  const { toast } = useToast()
  // Add state for loading and success
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState(0)

  const openDialog = () => setIsDialogOpen(true)
  const closeDialog = () => setIsDialogOpen(false)

  // Update the handleSubmit function to close the dialog and update the form data
  const handleSubmit = () => {
    const liquidityAmount = Number.parseFloat(amount) || 0

    if (liquidityAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive",
      })
      return
    }

    setSelectedAmount(liquidityAmount)
    setIsLoading(true)

    // Simulate a longer loading time
    setTimeout(() => {
      setIsLoading(false)
      setIsSuccess(true)

      // After showing success for a while, update the form data and close dialog
      setTimeout(() => {
        updateFormData({ liquidityAmount: liquidityAmount })
        setIsSuccess(false)
        closeDialog()

        // Show toast notification
        toast({
          variant: "success",
          title: `${liquidityAmount} SOL of liquidity added!`,
          description: "Your memecoin is now ready for creation.",
        })
      }, 3000)
    }, 5000)
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Add Liquidity</h2>
            <p className="text-muted-foreground mb-6">
              Add liquidity to your memecoin to make it tradable on the selected platform.
            </p>
          </div>

          <div className="flex flex-col items-center py-6">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
              <Coins className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-medium text-lg">Add Solana Liquidity</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4 text-center max-w-md">
              Adding liquidity will create a trading pair for your memecoin, allowing others to buy and sell it.
            </p>

            <Button
              onClick={openDialog}
              className={formData.liquidityAmount > 0 ? "bg-primary/80 hover:bg-primary" : ""}
            >
              {formData.liquidityAmount > 0 ? "Change Liquidity Amount" : "Add Liquidity"}
            </Button>

            {formData.liquidityAmount > 0 ? (
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">Current liquidity:</p>
                <p className="text-lg font-medium text-primary">{formData.liquidityAmount} SOL</p>
              </div>
            ) : (
              <p className="mt-4 text-xs text-red-500">Liquidity amount is required</p>
            )}
          </div>

          <div className="text-sm text-muted-foreground">
            <p>
              Adding liquidity is a crucial step in creating your memecoin. The more liquidity you add, the more stable
              the price will be during initial trading.
            </p>
          </div>
        </div>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {/* Update the dialog content to show loading and success states */}
        <DialogContent>
          {isSuccess ? (
            <div className="py-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                <Coins className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Liquidity Added Successfully!</h3>
              <p className="text-muted-foreground mb-4">
                You created a liquidity pool for your coin with {selectedAmount} SOL.
              </p>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Add Liquidity</DialogTitle>
                <DialogDescription>
                  Enter the amount of Solana you want to add as liquidity for your memecoin.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (SOL)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="border-input/60 focus-visible:ring-primary/70"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Recommended: At least 1 SOL for better liquidity depth.
                  </p>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={closeDialog} disabled={isLoading}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} className="bg-primary/90 hover:bg-primary" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></div>
                      Adding Liquidity...
                    </>
                  ) : (
                    "Confirm"
                  )}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}

