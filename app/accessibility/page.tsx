import { MainLayout } from '@/components/layout/MainLayout';
import { Accessibility, Eye, Keyboard, Monitor, Phone, Mail } from 'lucide-react';

export default function AccessibilityPage() {
  return (
    <MainLayout>
      {/* Header */}
      <section className="bg-white py-16 border-b">
        <div className="container mx-auto px-4 text-center">
          <Accessibility className="h-16 w-16 text-navy mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-navy mb-4">
            הצהרת נגישות
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            אנו מחויבים להנגיש את האתר לכלל האוכלוסייה
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg max-w-none">

            <div className="bg-navy/5 rounded-xl p-6 mb-8">
              <p className="text-gray-700 m-0">
                <strong>עדכון אחרון:</strong> ינואר 2025
              </p>
            </div>

            <h2 className="text-2xl font-bold text-navy mt-8 mb-4">
              מחויבות לנגישות
            </h2>

            <p className="text-gray-700 leading-relaxed mb-6">
              A.D שירותי רכב מחויבת להנגיש את אתר האינטרנט שלה לאנשים עם מוגבלויות.
              אנו משקיעים מאמצים רבים על מנת לוודא שהאתר יהיה נגיש לכל המשתמשים,
              ללא קשר ליכולותיהם או לטכנולוגיה שבה הם משתמשים.
            </p>

            <h2 className="text-2xl font-bold text-navy mt-8 mb-4 flex items-center gap-3">
              <Monitor className="h-6 w-6" />
              תקני נגישות
            </h2>

            <p className="text-gray-700 leading-relaxed mb-4">
              אנו שואפים לעמוד בתקני הנגישות הבאים:
            </p>

            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-3">
                <span className="text-navy">•</span>
                <span>תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע"ג-2013</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-navy">•</span>
                <span>תקן ישראלי 5568 לנגישות תכנים באינטרנט</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-navy">•</span>
                <span>הנחיות WCAG 2.1 ברמה AA</span>
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-navy mt-8 mb-4 flex items-center gap-3">
              <Eye className="h-6 w-6" />
              התאמות נגישות באתר
            </h2>

            <p className="text-gray-700 leading-relaxed mb-4">
              האתר שלנו כולל את ההתאמות הבאות:
            </p>

            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-3">
                <span className="text-navy">•</span>
                <span>ניגודיות צבעים גבוהה בין טקסט לרקע</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-navy">•</span>
                <span>תמיכה בהגדלת גופן על ידי הדפדפן</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-navy">•</span>
                <span>מבנה ברור ועקבי בכל הדפים</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-navy">•</span>
                <span>תיאורי טקסט חלופי לתמונות</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-navy">•</span>
                <span>תמיכה בקוראי מסך</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-navy">•</span>
                <span>טפסים עם תוויות ברורות</span>
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-navy mt-8 mb-4 flex items-center gap-3">
              <Keyboard className="h-6 w-6" />
              ניווט באמצעות מקלדת
            </h2>

            <p className="text-gray-700 leading-relaxed mb-4">
              ניתן לנווט באתר באמצעות מקלדת:
            </p>

            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-3">
                <span className="text-navy">•</span>
                <span><strong>Tab:</strong> מעבר בין אלמנטים אינטראקטיביים</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-navy">•</span>
                <span><strong>Enter:</strong> הפעלת קישורים וכפתורים</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-navy">•</span>
                <span><strong>חיצים:</strong> ניווט בתפריטים</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-navy">•</span>
                <span><strong>Escape:</strong> סגירת חלונות קופצים</span>
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-navy mt-8 mb-4">
              דיווח על בעיות נגישות
            </h2>

            <p className="text-gray-700 leading-relaxed mb-6">
              אנו משתדלים לשפר את הנגישות באתר באופן מתמיד.
              אם נתקלתם בבעיית נגישות או שיש לכם הצעות לשיפור,
              נשמח לשמוע מכם.
            </p>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-navy mb-4">יצירת קשר בנושאי נגישות</h3>
              <div className="space-y-3">
                <p className="flex items-center gap-3 text-gray-700">
                  <Phone className="h-5 w-5 text-navy" />
                  <span><strong>טלפון:</strong> 03-1234567</span>
                </p>
                <p className="flex items-center gap-3 text-gray-700">
                  <Mail className="h-5 w-5 text-navy" />
                  <span><strong>דוא"ל:</strong> accessibility@carsystemspro.co.il</span>
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </MainLayout>
  );
}
