"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { Product } from '@/lib/types';
import { useSiteContent } from '@/contexts/SiteContentContext';
import { CONTACT } from '@/lib/constants';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  sendToWhatsApp: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper para limpiar número de teléfono
function cleanPhoneNumber(phone: string): string {
  return phone.replace(/[\s\-\+\(\)]/g, '');
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { effectiveContent } = useSiteContent();

  const addToCart = useCallback((product: Product) => {
    setItems((prev) => {
      const existingItem = prev.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getTotal = useCallback(() => {
    return items.reduce((total, item) => {
      const price = item.product.salePrice || item.product.price;
      return total + price * item.quantity;
    }, 0);
  }, [items]);

  const getItemCount = useCallback(() => {
    return items.reduce((count, item) => count + item.quantity, 0);
  }, [items]);

  const sendToWhatsApp = useCallback(() => {
    if (items.length === 0) return;

    // Obtener número de WhatsApp del contexto o fallback
    const contextNumber = effectiveContent?.contact?.whatsapp;
    const whatsappNumber = contextNumber && contextNumber.trim()
      ? cleanPhoneNumber(contextNumber)
      : CONTACT.whatsapp;

    const message = buildWhatsAppMessage(items, getTotal());
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }, [items, getTotal, effectiveContent]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotal,
        getItemCount,
        sendToWhatsApp,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

function buildWhatsAppMessage(items: CartItem[], total: number): string {
  let message = '🛒 *SOLICITUD DE COTIZACIÓN*\n\n';
  message += 'Hola, me gustaría cotizar los siguientes productos:\n\n';

  items.forEach((item, index) => {
    const price = item.product.salePrice || item.product.price;
    message += `${index + 1}. *${item.product.name}*\n`;
    message += `   📦 Cantidad: ${item.quantity}\n`;
    message += `   💰 Precio unit.: S/ ${price.toFixed(2)}\n`;
    message += `   📝 Subtotal: S/ ${(price * item.quantity).toFixed(2)}\n\n`;
  });

  message += `─────────────────\n`;
  message += `💵 *TOTAL ESTIMADO: S/ ${total.toFixed(2)}*\n\n`;
  message += `Por favor confirmar disponibilidad y precio final. ¡Gracias!`;

  return message;
}