'use client';

import { useState } from 'react';
import { WooCommerceProduct } from '@/types/product';
import { useCartStore, VariationInfo } from '@/lib/store/cartStore';
import { ShoppingCart, Check } from 'lucide-react';

interface SelectedVariation {
  id: number;
  price: string;
  attributes: {
    name: string;
    option: string;
  }[];
  stock_status: string;
}

interface AddToCartButtonProps {
  product: WooCommerceProduct;
  quantity?: number;
  className?: string;
  selectedVariation?: SelectedVariation | null;
  disabled?: boolean;
}

export function AddToCartButton({
  product,
  quantity = 1,
  className = '',
  selectedVariation,
  disabled = false
}: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  // Use variation stock status if available, otherwise product stock
  const stockStatus = selectedVariation ? selectedVariation.stock_status : product.stock_status;
  const isInStock = stockStatus === 'instock';
  const isDisabled = disabled || !isInStock;

  const handleAddToCart = () => {
    if (isDisabled) return;

    // Create variation info for cart if variation is selected
    const variationInfo: VariationInfo | undefined = selectedVariation ? {
      id: selectedVariation.id,
      price: selectedVariation.price,
      attributes: selectedVariation.attributes.map(attr => ({
        name: attr.name,
        option: attr.option
      }))
    } : undefined;

    addItem(product, quantity, variationInfo);
    setAdded(true);

    // Reset after 2 seconds
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isDisabled}
      style={{
        backgroundColor: !isDisabled ? '#0a2463' : undefined,
        color: !isDisabled ? '#ffffff' : undefined,
        border: 'none',
      }}
      onMouseEnter={(e) => {
        if (!isDisabled) {
          e.currentTarget.style.backgroundColor = '#ffffff';
          e.currentTarget.style.color = '#0a2463';
          e.currentTarget.style.border = '2px solid #0a2463';
        }
      }}
      onMouseLeave={(e) => {
        if (!isDisabled) {
          e.currentTarget.style.backgroundColor = '#0a2463';
          e.currentTarget.style.color = '#ffffff';
          e.currentTarget.style.border = 'none';
        }
      }}
      className={`
        flex items-center justify-center gap-2 rounded-lg px-6 py-3
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
