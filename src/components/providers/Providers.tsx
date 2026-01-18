"use client"

import { ThemeProvider } from "@/components/providers/theme-provider"
import { CartProvider } from "@/contexts/CartContext"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from "sonner"

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <CartProvider>
        {children}
        <Toaster />
        <SonnerToaster position="top-right" richColors />
      </CartProvider>
    </ThemeProvider>
  )
}
