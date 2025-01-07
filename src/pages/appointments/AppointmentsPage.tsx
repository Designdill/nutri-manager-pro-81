import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Calendar as CalendarIcon } from "lucide-react";
import { AppointmentList } from "./components/AppointmentList";
import { CreateAppointmentDialog } from "./components/CreateAppointmentDialog";
import { useGoogleCalendar } from "./hooks/useGoogleCalendar";

export default function AppointmentsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const queryClient = useQueryClient();
  const { syncWithGoogleCalendar, isGoogleCalendarConnected } = useGoogleCalendar();

  // Fetch appointments
  const { data: appointments = [], isLoading: isLoadingAppointments } = useQuery({
    queryKey: ["appointments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select(`
          id,
          patient_id,
          scheduled_at,
          status,
          notes,
          patients (
            full_name
          )
        `)
        .order("scheduled_at");

      if (error) throw error;
      return data;
    },
  });

  const handleAppointmentUpdate = () => {
    queryClient.invalidateQueries({ queryKey: ["appointments"] });
  };

  // Filter appointments for the selected date
  const todaysAppointments = appointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.scheduled_at);
    return (
      date &&
      appointmentDate.getDate() === date.getDate() &&
      appointmentDate.getMonth() === date.getMonth() &&
      appointmentDate.getFullYear() === date.getFullYear()
    );
  });

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Consultas</h1>
          <div className="flex gap-4">
            {isGoogleCalendarConnected && (
              <Button variant="outline" onClick={() => syncWithGoogleCalendar()}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                Sincronizar com Google Agenda
              </Button>
            )}
            <CreateAppointmentDialog onUpdate={handleAppointmentUpdate} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              locale={ptBR}
              className="rounded-md border shadow animate-in fade-in-50"
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">
              Consultas do dia{" "}
              {date && format(date, "dd 'de' MMMM", { locale: ptBR })}
            </h2>
            <AppointmentList 
              appointments={todaysAppointments} 
              isLoading={isLoadingAppointments}
              onUpdate={handleAppointmentUpdate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}