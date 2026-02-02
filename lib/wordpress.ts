/**
 * WordPress REST API Integration
 * For fetching pages, posts, and other WordPress content
 */

const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL
  ? `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json`
  : '';

export interface WordPressPage {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  slug: string;
  status: string;
  link: string;
  acf?: any; // ACF fields if using Advanced Custom Fields
}

export interface WordPressPost {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  slug: string;
  date: string;
  featured_media: number;
  categories: number[];
  _embedded?: any;
}

/**
 * Fetch WordPress page by slug
 */
export async function getPageBySlug(slug: string): Promise<WordPressPage | null> {
  try {
    const response = await fetch(`${WORDPRESS_API_URL}/wp/v2/pages?slug=${slug}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error('Failed to fetch page');
    }

    const data = await response.json();
    return data[0] || null;
  } catch (error) {
    console.error(`Error fetching page ${slug}:`, error);
    return null;
  }
}

/**
 * Fetch multiple WordPress pages
 */
export async function getPages(perPage: number = 10): Promise<WordPressPage[]> {
  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}/wp/v2/pages?per_page=${perPage}`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch pages');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching pages:', error);
    return [];
  }
}

/**
 * Fetch WordPress posts (blog)
 */
export async function getPosts(
  page: number = 1,
  perPage: number = 10
): Promise<{ posts: WordPressPost[]; total: number; totalPages: number }> {
  try {
    // Use custom endpoint that bypasses security restrictions
    const response = await fetch(
      `${WORDPRESS_API_URL}/grow/v1/posts?page=${page}&per_page=${perPage}`,
      { next: { revalidate: 60 } } // Cache for 1 minute
    );

    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }

    const data = await response.json();
    return {
      posts: data.posts || [],
      total: data.total || 0,
      totalPages: data.totalPages || 1
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { posts: [], total: 0, totalPages: 0 };
  }
}

/**
 * Fetch single post by slug
 */
export async function getPostBySlug(slug: string): Promise<WordPressPost | null> {
  try {
    // Use custom endpoint that bypasses security restrictions
    const response = await fetch(
      `${WORDPRESS_API_URL}/grow/v1/posts/${encodeURIComponent(slug)}`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Failed to fetch post');
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching post ${slug}:`, error);
    return null;
  }
}

/**
 * Fetch navigation menu
 */
export async function getMenu(menuId: string = 'primary') {
  try {
    // Note: Requires WP REST API Menu plugin or custom endpoint
    const response = await fetch(
      `${WORDPRESS_API_URL}/menus/v1/menus/${menuId}`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching menu ${menuId}:`, error);
    return null;
  }
}
