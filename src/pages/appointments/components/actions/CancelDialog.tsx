import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CancelDialogProps {
  appointment: {
    id: string;
    scheduled_at: string;
  };
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export function CancelDialog({ 
  appointment, 
  isOpen, 
  onOpenChange, 
  onUpdate 
}: CancelDialogProps) {
  const [cancelReason, setCancelReason] = useState("");
  const { toast } = useToast();

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
        description: "O cancelamento foi registrado e os envolvidos serão notificados.",
        className: "bg-blue-500 text-white",
      });
      
      onOpenChange(false);
      onUpdate();
    } catch (error) {
      console.error("Error canceling appointment:", error);
      toast({
        title: "Erro ao cancelar consulta",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
              placeholder="Ex: Indisponibilidade de horário"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Voltar
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleCancel}
            className="animate-in fade-in-50"
          >
            Confirmar Cancelamento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}