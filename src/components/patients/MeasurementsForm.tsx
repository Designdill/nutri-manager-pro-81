import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { PatientFormValues } from "./types";

interface MeasurementsFormProps {
  form: UseFormReturn<PatientFormValues>;
}

export function MeasurementsForm({ form }: MeasurementsFormProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Medidas e Objetivos</h3>
      <div className="grid gap-4 md:grid-cols-3">
        <FormField
          control={form.control}
          name="current_weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Peso Atual (kg)</FormLabel>
              <FormControl>
                <Input type="number" step="0.1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="target_weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Peso Desejado (kg)</FormLabel>
              <FormControl>
                <Input type="number" step="0.1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="height"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Altura (m)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}