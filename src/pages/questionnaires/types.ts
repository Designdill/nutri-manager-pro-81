import { z } from "zod";
import { UseFormReturn } from "react-hook-form";

// Define question type enum
export const QuestionTypeEnum = z.enum(["text", "multiple_choice", "checkbox"]);
export type QuestionType = z.infer<typeof QuestionTypeEnum>;

// Define question schema
export const QuestionSchema = z.object({
  question: z.string().min(1, "A pergunta é obrigatória"),
  type: QuestionTypeEnum,
  options: z.array(z.string()),
});

// Define questionnaire schema
export const QuestionnaireSchema = z.object({
  patient_id: z.string().min(1, "Selecione um paciente"),
  questions: z.array(QuestionSchema).min(1, "Adicione pelo menos uma pergunta"),
});

// Export types
export type Question = z.infer<typeof QuestionSchema>;
export type QuestionnaireFormValues = z.infer<typeof QuestionnaireSchema>;

// Export form props interface
export interface QuestionnaireFormProps {
  form: UseFormReturn<QuestionnaireFormValues>;
  patients: Array<{
    id: string;
    full_name: string;
    email: string | null;
  }>;
  onSubmit: (data: QuestionnaireFormValues) => Promise<void>;
}