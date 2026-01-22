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
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useSearch } from "@/contexts/SearchContext";
import { mockNavItems } from "@/lib/mock-data";
import { ShareModal } from "@/components/ui/ShareModal";

/* ------------------ SSR SAFE CLIENT CHECK ------------------ */
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

  const { theme, setTheme } = useTheme();
  const { getItemCount, setIsCartOpen } = useCart();
  const { searchQuery, setSearchQuery } = useSearch();

  const mounted = useIsClient();

  /* ------------------ SCROLL EFFECT ------------------ */
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ------------------ SEARCH FOCUS ------------------ */
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
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
      {/* ================= HEADER ================= */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-md shadow-md"
            : "bg-background/80 backdrop-blur-sm"
        }`}
      >
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between h-16 md:h-20">
            {/* LOGO */}
            <Link href="/" className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
                H&J
              </div>
              <span className="font-bold text-lg hidden sm:block">
                Librería <span className="text-primary">H & J</span>
              </span>
            </Link>

            {/* DESKTOP NAV */}
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

            {/* DESKTOP SEARCH */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <form onSubmit={handleSearch} className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full bg-muted/60 border focus:ring-2 focus:ring-primary/30"
                />
              </form>
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsShareModalOpen(true)}
              >
                <Share2 />
              </Button>

              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {mounted && (
    theme === "dark"
      ? <SunMedium className="w-5 h-5" />
      : <MoonStar className="w-5 h-5" />
  )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingBag />
                {mounted && getItemCount() > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                    {getItemCount()}
                  </span>
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X /> : <Menu />}
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* ================= MOBILE SEARCH ================= */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur p-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5" />
            <input
              ref={searchInputRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted"
            />
          </form>
          <Button
            variant="ghost"
            className="mt-4 w-full"
            onClick={() => setIsSearchOpen(false)}
          >
            Cerrar
          </Button>
        </div>
      )}

      {/* ================= MOBILE MENU ================= */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur p-6">
          <div className="flex flex-col gap-4 text-lg font-medium">
            {visibleNavItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
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
