import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <p className="mt-8 text-base text-muted-foreground md:mt-0 md:order-1">
            &copy; 2023 AutoRug, Inc. All rights reserved.
          </p>
      </div>
    </footer>
  )
}

