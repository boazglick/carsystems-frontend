import { NextRequest, NextResponse } from 'next/server';
import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api';

const api = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WP_URL || 'https://adsystems.ussl.info',
  consumerKey: process.env.WC_CONSUMER_KEY || '',
  consumerSecret: process.env.WC_CONSUMER_SECRET || '',
  version: 'wc/v3',
});

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'נא למלא אימייל וסיסמה' },
        { status: 400 }
      );
    }

    // Authenticate with WordPress
    const wpUrl = process.env.NEXT_PUBLIC_WP_URL || 'https://adsystems.ussl.info';
    const authResponse = await fetch(`${wpUrl}/wp-json/wp/v2/users/me`, {
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${email}:${password}`).toString('base64'),
      },
    });

    if (!authResponse.ok) {
      return NextResponse.json(
        { success: false, message: 'אימייל או סיסמה שגויים' },
        { status: 401 }
      );
    }

    const wpUser = await authResponse.json();

    // Get customer data from WooCommerce
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
