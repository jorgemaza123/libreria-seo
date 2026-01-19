"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-client'
import type { Database } from '@/lib/supabase/types'

type Product = Database['public']['Tables']['products']['Row'] & {
  category?: {
    id: string
    name: string
    slug: string
  } | null
}

type ProductInsert = Database['public']['Tables']['products']['Insert']
type ProductUpdate = Database['public']['Tables']['products']['Update']

interface ProductFilters {
  featured?: boolean
  categoryId?: string
  limit?: number
  offset?: number
}

// API functions
async function fetchProducts(filters: ProductFilters = {}): Promise<Product[]> {
  const params = new URLSearchParams()
  if (filters.featured) params.set('featured', 'true')
  if (filters.categoryId) params.set('categoryId', filters.categoryId)
  if (filters.limit) params.set('limit', filters.limit.toString())
  if (filters.offset) params.set('offset', filters.offset.toString())

  const response = await fetch(`/api/products?${params.toString()}`)
  if (!response.ok) {
    throw new Error('Failed to fetch products')
  }
  const data = await response.json()
  return data.products || []
}

async function fetchProductById(id: string): Promise<Product> {
  const response = await fetch(`/api/products/${id}`)
  if (!response.ok) {
    throw new Error('Failed to fetch product')
  }
  const data = await response.json()
  return data.product
}

async function createProduct(product: ProductInsert): Promise<Product> {
  const response = await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  })
  if (!response.ok) {
    throw new Error('Failed to create product')
  }
  const data = await response.json()
  return data.product
}

async function updateProduct({ id, ...product }: ProductUpdate & { id: string }): Promise<Product> {
  const response = await fetch(`/api/products/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  })
  if (!response.ok) {
    throw new Error('Failed to update product')
  }
  const data = await response.json()
  return data.product
}

async function deleteProduct(id: string): Promise<void> {
  const response = await fetch(`/api/products/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error('Failed to delete product')
  }
}

// Hooks
export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: () => fetchProducts(filters),
  })
}

export function useFeaturedProducts(limit?: number) {
  return useProducts({ featured: true, limit })
}

export function useProductsByCategory(categoryId: string, limit?: number) {
  return useProducts({ categoryId, limit })
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => fetchProductById(id),
    enabled: !!id,
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      // Invalidate all product queries to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateProduct,
    onSuccess: (data) => {
      // Update the specific product cache
      queryClient.setQueryData(queryKeys.products.detail(data.id), data)
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() })
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      // Invalidate all product queries
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
    },
  })
}

// Prefetch helper for server components
export function prefetchProducts(queryClient: ReturnType<typeof useQueryClient>, filters: ProductFilters = {}) {
  return queryClient.prefetchQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: () => fetchProducts(filters),
  })
}
