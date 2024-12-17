import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { PatientFormValues } from "./types";

interface LifestyleFormProps {
  form: UseFormReturn<PatientFormValues>;
}

export function LifestyleForm({ form }: LifestyleFormProps) {
  return (
    <>
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Hábitos Alimentares</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="meals_per_day"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Refeições por Dia</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dietary_restrictions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Restrições Alimentares</FormLabel>
                <FormControl>
                  <Textarea placeholder="Restrições ou preferências alimentares" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Atividade Física</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <FormField
            control={form.control}
            name="exercise_frequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frequência</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentário</SelectItem>
                    <SelectItem value="1-2x">1-2x por semana</SelectItem>
                    <SelectItem value="3-4x">3-4x por semana</SelectItem>
                    <SelectItem value="5+">5+ vezes por semana</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="exercise_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Exercício</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: musculação, corrida" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="exercise_duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duração (minutos)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Padrão de Sono</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="sleep_hours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horas de Sono</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="good">Boa</SelectItem>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="poor">Ruim</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </>
  );
}