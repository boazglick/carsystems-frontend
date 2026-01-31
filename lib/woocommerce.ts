// WooCommerce API using native fetch
function getCredentials() {
  const url = process.env.WORDPRESS_URL || process.env.NEXT_PUBLIC_WORDPRESS_URL;
  const consumerKey = process.env.WC_CONSUMER_KEY || process.env.NEXT_PUBLIC_WC_CONSUMER_KEY;
  const consumerSecret = process.env.WC_CONSUMER_SECRET || process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET;

  if (!url || !consumerKey || !consumerSecret) {
    throw new Error('WooCommerce API credentials not configured');
  }

  return { url, consumerKey, consumerSecret };
}

async function wcFetch(endpoint: string, params?: Record<string, any>) {
  const { url, consumerKey, consumerSecret } = getCredentials();

  const searchParams = new URLSearchParams({
    consumer_key: consumerKey,
    consumer_secret: consumerSecret,
    ...params,
  });

  const response = await fetch(`${url}/wp-json/wc/v3/${endpoint}?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error(`WooCommerce API error: ${response.status}`);
  }

  return {
    data: await response.json(),
    headers: {
      'x-wp-total': response.headers.get('x-wp-total'),
      'x-wp-totalpages': response.headers.get('x-wp-totalpages'),
    },
  };
}

async function wcPost(endpoint: string, data: any) {
  const { url, consumerKey, consumerSecret } = getCredentials();

  const response = await fetch(`${url}/wp-json/wc/v3/${endpoint}?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`WooCommerce API error: ${response.status}`);
  }

  return {
    data: await response.json(),
  };
}

/**
 * Fetch all products
 */
export async function getProducts(params?: {
  per_page?: number;
  page?: number;
  category?: string;
  search?: string;
  on_sale?: boolean;
  featured?: boolean;
  orderby?: string;
  order?: string;
}) {
  try {
    const queryParams: Record<string, string> = {};
    if (params?.per_page) queryParams.per_page = String(params.per_page);
    if (params?.page) queryParams.page = String(params.page);
    if (params?.category) queryParams.category = params.category;
    if (params?.search) queryParams.search = params.search;
    if (params?.on_sale) queryParams.on_sale = 'true';
    if (params?.featured) queryParams.featured = 'true';
    if (params?.orderby) queryParams.orderby = params.orderby;
    if (params?.order) queryParams.order = params.order;

    const response = await wcFetch('products', queryParams);

    return {
      products: response.data,
      total: parseInt(response.headers['x-wp-total'] || '0'),
      totalPages: parseInt(response.headers['x-wp-totalpages'] || '1'),
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

/**
 * Fetch single product by ID
 */
export async function getProduct(id: number) {
  try {
    const response = await wcFetch(`products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
}

/**
 * Fetch single product by slug
 */
export async function getProductBySlug(slug: string) {
  try {
    const response = await wcFetch('products', { slug });
    return response.data[0] || null;
  } catch (error) {
    console.error(`Error fetching product by slug ${slug}:`, error);
    throw error;
  }
}

/**
 * Fetch product categories
 */
export async function getCategories(params?: {
  per_page?: number;
  page?: number;
  hide_empty?: boolean;
}) {
  try {
    const queryParams: Record<string, string> = {};
    if (params?.per_page) queryParams.per_page = String(params.per_page);
    if (params?.page) queryParams.page = String(params.page);
    if (params?.hide_empty) queryParams.hide_empty = 'true';

    const response = await wcFetch('products/categories', queryParams);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

/**
 * Create an order
 */
export async function createOrder(orderData: any) {
  try {
    const response = await wcPost('orders', orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

/**
 * Get order by ID
 */
export async function getOrder(orderId: number) {
  try {
    const response = await wcFetch(`orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching order ${orderId}:`, error);
    throw error;
  }
}

// Default export for backwards compatibility
export default { getProducts, getProduct, getProductBySlug, getCategories, createOrder, getOrder };
