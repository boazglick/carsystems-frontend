'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/MainLayout';
import { useCartStore } from '@/lib/store/cartStore';
import { CheckCircle, Package, Home } from 'lucide-react';

export const dynamic = 'force-dynamic';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order');
  const [order, setOrder] = useState<any>(null);
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    // Clear the cart when reaching success page
    clearCart();

    if (orderId) {
      // Optionally fetch order details
      // For now, just show success message
    }
  }, [orderId, clearCart]);

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="rounded-lg bg-white p-8 shadow-sm text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green/10">
                <CheckCircle className="h-12 w-12 text-green" />
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                ההזמנה בוצעה בהצלחה!
              </h1>

              <p className="text-lg text-gray-600 mb-2">
                תודה על ההזמנה שלך
              </p>

              {orderId && (
                <p className="text-gray-600 mb-8">
                  מספר הזמנה: <span className="font-semibold text-navy">{orderId}</span>
                </p>
              )}

              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-navy/10 p-3">
                    <Package className="h-6 w-6 text-navy" />
                  </div>
                  <div className="flex-1 text-right">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      מה הלאה?
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>✓ קיבלנו את ההזמנה שלך</li>
                      <li>✓ שלחנו אישור למייל שלך</li>
                      <li>✓ נתחיל להכין את ההזמנה שלך</li>
                      <li>✓ נעדכן אותך לגבי המשלוח</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-navy px-8 py-3 font-semibold text-white transition-all hover:bg-navy-light"
                >
                  <Home className="h-5 w-5" />
                  <span>חזור לדף הבית</span>
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-navy px-8 py-3 font-semibold text-navy transition-all hover:bg-navy hover:text-white"
                >
                  <span>המשך לקנייה</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <MainLayout>
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <p>טוען...</p>
          </div>
        </div>
      </MainLayout>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
