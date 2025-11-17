import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/lib/woocommerce';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();

    // Add Grow as payment method
    const orderWithPayment = {
      ...orderData,
      payment_method: 'grow',
      payment_method_title: 'Grow Payment Gateway',
      set_paid: false,
    };

    // Create order in WooCommerce
    const order = await createOrder(orderWithPayment);

    // Process payment via custom Grow API endpoint (headless)
    const wpBaseUrl = process.env.NEXT_PUBLIC_WP_URL || 'https://adsystems.ussl.info';

    const paymentResponse = await fetch(`${wpBaseUrl}/wp-json/grow/v1/process-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order_id: order.id,
      }),
    });

    const paymentResult = await paymentResponse.json();

    if (!paymentResponse.ok || !paymentResult.success) {
      // Payment processing failed
      return NextResponse.json({
        success: false,
        error: paymentResult.message || paymentResult.code || 'Failed to process payment',
        orderId: order.id,
      });
    }

    // Return Grow payment URL (customer will be redirected directly to Grow)
    return NextResponse.json({
      success: true,
      orderId: order.id,
      paymentUrl: paymentResult.payment_url, // Direct Grow payment URL
    });
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
