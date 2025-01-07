import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Clock, User } from "lucide-react";
import { AppointmentActions } from "./AppointmentActions";
import { cn } from "@/lib/utils";

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
  onUpdate: () => void;
}

export function AppointmentList({ appointments, isLoading, onUpdate }: AppointmentListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-lg" />
        ))}
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-8">
        Nenhuma consulta agendada para este dia.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <div
          key={appointment.id}
          className={cn(
            "flex items-center justify-between p-4 rounded-lg border transition-all",
            "hover:shadow-md animate-in fade-in-50",
            appointment.status === "cancelled" && "opacity-50 bg-gray-50"
          )}
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
          <div className="flex items-center space-x-4">
            <div
              className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                appointment.status === "confirmed"
                  ? "bg-green-100 text-green-800"
                  : appointment.status === "cancelled"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
              )}
            >
              {appointment.status === "confirmed"
                ? "Confirmado"
                : appointment.status === "cancelled"
                ? "Cancelado"
                : "Pendente"}
            </div>
            <AppointmentActions 
              appointment={appointment} 
              onUpdate={onUpdate}
            />
          </div>
        </div>
      ))}
    </div>
  );
}