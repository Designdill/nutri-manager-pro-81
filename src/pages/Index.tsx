import { Button } from "@/components/ui/button";
import { AppSidebar } from "@/components/AppSidebar";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/App";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { DashboardActions } from "@/components/dashboard/DashboardActions";
import { UpcomingAppointments } from "@/components/dashboard/UpcomingAppointments";
import { RecentNotifications } from "@/components/dashboard/RecentNotifications";

export default function Index() {
  const navigate = useNavigate();
  const { session } = useAuth();

  // Fetch total patients
  const { data: patients = [] } = useQuery({
    queryKey: ["dashboard-patients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("patients")
        .select("id")
        .eq("nutritionist_id", session?.user?.id);

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  // Fetch today's appointments
  const { data: todayAppointments = [] } = useQuery({
    queryKey: ["dashboard-appointments"],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data, error } = await supabase
        .from("appointments")
        .select("id")
        .eq("nutritionist_id", session?.user?.id)
        .eq("status", "confirmed")
        .gte("scheduled_at", today.toISOString())
        .lt("scheduled_at", new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  // Fetch unread messages
  const { data: unreadMessages = [] } = useQuery({
    queryKey: ["dashboard-messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("id")
        .eq("recipient_id", session?.user?.id)
        .eq("read", false);

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const currentDateTime = format(new Date(), "dd/MM/yyyy HH:mm", { locale: ptBR });

  // Sample data for charts (you can replace with real data later)
  const progressData = [
    { month: "Jan", patients: patients.length },
    { month: "Fev", patients: patients.length + 2 },
    { month: "Mar", patients: patients.length + 4 },
    { month: "Abr", patients: patients.length + 6 },
  ];

  const consultationData = [
    { name: "Segunda", value: 5 },
    { name: "Terça", value: 7 },
    { name: "Quarta", value: 4 },
    { name: "Quinta", value: 6 },
    { name: "Sexta", value: 8 },
  ];

  // Fetch upcoming appointments
  const { data: upcomingAppointments = [] } = useQuery({
    queryKey: ["dashboard-upcoming-appointments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select(`
          id,
          scheduled_at,
          patients (
            full_name
          )
        `)
        .eq("nutritionist_id", session?.user?.id)
        .eq("status", "confirmed")
        .gte("scheduled_at", new Date().toISOString())
        .order("scheduled_at")
        .limit(5);

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  // Fetch recent notifications
  const { data: recentNotifications = [] } = useQuery({
    queryKey: ["dashboard-notifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", session?.user?.id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex-1 p-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Bem-vindo ao Nutri Manager Pro</h1>
              <p className="text-muted-foreground mt-1">Data e Hora Atual: {currentDateTime}</p>
            </div>
            <Button onClick={handleSignOut} variant="outline">
              Sair
            </Button>
          </div>

          <DashboardStats
            totalPatients={patients.length}
            todayAppointments={todayAppointments.length}
            unreadMessages={unreadMessages.length}
          />

          <DashboardActions />

          <DashboardCharts
            progressData={progressData}
            consultationData={consultationData}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <UpcomingAppointments appointments={upcomingAppointments} />
            <RecentNotifications notifications={recentNotifications} />
          </div>
        </div>
      </div>
    </div>
  );
}