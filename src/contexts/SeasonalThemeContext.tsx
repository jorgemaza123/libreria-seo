"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export interface SeasonalTheme {
  id: string
  name: string
  slug: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  bannerImage?: string | null
}

interface SeasonalThemeContextType {
  theme: SeasonalTheme | null
  isLoading: boolean
  setTheme: (theme: SeasonalTheme | null) => void
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

export function SeasonalThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<SeasonalTheme | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const setTheme = (newTheme: SeasonalTheme | null) => {
    setThemeState(newTheme)
    applyThemeToDOM(newTheme)
  }

  useEffect(() => {
    async function loadTheme() {
      try {
        // Check if Supabase is configured
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseKey) {
          // Use default theme when Supabase is not configured
          setTheme(null)
          setIsLoading(false)
          return
        }

        // Try to fetch active theme from API
        const response = await fetch('/api/themes/active')
        if (response.ok) {
          const data = await response.json()
          if (data.theme) {
            setTheme({
              id: data.theme.id,
              name: data.theme.name,
              slug: data.theme.slug,
              primaryColor: data.theme.primary_color,
              secondaryColor: data.theme.secondary_color,
              accentColor: data.theme.accent_color,
              bannerImage: data.theme.banner_image,
            })
          }
        }
      } catch (error) {
        console.error('Error loading theme:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTheme()
  }, [])

  return (
    <SeasonalThemeContext.Provider value={{ theme, isLoading, setTheme }}>
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
