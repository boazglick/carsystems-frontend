import Link from 'next/link';
import { Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Company Info */}
          <div>
            <h3 className="mb-4 text-lg font-bold">A.D שירותי רכב</h3>
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
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
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
                <Link href="/categories/multimedia" className="text-gray-300 hover:text-white transition-colors">
                  מערכות מולטימדיה
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
                <a href="tel:052-272-9996" className="hover:text-white transition-colors">052-272-9996</a>
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Mail className="h-4 w-4" />
                <a href="mailto:info@adcars.co.il" className="hover:text-white transition-colors">info@adcars.co.il</a>
              </li>
              <li className="flex items-start gap-2 text-gray-300">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>איתן 30, ניר צבי</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-navy-light pt-8">
          <div className="flex flex-wrap justify-center gap-4 mb-4 text-sm">
            <Link href="/shipping" className="text-gray-300 hover:text-white transition-colors">
              משלוחים
            </Link>
            <span className="text-gray-600">|</span>
            <Link href="/returns" className="text-gray-300 hover:text-white transition-colors">
              החזרות וביטולים
            </Link>
            <span className="text-gray-600">|</span>
            <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">
              מדיניות פרטיות
            </Link>
            <span className="text-gray-600">|</span>
            <Link href="/terms" className="text-gray-300 hover:text-white transition-colors">
              תקנון האתר
            </Link>
            <span className="text-gray-600">|</span>
            <Link href="/accessibility" className="text-gray-300 hover:text-white transition-colors">
              הצהרת נגישות
            </Link>
          </div>
          <p className="text-center text-sm text-gray-300">
            &copy; {new Date().getFullYear()} A.D שירותי רכב. כל הזכויות שמורות.
          </p>
        </div>
      </div>
    </footer>
  );
}
