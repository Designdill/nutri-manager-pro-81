import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { PatientFormValues } from "./types";

interface HealthHistoryFormProps {
  form: UseFormReturn<PatientFormValues>;
}

export function HealthHistoryForm({ form }: HealthHistoryFormProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Histórico de Saúde</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="blood_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo Sanguíneo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="family_history"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Histórico Familiar</FormLabel>
              <FormControl>
                <Textarea placeholder="Histórico de doenças na família" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="medical_conditions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Condições Médicas</FormLabel>
              <FormControl>
                <Textarea placeholder="Condições médicas relevantes" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="allergies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alergias</FormLabel>
              <FormControl>
                <Textarea placeholder="Alergias conhecidas" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="medications"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Medicações</FormLabel>
              <FormControl>
                <Textarea placeholder="Medicações em uso" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}