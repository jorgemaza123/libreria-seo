import {
  Package,
  FolderTree,
  Wrench,
  Tags,
  TrendingUp,
  Users,
  DollarSign,
  Eye,
} from 'lucide-react'
import Link from 'next/link'

const stats = [
  {
    label: 'Productos Activos',
    value: '24',
    change: '+12%',
    icon: Package,
    color: 'bg-blue-500',
  },
  {
    label: 'Categorías',
    value: '6',
    change: '0%',
    icon: FolderTree,
    color: 'bg-emerald-500',
  },
  {
    label: 'Servicios',
    value: '6',
    change: '+2',
    icon: Wrench,
    color: 'bg-violet-500',
  },
  {
    label: 'Promociones Activas',
    value: '3',
    change: '-1',
    icon: Tags,
    color: 'bg-amber-500',
  },
]

const quickActions = [
  { label: 'Agregar Producto', href: '/admin/productos/nuevo', icon: Package },
  { label: 'Nueva Promoción', href: '/admin/promociones', icon: Tags },
  { label: 'Editar Contenido', href: '/admin/contenido', icon: TrendingUp },
  { label: 'Configurar Tema', href: '/admin/temas', icon: Eye },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-heading font-bold">Dashboard</h2>
        <p className="text-muted-foreground">
          Resumen general de tu tienda
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="bg-card rounded-xl p-6 border border-border"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  <p className="text-sm text-emerald-500 mt-1">{stat.change}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg text-white`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          )
        })}
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
                className="bg-card rounded-xl p-4 border border-border hover:border-primary/50 hover:shadow-lg transition-all text-center group"
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

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Products */}
        <div className="bg-card rounded-xl border border-border">
          <div className="p-4 border-b border-border">
            <h3 className="font-heading font-bold">Productos Recientes</h3>
          </div>
          <div className="p-4">
            <p className="text-muted-foreground text-sm text-center py-8">
              Conecta Supabase para ver los productos
            </p>
          </div>
        </div>

        {/* Recent Orders/Inquiries */}
        <div className="bg-card rounded-xl border border-border">
          <div className="p-4 border-b border-border">
            <h3 className="font-heading font-bold">Consultas Recientes</h3>
          </div>
          <div className="p-4">
            <p className="text-muted-foreground text-sm text-center py-8">
              Las consultas de WhatsApp aparecerán aquí
            </p>
          </div>
        </div>
      </div>

      {/* Setup Guide */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-6 border border-primary/20">
        <h3 className="font-heading font-bold text-lg mb-2">
          🚀 Guía de Configuración
        </h3>
        <p className="text-muted-foreground mb-4">
          Completa estos pasos para poner tu tienda en producción:
        </p>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">1</span>
            Configura las variables de entorno de Supabase (.env.local)
          </li>
          <li className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">2</span>
            Configura Cloudinary para las imágenes
          </li>
          <li className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">3</span>
            Ejecuta las migraciones de base de datos
          </li>
          <li className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">4</span>
            Actualiza la información de contacto en src/lib/constants.ts
          </li>
        </ul>
      </div>
    </div>
  )
}
