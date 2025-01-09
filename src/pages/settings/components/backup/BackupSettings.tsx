import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Database, HelpCircle } from "lucide-react";
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
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Configure e gerencie seus backups</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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