import { MainLayout } from '@/components/layout/MainLayout';
import { Shield, Lock, Eye, Database } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <MainLayout>
      {/* Header */}
      <section className="bg-gradient-to-b from-navy/5 to-white py-16">
        <div className="container mx-auto px-4 text-center">
          <Shield className="h-16 w-16 text-navy mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-navy mb-4">
            מדיניות פרטיות
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            כיצד אנו אוספים, משתמשים ושומרים על המידע שלך
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg max-w-none">

            <div className="bg-navy/5 rounded-xl p-6 mb-8">
              <p className="text-gray-700 m-0">
                <strong>עדכון אחרון:</strong> ינואר 2025
              </p>
            </div>

            <h2 className="text-2xl font-bold text-navy mt-8 mb-4 flex items-center gap-3">
              <Database className="h-6 w-6" />
              מידע שאנו אוספים
            </h2>

            <p className="text-gray-700 leading-relaxed mb-4">
              במהלך השימוש באתר ובעת ביצוע רכישות, אנו אוספים את המידע הבא:
            </p>

            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-3">
                <span className="text-navy">•</span>
                <span><strong>פרטים אישיים:</strong> שם מלא, כתובת דוא"ל, מספר טלפון</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-navy">•</span>
                <span><strong>פרטי משלוח:</strong> כתובת למשלוח, עיר, מיקוד</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-navy">•</span>
                <span><strong>פרטי רכב:</strong> יצרן, דגם ושנת ייצור (לצורך התאמת מוצרים)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-navy">•</span>
                <span><strong>פרטי תשלום:</strong> מעובדים באופן מאובטח דרך ספק התשלומים שלנו ואינם נשמרים במערכות שלנו</span>
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-navy mt-8 mb-4 flex items-center gap-3">
              <Eye className="h-6 w-6" />
              כיצד אנו משתמשים במידע
            </h2>

            <p className="text-gray-700 leading-relaxed mb-4">
              המידע שנאסף משמש אותנו למטרות הבאות:
            </p>

            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-3">
                <span className="text-navy">•</span>
                <span>עיבוד וביצוע הזמנות</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-navy">•</span>
                <span>משלוח מוצרים לכתובת שצוינה</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-navy">•</span>
                <span>יצירת קשר בנוגע להזמנות או שאלות</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-navy">•</span>
                <span>שיפור השירות והמוצרים שלנו</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-navy">•</span>
                <span>שליחת עדכונים ומבצעים (בהסכמתך בלבד)</span>
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-navy mt-8 mb-4 flex items-center gap-3">
              <Lock className="h-6 w-6" />
              אבטחת המידע
            </h2>

            <p className="text-gray-700 leading-relaxed mb-4">
              אנו נוקטים באמצעי אבטחה מתקדמים להגנה על המידע שלך:
            </p>

            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-3">
                <span className="text-navy">•</span>
                <span>הצפנת SSL לכל התקשורת באתר</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-navy">•</span>
                <span>אחסון מאובטח של מידע בשרתים מוגנים</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-navy">•</span>
                <span>גישה מוגבלת למידע רגיש לעובדים מורשים בלבד</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-navy">•</span>
                <span>עיבוד תשלומים מאובטח דרך ספקי תשלום מוסמכים העומדים בתקן PCI-DSS</span>
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-navy mt-8 mb-4">
              שמירת המידע
            </h2>

            <p className="text-gray-700 leading-relaxed mb-4">
              המידע שלך נשמר במערכות שלנו כל עוד חשבונך פעיל או כנדרש לצורך מתן שירות.
              אנו שומרים מידע הנדרש לעמידה בדרישות חוקיות, יישוב מחלוקות ואכיפת ההסכמים שלנו.
            </p>

            <h2 className="text-2xl font-bold text-navy mt-8 mb-4">
              שיתוף מידע עם צדדים שלישיים
            </h2>

            <p className="text-gray-700 leading-relaxed mb-4">
              איננו מוכרים, סוחרים או מעבירים את המידע האישי שלך לצדדים חיצוניים, למעט במקרים הבאים:
            </p>

            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-3">
                <span className="text-navy">•</span>
                <span>ספקי שירות הפועלים מטעמנו (חברות משלוחים, ספקי תשלום)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-navy">•</span>
                <span>כנדרש על פי חוק או צו בית משפט</span>
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-navy mt-8 mb-4">
              הזכויות שלך
            </h2>

            <p className="text-gray-700 leading-relaxed mb-4">
              יש לך את הזכות:
            </p>

            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-3">
                <span className="text-navy">•</span>
                <span>לבקש גישה למידע האישי שלך</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-navy">•</span>
                <span>לבקש תיקון מידע שגוי</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-navy">•</span>
                <span>לבקש מחיקת המידע שלך</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-navy">•</span>
                <span>להסיר את עצמך מרשימת התפוצה שלנו בכל עת</span>
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-navy mt-8 mb-4">
              עוגיות (Cookies)
            </h2>

            <p className="text-gray-700 leading-relaxed mb-4">
              האתר משתמש בעוגיות לשיפור חווית הגלישה, שמירת העדפות ולצורכי ניתוח סטטיסטי.
              תוכל לשנות את הגדרות העוגיות בדפדפן שלך בכל עת.
            </p>

            <h2 className="text-2xl font-bold text-navy mt-8 mb-4">
              יצירת קשר
            </h2>

            <p className="text-gray-700 leading-relaxed mb-6">
              לכל שאלה בנוגע למדיניות הפרטיות שלנו, ניתן לפנות אלינו:
            </p>

            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-gray-700 mb-2">
                <strong>דוא"ל:</strong> privacy@carsystemspro.co.il
              </p>
              <p className="text-gray-700 mb-2">
                <strong>טלפון:</strong> 03-1234567
              </p>
              <p className="text-gray-700">
                <strong>כתובת:</strong> רחוב הרכב 1, תל אביב
              </p>
            </div>

          </div>
        </div>
      </section>
    </MainLayout>
  );
}
