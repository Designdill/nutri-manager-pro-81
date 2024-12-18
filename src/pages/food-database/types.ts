export interface Food {
  id: string;
  name: string;
  category: string;
  calories: number | null;
  proteins: number | null;
  carbohydrates: number | null;
  fats: number | null;
  fiber: number | null;
  serving_size: number | null;
  serving_unit: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface OpenFoodFactsProduct {
  product_name: string;
  categories: string;
  nutriments: {
    "energy-kcal_100g": number;
    proteins_100g: number;
    carbohydrates_100g: number;
    fat_100g: number;
    fiber_100g: number;
  };
  serving_size: string;
}

export type NewFood = Omit<Food, 'id' | 'created_at' | 'updated_at'>;