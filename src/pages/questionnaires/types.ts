import { z } from "zod";

// Define question type enum
export const QuestionTypeEnum = z.enum(["text", "multiple_choice", "checkbox"]);
export type QuestionType = z.infer<typeof QuestionTypeEnum>;

// Define base question schema
const BaseQuestionSchema = z.object({
  question: z.string().min(1, "A pergunta é obrigatória"),
  type: QuestionTypeEnum,
});

// Define complete question schema
export const QuestionSchema = BaseQuestionSchema.extend({
  options: z.array(z.string()).optional(),
});

export type Question = z.infer<typeof QuestionSchema>;

// Define questionnaire schema
export const QuestionnaireSchema = z.object({
  patient_id: z.string().min(1, "Selecione um paciente"),
  questions: z.array(QuestionSchema),
});

export type QuestionnaireFormValues = z.infer<typeof QuestionnaireSchema>;