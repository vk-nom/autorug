"use client"

import type React from "react"

import { useState } from "react"
import { Upload, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface Step1Props {
  formData: {
    name: string
    image: File | null
    description: string
  }
  updateFormData: (data: Partial<{ name: string; image: File | null; description: string }>) => void
}

export default function Step1CreateCoin({ formData, updateFormData }: Step1Props) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    updateFormData({ image: file })

    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setPreviewUrl(null)
    }
  }

  const removeImage = () => {
    updateFormData({ image: null })
    setPreviewUrl(null)
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Coin Details</h2>
            <p className="text-muted-foreground mb-6">Let's start by setting up the basic details for your memecoin.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Enter your memecoin name"
                  value={formData.name}
                  onChange={(e) => updateFormData({ name: e.target.value })}
                  required
                />
                {formData.name.trim() === "" && <p className="text-xs text-red-500">Name is required</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your memecoin..."
                  rows={5}
                  value={formData.description}
                  onChange={(e) => updateFormData({ description: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Coin Image</Label>
                <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-border rounded-lg">
                  {previewUrl ? (
                    <div className="relative">
                      <img
                        src={previewUrl || "/placeholder.svg"}
                        alt="Coin preview"
                        className="w-32 h-32 rounded-full object-cover border"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                        onClick={removeImage}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center">
                      <Upload className="h-10 w-10 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 text-center">
                    <Input id="image" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    <Label
                      htmlFor="image"
                      className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
                    >
                      {previewUrl ? "Change Image" : "Upload Image"}
                    </Label>
                    <p className="text-xs text-muted-foreground mt-2">Recommended: 512x512px JPG, PNG or GIF</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

