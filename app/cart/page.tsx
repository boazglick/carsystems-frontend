'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { useCartStore } from '@/lib/store/cartStore';
import { formatPrice, decodeHtmlEntities } from '@/lib/utils';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const getTotal = useCartStore((state) => state.getTotal);

  const total = getTotal();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <MainLayout>
        <div className="bg-gray-50 min-h-screen py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <ShoppingBag className="mx-auto h-24 w-24 text-gray-400 mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                העגלה שלך ריקה
              </h1>
              <p className="text-gray-600 mb-8">
                נראה שעדיין לא הוספת מוצרים לעגלה
              </p>
              <Link
                href="/products"
                className="inline-block rounded-lg bg-navy px-8 py-3 font-semibold text-white transition-all hover:bg-navy-light"
              >
                המשך לקנייה
              </Link>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-navy mb-8">עגלת הקניות שלי</h1>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                // Use variation price if available
                const itemPrice = item.variation
                  ? parseFloat(item.variation.price)
                  : parseFloat(item.product.price);
                const itemKey = item.variation
                  ? `${item.product.id}-${item.variation.id}`
                  : `${item.product.id}`;

                return (
                  <div
                    key={itemKey}
                    className="flex gap-4 rounded-lg bg-white p-4 shadow-sm"
                  >
                    {/* Product Image */}
                    <Link
                      href={`/product/${item.product.slug}`}
                      className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100"
                    >
                      <Image
                        src={item.product.images[0]?.src || '/placeholder.svg'}
                        alt={decodeHtmlEntities(item.product.name)}
                        fill
                        className="object-cover"
                      />
                    </Link>

                    {/* Product Details */}
                    <div className="flex flex-1 flex-col">
                      <Link
                        href={`/product/${item.product.slug}`}
                        className="font-semibold text-gray-900 hover:text-navy line-clamp-2"
                      >
                        {decodeHtmlEntities(item.product.name)}
                      </Link>

                      {/* Variation Attributes */}
                      {item.variation && item.variation.attributes.length > 0 && (
                        <div className="mt-1 text-sm text-gray-500">
                          {item.variation.attributes.map((attr, idx) => (
                            <span key={attr.name}>
                              {attr.name}: {attr.option}
                              {idx < item.variation!.attributes.length - 1 && ' | '}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-lg font-bold text-navy">
                          {formatPrice(itemPrice)}
                        </span>
                        {!item.variation && item.product.on_sale && (
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(item.product.regular_price)}
                          </span>
                        )}
                      </div>

                      <div className="mt-auto flex items-center justify-between pt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1, item.variation?.id)
                            }
                            className="rounded-lg border border-gray-300 bg-white p-1.5 text-gray-700 hover:bg-gray-100 hover:text-navy transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-12 text-center font-medium text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1, item.variation?.id)
                            }
                            className="rounded-lg border border-gray-300 bg-white p-1.5 text-gray-700 hover:bg-gray-100 hover:text-navy transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeItem(item.product.id, item.variation?.id)}
                          className="text-red hover:text-red/80 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="text-left">
                      <div className="font-bold text-navy">
                        {formatPrice(itemPrice * item.quantity)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-lg bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  סיכום הזמנה
                </h2>

                <div className="space-y-3 border-b pb-4 mb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>מוצרים ({itemCount})</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>משלוח</span>
                    <span className="text-green font-semibold">חינם</span>
                  </div>
                </div>

                <div className="flex justify-between text-xl font-bold text-navy mb-6">
                  <span>סה"כ לתשלום</span>
                  <span>{formatPrice(total)}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-navy px-6 py-4 font-semibold text-white transition-all hover:bg-navy-light mb-3"
                >
                  <span>המשך לתשלום</span>
                  <ArrowRight className="h-5 w-5 rotate-180" />
                </button>

                <Link
                  href="/products"
                  className="block w-full text-center rounded-lg border-2 border-navy px-6 py-3 font-semibold text-navy transition-all hover:bg-navy hover:text-white"
                >
                  המשך לקנייה
                </Link>

                {/* Trust Badges */}
                <div className="mt-6 space-y-3 border-t pt-6">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="rounded-full bg-green/10 p-2">
                      <svg className="h-4 w-4 text-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>תשלום מאובטח 100%</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="rounded-full bg-green/10 p-2">
                      <svg className="h-4 w-4 text-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>משלוח חינם לכל הארץ</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="rounded-full bg-green/10 p-2">
                      <svg className="h-4 w-4 text-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>החזרה בתוך 14 יום</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
