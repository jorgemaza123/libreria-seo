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
   TIPOS (CORREGIDO)
================================ */
interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  gallery: string[];
  image?: string; // <--- ¡AGREGADO! Ahora TypeScript sabe que esto existe
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

  // Combina la imagen principal con la galería (si existe)
  const images = [
    ...(category.image ? [category.image] : []),
    ...(category.gallery || [])
  ];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center shadow-md hover:bg-black/70 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Galería / Imagen */}
        {images.length > 0 ? (
          <div className="relative aspect-[3/2] bg-muted w-full shrink-0">
            <Image
              src={images[currentImageIndex]}
              alt={category.name}
              fill
              className="object-cover"
              unoptimized
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setCurrentImageIndex(
                      (prev) => (prev - 1 + images.length) % images.length
                    )
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 text-white rounded-full flex items-center justify-center shadow hover:bg-black/70"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() =>
                    setCurrentImageIndex((prev) => (prev + 1) % images.length)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 text-white rounded-full flex items-center justify-center shadow hover:bg-black/70"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
            
            {/* Indicador de posición (ej: 1/3) si hay varias fotos */}
            {images.length > 1 && (
               <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                 {currentImageIndex + 1} / {images.length}
               </div>
            )}
          </div>
        ) : (
           <div className="h-32 bg-muted flex items-center justify-center text-muted-foreground shrink-0">
              <Images className="w-10 h-10 opacity-20" />
           </div>
        )}

        {/* Contenido */}
        <div className="p-6 space-y-4 overflow-y-auto">
          <div>
             <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
             <p className="text-muted-foreground">{category.description}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold"
              onClick={() =>
                window.open(
                  getWhatsAppUrl(
                    `Hola, me interesa saber más sobre la categoría: ${category.name}`
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
      image: c.image, // Mapeamos la imagen simple
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
                    flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all"
                  style={{
                    animationDelay: `${category.order * 0.1}s`,
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
                    <div
                      className="absolute inset-0 rounded-xl
                      shadow-[inset_0_1px_2px_rgba(255,255,255,0.6)]"
                    />
                    <DynamicIcon
                      name={category.icon}
                      className="relative w-5 h-5 text-primary"
                    />
                  </div>

                  <span className="mt-2 text-sm font-semibold line-clamp-1">
                    {category.name}
                  </span>

                  {/* ACCIONES VISIBLES */}
                  <div className="mt-2 flex flex-col gap-1 text-xs font-medium text-primary w-full">
                    <div className="flex items-center justify-center gap-1 opacity-80">
                      <Eye className="w-3 h-3" />
                      Ver muestras
                    </div>

                    {isSublimado && (
                      <div className="flex items-center justify-center gap-1 text-primary animate-pulse">
                        <ArrowDown className="w-3 h-3" />
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