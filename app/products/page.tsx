'use client';

import { useState, useEffect, Suspense, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProductCard } from '@/components/product/ProductCard';
import { WooCommerceProduct, getVehicleCompatibility, isUniversalFit } from '@/types/product';
import { VehicleSelector } from '@/components/vehicle/VehicleSelector';
import { Vehicle } from '@/types/vehicle';
import { isProductCompatible } from '@/lib/vehicle-api';
import { Search, SlidersHorizontal } from 'lucide-react';

function ProductsContent() {
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState<WooCommerceProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState(urlSearch);
  const [sortBy, setSortBy] = useState('date');
  const [filterOnSale, setFilterOnSale] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // Ref for infinite scroll sentinel
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Update search when URL params change
  useEffect(() => {
    if (urlSearch) {
      setSearch(urlSearch);
    }
  }, [urlSearch]);

  useEffect(() => {
    fetchProducts();
  }, [sortBy, filterOnSale]);

  // Auto-search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (search !== '') {
        setCurrentPage(1);
        fetchProducts();
      }
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timeoutId);
  }, [search]);

  const fetchProducts = async (loadMore = false) => {
    if (loadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setCurrentPage(1); // Reset to page 1 for new searches
    }

    try {
      const pageToFetch = loadMore ? currentPage + 1 : 1;
      const params = new URLSearchParams({
        page: pageToFetch.toString(),
        per_page: '12',
        orderby: sortBy === 'price-low' ? 'price' : sortBy === 'price-high' ? 'price' : 'date',
        order: sortBy === 'price-high' ? 'desc' : 'asc',
      });

      if (filterOnSale) {
        params.append('on_sale', 'true');
      }

      if (search) {
        params.append('search', search);
      }

      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();

      if (loadMore) {
        // Append new products, filtering out duplicates
        setProducts(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const newProducts = (data.products || []).filter(p => !existingIds.has(p.id));
          return [...prev, ...newProducts];
        });
        setCurrentPage(pageToFetch);
      } else {
        // Replace products
        setProducts(data.products || []);
      }

      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching products:', error);
      if (!loadMore) {
        setProducts([]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  // Filter products based on selected vehicle
  const filteredProducts = selectedVehicle
    ? products.filter(product => {
        const compatibility = getVehicleCompatibility(product);
        const universal = isUniversalFit(product);

        // Debug logging - ALWAYS show in development
        console.log(`Product: ${product.name}`);
        console.log(`  Universal fit:`, universal);
        console.log(`  Compatibility:`, compatibility);
        console.log(`  vehicle_compatibility (API):`, product.vehicle_compatibility);
        console.log(`  universal_fit (API):`, product.universal_fit);
        console.log(`  Raw meta_data:`, product.meta_data?.filter((m: any) =>
          m.key === '_vehicle_compatibility' || m.key === '_universal_fit'
        ));

        // Check compatibility with selected vehicle
        const isCompatible = isProductCompatible(compatibility, selectedVehicle, universal);

        console.log(`  Is compatible with ${selectedVehicle.brand}:`, isCompatible);
        console.log('---');

        return isCompatible;
      })
    : products;

  const handleVehicleSelect = (vehicle: Vehicle | null) => {
    setSelectedVehicle(vehicle);
    // Products are already loaded, filtering happens client-side
  };

  // Infinite scroll - load more when sentinel comes into view
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        // Load more when sentinel is visible and we have more pages and not already loading
        if (entry.isIntersecting && currentPage < totalPages && !loadingMore && !loading) {
          fetchProducts(true);
        }
      },
      {
        root: null, // viewport
        rootMargin: '200px', // Start loading 200px before reaching the bottom
        threshold: 0.1,
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [currentPage, totalPages, loadingMore, loading]);

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-navy mb-4">כל המוצרים</h1>

            {/* Vehicle Selector */}
            <div className="mb-6">
              <VehicleSelector onVehicleSelect={handleVehicleSelect} compact />
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              {/* Search */}
              <form onSubmit={handleSearch} className="flex-1 max-w-md">
                <div className="relative flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    <input
                      type="search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="חפש מוצרים..."
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pr-10 text-right text-gray-900 placeholder:text-gray-500 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded-lg bg-navy px-6 py-2 font-semibold text-white transition-all hover:bg-navy-light whitespace-nowrap"
                  >
                    חפש
                  </button>
                </div>
              </form>

              {/* Filters */}
              <div className="flex gap-3 items-center">
                {/* On Sale Filter */}
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

                {/* Sort */}
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
          {/* Vehicle Filter Info */}
          {selectedVehicle && !loading && (
            <div className="mb-6 text-center">
              <p className="text-gray-600">
                מציג {filteredProducts.length} מוצרים תואמים לרכב שלך
              </p>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-navy border-r-transparent"></div>
              <p className="mt-4 text-gray-600">טוען מוצרים...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">לא נמצאו מוצרים</p>
              <button
                onClick={() => {
                  setSearch('');
                  setFilterOnSale(false);
                  setSelectedVehicle(null);
                  fetchProducts();
                }}
                className="mt-4 text-navy hover:underline"
              >
                נקה סינון
              </button>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Infinite Scroll Sentinel */}
              <div ref={sentinelRef} className="h-20 flex items-center justify-center">
                {loadingMore && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-navy border-t-transparent"></div>
                    <span>טוען עוד מוצרים...</span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <MainLayout>
        <div className="bg-gray-50 min-h-screen py-8">
          <div className="container mx-auto px-4">
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-navy border-r-transparent"></div>
              <p className="mt-4 text-gray-600">טוען מוצרים...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    }>
      <ProductsContent />
    </Suspense>
  );
}
