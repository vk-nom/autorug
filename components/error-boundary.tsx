"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CircleIcon as ExclamationCircle } from "lucide-react"

interface ErrorBoundaryProps {
  children: React.ReactNode
}

export default function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // Reset error state on unmount
    return () => {
      setHasError(false)
      setError(null)
    }
  }, [])

  const handleError = (error: Error) => {
    setHasError(true)
    setError(error)
  }

  if (hasError) {
    return (
      <Alert variant="destructive">
        <ExclamationCircle className="h-4 w-4" />
        <AlertTitle>An error occurred</AlertTitle>
        <AlertDescription>
          {error?.message || "An unexpected error has occurred. Please try again later."}
        </AlertDescription>
      </Alert>
    )
  }

  return <>{children}</>
}

