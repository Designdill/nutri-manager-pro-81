import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";

const consultationFormSchema = z.object({
  consultation_date: z.string().min(1, "Data é obrigatória"),
  weight: z.string().min(1, "Peso é obrigatório"),
  bmi: z.string(),
  body_fat_percentage: z.string().optional(),
  waist_circumference: z.string().optional(),
  physical_activity_level: z.string().optional(),
  meal_plan_adherence: z.string().optional(),
  diet_related_symptoms: z.string().optional(),
  observations: z.string().optional(),
  meal_plan: z.string().optional(),
  long_term_goals: z.string().optional(),
  nutritional_interventions: z.string().optional(),
});

type ConsultationFormValues = z.infer<typeof consultationFormSchema>;

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="consultation_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data do Atendimento</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Peso Atual (kg)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.1" 
                  {...field} 
                  onChange={(e) => {
                    field.onChange(e);
                    calculateBMI(e.target.value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bmi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>IMC</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} readOnly />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="body_fat_percentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gordura Corporal (%)</FormLabel>
              <FormControl>
                <Input type="number" step="0.1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="waist_circumference"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Circunferência da Cintura (cm)</FormLabel>
              <FormControl>
                <Input type="number" step="0.1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="physical_activity_level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nível de Atividade Física</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o nível" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="sedentário">Sedentário</SelectItem>
                  <SelectItem value="moderadamente ativo">Moderadamente Ativo</SelectItem>
                  <SelectItem value="muito ativo">Muito Ativo</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="meal_plan_adherence"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Aderência ao Plano Alimentar</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a aderência" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="total">Total</SelectItem>
                  <SelectItem value="parcial">Parcial</SelectItem>
                  <SelectItem value="não seguiu">Não Seguiu</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="diet_related_symptoms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sintomas Relacionados à Dieta</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Descreva os sintomas ou problemas relacionados à dieta" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="observations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="meal_plan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plano Alimentar Sugerido</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="long_term_goals"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Metas a Longo Prazo</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Estabeleça metas nutricionais e de saúde para o próximo período" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nutritional_interventions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Intervenções Nutricionais Realizadas</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Descreva as intervenções nutricionais realizadas desde a última consulta" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
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