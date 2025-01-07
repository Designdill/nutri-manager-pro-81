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

interface RescheduleDialogProps {
  appointment: {
    id: string;
    scheduled_at: string;
  };
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export function RescheduleDialog({ 
  appointment, 
  isOpen, 
  onOpenChange, 
  onUpdate 
}: RescheduleDialogProps) {
  const [newDate, setNewDate] = useState<Date | undefined>(
    new Date(appointment.scheduled_at)
  );
  const [newTime, setNewTime] = useState(
    format(new Date(appointment.scheduled_at), "HH:mm")
  );
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
        description: "A nova data foi registrada e os envolvidos serão notificados.",
        className: "bg-green-500 text-white",
      });
      
      onOpenChange(false);
      onUpdate();
    } catch (error) {
      console.error("Error rescheduling appointment:", error);
      toast({
        title: "Erro ao remarcar consulta",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
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
            className="rounded-md border animate-in fade-in-50"
          />
          <div className="grid gap-2">
            <Label htmlFor="time">Horário</Label>
            <Input
              id="time"
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleReschedule}>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}