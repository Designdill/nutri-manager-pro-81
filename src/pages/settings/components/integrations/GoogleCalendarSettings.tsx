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
      console.log("Fetching settings for user:", session?.user?.id);
      
      const { data, error } = await supabase
        .from("user_settings")
        .select("google_calendar_connected")
        .eq("user_id", session?.user?.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching user settings:", error);
        return null;
      }

      console.log("Fetched settings:", data);
      
      // Se não houver configurações, retorna valores padrão
      if (!data) {
        console.log("No settings found, using defaults");
        return {
          google_calendar_connected: false
        };
      }

      return data;
    },
    enabled: !!session?.user?.id,
  });

  const handleConnect = async () => {
    try {
      console.log("Connecting Google Calendar for user:", session?.user?.id);
      
      const { error } = await supabase
        .from("user_settings")
        .upsert({ 
          user_id: session?.user?.id,
          google_calendar_connected: true 
        })
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
      console.log("Disconnecting Google Calendar for user:", session?.user?.id);
      
      const { error } = await supabase
        .from("user_settings")
        .upsert({ 
          user_id: session?.user?.id,
          google_calendar_connected: false 
        })
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