import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/App";

export function GoogleCalendarSettings() {
  const { toast } = useToast();
  const { session } = useAuth();
  const queryClient = useQueryClient();

  const { data: settings } = useQuery({
    queryKey: ["user-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_settings")
        .select("google_calendar_connected")
        .eq("user_id", session?.user?.id)
        .single();

      if (error) {
        console.error("Error fetching user settings:", error);
        return null;
      }

      return data;
    },
  });

  const handleConnect = async () => {
    try {
      // Here we'll implement the Google OAuth flow
      // For now, we'll just toggle the setting
      const { error } = await supabase
        .from("user_settings")
        .update({ google_calendar_connected: true })
        .eq("user_id", session?.user?.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["user-settings"] });
      
      toast({
        title: "Google Calendar conectado",
        description: "Suas consultas serão sincronizadas automaticamente.",
      });
    } catch (error) {
      console.error("Error connecting Google Calendar:", error);
      toast({
        title: "Erro",
        description: "Não foi possível conectar ao Google Calendar.",
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = async () => {
    try {
      const { error } = await supabase
        .from("user_settings")
        .update({ google_calendar_connected: false })
        .eq("user_id", session?.user?.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["user-settings"] });
      
      toast({
        title: "Google Calendar desconectado",
        description: "Suas consultas não serão mais sincronizadas.",
      });
    } catch (error) {
      console.error("Error disconnecting Google Calendar:", error);
      toast({
        title: "Erro",
        description: "Não foi possível desconectar do Google Calendar.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Google Calendar</CardTitle>
        <CardDescription>
          Sincronize suas consultas com o Google Calendar automaticamente
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="text-sm font-medium">Status da conexão</h4>
            <p className="text-sm text-muted-foreground">
              {settings?.google_calendar_connected
                ? "Conectado"
                : "Desconectado"}
            </p>
          </div>
          <Switch
            checked={settings?.google_calendar_connected || false}
            onCheckedChange={(checked) =>
              checked ? handleConnect() : handleDisconnect()
            }
          />
        </div>
        {settings?.google_calendar_connected && (
          <Button
            variant="outline"
            onClick={handleDisconnect}
            className="w-full"
          >
            Desconectar
          </Button>
        )}
      </CardContent>
    </Card>
  );
}