import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormValues } from "../types";
import { NutritionalAPIs } from "./integrations/NutritionalAPIs";
import { HealthApps } from "./integrations/HealthApps";
import { MealSystems } from "./integrations/MealSystems";

interface IntegrationSettingsProps {
  form: UseFormReturn<SettingsFormValues>;
}

export function IntegrationSettings({ form }: IntegrationSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Integrações</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Gerencie suas integrações com serviços externos</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardDescription>
          Gerencie suas integrações com serviços externos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <NutritionalAPIs form={form} />
        <HealthApps form={form} />
        <MealSystems form={form} />
      </CardContent>
    </Card>
  );
}