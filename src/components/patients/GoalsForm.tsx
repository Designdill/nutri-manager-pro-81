import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o principal objetivo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="weight_loss">Perda de peso</SelectItem>
                    <SelectItem value="weight_gain">Ganho de peso</SelectItem>
                    <SelectItem value="maintenance">Manutenção do peso</SelectItem>
                    <SelectItem value="muscle_gain">Ganho de massa muscular</SelectItem>
                    <SelectItem value="health_improvement">Melhoria da saúde geral</SelectItem>
                    <SelectItem value="disease_management">Controle de doença</SelectItem>
                    <SelectItem value="sports_performance">Performance esportiva</SelectItem>
                  </SelectContent>
                </Select>
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a principal expectativa" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="quick_results">Resultados rápidos</SelectItem>
                    <SelectItem value="sustainable_changes">Mudanças sustentáveis</SelectItem>
                    <SelectItem value="education">Aprendizado sobre nutrição</SelectItem>
                    <SelectItem value="lifestyle_change">Mudança de estilo de vida</SelectItem>
                    <SelectItem value="health_improvement">Melhoria da saúde</SelectItem>
                    <SelectItem value="specific_goal">Alcançar meta específica</SelectItem>
                  </SelectContent>
                </Select>
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