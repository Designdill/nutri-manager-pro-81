import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Play, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface StartConsultationDialogProps {
  appointment: {
    id: string;
    scheduled_at: string;
    status: "confirmed" | "pending" | "cancelled";
    patients: {
      id: string;
      full_name: string;
    };
  };
  onUpdate: () => void;
}

export function StartConsultationDialog({ appointment, onUpdate }: StartConsultationDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const navigate = useNavigate();

  // Only show for confirmed appointments
  if (appointment.status !== "confirmed") {
    return null;
  }

  const handleStartConsultation = async () => {
    setIsStarting(true);
    try {
      // Create a new consultation record
      const { data: consultation, error } = await supabase
        .from("consultations")
        .insert({
          patient_id: appointment.patients.id,
          consultation_date: format(new Date(), "yyyy-MM-dd"),
          weight: 0, // Will be filled in the consultation form
          bmi: 0, // Will be calculated in the consultation form
        })
        .select()
        .single();

      if (error) throw error;

      // Update appointment status to indicate it's in progress
      await supabase
        .from("appointments")
        .update({ 
          status: "confirmed", // Keep as confirmed but we could add "in_progress" status later
          notes: "Consulta iniciada"
        })
        .eq("id", appointment.id);

      toast({
        title: "Consulta iniciada",
        description: "Redirecionando para o formulário de atendimento...",
      });

      setIsOpen(false);
      onUpdate();
      
      // Navigate to patient edit page with consultation tab active
      navigate(`/patients/${appointment.patients.id}/edit?tab=history`);
    } catch (error: any) {
      console.error("Error starting consultation:", error);
      toast({
        title: "Erro ao iniciar consulta",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-primary hover:bg-primary/90">
          <Play className="mr-2 h-4 w-4" />
          Iniciar Consulta
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Iniciar Consulta</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 border rounded-lg">
            <User className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="font-medium">{appointment.patients.full_name}</p>
              <p className="text-sm text-muted-foreground">
                Agendada para {format(new Date(appointment.scheduled_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </p>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Ao iniciar a consulta, você será redirecionado para o formulário de atendimento do paciente onde poderá:</p>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>Registrar medidas e observações</li>
              <li>Atualizar o histórico médico</li>
              <li>Anexar fotos de progresso</li>
              <li>Definir planos nutricionais</li>
            </ul>
          </div>

          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              disabled={isStarting}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleStartConsultation}
              disabled={isStarting}
            >
              {isStarting ? "Iniciando..." : "Iniciar Consulta"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}