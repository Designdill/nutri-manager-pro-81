import { AppSidebar } from "@/components/AppSidebar";
import { ExamsTab } from "@/components/patients/exams/ExamsTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { InfoTab } from "./components/tabs/InfoTab";
import { HistoryTab } from "./components/tabs/HistoryTab";
import { ProgressTab } from "./components/tabs/ProgressTab";

export default function PatientDetailsPage() {
  const { patientId } = useParams();

  const { data: patient, isLoading: isLoadingPatient } = useQuery({
    queryKey: ["patient", patientId],
    queryFn: async () => {
      if (!patientId) throw new Error("Patient ID is required");
      
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .eq("id", patientId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!patientId,
  });

  const { data: consultations, isLoading: isLoadingConsultations } = useQuery({
    queryKey: ["consultations", patientId],
    queryFn: async () => {
      if (!patientId) throw new Error("Patient ID is required");
      
      const { data, error } = await supabase
        .from("consultations")
        .select("*")
        .eq("patient_id", patientId)
        .order("consultation_date", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!patientId,
  });

  if (isLoadingPatient || isLoadingConsultations) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">{patient?.full_name}</h1>
        </div>

        <Tabs defaultValue="info" className="space-y-4">
          <TabsList>
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
            <TabsTrigger value="progress">Progresso</TabsTrigger>
            <TabsTrigger value="exams">Exames</TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <InfoTab patient={patient} />
          </TabsContent>

          <TabsContent value="history">
            <HistoryTab 
              patientId={patientId!} 
              patient={patient} 
              consultations={consultations || []} 
            />
          </TabsContent>

          <TabsContent value="progress">
            <ProgressTab patient={patient} consultations={consultations || []} />
          </TabsContent>

          <TabsContent value="exams">
            <ExamsTab patientId={patientId!} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}