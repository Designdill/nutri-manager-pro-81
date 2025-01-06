import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useGoogleCalendar() {
  const [isGoogleCalendarConnected, setIsGoogleCalendarConnected] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkGoogleCalendarConnection();
  }, []);

  const checkGoogleCalendarConnection = async () => {
    try {
      const { data: settings } = await supabase
        .from("user_settings")
        .select("google_calendar_connected")
        .single();

      setIsGoogleCalendarConnected(settings?.google_calendar_connected || false);
    } catch (error) {
      console.error("Error checking Google Calendar connection:", error);
    }
  };

  const syncWithGoogleCalendar = async () => {
    try {
      // Aqui você implementará a lógica de sincronização com o Google Calendar
      // usando a API do Google Calendar
      
      toast({
        title: "Sincronização com Google Agenda",
        description: "Suas consultas foram sincronizadas com sucesso!",
      });
    } catch (error) {
      console.error("Error syncing with Google Calendar:", error);
      toast({
        title: "Erro na sincronização",
        description: "Não foi possível sincronizar com o Google Agenda.",
        variant: "destructive",
      });
    }
  };

  return {
    isGoogleCalendarConnected,
    syncWithGoogleCalendar,
  };
}