import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/App";
import type { TablesInsert } from "@/integrations/supabase/types";
import { PersonalInfoForm } from "@/components/patients/PersonalInfoForm";
import { AddressForm } from "@/components/patients/AddressForm";
import { MeasurementsForm } from "@/components/patients/MeasurementsForm";
import { HealthHistoryForm } from "@/components/patients/HealthHistoryForm";
import { LifestyleForm } from "@/components/patients/LifestyleForm";
import { GoalsForm } from "@/components/patients/GoalsForm";
import { patientFormSchema, type PatientFormValues } from "@/components/patients/types";

type PatientInsert = TablesInsert<"patients">;

export default function NewPatient() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      full_name: "",
      cpf: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (values: PatientFormValues) => {
    try {
      if (!session?.user.id) {
        toast.error("Você precisa estar logado para cadastrar um paciente");
        return;
      }

      console.log("Creating patient with nutritionist_id:", session.user.id);

      // First, check if the nutritionist profile exists
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        throw new Error("Erro ao verificar perfil do nutricionista");
      }

      if (!profile) {
        // Create profile if it doesn't exist
        const { error: createProfileError } = await supabase
          .from("profiles")
          .insert({
            id: session.user.id,
            role: "nutritionist",
          });

        if (createProfileError) {
          console.error("Error creating profile:", createProfileError);
          throw createProfileError;
        }
      }

      // Now proceed with patient creation
      const patientData: PatientInsert = {
        ...values,
        full_name: values.full_name,
        cpf: values.cpf,
        nutritionist_id: session.user.id,
        current_weight: values.current_weight ? parseFloat(values.current_weight) : null,
        target_weight: values.target_weight ? parseFloat(values.target_weight) : null,
        height: values.height ? parseFloat(values.height) : null,
        meals_per_day: values.meals_per_day ? parseInt(values.meals_per_day) : null,
        sleep_hours: values.sleep_hours ? parseInt(values.sleep_hours) : null,
        water_intake: values.water_intake ? parseFloat(values.water_intake) : null,
      };

      console.log("Inserting patient data:", patientData);

      const { error } = await supabase
        .from("patients")
        .insert(patientData);

      if (error) {
        console.error("Error inserting patient:", error);
        throw error;
      }

      // Send welcome email if email is provided
      if (values.email) {
        try {
          const { error: emailError } = await supabase.functions.invoke('send-welcome-email', {
            body: { patientData: { full_name: values.full_name, email: values.email } }
          });

          if (emailError) {
            console.error("Error sending welcome email:", emailError);
            toast.error("Paciente cadastrado, mas houve um erro ao enviar o email de boas-vindas");
          } else {
            toast.success("Paciente cadastrado e email de boas-vindas enviado com sucesso!");
          }
        } catch (emailError) {
          console.error("Error invoking send-welcome-email function:", emailError);
          toast.error("Paciente cadastrado, mas houve um erro ao enviar o email de boas-vindas");
        }
      } else {
        toast.success("Paciente cadastrado com sucesso!");
      }

      navigate("/patients");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erro ao cadastrar paciente");
    }
  };

  // If there's no session, show an error message
  if (!session) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <p className="text-red-500">Você precisa estar logado para cadastrar um paciente</p>
          <Button onClick={() => navigate("/login")} className="mt-4">
            Ir para login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Novo Paciente</h2>
          <p className="text-muted-foreground">
            Preencha as informações do paciente nos campos abaixo
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Tabs defaultValue="personal" className="space-y-6">
                <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full">
                  <TabsTrigger value="personal">Pessoal</TabsTrigger>
                  <TabsTrigger value="address">Endereço</TabsTrigger>
                  <TabsTrigger value="measurements">Medidas</TabsTrigger>
                  <TabsTrigger value="health">Saúde</TabsTrigger>
                  <TabsTrigger value="lifestyle">Estilo de Vida</TabsTrigger>
                  <TabsTrigger value="goals">Objetivos</TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-6">
                  <PersonalInfoForm form={form} />
                </TabsContent>

                <TabsContent value="address" className="space-y-6">
                  <AddressForm form={form} />
                </TabsContent>

                <TabsContent value="measurements" className="space-y-6">
                  <MeasurementsForm form={form} />
                </TabsContent>

                <TabsContent value="health" className="space-y-6">
                  <HealthHistoryForm form={form} />
                </TabsContent>

                <TabsContent value="lifestyle" className="space-y-6">
                  <LifestyleForm form={form} />
                </TabsContent>

                <TabsContent value="goals" className="space-y-6">
                  <GoalsForm form={form} />
                </TabsContent>
              </Tabs>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/patients")}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  <User className="mr-2 h-4 w-4" /> Cadastrar Paciente
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}