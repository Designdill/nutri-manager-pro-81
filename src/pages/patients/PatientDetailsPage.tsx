import { AppSidebar } from "@/components/AppSidebar";
import { ConsultationForm } from "@/components/patients/ConsultationForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { useParams } from "react-router-dom";
import { useState } from "react";

export default function PatientDetailsPage() {
  const { patientId } = useParams();
  const [isConsultationDialogOpen, setIsConsultationDialogOpen] = useState(false);

  const { data: patient, isLoading: isLoadingPatient } = useQuery({
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

  const { data: consultations, isLoading: isLoadingConsultations } = useQuery({
    queryKey: ["consultations", patientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("consultations")
        .select("*")
        .eq("patient_id", patientId)
        .order("consultation_date", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  if (isLoadingPatient || isLoadingConsultations) {
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
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Histórico de Atendimentos</CardTitle>
                <Dialog open={isConsultationDialogOpen} onOpenChange={setIsConsultationDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>Novo Atendimento</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Novo Atendimento</DialogTitle>
                    </DialogHeader>
                    <ConsultationForm
                      patientId={patientId!}
                      patientHeight={patient?.height}
                      onSuccess={() => setIsConsultationDialogOpen(false)}
                      onCancel={() => setIsConsultationDialogOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {consultations?.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      Nenhum atendimento registrado
                    </p>
                  ) : (
                    <div className="rounded-md border">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="p-2 text-left">Data</th>
                            <th className="p-2 text-left">Peso</th>
                            <th className="p-2 text-left">IMC</th>
                            <th className="p-2 text-left">Observações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {consultations?.map((consultation) => (
                            <tr key={consultation.id} className="border-b">
                              <td className="p-2">
                                {format(new Date(consultation.consultation_date), "dd/MM/yyyy")}
                              </td>
                              <td className="p-2">{consultation.weight} kg</td>
                              <td className="p-2">{consultation.bmi}</td>
                              <td className="p-2">{consultation.observations || "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}