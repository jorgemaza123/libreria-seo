"use client"

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { X, ChevronLeft, ChevronRight, MessageCircle, ShoppingBag } from 'lucide-react';
// IMPORTAMOS TODOS LOS ICONOS
import * as LucideIcons from 'lucide-react';
import { useWhatsApp } from '@/hooks/use-whatsapp';
import { Button } from '@/components/ui/button';
import { useSiteContent } from '@/contexts/SiteContentContext';

// Helper para renderizar iconos dinámicamente
const DynamicIcon = ({ name, className }: { name: string, className?: string }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (LucideIcons as any)[name];

  // Si el nombre es un emoji (no existe en Lucide), lo mostramos como texto
  if (!IconComponent) {
    return <span className={className}>{name}</span>;
  }

  return <IconComponent className={className} />;
};

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

function CategoryModal({ category, isOpen, onClose }: CategoryModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { getWhatsAppUrl } = useWhatsApp();
  const router = useRouter();
  
  const images = category?.gallery || [];

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  const handleWhatsApp = () => {
    window.open(
      getWhatsAppUrl(`¡Hola! Me interesa ver los productos de ${category?.name}. ¿Qué opciones tienen disponibles?`),
      '_blank'
    );
  };

  const handleViewProducts = () => {
    onClose();
    router.push(`/?category=${category.slug}#productos`);
    setTimeout(() => {
      const productsSection = document.getElementById('productos');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  if (!isOpen || !category) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {images.length > 0 ? (
          <div className="relative aspect-[3/2] bg-muted">
            <Image
              src={images[currentImageIndex]}
              alt={`${category.name} - Imagen ${currentImageIndex + 1}`}
              fill
              className="object-cover transition-opacity duration-300"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors shadow-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors shadow-lg"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        idx === currentImageIndex ? 'w-6 bg-white' : 'bg-white/50 hover:bg-white/70'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
            <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg">
              {/* ICONO EN MODAL */}
              <DynamicIcon name={category.icon} className="w-5 h-5" />
              <span>{category.name}</span>
            </div>
          </div>
        ) : (
          <div className="relative aspect-[3/2] bg-muted flex items-center justify-center">
             <div className="text-center p-4 text-muted-foreground">
                 {/* ICONO EN PLACEHOLDER */}
                 <DynamicIcon name={category.icon} className="w-16 h-16 mx-auto mb-2 opacity-50" />
                 <p>Sin imágenes disponibles</p>
             </div>
          </div>
        )}

        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-2xl font-heading font-bold text-foreground">
              {category.name}
            </h3>
            {category.description && (
              <p className="text-muted-foreground mt-2">
                {category.description}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleWhatsApp}
              className="flex-1 bg-whatsapp hover:bg-whatsapp/90 text-white font-bold"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Consultar Disponibilidad
            </Button>
            <Button
              variant="outline"
              onClick={handleViewProducts}
              className="flex-1 font-bold"
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

export function CategoriesSection() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const { categories } = useSiteContent();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const activeCategories = (categories as any[]).filter((cat) => cat.isActive || cat.is_active).map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon || 'HelpCircle', // Fallback si no hay icono
      description: cat.description,
      gallery: cat.gallery || [],
      isActive: true,
      order: cat.order
  }));

  if (activeCategories.length === 0) return null;

  return (
    <>
      <section className="py-8 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {activeCategories.map((category, index) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category)}
                className="group flex items-center gap-2 px-6 py-3 bg-card rounded-full shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 hover:scale-105 card-elevated animate-fade-up border border-border hover:border-primary/50"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="text-primary group-hover:scale-125 transition-transform duration-300">
                  {/* ICONO EN LA BARRA */}
                  <DynamicIcon name={category.icon} className="w-5 h-5" />
                </span>
                <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                  {category.name}
                </span>
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