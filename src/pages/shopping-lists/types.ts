export interface ShoppingListItem {
  id: string;
  shopping_list_id: string;
  food_id: string | null;
  food_name: string;
  quantity: number;
  unit: string;
  category: string;
  raw_quantity: number | null;
  is_checked: boolean;
  notes: string | null;
  created_at: string;
}

export interface ShoppingList {
  id: string;
  patient_id: string;
  meal_plan_id: string | null;
  nutritionist_id: string;
  title: string;
  week_start: string | null;
  week_end: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  patients?: {
    id: string;
    full_name: string;
  };
  shopping_list_items?: ShoppingListItem[];
}

export interface GroupedItems {
  [category: string]: ShoppingListItem[];
}
