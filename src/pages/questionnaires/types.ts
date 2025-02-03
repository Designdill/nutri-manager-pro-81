import { z } from "zod";

// Define question type enum
export const QuestionTypeEnum = z.enum(["text", "multiple_choice", "checkbox"]);
export type QuestionType = z.infer<typeof QuestionTypeEnum>;

// Define base question schema
export const BaseQuestionSchema = z.object({
  question: z.string().min(1, "A pergunta é obrigatória"),
  type: QuestionTypeEnum,
  options: z.array(z.string()).optional(),
});

// Export the question schema type
export type Question = z.infer<typeof BaseQuestionSchema>;

// Define simplified patient type for the form
export type QuestionnairePatient = {
  id: string;
  email: string | null;
  full_name: string;
};

// Define questionnaire schema
export const QuestionnaireSchema = z.object({
  patient_id: z.string().min(1, "Selecione um paciente"),
  questions: z.array(BaseQuestionSchema).min(1, "Adicione pelo menos uma pergunta"),
});

// Export the form values type
export type QuestionnaireFormValues = z.infer<typeof QuestionnaireSchema>;

// Export props interface for the form component
export interface QuestionnaireFormProps {
  form: any; // We'll type this properly in the component
  patients: QuestionnairePatient[];
}