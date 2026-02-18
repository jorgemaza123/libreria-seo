"use client"

import { useEffect, useState, useCallback } from 'react'
import {
  Package,
  FolderTree,
  Wrench,
  Tags,
  TrendingUp,
  Eye,
  Star,
  BookOpen,
  BarChart3,
  RefreshCw,
  MessageSquare,
} from 'lucide-react'
import Link from 'next/link'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface DashboardStats {
  products: number
  categories: number
  services: number
  promotions: number
  reviews: number
  catalogs: number
  conversionEvents: number
}

interface ChartDataPoint {
  date: string
  events: number
}

const quickActions = [
  { label: 'Agregar Producto', href: '/admin/productos/nuevo', icon: Package },
  { label: 'Nueva Promoción', href: '/admin/promociones', icon: Tags },
  { label: 'Editar Contenido', href: '/admin/contenido', icon: TrendingUp },
  { label: 'Configurar Tema', href: '/admin/temas', icon: Eye },
]

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    products: 0,
    categories: 0,
    services: 0,
    promotions: 0,
    reviews: 0,
    catalogs: 0,
    conversionEvents: 0,
  })
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const loadStats = useCallback(async () => {
    try {
      const [productsRes, categoriesRes, servicesRes, promotionsRes, reviewsRes, catalogsRes, eventsRes] =
        await Promise.all([
          fetch('/api/products').then((r) => r.json()).catch(() => ({ products: [] })),
          fetch('/api/categories').then((r) => r.json()).catch(() => ({ categories: [] })),
          fetch('/api/services').then((r) => r.json()).catch(() => ({ services: [] })),
          fetch('/api/promotions').then((r) => r.json()).catch(() => ({ promotions: [] })),
          fetch('/api/reviews').then((r) => r.json()).catch(() => []),
          fetch('/api/catalogs').then((r) => r.json()).catch(() => ({ catalogs: [] })),
          fetch('/api/conversion-events?days=30').then((r) => r.json()).catch(() => ({ events: [] })),
        ])

      const products = productsRes.products || productsRes || []
      const categories = categoriesRes.categories || []
      const services = servicesRes.services || []
      const promotions = promotionsRes.promotions || []
      const reviews = Array.isArray(reviewsRes) ? reviewsRes : reviewsRes.reviews || []
      const catalogs = catalogsRes.catalogs || catalogsRes || []
      const events = eventsRes.events || []

      setStats({
        products: Array.isArray(products) ? products.filter((p: { is_active?: boolean }) => p.is_active !== false).length : 0,
        categories: Array.isArray(categories) ? categories.length : 0,
        services: Array.isArray(services) ? services.filter((s: { is_active?: boolean; isActive?: boolean }) => s.is_active !== false && s.isActive !== false).length : 0,
        promotions: Array.isArray(promotions) ? promotions.filter((p: { is_active?: boolean; isActive?: boolean }) => p.is_active !== false && p.isActive !== false).length : 0,
        reviews: Array.isArray(reviews) ? reviews.length : 0,
        catalogs: Array.isArray(catalogs) ? catalogs.length : 0,
        conversionEvents: Array.isArray(events) ? events.length : 0,
      })

      // Build chart data - group events by day
      if (Array.isArray(events) && events.length > 0) {
        const grouped: Record<string, number> = {}
        const now = new Date()
        // Initialize last 14 days
        for (let i = 13; i >= 0; i--) {
          const d = new Date(now)
          d.setDate(d.getDate() - i)
          const key = d.toISOString().split('T')[0]
          grouped[key] = 0
        }
        events.forEach((e: { created_at: string }) => {
          const day = e.created_at?.split('T')[0]
          if (day && grouped[day] !== undefined) {
            grouped[day]++
          }
        })
        setChartData(
          Object.entries(grouped).map(([date, events]) => ({
            date: new Date(date).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' }),
            events,
          }))
        )
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    loadStats()
  }, [loadStats])

  const handleRefresh = () => {
    setIsRefreshing(true)
    loadStats()
  }

  const statCards = [
    { label: 'Productos Activos', value: stats.products, icon: Package, color: 'bg-blue-500', href: '/admin/productos' },
    { label: 'Categorías', value: stats.categories, icon: FolderTree, color: 'bg-emerald-500', href: '/admin/categorias' },
    { label: 'Servicios Activos', value: stats.services, icon: Wrench, color: 'bg-violet-500', href: '/admin/servicios' },
    { label: 'Promociones Activas', value: stats.promotions, icon: Tags, color: 'bg-amber-500', href: '/admin/promociones' },
    { label: 'Reseñas', value: stats.reviews, icon: Star, color: 'bg-pink-500', href: '/admin/resenas' },
    { label: 'Catálogos', value: stats.catalogs, icon: BookOpen, color: 'bg-cyan-500', href: '/admin/catalogos' },
  ]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold">Dashboard</h2>
          <p className="text-muted-foreground">Resumen general de tu tienda</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted/50 transition-colors text-sm"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-card rounded-2xl p-5 border border-border/50 hover:shadow-lg hover:border-primary/30 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`${stat.color} p-2.5 rounded-xl text-white`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-bold">
                {isLoading ? (
                  <span className="inline-block w-8 h-7 bg-muted animate-pulse rounded" />
                ) : (
                  stat.value
                )}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </Link>
          )
        })}
      </div>

      {/* Analytics Chart */}
      <div className="bg-card rounded-2xl border border-border/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-heading font-bold">Eventos de conversión</h3>
              <p className="text-xs text-muted-foreground">Últimos 14 días</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MessageSquare className="w-4 h-4 text-primary" />
            <span className="font-semibold">
              {isLoading ? '...' : stats.conversionEvents}
            </span>
            <span className="text-muted-foreground">total (30d)</span>
          </div>
        </div>

        {chartData.length > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11 }}
                  className="text-muted-foreground"
                />
                <YAxis tick={{ fontSize: 11 }} className="text-muted-foreground" />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid hsl(var(--border))',
                    backgroundColor: 'hsl(var(--card))',
                  }}
                />
                <Bar dataKey="events" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
            {isLoading ? (
              <div className="space-y-2 w-full">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-8 bg-muted animate-pulse rounded" />
                ))}
              </div>
            ) : (
              <p>No hay eventos de conversión aún. Los datos aparecerán cuando los usuarios interactúen con el sitio.</p>
            )}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-heading font-bold mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link
                key={action.label}
                href={action.href}
                className="bg-card rounded-2xl p-4 border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 text-center group"
              >
                <div className="w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <p className="font-medium text-sm">{action.label}</p>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
