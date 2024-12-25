import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tables } from "@/integrations/supabase/types";
import { UseFormReturn } from "react-hook-form";
import { MealPlanFormData } from "../types";

interface MealPlanPatientSelectProps {
  form: UseFormReturn<MealPlanFormData>;
  patients: Tables<"patients">[];
  patientsLoading: boolean;
}

export function MealPlanPatientSelect({ form, patients, patientsLoading }: MealPlanPatientSelectProps) {
  return (
    <FormField
      control={form.control}
      name="patientId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Paciente</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
            disabled={patientsLoading}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um paciente" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {patients?.map((patient) => (
                <SelectItem key={patient.id} value={patient.id}>
                  {patient.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}