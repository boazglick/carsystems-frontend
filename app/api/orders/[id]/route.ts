import { NextRequest, NextResponse } from 'next/server';
import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api';

function getWooCommerceApi() {
  if (!process.env.WC_CONSUMER_KEY || !process.env.WC_CONSUMER_SECRET) {
    throw new Error('WooCommerce API credentials not configured');
  }

  return new WooCommerceRestApi({
    url: process.env.NEXT_PUBLIC_WP_URL || 'https://adsystems.ussl.info',
    consumerKey: process.env.WC_CONSUMER_KEY,
    consumerSecret: process.env.WC_CONSUMER_SECRET,
    version: 'wc/v3',
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id: orderId } = await params;

    const api = getWooCommerceApi();

    // Get order details
    const { data: order } = await api.get(`orders/${orderId}`);

    return NextResponse.json({
      success: true,
      order: order,
    });
  } catch (error: any) {
    console.error('Order fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}
