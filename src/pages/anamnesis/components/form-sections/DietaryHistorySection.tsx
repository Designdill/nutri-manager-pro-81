import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { AnamnesisFormValues } from "../../types";

interface DietaryHistorySectionProps {
  form: UseFormReturn<AnamnesisFormValues>;
}

export function DietaryHistorySection({ form }: DietaryHistorySectionProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="eating_pattern"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Padrão Alimentar</FormLabel>
            <FormControl>
              <Textarea {...field} placeholder="Descrição do padrão alimentar atual" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="usual_breakfast"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Café da Manhã Habitual</FormLabel>
            <FormControl>
              <Textarea {...field} placeholder="O que costuma comer no café da manhã?" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="usual_lunch"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Almoço Habitual</FormLabel>
            <FormControl>
              <Textarea {...field} placeholder="O que costuma comer no almoço?" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="usual_dinner"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Jantar Habitual</FormLabel>
            <FormControl>
              <Textarea {...field} placeholder="O que costuma comer no jantar?" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="usual_snacks"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Lanches Habituais</FormLabel>
            <FormControl>
              <Textarea {...field} placeholder="O que costuma comer nos lanches?" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="food_allergies"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Alergias Alimentares</FormLabel>
            <FormControl>
              <Textarea {...field} placeholder="Alimentos que causam alergia" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="food_intolerances"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Intolerâncias Alimentares</FormLabel>
            <FormControl>
              <Textarea {...field} placeholder="Ex: lactose, glúten" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="food_aversions"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Aversões Alimentares</FormLabel>
            <FormControl>
              <Textarea {...field} placeholder="Alimentos que não gosta" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="food_preferences"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Preferências Alimentares</FormLabel>
            <FormControl>
              <Textarea {...field} placeholder="Alimentos favoritos" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="water_intake_ml"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ingestão de Água (ml/dia)</FormLabel>
            <FormControl>
              <Input type="number" {...field} placeholder="2000" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="alcohol_consumption"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Consumo de Álcool</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Frequência e quantidade" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="caffeine_intake"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Consumo de Cafeína</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Café, chá, refrigerantes" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
