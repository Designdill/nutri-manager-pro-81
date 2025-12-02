import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { AnamnesisFormValues } from "../../types";

interface GoalsSectionProps {
  form: UseFormReturn<AnamnesisFormValues>;
}

export function GoalsSection({ form }: GoalsSectionProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="weight_goal"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Meta de Peso</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Ex: Perder 10kg, Manter peso atual" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="primary_goals"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Objetivos Principais</FormLabel>
            <FormControl>
              <Textarea {...field} placeholder="Quais são os principais objetivos do paciente?" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="expectations"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Expectativas do Tratamento</FormLabel>
            <FormControl>
              <Textarea {...field} placeholder="O que o paciente espera alcançar?" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="motivation_level"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nível de Motivação</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Baixo, Moderado, Alto" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="barriers_to_change"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Barreiras para Mudança</FormLabel>
            <FormControl>
              <Textarea {...field} placeholder="Quais são os obstáculos identificados?" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Exames Laboratoriais</h3>

        <FormField
          control={form.control}
          name="lab_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data dos Exames</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="recent_lab_results"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resultados Recentes</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Resultados de exames laboratoriais recentes" rows={6} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
