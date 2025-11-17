'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, Menu, X, Loader2, Shield, Tv, Navigation, Camera, Radar, Zap, Tag, TrendingUp, ChevronRight } from 'lucide-react';
import { CartIcon } from './CartIcon';

interface SearchResult {
  id: number;
  name: string;
  price: string;
  slug: string;
  images: Array<{ src: string; alt: string }>;
}

const productCategories = [
  {
    id: 'safety',
    name: 'מערכות בטיחות',
    slug: '/categories/safety',
    icon: Shield,
    description: 'מערכות התראה וניטור מתקדמות',
    color: 'from-blue-500/10 to-blue-600/10',
    iconColor: 'text-blue-600'
  },
  {
    id: 'multimedia',
    name: 'מולטימדיה',
    slug: '/categories/multimedia',
    icon: Tv,
    description: 'מסכים ומערכות בידור לרכב',
    color: 'from-purple-500/10 to-purple-600/10',
    iconColor: 'text-purple-600'
  },
  {
    id: 'gps',
    name: 'GPS ונווטים',
    slug: '/categories/gps',
    icon: Navigation,
    description: 'מערכות ניווט חכמות',
    color: 'from-green-500/10 to-green-600/10',
    iconColor: 'text-green-600'
  },
  {
    id: 'cameras',
    name: 'מצלמות רכב',
    slug: '/categories/cameras',
    icon: Camera,
    description: 'מצלמות דרך ורוורס',
    color: 'from-red-500/10 to-red-600/10',
    iconColor: 'text-red-600'
  },
  {
    id: 'sensors',
    name: 'חיישנים',
    slug: '/categories/sensors',
    icon: Radar,
    description: 'חיישני רוורס וחניה',
    color: 'from-orange-500/10 to-orange-600/10',
    iconColor: 'text-orange-600'
  }
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      const clickedOutsideDesktop = searchRef.current && !searchRef.current.contains(target);
      const clickedOutsideMobile = mobileSearchRef.current && !mobileSearchRef.current.contains(target);
      const clickedOutsideMegaMenu = megaMenuRef.current && !megaMenuRef.current.contains(target);

      if (clickedOutsideDesktop && clickedOutsideMobile) {
        setShowResults(false);
      }

      if (clickedOutsideMegaMenu) {
        setMegaMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
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
    <header className="sticky top-0 z-50 w-full bg-white shadow-md">
      <div className="container mx-auto px-4">
        {/* Top Bar with Search */}
        <div className="flex h-20 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="text-2xl font-bold text-navy">
              AD Systems
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl">
            <div ref={searchRef} className="relative w-full">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 pointer-events-none z-10" />
                {isSearching && (
                  <Loader2 className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-navy animate-spin z-10" />
                )}
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="חפש מוצרים, מערכות או אביזרים..."
                  className="w-full rounded-full border-2 border-gray-200 bg-gray-50 px-6 py-3 pr-12 text-right text-gray-900 placeholder:text-gray-400 focus:border-navy focus:bg-white focus:outline-none focus:ring-4 focus:ring-navy/10 transition-all"
                />
              </form>

              {/* Search Results Dropdown */}
              {showResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 max-h-96 overflow-auto rounded-2xl border border-gray-200 bg-white shadow-2xl">
                  {searchResults.map((result) => (
                    <Link
                      key={result.id}
                      href={`/product/${result.slug}`}
                      onClick={handleResultClick}
                      className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-b last:border-b-0"
                    >
                      {result.images[0] && (
                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                          <Image
                            src={result.images[0].src}
                            alt={result.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 text-right">
                        <h3 className="font-semibold text-gray-900 line-clamp-1">{result.name}</h3>
                        <p className="text-lg font-bold" style={{color: '#d83e1e'}}>₪{result.price}</p>
                      </div>
                    </Link>
                  ))}
                  <Link
                    href={`/products?search=${encodeURIComponent(searchQuery)}`}
                    onClick={handleResultClick}
                    className="block p-4 text-center font-semibold text-navy hover:bg-gray-50 transition-colors"
                  >
                    הצג את כל התוצאות →
                  </Link>
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

        {/* Navigation with Mega Menu */}
        <nav className="hidden border-t py-4 md:block">
          <ul className="flex justify-center items-center gap-1">
            <li>
              <Link
                href="/"
                className="px-4 py-2 rounded-lg text-gray-700 hover:text-navy hover:bg-gray-50 transition-all font-medium"
              >
                דף הבית
              </Link>
            </li>

            {/* Products Mega Menu Trigger */}
            <li
              ref={megaMenuRef}
              className="relative"
              onMouseEnter={() => setMegaMenuOpen(true)}
              onMouseLeave={() => setMegaMenuOpen(false)}
            >
              <button
                className="px-4 py-2 rounded-lg text-gray-700 hover:text-navy hover:bg-gray-50 transition-all font-medium flex items-center gap-1"
              >
                מוצרים
                <ChevronRight className={`h-4 w-4 transition-transform ${megaMenuOpen ? 'rotate-90' : ''}`} />
              </button>

              {/* Mega Menu Panel */}
              {megaMenuOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-screen max-w-6xl">
                  <div className="rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden">
                    <div className="grid grid-cols-12 gap-6 p-8">
                      {/* Product Categories - Left Side */}
                      <div className="col-span-8">
                        <div className="mb-6">
                          <h3 className="text-xl font-bold text-navy mb-2">קטגוריות מוצרים</h3>
                          <p className="text-sm text-gray-600">מגוון רחב של מערכות ואביזרים לרכב שלך</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          {productCategories.map((category) => {
                            const Icon = category.icon;
                            return (
                              <Link
                                key={category.id}
                                href={category.slug}
                                className={`group p-4 rounded-xl bg-gradient-to-br ${category.color} hover:shadow-lg transition-all border border-transparent hover:border-gray-200`}
                              >
                                <div className="flex items-start gap-3">
                                  <div className={`p-3 rounded-lg bg-white shadow-sm ${category.iconColor}`}>
                                    <Icon className="h-6 w-6" />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-bold text-gray-900 mb-1 group-hover:text-navy transition-colors">
                                      {category.name}
                                    </h4>
                                    <p className="text-sm text-gray-600 leading-snug">
                                      {category.description}
                                    </p>
                                  </div>
                                </div>
                              </Link>
                            );
                          })}
                        </div>

                        <Link
                          href="/products"
                          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all hover:shadow-lg"
                          style={{backgroundColor: '#0a2463'}}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0a2463'}
                        >
                          <span>כל המוצרים</span>
                          <ChevronRight className="h-5 w-5" />
                        </Link>
                      </div>

                      {/* Promotions & Featured - Right Side */}
                      <div className="col-span-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <Tag className="h-5 w-5" style={{color: '#d83e1e'}} />
                          <h3 className="text-lg font-bold text-gray-900">מבצעים חמים</h3>
                        </div>

                        <div className="space-y-4">
                          <div className="p-4 bg-white rounded-lg shadow-sm border border-red-100">
                            <div className="flex items-center gap-2 mb-2">
                              <Zap className="h-4 w-4" style={{color: '#d83e1e'}} />
                              <span className="text-sm font-bold" style={{color: '#d83e1e'}}>הנחה 20%</span>
                            </div>
                            <p className="text-sm font-semibold text-gray-900 mb-1">
                              מערכות מולטימדיה
                            </p>
                            <p className="text-xs text-gray-600">
                              על כל המערכות המתקדמות
                            </p>
                          </div>

                          <div className="p-4 bg-white rounded-lg shadow-sm border border-red-100">
                            <div className="flex items-center gap-2 mb-2">
                              <TrendingUp className="h-4 w-4" style={{color: '#d83e1e'}} />
                              <span className="text-sm font-bold" style={{color: '#d83e1e'}}>הכי נמכר</span>
                            </div>
                            <p className="text-sm font-semibold text-gray-900 mb-1">
                              מצלמות דרך
                            </p>
                            <p className="text-xs text-gray-600">
                              באיכות 4K עם GPS מובנה
                            </p>
                          </div>

                          <Link
                            href="/products?on_sale=true"
                            className="block w-full text-center px-4 py-3 rounded-lg font-semibold text-white transition-all hover:shadow-lg"
                            style={{backgroundColor: '#d83e1e'}}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c03518'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#d83e1e'}
                          >
                            כל המבצעים
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </li>

            <li>
              <Link
                href="/page/about"
                className="px-4 py-2 rounded-lg text-gray-700 hover:text-navy hover:bg-gray-50 transition-all font-medium"
              >
                אודות
              </Link>
            </li>
            <li>
              <Link
                href="/blog"
                className="px-4 py-2 rounded-lg text-gray-700 hover:text-navy hover:bg-gray-50 transition-all font-medium"
              >
                בלוג
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t bg-white md:hidden">
          {/* Mobile Search */}
          <div className="px-4 py-4 border-b">
            <div ref={mobileSearchRef} className="relative">
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

              {/* Mobile Search Results */}
              {showResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 max-h-64 overflow-auto rounded-lg border bg-white shadow-xl z-50">
                  {searchResults.map((result) => (
                    <Link
                      key={result.id}
                      href={`/product/${result.slug}`}
                      onClick={handleResultClick}
                      className="flex items-center gap-2 p-2 active:bg-gray-100 hover:bg-gray-50 transition-colors border-b last:border-b-0 cursor-pointer touch-manipulation"
                    >
                      {result.images[0] && (
                        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded bg-gray-100">
                          <Image
                            src={result.images[0].src}
                            alt={result.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0 text-right">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">{result.name}</h3>
                        <p className="text-sm font-bold" style={{color: '#d83e1e'}}>₪{result.price}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Navigation Links */}
          <nav className="py-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-navy transition-colors font-medium"
            >
              דף הבית
            </Link>
            <div className="px-4 py-2">
              <p className="text-xs font-bold text-gray-500 mb-2">קטגוריות מוצרים</p>
            </div>
            {productCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.id}
                  href={category.slug}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-navy transition-colors"
                >
                  <Icon className={`h-5 w-5 ${category.iconColor}`} />
                  <span className="font-medium">{category.name}</span>
                </Link>
              );
            })}
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-navy transition-colors font-medium border-t"
            >
              כל המוצרים
            </Link>
            <Link
              href="/page/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-navy transition-colors font-medium"
            >
              אודות
            </Link>
            <Link
              href="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-navy transition-colors font-medium"
            >
              בלוג
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
