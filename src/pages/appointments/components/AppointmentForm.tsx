import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/App";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const appointmentSchema = z.object({
  patient_id: z.string().min(1, "Selecione um paciente"),
  scheduled_at: z.string().min(1, "Data e hora são obrigatórios"),
  notes: z.string().optional(),
  appointment_type: z.enum(["consulta_inicial", "retorno", "emergencia", "telemedicina"]),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

interface AppointmentFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function AppointmentForm({ onSuccess, onCancel }: AppointmentFormProps) {
  const { session } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      notes: "",
      appointment_type: "consulta_inicial",
    },
  });

  // Fetch patients for selection
  const { data: patients = [] } = useQuery({
    queryKey: ["patients", "for-appointment"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("patients")
        .select("id, full_name, phone")
        .eq("nutritionist_id", session?.user.id)
        .order("full_name");

      if (error) throw error;
      return data;
    },
  });

  const onSubmit = async (data: AppointmentFormData) => {
    if (!session?.user.id) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para agendar consultas.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("appointments").insert({
        patient_id: data.patient_id,
        nutritionist_id: session.user.id,
        scheduled_at: data.scheduled_at,
        notes: data.notes || null,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Consulta agendada",
        description: "A consulta foi agendada com sucesso.",
      });

      onSuccess();
    } catch (error: any) {
      console.error("Error creating appointment:", error);
      toast({
        title: "Erro ao agendar consulta",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate time options (8:00 to 18:00, every 30 minutes)
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 8; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === 18 && minute > 0) break;
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        times.push(timeString);
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="patient">Paciente *</Label>
        <Select
          value={form.watch("patient_id") || ""}
          onValueChange={(value) => form.setValue("patient_id", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione um paciente" />
          </SelectTrigger>
          <SelectContent>
            {patients.map((patient) => (
              <SelectItem key={patient.id} value={patient.id}>
                {patient.full_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {form.formState.errors.patient_id && (
          <p className="text-sm text-destructive">{form.formState.errors.patient_id.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Data *</Label>
          <Input
            id="date"
            type="date"
            min={format(new Date(), "yyyy-MM-dd")}
            onChange={(e) => {
              const date = e.target.value;
              const time = form.watch("scheduled_at")?.split("T")[1] || "09:00";
              form.setValue("scheduled_at", `${date}T${time}:00`);
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">Horário *</Label>
          <Select
            value={form.watch("scheduled_at")?.split("T")[1]?.slice(0, 5) || ""}
            onValueChange={(time) => {
              const date = form.watch("scheduled_at")?.split("T")[0] || format(new Date(), "yyyy-MM-dd");
              form.setValue("scheduled_at", `${date}T${time}:00`);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o horário" />
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {form.formState.errors.scheduled_at && (
        <p className="text-sm text-destructive">{form.formState.errors.scheduled_at.message}</p>
      )}

      <div className="space-y-2">
        <Label htmlFor="appointment_type">Tipo de Consulta</Label>
        <Select
          value={form.watch("appointment_type")}
          onValueChange={(value: any) => form.setValue("appointment_type", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="consulta_inicial">Consulta Inicial</SelectItem>
            <SelectItem value="retorno">Retorno</SelectItem>
            <SelectItem value="emergencia">Emergência</SelectItem>
            <SelectItem value="telemedicina">Telemedicina</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          id="notes"
          placeholder="Observações sobre a consulta (opcional)"
          {...form.register("notes")}
        />
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Agendando..." : "Agendar Consulta"}
        </Button>
      </div>
    </form>
  );
}