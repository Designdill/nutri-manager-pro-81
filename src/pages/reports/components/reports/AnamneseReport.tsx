import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Patient } from "../../types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AnamneseReportProps {
  patient: Patient;
}

export function AnamneseReport({ patient }: AnamneseReportProps) {
  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="space-y-6 print:text-black">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Relatório de Anamnese</h1>
        <p className="text-muted-foreground">
          Gerado em {format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </p>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Dados Pessoais</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Nome Completo</p>
            <p className="font-medium">{patient.full_name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Data de Nascimento</p>
            <p className="font-medium">
              {patient.birth_date
                ? `${format(new Date(patient.birth_date), "dd/MM/yyyy")} (${calculateAge(patient.birth_date)} anos)`
                : "Não informado"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Gênero</p>
            <p className="font-medium">{patient.gender || "Não informado"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Profissão</p>
            <p className="font-medium">{patient.occupation || "Não informado"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">E-mail</p>
            <p className="font-medium">{patient.email || "Não informado"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Telefone</p>
            <p className="font-medium">{patient.phone || "Não informado"}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Antropometria Inicial</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Peso Atual</p>
            <p className="font-medium">{patient.current_weight ? `${patient.current_weight} kg` : "Não informado"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Altura</p>
            <p className="font-medium">{patient.height ? `${patient.height} cm` : "Não informado"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Peso Meta</p>
            <p className="font-medium">{patient.target_weight ? `${patient.target_weight} kg` : "Não informado"}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Saúde</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Tipo Sanguíneo</p>
            <p className="font-medium">{patient.blood_type || "Não informado"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Histórico Familiar</p>
            <p className="font-medium whitespace-pre-wrap">{patient.family_history || "Não informado"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Condições Médicas</p>
            <p className="font-medium whitespace-pre-wrap">{patient.medical_conditions || "Não informado"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Alergias</p>
            <p className="font-medium whitespace-pre-wrap">{patient.allergies || "Não informado"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Medicamentos</p>
            <p className="font-medium whitespace-pre-wrap">{patient.medications || "Não informado"}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Objetivos e Expectativas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Objetivos Nutricionais</p>
            <p className="font-medium whitespace-pre-wrap">{patient.nutritional_goals || "Não informado"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Expectativas do Tratamento</p>
            <p className="font-medium whitespace-pre-wrap">{patient.treatment_expectations || "Não informado"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
