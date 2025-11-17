import { NextRequest, NextResponse } from 'next/server';
import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api';

const api = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WP_URL || 'https://adsystems.ussl.info',
  consumerKey: process.env.WC_CONSUMER_KEY || '',
  consumerSecret: process.env.WC_CONSUMER_SECRET || '',
  version: 'wc/v3',
});

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const credentials = Buffer.from(token, 'base64').toString('utf-8');
    const [email] = credentials.split(':');

    // Get customer ID
    const { data: customers } = await api.get('customers', {
      email: email,
    });

    if (!customers || customers.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Customer not found' },
        { status: 404 }
      );
    }

    const customerId = customers[0].id;

    // Get customer orders
    const { data: orders } = await api.get('orders', {
      customer: customerId,
      per_page: 100,
      orderby: 'date',
      order: 'desc',
    });

    return NextResponse.json({
      success: true,
      orders: orders,
    });
  } catch (error: any) {
    console.error('Orders fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
