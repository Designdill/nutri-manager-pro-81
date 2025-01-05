import { z } from "zod";

export const themeSettingsSchema = z.object({
  primary: z.string(),
  secondary: z.string(),
  accent: z.string(),
});

export const notificationPreferencesSchema = z.object({
  appointments: z.boolean(),
  messages: z.boolean(),
  updates: z.boolean(),
});

export const cloudStorageSettingsSchema = z.object({
  provider: z.string().optional(),
  credentials: z.record(z.string()).optional(),
  bucket: z.string().optional(),
});

export const settingsFormSchema = z.object({
  full_name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  phone: z.string().optional(),
  address_street: z.string().optional(),
  address_number: z.string().optional(),
  address_complement: z.string().optional(),
  address_neighborhood: z.string().optional(),
  address_city: z.string().optional(),
  address_state: z.string().optional(),
  address_postal_code: z.string().optional(),
  address_country: z.string().optional(),
  theme: z.enum(["light", "dark", "system"]),
  language: z.enum(["pt-BR", "en-US"]),
  auto_dark_mode: z.boolean(),
  dark_mode_start: z.string(),
  dark_mode_end: z.string(),
  custom_theme: themeSettingsSchema,
  email_notifications: z.boolean(),
  push_notifications: z.boolean(),
  notification_preferences: notificationPreferencesSchema,
  email_signature: z.string().optional(),
  email_filters: z.array(z.string()),
  open_food_facts_api_key: z.string().optional(),
  google_calendar_connected: z.boolean(),
  apple_health_connected: z.boolean(),
  meal_delivery_connected: z.boolean(),
  recipe_planning_connected: z.boolean(),
  account_active: z.boolean(),
  auto_backup: z.boolean(),
  backup_frequency: z.enum(["daily", "weekly", "monthly"]),
  cloud_storage_provider: z.string().optional(),
  cloud_storage_settings: cloudStorageSettingsSchema.optional(),
  email_service: z.enum(["resend", "smtp"]),
  resend_api_key: z.string().optional(),
  smtp_host: z.string().optional(),
  smtp_port: z.string().optional(),
  smtp_user: z.string().optional(),
  smtp_password: z.string().optional(),
  smtp_secure: z.boolean(),
  appointment_reminder_emails: z.boolean(),
  progress_report_emails: z.boolean(),
  newsletter_emails: z.boolean(),
  email_frequency: z.enum(["daily", "weekly", "monthly"]),
  appointment_reminder_template: z.string().optional(),
  progress_report_template: z.string().optional(),
  usda_fooddata_api_key: z.string().optional(),
});

export type SettingsFormValues = z.infer<typeof settingsFormSchema>;