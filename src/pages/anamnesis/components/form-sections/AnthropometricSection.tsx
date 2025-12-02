import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { AnamnesisFormValues } from "../../types";
import { useEffect } from "react";

interface AnthropometricSectionProps {
  form: UseFormReturn<AnamnesisFormValues>;
}

export function AnthropometricSection({ form }: AnthropometricSectionProps) {
  const weight = form.watch("current_weight");
  const height = form.watch("height");

  useEffect(() => {
    if (weight && height) {
      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);
      form.setValue("bmi", Number(bmi.toFixed(2)));
    }
  }, [weight, height, form]);

  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="current_weight"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Peso Atual (kg)</FormLabel>
            <FormControl>
              <Input type="number" step="0.1" {...field} placeholder="70.5" />
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
            <FormLabel>Altura (cm)</FormLabel>
            <FormControl>
              <Input type="number" step="0.1" {...field} placeholder="170" />
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
              <Input type="number" step="0.01" {...field} placeholder="Calculado automaticamente" disabled />
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
              <Input type="number" step="0.1" {...field} placeholder="80" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="hip_circumference"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Circunferência do Quadril (cm)</FormLabel>
            <FormControl>
              <Input type="number" step="0.1" {...field} placeholder="100" />
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
            <FormLabel>Percentual de Gordura (%)</FormLabel>
            <FormControl>
              <Input type="number" step="0.1" {...field} placeholder="25" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="muscle_mass_percentage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Percentual de Massa Muscular (%)</FormLabel>
            <FormControl>
              <Input type="number" step="0.1" {...field} placeholder="35" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
