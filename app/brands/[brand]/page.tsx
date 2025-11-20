'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProductCard } from '@/components/product/ProductCard';
import { Car, Filter } from 'lucide-react';
import Image from 'next/image';
import { filterProductsByBrand } from '@/lib/vehicle-compatibility';
import { getBrandLogo } from '@/lib/brand-logos';
import { VEHICLE_BRANDS } from '@/types/vehicle';

export default function BrandPage() {
  const params = useParams();
  const brand = params.brand as string;

  // Get brand info from VEHICLE_BRANDS
  const brandInfo = VEHICLE_BRANDS.find(b => b.id === brand);
  const brandName = brandInfo?.name || brand;
  const brandLogo = getBrandLogo(brand);

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        // Fetch all products with vehicle compatibility data
        const response = await fetch(`/api/products?page=1&per_page=100&orderby=date&order=desc`);
        const data = await response.json();

        if (data.success && data.products) {
          // Filter products by brand using vehicle compatibility system
          const filtered = filterProductsByBrand(data.products, brand);
          setProducts(filtered);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('שגיאה בטעינת המוצרים');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [brand]);

  return (
    <MainLayout>
      {/* Brand Header */}
      <section className="bg-gradient-to-b from-navy/5 to-white py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center border-4 border-navy/10 p-4">
              {brandLogo ? (
                <Image
                  src={brandLogo}
                  alt={brandName}
                  width={80}
                  height={80}
                  className="object-contain"
                />
              ) : (
                <span className="text-3xl font-bold text-navy">
                  {brandName.substring(0, 2)}
                </span>
              )}
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-navy text-center mb-4">
            מוצרים ל{brandName}
          </h1>
          <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto">
            מערכות רכב מתקדמות, אביזרים ורכיבים מותאמים במיוחד עבור {brandName}
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-navy"></div>
              <p className="mt-4 text-gray-600">טוען מוצרים...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-red/5 rounded-2xl">
              <p className="text-red text-lg font-semibold">{error}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-2xl">
              <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-navy mb-2">
                אין מוצרים זמינים עבור {brandName}
              </h3>
              <p className="text-gray-600 mb-6">
                אנחנו עובדים על הוספת מוצרים נוספים. בינתיים, בדוק את הקטגוריות האחרות
              </p>
              <a
                href="/"
                className="inline-flex items-center gap-2 rounded-lg bg-navy px-6 py-3 font-semibold text-white transition-all hover:bg-navy-light"
              >
                <span>חזרה לדף הבית</span>
              </a>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600">
                  נמצאו <span className="font-bold text-navy">{products.length}</span> מוצרים
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Filter className="h-4 w-4" />
                  <span>מסוננן לפי: {brandName}</span>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </MainLayout>
  );
}
