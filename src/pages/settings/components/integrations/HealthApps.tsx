import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormValues } from "../../types";
import { useIntegrationToggle } from "./useIntegrationToggle";

interface HealthAppsProps {
  form: UseFormReturn<SettingsFormValues>;
}

export function HealthApps({ form }: HealthAppsProps) {
  const handleIntegrationToggle = useIntegrationToggle();

  return (
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
                onCheckedChange={(checked) => {
                  field.onChange(checked);
                  handleIntegrationToggle(checked, 'Google Fit');
                }}
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
                onCheckedChange={(checked) => {
                  field.onChange(checked);
                  handleIntegrationToggle(checked, 'Apple Health');
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}