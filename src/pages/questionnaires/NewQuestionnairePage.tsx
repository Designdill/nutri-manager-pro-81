import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { AppSidebar } from "@/components/AppSidebar";
import { supabase } from "@/integrations/supabase/client";
import { QuestionnaireForm } from "./components/QuestionnaireForm";
import { useAuth } from "@/App";
import { useQuery } from "@tanstack/react-query";
import { QuestionnaireSchema, type QuestionnaireFormValues } from "./types";

export default function NewQuestionnairePage() {
  const { session } = useAuth();
  const navigate = useNavigate();

  const form = useForm<QuestionnaireFormValues>({
    resolver: zodResolver(QuestionnaireSchema),
    defaultValues: {
      patient_id: "",
      questions: [
        {
          question: "",
          type: "text",
          options: [],
        },
      ],
    },
  });

  const { data: patients } = useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("patients")
        .select("id, full_name, email")
        .order("full_name");

      if (error) throw error;
      return data;
    },
  });

  const onSubmit = async (data: QuestionnaireFormValues) => {
    try {
      if (!session?.user.id) {
        toast.error("Você precisa estar logado para criar um questionário");
        return;
      }

      const { data: questionnaire, error } = await supabase
        .from("questionnaires")
        .insert({
          patient_id: data.patient_id,
          nutritionist_id: session.user.id,
          responses: data.questions,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Questionário criado com sucesso!");
      navigate("/questionnaires");
    } catch (error) {
      console.error("Error creating questionnaire:", error);
      toast.error("Erro ao criar questionário");
    }
  };

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-8">Novo Questionário</h1>
          <Card>
            <CardContent className="pt-6">
              <QuestionnaireForm
                form={form}
                onSubmit={onSubmit}
                patients={patients || []}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}