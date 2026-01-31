'use client';

import { useRouter } from 'next/navigation';
import { WooCommerceProduct } from '@/types/product';
import { useCartStore, VariationInfo } from '@/lib/store/cartStore';
import { Zap } from 'lucide-react';

interface SelectedVariation {
  id: number;
  price: string;
  attributes: {
    name: string;
    option: string;
  }[];
  stock_status: string;
}

interface BuyNowButtonProps {
  product: WooCommerceProduct;
  quantity?: number;
  className?: string;
  selectedVariation?: SelectedVariation | null;
  disabled?: boolean;
}

export function BuyNowButton({
  product,
  quantity = 1,
  className = '',
  selectedVariation,
  disabled = false
}: BuyNowButtonProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  // Use variation stock status if available, otherwise product stock
  const stockStatus = selectedVariation ? selectedVariation.stock_status : product.stock_status;
  const isInStock = stockStatus === 'instock';
  const isDisabled = disabled || !isInStock;

  const handleBuyNow = () => {
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

    // Add to cart
    addItem(product, quantity, variationInfo);

    // Redirect to checkout
    router.push('/checkout');
  };

  return (
    <button
      onClick={handleBuyNow}
      disabled={isDisabled}
      style={{
        backgroundColor: !isDisabled ? '#d83e1e' : undefined,
        color: !isDisabled ? '#ffffff' : undefined,
      }}
      onMouseEnter={(e) => {
        if (!isDisabled) {
          e.currentTarget.style.backgroundColor = '#c03518';
          e.currentTarget.style.color = '#ffffff';
        }
      }}
      onMouseLeave={(e) => {
        if (!isDisabled) {
          e.currentTarget.style.backgroundColor = '#d83e1e';
          e.currentTarget.style.color = '#ffffff';
        }
      }}
      className={`
        flex items-center justify-center gap-2 rounded-lg px-6 py-3
        font-semibold text-white transition-all
        disabled:cursor-not-allowed disabled:opacity-50
        ${className}
      `}
    >
      <Zap className="h-5 w-5" />
      <span>קנה עכשיו</span>
    </button>
  );
}
