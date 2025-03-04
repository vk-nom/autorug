"use client"

import {
  Globe,
  BellIcon as BrandTelegram,
  DiscIcon as BrandDiscord,
  BadgeIcon as BrandReddit,
  Twitter,
  InstagramIcon as BrandTiktok,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SocialMediaLinks {
  website?: string
  telegram?: string
  discord?: string
  reddit?: string
  twitter?: string
  tiktok?: string
}

interface Step1bProps {
  formData: {
    socialLinks: SocialMediaLinks
  }
  updateFormData: (data: Partial<{ socialLinks: SocialMediaLinks }>) => void
}

export default function Step1bSocialMedia({ formData, updateFormData }: Step1bProps) {
  const updateSocialLink = (platform: keyof SocialMediaLinks, value: string) => {
    updateFormData({
      socialLinks: {
        ...formData.socialLinks,
        [platform]: value,
      },
    })
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Social Media Links</h2>
            <p className="text-muted-foreground mb-6">
              Add your coin's social media links to help users find more information.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="website" className="flex items-center gap-2">
                <Globe className="h-4 w-4" /> Website
              </Label>
              <Input
                id="website"
                placeholder="https://yourcoin.com"
                value={formData.socialLinks.website || ""}
                onChange={(e) => updateSocialLink("website", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telegram" className="flex items-center gap-2">
                <BrandTelegram className="h-4 w-4" /> Telegram
              </Label>
              <Input
                id="telegram"
                placeholder="https://t.me/yourcoin"
                value={formData.socialLinks.telegram || ""}
                onChange={(e) => updateSocialLink("telegram", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="discord" className="flex items-center gap-2">
                <BrandDiscord className="h-4 w-4" /> Discord
              </Label>
              <Input
                id="discord"
                placeholder="https://discord.gg/yourcoin"
                value={formData.socialLinks.discord || ""}
                onChange={(e) => updateSocialLink("discord", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reddit" className="flex items-center gap-2">
                <BrandReddit className="h-4 w-4" /> Reddit
              </Label>
              <Input
                id="reddit"
                placeholder="https://reddit.com/r/yourcoin"
                value={formData.socialLinks.reddit || ""}
                onChange={(e) => updateSocialLink("reddit", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitter" className="flex items-center gap-2">
                <Twitter className="h-4 w-4" /> X (Twitter)
              </Label>
              <Input
                id="twitter"
                placeholder="https://x.com/yourcoin"
                value={formData.socialLinks.twitter || ""}
                onChange={(e) => updateSocialLink("twitter", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tiktok" className="flex items-center gap-2">
                <BrandTiktok className="h-4 w-4" /> TikTok
              </Label>
              <Input
                id="tiktok"
                placeholder="https://tiktok.com/@yourcoin"
                value={formData.socialLinks.tiktok || ""}
                onChange={(e) => updateSocialLink("tiktok", e.target.value)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

