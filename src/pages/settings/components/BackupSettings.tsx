import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Download, Upload } from "lucide-react";
import { useState } from "react";

export const BackupSettings = () => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      console.log("Starting data export...");
      
      // Fetch user settings
      const { data: settings } = await supabase
        .from("user_settings")
        .select("*")
        .single();

      // Fetch settings history
      const { data: history } = await supabase
        .from("settings_history")
        .select("*");

      const backupData = {
        timestamp: new Date().toISOString(),
        settings,
        history,
      };

      // Create and download backup file
      const blob = new Blob([JSON.stringify(backupData, null, 2)], {
        type: "application/json",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `backup-${new Date().toISOString()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Backup realizado com sucesso",
        description: "Seus dados foram exportados com sucesso.",
      });
    } catch (error) {
      console.error("Error exporting data:", error);
      toast({
        title: "Erro ao realizar backup",
        description: "Ocorreu um erro ao exportar seus dados.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      console.log("Starting data import...");
      
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const backupData = JSON.parse(e.target?.result as string);
          
          if (backupData.settings) {
            // Update user settings
            const { error: settingsError } = await supabase
              .from("user_settings")
              .upsert(backupData.settings);

            if (settingsError) throw settingsError;
          }

          toast({
            title: "Restauração concluída",
            description: "Seus dados foram restaurados com sucesso.",
          });
        } catch (error) {
          console.error("Error parsing backup file:", error);
          toast({
            title: "Erro na restauração",
            description: "O arquivo de backup parece estar corrompido ou inválido.",
            variant: "destructive",
          });
        }
      };

      reader.readAsText(file);
    } catch (error) {
      console.error("Error importing data:", error);
      toast({
        title: "Erro na restauração",
        description: "Ocorreu um erro ao importar seus dados.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
      // Reset file input
      event.target.value = "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Backup e Restauração</CardTitle>
        <CardDescription>
          Exporte seus dados para backup ou restaure a partir de um arquivo de backup
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
          <Button
            onClick={handleExportData}
            disabled={isExporting}
            className="w-full sm:w-auto"
          >
            <Download className="mr-2 h-4 w-4" />
            {isExporting ? "Exportando..." : "Exportar Dados"}
          </Button>
          
          <div className="relative w-full sm:w-auto">
            <input
              type="file"
              accept=".json"
              onChange={handleImportData}
              disabled={isImporting}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
            <Button
              variant="outline"
              disabled={isImporting}
              className="w-full sm:w-auto"
            >
              <Upload className="mr-2 h-4 w-4" />
              {isImporting ? "Importando..." : "Importar Backup"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};