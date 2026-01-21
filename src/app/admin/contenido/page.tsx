"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Save,
  Eye,
  RotateCcw,
  Loader2,
  Home,
  MessageSquare,
  Phone,
  Share2,
  LayoutGrid,
  Palette,
  Type,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { useSiteContent, defaultContent, SiteContent } from '@/contexts/SiteContentContext'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

// --- Componente de Sección Colapsable ---
interface CollapsibleSectionProps {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  defaultOpen?: boolean
}

function CollapsibleSection({ title, icon, children, defaultOpen = false }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
          <h3 className="font-heading font-bold text-lg">{title}</h3>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>
      {isOpen && (
        <div className="p-4 pt-0 border-t border-border animate-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </div>
  )
}

// --- Página Principal ---
export default function ContenidoPage() {
  const router = useRouter()
  const { content, isLoading, updateContent, startContentPreview } = useSiteContent()
  
  // Estado local para editar sin afectar la web hasta guardar
  const [localContent, setLocalContent] = useState<SiteContent>(defaultContent)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // 1. Sincronizar estado local con el contexto al cargar
  useEffect(() => {
    if (!isLoading && content) {
      setLocalContent(content)
    }
  }, [content, isLoading])

  // 2. Detectar cambios sin guardar
  useEffect(() => {
    setHasChanges(JSON.stringify(localContent) !== JSON.stringify(content))
  }, [localContent, content])

  // Helper para cambios directos (ej: hero.title)
  const handleChange = <K extends keyof SiteContent>(
    section: K,
    field: keyof SiteContent[K],
    value: any
  ) => {
    setLocalContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  // Helper para cambios profundos (ej: contact.businessHours.weekdays.opens)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDeepChange = (section: keyof SiteContent, path: string[], value: any) => {
    setLocalContent(prev => {
      const newSection = { ...prev[section] }
      let current = newSection as any
      
      // Navegar hasta el penúltimo nivel
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]]
      }
      
      // Asignar valor
      current[path[path.length - 1]] = value
      
      return {
        ...prev,
        [section]: newSection
      }
    })
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // 1. Guardamos directamente en la API para persistencia inmediata
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'site_content',
          value: localContent,
        }),
      })

      if (response.ok) {
        // 2. Actualizamos el contexto global para que la app lo vea sin recargar
        updateContent(localContent)
        setHasChanges(false)
        toast.success('Contenido guardado y publicado correctamente')
      } else {
        throw new Error('Error en la API')
      }
    } catch (error) {
      console.error('Error saving:', error)
      toast.error('Error al guardar el contenido')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePreview = () => {
    startContentPreview(localContent, '/admin/contenido')
    router.push('/')
  }

  const handleReset = () => {
    setLocalContent(content)
    toast.info('Cambios descartados')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sticky top-0 z-10 bg-background/80 backdrop-blur-md p-4 -mx-4 border-b border-border/50">
        <div>
          <h2 className="text-2xl font-heading font-bold">Contenido del Sitio</h2>
          <p className="text-muted-foreground text-sm">
            Personaliza la apariencia y textos de tu web
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <Button variant="ghost" size="sm" onClick={handleReset} className="text-muted-foreground">
              <RotateCcw className="w-4 h-4 mr-2" />
              Descartar
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handlePreview}>
            <Eye className="w-4 h-4 mr-2" />
            Previsualizar
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !hasChanges} size="sm">
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Guardar Cambios
          </Button>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        
        {/* 1. HERO SECTION */}
        <CollapsibleSection title="Hero / Portada Principal" icon={<Home className="w-5 h-5" />} defaultOpen>
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hero-title">Título Principal</Label>
                <Input
                  id="hero-title"
                  value={localContent.hero.title}
                  onChange={(e) => handleChange('hero', 'title', e.target.value)}
                  placeholder="Tu Librería de Confianza"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero-subtitle">Subtítulo</Label>
                <Input
                  id="hero-subtitle"
                  value={localContent.hero.subtitle}
                  onChange={(e) => handleChange('hero', 'subtitle', e.target.value)}
                  placeholder="Todo lo que necesitas..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hero-cta">Botón Principal (Texto)</Label>
                <Input
                  id="hero-cta"
                  value={localContent.hero.ctaText}
                  onChange={(e) => handleChange('hero', 'ctaText', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero-cta-link">Botón Principal (Enlace)</Label>
                <Input
                  id="hero-cta-link"
                  value={localContent.hero.ctaLink}
                  onChange={(e) => handleChange('hero', 'ctaLink', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hero-sec-cta">Botón Secundario (Texto)</Label>
                <Input
                  id="hero-sec-cta"
                  value={localContent.hero.secondaryCtaText || ''}
                  onChange={(e) => handleChange('hero', 'secondaryCtaText', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero-sec-link">Botón Secundario (Enlace)</Label>
                <Input
                  id="hero-sec-link"
                  value={localContent.hero.secondaryCtaLink || ''}
                  onChange={(e) => handleChange('hero', 'secondaryCtaLink', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Imagen de Fondo</Label>
              <ImageUploader
                value={localContent.hero.backgroundImage}
                onChange={(url) => handleChange('hero', 'backgroundImage', url || '')}
                imageType="hero"
                aspectRatio="16:9"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Switch
                id="hero-search"
                checked={localContent.hero.showSearch}
                onCheckedChange={(checked) => handleChange('hero', 'showSearch', checked)}
              />
              <Label htmlFor="hero-search">Mostrar barra de búsqueda</Label>
            </div>
          </div>
        </CollapsibleSection>

        {/* 2. TOP BANNER */}
        <CollapsibleSection title="Banner Superior" icon={<Type className="w-5 h-5" />}>
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-2">
              <Switch
                id="banner-visible"
                checked={localContent.topBanner.isVisible}
                onCheckedChange={(checked) => handleChange('topBanner', 'isVisible', checked)}
              />
              <Label htmlFor="banner-visible">Activar banner superior</Label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                <Label htmlFor="banner-text">Texto del Banner</Label>
                <Input
                    id="banner-text"
                    value={localContent.topBanner.text}
                    onChange={(e) => handleChange('topBanner', 'text', e.target.value)}
                />
                </div>
                <div className="space-y-2">
                <Label htmlFor="banner-link">Enlace (Opcional)</Label>
                <Input
                    id="banner-link"
                    value={localContent.topBanner.link || ''}
                    onChange={(e) => handleChange('topBanner', 'link', e.target.value)}
                />
                </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* 3. ABOUT SECTION */}
        <CollapsibleSection title="Sobre Nosotros" icon={<MessageSquare className="w-5 h-5" />}>
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Título</Label>
                <Input
                  value={localContent.about.title}
                  onChange={(e) => handleChange('about', 'title', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Subtítulo</Label>
                <Input
                  value={localContent.about.subtitle}
                  onChange={(e) => handleChange('about', 'subtitle', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Descripción</Label>
              <Textarea
                value={localContent.about.description}
                onChange={(e) => handleChange('about', 'description', e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Imagen Ilustrativa</Label>
              <ImageUploader
                value={localContent.about.image}
                onChange={(url) => handleChange('about', 'image', url || '')}
                imageType="general"
                aspectRatio="4:3"
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* 4. CONTACT SECTION */}
        <CollapsibleSection title="Información de Contacto" icon={<Phone className="w-5 h-5" />}>
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Título</Label>
                <Input
                  value={localContent.contact.title}
                  onChange={(e) => handleChange('contact', 'title', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Subtítulo</Label>
                <Input
                  value={localContent.contact.subtitle}
                  onChange={(e) => handleChange('contact', 'subtitle', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Teléfono</Label>
                <Input
                  value={localContent.contact.phone}
                  onChange={(e) => handleChange('contact', 'phone', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>WhatsApp</Label>
                <Input
                  value={localContent.contact.whatsapp}
                  onChange={(e) => handleChange('contact', 'whatsapp', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={localContent.contact.email}
                  onChange={(e) => handleChange('contact', 'email', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Dirección</Label>
                <Input
                  value={localContent.contact.address}
                  onChange={(e) => handleChange('contact', 'address', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Horarios de Atención</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                {/* Lunes a Viernes */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase">Lunes a Viernes</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      className="h-8 text-sm"
                      value={localContent.contact.businessHours.weekdays.opens}
                      onChange={(e) => handleDeepChange('contact', ['businessHours', 'weekdays', 'opens'], e.target.value)}
                    />
                    <span>-</span>
                    <Input
                      className="h-8 text-sm"
                      value={localContent.contact.businessHours.weekdays.closes}
                      onChange={(e) => handleDeepChange('contact', ['businessHours', 'weekdays', 'closes'], e.target.value)}
                    />
                  </div>
                </div>
                {/* Sábado */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase">Sábado</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      className="h-8 text-sm"
                      value={localContent.contact.businessHours.saturday.opens}
                      onChange={(e) => handleDeepChange('contact', ['businessHours', 'saturday', 'opens'], e.target.value)}
                    />
                    <span>-</span>
                    <Input
                      className="h-8 text-sm"
                      value={localContent.contact.businessHours.saturday.closes}
                      onChange={(e) => handleDeepChange('contact', ['businessHours', 'saturday', 'closes'], e.target.value)}
                    />
                  </div>
                </div>
                {/* Domingo */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase">Domingo</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      className="h-8 text-sm"
                      value={localContent.contact.businessHours.sunday.opens}
                      onChange={(e) => handleDeepChange('contact', ['businessHours', 'sunday', 'opens'], e.target.value)}
                    />
                    <span>-</span>
                    <Input
                      className="h-8 text-sm"
                      value={localContent.contact.businessHours.sunday.closes}
                      onChange={(e) => handleDeepChange('contact', ['businessHours', 'sunday', 'closes'], e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* 5. SOCIAL MEDIA */}
        <CollapsibleSection title="Redes Sociales" icon={<Share2 className="w-5 h-5" />}>
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Facebook URL</Label>
                <Input
                  value={localContent.social.facebook || ''}
                  onChange={(e) => handleChange('social', 'facebook', e.target.value)}
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label>Instagram URL</Label>
                <Input
                  value={localContent.social.instagram || ''}
                  onChange={(e) => handleChange('social', 'instagram', e.target.value)}
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label>TikTok URL</Label>
                <Input
                  value={localContent.social.tiktok || ''}
                  onChange={(e) => handleChange('social', 'tiktok', e.target.value)}
                  placeholder="https://tiktok.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label>YouTube URL</Label>
                <Input
                  value={localContent.social.youtube || ''}
                  onChange={(e) => handleChange('social', 'youtube', e.target.value)}
                  placeholder="https://youtube.com/..."
                />
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* 6. FOOTER */}
        <CollapsibleSection title="Pie de Página (Footer)" icon={<LayoutGrid className="w-5 h-5" />}>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Descripción Corta</Label>
              <Textarea
                value={localContent.footer.description}
                onChange={(e) => handleChange('footer', 'description', e.target.value)}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Texto Copyright</Label>
              <Input
                value={localContent.footer.copyrightText}
                onChange={(e) => handleChange('footer', 'copyrightText', e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="footer-social"
                checked={localContent.footer.showSocialLinks}
                onCheckedChange={(checked) => handleChange('footer', 'showSocialLinks', checked)}
              />
              <Label htmlFor="footer-social">Mostrar iconos sociales</Label>
            </div>
          </div>
        </CollapsibleSection>

        {/* 7. VISIBILITY */}
        <CollapsibleSection title="Visibilidad de Secciones" icon={<Eye className="w-5 h-5" />}>
          <div className="space-y-4 pt-4">
            <p className="text-sm text-muted-foreground mb-2">
              Activa o desactiva los bloques de la página de inicio.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(localContent.sections).map(([key, value]) => {
                const labels: Record<string, string> = {
                  hero: 'Hero / Portada',
                  topBanner: 'Banner Superior',
                  categories: 'Categorías',
                  featuredProducts: 'Destacados',
                  services: 'Servicios',
                  promotions: 'Promociones',
                  about: 'Sobre Nosotros',
                  testimonials: 'Testimonios',
                  faq: 'Preguntas Frecuentes',
                  contact: 'Contacto',
                  newsletter: 'Boletín',
                }
                return (
                  <div key={key} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border">
                    <Switch
                      id={`section-${key}`}
                      checked={value}
                      onCheckedChange={(checked) => {
                        setLocalContent(prev => ({
                          ...prev,
                          sections: { ...prev.sections, [key]: checked }
                        }))
                      }}
                    />
                    <Label htmlFor={`section-${key}`} className="cursor-pointer">
                      {labels[key] || key}
                    </Label>
                  </div>
                )
              })}
            </div>
          </div>
        </CollapsibleSection>

        {/* 8. BUTTON STYLES */}
        <CollapsibleSection title="Estilo de Botones" icon={<Palette className="w-5 h-5" />}>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Redondeo de Bordes</Label>
              <Select
                value={localContent.buttons.borderRadius}
                onValueChange={(value) => handleChange('buttons', 'borderRadius', value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Cuadrado (None)</SelectItem>
                  <SelectItem value="sm">Pequeño (Small)</SelectItem>
                  <SelectItem value="md">Mediano (Medium)</SelectItem>
                  <SelectItem value="lg">Grande (Large)</SelectItem>
                  <SelectItem value="full">Redondo (Full)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-6 bg-muted/50 rounded-lg flex gap-4 items-center justify-center border border-dashed">
              <Button
                className={cn(
                  localContent.buttons.borderRadius === 'none' && 'rounded-none',
                  localContent.buttons.borderRadius === 'sm' && 'rounded-sm',
                  localContent.buttons.borderRadius === 'md' && 'rounded-md',
                  localContent.buttons.borderRadius === 'lg' && 'rounded-lg',
                  localContent.buttons.borderRadius === 'full' && 'rounded-full'
                )}
              >
                Botón Principal
              </Button>
              <Button
                variant="outline"
                className={cn(
                  localContent.buttons.borderRadius === 'none' && 'rounded-none',
                  localContent.buttons.borderRadius === 'sm' && 'rounded-sm',
                  localContent.buttons.borderRadius === 'md' && 'rounded-md',
                  localContent.buttons.borderRadius === 'lg' && 'rounded-lg',
                  localContent.buttons.borderRadius === 'full' && 'rounded-full'
                )}
              >
                Botón Secundario
              </Button>
            </div>
          </div>
        </CollapsibleSection>

      </div>
    </div>
  )
}