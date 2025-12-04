import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Appointment {
  id: string;
  scheduled_at: string;
  status: string;
  notes: string | null;
}

interface NextAppointmentCardProps {
  appointment: Appointment | null;
}

export function NextAppointmentCard({ appointment }: NextAppointmentCardProps) {
  if (!appointment) {
    return (
      <Card className="border-dashed">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Próxima Consulta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Calendar className="h-10 w-10 text-muted-foreground/50 mb-2" />
            <p className="text-muted-foreground text-sm">
              Nenhuma consulta agendada
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Entre em contato com seu nutricionista para agendar
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const appointmentDate = new Date(appointment.scheduled_at);
  const timeUntil = formatDistanceToNow(appointmentDate, { addSuffix: true, locale: ptBR });

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Próxima Consulta
        </CardTitle>
        <Badge variant="default" className="bg-primary">
          {timeUntil}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
            <span className="text-xl font-bold text-primary">
              {format(appointmentDate, "dd", { locale: ptBR })}
            </span>
          </div>
          <div>
            <p className="font-medium">
              {format(appointmentDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
            </p>
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <Clock className="h-3 w-3" />
              {format(appointmentDate, "HH:mm", { locale: ptBR })}
            </div>
          </div>
        </div>
        
        {appointment.notes && (
          <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
            <span className="font-medium">Observações:</span> {appointment.notes}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
