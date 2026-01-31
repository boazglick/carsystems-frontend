'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/MainLayout';
import { useCartStore } from '@/lib/store/cartStore';
import { formatPrice, decodeHtmlEntities } from '@/lib/utils';
import { Lock, CreditCard, X } from 'lucide-react';
import { ErrorModal } from '@/components/checkout/ErrorModal';

// Component to handle search params (wrapped in Suspense)
function PaymentFailedHandler({ onPaymentFailed }: { onPaymentFailed: () => void }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('payment_failed') === '1') {
      onPaymentFailed();
    }
  }, [searchParams, onPaymentFailed]);

  return null;
}

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const getTotal = useCartStore((state) => state.getTotal);

  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: '' });
  const [showPaymentIframe, setShowPaymentIframe] = useState(false);
  const [paymentIframeUrl, setPaymentIframeUrl] = useState<string>('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    notes: '',
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const total = getTotal();

  // Handler for payment failed
  const handlePaymentFailed = useCallback(() => {
    setErrorModal({
      isOpen: true,
      message: 'התשלום נכשל או בוטל. אנא נסה שוב.'
    });
  }, []);

  // Listen for messages from the payment iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only accept messages from our own origin
      if (event.origin !== window.location.origin) return;

      const { type, message } = event.data || {};

      switch (type) {
        case 'grow-success':
          // Payment successful - iframe will redirect parent
          break;
        case 'grow-failure':
        case 'grow-error':
          setShowPaymentIframe(false);
          setErrorModal({
            isOpen: true,
            message: message || 'התשלום נכשל. אנא נסה שוב.'
          });
          break;
        case 'grow-cancel':
        case 'grow-close':
          setShowPaymentIframe(false);
          break;
        case 'grow-timeout':
          setShowPaymentIframe(false);
          setErrorModal({
            isOpen: true,
            message: 'פג תוקף הזמן לתשלום. אנא נסה שוב.'
          });
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare order data
      const orderData = {
        billing: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address_1: formData.address,
          city: formData.city,
          postcode: formData.zipCode,
          country: 'IL',
        },
        shipping: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          address_1: formData.address,
          city: formData.city,
          postcode: formData.zipCode,
          country: 'IL',
        },
        line_items: items.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
          ...(item.variation && { variation_id: item.variation.id }),
        })),
        customer_note: formData.notes,
      };

      // Create order in WooCommerce
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (result.success && result.authCode) {
        // Build iframe URL with payment parameters
        const successUrl = result.successUrl || `/order-success?order=${result.orderId}`;
        const cancelUrl = `/checkout?payment_failed=1&order=${result.orderId}`;

        const iframeUrl = `/grow-payment.html?authCode=${encodeURIComponent(result.authCode)}&successUrl=${encodeURIComponent(successUrl)}&cancelUrl=${encodeURIComponent(cancelUrl)}`;

        setPaymentIframeUrl(iframeUrl);
        setShowPaymentIframe(true);
        setLoading(false);
      } else {
        setErrorModal({
          isOpen: true,
          message: result.error || 'שגיאה ביצירת ההזמנה'
        });
        setLoading(false);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setErrorModal({
        isOpen: true,
        message: 'אירעה שגיאה בביצוע ההזמנה. אנא נסה שוב.'
      });
      setLoading(false);
    }
  };

  // Redirect to cart if empty (must be in useEffect, not during render)
  // Don't redirect if payment iframe is showing
  useEffect(() => {
    if (items.length === 0 && !showPaymentIframe) {
      router.push('/cart');
    }
  }, [items.length, router, showPaymentIframe]);

  // Don't render null if payment is in progress
  if (items.length === 0 && !showPaymentIframe) {
    return null;
  }

  return (
    <MainLayout>
      {/* Handle payment_failed query param */}
      <Suspense fallback={null}>
        <PaymentFailedHandler onPaymentFailed={handlePaymentFailed} />
      </Suspense>

      {/* Error Modal */}
      <ErrorModal
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal({ isOpen: false, message: '' })}
        message={errorModal.message}
      />

      {/* Payment Iframe Modal */}
      {showPaymentIframe && (
        <div className="fixed inset-0 bg-black/50 z-[99999] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-lg h-[80vh] max-h-[700px] flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">תשלום מאובטח</h3>
              <button
                onClick={() => setShowPaymentIframe(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="סגור"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            {/* Iframe */}
            <div className="flex-1 overflow-hidden">
              <iframe
                src={paymentIframeUrl}
                className="w-full h-full border-0"
                title="תשלום מאובטח"
                allow="payment"
              />
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-navy mb-8">סיום הזמנה</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Checkout Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Customer Details */}
                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    פרטים אישיים
                  </h2>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        שם פרטי *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-right text-gray-900 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        שם משפחה *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-right text-gray-900 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        אימייל *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-right text-gray-900 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        טלפון *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-right text-gray-900 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    כתובת למשלוח
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        רחוב ומספר בית *
                      </label>
                      <input
                        type="text"
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-right text-gray-900 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          עיר *
                        </label>
                        <input
                          type="text"
                          name="city"
                          required
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-right text-gray-900 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          מיקוד
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-right text-gray-900 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        הערות להזמנה
                      </label>
                      <textarea
                        name="notes"
                        rows={3}
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="הערות מיוחדות למשלוח..."
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-right text-gray-900 placeholder:text-gray-500 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 rounded-lg bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    סיכום הזמנה
                  </h2>

                  {/* Order Items */}
                  <div className="space-y-3 border-b pb-4 mb-4">
                    {items.map((item) => {
                      const itemPrice = item.variation
                        ? parseFloat(item.variation.price)
                        : parseFloat(item.product.price);
                      const itemKey = item.variation
                        ? `${item.product.id}-${item.variation.id}`
                        : `${item.product.id}`;

                      return (
                        <div key={itemKey} className="flex gap-3">
                          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                            <Image
                              src={item.product.images[0]?.src || '/placeholder.svg'}
                              alt={decodeHtmlEntities(item.product.name)}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 line-clamp-2">
                              {decodeHtmlEntities(item.product.name)}
                            </p>
                            {item.variation && item.variation.attributes.length > 0 && (
                              <p className="text-xs text-gray-500">
                                {item.variation.attributes.map((attr, idx) => (
                                  <span key={attr.name}>
                                    {attr.option}
                                    {idx < item.variation!.attributes.length - 1 && ' / '}
                                  </span>
                                ))}
                              </p>
                            )}
                            <p className="text-sm text-gray-500">
                              כמות: {item.quantity}
                            </p>
                          </div>
                          <div className="text-sm font-semibold text-navy">
                            {formatPrice(itemPrice * item.quantity)}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Totals */}
                  <div className="space-y-2 border-b pb-4 mb-4">
                    <div className="flex justify-between text-gray-600">
                      <span>סכום ביניים</span>
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

                  {/* Terms and Conditions Checkbox */}
                  <div className="mb-6">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreeToTerms}
                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                        required
                        className="mt-1 h-5 w-5 rounded border-gray-300 text-navy focus:ring-navy cursor-pointer"
                      />
                      <span className="text-sm text-gray-700">
                        קראתי ואני מסכים/ה ל
                        <Link
                          href="/terms"
                          target="_blank"
                          className="text-navy hover:underline font-medium mx-1"
                        >
                          תנאי השימוש ומדיניות הרכישה
                        </Link>
                        של האתר *
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || !agreeToTerms}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-navy px-6 py-4 font-semibold text-white transition-all hover:bg-navy-light disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        <span>מעבד...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="h-5 w-5" />
                        <span>מעבר לתשלום מאובטח</span>
                      </>
                    )}
                  </button>

                  {/* Security Badge */}
                  <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-600">
                    <CreditCard className="h-4 w-4" />
                    <span>תשלום מאובטח דרך Grow Payment Gateway</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}
