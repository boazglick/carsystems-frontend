'use client';

import { useRouter } from 'next/navigation';
import { WooCommerceProduct } from '@/types/product';
import { useCartStore } from '@/lib/store/cartStore';
import { Zap } from 'lucide-react';

interface BuyNowButtonProps {
  product: WooCommerceProduct;
  quantity?: number;
  className?: string;
}

export function BuyNowButton({
  product,
  quantity = 1,
  className = ''
}: BuyNowButtonProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const isInStock = product.stock_status === 'instock';

  const handleBuyNow = () => {
    if (!isInStock) return;

    // Add to cart
    addItem(product, quantity);

    // Redirect to checkout
    router.push('/checkout');
  };

  return (
    <button
      onClick={handleBuyNow}
      disabled={!isInStock}
      style={{
        backgroundColor: isInStock ? '#d83e1e' : undefined,
        color: isInStock ? '#ffffff' : undefined,
      }}
      onMouseEnter={(e) => {
        if (isInStock) {
          e.currentTarget.style.backgroundColor = '#c03518';
          e.currentTarget.style.color = '#ffffff';
        }
      }}
      onMouseLeave={(e) => {
        if (isInStock) {
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
