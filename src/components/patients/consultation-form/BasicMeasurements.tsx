import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ConsultationFormValues } from "../types";

interface BasicMeasurementsProps {
  form: UseFormReturn<ConsultationFormValues>;
  calculateBMI: (weight: string) => void;
}

export function BasicMeasurements({ form, calculateBMI }: BasicMeasurementsProps) {
  return (
    <div className="space-y-4">
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
    </div>
  );
}