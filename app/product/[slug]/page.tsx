import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/MainLayout';
import { getProductBySlug, getProducts } from '@/lib/woocommerce';
import {
  calculateDiscount,
  calculateMonthlyPayment,
  hasFreeShipping,
  getProductMeta,
  getVehicleCompatibility,
  isUniversalFit
} from '@/types/product';
import { formatPrice } from '@/lib/utils';
import { Truck, Shield, Package, ChevronLeft, Car } from 'lucide-react';
import { AddToCartButton } from '@/components/product/AddToCartButton';
import { BuyNowButton } from '@/components/product/BuyNowButton';
import { VEHICLE_BRANDS } from '@/types/vehicle';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  // Skip static generation during build
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return [];
  }

  try {
    const { products } = await getProducts({ per_page: 100 });
    return products.map((product: any) => ({
      slug: product.slug,
    }));
  } catch (error) {
    return [];
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const discount = calculateDiscount(product.regular_price, product.sale_price);
  const meta = getProductMeta(product);
  const showFreeShipping = hasFreeShipping(product);
  const showMonthlyPayment = meta._enable_monthly_payment === 'yes';
  const months = parseInt(meta._monthly_payment_months || '12');

  // Get vehicle compatibility
  const universal = isUniversalFit(product);
  const compatibility = getVehicleCompatibility(product);

  // Debug logging
  console.log('===== PRODUCT PAGE DEBUG =====');
  console.log(`Product: ${product.name}`);
  console.log(`  Universal fit:`, universal);
  console.log(`  Compatibility:`, compatibility);
  console.log(`  vehicle_compatibility (API):`, product.vehicle_compatibility);
  console.log(`  universal_fit (API):`, product.universal_fit);
  console.log(`  Raw meta_data:`, product.meta_data?.filter(m =>
    m.key === '_vehicle_compatibility' || m.key === '_universal_fit'
  ));
  console.log('==============================');

  // Extract unique brands from compatibility patterns
  const compatibleBrands = !universal && compatibility.length > 0
    ? Array.from(new Set(
        compatibility
          .map(pattern => {
            const brandMatch = pattern.match(/brand:([^,]+)/);
            return brandMatch ? brandMatch[1] : null;
          })
          .filter(Boolean)
      ))
    : [];

  // Get brand display names
  const brandNames = compatibleBrands
    .map(brandId => VEHICLE_BRANDS.find(b => b.id === brandId)?.name || brandId);

  return (
    <MainLayout>
      <div className="bg-white">
        {/* Breadcrumb */}
        <div className="border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-navy">דף הבית</Link>
              <ChevronLeft className="h-4 w-4 rotate-180" />
              <Link href="/products" className="hover:text-navy">מוצרים</Link>
              <ChevronLeft className="h-4 w-4 rotate-180" />
              <span className="text-navy">{product.name}</span>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-50">
                <Image
                  src={product.images[0]?.src || '/placeholder.svg'}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {discount > 0 && (
                    <div className="rounded-full bg-red px-4 py-2 text-sm font-bold text-white shadow-lg">
                      הנחה {discount}%
                    </div>
                  )}
                  {showFreeShipping && (
                    <div className="flex items-center gap-1 rounded-full bg-green px-4 py-2 text-sm font-bold text-white shadow-lg">
                      <Truck className="h-4 w-4" />
                      <span>משלוח חינם</span>
                    </div>
                  )}
                </div>

                {/* Stock Status */}
                <div className="absolute bottom-4 right-4">
                  {product.stock_status === 'instock' ? (
                    <div className="rounded-full bg-green/90 px-4 py-2 text-sm font-bold text-white backdrop-blur-sm">
                      במלאי
                    </div>
                  ) : (
                    <div className="rounded-full bg-red/90 px-4 py-2 text-sm font-bold text-white backdrop-blur-sm">
                      אזל מהמלאי
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(0, 4).map((image: any, index: number) => (
                    <div key={image.id} className="relative aspect-square overflow-hidden rounded-lg bg-gray-50">
                      <Image
                        src={image.src}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                {product.categories.length > 0 && (
                  <div className="flex gap-2 mb-3">
                    {product.categories.map((category: any) => (
                      <Link
                        key={category.id}
                        href={`/categories/${category.slug}`}
                        className="text-sm text-navy hover:underline"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Vehicle Compatibility Badge */}
                {universal ? (
                  <div className="inline-flex items-center gap-2 bg-green/10 text-green px-4 py-2 rounded-full">
                    <Car className="h-4 w-4" />
                    <span className="text-sm font-semibold">מתאים לכל הרכבים</span>
                  </div>
                ) : brandNames.length > 0 ? (
                  <div className="inline-flex items-center gap-2 bg-navy/10 text-navy px-4 py-2 rounded-full">
                    <Car className="h-4 w-4" />
                    <span className="text-sm font-semibold">מתאים ל: {brandNames.join(', ')}</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-500 px-4 py-2 rounded-full">
                    <Car className="h-4 w-4" />
                    <span className="text-sm font-semibold">לא צוין התאמה לרכב</span>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="border-t border-b py-6">
                <div className="flex items-baseline gap-4 mb-2">
                  <span className="text-4xl font-bold text-navy">
                    {formatPrice(product.price)}
                  </span>
                  {product.on_sale && product.regular_price !== product.sale_price && (
                    <span className="text-xl text-gray-500 line-through">
                      {formatPrice(product.regular_price)}
                    </span>
                  )}
                </div>

                {showMonthlyPayment && (
                  <p className="text-lg text-gray-600">
                    או {formatPrice(calculateMonthlyPayment(product.price, months))} לחודש
                    {months !== 12 && ` (${months} תשלומים)`}
                  </p>
                )}
              </div>

              {/* Short Description */}
              {product.short_description && (
                <div
                  className="prose prose-sm text-gray-600"
                  dangerouslySetInnerHTML={{ __html: product.short_description }}
                />
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <BuyNowButton product={product} />
                <AddToCartButton product={product} />
              </div>

              {/* Features */}
              <div className="border-t pt-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  {showFreeShipping && (
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-green/10 p-2">
                        <Truck className="h-5 w-5 text-green" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">משלוח חינם</p>
                        <p className="text-xs text-gray-600">לכל הארץ</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-navy/10 p-2">
                      <Shield className="h-5 w-5 text-navy" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">תשלום מאובטח</p>
                      <p className="text-xs text-gray-600">100% בטוח</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-navy/10 p-2">
                      <Package className="h-5 w-5 text-navy" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">התקנה מקצועית</p>
                      <p className="text-xs text-gray-600">שירות איכותי</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* SKU */}
              {product.sku && (
                <div className="text-sm text-gray-500">
                  מק"ט: {product.sku}
                </div>
              )}
            </div>
          </div>

          {/* Full Description */}
          {product.description && (
            <div className="mt-12 border-t pt-12">
              <h2 className="text-2xl font-bold text-navy mb-6">תיאור מלא</h2>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
