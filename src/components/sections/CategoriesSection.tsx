"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  X,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  ShoppingBag,
  Eye,
  Images,
  ArrowDown,
} from "lucide-react";
import * as LucideIcons from "lucide-react";

import { useWhatsApp } from "@/hooks/use-whatsapp";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/contexts/SiteContentContext";

/* ===============================
   ICONO DINÁMICO
================================ */
const DynamicIcon = ({
  name,
  className,
}: {
  name: string;
  className?: string;
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (LucideIcons as any)[name];
  if (!IconComponent) return <span className={className}>{name}</span>;
  return <IconComponent className={className} />;
};

/* ===============================
   TIPOS
================================ */
interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  gallery: string[];
  isActive: boolean;
  order: number;
}

/* ===============================
   MODAL
================================ */
function CategoryModal({
  category,
  isOpen,
  onClose,
}: {
  category: Category;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { getWhatsAppUrl } = useWhatsApp();
  const router = useRouter();
  const images = category.gallery || [];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-background flex items-center justify-center shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        {images.length > 0 && (
          <div className="relative aspect-[3/2] bg-muted">
            <Image
              src={images[currentImageIndex]}
              alt={category.name}
              fill
              className="object-cover"
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setCurrentImageIndex(
                      (prev) => (prev - 1 + images.length) % images.length
                    )
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-background rounded-full flex items-center justify-center shadow"
                >
                  <ChevronLeft />
                </button>
                <button
                  onClick={() =>
                    setCurrentImageIndex((prev) => (prev + 1) % images.length)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-background rounded-full flex items-center justify-center shadow"
                >
                  <ChevronRight />
                </button>
              </>
            )}
          </div>
        )}

        <div className="p-6 space-y-4">
          <p className="text-muted-foreground">{category.description}</p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              className="flex-1 bg-whatsapp text-white font-bold"
              onClick={() =>
                window.open(
                  getWhatsAppUrl(
                    `Hola, me interesa la categoría ${category.name}`
                  ),
                  "_blank"
                )
              }
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Consultar
            </Button>

            <Button
              variant="outline"
              className="flex-1 font-bold"
              onClick={() => {
                onClose();
                router.push(`/?category=${category.slug}#productos`);
              }}
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Ver productos
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===============================
   SECCIÓN CATEGORÍAS
================================ */
export function CategoriesSection() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const { categories } = useSiteContent();

  const activeCategories = (categories as any[])
    .filter((c) => c.isActive || c.is_active)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      icon: c.icon || "HelpCircle",
      description: c.description,
      gallery: c.gallery || [],
      isActive: true,
      order: c.order,
    }));

  if (activeCategories.length === 0) return null;

  return (
    <>
      <section className="py-6 bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {activeCategories.map((category) => {
              const isSublimado =
                category.slug?.toLowerCase().includes("sublim");

              return (
                <button
  key={category.id}
  onClick={() => setSelectedCategory(category)}
  className="snake-border relative rounded-xl bg-card p-3
    flex flex-col items-center text-center shadow-sm"
  style={{
    animationDelay: `${category.order * 0.4}s`,
  }}
>

                  {/* ICONO */}
                  <div
  className="relative w-11 h-11 rounded-xl
  bg-gradient-to-br from-primary/15 to-primary/5
  border border-primary/25
  shadow-[0_4px_10px_rgba(0,0,0,0.08)]
  flex items-center justify-center"
>
  {/* Capa inferior (volumen) */}
  <div
    className="absolute inset-0 rounded-xl
    shadow-[inset_0_1px_2px_rgba(255,255,255,0.6)]"
  />

  {/* Icono */}
  <DynamicIcon
    name={category.icon}
    className="relative w-5 h-5 text-primary"
  />
</div>


                  <span className="mt-2 text-sm font-semibold">
                    {category.name}
                  </span>

                  {/* ACCIONES VISIBLES */}
                  <div className="mt-2 flex flex-col gap-1 text-xs font-medium text-primary">
                    <div className="flex items-center justify-center gap-1">
                      <Eye className="w-4 h-4" />
                      Ver muestras
                    </div>

                    <div className="flex items-center justify-center gap-1 text-muted-foreground">
                      <Images className="w-4 h-4" />
                      Abrir galería
                    </div>

                    {isSublimado && (
                      <div className="flex items-center justify-center gap-1 text-primary">
                        <ArrowDown className="w-4 h-4" />
                        Catálogo abajo
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {selectedCategory && (
        <CategoryModal
          category={selectedCategory}
          isOpen={!!selectedCategory}
          onClose={() => setSelectedCategory(null)}
        />
      )}
    </>
  );
}
