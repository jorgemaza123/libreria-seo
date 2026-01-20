"use client"

import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { CartProvider } from "@/contexts/CartContext"
import { SeasonalThemeProvider } from "@/contexts/SeasonalThemeContext"
import { SiteContentProvider } from "@/contexts/SiteContentContext"
import { SearchProvider } from "@/contexts/SearchContext"
import { Toaster as SonnerToaster } from "sonner"
import { getQueryClient } from "@/lib/query-client"
import { PreviewBar } from "@/components/PreviewBar"
import { ContentPreviewBar } from "@/components/ContentPreviewBar"

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <SeasonalThemeProvider>
          <SiteContentProvider>
            <CartProvider>
              <SearchProvider>
                <PreviewBar />
                <ContentPreviewBar />
                {children}
                <SonnerToaster
                  position="bottom-right"
                  richColors
                  toastOptions={{
                    style: {
                      marginBottom: '1rem',
                    },
                  }}
                />
              </SearchProvider>
            </CartProvider>
          </SiteContentProvider>
        </SeasonalThemeProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
