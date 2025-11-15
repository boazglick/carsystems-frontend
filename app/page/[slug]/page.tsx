import { MainLayout } from '@/components/layout/MainLayout';
import { getPageBySlug } from '@/lib/wordpress';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 3600; // Cache for 1 hour

export default async function WordPressPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <MainLayout>
      {/* Breadcrumbs */}
      <div className="bg-white py-4 border-b">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-navy hover:underline font-medium">
              דף הבית
            </Link>
            <span className="text-gray-400">→</span>
            <span className="text-gray-700" dangerouslySetInnerHTML={{ __html: page.title.rendered }} />
          </div>
        </div>
      </div>

      {/* Page Header - Elegant Hero */}
      <section className="bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="py-16 md:py-24 text-center">
            <div className="inline-block mb-6">
              <div className="h-1 w-24 bg-gradient-to-r from-navy to-navy-light rounded-full"></div>
            </div>
            <h1
              className="text-4xl md:text-6xl font-bold text-navy mb-6 leading-tight max-w-4xl mx-auto"
              dangerouslySetInnerHTML={{ __html: page.title.rendered }}
            />
          </div>
        </div>
      </section>

      {/* Page Content - Modern Layout */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div
            className="wp-content bg-white p-8 md:p-16 rounded-3xl shadow-lg"
            dangerouslySetInnerHTML={{ __html: page.content.rendered }}
          />
        </div>
      </section>
    </MainLayout>
  );
}

// Generate static params for all pages (optional - for better performance)
export async function generateStaticParams() {
  // You can fetch a list of pages here if needed
  // For now, return empty array for dynamic rendering
  return [];
}
