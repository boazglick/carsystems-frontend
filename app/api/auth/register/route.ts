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

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json();

    // Use custom WordPress registration endpoint (supports passwords)
    const wpUrl = process.env.NEXT_PUBLIC_WP_URL || 'https://adsystems.ussl.info';

    const response = await fetch(`${wpUrl}/wp-json/custom/v1/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || data.code || 'שגיאה ברישום'
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Registration error:', error);

    return NextResponse.json(
      { success: false, message: 'שגיאה ברישום. אנא נסה שוב.' },
      { status: 500 }
    );
  }
}
