import { MainLayout } from '@/components/layout/MainLayout';
import { Shield, Wrench, Award, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <MainLayout>
      {/* Header */}
      <section className="bg-gradient-to-b from-navy/5 to-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-navy mb-4">
            אודות Car Systems Pro
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            המומחים למערכות רכב מתקדמות בישראל
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              <strong>Car Systems Pro</strong> הינה חברה מובילה בתחום מערכות רכב מתקדמות,
              המתמחה במכירה והתקנה של מערכות בטיחות, מולטימדיה, ניווט וחיישנים לכלי רכב.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              אנו פועלים כבר למעלה מ-15 שנים בשוק הישראלי ומציעים ללקוחותינו את הטכנולוגיות
              המתקדמות ביותר בתחום. הצוות המקצועי שלנו מורכב מטכנאים מוסמכים בעלי ניסיון רב
              בהתקנה ותחזוקה של מערכות רכב.
            </p>

            <h2 className="text-3xl font-bold text-navy mt-12 mb-6">המומחיות שלנו</h2>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <span className="text-navy text-lg">•</span>
                <span>מערכות בטיחות מתקדמות - התראות התנגשות, אזעקת נקודה עיוורת, חיישני חניה</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-navy text-lg">•</span>
                <span>מערכות מולטימדיה - מסכי מגע, Apple CarPlay, Android Auto</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-navy text-lg">•</span>
                <span>מערכות ניווט GPS - ניווט מתקדם עם מפות ישראל מעודכנות</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-navy text-lg">•</span>
                <span>מצלמות דרך ורוורס - רזולוציה גבוהה, ראיית לילה, זווית רחבה</span>
              </li>
            </ul>

            <h2 className="text-3xl font-bold text-navy mt-12 mb-6">מדוע לבחור בנו?</h2>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-navy/5 rounded-xl p-6">
                <Shield className="h-12 w-12 text-navy mb-4" />
                <h3 className="text-xl font-bold text-navy mb-2">מוצרים איכותיים</h3>
                <p className="text-gray-700">
                  אנו עובדים רק עם יצרנים מובילים ומציעים מוצרים עם אחריות מלאה
                </p>
              </div>

              <div className="bg-navy/5 rounded-xl p-6">
                <Wrench className="h-12 w-12 text-navy mb-4" />
                <h3 className="text-xl font-bold text-navy mb-2">התקנה מקצועית</h3>
                <p className="text-gray-700">
                  צוות טכנאים מוסמכים עם ניסיון של מעל 15 שנה
                </p>
              </div>

              <div className="bg-navy/5 rounded-xl p-6">
                <Award className="h-12 w-12 text-navy mb-4" />
                <h3 className="text-xl font-bold text-navy mb-2">שירות לקוחות מעולה</h3>
                <p className="text-gray-700">
                  תמיכה וייעוץ 24/7 לכל שאלה או בעיה
                </p>
              </div>

              <div className="bg-navy/5 rounded-xl p-6">
                <Users className="h-12 w-12 text-navy mb-4" />
                <h3 className="text-xl font-bold text-navy mb-2">לקוחות מרוצים</h3>
                <p className="text-gray-700">
                  מעל 5,000 לקוחות מרוצים ברחבי הארץ
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-navy mt-12 mb-6">הערכים שלנו</h2>

            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>איכות:</strong> אנו מתחייבים לספק רק את המוצרים האיכותיים ביותר בשוק
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>מקצועיות:</strong> הטכנאים שלנו עוברים הכשרות מתמשכות ומעודכנים בטכנולוגיות האחרונות
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>שירות:</strong> שביעות רצון הלקוח היא העדיפות העליונה שלנו
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>אמינות:</strong> אנו עומדים מאחורי המוצרים והשירותים שלנו עם אחריות מלאה
            </p>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
