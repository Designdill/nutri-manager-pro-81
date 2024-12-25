import { z } from "zod";

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