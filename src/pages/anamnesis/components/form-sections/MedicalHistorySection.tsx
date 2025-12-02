import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { AnamnesisFormValues } from "../../types";

interface MedicalHistorySectionProps {
  form: UseFormReturn<AnamnesisFormValues>;
}

export function MedicalHistorySection({ form }: MedicalHistorySectionProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="previous_diseases"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Doenças Anteriores</FormLabel>
            <FormControl>
              <Textarea {...field} placeholder="Histórico de doenças já tratadas" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="current_diseases"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Doenças Atuais</FormLabel>
            <FormControl>
              <Textarea {...field} placeholder="Condições de saúde em tratamento" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="chronic_conditions"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Condições Crônicas</FormLabel>
            <FormControl>
              <Textarea {...field} placeholder="Ex: Diabetes, Hipertensão, etc." />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="hospitalizations"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hospitalizações</FormLabel>
            <FormControl>
              <Textarea {...field} placeholder="Histórico de internações" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="surgeries"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cirurgias</FormLabel>
            <FormControl>
              <Textarea {...field} placeholder="Cirurgias realizadas" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="current_medications"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Medicamentos Atuais</FormLabel>
            <FormControl>
              <Textarea {...field} placeholder="Medicamentos em uso" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="vitamin_supplements"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Suplementos Vitamínicos</FormLabel>
            <FormControl>
              <Textarea {...field} placeholder="Vitaminas e minerais" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="herbal_supplements"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Fitoterápicos</FormLabel>
            <FormControl>
              <Textarea {...field} placeholder="Produtos naturais/ervas" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Histórico Familiar</h3>
        
        <FormField
          control={form.control}
          name="family_diseases"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Doenças na Família</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Histórico familiar de doenças" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="family_obesity"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">Obesidade na família</FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="family_diabetes"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">Diabetes na família</FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="family_hypertension"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">Hipertensão na família</FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="family_heart_disease"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">Doenças cardíacas na família</FormLabel>
              </FormItem>
            )}
          />
        </div>
      </div>
    </>
  );
}
