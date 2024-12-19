export interface ConsultationsTable {
  Row: {
    bmi: number;
    consultation_date: string;
    created_at: string;
    id: string;
    meal_plan: string | null;
    observations: string | null;
    patient_id: string;
    updated_at: string;
    weight: number;
  };
  Insert: {
    bmi: number;
    consultation_date: string;
    created_at?: string;
    id?: string;
    meal_plan?: string | null;
    observations?: string | null;
    patient_id: string;
    updated_at?: string;
    weight: number;
  };
  Update: {
    bmi?: number;
    consultation_date?: string;
    created_at?: string;
    id?: string;
    meal_plan?: string | null;
    observations?: string | null;
    patient_id?: string;
    updated_at?: string;
    weight?: number;
  };
  Relationships: [
    {
      foreignKeyName: "consultations_patient_id_fkey";
      columns: ["patient_id"];
      isOneToOne: false;
      referencedRelation: "patients";
      referencedColumns: ["id"];
    },
  ];
}
