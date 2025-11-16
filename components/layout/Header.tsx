'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Menu, X, Loader2 } from 'lucide-react';
import { CartIcon } from './CartIcon';

interface SearchResult {
  id: number;
  name: string;
  price: string;
  slug: string;
  images: Array<{ src: string; alt: string }>;
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Live search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        try {
          const response = await fetch(`/api/products?search=${encodeURIComponent(searchQuery)}&per_page=5`);
          const data = await response.json();
          setSearchResults(data.products || []);
          setShowResults(true);
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setShowResults(false);
      setMobileMenuOpen(false);
    }
  };

  const handleResultClick = () => {
    setSearchQuery('');
    setShowResults(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-navy">
              AD Systems
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden flex-1 px-8 md:block">
            <div ref={searchRef} className="relative max-w-2xl mx-auto">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 pointer-events-none" />
                {isSearching && (
                  <Loader2 className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-navy animate-spin" />
                )}
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="חפש מוצרים..."
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pr-10 text-right text-gray-900 placeholder:text-gray-500 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                />
              </form>

              {/* Search Results Dropdown */}
              {showResults && searchQuery.trim().length >= 2 && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-lg border border-gray-200 shadow-xl max-h-96 overflow-y-auto z-50">
                  {searchResults.length > 0 ? (
                    <>
                      {searchResults.map((product) => (
                        <Link
                          key={product.id}
                          href={`/product/${product.slug}`}
                          onClick={handleResultClick}
                          className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b last:border-b-0"
                        >
                          {product.images && product.images[0] ? (
                            <img
                              src={product.images[0].src}
                              alt={product.images[0].alt || product.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                              אין תמונה
                            </div>
                          )}
                          <div className="flex-1 text-right">
                            <div className="font-semibold text-gray-900" dangerouslySetInnerHTML={{ __html: product.name }} />
                            <div className="text-sm text-navy font-semibold">₪{product.price}</div>
                          </div>
                        </Link>
                      ))}
                      <Link
                        href={`/products?search=${encodeURIComponent(searchQuery)}`}
                        onClick={handleResultClick}
                        className="block p-3 text-center text-navy font-semibold hover:bg-navy hover:text-white transition-colors"
                      >
                        הצג את כל התוצאות ({searchResults.length > 5 ? 'עוד' : searchResults.length})
                      </Link>
                    </>
                  ) : !isSearching ? (
                    <div className="p-4 text-center text-gray-500">
                      לא נמצאו תוצאות עבור "{searchQuery}"
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <CartIcon />

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-full p-2 hover:bg-gray-100 transition-colors md:hidden"
              aria-label="תפריט"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden border-t py-3 md:block">
          <ul className="flex justify-center gap-8 text-sm">
            <li>
              <Link href="/" className="text-gray-700 hover:text-navy transition-colors font-medium">
                דף הבית
              </Link>
            </li>
            <li>
              <Link href="/products" className="text-gray-700 hover:text-navy transition-colors font-medium">
                כל המוצרים
              </Link>
            </li>
            <li>
              <Link href="/categories/safety" className="text-gray-700 hover:text-navy transition-colors font-medium">
                מערכות בטיחות
              </Link>
            </li>
            <li>
              <Link href="/categories/multimedia" className="text-gray-700 hover:text-navy transition-colors font-medium">
                מולטימדיה
              </Link>
            </li>
            <li>
              <Link href="/categories/gps" className="text-gray-700 hover:text-navy transition-colors font-medium">
                GPS ונווטים
              </Link>
            </li>
            <li>
              <Link href="/categories/sensors" className="text-gray-700 hover:text-navy transition-colors font-medium">
                חיישנים
              </Link>
            </li>
            <li>
              <Link href="/categories/cameras" className="text-gray-700 hover:text-navy transition-colors font-medium">
                מצלמות רכב
              </Link>
            </li>
            <li>
              <Link href="/page/about" className="text-gray-700 hover:text-navy transition-colors font-medium">
                אודות
              </Link>
            </li>
            <li>
              <Link href="/blog" className="text-gray-700 hover:text-navy transition-colors font-medium">
                בלוג
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Mobile Search */}
      <div className="border-t px-4 py-3 md:hidden">
        <div className="relative">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 pointer-events-none" />
            {isSearching && (
              <Loader2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy animate-spin" />
            )}
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="חפש מוצרים..."
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pr-10 text-right text-sm text-gray-900 placeholder:text-gray-500 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
            />
          </form>

          {/* Mobile Search Results Dropdown */}
          {showResults && searchQuery.trim().length >= 2 && (
            <div className="absolute top-full mt-2 w-full bg-white rounded-lg border border-gray-200 shadow-xl max-h-80 overflow-y-auto z-50">
              {searchResults.length > 0 ? (
                <>
                  {searchResults.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.slug}`}
                      onClick={handleResultClick}
                      className="flex items-center gap-2 p-2 hover:bg-gray-50 transition-colors border-b last:border-b-0"
                    >
                      {product.images && product.images[0] ? (
                        <img
                          src={product.images[0].src}
                          alt={product.images[0].alt || product.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                          אין
                        </div>
                      )}
                      <div className="flex-1 text-right">
                        <div className="text-sm font-semibold text-gray-900" dangerouslySetInnerHTML={{ __html: product.name }} />
                        <div className="text-xs text-navy font-semibold">₪{product.price}</div>
                      </div>
                    </Link>
                  ))}
                  <Link
                    href={`/products?search=${encodeURIComponent(searchQuery)}`}
                    onClick={handleResultClick}
                    className="block p-2 text-center text-sm text-navy font-semibold hover:bg-navy hover:text-white transition-colors"
                  >
                    הצג את כל התוצאות
                  </Link>
                </>
              ) : !isSearching ? (
                <div className="p-3 text-center text-sm text-gray-500">
                  לא נמצאו תוצאות עבור "{searchQuery}"
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="border-t bg-white md:hidden">
          <ul className="py-2">
            <li>
              <Link
                href="/"
                className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-navy transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                דף הבית
              </Link>
            </li>
            <li>
              <Link
                href="/products"
                className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-navy transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                כל המוצרים
              </Link>
            </li>
            <li>
              <Link
                href="/categories/safety"
                className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-navy transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                מערכות בטיחות
              </Link>
            </li>
            <li>
              <Link
                href="/categories/multimedia"
                className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-navy transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                מולטימדיה
              </Link>
            </li>
            <li>
              <Link
                href="/categories/gps"
                className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-navy transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                GPS ונווטים
              </Link>
            </li>
            <li>
              <Link
                href="/categories/sensors"
                className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-navy transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                חיישנים
              </Link>
            </li>
            <li>
              <Link
                href="/categories/cameras"
                className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-navy transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                מצלמות רכב
              </Link>
            </li>
            <li>
              <Link
                href="/page/about"
                className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-navy transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                אודות
              </Link>
            </li>
            <li>
              <Link
                href="/blog"
                className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-navy transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                בלוג
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
