"use client"

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'

// Definición de todas las secciones editables de la web
export interface HeroContent {
  title: string
  subtitle: string
  ctaText: string
  ctaLink: string
  secondaryCtaText?: string
  secondaryCtaLink?: string
  backgroundImage?: string
  showSearch: boolean
}

export interface BannerContent {
  text: string
  link?: string
  isVisible: boolean
  backgroundColor?: string
  textColor?: string
}

export interface AboutContent {
  title: string
  subtitle: string
  description: string
  image?: string
  stats: Array<{
    label: string
    value: string
  }>
}

export interface ContactContent {
  title: string
  subtitle: string
  phone: string
  whatsapp: string
  email: string
  address: string
  mapUrl?: string
  businessHours: {
    weekdays: { opens: string; closes: string }
    saturday: { opens: string; closes: string }
    sunday: { opens: string; closes: string }
  }
}

export interface SocialLinks {
  facebook?: string
  instagram?: string
  tiktok?: string
  youtube?: string
  twitter?: string
}

export interface FooterContent {
  description: string
  copyrightText: string
  showSocialLinks: boolean
  quickLinks: Array<{
    label: string
    url: string
  }>
}

export interface SectionVisibility {
  hero: boolean
  topBanner: boolean
  categories: boolean
  featuredProducts: boolean
  services: boolean
  promotions: boolean
  about: boolean
  testimonials: boolean
  faq: boolean
  contact: boolean
  newsletter: boolean
}

export interface ButtonStyles {
  primaryColor: string
  secondaryColor: string
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full'
}

export interface SiteContent {
  hero: HeroContent
  topBanner: BannerContent
  about: AboutContent
  contact: ContactContent
  social: SocialLinks
  footer: FooterContent
  sections: SectionVisibility
  buttons: ButtonStyles
}

// Contenido por defecto
const defaultContent: SiteContent = {
  hero: {
    title: 'Tu Librería de Confianza',
    subtitle: 'Todo lo que necesitas para el colegio, oficina y más. Calidad y precios justos.',
    ctaText: 'Ver Productos',
    ctaLink: '/productos',
    secondaryCtaText: 'Contáctanos',
    secondaryCtaLink: '/contacto',
    showSearch: true,
  },
  topBanner: {
    text: 'Envío gratis en compras mayores a S/50',
    isVisible: true,
  },
  about: {
    title: 'Sobre Nosotros',
    subtitle: 'Tu librería de confianza en San Juan de Lurigancho',
    description: 'Somos una librería con más de 10 años de experiencia ofreciendo los mejores productos escolares y de oficina.',
    stats: [
      { label: 'Años de experiencia', value: '10+' },
      { label: 'Clientes satisfechos', value: '5000+' },
      { label: 'Productos', value: '1000+' },
    ],
  },
  contact: {
    title: 'Contáctanos',
    subtitle: 'Estamos aquí para ayudarte',
    phone: '+51 999 999 999',
    whatsapp: '+51 999 999 999',
    email: 'contacto@libreria.com',
    address: 'Av. Principal 123, San Juan de Lurigancho, Lima',
    businessHours: {
      weekdays: { opens: '08:00', closes: '20:00' },
      saturday: { opens: '08:00', closes: '18:00' },
      sunday: { opens: '09:00', closes: '14:00' },
    },
  },
  social: {
    facebook: '',
    instagram: '',
    tiktok: '',
  },
  footer: {
    description: 'Tu librería de confianza con los mejores productos escolares y de oficina.',
    copyrightText: '© 2024 Librería Central. Todos los derechos reservados.',
    showSocialLinks: true,
    quickLinks: [
      { label: 'Inicio', url: '/' },
      { label: 'Productos', url: '/productos' },
      { label: 'Servicios', url: '/servicios' },
      { label: 'Contacto', url: '/contacto' },
    ],
  },
  sections: {
    hero: true,
    topBanner: true,
    categories: true,
    featuredProducts: true,
    services: true,
    promotions: true,
    about: true,
    testimonials: true,
    faq: true,
    contact: true,
    newsletter: true,
  },
  buttons: {
    primaryColor: '142 72% 50%',
    secondaryColor: '220 14% 10%',
    borderRadius: 'md',
  },
}

interface PreviewContentState {
  isActive: boolean
  content: SiteContent | null
  returnUrl: string
}

interface SiteContentContextType {
  content: SiteContent
  isLoading: boolean
  updateContent: (newContent: Partial<SiteContent>) => void
  updateSection: <K extends keyof SiteContent>(section: K, data: SiteContent[K]) => void
  saveContent: () => Promise<boolean>

  // Preview mode
  previewContentState: PreviewContentState
  startContentPreview: (content: SiteContent, returnUrl?: string) => void
  cancelContentPreview: () => void
  publishContentPreview: () => Promise<boolean>

  // Effective content
  effectiveContent: SiteContent
}

const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined)

const CONTENT_STORAGE_KEY = 'libreria-content-preview'

function getStoredPreviewContent(): PreviewContentState | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = sessionStorage.getItem(CONTENT_STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

function setStoredPreviewContent(state: PreviewContentState | null) {
  if (typeof window === 'undefined') return
  try {
    if (state) {
      sessionStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(state))
    } else {
      sessionStorage.removeItem(CONTENT_STORAGE_KEY)
    }
  } catch {
    // Ignore storage errors
  }
}

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaultContent)
  const [isLoading, setIsLoading] = useState(true)
  const [previewContentState, setPreviewContentState] = useState<PreviewContentState>({
    isActive: false,
    content: null,
    returnUrl: '/admin/contenido',
  })

  const effectiveContent = previewContentState.isActive && previewContentState.content
    ? previewContentState.content
    : content

  // Load content from API
  useEffect(() => {
    async function loadContent() {
      try {
        // Check for stored preview state
        const storedPreview = getStoredPreviewContent()
        if (storedPreview?.isActive && storedPreview.content) {
          setPreviewContentState(storedPreview)
        }

        const response = await fetch('/api/settings')
        if (response.ok) {
          const data = await response.json()
          if (data.settings?.site_content) {
            setContent(prev => ({
              ...prev,
              ...data.settings.site_content,
            }))
          }
        }
      } catch (error) {
        console.error('Error loading site content:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadContent()
  }, [])

  const updateContent = useCallback((newContent: Partial<SiteContent>) => {
    setContent(prev => ({
      ...prev,
      ...newContent,
    }))
  }, [])

  const updateSection = useCallback(<K extends keyof SiteContent>(
    section: K,
    data: SiteContent[K]
  ) => {
    setContent(prev => ({
      ...prev,
      [section]: data,
    }))
  }, [])

  const saveContent = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'site_content',
          value: content,
        }),
      })
      return response.ok
    } catch (error) {
      console.error('Error saving content:', error)
      return false
    }
  }, [content])

  // Preview mode functions
  const startContentPreview = useCallback((previewContent: SiteContent, returnUrl = '/admin/contenido') => {
    const newState: PreviewContentState = {
      isActive: true,
      content: previewContent,
      returnUrl,
    }
    setPreviewContentState(newState)
    setStoredPreviewContent(newState)
  }, [])

  const cancelContentPreview = useCallback(() => {
    const newState: PreviewContentState = {
      isActive: false,
      content: null,
      returnUrl: '/admin/contenido',
    }
    setPreviewContentState(newState)
    setStoredPreviewContent(null)
  }, [])

  const publishContentPreview = useCallback(async (): Promise<boolean> => {
    if (!previewContentState.content) return false

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'site_content',
          value: previewContentState.content,
        }),
      })

      if (response.ok) {
        setContent(previewContentState.content)
        const newState: PreviewContentState = {
          isActive: false,
          content: null,
          returnUrl: '/admin/contenido',
        }
        setPreviewContentState(newState)
        setStoredPreviewContent(null)
        return true
      }
      return false
    } catch (error) {
      console.error('Error publishing content:', error)
      return false
    }
  }, [previewContentState.content])

  return (
    <SiteContentContext.Provider
      value={{
        content,
        isLoading,
        updateContent,
        updateSection,
        saveContent,
        previewContentState,
        startContentPreview,
        cancelContentPreview,
        publishContentPreview,
        effectiveContent,
      }}
    >
      {children}
    </SiteContentContext.Provider>
  )
}

export function useSiteContent() {
  const context = useContext(SiteContentContext)
  if (context === undefined) {
    throw new Error('useSiteContent must be used within a SiteContentProvider')
  }
  return context
}

export { defaultContent }
