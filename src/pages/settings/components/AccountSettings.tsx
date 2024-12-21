import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Tooltip } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormValues } from "../types";

interface AccountSettingsProps {
  form: UseFormReturn<SettingsFormValues>;
}

export function AccountSettings({ form }: AccountSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Conta</CardTitle>
          <Tooltip content="Gerencie as configurações da sua conta">
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </Tooltip>
        </div>
        <CardDescription>
          Gerencie as configurações da sua conta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="account_active"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Conta Ativa</FormLabel>
                <FormDescription>
                  Desative sua conta temporariamente
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
      </CardContent>
    </Card>
  );
}