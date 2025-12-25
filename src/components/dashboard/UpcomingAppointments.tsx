import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, ChevronRight, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

interface Appointment {
  id: string;
  scheduled_at: string;
  patients: {
    full_name: string;
  };
}

interface UpcomingAppointmentsProps {
  appointments: Appointment[];
}

export function UpcomingAppointments({ appointments }: UpcomingAppointmentsProps) {
  const navigate = useNavigate();

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="icon-box-secondary">
              <Calendar className="h-4 w-4" />
            </div>
            <CardTitle className="text-base font-semibold">Próximas Consultas</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate("/appointments")} className="text-xs gap-1">
            Ver todas
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {appointments.map((appointment, index) => (
          <div 
            key={appointment.id} 
            className={cn(
              "flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group",
              index === 0 && "bg-primary/5 border border-primary/10"
            )}
            onClick={() => navigate(`/appointments/${appointment.id}`)}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold",
                index === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}>
                {appointment.patients?.full_name?.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </div>
              <div>
                <p className="font-medium text-sm">{appointment.patients?.full_name}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CalendarDays className="h-3 w-3" />
                  <span>{format(new Date(appointment.scheduled_at), "dd/MM/yyyy", { locale: ptBR })}</span>
                  <Clock className="h-3 w-3 ml-1" />
                  <span>{format(new Date(appointment.scheduled_at), "HH:mm", { locale: ptBR })}</span>
                </div>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </div>
        ))}
        {appointments.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Calendar className="h-10 w-10 text-muted-foreground/50 mb-2" />
            <p className="text-muted-foreground text-sm">Nenhuma consulta agendada</p>
            <Button variant="link" size="sm" onClick={() => navigate("/appointments")} className="mt-1">
              Agendar consulta
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}