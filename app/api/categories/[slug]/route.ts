import { NextRequest, NextResponse } from 'next/server';
import { getProducts, getCategories } from '@/lib/woocommerce';

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { slug } = await context.params;
    const searchParams = request.nextUrl.searchParams;

    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('per_page') || '12');
    const orderby = searchParams.get('orderby') || 'date';
    const order = searchParams.get('order') || 'desc';
    const onSale = searchParams.get('on_sale') === 'true';
    const search = searchParams.get('search') || '';

    // First, get the category by slug to find its ID
    const allCategories = await getCategories({ per_page: 100 });
    const category = allCategories.find((cat: any) => cat.slug === slug);

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Fetch products for this category
    const params: any = {
      page,
      per_page: perPage,
      orderby,
      order,
      category: category.id.toString(),
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
      category: category,
      total: result.total,
      totalPages: result.totalPages,
    });
  } catch (error) {
    console.error('Category API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category products' },
      { status: 500 }
    );
  }
}
