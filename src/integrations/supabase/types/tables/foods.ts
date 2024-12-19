export interface FoodsTable {
  Row: {
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
    created_at: string;
    updated_at: string;
  };
  Insert: Omit<FoodsTable['Row'], 'id' | 'created_at' | 'updated_at'>;
  Update: Partial<FoodsTable['Insert']>;
}