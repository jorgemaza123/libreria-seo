"use client"

import { QueryClient } from '@tanstack/react-query'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Stale time of 60 seconds - data is considered fresh for 1 minute
        staleTime: 60 * 1000,
        // Cache time of 5 minutes
        gcTime: 5 * 60 * 1000,
        // Retry failed requests up to 2 times
        retry: 2,
        // Refetch on window focus only if data is stale
        refetchOnWindowFocus: true,
        // Don't refetch on mount if data exists
        refetchOnMount: false,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

export function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient()
  } else {
    // Browser: make a new query client if we don't already have one
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}

// Query keys factory for consistent key management
export const queryKeys = {
  // Products
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (filters: { featured?: boolean; categoryId?: string; limit?: number }) =>
      [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.products.details(), id] as const,
    bySlug: (slug: string) => [...queryKeys.products.all, 'slug', slug] as const,
    search: (query: string) => [...queryKeys.products.all, 'search', query] as const,
  },
  // Categories
  categories: {
    all: ['categories'] as const,
    lists: () => [...queryKeys.categories.all, 'list'] as const,
    list: () => [...queryKeys.categories.lists()] as const,
    details: () => [...queryKeys.categories.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.categories.details(), id] as const,
    bySlug: (slug: string) => [...queryKeys.categories.all, 'slug', slug] as const,
  },
  // Site Settings
  settings: {
    all: ['settings'] as const,
    contact: () => [...queryKeys.settings.all, 'contact'] as const,
    content: () => [...queryKeys.settings.all, 'content'] as const,
    navigation: () => [...queryKeys.settings.all, 'navigation'] as const,
  },
  // Services
  services: {
    all: ['services'] as const,
    lists: () => [...queryKeys.services.all, 'list'] as const,
    list: () => [...queryKeys.services.lists()] as const,
    detail: (id: string) => [...queryKeys.services.all, 'detail', id] as const,
  },
  // Promotions
  promotions: {
    all: ['promotions'] as const,
    active: () => [...queryKeys.promotions.all, 'active'] as const,
    list: () => [...queryKeys.promotions.all, 'list'] as const,
  },
  // Themes
  themes: {
    all: ['themes'] as const,
    active: () => [...queryKeys.themes.all, 'active'] as const,
    list: () => [...queryKeys.themes.all, 'list'] as const,
  },
} as const
