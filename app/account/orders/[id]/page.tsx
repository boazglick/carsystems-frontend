'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuthStore } from '@/lib/store/authStore';
import {
  User,
  Package,
  Settings,
  LogOut,
  MapPin,
  CreditCard,
  Truck,
  FileText,
  Download,
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { ErrorModal } from '@/components/checkout/ErrorModal';

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { customer, isAuthenticated, logout, token } = useAuthStore();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: '' });
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
      } else {
        setErrorModal({
          isOpen: true,
          message: 'לא ניתן לטעון את פרטי ההזמנה',
        });
      }
    } catch (error) {
      setErrorModal({
        isOpen: true,
        message: 'שגיאה בטעינת ההזמנה',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleDownloadInvoice = () => {
    window.open(`/account/orders/${orderId}/invoice`, '_blank');
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

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      completed: 'bg-green/10 text-green',
      processing: 'bg-orange/10 text-orange',
      pending: 'bg-yellow-100 text-yellow-700',
      failed: 'bg-red-100 text-red-700',
      cancelled: 'bg-gray-100 text-gray-600',
      'on-hold': 'bg-blue-100 text-blue-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-600';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'completed') return <CheckCircle className="h-6 w-6 text-green" />;
    if (status === 'processing') return <Clock className="h-6 w-6 text-orange" />;
    if (status === 'failed' || status === 'cancelled') return <XCircle className="h-6 w-6 text-red-600" />;
    return <Clock className="h-6 w-6 text-gray-400" />;
  };

  if (!customer) {
    return null;
  }

  return (
    <MainLayout>
      <ErrorModal
        isOpen={errorModal.isOpen}
        onClose={() => {
          setErrorModal({ isOpen: false, message: '' });
          router.push('/account/orders');
        }}
        message={errorModal.message}
      />

      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-2 text-navy font-semibold hover:underline mb-6"
          >
            <ArrowRight className="h-4 w-4" />
            <span>חזור לכל ההזמנות</span>
          </Link>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="mb-6 text-center">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-navy/10">
                    <User className="h-10 w-10 text-navy" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {customer.first_name} {customer.last_name}
                  </h2>
                  <p className="text-sm text-gray-600">{customer.email}</p>
                </div>

                <nav className="space-y-2">
                  <Link
                    href="/account"
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-100"
                  >
                    <User className="h-5 w-5" />
                    <span>סקירה כללית</span>
                  </Link>

                  <Link
                    href="/account/orders"
                    className="flex items-center gap-3 rounded-lg bg-navy/10 px-4 py-3 text-navy font-semibold"
                  >
                    <Package className="h-5 w-5" />
                    <span>ההזמנות שלי</span>
                  </Link>

                  <Link
                    href="/account/settings"
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-100"
                  >
                    <Settings className="h-5 w-5" />
                    <span>הגדרות חשבון</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 rounded-lg px-4 py-3 text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>התנתק</span>
                  </button>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              {loading ? (
                <div className="rounded-lg bg-white p-12 shadow-sm text-center">
                  <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-navy border-t-transparent"></div>
                  <p className="mt-4 text-gray-600">טוען פרטי הזמנה...</p>
                </div>
              ) : order ? (
                <div className="space-y-6">
                  {/* Order Header */}
                  <div className="rounded-lg bg-white p-6 shadow-sm">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <h1 className="text-2xl font-bold text-navy mb-2">
                          הזמנה #{order.id}
                        </h1>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(order.date_created).toLocaleDateString('he-IL', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="text-left">
                        <button
                          onClick={handleDownloadInvoice}
                          className="flex items-center gap-2 rounded-lg bg-navy px-4 py-2 font-semibold text-white hover:bg-navy-light mb-3"
                        >
                          <Download className="h-4 w-4" />
                          <span>הורד חשבונית</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50">
                      {getStatusIcon(order.status)}
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-1">סטטוס הזמנה:</p>
                        <span
                          className={`inline-block rounded-full px-4 py-1 text-sm font-semibold ${getStatusColor(order.status)}`}
                        >
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                      <div className="text-left">
                        <p className="text-sm text-gray-600 mb-1">סה"כ לתשלום:</p>
                        <p className="text-2xl font-bold text-navy">
                          {formatPrice(parseFloat(order.total))}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="rounded-lg bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                      פריטים בהזמנה
                    </h2>
                    <div className="space-y-4">
                      {order.line_items.map((item: any) => (
                        <div
                          key={item.id}
                          className="flex items-start justify-between gap-4 p-4 rounded-lg bg-gray-50"
                        >
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {item.name}
                            </h3>
                            {item.meta_data && item.meta_data.length > 0 && (
                              <div className="text-sm text-gray-600">
                                {item.meta_data.map((meta: any, idx: number) => (
                                  <p key={idx}>
                                    {meta.display_key}: {meta.display_value}
                                  </p>
                                ))}
                              </div>
                            )}
                            <p className="text-sm text-gray-600 mt-1">
                              כמות: {item.quantity}
                            </p>
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-navy">
                              {formatPrice(parseFloat(item.total))}
                            </p>
                            {item.quantity > 1 && (
                              <p className="text-sm text-gray-600">
                                {formatPrice(parseFloat(item.price))} ליחידה
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Totals */}
                    <div className="mt-6 pt-4 border-t border-gray-200 space-y-2">
                      <div className="flex justify-between text-gray-700">
                        <span>סכום ביניים:</span>
                        <span>{formatPrice(parseFloat(order.total) - parseFloat(order.total_tax) - parseFloat(order.shipping_total))}</span>
                      </div>
                      {parseFloat(order.shipping_total) > 0 && (
                        <div className="flex justify-between text-gray-700">
                          <span>משלוח:</span>
                          <span>{formatPrice(parseFloat(order.shipping_total))}</span>
                        </div>
                      )}
                      {parseFloat(order.total_tax) > 0 && (
                        <div className="flex justify-between text-gray-700">
                          <span>מע"מ:</span>
                          <span>{formatPrice(parseFloat(order.total_tax))}</span>
                        </div>
                      )}
                      {parseFloat(order.discount_total) > 0 && (
                        <div className="flex justify-between text-green">
                          <span>הנחה:</span>
                          <span>-{formatPrice(parseFloat(order.discount_total))}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-xl font-bold text-navy pt-2 border-t border-gray-200">
                        <span>סה"כ:</span>
                        <span>{formatPrice(parseFloat(order.total))}</span>
                      </div>
                    </div>
                  </div>

                  {/* Addresses and Payment */}
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Billing Address */}
                    <div className="rounded-lg bg-white p-6 shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="rounded-full bg-navy/10 p-2">
                          <CreditCard className="h-5 w-5 text-navy" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">
                          כתובת לחיוב
                        </h2>
                      </div>
                      <div className="space-y-2 text-gray-700">
                        <p className="font-semibold">
                          {order.billing.first_name} {order.billing.last_name}
                        </p>
                        {order.billing.company && <p>{order.billing.company}</p>}
                        <p>{order.billing.address_1}</p>
                        {order.billing.address_2 && <p>{order.billing.address_2}</p>}
                        <p>
                          {order.billing.city}, {order.billing.postcode}
                        </p>
                        {order.billing.state && <p>{order.billing.state}</p>}
                        <p>{order.billing.country}</p>
                        {order.billing.email && (
                          <p className="text-sm pt-2">
                            <strong>אימייל:</strong> {order.billing.email}
                          </p>
                        )}
                        {order.billing.phone && (
                          <p className="text-sm">
                            <strong>טלפון:</strong> {order.billing.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="rounded-lg bg-white p-6 shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="rounded-full bg-navy/10 p-2">
                          <Truck className="h-5 w-5 text-navy" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">
                          כתובת למשלוח
                        </h2>
                      </div>
                      <div className="space-y-2 text-gray-700">
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
                            {order.shipping.state && <p>{order.shipping.state}</p>}
                            <p>{order.shipping.country}</p>
                          </>
                        ) : (
                          <p className="text-gray-500">זהה לכתובת לחיוב</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="rounded-lg bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="rounded-full bg-navy/10 p-2">
                        <CreditCard className="h-5 w-5 text-navy" />
                      </div>
                      <h2 className="text-lg font-bold text-gray-900">
                        אמצעי תשלום
                      </h2>
                    </div>
                    <p className="text-gray-700">
                      {order.payment_method_title || 'לא צוין'}
                    </p>
                    {order.transaction_id && (
                      <p className="text-sm text-gray-600 mt-2">
                        <strong>מזהה עסקה:</strong> {order.transaction_id}
                      </p>
                    )}
                  </div>

                  {/* Customer Note */}
                  {order.customer_note && (
                    <div className="rounded-lg bg-white p-6 shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="rounded-full bg-navy/10 p-2">
                          <FileText className="h-5 w-5 text-navy" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">
                          הערות
                        </h2>
                      </div>
                      <p className="text-gray-700">{order.customer_note}</p>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
