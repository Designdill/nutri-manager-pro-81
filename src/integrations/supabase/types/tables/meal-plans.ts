export interface MealPlansTable {
  Row: {
    id: string;
    patient_id: string;
    title: string;
    description: string | null;
    breakfast: string | null;
    morning_snack: string | null;
    lunch: string | null;
    afternoon_snack: string | null;
    dinner: string | null;
    evening_snack: string | null;
    created_at: string;
    updated_at: string;
  };
  Insert: Omit<MealPlansTable['Row'], 'id' | 'created_at' | 'updated_at'>;
  Update: Partial<MealPlansTable['Insert']>;
}