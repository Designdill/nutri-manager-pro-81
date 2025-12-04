import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Droplets, Moon, Utensils } from "lucide-react";

interface PatientData {
  water_intake: number | null;
  sleep_hours: number | null;
  meals_per_day: number | null;
  exercise_frequency: string | null;
}

interface HealthSummaryProps {
  patientData: PatientData | null;
}

export function HealthSummary({ patientData }: HealthSummaryProps) {
  const healthMetrics = [
    {
      icon: Droplets,
      label: "Água",
      value: patientData?.water_intake ? `${patientData.water_intake}L/dia` : "-",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      icon: Moon,
      label: "Sono",
      value: patientData?.sleep_hours ? `${patientData.sleep_hours}h/noite` : "-",
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10"
    },
    {
      icon: Utensils,
      label: "Refeições",
      value: patientData?.meals_per_day ? `${patientData.meals_per_day}/dia` : "-",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10"
    },
    {
      icon: Activity,
      label: "Exercício",
      value: patientData?.exercise_frequency || "-",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10"
    }
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Resumo de Saúde
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {healthMetrics.map((metric, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 p-3 rounded-lg ${metric.bgColor}`}
            >
              <metric.icon className={`h-5 w-5 ${metric.color}`} />
              <div>
                <p className="text-xs text-muted-foreground">{metric.label}</p>
                <p className="font-medium text-sm">{metric.value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
