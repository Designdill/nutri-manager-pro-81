import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { RotateCcw } from "lucide-react";
import { SettingsFormValues } from "../types";
import { UseFormReset } from "react-hook-form";

interface SettingsHeaderProps {
  onReset: () => Promise<void>;
  resetForm: UseFormReset<SettingsFormValues>;
}

export function SettingsHeader({ onReset, resetForm }: SettingsHeaderProps) {
  const handleReset = async () => {
    await onReset();
    const defaultSettings: SettingsFormValues = {
      full_name: "",
      phone: "",
      theme: "system",
      language: "pt-BR",
      auto_dark_mode: false,
      dark_mode_start: "18:00",
      dark_mode_end: "06:00",
      custom_theme: {
        primary: "#0ea5e9",
        secondary: "#64748b",
        accent: "#f59e0b",
      },
      email_notifications: true,
      push_notifications: true,
      notification_preferences: {
        appointments: true,
        messages: true,
        updates: true,
      },
      email_signature: "",
      email_filters: [],
      open_food_facts_api_key: "",
      google_calendar_connected: false,
      apple_health_connected: false,
      meal_delivery_connected: false,
      recipe_planning_connected: false,
      account_active: true,
      auto_backup: false,
      backup_frequency: "weekly",
      cloud_storage_provider: "",
      email_service: "smtp",
      smtp_secure: true,
      appointment_reminder_emails: true,
      progress_report_emails: true,
      newsletter_emails: true,
      email_frequency: "weekly",
    };
    resetForm(defaultSettings);
  };

  return (
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
            <AlertDialogAction onClick={handleReset}>
              Redefinir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}