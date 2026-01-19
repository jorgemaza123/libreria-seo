"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-client'
import type { Database } from '@/lib/supabase/types'

type Category = Database['public']['Tables']['categories']['Row']
type CategoryInsert = Database['public']['Tables']['categories']['Insert']
type CategoryUpdate = Database['public']['Tables']['categories']['Update']

// API functions
async function fetchCategories(): Promise<Category[]> {
  const response = await fetch('/api/categories')
  if (!response.ok) {
    throw new Error('Failed to fetch categories')
  }
  const data = await response.json()
  return data.categories || []
}

async function fetchCategoryById(id: string): Promise<Category> {
  const response = await fetch(`/api/categories/${id}`)
  if (!response.ok) {
    throw new Error('Failed to fetch category')
  }
  const data = await response.json()
  return data.category
}

async function fetchCategoryBySlug(slug: string): Promise<Category> {
  const response = await fetch(`/api/categories/slug/${slug}`)
  if (!response.ok) {
    throw new Error('Failed to fetch category')
  }
  const data = await response.json()
  return data.category
}

async function createCategory(category: CategoryInsert): Promise<Category> {
  const response = await fetch('/api/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(category),
  })
  if (!response.ok) {
    throw new Error('Failed to create category')
  }
  const data = await response.json()
  return data.category
}

async function updateCategory({ id, ...category }: CategoryUpdate & { id: string }): Promise<Category> {
  const response = await fetch(`/api/categories/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(category),
  })
  if (!response.ok) {
    throw new Error('Failed to update category')
  }
  const data = await response.json()
  return data.category
}

async function deleteCategory(id: string): Promise<void> {
  const response = await fetch(`/api/categories/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error('Failed to delete category')
  }
}

// Hooks
export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.list(),
    queryFn: fetchCategories,
  })
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: queryKeys.categories.detail(id),
    queryFn: () => fetchCategoryById(id),
    enabled: !!id,
  })
}

export function useCategoryBySlug(slug: string) {
  return useQuery({
    queryKey: queryKeys.categories.bySlug(slug),
    queryFn: () => fetchCategoryBySlug(slug),
    enabled: !!slug,
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all })
    },
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateCategory,
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.categories.detail(data.id), data)
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.lists() })
    },
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all })
    },
  })
}

// Prefetch helper
export function prefetchCategories(queryClient: ReturnType<typeof useQueryClient>) {
  return queryClient.prefetchQuery({
    queryKey: queryKeys.categories.list(),
    queryFn: fetchCategories,
  })
}
