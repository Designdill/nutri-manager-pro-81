export interface MealPlansTable {
  Row: {
    afternoon_snack: string | null;
    breakfast: string | null;
    created_at: string;
    description: string | null;
    dinner: string | null;
    evening_snack: string | null;
    id: string;
    lunch: string | null;
    morning_snack: string | null;
    patient_id: string;
    title: string;
    updated_at: string;
  };
  Insert: {
    afternoon_snack?: string | null;
    breakfast?: string | null;
    created_at?: string;
    description?: string | null;
    dinner?: string | null;
    evening_snack?: string | null;
    id?: string;
    lunch?: string | null;
    morning_snack?: string | null;
    patient_id: string;
    title: string;
    updated_at?: string;
  };
  Update: {
    afternoon_snack?: string | null;
    breakfast?: string | null;
    created_at?: string;
    description?: string | null;
    dinner?: string | null;
    evening_snack?: string | null;
    id?: string;
    lunch?: string | null;
    morning_snack?: string | null;
    patient_id?: string;
    title?: string;
    updated_at?: string;
  };
  Relationships: [
    {
      foreignKeyName: "meal_plans_patient_id_fkey";
      columns: ["patient_id"];
      isOneToOne: false;
      referencedRelation: "patients";
      referencedColumns: ["id"];
    },
  ];
}
