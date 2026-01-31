import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const url = process.env.WORDPRESS_URL || process.env.NEXT_PUBLIC_WORDPRESS_URL;
    const key = process.env.WC_CONSUMER_KEY || process.env.NEXT_PUBLIC_WC_CONSUMER_KEY;
    const secret = process.env.WC_CONSUMER_SECRET || process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET;

    if (!url || !key || !secret) {
      return NextResponse.json({
        error: 'API not configured',
        debug: { hasUrl: !!url, hasKey: !!key, hasSecret: !!secret }
      }, { status: 500 });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page') || '1';
    const perPage = searchParams.get('per_page') || '12';
    const orderby = searchParams.get('orderby') || 'date';
    const order = searchParams.get('order') || 'desc';
    const onSale = searchParams.get('on_sale');
    const search = searchParams.get('search');
    const category = searchParams.get('category');

    let apiUrl = `${url}/wp-json/wc/v3/products?consumer_key=${key}&consumer_secret=${secret}&page=${page}&per_page=${perPage}&orderby=${orderby}&order=${order}`;

    if (onSale === 'true') apiUrl += '&on_sale=true';
    if (search) apiUrl += `&search=${encodeURIComponent(search)}`;
    if (category) apiUrl += `&category=${category}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: 'WooCommerce API error', details: data }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      products: data,
      total: parseInt(response.headers.get('x-wp-total') || '0'),
      totalPages: parseInt(response.headers.get('x-wp-totalpages') || '1'),
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch products', message: error.message }, { status: 500 });
  }
}
