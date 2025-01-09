import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/App";
import { useState } from "react";
import { Calendar, Clock, Database } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export function BackupScheduleSettings() {
  const { toast } = useToast();
  const { session } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);

  const { data: settings } = useQuery({
    queryKey: ["user-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_settings")
        .select("backup_schedule, backup_retention_days, last_backup_at, next_backup_at")
        .eq("user_id", session?.user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const updateBackupSettings = async (schedule: string, retentionDays: number) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("user_settings")
        .update({
          backup_schedule: schedule,
          backup_retention_days: retentionDays,
        })
        .eq("user_id", session?.user?.id);

      if (error) throw error;

      toast({
        title: "Configurações atualizadas",
        description: "As configurações de backup foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error("Error updating backup settings:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar as configurações de backup.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const startManualBackup = async () => {
    setIsBackingUp(true);
    try {
      const { error } = await supabase.functions.invoke("create-backup", {
        body: { userId: session?.user?.id },
      });

      if (error) throw error;

      toast({
        title: "Backup iniciado",
        description: "O backup manual foi iniciado com sucesso.",
      });
    } catch (error) {
      console.error("Error starting backup:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao iniciar o backup.",
        variant: "destructive",
      });
    } finally {
      setIsBackingUp(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Database className="h-5 w-5" />
          <CardTitle>Agendamento de Backup</CardTitle>
        </div>
        <CardDescription>
          Configure a frequência dos backups e o período de retenção
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Frequência do Backup</label>
            <Select
              defaultValue={settings?.backup_schedule || "daily"}
              onValueChange={(value) => 
                updateBackupSettings(value, settings?.backup_retention_days || 30)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a frequência" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Diário</SelectItem>
                <SelectItem value="weekly">Semanal</SelectItem>
                <SelectItem value="monthly">Mensal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Período de Retenção (dias)</label>
            <Input
              type="number"
              defaultValue={settings?.backup_retention_days || 30}
              min={1}
              max={365}
              onChange={(e) => 
                updateBackupSettings(
                  settings?.backup_schedule || "daily",
                  parseInt(e.target.value)
                )
              }
            />
          </div>

          {settings?.last_backup_at && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Último backup: {new Date(settings.last_backup_at).toLocaleString()}</span>
            </div>
          )}

          {settings?.next_backup_at && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Próximo backup: {new Date(settings.next_backup_at).toLocaleString()}</span>
            </div>
          )}
        </div>

        <Button 
          onClick={startManualBackup}
          disabled={isBackingUp}
          className="w-full"
        >
          {isBackingUp ? "Iniciando backup..." : "Iniciar Backup Manual"}
        </Button>
      </CardContent>
    </Card>
  );
}