import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PatientFormValues, patientFormSchema } from "@/components/patients/types";
import { useToast } from "@/hooks/use-toast";
import { useAutoSave } from "@/hooks/useAutoSave";
import { Form } from "@/components/ui/form";
import { LoadingState } from "@/components/patients/edit/LoadingState";
import { ErrorState } from "@/components/patients/edit/ErrorState";
import { PatientHeader } from "@/components/patients/edit/PatientHeader";
import { PatientTabs } from "@/components/patients/edit/PatientTabs";
import { PatientSidebar } from "@/components/patients/edit/PatientSidebar";
import { useEffect, useCallback } from "react";

const statusOptions = ["active", "inactive", "created"] as const;
type StatusType = (typeof statusOptions)[number];

export default function EditPatient() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    context: patientId,
    shouldFocusError: false
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
        // Convert null values to empty strings for form fields
        email: data.email || "",
        cpf: data.cpf || "",
        phone: data.phone || "",
        birth_date: data.birth_date || "",
        gender: data.gender || "",
        occupation: data.occupation || "",
        postal_code: data.postal_code || "",
        street: data.street || "",
        number: data.number || "",
        complement: data.complement || "",
        neighborhood: data.neighborhood || "",
        city: data.city || "",
        state: data.state || "",
        current_weight: data.current_weight?.toString() || "",
        target_weight: data.target_weight?.toString() || "",
        height: data.height?.toString() || "",
        blood_type: data.blood_type || "",
        family_history: data.family_history || "",
        medical_conditions: data.medical_conditions || "",
        surgery_history: data.surgery_history || "",
        allergies: data.allergies || "",
        medications: data.medications || "",
        meals_per_day: data.meals_per_day?.toString() || "",
        dietary_type: data.dietary_type || "",
        dietary_restrictions: data.dietary_restrictions || "",
        food_preferences: data.food_preferences || "",
        water_intake: data.water_intake?.toString() || "",
        exercise_frequency: data.exercise_frequency || "",
        exercise_type: data.exercise_type || "",
        exercise_duration: data.exercise_duration || "",
        sleep_hours: data.sleep_hours?.toString() || "",
        sleep_quality: data.sleep_quality || "",
        nutritional_goals: data.nutritional_goals || "",
        treatment_expectations: data.treatment_expectations || "",
        additional_notes: data.additional_notes || "",
        status: statusOptions.includes(data.status as StatusType) 
          ? (data.status as StatusType) 
          : "created",
      };
      form.reset(formData);
      return data;
    },
  });

  const updatePatient = useCallback(async (data: PatientFormValues) => {
    // Map only fields that exist in the patients table
    const patientData = {
      full_name: data.full_name,
      email: data.email?.trim() || null,
      phone: data.phone?.trim() || null,
      cpf: data.cpf?.trim() || null,
      birth_date: data.birth_date?.trim() || null,
      gender: data.gender?.trim() || null,
      occupation: data.occupation?.trim() || null,
      postal_code: data.postal_code?.trim() || null,
      street: data.street?.trim() || null,
      number: data.number?.trim() || null,
      complement: data.complement?.trim() || null,
      neighborhood: data.neighborhood?.trim() || null,
      city: data.city?.trim() || null,
      state: data.state?.trim() || null,
      blood_type: data.blood_type?.trim() || null,
      family_history: data.family_history?.trim() || null,
      medical_conditions: data.medical_conditions?.trim() || null,
      surgery_history: data.surgery_history?.trim() || null,
      allergies: data.allergies?.trim() || null,
      medications: data.medications?.trim() || null,
      dietary_restrictions: data.dietary_restrictions?.trim() || null,
      dietary_type: data.dietary_type?.trim() || null,
      food_preferences: data.food_preferences?.trim() || null,
      exercise_frequency: data.exercise_frequency?.trim() || null,
      exercise_type: data.exercise_type?.trim() || null,
      exercise_duration: data.exercise_duration?.trim() || null,
      sleep_quality: data.sleep_quality?.trim() || null,
      nutritional_goals: data.nutritional_goals?.trim() || null,
      treatment_expectations: data.treatment_expectations?.trim() || null,
      additional_notes: data.additional_notes?.trim() || null,
      // Numeric fields
      current_weight: data.current_weight ? parseFloat(data.current_weight) : null,
      target_weight: data.target_weight ? parseFloat(data.target_weight) : null,
      height: data.height ? parseFloat(data.height) : null,
      water_intake: data.water_intake ? parseFloat(data.water_intake) : null,
      meals_per_day: data.meals_per_day ? parseInt(data.meals_per_day) : null,
      sleep_hours: data.sleep_hours ? parseInt(data.sleep_hours) : null,
      // Status and timestamp
      status: statusOptions.includes(data.status as StatusType) ? data.status : "created",
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("patients")
      .update(patientData)
      .eq("id", patientId);

    if (error) {
      console.error("Supabase update error:", error);
      throw error;
    }
  }, [patientId]);

  const { saveStatus, lastSaved, saveNow } = useAutoSave(form, {
    onSave: updatePatient,
    enabled: !!patient,
    delay: 2000
  });

  const onSubmit = async (data: PatientFormValues) => {
    try {
      console.log("Manually saving patient with data:", data);
      await updatePatient(data);

      // Clear any form errors and remove focus
      form.clearErrors();
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }

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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        saveNow().catch(console.error);
      }
      if (e.key === 'Escape') {
        navigate("/patients");
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [saveNow, navigate]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (saveStatus === 'unsaved') {
        e.preventDefault();
        e.returnValue = 'Você tem alterações não salvas. Tem certeza que deseja sair?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [saveStatus]);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState />;

  return (
    <div className="min-h-screen bg-background">
      <PatientHeader
        patientName={patient?.full_name}
        onBack={() => navigate("/patients")}
        onSave={form.handleSubmit(onSubmit)}
        saveStatus={saveStatus}
        lastSaved={lastSaved}
        isLoading={form.formState.isSubmitting}
      />

      <div className="flex w-full">
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <Form {...form}>
              <form className="space-y-6">
                <PatientTabs form={form} />
              </form>
            </Form>
          </div>
        </div>
        
        <div className="border-l bg-muted/20 p-6">
          <div className="sticky top-24">
            <PatientSidebar patient={patient} form={form} />
          </div>
        </div>
      </div>
    </div>
  );
}