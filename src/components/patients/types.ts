import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

export const patientFormSchema = z.object({
  full_name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string()
    .min(1, "Email é obrigatório")
    .email("Por favor, insira um email válido")
    .refine(async (email) => {
      // Check if email is unique in the database
      const { data, error } = await supabase
        .from('patients')
        .select('id')
        .eq('email', email)
        .single();
      
      return !data; // Return true if email doesn't exist (is unique)
    }, "Este email já está em uso"),
  cpf: z.string().min(11, "CPF inválido"),
  phone: z.string().optional(),
  birth_date: z.string().optional(),
  gender: z.string().optional(),
  occupation: z.string().optional(),
});

export type PatientFormValues = z.infer<typeof patientFormSchema>;
