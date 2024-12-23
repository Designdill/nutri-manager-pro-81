import { z } from "zod";

export const settingsFormSchema = z.object({
  full_name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  phone: z.string().optional(),
  theme: z.enum(["light", "dark", "system"] as const),
  language: z.enum(["pt-BR", "en-US"] as const),
  email_notifications: z.boolean(),
  open_food_facts_api_key: z.string().optional(),
  usda_fooddata_api_key: z.string().optional(),
  google_fit_connected: z.boolean().default(false),
  apple_health_connected: z.boolean().default(false),
  meal_delivery_connected: z.boolean().default(false),
  recipe_planning_connected: z.boolean().default(false),
  google_calendar_connected: z.boolean(),
  account_active: z.boolean(),
  // New email settings
  appointment_reminder_emails: z.boolean().default(true),
  progress_report_emails: z.boolean().default(true),
  newsletter_emails: z.boolean().default(true),
  appointment_reminder_template: z.string().optional(),
  progress_report_template: z.string().optional(),
  email_frequency: z.enum(["daily", "weekly", "monthly"]).default("weekly"),
});

export type SettingsFormValues = z.infer<typeof settingsFormSchema>;