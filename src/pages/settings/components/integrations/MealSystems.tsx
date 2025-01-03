import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormValues } from "../../types";
import { useIntegrationToggle } from "./useIntegrationToggle";

interface MealSystemsProps {
  form: UseFormReturn<SettingsFormValues>;
}

export function MealSystems({ form }: MealSystemsProps) {
  const handleIntegrationToggle = useIntegrationToggle();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Sistemas de Refeições</h3>
      
      <FormField
        control={form.control}
        name="meal_delivery_connected"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Entrega de Refeições</FormLabel>
              <FormDescription>
                Conecte com serviços de entrega de refeições
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={(checked) => {
                  field.onChange(checked);
                  handleIntegrationToggle(checked, 'Meal Delivery');
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="recipe_planning_connected"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Planejamento de Receitas</FormLabel>
              <FormDescription>
                Integre com sistemas de planejamento de receitas
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={(checked) => {
                  field.onChange(checked);
                  handleIntegrationToggle(checked, 'Recipe Planning');
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}