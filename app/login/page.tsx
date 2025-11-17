'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuthStore } from '@/lib/store/authStore';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { ErrorModal } from '@/components/checkout/ErrorModal';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((state) => state.login);
  const redirect = searchParams.get('redirect') || '/account';

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: '' });
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      router.push(redirect);
    } catch (error: any) {
      setErrorModal({
        isOpen: true,
        message: error.message || 'שגיאה בהתחברות. אנא בדוק את הפרטים ונסה שוב.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <ErrorModal
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal({ isOpen: false, message: '' })}
        message={errorModal.message}
      />

      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="rounded-2xl bg-white p-8 shadow-lg">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-navy/10">
                  <Lock className="h-8 w-8 text-navy" />
                </div>
                <h1 className="text-3xl font-bold text-navy mb-2">
                  התחברות
                </h1>
                <p className="text-gray-600">
                  היכנס לאזור האישי שלך
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    אימייל *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-right text-gray-900 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                      placeholder="your@email.com"
                    />
                    <Mail className="absolute right-4 top-3.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    סיסמה *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-12 py-3 text-right text-gray-900 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                      placeholder="••••••••"
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

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-navy px-6 py-3 font-semibold text-white transition-all hover:bg-navy-light disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>מתחבר...</span>
                    </div>
                  ) : (
                    'התחבר'
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-gray-300"></div>
                <span className="text-sm text-gray-500">או</span>
                <div className="h-px flex-1 bg-gray-300"></div>
              </div>

              {/* Forgot Password Link */}
              <div className="text-center mb-4">
                <Link
                  href="/forgot-password"
                  className="text-sm text-gray-600 hover:text-navy hover:underline"
                >
                  שכחתי סיסמה
                </Link>
              </div>

              {/* Register Link */}
              <div className="text-center">
                <p className="text-gray-600">
                  עדיין אין לך חשבון?{' '}
                  <Link
                    href="/register"
                    className="font-semibold text-navy hover:underline"
                  >
                    הירשם עכשיו
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <MainLayout>
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-navy border-t-transparent"></div>
            <p className="mt-4 text-gray-600">טוען...</p>
          </div>
        </div>
      </MainLayout>
    }>
      <LoginContent />
    </Suspense>
  );
}
