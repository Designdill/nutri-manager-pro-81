import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from "lucide-react";
import { BackupScheduleSettings } from "./BackupScheduleSettings";
import { BackupHistory } from "./BackupHistory";
import { EnhancedImportExport } from "./EnhancedImportExport";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormValues } from "../../types/settings-form";

interface BackupSettingsProps {
  form?: UseFormReturn<SettingsFormValues>;
}

export function BackupSettings({ form }: BackupSettingsProps) {
  return (
    <div className="space-y-6">
      {form && <EnhancedImportExport form={form} />}
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <CardTitle>Backup Automático</CardTitle>
            </div>
          </div>
          <CardDescription>
            Configure o agendamento de backups automáticos e visualize o histórico
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <BackupScheduleSettings />
          <BackupHistory />
        </CardContent>
      </Card>
    </div>
  );
}