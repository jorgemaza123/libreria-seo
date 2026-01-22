"use client"

import { useState, useEffect } from 'react';
import { X, Copy, Check, QrCode, MessageCircle, Facebook, Mail, Link2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Icono de WhatsApp
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

// Icono de Telegram
function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  );
}

export function ShareModal({ isOpen, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, [isOpen]);

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: WhatsAppIcon,
      color: 'bg-[#25D366] hover:bg-[#20BA5C]',
      action: () => {
        const text = '¡Mira esta librería! Tienen útiles escolares, impresiones, sublimación y más servicios. 📚';
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + currentUrl)}`, '_blank');
      },
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-[#1877F2] hover:bg-[#166FE5]',
      action: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
      },
    },
    {
      name: 'Telegram',
      icon: TelegramIcon,
      color: 'bg-[#0088CC] hover:bg-[#0077B5]',
      action: () => {
        const text = '¡Mira esta librería! Tienen útiles escolares, impresiones y más.';
        window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(text)}`, '_blank');
      },
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'bg-gray-600 hover:bg-gray-700',
      action: () => {
        const subject = 'Librería CHROMA - Útiles escolares y servicios';
        const body = `Hola,\n\nTe comparto esta librería que tiene muy buenos precios en útiles escolares, impresiones, sublimación y más servicios.\n\n${currentUrl}`;
        window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
      },
    },
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      toast.success('Enlace copiado al portapapeles');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('No se pudo copiar el enlace');
    }
  };

  const downloadQR = () => {
    // Genera URL del QR usando API de Google Charts
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(currentUrl)}`;

    // Crear link de descarga
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = 'libreria-CHROMA-qr.png';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('QR descargado');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-card rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-lg font-heading font-bold">Compartir página</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* QR Code Section */}
          {showQR ? (
            <div className="text-center space-y-4">
              <div className="bg-white p-4 rounded-xl inline-block">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentUrl)}`}
                  alt="Código QR"
                  className="w-48 h-48"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Escanea este código con tu celular para abrir la página
              </p>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" size="sm" onClick={() => setShowQR(false)}>
                  Volver
                </Button>
                <Button size="sm" onClick={downloadQR}>
                  <Download className="w-4 h-4 mr-2" />
                  Descargar QR
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Share Options Grid */}
              <div className="grid grid-cols-4 gap-3">
                {shareOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.name}
                      onClick={option.action}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl ${option.color} text-white transition-all hover:scale-105`}
                    >
                      <Icon className="w-6 h-6" />
                      <span className="text-xs font-medium">{option.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* QR Button */}
              <button
                onClick={() => setShowQR(true)}
                className="w-full flex items-center justify-center gap-3 p-4 bg-muted/50 hover:bg-muted rounded-xl transition-colors"
              >
                <QrCode className="w-6 h-6 text-primary" />
                <div className="text-left">
                  <p className="font-medium">Código QR</p>
                  <p className="text-xs text-muted-foreground">Comparte fácilmente con tu celular</p>
                </div>
              </button>

              {/* Copy Link */}
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg border border-border">
                  <Link2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm truncate">{currentUrl}</span>
                </div>
                <Button
                  variant={copied ? "default" : "outline"}
                  size="icon"
                  onClick={copyToClipboard}
                  className="flex-shrink-0"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>

              {/* Native Share (if available) */}
              {typeof navigator !== 'undefined' && navigator.share && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={async () => {
                    try {
                      await navigator.share({
                        title: 'Librería CHROMA',
                        text: '¡Mira esta librería! Útiles escolares, impresiones y más.',
                        url: currentUrl,
                      });
                    } catch {
                      // Usuario canceló o error
                    }
                  }}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Más opciones para compartir
                </Button>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-muted/30 border-t border-border">
          <p className="text-xs text-center text-muted-foreground">
            Comparte con amigos, vecinos y colegios cercanos
          </p>
        </div>
      </div>
    </div>
  );
}
