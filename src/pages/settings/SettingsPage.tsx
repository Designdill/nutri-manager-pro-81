import { useState } from "react";
import { useAuth } from "@/App";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SearchBar } from "./components/SearchBar";
import { ProfileSettings } from "./components/ProfileSettings";
import { AppearanceSettings } from "./components/AppearanceSettings";
import { NotificationSettings } from "./components/NotificationSettings";
import { IntegrationSettings } from "./components/IntegrationSettings";
import { AccountSettings } from "./components/AccountSettings";
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
      theme: (userSettings?.theme as "light" | "dark" | "system") || "system",
      language: (userSettings?.language as "pt-BR" | "en-US") || "pt-BR",
      email_notifications: userSettings?.email_notifications || false,
      open_food_facts_api_key: userSettings?.open_food_facts_api_key || "",
      google_calendar_connected: userSettings?.google_calendar_connected || false,
      account_active: userSettings?.account_active || true,
    },
  });

  const onSubmit = async (data: SettingsFormValues) => {
    setIsLoading(true);
    try {
      const oldSettings = {
        theme: userSettings?.theme,
        language: userSettings?.language,
        email_notifications: userSettings?.email_notifications,
        google_calendar_connected: userSettings?.google_calendar_connected,
        account_active: userSettings?.account_active,
      };

      // Update profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: data.full_name,
          phone: data.phone,
        })
        .eq("id", session?.user?.id);

      if (profileError) throw profileError;

      // Update settings
      const { error: settingsError } = await supabase
        .from("user_settings")
        .update({
          theme: data.theme,
          language: data.language,
          email_notifications: data.email_notifications,
          open_food_facts_api_key: data.open_food_facts_api_key,
          google_calendar_connected: data.google_calendar_connected,
          account_active: data.account_active,
        })
        .eq("user_id", session?.user?.id);

      if (settingsError) throw settingsError;

      // Log settings changes
      const changes = Object.entries(data).filter(
        ([key, value]) => oldSettings[key as keyof typeof oldSettings] !== value
      );

      if (changes.length > 0) {
        const { error: historyError } = await supabase
          .from("settings_history")
          .insert(
            changes.map(([setting_name, new_value]) => ({
              user_id: session?.user?.id,
              setting_name,
              old_value: String(oldSettings[setting_name as keyof typeof oldSettings]),
              new_value: String(new_value),
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
    const defaultSettings = {
      theme: "system",
      language: "pt-BR",
      email_notifications: true,
      google_calendar_connected: false,
      account_active: true,
    };

    try {
      const { error } = await supabase
        .from("user_settings")
        .update(defaultSettings)
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
    { id: "profile", component: <ProfileSettings form={form} />, keywords: ["perfil", "nome", "telefone"] },
    { id: "appearance", component: <AppearanceSettings form={form} />, keywords: ["aparência", "tema", "idioma"] },
    { id: "notifications", component: <NotificationSettings form={form} />, keywords: ["notificações", "email"] },
    { id: "integrations", component: <IntegrationSettings form={form} />, keywords: ["integrações", "api", "calendar"] },
    { id: "account", component: <AccountSettings form={form} />, keywords: ["conta", "ativo"] },
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