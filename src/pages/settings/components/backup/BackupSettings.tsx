import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from "lucide-react";
import { BackupScheduleSettings } from "./BackupScheduleSettings";
import { BackupHistory } from "./BackupHistory";

export function BackupSettings() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <CardTitle>Backup e Restauração</CardTitle>
          </div>
        </div>
        <CardDescription>
          Configure o agendamento de backups e visualize o histórico
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <BackupScheduleSettings />
        <BackupHistory />
      </CardContent>
    </Card>
  );
}