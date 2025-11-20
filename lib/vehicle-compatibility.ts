/**
 * Vehicle Compatibility Utilities
 * Handles filtering products based on vehicle compatibility data
 */

export interface VehicleCompatibilityPattern {
  brand?: string;
  model?: string;
  year_from?: number;
  year_to?: number;
  fuel?: string;
}

/**
 * Parse vehicle compatibility string from API
 * Format: "brand:toyota,model:corolla,year:2015-2025,fuel:petrol"
 */
export function parseCompatibilityPattern(pattern: string): VehicleCompatibilityPattern {
  if (pattern === 'universal') {
    return {};
  }

  const result: VehicleCompatibilityPattern = {};
  const parts = pattern.split(',');

  parts.forEach(part => {
    const [key, value] = part.split(':');
    if (key === 'brand') {
      result.brand = value;
    } else if (key === 'model') {
      result.model = value;
    } else if (key === 'year') {
      if (value.includes('-')) {
        const [from, to] = value.split('-');
        result.year_from = parseInt(from);
        result.year_to = parseInt(to);
      } else {
        result.year_from = parseInt(value);
        result.year_to = parseInt(value);
      }
    } else if (key === 'fuel') {
      result.fuel = value;
    }
  });

  return result;
}

/**
 * Check if a product is compatible with a vehicle
 */
export function isProductCompatible(
  product: any,
  vehicle: { brand: string; model?: string; year?: number; fuel?: string }
): boolean {
  // Universal fit products are always compatible
  if (product.universal_fit) {
    return true;
  }

  // No compatibility patterns = not compatible
  if (!product.vehicle_compatibility || product.vehicle_compatibility.length === 0) {
    return false;
  }

  // Check if any pattern matches
  return product.vehicle_compatibility.some((patternStr: string) => {
    if (patternStr === 'universal') {
      return true;
    }

    const pattern = parseCompatibilityPattern(patternStr);

    // Brand must match if specified
    if (pattern.brand && pattern.brand !== vehicle.brand) {
      return false;
    }

    // Model must match if both are specified
    if (pattern.model && vehicle.model && pattern.model !== vehicle.model) {
      return false;
    }

    // Year must be in range if specified
    if (vehicle.year) {
      if (pattern.year_from && vehicle.year < pattern.year_from) {
        return false;
      }
      if (pattern.year_to && vehicle.year > pattern.year_to) {
        return false;
      }
    }

    // Fuel type must match if both are specified
    if (pattern.fuel && vehicle.fuel && pattern.fuel !== vehicle.fuel) {
      return false;
    }

    return true;
  });
}

/**
 * Filter products by brand
 * Returns products that are compatible with the specified brand
 */
export function filterProductsByBrand(products: any[], brand: string): any[] {
  return products.filter(product => {
    // Universal fit products are always included
    if (product.universal_fit) {
      return true;
    }

    // Check if any compatibility pattern includes this brand
    if (!product.vehicle_compatibility || product.vehicle_compatibility.length === 0) {
      return false;
    }

    return product.vehicle_compatibility.some((patternStr: string) => {
      if (patternStr === 'universal') {
        return true;
      }

      const pattern = parseCompatibilityPattern(patternStr);
      return pattern.brand === brand;
    });
  });
}

/**
 * Filter products by vehicle (brand, model, year)
 */
export function filterProductsByVehicle(
  products: any[],
  vehicle: { brand: string; model?: string; year?: number; fuel?: string }
): any[] {
  return products.filter(product => isProductCompatible(product, vehicle));
}

/**
 * Get all brands that have compatible products
 */
export function getAvailableBrands(products: any[]): string[] {
  const brands = new Set<string>();

  products.forEach(product => {
    if (product.vehicle_compatibility) {
      product.vehicle_compatibility.forEach((patternStr: string) => {
        if (patternStr !== 'universal') {
          const pattern = parseCompatibilityPattern(patternStr);
          if (pattern.brand) {
            brands.add(pattern.brand);
          }
        }
      });
    }
  });

  return Array.from(brands);
}
