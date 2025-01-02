import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, User, CheckSquare, Radio } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

interface QuestionnaireResponse {
  question: string;
  answer: string | string[];
  type: "text" | "multiple_choice" | "checkbox";
}

interface QuestionnaireData {
  id: string;
  responses: QuestionnaireResponse[] | null;
  patients: {
    full_name: string;
  } | null;
}

type QuestionnaireRow = Database["public"]["Tables"]["questionnaires"]["Row"] & {
  patients: {
    full_name: string;
  } | null;
};

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
          patients (
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

      // Safely transform the responses data with type checking
      const rawResponses = data.responses as Array<{
        question: string;
        answer: string | string[];
        type: "text" | "multiple_choice" | "checkbox";
      }> | null;

      // Transform the data to match our expected interface
      const transformedData: QuestionnaireData = {
        id: data.id,
        responses: rawResponses,
        patients: data.patients,
      };

      return transformedData;
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

  const getQuestionIcon = (type: string) => {
    switch (type) {
      case "checkbox":
        return <CheckSquare className="w-4 h-4 mt-1 text-primary" />;
      case "multiple_choice":
        return <Radio className="w-4 h-4 mt-1 text-primary" />;
      default:
        return <FileText className="w-4 h-4 mt-1 text-primary" />;
    }
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          {questionnaire.patients?.full_name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4 rounded-lg border">
          <div className="p-4 space-y-8">
            {questionnaire.responses.map((response: QuestionnaireResponse, index: number) => (
              <div key={index} className="bg-card rounded-lg p-4 shadow-sm">
                <div className="flex items-start gap-3 mb-3">
                  {getQuestionIcon(response.type)}
                  <h3 className="font-medium text-lg text-foreground">
                    {response.question}
                  </h3>
                </div>
                <div className="ml-7">
                  {response.type === "multiple_choice" || response.type === "checkbox" ? (
                    <ul className="space-y-2">
                      {Array.isArray(response.answer) ? (
                        response.answer.map((option: string, optionIndex: number) => (
                          <li 
                            key={optionIndex}
                            className="flex items-center gap-2 text-muted-foreground"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                            {option}
                          </li>
                        ))
                      ) : (
                        <li className="flex items-center gap-2 text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                          {response.answer}
                        </li>
                      )}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {response.answer}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}