import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { ConsultationFormValues } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, Target, Stethoscope } from "lucide-react";

interface NotesAndPlansProps {
  form: UseFormReturn<ConsultationFormValues>;
}

export function NotesAndPlans({ form }: NotesAndPlansProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5" />
          Observações e Planos
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <FormField
          control={form.control}
          name="diet_related_symptoms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sintomas Relacionados à Dieta</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Descreva os sintomas ou problemas relacionados à dieta" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="observations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Observações gerais sobre o atendimento" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="meal_plan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plano Alimentar Sugerido</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Descreva o plano alimentar recomendado" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="long_term_goals"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Metas a Longo Prazo</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Estabeleça metas nutricionais e de saúde para o próximo período" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nutritional_interventions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Intervenções Nutricionais Realizadas</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Descreva as intervenções nutricionais realizadas desde a última consulta" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}