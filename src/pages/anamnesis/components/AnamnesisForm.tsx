import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { anamnesisFormSchema, type AnamnesisFormValues } from "../types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BasicInfoSection } from "./form-sections/BasicInfoSection";
import { MedicalHistorySection } from "./form-sections/MedicalHistorySection";
import { DietaryHistorySection } from "./form-sections/DietaryHistorySection";
import { LifestyleSection } from "./form-sections/LifestyleSection";
import { AnthropometricSection } from "./form-sections/AnthropometricSection";
import { SymptomsSection } from "./form-sections/SymptomsSection";
import { GoalsSection } from "./form-sections/GoalsSection";
import { ProfessionalSection } from "./form-sections/ProfessionalSection";

interface AnamnesisFormProps {
  onSuccess: () => void;
  nutritionistId?: string;
}

export function AnamnesisForm({ onSuccess, nutritionistId }: AnamnesisFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<AnamnesisFormValues>({
    resolver: zodResolver(anamnesisFormSchema),
    defaultValues: {
      anamnesis_date: new Date().toISOString().split('T')[0],
      family_obesity: false,
      family_diabetes: false,
      family_hypertension: false,
      family_heart_disease: false,
      smoking: false,
      constipation: false,
      diarrhea: false,
      bloating: false,
      heartburn: false,
      nausea: false,
      fatigue: false,
      headaches: false,
      mood_changes: false,
      skin_problems: false,
      hair_loss: false,
      lactation: false,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (values: AnamnesisFormValues) => {
      if (!nutritionistId) {
        throw new Error("ID do nutricionista não fornecido");
      }

      const insertData: any = {
        ...values,
        nutritionist_id: nutritionistId,
      };

      const { data, error } = await supabase
        .from('anamneses')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Anamnese criada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ['anamneses'] });
      onSuccess();
    },
    onError: (error) => {
      console.error('Error creating anamnesis:', error);
      toast.error("Erro ao criar anamnese");
    },
  });

  const onSubmit = (values: AnamnesisFormValues) => {
    createMutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
            <TabsTrigger value="basic">Básico</TabsTrigger>
            <TabsTrigger value="medical">Histórico</TabsTrigger>
            <TabsTrigger value="dietary">Alimentação</TabsTrigger>
            <TabsTrigger value="lifestyle">Estilo de Vida</TabsTrigger>
            <TabsTrigger value="anthropometric">Medidas</TabsTrigger>
            <TabsTrigger value="symptoms">Sintomas</TabsTrigger>
            <TabsTrigger value="goals">Objetivos</TabsTrigger>
            <TabsTrigger value="professional">Profissional</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-4">
            <BasicInfoSection form={form} />
          </TabsContent>

          <TabsContent value="medical" className="space-y-4 mt-4">
            <MedicalHistorySection form={form} />
          </TabsContent>

          <TabsContent value="dietary" className="space-y-4 mt-4">
            <DietaryHistorySection form={form} />
          </TabsContent>

          <TabsContent value="lifestyle" className="space-y-4 mt-4">
            <LifestyleSection form={form} />
          </TabsContent>

          <TabsContent value="anthropometric" className="space-y-4 mt-4">
            <AnthropometricSection form={form} />
          </TabsContent>

          <TabsContent value="symptoms" className="space-y-4 mt-4">
            <SymptomsSection form={form} />
          </TabsContent>

          <TabsContent value="goals" className="space-y-4 mt-4">
            <GoalsSection form={form} />
          </TabsContent>

          <TabsContent value="professional" className="space-y-4 mt-4">
            <ProfessionalSection form={form} />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4">
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? "Salvando..." : "Salvar Anamnese"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
