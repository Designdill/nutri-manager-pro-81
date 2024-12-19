export interface ConsultationsTable {
  Row: {
    id: string;
    patient_id: string;
    consultation_date: string;
    weight: number;
    bmi: number;
    observations: string | null;
    meal_plan: string | null;
    created_at: string;
    updated_at: string;
  };
  Insert: Omit<ConsultationsTable['Row'], 'id' | 'created_at' | 'updated_at'>;
  Update: Partial<ConsultationsTable['Insert']>;
}