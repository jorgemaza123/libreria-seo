"use client"

import { useState, useEffect } from 'react'
import { Heart, Share2, Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
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

  // Cargar estado de favoritos desde localStorage al montar
  useEffect(() => {
    const favorites = getFavorites()
    setIsFavorite(favorites.includes(productId))
  }, [productId])

  // Helpers para localStorage
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

  // Toggle favorito
  const handleToggleFavorite = () => {
    const favorites = getFavorites()

    if (isFavorite) {
      // Quitar de favoritos
      const updated = favorites.filter(id => id !== productId)
      saveFavorites(updated)
      setIsFavorite(false)
      toast.success('Eliminado de favoritos')
    } else {
      // Agregar a favoritos
      const updated = [...favorites, productId]
      saveFavorites(updated)
      setIsFavorite(true)
      toast.success('Agregado a favoritos', {
        description: productName,
      })
    }
  }

  // Compartir producto
  const handleShare = async () => {
    setIsSharing(true)

    const shareData = {
      title: productName,
      text: `Mira este producto: ${productName}`,
      url: typeof window !== 'undefined' ? window.location.href : `${process.env.NEXT_PUBLIC_SITE_URL || ''}/producto/${productSlug}`,
    }

    try {
      // Intentar usar Web Share API (funciona en móviles y algunos navegadores)
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData)
        toast.success('Compartido exitosamente')
      } else {
        // Fallback: copiar URL al portapapeles
        await navigator.clipboard.writeText(shareData.url)
        toast.success('Enlace copiado al portapapeles', {
          description: 'Pégalo donde quieras compartirlo',
        })
      }
    } catch (error) {
      // Si el usuario cancela el share, no mostrar error
      if (error instanceof Error && error.name !== 'AbortError') {
        // Fallback final: intentar copiar al portapapeles
        try {
          await navigator.clipboard.writeText(shareData.url)
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
    <div className="flex gap-4 pt-4 border-t border-border">
      <Button
        variant="ghost"
        size="lg"
        onClick={handleToggleFavorite}
        className={isFavorite ? 'text-red-500 hover:text-red-600' : ''}
      >
        <Heart
          className={`w-5 h-5 mr-2 ${isFavorite ? 'fill-current' : ''}`}
        />
        {isFavorite ? 'En Favoritos' : 'Agregar a Favoritos'}
      </Button>

      <Button
        variant="ghost"
        size="lg"
        onClick={handleShare}
        disabled={isSharing}
      >
        {isSharing ? (
          <Copy className="w-5 h-5 mr-2 animate-pulse" />
        ) : (
          <Share2 className="w-5 h-5 mr-2" />
        )}
        Compartir
      </Button>
    </div>
  )
}
