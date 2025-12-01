import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Consultation {
  id: string;
  consultation_date: string;
  weight: number;
  bmi: number;
  body_fat_percentage: number | null;
  waist_circumference: number | null;
}

interface EvolutionChartProps {
  consultations: Consultation[];
}

export function EvolutionChart({ consultations }: EvolutionChartProps) {
  const chartData = consultations
    .sort((a, b) => new Date(a.consultation_date).getTime() - new Date(b.consultation_date).getTime())
    .map((consultation) => ({
      date: format(new Date(consultation.consultation_date), "dd/MM", { locale: ptBR }),
      peso: consultation.weight,
      imc: consultation.bmi,
      gordura: consultation.body_fat_percentage,
      cintura: consultation.waist_circumference,
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolução de Medidas</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum dado de evolução disponível ainda
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="peso" stroke="hsl(var(--primary))" name="Peso (kg)" />
              <Line type="monotone" dataKey="imc" stroke="hsl(var(--secondary))" name="IMC" />
              {chartData.some(d => d.gordura) && (
                <Line type="monotone" dataKey="gordura" stroke="hsl(var(--accent))" name="Gordura (%)" />
              )}
              {chartData.some(d => d.cintura) && (
                <Line type="monotone" dataKey="cintura" stroke="#f59e0b" name="Cintura (cm)" />
              )}
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
