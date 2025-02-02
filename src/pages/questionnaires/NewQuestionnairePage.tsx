import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { QuestionnaireForm } from "./components/QuestionnaireForm";
import { useAuth } from "@/App";
import { useQuery } from "@tanstack/react-query";
import { QuestionnaireSchema, type QuestionnaireFormValues } from "./types";

export default function NewQuestionnairePage() {
  const { session } = useAuth();
  const { toast } = useToast();
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

  // Fetch patient email for sending notification
  const { data: patient } = useQuery({
    queryKey: ["patient", form.watch("patient_id")],
    queryFn: async () => {
      if (!form.watch("patient_id")) return null;
      
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .eq("id", form.watch("patient_id"))
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!form.watch("patient_id"),
  });

  const sendQuestionnaireEmail = async (questionnaireId: string, patientEmail: string) => {
    try {
      const response = await supabase.functions.invoke("send-email", {
        body: {
          to: [patientEmail],
          subject: "Novo Questionário Disponível",
          html: `
            <h2>Olá!</h2>
            <p>Um novo questionário foi criado para você.</p>
            <p>Você pode acessá-lo através do link abaixo:</p>
            <p><a href="${window.location.origin}/questionnaires/${questionnaireId}/respond">Responder Questionário</a></p>
            <p>Por favor, responda assim que possível.</p>
          `,
          from: "Sistema Nutricional <onboarding@resend.dev>",
        },
      });

      if (response.error) {
        throw response.error;
      }

      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  };

  const onSubmit = async (data: QuestionnaireFormValues) => {
    try {
      const { data: questionnaire, error } = await supabase
        .from("questionnaires")
        .insert({
          patient_id: data.patient_id,
          nutritionist_id: session?.user.id,
          responses: { questions: data.questions },
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;

      // Send email notification if patient has an email
      if (patient?.email) {
        await sendQuestionnaireEmail(questionnaire.id, patient.email);
      }

      toast({
        title: "Questionário criado",
        description: "O questionário foi criado e enviado com sucesso",
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