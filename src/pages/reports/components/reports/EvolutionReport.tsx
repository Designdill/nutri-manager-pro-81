import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Patient, Consultation } from "../../types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";

interface EvolutionReportProps {
  patient: Patient;
  consultations: Consultation[];
  startDate: Date | null;
  endDate: Date | null;
}

export function EvolutionReport({ patient, consultations, startDate, endDate }: EvolutionReportProps) {
  const sortedConsultations = [...consultations].sort(
    (a, b) => new Date(a.consultation_date).getTime() - new Date(b.consultation_date).getTime()
  );

  const firstConsultation = sortedConsultations[0];
  const lastConsultation = sortedConsultations[sortedConsultations.length - 1];

  const chartData = sortedConsultations.map((c) => ({
    date: format(new Date(c.consultation_date), "dd/MM"),
    peso: c.weight,
    imc: c.bmi,
    gordura: c.body_fat_percentage || 0,
  }));

  const calculateChange = (initial: number | null, current: number | null) => {
    if (initial === null || current === null) return null;
    return current - initial;
  };

  const renderChangeIndicator = (value: number | null) => {
    if (value === null) return <Minus className="h-4 w-4" />;
    if (value < 0)
      return (
        <span className="flex items-center text-green-600">
          <ArrowDown className="h-4 w-4 mr-1" />
          {Math.abs(value).toFixed(1)}
        </span>
      );
    if (value > 0)
      return (
        <span className="flex items-center text-red-600">
          <ArrowUp className="h-4 w-4 mr-1" />
          {value.toFixed(1)}
        </span>
      );
    return <span className="text-muted-foreground">0</span>;
  };

  const weightChange = calculateChange(firstConsultation?.weight, lastConsultation?.weight);
  const bmiChange = calculateChange(firstConsultation?.bmi, lastConsultation?.bmi);
  const fatChange = calculateChange(firstConsultation?.body_fat_percentage, lastConsultation?.body_fat_percentage);
  const waistChange = calculateChange(firstConsultation?.waist_circumference, lastConsultation?.waist_circumference);

  return (
    <div className="space-y-6 print:text-black">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Relatório de Evolução</h1>
        <p className="text-xl font-medium">{patient.full_name}</p>
        <p className="text-muted-foreground">
          Período: {startDate ? format(startDate, "dd/MM/yyyy") : "Início"} até{" "}
          {endDate ? format(endDate, "dd/MM/yyyy") : "Hoje"}
        </p>
        <p className="text-sm text-muted-foreground">
          Gerado em {format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </p>
      </div>

      <Separator />

      {sortedConsultations.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Nenhuma consulta registrada no período selecionado.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>📊 Evolução do Peso</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="peso" stroke="hsl(var(--primary))" name="Peso (kg)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>📋 Resumo Comparativo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">Métrica</th>
                      <th className="text-center py-2 px-4">Inicial</th>
                      <th className="text-center py-2 px-4">Atual</th>
                      <th className="text-center py-2 px-4">Variação</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 px-4 font-medium">Peso</td>
                      <td className="text-center py-2 px-4">{firstConsultation.weight.toFixed(1)} kg</td>
                      <td className="text-center py-2 px-4">{lastConsultation.weight.toFixed(1)} kg</td>
                      <td className="text-center py-2 px-4">{renderChangeIndicator(weightChange)}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-4 font-medium">IMC</td>
                      <td className="text-center py-2 px-4">{firstConsultation.bmi.toFixed(1)}</td>
                      <td className="text-center py-2 px-4">{lastConsultation.bmi.toFixed(1)}</td>
                      <td className="text-center py-2 px-4">{renderChangeIndicator(bmiChange)}</td>
                    </tr>
                    {firstConsultation.body_fat_percentage && lastConsultation.body_fat_percentage && (
                      <tr className="border-b">
                        <td className="py-2 px-4 font-medium">% Gordura</td>
                        <td className="text-center py-2 px-4">{firstConsultation.body_fat_percentage.toFixed(1)}%</td>
                        <td className="text-center py-2 px-4">{lastConsultation.body_fat_percentage.toFixed(1)}%</td>
                        <td className="text-center py-2 px-4">{renderChangeIndicator(fatChange)}</td>
                      </tr>
                    )}
                    {firstConsultation.waist_circumference && lastConsultation.waist_circumference && (
                      <tr className="border-b">
                        <td className="py-2 px-4 font-medium">Cintura</td>
                        <td className="text-center py-2 px-4">{firstConsultation.waist_circumference.toFixed(1)} cm</td>
                        <td className="text-center py-2 px-4">{lastConsultation.waist_circumference.toFixed(1)} cm</td>
                        <td className="text-center py-2 px-4">{renderChangeIndicator(waistChange)}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {(weightChange !== null && weightChange < -2) ||
          (bmiChange !== null && bmiChange < -1) ||
          (waistChange !== null && waistChange < -3) ? (
            <Card className="border-green-600">
              <CardHeader>
                <CardTitle className="text-green-600">✅ Conquistas</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {weightChange !== null && weightChange < -2 && (
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Perdeu {Math.abs(weightChange).toFixed(1)}kg no período</span>
                    </li>
                  )}
                  {bmiChange !== null && bmiChange < -1 && (
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Redução de {Math.abs(bmiChange).toFixed(1)} pontos no IMC</span>
                    </li>
                  )}
                  {waistChange !== null && waistChange < -3 && (
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Redução de {Math.abs(waistChange).toFixed(1)}cm na cintura</span>
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>
          ) : null}
        </>
      )}
    </div>
  );
}
