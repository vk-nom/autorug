import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              <span className="text-primary">Auto</span>
              <span className="text-foreground">Rug</span>
            </Link>
          </div>
          <p className="mt-4 md:mt-0 text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} AutoRug, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

