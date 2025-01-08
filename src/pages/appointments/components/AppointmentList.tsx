import { useRealtimeAppointments } from "@/hooks/use-realtime-appointments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { AppointmentActions } from "./AppointmentActions";

export function AppointmentList() {
  const { data: appointments, isLoading, error } = useRealtimeAppointments();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-destructive">
            Erro ao carregar consultas. Por favor, tente novamente.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!appointments?.length) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">
            Nenhuma consulta encontrada para hoje.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <Card key={appointment.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{appointment.patients?.full_name}</span>
              <span className="text-sm font-normal text-muted-foreground">
                {format(new Date(appointment.scheduled_at), "HH:mm", {
                  locale: ptBR,
                })}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Telefone: {appointment.patients?.phone || "Não informado"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Status: {appointment.status}
                </p>
              </div>
              <AppointmentActions appointment={appointment} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}