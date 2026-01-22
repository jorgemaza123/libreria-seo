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
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" });
    }
    setIsSearchOpen(false);
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
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between h-16 md:h-20">
            {/* ---------------- LOGO ---------------- */}
            <Link
              href="/"
              className="flex items-center gap-6 pr-6 group flex-shrink-0"
            >
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-heading font-bold text-xl transition-transform group-hover:scale-105">
                H&J
              </div>
              <span className="font-heading font-bold text-xl hidden sm:block">
                Librería <span className="text-primary">H & J</span>
              </span>
            </Link>

            {/* ---------------- DESKTOP NAV ---------------- */}
            <div className="hidden lg:flex items-center gap-6">
              {visibleNavItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="relative font-medium text-foreground/80 hover:text-primary transition-colors
                    after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-primary
                    after:transition-all hover:after:w-full"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* ---------------- DESKTOP SEARCH ---------------- */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <form onSubmit={handleSearch} className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar productos o servicios..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-full border border-border bg-muted/50
                    focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20
                    transition-all text-sm"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </form>
            </div>

            {/* ---------------- ACTIONS ---------------- */}
            <div className="flex items-center gap-2">
              {/* Mobile Search */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search className="w-5 h-5" />
              </Button>

              {/* Share */}
              <div className="relative flex flex-col items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsShareModalOpen(true)}
                >
                  <Share2 className="w-5 h-5" />
                </Button>
                <span className="text-[10px] text-muted-foreground mt-[-2px]">
                  Compartir
                </span>
              </div>

              {/* Theme */}
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === "dark" ? (
                  <SunMedium className="w-5 h-5" />
                ) : (
                  <MoonStar className="w-5 h-5" />
                )}
              </Button>

              {/* Cart */}
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingBag className="w-5 h-5" />
                {mounted && getItemCount() > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground
                    text-xs rounded-full flex items-center justify-center animate-pulse">
                    {getItemCount()}
                  </span>
                )}
              </Button>

              {/* Mobile Menu */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </Button>
            </div>
          </nav>
        </div>
      </header>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </>
  );
}
