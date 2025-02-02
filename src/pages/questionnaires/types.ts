import { z } from "zod";

export const QuestionTypeEnum = z.enum(["text", "multiple_choice", "checkbox"]);
export type QuestionType = z.infer<typeof QuestionTypeEnum>;

export const QuestionSchema = z.object({
  question: z.string().min(1, "A pergunta é obrigatória"),
  type: QuestionTypeEnum,
  options: z.array(z.string()).optional(),
});

export type Question = z.infer<typeof QuestionSchema>;

export const QuestionnaireSchema = z.object({
  patient_id: z.string().min(1, "Selecione um paciente"),
  questions: z.array(QuestionSchema),
});

export type QuestionnaireFormValues = z.infer<typeof QuestionnaireSchema>;