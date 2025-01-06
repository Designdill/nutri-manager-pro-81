import { useAuth } from "@/App";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SettingsFormValues, settingsFormSchema } from "../types/settings-form";
import type { UserSettingsTable } from "@/integrations/supabase/types/settings/user-settings";
import { parseThemeSettings } from "@/integrations/supabase/types/settings/theme";
import { Json } from "@/integrations/supabase/types/database";

export function useSettingsForm() {
  const { session } = useAuth();

  const { data: userSettings } = useQuery({
    queryKey: ["user-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", session?.user?.id)
        .maybeSingle();

      if (error) throw error;
      return data as UserSettingsTable["Row"] | null;
    },
  });

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session?.user?.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const parseEmailFilters = (jsonFilters: Json | null): string[] => {
    if (Array.isArray(jsonFilters)) {
      return jsonFilters.map(filter => String(filter));
    }
    return [];
  };

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      full_name: profile?.full_name || "",
      phone: profile?.phone || "",
      address_street: profile?.address_street || "",
      address_number: profile?.address_number || "",
      address_complement: profile?.address_complement || "",
      address_neighborhood: profile?.address_neighborhood || "",
      address_city: profile?.address_city || "",
      address_state: profile?.address_state || "",
      address_postal_code: profile?.address_postal_code || "",
      address_country: profile?.address_country || "Brasil",
      theme: userSettings?.theme as "light" | "dark" | "system" || "system",
      language: userSettings?.language as "pt-BR" | "en-US" || "pt-BR",
      auto_dark_mode: userSettings?.auto_dark_mode || false,
      dark_mode_start: userSettings?.dark_mode_start || "18:00",
      dark_mode_end: userSettings?.dark_mode_end || "06:00",
      custom_theme: parseThemeSettings(userSettings?.custom_theme),
      email_notifications: userSettings?.email_notifications || false,
      push_notifications: userSettings?.push_notifications || true,
      notification_preferences: userSettings?.notification_preferences || {
        appointments: true,
        messages: true,
        updates: true,
      },
      email_signature: userSettings?.email_signature || "",
      email_filters: parseEmailFilters(userSettings?.email_filters),
      open_food_facts_api_key: userSettings?.open_food_facts_api_key || "",
      google_calendar_connected: userSettings?.google_calendar_connected || false,
      apple_health_connected: userSettings?.apple_health_connected || false,
      meal_delivery_connected: userSettings?.meal_delivery_connected || false,
      recipe_planning_connected: userSettings?.recipe_planning_connected || false,
      account_active: userSettings?.account_active || true,
      auto_backup: userSettings?.auto_backup || false,
      backup_frequency: userSettings?.backup_frequency || "weekly",
      cloud_storage_provider: userSettings?.cloud_storage_provider || "",
      cloud_storage_settings: userSettings?.cloud_storage_settings || undefined,
      email_service: userSettings?.email_service || "smtp",
      resend_api_key: userSettings?.resend_api_key || "",
      smtp_host: userSettings?.smtp_host || "",
      smtp_port: userSettings?.smtp_port || "",
      smtp_user: userSettings?.smtp_user || "",
      smtp_password: userSettings?.smtp_password || "",
      smtp_secure: userSettings?.smtp_secure ?? true,
      appointment_reminder_emails: userSettings?.appointment_reminder_emails || true,
      progress_report_emails: userSettings?.progress_report_emails || true,
      newsletter_emails: userSettings?.newsletter_emails || true,
      email_frequency: userSettings?.email_frequency || "weekly",
      appointment_reminder_template: userSettings?.appointment_reminder_template || "",
      progress_report_template: userSettings?.progress_report_template || "",
      usda_fooddata_api_key: userSettings?.usda_fooddata_api_key || "",
    },
  });

  return {
    form,
    profile,
    userSettings,
  };
}