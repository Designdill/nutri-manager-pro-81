import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { MealPlanFormData } from "../types";

interface MealPlanMealsProps {
  form: UseFormReturn<MealPlanFormData>;
}

export function MealPlanMeals({ form }: MealPlanMealsProps) {
  return (
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
  );
}