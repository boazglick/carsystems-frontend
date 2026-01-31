import { MainLayout } from '@/components/layout/MainLayout';
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';

export default function ContactPage() {
  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <div className="bg-navy text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">צור קשר</h1>
            <p className="text-xl text-gray-300">
              נשמח לעמוד לשירותכם בכל שאלה
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-navy mb-6">פרטי התקשרות</h2>
                <div className="space-y-6">
                  {/* Phone */}
                  <div className="flex items-start gap-4 bg-white rounded-xl p-6 shadow-sm">
                    <div className="rounded-full bg-navy/10 p-3">
                      <Phone className="h-6 w-6 text-navy" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">טלפון</h3>
                      <a
                        href="tel:052-272-9996"
                        className="text-lg text-navy hover:underline"
                        dir="ltr"
                      >
                        052-272-9996
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4 bg-white rounded-xl p-6 shadow-sm">
                    <div className="rounded-full bg-navy/10 p-3">
                      <Mail className="h-6 w-6 text-navy" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">אימייל</h3>
                      <a
                        href="mailto:info@adcars.co.il"
                        className="text-lg text-navy hover:underline"
                      >
                        info@adcars.co.il
                      </a>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-4 bg-white rounded-xl p-6 shadow-sm">
                    <div className="rounded-full bg-navy/10 p-3">
                      <MapPin className="h-6 w-6 text-navy" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">כתובת</h3>
                      <p className="text-lg text-gray-700">איתן 30, ניר צבי</p>
                    </div>
                  </div>

                  {/* Working Hours */}
                  <div className="flex items-start gap-4 bg-white rounded-xl p-6 shadow-sm">
                    <div className="rounded-full bg-navy/10 p-3">
                      <Clock className="h-6 w-6 text-navy" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">שעות פעילות</h3>
                      <p className="text-gray-700">ראשון - חמישי: 08:00 - 18:00</p>
                      <p className="text-gray-700">שישי: 08:00 - 13:00</p>
                      <p className="text-gray-500 text-sm">שבת: סגור</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <div className="bg-green/10 rounded-xl p-6 border border-green/20">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-green p-3">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">צור קשר בוואטסאפ</h3>
                    <p className="text-sm text-gray-600 mb-3">מענה מהיר לכל שאלה</p>
                    <a
                      href="https://wa.me/972522729996"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-green text-white px-6 py-2 rounded-lg font-semibold hover:bg-green/90 transition-colors"
                    >
                      <MessageCircle className="h-5 w-5" />
                      שלח הודעה
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-navy mb-6">שלח לנו הודעה</h2>
              <form className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      שם מלא *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-right text-gray-900 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                      placeholder="הכנס את שמך"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      טלפון *
                    </label>
                    <input
                      type="tel"
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-right text-gray-900 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                      placeholder="מספר טלפון"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    אימייל *
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-right text-gray-900 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                    placeholder="כתובת אימייל"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    נושא
                  </label>
                  <select
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-right text-gray-900 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                  >
                    <option value="">בחר נושא</option>
                    <option value="sales">מכירות ושאלות על מוצרים</option>
                    <option value="support">תמיכה טכנית</option>
                    <option value="installation">התקנות</option>
                    <option value="order">מעקב הזמנה</option>
                    <option value="other">אחר</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    הודעה *
                  </label>
                  <textarea
                    required
                    rows={5}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-right text-gray-900 placeholder:text-gray-500 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                    placeholder="כתוב את הודעתך כאן..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-navy px-6 py-4 font-semibold text-white transition-all hover:bg-navy-light"
                >
                  שלח הודעה
                </button>

                <p className="text-sm text-gray-500 text-center">
                  אנו מתחייבים לחזור אליכם תוך 24 שעות בימי עסקים
                </p>
              </form>
            </div>
          </div>

          {/* Map Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-navy mb-6">מיקום</h2>
            <div className="bg-white rounded-xl overflow-hidden shadow-sm">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3396.3!2d34.85!3d31.93!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDU1JzQ4LjAiTiAzNMKwNTEnMDAuMCJF!5e0!3m2!1siw!2sil!4v1234567890"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="מיקום A.D שירותי רכב"
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
