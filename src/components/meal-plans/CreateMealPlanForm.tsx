import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import * as z from "zod";

const mealPlanSchema = z.object({
  patientId: z.string().min(1, "Selecione um paciente"),
  title: z.string().min(1, "Digite um título"),
  description: z.string().optional(),
  breakfast: z.string().optional(),
  morningSnack: z.string().optional(),
  lunch: z.string().optional(),
  afternoonSnack: z.string().optional(),
  dinner: z.string().optional(),
  eveningSnack: z.string().optional(),
});

type MealPlanFormData = z.infer<typeof mealPlanSchema>;

interface CreateMealPlanFormProps {
  patients: Tables<"patients">[];
  patientsLoading: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CreateMealPlanForm({ patients, patientsLoading, onSuccess, onCancel }: CreateMealPlanFormProps) {
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
        <FormField
          control={form.control}
          name="patientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Paciente</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={patientsLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um paciente" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {patients?.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título do Plano</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Plano Base - Redução de Peso" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descreva os objetivos e observações gerais do plano"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="breakfast"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Café da Manhã</FormLabel>
                <FormControl>
                  <Textarea placeholder="Detalhes do café da manhã" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="morningSnack"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lanche da Manhã</FormLabel>
                <FormControl>
                  <Textarea placeholder="Detalhes do lanche da manhã" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lunch"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Almoço</FormLabel>
                <FormControl>
                  <Textarea placeholder="Detalhes do almoço" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="afternoonSnack"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lanche da Tarde</FormLabel>
                <FormControl>
                  <Textarea placeholder="Detalhes do lanche da tarde" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dinner"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jantar</FormLabel>
                <FormControl>
                  <Textarea placeholder="Detalhes do jantar" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="eveningSnack"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ceia</FormLabel>
                <FormControl>
                  <Textarea placeholder="Detalhes da ceia" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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