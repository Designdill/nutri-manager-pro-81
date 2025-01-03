import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormValues } from "../../types";

interface NutritionalAPIsProps {
  form: UseFormReturn<SettingsFormValues>;
}

export function NutritionalAPIs({ form }: NutritionalAPIsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">APIs de Dados Nutricionais</h3>
      
      <FormField
        control={form.control}
        name="open_food_facts_api_key"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Chave API Open Food Facts</FormLabel>
            <FormControl>
              <Input {...field} type="password" value={field.value || ""} />
            </FormControl>
            <FormDescription>
              Necessária para buscar informações nutricionais detalhadas
            </FormDescription>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="usda_fooddata_api_key"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Chave API USDA FoodData Central</FormLabel>
            <FormControl>
              <Input {...field} type="password" value={field.value || ""} />
            </FormControl>
            <FormDescription>
              Para acesso à base de dados nutricional do USDA
            </FormDescription>
          </FormItem>
        )}
      />
    </div>
  );
}