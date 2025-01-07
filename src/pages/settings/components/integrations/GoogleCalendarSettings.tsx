import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/App";
import { z } from "zod";

// Schema para validação das configurações
const settingsSchema = z.object({
  google_calendar_connected: z.boolean(),
  user_id: z.string().uuid()
});

export function GoogleCalendarSettings() {
  const { toast } = useToast();
  const { session } = useAuth();
  const queryClient = useQueryClient();

  const { data: settings, isError } = useQuery({
    queryKey: ["user-settings"],
    queryFn: async () => {
      console.log("Fetching settings for user:", session?.user?.id);
      
      if (!session?.user?.id) {
        throw new Error("Usuário não autenticado");
      }

      const { data, error } = await supabase
        .from("user_settings")
        .select("google_calendar_connected")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching user settings:", error);
        throw new Error("Erro ao buscar configurações do usuário");
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
    retry: 1,
    meta: {
      errorMessage: "Não foi possível carregar as configurações do Google Calendar"
    }
  });

  const handleConnect = async () => {
    try {
      console.log("Connecting Google Calendar for user:", session?.user?.id);
      
      if (!session?.user?.id) {
        throw new Error("Usuário não autenticado");
      }

      // Validar dados antes de enviar
      const settingsData = settingsSchema.parse({
        user_id: session.user.id,
        google_calendar_connected: true
      });
      
      const { error } = await supabase
        .from("user_settings")
        .insert({
          user_id: settingsData.user_id,
          google_calendar_connected: settingsData.google_calendar_connected
        })
        .select()
        .single();

      if (error && error.code === '23505') { // Unique violation error code
        // If record exists, update it
        const { error: updateError } = await supabase
          .from("user_settings")
          .update({ google_calendar_connected: true })
          .eq('user_id', settingsData.user_id)
          .select()
          .single();
          
        if (updateError) throw updateError;
      } else if (error) {
        throw error;
      }

      queryClient.invalidateQueries({ queryKey: ["user-settings"] });
      
      toast({
        title: "Google Calendar conectado",
        description: "Suas consultas serão sincronizadas automaticamente.",
      });
    } catch (error) {
      console.error("Error connecting Google Calendar:", error);
      
      let errorMessage = "Não foi possível conectar ao Google Calendar";
      if (error instanceof z.ZodError) {
        errorMessage = "Dados inválidos para conexão";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = async () => {
    try {
      console.log("Disconnecting Google Calendar for user:", session?.user?.id);
      
      if (!session?.user?.id) {
        throw new Error("Usuário não autenticado");
      }

      // Validar dados antes de enviar
      const settingsData = settingsSchema.parse({
        user_id: session.user.id,
        google_calendar_connected: false
      });

      const { error } = await supabase
        .from("user_settings")
        .update({ google_calendar_connected: false })
        .eq('user_id', settingsData.user_id)
        .select()
        .single();

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["user-settings"] });
      
      toast({
        title: "Google Calendar desconectado",
        description: "Suas consultas não serão mais sincronizadas.",
      });
    } catch (error) {
      console.error("Error disconnecting Google Calendar:", error);
      
      let errorMessage = "Não foi possível desconectar do Google Calendar";
      if (error instanceof z.ZodError) {
        errorMessage = "Dados inválidos para desconexão";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: "Erro",
        description: errorMessage,
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
            disabled={isError}
          />
        </div>
        {settings?.google_calendar_connected && (
          <Button
            variant="outline"
            onClick={handleDisconnect}
            className="w-full"
            disabled={isError}
          >
            Desconectar
          </Button>
        )}
      </CardContent>
    </Card>
  );
}