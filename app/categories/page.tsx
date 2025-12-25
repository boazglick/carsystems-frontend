import Link from 'next/link';
import { MainLayout } from '@/components/layout/MainLayout';
import { getCategories } from '@/lib/woocommerce';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

export default async function CategoriesPage() {
  let categories = [];

  try {
    categories = await getCategories({ per_page: 100, hide_empty: true });
  } catch (error) {
    console.error('Error fetching categories:', error);
  }

  // Default categories matching actual WooCommerce store categories
  const defaultCategories = [
    { slug: 'multimedia', name: 'מערכות מולטימדיה', icon: '📱', description: 'מערכות מולטימדיה ובידור לרכב' },
    { slug: 'panels', name: 'פנלים למולטימדיה', icon: '🖼️', description: 'פנלים והתאמות למערכות מולטימדיה' },
    { slug: 'car-parts', name: 'חלקי רכב', icon: '🚗', description: 'חלקי רכב ואביזרים' },
    { slug: 'audio', name: 'מערכות שמע', icon: '🔊', description: 'מגברים, רמקולים וסאבוופרים' },
    { slug: 'cameras', name: 'מצלמות רכב', icon: '📷', description: 'מצלמות דרך ומצלמות אחוריות' },
    { slug: 'accessories', name: 'אביזרים', icon: '🔌', description: 'אביזרים ועזרים לרכב' },
  ];

  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  const getCategoryIcon = (slug: string) => {
    const icons: Record<string, string> = {
      // Main categories
      'multimedia': '📱',
      'panels': '🖼️',
      'car-parts': '🚗',
      'audio': '🔊',
      'cameras': '📷',
      'accessories': '🔌',
      'by-brand': '🏭',
      // Sub-categories
      'amplifiers': '🔊',
      'speakers': '🔈',
      'subwoofers': '🎵',
      'dsp': '🎛️',
      'cables': '🔌',
      'mounts': '📍',
      'trunk-openers': '🚪',
      'steering-controls': '🎮',
      'sensors': '📡',
      'chargers': '🔋',
      'canbus': '💻',
      'frames': '🖼️',
      'multimedia-systems': '📺',
      // Brands (generic car icon)
      'brand-toyota': '🚗',
      'brand-honda': '🚗',
      'brand-mazda': '🚗',
      'brand-hyundai': '🚗',
      'brand-kia': '🚗',
      'brand-mercedes': '🚗',
      'brand-bmw': '🚗',
      'brand-audi': '🚗',
      'brand-volkswagen': '🚗',
    };
    // Check for brand categories
    if (slug.startsWith('brand-')) {
      return '🚗';
    }
    return icons[slug] || '📦';
  };

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-b from-navy/5 to-transparent border-b">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-navy mb-4">
                קטגוריות מוצרים
              </h1>
              <p className="text-xl text-gray-600">
                גלה את מגוון המוצרים שלנו לפי קטגוריות
              </p>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayCategories.map((category: any) => (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="group rounded-xl bg-white p-8 text-center shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <div className="text-5xl mb-4">
                  {getCategoryIcon(category.slug)}
                </div>
                <h3 className="text-xl font-semibold text-navy group-hover:text-navy-light transition-colors mb-2">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: category.description }} />
                )}
                {category.count !== undefined && (
                  <p className="text-sm text-gray-500 mt-2">
                    {category.count} מוצרים
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white border-t">
          <div className="container mx-auto px-4 py-12 text-center">
            <h2 className="text-2xl font-bold text-navy mb-4">
              לא מצאת מה שחיפשת?
            </h2>
            <p className="text-gray-600 mb-6">
              צפה בכל המוצרים שלנו או צור קשר לייעוץ אישי
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/products"
                className="rounded-lg bg-navy px-8 py-3 font-semibold text-white transition-all hover:bg-navy-light"
              >
                כל המוצרים
              </Link>
              <Link
                href="/contact"
                className="rounded-lg border-2 border-navy px-8 py-3 font-semibold text-navy transition-all hover:bg-navy hover:text-white"
              >
                צור קשר
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
