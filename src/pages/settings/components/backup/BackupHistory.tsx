import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/App";
import { History, Download } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface BackupRecord {
  id: string;
  backup_time: string;
  status: 'success' | 'failed' | 'in_progress';
  file_size: number;
  file_path: string | null;
  error_message: string | null;
}

export function BackupHistory() {
  const { toast } = useToast();
  const { session } = useAuth();

  const { data: backupHistory } = useQuery({
    queryKey: ["backup-history"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("backup_history")
        .select("*")
        .eq("user_id", session?.user?.id)
        .order("backup_time", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as BackupRecord[];
    },
    enabled: !!session?.user?.id,
  });

  const downloadBackup = async (filePath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("backups")
        .download(filePath);

      if (error) throw error;

      // Create a download link
      const url = URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.download = filePath.split("/").pop() || "backup.sql";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading backup:", error);
      toast({
        title: "Erro",
        description: "Não foi possível baixar o backup.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: BackupRecord["status"]) => {
    const variants = {
      success: "bg-green-500",
      failed: "bg-red-500",
      in_progress: "bg-yellow-500",
    };

    return (
      <Badge className={variants[status]}>
        {status === "success" && "Sucesso"}
        {status === "failed" && "Falha"}
        {status === "in_progress" && "Em Andamento"}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <History className="h-5 w-5" />
          <CardTitle>Histórico de Backups</CardTitle>
        </div>
        <CardDescription>
          Últimos backups realizados e seus status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {backupHistory?.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Nenhum backup realizado ainda.
            </p>
          ) : (
            <div className="space-y-4">
              {backupHistory?.map((backup) => (
                <div
                  key={backup.id}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(backup.status)}
                      <span className="text-sm font-medium">
                        {new Date(backup.backup_time).toLocaleString()}
                      </span>
                    </div>
                    {backup.file_size && (
                      <p className="text-sm text-muted-foreground">
                        Tamanho: {(backup.file_size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    )}
                    {backup.error_message && (
                      <p className="text-sm text-red-500">
                        Erro: {backup.error_message}
                      </p>
                    )}
                  </div>
                  {backup.status === "success" && backup.file_path && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadBackup(backup.file_path!)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}