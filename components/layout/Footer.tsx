import Link from 'next/link';
import { Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Company Info */}
          <div>
            <h3 className="mb-4 text-lg font-bold">AD Systems</h3>
            <p className="mb-4 text-sm text-gray-300">
              מערכות רכב מתקדמות - הפתרון המושלם לרכב שלך
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-gray-300 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-gray-300 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-bold">קישורים מהירים</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="text-gray-300 hover:text-white transition-colors">
                  כל המוצרים
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-white transition-colors">
                  בלוג
                </Link>
              </li>
              <li>
                <Link href="/page/about" className="text-gray-300 hover:text-white transition-colors">
                  אודות
                </Link>
              </li>
              <li>
                <Link href="/page/contact" className="text-gray-300 hover:text-white transition-colors">
                  צור קשר
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-4 text-lg font-bold">קטגוריות</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/categories/safety" className="text-gray-300 hover:text-white transition-colors">
                  מערכות בטיחות
                </Link>
              </li>
              <li>
                <Link href="/categories/multimedia" className="text-gray-300 hover:text-white transition-colors">
                  מולטימדיה
                </Link>
              </li>
              <li>
                <Link href="/categories/gps" className="text-gray-300 hover:text-white transition-colors">
                  GPS ונווטים
                </Link>
              </li>
              <li>
                <Link href="/categories/cameras" className="text-gray-300 hover:text-white transition-colors">
                  מצלמות רכב
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-lg font-bold">צור קשר</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-gray-300">
                <Phone className="h-4 w-4" />
                <span>03-1234567</span>
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Mail className="h-4 w-4" />
                <span>info@adsystems.co.il</span>
              </li>
              <li className="flex items-start gap-2 text-gray-300">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>תל אביב, ישראל</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-navy-light pt-8">
          <div className="flex flex-wrap justify-center gap-4 mb-4 text-sm">
            <Link href="/page/shipping" className="text-gray-300 hover:text-white transition-colors">
              משלוחים
            </Link>
            <span className="text-gray-600">|</span>
            <Link href="/page/returns" className="text-gray-300 hover:text-white transition-colors">
              החזרות
            </Link>
            <span className="text-gray-600">|</span>
            <Link href="/page/privacy" className="text-gray-300 hover:text-white transition-colors">
              מדיניות פרטיות
            </Link>
            <span className="text-gray-600">|</span>
            <Link href="/page/accessibility" className="text-gray-300 hover:text-white transition-colors">
              הצהרת נגישות
            </Link>
          </div>
          <p className="text-center text-sm text-gray-300">
            &copy; {new Date().getFullYear()} AD Systems. כל הזכויות שמורות.
          </p>
        </div>
      </div>
    </footer>
  );
}
