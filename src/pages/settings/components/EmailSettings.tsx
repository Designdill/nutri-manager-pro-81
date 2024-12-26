import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Mail, HelpCircle, Server, User, Calendar, Clock } from "lucide-react";
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
                <p>Configure suas preferências de email e serviço de envio</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardDescription>
          Configure suas preferências de email e método de envio
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="service" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="service">Serviço</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="preferences">Preferências</TabsTrigger>
          </TabsList>
          
          <TabsContent value="service" className="space-y-4">
            <FormField
              control={form.control}
              name="email_service"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Serviço de Email</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-1 gap-4"
                    >
                      <div className="flex items-center space-x-2 rounded-lg border p-4">
                        <RadioGroupItem value="resend" id="resend" />
                        <label htmlFor="resend" className="flex flex-col">
                          <span className="font-medium">Resend</span>
                          <span className="text-sm text-muted-foreground">
                            Use o serviço Resend para envio de emails
                          </span>
                        </label>
                      </div>
                      <div className="flex items-center space-x-2 rounded-lg border p-4">
                        <RadioGroupItem value="smtp" id="smtp" />
                        <label htmlFor="smtp" className="flex flex-col">
                          <span className="font-medium">SMTP Próprio</span>
                          <span className="text-sm text-muted-foreground">
                            Use seu próprio servidor SMTP
                          </span>
                        </label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            {form.watch("email_service") === "resend" && (
              <FormField
                control={form.control}
                name="resend_api_key"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API Key do Resend</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormDescription>
                      Insira sua chave de API do Resend
                    </FormDescription>
                  </FormItem>
                )}
              />
            )}

            {form.watch("email_service") === "smtp" && (
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
                        <FormDescription>
                          Ative para usar conexão segura
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
              </div>
            )}
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
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