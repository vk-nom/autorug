"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Settings,
  DollarSign,
  BarChart3,
  Sparkles,
  Minus,
  ArrowUpRight,
  ArrowDownRight,
  Coins,
  CoinsIcon as CoinIcon,
} from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/auth-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

// Define the coin type
interface Coin {
  id: string
  userId: string
  name: string
  image: string
  investment: number
  profit: number
  platform: string
  createdAt: Date
  pnl: number
  socialLinks?: {
    website?: string
    telegram?: string
    discord?: string
    reddit?: string
    twitter?: string
    tiktok?: string
  }
}

// Add this interface near the top of the file, after the Coin interface
interface Transaction {
  id: string
  userId: string
  coinId: string
  coinName: string
  type: "creation" | "removal"
  amount: number
  timestamp: Date
}

// Fixed SOL to USD conversion rate for simplicity
const SOL_TO_USD = 175.82 // Updated rate: 1 SOL = $175.82 USD (as of March 2025)

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [coins, setCoins] = useState<Coin[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const { toast } = useToast()
  const isMounted = useRef(true)

  // Analytics state
  const [analytics, setAnalytics] = useState({
    totalLiquidityRemoved: 0,
    totalLiquidityAdded: 0,
    coinsCreatedLast30Days: 0,
    liquidityRemovedChangePercent: 15, // Default value for UI demonstration
  })

  // Add cleanup effect to prevent state updates after unmount
  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined" && !user) {
      router.push("/")
    }
  }, [user, router])

  useEffect(() => {
    if (!user) return

    // Simulate loading delay
    const timer = setTimeout(() => {
      if (typeof window !== "undefined" && isMounted.current) {
        try {
          // Get coins from localStorage or use default if none exist
          const allCoins = JSON.parse(localStorage.getItem("autorug_coins") || "[]")

          // Filter coins to only show those belonging to the current user
          const userCoins = allCoins.filter((coin: Coin) => coin.userId === user.id)

          // Convert string dates back to Date objects
          userCoins.forEach((coin: any) => {
            try {
              coin.createdAt = new Date(coin.createdAt)
            } catch (error) {
              console.error("Error parsing date:", error)
              coin.createdAt = new Date() // Fallback to current date
            }
          })

          if (isMounted.current) {
            setCoins(userCoins)
            setLoading(false)
          }
        } catch (error) {
          console.error("Error parsing localStorage data:", error)
          // Handle the error gracefully
          if (isMounted.current) {
            setLoading(false)
          }
        }
      }
    }, 1000)

    return () => {
      clearTimeout(timer)
    }
  }, [user])

  // Listen for new coins from onboarding
  useEffect(() => {
    if (!user) return

    const handleStorage = () => {
      if (typeof window !== "undefined" && isMounted.current) {
        try {
          const allCoins = JSON.parse(localStorage.getItem("autorug_coins") || "[]")

          // Filter coins to only show those belonging to the current user
          const userCoins = allCoins.filter((coin: Coin) => coin.userId === user.id)

          // Convert string dates back to Date objects
          userCoins.forEach((coin: any) => {
            try {
              coin.createdAt = new Date(coin.createdAt)
            } catch (error) {
              console.error("Error parsing date:", error)
              coin.createdAt = new Date() // Fallback to current date
            }
          })

          if (isMounted.current) {
            setCoins(userCoins)
          }
        } catch (error) {
          console.error("Error parsing localStorage data:", error)
          // Handle the error gracefully
        }
      }
    }

    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [user])

  // Add this useEffect to load transactions and calculate analytics
  useEffect(() => {
    if (!user) return

    // Load transactions from localStorage
    if (typeof window !== "undefined" && isMounted.current) {
      try {
        const allTransactions = JSON.parse(localStorage.getItem("autorug_transactions") || "[]")

        // Filter transactions to only show those belonging to the current user
        const userTransactions = allTransactions.filter((tx: Transaction) => tx.userId === user.id)

        // Convert string dates back to Date objects
        userTransactions.forEach((tx: any) => {
          try {
            tx.timestamp = new Date(tx.timestamp)
          } catch (error) {
            console.error("Error parsing date:", error)
            tx.timestamp = new Date() // Fallback to current date
          }
        })

        // Sort transactions by timestamp (newest first)
        userTransactions.sort(
          (a: Transaction, b: Transaction) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        )

        if (isMounted.current) {
          setTransactions(userTransactions)

          // Calculate analytics
          const now = new Date()
          const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

          // Total liquidity removed
          const totalRemoved = userTransactions
            .filter((tx) => tx.type === "removal")
            .reduce((sum, tx) => sum + tx.amount, 0)

          // Total liquidity added (from coin creations)
          const totalAdded = userTransactions
            .filter((tx) => tx.type === "creation")
            .reduce((sum, tx) => sum + tx.amount, 0)

          // Coins created in the last 30 days
          const recentCoins = userTransactions.filter(
            (tx) => tx.type === "creation" && new Date(tx.timestamp).getTime() > thirtyDaysAgo.getTime(),
          ).length

          setAnalytics({
            totalLiquidityRemoved: totalRemoved,
            totalLiquidityAdded: totalAdded,
            coinsCreatedLast30Days: recentCoins,
            liquidityRemovedChangePercent: 15, // This would normally be calculated from historical data
          })
        }
      } catch (error) {
        console.error("Error parsing localStorage data:", error)
        // Handle the error gracefully
      }
    }
  }, [user])

  const handleCreateCoin = () => {
    router.push("/onboarding")
  }

  // Add this function to log transactions
  const logTransaction = (transaction: Omit<Transaction, "id" | "timestamp">) => {
    if (!isMounted.current) return

    // Generate a unique ID for the transaction
    const id = Math.random().toString(36).substring(2, 15)

    // Create the transaction object
    const newTransaction: Transaction = {
      ...transaction,
      id,
      timestamp: new Date(),
    }

    // Get existing transactions
    const existingTransactions = JSON.parse(localStorage.getItem("autorug_transactions") || "[]")

    // Add new transaction and save
    const updatedTransactions = [newTransaction, ...existingTransactions]
    localStorage.setItem("autorug_transactions", JSON.stringify(updatedTransactions))

    // Update local state
    const userTransactions = updatedTransactions.filter((tx: Transaction) => tx.userId === user?.id)
    userTransactions.sort(
      (a: Transaction, b: Transaction) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )
    setTransactions(userTransactions)
  }

  // Add this function to delete a transaction
  const deleteTransaction = (transactionId: string) => {
    if (!isMounted.current) return

    // Get all transactions
    const allTransactions = JSON.parse(localStorage.getItem("autorug_transactions") || "[]")

    // Filter out the transaction with the given ID
    const updatedTransactions = allTransactions.filter((tx: Transaction) => tx.id !== transactionId)

    // Save updated transactions
    localStorage.setItem("autorug_transactions", JSON.stringify(updatedTransactions))

    // Update local state
    const userTransactions = updatedTransactions.filter((tx: Transaction) => tx.userId === user?.id)
    userTransactions.sort(
      (a: Transaction, b: Transaction) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )
    setTransactions(userTransactions)

    toast({
      title: "Transaction deleted",
      description: "The transaction has been removed from your history",
      variant: "success",
    })
  }

  const updateCoinLiquidity = (coinId: string, newLiquidity: number) => {
    if (!isMounted.current) return { deleted: false, amount: 0 }

    // Get all coins
    const allCoins = JSON.parse(localStorage.getItem("autorug_coins") || "[]")

    // Find the coin to get its details
    const coin = allCoins.find((c: Coin) => c.id === coinId)
    if (!coin) return { deleted: false, amount: 0 }

    const currentLiquidity = coin.investment + coin.profit

    // If new liquidity is 0 or very close to 0 (to handle floating point precision issues), delete the coin
    if (newLiquidity === 0 || newLiquidity < 0.001) {
      // Log the transaction (removal of all liquidity)
      logTransaction({
        userId: user?.id || "",
        coinId,
        coinName: coin.name,
        type: "removal",
        amount: currentLiquidity, // Log the total amount (investment + profit)
      })

      // Filter out the coin with the given ID
      const updatedCoins = allCoins.filter((coin: Coin) => coin.id !== coinId)

      // Save updated coins
      localStorage.setItem("autorug_coins", JSON.stringify(updatedCoins))

      // Update local state
      const userCoins = updatedCoins.filter((coin: Coin) => coin.userId === user?.id)
      setCoins(userCoins)

      // Trigger storage event for other components
      window.dispatchEvent(new Event("storage"))

      // Return the deleted coin's name and investment amount
      return { deleted: true, name: coin.name, amount: currentLiquidity }
    }

    // Otherwise, update the coin
    const updatedCoins = allCoins.map((c: Coin) => {
      if (c.id === coinId) {
        // Calculate the amount removed
        const amountRemoved = currentLiquidity - newLiquidity

        // Calculate the proportion of profit being removed
        const profitRemoved = c.profit * (amountRemoved / currentLiquidity)

        // Log the transaction (partial removal)
        logTransaction({
          userId: user?.id || "",
          coinId,
          coinName: c.name,
          type: "removal",
          amount: amountRemoved, // Log the total amount removed (investment + profit)
        })

        // Calculate the new profit based on the proportion of liquidity removed
        const newProfit = c.profit * (newLiquidity / currentLiquidity)

        // Calculate the new investment based on the proportion of liquidity removed
        const newInvestment = c.investment * (newLiquidity / currentLiquidity)

        // Update the investment and profit
        return {
          ...c,
          investment: newInvestment,
          profit: newProfit,
        }
      }
      return c
    })

    // Save updated coins
    localStorage.setItem("autorug_coins", JSON.stringify(updatedCoins))

    // Update local state
    const userCoins = updatedCoins.filter((coin: Coin) => coin.userId === user?.id)
    setCoins(userCoins)

    // Trigger storage event for other components
    window.dispatchEvent(new Event("storage"))

    // Find the updated coin
    const originalCoin = allCoins.find((c: Coin) => c.id === coinId)
    const originalLiquidity = originalCoin ? originalCoin.investment + originalCoin.profit : 0

    return {
      deleted: false,
      amount: originalLiquidity - newLiquidity,
    }
  }

  const generateRandomPNL = () => {
    if (!isMounted.current) return

    if (!user || coins.length === 0) {
      toast({
        title: "No coins found",
        description: "Create a coin first to generate PNL",
        variant: "destructive",
      })
      return
    }

    // Get all coins
    const allCoins = JSON.parse(localStorage.getItem("autorug_coins") || "[]")

    // Update only the user's coins
    const updatedCoins = allCoins.map((coin: Coin) => {
      if (coin.userId === user.id) {
        // Determine if this will be a profit or loss (70% chance of profit)
        const isProfitable = Math.random() < 0.7

        let multiplier

        if (isProfitable) {
          // Generate a higher random multiplier for profits (between 2x and 10x)
          multiplier = 2 + Math.random() * 8
        } else {
          // Generate a negative multiplier for losses (between -0.9x and -0.1x)
          // We don't go below -0.9x to avoid completely wiping out the investment
          multiplier = -0.1 - Math.random() * 0.8
        }

        // Calculate new profit based on investment
        const newProfit = coin.investment * multiplier

        // Calculate PNL percentage
        const pnlPercentage = ((newProfit / coin.investment) * 100).toFixed(2)

        return {
          ...coin,
          profit: newProfit,
          pnl: Number.parseFloat(pnlPercentage),
        }
      }
      return coin
    })

    // Save updated coins
    localStorage.setItem("autorug_coins", JSON.stringify(updatedCoins))

    // Update local state
    const userCoins = updatedCoins.filter((coin: Coin) => coin.userId === user.id)
    setCoins(userCoins)

    // Trigger storage event for other components
    window.dispatchEvent(new Event("storage"))

    toast({
      title: "PNL Generated!",
      description: `Successfully generated PNL for ${userCoins.length} coins`,
      variant: "success",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button onClick={handleCreateCoin} className="bg-primary/90 hover:bg-primary">
          <Plus className="mr-2 h-4 w-4" /> Create New Coin
        </Button>
      </div>

      <Tabs defaultValue="coins" className="w-full">
        <TabsList className="mb-6 bg-secondary/50">
          <TabsTrigger value="coins" className="data-[state=active]:bg-background data-[state=active]:text-primary">
            Coins
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-background data-[state=active]:text-primary">
            Analytics
          </TabsTrigger>
          <TabsTrigger
            value="transactions"
            className="data-[state=active]:bg-background data-[state=active]:text-primary"
          >
            Transactions
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-background data-[state=active]:text-primary">
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="coins" className="space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <CoinCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <>
              {coins.length === 0 ? (
                <div className="text-center py-12 bg-background border border-border rounded-lg">
                  <h3 className="text-lg font-medium mb-2">No coins created yet</h3>
                  <p className="text-muted-foreground mb-6">Create your first Coin to get started</p>
                  <Button onClick={handleCreateCoin} className="bg-primary/90 hover:bg-primary">
                    <Plus className="mr-2 h-4 w-4" /> Create Coin
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {coins.map((coin, index) => (
                    <motion.div
                      key={coin.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <CoinCard
                        coin={coin}
                        updateCoinLiquidity={updateCoinLiquidity}
                        toast={toast}
                        logTransaction={logTransaction}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="analytics">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Liquidity Removed Card */}
              <Card className="border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Liquidity Removed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">{analytics.totalLiquidityRemoved.toFixed(2)} SOL</span>
                      <div
                        className={`flex items-center ${analytics.liquidityRemovedChangePercent > 0 ? "text-green-500" : "text-red-500"}`}
                      >
                        {analytics.liquidityRemovedChangePercent > 0 ? (
                          <ArrowUpRight className="h-4 w-4 mr-1" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 mr-1" />
                        )}
                        <span className="text-sm font-medium">
                          {Math.abs(analytics.liquidityRemovedChangePercent)}%
                        </span>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ${(analytics.totalLiquidityRemoved * SOL_TO_USD).toFixed(2)} USD
                    </span>
                    <span className="text-xs text-muted-foreground mt-2">vs. previous month</span>
                  </div>
                </CardContent>
              </Card>

              {/* Liquidity Added Card */}
              <Card className="border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Liquidity Added</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">{analytics.totalLiquidityAdded.toFixed(2)} SOL</span>
                      <div className="flex items-center text-green-500">
                        <Coins className="h-4 w-4 mr-1" />
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ${(analytics.totalLiquidityAdded * SOL_TO_USD).toFixed(2)} USD
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Coins Created Card */}
              <Card className="border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Coins Created (30 days)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">{analytics.coinsCreatedLast30Days}</span>
                      <div className="flex items-center text-primary">
                        <CoinIcon className="h-4 w-4" />
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {analytics.coinsCreatedLast30Days === 1 ? "coin" : "coins"} in the last 30 days
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional analytics content */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Detailed Analytics</CardTitle>
                <CardDescription>View more detailed analytics for your memecoins.</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Detailed analytics charts coming soon</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Transactions</CardTitle>
              <CardDescription>View your transaction history.</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-[400px]">
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 rounded-full border-4 border-primary/30 border-t-primary animate-spin mb-4"></div>
                    <p className="text-muted-foreground">Loading transactions...</p>
                  </div>
                </div>
              ) : transactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <DollarSign className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No transactions yet</h3>
                  <p className="text-muted-foreground">
                    Create a coin or remove liquidity to see your transaction history.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-4 rounded-md hover:bg-accent/50 transition-colors border border-border/50"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div
                          className={`p-2 rounded-full ${
                            tx.type === "creation" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                          }`}
                        >
                          {tx.type === "creation" ? <Plus className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium truncate">{tx.coinName}</p>
                          <p className="text-xs text-muted-foreground">
                            {tx.type === "creation" ? "Created" : "Removed liquidity"} •{" "}
                            {new Date(tx.timestamp).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 mr-4">
                        <p
                          className={`font-medium ${
                            tx.type === "creation"
                              ? "text-foreground"
                              : tx.amount > 0
                                ? "text-green-500"
                                : "text-red-500"
                          }`}
                        >
                          {tx.type === "creation" ? "-" : tx.amount > 0 ? "+" : ""}
                          {tx.amount.toFixed(2)} SOL
                        </p>
                        <p className="text-xs text-muted-foreground">${(tx.amount * SOL_TO_USD).toFixed(2)} USD</p>
                      </div>
                      <Button
                        onClick={() => deleteTransaction(tx.id)}
                        variant="ghost"
                        size="icon"
                        className="flex-shrink-0 h-8 w-8 rounded-full hover:bg-destructive/10"
                      >
                        <Minus className="h-4 w-4" />
                        <span className="sr-only">Delete transaction</span>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Manage your account settings and generate PNL.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-b border-border pb-6">
                <h3 className="text-lg font-medium mb-2">PNL Generator</h3>
                <p className="text-muted-foreground mb-4">
                  Generate random PNL for all your coins. This will simulate market activity and update your coin
                  values.
                </p>
                <Button
                  onClick={generateRandomPNL}
                  className="bg-primary/90 hover:bg-primary"
                  disabled={coins.length === 0}
                >
                  <Sparkles className="mr-2 h-4 w-4" /> Generate PNL
                </Button>
              </div>

              <div className="text-center text-muted-foreground pt-4">
                <p>More settings coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function CoinCard({
  coin,
  updateCoinLiquidity,
  toast,
  logTransaction,
}: {
  coin: Coin
  updateCoinLiquidity: (coinId: string, newLiquidity: number) => any
  toast: any
  logTransaction: any
}) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [liquidityAmount, setLiquidityAmount] = useState("")
  const [isRemoving, setIsRemoving] = useState(false)
  const isMounted = useRef(true)

  // Add cleanup effect
  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  // Calculate current liquidity as investment + profit
  const currentLiquidity = coin.investment + coin.profit

  const handleOpenSettings = () => {
    setLiquidityAmount("")
    setIsSettingsOpen(true)
  }

  const handleCloseSettings = () => {
    setIsSettingsOpen(false)
  }

  const handleSetPercentage = (percentage: number) => {
    // For MAX (100%), use the exact current liquidity value to avoid precision issues
    if (percentage === 1) {
      setLiquidityAmount(currentLiquidity.toString())
    } else {
      const amount = (percentage * currentLiquidity).toFixed(2)
      setLiquidityAmount(amount)
    }
  }

  const handleRemoveLiquidity = () => {
    const amount = Number.parseFloat(liquidityAmount)

    if (isNaN(amount) || amount <= 0 || amount > currentLiquidity) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to remove",
        variant: "destructive",
      })
      return
    }

    // Set loading state
    setIsRemoving(true)

    // Generate random delay between 2-4 seconds
    const randomDelay = Math.floor(Math.random() * 2000) + 2000

    setTimeout(() => {
      if (!isMounted.current) return

      // Calculate new liquidity
      const newLiquidity = currentLiquidity - amount

      // If removing all or almost all liquidity, set to exactly 0 to ensure deletion
      const finalLiquidity = newLiquidity < 0.001 ? 0 : newLiquidity

      // Update coin
      const result = updateCoinLiquidity(coin.id, finalLiquidity)

      // Show success toast
      if (result.deleted) {
        toast({
          title: "Coin deleted",
          description: `Successfully removed all liquidity and deleted ${coin.name}`,
          variant: "success",
        })
      } else {
        toast({
          title: "Liquidity removed",
          description: `Successfully removed ${amount.toFixed(2)} SOL from ${coin.name}`,
          variant: "success",
        })
      }

      // Reset loading state
      setIsRemoving(false)

      // Close dialog
      handleCloseSettings()
    }, randomDelay)
  }

  return (
    <>
      <Card className="overflow-hidden border-border hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <div>
                <CardTitle className="text-lg">{coin.name}</CardTitle>
                <CardDescription>{coin.platform}</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  coin.pnl > 0
                    ? "bg-green-500/10 text-green-500"
                    : coin.pnl < 0
                      ? "bg-red-500/10 text-red-500"
                      : "bg-gray-500/10 text-foreground"
                }`}
              >
                {coin.pnl > 0 ? (
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                ) : coin.pnl < 0 ? (
                  <TrendingDown className="h-3 w-3 inline mr-1" />
                ) : null}
                {coin.pnl > 0 ? "+" : coin.pnl < 0 ? "" : ""}
                {coin.pnl.toFixed(2)}%
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleOpenSettings}>
                <Settings className="h-4 w-4" />
                <span className="sr-only">Coin Settings</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="pt-3 border-t border-border">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-muted-foreground">Your Investment</p>
                <p className="font-medium">{coin.investment.toFixed(2)} SOL</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Profit/Loss</p>
                <p
                  className={`font-medium ${
                    coin.profit > 0 ? "text-green-500" : coin.profit < 0 ? "text-red-500" : "text-foreground"
                  }`}
                >
                  {coin.profit > 0 ? "+" : coin.profit < 0 ? "" : ""}
                  {coin.profit.toFixed(2)} SOL
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Coin Settings - {coin.name}</DialogTitle>
            <DialogDescription>Manage your coin's liquidity and settings</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Current Liquidity</Label>
              <div className="text-lg font-medium">{currentLiquidity.toFixed(2)} SOL</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="liquidity-amount">Remove Liquidity</Label>
              <Input
                id="liquidity-amount"
                type="number"
                placeholder="0.0"
                value={liquidityAmount}
                onChange={(e) => setLiquidityAmount(e.target.value)}
                className="border-border focus-visible:ring-primary/70"
              />
              <div className="flex gap-2 mt-2">
                <Button variant="outline" size="sm" onClick={() => handleSetPercentage(0.25)}>
                  25%
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleSetPercentage(0.5)}>
                  50%
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleSetPercentage(1)}>
                  MAX
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <Button
              variant="destructive"
              onClick={handleRemoveLiquidity}
              disabled={
                isRemoving ||
                !liquidityAmount ||
                Number.parseFloat(liquidityAmount) <= 0 ||
                Number.parseFloat(liquidityAmount) > currentLiquidity + 0.001
              }
            >
              {isRemoving ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-destructive-foreground border-t-transparent"></div>
                  Removing...
                </>
              ) : (
                "Remove Liquidity"
              )}
            </Button>
            <Button variant="outline" onClick={handleCloseSettings}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

function CoinCardSkeleton() {
  return (
    <Card className="overflow-hidden border-border">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div>
              <div className="h-5 w-24 bg-secondary animate-pulse rounded"></div>
              <div className="h-4 w-16 bg-secondary animate-pulse rounded mt-2"></div>
            </div>
          </div>
          <div className="h-6 w-16 bg-secondary animate-pulse rounded-full"></div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="pt-3 border-t border-border">
          <div className="flex justify-between items-center">
            <div>
              <div className="h-3 w-20 bg-secondary animate-pulse rounded"></div>
              <div className="h-5 w-16 bg-secondary animate-pulse rounded mt-1"></div>
            </div>
            <div className="text-right">
              <div className="h-3 w-20 bg-secondary animate-pulse rounded"></div>
              <div className="h-5 w-16 bg-secondary animate-pulse rounded mt-1"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

