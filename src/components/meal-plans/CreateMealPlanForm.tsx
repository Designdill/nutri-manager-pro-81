import { useState } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { MealPlanFormData } from "./types";
import { MealPlanPatientSelect } from "./form/MealPlanPatientSelect";
import { MealPlanBasicInfo } from "./form/MealPlanBasicInfo";
import { MealPlanMeals } from "./form/MealPlanMeals";
import { Sparkles, Loader2 } from "lucide-react";

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
  const [isGenerating, setIsGenerating] = useState(false);
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
  const selectedPatientId = form.watch("patientId");

  const handleGenerateWithAI = async () => {
    if (!selectedPatientId) {
      toast({
        title: "Selecione um paciente",
        description: "É necessário selecionar um paciente para gerar sugestões personalizadas.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Get patient data
      const selectedPatient = patients.find(p => p.id === selectedPatientId);
      
      if (!selectedPatient) {
        throw new Error("Paciente não encontrado");
      }

      const { data, error } = await supabase.functions.invoke("suggest-meal-plan", {
        body: { patientData: selectedPatient }
      });

      if (error) {
        throw error;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      const mealPlan = data?.mealPlan;
      
      if (mealPlan) {
        // Auto-fill the form with AI suggestions
        form.setValue("title", mealPlan.title || "");
        form.setValue("description", mealPlan.description || "");
        form.setValue("breakfast", mealPlan.breakfast || "");
        form.setValue("morningSnack", mealPlan.morningSnack || "");
        form.setValue("lunch", mealPlan.lunch || "");
        form.setValue("afternoonSnack", mealPlan.afternoonSnack || "");
        form.setValue("dinner", mealPlan.dinner || "");
        form.setValue("eveningSnack", mealPlan.eveningSnack || "");

        toast({
          title: "Sugestão gerada com sucesso!",
          description: "O plano alimentar foi preenchido automaticamente. Revise e ajuste conforme necessário.",
        });
      }
    } catch (error: any) {
      console.error("Error generating meal plan:", error);
      toast({
        title: "Erro ao gerar sugestão",
        description: error.message || "Ocorreu um erro ao gerar o plano alimentar com IA.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

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
        
        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleGenerateWithAI}
            disabled={isGenerating || !selectedPatientId}
            className="gap-2"
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {isGenerating ? "Gerando..." : "Gerar com IA"}
          </Button>
        </div>
        
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
