"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Wrench,
  Tags,
  FileText,
  Palette,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronDown,
  User,
  Key,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BUSINESS_INFO } from '@/lib/constants'
import { signOut, getCurrentAdmin } from '@/lib/supabase/auth'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/productos', label: 'Productos', icon: Package },
  { href: '/admin/categorias', label: 'Categorías', icon: FolderTree },
  { href: '/admin/servicios', label: 'Servicios', icon: Wrench },
  { href: '/admin/promociones', label: 'Promociones', icon: Tags },
  { href: '/admin/contenido', label: 'Contenido', icon: FileText },
  { href: '/admin/temas', label: 'Temas', icon: Palette },
  { href: '/admin/configuracion', label: 'Configuración', icon: Settings },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [adminUser, setAdminUser] = useState<{ name: string; email: string; role: string } | null>(null)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    getCurrentAdmin().then(user => {
      if (user) {
        setAdminUser({
          name: user.name,
          email: user.email,
          role: user.role,
        })
      }
    })
  }, [])

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await signOut()
      router.push('/admin/login')
      router.refresh()
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  // Si estamos en la página de login o reset-password, no mostrar el layout
  if (pathname === '/admin/login' || pathname === '/admin/reset-password') {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* User menu backdrop */}
      {userMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setUserMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-card border-r border-border
          transform transition-transform duration-300 lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-border">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
              LC
            </div>
            <span className="font-heading font-bold">Admin</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-muted rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors
                  ${active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }
                `}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <ExternalLink className="w-5 h-5" />
            Ver Sitio
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 bg-card/95 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between h-full px-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-muted rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="font-heading font-bold text-lg hidden sm:block">
                {BUSINESS_INFO.name}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium">{adminUser?.name || 'Admin'}</p>
                    <p className="text-xs text-muted-foreground">{adminUser?.role || 'admin'}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-card rounded-lg border border-border shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b border-border">
                      <p className="text-sm font-medium">{adminUser?.name}</p>
                      <p className="text-xs text-muted-foreground">{adminUser?.email}</p>
                    </div>

                    <Link
                      href="/admin/configuracion"
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      Configuración
                    </Link>

                    <Link
                      href="/admin/configuracion#password"
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Key className="w-4 h-4" />
                      Cambiar Contraseña
                    </Link>

                    <div className="border-t border-border mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors w-full disabled:opacity-50"
                      >
                        <LogOut className="w-4 h-4" />
                        {isLoggingOut ? 'Cerrando sesión...' : 'Cerrar Sesión'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
