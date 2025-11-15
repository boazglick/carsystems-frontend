export interface WooCommerceImage {
  id: number;
  src: string;
  name: string;
  alt: string;
}

export interface WooCommerceCategory {
  id: number;
  name: string;
  slug: string;
}

export interface ProductMeta {
  _enable_monthly_payment?: string;
  _monthly_payment_months?: string;
  _free_shipping?: string;
  _vehicle_compatibility?: string; // JSON string of compatible vehicles
  _universal_fit?: string; // "yes" or "no"
}

export interface WooCommerceProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  type: string;
  status: string;
  featured: boolean;
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  purchasable: boolean;
  total_sales: number;
  stock_status: 'instock' | 'outofstock' | 'onbackorder';
  stock_quantity: number | null;
  categories: WooCommerceCategory[];
  images: WooCommerceImage[];
  attributes: any[];
  meta_data: Array<{ key: string; value: any }>;
  _links?: any;
}

export interface CartItem {
  product: WooCommerceProduct;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

// Helper function to get custom meta data from product
export function getProductMeta(product: WooCommerceProduct): ProductMeta {
  const meta: ProductMeta = {};

  product.meta_data?.forEach((item) => {
    if (item.key === '_enable_monthly_payment') {
      meta._enable_monthly_payment = item.value;
    }
    if (item.key === '_monthly_payment_months') {
      meta._monthly_payment_months = item.value;
    }
    if (item.key === '_free_shipping') {
      meta._free_shipping = item.value;
    }
    if (item.key === '_vehicle_compatibility') {
      meta._vehicle_compatibility = item.value;
    }
    if (item.key === '_universal_fit') {
      meta._universal_fit = item.value;
    }
  });

  return meta;
}

// Calculate discount percentage
export function calculateDiscount(regularPrice: string, salePrice: string): number {
  const regular = parseFloat(regularPrice);
  const sale = parseFloat(salePrice);

  if (!regular || !sale || regular <= sale) return 0;

  return Math.round(((regular - sale) / regular) * 100);
}

// Calculate monthly payment
export function calculateMonthlyPayment(price: string, months: number = 12): string {
  const priceNum = parseFloat(price);
  if (!priceNum || months <= 0) return '0';

  return (priceNum / months).toFixed(2);
}

// Check if product has free shipping
export function hasFreeShipping(product: WooCommerceProduct): boolean {
  const meta = getProductMeta(product);
  const price = parseFloat(product.price);

  // Free shipping if meta is set OR price > 500
  return meta._free_shipping === 'yes' || price > 500;
}

// Get vehicle compatibility from product
export function getVehicleCompatibility(product: WooCommerceProduct): string[] {
  const meta = getProductMeta(product);

  // If universal fit, return empty array (compatible with all)
  if (meta._universal_fit === 'yes') {
    return [];
  }

  // Parse compatibility JSON
  if (meta._vehicle_compatibility) {
    try {
      return JSON.parse(meta._vehicle_compatibility);
    } catch (e) {
      console.error('Failed to parse vehicle compatibility', e);
      return [];
    }
  }

  return [];
}

// Check if product is universal fit
export function isUniversalFit(product: WooCommerceProduct): boolean {
  const meta = getProductMeta(product);
  return meta._universal_fit === 'yes';
}
