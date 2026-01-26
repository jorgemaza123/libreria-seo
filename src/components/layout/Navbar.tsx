"use client";

import { useState, useEffect, useSyncExternalStore, useRef } from "react";
import {
  Menu,
  X,
  SunMedium,
  MoonStar,
  Search,
  ShoppingBag,
  Share2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useSearch } from "@/contexts/SearchContext";
import { mockNavItems } from "@/lib/mock-data";
import { ShareModal } from "@/components/ui/ShareModal";
import logoImg from "@/app/logo.png";

const useIsClient = () => {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
};

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

  const { theme, setTheme } = useTheme();
  const { getItemCount, setIsCartOpen } = useCart();
  const { searchQuery, setSearchQuery } = useSearch();

  const mounted = useIsClient();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen && mobileSearchInputRef.current) {
      setTimeout(() => mobileSearchInputRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  const visibleNavItems = mockNavItems
    .filter((item) => item.isVisible)
    .sort((a, b) => a.order - b.order);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const productsSection = document.getElementById("productos");
    productsSection?.scrollIntoView({ behavior: "smooth" });
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-md shadow-md"
            : "bg-background/80 backdrop-blur-sm"
        }`}
      >
        <div className="container mx-auto px-3 sm:px-4">
          <nav className="flex items-center justify-between h-16 md:h-20 gap-2">

            <Link href="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <Image
                src={logoImg}
                alt="Logo Chroma"
                width={40}
                height={40}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg object-cover"
              />
              <span className="font-bold text-base sm:text-lg hidden sm:block">
                Librería <span className="text-primary">CHROMA</span>
              </span>
            </Link>

            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex-1 max-w-[200px] md:hidden flex items-center gap-2 px-3 py-2.5 bg-muted/60 hover:bg-muted active:bg-muted/80 active:scale-[0.98] rounded-full border border-transparent hover:border-primary/20 transition-all touch-manipulation"
              aria-label="Abrir buscador"
            >
              <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm text-muted-foreground truncate">
                Buscar producto...
              </span>
            </button>

            <div className="hidden lg:flex items-center gap-6">
              {visibleNavItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="font-medium text-foreground/80 hover:text-primary transition"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <form onSubmit={handleSearch} className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full bg-muted/60 border border-transparent focus:border-primary/30 focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </form>
            </div>

            <div className="flex items-center gap-0.5 sm:gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsShareModalOpen(true)}
                aria-label="Compartir esta página"
                className="text-primary"
              >
                <Share2 className="w-5 h-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="hidden sm:flex"
                aria-label={mounted ? (theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro") : "Cambiar tema"}
              >
                {mounted ? (
                  theme === "dark"
                    ? <SunMedium className="w-5 h-5" />
                    : <MoonStar className="w-5 h-5" />
                ) : (
                  <MoonStar className="w-5 h-5" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setIsCartOpen(true)}
                aria-label={mounted && getItemCount() > 0 ? `Carrito: ${getItemCount()} productos` : "Carrito de compras"}
              >
                <ShoppingBag className="w-5 h-5" />
                {mounted && getItemCount() > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {getItemCount() > 9 ? '9+' : getItemCount()}
                  </span>
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {isSearchOpen && (
        <div
          className="fixed inset-0 z-[55] bg-background/98 backdrop-blur-md safe-area-inset"
          role="dialog"
          aria-modal="true"
          aria-label="Buscador de productos"
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 p-4 border-b border-border">
              <form onSubmit={handleSearch} className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  ref={mobileSearchInputRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="¿Qué producto buscas?"
                  className="w-full pl-12 pr-4 py-4 text-lg rounded-2xl bg-muted border-2 border-transparent focus:border-primary focus:ring-0 outline-none transition-all"
                  autoComplete="off"
                />
              </form>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="w-12 h-12 rounded-xl bg-muted hover:bg-muted-foreground/10 active:scale-95 flex items-center justify-center transition-all touch-manipulation"
                aria-label="Cerrar buscador"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
              <p className="text-sm text-muted-foreground mb-4">
                Escribe el nombre del producto y presiona Enter o el botón buscar
              </p>

              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Búsquedas populares
                </p>
                {['Cuadernos', 'Lápices', 'Mochilas', 'Útiles escolares'].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setSearchQuery(term);
                      const productsSection = document.getElementById("productos");
                      productsSection?.scrollIntoView({ behavior: "smooth" });
                      setIsSearchOpen(false);
                    }}
                    className="block w-full text-left px-4 py-3 rounded-xl bg-muted/50 hover:bg-muted active:bg-muted/80 active:scale-[0.99] transition-all touch-manipulation"
                  >
                    <span className="flex items-center gap-3">
                      <Search className="w-4 h-4 text-muted-foreground" />
                      {term}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-border safe-area-pb">
              <Button
                size="lg"
                className="w-full h-14 text-lg font-semibold rounded-xl active:scale-[0.98] transition-all touch-manipulation"
                onClick={handleSearch}
                disabled={!searchQuery.trim()}
              >
                <Search className="w-5 h-5 mr-2" />
                Buscar productos
              </Button>
            </div>
          </div>
        </div>
      )}

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-[55] bg-background/98 backdrop-blur-md safe-area-inset"
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación"
        >
          <div className="flex flex-col h-full pt-20 p-6">
            <nav className="flex flex-col gap-2">
              {visibleNavItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-4 text-lg font-medium rounded-xl hover:bg-muted active:bg-muted/80 active:scale-[0.99] transition-all touch-manipulation"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-border space-y-3 safe-area-pb">
              <Button
                variant="outline"
                size="lg"
                className="w-full justify-start gap-3 active:scale-[0.98] transition-all touch-manipulation"
                onClick={() => {
                  toggleTheme();
                  setIsMobileMenuOpen(false);
                }}
              >
                {mounted ? (
                  theme === "dark" ? (
                    <>
                      <SunMedium className="w-5 h-5" />
                      Cambiar a modo claro
                    </>
                  ) : (
                    <>
                      <MoonStar className="w-5 h-5" />
                      Cambiar a modo oscuro
                    </>
                  )
                ) : (
                  <>
                    <MoonStar className="w-5 h-5" />
                    Cambiar tema
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full justify-start gap-3 active:scale-[0.98] transition-all touch-manipulation"
                onClick={() => {
                  setIsShareModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
              >
                <Share2 className="w-5 h-5" />
                Compartir esta página
              </Button>
            </div>
          </div>
        </div>
      )}

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </>
  );
}
