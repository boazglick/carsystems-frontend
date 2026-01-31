'use client';

import { useState, useCallback } from 'react';
import { formatPrice, decodeHtmlEntities } from '@/lib/utils';
import { calculateDiscount, calculateMonthlyPayment } from '@/types/product';
import { VariationSelector } from './VariationSelector';
import { AddToCartButton } from './AddToCartButton';
import { BuyNowButton } from './BuyNowButton';
import { Truck, Shield, Package, Car } from 'lucide-react';
import Link from 'next/link';

interface Variation {
  id: number;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  attributes: {
    id: number;
    name: string;
    option: string;
  }[];
  stock_status: string;
  image?: {
    src: string;
  };
}

interface ProductDetailsProps {
  product: any;
  variations: Variation[];
  showFreeShipping: boolean;
  showMonthlyPayment: boolean;
  months: number;
  universal: boolean;
  brandNames: string[];
}

export function ProductDetails({
  product,
  variations,
  showFreeShipping,
  showMonthlyPayment,
  months,
  universal,
  brandNames,
}: ProductDetailsProps) {
  const [selectedVariation, setSelectedVariation] = useState<Variation | null>(null);

  const isVariableProduct = product.type === 'variable';

  // Determine current price based on selection
  const currentPrice = selectedVariation ? selectedVariation.price : product.price;
  const currentRegularPrice = selectedVariation ? selectedVariation.regular_price : product.regular_price;
  const currentSalePrice = selectedVariation ? selectedVariation.sale_price : product.sale_price;
  const isOnSale = selectedVariation ? selectedVariation.on_sale : product.on_sale;
  const stockStatus = selectedVariation ? selectedVariation.stock_status : product.stock_status;

  const discount = calculateDiscount(currentRegularPrice, currentSalePrice);

  // For variable products, show price range if no variation selected
  const showPriceRange = isVariableProduct && !selectedVariation && variations.length > 0;
  const priceRange = showPriceRange ? {
    min: Math.min(...variations.map(v => parseFloat(v.price))),
    max: Math.max(...variations.map(v => parseFloat(v.price))),
  } : null;

  const handleVariationSelect = useCallback((variation: Variation | null) => {
    setSelectedVariation(variation);
  }, []);

  // Determine if add to cart should be enabled
  const canAddToCart = !isVariableProduct || selectedVariation !== null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {decodeHtmlEntities(product.name)}
        </h1>
        {product.categories.length > 0 && (
          <div className="flex gap-2 mb-3">
            {product.categories.map((category: any) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="text-sm text-navy hover:underline"
              >
                {category.name}
              </Link>
            ))}
          </div>
        )}

        {/* Vehicle Compatibility Badge */}
        {universal ? (
          <div className="inline-flex items-center gap-2 bg-green/10 text-green px-4 py-2 rounded-full">
            <Car className="h-4 w-4" />
            <span className="text-sm font-semibold">מתאים לכל הרכבים</span>
          </div>
        ) : brandNames.length > 0 ? (
          <div className="inline-flex items-center gap-2 bg-navy/10 text-navy px-4 py-2 rounded-full">
            <Car className="h-4 w-4" />
            <span className="text-sm font-semibold">מתאים ל: {brandNames.join(', ')}</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-500 px-4 py-2 rounded-full">
            <Car className="h-4 w-4" />
            <span className="text-sm font-semibold">לא צוין התאמה לרכב</span>
          </div>
        )}
      </div>

      {/* Price */}
      <div className="border-t border-b py-6">
        <div className="flex items-baseline gap-4 mb-2">
          {showPriceRange && priceRange ? (
            <span className="text-4xl font-bold text-navy">
              {formatPrice(priceRange.min)} - {formatPrice(priceRange.max)}
            </span>
          ) : (
            <>
              <span className="text-4xl font-bold text-navy">
                {formatPrice(currentPrice)}
              </span>
              {isOnSale && currentRegularPrice !== currentSalePrice && (
                <span className="text-xl text-gray-500 line-through">
                  {formatPrice(currentRegularPrice)}
                </span>
              )}
            </>
          )}
        </div>

        {discount > 0 && !showPriceRange && (
          <div className="inline-block rounded-full bg-red px-3 py-1 text-sm font-bold text-white mb-2">
            הנחה {discount}%
          </div>
        )}

        {showMonthlyPayment && !showPriceRange && (
          <p className="text-lg text-gray-600">
            או {formatPrice(calculateMonthlyPayment(currentPrice, months))} לחודש
            {months !== 12 && ` (${months} תשלומים)`}
          </p>
        )}
      </div>

      {/* Variation Selector */}
      {isVariableProduct && product.attributes && (
        <div className="border-b pb-6">
          <VariationSelector
            productId={product.id}
            attributes={product.attributes}
            variations={variations}
            onVariationSelect={handleVariationSelect}
            initialPrice={product.price}
          />
        </div>
      )}

      {/* Short Description */}
      {product.short_description && (
        <div
          className="prose prose-sm text-gray-600"
          dangerouslySetInnerHTML={{ __html: product.short_description }}
        />
      )}

      {/* Stock Status for selected variation */}
      {selectedVariation && (
        <div className={`text-sm font-medium ${stockStatus === 'instock' ? 'text-green' : 'text-red'}`}>
          {stockStatus === 'instock' ? '✓ במלאי' : '✗ אזל מהמלאי'}
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        {!canAddToCart && (
          <p className="text-sm text-gray-500 text-center">אנא בחר אפשרות למעלה</p>
        )}
        <BuyNowButton
          product={product}
          selectedVariation={selectedVariation}
          disabled={!canAddToCart || stockStatus !== 'instock'}
        />
        <AddToCartButton
          product={product}
          selectedVariation={selectedVariation}
          disabled={!canAddToCart || stockStatus !== 'instock'}
        />
      </div>

      {/* Features */}
      <div className="border-t pt-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {showFreeShipping && (
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green/10 p-2">
                <Truck className="h-5 w-5 text-green" />
              </div>
              <div>
                <p className="font-semibold text-sm">משלוח חינם</p>
                <p className="text-xs text-gray-600">לכל הארץ</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="rounded-full bg-navy/10 p-2">
              <Shield className="h-5 w-5 text-navy" />
            </div>
            <div>
              <p className="font-semibold text-sm">תשלום מאובטח</p>
              <p className="text-xs text-gray-600">100% בטוח</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-full bg-navy/10 p-2">
              <Package className="h-5 w-5 text-navy" />
            </div>
            <div>
              <p className="font-semibold text-sm">התקנה מקצועית</p>
              <p className="text-xs text-gray-600">שירות איכותי</p>
            </div>
          </div>
        </div>
      </div>

      {/* SKU */}
      {product.sku && (
        <div className="text-sm text-gray-500">
          מק"ט: {product.sku}
        </div>
      )}
    </div>
  );
}
