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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MeasurementsForm } from "@/components/patients/MeasurementsForm";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function EditPatient() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
  });

  const { data: patient, isLoading } = useQuery({
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
      // Convert numeric values to strings for the form
      const formData = {
        ...data,
        current_weight: data.current_weight?.toString() || "",
        target_weight: data.target_weight?.toString() || "",
        height: data.height?.toString() || "",
        meals_per_day: data.meals_per_day?.toString() || "",
        sleep_hours: data.sleep_hours?.toString() || "",
        water_intake: data.water_intake?.toString() || "",
      };
      form.reset(formData);
      return data;
    },
  });

  const onSubmit = async (data: PatientFormValues) => {
    try {
      console.log("Updating patient with data:", data);
      // Convert string values back to numbers for the database
      const patientData = {
        ...data,
        current_weight: data.current_weight ? parseFloat(data.current_weight) : null,
        target_weight: data.target_weight ? parseFloat(data.target_weight) : null,
        height: data.height ? parseFloat(data.height) : null,
        meals_per_day: data.meals_per_day ? parseInt(data.meals_per_day) : null,
        sleep_hours: data.sleep_hours ? parseInt(data.sleep_hours) : null,
        water_intake: data.water_intake ? parseFloat(data.water_intake) : null,
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
    return <div>Carregando...</div>;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Editar Paciente</h1>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Informações do Paciente</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  <PersonalInfoForm form={form} />
                  <AddressForm form={form} />
                  <MeasurementsForm form={form} />
                  <HealthHistoryForm form={form} />
                  <LifestyleForm form={form} />
                  <GoalsForm form={form} />
                  
                  <div className="flex justify-end gap-4">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => navigate("/patients")}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit">
                      Salvar Alterações
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          </Form>
        </div>
      </div>
    </SidebarProvider>
  );
}