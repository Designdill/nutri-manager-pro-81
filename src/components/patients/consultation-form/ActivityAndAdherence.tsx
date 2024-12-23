import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { ConsultationFormValues } from "../types";

interface ActivityAndAdherenceProps {
  form: UseFormReturn<ConsultationFormValues>;
}

export function ActivityAndAdherence({ form }: ActivityAndAdherenceProps) {
  return (
    <div className="space-y-4">
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
    </div>
  );
}