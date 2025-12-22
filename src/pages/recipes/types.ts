export interface RecipeIngredient {
  id?: string;
  recipe_id?: string;
  food_id: string | null;
  food_name: string;
  quantity: number;
  unit: string;
  calories: number;
  proteins: number;
  carbohydrates: number;
  fats: number;
  fiber: number;
}

export interface Recipe {
  id: string;
  nutritionist_id: string;
  title: string;
  description: string | null;
  preparation_time: number | null;
  servings: number;
  instructions: string | null;
  category: string;
  total_calories: number;
  total_proteins: number;
  total_carbohydrates: number;
  total_fats: number;
  total_fiber: number;
  created_at: string;
  updated_at: string;
  recipe_ingredients?: RecipeIngredient[];
}

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
}

export const RECIPE_CATEGORIES = [
  'Café da Manhã',
  'Almoço',
  'Jantar',
  'Lanches',
  'Sobremesas',
  'Bebidas',
  'Sopas',
  'Saladas',
  'Outros'
];
