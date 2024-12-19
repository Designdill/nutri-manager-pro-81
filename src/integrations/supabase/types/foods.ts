export interface FoodsTable {
  Row: {
    calories: number | null;
    carbohydrates: number | null;
    category: string;
    created_at: string;
    fats: number | null;
    fiber: number | null;
    id: string;
    name: string;
    proteins: number | null;
    serving_size: number | null;
    serving_unit: string | null;
    updated_at: string;
  };
  Insert: {
    calories?: number | null;
    carbohydrates?: number | null;
    category: string;
    created_at?: string;
    fats?: number | null;
    fiber?: number | null;
    id?: string;
    name: string;
    proteins?: number | null;
    serving_size?: number | null;
    serving_unit?: string | null;
    updated_at?: string;
  };
  Update: {
    calories?: number | null;
    carbohydrates?: number | null;
    category?: string;
    created_at?: string;
    fats?: number | null;
    fiber?: number | null;
    id?: string;
    name?: string;
    proteins?: number | null;
    serving_size?: number | null;
    serving_unit?: string | null;
    updated_at?: string;
  };
  Relationships: [];
}
