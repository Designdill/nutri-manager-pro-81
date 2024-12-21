import { z } from "zod";

export const settingsFormSchema = z.object({
  full_name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  phone: z.string().optional(),
  theme: z.enum(["light", "dark", "system"] as const),
  language: z.enum(["pt-BR", "en-US"] as const),
  email_notifications: z.boolean(),
  open_food_facts_api_key: z.string().optional(),
  google_calendar_connected: z.boolean(),
  account_active: z.boolean(),
});

export type SettingsFormValues = z.infer<typeof settingsFormSchema>;