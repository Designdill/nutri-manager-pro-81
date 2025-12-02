import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UseFormReturn } from "react-hook-form";
import { AnamnesisFormValues } from "../../types";

interface BasicInfoSectionProps {
  form: UseFormReturn<AnamnesisFormValues>;
}

export function BasicInfoSection({ form }: BasicInfoSectionProps) {
  const { data: patients } = useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('patients')
        .select('id, full_name')
        .order('full_name');
      if (error) throw error;
      return data;
    },
  });

  return (
    <>
      <FormField
        control={form.control}
        name="patient_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Paciente *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o paciente" />
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

      <FormField
        control={form.control}
        name="anamnesis_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Data da Anamnese</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="chief_complaint"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Queixa Principal</FormLabel>
            <FormControl>
              <Textarea {...field} placeholder="Motivo principal da consulta" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="complaint_duration"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Duração da Queixa</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Ex: 3 meses, 1 ano" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
