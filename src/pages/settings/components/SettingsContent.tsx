import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormValues } from "../types";
import { ProfileSettings } from "./ProfileSettings";
import { AppearanceSettings } from "./AppearanceSettings";
import { NotificationSettings } from "./NotificationSettings";
import { EmailSettings } from "./EmailSettings";
import { IntegrationSettings } from "./IntegrationSettings";
import { AccountSettings } from "./AccountSettings";
import { BackupSettings } from "./BackupSettings";

interface SettingsContentProps {
  form: UseFormReturn<SettingsFormValues>;
  onSubmit: (data: SettingsFormValues) => Promise<void>;
  isLoading: boolean;
}

export function SettingsContent({ form, onSubmit, isLoading }: SettingsContentProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="appearance">Aparência</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="integrations">Integrações</TabsTrigger>
            <TabsTrigger value="account">Conta</TabsTrigger>
            <TabsTrigger value="backup">Backup</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileSettings form={form} />
          </TabsContent>

          <TabsContent value="appearance">
            <AppearanceSettings form={form} />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationSettings form={form} />
          </TabsContent>

          <TabsContent value="email">
            <EmailSettings form={form} />
          </TabsContent>

          <TabsContent value="integrations">
            <IntegrationSettings form={form} />
          </TabsContent>

          <TabsContent value="account">
            <AccountSettings form={form} />
          </TabsContent>

          <TabsContent value="backup">
            <BackupSettings />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            Salvar Alterações
          </Button>
        </div>
      </form>
    </Form>
  );
}