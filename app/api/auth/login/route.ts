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
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'נא למלא אימייל וסיסמה' },
        { status: 400 }
      );
    }

    // Authenticate with custom WordPress endpoint
    const wpUrl = process.env.NEXT_PUBLIC_WP_URL || 'https://adsystems.ussl.info';
    const authResponse = await fetch(`${wpUrl}/wp-json/custom/v1/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!authResponse.ok) {
      const errorData = await authResponse.json();
      return NextResponse.json(
        { success: false, message: errorData.message || 'אימייל או סיסמה שגויים' },
        { status: 401 }
      );
    }

    const authData = await authResponse.json();
    const wpUser = authData.user;

    // Get customer data from WooCommerce
    const api = getWooCommerceApi();
    const { data: customers } = await api.get('customers', {
      email: email,
    });

    if (!customers || customers.length === 0) {
      return NextResponse.json(
        { success: false, message: 'לקוח לא נמצא' },
        { status: 404 }
      );
    }

    const customer = customers[0];

    // Create session token (simple base64 encoded credentials for now)
    const token = Buffer.from(`${email}:${password}`).toString('base64');

    return NextResponse.json({
      success: true,
      customer: customer,
      token: token,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'שגיאה בהתחברות' },
      { status: 500 }
    );
  }
}
