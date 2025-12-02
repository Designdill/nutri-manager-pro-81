import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, XCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AnamnesisViewerProps {
  anamnesis: any;
}

export function AnamnesisViewer({ anamnesis }: AnamnesisViewerProps) {
  const BooleanBadge = ({ value, trueLabel = "Sim", falseLabel = "Não" }: { value: boolean; trueLabel?: string; falseLabel?: string }) => (
    <Badge variant={value ? "default" : "secondary"} className="gap-1">
      {value ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
      {value ? trueLabel : falseLabel}
    </Badge>
  );

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {children}
      </CardContent>
    </Card>
  );

  const Field = ({ label, value }: { label: string; value: any }) => {
    if (!value && value !== 0) return null;
    return (
      <div>
        <span className="font-medium text-sm">{label}: </span>
        <span className="text-muted-foreground text-sm">{value}</span>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-2xl font-bold">{anamnesis.patients?.full_name}</h3>
          <p className="text-muted-foreground">
            {format(new Date(anamnesis.anamnesis_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </p>
        </div>
      </div>

      <Separator />

      <div className="grid gap-4">
        <Section title="Queixa Principal">
          <Field label="Queixa" value={anamnesis.chief_complaint} />
          <Field label="Duração" value={anamnesis.complaint_duration} />
        </Section>

        <Section title="Histórico Médico">
          <Field label="Doenças Anteriores" value={anamnesis.previous_diseases} />
          <Field label="Doenças Atuais" value={anamnesis.current_diseases} />
          <Field label="Hospitalizações" value={anamnesis.hospitalizations} />
          <Field label="Cirurgias" value={anamnesis.surgeries} />
          <Field label="Condições Crônicas" value={anamnesis.chronic_conditions} />
          <Field label="Medicamentos" value={anamnesis.current_medications} />
        </Section>

        <Section title="Histórico Familiar">
          <Field label="Doenças na Família" value={anamnesis.family_diseases} />
          <div className="flex flex-wrap gap-2 mt-2">
            {anamnesis.family_obesity && <Badge>Obesidade</Badge>}
            {anamnesis.family_diabetes && <Badge>Diabetes</Badge>}
            {anamnesis.family_hypertension && <Badge>Hipertensão</Badge>}
            {anamnesis.family_heart_disease && <Badge>Doenças Cardíacas</Badge>}
          </div>
        </Section>

        <Section title="Hábitos Alimentares">
          <Field label="Padrão Alimentar" value={anamnesis.eating_pattern} />
          <Field label="Café da Manhã Habitual" value={anamnesis.usual_breakfast} />
          <Field label="Almoço Habitual" value={anamnesis.usual_lunch} />
          <Field label="Jantar Habitual" value={anamnesis.usual_dinner} />
          <Field label="Lanches Habituais" value={anamnesis.usual_snacks} />
          <Field label="Alergias Alimentares" value={anamnesis.food_allergies} />
          <Field label="Intolerâncias" value={anamnesis.food_intolerances} />
          <Field label="Aversões" value={anamnesis.food_aversions} />
          <Field label="Preferências" value={anamnesis.food_preferences} />
          <Field label="Ingestão de Água" value={anamnesis.water_intake_ml ? `${anamnesis.water_intake_ml} ml` : null} />
          <Field label="Consumo de Álcool" value={anamnesis.alcohol_consumption} />
          <Field label="Consumo de Cafeína" value={anamnesis.caffeine_intake} />
        </Section>

        <Section title="Estilo de Vida">
          <Field label="Tipo de Atividade Física" value={anamnesis.physical_activity_type} />
          <Field label="Frequência" value={anamnesis.physical_activity_frequency} />
          <Field label="Duração" value={anamnesis.physical_activity_duration} />
          <div className="flex gap-2 items-center">
            <span className="font-medium text-sm">Fumante:</span>
            <BooleanBadge value={anamnesis.smoking} />
          </div>
          {anamnesis.smoking_details && <Field label="Detalhes do Tabagismo" value={anamnesis.smoking_details} />}
          <Field label="Horas de Sono" value={anamnesis.sleep_hours} />
          <Field label="Qualidade do Sono" value={anamnesis.sleep_quality} />
          <Field label="Nível de Estresse" value={anamnesis.stress_level} />
        </Section>

        <Section title="Dados Antropométricos">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Peso Atual" value={anamnesis.current_weight ? `${anamnesis.current_weight} kg` : null} />
            <Field label="Altura" value={anamnesis.height ? `${anamnesis.height} cm` : null} />
            <Field label="IMC" value={anamnesis.bmi} />
            <Field label="Circunferência da Cintura" value={anamnesis.waist_circumference ? `${anamnesis.waist_circumference} cm` : null} />
            <Field label="Circunferência do Quadril" value={anamnesis.hip_circumference ? `${anamnesis.hip_circumference} cm` : null} />
            <Field label="% Gordura Corporal" value={anamnesis.body_fat_percentage ? `${anamnesis.body_fat_percentage}%` : null} />
            <Field label="% Massa Muscular" value={anamnesis.muscle_mass_percentage ? `${anamnesis.muscle_mass_percentage}%` : null} />
          </div>
        </Section>

        <Section title="Sintomas">
          <div>
            <p className="font-medium text-sm mb-2">Digestivos:</p>
            <div className="flex flex-wrap gap-2">
              {anamnesis.constipation && <Badge>Constipação</Badge>}
              {anamnesis.diarrhea && <Badge>Diarreia</Badge>}
              {anamnesis.bloating && <Badge>Inchaço</Badge>}
              {anamnesis.heartburn && <Badge>Azia</Badge>}
              {anamnesis.nausea && <Badge>Náusea</Badge>}
            </div>
            {anamnesis.digestive_other && <Field label="Outros" value={anamnesis.digestive_other} />}
          </div>
          <div>
            <p className="font-medium text-sm mb-2">Gerais:</p>
            <div className="flex flex-wrap gap-2">
              {anamnesis.fatigue && <Badge>Fadiga</Badge>}
              {anamnesis.headaches && <Badge>Dores de Cabeça</Badge>}
              {anamnesis.mood_changes && <Badge>Alterações de Humor</Badge>}
              {anamnesis.skin_problems && <Badge>Problemas de Pele</Badge>}
              {anamnesis.hair_loss && <Badge>Queda de Cabelo</Badge>}
            </div>
            {anamnesis.other_symptoms && <Field label="Outros" value={anamnesis.other_symptoms} />}
          </div>
        </Section>

        {(anamnesis.menstrual_cycle || anamnesis.pregnancy_history || anamnesis.lactation) && (
          <Section title="Saúde da Mulher">
            <Field label="Ciclo Menstrual" value={anamnesis.menstrual_cycle} />
            <Field label="Histórico de Gestações" value={anamnesis.pregnancy_history} />
            <div className="flex gap-2 items-center">
              <span className="font-medium text-sm">Lactante:</span>
              <BooleanBadge value={anamnesis.lactation} />
            </div>
          </Section>
        )}

        <Section title="Objetivos e Expectativas">
          <Field label="Meta de Peso" value={anamnesis.weight_goal} />
          <Field label="Objetivos Principais" value={anamnesis.primary_goals} />
          <Field label="Expectativas" value={anamnesis.expectations} />
          <Field label="Nível de Motivação" value={anamnesis.motivation_level} />
          <Field label="Barreiras para Mudança" value={anamnesis.barriers_to_change} />
        </Section>

        {(anamnesis.recent_lab_results || anamnesis.lab_date) && (
          <Section title="Exames Laboratoriais">
            {anamnesis.lab_date && (
              <Field 
                label="Data dos Exames" 
                value={format(new Date(anamnesis.lab_date), "dd/MM/yyyy")} 
              />
            )}
            <Field label="Resultados" value={anamnesis.recent_lab_results} />
          </Section>
        )}

        <Section title="Avaliação Profissional">
          <Field label="Impressão Clínica" value={anamnesis.clinical_impression} />
          <Field label="Diagnóstico Nutricional" value={anamnesis.nutritional_diagnosis} />
          <Field label="Recomendações Iniciais" value={anamnesis.initial_recommendations} />
        </Section>
      </div>
    </div>
  );
}
