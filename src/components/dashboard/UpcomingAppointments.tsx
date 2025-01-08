import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

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
    <Card>
      <CardHeader>
        <CardTitle>Próximas Consultas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">{appointment.patients?.full_name}</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(appointment.scheduled_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate(`/appointments/${appointment.id}`)}>
                Ver detalhes
              </Button>
            </div>
          ))}
          {appointments.length === 0 && (
            <p className="text-muted-foreground text-center py-4">
              Nenhuma consulta agendada
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}