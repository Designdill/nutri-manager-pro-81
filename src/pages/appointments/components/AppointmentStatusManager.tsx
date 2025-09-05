import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { CheckCircle, Clock, XCircle, Calendar } from "lucide-react";

interface AppointmentStatusManagerProps {
  appointment: {
    id: string;
    status: "confirmed" | "pending" | "cancelled";
    scheduled_at: string;
    patients: {
      full_name: string;
    };
  };
  onUpdate: () => void;
}

export function AppointmentStatusManager({ appointment, onUpdate }: AppointmentStatusManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newStatus, setNewStatus] = useState(appointment.status);
  const [notes, setNotes] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

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

  const handleStatusUpdate = async () => {
    if (newStatus === appointment.status && !notes) {
      setIsOpen(false);
      return;
    }

    setIsUpdating(true);
    try {
      const updateData: any = {};
      
      if (newStatus !== appointment.status) {
        updateData.status = newStatus;
        
        if (newStatus === "cancelled") {
          updateData.cancellation_time = new Date().toISOString();
          updateData.cancellation_reason = notes || "Cancelada pelo profissional";
        }
      }

      if (notes) {
        updateData.notes = notes;
      }

      const { error } = await supabase
        .from("appointments")
        .update(updateData)
        .eq("id", appointment.id);

      if (error) throw error;

      toast({
        title: "Status atualizado",
        description: `Consulta ${getStatusLabel(newStatus).toLowerCase()} com sucesso.`,
      });

      setIsOpen(false);
      onUpdate();
    } catch (error: any) {
      console.error("Error updating appointment status:", error);
      toast({
        title: "Erro ao atualizar status",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Badge 
          className={`${getStatusColor(appointment.status)} cursor-pointer flex items-center gap-1`}
        >
          {getStatusIcon(appointment.status)}
          {getStatusLabel(appointment.status)}
        </Badge>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Gerenciar Status da Consulta</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">
              Paciente: <span className="font-medium">{appointment.patients.full_name}</span>
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Novo Status</Label>
            <Select value={newStatus} onValueChange={(value: typeof newStatus) => setNewStatus(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Pendente
                  </div>
                </SelectItem>
                <SelectItem value="confirmed">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Confirmada
                  </div>
                </SelectItem>
                <SelectItem value="cancelled">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    Cancelada
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">
              {newStatus === "cancelled" ? "Motivo do cancelamento" : "Observações"}
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={
                newStatus === "cancelled" 
                  ? "Descreva o motivo do cancelamento..." 
                  : "Adicione observações (opcional)..."
              }
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              disabled={isUpdating}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleStatusUpdate}
              disabled={isUpdating}
            >
              {isUpdating ? "Atualizando..." : "Atualizar Status"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}