import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Mail, HelpCircle } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormValues } from "../types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

interface EmailSettingsProps {
  form: UseFormReturn<SettingsFormValues>;
}

export function EmailSettings({ form }: EmailSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <CardTitle>Configurações de Email</CardTitle>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Gerencie suas preferências de email e templates</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardDescription>
          Configure suas preferências de email e templates de mensagem
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="notifications" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="preferences">Preferências</TabsTrigger>
          </TabsList>
          
          <TabsContent value="notifications" className="space-y-4">
            <FormField
              control={form.control}
              name="appointment_reminder_emails"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Lembretes de Consulta</FormLabel>
                    <FormDescription>
                      Enviar lembretes automáticos de consultas
                    </FormDescription>
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
            
            <FormField
              control={form.control}
              name="progress_report_emails"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Relatórios de Progresso</FormLabel>
                    <FormDescription>
                      Enviar relatórios mensais de progresso
                    </FormDescription>
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

            <FormField
              control={form.control}
              name="newsletter_emails"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Boletim Informativo</FormLabel>
                    <FormDescription>
                      Receber dicas nutricionais e atualizações
                    </FormDescription>
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
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <FormField
              control={form.control}
              name="appointment_reminder_template"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Template de Lembrete de Consulta</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Olá {nome}, sua consulta está agendada para {data} às {hora}."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Use {nome}, {data}, e {hora} como variáveis substituíveis
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
                      placeholder="Relatório de Progresso - {mês}/{ano}..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="preferences" className="space-y-4">
            <FormField
              control={form.control}
              name="email_frequency"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Frequência de Emails</FormLabel>
                    <FormDescription>
                      Defina a frequência de envio de emails
                    </FormDescription>
                  </div>
                  <FormControl>
                    <select
                      className="form-select rounded-md border"
                      {...field}
                    >
                      <option value="daily">Diário</option>
                      <option value="weekly">Semanal</option>
                      <option value="monthly">Mensal</option>
                    </select>
                  </FormControl>
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}