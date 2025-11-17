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
      style={{
        borderColor: isInStock ? '#0a2463' : undefined,
        color: isInStock ? '#0a2463' : undefined,
      }}
      onMouseEnter={(e) => {
        if (isInStock) {
          e.currentTarget.style.backgroundColor = '#d83e1e';
          e.currentTarget.style.color = '#ffffff';
        }
      }}
      onMouseLeave={(e) => {
        if (isInStock) {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = '#0a2463';
        }
      }}
      className={`
        flex items-center justify-center gap-2 rounded-lg border-2 px-6 py-3
        font-semibold transition-all
        disabled:cursor-not-allowed disabled:opacity-50
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
