"use client";

import { useState, useEffect, useSyncExternalStore, useRef } from "react";
import {
  Menu,
  X,
  Sun,
  Moon,
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
              className="flex items-center gap-4 pr-4 group flex-shrink-0"
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
            <div className="flex items-center gap-1 md:gap-2">
              {/* Mobile Search */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search className="w-5 h-5" />
              </Button>

              {/* Share Button (compact + animated text) */}
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="relative flex items-center justify-center w-10 h-10 rounded-full border
                  border-primary/30 text-primary hover:bg-primary/10 transition-all
                  share-pulse"
                aria-label="Compartir"
              >
                <Share2 className="w-5 h-5" />
              </button>

              {/* Theme */}
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                <Sun className="w-5 h-5 rotate-0 scale-100 dark:-rotate-90 dark:scale-0 transition-all" />
                <Moon className="absolute w-5 h-5 rotate-90 scale-0 dark:rotate-0 dark:scale-100 transition-all" />
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

          {/* ---------------- MOBILE SEARCH ---------------- */}
          <div
            className={`md:hidden overflow-hidden transition-all ${
              isSearchOpen ? "max-h-20 pb-4" : "max-h-0"
            }`}
          >
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
              <input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar..."
                className="w-full pl-10 pr-12 py-3 rounded-xl border bg-muted/50"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5
                  bg-primary text-primary-foreground rounded-lg text-sm"
              >
                Buscar
              </button>
            </form>
          </div>

          {/* ---------------- MOBILE MENU ---------------- */}
          <div
            className={`lg:hidden overflow-hidden transition-all ${
              isMobileMenuOpen ? "max-h-96 pb-4" : "max-h-0"
            }`}
          >
            <div className="flex flex-col gap-2 pt-4 border-t border-border">
              {visibleNavItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-lg hover:bg-muted transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </header>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </>
  );
}
