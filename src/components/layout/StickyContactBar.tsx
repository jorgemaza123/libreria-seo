"use client"

import { useState, useEffect } from 'react';
import { Phone, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWhatsApp } from '@/hooks/use-whatsapp';

// Icono de WhatsApp moderno SVG
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

export function StickyContactBar() {
  const [isVisible, setIsVisible] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isPulsing, setIsPulsing] = useState(true);
  const { getWhatsAppUrl, getPhoneUrl } = useWhatsApp();

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
      setShowScrollTop(window.scrollY > 1000);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Pausar la animación después de unos segundos
  useEffect(() => {
    const timer = setTimeout(() => setIsPulsing(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Mobile Sticky Bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-card/95 backdrop-blur-md border-t border-border shadow-lg transition-transform duration-300 ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="flex gap-2 p-3 safe-area-pb">
          <Button
            variant="outline"
            className="flex-1 h-12"
            asChild
          >
            <a href={getPhoneUrl()}>
              <Phone className="w-5 h-5 mr-2" />
              Llamar
            </a>
          </Button>
          <Button
            className="flex-1 h-12 bg-[#25D366] hover:bg-[#20BA5C] text-white border-none font-bold"
            asChild
          >
            <a
              href={getWhatsAppUrl('Hola, vi su página web y me interesa obtener información')}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon className="w-5 h-5 mr-2" />
              WhatsApp
            </a>
          </Button>
        </div>
      </div>

      {/* Desktop Floating WhatsApp Button - Moderno */}
      <div
        className={`hidden lg:block fixed bottom-8 right-8 z-50 transition-all duration-500 ${
          isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-90 pointer-events-none'
        }`}
      >
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-3 whitespace-nowrap">
          <div className="bg-card text-foreground px-4 py-2 rounded-lg shadow-lg text-sm font-medium animate-bounce-subtle border border-border">
            ¿Necesitas ayuda?
            <span className="ml-1">👋</span>
          </div>
          <div className="absolute -bottom-1 right-6 w-2 h-2 bg-card border-r border-b border-border transform rotate-45" />
        </div>

        {/* WhatsApp Button */}
        <a
          href={getWhatsAppUrl('Hola, vi su página web y me interesa obtener información')}
          target="_blank"
          rel="noopener noreferrer"
          className={`group relative flex items-center justify-center w-16 h-16 bg-[#25D366] hover:bg-[#20BA5C] rounded-full shadow-2xl transition-all duration-300 hover:scale-110 ${
            isPulsing ? 'animate-pulse-ring' : ''
          }`}
        >
          {/* Ripple effect */}
          <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25" />

          {/* Icon */}
          <WhatsAppIcon className="w-8 h-8 text-white relative z-10 group-hover:scale-110 transition-transform" />
        </a>
      </div>

      {/* Scroll to Top */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-24 lg:bottom-8 right-6 lg:right-28 z-40 w-12 h-12 bg-card shadow-lg rounded-full flex items-center justify-center border border-border hover:bg-muted hover:scale-110 transition-all duration-300 ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        aria-label="Volver arriba"
      >
        <ArrowUp className="w-5 h-5 text-muted-foreground" />
      </button>

      {/* Estilos para la animación del anillo */}
      <style jsx global>{`
        @keyframes pulse-ring {
          0% {
            box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7);
          }
          70% {
            box-shadow: 0 0 0 15px rgba(37, 211, 102, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(37, 211, 102, 0);
          }
        }
        .animate-pulse-ring {
          animation: pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
        }
        @keyframes bounce-subtle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}