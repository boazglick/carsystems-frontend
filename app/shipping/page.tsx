import { MainLayout } from '@/components/layout/MainLayout';
import { Truck, Package, Clock, MapPin } from 'lucide-react';

export default function ShippingPage() {
  return (
    <MainLayout>
      <section className="bg-gradient-to-b from-navy/5 to-white py-16">
        <div className="container mx-auto px-4 text-center">
          <Truck className="h-16 w-16 text-navy mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-navy mb-4">
            משלוחים
          </h1>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-navy mb-6">מדיניות משלוחים</h2>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-green/5 rounded-xl p-6 border-2 border-green/20">
                <Package className="h-10 w-10 text-green mb-4" />
                <h3 className="text-xl font-bold text-navy mb-2">משלוח חינם</h3>
                <p className="text-gray-700">
                  משלוח חינם על כל הזמנה מעל ₪1,000 לכל הארץ
                </p>
              </div>

              <div className="bg-navy/5 rounded-xl p-6 border-2 border-navy/20">
                <Clock className="h-10 w-10 text-navy mb-4" />
                <h3 className="text-xl font-bold text-navy mb-2">זמן אספקה</h3>
                <p className="text-gray-700">
                  2-3 ימי עסקים לכל הארץ
                </p>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-navy mt-12 mb-4">עלויות משלוח</h3>
            <ul className="space-y-3">
              <li><strong>הזמנות מעל ₪1,000:</strong> משלוח חינם</li>
              <li><strong>הזמנות מתחת ל-₪1,000:</strong> ₪30 דמי משלוח</li>
              <li><strong>איסוף עצמי:</strong> ללא עלות (בתיאום מראש)</li>
            </ul>

            <h3 className="text-2xl font-bold text-navy mt-12 mb-4">אזורי חלוקה</h3>
            <p>אנו משלחים לכל רחבי ישראל, כולל:</p>
            <ul className="space-y-2">
              <li>מרכז הארץ - תל אביב, גוש דן, השרון</li>
              <li>צפון - חיפה, קריות, נצרת, טבריה</li>
              <li>דרום - באר שבע, אשדוד, אשקלון</li>
              <li>ירושלים והסביבה</li>
            </ul>

            <h3 className="text-2xl font-bold text-navy mt-12 mb-4">מעקב אחר משלוח</h3>
            <p>
              לאחר שליחת ההזמנה, תקבלו מייל עם מספר מעקב המאפשר לעקוב אחר חבילתכם בזמן אמת.
            </p>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
