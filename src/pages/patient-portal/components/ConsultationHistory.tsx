import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Activity, TrendingDown } from "lucide-react";

interface Consultation {
  id: string;
  consultation_date: string;
  weight: number;
  bmi: number;
  body_fat_percentage: number | null;
  waist_circumference: number | null;
  physical_activity_level: string | null;
  meal_plan_adherence: string | null;
  observations: string | null;
}

interface ConsultationHistoryProps {
  consultations: Consultation[];
}

export function ConsultationHistory({ consultations }: ConsultationHistoryProps) {
  const sortedConsultations = [...consultations].sort(
    (a, b) => new Date(b.consultation_date).getTime() - new Date(a.consultation_date).getTime()
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Histórico de Consultas
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedConsultations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma consulta registrada ainda
          </div>
        ) : (
          <div className="space-y-6">
            {sortedConsultations.map((consultation, index) => (
              <div key={consultation.id}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {format(new Date(consultation.consultation_date), "dd 'de' MMMM 'de' yyyy", {
                          locale: ptBR,
                        })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Consulta #{sortedConsultations.length - index}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Peso</p>
                      <p className="text-lg font-semibold">{consultation.weight} kg</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">IMC</p>
                      <p className="text-lg font-semibold">{consultation.bmi}</p>
                    </div>
                    {consultation.body_fat_percentage && (
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">% Gordura</p>
                        <p className="text-lg font-semibold">{consultation.body_fat_percentage}%</p>
                      </div>
                    )}
                    {consultation.waist_circumference && (
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Cintura</p>
                        <p className="text-lg font-semibold">{consultation.waist_circumference} cm</p>
                      </div>
                    )}
                  </div>

                  {consultation.physical_activity_level && (
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Atividade física: <Badge variant="outline">{consultation.physical_activity_level}</Badge>
                      </span>
                    </div>
                  )}

                  {consultation.meal_plan_adherence && (
                    <div className="flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Adesão ao plano: <Badge variant="outline">{consultation.meal_plan_adherence}</Badge>
                      </span>
                    </div>
                  )}

                  {consultation.observations && (
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm font-medium mb-1">Observações</p>
                      <p className="text-sm text-muted-foreground">{consultation.observations}</p>
                    </div>
                  )}
                </div>
                {index < sortedConsultations.length - 1 && <Separator className="mt-6" />}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
