"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  Download,
  ExternalLink,
  FileText,
  FolderTree,
  Key,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Palette,
  Settings,
  Star,
  Tags,
  User,
  Wrench,
  X,
} from "lucide-react";
import logoImg from "@/app/logo.png";
import { BUSINESS_INFO } from "@/lib/constants";
import { getCurrentAdmin, signOut } from "@/lib/supabase/auth";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/categorias", label: "Categorias", icon: FolderTree },
  { href: "/admin/servicios", label: "Servicios", icon: Wrench },
  { href: "/admin/promociones", label: "Promociones", icon: Tags },
  { href: "/admin/catalogos", label: "Catalogos", icon: Download },
  { href: "/admin/resenas", label: "Resenas", icon: Star },
  { href: "/admin/contenido", label: "Contenido", icon: FileText },
  { href: "/admin/temas", label: "Temas", icon: Palette },
  { href: "/admin/configuracion", label: "Configuracion", icon: Settings },
];

export function AdminLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    getCurrentAdmin().then((user) => {
      if (user) {
        setAdminUser({
          name: user.name,
          email: user.email,
          role: user.role,
        });
      }
    });
  }, []);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      console.error("Error al cerrar sesion:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (pathname === "/admin/login" || pathname === "/admin/reset-password") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {userMenuOpen && <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />}

      <aside
        className={`
          fixed left-0 top-0 z-50 h-full w-64 border-r border-border bg-card
          transform transition-transform duration-300 lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <Link href="/admin" className="flex items-center gap-3">
            <Image src={logoImg} alt="Logo Admin" width={32} height={32} className="h-8 w-8 rounded-lg object-cover" />
            <span className="font-heading text-lg font-bold">
              Libreria <span className="text-primary">CHROMA</span>
            </span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="rounded-lg p-2 hover:bg-muted lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="space-y-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium transition-colors
                  ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }
                `}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-border p-4">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ExternalLink className="h-5 w-5" />
            Ver Sitio
          </Link>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 h-16 border-b border-border bg-card/95 backdrop-blur-sm">
          <div className="flex h-full items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="rounded-lg p-2 hover:bg-muted lg:hidden">
                <Menu className="h-5 w-5" />
              </button>
              <h1 className="hidden font-heading text-lg font-bold sm:block">{BUSINESS_INFO.name}</h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-muted"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div className="hidden text-left sm:block">
                    <p className="text-sm font-medium">{adminUser?.name || "Admin"}</p>
                    <p className="text-xs text-muted-foreground">{adminUser?.role || "admin"}</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border border-border bg-card py-1 shadow-lg">
                    <div className="border-b border-border px-4 py-2">
                      <p className="text-sm font-medium">{adminUser?.name}</p>
                      <p className="text-xs text-muted-foreground">{adminUser?.email}</p>
                    </div>

                    <Link
                      href="/admin/configuracion"
                      className="flex items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-muted"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4" />
                      Configuracion
                    </Link>

                    <Link
                      href="/admin/configuracion#password"
                      className="flex items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-muted"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Key className="h-4 w-4" />
                      Cambiar Contrasena
                    </Link>

                    <div className="mt-1 border-t border-border pt-1">
                      <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
                      >
                        <LogOut className="h-4 w-4" />
                        {isLoggingOut ? "Cerrando sesion..." : "Cerrar Sesion"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
