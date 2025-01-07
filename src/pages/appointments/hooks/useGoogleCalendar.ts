import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export function useGoogleCalendar() {
  const { data: settings } = useQuery({
    queryKey: ["user-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_settings")
        .select("google_calendar_connected")
        .maybeSingle();

      if (error) {
        console.error("Error fetching user settings:", error);
        return null;
      }

      return data;
    },
  });

  const syncWithGoogleCalendar = async () => {
    toast({
      title: "Google Calendar",
      description: "Sincronização iniciada...",
    });
    // Implementation will be added later
  };

  return {
    isGoogleCalendarConnected: settings?.google_calendar_connected ?? false,
    syncWithGoogleCalendar,
  };
}
