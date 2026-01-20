"use client"

import { useSeasonalTheme } from '@/contexts/SeasonalThemeContext'
import { useRouter } from 'next/navigation'
import { X, Check, Eye, Palette, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { toast } from 'sonner'

export function PreviewBar() {
  const { previewState, cancelPreview, publishPreview } = useSeasonalTheme()
  const router = useRouter()
  const [isPublishing, setIsPublishing] = useState(false)

  if (!previewState.isActive) return null

  const handleCancel = () => {
    cancelPreview()
    router.push(previewState.returnUrl)
  }

  const handlePublish = async () => {
    setIsPublishing(true)
    try {
      const success = await publishPreview()
      if (success) {
        toast.success('Tema publicado correctamente')
        router.push(previewState.returnUrl)
      } else {
        toast.error('Error al publicar el tema')
      }
    } catch (error) {
      console.error('Error publishing:', error)
      toast.error('Error al publicar el tema')
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Left side - Preview info */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
              <Eye className="w-4 h-4" />
              <span className="text-sm font-medium">Vista Previa</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <Palette className="w-4 h-4" />
              <span className="text-sm">
                Tema: <strong>{previewState.theme?.name || 'Personalizado'}</strong>
              </span>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="text-white hover:bg-white/20 hover:text-white"
            >
              <X className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Cancelar</span>
            </Button>
            <Button
              size="sm"
              onClick={handlePublish}
              disabled={isPublishing}
              className="bg-white text-orange-600 hover:bg-white/90"
            >
              {isPublishing ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <Check className="w-4 h-4 mr-1" />
              )}
              <span className="hidden sm:inline">Publicar Cambios</span>
              <span className="sm:hidden">Publicar</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Color preview strip */}
      {previewState.theme && (
        <div className="flex h-1">
          <div
            className="flex-1"
            style={{ backgroundColor: `hsl(${previewState.theme.primaryColor})` }}
          />
          <div
            className="flex-1"
            style={{ backgroundColor: `hsl(${previewState.theme.secondaryColor})` }}
          />
          <div
            className="flex-1"
            style={{ backgroundColor: `hsl(${previewState.theme.accentColor})` }}
          />
        </div>
      )}
    </div>
  )
}
