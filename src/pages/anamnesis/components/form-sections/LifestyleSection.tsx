import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { AnamnesisFormValues } from "../../types";

interface LifestyleSectionProps {
  form: UseFormReturn<AnamnesisFormValues>;
}

export function LifestyleSection({ form }: LifestyleSectionProps) {
  return (
    <>
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Atividade Física</h3>

        <FormField
          control={form.control}
          name="physical_activity_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Atividade</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ex: Caminhada, Musculação, Natação" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="physical_activity_frequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Frequência</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ex: 3x por semana" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="physical_activity_duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duração</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ex: 45 minutos" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Hábitos</h3>

        <FormField
          control={form.control}
          name="smoking"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Fumante</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="smoking_details"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Detalhes do Tabagismo</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Quantidade, tempo de uso, tentativas de parar" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sleep_hours"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Horas de Sono por Noite</FormLabel>
              <FormControl>
                <Input type="number" {...field} placeholder="8" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sleep_quality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Qualidade do Sono</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ex: Boa, Ruim, Interrompido" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="stress_level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nível de Estresse</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ex: Baixo, Moderado, Alto" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
