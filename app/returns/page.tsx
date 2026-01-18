import { MainLayout } from '@/components/layout/MainLayout';
import { RotateCcw, AlertTriangle, FileText, Clock } from 'lucide-react';

export default function ReturnsPage() {
  return (
    <MainLayout>
      {/* Header */}
      <section className="bg-gradient-to-b from-navy/5 to-white py-16">
        <div className="container mx-auto px-4 text-center">
          <RotateCcw className="h-16 w-16 text-navy mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-navy mb-4">
            מדיניות ביטולים והחזרות
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            תנאי ביטול עסקה והחזרת מוצרים
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg max-w-none">

            {/* Cancellation Policy - Consumer Protection Law */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-bold text-green-800 mt-0 mb-4 flex items-center gap-3">
                <FileText className="h-6 w-6" />
                זכות ביטול עסקה על פי חוק
              </h2>
              <p className="text-green-900 m-0">
                בהתאם לחוק הגנת הצרכן, התשמ"א-1981, הינך רשאי/ת לבטל עסקה תוך <strong>14 ימים</strong> מיום
                קבלת המוצר או מיום קבלת מסמך הגילוי (המאוחר מביניהם), ללא צורך בנימוק.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-navy mt-8 mb-4 flex items-center gap-3">
              <Clock className="h-6 w-6" />
              תנאי ביטול עסקה
            </h2>

            <h3 className="text-xl font-semibold text-navy mt-6 mb-3">ביטול לפני משלוח:</h3>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-3">
                <span className="text-navy">•</span>
                <span>ניתן לבטל הזמנה ללא עלות לפני שליחת המשלוח</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-navy">•</span>
                <span>ההחזר יתבצע באותה שיטת תשלום בה בוצעה העסקה</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-navy">•</span>
                <span>ההחזר יבוצע תוך 14 ימי עסקים</span>
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-navy mt-6 mb-3">ביטול לאחר קבלת המוצר:</h3>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-3">
                <span className="text-navy">•</span>
                <span>ניתן לבטל תוך 14 ימים מיום קבלת המוצר</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-navy">•</span>
                <span>המוצר חייב להיות באריזתו המקורית ובמצב חדש, ללא שימוש</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-navy">•</span>
                <span>יש להחזיר את המוצר עם כל האביזרים והתיעוד שנלוו אליו</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-navy">•</span>
                <span>דמי ביטול: עד 5% ממחיר המוצר או 100 ש"ח, הנמוך מביניהם, בהתאם לחוק</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-navy">•</span>
                <span>עלות משלוח ההחזרה חלה על הלקוח, אלא אם המוצר התקבל פגום</span>
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-navy mt-6 mb-3">מוצרים שלא ניתן להחזיר:</h3>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-3">
                <span className="text-navy">•</span>
                <span>מוצרים שהותקנו ברכב</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-navy">•</span>
                <span>מוצרים שנפגמו עקב שימוש לא נכון</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-navy">•</span>
                <span>מוצרים שיוצרו או הותאמו במיוחד עבור הלקוח</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-navy">•</span>
                <span>מוצרים שאריזתם המקורית נפתחה ואינם ניתנים למכירה חוזרת</span>
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-navy mt-8 mb-4">
              אחריות על מוצרים
            </h2>

            <p className="text-gray-700 leading-relaxed mb-4">
              כל המוצרים באתר מגיעים עם אחריות יצרן. תקופת האחריות משתנה בהתאם למוצר ומצוינת בדף המוצר.
              האחריות מכסה פגמים בייצור ותקלות שאינן נובעות משימוש לא נכון.
            </p>

            {/* Business Liability Disclaimer */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 my-8">
              <h2 className="text-xl font-bold text-amber-800 mt-0 mb-4 flex items-center gap-3">
                <AlertTriangle className="h-6 w-6" />
                הגבלת אחריות
              </h2>
              <p className="text-amber-900 mb-4">
                החברה ו/או מי מטעמה לא יהיו אחראים לנזק ישיר ו/או עקיף שייגרם כתוצאה משימוש בשירות
                ו/או שימוש במוצר שנרכש באתר, לרבות אך לא רק:
              </p>
              <ul className="space-y-2 text-amber-900">
                <li className="flex items-start gap-3">
                  <span>•</span>
                  <span>נזקים הנובעים מהתקנה שלא על ידי גורם מוסמך</span>
                </li>
                <li className="flex items-start gap-3">
                  <span>•</span>
                  <span>נזקים הנובעים משימוש שלא בהתאם להוראות היצרן</span>
                </li>
                <li className="flex items-start gap-3">
                  <span>•</span>
                  <span>נזקים עקיפים כגון אובדן רווחים או הפסד עסקי</span>
                </li>
                <li className="flex items-start gap-3">
                  <span>•</span>
                  <span>נזקים שנגרמו כתוצאה מתקלות בצדדים שלישיים</span>
                </li>
              </ul>
              <p className="text-amber-900 mt-4 mb-0">
                מומלץ לבצע התקנת מוצרים על ידי טכנאי מוסמך בלבד.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-navy mt-8 mb-4">
              כיצד לבטל עסקה
            </h2>

            <p className="text-gray-700 leading-relaxed mb-4">
              לביטול עסקה, יש לפנות אלינו באחת מהדרכים הבאות:
            </p>

            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <p className="text-gray-700 mb-2">
                <strong>דוא"ל:</strong> returns@carsystemspro.co.il
              </p>
              <p className="text-gray-700 mb-2">
                <strong>טלפון:</strong> 03-1234567
              </p>
              <p className="text-gray-700 mb-2">
                <strong>וואטסאפ:</strong> 050-1234567
              </p>
              <p className="text-gray-700">
                יש לציין את מספר ההזמנה ואת סיבת הביטול
              </p>
            </div>

            <h2 className="text-2xl font-bold text-navy mt-8 mb-4">
              החזר כספי
            </h2>

            <p className="text-gray-700 leading-relaxed mb-4">
              לאחר אישור הביטול וקבלת המוצר חזרה (במידה ונשלח), ההחזר הכספי יבוצע תוך 14 ימי עסקים
              לאמצעי התשלום המקורי.
            </p>

            <p className="text-gray-700 leading-relaxed">
              במקרה של תשלום בכרטיס אשראי, ההחזר יופיע בחיוב הקרוב או הבא, בהתאם למועד הסליקה של חברת האשראי.
            </p>

          </div>
        </div>
      </section>
    </MainLayout>
  );
}
