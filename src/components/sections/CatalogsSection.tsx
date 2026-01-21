"use client"

import { useState, useEffect } from 'react';
import { Download, FileText, Calendar, Eye, Loader2 } from 'lucide-react';
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
  isActive?: boolean;
}

export function CatalogsSection() {
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCatalogs() {
      try {
        // Añadimos un timestamp para evitar caché del navegador
        const res = await fetch(`/api/catalogs?t=${Date.now()}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          // Filtramos solo los activos para la vista pública
          const activeCatalogs = (data.catalogs || []).filter((c: Catalog) => c.isActive);
          setCatalogs(activeCatalogs);
        }
      } catch (error) {
        console.error("Error cargando catálogos:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCatalogs();
  }, []);

  const handleDownload = (catalog: Catalog) => {
    if (catalog.fileUrl) {
      window.open(catalog.fileUrl, '_blank');
    } else {
      alert('El archivo no está disponible.');
    }
  };

  if (loading) {
    return (
        <section id="catalogos" className="py-16 bg-muted/30 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary opacity-50" />
            <p className="text-sm text-muted-foreground mt-2">Cargando catálogos...</p>
        </section>
    )
  }

  // Si no hay catálogos activos, ocultamos la sección o mostramos mensaje
  if (catalogs.length === 0) return null; 

  return (
    <section id="catalogos" className="py-12 md:py-16 bg-muted/30 relative overflow-hidden">
       {/* Fondo decorativo sutil */}
       <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 -z-10" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-8 space-y-3">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold animate-fade-down">
            📥 Descarga Gratis
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold animate-fade-up">
            Nuestros <span className="text-primary">Catálogos</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Descarga nuestras listas de útiles y catálogos de temporada en PDF.
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
                  /* eslint-disable-next-line @next/next/no-img-element */
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
                    <span className="px-2 py-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full shadow-md">
                      NUEVO
                    </span>
                  )}
                  <span className="px-2 py-1 bg-card/90 backdrop-blur-sm text-foreground text-xs font-medium rounded-full flex items-center gap-1 shadow-sm">
                    <Calendar className="w-3 h-3" />
                    {catalog.season} {catalog.year}
                  </span>
                </div>

                {/* Page count */}
                {catalog.pageCount && (
                  <div className="absolute bottom-3 right-3">
                    <span className="px-2 py-1 bg-card/90 backdrop-blur-sm text-foreground text-xs font-medium rounded-full shadow-sm">
                      {catalog.pageCount} páginas
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="text-lg font-heading font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {catalog.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {catalog.description || 'Descarga disponible en PDF.'}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleDownload(catalog)}
                    className="flex-1 font-bold shadow-sm"
                    disabled={!catalog.fileUrl}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Descargar
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDownload(catalog)}
                    title="Vista previa"
                    className="hover:text-primary hover:border-primary"
                    disabled={!catalog.fileUrl}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="text-center mt-10 animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <p className="text-sm text-muted-foreground">
            ¿Necesitas una cotización personalizada? {' '}
            <a href="#contacto" className="text-primary font-medium hover:underline">
              Escríbenos al WhatsApp
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}