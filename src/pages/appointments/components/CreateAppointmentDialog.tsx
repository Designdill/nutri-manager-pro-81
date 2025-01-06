import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
import { Calendar } from "lucide-react";

export function CreateAppointmentDialog() {
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Generate time slots from 8:00 to 18:00
  const timeSlots = Array.from({ length: 21 }, (_, i) => {
    const hour = Math.floor(i / 2) + 8;
    const minute = i % 2 === 0 ? "00" : "30";
    return `${hour.toString().padStart(2, "0")}:${minute}`;
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

  const handleCreateAppointment = () => {
    if (!selectedPatient || !selectedTime) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const [hours, minutes] = selectedTime.split(":");
    const scheduledAt = new Date();
    scheduledAt.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    createAppointment.mutate({
      patientId: selectedPatient,
      scheduledAt: scheduledAt.toISOString(),
      notes,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Calendar className="mr-2 h-4 w-4" />
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
  );
}