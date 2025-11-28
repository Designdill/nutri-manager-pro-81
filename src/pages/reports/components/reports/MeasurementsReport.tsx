import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Patient, Consultation } from "../../types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from "recharts";

interface MeasurementsReportProps {
  patient: Patient;
  consultations: Consultation[];
}

export function MeasurementsReport({ patient, consultations }: MeasurementsReportProps) {
  const sortedConsultations = [...consultations].sort(
    (a, b) => new Date(a.consultation_date).getTime() - new Date(b.consultation_date).getTime()
  );

  const firstConsultation = sortedConsultations[0];
  const lastConsultation = sortedConsultations[sortedConsultations.length - 1];

  if (!firstConsultation || !lastConsultation) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Dados insuficientes para gerar o relatório comparativo.</p>
        </CardContent>
      </Card>
    );
  }

  const calculatePercentageChange = (initial: number, current: number) => {
    return (((current - initial) / initial) * 100).toFixed(1);
  };

  const radarData = [
    {
      metric: "Peso",
      inicial: firstConsultation.weight,
      atual: lastConsultation.weight,
    },
    {
      metric: "IMC",
      inicial: firstConsultation.bmi,
      atual: lastConsultation.bmi,
    },
  ];

  if (firstConsultation.body_fat_percentage && lastConsultation.body_fat_percentage) {
    radarData.push({
      metric: "Gordura",
      inicial: firstConsultation.body_fat_percentage,
      atual: lastConsultation.body_fat_percentage,
    });
  }

  if (firstConsultation.waist_circumference && lastConsultation.waist_circumference) {
    radarData.push({
      metric: "Cintura",
      inicial: firstConsultation.waist_circumference,
      atual: lastConsultation.waist_circumference,
    });
  }

  return (
    <div className="space-y-6 print:text-black">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Comparativo de Medidas</h1>
        <p className="text-xl font-medium">{patient.full_name}</p>
        <p className="text-muted-foreground">
          Comparação: {format(new Date(firstConsultation.consultation_date), "dd/MM/yyyy")} →{" "}
          {format(new Date(lastConsultation.consultation_date), "dd/MM/yyyy")}
        </p>
        <p className="text-sm text-muted-foreground">
          Gerado em {format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </p>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>📊 Comparativo Visual</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <PolarRadiusAxis />
              <Radar name="Inicial" dataKey="inicial" stroke="hsl(var(--muted-foreground))" fill="hsl(var(--muted))" fillOpacity={0.6} />
              <Radar name="Atual" dataKey="atual" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>📋 Variações Percentuais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Peso</p>
              <div className="flex justify-between items-center">
                <span>{firstConsultation.weight.toFixed(1)} kg</span>
                <span className="text-2xl">→</span>
                <span className="font-bold">{lastConsultation.weight.toFixed(1)} kg</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Variação: {calculatePercentageChange(firstConsultation.weight, lastConsultation.weight)}%
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">IMC</p>
              <div className="flex justify-between items-center">
                <span>{firstConsultation.bmi.toFixed(1)}</span>
                <span className="text-2xl">→</span>
                <span className="font-bold">{lastConsultation.bmi.toFixed(1)}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Variação: {calculatePercentageChange(firstConsultation.bmi, lastConsultation.bmi)}%
              </p>
            </div>

            {firstConsultation.body_fat_percentage && lastConsultation.body_fat_percentage && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Gordura Corporal</p>
                <div className="flex justify-between items-center">
                  <span>{firstConsultation.body_fat_percentage.toFixed(1)}%</span>
                  <span className="text-2xl">→</span>
                  <span className="font-bold">{lastConsultation.body_fat_percentage.toFixed(1)}%</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Variação:{" "}
                  {calculatePercentageChange(
                    firstConsultation.body_fat_percentage,
                    lastConsultation.body_fat_percentage
                  )}
                  %
                </p>
              </div>
            )}

            {firstConsultation.waist_circumference && lastConsultation.waist_circumference && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Circunferência da Cintura</p>
                <div className="flex justify-between items-center">
                  <span>{firstConsultation.waist_circumference.toFixed(1)} cm</span>
                  <span className="text-2xl">→</span>
                  <span className="font-bold">{lastConsultation.waist_circumference.toFixed(1)} cm</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Variação:{" "}
                  {calculatePercentageChange(
                    firstConsultation.waist_circumference,
                    lastConsultation.waist_circumference
                  )}
                  %
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
