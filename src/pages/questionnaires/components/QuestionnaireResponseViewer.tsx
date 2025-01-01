import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, User } from "lucide-react";

export function QuestionnaireResponseViewer() {
  const { id } = useParams();

  const { data: questionnaire, isLoading } = useQuery({
    queryKey: ["questionnaire", id],
    queryFn: async () => {
      console.log("Fetching questionnaire:", id);
      const { data, error } = await supabase
        .from("questionnaires")
        .select(`
          *,
          patients:patient_id (
            full_name
          )
        `)
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching questionnaire:", error);
        throw error;
      }

      console.log("Fetched questionnaire:", data);
      return data;
    },
  });

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!questionnaire) {
    return <div>Questionário não encontrado</div>;
  }

  if (!questionnaire.responses) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            {questionnaire.patients?.full_name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Este questionário ainda não foi respondido.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          {questionnaire.patients?.full_name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          {questionnaire.responses.map((response: any, index: number) => (
            <div key={index} className="mb-6">
              <div className="flex items-start gap-2 mb-2">
                <FileText className="w-4 h-4 mt-1 text-muted-foreground" />
                <h3 className="font-medium">{response.question}</h3>
              </div>
              <div className="pl-6">
                {response.type === "multiple_choice" || response.type === "checkbox" ? (
                  <ul className="list-disc pl-4">
                    {Array.isArray(response.answer) ? (
                      response.answer.map((option: string, optionIndex: number) => (
                        <li key={optionIndex}>{option}</li>
                      ))
                    ) : (
                      <li>{response.answer}</li>
                    )}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">{response.answer}</p>
                )}
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}