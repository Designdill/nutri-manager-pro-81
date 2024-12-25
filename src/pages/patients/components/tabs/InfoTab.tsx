import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

interface InfoTabProps {
  patient: any; // TODO: Add proper type
}

export function InfoTab({ patient }: InfoTabProps) {
  return (
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
  );
}