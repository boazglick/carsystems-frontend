/**
 * Car Brand Logos
 * Using logo.clearbit.com for reliable brand logos
 */

export const BRAND_LOGOS: Record<string, string> = {
  toyota: 'https://logo.clearbit.com/toyota.com',
  honda: 'https://logo.clearbit.com/honda.com',
  mazda: 'https://logo.clearbit.com/mazda.com',
  subaru: 'https://logo.clearbit.com/subaru.com',
  kia: 'https://logo.clearbit.com/kia.com',
  hyundai: 'https://logo.clearbit.com/hyundai.com',
  skoda: 'https://logo.clearbit.com/skoda-auto.com',
  seat: 'https://logo.clearbit.com/seat.com',
  renault: 'https://logo.clearbit.com/renault.com',
  peugeot: 'https://logo.clearbit.com/peugeot.com',
  mitsubishi: 'https://logo.clearbit.com/mitsubishicars.com',
  nissan: 'https://logo.clearbit.com/nissan.com',
  volkswagen: 'https://logo.clearbit.com/vw.com',
  mercedes: 'https://logo.clearbit.com/mercedes-benz.com',
  bmw: 'https://logo.clearbit.com/bmw.com',
  audi: 'https://logo.clearbit.com/audi.com',
  ford: 'https://logo.clearbit.com/ford.com',
  chevrolet: 'https://logo.clearbit.com/chevrolet.com',
  citroen: 'https://logo.clearbit.com/citroen.com',
  suzuki: 'https://logo.clearbit.com/suzuki.com',
  fiat: 'https://logo.clearbit.com/fiat.com',
};

/**
 * Get brand logo URL
 * Returns logo URL or undefined if not found
 */
export function getBrandLogo(brandId: string): string | undefined {
  return BRAND_LOGOS[brandId.toLowerCase()];
}

/**
 * Get brand initials as fallback
 */
export function getBrandInitials(brandName: string): string {
  return brandName.substring(0, 2).toUpperCase();
}
