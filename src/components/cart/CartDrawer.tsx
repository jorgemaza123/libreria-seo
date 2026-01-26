"use client"

import { X, Plus, Minus, Trash2, ShoppingBag, MessageCircle, ArrowLeft } from 'lucide-react';
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

  const handleClose = () => setIsCartOpen(false);

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55]"
        onClick={handleClose}
        aria-hidden="true"
      />

      <div
        className="fixed inset-y-0 right-0 w-full max-w-md bg-card border-l border-border shadow-2xl z-[55] flex flex-col animate-in slide-in-from-right duration-300 safe-area-pt"
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
      >
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-lg">Mi Cotización</h2>
              <p className="text-sm text-muted-foreground">
                {getItemCount()} {getItemCount() === 1 ? 'producto' : 'productos'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-11 h-11 rounded-full hover:bg-muted active:bg-muted/80 active:scale-95 flex items-center justify-center transition-all touch-manipulation"
            aria-label="Cerrar carrito"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
                <ShoppingBag className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Tu lista está vacía</h3>
              <p className="text-muted-foreground mb-6 max-w-[250px]">
                Agrega productos para solicitar una cotización por WhatsApp
              </p>
              <Button
                size="lg"
                onClick={handleClose}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Explorar productos
              </Button>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {items.map((item) => {
                const price = item.product.salePrice || item.product.price;
                return (
                  <div
                    key={item.product.id}
                    className="flex gap-3 p-3 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2 leading-tight">
                        {item.product.name}
                      </h4>
                      <p className="text-primary font-bold text-lg mt-1">
                        S/ {price.toFixed(2)}
                      </p>

                      <div className="flex items-center gap-1.5 mt-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary active:scale-95 transition-all touch-manipulation"
                          aria-label="Reducir cantidad"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center font-bold text-lg tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary active:scale-95 transition-all touch-manipulation"
                          aria-label="Aumentar cantidad"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="ml-auto w-10 h-10 rounded-full hover:bg-destructive/10 hover:text-destructive active:scale-95 flex items-center justify-center transition-all touch-manipulation"
                          aria-label={`Eliminar ${item.product.name} del carrito`}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t border-border bg-card space-y-4 safe-area-pb">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Estimado:</span>
              <span className="text-2xl font-bold text-primary">
                S/ {getTotal().toFixed(2)}
              </span>
            </div>

            <div className="space-y-2">
              <Button
                size="lg"
                className="w-full h-14 text-base font-bold bg-[#25D366] hover:bg-[#20BA5C] active:bg-[#1da851] active:scale-[0.98] text-white border-none rounded-xl transition-all touch-manipulation"
                onClick={sendToWhatsApp}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Enviar Cotización por WhatsApp
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full h-12 text-base font-medium rounded-xl active:scale-[0.98] active:bg-muted transition-all touch-manipulation"
                onClick={handleClose}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Seguir Comprando
              </Button>
            </div>

            <button
              onClick={clearCart}
              className="w-full text-sm text-muted-foreground hover:text-destructive transition-colors py-2"
            >
              Vaciar lista
            </button>
          </div>
        )}
      </div>
    </>
  );
}
