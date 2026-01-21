"use client"

import { Download, FileText, Calendar, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Catalog {
  id: string;
  title: string;
  description: string;
  season: string;
  year: string;
  fileUrl: string;
  coverImage?: string;
  pageCount?: number;
  isNew?: boolean;
}

// Datos de ejemplo - se reemplazarán con datos del admin
const catalogs: Catalog[] = [
  {
    id: '1',
    title: 'Catálogo Escolar 2025',
    description: 'Lista completa de útiles escolares, mochilas, loncheras y más.',
    season: 'Regreso a Clases',
    year: '2025',
    fileUrl: '#',
    coverImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop',
    pageCount: 24,
    isNew: true,
  },
  {
    id: '2',
    title: 'Catálogo de Servicios',
    description: 'Todos nuestros servicios: impresiones, sublimación, trámites y más.',
    season: 'Todo el año',
    year: '2025',
    fileUrl: '#',
    coverImage: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=300&fit=crop',
    pageCount: 12,
  },
  {
    id: '3',
    title: 'Ofertas de Temporada',
    description: 'Promociones especiales y descuentos del mes.',
    season: 'Enero 2025',
    year: '2025',
    fileUrl: '#',
    coverImage: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=300&fit=crop',
    pageCount: 8,
  },
];

export function CatalogsSection() {
  const handleDownload = (catalog: Catalog) => {
    // En producción, esto descargará el PDF real
    if (catalog.fileUrl && catalog.fileUrl !== '#') {
      window.open(catalog.fileUrl, '_blank');
    } else {
      // Placeholder - muestra mensaje si no hay archivo
      alert('Este catálogo estará disponible pronto.');
    }
  };

  const handlePreview = (catalog: Catalog) => {
    // En producción, abrirá un visor de PDF o nueva pestaña
    if (catalog.fileUrl && catalog.fileUrl !== '#') {
      window.open(catalog.fileUrl, '_blank');
    }
  };

  return (
    <section id="catalogos" className="py-12 md:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 space-y-3">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold">
            📥 Descarga Gratis
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold">
            Nuestros <span className="text-primary">Catálogos</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Descarga nuestros catálogos en PDF y compártelos con familiares y amigos.
            Actualizados por temporada.
          </p>
        </div>

        {/* Catalogs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {catalogs.map((catalog, index) => (
            <div
              key={catalog.id}
              className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Cover Image */}
              <div className="relative h-48 bg-muted overflow-hidden">
                {catalog.coverImage ? (
                  <img
                    src={catalog.coverImage}
                    alt={catalog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                    <FileText className="w-16 h-16 text-primary/30" />
                  </div>
                )}

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {catalog.isNew && (
                    <span className="px-2 py-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full">
                      NUEVO
                    </span>
                  )}
                  <span className="px-2 py-1 bg-card/90 backdrop-blur-sm text-foreground text-xs font-medium rounded-full flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {catalog.season}
                  </span>
                </div>

                {/* Page count */}
                {catalog.pageCount && (
                  <div className="absolute bottom-3 right-3">
                    <span className="px-2 py-1 bg-card/90 backdrop-blur-sm text-foreground text-xs font-medium rounded-full">
                      {catalog.pageCount} páginas
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="text-lg font-heading font-bold text-foreground group-hover:text-primary transition-colors">
                    {catalog.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {catalog.description}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleDownload(catalog)}
                    className="flex-1 font-bold"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Descargar PDF
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePreview(catalog)}
                    title="Vista previa"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="text-center mt-10">
          <p className="text-sm text-muted-foreground">
            ¿Necesitas un catálogo personalizado? {' '}
            <a href="#contacto" className="text-primary font-medium hover:underline">
              Contáctanos
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
