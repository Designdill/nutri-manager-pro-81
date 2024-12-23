import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { ConsultationFormValues } from "../types";

interface NotesAndPlansProps {
  form: UseFormReturn<ConsultationFormValues>;
}

export function NotesAndPlans({ form }: NotesAndPlansProps) {
  return (
    <div className="space-y-4">
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
    </div>
  );
}