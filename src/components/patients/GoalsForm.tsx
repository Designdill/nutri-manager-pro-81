import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { PatientFormValues } from "./types";

interface GoalsFormProps {
  form: UseFormReturn<PatientFormValues>;
}

export function GoalsForm({ form }: GoalsFormProps) {
  return (
    <>
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Objetivos e Expectativas</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="nutritional_goals"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Objetivos Nutricionais</FormLabel>
                <FormControl>
                  <Textarea placeholder="Objetivos nutricionais do paciente" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="treatment_expectations"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expectativas do Tratamento</FormLabel>
                <FormControl>
                  <Textarea placeholder="Expectativas em relação ao tratamento" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Observações Adicionais</h3>
        <FormField
          control={form.control}
          name="additional_notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea placeholder="Informações adicionais relevantes" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}