import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

// Patient form schema
export const patientFormSchema = z.object({
  full_name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string()
    .min(1, "Email é obrigatório")
    .email("Por favor, insira um email válido")
    .refine(async (email) => {
      const { data, error } = await supabase
        .from('patients')
        .select('id')
        .eq('email', email)
        .single();
      
      return !data;
    }, "Este email já está em uso"),
  cpf: z.string().min(11, "CPF inválido"),
  phone: z.string().optional(),
  birth_date: z.string().optional(),
  gender: z.string().optional(),
  occupation: z.string().optional(),
  postal_code: z.string().optional(),
  street: z.string().optional(),
  number: z.string().optional(),
  complement: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  current_weight: z.string().optional(),
  target_weight: z.string().optional(),
  height: z.string().optional(),
  blood_type: z.string().optional(),
  family_history: z.string().optional(),
  medical_conditions: z.string().optional(),
  surgery_history: z.string().optional(),
  allergies: z.string().optional(),
  medications: z.string().optional(),
  meals_per_day: z.string().optional(),
  dietary_type: z.string().optional(),
  dietary_restrictions: z.string().optional(),
  food_preferences: z.string().optional(),
  water_intake: z.string().optional(),
  exercise_frequency: z.string().optional(),
  exercise_type: z.string().optional(),
  exercise_duration: z.string().optional(),
  sleep_hours: z.string().optional(),
  sleep_quality: z.string().optional(),
  nutritional_goals: z.string().optional(),
  treatment_expectations: z.string().optional(),
  additional_notes: z.string().optional(),
});

export type PatientFormValues = z.infer<typeof patientFormSchema>;

// Consultation form schema
export const consultationFormSchema = z.object({
  consultation_date: z.string(),
  weight: z.string(),
  bmi: z.string(),
  body_fat_percentage: z.string().optional(),
  waist_circumference: z.string().optional(),
  physical_activity_level: z.string().optional(),
  meal_plan_adherence: z.string().optional(),
  diet_related_symptoms: z.string().optional(),
  observations: z.string().optional(),
  meal_plan: z.string().optional(),
  long_term_goals: z.string().optional(),
  nutritional_interventions: z.string().optional(),
});

export type ConsultationFormValues = z.infer<typeof consultationFormSchema>;

// Photo types
export type PhotoRecord = {
  id: string;
  patient_id: string;
  photo_url: string;
  photo_type: string;
  taken_at: string;
};