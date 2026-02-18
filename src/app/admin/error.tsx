"use client"

import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-destructive mx-auto" />
        <div>
          <h3 className="font-heading font-bold text-lg">Error en el panel</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {error.message || 'Ha ocurrido un error inesperado'}
          </p>
        </div>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Reintentar
        </button>
      </div>
    </div>
  )
}
