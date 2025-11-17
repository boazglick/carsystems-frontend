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

    // Generate Grow payment URL
    // The WordPress gateway will process this when customer is redirected
    const wpBaseUrl = process.env.NEXT_PUBLIC_WP_URL || 'https://adsystems.ussl.info';
    const checkoutUrl = `${wpBaseUrl}/checkout/order-pay/${order.id}/?pay_for_order=true&key=${order.order_key}`;

    return NextResponse.json({
      success: true,
      orderId: order.id,
      paymentUrl: checkoutUrl, // WordPress checkout page will trigger Grow gateway
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
