"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Palette, Check, Eye, Loader2, Plus, Save, RotateCcw, Trash2, Edit2,
  Power, PowerOff
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { useSeasonalTheme, defaultThemes, SeasonalTheme } from '@/contexts/SeasonalThemeContext'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface SavedTheme {
  id: string
  name: string
  slug: string
  primary_color: string
  secondary_color: string
  accent_color: string
  banner_image: string | null
  is_active: boolean
  created_at: string
}

// Color picker component
function ColorPicker({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  const parseHSL = (hsl: string) => {
    const parts = hsl.split(' ')
    return {
      h: parseInt(parts[0]) || 0,
      s: parseInt(parts[1]) || 0,
      l: parseInt(parts[2]) || 0,
    }
  }

  const { h, s, l } = parseHSL(value)

  const handleChange = (part: 'h' | 's' | 'l', newValue: number) => {
    const current = parseHSL(value)
    current[part] = newValue
    onChange(`${current.h} ${current.s}% ${current.l}%`)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <div
          className="w-8 h-8 rounded-lg border border-border"
          style={{ backgroundColor: `hsl(${value})` }}
        />
      </div>
      <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Tono (H)</span>
            <span>{h}</span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            value={h}
            onChange={(e) => handleChange('h', parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Saturación (S)</span>
            <span>{s}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={s}
            onChange={(e) => handleChange('s', parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Luminosidad (L)</span>
            <span>{l}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={l}
            onChange={(e) => handleChange('l', parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  )
}

export default function TemasPage() {
  const router = useRouter()
  const { theme: activeTheme, startPreview, setTheme } = useSeasonalTheme()

  // Temas guardados en BD
  const [savedThemes, setSavedThemes] = useState<SavedTheme[]>([])
  const [isLoadingThemes, setIsLoadingThemes] = useState(true)

  // Editor de tema
  const [editingTheme, setEditingTheme] = useState<SeasonalTheme>({
    id: '',
    name: '',
    slug: '',
    primaryColor: '220 14% 10%',
    secondaryColor: '220 14% 96%',
    accentColor: '142 72% 50%',
    bannerImage: null,
  })
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [isNewTheme, setIsNewTheme] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Dialogo de confirmación para eliminar
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [themeToDelete, setThemeToDelete] = useState<SavedTheme | null>(null)

  // Cargar temas guardados
  useEffect(() => {
    loadSavedThemes()
  }, [])

  const loadSavedThemes = async () => {
    try {
      const response = await fetch('/api/themes')
      if (response.ok) {
        const data = await response.json()
        setSavedThemes(data.themes || [])
      }
    } catch (error) {
      console.error('Error loading themes:', error)
    } finally {
      setIsLoadingThemes(false)
    }
  }

  const handleCreateNew = () => {
    setEditingTheme({
      id: '',
      name: '',
      slug: '',
      primaryColor: '220 14% 10%',
      secondaryColor: '220 14% 96%',
      accentColor: '142 72% 50%',
      bannerImage: null,
    })
    setIsNewTheme(true)
    setIsEditorOpen(true)
  }

  const handleEditTheme = (theme: SavedTheme) => {
    setEditingTheme({
      id: theme.id,
      name: theme.name,
      slug: theme.slug,
      primaryColor: theme.primary_color,
      secondaryColor: theme.secondary_color,
      accentColor: theme.accent_color,
      bannerImage: theme.banner_image,
    })
    setIsNewTheme(false)
    setIsEditorOpen(true)
  }

  const handleUsePreset = (preset: SeasonalTheme) => {
    setEditingTheme({
      ...preset,
      id: '',
    })
    setIsNewTheme(true)
    setIsEditorOpen(true)
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleSaveTheme = async (activate: boolean = false) => {
    if (!editingTheme.name.trim()) {
      toast.error('El nombre es requerido')
      return
    }

    setIsSaving(true)

    try {
      const slug = editingTheme.slug || generateSlug(editingTheme.name)

      if (isNewTheme) {
        // Crear nuevo tema
        const response = await fetch('/api/themes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: editingTheme.name,
            slug,
            primary_color: editingTheme.primaryColor,
            secondary_color: editingTheme.secondaryColor,
            accent_color: editingTheme.accentColor,
            banner_image: editingTheme.bannerImage,
            is_active: activate,
          }),
        })

        if (response.ok) {
          toast.success(activate ? 'Tema creado y activado' : 'Tema guardado')
          await loadSavedThemes()
          setIsEditorOpen(false)

          if (activate) {
            // Actualizar el tema activo en el contexto
            setTheme({
              id: slug,
              name: editingTheme.name,
              slug,
              primaryColor: editingTheme.primaryColor,
              secondaryColor: editingTheme.secondaryColor,
              accentColor: editingTheme.accentColor,
              bannerImage: editingTheme.bannerImage,
            })
          }
        } else {
          const error = await response.json()
          toast.error(error.error || 'Error al guardar')
        }
      } else {
        // Actualizar tema existente
        const response = await fetch(`/api/themes/${editingTheme.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: editingTheme.name,
            slug,
            primary_color: editingTheme.primaryColor,
            secondary_color: editingTheme.secondaryColor,
            accent_color: editingTheme.accentColor,
            banner_image: editingTheme.bannerImage,
            is_active: activate,
          }),
        })

        if (response.ok) {
          toast.success(activate ? 'Tema actualizado y activado' : 'Tema actualizado')
          await loadSavedThemes()
          setIsEditorOpen(false)

          if (activate) {
            setTheme({
              id: editingTheme.id,
              name: editingTheme.name,
              slug,
              primaryColor: editingTheme.primaryColor,
              secondaryColor: editingTheme.secondaryColor,
              accentColor: editingTheme.accentColor,
              bannerImage: editingTheme.bannerImage,
            })
          }
        } else {
          const error = await response.json()
          toast.error(error.error || 'Error al actualizar')
        }
      }
    } catch (error) {
      console.error('Error saving theme:', error)
      toast.error('Error al guardar el tema')
    } finally {
      setIsSaving(false)
    }
  }

  const handleActivateTheme = async (theme: SavedTheme) => {
    try {
      const response = await fetch(`/api/themes/${theme.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: true }),
      })

      if (response.ok) {
        toast.success(`Tema "${theme.name}" activado`)
        await loadSavedThemes()

        // Actualizar el tema en el contexto
        setTheme({
          id: theme.id,
          name: theme.name,
          slug: theme.slug,
          primaryColor: theme.primary_color,
          secondaryColor: theme.secondary_color,
          accentColor: theme.accent_color,
          bannerImage: theme.banner_image,
        })
      } else {
        toast.error('Error al activar el tema')
      }
    } catch (error) {
      console.error('Error activating theme:', error)
      toast.error('Error al activar el tema')
    }
  }

  const handleDeactivateTheme = async (theme: SavedTheme) => {
    try {
      const response = await fetch(`/api/themes/${theme.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: false }),
      })

      if (response.ok) {
        toast.success(`Tema "${theme.name}" desactivado`)
        await loadSavedThemes()
        setTheme(null)
      } else {
        toast.error('Error al desactivar el tema')
      }
    } catch (error) {
      console.error('Error deactivating theme:', error)
      toast.error('Error al desactivar el tema')
    }
  }

  const handleDeleteTheme = async () => {
    if (!themeToDelete) return

    try {
      const response = await fetch(`/api/themes/${themeToDelete.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Tema eliminado')
        await loadSavedThemes()
        setDeleteDialogOpen(false)
        setThemeToDelete(null)

        // Si era el tema activo, limpiarlo
        if (themeToDelete.is_active) {
          setTheme(null)
        }
      } else {
        toast.error('Error al eliminar el tema')
      }
    } catch (error) {
      console.error('Error deleting theme:', error)
      toast.error('Error al eliminar el tema')
    }
  }

  const handlePreview = () => {
    if (!editingTheme.name.trim()) {
      toast.error('Ingresa un nombre primero')
      return
    }

    startPreview({
      ...editingTheme,
      slug: editingTheme.slug || generateSlug(editingTheme.name),
    }, '/admin/temas')
    router.push('/')
  }

  // Temas predefinidos
  const presetThemes = Object.entries(defaultThemes).map(([key, theme]) => ({
    ...theme,
    key,
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold">Temas Estacionales</h2>
          <p className="text-muted-foreground">
            Personaliza los colores de tu tienda según la temporada
          </p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="w-4 h-4 mr-2" />
          Crear Tema
        </Button>
      </div>

      {/* Tema Activo */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h3 className="font-heading font-bold mb-4">Tema Activo Actual</h3>
        {activeTheme ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <div
                  className="w-12 h-12 rounded-lg"
                  style={{ backgroundColor: `hsl(${activeTheme.primaryColor})` }}
                />
                <div
                  className="w-12 h-12 rounded-lg"
                  style={{ backgroundColor: `hsl(${activeTheme.secondaryColor})` }}
                />
                <div
                  className="w-12 h-12 rounded-lg"
                  style={{ backgroundColor: `hsl(${activeTheme.accentColor})` }}
                />
              </div>
              <div>
                <p className="font-bold">{activeTheme.name}</p>
                <p className="text-sm text-muted-foreground">Activo en la tienda</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const saved = savedThemes.find(t => t.is_active)
                if (saved) handleDeactivateTheme(saved)
              }}
            >
              <PowerOff className="w-4 h-4 mr-2" />
              Desactivar
            </Button>
          </div>
        ) : (
          <p className="text-muted-foreground">No hay tema activo. Usando colores predeterminados.</p>
        )}
      </div>

      {/* Temas Guardados */}
      <div>
        <h3 className="font-heading font-bold mb-4">Mis Temas</h3>
        {isLoadingThemes ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : savedThemes.length === 0 ? (
          <div className="bg-muted/50 rounded-xl p-8 text-center">
            <Palette className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mb-4">No tienes temas guardados</p>
            <Button onClick={handleCreateNew}>
              <Plus className="w-4 h-4 mr-2" />
              Crear tu primer tema
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedThemes.map((theme) => (
              <div
                key={theme.id}
                className={cn(
                  'bg-card rounded-xl p-4 border-2 transition-all',
                  theme.is_active
                    ? 'border-primary shadow-lg'
                    : 'border-border hover:border-primary/50'
                )}
              >
                {/* Color Preview */}
                <div className="flex gap-2 mb-4">
                  <div
                    className="w-12 h-12 rounded-lg"
                    style={{ backgroundColor: `hsl(${theme.primary_color})` }}
                  />
                  <div
                    className="w-12 h-12 rounded-lg"
                    style={{ backgroundColor: `hsl(${theme.secondary_color})` }}
                  />
                  <div
                    className="w-12 h-12 rounded-lg"
                    style={{ backgroundColor: `hsl(${theme.accent_color})` }}
                  />
                </div>

                {/* Theme Info */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-bold">{theme.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {theme.is_active ? 'Activo' : 'Inactivo'}
                    </p>
                  </div>
                  {theme.is_active && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {theme.is_active ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDeactivateTheme(theme)}
                    >
                      <PowerOff className="w-4 h-4 mr-1" />
                      Desactivar
                    </Button>
                  ) : (
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleActivateTheme(theme)}
                    >
                      <Power className="w-4 h-4 mr-1" />
                      Activar
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditTheme(theme)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => {
                      setThemeToDelete(theme)
                      setDeleteDialogOpen(true)
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Plantillas Predefinidas */}
      <div>
        <h3 className="font-heading font-bold mb-4">Usar Plantilla</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Usa una plantilla predefinida como base para crear tu tema
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {presetThemes.map((theme) => (
            <button
              key={theme.key}
              type="button"
              onClick={() => handleUsePreset(theme)}
              className="bg-card rounded-xl p-3 border border-border hover:border-primary/50 transition-all text-left"
            >
              <div className="flex gap-1 mb-2">
                <div
                  className="w-6 h-6 rounded"
                  style={{ backgroundColor: `hsl(${theme.primaryColor})` }}
                />
                <div
                  className="w-6 h-6 rounded"
                  style={{ backgroundColor: `hsl(${theme.secondaryColor})` }}
                />
                <div
                  className="w-6 h-6 rounded"
                  style={{ backgroundColor: `hsl(${theme.accentColor})` }}
                />
              </div>
              <p className="text-xs font-medium truncate">{theme.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Editor Dialog */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isNewTheme ? 'Crear Nuevo Tema' : 'Editar Tema'}
            </DialogTitle>
            <DialogDescription>
              Personaliza los colores de tu tema
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="theme-name">Nombre del Tema *</Label>
              <Input
                id="theme-name"
                value={editingTheme.name}
                onChange={(e) => setEditingTheme(prev => ({
                  ...prev,
                  name: e.target.value,
                  slug: isNewTheme ? generateSlug(e.target.value) : prev.slug,
                }))}
                placeholder="Mi Tema Personalizado"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <ColorPicker
                  label="Color Primario"
                  value={editingTheme.primaryColor}
                  onChange={(value) => setEditingTheme(prev => ({ ...prev, primaryColor: value }))}
                />

                <ColorPicker
                  label="Color Secundario"
                  value={editingTheme.secondaryColor}
                  onChange={(value) => setEditingTheme(prev => ({ ...prev, secondaryColor: value }))}
                />

                <ColorPicker
                  label="Color de Acento"
                  value={editingTheme.accentColor}
                  onChange={(value) => setEditingTheme(prev => ({ ...prev, accentColor: value }))}
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Imagen de Banner (opcional)</Label>
                  <ImageUploader
                    value={editingTheme.bannerImage}
                    onChange={(url) => setEditingTheme(prev => ({ ...prev, bannerImage: url }))}
                    imageType="banner"
                    aspectRatio="16:9"
                  />
                </div>

                {/* Preview */}
                <div className="space-y-2">
                  <Label>Vista Previa</Label>
                  <div
                    className="rounded-lg p-4 space-y-3"
                    style={{
                      backgroundColor: `hsl(${editingTheme.secondaryColor})`,
                    }}
                  >
                    <h4
                      className="font-bold"
                      style={{ color: `hsl(${editingTheme.primaryColor})` }}
                    >
                      Título de Ejemplo
                    </h4>
                    <p
                      className="text-sm"
                      style={{
                        color: `hsl(${editingTheme.primaryColor})`,
                        opacity: 0.7,
                      }}
                    >
                      Texto de ejemplo
                    </p>
                    <button
                      className="px-4 py-2 rounded-lg text-white text-sm font-medium"
                      style={{
                        backgroundColor: `hsl(${editingTheme.accentColor})`,
                      }}
                    >
                      Botón
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={handlePreview}
              disabled={isSaving}
            >
              <Eye className="w-4 h-4 mr-2" />
              Vista Previa
            </Button>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={() => handleSaveTheme(false)}
                disabled={isSaving}
                className="flex-1 sm:flex-none"
              >
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Guardar
              </Button>
              <Button
                onClick={() => handleSaveTheme(true)}
                disabled={isSaving}
                className="flex-1 sm:flex-none"
              >
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                Guardar y Activar
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Tema</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar el tema &quot;{themeToDelete?.name}&quot;? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteTheme}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Info Box */}
      <div className="bg-muted/50 rounded-xl p-6 border border-border">
        <h3 className="font-heading font-bold mb-2">Como usar los temas</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>1. Crea un tema nuevo o usa una plantilla predefinida como base</li>
          <li>2. Personaliza los colores con los controles deslizantes</li>
          <li>3. Usa &quot;Vista Previa&quot; para ver cómo se verá en la tienda</li>
          <li>4. Guarda el tema para usarlo después o actívalo directamente</li>
          <li>5. Solo puede haber un tema activo a la vez</li>
        </ul>
      </div>
    </div>
  )
}
