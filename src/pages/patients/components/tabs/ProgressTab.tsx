import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";

interface ProgressTabProps {
  consultations: any[]; // TODO: Add proper type
}

export function ProgressTab({ consultations }: ProgressTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Progresso</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={consultations}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="consultation_date"
                tickFormatter={(value) =>
                  format(new Date(value), "MMM dd", { locale: ptBR })
                }
              />
              <YAxis />
              <Tooltip
                labelFormatter={(value) =>
                  format(new Date(value), "dd/MM/yyyy", { locale: ptBR })
                }
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}