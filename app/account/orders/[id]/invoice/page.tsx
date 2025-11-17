'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { formatPrice } from '@/lib/utils';

export default function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { isAuthenticated, token } = useAuthStore();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [orderId, setOrderId] = useState<string>('');

  useEffect(() => {
    params.then(p => setOrderId(p.id));
  }, [params]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (orderId) {
      fetchOrder();
    }
  }, [isAuthenticated, router, orderId]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrder(data.order);
      }
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusLabel = (status: string) => {
    const statusLabels: Record<string, string> = {
      completed: 'הושלם',
      processing: 'בטיפול',
      pending: 'ממתין לתשלום',
      failed: 'נכשל',
      cancelled: 'בוטל',
      'on-hold': 'בהמתנה',
    };
    return statusLabels[status] || status;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-navy border-t-transparent mb-4"></div>
          <p className="text-gray-600">טוען חשבונית...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">לא נמצאה חשבונית</p>
      </div>
    );
  }

  return (
    <>
      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
          }
          .invoice-container {
            box-shadow: none !important;
            margin: 0 !important;
            padding: 20px !important;
          }
        }
      `}</style>

      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          {/* Print Button */}
          <div className="mb-4 text-center no-print">
            <button
              onClick={handlePrint}
              className="rounded-lg bg-navy px-6 py-3 font-semibold text-white hover:bg-navy-light"
            >
              הדפס / שמור כ-PDF
            </button>
          </div>

          {/* Invoice */}
          <div className="invoice-container mx-auto max-w-4xl bg-white p-12 shadow-lg">
            {/* Header */}
            <div className="mb-8 flex items-start justify-between border-b-2 border-navy pb-8">
              <div>
                <h1 className="text-4xl font-bold text-navy mb-2">חשבונית</h1>
                <p className="text-gray-600">מספר הזמנה: #{order.id}</p>
                <p className="text-gray-600">
                  תאריך: {new Date(order.date_created).toLocaleDateString('he-IL', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-bold text-navy mb-2">AdSystems</h2>
                <p className="text-sm text-gray-600">מערכות רכב מתקדמות</p>
                <p className="text-sm text-gray-600">ישראל</p>
              </div>
            </div>

            {/* Customer Info */}
            <div className="mb-8 grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">חויב עבור:</h3>
                <div className="text-gray-700">
                  <p className="font-semibold">
                    {order.billing.first_name} {order.billing.last_name}
                  </p>
                  {order.billing.company && <p>{order.billing.company}</p>}
                  <p>{order.billing.address_1}</p>
                  {order.billing.address_2 && <p>{order.billing.address_2}</p>}
                  <p>
                    {order.billing.city}, {order.billing.postcode}
                  </p>
                  {order.billing.email && <p className="mt-2">{order.billing.email}</p>}
                  {order.billing.phone && <p>{order.billing.phone}</p>}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">נשלח אל:</h3>
                <div className="text-gray-700">
                  {order.shipping.first_name || order.shipping.address_1 ? (
                    <>
                      <p className="font-semibold">
                        {order.shipping.first_name} {order.shipping.last_name}
                      </p>
                      {order.shipping.company && <p>{order.shipping.company}</p>}
                      <p>{order.shipping.address_1}</p>
                      {order.shipping.address_2 && <p>{order.shipping.address_2}</p>}
                      <p>
                        {order.shipping.city}, {order.shipping.postcode}
                      </p>
                    </>
                  ) : (
                    <p className="text-gray-500">זהה לכתובת לחיוב</p>
                  )}
                </div>
              </div>
            </div>

            {/* Order Status and Payment */}
            <div className="mb-8 grid gap-4 md:grid-cols-2 bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-sm text-gray-600 mb-1">סטטוס הזמנה:</p>
                <p className="font-semibold text-gray-900">{getStatusLabel(order.status)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">אמצעי תשלום:</p>
                <p className="font-semibold text-gray-900">
                  {order.payment_method_title || 'לא צוין'}
                </p>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="py-3 text-right font-bold text-gray-900">פריט</th>
                    <th className="py-3 text-center font-bold text-gray-900">כמות</th>
                    <th className="py-3 text-left font-bold text-gray-900">מחיר ליחידה</th>
                    <th className="py-3 text-left font-bold text-gray-900">סה"כ</th>
                  </tr>
                </thead>
                <tbody>
                  {order.line_items.map((item: any) => (
                    <tr key={item.id} className="border-b border-gray-200">
                      <td className="py-4 text-right">
                        <p className="font-semibold text-gray-900">{item.name}</p>
                        {item.meta_data && item.meta_data.length > 0 && (
                          <div className="text-sm text-gray-600 mt-1">
                            {item.meta_data.map((meta: any, idx: number) => (
                              <p key={idx}>
                                {meta.display_key}: {meta.display_value}
                              </p>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="py-4 text-center text-gray-700">{item.quantity}</td>
                      <td className="py-4 text-left text-gray-700">
                        {formatPrice(parseFloat(item.price))}
                      </td>
                      <td className="py-4 text-left font-semibold text-gray-900">
                        {formatPrice(parseFloat(item.total))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-full max-w-sm space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>סכום ביניים:</span>
                  <span>
                    {formatPrice(
                      parseFloat(order.total) -
                        parseFloat(order.total_tax) -
                        parseFloat(order.shipping_total)
                    )}
                  </span>
                </div>
                {parseFloat(order.shipping_total) > 0 && (
                  <div className="flex justify-between text-gray-700">
                    <span>משלוח:</span>
                    <span>{formatPrice(parseFloat(order.shipping_total))}</span>
                  </div>
                )}
                {parseFloat(order.total_tax) > 0 && (
                  <div className="flex justify-between text-gray-700">
                    <span>מע"מ (17%):</span>
                    <span>{formatPrice(parseFloat(order.total_tax))}</span>
                  </div>
                )}
                {parseFloat(order.discount_total) > 0 && (
                  <div className="flex justify-between text-green">
                    <span>הנחה:</span>
                    <span>-{formatPrice(parseFloat(order.discount_total))}</span>
                  </div>
                )}
                <div className="flex justify-between border-t-2 border-navy pt-3 text-xl font-bold text-navy">
                  <span>סה"כ לתשלום:</span>
                  <span>{formatPrice(parseFloat(order.total))}</span>
                </div>
              </div>
            </div>

            {/* Customer Note */}
            {order.customer_note && (
              <div className="mt-8 border-t pt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">הערות:</h3>
                <p className="text-gray-700">{order.customer_note}</p>
              </div>
            )}

            {/* Footer */}
            <div className="mt-12 border-t pt-6 text-center text-sm text-gray-600">
              <p>תודה על הקנייה שלך!</p>
              <p className="mt-2">לשאלות נוספות, צור איתנו קשר דרך האתר</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
