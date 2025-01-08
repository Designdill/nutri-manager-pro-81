import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Database } from "@/integrations/supabase/types";

type QuestionnaireStatus = Database["public"]["Enums"]["questionnaire_status"];
type StatusFilter = QuestionnaireStatus | "all";

export function QuestionnairesList() {
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const { data: questionnaires, isLoading } = useQuery({
    queryKey: ["questionnaires", statusFilter],
    queryFn: async () => {
      let query = supabase
        .from("questionnaires")
        .select(`
          *,
          patients:patients(full_name, email)
        `)
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("questionnaires")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Questionário excluído",
        description: "O questionário foi excluído com sucesso",
      });
    } catch (error) {
      console.error("Error deleting questionnaire:", error);
      toast({
        title: "Erro ao excluir questionário",
        description: "Ocorreu um erro ao excluir o questionário",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Select
          value={statusFilter}
          onValueChange={(value: StatusFilter) => setStatusFilter(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pending">Pendentes</SelectItem>
            <SelectItem value="completed">Respondidos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Paciente</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data de Envio</TableHead>
            <TableHead>Data de Resposta</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {questionnaires?.map((questionnaire) => (
            <TableRow key={questionnaire.id}>
              <TableCell>{questionnaire.patients?.full_name}</TableCell>
              <TableCell>{questionnaire.patients?.email}</TableCell>
              <TableCell>
                <Badge
                  variant={questionnaire.status === "completed" ? "secondary" : "outline"}
                >
                  {questionnaire.status === "completed" ? "Respondido" : "Pendente"}
                </Badge>
              </TableCell>
              <TableCell>
                {questionnaire.sent_at
                  ? format(new Date(questionnaire.sent_at), "dd/MM/yyyy")
                  : "-"}
              </TableCell>
              <TableCell>
                {questionnaire.completed_at
                  ? format(new Date(questionnaire.completed_at), "dd/MM/yyyy")
                  : "-"}
              </TableCell>
              <TableCell className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <Link to={`/questionnaires/${questionnaire.id}`}>
                    <Eye className="w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(questionnaire.id)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}