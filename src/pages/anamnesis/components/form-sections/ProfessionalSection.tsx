import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { AnamnesisFormValues } from "../../types";

interface ProfessionalSectionProps {
  form: UseFormReturn<AnamnesisFormValues>;
}

export function ProfessionalSection({ form }: ProfessionalSectionProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="clinical_impression"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Impressão Clínica</FormLabel>
            <FormControl>
              <Textarea {...field} placeholder="Sua avaliação clínica inicial" rows={4} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="nutritional_diagnosis"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Diagnóstico Nutricional</FormLabel>
            <FormControl>
              <Textarea {...field} placeholder="Diagnóstico nutricional baseado na avaliação" rows={4} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="initial_recommendations"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Recomendações Iniciais</FormLabel>
            <FormControl>
              <Textarea {...field} placeholder="Orientações e recomendações iniciais para o paciente" rows={6} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
