import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Patient, MealPlan } from "../../types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface NutritionalReportProps {
  patient: Patient;
  mealPlan: MealPlan | null;
}

export function NutritionalReport({ patient, mealPlan }: NutritionalReportProps) {
  return (
    <div className="space-y-6 print:text-black">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Relatório Nutricional</h1>
        <p className="text-xl font-medium">{patient.full_name}</p>
        <p className="text-sm text-muted-foreground">
          Gerado em {format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </p>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>🎯 Objetivos e Metas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Objetivos Nutricionais</p>
            <p className="font-medium whitespace-pre-wrap">{patient.nutritional_goals || "Não definidos"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Expectativas do Tratamento</p>
            <p className="font-medium whitespace-pre-wrap">{patient.treatment_expectations || "Não definidas"}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Peso Atual</p>
              <p className="text-2xl font-bold">
                {patient.current_weight ? `${patient.current_weight} kg` : "Não registrado"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Meta de Peso</p>
              <p className="text-2xl font-bold">
                {patient.target_weight ? `${patient.target_weight} kg` : "Não definida"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {mealPlan ? (
        <Card>
          <CardHeader>
            <CardTitle>🍽️ Plano Alimentar Atual</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Título do Plano</p>
              <p className="font-bold text-lg">{mealPlan.title}</p>
            </div>
            {mealPlan.description && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Descrição</p>
                <p className="font-medium whitespace-pre-wrap">{mealPlan.description}</p>
              </div>
            )}

            <Separator />

            {mealPlan.breakfast && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">☀️ Café da Manhã</p>
                <p className="font-medium whitespace-pre-wrap">{mealPlan.breakfast}</p>
              </div>
            )}

            {mealPlan.morning_snack && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">🥤 Lanche da Manhã</p>
                <p className="font-medium whitespace-pre-wrap">{mealPlan.morning_snack}</p>
              </div>
            )}

            {mealPlan.lunch && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">🍴 Almoço</p>
                <p className="font-medium whitespace-pre-wrap">{mealPlan.lunch}</p>
              </div>
            )}

            {mealPlan.afternoon_snack && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">☕ Lanche da Tarde</p>
                <p className="font-medium whitespace-pre-wrap">{mealPlan.afternoon_snack}</p>
              </div>
            )}

            {mealPlan.dinner && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">🌙 Jantar</p>
                <p className="font-medium whitespace-pre-wrap">{mealPlan.dinner}</p>
              </div>
            )}

            {mealPlan.evening_snack && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">🌜 Ceia</p>
                <p className="font-medium whitespace-pre-wrap">{mealPlan.evening_snack}</p>
              </div>
            )}

            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                Plano criado em {format(new Date(mealPlan.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Nenhum plano alimentar ativo para este paciente.</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>⚠️ Restrições e Alergias</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Alergias</p>
            <p className="font-medium whitespace-pre-wrap">{patient.allergies || "Nenhuma alergia registrada"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Condições Médicas</p>
            <p className="font-medium whitespace-pre-wrap">
              {patient.medical_conditions || "Nenhuma condição médica registrada"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
