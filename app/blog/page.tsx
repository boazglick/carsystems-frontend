import Link from 'next/link';
import { MainLayout } from '@/components/layout/MainLayout';
import { getPosts } from '@/lib/wordpress';
import { Calendar, User, ArrowLeft } from 'lucide-react';

export const revalidate = 60;

export default async function BlogPage() {
  const { posts } = await getPosts(1, 12);

  return (
    <MainLayout>
      {/* Header - Elegant Hero */}
      <section className="bg-white py-20 md:py-28 border-b">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block mb-6">
            <div className="h-1 w-24 bg-gradient-to-r from-navy to-navy-light rounded-full"></div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-navy mb-6 leading-tight">
            בלוג מערכות רכב
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            מאמרים, עדכונים וטיפים על מערכות רכב מתקדמות
          </p>
        </div>
      </section>

      {/* Posts Grid - Modern Cards */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          {posts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-lg">
              <p className="text-gray-600 text-xl">
                אין פוסטים להצגה כרגע
              </p>
            </div>
          ) : (
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
              {posts.map((post) => {
                const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
                const author = post._embedded?.author?.[0]?.name || 'Admin';
                const date = new Date(post.date).toLocaleDateString('he-IL');

                return (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3"
                  >
                    {/* Featured Image */}
                    {featuredImage && (
                      <div className="relative h-72 overflow-hidden">
                        <img
                          src={featuredImage}
                          alt={post.title.rendered}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-8">
                      {/* Meta - Above Title */}
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-navy/60" />
                          <span>{date}</span>
                        </div>
                        <div className="h-1 w-1 rounded-full bg-gray-400"></div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-navy/60" />
                          <span>{author}</span>
                        </div>
                      </div>

                      <h2
                        className="text-2xl font-bold text-navy mb-4 group-hover:text-navy-light transition-colors leading-tight"
                        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                      />

                      <div
                        className="text-gray-600 mb-6 line-clamp-3 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                      />

                      {/* Read More - Elegant Button */}
                      <div className="flex items-center gap-2 text-navy font-semibold group-hover:gap-4 transition-all">
                        <span>קרא עוד</span>
                        <ArrowLeft className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}
