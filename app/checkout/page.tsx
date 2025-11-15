'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { MainLayout } from '@/components/layout/MainLayout';
import { useCartStore } from '@/lib/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { Lock, CreditCard } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const getTotal = useCartStore((state) => state.getTotal);
  const clearCart = useCartStore((state) => state.clearCart);

  const [loading, setLoading] = useState(false);
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

  const total = getTotal();

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

      if (result.success) {
        // Clear cart
        clearCart();

        // Redirect to success page or Grow payment page
        if (result.paymentUrl) {
          // Redirect to Grow payment
          window.location.href = result.paymentUrl;
        } else {
          // Redirect to success page
          router.push(`/order-success?order=${result.orderId}`);
        }
      } else {
        alert('שגיאה ביצירת ההזמנה: ' + result.error);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('אירעה שגיאה בביצוע ההזמנה');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  return (
    <MainLayout>
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
                    {items.map((item) => (
                      <div key={item.product.id} className="flex gap-3">
                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                          <Image
                            src={item.product.images[0]?.src || '/placeholder.png'}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 line-clamp-2">
                            {item.product.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            כמות: {item.quantity}
                          </p>
                        </div>
                        <div className="text-sm font-semibold text-navy">
                          {formatPrice(parseFloat(item.product.price) * item.quantity)}
                        </div>
                      </div>
                    ))}
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

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
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
