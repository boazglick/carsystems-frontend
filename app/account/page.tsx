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
  ShoppingBag,
  MapPin,
  Mail,
  Phone,
  FileText,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function AccountPage() {
  const router = useRouter();
  const { customer, isAuthenticated, logout, token } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Fetch orders
    fetchOrders();
  }, [isAuthenticated, router]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!customer) {
    return null;
  }

  const recentOrders = orders.slice(0, 3);

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-navy mb-2">
              שלום, {customer.first_name}!
            </h1>
            <p className="text-gray-600">
              ברוך הבא לאזור האישי שלך
            </p>
          </div>

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
                    className="flex items-center gap-3 rounded-lg bg-navy/10 px-4 py-3 text-navy font-semibold"
                  >
                    <User className="h-5 w-5" />
                    <span>סקירה כללית</span>
                  </Link>

                  <Link
                    href="/account/orders"
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-100"
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
            <div className="lg:col-span-2 space-y-6">
              {/* Stats */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-navy/10 p-3">
                      <ShoppingBag className="h-6 w-6 text-navy" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-navy">{orders.length}</p>
                      <p className="text-sm text-gray-600">סה"כ הזמנות</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-green/10 p-3">
                      <Package className="h-6 w-6 text-green" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green">
                        {orders.filter(o => o.status === 'completed').length}
                      </p>
                      <p className="text-sm text-gray-600">הושלמו</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-orange/10 p-3">
                      <FileText className="h-6 w-6 text-orange" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-orange">
                        {orders.filter(o => o.status === 'processing').length}
                      </p>
                      <p className="text-sm text-gray-600">בטיפול</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
                    הזמנות אחרונות
                  </h2>
                  <Link
                    href="/account/orders"
                    className="text-sm font-semibold text-navy hover:underline"
                  >
                    צפה בכל ההזמנות
                  </Link>
                </div>

                {loading ? (
                  <div className="text-center py-8">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-navy border-t-transparent"></div>
                  </div>
                ) : recentOrders.length > 0 ? (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <Link
                        key={order.id}
                        href={`/account/orders/${order.id}`}
                        className="block rounded-lg border border-gray-200 p-4 transition-all hover:border-navy hover:shadow-md"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-semibold text-gray-900">
                              הזמנה #{order.id}
                            </p>
                            <p className="text-sm text-gray-600">
                              {new Date(order.date_created).toLocaleDateString('he-IL')}
                            </p>
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-navy">
                              {formatPrice(parseFloat(order.total))}
                            </p>
                            <span
                              className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                                order.status === 'completed'
                                  ? 'bg-green/10 text-green'
                                  : order.status === 'processing'
                                  ? 'bg-orange/10 text-orange'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {order.status === 'completed' ? 'הושלם' :
                               order.status === 'processing' ? 'בטיפול' :
                               order.status === 'pending' ? 'ממתין לתשלום' : order.status}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">
                          {order.line_items.length} פריטים
                        </p>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-4">עדיין אין לך הזמנות</p>
                    <Link
                      href="/products"
                      className="inline-block rounded-lg bg-navy px-6 py-3 font-semibold text-white hover:bg-navy-light"
                    >
                      התחל לקנות
                    </Link>
                  </div>
                )}
              </div>

              {/* Account Info */}
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  פרטי חשבון
                </h2>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-700">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span>{customer.email}</span>
                  </div>

                  {customer.billing.phone && (
                    <div className="flex items-center gap-3 text-gray-700">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <span>{customer.billing.phone}</span>
                    </div>
                  )}

                  {customer.billing.address_1 && (
                    <div className="flex items-start gap-3 text-gray-700">
                      <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p>{customer.billing.address_1}</p>
                        {customer.billing.city && (
                          <p>{customer.billing.city}, {customer.billing.postcode}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <Link
                  href="/account/settings"
                  className="mt-6 inline-flex items-center gap-2 text-navy font-semibold hover:underline"
                >
                  <Settings className="h-4 w-4" />
                  <span>ערוך פרטים</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
