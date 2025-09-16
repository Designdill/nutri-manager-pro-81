import { useState } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormValues } from "../types";
import { ProfileSettings } from "./ProfileSettings";
import { AppearanceSettings } from "./AppearanceSettings";
import { NotificationSettings } from "./NotificationSettings";
import { EmailSettings } from "./EmailSettings";
import { IntegrationSettings } from "./IntegrationSettings";
import { AccountSettings } from "./AccountSettings";
import { BackupSettings } from "./BackupSettings";
import { AdvancedThemeEditor } from "./AdvancedThemeEditor";
import { Star, User, Palette, Bell, Mail, Link, Shield, Database } from "lucide-react";
import { useSettingsFavorites } from "../hooks/useSettingsFavorites";
import { cn } from "@/lib/utils";

interface SettingsContentProps {
  form: UseFormReturn<SettingsFormValues>;
  onSubmit: (data: SettingsFormValues) => Promise<void>;
  isLoading: boolean;
  viewMode: "compact" | "detailed";
  showFavorites: boolean;
}

const TABS_CONFIG = [
  { id: "profile", label: "Perfil", icon: User, component: ProfileSettings, description: "Informações pessoais e contato" },
  { id: "appearance", label: "Aparência", icon: Palette, component: AppearanceSettings, description: "Tema, cores e personalização visual" },
  { id: "notifications", label: "Notificações", icon: Bell, component: NotificationSettings, description: "Preferências de notificações" },
  { id: "email", label: "Email", icon: Mail, component: EmailSettings, description: "Configurações de email e templates" },
  { id: "integrations", label: "Integrações", icon: Link, component: IntegrationSettings, description: "APIs e serviços externos" },
  { id: "account", label: "Conta", icon: Shield, component: AccountSettings, description: "Status da conta e segurança" },
  { id: "backup", label: "Backup", icon: Database, component: BackupSettings, description: "Backup e restauração de dados" },
];

export function SettingsContent({ form, onSubmit, isLoading, viewMode, showFavorites }: SettingsContentProps) {
  const [activeTab, setActiveTab] = useState("profile");
  const { favorites, toggleFavorite, isFavorite } = useSettingsFavorites();

  const filteredTabs = showFavorites 
    ? TABS_CONFIG.filter(tab => isFavorite(tab.id))
    : TABS_CONFIG;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={cn(
            "grid w-full",
            viewMode === "compact" ? "grid-cols-4 lg:grid-cols-7" : "grid-cols-1 lg:grid-cols-7 gap-2"
          )}>
            {filteredTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className={cn(
                    "relative group",
                    viewMode === "detailed" && "flex items-center justify-start gap-3 h-auto p-3"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span className={cn(
                      viewMode === "compact" && "hidden lg:inline"
                    )}>
                      {tab.label}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "absolute -top-1 -right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity",
                        isFavorite(tab.id) && "opacity-100"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(tab.id);
                      }}
                    >
                      <Star className={cn(
                        "h-3 w-3",
                        isFavorite(tab.id) && "fill-yellow-400 text-yellow-400"
                      )} />
                    </Button>
                  </div>
                  {viewMode === "detailed" && (
                    <div className="text-xs text-muted-foreground text-left hidden lg:block">
                      {tab.description}
                    </div>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {filteredTabs.map((tab) => {
            const Component = tab.component;
            return (
              <TabsContent key={tab.id} value={tab.id}>
                {tab.id === "appearance" ? (
                  <div className="space-y-6">
                    <Component form={form} />
                    <AdvancedThemeEditor form={form} />
                  </div>
                 ) : tab.id === "backup" ? (
                   <BackupSettings />
                 ) : (
                   <Component form={form} />
                 )}
              </TabsContent>
            );
          })}
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