import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { MealPlanFormData, mealPlanSchema } from "./types";
import { MealPlanPatientSelect } from "./form/MealPlanPatientSelect";
import { MealPlanBasicInfo } from "./form/MealPlanBasicInfo";
import { MealPlanMeals } from "./form/MealPlanMeals";

interface CreateMealPlanFormProps {
  patients: Tables<"patients">[];
  patientsLoading: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CreateMealPlanForm({ 
  patients, 
  patientsLoading, 
  onSuccess, 
  onCancel 
}: CreateMealPlanFormProps) {
  const form = useForm<MealPlanFormData>({
    defaultValues: {
      patientId: "",
      title: "",
      description: "",
      breakfast: "",
      morningSnack: "",
      lunch: "",
      afternoonSnack: "",
      dinner: "",
      eveningSnack: "",
    },
  });
  
  const { toast } = useToast();

  const handleCreatePlan = async (data: MealPlanFormData) => {
    try {
      const { error } = await supabase.from("meal_plans").insert({
        patient_id: data.patientId,
        title: data.title,
        description: data.description,
        breakfast: data.breakfast,
        morning_snack: data.morningSnack,
        lunch: data.lunch,
        afternoon_snack: data.afternoonSnack,
        dinner: data.dinner,
        evening_snack: data.eveningSnack,
      });

      if (error) throw error;
      
      toast({
        title: "Plano alimentar criado",
        description: "O plano alimentar foi criado com sucesso.",
      });
      
      onSuccess();
      form.reset();
    } catch (error) {
      console.error("Error creating meal plan:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar o plano alimentar.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleCreatePlan)} className="space-y-4">
        <MealPlanPatientSelect 
          form={form} 
          patients={patients} 
          patientsLoading={patientsLoading} 
        />
        
        <MealPlanBasicInfo form={form} />
        
        <MealPlanMeals form={form} />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">Criar Plano Alimentar</Button>
        </div>
      </form>
    </Form>
  );
}