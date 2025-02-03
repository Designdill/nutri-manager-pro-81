import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

// Patient form schema
export const patientFormSchema = z.object({
  full_name: z.string().min(2, {
    message: "Nome deve ter pelo menos 2 caracteres"
  }),
  email: z.string({
    required_error: "Email é obrigatório",
    invalid_type_error: "Email deve ser um texto"
  })
    .min(1, "Email é obrigatório")
    .email("Por favor, insira um email válido")
    .superRefine(async (email, ctx) => {
      const patientId = ctx.meta?.patientId as string | undefined;
      
      console.log("Validating email:", email, "for patient:", patientId);
      
      const { data, error } = await supabase
        .from('patients')
        .select('id')
        .eq('email', email)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error("Error checking email:", error);
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Erro ao verificar email"
        });
        return;
      }
      
      // If no data found, email is available
      if (!data) {
        console.log("Email is available");
        return;
      }
      
      // If editing, allow the same email for the current patient
      if (patientId && data.id === patientId) {
        console.log("Email belongs to current patient");
        return;
      }
      
      console.log("Email belongs to another patient");
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Este email já está em uso"
      });
    }),
  cpf: z.string().min(11, "CPF deve ter 11 dígitos"),
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

// Simplified consultation form schema
export type ConsultationFormValues = {
  consultation_date: string;
  weight: string;
  bmi: string;
  body_fat_percentage?: string;
  waist_circumference?: string;
  physical_activity_level?: string;
  meal_plan_adherence?: string;
  diet_related_symptoms?: string;
  observations?: string;
  meal_plan?: string;
  long_term_goals?: string;
  nutritional_interventions?: string;
};

// Simplified photo type
export type PhotoRecord = {
  id: string;
  patient_id: string;
  photo_url: string;
  photo_type: string;
  taken_at: string;
};