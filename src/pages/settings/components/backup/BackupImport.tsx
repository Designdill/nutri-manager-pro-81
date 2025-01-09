import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload } from "lucide-react";
import { useAuth } from "@/App";
import { useState } from "react";

export function BackupImport() {
  const { toast } = useToast();
  const { session } = useAuth();
  const [isImporting, setIsImporting] = useState(false);

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsImporting(true);
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
            
            // Update user settings with retry logic
            let attempt = 0;
            const maxRetries = 3;
            let updateSuccess = false;

            while (attempt < maxRetries && !updateSuccess) {
              try {
                const { error: settingsError } = await supabase
                  .from("user_settings")
                  .update(settingsData)
                  .eq("user_id", session?.user?.id);

                if (settingsError) throw settingsError;
                updateSuccess = true;
              } catch (error) {
                console.error(`Attempt ${attempt + 1} failed:`, error);
                attempt++;
                if (attempt < maxRetries) {
                  await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
                } else {
                  throw error;
                }
              }
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
        description: "Não foi possível restaurar suas configurações. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
      // Reset the file input
      event.target.value = '';
    }
  };

  return (
    <div className="flex-1">
      <input
        type="file"
        id="import-backup"
        accept=".json"
        onChange={handleImport}
        className="hidden"
        disabled={isImporting}
      />
      <Button
        onClick={() => document.getElementById("import-backup")?.click()}
        variant="outline"
        className="w-full"
        disabled={isImporting}
      >
        <Upload className="mr-2 h-4 w-4" />
        {isImporting ? "Importando..." : "Importar Backup"}
      </Button>
    </div>
  );
}