import { z } from "zod";
import { Tables } from "@/integrations/supabase/types";

export const mealPlanSchema = z.object({
  patientId: z.string().min(1, "Selecione um paciente"),
  title: z.string().min(1, "Digite um título"),
  description: z.string().optional(),
  breakfast: z.string().optional(),
  morningSnack: z.string().optional(),
  lunch: z.string().optional(),
  afternoonSnack: z.string().optional(),
  dinner: z.string().optional(),
  eveningSnack: z.string().optional(),
});

export type MealPlanFormData = z.infer<typeof mealPlanSchema>;

export interface MealPlanWithPatient extends Tables<"meal_plans"> {
  patients?: {
    id: string;
    full_name: string | null;
  } | null;
}