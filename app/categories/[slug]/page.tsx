'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProductCard } from '@/components/product/ProductCard';
import { WooCommerceProduct, getVehicleCompatibility, isUniversalFit } from '@/types/product';
import { VehicleSelector } from '@/components/vehicle/VehicleSelector';
import { Vehicle } from '@/types/vehicle';
import { isProductCompatible } from '@/lib/vehicle-api';
import { Search, ChevronLeft } from 'lucide-react';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [slug, setSlug] = useState<string>('');
  const [products, setProducts] = useState<WooCommerceProduct[]>([]);
  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filterOnSale, setFilterOnSale] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    params.then(p => setSlug(p.slug));
  }, [params]);

  useEffect(() => {
    if (slug) {
      fetchCategoryAndProducts();
    }
  }, [slug, currentPage, sortBy, filterOnSale]);

  const fetchCategoryAndProducts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        per_page: '12',
        orderby: sortBy === 'price-low' ? 'price' : sortBy === 'price-high' ? 'price' : 'date',
        order: sortBy === 'price-high' ? 'desc' : 'asc',
        category: slug,
      });

      if (filterOnSale) {
        queryParams.append('on_sale', 'true');
      }

      if (search) {
        queryParams.append('search', search);
      }

      const response = await fetch(`/api/categories/${slug}?${queryParams}`);
      const data = await response.json();

      setProducts(data.products || []);
      setCategory(data.category || { name: slug, description: '' });
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching category:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCategoryAndProducts();
  };

  // Filter products based on selected vehicle
  const filteredProducts = selectedVehicle
    ? products.filter(product => {
        const compatibility = getVehicleCompatibility(product);
        return isUniversalFit(product) || isProductCompatible(compatibility, selectedVehicle);
      })
    : products;

  const handleVehicleSelect = (vehicle: Vehicle | null) => {
    setSelectedVehicle(vehicle);
    setCurrentPage(1);
  };

  const getCategoryIcon = (categorySlug: string) => {
    const icons: Record<string, string> = {
      safety: '🛡️',
      multimedia: '📱',
      gps: '🗺️',
      sensors: '📡',
      cameras: '📷',
      accessories: '🔌',
    };
    return icons[categorySlug] || '📦';
  };

  const getCategoryName = (categorySlug: string) => {
    const names: Record<string, string> = {
      safety: 'מערכות בטיחות',
      multimedia: 'מולטימדיה',
      gps: 'GPS ונווטים',
      sensors: 'חיישנים',
      cameras: 'מצלמות רכב',
      accessories: 'אביזרים',
    };
    return category?.name || names[categorySlug] || categorySlug;
  };

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-navy">דף הבית</Link>
              <ChevronLeft className="h-4 w-4 rotate-180" />
              <Link href="/products" className="hover:text-navy">מוצרים</Link>
              <ChevronLeft className="h-4 w-4 rotate-180" />
              <span className="text-navy">{getCategoryName(slug)}</span>
            </div>
          </div>
        </div>

        {/* Category Header */}
        <div className="bg-gradient-to-b from-navy/5 to-transparent border-b">
          <div className="container mx-auto px-4 py-12">
            <div className="text-center max-w-3xl mx-auto">
              <div className="text-6xl mb-4">{getCategoryIcon(slug)}</div>
              <h1 className="text-4xl font-bold text-navy mb-4">
                {getCategoryName(slug)}
              </h1>
              {category?.description && (
                <p className="text-lg text-gray-600" dangerouslySetInnerHTML={{ __html: category.description }} />
              )}
            </div>
          </div>
        </div>

        {/* Vehicle Selector */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-6">
            <VehicleSelector onVehicleSelect={handleVehicleSelect} compact />
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              {/* Search */}
              <form onSubmit={handleSearch} className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="חפש בקטגוריה..."
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pr-10 text-right text-gray-900 placeholder:text-gray-500 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                  />
                </div>
              </form>

              {/* Filters */}
              <div className="flex gap-3 items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterOnSale}
                    onChange={(e) => {
                      setFilterOnSale(e.target.checked);
                      setCurrentPage(1);
                    }}
                    className="rounded border-gray-300 text-navy focus:ring-navy"
                  />
                  <span className="text-sm font-semibold text-gray-700">מבצעים בלבד</span>
                </label>

                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 font-medium focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                >
                  <option value="date">חדשים ביותר</option>
                  <option value="price-low">מחיר: נמוך לגבוה</option>
                  <option value="price-high">מחיר: גבוה לנמוך</option>
                  <option value="popularity">פופולריים</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="container mx-auto px-4 py-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-navy border-r-transparent"></div>
              <p className="mt-4 text-gray-600">טוען מוצרים...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 mb-4">לא נמצאו מוצרים בקטגוריה זו</p>
              <Link
                href="/products"
                className="text-navy hover:underline"
              >
                צפה בכל המוצרים
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-gray-600">
                  {selectedVehicle
                    ? `מציג ${filteredProducts.length} מוצרים תואמים לרכב שלך`
                    : `נמצאו ${filteredProducts.length} מוצרים`
                  }
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="rounded-lg border border-gray-300 px-4 py-2 font-medium hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    הקודם
                  </button>

                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`rounded-lg px-4 py-2 font-medium ${
                          currentPage === page
                            ? 'bg-navy text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="rounded-lg border border-gray-300 px-4 py-2 font-medium hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    הבא
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
