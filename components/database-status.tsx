"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2, RefreshCw } from "lucide-react"

interface DatabaseStatusProps {
  onStatusChange?: (isReady: boolean) => void
}

export function DatabaseStatus({ onStatusChange }: DatabaseStatusProps) {
  const [status, setStatus] = useState<"checking" | "ready" | "error">("checking")
  const [error, setError] = useState<string | null>(null)
  const [isRetrying, setIsRetrying] = useState(false)

  const checkDatabaseStatus = async () => {
    try {
      setStatus("checking")
      setError(null)

      const response = await fetch("/api/database/status", {
        method: "GET",
        cache: "no-store",
      })

      const data = await response.json()

      if (data.success) {
        setStatus("ready")
        onStatusChange?.(true)
      } else {
        setStatus("error")
        setError(data.error || "Database connection failed")
        onStatusChange?.(false)
      }
    } catch (err) {
      setStatus("error")
      setError("Failed to check database status")
      onStatusChange?.(false)
    }
  }

  const handleRetry = async () => {
    setIsRetrying(true)
    await checkDatabaseStatus()
    setIsRetrying(false)
  }

  useEffect(() => {
    checkDatabaseStatus()
  }, [])

  if (status === "checking") {
    return (
      <Alert>
        <Loader2 className="h-4 w-4 animate-spin" />
        <AlertDescription>Checking database connection...</AlertDescription>
      </Alert>
    )
  }

  if (status === "error") {
    return (
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>Database Error: {error}</span>
          <Button variant="outline" size="sm" onClick={handleRetry} disabled={isRetrying} className="ml-2">
            {isRetrying ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert>
      <CheckCircle className="h-4 w-4" />
      <AlertDescription>Database is ready</AlertDescription>
    </Alert>
  )
}
