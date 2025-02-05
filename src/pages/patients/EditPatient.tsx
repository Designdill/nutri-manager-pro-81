import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PatientFormValues, patientFormSchema } from "@/components/patients/types";
import { useToast } from "@/hooks/use-toast";
import { Form } from "@/components/ui/form";
import { LoadingState } from "@/components/patients/edit/LoadingState";
import { ErrorState } from "@/components/patients/edit/ErrorState";
import { PatientHeader } from "@/components/patients/edit/PatientHeader";
import { PatientTabs } from "@/components/patients/edit/PatientTabs";

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
      const formData: PatientFormValues = {
        ...data,
        current_weight: data.current_weight?.toString() || "",
        target_weight: data.target_weight?.toString() || "",
        height: data.height?.toString() || "",
        meals_per_day: data.meals_per_day?.toString() || "",
        sleep_hours: data.sleep_hours?.toString() || "",
        water_intake: data.water_intake?.toString() || "",
        status: statusOptions.includes(data.status as StatusType) 
          ? (data.status as StatusType) 
          : "created",
      };
      form.reset(formData);
      return data;
    },
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
          : "created",
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

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState />;

  return (
    <div className="flex min-h-screen w-full">
      <div className="flex-1 p-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <PatientHeader
            patientName={patient?.full_name}
            onBack={() => navigate("/patients")}
            onSave={form.handleSubmit(onSubmit)}
          />

          <Form {...form}>
            <form className="space-y-6">
              <PatientTabs form={form} />
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}