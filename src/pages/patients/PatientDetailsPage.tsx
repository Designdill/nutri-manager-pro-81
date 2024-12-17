import { AppSidebar } from "@/components/AppSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function PatientDetailsPage() {
  const { patientId } = useParams();

  const { data: patient, isLoading } = useQuery({
    queryKey: ["patient", patientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .eq("id", patientId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Dados de exemplo para o gráfico
  const progressData = [
    { date: "2024-01-01", weight: 85 },
    { date: "2024-02-01", weight: 83 },
    { date: "2024-03-01", weight: 81 },
    { date: "2024-04-01", weight: 80 },
  ];

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">{patient?.full_name}</h1>
        </div>

        <Tabs defaultValue="info" className="space-y-4">
          <TabsList>
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
            <TabsTrigger value="progress">Progresso</TabsTrigger>
          </TabsList>

          <TabsContent value="info">
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
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Atendimentos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Histórico de atendimentos será implementado em breve...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress">
            <Card>
              <CardHeader>
                <CardTitle>Progresso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}