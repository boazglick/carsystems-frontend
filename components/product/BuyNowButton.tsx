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
      className={`
        flex items-center justify-center gap-2 rounded-lg bg-navy px-6 py-3
        font-semibold text-white transition-all
        hover:bg-navy-light
        disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-navy
        ${className}
      `}
    >
      <Zap className="h-5 w-5" />
      <span>קנה עכשיו</span>
    </button>
  );
}
