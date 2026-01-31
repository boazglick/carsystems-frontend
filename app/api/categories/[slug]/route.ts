import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function getCredentials() {
  const url = process.env.WORDPRESS_URL || process.env.NEXT_PUBLIC_WORDPRESS_URL;
  const key = process.env.WC_CONSUMER_KEY || process.env.NEXT_PUBLIC_WC_CONSUMER_KEY;
  const secret = process.env.WC_CONSUMER_SECRET || process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET;
  return { url, key, secret };
}

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { url, key, secret } = getCredentials();
    if (!url || !key || !secret) {
      return NextResponse.json({ error: 'API not configured' }, { status: 500 });
    }

    const { slug } = await context.params;
    const searchParams = request.nextUrl.searchParams;

    const page = searchParams.get('page') || '1';
    const perPage = searchParams.get('per_page') || '12';
    const orderby = searchParams.get('orderby') || 'date';
    const order = searchParams.get('order') || 'desc';
    const onSale = searchParams.get('on_sale');
    const search = searchParams.get('search');

    // Search for the specific category by slug
    const catResponse = await fetch(
      `${url}/wp-json/wc/v3/products/categories?slug=${slug}&consumer_key=${key}&consumer_secret=${secret}`
    );

    if (!catResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }

    const categories = await catResponse.json();
    const category = categories[0];

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Fetch products for this category
    let prodUrl = `${url}/wp-json/wc/v3/products?consumer_key=${key}&consumer_secret=${secret}&page=${page}&per_page=${perPage}&orderby=${orderby}&order=${order}&category=${category.id}`;

    if (onSale === 'true') prodUrl += '&on_sale=true';
    if (search) prodUrl += `&search=${encodeURIComponent(search)}`;

    const prodResponse = await fetch(prodUrl);

    if (!prodResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }

    const products = await prodResponse.json();

    return NextResponse.json({
      products,
      category,
      total: parseInt(prodResponse.headers.get('x-wp-total') || '0'),
      totalPages: parseInt(prodResponse.headers.get('x-wp-totalpages') || '1'),
    });
  } catch (error) {
    console.error('Category API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch category products' }, { status: 500 });
  }
}
