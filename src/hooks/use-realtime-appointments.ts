import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useRef } from "react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

export function useRealtimeAppointments(date?: Date) {
  const queryClient = useQueryClient();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const today = date || new Date();
  const formattedDate = format(today, "yyyy-MM-dd");

  // Query configuration with optimized cache settings
  const query = useQuery({
    queryKey: ["appointments", formattedDate],
    queryFn: async () => {
      console.log("Fetching appointments for date:", formattedDate);
      
      try {
        const { data, error } = await supabase
          .from("appointments")
          .select(`
            id,
            scheduled_at,
            status,
            patients (
              id,
              full_name,
              phone
            )
          `)
          .gte("scheduled_at", `${formattedDate}T00:00:00`)
          .lte("scheduled_at", `${formattedDate}T23:59:59`)
          .order("scheduled_at", { ascending: true });

        if (error) {
          console.error("Error fetching appointments:", error);
          toast({
            title: "Erro ao carregar consultas",
            description: "Houve um problema ao buscar as consultas. Por favor, tente novamente.",
            variant: "destructive",
          });
          throw error;
        }

        return data;
      } catch (error) {
        console.error("Unexpected error fetching appointments:", error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // Data considered fresh for 5 minutes
    cacheTime: 1000 * 60 * 30, // Cache persists for 30 minutes
    retry: 3, // Retry failed requests 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });

  // WebSocket connection management
  useEffect(() => {
    const setupRealtimeSubscription = () => {
      console.log("Setting up realtime subscription for date:", formattedDate);
      
      channelRef.current = supabase
        .channel(`appointments-${formattedDate}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "appointments",
            filter: `scheduled_at=gte.${formattedDate}T00:00:00,scheduled_at=lte.${formattedDate}T23:59:59`,
          },
          (payload) => {
            console.log("Realtime update received:", payload);
            
            // Show toast notification for updates
            const eventMessages = {
              INSERT: "Nova consulta agendada",
              UPDATE: "Consulta atualizada",
              DELETE: "Consulta removida",
            };
            
            toast({
              title: eventMessages[payload.eventType as keyof typeof eventMessages],
              description: "A lista de consultas foi atualizada.",
            });

            // Invalidate query to trigger refresh
            queryClient.invalidateQueries({
              queryKey: ["appointments", formattedDate],
            });
          }
        )
        .subscribe((status) => {
          console.log("Realtime subscription status:", status);
          
          if (status === "SUBSCRIBED") {
            console.log("Successfully subscribed to realtime updates");
          } else if (status === "CLOSED") {
            console.log("Realtime connection closed, attempting to reconnect...");
            // Attempt to reconnect after a delay
            setTimeout(setupRealtimeSubscription, 5000);
          } else if (status === "CHANNEL_ERROR") {
            console.error("Error in realtime channel");
            toast({
              title: "Erro na conexão em tempo real",
              description: "Tentando reconectar...",
              variant: "destructive",
            });
          }
        });
    };

    setupRealtimeSubscription();

    // Cleanup function
    return () => {
      console.log("Cleaning up realtime subscription");
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [formattedDate, queryClient]);

  return {
    ...query,
    refetch: () => {
      console.log("Manually refetching appointments");
      return query.refetch();
    },
  };
}