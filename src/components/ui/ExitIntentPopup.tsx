"use client"

import { useState, useEffect } from 'react';
import { X, Gift, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockContactInfo } from '@/lib/mock-data';

export function ExitIntentPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Verificar si ya se mostró antes
    const hasSeenPopup = localStorage.getItem('exitPopupSeen');
    if (hasSeenPopup) return;

    // Desktop: detectar cuando el mouse sale hacia arriba
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasTriggered) {
        setHasTriggered(true);
        setIsOpen(true);
      }
    };

    // Mobile: activar después de 30 segundos si no ha interactuado
    const timeoutId = setTimeout(() => {
      if (!hasTriggered && window.innerWidth < 768) {
        setHasTriggered(true);
        setIsOpen(true);
      }
    }, 30000);

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(timeoutId);
    };
  }, [hasTriggered]);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('exitPopupSeen', 'true');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simular envío
    setSubmitted(true);
    setTimeout(() => {
      handleClose();
      // Abrir WhatsApp con la oferta
      window.open(
        `https://wa.me/${mockContactInfo.whatsapp}?text=Hola! Vi la oferta de 15% de descuento en la web. Mi correo es: ${email}`,
        '_blank'
      );
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-card rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in border border-border">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-muted/80 flex items-center justify-center hover:bg-muted transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header con gradiente */}
        <div className="bg-gradient-to-br from-primary via-primary to-accent p-8 text-center text-primary-foreground">
          <div className="w-16 h-16 bg-primary-foreground/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-heading font-bold mb-2">
            ¡Espera! No te vayas aún 🎁
          </h3>
          <p className="text-primary-foreground/90">
            Tenemos una oferta especial para ti
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {!submitted ? (
            <>
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full font-bold text-lg">
                  15% DESCUENTO
                </div>
                <p className="text-muted-foreground">
                  En tu primera compra de papelería o servicio de impresión
                </p>
              </div>

              {/* Benefits */}
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  Válido por 7 días
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  Sin mínimo de compra
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  Acumulable con otras ofertas
                </li>
              </ul>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Tu correo electrónico"
                  required
                  className="w-full h-12 px-4 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                >
                  Obtener mi descuento
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </form>

              <p className="text-xs text-muted-foreground text-center">
                Solo enviaremos ofertas exclusivas. Nada de spam.
              </p>
            </>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-accent" />
              </div>
              <h4 className="text-xl font-heading font-bold">¡Listo! 🎉</h4>
              <p className="text-muted-foreground">
                Te redirigimos a WhatsApp para confirmar tu descuento...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}