'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Truck, Car } from 'lucide-react';
import { WooCommerceProduct } from '@/types/product';
import {
  calculateDiscount,
  calculateMonthlyPayment,
  hasFreeShipping,
  getProductMeta,
  getVehicleCompatibility,
  isUniversalFit,
} from '@/types/product';
import { formatPrice, decodeHtmlEntities } from '@/lib/utils';
import { AddToCartButton } from './AddToCartButton';
import { BuyNowButton } from './BuyNowButton';
import { VEHICLE_BRANDS } from '@/types/vehicle';

interface ProductCardProps {
  product: WooCommerceProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const discount = calculateDiscount(product.regular_price, product.sale_price);
  const meta = getProductMeta(product);
  const showFreeShipping = hasFreeShipping(product);
  const showMonthlyPayment = meta._enable_monthly_payment === 'yes';
  const months = parseInt(meta._monthly_payment_months || '12');

  // Get vehicle compatibility
  const isUniversal = isUniversalFit(product);
  const compatibility = getVehicleCompatibility(product);

  // Extract unique brands from compatibility patterns
  const compatibleBrands = !isUniversal && compatibility.length > 0
    ? Array.from(new Set(
        compatibility
          .map(pattern => {
            const brandMatch = pattern.match(/brand:([^,]+)/);
            return brandMatch ? brandMatch[1] : null;
          })
          .filter(Boolean)
      ))
    : [];

  // Get brand display names
  const brandNames = compatibleBrands
    .map(brandId => VEHICLE_BRANDS.find(b => b.id === brandId)?.name || brandId)
    .slice(0, 3); // Show max 3 brands

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
      {/* Image Container */}
      <Link href={`/product/${product.slug}`} className="relative aspect-square overflow-hidden bg-gray-50">
        <Image
          src={product.images[0]?.src || '/placeholder.svg'}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Badges Container - Top Right */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {/* Discount Badge */}
          {discount > 0 && (
            <div className="rounded-full bg-red px-3 py-1 text-xs font-bold text-white shadow-lg">
              הנחה {discount}%
            </div>
          )}

          {/* Free Shipping Badge */}
          {showFreeShipping && (
            <div className="flex items-center gap-1 rounded-full bg-green px-3 py-1 text-xs font-bold text-white shadow-lg">
              <Truck className="h-3 w-3" />
              <span>משלוח חינם</span>
            </div>
          )}
        </div>

        {/* Stock Status - Bottom Left */}
        <div className="absolute bottom-4 right-4">
          {product.stock_status === 'instock' ? (
            <div className="rounded-full bg-green/90 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
              במלאי
            </div>
          ) : (
            <div className="rounded-full bg-red/90 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
              אזל מהמלאי
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6 space-y-4">
        {/* Product Name */}
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 hover:text-navy transition-colors">
            {decodeHtmlEntities(product.name)}
          </h3>
        </Link>

        {/* Vehicle Compatibility Badge */}
        {isUniversal ? (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-green">
            <Car className="h-3.5 w-3.5" />
            <span>מתאים לכל הרכבים</span>
          </div>
        ) : brandNames.length > 0 ? (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-navy">
            <Car className="h-3.5 w-3.5" />
            <span>מתאים ל: {brandNames.join(', ')}{compatibleBrands.length > 3 ? '...' : ''}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400">
            <Car className="h-3.5 w-3.5" />
            <span>לא צוין התאמה</span>
          </div>
        )}

        {/* Price Section */}
        <div className="flex items-baseline gap-3">
          <span className="text-2xl font-bold text-navy">
            {formatPrice(product.price)}
          </span>
          {product.on_sale && product.regular_price !== product.sale_price && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.regular_price)}
            </span>
          )}
        </div>

        {/* Monthly Payment */}
        {showMonthlyPayment && (
          <div className="text-sm text-gray-600">
            או {formatPrice(calculateMonthlyPayment(product.price, months))} לחודש
            {months !== 12 && ` (${months} תשלומים)`}
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Buttons */}
        <div className="flex flex-col gap-2">
          <BuyNowButton product={product} className="w-full text-sm py-2.5" />
          <AddToCartButton product={product} className="w-full text-sm py-2.5" />
        </div>
      </div>
    </div>
  );
}
