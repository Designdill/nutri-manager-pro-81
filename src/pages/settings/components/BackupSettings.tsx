import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Download, HelpCircle, Upload } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/App";

export function BackupSettings() {
  const { toast } = useToast();
  const { session } = useAuth();

  const handleExport = async () => {
    try {
      console.log("Starting data export...");
      
      // Fetch user settings
      const { data: settings, error: settingsError } = await supabase
        .from("user_settings")
        .select("*")
        .single();

      if (settingsError) {
        console.error("Error fetching settings:", settingsError);
        throw settingsError;
      }

      // Fetch settings history
      const { data: history, error: historyError } = await supabase
        .from("settings_history")
        .select("*");

      if (historyError) {
        console.error("Error fetching history:", historyError);
        throw historyError;
      }

      const backupData = {
        timestamp: new Date().toISOString(),
        settings,
        history,
      };

      // Create and download backup file
      const blob = new Blob([JSON.stringify(backupData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `nutri-manager-backup-${new Date().toISOString()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Backup exportado com sucesso",
        description: "Suas configurações foram salvas em um arquivo JSON",
      });
    } catch (error) {
      console.error("Error during export:", error);
      toast({
        title: "Erro ao exportar backup",
        description: "Não foi possível exportar suas configurações",
        variant: "destructive",
      });
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      console.log("Starting backup import...");
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          console.log("Reading backup file...");
          const backupData = JSON.parse(e.target?.result as string);
          
          if (backupData.settings) {
            console.log("Processing settings from backup...");
            const { user_id, created_at, updated_at, ...settingsData } = backupData.settings;
            
            // Update user settings
            const { error: settingsError } = await supabase
              .from("user_settings")
              .update(settingsData)
              .eq("user_id", session?.user?.id);

            if (settingsError) {
              console.error("Error updating settings:", settingsError);
              throw settingsError;
            }
          }

          toast({
            title: "Backup restaurado com sucesso",
            description: "Suas configurações foram restauradas",
          });
        } catch (error) {
          console.error("Error processing backup file:", error);
          throw error;
        }
      };

      reader.readAsText(file);
    } catch (error) {
      console.error("Error during import:", error);
      toast({
        title: "Erro ao restaurar backup",
        description: "Não foi possível restaurar suas configurações",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Download className="h-5 w-5" />
            <CardTitle>Backup e Restauração</CardTitle>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Exporte e importe suas configurações</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardDescription>
          Faça backup das suas configurações ou restaure a partir de um arquivo
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
          <Button onClick={handleExport} className="flex-1">
            <Download className="mr-2 h-4 w-4" />
            Exportar Configurações
          </Button>
          <div className="flex-1">
            <input
              type="file"
              id="import-backup"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <Button
              onClick={() => document.getElementById("import-backup")?.click()}
              variant="outline"
              className="w-full"
            >
              <Upload className="mr-2 h-4 w-4" />
              Importar Backup
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}