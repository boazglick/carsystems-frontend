import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/lib/woocommerce';

export const dynamic = 'force-dynamic';

// Get WordPress URL
function getWordPressUrl() {
  return process.env.WORDPRESS_URL || process.env.NEXT_PUBLIC_WORDPRESS_URL || '';
}

// Get the frontend URL for redirects
function getFrontendUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://adcars.co.il';
}

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();

    // Add Grow/Meshulam as payment method
    const orderWithPayment = {
      ...orderData,
      payment_method: 'grow-wallet-payment',
      payment_method_title: 'תשלום מאובטח',
      set_paid: false,
    };

    // Create order in WooCommerce
    const order = await createOrder(orderWithPayment);

    if (!order || !order.id) {
      return NextResponse.json({
        success: false,
        error: 'Failed to create order in WooCommerce',
      }, { status: 500 });
    }

    // Call our custom WordPress REST endpoint to get Grow payment URL
    const wpUrl = getWordPressUrl();
    const frontendUrl = getFrontendUrl();

    const growResponse = await fetch(`${wpUrl}/wp-json/grow/v1/create-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order_id: order.id,
        success_url: `${frontendUrl}/order-success?order=${order.id}`,
        cancel_url: `${frontendUrl}/checkout?payment_failed=1&order=${order.id}`,
      }),
    });

    const growData = await growResponse.json();

    if (growData.success && growData.auth_code) {
      // Success - return the Grow authCode for SDK popup
      return NextResponse.json({
        success: true,
        orderId: order.id,
        authCode: growData.auth_code,
        processId: growData.process_id,
        successUrl: growData.success_url,
        cancelUrl: growData.cancel_url,
      });
    }

    // If Grow API failed, return error but still provide order ID
    console.error('Grow API error:', growData);
    return NextResponse.json({
      success: false,
      error: growData.message || 'Failed to create payment session',
      orderId: order.id,
      details: growData.data || null,
    }, { status: 500 });

  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create order',
      },
      { status: 500 }
    );
  }
}
