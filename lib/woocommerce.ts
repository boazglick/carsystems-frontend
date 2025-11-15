import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

// Initialize WooCommerce API
const api = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WORDPRESS_URL || '',
  consumerKey: process.env.NEXT_PUBLIC_WC_CONSUMER_KEY || '',
  consumerSecret: process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET || '',
  version: "wc/v3",
  queryStringAuth: true, // Force Basic Authentication as query string
});

export default api;

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
}) {
  try {
    const response = await api.get("products", params);
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
    const response = await api.get(`products/${id}`);
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
    const response = await api.get("products", { slug });
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
  hide_empty?: boolean;
}) {
  try {
    const response = await api.get("products/categories", params);
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
    const response = await api.post("orders", orderData);
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
    const response = await api.get(`orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching order ${orderId}:`, error);
    throw error;
  }
}
