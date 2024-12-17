import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
  observations: z.string().optional(),
  meal_plan: z.string().optional(),
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
      observations: "",
      meal_plan: "",
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
          observations: data.observations,
          meal_plan: data.meal_plan,
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