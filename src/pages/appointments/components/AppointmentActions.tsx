import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AppointmentActionsProps {
  appointment: {
    id: string;
    scheduled_at: string;
    status: "confirmed" | "pending" | "cancelled";
  };
  onUpdate: () => void;
}

export function AppointmentActions({ appointment, onUpdate }: AppointmentActionsProps) {
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [newDate, setNewDate] = useState<Date | undefined>(new Date(appointment.scheduled_at));
  const [newTime, setNewTime] = useState(format(new Date(appointment.scheduled_at), "HH:mm"));
  const [cancelReason, setCancelReason] = useState("");
  const { toast } = useToast();

  const handleReschedule = async () => {
    if (!newDate) return;

    try {
      const [hours, minutes] = newTime.split(":").map(Number);
      const newDateTime = new Date(newDate);
      newDateTime.setHours(hours, minutes);

      const { error } = await supabase
        .from("appointments")
        .update({
          previous_scheduled_at: appointment.scheduled_at,
          scheduled_at: newDateTime.toISOString(),
          status: "confirmed",
        })
        .eq("id", appointment.id);

      if (error) throw error;

      // Record the change
      const { error: changeError } = await supabase
        .from("appointment_changes")
        .insert({
          appointment_id: appointment.id,
          change_type: "reschedule",
          previous_time: appointment.scheduled_at,
          new_time: newDateTime.toISOString(),
        });

      if (changeError) throw changeError;

      toast({
        title: "Consulta remarcada com sucesso",
      });
      setIsRescheduleOpen(false);
      onUpdate();
    } catch (error) {
      console.error("Error rescheduling appointment:", error);
      toast({
        title: "Erro ao remarcar consulta",
        variant: "destructive",
      });
    }
  };

  const handleCancel = async () => {
    try {
      const { error } = await supabase
        .from("appointments")
        .update({
          status: "cancelled",
          cancellation_reason: cancelReason,
          cancellation_time: new Date().toISOString(),
        })
        .eq("id", appointment.id);

      if (error) throw error;

      // Record the change
      const { error: changeError } = await supabase
        .from("appointment_changes")
        .insert({
          appointment_id: appointment.id,
          change_type: "cancel",
          previous_time: appointment.scheduled_at,
          reason: cancelReason,
        });

      if (changeError) throw changeError;

      toast({
        title: "Consulta cancelada com sucesso",
      });
      setIsCancelOpen(false);
      onUpdate();
    } catch (error) {
      console.error("Error canceling appointment:", error);
      toast({
        title: "Erro ao cancelar consulta",
        variant: "destructive",
      });
    }
  };

  if (appointment.status === "cancelled") {
    return null;
  }

  return (
    <div className="flex space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsRescheduleOpen(true)}
      >
        Remarcar
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => setIsCancelOpen(true)}
      >
        Cancelar
      </Button>

      {/* Reschedule Dialog */}
      <Dialog open={isRescheduleOpen} onOpenChange={setIsRescheduleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remarcar Consulta</DialogTitle>
            <DialogDescription>
              Selecione uma nova data e horário para a consulta.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Calendar
              mode="single"
              selected={newDate}
              onSelect={setNewDate}
              locale={ptBR}
              className="rounded-md border"
            />
            <div className="grid gap-2">
              <Label htmlFor="time">Horário</Label>
              <Input
                id="time"
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRescheduleOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleReschedule}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={isCancelOpen} onOpenChange={setIsCancelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar Consulta</DialogTitle>
            <DialogDescription>
              Por favor, informe o motivo do cancelamento.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reason">Motivo do cancelamento</Label>
              <Input
                id="reason"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCancelOpen(false)}>
              Voltar
            </Button>
            <Button variant="destructive" onClick={handleCancel}>
              Confirmar Cancelamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}