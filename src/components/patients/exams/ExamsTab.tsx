import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useState } from "react";
import { ExamForm } from "./ExamForm";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { ptBR } from "date-fns/locale";

interface ExamsTabProps {
  patientId: string;
}

export function ExamsTab({ patientId }: ExamsTabProps) {
  const [isExamDialogOpen, setIsExamDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: exams, isLoading, refetch } = useQuery({
    queryKey: ["patientExams", patientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("patient_exams")
        .select(`
          *,
          exam_types (
            name,
            unit,
            min_reference,
            max_reference
          )
        `)
        .eq("patient_id", patientId)
        .order("exam_date", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "above_reference":
        return "text-red-500";
      case "below_reference":
        return "text-yellow-500";
      default:
        return "text-green-500";
    }
  };

  const handleDelete = async (examId: string) => {
    try {
      const { error } = await supabase
        .from("patient_exams")
        .delete()
        .eq("id", examId);

      if (error) throw error;

      toast({
        title: "Exame excluído com sucesso",
      });

      refetch();
    } catch (error) {
      console.error("Erro ao excluir exame:", error);
      toast({
        title: "Erro ao excluir exame",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  // Group exams by type for the chart
  const examsByType = exams?.reduce((acc: any, exam: any) => {
    if (!acc[exam.exam_type_id]) {
      acc[exam.exam_type_id] = {
        name: exam.exam_types.name,
        unit: exam.exam_types.unit,
        data: [],
      };
    }
    acc[exam.exam_type_id].data.push({
      date: exam.exam_date,
      value: exam.value,
    });
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Exames Bioquímicos</h2>
        <Dialog open={isExamDialogOpen} onOpenChange={setIsExamDialogOpen}>
          <DialogTrigger asChild>
            <Button>Novo Exame</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Exame</DialogTitle>
            </DialogHeader>
            <ExamForm
              patientId={patientId}
              onSuccess={() => {
                setIsExamDialogOpen(false);
                refetch();
              }}
              onCancel={() => setIsExamDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Charts */}
      {Object.values(examsByType || {}).map((examType: any) => (
        <Card key={examType.name}>
          <CardHeader>
            <CardTitle>{examType.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={examType.data}>
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
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Exams Table */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Exames</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-2 text-left">Data</th>
                  <th className="p-2 text-left">Exame</th>
                  <th className="p-2 text-left">Valor</th>
                  <th className="p-2 text-left">Referência</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Observações</th>
                  <th className="p-2 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {exams?.map((exam) => (
                  <tr key={exam.id} className="border-b">
                    <td className="p-2">
                      {format(new Date(exam.exam_date), "dd/MM/yyyy")}
                    </td>
                    <td className="p-2">{exam.exam_types.name}</td>
                    <td className="p-2">
                      {exam.value} {exam.exam_types.unit}
                    </td>
                    <td className="p-2">
                      {exam.exam_types.min_reference} - {exam.exam_types.max_reference}{" "}
                      {exam.exam_types.unit}
                    </td>
                    <td className={`p-2 ${getStatusColor(exam.status)}`}>
                      {exam.status === "normal"
                        ? "Normal"
                        : exam.status === "above_reference"
                        ? "Acima"
                        : "Abaixo"}
                    </td>
                    <td className="p-2">{exam.notes || "-"}</td>
                    <td className="p-2 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(exam.id)}
                      >
                        Excluir
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}