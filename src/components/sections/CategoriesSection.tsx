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

  if (!IconComponent) {
    return <span className={className}>{name}</span>;
  }

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

interface CategoryModalProps {
  category: Category;
  isOpen: boolean;
  onClose: () => void;
}

/* ===============================
   MODAL
================================ */
function CategoryModal({ category, isOpen, onClose }: CategoryModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { getWhatsAppUrl } = useWhatsApp();
  const router = useRouter();

  const images = category.gallery || [];

  const nextImage = () =>
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setCurrentImageIndex(
      (prev) => (prev - 1 + images.length) % images.length
    );

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
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-background/80 flex items-center justify-center shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* GALERÍA */}
        {images.length > 0 ? (
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
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-background/80 rounded-full flex items-center justify-center"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-background/80 rounded-full flex items-center justify-center"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            <div className="absolute top-4 left-4 px-4 py-2 rounded-full bg-primary text-primary-foreground flex items-center gap-2 font-bold shadow-md">
              <DynamicIcon name={category.icon} className="w-5 h-5" />
              {category.name}
            </div>
          </div>
        ) : (
          <div className="aspect-[3/2] bg-muted flex items-center justify-center">
            <DynamicIcon
              name={category.icon}
              className="w-16 h-16 text-muted-foreground"
            />
          </div>
        )}

        {/* INFO */}
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {activeCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category)}
                className="relative rounded-xl bg-card p-3 flex flex-col items-center text-center shadow-sm overflow-hidden"
              >
                {/* BORDE RADIANTE */}
                <div className="absolute inset-0 rounded-xl p-[1px] bg-gradient-to-br from-primary/40 via-fuchsia-400/30 to-cyan-400/40">
                  <div className="w-full h-full rounded-xl bg-card" />
                </div>

                {/* CONTENIDO */}
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <div className="relative">
  {/* Glow animado */}
  <div className="absolute inset-0 rounded-xl blur-md opacity-70 animate-pulse
    bg-gradient-to-br from-primary via-fuchsia-400 to-cyan-400" />

  {/* Anillo luminoso girando */}
  <div className="absolute inset-[-6px] rounded-xl animate-spin-slow
    bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

  {/* Icono */}
  <div className="relative w-9 h-9 rounded-lg
    bg-gradient-to-br from-primary to-violet-500
    flex items-center justify-center shadow-lg">
    <DynamicIcon
      name={category.icon}
      className="w-5 h-5 text-white drop-shadow-md"
    />
  </div>
</div>

                  <span className="text-sm font-semibold leading-tight">
                    {category.name}
                  </span>
                </div>
              </button>
            ))}
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
