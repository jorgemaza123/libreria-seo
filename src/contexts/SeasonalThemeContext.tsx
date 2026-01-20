"use client"

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'

export interface SeasonalTheme {
  id: string
  name: string
  slug: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  bannerImage?: string | null
}

interface PreviewState {
  isActive: boolean
  theme: SeasonalTheme | null
  returnUrl: string
}

interface SeasonalThemeContextType {
  // Current active theme (from DB)
  theme: SeasonalTheme | null
  isLoading: boolean
  setTheme: (theme: SeasonalTheme | null) => void

  // Preview mode
  previewState: PreviewState
  startPreview: (theme: SeasonalTheme, returnUrl?: string) => void
  cancelPreview: () => void
  publishPreview: () => Promise<boolean>

  // Helper to get the effective theme (preview or active)
  effectiveTheme: SeasonalTheme | null
}

const SeasonalThemeContext = createContext<SeasonalThemeContextType | undefined>(undefined)

// Default themes that can be used when Supabase is not configured
const defaultThemes: Record<string, SeasonalTheme> = {
  'default': {
    id: 'default',
    name: 'Default',
    slug: 'default',
    primaryColor: '220 14% 10%',
    secondaryColor: '220 14% 96%',
    accentColor: '142 72% 50%',
  },
  'san-valentin': {
    id: 'san-valentin',
    name: 'San Valentín',
    slug: 'san-valentin',
    primaryColor: '340 82% 52%',
    secondaryColor: '340 100% 95%',
    accentColor: '340 82% 45%',
  },
  'dia-madre': {
    id: 'dia-madre',
    name: 'Día de la Madre',
    slug: 'dia-madre',
    primaryColor: '300 76% 50%',
    secondaryColor: '300 100% 95%',
    accentColor: '300 76% 45%',
  },
  'fiestas-patrias': {
    id: 'fiestas-patrias',
    name: 'Fiestas Patrias',
    slug: 'fiestas-patrias',
    primaryColor: '0 100% 50%',
    secondaryColor: '0 0% 100%',
    accentColor: '0 0% 0%',
  },
  'navidad': {
    id: 'navidad',
    name: 'Navidad',
    slug: 'navidad',
    primaryColor: '120 61% 34%',
    secondaryColor: '0 100% 50%',
    accentColor: '43 74% 49%',
  },
  'regreso-clases': {
    id: 'regreso-clases',
    name: 'Regreso a Clases',
    slug: 'regreso-clases',
    primaryColor: '210 100% 50%',
    secondaryColor: '48 100% 50%',
    accentColor: '142 72% 50%',
  },
}

function applyThemeToDOM(theme: SeasonalTheme | null) {
  if (typeof document === 'undefined') return

  const root = document.documentElement

  if (!theme) {
    // Reset to default
    root.style.removeProperty('--theme-primary')
    root.style.removeProperty('--theme-secondary')
    root.style.removeProperty('--theme-accent')
    return
  }

  // Apply theme CSS custom properties
  root.style.setProperty('--theme-primary', theme.primaryColor)
  root.style.setProperty('--theme-secondary', theme.secondaryColor)
  root.style.setProperty('--theme-accent', theme.accentColor)
}

// Storage key for preview state
const PREVIEW_STORAGE_KEY = 'libreria-preview-state'

function getStoredPreviewState(): PreviewState | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = sessionStorage.getItem(PREVIEW_STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

function setStoredPreviewState(state: PreviewState | null) {
  if (typeof window === 'undefined') return
  try {
    if (state) {
      sessionStorage.setItem(PREVIEW_STORAGE_KEY, JSON.stringify(state))
    } else {
      sessionStorage.removeItem(PREVIEW_STORAGE_KEY)
    }
  } catch {
    // Ignore storage errors
  }
}

export function SeasonalThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<SeasonalTheme | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [previewState, setPreviewState] = useState<PreviewState>({
    isActive: false,
    theme: null,
    returnUrl: '/admin/temas',
  })

  const setTheme = useCallback((newTheme: SeasonalTheme | null) => {
    setThemeState(newTheme)
    // Always apply theme to DOM when setting it (unless in preview mode)
    const storedPreview = getStoredPreviewState()
    if (!storedPreview?.isActive) {
      applyThemeToDOM(newTheme)
    }
  }, [])

  // Get the effective theme (preview takes precedence)
  const effectiveTheme = previewState.isActive ? previewState.theme : theme

  // Start preview mode
  const startPreview = useCallback((previewTheme: SeasonalTheme, returnUrl = '/admin/temas') => {
    const newState: PreviewState = {
      isActive: true,
      theme: previewTheme,
      returnUrl,
    }
    setPreviewState(newState)
    setStoredPreviewState(newState)
    applyThemeToDOM(previewTheme)
  }, [])

  // Cancel preview and return to normal
  const cancelPreview = useCallback(() => {
    const newState: PreviewState = {
      isActive: false,
      theme: null,
      returnUrl: '/admin/temas',
    }
    setPreviewState(newState)
    setStoredPreviewState(null)
    // Restore the actual theme
    applyThemeToDOM(theme)
  }, [theme])

  // Publish preview changes to database
  const publishPreview = useCallback(async (): Promise<boolean> => {
    if (!previewState.theme) return false

    try {
      // First, check if this theme exists in DB
      const existingResponse = await fetch(`/api/themes?slug=${previewState.theme.slug}`)
      const existingData = await existingResponse.json()

      let savedTheme: SeasonalTheme | null = null

      if (existingData.themes?.length > 0) {
        // Update existing theme and activate it
        const existingThemeId = existingData.themes[0].id
        const updateResponse = await fetch(`/api/themes/${existingThemeId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            primary_color: previewState.theme.primaryColor,
            secondary_color: previewState.theme.secondaryColor,
            accent_color: previewState.theme.accentColor,
            banner_image: previewState.theme.bannerImage,
            is_active: true,
          }),
        })

        if (updateResponse.ok) {
          savedTheme = previewState.theme
        }
      } else {
        // Create new theme
        const createResponse = await fetch('/api/themes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: previewState.theme.name,
            slug: previewState.theme.slug,
            primary_color: previewState.theme.primaryColor,
            secondary_color: previewState.theme.secondaryColor,
            accent_color: previewState.theme.accentColor,
            banner_image: previewState.theme.bannerImage,
            is_active: true,
          }),
        })

        if (createResponse.ok) {
          const data = await createResponse.json()
          savedTheme = {
            ...previewState.theme,
            id: data.theme?.id || previewState.theme.id,
          }
        }
      }

      if (savedTheme) {
        // Successfully saved - update actual theme and exit preview
        setThemeState(savedTheme)
        const newState: PreviewState = {
          isActive: false,
          theme: null,
          returnUrl: '/admin/temas',
        }
        setPreviewState(newState)
        setStoredPreviewState(null)
        return true
      }

      return false
    } catch (error) {
      console.error('Error publishing theme:', error)
      return false
    }
  }, [previewState.theme])

  // Load theme and check for existing preview state
  useEffect(() => {
    async function loadTheme() {
      try {
        // Check for stored preview state first
        const storedPreview = getStoredPreviewState()
        if (storedPreview?.isActive && storedPreview.theme) {
          setPreviewState(storedPreview)
          applyThemeToDOM(storedPreview.theme)
          // Still load the real theme from DB but don't apply it
        }

        // Check if Supabase is configured
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseKey) {
          // Use default theme when Supabase is not configured
          setThemeState(null)
          if (!storedPreview?.isActive) {
            applyThemeToDOM(null)
          }
          setIsLoading(false)
          return
        }

        // Try to fetch active theme from API
        const response = await fetch('/api/themes/active', {
          cache: 'no-store', // Prevent caching to always get fresh data
        })
        if (response.ok) {
          const data = await response.json()
          if (data.theme) {
            const loadedTheme: SeasonalTheme = {
              id: data.theme.id,
              name: data.theme.name,
              slug: data.theme.slug,
              primaryColor: data.theme.primary_color,
              secondaryColor: data.theme.secondary_color,
              accentColor: data.theme.accent_color,
              bannerImage: data.theme.banner_image,
            }
            setThemeState(loadedTheme)

            // Only apply to DOM if not in preview mode
            if (!storedPreview?.isActive) {
              applyThemeToDOM(loadedTheme)
            }
          } else {
            // No active theme in DB
            setThemeState(null)
            if (!storedPreview?.isActive) {
              applyThemeToDOM(null)
            }
          }
        }
      } catch (error) {
        console.error('Error loading theme:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTheme()

    // Re-apply theme on visibility change (when user returns to the tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const storedPreview = getStoredPreviewState()
        if (storedPreview?.isActive && storedPreview.theme) {
          applyThemeToDOM(storedPreview.theme)
        } else {
          // Re-fetch in case theme changed in another tab
          loadTheme()
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return (
    <SeasonalThemeContext.Provider
      value={{
        theme,
        isLoading,
        setTheme,
        previewState,
        startPreview,
        cancelPreview,
        publishPreview,
        effectiveTheme,
      }}
    >
      {children}
    </SeasonalThemeContext.Provider>
  )
}

export function useSeasonalTheme() {
  const context = useContext(SeasonalThemeContext)
  if (context === undefined) {
    throw new Error('useSeasonalTheme must be used within a SeasonalThemeProvider')
  }
  return context
}

// Helper to get a predefined theme
export function getDefaultTheme(slug: string): SeasonalTheme | undefined {
  return defaultThemes[slug]
}

// Export default themes for use in admin
export { defaultThemes }
