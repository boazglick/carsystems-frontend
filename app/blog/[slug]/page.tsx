import { MainLayout } from '@/components/layout/MainLayout';
import { getPostBySlug } from '@/lib/wordpress';
import { Calendar, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  const author = post._embedded?.author?.[0]?.name || 'Admin';
  const date = new Date(post.date).toLocaleDateString('he-IL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <MainLayout>
      {/* Breadcrumbs */}
      <div className="bg-white py-4 border-b">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-navy hover:underline font-medium">
              דף הבית
            </Link>
            <span className="text-gray-400">→</span>
            <Link href="/blog" className="text-navy hover:underline font-medium">
              בלוג
            </Link>
            <span className="text-gray-400">→</span>
            <span className="text-gray-700" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
          </div>
        </div>
      </div>

      {/* Post Header - Elegant Hero */}
      <article className="bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Title Section */}
          <div className="py-12 md:py-16 text-center">
            <h1
              className="text-4xl md:text-6xl font-bold text-navy mb-6 leading-tight"
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />

            {/* Meta Info - Elegant Style */}
            <div className="flex items-center justify-center gap-6 text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-navy/60" />
                <span className="text-sm font-medium">{date}</span>
              </div>
              <div className="h-1 w-1 rounded-full bg-gray-400"></div>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-navy/60" />
                <span className="text-sm font-medium">{author}</span>
              </div>
            </div>
          </div>

          {/* Featured Image - Full Width */}
          {featuredImage && (
            <div className="mb-12 rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={featuredImage}
                alt={post.title.rendered}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {/* Content - Clean Typography */}
          <div className="pb-16">
            <div
              className="wp-content bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100"
              dangerouslySetInnerHTML={{ __html: post.content.rendered }}
            />
          </div>

          {/* Back to Blog - Elegant CTA */}
          <div className="pb-16">
            <div className="bg-gradient-to-br from-navy/5 to-navy/10 rounded-2xl p-8 text-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-navy hover:text-navy-light font-semibold text-lg transition-colors"
              >
                <ArrowRight className="h-6 w-6" />
                <span>חזרה לבלוג</span>
              </Link>
            </div>
          </div>
        </div>
      </article>
    </MainLayout>
  );
}
