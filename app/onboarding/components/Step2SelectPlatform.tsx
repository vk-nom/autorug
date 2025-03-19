"use client"

import { useState } from "react"
import { Check, ChevronDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

interface FormData {
  platform: string
}

interface Step2Props {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
}

const platforms = [
  {
    id: "raydium",
    name: "Raydium",
    description: "Launch on Solana's leading AMM and liquidity provider",
    icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/raydium-KtPKi931Vrb19eMMJEwtHgIWxcbx5W.jpeg",
  },
  {
    id: "pumpfun",
    name: "Pump.fun",
    description: "Launch on the popular memecoin platform",
    icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pumpfun.jpg-G2SE46xgenqSkLXGkfqpsp8NvTDhti.jpeg",
  },
]

export default function Step2SelectPlatform({ formData, updateFormData }: Step2Props) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleDropdown = () => setIsOpen(!isOpen)

  const selectPlatform = (platformId: string) => {
    updateFormData({ platform: platformId })
    setIsOpen(false)
  }

  const selectedPlatform = platforms.find((p) => p.id === formData.platform)

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Select Launch Platform</h2>
            <p className="text-muted-foreground mb-6">Choose the platform where you want to launch your memecoin.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="platform">
                  Platform <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={isOpen}
                    className="w-full justify-between"
                    onClick={toggleDropdown}
                  >
                    {selectedPlatform ? (
                      <div className="flex items-center">
                        <div className="w-5 h-5 mr-2 rounded-full overflow-hidden flex-shrink-0">
                          <img
                            src={selectedPlatform.icon || "/placeholder.svg"}
                            alt={selectedPlatform.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {selectedPlatform.name}
                      </div>
                    ) : (
                      "Select platform"
                    )}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 z-10 w-full mt-1 rounded-md border bg-popover shadow-md"
                      >
                        <div className="py-1">
                          {platforms.map((platform) => (
                            <div
                              key={platform.id}
                              className={`
                                flex items-center justify-between px-3 py-2 cursor-pointer
                                ${formData.platform === platform.id ? "bg-accent" : "hover:bg-accent"}
                              `}
                              onClick={() => selectPlatform(platform.id)}
                            >
                              <div className="flex items-center">
                                <div className="w-6 h-6 mr-3 rounded-full overflow-hidden flex-shrink-0">
                                  <img
                                    src={platform.icon || "/placeholder.svg"}
                                    alt={platform.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <div className="font-medium">{platform.name}</div>
                                  <div className="text-xs text-muted-foreground">{platform.description}</div>
                                </div>
                              </div>
                              {formData.platform === platform.id && <Check className="h-4 w-4 text-primary" />}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {!formData.platform && <p className="text-xs text-red-500">Platform selection is required</p>}
              </div>
            </div>

            <div className="space-y-4">
              {selectedPlatform && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 border rounded-lg bg-accent/20"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 mr-4 rounded-full overflow-hidden flex-shrink-0">
                      <img
                        src={selectedPlatform.icon || "/placeholder.svg"}
                        alt={selectedPlatform.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">{selectedPlatform.name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedPlatform.description}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm">Fast transaction speeds</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm">Low transaction fees</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm">Active trading community</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

