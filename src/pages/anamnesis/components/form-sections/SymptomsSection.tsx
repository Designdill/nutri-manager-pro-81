import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { AnamnesisFormValues } from "../../types";

interface SymptomsSectionProps {
  form: UseFormReturn<AnamnesisFormValues>;
}

export function SymptomsSection({ form }: SymptomsSectionProps) {
  return (
    <>
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Sintomas Digestivos</h3>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="constipation"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">Constipação</FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="diarrhea"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">Diarreia</FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bloating"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">Inchaço/Distensão</FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="heartburn"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">Azia/Refluxo</FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nausea"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">Náusea/Vômito</FormLabel>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="digestive_other"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Outros Sintomas Digestivos</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Descreva outros sintomas" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Sintomas Gerais</h3>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="fatigue"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">Fadiga/Cansaço</FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="headaches"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">Dores de Cabeça</FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mood_changes"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">Alterações de Humor</FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="skin_problems"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">Problemas de Pele</FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hair_loss"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">Queda de Cabelo</FormLabel>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="other_symptoms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Outros Sintomas</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Descreva outros sintomas" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Saúde da Mulher</h3>

        <FormField
          control={form.control}
          name="menstrual_cycle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ciclo Menstrual</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Regular, irregular, menopausa" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pregnancy_history"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Histórico de Gestações</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Gestações, partos, complicações" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lactation"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="font-normal">Atualmente em lactação</FormLabel>
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
