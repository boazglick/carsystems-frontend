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

    const { email, password, firstName, lastName, phone } = userData;

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { success: false, message: 'נא למלא את כל השדות הנדרשים' },
        { status: 400 }
      );
    }

    const api = getWooCommerceApi();

    // Create customer in WooCommerce
    const customerData = {
      email: email,
      first_name: firstName,
      last_name: lastName,
      username: email.split('@')[0],
      billing: {
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone: phone || '',
      },
      shipping: {
        first_name: firstName,
        last_name: lastName,
      },
    };

    const { data: customer } = await api.post('customers', customerData);

    // Set password via WordPress REST API
    const wpUrl = process.env.NEXT_PUBLIC_WP_URL || 'https://adsystems.ussl.info';
    await fetch(`${wpUrl}/wp-json/wp/v2/users/${customer.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(
          `${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`
        ).toString('base64'),
      },
      body: JSON.stringify({
        password: password,
      }),
    });

    // Create session token
    const token = Buffer.from(`${email}:${password}`).toString('base64');

    return NextResponse.json({
      success: true,
      customer: customer,
      token: token,
    });
  } catch (error: any) {
    console.error('Registration error:', error);

    let message = 'שגיאה ברישום';
    if (error.response?.data?.message) {
      if (error.response.data.message.includes('email')) {
        message = 'כתובת אימייל כבר קיימת במערכת';
      }
    }

    return NextResponse.json(
      { success: false, message: message },
      { status: 500 }
    );
  }
}
