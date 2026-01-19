"use client"

import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { CartProvider } from "@/contexts/CartContext"
import { SeasonalThemeProvider } from "@/contexts/SeasonalThemeContext"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from "sonner"
import { getQueryClient } from "@/lib/query-client"

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
          <CartProvider>
            {children}
            <Toaster />
            <SonnerToaster position="top-right" richColors />
          </CartProvider>
        </SeasonalThemeProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
