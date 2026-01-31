import { MainLayout } from '@/components/layout/MainLayout';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8 md:p-12">
            <h1 className="text-3xl font-bold text-navy mb-8 text-center">תקנון האתר ותנאי שימוש</h1>

            <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
              <section>
                <h2 className="text-xl font-bold text-navy mb-4">1. כללי</h2>
                <p>
                  ברוכים הבאים לאתר A.D שירותי רכב (להלן: "האתר"). האתר מופעל על ידי A.D שירותי רכב
                  (להלן: "החברה"). השימוש באתר ובשירותים המוצעים בו כפוף לתנאי השימוש המפורטים להלן.
                </p>
                <p>
                  בעצם השימוש באתר, הנך מאשר כי קראת והבנת את תנאי השימוש ואתה מסכים להם במלואם.
                  אם אינך מסכים לתנאים אלה, אנא הימנע משימוש באתר.
                </p>
              </section>

              <section className="bg-red/5 border border-red/20 rounded-lg p-6">
                <h2 className="text-xl font-bold text-red mb-4">2. הגבלת גיל - תנאי מוקדם לרכישה</h2>
                <p className="font-semibold">
                  תנאי מוקדם לביצוע רכישה באתר הוא שהרוכש הינו בן 18 שנים ומעלה.
                </p>
                <ul className="list-disc pr-6 space-y-2 mt-4">
                  <li>ביצוע רכישה באתר מהווה הצהרה כי הרוכש בגיר (מעל גיל 18).</li>
                  <li>רכישה באמצעות כרטיס אשראי מותרת אך ורק למי שמלאו לו 18 שנים.</li>
                  <li>החברה רשאית לדרוש אימות גיל בכל שלב של תהליך הרכישה או האספקה.</li>
                  <li>במקרה של רכישה על ידי קטין, העסקה תבוטל והחברה לא תהיה אחראית לכל נזק שייגרם.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-navy mb-4">3. הזמנות ורכישות</h2>
                <ul className="list-disc pr-6 space-y-2">
                  <li>כל המחירים באתר מוצגים בשקלים חדשים וכוללים מע"מ.</li>
                  <li>החברה שומרת לעצמה את הזכות לשנות מחירים בכל עת ללא הודעה מוקדמת.</li>
                  <li>הזמנה תיחשב כמושלמת רק לאחר קבלת אישור תשלום מלא.</li>
                  <li>החברה רשאית לבטל הזמנה במקרה של טעות במחיר או אי זמינות מוצר.</li>
                  <li>במקרה של ביטול הזמנה על ידי החברה, יוחזר ללקוח מלוא סכום התשלום.</li>
                </ul>
              </section>

              <section className="bg-navy/5 border border-navy/20 rounded-lg p-6">
                <h2 className="text-xl font-bold text-navy mb-4">4. מדיניות אספקת המוצר/שירות</h2>
                <p className="mb-4">להלן פירוט מדיניות האספקה של החברה:</p>

                <h3 className="font-bold text-gray-900 mt-4 mb-2">זמני אספקה:</h3>
                <ul className="list-disc pr-6 space-y-2">
                  <li>המוצרים יישלחו תוך 1-3 ימי עסקים ממועד אישור התשלום.</li>
                  <li>זמן האספקה המשוער הוא 3-7 ימי עסקים מרגע המשלוח, בהתאם לאזור המגורים.</li>
                  <li>באזורים מרוחקים או ביישובים קטנים, זמן האספקה עשוי להתארך ב-2-3 ימי עסקים נוספים.</li>
                </ul>

                <h3 className="font-bold text-gray-900 mt-4 mb-2">אופן המשלוח:</h3>
                <ul className="list-disc pr-6 space-y-2">
                  <li>המשלוחים מבוצעים באמצעות חברות שליחויות מובילות בישראל.</li>
                  <li>ניתן לבחור באיסוף עצמי מהכתובת: איתן 30, ניר צבי (בתיאום מראש).</li>
                  <li>הלקוח יקבל מספר מעקב למשלוח באמצעות SMS או אימייל.</li>
                </ul>

                <h3 className="font-bold text-gray-900 mt-4 mb-2">תנאי אספקה:</h3>
                <ul className="list-disc pr-6 space-y-2">
                  <li>המשלוח יימסר לכתובת שצוינה בהזמנה בלבד.</li>
                  <li>באחריות הלקוח לוודא שהכתובת למשלוח נכונה ומלאה.</li>
                  <li>במקרה של אי קבלת משלוח עקב כתובת שגויה, הלקוח יישא בעלות משלוח חוזר.</li>
                  <li>החברה אינה אחראית לעיכובים הנובעים מגורמים שאינם בשליטתה (מזג אוויר, שביתות וכו').</li>
                </ul>
              </section>

              <section className="bg-green/5 border border-green/20 rounded-lg p-6">
                <h2 className="text-xl font-bold text-navy mb-4">5. תנאים לביטול עסקה</h2>
                <p className="mb-4">בהתאם לחוק הגנת הצרכן, התשמ"א-1981:</p>

                <h3 className="font-bold text-gray-900 mt-4 mb-2">זכות הביטול:</h3>
                <ul className="list-disc pr-6 space-y-2">
                  <li><strong>ניתן לבטל עסקה תוך 14 ימים</strong> מיום קבלת המוצר או מיום קבלת מסמך הגילוי (המאוחר מביניהם).</li>
                  <li>הביטול יתבצע באמצעות פנייה בכתב לשירות הלקוחות בטלפון 052-272-9996 או באימייל info@adcars.co.il.</li>
                </ul>

                <h3 className="font-bold text-gray-900 mt-4 mb-2">תנאים להחזרת המוצר:</h3>
                <ul className="list-disc pr-6 space-y-2">
                  <li>המוצר יוחזר באריזתו המקורית, ללא פגם ומבלי שנעשה בו שימוש.</li>
                  <li>יש לצרף את חשבונית הקנייה המקורית.</li>
                  <li>מוצרים שהותקנו או נעשה בהם שימוש לא יתקבלו להחזרה.</li>
                </ul>

                <h3 className="font-bold text-gray-900 mt-4 mb-2">דמי ביטול:</h3>
                <ul className="list-disc pr-6 space-y-2">
                  <li>בביטול עסקה שלא עקב פגם במוצר - ייגבו דמי ביטול בשיעור של 5% ממחיר המוצר או 100 ש"ח, הנמוך מביניהם.</li>
                  <li>דמי משלוח ההחזרה יחולו על הלקוח.</li>
                  <li>בביטול עקב פגם במוצר או אי התאמה להזמנה - לא ייגבו דמי ביטול והחברה תישא בעלות המשלוח.</li>
                </ul>

                <h3 className="font-bold text-gray-900 mt-4 mb-2">החזר כספי:</h3>
                <ul className="list-disc pr-6 space-y-2">
                  <li>ההחזר הכספי יבוצע תוך 14 ימי עסקים מקבלת המוצר המוחזר.</li>
                  <li>ההחזר יבוצע באותו אמצעי התשלום בו בוצעה הרכישה.</li>
                </ul>

                <h3 className="font-bold text-gray-900 mt-4 mb-2">מוצרים שלא ניתן לבטל:</h3>
                <ul className="list-disc pr-6 space-y-2">
                  <li>מוצרים שיוצרו במיוחד עבור הלקוח.</li>
                  <li>מוצרים שהותאמו אישית לרכב הלקוח.</li>
                  <li>מוצרים פסידים או שפג תוקפם.</li>
                </ul>
              </section>

              <section className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <h2 className="text-xl font-bold text-navy mb-4">6. הגבלת אחריות בית העסק</h2>
                <p className="mb-4 font-semibold">
                  החברה ו/או מי מטעמה לא יהיו אחראים לנזק ישיר ו/או עקיף שייגרם כתוצאה משימוש בשירות ו/או שימוש במוצר שנרכש באתר, לרבות אך לא רק:
                </p>
                <ul className="list-disc pr-6 space-y-2">
                  <li>נזקים שנגרמו כתוצאה מהתקנה לא מקצועית או שלא בהתאם להוראות היצרן.</li>
                  <li>נזקים שנגרמו כתוצאה משימוש לא נכון או לא סביר במוצר.</li>
                  <li>נזקים שנגרמו כתוצאה מאי התאמת המוצר לרכב הלקוח (באחריות הלקוח לוודא התאמה לפני הרכישה).</li>
                  <li>נזקים עקיפים, לרבות אובדן רווחים, אובדן מידע או נזק תוצאתי אחר.</li>
                  <li>נזקים שנגרמו כתוצאה מתקלות או שיבושים בפעילות האתר.</li>
                  <li>נזקים שנגרמו כתוצאה מפעולות צד שלישי.</li>
                </ul>
                <p className="mt-4">
                  בכל מקרה, אחריות החברה לא תעלה על מחיר המוצר שנרכש.
                </p>
                <p className="mt-2">
                  האמור לעיל לא יגרע מכל זכות המוקנית לצרכן על פי חוק הגנת הצרכן ו/או כל דין אחר.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-navy mb-4">7. אחריות על המוצרים</h2>
                <ul className="list-disc pr-6 space-y-2">
                  <li>המוצרים באתר נמכרים עם אחריות יצרן בהתאם לתנאי היצרן.</li>
                  <li>תקופת האחריות משתנה בין המוצרים ומפורטת בדף המוצר.</li>
                  <li>האחריות אינה מכסה נזקים שנגרמו כתוצאה משימוש לא נכון או התקנה לא מקצועית.</li>
                  <li>לצורך מימוש האחריות יש לשמור את חשבונית הקנייה.</li>
                  <li>מימוש האחריות יתבצע באמצעות פנייה לשירות הלקוחות.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-navy mb-4">8. התקנה</h2>
                <ul className="list-disc pr-6 space-y-2">
                  <li>חלק מהמוצרים דורשים התקנה מקצועית.</li>
                  <li>התקנה לא מקצועית עלולה לפגוע במוצר ולבטל את האחריות.</li>
                  <li>החברה מציעה שירותי התקנה מקצועיים בתיאום מראש.</li>
                  <li>באחריות הלקוח לוודא שההתקנה מבוצעת על ידי גורם מוסמך.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-navy mb-4">9. פרטיות ואבטחת מידע</h2>
                <p>
                  החברה מתחייבת לשמור על פרטיות המשתמשים ולא להעביר מידע אישי לצדדים שלישיים,
                  למעט לצורך ביצוע ההזמנה והמשלוח. לפרטים נוספים, ראה את{' '}
                  <Link href="/privacy" className="text-navy hover:underline">מדיניות הפרטיות</Link> שלנו.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-navy mb-4">10. קניין רוחני</h2>
                <p>
                  כל התכנים באתר, לרבות תמונות, טקסטים, עיצוב וסימני מסחר, הם רכוש החברה או
                  בעלי הזכויות בהם. אין להעתיק, להפיץ או לעשות שימוש מסחרי בתכנים ללא אישור מראש ובכתב.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-navy mb-4">11. שינויים בתקנון</h2>
                <p>
                  החברה שומרת לעצמה את הזכות לעדכן ולשנות תקנון זה מעת לעת. השינויים ייכנסו
                  לתוקף מרגע פרסומם באתר. מומלץ לעיין בתקנון מדי פעם.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-navy mb-4">12. סמכות שיפוט</h2>
                <p>
                  על תקנון זה יחולו דיני מדינת ישראל בלבד. סמכות השיפוט הבלעדית בכל עניין הנוגע
                  לתקנון זה ולשימוש באתר תהיה לבתי המשפט המוסמכים במחוז המרכז בישראל.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-navy mb-4">13. יצירת קשר</h2>
                <p>לכל שאלה או בירור בנוגע לתקנון או לשירותי החברה ניתן לפנות אלינו:</p>
                <ul className="list-none space-y-2 mt-4">
                  <li><strong>טלפון:</strong> <a href="tel:052-272-9996" className="text-navy hover:underline">052-272-9996</a></li>
                  <li><strong>אימייל:</strong> <a href="mailto:info@adcars.co.il" className="text-navy hover:underline">info@adcars.co.il</a></li>
                  <li><strong>כתובת:</strong> איתן 30, ניר צבי</li>
                </ul>
              </section>

              <section className="border-t pt-6 mt-8">
                <p className="text-sm text-gray-500 text-center">
                  תקנון זה עודכן לאחרונה בתאריך: ינואר 2026
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
