import Link from 'next/link';
import Image from 'next/image';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProductCard } from '@/components/product/ProductCard';
import { VehicleSelector } from '@/components/vehicle/VehicleSelector';
import { getProducts } from '@/lib/woocommerce';
import { Truck, Shield, Wrench, Headphones, Star, TrendingUp } from 'lucide-react';
import { getBrandLogo } from '@/lib/brand-logos';

export const dynamic = 'force-dynamic';
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
      {/* Hero Section with Vehicle Selector */}
      <section className="relative bg-white overflow-hidden">
        <div className="absolute inset-0 bg-navy/5"></div>
        <div className="container mx-auto px-4 py-12 md:py-20 lg:py-32 relative">
          <div className="grid gap-8 lg:gap-12 lg:grid-cols-2 items-center">
            {/* Text Content */}
            <div className="text-center lg:text-right">
              <div className="inline-block mb-4 rounded-full bg-navy/10 px-3 py-1.5 md:px-4 md:py-2">
                <span className="text-xs md:text-sm font-semibold text-navy">מערכות רכב מתקדמות #1 בישראל</span>
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-navy mb-4 md:mb-6 leading-tight">
                שדרגו את הרכב שלכם
                <span className="block mt-2" style={{color: '#d83e1e'}}>לרמה הבאה</span>
              </h1>
              <p className="text-base md:text-xl text-gray-600 mb-6 md:mb-8 leading-relaxed">
                מולטימדיה מתקדמת, מצלמות רכב, חיישנים ואביזרים איכוtiים
                <br className="hidden md:block" />
                עם התקנה מקצועית ואחריות מלאה
              </p>

              {/* Vehicle Selector */}
              <div className="mb-6 md:mb-8">
                <VehicleSelector />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-navy px-6 md:px-8 py-3 md:py-4 text-sm md:text-base font-semibold text-white transition-all hover:bg-navy-light hover:shadow-xl"
                >
                  <Star className="h-4 w-4 md:h-5 md:w-5" />
                  <span>צפה במוצרים מומלצים</span>
                </Link>
                <Link
                  href="/categories"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-navy px-6 md:px-8 py-3 md:py-4 text-sm md:text-base font-semibold text-navy transition-all hover:bg-navy hover:text-white"
                >
                  <span>דפדף בקטגוריות</span>
                </Link>
              </div>
            </div>

            {/* Hero Image - Visible on all screens */}
            <div className="relative order-first lg:order-last">
              <div className="relative aspect-video lg:aspect-square rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl lg:shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=800&h=800&fit=crop&auto=format"
                  alt="מערכות רכב מתקדמות - AD Systems"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/30 to-transparent"></div>
              </div>
            </div>
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
                {products.map((product: any) => (
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

      {/* Car Brands Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              קנה לפי מותג רכב
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              בחר את יצרן הרכב שלך וגלה מוצרים מותאמים במיוחד עבורו
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {[
              { name: 'טויוטה', nameEn: 'Toyota', slug: 'toyota' },
              { name: 'הונדה', nameEn: 'Honda', slug: 'honda' },
              { name: 'מאזדה', nameEn: 'Mazda', slug: 'mazda' },
              { name: 'סובארו', nameEn: 'Subaru', slug: 'subaru' },
              { name: 'קיה', nameEn: 'Kia', slug: 'kia' },
              { name: 'פולקסווגן', nameEn: 'Volkswagen', slug: 'volkswagen' },
              { name: 'סקודה', nameEn: 'Skoda', slug: 'skoda' },
              { name: 'סיאט', nameEn: 'Seat', slug: 'seat' },
              { name: 'פורד', nameEn: 'Ford', slug: 'ford' },
              { name: 'פיג\'ו', nameEn: 'Peugeot', slug: 'peugeot' },
              { name: 'מיצובישי', nameEn: 'Mitsubishi', slug: 'mitsubishi' },
              { name: 'סוזוקי', nameEn: 'Suzuki', slug: 'suzuki' },
            ].map((brand) => {
              const brandLogo = getBrandLogo(brand.slug);
              return (
                <Link
                  key={brand.slug}
                  href={`/brands/${brand.slug}`}
                  className="group relative bg-white rounded-xl p-6 transition-all hover:shadow-xl hover:-translate-y-2 border-2 border-gray-100 hover:border-navy/20"
                >
                  <div className="flex flex-col items-center justify-center gap-3">
                    {/* Brand Logo */}
                    <div className="w-20 h-20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      {brandLogo ? (
                        <Image
                          src={brandLogo}
                          alt={brand.name}
                          width={80}
                          height={80}
                          className="object-contain"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-navy/5 to-navy/10 flex items-center justify-center">
                          <span className="text-2xl font-bold text-navy">{brand.nameEn.substring(0, 2).toUpperCase()}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      <h3 className="text-lg font-bold text-navy mb-1">
                        {brand.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {brand.nameEn}
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-1 text-xs text-navy font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>צפה במוצרים</span>
                      <span>←</span>
                    </div>
                  </div>
                </Link>
              );
            })}
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
