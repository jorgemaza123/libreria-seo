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
  image?: string;
  isActive: boolean;
  order: number;
}

/* ===============================
   MODAL MEJORADO
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

  const images = [
    ...(category.image ? [category.image] : []),
    ...(category.gallery || [])
  ];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="relative bg-card rounded-2xl lg:rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón Cerrar - Grande y accesible */}
        <button
          onClick={onClose}
          aria-label="Cerrar ventana"
          className="absolute top-3 right-3 z-10 w-11 h-11 rounded-full bg-black/60 text-white flex items-center justify-center shadow-lg hover:bg-black/80 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Galería / Imagen */}
        {images.length > 0 ? (
          <div className="relative aspect-[4/3] sm:aspect-[3/2] bg-muted w-full shrink-0">
            <Image
              src={images[currentImageIndex]}
              alt={`${category.name} - Imagen ${currentImageIndex + 1}`}
              fill
              className="object-cover"
              unoptimized
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
                  }
                  aria-label="Imagen anterior"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 bg-black/60 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-black/80 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() =>
                    setCurrentImageIndex((prev) => (prev + 1) % images.length)
                  }
                  aria-label="Imagen siguiente"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 bg-black/60 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-black/80 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Indicador de posición */}
            {images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm font-medium px-3 py-1.5 rounded-full">
                {currentImageIndex + 1} / {images.length}
              </div>
            )}
          </div>
        ) : (
          <div className="h-40 bg-muted flex items-center justify-center text-muted-foreground shrink-0">
            <Images className="w-12 h-12 opacity-30" />
          </div>
        )}

        {/* Contenido */}
        <div className="p-5 sm:p-6 lg:p-8 space-y-4 overflow-y-auto">
          <div>
            <h3 id="modal-title" className="text-xl sm:text-2xl font-bold mb-2">
              {category.name}
            </h3>
            <p className="text-base text-muted-foreground leading-relaxed">
              {category.description}
            </p>
          </div>

          {/* Botones de acción - Grandes y accesibles */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              className="flex-1 min-h-[52px] text-base bg-green-600 hover:bg-green-700 text-white font-bold"
              onClick={() =>
                window.open(
                  getWhatsAppUrl(`Hola, me interesa la categoría: ${category.name}`),
                  "_blank"
                )
              }
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Consultar por WhatsApp
            </Button>

            <Button
              variant="outline"
              className="flex-1 min-h-[52px] text-base font-bold"
              onClick={() => {
                onClose();
                router.push(`/?category=${category.slug}#productos`);
              }}
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Ver Productos
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
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
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
      image: c.image,
      isActive: true,
      order: c.order,
    }));

  if (activeCategories.length === 0) return null;

  return (
    <>
      <section
        id="categorias"
        className="py-10 md:py-14 lg:py-16 bg-muted/40"
        aria-labelledby="categories-title"
      >
        <div className="container mx-auto px-4 sm:px-6">

          {/* Header */}
          <header className="text-center mb-8 space-y-2">
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold">
              Explora
            </span>
            <h2
              id="categories-title"
              className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold"
            >
              Nuestras <span className="text-primary">Categorías</span>
            </h2>
            <p className="text-base text-muted-foreground max-w-xl mx-auto">
              Toca una categoría para ver fotos y productos
            </p>
          </header>

          {/* Grid de Categorías */}
          <div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6"
            role="list"
          >
            {activeCategories.map((category) => (
              <button
                key={category.id}
                role="listitem"
                onClick={() => setSelectedCategory(category)}
                aria-label={`Ver categoría ${category.name}`}
                className="
                  group relative rounded-2xl bg-card
                  p-5 sm:p-6
                  min-h-[140px] sm:min-h-[160px]
                  flex flex-col items-center justify-center text-center
                  border-2 border-transparent
                  shadow-sm hover:shadow-lg
                  hover:border-primary/30
                  transition-all duration-300
                  hover:-translate-y-1
                  focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                "
              >
                {/* Icono */}
                <div
                  className="
                    w-14 h-14 sm:w-16 sm:h-16 rounded-xl
                    bg-gradient-to-br from-primary/20 to-primary/5
                    border border-primary/20
                    shadow-md
                    flex items-center justify-center
                    transition-transform duration-300
                    group-hover:scale-110
                  "
                >
                  <DynamicIcon
                    name={category.icon}
                    className="w-7 h-7 sm:w-8 sm:h-8 text-primary"
                  />
                </div>

                {/* Nombre */}
                <span className="mt-3 text-base sm:text-lg font-bold line-clamp-2">
                  {category.name}
                </span>

                {/* Texto de acción */}
                <div className="mt-2 flex items-center gap-1.5 text-sm font-medium text-primary opacity-80 group-hover:opacity-100 transition-opacity">
                  <Eye className="w-4 h-4" />
                  <span>Ver más</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
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
