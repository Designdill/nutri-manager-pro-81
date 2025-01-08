import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AppointmentActions } from "./AppointmentActions";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AppointmentListProps {
  appointments: Array<{
    id: string;
    scheduled_at: string;
    status: "confirmed" | "pending" | "cancelled";
    patients: {
      id: string;
      full_name: string;
      phone: string;
    };
  }>;
  isLoading: boolean;
  error?: Error | null;
  onUpdate: () => void;
}

export function AppointmentList({ 
  appointments = [], 
  isLoading, 
  error,
  onUpdate 
}: AppointmentListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4" aria-busy="true" role="progressbar">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="p-6">
          <p className="text-destructive font-medium">
            Erro ao carregar consultas
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {error.message || "Por favor, tente novamente mais tarde."}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!appointments.length) {
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
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-medium">{appointment.patients?.full_name}</h3>
                <p className="text-sm text-muted-foreground">
                  Horário: {format(new Date(appointment.scheduled_at), "HH:mm", { locale: ptBR })}
                </p>
                <p className="text-sm text-muted-foreground">
                  Telefone: {appointment.patients?.phone || "Não informado"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Status: {appointment.status}
                </p>
              </div>
              <AppointmentActions 
                appointment={appointment} 
                onUpdate={onUpdate}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}