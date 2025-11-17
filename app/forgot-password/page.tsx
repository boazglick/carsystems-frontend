'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/MainLayout';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';
import { ErrorModal } from '@/components/checkout/ErrorModal';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const wpUrl = process.env.NEXT_PUBLIC_WP_URL || 'https://adsystems.ussl.info';
      const response = await fetch(`${wpUrl}/wp-json/custom/v1/password-reset/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorModal({
          isOpen: true,
          message: data.message || 'שגיאה בשליחת המייל',
        });
      } else {
        setSuccess(true);
      }
    } catch (error) {
      setErrorModal({
        isOpen: true,
        message: 'שגיאה בשליחת המייל. אנא נסה שוב.',
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
              {!success ? (
                <>
                  {/* Header */}
                  <div className="text-center mb-8">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-navy/10">
                      <Mail className="h-8 w-8 text-navy" />
                    </div>
                    <h1 className="text-3xl font-bold text-navy mb-2">
                      שכחתי סיסמה
                    </h1>
                    <p className="text-gray-600">
                      הזן את כתובת המייל שלך ונשלח לך קישור לאיפוס הסיסמה
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        אימייל *
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-right text-gray-900 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                          placeholder="your@email.com"
                        />
                        <Mail className="absolute right-4 top-3.5 h-5 w-5 text-gray-400" />
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
                          <span>שולח...</span>
                        </div>
                      ) : (
                        'שלח קישור לאיפוס סיסמה'
                      )}
                    </button>
                  </form>

                  {/* Back to login */}
                  <div className="mt-6 text-center">
                    <Link
                      href="/login"
                      className="inline-flex items-center gap-2 text-navy font-semibold hover:underline"
                    >
                      <ArrowRight className="h-4 w-4" />
                      <span>חזור להתחברות</span>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  {/* Success State */}
                  <div className="text-center">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green/10">
                      <CheckCircle className="h-12 w-12 text-green" />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      המייל נשלח!
                    </h2>

                    <p className="text-gray-600 mb-2">
                      שלחנו קישור לאיפוס סיסמה לכתובת:
                    </p>
                    <p className="text-navy font-semibold mb-6">
                      {email}
                    </p>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-right">
                      <p className="text-sm text-gray-700">
                        <strong>שים לב:</strong> הקישור תקף ל-24 שעות בלבד.
                        אם לא קיבלת את המייל, בדוק את תיקיית הספאם.
                      </p>
                    </div>

                    <Link
                      href="/login"
                      className="inline-block rounded-lg bg-navy px-8 py-3 font-semibold text-white hover:bg-navy-light"
                    >
                      חזור להתחברות
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
