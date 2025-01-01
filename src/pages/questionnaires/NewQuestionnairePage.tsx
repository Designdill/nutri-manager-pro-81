import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { QuestionnaireForm } from "./components/QuestionnaireForm";
import { useAuth } from "@/App";

const questionnaireSchema = z.object({
  patient_id: z.string().min(1, "Selecione um paciente"),
  questions: z.array(
    z.object({
      question: z.string().min(1, "A pergunta é obrigatória"),
      type: z.enum(["text", "multiple_choice", "checkbox"]),
      options: z.array(z.string()).optional(),
    })
  ),
});

type QuestionnaireFormValues = z.infer<typeof questionnaireSchema>;

export default function NewQuestionnairePage() {
  const { session } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<QuestionnaireFormValues>({
    resolver: zodResolver(questionnaireSchema),
    defaultValues: {
      questions: [
        {
          question: "",
          type: "text",
          options: [],
        },
      ],
    },
  });

  const onSubmit = async (data: QuestionnaireFormValues) => {
    try {
      const { error } = await supabase.from("questionnaires").insert({
        patient_id: data.patient_id,
        nutritionist_id: session?.user.id,
        responses: { questions: data.questions },
      });

      if (error) throw error;

      toast({
        title: "Questionário criado",
        description: "O questionário foi criado com sucesso",
      });

      navigate("/questionnaires");
    } catch (error) {
      console.error("Error creating questionnaire:", error);
      toast({
        title: "Erro ao criar questionário",
        description: "Ocorreu um erro ao criar o questionário",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Novo Questionário</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Criar Questionário</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <QuestionnaireForm form={form} />
                <Button type="submit">Criar Questionário</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}