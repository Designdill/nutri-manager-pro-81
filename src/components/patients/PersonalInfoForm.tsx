import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { PatientFormValues } from "./types";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

interface PersonalInfoFormProps {
  form: UseFormReturn<PatientFormValues>;
}

export function PersonalInfoForm({ form }: PersonalInfoFormProps) {
  const { formState: { errors } } = form;
  const [cpfCheckLoading, setCpfCheckLoading] = useState(false);

  const checkCpfExists = async (cpf: string) => {
    if (!cpf || cpf.length < 11) return;
    
    setCpfCheckLoading(true);
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('id')
        .eq('cpf', cpf.replace(/\D/g, ''))
        .maybeSingle();
      
      if (data) {
        form.setError('cpf', {
          type: 'manual',
          message: 'Este CPF já está cadastrado no sistema'
        });
      }
    } catch (error) {
      console.error('Error checking CPF:', error);
    } finally {
      setCpfCheckLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Informações Pessoais</h3>
      
      {Object.keys(errors).length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Por favor, corrija os erros abaixo antes de continuar.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Nome do paciente" 
                  {...field} 
                  aria-required="true"
                  aria-invalid={!!errors.full_name}
                  aria-describedby={errors.full_name ? "full_name-error" : "full_name-description"}
                />
              </FormControl>
              <FormDescription id="full_name-description">
                Digite o nome completo do paciente
              </FormDescription>
              <FormMessage id="full_name-error" />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Email *</FormLabel>
              <FormControl>
                <Input 
                  type="email" 
                  placeholder="email@exemplo.com" 
                  {...field} 
                  aria-required="true"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : "email-description"}
                />
              </FormControl>
              <FormDescription id="email-description">
                Email obrigatório para comunicações e envio da senha de acesso
              </FormDescription>
              <FormMessage id="email-error" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cpf"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF</FormLabel>
              <FormControl>
                <Input 
                  placeholder="000.000.000-00" 
                  {...field}
                  onBlur={(e) => {
                    field.onBlur();
                    checkCpfExists(e.target.value);
                  }}
                  aria-invalid={!!errors.cpf}
                  aria-describedby={errors.cpf ? "cpf-error" : "cpf-description"}
                />
              </FormControl>
              <FormDescription id="cpf-description">
                {cpfCheckLoading ? "Verificando CPF..." : "Digite apenas números (opcional)"}
              </FormDescription>
              <FormMessage id="cpf-error" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="(00) 00000-0000" 
                  {...field}
                  type="tel"
                  aria-required="true"
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "phone-error" : "phone-description"}
                />
              </FormControl>
              <FormDescription id="phone-description">
                Telefone obrigatório para contato
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="birth_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data de Nascimento</FormLabel>
              <FormControl>
                <Input 
                  type="date" 
                  {...field}
                  aria-describedby="birth-date-description"
                />
              </FormControl>
              <FormDescription id="birth-date-description">
                Selecione a data de nascimento
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel id="gender-label">Gênero</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger 
                    aria-labelledby="gender-label"
                    aria-describedby="gender-description"
                    aria-invalid={!!errors.gender}
                  >
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="masculino">Masculino</SelectItem>
                  <SelectItem value="feminino">Feminino</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription id="gender-description">
                Selecione o gênero do paciente
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="occupation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profissão</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Profissão" 
                  {...field}
                  aria-describedby="occupation-description"
                />
              </FormControl>
              <FormDescription id="occupation-description">
                Digite a profissão atual do paciente
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}