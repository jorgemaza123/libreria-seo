"use client"

import { useState } from 'react';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import type { Product } from '@/lib/types';

export function AddToCartButton({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    // Aquí podrías implementar la lógica para añadir múltiples items a la vez si tu contexto lo soporta
    // Por ahora añadimos 1 a 1 según la cantidad seleccionada
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex items-center border border-border rounded-lg">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="w-12 h-12 flex items-center justify-center hover:bg-muted transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-12 text-center font-medium">{quantity}</span>
        <button
          onClick={() => setQuantity(quantity + 1)}
          className="w-12 h-12 flex items-center justify-center hover:bg-muted transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <Button 
        size="lg" // Reemplazado 'xl' por 'lg' si no está definido en tu theme
        className="flex-1 bg-primary text-primary-foreground font-bold"
        onClick={handleAddToCart}
      >
        <ShoppingCart className="w-5 h-5 mr-2" />
        Agregar al Carrito
      </Button>
    </div>
  );
}