import { useState } from "react";
import { useAuth } from "@/App";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { SearchBar } from "./components/SearchBar";
import { ProfileSettings } from "./components/ProfileSettings";
import { AppearanceSettings } from "./components/AppearanceSettings";
import { NotificationSettings } from "./components/NotificationSettings";
import { IntegrationSettings } from "./components/IntegrationSettings";
import { EmailSettings } from "./components/EmailSettings";
import { AccountSettings } from "./components/AccountSettings";
import { BackupSettings } from "./components/BackupSettings";
import { settingsFormSchema, SettingsFormValues } from "./types";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { RotateCcw } from "lucide-react";

export default function SettingsPage() {
  const { session } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: userSettings } = useQuery({
    queryKey: ["user-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", session?.user?.id)
        .maybeSingle();

      if (error) throw error;
      return data;
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

  const form = useForm<SettingsFormValues>({
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
      theme: (userSettings?.theme as "light" | "dark" | "system") || "system",
      language: (userSettings?.language as "pt-BR" | "en-US") || "pt-BR",
      auto_dark_mode: userSettings?.auto_dark_mode || false,
      dark_mode_start: userSettings?.dark_mode_start || "18:00",
      dark_mode_end: userSettings?.dark_mode_end || "06:00",
      custom_theme: userSettings?.custom_theme as { primary: string; secondary: string; accent: string } || {
        primary: "#0ea5e9",
        secondary: "#64748b",
        accent: "#f59e0b",
      },
      email_notifications: userSettings?.email_notifications || false,
      push_notifications: userSettings?.push_notifications || true,
      notification_preferences: userSettings?.notification_preferences as { appointments: boolean; messages: boolean; updates: boolean } || {
        appointments: true,
        messages: true,
        updates: true,
      },
      email_signature: userSettings?.email_signature || "",
      email_filters: (userSettings?.email_filters as string[]) || [],
      open_food_facts_api_key: userSettings?.open_food_facts_api_key || "",
      google_calendar_connected: userSettings?.google_calendar_connected || false,
      account_active: userSettings?.account_active || true,
      auto_backup: userSettings?.auto_backup || false,
      backup_frequency: (userSettings?.backup_frequency as "daily" | "weekly" | "monthly") || "weekly",
      cloud_storage_provider: userSettings?.cloud_storage_provider || "",
      cloud_storage_settings: userSettings?.cloud_storage_settings as { provider: string; credentials?: Record<string, string>; bucket?: string } || undefined,
      email_service: (userSettings?.email_service as "resend" | "smtp") || "smtp",
      resend_api_key: userSettings?.resend_api_key || "",
      smtp_host: userSettings?.smtp_host || "",
      smtp_port: userSettings?.smtp_port || "",
      smtp_user: userSettings?.smtp_user || "",
      smtp_password: userSettings?.smtp_password || "",
      smtp_secure: userSettings?.smtp_secure || true,
      appointment_reminder_emails: userSettings?.appointment_reminder_emails || true,
      progress_report_emails: userSettings?.progress_report_emails || true,
      newsletter_emails: userSettings?.newsletter_emails || true,
      email_frequency: (userSettings?.email_frequency as "daily" | "weekly" | "monthly") || "weekly",
      appointment_reminder_template: userSettings?.appointment_reminder_template || "",
      progress_report_template: userSettings?.progress_report_template || "",
      google_fit_connected: userSettings?.google_fit_connected || false,
      apple_health_connected: userSettings?.apple_health_connected || false,
      meal_delivery_connected: userSettings?.meal_delivery_connected || false,
      recipe_planning_connected: userSettings?.recipe_planning_connected || false,
      usda_fooddata_api_key: userSettings?.usda_fooddata_api_key || "",
    },
  });

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
    const defaultSettings: SettingsFormValues = {
      full_name: profile?.full_name || "",
      phone: profile?.phone || "",
      theme: "system",
      language: "pt-BR",
      email_notifications: true,
      open_food_facts_api_key: "",
      google_calendar_connected: false,
      account_active: true,
      appointment_reminder_emails: true,
      progress_report_emails: true,
      newsletter_emails: true,
      email_frequency: "weekly",
      appointment_reminder_template: "",
      progress_report_template: "",
    };

    try {
      const { error } = await supabase
        .from("user_settings")
        .update({
          theme: defaultSettings.theme,
          language: defaultSettings.language,
          email_notifications: defaultSettings.email_notifications,
          google_calendar_connected: defaultSettings.google_calendar_connected,
          account_active: defaultSettings.account_active,
          appointment_reminder_emails: defaultSettings.appointment_reminder_emails,
          progress_report_emails: defaultSettings.progress_report_emails,
          newsletter_emails: defaultSettings.newsletter_emails,
          email_frequency: defaultSettings.email_frequency,
          appointment_reminder_template: defaultSettings.appointment_reminder_template,
          progress_report_template: defaultSettings.progress_report_template,
        })
        .eq("user_id", session?.user?.id);

      if (error) throw error;

      form.reset(defaultSettings);

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

  const components = [
    { id: "profile", component: <ProfileSettings form={form} />, keywords: ["perfil", "nome", "telefone", "endereço", "foto"] },
    { id: "appearance", component: <AppearanceSettings form={form} />, keywords: ["aparência", "tema", "idioma", "modo noturno", "cores"] },
    { id: "notifications", component: <NotificationSettings form={form} />, keywords: ["notificações", "email", "push"] },
    { id: "email", component: <EmailSettings form={form} />, keywords: ["email", "templates", "mensagens", "assinatura", "filtros"] },
    { id: "integrations", component: <IntegrationSettings form={form} />, keywords: ["integrações", "api", "calendar", "saúde"] },
    { id: "account", component: <AccountSettings form={form} />, keywords: ["conta", "ativo"] },
    { id: "backup", component: <BackupSettings />, keywords: ["backup", "restauração", "exportar", "importar", "nuvem"] },
  ];

  const filteredComponents = components.filter(({ keywords }) =>
    keywords.some(keyword => keyword.includes(searchQuery))
  );

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex-1 space-y-8 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Configurações</h1>
            <p className="text-muted-foreground">
              Gerencie suas preferências e configurações da conta
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Redefinir
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Redefinir configurações?</AlertDialogTitle>
                <AlertDialogDescription>
                  Todas as suas configurações serão redefinidas para os valores padrão.
                  Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={resetSettings}>
                  Redefinir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <SearchBar onSearch={filterComponents} />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {filteredComponents.map(({ id, component }) => (
              <div key={id}>{component}</div>
            ))}

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                Salvar Alterações
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
