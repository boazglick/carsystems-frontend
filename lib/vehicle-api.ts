// Vehicle API Service - Israeli License Plate Lookup

import { Vehicle } from '@/types/vehicle';

/**
 * Map Hebrew brand names to English IDs
 */
function mapBrandToId(hebrewBrand: string): string {
  // Normalize: remove country suffixes and extra spaces
  let normalized = hebrewBrand.trim();

  // Remove common suffixes from government database
  normalized = normalized.replace(/-יפן$/, '');  // Remove "-Japan"
  normalized = normalized.replace(/-קוריאה$/, ''); // Remove "-Korea"
  normalized = normalized.replace(/-גרמניה$/, ''); // Remove "-Germany"
  normalized = normalized.replace(/-צרפת$/, '');  // Remove "-France"
  normalized = normalized.replace(/-ארה"ב$/, ''); // Remove "-USA"
  normalized = normalized.replace(/-איטליה$/, ''); // Remove "-Italy"
  normalized = normalized.replace(/-בריטניה$/, ''); // Remove "-Britain"
  normalized = normalized.trim();

  const brandMap: Record<string, string> = {
    'טויוטה': 'toyota',
    'יונדאי': 'hyundai',
    'קיה': 'kia',
    'מאזדה': 'mazda',
    'סקודה': 'skoda',
    'פולקסווגן': 'volkswagen',
    'מרצדס': 'mercedes',
    'ב מ וו': 'bmw',
    'אאודי': 'audi',
    'פיג\'ו': 'peugeot',
    'סיטרואן': 'citroen',
    'רנו': 'renault',
    'ניסאן': 'nissan',
    'מיצובישי': 'mitsubishi',
    'סוזוקי': 'suzuki',
    'הונדה': 'honda',
    'פורד': 'ford',
    'שברולט': 'chevrolet',
    'מיני': 'mini',
    'סובארו': 'subaru',
  };

  return brandMap[normalized] || normalized.toLowerCase().replace(/\s+/g, '-');
}

/**
 * Map Hebrew model names to English IDs
 */
function mapModelToId(hebrewModel: string, brand: string): string {
  // Common model mappings per brand
  const modelMaps: Record<string, Record<string, string>> = {
    'toyota': {
      'קורולה': 'corolla',
      'יאריס': 'yaris',
      'rav4': 'rav4',
      'קאמרי': 'camry',
      'אוריס': 'auris',
      'היילקס': 'hilux',
    },
    'hyundai': {
      'i30': 'i30',
      'i20': 'i20',
      'טוסון': 'tucson',
      'סנטה פה': 'santa-fe',
      'קונה': 'kona',
    },
    'kia': {
      'פיקנטו': 'picanto',
      'ריו': 'rio',
      'ספורטאז\'': 'sportage',
      'סורנטו': 'sorento',
      'סיד': 'ceed',
    },
  };

  const normalized = hebrewModel.trim();
  const brandModels = modelMaps[brand];

  if (brandModels && brandModels[normalized]) {
    return brandModels[normalized];
  }

  return normalized.toLowerCase().replace(/\s+/g, '-');
}

/**
 * Lookup vehicle by Israeli license plate using government API
 */
export async function lookupVehicleByLicensePlate(licensePlate: string): Promise<Vehicle | null> {
  // Remove spaces and convert to uppercase
  const cleanPlate = licensePlate.replace(/\s+/g, '').toUpperCase();

  // Validate Israeli license plate format (7-8 digits)
  if (!/^\d{7,8}$/.test(cleanPlate)) {
    throw new Error('מספר רישוי לא תקין. יש להזין 7-8 ספרות');
  }

  try {
    // Query via our API proxy to avoid CORS issues
    const response = await fetch(`/api/vehicle/lookup?plate=${encodeURIComponent(cleanPlate)}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'שגיאה בחיפוש ברישום הרכבים');
    }

    const data = await response.json();

    // Check if we got results
    if (!data.success || !data.records || data.records.length === 0) {
      throw new Error('רכב לא נמצא במאגר הרכבים');
    }

    const record = data.records[0];

    // Map API fields to our Vehicle interface
    // Field names may vary - adjust based on actual API response
    const hebrewBrand = record.tozeret_nm || record.brand || '';
    const hebrewModel = record.kinuy_mishari || record.model || '';
    const year = parseInt(record.shnat_yitzur || record.year || '2020');
    const fuelType = record.delek_nm || 'בנזין';

    const brandId = mapBrandToId(hebrewBrand);
    const modelId = mapModelToId(hebrewModel, brandId);

    return {
      licensePlate: cleanPlate,
      brand: brandId,
      model: modelId,
      year: year,
      fuelType: fuelType as any,
      engineType: record.nefah_manoa || undefined,
    };

  } catch (error: any) {
    // If API fails, throw a user-friendly error
    if (error.message.includes('רכב לא נמצא') || error.message.includes('מספר רישוי')) {
      throw error;
    }

    console.error('Vehicle lookup API error:', error);
    throw new Error('שגיאה בחיפוש רכב. נסה שוב מאוחר יותר או בחר ידנית');
  }
}

/**
 * Check if a product is compatible with a vehicle
 */
export function isProductCompatible(
  productCompatibility: string[] | undefined,
  vehicle: Vehicle
): boolean {
  if (!productCompatibility || productCompatibility.length === 0) {
    // If no compatibility data, assume universal fit
    return true;
  }

  // Check for universal pattern
  if (productCompatibility.includes('universal')) {
    return true;
  }

  // Check if vehicle matches any compatibility pattern
  // Patterns: "brand:toyota", "brand:toyota,model:corolla", "brand:toyota,year:2020-2025"
  return productCompatibility.some(pattern => {
    const parts = pattern.split(',');

    return parts.every(part => {
      const [key, value] = part.split(':');

      switch (key) {
        case 'brand':
          return vehicle.brand === value;
        case 'model':
          return vehicle.model === value;
        case 'year':
          if (value.includes('-')) {
            const [min, max] = value.split('-').map(Number);
            return vehicle.year >= min && vehicle.year <= max;
          }
          const yearValue = parseInt(value);
          return vehicle.year === yearValue;
        case 'fuel':
          return vehicle.fuelType === value;
        default:
          return true;
      }
    });
  });
}

/**
 * Format vehicle for display
 */
export function formatVehicle(vehicle: Vehicle): string {
  const parts = [];

  if (vehicle.brand) {
    parts.push(vehicle.brand);
  }
  if (vehicle.model) {
    parts.push(vehicle.model);
  }
  if (vehicle.year) {
    parts.push(vehicle.year.toString());
  }

  return parts.join(' ');
}
