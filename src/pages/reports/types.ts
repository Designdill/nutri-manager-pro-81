export type ReportType = 'anamnese' | 'evolution' | 'measurements' | 'nutritional';

export interface ReportFilters {
  reportType: ReportType;
  patientId: string | null;
  startDate: Date | null;
  endDate: Date | null;
}

export interface Patient {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  birth_date: string | null;
  gender: string | null;
  occupation: string | null;
  current_weight: number | null;
  target_weight: number | null;
  height: number | null;
  blood_type: string | null;
  family_history: string | null;
  medical_conditions: string | null;
  allergies: string | null;
  medications: string | null;
  nutritional_goals: string | null;
  treatment_expectations: string | null;
  created_at: string;
}

export interface Consultation {
  id: string;
  patient_id: string;
  consultation_date: string;
  weight: number;
  bmi: number;
  body_fat_percentage: number | null;
  waist_circumference: number | null;
  observations: string | null;
  meal_plan: string | null;
}

export interface MealPlan {
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
}
