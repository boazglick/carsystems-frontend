// Vehicle Types for Israeli Car Parts E-commerce

export interface Vehicle {
  licensePlate?: string;
  brand: string;
  model: string;
  year: number;
  engineType?: string;
  fuelType?: 'בנזין' | 'דיזל' | 'היברידי' | 'חשמלי';
}

export interface VehicleBrand {
  id: string;
  name: string;
  logo?: string;
}

export interface VehicleModel {
  id: string;
  brandId: string;
  name: string;
  years: number[];
}

// Israeli vehicle brands commonly sold
export const VEHICLE_BRANDS: VehicleBrand[] = [
  { id: 'toyota', name: 'טויוטה' },
  { id: 'hyundai', name: 'יונדאי' },
  { id: 'kia', name: 'קיה' },
  { id: 'mazda', name: 'מאזדה' },
  { id: 'honda', name: 'הונדה' },
  { id: 'nissan', name: 'ניסאן' },
  { id: 'mitsubishi', name: 'מיצובישי' },
  { id: 'suzuki', name: 'סוזוקי' },
  { id: 'skoda', name: 'סקודה' },
  { id: 'volkswagen', name: 'פולקסווגן' },
  { id: 'mercedes', name: 'מרצדס' },
  { id: 'bmw', name: 'ב.מ.וו' },
  { id: 'audi', name: 'אאודי' },
  { id: 'ford', name: 'פורד' },
  { id: 'chevrolet', name: 'שברולט' },
  { id: 'renault', name: 'רנו' },
  { id: 'peugeot', name: 'פיג\'ו' },
  { id: 'citroen', name: 'סיטרואן' },
  { id: 'seat', name: 'סיאט' },
  { id: 'fiat', name: 'פיאט' },
];

// Popular models per brand
export const VEHICLE_MODELS: VehicleModel[] = [
  // Toyota
  { id: 'corolla', brandId: 'toyota', name: 'קורולה', years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] },
  { id: 'yaris', brandId: 'toyota', name: 'יאריס', years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] },
  { id: 'rav4', brandId: 'toyota', name: 'RAV4', years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] },
  { id: 'camry', brandId: 'toyota', name: 'קאמרי', years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] },

  // Hyundai
  { id: 'i20', brandId: 'hyundai', name: 'i20', years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] },
  { id: 'i30', brandId: 'hyundai', name: 'i30', years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] },
  { id: 'tucson', brandId: 'hyundai', name: 'טוסון', years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] },
  { id: 'santa-fe', brandId: 'hyundai', name: 'סנטה פה', years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] },

  // Kia
  { id: 'picanto', brandId: 'kia', name: 'פיקנטו', years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] },
  { id: 'rio', brandId: 'kia', name: 'ריו', years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] },
  { id: 'sportage', brandId: 'kia', name: 'ספורטאז\'', years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] },
  { id: 'sorento', brandId: 'kia', name: 'סורנטו', years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] },

  // Mazda
  { id: 'mazda2', brandId: 'mazda', name: 'מאזדה 2', years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] },
  { id: 'mazda3', brandId: 'mazda', name: 'מאזדה 3', years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] },
  { id: 'cx-5', brandId: 'mazda', name: 'CX-5', years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] },

  // Skoda
  { id: 'fabia', brandId: 'skoda', name: 'פאביה', years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] },
  { id: 'octavia', brandId: 'skoda', name: 'אוקטביה', years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] },
  { id: 'superb', brandId: 'skoda', name: 'סופרב', years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] },
];

export function getModelsByBrand(brandId: string): VehicleModel[] {
  return VEHICLE_MODELS.filter(model => model.brandId === brandId);
}

export function getBrandName(brandId: string): string {
  return VEHICLE_BRANDS.find(b => b.id === brandId)?.name || brandId;
}

export function getModelName(modelId: string): string {
  return VEHICLE_MODELS.find(m => m.id === modelId)?.name || modelId;
}
