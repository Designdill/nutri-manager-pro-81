import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormValues } from "../types";

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
        {/* APIs de Dados Nutricionais */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">APIs de Dados Nutricionais</h3>
          
          <FormField
            control={form.control}
            name="open_food_facts_api_key"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chave API Open Food Facts</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormDescription>
                  Necessária para buscar informações nutricionais detalhadas
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="usda_fooddata_api_key"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chave API USDA FoodData Central</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormDescription>
                  Para acesso à base de dados nutricional do USDA
                </FormDescription>
              </FormItem>
            )}
          />
        </div>

        {/* Aplicativos de Saúde */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Aplicativos de Saúde</h3>
          
          <FormField
            control={form.control}
            name="google_fit_connected"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Google Fit</FormLabel>
                  <FormDescription>
                    Sincronize dados de atividade física
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
            name="apple_health_connected"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Apple Health</FormLabel>
                  <FormDescription>
                    Sincronize dados de saúde e atividades
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

        {/* Sistemas de Refeições */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Sistemas de Refeições</h3>
          
          <FormField
            control={form.control}
            name="meal_delivery_connected"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Entrega de Refeições</FormLabel>
                  <FormDescription>
                    Conecte com serviços de entrega de refeições
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
            name="recipe_planning_connected"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Planejamento de Receitas</FormLabel>
                  <FormDescription>
                    Integre com sistemas de planejamento de receitas
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
      </CardContent>
    </Card>
  );
}