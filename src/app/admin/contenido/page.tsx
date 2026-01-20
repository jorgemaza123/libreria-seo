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
  Image as ImageIcon,
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

type SectionKey = 'hero' | 'banner' | 'about' | 'contact' | 'social' | 'footer' | 'sections' | 'buttons'

interface CollapsibleSectionProps {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  defaultOpen?: boolean
}

function CollapsibleSection({ title, icon, children, defaultOpen = false }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
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
        <div className="p-4 pt-0 border-t border-border">
          {children}
        </div>
      )}
    </div>
  )
}

export default function ContenidoPage() {
  const router = useRouter()
  const { content, isLoading, updateContent, saveContent, startContentPreview } = useSiteContent()
  const [localContent, setLocalContent] = useState<SiteContent>(defaultContent)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Sync local content with context
  useEffect(() => {
    if (!isLoading) {
      setLocalContent(content)
    }
  }, [content, isLoading])

  // Track changes
  useEffect(() => {
    setHasChanges(JSON.stringify(localContent) !== JSON.stringify(content))
  }, [localContent, content])

  const handleChange = <K extends keyof SiteContent>(
    section: K,
    field: keyof SiteContent[K],
    value: SiteContent[K][keyof SiteContent[K]]
  ) => {
    setLocalContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  const handleNestedChange = <K extends keyof SiteContent>(
    section: K,
    field: string,
    nestedField: string,
    value: string
  ) => {
    setLocalContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...(prev[section] as any)[field],
          [nestedField]: value,
        },
      },
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      updateContent(localContent)
      const success = await saveContent()
      if (success) {
        toast.success('Contenido guardado correctamente')
        setHasChanges(false)
      } else {
        toast.error('Error al guardar el contenido')
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold">Contenido del Sitio</h2>
          <p className="text-muted-foreground">
            Edita todos los textos, imágenes y configuraciones de tu web
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Descartar
            </Button>
          )}
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="w-4 h-4 mr-2" />
            Vista Previa
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !hasChanges}>
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Guardar
          </Button>
        </div>
      </div>

      {/* Changes indicator */}
      {hasChanges && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-amber-800 text-sm">
          Tienes cambios sin guardar. No olvides guardar antes de salir.
        </div>
      )}

      {/* Sections */}
      <div className="space-y-4">
        {/* Hero Section */}
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
                <Label htmlFor="hero-cta">Texto del Botón Principal</Label>
                <Input
                  id="hero-cta"
                  value={localContent.hero.ctaText}
                  onChange={(e) => handleChange('hero', 'ctaText', e.target.value)}
                  placeholder="Ver Productos"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero-cta-link">Enlace del Botón Principal</Label>
                <Input
                  id="hero-cta-link"
                  value={localContent.hero.ctaLink}
                  onChange={(e) => handleChange('hero', 'ctaLink', e.target.value)}
                  placeholder="/productos"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hero-secondary-cta">Texto del Botón Secundario</Label>
                <Input
                  id="hero-secondary-cta"
                  value={localContent.hero.secondaryCtaText || ''}
                  onChange={(e) => handleChange('hero', 'secondaryCtaText', e.target.value)}
                  placeholder="Contáctanos"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero-secondary-link">Enlace del Botón Secundario</Label>
                <Input
                  id="hero-secondary-link"
                  value={localContent.hero.secondaryCtaLink || ''}
                  onChange={(e) => handleChange('hero', 'secondaryCtaLink', e.target.value)}
                  placeholder="/contacto"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Imagen de Fondo del Hero</Label>
              <ImageUploader
                value={localContent.hero.backgroundImage}
                onChange={(url) => handleChange('hero', 'backgroundImage', url || '')}
                imageType="hero"
                aspectRatio="16:9"
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="hero-search"
                checked={localContent.hero.showSearch}
                onCheckedChange={(checked) => handleChange('hero', 'showSearch', checked)}
              />
              <Label htmlFor="hero-search">Mostrar barra de búsqueda en el Hero</Label>
            </div>
          </div>
        </CollapsibleSection>

        {/* Top Banner */}
        <CollapsibleSection title="Banner Superior" icon={<Type className="w-5 h-5" />}>
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-2">
              <Switch
                id="banner-visible"
                checked={localContent.topBanner.isVisible}
                onCheckedChange={(checked) => handleChange('topBanner', 'isVisible', checked)}
              />
              <Label htmlFor="banner-visible">Mostrar banner superior</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="banner-text">Texto del Banner</Label>
              <Input
                id="banner-text"
                value={localContent.topBanner.text}
                onChange={(e) => handleChange('topBanner', 'text', e.target.value)}
                placeholder="Envío gratis en compras mayores a S/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="banner-link">Enlace (opcional)</Label>
              <Input
                id="banner-link"
                value={localContent.topBanner.link || ''}
                onChange={(e) => handleChange('topBanner', 'link', e.target.value)}
                placeholder="/promociones"
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* About Section */}
        <CollapsibleSection title="Sección Sobre Nosotros" icon={<MessageSquare className="w-5 h-5" />}>
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="about-title">Título</Label>
                <Input
                  id="about-title"
                  value={localContent.about.title}
                  onChange={(e) => handleChange('about', 'title', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="about-subtitle">Subtítulo</Label>
                <Input
                  id="about-subtitle"
                  value={localContent.about.subtitle}
                  onChange={(e) => handleChange('about', 'subtitle', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="about-description">Descripción</Label>
              <Textarea
                id="about-description"
                value={localContent.about.description}
                onChange={(e) => handleChange('about', 'description', e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Imagen de la Sección</Label>
              <ImageUploader
                value={localContent.about.image}
                onChange={(url) => handleChange('about', 'image', url || '')}
                imageType="general"
                aspectRatio="4:3"
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* Contact Section */}
        <CollapsibleSection title="Información de Contacto" icon={<Phone className="w-5 h-5" />}>
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact-title">Título</Label>
                <Input
                  id="contact-title"
                  value={localContent.contact.title}
                  onChange={(e) => handleChange('contact', 'title', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-subtitle">Subtítulo</Label>
                <Input
                  id="contact-subtitle"
                  value={localContent.contact.subtitle}
                  onChange={(e) => handleChange('contact', 'subtitle', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact-phone">Teléfono</Label>
                <Input
                  id="contact-phone"
                  value={localContent.contact.phone}
                  onChange={(e) => handleChange('contact', 'phone', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-whatsapp">WhatsApp</Label>
                <Input
                  id="contact-whatsapp"
                  value={localContent.contact.whatsapp}
                  onChange={(e) => handleChange('contact', 'whatsapp', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact-email">Email</Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={localContent.contact.email}
                  onChange={(e) => handleChange('contact', 'email', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-address">Dirección</Label>
                <Input
                  id="contact-address"
                  value={localContent.contact.address}
                  onChange={(e) => handleChange('contact', 'address', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Horarios de Atención</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Lunes a Viernes</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="08:00"
                      value={localContent.contact.businessHours.weekdays.opens}
                      onChange={(e) => handleNestedChange('contact', 'businessHours', 'weekdays', e.target.value)}
                      className="text-sm"
                    />
                    <span className="self-center">-</span>
                    <Input
                      placeholder="20:00"
                      value={localContent.contact.businessHours.weekdays.closes}
                      onChange={(e) => {
                        setLocalContent(prev => ({
                          ...prev,
                          contact: {
                            ...prev.contact,
                            businessHours: {
                              ...prev.contact.businessHours,
                              weekdays: {
                                ...prev.contact.businessHours.weekdays,
                                closes: e.target.value,
                              },
                            },
                          },
                        }))
                      }}
                      className="text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Sábado</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="08:00"
                      value={localContent.contact.businessHours.saturday.opens}
                      onChange={(e) => {
                        setLocalContent(prev => ({
                          ...prev,
                          contact: {
                            ...prev.contact,
                            businessHours: {
                              ...prev.contact.businessHours,
                              saturday: {
                                ...prev.contact.businessHours.saturday,
                                opens: e.target.value,
                              },
                            },
                          },
                        }))
                      }}
                      className="text-sm"
                    />
                    <span className="self-center">-</span>
                    <Input
                      placeholder="18:00"
                      value={localContent.contact.businessHours.saturday.closes}
                      onChange={(e) => {
                        setLocalContent(prev => ({
                          ...prev,
                          contact: {
                            ...prev.contact,
                            businessHours: {
                              ...prev.contact.businessHours,
                              saturday: {
                                ...prev.contact.businessHours.saturday,
                                closes: e.target.value,
                              },
                            },
                          },
                        }))
                      }}
                      className="text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Domingo</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="09:00"
                      value={localContent.contact.businessHours.sunday.opens}
                      onChange={(e) => {
                        setLocalContent(prev => ({
                          ...prev,
                          contact: {
                            ...prev.contact,
                            businessHours: {
                              ...prev.contact.businessHours,
                              sunday: {
                                ...prev.contact.businessHours.sunday,
                                opens: e.target.value,
                              },
                            },
                          },
                        }))
                      }}
                      className="text-sm"
                    />
                    <span className="self-center">-</span>
                    <Input
                      placeholder="14:00"
                      value={localContent.contact.businessHours.sunday.closes}
                      onChange={(e) => {
                        setLocalContent(prev => ({
                          ...prev,
                          contact: {
                            ...prev.contact,
                            businessHours: {
                              ...prev.contact.businessHours,
                              sunday: {
                                ...prev.contact.businessHours.sunday,
                                closes: e.target.value,
                              },
                            },
                          },
                        }))
                      }}
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Social Media */}
        <CollapsibleSection title="Redes Sociales" icon={<Share2 className="w-5 h-5" />}>
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="social-facebook">Facebook</Label>
                <Input
                  id="social-facebook"
                  value={localContent.social.facebook || ''}
                  onChange={(e) => handleChange('social', 'facebook', e.target.value)}
                  placeholder="https://facebook.com/tu-pagina"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="social-instagram">Instagram</Label>
                <Input
                  id="social-instagram"
                  value={localContent.social.instagram || ''}
                  onChange={(e) => handleChange('social', 'instagram', e.target.value)}
                  placeholder="https://instagram.com/tu-cuenta"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="social-tiktok">TikTok</Label>
                <Input
                  id="social-tiktok"
                  value={localContent.social.tiktok || ''}
                  onChange={(e) => handleChange('social', 'tiktok', e.target.value)}
                  placeholder="https://tiktok.com/@tu-cuenta"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="social-youtube">YouTube</Label>
                <Input
                  id="social-youtube"
                  value={localContent.social.youtube || ''}
                  onChange={(e) => handleChange('social', 'youtube', e.target.value)}
                  placeholder="https://youtube.com/@tu-canal"
                />
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Footer */}
        <CollapsibleSection title="Pie de Página (Footer)" icon={<LayoutGrid className="w-5 h-5" />}>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="footer-description">Descripción del Footer</Label>
              <Textarea
                id="footer-description"
                value={localContent.footer.description}
                onChange={(e) => handleChange('footer', 'description', e.target.value)}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="footer-copyright">Texto de Copyright</Label>
              <Input
                id="footer-copyright"
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
              <Label htmlFor="footer-social">Mostrar enlaces de redes sociales</Label>
            </div>
          </div>
        </CollapsibleSection>

        {/* Section Visibility */}
        <CollapsibleSection title="Visibilidad de Secciones" icon={<LayoutGrid className="w-5 h-5" />}>
          <div className="space-y-4 pt-4">
            <p className="text-sm text-muted-foreground mb-4">
              Activa o desactiva las secciones que deseas mostrar en la página principal.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(localContent.sections).map(([key, value]) => {
                const labels: Record<string, string> = {
                  hero: 'Hero / Portada',
                  topBanner: 'Banner Superior',
                  categories: 'Categorías',
                  featuredProducts: 'Productos Destacados',
                  services: 'Servicios',
                  promotions: 'Promociones',
                  about: 'Sobre Nosotros',
                  testimonials: 'Testimonios',
                  faq: 'Preguntas Frecuentes',
                  contact: 'Contacto',
                  newsletter: 'Newsletter',
                }
                return (
                  <div key={key} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <Switch
                      id={`section-${key}`}
                      checked={value}
                      onCheckedChange={(checked) => {
                        setLocalContent(prev => ({
                          ...prev,
                          sections: {
                            ...prev.sections,
                            [key]: checked,
                          },
                        }))
                      }}
                    />
                    <Label htmlFor={`section-${key}`} className="text-sm">
                      {labels[key] || key}
                    </Label>
                  </div>
                )
              })}
            </div>
          </div>
        </CollapsibleSection>

        {/* Button Styles */}
        <CollapsibleSection title="Estilo de Botones" icon={<Palette className="w-5 h-5" />}>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Radio de Borde</Label>
              <Select
                value={localContent.buttons.borderRadius}
                onValueChange={(value) => handleChange('buttons', 'borderRadius', value as 'none' | 'sm' | 'md' | 'lg' | 'full')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin bordes redondeados</SelectItem>
                  <SelectItem value="sm">Pequeño</SelectItem>
                  <SelectItem value="md">Mediano</SelectItem>
                  <SelectItem value="lg">Grande</SelectItem>
                  <SelectItem value="full">Completamente redondeado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-3">Vista previa de botones:</p>
              <div className="flex gap-2 flex-wrap">
                <Button
                  className={cn(
                    localContent.buttons.borderRadius === 'none' && 'rounded-none',
                    localContent.buttons.borderRadius === 'sm' && 'rounded-sm',
                    localContent.buttons.borderRadius === 'md' && 'rounded-md',
                    localContent.buttons.borderRadius === 'lg' && 'rounded-lg',
                    localContent.buttons.borderRadius === 'full' && 'rounded-full'
                  )}
                >
                  Botón Primario
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
          </div>
        </CollapsibleSection>
      </div>
    </div>
  )
}
