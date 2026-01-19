"use client"

import { X, Plus, Minus, Trash2, ShoppingBag, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';

export function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotal,
    getItemCount,
    sendToWhatsApp,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-card border-l border-border shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h2 className="font-heading font-bold text-lg">
              Mi Cotización ({getItemCount()})
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Tu lista está vacía</p>
              <p className="text-sm text-muted-foreground mt-1">
                Agrega productos para cotizar
              </p>
            </div>
          ) : (
            items.map((item) => {
              const price = item.product.salePrice || item.product.price;
              return (
                <div
                  key={item.product.id}
                  className="flex gap-3 p-3 bg-muted/30 rounded-xl"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm line-clamp-2">
                      {item.product.name}
                    </h4>
                    <p className="text-primary font-bold mt-1">
                      S/ {price.toFixed(2)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="w-7 h-7 rounded-full bg-card border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="w-7 h-7 rounded-full bg-card border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="ml-auto w-7 h-7 rounded-full hover:bg-destructive/10 hover:text-destructive flex items-center justify-center transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-border space-y-4">
            {/* Total */}
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total Estimado:</span>
              <span className="text-primary">S/ {getTotal().toFixed(2)}</span>
            </div>

            {/* Actions */}
            <Button
              size="lg"
              className="w-full bg-whatsapp hover:bg-whatsapp/90 text-whatsapp-foreground border-none"
              onClick={sendToWhatsApp}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Enviar Cotización por WhatsApp
            </Button>

            <button
              onClick={clearCart}
              className="w-full text-sm text-muted-foreground hover:text-destructive transition-colors"
            >
              Vaciar lista
            </button>
          </div>
        )}
      </div>
    </>
  );
}