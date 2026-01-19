"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-client'
import type { Json } from '@/lib/supabase/types'

type SiteSettings = Record<string, Json>

interface ContactInfo {
  whatsapp?: string
  phone?: string
  email?: string
  address?: {
    street?: string
    city?: string
    state?: string
    country?: string
  }
}

interface SiteContent {
  heroTitle?: string
  heroSubtitle?: string
  aboutText?: string
  footerText?: string
}

interface NavigationItem {
  label: string
  href: string
  order: number
}

// API functions
async function fetchSettings(): Promise<SiteSettings> {
  const response = await fetch('/api/settings')
  if (!response.ok) {
    throw new Error('Failed to fetch settings')
  }
  const data = await response.json()
  return data.settings || {}
}

async function fetchSetting(key: string): Promise<Json> {
  const response = await fetch(`/api/settings/${key}`)
  if (!response.ok) {
    throw new Error('Failed to fetch setting')
  }
  const data = await response.json()
  return data.value
}

async function updateSetting({ key, value }: { key: string; value: Json }): Promise<void> {
  const response = await fetch(`/api/settings/${key}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ value }),
  })
  if (!response.ok) {
    throw new Error('Failed to update setting')
  }
}

async function deleteSetting(key: string): Promise<void> {
  const response = await fetch(`/api/settings/${key}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error('Failed to delete setting')
  }
}

// Hooks
export function useSiteSettings() {
  return useQuery({
    queryKey: queryKeys.settings.all,
    queryFn: fetchSettings,
  })
}

export function useContactInfo() {
  const { data, ...rest } = useSiteSettings()
  return {
    ...rest,
    data: data?.contact_info as ContactInfo | undefined,
  }
}

export function useSiteContent() {
  const { data, ...rest } = useSiteSettings()
  return {
    ...rest,
    data: data?.site_content as SiteContent | undefined,
  }
}

export function useNavigation() {
  const { data, ...rest } = useSiteSettings()
  return {
    ...rest,
    data: data?.navigation as NavigationItem[] | undefined,
  }
}

export function useUpdateSetting() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateSetting,
    onSuccess: (_, { key }) => {
      // Invalidate all settings queries
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.all })
    },
  })
}

export function useDeleteSetting() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteSetting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.all })
    },
  })
}

// Prefetch helper
export function prefetchSiteSettings(queryClient: ReturnType<typeof useQueryClient>) {
  return queryClient.prefetchQuery({
    queryKey: queryKeys.settings.all,
    queryFn: fetchSettings,
  })
}
