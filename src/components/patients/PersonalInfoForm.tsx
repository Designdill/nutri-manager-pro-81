import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { PatientFormValues } from "./types";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PersonalInfoFormProps {
  form: UseFormReturn<PatientFormValues>;
}

export function PersonalInfoForm({ form }: PersonalInfoFormProps) {
  const { formState: { errors } } = form;

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
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  type="email" 
                  placeholder="email@exemplo.com" 
                  className={cn(
                    fieldState.error && "border-red-500 focus-visible:ring-red-500",
                    fieldState.isDirty && !fieldState.error && "border-green-500 focus-visible:ring-green-500"
                  )}
                  {...field} 
                  aria-required="true"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : "email-description"}
                />
              </FormControl>
              <FormDescription id="email-description">
                Este email será usado para comunicações importantes
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
                  aria-required="true"
                  aria-invalid={!!errors.cpf}
                  aria-describedby={errors.cpf ? "cpf-error" : "cpf-description"}
                />
              </FormControl>
              <FormDescription id="cpf-description">
                Digite apenas números
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
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input 
                  placeholder="(00) 00000-0000" 
                  {...field}
                  type="tel"
                  aria-describedby="phone-description"
                />
              </FormControl>
              <FormDescription id="phone-description">
                Formato: (00) 00000-0000
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
              <FormLabel>Gênero</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                aria-describedby="gender-description"
              >
                <FormControl>
                  <SelectTrigger>
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