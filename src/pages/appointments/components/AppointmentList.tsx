import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Clock, User } from "lucide-react";

interface Appointment {
  id: string;
  patient_id: string;
  scheduled_at: string;
  status: "confirmed" | "pending" | "cancelled";
  notes: string | null;
  patients: {
    full_name: string;
  };
}

interface AppointmentListProps {
  appointments: Appointment[];
  isLoading: boolean;
}

export function AppointmentList({ appointments, isLoading }: AppointmentListProps) {
  if (isLoading) {
    return <p>Carregando consultas...</p>;
  }

  if (appointments.length === 0) {
    return (
      <p className="text-muted-foreground">
        Nenhuma consulta agendada para este dia.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <div
          key={appointment.id}
          className="flex items-center justify-between p-4 rounded-lg border"
        >
          <div className="flex items-center space-x-4">
            <User className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">{appointment.patients.full_name}</p>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-2 h-4 w-4" />
                {format(new Date(appointment.scheduled_at), "HH:mm", {
                  locale: ptBR,
                })}
              </div>
            </div>
          </div>
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              appointment.status === "confirmed"
                ? "bg-green-100 text-green-800"
                : appointment.status === "cancelled"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {appointment.status === "confirmed"
              ? "Confirmado"
              : appointment.status === "cancelled"
              ? "Cancelado"
              : "Pendente"}
          </div>
        </div>
      ))}
    </div>
  );
}