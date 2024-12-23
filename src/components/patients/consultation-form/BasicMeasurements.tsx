import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ConsultationFormValues } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, Ruler, Activity } from "lucide-react";

interface BasicMeasurementsProps {
  form: UseFormReturn<ConsultationFormValues>;
  calculateBMI: (weight: string) => void;
}

export function BasicMeasurements({ form, calculateBMI }: BasicMeasurementsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scale className="h-5 w-5" />
          Medidas Básicas
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
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
      </CardContent>
    </Card>
  );
}