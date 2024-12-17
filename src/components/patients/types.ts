import { z } from "zod";

export const patientFormSchema = z.object({
  // Personal Information
  full_name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  cpf: z.string().min(11, "CPF inválido"),
  email: z.string().email("Email inválido").optional().nullable(),
  phone: z.string().optional().nullable(),
  birth_date: z.string().optional().nullable(),
  gender: z.string().optional().nullable(),
  occupation: z.string().optional().nullable(),

  // Address
  postal_code: z.string().optional().nullable(),
  street: z.string().optional().nullable(),
  number: z.string().optional().nullable(),
  complement: z.string().optional().nullable(),
  neighborhood: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),

  // Measurements and Goals
  current_weight: z.string().optional().nullable(),
  target_weight: z.string().optional().nullable(),
  height: z.string().optional().nullable(),

  // Health History
  blood_type: z.string().optional().nullable(),
  family_history: z.string().optional().nullable(),
  medical_conditions: z.string().optional().nullable(),
  allergies: z.string().optional().nullable(),
  medications: z.string().optional().nullable(),

  // Eating Habits
  meals_per_day: z.string().optional().nullable(),
  dietary_restrictions: z.string().optional().nullable(),

  // Physical Activity
  exercise_frequency: z.string().optional().nullable(),
  exercise_type: z.string().optional().nullable(),
  exercise_duration: z.string().optional().nullable(),

  // Sleep Pattern
  sleep_hours: z.string().optional().nullable(),
  sleep_quality: z.string().optional().nullable(),

  // Goals and Notes
  nutritional_goals: z.string().optional().nullable(),
  treatment_expectations: z.string().optional().nullable(),
  additional_notes: z.string().optional().nullable(),
});

export type PatientFormValues = z.infer<typeof patientFormSchema>;