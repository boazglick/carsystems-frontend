import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/lib/woocommerce';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();

    // Create order in WooCommerce
    const order = await createOrder(orderData);

    // TODO: Integrate with Grow Payment Gateway
    // For now, we'll just create the order in WooCommerce
    // Later, you'll need to:
    // 1. Create a payment request with Grow API
    // 2. Get the payment URL from Grow
    // 3. Return it to the frontend

    /*
    Example Grow Integration (when you have credentials):

    const growPayment = await fetch('https://api.grow.co.il/payment', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROW_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: process.env.GROW_USER_ID,
        pageCode: process.env.GROW_PAGE_CODE,
        amount: order.total,
        orderId: order.id,
        currency: 'ILS',
        callbackUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payment-callback`,
        successUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/order-success?order=${order.id}`,
        failureUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/order-failed?order=${order.id}`,
        customer: {
          firstName: orderData.billing.first_name,
          lastName: orderData.billing.last_name,
          email: orderData.billing.email,
          phone: orderData.billing.phone,
        },
      }),
    });

    const growResponse = await growPayment.json();

    return NextResponse.json({
      success: true,
      orderId: order.id,
      paymentUrl: growResponse.paymentUrl,
    });
    */

    // For now, without Grow integration:
    return NextResponse.json({
      success: true,
      orderId: order.id,
      order: order,
      // When Grow is integrated, add: paymentUrl: growResponse.paymentUrl
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
