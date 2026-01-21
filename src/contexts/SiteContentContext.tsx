"use client"

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { mockProducts, mockCategories, mockServices, mockPromotions } from '@/lib/mock-data'
import type { Product, Category, Service, Promotion } from '@/lib/types'

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

  // Data from Supabase
  products: Product[]
  categories: Category[]
  services: Service[]
  promotions: Promotion[]
  isLoadingData: boolean

  // Refresh functions
  refreshProducts: () => Promise<void>
  refreshCategories: () => Promise<void>
  refreshServices: () => Promise<void>
  refreshPromotions: () => Promise<void>
  refreshAll: () => Promise<void>
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

  // Data states
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [categories, setCategories] = useState<Category[]>(mockCategories)
  const [services, setServices] = useState<Service[]>(mockServices)
  const [promotions, setPromotions] = useState<Promotion[]>(mockPromotions)
  const [isLoadingData, setIsLoadingData] = useState(true)

  const effectiveContent = previewContentState.isActive && previewContentState.content
    ? previewContentState.content
    : content

  // Fetch products from API
  const refreshProducts = useCallback(async () => {
    try {
      console.log('[SiteContent] Cargando productos desde API...')
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        console.log('[SiteContent] Productos recibidos de Supabase:', data.products?.length || 0)
        if (data.products && data.products.length > 0) {
          // Transform DB format to frontend format
          const transformedProducts = data.products.map((p: Record<string, unknown>) => ({
            id: p.id as string,
            name: p.name as string,
            slug: p.slug as string,
            description: p.description as string || '',
            price: p.price as number,
            salePrice: p.sale_price as number | undefined,
            sku: p.sku as string || '',
            category: (p.category as Record<string, string>)?.name || p.category_name as string || '',
            categorySlug: (p.category as Record<string, string>)?.slug || p.category_slug as string || '',
            stock: p.stock as number || 0,
            image: p.image as string || '',
            gallery: p.gallery as string[] || [],
            isActive: p.is_active as boolean ?? true,
            isFeatured: p.is_featured as boolean ?? false,
            createdAt: p.created_at as string,
            updatedAt: p.updated_at as string,
          }))
          setProducts(transformedProducts)
        }
      }
    } catch (error) {
      console.error('Error loading products:', error)
    }
  }, [])

  // Fetch categories from API
  const refreshCategories = useCallback(async () => {
    try {
      console.log('[SiteContent] Cargando categorías desde API...')
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        console.log('[SiteContent] Categorías recibidas de Supabase:', data.categories?.length || 0, data)
        if (data.categories && data.categories.length > 0) {
          const transformedCategories = data.categories.map((c: Record<string, unknown>) => ({
            id: c.id as string,
            name: c.name as string,
            slug: c.slug as string,
            icon: c.icon as string || '',
            description: c.description as string || '',
            gallery: c.gallery as string[] || [],
            order: c.order as number || 0,
            isActive: c.is_active as boolean ?? true,
          }))
          setCategories(transformedCategories)
        }
      }
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }, [])

  // Fetch services from API
  const refreshServices = useCallback(async () => {
    try {
      console.log('[SiteContent] Cargando servicios desde API...')
      const response = await fetch('/api/services')
      if (response.ok) {
        const data = await response.json()
        console.log('[SiteContent] Servicios recibidos de Supabase:', data.services?.length || 0, data)
        if (data.services && data.services.length > 0) {
          const transformedServices = data.services.map((s: Record<string, unknown>) => ({
            id: s.id as string,
            name: s.name as string,
            slug: s.slug as string,
            description: s.description as string || '',
            shortDescription: s.short_description as string || '',
            icon: s.icon as string || '',
            price: s.price as string || '',
            image: s.image as string || '',
            isActive: s.is_active as boolean ?? true,
            order: s.order as number || 0,
          }))
          setServices(transformedServices)
        }
      }
    } catch (error) {
      console.error('Error loading services:', error)
    }
  }, [])

  // Fetch promotions from API
  const refreshPromotions = useCallback(async () => {
    try {
      console.log('[SiteContent] Cargando promociones desde API...')
      const response = await fetch('/api/promotions')
      if (response.ok) {
        const data = await response.json()
        console.log('[SiteContent] Promociones recibidas de Supabase:', data.promotions?.length || 0, data)
        if (data.promotions && data.promotions.length > 0) {
          setPromotions(data.promotions)
        }
      }
    } catch (error) {
      console.error('Error loading promotions:', error)
    }
  }, [])

  // Refresh all data
  const refreshAll = useCallback(async () => {
    setIsLoadingData(true)
    await Promise.all([
      refreshProducts(),
      refreshCategories(),
      refreshServices(),
      refreshPromotions(),
    ])
    setIsLoadingData(false)
  }, [refreshProducts, refreshCategories, refreshServices, refreshPromotions])

  // Load content from API
  useEffect(() => {
    async function loadContent() {
      try {
        console.log('[SiteContent] Cargando configuración del sitio desde API...')
        // Check for stored preview state
        const storedPreview = getStoredPreviewContent()
        if (storedPreview?.isActive && storedPreview.content) {
          setPreviewContentState(storedPreview)
        }

        const response = await fetch('/api/settings')
        if (response.ok) {
          const data = await response.json()
          console.log('[SiteContent] Settings cargados de Supabase:', data)
          if (data.settings?.site_content) {
            console.log('[SiteContent] Aplicando site_content:', data.settings.site_content)
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

  // Load all data on mount
  useEffect(() => {
    refreshAll()
  }, [refreshAll])

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
        // Data
        products,
        categories,
        services,
        promotions,
        isLoadingData,
        // Refresh functions
        refreshProducts,
        refreshCategories,
        refreshServices,
        refreshPromotions,
        refreshAll,
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
