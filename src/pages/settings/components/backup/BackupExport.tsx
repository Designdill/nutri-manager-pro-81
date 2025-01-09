import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Download } from "lucide-react";
import { useAuth } from "@/App";
import { useState } from "react";

export function BackupExport() {
  const { toast } = useToast();
  const { session } = useAuth();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      console.log("Starting data export...");
      
      // Fetch user settings with retry logic
      const maxRetries = 3;
      let attempt = 0;
      let settings = null;
      let settingsError = null;

      while (attempt < maxRetries && !settings) {
        try {
          const response = await supabase
            .from("user_settings")
            .select("*")
            .eq("user_id", session?.user?.id)
            .maybeSingle();

          if (response.error) throw response.error;
          settings = response.data;
          break;
        } catch (error) {
          console.error(`Attempt ${attempt + 1} failed:`, error);
          settingsError = error;
          attempt++;
          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          }
        }
      }

      if (!settings) {
        throw new Error(settingsError || "Failed to fetch settings after multiple attempts");
      }

      // Fetch settings history
      const { data: history, error: historyError } = await supabase
        .from("settings_history")
        .select("*")
        .eq("user_id", session?.user?.id);

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
        description: "Não foi possível exportar suas configurações. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button 
      onClick={handleExport} 
      className="flex-1"
      disabled={isExporting}
    >
      <Download className="mr-2 h-4 w-4" />
      {isExporting ? "Exportando..." : "Exportar Configurações"}
    </Button>
  );
}