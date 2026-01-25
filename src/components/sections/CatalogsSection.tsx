"use client";

import { useState, useEffect, useCallback } from 'react';
import { Download, FileText, Calendar, Eye, Loader2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

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
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCatalogs() {
      try {
        const res = await fetch('/api/catalogs', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
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

  const handleDownload = useCallback(async (catalog: Catalog) => {
    if (!catalog.fileUrl) {
      toast.error('El archivo no está disponible.');
      return;
    }

    try {
      setDownloadingId(catalog.id);

      const response = await fetch(catalog.fileUrl);
      if (!response.ok) throw new Error("Error al obtener el archivo");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      const safeTitle = catalog.title
        .replace(/[^a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');

      link.setAttribute('download', `${safeTitle || 'catalogo'}.pdf`);

      document.body.appendChild(link);
      link.click();

      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(`Descargando ${catalog.title}...`);

    } catch (error) {
      console.error("Error descarga:", error);
      toast.error("No se pudo descargar. Abriendo en nueva pestaña...");
      window.open(catalog.fileUrl, '_blank');
    } finally {
      setDownloadingId(null);
    }
  }, []);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <section id="catalogos" className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-80 rounded-2xl bg-muted animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (catalogs.length === 0) return null;

  return (
    <section
      id="catalogos"
      className="py-12 md:py-16 lg:py-20 bg-muted/30 relative overflow-hidden"
      aria-labelledby="catalogs-title"
    >
      {/* Fondo decorativo */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 -z-10" aria-hidden="true" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <header className="text-center mb-10 space-y-3">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold">
            <BookOpen className="w-4 h-4" />
            Descarga Gratis
          </span>
          <h2
            id="catalogs-title"
            className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold"
          >
            Nuestros <span className="text-primary">Catálogos</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Descarga nuestras listas de útiles y catálogos de temporada en PDF
          </p>
        </header>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6" role="list">
          {catalogs.map((catalog) => (
            <article
              key={catalog.id}
              role="listitem"
              className="group bg-card rounded-2xl overflow-hidden border border-border
                         shadow-sm transition-all duration-300 ease-out
                         hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Cover */}
              <div className="relative h-48 sm:h-52 bg-muted overflow-hidden">
                {catalog.coverImage ? (
                  <img
                    src={catalog.coverImage}
                    alt={`Portada de ${catalog.title}`}
                    className="w-full h-full object-cover object-top
                               group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center
                                  bg-gradient-to-br from-primary/20 to-primary/5">
                    <FileText className="w-16 h-16 text-primary/30" aria-hidden="true" />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                  {catalog.isNew && (
                    <span className="px-3 py-1.5 bg-destructive text-destructive-foreground
                                     text-sm font-bold rounded-full shadow-md">
                      NUEVO
                    </span>
                  )}
                  <span className="px-3 py-1.5 bg-card/90 backdrop-blur-sm text-foreground
                                   text-sm font-medium rounded-full flex items-center gap-1.5 shadow-sm">
                    <Calendar className="w-4 h-4" aria-hidden="true" />
                    {catalog.season} {catalog.year}
                  </span>
                </div>

                {catalog.pageCount && (
                  <div className="absolute bottom-3 right-3">
                    <span className="px-3 py-1.5 bg-card/90 backdrop-blur-sm
                                     text-foreground text-sm font-medium rounded-full shadow-sm">
                      {catalog.pageCount} páginas
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 sm:p-6 space-y-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-heading font-bold text-foreground
                                 group-hover:text-primary transition-colors line-clamp-1">
                    {catalog.title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground mt-2 line-clamp-2">
                    {catalog.description || 'Descarga disponible en PDF.'}
                  </p>
                </div>

                {/* Actions - Botones Grandes */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleDownload(catalog)}
                    className="flex-1 min-h-[48px] font-bold text-base shadow-sm"
                    disabled={!catalog.fileUrl || downloadingId === catalog.id}
                    aria-label={`Descargar catálogo ${catalog.title}`}
                  >
                    {downloadingId === catalog.id ? (
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                      <Download className="w-5 h-5 mr-2" aria-hidden="true" />
                    )}
                    {downloadingId === catalog.id ? 'Bajando...' : 'Descargar'}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => window.open(catalog.fileUrl, '_blank')}
                    aria-label={`Ver catálogo ${catalog.title} en nueva pestaña`}
                    className="min-h-[48px] min-w-[48px] px-4"
                    disabled={!catalog.fileUrl}
                  >
                    <Eye className="w-5 h-5" aria-hidden="true" />
                    <span className="hidden sm:inline ml-2">Ver</span>
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Footer note */}
        <div className="text-center mt-10">
          <p className="text-base text-muted-foreground">
            ¿Necesitas una cotización personalizada?{' '}
            <a href="#contacto" className="text-primary font-semibold hover:underline">
              Escríbenos al WhatsApp
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
