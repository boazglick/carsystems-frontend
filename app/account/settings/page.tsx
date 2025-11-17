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
  Mail,
  Phone,
  MapPin,
  Lock,
  Save,
  Eye,
  EyeOff,
} from 'lucide-react';
import { ErrorModal } from '@/components/checkout/ErrorModal';

export default function SettingsPage() {
  const router = useRouter();
  const { customer, isAuthenticated, logout, token, updateCustomer } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [personalInfo, setPersonalInfo] = useState({
    first_name: '',
    last_name: '',
    email: '',
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  const [billingAddress, setBillingAddress] = useState({
    first_name: '',
    last_name: '',
    company: '',
    address_1: '',
    address_2: '',
    city: '',
    state: '',
    postcode: '',
    country: 'IL',
    phone: '',
  });

  const [shippingAddress, setShippingAddress] = useState({
    first_name: '',
    last_name: '',
    company: '',
    address_1: '',
    address_2: '',
    city: '',
    state: '',
    postcode: '',
    country: 'IL',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (customer) {
      // Load customer data into forms
      setPersonalInfo({
        first_name: customer.first_name || '',
        last_name: customer.last_name || '',
        email: customer.email || '',
      });

      setBillingAddress({
        first_name: customer.billing?.first_name || '',
        last_name: customer.billing?.last_name || '',
        company: customer.billing?.company || '',
        address_1: customer.billing?.address_1 || '',
        address_2: customer.billing?.address_2 || '',
        city: customer.billing?.city || '',
        state: customer.billing?.state || '',
        postcode: customer.billing?.postcode || '',
        country: customer.billing?.country || 'IL',
        phone: customer.billing?.phone || '',
      });

      setShippingAddress({
        first_name: customer.shipping?.first_name || '',
        last_name: customer.shipping?.last_name || '',
        company: customer.shipping?.company || '',
        address_1: customer.shipping?.address_1 || '',
        address_2: customer.shipping?.address_2 || '',
        city: customer.shipping?.city || '',
        state: customer.shipping?.state || '',
        postcode: customer.shipping?.postcode || '',
        country: customer.shipping?.country || 'IL',
      });
    }
  }, [isAuthenticated, router, customer]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleUpdatePersonalInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');

    try {
      const response = await fetch('/api/customer/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(personalInfo),
      });

      const data = await response.json();

      if (response.ok) {
        updateCustomer(data.customer);
        setSuccessMessage('הפרטים האישיים עודכנו בהצלחה');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorModal({
          isOpen: true,
          message: data.message || 'שגיאה בעדכון הפרטים',
        });
      }
    } catch (error) {
      setErrorModal({
        isOpen: true,
        message: 'שגיאה בעדכון הפרטים',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.new_password !== passwordData.confirm_password) {
      setErrorModal({
        isOpen: true,
        message: 'הסיסמאות אינן תואמות',
      });
      return;
    }

    if (passwordData.new_password.length < 6) {
      setErrorModal({
        isOpen: true,
        message: 'הסיסמה חייבת להכיל לפחות 6 תווים',
      });
      return;
    }

    setLoading(true);
    setSuccessMessage('');

    try {
      const wpUrl = process.env.NEXT_PUBLIC_WP_URL || 'https://adsystems.ussl.info';
      const response = await fetch(`${wpUrl}/wp-json/custom/v1/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: customer?.email,
          current_password: passwordData.current_password,
          new_password: passwordData.new_password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('הסיסמה שונתה בהצלחה');
        setPasswordData({
          current_password: '',
          new_password: '',
          confirm_password: '',
        });
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorModal({
          isOpen: true,
          message: data.message || 'שגיאה בשינוי הסיסמה',
        });
      }
    } catch (error) {
      setErrorModal({
        isOpen: true,
        message: 'שגיאה בשינוי הסיסמה',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBillingAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');

    try {
      const response = await fetch('/api/customer/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ billing: billingAddress }),
      });

      const data = await response.json();

      if (response.ok) {
        updateCustomer(data.customer);
        setSuccessMessage('כתובת החיוב עודכנה בהצלחה');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorModal({
          isOpen: true,
          message: data.message || 'שגיאה בעדכון הכתובת',
        });
      }
    } catch (error) {
      setErrorModal({
        isOpen: true,
        message: 'שגיאה בעדכון הכתובת',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateShippingAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');

    try {
      const response = await fetch('/api/customer/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ shipping: shippingAddress }),
      });

      const data = await response.json();

      if (response.ok) {
        updateCustomer(data.customer);
        setSuccessMessage('כתובת המשלוח עודכנה בהצלחה');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorModal({
          isOpen: true,
          message: data.message || 'שגיאה בעדכון הכתובת',
        });
      }
    } catch (error) {
      setErrorModal({
        isOpen: true,
        message: 'שגיאה בעדכון הכתובת',
      });
    } finally {
      setLoading(false);
    }
  };

  const copyBillingToShipping = () => {
    setShippingAddress({
      first_name: billingAddress.first_name,
      last_name: billingAddress.last_name,
      company: billingAddress.company,
      address_1: billingAddress.address_1,
      address_2: billingAddress.address_2,
      city: billingAddress.city,
      state: billingAddress.state,
      postcode: billingAddress.postcode,
      country: billingAddress.country,
    });
  };

  if (!customer) {
    return null;
  }

  return (
    <MainLayout>
      <ErrorModal
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal({ isOpen: false, message: '' })}
        message={errorModal.message}
      />

      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 rounded-lg bg-green/10 border border-green p-4 text-center">
              <p className="text-green font-semibold">{successMessage}</p>
            </div>
          )}

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-navy mb-2">
              הגדרות חשבון
            </h1>
            <p className="text-gray-600">
              עדכן את הפרטים האישיים והכתובות שלך
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
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-100"
                  >
                    <Package className="h-5 w-5" />
                    <span>ההזמנות שלי</span>
                  </Link>

                  <Link
                    href="/account/settings"
                    className="flex items-center gap-3 rounded-lg bg-navy/10 px-4 py-3 text-navy font-semibold"
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
              {/* Personal Information */}
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="rounded-full bg-navy/10 p-2">
                    <User className="h-5 w-5 text-navy" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    פרטים אישיים
                  </h2>
                </div>

                <form onSubmit={handleUpdatePersonalInfo} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        שם פרטי *
                      </label>
                      <input
                        type="text"
                        required
                        value={personalInfo.first_name}
                        onChange={(e) =>
                          setPersonalInfo({ ...personalInfo, first_name: e.target.value })
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-right text-gray-900 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        שם משפחה *
                      </label>
                      <input
                        type="text"
                        required
                        value={personalInfo.last_name}
                        onChange={(e) =>
                          setPersonalInfo({ ...personalInfo, last_name: e.target.value })
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-right text-gray-900 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      אימייל *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={personalInfo.email}
                        onChange={(e) =>
                          setPersonalInfo({ ...personalInfo, email: e.target.value })
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-right text-gray-900 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                      />
                      <Mail className="absolute right-4 top-3.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 rounded-lg bg-navy px-6 py-3 font-semibold text-white hover:bg-navy-light disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    <span>{loading ? 'שומר...' : 'שמור שינויים'}</span>
                  </button>
                </form>
              </div>

              {/* Change Password */}
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="rounded-full bg-navy/10 p-2">
                    <Lock className="h-5 w-5 text-navy" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    שינוי סיסמה
                  </h2>
                </div>

                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      סיסמה נוכחית *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={passwordData.current_password}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, current_password: e.target.value })
                        }
                        className="w-full rounded-lg border border-gray-300 px-12 py-3 text-right text-gray-900 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                      />
                      <Lock className="absolute right-4 top-3.5 h-5 w-5 text-gray-400" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-4 top-3.5 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      סיסמה חדשה *
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        value={passwordData.new_password}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, new_password: e.target.value })
                        }
                        className="w-full rounded-lg border border-gray-300 px-12 py-3 text-right text-gray-900 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                        placeholder="לפחות 6 תווים"
                      />
                      <Lock className="absolute right-4 top-3.5 h-5 w-5 text-gray-400" />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute left-4 top-3.5 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      אימות סיסמה חדשה *
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        value={passwordData.confirm_password}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, confirm_password: e.target.value })
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-right text-gray-900 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                      />
                      <Lock className="absolute right-4 top-3.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 rounded-lg bg-navy px-6 py-3 font-semibold text-white hover:bg-navy-light disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    <span>{loading ? 'משנה סיסמה...' : 'שנה סיסמה'}</span>
                  </button>
                </form>
              </div>

              {/* Billing Address */}
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="rounded-full bg-navy/10 p-2">
                    <MapPin className="h-5 w-5 text-navy" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    כתובת לחיוב
                  </h2>
                </div>

                <form onSubmit={handleUpdateBillingAddress} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        שם פרטי *
                      </label>
                      <input
                        type="text"
                        required
                        value={billingAddress.first_name}
                        onChange={(e) =>
                          setBillingAddress({ ...billingAddress, first_name: e.target.value })
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-right text-gray-900 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        שם משפחה *
                      </label>
                      <input
                        type="text"
                        required
                        value={billingAddress.last_name}
                        onChange={(e) =>
                          setBillingAddress({ ...billingAddress, last_name: e.target.value })
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-right text-gray-900 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      חברה (אופציונלי)
                    </label>
                    <input
                      type="text"
                      value={billingAddress.company}
                      onChange={(e) =>
                        setBillingAddress({ ...billingAddress, company: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-right text-gray-900 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      כתובת *
                    </label>
                    <input
                      type="text"
                      required
                      value={billingAddress.address_1}
                      onChange={(e) =>
                        setBillingAddress({ ...billingAddress, address_1: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-right text-gray-900 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                      placeholder="רחוב ומספר בית"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      כתובת נוספת (אופציונלי)
                    </label>
                    <input
                      type="text"
                      value={billingAddress.address_2}
                      onChange={(e) =>
                        setBillingAddress({ ...billingAddress, address_2: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-right text-gray-900 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                      placeholder="דירה, קומה וכו'"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        עיר *
                      </label>
                      <input
                        type="text"
                        required
                        value={billingAddress.city}
                        onChange={(e) =>
                          setBillingAddress({ ...billingAddress, city: e.target.value })
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-right text-gray-900 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        מיקוד *
                      </label>
                      <input
                        type="text"
                        required
                        value={billingAddress.postcode}
                        onChange={(e) =>
                          setBillingAddress({ ...billingAddress, postcode: e.target.value })
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-right text-gray-900 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      טלפון *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={billingAddress.phone}
                        onChange={(e) =>
                          setBillingAddress({ ...billingAddress, phone: e.target.value })
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-right text-gray-900 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                      />
                      <Phone className="absolute right-4 top-3.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 rounded-lg bg-navy px-6 py-3 font-semibold text-white hover:bg-navy-light disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    <span>{loading ? 'שומר...' : 'שמור כתובת'}</span>
                  </button>
                </form>
              </div>

              {/* Shipping Address */}
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-navy/10 p-2">
                      <MapPin className="h-5 w-5 text-navy" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                      כתובת למשלוח
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={copyBillingToShipping}
                    className="text-sm text-navy font-semibold hover:underline"
                  >
                    העתק מכתובת חיוב
                  </button>
                </div>

                <form onSubmit={handleUpdateShippingAddress} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        שם פרטי *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.first_name}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, first_name: e.target.value })
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-right text-gray-900 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        שם משפחה *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.last_name}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, last_name: e.target.value })
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-right text-gray-900 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      חברה (אופציונלי)
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.company}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, company: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-right text-gray-900 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      כתובת *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.address_1}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, address_1: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-right text-gray-900 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                      placeholder="רחוב ומספר בית"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      כתובת נוספת (אופציונלי)
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.address_2}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, address_2: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-right text-gray-900 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                      placeholder="דירה, קומה וכו'"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        עיר *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.city}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, city: e.target.value })
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-right text-gray-900 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        מיקוד *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.postcode}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, postcode: e.target.value })
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-right text-gray-900 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 rounded-lg bg-navy px-6 py-3 font-semibold text-white hover:bg-navy-light disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    <span>{loading ? 'שומר...' : 'שמור כתובת'}</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
