import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { AppointmentList } from "./components/AppointmentList";
import { CreateAppointmentDialog } from "./components/CreateAppointmentDialog";
import { useGoogleCalendar } from "./hooks/useGoogleCalendar";
import { useRealtimeAppointments } from "@/hooks/use-realtime-appointments";

export default function AppointmentsPage() {
  const [date, setDate] = useState<Date>(new Date());
  const { syncWithGoogleCalendar, isGoogleCalendarConnected } = useGoogleCalendar();
  const { data: appointments = [], isLoading, error, refetch } = useRealtimeAppointments(date);

  const handleAppointmentUpdate = () => {
    console.log("Manually refreshing appointments after update");
    refetch();
  };

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
              onSelect={(newDate) => newDate && setDate(newDate)}
              locale={ptBR}
              className="rounded-md border shadow animate-in fade-in-50"
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">
              Consultas do dia {format(date, "dd 'de' MMMM", { locale: ptBR })}
            </h2>
            <AppointmentList 
              appointments={appointments}
              isLoading={isLoading}
              error={error as Error}
              onUpdate={handleAppointmentUpdate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}