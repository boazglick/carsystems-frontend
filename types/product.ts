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
  vehicle_compatibility?: string[]; // API compatibility patterns
  universal_fit?: boolean; // Universal fit flag from API
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
  // First check API fields (new way)
  if (product.vehicle_compatibility && product.vehicle_compatibility.length > 0) {
    return product.vehicle_compatibility;
  }

  // Read from meta_data (where the data actually exists)
  const meta = getProductMeta(product);

  // If universal fit, return empty array (compatible with all)
  if (meta._universal_fit === 'yes') {
    return [];
  }

  // Parse compatibility from meta - it's an array of objects like [{"brand": "mazda"}]
  if (meta._vehicle_compatibility) {
    try {
      // If it's already an array of objects, convert to patterns
      let compatibilityData = meta._vehicle_compatibility;

      // If it's a JSON string, parse it first
      if (typeof compatibilityData === 'string') {
        compatibilityData = JSON.parse(compatibilityData);
      }

      // Convert array of objects to pattern strings
      if (Array.isArray(compatibilityData)) {
        return compatibilityData.map(item => {
          const parts: string[] = [];

          if (item.brand) parts.push(`brand:${item.brand}`);
          if (item.model) parts.push(`model:${item.model}`);
          if (item.year_from && item.year_to) {
            parts.push(`year:${item.year_from}-${item.year_to}`);
          } else if (item.year_from) {
            parts.push(`year:${item.year_from}`);
          }
          if (item.fuel) parts.push(`fuel:${item.fuel}`);

          return parts.join(',');
        }).filter(pattern => pattern.length > 0);
      }

      return [];
    } catch (e) {
      console.error('Failed to parse vehicle compatibility', e);
      return [];
    }
  }

  return [];
}

// Check if product is universal fit
export function isUniversalFit(product: WooCommerceProduct): boolean {
  // First check API field (new way)
  if (product.universal_fit !== undefined) {
    return product.universal_fit;
  }

  // Fallback to meta_data (legacy)
  const meta = getProductMeta(product);
  return meta._universal_fit === 'yes';
}
