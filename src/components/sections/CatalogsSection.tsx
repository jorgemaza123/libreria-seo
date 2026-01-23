"use client";

import { useState, useEffect, useCallback } from 'react';
import { Download, FileText, Calendar, Eye, Loader2 } from 'lucide-react';
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
  // Estado para saber qué catálogo se está descargando actualmente
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCatalogs() {
      try {
        const res = await fetch('/api/catalogs', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          const activeCatalogs = (data.catalogs || [])
            .filter((c: Catalog) => c.isActive);
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
      
      // 1. Descargamos el archivo a la memoria (Blob)
      const response = await fetch(catalog.fileUrl);
      if (!response.ok) throw new Error("Error al obtener el archivo");
      
      const blob = await response.blob();
      
      // 2. Creamos una URL temporal
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // 3. Limpiamos el nombre para que sea un archivo válido
      const safeTitle = catalog.title
        .replace(/[^a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ\s-]/g, '') // Solo letras y números
        .trim()
        .replace(/\s+/g, '-'); // Espacios por guiones
        
      link.setAttribute('download', `${safeTitle || 'catalogo'}.pdf`);
      
      // 4. Forzamos la descarga
      document.body.appendChild(link);
      link.click();
      
      // 5. Limpieza
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success(`Descargando ${catalog.title}...`);

    } catch (error) {
      console.error("Error descarga:", error);
      toast.error("No se pudo renombrar el archivo. Abriendo pestaña directa...");
      // Fallback: Si falla, abrir en nueva pestaña con el nombre original
      window.open(catalog.fileUrl, '_blank');
    } finally {
      setDownloadingId(null);
    }
  }, []);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <section id="catalogos" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    <section id="catalogos" className="py-12 md:py-16 bg-muted/30 relative overflow-hidden">
      {/* Fondo decorativo */}
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
          <p
            className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-up"
            style={{ animationDelay: '0.1s' }}
          >
            Descarga nuestras listas de útiles y catálogos de temporada en PDF.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {catalogs.map((catalog, index) => (
            <div
              key={catalog.id}
              className="group bg-card rounded-2xl overflow-hidden border border-border
                         shadow-sm transition-all duration-300 ease-out
                         hover:-translate-y-1 hover:shadow-lg animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Cover */}
              <div className="relative h-48 bg-muted overflow-hidden">
                {catalog.coverImage ? (
                  <img
                    src={catalog.coverImage}
                    alt={catalog.title}
                    className="w-full h-full object-cover object-top
                               group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center
                                  bg-gradient-to-br from-primary/20 to-primary/5">
                    <FileText className="w-16 h-16 text-primary/30" aria-hidden />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {catalog.isNew && (
                    <span className="px-2 py-1 bg-destructive text-destructive-foreground
                                     text-xs font-bold rounded-full shadow-md">
                      NUEVO
                    </span>
                  )}
                  <span className="px-2 py-1 bg-card/90 backdrop-blur-sm text-foreground
                                   text-xs font-medium rounded-full flex items-center gap-1 shadow-sm">
                    <Calendar className="w-3 h-3" aria-hidden />
                    {catalog.season} {catalog.year}
                  </span>
                </div>

                {catalog.pageCount && (
                  <div className="absolute bottom-3 right-3">
                    <span className="px-2 py-1 bg-card/90 backdrop-blur-sm
                                     text-foreground text-xs font-medium rounded-full shadow-sm">
                      {catalog.pageCount} páginas
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="text-lg font-heading font-bold text-foreground
                                 group-hover:text-primary transition-colors line-clamp-1">
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
                    disabled={!catalog.fileUrl || downloadingId === catalog.id}
                  >
                    {downloadingId === catalog.id ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                        <Download className="w-4 h-4 mr-2" aria-hidden />
                    )}
                    {downloadingId === catalog.id ? 'Bajando...' : 'Descargar'}
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.open(catalog.fileUrl, '_blank')}
                    aria-label={`Vista previa del catálogo ${catalog.title}`}
                    className="hover:text-primary"
                    disabled={!catalog.fileUrl}
                  >
                    <Eye className="w-4 h-4" aria-hidden />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div
          className="text-center mt-10 animate-fade-up"
          style={{ animationDelay: '0.4s' }}
        >
          <p className="text-sm text-muted-foreground">
            ¿Necesitas una cotización personalizada?{' '}
            <a href="#contacto" className="text-primary font-medium hover:underline">
              Escríbenos al WhatsApp
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}