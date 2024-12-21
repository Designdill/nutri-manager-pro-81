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
import { PatientFormValues } from "@/components/patients/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EditPatient() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<PatientFormValues>();

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
      form.reset(data);
      return data;
    },
  });

  const onSubmit = async (data: PatientFormValues) => {
    try {
      console.log("Updating patient with data:", data);
      const { error } = await supabase
        .from("patients")
        .update(data)
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
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Editar Paciente</h1>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Paciente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <PersonalInfoForm form={form} />
              <AddressForm form={form} />
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
      </div>
    </div>
  );
}