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

export async function PUT(request: NextRequest) {
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

    const api = getWooCommerceApi();

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
    const updateData = await request.json();

    // Update customer
    const { data: updatedCustomer } = await api.put(`customers/${customerId}`, updateData);

    return NextResponse.json({
      success: true,
      customer: updatedCustomer,
      message: 'הפרטים עודכנו בהצלחה',
    });
  } catch (error: any) {
    console.error('Customer update error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update customer' },
      { status: 500 }
    );
  }
}
