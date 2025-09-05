import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { AppointmentActions } from "./AppointmentActions";
import { AppointmentStatusManager } from "./AppointmentStatusManager";
import { StartConsultationDialog } from "./StartConsultationDialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Clock, User, Phone, FileText } from "lucide-react";

interface AppointmentListProps {
  appointments: Array<{
    id: string;
    scheduled_at: string;
    status: "confirmed" | "pending" | "cancelled";
    notes?: string | null;
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/10 text-green-600 hover:bg-green-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-600 hover:bg-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 hover:bg-gray-500/20";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmada";
      case "pending":
        return "Pendente";
      case "cancelled":
        return "Cancelada";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <Card key={appointment.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-3 flex-1">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <h3 className="font-semibold text-lg">{appointment.patients?.full_name}</h3>
                    </div>
                    <AppointmentStatusManager
                      appointment={appointment}
                      onUpdate={onUpdate}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>
                      {format(new Date(appointment.scheduled_at), "HH:mm", { locale: ptBR })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{appointment.patients?.phone || "Não informado"}</span>
                  </div>
                </div>

                {appointment.notes && (
                  <div className="flex items-start gap-2 text-sm">
                    <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="text-muted-foreground">{appointment.notes}</span>
                  </div>
                )}
              </div>
              
              
              <div className="flex items-center gap-2">
                <StartConsultationDialog 
                  appointment={appointment}
                  onUpdate={onUpdate}
                />
                <AppointmentActions 
                  appointment={appointment} 
                  onUpdate={onUpdate}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}