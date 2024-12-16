import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Calendar as CalendarIcon, Clock, User } from "lucide-react";

type Appointment = {
  id: string;
  patient_id: string;
  scheduled_at: string;
  status: "confirmed" | "pending" | "cancelled";
  notes: string | null;
  patients: {
    full_name: string;
  };
};

export default function AppointmentsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch appointments
  const { data: appointments = [], isLoading: isLoadingAppointments } = useQuery({
    queryKey: ["appointments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select(`
          id,
          patient_id,
          scheduled_at,
          status,
          notes,
          patients (
            full_name
          )
        `)
        .order("scheduled_at");

      if (error) throw error;
      return data as Appointment[];
    },
  });

  // Fetch patients for the select
  const { data: patients = [] } = useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("patients")
        .select("id, full_name")
        .order("full_name");

      if (error) throw error;
      return data;
    },
  });

  // Create appointment mutation
  const createAppointment = useMutation({
    mutationFn: async ({
      patientId,
      scheduledAt,
      notes,
    }: {
      patientId: string;
      scheduledAt: string;
      notes: string;
    }) => {
      const { data, error } = await supabase.from("appointments").insert([
        {
          patient_id: patientId,
          scheduled_at: scheduledAt,
          notes,
          nutritionist_id: (await supabase.auth.getUser()).data.user?.id,
        },
      ]);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast({
        title: "Consulta agendada com sucesso!",
        description: "O paciente será notificado do agendamento.",
      });
      setSelectedPatient("");
      setSelectedTime("");
      setNotes("");
    },
    onError: (error) => {
      console.error("Error creating appointment:", error);
      toast({
        title: "Erro ao agendar consulta",
        description: "Por favor, tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Filter appointments for the selected date
  const todaysAppointments = appointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.scheduled_at);
    return (
      date &&
      appointmentDate.getDate() === date.getDate() &&
      appointmentDate.getMonth() === date.getMonth() &&
      appointmentDate.getFullYear() === date.getFullYear()
    );
  });

  const handleCreateAppointment = () => {
    if (!selectedPatient || !selectedTime || !date) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const [hours, minutes] = selectedTime.split(":");
    const scheduledAt = new Date(date);
    scheduledAt.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    createAppointment.mutate({
      patientId: selectedPatient,
      scheduledAt: scheduledAt.toISOString(),
      notes,
    });
  };

  // Generate time slots from 8:00 to 18:00
  const timeSlots = Array.from({ length: 21 }, (_, i) => {
    const hour = Math.floor(i / 2) + 8;
    const minute = i % 2 === 0 ? "00" : "30";
    return `${hour.toString().padStart(2, "0")}:${minute}`;
  });

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Consultas</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <CalendarIcon className="mr-2 h-4 w-4" />
                Agendar Nova Consulta
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agendar Nova Consulta</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Select
                    value={selectedPatient}
                    onValueChange={setSelectedPatient}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o paciente" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o horário" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Textarea
                    placeholder="Observações"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
                <Button onClick={handleCreateAppointment}>
                  Confirmar Agendamento
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              locale={ptBR}
              className="rounded-md border shadow"
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">
              Consultas do dia{" "}
              {date && format(date, "dd 'de' MMMM", { locale: ptBR })}
            </h2>
            <div className="space-y-4">
              {isLoadingAppointments ? (
                <p>Carregando consultas...</p>
              ) : todaysAppointments.length === 0 ? (
                <p className="text-muted-foreground">
                  Nenhuma consulta agendada para este dia.
                </p>
              ) : (
                todaysAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex items-center space-x-4">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">
                          {appointment.patients.full_name}
                        </p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="mr-2 h-4 w-4" />
                          {format(
                            new Date(appointment.scheduled_at),
                            "HH:mm",
                            {
                              locale: ptBR,
                            }
                          )}
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
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
