import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/App";
import { Calendar, RefreshCw, AlertCircle } from "lucide-react";

export function FunctionalGoogleCalendar() {
  const { toast } = useToast();
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [calendarId, setCalendarId] = useState("");

  const { data: settings, error } = useQuery({
    queryKey: ["user-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_settings")
        .select("google_calendar_connected")
        .eq("user_id", session?.user?.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching user settings:", error);
        return null;
      }

      return data;
    },
    enabled: !!session?.user?.id,
  });

  const handleConnect = async () => {
    if (!calendarId.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira o ID do calendário do Google",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from("user_settings")
        .upsert({
          user_id: session?.user?.id!,
          google_calendar_connected: true,
        });

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["user-settings"] });
      
      toast({
        title: "Google Calendar conectado",
        description: "Seus agendamentos serão sincronizados automaticamente",
      });
    } catch (error) {
      console.error("Error connecting Google Calendar:", error);
      toast({
        title: "Erro na conexão",
        description: "Não foi possível conectar ao Google Calendar",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from("user_settings")
        .update({
          google_calendar_connected: false,
        })
        .eq("user_id", session?.user?.id!);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["user-settings"] });
      setCalendarId("");
      
      toast({
        title: "Google Calendar desconectado",
        description: "A sincronização foi interrompida",
      });
    } catch (error) {
      console.error("Error disconnecting Google Calendar:", error);
      toast({
        title: "Erro na desconexão",
        description: "Não foi possível desconectar do Google Calendar",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSync = async () => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.functions.invoke('sync-google-calendar', {
        body: { calendarId }
      });

      if (error) throw error;

      toast({
        title: "Sincronização iniciada",
        description: "Seus agendamentos estão sendo sincronizados",
      });
    } catch (error) {
      console.error("Error syncing calendar:", error);
      toast({
        title: "Erro na sincronização",
        description: "Não foi possível sincronizar o calendário",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isConnected = settings?.google_calendar_connected ?? false;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          <CardTitle>Google Calendar</CardTitle>
        </div>
        <CardDescription>
          Sincronize seus agendamentos com o Google Calendar
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConnected ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="calendar-id">ID do Calendário</Label>
              <Input
                id="calendar-id"
                value={calendarId}
                onChange={(e) => setCalendarId(e.target.value)}
                placeholder="exemplo@gmail.com"
                disabled={isLoading}
              />
              <p className="text-sm text-muted-foreground">
                Encontre o ID nas configurações do seu calendário no Google
              </p>
            </div>
            <Button 
              onClick={handleConnect} 
              disabled={isLoading}
              className="w-full"
            >
              Conectar Google Calendar
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm font-medium">Conectado</span>
              </div>
              <Switch checked={true} disabled />
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleSync} 
                disabled={isLoading}
                className="flex-1"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Sincronizar Agora
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDisconnect} 
                disabled={isLoading}
              >
                Desconectar
              </Button>
            </div>

            <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20">
              <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
              <div className="text-sm text-amber-700 dark:text-amber-300">
                <p className="font-medium">Configuração necessária</p>
                <p>Para funcionar completamente, configure as credenciais do Google Calendar nas configurações do servidor.</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}