import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

// CPF validation function
const validateCPF = (cpf: string): boolean => {
  if (!cpf) return true; // CPF is optional
  
  // Remove non-numeric characters
  const cleanCPF = cpf.replace(/[^\d]/g, '');
  
  // Check if has 11 digits
  if (cleanCPF.length !== 11) return false;
  
  // Check for known invalid CPFs (all same digits)
  const invalidCPFs = [
    '00000000000', '11111111111', '22222222222', '33333333333',
    '44444444444', '55555555555', '66666666666', '77777777777',
    '88888888888', '99999999999'
  ];
  if (invalidCPFs.includes(cleanCPF)) return false;
  
  // Validate check digits
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let digit1 = 11 - (sum % 11);
  if (digit1 >= 10) digit1 = 0;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  let digit2 = 11 - (sum % 11);
  if (digit2 >= 10) digit2 = 0;
  
  return (
    parseInt(cleanCPF.charAt(9)) === digit1 &&
    parseInt(cleanCPF.charAt(10)) === digit2
  );
};

// Patient form schema
export const patientFormSchema = z.object({
  full_name: z.string().min(2, {
    message: "Nome deve ter pelo menos 2 caracteres"
  }),
  email: z.string().email("Por favor, insira um email válido").min(1, "Email é obrigatório"),
  cpf: z.string().optional().or(z.literal("")).refine((val) => {
    if (!val || val === "") return true;
    return validateCPF(val);
  }, {
    message: "CPF inválido. Verifique os dígitos."
  }),
  phone: z.string().min(1, "Telefone é obrigatório"),
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
  status: z.enum(['created', 'active', 'inactive']).default('created'),
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

// Simplified photo type
export type PhotoRecord = {
  id: string;
  patient_id: string;
  photo_url: string;
  photo_type: string;
  taken_at: string;
};