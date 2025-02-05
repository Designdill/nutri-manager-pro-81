import { z } from "zod";
import { UseFormReturn } from "react-hook-form";

// Define simple question type enum
export const QuestionTypeEnum = z.enum(["text", "multiple_choice", "checkbox"]);
export type QuestionType = z.infer<typeof QuestionTypeEnum>;

// Define base question schema without recursive types
export const QuestionSchema = z.object({
  question: z.string().min(1, {
    message: "A pergunta é obrigatória"
  }),
  type: QuestionTypeEnum,
  options: z.array(z.string()).optional(),
});

// Define questionnaire schema with simplified structure
export const QuestionnaireSchema = z.object({
  patient_id: z.string().min(1, "Selecione um paciente"),
  questions: z.array(QuestionSchema).min(1, "Adicione pelo menos uma pergunta"),
});

// Export types
export type Question = z.infer<typeof QuestionSchema>;
export type QuestionnaireFormValues = z.infer<typeof QuestionnaireSchema>;

// Export form props interface with explicit types
export interface QuestionnaireFormProps {
  form: UseFormReturn<QuestionnaireFormValues>;
  patients: Array<{
    id: string;
    full_name: string;
    email: string | null;
  }>;
  onSubmit: (data: QuestionnaireFormValues) => Promise<void>;
}