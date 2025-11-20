import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/lib/woocommerce';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();

    // Add Yaad Sarig as payment method
    const orderWithPayment = {
      ...orderData,
      payment_method: 'yaadpay',
      payment_method_title: 'Yaad Sarig Payment Gateway',
      set_paid: false,
    };

    // Create order in WooCommerce
    const order = await createOrder(orderWithPayment);

    // Process payment via custom Yaad API endpoint (headless)
    const wpBaseUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://adsystems.ussl.info';

    const paymentResponse = await fetch(`${wpBaseUrl}/wp-json/yaad/v1/process-payment`, {
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

    // Return Yaad payment URL (customer will be redirected directly to Yaad)
    return NextResponse.json({
      success: true,
      orderId: order.id,
      paymentUrl: paymentResult.payment_url,
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
