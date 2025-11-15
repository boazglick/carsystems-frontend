import Link from 'next/link';
import Image from 'next/image';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProductCard } from '@/components/product/ProductCard';
import { VehicleSelector } from '@/components/vehicle/VehicleSelector';
import { getProducts } from '@/lib/woocommerce';
import { Truck, Shield, Wrench, Headphones, Star, TrendingUp } from 'lucide-react';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  let products = [];
  let error = null;

  try {
    const result = await getProducts({ per_page: 8, featured: true });
    products = result.products;
  } catch (err) {
    console.error('Error fetching products:', err);
    error = 'לא ניתן לטעון מוצרים כרגע';
  }

  return (
    <MainLayout>
      {/* Hero Section with Background Image */}
      <section className="relative bg-white overflow-hidden">
        <div className="absolute inset-0 bg-navy/5"></div>
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            {/* Text Content */}
            <div className="text-center lg:text-right">
              <div className="inline-block mb-4 rounded-full bg-navy/10 px-4 py-2">
                <span className="text-sm font-semibold text-navy">מערכות רכב מתקדמות #1 בישראל</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-navy mb-6 leading-tight">
                שדרגו את הרכב שלכם
                <span className="block text-navy-light mt-2">לרמה הבאה</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                מולטימדיה מתקדמת, מצלמות רכב, חיישנים ואביזרים איכוtiים
                <br className="hidden md:block" />
                עם התקנה מקצועית ואחריות מלאה
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-navy px-8 py-4 font-semibold text-white transition-all hover:bg-navy-light hover:shadow-xl"
                >
                  <Star className="h-5 w-5" />
                  <span>צפה במוצרים מומלצים</span>
                </Link>
                <Link
                  href="/categories"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-navy px-8 py-4 font-semibold text-navy transition-all hover:bg-navy hover:text-white"
                >
                  <span>דפדף בקטגוריות</span>
                </Link>
              </div>
            </div>

            {/* Hero Image Placeholder */}
            <div className="relative hidden lg:block">
              <div className="relative aspect-square rounded-3xl bg-gradient-to-br from-navy/10 to-navy/5 p-8 shadow-2xl">
                <div className="absolute inset-0 rounded-3xl bg-white/50 backdrop-blur-sm"></div>
                <div className="relative h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-8xl mb-4">🚗</div>
                    <p className="text-navy font-semibold text-lg">תמונת Hero</p>
                    <p className="text-gray-600 text-sm">רכב עם מערכות מתקדמות</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vehicle Selector Section - Prominent CTA */}
      <section className="py-16 bg-gradient-to-br from-navy/5 via-white to-navy/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-3">
                מצא מוצרים תואמים לרכב שלך
              </h2>
              <p className="text-lg text-gray-600">
                הזן מספר רישוי או בחר ידנית את דגם הרכב - נציג לך רק מוצרים תואמים
              </p>
            </div>
            <VehicleSelector />
          </div>
        </div>
      </section>

      {/* Features Section - Modern Cards */}
      <section className="py-16 bg-white border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="group relative bg-gradient-to-br from-green/5 to-green/10 rounded-2xl p-6 transition-all hover:shadow-lg">
              <div className="mb-4 inline-flex rounded-full bg-green/20 p-3">
                <Truck className="h-6 w-6 text-green" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">משלוח חינם</h3>
              <p className="text-sm text-gray-600">משלוח מהיר לכל הארץ ללא עלות נוספת</p>
            </div>

            {/* Feature 2 */}
            <div className="group relative bg-gradient-to-br from-navy/5 to-navy/10 rounded-2xl p-6 transition-all hover:shadow-lg">
              <div className="mb-4 inline-flex rounded-full bg-navy/20 p-3">
                <Wrench className="h-6 w-6 text-navy" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">התקנה מקצועית</h3>
              <p className="text-sm text-gray-600">טכנאים מוסמכים עם ניסיון רב שנים</p>
            </div>

            {/* Feature 3 */}
            <div className="group relative bg-gradient-to-br from-navy-light/5 to-navy-light/10 rounded-2xl p-6 transition-all hover:shadow-lg">
              <div className="mb-4 inline-flex rounded-full bg-navy-light/20 p-3">
                <Shield className="h-6 w-6 text-navy-light" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">אחריות מלאה</h3>
              <p className="text-sm text-gray-600">אחריות יצרן + שירות לקוחות מעולה</p>
            </div>

            {/* Feature 4 */}
            <div className="group relative bg-gradient-to-br from-red/5 to-red/10 rounded-2xl p-6 transition-all hover:shadow-lg">
              <div className="mb-4 inline-flex rounded-full bg-red/20 p-3">
                <Headphones className="h-6 w-6 text-red" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">תמיכה 24/7</h3>
              <p className="text-sm text-gray-600">זמינים עבורכם בכל שעה ביום</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <TrendingUp className="h-6 w-6 text-navy" />
              <span className="text-sm font-semibold text-navy uppercase tracking-wide">המוצרים הכי נמכרים</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              מוצרים מומלצים
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              המוצרים הפופולריים והמבוקשים ביותר שלנו - איכות מובטחת ומחירים מעולים
            </p>
          </div>

          {error ? (
            <div className="text-center py-12 bg-red/5 rounded-2xl">
              <p className="text-red text-lg font-semibold mb-2">{error}</p>
              <p className="text-gray-600">
                אנא בדוק את הגדרות API של WooCommerce
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-2xl">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-gray-600 text-lg mb-4">
                אין מוצרים להצגה כרגע
              </p>
              <Link
                href="/products"
                className="text-navy hover:underline font-semibold"
              >
                צפה בכל המוצרים →
              </Link>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <div className="mt-12 text-center">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-lg border-2 border-navy px-8 py-4 font-semibold text-navy transition-all hover:bg-navy hover:text-white hover:shadow-lg"
                >
                  <span>צפה בכל המוצרים</span>
                  <span>←</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Categories Section with Images */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              קנה לפי קטגוריה
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              מצא בדיוק מה שאתה מחפש - מגוון רחב של מוצרים בכל קטגוריה
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: 'מערכות בטיחות', icon: '🛡️', slug: 'safety', color: 'from-blue-500/10 to-blue-600/10', iconBg: 'bg-blue-500/20', iconColor: 'text-blue-600' },
              { name: 'מולטימדיה', icon: '📱', slug: 'multimedia', color: 'from-purple-500/10 to-purple-600/10', iconBg: 'bg-purple-500/20', iconColor: 'text-purple-600' },
              { name: 'GPS ונווטים', icon: '🗺️', slug: 'gps', color: 'from-green-500/10 to-green-600/10', iconBg: 'bg-green-500/20', iconColor: 'text-green-600' },
              { name: 'חיישנים', icon: '📡', slug: 'sensors', color: 'from-orange-500/10 to-orange-600/10', iconBg: 'bg-orange-500/20', iconColor: 'text-orange-600' },
              { name: 'מצלמות רכב', icon: '📷', slug: 'cameras', color: 'from-red-500/10 to-red-600/10', iconBg: 'bg-red-500/20', iconColor: 'text-red-600' },
              { name: 'אביזרים', icon: '🔌', slug: 'accessories', color: 'from-gray-500/10 to-gray-600/10', iconBg: 'bg-gray-500/20', iconColor: 'text-gray-600' },
            ].map((category) => (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className={`group relative bg-gradient-to-br ${category.color} rounded-2xl p-8 transition-all hover:shadow-xl hover:-translate-y-2 overflow-hidden`}
              >
                <div className="relative z-10">
                  <div className={`inline-flex rounded-2xl ${category.iconBg} p-4 mb-4 group-hover:scale-110 transition-transform`}>
                    <span className={`text-4xl ${category.iconColor}`}>{category.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-navy mb-2">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    מגוון מוצרים איכותיים במחירים מעולים
                  </p>
                  <div className="inline-flex items-center gap-2 text-navy font-semibold group-hover:gap-3 transition-all">
                    <span>קנה עכשיו</span>
                    <span>←</span>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-l from-navy/20 to-transparent"></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="py-12 bg-white border-y">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green/10 p-3">
                <Shield className="h-6 w-6 text-green" />
              </div>
              <div>
                <p className="font-bold text-gray-900">תשלום מאובטח</p>
                <p className="text-sm text-gray-600">SSL מוצפן</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-navy/10 p-3">
                <Star className="h-6 w-6 text-navy" />
              </div>
              <div>
                <p className="font-bold text-gray-900">דירוג 4.9/5</p>
                <p className="text-sm text-gray-600">מעל 1,000 ביקורות</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green/10 p-3">
                <Truck className="h-6 w-6 text-green" />
              </div>
              <div>
                <p className="font-bold text-gray-900">משלוח מהיר</p>
                <p className="text-sm text-gray-600">2-3 ימי עסקים</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
