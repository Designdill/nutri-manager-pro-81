import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { format } from "date-fns";

export function useRealtimeAppointments(date?: Date) {
  const queryClient = useQueryClient();
  const today = date || new Date();
  const formattedDate = format(today, "yyyy-MM-dd");

  // Query principal com cache
  const query = useQuery({
    queryKey: ["appointments", formattedDate],
    queryFn: async () => {
      console.log("Fetching appointments for date:", formattedDate);
      
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
        throw error;
      }

      return data;
    },
    staleTime: 1000 * 60 * 5, // Cache válido por 5 minutos
  });

  // Configurar subscription em tempo real
  useEffect(() => {
    const channel = supabase
      .channel("appointments-changes")
      .on(
        "postgres_changes",
        {
          event: "*", // Escuta todos os eventos (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "appointments",
          filter: `scheduled_at=gte.${formattedDate}T00:00:00,scheduled_at=lte.${formattedDate}T23:59:59`,
        },
        (payload) => {
          console.log("Realtime update received:", payload);
          // Invalidar o cache para forçar uma nova busca
          queryClient.invalidateQueries({
            queryKey: ["appointments", formattedDate],
          });
        }
      )
      .subscribe((status) => {
        console.log("Realtime subscription status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [formattedDate, queryClient]);

  return query;
}