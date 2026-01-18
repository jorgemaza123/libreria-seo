"use client"

import { useState, useEffect } from 'react';
import { Phone, MessageCircle, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockContactInfo } from '@/lib/mock-data';

export function StickyContactBar() {
  const [isVisible, setIsVisible] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Mostrar después de 400px de scroll
      setIsVisible(window.scrollY > 400);
      // Mostrar botón scroll top después de 1000px
      setShowScrollTop(window.scrollY > 1000);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
            <a href={`tel:${mockContactInfo.phone}`}>
              <Phone className="w-5 h-5 mr-2" />
              Llamar
            </a>
          </Button>
          <Button
            className="flex-1 h-12 bg-[#25D366] hover:bg-[#25D366]/90 text-white border-none"
            asChild
          >
            <a 
              href={`https://wa.me/${mockContactInfo.whatsapp}?text=Hola, vi su página web y me interesa obtener información`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              WhatsApp
            </a>
          </Button>
        </div>
      </div>

      {/* Desktop Floating CTA */}
      <div
        className={`hidden lg:flex fixed bottom-8 left-8 z-50 flex-col gap-3 transition-all duration-500 ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8 pointer-events-none'
        }`}
      >
        {/* Urgency Pill */}
        <div className="bg-destructive text-destructive-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-lg animate-pulse">
          🔥 3 personas viendo ahora
        </div>
        
        {/* WhatsApp CTA */}
        <Button
          size="lg"
          className="shadow-xl h-14 text-base bg-[#25D366] hover:bg-[#25D366]/90 text-white border-none"
          asChild
        >
          <a 
            href={`https://wa.me/${mockContactInfo.whatsapp}?text=Hola, vi su página web y me interesa obtener información`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            ¿Necesitas ayuda? Chatea
          </a>
        </Button>
      </div>

      {/* Scroll to Top */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-24 lg:bottom-8 right-6 z-40 w-12 h-12 bg-card shadow-lg rounded-full flex items-center justify-center border border-border hover:bg-muted transition-all duration-300 ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        aria-label="Volver arriba"
      >
        <ArrowUp className="w-5 h-5 text-muted-foreground" />
      </button>
    </>
  );
}