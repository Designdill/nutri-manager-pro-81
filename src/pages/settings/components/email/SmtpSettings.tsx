import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormValues } from "../../types";

interface SmtpSettingsProps {
  form: UseFormReturn<SettingsFormValues>;
}

export function SmtpSettings({ form }: SmtpSettingsProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="smtp_host"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Servidor SMTP</FormLabel>
            <FormControl>
              <Input placeholder="smtp.seudominio.com" {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="smtp_port"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Porta SMTP</FormLabel>
            <FormControl>
              <Input type="number" placeholder="587" {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="smtp_user"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Usuário SMTP</FormLabel>
            <FormControl>
              <Input placeholder="seu@email.com" {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="smtp_password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Senha SMTP</FormLabel>
            <FormControl>
              <Input type="password" {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="smtp_secure"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel>Usar SSL/TLS</FormLabel>
              <div className="text-sm text-muted-foreground">
                Ative para usar conexão segura
              </div>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}