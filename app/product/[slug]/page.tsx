import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/MainLayout';
import {
  calculateDiscount,
  hasFreeShipping,
  getProductMeta,
  getVehicleCompatibility,
  isUniversalFit
} from '@/types/product';
import { decodeHtmlEntities } from '@/lib/utils';
import { Truck, ChevronLeft } from 'lucide-react';
import { ProductDetails } from '@/components/product/ProductDetails';
import { VEHICLE_BRANDS } from '@/types/vehicle';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

async function fetchProductBySlug(slug: string) {
  const url = process.env.WORDPRESS_URL || process.env.NEXT_PUBLIC_WORDPRESS_URL;
  const key = process.env.WC_CONSUMER_KEY || process.env.NEXT_PUBLIC_WC_CONSUMER_KEY;
  const secret = process.env.WC_CONSUMER_SECRET || process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET;

  if (!url || !key || !secret) return null;

  const response = await fetch(
    `${url}/wp-json/wc/v3/products?slug=${slug}&consumer_key=${key}&consumer_secret=${secret}`
  );

  if (!response.ok) return null;
  const products = await response.json();
  return products[0] || null;
}

async function fetchProductVariations(productId: number) {
  const url = process.env.WORDPRESS_URL || process.env.NEXT_PUBLIC_WORDPRESS_URL;
  const key = process.env.WC_CONSUMER_KEY || process.env.NEXT_PUBLIC_WC_CONSUMER_KEY;
  const secret = process.env.WC_CONSUMER_SECRET || process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET;

  if (!url || !key || !secret) return [];

  try {
    const response = await fetch(
      `${url}/wp-json/wc/v3/products/${productId}/variations?per_page=100&consumer_key=${key}&consumer_secret=${secret}`
    );

    if (!response.ok) return [];
    return response.json();
  } catch (error) {
    console.error('Error fetching variations:', error);
    return [];
  }
}

async function fetchProducts() {
  const url = process.env.WORDPRESS_URL || process.env.NEXT_PUBLIC_WORDPRESS_URL;
  const key = process.env.WC_CONSUMER_KEY || process.env.NEXT_PUBLIC_WC_CONSUMER_KEY;
  const secret = process.env.WC_CONSUMER_SECRET || process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET;

  if (!url || !key || !secret) return [];

  const response = await fetch(
    `${url}/wp-json/wc/v3/products?per_page=100&consumer_key=${key}&consumer_secret=${secret}`
  );

  if (!response.ok) return [];
  return response.json();
}

export async function generateStaticParams() {
  // Skip static generation during build
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return [];
  }

  try {
    const products = await fetchProducts();
    return products.map((product: any) => ({
      slug: product.slug,
    }));
  } catch (error) {
    return [];
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Fetch variations for variable products
  const variations = product.type === 'variable'
    ? await fetchProductVariations(product.id)
    : [];

  const discount = calculateDiscount(product.regular_price, product.sale_price);
  const meta = getProductMeta(product);
  const showFreeShipping = hasFreeShipping(product);
  const showMonthlyPayment = meta._enable_monthly_payment === 'yes';
  const months = parseInt(meta._monthly_payment_months || '12');

  // Get vehicle compatibility
  const universal = isUniversalFit(product);
  const compatibility = getVehicleCompatibility(product);

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
    .map(brandId => VEHICLE_BRANDS.find(b => b.id === brandId)?.name || brandId) as string[];

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
              <span className="text-navy">{decodeHtmlEntities(product.name)}</span>
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
                  alt={decodeHtmlEntities(product.name)}
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
            <ProductDetails
              product={product}
              variations={variations}
              showFreeShipping={showFreeShipping}
              showMonthlyPayment={showMonthlyPayment}
              months={months}
              universal={universal}
              brandNames={brandNames}
            />
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
