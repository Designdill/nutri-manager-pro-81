import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileQuestion, Plus } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { PatientPhotos } from "@/components/patients/photos/PatientPhotos";

interface InfoTabProps {
  patient: any; // TODO: Add proper type
}

export function InfoTab({ patient }: InfoTabProps) {
  const navigate = useNavigate();

  const handleNewQuestionnaire = () => {
    console.log("Creating new questionnaire for patient:", patient.id);
    navigate(`/questionnaires/new?patientId=${patient.id}`);
  };

  const handleViewQuestionnaires = () => {
    console.log("Viewing questionnaires for patient:", patient.id);
    navigate(`/questionnaires?patientId=${patient.id}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <Button 
          variant="outline" 
          onClick={handleViewQuestionnaires}
          className="flex items-center gap-2"
        >
          <FileQuestion className="h-4 w-4" />
          Ver Questionários
        </Button>
        <Button 
          onClick={handleNewQuestionnaire}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Novo Questionário
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Paciente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium">Email</h3>
              <p className="text-muted-foreground">{patient?.email || "-"}</p>
            </div>
            <div>
              <h3 className="font-medium">Telefone</h3>
              <p className="text-muted-foreground">{patient?.phone || "-"}</p>
            </div>
            <div>
              <h3 className="font-medium">Data de Nascimento</h3>
              <p className="text-muted-foreground">
                {patient?.birth_date
                  ? format(new Date(patient.birth_date), "dd/MM/yyyy")
                  : "-"}
              </p>
            </div>
            <div>
              <h3 className="font-medium">Peso Atual</h3>
              <p className="text-muted-foreground">
                {patient?.current_weight ? `${patient.current_weight} kg` : "-"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <PatientPhotos patientId={patient.id} />
    </div>
  );
}