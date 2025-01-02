import { z } from "zod";

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
  theme: z.enum(["light", "dark", "system"] as const),
  language: z.enum(["pt-BR", "en-US"] as const),
  auto_dark_mode: z.boolean().default(false),
  dark_mode_start: z.string().optional(),
  dark_mode_end: z.string().optional(),
  custom_theme: z.object({
    primary: z.string(),
    secondary: z.string(),
    accent: z.string(),
  }).optional(),
  email_notifications: z.boolean(),
  push_notifications: z.boolean().default(true),
  notification_preferences: z.object({
    appointments: z.boolean(),
    messages: z.boolean(),
    updates: z.boolean(),
  }).default({
    appointments: true,
    messages: true,
    updates: true,
  }),
  email_signature: z.string().optional(),
  email_filters: z.array(z.string()).default([]),
  open_food_facts_api_key: z.string().optional(),
  google_calendar_connected: z.boolean(),
  account_active: z.boolean(),
  auto_backup: z.boolean().default(false),
  backup_frequency: z.enum(["daily", "weekly", "monthly"]).default("weekly"),
  cloud_storage_provider: z.string().optional(),
  cloud_storage_settings: z.object({
    provider: z.string(),
    credentials: z.record(z.string()).optional(),
    bucket: z.string().optional(),
  }).optional(),
});

export type SettingsFormValues = z.infer<typeof settingsFormSchema>;