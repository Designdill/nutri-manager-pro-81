import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PatientActionsProps {
  patientId: string;
  onDelete: () => void;
}

export function PatientActions({ patientId, onDelete }: PatientActionsProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleViewPatient = () => {
    console.log("Navigating to patient details:", patientId);
    navigate(`/patients/${patientId}/details`);
  };

  const handleEditPatient = () => {
    console.log("Navigating to edit patient:", patientId);
    navigate(`/patients/${patientId}/edit`);
  };

  const handleDeletePatient = async () => {
    try {
      console.log("Deleting patient:", patientId);
      
      // First, delete all related appointments
      const { error: appointmentsError } = await supabase
        .from("appointments")
        .delete()
        .eq("patient_id", patientId);

      if (appointmentsError) {
        console.error("Error deleting appointments:", appointmentsError);
        throw appointmentsError;
      }

      // Then, delete all related consultations
      const { error: consultationsError } = await supabase
        .from("consultations")
        .delete()
        .eq("patient_id", patientId);

      if (consultationsError) {
        console.error("Error deleting consultations:", consultationsError);
        throw consultationsError;
      }

      // Finally, delete the patient
      const { error: patientError } = await supabase
        .from("patients")
        .delete()
        .eq("id", patientId);

      if (patientError) {
        console.error("Error deleting patient:", patientError);
        throw patientError;
      }

      toast({
        title: "Paciente excluído",
        description: "O paciente foi excluído com sucesso.",
      });

      onDelete();
    } catch (error) {
      console.error("Error deleting patient:", error);
      toast({
        title: "Erro ao excluir paciente",
        description: "Ocorreu um erro ao tentar excluir o paciente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-end gap-2">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={handleViewPatient}
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={handleEditPatient}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir paciente</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este paciente? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePatient}
              className="bg-red-500 hover:bg-red-600"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}