import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormValues } from "../../types";
import { User, Calendar, Clock } from "lucide-react";

interface EmailTemplatesProps {
  form: UseFormReturn<SettingsFormValues>;
}

export function EmailTemplates({ form }: EmailTemplatesProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="appointment_reminder_template"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Template de Lembrete de Consulta</FormLabel>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" /> {'{nome}'}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" /> {'{data}'}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" /> {'{hora}'}
              </span>
            </div>
            <FormControl>
              <Textarea
                placeholder="Olá {nome}, sua consulta está agendada para {data} às {hora}."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Use {'{nome}'}, {'{data}'}, e {'{hora}'} como variáveis substituíveis
            </FormDescription>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="progress_report_template"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Template de Relatório de Progresso</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Relatório de Progresso - {mes}/{ano}..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}