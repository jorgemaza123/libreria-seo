"use client"

import { useState } from 'react';
import { Minus, Plus, ShoppingCart, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import type { Product } from '@/lib/types';

interface AddToCartButtonProps {
  product: Product;
  isSticky?: boolean;
}

export function AddToCartButton({ product, isSticky = false }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart } = useCart();

  const isOutOfStock = product.stock !== undefined && product.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const decreaseQuantity = () => setQuantity(Math.max(1, quantity - 1));
  const increaseQuantity = () => {
    const maxStock = product.stock ?? 99;
    setQuantity(Math.min(maxStock, quantity + 1));
  };

  if (isSticky) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center bg-muted rounded-xl overflow-hidden">
          <button
            onClick={decreaseQuantity}
            disabled={quantity <= 1 || isOutOfStock}
            className="w-11 h-11 flex items-center justify-center hover:bg-muted-foreground/10 active:bg-muted-foreground/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Reducir cantidad"
          >
            <Minus className="w-5 h-5" />
          </button>
          <span
            className="w-10 text-center font-bold text-lg tabular-nums"
            aria-live="polite"
            aria-label={`Cantidad: ${quantity}`}
          >
            {quantity}
          </span>
          <button
            onClick={increaseQuantity}
            disabled={isOutOfStock || (product.stock !== undefined && quantity >= product.stock)}
            className="w-11 h-11 flex items-center justify-center hover:bg-muted-foreground/10 active:bg-muted-foreground/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Aumentar cantidad"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAdded}
          className={`
            flex-1 h-12 text-base font-bold rounded-xl shadow-lg
            transition-all duration-300 active:scale-[0.98]
            ${isAdded
              ? 'bg-green-600 hover:bg-green-600'
              : 'bg-primary hover:bg-primary/90'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
          aria-label={isOutOfStock ? 'Producto agotado' : `Agregar ${quantity} al carrito`}
        >
          {isAdded ? (
            <>
              <Check className="w-5 h-5 mr-2" aria-hidden="true" />
              Agregado
            </>
          ) : isOutOfStock ? (
            'Agotado'
          ) : (
            <>
              <ShoppingCart className="w-5 h-5 mr-2" aria-hidden="true" />
              Agregar
            </>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div
          className="flex items-center justify-center bg-muted rounded-2xl overflow-hidden"
          role="group"
          aria-label="Selector de cantidad"
        >
          <button
            onClick={decreaseQuantity}
            disabled={quantity <= 1 || isOutOfStock}
            className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center hover:bg-muted-foreground/10 active:bg-muted-foreground/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
            aria-label="Reducir cantidad"
          >
            <Minus className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <span
            className="w-14 md:w-16 text-center font-bold text-xl md:text-2xl tabular-nums"
            aria-live="polite"
            aria-label={`Cantidad seleccionada: ${quantity}`}
          >
            {quantity}
          </span>
          <button
            onClick={increaseQuantity}
            disabled={isOutOfStock || (product.stock !== undefined && quantity >= product.stock)}
            className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center hover:bg-muted-foreground/10 active:bg-muted-foreground/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
            aria-label="Aumentar cantidad"
          >
            <Plus className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAdded}
          className={`
            flex-1 h-14 md:h-16 text-lg md:text-xl font-bold rounded-2xl shadow-xl
            transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
            ${isAdded
              ? 'bg-green-600 hover:bg-green-600'
              : 'bg-primary hover:bg-primary/90'
            }
            disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
          `}
          aria-label={isOutOfStock ? 'Producto agotado' : `Agregar ${quantity} unidades al carrito`}
        >
          {isAdded ? (
            <>
              <Check className="w-6 h-6 mr-3 animate-bounce" aria-hidden="true" />
              ¡Agregado al carrito!
            </>
          ) : isOutOfStock ? (
            'Producto Agotado'
          ) : (
            <>
              <ShoppingCart className="w-6 h-6 mr-3" aria-hidden="true" />
              Agregar al Carrito
            </>
          )}
        </Button>
      </div>

      {!isOutOfStock && product.stock !== undefined && product.stock <= 5 && (
        <p
          className="text-center text-sm text-amber-600 dark:text-amber-400 font-medium"
          role="alert"
        >
          ¡Solo quedan {product.stock} unidades!
        </p>
      )}
    </div>
  );
}
