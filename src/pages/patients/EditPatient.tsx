import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppSidebar } from "@/components/AppSidebar";
import { PersonalInfoForm } from "@/components/patients/PersonalInfoForm";
import { AddressForm } from "@/components/patients/AddressForm";
import { HealthHistoryForm } from "@/components/patients/HealthHistoryForm";
import { LifestyleForm } from "@/components/patients/LifestyleForm";
import { GoalsForm } from "@/components/patients/GoalsForm";
import { useForm } from "react-hook-form";
import { PatientFormValues, patientFormSchema } from "@/components/patients/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { MeasurementsForm } from "@/components/patients/MeasurementsForm";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save } from "lucide-react";

const statusOptions = ["active", "inactive", "created"] as const;
type StatusType = (typeof statusOptions)[number];

export default function EditPatient() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    context: patientId
  });

  const { data: patient, isLoading, error } = useQuery({
    queryKey: ["patient", patientId],
    queryFn: async () => {
      console.log("Fetching patient data for ID:", patientId);
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .eq("id", patientId)
        .single();

      if (error) {
        console.error("Error fetching patient:", error);
        throw error;
      }

      console.log("Patient data fetched:", data);
      const formData = {
        ...data,
        current_weight: data.current_weight?.toString() || "",
        target_weight: data.target_weight?.toString() || "",
        height: data.height?.toString() || "",
        meals_per_day: data.meals_per_day?.toString() || "",
        sleep_hours: data.sleep_hours?.toString() || "",
        water_intake: data.water_intake?.toString() || "",
        status: statusOptions.includes(data.status as StatusType) 
          ? (data.status as StatusType) 
          : "created" as StatusType,
      };
      form.reset(formData);
      return data;
    },
    retry: 2,
  });

  const onSubmit = async (data: PatientFormValues) => {
    try {
      console.log("Updating patient with data:", data);
      const patientData = {
        ...data,
        current_weight: data.current_weight ? parseFloat(data.current_weight) : null,
        target_weight: data.target_weight ? parseFloat(data.target_weight) : null,
        height: data.height ? parseFloat(data.height) : null,
        meals_per_day: data.meals_per_day ? parseInt(data.meals_per_day) : null,
        sleep_hours: data.sleep_hours ? parseInt(data.sleep_hours) : null,
        water_intake: data.water_intake ? parseFloat(data.water_intake) : null,
        updated_at: new Date().toISOString(),
        status: statusOptions.includes(data.status as StatusType) 
          ? data.status 
          : "created" as StatusType,
      };

      const { error } = await supabase
        .from("patients")
        .update(patientData)
        .eq("id", patientId);

      if (error) throw error;

      toast({
        title: "Paciente atualizado",
        description: "As informações do paciente foram atualizadas com sucesso.",
      });

      navigate("/patients");
    } catch (error) {
      console.error("Error updating patient:", error);
      toast({
        title: "Erro ao atualizar paciente",
        description: "Ocorreu um erro ao tentar atualizar as informações do paciente.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 p-8">
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse text-lg">Carregando...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 p-8">
          <div className="text-red-500 flex items-center justify-center h-full">
            Erro ao carregar dados do paciente. Por favor, tente novamente.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex-1 p-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate("/patients")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Editar Paciente</h1>
                <p className="text-muted-foreground">
                  {patient?.full_name}
                </p>
              </div>
            </div>
            <Button onClick={form.handleSubmit(onSubmit)}>
              <Save className="h-4 w-4 mr-2" />
              Salvar Alterações
            </Button>
          </div>

          <Form {...form}>
            <form className="space-y-6">
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="w-full justify-start mb-6">
                  <TabsTrigger value="personal">Informações Pessoais</TabsTrigger>
                  <TabsTrigger value="health">Saúde</TabsTrigger>
                  <TabsTrigger value="lifestyle">Estilo de Vida</TabsTrigger>
                  <TabsTrigger value="goals">Objetivos</TabsTrigger>
                </TabsList>

                <TabsContent value="personal">
                  <div className="grid gap-6">
                    <Card>
                      <CardContent className="pt-6">
                        <PersonalInfoForm form={form} />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <AddressForm form={form} />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="health">
                  <div className="grid gap-6">
                    <Card>
                      <CardContent className="pt-6">
                        <MeasurementsForm form={form} />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <HealthHistoryForm form={form} />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="lifestyle">
                  <Card>
                    <CardContent className="pt-6">
                      <LifestyleForm form={form} />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="goals">
                  <Card>
                    <CardContent className="pt-6">
                      <GoalsForm form={form} />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}