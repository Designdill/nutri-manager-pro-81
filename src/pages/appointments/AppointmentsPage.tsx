import { useState, useMemo } from "react";
import { format, addDays, startOfWeek, endOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarIcon, Filter } from "lucide-react";
import { AppointmentList } from "./components/AppointmentList";
import { CreateAppointmentDialog } from "./components/CreateAppointmentDialog";
import { AppointmentFiltersComponent, AppointmentFilters } from "./components/AppointmentFilters";
import { useGoogleCalendar } from "./hooks/useGoogleCalendar";
import { useRealtimeAppointments } from "@/hooks/use-realtime-appointments";

export default function AppointmentsPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<"day" | "week">("day");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<AppointmentFilters>({
    searchTerm: "",
    status: "all",
    appointmentType: "all",
  });

  const { syncWithGoogleCalendar, isGoogleCalendarConnected } = useGoogleCalendar();
  const { data: appointments = [], isLoading, error, refetch } = useRealtimeAppointments(date);

  const handleAppointmentUpdate = () => {
    console.log("Manually refreshing appointments after update");
    refetch();
  };

  // Filter appointments based on search criteria
  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      let matches = true;

      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        matches = matches && (
          appointment.patients?.full_name?.toLowerCase().includes(searchLower) ||
          appointment.notes?.toLowerCase().includes(searchLower)
        );
      }

      // Status filter
      if (filters.status !== "all") {
        matches = matches && appointment.status === filters.status;
      }

      return matches;
    });
  }, [appointments, filters]);

  // Get week range for display
  const weekStart = startOfWeek(date, { locale: ptBR });
  const weekEnd = endOfWeek(date, { locale: ptBR });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Consultas</h1>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
            {isGoogleCalendarConnected && (
              <Button variant="outline" onClick={() => syncWithGoogleCalendar()}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                Sincronizar com Google Agenda
              </Button>
            )}
            <CreateAppointmentDialog onUpdate={handleAppointmentUpdate} />
          </div>
        </div>

        {showFilters && (
          <div className="mb-6">
            <AppointmentFiltersComponent
              filters={filters}
              onFiltersChange={setFilters}
              appointmentCount={filteredAppointments.length}
            />
          </div>
        )}

        <Tabs value={view} onValueChange={(value: any) => setView(value)} className="space-y-6">
          <TabsList>
            <TabsTrigger value="day">Visualização Diária</TabsTrigger>
            <TabsTrigger value="week">Visualização Semanal</TabsTrigger>
          </TabsList>

          <TabsContent value="day" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  locale={ptBR}
                  className="rounded-md border shadow animate-in fade-in-50"
                />
              </div>

              <div className="lg:col-span-2">
                <h2 className="text-lg font-semibold mb-4">
                  Consultas do dia {format(date, "dd 'de' MMMM", { locale: ptBR })}
                </h2>
                <AppointmentList 
                  appointments={filteredAppointments}
                  isLoading={isLoading}
                  error={error as Error}
                  onUpdate={handleAppointmentUpdate}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="week" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  locale={ptBR}
                  className="rounded-md border shadow animate-in fade-in-50"
                />
                <div className="mt-4 text-sm text-muted-foreground">
                  Semana de {format(weekStart, "dd/MM", { locale: ptBR })} a{" "}
                  {format(weekEnd, "dd/MM", { locale: ptBR })}
                </div>
              </div>

              <div className="lg:col-span-2">
                <h2 className="text-lg font-semibold mb-4">
                  Consultas da Semana
                </h2>
                <div className="space-y-4">
                  {weekDays.map((day) => {
                    const dayAppointments = filteredAppointments.filter(
                      (apt) => format(new Date(apt.scheduled_at), "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
                    );
                    
                    return (
                      <div key={day.toISOString()} className="border rounded-lg p-4">
                        <h3 className="font-medium mb-2">
                          {format(day, "EEEE, dd 'de' MMMM", { locale: ptBR })}
                          <span className="ml-2 text-sm text-muted-foreground">
                            ({dayAppointments.length} consulta{dayAppointments.length !== 1 ? 's' : ''})
                          </span>
                        </h3>
                        {dayAppointments.length > 0 ? (
                          <AppointmentList 
                            appointments={dayAppointments}
                            isLoading={false}
                            error={null}
                            onUpdate={handleAppointmentUpdate}
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Nenhuma consulta agendada
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}