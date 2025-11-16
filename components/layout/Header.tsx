'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Menu, X } from 'lucide-react';
import { CartIcon } from './CartIcon';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
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
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
              <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="חפש מוצרים..."
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pr-10 text-right text-gray-900 placeholder:text-gray-500 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
              />
            </form>
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
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="חפש מוצרים..."
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pr-10 text-right text-sm text-gray-900 placeholder:text-gray-500 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
          />
        </form>
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
