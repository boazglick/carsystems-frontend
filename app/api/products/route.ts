import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/lib/woocommerce';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('per_page') || '12');
    const orderby = searchParams.get('orderby') || 'date';
    const order = searchParams.get('order') || 'desc';
    const onSale = searchParams.get('on_sale') === 'true';
    const search = searchParams.get('search') || '';

    const params: any = {
      page,
      per_page: perPage,
      orderby,
      order,
    };

    if (onSale) {
      params.on_sale = true;
    }

    if (search) {
      params.search = search;
    }

    const result = await getProducts(params);

    return NextResponse.json({
      products: result.products,
      total: result.total,
      totalPages: result.totalPages,
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
