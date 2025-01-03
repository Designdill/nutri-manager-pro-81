import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormValues } from "../types/settings-form";
import { ProfileSettings } from "./ProfileSettings";
import { AppearanceSettings } from "./AppearanceSettings";
import { NotificationSettings } from "./NotificationSettings";
import { IntegrationSettings } from "./IntegrationSettings";
import { EmailSettings } from "./EmailSettings";
import { AccountSettings } from "./AccountSettings";
import { BackupSettings } from "./BackupSettings";

interface SettingsFormProps {
  form: UseFormReturn<SettingsFormValues>;
  onSubmit: (data: SettingsFormValues) => Promise<void>;
  isLoading: boolean;
  searchQuery: string;
}

export function SettingsForm({ form, onSubmit, isLoading, searchQuery }: SettingsFormProps) {
  const components = [
    { id: "profile", component: <ProfileSettings form={form} />, keywords: ["perfil", "nome", "telefone", "endereço", "foto"] },
    { id: "appearance", component: <AppearanceSettings form={form} />, keywords: ["aparência", "tema", "idioma", "modo noturno", "cores"] },
    { id: "notifications", component: <NotificationSettings form={form} />, keywords: ["notificações", "email", "push"] },
    { id: "email", component: <EmailSettings form={form} />, keywords: ["email", "templates", "mensagens", "assinatura", "filtros"] },
    { id: "integrations", component: <IntegrationSettings form={form} />, keywords: ["integrações", "api", "calendar", "saúde"] },
    { id: "account", component: <AccountSettings form={form} />, keywords: ["conta", "ativo"] },
    { id: "backup", component: <BackupSettings />, keywords: ["backup", "restauração", "exportar", "importar", "nuvem"] },
  ];

  const filteredComponents = components.filter(({ keywords }) =>
    keywords.some(keyword => keyword.includes(searchQuery))
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {filteredComponents.map(({ id, component }) => (
          <div key={id}>{component}</div>
        ))}

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            Salvar Alterações
          </Button>
        </div>
      </form>
    </Form>
  );
}