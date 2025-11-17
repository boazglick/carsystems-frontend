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
  Search,
  Filter,
  FileText,
  Calendar,
  ShoppingBag,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

type OrderStatus = 'all' | 'completed' | 'processing' | 'pending' | 'failed' | 'cancelled';

export default function OrdersPage() {
  const router = useRouter();
  const { customer, isAuthenticated, logout, token } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus>('all');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchOrders();
  }, [isAuthenticated, router]);

  useEffect(() => {
    filterOrders();
  }, [orders, searchQuery, statusFilter]);

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

  const filterOrders = () => {
    let filtered = [...orders];

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Filter by search query (order ID or customer name)
    if (searchQuery) {
      filtered = filtered.filter(order => {
        const query = searchQuery.toLowerCase();
        return (
          order.id.toString().includes(query) ||
          order.billing.first_name?.toLowerCase().includes(query) ||
          order.billing.last_name?.toLowerCase().includes(query)
        );
      });
    }

    setFilteredOrders(filtered);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
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

  if (!customer) {
    return null;
  }

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-navy mb-2">
              ההזמנות שלי
            </h1>
            <p className="text-gray-600">
              צפה ונהל את כל ההזמנות שלך
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
              <div className="rounded-lg bg-white p-6 shadow-sm">
                {/* Filters and Search */}
                <div className="mb-6 space-y-4">
                  {/* Search */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="חפש לפי מספר הזמנה..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-right text-gray-900 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                    />
                    <Search className="absolute right-4 top-3.5 h-5 w-5 text-gray-400" />
                  </div>

                  {/* Status Filters */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Filter className="h-5 w-5 text-gray-400" />
                    <button
                      onClick={() => setStatusFilter('all')}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                        statusFilter === 'all'
                          ? 'bg-navy text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      הכל ({orders.length})
                    </button>
                    <button
                      onClick={() => setStatusFilter('completed')}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                        statusFilter === 'completed'
                          ? 'bg-green text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      הושלם ({orders.filter(o => o.status === 'completed').length})
                    </button>
                    <button
                      onClick={() => setStatusFilter('processing')}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                        statusFilter === 'processing'
                          ? 'bg-orange text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      בטיפול ({orders.filter(o => o.status === 'processing').length})
                    </button>
                    <button
                      onClick={() => setStatusFilter('pending')}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                        statusFilter === 'pending'
                          ? 'bg-yellow-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      ממתין ({orders.filter(o => o.status === 'pending').length})
                    </button>
                  </div>
                </div>

                {/* Orders List */}
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-navy border-t-transparent"></div>
                    <p className="mt-4 text-gray-600">טוען הזמנות...</p>
                  </div>
                ) : filteredOrders.length > 0 ? (
                  <div className="space-y-4">
                    {filteredOrders.map((order) => (
                      <Link
                        key={order.id}
                        href={`/account/orders/${order.id}`}
                        className="block rounded-lg border border-gray-200 p-6 transition-all hover:border-navy hover:shadow-lg"
                      >
                        <div className="flex items-start justify-between gap-4">
                          {/* Order Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="rounded-full bg-navy/10 p-2">
                                <ShoppingBag className="h-5 w-5 text-navy" />
                              </div>
                              <div>
                                <h3 className="font-bold text-gray-900 text-lg">
                                  הזמנה #{order.id}
                                </h3>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Calendar className="h-4 w-4" />
                                  <span>
                                    {new Date(order.date_created).toLocaleDateString('he-IL', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                    })}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Order Items Preview */}
                            <div className="mb-3">
                              <p className="text-sm text-gray-600 mb-2">
                                {order.line_items.length} פריטים:
                              </p>
                              <div className="space-y-1">
                                {order.line_items.slice(0, 2).map((item: any, idx: number) => (
                                  <p key={idx} className="text-sm text-gray-700">
                                    • {item.name} × {item.quantity}
                                  </p>
                                ))}
                                {order.line_items.length > 2 && (
                                  <p className="text-sm text-gray-500">
                                    ועוד {order.line_items.length - 2} פריטים...
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Payment Method */}
                            <p className="text-sm text-gray-600">
                              <strong>אמצעי תשלום:</strong> {order.payment_method_title || 'לא צוין'}
                            </p>
                          </div>

                          {/* Status and Price */}
                          <div className="text-left">
                            <p className="font-bold text-navy text-2xl mb-3">
                              {formatPrice(parseFloat(order.total))}
                            </p>
                            <span
                              className={`inline-block rounded-full px-4 py-2 text-sm font-semibold ${getStatusColor(order.status)}`}
                            >
                              {getStatusLabel(order.status)}
                            </span>
                          </div>
                        </div>

                        {/* View Details Button */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                              <FileText className="h-4 w-4 inline ml-1" />
                              לחץ לצפייה בפרטי ההזמנה המלאים
                            </span>
                            <span className="text-navy font-semibold">
                              ←
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    {searchQuery || statusFilter !== 'all' ? (
                      <>
                        <p className="text-gray-600 mb-2">לא נמצאו הזמנות</p>
                        <p className="text-sm text-gray-500 mb-4">נסה לשנות את הפילטרים או החיפוש</p>
                        <button
                          onClick={() => {
                            setSearchQuery('');
                            setStatusFilter('all');
                          }}
                          className="text-navy font-semibold hover:underline"
                        >
                          נקה פילטרים
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-600 mb-4">עדיין אין לך הזמנות</p>
                        <Link
                          href="/products"
                          className="inline-block rounded-lg bg-navy px-6 py-3 font-semibold text-white hover:bg-navy-light"
                        >
                          התחל לקנות
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
