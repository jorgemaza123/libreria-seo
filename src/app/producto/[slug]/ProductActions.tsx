"use client"

import { useState, useEffect } from 'react'
import { Heart, Share2, Check, Link2 } from 'lucide-react'
import { toast } from 'sonner'

interface ProductActionsProps {
  productId: string
  productName: string
  productSlug: string
}

const FAVORITES_KEY = 'libreria-favorites'

export function ProductActions({ productId, productName, productSlug }: ProductActionsProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [justCopied, setJustCopied] = useState(false)

  useEffect(() => {
    const favorites = getFavorites()
    setIsFavorite(favorites.includes(productId))
  }, [productId])

  function getFavorites(): string[] {
    if (typeof window === 'undefined') return []
    try {
      const stored = localStorage.getItem(FAVORITES_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  function saveFavorites(favorites: string[]) {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
    } catch {
      // Ignore storage errors
    }
  }

  const handleToggleFavorite = () => {
    const favorites = getFavorites()

    if (isFavorite) {
      const updated = favorites.filter(id => id !== productId)
      saveFavorites(updated)
      setIsFavorite(false)
      toast.success('Eliminado de favoritos')
    } else {
      const updated = [...favorites, productId]
      saveFavorites(updated)
      setIsFavorite(true)
      toast.success('Agregado a favoritos', {
        description: productName,
      })
    }
  }

  const handleShare = async () => {
    setIsSharing(true)

    const shareData = {
      title: productName,
      text: `Mira este producto: ${productName}`,
      url: typeof window !== 'undefined'
        ? window.location.href
        : `${process.env.NEXT_PUBLIC_SITE_URL || ''}/producto/${productSlug}`,
    }

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData)
        toast.success('Compartido exitosamente')
      } else {
        await navigator.clipboard.writeText(shareData.url)
        setJustCopied(true)
        setTimeout(() => setJustCopied(false), 2000)
        toast.success('Enlace copiado al portapapeles', {
          description: 'Pégalo donde quieras compartirlo',
        })
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(shareData.url)
          setJustCopied(true)
          setTimeout(() => setJustCopied(false), 2000)
          toast.success('Enlace copiado al portapapeles')
        } catch {
          toast.error('No se pudo compartir')
        }
      }
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <div
      className="flex items-center gap-2 sm:gap-3"
      role="group"
      aria-label="Acciones del producto"
    >
      <button
        onClick={handleToggleFavorite}
        className={`
          inline-flex items-center gap-2 px-4 py-2.5 rounded-xl
          text-sm font-medium transition-all duration-200
          border focus:outline-none focus:ring-2 focus:ring-offset-2
          ${isFavorite
            ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/50 focus:ring-red-500'
            : 'bg-muted/50 border-border text-muted-foreground hover:bg-muted hover:text-foreground focus:ring-primary'
          }
        `}
        aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        aria-pressed={isFavorite}
      >
        <Heart
          className={`w-5 h-5 transition-transform ${isFavorite ? 'fill-current scale-110' : ''}`}
          aria-hidden="true"
        />
        <span className="hidden sm:inline">
          {isFavorite ? 'Favorito' : 'Favoritos'}
        </span>
      </button>

      <button
        onClick={handleShare}
        disabled={isSharing}
        className={`
          inline-flex items-center gap-2 px-4 py-2.5 rounded-xl
          text-sm font-medium transition-all duration-200
          border focus:outline-none focus:ring-2 focus:ring-offset-2
          ${justCopied
            ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400'
            : 'bg-muted/50 border-border text-muted-foreground hover:bg-muted hover:text-foreground focus:ring-primary'
          }
          disabled:opacity-50 disabled:cursor-wait
        `}
        aria-label={justCopied ? 'Enlace copiado' : 'Compartir producto'}
      >
        {justCopied ? (
          <>
            <Check className="w-5 h-5" aria-hidden="true" />
            <span className="hidden sm:inline">Copiado</span>
          </>
        ) : isSharing ? (
          <>
            <Link2 className="w-5 h-5 animate-pulse" aria-hidden="true" />
            <span className="hidden sm:inline">Copiando...</span>
          </>
        ) : (
          <>
            <Share2 className="w-5 h-5" aria-hidden="true" />
            <span className="hidden sm:inline">Compartir</span>
          </>
        )}
      </button>
    </div>
  )
}
