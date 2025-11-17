'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/MainLayout';
import { Lock, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { ErrorModal } from '@/components/checkout/ErrorModal';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const key = searchParams.get('key');
  const login = searchParams.get('login');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [valid, setValid] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: '' });

  useEffect(() => {
    validateToken();
  }, [key, login]);

  const validateToken = async () => {
    if (!key || !login) {
      setErrorModal({
        isOpen: true,
        message: 'קישור לא תקין',
      });
      setValidating(false);
      return;
    }

    try {
      const wpUrl = process.env.NEXT_PUBLIC_WP_URL || 'https://adsystems.ussl.info';
      const response = await fetch(`${wpUrl}/wp-json/custom/v1/password-reset/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, login }),
      });

      const data = await response.json();

      if (response.ok && data.valid) {
        setValid(true);
      } else {
        setErrorModal({
          isOpen: true,
          message: data.message || 'קישור איפוס הסיסמה אינו תקין או פג תוקפו',
        });
      }
    } catch (error) {
      setErrorModal({
        isOpen: true,
        message: 'שגיאה בבדיקת הקישור',
      });
    } finally {
      setValidating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorModal({
        isOpen: true,
        message: 'הסיסמאות אינן תואמות',
      });
      return;
    }

    if (password.length < 6) {
      setErrorModal({
        isOpen: true,
        message: 'הסיסמה חייבת להכיל לפחות 6 תווים',
      });
      return;
    }

    setLoading(true);

    try {
      const wpUrl = process.env.NEXT_PUBLIC_WP_URL || 'https://adsystems.ussl.info';
      const response = await fetch(`${wpUrl}/wp-json/custom/v1/password-reset/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, login, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorModal({
          isOpen: true,
          message: data.message || 'שגיאה באיפוס הסיסמה',
        });
      } else {
        setSuccess(true);
      }
    } catch (error) {
      setErrorModal({
        isOpen: true,
        message: 'שגיאה באיפוס הסיסמה. אנא נסה שוב.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <MainLayout>
        <div className="bg-gray-50 min-h-screen py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto text-center">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-navy border-t-transparent"></div>
              <p className="mt-4 text-gray-600">בודק קישור...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!valid) {
    return (
      <MainLayout>
        <ErrorModal
          isOpen={errorModal.isOpen}
          onClose={() => router.push('/forgot-password')}
          message={errorModal.message}
        />
        <div className="bg-gray-50 min-h-screen py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto text-center">
              <p className="text-gray-600">קישור לא תקין</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

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
              {!success ? (
                <>
                  {/* Header */}
                  <div className="text-center mb-8">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-navy/10">
                      <Lock className="h-8 w-8 text-navy" />
                    </div>
                    <h1 className="text-3xl font-bold text-navy mb-2">
                      איפוס סיסמה
                    </h1>
                    <p className="text-gray-600">
                      הזן סיסמה חדשה לחשבון שלך
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        סיסמה חדשה *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-12 py-3 text-right text-gray-900 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                          placeholder="לפחות 6 תווים"
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
                        אימות סיסמה *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-right text-gray-900 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                          placeholder="הזן סיסמה שוב"
                        />
                        <Lock className="absolute right-4 top-3.5 h-5 w-5 text-gray-400" />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-lg bg-navy px-6 py-3 font-semibold text-white transition-all hover:bg-navy-light disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          <span>מאפס סיסמה...</span>
                        </div>
                      ) : (
                        'אפס סיסמה'
                      )}
                    </button>
                  </form>
                </>
              ) : (
                <>
                  {/* Success State */}
                  <div className="text-center">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green/10">
                      <CheckCircle className="h-12 w-12 text-green" />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      הסיסמה אופסה בהצלחה!
                    </h2>

                    <p className="text-gray-600 mb-6">
                      כעת תוכל להתחבר עם הסיסמה החדשה
                    </p>

                    <Link
                      href="/login"
                      className="inline-block rounded-lg bg-navy px-8 py-3 font-semibold text-white hover:bg-navy-light"
                    >
                      התחבר עכשיו
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default function ResetPasswordPage() {
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
      <ResetPasswordContent />
    </Suspense>
  );
}
