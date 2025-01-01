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

export function QuestionnairesList() {
  const { toast } = useToast();

  const { data: questionnaires, isLoading } = useQuery({
    queryKey: ["questionnaires"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("questionnaires")
        .select(`
          *,
          patients:patients(full_name)
        `)
        .order("created_at", { ascending: false });

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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Paciente</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Data de Envio</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {questionnaires?.map((questionnaire) => (
          <TableRow key={questionnaire.id}>
            <TableCell>{questionnaire.patients?.full_name}</TableCell>
            <TableCell>
              <Badge
                variant={questionnaire.status === "completed" ? "success" : "secondary"}
              >
                {questionnaire.status === "completed" ? "Respondido" : "Pendente"}
              </Badge>
            </TableCell>
            <TableCell>
              {questionnaire.sent_at
                ? format(new Date(questionnaire.sent_at), "dd/MM/yyyy")
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
  );
}