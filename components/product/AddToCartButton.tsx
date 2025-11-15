'use client';

import { useState } from 'react';
import { WooCommerceProduct } from '@/types/product';
import { useCartStore } from '@/lib/store/cartStore';
import { ShoppingCart, Check } from 'lucide-react';

interface AddToCartButtonProps {
  product: WooCommerceProduct;
  quantity?: number;
  className?: string;
}

export function AddToCartButton({
  product,
  quantity = 1,
  className = ''
}: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const isInStock = product.stock_status === 'instock';

  const handleAddToCart = () => {
    if (!isInStock) return;

    addItem(product, quantity);
    setAdded(true);

    // Reset after 2 seconds
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={!isInStock}
      className={`
        flex items-center justify-center gap-2 rounded-lg border-2 border-navy px-6 py-3
        font-semibold text-navy transition-all
        hover:bg-navy hover:text-white
        disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-navy
        ${className}
      `}
    >
      {added ? (
        <>
          <Check className="h-5 w-5" />
          <span>נוסף לעגלה!</span>
        </>
      ) : (
        <>
          <ShoppingCart className="h-5 w-5" />
          <span>הוסף לעגלה</span>
        </>
      )}
    </button>
  );
}
