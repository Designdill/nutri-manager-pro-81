import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormValues } from "../types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Mail, HelpCircle } from "lucide-react";
import { EmailServiceSelector } from "./email/EmailServiceSelector";
import { ResendSettings } from "./email/ResendSettings";
import { SmtpSettings } from "./email/SmtpSettings";
import { EmailTemplates } from "./email/EmailTemplates";

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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="service">Serviço</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="service" className="space-y-4">
            <EmailServiceSelector form={form} />
            {form.watch("email_service") === "resend" && <ResendSettings form={form} />}
            {form.watch("email_service") === "smtp" && <SmtpSettings form={form} />}
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <EmailTemplates form={form} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}