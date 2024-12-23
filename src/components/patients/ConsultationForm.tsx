import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { ConsultationFormValues, consultationFormSchema } from "./types";
import { BasicMeasurements } from "./consultation-form/BasicMeasurements";
import { ActivityAndAdherence } from "./consultation-form/ActivityAndAdherence";
import { NotesAndPlans } from "./consultation-form/NotesAndPlans";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ConsultationFormProps {
  patientId: string;
  patientHeight?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ConsultationForm({ patientId, patientHeight, onSuccess, onCancel }: ConsultationFormProps) {
  const { toast } = useToast();
  const form = useForm<ConsultationFormValues>({
    resolver: zodResolver(consultationFormSchema),
    defaultValues: {
      consultation_date: new Date().toISOString().split('T')[0],
      weight: "",
      bmi: "",
      body_fat_percentage: "",
      waist_circumference: "",
      physical_activity_level: "",
      meal_plan_adherence: "",
      diet_related_symptoms: "",
      observations: "",
      meal_plan: "",
      long_term_goals: "",
      nutritional_interventions: "",
    },
  });

  const calculateBMI = (weight: string) => {
    if (patientHeight && weight) {
      const bmi = Number(weight) / (patientHeight * patientHeight);
      form.setValue("bmi", bmi.toFixed(2));
    }
  };

  const onSubmit = async (data: ConsultationFormValues) => {
    try {
      const { error } = await supabase
        .from("consultations")
        .insert({
          patient_id: patientId,
          consultation_date: data.consultation_date,
          weight: parseFloat(data.weight),
          bmi: parseFloat(data.bmi),
          body_fat_percentage: data.body_fat_percentage ? parseFloat(data.body_fat_percentage) : null,
          waist_circumference: data.waist_circumference ? parseFloat(data.waist_circumference) : null,
          physical_activity_level: data.physical_activity_level,
          meal_plan_adherence: data.meal_plan_adherence,
          diet_related_symptoms: data.diet_related_symptoms,
          observations: data.observations,
          meal_plan: data.meal_plan,
          long_term_goals: data.long_term_goals,
          nutritional_interventions: data.nutritional_interventions,
        });

      if (error) throw error;

      toast({
        title: "Atendimento registrado com sucesso",
      });

      onSuccess?.();
    } catch (error) {
      console.error("Erro ao registrar atendimento:", error);
      toast({
        title: "Erro ao registrar atendimento",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Novo Atendimento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <BasicMeasurements form={form} calculateBMI={calculateBMI} />
              <ActivityAndAdherence form={form} />
              <NotesAndPlans form={form} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-2 sticky bottom-4 bg-background p-4 rounded-lg shadow-lg border">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button type="submit">Salvar Atendimento</Button>
        </div>
      </form>
    </Form>
  );
}