'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/lib/store/cartStore';

export function CartIcon() {
  const [mounted, setMounted] = useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());

  // Manually hydrate the store and show cart count after client-side hydration
  useEffect(() => {
    useCartStore.persist.rehydrate();
    setMounted(true);
  }, []);

  return (
    <Link
      href="/cart"
      className="relative rounded-full p-2 hover:bg-gray-100 transition-colors"
    >
      <ShoppingCart className="h-6 w-6 text-gray-700" />
      {mounted && itemCount > 0 && (
        <span className="absolute -top-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full bg-red text-xs text-white font-bold">
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}
    </Link>
  );
}
