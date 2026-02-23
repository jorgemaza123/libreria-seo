"use client"

import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { CartProvider } from "@/contexts/CartContext"
import { ChatProvider } from "@/contexts/ChatContext"
import { SeasonalThemeProvider } from "@/contexts/SeasonalThemeContext"
import { SiteContentProvider } from "@/contexts/SiteContentContext"
import { SearchProvider } from "@/contexts/SearchContext"
import { Toaster as SonnerToaster } from "sonner"
import { getQueryClient } from "@/lib/query-client"
import { PreviewBar } from "@/components/PreviewBar"
import { ContentPreviewBar } from "@/components/ContentPreviewBar"
import { CartDrawer } from "@/components/cart/CartDrawer"

interface ProvidersProps {
  children: React.ReactNode
  initialSiteContent?: unknown
}

export function Providers({ children, initialSiteContent }: ProvidersProps) {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        storageKey="libreria-theme"
        disableTransitionOnChange
      >
        <SeasonalThemeProvider>
          <SiteContentProvider initialContent={initialSiteContent}>
            <CartProvider>
              <SearchProvider>
                <ChatProvider>
                  <PreviewBar />
                  <ContentPreviewBar />
                  {children}
                  <CartDrawer />
                  <SonnerToaster
                    position="top-center"
                    richColors
                    className="!z-[70]"
                    toastOptions={{
                      style: {
                        marginTop: 'max(env(safe-area-inset-top), 1rem)',
                      },
                      className: 'touch-manipulation',
                    }}
                  />
                </ChatProvider>
              </SearchProvider>
            </CartProvider>
          </SiteContentProvider>
        </SeasonalThemeProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
