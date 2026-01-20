"use client"

import { useSiteContent } from '@/contexts/SiteContentContext'
import { useSeasonalTheme } from '@/contexts/SeasonalThemeContext'
import { useRouter } from 'next/navigation'
import { X, Check, Eye, FileText, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { toast } from 'sonner'

export function ContentPreviewBar() {
  const { previewContentState, cancelContentPreview, publishContentPreview } = useSiteContent()
  const { previewState: themePreviewState } = useSeasonalTheme()
  const router = useRouter()
  const [isPublishing, setIsPublishing] = useState(false)

  // Don't show if theme preview is active (theme preview takes precedence)
  if (themePreviewState.isActive) return null
  if (!previewContentState.isActive) return null

  const handleCancel = () => {
    cancelContentPreview()
    router.push(previewContentState.returnUrl)
  }

  const handlePublish = async () => {
    setIsPublishing(true)
    try {
      const success = await publishContentPreview()
      if (success) {
        toast.success('Contenido publicado correctamente')
        router.push(previewContentState.returnUrl)
      } else {
        toast.error('Error al publicar el contenido')
      }
    } catch (error) {
      console.error('Error publishing:', error)
      toast.error('Error al publicar el contenido')
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Left side - Preview info */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
              <Eye className="w-4 h-4" />
              <span className="text-sm font-medium">Vista Previa</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="text-sm">
                Editando: <strong>Contenido del Sitio</strong>
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
              className="bg-white text-indigo-600 hover:bg-white/90"
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
    </div>
  )
}
