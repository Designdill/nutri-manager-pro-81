import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SearchBar } from "./components/SearchBar";
import { SettingsHeader } from "./components/SettingsHeader";
import { SettingsForm } from "./components/SettingsForm";
import { useSettingsForm } from "./hooks/useSettingsForm";
import { SettingsFormValues } from "./types";
import { useAuth } from "@/App";

export default function SettingsPage() {
  const { toast } = useToast();
  const { session } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { form, userSettings } = useSettingsForm();

  const onSubmit = async (data: SettingsFormValues) => {
    setIsLoading(true);
    try {
      const oldSettings = {
        theme: userSettings?.theme,
        language: userSettings?.language,
        email_notifications: userSettings?.email_notifications,
        push_notifications: userSettings?.push_notifications,
        notification_preferences: userSettings?.notification_preferences,
        auto_dark_mode: userSettings?.auto_dark_mode,
        custom_theme: userSettings?.custom_theme,
      };

      // Update profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: data.full_name,
          phone: data.phone,
          address_street: data.address_street,
          address_number: data.address_number,
          address_complement: data.address_complement,
          address_neighborhood: data.address_neighborhood,
          address_city: data.address_city,
          address_state: data.address_state,
          address_postal_code: data.address_postal_code,
          address_country: data.address_country,
        })
        .eq("id", session?.user?.id);

      if (profileError) throw profileError;

      // Update settings
      const { error: settingsError } = await supabase
        .from("user_settings")
        .update({
          theme: data.theme,
          language: data.language,
          auto_dark_mode: data.auto_dark_mode,
          dark_mode_start: data.dark_mode_start,
          dark_mode_end: data.dark_mode_end,
          custom_theme: data.custom_theme,
          email_notifications: data.email_notifications,
          push_notifications: data.push_notifications,
          notification_preferences: data.notification_preferences,
          email_signature: data.email_signature,
          email_filters: data.email_filters,
          open_food_facts_api_key: data.open_food_facts_api_key,
          google_calendar_connected: data.google_calendar_connected,
          account_active: data.account_active,
          auto_backup: data.auto_backup,
          backup_frequency: data.backup_frequency,
          cloud_storage_provider: data.cloud_storage_provider,
          cloud_storage_settings: data.cloud_storage_settings,
          apple_health_connected: data.apple_health_connected,
          meal_delivery_connected: data.meal_delivery_connected,
          recipe_planning_connected: data.recipe_planning_connected,
          appointment_reminder_emails: data.appointment_reminder_emails,
          progress_report_emails: data.progress_report_emails,
          newsletter_emails: data.newsletter_emails,
          email_frequency: data.email_frequency,
          appointment_reminder_template: data.appointment_reminder_template,
          progress_report_template: data.progress_report_template,
          usda_fooddata_api_key: data.usda_fooddata_api_key,
        })
        .eq("user_id", session?.user?.id);

      if (settingsError) throw settingsError;

      // Log settings changes
      const changes = Object.entries(data).filter(
        ([key, value]) => JSON.stringify(oldSettings[key as keyof typeof oldSettings]) !== JSON.stringify(value)
      );

      if (changes.length > 0) {
        const { error: historyError } = await supabase
          .from("settings_history")
          .insert(
            changes.map(([setting_name, new_value]) => ({
              user_id: session?.user?.id,
              setting_name,
              old_value: JSON.stringify(oldSettings[setting_name as keyof typeof oldSettings]),
              new_value: JSON.stringify(new_value),
            }))
          );

        if (historyError) throw historyError;
      }

      toast({
        title: "Configurações atualizadas",
        description: "Suas configurações foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error("Error updating settings:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar as configurações.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetSettings = async () => {
    try {
      const { error } = await supabase
        .from("user_settings")
        .update({
          theme: "system",
          language: "pt-BR",
          email_notifications: true,
          google_calendar_connected: false,
          account_active: true,
          appointment_reminder_emails: true,
          progress_report_emails: true,
          newsletter_emails: true,
          email_frequency: "weekly",
          appointment_reminder_template: "",
          progress_report_template: "",
        })
        .eq("user_id", session?.user?.id);

      if (error) throw error;

      toast({
        title: "Configurações redefinidas",
        description: "Suas configurações foram redefinidas para os valores padrão.",
      });
    } catch (error) {
      console.error("Error resetting settings:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao redefinir as configurações.",
        variant: "destructive",
      });
    }
  };

  const filterComponents = (query: string) => {
    setSearchQuery(query.toLowerCase());
  };

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex-1 space-y-8 p-8">
        <SettingsHeader onReset={resetSettings} resetForm={form.reset} />
        <SearchBar onSearch={filterComponents} />
        <SettingsForm
          form={form}
          onSubmit={onSubmit}
          isLoading={isLoading}
          searchQuery={searchQuery}
        />
      </div>
    </div>
  );
}