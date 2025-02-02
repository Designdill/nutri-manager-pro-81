import { z } from "zod";

// Define question type enum
export const QuestionTypeEnum = z.enum(["text", "multiple_choice", "checkbox"]);
export type QuestionType = z.infer<typeof QuestionTypeEnum>;

// Define options schema separately to avoid deep nesting
const OptionsSchema = z.array(z.string());

// Define base question schema
const BaseQuestionSchema = z.object({
  question: z.string().min(1, "A pergunta é obrigatória"),
  type: QuestionTypeEnum,
  options: OptionsSchema.optional(),
});

// Export the question schema type
export type Question = z.infer<typeof BaseQuestionSchema>;

// Define questionnaire schema
export const QuestionnaireSchema = z.object({
  patient_id: z.string().min(1, "Selecione um paciente"),
  questions: z.array(BaseQuestionSchema),
});

// Export the form values type
export type QuestionnaireFormValues = {
  patient_id: string;
  questions: Array<{
    question: string;
    type: QuestionType;
    options?: string[];
  }>;
};