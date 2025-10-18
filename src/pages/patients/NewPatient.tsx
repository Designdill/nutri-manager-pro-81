import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/App";
import type { TablesInsert } from "@/integrations/supabase/types";
import { patientFormSchema, type PatientFormValues } from "@/components/patients/types";
import { PatientRegistrationForm } from "@/components/patients/PatientRegistrationForm";

type PatientInsert = TablesInsert<"patients">;

export default function NewPatient() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    shouldFocusError: false,
    defaultValues: {
      full_name: "",
      cpf: "",
      email: "",
      phone: "",
      birth_date: "",
      gender: "",
      occupation: "",
      postal_code: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      current_weight: "",
      target_weight: "",
      height: "",
      blood_type: "",
      family_history: "",
      medical_conditions: "",
      surgery_history: "",
      allergies: "",
      medications: "",
      meals_per_day: "",
      dietary_type: "",
      dietary_restrictions: "",
      food_preferences: "",
      water_intake: "",
      exercise_frequency: "",
      exercise_type: "",
      exercise_duration: "",
      sleep_hours: "",
      sleep_quality: "",
      nutritional_goals: "",
      treatment_expectations: "",
      additional_notes: "",
      status: "created",
    },
  });

  const onSubmit = async (values: PatientFormValues) => {
    if (isSubmitting) return; // Prevent double submission
    
    try {
      setIsSubmitting(true);
      
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
        full_name: values.full_name.trim(),
        cpf: values.cpf?.trim() || null,
        nutritionist_id: session.user.id,
        email: values.email.trim(),
        phone: values.phone?.trim() || null,
        birth_date: values.birth_date?.trim() || null,
        gender: values.gender?.trim() || null,
        occupation: values.occupation?.trim() || null,
        postal_code: values.postal_code?.trim() || null,
        street: values.street?.trim() || null,
        number: values.number?.trim() || null,
        complement: values.complement?.trim() || null,
        neighborhood: values.neighborhood?.trim() || null,
        city: values.city?.trim() || null,
        state: values.state?.trim() || null,
        current_weight: values.current_weight?.trim() ? parseFloat(values.current_weight) : null,
        target_weight: values.target_weight?.trim() ? parseFloat(values.target_weight) : null,
        height: values.height?.trim() ? parseFloat(values.height) : null,
        blood_type: values.blood_type?.trim() || null,
        family_history: values.family_history?.trim() || null,
        medical_conditions: values.medical_conditions?.trim() || null,
        surgery_history: values.surgery_history?.trim() || null,
        allergies: values.allergies?.trim() || null,
        medications: values.medications?.trim() || null,
        meals_per_day: values.meals_per_day?.trim() ? parseInt(values.meals_per_day) : null,
        dietary_type: values.dietary_type?.trim() || null,
        dietary_restrictions: values.dietary_restrictions?.trim() || null,
        food_preferences: values.food_preferences?.trim() || null,
        water_intake: values.water_intake?.trim() ? parseFloat(values.water_intake) : null,
        exercise_frequency: values.exercise_frequency?.trim() || null,
        exercise_type: values.exercise_type?.trim() || null,
        exercise_duration: values.exercise_duration?.trim() || null,
        sleep_hours: values.sleep_hours?.trim() ? parseInt(values.sleep_hours) : null,
        sleep_quality: values.sleep_quality?.trim() || null,
        nutritional_goals: values.nutritional_goals?.trim() || null,
        treatment_expectations: values.treatment_expectations?.trim() || null,
        additional_notes: values.additional_notes?.trim() || null,
        status: values.status,
      };

      console.log("Inserting patient data:", patientData);

      const { error } = await supabase
        .from("patients")
        .insert(patientData);

      if (error) {
        console.error("Error inserting patient:", error);
        throw error;
      }

      // Send welcome email since email is now required
      try {
        const { data: welcomeData, error: welcomeError } = await supabase.functions.invoke('send-welcome-email', {
          body: {
            patientData: {
              full_name: values.full_name,
              email: values.email.trim(),
            },
            redirectTo: `${window.location.origin}/patient`
          }
        });

        if (welcomeError || (welcomeData as any)?.error) {
          console.error("Error sending welcome email:", welcomeError || (welcomeData as any)?.error);
          toast.error("Paciente cadastrado, mas houve um erro ao enviar o email de boas-vindas");
        } else {
          toast.success("Paciente cadastrado e email de boas-vindas enviado com sucesso!");
        }
      } catch (emailError) {
        console.error("Error invoking send-email function:", emailError);
        toast.error("Paciente cadastrado, mas houve um erro ao enviar o email de boas-vindas");
      }

      navigate("/patients");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erro ao cadastrar paciente");
    } finally {
      setIsSubmitting(false);
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
          <PatientRegistrationForm 
            form={form} 
            onSubmit={onSubmit}
            onCancel={() => navigate("/patients")}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  );
}