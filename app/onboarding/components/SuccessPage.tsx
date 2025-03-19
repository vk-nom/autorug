"use client"

import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function SuccessPage() {
  return (
    <div className="text-center py-12">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          duration: 0.6,
        }}
        className="flex justify-center mb-6"
      >
        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center">
          <CheckCircle className="h-12 w-12 text-green-500" />
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-3xl font-bold mb-4"
      >
        Coin Created Successfully!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-muted-foreground mb-8 max-w-md mx-auto"
      >
        Congratulations! Your memecoin has been created and is now live on the platform. You can now share it with
        others and start trading.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="space-x-4"
      >
        <Button asChild className="bg-primary/90 hover:bg-primary">
          <Link href="/dijoqhi89123hd3i1e8hqwikrfhio3q289hrei38hr2389hri3qxhr3928hr8239rrfi3w">Go to Dashboard</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">View Chart</Link>
        </Button>
      </motion.div>
    </div>
  )
}

