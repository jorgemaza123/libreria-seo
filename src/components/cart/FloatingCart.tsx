"use client"

import { useState, useSyncExternalStore } from 'react';
import { ShoppingBag, X, ChevronUp, ChevronDown, MessageCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';

// Hook para detectar si estamos en el cliente (evita errores de hidratación)
const useIsClient = () => {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
};

export function FloatingCart() {
  const {
    items,
    getTotal,
    getItemCount,
    sendToWhatsApp,
    setIsCartOpen,
    removeFromCart,
  } = useCart();

  const [isExpanded, setIsExpanded] = useState(false);
  const isClient = useIsClient();

  if (!isClient) return null;

  const itemCount = getItemCount();

  // Don't show if cart is empty
  if (itemCount === 0) return null;

  return (
    <div className="fixed bottom-20 right-4 z-40 md:bottom-6">
      {/* Expanded Cart Preview */}
      {isExpanded && (
        <div className="mb-3 w-80 bg-card rounded-xl shadow-2xl border border-border overflow-hidden animate-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-border bg-muted/50">
            <span className="font-semibold text-sm">Mi Cotización ({itemCount})</span>
            <button
              onClick={() => setIsExpanded(false)}
              className="w-6 h-6 rounded-full hover:bg-muted flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Items List */}
          <div className="max-h-60 overflow-y-auto p-2 space-y-2">
            {items.map((item) => {
              const price = item.product.salePrice || item.product.price;
              return (
                <div
                  key={item.product.id}
                  className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg group"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium line-clamp-1">{item.product.name}</p>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-xs text-muted-foreground">
                        {item.quantity} x S/{price.toFixed(2)}
                      </span>
                      <span className="text-xs font-semibold text-primary">
                        S/{(price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-full hover:bg-destructive/10 hover:text-destructive flex items-center justify-center transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-border space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total Estimado:</span>
              <span className="text-lg font-bold text-primary">S/ {getTotal().toFixed(2)}</span>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => {
                  setIsExpanded(false);
                  setIsCartOpen(true);
                }}
              >
                Ver detalles
              </Button>
              <Button
                size="sm"
                className="flex-1 bg-whatsapp hover:bg-whatsapp/90 text-whatsapp-foreground border-none"
                onClick={sendToWhatsApp}
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                Enviar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="relative flex items-center gap-2 bg-primary text-primary-foreground px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
      >
        <ShoppingBag className="w-5 h-5" />
        
        {/* Item count badge */}
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center">
          {itemCount > 9 ? '9+' : itemCount}
        </span>

        {/* Mini preview of items */}
        <div className="flex -space-x-2 mr-1">
          {items.slice(0, 3).map((item) => (
            <img
              key={item.product.id}
              src={item.product.image}
              alt=""
              className="w-6 h-6 rounded-full border-2 border-primary object-cover"
            />
          ))}
          {items.length > 3 && (
            <div className="w-6 h-6 rounded-full bg-primary-foreground text-primary text-xs font-bold flex items-center justify-center border-2 border-primary">
              +{items.length - 3}
            </div>
          )}
        </div>

        <span className="font-semibold text-sm hidden sm:inline">
          S/ {getTotal().toFixed(2)}
        </span>

        {isExpanded ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronUp className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}